# 532 - M17.27 - Ingress

## Apresentação da aula

Na aula 531, você aprofundou o contrato de CPU e memória do workload Kubernetes.

O laboratório passou a observar:

```text
requests;

limits;

QoS;

capacity;

allocatable;

CPU throttling;

OOMKilled;

scheduling;

rollout capacity.
```

A baseline terminou restaurada com:

```text
2 Pods Ready;

2 endpoints prontos;

Service ClusterIP;

probes saudáveis;

resources controlados.
```

O Service criado na aula 528 oferece uma identidade estável dentro do cluster.

Ele atende pelo nome:

```text
orders-api.
```

No namespace:

```text
formacao-java-dev.
```

A forma completa de DNS é semelhante a:

```text
orders-api.formacao-java-dev.svc.cluster.local.
```

Esse endereço é útil para comunicação interna.

Entretanto, um cliente fora do cluster ainda não possui uma rota HTTP permanente para a aplicação.

Até agora, o acesso local foi feito com:

```text
kubectl port-forward.
```

Port-forward é excelente para:

- diagnóstico;
- laboratório;
- teste temporário;
- inspeção local.

Ele não é uma camada de entrada de produção.

Quando o processo termina, o acesso desaparece.

A pergunta central desta aula será:

```text
como receber
requisições HTTP externas,

selecionar uma regra
por host e path

e encaminhar
para um Service interno?
```

A resposta será construída com:

```text
Ingress;

IngressClass;

Ingress Controller.
```

Esses conceitos não são equivalentes.

#### Ingress

É um resource da API Kubernetes que descreve regras HTTP e HTTPS.

#### IngressClass

Identifica a classe e o controller responsável por interpretar o Ingress.

#### Ingress Controller

É o software que observa os resources Ingress e configura um proxy ou load balancer para executar as regras.

A regra central será:

```text
Ingress descreve;

controller implementa;

Service encaminha;

Pods respondem.
```

Criar apenas:

```yaml
kind:
  Ingress
```

não cria automaticamente um proxy funcional.

Sem um controller compatível:

- o object pode existir;
- a API aceita o manifest;
- nenhuma rota externa é materializada;
- o status pode permanecer sem endereço;
- requisições não chegam ao Service.

Nesta aula, o cluster local `kind` receberá um controller NGINX para laboratório.

A instalação será feita por Helm com versão explícita resolvida e registrada pelo script.

O objetivo não é transformar o Helm no tema da aula.

O Helm será somente o mecanismo de instalação do controller.

O script deverá:

1. adicionar o repositório oficial do chart;
2. atualizar o índice;
3. resolver uma versão;
4. exigir confirmação ou parâmetro explícito;
5. registrar chart e app version;
6. instalar no namespace próprio;
7. aguardar o rollout;
8. validar a `IngressClass`;
9. produzir evidence sem credenciais.

Nenhuma URL de manifest flutuante será aplicada diretamente por `kubectl`.

Essa escolha reduz o risco de instalar conteúdo não revisado sem registrar a versão.

A aula não utilizará portas 80 e 443 da máquina diretamente.

O cluster atual não precisa ser recriado.

O controller será acessado por:

```text
kubectl port-forward.
```

A topologia será:

```text
cliente local
     |
     | localhost:18080
     | Host: orders.local
     v
Ingress Controller
     |
     | regra de host e path
     v
Service orders-api:80
     |
     | targetPort http
     v
Pods orders-api:8084
```

O teste utilizará um header HTTP explícito:

```text
Host:
orders.local.
```

Assim, não será necessário alterar:

```text
hosts file;

DNS local;

roteador;

certificado.
```

O Ingress terá uma regra:

```text
host:
orders.local.

path:
/

pathType:
Prefix.

backend:
Service orders-api, port 80.
```

A aplicação poderá ser consultada por:

```text
/actuator/health/readiness.
```

Com o host correto, o controller encaminhará a requisição.

Sem o host correto, a regra não corresponde.

Outro conceito importante será:

```text
pathType.
```

A API `networking.k8s.io/v1` exige um path type.

Valores principais:

```text
Exact;

Prefix;

ImplementationSpecific.
```

#### `Exact`

O path da requisição precisa corresponder exatamente, considerando as regras da API.

#### `Prefix`

Faz correspondência por segmentos de path.

Uma regra `/` com `Prefix` atende todos os paths daquele host.

#### `ImplementationSpecific`

O comportamento depende do controller.

Essa opção aumenta dependência da implementação.

A baseline utilizará:

```text
Prefix.
```

Outro tema será o backend.

No Ingress v1, o backend de Service é declarado por:

```yaml
backend:
  service:
    name:
      orders-api

    port:
      number:
        80
```

O Ingress encaminha para o Service.

Ele não seleciona Pods diretamente.

A cadeia continua sendo:

```text
Ingress
→ Service
→ EndpointSlice
→ Pod.
```

Se o Service não possui endpoints prontos:

```text
o Ingress existe;

o controller recebe;

mas o backend não atende.
```

O diagnóstico precisa percorrer toda a cadeia.

Outro tema será `ingressClassName`.

O manifest utilizará:

```yaml
spec:
  ingressClassName:
    nginx
```

Isso evita depender de uma classe default implícita.

