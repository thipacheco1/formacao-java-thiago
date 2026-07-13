# 545 - M17.40 - Deploy em ambiente simples

## Apresentação da aula

Na aula 544, você consolidou a segurança cloud antes de qualquer implantação externa.

A arquitetura passou a possuir:

```text
inventário de ativos;

owners;

classificação de dados;

threat model;

trust boundaries;

federation;

MFA;

OIDC;

least privilege;

segmentação de rede;

proteção de Secrets;

hardening de workloads;

SBOM;

provenance;

logging;

backup;

incident response.
```

A regra construída foi:

```text
deploy só acontece
quando os controles mínimos
estão verificáveis.
```

Agora a formação entra em uma etapa prática importante.

Você irá realizar um deploy controlado em um ambiente simples.

Esse ambiente não será uma cloud pública real.

Ele será um ambiente Kubernetes local e isolado, adequado para treinar o processo completo sem:

- conta de provedor;
- cobrança;
- domínio público;
- certificado externo;
- credenciais permanentes;
- banco RDS real;
- SQS real;
- Redis real;
- bucket S3 real;
- infraestrutura produtiva.

A pergunta central desta aula será:

```text
como transformar
manifests,
imagem,
configuração
e controles

em um deploy
repetível,
observável
e reversível?
```

A resposta será construída em etapas.

O deploy precisa responder:

```text
qual versão será implantada?

em qual ambiente?

com qual configuração?

quem autorizou?

quais gates passaram?

como validar?

como detectar falha?

como voltar?
```

A regra central será:

```text
deploy não termina
quando o comando retorna sucesso;

deploy termina
quando a aplicação
está saudável,
validada
e observável.
```

O laboratório continuará usando a aplicação `orders-api`.

O ambiente simples será criado em namespace separado:

```text
formacao-java-simple
```

Esse namespace permitirá:

- isolamento do ambiente atual;
- implantação reproduzível;
- configuração própria;
- Service próprio;
- Ingress opcional local;
- validação de rollout;
- smoke test;
- rollback;
- cleanup seguro.

A imagem será referenciada por uma tag didática ou digest local conhecido.

Em um ambiente profissional, o padrão preferido é:

```text
imagem imutável
por digest.
```

Nesta aula, o material irá preparar a estrutura para digest sem exigir um registry externo.

Você também irá registrar:

- release candidate;
- change record;
- deploy plan;
- rollback plan;
- smoke test;
- evidence;
- decision summary.

A próxima aula será:

```text
546 - M17.41 - Projeto API pronta para deploy parte 1
```

Por isso, esta aula não iniciará a construção completa do projeto final.

Ela ensinará o procedimento operacional de deploy que será reutilizado no projeto.

Nenhum ambiente cloud, domínio público, certificado real, pipeline remoto ou recurso de produção será criado antecipadamente.

---

## Onde estamos na formação

A sequência oficial é:

```text
543:
Custos cloud.

544:
Observacoes de seguranca cloud.

545:
Deploy em ambiente simples.

546:
Projeto API pronta para deploy parte 1.

547:
Projeto API pronta para deploy parte 2.
```

A aula 544 respondeu:

```text
quais controles
precisam existir
antes do deploy?
```

A aula 545 responderá:

```text
como executar
um deploy simples

com segurança,
validação
e rollback?
```

Nesta aula:

```text
namespace isolado:
sim.

release candidate:
sim.

deploy plan:
sim.

change record:
sim.

ConfigMap:
sim.

Secret local:
sim.

Deployment:
sim.

Service:
sim.

Ingress local:
opcional.

probes:
sim.

requests e limits:
sim.

rollout:
sim.

smoke test:
sim.

rollback:
sim.

evidence:
sim.

cleanup:
sim.

cloud real:
não.

pipeline remoto:
não.

projeto final:
não.
```

A regra operacional será:

```text
preparar;

validar;

implantar;

observar;

testar;

decidir;

registrar;

reverter
quando necessário.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
k8s/simple-environment
├── namespace.yaml
├── configmap.yaml
├── secret.template.yaml
├── deployment.yaml
├── service.yaml
├── ingress.yaml
├── kustomization.yaml
└── release-metadata.yaml

scripts/deploy/simple
├── preflight-simple-deploy.ps1
├── build-release-metadata.ps1
├── validate-simple-manifests.ps1
├── deploy-simple-environment.ps1
├── wait-simple-rollout.ps1
├── smoke-test-simple-environment.ps1
├── verify-simple-observability.ps1
├── simulate-simple-deploy-failure.ps1
├── rollback-simple-environment.ps1
├── collect-simple-deploy-evidence.ps1
├── cleanup-simple-environment.ps1
└── verify-simple-baseline.ps1

docs/devops/simple-deploy
├── SIMPLE_DEPLOY_ARCHITECTURE.md
├── SIMPLE_DEPLOY_PLAN.md
├── SIMPLE_CHANGE_RECORD.md
├── SIMPLE_RELEASE_CHECKLIST.md
├── SIMPLE_SMOKE_TEST.md
├── SIMPLE_ROLLBACK_PLAN.md
├── SIMPLE_DEPLOY_EVIDENCE.md
├── SIMPLE_DEPLOY_TEST_MATRIX.md
└── SIMPLE_DEPLOY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
ambiente isolado;

manifests validados;

configuração externa;

Secret sem valor real;

release identificável;

rollout acompanhado;

smoke test;

falha simulada;

rollback comprovado;

evidência sanitizada;

cleanup controlado.
```

