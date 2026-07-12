# 437 - M15.27 - Multi tenancy seguranca

## Apresentação da aula

Na aula 436, o projeto concluiu um login OpenID Connect real com o Keycloak.

A autenticação interativa passou a utilizar:

```text
realm:
formacao-java.

client:
formacao-java-login-lab.

flow:
Authorization Code.

PKCE:
S256.

identidade:
issuer + subject.

sessão:
somente na chain web.
```

A API de Ordens de Serviço permaneceu:

```text
Bearer Token;

stateless;

Problem Details;

sem redirect;

sem sessão obrigatória.
```

Essa separação respondeu corretamente:

```text
quem está autenticado?
```

Ela ainda não responde:

```text
a qual organização
essa identidade pertence?

quais dados dessa organização
podem ser consultados?

o usuário pode atuar
em mais de uma organização?

como impedir que um identificador
enviado pelo cliente troque
o tenant efetivo da operação?
```

Essas perguntas pertencem à segurança multi-tenant.

Um sistema multi-tenant atende organizações diferentes dentro da mesma aplicação.

Exemplos de tenant:

- empresa cliente;
- filial isolada;
- parceiro;
- unidade de negócio;
- organização contratante;
- workspace;
- conta corporativa.

O risco central é:

```text
um usuário autenticado
do tenant A
acessar dados do tenant B.
```

Esse problema não é resolvido apenas por:

- login válido;
- role;
- permission;
- UUID imprevisível;
- filtro no frontend;
- header enviado pelo browser;
- esconder botões;
- usar um banco compartilhado;
- adicionar uma coluna sem utilizá-la nas queries.

A pergunta central desta aula será:

```text
como derivar um tenant confiável
a partir da identidade e dos memberships,
aplicar esse contexto em todas as queries
e impedir acesso cross-tenant
mesmo quando o cliente manipula
IDs, headers e payloads?
```

A baseline usará um modelo de banco compartilhado com coluna discriminadora:

```text
shared database;

shared schema;

tenant_id em cada recurso
que pertence a um tenant.
```

A escolha mantém o PostgreSQL existente, torna os testes cross-tenant explícitos e prepara uma futura camada com Row-Level Security.

A coluna sozinha não isola; toda operação precisa de contexto confiável.

O contexto será:

```text
TenantContext(
    tenantId,
    userId,
    accessMode
).
```

Ele será resolvido pelo servidor.

O cliente poderá enviar:

```http
X-Tenant-Id: <uuid>
```

somente como seletor.

O header não concede acesso. O backend irá:

1. autenticar a identidade;
2. resolver o usuário local;
3. carregar memberships ativos;
4. interpretar o seletor;
5. validar membership;
6. criar o `TenantContext`;
7. aplicar `tenant_id` nas queries;
8. rejeitar tentativas fora do tenant.

A regra será:

```text
tenant enviado:
input não confiável.

membership persistido:
fonte de autorização.

TenantContext validado:
contexto usado pela aplicação.
```

Usuário com um único membership ativo:

```text
pode omitir o header;
o tenant é resolvido automaticamente.
```

Usuário com múltiplos memberships:

```text
precisa selecionar
um tenant válido.
```

Usuário sem membership:

```text
acesso negado.
```

Usuário com authority global precisa selecionar o tenant explicitamente.

O laboratório criará `tenant`, `tenant_membership`, `external_identity` e `tenant_id` em `service_order`.

`external_identity` ligará `issuer + subject` ao usuário local, sem usar e-mail ou username como chave.

A autorização da Ordem de Serviço combinará permission, tenant e ownership. Conhecer o UUID, possuir `service-order:read` ou manipular header, body e endpoint não permite ao operador do tenant A acessar a OS do tenant B. O recurso permanece oculto por `404 service_order_not_found`.

A tentativa de selecionar um tenant sem membership será:

```text
403 tenant_access_denied.
```

A ausência de seleção quando há ambiguidade será:

```text
400 tenant_context_required.
```

Ficam fora desta aula banco ou schema por tenant, provisionamento, billing, quotas, organizações do Keycloak, RLS ativa, migração online, anonimização e retenção.

A próxima aula será:

```text
438 - M15.28 - LGPD para backend
```

Nela, o isolamento será complementado por minimização, finalidade, retenção e direitos do titular.

---

## Onde estamos na formação

A sequência oficial é:

```text
435:
Keycloak ambiente local.

436:
Login com Keycloak.

437:
Multi tenancy seguranca.

438:
LGPD para backend.

439:
Rate limiting seguranca.

440:
Protecao contra mass assignment.
```

A aula 436 respondeu:

```text
quem foi autenticado
pelo OpenID Provider?
```

A aula 437 responderá:

```text
em qual tenant
essa identidade pode atuar
nesta operação?
```

Nesta aula:

```text
tenant:
sim.

membership:
sim.

identidade externa:
sim.

seleção validada:
sim.

isolamento de query:
sim.

ownership dentro do tenant:
sim.

admin global:
sim.

testes cross-tenant:
sim.

Row-Level Security:
discutida, não ativada.

LGPD:
próxima aula.
```

A regra central será:

```text
tenant context não nasce
de um header ou payload;

ele nasce da identidade
mais um membership validado.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/db/migration/
└── V12__add_multi_tenant_security.sql
```

Domínio de tenancy:

```text
domain/tenant/
├── Tenant.java
├── TenantStatus.java
├── TenantMembership.java
├── TenantMembershipStatus.java
├── ExternalIdentity.java
└── TenantAccessMode.java
```

Aplicação:

```text
application/tenant/
├── TenantContext.java
├── TenantContextResolver.java
├── TenantSelection.java
├── TenantContextRequiredException.java
├── TenantAccessDeniedException.java
└── ExternalIdentityLinkService.java
```

Persistência:

```text
persistence/tenant/
├── TenantRepository.java
├── TenantMembershipRepository.java
└── ExternalIdentityRepository.java
```

Ordem de Serviço atualizada:

```text
ServiceOrder;

ServiceOrderApplicationService;

ServiceOrderRepository;

ServiceOrderSpecifications;

ServiceOrderBusinessAuthorization.
```

Web:

```text
TenantSelectionResolver.java;

TenantErrorHandler.java.
```

Testes:

```text
TenantContextResolverTest;

TenantIsolationIntegrationTest;

TenantRepositoryPolicyTest;

KeycloakTenantIdentityTest.
```

Documentação:

```text
docs/security/
├── M15_MULTI_TENANCY_SECURITY.md
└── M15_TENANT_AUTHORIZATION_MATRIX.md
```

Você irá:

1. definir tenant;
2. modelar membership;
3. ligar OIDC a usuário local;
4. criar migration;
5. adicionar tenant às Ordens de Serviço;
6. resolver seleção;
7. validar membership;
8. tratar usuário com um tenant;
9. tratar múltiplos tenants;
10. tratar acesso global;
11. criar contexto explícito;
12. aplicar contexto no create;
13. aplicar contexto no list;
14. aplicar contexto no find;
15. aplicar contexto no update;
16. aplicar contexto no delete;
17. combinar tenant e ownership;
18. padronizar erros;
19. testar cross-tenant;
20. preparar LGPD.

---

## Conceito essencial

### Tenant não é usuário

Tenant é uma fronteira organizacional. Um usuário pode pertencer a um, vários ou nenhum tenant e também pode possuir acesso administrativo global. Quando múltiplos memberships são possíveis, uma coluna única em `application_user` não representa corretamente o domínio.
### Membership é autorização

Authentication responde quem é a identidade; membership responde em qual tenant ela pode atuar. A tabela `tenant_membership` será a fonte de autorização e guardará tenant, usuário, status e timestamps, enquanto roles e permissions permanecem no modelo já existente.
### Identidade externa não é usuário local

O Keycloak fornece `issuer` e `subject`; a aplicação possui `application_user.id`. A tabela `external_identity` liga `iss + sub` ao usuário local. E-mail e username não participam dessa chave.
### Tenant selection é input, não authority

`X-Tenant-Id` apenas seleciona o contexto desejado. O servidor faz parse do UUID e valida membership ativa antes de criar `TenantContext`. Usar o valor diretamente na query seria inseguro.
### Um membership ativo

Com exatamente um membership ativo e sem header, o backend resolve o tenant automaticamente. Se o header vier, ele ainda precisa corresponder ao membership.
### Múltiplos memberships

Com dois ou mais memberships ativos, a aplicação exige seleção explícita e retorna `400 tenant_context_required` quando ela falta. O erro não lista tenants.
### Acesso administrativo global

A authority `tenant:access:all` permite selecionar qualquer tenant ativo, mas nunca cria uma consulta sem tenant. A seleção explícita preserva auditoria, previsibilidade e redução de blast radius.
### TenantContext explícito

`TenantContext(tenantId, userId, accessMode)` é imutável e válido para uma operação. Ele será passado explicitamente, evitando `ThreadLocal` manual e vazamento entre threads.
### Filtrar no banco

O predicate de tenant precisa existir no SQL. Filtrar em memória expõe dados ao processo, quebra paginação e count, aumenta consumo e facilita vazamento acidental.
### Repository qualificado

Fluxos tenant-scoped usam métodos como `findByIdAndTenantId`, `existsByIdAndTenantId` e specifications que começam por tenant. Métodos genéricos sem tenant não são usados pela camada de aplicação.
### Create deriva tenant

O request não contém `tenantId`. A entidade recebe o tenant do contexto validado; o cliente não escolhe a fronteira por body.
### Ownership existe dentro do tenant

Primeiro o recurso precisa pertencer ao tenant selecionado; depois ownership, role e permission são avaliados. Supervisor e auditor possuem amplitude apenas dentro do tenant, salvo a authority global específica.
### 404 para recurso cross-tenant

Consultas individuais usam `id + tenant_id`. Quando não há resultado, retornam `404` sem uma segunda busca global, reduzindo enumeração.
### 403 para seleção não autorizada

Selecionar tenant sem membership retorna `403 tenant_access_denied` sem revelar existência, nome, status ou memberships.
### 400 para ausência ambígua

Múltiplos memberships sem seleção produzem `400 tenant_context_required`: o usuário está autenticado e autorizado em mais de um contexto, mas ainda não escolheu um.
### Header malformado

UUID inválido retorna `400 invalid_tenant_context`, mantendo contrato previsível.
### Cache e tenant

Toda chave tenant-scoped inclui `tenantId`, resource ID, filtros e paginação. `service-order:{id}` é substituída por `tenant:{tenantId}:service-order:{id}`.
### Eventos e jobs

Async, schedulers e consumers não herdam tenant de uma request. O contexto validado precisa viajar no comando ou evento; jobs sem contexto são rejeitados.
### Auditoria

Audit events incluem `tenant_id` validado, além de actor, action e target. O header bruto nunca é persistido como fonte de verdade.
### Row-Level Security

PostgreSQL Row-Level Security pode reforçar o isolamento, mas exige contexto transacional correto no pool, policies sem bypass, testes de prepared statements, migrations e jobs. A aula registra RLS como defesa futura e consolida primeiro o isolamento explícito na aplicação.
## Mão na massa guiada

