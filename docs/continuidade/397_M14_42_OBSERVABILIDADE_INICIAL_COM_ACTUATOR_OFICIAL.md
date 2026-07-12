# 397 - M14.42 - Observabilidade inicial com Actuator

## Apresentação da aula

Na aula 396, você transformou expectativas externas em contratos HTTP executáveis.

O fluxo ficou:

```text
fixture versionada;

consumidor;

produtor;

request acordada;

provider test;

MockMvc;

controller real;

response real;

verificação do contrato.
```

Aquela aula respondeu:

```text
o produtor continua cumprindo
o acordo utilizado por outro sistema?
```

Agora o foco muda da compatibilidade da API para a operação da aplicação em execução.

Considere a API iniciada em um ambiente.

Uma equipe de operação precisa responder perguntas como:

```text
o processo está ativo?

a aplicação considera seu estado saudável?

qual versão foi implantada?

há métricas registradas?

quanto tempo o processo está no ar?

quais métricas HTTP estão sendo produzidas?
```

Sem uma interface operacional, essas respostas podem depender de:

- acessar o servidor;
- procurar logs manualmente;
- executar comandos no processo;
- consultar banco;
- inferir estado apenas pela ausência de reclamações;
- criar endpoints improvisados.

A pergunta central desta aula será:

```text
como expor informações operacionais
padronizadas e controladas
sem misturá-las aos endpoints de negócio
e sem publicar detalhes sensíveis?
```

A solução utilizará:

```text
Spring Boot Actuator;

spring-boot-starter-actuator;

management endpoints;

health;

info;

metrics;

porta de gerenciamento;

endereço de bind;

exposição explícita;

acesso somente de leitura;

informações seguras da aplicação.
```

O Spring Boot Actuator oferece recursos voltados à operação de aplicações.

Ele disponibiliza endpoints que permitem monitorar e, em alguns casos, gerenciar componentes da aplicação.

Exemplos existentes no Actuator:

- `health`;
- `info`;
- `metrics`;
- `beans`;
- `env`;
- `configprops`;
- `mappings`;
- `loggers`;
- `scheduledtasks`;
- `flyway`;
- `caches`;
- `threaddump`;
- `heapdump`.

A existência de um endpoint não significa que ele deve ser publicado.

Alguns podem revelar:

- estrutura interna;
- properties;
- nomes de beans;
- mappings;
- configurações;
- dados de runtime;
- dumps de memória;
- capacidade de alteração.

A baseline desta aula exporá somente:

```text
health;

info;

metrics.
```

O endpoint HTTP padrão do Actuator utiliza o prefixo:

```text
/actuator.
```

No ambiente local, ele ficará em uma porta separada:

```text
aplicação:
8081.

management:
8082.
```

O servidor de gerenciamento ficará associado a:

```text
127.0.0.1.
```

Assim, no laboratório local:

```text
http://127.0.0.1:8082/actuator
```

não será publicado em todas as interfaces de rede.

Essa configuração é uma proteção local.

Ela não substitui:

- autenticação;
- autorização;
- firewall;
- network policy;
- segmentação de rede;
- configuração segura do ambiente;
- Spring Security.

Em containers, o significado de `127.0.0.1` muda porque representa o loopback do próprio container. A configuração de empacotamento será tratada nas aulas específicas. Não copie mecanicamente o bind local para todos os ambientes.

A resposta de health ficará reduzida:

```json
{
  "status": "UP"
}
```

Os detalhes e componentes internos não serão mostrados.

A próxima aula será:

```text
398 - M14.43 - Health readiness/liveness
```

Por isso, nesta aula não serão criados:

- grupos de health;
- readiness;
- liveness;
- probes;
- `ApplicationAvailability`;
- indicadores customizados;
- regras de dependência para probes;
- configuração Kubernetes.

O endpoint `info` mostrará apenas dados não sensíveis da aplicação:

```text
nome;

descrição;

versão declarada;

módulo atual.
```

O endpoint `metrics` permitirá descobrir as métricas registradas e consultar algumas medições iniciais.

Exemplos:

```text
process.uptime;

jvm.memory.used;

system.cpu.usage;

http.server.requests.
```

A disponibilidade exata de uma métrica depende dos componentes ativos e de eventos já ocorridos.

Por exemplo:

```text
http.server.requests
```

pode aparecer somente depois que requests HTTP forem processadas.

Esta aula não adicionará:

- Prometheus;
- Grafana;
- OpenTelemetry;
- tracing;
- exportador OTLP;
- dashboard;
- alerta;
- métrica de negócio customizada;
- `ObservationRegistry` customizado;
- tracing distribuído;
- correlação entre serviços.

A definição de observabilidade será introduzida, mas a implementação permanecerá no primeiro nível operacional.

