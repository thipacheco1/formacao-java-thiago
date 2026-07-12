# 448 - M15.38 - Projeto API segura parte 2

## Apresentação da aula

Na parte 1 do projeto, a API segura de solicitações de acesso nasceu com uma primeira fatia vertical completa.

O projeto já possui:

```text
OAuth 2.0 Resource Server;

JWT do Keycloak;

issuer exato;

audience secure-access-api;

identidade local por issuer + subject;

usuário provisionado;

membership ativa;

TenantContext;

permission explícita;

create;

read own;

list own;

PostgreSQL;

DTOs mínimos;

queries tenant-scoped e owner-scoped;

Problem Details;

testes negativos.
```

O requester não controla:

- tenant;
- owner;
- status;
- version;
- timestamps.

Solicitações inexistentes, de outro usuário ou de outro tenant produzem o mesmo:

```text
404 access_request_not_found.
```

A criação sempre começa em:

```text
PENDING.
```

Agora o sistema precisa permitir que uma pessoa autorizada tome uma decisão.

Isso cria novas ameaças.

Exemplos:

```text
requester aprova
a própria solicitação;

reviewer do tenant Alpha
decide solicitação do Beta;

auditor altera o workflow;

duas pessoas decidem
ao mesmo tempo;

payload define reviewer;

payload força status APPROVED;

decisão é repetida;

audit registra justification;

review endpoint sofre abuso;

response revela outro tenant.
```

A pergunta central desta aula será:

```text
como implementar aprovação
e rejeição com segregação
de funções, concorrência,
auditoria e rate limiting,
sem enfraquecer ownership
e isolamento por tenant?
```

A parte 2 adicionará:

```text
review queue;

approval;

rejection;

review permission;

audit permission;

segregation of duties;

If-Match;

optimistic locking;

audit trail completo;

rate limiting com Redis;

matriz de autorização ampliada;

testes de concorrência.
```

A parte 2 não concluirá ainda:

- hardening final;
- SBOM e SCA específicos do projeto;
- checklist completo de release;
- backup e restore;
- testes de carga;
- documentação operacional final;
- implantação;
- produção pública.

Esses itens ficam para:

```text
449 - M15.39 - Projeto API segura parte 3.
```

Os novos atores serão:

```text
REVIEWER:
consulta fila e decide.

AUDITOR:
consulta solicitações
e audit trail no tenant.

TENANT_ADMIN:
possui permissions explícitas
de review e audit.

REQUESTER:
continua criando
e consultando as próprias.
```

As novas permissions serão:

```text
access-request:review;

access-request:audit.
```

Roles continuarão organizando responsabilidades.

A decisão real continuará baseada em authorities exatas.

O fluxo de decisão será:

```text
JWT;

identidade local;

tenant;

permission review;

rate limit;

lookup tenant-scoped;

segregation of duties;

If-Match;

status PENDING;

approve ou reject;

persistência;

audit obrigatório;

response.
```

A regra de segregação será:

```text
requester_user_id
não pode ser igual
a reviewer_user_id.
```

Essa regra vale também para:

- reviewer;
- tenant admin;
- qualquer role futura;
- global admin futuro.

Possuir mais privilégio não elimina segregação de funções.

A parte 2 terminará quando:

- reviewer consulta somente a fila do tenant;
- requester não aparece na própria fila de revisão;
- approval e rejection funcionam apenas em `PENDING`;
- self-review é negado;
- auditor não decide;
- tenant não é atravessado;
- decisões concorrentes não produzem dois resultados;
- audit registra fatos sem copiar payload;
- Redis limita abuso;
- testes comprovam os controles.

---

## Onde estamos na formação

A sequência oficial é:

```text
446:
Checklist seguranca em PR.

447:
Projeto API segura parte 1.

448:
Projeto API segura parte 2.

449:
Projeto API segura parte 3.

450:
Revisao seguranca parte 1.

451:
Revisao seguranca parte 2.
```

A parte 1 respondeu:

```text
como criar e consultar
solicitações próprias
com identidade e tenant?
```

A parte 2 responderá:

```text
como decidir solicitações
com segregação,
concorrência e auditoria?
```

Nesta aula:

```text
review queue:
sim.

approval:
sim.

rejection:
sim.

self-review:
bloqueado.

auditor:
read-only.

tenant admin:
permission explícita.

If-Match:
sim.

optimistic locking:
sim.

Redis:
sim.

audit completo:
sim.

hardening final:
parte 3.
```

A regra central será:

```text
uma decisão sensível
precisa provar
quem decidiu,
em qual tenant,
sobre qual recurso,
em qual versão
e sem conflito de interesse.
```

---

## Objetivo prático

Ao final da aula, o projeto terá migrations:

```text
V3__add_access_request_review.sql;

V4__expand_security_audit.sql.
```

Novos tipos:

```text
domain/accessrequest/
├── AccessRequestDecision.java
├── AccessRequestDecisionReason.java
└── AccessRequestReviewPolicy.java
```

Aplicação:

```text
application/accessrequest/
├── ReviewAccessRequestCommand.java
├── AccessRequestReviewService.java
├── AccessRequestAuditQueryService.java
└── AccessRequestReviewRateLimitService.java
```

Web:

```text
web/v1/accessrequest/
├── ReviewAccessRequestRequest.java
├── AccessRequestReviewResponse.java
├── AccessRequestAuditResponse.java
└── AccessRequestReviewController.java
```

Infraestrutura Redis:

```text
configuration/ratelimit/
├── ReviewRateLimitPolicy.java
├── RedisReviewRateLimiter.java
└── ReviewRateLimitKeyFactory.java
```

