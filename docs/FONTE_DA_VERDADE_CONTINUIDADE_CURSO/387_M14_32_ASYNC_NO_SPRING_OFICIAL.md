# 387 - M14.32 - Async no Spring

## Apresentacao da aula

Na aula 386, você adicionou eventos internos à aplicação.

O fluxo atual possui:

```text
application service;

ApplicationEventPublisher;

eventos imutaveis;

listener sincrono;

auditoria na mesma transacao;

@TransactionalEventListener;

fases de commit e rollback;

idempotencia por eventId.
```

A criação, a substituição real e a exclusão de uma `managed runtime message` publicam fatos internos.

O no-op continua sem evento.

A auditoria obrigatória utiliza um listener síncrono.

Se esse listener falhar:

```text
a transacao principal faz rollback.
```

Também foi criado um listener:

```text
AFTER_COMMIT.
```

Ele observa a conclusão bem-sucedida sem escrever no banco.

Essa baseline mantém todas as reações no thread que processou a request.

Isso garante simplicidade, mas também aumenta o tempo do fluxo síncrono.

Considere uma reação que não precisa bloquear a response HTTP.

Exemplos:

- gerar uma projeção secundária;
- preparar um relatório interno;
- registrar um recibo operacional;
- executar uma integração não crítica;
- calcular uma informação derivada;
- produzir uma notificação interna.

Se a reação leva 700 milissegundos, a request também fica presa por esse período quando tudo é síncrono.

Uma solução ingênua seria criar uma thread manual:

```java
new Thread(
        () -> process(event)
).start();
```

Esse desenho ignora:

- limite de concorrência;
- fila;
- rejeição;
- shutdown;
- nomes de thread;
- contexto;
- exceptions;
- métricas;
- configuração por ambiente;
- testes;
- ciclo de vida do Spring.

Outra solução incompleta seria adicionar:

```text
@Async
```

em qualquer método e considerar o problema resolvido.

Execução assíncrona cria novas perguntas.

```text
qual executor executa;

quantas tasks cabem;

o que acontece quando a fila lota;

como a exception chega;

a transacao e propagada;

o correlation id continua;

o metodo realmente passou pelo proxy;

o shutdown aguarda tarefas;

a task pode ser perdida;

como testar sem sleep arbitrario?
```

A pergunta central desta aula será:

```text
como executar reacoes
fora do thread da request
sem perder controle de capacidade,
contexto, exceptions e shutdown?
```

A solução utilizará:

```text
@EnableAsync;

@Async;

AsyncConfigurer;

ThreadPoolTaskExecutor;

TaskDecorator;

AsyncUncaughtExceptionHandler;

CompletableFuture;

bounded queue;

rejection policy;

graceful shutdown;

nova transacao explicita;

testes concorrentes.
```

O caso prático continuará os eventos da aula 386.

Depois de um commit bem-sucedido:

```text
ManagedRuntimeMessageAfterCommitAsyncBridge
```

receberá o evento.

Esse listener continuará síncrono e transacionalmente alinhado a:

```text
AFTER_COMMIT.
```

Ele chamará outro bean:

```text
ManagedRuntimeMessageAsyncProcessor.
```

O método do processor será:

```java
@Async(
        "managedMessageAsyncExecutor"
)
public void process(
        ManagedRuntimeMessageChangedEvent event
) {
}
```

A chamada atravessará o proxy Spring.

O proxy submeterá a task ao executor nomeado.

O thread da request poderá continuar.

O processor chamará:

```text
ManagedRuntimeMessageAsyncReceiptService.
```

Esse service abrirá:

```text
REQUIRES_NEW.
```

Ele gravará uma linha em:

```text
managed_runtime_message_async_receipt.
```

A linha representa:

```text
o processo recebeu e concluiu
a reacao assíncrona.
```

Ela não transforma o mecanismo em mensageria confiável.

Se o processo cair:

- depois do commit principal;
- antes da submissão;
- enquanto a task está na memória;
- antes da nova transação concluir;

o recibo pode não existir.

Não haverá:

- retry persistido;
- broker;
- dead letter;
- outbox;
- replay;
- delivery guarantee externa.

A aula deixará esse limite explícito.

A tabela será útil para estudar:

- thread switch;
- transação nova;
- idempotência;
- tempo de processamento;
- status;
- testes assíncronos.

A baseline utilizará um executor de platform threads com capacidade conhecida.

Configuração inicial:

```text
core pool:
2.

max pool:
4.

queue capacity:
20.

keep alive:
30 segundos.

thread prefix:
managed-message-async-.

rejection:
AbortPolicy.

shutdown wait:
15 segundos.
```

Não será usado um executor ilimitado.

Não será usado `CallerRunsPolicy` na baseline.

Quando saturada, essa policy poderia executar a task no thread que submeteu o trabalho.

Isso altera a expectativa:

```text
async pode voltar a bloquear
o fluxo chamador.
```

A baseline prefere rejeição explícita e observável.

O uso de virtual threads será estudado.

O Spring Boot pode auto-configurar execução baseada em virtual threads quando:

```text
Java 21+;

spring.threads.virtual.enabled=true.
```

A baseline não habilitará esse modo.

Motivo:

```text
o objetivo desta aula e aprender
capacidade, fila, max pool,
rejeicao e backpressure.
```

Virtual threads reduzem o custo por thread para workloads bloqueantes.

Elas não tornam banco, conexões, APIs externas ou memória infinitos.

O projeto permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
388 - M14.33 - Cache com Spring Redis
```

Por isso, esta aula não adicionará:

- Redis;
- cache abstraction;
- `@Cacheable`;
- TTL;
- cache invalidation;
- rate limiting;
- broker;
- outbox;
- scheduler;
- retry framework.

---

## Onde estamos na formacao

A sequência atual é:

```text
383:
Profiles por ambiente e configuracao segura.

384:
Logging em APIs.

385:
Filters e interceptors.

