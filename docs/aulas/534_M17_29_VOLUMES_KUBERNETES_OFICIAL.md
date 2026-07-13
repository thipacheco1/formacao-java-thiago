# 534 - M17.29 - Volumes Kubernetes

## Apresentação da aula

Na aula 533, a aplicação passou a ajustar automaticamente o número de réplicas com:

```text
Metrics Server;

HorizontalPodAutoscaler;

CPU request;

scale-up;

scale-down;

stabilization;

Ingress estável;

Service estável.
```

O workload terminou com:

```text
2 réplicas mínimas;

2 endpoints prontos;

HPA ativo;

Ingress saudável;

resources restaurados.
```

A aplicação continua essencialmente stateless.

Quando um Pod é removido, o Deployment cria outro.

A nova réplica recebe:

- a mesma imagem;
- as mesmas ConfigMaps;
- os mesmos Secrets;
- as mesmas probes;
- os mesmos requests e limits.

Entretanto, qualquer arquivo gravado apenas no filesystem gravável do container pode desaparecer quando o container ou o Pod é recriado.

A pergunta central desta aula será:

```text
como fornecer
espaço de armazenamento
a um Pod

sem confundir
filesystem do container,
volume efêmero
e persistência externa?
```

A resposta será construída com:

```text
Volumes Kubernetes.
```

Um volume Kubernetes é uma fonte de armazenamento declarada no PodSpec e montada em um ou mais containers.

O volume separa:

```text
onde os dados existem

de

onde o container
enxerga os dados.
```

A declaração possui duas partes principais.

No nível do Pod:

```yaml
volumes:
  - name:
      runtime-data
```

No nível do container:

```yaml
volumeMounts:
  - name:
      runtime-data

    mountPath:
      /var/lib/orders-api
```

O volume pertence ao Pod.

O mount pertence ao container.

Um mesmo volume pode ser montado:

- em um container;
- em vários containers do mesmo Pod;
- em paths diferentes;
- como read-only;
- com subpaths específicos.

Nesta aula, você irá aprofundar:

- filesystem do container;
- volume lifecycle;
- `emptyDir`;
- `emptyDir.medium: Memory`;
- ConfigMap volume;
- Secret volume;
- projected volume;
- Downward API;
- `subPath`;
- permissões;
- ownership;
- `readOnly`;
- `fsGroup`;
- init containers;
- sidecars;
- `hostPath`;
- CSI;
- volumes efêmeros;
- persistência conceitual;
- limpeza;
- segurança;
- troubleshooting.

A primeira regra será:

```text
filesystem gravável
do container
não é storage persistente.
```

A imagem fornece camadas somente leitura.

O runtime adiciona uma camada gravável.

Essa camada normalmente pertence à instância do container.

Quando o container é substituído, essa camada pode ser descartada.

Mesmo quando um container reinicia dentro do mesmo Pod, o comportamento precisa ser entendido conforme o runtime e a forma de recriação.

A aplicação não deve assumir que arquivos locais sobrevivem a rollout, reschedule, remoção do Pod ou falha do node.

A segunda regra será:

```text
volume não significa
automaticamente persistência.
```

`emptyDir` é um volume.

Ele sobrevive ao restart de containers dentro do mesmo Pod.

Ele não sobrevive à remoção do Pod.

ConfigMap e Secret também são montados como volumes.

Eles não são storage de dados da aplicação.

São projeções de configuração e credenciais.

Um PersistentVolumeClaim pode fornecer storage com lifecycle independente do Pod.

Entretanto, nesta aula o PVC será explicado apenas de forma conceitual.

A prática ficará concentrada em volumes que não exigem provisionamento externo.

A terceira regra será:

```text
o lifecycle do volume
precisa combinar
com o lifecycle do dado.
```

Exemplos:

#### Cache descartável

Pode usar:

```text
emptyDir.
```

#### Arquivo temporário compartilhado entre containers

Pode usar:

```text
emptyDir.
```

#### Configuração

Pode usar:

```text
ConfigMap volume.
```

#### Credencial em arquivo

Pode usar:

```text
Secret volume.
```

#### Metadata do Pod

Pode usar:

```text
Downward API.
```

#### Banco de dados

Não deve depender de `emptyDir`.

Precisa de estratégia de persistência, backup e recovery.

Outro princípio será:

```text
volumeMount substitui
o conteúdo do path montado.
```

Se a imagem possui arquivos em:

```text
/etc/orders-api
```

e um volume é montado exatamente nesse path:

```text
o conteúdo original
fica oculto
enquanto o volume
estiver montado.
```

Isso não apaga as camadas da imagem.

Mas o container passa a enxergar o volume naquele ponto.

Esse comportamento causa muitos erros.

Por isso, paths de mount precisam ser planejados.

O `emptyDir` é criado com o Pod, começa vazio, pode ser compartilhado pelos containers e é removido com o Pod. É adequado para cache, workspace e dados regeneráveis; não para banco, upload durável, auditoria ou estado de negócio.

`emptyDir.medium: Memory` usa memória para dados temporários pequenos e rápidos, continua efêmero e precisa respeitar os limites do workload. A baseline usa disco do node e testa uma versão pequena em memória.

Init containers executam antes do container principal e podem preparar diretórios ou validar mounts. O laboratório grava um arquivo não sensível no `emptyDir`; se o init falhar, a aplicação não inicia.