Você irá:

1. confirmar a baseline;
2. definir o ambiente;
3. definir o release candidate;
4. criar metadata da release;
5. criar namespace;
6. criar ConfigMap;
7. criar template de Secret;
8. criar Deployment;
9. criar Service;
10. criar Ingress local;
11. criar Kustomization;
12. criar preflight;
13. validar manifests;
14. validar imagem;
15. validar configuração;
16. aplicar namespace;
17. aplicar resources;
18. acompanhar rollout;
19. validar Pods;
20. validar Service;
21. executar smoke test;
22. verificar logs;
23. verificar eventos;
24. coletar evidence;
25. simular falha;
26. executar rollback;
27. validar recuperação;
28. restaurar release saudável;
29. executar cleanup opcional;
30. validar baseline;
31. commitar;
32. preparar a aula 546.

---

## Conceito essencial

### Deploy

Processo de disponibilizar uma versão executável em um ambiente.

---

### Release

Conjunto identificado de artifact, configuração, manifests e decisões.

---

### Release candidate

Versão candidata a ser promovida após passar pelos gates.

---

### Rollout

Atualização progressiva dos Pods controlada pelo Deployment.

---

### Rollback

Retorno para uma revisão anterior considerada segura.

---

### Smoke test

Conjunto pequeno de testes que confirma que o fluxo essencial está funcionando.

---

### Preflight

Validações executadas antes de alterar o ambiente.

---

### Change record

Registro do que será alterado, motivo, risco, responsável e rollback.

---

### Evidence

Provas técnicas sanitizadas de que o procedimento foi executado e validado.

---

### Immutable artifact

Artifact que não muda depois de publicado.

---

### Desired state

Estado declarado pelos manifests.

---

## Mão na massa guiada

### 1. Confirmar a baseline atual

Execute:

```powershell
kubectl get namespace

kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

kubectl get events `
  --namespace `
  formacao-java-dev `
  --sort-by=.metadata.creationTimestamp
```

Confirme:

- cluster acessível;
- namespace atual saudável;
- imagem conhecida;
- Deployment disponível;
- Service com endpoints;
- Ingress local funcional;
- HPA sem erro;
- nenhum evento crítico pendente.

O novo ambiente não deve prejudicar o ambiente atual.

---

### 2. Definir o ambiente simples

O namespace será:

```text
formacao-java-simple
```

Objetivos:

- ambiente descartável;
- configuração própria;
- duas réplicas;
- Service ClusterIP;
- Ingress local opcional;
- probes;
- resources;
- rollout controlado;
- sem dependências AWS reais.

O ambiente não representa produção.

Ele representa um estágio de validação operacional.

---

### 3. Criar o namespace

Arquivo:

```text
k8s/simple-environment/namespace.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: formacao-java-simple
  labels:
    app.kubernetes.io/part-of: orders-platform
    app.kubernetes.io/environment: simple
    app.kubernetes.io/managed-by: kubectl
    security.formacao-java/data-classification: internal
```

Nenhuma credencial entra em labels ou annotations.

---

### 4. Definir o release candidate

O release candidate precisa identificar:

- commit;
- image reference;
- image digest quando disponível;
- environment;
- manifests version;
- configuration version;
- executor;
- timestamp;
- change record;
- rollback target.

Exemplo:

```text
release:
orders-api-simple-001.
```

Não reutilize o mesmo identificador para releases diferentes.

---

### 5. Criar metadata da release

Arquivo:

```text
k8s/simple-environment/release-metadata.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: orders-api-release-metadata
  namespace: formacao-java-simple
data:
  release-id: "orders-api-simple-001"
  environment: "simple"
  source-commit: "__SOURCE_COMMIT__"
  image-reference: "__IMAGE_REFERENCE__"
  deployment-strategy: "RollingUpdate"
  change-record: "SIMPLE-DEPLOY-001"
```

Antes do apply, o script substitui apenas placeholders permitidos.

O arquivo aplicado não pode conter:

- token;
- senha;
- account ID;
- dado pessoal;
- endpoint privado sensível.

---

### 6. Criar ConfigMap da aplicação

Arquivo:

```text
k8s/simple-environment/configmap.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: orders-api-config
  namespace: formacao-java-simple
data:
  SPRING_PROFILES_ACTIVE: "simple"
  SERVER_PORT: "8080"
  MANAGEMENT_ENDPOINT_HEALTH_PROBES_ENABLED: "true"
  APP_ENVIRONMENT: "simple"
  LOGGING_LEVEL_ROOT: "INFO"
  AWS_MESSAGING_ENABLED: "false"
  AWS_CACHE_ENABLED: "false"
  AWS_S3_ENABLED: "false"
```

ConfigMap contém apenas configuração não sensível.

---

### 7. Criar template de Secret

Arquivo:

```text
k8s/simple-environment/secret.template.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: orders-api-secret
  namespace: formacao-java-simple
type: Opaque
stringData:
  DB_USERNAME: "LOCAL_ONLY"
  DB_PASSWORD: "LOCAL_ONLY"
