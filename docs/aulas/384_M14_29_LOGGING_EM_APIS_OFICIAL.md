# 384 - M14.29 - Logging em APIs

## Apresentacao da aula

Na aula 383, você organizou a configuração da aplicação por ambiente.

O mesmo jar passou a ser executado em:

```text
local;

test;

hml;

production.
```

A aplicação agora possui:

- Config Data;
- profile groups;
- properties tipadas;
- validação no startup;
- imports externos;
- variáveis de ambiente;
- config trees;
- secrets fora do Git;
- exposição de OpenAPI controlada;
- datas de lifecycle externalizadas.

Essa base resolve:

```text
como fornecer valores corretos
para cada ambiente?
```

Agora surge outra necessidade operacional.

Quando uma request falha, fica lenta ou produz um comportamento inesperado, a equipe precisa reconstruir o que aconteceu.

Perguntas comuns:

```text
qual request foi executada;

qual versão da API foi usada;

qual status foi devolvido;

quanto tempo demorou;

qual caso de uso foi acionado;

qual correlation id identifica o fluxo;

qual ambiente produziu o evento;

houve exception;

o erro foi esperado ou inesperado?
```

Responder essas perguntas sem logging exige reproduzir o problema.

Em produção, isso pode ser impossível.

A pergunta central desta aula será:

```text
como registrar o comportamento
da API com contexto suficiente
sem produzir ruido
ou vazar informacoes?
```

A solução utilizará:

```text
SLF4J;

Logback;

niveis de log;

mensagens parametrizadas;

SLF4J fluent API;

key-value pairs;

MDC;

correlation id;

logging estruturado;

JSON;

politica de dados sensiveis;

testes de logging.
```

O projeto já possui um:

```text
CorrelationIdFilter.
```

Ele foi criado na aula 374 para:

- aceitar ou gerar correlation id;
- registrar o valor no request;
- devolver `X-Correlation-Id`;
- incluir o valor no MDC;
- limpar o contexto no `finally`.

Nesta aula, esse componente será evoluído somente para estabelecer o contexto mínimo de logging e medir a duração da request.

O estudo completo de:

- servlet filters;
- interceptors;
- ordem;
- escopo;
- short-circuit;
- diferenças entre filter e interceptor;
- registro de componentes;
- exclusão de paths;

será feito na próxima aula:

```text
385 - M14.30 - Filters e interceptors.
```

Portanto, não será criado um segundo filtro HTTP apenas para logging.

A baseline utilizará o sistema de logging padrão fornecido pelo Spring Boot:

```text
SLF4J:
API usada pelo codigo.

Logback:
implementacao e configuracao.

Spring Boot:
defaults, properties e structured logging.
```

Não serão adicionados:

- Log4j2;
- encoder JSON externo;
- Springfox;
- agente de observabilidade;
- collector;
- Elasticsearch;
- Loki;
- Splunk;
- OpenTelemetry;
- tracing distribuído.

A saída será diferente por ambiente.

Local:

```text
console legivel para humanos;

DEBUG somente para o package da aplicacao;

frameworks em niveis controlados.
```

Test:

```text
saida reduzida;

captura deterministica nos testes;

sem JSON obrigatorio.
```

HML:

```text
JSON estruturado no console;

nivel INFO;

stack traces limitadas;

MDC e key-values incluidos.
```

Production:

```text
JSON estruturado no console;

nivel INFO;

frameworks em WARN;

sem SQL parameters;

sem arquivos locais por default.
```

O formato estruturado escolhido será:

```text
logstash.
```

O Spring Boot possui suporte nativo a formatos JSON estruturados.

A baseline não precisará incluir uma dependency adicional de encoder.

Configuração conceitual:

```yaml
logging:
  structured:
    format:
      console: logstash
```

O JSON incluirá:

- timestamp;
- level;
- logger;
- thread;
- message;
- MDC;
- key-value pairs;
- exception quando enviada ao logger.

Campos globais:

```text
application;

environment;

serviceVersion.
```

Campos do request:

```text
correlationId;

httpMethod;

urlPath;

apiVersion.
```

Campos do evento:

```text
event;

outcome;

httpStatus;

durationMs;

managedMessageId;

resourceVersion.
```

Nem todo evento possui todos os campos.

A política de dados será restritiva.

Não registrar:

- request body;
- response body;
- query string completa;
- `Authorization`;
- cookies;
- senha;
- token;
- secret;
- API key;
- JDBC password;
- `value`;
- `message`;
- `description`;
- headers arbitrários;
- stack trace para erros esperados;
- dados capturados de production.

IDs técnicos poderão ser registrados no laboratório.

Mesmo assim, o catálogo documentará cada campo.

A política de exception será:

```text
erros esperados de contrato:
sem stack trace.

erro inesperado 500:
ERROR com Throwable,
registrado uma unica vez.
```

Não faça:

```text
controller loga e relanca;

service loga e relanca;

repository loga e relanca;

handler loga novamente.
```

Esse padrão cria quatro stack traces para um único problema.

A baseline escolhe o ponto de responsabilidade.

O application service registra eventos de negócio bem-sucedidos.

O request logger registra conclusão HTTP.

O GlobalExceptionHandler registra a falha inesperada.

A próxima aula será:

```text
385 - M14.30 - Filters e interceptors
```

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
380:
OpenAPI Swagger.

381:
OpenAPI contract first e governanca de contrato.

382:
Versionamento de APIs compatibilidade e depreciacao.

383:
Profiles por ambiente e configuracao segura.

384:
Logging em APIs.

385:
Filters e interceptors.