ConfigMap e Secret podem projetar chaves como arquivos com nomes controlados por `items`. A aplicação precisa reler os arquivos para observar atualizações e nunca deve imprimir o conteúdo sensível.

`subPath` monta apenas um item e evita ocultar o diretório inteiro, mas não acompanha atualizações como uma projeção completa. O laboratório demonstrará essa diferença.

Permissões dependem de mode, UID, GID, `readOnly` e security context. O laboratório usa `fsGroup` compatível com o usuário não root e valida acesso ao `emptyDir`.

Montar Secret como volume não elimina risco. O mount precisa de path específico, read-only, menor escopo, permissões restritas, rotação e proibição de debug indiscriminado.

`emptyDir` em disco consome storage efêmero do node e pode contribuir para DiskPressure e eviction. O container receberá requests e limits didáticos de `ephemeral-storage`, sem substituir medição real.

O laboratório criará um arquivo no `emptyDir`, confirmará sua preservação após restart do container e seu desaparecimento após a substituição do Pod.

O laboratório comparará restart do container e replacement do Pod. No primeiro, o UID e o `emptyDir` permanecem; no segundo, o volume desaparece, o UID muda e o init container prepara um novo workspace.

Ao final, você deverá explicar:

```text
por que filesystem
do container
não é persistência;

qual é o lifecycle
do emptyDir;

como volumes
são montados;

como containers
compartilham arquivos;

como ConfigMap e Secret
viram arquivos;

como subPath
altera atualização;

como Downward API
fornece metadata;

como permissões
e fsGroup
afetam acesso;

por que hostPath
é perigoso;

como HPA
interage com volumes;

quando o dado exige
persistência real.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
532:
Ingress.

533:
HPA.

534:
Volumes Kubernetes.

535:
Helm conceitual.

536:
Helm Chart estrutura.
```

A aula 533 respondeu:

```text
como ajustar
réplicas automaticamente
com base em métricas?
```

A aula 534 responderá:

```text
como fornecer
arquivos e storage
ao Pod

com lifecycle,
permissões
e segurança explícitos?
```

Nesta aula:

```text
filesystem do container:
sim.

volumeMount:
sim.

emptyDir:
sim.

emptyDir Memory:
sim.

ConfigMap volume:
sim.

Secret volume:
sim.

projected volume:
sim.

Downward API:
sim.

subPath:
sim.

init container:
sim.

fsGroup:
sim.

readOnly:
sim.

ephemeral-storage:
sim.

hostPath:
explicado e proibido.

CSI:
conceitual.

PersistentVolume:
conceitual.

PersistentVolumeClaim:
conceitual.

StorageClass:
conceitual.

StatefulSet:
não.

Helm chart:
não.
```

A regra central será:

```text
o tipo do volume
define o lifecycle;

o mount define
como o container acessa;

a natureza do dado
define a escolha.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
k8s/workloads/deployment.yaml

k8s/volumes
├── volume-policy.yaml
├── emptydir-policy.yaml
├── projected-volume-policy.yaml
├── persistent-storage-decision.yaml
└── volume-observability-contract.yaml

scripts/kubernetes/volumes
├── validate-volume-manifest.ps1
├── apply-volume-baseline.ps1
├── inspect-pod-volumes.ps1
├── create-runtime-file.ps1
├── restart-container-safely.ps1
├── replace-pod-and-verify-volume.ps1
├── verify-projected-files.ps1
├── collect-volume-evidence.ps1
└── restore-volume-baseline.ps1

docs/devops/kubernetes-volumes
├── CONTAINER_FILESYSTEM_VS_VOLUME.md
├── EMPTYDIR_LIFECYCLE.md
├── CONFIGMAP_SECRET_VOLUMES.md
├── PROJECTED_VOLUMES.md
├── VOLUME_PERMISSIONS.md
├── HOSTPATH_SECURITY.md
├── CSI_AND_PERSISTENCE_OVERVIEW.md
├── VOLUME_RUNBOOK.md
├── VOLUME_TEST_MATRIX.md
└── VOLUME_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
emptyDir gravável;

init container;

arquivo inicial;

arquivo runtime;

restart de container;

arquivo preservado;

replacement de Pod;

emptyDir resetado;

ConfigMap montada;

Secret montado;

metadata projetada;

token automático desativado;

evidência sanitizada.
```

Você irá:

1. confirmar cluster;
2. confirmar HPA;
3. confirmar duas réplicas;
4. revisar mounts existentes;
5. criar policies;
6. adicionar emptyDir;
7. adicionar init container;
8. adicionar projected volume;
9. adicionar Downward API;
10. desativar token automático;
11. configurar fsGroup;
12. configurar ephemeral storage;
13. aplicar Deployment;
14. observar rollout;
15. inspecionar volumes;
16. validar init container;
17. criar arquivo runtime;
18. reiniciar container;
19. confirmar arquivo preservado;
20. remover Pod;
21. confirmar UID novo;
22. confirmar emptyDir resetado;
23. validar ConfigMap;
24. validar Secret sem divulgar;
25. validar metadata;
26. simular mount path incorreto;
27. simular permissão incorreta;
28. simular subPath;
29. restaurar;
30. criar scripts;
31. criar docs;
32. coletar evidence;
33. executar gate;
34. commitar;
35. preparar a aula 535.

---

## Conceito essencial

### Volume

Fonte de armazenamento declarada no PodSpec.

