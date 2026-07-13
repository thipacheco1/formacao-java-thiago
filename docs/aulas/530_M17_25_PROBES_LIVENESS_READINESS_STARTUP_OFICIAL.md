# 530 - M17.25 - Probes liveness readiness startup

## Apresentação da aula

Na aula 529, o workload Kubernetes passou a receber configuração e credenciais por referências externas ao Deployment.

A arquitetura agora possui:

```text
ConfigMap;

Secret;

valueFrom;

volumes;

rollout;

rotação;

evidência sanitizada.
```

O Deployment já contém:

```text
startupProbe;

readinessProbe;

livenessProbe.
```

Até agora, essas probes foram usadas como uma baseline funcional.

Nesta aula, você irá compreender em profundidade o que cada uma significa, como elas interagem com o lifecycle do container e como uma configuração incorreta pode derrubar um rollout saudável.

A pergunta central será:

```text
como o Kubernetes decide

quando aguardar a inicialização,

quando liberar tráfego

e quando reiniciar
um container?
```

A resposta não é apenas:

```text
usar três endpoints de health.
```

Uma probe profissional precisa representar uma condição operacional real.

Ela precisa responder:

```text
startup:

a aplicação terminou
sua fase de inicialização?

readiness:

a instância pode
receber tráfego agora?

liveness:

o processo está preso
e precisa ser reiniciado?
```

Essas perguntas não são equivalentes.

Uma aplicação pode estar:

```text
viva,
mas não pronta.
```

Exemplo:

- processo Java em execução;
- thread principal ativa;
- endpoint HTTP respondendo;
- banco temporariamente indisponível;
- consumer aguardando conexão;
- cache em aquecimento;
- migração ainda não concluída;
- configuração externa ainda não carregada.

Nesse cenário:

```text
liveness:
sucesso.

readiness:
falha.
```

O Kubernetes mantém o container em execução.

O Service deixa de enviar tráfego enquanto a instância não está pronta.

Outro cenário:

- deadlock;
- event loop travado;
- servidor HTTP sem resposta;
- processo preso;
- estado irrecuperável.

Nesse caso:

```text
liveness:
falha repetidamente.

ação:
restart do container.
```

Outro cenário:

- Spring Boot leva 45 segundos para iniciar;
- liveness começa após 5 segundos;
- a aplicação ainda não abriu a porta;
- o kubelet interpreta como falha;
- reinicia o container;
- o processo nunca termina de iniciar.

Esse ciclo é evitado por:

```text
startupProbe.
```

Enquanto a startup probe ainda não teve sucesso:

```text
liveness
e
readiness

não assumem
a responsabilidade normal.
```

Quando a startup probe passa:

```text
a fase de startup termina;

readiness passa a controlar tráfego;

liveness passa a controlar restart.
```

A regra central da aula será:

```text
startup protege a inicialização;

readiness protege o tráfego;

liveness protege contra travamento.
```

Outro princípio será:

```text
dependência externa
raramente deve
derrubar liveness.
```

Se a aplicação perde conexão com o banco por 20 segundos, reiniciar todos os Pods pode piorar a situação.

Exemplo de efeito em cascata:

```text
banco instável;

liveness depende do banco;

todos os Pods falham;

todos reiniciam;

todos reabrem conexões;

banco recebe pico;

falha aumenta.
```

Readiness pode falhar temporariamente para retirar a instância do tráfego.

Liveness deve verificar se o processo ainda consegue progredir.

A aula usará Spring Boot Actuator.

Os endpoints principais serão:

```text
/actuator/health/liveness;

/actuator/health/readiness.
```

Eles se relacionam aos grupos de health do Spring Boot.

Entretanto, o simples fato de existirem não garante uma política correta.

É necessário revisar:

- quais indicators entram em cada grupo;
- se banco está em readiness;
- se Kafka está em readiness;
- se liveness está isolada;
- se detalhes sensíveis aparecem;
- se o endpoint responde rápido;
- se o endpoint depende de recursos caros;
- se o endpoint está disponível durante startup.

A aula também trabalhará com os principais campos das probes.

```text
initialDelaySeconds;

periodSeconds;

timeoutSeconds;

successThreshold;

failureThreshold;

terminationGracePeriodSeconds.
```

Nem todos os campos têm o mesmo papel.

#### `initialDelaySeconds`

Espera antes de iniciar a probe.

Quando existe startup probe, um grande `initialDelaySeconds` em liveness costuma ser desnecessário.

#### `periodSeconds`

Intervalo aproximado entre tentativas.

Valores muito baixos aumentam carga.

Valores muito altos atrasam detecção.

#### `timeoutSeconds`

Tempo máximo de cada tentativa.

Precisa ser menor que o tempo em que uma falha operacional deve ser detectada.

Não deve ser tão baixo que gere falsos positivos sob pequena variação.

#### `failureThreshold`

Quantidade de falhas consecutivas antes da ação.

Para readiness:

```text
remove endpoint do tráfego.
```

Para liveness:

```text
reinicia container.
```

Para startup:

```text
considera startup fracassada
e reinicia.
```

#### `successThreshold`

Número de sucessos consecutivos para considerar a probe recuperada.

Para liveness e startup, normalmente precisa permanecer em 1.

Para readiness, pode ser maior que 1 quando você deseja evitar retorno prematuro ao tráfego.