386:
Eventos internos Spring.

387:
Async no Spring.

388:
Cache com Spring Redis.

389:
Rate limiting.
```

A aula 386 respondeu:

```text
como publicar fatos internos
e alinhar listeners
com a transacao?
```

A aula 387 responderá:

```text
como mover uma reacao
para outro thread
com capacidade e falhas controladas?
```

Nesta aula:

```text
@EnableAsync:
sim.

@Async:
sim.

proxy:
sim.

self-invocation:
sim.

executor nomeado:
sim.

ThreadPoolTaskExecutor:
sim.

fila limitada:
sim.

rejeicao:
sim.

TaskDecorator:
sim.

MDC:
sim.

void:
sim.

CompletableFuture:
sim.

AsyncUncaughtExceptionHandler:
sim.

REQUIRES_NEW:
sim.

shutdown:
sim.

virtual threads:
conceitual e fixture.

broker:
nao.

outbox:
nao.

Redis:
nao.
```

A regra central será:

```text
assíncrono nao significa
sem limite e sem responsabilidade;

significa uma nova fronteira
de concorrencia, transacao,
contexto e falha.
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
│       └── event
│           └── async
│               ├── ManagedRuntimeMessageAfterCommitAsyncBridge.java
│               ├── ManagedRuntimeMessageAsyncProcessor.java
│               ├── ManagedRuntimeMessageAsyncReceiptService.java
│               ├── ManagedRuntimeMessageAsyncInspectionService.java
│               └── ManagedRuntimeMessageAsyncProcessingResult.java
├── config
│   └── async
│       ├── AsyncExecutionConfiguration.java
│       ├── AsyncExecutionProperties.java
│       ├── ManagedMessageAsyncExecutorMetrics.java
│       ├── ManagedMessageAsyncUncaughtExceptionHandler.java
│       └── MdcCopyingTaskDecorator.java
└── infrastructure
    └── persistence
        └── jpa
            └── async
                ├── ManagedRuntimeMessageAsyncReceiptJpaEntity.java
                └── ManagedRuntimeMessageAsyncReceiptRepository.java
```

Migration:

```text
src/main/resources/db/migration
└── V5__create_managed_runtime_message_async_receipt.sql
```

Testes:

```text
src/test/java/br/com/formacao/backend/async
├── AsyncExecutionPropertiesTest.java
├── AsyncExecutorConfigurationTest.java
├── AsyncProxyBoundaryTest.java
├── AsyncSelfInvocationTest.java
├── AsyncThreadSwitchTest.java
├── AsyncMdcPropagationTest.java
├── AsyncMdcCleanupTest.java
├── AsyncVoidExceptionHandlerTest.java
├── AsyncCompletableFutureSuccessTest.java
├── AsyncCompletableFutureFailureTest.java
├── AsyncExecutorSaturationTest.java
├── AsyncTaskRejectionTest.java
├── AsyncGracefulShutdownTest.java
├── AsyncTransactionBoundaryIT.java
├── AsyncEventAfterCommitIT.java
├── AsyncEventRollbackTest.java
├── AsyncReceiptIdempotencyIT.java
├── AsyncNoOpEventTest.java
├── AsyncLoggingTest.java
├── AsyncArchitectureTest.java
└── AsyncLiveServerIT.java
```

Documentação:

```text
docs
├── spring-async-fundamentals.md
├── async-proxy-boundaries.md
├── async-method-return-types.md
├── async-exception-handling.md
├── thread-pool-sizing.md
├── async-queue-and-rejection.md
├── async-task-decorator.md
├── async-mdc-propagation.md
├── async-transaction-boundaries.md
├── async-graceful-shutdown.md
├── async-virtual-threads.md
├── async-testing-strategy.md
├── async-reliability-limitations.md
└── spring-async-baseline.md
```

Scripts:

```text
scripts
├── 183_testar_processamento_assincrono.ps1
├── 184_testar_propagacao_mdc_async.ps1
├── 185_testar_exception_void_async.ps1
├── 186_testar_completable_future.ps1
├── 187_testar_saturacao_do_executor.ps1
├── 188_testar_shutdown_assincrono.ps1
└── 189_executar_testes_async.ps1
```

Resultados esperados:

```text
publisher thread:
http-nio ou test thread.

async thread:
managed-message-async-*.

HTTP response:
nao espera o recibo.

commit principal:
antes do processamento async.

async transaction:
nova.

rollback principal:
zero task async.

no-op:
zero task async.

MDC correlation id:
propagado.

MDC depois da task:
limpo.

void failure:
AsyncUncaughtExceptionHandler.

CompletableFuture failure:
future excepcional.

fila cheia:
TaskRejectedException.

shutdown:
aguarda ate o limite.

task perdida em crash:
possivel e documentada.

Redis:
zero.
```

---

## Conceito essencial

### Sincrono versus assíncrono

Síncrono:

```text
caller espera o metodo terminar.
```

Assíncrono:

```text
caller submete trabalho
e pode continuar antes da conclusao.
```

Assíncrono não significa paralelo em todos os casos.

Se houver um único worker, as tasks continuam uma por vez.

---

### Concorrencia versus paralelismo

Concorrência permite tarefas em progresso sobrepostas.

Paralelismo executa tarefas ao mesmo tempo em cores diferentes.

Um executor com duas platform threads pode executar duas tasks simultaneamente.

Virtual threads permitem alta concorrência bloqueante, mas não criam CPU adicional.

---

### @EnableAsync

Adicione em uma classe de configuração:

```java
@Configuration(
        proxyBeanMethods = false
)
@EnableAsync
public class AsyncExecutionConfiguration
        implements AsyncConfigurer {
}
```

Essa annotation habilita o processamento de métodos `@Async`.

Não a coloque na classe de domínio.

---

### Proxy

O modo padrão de `@Async` utiliza proxy.

Fluxo:

```text
bean chamador;

proxy do bean async;

executor;

