# 554 - M17.49 - Checklist operacional de deploy

## Apresentação da aula

Na aula 553, você transformou o conhecimento técnico de DevOps em uma aula ensinável.

O conteúdo passou a possuir:

```text
público definido;

pré-requisitos;

objetivos observáveis;

história condutora;

modelo mental;

sequência;

demonstrações;

perguntas;

exercícios;

rubrica;

feedback;

retrospectiva.
```

Agora você irá transformar esse conhecimento em um instrumento operacional.

A pergunta central desta aula será:

```text
como garantir
que um deploy

seja preparado,
autorizado,
executado,
validado,
revertido
e encerrado

sem depender
da memória de uma pessoa?
```

A resposta será construída por meio de um checklist operacional de deploy.

Checklist operacional não é uma lista genérica de boas práticas.

Ele precisa:

- representar o fluxo real;
- possuir responsáveis;
- possuir critérios objetivos;
- bloquear riscos;
- registrar exceções;
- produzir evidência;
- indicar quando avançar;
- indicar quando parar;
- indicar quando executar rollback;
- indicar como encerrar.

Um checklist fraco diz:

```text
validar aplicação;

verificar banco;

fazer deploy;

testar.
```

Um checklist forte diz:

```text
qual artefato;

qual commit;

qual digest;

qual ambiente;

qual gate;

qual evidência;

qual responsável;

qual tempo;

qual critério de aprovação;

qual gatilho de rollback.
```

Nesta aula, você irá criar um checklist aplicável à `orders-api`.

O fluxo será dividido em oito fases:

```text
1.
planejamento.

2.
pré-deploy.

3.
autorização.

4.
execução.

5.
validação técnica.

6.
validação funcional.

7.
rollback ou aprovação.

8.
encerramento e retrospectiva.
```

A regra central será:

```text
um deploy não começa
quando o comando é executado;

ele começa
quando o risco é avaliado
e termina
quando o estado é comprovado.
```

O checklist será local e didático.

Nenhum deploy de produção será executado.

Não haverá:

- conta cloud pública;
- credencial corporativa;
- domínio público;
- certificado real;
- banco de produção;
- Secret real;
- alteração destrutiva;
- acesso remoto;
- mudança em ambiente desconhecido;
- cobrança;
- aprovação organizacional real.

O laboratório usará:

```text
namespace:
formacao-java-deploy-checklist.
```

A próxima aula oficial será:

```text
555 - M17.50 - Fechamento do Modulo 17
```

Por isso, esta aula precisa consolidar o procedimento operacional sem antecipar o fechamento completo do módulo.

---

## Onde estamos na formação

A sequência oficial é:

```text
552:
Refatoracao final DevOps.

553:
Aula ensinavel DevOps.

554:
Checklist operacional de deploy.

555:
Fechamento do Modulo 17.
```

A aula 552 respondeu:

```text
como melhorar
uma solução
com base em findings?
```

A aula 553 respondeu:

```text
como explicar
essa solução
para outra pessoa?
```

A aula 554 responderá:

```text
como executar
essa solução
com segurança operacional?
```

Nesta aula:

```text
planejamento:
sim.

change record:
sim.

release identity:
sim.

pré-deploy:
sim.

autorização:
sim.

janela:
sim.

backup e restore:
sim.

migration:
sim.

artifact:
sim.

image digest:
sim.

manifests:
sim.

rollback:
sim.

smoke:
sim.

observabilidade:
sim.

evidence:
sim.

encerramento:
sim.

deploy de produção:
não.

fechamento do módulo:
não.
```

O checklist será organizado em três perspectivas:

```text
pessoas:
quem decide
e quem executa.

processo:
qual etapa
e qual gate.

tecnologia:
qual artifact,
ambiente,
comando
e evidência.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
operations/deploy-checklist
├── deploy-checklist-master.yaml
├── deploy-change-record.yaml
├── deploy-readiness-gate.yaml
├── deploy-authorization-record.yaml
├── deploy-execution-record.yaml
├── deploy-validation-record.yaml
├── deploy-rollback-record.yaml
├── deploy-closure-record.yaml
├── deploy-exception-register.yaml
├── deploy-risk-matrix.yaml
├── deploy-role-matrix.yaml
├── deploy-evidence-contract.yaml
├── deploy-timeline.yaml
├── deploy-communication-plan.yaml
├── deploy-go-no-go.yaml
└── deploy-checklist-evidence.yaml

scripts/operations/deploy-checklist
├── validate-deploy-change.ps1
├── validate-deploy-readiness.ps1
├── validate-deploy-authorization.ps1
├── prepare-deploy-environment.ps1
├── execute-controlled-deploy.ps1
├── wait-deploy-rollout.ps1
├── run-deploy-smoke-test.ps1
├── validate-deploy-observability.ps1
├── evaluate-go-no-go.ps1
├── execute-deploy-rollback.ps1
├── collect-deploy-evidence.ps1
├── close-deploy-change.ps1
└── verify-deploy-checklist-completion.ps1

docs/operations/deploy-checklist
├── DEPLOY_CHECKLIST_MASTER.md
├── DEPLOY_PREPARATION_RUNBOOK.md
├── DEPLOY_EXECUTION_RUNBOOK.md
├── DEPLOY_VALIDATION_RUNBOOK.md
├── DEPLOY_ROLLBACK_RUNBOOK.md
├── DEPLOY_COMMUNICATION_GUIDE.md
├── DEPLOY_EVIDENCE_GUIDE.md
├── DEPLOY_EXCEPTION_POLICY.md
├── DEPLOY_POST_CHANGE_REVIEW.md
└── DEPLOY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
change identificado;

release rastreável;

papéis definidos;

riscos avaliados;

gates aprovados;

janela preparada;

rollback pronto;

deploy controlado;

validação técnica;

validação funcional;

observabilidade revisada;

go ou no-go registrado;

evidence coletada;

change encerrado.
```