Outro cálculo importante será a janela máxima de startup.

Exemplo:

```text
failureThreshold:
30.

periodSeconds:
5.
```

Janela aproximada:

```text
150 segundos.
```

O timeout de cada tentativa também influencia o comportamento real.

A equipe precisa escolher essa janela com base em dados.

Não por adivinhação.

A aula irá medir o tempo de startup do workload local.

Serão observados:

- início do container;
- abertura do servidor;
- conclusão do contexto Spring;
- sucesso da startup probe;
- transição para Ready;
- entrada no EndpointSlice.

Kubernetes suporta probes `httpGet`, `tcpSocket`, `exec` e gRPC.

A baseline continuará com:

```text
httpGet.
```

#### HTTP probe

Boa quando a aplicação possui endpoint dedicado.

Pode validar status code e conectividade HTTP.

#### TCP probe

Valida se uma porta aceita conexão.

Não prova que a aplicação está funcional.

#### Exec probe

Executa um comando dentro do container.

Pode ser útil.

Também pode:

- consumir mais recursos;
- depender de shell;
- depender de binários;
- falhar em imagem distroless;
- ampliar superfície.

#### gRPC probe

Adequada para serviços gRPC com protocolo de health compatível.

Não será implementada no laboratório.

Outro tema será `host`, `scheme`, `path`, `port` e headers.

A probe HTTP normalmente consulta o IP do Pod.

Não é necessário apontar para o Service.

A probe deve testar a própria instância.

O campo `port` pode usar:

```text
número;

nome da porta.
```

A baseline continuará usando:

```text
http.
```

Isso reduz duplicação.

Outro ponto será o código HTTP.

Para uma probe HTTP, respostas dentro da faixa de sucesso são tratadas como êxito conforme o comportamento da plataforma.

Redirecionamentos e respostas inesperadas precisam ser analisados.

A equipe não deve proteger o endpoint com autenticação comum se isso impedir o kubelet de consultá-lo.

Também não deve expor detalhes sensíveis no body.

Quando readiness falha, o Pod pode continuar `Running`, mas `Ready` fica falso e o Service deixa de encaminhar tráfego normal. O Pod não é deletado.

Outro tema será rollout.

Com:

```yaml
maxUnavailable:
  0

maxSurge:
  1
```

o Deployment tenta preservar disponibilidade.

Se o novo Pod nunca fica Ready:

```text
o rollout não completa;

Pods antigos permanecem;

o novo ReplicaSet fica incompleto;

rollout status termina por timeout.
```

Esse comportamento é desejável.

Ele impede que uma revisão não pronta substitua todas as réplicas anteriores.

Por outro lado, se liveness está agressiva:

```text
o novo Pod pode reiniciar continuamente;

a investigação fica mais difícil;

o rollout permanece bloqueado;

logs anteriores precisam ser consultados.
```

A aula criará cenários controlados para observar:

- startup lenta;
- readiness falhando;
- liveness falhando;
- recovery de readiness;
- restart por liveness;
- rollout bloqueado;
- endpoint removido;
- endpoint restaurado.

Nenhum bug real será introduzido na aplicação.

Os cenários serão controlados por ConfigMap e endpoints de laboratório.

Uma configuração de laboratório será criada:

```text
APP_PROBE_SCENARIO.
```

Valores:

```text
normal;

slow-startup;

readiness-failure;

liveness-failure.
```

Essa configuração não será usada em produção.

Ela serve para simular respostas controladas nos endpoints do laboratório.

Se a aplicação ainda não possui suporte a esses cenários, a aula orientará a criação de um pequeno `ProbeScenarioController` apenas no profile de laboratório.

Ele não deve entrar no comportamento produtivo padrão.

Probe não é teste de integração completo. Ela precisa ser rápida, determinística, barata, local e segura; não processa pedido, grava banco, publica Kafka, executa query pesada ou operação destrutiva.

Readiness pode incluir dependências essenciais.

Mesmo assim, a verificação precisa ser curta e controlada.

Outro tema será `terminationGracePeriodSeconds`.

Quando um Pod é encerrado:

1. o Kubernetes sinaliza término;
2. readiness deve deixar de anunciar tráfego;
3. o processo recebe tempo para encerrar;
4. conexões precisam terminar;
5. o container pode ser finalizado à força após a janela.

A aula não aprofundará hooks como `preStop`.

Eles serão citados como evolução.

O foco continuará nas probes.

Você irá correlacionar `get`, `describe`, events, logs atuais e anteriores, EndpointSlices e rollout. A falha aparece nos events, o Pod mostra restarts, o EndpointSlice mostra readiness e o Deployment mostra réplicas disponíveis.

A aula também criará métricas operacionais conceituais.

Exemplos:

```text
startup duration;

readiness failure count;

liveness restart count;

rollout duration;

unavailable replicas;

time outside Service endpoints.
```

Nenhuma stack de métricas será instalada.

Os valores serão coletados por scripts e evidência local.

Outro tema será diferença entre startup da JVM e readiness de negócio.

O contexto Spring pode estar iniciado.

Mas a aplicação pode ainda precisar:

- aquecer cache;
- carregar modelo;
- validar configuração;
- inicializar consumer;
- concluir backfill;
- preparar pool;
- confirmar dependência.