---

### VolumeMount

Associação entre um volume e um path de container.

---

### Container writable layer

Camada gravável da instância do container.

Não representa persistência garantida.

---

### `emptyDir`

Volume criado para o Pod e removido com o Pod.

---

### `emptyDir.medium: Memory`

Volume efêmero mantido em memória.

---

### ConfigMap volume

Projeta chaves de ConfigMap como arquivos.

---

### Secret volume

Projeta chaves de Secret como arquivos.

---

### Projected volume

Combina várias fontes em um único mount.

---

### Downward API

Projeta metadata e informações do próprio Pod.

---

### `subPath`

Monta somente uma parte do volume em um path específico.

---

### Init container

Container executado antes dos containers principais.

---

### `fsGroup`

Grupo aplicado ao contexto de volumes conforme suporte do volume e runtime.

---

### `readOnly`

Impede gravação pelo mount quando suportado.

---

### `hostPath`

Monta um path do node.

Possui alto risco.

---

### CSI

Interface para integração de drivers de storage.

---

### PersistentVolume

Resource conceitual que representa storage do cluster.

Não será criado nesta aula.

---

### PersistentVolumeClaim

Solicitação de storage por um workload.

Não será criada nesta aula.

---

## Mão na massa guiada

### 1. Confirmar o context

Execute:

```powershell
kubectl config current-context
```

Resultado esperado:

```text
kind-formacao-java.
```

Depois:

```powershell
.\scripts\kubernetes\kubernetes-preflight.ps1
```

---

### 2. Confirmar a baseline

Execute:

```powershell
kubectl get deployment,pod,service,endpointslice,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

```text
Deployment disponível;

HPA ativo;

mínimo de 2 réplicas;

Service saudável;

Ingress saudável.
```

---

### 3. Revisar os mounts existentes

Execute:

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.template.spec.volumes}"
```

Depois:

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.template.spec.containers[0].volumeMounts}"
```

Registre ConfigMap e Secret já existentes.

---

### 4. Criar a policy de volumes

Arquivo:

```text
k8s/volumes/volume-policy.yaml
```

Conteúdo conceitual:

```yaml
volumes:
  hostPath:
    allowed:
      false

  secrets:
    readOnly:
      required

  configMaps:
    readOnly:
      required

  serviceAccountToken:
    automount:
      false

  writable:
    paths:
      allowlist:
        - /var/lib/orders-api/runtime

  evidence:
    sensitiveContent:
      forbidden
```

---

### 5. Criar policy de `emptyDir`

Arquivo:

```text
emptydir-policy.yaml
```

Inclua:

- dados descartáveis;
- tamanho controlado;
- cleanup;
- nenhum dado de negócio;
- nenhum backup presumido;
- ephemeral-storage observado;
- memory medium somente para dados pequenos.

---

### 6. Atualizar o Deployment

No Pod template, adicione:

```yaml
spec:
  automountServiceAccountToken:
    false

  securityContext:
    fsGroup:
      10001

    fsGroupChangePolicy:
      OnRootMismatch
```

Confirme o UID e GID da imagem antes de fixar o valor.

---

### 7. Adicionar o `emptyDir`

Em `volumes`:

```yaml
  - name:
      runtime-data

    emptyDir:
      sizeLimit:
        256Mi
```

`sizeLimit` é uma proteção.

---

### 8. Montar o `emptyDir`

No container principal:

```yaml
volumeMounts:
  - name:
      runtime-data

    mountPath:
      /var/lib/orders-api/runtime
```

Não monte sobre um diretório que contenha arquivos necessários da imagem sem revisar o efeito.

---

### 9. Adicionar init container

No PodSpec:

```yaml
initContainers:
  - name:
      prepare-runtime-directory

    image:
      busybox:1.36

    command:
      - sh
      - -c
      - |
        set -eu
        printf '%s\n' \
          "prepared-by-init-container" \
          > /runtime/bootstrap.txt
        chmod 0660 /runtime/bootstrap.txt

    resources:
      requests:
        cpu:
          10m

        memory:
          16Mi

      limits:
        cpu:
          50m

        memory:
          32Mi

    volumeMounts:
      - name:
          runtime-data

        mountPath:
          /runtime
```

Em ambiente produtivo, a imagem do init container também precisa ser pinada por digest.

No laboratório, a versão explícita evita `latest`.

---

### 10. Criar o projected volume

Adicione:

```yaml
  - name:
      pod-metadata

    projected:
      defaultMode:
        292

      sources:
        - configMap:
            name:
              orders-api-config

            items:
              - key:
                  application-runtime.properties

                path:
                  runtime/application-runtime.properties

        - downwardAPI:
            items:
              - path:
                  metadata/pod-name

                fieldRef:
                  fieldPath:
                    metadata.name

              - path:
                  metadata/pod-namespace

                fieldRef:
                  fieldPath:
                    metadata.namespace

              - path:
                  metadata/pod-labels

                fieldRef:
                  fieldPath:
                    metadata.labels
```

O valor decimal:

```text
292
```

corresponde a:

```text
0444.
```

---

### 11. Montar o projected volume

No container:

```yaml
  - name:
      pod-metadata

    mountPath:
      /etc/orders-api/projected

    readOnly:
      true
```

---

### 12. Manter o Secret separado

O mount existente do Secret continua:

```yaml
  - name:
      provider-token

    mountPath:
      /var/run/secrets/orders-api

    readOnly:
      true