O projeto continua em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
393:
Testes de controller com MockMvc.

394:
Testes de service em Spring.

395:
Testes de integração Spring com Testcontainers.

396:
Testes de contrato introdução.

397:
Observabilidade inicial com Actuator.

398:
Health readiness/liveness.

399:
Dockerizando API Spring.
```

A aula 396 respondeu:

```text
a fronteira HTTP continua compatível
com o acordo do consumidor?
```

A aula 397 responderá:

```text
como observar informações operacionais
básicas da aplicação em execução?
```

Nesta aula:

```text
Actuator:
sim.

health:
sim.

info:
sim.

metrics:
sim.

porta de management:
sim.

bind local:
sim.

exposição explícita:
sim.

somente leitura:
sim.

detalhes de health:
não.

readiness:
não.

liveness:
não.

Prometheus:
não.

Grafana:
não.

tracing:
não.

métrica customizada:
não.

Spring Security:
não.
```

A regra central será:

```text
endpoint operacional
não é endpoint de negócio;

deve possuir exposição mínima,
informação controlada
e proteção compatível com o ambiente.
```

---

## Objetivo prático

Ao final da aula, a aplicação deverá oferecer no profile local:

```text
GET http://127.0.0.1:8082/actuator

GET http://127.0.0.1:8082/actuator/health

GET http://127.0.0.1:8082/actuator/info

GET http://127.0.0.1:8082/actuator/metrics

GET http://127.0.0.1:8082/actuator/metrics/{metricName}
```

A aplicação de negócio continuará em:

```text
http://localhost:8081.
```

Você irá:

1. adicionar o starter do Actuator;
2. configurar uma porta de gerenciamento local;
3. limitar o bind ao loopback;
4. manter o base path `/actuator`;
5. expor somente `health`, `info` e `metrics`;
6. limitar endpoints a operações de leitura;
7. ocultar detalhes do health;
8. configurar informações públicas da aplicação;
9. consultar o catálogo de métricas;
10. gerar tráfego e consultar métricas HTTP;
11. comprovar que endpoints sensíveis não estão expostos;
12. commitar.

Configuração esperada:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
└── application-observability-local.yaml
```

Não será necessário criar controller.

Os endpoints serão auto-configurados pelo Spring Boot Actuator.

---

## Conceito essencial

### O que é observabilidade

Observabilidade é a capacidade de compreender o estado interno de um sistema a partir dos sinais que ele produz.

Os três pilares tradicionalmente associados são:

```text
logs;

métricas;

traces.
```

Logs registram eventos.

Métricas representam medições agregáveis ao longo do tempo.

Traces acompanham uma operação entre componentes e serviços.

O projeto já trabalhou logging em aulas anteriores.

Nesta aula, o Actuator introduzirá endpoints operacionais e acesso inicial a métricas.

Tracing não será implementado.

---

### Monitoramento e observabilidade

Monitoramento costuma responder perguntas conhecidas:

```text
o processo está UP?

a taxa de erro passou do limite?

a CPU está alta?

o tempo de resposta aumentou?
```

Observabilidade também ajuda a investigar perguntas que não foram previstas exatamente no momento do desenvolvimento.

Actuator não entrega uma plataforma de observabilidade completa.

Ele fornece uma base para:

- estado de health;
- informações da aplicação;
- métricas;
- endpoints operacionais;
- integração com ferramentas externas.

---

### O que é Actuator

Actuator é o conjunto de recursos production-ready do Spring Boot.

A forma recomendada de habilitá-lo é adicionar:

```text
spring-boot-starter-actuator.
```

Depois disso, a auto-configuração detecta componentes disponíveis e registra endpoints correspondentes.

Exemplo:

```text
DataSource presente:
health contributor de banco pode existir.

Flyway presente:
endpoint flyway pode existir.

CacheManager presente:
endpoint caches pode existir.

MeterRegistry presente:
metrics podem existir.
```

Existir no contexto e estar exposto por HTTP são decisões diferentes.

---

### Disponível não significa exposto

Um endpoint pode estar disponível internamente, mas não publicado por HTTP.

A exposição web é controlada por:

```text
management.endpoints.web.exposure.include;

management.endpoints.web.exposure.exclude.
```

Por padrão, somente `health` é exposto por HTTP e JMX no Spring Boot atual.

A baseline será explícita:

```yaml
management:
  endpoints:
    web:
      exposure:
        include:
          - "health"
          - "info"
          - "metrics"
```

Não use:

```yaml
include: "*"
```

sem uma análise de segurança.

---

### Exclude possui precedência

Quando `include` e `exclude` existem:

```text
exclude vence.
```

Exemplo conceitual:

```yaml
include: "*"
exclude:
  - "env"
  - "beans"
```

