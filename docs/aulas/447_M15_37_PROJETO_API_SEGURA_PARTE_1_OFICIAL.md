# 447 - M15.37 - Projeto API segura parte 1

## Apresentação da aula

Chegamos ao projeto prático guiado do Módulo 15.

Os controles estudados separadamente agora precisam funcionar juntos em uma aplicação coerente. O projeto será uma:

```text
API segura de solicitações de acesso.
```

Usuários autenticados solicitarão acesso a aplicações internas dentro de sua organização. Cada solicitação terá:

```text
tenant;

requester;

aplicação alvo;

nível de acesso;

justification;

status.
```

O domínio combina identidade externa, tenancy, ownership, permissions, workflow, dado pessoal, auditoria, mass assignment, erros seguros e testes.

A pergunta central será:

```text
como iniciar uma API segura
pela modelagem de risco
e entregar uma primeira
fatia vertical funcional
sem deixar segurança
para o final?
```

A parte 1 entrega:

- JWT do Keycloak;
- validação de issuer e audience;
- identidade local provisionada;
- membership e TenantContext;
- criação de solicitação;
- leitura da própria solicitação;
- listagem das próprias solicitações;
- PostgreSQL;
- DTOs mínimos;
- Problem Details;
- testes positivos e negativos.

Approval, rejection, cancelamento, auditor, supervisor, global admin, rate limiting específico, privacidade ampliada e hardening final ficam para as partes 2 e 3.

A fatia vertical liga:

```text
JWT;

identidade;

tenant;

permission;

request DTO;

command;

aggregate;

repository scoped;

response;

audit mínimo;

testes.
```

O projeto será criado em:

```text
labs/m15/projeto-api-segura
```

Package base:

```text
br.com.formacao.secureaccess
```

Reutilize a mesma versão de Java 21, Spring Boot e dependências já validada no laboratório principal. Adapte apenas componentes compreendidos, como correlation ID, Problem Details, audience validator, tenancy, fixtures e PostgreSQL.

A API não implementará username e password. O Keycloak realiza o login, e o projeto atua como OAuth 2.0 Resource Server. Ele aceita access token, rejeita ID Token como credencial da API, não recebe password e não emite refresh token.

A parte termina quando um usuário provisionado cria e consulta apenas seus recursos no tenant válido, enquanto cross-tenant, outro owner, token inválido e campos controlados pelo servidor são rejeitados.

---

## Onde estamos na formação

A sequência oficial é:

```text
445:
Hardening de API.

446:
Checklist seguranca em PR.

447:
Projeto API segura parte 1.

448:
Projeto API segura parte 2.

449:
Projeto API segura parte 3.

450:
Projeto final modulo 15.
```

A aula 446 respondeu:

```text
como preservar segurança
durante mudanças em PR?
```

A aula 447 responderá:

```text
como começar uma aplicação
já orientada por risco,
com uma fatia vertical segura?
```

Nesta parte:

```text
escopo:
sim.

requisitos:
sim.

threat model:
sim.

dados:
classificados.

atores:
definidos.

permissions:
definidas.

Keycloak:
Resource Server.

tenant:
resolvido localmente.

create:
implementado.

read own:
implementado.

list own:
implementado.

review:
parte 2.

hardening final:
parte 3.
```

A regra central será:

```text
segurança entra
na primeira migration,
no primeiro DTO,
na primeira query
e no primeiro teste.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
labs/m15/projeto-api-segura/
├── pom.xml
├── compose.yaml
├── README.md
├── docs/
│   └── security/
│       ├── PROJECT_SECURITY_REQUIREMENTS.md
│       ├── PROJECT_THREAT_MODEL.md
│       ├── PROJECT_DATA_CLASSIFICATION.md
│       └── PROJECT_AUTHORIZATION_MODEL.md
└── src/
    ├── main/
    │   ├── java/
    │   └── resources/
    └── test/
```

Packages:

```text
br.com.formacao.secureaccess
├── configuration
│   ├── security
│   ├── web
│   └── persistence
├── domain
│   ├── identity
│   ├── tenancy
│   └── accessrequest
├── application
│   ├── identity
│   ├── tenancy
│   └── accessrequest
├── persistence
│   ├── identity
│   ├── tenancy
│   └── accessrequest
└── web
    ├── error
    └── v1
        └── accessrequest
```

Migrations:

```text
V1__create_identity_and_tenancy.sql;

V2__create_access_request.sql.
```

Endpoints desta parte:

```text
POST /api/v1/access-requests;

GET /api/v1/access-requests/{id};

GET /api/v1/access-requests.
```

Permissions:

```text
access-request:create;

access-request:read.
```

Status inicial:

```text
PENDING.
```

Testes:

```text
AccessRequestCreationIntegrationTest;

AccessRequestReadSecurityTest;

AccessRequestListSecurityTest;

AccessRequestMassAssignmentTest;

JwtBoundarySecurityTest;

TenantContextSecurityTest;

ProjectSecurityPolicyTest.
```

Você irá:

1. criar o projeto;
2. definir o escopo;
3. escrever requisitos de segurança;
4. classificar dados;
5. criar threat model;
6. definir atores;
7. definir permissions;
8. criar migrations;
9. mapear identidade externa;
10. resolver usuário local;
11. resolver tenant;
12. configurar Resource Server;
13. validar issuer e audience;
14. criar aggregate;
15. criar DTOs;
16. criar repository scoped;
17. criar endpoints;
18. criar erros seguros;
19. criar testes negativos;
20. registrar a primeira entrega.

---

## Conceito essencial

### O projeto começa pelo risco

