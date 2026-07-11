# 386 - M14.31 - Eventos internos Spring

## Apresentacao da aula

Na aula 385, você organizou as preocupações transversais do ciclo HTTP.

A aplicação passou a possuir uma cadeia explícita:

```text
container;

CorrelationIdFilter;

ApiVersionLifecycleFilter;

ApiWriteTrafficGateFilter;

DispatcherServlet;

HandlerMapping;

ApiHandlerContextInterceptor;

IfMatchRequiredInterceptor;

controller;

interceptors em ordem inversa;

filters em ordem inversa.
```

Essa estrutura resolveu:

- ordem de filters;
- short-circuit;
- Problem Details fora do MVC;
- metadata do handler;
- precondition `If-Match`;
- separação entre fronteira Servlet e pipeline MVC.

Agora a atenção volta para dentro da aplicação.

Considere o caso de uso de criação de uma mensagem gerenciada.

Hoje, o fluxo pode ser resumido assim:

```text
controller;

application service;

repository port;

JPA;

PostgreSQL;

response.
```

Uma nova necessidade interna surge.

Sempre que uma mensagem for:

- criada;
- realmente substituída;
- removida;

a aplicação deve:

1. registrar uma projeção interna de auditoria;
2. produzir um log pós-commit;
3. permitir que outros componentes internos reajam no futuro;
4. manter o caso de uso sem dependência direta de cada reação.

Uma abordagem direta seria injetar todas as reações no application service.

Exemplo ruim:

```java
repository.save(message);

auditService.record(message);

notificationService.notify(message);

statisticsService.increment(message);

searchProjectionService.refresh(message);
```

Esse desenho cria um acoplamento crescente.

O caso de uso passa a conhecer:

- auditoria;
- estatística;
- projeção;
- notificação;
- observabilidade;
- ordem de chamadas;
- política de falha de cada reação.

A cada nova reação, o service muda.

A pergunta central desta aula será:

```text
como desacoplar reacoes internas
a uma operacao da aplicacao
sem transformar chamadas diretas
em dependencias ocultas?
```

A solução utilizará eventos internos do Spring.

Componentes principais:

```text
ApplicationEventPublisher;

@EventListener;

@TransactionalEventListener;

TransactionPhase;

@Order;

eventos imutaveis;

listeners pequenos;

testes de publicacao;

testes de fases transacionais.
```

A baseline publicará um evento de aplicação após mudanças reais no recurso.

Eventos:

```text
ManagedRuntimeMessageCreatedEvent;

ManagedRuntimeMessageReplacedEvent;

ManagedRuntimeMessageDeletedEvent.
```

Todos implementarão uma interface selada:

```text
ManagedRuntimeMessageChangedEvent.
```

O payload será mínimo.

Campos comuns:

```text
eventId;

occurredAt;

resourceId;

resourceVersion;

changeType.
```

O evento de replacement também poderá carregar:

```text
previousVersion.
```

Nenhum evento carregará:

- entity JPA;
- aggregate mutável;
- DTO web;
- request;
- response;
- `value`;
- `message`;
- `description`;
- password;
- token;
- header HTTP;
- `HttpServletRequest`;
- `ProblemDetail`.

A publicação ocorrerá dentro da transação do application service.

Fluxo de criação:

```text
validar command;

criar dominio;

persistir;

obter id e version;

publicar evento;

retornar resultado;

commit.
```

Com o multicaster padrão e sem executor customizado, os listeners regulares executam no mesmo thread.

Isso permite demonstrar um comportamento importante.

Um listener síncrono escreverá uma projeção de auditoria:

```text
managed_runtime_message_event_audit.
```

Essa escrita participará da mesma transação.

Se o listener falhar:

```text
a criacao principal tambem faz rollback.
```

Esse comportamento será testado.

Outro listener utilizará:

```text
@TransactionalEventListener(
    phase = AFTER_COMMIT
).
```

Ele registrará uma observação pós-commit.

Ele não alterará entity nem escreverá no banco.

Depois do commit, resources transacionais podem ainda parecer acessíveis, mas uma nova escrita não deve ser presumida como parte de uma transação válida.

Quando uma reação pós-commit precisa persistir:

```text
nova transacao explicita;

ou outbox;

ou mensageria.
```

Nenhuma dessas estratégias será implementada nesta aula.

A aula 387 será:

```text
387 - M14.32 - Async no Spring
```

Por isso, todos os listeners desta aula serão síncronos.

Não serão usados:

- `@Async`;
- `TaskExecutor`;
- virtual threads para listeners;
- pool customizado;
- retry assíncrono;
- fila interna;
- Kafka;
- RabbitMQ;
- Redis Streams;
- outbox;
- mensageria externa.

A aula também exercitará as fases:

```text
BEFORE_COMMIT;

AFTER_COMMIT;

AFTER_ROLLBACK;

AFTER_COMPLETION.
```

Essas fases serão observadas por listeners de laboratório e testes.

A produção manterá apenas listeners que tenham responsabilidade clara.

A regra principal será:

```text
evento informa um fato;

listener reage ao fato;

regra essencial do caso de uso
nao deve ficar escondida
em um listener opcional.
```

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
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

387:
Async no Spring.

388:
Cache com Spring Redis.
```

A aula 385 respondeu:

```text
quando usar filter
e quando usar interceptor?
```

A aula 386 responderá:

```text
quando publicar um evento interno,
como escutar esse evento
e como alinhar a reacao
ao resultado da transacao?
```

Nesta aula:

```text
ApplicationEventPublisher:
sim.

@EventListener:
sim.

@TransactionalEventListener:
sim.

eventos imutaveis:
sim.

event interface:
sim.

multiplos listeners:
sim.

ordem:
sim.

listener sincrono:
sim.

rollback por listener:
sim.

BEFORE_COMMIT:
sim.

AFTER_COMMIT:
sim.

AFTER_ROLLBACK:
sim.

AFTER_COMPLETION:
sim.