Ainda assim, a baseline preferirá uma allowlist pequena.

Allowlist:

```text
publicar somente o que foi aprovado.
```

Blocklist:

```text
publicar tudo,
exceto alguns itens lembrados.
```

Para endpoints operacionais, a allowlist é mais segura.

---

### Base path

O prefixo padrão é:

```text
/actuator.
```

Exemplos:

```text
/actuator/health;

/actuator/info;

/actuator/metrics.
```

É possível alterar:

```text
management.endpoints.web.base-path.
```

A baseline manterá o padrão de forma explícita.

Não use um path obscuro como mecanismo de segurança.

Trocar `/actuator` por `/interno-secreto-123` não substitui controle de acesso.

---

### Porta separada

Quando `management.server.port` é diferente de `server.port`, o Spring Boot cria um servidor de gerenciamento separado.

Baseline local:

```yaml
server:
  port: 8081

management:
  server:
    port: 8082
```

Benefícios:

- separar tráfego de negócio e operacional;
- aplicar regras de rede diferentes;
- evitar que filters de negócio controlem management;
- facilitar bind em interface específica;
- deixar a responsabilidade explícita.

Custo:

- mais uma porta;
- mais configuração;
- health da porta de management não prova sozinho que a porta principal está alcançável;
- operação precisa rotear corretamente.

A aula 398 aprofundará health e probes.

---

### Endereço de bind

Com porta separada, é possível configurar:

```yaml
management:
  server:
    address: "127.0.0.1"
```

Isso limita o listener local à interface de loopback.

No laboratório:

```text
acesso na mesma máquina:
sim.

acesso direto pela rede:
não esperado.
```

A proteção depende do sistema operacional e da topologia.

Em production, use o endereço apropriado à rede operacional, acompanhado de controles reais.

---

### Acesso somente de leitura

O Spring Boot atual permite limitar o máximo de acesso dos endpoints:

```yaml
management:
  endpoints:
    access:
      max-permitted: "read-only"
```

Isso impede que endpoints com operações de escrita sejam utilizados acima do nível permitido.

A baseline expõe somente endpoints de leitura e também limita o máximo global.

Defesa em profundidade:

```text
allowlist de exposição;

máximo read-only;

bind local.
```

---

### Endpoint health

URL:

```text
/actuator/health.
```

Ele agrega contribuições de health disponíveis na aplicação.

Exemplos possíveis:

- banco;
- Redis;
- disco;
- ping;
- outros componentes.

A resposta pública da baseline será:

```json
{
  "status": "UP"
}
```

Configuração:

```yaml
management:
  endpoint:
    health:
      show-details: "never"
      show-components: "never"
```

A aplicação pode avaliar dependências internamente sem expor os detalhes.

---

### Status HTTP do health

Estados como:

```text
DOWN;

OUT_OF_SERVICE
```

são normalmente associados a HTTP `503`.

Estado:

```text
UP
```

resulta em HTTP `200`.

Nesta aula, você observará apenas o comportamento básico.

Mapeamentos customizados e grupos não serão criados.

---

### Health não é diagnóstico completo

`UP` não significa:

- todos os casos de uso funcionam;
- toda integração externa está perfeita;
- nenhuma fila está atrasada;
- nenhum cliente está recebendo erro;
- latência está aceitável;
- disco nunca ficará cheio;
- serviço está pronto para receber tráfego em qualquer fase.

Health é um sinal.

Ele precisa ser interpretado conforme a política operacional.

A aula 398 separará readiness e liveness.

---

### Endpoint info

URL:

```text
/actuator/info.
```

Ele reúne dados fornecidos por `InfoContributor`.

A baseline habilitará o contributor de environment:

```yaml
management:
  info:
    env:
      enabled: true
```

Depois definirá apenas propriedades seguras:

```yaml
info:
  app:
    name: "formacao-java-backend-api"
    description: "API de laboratorio da formacao Java Backend"
    version: "${APP_VERSION:dev}"
    module: "M14"
```

Não coloque em `info.*`:

- senha;
- token;
- URL privada;
- usuário de banco;
- segredo SMTP;
- chave de API;
- path sensível;
- dados pessoais.

O endpoint `info` é público somente porque a informação foi selecionada.

---

### Build info

O Actuator pode expor dados de build quando existe:

```text
META-INF/build-info.properties.
```

O Maven plugin do Spring Boot pode gerar esse arquivo.

Essa evolução será citada, mas não será obrigatória na baseline.

Nesta aula, uma versão externalizada é suficiente para compreender o endpoint.

Não invente a versão a partir de runtime de forma inconsistente.

---

### Endpoint metrics

URL de catálogo:

```text
/actuator/metrics.
```

Ele lista nomes de métricas registradas.

Exemplo conceitual:

```json
{
  "names": [
    "application.ready.time",
    "application.started.time",
    "http.server.requests",
    "jvm.memory.used",
    "process.uptime"
  ]
}
```

Para consultar uma métrica:

```text
/actuator/metrics/process.uptime.
```

A response contém medições e tags disponíveis.

---

### Métrica não é log

Log:

```text
request X retornou 500.
```

Métrica:

```text
quantidade de requests 500;
taxa ao longo do tempo;
tempo acumulado;
máximo observado.
```

Métricas são adequadas para:

- agregação;
- gráficos;
- alertas;
- tendência;
- comparação.

Elas não substituem o contexto detalhado de um log.

---

### Métricas HTTP

Depois de requests, consulte:

```text
http.server.requests.
```

Ela pode apresentar medições como:

- count;
- total time;
- max.

Tags podem incluir:

- method;
- status;
- outcome;
- uri;
- error.

Não use valores de alta cardinalidade como tag.

Exemplo ruim:

```text
userId;
orderId;
correlationId.
```

Cada valor distinto cria novas séries.

Nesta aula, você apenas consumirá métricas automáticas.

Não criará tags customizadas.

---

### Métricas JVM e processo

Exemplos comuns:

```text
jvm.memory.used;

jvm.threads.live;

process.uptime;

process.cpu.usage;

system.cpu.usage.
```

Nem todos os nomes precisam existir em toda plataforma ou configuração.

O catálogo do endpoint é a fonte da instância em execução.

Não escreva um script que presume todas sem verificar.

---

### Actuator e filters de negócio

O rate limiting da aula 389 protege:

```text
/api/v1/runtime/managed-messages;

/api/v2/runtime/managed-messages.
```

Actuator usa:

```text
/actuator.
```

E estará em outra porta.

Não aplique cota de cliente aos endpoints operacionais sem decisão explícita.

Tráfego de monitoramento possui política diferente de tráfego de negócio.

---

### Actuator e segurança

A aplicação ainda não estudou Spring Security.

Por isso, a baseline local utiliza:

- porta separada;
- bind no loopback;
- allowlist;
- read-only;
- health sem detalhes;
- info controlado.

Em ambiente acessível por rede, é necessário aplicar proteção compatível.

A própria documentação do Spring Boot recomenda cuidado porque endpoints podem conter informação sensível.

Não exponha `*` publicamente apenas porque “é Actuator”.

---

### Endpoints que não serão expostos

`env`:

```text
pode revelar configuração e nomes de properties.
```

`configprops`:

```text
expõe propriedades agrupadas.
```

`beans`:

```text
revela estrutura interna.
```

`mappings`:

```text
revela superfície completa de endpoints.
```

`loggers`:

```text
pode permitir alteração de níveis.
```

`heapdump`:

```text
pode conter dados sensíveis em memória.
```

`threaddump`:

```text
expõe detalhes operacionais.
```

`shutdown`:

```text
possui efeito destrutivo.
```

Mesmo quando sanitização existe, a baseline não precisa desses endpoints.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean compile
```

Confirme que a aplicação inicia antes da alteração.

---

### 2. Adicionar Actuator

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Não fixe versão.

O Spring Boot gerencia as dependências compatíveis.

Compile:

```powershell
.\mvnw.cmd clean compile
```

---

### 3. Criar profile fragment local

Arquivo:

```text
src/main/resources/application-observability-local.yaml
```

Conteúdo:

```yaml
management:
  server:
    port: "${MANAGEMENT_PORT:8082}"
    address: "${MANAGEMENT_ADDRESS:127.0.0.1}"

  endpoints:
    access:
      max-permitted: "read-only"

    web:
      base-path: "/actuator"

      exposure:
        include:
          - "health"
          - "info"
          - "metrics"

  endpoint:
    health:
      show-details: "never"
      show-components: "never"

  info:
    env:
      enabled: true

info:
  app:
    name: "formacao-java-backend-api"
    description: "API de laboratorio da formacao Java Backend"
    version: "${APP_VERSION:dev}"
    module: "M14"
```

A versão default `dev` é adequada ao laboratório local.

Em build ou deploy, use `APP_VERSION`.

---

### 4. Ativar o fragment no profile local

No group local:

```yaml
spring:
  profiles:
    group:
      local:
        - persistence-lab
        - openapi-lab
        - lifecycle-local
        - cache-redis
        - mail-lab
        - observability-local
```

Preserve os fragments já existentes.

A ordem deve evitar duplicações contraditórias.

---

### 5. Revisar configuração segura

Confirme:

```text
management port:
8082.

management address:
127.0.0.1.

base path:
/actuator.

include:
health, info, metrics.

max permitted:
read-only.