```

Não combine o Secret no projected volume desta baseline.

A separação deixa o path sensível explícito.

---

### 13. Adicionar ephemeral storage

Nos resources do container principal:

```yaml
requests:
  cpu:
    100m

  memory:
    256Mi

  ephemeral-storage:
    64Mi

limits:
  cpu:
    500m

  memory:
    512Mi

  ephemeral-storage:
    256Mi
```

Os valores são didáticos.

Precisam ser medidos em um ambiente real.

---

### 14. Validar o manifest

Execute:

```powershell
kubectl apply `
  --server-side `
  --dry-run=server `
  -f `
  "k8s/workloads/deployment.yaml"
```

O validator também verifica:

- nenhum `hostPath`;
- mounts com nomes existentes;
- paths sem colisão;
- Secrets read-only;
- ConfigMaps read-only;
- token automático desativado;
- init container com resources;
- emptyDir com size limit;
- UID e GID coerentes.

---

### 15. Aplicar o Deployment

```powershell
kubectl apply `
  -f `
  "k8s/workloads/deployment.yaml"
```

Acompanhe:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-dev `
  --timeout `
  180s
```

---

### 16. Inspecionar init containers

Escolha um Pod:

```powershell
$PodName = kubectl get pods `
  --namespace `
  formacao-java-dev `
  -l `
  "app.kubernetes.io/instance=orders-api-dev" `
  -o `
  "jsonpath={.items[0].metadata.name}"
```

Depois:

```powershell
kubectl get pod `
  $PodName `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.status.initContainerStatuses}"
```

Confirme término com sucesso.

---

### 17. Validar o arquivo inicial

```powershell
kubectl exec `
  $PodName `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -s /var/lib/orders-api/runtime/bootstrap.txt"
```

Não é necessário imprimir o conteúdo.

---

### 18. Criar arquivo de runtime

Execute:

```powershell
.\scripts\kubernetes\volumes\create-runtime-file.ps1 `
  -PodName `
  $PodName `
  -FileName `
  "runtime-check.txt"
```

O script grava apenas um identificador não sensível.

---

### 19. Registrar UID e restart count

```powershell
kubectl get pod `
  $PodName `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.metadata.uid}{'\n'}{.status.containerStatuses[0].restartCount}{'\n'}"
```

---

### 20. Reiniciar o container no mesmo Pod

O script:

```text
restart-container-safely.ps1
```

ativa um cenário local que encerra apenas o processo principal.

O kubelet reinicia o container.

O Pod UID precisa permanecer o mesmo.

O script não pode deletar o Pod nessa etapa.

---

### 21. Confirmar preservação no mesmo Pod

Após o restart:

```powershell
kubectl exec `
  $PodName `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -f /var/lib/orders-api/runtime/runtime-check.txt"
```

Confirme:

- mesmo Pod UID;
- restart count maior;
- arquivo ainda presente;
- Pod voltou a Ready.

---

### 22. Remover o Pod

Execute:

```powershell
kubectl delete pod `
  $PodName `
  --namespace `
  formacao-java-dev
```

O Deployment criará outra réplica.

---

### 23. Encontrar o novo Pod

Aguarde o Deployment:

```powershell
kubectl wait `
  --for=condition=Available `
  deployment/orders-api `
  --namespace `
  formacao-java-dev `
  --timeout `
  180s
```

Escolha o Pod novo e compare o UID.

---

### 24. Confirmar reset do `emptyDir`

No novo Pod:

```powershell
kubectl exec `
  <novo-pod> `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test ! -f /var/lib/orders-api/runtime/runtime-check.txt"
```

O arquivo `bootstrap.txt` deve existir porque o init container executou novamente.

---

### 25. Validar ConfigMap projetada

```powershell
kubectl exec `
  <novo-pod> `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -f /etc/orders-api/projected/runtime/application-runtime.properties"
```

---

### 26. Validar Downward API

```powershell
kubectl exec `
  <novo-pod> `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -s /etc/orders-api/projected/metadata/pod-name"
```

O script compara o nome projetado com o nome real sem publicar todo o arquivo de labels.

---

### 27. Validar Secret sem divulgação

```powershell
kubectl exec `
  <novo-pod> `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -s /var/run/secrets/orders-api/provider-token"
```

O conteúdo não é impresso.

---

### 28. Validar ausência do token automático

```powershell
kubectl get pod `
  <novo-pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.automountServiceAccountToken}"
```

Resultado esperado:

```text
false.
```

O path padrão do token não deve estar montado.

---

### 29. Simular mount path incorreto

Altere temporariamente o mount do `emptyDir` para um path que esconda configuração necessária.

Execute apenas server-side dry-run e validator.

A policy deve bloquear paths proibidos.

Não aplique uma alteração que derrube todas as réplicas.

Restaure.

---

### 30. Simular permissão incorreta

Em branch de laboratório, altere temporariamente `fsGroup` para um grupo incompatível.

Aplique em apenas uma revisão controlada quando o ambiente permitir.

Observe:

- init container;
- permission denied;
- Pod não Ready;
- events;
- logs.

Restaure o valor correto.

---

### 31. Simular `subPath`

Monte temporariamente o arquivo de ConfigMap com:

```yaml
subPath:
  application-runtime.properties
```

Atualize a ConfigMap.