fallbackExecution:
sim.

idempotencia:
sim.

auditoria interna:
sim.

@Async:
nao.

outbox:
nao.

mensageria:
nao.

Redis:
nao.
```

A regra central será:

```text
eventos desacoplam reacoes,
mas nao devem esconder
a consistencia essencial
do caso de uso.
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
│       ├── ManagedRuntimeMessageApplicationService.java
│       └── event
│           ├── ManagedRuntimeMessageChangedEvent.java
│           ├── ManagedRuntimeMessageChangeType.java
│           ├── ManagedRuntimeMessageCreatedEvent.java
│           ├── ManagedRuntimeMessageReplacedEvent.java
│           ├── ManagedRuntimeMessageDeletedEvent.java
│           ├── ManagedRuntimeMessageEventFactory.java
│           └── listener
│               ├── ManagedRuntimeMessageAuditProjectionListener.java
│               ├── ManagedRuntimeMessageAfterCommitLogListener.java
│               ├── ManagedRuntimeMessageRollbackLogListener.java
│               └── ManagedRuntimeMessageCompletionLogListener.java
├── infrastructure
│   └── persistence
│       └── jpa
│           └── audit
│               ├── ManagedRuntimeMessageEventAuditJpaEntity.java
│               ├── ManagedRuntimeMessageEventAuditRepository.java
│               └── ManagedRuntimeMessageEventAuditMapper.java
└── shared
    └── event
        ├── EventIdGenerator.java
        └── EventClock.java
```

Migration:

```text
src/main/resources/db/migration
└── V4__create_managed_runtime_message_event_audit.sql
```

Testes:

```text
src/test/java/br/com/formacao/backend/event
├── ManagedRuntimeMessageEventPayloadTest.java
├── ManagedRuntimeMessageEventFactoryTest.java
├── ManagedRuntimeMessageEventPublicationTest.java
├── ManagedRuntimeMessageNoOpEventTest.java
├── ManagedRuntimeMessageDeletedEventSnapshotTest.java
├── ManagedRuntimeMessageSynchronousListenerTest.java
├── ManagedRuntimeMessageListenerRollbackIT.java
├── ManagedRuntimeMessageListenerOrderTest.java
├── ManagedRuntimeMessageBeforeCommitListenerTest.java
├── ManagedRuntimeMessageAfterCommitListenerTest.java
├── ManagedRuntimeMessageAfterRollbackListenerTest.java
├── ManagedRuntimeMessageAfterCompletionListenerTest.java
├── ManagedRuntimeMessageFallbackExecutionTest.java
├── ManagedRuntimeMessageAuditIdempotencyIT.java
├── ManagedRuntimeMessageApplicationEventsTest.java
├── ManagedRuntimeMessageEventLoggingTest.java
├── ManagedRuntimeMessageEventArchitectureTest.java
└── ManagedRuntimeMessageEventLiveServerIT.java
```

Documentação:

```text
docs
├── spring-application-events.md
├── application-event-publisher.md
├── event-payload-design.md
├── event-listener-synchronism.md
├── event-listener-ordering.md
├── transactional-event-listener.md
├── transaction-event-phases.md
├── event-listener-failure-policy.md
├── event-idempotency.md
├── event-observability.md
├── internal-events-vs-messaging.md
└── spring-events-baseline.md
```

Scripts:

```text
scripts
├── 176_testar_evento_de_criacao.ps1
├── 177_testar_evento_de_substituicao.ps1
├── 178_testar_evento_de_exclusao.ps1
├── 179_testar_rollback_por_listener.ps1
├── 180_testar_fases_transacionais.ps1
├── 181_testar_idempotencia_de_listener.ps1
└── 182_executar_testes_eventos_spring.ps1
```

Resultados esperados:

```text
create:
um evento CREATED.

replace real:
um evento REPLACED.

replace no-op:
zero eventos.

delete:
um evento DELETED.

listener sincrono:
mesma thread.

falha do listener sincrono:
rollback total.

audit row:
mesma transacao.

eventId duplicado:
uma linha.

AFTER_COMMIT:
somente em commit.

AFTER_ROLLBACK:
somente em rollback.

AFTER_COMPLETION:
commit e rollback.

sem transacao:
listener transacional nao executa.

fallbackExecution true:
executa sem transacao.

@Async:
zero.
```

---

## Conceito essencial

### Evento interno

Um evento interno representa algo que ocorreu dentro da aplicação.

Exemplo:

```text
Managed runtime message created.
```

O evento não é uma ordem.

Compare:

```text
CreateManagedRuntimeMessageCommand:
intencao.

ManagedRuntimeMessageCreatedEvent:
fato.
```

Commands usam verbo no imperativo ou intenção.

Events usam fato no passado.

---

### Evento de aplicacao

Nesta aula, os eventos são eventos de aplicação.

Eles informam que um caso de uso produziu uma mudança persistente candidata a commit.

O publisher fica no application service.

O domínio permanece sem Spring.

---

### Evento de dominio

Um evento de domínio representa um fato relevante do modelo de negócio.

Ele pode nascer dentro do aggregate.

Exemplo genérico:

```text
OrderPaid.
```

A feature atual é simples.

Não existe necessidade de armazenar uma coleção de domain events no aggregate.

Não crie infraestrutura de domain events somente pelo nome.

---

### ApplicationEventPublisher

Injete:

```java
private final ApplicationEventPublisher
        eventPublisher;
```

Publique:

```java
eventPublisher.publishEvent(
        event
);
```

O método aceita:

- `ApplicationEvent`;
- qualquer objeto.

Quando um objeto comum é publicado, o Spring o envolve internamente em um `PayloadApplicationEvent`.

Os records desta aula não precisam estender `ApplicationEvent`.

---

### Publicacao e entrega

`publishEvent` entrega o evento ao multicaster.

A chamada não deve ser interpretada como garantia universal de execução síncrona.

A estratégia depende do multicaster e dos listeners.

Na baseline:

```text
multicaster default;