A classe precisa existir:

```powershell
kubectl get ingressclass
```

E precisa ser reconhecida pelo controller instalado.

Outro tema será annotations.

Controllers podem oferecer configurações adicionais por annotations.

Exemplos conceituais:

- rewrite;
- timeout;
- tamanho de body;
- redirect;
- rate limit;
- CORS;
- afinidade;
- canary.

Essas annotations são específicas do controller.

Elas não fazem parte de uma API universal de comportamento.

A baseline evitará annotations desnecessárias.

O path será compatível com a aplicação sem rewrite.

Essa decisão reduz acoplamento.

Um controller pode atender múltiplos hosts e paths. Path routing exige cuidado com redirects, links, cookies, CORS e rewrite. Nesta aula, a aplicação continua em `/`, sem rewrite.

Outro tema será o endereço do Ingress.

Em cloud, um controller pode publicar:

- IP;
- hostname;
- load balancer;
- status.

No kind com port-forward, o acesso não depende de um endereço externo persistente no `status`.

O processo local conecta diretamente ao Service do controller.

Isso é suficiente para comprovar host e path routing.

Outro tema será `X-Forwarded-*`.

O proxy costuma enviar headers como:

```text
X-Forwarded-For;

X-Forwarded-Host;

X-Forwarded-Proto.
```

A aplicação precisa possuir uma política para confiar em proxies conhecidos.

Confiar cegamente em headers fornecidos pelo cliente pode gerar:

- URL incorreta;
- redirect inseguro;
- spoofing;
- auditoria incorreta;
- confusão de protocolo.

Nesta aula, os headers serão observados conceitualmente.

A configuração avançada do Spring para forwarded headers não será alterada sem necessidade.

Outro tema será TLS.

Ingress suporta uma seção:

```yaml
tls:
```

Que referencia um Secret do tipo:

```text
kubernetes.io/tls.
```

TLS precisa de:

- certificado;
- private key;
- host correspondente;
- emissão;
- renovação;
- armazenamento;
- controller compatível;
- política de versões e cifras;
- redirect HTTP para HTTPS;
- monitoramento de validade.

Nesta aula, TLS será estudado conceitualmente.

Nenhum certificado ou private key será criado.

A prática permanecerá HTTP local.

Isso evita transformar a aula em uma implementação incompleta de PKI.

Outro tema será default backend.

Quando nenhuma regra corresponde, o controller normalmente utiliza um backend default ou responde com um erro padrão.

Você irá testar:

```text
host correto;

host incorreto;

path atendido.
```

O host incorreto não deve chegar à aplicação.

Outro tema será segurança de exposição.

A aplicação já possui endpoints Actuator.

Nem todo endpoint administrativo deve ficar acessível por Ingress.

A policy desta aula permitirá apenas os paths necessários ao laboratório.

Em produção, podem existir regras separadas para:

- API pública;
- health;
- métricas;
- administração;
- documentação.

O fato de um endpoint existir no Pod não significa que deve ser publicado externamente.

Outro princípio será:

```text
Ingress não substitui
autenticação da aplicação.
```

Ele pode aplicar controles no proxy.

A aplicação continua responsável por:

- autorização de negócio;
- autenticação adequada;
- validação;
- proteção de dados;
- rate limiting quando necessário;
- auditoria.

A observação correlacionará Ingress, class, controller, Service, EndpointSlices, Pods, status HTTP e latência. O diagnóstico seguirá de fora para dentro: cliente, port-forward, controller, regra, Service, endpoints, Pod e aplicação.

Outro tema será validação declarativa.

Antes do apply, o script executará:

```text
kubectl apply --dry-run=server;
```

Quando a API do cluster estiver disponível.

Também verificará:

- `apiVersion`;
- `kind`;
- namespace;
- class;
- host;
- path type;
- Service;
- port;
- labels;
- ausência de TLS incompleto;
- ausência de annotations proibidas.

Outro tema será a próxima aula.

A próxima aula será:

```text
533 - M17.28 - HPA
```

Por isso, esta aula não criará:

- Metrics Server;
- HorizontalPodAutoscaler;
- métricas customizadas;
- escala automática;
- behavior de scaling;
- estabilização de HPA.

O Deployment continuará com duas réplicas.

Ao final, você deverá explicar:

```text
por que Ingress
não funciona sozinho;

qual é o papel
do controller;

como IngressClass
seleciona implementação;

como host e path
selecionam backend;

por que o backend
é um Service;

como EndpointSlices
influenciam o resultado;

como diagnosticar
404, 502 e 503;

por que port-forward
é apenas o acesso local
ao controller;

como TLS
se encaixa;

por que HPA
fica para a próxima aula.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
530:
Probes liveness readiness startup.

531:
Requests limits.

532:
Ingress.

533:
HPA.

534:
Kubernetes troubleshooting.
```

A aula 531 respondeu:

```text
como proteger
scheduling,
CPU,
memória
e rollout capacity?
```

A aula 532 responderá:

```text
como receber
tráfego HTTP,
selecionar regras
e encaminhar
para o Service?
```

Nesta aula:

```text
Ingress:
sim.

IngressClass:
sim.

Ingress Controller:
sim.

ingress-nginx:
sim.

Helm:
somente instalação.

host routing:
sim.

path routing:
sim.

ClusterIP backend:
sim.

EndpointSlice:
sim.

port-forward:
sim.

controller logs:
sim.

TLS:
conceitual.

Gateway API:
conceitual.

NetworkPolicy:
não.

HPA:
não.

Metrics Server:
não.

DNS público:
não.

certificado:
não.
```

A regra central será:

```text
Ingress define a rota;

controller executa a rota;

Service encontra endpoints;

Pods respondem.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
k8s/ingress
├── ingress.yaml
├── ingress-policy.yaml
├── ingress-controller-lock.example.yaml
├── route-contract.yaml
└── tls-adoption-plan.yaml

scripts/kubernetes/ingress
├── verify-helm.ps1
├── install-ingress-controller.ps1
├── verify-ingress-controller.ps1
├── validate-ingress-manifest.ps1
├── apply-orders-ingress.ps1
├── start-ingress-port-forward.ps1
├── test-ingress-routing.ps1
├── inspect-ingress-chain.ps1
├── collect-ingress-evidence.ps1
└── cleanup-ingress.ps1

docs/devops/kubernetes-ingress
├── INGRESS_ARCHITECTURE.md
├── INGRESS_CLASS_AND_CONTROLLER.md
├── HOST_PATH_ROUTING.md
├── INGRESS_SECURITY_POLICY.md
├── INGRESS_TLS_PLAN.md
├── INGRESS_OBSERVABILITY.md
├── INGRESS_RUNBOOK.md
├── INGRESS_TEST_MATRIX.md
└── INGRESS_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
controller instalado;

IngressClass validada;

Ingress aplicado;

host routing;

path Prefix;

backend Service;

port-forward do controller;

requisição com Host;

rota saudável;

cenários de falha;

evidência sanitizada.
```

Você irá:

1. confirmar cluster;
2. confirmar workload;
3. validar Helm;
4. resolver chart version;
5. instalar controller;
6. aguardar rollout;
7. validar namespace;
8. validar IngressClass;
9. criar route contract;
10. criar policy;
11. criar Ingress;
12. validar server-side dry-run;
13. aplicar Ingress;
14. observar events;
15. iniciar port-forward;
16. testar host correto;
17. testar host incorreto;
18. testar readiness;
19. inspecionar logs;
20. validar Service;
21. validar EndpointSlices;
22. simular class incorreta;
23. simular Service incorreto;
24. simular port incorreta;
25. restaurar;
26. documentar TLS;
27. criar scripts;
28. coletar evidence;
29. executar gate;
30. commitar;
31. preparar a aula 533.

---

## Conceito essencial

### Ingress

Resource que descreve regras HTTP e HTTPS de entrada.

---

### Ingress Controller

Software que observa Ingresses e implementa as regras.

---

### IngressClass

Resource que associa uma classe a um controller.

---

### Host rule

Regra condicionada pelo host HTTP.

---

### Path rule

Regra condicionada pelo path da requisição.

---

### `pathType: Exact`

Correspondência exata.

---

### `pathType: Prefix`

Correspondência por prefixo de segmentos.

---

### `pathType: ImplementationSpecific`

Semântica definida pelo controller.

---

### Backend Service

Service Kubernetes que recebe o tráfego encaminhado.

---

### Default backend

Resposta usada quando nenhuma regra corresponde, conforme o controller.

---

### TLS section

Associa hosts a um Secret TLS.

Não será aplicada no laboratório.

---

### Controller annotation

Configuração específica da implementação.

---

### Gateway API

Modelo de tráfego mais expressivo e com separação de responsabilidades.

Não será implementado nesta aula.

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

### 2. Confirmar a aplicação

```powershell
kubectl get deployment,pod,service,endpointslice `
  --namespace `
  formacao-java-dev
```

Confirme:

```text
Deployment:
2/2 Ready.

Service:
orders-api.

EndpointSlices:
2 endpoints prontos.
```

---

### 3. Validar Helm

Execute:

```powershell
helm version
```

O script:

```text
verify-helm.ps1
```

deve validar:

- comando disponível;
- versão legível;
- cluster acessível;
- context permitido;
- ausência de credenciais em saída;
- repositórios configurados.

---

### 4. Adicionar o repositório do controller

Execute:

```powershell
helm repo add `
  ingress-nginx `
  "https://kubernetes.github.io/ingress-nginx"
```

Depois:

```powershell
helm repo update
```

O script registra a origem utilizada.

---

### 5. Resolver uma versão explícita

Liste versões:

```powershell
helm search repo `
  ingress-nginx/ingress-nginx `
  --versions
```

O script deve selecionar uma versão por parâmetro ou política aprovada.

Exemplo de uso:

```powershell
.\scripts\kubernetes\ingress\install-ingress-controller.ps1 `
  -ChartVersion `
  "<versao-aprovada>"
```

O valor não é fixado nesta aula porque precisa corresponder ao índice efetivamente validado no momento da execução.

O script grava:

```text
chart;

chart version;

app version;

timestamp;

repository.
```

No arquivo de evidence.

---

### 6. Instalar o controller

O script executará uma operação equivalente a:

```powershell
helm upgrade `
  --install `
  ingress-nginx `
  ingress-nginx/ingress-nginx `
  --namespace `
  ingress-nginx `
  --create-namespace `
  --version `
  $ChartVersion `
  --wait `
  --timeout `
  5m
