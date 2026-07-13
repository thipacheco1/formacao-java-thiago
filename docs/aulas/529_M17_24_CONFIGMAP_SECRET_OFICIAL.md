# 529 - M17.24 - ConfigMap Secret

## Apresentação da aula

Na aula 528, a imagem da aplicação entrou no cluster Kubernetes.

O laboratório passou a possuir:

```text
namespace;

Pod isolado;

Deployment;

ReplicaSet;

Service;

EndpointSlice;

probes;

requests;

limits;

self-healing;

port-forward.
```

Você comprovou que:

```text
Pod executa;

Deployment mantém;

Service estabiliza o acesso.
```

O Deployment, entretanto, ainda possui valores operacionais misturados ao manifest do workload.

Exemplos:

- profile ativo;
- modo do provider;
- nível de log;
- URL pública;
- host do banco;
- bootstrap servers do Kafka;
- token de integração;
- senha de banco;
- chave de API.

Quando esses valores ficam diretamente no Deployment, aparecem problemas.

```text
o mesmo manifest
precisa ser editado
para cada ambiente;

credenciais podem
entrar no Git;

a aplicação precisa
de novo rollout
para qualquer alteração;

configuração e workload
ficam acoplados;

review de infraestrutura
se mistura com review
de credencial.
```

A pergunta central desta aula será:

```text
como retirar
configuração e credenciais
do manifest do Deployment

e injetá-las
de forma explícita,
auditável
e separada?
```

A resposta será construída com dois resources:

```text
ConfigMap;

Secret.
```

#### ConfigMap

Armazena configuração não sensível.

Exemplos:

- profile;
- log level;
- endpoint público;
- nome de tópico;
- feature flag;
- timeout;
- modo de provider;
- conteúdo de arquivo de configuração.

#### Secret

Armazena dados sensíveis usados pelo workload.

Exemplos:

- senha;
- token;
- chave;
- certificado;
- client secret;
- connection string com credencial.

A regra central será:

```text
ConfigMap não recebe segredo;

Secret não transforma
um valor inseguro
em seguro apenas
porque está no cluster.
```

Kubernetes Secrets oferecem uma API própria, integração com RBAC e mecanismos de montagem e injeção.

Entretanto:

```text
Secret não significa
criptografia automática
de ponta a ponta.
```

No manifest, o campo:

```yaml
data:
```

usa valores codificados em Base64.

Base64 é encoding.

Não é criptografia.

Qualquer pessoa com acesso ao valor codificado consegue decodificá-lo.

O campo:

```yaml
stringData:
```

aceita texto legível e o API Server o converte para `data`.

Isso facilita uso manual.

Também torna evidente que um manifest com `stringData` contendo credencial real não pode entrar no Git.

Nesta aula, nenhum valor sensível real será versionado.

O repositório possuirá:

- ConfigMap declarativa;
- contrato de configuração;
- política de Secret;
- script seguro para criação;
- script para rotação;
- validações;
- documentação.

O Secret real será criado no cluster local por script.

O script solicitará valores falsos de laboratório de forma interativa.

Os valores não serão colocados:

- no YAML versionado;
- no histórico do shell;
- no diário de bordo;
- no artifact;
- no summary;
- nos logs;
- nas annotations;
- nas labels.

A aplicação receberá configuração de três maneiras.

#### Variável explícita com `valueFrom`

Exemplo:

```yaml
env:
  - name:
      APP_LOG_LEVEL

    valueFrom:
      configMapKeyRef:
        name:
          orders-api-config

        key:
          APP_LOG_LEVEL
```

#### Grupo de variáveis com `envFrom`

Exemplo:

```yaml
envFrom:
  - configMapRef:
      name:
        orders-api-config
```

Essa abordagem é curta.

Também injeta todas as chaves compatíveis.

Em workloads críticos, referências explícitas deixam o contrato mais visível.

#### Arquivo montado em volume

Exemplo:

```text
/etc/orders-api/runtime/application.properties;

/var/run/secrets/orders-api/provider-token.
```

Arquivos montados são úteis quando:

- a aplicação espera arquivo;
- o valor é multilinha;
- existe certificado;
- existe chave;
- a ferramenta não aceita environment variable;
- a rotação precisa ser observada sem expor argumentos.

A aula utilizará uma combinação consciente:

```text
ConfigMap:

variáveis não sensíveis
e arquivo de runtime.

Secret:

referências explícitas
e arquivo montado
para um token fake.
```

Outro ponto será atualização.

Quando ConfigMap ou Secret é usado como environment variable:

```text
o valor é lido
na criação do container.
```

Alterar o resource não modifica a variável dentro de um Pod já iniciado.

É necessário:

- recriar o Pod;
- executar rollout restart;
- alterar o Pod template;
- usar uma automação de reload;
- utilizar mecanismo específico da aplicação.

Quando ConfigMap ou Secret é montado como volume, o kubelet pode atualizar o conteúdo projetado de forma eventual.

A aplicação ainda precisa:

- reler o arquivo;
- observar mudança;
- recarregar configuração;
- ou reiniciar.

Montagens com:

```text
subPath
```

não recebem a mesma atualização automática do volume projetado.

Essa diferença será documentada.

Outro ponto será imutabilidade.

ConfigMap e Secret podem declarar:

```yaml
immutable:
  true
```

Isso impede alteração do conteúdo existente.

Benefícios:

- reduz mudanças acidentais;
- torna versões mais previsíveis;
- pode reduzir observações desnecessárias do kubelet;
- favorece nomes versionados.

Custo:

- para mudar o conteúdo, é necessário criar outro object;
- o workload precisa apontar para a nova versão;
- o rollout precisa ser controlado.

Nesta aula, os resources permanecerão mutáveis para permitir o laboratório de rotação.

A política produtiva recomendará recursos versionados e imutáveis quando apropriado.

Outro tema será namespace.

ConfigMap e Secret são namespaced.

O Deployment em:

```text
formacao-java-dev
```

só pode referenciar diretamente ConfigMaps e Secrets desse namespace.

Não existe referência simples a um Secret de outro namespace.

Essa limitação ajuda a reduzir o escopo.

Ela não substitui RBAC.

Outro tema será ServiceAccount e acesso.

A aplicação não precisa necessariamente consultar a API Kubernetes para receber um Secret.

Quando o Secret é referenciado pelo Pod:

```text
o kubelet
materializa o valor
para o container
conforme o PodSpec.
```

O processo da aplicação acessa:

- environment variable;
- arquivo montado.

Ele não precisa receber permissão para listar Secrets.

Não será concedido:

```text
get secrets;

list secrets;

watch secrets.
```

ao workload.

Esse é um ponto importante de menor privilégio.

Outro tema será visibilidade no PodSpec.

O valor do Secret não aparece diretamente em:

```text
kubectl get deployment -o yaml.
```

A referência aparece.

Exemplo:

```text
secretKeyRef:

name:
orders-api-secrets.

key:
APP_PROVIDER_TOKEN.
```

Porém, pessoas com acesso ao Secret podem recuperar o conteúdo.

Por isso, é necessário proteger:

- RBAC;
- etcd;
- backups;
- audit logs;
- kubeconfig;
- ServiceAccounts;
- ferramentas administrativas.

O cluster local da formação não será tratado como um secret store produtivo.

Outro princípio será:

```text
não use
kubectl get secret
-o yaml

como teste
em uma gravação,
log
ou documentação.
```

Esse comando mostra os valores codificados.

Mesmo sem decodificar, o material é sensível.

As validações desta aula observarão apenas:

- existência;
- nome;
- tipo;
- chaves;
- idade;
- associação ao workload;
- presença dentro do container sem imprimir valor.

Outro tema será rotação.

O laboratório fará:

```text
Secret versão A;

rollout;

Secret versão B;

novo rollout;

validação;

remoção da versão anterior
quando aplicável.
```

Como o Secret será usado por environment variable, a rotação só será percebida pelos novos Pods.

Você observará:

```text
alterar Secret
não reinicia Deployment.
```

Depois:

```text
kubectl rollout restart.
```

O Deployment criará novos Pods.

Essa experiência prepara a próxima aula.

A próxima aula será:

```text
530 - M17.25 - Probes liveness readiness startup
```

Nela, você aprofundará:

- semântica das probes;
- thresholds;
- intervals;
- startup lenta;
- falso positivo;
- dependência externa;
- restart loop;
- readiness durante rotação;
- rollout bloqueado;
- observabilidade.

Nesta aula, as probes existentes serão preservadas.

Não haverá recalibração aprofundada.

Outro ponto será falha obrigatória.

Uma referência pode declarar:

```yaml
optional:
  false
```

Esse é o comportamento desejado para configuração obrigatória.

Se uma chave obrigatória estiver ausente:

- o container pode não iniciar;
- o Pod apresenta erro de configuração;
- events explicam a causa;
- o rollout não completa.

Esse comportamento é melhor do que iniciar com credencial silenciosamente vazia.

Para valores realmente opcionais, `optional: true` pode ser usado conscientemente.

A baseline usará valores obrigatórios.

Outro tema será checksum.

Ferramentas como Helm podem colocar um checksum da ConfigMap ou do Secret em uma annotation do Pod template.

Quando o conteúdo muda:

```text
a annotation muda;

o Pod template muda;

o Deployment inicia rollout.
```

Nesta aula, Helm não será usado.

O mecanismo será documentado.

O laboratório executará rollout explícito.

Outro tema será tamanho e finalidade.

ConfigMap e Secret são adequados para dados de configuração relativamente pequenos.

Eles não devem armazenar:

- dumps;
- artefatos;
- vídeos;
- arquivos grandes;
- banco;
- logs;
- JAR;
- imagem;
- backup.

Dados grandes precisam de storage apropriado.

Outro tema será Secret Store externo.

Em ambientes profissionais, credenciais podem permanecer em:

- cloud secret manager;
- Vault;
- HSM;
- serviço corporativo;
- operador Kubernetes;
- CSI Secret Store.

O cluster recebe ou monta o valor por integração.

Essa arquitetura não será implementada.

A aula apenas registrará a evolução.

Ao final, você deverá explicar:

```text
quando usar ConfigMap;

quando usar Secret;

por que Base64
não é criptografia;

como valueFrom
difere de envFrom;

como volumes
diferem de env vars;

por que mudanças
não reiniciam Pods
automaticamente;

como realizar rotação;

por que não dar
permissão de leitura
de Secrets à aplicação;

como validar presença
sem exibir valor;

como preparar
o aprofundamento
das probes.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
527:
Kubernetes fundamentos.

528:
Pod Deployment Service.

529:
ConfigMap Secret.

530:
Probes liveness readiness startup.

531:
Requests limits.
```

A aula 528 respondeu:

```text
como executar,
manter
e expor
o workload?
```

A aula 529 responderá:

```text
como injetar
configuração
e credenciais

sem acoplá-las
ao Deployment?
```

Nesta aula:

```text
ConfigMap:
sim.

Secret:
sim.

data:
sim.

stringData:
sim.

Base64:
sim.

env:
sim.

envFrom:
sim.

valueFrom:
sim.

configMapKeyRef:
sim.

secretKeyRef:
sim.

volume:
sim.

volumeMount:
sim.

projected files:
sim.

rotação:
sim.

rollout restart:
sim.

RBAC:
sim.

secret store externo:
conceitual.

probes:
preservadas.

calibração de probes:
não aprofundada.

Ingress:
não.

deploy produtivo:
não.
```

A regra central será:

```text
ConfigMap guarda
configuração não sensível;

Secret guarda
dados sensíveis;

o workload recebe
somente as chaves
de que precisa.
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

k8s/configuration
├── configmap.yaml
├── configuration-contract.yaml
├── secret-policy.yaml
├── secret-rotation-policy.yaml
└── external-secret-store-plan.yaml

scripts/kubernetes/configuration
├── apply-configmap.ps1
├── create-lab-secret.ps1
├── verify-configuration-references.ps1
├── verify-secret-without-disclosure.ps1
├── rotate-lab-secret.ps1
├── verify-mounted-configuration.ps1
├── collect-configuration-evidence.ps1
└── cleanup-configuration.ps1

docs/devops/kubernetes-configuration
├── CONFIGMAP_GUIDE.md
├── KUBERNETES_SECRET_GUIDE.md
├── BASE64_IS_NOT_ENCRYPTION.md
├── CONFIGURATION_INJECTION_POLICY.md
├── CONFIGURATION_RELOAD_POLICY.md
├── SECRET_ROTATION_RUNBOOK.md
├── KUBERNETES_SECRET_RBAC.md
├── CONFIGURATION_TEST_MATRIX.md
└── CONFIGURATION_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
ConfigMap declarativa;

Secret criado fora do Git;

Deployment referenciando ConfigMap;

Deployment referenciando Secret;

arquivo de configuração montado;

arquivo sensível montado;

rollout;

rotação;

evidência sanitizada;

cleanup.
```

Você irá:

1. confirmar o cluster;
2. confirmar o namespace;
3. revisar o Deployment;
4. criar contrato;
5. criar ConfigMap;
6. aplicar ConfigMap;
7. criar política de Secret;
8. criar Secret por script;
9. validar metadata;
10. atualizar Deployment;
11. injetar valores explícitos;
12. montar arquivo de ConfigMap;
13. montar arquivo de Secret;
14. aplicar Deployment;
15. acompanhar rollout;
16. validar referências;
17. validar presença sem imprimir;
18. alterar ConfigMap;
19. observar ausência de restart;
20. reiniciar rollout;
21. rotacionar Secret;
22. observar ausência de restart;
23. reiniciar rollout;
24. validar novos Pods;
25. simular chave ausente;
26. simular namespace incorreto;
27. simular valor em ConfigMap;
28. criar policies;
29. criar scripts;
30. coletar evidence;
31. executar gate;
32. commitar;
33. preparar a aula 530.

---

## Conceito essencial

### ConfigMap

Resource namespaced para configuração não sensível.

Campos principais:

```text
data;

binaryData;

immutable.
```

---

### Secret

Resource namespaced para dados sensíveis.

Tipos comuns incluem:

```text
Opaque;

kubernetes.io/tls;

kubernetes.io/dockerconfigjson;

kubernetes.io/service-account-token.
```

A baseline usa:

```text
Opaque.
```

---

### `data`

Em Secret, os valores são Base64.

Em ConfigMap, `data` contém strings.

---

### `stringData`

Campo de conveniência do Secret.

Aceita texto e é convertido pelo API Server.

Não deve conter credencial real em arquivo versionado.

---

### Base64

Encoding reversível.

Não oferece confidencialidade.

---

### `envFrom`

Importa várias chaves como variáveis.

Exige naming compatível.

Pode ampliar o acesso do container.

---

### `valueFrom`

Referencia uma chave específica.

Torna o contrato mais explícito.

---

### `configMapKeyRef`

Lê uma chave da ConfigMap.

---

### `secretKeyRef`

Lê uma chave do Secret.

---

### Volume de ConfigMap

Projeta chaves como arquivos.

---

### Volume de Secret

Projeta chaves como arquivos com permissões controláveis.

---

### `defaultMode`

Define permissões dos arquivos projetados.

No YAML, o valor é representado em decimal.

Exemplo:

```yaml
defaultMode:
  256
```

Isso corresponde a:

```text
0400.
```

---

### `optional`

Controla comportamento quando resource ou chave está ausente.

Configuração obrigatória deve falhar.

---

### Rotação

Substituição controlada do valor.

Pods que usam env vars precisam ser recriados.

---

### Imutabilidade

Impede alteração do object.

Favorece configuração versionada.

---

## Mão na massa guiada

### 1. Confirmar o cluster e o context

Execute:

```powershell
kubectl config current-context
```

O resultado esperado é:

```text
kind-formacao-java.
```

Depois:

```powershell
kubectl get node
```

O node precisa estar:

```text
Ready.
```

---

### 2. Confirmar o namespace

```powershell
kubectl get namespace `
  formacao-java-dev
```

Se não existir, aplique:

```powershell
kubectl apply `
  -f `
  "k8s/workloads/namespace.yaml"
```

---

### 3. Revisar o Deployment atual

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev
```

Confirme duas réplicas Ready antes da mudança.

---

### 4. Criar contrato de configuração

Arquivo:

```text
k8s/configuration/configuration-contract.yaml
```

Conteúdo:

```yaml
configuration:
  configMap:
    name:
      orders-api-config

    requiredKeys:
      - APP_LOG_LEVEL
      - APP_PROVIDER_MODE
      - APP_OBSERVABILITY_ENABLED
      - APP_RELEASE_COLOR
      - application-runtime.properties

  secret:
    name:
      orders-api-secrets

    type:
      Opaque

    requiredKeys:
      - APP_DATABASE_PASSWORD
      - APP_PROVIDER_TOKEN
```

O contrato contém nomes.

Não contém valores sensíveis.

---

### 5. Criar a ConfigMap

Arquivo:

```text
k8s/configuration/configmap.yaml
```

Conteúdo:

```yaml
apiVersion:
  v1

kind:
  ConfigMap

metadata:
  name:
    orders-api-config

  namespace:
    formacao-java-dev

  labels:
    app.kubernetes.io/name:
      formacao-java-integrations

    app.kubernetes.io/instance:
      orders-api-dev

    app.kubernetes.io/component:
      configuration

    app.kubernetes.io/part-of:
      formacao-java

    app.kubernetes.io/managed-by:
      kubectl

data:
  APP_LOG_LEVEL:
    INFO

  APP_PROVIDER_MODE:
    sandbox

  APP_OBSERVABILITY_ENABLED:
    "true"

  APP_RELEASE_COLOR:
    blue

  application-runtime.properties: |
    application.runtime.environment=dev
    application.runtime.provider-mode=sandbox
    application.runtime.observability-enabled=true
```

Nenhuma senha foi adicionada.

---

### 6. Aplicar a ConfigMap

```powershell
kubectl apply `
  -f `
  "k8s/configuration/configmap.yaml"
```

Consulte metadata e chaves:

```powershell
kubectl describe configmap `
  orders-api-config `
  --namespace `
  formacao-java-dev
```

A ConfigMap não é sensível, mas ainda deve ser revisada.

---

### 7. Criar política de Secret

Arquivo:

```text
k8s/configuration/secret-policy.yaml
```

Conteúdo conceitual:

```yaml
secret:
  name:
    orders-api-secrets

  namespace:
    formacao-java-dev

  type:
    Opaque

  valuesInGit:
    forbidden

  valuesInLogs:
    forbidden

  valuesInArtifacts:
    forbidden

  requiredKeys:
    - APP_DATABASE_PASSWORD
    - APP_PROVIDER_TOKEN

  rotation:
    required

  applicationApiRead:
    forbidden
```

---

### 8. Criar script seguro do Secret

Arquivo:

```text
scripts/kubernetes/configuration/create-lab-secret.ps1
```

O script deve:

1. validar context;
2. validar namespace;
3. solicitar valores como `SecureString`;
4. criar diretório temporário;
5. aplicar ACL restrita;
6. gravar os dois arquivos sem newline;
7. usar `kubectl create secret generic`;
8. aplicar por pipe;
9. limpar arquivos em `finally`;
10. limpar strings e ponteiros quando possível;
11. não imprimir valores.

Comando conceitual executado pelo script:

```powershell
kubectl create secret generic `
  orders-api-secrets `
  --namespace `
  formacao-java-dev `
  --from-file `
  "APP_DATABASE_PASSWORD=<arquivo-temporario>" `
  --from-file `
  "APP_PROVIDER_TOKEN=<arquivo-temporario>" `
  --dry-run=client `
  -o yaml
```

A saída será aplicada diretamente.

Não será salva em disco.

---

### 9. Executar a criação

```powershell
.\scripts\kubernetes\configuration\create-lab-secret.ps1
```

Use somente valores falsos de laboratório.

---

### 10. Verificar sem divulgar

Use:

```powershell
kubectl get secret `
  orders-api-secrets `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.metadata.name}{'\n'}{.type}{'\n'}"
```

Consulte as chaves sem valores por script sanitizado.

Não use `-o yaml` em logs ou documentação.

---

### 11. Atualizar o Deployment

No container `orders-api`, adicione:

```yaml
env:
  - name:
      APP_LOG_LEVEL

    valueFrom:
      configMapKeyRef:
        name:
          orders-api-config

        key:
          APP_LOG_LEVEL

        optional:
          false

  - name:
      APP_PROVIDER_MODE

    valueFrom:
      configMapKeyRef:
        name:
          orders-api-config

        key:
          APP_PROVIDER_MODE

        optional:
          false

  - name:
      APP_OBSERVABILITY_ENABLED

    valueFrom:
      configMapKeyRef:
        name:
          orders-api-config

        key:
          APP_OBSERVABILITY_ENABLED

        optional:
          false

  - name:
      APP_RELEASE_COLOR

    valueFrom:
      configMapKeyRef:
        name:
          orders-api-config

        key:
          APP_RELEASE_COLOR

        optional:
          false

  - name:
      APP_DATABASE_PASSWORD

    valueFrom:
      secretKeyRef:
        name:
          orders-api-secrets

        key:
          APP_DATABASE_PASSWORD

        optional:
          false

  - name:
      APP_PROVIDER_TOKEN

    valueFrom:
      secretKeyRef:
        name:
          orders-api-secrets

        key:
          APP_PROVIDER_TOKEN

        optional:
          false
```

Referências explícitas mostram exatamente o que o container recebe.

---

### 12. Adicionar volumes

No Pod template:

```yaml
volumes:
  - name:
      runtime-config

    configMap:
      name:
        orders-api-config

      items:
        - key:
            application-runtime.properties

          path:
            application-runtime.properties

  - name:
      provider-token

    secret:
      secretName:
        orders-api-secrets

      defaultMode:
        256

      items:
        - key:
            APP_PROVIDER_TOKEN

          path:
            provider-token
```