Observe que o arquivo montado por `subPath` não acompanha a projeção da mesma forma.

Restaure o mount completo.

---

### 32. Testar `emptyDir` em memória

Crie um Pod temporário no namespace de laboratório com:

```yaml
emptyDir:
  medium:
    Memory

  sizeLimit:
    16Mi
```

Grave um arquivo pequeno.

Observe o mount.

Delete o Pod.

O manifest temporário não entra no Git.

---

### 33. Criar decisão de persistência

Arquivo:

```text
persistent-storage-decision.yaml
```

Campos:

```yaml
data:
  classification:
    transient

  survivesContainerRestart:
    required

  survivesPodReplacement:
    notRequired

  sharedBetweenReplicas:
    false

  backup:
    notRequired

  selectedVolume:
    emptyDir
```

Crie exemplos documentais para:

- cache;
- upload;
- banco;
- certificado;
- configuração.

---

### 34. Criar observability contract

Arquivo:

```text
volume-observability-contract.yaml
```

Campos:

- Pod UID;
- restart count;
- init container result;
- mount list;
- filesystem usage;
- ephemeral storage request;
- ephemeral storage limit;
- file survived container restart;
- file survived Pod replacement;
- permission result;
- projected file result;
- Secret disclosure false.

---

### 35. Criar scripts

Os scripts precisam:

- exigir context permitido;
- exigir namespace permitido;
- nunca imprimir Secret;
- usar timeout;
- comparar UIDs;
- restaurar manifests;
- validar Pods Ready;
- respeitar HPA;
- não escalar manualmente sem restauração;
- remover Pods temporários;
- falhar se `hostPath` existir.

---

### 36. Criar evidence

Arquivo:

```text
kubernetes-volume-evidence.json.
```

Campos permitidos:

- context;
- namespace;
- Deployment;
- Pod old name;
- Pod old UID;
- Pod new name;
- Pod new UID;
- volume types;
- init container succeeded;
- runtime file created;
- container restart observed;
- runtime file survived restart;
- Pod replacement observed;
- runtime file absent after replacement;
- bootstrap file recreated;
- ConfigMap file present;
- Secret file present;
- projected metadata present;
- automount token false;
- ephemeral storage configured;
- baseline restored;
- timestamp.

Sem conteúdo dos arquivos sensíveis.

---

### 37. Criar documentação

#### `CONTAINER_FILESYSTEM_VS_VOLUME.md`

Explique camadas e lifecycle.

#### `EMPTYDIR_LIFECYCLE.md`

Explique restart versus replacement.

#### `CONFIGMAP_SECRET_VOLUMES.md`

Explique projeção, atualização e segurança.

#### `PROJECTED_VOLUMES.md`

Explique múltiplas sources e Downward API.

#### `VOLUME_PERMISSIONS.md`

Explique mode, UID, GID, `fsGroup` e read-only.

#### `HOSTPATH_SECURITY.md`

Explique riscos e proibição.

#### `CSI_AND_PERSISTENCE_OVERVIEW.md`

Explique drivers e decisão de persistência sem implementar PVC.

---

### 38. Criar runbook

Arquivo:

```text
VOLUME_RUNBOOK.md
```

Passos:

1. preflight;
2. revisar volume types;
3. validar paths;
4. validar permissions;
5. dry-run;
6. apply;
7. observar init;
8. testar restart;
9. testar replacement;
10. validar projeções;
11. coletar evidence;
12. restaurar baseline.

---

### 39. Criar test matrix

Arquivo:

```text
VOLUME_TEST_MATRIX.md
```

Cenários:

- emptyDir criado;
- init container concluído;
- arquivo inicial presente;
- arquivo runtime criado;
- container reiniciado;
- arquivo preservado;
- Pod substituído;
- arquivo runtime removido;
- bootstrap recriado;
- ConfigMap montada;
- Secret montado;
- Downward API montada;
- token automático ausente;
- path proibido;
- permission denied;
- subPath sem atualização;
- memory emptyDir;
- size limit;
- hostPath bloqueado;
- evidence sanitizada;
- baseline restaurada.

---

### 40. Criar troubleshooting

Arquivo:

```text
VOLUME_TROUBLESHOOTING.md
```

Inclua:

- mount path oculta arquivos;
- volume não encontrado;
- mount name divergente;
- permission denied;
- init container em loop;
- Pod preso em Init;
- ConfigMap não atualiza;
- `subPath` permanece antigo;
- Secret file ausente;
- `fsGroup` incompatível;
- emptyDir cheio;
- ephemeral storage pressure;
- eviction;
- Pod replacement perdeu arquivo;
- token automático presente;
- hostPath detectado;
- HPA cria réplica sem preparação correta.

---

### 41. Restaurar a baseline

Execute:

```powershell
.\scripts\kubernetes\volumes\restore-volume-baseline.ps1
```

Confirme:

```text
Deployment Available;

HPA ativo;

mínimo de 2 réplicas;

Pods Ready;

Service e Ingress saudáveis;

ConfigMap montada;

Secret montado;

projected metadata presente;

emptyDir funcional;

automount token false;

nenhum cenário temporário ativo.
```

---

### 42. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\volumes\validate-volume-manifest.ps1

.\scripts\kubernetes\volumes\apply-volume-baseline.ps1

.\scripts\kubernetes\volumes\inspect-pod-volumes.ps1

.\scripts\kubernetes\volumes\verify-projected-files.ps1

