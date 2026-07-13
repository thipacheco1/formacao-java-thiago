# 514 - M17.09 - Blue green deployment

## Apresentação da aula

Na aula 513, você separou deploy de release dentro da aplicação.

A imagem passou a conter:

```text
comportamento V1;

comportamento V2;

release flag;

kill switch;

defaults seguros;

métricas;

logs;

rollout plan;

removal plan.
```

Com a release flag desativada, o código novo pode estar implantado sem ficar disponível.

Depois, a configuração ativa o novo comportamento.

Feature flags controlam comportamento.

Nesta aula, você irá controlar topologia.

A pergunta central será:

```text
como preparar
uma versão candidata
em paralelo com a versão atual,

validá-la isoladamente

e trocar o tráfego
sem reconstruir a imagem?
```

A estratégia será:

```text
blue-green deployment.
```

Na terminologia da aula:

```text
blue:

ambiente atualmente ativo.

green:

ambiente candidato.
```

Os dois ambientes executam simultaneamente.

Um gateway recebe o tráfego do host.

Antes da promoção:

```text
gateway
-> blue.
```

Depois da promoção:

```text
gateway
-> green.
```

Se a candidata falhar:

```text
gateway
-> blue.
```

A troca de tráfego pode ser rápida.

Entretanto, blue-green não é apenas iniciar dois containers da API.

A aplicação do laboratório possui:

- banco;
- Outbox;
- Kafka;
- consumers;
- Inbox;
- workers;
- provider externo;
- schedulers;
- estado persistente.

Se blue e green executarem todos os workers ao mesmo tempo, a versão candidata começa a produzir efeitos antes da promoção HTTP.

Exemplos:

- green consome Kafka;
- green processa Inbox;
- green envia notificação;
- green publica Outbox;
- green altera estados;
- green executa recovery.

Isso deixa de ser uma validação isolada.

Por isso, a topologia desta aula separará funções.

A stack terá:

```text
gateway;

app-blue;

app-green;

app-worker;

postgres;

kafka.
```

#### `app-blue`

Executa a API atual.

Recebe tráfego quando blue está ativo.

Não executa workers assíncronos.

#### `app-green`

Executa a API candidata.

É validada por uma porta local de diagnóstico.

Não executa workers assíncronos.

#### `app-worker`

Executa consumers, publishers, dispatchers e recoveries.

Permanece na versão estável durante a troca da API.

#### `postgres`

Mantém estado compartilhado.

#### `kafka`

Mantém mensageria compartilhada.

#### `gateway`

Direciona o tráfego para blue ou green.

Essa divisão evita que duas versões do worker processem efeitos simultaneamente durante a primeira prática blue-green.

O rollout de workers exige estratégia própria.

Ele poderá acontecer depois de a API candidata estar estável e somente quando contratos, eventos e schema forem compatíveis.

A aplicação utilizava H2 em arquivo no laboratório anterior.

H2 em arquivo não é uma boa fronteira compartilhada para duas instâncias blue-green.

Nesta aula, a topologia local utilizará PostgreSQL como estado externo compartilhado.

A mudança de banco não será usada para ensinar migrations.

O schema ficará congelado.

A aula 517 tratará:

```text
deploy com migracao sem downtime.
```

Nesta aula:

```text
nenhuma alteração
de schema
será permitida.
```

Blue e green precisam ser compatíveis com o mesmo schema.

O gateway utilizará NGINX.

Arquivos de configuração:

```text
nginx.conf;

default.conf;

active-upstream.conf.
```

O arquivo:

```text
active-upstream.conf
```

definirá o upstream ativo.

Blue:

```nginx
upstream active_app {
    server app-blue:8084;
}
```

Green:

```nginx
upstream active_app {
    server app-green:8084;
}
```

O script de promoção fará:

```text
validar candidata;

escrever configuração temporária;

validar NGINX;

substituir arquivo;

recarregar gateway;

validar tráfego;

observar.
```

O rollback fará o caminho inverso.

O host acessará:

```text
gateway:

localhost:8084.
```

Para diagnóstico local:

```text
blue:

127.0.0.1:18084.

green:

127.0.0.1:18085.
```

Essas portas diretas são apenas para laboratório.

Em ambiente real, blue e green devem permanecer internos.

A estratégia também precisa proteger estado.

Ambas as APIs apontarão para o mesmo PostgreSQL.

Por isso, a candidata precisa respeitar:

- schema atual;
- contratos atuais;
- eventos atuais;
- idempotência;
- concorrência;
- locks;
- transações;
- feature flags.

A release flag da aula 513 continuará útil.

Uma sequência segura pode ser:

```text
1. subir green
   com provider V2 desativado;

2. validar health
   e smoke;

3. trocar tráfego
   para green;

4. observar;

5. ativar provider V2
   em uma etapa separada.
```

Isso reduz a quantidade de mudanças simultâneas.

A aula não implementará canary.

Depois da troca:

```text
100% do tráfego
vai para green.
```

A próxima aula será:

```text
515 - M17.10 - Canary deployment
```

Ela tratará exposição parcial.

Nesta aula não haverá:

- distribuição percentual;
- traffic weighting;
- sticky sessions;
- segmentação por usuário;
- análise estatística;
- promoção gradual;
- canary automatizado;
- Kubernetes Deployment;
- service mesh;
- ingress controller;
- pipeline CI/CD.

O foco será:

```text
dois ambientes completos;

validação isolada;

troca de tráfego;

observação;

rollback rápido.
```

Ao final, você deverá explicar:

```text
por que blue e green
precisam coexistir;

por que o estado
não pode morar
no filesystem da API;

por que workers
precisam ser isolados;

como o gateway
define o ambiente ativo;

como validar green
antes da promoção;

por que troca de tráfego
não substitui compatibilidade;

como executar rollback;

quando desligar blue;

por que migrations
precisam de expand-contract.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
512:
Release strategy fundamentos.

513:
Feature flags.

514:
Blue green deployment.

515:
Canary deployment.

516:
Rollback seguro.

517:
Deploy com migracao sem downtime.
```

A aula 513 respondeu:

```text
como separar
deploy de release
dentro da aplicação?
```

A aula 514 responderá:

```text
como separar
a versão atual
da candidata
na topologia?
```

Nesta aula:

```text
blue:
sim.

green:
sim.

gateway:
sim.

troca de tráfego:
sim.

rollback:
sim.

validação isolada:
sim.

estado externo:
sim.

PostgreSQL:
sim.

Kafka compartilhado:
sim.

worker separado:
sim.

health:
sim.

readiness:
sim.

feature flag:
reutilizada.

schema freeze:
sim.

canary:
não.

migração:
não.

CI/CD:
não.

Kubernetes:
não.
```

A regra central será:

```text
a candidata recebe
tráfego somente depois
de validar saúde,
compatibilidade
e efeitos controlados.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou revisados:

```text
compose.blue-green.yaml

deploy/nginx
├── nginx.conf
├── default.conf
├── active-upstream.conf
├── upstream-blue.conf
└── upstream-green.conf

config
├── app-blue.env.example
├── app-green.env.example
└── app-worker.env.example

scripts/blue-green
├── start-blue-green.ps1
├── validate-color.ps1
├── switch-active-color.ps1
├── rollback-blue-green.ps1
├── stop-inactive-color.ps1
└── verify-blue-green.ps1

docs/devops/blue-green
├── BLUE_GREEN_ARCHITECTURE.md
├── BLUE_GREEN_RELEASE_PLAN.md
├── BLUE_GREEN_SWITCH_RUNBOOK.md
├── BLUE_GREEN_ROLLBACK_PLAN.md
├── BLUE_GREEN_STATE_COMPATIBILITY.md
├── BLUE_GREEN_WORKER_POLICY.md
├── BLUE_GREEN_TEST_MATRIX.md
└── BLUE_GREEN_TROUBLESHOOTING.md
```

Código e configuração:

```text
pom.xml
application-container.yaml
runtime role configuration
worker conditional configuration
```

Ao final, você terá:

```text
blue ativo;

green candidato;

gateway;

PostgreSQL compartilhado;

Kafka compartilhado;

worker estável;

healthchecks independentes;

switch atômico de configuração;

reload do gateway;

rollback;

evidências.
```

Você irá:

1. confirmar a baseline;
2. revisar limitações do H2;
3. adicionar PostgreSQL;
4. externalizar datasource;
5. congelar schema;
6. separar API e worker;
7. condicionar schedulers;
8. condicionar listeners;
9. criar blue;
10. criar green;
11. criar worker;
12. criar gateway;
13. criar upstream blue;
14. criar upstream green;
15. publicar portas locais;
16. iniciar estado compartilhado;
17. iniciar blue;
18. iniciar worker;
19. iniciar gateway;
20. iniciar green;
21. validar green diretamente;
22. validar compatibilidade;
23. executar smoke sem efeito destrutivo;
24. trocar upstream;
25. validar gateway;
26. observar;
27. simular falha;
28. executar rollback;
29. validar recuperação;
30. desligar ambiente inativo;
31. criar scripts;
32. documentar;
33. executar gate;
34. commitar;
35. preparar a aula 515.

---

## Conceito essencial

### Ambiente blue

É a versão atualmente servindo tráfego.

Ela precisa permanecer disponível enquanto green é preparada.

---

### Ambiente green

É a versão candidata.

Ela recebe:

- configuração equivalente;
- secrets equivalentes;
- acesso ao mesmo estado;
- healthcheck;
- validação direta.

Ela não recebe tráfego do gateway antes da promoção.

---

### Gateway

Gateway é o ponto estável de entrada.

Nesta aula:

```text
host
-> gateway
-> ambiente ativo.
```

O cliente não precisa conhecer blue ou green.

---

### Troca de tráfego

A troca modifica o upstream do gateway.

O binário da aplicação não muda durante a troca.

A imagem green já está em execução.

---

### Warm-up

Antes da promoção, green precisa concluir:

- startup;
- conexão ao banco;
- conexão necessária;
- criação de pools;
- carregamento de classes;
- caches essenciais;
- readiness.

O primeiro usuário não deve pagar todo o custo de aquecimento.

---

### Shared state

Blue e green precisam observar o mesmo estado persistente.

O estado não pode ficar isolado em:

```text
/data-blue;