A readiness precisa representar quando o tráfego é seguro.

Não apenas quando a porta abriu.

Outro princípio será:

```text
liveness não deve
oscilar com dependências.
```

Uma liveness instável pode provocar restart storm.

Se o processo consegue recuperar sozinho, reiniciar não ajuda.

Readiness deve ser o primeiro mecanismo de isolamento temporário.

Outro ponto será a segurança.

Endpoints de health não devem expor:

- senha;
- token;
- connection string;
- stack trace;
- nome interno sensível;
- detalhes de infraestrutura além do necessário.

A probe precisa apenas de status adequado.

Detalhes completos podem ficar restritos a mecanismos administrativos.

A aula também preparará a próxima etapa.

A próxima aula será:

```text
531 - M17.26 - Requests limits
```

Portanto, nesta aula:

- requests e limits existentes serão preservados;
- efeitos de CPU throttling e OOM serão citados;
- dimensionamento aprofundado ficará para 531;
- não haverá tuning completo de memória e CPU.

Ao final, você deverá explicar:

```text
quando startup
deve falhar;

quando readiness
deve falhar;

quando liveness
deve falhar;

como calcular
a janela de tolerância;

por que dependência externa
não deve reiniciar tudo;

como readiness
interage com Service;

como probes
interagem com rollout;

como investigar
restart e timeout;

como calibrar
com dados
e não por chute.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
528:
Pod Deployment Service.

529:
ConfigMap Secret.

530:
Probes liveness readiness startup.

531:
Requests limits.

532:
Horizontal Pod Autoscaler.
```

A aula 529 respondeu:

```text
como separar
configuração
e credenciais
do workload?
```

A aula 530 responderá:

```text
como proteger
startup,
tráfego
e recuperação

com probes
bem calibradas?
```

Nesta aula:

```text
startupProbe:
sim.

readinessProbe:
sim.

livenessProbe:
sim.

httpGet:
sim.

tcpSocket:
conceitual.

exec:
conceitual.

gRPC:
conceitual.

initialDelaySeconds:
sim.

periodSeconds:
sim.

timeoutSeconds:
sim.

failureThreshold:
sim.

successThreshold:
sim.

Service endpoints:
sim.

rollout:
sim.

restart:
sim.

events:
sim.

logs previous:
sim.

cenários de falha:
sim.

requests:
preservados.

limits:
preservados.

dimensionamento:
não aprofundado.

HPA:
não.

Ingress:
não.
```

A regra central será:

```text
startup controla
o começo;

readiness controla
o tráfego;

liveness controla
o restart.
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
k8s/configuration/configmap.yaml

k8s/probes
├── probe-policy.yaml
├── probe-scenarios.yaml
├── probe-observability-contract.yaml
└── rollout-safety-policy.yaml

scripts/kubernetes/probes
├── measure-startup-time.ps1
├── validate-probe-configuration.ps1
├── simulate-slow-startup.ps1
├── simulate-readiness-failure.ps1
├── simulate-liveness-failure.ps1
├── verify-service-readiness.ps1
├── inspect-probe-events.ps1
├── collect-probe-evidence.ps1
└── restore-probe-baseline.ps1

docs/devops/kubernetes-probes
├── STARTUP_PROBE_GUIDE.md
├── READINESS_PROBE_GUIDE.md
├── LIVENESS_PROBE_GUIDE.md
├── PROBE_TIMING_POLICY.md
├── PROBE_DEPENDENCY_POLICY.md
├── PROBE_ROLLOUT_POLICY.md
├── PROBE_OBSERVABILITY.md
├── PROBE_TEST_MATRIX.md
└── PROBE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
startup medida;

janela calculada;

readiness observada;

Service endpoints observados;

liveness restart observado;

rollout bloqueado com segurança;

recovery observado;

events e logs coletados;

baseline restaurada;

evidência sanitizada.
```

Você irá:

1. confirmar cluster;
2. confirmar Deployment;
3. revisar endpoints;
4. medir startup;
5. calcular janela;
6. criar policy;
7. criar cenários;
8. validar baseline;
9. simular startup lenta;
10. observar startup probe;
11. simular readiness failure;
12. observar Pod Running;
13. observar Ready false;
14. observar endpoint removido;
15. restaurar readiness;
16. observar endpoint retornar;
17. simular liveness failure;
18. observar restart;
19. consultar logs previous;
20. simular rollout bloqueado;
21. restaurar baseline;
22. validar rollout;
23. criar scripts;
24. criar docs;
25. coletar evidence;
26. executar gate;
27. commitar;
28. preparar a aula 531.

---

## Conceito essencial

### Probe

Teste periódico executado pelo kubelet sobre o container.

---

### Startup probe

Confirma que a fase de inicialização terminou.

Enquanto não passa, protege liveness e readiness contra início prematuro.

---

### Readiness probe

Indica se o container pode receber tráfego.

Falha não reinicia o container.

---

### Liveness probe

Indica se o container precisa ser reiniciado.

Falha repetida provoca restart.

---

### HTTP probe

Executa requisição HTTP no Pod.

---

### TCP probe

Verifica abertura de conexão TCP.

Não valida semântica da aplicação.

---

### Exec probe

Executa comando dentro do container.

Pode depender de shell e binários.

---

### gRPC probe

Verifica health de serviço gRPC compatível.

---