.\scripts\kubernetes\volumes\collect-volume-evidence.ps1

.\scripts\kubernetes\volumes\restore-volume-baseline.ps1
```

Finalize:

```powershell
kubectl get deployment,pod,service,endpointslice,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme que nenhum arquivo de Secret foi exportado.

---

## Entendendo o que foi feito

### O filesystem do container ganhou limite claro

Arquivos locais não foram tratados como persistência.

### O `emptyDir` ganhou lifecycle observável

Ele sobreviveu ao restart de container e desapareceu com o Pod.

### O init container ganhou função real

O workspace foi preparado antes da aplicação.

### ConfigMap e Secret permaneceram separados

Configuração e credencial mantiveram paths distintos.

### Metadata chegou sem acesso à API

Downward API forneceu identidade do Pod.

### Permissões entraram no contrato

`fsGroup`, read-only e modes foram validados.

### O token automático foi removido

A aplicação permaneceu sem necessidade de acessar a API Kubernetes.

### HPA continuou compatível

Cada réplica recebeu seu próprio `emptyDir`.

### Persistência ganhou critérios

Dado descartável foi separado de dado de negócio.

### A próxima aula ganhou matéria-prima

Helm poderá organizar manifests sem alterar os princípios de volume.

---

## Erros comuns importantes

### Gravar dado de negócio em `emptyDir`

O dado desaparece com o Pod.

### Confundir restart com replacement

O lifecycle do volume é diferente.

### Montar volume sobre diretório importante

Arquivos da imagem ficam ocultos.

### Usar `hostPath` por conveniência

O Pod ganha acesso perigoso ao node.

### Imprimir conteúdo de Secret montado

O volume vira uma fonte de vazamento.

### Usar `subPath` esperando hot reload

A atualização pode não aparecer.

### Omitir resources do init container

Capacity planning fica incompleto.

### Ignorar ephemeral storage

O node pode sofrer pressão e eviction.

### Usar `fsGroup` incompatível

A aplicação recebe permission denied.

### Habilitar token da ServiceAccount sem necessidade

A superfície de acesso aumenta.

### Compartilhar `emptyDir` entre Pods

Cada Pod possui seu próprio volume.

### Antecipar Helm

A aula 535 possui esse objetivo.

---

## Comandos úteis

### Inspecionar volumes do Pod

```powershell
kubectl get pod `
  <pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.volumes}"
```

### Inspecionar mounts

```powershell
kubectl get pod `
  <pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.containers[0].volumeMounts}"
```

### Inspecionar init container

```powershell
kubectl get pod `
  <pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.status.initContainerStatuses}"
```

### Consultar filesystem

```powershell
kubectl exec `
  <pod> `
  --namespace `
  formacao-java-dev `
  -- `
  df `
  -h
```

### Consultar permissões

```powershell
kubectl exec `
  <pod> `
  --namespace `
  formacao-java-dev `
  -- `
  ls `
  -ln `
  /var/lib/orders-api/runtime
```

---

## Exercício guiado

### Parte 1 — Baseline

Revise volumes existentes.

### Parte 2 — EmptyDir

Crie workspace efêmero.

### Parte 3 — Init

Prepare o volume.

### Parte 4 — Projected

Monte ConfigMap e metadata.

### Parte 5 — Permissions

Valide UID, GID e read-only.

### Parte 6 — Restart

Comprove preservação no mesmo Pod.

### Parte 7 — Replacement

Comprove reset no Pod novo.

### Parte 8 — Security

Desative token e bloqueie hostPath.

### Parte 9 — Storage decision

Classifique dados transitórios e persistentes.

### Parte 10 — Restore