Você irá:

1. criar o change record;
2. identificar release;
3. registrar escopo;
4. classificar risco;
5. definir papéis;
6. definir janela;
7. validar artifact;
8. validar imagem;
9. validar configuração;
10. validar Secrets;
11. validar migrations;
12. validar backup;
13. validar rollback;
14. validar ambiente;
15. obter autorização;
16. comunicar início;
17. executar deploy;
18. acompanhar rollout;
19. validar Pods;
20. validar Service;
21. executar smoke;
22. revisar logs;
23. revisar métricas;
24. validar release;
25. decidir go ou no-go;
26. executar rollback quando necessário;
27. validar recuperação;
28. coletar evidence;
29. comunicar encerramento;
30. registrar retrospectiva.

---

## Conceito essencial

### Change record

Registro formal da mudança que será executada.

---

### Deployment window

Período autorizado para executar e validar a mudança.

---

### Go/no-go

Decisão objetiva de prosseguir ou interromper.

---

### Pre-deploy gate

Conjunto de validações que precisa passar antes da execução.

---

### Release identity

Combinação de version, commit, release ID, checksum e image digest.

---

### Rollback trigger

Condição objetiva que inicia a reversão.

---

### Validation window

Período após a implantação usado para observar comportamento.

---

### Operational evidence

Prova sanitizada de que o procedimento foi executado.

---

### Exception

Desvio aprovado de um requisito operacional.

---

### Change closure

Encerramento formal da mudança após validação ou rollback.

---

## Mão na massa guiada

### 1. Criar o change record

Arquivo:

```text
deploy-change-record.yaml
```

Conteúdo:

```yaml
change:
  id:
    CHG-DEVOPS-554

  title:
    deploy-orders-api-checklist-lab

  environment:
    final-simple-local

  namespace:
    formacao-java-deploy-checklist

  owner:
    backend-team

  executor:
    deploy-operator

  approver:
    technical-approver

  release:
    application:
      orders-api

    version:
      resolved-at-runtime

    commit:
      resolved-at-runtime

    releaseId:
      resolved-at-runtime

    imageDigest:
      resolved-at-runtime

  scope:
    included:
      - orders-api-deployment
      - configmap-release-metadata
      - service
      - ingress-local
      - probes
      - resources

    excluded:
      - database-destructive-migration
      - real-cloud-resource
      - external-secret
      - public-dns
```

O change record precisa existir antes da execução.

---

### 2. Definir escopo e impacto

Registre:

- serviços afetados;
- endpoints afetados;
- dependências;
- usuários impactados;
- indisponibilidade esperada;
- alteração de configuração;
- alteração de schema;
- alteração de rede;
- alteração de permissões;
- reversibilidade;
- risco residual.

Exemplo de escopo controlado:

```text
Deployment e ConfigMap
da orders-api

em namespace local isolado.
```

Não use descrições vagas como:

```text
ajustes diversos.
```

---

### 3. Criar matriz de risco

Arquivo:

```text
deploy-risk-matrix.yaml
```

Conteúdo:

```yaml
risk:
  dimensions:
    businessImpact:
      values:
        - low
        - medium
        - high

    technicalComplexity:
      values:
        - low
        - medium
        - high

    reversibility:
      values:
        - easy
        - moderate
        - difficult

    dataChange:
      values:
        - none
        - compatible
        - destructive

    trafficExposure:
      values:
        - local
        - internal
        - public

    observability:
      values:
        - strong
        - partial
        - weak
```

A mudança desta aula deve permanecer:

```text
local;

reversível;

sem dados reais;

sem migration destrutiva.
```

---

### 4. Definir papéis

Arquivo:

```text
deploy-role-matrix.yaml
```

Papéis:

#### Change owner

Responsável pelo objetivo e escopo.

#### Executor

Executa os comandos.

#### Approver

Autoriza o início.

#### Observer

Acompanha logs, métricas e eventos.

#### Business validator

Valida comportamento funcional quando aplicável.

#### Incident coordinator

Coordena resposta quando o deploy falha.

No laboratório, uma pessoa pode acumular papéis.

Mesmo assim, registre cada responsabilidade separadamente.

---

### 5. Criar timeline

Arquivo:

```text
deploy-timeline.yaml
```

Exemplo:

```yaml
timeline:
  preparation:
    start:
      T-minus-60

  authorization:
    start:
      T-minus-15

  deploy:
    start:
      T-zero

  technicalValidation:
    start:
      T-plus-5

  functionalValidation:
    start:
      T-plus-10

  observation:
    end:
      T-plus-30

  closure:
    target:
      T-plus-40
```

O tempo é didático.

A timeline precisa prever:

- preparação;
- autorização;
- deploy;
- validação;
- rollback;
- encerramento.

---

### 6. Criar plano de comunicação

Arquivo:

```text
deploy-communication-plan.yaml
```

Mensagens:

```text
deploy planned;

deploy started;

deploy validation;

deploy approved;

deploy rollback started;

deploy recovered;

deploy closed.
```

Cada mensagem precisa conter:

- change ID;
- environment;
- release ID;
- estado;
- owner;
- próximo passo;
- horário;
- impacto.

Não inclua Secrets ou logs completos.

---

### 7. Validar a origem da release

Antes do deploy, confirme:

```text
commit;

version;

artifact checksum;

image digest;

release ID;

bundle status;

test status;

scan status.
```