Antes do controller, identifique ativos, atores, dados, operações, fronteiras, abusos e evidências. Essas respostas direcionam arquitetura e testes.
### Ativos

Os ativos principais são identidade, memberships, tenant, solicitação, justification, permissions e histórico. A justification pode conter dado pessoal ou interno e nunca entra em logs.
### Atores da parte 1

A parte 1 implementa REQUESTER, ANONYMOUS, UNPROVISIONED_USER e CROSS_TENANT_USER. REVIEWER, AUDITOR, TENANT_ADMIN e GLOBAL_SECURITY_ADMIN ficam para a parte 2.
### Identidade externa e local

O token fornece issuer, subject e authorities. A aplicação mantém usuário, identidade externa e memberships; a chave estável é `issuer + subject`, nunca e-mail ou username.
### Provisionamento

JWT válido não cria usuário. Acesso exige identidade local, usuário ativo e membership ativa; ausência produz `403 identity_not_provisioned`.
### Tenant

Tenant vem de membership validada. `X-Tenant-Id` é apenas seletor: uma membership permite seleção automática; múltiplas exigem header; tenant sem membership produz `403`.
### Permission

Create exige `access-request:create`; read e list exigem `access-request:read`. A comparação é exata e role não substitui permission.
### Ownership

Parte 1 permite somente recursos do usuário atual no tenant atual. A query aplica `tenant_id` e `requester_user_id`, evitando lookup global seguido de autorização.
### Contrato de ocultação

UUID inexistente, de outro owner ou de outro tenant retorna o mesmo `404 access_request_not_found`.
### Dados pessoais

Classificação inicial:

| Campo | Classe | Observação |
|---|---|---|
| requesterUserId | PERSONAL | vínculo com pessoa |
| issuer | INTERNAL | identifica provedor |
| subject | PERSONAL | identidade externa |
| tenantId | INTERNAL | fronteira organizacional |
| targetApplication | INTERNAL | sistema solicitado |
| requestedAccessLevel | INTERNAL | privilégio desejado |
| justification | PERSONAL | texto livre |
| status | INTERNAL | workflow |
| createdAt | INTERNAL | auditoria |
| correlationId | INTERNAL | rastreabilidade |

Nenhum campo é `SECRET`.

Tokens são secrets transitórios e não pertencem ao domínio.

---

### Justificativa

A justification possui de 10 a 1000 caracteres, é normalizada e não aceita HTML ativo, controles, arquivos, tokens ou passwords. Regex não substitui orientação e minimização.
### Status

Toda criação nasce `PENDING`. O body não aceita status, reviewer, tenant, requester, version ou timestamps.
### Concorrência

A entity já possui `@Version`, preparando decisões da parte 2 sem expor version no body.
### Auditoria mínima

Registre criação e negação com actor, tenant, target, outcome e correlation ID, sem justification, token, subject, e-mail ou body.
## Mão na massa guiada

### 1. Criar o diretório

Na raiz do repositório:

```powershell
New-Item `
  -ItemType Directory `
  -Path labs/m15/projeto-api-segura `
  -Force

Set-Location `
  labs/m15/projeto-api-segura
```

Crie o projeto Spring Boot usando a mesma linha de versão já utilizada no laboratório principal.

Java:

```text
21.
```

---

### 2. Definir dependências iniciais

O `pom.xml` precisa de:

```text
spring-boot-starter-web;

spring-boot-starter-validation;

spring-boot-starter-security;

spring-boot-starter-oauth2-resource-server;

spring-boot-starter-data-jpa;

spring-boot-starter-actuator;

flyway-core;

postgresql;

spring-boot-starter-test;

spring-security-test;

testcontainers-postgresql;

testcontainers-junit-jupiter.
```

Não adicione Redis nesta parte.

Ele será usado quando o projeto receber rate limiting específico.

---

### 3. Criar o README

Arquivo:

```text
README.md
```

Inclua:

```markdown
# Secure Access Request API

## Objetivo

Gerenciar solicitacoes de acesso
com identidade externa,
tenant, ownership,
permissions e auditoria.

## Parte atual

- Resource Server.
- identidade provisionada.
- tenant context.
- create.
- read own.
- list own.

## Fora do escopo atual

- review.
- approval.
- rejection.
- global admin.
- rate limiting.
- release production.
```

---

### 4. Criar requisitos de segurança

Arquivo:

```text
docs/security/PROJECT_SECURITY_REQUIREMENTS.md
```

IDs:

```text
PSR-AUTHN-001:
aceitar somente JWT
do issuer configurado.

PSR-AUTHN-002:
exigir audience secure-access-api.

PSR-ID-001:
resolver issuer + subject localmente.

PSR-TENANT-001:
validar membership.

PSR-AUTHZ-001:
create exige permission.

PSR-AUTHZ-002:
read exige permission e ownership.

PSR-AUTHZ-003:
cross-tenant retorna 404.

PSR-DATA-001:
justification não entra em log.

PSR-INPUT-001:
campos desconhecidos falham.

PSR-INPUT-002:
campos server-controlled falham.

PSR-TEST-001:
cenários negativos não geram side effects.
```

---

### 5. Criar classificação de dados

Arquivo:

```text
docs/security/PROJECT_DATA_CLASSIFICATION.md
```

Use as classes:

```text
PUBLIC;

INTERNAL;

PERSONAL;

SENSITIVE;

SECRET.
```

Documente cada campo.

Classifique access token como:

```text
SECRET;

transitório;

não persistido;

não logado.
```

---

### 6. Criar o threat model

Arquivo:

```text
docs/security/PROJECT_THREAT_MODEL.md
```

Ameaças iniciais:

```text
PTH-001:
token de issuer não confiável.

PTH-002:
ID Token usado como access token.

PTH-003:
identidade externa não provisionada
ganha acesso local.

PTH-004:
tenant header forjado.

PTH-005:
requester lê solicitação de outro owner.

PTH-006:
requester lê outro tenant.

PTH-007:
body define tenant, owner ou status.

PTH-008:
justification aparece em log.

PTH-009:
unknown fields são ignorados.

PTH-010:
listagem vaza count de outro owner.

PTH-011:
filtro usa query global.

PTH-012:
erro revela existência do recurso.

PTH-013:
JWT authority semelhante
é aceita como permission.

PTH-014:
usuário inativo continua acessando.
```

Para cada ameaça, registre controle e teste.

---

### 7. Criar o modelo de autorização

Arquivo:

```text
docs/security/PROJECT_AUTHORIZATION_MODEL.md
```

Matriz da parte 1:

| Actor | Create | Read own | Read other | List own |
|---|---:|---:|---:|---:|
| Anonymous | 401 | 401 | 401 | 401 |
| Requester com permission | 201 | 200 | 404 | 200 |
| Requester sem permission | 403 | 403 | 403 | 403 |
| Unprovisioned | 403 | 403 | 403 | 403 |
| Cross tenant | - | 404 | 404 | conteúdo vazio/scoped |

---

### 8. Criar V1 de identidade e tenancy

Arquivo:

```text
V1__create_identity_and_tenancy.sql
```

```sql
create table tenant (
    id uuid primary key,
    code varchar(80) not null unique,
    name varchar(160) not null,
    active boolean not null,
    created_at timestamptz not null
);

create table application_user (
    id uuid primary key,
    display_name varchar(160) not null,
    active boolean not null,
    created_at timestamptz not null
);

create table external_identity (
    id uuid primary key,
    application_user_id uuid not null,
    issuer varchar(300) not null,
    subject varchar(255) not null,

    constraint fk_external_identity_user
        foreign key (application_user_id)
        references application_user(id),

    constraint uk_external_identity
        unique (issuer, subject)
);

create table tenant_membership (
    id uuid primary key,
    tenant_id uuid not null,
    application_user_id uuid not null,
    active boolean not null,
    created_at timestamptz not null,

    constraint fk_membership_tenant
        foreign key (tenant_id)
        references tenant(id),

    constraint fk_membership_user
        foreign key (application_user_id)
        references application_user(id),

    constraint uk_tenant_membership
        unique (tenant_id, application_user_id)
);
```

---

### 9. Criar índices de identidade

```sql
create index ix_external_identity_lookup
    on external_identity (
        issuer,
        subject
    );

create index ix_membership_user_active
    on tenant_membership (
        application_user_id,
        active
    );

create index ix_membership_tenant_user
    on tenant_membership (
        tenant_id,
        application_user_id,
        active
    );
```

A unique constraint de identidade continua sendo a proteção principal.

---

### 10. Criar V2 de access request

```sql
create table access_request (
    id uuid primary key,
    tenant_id uuid not null,
    requester_user_id uuid not null,
    target_application varchar(120) not null,
    requested_access_level varchar(30) not null,
    justification varchar(1000) not null,
    status varchar(30) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    version bigint not null,

    constraint fk_access_request_tenant
        foreign key (tenant_id)
        references tenant(id),

    constraint fk_access_request_requester
        foreign key (requester_user_id)
        references application_user(id),

    constraint ck_access_request_level
        check (
            requested_access_level in (
                'READ_ONLY',
                'STANDARD',
                'ELEVATED'
            )
        ),

    constraint ck_access_request_status
        check (
            status in (
                'PENDING',
                'APPROVED',
                'REJECTED',
                'CANCELED'
            )
        )
);
```

Parte 1 cria somente `PENDING`.

Os outros estados existem para a continuidade do projeto.

---

### 11. Criar índices tenant-scoped

```sql
create index ix_access_request_owner_list
    on access_request (
        tenant_id,
        requester_user_id,
        created_at desc,
        id
    );

create index ix_access_request_tenant_status
    on access_request (
        tenant_id,
        status,
        created_at desc
    );
```

O primeiro índice atende a listagem da parte 1.

O segundo prepara a fila de revisão da parte 2.

---

### 12. Criar ExternalIdentityKey

```java
public record ExternalIdentityKey(
        String issuer,
        String subject
) {
    public ExternalIdentityKey {
        if (
            issuer == null
            || issuer.isBlank()
            || subject == null
            || subject.isBlank()
        ) {
            throw new IllegalArgumentException(
                "External identity is required"
            );
        }
    }
}
```

Não use e-mail nessa chave.

---

### 13. Criar AuthenticatedApplicationUser

```java
public record AuthenticatedApplicationUser(
        UUID userId,
        ExternalIdentityKey externalIdentity,
        Set<String> authorities
) {
    public AuthenticatedApplicationUser {
        authorities =
                Set.copyOf(
                        authorities
                );
    }
}
```

O objeto não contém access token.

---

### 14. Criar AuthenticatedUserResolver

```java
@Component
public class AuthenticatedUserResolver {

    private final ExternalIdentityRepository repository;

    public AuthenticatedApplicationUser resolve(
            JwtAuthenticationToken authentication
    ) {
        Jwt jwt =
                authentication.getToken();

        ExternalIdentityKey key =
                new ExternalIdentityKey(
                        jwt.getIssuer()
                           .toString(),
                        jwt.getSubject()
                );

        ApplicationUser user =
                repository
                    .findActiveUserByIdentity(
                        key
                    )
                    .orElseThrow(
                        IdentityNotProvisionedException::new
                    );

        Set<String> authorities =
                authentication
                    .getAuthorities()
                    .stream()
                    .map(
                        GrantedAuthority::getAuthority
                    )
                    .collect(
                        Collectors.toUnmodifiableSet()
                    );

        return new AuthenticatedApplicationUser(
                user.getId(),
                key,
                authorities
        );
    }
}
```