data-green.
```

se o objetivo é substituir o serviço ativo.

Caso contrário, a troca muda também o universo de dados.

---

### Schema compatibility

Ambas as versões precisam funcionar com o mesmo schema durante a coexistência.

Regras:

- green não remove coluna usada por blue;
- green não muda tipo incompatível;
- green não renomeia estrutura de forma exclusiva;
- blue continua lendo dados gravados por green;
- green continua lendo dados existentes.

---

### Worker isolation

Background workers não seguem automaticamente o tráfego HTTP.

Mesmo quando gateway aponta para blue:

```text
green pode consumir Kafka
se listeners estiverem ativos.
```

Por isso, o papel do processo precisa ser explícito.

---

### Runtime role

A aplicação receberá:

```text
APP_RUNTIME_API_ENABLED;

APP_RUNTIME_WORKERS_ENABLED.
```

Blue e green:

```text
API:
true.

workers:
false.
```

Worker:

```text
API:
false ou não publicada.

workers:
true.
```

O projeto pode manter o servidor HTTP no worker apenas para health interno.

---

### Conditional configuration

Schedulers e listeners precisam respeitar:

```text
app.runtime.workers.enabled.
```

Exemplo:

```java
@ConditionalOnProperty(
    prefix = "app.runtime.workers",
    name = "enabled",
    havingValue = "true"
)
```

A condição deve ficar em configurações ou beans de infraestrutura.

---

### API role

Controllers podem permanecer registrados.

Se o worker não publica porta, eles não ficam acessíveis externamente.

Uma evolução posterior pode separar application contexts.

Nesta aula, a fronteira operacional já reduz risco.

---

### Switch atômico

O script não deve editar o arquivo ativo linha por linha.

Fluxo:

```text
criar temporário;

validar conteúdo;

substituir;

executar nginx -t;

recarregar.
```

Se a validação falha, o upstream atual permanece.

---

### NGINX reload

Reload tenta aplicar nova configuração sem encerrar abruptamente conexões existentes.

Novas conexões usam o novo upstream.

Conexões em andamento podem terminar no worker antigo do NGINX.

---

### Rollback

Rollback blue-green troca o upstream de volta.

Ele é rápido apenas quando:

- blue continua executando;
- blue continua healthy;
- schema continua compatível;
- configuração permanece válida;
- secrets permanecem disponíveis.

---

### Decommission

Blue não deve ser removida imediatamente após a promoção.

Mantenha durante a janela de observação.

Depois:

- confirme green estável;
- confirme rollback não é necessário;
- registre decisão;
- pare blue;
- preserve imagem e evidências.

---

### Sessions

Aplicações stateful em memória complicam blue-green.

Exemplos:

- HTTP session local;
- upload temporário;
- cache não compartilhado;
- lock em memória;
- job local.

O laboratório usa API stateless no boundary HTTP.

---

### Long-running requests

A troca precisa considerar:

- requests longas;
- uploads;
- streams;
- WebSocket;
- jobs síncronos.

O NGINX reload não elimina a necessidade de drain.

Nesta aula, as requisições HTTP são curtas.

---

### Observabilidade por cor

Logs e métricas precisam identificar:

```text
release.color:

blue;

green;

worker.
```

A cor é uma tag controlada.

Não use container ID como tag.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
.\scripts\feature-flags\verify-feature-flag.ps1
```

---

### 2. Registrar versões

Defina:

```text
blue image:

formacao-java/m16-integrations:5.0.0.

green image:

formacao-java/m16-integrations:5.1.0.
```

Use as imagens reais criadas no laboratório.

Registre image ID ou digest.

---

### 3. Adicionar PostgreSQL driver

No `pom.xml`:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

Mantenha H2 para testes.

---

### 4. Externalizar datasource

No profile de blue-green:

```yaml
spring:
  datasource:
    url:
      "${DB_URL:jdbc:postgresql://postgres:5432/integrations}"

    username:
      "${DB_USERNAME:integrations}"

    password:
      "${DB_PASSWORD:}"

  jpa:
    hibernate:
      ddl-auto:
        "${JPA_DDL_AUTO:validate}"
```

`validate` impede alterações automáticas silenciosas.

---

### 5. Preparar schema inicial

Para o laboratório, use o schema já versionado do projeto.

Caso ainda não exista migration versionada, crie um script SQL baseline derivado do modelo atual e execute somente na inicialização do banco vazio.

Não adicione mudança de schema.

A aula 517 aprofundará migrations.

---

### 6. Criar runtime properties

```java
package br.com.formacao.m17.runtime;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
    prefix = "app.runtime"
)
public record RuntimeRoleProperties(
    Api api,
    Workers workers,
    String releaseColor
) {

    public record Api(
        boolean enabled
    ) {
    }

    public record Workers(
        boolean enabled
    ) {
    }
}
```

Defaults:

```yaml
app:
  runtime:
    api:
      enabled:
        true

    workers:
      enabled:
        true

    release-color:
      "standalone"
```

---

### 7. Condicionar workers

Aplique:

```java
@ConditionalOnProperty(
    prefix = "app.runtime.workers",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
```

Em configurações de:

- Outbox publisher;
- Kafka listeners;
- Inbox worker;
- dispatcher;
- stale recovery;
- replay scheduler.