### `initialDelaySeconds`

Espera inicial antes da primeira execução.

---

### `periodSeconds`

Intervalo entre execuções.

---

### `timeoutSeconds`

Tempo máximo de cada tentativa.

---

### `failureThreshold`

Falhas consecutivas necessárias para ação.

---

### `successThreshold`

Sucessos consecutivos necessários para recuperação.

---

### Probe window

Janela aproximada antes da ação.

Exemplo:

```text
periodSeconds
x
failureThreshold.
```

O timeout e o scheduling real também influenciam.

---

### Restart count

Quantidade de reinicializações do container.

---

### Previous logs

Logs do container anterior após restart.

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

### 2. Confirmar o workload

```powershell
kubectl get deployment,pod,service,endpointslice `
  --namespace `
  formacao-java-dev
```

O Deployment precisa possuir:

```text
2 ready replicas.
```

---

### 3. Confirmar os endpoints do Actuator

Use port-forward:

```powershell
kubectl port-forward `
  service/orders-api `
  18084:80 `
  --namespace `
  formacao-java-dev
```

Em outro terminal:

```powershell
Invoke-RestMethod `
  "http://localhost:18084/actuator/health/liveness"
```

Depois:

```powershell
Invoke-RestMethod `
  "http://localhost:18084/actuator/health/readiness"
```

Não publique detalhes sensíveis.

---

### 4. Registrar a baseline atual

No Deployment:

```yaml
startupProbe:
  httpGet:
    path:
      /actuator/health/liveness

    port:
      http

  failureThreshold:
    30

  periodSeconds:
    5

  timeoutSeconds:
    2

readinessProbe:
  httpGet:
    path:
      /actuator/health/readiness

    port:
      http

  initialDelaySeconds:
    5

  periodSeconds:
    10

  timeoutSeconds:
    2

  failureThreshold:
    3

  successThreshold:
    1

livenessProbe:
  httpGet:
    path:
      /actuator/health/liveness

    port:
      http

  periodSeconds:
    10

  timeoutSeconds:
    2

  failureThreshold:
    3

  successThreshold:
    1
```

---

### 5. Calcular a janela de startup

Com:

```text
30 tentativas;

5 segundos.
```

A janela aproximada é:

```text
150 segundos.
```

Crie:

```text
PROBE_TIMING_POLICY.md.
```

Registre:

- startup p50;
- startup p95;
- margem;
- limite;
- justificativa;
- data;
- ambiente.

---

### 6. Criar script de medição

Arquivo:

```text
measure-startup-time.ps1
```

O script deve:

1. registrar timestamp;
2. reiniciar rollout;
3. acompanhar novo Pod;
4. observar container start;
5. observar startup success;
6. observar Ready true;
7. registrar duração;
8. repetir múltiplas vezes;
9. não alterar ConfigMap permanentemente.

---

### 7. Medir pelo menos cinco inicializações

Execute:

```powershell
1..5 |
  ForEach-Object {
    .\scripts\kubernetes\probes\measure-startup-time.ps1
  }
```

Registre:

- mínima;
- mediana;
- máxima;
- falhas;
- restarts.

Não escolha a janela com base em uma única execução.

---

### 8. Criar policy de probes

Arquivo:

```text
k8s/probes/probe-policy.yaml
```

Conteúdo conceitual:

```yaml
probes:
  startup:
    required: true
    dependencyChecks: forbidden
    maximumWindowSeconds: 180

  readiness:
    required: true
    externalDependencies: controlled
    removesFromService: true

  liveness:
    required: true
    externalDependencies: forbidden
    restartOnFailure: true

  security:
    sensitiveDetails: forbidden
```

---

### 9. Criar cenários controlados

Arquivo:

```text
probe-scenarios.yaml
```

Defina:

```yaml
scenarios:
  normal:
    startupDelaySeconds: 0
    readinessFailureSeconds: 0
    livenessFailureSeconds: 0

  slow-startup:
    startupDelaySeconds: 45

  readiness-failure:
    readinessFailureSeconds: 60

  liveness-failure:
    livenessFailureSeconds: 45
```

Esse arquivo descreve apenas o laboratório.

---

### 10. Adicionar configuração de cenário

Na ConfigMap:

```yaml
APP_PROBE_SCENARIO:
  normal
```

No Deployment, injete com `configMapKeyRef`.

A aplicação de laboratório precisa interpretar o valor.

---

### 11. Criar controller de laboratório quando necessário

Crie em package de suporte:

```text
ProbeScenarioController.
```

Requisitos:

- ativo somente em profile local;
- não expõe secrets;
- não executa em prod;
- controla apenas os endpoints de laboratório;
- usa relógio injetável quando testado;
- possui testes unitários;
- default normal;
- não altera endpoints oficiais sem profile.

Se a aplicação já possui mecanismo equivalente, reutilize-o.

---

### 12. Validar a baseline normal

Aplique:

```powershell
kubectl apply `
  -f `
  "k8s/configuration/configmap.yaml"

kubectl apply `
  -f `
  "k8s/workloads/deployment.yaml"
```

Reinicie:

```powershell
kubectl rollout restart `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
```

Aguarde Available.

---

### 13. Simular startup lenta

Altere o cenário para:

```text
slow-startup.
```

Aplique e reinicie o rollout.

Observe:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  --watch
```