---

### 13. Adicionar volume mounts

No container:

```yaml
volumeMounts:
  - name:
      runtime-config

    mountPath:
      /etc/orders-api/runtime

    readOnly:
      true

  - name:
      provider-token

    mountPath:
      /var/run/secrets/orders-api

    readOnly:
      true
```

O token também aparece como env nesta etapa para comparar os mecanismos.

Em produção, evite duplicar o mesmo secret sem necessidade.

---

### 14. Aplicar o Deployment atualizado

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

### 15. Validar as referências

Use:

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.template.spec.containers[0].env[*].valueFrom}"
```

A saída deve mostrar referências.

Não valores.

---

### 16. Validar os mounts

Escolha um Pod:

```powershell
$PodName = kubectl get pod `
  --namespace `
  formacao-java-dev `
  -l `
  "app.kubernetes.io/instance=orders-api-dev" `
  -o `
  "jsonpath={.items[0].metadata.name}"
```

Valide o arquivo não sensível:

```powershell
kubectl exec `
  $PodName `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -f /etc/orders-api/runtime/application-runtime.properties"
```

Valide o arquivo sensível sem imprimir:

```powershell
kubectl exec `
  $PodName `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  "test -s /var/run/secrets/orders-api/provider-token"
```

---

### 17. Validar a variável sensível sem imprimir

```powershell
kubectl exec `
  $PodName `
  --namespace `
  formacao-java-dev `
  -- `
  sh `
  -c `
  'test -n "$APP_PROVIDER_TOKEN"'
```

O exit code confirma presença.

O valor não aparece.

Se a imagem for distroless no futuro, use uma verificação da própria aplicação ou um mecanismo de diagnóstico autorizado.

---

### 18. Alterar a ConfigMap

Troque:

```text
APP_RELEASE_COLOR:
blue
```

para:

```text
APP_RELEASE_COLOR:
green.
```

Aplique novamente:

```powershell
kubectl apply `
  -f `
  "k8s/configuration/configmap.yaml"
```

---

### 19. Observar ausência de restart

Consulte os Pods antes e depois.

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev
```

Os nomes e `RESTARTS` não mudam apenas porque a ConfigMap foi atualizada.

---

### 20. Reiniciar o rollout

```powershell
kubectl rollout restart `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
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

Novos Pods recebem a variável atualizada.

---

### 21. Rotacionar o Secret

Execute:

```powershell
.\scripts\kubernetes\configuration\rotate-lab-secret.ps1
```

O script deve:

- solicitar valor fake novo;
- atualizar o Secret;
- registrar somente versão operacional;
- não imprimir valor;
- não reiniciar automaticamente sem autorização.

---

### 22. Observar ausência de restart após rotação

Consulte os Pods.

A alteração do Secret não muda automaticamente variáveis já existentes nos containers.

---

### 23. Reiniciar para consumir a rotação

```powershell
kubectl rollout restart `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
```

Aguarde o rollout.

Valide presença sem imprimir.

---

### 24. Verificar o Service

```powershell
kubectl get service,endpointslice `
  --namespace `
  formacao-java-dev
```

Confirme que os novos Pods Ready voltaram aos endpoints.

---

### 25. Simular chave ausente

Remova temporariamente a chave:

```text
APP_PROVIDER_MODE
```

da ConfigMap.

Aplique e force rollout.

Observe:

- Pod não inicia corretamente;
- event indica chave ausente;
- Deployment não fica Available;
- Secret não é exibido.

Restaure a chave e o rollout.

---

### 26. Simular Secret no namespace errado

Crie um Secret fake em outro namespace de laboratório.

Não altere o Secret correto.

Aponte temporariamente o Deployment para um nome inexistente no namespace atual.

Observe erro de configuração.

Restaure.

---

### 27. Simular dado sensível na ConfigMap

Adicione temporariamente uma chave com nome:

```text
APP_DATABASE_PASSWORD.
```

O script de policy precisa bloquear.

Não use um valor real.

Remova a chave.

---

### 28. Criar policy de rotação

Arquivo:

```text
secret-rotation-policy.yaml
```

Inclua:

- owner;
- frequency;
- provider;
- overlap;
- rollout required;
- validation;
- revocation;
- evidence;
- incident path.

Sem valores.

---

### 29. Criar plano de secret store externo

Arquivo:

```text
external-secret-store-plan.yaml
```

Inclua:

- provider conceitual;
- workload identity;
- CSI ou operator;
- sync policy;
- refresh;
- fail closed;
- audit;
- rotation;
- fallback.

Nenhuma integração será instalada.

---

### 30. Criar evidence

Arquivo gerado:

```text
kubernetes-configuration-evidence.json.
```

Campos permitidos:

- namespace;
- ConfigMap name;
- ConfigMap key count;
- Secret name;
- Secret type;
- Secret key count;
- Deployment generation;
- ready replicas;
- config rollout observed;
- secret rotation rollout observed;
- mounted config present;
- mounted secret present;
- value disclosure false;
- timestamp.

Campos proibidos:

- valores;
- Base64;
- hashes derivados sensíveis;
- kubeconfig;
- token.

---

### 31. Criar documentação

#### `CONFIGMAP_GUIDE.md`

Configuração não sensível, env e volumes.

#### `KUBERNETES_SECRET_GUIDE.md`

Tipos, criação, uso, rotação e riscos.

#### `BASE64_IS_NOT_ENCRYPTION.md`