health details:
never.
```

Não adicione:

```yaml
include: "*"
```

Não ative:

```text
shutdown;
env;
configprops;
beans;
heapdump;
loggers.
```

---

### 6. Iniciar dependências locais

Conforme os profiles ativos, garanta os componentes necessários:

```text
PostgreSQL;

Redis;

Mailpit.
```

A indisponibilidade de uma dependência pode influenciar o health agregado.

A aula não alterará a política de health para esconder dependências.

---

### 7. Iniciar a aplicação

```powershell
$env:APP_VERSION = "397-local"

.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Confirme nos logs:

```text
aplicação:
porta 8081.

management:
porta 8082.
```

Depois do laboratório:

```powershell
Remove-Item Env:APP_VERSION
```

---

### 8. Consultar links do Actuator

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator"
```

Resultado esperado contém links para:

```text
self;

health;

info;

metrics.
```

Não deve listar:

```text
env;

beans;

loggers;

shutdown;

heapdump.
```

A representação de links pode utilizar formato HAL-like.

Valide os nomes, não a ordem.

---

### 9. Consultar health

```powershell
$health = Invoke-WebRequest `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/health"

$health.StatusCode
$health.Content
```

Resultado esperado quando dependências estão saudáveis:

```text
200;
{"status":"UP"}.
```

Não devem aparecer:

- URL do banco;
- nome de database;
- versão do Redis;
- espaço em disco;
- componentes;
- detalhes.

---

### 10. Testar health com dependência indisponível

Pare temporariamente o Redis local:

```powershell
docker stop formacao-java-redis
```

Aguarde alguns segundos e consulte health novamente.

Dependendo dos health contributors ativos e da configuração da aplicação, o status agregado pode mudar para:

```text
DOWN;
503.
```

Reinicie:

```powershell
docker start formacao-java-redis
```

Não altere health para sempre retornar `UP`.

Se uma dependência considerada essencial está indisponível, o sinal precisa refletir a política real.

Nesta aula, apenas observe.

A decisão de readiness será aprofundada na próxima aula.

---

### 11. Consultar info

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/info"
```

Resultado esperado:

```json
{
  "app": {
    "name": "formacao-java-backend-api",
    "description": "API de laboratorio da formacao Java Backend",
    "version": "397-local",
    "module": "M14"
  }
}
```

Confirme ausência de:

- credentials;
- host do banco;
- senha;
- token;
- destinatário de e-mail;
- paths locais.

---

### 12. Consultar catálogo de métricas

```powershell
$metrics = Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/metrics"

$metrics.names |
  Sort-Object
```

Procure:

```text
process.uptime;

jvm.memory.used.
```

Os nomes podem variar conforme plataforma e dependências.

---

### 13. Consultar uptime

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/metrics/process.uptime"
```

Observe:

```text
name;

description;

baseUnit;

measurements;

availableTags.
```

A measurement contém valor numérico.

---

### 14. Consultar memória JVM

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/metrics/jvm.memory.used"
```

Observe tags disponíveis.

Podem existir dimensões como:

```text
area;

id.
```

Não tente somar valores sem entender as tags e unidades.

---

### 15. Gerar tráfego de negócio

Execute algumas requests:

```powershell
1..5 | ForEach-Object {

    Invoke-WebRequest `
      -Method Get `
      -Uri "http://localhost:8081/api/v2/runtime/managed-messages" `
      -Headers @{
        "X-Client-Id" =
          "actuator-aula-397"
      } `
      -SkipHttpErrorCheck |
      Out-Null
}
```

Ajuste a rota conforme o contrato real da listagem.

Gere também uma request inválida controlada para produzir status diferente.

Não use carga agressiva.

---

### 16. Consultar métrica HTTP

Primeiro confirme que existe:

```powershell
$metrics = Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/metrics"

$metrics.names -contains `
  "http.server.requests"
```

Depois:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/metrics/http.server.requests"
```

Observe:

```text
COUNT;

TOTAL_TIME;

MAX;

availableTags.
```

Os nomes das statistics podem aparecer no campo `statistic`.

---

### 17. Filtrar por tag

Leia `availableTags` da response.

Quando a tag `status` existir:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/metrics/http.server.requests?tag=status:200"
```

Se não houver request 200 registrada, a combinação pode retornar sem measurements úteis ou erro de métrica não encontrada para aquela combinação.

Use uma tag realmente listada na instância.

---

### 18. Comprovar endpoint não exposto

Teste:

```powershell
$envResponse = Invoke-WebRequest `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/env" `
  -SkipHttpErrorCheck

$envResponse.StatusCode
```

Resultado esperado:

```text
404.
```

Repita para:

```text
/actuator/beans;

/actuator/loggers;