Endpoints:

```text
GET /api/v1/access-requests/review-queue;

POST /api/v1/access-requests/{id}/decision;

GET /api/v1/access-requests/{id}/audit.
```

Testes:

```text
AccessRequestReviewQueueTest;

AccessRequestDecisionAuthorizationTest;

AccessRequestSegregationOfDutiesTest;

AccessRequestDecisionConcurrencyTest;

AccessRequestDecisionMassAssignmentTest;

AccessRequestAuditIntegrationTest;

AccessRequestReviewRateLimitTest;

AccessRequestReviewLoggingTest.
```

Documentação:

```text
docs/security/
├── PROJECT_REVIEW_WORKFLOW.md
├── PROJECT_SEGREGATION_OF_DUTIES.md
├── PROJECT_AUDIT_POLICY.md
└── PROJECT_REVIEW_RATE_LIMIT.md
```

Você irá:

1. ampliar o modelo;
2. criar migrations;
3. definir reviewer e auditor;
4. criar permissions;
5. criar fila de revisão;
6. excluir self-review da fila;
7. criar DTO de decisão;
8. proteger status e reviewer;
9. exigir `If-Match`;
10. aprovar;
11. rejeitar;
12. validar reason;
13. tratar concorrência;
14. criar audit completo;
15. criar consulta de audit;
16. adicionar Redis;
17. aplicar rate limiting;
18. ampliar a matriz;
19. testar logs;
20. preparar a parte 3.

---

## Conceito essencial

### Review não é update genérico

A decisão não será implementada como:

```text
PUT access request
com status editável.
```

Ela será uma operação específica:

```text
POST /{id}/decision.
```

O DTO representa uma intenção:

```text
APPROVE;

REJECT.
```

Status, reviewer e timestamps continuam server-controlled.

---

### Segregação de funções

Segregation of duties reduz o risco de uma única identidade solicitar e autorizar o mesmo privilégio.

Regra:

```text
requester != reviewer.
```

O controle precisa existir em três lugares:

1. fila exclui solicitações próprias;
2. service valida novamente;
3. teste direto comprova a regra.

Filtrar somente a fila não é suficiente.

Um atacante poderia chamar o endpoint pelo ID.

---

### Permission e role

A permission de decisão é:

```text
access-request:review.
```

A permission de auditoria é:

```text
access-request:audit.
```

`ROLE_REVIEWER`, `ROLE_AUDITOR` e `ROLE_TENANT_ADMIN` não concedem acesso sozinhas.

Exemplos obrigatórios:

```text
ROLE_REVIEWER sem permission:
403.

permission review sem role:
decisão permitida
se as demais regras passarem.

ROLE_AUDITOR com audit:
consulta audit.

ROLE_AUDITOR sem review:
não decide.
```

---

### Review queue

A fila retorna solicitações:

```text
tenant atual;

status PENDING;

requester diferente
do reviewer atual.
```

Ela não retorna:

- outro tenant;
- solicitações já decididas;
- solicitações do próprio reviewer;
- dados internos de identidade;
- audit trail completo.

A query e a count query usam os mesmos predicates.

---

### Auditoria não concede decisão

Auditor consulta fatos.

Ele não altera workflow.

A permission `access-request:audit` não implica:

```text
access-request:review.
```

O endpoint de audit usa consulta tenant-scoped.

---

### If-Match

A decisão exige a versão esperada:

```http
If-Match: "0"
```

Contratos:

```text
header ausente:
428 precondition_required.

header malformado:
400 invalid_if_match.

versão divergente:
412 precondition_failed.
```

A version não entra no JSON.

---

### Optimistic locking

If-Match reduz decisões obsoletas.

`@Version` protege a corrida real.

Duas threads podem ler version `0`.

Uma aprova e comita.

A outra tenta atualizar e recebe conflito de locking.

Contrato:

```text
409 concurrent_decision_conflict.
```

O banco termina com apenas uma decisão.

---

### Estado terminal

Parte 2 permite:

```text
PENDING -> APPROVED;

PENDING -> REJECTED.
```

Não permite:

```text
APPROVED -> REJECTED;

REJECTED -> APPROVED;

APPROVED -> APPROVED;

REJECTED -> REJECTED.
```

Com versão atual e recurso acessível, esses casos retornam:

```text
409 access_request_already_decided.
```

---

### Decision reason

Para rejeição:

```text
obrigatória;

mínimo 10;

máximo 500.
```

Para aprovação:

```text
opcional;

máximo 500.
```

O reason é dado interno do workflow.

Ele pode conter informação pessoal ou organizacional.

Não entra em logs.

---

### Tenant scope do reviewer

Reviewer vê qualquer requester do mesmo tenant, exceto a si próprio.

Reviewer Alpha nunca opera no Beta.

Mesmo que o UUID seja conhecido:

```text
404 access_request_not_found.
```

Não faça lookup global para explicar o tenant.

---

### Auditoria obrigatória

Approval e rejection são writes sensíveis.

O audit de sucesso ocorre na mesma transação.

Campos:

```text
event ID;

occurredAt;

actorUserId;

tenantId;

targetType;

targetId;

action;

outcome;

reasonCode;

beforeStatus;

afterStatus;

correlationId.
```

Não armazene:

- justification;
- decision reason;
- token;
- claims;
- body;
- headers;
- e-mail;
- subject.

---

### Auditoria de negação

Self-review, permission denial e rate limit podem gerar eventos de negação.

Esses eventos usam transação separada best effort quando a policy exigir.

Não crie um evento para cada request permitida.

---

### Rate limiting de review

Policies da parte 2:

| Operação | Dimensão | Curto | Sustentado |
|---|---|---:|---:|
| Create | user + tenant | 5/h | 20/dia |
| Review decision | reviewer + tenant | 20/5 min | 200/dia |
| Review queue | reviewer + tenant | 60/min | 1000/dia |
| Audit query | auditor + tenant | 30/min | 300/dia |

Os números são didáticos.

Produção exige calibração.

---

### Fail-closed

Review e audit são operações sensíveis.

Se Redis não puder decidir:

```text
503 security_rate_limiter_unavailable.
```

A decisão não continua.

Read own da parte 1 pode permanecer sem esse limitador específico nesta etapa.

---

### Key privacy

Redis não recebe user ID ou tenant ID raw.

A key usa:

```text
HMAC-SHA-256;

policy;

userId;

tenantId;

versão da chave.
```

A chave HMAC vem de secret.

---

### Idempotência sem falsa promessa

A decisão não será tratada como idempotente por repetição cega.

Depois de aprovada, outra decisão retorna conflito de estado.

O client deve ler a representação atual.

Não retorne sucesso para uma segunda decisão diferente.

---

## Mão na massa guiada

### 1. Atualizar requisitos

Em:

```text
PROJECT_SECURITY_REQUIREMENTS.md
```

Adicione:

```text
PSR-AUTHZ-004:
review exige permission.

PSR-AUTHZ-005:
requester não revisa
a própria solicitação.

PSR-AUTHZ-006:
auditor não decide.

PSR-TENANT-002:
review permanece no tenant.

PSR-CONC-001:
decision exige If-Match.

PSR-CONC-002:
apenas uma decisão vence.

PSR-AUDIT-001:
decisão produz audit atômico.

PSR-RATE-001:
review possui rate limit.

PSR-LOG-001:
reason não entra em log.
```

---

### 2. Atualizar o threat model

Adicione:

```text
PTH-015:
self-approval.

PTH-016:
auditor altera workflow.

PTH-017:
reviewer atravessa tenant.

PTH-018:
duas decisões são persistidas.

PTH-019:
body define reviewer.

PTH-020:
body define status.

PTH-021:
decision reason aparece em log.

PTH-022:
audit copia payload.

PTH-023:
review endpoint sofre abuso.

PTH-024:
fila inclui solicitações próprias.

PTH-025:
count vaza outro tenant.

PTH-026:
stale client sobrescreve decisão.
```

Ligue cada ameaça a controle e teste.

---

### 3. Criar V3 de review

```sql
alter table access_request
    add column reviewer_user_id uuid null,
    add column decision_reason varchar(500) null,
    add column reviewed_at timestamptz null;

alter table access_request
    add constraint fk_access_request_reviewer
        foreign key (reviewer_user_id)
        references application_user(id);

alter table access_request
    add constraint ck_access_request_review_state
        check (
            (
                status = 'PENDING'
                and reviewer_user_id is null
                and reviewed_at is null
            )
            or
            (
                status in ('APPROVED', 'REJECTED')
                and reviewer_user_id is not null
                and reviewed_at is not null
            )
        );

create index ix_access_request_review_queue
    on access_request (
        tenant_id,
        status,
        created_at,
        id
    );
```

O check impede estados incompletos.

---

### 4. Criar V4 de auditoria

```sql
create table security_audit_event (
    id uuid primary key,
    occurred_at timestamptz not null,
    actor_user_id uuid null,
    tenant_id uuid null,
    target_type varchar(80) not null,
    target_id uuid null,
    action varchar(100) not null,
    outcome varchar(30) not null,
    reason_code varchar(100) null,
    before_status varchar(30) null,
    after_status varchar(30) null,
    correlation_id varchar(100) not null
);

create index ix_security_audit_target
    on security_audit_event (
        tenant_id,
        target_type,
        target_id,
        occurred_at
    );

create index ix_security_audit_actor
    on security_audit_event (
        tenant_id,
        actor_user_id,
        occurred_at
    );
```

Não crie coluna de payload.

---

### 5. Criar AccessRequestDecision

```java
public enum AccessRequestDecision {
    APPROVE,
    REJECT
}
```

O enum não expõe os status diretamente.

O aggregate traduz a intenção.

---

### 6. Criar ReviewAccessRequestRequest

```java
public record ReviewAccessRequestRequest(
        @NotNull
        AccessRequestDecision decision,

        @Size(
            max = 500
        )
        String reason
) {
}
```

A validação condicional fica no command ou policy.

O DTO não possui:

- status;
- reviewer ID;
- reviewedAt;
- version;
- tenant;
- owner.

---

### 7. Criar ReviewAccessRequestCommand

```java
public record ReviewAccessRequestCommand(
        AccessRequestDecision decision,
        String reason
) {
    public ReviewAccessRequestCommand {
        Objects.requireNonNull(
                decision
        );

        reason =
                normalizeReason(
                        reason
                );

        if (
            decision == AccessRequestDecision.REJECT
            && (
                reason == null
                || reason.length() < 10
            )
        ) {
            throw new InvalidDecisionReasonException();
        }

        if (
            reason != null
            && reason.length() > 500
        ) {
            throw new InvalidDecisionReasonException();
        }
    }
}
```

---

### 8. Criar AccessRequestReviewPolicy

```java
@Component
public class AccessRequestReviewPolicy {

    public void requireDifferentActor(
            AccessRequest request,
            TenantContext reviewer
    ) {
        if (
            request.getRequesterUserId()
                   .equals(
                       reviewer.userId()
                   )
        ) {
            throw new SelfReviewForbiddenException();
        }
    }
}
```

Não dependa apenas da fila.

---

