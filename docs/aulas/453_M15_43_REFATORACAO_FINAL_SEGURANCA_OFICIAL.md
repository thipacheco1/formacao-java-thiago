# 453 - M15.43 - Refatoracao final seguranca

## Apresentação da aula

Na aula 452, você recebeu um pull request que parecia funcional.

O happy path retornava sucesso.

Mesmo assim, a mudança havia introduzido regressões em várias fronteiras:

```text
JWT;

audience;

tenant;

permissions;

segregation of duties;

mass assignment;

concorrência;

logs;

audit;

rate limiting;

Actuator;

supply chain;

release.
```

A prova exigiu identificar, priorizar, corrigir, testar e registrar o risco residual.

Agora existe um novo desafio.

As correções foram feitas sob pressão.

Elas podem ter produzido:

- duplicação;
- classes extensas;
- nomes inconsistentes;
- resolvers repetidos;
- policies espalhadas;
- handlers duplicados;
- fixtures difíceis de manter;
- contratos repetidos;
- regras de auditoria misturadas ao caso de uso;
- dependência excessiva do framework;
- testes lentos demais;
- testes que conhecem detalhes internos.

A pergunta central desta aula será:

```text
como melhorar a estrutura
do código de segurança
sem alterar nenhuma garantia
já comprovada pelos testes?
```

Refatorar segurança exige cuidado adicional.

Em código comum, uma mudança estrutural incorreta pode quebrar uma feature.

Em código de segurança, uma mudança estrutural incorreta pode:

- ampliar acesso;
- revelar recurso;
- trocar um status;
- deixar uma rota sem policy;
- aceitar campo proibido;
- falhar aberto;
- remover auditoria;
- criar bypass interno;
- enfraquecer o release gate.

Por isso, a ordem desta aula será:

```text
congelar comportamento;

mapear invariantes;

identificar duplicação;

refatorar uma fronteira;

executar testes;

comparar evidências;

prosseguir.
```

Não será feita uma reescrita total.

Não será adotada uma nova arquitetura apenas por preferência estética.

Não serão atualizadas dependências.

Não serão criados novos endpoints.

Não serão alteradas regras de negócio.

Não será flexibilizada a decisão:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

O objetivo é consolidar o projeto:

```text
labs/m15/projeto-api-segura
```

A refatoração trabalhará principalmente em:

```text
security context;

identity resolution;

tenant resolution;

authorization policies;

preconditions;

rate limiting;

audit creation;

Problem Details;

test support;

package boundaries;

naming.
```

A primeira regra será:

```text
refatoração segura
preserva comportamento observável.
```

Comportamento observável inclui:

- status HTTP;
- Problem Details;
- headers;
- response fields;
- ausência de fields;
- persistência;
- ausência de persistência;
- audit;
- ausência de audit de sucesso;
- logs;
- ausência de secrets;
- Redis keys;
- tenant predicates;
- optimistic locking;
- release decision.

A segunda regra será:

```text
uma abstração de segurança
precisa tornar a policy
mais visível,
não mais escondida.
```

Exemplo ruim:

```java
security.checkEverything(
    request,
    authentication,
    entity
);
```

Esse método esconde:

- qual permission;
- qual tenant;
- qual ownership;
- qual state;
- qual audit.

Exemplo melhor:

```java
reviewPolicy.requireAllowed(
    actor,
    tenant,
    accessRequest
);
```

A policy possui nome de domínio e testes próprios.

A terceira regra será:

```text
não confundir centralização
com classe universal.
```

Centralizar:

- parsing de ETag;
- criação de Problem Details;
- redaction;
- criação de TenantContext;
- definição de reason codes;

pode reduzir inconsistência.

Criar uma classe chamada:

```text
SecurityUtils
```

com dezenas de métodos estáticos cria um novo problema.

A refatoração final terá uma rede de proteção:

```text
characterization tests;

architecture tests;

security regression suite;

integration tests;

policy tests;

SCA;

release policy.
```

A próxima aula será:

```text
454 - M15.44 - Aula ensinavel seguranca
```

Nela, você transformará o conhecimento técnico do módulo em uma aula que possa ser ensinada a outra pessoa, com explicação, demonstração, perguntas e avaliação.

---

## Onde estamos na formação

A sequência oficial é:

```text
451:
Revisao seguranca parte 2.

452:
Prova pratica seguranca.

453:
Refatoracao final seguranca.

454:
Aula ensinavel seguranca.

455:
Fechamento do Modulo 15.
```

A prova respondeu:

```text
você consegue corrigir
uma regressão real?
```

A refatoração responderá:

```text
você consegue melhorar
o design do código
sem perder os controles?
```

Nesta aula:

```text
novas features:
não.

novos endpoints:
não.

mudança de permissions:
não.

mudança de contratos:
não.

organização:
sim.

nomes:
sim.

policies:
sim.

test support:
sim.

architecture tests:
sim.

regressão completa:
sim.
```

A regra central será:

```text
segurança preservada
é requisito da refatoração,
não consequência esperada.
```

---

## Objetivo prático

Ao final da aula, o projeto terá uma estrutura mais clara.

Packages-alvo:

```text
br.com.formacao.secureaccess
├── security
│   ├── authentication
│   ├── identity
│   ├── tenancy
│   ├── authorization
│   ├── ratelimit
│   ├── audit
│   ├── errors
│   └── hardening
├── accessrequest
│   ├── domain
│   ├── application
│   ├── persistence
│   └── web
└── shared
    ├── time
    ├── web
    └── observability
```

Novos componentes possíveis:

```text
AuthenticatedActor;

SecurityRequestContext;

SecurityRequestContextFactory;

AccessRequestReviewPolicy;

AccessRequestVisibilityPolicy;

AccessRequestPreconditionPolicy;

SecurityAuditEventFactory;

SecurityProblemFactory;

SecurityReasonCodes;

SecurityTestActors;

SecurityTestContexts;

SecurityRegressionContractTest.
```

Documentação:

```text
docs/security/
├── M15_SECURITY_REFACTORING_PLAN.md
├── M15_SECURITY_INVARIANTS.md
├── M15_SECURITY_PACKAGE_BOUNDARIES.md
└── M15_SECURITY_REFACTORING_EVIDENCE.md
```

Testes:

```text
SecurityArchitectureTest;

SecurityInvariantPolicyTest;

SecurityContractSnapshotTest;

SecurityRefactoringRegressionTest.
```

Você irá:

1. congelar a baseline;
2. listar invariantes;
3. mapear dependências;
4. mapear duplicações;
5. definir boundaries;
6. melhorar nomes;
7. criar contexto autenticado;
8. centralizar resolução de contexto;
9. separar policies;
10. separar preconditions;
11. separar audit factory;
12. centralizar errors;
13. organizar rate limiting;
14. reduzir acoplamento de controllers;
15. organizar test support;
16. criar architecture tests;
17. executar regressão incremental;
18. comparar evidências;
19. atualizar documentação;
20. emitir decisão final.

---

## Conceito essencial

### Refatoração

Refatoração altera a estrutura interna preservando o comportamento externo.

Nesta aula, comportamento externo inclui segurança.

Exemplo:

```text
antes:
controller resolve user
e tenant manualmente.

depois:
SecurityRequestContextFactory
resolve ambos.

contrato:
idêntico.
```

Se um status muda, não foi apenas refatoração.

Se um campo novo aparece, não foi apenas refatoração.

Se uma query perde o tenant, não foi apenas refatoração.

---

### Characterization test

Characterization test registra o comportamento atual antes da mudança.

Ele é útil quando:

- código está acoplado;
- regra está espalhada;
- falta clareza;
- refatoração será gradual.

Exemplos de comportamento congelado:

```text
sem token:
401.

sem permission:
403.

cross-tenant:
404.

self-review:
403.

If-Match ausente:
428.

Redis indisponível:
503.

unknown field:
400.

audit obrigatório falha:
rollback.
```

O teste não afirma que todo comportamento existente é correto.

Na prova, as regressões já foram corrigidas.

Agora ele congela a baseline aprovada.

---

### Invariante de segurança

Invariante é uma condição que deve permanecer verdadeira.

Exemplos:

```text
tenant nunca vem do body;

reviewer nunca vem do body;

requester não revisa
a própria solicitação;

access token
não aparece em log;

resource oculto
não é distinguido
do inexistente;

review falha fechado
sem Redis;

GO_PUBLIC
não é emitido
com gap bloqueante.
```

As invariantes serão documentadas e testadas.

---

### Dependência de direção

O domínio não deve depender de:

- HTTP;
- JWT;
- Redis;
- Jackson;
- Spring Security;
- JPA;
- Actuator.

A aplicação pode depender de ports.

A infraestrutura implementa ports.

Exemplo:

```text
AccessRequestReviewService
depende de:
ReviewRateLimiter.

RedisReviewRateLimiter
implementa:
ReviewRateLimiter.
```

Isso facilita testar a policy sem Redis.

A integração com Redis continua sendo testada separadamente.

---

### Contexto autenticado

Controllers repetiam:

```text
resolver Authentication;

resolver usuário local;

resolver TenantContext;

passar user e tenant.
```

Crie um objeto explícito:

```java
public record SecurityRequestContext(
        UUID actorUserId,
        UUID tenantId,
        Set<String> authorities,
        ExternalIdentityKey externalIdentity
) {
}
```

Ele contém apenas dados necessários.

Não contém:

- access token;
- credentials;
- raw headers;
- password;
- JWT completo;
- e-mail por padrão.

---

### Context factory

A factory coordena:

1. ler `Authentication`;
2. validar o tipo esperado;
3. extrair issuer e subject;
4. resolver identidade local;
5. validar usuário ativo;
6. resolver memberships;
7. validar selector;
8. construir contexto.

Ela não decide ownership do recurso.

Ela não decide estado do domínio.

Ela não executa review.

---

### Argument resolver

É possível transformar `SecurityRequestContext` em argumento do controller por `HandlerMethodArgumentResolver`.

Benefício:

```text
controller menor.
```

Risco:

```text
policy importante
fica invisível.
```

Na refatoração, use annotation explícita:

```java
@CurrentSecurityContext
SecurityRequestContext context
```

Documente e teste o resolver.

Não injete contexto implicitamente por thread local próprio.

---

### Policy de autorização

Uma policy de domínio deve ter nome específico.

Exemplo:

```java
public class AccessRequestReviewPolicy {

    public void requireReviewableBy(
            AccessRequest request,
            SecurityRequestContext reviewer
    ) {
        requireSameTenant(
                request,
                reviewer
        );

        requireDifferentActor(
                request,
                reviewer
        );

        requirePending(
                request
        );
    }
}
```

A permission geral continua em:

```text
@PreAuthorize.
```

A policy de domínio trata contexto e invariantes.

---

### Policy de visibilidade

Para requester:

```text
tenant + requester.
```

Para reviewer:

```text
tenant.
```

Para auditor:

```text
tenant.
```

Prefira queries diferentes e nomeadas.

Não crie:

```text
boolean canSeeEverything.
```

O repository deve expressar o escopo.