target method.
```

A chamada precisa atravessar o proxy.

---

### Self-invocation

Exemplo que não funciona:

```java
public void start() {
    processAsync();
}

@Async
public void processAsync() {
}
```

Quando os dois métodos pertencem ao mesmo objeto:

```text
this.processAsync()
```

não atravessa o proxy.

O método executa no thread chamador.

A baseline separa:

```text
bridge;

processor.
```

---

### Metodo publico em outro bean

Padrão seguro:

- bean Spring;
- método público;
- chamada externa ao bean;
- annotation explícita;
- executor nomeado.

Não esconda a fronteira assíncrona em método privado.

---

### @Async value

Use:

```java
@Async(
        "managedMessageAsyncExecutor"
)
```

Isso evita depender da escolha implícita quando existem vários executors.

O valor referencia o nome do bean.

---

### Executor default

Sem configuração explícita, o Spring procura um executor adequado.

O Spring Boot também pode auto-configurar um `AsyncTaskExecutor`.

A aula cria um bean próprio e nomeado.

O comportamento deixa de depender de resolução implícita.

---

### AsyncConfigurer

Implemente:

```text
AsyncConfigurer.
```

Métodos:

```text
getAsyncExecutor;

getAsyncUncaughtExceptionHandler.
```

Não estenda `AsyncConfigurerSupport`.

Essa classe de suporte está deprecated nas versões atuais.

---

### ThreadPoolTaskExecutor

`ThreadPoolTaskExecutor` adapta `ThreadPoolExecutor` ao ecossistema Spring.

Ele oferece:

- core pool;
- max pool;
- queue;
- keep alive;
- thread names;
- TaskDecorator;
- lifecycle;
- shutdown;
- rejeição.

---

### Core pool

Core:

```text
2.
```

Até duas tasks podem executar imediatamente em workers principais.

O valor deve considerar:

- workload;
- latência;
- CPU;
- conexões;
- downstream;
- volume.

Não copie o número para produção sem medição.

---

### Queue capacity

Fila:

```text
20.
```

Quando core threads estão ocupadas, tasks podem entrar na queue.

Uma fila enorme esconde saturação e aumenta latência.

Uma fila limitada torna a capacidade visível.

---

### Max pool

Max:

```text
4.
```

Com queue positiva, o executor cria threads acima do core quando a fila está cheia.

Sequência simplificada:

1. usa core threads;
2. enfileira;
3. cresce até max quando a fila enche;
4. rejeita quando pool e fila estão saturados.

---

### Keep alive

Threads acima do core podem encerrar depois de um período ocioso.

Baseline:

```text
30 segundos.
```

Core threads continuam por default.

---

### Rejection policy

A baseline usa:

```text
AbortPolicy.
```

Resultado:

```text
TaskRejectedException.
```

Rejeição precisa gerar:

- log seguro;
- métrica futura;
- teste;
- decisão de recuperação.

---

### CallerRunsPolicy

Essa policy executa a task no caller quando saturada.

Pode produzir backpressure.

Também pode:

- bloquear thread HTTP;
- executar no thread transacional;
- manter MDC diferente;
- aumentar latency;
- alterar a semântica.

Não será usada na baseline.

---

### Discard policies

Descartar task silenciosamente é incompatível com uma reação observável.

Não use:

- DiscardPolicy;
- DiscardOldestPolicy;

sem uma política formal de perda.

---

### Backpressure

Backpressure impede que produtores gerem trabalho ilimitado para consumidores lentos.

Um pool limitado com rejeição explicita é um mecanismo simples.

Ele não resolve retry nem durabilidade.

---

### AsyncExecutionProperties

Prefix:

```text
app.async.managed-message.
```

Campos:

```text
corePoolSize;

maxPoolSize;

queueCapacity;

keepAlive;

awaitTermination;

threadNamePrefix.
```

Validações:

- core positivo;
- max maior ou igual ao core;
- queue não negativa;
- durations positivas;
- prefix não blank.

---

### Builder versus instancia direta

O Spring Boot fornece builders para executors.

A baseline pode usar:

```text
ThreadPoolTaskExecutorBuilder.
```

Isso integra defaults e customizações do Boot.

Também é válido criar `ThreadPoolTaskExecutor` diretamente.

A aula escolhe o builder quando disponível e aplica todos os limites de forma explícita.

---

### TaskDecorator

`TaskDecorator` envolve o `Runnable` antes da execução.

Uso:

- copiar contexto;
- restaurar contexto;
- medir task;
- observabilidade.

Não use como estratégia principal de exception handling.

Future-based tasks podem envolver o runnable de forma que exceptions não sejam propagadas pelo `run`.

---

### MDC nao atravessa thread

MDC usa contexto associado ao thread.

Ao trocar de thread:

```text
o mapa nao aparece automaticamente.
```

A aula cria:

```text
MdcCopyingTaskDecorator.
```

---

### Contexto permitido

Copie somente:

- correlationId;
- apiVersion;
- environment.

Não copie:

- body;
- authorization;
- cookies;
- objeto request;
- user data;
- map arbitrário sem revisão.

---

### Captura e limpeza

No momento da submissão:

```text
capturar valores.
```

No worker:

1. salvar MDC anterior;
2. aplicar valores capturados;
3. executar;
4. restaurar contexto anterior no `finally`.

Isso evita vazamento entre tasks do pool.

---

### ContextPropagatingTaskDecorator

O Spring fornece um decorator voltado à propagação de contexto de observabilidade.

Ele possui overhead e é mais útil quando a aplicação utiliza a infraestrutura de context propagation.

A baseline mantém um decorator MDC explícito para tornar a política de keys visível.

---

### Transaction nao atravessa thread

Uma transaction Spring está ligada ao thread.

Quando o async processor executa:

```text
a transaction da request terminou.
```

Ela não é herdada.

Não acesse uma entity lazy carregada no thread anterior.

Não dependa do persistence context anterior.

---

### REQUIRES_NEW

O async processor chama outro bean:

```java
@Transactional(
        propagation =
                Propagation.REQUIRES_NEW
)
public void recordReceipt(
        Event event
) {
}
```

Essa nova transação pertence ao worker.

Ela possui commit e rollback próprios.

---

### @Transactional no mesmo bean

Self-invocation também afeta proxies transacionais.

Por isso:

```text
async processor;