### 9. Criar approve no aggregate

```java
public void approve(
        UUID reviewerUserId,
        String reason,
        Instant now
) {
    requirePending();

    requireDifferentUser(
            reviewerUserId
    );

    this.status =
            AccessRequestStatus.APPROVED;

    this.reviewerUserId =
            reviewerUserId;

    this.decisionReason =
            normalizeDecisionReason(
                    reason
            );

    this.reviewedAt = now;
    this.updatedAt = now;
}
```

A entity não recebe tenant ou version.

---

### 10. Criar reject

```java
public void reject(
        UUID reviewerUserId,
        String reason,
        Instant now
) {
    requirePending();

    requireDifferentUser(
            reviewerUserId
    );

    String normalized =
            requireRejectionReason(
                    reason
            );

    this.status =
            AccessRequestStatus.REJECTED;

    this.reviewerUserId =
            reviewerUserId;

    this.decisionReason =
            normalized;

    this.reviewedAt = now;
    this.updatedAt = now;
}
```

Rejeição sem reason falha.

---

### 11. Criar query da fila

```java
Page<AccessRequest>
findAllByTenantIdAndStatusAndRequesterUserIdNot(
        UUID tenantId,
        AccessRequestStatus status,
        UUID reviewerUserId,
        Pageable pageable
);
```

Use:

```text
status PENDING.
```

A count query herda os mesmos predicates.

---

### 12. Criar lookup de review

```java
Optional<AccessRequest>
findByIdAndTenantId(
        UUID id,
        UUID tenantId
);
```

O reviewer pode operar solicitações de outros owners no mesmo tenant.

Self-review será validado depois do lookup.

Outro tenant continua invisível.

---

### 13. Criar AccessRequestReviewService

```java
@Service
public class AccessRequestReviewService {

    @PreAuthorize(
        "hasAuthority('access-request:review')"
    )
    @Transactional
    public AccessRequestResult decide(
            TenantContext reviewer,
            UUID accessRequestId,
            long expectedVersion,
            ReviewAccessRequestCommand command
    ) {
        rateLimit.requireDecisionAllowed(
                reviewer
        );

        AccessRequest request =
                repository
                    .findByIdAndTenantId(
                        accessRequestId,
                        reviewer.tenantId()
                    )
                    .orElseThrow(
                        AccessRequestNotFoundException::new
                    );

        reviewPolicy.requireDifferentActor(
                request,
                reviewer
        );

        versionPolicy.requireExpected(
                request.getVersion(),
                expectedVersion
        );

        AccessRequestStatus before =
                request.getStatus();

        switch (command.decision()) {
            case APPROVE ->
                request.approve(
                    reviewer.userId(),
                    command.reason(),
                    clock.instant()
                );

            case REJECT ->
                request.reject(
                    reviewer.userId(),
                    command.reason(),
                    clock.instant()
                );
        }

        auditRecorder.recordRequired(
                reviewAuditEvent(
                    request,
                    reviewer,
                    before
                )
        );

        return AccessRequestResult.from(
                request
        );
    }
}
```

O audit participa da transação.

---

### 14. Exigir If-Match

Controller:

```java
@PostMapping(
    path = "/{accessRequestId}/decision",
    consumes = MediaType.APPLICATION_JSON_VALUE
)
ResponseEntity<AccessRequestReviewResponse> decide(
        JwtAuthenticationToken authentication,
        @RequestHeader(
            name = "X-Tenant-Id",
            required = false
        )
        String selectedTenant,
        @RequestHeader(
            HttpHeaders.IF_MATCH
        )
        String ifMatch,
        @PathVariable
        UUID accessRequestId,
        @Valid
        @RequestBody
        ReviewAccessRequestRequest request
) {
    var user =
            authenticatedUserResolver.resolve(
                authentication
            );

    var tenant =
            tenantContextResolver.resolve(
                user,
                selectedTenant
            );

    long expectedVersion =
            etagParser.requireVersion(
                ifMatch
            );

    var result =
            reviewService.decide(
                tenant,
                accessRequestId,
                expectedVersion,
                mapper.toCommand(
                    request
                )
            );

    return responseFactory.okWithEtag(
            mapper.toReviewResponse(
                result
            ),
            result.version()
    );
}
```

---

### 15. Criar response de review

```java
public record AccessRequestReviewResponse(
        UUID id,
        String targetApplication,
        RequestedAccessLevel requestedAccessLevel,
        AccessRequestStatus status,
        UUID reviewerUserId,
        String decisionReason,
        Instant reviewedAt,
        Instant updatedAt
) {
}
```

Esse response é destinado a reviewer e auditor.

O requester pode receber uma visão própria sem reviewer ID quando a policy exigir minimização.

Na parte 2, documente os dois contracts.

---

### 16. Criar review queue endpoint

```java
@GetMapping("/review-queue")
@PreAuthorize(
    "hasAuthority('access-request:review')"
)
PageResponse<AccessRequestReviewResponse>
reviewQueue(
        JwtAuthenticationToken authentication,
        @RequestHeader(
            name = "X-Tenant-Id",
            required = false
        )
        String selectedTenant,
        Pageable pageable
) {
    TenantContext reviewer =
            contextFactory.resolve(
                authentication,
                selectedTenant
            );

    rateLimit.requireQueueAllowed(
            reviewer
    );

    return mapper.toPage(
        reviewService.listPending(
            reviewer,
            pageable
        )
    );
}
```

A service também possui `@PreAuthorize`.

---

### 17. Criar audit endpoint