### 1. Criar a migration V12

Arquivo:

```text
V12__add_multi_tenant_security.sql
```

Comece:

```sql
create table tenant (
    id uuid primary key,
    code varchar(80) not null,
    name varchar(160) not null,
    status varchar(20) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,

    constraint uk_tenant_code
        unique (code),

    constraint ck_tenant_status
        check (
            status in (
                'ACTIVE',
                'INACTIVE'
            )
        )
);
```

---

### 2. Criar tenant_membership

```sql
create table tenant_membership (
    tenant_id uuid not null,
    user_id uuid not null,
    status varchar(20) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,

    primary key (
        tenant_id,
        user_id
    ),

    constraint fk_tenant_membership_tenant
        foreign key (tenant_id)
        references tenant (id),

    constraint fk_tenant_membership_user
        foreign key (user_id)
        references application_user (id),

    constraint ck_tenant_membership_status
        check (
            status in (
                'ACTIVE',
                'SUSPENDED',
                'REVOKED'
            )
        )
);
```

Crie índice:

```sql
create index ix_tenant_membership_user_status
    on tenant_membership (
        user_id,
        status,
        tenant_id
    );
```

---

### 3. Criar external_identity

```sql
create table external_identity (
    issuer varchar(300) not null,
    subject varchar(255) not null,
    user_id uuid not null,
    created_at timestamptz not null,

    primary key (
        issuer,
        subject
    ),

    constraint fk_external_identity_user
        foreign key (user_id)
        references application_user (id),

    constraint uk_external_identity_user
        unique (user_id)
);
```

Nesta baseline, cada usuário local possui no máximo uma identidade externa.

---

### 4. Adicionar tenant à OS

```sql
alter table service_order
    add column tenant_id uuid;

alter table service_order
    add constraint fk_service_order_tenant
        foreign key (tenant_id)
        references tenant (id);
```

Para o laboratório, crie tenants sintéticos:

```sql
insert into tenant (
    id,
    code,
    name,
    status,
    created_at,
    updated_at
)
values
(
    '10000000-0000-0000-0000-000000000001',
    'tenant-alpha',
    'Tenant Alpha',
    'ACTIVE',
    current_timestamp,
    current_timestamp
),
(
    '20000000-0000-0000-0000-000000000002',
    'tenant-beta',
    'Tenant Beta',
    'ACTIVE',
    current_timestamp,
    current_timestamp
);
```

Os UUIDs são sintéticos e exclusivos do laboratório.

---

### 5. Fazer backfill

Associe dados existentes ao tenant Alpha:

```sql
update service_order
set tenant_id =
    '10000000-0000-0000-0000-000000000001'
where tenant_id is null;
```

Depois:

```sql
alter table service_order
    alter column tenant_id
    set not null;
```

Crie índice:

```sql
create index ix_service_order_tenant_created
    on service_order (
        tenant_id,
        created_at desc,
        id
    );
```

---

### 6. Criar TenantContext

```java
public record TenantContext(
        UUID tenantId,
        UUID userId,
        TenantAccessMode accessMode
) {
    public TenantContext {
        Objects.requireNonNull(
                tenantId
        );

        Objects.requireNonNull(
                userId
        );

        Objects.requireNonNull(
                accessMode
        );
    }
}
```

Enum:

```java
public enum TenantAccessMode {
    MEMBERSHIP,
    GLOBAL
}
```

---

### 7. Criar TenantSelection

```java
public record TenantSelection(
        Optional<UUID> requestedTenantId
) {
    public static TenantSelection absent() {
        return new TenantSelection(
                Optional.empty()
        );
    }

    public static TenantSelection of(
            UUID tenantId
    ) {
        return new TenantSelection(
                Optional.of(tenantId)
        );
    }
}
```

O record carrega input parseado, ainda não autorizado.

---

### 8. Criar TenantSelectionResolver

```java
@Component
public class TenantSelectionResolver {

    private static final String HEADER =
            "X-Tenant-Id";

    public TenantSelection resolve(
            HttpServletRequest request
    ) {
        String raw =
                request.getHeader(
                        HEADER
                );

        if (
            raw == null
            || raw.isBlank()
        ) {
            return TenantSelection.absent();
        }

        try {
            return TenantSelection.of(
                    UUID.fromString(
                            raw.trim()
                    )
            );
        }
        catch (
            IllegalArgumentException exception
        ) {
            throw new InvalidTenantContextException();
        }
    }
}
```

Não registre o valor bruto.

---

### 9. Criar repositórios de tenancy

Membership:

```java
List<TenantMembership>
findByUserIdAndStatusOrderByTenantId(
        UUID userId,
        TenantMembershipStatus status
);
```

Consulta específica:

```java
boolean existsByTenantIdAndUserIdAndStatus(
        UUID tenantId,
        UUID userId,
        TenantMembershipStatus status
);
```

External identity:

```java
Optional<ExternalIdentity>
findByIssuerAndSubject(
        String issuer,
        String subject
);
```

---

### 10. Resolver o usuário autenticado

Crie um resolver que suporte:

```text
DatabaseUserPrincipal;

JwtAuthenticationToken;

OidcUser.
```

Para `OidcUser`:

```java
URI issuer =
        oidcUser.getIssuer();

String subject =
        oidcUser.getSubject();
```

Busque:

```text
issuer + subject.
```

Se não houver link:

```text
403 external_identity_not_linked.
```

Não crie conta automaticamente por e-mail.

---

### 11. Criar TenantContextResolver