386:
Eventos internos Spring.
```

A aula 383 respondeu:

```text
como configurar ambientes
sem hardcode e sem secrets?
```

A aula 384 responderá:

```text
como criar logs uteis,
estruturados e seguros
para a API?
```

Nesta aula:

```text
SLF4J:
sim.

Logback:
sim.

niveis:
sim.

structured logging:
sim.

Logstash JSON:
sim.

MDC:
sim.

correlation id:
sim.

request start:
DEBUG.

request completion:
INFO ou ERROR.

duration:
sim.

application events:
sim.

exception policy:
sim.

masking:
sim.

log injection:
sim.

profiles:
sim.

testes:
sim.

novo servlet filter:
nao.

interceptor:
nao.

async MDC propagation:
nao.

observability stack:
nao.
```

A regra central será:

```text
cada log deve responder
uma pergunta operacional;

se ele nao ajuda uma decisao
ou expõe dados demais,
nao deve existir.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura principal:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       └── ManagedRuntimeMessageApplicationService.java
├── config
│   └── logging
│       ├── LoggingProperties.java
│       ├── LoggingConfiguration.java
│       └── LoggingEventCatalog.java
├── shared
│   └── logging
│       ├── ApplicationLoggerFactory.java
│       ├── LogValueSanitizer.java
│       ├── SensitiveLogValueMasker.java
│       └── mdc
│           ├── ApiMdcKeys.java
│           └── MdcScope.java
└── web
    ├── exception
    │   └── GlobalExceptionHandler.java
    └── filter
        └── CorrelationIdFilter.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
├── application-test.yaml
├── application-hml.yaml
├── application-production.yaml
└── application-logging-file-lab.yaml
```

Testes:

```text
src/test/java/br/com/formacao/backend/logging
├── LoggingLevelPolicyTest.java
├── StructuredLoggingConfigurationTest.java
├── LoggingEventCatalogTest.java
├── MdcScopeTest.java
├── CorrelationIdMdcTest.java
├── RequestLifecycleLoggingTest.java
├── ApplicationServiceLoggingTest.java
├── ExpectedProblemLoggingTest.java
├── UnexpectedExceptionLoggingTest.java
├── SensitiveLogValueMaskerTest.java
├── LogValueSanitizerTest.java
├── LogInjectionProtectionTest.java
├── NoSecretInLogsTest.java
├── MdcCleanupTest.java
├── LoggingArchitectureTest.java
└── LoggingLiveServerIT.java
```

Documentação:

```text
docs
├── logging-architecture.md
├── logging-level-policy.md
├── structured-logging-contract.md
├── logging-event-catalog.md
├── mdc-and-correlation-id.md
├── http-request-logging.md
├── application-event-logging.md
├── exception-logging-policy.md
├── sensitive-data-logging.md
├── log-injection-protection.md
├── logging-by-environment.md
├── logback-appenders-and-rotation.md
├── logging-test-strategy.md
└── logging-baseline.md
```

Scripts:

```text
scripts
├── 162_iniciar_logging_local.ps1
├── 163_iniciar_logging_json.ps1
├── 164_testar_correlation_id_logs.ps1
├── 165_testar_erros_e_stacktrace.ps1
├── 166_testar_log_injection.ps1
├── 167_verificar_dados_sensiveis_em_logs.ps1
└── 168_executar_testes_logging.ps1
```

Resultados esperados:

```text
local:
logs legiveis.

hml:
JSON por linha.

production:
JSON por linha.

correlation id:
em todos os logs da request.

MDC:
limpo no finally.

request body:
ausente.

query string:
ausente.

Authorization:
ausente.

value e description:
ausentes.

4xx esperado:
sem stack trace.

500:
uma stack trace.

evento create:
id e version.

duration:
monotonica.

CRLF externo:
sanitizado.

secret:
REDACTED ou nao registrado.
```

---

## Conceito essencial

### Logging nao e println

`System.out.println` não fornece:

- nível;
- logger;
- configuração por ambiente;
- key-values;
- MDC;
- appenders;
- rotação;
- stack trace estruturada;
- captura consistente em testes.

Use a API de logging.

---

### SLF4J

SLF4J é uma fachada.

O código escreve:

```java
private static final Logger log =
        LoggerFactory.getLogger(
                ManagedRuntimeMessageApplicationService.class
        );
```

O código não conhece detalhes de Logback.

---

### Logback

Logback é a implementação utilizada pela baseline Spring Boot.

Ele recebe eventos SLF4J e decide:

- se o nível está habilitado;
- em qual appender escrever;
- qual encoder utilizar;
- qual formato produzir;
- quais filtros de logging aplicar.

Não confunda filtros Logback com servlet filters.

---

### Logger por classe

Use um logger estático por classe.

Não crie logger com nome vindo de request.

Nomes dinâmicos aumentam cardinalidade e dificultam configuração.

---

### TRACE

TRACE representa detalhe extremamente fino.

Exemplos possíveis:

- etapas internas de parsing;
- branches de algoritmo;
- iteração de uma fixture.

Baseline:

```text
desabilitado.
```

Não use em production como solução permanente.

---

### DEBUG

DEBUG ajuda diagnóstico de desenvolvimento.

Exemplos:

```text
request iniciada;

no-op detectado;

criteria de busca criada;

cache de fixture inexistente.
```

Não registre bodies em DEBUG.

Dados sensíveis continuam sensíveis em qualquer nível.

---

### INFO

INFO registra marcos normais e úteis.

Exemplos:

```text
request concluida;

recurso criado;

recurso atualizado;

recurso removido;

aplicacao iniciada;