/actuator/shutdown.
```

Não é suficiente não usar os endpoints.

Eles não devem estar expostos.

---

### 19. Comprovar separação de portas

Na porta da aplicação:

```powershell
$appActuator = Invoke-WebRequest `
  -Method Get `
  -Uri "http://localhost:8081/actuator/health" `
  -SkipHttpErrorCheck

$appActuator.StatusCode
```

Resultado esperado com management port separado:

```text
404.
```

Na porta de management:

```text
200 ou 503,
conforme health.
```

---

### 20. Testar bind local

Descubra o IP da máquina e tente, somente na rede local controlada:

```text
http://<ip-da-maquina>:8082/actuator/health
```

Com bind em `127.0.0.1`, a conexão não deve ser aceita por essa interface.

Não altere firewall corporativo nem exponha a porta para realizar o teste.

A validação pelo listener local é suficiente quando o ambiente não permite teste de rede.

---

### 21. Testar versão externalizada

Pare a aplicação.

Defina:

```powershell
$env:APP_VERSION = "397.1.0-lab"
```

Inicie novamente.

Consulte `info`.

Resultado esperado:

```text
version:
397.1.0-lab.
```

Restaure:

```powershell
Remove-Item Env:APP_VERSION
```

A versão não precisa ser recompilada para o laboratório.

---

### 22. Inspecionar logs de startup

Procure mensagens relacionadas a:

```text
exposed endpoints;

management port;

application started.
```

Não dependa de um texto exato de log como contrato.

Use as requests HTTP como comprovação principal.

---

### 23. Revisar ausência de dados sensíveis

Salve temporariamente as responses:

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/info" |
  ConvertTo-Json `
    -Depth 10

Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/health" |
  ConvertTo-Json `
    -Depth 10
```

Faça revisão manual.

Pergunta:

```text
eu publicaria esta informação
para qualquer processo
com acesso à rede operacional?
```

Se a resposta for não, remova o dado ou proteja o endpoint.

---

### 24. Não criar endpoint customizado

Nesta aula, não crie:

```java
@Endpoint;
@ReadOperation;
InfoContributor customizado;
HealthIndicator customizado.
```

Os endpoints existentes são suficientes para aprender a baseline.

Customização deve responder uma necessidade real.

---

## Entendendo o que foi feito

### A aplicação ganhou uma interface operacional

Não foi necessário criar controllers próprios.

### Tráfego operacional ficou separado

A porta 8082 não é a porta de negócio.

### A exposição ficou explícita

Somente três endpoints foram publicados.

### O acesso ficou limitado

A baseline permite somente leitura.

### Health ficou reduzido

O cliente recebe status sem detalhes de infraestrutura.

### Info ficou controlado

Somente dados aprovados da aplicação aparecem.

### Metrics apresentou sinais do runtime

JVM, processo e HTTP passaram a ser consultáveis.

### A segurança permaneceu honesta

Loopback e allowlist ajudam no laboratório, mas não substituem autenticação e rede segura.

---

## Erros comuns importantes

### Expor todos os endpoints

`include: "*"` amplia a superfície sem necessidade.

### Acreditar que sanitização resolve tudo

Nomes de properties e estrutura interna também podem ser sensíveis.

### Colocar segredo em info.*

O endpoint publicará o valor quando o contributor estiver ativo.

### Usar path obscuro como segurança

Descobrir um path não deve conceder acesso.

### Misturar Actuator com API de negócio

Endpoints operacionais possuem público e política diferentes.

### Expor management em todas as interfaces localmente

A porta pode ficar acessível na rede sem intenção.

### Mostrar health details sempre

Componentes e dependências podem revelar arquitetura.

### Tratar UP como prova completa

Health é um sinal limitado.

### Criar métrica customizada sem entender cardinalidade

Tags dinâmicas podem gerar milhares de séries.

### Antecipar readiness e liveness

A próxima aula existe para separar corretamente esses conceitos.

---

## Comandos úteis

### Iniciar com profile local

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

### Links

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator"
```

### Health

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

### Info

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/info"
```

### Metrics

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/metrics"
```

### Uptime

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/metrics/process.uptime"
```

### Métricas HTTP

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/metrics/http.server.requests"
```

---

## Exercício guiado

### Parte 1 — Exposição mínima

Confirme links somente para:

```text
health;
info;
metrics.
```

### Parte 2 — Health reduzido

Confirme que detalhes não aparecem.

### Parte 3 — Info externalizado

Altere `APP_VERSION` e valide.

### Parte 4 — Métricas de processo

Consulte uptime e memória JVM.

### Parte 5 — Métricas HTTP

Gere tráfego e observe count, total time e max.

### Parte 6 — Endpoint bloqueado

Confirme 404 para `env`, `beans` e `shutdown`.

### Parte 7 — Portas separadas