Demonstração conceitual sem segredo real.

#### `CONFIGURATION_INJECTION_POLICY.md`

Preferência por referências explícitas.

#### `CONFIGURATION_RELOAD_POLICY.md`

Define quando restart é necessário.

#### `SECRET_ROTATION_RUNBOOK.md`

Processo de troca, rollout, validação e revogação.

#### `KUBERNETES_SECRET_RBAC.md`

Explica por que o workload não recebe acesso à API de Secrets.

---

### 32. Criar test matrix

Arquivo:

```text
CONFIGURATION_TEST_MATRIX.md
```

Cenários:

- ConfigMap presente;
- ConfigMap ausente;
- chave ConfigMap ausente;
- Secret presente;
- Secret ausente;
- chave Secret ausente;
- ConfigMap no namespace errado;
- Secret no namespace errado;
- env var;
- arquivo montado;
- modo de arquivo;
- alteração sem restart;
- rollout após alteração;
- rotação;
- valor em ConfigMap;
- artifact sem valor;
- cleanup.

---

### 33. Criar troubleshooting

Arquivo:

```text
CONFIGURATION_TROUBLESHOOTING.md
```

Inclua:

- `CreateContainerConfigError`;
- ConfigMap not found;
- Secret not found;
- chave ausente;
- env vazia;
- volume não montado;
- permission denied;
- subPath não atualiza;
- Pod não reinicia;
- rollout bloqueado;
- Secret em namespace errado;
- Base64 inválido;
- RBAC excessivo;
- valor em log.

---

### 34. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\configuration\apply-configmap.ps1

.\scripts\kubernetes\configuration\create-lab-secret.ps1

.\scripts\kubernetes\configuration\verify-configuration-references.ps1

.\scripts\kubernetes\configuration\verify-secret-without-disclosure.ps1

.\scripts\kubernetes\configuration\verify-mounted-configuration.ps1

.\scripts\kubernetes\configuration\collect-configuration-evidence.ps1
```

Finalize:

```powershell
kubectl get configmap,secret,deployment,pod `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Não use saída YAML do Secret como evidência.

---

## Entendendo o que foi feito

### Configuração saiu do Deployment

O Pod template passou a conter referências.

### ConfigMap ganhou responsabilidade clara

Somente dados não sensíveis foram versionados.

### Secret ficou fora do Git

Os valores foram criados em runtime por script.

### O contrato ficou explícito

Cada chave obrigatória foi documentada.

### Env vars e volumes foram comparados

Cada mecanismo possui lifecycle diferente.

### A rotação ganhou rollout

Pods antigos não receberam novas env vars automaticamente.

### O namespace limitou referências

O workload utilizou resources do mesmo namespace.

### O workload permaneceu sem acesso à API

Nenhum `get secrets` foi concedido.

### A validação evitou divulgação

Presença foi confirmada por exit code e metadata.

### A próxima aula ganhou um cenário real

Probes precisarão manter rollout seguro durante mudanças de configuração e Secret.

---

## Erros comuns importantes

### Colocar senha em ConfigMap

O valor fica em resource não destinado a segredo.

### Acreditar que Base64 criptografa

O conteúdo é reversível.

### Commitar `stringData`

O valor aparece em texto no Git.

### Usar `kubectl get secret -o yaml` em log

Os dados codificados são expostos.

### Injetar todas as chaves com `envFrom`

O container pode receber mais acesso do que precisa.

### Alterar Secret e esperar restart

Environment variables não são atualizadas dentro do processo.

### Montar com `subPath` e esperar atualização

O arquivo pode permanecer com conteúdo antigo.

### Dar acesso de leitura de Secrets à aplicação

Aumenta o impacto de comprometimento.

### Duplicar secret em env e arquivo

A superfície aumenta sem necessidade.

### Usar ConfigMap para arquivos grandes

A API não é storage de artefatos.

### Reiniciar sem observar rollout

Configuração inválida pode derrubar disponibilidade.

### Aprofundar probes nesta aula

A aula 530 possui esse objetivo.

---

## Comandos úteis

### Aplicar ConfigMap

```powershell
kubectl apply `
  -f `
  "k8s/configuration/configmap.yaml"
```

### Descrever ConfigMap

```powershell
kubectl describe configmap `
  orders-api-config `
  --namespace `
  formacao-java-dev
```

### Consultar metadata do Secret

```powershell
kubectl get secret `
  orders-api-secrets `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.metadata.name}{'\n'}{.type}{'\n'}"
```

### Reiniciar rollout

```powershell
kubectl rollout restart `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
```

### Acompanhar rollout

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-dev `
  --timeout `
  180s
```

---

## Exercício guiado

### Parte 1 — Contrato

Liste chaves não sensíveis e sensíveis.

### Parte 2 — ConfigMap

Crie e aplique configuração.

### Parte 3 — Secret

Crie fora do Git.

### Parte 4 — Env

Use referências explícitas.

### Parte 5 — Volumes

Monte arquivos read-only.

### Parte 6 — Rollout

Aplique o Deployment.

### Parte 7 — Config update

Observe ausência de restart.

### Parte 8 — Rotation

Troque o Secret e reinicie.

### Parte 9 — Failure

Remova uma chave obrigatória.

### Parte 10 — Evidence