```

A instalação precisa falhar quando a versão não foi informada ou resolvida de forma controlada.

---

### 7. Validar o rollout do controller

```powershell
kubectl rollout status `
  deployment/ingress-nginx-controller `
  --namespace `
  ingress-nginx `
  --timeout `
  300s
```

Depois:

```powershell
kubectl get pods,service `
  --namespace `
  ingress-nginx
```

---

### 8. Validar a IngressClass

```powershell
kubectl get ingressclass
```

Depois:

```powershell
kubectl describe ingressclass `
  nginx
```

Confirme o controller associado.

---

### 9. Criar contrato da rota

Arquivo:

```text
k8s/ingress/route-contract.yaml
```

Conteúdo:

```yaml
route:
  name:
    orders-api

  namespace:
    formacao-java-dev

  class:
    nginx

  host:
    orders.local

  paths:
    - path:
        /

      pathType:
        Prefix

      service:
        name:
          orders-api

        port:
          80

  tls:
    enabled:
      false
```

---

### 10. Criar policy

Arquivo:

```text
k8s/ingress/ingress-policy.yaml
```

Inclua:

```yaml
ingress:
  className:
    required

  hosts:
    uniqueOwner:
      required

  paths:
    overlap:
      forbidden

  backend:
    serviceRequired:
      true

    readyEndpointsRequired:
      true

  annotations:
    allowlist:
      required

  tls:
    production:
      required

    laboratory:
      optional
```

---

### 11. Criar o Ingress

Arquivo:

```text
k8s/ingress/ingress.yaml
```

Conteúdo:

```yaml
apiVersion:
  networking.k8s.io/v1

kind:
  Ingress

metadata:
  name:
    orders-api

  namespace:
    formacao-java-dev

  labels:
    app.kubernetes.io/name:
      formacao-java-integrations

    app.kubernetes.io/instance:
      orders-api-dev

    app.kubernetes.io/component:
      ingress

    app.kubernetes.io/part-of:
      formacao-java

    app.kubernetes.io/managed-by:
      kubectl

spec:
  ingressClassName:
    nginx

  rules:
    - host:
        orders.local

      http:
        paths:
          - path:
              /

            pathType:
              Prefix

            backend:
              service:
                name:
                  orders-api

                port:
                  number:
                    80
```

Nenhuma annotation específica é necessária.

---

### 12. Validar com dry-run do servidor

```powershell
kubectl apply `
  --server-side `
  --dry-run=server `
  -f `
  "k8s/ingress/ingress.yaml"
```

O script também valida o Service e a porta antes do apply real.

---

### 13. Aplicar o Ingress

```powershell
kubectl apply `
  -f `
  "k8s/ingress/ingress.yaml"
```

---

### 14. Inspecionar o Ingress

```powershell
kubectl get ingress `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o wide
```

Depois:

```powershell
kubectl describe ingress `
  orders-api `
  --namespace `
  formacao-java-dev
```

Observe:

- class;
- host;
- path;
- backend;
- events.

---

### 15. Iniciar port-forward do controller

Execute em um terminal separado:

```powershell
kubectl port-forward `
  service/ingress-nginx-controller `
  18080:80 `
  --namespace `
  ingress-nginx
```

O port-forward termina quando o processo é encerrado.

---

### 16. Testar o host correto

Em outro terminal:

```powershell
Invoke-WebRequest `
  "http://localhost:18080/actuator/health/readiness" `
  -Headers @{
    Host = "orders.local"
  } `
  -UseBasicParsing
```

A resposta deve vir da aplicação.

---

### 17. Testar com `curl`

Alternativa:

```powershell
curl.exe `
  --header `
  "Host: orders.local" `
  "http://localhost:18080/actuator/health/readiness"
```

---

### 18. Testar host incorreto

```powershell
curl.exe `
  --header `
  "Host: desconhecido.local" `
  --include `
  "http://localhost:18080/actuator/health/readiness"
```

A regra não deve selecionar o backend `orders-api`.

Registre o status retornado pelo controller instalado.

Não assuma um código universal para todos os controllers.

---

### 19. Validar a cadeia interna

Execute:

```powershell
kubectl get service `
  orders-api `
  --namespace `
  formacao-java-dev
```

Depois:

```powershell
kubectl get endpointslice `
  --namespace `
  formacao-java-dev `
  --selector `
  "kubernetes.io/service-name=orders-api"
```

Confirme endpoints prontos.

---

### 20. Consultar logs do controller

Primeiro encontre o Pod:

```powershell
kubectl get pods `
  --namespace `
  ingress-nginx `
  -l `
  "app.kubernetes.io/component=controller"
```

Depois:

```powershell
kubectl logs `
  --namespace `
  ingress-nginx `
  --selector `
  "app.kubernetes.io/component=controller" `
  --tail `
  100
```

Não publique logs brutos como artifact sem sanitização.

---

### 21. Observar alterações

Altere temporariamente o host para:

```text
orders-v2.local.
```

Aplique.

Confirme que:

- host antigo deixa de corresponder;
- host novo passa a corresponder;
- controller não precisa de restart manual.

Restaure `orders.local`.