sem TaskExecutor;

listeners regulares sincronamente
no thread do publisher.
```

A aula 387 alterará conscientemente essa premissa para listeners específicos.

---

### Evento imutavel

Use records.

Exemplo:

```java
public record ManagedRuntimeMessageCreatedEvent(
        UUID eventId,
        Instant occurredAt,
        long resourceId,
        long resourceVersion
) implements ManagedRuntimeMessageChangedEvent {

    @Override
    public ManagedRuntimeMessageChangeType
            changeType() {
        return ManagedRuntimeMessageChangeType.CREATED;
    }
}
```

Nenhum setter.

Nenhuma entity mutável.

---

### Interface selada

Exemplo:

```java
public sealed interface
        ManagedRuntimeMessageChangedEvent
        permits
        ManagedRuntimeMessageCreatedEvent,
        ManagedRuntimeMessageReplacedEvent,
        ManagedRuntimeMessageDeletedEvent {

    UUID eventId();

    Instant occurredAt();

    long resourceId();

    long resourceVersion();

    ManagedRuntimeMessageChangeType
            changeType();
}
```

A hierarquia é fechada e conhecida.

---

### Payload minimo

Inclua apenas o necessário para listeners legítimos.

Não carregue o objeto completo por conveniência.

Benefícios:

- menor acoplamento;
- menor risco de dados sensíveis;
- serialização futura mais simples;
- listeners independentes da entity;
- teste mais estável.

---

### EventId

Cada evento recebe:

```text
UUID.
```

Ele identifica a ocorrência, não o recurso.

O mesmo recurso pode produzir vários eventos.

Use:

```text
eventId
```

para idempotência de listeners.

---

### occurredAt

Use `Instant`.

Não calcule com `Instant.now()` espalhado.

Injete:

```text
Clock
```

ou um `EventClock`.

Testes utilizam clock fixo.

---

### resourceVersion

A versão do recurso permite:

- identificar a mudança;
- ordenar eventos do mesmo recurso;
- investigar concorrência;
- validar projeções.

Ela não substitui `eventId`.

---

### Evento de exclusao

Depois da exclusão, o recurso não pode ser recarregado.

O evento precisa carregar o snapshot mínimo antes de a referência desaparecer.

Campos:

```text
resourceId;

lastResourceVersion.
```

Não carregue o valor textual.

---

### Event factory

`ManagedRuntimeMessageEventFactory` cria:

- UUID;
- timestamp;
- tipo correto;
- versions.

O service não monta records manualmente em vários pontos.

---

### Quando publicar

Publique depois que a operação principal retornou sucesso.

Create:

```text
depois de save e flush necessario.
```

Replace:

```text
depois da nova version estar conhecida.
```

Delete:

```text
depois do repository aceitar a exclusao,
ainda dentro da transacao.
```

Não publique antes da validação.

---

### No-op

PUT ou PATCH sem mudança real não produz um novo fato.

Resultado:

```text
zero eventos.
```

O log `managed_message.noop` pode continuar existindo.

Evento e log não possuem a mesma finalidade.

---

### Operacao que falha

Cenários:

- validation;
- not found;
- conflict;
- stale ETag;
- database error antes da mudança.

Resultado:

```text
nenhum evento de sucesso.
```

Não publique “created” antes de saber o resultado.

---

### @EventListener

Exemplo:

```java
@EventListener
public void on(
        ManagedRuntimeMessageChangedEvent event
) {
}
```

O método pode receber a interface e reagir a todos os tipos.

Também pode receber um record específico.

---

### Listener sincrono

Com a baseline atual:

```text
publisher chama multicaster;

multicaster chama listener;

listener retorna;

publisher retorna.
```

A exception do listener volta ao publisher.

Isso cria acoplamento temporal e de falha.

O publisher não conhece a classe, mas depende do resultado da reação.

---

### Falha de listener

Se um listener síncrono lança exception dentro da transação:

```text
a exception propaga;

a transacao marca rollback;

o controller recebe erro;

a mudanca principal nao confirma.
```

Use esse comportamento somente quando a reação faz parte da consistência necessária.

---

### Auditoria na mesma transacao

O listener:

```text
ManagedRuntimeMessageAuditProjectionListener.
```

insere uma linha em:

```text
managed_runtime_message_event_audit.
```

A linha inclui:

- eventId;
- resourceId;
- resourceVersion;
- eventType;
- occurredAt;
- recordedAt.

Se a auditoria for obrigatória, o rollback conjunto é desejado.

---

### Hidden coupling

Embora o publisher não injete o listener, uma falha do listener afeta o caso de uso.

Isso é coupling implícito.

A documentação deve declarar:

```text
auditoria sincronica
e parte da consistencia da operacao.
```

Não use eventos para esconder uma dependência obrigatória sem contrato.

---

### Multiplos listeners

Um evento pode ter:

- audit listener;
- log listener;
- metric listener;
- projection listener.

Cada listener deve ter uma responsabilidade.

Não crie um listener “god object”.

---

### @Order

Use:

```java
@Order(100)
```

para controlar listeners do mesmo evento quando a ordem operacional é necessária.

Valores menores executam primeiro.

Não use ordem para criar uma cadeia secreta.

Se listener B depende do output de A, considere:

- chamada explícita;
- um único listener coordenador;
- outro evento claramente publicado.

---

### Retorno de @EventListener

Um listener síncrono pode retornar outro evento.

A baseline não usará esse recurso.

Publicar outro evento explicitamente é mais legível:

```java
eventPublisher.publishEvent(
        followUpEvent
);
```

Listeners assíncronos não podem usar retorno para publicar evento subsequente.

Esse tema será retomado na aula 387.

---

### Condicao do listener

`@EventListener` aceita condição SpEL.

Exemplo conceitual:

```text
condition =
    "#event.changeType().name() == 'CREATED'".