Execute:

```powershell
.\scripts\operations\deploy-checklist\validate-deploy-change.ps1
```

O script bloqueia:

- commit ausente;
- release ID desconhecida;
- checksum divergente;
- image digest ausente;
- gate de segurança falho;
- artifact reconstruído;
- evidence inconsistente.

---

### 8. Validar o artifact

Checklist:

```text
[ ]
JAR existe.

[ ]
JAR possui tamanho válido.

[ ]
checksum confere.

[ ]
metadata possui version.

[ ]
metadata possui commit.

[ ]
classe principal existe.

[ ]
nenhum Secret existe.

[ ]
testes estão aprovados.
```

Artifact inválido bloqueia o deploy.

---

### 9. Validar a imagem

Checklist:

```text
[ ]
imagem existe.

[ ]
digest está resolvido.

[ ]
usuário é non-root.

[ ]
labels OCI existem.

[ ]
entrypoint é explícito.

[ ]
porta está correta.

[ ]
nenhum Secret existe em layers.

[ ]
SBOM existe.

[ ]
vulnerability gate está aprovado.
```

A tag pode ser registrada, mas o deploy deve preferir digest.

---

### 10. Validar configuração

Checklist:

```text
[ ]
profile está correto.

[ ]
environment está correto.

[ ]
release ID está resolvida.

[ ]
ConfigMap não contém Secret.

[ ]
Secret será criado fora do Git.

[ ]
timeouts são coerentes.

[ ]
feature flags estão documentadas.

[ ]
integrações externas estão desabilitadas no laboratório.

[ ]
startup inválido falha cedo.
```

Configuração é parte da release.

---

### 11. Validar migrations

Arquivo:

```text
deploy-readiness-gate.yaml
```

Se houver migration, registre:

- version;
- compatibilidade;
- duração;
- lock esperado;
- executor único;
- backup;
- rollback;
- roll-forward;
- observabilidade.

Nesta aula:

```text
migration destrutiva:
não permitida.
```

Quando não houver migration, registre explicitamente:

```text
databaseMigration:
none.
```

---

### 12. Validar backup e restore

Mesmo sem alteração destrutiva, o checklist deve perguntar:

```text
há dados envolvidos?

há backup?

há restore testado?

qual o RPO?

qual o RTO?

quem autoriza recuperação?
```

No laboratório local sem mudança de dados:

```text
backup requirement:
not applicable.

reason:
no persistent business data change.
```

Não marque apenas como `N/A`.

Registre justificativa.

---

### 13. Validar rollback

Antes do deploy, confirme:

```text
[ ]
revisão anterior conhecida.

[ ]
artifact anterior disponível.

[ ]
configuração anterior disponível.

[ ]
schema compatível.

[ ]
Secret compatível.

[ ]
comando de rollback validado.

[ ]
smoke pós-rollback definido.

[ ]
gatilhos objetivos definidos.

[ ]
owner do rollback definido.
```

Rollback improvisado não é plano.

---

### 14. Definir gatilhos de rollback

Arquivo:

```text
deploy-rollback-record.yaml
```

Gatilhos:

- rollout timeout;
- Pods não Ready;
- restart crescente;
- health `DOWN`;
- readiness `DOWN`;
- endpoint funcional com `5xx`;
- release ID divergente;
- imageID divergente;
- erro crítico em logs;
- impacto não previsto;
- falha de segurança;
- falha de migration;
- perda de conectividade necessária.

Exemplo:

```yaml
rollback:
  triggers:
    - rollout-timeout
    - readiness-failure
    - release-identity-mismatch
    - critical-error-rate

  decisionOwner:
    incident-coordinator

  maximumDecisionTimeMinutes:
    5
```

---

### 15. Validar o ambiente

Execute:

```powershell
kubectl config current-context

kubectl get namespace

kubectl get nodes

kubectl get ingressclass

kubectl get deployment,pod,service,ingress,hpa,pdb `
  --all-namespaces
```

Checklist:

```text
[ ]
contexto está na allowlist.

[ ]
cluster responde.

[ ]
namespace é correto.

[ ]
capacidade é suficiente.

[ ]
Ingress Controller está disponível ou há fallback.

[ ]
Metrics Server está disponível quando HPA será validado.

[ ]
registry está acessível.

[ ]
nenhum recurso desconhecido será alterado.
```

Contexto incorreto é bloqueador.

---

### 16. Criar Secret efêmero

Use valores fictícios.

Exemplo:

```powershell
kubectl create namespace `
  formacao-java-deploy-checklist `
  --dry-run=client `
  --output=yaml `
  | kubectl apply `
      --filename -

kubectl create secret generic `
  orders-api-secret `
  --namespace `
  formacao-java-deploy-checklist `
  --from-literal=DB_USERNAME=checklist_local_user `
  --from-literal=DB_PASSWORD=checklist_local_password `
  --dry-run=client `
  --output=yaml `
  | kubectl apply `
      --filename -
```

Checklist:

```text
[ ]
valores são fictícios.

[ ]
Secret não entra no Git.

[ ]
Secret não entra na evidence.

[ ]
Secret será removido no cleanup.
```

---

### 17. Renderizar manifests

Execute:

```powershell
kubectl kustomize `
  k8s/deploy-ready/overlays/final-simple `
  > target/deploy-checklist/rendered-manifests.yaml
```

Confirme:

- namespace;
- image digest;
- release ID;
- commit;
- ConfigMap;
- Secret reference;
- probes;
- resources;
- Service;
- Ingress;
- PDB;
- HPA;
- NetworkPolicy.

Nenhum marcador pode permanecer.

---

### 18. Executar dry-run

Execute:

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  target/deploy-checklist/rendered-manifests.yaml
```