```java
@GetMapping(
    "/{accessRequestId}/audit"
)
@PreAuthorize(
    "hasAuthority('access-request:audit')"
)
List<AccessRequestAuditResponse> audit(
        JwtAuthenticationToken authentication,
        @RequestHeader(
            name = "X-Tenant-Id",
            required = false
        )
        String selectedTenant,
        @PathVariable
        UUID accessRequestId
) {
    TenantContext auditor =
            contextFactory.resolve(
                authentication,
                selectedTenant
            );

    rateLimit.requireAuditAllowed(
            auditor
    );

    return auditQueryService.findForTarget(
            auditor,
            accessRequestId
    );
}
```

A query valida que o target pertence ao tenant.

---

### 18. Criar audit response

```java
public record AccessRequestAuditResponse(
        UUID eventId,
        Instant occurredAt,
        String action,
        String outcome,
        String reasonCode,
        AccessRequestStatus beforeStatus,
        AccessRequestStatus afterStatus,
        String correlationId
) {
}
```

Não retorne actor ID ao requester.

O endpoint é restrito a auditor.

---

### 19. Adicionar Redis

No `pom.xml`:

```text
spring-boot-starter-data-redis.
```

No `compose.yaml`, adicione Redis com:

- imagem fixa;
- healthcheck;
- rede local;
- sem porta pública em produção;
- volume somente quando necessário;
- password por secret se usado.

Nos testes, use Testcontainers Redis.

---

### 20. Criar key HMAC

```java
String createKey(
        String policy,
        TenantContext context
) {
    String material =
            context.tenantId()
            + "\n"
            + context.userId();

    String digest =
            hmac.hash(
                policy,
                material
            );

    return "secure-access:rl:{"
            + digest
            + "}:"
            + policy;
}
```

Nenhum UUID raw entra no Redis.

---

### 21. Criar policy de decisão

```text
review-decision:

20 requests
por 5 minutos;

200 requests
por 24 horas;

fail-closed.
```

O script Lua reutiliza a estratégia da aula 439.

Não copie keys ou valores sensíveis para logs.

---

### 22. Criar policy de fila

```text
review-queue:

60 requests
por minuto;

1000 requests
por dia;

fail-closed.
```

A listagem é menos sensível que a decisão, mas ainda possui custo e dados internos.

---

### 23. Criar policy de audit

```text
audit-query:

30 requests
por minuto;

300 requests
por dia;

fail-closed.
```

Auditoria pode conter contexto de segurança.

Não deixe consulta ilimitada.

---

### 24. Padronizar respostas de rate limit

Excesso:

```text
429 rate_limit_exceeded;

Retry-After;

Cache-Control: no-store.
```

Redis indisponível:

```text
503 security_rate_limiter_unavailable;

Retry-After: 5.
```

A operação não continua.

---

### 25. Tratar stale ETag

Antes da mutação:

```text
expected != current:
412 precondition_failed.
```

Body público:

```text
sem versão atual;

sem versão esperada;

sem estado interno.
```

O client recebe a representação atual por nova leitura autorizada.

---

### 26. Tratar race real

Capture:

```text
ObjectOptimisticLockingFailureException.
```

Mapeie para:

```text
409 concurrent_decision_conflict.
```

Não retente automaticamente uma decisão.

Retry automático poderia aplicar uma decisão sobre estado diferente.

---

### 27. Criar audit events

Approval:

```text
ACCESS_REQUEST_APPROVED;

SUCCESS;

before PENDING;

after APPROVED.
```

Rejection:

```text
ACCESS_REQUEST_REJECTED;

SUCCESS;

before PENDING;

after REJECTED.
```

Self-review:

```text
ACCESS_REQUEST_REVIEW_DENIED;

DENIED;

SELF_REVIEW_FORBIDDEN.
```

Não grave decision reason.

---

### 28. Criar audit recorder obrigatório

```java
@Transactional(
    propagation = Propagation.MANDATORY
)
public void recordRequired(
        SecurityAuditEvent event
) {
    repository.save(
        entityMapper.toEntity(
            event
        )
    );
}
```

Se o audit obrigatório falhar:

```text
a decisão faz rollback.
```

Isso evita decisão sem trilha.

---

### 29. Criar audit denial best effort

```java
@Transactional(
    propagation = Propagation.REQUIRES_NEW
)
public void recordDeniedBestEffort(
        SecurityAuditEvent event
) {
    try {
        repository.save(
            mapper.toEntity(
                event
            )
        );
    }
    catch (RuntimeException exception) {
        safeLogger.auditFailure(
            event.action(),
            event.correlationId()
        );
    }
}
```

O logger não recebe target ou reason raw.

---

### 30. Criar AccessRequestReviewQueueTest

Cenários:

- reviewer vê pending de outros requesters;
- não vê as próprias;
- não vê approved;
- não vê rejected;
- não vê outro tenant;
- count e pages são scoped;
- sem permission recebe `403`;
- anônimo recebe `401`.

---

### 31. Criar AccessRequestSegregationOfDutiesTest

Chame diretamente o endpoint com ID da própria solicitação.

Esperado:

```text
403 self_review_forbidden;

status continua PENDING;

reviewer continua null;

audit success ausente;

denial audit presente
conforme policy.
```

Repita para tenant admin.

---

### 32. Criar AccessRequestDecisionAuthorizationTest

Casos:

```text
reviewer + permission:
permitido.

ROLE_REVIEWER sem permission:
403.

permission sem role:
permitido.

auditor sem review:
403.

requester sem review:
403.

outro tenant:
404.

identity não provisionada:
403.
```

As permissions são exatas.

---

### 33. Criar AccessRequestDecisionMassAssignmentTest

Payload malicioso:

```json
{
  "decision": "APPROVE",
  "reason": "Aprovado.",
  "status": "APPROVED",
  "reviewerUserId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "reviewedAt": "2026-07-12T01:00:00Z",
  "tenantId": "20000000-0000-0000-0000-000000000002",
  "version": 999
}
```

Esperado:

```text
400 unknown_request_property;

nenhuma decisão;

nenhum audit success.
```

---

### 34. Testar reason

Approval:

```text
reason ausente:
permitido.

reason até 500:
permitido.
```

Rejection:

```text
reason ausente:
400 invalid_decision_reason.

reason menor que 10:
400.

reason maior que 500:
400.
```

Nenhum reason aparece em log.

---

### 35. Criar AccessRequestDecisionConcurrencyTest

Use duas threads e barreira.

Ambas leem version `0`.

Uma aprova.

Outra rejeita.

Esperado:

```text
uma response de sucesso;

uma falha 409;

um status terminal;

um reviewer;

um reviewedAt;

um audit de sucesso;

nenhuma dupla decisão.
```

Execute com PostgreSQL real.

---

### 36. Testar stale If-Match

Decida a solicitação.

Envie outra decisão com:

```text
If-Match: "0".
```

Esperado:

```text
412 precondition_failed.
```

O service não chama `approve` ou `reject`.

---

### 37. Testar estado terminal com versão atual

Leia o ETag atualizado.

Envie nova decisão.

Esperado:

```text
409 access_request_already_decided.
```

Isso diferencia estado terminal de versão stale.

---

### 38. Criar AccessRequestAuditIntegrationTest

Valide:

- creation event;
- approval event;
- rejection event;
- actor;
- tenant;
- target;
- before;
- after;
- correlation ID;
- ordem por tempo;
- ausência de justification;
- ausência de reason;
- ausência de token.

Auditor Beta não consulta Alpha.

---

### 39. Criar AccessRequestReviewRateLimitTest

Com Redis real:

- requests até o limite;
- próxima recebe `429`;
- `Retry-After`;
- TTL libera;
- Redis indisponível produz `503`;
- decisão não consulta repository;
- UUIDs raw não aparecem nas keys;
- logs não contêm sentinelas.

---

### 40. Criar AccessRequestReviewLoggingTest

Sentinelas:

```text
decision-reason-secret-sentinel;

justification-secret-sentinel;

token-secret-sentinel;

subject-secret-sentinel.
```

Execute:

- queue;
- approve;
- reject;
- self-review;
- rate limit;
- audit query;
- optimistic conflict.

Nenhuma sentinela aparece.

---

### 41. Ampliar a matriz de autorização

Em:

```text
PROJECT_AUTHORIZATION_MODEL.md
```

Adicione:

| Actor | Queue | Decide other | Decide own | Audit |
|---|---:|---:|---:|---:|
| Requester | 403 | 403 | 403 | 403 |
| Reviewer | 200 | 200 | 403 | 403 |
| Auditor | 403 | 403 | 403 | 200 |
| Tenant Admin com permissions | 200 | 200 | 403 | 200 |
| Cross tenant | vazio/404 | 404 | 404 | 404 |

Permissions continuam explícitas.

---

### 42. Atualizar o checklist do projeto

Para o PR da parte 2, classifique:

```text
CRITICAL.
```

Motivos:

- autorização;
- workflow;
- audit;
- Redis;
- concorrência;
- dados internos.

Evidências obrigatórias:

- threat model;
- matriz;
- testes negativos;
- concurrency test;
- rate limit;
- audit;
- rollback;
- gate completo.

---

### 43. Criar rollback e forward-fix

V3 adiciona colunas nullable.

A aplicação antiga continua funcionando durante rollout.

Sequência:

```text
migration;

nova aplicação;

uso das colunas;

constraints já compatíveis.
```

Se houver falha após deploy:

```text
rollback da aplicação;

colunas permanecem sem uso;

forward-fix preferido.
```

Não remova colunas em rollback imediato.

---

### 44. Atualizar OpenAPI

Documente:

```text
review queue;

decision request;

audit response;

If-Match;

ETag;

401;

403;

404;

409;

412;

428;

429;

503.
```

Não exponha schemas internos de audit.

---

### 45. Atualizar collections

Cenários:

- queue;
- approve;
- reject;
- self-review;
- auditor;
- cross-tenant;
- stale ETag;
- concurrent conflict;
- rate limit;
- Redis unavailable.

Use dados sintéticos.

Não salve tokens no Git.

---

### 46. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=AccessRequestReviewQueueTest,AccessRequestDecisionAuthorizationTest,AccessRequestSegregationOfDutiesTest,AccessRequestDecisionConcurrencyTest,AccessRequestDecisionMassAssignmentTest,AccessRequestAuditIntegrationTest,AccessRequestReviewRateLimitTest,AccessRequestReviewLoggingTest `
  test
```

---

### 47. Executar regressão da parte 1

```powershell
.\mvnw.cmd `
  -Dtest=AccessRequestCreationIntegrationTest,AccessRequestReadSecurityTest,AccessRequestListSecurityTest,JwtBoundarySecurityTest,TenantContextSecurityTest `
  test