configuracao validada.
```

Evite um INFO por método interno.

---

### WARN

WARN representa situação anormal recuperável.

Exemplos:

- fallback explicitamente permitido;
- recurso externo degradado;
- retry esgotado com alternativa;
- configuração legada ainda aceita;
- comportamento que exige acompanhamento.

Um 404 de consulta não é automaticamente WARN.

Client errors esperados podem permanecer INFO com `outcome=CLIENT_ERROR`.

---

### ERROR

ERROR representa falha da operação que exige atenção.

Exemplo:

```text
exception inesperada que produz 500.
```

Não use ERROR para validação de request.

Alertas baseados em ERROR perderiam utilidade.

---

### OFF e FATAL

Spring Boot aceita níveis do sistema de logging.

SLF4J não possui método `fatal`.

Use ERROR para falhas graves.

`OFF` serve para desabilitar logger por configuração.

---

### Mensagem parametrizada

Use:

```java
log.info(
        "Managed runtime message created id={} version={}",
        message.id(),
        message.version()
);
```

Não use:

```java
log.info(
        "Created " + message
);
```

A forma parametrizada evita construção desnecessária e reduz risco de `toString` acidental.

---

### Fluent logging

SLF4J também oferece:

```java
log.atInfo()
        .addKeyValue(
                "event",
                "managed_message.created"
        )
        .addKeyValue(
                "managedMessageId",
                message.id()
        )
        .addKeyValue(
                "resourceVersion",
                message.version()
        )
        .log(
                "Managed runtime message created"
        );
```

Structured logging inclui esses key-values no JSON.

---

### Event name

Toda ocorrência importante terá um nome estável.

Exemplos:

```text
http.request.started;

http.request.completed;

managed_message.created;

managed_message.replaced;

managed_message.noop;

managed_message.deleted;

api.problem.expected;

api.problem.unexpected.
```

A mensagem humana pode evoluir.

O campo `event` deve permanecer estável.

---

### Event catalog

`LoggingEventCatalog` centraliza constants.

Não centralize a frase inteira.

Exemplo:

```java
public static final String
        MANAGED_MESSAGE_CREATED =
                "managed_message.created";
```

O catálogo também documenta:

- nível;
- owner;
- campos permitidos;
- dados proibidos.

---

### MDC

MDC é um mapa de contexto associado à thread.

Ele permite que vários logs da mesma request compartilhem:

```text
correlationId;

httpMethod;

urlPath;

apiVersion;

environment.
```

O código de cada service não precisa repetir esses valores.

---

### MDC e thread reuse

Threads do servidor são reutilizadas.

Se o MDC não for limpo:

```text
a request B pode receber
o correlation id da request A.
```

Por isso, use `finally`.

---

### MdcScope

Crie um `AutoCloseable`.

Ele:

1. salva os valores anteriores das keys gerenciadas;
2. adiciona o contexto atual;
3. restaura os valores anteriores no `close`.

Não use `MDC.clear()` indiscriminadamente.

Outro componente pode possuir keys legítimas.

---

### MDC e async

MDC está associado à thread.

Ele não é propagado automaticamente para outro executor em todos os cenários.

A aula 387 estudará Async no Spring.

Não implemente propagação antecipada.

---

### Correlation id

O header continua:

```text
X-Correlation-Id.
```

O valor:

- é validado;
- possui tamanho máximo;
- recebe UUID quando ausente;
- vai para response;
- vai para request attribute;
- vai para MDC;
- aparece no Problem Detail.

Logging e erro compartilham o mesmo identificador.

---

### Contexto HTTP seguro

Registrar:

```text
method;

path;

status;

duration;

api version.
```

Não registrar:

```text
query string;

body;

headers arbitrarios.
```

Filtros podem conter dados pessoais ou secrets.

---

### Path versus URI completa

Use:

```text
request.getRequestURI().
```

Não concatene query string.

Normalize e limite o path antes do log.

---

### Duracao

Use:

```java
long started =
        System.nanoTime();
```

No final:

```java
long durationMs =
        Duration.ofNanos(
                System.nanoTime() - started
        ).toMillis();
```

`nanoTime` é monotônico.

Não use `currentTimeMillis` para medir duração.

---

### Request started

Evento:

```text
http.request.started.
```

Nível:

```text
DEBUG.
```

Campos:

- method;
- path;
- apiVersion;
- correlationId.

Não registre timestamp manualmente.

O sistema de logging já fornece.

---

### Request completed

Evento:

```text
http.request.completed.
```

Nível:

```text
INFO para status abaixo de 500;

ERROR para status 500 ou superior.
```

O evento de conclusão 500 não contém stack trace.

A exception será registrada pelo handler uma única vez.

Campos:

- status;
- durationMs;
- outcome.

---

### Outcome

Valores controlados:

```text
SUCCESS;

REDIRECTION;

CLIENT_ERROR;

SERVER_ERROR.
```

Não use o texto do status como valor livre.

---

### Logs de aplicacao

O application service registra somente operações concluídas.

Create:

```text
managed_message.created.
```

Replace real:

```text
managed_message.replaced.
```

No-op:

```text
managed_message.noop.
```

Delete:

```text
managed_message.deleted.
```

Não registre o conteúdo da mensagem.

---

### Logs de persistencia

A baseline não cria INFO para cada repository call.

Isso duplicaria application logs.

SQL do Hibernate permanece desabilitado por default.

Para diagnóstico local temporário:

```text
org.hibernate.SQL=DEBUG.
```

Bind parameters:

```text
org.hibernate.orm.jdbc.bind=TRACE
```

permanecem OFF porque podem expor valores.

---

### Exception esperada

Exemplos:

- validation failed;
- not found;
- duplicate;
- precondition failed;
- invalid patch;
- unknown filter.

O handler pode registrar:

```text
api.problem.expected;

status;

code;