Quando possível:

```powershell
kubectl apply `
  --dry-run=server `
  --filename `
  target/deploy-checklist/rendered-manifests.yaml
```

Checklist:

```text
[ ]
schema válido.

[ ]
admission aceita.

[ ]
namespace correto.

[ ]
nenhum recurso proibido.

[ ]
nenhum Secret literal.

[ ]
imagem por digest.

[ ]
security context aprovado.
```

---

### 19. Validar readiness

Execute:

```powershell
.\scripts\operations\deploy-checklist\validate-deploy-readiness.ps1
```

O script consolida:

- change;
- artifact;
- image;
- configuration;
- migration;
- rollback;
- environment;
- manifests;
- security;
- communication;
- evidence contract.

Saída:

```text
READY
ou
BLOCKED.
```

Não existe estado:

```text
quase pronto.
```

---

### 20. Criar autorização

Arquivo:

```text
deploy-authorization-record.yaml
```

Conteúdo:

```yaml
authorization:
  changeId:
    CHG-DEVOPS-554

  decision:
    approved

  conditions:
    - local-environment-only
    - no-real-secrets
    - rollback-ready
    - evidence-required

  approver:
    technical-approver

  timestamp:
    runtime-generated
```

A aprovação precisa ocorrer depois do readiness gate.

---

### 21. Registrar go/no-go inicial

Arquivo:

```text
deploy-go-no-go.yaml
```

Critérios de `go`:

- readiness `READY`;
- autorização presente;
- contexto correto;
- rollback pronto;
- comunicação enviada;
- executor disponível;
- observer disponível;
- janela aberta.

Qualquer falha crítica gera:

```text
NO-GO.
```

No-go não é fracasso.

É controle funcionando.

---

### 22. Comunicar início

Mensagem mínima:

```text
change:
CHG-DEVOPS-554.

environment:
final-simple-local.

namespace:
formacao-java-deploy-checklist.

release:
<release-id>.

status:
DEPLOY_STARTED.

rollback:
READY.
```

Registre horário e owner.

---

### 23. Executar deploy controlado

Script:

```text
execute-controlled-deploy.ps1
```

Comando principal:

```powershell
kubectl apply `
  --filename `
  target/deploy-checklist/rendered-manifests.yaml
```

O script registra:

- contexto;
- namespace;
- release;
- digest;
- resources;
- horário;
- resultado;
- revisão anterior;
- revisão nova.

Se o apply falhar, pare.

Não execute comandos aleatórios para “destravar”.

---

### 24. Acompanhar rollout

Execute:

```powershell
.\scripts\operations\deploy-checklist\wait-deploy-rollout.ps1
```

Comando:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-checklist `
  --timeout=180s
```

Observe:

```powershell
kubectl get deployment,replicaset,pod `
  --namespace `
  formacao-java-deploy-checklist `
  --output=wide
```

Checklist:

```text
[ ]
desired replicas corretas.

[ ]
available replicas corretas.

[ ]
Pods Ready.

[ ]
restart count estável.

[ ]
image digest correto.

[ ]
annotations corretas.

[ ]
sem ImagePullBackOff.

[ ]
sem CrashLoopBackOff.
```

---

### 25. Validar Service e EndpointSlices

Execute:

```powershell
kubectl get service,endpointslice `
  --namespace `
  formacao-java-deploy-checklist
```

Checklist:

```text
[ ]
Service é ClusterIP.

[ ]
selector corresponde aos Pods.

[ ]
porta está correta.

[ ]
EndpointSlices possuem targets Ready.

[ ]
nenhum Service público foi criado.
```

Service sem endpoints bloqueia aprovação.

---

### 26. Executar smoke test

Script:

```text
run-deploy-smoke-test.ps1
```

Use port-forward:

```powershell
kubectl port-forward `
  service/orders-api `
  18083:80 `
  --namespace `
  formacao-java-deploy-checklist
```

Valide:

```text
/actuator/health;

/actuator/health/liveness;

/actuator/health/readiness;

/internal/release;

endpoint funcional.
```

Checklist:

```text
[ ]
sem 5xx.

[ ]
health UP.

[ ]
liveness UP.

[ ]
readiness UP.

[ ]
release ID correta.

[ ]
commit correto.

[ ]
correlation ID presente.

[ ]
endpoint funcional coerente.
```

---

### 27. Validar identidade da release

Compare:

- change record;
- artifact metadata;
- image digest;
- manifest;
- ConfigMap;
- annotation;
- Pod imageID;
- endpoint `/internal/release`.

Todos precisam representar a mesma release.

Uma aplicação saudável com release errada gera `NO-GO`.

---

### 28. Validar observabilidade

Script:

```text
validate-deploy-observability.ps1
```

Revise:

- logs estruturados;
- environment;
- release ID;
- correlation ID;
- startup;
- readiness;
- restarts;
- events;
- resource usage;
- HPA;
- PDB;
- NetworkPolicy;
- erros de dependência;
- latência didática;
- error rate didática.

Nenhuma stack adicional precisa ser instalada.

Use os sinais disponíveis.

---

### 29. Revisar logs e eventos

Execute:

```powershell
kubectl logs `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-checklist `
  --tail=150

kubectl get events `
  --namespace `
  formacao-java-deploy-checklist `
  --sort-by=.metadata.creationTimestamp
