# 430 - M15.20 - Auditoria de acoes sensiveis

## Apresentação da aula

Na aula 429, a API passou a comunicar falhas de segurança com um contrato previsível.

A matriz pública ficou:

```text
autenticação ausente:
401 authentication_required.

bearer inválido:
401 invalid_token.

login inválido:
401 invalid_credentials.

refresh inválido:
401 invalid_refresh_token.

permission ausente:
403 access_denied.

recurso inexistente ou oculto:
404 service_order_not_found.

falha inesperada:
500 internal_error.
```

As responses agora utilizam:

```text
application/problem+json;

type;

title;

status;

detail;

instance;

code;

correlationId;

Cache-Control: no-store.
```

A API também deixou de expor:

- causa criptográfica;
- existência de usuário;
- ownership de recurso;
- stack trace;
- SQL;
- path de secret;
- token;
- password;
- hash.

Esse desenho protege o cliente e reduz informação útil para um atacante.

Porém, o servidor ainda precisa responder internamente:

```text
o que aconteceu?

quem executou?

qual ação foi tentada?

qual recurso foi afetado?

qual foi o resultado?

quando ocorreu?

qual request originou a ação?
```

Sem esse histórico, a equipe pode saber que a API devolveu um `403`, mas não consegue reconstruir:

- qual identidade tentou excluir uma OS;
- qual família de refresh token detectou reuse;
- qual usuário alterou o status;
- qual correlation ID liga a falha aos logs técnicos;
- se o mesmo padrão está se repetindo;
- quando uma ação administrativa ou sensível ocorreu.

A pergunta central desta aula será:

```text
como registrar eventos de segurança
de forma estruturada e investigável,
sem transformar a auditoria
em um novo vazamento de credenciais
ou em um log genérico impossível de confiar?
```

A solução criará um audit trail dedicado, separado de application log, access log, trace, métrica e JPA entity auditing. O schema estável conterá:

```text
eventId;

occurredAt;

action;

outcome;

actorType;

actorId;

targetType;

targetId;

reasonCode;

correlationId;

requestMethod;

requestPath.
```

Ele não armazenará tokens, passwords, hashes, Authorization, cookies, bodies, query strings, stack traces, claims completos, dados da OS ou username tentado.

A tabela será:

```text
security_audit_event.
```

Ela armazenará eventos como:

```text
LOGIN_SUCCEEDED;

LOGIN_FAILED;

ACCESS_TOKEN_REJECTED;

REFRESH_SUCCEEDED;

REFRESH_FAILED;

REFRESH_REUSE_DETECTED;

AUTHORIZATION_DENIED;

SERVICE_ORDER_CREATED;

SERVICE_ORDER_UPDATED;

SERVICE_ORDER_STATUS_CHANGED;

SERVICE_ORDER_DELETED.
```

Os resultados serão:

```text
SUCCEEDED;

DENIED;

FAILED.
```

As reasons serão códigos controlados:

```text
INVALID_CREDENTIALS;

INVALID_TOKEN;

INVALID_REFRESH_TOKEN;

REFRESH_TOKEN_REUSE;

MISSING_AUTHORITY;

RESOURCE_CONCEALED;

ACCOUNT_NOT_ELIGIBLE;

BUSINESS_FAILURE.
```

Não haverá um campo livre como:

```text
details jsonb
```

nesta primeira versão.

Campos livres facilitam inserir acidentalmente:

- secrets;
- dados pessoais;
- payloads completos;
- mensagens internas;
- valores não normalizados.

A auditoria cobrirá login, bearer rejeitado, refresh, reuse, permission ausente, ownership negado e alterações sensíveis de Ordem de Serviço.

Leituras permitidas não serão registradas individualmente nesta etapa, evitando volume, ruído e duplicação com access logs. Leituras negadas continuam auditáveis por representarem decisões de segurança.

A persistência seguirá duas estratégias.

Ações sensíveis bem-sucedidas:

```text
audit event na mesma transação
da alteração de negócio.
```

Se a inserção de auditoria falhar:

```text
a alteração sensível também falha.
```

Isso é fail closed para writes auditáveis.

Falhas de autenticação e autorização:

```text
transação REQUIRES_NEW;
best effort;
sem alterar a response pública.
```

Se o sink estiver indisponível, a aplicação preserva a response, emite um log técnico mínimo sem credenciais e permanece NO-GO para produção pública.

A aula também corrigirá um detalhe importante do refresh token.

Na implementação inicial, reuse poderia ser detectado dentro de uma transação e, em seguida, uma exception runtime poderia causar rollback da própria revogação.

A solução será:

```text
a transação de rotação retorna
uma decisão de rejeição;

revogação e auditoria fazem commit;

somente a camada externa
lança InvalidRefreshTokenException.
```

Assim:

```text
response:
401 invalid_refresh_token.

estado interno:
família revogada;
evento persistido.
```

A próxima aula será:

```text
431 - M15.21 - Secrets management
```

Ela utilizará a base de auditoria criada aqui para registrar operações de acesso, rotação e falha relacionadas a secrets, sem revelar seus valores.

---

## Onde estamos na formação

A sequência oficial é:

```text
428:
Autorizacao por regra de negocio.

429:
Erros de autenticacao e autorizacao.

430:
Auditoria de acoes sensiveis.

431:
Secrets management.

432:
OAuth2 conceitos.

433:
OAuth2 Client Credentials.
```

A aula 429 respondeu:

```text
como comunicar falhas
sem expor internals?
```

A aula 430 responderá:

```text
como preservar accountability
e reconstruir ações sensíveis
sem registrar os segredos envolvidos?
```

Nesta aula:

```text
audit trail dedicado:
sim.

schema estruturado:
sim.

PostgreSQL:
sim.

migration:
sim.

actor:
sim.

action:
sim.

target:
sim.

outcome:
sim.

reason code:
sim.

correlation ID:
sim.

tokens no audit:
não.

payload livre:
não.

SIEM:
não.

alertas:
não.

retenção definitiva:
não.

secrets management:
próxima aula.
```