exception type.
```

Sem stack trace.

Nível:

```text
INFO.
```

---

### Exception inesperada

O fallback 500 registra:

```text
api.problem.unexpected.
```

Nível:

```text
ERROR.
```

Inclui o `Throwable`.

Não inclui o detail público ou body.

O Problem Detail continua genérico.

---

### Logar uma vez

Escolha o owner do stack trace.

Na baseline:

```text
GlobalExceptionHandler.
```

Repository e service traduzem ou propagam exceptions sem logar stack trace.

---

### Dados sensiveis

Exemplos proibidos:

- password;
- token;
- secret;
- Authorization;
- Cookie;
- Set-Cookie;
- private key;
- request body;
- response body;
- datasource URL com password;
- config tree content.

A principal proteção é:

```text
nao coletar.
```

Masking é defesa secundária.

---

### SensitiveLogValueMasker

Utilitário para valores explicitamente preparados para diagnóstico.

Keys sensíveis:

```text
password;

passwd;

token;

secret;

authorization;

cookie;

apiKey;

privateKey.
```

Valor resultante:

```text
[REDACTED].
```

Não tente mascarar qualquer string livre depois que o log já foi construído.

---

### Log injection

Entrada maliciosa:

```text
produto\r\nERROR acesso concedido
```

pode criar uma linha falsa em formato textual.

Parameterized logging não remove caracteres de controle.

`LogValueSanitizer`:

- remove CR;
- remove LF;
- remove tab;
- remove outros control chars;
- limita a 200 caracteres;
- devolve marcador para null.

Use somente quando um valor externo realmente precisa ser registrado.

---

### Alta cardinalidade

Evite campos como:

- body completo;
- stack trace como key;
- user-agent completo;
- query string;
- valor de negócio livre;
- timestamp duplicado;
- UUID como nome de field.

Correlation ID possui alta cardinalidade, mas é necessário para investigação e permanece como valor, não como nome.

---

### Logging estruturado

Uma linha JSON por evento facilita:

- parsing;
- busca;
- filtro;
- agregação;
- correlação;
- alertas;
- dashboards.

Não grave JSON formatado em múltiplas linhas.

---

### Formato Logstash

HML e production:

```yaml
logging:
  structured:
    format:
      console: logstash
```

MDC e fluent key-values entram no objeto JSON.

---

### Campos globais

Use:

```yaml
logging:
  structured:
    json:
      add:
        application: "${spring.application.name}"
        environment: "${app.environment.name}"
        serviceVersion: "${APP_VERSION:dev}"
```

Nenhum campo global recebe secret.

---

### Stack trace estruturada

Production:

```yaml
logging:
  structured:
    json:
      stacktrace:
        root: first
        max-length: 8192
        max-throwable-depth: 40
        include-common-frames: false
        include-hashes: true
```

Limitar não substitui análise do erro.

Evita eventos gigantes.

---

### Console versus arquivo

A baseline usa console.

Em containers, stdout facilita captura pela plataforma.

Um profile opcional:

```text
logging-file-lab
```

demonstra arquivo e rotação local.

Production não grava arquivo local por default.

---

### Appender

Appender define o destino.

Exemplos:

- console;
- file;
- rolling file;
- socket.

A baseline usa ConsoleAppender gerenciado pelos defaults do Spring Boot.

---

### Encoder

Encoder transforma o evento em bytes.

No structured logging, o encoder produz JSON.

Não implemente serializer manual.

---

### Rotacao local

Profile de laboratório:

```yaml
logging:
  file:
    name: "logs/formacao-java-backend-api.log"

  logback:
    rollingpolicy:
      max-file-size: "10MB"
      max-history: 7
      total-size-cap: "100MB"
```

Não versionar arquivos gerados.

---

### logback-spring.xml

A baseline não precisa de XML customizado.

Quando extensões Spring forem necessárias, use:

```text
logback-spring.xml.
```

Não use `logback.xml` com extensions Spring.

---

### Teste de logs

Logs são comportamento observável.

Teste:

- nível;
- event;
- key-values;
- exception;
- MDC;
- limpeza;
- ausência de secrets;
- JSON parseável;
- cardinalidade controlada.

Não teste timestamps exatos.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

---

### 2. Inspecionar dependency tree

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.slf4j:*,ch.qos.logback:*"
```

Confirme uma única implementação.

Não fixe versões fora do dependency management do Boot.

---

### 3. Criar LoggingEventCatalog

Adicione constants para os eventos oficiais.

Crie teste de unicidade.

---

### 4. Criar ApiMdcKeys

Keys:

```text
correlationId;

httpMethod;

urlPath;

apiVersion;

environment.
```

Não use nomes diferentes no JSON e nos testes.

---

### 5. Criar MdcScope

Receba um map permitido.

Salve valores anteriores.

Aplique somente keys conhecidas.

Restaure no `close`.

---

### 6. Criar LogValueSanitizer

Método:

```text
sanitizeForLog.
```

Regras:

- remove controles;
- substitui quebra por espaço;
- trunca;
- nunca lança exception.

---

### 7. Criar SensitiveLogValueMasker

Entrada:

```text
Map<String, String>.
```

Saída:

```text
map imutável mascarado.
```

Não use para request body.

---

### 8. Evoluir CorrelationIdFilter

Mantenha a validação existente.

Adicione contexto:

- method;
- path sanitizado;
- version;
- environment.

Use `MdcScope`.

---

### 9. Medir duracao

Capture `nanoTime`.

Logue started em DEBUG.

No finally, logue completed.

Depois feche o MDC scope.

---

### 10. Classificar outcome

Crie função pura por status.

Teste boundaries:

```text
199;

200;

299;

300;

399;

400;

499;

500.
```

---

### 11. Adicionar logs no service