```

Esse arquivo é template didático.

Ele não deve ser aplicado diretamente em um ambiente real.

Para o laboratório local, o script cria um Secret efêmero com valores fictícios, fora do Git.

O arquivo efetivo gerado precisa estar no `.gitignore`.

Nunca use:

- senha corporativa;
- senha pessoal;
- token;
- access key;
- credencial reutilizada.

---

### 8. Definir a imagem

A imagem precisa ser conhecida e verificável.

Opções locais:

- imagem já construída no Docker;
- imagem carregada no kind;
- registry local;
- referência preparada pela aula anterior.

Exemplo conceitual:

```text
orders-api:local-545.
```

Em kind:

```powershell
kind load docker-image `
  orders-api:local-545 `
  --name `
  formacao-java
```

Adapte o nome do cluster somente quando ele já estiver definido no laboratório.

Em ambiente real, use digest.

---

### 9. Criar o Deployment

Arquivo:

```text
k8s/simple-environment/deployment.yaml
```

Conteúdo:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
  namespace: formacao-java-simple
  labels:
    app.kubernetes.io/name: orders-api
    app.kubernetes.io/environment: simple
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
      app.kubernetes.io/environment: simple

  template:
    metadata:
      labels:
        app.kubernetes.io/name: orders-api
        app.kubernetes.io/environment: simple
    spec:
      automountServiceAccountToken: false

      containers:
        - name: orders-api
          image: orders-api:local-545
          imagePullPolicy: IfNotPresent

          ports:
            - name: http
              containerPort: 8080
              protocol: TCP

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
            runAsNonRoot: true
            readOnlyRootFilesystem: false
```

Se a imagem ainda não suporta filesystem read-only, registre a decisão.

Não marque `readOnlyRootFilesystem: true` sem validar escrita temporária da JVM e da aplicação.

---

### 10. Criar o Service

Arquivo:

```text
k8s/simple-environment/service.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: orders-api
  namespace: formacao-java-simple
spec:
  type: ClusterIP

  selector:
    app.kubernetes.io/name: orders-api
    app.kubernetes.io/environment: simple

  ports:
    - name: http
      port: 80
      targetPort: http
      protocol: TCP
```

O Service não fica público diretamente.

---

### 11. Criar o Ingress local

Arquivo:

```text
k8s/simple-environment/ingress.yaml
```

Conteúdo:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: orders-api
  namespace: formacao-java-simple
spec:
  ingressClassName: nginx

  rules:
    - host: orders-simple.local
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

Esse host é local.

Nenhum DNS público será configurado.

Quando o Ingress Controller não estiver disponível, use port-forward para o smoke test.

---

### 12. Criar Kustomization

Arquivo:

```text
k8s/simple-environment/kustomization.yaml
```

Conteúdo:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - namespace.yaml
  - configmap.yaml
  - release-metadata.yaml
  - deployment.yaml
  - service.yaml
  - ingress.yaml

commonLabels:
  app.kubernetes.io/managed-by: kustomize
```

O Secret efêmero será criado pelo script e não entrará no Kustomization versionado.

---

### 13. Criar o change record

Arquivo:

```text
docs/devops/simple-deploy/SIMPLE_CHANGE_RECORD.md
```

Registre:

- change ID;
- objetivo;
- ambiente;
- release ID;
- commit;
- image;
- impacto;
- dependências;
- risco;
- preflight;
- executor;
- janela;
- smoke test;
- rollback trigger;
- rollback target;
- evidence.

Nenhum campo pode ficar como placeholder no registro final.

---

### 14. Criar o deploy plan

Arquivo:

```text
SIMPLE_DEPLOY_PLAN.md
```

Fases:

```text
1.
preflight.

2.
render.

3.
validate.

4.
create namespace.

5.
create ephemeral Secret.

6.
apply resources.

7.
wait rollout.

8.
validate Service.

9.
smoke test.

10.
observe.

11.
collect evidence.

12.
approve or rollback.
```

---

### 15. Criar o preflight

Script:

```text
preflight-simple-deploy.ps1
```

O preflight valida:

- `kubectl` disponível;
- contexto esperado;
- cluster acessível;
- namespace de origem saudável;
- namespace de destino conhecido;
- manifests presentes;
- imagem local disponível;
- Secret real ausente do Git;
- placeholders resolvidos;
- fences e YAML válidos;
- resources definidos;
- probes definidas;
- rollback plan existente;
- change record existente;
- Git status conhecido.

O script não faz apply.

---

### 16. Validar o contexto

Antes do deploy:

```powershell
kubectl config current-context

kubectl cluster-info
```

O script precisa comparar o contexto com uma allowlist local.

Nunca execute automaticamente contra um contexto desconhecido.

Uma proteção simples:

```text
context mismatch
→ deploy bloqueado.
```

---

### 17. Validar manifests client-side

Execute:

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  k8s/simple-environment
```

Depois:

```powershell
kubectl kustomize `
  k8s/simple-environment
```

O output renderizado precisa ser inspecionado.

---

### 18. Validar manifests server-side

Quando o cluster suportar:

```powershell
kubectl apply `
  --server-side `
  --dry-run=server `
  --filename `
  k8s/simple-environment
```

Isso valida o schema conhecido pelo API Server.