```

Bloqueadores:

- Secret em log;
- erro crítico;
- restart loop;
- probe failure persistente;
- release divergente;
- acesso negado necessário;
- OOMKill;
- falha de configuração.

---

### 30. Validar comportamento funcional

A validação funcional precisa ser pequena e representativa.

Exemplo:

```text
criar ou consultar
um recurso de teste
sem dados reais.
```

Registre:

- entrada;
- resultado;
- status;
- correlation ID;
- release ID;
- cleanup.

Não execute teste destrutivo.

---

### 31. Avaliar go/no-go pós-deploy

Script:

```text
evaluate-go-no-go.ps1
```

Critérios de `GO`:

- rollout aprovado;
- Pods Ready;
- Service com endpoints;
- smoke aprovado;
- release consistente;
- logs sem bloqueadores;
- events estáveis;
- validação funcional aprovada;
- risco residual aceitável.

Critérios de `NO-GO`:

- qualquer gatilho de rollback;
- evidência ausente;
- identidade divergente;
- impacto não previsto;
- segurança comprometida.

---

### 32. Abrir janela de observação

A release não deve ser encerrada imediatamente após o smoke.

Use uma janela didática.

Durante a janela, observe:

- restarts;
- readiness;
- error rate;
- latency;
- logs;
- events;
- consumo de recursos;
- HPA;
- dependências.

Registre horário de início e fim.

---

### 33. Executar rollback quando necessário

Script:

```text
execute-deploy-rollback.ps1
```

Comando:

```powershell
kubectl rollout undo `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-checklist
```

Depois:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-checklist `
  --timeout=180s
```

O rollback precisa ser registrado.

---

### 34. Validar rollback

Checklist:

```text
[ ]
revisão anterior está ativa.

[ ]
Pods estão Ready.

[ ]
Service possui endpoints.

[ ]
health está UP.

[ ]
release ID corresponde à revisão anterior.

[ ]
imageID corresponde ao digest anterior.

[ ]
smoke passou.

[ ]
logs estabilizaram.

[ ]
impacto cessou.
```

Rollback sem validação não encerra incidente.

---

### 35. Tratar ConfigMap e Secret no rollback

`rollout undo` não reverte automaticamente recursos aplicados separadamente.

Por isso, o checklist precisa registrar:

- ConfigMap anterior;
- Secret compatibility;
- Service anterior;
- Ingress anterior;
- NetworkPolicy anterior;
- schema;
- efeitos externos.

Quando houver mudança nesses recursos, use plano explícito.

---

### 36. Criar registro de execução

Arquivo:

```text
deploy-execution-record.yaml
```

Campos:

```yaml
execution:
  changeId:
    CHG-DEVOPS-554

  start:
    runtime-generated

  end:
    runtime-generated

  context:
    sanitized-local

  namespace:
    formacao-java-deploy-checklist

  release:
    runtime-resolved

  previousRevision:
    runtime-resolved

  newRevision:
    runtime-resolved

  result:
    pending-at-start
```

O resultado final pode ser:

```text
DEPLOY_APPROVED;

DEPLOY_ROLLED_BACK;

DEPLOY_BLOCKED;

DEPLOY_FAILED_RECOVERED.
```

---

### 37. Criar registro de validação

Arquivo:

```text
deploy-validation-record.yaml
```

Registre:

- rollout;
- Pods;
- Service;
- EndpointSlices;
- health;
- liveness;
- readiness;
- functional smoke;
- release identity;
- logs;
- events;
- capacity;
- security;
- observer;
- timestamp.

Cada item precisa de status e evidence reference.

---

### 38. Criar contrato de evidence

Arquivo:

```text
deploy-evidence-contract.yaml
```

Campos permitidos:

- change ID;
- release ID;
- commit;
- version;
- image digest;
- namespace;
- revision;
- rollout status;
- replica status;
- health;
- smoke;
- rollback;
- validation result;
- timestamps;
- sanitized commands.

Campos proibidos:

- senha;
- token;
- kubeconfig;
- private key;
- certificate;
- dados pessoais;
- environment dump;
- logs completos;
- endpoints corporativos.

---

### 39. Coletar evidence

Script:

```text
collect-deploy-evidence.ps1
```

Arquivo:

```text
deploy-checklist-evidence.json.
```

A evidence precisa permitir que outra pessoa responda:

```text
o que foi implantado?

onde?

quando?

por quem?

qual release?

quais gates passaram?

houve rollback?

qual estado final?
```

---

### 40. Registrar exceções

Arquivo:

```text
deploy-exception-register.yaml
```

Uma exceção precisa conter:

- requisito;
- motivo;
- risco;
- compensating control;
- approver;
- owner;
- expiração;
- evidência;
- plano de remoção.

Exceção sem expiração vira regra informal.

P0 de segurança não deve ser aceito como exceção didática.

---

### 41. Comunicar resultado

Mensagem de sucesso:

```text
change:
CHG-DEVOPS-554.

status:
DEPLOY_APPROVED.

release:
<release-id>.

validation:
PASSED.

rollback:
NOT_REQUIRED.

observation:
COMPLETED.
```

Mensagem de rollback:

```text
status:
DEPLOY_ROLLED_BACK.

trigger:
<rollback-trigger>.

recoveredRelease:
<previous-release>.

smoke:
PASSED.
```

---

### 42. Encerrar o change

Script:

```text
close-deploy-change.ps1
```

Arquivo:

```text
deploy-closure-record.yaml
```

Checklist:

```text
[ ]
estado final conhecido.

[ ]
release ativa registrada.

[ ]
evidence coletada.

[ ]
comunicação enviada.

[ ]
incidentes vinculados.

[ ]
exceções registradas.

[ ]
cleanup definido.

[ ]
retrospectiva agendada quando necessária.
```

---

### 43. Executar cleanup