O repository faz uma query específica.

---

### 15. Criar TenantContext

```java
public record TenantContext(
        UUID tenantId,
        UUID userId
) {
}
```

O tenant context não contém o header raw.

---

### 16. Criar TenantContextResolver

```java
@Component
public class TenantContextResolver {

    private final TenantMembershipRepository repository;

    public TenantContext resolve(
            AuthenticatedApplicationUser user,
            String selectedTenant
    ) {
        List<UUID> tenants =
                repository
                    .findActiveTenantIdsByUserId(
                        user.userId()
                    );

        if (tenants.isEmpty()) {
            throw new TenantAccessDeniedException();
        }

        if (
            selectedTenant == null
            || selectedTenant.isBlank()
        ) {
            if (tenants.size() == 1) {
                return new TenantContext(
                        tenants.getFirst(),
                        user.userId()
                );
            }

            throw new TenantContextRequiredException();
        }

        UUID tenantId =
                parseTenantId(
                        selectedTenant
                );

        if (!tenants.contains(tenantId)) {
            throw new TenantAccessDeniedException();
        }

        return new TenantContext(
                tenantId,
                user.userId()
        );
    }
}
```

A query retorna somente memberships ativas.

---

### 17. Configurar o Resource Server

Arquivo:

```text
application-local.yaml
```

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri:
            http://localhost:8180/realms/formacao-java

app:
  security:
    jwt:
      required-audience:
        secure-access-api
```

O issuer local é HTTP apenas no laboratório.

Produção pública continua NO-GO.

---

### 18. Criar audience validator

```java
public final class RequiredAudienceValidator
        implements OAuth2TokenValidator<Jwt> {

    private final String requiredAudience;

    @Override
    public OAuth2TokenValidatorResult validate(
            Jwt token
    ) {
        if (
            token.getAudience()
                 .contains(
                     requiredAudience
                 )
        ) {
            return OAuth2TokenValidatorResult.success();
        }

        OAuth2Error error =
                new OAuth2Error(
                        "invalid_token",
                        "Required audience is missing",
                        null
                );

        return OAuth2TokenValidatorResult.failure(
                error
        );
    }
}
```

A response pública não precisa repetir a audience esperada.

---

### 19. Criar a SecurityFilterChain

```java
@Bean
SecurityFilterChain apiSecurity(
        HttpSecurity http
) throws Exception {

    http
        .csrf(
            csrf ->
                csrf.disable()
        )
        .sessionManagement(
            session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
        )
        .authorizeHttpRequests(
            requests ->
                requests
                    .requestMatchers(
                        "/actuator/health/**"
                    )
                    .permitAll()
                    .requestMatchers(
                        "/api/**"
                    )
                    .authenticated()
                    .anyRequest()
                    .denyAll()
        )
        .oauth2ResourceServer(
            oauth2 ->
                oauth2.jwt(
                    Customizer.withDefaults()
                )
        );

    return http.build();
}
```

Method Security aplicará permissions específicas.

---

### 20. Criar enum de nível

```java
public enum RequestedAccessLevel {
    READ_ONLY,
    STANDARD,
    ELEVATED
}
```

Não aceite valor arbitrário.

---

### 21. Criar enum de status

```java
public enum AccessRequestStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELED
}
```

Parte 1 utiliza apenas `PENDING`.

---

### 22. Criar o aggregate

```java
@Entity
@Table(
    name = "access_request"
)
public class AccessRequest {

    @Id
    private UUID id;

    @Column(
        name = "tenant_id",
        nullable = false,
        updatable = false
    )
    private UUID tenantId;

    @Column(
        name = "requester_user_id",
        nullable = false,
        updatable = false
    )
    private UUID requesterUserId;

    private String targetApplication;

    @Enumerated(EnumType.STRING)
    private RequestedAccessLevel requestedAccessLevel;

    private String justification;

    @Enumerated(EnumType.STRING)
    private AccessRequestStatus status;

    private Instant createdAt;

    private Instant updatedAt;