A startup probe deve tolerar a inicialização dentro da janela.

---

### 14. Inspecionar startup

Use:

```powershell
kubectl describe pod `
  <novo-pod> `
  --namespace `
  formacao-java-dev
```

Confirme:

- PodScheduled;
- container started;
- startup probe failures temporárias;
- ausência de restart;
- Ready somente após startup.

---

### 15. Reduzir a janela de forma controlada

Em branch de laboratório, altere temporariamente:

```yaml
failureThreshold:
  3

periodSeconds:
  5
```

Janela aproximada:

```text
15 segundos.
```

Com startup de 45 segundos, o container deve reiniciar.

Observe o efeito.

Restaure imediatamente.

---

### 16. Simular readiness failure

Use o cenário:

```text
readiness-failure.
```

Aplique e reinicie.

Observe:

```text
Pod phase:
Running.

Ready:
false.

Restart count:
inalterado.
```

---

### 17. Observar o Service

```powershell
kubectl get endpointslice `
  --namespace `
  formacao-java-dev `
  --selector `
  "kubernetes.io/service-name=orders-api" `
  -o yaml
```

Não use esse YAML como artifact bruto.

Observe apenas a condição de readiness.

O endpoint do Pod não pronto deve deixar de participar normalmente.

---

### 18. Validar indisponibilidade de um endpoint

Com duas réplicas, mantenha apenas uma em cenário de falha quando possível.

Confirme que o Service continua atendendo pela réplica pronta.

Não derrube as duas simultaneamente.

---

### 19. Observar recovery da readiness

Quando o período de falha termina:

```text
readiness volta a passar;

Ready muda para true;

EndpointSlice volta a marcar o endpoint;

Service volta a distribuir tráfego.
```

Registre a duração.

---

### 20. Simular liveness failure

Use:

```text
liveness-failure.
```

Aplique e reinicie.

Aguarde o período configurado.

Observe:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev
```

O contador de restart deve aumentar após falhas consecutivas.

---

### 21. Consultar logs anteriores

```powershell
kubectl logs `
  <pod> `
  --namespace `
  formacao-java-dev `
  --previous
```

Se existirem múltiplos containers, especifique:

```text
--container orders-api.
```

---

### 22. Consultar events

```powershell
kubectl get events `
  --namespace `
  formacao-java-dev `
  --sort-by `
  ".metadata.creationTimestamp"
```

Procure mensagens de probe failure e restart.

---

### 23. Simular dependência externa em liveness

Não altere o endpoint oficial para chamar banco.

Crie apenas um teste ou exemplo documental que demonstre o anti-pattern.

A policy precisa bloquear dependências externas em liveness.

---

### 24. Simular rollout bloqueado por readiness

Altere o cenário da nova revisão para readiness contínua em falha.

Aplique o Pod template.

Com:

```text
maxUnavailable:
0.
```

observe:

- Pods antigos disponíveis;
- novo Pod não Ready;
- rollout não concluído;
- timeout no `rollout status`.

Restaure antes de prosseguir.

---

### 25. Restaurar baseline

Execute:

```powershell
.\scripts\kubernetes\probes\restore-probe-baseline.ps1
```

O script deve:

- aplicar cenário normal;
- aplicar probes oficiais;
- reiniciar rollout;
- aguardar Available;
- validar dois endpoints prontos;
- validar zero cenário de falha ativo.

---

### 26. Criar validator

Arquivo:

```text
validate-probe-configuration.ps1
```

Valide:

- três probes presentes;
- paths corretos;
- named port;
- timeout positivo;
- thresholds válidos;
- startup window suficiente;
- liveness sem dependência externa;
- readiness sem endpoint sensível;
- successThreshold compatível.

---

### 27. Criar verificação de Service

Arquivo:

```text
verify-service-readiness.ps1
```

Compare:

- Pods selecionados;
- Pods Ready;
- EndpointSlices;
- endpoints prontos;
- Service.

---

### 28. Criar observability contract

Arquivo:

```text
probe-observability-contract.yaml
```

Campos:

- startup duration;
- readiness transitions;
- liveness failures;
- restart count;
- rollout duration;
- unavailable replicas;
- event count.

---

### 29. Criar rollout policy

Arquivo:

```text
rollout-safety-policy.yaml
```

Inclua:

- maxUnavailable zero;
- maxSurge um;
- readiness obrigatória;
- startup window medida;
- rollback trigger;
- timeout;
- evidence;
- baseline restoration.

---

### 30. Criar evidence

Arquivo:

```text
kubernetes-probe-evidence.json.
```

Campos permitidos:

- namespace;
- Deployment;
- measured startup samples;
- startup window;
- readiness failure observed;
- endpoint removal observed;
- readiness recovery observed;
- liveness restart observed;
- previous logs collected;
- rollout block observed;
- baseline restored;
- ready replicas;
- timestamp.

Sem secrets, kubeconfig ou logs brutos.

---

### 31. Criar documentação

#### `STARTUP_PROBE_GUIDE.md`

Explique inicialização lenta e janela.

#### `READINESS_PROBE_GUIDE.md`

Explique tráfego, dependências e EndpointSlices.

#### `LIVENESS_PROBE_GUIDE.md`

Explique restart, deadlock e anti-patterns.

#### `PROBE_TIMING_POLICY.md`

Registre método de medição.

#### `PROBE_DEPENDENCY_POLICY.md`

Defina quais dependências entram em readiness.

#### `PROBE_ROLLOUT_POLICY.md`

Relacione probes e RollingUpdate.

#### `PROBE_OBSERVABILITY.md`

Mapeie commands, events e métricas.

---

### 32. Criar test matrix

Arquivo:

```text
PROBE_TEST_MATRIX.md
```

Cenários:

- baseline normal;
- startup dentro da janela;
- startup acima da janela;
- readiness temporária;
- readiness permanente;
- liveness temporária;
- liveness repetida;
- endpoint removido;
- endpoint recuperado;
- rollout bloqueado;
- Pod antigo preservado;
- logs previous;
- endpoint retorna detalhe sensível;
- liveness depende do banco;
- timeout excessivamente baixo;
- period excessivamente curto;
- baseline restaurada.

---

### 33. Criar troubleshooting

Arquivo:

```text
PROBE_TROUBLESHOOTING.md
```

Inclua:

- startup nunca passa;
- restart loop;
- Running sem Ready;
- Service sem endpoint;
- timeout;
- connection refused;
- HTTP 503;
- path incorreto;
- port incorreta;
- named port divergente;
- endpoint protegido;
- rollout travado;
- logs anteriores ausentes;
- dependency storm;
- baseline não restaurada.

---

### 34. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\probes\measure-startup-time.ps1

.\scripts\kubernetes\probes\validate-probe-configuration.ps1

.\scripts\kubernetes\probes\verify-service-readiness.ps1

.\scripts\kubernetes\probes\inspect-probe-events.ps1

.\scripts\kubernetes\probes\collect-probe-evidence.ps1

.\scripts\kubernetes\probes\restore-probe-baseline.ps1
```