Não espalhe a condição dentro de métodos.

---

### 8. Validar workers desativados

Com:

```text
APP_RUNTIME_WORKERS_ENABLED=false.
```

Confirme:

- listeners não iniciam;
- schedulers não executam;
- provider não é chamado;
- health HTTP funciona;
- API grava estado e Outbox.

---

### 9. Criar `compose.blue-green.yaml`

Estrutura:

```yaml
name: m17-blue-green

services:
  postgres:
    image: postgres:16-alpine

  kafka:
    image: apache/kafka:3.9.0

  app-worker:
    image:
      "formacao-java/m16-integrations:${WORKER_IMAGE_TAG:-5.0.0}"

  app-blue:
    image:
      "formacao-java/m16-integrations:${BLUE_IMAGE_TAG:-5.0.0}"

  app-green:
    image:
      "formacao-java/m16-integrations:${GREEN_IMAGE_TAG:-5.1.0}"

  gateway:
    image: nginx:1.27-alpine
```

Tags são didáticas e explícitas.

---

### 10. Configurar PostgreSQL

```yaml
postgres:
  image: postgres:16-alpine

  environment:
    POSTGRES_DB:
      "integrations"

    POSTGRES_USER:
      "integrations"

    POSTGRES_PASSWORD_FILE:
      "/run/secrets/postgres_password"

  secrets:
    - postgres_password

  volumes:
    - postgres_data:/var/lib/postgresql/data

  networks:
    - backend

  healthcheck:
    test:
      - CMD-SHELL
      - >
        pg_isready
        -U integrations
        -d integrations

    interval:
      10s

    timeout:
      5s

    retries:
      12

    start_period:
      20s
```

O arquivo do secret permanece fora do Git.

---

### 11. Criar configuração comum da API

Use anchors somente se a equipe compreende o YAML resultante.

Uma alternativa mais explícita é repetir os campos críticos.

Ambas as APIs recebem:

```text
DB_URL;

DB_USERNAME;

KAFKA_BOOTSTRAP_SERVERS;

secrets;

health;

network;

read_only;

tmpfs;

cap_drop;

no-new-privileges.
```

---

### 12. Configurar blue

```yaml
app-blue:
  image:
    "formacao-java/m16-integrations:${BLUE_IMAGE_TAG:-5.0.0}"

  environment:
    APP_RUNTIME_API_ENABLED:
      "true"

    APP_RUNTIME_WORKERS_ENABLED:
      "false"

    APP_RUNTIME_RELEASE_COLOR:
      "blue"

    DB_URL:
      "jdbc:postgresql://postgres:5432/integrations"

    DB_USERNAME:
      "integrations"

    KAFKA_BOOTSTRAP_SERVERS:
      "kafka:29092"

    JPA_DDL_AUTO:
      "validate"

  ports:
    - "127.0.0.1:18084:8084"
```

Preserve secrets e hardening.

---

### 13. Configurar green

Green possui a mesma estrutura.

Diferenças:

```yaml
APP_RUNTIME_RELEASE_COLOR:
  "green"

ports:
  - "127.0.0.1:18085:8084"
```

A tag aponta para a candidata.

---

### 14. Configurar worker

```yaml
app-worker:
  image:
    "formacao-java/m16-integrations:${WORKER_IMAGE_TAG:-5.0.0}"

  environment:
    APP_RUNTIME_API_ENABLED:
      "false"

    APP_RUNTIME_WORKERS_ENABLED:
      "true"

    APP_RUNTIME_RELEASE_COLOR:
      "worker"

    DB_URL:
      "jdbc:postgresql://postgres:5432/integrations"

    DB_USERNAME:
      "integrations"

    KAFKA_BOOTSTRAP_SERVERS:
      "kafka:29092"

    JPA_DDL_AUTO:
      "validate"
```

Não publique porta para o host.

Mantenha health interno.

---

### 15. Criar `nginx.conf`

Arquivo:

```text
deploy/nginx/nginx.conf
```

Conteúdo:

```nginx
user nginx;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;

    access_log /dev/stdout;
    error_log /dev/stderr warn;

    include /etc/nginx/conf.d/*.conf;
}
```

---

### 16. Criar upstream blue

Arquivo:

```text
upstream-blue.conf
```

Conteúdo:

```nginx
upstream active_app {
    server app-blue:8084;
}
```

Green:

```nginx
upstream active_app {
    server app-green:8084;
}
```

---

### 17. Criar configuração ativa

Inicialmente:

```text
active-upstream.conf
```

com conteúdo blue.

Esse arquivo é alterado apenas pelos scripts.

---

### 18. Criar `default.conf`

```nginx
server {
    listen 8080;

    location / {
        proxy_pass http://active_app;

        proxy_http_version 1.1;

        proxy_set_header Host $host;

        proxy_set_header X-Forwarded-For
            $proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto
            $scheme;

        proxy_set_header X-Request-Id
            $request_id;

        proxy_connect_timeout 3s;
        proxy_read_timeout 30s;
    }
}
```

O gateway escuta na porta interna 8080.

---

### 19. Configurar gateway