    @Version
    private long version;
}
```

Não adicione setters públicos.

---

### 23. Criar factory do aggregate

```java
public static AccessRequest create(
        UUID id,
        TenantContext tenant,
        CreateAccessRequestCommand command,
        Instant now
) {
    AccessRequest request =
            new AccessRequest();

    request.id =
            Objects.requireNonNull(
                    id
            );

    request.tenantId =
            tenant.tenantId();

    request.requesterUserId =
            tenant.userId();

    request.targetApplication =
            normalizeTargetApplication(
                    command.targetApplication()
            );

    request.requestedAccessLevel =
            Objects.requireNonNull(
                    command.requestedAccessLevel()
            );

    request.justification =
            normalizeJustification(
                    command.justification()
            );

    request.status =
            AccessRequestStatus.PENDING;

    request.createdAt = now;
    request.updatedAt = now;

    return request;
}
```

Tenant, owner, status e timestamps vêm do servidor.

---

### 24. Criar request DTO

```java
public record CreateAccessRequestRequest(
        @NotBlank
        @Size(
            max = 120
        )
        String targetApplication,

        @NotNull
        RequestedAccessLevel requestedAccessLevel,

        @NotBlank
        @Size(
            min = 10,
            max = 1000
        )
        String justification
) {
}
```

Unknown properties continuam rejeitadas.

---

### 25. Criar command

```java
public record CreateAccessRequestCommand(
        String targetApplication,
        RequestedAccessLevel requestedAccessLevel,
        String justification
) {
}
```

O command não contém contexto de segurança.

O application service recebe o contexto separadamente.

---

### 26. Criar response DTO

```java
public record AccessRequestResponse(
        UUID id,
        String targetApplication,
        RequestedAccessLevel requestedAccessLevel,
        String justification,
        AccessRequestStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
```

Não inclui:

- tenant ID;
- requester user ID;
- version;
- issuer;
- subject;
- audit metadata.

---

### 27. Criar repository

```java
public interface AccessRequestRepository
        extends JpaRepository<
            AccessRequest,
            UUID
        > {

    Optional<AccessRequest>
    findByIdAndTenantIdAndRequesterUserId(
            UUID id,
            UUID tenantId,
            UUID requesterUserId
    );

    Page<AccessRequest>
    findAllByTenantIdAndRequesterUserId(
            UUID tenantId,
            UUID requesterUserId,
            Pageable pageable
    );
}
```

Não crie `findById` no application service.

---

### 28. Criar application service

```java
@Service
public class AccessRequestApplicationService {

    private final AccessRequestRepository repository;

    private final Clock clock;

    @PreAuthorize(
        "hasAuthority('access-request:create')"
    )
    @Transactional
    public AccessRequestResult create(
            TenantContext tenant,
            CreateAccessRequestCommand command
    ) {
        AccessRequest request =
                AccessRequest.create(
                        UUID.randomUUID(),
                        tenant,
                        command,
                        clock.instant()
                );

        repository.save(
                request
        );

        return AccessRequestResult.from(
                request
        );
    }
}
```

O service não recebe tenant do DTO.

---

### 29. Criar findById

```java
@PreAuthorize(
    "hasAuthority('access-request:read')"
)
@Transactional(
    readOnly = true
)
public AccessRequestResult findById(
        TenantContext tenant,
        UUID accessRequestId
) {
    AccessRequest request =
            repository
                .findByIdAndTenantIdAndRequesterUserId(
                    accessRequestId,
                    tenant.tenantId(),
                    tenant.userId()
                )
                .orElseThrow(
                    AccessRequestNotFoundException::new
                );

    return AccessRequestResult.from(
            request
    );
}
```

Recurso inexistente, outro owner e outro tenant produzem a mesma exception.

---

### 30. Criar list

```java
@PreAuthorize(
    "hasAuthority('access-request:read')"
)
@Transactional(
    readOnly = true
)
public Page<AccessRequestResult> listOwn(
        TenantContext tenant,
        Pageable pageable
) {
    return repository
            .findAllByTenantIdAndRequesterUserId(
                    tenant.tenantId(),
                    tenant.userId(),
                    pageable
            )
            .map(
                AccessRequestResult::from
            );
}
```

A count query nasce do mesmo predicate.

---

### 31. Criar controller

```java
@RestController
@RequestMapping(
    path = "/api/v1/access-requests",
    produces = MediaType.APPLICATION_JSON_VALUE
)
public class AccessRequestController {

    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    ResponseEntity<AccessRequestResponse> create(
            JwtAuthenticationToken authentication,
            @RequestHeader(
                name = "X-Tenant-Id",
                required = false
            )
            String selectedTenant,
            @Valid
            @RequestBody
            CreateAccessRequestRequest request
    ) {
        var user =
                authenticatedUserResolver
                    .resolve(
                        authentication
                    );

        var tenant =
                tenantContextResolver
                    .resolve(
                        user,
                        selectedTenant
                    );

        var result =
                service.create(
                    tenant,
                    mapper.toCommand(
                        request
                    )
                );

        return ResponseEntity
                .created(
                    locationOf(
                        result.id()
                    )
                )
                .body(
                    mapper.toResponse(
                        result
                    )
                );
    }
}
```

Na refatoração futura, os resolvers poderão virar argument resolvers.

Nesta parte, a sequência explícita facilita o aprendizado.

---

### 32. Criar GET individual

```java
@GetMapping("/{accessRequestId}")
ResponseEntity<AccessRequestResponse> findById(
        JwtAuthenticationToken authentication,
        @RequestHeader(
            name = "X-Tenant-Id",
            required = false
        )
        String selectedTenant,
        @PathVariable
        UUID accessRequestId
) {
    var user =
            authenticatedUserResolver
                .resolve(
                    authentication
                );

    var tenant =
            tenantContextResolver
                .resolve(
                    user,
                    selectedTenant
                );

    return ResponseEntity.ok(
            mapper.toResponse(
                service.findById(
                    tenant,
                    accessRequestId
                )
            )
    );
}
```

---

### 33. Criar listagem

```java
@GetMapping
PageResponse<AccessRequestResponse> listOwn(
        JwtAuthenticationToken authentication,
        @RequestHeader(
            name = "X-Tenant-Id",
            required = false
        )
        String selectedTenant,
        @PageableDefault(
            size = 20,
            sort = "createdAt",
            direction = Sort.Direction.DESC
        )
        Pageable pageable
) {
    var user =
            authenticatedUserResolver
                .resolve(
                    authentication
                );

    var tenant =
            tenantContextResolver
                .resolve(
                    user,
                    selectedTenant
                );

    return pageMapper.toResponse(
            service.listOwn(
                tenant,
                pageable
            )
            .map(
                mapper::toResponse
            )
    );
}
```

Limite máximo:

```text
100.
```

Sort permitido:

```text
createdAt;

targetApplication;

status.
```

---

### 34. Criar Problem Details

Codes da parte 1:

```text
authentication_required;

invalid_token;

identity_not_provisioned;

tenant_context_required;

tenant_access_denied;

access_denied;

access_request_not_found;

unknown_request_property;

invalid_request_payload;

validation_failed.
```

Todos usam:

```text
application/problem+json;

correlationId;

Cache-Control: no-store.
```

---

### 35. Criar auditoria mínima

Tabela simples:

```text
security_audit_event.
```

Ou adapte o recorder do projeto anterior.

Evento de criação:

```text
action:
ACCESS_REQUEST_CREATED.

actor:
requester user ID.

tenant:
tenant ID.

target:
access request ID.

outcome:
SUCCESS.
```

Não grave a justification.

---

### 36. Criar compose PostgreSQL

Arquivo:

```text
compose.yaml
```

Use versão PostgreSQL já validada no curso.

Características:

- volume nomeado;
- healthcheck;
- rede local;
- password por secret ou variável local ignorada;
- porta somente para laboratório;
- sem dados de produção.

---

### 37. Criar configuração de testes

Use Testcontainers PostgreSQL.

```java
@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
abstract class PostgreSqlIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>(
                    "postgres:17-alpine"
            );

    @DynamicPropertySource
    static void databaseProperties(
            DynamicPropertyRegistry registry
    ) {
        registry.add(
            "spring.datasource.url",
            POSTGRES::getJdbcUrl
        );

        registry.add(
            "spring.datasource.username",
            POSTGRES::getUsername
        );

        registry.add(
            "spring.datasource.password",
            POSTGRES::getPassword
        );
    }
}
```

Use a tag exata já aprovada no laboratório ao implementar.

Não use `latest`.

---

### 38. Criar fixtures

Fixtures:

```text
Tenant Alpha;