---

### Preconditions

ETag e If-Match formam uma fronteira própria.

Crie:

```text
EntityTagParser;

ExpectedVersion;

PreconditionPolicy.
```

Exemplo:

```java
public record ExpectedVersion(
        long value
) {
    public ExpectedVersion {
        if (value < 0) {
            throw new InvalidIfMatchException();
        }
    }
}
```

O controller transforma header em value object.

O service compara com a entity.

---

### Estado e concorrência

Não misture:

```text
stale precondition;

invalid state;

optimistic race.
```

Contratos preservados:

```text
stale:
412.

estado terminal:
409.

race real:
409 com code distinto.
```

A refatoração precisa manter reason codes diferentes.

---

### Reason codes

Strings espalhadas aumentam inconsistência.

Crie catálogo:

```java
public final class SecurityReasonCodes {

    public static final String
            MISSING_PERMISSION =
                "MISSING_PERMISSION";

    public static final String
            SELF_REVIEW_FORBIDDEN =
                "SELF_REVIEW_FORBIDDEN";

    public static final String
            RESOURCE_NOT_VISIBLE =
                "RESOURCE_NOT_VISIBLE";

    private SecurityReasonCodes() {
    }
}
```

O catálogo não deve crescer como enum universal de todos os errors.

Separe por contexto quando necessário.

---

### Audit event factory

O service não deve montar dezenas de campos manualmente.

Factory:

```java
public SecurityAuditEvent approved(
        SecurityRequestContext actor,
        AccessRequest request,
        AccessRequestStatus before,
        String correlationId,
        Instant occurredAt
) {
    return SecurityAuditEvent.success(
            actor.actorUserId(),
            actor.tenantId(),
            "ACCESS_REQUEST",
            request.getId(),
            "ACCESS_REQUEST_APPROVED",
            before.name(),
            request.getStatus().name(),
            correlationId,
            occurredAt
    );
}
```

A factory não aceita payload.

Isso reduz o risco de vazamento.

---

### Error factory

Handlers duplicados podem divergir.

Crie `SecurityProblemFactory` para:

- type;
- title;
- code;
- detail seguro;
- correlation ID;
- no-store.

O handler continua definindo qual exception mapeia para qual status.

Não capture toda exception e retorne `400`.

---

### Rate limit port

Application service depende de:

```java
public interface ReviewRateLimiter {

    void requireDecisionAllowed(
            SecurityRequestContext context
    );
}
```

Redis implementation:

- cria HMAC key;
- executa Lua;
- mapeia `429`;
- mapeia `503`;
- não loga dimensions.

A policy de failure mode permanece explícita no nome ou configuração.

---

### Controller fino

Controller ideal:

1. recebe contexto;
2. parseia path e headers;
3. valida request;
4. cria command;
5. chama use case;
6. cria response.

Ele não:

- resolve repository;
- aplica ownership;
- cria audit;
- acessa Redis;
- interpreta JWT;
- muda entity;
- captura exception de negócio.

---

### Service coeso

O service orquestra:

```text
permission via proxy;

rate limit;

lookup scoped;

policy;

precondition;

aggregate;

audit;

result.
```

Ele não deve conhecer:

- JSON;
- HTTP status;
- raw header;
- Redis template;
- JWT raw;
- response DTO.

---

### Test support

Fixtures repetidas aumentam risco de inconsistência.

Crie builders específicos:

```text
SecurityTestActorBuilder;

AccessRequestTestBuilder;

JwtTestTokenFactory;

TenantTestFixture;

SecurityLogSentinels.
```

Builders devem manter defaults seguros.

Um teste que precisa de cenário inseguro deve declarar explicitamente a diferença.

---

### Teste não deve esconder intent

Evite helper:

```java
performRequest(
    true,
    false,
    3
);
```

Prefira:

```java
performReviewAs(
    reviewerAlpha(),
    requestFromOtherUserInAlpha(),
    currentEtag()
);
```

O nome expressa a ameaça.

---

### Architecture test

Architecture tests podem validar:

- domain não depende de web;
- domain não depende de security framework;
- controllers não acessam repositories;
- DTOs ficam em web;
- entities não são responses;
- rate limiter é port;
- audit factory não aceita body;
- application não depende de Redis.

Esses testes são guardrails.

---

### Package boundary

Organize por domínio e responsabilidade.

Evite package global:

```text
utils;
helpers;
common;
misc.
```

Use nomes que indiquem propósito.

Exemplo:

```text
security.tenancy;

security.audit;

accessrequest.application.
```

---

### Small steps

Sequência segura:

1. adicionar characterization test;
2. criar nova classe;
3. delegar comportamento;
4. executar teste;
5. mover callers;
6. executar suite;
7. remover código antigo;
8. executar gate;
9. registrar evidência.

Não mova dezenas de classes de uma vez.

---

## Mão na massa guiada

### 1. Congelar a baseline

Registre:

```powershell
git status
git log -1 --oneline

.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Salve:

- commit;
- quantidade de testes;
- resultado;
- hashes;
- decisão de release.

---

### 2. Criar plano de refatoração

Arquivo:

```text
docs/security/
M15_SECURITY_REFACTORING_PLAN.md
```

Tabela:

| Passo | Objetivo | Risco | Testes |
|---|---|---|---|
| 1 | congelar contracts | baixo | characterization |
| 2 | contexto autenticado | alto | authn + tenant |
| 3 | review policy | crítico | authz + SoD |
| 4 | preconditions | alto | 412 + 409 |
| 5 | audit factory | alto | rollback + leakage |
| 6 | rate limit port | alto | Redis |
| 7 | errors | médio | contracts |
| 8 | packages | médio | architecture |
| 9 | test support | baixo | full regression |

---

### 3. Criar invariantes

Arquivo:

```text
M15_SECURITY_INVARIANTS.md
```

IDs:

```text
INV-001:
JWT exige audience da API.