Após commit lógico do caso de uso:

- create;
- replace;
- no-op;
- delete.

Use fluent key-values.

Não logue request.

---

### 12. Revisar transacao

O log dentro do método ocorre antes do commit físico.

Documente essa limitação.

Quando for necessário log pós-commit, eventos transacionais serão estudados em aulas futuras.

Não declare “persistido definitivamente” antes do commit.

Use mensagem:

```text
Managed runtime message change accepted.
```

Ou logue após o port e reconheça a semântica.

---

### 13. Evoluir GlobalExceptionHandler

Erros esperados:

```text
INFO sem Throwable.
```

Erro inesperado:

```text
ERROR com Throwable.
```

Inclua `event` e `code`.

---

### 14. Configurar base

Em `application.yaml`:

```yaml
logging:
  level:
    root: INFO
    "br.com.formacao.backend": INFO
    "org.hibernate.SQL": WARN
    "org.hibernate.orm.jdbc.bind": OFF
```

---

### 15. Configurar local

Em `application-local.yaml`:

```yaml
logging:
  level:
    "br.com.formacao.backend": DEBUG

  pattern:
    console: "%d{yyyy-MM-dd'T'HH:mm:ss.SSSXXX} %-5level [%thread] [corr=%X{correlationId}] [api=%X{apiVersion}] %logger{36} - %msg%n"
```

Não habilite bind values.

---

### 16. Configurar HML

Use structured Logstash.

Adicione campos globais não sensíveis.

Mantenha app INFO.

---

### 17. Configurar production

Use structured Logstash.

Frameworks WARN.

Stack trace limitada.

OpenAPI já permanece desabilitada pela aula 383.

---

### 18. Configurar test

Root WARN.

Package da aplicação INFO.

Sem arquivo.

Sem structured logging obrigatório.

---

### 19. Criar profile file lab

Adicione file e rolling policy.

Não ative pelo group production.

---

### 20. Criar teste de niveis

Carregue profiles.

Confirme levels esperados.

Não dependa de logger global deixado por outro teste.

---

### 21. Criar StructuredLoggingConfigurationTest

Ative HML.

Emita evento conhecido.

Capture output.

Localize a linha pelo event.

Parseie com Jackson.

---

### 22. Validar JSON

Confirme fields:

- level;
- message;
- application;
- environment;
- event;
- correlationId.

Não fixe ordem das keys.

---

### 23. Criar MdcScopeTest

Teste:

- apply;
- nested scope;
- restore;
- remove quando anterior ausente;
- exception no bloco;
- close idempotente.

---

### 24. Criar RequestLifecycleLoggingTest

MockMvc:

- GET 200;
- GET 404;
- POST 400;
- fixture 500.

Valide started e completed.

---

### 25. Criar CorrelationIdMdcTest

Envie correlation id válido.

Confirme o mesmo valor em:

- response;
- Problem Detail quando houver;
- request log;
- application log.

---

### 26. Criar MdcCleanupTest

Execute duas requests na mesma executor thread de fixture.

A segunda não pode herdar o valor da primeira.

---

### 27. Criar ApplicationServiceLoggingTest

Use `ListAppender`.

Valide create, replace, no-op e delete.

Confirme ausência de value e description.

---

### 28. Criar ExpectedProblemLoggingTest

Provoque 400, 404, 409, 412 e 422.

Confirme:

- event expected;
- status;
- code;
- zero ThrowableProxy.

---

### 29. Criar UnexpectedExceptionLoggingTest

Provoque exception de fixture.

Confirme:

- uma ocorrência `api.problem.unexpected`;
- level ERROR;
- ThrowableProxy presente;
- Problem Detail 500 genérico.

---

### 30. Criar LogInjectionProtectionTest

Envie path ou header permitido de fixture com CRLF.

Confirme uma linha física de log.

O correlation id inválido deve ser substituído, não registrado cru.

---

### 31. Criar NoSecretInLogsTest

Use valores sentinela:

```text
PASSWORD_SENTINEL;

TOKEN_SENTINEL;

BODY_SENTINEL.
```

Execute requests e startup fixtures.

Capture output.

Nenhum sentinel pode aparecer.

---

### 32. Criar ArchitectureTest

Valide:

- zero `System.out`;
- zero `System.err`;
- zero concatenação em chamadas logger;
- zero request body logging;
- zero response body logging;
- zero Authorization logging;
- zero Cookie logging;
- zero logger dinâmico;
- zero Log4j2 dependency;
- zero encoder externo;
- zero novo servlet filter;
- structured logging por property.

---

### 33. Criar LiveServerIT

Use:

- RANDOM_PORT;
- PostgreSQLContainer;
- profile hml de fixture;
- output capture.

Execute:

1. POST;
2. GET;
3. list;
4. validation error;
5. not found;
6. unexpected error de fixture.

Parseie todas as linhas da aplicação relevantes.

---

### 34. Criar documentacao

`logging-architecture.md` diferencia API, implementation, appender e encoder.

`logging-level-policy.md` define níveis.

`structured-logging-contract.md` lista fields.

`logging-event-catalog.md` lista events.

`mdc-and-correlation-id.md` documenta scope.

`http-request-logging.md` define dados permitidos.

`application-event-logging.md` define eventos de negócio.

`exception-logging-policy.md` define owner da stack trace.

`sensitive-data-logging.md` cria denylist.

`log-injection-protection.md` define sanitização.

`logging-by-environment.md` cria matriz.

`logback-appenders-and-rotation.md` documenta console e file lab.

`logging-test-strategy.md` documenta ListAppender e output capture.

`logging-baseline.md` consolida a policy.

---

### 35. Criar scripts