---

### 22. Simular IngressClass incorreta

Altere temporariamente:

```yaml
ingressClassName:
  classe-inexistente
```

Aplique em branch de laboratório.

Observe:

- object existe;
- controller não implementa a rota;
- teste falha;
- events e status ajudam no diagnóstico.

Restaure `nginx`.

---

### 23. Simular Service inexistente

Altere temporariamente o backend para:

```text
orders-api-inexistente.
```

Observe:

- Ingress é aceito;
- controller registra backend inválido;
- requisição falha;
- logs e describe ajudam.

Restaure.

---

### 24. Simular porta incorreta

Altere temporariamente:

```yaml
port:
  number:
    81
```

Como o Service não oferece essa porta, a validação local deve bloquear antes do apply.

Confirme o gate.

Restaure 80.

---

### 25. Simular Service sem endpoints

Escale temporariamente o Deployment para zero somente em cenário controlado:

```powershell
kubectl scale `
  deployment/orders-api `
  --replicas `
  0 `
  --namespace `
  formacao-java-dev
```

Observe:

- Service permanece;
- EndpointSlice não possui endpoints prontos;
- Ingress não consegue entregar resposta da aplicação.

Restaure imediatamente:

```powershell
kubectl apply `
  -f `
  "k8s/workloads/deployment.yaml"
```

Aguarde duas réplicas Ready.

---

### 26. Criar lock de instalação

Arquivo:

```text
ingress-controller-lock.example.yaml
```

Campos:

```yaml
controller:
  chart:
    ingress-nginx/ingress-nginx

  chartVersion:
    recorded-at-install-time

  appVersion:
    recorded-at-install-time

  repository:
    https://kubernetes.github.io/ingress-nginx

  namespace:
    ingress-nginx

  ingressClass:
    nginx
```

O arquivo é exemplo.

A evidence real registra os valores resolvidos.

---

### 27. Criar plano de TLS

Arquivo:

```text
tls-adoption-plan.yaml
```

Inclua:

- host;
- issuer;
- Secret type TLS;
- renewal;
- redirect;
- expiry alert;
- minimum protocol;
- ownership;
- rollback;
- local test;
- production approval.

Nenhum certificado é criado.

---

### 28. Criar validator do manifest

Arquivo:

```text
validate-ingress-manifest.ps1
```

Valide:

- context;
- namespace;
- API version;
- class;
- host;
- path;
- pathType;
- Service;
- Service port;
- ready endpoints;
- annotations permitidas;
- ausência de TLS incompleto;
- ausência de Secret em texto.

---

### 29. Criar teste automatizado

Arquivo:

```text
test-ingress-routing.ps1
```

Parâmetros:

```text
-LocalPort;

-HostName;

-Path;

-ExpectedStatus.
```

O script:

- envia header Host;
- mede latência;
- valida status;
- registra body apenas quando não sensível;
- não imprime headers de autenticação;
- falha em timeout.

---

### 30. Criar inspector da cadeia

Arquivo:

```text
inspect-ingress-chain.ps1
```

Mostre:

- IngressClass;
- Ingress;
- controller Ready;
- controller Service;
- backend Service;
- Service port;
- EndpointSlices;
- Pods Ready;
- HTTP result.

---

### 31. Criar evidence

Arquivo:

```text
kubernetes-ingress-evidence.json.
```

Campos permitidos:

- context;
- controller chart;
- chart version;
- app version;
- controller ready replicas;
- IngressClass;
- Ingress host;
- path;
- pathType;
- backend Service;
- backend port;
- ready endpoints;
- correct host status;
- incorrect host status;
- latency;
- failure scenarios restored;
- application ready replicas;
- timestamp.

Sem kubeconfig, tokens, cookies ou logs brutos.

---

### 32. Criar documentação

#### `INGRESS_ARCHITECTURE.md`

Explique cliente, controller, Ingress, Service e Pods.

#### `INGRESS_CLASS_AND_CONTROLLER.md`

Explique a separação entre API e implementação.

#### `HOST_PATH_ROUTING.md`

Explique hosts, paths e conflitos.

#### `INGRESS_SECURITY_POLICY.md`

Defina exposição, annotations, headers e endpoints administrativos.

#### `INGRESS_TLS_PLAN.md`

Defina adoção futura de TLS.

#### `INGRESS_OBSERVABILITY.md`

Relacione status, events, logs e latência.

---

### 33. Criar runbook

Arquivo:

```text
INGRESS_RUNBOOK.md
```

Passos:

1. preflight;
2. controller;
3. class;
4. workload;
5. Service;
6. endpoints;
7. dry-run;
8. apply;
9. port-forward;
10. host test;
11. logs;
12. evidence;
13. restore.

---

### 34. Criar test matrix

Arquivo:

```text
INGRESS_TEST_MATRIX.md
```

Cenários:

- controller Ready;
- class existe;
- Ingress válido;
- host correto;
- host incorreto;
- path Prefix;
- Service válido;
- port válida;
- endpoints prontos;
- class incorreta;
- Service ausente;
- port ausente;
- endpoints vazios;
- controller parado;
- port-forward encerrado;
- annotation proibida;
- TLS incompleto;
- evidence sanitizada;
- baseline restaurada.

---

### 35. Criar troubleshooting

Arquivo:

```text
INGRESS_TROUBLESHOOTING.md
```

Inclua:

- controller ausente;
- IngressClass ausente;
- class divergente;
- host incorreto;
- path incorreto;
- backend Service ausente;
- port incorreta;
- Service sem endpoints;
- Pods não Ready;
- resposta default;
- 502;
- 503;
- timeout;
- port-forward recusado;
- annotation incompatível;
- logs sem permissão;
- chart version não registrada.

---

### 36. Restaurar a baseline

Confirme:

```text
IngressClass:
nginx.