Retorne à baseline saudável.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 533 foi preservada;
- volume foi definido;
- volumeMount foi definido;
- writable layer foi definida;
- `emptyDir` foi definido;
- `emptyDir.medium: Memory` foi definido;
- ConfigMap volume foi definido;
- Secret volume foi definido;
- projected volume foi definido;
- Downward API foi definida;
- `subPath` foi definido;
- init container foi definido;
- `fsGroup` foi definido;
- read-only foi definido;
- `hostPath` foi definido como risco;
- CSI foi definido;
- PersistentVolume foi explicado;
- PersistentVolumeClaim foi explicado;
- context kind foi validado;
- preflight foi executado;
- Deployment foi validado;
- HPA permaneceu ativo;
- Service foi validado;
- Ingress foi validado;
- mounts existentes foram inspecionados;
- policy de volumes foi criada;
- hostPath foi proibido;
- Secrets read-only foram exigidos;
- ConfigMaps read-only foram exigidos;
- token automático foi desabilitado;
- allowlist de path gravável foi criada;
- policy de emptyDir foi criada;
- dado de negócio foi proibido em emptyDir;
- securityContext foi configurado;
- `fsGroup` foi validado com a imagem;
- `fsGroupChangePolicy` foi usado;
- emptyDir foi criado;
- sizeLimit foi definido;
- mount runtime foi criado;
- path não ocultou arquivo necessário;
- init container foi criado;
- imagem do init container não usou latest;
- init container possui requests;
- init container possui limits;
- arquivo bootstrap foi criado;
- projected volume foi criado;
- ConfigMap foi projetada;
- Downward API foi projetada;
- defaultMode foi definido;
- projected volume foi read-only;
- Secret permaneceu separado;
- Secret mount permaneceu read-only;
- ephemeral-storage request foi criado;
- ephemeral-storage limit foi criado;
- valores foram classificados como didáticos;
- server-side dry-run foi executado;
- validator bloqueou hostPath;
- validator verificou nomes de mounts;
- validator verificou colisões de path;
- validator verificou token automático;
- Deployment foi aplicado;
- rollout foi acompanhado;
- init container terminou com sucesso;
- arquivo bootstrap foi validado;
- arquivo runtime foi criado;
- Pod UID foi registrado;
- restart count foi registrado;
- container foi reiniciado sem deletar Pod;
- UID permaneceu;
- restart count aumentou;
- arquivo runtime sobreviveu;
- Pod voltou a Ready;
- Pod foi removido;
- Deployment criou substituto;
- novo UID foi confirmado;
- arquivo runtime não existiu no novo Pod;
- bootstrap foi recriado;
- ConfigMap projetada foi validada;
- Downward API foi validada;
- Secret foi validado sem divulgação;
- automount do token ficou falso;
- token padrão não foi montado;
- path incorreto foi simulado no validator;
- alteração perigosa não foi aplicada;
- permissão incorreta foi simulada;
- permission denied foi observado;
- baseline de permissions foi restaurada;
- subPath foi simulado;
- ausência de atualização foi observada;
- mount completo foi restaurado;
- emptyDir em memória foi testado;
- arquivo pequeno foi usado;
- Pod temporário foi removido;
- manifest temporário não foi commitado;
- decisão de persistência foi criada;
- cache foi classificado;
- upload foi classificado;
- banco foi classificado;
- certificado foi classificado;
- observability contract foi criado;
- scripts exigem context permitido;
- scripts exigem namespace permitido;
- scripts não imprimem Secret;
- scripts comparam UIDs;
- scripts respeitam HPA;
- evidence foi criada;
- evidence não contém Secret;
- evidence não contém kubeconfig;
- evidence contém old e new UID;
- evidence registra lifecycle;
- documentação de filesystem foi criada;
- documentação de emptyDir foi criada;
- documentação de ConfigMap e Secret foi criada;
- documentação de projected volume foi criada;
- documentação de permissions foi criada;
- documentação de hostPath foi criada;
- visão geral de CSI foi criada;
- runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- PersistentVolume não foi criado;
- PersistentVolumeClaim não foi criado;
- StorageClass não foi criada;
- StatefulSet não foi criado;
- Helm chart não foi criado;
- baseline foi restaurada;
- HPA permaneceu saudável;
- duas réplicas Ready foram confirmadas;
- Service e Ingress ficaram saudáveis;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 535 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/volumes `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/workloads/deployment.yaml `
  scripts/kubernetes/volumes `
  docs/devops/kubernetes-volumes `
  docs/diario-de-bordo.md
```

Adicione código de suporte ao restart apenas quando estiver isolado ao profile local, limitado e testado.

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível e mounts perigosos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "hostPath:|provider-token|client-key-data|token:"
```

Nomes e referências podem ser legítimos.

Valores não.

Commit recomendado:

```powershell
git commit -m "feat(m17): estruturar volumes Kubernetes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- conteúdo de Secret;
- token;
- arquivo exportado do mount;
- evidence não sanitizada;
- Pod temporário;
- manifest de teste em memória;
- path hostPath;
- volume persistente;
- PVC;
- StorageClass;
- chart Helm da aula 535.

---

## Fechamento e ponte para a próxima aula

Nesta aula, storage deixou de ser tratado como uma pasta genérica dentro do container.

O workload passou a diferenciar:

```text
container writable layer;

emptyDir;

ConfigMap volume;

Secret volume;

projected volume;

Downward API;