A regra central será:

```text
auditar o evento de segurança,
não copiar a credencial
que participou dele.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/db/migration/
└── V11__create_security_audit_event.sql
```

Modelo de auditoria:

```text
configuration/security/audit/
├── SecurityAuditAction.java
├── SecurityAuditOutcome.java
├── SecurityAuditActorType.java
├── SecurityAuditReason.java
├── SecurityAuditEvent.java
├── SecurityAuditSanitizer.java
├── SecurityAuditEventFactory.java
├── SecurityAuditStore.java
└── SecurityAuditRecorder.java
```

Integrações atualizadas:

```text
JwtLoginController.java;

RefreshTokenService.java;

TokenPairService.java;

ApiBearerAuthenticationEntryPoint.java;

ApiBearerAccessDeniedHandler.java;

ServiceOrderAccessGuard.java;

ServiceOrderApplicationService.java.
```

Refresh refinado:

```text
RefreshRotationDecision.java.
```

Teste:

```text
SecurityAuditIntegrationTest.java
```

Documento:

```text
docs/security/M15_SECURITY_AUDIT.md
```

A aplicação demonstrará:

```text
login válido:
evento com actor UUID.

login inválido:
evento anônimo,
sem username ou password.

bearer inválido:
evento sem token.

permission negada:
actor e endpoint.

ownership negado:
actor, ação e target ID.

create/update/status/delete:
evento na mesma transação.

refresh válido:
evento de rotação.

reuse:
família revogada
e evento persistido.

rollback de negócio:
sem evento de sucesso.
```

Você irá:

1. diferenciar logs técnicos e auditoria;
2. criar schema mínimo;
3. preservar histórico sem foreign keys;
4. criar enums fechados;
5. sanitizar contexto HTTP;
6. resolver actor;
7. inserir com SQL parametrizado;
8. criar gravação obrigatória;
9. criar gravação best effort;
10. auditar login;
11. auditar bearer inválido;
12. auditar autorização negada;
13. auditar ownership;
14. auditar writes;
15. corrigir rollback de reuse;
16. testar ausência de secrets;
17. testar atomicidade;
18. documentar retenção e acesso;
19. atualizar riscos;
20. preparar secrets management.

---

## Conceito essencial

### Application log não é audit trail

Application log ajuda no diagnóstico técnico, enquanto audit trail sustenta accountability sobre ações e decisões atribuíveis. O mesmo fato pode gerar audit record, métrica e log técnico, mas cada artefato possui finalidade distinta.

---

### JPA auditing não é auditoria de segurança completa

Spring Data pode preencher `createdBy`, `createdDate`, `lastModifiedBy` e `lastModifiedDate`, mas isso não cobre tentativas negadas, tokens inválidos, login falho, reuse, targets removidos ou correlation ID. O audit trail será explícito.

---

### O que precisa ser respondido

Um evento auditável deve responder quando, quem, qual ação, target, resultado, reason code e correlation ID, sem copiar a request inteira.

---

### Actor

Actor types:

```text
ANONYMOUS;

USER;

SYSTEM.
```

`USER`

```text
actor_id:
UUID do subject autenticado.
```

`ANONYMOUS`

```text
actor_id:
null.
```

`SYSTEM`

será reservado para:

- scheduler;
- migration;
- consumer;
- processo interno.

Nesta aula, login falho será anônimo.

O username tentado não será armazenado.

---

### Target sem foreign key

O audit record poderá guardar:

```text
target_type:
SERVICE_ORDER.

target_id:
UUID.
```

A tabela não terá FK para a OS.

Motivo:

```text
o audit trail precisa sobreviver
à exclusão do target.
```

Também não haverá FK para o usuário.

A exclusão ou anonimização da conta não pode apagar automaticamente o histórico.

Retenção e privacidade precisam de política organizacional.

---

### Schema fechado

Enums em Java e checks no banco reduzem valores inesperados.

Não use:

```text
action = exception.getMessage();

reason = request body;

targetType = header do cliente.
```

Os valores vêm de constantes internas.

---

### Correlation ID confiável

A auditoria usará o correlation ID já normalizado pelo filtro.

Ela não lerá diretamente um header bruto sem validação.

O valor será:

- limitado;
- sem CR/LF;
- reaproveitado entre response, log e audit;
- gerado pelo servidor quando ausente.

---

### Request path sem query string

A auditoria armazena método e URI sem query string, que pode conter filtros sensíveis, tokens indevidos ou dados pessoais. O path será sanitizado e truncado.

---

### Log injection

Valores controlados externamente podem conter:

```text
CR;

LF;

tab;

delimitadores.
```

O audit record deve:

- usar parâmetros SQL;
- remover caracteres de controle;
- limitar tamanho;
- usar enums;
- não concatenar SQL;
- não montar uma linha textual livre.

---

### Eventos de sucesso e transação

Uma ação sensível e seu evento compartilham a mesma transação. Se o audit insert falhar, a alteração também faz rollback.

---

### Eventos negados e REQUIRES_NEW

Tentativas negadas, como login inválido, não dependem da transação de negócio. O recorder usará `REQUIRES_NEW`.

Se o audit sink falhar, a response pública continua:

```text
401 invalid_credentials.
```

O sistema emite apenas `security_audit_sink_failure`, action e correlation ID, sem actor raw, token ou body.

---

### Publicar evento assíncrono não garante auditoria

`@Async` pode:

- perder eventos no shutdown;
- falhar sem retry;
- reordenar;
- ocultar exception;
- introduzir fila em memória.

Nesta baseline, a persistência será síncrona.

Produção distribuída poderá usar outbox, broker, retry, dead-letter, storage imutável e SIEM; esses componentes não serão improvisados agora.

---

### Reuse precisa sobreviver à exception

Fluxo incorreto:

```text
marcar família comprometida;

throw RuntimeException;

rollback;

família continua ativa.
```

Fluxo correto:

```text
método transacional
retorna REJECTED_REUSE;

commit da revogação
e do audit event;

camada externa lança
InvalidRefreshTokenException.
```

Esse detalhe é requisito de segurança, não apenas de auditoria.

---

### Audit failure policy

A policy será: writes e reuse usam auditoria obrigatória e transacional; tentativas negadas usam best effort; leituras permitidas não são auditadas individualmente. A decisão precisa permanecer documentada.

---

### Retenção e acesso

Produção precisará definir retenção, base legal, anonimização, exportação, integridade, backup, acesso, alertas, imutabilidade e descarte. A aula cria a estrutura técnica, não uma política jurídica universal.

---

## Mão na massa guiada

### 1. Criar a migration V11

Arquivo:

```text
V11__create_security_audit_event.sql
```

Conteúdo:

```sql
create table security_audit_event (
    id uuid primary key,
    occurred_at timestamptz not null,
    action varchar(80) not null,
    outcome varchar(20) not null,
    actor_type varchar(20) not null,
    actor_id uuid,
    target_type varchar(80),
    target_id uuid,
    reason_code varchar(80),
    correlation_id varchar(120) not null,
    request_method varchar(12),
    request_path varchar(300),

    constraint ck_security_audit_outcome
        check (
            outcome in (
                'SUCCEEDED',
                'DENIED',
                'FAILED'
            )
        ),

    constraint ck_security_audit_actor_type
        check (
            actor_type in (
                'ANONYMOUS',
                'USER',
                'SYSTEM'
            )
        ),

    constraint ck_security_audit_actor
        check (
            (
                actor_type = 'USER'
                and actor_id is not null
            )
            or
            (
                actor_type <> 'USER'
                and actor_id is null
            )
        )
);

create index ix_security_audit_occurred_at
    on security_audit_event (
        occurred_at
    );

create index ix_security_audit_action_outcome
    on security_audit_event (
        action,
        outcome,
        occurred_at
    );

create index ix_security_audit_actor
    on security_audit_event (
        actor_id,
        occurred_at
    );

create index ix_security_audit_target
    on security_audit_event (
        target_type,
        target_id,
        occurred_at
    );

create index ix_security_audit_correlation
    on security_audit_event (
        correlation_id
    );
```

Não crie foreign keys para actor ou target.

---

### 2. Criar enums

```java
public enum SecurityAuditOutcome {
    SUCCEEDED,
    DENIED,
    FAILED
}
```

```java
public enum SecurityAuditActorType {
    ANONYMOUS,
    USER,
    SYSTEM
}
```

Actions:

```java
public enum SecurityAuditAction {
    LOGIN,
    ACCESS_TOKEN_VALIDATION,
    REFRESH_TOKEN_ROTATION,
    AUTHORIZATION,
    SERVICE_ORDER_CREATE,
    SERVICE_ORDER_UPDATE,
    SERVICE_ORDER_STATUS_UPDATE,
    SERVICE_ORDER_DELETE
}
```

Reasons:

```java
public enum SecurityAuditReason {
    NONE,
    INVALID_CREDENTIALS,
    INVALID_TOKEN,
    INVALID_REFRESH_TOKEN,
    REFRESH_TOKEN_REUSE,
    MISSING_AUTHORITY,
    RESOURCE_CONCEALED,
    ACCOUNT_NOT_ELIGIBLE,
    BUSINESS_FAILURE
}
```

Não persista `null` para uma razão de sucesso.

Use:

```text
NONE.
```

---

### 3. Criar SecurityAuditEvent

```java
public record SecurityAuditEvent(
        UUID id,
        Instant occurredAt,
        SecurityAuditAction action,
        SecurityAuditOutcome outcome,
        SecurityAuditActorType actorType,
        UUID actorId,
        String targetType,
        UUID targetId,
        SecurityAuditReason reason,
        String correlationId,
        String requestMethod,
        String requestPath
) {
}
```

O record não contém mapa livre e não deve ser registrado por `toString()`.

---

### 4. Criar SecurityAuditSanitizer

```java
@Component
public class SecurityAuditSanitizer {

    public String sanitize(
            String value,
            int maxLength
    ) {
        if (value == null) {
            return null;
        }

        String sanitized =
                value
                        .replace('\r', '_')
                        .replace('\n', '_')
                        .replace('\t', '_')
                        .trim();

        if (
            sanitized.length()
            <= maxLength
        ) {
            return sanitized;
        }

        return sanitized.substring(
                0,
                maxLength
        );
    }
}
```

Use apenas para campos contextuais controlados.

Actions e reasons são enums.

---

### 5. Criar SecurityAuditEventFactory

Dependências:

```text
Clock;

AuthenticatedSubjectResolver;

CorrelationIdResolver;

SecurityAuditSanitizer.
```

Método:

```java
public SecurityAuditEvent create(
        SecurityAuditAction action,
        SecurityAuditOutcome outcome,
        SecurityAuditReason reason,
        Authentication authentication,
        String targetType,
        UUID targetId,
        HttpServletRequest request
) {
    Optional<UUID> actorId =
            subjectResolver.resolve(
                    authentication
            );

    SecurityAuditActorType actorType =
            actorId.isPresent()
                    ? SecurityAuditActorType.USER
                    : SecurityAuditActorType.ANONYMOUS;

    return new SecurityAuditEvent(
            UUID.randomUUID(),
            clock.instant(),
            action,
            outcome,
            actorType,
            actorId.orElse(null),
            sanitizer.sanitize(
                    targetType,
                    80
            ),
            targetId,
            reason,
            correlationIdResolver
                    .resolve(request),
            sanitizer.sanitize(
                    request.getMethod(),
                    12
            ),
            sanitizer.sanitize(
                    request.getRequestURI(),
                    300
            )
    );
}
```

Não use:

```java
request.getQueryString()
```

---

### 6. Criar SecurityAuditStore

Use `NamedParameterJdbcTemplate`:

```java
@Repository
public class SecurityAuditStore {

    private static final String INSERT =
            """
            insert into security_audit_event (
                id,
                occurred_at,
                action,
                outcome,
                actor_type,
                actor_id,
                target_type,
                target_id,
                reason_code,
                correlation_id,
                request_method,
                request_path
            )
            values (
                :id,
                :occurredAt,
                :action,
                :outcome,
                :actorType,
                :actorId,
                :targetType,
                :targetId,
                :reasonCode,
                :correlationId,
                :requestMethod,
                :requestPath
            )
            """;

    private final NamedParameterJdbcTemplate
            jdbcTemplate;

    public SecurityAuditStore(
            NamedParameterJdbcTemplate
                    jdbcTemplate
    ) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void append(
            SecurityAuditEvent event
    ) {
        MapSqlParameterSource parameters =
                new MapSqlParameterSource()
                        .addValue(
                                "id",
                                event.id()
                        )
                        .addValue(
                                "occurredAt",
                                event.occurredAt()
                        )
                        .addValue(
                                "action",
                                event.action().name()
                        )
                        .addValue(
                                "outcome",
                                event.outcome().name()
                        )
                        .addValue(
                                "actorType",
                                event.actorType().name()
                        )
                        .addValue(
                                "actorId",
                                event.actorId()
                        )
                        .addValue(
                                "targetType",
                                event.targetType()
                        )
                        .addValue(
                                "targetId",
                                event.targetId()
                        )
                        .addValue(
                                "reasonCode",
                                event.reason().name()
                        )
                        .addValue(
                                "correlationId",
                                event.correlationId()
                        )
                        .addValue(
                                "requestMethod",
                                event.requestMethod()
                        )
                        .addValue(
                                "requestPath",
                                event.requestPath()
                        );

        jdbcTemplate.update(
                INSERT,
                parameters
        );
    }
}
```

O store oferece apenas append e não estende `JpaRepository`.

---

### 7. Criar SecurityAuditRecorder

Use duas operações:

```java
@Component
public class SecurityAuditRecorder {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    SecurityAuditRecorder.class
            );

    private final SecurityAuditStore store;
    private final TransactionTemplate
            requiresNew;

    public SecurityAuditRecorder(
            SecurityAuditStore store,
            PlatformTransactionManager
                    transactionManager
    ) {
        this.store = store;

        this.requiresNew =
                new TransactionTemplate(
                        transactionManager
                );

        this.requiresNew
                .setPropagationBehavior(
                        TransactionDefinition
                                .PROPAGATION_REQUIRES_NEW
                );
    }

    public void recordRequired(
            SecurityAuditEvent event
    ) {
        store.append(event);
    }

    public void recordBestEffort(
            SecurityAuditEvent event
    ) {
        try {
            requiresNew.executeWithoutResult(
                    status ->
                            store.append(event)
            );
        }
        catch (RuntimeException exception) {
            LOGGER.error(
                    "security_audit_sink_failure "
                    + "action={} correlationId={}",
                    event.action(),
                    event.correlationId()
            );
        }
    }
}
```

O log de falha não contém o evento.

---

### 8. Auditar login

No login válido, depois de autenticar e antes de retornar:

```java
auditRecorder.recordBestEffort(
        auditFactory.create(
                SecurityAuditAction.LOGIN,
                SecurityAuditOutcome.SUCCEEDED,
                SecurityAuditReason.NONE,
                authentication,
                "ACCOUNT",
                principal.getUserId(),
                request
        )
);
```

No catch de `AuthenticationException`:

```java
auditRecorder.recordBestEffort(
        auditFactory.create(
                SecurityAuditAction.LOGIN,
                SecurityAuditOutcome.DENIED,
                SecurityAuditReason
                        .INVALID_CREDENTIALS,
                null,
                "ACCOUNT",
                null,
                request
        )
);
```

Não passe username tentado.

---

### 9. Auditar bearer inválido

No `ApiBearerAuthenticationEntryPoint`, classifique:

```text
invalid token:
ACCESS_TOKEN_VALIDATION;
DENIED;
INVALID_TOKEN.

token ausente:
não registrar nesta baseline,
para evitar ruído de scanners e paths públicos.
```

Registre apenas quando um bearer foi efetivamente apresentado e rejeitado.

Nunca extraia o token para o audit event.

---

### 10. Auditar permission negada

No `ApiBearerAccessDeniedHandler`:

```java
auditRecorder.recordBestEffort(
        auditFactory.create(
                SecurityAuditAction.AUTHORIZATION,
                SecurityAuditOutcome.DENIED,
                SecurityAuditReason.MISSING_AUTHORITY,
                SecurityContextHolder
                        .getContext()
                        .getAuthentication(),
                "HTTP_ENDPOINT",
                null,
                request
        )
);
```

O path indica a operação.

A permission ausente não precisa ser registrada.

---

### 11. Auditar ownership ocultado

No `ServiceOrderAccessGuard`, antes de lançar:

```java
auditRecorder.recordBestEffort(
        auditFactory.create(
                SecurityAuditAction.AUTHORIZATION,
                SecurityAuditOutcome.DENIED,
                SecurityAuditReason.RESOURCE_CONCEALED,
                authentication,
                "SERVICE_ORDER",
                serviceOrderId,
                request
        )
);
```

Para evitar dependência servlet no guard, crie um `SecurityAuditContextProvider` que obtém a request atual de forma opcional.

Em chamadas internas sem request:

```text
requestMethod:
null.

requestPath:
null.

correlationId:
system-generated.
```

O guard não recebe o token.

---

### 12. Auditar writes na mesma transação

No `create`, depois de persistir:

```java
auditRecorder.recordRequired(
        auditFactory.createCurrent(
                SecurityAuditAction
                        .SERVICE_ORDER_CREATE,
                SecurityAuditOutcome.SUCCEEDED,
                SecurityAuditReason.NONE,
                authentication,
                "SERVICE_ORDER",
                saved.getId()
        )
);
```

Aplique o mesmo padrão a:

- update;
- status update;
- delete.

Para delete, grave o evento antes de remover ou imediatamente depois da chamada de delete, ainda na mesma transação.

Se qualquer passo falhar, tudo faz rollback.

---

### 13. Não auditar sucesso antes da operação

Este fluxo é incorreto:

```text
gravar SERVICE_ORDER_DELETED;

tentar delete;

regra de negócio falha.
```

O audit trail afirmaria um sucesso inexistente.

O evento de sucesso precisa ocorrer somente depois da operação ter sido aceita, ainda dentro da transação.

---

### 14. Refinar a decisão de refresh

Crie:

```java
public sealed interface
        RefreshRotationDecision
        permits
        RefreshRotationDecision.Rotated,
        RefreshRotationDecision.Rejected {

    record Rotated(
            Authentication authentication,
            UUID familyId,
            String rawToken,
            Duration expiresIn
    ) implements RefreshRotationDecision {
    }

    record Rejected(
            SecurityAuditReason reason
    ) implements RefreshRotationDecision {
    }
}
```

O raw token permanece somente em memória.

---

### 15. Corrigir reuse e rollback

No método transacional de rotação:

```java
if (
    current.getStatus()
            == RefreshTokenStatus.ROTATED
) {
    family.markCompromised(now);

    tokenRepository
            .revokeActiveByFamily(
                    family.getId(),
                    now
            );

    auditRecorder.recordRequired(
            auditFactory.createCurrent(
                    SecurityAuditAction
                            .REFRESH_TOKEN_ROTATION,
                    SecurityAuditOutcome.DENIED,
                    SecurityAuditReason
                            .REFRESH_TOKEN_REUSE,
                    authenticationFor(user),
                    "REFRESH_TOKEN_FAMILY",
                    family.getId()
            )
    );

    return new RefreshRotationDecision
            .Rejected(
                    SecurityAuditReason
                            .REFRESH_TOKEN_REUSE
            );
}
```

O método retorna normalmente.

A transação faz commit.

---

### 16. Lançar a exception fora da transação

No `TokenPairService`:

```java
RefreshRotationDecision decision =
        refreshTokenService.rotate(
                rawRefreshToken
        );

if (
    decision
        instanceof
        RefreshRotationDecision
                .Rejected
) {
    throw new InvalidRefreshTokenException();
}

RefreshRotationDecision.Rotated rotated =
        (RefreshRotationDecision.Rotated)
                decision;
```

`TokenPairService` não deve possuir uma transação externa envolvendo a chamada.

Assim, a exception pública ocorre depois do commit interno.

---

### 17. Auditar refresh válido

Na rotação bem-sucedida, antes de retornar:

```java
auditRecorder.recordRequired(
        auditFactory.createCurrent(
                SecurityAuditAction
                        .REFRESH_TOKEN_ROTATION,
                SecurityAuditOutcome.SUCCEEDED,
                SecurityAuditReason.NONE,
                authentication,
                "REFRESH_TOKEN_FAMILY",
                family.getId()
        )
);
```

Não registre:

- token antigo;
- token novo;
- hashes;
- `jti` do access token.

---

### 18. Auditar refresh inválido desconhecido

Quando o hash não encontra registro, não existe actor confiável.

Use `recordBestEffort` na camada externa:

```text
actor:
ANONYMOUS.

target:
null.

reason:
INVALID_REFRESH_TOKEN.
```

Quando o serviço conhece a família e revoga por conta bloqueada, registre obrigatoriamente dentro da transação com actor UUID.

---

### 19. Criar queries de evidência seguras

Para testes e suporte:

```sql
select
    id,
    occurred_at,
    action,
    outcome,
    actor_type,
    actor_id,
    target_type,
    target_id,
    reason_code,
    correlation_id,
    request_method,
    request_path
from
    security_audit_event
order by
    occurred_at,
    id;
```

---

### 20. Criar SecurityAuditIntegrationTest

Use PostgreSQL real, RSA de teste, login, JWT e refresh. Limpe a tabela entre testes com SQL controlado; não exponha leitura da auditoria.

---

### 21. Testar login válido

Valide:

```text
action:
LOGIN.

outcome:
SUCCEEDED.

actorType:
USER.

actorId:
UUID autenticado.

targetType:
ACCOUNT.

targetId:
mesmo UUID.

correlationId:
valor esperado.

requestPath:
/api/auth/login.
```

Confirme ausência de:

- username;
- password;
- token;
- hash.

---

### 22. Testar login inválido

Execute com username inexistente e password incorreta.

Os dois eventos possuem:

```text
action:
LOGIN.

outcome:
DENIED.

actorType:
ANONYMOUS.

actorId:
null.

reason:
INVALID_CREDENTIALS.
```

---

### 23. Testar bearer inválido

Apresente um token adulterado.

Valide:

```text
ACCESS_TOKEN_VALIDATION;

DENIED;

INVALID_TOKEN;

requestPath correto;

sem Authorization header.
```

Procure no banco pela substring inicial do token e confirme ausência.

---

### 24. Testar permission negada

Auditor tenta criar OS.

Valide:

```text
AUTHORIZATION;

DENIED;

MISSING_AUTHORITY;

actor UUID;

targetType HTTP_ENDPOINT.
```

A response continua `403 access_denied`.

---

### 25. Testar ownership negado

Operador B tenta ler OS de A.

Valide:

```text
AUTHORIZATION;

DENIED;

RESOURCE_CONCEALED;

actor B;

target SERVICE_ORDER;

targetId da OS A.
```

A response continua `404 service_order_not_found`.

O target pode ser registrado no audit trail restrito.

---

### 26. Testar create, update, status e delete

Para cada operação:

- execute com permissão;
- valide o estado de negócio;
- valide um evento `SUCCEEDED`;
- valide actor e target;
- valide correlation ID.

Não registre o body da alteração.

---

### 27. Testar rollback

Force uma falha de negócio depois do início da transação.

Exemplo:

```text
versão ETag inválida;

transição de status proibida.
```

Valide:

```text
nenhum evento SUCCEEDED.
```

Se a aplicação auditar falhas de negócio no futuro, use outcome `FAILED` em transação separada.

Nesta aula, não registre toda validation funcional.

---

### 28. Testar falha obrigatória do audit sink

Em um teste controlado, faça `SecurityAuditStore.append` lançar uma exception durante create.

Valide:

```text
create falha;

OS não persiste;

response não afirma sucesso.
```

Isso comprova fail closed para writes sensíveis.

---

### 29. Testar falha best effort

Faça o store falhar durante login inválido.

Valide:

```text
response permanece
401 invalid_credentials;

nenhuma credencial aparece no log técnico.
```

Capture o appender de teste e procure apenas:

```text
security_audit_sink_failure.
```

---

### 30. Testar reuse persistente

Fluxo:

1. login;
2. refresh T1 para T2;
3. reutilizar T1;
4. receber `401`;
5. verificar família revogada;
6. verificar T2 revogado;
7. verificar evento `REFRESH_TOKEN_REUSE`;
8. tentar T2 e receber `401`.

Esse teste comprova que a exception pública não reverte a reação interna.

---

### 31. Testar sanitização

Teste unitário:

```text
correlation ID com CR/LF:
normalizado pelo filtro.

path com caracteres de controle:
sanitizado.

path acima de 300:
truncado.

query string:
ausente.
```

SQL continua parametrizado.

---

### 32. Proibir endpoint de auditoria

Não crie:

```text
GET /api/security/audit-events.
```

Consultar o audit trail exigiria autorização própria, paginação, mascaramento, retenção, exportação e auditoria da própria consulta. Isso ficará para um requisito real.

---

### 33. Criar documentação

Arquivo:

```text
docs/security/M15_SECURITY_AUDIT.md
```

Inclua:

```markdown
# Auditoria de seguranca

## Objetivo

Reconstruir acoes e decisoes sensiveis.

## Diferenca de logs

- Application log.
- Access log.
- Trace.
- Audit trail.

## Schema

| Campo | Uso |
| ... |

## Eventos

| Action | Outcome | Actor | Target |
| ... |

## Dados proibidos

- Tokens.
- Passwords.
- Hashes.
- Authorization.
- Cookies.
- Bodies.

## Transacoes

- Writes: obrigatorio e atomico.
- Denials: REQUIRES_NEW best effort.
- Reuse: obrigatorio junto da revogacao.

## Acesso e retencao

Politica organizacional pendente.

## Producao

NO-GO sem storage protegido, alertas e retencao.
```

---

### 34. Atualizar threat model

Adicione:

```text
THR-089:
token ou password entra no audit.

THR-090:
ação sensível ocorre sem evento.

THR-091:
evento de sucesso persiste após rollback.

THR-092:
falha negada some com rollback.

THR-093:
reuse é revertido pela exception.

THR-094:
actor ou target são apagados por cascade.

THR-095:
path injeta linha no audit.

THR-096:
audit trail é acessível sem autorização.

THR-097:
sink indisponível passa despercebido.

THR-098:
retenção indefinida viola privacidade.
```

Controles:

- schema fechado;
- dados proibidos;
- mesma transação;
- `REQUIRES_NEW`;
- decisão de refresh;
- ausência de FKs;
- sanitização;
- sem endpoint;
- erro técnico;
- política de retenção pendente.

---

### 35. Atualizar OWASP e baseline

A09 Security Logging and Alerting Failures:

```text
eventos estruturados:
implementados.

correlation ID:
implementado.

dados sensíveis:
proibidos.

alertas e SIEM:
pendentes.

tamper-evidence:
pendente.

retenção:
pendente.
```

A07 Authentication Failures:

```text
login, bearer e refresh:
auditados sem credenciais.
```

A01 Broken Access Control:

```text
permission denial
e resource concealment:
auditados.
```

Baseline:

```text
audit table:
security_audit_event.

writes sensíveis:
atômicos.

denials:
best effort.

reuse:
atômico com revogação.

produção pública:
NO-GO.
```

---

### 36. Executar o gate

Teste focado:

```powershell
.\mvnw.cmd `
  -Dtest=SecurityAuditIntegrationTest `
  test
```

Suíte de refresh:

```powershell
.\mvnw.cmd `
  -Dtest=RefreshTokenIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- Flyway V11;
- PostgreSQL real;
- login success e failure;
- invalid bearer;
- denied permission;
- concealed resource;
- writes;
- rollback;
- sink failure policies;
- reuse persistente;
- ausência de credentials;
- nenhum endpoint de auditoria;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### O audit trail ganhou um objetivo próprio

Ele não foi misturado com logs técnicos.

### O schema ficou fechado

Actions, outcomes e reasons não vêm do cliente.

### Actor e target permaneceram históricos

A ausência de foreign keys evita cascade de evidências.

### Writes sensíveis ficaram atômicos

Operação e evento fazem commit ou rollback juntos.

### Denials sobreviveram ao fluxo de erro

`REQUIRES_NEW` preserva a tentativa sem mudar a response.

### Reuse passou a fazer commit antes do 401

A revogação não é perdida por rollback.

### Correlation ID conectou as camadas

As camadas compartilham uma referência.

### Secrets permaneceram ausentes

O evento registra o fato.

---

## Erros comuns importantes

### Usar logger.info como única auditoria

Logs podem mudar de formato, destino e retenção.

### Registrar request ou response inteira

Tokens e dados pessoais podem vazar.

### Registrar username tentado em toda falha

Isso aumenta exposição e risco de enumeração interna.

### Gravar sucesso antes da operação

O audit trail pode mentir após rollback.

### Auditar reuse e lançar exception na mesma transação

A revogação pode ser revertida.

### Colocar foreign key com cascade

Excluir target pode apagar histórico.

### Criar um mapa metadata livre

Qualquer dado pode entrar sem revisão.

### Tornar auditoria assíncrona sem fila durável