`162_iniciar_logging_local.ps1` inicia local.

`163_iniciar_logging_json.ps1` inicia HML fixture.

`164_testar_correlation_id_logs.ps1` envia id controlado.

`165_testar_erros_e_stacktrace.ps1` compara 4xx e 500.

`166_testar_log_injection.ps1` envia controles.

`167_verificar_dados_sensiveis_em_logs.ps1` procura sentinels.

`168_executar_testes_logging.ps1` executa a suite.

---

### 36. Executar testes de configuracao

```powershell
.\mvnw.cmd `
  -Dtest=LoggingLevelPolicyTest,StructuredLoggingConfigurationTest,LoggingEventCatalogTest test
```

---

### 37. Executar testes MDC

```powershell
.\mvnw.cmd `
  -Dtest=MdcScopeTest,CorrelationIdMdcTest,MdcCleanupTest test
```

---

### 38. Executar testes de eventos

```powershell
.\mvnw.cmd `
  -Dtest=RequestLifecycleLoggingTest,ApplicationServiceLoggingTest,ExpectedProblemLoggingTest,UnexpectedExceptionLoggingTest test
```

---

### 39. Executar testes de seguranca

```powershell
.\mvnw.cmd `
  -Dtest=SensitiveLogValueMaskerTest,LogValueSanitizerTest,LogInjectionProtectionTest,NoSecretInLogsTest test
```

---

### 40. Executar arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=LoggingArchitectureTest test
```

---

### 41. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=LoggingLiveServerIT test
```

Docker precisa estar ativo.

---

### 42. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 43. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 44. Revisar escopo

Confirme:

```text
SLF4J:
sim.

Logback:
sim.

JSON:
sim.

MDC:
sim.

secrets:
zero.

bodies:
zero.

novo filter:
zero.

interceptor:
zero.

async propagation:
zero.

collector externo:
zero.
```

---

### 45. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- logs;
- arquivo rolling;
- target;
- dumps;
- body capturado;
- secret;
- output de production;
- dependência JSON externa;
- filter antecipado.

---

## Entendendo o que foi feito

### Os logs ganharam contrato

Events e fields deixaram de depender de frases livres.

### O contexto passou a acompanhar a request

Correlation ID, versão, método e path aparecem sem repetição manual.

### A produção ganhou JSON nativo

Nenhum encoder adicional foi necessário.

### Exceptions ganharam ownership

Erros esperados não geram stack trace e 500 é registrado uma vez.

### Segurança virou parte da estratégia

Bodies, secrets e entradas não sanitizadas ficaram fora dos eventos.

---

## Erros comuns importantes

### Logar request body para facilitar debug

O ganho imediato cria risco de dados pessoais e secrets.

### Usar ERROR para todo 4xx

Alertas viram ruído operacional.

### Logar e relancar em todas as camadas

Uma falha produz stack traces duplicadas.

### Esquecer de limpar MDC

Threads reutilizadas misturam requests.

### Confiar apenas em masking

A melhor proteção é não coletar o dado.

---

## Comandos uteis

### Logging local

```powershell
.\scripts\162_iniciar_logging_local.ps1
```

### Logging JSON

```powershell
.\scripts\163_iniciar_logging_json.ps1
```

### Correlation ID

```powershell
.\scripts\164_testar_correlation_id_logs.ps1
```

### Erros

```powershell
.\scripts\165_testar_erros_e_stacktrace.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Concatenacao

Troque um log parametrizado por concatenação.

Faça o architecture test falhar.

Restaure.

### Parte 2 — MDC leak

Remova o `close` em fixture.

Execute duas requests.

Observe o correlation id incorreto.

Restaure.

### Parte 3 — 4xx como ERROR

Altere o nível.

Observe o ruído no relatório.

Restaure a policy.

### Parte 4 — Structured fields

Adicione key-value controlada em um evento.

Confirme JSON parseável.

### Parte 5 — Bind values

Ative temporariamente Hibernate bind TRACE com dados sentinela.

Observe o risco.

Desative.

### Parte 6 — File appender

Ative `logging-file-lab`.

Valide rotação local.

Não versione os arquivos.

### Parte 7 — Async

Execute uma tarefa em outro thread.

Observe ausência de MDC.

Não implemente propagação antes da aula 387.

### Parte 8 — ADR

Registre:

```text
SLF4J como API;

Logback do Boot;

Logstash JSON em hml e production;

console humano local;

event names estaveis;

MDC por request;

stack trace somente no owner;

sem bodies e secrets;

sanitizacao de input;

console como appender principal;