O dry-run não comprova que a aplicação iniciará.

---

### 19. Validar segurança dos manifests

Execute:

```powershell
.\scripts\cloud\security\scan-cloud-manifests.ps1
```

Confirme:

- sem privileged;
- sem hostPath;
- sem hostNetwork;
- sem token automático;
- sem latest tag;
- sem Secret literal real;
- sem Service público;
- resources presentes;
- probes presentes;
- namespace explícito.

---

### 20. Construir release metadata

Script:

```text
build-release-metadata.ps1
```

Entradas:

- release ID;
- commit;
- image;
- environment;
- timestamp.

Saída:

```text
release-metadata.rendered.yaml
```

Esse arquivo pode ser gerado em diretório temporário.

Ele não deve sobrescrever silenciosamente a fonte.

---

### 21. Criar o Secret efêmero

Exemplo local:

```powershell
kubectl create secret generic `
  orders-api-secret `
  --namespace `
  formacao-java-simple `
  --from-literal=DB_USERNAME=local_user `
  --from-literal=DB_PASSWORD=local_password `
  --dry-run=client `
  --output=yaml `
  | kubectl apply `
      --filename -
```

Os valores são fictícios e exclusivos do laboratório.

Evite registrar o comando completo no terminal compartilhado.

Uma alternativa é ler valores de variáveis temporárias.

---

### 22. Aplicar namespace

Execute:

```powershell
kubectl apply `
  --filename `
  k8s/simple-environment/namespace.yaml
```

Valide:

```powershell
kubectl get namespace `
  formacao-java-simple `
  --show-labels
```

---

### 23. Aplicar os resources

Execute:

```powershell
kubectl apply `
  --filename `
  k8s/simple-environment/configmap.yaml

kubectl apply `
  --filename `
  release-metadata.rendered.yaml

kubectl apply `
  --filename `
  k8s/simple-environment/deployment.yaml

kubectl apply `
  --filename `
  k8s/simple-environment/service.yaml

kubectl apply `
  --filename `
  k8s/simple-environment/ingress.yaml
```

Ou use o script:

```powershell
.\scripts\deploy\simple\deploy-simple-environment.ps1
```

O script precisa parar no primeiro erro.

---

### 24. Acompanhar o rollout

Execute:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-simple `
  --timeout=180s
```

Valide:

```powershell
kubectl get deployment,replicaset,pod `
  --namespace `
  formacao-java-simple `
  --output=wide
```

O rollout só é aceito quando:

- réplicas desejadas disponíveis;
- nenhuma réplica indisponível;
- Pods `Ready`;
- probes passando;
- nenhuma reinicialização anormal.

---

### 25. Inspecionar a revisão

Execute:

```powershell
kubectl rollout history `
  deployment/orders-api `
  --namespace `
  formacao-java-simple
```

Registre:

- revision;
- image;
- release ID;
- timestamp;
- change ID.

Annotations podem registrar change cause quando o fluxo decidir utilizá-las.

---

### 26. Validar Service e endpoints

Execute:

```powershell
kubectl get service,endpointslice `
  --namespace `
  formacao-java-simple
```

Confirme que o Service possui endpoints correspondentes aos Pods `Ready`.

Service sem EndpointSlice válido não atende tráfego.

---

### 27. Executar smoke test por port-forward

Abra:

```powershell
kubectl port-forward `
  service/orders-api `
  18080:80 `
  --namespace `
  formacao-java-simple
```

Em outro terminal:

```powershell
Invoke-RestMethod `
  -Uri `
  http://localhost:18080/actuator/health

Invoke-RestMethod `
  -Uri `
  http://localhost:18080/actuator/health/readiness

Invoke-RestMethod `
  -Uri `
  http://localhost:18080/actuator/health/liveness
```

O smoke test precisa validar também um endpoint funcional da API quando disponível.

Exemplo conceitual:

```powershell
Invoke-WebRequest `
  -Uri `
  http://localhost:18080/api/orders `
  -Method `
  Get
```

Use o endpoint real existente no laboratório.

Não invente contrato inexistente.

---

### 28. Validar Ingress local

Quando o Ingress estiver disponível:

```powershell
kubectl get ingress `
  --namespace `
  formacao-java-simple

curl.exe `
  --header `
  "Host: orders-simple.local" `
  http://127.0.0.1/actuator/health
```

Adapte o endereço ao Ingress Controller local.

O port-forward continua sendo o caminho de fallback.

---

### 29. Validar logs

Execute:

```powershell
kubectl logs `
  deployment/orders-api `
  --namespace `
  formacao-java-simple `
  --tail=100
```

Procure:

- startup concluído;
- profile correto;
- porta correta;
- nenhum Secret;
- nenhuma stack trace crítica;
- nenhuma conexão AWS;
- nenhuma migration inesperada;
- nenhum retry infinito.

Não copie logs sensíveis para evidence.

---

### 30. Validar eventos

Execute:

```powershell
kubectl get events `
  --namespace `
  formacao-java-simple `
  --sort-by=.metadata.creationTimestamp
```

Procure:

- FailedScheduling;
- FailedMount;
- BackOff;
- Unhealthy;
- ImagePullBackOff;
- OOMKilled;
- probe failure;
- policy denial.

Eventos informativos são esperados.

Eventos críticos precisam de análise.