No ambiente local:

```powershell
kubectl delete namespace `
  formacao-java-deploy-checklist
```

Antes:

- confirme contexto;
- confirme namespace;
- confirme evidence;
- confirme ausência de dependência externa;
- confirme owner.

Não use comandos genéricos de exclusão.

O cleanup não é rollback.

Ele remove o laboratório depois da conclusão.

---

### 44. Criar post-change review

Arquivo:

```text
DEPLOY_POST_CHANGE_REVIEW.md
```

Perguntas:

- o objetivo foi atingido;
- o tempo foi adequado;
- o gate bloqueou algo;
- houve falha;
- houve rollback;
- a observabilidade foi suficiente;
- a comunicação foi clara;
- quais passos foram manuais;
- qual evidência faltou;
- qual automação deve ser criada;
- qual risco residual permanece.

Nem todo deploy exige retrospectiva longa.

Mudanças com falha, rollback, exceção ou surpresa exigem revisão.

---

### 45. Criar checklist mestre

Arquivo:

```text
deploy-checklist-master.yaml
```

Estrutura:

```yaml
checklist:
  planning:
    required:
      true

  readiness:
    required:
      true

  authorization:
    required:
      true

  execution:
    required:
      true

  technicalValidation:
    required:
      true

  functionalValidation:
    required:
      true

  goNoGo:
    required:
      true

  rollback:
    readyBeforeDeploy:
      true

  evidence:
    required:
      true

  closure:
    required:
      true
```

O checklist mestre referencia os registros detalhados.

---

### 46. Criar documentação operacional

#### `DEPLOY_CHECKLIST_MASTER.md`

Explique todas as fases.

#### `DEPLOY_PREPARATION_RUNBOOK.md`

Explique change, release, risco, ambiente e rollback.

#### `DEPLOY_EXECUTION_RUNBOOK.md`

Explique autorização, apply e rollout.

#### `DEPLOY_VALIDATION_RUNBOOK.md`

Explique smoke, release identity e observabilidade.

#### `DEPLOY_ROLLBACK_RUNBOOK.md`

Explique triggers, undo, ConfigMap e recuperação.

#### `DEPLOY_COMMUNICATION_GUIDE.md`

Explique mensagens de início, status, falha e encerramento.

#### `DEPLOY_EVIDENCE_GUIDE.md`

Explique dados permitidos e proibidos.

#### `DEPLOY_EXCEPTION_POLICY.md`

Explique exceções, expiração e compensating controls.

---

### 47. Criar troubleshooting

Arquivo:

```text
DEPLOY_TROUBLESHOOTING.md
```

Inclua:

- readiness `BLOCKED`;
- autorização ausente;
- contexto incorreto;
- artifact divergente;
- digest ausente;
- Secret literal;
- dry-run falhando;
- ImagePullBackOff;
- CrashLoopBackOff;
- Service sem endpoints;
- readiness falhando;
- release ID divergente;
- logs com erro;
- HPA unknown;
- PDB bloqueando rollout;
- rollback sem revisão;
- ConfigMap incompatível;
- evidence incompleta;
- cleanup apontando para namespace errado.

---

### 48. Executar simulação de deploy

Fluxo:

```powershell
.\scripts\operations\deploy-checklist\validate-deploy-change.ps1

.\scripts\operations\deploy-checklist\validate-deploy-readiness.ps1

.\scripts\operations\deploy-checklist\validate-deploy-authorization.ps1

.\scripts\operations\deploy-checklist\prepare-deploy-environment.ps1

.\scripts\operations\deploy-checklist\execute-controlled-deploy.ps1

.\scripts\operations\deploy-checklist\wait-deploy-rollout.ps1

.\scripts\operations\deploy-checklist\run-deploy-smoke-test.ps1

.\scripts\operations\deploy-checklist\validate-deploy-observability.ps1

.\scripts\operations\deploy-checklist\evaluate-go-no-go.ps1

.\scripts\operations\deploy-checklist\collect-deploy-evidence.ps1

.\scripts\operations\deploy-checklist\close-deploy-change.ps1