```yaml
gateway:
  image: nginx:1.27-alpine

  ports:
    - "8084:8080"

  volumes:
    - ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./deploy/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    - ./deploy/nginx/active-upstream.conf:/etc/nginx/conf.d/active-upstream.conf:ro

  networks:
    - backend

  depends_on:
    app-blue:
      condition:
        service_healthy
```

Green não bloqueia a disponibilidade do gateway.

---

### 20. Iniciar estado compartilhado

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  up `
  --detach `
  postgres `
  kafka
```

Aguarde ambos healthy.

---

### 21. Iniciar blue e worker

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  up `
  --detach `
  app-blue `
  app-worker
```

Valide health.

---

### 22. Iniciar gateway

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  up `
  --detach `
  gateway
```

Confirme:

```text
localhost:8084
-> blue.
```

---

### 23. Iniciar green

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  up `
  --detach `
  app-green
```

Aguarde healthy.

Green ainda não recebe tráfego do gateway.

---

### 24. Validar green diretamente

Use:

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:18085/livez"

Invoke-WebRequest `
  "http://127.0.0.1:18085/readyz"
```

Valide também:

- versão;
- release color;
- feature flags;
- configuração;
- schema;
- logs;
- ausência de workers.

---

### 25. Criar endpoint de versão seguro

Use Actuator `info`.

Exemplo:

```yaml
info:
  app:
    version:
      "${APP_VERSION:unknown}"

    release-color:
      "${APP_RUNTIME_RELEASE_COLOR:standalone}"
```

Não exponha secrets.

---

### 26. Executar smoke green

Use operações compatíveis.

Confirme:

- API aceita request;
- transação grava no PostgreSQL;
- Outbox é criada;
- green não publica;
- worker estável publica;
- jornada termina;
- idempotência permanece.

Isso prova a separação de papéis.

---

### 27. Validar ausência de workers green

Verifique logs e métricas.

Resultados esperados:

```text
Kafka listener:
não iniciado.

Outbox publisher:
não executa.

dispatcher:
não executa.

schedulers:
não executam.
```

---

### 28. Criar script de validação por cor

Arquivo:

```text
validate-color.ps1
```

Parâmetros:

```text
-Color blue|green;

-BaseUrl.
```

Valida:

- liveness;
- readiness;
- info;
- versão;
- cor;
- smoke;
- worker policy;
- schema;
- logs.

---

### 29. Criar script de switch

Arquivo:

```text
switch-active-color.ps1
```

Fluxo:

1. validar cor;
2. validar candidata;
3. copiar upstream para temporário;
4. substituir arquivo ativo;
5. executar `nginx -t`;
6. se falhar, restaurar;
7. executar `nginx -s reload`;
8. validar gateway;
9. registrar horário;
10. iniciar janela de observação.

---

### 30. Executar promoção green

```powershell
.\scripts\blue-green\switch-active-color.ps1 `
  -TargetColor `
  "green" `
  -Reason `
  "Release 5.1.0 validada"
```

Confirme:

```text
localhost:8084
-> green.
```

---

### 31. Validar o gateway

Chame:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/info"
```

Confirme:

```text
release-color:
green.
```

---

### 32. Observar a promoção

Durante a janela:

- health;
- readiness;
- HTTP 5xx;
- latência;
- Outbox;
- Inbox;
- retry;
- quarantine;
- Kafka lag;
- CPU;
- memória;
- logs;
- versão.

Blue permanece healthy.

---

### 33. Simular falha green

Use uma configuração temporária segura:

```text
readiness path inválido
ou
feature flag inválida
que impede startup.
```

Não altere schema.

Se green fica unhealthy:

```text
não promova.
```

Se a falha aparece após a promoção:

```text
execute rollback.
```

---

### 34. Executar rollback

```powershell
.\scripts\blue-green\rollback-blue-green.ps1 `
  -TargetColor `
  "blue" `
  -Reason `
  "Green apresentou falha"
```

Valide:

```text
gateway
-> blue.
```

---

### 35. Validar rollback

Confirme:

- blue healthy;
- gateway retorna blue;
- PostgreSQL íntegro;
- worker processando;
- Outbox sem perda;
- idempotência;
- logs;
- métricas.

---

### 36. Manter green para investigação

Não remova imediatamente.

Colete:

- logs;
- health;
- config;
- versão;
- erro;
- evidências.

Depois, pare green.

---

### 37. Parar ambiente inativo

Arquivo:

```text
stop-inactive-color.ps1
```

O script:

- descobre cor ativa;
- impede parar ativa;
- confirma janela concluída;
- para a inativa;
- não remove imagem;
- não remove volume;
- registra ação.

---

### 38. Criar script de start

Arquivo:

```text
start-blue-green.ps1
```

Responsabilidades:

1. validar imagens;
2. validar secrets;
3. validar Compose;
4. iniciar Postgres e Kafka;
5. aguardar health;
6. iniciar worker;
7. iniciar blue;
8. iniciar gateway;
9. validar blue;
10. iniciar green opcionalmente.

---

### 39. Criar script de verificação

Arquivo:

```text
verify-blue-green.ps1
```

Valida:

- todos os serviços;
- health;
- roles;
- versões;
- cores;
- upstream ativo;
- banco compartilhado;
- Kafka;
- worker único;
- smoke;
- rollback readiness.

---

### 40. Criar arquitetura

Arquivo:

```text
BLUE_GREEN_ARCHITECTURE.md
```

Diagrama:

```text
                 +----------------+