---

### 31. Validar recursos

Execute:

```powershell
kubectl top pod `
  --namespace `
  formacao-java-simple
```

Quando Metrics Server estiver disponível.

Compare com requests e limits.

Não faça rightsizing definitivo com poucos minutos de observação.

---

### 32. Criar o smoke test automatizado

Script:

```text
smoke-test-simple-environment.ps1
```

O script valida:

- namespace;
- Deployment disponível;
- Pods Ready;
- Service;
- endpoints;
- health;
- readiness;
- liveness;
- endpoint funcional;
- release metadata;
- response time básica;
- ausência de resposta `5xx`.

Ele não deve imprimir Secrets.

---

### 33. Definir critérios de aprovação

A release será aprovada quando:

```text
rollout:
success.

Pods:
Ready.

Service:
endpoints válidos.

health:
UP.

smoke:
pass.

logs:
sem erro crítico.

events:
sem bloqueio.

release metadata:
correta.

evidence:
completa.
```

Qualquer controle crítico falho bloqueia aprovação.

---

### 34. Criar plano de rollback

Arquivo:

```text
SIMPLE_ROLLBACK_PLAN.md
```

Inclua:

- triggers;
- revision target;
- comando;
- configuração;
- Secret compatibility;
- database compatibility;
- smoke test;
- evidence;
- owner;
- prazo de decisão.

Triggers:

- rollout timeout;
- Pods não Ready;
- erro `5xx`;
- health `DOWN`;
- reinicialização crescente;
- consumo anormal;
- configuração incorreta;
- risco de segurança;
- regressão funcional.

---

### 35. Simular uma falha de deploy

O script:

```text
simulate-simple-deploy-failure.ps1
```

pode alterar temporariamente a imagem para uma referência inexistente:

```text
orders-api:missing-545.
```

O objetivo é provocar:

```text
ImagePullBackOff.
```

A simulação precisa:

1. registrar a revisão saudável;
2. aplicar a imagem inválida;
3. acompanhar rollout;
4. detectar timeout;
5. coletar eventos;
6. disparar rollback;
7. validar recuperação.

Não use falha destrutiva de dados.

---

### 36. Executar rollback

Comando:

```powershell
kubectl rollout undo `
  deployment/orders-api `
  --namespace `
  formacao-java-simple
```

Depois:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-simple `
  --timeout=180s
```

Confirme:

- imagem anterior;
- réplicas Ready;
- Service com endpoints;
- smoke test aprovado;
- eventos estabilizados;
- release metadata coerente.

---

### 37. Rollback de configuração

`kubectl rollout undo` reverte o template do Deployment.

Ele não reverte automaticamente:

- ConfigMap;
- Secret;
- Service;
- Ingress;
- banco;
- object storage;
- mensagens;
- mudanças externas.

Por isso, o release precisa versionar a configuração.

O rollback plan registra quais manifests precisam ser reaplicados.

---

### 38. Rollback e banco

Uma migration destrutiva pode impedir rollback da aplicação.

A aula 539 definiu expand and contract.

Antes do deploy, confirme:

- schema compatível;
- migration concluída;
- versão anterior ainda funciona;
- nenhuma coluna removida cedo;
- rollback ou roll-forward conhecido.

Nesta aula, nenhuma migration real será executada.

---

### 39. Coletar evidence

Script:

```text
collect-simple-deploy-evidence.ps1
```

Arquivo:

```text
simple-deploy-evidence.json.
```

Campos permitidos:

- context;
- namespace;
- release ID;
- commit abreviado;
- image reference sanitizada;
- revision;
- desired replicas;
- available replicas;
- Pod readiness;
- Service endpoints count;
- health status;
- smoke result;
- rollout duration;
- rollback simulation;
- security scan result;
- timestamp.

Campos proibidos:

- Secret;
- token;
- kubeconfig;
- certificate;
- full logs;
- dados de usuário;
- credencial;
- environment dump.

---

### 40. Criar decision summary

A evidence documental precisa registrar:

```text
release:
approved
ou
rolled-back.

motivo:

gates:

risco residual:

próxima ação:
```

Não marque sucesso apenas porque o apply terminou.

---

### 41. Verificar observabilidade

Script:

```text
verify-simple-observability.ps1
```

Confirme:

- logs acessíveis;
- correlation ID quando aplicável;
- health endpoints;
- eventos;
- restart count;
- resource metrics;
- rollout history;
- release metadata.

O ambiente simples não precisa de uma stack completa de observabilidade.

Ele precisa de sinais suficientes para decidir.

---

### 42. Criar test matrix

Arquivo:

```text
SIMPLE_DEPLOY_TEST_MATRIX.md
```

Cenários:

- contexto permitido;
- contexto desconhecido bloqueado;
- namespace criado;
- ConfigMap aplicada;
- Secret real ausente do Git;
- imagem local disponível;
- manifest inválido bloqueado;
- security scan aprovado;
- Deployment com duas réplicas;
- Pods Ready;
- probes passando;
- Service com endpoints;
- Ingress ou port-forward funcional;
- smoke test aprovado;
- log sem Secret;
- release metadata correta;
- imagem inexistente causa falha;
- rollout timeout detectado;
- rollback recupera;
- ConfigMap incompatível é detectada;
- cleanup preserva namespace de origem;
- cloud resource count permanece zero.

---

### 43. Criar troubleshooting

Arquivo:

```text
SIMPLE_DEPLOY_TROUBLESHOOTING.md
```

Inclua:

- context incorreto;
- namespace ausente;
- image not found;
- ImagePullBackOff;
- CrashLoopBackOff;
- readiness failing;
- liveness restarting;
- startup timeout;
- Service sem endpoints;
- selector incorreto;
- port incorreta;
- Ingress sem controller;
- Secret ausente;
- ConfigMap inválida;
- OOMKilled;
- FailedScheduling;
- rollout timeout;
- rollback incompatível;
- logs com Secret;
- cleanup removendo ambiente errado.

---

### 44. Cleanup opcional

Quando o ambiente simples for descartável:

```powershell
.\scripts\deploy\simple\cleanup-simple-environment.ps1
```

O script precisa:

- validar contexto;
- confirmar namespace exato;
- coletar evidence final;
- remover somente `formacao-java-simple`;
- preservar `formacao-java-dev`;
- validar remoção;
- registrar cleanup.

Comando direto:

```powershell
kubectl delete namespace `
  formacao-java-simple
```