receipt service.
```

são beans separados.

O processor não chama um método `this.record()` anotado.

---

### AFTER_COMMIT bridge

O bridge:

```java
@TransactionalEventListener(
        phase = AFTER_COMMIT
)
public void submit(
        ManagedRuntimeMessageChangedEvent event
) {
    processor.process(event);
}
```

A task somente é submetida depois de commit bem-sucedido.

Em rollback:

```text
zero submissao.
```

---

### Janela de perda

Existe uma janela entre:

```text
commit principal;

submissao;

execucao;

commit do recibo.
```

Um crash pode perder a reação.

A aplicação não oferece garantia durable.

Para isso, seria necessário outro mecanismo.

---

### Return type void

Método:

```java
@Async
public void process(...) {
}
```

O caller não recebe um handle.

Uma exception não pode ser devolvida diretamente.

Use:

```text
AsyncUncaughtExceptionHandler.
```

---

### AsyncUncaughtExceptionHandler

O handler recebe:

- Throwable;
- Method;
- arguments.

A baseline registra:

- event;
- method name;
- exception type;
- stack trace;
- correlation id do MDC quando disponível.

Não registra os arguments.

---

### Return type Future

Métodos async podem retornar:

```text
Future;

CompletableFuture.
```

O proxy fornece o handle assíncrono.

O target precisa retornar um handle compatível.

Exemplo:

```java
return CompletableFuture.completedFuture(
        result
);
```

---

### CompletableFuture

Benefícios:

- composição;
- callbacks;
- timeout;
- error handling;
- testing;
- result handle.

Exemplo:

```java
future
        .thenApply(...)
        .exceptionally(...);
```

Não bloqueie imediatamente com:

```text
join
```

se o objetivo era liberar o caller.

---

### Failure em CompletableFuture

A exception completa o future excepcionalmente.

O caller observa por:

- `join`;
- `get`;
- `handle`;
- `whenComplete`;
- `exceptionally`.

`AsyncUncaughtExceptionHandler` não é o mecanismo principal para methods com Future.

---

### Timeout

Use:

- `get(timeout)`;
- `orTimeout`;
- `completeOnTimeout`.

Timeout no caller não garante que a task parou.

Cancelamento e interrupção exigem cooperação do código executado.

---

### Cancellation

`future.cancel(true)` solicita cancelamento.

A task precisa responder à interrupção quando aplicável.

Não use cancellation como rollback distribuído.

---

### Graceful shutdown

Configuração:

```text
waitForTasksToCompleteOnShutdown=true;

awaitTerminationSeconds=15.
```

No shutdown normal, o executor tenta concluir tasks.

Depois do limite, a aplicação precisa prosseguir.

Isso não protege contra:

- kill -9;
- crash;
- perda de energia;
- restart abrupto;
- container eviction sem grace.

---

### Virtual threads

Virtual threads são adequadas para muitas operações bloqueantes.

Elas não eliminam:

- limite de conexões;
- rate limit externo;
- memória;
- transações;
- retry;
- rejeição de downstream;
- necessidade de semáforos.

A baseline testa uma fixture separada.

O executor oficial continua bounded.

---

### ThreadLocal e SecurityContext

ThreadLocal não atravessa automaticamente.

SecurityContext também exige uma estratégia quando Security existir.

A aplicação ainda não possui Spring Security.

Não crie propagação fictícia.

---

### RequestContextHolder

Não acesse:

```text
HttpServletRequest
```

no worker.

O request pode ter terminado.

Passe dados técnicos explicitamente ou por contexto controlado.

---

### Teste assíncrono

Não use:

```java
Thread.sleep(2000);
```

como assertion principal.

Use:

- `CountDownLatch`;
- `CompletableFuture`;
- polling com deadline;
- executor de teste;
- probe thread-safe.

---

### Executor sincrono em teste

Alguns testes podem substituir o executor por:

```text
SyncTaskExecutor.
```

Isso simplifica assertions de lógica.

Outros testes precisam do executor real para validar:

- thread switch;
- queue;
- rejection;
- MDC;
- shutdown.

Use os dois tipos conscientemente.

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

### 2. Criar migration V5

Tabela:

```sql
create table managed_runtime_message_async_receipt (
    id bigserial primary key,
    event_id uuid not null,
    resource_id bigint not null,
    resource_version bigint not null,
    event_type varchar(40) not null,
    processed_at timestamptz not null,
    processor_thread varchar(120) not null,
    correlation_id varchar(120),

    constraint uk_managed_message_async_receipt_event_id
        unique (event_id)
);
```

A tabela não é outbox.

---

### 3. Criar AsyncExecutionProperties

Prefix:

```text
app.async.managed-message.
```

Use record e Bean Validation.

---

### 4. Configurar valores por ambiente

Local e test usam capacidade pequena.

HML e production recebem valores externos com defaults operacionais conservadores.

Nenhum secret.

---

### 5. Criar MdcCopyingTaskDecorator

Copie somente keys permitidas.

Restaure o mapa anterior.

Trate mapa nulo.

---

### 6. Criar executor

Bean name:

```text
managedMessageAsyncExecutor.
```

Aplique:

- core;
- max;
- queue;
- keep alive;
- prefix;
- decorator;
- rejection;
- shutdown.

Inicialize pelo ciclo Spring.

---

### 7. Criar AsyncUncaughtExceptionHandler

Nome:

```text
ManagedMessageAsyncUncaughtExceptionHandler.
```

Logue uma vez.

Não inclua params.

---

### 8. Implementar AsyncConfigurer

Retorne o executor nomeado.

Retorne o exception handler.

Use interface direta.

---

### 9. Adicionar @EnableAsync

Mantenha a annotation na configuração.

Não espalhe em vários lugares.

---

### 10. Criar receipt entity

Mapeie V5.

Sem relation com a entity principal.

O recurso pode ter sido removido.

---

### 11. Criar receipt repository

Métodos:

```text
existsByEventId;