Valide sem divulgar valores.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 528 foi preservada;
- ConfigMap foi definida;
- Secret foi definido;
- configuração não sensível foi diferenciada;
- dado sensível foi diferenciado;
- `data` foi explicado;
- `stringData` foi explicado;
- Base64 foi classificado como encoding;
- Base64 não foi tratado como criptografia;
- Secret type Opaque foi usado;
- `envFrom` foi explicado;
- `valueFrom` foi usado;
- `configMapKeyRef` foi usado;
- `secretKeyRef` foi usado;
- volume de ConfigMap foi usado;
- volume de Secret foi usado;
- `defaultMode` foi explicado;
- `optional: false` foi usado;
- rotação foi definida;
- imutabilidade foi explicada;
- namespace foi respeitado;
- RBAC foi considerado;
- aplicação não recebeu leitura da API de Secrets;
- contrato de configuração foi criado;
- nomes obrigatórios foram listados;
- valores sensíveis não foram incluídos no contrato;
- ConfigMap declarativa foi criada;
- labels foram adicionadas;
- log level foi configurado;
- provider mode foi configurado;
- observabilidade foi configurada;
- release color foi configurada;
- arquivo de runtime foi criado;
- senha não entrou na ConfigMap;
- ConfigMap foi aplicada;
- metadata da ConfigMap foi consultada;
- policy de Secret foi criada;
- values in Git foram proibidos;
- values in logs foram proibidos;
- values in artifacts foram proibidos;
- script seguro de criação foi criado;
- SecureString foi usado;
- arquivos temporários foram usados;
- ACL restrita foi exigida;
- `finally` foi usado para cleanup;
- saída do Secret não foi salva;
- valores falsos foram usados;
- Secret foi criado no namespace correto;
- metadata do Secret foi consultada;
- `kubectl get secret -o yaml` não foi usado como evidência;
- Deployment foi atualizado;
- referências explícitas foram usadas;
- quatro valores da ConfigMap foram injetados;
- duas chaves do Secret foram injetadas;
- volumes foram criados;
- mounts foram read-only;
- arquivo sensível usou modo restrito;
- Deployment foi aplicado;
- rollout foi acompanhado;
- referências foram validadas sem valores;
- arquivo de ConfigMap foi validado;
- arquivo de Secret foi validado sem leitura;
- env sensível foi validada sem impressão;
- alteração de ConfigMap foi aplicada;
- ausência de restart automático foi observada;
- rollout restart foi executado;
- novos Pods receberam configuração;
- Secret foi rotacionado;
- ausência de restart automático foi observada;
- rollout foi executado após rotação;
- novos Pods receberam o Secret;
- Service e EndpointSlices foram validados;
- chave ConfigMap ausente foi simulada;
- falha de configuração foi observada;
- chave foi restaurada;
- Secret em namespace incorreto foi discutido e simulado;
- referência foi restaurada;
- dado sensível na ConfigMap foi bloqueado;
- alteração temporária foi removida;
- policy de rotação foi criada;
- external secret store foi planejado;
- nenhuma integração externa foi instalada;
- evidence foi criada;
- evidence não contém valores;
- evidence não contém Base64;
- evidence não contém kubeconfig;
- documentação de ConfigMap foi criada;
- documentação de Secret foi criada;
- limites do Base64 foram documentados;
- injection policy foi criada;
- reload policy foi criada;
- rotation runbook foi criado;
- RBAC doc foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- ConfigMap e Secret não foram usados como storage grande;
- probes existentes foram preservadas;
- calibração aprofundada de probes não foi antecipada;
- Ingress não foi criado;
- deploy produtivo não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 530 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/configuration `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/workloads/deployment.yaml `
  scripts/kubernetes/configuration `
  docs/devops/kubernetes-configuration `
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
      "password:|token:|stringData:|client-key-data|dockerconfigjson"
```

Analise qualquer ocorrência.

Commit recomendado:

```powershell
git commit -m "feat(m17): integrar ConfigMap e Secret"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- Secret real;
- `stringData` com valor;
- Base64 de credencial;
- senha;
- token;
- arquivo temporário;
- kubeconfig;
- evidence local não sanitizada;
- `.env` real;
- Docker config;
- arquivos de secret store;
- alterações aprofundadas de probes da aula 530.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o workload deixou de carregar configuração e credenciais diretamente em seu manifest.

O fluxo passou a possuir:

```text
ConfigMap;

Secret;

valueFrom;

volumes;

rollout;

rotação;

evidência sanitizada.
```

Você comprovou que:

- ConfigMap atende configuração não sensível;
- Secret atende dados sensíveis;
- Base64 não oferece criptografia;
- `stringData` não deve receber valor real no Git;
- referências explícitas reduzem acesso;
- volumes atendem configuração em arquivo;
- environment variables são capturadas na criação do container;
- mudanças não reiniciam Pods automaticamente;
- rotação exige rollout quando a aplicação usa env vars;
- resources são limitados ao namespace;
- a aplicação não precisa listar Secrets;
- presença pode ser validada sem divulgação;
- RBAC, etcd e kubeconfig continuam relevantes;
- Secret externo pode reduzir credenciais persistidas no cluster.

A próxima aula será:

```text
530 - M17.25 - Probes liveness readiness startup
```

Nela, você irá aprofundar como o Kubernetes decide quando iniciar tráfego, quando aguardar startup e quando reiniciar containers, especialmente durante rollouts e alterações de configuração.

Nenhuma calibração aprofundada de probes foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o contrato de configuração.
- [ ] Apliquei a ConfigMap.
- [ ] Criei o Secret fora do Git.
- [ ] Atualizei o Deployment.
- [ ] Validei env vars e volumes.
- [ ] Observei a necessidade de rollout.
- [ ] Rotacionei o Secret.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O Pod apresenta `CreateContainerConfigError`