Use apenas quando a evidence e o exercício estiverem concluídos.

---

### 45. Preservar o ambiente para revisão

Também é válido manter o namespace.

Nesse caso, registre:

- owner;
- data de expiração;
- finalidade;
- custo local irrelevante;
- cleanup planejado;
- estado saudável.

Ambientes esquecidos viram drift mesmo em laboratórios.

---

### 46. Criar release checklist

Arquivo:

```text
SIMPLE_RELEASE_CHECKLIST.md
```

Itens:

```text
[ ] contexto validado;

[ ] baseline saudável;

[ ] commit conhecido;

[ ] imagem conhecida;

[ ] manifests validados;

[ ] security scan aprovado;

[ ] Secret fora do Git;

[ ] change record completo;

[ ] rollback plan completo;

[ ] rollout aprovado;

[ ] smoke test aprovado;

[ ] logs e events revisados;

[ ] evidence coletada;

[ ] decisão registrada.
```

---

### 47. Executar o fluxo completo

Execute:

```powershell
.\scripts\deploy\simple\preflight-simple-deploy.ps1

.\scripts\deploy\simple\build-release-metadata.ps1

.\scripts\deploy\simple\validate-simple-manifests.ps1

.\scripts\deploy\simple\deploy-simple-environment.ps1

.\scripts\deploy\simple\wait-simple-rollout.ps1

.\scripts\deploy\simple\smoke-test-simple-environment.ps1

.\scripts\deploy\simple\verify-simple-observability.ps1

.\scripts\deploy\simple\collect-simple-deploy-evidence.ps1
```

Depois, execute a falha controlada:

```powershell
.\scripts\deploy\simple\simulate-simple-deploy-failure.ps1

.\scripts\deploy\simple\rollback-simple-environment.ps1

.\scripts\deploy\simple\smoke-test-simple-environment.ps1
```

Finalize:

```powershell
.\scripts\deploy\simple\verify-simple-baseline.ps1

git diff --check

git status
```

---

## Entendendo o que foi feito

### O deploy ganhou identidade

Release ID, commit, imagem e change record passaram a acompanhar a implantação.

### O ambiente ganhou isolamento

O namespace separado protegeu a baseline existente.

### Configuração ganhou boundary

ConfigMap e Secret foram tratados de formas diferentes.

### O artifact ganhou imutabilidade

A imagem foi identificada antes do apply.

### O rollout ganhou acompanhamento

O status do Deployment passou a ser um gate.

### O Service ganhou validação real

EndpointSlice confirmou que Pods Ready recebiam tráfego.

### O smoke test ganhou papel operacional

Health e endpoint funcional validaram a release.

### A falha ganhou procedimento

O ambiente não dependeu de improviso durante erro.

### O rollback ganhou limites claros

Deployment rollback não reverte automaticamente configuração e dados.

### A evidence ganhou sanitização

A release foi comprovada sem expor Secrets.

---

## Erros comuns importantes

### Aplicar no contexto errado

Sempre valide contexto e namespace.

### Usar `latest`

A imagem deixa de ser identificável.

### Colocar Secret no manifest versionado

O repositório não é cofre.

### Considerar `kubectl apply` como sucesso final

Rollout e smoke test ainda precisam passar.

### Usar liveness para dependência externa

Falha de banco pode causar restart loop.

### Ignorar EndpointSlice

Service pode existir sem target saudável.

### Executar rollback sem verificar configuração

ConfigMap e Secret podem continuar incompatíveis.

### Testar somente `/health`

Valide pelo menos um fluxo funcional real.

### Coletar logs completos como evidence

Eles podem conter dados sensíveis.

### Antecipar o projeto final

A aula 546 possui esse objetivo.

---

## Comandos úteis

### Renderizar manifests

```powershell
kubectl kustomize `
  k8s/simple-environment
```

### Dry-run

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  k8s/simple-environment
```

### Rollout

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-simple
```

### Histórico

```powershell
kubectl rollout history `
  deployment/orders-api `
  --namespace `
  formacao-java-simple
```

### Rollback