INV-002:
identity é issuer + subject.

INV-003:
tenant exige membership.

INV-004:
resource cross-tenant é 404.

INV-005:
self-review é proibido.

INV-006:
tenant e actor não vêm do body.

INV-007:
decision exige If-Match.

INV-008:
review falha fechado sem Redis.

INV-009:
audit não contém payload.

INV-010:
token não entra em log.

INV-011:
SCA não pode ser skipped.

INV-012:
GO_PUBLIC exige ausência
de gaps bloqueantes.
```

---

### 4. Criar SecurityInvariantPolicyTest

Leia o documento e valide que cada ID possui:

- descrição;
- controle;
- teste;
- owner;
- status.

O teste não valida apenas texto.

Ele cruza IDs com a matriz de segurança.

---

### 5. Criar SecurityRequestContext

```java
public record SecurityRequestContext(
        UUID actorUserId,
        UUID tenantId,
        Set<String> authorities,
        ExternalIdentityKey externalIdentity
) {
    public SecurityRequestContext {
        Objects.requireNonNull(
                actorUserId
        );

        Objects.requireNonNull(
                tenantId
        );

        authorities =
                Set.copyOf(
                        authorities
                );

        Objects.requireNonNull(
                externalIdentity
        );
    }
}
```

Não implemente `toString` com identity completa.

---

### 6. Criar factory

```java
@Component
public class SecurityRequestContextFactory {

    public SecurityRequestContext create(
            JwtAuthenticationToken authentication,
            String selectedTenant
    ) {
        AuthenticatedApplicationUser user =
                authenticatedUserResolver.resolve(
                        authentication
                );

        TenantContext tenant =
                tenantContextResolver.resolve(
                        user,
                        selectedTenant
                );

        return new SecurityRequestContext(
                user.userId(),
                tenant.tenantId(),
                user.authorities(),
                user.externalIdentity()
        );
    }
}
```

Mantenha os resolvers existentes até os testes passarem.

---

### 7. Criar teste da factory

Cenários:

- identity provisionada;
- identity ausente;
- user inativo;
- uma membership;
- múltiplas memberships;
- selector válido;
- selector negado;
- authority preservada;
- token não armazenado no contexto.

---

### 8. Criar argument resolver

Annotation:

```java
@Target(
    ElementType.PARAMETER
)
@Retention(
    RetentionPolicy.RUNTIME
)
public @interface CurrentSecurityContext {
}
```

Resolver:

```java
public Object resolveArgument(
        MethodParameter parameter,
        ModelAndViewContainer container,
        NativeWebRequest webRequest,
        WebDataBinderFactory binderFactory
) {
    HttpServletRequest request =
            webRequest.getNativeRequest(
                HttpServletRequest.class
            );

    JwtAuthenticationToken authentication =
            requireJwtAuthentication();

    String selectedTenant =
            request.getHeader(
                "X-Tenant-Id"
            );

    return contextFactory.create(
            authentication,
            selectedTenant
    );
}
```

O resolver usa o header somente como selector.

---

### 9. Migrar um controller

Antes:

```text
resolver user;

resolver tenant;

chamar service.
```

Depois:

```java
ResponseEntity<AccessRequestResponse> create(
        @CurrentSecurityContext
        SecurityRequestContext context,
        @Valid
        @RequestBody
        CreateAccessRequestRequest request
) {
    var result =
            service.create(
                context,
                mapper.toCommand(
                    request
                )
            );

    return responseFactory.created(
            result
    );
}
```

Execute testes imediatamente.

---

### 10. Migrar demais controllers

Ordem:

1. create;
2. read;
3. list;
4. review queue;
5. decision;
6. audit.

Após cada controller:

```powershell
.\mvnw.cmd `
  -Dtest=<testes relacionados> `
  test
```

---

### 11. Criar review policy

```java
@Component
public class AccessRequestReviewPolicy {

    public void requireAllowed(
            SecurityRequestContext reviewer,
            AccessRequest request
    ) {
        requireSameTenant(
                reviewer,
                request
        );

        requireDifferentActor(
                reviewer,
                request
        );

        requirePending(
                request
        );
    }
}
```

A query já é tenant-scoped.

A comparação de tenant continua como defense in depth quando o aggregate expõe o campo internamente.

---

### 12. Criar testes unitários da policy

Cenários:

- mesmo tenant e actor diferente;
- actor igual;
- tenant diferente;
- `PENDING`;
- `APPROVED`;
- `REJECTED`.

A policy não depende de Spring.

---

### 13. Criar visibility queries

Repository:

```java
Optional<AccessRequest>
findRequesterVisibleById(
        UUID id,
        UUID tenantId,
        UUID requesterUserId
);

Optional<AccessRequest>
findReviewerVisibleById(
        UUID id,
        UUID tenantId
);
```

Implemente com query methods ou `@Query` clara.

Evite nomes ambíguos como:

```text
findSecurely.
```

---

### 14. Centralizar preconditions

```java
@Component
public class AccessRequestPreconditionPolicy {

    public void requireExpectedVersion(
            long current,
            ExpectedVersion expected
    ) {
        if (
            current != expected.value()
        ) {
            throw new PreconditionFailedException();
        }
    }
}
```

ETag parser fica em shared web.

---

### 15. Testar contratos de version

Preserve:

- ausente `428`;
- malformado `400`;
- stale `412`;
- terminal `409`;
- race `409 concurrent_decision_conflict`;
- response ETag atual.

Não unifique os dois `409` em code genérico.

---

### 16. Criar audit factory

```java
@Component
public class AccessRequestAuditEventFactory {