Finalize:

```powershell
kubectl get deployment,pod,service,endpointslice `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme:

```text
2 ready replicas;

2 ready endpoints;

cenário normal;

restart não crescendo.
```

---

## Entendendo o que foi feito

### Startup passou a proteger o início

A aplicação recebeu tempo medido para inicializar.

### Readiness passou a proteger o tráfego

Pods não prontos foram removidos dos endpoints.

### Liveness passou a proteger contra travamento

Falhas repetidas provocaram restart controlado.

### A janela ganhou base em dados

Cinco inicializações foram observadas.

### O Service ganhou correlação operacional

EndpointSlices refletiram readiness.

### O rollout ganhou proteção

Uma nova revisão não pronta não substituiu todas as réplicas antigas.

### Logs anteriores ganharam utilidade

O container reiniciado ainda pôde ser investigado.

### Dependências ganharam política

Falhas externas não derrubam liveness automaticamente.

### A baseline foi restaurada

Nenhum cenário artificial permaneceu ativo.

### A próxima aula ganhou foco

CPU e memória serão dimensionadas sem misturar problemas de probe.

---

## Erros comuns importantes

### Usar a mesma verificação nas três probes

Startup, readiness e liveness possuem responsabilidades diferentes.

### Colocar banco na liveness

Uma falha externa pode provocar restart storm.

### Usar startup window curta

A aplicação nunca termina de iniciar.

### Usar timeout de um segundo sem medir

Pequena variação gera falso positivo.

### Executar query pesada em probe

A própria verificação vira carga.

### Expor detalhes sensíveis

Health endpoint vira fonte de informação interna.

### Considerar Running como Ready

O processo pode estar vivo e fora do tráfego.

### Reiniciar por falha de readiness

Readiness não reinicia container.

### Ignorar logs previous

A causa do restart pode estar apenas no container anterior.

### Alterar duas réplicas simultaneamente

O laboratório pode perder disponibilidade total.

### Não restaurar cenário

A próxima aula começa com workload instável.

### Aprofundar requests e limits

A aula 531 possui esse objetivo.

---

## Comandos úteis

### Consultar readiness dos Pods

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  -o wide
```

### Consultar probes no Deployment

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o yaml
```

Revise a saída antes de salvá-la.

### Consultar restarts

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  -o `
  "custom-columns=NAME:.metadata.name,READY:.status.containerStatuses[0].ready,RESTARTS:.status.containerStatuses[0].restartCount"
```

### Logs anteriores

```powershell
kubectl logs `
  <pod> `
  --namespace `
  formacao-java-dev `
  --previous
```

### Rollout status

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

### Parte 1 — Baseline

Revise as três probes.

### Parte 2 — Medição

Calcule startup real.

### Parte 3 — Startup

Simule inicialização lenta.

### Parte 4 — Readiness

Retire um Pod do tráfego.

### Parte 5 — Recovery

Observe retorno ao Service.

### Parte 6 — Liveness

Provoque restart controlado.

### Parte 7 — Logs

Consulte o container anterior.

### Parte 8 — Rollout

Bloqueie uma revisão não pronta.

### Parte 9 — Policy

Proíba dependência externa em liveness.

### Parte 10 — Restore