host :8084 ----> | gateway        |
                 +-------+--------+
                         |
                   active upstream
                     /        \
                    v          v
              app-blue      app-green
                 |              |
                 +------+-------+
                        |
                    PostgreSQL
                        |
                    app-worker
                        |
                       Kafka
```

A direção do worker deve ser detalhada corretamente no documento final.

---

### 41. Documentar estado

Arquivo:

```text
BLUE_GREEN_STATE_COMPATIBILITY.md
```

Inclua:

- banco compartilhado;
- schema freeze;
- contratos;
- eventos;
- cache;
- sessões;
- arquivos;
- uploads;
- locks;
- migrations;
- rollback.

---

### 42. Documentar worker policy

Arquivo:

```text
BLUE_GREEN_WORKER_POLICY.md
```

Regra:

```text
um worker estável
durante a troca da API.
```

Inclua plano posterior para promover worker.

---

### 43. Criar test matrix

Arquivo:

```text
BLUE_GREEN_TEST_MATRIX.md
```

Cenários:

- blue ativo;
- green healthy;
- green unhealthy;
- switch blue -> green;
- rollback green -> blue;
- gateway reload inválido;
- Postgres indisponível;
- Kafka indisponível;
- worker parado;
- feature flag V2 false;
- feature flag V2 true após promoção;
- long request;
- restart gateway.

---

### 44. Criar troubleshooting

Arquivo:

```text
BLUE_GREEN_TROUBLESHOOTING.md
```

Inclua:

- gateway não resolve app;
- NGINX config inválida;
- green unhealthy;
- blue unhealthy;
- H2 ainda configurado;
- Postgres sem schema;
- duas versões executam workers;
- consumer group dividido;
- gateway aponta para cor errada;
- reload falha;
- direct port ocupada;
- migration incompatível;
- rollback sem blue;
- volume removido;
- secret ausente.

---

### 45. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Renderize:

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  config
```

Execute:

```powershell
.\scripts\blue-green\verify-blue-green.ps1
```

Faça switch e rollback.

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Topologia e comportamento foram separados

Feature flag controla código; blue-green controla ambiente.

### Blue permaneceu disponível

A candidata foi preparada sem retirar a versão atual.

### Green foi validada isoladamente

Porta local permitiu health e smoke antes da promoção.

### Gateway criou um endpoint estável

Clientes não conhecem as cores.

### Estado saiu do container da API

PostgreSQL permitiu coexistência com o mesmo dado.

### Workers foram isolados

Green não produziu efeitos assíncronos antes da promoção.

### Schema ficou congelado

A aula não misturou deployment com migration.

### Switch virou operação validada

NGINX foi testado antes do reload.

### Rollback ficou rápido

Blue permaneceu healthy durante a observação.

### A próxima aula ganhou contraste

Canary irá trocar 100% por exposição parcial.

---

## Erros comuns importantes

### Duplicar containers e chamar de blue-green

Sem gateway e switch não existe estratégia completa.

### Usar bancos separados

A troca também troca os dados.

### Compartilhar H2 file entre instâncias

Locks e consistência ficam inadequados.

### Ativar workers em blue e green

A candidata produz efeitos antes da promoção.

### Derrubar blue logo após switch

Rollback rápido deixa de existir.

### Alterar schema de forma incompatível

Blue não consegue voltar.

### Validar apenas health

Erro funcional pode permanecer.

### Editar NGINX sem testar

A troca pode derrubar o gateway.

### Publicar portas diretas em produção

A topologia de controle é contornada.

### Confundir blue-green com canary

Blue-green troca todo o tráfego.

### Usar container ID em métrica

Cardinalidade e estabilidade pioram.

### Antecipar migration sem downtime

A aula 517 possui esse objetivo.

---

## Comandos úteis

### Renderizar stack

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  config
```

### Subir stack

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  up `
  -d
```

### Ver serviços

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  ps
```

### Validar NGINX

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  exec `
  gateway `
  nginx `
  -t
```

### Recarregar gateway

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  exec `
  gateway `
  nginx `
  -s `
  reload