host:
orders.local.

path:
/.

backend:
orders-api:80.

Deployment:
2/2 Ready.

endpoints:
2 prontos.
```

Nenhuma classe, Service ou port temporária pode permanecer.

---

### 37. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\ingress\verify-helm.ps1

.\scripts\kubernetes\ingress\verify-ingress-controller.ps1

.\scripts\kubernetes\ingress\validate-ingress-manifest.ps1

.\scripts\kubernetes\ingress\apply-orders-ingress.ps1

.\scripts\kubernetes\ingress\test-ingress-routing.ps1 `
  -LocalPort `
  18080 `
  -HostName `
  "orders.local" `
  -Path `
  "/actuator/health/readiness" `
  -ExpectedStatus `
  200

.\scripts\kubernetes\ingress\inspect-ingress-chain.ps1

.\scripts\kubernetes\ingress\collect-ingress-evidence.ps1
```

Finalize:

```powershell
kubectl get ingress `
  --namespace `
  formacao-java-dev

kubectl get ingressclass

kubectl get deployment,pod,service,endpointslice `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

---

## Entendendo o que foi feito

### O Service ganhou uma entrada HTTP

O backend interno passou a ser alcançado por regra de Ingress.

### A API foi separada da implementação

Ingress descreveu; o controller executou.

### A classe ficou explícita

O manifest não dependeu de default implícito.

### Host e path ganharam contrato

`orders.local` com `/` Prefix selecionou o backend.

### A cadeia permaneceu baseada em Service

O controller não selecionou Pods diretamente.

### EndpointSlices continuaram críticos

Sem endpoints prontos, a rota não entrega a aplicação.

### O acesso local ficou previsível

Port-forward expôs o controller, não um Pod específico.

### Falhas foram isoladas

Class, Service, port e endpoints produziram sintomas diferentes.

### TLS ganhou plano sem implementação incompleta

Nenhuma private key entrou no laboratório.

### A próxima aula ganhou uma entrada estável

O HPA poderá alterar réplicas sem mudar a rota externa.

---

## Erros comuns importantes

### Criar Ingress sem controller

O object existe, mas nenhuma rota é executada.

### Omitir `ingressClassName`

O resource pode ser ignorado ou entregue ao controller errado.

### Apontar Ingress diretamente para Pod

O backend da API v1 utiliza Service.

### Usar path rewrite sem necessidade

A aplicação e o proxy ficam acoplados.

### Aplicar annotation copiada de outro controller

O comportamento pode ser ignorado ou incorreto.

### Expor Actuator inteiro

Endpoints administrativos podem ficar públicos.

### Confiar em `X-Forwarded-*` de qualquer origem

Headers podem ser forjados.

### Confundir port-forward com exposição produtiva

O processo local é temporário.

### Criar TLS com chave versionada

A private key não pode entrar no Git.

### Diagnosticar somente o Ingress

Service, endpoints e Pods podem ser a causa.

### Instalar chart sem registrar versão

O laboratório deixa de ser reproduzível.

### Antecipar HPA

A aula 533 possui esse objetivo.

---

## Comandos úteis

### Listar controller

```powershell
kubectl get deployment,pod,service `
  --namespace `
  ingress-nginx
```

### Listar classes

```powershell
kubectl get ingressclass
```

### Descrever Ingress

```powershell
kubectl describe ingress `
  orders-api `
  --namespace `
  formacao-java-dev
```

### Testar host

```powershell
curl.exe `
  --header `
  "Host: orders.local" `
  "http://localhost:18080/actuator/health/readiness"
```

### Consultar logs do controller

```powershell
kubectl logs `
  --namespace `
  ingress-nginx `
  --selector `
  "app.kubernetes.io/component=controller" `
  --tail `
  100
```

---

## Exercício guiado

### Parte 1 — Controller

Instale e registre a versão.

### Parte 2 — Class

Valide `nginx`.

### Parte 3 — Contract

Defina host, path e backend.

### Parte 4 — Ingress

Crie e aplique o resource.

### Parte 5 — Access

Faça port-forward do controller.

### Parte 6 — Routing

Teste o header Host.

### Parte 7 — Chain

Valide Service e EndpointSlices.

### Parte 8 — Failure

Simule class, Service e port incorretos.

### Parte 9 — Security

Defina policy e plano de TLS.

### Parte 10 — Evidence