Retorne ao cenário normal.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 529 foi preservada;
- probe foi definida;
- startup probe foi definida;
- readiness probe foi definida;
- liveness probe foi definida;
- HTTP probe foi definida;
- TCP probe foi explicada;
- exec probe foi explicada;
- gRPC probe foi explicada;
- `initialDelaySeconds` foi explicado;
- `periodSeconds` foi explicado;
- `timeoutSeconds` foi explicado;
- `failureThreshold` foi explicado;
- `successThreshold` foi explicado;
- probe window foi calculada;
- restart count foi explicado;
- previous logs foram explicados;
- context kind foi validado;
- preflight foi executado;
- Deployment foi validado;
- Service foi validado;
- EndpointSlices foram validados;
- endpoints Actuator foram consultados;
- baseline foi registrada;
- startup window foi calculada;
- policy de timing foi criada;
- script de medição foi criado;
- pelo menos cinco startups foram medidas;
- mínima foi registrada;
- mediana foi registrada;
- máxima foi registrada;
- policy de probes foi criada;
- dependência externa em startup foi proibida;
- dependência externa em liveness foi proibida;
- readiness controlada foi permitida;
- cenários de laboratório foram definidos;
- cenário normal foi definido;
- cenário slow-startup foi definido;
- cenário readiness-failure foi definido;
- cenário liveness-failure foi definido;
- configuração de cenário foi criada;
- suporte de laboratório foi isolado por profile;
- default normal foi usado;
- testes unitários do cenário foram previstos;
- baseline normal foi validada;
- slow startup foi aplicado;
- startup probe tolerou dentro da janela;
- startup failures temporárias foram observadas;
- restart não ocorreu dentro da janela;
- janela curta foi simulada;
- restart por startup foi observado;
- alteração temporária foi restaurada;
- readiness failure foi simulada;
- Pod Running foi observado;
- Ready false foi observado;
- restart count permaneceu;
- EndpointSlice foi observado;
- endpoint não pronto foi removido;
- outra réplica permaneceu pronta;
- readiness recovery foi observada;
- endpoint retornou;
- liveness failure foi simulada;
- restart count aumentou;
- logs previous foram consultados;
- events foram consultados;
- anti-pattern de banco em liveness foi documentado;
- rollout bloqueado por readiness foi simulado;
- Pods antigos foram preservados;
- rollout status terminou por timeout controlado;
- baseline foi restaurada;
- cenário normal foi reaplicado;
- dois Pods Ready foram confirmados;
- dois endpoints prontos foram confirmados;
- validator de probes foi criado;
- named port foi validada;
- thresholds foram validados;
- successThreshold foi validado;
- script de Service foi criado;
- observability contract foi criado;
- rollout policy foi criada;
- evidence foi criada;
- evidence não contém secrets;
- evidence não contém kubeconfig;
- evidence não contém logs brutos;
- startup guide foi criado;
- readiness guide foi criado;
- liveness guide foi criado;
- timing policy foi criada;
- dependency policy foi criada;
- rollout policy foi documentada;
- observability doc foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- endpoints não expõem detalhes sensíveis;
- probes não executam operação destrutiva;
- requests existentes foram preservados;
- limits existentes foram preservados;
- dimensionamento aprofundado não foi antecipado;
- HPA não foi criado;
- Ingress não foi criado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 531 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/probes `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/configuration/configmap.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/workloads/deployment.yaml `
  scripts/kubernetes/probes `
  docs/devops/kubernetes-probes `
  docs/diario-de-bordo.md
```

Adicione também o código de suporte do cenário somente se ele foi necessário e está isolado ao profile de laboratório.

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure valores sensíveis:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|token|client-key-data|secretKeyRef.*value"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): calibrar probes Kubernetes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- token;
- Secret real;
- logs brutos;
- dumps;
- evidence não sanitizada;
- cenário artificial ativo;
- ConfigMap em modo de falha;
- Deployment com janela curta;
- mudanças aprofundadas de requests e limits da aula 531.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as probes deixaram de ser apenas blocos YAML copiados.

Elas passaram a representar três decisões diferentes:

```text
startup:

a aplicação terminou
de iniciar?

readiness:

pode receber
tráfego?

liveness:

precisa ser
reiniciada?
```

Você comprovou que:

- startup protege aplicações lentas;
- readiness remove endpoints sem reiniciar;
- liveness reinicia quando o processo não progride;
- dependências externas não devem derrubar liveness;
- Service e EndpointSlice refletem readiness;
- rollout preserva Pods antigos quando a revisão nova não fica pronta;
- logs anteriores ajudam a investigar restart;
- thresholds precisam nascer de medição;
- endpoints precisam ser rápidos e seguros;
- cenários artificiais precisam ser restaurados;
- Running não significa Ready;
- restart não significa recuperação garantida.

A próxima aula será:

```text
531 - M17.26 - Requests limits
```

Nela, você irá aprofundar como CPU e memória influenciam scheduling, throttling, OOMKilled, capacidade do node e estabilidade dos Pods.

Nenhum dimensionamento aprofundado de requests e limits foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Medi a duração de startup.
- [ ] Calculei a janela da startup probe.
- [ ] Simulei startup lenta.
- [ ] Simulei readiness failure.
- [ ] Observei EndpointSlices.
- [ ] Simulei liveness failure.
- [ ] Restaurei a baseline.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O container reinicia antes de iniciar

A startup window pode estar curta.

### O Pod está Running e não Ready

Readiness está falhando ou a startup ainda não terminou.

### O Service não possui endpoints

Todos os Pods selecionados podem estar não prontos.

### A liveness falha quando o banco cai

Remova dependência externa da liveness.

### O rollout nunca termina

A nova revisão não fica Ready.

### O restart count aumenta sem logs atuais

Consulte `kubectl logs --previous`.

### A probe recebe 401 ou 403

O endpoint pode estar protegido de forma incompatível.

### A probe recebe timeout

O endpoint pode estar lento, bloqueado ou com timeout agressivo.

### A named port não é encontrada

O nome do `containerPort` diverge do campo da probe.

### O cenário de falha continua ativo

Restaure ConfigMap, Deployment e rollout.

### Todas as réplicas ficaram indisponíveis

A simulação afetou mais Pods do que o planejado.

### Requests e limits foram recalibrados

Restaure e preserve para a aula 531.

---

## Perguntas de revisão

1. O que é probe?
2. O que faz startup probe?
3. O que faz readiness probe?
4. O que faz liveness probe?
5. Readiness reinicia o container?
6. Liveness remove o endpoint antes do restart?
7. Por que usar startup probe?
8. O que faz `periodSeconds`?
9. O que faz `timeoutSeconds`?
10. O que faz `failureThreshold`?
11. O que faz `successThreshold`?
12. Como calcular a janela aproximada?
13. Por que banco não deve entrar em liveness?
14. O que ocorre no Service quando readiness falha?
15. Para que servem logs previous?
16. Como probes afetam rollout?
17. O que significa Running sem Ready?
18. Por que medir startup?
19. O que não foi aprofundado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Teste periódico do kubelet.
2. Proteger inicialização.
3. Controlar tráfego.
4. Controlar restart.
5. Não.
6. O endpoint deixa de ficar pronto conforme o estado.
7. Evitar restart prematuro.
8. Intervalo.
9. Tempo máximo.
10. Falhas necessárias.
11. Sucessos necessários.
12. Período vezes threshold.
13. Evitar restart storm.
14. Endpoint não pronto sai.
15. Investigar container anterior.
16. Bloqueiam revisão não pronta.
17. Processo ativo fora do tráfego.
18. Calibrar com dados.
19. Requests e limits.
20. Requests limits.

---

## Desafio opcional

Crie uma readiness com recuperação gradual.

Requisitos:

- `successThreshold` maior que 1;
- cenário de falha intermitente;
- medição do tempo para retornar ao Service;
- nenhuma alteração em liveness;
- duas réplicas;
- uma réplica preservada;
- evidence;
- baseline restaurada;
- nenhum ajuste de CPU ou memória.

O objetivo é compreender estabilidade antes de readmitir tráfego.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 530 - M17.25 - Probes liveness readiness startup

- Continuei após ConfigMap e Secret.
- Aprofundei startup, readiness e liveness probes.
- Diferenciei inicialização, tráfego e restart.
- Estudei probes HTTP, TCP, exec e gRPC.
- Estudei initial delay, period, timeout, failure e success thresholds.
- Calculei a janela aproximada de startup.
- Medi múltiplas inicializações do workload.
- Criei policy de timing.
- Criei cenários controlados de laboratório.
- Mantive o cenário default normal.
- Simulei startup lenta.
- Confirmei tolerância dentro da janela.
- Reduzi a janela temporariamente.
- Observei restart por startup insuficiente.
- Simulei readiness failure.
- Observei Pod Running e Ready false.
- Observei remoção do EndpointSlice.
- Observei recuperação e retorno ao Service.
- Simulei liveness failure.
- Observei restart count.
- Consultei logs previous e events.
- Documentei o anti-pattern de dependência externa em liveness.
- Simulei rollout bloqueado por readiness.
- Preservei Pods antigos disponíveis.
- Restaurei ConfigMap, Deployment e cenário normal.
- Criei validators, policies, scripts e evidence.
- Não antecipei o dimensionamento aprofundado de requests e limits.
- Próxima aula: Requests limits.
```

---

## Referência técnica curta

- Kubernetes Liveness, Readiness and Startup Probes.
- Kubernetes Pod Lifecycle.
- Kubernetes Container Probes.
- Kubernetes Deployment Rollouts.
- Kubernetes EndpointSlices.
- Spring Boot Actuator Kubernetes Probes.
- Kubernetes Events.
- Kubernetes Container Restart Policy.
- Health Check Design.
- Graceful Application Startup.

Regra final:

```text
startup, readiness e liveness representam decisões operacionais diferentes: startupProbe concede uma janela medida para a aplicação concluir a inicialização antes que liveness e readiness assumam suas funções; readinessProbe controla participação nos EndpointSlices e no tráfego do Service sem reiniciar o processo; livenessProbe deve detectar apenas estados locais irrecuperáveis e falhas consecutivas provocam restart, por isso banco, Kafka e outras dependências externas não entram indiscriminadamente em liveness; period, timeout, failureThreshold e successThreshold são calibrados com múltiplas medições, não por chute; rollouts com maxUnavailable zero preservam réplicas antigas quando a nova revisão não fica pronta, events, restart count e logs previous apoiam diagnóstico, e endpoints de health permanecem rápidos e sem detalhes sensíveis; após simular startup lenta, readiness temporária, liveness failure e rollout bloqueado, a baseline normal é restaurada com duas réplicas e dois endpoints prontos; a aula 531 aprofundará requests e limits sem confundir falhas de recursos com falhas de probe.
```