```

Create, read own e list own precisam continuar funcionando.

---

### 48. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- migrations;
- queue;
- permissions;
- self-review;
- tenant;
- ownership;
- If-Match;
- locking;
- state;
- audit;
- Redis;
- logs;
- matrices;
- OpenAPI;
- collections;
- regressão;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### O workflow ganhou uma operação específica

Decision não é update genérico.

### Segregação foi aplicada em profundidade

Fila, service e testes impedem self-review.

### Roles e permissions permaneceram separadas

Reviewer sem permission não decide; permission correta pode funcionar sem role mágica.

### O tenant continuou como fronteira

Reviewer, auditor e tenant admin não atravessam organizações.

### Concorrência virou requisito

If-Match protege clientes stale e `@Version` protege corridas reais.

### Audit passou a ser atomicamente verdadeiro

Uma decisão bem-sucedida não existe sem evento obrigatório.

### Redis protegeu review e audit

Abuso e indisponibilidade possuem contratos explícitos.

### A parte 1 não regrediu

Requester continua vendo somente seus recursos.

---

## Erros comuns importantes

### Colocar status no DTO

O client passaria a controlar o workflow.

### Filtrar self-review somente na fila

O endpoint direto pelo ID ainda permitiria bypass.

### Dar review ao auditor

Leitura de audit não implica mutação.

### Permitir tenant admin revisar a própria solicitação

Privilégio não elimina segregação.

### Confiar apenas em If-Match

Duas transações podem passar pelo mesmo check antes do commit.

### Retentar decisão automaticamente

O estado pode ter mudado.

### Logar reason

O texto pode conter dados internos ou pessoais.

### Copiar body para audit

Audit trail deixa de ser metadata segura.

### Falhar aberto sem Redis

A fronteira de abuso desaparece.

### Usar count sem predicates

A fila revela volume de outro tenant ou requester.

---

## Comandos úteis

### Testes de review

```powershell
.\mvnw.cmd `
  -Dtest=AccessRequestReviewQueueTest,AccessRequestDecisionAuthorizationTest,AccessRequestSegregationOfDutiesTest `
  test
```

### Concorrência

```powershell
.\mvnw.cmd `
  -Dtest=AccessRequestDecisionConcurrencyTest `
  test
```

### Audit e rate limit

```powershell
.\mvnw.cmd `
  -Dtest=AccessRequestAuditIntegrationTest,AccessRequestReviewRateLimitTest,AccessRequestReviewLoggingTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar vazamentos

```powershell
git grep `
  -n `
  -E `
  "log\\..*(decisionReason|justification|token|subject)|audit.*payload"
```

---

## Exercício guiado

### Parte 1 — Workflow

Crie decision, approval e rejection.

### Parte 2 — SoD

Impeça requester e reviewer iguais.

### Parte 3 — Authorization

Separe review e audit permissions.

### Parte 4 — Tenancy

Mantenha queue e lookup tenant-scoped.

### Parte 5 — Precondition

Exija If-Match.

### Parte 6 — Concorrência

Use optimistic locking.

### Parte 7 — Auditoria

Registre fatos sem payload.

### Parte 8 — Rate limit

Proteja queue, decision e audit.

### Parte 9 — Testes

Cubra self-review, race, stale e logs.

### Parte 10 — Regressão

Execute a parte 1 e o gate completo.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a parte 1 foi preservada;
- requirements e threat model foram ampliados;
- V3 e V4 foram criadas;
- review usa operação específica;
- status, reviewer, tenant, version e timestamps não vêm do body;
- `access-request:review` e `access-request:audit` são explícitas;
- roles não substituem permissions;
- auditor permanece read-only;
- fila usa tenant, `PENDING` e requester diferente;
- self-review é bloqueado na fila e no service;
- tenant admin também não revisa a própria solicitação;
- approval e rejection partem apenas de `PENDING`;
- rejection exige reason válido;
- decision reason não entra em logs ou audit;
- `If-Match` é obrigatório;
- stale version retorna `412`;
- corrida real retorna `409`;
- apenas uma decisão é persistida;
- audit de sucesso participa da transação;
- audit não contém payload, justification ou token;
- auditoria é consultada somente no tenant;
- Redis usa HMAC e keys sem UUID raw;
- review, queue e audit possuem rate limits;
- indisponibilidade do Redis produz `503` fail-closed;
- `429` usa `Retry-After`;
- queue, count e paginação são scoped;
- mass assignment foi testado;
- permissions, self-review e cross-tenant foram testados;
- concorrência PostgreSQL foi testada;
- logs foram testados com sentinelas;
- matriz, OpenAPI e collections foram atualizadas;
- regressão da parte 1 foi executada;
- hardening final não foi antecipado;
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

git grep `
  -n `
  -E `
  "log\\..*(decisionReason|justification|token|subject)|audit.*payload|RequestBody.*AccessRequest"
```

Adicione:

```powershell
git add `
  labs/m15/projeto-api-segura `
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
git commit -m "feat(m15): implementar review seguro de solicitacoes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- secret HMAC;
- decision reason real;
- justification real;
- Redis dump;
- dados de tenant;
- relatório local;
- log com sentinela;
- exception sem expiração;
- configuração produtiva não validada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto ganhou seu workflow sensível.

O fluxo ficou:

```text
requester solicita;

reviewer consulta fila;

reviewer diferente decide;

auditor consulta fatos;

tenant limita tudo.
```

As permissions ficaram:

```text
access-request:create;

access-request:read;

access-request:review;

access-request:audit.
```

A segregação protegeu:

```text
requester != reviewer.
```

A concorrência foi tratada por:

```text
If-Match;

@Version;

412 para stale;

409 para race.
```

A auditoria passou a registrar:

```text
actor;

tenant;

target;

action;

outcome;

before;

after;

correlation.
```

Sem copiar:

```text
justification;

decision reason;

token;

body.
```

Redis passou a proteger queue, decision e audit com keys HMAC e fail-closed.

A decisão central foi:

```text
aprovar acesso
não é apenas mudar status;