Registre a rota sem dados sensíveis.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 531 foi preservada;
- Ingress foi definido;
- Ingress Controller foi definido;
- IngressClass foi definida;
- host rule foi definida;
- path rule foi definida;
- `Exact` foi explicado;
- `Prefix` foi explicado;
- `ImplementationSpecific` foi explicado;
- backend Service foi definido;
- default backend foi explicado;
- TLS section foi explicada;
- controller annotations foram explicadas;
- Gateway API foi mencionada sem implementação;
- context kind foi validado;
- preflight foi executado;
- Deployment estava Ready;
- Service foi validado;
- EndpointSlices estavam prontos;
- Helm foi validado;
- repositório oficial do chart foi configurado;
- índice foi atualizado;
- versão explícita foi exigida;
- chart version foi registrada;
- app version foi registrada;
- controller foi instalado;
- namespace do controller foi criado;
- rollout do controller foi aguardado;
- Pods do controller ficaram Ready;
- Service do controller foi validado;
- IngressClass nginx foi validada;
- controller associado foi observado;
- contrato de rota foi criado;
- host `orders.local` foi definido;
- path `/` foi definido;
- pathType Prefix foi definido;
- backend `orders-api` foi definido;
- backend port 80 foi definida;
- TLS permaneceu desativado no laboratório;
- policy de Ingress foi criada;
- classe obrigatória foi definida;
- owner único por host foi definido;
- sobreposição ambígua foi proibida;
- annotations passaram por allowlist;
- Ingress usa `networking.k8s.io/v1`;
- namespace explícito foi usado;
- labels recomendadas foram usadas;
- `ingressClassName: nginx` foi usado;
- Service backend foi usado;
- nenhuma annotation desnecessária foi usada;
- dry-run do servidor foi executado;
- Service e port foram validados antes do apply;
- Ingress foi aplicado;
- Ingress foi descrito;
- class foi observada;
- host foi observado;
- path foi observado;
- backend foi observado;
- events foram observados;
- port-forward do controller foi iniciado;
- porta local 18080 foi usada;
- host correto foi testado;
- readiness foi acessada pelo Ingress;
- host incorreto foi testado;
- status do host incorreto foi registrado;
- Service foi inspecionado;
- EndpointSlices foram inspecionados;
- dois endpoints prontos foram confirmados;
- logs do controller foram consultados;
- logs brutos não viraram artifact;
- alteração de host foi observada;
- controller atualizou sem restart manual;
- host original foi restaurado;
- classe inexistente foi simulada;
- rota não implementada foi observada;
- classe nginx foi restaurada;
- Service inexistente foi simulado;
- falha do backend foi observada;
- Service original foi restaurado;
- port incorreta foi bloqueada;
- port 80 foi restaurada;
- Service sem endpoints foi simulado;
- Deployment foi restaurado para duas réplicas;
- endpoints voltaram a ficar prontos;
- lock de instalação foi modelado;
- plano de TLS foi criado;
- nenhum certificado foi criado;
- nenhuma private key foi criada;
- validator do manifest foi criado;
- annotations permitidas foram validadas;
- TLS incompleto foi bloqueado;
- teste automatizado de routing foi criado;
- timeout foi definido;
- inspector da cadeia foi criado;
- evidence foi criada;
- evidence não contém kubeconfig;
- evidence não contém tokens;
- evidence não contém cookies;
- evidence não contém logs brutos;
- arquitetura foi documentada;
- classe e controller foram documentados;
- host e path foram documentados;
- security policy foi criada;
- TLS plan foi documentado;
- observability foi documentada;
- runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- baseline foi restaurada;
- HPA não foi criado;
- Metrics Server não foi instalado para HPA;
- DNS público não foi criado;
- TLS não foi implementado;
- NetworkPolicy não foi criada;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 533 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/ingress `
  scripts/kubernetes/ingress `
  docs/devops/kubernetes-ingress `
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
      "tls.key|private.key|token|client-key-data|authorization:"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): configurar Ingress Kubernetes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- token;
- private key;
- certificado real;
- logs brutos do controller;
- evidence não sanitizada;
- host temporário;
- classe incorreta;
- Service inválido;
- port incorreta;
- Deployment escalado para zero;
- HPA da aula 533.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o Service interno recebeu uma camada de entrada HTTP.

A cadeia passou a ser:

```text
cliente;

Ingress Controller;

Ingress rule;

Service;

EndpointSlice;