    public SecurityAuditEvent approved(
            SecurityRequestContext actor,
            AccessRequest request,
            AccessRequestStatus before,
            String correlationId,
            Instant now
    ) {
        return SecurityAuditEvent.approved(
                actor.actorUserId(),
                actor.tenantId(),
                request.getId(),
                before,
                request.getStatus(),
                correlationId,
                now
        );
    }
}
```

O método não aceita request DTO.

---

### 17. Migrar audit creation

Substitua montagem manual em:

- create;
- approve;
- reject;
- self-review denial;
- permission denial quando aplicável;
- privacy operations futuras.

Execute sentinel tests.

---

### 18. Criar rate limit port

```java
public interface SecurityRateLimiter {

    void requireAllowed(
            SecurityRateLimitPolicy policy,
            SecurityRequestContext context
    );
}
```

Policy enum ou registry:

```text
ACCESS_REQUEST_CREATE;

REVIEW_QUEUE;

REVIEW_DECISION;

AUDIT_QUERY.
```

A política contém:

- windows;
- failure mode;
- retry behavior;
- key namespace.

---

### 19. Implementar Redis adapter

```java
@Component
public class RedisSecurityRateLimiter
        implements SecurityRateLimiter {

    @Override
    public void requireAllowed(
            SecurityRateLimitPolicy policy,
            SecurityRequestContext context
    ) {
        String key =
                keyFactory.create(
                    policy,
                    context
                );

        RateLimitDecision decision =
                script.execute(
                    key,
                    policy
                );

        decision.requireAllowed();
    }
}
```

O adapter converte falhas de infraestrutura em exception catalogada.

---

### 20. Preservar fail-closed

Testes obrigatórios:

- Redis disponível e permitido;
- limite excedido `429`;
- Redis indisponível `503`;
- repository não chamado;
- key sem UUID raw;
- logger sem dimensions;
- `Retry-After`.

---

### 21. Centralizar Problem Details

Factory:

```java
@Component
public class SecurityProblemFactory {

    public ProblemDetail create(
            HttpStatus status,
            String type,
            String title,
            String code,
            String safeDetail,
            String correlationId
    ) {
        ProblemDetail problem =
                ProblemDetail.forStatus(
                    status
                );

        problem.setType(
                URI.create(
                    type
                )
        );

        problem.setTitle(
                title
        );

        problem.setDetail(
                safeDetail
        );

        problem.setProperty(
                "code",
                code
        );

        problem.setProperty(
                "correlationId",
                correlationId
        );

        return problem;
    }
}
```

O response filter aplica `no-store`.

---

### 22. Consolidar exception handlers

Agrupe por fronteira:

```text
AuthenticationProblemHandler;

AuthorizationProblemHandler;

ValidationProblemHandler;

ConcurrencyProblemHandler;

InfrastructureSecurityProblemHandler.
```

Evite um handler gigante com dezenas de `if`.

---

### 23. Criar contract snapshot test

Não precisa usar snapshot library.

Crie assertions explícitas para:

- JSON fields;
- ausência de fields;
- headers;
- status;
- code.

Contratos:

```text
401;

403;

404;

409;

412;

413;

415;

428;

429;

503.
```

---

### 24. Organizar packages

Mova em passos pequenos.

Exemplo:

```text
configuration.security
->
security.authentication.configuration.

application.tenancy
->
security.tenancy.application.

configuration.ratelimit
->
security.ratelimit.infrastructure.
```

Ajuste imports com IDE.

Não use movimentação em massa sem testes.

---

### 25. Criar package boundaries

Arquivo:

```text
M15_SECURITY_PACKAGE_BOUNDARIES.md
```

Defina:

```text
domain:
sem Spring Security,
HTTP, Redis ou Jackson.

application:
depende de ports
e domínio.

web:
depende de application.

infrastructure:
implementa ports.

security:
não acessa entities
fora de policies aprovadas.
```

---

### 26. Criar SecurityArchitectureTest

Exemplos:

```java
noClasses()
    .that()
    .resideInAPackage(
        "..domain.."
    )
    .should()
    .dependOnClassesThat()
    .resideInAnyPackage(
        "org.springframework.security..",
        "jakarta.servlet..",
        "com.fasterxml.jackson.."
    );
```

```java
noClasses()
    .that()
    .resideInAPackage(
        "..web.."
    )
    .should()
    .dependOnClassesThat()
    .resideInAPackage(
        "..persistence.."
    );
```

Use a ferramenta de architecture test já aprovada no projeto ou implemente policy de source se não houver dependency.

Não adicione dependency apenas por conveniência sem revisão.

---

### 27. Refatorar test support

Crie:

```text
src/test/java/.../testsupport/
├── SecurityTestActors.java
├── SecurityTestContexts.java
├── AccessRequestTestData.java
├── JwtTestTokenFactory.java
├── RedisTestFixture.java
└── SecuritySentinels.java
```

Não coloque classes de teste em `src/main`.

---

### 28. Substituir magic UUIDs

Antes:

```java
UUID.fromString(
    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
);
```

Depois:

```java
SecurityTestActors.REQUESTER_ALPHA_ID;
```

Os nomes melhoram intent.

---

### 29. Reduzir setup duplicado

Base classes devem fornecer infraestrutura, não cenários.

Bom:

```text
PostgreSqlIntegrationTest;