filters e interceptors na aula 385.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 383 foi preservada;
- o mesmo projeto foi continuado;
- logging foi diferenciado de println;
- SLF4J foi usado como API;
- Logback foi mantido como implementação;
- dependency management do Boot foi preservado;
- nenhuma versão de Logback foi fixada manualmente;
- nenhum segundo provider SLF4J foi adicionado;
- Log4j2 não foi adicionado;
- encoder JSON externo não foi adicionado;
- níveis TRACE, DEBUG, INFO, WARN e ERROR foram explicados;
- FATAL foi diferenciado;
- OFF foi explicado;
- TRACE ficou desabilitado;
- DEBUG ficou restrito ao desenvolvimento;
- INFO registra eventos normais;
- WARN não foi usado para todo 4xx;
- ERROR ficou reservado a falha inesperada;
- logger por classe foi usado;
- logger dinâmico não foi usado;
- mensagens parametrizadas foram usadas;
- concatenação em chamadas logger foi rejeitada;
- fluent logging foi usado;
- key-value pairs foram usados;
- event names estáveis foram criados;
- LoggingEventCatalog foi criado;
- events foram documentados;
- `http.request.started` foi criado;
- `http.request.completed` foi criado;
- create event foi criado;
- replace event foi criado;
- no-op event foi criado;
- delete event foi criado;
- expected problem event foi criado;
- unexpected problem event foi criado;
- MDC foi explicado;
- ApiMdcKeys foi criado;
- MdcScope foi criado;
- valores anteriores do MDC são restaurados;
- MDC.clear indiscriminado não foi usado;
- MDC foi limpo em finally;
- thread reuse foi testado;
- propagação async não foi antecipada;
- correlation id foi preservado;
- correlation id aparece no response;
- correlation id aparece no Problem Detail;
- correlation id aparece nos logs;
- method foi registrado;
- path foi registrado;
- query string não foi registrada;
- request body não foi registrado;
- response body não foi registrado;
- headers arbitrários não foram registrados;
- API version foi registrada;
- environment foi registrado;
- duração foi registrada;
- `System.nanoTime` foi usado;
- currentTimeMillis não foi usado para duração;
- outcome foi padronizado;
- status boundaries foram testados;
- started usa DEBUG;
- completed abaixo de 500 usa INFO;
- completed 500 usa ERROR sem Throwable;
- stack trace 500 é registrada no handler;
- stack trace foi registrada uma vez;
- repository não loga e relança;
- service não loga stack trace e relança;
- controller não loga stack trace;
- expected errors não possuem Throwable;
- validation não gera stack trace;
- not found não gera stack trace;
- conflict não gera stack trace;
- precondition failure não gera stack trace;
- patch invalid não gera stack trace;
- unexpected exception gera ERROR;
- unexpected exception possui Throwable;
- Problem Detail 500 continua genérico;
- application logs não contêm value;
- application logs não contêm message;
- application logs não contêm description;
- application logs usam id e version permitidos;
- limitação do log antes do commit foi documentada;
- eventos pós-commit não foram antecipados;
- SQL ficou desabilitado por default;
- bind parameter ficou OFF;
- debug SQL local foi documentado como temporário;
- dados sensíveis foram catalogados;
- Authorization não foi registrado;
- Cookie não foi registrado;
- password não foi registrado;
- token não foi registrado;
- secret não foi registrado;
- private key não foi registrada;
- SensitiveLogValueMasker foi criado como defesa secundária;
- máscara `[REDACTED]` foi usada;
- masking não substituiu minimização;
- log injection foi explicado;
- LogValueSanitizer foi criado;
- CR foi tratado;
- LF foi tratado;
- tab foi tratado;
- caracteres de controle foram tratados;
- valores externos foram truncados;
- correlation id inválido não foi registrado cru;
- alta cardinalidade foi discutida;
- structured logging foi implementado;
- formato Logstash foi usado;
- JSON por linha foi preservado;
- MDC aparece no JSON;
- fluent key-values aparecem no JSON;
- application global foi adicionado;
- environment global foi adicionado;
- serviceVersion global foi adicionado;
- nenhum campo global contém secret;
- stack trace estruturada foi limitada;
- hash de stack trace foi habilitado;
- local usa console humano;
- HML usa JSON;
- production usa JSON;
- test usa saída reduzida;
- OpenAPI e lifecycle profiles anteriores foram preservados;
- console é o appender principal;
- file appender ficou em profile de laboratório;
- rotação foi configurada;
- production não grava arquivo local por default;
- `logback-spring.xml` foi explicado;
- XML customizado não foi criado sem necessidade;
- appender foi definido;
- encoder foi definido;
- filtros Logback foram diferenciados de servlet filters;
- LoggingLevelPolicyTest foi criado;
- StructuredLoggingConfigurationTest foi criado;
- LoggingEventCatalogTest foi criado;
- MdcScopeTest foi criado;
- CorrelationIdMdcTest foi criado;
- RequestLifecycleLoggingTest foi criado;
- ApplicationServiceLoggingTest foi criado;
- ExpectedProblemLoggingTest foi criado;
- UnexpectedExceptionLoggingTest foi criado;
- SensitiveLogValueMaskerTest foi criado;
- LogValueSanitizerTest foi criado;
- LogInjectionProtectionTest foi criado;
- NoSecretInLogsTest foi criado;
- MdcCleanupTest foi criado;
- LoggingArchitectureTest foi criado;
- zero System.out foi validado;
- zero System.err foi validado;
- LoggingLiveServerIT foi criado;
- PostgreSQL real foi preservado;
- JSON foi parseado em teste;
- timestamps exatos não foram fixados;
- documentação completa foi criada;
- scripts 162 a 168 foram criados;
- testes de configuração, MDC, eventos, segurança, arquitetura, live, suite e package passaram;
- nenhum novo servlet filter, interceptor, evento Spring, Async, OpenTelemetry, collector ou observability stack foi antecipado;
- ponte para a aula 385 está correta;
- commit recomendado e diário de bordo estão prontos.

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
git commit -m "feat(m14): estruturar logging seguro da api"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- logs;
- rolling files;
- target;
- outputs capturados;
- body;
- token;
- secret;
- dependência de encoder;
- filter antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a API ganhou uma política de logging verificável.

O fluxo consolidado ficou:

```text
SLF4J;

Logback;

profile;

nivel;

MDC;

correlation id;

event name;

key-values;

structured JSON;

exception owner;

sanitizacao;

testes.
```

Você comprovou:

```text
contexto por request;

duracao monotona;

JSON em HML e production;

console humano local;

events de aplicacao;

4xx sem stack trace;

500 com uma stack trace;

MDC sem vazamento;

sem bodies;

sem secrets;

sem log injection.
```

A decisão central foi:

```text
logging profissional
nao e registrar tudo;

e registrar eventos conhecidos,
com contexto controlado,
nivel correto,
dados minimos
e uma politica verificavel.
```

A próxima aula será:

```text
385 - M14.30 - Filters e interceptors
```

Nela, você continuará no mesmo projeto e estudará:

- servlet filters;
- `Filter`;
- `OncePerRequestFilter`;
- filter chain;
- dispatcher types;
- ordem;
- registration;
- path inclusion;
- path exclusion;
- short-circuit;
- response wrapping;
- Spring MVC interceptors;
- `HandlerInterceptor`;
- `preHandle`;
- `postHandle`;
- `afterCompletion`;
- handler metadata;
- filters versus interceptors;
- correlation;
- request logging;
- lifecycle headers;
- preconditions transversais;
- testes;
- arquitetura;
- limites de cada mecanismo.

A aula 384 respondeu:

```text
como produzir logs
uteis, estruturados e seguros?
```

A aula 385 responderá:

```text
onde implementar preocupacoes
transversais do ciclo HTTP
e quando escolher filter
ou interceptor?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei escolher níveis e events de log.
- [ ] Sei usar MDC e correlation ID sem vazamento entre requests.
- [ ] Sei produzir JSON estruturado sem encoder externo.
- [ ] Sei registrar exceptions uma única vez e proteger dados sensíveis.
- [ ] Sei testar logs, fields, níveis, limpeza e segurança.

---

## Troubleshooting adicional

### JSON nao aparece em production

Confirme o profile e `logging.structured.format.console`.

### Correlation id some no service

Confirme que o log ocorre dentro do scope da request.

### Request seguinte herda contexto

Revise `MdcScope.close` e o `finally`.

### 4xx imprime stack trace

O handler esperado está enviando o Throwable ao logger.

### Body aparece no log

Procure debug de request, SQL bind e `toString` de DTO.

### Log JSON quebra parser

Confirme uma linha por evento e ausência de concatenação manual.

---

## Perguntas de revisao

1. Qual é a função do SLF4J?
2. Qual implementação foi mantida?
3. Qual nível para detalhe de desenvolvimento?
4. Qual nível para falha 500?
5. Todo 4xx é WARN?
6. Para que serve o event name?
7. O que é MDC?
8. Por que limpar MDC?
9. Qual identificador correlaciona request e Problem Detail?
10. Como medir duração?
11. Query string é registrada?
12. Request body é registrado?
13. Onde a stack trace 500 é registrada?
14. Quantas vezes ela deve aparecer?
15. Qual formato estruturado foi usado?
16. HML e production usam JSON?
17. Masking substitui minimização?
18. O que é log injection?
19. Um novo filter foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fachada de logging.
2. Logback.
3. DEBUG.
4. ERROR.
5. Não.
6. Identificador estável do evento.
7. Contexto associado à thread.
8. Evitar vazamento entre requests.
9. Correlation ID.
10. `System.nanoTime`.
11. Não.
12. Não.
13. No GlobalExceptionHandler.
14. Uma.
15. Logstash JSON.
16. Sim.
17. Não.
18. Inserção de controles para falsificar logs.
19. Não.
20. Filters e interceptors.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 384 - M14.29 - Logging em APIs

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei SLF4J de Logback.
- Mantive o logging fornecido pelo Spring Boot.
- Estudei TRACE, DEBUG, INFO, WARN, ERROR e OFF.
- Criei uma política de níveis por tipo de evento.
- Troquei concatenação por mensagens parametrizadas.
- Usei a fluent logging API com key-value pairs.
- Criei nomes de eventos estáveis.
- Criei um catálogo de eventos de logging.
- Evoluí o contexto do CorrelationIdFilter existente.
- Mantive correlation ID no response, Problem Detail e logs.
- Adicionei method, path, API version e environment ao MDC.
- Criei `MdcScope` para restaurar o contexto.
- Evitei vazamento de MDC entre threads reutilizadas.
- Medi duração com `System.nanoTime`.
- Registrei início da request em DEBUG.
- Registrei conclusão da request com status e outcome.
- Criei eventos de create, replace, no-op e delete.
- Mantive conteúdo da mensagem fora dos logs.
- Registrei erros esperados sem stack trace.
- Registrei falhas inesperadas uma única vez com Throwable.
- Mantive SQL e bind parameters desabilitados por default.
- Criei política de dados sensíveis.
- Usei masking apenas como defesa secundária.
- Implementei sanitização contra log injection.
- Ativei logging estruturado Logstash em HML e production.
- Mantive console legível no ambiente local.
- Usei console como appender principal.
- Criei profile opcional para file e rotação local.
- Testei níveis, JSON, events, MDC, exceptions e secrets.
- Não criei novo servlet filter ou interceptor.
- Próxima aula: Filters e interceptors.
```

---

## Referencia tecnica curta

```text
SLF4J:
API.

Logback:
implementacao.

Level:
severidade.

Event:
identidade.

MDC:
contexto.

Correlation:
rastreio.

JSON:
estrutura.

Mask:
defesa.

Appender:
destino.

Test:
confianca.
```

Regra final:

```text
uma API deve usar SLF4J como fachada, manter a implementação de logging sob controle do Spring Boot e registrar eventos estáveis com níveis, mensagens parametrizadas e key-values; contexto de request deve entrar no MDC e ser restaurado no finally, durações devem usar relógio monotônico, logs estruturados devem permanecer parseáveis e incluir somente campos aprovados, errors esperados não devem gerar stack trace, exceptions inesperadas devem ser registradas uma única vez, e bodies, query strings, credenciais, tokens e valores de negócio sensíveis devem ser excluídos por design, com sanitização, masking defensivo e testes automatizados complementando a minimização.
```