findByEventId;

countByEventId.
```

---

### 12. Criar receipt service

Use:

```text
REQUIRES_NEW.
```

Cheque eventId.

Insira uma linha.

Trate race pela constraint.

---

### 13. Criar async processor

Método público.

Outro bean.

Annotation com executor explícito.

Chame receipt service.

---

### 14. Criar after commit bridge

Use listener da fase AFTER_COMMIT.

Chame o processor.

Não anote o mesmo método com `@Async` nesta baseline.

A fronteira fica mais visível.

---

### 15. Preservar rollback

Evento de transação rollback não chega ao bridge AFTER_COMMIT.

Teste zero recibos.

---

### 16. Preservar no-op

No-op não publica evento.

Logo:

```text
zero tasks;
zero receipts.
```

---

### 17. Criar inspection service

Método de laboratório:

```java
@Async(
        "managedMessageAsyncExecutor"
)
public CompletableFuture<
        ManagedRuntimeMessageAsyncProcessingResult
> inspect(
        UUID eventId
) {
}
```

Retorne `completedFuture`.

---

### 18. Criar failure fixture

Faça inspection lançar.

Confirme future excepcional.

---

### 19. Testar self-invocation

Crie bean de fixture com chamada interna.

Confirme mesma thread.

Depois chame por outro bean.

Confirme thread async.

---

### 20. Testar thread name

Thread começa com:

```text
managed-message-async-.
```

Não fixe o número final.

---

### 21. Testar MDC

Envie correlation id.

Espere recibo.

Confirme valor.

Depois execute task sem contexto.

Confirme ausência de herança.

---

### 22. Testar void failure

Provoque exception no processor de fixture.

Confirme:

- handler chamado;
- method correto;
- stack trace uma vez;
- argumentos ausentes do log;
- request já concluída.

---

### 23. Testar CompletableFuture success

Use timeout no teste.

Confirme result e worker thread.

---

### 24. Testar CompletableFuture failure

Use `join`.

Confirme `CompletionException`.

Não espere AsyncUncaughtExceptionHandler.

---

### 25. Testar saturacao

Use tasks bloqueadas por latch.

Ocupe:

- core;
- queue;
- max.

Submeta uma task adicional.

Espere `TaskRejectedException`.

---

### 26. Testar rejection log

Confirme event:

```text
async.task.rejected.
```

Não logue o evento inteiro.

---

### 27. Testar CallerRuns fixture

Configure uma fixture separada.

Sature.

Confirme execução no thread caller.

Documente por que não é a baseline.

---

### 28. Testar transaction boundary

No bridge:

```text
transaction principal concluida.
```

No processor:

```text
nenhuma transaction herdada.
```

No receipt service:

```text
nova transaction ativa.
```

---

### 29. Testar idempotencia

Submeta o mesmo eventId duas vezes.

Espere uma linha.

Submeta eventIds distintos.

Espere duas.

---

### 30. Testar shutdown

Bloqueie uma task curta.

Feche o context.

Libere antes de 15 segundos.

Confirme conclusão.

Crie fixture que excede o limite.

Confirme shutdown não espera indefinidamente.

---

### 31. Testar virtual thread fixture

Ative:

```text
spring.threads.virtual.enabled=true.
```

Use executor auto-configurado em um context separado.

Confirme natureza virtual da thread quando suportado.

Não altere o executor oficial.

---

### 32. Criar metrics snapshot

Sem Actuator, exponha somente um componente interno de teste que leia:

- active count;
- pool size;
- queue size;
- completed task count.

Não crie endpoint público.

---

### 33. Criar ArchitectureTest

Valide:

- zero `new Thread`;
- zero common pool implícito;
- zero `CompletableFuture.runAsync` sem executor;
- um `@EnableAsync`;
- `@Async` em bean separado;
- executor name explícito;
- queue limitada;
- rejection explícita;
- TaskDecorator presente;
- zero Servlet no async processor;
- zero entity no event;
- REQUIRES_NEW em outro bean;
- zero Redis;
- zero broker;
- zero outbox.

---

### 34. Criar LiveServerIT

Use PostgreSQLContainer.

Fluxo:

1. POST v2;
2. capturar correlation id;
3. response retornar;
4. aguardar receipt;
5. validar thread;
6. validar correlation;
7. PUT real;
8. validar segundo receipt;
9. PUT no-op;
10. confirmar contagem;
11. rollback fixture;
12. confirmar zero receipt.

---

### 35. Criar documentacao

`spring-async-fundamentals.md` explica caller e worker.

`async-proxy-boundaries.md` documenta proxy.

`async-method-return-types.md` compara void e future.

`async-exception-handling.md` define handlers.

`thread-pool-sizing.md` documenta limites.

`async-queue-and-rejection.md` define saturation.

`async-task-decorator.md` documenta wrapper.

`async-mdc-propagation.md` cria whitelist.

`async-transaction-boundaries.md` registra REQUIRES_NEW.

`async-graceful-shutdown.md` define limites.

`async-virtual-threads.md` compara modelos.

`async-testing-strategy.md` proíbe sleep arbitrário.

`async-reliability-limitations.md` registra janela de perda.

`spring-async-baseline.md` consolida decisões.

---

### 36. Criar scripts

`183_testar_processamento_assincrono.ps1` cria e aguarda receipt.

`184_testar_propagacao_mdc_async.ps1` controla correlation id.

`185_testar_exception_void_async.ps1` ativa failure fixture.

`186_testar_completable_future.ps1` exercita result e failure.

`187_testar_saturacao_do_executor.ps1` bloqueia e satura.

`188_testar_shutdown_assincrono.ps1` fecha o context.

`189_executar_testes_async.ps1` executa a suite.

---

### 37. Executar properties e config

```powershell
.\mvnw.cmd `
  -Dtest=AsyncExecutionPropertiesTest,AsyncExecutorConfigurationTest test
```