PostgreSqlRedisIntegrationTest.
```

Evite:

```text
BaseSecurityTest
com 80 helpers
e state mutável.
```

---

### 30. Nomear testes por propriedade

Use:

```text
shouldHideRequestFromOtherTenant;

shouldRejectSelfReview;

shouldFailClosedWhenRedisIsUnavailable;

shouldNotLogDecisionReason.
```

Evite:

```text
testSecurity;

testError;

testReview2.
```

---

### 31. Criar SecurityRefactoringRegressionTest

O teste executa uma matriz reduzida de invariantes:

- wrong audience;
- unprovisioned identity;
- invalid tenant;
- cross-tenant;
- self-review;
- unknown field;
- stale ETag;
- Redis unavailable;
- audit failure;
- log sentinel;
- blocking gap.

Ele não substitui as suítes completas.

---

### 32. Executar testes após cada etapa

Comando focado:

```powershell
.\mvnw.cmd `
  -Dtest=<classe1>,<classe2> `
  test
```

Depois do bloco:

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

---

### 33. Comparar SQL

Em ambiente de teste controlado, confirme que queries continuam contendo:

- tenant;
- owner para requester;
- status para queue;
- `requester_id <> reviewer_id` quando aplicado na fila;
- paginação;
- count scoped.

Não versionar logs SQL.

---

### 34. Comparar Redis keys

Antes e depois:

```text
mesmo namespace;

mesma policy;

HMAC;

nenhum UUID raw;

mesmos TTLs;

mesmos limits.
```

Refatorar nomes internos não deve invalidar limites ativos sem plano.

---

### 35. Comparar audit

Para o mesmo cenário, compare:

- action;
- outcome;
- reason;
- actor;
- tenant;
- target;
- before;
- after;
- correlation;
- ausência de payload.

Event ID e timestamp podem variar.

---

### 36. Comparar logs

Valide:

- event names;
- outcomes;
- route templates;
- reason codes;
- correlation;
- ausência de sentinelas;
- MDC cleanup.

Não exija texto livre idêntico quando a estrutura é equivalente.

---

### 37. Comparar Problem Details

Os campos públicos devem permanecer idênticos.

Não exponha o nome das novas classes.

Refatoração interna não muda `detail`.

---

### 38. Executar concurrency tests

Refatoração de service e policy pode alterar transações.

Execute:

```text
stale ETag;

terminal state;

optimistic race;

audit rollback;

Redis fail-closed.
```

Confirme boundaries transacionais.

---

### 39. Executar SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

A refatoração não deve desabilitar plugins ou profiles.

---

### 40. Criar evidence document

Arquivo:

```text
M15_SECURITY_REFACTORING_EVIDENCE.md
```

Inclua:

- commit antes;
- commit depois;
- arquivos movidos;
- policies criadas;
- contracts preservados;
- tests executados;
- reports;
- SCA;
- gaps;
- decisão.

---

### 41. Revisar diff

```powershell
git diff --stat
git diff --check
git diff
```

Perguntas:

- alguma permission mudou;
- algum endpoint mudou;
- algum status mudou;
- algum field mudou;
- alguma query perdeu predicate;
- algum audit desapareceu;
- algum test foi removido;
- algum skip apareceu;
- alguma dependency foi adicionada.

---

### 42. Aplicar checklist de PR

Classificação:

```text
HIGH
ou CRITICAL
conforme alcance.
```

Como a refatoração toca segurança central:

```text
CRITICAL.
```

Exija:

- threat model;
- invariants;
- negative tests;
- owner review;
- deployment plan;
- rollback;
- full gate.

---

### 43. Definir rollback

A refatoração não altera schema.

Rollback esperado:

```text
voltar ao commit anterior.
```

Mesmo assim, avalie:

- package changes;
- config names;
- Redis namespaces;
- event names;
- observability dashboards;
- documentation links.

Se algum nome operacional mudou, documente compatibilidade.

---

### 44. Executar gate completo

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Confirme:

- invariants;
- identity;
- tenant;
- authorization;
- SoD;
- DTOs;
- ETag;
- concurrency;
- audit;
- logs;
- Redis;
- hardening;
- SCA;
- release policy;
- nenhum teste desabilitado.

---

### 45. Emitir decisão

Resultado esperado:

```text
REFACTOR_ACCEPTED;

GO_CONTROLLED;

NO_GO_PUBLIC.
```

Se qualquer invariante falhar:

```text
REFACTOR_REJECTED.
```

Não aceite com promessa de corrigir depois.

---

## Entendendo o que foi feito

### Segurança virou design explícito

Contexto, policies, preconditions e ports passaram a ter nomes próprios.

### Controllers ficaram menores

Eles deixaram de resolver identidade, tenant, audit e Redis manualmente.

### Domínio ficou mais independente

Framework e infraestrutura ficaram fora das invariantes centrais.

### Duplicação foi reduzida

Errors, audit events, contexts e fixtures foram consolidados.

### Contratos permaneceram estáveis

Status, fields, headers e reason codes não mudaram.

### Testes ganharam intent

Cenários passaram a expressar ameaças e propriedades.

### Architecture tests protegeram boundaries

Novos acoplamentos inseguros passam a falhar cedo.

### Release decision permaneceu honesta

Melhor design não eliminou gaps operacionais.

---

## Erros comuns importantes

### Refatorar e adicionar feature no mesmo PR

Fica difícil separar regressão estrutural de comportamento novo.

### Criar SecurityUtils

A policy se torna genérica e invisível.

### Centralizar tudo em um facade

A classe universal acumula identidade, tenant, rate limit, audit e domínio.

### Mover packages sem testes intermediários

Imports compilam, mas annotations e scanning podem mudar.

### Trocar query scoped por filtro em memória

O vazamento pode ocorrer antes da filtragem.

### Unificar todos os conflicts

Stale, state e race possuem significados diferentes.

### Tornar helper de teste permissivo

O cenário deixa de provar a propriedade.

### Remover teste duplicado sem analisar camada

Unit e integration podem parecer iguais, mas validar coisas diferentes.

### Alterar Redis namespace sem plano

Counters ativos podem ser perdidos.

### Aceitar diff grande porque “só moveu arquivos”

Annotations, proxies, package scanning e configs podem mudar.

---

## Comandos úteis

### Baseline

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

### Testes de invariantes

```powershell
.\mvnw.cmd `
  -Dtest=SecurityInvariantPolicyTest,SecurityRefactoringRegressionTest,SecurityArchitectureTest `
  test