```

---

## Exercício guiado

### Parte 1 — Estado

Externalize o banco.

### Parte 2 — Papéis

Separe API e workers.

### Parte 3 — Cores

Declare blue e green.

### Parte 4 — Gateway

Crie upstream ativo.

### Parte 5 — Validação

Teste green diretamente.

### Parte 6 — Compatibilidade

Revise schema e contratos.

### Parte 7 — Promoção

Troque para green.

### Parte 8 — Observação

Acompanhe sinais.

### Parte 9 — Rollback

Retorne para blue.

### Parte 10 — Encerramento

Pare a cor inativa.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 513 foi preservada;
- blue foi definido;
- green foi definido;
- gateway foi definido;
- troca de tráfego foi definida;
- warm-up foi explicado;
- shared state foi explicado;
- schema compatibility foi explicada;
- worker isolation foi explicada;
- long-running requests foram discutidas;
- sessões locais foram discutidas;
- baseline foi executada;
- imagens blue e green foram registradas;
- image ID ou digest foi registrado;
- PostgreSQL driver foi adicionado;
- H2 foi mantido para testes;
- datasource PostgreSQL foi configurado;
- ddl-auto validate foi usado;
- schema foi congelado;
- migration não foi antecipada;
- runtime properties foram criadas;
- API role foi criada;
- worker role foi criada;
- release color foi criada;
- workers possuem condição;
- Outbox publisher foi condicionado;
- listeners foram condicionados;
- Inbox worker foi condicionado;
- dispatcher foi condicionado;
- recovery foi condicionado;
- workers false foi validado;
- Compose blue-green foi criado;
- PostgreSQL foi declarado;
- Kafka foi declarado;
- app-worker foi declarado;
- app-blue foi declarado;
- app-green foi declarado;
- gateway foi declarado;
- PostgreSQL usa secret file;
- PostgreSQL usa volume;
- PostgreSQL possui healthcheck;
- blue usa workers false;
- green usa workers false;
- worker usa workers true;
- blue possui release color;
- green possui release color;
- worker possui release color;
- blue e green usam mesmo banco;
- blue e green usam mesmo Kafka;
- worker não possui porta pública;
- blue usa porta local 18084;
- green usa porta local 18085;
- portas diretas foram classificadas como laboratório;
- nginx.conf foi criado;
- default.conf foi criado;
- upstream blue foi criado;
- upstream green foi criado;
- active upstream foi criado;
- gateway publica 8084;
- gateway depende de blue healthy;
- green não bloqueia gateway;
- estado compartilhado foi iniciado;
- blue foi iniciado;
- worker foi iniciado;
- gateway foi iniciado;
- green foi iniciado;
- green ficou healthy;
- green foi validada diretamente;
- versão green foi validada;
- release color green foi validada;
- feature flags foram validadas;
- workers green permaneceram inativos;
- smoke green foi executado;
- transação foi gravada em PostgreSQL;
- Outbox foi criada;
- worker estável publicou;
- jornada terminou;
- idempotência foi preservada;
- script de validação por cor foi criado;
- script de switch foi criado;
- switch usa arquivo temporário;
- NGINX config foi validada;
- reload foi executado;
- gateway passou para green;
- Actuator info confirmou green;
- janela de observação foi executada;
- blue permaneceu healthy;
- falha green foi simulada;
- rollback foi executado;
- gateway voltou para blue;
- PostgreSQL permaneceu íntegro;
- worker permaneceu funcional;
- Outbox não perdeu trabalho;
- green foi mantida para investigação;
- script de parar inativa foi criado;
- cor ativa não pode ser parada;
- script de start foi criado;
- script de verify foi criado;
- arquitetura foi documentada;
- compatibilidade de estado foi documentada;
- policy de worker foi documentada;
- test matrix foi criada;
- troubleshooting foi criado;
- blue não foi removida antes da janela;
- canary não foi antecipado;
- traffic weighting não foi implementado;
- migrations não foram implementadas;
- CI/CD não foi antecipado;
- Kubernetes não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 515 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.blue-green.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/deploy/nginx `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/config/app-blue.env.example `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/config/app-green.env.example `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/config/app-worker.env.example `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/br/com/formacao/m17/runtime `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-container.yaml `
  scripts/blue-green `
  docs/devops/blue-green `
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
git commit -m "build(m17): implementar blue green deployment"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret local;
- senha do PostgreSQL;
- `.env`;
- app env local;
- banco;
- volume;
- logs;
- output de inspect;
- arquivo upstream temporário;
- configuração quebrada;
- arquivos canary da aula 515.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a release ganhou dois ambientes de aplicação.

A topologia passou a possuir:

```text
blue ativo;

green candidato;

gateway estável;

PostgreSQL compartilhado;

Kafka compartilhado;

worker isolado;

switch;