é executar uma decisão
segregada, tenant-scoped,
versionada, auditável
e resistente a abuso.
```

O domínio funcional está completo para criação e decisão.

A próxima aula será:

```text
449 - M15.39 - Projeto API segura parte 3
```

Nela, você irá:

- aplicar hardening final;
- finalizar privacidade e retenção;
- criar SBOM e SCA do projeto;
- aplicar checklist de PR;
- criar testes end-to-end;
- revisar backup e restore;
- fechar OpenAPI e runbooks;
- executar release gate;
- produzir decisão GO/NO-GO.

---

# Material complementar

## Checkpoint final

- [ ] Implementei queue, approval e rejection.
- [ ] Bloqueei self-review.
- [ ] Separei review e audit permissions.
- [ ] Testei If-Match, locking e concorrência.
- [ ] Protegi audit e Redis contra vazamento e abuso.

---

## Troubleshooting adicional

### Reviewer não vê nenhuma solicitação

Confirme tenant, status `PENDING`, requester diferente e permission.

### Requester aparece na própria fila

A query pode não usar `requesterUserIdNot`.

### Tenant admin aprova a própria solicitação

A policy está baseada em role em vez de comparar IDs.

### Segunda decisão retorna 200

O aggregate pode não validar estado terminal.

### Duas decisões são persistidas

`@Version` pode estar ausente ou o teste não está concorrente de verdade.

### Audit não aparece

Confirme transação, recorder obrigatório e flush.

### Decision faz commit sem audit

O recorder pode estar em `REQUIRES_NEW` ou fora da transação.

### Reason aparece no log

Um DTO, entity ou exception está sendo logado inteiro.

### Redis fora ainda permite decidir

A policy está fail-open.

### Queue mostra total maior

A count query não recebeu todos os predicates.

---

## Perguntas de revisão

1. Review é update genérico?
2. Qual permission decide?
3. Qual permission consulta audit?
4. Role substitui permission?
5. Requester pode revisar a própria?
6. Tenant admin pode?
7. O que a queue filtra?
8. Qual status pode ser decidido?
9. Rejection exige o quê?
10. De onde vem reviewer ID?
11. Onde vem version?
12. If-Match protege toda race?
13. O que protege a race real?
14. Stale retorna qual status?
15. Race retorna qual status?
16. Audit pode copiar reason?
17. Redis armazena UUID raw?
18. O que ocorre se Redis falhar?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Não.
2. `access-request:review`.
3. `access-request:audit`.
4. Não.
5. Não.
6. Não.
7. Tenant, pending e outro requester.
8. PENDING.
9. Reason de 10 a 500.
10. Do usuário autenticado.
11. Do `If-Match`.
12. Não.
13. `@Version`.
14. 412.
15. 409.
16. Não.
17. Não.
18. 503 fail-closed.
19. Projeto API segura parte 3.
20. Hardening, privacidade, supply chain e release gate.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 448 - M15.38 - Projeto API segura parte 2

- Continuei o projeto prático guiado do Módulo 15.
- Ampliei requisitos e threat model.
- Criei `V3__add_access_request_review.sql`.
- Criei `V4__expand_security_audit.sql`.
- Adicionei reviewer, reason e reviewedAt.
- Criei constraints para estado de review.
- Criei índices da fila e da auditoria.
- Criei `AccessRequestDecision`.
- Criei DTO e command de decisão.
- Mantive status, reviewer, tenant, version e timestamps fora do body.
- Criei `access-request:review`.
- Criei `access-request:audit`.
- Mantive roles separadas de permissions.
- Criei fila tenant-scoped de solicitações pendentes.
- Excluí solicitações do próprio reviewer.
- Implementei segregation of duties no service.
- Impedi self-review de reviewer e tenant admin.
- Implementei approval.
- Implementei rejection.
- Exigi reason em rejection.
- Exigi `If-Match`.
- Mapeei stale para `412`.
- Mantive `@Version`.
- Mapeei race real para `409`.
- Testei duas decisões concorrentes.
- Garanti uma única decisão final.
- Criei audit obrigatório na mesma transação.
- Mantive justification, reason e token fora do audit.
- Criei consulta de audit tenant-scoped.
- Mantive auditor read-only.
- Adicionei Redis.
- Protegi keys com HMAC.
- Criei rate limits de queue, decision e audit.
- Usei `429` e `Retry-After`.
- Usei `503` fail-closed.
- Testei mass assignment da decisão.
- Testei permissions, auditor e cross-tenant.
- Testei logs com sentinelas.
- Ampliei a matriz de autorização.
- Atualizei OpenAPI e collections.
- Executei regressão da parte 1.
- Mantive produção pública como NO-GO.
- Próxima aula: Projeto API segura parte 3.
```

---

## Referência técnica curta

- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Data JPA — Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Jakarta Persistence — Version](https://jakarta.ee/specifications/persistence/3.2/apidocs/jakarta.persistence/jakarta/persistence/version)
- [RFC 9110 — Conditional Requests](https://www.rfc-editor.org/rfc/rfc9110.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [Spring Data Redis — Scripting](https://docs.spring.io/spring-data/redis/reference/redis/scripting.html)

Regra final:

```text
a segunda parte do projeto de API segura deve transformar review em uma operação sensível explícita: permission e tenant são validados, requester e reviewer nunca são a mesma identidade, a fila exclui recursos próprios, If-Match e optimistic locking impedem decisões obsoletas ou concorrentes, apenas PENDING pode virar APPROVED ou REJECTED, audit obrigatório registra metadata sem payload, Redis limita queue, decision e audit com keys HMAC e fail-closed, e testes comprovam autorização, segregação, atomicidade, ausência de vazamento e regressão da primeira parte.
```