```

### Suíte de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

### Revisar diff

```powershell
git diff --stat
git diff --check
git diff
```

### Procurar padrões genéricos

```powershell
git grep `
  -n `
  -E `
  "class SecurityUtils|class CommonUtils|findById\\(|permitAll\\(|@Disabled|<skip>true</skip>"
```

---

## Exercício guiado

### Parte 1 — Baseline

Congele contracts e evidências.

### Parte 2 — Invariantes

Documente propriedades não negociáveis.

### Parte 3 — Contexto

Centralize identidade e tenant.

### Parte 4 — Policies

Separe authorization e preconditions.

### Parte 5 — Infraestrutura

Crie ports para rate limit e audit.

### Parte 6 — Web

Reduza controllers e centralize errors.

### Parte 7 — Packages

Aplique boundaries claros.

### Parte 8 — Test support

Melhore fixtures e nomes.

### Parte 9 — Regressão

Compare SQL, Redis, audit, logs e contracts.

### Parte 10 — Decisão

Aceite ou rejeite a refatoração por evidência.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a prova prática foi preservada;
- nenhuma feature nova foi adicionada;
- baseline anterior foi registrada;
- invariantes de segurança foram documentadas;
- cada invariante possui controle, teste e owner;
- plano de refatoração foi criado;
- mudanças foram feitas em passos pequenos;
- `SecurityRequestContext` não contém token ou credential;
- identidade e tenant foram centralizados sem ocultar a policy;
- argument resolver foi testado;
- permissions permaneceram em Method Security;
- review policy preservou tenant, state e SoD;
- queries scoped permaneceram no repository;
- ETag e preconditions foram centralizados;
- contratos `400`, `401`, `403`, `404`, `409`, `412`, `428`, `429` e `503` foram preservados;
- audit factory não aceita payload;
- audit obrigatório permaneceu transacional;
- rate limiting passou por port;
- Redis continuou usando HMAC e fail-closed;
- Problem Details foi centralizado sem vazar internals;
- controllers não acessam repositories;
- domain não depende de HTTP, Redis ou Spring Security;
- package boundaries foram documentados;
- architecture tests foram criados;
- test support ficou somente em `src/test`;
- testes foram nomeados por propriedade;
- characterization e regression tests foram criados;
- SQL manteve tenant e ownership;
- Redis manteve namespace, TTLs e privacy;
- audit manteve campos e ausência de payload;
- logs mantiveram ausência de sentinelas;
- Problem Details permaneceu estável;
- concurrency e rollback foram testados;
- SCA permaneceu ativa;
- nenhum teste foi desabilitado;
- checklist de PR foi aplicado;
- rollback da refatoração foi documentado;
- evidence document foi criado;
- decisão foi `REFACTOR_ACCEPTED` somente com gate verde;
- produção pública permaneceu NO-GO;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff --stat
git diff --check
git diff
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
git commit -m "refactor(m15): consolidar arquitetura de seguranca"
```

Depois:

```powershell
git log -1 --oneline
git status --short
```

Reexecute o gate no commit final.

Não inclua:

- feature nova;
- dependency não revisada;
- token;
- secret;
- backup;
- SQL logs;
- report de outro commit;
- teste desabilitado;
- suppression nova;
- mudança de permission não documentada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as correções da prova deixaram de ser apenas patches isolados.

O projeto passou a expressar segurança por meio de:

```text
invariantes;

contextos;

policies;

ports;

factories;

boundaries;

contracts;

architecture tests.
```

A refatoração preservou:

```text
JWT;

identidade local;

tenant;

permissions;

ownership;

segregation of duties;

If-Match;

optimistic locking;

audit;

logs;

rate limiting;

hardening;

SCA;

GO/NO-GO.
```

A decisão central foi:

```text
bom design de segurança
não esconde controles;