```

A baseline prefere tipos específicos ou `if` explícito.

Strings SpEL escondem regras e dificultam refactoring.

---

### TransactionalEventListener

Use quando a reação precisa depender da conclusão da transação.

Exemplo:

```java
@TransactionalEventListener(
        phase =
                TransactionPhase.AFTER_COMMIT
)
public void onCommitted(
        ManagedRuntimeMessageChangedEvent event
) {
}
```

A fase default é:

```text
AFTER_COMMIT.
```

A baseline declara a fase explicitamente.

---

### BEFORE_COMMIT

Executa antes do commit.

Pode falhar e provocar rollback.

Use para uma reação que precisa ocorrer ainda dentro da transação, mas cuja execução deve ser alinhada à fase de commit.

A auditoria principal desta aula usa listener regular síncrono para demonstrar o comportamento básico.

Um listener de laboratório exercita BEFORE_COMMIT.

---

### AFTER_COMMIT

Executa depois de commit bem-sucedido.

Não executa em rollback.

Uso da baseline:

```text
log de commit confirmado.
```

Ele não grava dados.

---

### Escrita em AFTER_COMMIT

Depois do commit, recursos podem ainda estar acessíveis.

Entretanto, alterações feitas usando esses resources não participam de outro commit automaticamente.

Não faça:

```java
@TransactionalEventListener(
        phase = AFTER_COMMIT
)
public void write(
        Event event
) {
    repository.save(...);
}
```

esperando persistência automática.

Para uma nova escrita:

```text
REQUIRES_NEW explicitamente;

ou mensageria;

ou outbox.
```

Nesta aula, nenhuma nova transação será criada.

---

### Restricao de @Transactional

Em versões atuais do Spring, um método com `@TransactionalEventListener` que também declara `@Transactional` precisa usar uma propagação permitida para esse contexto, como:

```text
REQUIRES_NEW;

NOT_SUPPORTED.
```

A baseline não anota os listeners pós-commit com `@Transactional`.

---

### AFTER_ROLLBACK

Executa somente quando a transação faz rollback.

Uso:

- observação;
- logging;
- cleanup externo cuidadosamente projetado.

Não use para “desfazer” manualmente alterações do mesmo banco.

O rollback já faz isso.

---

### AFTER_COMPLETION

Executa após commit ou rollback.

Use quando a reação independe do resultado final, mas precisa saber que a transação terminou.

O listener pode registrar o phase outcome obtido pelo contexto de teste.

Não use para inferir commit sem informação adicional.

---

### fallbackExecution

Por default, um transactional listener não executa quando o evento é publicado fora de uma transação.

Configuração:

```java
fallbackExecution = true
```

faz o listener executar mesmo sem transaction.

Isso altera a semântica.

A baseline production mantém:

```text
false.
```

Um listener de laboratório demonstra o comportamento.

---

### Evento fora de transacao

Teste com um publisher chamado fora de `@Transactional`.

Resultado:

```text
@EventListener:
executa.

@TransactionalEventListener:
nao executa,
salvo fallback.
```

Essa diferença precisa ser conhecida.

---

### Idempotencia de listener

Mesmo eventos internos podem ser publicados duas vezes por:

- bug;
- retry futuro;
- replay de teste;
- nova infraestrutura;
- evolução para mensageria.

A auditoria possui:

```text
unique(event_id).
```

O listener verifica se o eventId já foi processado.

A constraint é a garantia final.

---

### Exactly once

A aplicação não promete exactly once.

Ela oferece:

```text
idempotencia observavel
para o listener de auditoria.
```

“Exactly once” exige definir:

- origem;
- entrega;
- persistência;
- retry;
- falhas;
- boundaries.

Não use o termo de forma vaga.

---

### Event log versus audit table

Log:

- operacional;
- agregável;
- pode possuir retenção curta;
- não é estado transacional.

Audit table:

- persistida;
- consultável;
- vinculada ao eventId;
- participa da transaction.

Uma não substitui automaticamente a outra.

---

### Evento interno versus mensageria

Evento interno:

- mesmo processo;
- mesmo ApplicationContext;
- disponibilidade conjunta;
- baixo overhead;
- sem durabilidade independente.

Mensageria:

- processo separado;
- broker;
- entrega;
- retry;
- observabilidade própria;
- schema público;
- maior complexidade.

Esta aula permanece interna.

---

### Evento interno versus outbox

Outbox grava uma mensagem pendente na mesma transação da mudança e a publica depois.

Ela resolve uma parte do dual write.

A tabela de auditoria desta aula não é outbox.

Ela não possui:

- status de publicação;
- retry count;
- broker destination;
- dispatcher;
- claim;
- dead letter.

---

### Observabilidade de eventos

Logs permitidos:

- eventId;
- eventType;
- resourceId;
- resourceVersion;
- listener;
- phase;
- outcome;
- duration.

Não registrar payload sensível.

O correlation ID permanece no MDC para listeners síncronos do request.

Não o coloque no evento por dependência HTTP.

---

### Testes com ApplicationEvents

Spring Test oferece:

```text
@RecordApplicationEvents.
```

O teste recebe:

```text
ApplicationEvents.
```

Ele pode:

- contar eventos;
- filtrar por tipo;
- inspecionar payload;
- confirmar ausência.

Isso é mais confiável que testar somente logs.

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

### 2. Criar migration V4

Arquivo:

```text
V4__create_managed_runtime_message_event_audit.sql.
```

Tabela:

```sql
create table managed_runtime_message_event_audit (
    id bigserial primary key,
    event_id uuid not null,
    resource_id bigint not null,
    resource_version bigint not null,
    event_type varchar(40) not null,
    occurred_at timestamptz not null,
    recorded_at timestamptz not null,

    constraint uk_managed_message_event_audit_event_id
        unique (event_id),

    constraint ck_managed_message_event_audit_type
        check (
            event_type in (
                'CREATED',
                'REPLACED',
                'DELETED'
            )
        )
);
```

---

### 3. Criar ChangeType

Enum:

```text
CREATED;