```java
@Component
public class TenantContextResolver {

    private static final String GLOBAL_AUTHORITY =
            "tenant:access:all";

    private final AuthenticatedUserIdResolver
            userIdResolver;

    private final TenantMembershipRepository
            membershipRepository;

    public TenantContext resolve(
            Authentication authentication,
            TenantSelection selection
    ) {
        UUID userId =
                userIdResolver.resolve(
                        authentication
                );

        boolean global =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(
                            authority ->
                                GLOBAL_AUTHORITY.equals(
                                    authority.getAuthority()
                                )
                        );

        if (global) {
            UUID selected =
                    selection.requestedTenantId()
                            .orElseThrow(
                                TenantContextRequiredException::new
                            );

            return new TenantContext(
                    selected,
                    userId,
                    TenantAccessMode.GLOBAL
            );
        }

        List<UUID> activeTenantIds =
                membershipRepository
                        .findActiveTenantIds(
                                userId
                        );

        return resolveMembership(
                userId,
                activeTenantIds,
                selection
        );
    }
}
```

Acesso global ainda valida tenant existente e ativo.

---

### 12. Resolver membership

```java
private TenantContext resolveMembership(
        UUID userId,
        List<UUID> activeTenantIds,
        TenantSelection selection
) {
    if (activeTenantIds.isEmpty()) {
        throw new TenantAccessDeniedException();
    }

    if (
        selection.requestedTenantId()
                .isPresent()
    ) {
        UUID requested =
                selection.requestedTenantId()
                        .orElseThrow();

        if (
            !activeTenantIds.contains(
                    requested
            )
        ) {
            throw new TenantAccessDeniedException();
        }

        return new TenantContext(
                requested,
                userId,
                TenantAccessMode.MEMBERSHIP
        );
    }

    if (activeTenantIds.size() == 1) {
        return new TenantContext(
                activeTenantIds.getFirst(),
                userId,
                TenantAccessMode.MEMBERSHIP
        );
    }

    throw new TenantContextRequiredException();
}
```

Não selecione o primeiro tenant quando há múltiplos.

---

### 13. Validar tenant global

Para `GLOBAL`, consulte:

```java
tenantRepository
    .existsByIdAndStatus(
        selected,
        TenantStatus.ACTIVE
    );
```

Se não existir ou estiver inativo:

```text
403 tenant_access_denied.
```

A response não distingue os casos.

---

### 14. Atualizar ServiceOrder

Adicione:

```java
@Column(
    name = "tenant_id",
    nullable = false,
    updatable = false
)
private UUID tenantId;
```

No factory de criação:

```java
ServiceOrder.create(
        UUID tenantId,
        UUID ownerUserId,
        ...
);
```

`tenantId` não possui setter público.

---

### 15. Atualizar create

```java
@PreAuthorize(
    "hasAuthority('service-order:create')"
)
@Transactional
public ServiceOrderResult create(
        TenantContext tenant,
        CreateServiceOrderCommand command
) {
    ServiceOrder serviceOrder =
            ServiceOrder.create(
                    tenant.tenantId(),
                    tenant.userId(),
                    command.customerName(),
                    command.serviceType(),
                    command.description(),
                    command.serviceAddress(),
                    command.scheduledFor(),
                    clock.instant()
            );

    ServiceOrder saved =
            repository.save(
                    serviceOrder
            );

    auditCreate(
            tenant,
            saved
    );

    return mapper.toResult(
            saved
    );
}
```

O command não contém `tenantId`.

---

### 16. Criar specification de tenant

```java
public static Specification<ServiceOrder>
belongsToTenant(
        UUID tenantId
) {
    return (
        root,
        query,
        criteriaBuilder
    ) ->
        criteriaBuilder.equal(
            root.get("tenantId"),
            tenantId
        );
}
```

Essa specification é sempre a primeira da composição.

---

### 17. Atualizar listagem

```java
Specification<ServiceOrder> specification =
        belongsToTenant(
                tenant.tenantId()
        )
        .and(
            matchesStatus(
                filter.status()
            )
        )
        .and(
            customerContains(
                filter.customerName()
            )
        )
        .and(
            serviceTypeEquals(
                filter.serviceType()
            )
        )
        .and(
            scheduledBetween(
                filter.scheduledFrom(),
                filter.scheduledTo()
            )
        );
```

A mesma specification deve alimentar content e count.

---

### 18. Atualizar consulta individual

No repository:

```java
Optional<ServiceOrder>
findByIdAndTenantId(
        UUID id,
        UUID tenantId
);
```

No service:

```java
ServiceOrder serviceOrder =
        repository
            .findByIdAndTenantId(
                    serviceOrderId,
                    tenant.tenantId()
            )
            .orElseThrow(
                ServiceOrderNotFoundException::new
            );
```

Não execute segunda query global.

---

### 19. Atualizar update e status

Todas as operações carregam:

```text
TenantContext.
```

A primeira carga do aggregate usa:

```text
id + tenant_id.
```

Depois, aplique ownership e regras de negócio.

Assim:

```text
tenant mismatch:
404.

owner mismatch dentro do tenant:
404 conforme policy anterior.

permission ausente:
403.
```

---

### 20. Atualizar delete

Evite:

```java
repository.deleteById(
        serviceOrderId
);
```

Use:

```java
ServiceOrder serviceOrder =
        requireInTenant(
                tenant,
                serviceOrderId
        );

authorizationGuard
        .requireDelete(
                authentication,
                tenant,
                serviceOrder
        );

repository.delete(
        serviceOrder
);
```

O aggregate já está tenant-scoped.

---

### 21. Atualizar BusinessAuthorization