ele torna responsabilidades,
fronteiras e evidências
mais fáceis de localizar
e mais difíceis de contornar.
```

A refatoração foi aceita somente porque:

- os contratos permaneceram iguais;
- as queries permaneceram scoped;
- os side effects permaneceram corretos;
- os tests continuaram verdes;
- o gate continuou ativo;
- o risco residual não foi omitido.

A próxima aula será:

```text
454 - M15.44 - Aula ensinavel seguranca
```

Nela, você irá transformar o módulo em uma aula que possa ser apresentada para outra pessoa, com:

- objetivo;
- narrativa;
- demonstração;
- analogias;
- perguntas;
- exercício;
- critérios de avaliação;
- feedback.

---

# Material complementar

## Checkpoint final

- [ ] Congelei contratos antes de mover código.
- [ ] Documentei invariantes.
- [ ] Separei contexto, policies e infraestrutura.
- [ ] Criei architecture e regression tests.
- [ ] Aceitei a refatoração somente com gate verde.

---

## Troubleshooting adicional

### O controller ficou menor, mas os testes falham com 401

O argument resolver pode não estar registrado ou pode esperar um tipo de `Authentication` diferente.

### Cross-tenant passou após mover repository

A nova query perdeu o predicate de tenant.

Pare a refatoração e restaure o contrato.

### Method Security deixou de executar

O service pode ter sido criado manualmente ou movido para package fora do scanning.

### Audit sumiu depois da factory

O service pode estar criando o event, mas não chamando o recorder obrigatório.

### Redis voltou a falhar aberto

O adapter pode estar capturando a exception e não propagando a falha catalogada.

### Problem Details mudou o code

A centralização pode ter usado um code genérico.

Restaure o catálogo aprovado.

### Architecture test ficou rígido demais

Ajuste a regra para refletir a boundary real, sem remover a proteção relevante.

### O diff ficou enorme

Divida em commits ou passos menores e reexecute as evidências.

---

## Perguntas de revisão

1. O que uma refatoração deve preservar?
2. Segurança faz parte do comportamento?
3. O que é characterization test?
4. O que é invariante?
5. Contexto pode conter token?
6. Tenant é resolvido onde?
7. Ownership fica no controller?
8. Permission fica apenas na policy de domínio?
9. Para que serve um port?
10. Audit factory pode receber body?
11. ETag parser pertence ao domínio?
12. Stale e race são iguais?
13. Controller pode acessar repository?
14. Domain pode depender de Redis?
15. Architecture test substitui integration test?
16. Helper de teste deve esconder intent?
17. Refatoração pode mudar Redis namespace?
18. Gate verde elimina gaps de produção?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Comportamento observável.
2. Sim.
3. Teste que congela comportamento aprovado.
4. Propriedade que deve permanecer verdadeira.
5. Não.
6. Na factory por membership validada.
7. Não.
8. Não; permission geral permanece no Method Security.
9. Separar aplicação da infraestrutura.
10. Não.
11. Não; fica na fronteira web.
12. Não.
13. Não.
14. Não.
15. Não.
16. Não.
17. Não sem plano.
18. Não.
19. Aula ensinavel seguranca.
20. Ensinar e demonstrar o módulo.

---

## Desafio opcional

Crie um relatório automático que compare antes e depois:

```text
status HTTP;

Problem Details;

headers;

SQL predicates;

audit fields;

Redis namespaces;

test count;

SCA status;

artifact hash.
```

O relatório não precisa comparar IDs ou timestamps variáveis.

Ele deve destacar somente mudanças observáveis relevantes.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 453 - M15.43 - Refatoracao final seguranca

- Refatorei o projeto prático sem adicionar features.
- Registrei a baseline antes das mudanças.
- Criei `M15_SECURITY_REFACTORING_PLAN.md`.
- Criei `M15_SECURITY_INVARIANTS.md`.
- Liguei invariantes a controls, tests e owners.
- Criei `SecurityInvariantPolicyTest`.
- Criei `SecurityRequestContext`.
- Mantive token e credentials fora do contexto.
- Criei `SecurityRequestContextFactory`.
- Centralizei identidade e tenant.
- Criei `@CurrentSecurityContext`.
- Criei argument resolver explícito.
- Migrei controllers em passos pequenos.
- Mantive permissions no Method Security.
- Criei `AccessRequestReviewPolicy`.
- Mantive tenant, state e segregation of duties.
- Separei queries de requester e reviewer.
- Centralizei `If-Match` e preconditions.
- Mantive `412` para stale e `409` para race.
- Criei catálogo de reason codes.
- Criei `AccessRequestAuditEventFactory`.
- Mantive payload fora de audit.
- Criei port de rate limiting.
- Mantive Redis com HMAC e fail-closed.
- Centralizei Problem Details.
- Separei handlers por fronteira.
- Criei contract tests.
- Organizei packages por responsabilidade.
- Documentei package boundaries.
- Criei `SecurityArchitectureTest`.
- Organizei test support em `src/test`.
- Substituí magic UUIDs por atores nomeados.
- Nomeei testes por propriedade de segurança.
- Criei `SecurityRefactoringRegressionTest`.
- Comparei SQL, Redis, audit, logs e errors.
- Executei concurrency e rollback tests.
- Mantive SCA ativa.
- Apliquei checklist de PR crítico.
- Documentei rollback.
- Criei `M15_SECURITY_REFACTORING_EVIDENCE.md`.
- Aceitei a refatoração somente com gate verde.
- Mantive `GO_CONTROLLED`.
- Mantive `NO_GO_PUBLIC`.
- Próxima aula: Aula ensinavel seguranca.
```

---

## Referência técnica curta

- [Spring Security — Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Framework — Method Arguments](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/arguments.html)
- [Spring Data JPA — Query Methods](https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Martin Fowler — Refactoring](https://martinfowler.com/books/refactoring.html)
- [ArchUnit User Guide](https://www.archunit.org/userguide/html/000_Index.html)

Regra final:

```text
a refatoração final de segurança deve preservar cada invariante observável enquanto melhora a estrutura interna: identidade e tenant formam um contexto mínimo, permissions permanecem em Method Security, policies de domínio expressam ownership, segregação e estado, preconditions preservam ETag e concorrência, audit factories impedem payloads, ports separam Redis e infraestrutura, Problem Details mantém contracts, packages respeitam boundaries e characterization, architecture, integration e policy tests provam que nenhuma simplificação criou bypass, vazamento, fail-open ou mudança silenciosa na decisão de release.
```