---

### 38. Executar proxy e threads

```powershell
.\mvnw.cmd `
  -Dtest=AsyncProxyBoundaryTest,AsyncSelfInvocationTest,AsyncThreadSwitchTest test
```

---

### 39. Executar contexto

```powershell
.\mvnw.cmd `
  -Dtest=AsyncMdcPropagationTest,AsyncMdcCleanupTest,AsyncLoggingTest test
```

---

### 40. Executar exceptions e futures

```powershell
.\mvnw.cmd `
  -Dtest=AsyncVoidExceptionHandlerTest,AsyncCompletableFutureSuccessTest,AsyncCompletableFutureFailureTest test
```

---

### 41. Executar capacidade

```powershell
.\mvnw.cmd `
  -Dtest=AsyncExecutorSaturationTest,AsyncTaskRejectionTest,AsyncGracefulShutdownTest test
```

---

### 42. Executar transactions

```powershell
.\mvnw.cmd `
  -Dtest=AsyncTransactionBoundaryIT,AsyncEventAfterCommitIT,AsyncEventRollbackTest,AsyncReceiptIdempotencyIT,AsyncNoOpEventTest test
```

Docker precisa estar ativo.

---

### 43. Executar arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=AsyncArchitectureTest test
```

---

### 44. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=AsyncLiveServerIT test
```

---

### 45. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 46. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 47. Revisar escopo

Confirme:

```text
Async:
sim.

executor bounded:
sim.

MDC:
sim.

new transaction:
sim.

graceful shutdown:
sim.

reliability guarantee:
nao.

Redis:
zero.

cache:
zero.

rate limiting:
zero.
```

---

### 48. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- thread dumps;
- logs;
- receipts de teste;
- executor output;
- secret;
- Redis config;
- broker;
- outbox improvisada.

---

## Entendendo o que foi feito

### A fronteira async ficou visivel

Um bridge síncrono chama um processor em outro bean.

### O executor ganhou capacidade conhecida

Pool, queue e rejection não dependem de defaults ocultos.

### O contexto foi propagado com limite

Somente keys técnicas aprovadas atravessam o thread switch.

### A transacao ficou correta

O worker não herda a request e abre uma transação própria.

### A perda possível foi documentada

Execução em memória não substitui mensageria durável.

---

## Erros comuns importantes

### Anotar metodo chamado por this

A chamada não atravessa o proxy.

### Usar fila ilimitada

A saturação vira latência e consumo de memória escondidos.

### Esperar a transaction da request no worker

Transactions são associadas ao thread.

### Usar void sem exception handler

Falhas ficam sem caminho de observação adequado.

### Chamar join imediatamente

O caller volta a bloquear e perde o benefício.

---

## Comandos uteis

### Processamento async

```powershell
.\scripts\183_testar_processamento_assincrono.ps1
```

### MDC

```powershell
.\scripts\184_testar_propagacao_mdc_async.ps1
```

### Void exception

```powershell
.\scripts\185_testar_exception_void_async.ps1
```

### Saturacao

```powershell
.\scripts\187_testar_saturacao_do_executor.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Self-invocation

Mova o async method para o mesmo bean do caller.

Confirme mesma thread.

Restaure.

### Parte 2 — Queue ilimitada

Aumente a queue para um valor extremo.

Observe que max pool quase não é usado.

Restaure limite.

### Parte 3 — CallerRuns

Ative a policy em fixture.

Sature.

Confirme thread caller.

Restaure AbortPolicy.

### Parte 4 — MDC leak

Remova cleanup do decorator.

Execute duas tasks no mesmo worker.

Restaure.

### Parte 5 — Transaction herdada

Tente usar uma lazy entity no worker.

Observe falha ou acoplamento.

Volte ao payload mínimo.

### Parte 6 — Future timeout

Use `orTimeout`.

Confirme que timeout do caller não prova interrupção da task.

### Parte 7 — Shutdown

Ultrapasse o await termination.

Documente o resultado.

Não aumente sem critério.

### Parte 8 — ADR

Registre:

```text
@EnableAsync unico;

proxy mode;

bean separado;

executor nomeado;

core 2;

max 4;

queue 20;

AbortPolicy;

TaskDecorator com whitelist;

void com uncaught handler;

CompletableFuture para resultado;

AFTER_COMMIT bridge;

REQUIRES_NEW no worker;

shutdown 15 segundos;

virtual threads somente fixture;

sem garantia durable;

Redis na aula 388.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 386 foi preservada;
- o mesmo projeto foi continuado;
- síncrono e assíncrono foram diferenciados;
- concorrência e paralelismo foram diferenciados;
- `@EnableAsync` foi usado uma vez;
- configuração async ficou fora do domínio;
- proxy mode foi explicado;
- chamada precisa atravessar proxy;
- self-invocation foi testada;
- self-invocation não foi usada na baseline;
- método async ficou em outro bean;
- método async é público;
- executor foi nomeado;
- `@Async` referencia o nome do executor;
- resolução implícita não foi usada;
- `AsyncConfigurer` foi implementado;
- `AsyncConfigurerSupport` não foi usado;
- depreciação de AsyncConfigurerSupport foi reconhecida;
- `getAsyncExecutor` foi configurado;
- `getAsyncUncaughtExceptionHandler` foi configurado;
- `ThreadPoolTaskExecutor` foi usado;
- core pool foi configurado;
- max pool foi configurado;
- queue capacity foi configurada;
- keep alive foi configurado;
- thread name prefix foi configurado;
- core não é maior que max;
- fila não é ilimitada;
- sequência core, queue, max e rejection foi explicada;
- `AbortPolicy` foi usada;
- `TaskRejectedException` foi testada;
- CallerRunsPolicy foi explicada;
- CallerRunsPolicy não foi usada na baseline;
- discard policies não foram usadas;
- backpressure foi explicado;
- properties tipadas foram criadas;
- properties foram validadas;
- configuração por ambiente foi preservada;
- builder do Boot foi considerado;
- TaskDecorator foi usado;
- TaskDecorator não foi usado para tratar exceptions;
- MDC não atravessa thread automaticamente;
- whitelist de MDC foi criada;
- correlationId foi propagado;
- apiVersion foi propagada;
- environment foi propagado;
- body não foi propagado;
- Authorization não foi propagado;
- request object não foi propagado;
- contexto anterior do worker foi restaurado;
- cleanup ocorreu em finally;
- leak entre tasks foi testado;
- ContextPropagatingTaskDecorator foi explicado;
- decorator explícito foi mantido;
- transaction da request não foi herdada;
- persistence context não foi herdado;
- lazy entity não foi enviada;
- event payload mínimo foi preservado;
- async receipt service foi criado;
- `REQUIRES_NEW` foi usado em outro bean;
- self-invocation transacional não foi usada;
- bridge AFTER_COMMIT foi criado;
- task é submetida somente após commit;
- rollback não submete task;
- no-op não submete task;
- migration V5 foi criada;
- tabela de receipt foi criada;
- event_id possui unique constraint;
- receipt possui resource id;
- receipt possui resource version;
- receipt possui event type;
- receipt possui processedAt;
- receipt possui processor thread;
- correlation id é nullable;
- tabela não foi chamada de outbox;
- status de broker não foi criado;
- retry count não foi criado;
- janela de perda foi documentada;
- crash pode perder task;
- exactly once não foi prometido;
- idempotência de receipt foi criada;
- duplicate eventId gera uma linha;
- métodos void foram explicados;
- AsyncUncaughtExceptionHandler foi criado;
- handler não registra arguments;
- handler registra Throwable uma vez;
- methods Future foram explicados;
- CompletableFuture foi usado;
- target retorna completedFuture;
- success future foi testado;
- failure future foi testado;
- CompletionException foi observada;
- AsyncUncaughtExceptionHandler não foi usado para future;
- composição de future foi explicada;
- join imediato foi desencorajado;
- timeout foi explicado;
- timeout não foi confundido com cancelamento;
- cancellation foi explicada como cooperativa;
- graceful shutdown foi configurado;
- wait for tasks foi configurado;
- await termination foi configurado;
- shutdown não espera indefinidamente;
- crash abrupto foi diferenciado de shutdown normal;
- virtual threads foram explicadas;
- propriedade do Boot foi documentada;
- fixture virtual foi testada quando suportada;
- virtual threads não foram tratadas como capacidade infinita;
- executor bounded permaneceu baseline;
- RequestContextHolder não foi usado;
- SecurityContext propagation não foi inventada;
- teste não dependeu de sleep arbitrário;
- CountDownLatch foi usado;
- CompletableFuture foi usado em testes;
- polling possui deadline;
- SyncTaskExecutor foi usado somente onde adequado;
- executor real foi testado;
- saturation test foi criado;
- rejection test foi criado;
- thread switch foi testado;
- thread prefix foi testado;
- transaction boundary foi testada;
- AsyncExecutionPropertiesTest foi criado;
- AsyncExecutorConfigurationTest foi criado;
- AsyncProxyBoundaryTest foi criado;
- AsyncSelfInvocationTest foi criado;
- AsyncThreadSwitchTest foi criado;
- AsyncMdcPropagationTest foi criado;
- AsyncMdcCleanupTest foi criado;
- AsyncVoidExceptionHandlerTest foi criado;
- AsyncCompletableFutureSuccessTest foi criado;
- AsyncCompletableFutureFailureTest foi criado;
- AsyncExecutorSaturationTest foi criado;
- AsyncTaskRejectionTest foi criado;
- AsyncGracefulShutdownTest foi criado;
- AsyncTransactionBoundaryIT foi criado;
- AsyncEventAfterCommitIT foi criado;
- AsyncEventRollbackTest foi criado;
- AsyncReceiptIdempotencyIT foi criado;
- AsyncNoOpEventTest foi criado;
- AsyncLoggingTest foi criado;
- AsyncArchitectureTest foi criado;
- zero `new Thread` foi validado;
- zero common pool implícito foi validado;
- zero runAsync sem executor foi validado;
- zero Servlet no worker foi validado;
- AsyncLiveServerIT foi criado;
- PostgreSQL real foi preservado;
- documentação completa foi criada;
- scripts 183 a 189 foram criados;
- testes de config, proxy, contexto, exceptions, futures, capacidade, transactions, arquitetura, live, suite e package passaram;
- nenhum Redis, cache, rate limiting, broker, outbox, scheduler ou retry framework foi antecipado;
- ponte para a aula 388 está correta;
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
git commit -m "feat(m14): executar eventos com async controlado"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- thread dumps;
- logs;
- receipts de teste;
- secrets;
- Redis;
- broker;
- outbox;
- common pool.

---

## Fechamento e ponte para a proxima aula

Nesta aula, uma reação interna passou a executar fora do thread da request.

O fluxo consolidado ficou:

```text
transaction principal;

evento;

AFTER_COMMIT bridge;

proxy @Async;

executor bounded;

TaskDecorator;

worker thread;

REQUIRES_NEW;

async receipt;

log e cleanup.
```

Você comprovou:

```text
proxy boundary;

self-invocation;

thread switch;

pool e queue;

rejection;

MDC;

void exceptions;

CompletableFuture;

transaction nova;

rollback sem task;

no-op sem task;

idempotencia;

shutdown;

limite de confiabilidade.
```

A decisão central foi:

```text
@Async apenas muda
o ponto de execucao;