```powershell
kubectl rollout undo `
  deployment/orders-api `
  --namespace `
  formacao-java-simple
```

---

## Exercício guiado

### Parte 1 — Preflight

Valide contexto, imagem, manifests e segurança.

### Parte 2 — Environment

Crie namespace e configuração.

### Parte 3 — Release

Gere metadata e change record.

### Parte 4 — Deploy

Aplique Deployment, Service e Ingress.

### Parte 5 — Rollout

Acompanhe réplicas e probes.

### Parte 6 — Smoke

Valide health e endpoint funcional.

### Parte 7 — Observe

Revise logs, events e resources.

### Parte 8 — Failure

Aplique uma imagem inválida.

### Parte 9 — Rollback

Restaure a revisão saudável.

### Parte 10 — Evidence

Registre resultado e decisão.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 544 foi preservada;
- ponte para a aula 546 está correta;
- deploy, release, rollout, rollback, smoke test e preflight foram definidos;
- ambiente simples foi isolado em namespace próprio;
- namespace `formacao-java-simple` foi definido;
- baseline do namespace anterior foi preservada;
- release candidate foi identificado;
- release metadata foi criada;
- commit e imagem foram registrados;
- change record foi criado;
- deploy plan foi criado;
- rollback plan foi criado;
- release checklist foi criado;
- ConfigMap contém somente configuração não sensível;
- Secret template não contém credencial real;
- Secret efetivo fica fora do Git;
- imagem local foi definida;
- digest foi recomendado para ambientes reais;
- Deployment possui duas réplicas;
- RollingUpdate usa `maxUnavailable: 0`;
- revision history foi mantida;
- token automático foi desabilitado;
- startup, readiness e liveness foram configuradas;
- requests e limits foram definidos;
- security context foi definido;
- Service ClusterIP foi criado;
- Ingress local foi criado;
- nenhum DNS público foi configurado;
- Kustomization foi criada;
- preflight não altera o ambiente;
- contexto é validado;
- contexto desconhecido bloqueia o deploy;
- manifests são validados client-side;
- dry-run server-side foi documentado;
- scan de segurança foi executado;
- placeholders são resolvidos;
- namespace foi aplicado;
- Secret efêmero foi criado;
- resources foram aplicados em ordem;
- rollout foi acompanhado;
- timeout foi definido;
- Pods Ready foram exigidos;
- reinicializações anormais foram bloqueadoras;
- rollout history foi consultado;
- Service e EndpointSlice foram validados;
- smoke test por port-forward foi criado;
- health, readiness e liveness foram validados;
- endpoint funcional existente foi exigido;
- Ingress local foi validado quando disponível;
- logs foram revisados;
- Secrets em logs foram proibidos;
- events foram revisados;
- resource metrics foram consideradas;
- critérios de aprovação foram definidos;
- imagem inválida foi usada na simulação de falha;
- ImagePullBackOff foi detectado;
- rollout timeout foi tratado;
- rollback foi executado;
- recuperação foi validada;
- limitações do rollback foram explicadas;
- ConfigMap e Secret exigem versionamento;
- banco exige compatibilidade;
- nenhuma migration destrutiva foi executada;
- evidence foi criada;
- evidence foi sanitizada;
- decisão approved ou rolled-back foi registrada;
- observabilidade mínima foi validada;
- test matrix foi criada;
- troubleshooting foi criado;
- cleanup é limitado ao namespace correto;
- namespace de origem é preservado;
- ambiente pode ser mantido com expiração;
- fluxo completo foi documentado;
- nenhuma cloud real foi acessada;
- nenhum domínio, certificado ou credencial real foi usado;
- projeto final não foi antecipado;
- gate final foi executado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/simple-environment `
  scripts/deploy/simple `
  docs/devops/simple-deploy `
  docs/diario-de-bordo.md
```

Não adicione o Secret renderizado.

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
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|client-secret|kubeconfig"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): executar deploy em ambiente simples"
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
- certificate;
- arquivo temporário de port-forward;
- logs completos;
- resource cloud;
- domínio público;
- arquivos do projeto 546.

---

## Fechamento e ponte para a próxima aula

Nesta aula, deploy deixou de ser apenas a execução de um comando.

O processo passou a possuir:

```text
release candidate;

change record;

preflight;

manifests;

configuração;

rollout;

smoke test;

observabilidade;

rollback;