rollback.
```

Você comprovou que:

- feature flag controla comportamento;
- blue-green controla topologia;
- a candidata precisa coexistir com a versão atual;
- estado não deve morar no filesystem da API;
- schema precisa ser compatível;
- workers assíncronos não seguem o gateway HTTP;
- green precisa iniciar com workers desativados;
- validação direta acontece antes da promoção;
- NGINX precisa validar antes do reload;
- a troca envia 100% do tráfego;
- blue precisa permanecer healthy;
- rollback rápido depende de blue disponível;
- ambiente inativo só é parado depois da observação.

A próxima aula será:

```text
515 - M17.10 - Canary deployment
```

Nela, você irá substituir a troca total por uma exposição parcial e controlada da versão candidata.

Nenhum canary deployment foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Externalizei o estado.
- [ ] Separei API e workers.
- [ ] Criei blue e green.
- [ ] Configurei o gateway.
- [ ] Validei green isoladamente.
- [ ] Troquei o tráfego.
- [ ] Executei rollback.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Blue e green não iniciam juntos

Verifique schema, portas, banco e recursos.

### PostgreSQL falha no startup

Revise secret, volume e `pg_isready`.

### Green executa listeners

A condição de workers não foi aplicada a todos os beans.

### Gateway retorna 502

Upstream está indisponível ou DNS não resolve.

### `nginx -t` falha

O arquivo ativo está inválido ou duplicou o upstream.

### Green está healthy, mas smoke falha

Health não cobre toda a funcionalidade.

### Blue não lê dados de green

Existe incompatibilidade de schema ou formato.

### Rollback retorna erro

Blue pode ter sido parada ou tornou-se incompatível.

### H2 ainda aparece no runtime

O profile blue-green não recebeu `DB_URL`.

### Worker duplica processamento

Mais de uma instância ou versão foi iniciada.

### Switch não altera a cor

NGINX não recarregou ou o arquivo montado não mudou.

### Porta 18085 está ocupada

Altere apenas a porta de diagnóstico local.

---

## Perguntas de revisão

1. O que é blue?
2. O que é green?
3. O que faz o gateway?
4. Por que manter os dois ambientes?
5. Por que externalizar estado?
6. Por que H2 file não é adequado?
7. Por que schema precisa ser compatível?
8. Por que separar workers?
9. O gateway controla consumers?
10. O que é warm-up?
11. Como green é validada?
12. O que acontece no switch?
13. Blue deve ser parada imediatamente?
14. O que torna rollback rápido?
15. O que é drain?
16. Blue-green usa tráfego parcial?
17. Feature flag e blue-green são iguais?
18. Por que usar release color?
19. Quando parar a cor inativa?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Versão ativa.
2. Versão candidata.
3. Direcionar tráfego.
4. Validar e retornar.
5. Compartilhar dados.
6. Lock e isolamento.
7. Coexistência.
8. Evitar efeitos antecipados.
9. Não.
10. Preparação antes do tráfego.
11. Porta direta e smoke.
12. Upstream muda.
13. Não.
14. Blue healthy.
15. Encerrar requests em andamento.
16. Não.
17. Não.
18. Observabilidade controlada.
19. Após observação.
20. Canary deployment.

---

## Desafio opcional

Modele a promoção separada do `app-worker`.

Requisitos:

- worker-blue;
- worker-green;
- somente um ativo;
- consumer group;
- schedulers;
- claims;
- stale recovery;
- compatibilidade de eventos;
- switch operacional;
- rollback;
- nenhum processamento duplicado.

Não implemente canary de workers.

O objetivo é entender que background workloads exigem estratégia própria.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 514 - M17.09 - Blue green deployment

- Continuei após feature flags.
- Diferenciei controle de comportamento e topologia.
- Defini blue como ambiente ativo.
- Defini green como candidata.
- Criei um gateway estável.
- Externalizei o estado para PostgreSQL.
- Mantive H2 para testes.
- Congelei o schema.
- Não antecipei migrations.
- Criei runtime roles para API e workers.
- Desativei workers em blue e green.
- Mantive um worker estável separado.
- Condicionei publishers, listeners, workers e recoveries.
- Criei `compose.blue-green.yaml`.
- Declarei PostgreSQL e Kafka compartilhados.
- Declarei app-blue, app-green e app-worker.
- Configurei release colors.
- Criei NGINX e upstreams blue e green.
- Publiquei o gateway em 8084.
- Usei portas locais de diagnóstico.
- Iniciei estado compartilhado.
- Iniciei blue, worker e gateway.
- Iniciei green sem tráfego.
- Validei health, versão e cor da green.
- Executei smoke da green.
- Confirmei workers green inativos.
- Confirmei Outbox processada pelo worker estável.
- Criei script de validação por cor.
- Criei switch com validação e reload.
- Promovi green.
- Observei health, métricas, backlog e logs.
- Mantive blue healthy.
- Simulei falha green.
- Executei rollback para blue.
- Validei integridade e recuperação.
- Criei scripts de start, switch, rollback, stop e verify.
- Documentei arquitetura, estado, workers e troubleshooting.
- Não antecipei canary.
- Próxima aula: Canary deployment.
```

---

## Referência técnica curta

- Blue-Green Deployment.
- Reverse Proxy.
- NGINX Upstreams.
- Zero-Downtime Deployment.
- Shared Database Compatibility.
- Stateless Applications.
- Background Worker Deployment.
- Expand and Contract.
- Graceful Connection Draining.
- Immutable Infrastructure.

Regra final:

```text
blue-green deployment separa a versão ativa da candidata por topologia: `app-blue` e `app-green` executam APIs sem workers, `app-worker` mantém publishers, consumers, dispatchers e recoveries na versão estável, PostgreSQL e Kafka fornecem estado compartilhado e o gateway NGINX oferece um endpoint fixo; green inicia sem tráfego, usa o mesmo schema congelado, secrets e contratos, recebe health e smoke pela porta de diagnóstico e prova que grava estado e Outbox sem produzir efeitos assíncronos diretamente; o switch substitui atomicamente o upstream, valida `nginx -t`, recarrega o gateway e envia 100% do tráfego para green, enquanto blue permanece healthy durante a janela de observação; falha da candidata executa rollback para blue sem rebuild, perda de dados ou duplicação de workers; release color fornece observabilidade controlada, portas diretas permanecem apenas no laboratório e migrations, traffic weighting, canary, CI e Kubernetes ficam fora do escopo; com a troca total dominada, a aula 515 introduzirá exposição parcial por canary deployment.
```