REPLACED;

DELETED.
```

Não use string livre.

---

### 4. Criar interface selada

Defina os campos comuns.

Não importe Spring.

---

### 5. Criar records de evento

Valide:

- eventId não nulo;
- occurredAt não nulo;
- id positivo;
- version não negativa;
- previousVersion coerente no replacement.

---

### 6. Criar EventClock

Adapter simples baseado em:

```text
Clock.
```

Testes usam fixed clock.

---

### 7. Criar EventIdGenerator

Production:

```text
UUID.randomUUID().
```

Testes injetam sequência determinística.

---

### 8. Criar EventFactory

Métodos:

```text
created;

replaced;

deleted.
```

Centralize metadata.

---

### 9. Injetar publisher no service

Use constructor injection.

Não injete listeners.

---

### 10. Publicar create

Depois do save.

Confirme id e version definitivos.

---

### 11. Publicar replace real

Capture previousVersion.

Publique somente quando houve mudança.

---

### 12. Preservar no-op

No branch de no-op:

```text
nao publicar.
```

Teste explicitamente.

---

### 13. Publicar delete

Capture snapshot mínimo.

Delete.

Publique evento ainda dentro da transação.

---

### 14. Não publicar em falha

Revise todos os early returns e exceptions.

---

### 15. Criar audit entity

Mapeie a tabela V4.

Nenhuma relation com a entity principal é necessária.

O recurso pode estar deletado.

---

### 16. Criar audit repository

Métodos:

```text
existsByEventId;

countByEventId.
```

A unique constraint permanece obrigatória.

---

### 17. Criar audit listener

Use:

```java
@Component
@Order(100)
```

Método:

```java
@EventListener
public void record(
        ManagedRuntimeMessageChangedEvent event
) {
}
```

Insira a linha na mesma transaction.

---

### 18. Implementar idempotencia

Quando eventId já existe:

```text
return.
```

Trate race pela constraint.

Não engula qualquer DataIntegrityViolationException sem verificar a causa.

---

### 19. Criar after commit logger

Use:

```java
@TransactionalEventListener(
        phase = AFTER_COMMIT
)
```

Logue eventId, type, id e version.

Sem repository save.

---

### 20. Criar rollback logger

Use:

```text
AFTER_ROLLBACK.
```

Nível:

```text
WARN ou INFO conforme policy.
```

A baseline usa INFO com outcome `ROLLED_BACK`.

---

### 21. Criar completion logger

Use:

```text
AFTER_COMPLETION.
```

Evite duplicar stack trace.

O evento registra somente término.

---

### 22. Criar probes de fase em test source

Mantenha listeners de laboratório em:

```text
src/test/java.
```

Eles contam invocações.

Não polua production com classes de teste.

---

### 23. Criar failure fixture

Listener de teste lança exception para um eventId conhecido.

Confirme rollback da entity e da audit row.

---

### 24. Criar order test

Dois listeners de teste com:

```text
@Order(10);

@Order(20).
```

Confirme ordem.

Depois documente que correctness não depende dela.

---

### 25. Criar fallback fixture

Um listener transacional com:

```text
fallbackExecution=true.
```

Publique fora de transaction.

Confirme execução.

Production listeners continuam false.

---

### 26. Criar EventPayloadTest

Use reflection ou architecture assertions.

Confirme ausência de:

- entity;
- DTO;
- String de conteúdo;
- Servlet;
- Spring event base;
- mutable collection.

---

### 27. Criar EventPublicationTest

Use:

```text
@RecordApplicationEvents.
```

Execute create.

Filtre `ManagedRuntimeMessageCreatedEvent`.

Espere um.

---

### 28. Testar replace

Real change:

```text
um replaced.
```

No-op:

```text
zero replaced.
```

---

### 29. Testar delete

Confirme snapshot mínimo e audit row.

---

### 30. Testar transaction phases

Commit:

```text
BEFORE_COMMIT;
AFTER_COMMIT;
AFTER_COMPLETION.
```

Rollback:

```text
BEFORE_COMMIT pode iniciar;
AFTER_ROLLBACK;
AFTER_COMPLETION.
```

Desenhe o teste para produzir rollback depois da publicação.

---

### 31. Testar sem transacao

Publique diretamente pelo context.

Regular listener executa.

Transactional listener default não executa.

---

### 32. Testar idempotencia

Publique duas vezes o mesmo record.

Confirme:

```text
uma audit row.
```

Publique dois eventIds para o mesmo resource.

Confirme:

```text
duas audit rows.
```

---

### 33. Testar logging

Capture os eventos de log.

Confirme:

- eventId;
- type;
- phase;
- id;
- version;
- correlation ID no MDC quando HTTP;
- ausência de value e description.

---

### 34. Criar ArchitectureTest

Valide:

- domain sem Spring events;
- events em application;
- listeners não são injetados no service;
- events são records;
- interface é sealed;
- zero entity no payload;
- zero DTO web;
- zero Servlet;
- zero `@Async`;
- zero TaskExecutor;
- zero broker;
- zero outbox;
- audit table não possui campos de dispatch.

---

### 35. Criar LiveServerIT

Use PostgreSQLContainer.

Fluxo:

1. POST v2;
2. validar CREATED;
3. PUT real;
4. validar REPLACED;
5. PUT no-op;
6. confirmar zero evento novo;
7. DELETE;
8. validar DELETED;
9. consultar audit table;
10. provocar failure listener fixture;
11. confirmar rollback.

---

### 36. Criar documentacao

`spring-application-events.md` introduz publish-subscribe.

`application-event-publisher.md` documenta publicação.

`event-payload-design.md` define payload mínimo.

`event-listener-synchronism.md` explica thread e falha.

`event-listener-ordering.md` documenta `@Order`.

`transactional-event-listener.md` documenta binding.

`transaction-event-phases.md` cria tabela das fases.

`event-listener-failure-policy.md` define rollback.

`event-idempotency.md` documenta eventId e unique.

`event-observability.md` lista fields.

`internal-events-vs-messaging.md` compara mecanismos.

`spring-events-baseline.md` consolida a aula.

---

### 37. Criar scripts

`176_testar_evento_de_criacao.ps1` cria recurso.

`177_testar_evento_de_substituicao.ps1` compara real e no-op.

`178_testar_evento_de_exclusao.ps1` valida snapshot.

`179_testar_rollback_por_listener.ps1` ativa fixture.

`180_testar_fases_transacionais.ps1` executa commit e rollback.

`181_testar_idempotencia_de_listener.ps1` repete eventId.

`182_executar_testes_eventos_spring.ps1` executa a suite.

---

### 38. Executar payload e factory tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageEventPayloadTest,ManagedRuntimeMessageEventFactoryTest test
```