Assinatura:

```java
boolean canRead(
        Authentication authentication,
        TenantContext tenant,
        ServiceOrderAccessView resource
);
```

Comece:

```java
if (
    !tenant.tenantId()
            .equals(
                resource.tenantId()
            )
) {
    return false;
}
```

Depois avalie role e ownership.

Supervisor e auditor possuem amplitude apenas no tenant selecionado.

---

### 22. Atualizar projeção mínima

```java
public interface ServiceOrderAccessView {

    UUID getId();

    UUID getTenantId();

    UUID getOwnerUserId();

    ServiceOrderStatus getStatus();
}
```

A projeção também é consultada por `id + tenant_id`.

---

### 23. Criar TenantErrorHandler

Adicione codes:

```text
invalid_tenant_context;

tenant_context_required;

tenant_access_denied;

external_identity_not_linked.
```

Status:

| Code | Status |
|---|---:|
| `invalid_tenant_context` | 400 |
| `tenant_context_required` | 400 |
| `tenant_access_denied` | 403 |
| `external_identity_not_linked` | 403 |

Use o mesmo `ApiProblemFactory`.

Aplique `no-store`.

---

### 24. Atualizar cache

Mude a key:

```text
antes:
service-order:{id}.

depois:
tenant:{tenantId}:service-order:{id}.
```

Listas e filtros também incluem tenant.

Invalidação:

```text
somente chaves
do tenant afetado.
```

Crie teste garantindo que o mesmo resource ID em tenants diferentes não colide.

---

### 25. Atualizar auditoria

Adicione `tenant_id` em:

```sql
alter table security_audit_event
    add column tenant_id uuid;
```

Como V12 já está em construção, inclua a coluna na mesma migration.

Não adicione FK.

O audit trail precisa sobreviver à remoção do tenant.

O factory recebe:

```java
TenantContext tenant
```

e persiste somente o tenant validado.

---

### 26. Ligar identidade Keycloak

No laboratório, obtenha:

```text
issuer;

subject.
```

Crie um link administrativo controlado:

```sql
insert into external_identity (
    issuer,
    subject,
    user_id,
    created_at
)
values (
    :issuer,
    :subject,
    :userId,
    current_timestamp
);
```

O valor de `subject` vem do login validado.

Não use e-mail para localizar a conta automaticamente.

---

### 27. Criar TenantContextResolverTest

Cenários:

- zero membership;
- um membership sem header;
- um membership com header correto;
- um membership com header diferente;
- múltiplos memberships sem header;
- múltiplos com header válido;
- múltiplos com header inválido;
- global sem header;
- global com tenant ativo;
- global com tenant inexistente;
- membership suspenso;
- UUID malformado.

Valide codes e status esperados.

---

### 28. Criar TenantIsolationIntegrationTest

Use PostgreSQL real.

Crie:

```text
Tenant Alpha;

Tenant Beta;

Operator Alpha;

Operator Beta;

Supervisor Alpha;

Global Admin;

OS Alpha;

OS Beta.
```

Cada OS possui tenant e owner.

---

### 29. Testar listagem

Operator Alpha lista OS.

Resultado:

```text
somente OS Alpha.
```

Valide:

- content;
- totalElements;
- totalPages;
- count SQL;
- ausência de OS Beta.

Não filtre depois da paginação.

---

### 30. Testar consulta cross-tenant

Operator Alpha chama:

```text
GET /api/v2/service-orders/{osBetaId}
```

Com tenant Alpha:

```text
404 service_order_not_found.
```

Com header tenant Beta:

```text
403 tenant_access_denied.
```

A diferença protege membership e existência.

---

### 31. Testar writes cross-tenant

Operator Alpha tenta:

- PUT da OS Beta;
- PATCH status da OS Beta;
- DELETE da OS Beta.

Todos:

```text
404
```

quando o contexto validado é Alpha.

Nenhum evento de sucesso é persistido.

---

### 32. Testar criação

Envie body com campo extra:

```json
{
  "tenantId":
    "20000000-0000-0000-0000-000000000002"
}
```

A request DTO não utiliza esse campo.

A OS criada deve usar tenant Alpha derivado do contexto.

Se a policy de JSON rejeita propriedades desconhecidas, espere `400`.

O tenant do payload nunca pode prevalecer.

---

### 33. Testar supervisor

Supervisor Alpha possui permissions amplas de OS.

Ele pode atuar sobre OS de usuários diferentes dentro do Alpha.

Ele não pode atuar no Beta sem:

```text
membership Beta
ou tenant:access:all.
```

Isso limita a amplitude ao tenant.

---

### 34. Testar global admin

Global Admin seleciona Alpha:

```text
opera somente em Alpha.
```

Seleciona Beta:

```text
opera somente em Beta.
```

Sem header:

```text
400 tenant_context_required.
```

A authority global não cria query unscoped.

---

### 35. Testar external identity

Crie dois usuários OIDC com:

```text
mesmo email;

subjects diferentes.
```

Eles precisam mapear para identidades locais diferentes.

Crie:

```text
mesmo subject;

issuers diferentes.
```

Eles também são identidades externas diferentes.

A chave é:

```text
issuer + subject.
```

---

### 36. Criar TenantRepositoryPolicyTest

Inspecione application service e repositories.

Proíba uso em fluxos tenant-scoped:

```text
findById(id);

deleteById(id);

findAll() sem specification;

count() sem tenant;

cache key sem tenant.
```

O teste verifica métodos conhecidos e source patterns como guardrail.

---

### 37. Testar chamada direta de service

Use Method Security e contexto explícito.

Uma chamada direta ao bean com:

```text
permission válida;

TenantContext Alpha;

resource Beta.
```

precisa falhar antes de mutação.

Valide repository e audit.

---

### 38. Documentar a matriz

Arquivo:

```text
docs/security/M15_TENANT_AUTHORIZATION_MATRIX.md
```

Inclua:

| Actor | Tenant selecionado | Recurso | Resultado |
|---|---|---|---|
| Operator Alpha | Alpha | Alpha próprio | Conforme permission e ownership |
| Operator Alpha | Alpha | Alpha de outro usuário | Conforme role/ownership |
| Operator Alpha | Alpha | Beta | 404 |
| Operator Alpha | Beta | Qualquer | 403 na seleção |
| Supervisor Alpha | Alpha | Alpha | Permitido conforme permission |
| Supervisor Alpha | Alpha | Beta | 404 |
| Global Admin | Ausente | Qualquer | 400 |
| Global Admin | Beta | Beta | Permitido conforme permission |

---

### 39. Criar documento principal

Arquivo:

```text
docs/security/M15_MULTI_TENANCY_SECURITY.md
```

Inclua:

```markdown
# Seguranca multi-tenant

## Modelo

Shared database e shared schema.

## Fonte de verdade

Identity + active membership.

## Selecao

X-Tenant-Id e apenas seletor.

## Contexto

TenantContext validado e explicito.

## Persistencia

Toda query tenant-scoped inclui tenant_id.

## Ownership

Aplicado depois do isolamento de tenant.

## Admin global

Seleciona um tenant;
nunca executa sem filtro.

## Cache

Tenant faz parte da chave.

## Auditoria

Tenant validado faz parte do evento.

## Gaps

- RLS.
- Provisionamento.
- Quotas.
- Backup por tenant.
- Migracao online.
```

---

### 40. Atualizar threat model

Adicione:

```text
THR-167:
header tenant concede acesso.

THR-168:
query individual usa somente ID.

THR-169:
listagem filtra após paginação.

THR-170:
supervisor atravessa tenants.

THR-171:
admin global consulta sem tenant.

THR-172:
cache mistura tenants.

THR-173:
job reutiliza tenant de thread.

THR-174:
email liga identidade externa.

THR-175:
membership suspenso permanece ativo.

THR-176:
audit registra header não validado.

THR-177:
create aceita tenant do payload.

THR-178:
repository genérico ignora tenant.
```

Controles:

- membership;
- contexto explícito;
- predicates;
- admin com seleção;
- cache qualificado;
- contexto em eventos;
- `iss + sub`;
- status;
- audit validado;
- tenant derivado;
- policy test.

---

### 41. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
cross-tenant:
testado.

IDOR:
tenant + resource.

deny-by-default:
preservado.

permission:
validada por request.
```

A02 Security Misconfiguration:

```text
admin global:
sem modo unscoped.

header:
não confiável.
```

A09 Security Logging:

```text
tenant validado:
auditado.

header bruto:
não auditado como verdade.
```

Baseline:

```text
shared schema:
tenant_id obrigatório.

membership:
fonte de acesso.

queries:
tenant-scoped.

cache:
tenant-scoped.

RLS:
pendente.

produção pública:
NO-GO.
```

---

### 42. Executar o gate

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=TenantContextResolverTest,TenantIsolationIntegrationTest,TenantRepositoryPolicyTest,KeycloakTenantIdentityTest `
  test
```

Suítes anteriores:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderBusinessAuthorizationIntegrationTest,SecurityAuditIntegrationTest,KeycloakLoginLabSecurityTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- Flyway V12;
- PostgreSQL real;
- tenant e memberships;
- external identity;
- backfill;
- create;
- list e count;
- get;
- update;
- status;
- delete;
- supervisor;
- global admin;
- cache;
- audit;
- cross-tenant;
- profile Keycloak;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### Tenant virou uma fronteira explícita

Ele deixou de ser apenas um campo informativo.

### Membership virou fonte de autorização

O header não concede acesso.

### O contexto passou a ser validado

Somente `TenantContext` chega às operações de negócio.

### As queries passaram a isolar no banco

Content e count usam o mesmo predicate.

### Ownership permaneceu dentro do tenant

Role ampla não atravessa organizações.

### Admin global continuou scoped

Ele seleciona um tenant antes de agir.

### Cache e auditoria ganharam tenant

Essas camadas não podem misturar contextos.

### A identidade Keycloak foi ligada corretamente

O vínculo utiliza `issuer + subject`, não e-mail.

---

## Erros comuns importantes

### Confiar em X-Tenant-Id

O header é apenas um seletor.

### Usar tenantId do JSON

O tenant vem do contexto validado.

### Filtrar em memória

Dados de outros tenants já terão sido carregados.

### Esquecer a count query

A paginação pode revelar quantidades globais.

### Usar findById genérico

O UUID sozinho não aplica isolamento.

### Tornar supervisor global

Amplitude de role deve permanecer dentro do tenant.

### Permitir admin sem tenant

Isso cria uma rota unscoped perigosa.

### Cachear somente por ID

IDs e respostas podem colidir entre tenants.

### Usar e-mail no link OIDC

A identidade externa é `iss + sub`.

### Usar ThreadLocal manual

Async e pools podem carregar contexto incorreto.

---

## Comandos úteis

### Testes de tenancy

```powershell
.\mvnw.cmd `
  -Dtest=TenantContextResolverTest,TenantIsolationIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar repository sem tenant

```powershell
git grep `
  -n `
  -E `
  "findById\\(|deleteById\\(|findAll\\(\\)"
```

### Procurar tenant em DTO