Confirme Actuator somente em 8082.

### Parte 8 — Registrar decisão

Anote:

```text
spring-boot-starter-actuator;

management port 8082;

bind 127.0.0.1 no local;

base path /actuator;

allowlist health, info e metrics;

max access read-only;

health sem detalhes;

info env habilitado;

somente dados não sensíveis;

APP_VERSION externalizada;

sem env;

sem beans;

sem loggers;

sem shutdown;

sem readiness;

sem liveness;

sem Prometheus;

sem tracing.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 396 foi preservada;
- starter Actuator foi adicionado;
- versão da dependency não foi fixada;
- Actuator foi diferenciado de controller de negócio;
- observabilidade foi definida;
- logs, métricas e traces foram diferenciados;
- tracing não foi implementado;
- porta de aplicação permaneceu 8081;
- porta de management foi configurada em 8082;
- management address foi configurado;
- bind local usa 127.0.0.1;
- base path `/actuator` foi mantido;
- exposição web foi explícita;
- health foi incluído;
- info foi incluído;
- metrics foi incluído;
- wildcard não foi usado;
- max permitted foi definido como read-only;
- detalhes de health foram ocultados;
- componentes de health foram ocultados;
- `management.info.env.enabled` foi configurado;
- `info.app.name` foi criado;
- descrição segura foi criada;
- versão foi externalizada;
- módulo foi informado;
- segredo não foi colocado em info;
- links do Actuator foram consultados;
- health foi consultado;
- status HTTP foi observado;
- dependência indisponível foi experimentada;
- info foi consultado;
- ausência de credentials foi revisada;
- catálogo de métricas foi consultado;
- uptime foi consultado;
- memória JVM foi consultada;
- tráfego HTTP foi gerado;
- `http.server.requests` foi consultada;
- available tags foram observadas;
- filtro por tag foi experimentado;
- endpoint env retorna 404;
- endpoint beans retorna 404;
- endpoint loggers retorna 404;
- endpoint shutdown retorna 404;
- Actuator não está na porta 8081;
- Actuator está na porta 8082;
- bind local foi revisado;
- APP_VERSION foi alterada por ambiente;
- endpoints customizados não foram criados;
- HealthIndicator customizado não foi criado;
- readiness não foi antecipada;
- liveness não foi antecipada;
- probes não foram antecipadas;
- Prometheus não foi antecipado;
- Grafana não foi antecipado;
- tracing não foi antecipado;
- métrica customizada não foi antecipada;
- Spring Security não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 398 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m14): adicionar observabilidade inicial com Actuator"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- responses salvas;
- logs;
- dumps;
- credentials;
- tokens;
- dados operacionais reais;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação ganhou uma interface operacional inicial.

O fluxo ficou:

```text
Spring Boot Actuator;

management server;

porta 8082;

loopback;

allowlist;

health;

info;

metrics.
```

Você comprovou:

```text
health básico;

info controlado;

catálogo de métricas;

uptime;

memória JVM;

métricas HTTP;

endpoints sensíveis não expostos;

separação entre porta de negócio
e porta operacional.
```

A decisão central foi:

```text
observabilidade começa
com sinais operacionais úteis;

exposição precisa ser mínima;

informação precisa ser selecionada;

endpoint operacional
não deve vazar detalhes
nem ser tratado como API pública de negócio.
```

A próxima aula será:

```text
398 - M14.43 - Health readiness/liveness
```

Nela, você aprofundará o significado de health e separará:

```text
liveness:
o processo deve ser reiniciado?