---

### 39. Executar publication tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageEventPublicationTest,ManagedRuntimeMessageNoOpEventTest,ManagedRuntimeMessageDeletedEventSnapshotTest,ManagedRuntimeMessageApplicationEventsTest test
```

---

### 40. Executar listener tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSynchronousListenerTest,ManagedRuntimeMessageListenerOrderTest,ManagedRuntimeMessageEventLoggingTest test
```

---

### 41. Executar transaction tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageListenerRollbackIT,ManagedRuntimeMessageBeforeCommitListenerTest,ManagedRuntimeMessageAfterCommitListenerTest,ManagedRuntimeMessageAfterRollbackListenerTest,ManagedRuntimeMessageAfterCompletionListenerTest test
```

Docker precisa estar ativo.

---

### 42. Executar fallback e idempotencia

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageFallbackExecutionTest,ManagedRuntimeMessageAuditIdempotencyIT test
```

---

### 43. Executar arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageEventArchitectureTest test
```

---

### 44. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageEventLiveServerIT test
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
eventos internos:
sim.

transaction phases:
sim.

audit same transaction:
sim.

idempotencia:
sim.

Async:
zero.

broker:
zero.

outbox:
zero.

Redis:
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
- logs;
- fixture state;
- payload de production;
- event dump;
- executor;
- broker config;
- outbox improvisada.

---

## Entendendo o que foi feito

### O caso de uso deixou de conhecer cada reacao

O publisher publica um fato.

Listeners interessados reagem.

### A consistencia da auditoria ficou explicita

O listener síncrono participa da mesma transação e pode causar rollback.

### As fases transacionais ficaram observaveis

Commit, rollback e completion possuem callbacks distintos.

### O payload ficou seguro

Eventos carregam identidade e versão, não conteúdo ou objetos de framework.

### A idempotencia ganhou uma chave

`eventId` e unique constraint evitam duplicidade da projeção.

---

## Erros comuns importantes

### Publicar antes de persistir

O evento pode anunciar um fato que não ocorreu.

### Enviar entity inteira

Listeners ficam acoplados ao persistence context e a dados sensíveis.

### Escrever no banco em AFTER_COMMIT sem nova transacao

A alteração pode não ser confirmada.

### Colocar regra essencial em listener opcional

A consistência vira dependência oculta.

### Chamar evento interno de mensageria confiavel

Não existe broker, retry ou durabilidade independente.

---

## Comandos uteis

### Evento de criacao

```powershell
.\scripts\176_testar_evento_de_criacao.ps1
```

### Replacement e no-op

```powershell
.\scripts\177_testar_evento_de_substituicao.ps1
```

### Rollback

```powershell
.\scripts\179_testar_rollback_por_listener.ps1
```

### Fases

```powershell
.\scripts\180_testar_fases_transacionais.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Publicacao precoce

Publique antes do repository.

Provoque erro.

Observe evento incorreto.

Restaure.

### Parte 2 — Entity no evento

Crie fixture com entity no payload.

Faça o architecture test falhar.

Restaure.

### Parte 3 — Falha sincronica

Ative o listener de failure.

Confirme rollback do recurso e da auditoria.

### Parte 4 — AFTER_COMMIT write

Tente inserir sem nova transaction em fixture.

Observe o comportamento.

Remova a escrita.

### Parte 5 — fallbackExecution

Compare true e false fora de transaction.

Mantenha false em production.

### Parte 6 — Ordem

Faça um listener depender do anterior.

Identifique o acoplamento oculto.

Refatore para uma responsabilidade única.

### Parte 7 — Repeticao

Publique o mesmo eventId duas vezes.

Confirme uma linha.

### Parte 8 — ADR

Registre:

```text
eventos de aplicacao;

records imutaveis;

payload minimo;

eventId;

publish depois da escrita;

no-op sem evento;

audit listener sincrono;

rollback conjunto;

AFTER_COMMIT somente observacao;

fallback false;

idempotencia por unique;

Async na aula 387;

mensageria e outbox fora do escopo.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 385 foi preservada;
- o mesmo projeto foi continuado;
- evento interno foi definido;
- command e event foram diferenciados;
- event usa fato no passado;
- evento de aplicação foi definido;
- evento de domínio foi explicado;
- domínio não recebeu dependência Spring;
- `ApplicationEventPublisher` foi usado;
- listeners não foram injetados no service;
- `publishEvent` foi usado;
- objeto comum foi aceito como evento;
- records não estendem `ApplicationEvent`;
- comportamento do multicaster foi explicado;
- sincronismo default foi documentado;
- ausência de TaskExecutor foi validada;
- eventos são imutáveis;
- eventos são records;
- interface selada foi criada;
- permits lista todos os eventos;
- CREATED foi criado;
- REPLACED foi criado;
- DELETED foi criado;
- enum de change type foi criado;
- eventId foi criado;
- eventId é diferente do resourceId;
- occurredAt usa Instant;
- clock foi injetado;
- UUID generator foi injetado;
- testes usam valores determinísticos;
- resourceId foi incluído;
- resourceVersion foi incluída;
- previousVersion foi incluída quando aplicável;
- payload mínimo foi aplicado;
- value não foi incluído;
- message não foi incluída;
- description não foi incluída;
- entity não foi incluída;
- DTO web não foi incluído;
- request não foi incluído;
- response não foi incluída;
- Servlet não foi incluído;
- ProblemDetail não foi incluído;
- event factory foi criada;
- create publica depois do save;
- replacement publica depois da mudança real;
- no-op não publica;
- delete publica snapshot mínimo;
- validation failure não publica;
- not found não publica;
- conflict não publica;
- stale ETag não publica;
- database failure antes da mudança não publica sucesso;
- `@EventListener` foi usado;
- listener pode receber a interface;
- listener síncrono foi explicado;
- exception do listener propaga;
- listener failure causa rollback;
- auditoria participa da mesma transação;
- coupling implícito foi documentado;
- auditoria foi declarada parte da consistência;
- múltiplos listeners foram criados;
- cada listener possui uma responsabilidade;
- `@Order` foi usado;
- valores menores executam primeiro;
- correctness não dependeu de order;
- retorno de listener foi explicado;
- retorno de listener não foi usado;
- condição SpEL foi explicada;
- condição SpEL não foi usada sem necessidade;
- `@TransactionalEventListener` foi usado;
- fase default AFTER_COMMIT foi explicada;
- fase foi declarada explicitamente;
- BEFORE_COMMIT foi exercitada;
- AFTER_COMMIT foi exercitada;
- AFTER_ROLLBACK foi exercitada;
- AFTER_COMPLETION foi exercitada;
- AFTER_COMMIT não executa em rollback;
- AFTER_ROLLBACK não executa em commit;
- AFTER_COMPLETION executa nos dois resultados;
- listener pós-commit não escreve no banco;
- caveat de resources após commit foi documentado;
- `REQUIRES_NEW` foi explicado;
- nova transaction não foi criada sem necessidade;
- restrição de `@Transactional` em listener foi explicada;
- fallbackExecution foi explicado;
- production mantém fallback false;
- fixture com fallback true foi testada;
- evento fora de transaction executa listener regular;
- evento fora de transaction não executa listener transacional default;
- migration V4 foi criada;
- tabela de auditoria foi criada;
- event_id possui unique constraint;
- resource_id foi persistido;
- resource_version foi persistida;
- event_type foi persistido;
- occurred_at foi persistido;
- recorded_at foi persistido;
- relação JPA com recurso não foi criada;
- exclusão do recurso não remove auditoria;
- listener idempotente foi criado;
- duplicate eventId produz uma linha;
- dois eventIds do mesmo recurso produzem duas linhas;
- constraint foi tratada como garantia final;
- exactly once não foi prometido;
- log e audit table foram diferenciados;
- evento interno e mensageria foram diferenciados;
- tabela de auditoria não foi chamada de outbox;
- status de dispatch não foi criado;
- retry count não foi criado;
- broker destination não foi criado;
- observabilidade do evento foi criada;
- eventId aparece no log;
- eventType aparece no log;
- resourceId aparece no log;
- resourceVersion aparece no log;
- phase aparece no log;
- conteúdo sensível não aparece no log;
- correlation ID não foi acoplado ao payload;
- `@RecordApplicationEvents` foi usado;
- `ApplicationEvents` foi usado;
- publicação foi contada em teste;
- ausência no no-op foi testada;
- payload foi inspecionado;
- ManagedRuntimeMessageEventPayloadTest foi criado;
- ManagedRuntimeMessageEventFactoryTest foi criado;
- ManagedRuntimeMessageEventPublicationTest foi criado;
- ManagedRuntimeMessageNoOpEventTest foi criado;
- ManagedRuntimeMessageDeletedEventSnapshotTest foi criado;
- ManagedRuntimeMessageSynchronousListenerTest foi criado;
- ManagedRuntimeMessageListenerRollbackIT foi criado;
- ManagedRuntimeMessageListenerOrderTest foi criado;
- ManagedRuntimeMessageBeforeCommitListenerTest foi criado;
- ManagedRuntimeMessageAfterCommitListenerTest foi criado;
- ManagedRuntimeMessageAfterRollbackListenerTest foi criado;
- ManagedRuntimeMessageAfterCompletionListenerTest foi criado;
- ManagedRuntimeMessageFallbackExecutionTest foi criado;
- ManagedRuntimeMessageAuditIdempotencyIT foi criado;
- ManagedRuntimeMessageApplicationEventsTest foi criado;
- ManagedRuntimeMessageEventLoggingTest foi criado;
- ManagedRuntimeMessageEventArchitectureTest foi criado;
- domain sem Spring events foi validado;
- application events ficaram na application;
- listeners não atravessaram para domain;
- zero `@Async` foi validado;
- zero TaskExecutor foi validado;
- zero broker foi validado;
- zero outbox foi validado;
- ManagedRuntimeMessageEventLiveServerIT foi criado;
- PostgreSQL real foi preservado;
- documentação completa foi criada;
- scripts 176 a 182 foram criados;
- testes de payload, publicação, listener, fases, fallback, idempotência, arquitetura, live, suite e package passaram;
- nenhum Async, executor, cache, Redis, rate limiting, broker ou mensageria externa foi antecipado;
- ponte para a aula 387 está correta;
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
git commit -m "feat(m14): publicar eventos internos transacionais"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- dumps de eventos;
- dados de production;
- executor;
- broker;
- outbox;
- configuração Redis.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a aplicação passou a publicar fatos internos sem conhecer todas as reações.

O fluxo consolidado ficou:

```text
controller;

application service;

repository;

event factory;

ApplicationEventPublisher;

listener sincrono;

audit row;

transaction commit;

transactional listeners.
```

Você comprovou:

```text
eventos imutaveis;

payload minimo;

eventId;

create, replace e delete;

no-op sem evento;

listener na mesma thread;

rollback por falha;

auditoria na mesma transacao;

fases de commit e rollback;

fallback;