Eventos podem desaparecer.

### Criar endpoint de consulta cedo demais

O próprio audit trail vira um ativo exposto.

### Ignorar falha do sink

A aplicação perde accountability sem detecção.

---

## Comandos úteis

### Teste de auditoria

```powershell
.\mvnw.cmd `
  -Dtest=SecurityAuditIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar credentials em audit code

```powershell
git grep `
  -n `
  -E `
  "SecurityAudit.*(token|password|Authorization|Cookie)"
```

### Consultar eventos

```sql
select
    occurred_at,
    action,
    outcome,
    actor_type,
    actor_id,
    target_type,
    target_id,
    reason_code,
    correlation_id
from
    security_audit_event
order by
    occurred_at desc
limit 100;
```

### Procurar payload livre

```powershell
git grep `
  -n `
  -E `
  "security_audit_event.*jsonb|metadata"
```

---

## Exercício guiado

### Parte 1 — Taxonomia

Separe audit trail, logs, traces e métricas.

### Parte 2 — Schema

Crie campos mínimos sem secrets.

### Parte 3 — Persistência

Use SQL parametrizado e append-only na aplicação.

### Parte 4 — Contexto

Resolva actor, target, correlation ID e path seguro.

### Parte 5 — Transações

Separe writes obrigatórios e denials best effort.

### Parte 6 — Autenticação

Audite login e bearer inválido.

### Parte 7 — Autorização

Audite permission e ownership negados.

### Parte 8 — Refresh

Garanta commit da revogação em reuse.

### Parte 9 — Testes

Comprove atomicidade e ausência de credenciais.

### Parte 10 — Governança

Documente acesso, retenção e gaps.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 429 foi preservada;
- ponte correta aponta para Secrets management;
- audit trail foi diferenciado de application log;
- JPA auditing não foi tratado como auditoria completa;
- perguntas when, who, what, target e outcome foram cobertas;
- migration V11 foi criada;
- tabela `security_audit_event` foi criada;
- schema não possui token, password ou hash;
- actor e target não possuem foreign keys;
- cascade não apaga histórico;
- indexes de tempo, actor, target e correlation foram criados;
- outcomes possuem check constraint;
- actor types possuem check constraint;
- USER exige actor ID;
- actions, outcomes, actors e reasons usam enums;
- metadata livre não foi criada;
- `SecurityAuditEvent` foi criado;
- `SecurityAuditSanitizer` foi criado;
- CR, LF e tab são neutralizados;
- tamanho de path e correlation é limitado;
- query string não é persistida;
- correlation ID normalizado foi reutilizado;
- `SecurityAuditEventFactory` foi criado;
- actor UUID vem da Authentication;
- login falho permanece anônimo;
- username tentado não é armazenado;
- `SecurityAuditStore` usa SQL parametrizado;
- store expõe somente append;
- `SecurityAuditRecorder` foi criado;
- gravação obrigatória participa da transação;
- gravação best effort usa REQUIRES_NEW;
- falha best effort não muda response pública;
- log de sink failure não contém evento completo;
- login válido foi auditado;
- login inválido foi auditado;
- bearer inválido foi auditado sem token;
- bearer ausente não gerou ruído nesta baseline;
- permission negada foi auditada;
- ownership negado foi auditado;
- create foi auditado;
- update foi auditado;
- status update foi auditado;
- delete foi auditado;
- evento de sucesso ocorre depois da operação;
- rollback não deixa evento de sucesso;
- falha de audit obrigatório reverte write;
- refresh válido foi auditado;
- refresh inválido desconhecido foi auditado sem actor;
- reuse foi auditado com família;
- decisão de refresh foi refatorada;
- revogação e evento fazem commit antes da exception pública;
- T2 permanece revogado após reuse de T1;
- access e refresh tokens não aparecem na tabela;
- hashes não aparecem na tabela;
- Authorization e cookies não aparecem;
- body e query string não aparecem;
- consultas de evidência selecionam campos explícitos;
- testes usam PostgreSQL real;
- testes usam login, JWT e refresh reais;
- teste de sink obrigatório foi criado;
- teste de sink best effort foi criado;
- sanitização foi testada;
- endpoint de auditoria não foi criado;
- documento de auditoria foi criado;
- acesso e retenção foram documentados como policy pendente;
- threat model foi atualizado;
- OWASP A01, A07 e A09 foram atualizados;
- SIEM, alertas e storage imutável não foram inventados;
- produção pública permaneceu NO-GO;
- gate completo foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git grep -n -E "SecurityAudit.*(token|password|Authorization|Cookie)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): auditar acoes sensiveis sem credenciais"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access token;
- refresh token;
- password;
- hash;
- Authorization header;
- cookie;
- request body;
- query string;
- stack trace;
- endpoint de auditoria;
- retenção inventada;
- SIEM fictício;
- secret da próxima aula.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação passou a produzir um audit trail estruturado.

Cada registro responde:

```text
quando;

quem;

qual ação;

qual target;

qual outcome;

qual categoria;

qual correlation ID.
```

O schema não armazena:

```text
credencial;

token;

password;

hash;

body;

query string;

stack trace.
```

A policy transacional ficou:

```text
write sensível:
audit obrigatório
na mesma transação.

tentativa negada:
REQUIRES_NEW
best effort.

refresh reuse:
revogação e audit
fazem commit antes do 401.
```

Ações registradas incluem:

```text
login;

validação de bearer;

refresh;

authorization denial;

create;

update;

status;

delete.
```

Decisão:

```text
auditoria precisa registrar
a ação e o resultado,
não copiar o segredo;

eventos de sucesso precisam
ser atomicamente verdadeiros,
e eventos negados precisam
sobreviver ao fluxo de erro.
```

A tabela e o código criados ainda não resolvem:

- armazenamento imutável externo;
- SIEM;
- alertas;
- retenção legal;
- segregação operacional completa;
- acesso a cofres;
- rotação de chaves;
- inventário de secrets.