Tenant Beta;

User Alpha;

User Alpha Second;

User Beta;

external identities;

memberships;

access request Alpha own;

access request Alpha other owner;

access request Beta.
```

Todos os valores são sintéticos.

---

### 39. Criar AccessRequestCreationIntegrationTest

Cenários:

- token válido;
- audience válida;
- identity provisionada;
- membership única;
- permission create;
- body válido;
- `201`;
- Location;
- status `PENDING`;
- tenant derivado;
- owner derivado;
- timestamps do Clock;
- audit sem justification.

---

### 40. Testar criação sem permission

Token válido, identity provisionada e tenant válido.

Sem:

```text
access-request:create.
```

Esperado:

```text
403 access_denied;

repository unchanged;

audit success absent.
```

---

### 41. Testar identity não provisionada

Token válido com issuer e subject inexistentes.

Esperado:

```text
403 identity_not_provisioned;

tenant repository não consultado;

access request não criada.
```

A response não ecoa subject.

---

### 42. Criar AccessRequestMassAssignmentTest

Payload:

```json
{
  "targetApplication": "erp",
  "requestedAccessLevel": "STANDARD",
  "justification": "Necessidade de operar o módulo financeiro.",
  "tenantId": "20000000-0000-0000-0000-000000000002",
  "requesterUserId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "status": "APPROVED",
  "version": 999
}
```

Esperado:

```text
400 unknown_request_property;

nenhuma persistência;

nenhum audit de sucesso.
```

---

### 43. Criar AccessRequestReadSecurityTest

Cenários:

```text
own + same tenant:
200.

other owner + same tenant:
404.

other tenant:
404.

missing:
404.

sem read permission:
403.

anônimo:
401.
```

Compare o contrato dos três `404`.

---

### 44. Criar AccessRequestListSecurityTest

Para User Alpha:

```text
content:
somente próprias do Alpha.

totalElements:
somente próprias do Alpha.

nenhuma Alpha de outro owner.

nenhuma Beta.
```

Teste page size acima do máximo.

Esperado:

```text
400 invalid_page_size.
```

---

### 45. Criar JwtBoundarySecurityTest

Cenários:

- issuer correto e audience correta;
- issuer errado;
- audience ausente;
- audience do client OIDC;
- expirado;
- token malformado;
- authority semelhante;
- `ROLE_REQUESTER` sem permission.

Esperado:

```text
401 para token inválido;

403 para permission ausente.
```

ID Token com audience do client não acessa a API.

---

### 46. Criar TenantContextSecurityTest

Cenários:

- uma membership sem header;
- duas memberships sem header;
- header válido;
- header de outro tenant;
- UUID malformado;
- membership inativa;
- user inativo.

Contratos:

```text
400 tenant_context_required;

403 tenant_access_denied;

403 identity_not_provisioned
ou user_inactive catalogado.
```

Escolha um catálogo único e documente.

---

### 47. Criar ProjectSecurityPolicyTest

Falhe se encontrar:

```text
@RequestBody AccessRequest;