.\scripts\operations\deploy-checklist\verify-deploy-checklist-completion.ps1
```

Se houver gatilho:

```powershell
.\scripts\operations\deploy-checklist\execute-deploy-rollback.ps1
```

Depois repita validação e evidence.

---

### 49. Validar conclusão

O script:

```text
verify-deploy-checklist-completion.ps1
```

exige:

- change record;
- release identity;
- readiness;
- authorization;
- go/no-go;
- execution;
- validation;
- rollback readiness;
- final state;
- communication;
- evidence;
- closure.

Saída:

```text
CHECKLIST_COMPLETED
ou
CHECKLIST_INCOMPLETE.
```

---

## Entendendo o que foi feito

### O deploy ganhou início formal

A mudança passou a começar no planejamento.

### A release ganhou identidade

Commit, version, checksum e digest foram registrados.

### O risco ganhou classificação

Escopo, impacto, reversibilidade e dados foram considerados.

### Papéis ganharam responsabilidade

Owner, executor, approver e observer foram separados.

### O pré-deploy ganhou gate

Artifact, image, configuration, environment e rollback passaram a bloquear execução.

### A autorização ganhou evidência

O deploy não começa apenas porque alguém possui acesso.

### A execução ganhou controle

Contexto, namespace, revisão e resultado foram registrados.

### A validação ganhou profundidade

Rollout, Service, smoke, release identity, logs e events foram combinados.

### O rollback ganhou gatilhos

A reversão deixou de depender de sensação.

### O encerramento ganhou formalidade

Evidence, comunicação, cleanup e retrospectiva passaram a concluir o change.

---

## Erros comuns importantes

### Tratar checklist como burocracia

Um checklist bem desenhado reduz falhas previsíveis.

### Marcar itens sem evidência

A lista fica completa no papel, mas não no ambiente.

### Autorizar antes do readiness gate

O aprovador decide com informação incompleta.

### Executar em contexto desconhecido

O blast radius pode ser real.

### Considerar apply como sucesso

Rollout, smoke e observabilidade ainda precisam passar.

### Adiar rollback sem critério

O impacto aumenta.

### Usar tag como identidade final

A release pode apontar para outro conteúdo.

### Ignorar ConfigMap no rollback

A revisão anterior pode continuar incompatível.

### Encerrar sem janela de observação

Falhas tardias ficam fora do change.

### Apagar evidence no cleanup

O procedimento perde rastreabilidade.

---

## Comandos úteis

### Validar readiness

```powershell
.\scripts\operations\deploy-checklist\validate-deploy-readiness.ps1
```

### Executar deploy

```powershell
.\scripts\operations\deploy-checklist\execute-controlled-deploy.ps1
```

### Executar smoke

```powershell
.\scripts\operations\deploy-checklist\run-deploy-smoke-test.ps1
```

### Executar rollback

```powershell
.\scripts\operations\deploy-checklist\execute-deploy-rollback.ps1
```

### Encerrar change

```powershell
.\scripts\operations\deploy-checklist\close-deploy-change.ps1
```

---

## Exercício guiado

### Parte 1 — Change

Crie identidade, escopo e risco.

### Parte 2 — Roles

Defina owner, executor, approver e observer.

### Parte 3 — Readiness

Valide artifact, image, configuração e ambiente.

### Parte 4 — Authorization

Registre aprovação e condições.

### Parte 5 — Execution

Aplique a release e acompanhe rollout.

### Parte 6 — Validation

Execute smoke, release consistency e observabilidade.

### Parte 7 — Decision

Registre go ou no-go.

### Parte 8 — Rollback

Use gatilhos objetivos e valide recuperação.

### Parte 9 — Evidence

Colete dados sanitizados.

### Parte 10 — Closure

Comunique, encerre e faça cleanup.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 553 e ponte para a aula 555 foram preservadas;
- checklist representa planejamento, readiness, autorização, execução, validação, rollback e encerramento;
- change record possui ID, owner, executor, approver, ambiente, namespace, release e escopo;
- risco considera impacto, complexidade, reversibilidade, dados, tráfego e observabilidade;
- papéis operacionais foram definidos;
- timeline e janela de deploy foram criadas;
- plano de comunicação inclui início, status, rollback e encerramento;
- release identity inclui version, commit, checksum, release ID e digest;
- artifact, image, configuration, migration, backup, restore e rollback foram validados;
- migration destrutiva é proibida;
- itens não aplicáveis possuem justificativa;
- gatilhos de rollback são objetivos;
- contexto, cluster, namespace, capacidade, Ingress, Metrics Server e registry são validados;
- Secret do laboratório é fictício, efêmero e mantido fora do Git;
- manifests são renderizados sem marcadores;
- dry-run client-side e server-side são previstos;
- readiness retorna `READY` ou `BLOCKED`;
- autorização ocorre após readiness;
- go/no-go inicial foi definido;
- deploy registra contexto, namespace, release, digest e revisões;
- rollout possui timeout;
- Pods, restarts, image digest e annotations são validados;
- Service e EndpointSlices são validados;
- smoke verifica health, liveness, readiness, release e fluxo funcional;
- identidade da release é comparada entre todos os pontos;
- logs, events, resources, HPA, PDB e NetworkPolicy são revisados;
- janela de observação foi definida;
- go/no-go pós-deploy possui critérios objetivos;
- rollback usa revisão conhecida e novo smoke;
- limites do `rollout undo` foram documentados;
- execution record, validation record, evidence contract e exception register foram criados;
- comunicação final registra sucesso ou rollback;
- change closure exige estado final e evidence;
- cleanup valida contexto e namespace;
- post-change review foi criada;
- checklist mestre referencia todas as fases;
- documentação operacional foi criada;
- troubleshooting foi criado;
- simulação completa foi executada;
- evidence é sanitizada;
- cloud resources e real secrets permanecem em zero;
- nenhum fechamento completo do módulo 17 foi antecipado;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/operations/deploy-checklist `
  scripts/operations/deploy-checklist `
  docs/operations/deploy-checklist `
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
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|kubeconfig|client-secret|X-Amz-Signature"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): criar checklist operacional de deploy"
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
- logs completos;
- dados pessoais;
- image archive;
- JAR;
- registry data;
- credencial cloud;
- material do fechamento do módulo 17.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o fluxo de deploy foi transformado em um procedimento operacional verificável.

O checklist passou a cobrir:

```text
change;

escopo;

risco;

papéis;

timeline;

comunicação;

readiness;

autorização;

execução;

rollout;

smoke;

observabilidade;

go/no-go;

rollback;

evidence;

closure.
```

Você comprovou que um deploy confiável começa antes do apply; change e release precisam de identidade; riscos e papéis precisam ser explícitos; readiness precisa bloquear execução incompleta; autorização precisa ser registrada; rollout precisa de timeout; Service, endpoints, health e release identity precisam ser validados; observabilidade participa do go/no-go; rollback precisa de gatilhos, revisão anterior e smoke; ConfigMap, Secret e schema possuem planos próprios; evidence precisa ser sanitizada; e o change só termina quando o estado final, a comunicação e o cleanup são conhecidos.

A próxima aula será:

```text
555 - M17.50 - Fechamento do Modulo 17
```