evidence.
```

Você comprovou que contexto e namespace precisam ser validados antes do apply; ConfigMap e Secret possuem responsabilidades diferentes; imagem precisa ser identificável; Deployment só é aprovado com Pods Ready; Service precisa de endpoints; smoke test precisa validar health e função real; logs e events participam da decisão; falhas precisam de trigger de rollback; `rollout undo` não reverte banco ou configuração externa; e evidence precisa comprovar sem expor Secrets.

A próxima aula será:

```text
546 - M17.41 - Projeto API pronta para deploy parte 1
```

Nela, você irá iniciar o projeto prático guiado que consolidará configuração, container, Kubernetes, segurança, observabilidade, release e deployability em uma API preparada para implantação.

Nenhum arquivo estrutural, requisito final ou implementação do projeto da aula 546 foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei contexto e baseline.
- [ ] Criei o namespace isolado.
- [ ] Preparei ConfigMap e Secret efêmero.
- [ ] Apliquei Deployment e Service.
- [ ] Acompanhei o rollout.
- [ ] Executei smoke test.
- [ ] Simulei falha e rollback.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### O contexto está incorreto

Pare o fluxo e selecione apenas o cluster permitido.

### A imagem não existe no kind

Carregue a imagem no cluster ou corrija a referência.

### O Pod fica em CrashLoopBackOff

Revise logs anteriores, configuração, JVM, Secret e liveness.

### A readiness nunca passa

Revise endpoint, dependências, porta e timeout.

### O Service não possui endpoints

Revise selectors e labels dos Pods.

### O Ingress não responde

Confirme controller, class, host e backend Service.

### O rollout expira

Colete Pods, events, logs e ReplicaSets antes do rollback.

### O rollback não recupera

A configuração ou schema pode ser incompatível com a revisão anterior.

### O smoke test passa, mas existe erro funcional

Amplie o endpoint funcional validado sem transformar smoke em suíte completa.

### Um arquivo do projeto 546 apareceu

Remova e preserve para a próxima aula.

---

## Perguntas de revisão

1. O que é deploy?
2. O que é release candidate?
3. O que é preflight?
4. O que é rollout?
5. O que é rollback?
6. O que é smoke test?
7. Por que usar namespace separado?
8. Por que não usar `latest`?
9. Qual a diferença entre ConfigMap e Secret?
10. Quando o deploy termina?
11. Por que validar EndpointSlice?
12. O que a readiness protege?
13. O que a liveness protege?
14. Por que registrar release metadata?
15. O que `rollout undo` não reverte?
16. Por que simular falha?
17. O que entra na evidence?
18. Como preservar a baseline?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Disponibilizar uma versão.
2. Versão candidata.
3. Validação antes da mudança.
4. Atualização progressiva.
5. Retorno à revisão anterior.
6. Teste essencial pós-deploy.
7. Isolamento.
8. Identidade e imutabilidade.
9. Configuração pública e sensível.
10. Após saúde e validação.
11. Confirmar targets do Service.
12. Remover Pod não pronto do tráfego.
13. Recuperar processo travado.
14. Rastreabilidade.
15. Configuração, banco e externos.
16. Comprovar o runbook.
17. Estado, gates e decisão.
18. Namespace separado e cleanup seguro.
19. Cloud e projeto final.
20. Projeto API pronta para deploy parte 1.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 545 - M17.40 - Deploy em ambiente simples

- Continuei após Observações de segurança cloud.
- Defini deploy, release, rollout, rollback e smoke test.
- Criei o namespace `formacao-java-simple`.
- Preservei o namespace de desenvolvimento existente.
- Modelei release candidate e release metadata.
- Criei change record, deploy plan e rollback plan.
- Criei ConfigMap apenas com configuração não sensível.
- Criei template de Secret sem credencial real.
- Mantive o Secret efetivo fora do Git.
- Modelei imagem local identificável.
- Criei Deployment com duas réplicas e RollingUpdate.
- Configurei startup, readiness e liveness probes.
- Configurei requests, limits e security context.
- Criei Service ClusterIP.
- Criei Ingress apenas para acesso local.
- Criei Kustomization.
- Implementei preflight sem alteração de ambiente.
- Validei contexto, manifests e controles de segurança.
- Apliquei resources em namespace isolado.
- Acompanhei rollout e histórico de revisão.
- Validei Service e EndpointSlice.
- Executei smoke test por port-forward.
- Revisei logs, events e métricas.
- Defini critérios objetivos de aprovação.
- Simulei falha com imagem inexistente.
- Detectei rollout timeout e ImagePullBackOff.
- Executei rollback e validei recuperação.
- Registrei limites do rollback para configuração e banco.
- Criei evidence sanitizada.
- Modelei cleanup seguro e preservação da baseline.
- Não usei cloud, domínio, certificado ou credencial real.
- Não antecipei o projeto final.
- Próxima aula: Projeto API pronta para deploy parte 1.
```

---

## Referência técnica curta

- Kubernetes Deployments.
- Kubernetes Rolling Updates.
- Kubernetes Rollback.
- Kubernetes Services and EndpointSlices.
- Kubernetes Probes.
- Kubernetes Kustomize.
- Deployment Preflight Checks.
- Smoke Testing.
- Release Management.
- Change and Rollback Planning.

Regra final:

```text
deploy em ambiente simples precisa ser tratado como processo controlado e reversível: contexto, namespace, baseline, commit, imagem, configuração, manifests, segurança, change record e rollback plan são validados no preflight antes de qualquer alteração; o namespace isolado recebe ConfigMap não sensível, Secret efêmero fora do Git, Deployment com imagem identificável, probes, requests, limits e security context, além de Service e Ingress local; rollout só é aprovado com réplicas disponíveis, Pods Ready, EndpointSlices válidos, health e smoke test funcional, logs e events sem falhas críticas e release metadata coerente; falha simulada precisa disparar timeout, coleta de evidence e rollback, lembrando que rollout undo não reverte ConfigMap, Secret, schema ou serviços externos; evidence registra release, revisão, readiness, smoke, duração e decisão sem expor credenciais; nenhuma cloud, domínio, certificado ou implementação do projeto final é criada, deixando para a aula 546 a consolidação da API pronta para deploy.
```