findById(
sem tenant/owner no service;

BeanUtils.copyProperties;

@JsonAnySetter;

ignoreUnknown = true;

log de justification;

log de token;

anyRequest().permitAll();

issuer-uri ausente;

audience validator ausente.
```

O teste é guardrail.

---

### 48. Executar a fatia vertical

Suba o Keycloak local da aula 435.

Garanta no realm:

```text
client audience:
secure-access-api.

permission claim:
access-request:create;
access-request:read.
```

Provisione a identidade no PostgreSQL.

Inicie:

```powershell
.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

Não use password grant para obter token.

Use o fluxo Authorization Code + PKCE já validado.

---

### 49. Executar a suíte

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=AccessRequestCreationIntegrationTest,AccessRequestReadSecurityTest,AccessRequestListSecurityTest,AccessRequestMassAssignmentTest,JwtBoundarySecurityTest,TenantContextSecurityTest,ProjectSecurityPolicyTest `
  test
```

Gate:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- migrations;
- Resource Server;
- issuer;
- audience;
- identidade;
- tenant;
- create;
- read own;
- list own;
- ownership;
- `401`;
- `403`;
- `404`;
- mass assignment;
- logs;
- audit;
- policy;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### O projeto começou com requisitos

Controllers não definiram a segurança por acidente.

### Identidade externa foi ligada ao usuário local

Issuer e subject formaram a chave estável.

### Token válido não significou acesso automático

Provisionamento e membership continuaram necessários.

### Tenant foi resolvido antes do domínio

O body não controlou a fronteira organizacional.

### Ownership foi aplicado na query

Recursos de outro owner ou tenant permaneceram ocultos.

### O aggregate nasceu protegido

Status, owner, tenant e timestamps são controlados pelo servidor.

### A primeira fatia vertical ficou completa

Create, read e list possuem persistência, contrato e testes negativos.

### O escopo permaneceu controlado

Review, admin, rate limit e hardening final foram preservados para as próximas partes.

---

## Erros comuns importantes

### Começar pelo controller

Sem requisitos e ameaças, regras importantes ficam implícitas.

### Criar usuário automaticamente por qualquer token

Autenticação externa não concede provisionamento local.

### Usar e-mail como identidade

E-mail pode mudar ou ser reutilizado.

### Confiar no X-Tenant-Id

O header é seletor, não autorização.

### Consultar por ID e autorizar depois

A existência do recurso pode vazar.

### Colocar status no DTO de criação

O requester poderia aprovar a própria solicitação.

### Logar justification para depurar

O texto pode conter dados pessoais ou internos.

### Aceitar ID Token na API

ID Token autentica o client; access token autoriza a API.

### Criar todos os atores na parte 1

O escopo cresce antes da primeira fatia funcionar.

### Testar somente criação válida

Cross-tenant, permission e mass assignment ficam sem proteção.

---

## Comandos úteis

### Criar projeto

```powershell
New-Item `
  -ItemType Directory `
  -Path labs/m15/projeto-api-segura `
  -Force
```

### Subir PostgreSQL

```powershell
docker compose up -d
docker compose ps
```

### Executar testes

```powershell
.\mvnw.cmd test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar padrões inseguros

```powershell
git grep `
  -n `
  -E `
  "RequestBody.*AccessRequest|copyProperties|JsonAnySetter|ignoreUnknown *= *true|log\\..*justification"
```

---

## Exercício guiado

### Parte 1 — Escopo

Escreva o que entra e o que fica para as próximas partes.

### Parte 2 — Risco

Crie requisitos, classificação e threat model.

### Parte 3 — Identidade

Mapeie issuer e subject para usuário local.

### Parte 4 — Tenancy

Resolva membership e tenant selecionado.

### Parte 5 — Domínio

Crie aggregate com status inicial seguro.

### Parte 6 — Entrada

Crie request DTO mínimo e mapper explícito.

### Parte 7 — Persistência

Use queries com tenant e owner.

### Parte 8 — API

Implemente create, read own e list own.

### Parte 9 — Testes

Cubra tokens, permissions, cross-tenant e mass assignment.

### Parte 10 — Gate

Execute verify e registre a entrega.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 446 foi preservada;
- projeto e escopo das três partes foram definidos;
- requisitos, classificação, threat model, atores e permissions foram criados;
- API atua como Resource Server e não implementa login próprio;
- ID Token é rejeitado; issuer e audience são validados;
- identidade usa issuer + subject e exige provisionamento ativo;
- tenant vem de membership validada, não do body ou header isolado;
- migrations, constraints e índices foram criados;
- toda criação nasce `PENDING`;
- tenant, owner, status, version e timestamps são server-controlled;
- DTOs são mínimos e repositories filtram tenant e owner;
- create, read own e list own exigem permissions explícitas;
- missing, cross-owner e cross-tenant usam o mesmo `404`;
- listagem e count não vazam dados;
- justification não entra em logs ou audit payload;
- Problem Details possui codes catalogados;
- PostgreSQL real e fixtures sintéticas foram usados;
- JWT, ID Token, identidade, tenant e mass assignment foram testados;
- cenários negados não produzem side effects;
- policy test foi criado;
- review e decisões não foram antecipados;
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
  "RequestBody.*AccessRequest|copyProperties|JsonAnySetter|log\\..*justification"
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
git commit -m "feat(m15): iniciar projeto pratico de API segura"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- password;
- token;
- secret;
- usuário real;
- tenant real;
- dump do Keycloak;
- justification real;
- `.env`;
- volume PostgreSQL;
- reports locais;
- configuração de produção não validada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto prático começou pela engenharia de risco.

Antes do controller, foram definidos:

```text
ativos;

atores;

dados;

ameaças;

requirements;

permissions;

fronteiras;

evidências.
```

A primeira fatia vertical entregou:

```text
Resource Server;

issuer;

audience;

identidade provisionada;

membership;

tenant context;

create;

read own;

list own;

PostgreSQL;

tests.
```

A segurança foi aplicada desde a primeira migration.

O requester não controla:

```text
tenant;

owner;

status;

version;

timestamps.
```

A query protege:

```text
tenant;

ownership.
```

O contrato público protege contra enumeração:

```text
missing;

outro owner;

outro tenant;

todos:
404.
```

A decisão central foi:

```text
uma API segura
não nasce quando
adicionamos um filtro
ao final;

ela nasce quando
escopo, dados,
queries, DTOs
e testes são projetados
com a ameaça em mente.
```

A próxima aula será:

```text
448 - M15.38 - Projeto API segura parte 2
```

Nela, você irá:

- implementar review;
- criar approval e rejection;
- ampliar roles e permissions;
- testar segregation of duties;
- impedir self-approval;
- criar auditoria completa;
- aplicar rate limiting;
- proteger logs do workflow;
- ampliar a matriz de autorização;
- testar concorrência nas decisões.

---

# Material complementar

## Checkpoint final

- [ ] Criei requisitos, classificação e threat model.
- [ ] Configurei Resource Server com issuer e audience.
- [ ] Resolvi identidade e tenant localmente.
- [ ] Implementei create, read own e list own.
- [ ] Testei permissions, ownership, tenant e mass assignment.

---

## Troubleshooting adicional

### Token válido recebe 403

Confirme provisionamento por issuer + subject, usuário ativo, membership ativa e permission.

### ID Token acessa a API

O audience validator pode estar ausente ou a audience do ID Token foi aceita indevidamente.

### Header de outro tenant funciona

O resolver está apenas parseando o UUID sem validar membership.

### Outro owner recebe 403

A aplicação pode estar autorizando depois de uma query global.

Use query tenant-scoped e owner-scoped para retornar `404`.

### Listagem mostra total maior

A count query não está usando requester e tenant.

### Campo status é aceito

O DTO pode conter status ou unknown fields estão sendo ignorados.

### Justification aparece no log

Remova o objeto completo do logger e atualize o sentinel test.

### Teste funciona sem proxy de Method Security

O service pode estar sendo criado com `new`.

Use o bean Spring.

---

## Perguntas de revisão

1. Qual é o domínio do projeto?
2. Por que ele é adequado ao módulo?
3. A API implementa login próprio?
4. Qual token a API aceita?
5. Qual chave liga a identidade externa?
6. Token válido provisiona usuário?
7. De onde vem o tenant?
8. O header prova acesso?
9. Qual status nasce na criação?
10. Quem define owner?
11. Quem define timestamps?
12. Qual query protege read?
13. Outro owner retorna o quê?
14. Outro tenant retorna o quê?
15. Justification pode ir para log?
16. Qual é o limite da justification?
17. Quais endpoints foram implementados?
18. O que ficou para a parte 2?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Solicitações de acesso.
2. Combina identidade, tenant, workflow e auditoria.
3. Não.
4. Access token.
5. Issuer + subject.
6. Não.
7. Membership local validada.
8. Não.
9. PENDING.
10. O servidor pelo usuário autenticado.
11. Clock do servidor.
12. ID + tenant + requester.
13. 404.
14. 404.
15. Não.
16. De 10 a 1000 caracteres.
17. Create, read own e list own.
18. Review, decisões e controles ampliados.
19. Projeto API segura parte 2.
20. Approval, rejection, auditoria e autorização.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 447 - M15.37 - Projeto API segura parte 1

- Iniciei o projeto prático guiado do Módulo 15.
- Criei `labs/m15/projeto-api-segura`.
- Escolhi o domínio de solicitações de acesso.
- Delimitei as três partes do projeto.
- Criei requisitos de segurança.
- Criei classificação de dados.
- Criei threat model inicial.
- Defini atores da parte 1.
- Defini permissions `access-request:create` e `access-request:read`.
- Mantive login no Keycloak.
- Configurei a API como OAuth 2.0 Resource Server.
- Mantive ID Token fora da API.
- Validei issuer exato.
- Validei audience `secure-access-api`.
- Modelei identidade externa por issuer + subject.
- Exigi provisionamento local.
- Modelei tenant, usuário, external identity e membership.
- Criei `V1__create_identity_and_tenancy.sql`.
- Criei `V2__create_access_request.sql`.
- Criei constraints e índices.
- Modelei `AccessRequest`.
- Defini níveis READ_ONLY, STANDARD e ELEVATED.
- Defini status PENDING, APPROVED, REJECTED e CANCELED.
- Mantive criação sempre em PENDING.
- Mantive tenant, owner, status e timestamps controlados pelo servidor.
- Criei DTO de criação mínimo.
- Criei command interno.
- Criei response DTO sem campos internos.
- Criei repository com tenant e owner.
- Implementei create.
- Implementei read own.
- Implementei list own.
- Mantive missing, cross-owner e cross-tenant como `404`.
- Mantive listagem e count scoped.
- Criei Problem Details catalogados.
- Criei auditoria mínima sem justification.
- Configurei PostgreSQL com Testcontainers.
- Criei fixtures sintéticas.
- Testei criação válida e sem permission.
- Testei identity não provisionada.
- Testei mass assignment.
- Testei JWT, issuer, audience e ID Token.
- Testei tenant context.
- Criei `ProjectSecurityPolicyTest`.
- Executei o gate completo.
- Mantive produção pública como NO-GO.
- Próxima aula: Projeto API segura parte 2.
```

---

## Referência técnica curta

- [Spring Security — OAuth 2.0 Resource Server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Data JPA — Query Methods](https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html)
- [Spring Boot — Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)

Regra final:

```text
a primeira parte do projeto de API segura deve entregar uma fatia vertical pequena e completa: requisitos e ameaças vêm antes do código, access tokens são validados por issuer e audience, issuer + subject resolvem uma identidade local provisionada, memberships resolvem o tenant, DTOs impedem mass assignment, o servidor define owner e status, queries filtram tenant e ownership, errors ocultam recursos e testes negativos comprovam ausência de persistência, vazamento e bypass.
```