Nela, você irá consolidar os resultados do módulo, revisar as competências adquiridas, registrar entregáveis, avaliar readiness e preparar a transição para o próximo módulo.

Nenhum conteúdo completo do fechamento do Módulo 17 foi antecipado nesta aula além da ponte oficial.

---

# Material complementar

## Checkpoint final

- [ ] Criei change, escopo e risco.
- [ ] Defini papéis e timeline.
- [ ] Validei release, ambiente e rollback.
- [ ] Registrei autorização e go/no-go.
- [ ] Executei deploy, rollout e smoke.
- [ ] Validei observabilidade e release identity.
- [ ] Testei rollback quando necessário.
- [ ] Coletei evidence e encerrei o change.

---

## Troubleshooting adicional

### O readiness gate está bloqueado

Leia cada finding. Não altere o status manualmente.

### O approver não está disponível

Registre no-go e reagende a janela.

### O contexto está incorreto

Interrompa antes de criar recursos.

### O digest não corresponde ao bundle

A release está inconsistente e não deve ser implantada.

### O rollout conclui, mas o Service não responde

Revise readiness, selectors, EndpointSlices e porta.

### O smoke passa, mas o release ID diverge

Existe versão incorreta em execução.

### O HPA mostra estado desconhecido

Revise Metrics Server, requests e target.

### O rollback não restaura

Revise ConfigMap, Secret, schema e recursos externos.

### A evidence contém dado sensível

Remova, revogue quando necessário e gere evidence sanitizada.

### O fechamento do módulo apareceu

Preserve a consolidação completa para a aula 555.

---

## Perguntas de revisão

1. Quando um deploy começa?
2. O que é change record?
3. O que compõe release identity?
4. O que é readiness gate?
5. Por que definir papéis?
6. O que é go/no-go?
7. Por que validar o contexto?
8. Por que usar digest?
9. O que validar no artifact?
10. O que validar na imagem?
11. Como tratar migrations?
12. O que precisa existir antes do rollback?
13. O que validar no rollout?
14. Para que serve EndpointSlice?
15. O que o smoke test comprova?
16. Como validar release consistency?
17. O que `rollout undo` não reverte?
18. O que entra na evidence?
19. Quando o change pode ser encerrado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. No planejamento.
2. Registro formal da mudança.
3. Version, commit, checksum, release e digest.
4. Gate antes da execução.
5. Separar responsabilidades.
6. Decisão de prosseguir ou parar.
7. Evitar blast radius.
8. Identificar conteúdo.
9. JAR, metadata, checksum e testes.
10. User, labels, layers, SBOM e scan.
11. Compatibilidade, backup e recovery.
12. Revisão, artifact, config e triggers.
13. Réplicas, Pods, probes e imagem.
14. Targets do Service.
15. Saúde, identidade e fluxo essencial.
16. Comparar todos os pontos.
17. Dados e recursos separados.
18. Resultados sanitizados.
19. Após estado final e comunicação.
20. Fechamento do Módulo 17.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 554 - M17.49 - Checklist operacional de deploy

- Continuei após a Aula ensinável DevOps.
- Transformei o fluxo de deploy em checklist operacional.
- Criei change record com escopo, ambiente e release.
- Classifiquei risco por impacto, complexidade e reversibilidade.
- Defini owner, executor, approver, observer e coordenador.
- Criei timeline e plano de comunicação.
- Validei artifact, checksum, image digest, SBOM e scan.
- Validei configuração, Secrets, migrations, backup e restore.
- Registrei gatilhos objetivos de rollback.
- Validei contexto, cluster, namespace, capacidade e registry.
- Criei Secret efêmero e fictício fora do Git.
- Renderizei e validei manifests.
- Criei readiness gate com status READY ou BLOCKED.
- Registrei autorização e go/no-go.
- Executei deploy controlado e acompanhei rollout.
- Validei Pods, Service e EndpointSlices.
- Executei smoke test e validação funcional.
- Comparei release ID, commit, digest e Pod imageID.
- Revisei logs, events, HPA, PDB e NetworkPolicy.
- Defini janela de observação.
- Executei rollback e novo smoke quando necessário.
- Registrei execução, validação, exceções e closure.
- Coletei evidence sanitizada.
- Não usei cloud pública, produção ou Secret real.
- Próxima aula: Fechamento do Módulo 17.
```

---

## Referência técnica curta

- Change Management.
- Deployment Readiness Gates.
- Go/No-Go Decision.
- Release Identity and Image Digests.
- Kubernetes Rollout Verification.
- Deployment Smoke Testing.
- Operational Rollback.
- Change Communication.
- Deployment Evidence.
- Post-Change Review.

Regra final:

```text
o checklist operacional de deploy precisa transformar a mudança em um fluxo controlado: change record, escopo, risco, papéis, timeline e comunicação são definidos antes da execução; release identity combina version, commit, checksum, release ID e image digest, enquanto artifact, image, configuration, Secrets, migrations, backup, environment, manifests, security e rollback passam por readiness com resultado READY ou BLOCKED; autorização e go/no-go precedem o apply, rollout possui timeout e valida réplicas, Pods, imageID, Service e EndpointSlices; smoke test confirma health, probes, release e função, observabilidade revisa logs, events, resources, HPA e PDB, e gatilhos objetivos decidem aprovação ou rollback; a reversão restaura revisão e repete smoke, sem presumir que ConfigMap, Secret, schema ou efeitos externos voltam automaticamente; evidence sanitizada, comunicação, exceptions, cleanup e closure encerram o change, preservando para a aula 555 o fechamento completo do Módulo 17.
```