idempotencia;

observabilidade.
```

A decisão central foi:

```text
eventos internos reduzem
o acoplamento estrutural,
mas podem criar acoplamento
temporal e transacional;

por isso, payload, fase,
politica de falha
e idempotencia
precisam ser explicitos.
```

A próxima aula será:

```text
387 - M14.32 - Async no Spring
```

Nela, você continuará no mesmo projeto e estudará:

- `@EnableAsync`;
- `@Async`;
- proxy;
- self-invocation;
- return types;
- `void`;
- `CompletableFuture`;
- `TaskExecutor`;
- `ThreadPoolTaskExecutor`;
- core pool;
- max pool;
- queue capacity;
- thread name prefix;
- rejection policy;
- graceful shutdown;
- exception handling;
- `AsyncUncaughtExceptionHandler`;
- MDC propagation;
- Security context conceitual;
- transaction boundaries;
- async event listeners;
- testing;
- timeouts;
- cancellation;
- backpressure;
- limites antes de mensageria.

A aula 386 respondeu:

```text
como publicar e reagir
a eventos internos
alinhados com transacoes?
```

A aula 387 responderá:

```text
como executar determinadas reacoes
fora do thread da request
sem perder controle de capacidade,
contexto, exceptions e shutdown?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar command, evento de aplicação e evento de domínio.
- [ ] Sei publicar records imutáveis com payload mínimo.
- [ ] Sei explicar listener síncrono e rollback.
- [ ] Sei usar as quatro fases de TransactionalEventListener.
- [ ] Sei implementar idempotência sem prometer exactly once.

---

## Troubleshooting adicional

### Evento nao aparece no teste

Confirme `@RecordApplicationEvents` e publicação dentro do método testado.

### Audit row existe apos rollback

O listener está usando uma transaction independente sem decisão explícita.

### AFTER_COMMIT nao executa

Confirme que existe transaction e que ela realmente fez commit.

### Listener fora de transaction nao executa

Esse é o default; revise `fallbackExecution`.

### No-op produz evento

A publicação está antes da detecção de equivalência.

### Event payload possui entity

Mova para ids, version e metadata imutável.

---

## Perguntas de revisao

1. O que um evento representa?
2. Como command difere de event?
3. O domínio precisa importar Spring?
4. O que ApplicationEventPublisher faz?
5. Record precisa estender ApplicationEvent?
6. O listener default é síncrono nesta baseline?
7. O que acontece se ele falha?
8. No-op publica evento?
9. Qual campo identifica a ocorrência?
10. Qual campo identifica o recurso?
11. Para que serve @Order?
12. Qual fase é default?
13. O que BEFORE_COMMIT faz?
14. Quando AFTER_COMMIT executa?
15. Quando AFTER_ROLLBACK executa?
16. O que AFTER_COMPLETION representa?
17. O que fallbackExecution altera?
18. Audit table é outbox?
19. @Async foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Um fato ocorrido.
2. Command é intenção; event é fato.
3. Não.
4. Entrega o evento ao multicaster.
5. Não.
6. Sim.
7. A exception propaga e pode causar rollback.
8. Não.
9. `eventId`.
10. `resourceId`.
11. Ordenar listeners.
12. AFTER_COMMIT.
13. Executa antes do commit.
14. Após commit bem-sucedido.
15. Após rollback.
16. Término em qualquer resultado.
17. Permite execução sem transaction.
18. Não.
19. Não.
20. Async no Spring.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 386 - M14.31 - Eventos internos Spring

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei commands, eventos de aplicação e eventos de domínio.
- Usei `ApplicationEventPublisher`.
- Criei uma interface selada para eventos de mudança.
- Criei eventos imutáveis de create, replace e delete.
- Adicionei `eventId`, `occurredAt`, resource id e resource version.
- Mantive entity, DTOs, bodies e dados sensíveis fora do payload.
- Centralizei a criação dos eventos em uma factory.
- Publiquei eventos somente depois da operação principal.
- Não publiquei evento em no-op.
- Não publiquei evento em operações que falharam.
- Criei listener síncrono com `@EventListener`.
- Entendi que o listener default executa no thread do publisher.
- Comprovei que uma falha síncrona provoca rollback.
- Criei uma projeção interna de auditoria na mesma transação.
- Criei migration V4 para a auditoria.
- Usei `eventId` único para idempotência.
- Diferenciei log operacional de audit table.
- Usei `@Order` sem criar dependência oculta.
- Estudei `@TransactionalEventListener`.
- Exercitei BEFORE_COMMIT, AFTER_COMMIT, AFTER_ROLLBACK e AFTER_COMPLETION.
- Mantive o listener AFTER_COMMIT sem escrita em banco.
- Estudei `fallbackExecution`.
- Mantive fallback desabilitado nos listeners de produção.
- Usei `@RecordApplicationEvents` nos testes.
- Comparei eventos internos, mensageria e outbox.
- Não prometi exactly once.
- Mantive correlation ID no MDC e fora do payload.
- Não adicionei `@Async`, executor, broker ou Redis.
- Próxima aula: Async no Spring.
```

---

## Referencia tecnica curta

```text
Command:
intencao.

Event:
fato.

Publisher:
entrega.

Listener:
reacao.

Order:
sequencia.

Transaction:
boundary.

Commit:
sucesso.

Rollback:
falha.

EventId:
idempotencia.

Audit:
registro.
```

Regra final:

```text
eventos internos devem representar fatos imutaveis e ser publicados somente depois que a operacao principal produziu um resultado valido; o payload deve conter apenas identidade, versao e metadata necessaria, listeners regulares devem ter sua sincronia e politica de falha documentadas, listeners transacionais devem declarar explicitamente a fase e nao presumir nova persistencia apos o commit, idempotencia deve usar um identificador de evento e garantia no banco, e a arquitetura deve diferenciar eventos internos de mensageria e outbox sem esconder regras essenciais do caso de uso em listeners opcionais.
```