a solucao profissional exige
executor limitado,
contexto controlado,
falha observavel,
transaction explicita,
shutdown testado
e uma declaracao honesta
sobre perda de tasks.
```

A próxima aula será:

```text
388 - M14.33 - Cache com Spring Redis
```

Nela, você continuará no mesmo projeto e estudará:

- cache;
- custo de leitura;
- cache-aside;
- Spring Cache;
- `@EnableCaching`;
- `@Cacheable`;
- `@CachePut`;
- `@CacheEvict`;
- Redis;
- Spring Data Redis;
- serializers;
- keys;
- namespaces;
- TTL;
- cache manager;
- profiles;
- Testcontainers Redis;
- cache hit;
- cache miss;
- invalidation;
- create;
- update;
- delete;
- stale data;
- null caching;
- stampede;
- sync;
- métricas;
- falhas do Redis;
- testes;
- limites antes de rate limiting.

A aula 387 respondeu:

```text
como executar reacoes
em outro thread
com controle operacional?
```

A aula 388 responderá:

```text
como evitar leituras repetidas
sem transformar o cache
em fonte de verdade
ou servir dados obsoletos?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei explicar proxy, self-invocation e executor nomeado.
- [ ] Sei dimensionar pool, queue e rejection conscientemente.
- [ ] Sei propagar e limpar MDC com TaskDecorator.
- [ ] Sei tratar void, CompletableFuture e transactions assíncronas.
- [ ] Sei declarar as limitações de confiabilidade do processamento em memória.

---

## Troubleshooting adicional

### Metodo @Async executa no mesmo thread

Confirme chamada externa ao proxy e bean separado.

### Max pool nunca cresce

Uma fila grande absorve as tasks antes do crescimento.

### Correlation ID desaparece

Confirme TaskDecorator no executor selecionado.

### Transaction nao esta ativa

O worker precisa abrir sua própria transaction.

### Exception void nao aparece

Confirme AsyncUncaughtExceptionHandler e proxy.

### Shutdown perde tasks

Revise wait policy, await termination e natureza não durável.

---

## Perguntas de revisao

1. O que `@EnableAsync` habilita?
2. Como `@Async` funciona por default?
3. Por que self-invocation falha?
4. Qual executor foi usado?
5. Qual core pool?
6. Qual max pool?
7. Qual queue capacity?
8. Qual rejection policy?
9. CallerRuns foi usado?
10. Para que serve TaskDecorator?
11. MDC atravessa thread automaticamente?
12. Transaction atravessa thread?
13. Onde a nova transaction é aberta?
14. Quando o bridge submete a task?
15. Void exception é tratada por quem?
16. Failure de CompletableFuture aparece onde?
17. Timeout interrompe a task necessariamente?
18. A task é durável?
19. Redis foi adicionado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Processamento de methods async.
2. Por proxy.
3. A chamada não atravessa o proxy.
4. ThreadPoolTaskExecutor nomeado.
5. Dois.
6. Quatro.
7. Vinte.
8. AbortPolicy.
9. Não.
10. Propagar e restaurar contexto.
11. Não.
12. Não.
13. No receipt service REQUIRES_NEW.
14. Depois do commit.
15. AsyncUncaughtExceptionHandler.
16. No future excepcional.
17. Não.
18. Não.
19. Não.
20. Cache com Spring Redis.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 387 - M14.32 - Async no Spring

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei execução síncrona, concorrência e paralelismo.
- Habilitei `@EnableAsync`.
- Entendi o proxy usado por `@Async`.
- Testei e evitei self-invocation.
- Mantive o método async público em outro bean.
- Criei um executor nomeado para a feature.
- Implementei `AsyncConfigurer`.
- Não usei `AsyncConfigurerSupport` deprecated.
- Configurei `ThreadPoolTaskExecutor`.
- Defini core pool 2, max pool 4 e queue 20.
- Usei thread prefix controlado.
- Adotei `AbortPolicy` para rejeição explícita.
- Comparei `CallerRunsPolicy` sem adotá-la.
- Criei properties tipadas para o executor.
- Criei `MdcCopyingTaskDecorator`.
- Propaguei somente correlationId, API version e environment.
- Limpei o MDC depois de cada task.
- Criei um bridge AFTER_COMMIT.
- Submeti tasks somente após commit.
- Mantive rollback e no-op sem task.
- Criei um async processor.
- Abri uma nova transaction `REQUIRES_NEW` no worker.
- Criei migration V5 e recibos idempotentes por eventId.
- Tratei exceptions de métodos void com `AsyncUncaughtExceptionHandler`.
- Estudei retorno `CompletableFuture`.
- Testei success, failure, timeout e cancellation conceitual.
- Testei saturação e `TaskRejectedException`.
- Configurei graceful shutdown com limite.
- Estudei virtual threads sem trocar a baseline bounded.
- Documentei a janela de perda de tasks em memória.
- Não prometi entrega durável ou exactly once.
- Não adicionei Redis, cache, broker ou outbox.
- Próxima aula: Cache com Spring Redis.
```

---

## Referencia tecnica curta

```text
EnableAsync:
ativacao.

Async:
proxy.

Executor:
capacidade.

Pool:
workers.

Queue:
espera.

Rejection:
limite.

Decorator:
contexto.

Future:
resultado.

Transaction:
nova.

Shutdown:
encerramento.
```

Regra final:

```text
execucao assíncrona com Spring deve atravessar um proxy e usar um executor explicitamente nomeado e limitado; pool, queue, rejection e shutdown precisam ser configurados e testados, contexto deve ser propagado por TaskDecorator com whitelist e cleanup, exceptions de methods void devem seguir um AsyncUncaughtExceptionHandler enquanto results e failures de CompletableFuture permanecem no future, transactions nao atravessam threads e exigem uma nova boundary explicita em outro bean, e tasks mantidas apenas em memoria devem ser tratadas como nao duraveis, sem serem confundidas com outbox ou mensageria confiavel.
```