persistência conceitual.
```

Você comprovou que:

- filesystem do container não é persistência;
- volume pertence ao Pod;
- mount pertence ao container;
- `emptyDir` sobrevive ao restart de container;
- `emptyDir` desaparece com o Pod;
- init container pode preparar o workspace;
- ConfigMap e Secret podem ser projetados como arquivos;
- `subPath` altera o comportamento de atualização;
- Downward API fornece metadata sem acesso à API;
- `fsGroup` e modes controlam acesso;
- token automático pode ser desabilitado;
- `hostPath` amplia o risco;
- HPA cria Pods com volumes efêmeros independentes;
- dados de negócio exigem decisão de persistência, backup e recovery.

A próxima aula será:

```text
535 - M17.30 - Helm conceitual
```

Nela, você irá compreender por que vários manifests relacionados precisam de empacotamento, parametrização, release, versionamento e renderização controlada.

Nenhum chart, template, `values.yaml` ou release Helm da aplicação foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei e montei o `emptyDir`.
- [ ] Usei init container.
- [ ] Projetei ConfigMap e metadata.
- [ ] Validei o Secret sem imprimir.
- [ ] Testei restart do container.
- [ ] Testei replacement do Pod.
- [ ] Bloqueei hostPath.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O init container não termina

Consulte logs do init container, mount e permissions.

### O Pod fica em `Init:CrashLoopBackOff`

O comando de preparação ou o volume pode estar incorreto.

### O arquivo existe após restart, mas some após delete

Esse é o lifecycle esperado do `emptyDir`.

### O arquivo da imagem desapareceu

Um mount pode estar ocultando o diretório original.

### O container recebe `Permission denied`

Revise UID, GID, `fsGroup`, mode e ownership.

### A ConfigMap montada não atualiza

Revise atraso de projeção, aplicação e uso de `subPath`.

### O Secret não aparece

Revise nome, namespace, items e permissions sem imprimir conteúdo.

### O Pod possui token da ServiceAccount

Confirme `automountServiceAccountToken: false`.

### O node entra em DiskPressure

Revise `emptyDir`, logs, images e ephemeral storage.

### O Pod é evicted

Consulte events e pressão de recursos do node.

### O HPA cria Pods com diretórios vazios

Cada Pod recebe seu próprio `emptyDir`.

### Um chart Helm apareceu nesta aula

Remova e preserve para a aula 535.

---

## Perguntas de revisão

1. O que é volume Kubernetes?
2. O que é `volumeMount`?
3. O filesystem do container é persistente?
4. Qual é o lifecycle do `emptyDir`?
5. O `emptyDir` sobrevive ao restart de container?
6. O `emptyDir` sobrevive ao delete do Pod?
7. Para que serve init container?
8. O que é projected volume?
9. O que faz a Downward API?
10. Para que serve `subPath`?
11. Qual é o risco do `subPath`?
12. Para que serve `fsGroup`?
13. Por que montar Secret como read-only?
14. Por que desativar o token automático?
15. Qual é o risco de `hostPath`?
16. O que é CSI?
17. O que é PersistentVolume?
18. O que é PersistentVolumeClaim?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fonte de armazenamento do Pod.
2. Mount no container.
3. Não de forma garantida.
4. Existe enquanto o Pod existe.
5. Sim.
6. Não.
7. Preparar o Pod.
8. Combinar fontes.
9. Expor metadata.
10. Montar item específico.
11. Atualização não acompanha igual.
12. Grupo para acesso.
13. Reduzir alteração.
14. Menor privilégio.
15. Exposição do node.
16. Interface de drivers.
17. Storage do cluster.
18. Solicitação de storage.
19. Helm e PVC real.
20. Helm conceitual.

---

## Desafio opcional

Crie um sidecar de observação temporária.

Requisitos:

- mesmo `emptyDir`;
- aplicação grava um arquivo não sensível;
- sidecar lê sem alterar;
- resources próprios;
- read-only no sidecar quando possível;
- shutdown controlado;
- nenhum Secret;
- nenhum hostPath;
- evidence;
- remoção ao final.

O objetivo é compreender compartilhamento de volume entre containers do mesmo Pod sem transformar o sidecar em solução definitiva de logs.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 534 - M17.29 - Volumes Kubernetes

- Continuei após HPA.
- Diferenciei filesystem gravável do container e volume.
- Defini o lifecycle do `emptyDir`.
- Diferenciei restart de container e replacement de Pod.
- Estudei `emptyDir` em disco e em memória.
- Revisei ConfigMap e Secret como volumes.
- Estudei projected volumes.
- Usei Downward API para metadata do Pod.
- Estudei `subPath` e sua limitação de atualização.
- Adicionei init container.
- Preparei um workspace compartilhado.
- Configurei `fsGroup` e mounts read-only.
- Desativei o token automático da ServiceAccount.
- Adicionei requests e limits de ephemeral storage.
- Criei arquivo de runtime no `emptyDir`.
- Reiniciei o container no mesmo Pod.
- Confirmei que o arquivo sobreviveu.
- Removi o Pod.
- Confirmei novo UID e reset do `emptyDir`.
- Confirmei que o init container recriou o bootstrap.
- Validei ConfigMap, Secret e metadata projetada.
- Simulei path incorreto, permission denied e `subPath`.
- Testei um `emptyDir` pequeno em memória.
- Proibi `hostPath`.
- Documentei CSI, PV e PVC conceitualmente.
- Criei policies, scripts, evidence e troubleshooting.
- Mantive HPA, Service e Ingress saudáveis.
- Não antecipei Helm.
- Próxima aula: Helm conceitual.
```

---

## Referência técnica curta

- Kubernetes Volumes.
- Kubernetes `emptyDir`.
- Kubernetes ConfigMap Volumes.
- Kubernetes Secret Volumes.
- Kubernetes Projected Volumes.
- Kubernetes Downward API.
- Kubernetes Init Containers.
- Kubernetes Security Context.
- Kubernetes Ephemeral Storage.
- Container Storage Interface.

Regra final:

```text
volumes Kubernetes desacoplam o path visto pelo container da fonte de armazenamento declarada no Pod: a writable layer do container não é persistência, `emptyDir` sobrevive a restarts de containers no mesmo Pod e desaparece quando o Pod é substituído, ConfigMap e Secret projetam arquivos read-only e projected volumes podem combinar configuração com Downward API sem conceder acesso à API; init containers preparam o workspace antes da aplicação, `fsGroup`, modes, UID, GID e mounts read-only controlam acesso, `subPath` monta um item específico mas não acompanha atualizações da mesma forma, e o token automático da ServiceAccount é desabilitado quando não há necessidade; ephemeral storage recebe requests, limits e observação, `hostPath` é bloqueado pelo risco de expor o node, e CSI, PV e PVC são tratados como decisões de persistência, backup e recovery sem implementação antecipada; após comprovar preservação no restart e reset no replacement, a baseline mantém HPA, Service e Ingress saudáveis, deixando para a aula 535 o empacotamento conceitual dos manifests com Helm.
```