Pod.
```

Você comprovou que:

- Ingress não executa regras sozinho;
- o controller observa e implementa;
- IngressClass seleciona a implementação;
- host e path escolhem o backend;
- pathType define a semântica de correspondência;
- o backend continua sendo um Service;
- EndpointSlices prontos são necessários;
- port-forward do controller é apenas acesso local;
- host incorreto não seleciona a rota;
- class, Service e port incorretos geram falhas diferentes;
- annotations aumentam dependência do controller;
- TLS exige certificado, Secret e renovação;
- Ingress não substitui autenticação da aplicação;
- a rota permanece estável mesmo quando Pods mudam.

A próxima aula será:

```text
533 - M17.28 - HPA
```

Nela, você irá alterar dinamicamente o número de réplicas com base em métricas, requests e políticas de estabilização, mantendo o Ingress e o Service independentes da quantidade de Pods.

Nenhum HPA ou mecanismo de autoscaling foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Instalei o controller com versão registrada.
- [ ] Validei a IngressClass.
- [ ] Criei o Ingress.
- [ ] Testei host e path.
- [ ] Validei Service e endpoints.
- [ ] Simulei falhas controladas.
- [ ] Restaurei a baseline.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O Ingress existe, mas a rota não responde

Confirme se existe um controller para a classe.

### A IngressClass não existe

A instalação do controller pode ter falhado ou usado outro nome.

### O host correto retorna resposta default

Revise header Host, class, regra e logs do controller.

### O controller retorna erro de backend

Revise Service, port e EndpointSlices.

### O Service existe, mas não possui endpoints

Os Pods podem estar não prontos ou os selectors estão incorretos.

### O port-forward falha

Revise Service do controller, namespace e processo local.

### O controller não atualiza a regra

Revise events, logs, generation e class.

### O path exige rewrite

Confirme primeiro se a aplicação pode atender o path original.

### Um endpoint administrativo ficou público

Restrinja a regra e revise a security policy.

### O TLS não funciona

Esta aula não criou certificado nem Secret TLS.

### A chart version não foi registrada

A instalação não atende ao requisito de reprodutibilidade.

### Um HPA apareceu nesta aula

Remova e preserve para a aula 533.

---

## Perguntas de revisão

1. O que é Ingress?
2. O que é Ingress Controller?
3. O que é IngressClass?
4. Ingress funciona sem controller?
5. O que é host routing?
6. O que é path routing?
7. O que significa `Exact`?
8. O que significa `Prefix`?
9. O que significa `ImplementationSpecific`?
10. Qual é o backend do Ingress?
11. O Ingress seleciona Pods diretamente?
12. O que ocorre sem endpoints prontos?
13. Para que serve `ingressClassName`?
14. O que são annotations do controller?
15. Port-forward é exposição produtiva?
16. O que é default backend?
17. Como TLS se relaciona ao Ingress?
18. O Ingress substitui autenticação?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Regras HTTP e HTTPS.
2. Implementação das regras.
3. Associação com controller.
4. Não de forma funcional.
5. Seleção pelo host.
6. Seleção pelo path.
7. Correspondência exata.
8. Correspondência por prefixo.
9. Semântica do controller.
10. Service.
11. Não.
12. Backend não atende.
13. Escolher controller.
14. Configuração específica.
15. Não.
16. Resposta sem regra.
17. Host e Secret TLS.
18. Não.
19. HPA e TLS real.
20. HPA.

---

## Desafio opcional

Crie uma segunda rota por host.

Requisitos:

- novo host local;
- mesmo controller;
- Service controlado;
- IngressClass explícita;
- nenhuma sobreposição;
- teste com header Host;
- host incorreto bloqueado;
- evidence;
- cleanup;
- nenhum HPA.

O objetivo é comprovar que um controller pode atender múltiplas regras sem alterar os Pods.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 532 - M17.27 - Ingress

- Continuei após requests e limits.
- Diferenciei Ingress, IngressClass e Ingress Controller.
- Mantive o Service como backend da aplicação.
- Validei o cluster e os dois endpoints prontos.
- Validei Helm.
- Configurei o repositório oficial do ingress-nginx.
- Exigi chart version explícita.
- Registrei chart e app version.
- Instalei o controller em namespace próprio.
- Aguardei o rollout do controller.
- Validei a IngressClass `nginx`.
- Criei contrato de host e path.
- Criei policy de Ingress.
- Criei Ingress com `networking.k8s.io/v1`.
- Usei `ingressClassName: nginx`.
- Usei host `orders.local`.
- Usei path `/` com `Prefix`.
- Apontei para o Service `orders-api:80`.
- Executei server-side dry-run.
- Apliquei e descrevi o Ingress.
- Fiz port-forward do controller.
- Testei a rota com header Host.
- Testei host incorreto.
- Validei Service e EndpointSlices.
- Consultei logs do controller.
- Simulei classe inexistente.
- Simulei Service inexistente.
- Bloqueei port incorreta.
- Simulei Service sem endpoints.
- Restaurei duas réplicas e dois endpoints.
- Criei lock de instalação, plano de TLS, scripts e evidence.
- Não antecipei HPA.
- Próxima aula: HPA.
```

---

## Referência técnica curta

- Kubernetes Ingress.
- Kubernetes IngressClass.
- Ingress Controllers.
- Ingress NGINX Controller.
- Kubernetes Services.
- Kubernetes EndpointSlices.
- Host-Based Routing.
- Path-Based Routing.
- Kubernetes TLS Secrets.
- Kubernetes Gateway API.

Regra final:

```text
Ingress descreve regras HTTP e HTTPS, mas somente um Ingress Controller compatível as materializa; IngressClass explícita evita seleção implícita, host e pathType determinam a rota, e o backend permanece um Service que depende de EndpointSlices e Pods prontos; no laboratório kind, ingress-nginx é instalado por Helm com chart version e app version registradas, o Ingress `networking.k8s.io/v1` atende `orders.local` no path `/` Prefix e encaminha para `orders-api:80`, enquanto um port-forward do Service do controller permite testar a rota por header Host sem alterar DNS local; classes, Services, ports e endpoints inválidos são simulados e restaurados, annotations passam por allowlist e TLS permanece como plano com certificado, renovação e Secret próprios, sem private key no Git; com a entrada HTTP estável e independente da identidade dos Pods, a aula 533 poderá introduzir HPA sem alterar Ingress ou Service.
```