Consulte events; ConfigMap, Secret ou chave pode estar ausente.

### A variável chega vazia

Revise nome, chave, namespace e `optional`.

### O volume não aparece

Revise `volumes`, `volumeMounts`, nome e path.

### O arquivo sensível possui permissão ampla

Revise `defaultMode` e o usuário do container.

### O Secret foi atualizado, mas a aplicação usa o valor antigo

Environment variables exigem recriação do Pod.

### O arquivo montado não atualiza

Pode existir `subPath`, atraso de projeção ou aplicação sem reload.

### O rollout não completa

A nova configuração pode ter quebrado startup ou readiness.

### O Service perdeu endpoints

Os novos Pods podem não estar Ready.

### O Secret existe em outro namespace

Crie ou sincronize de forma controlada no namespace correto.

### Um valor Base64 apareceu em artifact

Trate como exposição e remova o artifact.

### O workload possui permissão para listar Secrets

Revogue; a montagem não exige essa permissão.

### As probes foram alteradas em profundidade

Restaure e preserve para a aula 530.

---

## Perguntas de revisão

1. O que é ConfigMap?
2. O que é Secret?
3. O que significa `Opaque`?
4. Base64 é criptografia?
5. Para que serve `stringData`?
6. O que faz `envFrom`?
7. O que faz `valueFrom`?
8. O que faz `configMapKeyRef`?
9. O que faz `secretKeyRef`?
10. Quando usar volume?
11. O que faz `defaultMode`?
12. O que faz `optional: false`?
13. Alterar ConfigMap reinicia Pod?
14. Alterar Secret reinicia Pod?
15. Por que usar rollout restart?
16. O workload precisa listar Secrets?
17. Por que não usar `-o yaml` em logs?
18. O que é Secret imutável?
19. O que não foi aprofundado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Configuração não sensível.
2. Dado sensível.
3. Tipo genérico.
4. Não.
5. Entrada textual.
6. Importar várias chaves.
7. Referenciar valor específico.
8. Ler chave da ConfigMap.
9. Ler chave do Secret.
10. Aplicação espera arquivo.
11. Permissão projetada.
12. Falhar quando ausente.
13. Não.
14. Não para env vars.
15. Recriar Pods.
16. Não.
17. Evitar exposição.
18. Conteúdo não alterável.
19. Calibração de probes.
20. Probes liveness readiness startup.

---

## Desafio opcional

Crie uma ConfigMap versionada.

Requisitos:

- nome `orders-api-config-v2`;
- `immutable: true`;
- mesma policy de labels;
- Deployment atualizado para v2;
- rollout observado;
- v1 preservada para rollback;
- nenhum Secret duplicado;
- evidence;
- cleanup documentado.

O objetivo é praticar configuração imutável e rollback sem antecipar ferramentas de templating.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 529 - M17.24 - ConfigMap Secret

- Continuei após Pod, Deployment e Service.
- Diferenciei ConfigMap e Secret.
- Reforcei que Base64 não é criptografia.
- Estudei `data`, `binaryData` e `stringData`.
- Criei contrato de configuração.
- Criei ConfigMap declarativa.
- Mantive dados sensíveis fora da ConfigMap.
- Criei policy de Secret.
- Criei Secret `Opaque` fora do Git.
- Usei valores falsos de laboratório.
- Validei metadata sem exibir dados.
- Atualizei o Deployment com `configMapKeyRef`.
- Atualizei o Deployment com `secretKeyRef`.
- Usei referências explícitas.
- Montei arquivo de ConfigMap.
- Montei arquivo de Secret read-only.
- Restrigi a permissão do arquivo sensível.
- Validei presença sem imprimir valor.
- Alterei a ConfigMap.
- Comprovei que o Pod não reinicia automaticamente.
- Executei rollout restart.
- Rotacionei o Secret.
- Comprovei que env vars exigem novos Pods.
- Executei novo rollout.
- Simulei chave ausente.
- Simulei referência em namespace incorreto.
- Bloqueei dado sensível em ConfigMap.
- Criei policy e runbook de rotação.
- Planejei integração futura com secret store externo.
- Criei evidence sanitizada.
- Não antecipei a calibração aprofundada das probes.
- Próxima aula: Probes liveness readiness startup.
```

---

## Referência técnica curta

- Kubernetes ConfigMaps.
- Kubernetes Secrets.
- Distribute Credentials Securely Using Secrets.
- Configure Pods with ConfigMaps.
- Environment Variables in Pods.
- Volumes.
- Secret Projection.
- Kubernetes RBAC.
- Immutable ConfigMaps and Secrets.
- Secret Store CSI Driver.

Regra final:

```text
ConfigMap separa configuração não sensível do Pod template e Secret oferece uma API namespaced para credenciais, mas Base64 continua sendo encoding reversível e nenhum valor real entra em data, stringData, logs, artifacts ou Git; o Deployment referencia somente chaves necessárias por configMapKeyRef e secretKeyRef, monta arquivos read-only com permissões controladas e falha quando configuração obrigatória está ausente; ConfigMaps e Secrets atualizados não reiniciam Pods, environment variables são capturadas na criação do container e a rotação exige rollout explícito, validação e revogação; o workload não recebe permissão para listar Secrets, metadata e presença são verificadas sem divulgação, e policies bloqueiam senha em ConfigMap, saída YAML sensível e referências entre namespaces; com configuração e credenciais desacopladas, a aula 530 poderá calibrar startup, readiness e liveness para manter rollouts seguros durante inicialização, falhas e mudanças operacionais.
```