readiness:
a instância pode receber tráfego?
```

Também serão estudados:

- `ApplicationAvailability`;
- indicadores de liveness;
- indicadores de readiness;
- grupos de health;
- paths de probes;
- dependências que devem ou não participar.

Esses recursos não foram implementados nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei o starter Actuator.
- [ ] Separei a porta de gerenciamento.
- [ ] Expus somente health, info e metrics.
- [ ] Ocultei detalhes e dados sensíveis.
- [ ] Consultei métricas de processo e HTTP.

---

## Troubleshooting adicional

### A porta 8082 não inicia

Confirme:

- porta livre;
- profile `observability-local`;
- YAML válido;
- nenhuma variável `MANAGEMENT_PORT` conflitante.

### /actuator/info retorna {}

Confirme:

```text
management.info.env.enabled=true;
properties info.app.*;
profile correto.
```

### /actuator/metrics retorna 404

Confirme:

```text
starter actuator;
metrics incluído na exposure;
management port correta.
```

### http.server.requests não aparece

Gere requests HTTP depois do startup.

Confirme que a aplicação web processou tráfego.

### Health mostra detalhes

Revise:

```text
show-details;
show-components;
profile que sobrescreve as properties.
```

### /actuator/env está acessível

Procure outro fragment com:

```text
include: "*".
```

A última property efetiva pode estar ampliando a exposição.

### Management responde pelo IP da rede

Confirme:

```text
management.server.address=127.0.0.1;
management.server.port diferente do server.port.
```

### Health fica DOWN após parar Redis

Isso pode ser esperado se Redis participa do health agregado.

Reinicie a dependência.

A próxima aula tratará a composição de probes.

---

## Observações para aulas futuras

Uma plataforma de observabilidade pode incluir:

- Prometheus;
- Grafana;
- OpenTelemetry;
- OTLP;
- tracing distribuído;
- logs centralizados;
- alertas;
- SLI;
- SLO;
- error budget;
- dashboards;
- métricas de negócio;
- exemplars.

Actuator fornece a base de integração, não toda a plataforma.

A exposição em production deve considerar:

- autenticação;
- autorização;
- rede;
- TLS;
- segredo;
- retenção;
- custo;
- cardinalidade;
- compliance.

A próxima aula permanece focada em health, readiness e liveness.

---

## Perguntas de revisão

1. O que é observabilidade?
2. Quais são os três pilares?
3. O que Actuator oferece?
4. Qual starter foi adicionado?
5. Qual é a porta da aplicação?
6. Qual é a porta de management?
7. Qual endereço local foi usado?
8. Qual é o base path?
9. Quais endpoints foram expostos?
10. Por que não usar wildcard?
11. Qual é o acesso máximo?
12. Health mostra detalhes?
13. O que info publica?
14. Segredos podem entrar em info?
15. O que metrics lista?
16. Quando http.server.requests aparece?
17. Env foi exposto?
18. Actuator substitui segurança?
19. Readiness foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Capacidade de observar estado interno por sinais externos.
2. Logs, métricas e traces.
3. Endpoints e integrações operacionais.
4. `spring-boot-starter-actuator`.
5. 8081.
6. 8082.
7. 127.0.0.1.
8. `/actuator`.
9. Health, info e metrics.
10. Para evitar exposição excessiva.
11. Read-only.
12. Não.
13. Dados seguros selecionados.
14. Não.
15. Nomes de métricas registradas.
16. Depois de tráfego HTTP.
17. Não.
18. Não.
19. Não.
20. Health readiness/liveness.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 397 - M14.42 - Observabilidade inicial com Actuator

- Continuei no projeto `formacao-java-backend-api`.
- Defini observabilidade como capacidade de compreender o sistema por sinais externos.
- Diferenciei logs, métricas e traces.
- Adicionei `spring-boot-starter-actuator`.
- Não fixei versão da dependency.
- Mantive a API de negócio na porta 8081.
- Criei management server na porta 8082.
- Limitei o bind local a `127.0.0.1`.
- Mantive o base path `/actuator`.
- Usei allowlist de endpoints.
- Expus somente `health`, `info` e `metrics`.
- Não usei wildcard.
- Limitei acesso máximo a `read-only`.
- Ocultei detalhes do health.
- Ocultei componentes do health.
- Habilitei o contributor env do info.
- Publiquei somente nome, descrição, versão e módulo.
- Externalizei `APP_VERSION`.
- Não publiquei credentials ou configuração interna.
- Consultei os links do Actuator.
- Consultei health e seu status HTTP.
- Observei impacto de dependência indisponível.
- Consultei info.
- Consultei o catálogo de métricas.
- Consultei uptime e memória JVM.
- Gerei tráfego HTTP.
- Consultei `http.server.requests`.
- Observei measurements e available tags.
- Confirmei 404 para env, beans, loggers e shutdown.
- Confirmei a separação das portas.
- Não criei endpoints ou indicators customizados.
- Não antecipei readiness, liveness, Prometheus ou tracing.
- Próxima aula: Health readiness/liveness.
```

---

## Referência técnica curta

- [Spring Boot — Production-ready Features](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Spring Boot — Enabling Actuator](https://docs.spring.io/spring-boot/reference/actuator/enabling.html)
- [Spring Boot — Actuator Endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)
- [Spring Boot — Monitoring over HTTP](https://docs.spring.io/spring-boot/reference/actuator/monitoring.html)
- [Spring Boot — Observability](https://docs.spring.io/spring-boot/reference/actuator/observability.html)

Regra final:

```text
uma interface operacional precisa expor somente sinais necessários, separar tráfego de negócio e gerenciamento, limitar acesso, esconder detalhes sensíveis e declarar sua proteção de rede; nesta baseline, Spring Boot Actuator publica health, info e metrics em uma porta local separada, health mostra apenas o status, info contém dados aprovados e metrics permite inspecionar sinais automáticos da JVM, do processo e das requests sem antecipar probes, exportadores ou tracing.
```