O próximo passo será proteger os próprios materiais sensíveis usados pela aplicação.

A próxima aula será:

```text
431 - M15.21 - Secrets management
```

Nela, você irá:

- definir o que é secret;
- inventariar secrets do projeto;
- remover valores hardcoded;
- separar configuração e credencial;
- usar injeção por arquivo e ambiente;
- discutir secret managers;
- proteger keystore e passwords;
- planejar rotação;
- auditar acesso sem registrar valores;
- tratar vazamento e resposta a incidente.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei audit trail de log técnico.
- [ ] Criei um schema sem credenciais.
- [ ] Auditei autenticação, autorização, refresh e writes.
- [ ] Garanti atomicidade dos eventos de sucesso.
- [ ] Corrigi o commit da revogação em refresh reuse.

---

## Troubleshooting adicional

### O evento de reuse não persiste

Confirme que o método transacional retorna uma decisão e não lança a exception pública.

### A ação foi rollback, mas o evento ficou

O evento de sucesso pode estar usando REQUIRES_NEW indevidamente.

Writes precisam participar da transação de negócio.

### Login falho muda para 500 quando a tabela cai

A gravação negada deve usar best effort e capturar falha do sink.

### Password aparece no audit

Remova request body, username tentado, exception message e DTO completo.

### Target some quando a OS é excluída

Não use foreign key com cascade na tabela de auditoria.

### Correlation ID contém quebra de linha

Use o valor normalizado pelo filtro e sanitização defensiva.

### O evento de sucesso foi gravado antes do save

Mova a gravação para depois da operação aceita, ainda na mesma transação.

### A tabela cresce rapidamente

Defina retenção, particionamento e arquivamento antes da produção.

Não delete arbitrariamente sem policy.

---

## Perguntas de revisão

1. Qual é a diferença entre application log e audit trail?
2. JPA auditing é suficiente?
3. Quais perguntas um evento precisa responder?
4. Quais actor types foram criados?
5. Login falho guarda username?
6. A tabela possui foreign key para usuário?
7. Por que não?
8. Query string é armazenada?
9. Por que usar schema fechado?
10. Qual gravação é obrigatória?
11. Qual gravação usa best effort?
12. O que ocorre se audit de write falhar?
13. O que ocorre se audit de login falho falhar?
14. Como reuse evita rollback?
15. O token é armazenado?
16. Qual campo liga response e auditoria?
17. Existe endpoint de consulta?
18. Retenção definitiva foi definida?
19. Qual é a próxima aula?
20. O que ela protegerá?

---

## Roteiro de resposta

1. Diagnóstico técnico versus accountability.
2. Não.
3. Quando, quem, ação, target, resultado e contexto.
4. ANONYMOUS, USER e SYSTEM.
5. Não.
6. Não.
7. Preservar histórico após exclusão.
8. Não.
9. Evitar dados arbitrários.
10. Write sensível e reuse.
11. Tentativas negadas.
12. A operação faz rollback.
13. A response é preservada e o sink failure é logado.
14. Commit ocorre antes da exception externa.
15. Não.
16. Correlation ID.
17. Não.
18. Não.
19. Secrets management.
20. Credenciais, chaves e materiais sensíveis.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 430 - M15.20 - Auditoria de acoes sensiveis

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei audit trail, application log, access log, trace e métrica.
- Registrei que JPA auditing não cobre eventos de segurança.
- Modelei actor, action, target, outcome, reason e correlation ID.
- Criei `V11__create_security_audit_event.sql`.
- Criei a tabela `security_audit_event`.
- Não criei foreign keys para actor ou target.
- Criei constraints para outcome e actor type.
- Criei indexes para tempo, actor, target e correlation.
- Criei enums fechados de auditoria.
- Não criei metadata livre.
- Criei `SecurityAuditEvent`.
- Criei `SecurityAuditSanitizer`.
- Neutralizei CR, LF e tab.
- Não armazenei query string.
- Criei `SecurityAuditEventFactory`.
- Usei o subject UUID como actor.
- Mantive login falho como anônimo.
- Não armazenei username tentado.
- Criei `SecurityAuditStore` com SQL parametrizado.
- Criei `SecurityAuditRecorder`.
- Usei audit obrigatório na transação de writes.
- Usei REQUIRES_NEW best effort em tentativas negadas.
- Auditei login válido e inválido.
- Auditei bearer inválido sem guardar token.
- Auditei permission e ownership negados.
- Auditei create, update, status e delete.
- Garanti que rollback não deixa evento de sucesso.
- Garanti que falha de audit obrigatório reverte write.
- Refatorei a rotação para retornar decisão.
- Garanti commit da revogação antes do `401`.
- Auditei refresh válido e reuse.
- Testei sink failure obrigatório e best effort.
- Testei ausência de token, password, hash, body e query.
- Não criei endpoint de consulta de auditoria.
- Criei `docs/security/M15_SECURITY_AUDIT.md`.
- Atualizei baseline, threat model e OWASP.
- Mantive SIEM, alertas e retenção como gaps de produção.
- Próxima aula: Secrets management.
```

---

## Referência técnica curta

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet — Audit logs](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#audit-logs)
- [OWASP Authentication Cheat Sheet — Logging and Monitoring](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#logging-and-monitoring)
- [Spring Data JPA — Auditing](https://docs.spring.io/spring-data/jpa/reference/auditing.html)
- [Spring Framework — Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html)

Regra final:

```text
auditoria de segurança precisa formar uma trilha cronológica, estruturada e minimizada: nesta baseline, cada evento registra actor, action, target, outcome, reason e correlation ID, nunca tokens, passwords, hashes ou payloads; writes sensíveis e reuse exigem audit atômico na mesma transação, tentativas negadas usam REQUIRES_NEW best effort sem alterar a response pública, o schema evita foreign keys que apagariam histórico, entradas são sanitizadas e parametrizadas, e qualquer falha do sink precisa ser detectada sem transformar a auditoria em um novo canal de vazamento.
```