```powershell
git grep `
  -n `
  -E `
  "Create.*tenantId|Update.*tenantId"
```

### Procurar cache sem tenant

```powershell
git grep `
  -n `
  -E `
  "service-order:\\{id\\}|service-order:\""
```

---

## Exercício guiado

### Parte 1 — Domínio

Modele tenant, membership e external identity.

### Parte 2 — Migration

Adicione `tenant_id` e faça backfill.

### Parte 3 — Seleção

Trate header como input não confiável.

### Parte 4 — Contexto

Crie `TenantContext` imutável.

### Parte 5 — Persistência

Inclua tenant em todas as queries.

### Parte 6 — Autorização

Combine permission, tenant e ownership.

### Parte 7 — Infraestrutura

Atualize cache e auditoria.

### Parte 8 — Keycloak

Mapeie `iss + sub` para usuário local.

### Parte 9 — Testes

Comprove isolamento cross-tenant.

### Parte 10 — Governança

Documente matriz, riscos e gaps.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 436 foi preservada;
- ponte correta aponta para LGPD para backend;
- tenant foi diferenciado de usuário;
- membership foi modelado;
- identidade externa foi modelada;
- chave externa usa issuer e subject;
- e-mail não foi usado como chave;
- migration V12 foi criada;
- tabela tenant foi criada;
- status de tenant foi validado;
- tabela tenant_membership foi criada;
- status de membership foi validado;
- tabela external_identity foi criada;
- `tenant_id` foi adicionado à OS;
- backfill foi executado;
- coluna ficou not null;
- foreign keys foram criadas;
- índices tenant-scoped foram criados;
- `TenantContext` foi criado;
- contexto é imutável;
- `TenantSelection` foi criado;
- header foi tratado como input;
- UUID malformado produz `400`;
- header não concede acesso;
- zero membership produz `403`;
- um membership permite resolução automática;
- seleção diferente é negada;
- múltiplos memberships exigem seleção;
- admin global exige seleção;
- tenant global precisa existir e estar ativo;
- modo sem tenant não existe;
- usuário local é resolvido;
- OIDC usa issuer e subject;
- conta não é criada por e-mail;
- create deriva tenant do contexto;
- DTO não controla tenant;
- entity possui tenant imutável;
- listagem filtra no SQL;
- count usa o mesmo predicate;
- find usa ID e tenant;
- update usa ID e tenant;
- status usa ID e tenant;
- delete usa aggregate tenant-scoped;
- query cross-tenant não é executada sem filtro;
- recurso cross-tenant retorna `404`;
- seleção não autorizada retorna `403`;
- seleção ambígua retorna `400`;
- Problem Details foi preservado;
- no-store foi aplicado;
- ownership é avaliado dentro do tenant;
- supervisor não atravessa tenants;
- auditor não atravessa tenants;
- global admin seleciona tenant;
- projection inclui tenant;
- cache key inclui tenant;
- invalidação inclui tenant;
- auditoria inclui tenant validado;
- header bruto não é auditado como verdade;
- async e scheduler sem contexto falham;
- RLS foi discutida sem implementação falsa;
- Testcontainers foi usado;
- Tenant Alpha e Beta foram testados;
- listagem não vaza dados;
- totalElements não vaza dados;
- get cross-tenant foi testado;
- writes cross-tenant foram testados;
- payload tenant foi rejeitado ou ignorado com segurança;
- supervisor foi testado;
- global admin foi testado;
- external identities foram testadas;
- repository policy test foi criado;
- direct service call foi testada;
- matriz de autorização foi criada;
- documento principal foi criado;
- threat model foi atualizado;
- OWASP A01, A02 e A09 foram atualizados;
- LGPD não foi antecipada;
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
git grep -n -E "findById\\(|deleteById\\(|findAll\\(\\)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
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
git commit -m "feat(m15): isolar recursos por tenant e membership"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- password;
- subject real de produção;
- e-mail como chave;
- tenant vindo do payload;
- query unscoped;
- cache sem tenant;
- audit com header bruto;
- export do Keycloak;
- dados pessoais da próxima aula.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação ganhou uma fronteira multi-tenant explícita.

O contexto passou a nascer de identidade autenticada, usuário local, membership ativo e seleção validada.

O header:

```text
X-Tenant-Id
```

permanece apenas como input.

Ele não concede acesso.

As Ordens de Serviço agora são qualificadas por:

```text
tenant_id;

owner_user_id.
```

A autorização combina:

```text
permission;

tenant;

ownership.
```

As queries usam:

```text
tenant_id
no banco.
```

A listagem, count, consulta, update, status e delete passaram a carregar a mesma fronteira.

O comportamento ficou:

```text
tenant correto:
avaliar permission e ownership.

recurso de outro tenant:
404.

tenant sem membership:
403.

múltiplos tenants sem seleção:
400.

admin global sem seleção:
400.
```

Cache e auditoria também passaram a carregar tenant.

A identidade Keycloak é ligada ao usuário local por:

```text
issuer + subject.
```

A decisão central foi:

```text
isolamento multi-tenant
não pode depender
de disciplina do frontend;

ele precisa existir
na resolução de contexto,
na autorização,
nas queries,
no cache,
na auditoria
e nos testes.
```

O sistema agora reduz o risco de exposição entre organizações.

Porém, isolamento não responde sozinho:

- quais dados pessoais devem ser coletados;
- por qual finalidade;
- por quanto tempo;
- como atender exclusão e correção;
- como mascarar evidências;
- como minimizar logs;
- como tratar incidentes de privacidade.

A próxima aula será:

```text
438 - M15.28 - LGPD para backend
```

Nela, você irá:

- identificar dados pessoais;
- diferenciar dado pessoal e sensível;
- aplicar minimização;
- registrar finalidade;
- definir retenção;
- tratar anonimização;
- modelar direitos do titular;
- proteger logs e auditoria;
- revisar exports e backups;
- criar um checklist técnico de privacidade.

---

# Material complementar

## Checkpoint final

- [ ] Resolvi tenant pela identidade e membership.
- [ ] Tratei o header somente como seletor.
- [ ] Apliquei tenant em todas as queries.
- [ ] Testei leitura e escrita cross-tenant.
- [ ] Atualizei cache e auditoria com contexto validado.

---

## Troubleshooting adicional

### Usuário com um tenant recebe tenant_context_required

Revise a query de memberships e o status ativo.

### Usuário troca o header e consegue acesso

O resolver pode estar usando o UUID sem verificar membership.

### Listagem não mostra OS de outro tenant, mas totalElements mostra

A count query não recebeu a specification de tenant.

### Supervisor acessa outro tenant

A regra de role está sendo avaliada antes da fronteira de tenant.

### Admin global lista tudo

Remova o caminho sem tenant e exija seleção explícita.

### O cache retorna objeto de outro tenant

Inclua tenant ID na chave e na invalidação.

### OIDC cria usuário novo pelo e-mail

Desative o linking automático e use `issuer + subject`.

### Job falha sem TenantContext

O comportamento é esperado até que o comando transporte um contexto validado.

---

## Perguntas de revisão

1. O que é tenant?
2. Tenant é igual a usuário?
3. O que concede acesso ao tenant?
4. O header concede membership?
5. Quando o header pode ser omitido?
6. O que ocorre com múltiplos memberships?
7. O que ocorre sem membership?
8. Como OIDC liga ao usuário local?
9. E-mail pode ser a chave?
10. Onde o tenant deve ser filtrado?
11. Filtrar em memória é seguro?
12. Como consultar uma OS individual?
13. Cross-tenant retorna qual status?
14. Seleção sem membership retorna qual status?
15. Admin global pode consultar sem tenant?
16. Supervisor atravessa tenant?
17. O que entra na chave de cache?
18. O que entra na auditoria?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Uma fronteira organizacional.
2. Não.
3. Membership ativo ou authority global controlada.
4. Não.
5. Com exatamente um membership ativo.
6. Seleção explícita é exigida.
7. Acesso negado.
8. Por issuer e subject.
9. Não.
10. Na query do banco.
11. Não.
12. Por ID e tenant ID.
13. 404.
14. 403.
15. Não.
16. Não.
17. Tenant ID e identificadores do recurso.
18. TenantContext validado.
19. LGPD para backend.
20. Privacidade, minimização e retenção.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 437 - M15.27 - Multi tenancy seguranca

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini tenant como fronteira organizacional.
- Diferenciei tenant e usuário.
- Modelei memberships ativos.
- Criei `V12__add_multi_tenant_security.sql`.
- Criei as tabelas `tenant`, `tenant_membership` e `external_identity`.
- Adicionei `tenant_id` à Ordem de Serviço.
- Fiz backfill dos dados existentes.
- Criei índices tenant-scoped.
- Criei `TenantContext`.
- Criei `TenantSelection`.
- Tratei `X-Tenant-Id` apenas como seletor.
- Rejeitei UUID de tenant malformado.
- Validei membership no backend.
- Resolvi automaticamente um único membership.
- Exigi seleção quando existem múltiplos memberships.
- Neguei usuários sem membership.
- Exigi tenant explícito para administrador global.
- Não criei modo administrativo sem filtro.
- Liguei OIDC ao usuário local por `issuer + subject`.
- Não usei e-mail como chave.
- Derivei tenant no create.
- Não aceitei tenant do payload.
- Apliquei tenant na listagem e count.
- Apliquei tenant no find, update, status e delete.
- Combinei permission, tenant e ownership.
- Mantive supervisor e auditor restritos ao tenant.
- Retornei `404` para recursos cross-tenant.
- Retornei `403` para seleção não autorizada.
- Retornei `400` para contexto ambíguo.
- Atualizei cache com tenant ID.
- Atualizei auditoria com tenant validado.
- Rejeitei jobs sem contexto explícito.
- Testei Tenant Alpha e Tenant Beta com PostgreSQL real.
- Testei listagem, paginação, leitura e writes cross-tenant.
- Testei administrador global e identity linking.
- Criei `TenantRepositoryPolicyTest`.
- Criei `docs/security/M15_MULTI_TENANCY_SECURITY.md`.
- Criei `docs/security/M15_TENANT_AUTHORIZATION_MATRIX.md`.
- Documentei RLS como defesa futura, sem ativação improvisada.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: LGPD para backend.
```

---

## Referência técnica curta

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Business Logic Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html)
- [OWASP Authorization Testing Automation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
- [Spring Security — Authorization Architecture](https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Data JPA — Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)
- [PostgreSQL 17 — Row Security Policies](https://www.postgresql.org/docs/17/ddl-rowsecurity.html)

Regra final:

```text
segurança multi-tenant exige que cada operação possua uma fronteira organizacional validada: tenant selection é input não confiável, membership persistido é a fonte de autorização, issuer e subject ligam a identidade externa ao usuário local, TenantContext é explícito e imutável, toda query, count, cache e auditoria inclui tenant_id, ownership é avaliado somente depois do isolamento, recursos cross-tenant permanecem ocultos por 404 e nenhum administrador ou job executa operações tenant-scoped sem contexto definido.
```
