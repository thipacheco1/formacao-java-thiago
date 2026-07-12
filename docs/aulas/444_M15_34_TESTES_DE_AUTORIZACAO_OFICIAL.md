# 444 - M15.34 - Testes de autorizacao

## Apresentação da aula

Na aula 443, o projeto consolidou uma estratégia de testes de segurança baseada em:

```text
threat;

requirement;

control;

test;

layer;

evidence;

owner.
```

A suíte foi separada em:

```text
unit;

web;

integration;

policy;

contract;

external;

supply chain.
```

Também ficaram obrigatórios:

- dados sintéticos;
- relógio controlado;
- cenários negativos;
- ausência de side effects;
- rastreabilidade;
- proibição de `@Disabled`;
- isolamento de PostgreSQL e Redis;
- smoke externo separado;
- evidências sem secrets ou PII.

Essa arquitetura preparou o terreno para a área mais combinatória do módulo:

```text
autorização.
```

Autenticação responde:

```text
quem é?
```

Autorização responde:

```text
essa identidade pode executar
esta ação
sobre este recurso
neste tenant
neste estado?
```

A API de Ordens de Serviço possui várias dimensões simultâneas:

```text
role;

permission;

tenant;

ownership;

estado;

método HTTP;

método de aplicação;

versão esperada;

existência do recurso.
```

Um teste isolado como:

```text
supervisor consegue atualizar.
```

é insuficiente.

Precisamos saber:

```text
supervisor de qual tenant?

qual resource?

qual owner?

qual status?

qual permission?

qual endpoint?

qual resultado HTTP?

qual resultado na chamada direta?

houve persistência?

houve audit?

houve cache invalidation?
```

A pergunta central desta aula será:

```text
como transformar as regras
de autorização da API
em uma matriz executável
que prove acesso permitido,
negação vertical,
negação horizontal,
isolamento entre tenants,
deny-by-default
e consistência entre HTTP
e Method Security?
```

A baseline da aplicação possui roles:

```text
ROLE_OPERATOR;

ROLE_AUDITOR;

ROLE_SUPERVISOR;

ROLE_ADMIN.
```

E permissions:

```text
service-order:read;

service-order:create;

service-order:update;

service-order:status:update;

service-order:delete;

tenant:access:all.
```

As roles não concedem permissões magicamente.

As authorities efetivas são explícitas.

Exemplo:

```text
ROLE_OPERATOR
não significa automaticamente
service-order:update.
```

A autorização continuará sendo aplicada em camadas.

Camada de request:

```text
rota;

método HTTP;

autenticação;

permission geral.
```

Camada de método:

```text
@PreAuthorize;

permission;

chamada direta protegida.
```

Camada de negócio:

```text
tenant;

ownership;

estado;

transição;

versão;

invariantes.
```

Camada de persistência:

```text
query com tenant;

query com owner quando necessário;

ausência de consulta global;

count filtrado.
```

A resposta pública seguirá o contrato já definido.

Exemplos:

```text
anônimo:
401.

autenticado sem permission:
403.

resource inexistente:
404.

resource oculto por tenant:
404.

resource oculto por ownership:
404.

tenant selecionado sem membership:
403.

transição inválida:
409.

If-Match ausente:
428.

ETag antiga:
412.
```

A aula criará uma matriz executável:

```text
security/authorization-test-matrix.yaml
```

Cada caso terá:

```text
actor;

authorities;

tenant selection;

action;

resource scope;

resource state;

expected HTTP;

expected code;

expected persistence;

expected audit.
```

Também serão criados:

```text
AuthorizationActor;

AuthorizationAction;

AuthorizationResourceScope;

AuthorizationExpectedResult;

AuthorizationScenario;

AuthorizationScenarioLoader;

AuthorizationMatrixHttpTest;

AuthorizationMatrixMethodSecurityTest;

AuthorizationMatrixPersistenceTest;

AuthorizationDenyByDefaultPolicyTest.
```

A matriz não duplicará regras em texto e código sem controle.

Ela servirá como:

- especificação executável;
- documentação;
- fonte de casos parametrizados;
- evidência;
- proteção contra regressão.

A próxima aula será:

```text
445 - M15.35 - Hardening de API
```

Nela, a API será revisada como superfície completa: métodos, headers, limites, parsing, timeouts, uploads futuros, defaults, exposure, management endpoints e configuração de produção.

---

## Onde estamos na formação

A sequência oficial é:

```text
442:
Vulnerabilidades em dependencias.

443:
Testes de seguranca.

444:
Testes de autorizacao.

445:
Hardening de API.

446:
Checklist seguranca de API.

447:
Projeto pratico seguranca API parte 1.
```

A aula 443 respondeu:

```text
como organizar
a suíte de segurança?
```

A aula 444 responderá:

```text
como provar
todas as decisões relevantes
de autorização?
```

Nesta aula:

```text
roles:
sim.

permissions:
sim.

Method Security:
sim.

ownership:
sim.

tenant:
sim.

estado:
sim.

HTTP:
sim.

chamada direta:
sim.

persistência:
sim.

auditoria:
sim.

403 e 404:
sim.

deny-by-default:
sim.

hardening geral:
próxima aula.
```

A regra central será:

```text
autorização precisa ser testada
como uma matriz de decisões,
não como poucos exemplos felizes.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
security/
└── authorization-test-matrix.yaml
```

Infraestrutura:

```text
src/test/java/br/com/formacao/backend/
└── security
    └── authorization
        ├── AuthorizationActor.java
        ├── AuthorizationAction.java
        ├── AuthorizationResourceScope.java
        ├── AuthorizationExpectedResult.java
        ├── AuthorizationScenario.java
        ├── AuthorizationScenarioLoader.java
        ├── AuthorizationTestAuthenticationFactory.java
        └── AuthorizationMatrixAssertions.java
```

Testes:

```text
AuthorizationMatrixHttpTest;

AuthorizationMatrixMethodSecurityTest;

AuthorizationMatrixPersistenceTest;

AuthorizationListScopeTest;

AuthorizationStatusTransitionTest;

AuthorizationDenyByDefaultPolicyTest;

AuthorizationMatrixPolicyTest.
```

Documentação:

```text
docs/security/
├── M15_AUTHORIZATION_TEST_MATRIX.md
├── M15_AUTHORIZATION_TEST_STRATEGY.md
└── M15_AUTHORIZATION_DECISION_CONTRACT.md
```

Você irá:

1. inventariar atores;
2. inventariar actions;
3. inventariar resource scopes;
4. inventariar estados;
5. definir resultados;
6. criar matriz YAML;
7. gerar testes parametrizados;
8. testar rota;
9. testar Method Security;
10. testar autorização de negócio;
11. testar tenant;
12. testar ownership;
13. testar supervisor;
14. testar auditor;
15. testar admin;
16. testar deny-by-default;
17. testar listagem e count;
18. testar side effects;
19. testar audit;
20. preparar hardening.

---

## Conceito essencial

### Autorização é uma decisão contextual

A mesma permission pode produzir resultados diferentes.

Exemplo:

```text
service-order:read.
```

Operador Alpha:

```text
OS própria no Alpha:
permitida.

OS de outro operador no Alpha:
404.

OS do Beta:
404.
```

Auditor Alpha:

```text
OS de qualquer owner no Alpha:
permitida.

OS do Beta:
404.
```

A permission é necessária.

Ela não é suficiente.

---

### Actor

Actor representa uma identidade de teste completa.

Ele inclui:

- user ID;
- role;
- authorities;
- memberships;
- acesso global;
- tenant selecionado;
- tipo de principal.

Exemplos:

```text
ANONYMOUS;

OPERATOR_ALPHA_OWNER;

OPERATOR_ALPHA_OTHER;

AUDITOR_ALPHA;

SUPERVISOR_ALPHA;

ADMIN_ROLE_ONLY;

GLOBAL_ADMIN;

OPERATOR_BETA.
```

`ADMIN_ROLE_ONLY` é importante.

Ele prova:

```text
ROLE_ADMIN
sem permission explícita
não concede acesso.
```

---

### Action

Ação representa a operação protegida.

Catálogo:

```text
LIST;

READ;

CREATE;

UPDATE;

TRANSITION_STATUS;

DELETE.
```

Cada action mapeia para:

- método HTTP;
- rota;
- application service method;
- permission;
- possíveis estados.

---

### Resource scope

O recurso pode estar:

```text
NONE:
ações de coleção ou create.

OWN_SAME_TENANT:
do próprio usuário.

OTHER_OWNER_SAME_TENANT:
outro owner, mesmo tenant.

OTHER_TENANT:
tenant diferente.

MISSING:
UUID inexistente.

LEGACY_WITHOUT_OWNER:
registro legado quando aplicável.
```

A matriz precisa distinguir esses casos.

---

### State

A autorização interage com o estado do domínio.

Estados:

```text
OPEN;

IN_PROGRESS;

COMPLETED;

CANCELED.
```

Regras da baseline:

```text
update:
somente OPEN.

delete:
somente OPEN.

OPEN -> IN_PROGRESS:
permitido.

OPEN -> CANCELED:
permitido.

IN_PROGRESS -> COMPLETED:
permitido.

IN_PROGRESS -> CANCELED:
permitido.

outras transições:
409.
```

Uma falha de estado não é necessariamente falha de autorização.

A ordem de decisão precisa ser testada.

---

### Ordem da decisão

A baseline segue:

```text
1. autenticação;

2. permission geral;

3. tenant context;

4. lookup tenant-scoped;

5. ownership ou role de negócio;

6. If-Match;

7. estado e transição;

8. mutação;

9. persistência;

10. auditoria.
```

Essa ordem explica os status.

Exemplo:

```text
sem delete permission
e resource em estado inválido:
403.

com delete permission,
resource oculto:
404.

com acesso ao resource,
mas status não OPEN:
409.
```

O teste precisa provar a precedência.

---

### Request authorization

A FilterChain protege rotas.

Ela deve impedir que uma rota esquecida fique apenas autenticada quando deveria exigir permission.

Testes HTTP cobrem:

- método;
- path;
- chain;
- status;
- headers;
- body;
- redirect;
- sessão.

---

### Method Security

`@PreAuthorize` protege o método mesmo quando ele é chamado fora do controller.

Isso cobre:

- outro controller;
- scheduler;
- listener;
- facade;
- teste direto;
- refactor futuro.

O teste deve chamar o bean gerenciado pelo Spring.

Isto é importante:

```java
new ServiceOrderApplicationService(...)
```

não passa pelo proxy de Method Security.

O teste precisa obter o bean do contexto.

---

### Self-invocation

Quando um método de uma classe chama outro método da mesma instância, a chamada interna pode não atravessar o proxy.

A baseline não depende de annotation em método interno para proteger uma operação pública.

O entry point protegido precisa estar no bean interceptado.

Policy tests podem procurar métodos públicos sensíveis sem annotation.

---

### WithMockUser

`@WithMockUser` é útil para principals simples.

Cuidado:

```java
roles = "OPERATOR"
```

gera:

```text
ROLE_OPERATOR.
```

Para permissions use:

```java
authorities = {
    "service-order:read"
}
```

Não escreva:

```java
roles = {
    "service-order:read"
}
```

porque o prefixo `ROLE_` seria aplicado.

---

### Custom SecurityContext

A aplicação possui user ID, principal próprio e tenancy.

Crie:

```java
@WithAuthorizationActor(
    actor = AuthorizationActor.OPERATOR_ALPHA_OWNER
)
```

A annotation usa `@WithSecurityContext`.

A factory cria:

- principal;
- authorities;
- authentication;
- SecurityContext;
- user ID sintético.

TenantContext continua resolvido pela aplicação ou passado explicitamente no teste de método.

---

### HTTP e método precisam concordar

Cenário:

```text
operator sem delete permission.
```

HTTP:

```text
DELETE -> 403.
```

Chamada direta:

```text
AccessDeniedException.
```

Se HTTP negar, mas chamada direta permitir, existe bypass interno.

Se método negar, mas HTTP permitir resposta errada, existe contrato inconsistente.

Ambos precisam ser testados.

---

### 403 e 404

`403` representa permission geral ausente ou tenant selection não autorizada.

`404` oculta recurso individual quando:

- não existe;
- pertence a outro tenant;
- pertence a outro owner e o actor não possui amplitude.

A aplicação não faz uma segunda query global para diferenciar.

A response precisa ser idêntica.

---

### Collection authorization

Listagem não usa `404` por item.

Ela aplica filtro no SQL.

Operador:

```text
somente próprias OS.
```

Auditor e supervisor:

```text
todas do tenant selecionado.
```

Global admin:

```text
todas do tenant selecionado,
nunca todos os tenants juntos.
```

`totalElements` e `totalPages` também precisam respeitar o escopo.

---

### Permission e role

A matriz separa:

```text
role;

permissions.
```

Cenários obrigatórios:

```text
role correta sem permission;

permission correta sem role especial;

role desconhecida;

authority desconhecida;

permission extra não relacionada.
```

A decisão utiliza a permission necessária e a regra de negócio.

---

### Deny-by-default

Rotas ou métodos novos não podem ficar liberados por ausência de regra.

Policy:

```text
request:
anyRequest().denyAll()
ou regra explícita.

method:
método sensível com @PreAuthorize
ou guard aprovado.
```

Teste um endpoint sintético não mapeado ou uma rota não permitida.

Esperado:

```text
negação,
não acesso implícito.
```

---

### Decision table

Uma matriz reduz ambiguidade.

Exemplo:

| Actor | Action | Scope | State | Resultado |
|---|---|---|---|---|
| Anônimo | READ | OWN | OPEN | 401 |
| Operator Alpha | READ | OWN | OPEN | 200 |
| Operator Alpha | READ | OTHER OWNER | OPEN | 404 |
| Auditor Alpha | READ | OTHER OWNER | OPEN | 200 |
| Supervisor Alpha | DELETE | OTHER OWNER | OPEN | 204 |
| Supervisor Alpha | DELETE | OTHER OWNER | COMPLETED | 409 |
| Operator Alpha | READ | OTHER TENANT | OPEN | 404 |
| Global Admin sem tenant | LIST | NONE | - | 400 |
| Admin role only | DELETE | OWN | OPEN | 403 |

A matriz completa será YAML para execução.

---

## Mão na massa guiada

### 1. Criar os enums de teste

```java
public enum AuthorizationActor {
    ANONYMOUS,
    OPERATOR_ALPHA_OWNER,
    OPERATOR_ALPHA_OTHER,
    AUDITOR_ALPHA,
    SUPERVISOR_ALPHA,
    ADMIN_ROLE_ONLY,
    GLOBAL_ADMIN,
    OPERATOR_BETA
}
```

```java
public enum AuthorizationAction {
    LIST,
    READ,
    CREATE,
    UPDATE,
    TRANSITION_STATUS,
    DELETE
}
```

```java
public enum AuthorizationResourceScope {
    NONE,
    OWN_SAME_TENANT,
    OTHER_OWNER_SAME_TENANT,
    OTHER_TENANT,
    MISSING,
    LEGACY_WITHOUT_OWNER
}
```

---

### 2. Criar resultado esperado

```java
public record AuthorizationExpectedResult(
        int httpStatus,
        String problemCode,
        boolean applicationServiceInvoked,
        boolean persistenceChanged,
        boolean successAuditExpected,
        boolean denialAuditExpected
) {
}
```

Para sucesso, `problemCode` pode ser nulo.

As flags tornam side effects explícitos.

---

### 3. Criar AuthorizationScenario

```java
public record AuthorizationScenario(
        String id,
        AuthorizationActor actor,
        AuthorizationAction action,
        AuthorizationResourceScope resourceScope,
        ServiceOrderStatus resourceState,
        UUID selectedTenantId,
        Set<String> authorities,
        AuthorizationExpectedResult expected
) {
}
```

O ID será estável:

```text
AUTHZ-HTTP-001.
```

---

### 4. Criar a matriz YAML

Arquivo:

```text
security/authorization-test-matrix.yaml
```

Exemplo:

```yaml
version: 1

scenarios:
  - id: AUTHZ-HTTP-001
    actor: ANONYMOUS
    action: READ
    resourceScope: OWN_SAME_TENANT
    resourceState: OPEN
    selectedTenant: ALPHA
    expected:
      httpStatus: 401
      problemCode: authentication_required
      applicationServiceInvoked: false
      persistenceChanged: false
      successAuditExpected: false
      denialAuditExpected: false

  - id: AUTHZ-HTTP-002
    actor: OPERATOR_ALPHA_OWNER
    action: READ
    resourceScope: OWN_SAME_TENANT
    resourceState: OPEN
    selectedTenant: ALPHA
    expected:
      httpStatus: 200
      persistenceChanged: false
```

Não use nomes de pessoas reais.

---

### 5. Definir authorities por actor

```java
Map<AuthorizationActor, Set<String>>
authorities = Map.of(
    AuthorizationActor.OPERATOR_ALPHA_OWNER,
    Set.of(
        "ROLE_OPERATOR",
        "service-order:read",
        "service-order:create",
        "service-order:update",
        "service-order:status:update"
    ),

    AuthorizationActor.AUDITOR_ALPHA,
    Set.of(
        "ROLE_AUDITOR",
        "service-order:read"
    ),

    AuthorizationActor.SUPERVISOR_ALPHA,
    Set.of(
        "ROLE_SUPERVISOR",
        "service-order:read",
        "service-order:create",
        "service-order:update",
        "service-order:status:update",
        "service-order:delete"
    ),

    AuthorizationActor.ADMIN_ROLE_ONLY,
    Set.of(
        "ROLE_ADMIN"
    )
);
```

Global admin adiciona:

```text
tenant:access:all
```

mais as permissions específicas da ação.

---

### 6. Criar AuthorizationTestAuthenticationFactory

```java
public Authentication create(
        AuthorizationActor actor
) {
    if (
        actor == AuthorizationActor.ANONYMOUS
    ) {
        return null;
    }

    UUID userId =
            userIdFor(actor);

    Collection<GrantedAuthority>
            grantedAuthorities =
                authoritiesFor(actor)
                    .stream()
                    .map(
                        SimpleGrantedAuthority::new
                    )
                    .toList();

    DatabaseUserPrincipal principal =
            new DatabaseUserPrincipal(
                    userId,
                    usernameFor(actor),
                    grantedAuthorities
            );

    return UsernamePasswordAuthenticationToken
            .authenticated(
                principal,
                null,
                grantedAuthorities
            );
}
```

O principal usa somente dados sintéticos.

---

### 7. Criar annotation customizada

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({
    ElementType.METHOD,
    ElementType.TYPE
})
@WithSecurityContext(
    factory =
        WithAuthorizationActorSecurityContextFactory.class
)
public @interface WithAuthorizationActor {

    AuthorizationActor actor();
}
```

A factory coloca o `Authentication` no `SecurityContext`.

---

### 8. Criar AuthorizationScenarioLoader

Use Jackson YAML já disponível no teste ou adicione dependency test-scoped adequada.

Valide:

- version;
- ID único;
- enum conhecido;
- state obrigatório para resource existente;
- selected tenant válido;
- status entre `100` e `599`;
- problem code para erro;
- side effects coerentes.

Uma matriz inválida falha antes dos casos.

---

### 9. Criar AuthorizationMatrixPolicyTest

Valide cobertura mínima:

- toda action possui anônimo;
- toda action possui actor sem permission;
- READ possui own, other owner, other tenant e missing;
- UPDATE possui own, other owner, other tenant e state inválido;
- DELETE possui OPEN e estado não editável;
- LIST possui operator, auditor, supervisor e global;
- CREATE possui tenant válido e inválido;
- chamada direta possui casos permitidos e negados.

O teste não exige combinação cartesiana infinita.

Ele exige cobertura de partições relevantes.

---

### 10. Criar fixture de recursos

No PostgreSQL de teste:

```text
Tenant Alpha;

Tenant Beta;

Operator Alpha A;

Operator Alpha B;

Auditor Alpha;

Supervisor Alpha;

Operator Beta;

Global Admin;

OS Alpha A OPEN;

OS Alpha B OPEN;

OS Alpha B COMPLETED;

OS Beta OPEN;

UUID inexistente.
```

Cada cenário inicia com estado previsível.

---

### 11. Criar AuthorizationMatrixHttpTest

```java
@ParameterizedTest(
    name = "{0}"
)
@MethodSource("httpScenarios")
@Tag("security")
@Tag("security-integration")
void shouldEnforceHttpAuthorization(
        AuthorizationScenario scenario
) throws Exception {
    setupScenario(
            scenario
    );

    ResultActions response =
            perform(
                scenario
            );

    AuthorizationMatrixAssertions
            .assertHttp(
                response,
                scenario.expected()
            );

    assertSideEffects(
            scenario
    );
}
```

O nome do caso usa o ID.

---

### 12. Implementar perform

Mapeie action para request:

```java
return switch (
    scenario.action()
) {
    case LIST ->
        mockMvc.perform(
            get(
                "/api/v2/service-orders"
            )
            .with(
                authenticationFor(
                    scenario
                )
            )
            .header(
                "X-Tenant-Id",
                tenantHeaderFor(
                    scenario
                )
            )
        );

    case READ ->
        mockMvc.perform(
            get(
                "/api/v2/service-orders/{id}",
                resourceIdFor(
                    scenario
                )
            )
            .with(
                authenticationFor(
                    scenario
                )
            )
            .header(
                "X-Tenant-Id",
                tenantHeaderFor(
                    scenario
                )
            )
        );

    default ->
        performMutation(
            scenario
        );
};
```

Para anônimo, não aplique authentication.

---

### 13. Testar permission ausente

Cenário:

```text
ROLE_OPERATOR;

sem service-order:delete;

resource own;

OPEN.
```

Expected:

```text
403 access_denied;

service não muta;

repository permanece igual;

success audit ausente.
```

Esse teste prova que role não substitui permission.

---

### 14. Testar permission sem role especial

Actor sintético:

```text
service-order:read;

sem ROLE_AUDITOR.
```

Para resource próprio:

```text
permitido.
```

Para resource de outro owner:

```text
404.
```

A permission autoriza a ação geral.

A role ou business policy define amplitude.

---

### 15. Testar auditor

Auditor Alpha:

```text
LIST Alpha:
todas do Alpha.

READ Alpha de outro owner:
200.

CREATE:
403.

UPDATE:
403.

STATUS:
403.

DELETE:
403.

READ Beta:
404.
```

Valide content e count.

---

### 16. Testar supervisor

Supervisor Alpha:

```text
READ qualquer owner do Alpha:
200.

UPDATE OPEN no Alpha:
200.

DELETE OPEN no Alpha:
204.

UPDATE COMPLETED:
409.

DELETE COMPLETED:
409.

qualquer resource Beta:
404.
```

A permission não contorna tenant nem estado.

---

### 17. Testar Admin role only

Actor:

```text
ROLE_ADMIN.
```

Sem permissions de OS:

```text
LIST:
403.

READ:
403.

CREATE:
403.

UPDATE:
403.

DELETE:
403.
```

Isso impede uma role de se tornar superpoder implícito.

---

### 18. Testar Global Admin

Global Admin possui:

```text
tenant:access:all;

permissions da operação.
```

Sem seleção:

```text
400 tenant_context_required.
```

Selecionando Alpha:

```text
opera somente em Alpha.
```

Selecionando Beta:

```text
opera somente em Beta.
```

A listagem nunca mistura tenants.

---

### 19. Testar seleção sem membership

Operator Alpha envia:

```text
X-Tenant-Id:
Tenant Beta.
```

Expected:

```text
403 tenant_access_denied.
```

O repository de OS não deve executar.

A falha ocorre na resolução de contexto.

---

### 20. Testar recurso de outro tenant

Operator Alpha com tenant Alpha consulta UUID da OS Beta.

Expected:

```text
404 service_order_not_found.
```

Valide que a query usa:

```text
id + tenant_id.
```

Não execute segunda query global.

---

### 21. Testar ownership

Operator Alpha A lê OS Alpha B.

Expected:

```text
404.
```

Auditor Alpha lê a mesma OS:

```text
200.
```

Supervisor Alpha atualiza a mesma OS OPEN:

```text
200.
```

Esses três casos isolam a regra de amplitude.

---

### 22. Testar recurso inexistente e oculto

Execute dois requests:

```text
UUID inexistente;

UUID existente,
mas de outro owner.
```

Compare:

- status;
- content type;
- body;
- code;
- headers;
- tamanho aproximado;
- ausência de IDs.

O contrato público deve ser equivalente.

Não exija tempo idêntico em teste funcional.

---

### 23. Testar listagem e paginação

Para Operator Alpha A:

```text
content:
somente próprias.

totalElements:
somente próprias.

totalPages:
somente próprias.
```

Para Auditor Alpha:

```text
todas do Alpha.

nenhuma do Beta.
```

Para Global Admin com Beta:

```text
somente Beta.
```

A count query também precisa usar o predicate.

---

### 24. Testar create

Operator Alpha com:

```text
service-order:create.
```

Cria no tenant Alpha.

Valide:

- tenant Alpha;
- owner Alpha;
- status OPEN;
- sem possibilidade de alterar owner;
- audit success;
- ETag.

Auditor sem create:

```text
403.
```

---

### 25. Testar update

Cenários:

```text
operator owner + OPEN:
permitido.

operator owner + COMPLETED:
409.

operator non-owner:
404.

supervisor same tenant + OPEN:
permitido.

supervisor other tenant:
404.

sem update permission:
403.

If-Match ausente:
428.

If-Match stale:
412.
```

A matriz registra a precedência.

---

### 26. Testar transições

Casos permitidos:

```text
OPEN -> IN_PROGRESS;

OPEN -> CANCELED;

IN_PROGRESS -> COMPLETED;

IN_PROGRESS -> CANCELED.
```

Casos negados pelo domínio:

```text
OPEN -> COMPLETED;

COMPLETED -> OPEN;

CANCELED -> IN_PROGRESS;

mesmo status,
conforme regra existente.
```

Com permission e resource access válidos:

```text
409 service_order_invalid_transition.
```

---

### 27. Testar delete

Delete exige:

```text
service-order:delete;

tenant;

business amplitude;

status OPEN;

If-Match.
```

Operator com delete permission, mas sem role de amplitude e resource de outro owner:

```text
404.
```

Supervisor same tenant:

```text
204 em OPEN.
```

Completed:

```text
409.
```

---

### 28. Criar AuthorizationMatrixMethodSecurityTest

Obtenha o bean Spring:

```java
@Autowired
ServiceOrderApplicationService service;
```

Cenário sem permission:

```java
assertThatThrownBy(
    () ->
        service.delete(
            authentication,
            tenantContext,
            serviceOrderId,
            expectedVersion
        )
)
.isInstanceOf(
    AccessDeniedException.class
);
```

Não construa o service com `new`.

---

### 29. Testar chamada direta permitida

Supervisor com delete permission e tenant correto:

```text
método executa;

resource é removido;

audit é persistido.
```

O teste prova que o proxy não bloqueia um caso válido.

---

### 30. Testar chamada direta cross-tenant

Method Security valida permission.

O service recebe TenantContext Alpha e UUID Beta.

Expected:

```text
ServiceOrderNotFoundException;

nenhuma mutação.
```

A autorização de negócio continua ativa fora do HTTP.

---

### 31. Testar self-invocation policy

Crie policy test que identifica métodos públicos sensíveis do application service.

Eles precisam possuir:

- `@PreAuthorize`;
- ou annotation meta aprovada;
- ou declaração explícita no catálogo.

Métodos privados auxiliares não entram.

Documente que self-invocation não é fronteira de proteção.

---

### 32. Criar AuthorizationDenyByDefaultPolicyTest

Inspecione a `SecurityFilterChain`.

Valide presença de:

```text
anyRequest().denyAll()
```

ou fallback equivalente.

Inspecione os métodos públicos de negócio:

```text
create;

findById;

search;

update;

transitionStatus;

delete.
```

Todos precisam de permission ou guard catalogado.

---

### 33. Testar authority desconhecida

Actor possui:

```text
service-order:superpower;

ROLE_SUPER_ADMIN_UNKNOWN.
```

Sem permission necessária.

Expected:

```text
403.
```

Unknown authority nunca concede por prefixo parcial ou substring.

---

### 34. Testar authority semelhante

Use:

```text
service-order:read-all;

service-order:read:other;

SERVICE-ORDER:READ;

service-order:rea.
```

Nenhuma equivale a:

```text
service-order:read.
```

A comparação é exata.

---

### 35. Testar JWT converter

Crie token com claims de authorities.

Valide:

- authorities conhecidas convertidas;
- duplicadas removidas;
- espaços rejeitados ou normalizados conforme policy;
- valores desconhecidos não ganham significado;
- `ROLE_` preserva convenção;
- permission permanece lowercase;
- token sem claim produz conjunto mínimo.

Esse teste cobre a entrada das authorities.

---

### 36. Testar auditoria de negação

Permission denial:

```text
AUTHORIZATION_DENIED;

outcome DENIED;

reason MISSING_PERMISSION.
```

Ownership ou tenant concealment:

```text
reason RESOURCE_NOT_VISIBLE
ou reason catalogada.
```

A auditoria não revela:

- owner;
- tenant solicitado raw;
- UUID de outro tenant;
- token.

Siga a policy da aula 430.

---

### 37. Testar transaction rollback

Force falha após mutação e antes do commit.

Valide:

- aggregate não persistido;
- audit required segue a estratégia transacional definida;
- cache não invalida prematuramente;
- evento não publica.

Autorização permitida não significa side effects parciais aceitáveis.

---

### 38. Atualizar a matriz da aula 443

Em:

```text
security/security-test-matrix.yaml
```

Adicione requirements:

```text
SEC-AUTHZ-001:
permission em toda ação.

SEC-AUTHZ-002:
ownership.

SEC-AUTHZ-003:
tenant.

SEC-AUTHZ-004:
403 versus 404.

SEC-AUTHZ-005:
Method Security.

SEC-AUTHZ-006:
deny-by-default.

SEC-AUTHZ-007:
state precedence.

SEC-AUTHZ-008:
collection scope.
```

Cada requirement aponta para a nova suíte.

---

### 39. Criar documento da matriz

Arquivo:

```text
docs/security/M15_AUTHORIZATION_TEST_MATRIX.md
```

Inclua:

- atores;
- authorities;
- actions;
- resource scopes;
- estados;
- resultados;
- regras de precedência;
- gaps;
- owner;
- data de revisão.

A YAML continua sendo a fonte executável.

---

### 40. Criar contrato de decisão

Arquivo:

```text
docs/security/M15_AUTHORIZATION_DECISION_CONTRACT.md
```

Registre:

```markdown
# Contrato de autorizacao

## 401

Autenticacao ausente ou invalida.

## 403

Permission ausente
ou tenant selection nao autorizada.

## 404

Recurso individual inexistente
ou oculto por tenant/ownership.

## 409

Regra de estado ou transicao invalida.

## 412

Versao divergente.

## 428

If-Match ausente.

## Ordem

Authentication;
permission;
tenant;
resource;
ownership;
precondition;
state;
mutation.
```

---

### 41. Atualizar threat model

Adicione:

```text
THR-253:
role concede permission
implicitamente.

THR-254:
HTTP protege,
mas chamada direta permite.

THR-255:
Method Security protege,
mas rota errada fica aberta.

THR-256:
supervisor atravessa tenant.

THR-257:
auditor modifica recurso.

THR-258:
admin role only
vira superuser.

THR-259:
404 oculto difere
do inexistente.

THR-260:
count vaza recursos
de outro owner ou tenant.

THR-261:
state error é avaliado
antes da permission.

THR-262:
authority semelhante
é aceita por substring.

THR-263:
método novo não possui
policy de autorização.

THR-264:
teste direto usa objeto
fora do proxy Spring.
```

Controles:

- permissions explícitas;
- HTTP + method tests;
- route matrix;
- tenant predicates;
- read-only auditor;
- admin sem privilégio mágico;
- contrato uniforme;
- count scoped;
- precedência;
- match exato;
- policy test;
- bean proxied.

---

### 42. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
vertical escalation:
roles e permissions.

horizontal escalation:
ownership.

cross-tenant:
tenant context.

IDOR:
ID + tenant + guard.

deny-by-default:
request e method.

every request:
matriz HTTP.
```

A04 Insecure Design:

```text
decision order;

state machine;

explicit matrix;

negative cases.
```

A09 Security Logging:

```text
denials:
auditadas sem resource leak.
```

Baseline:

```text
authorization matrix:
executável.

HTTP:
testado.

Method Security:
testado.

tenant:
testado.

ownership:
testado.

state:
testado.

403/404:
uniforme.

new actions:
deny-by-default.

produção pública:
NO-GO.
```

---

### 43. Executar o gate

Matriz HTTP:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixHttpTest `
  test
```

Method Security:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixMethodSecurityTest `
  test
```

Persistência e scope:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixPersistenceTest,AuthorizationListScopeTest `
  test
```

Policies:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixPolicyTest,AuthorizationDenyByDefaultPolicyTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- atores;
- permissions;
- roles;
- anonymous;
- own;
- other owner;
- other tenant;
- missing;
- OPEN;
- IN_PROGRESS;
- COMPLETED;
- CANCELED;
- 401;
- 403;
- 404;
- 409;
- 412;
- 428;
- HTTP;
- direct call;
- persistence;
- audit;
- count;
- deny-by-default;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### Autorização virou matriz executável

As combinações relevantes deixaram de depender de memória.

### Roles e permissions foram separadas

Role sem permission não concede acesso.

### HTTP e Method Security foram comparados

Bypasses internos e externos passaram a ser detectáveis.

### Tenant e ownership foram testados em conjunto

A amplitude de supervisor e auditor continua restrita ao tenant.

### Estado entrou na decisão

Permission válida não contorna transições ou status.

### 403 e 404 ganharam precedência explícita

Permission geral falha antes; recurso oculto permanece indistinguível do inexistente.

### Collection scope foi comprovado

Content, count e paginação não vazam dados.

### Deny-by-default ganhou policy test

Nova rota ou método sensível precisa declarar regra.

---

## Erros comuns importantes

### Testar somente uma role por endpoint

Faltam escaladas verticais e negativas.

### Usar roles no lugar de authorities

`ROLE_` e permissions possuem semânticas diferentes.

### Construir o service com new

Method Security não é interceptada.

### Testar apenas controller

Listener ou facade pode chamar o service diretamente.

### Verificar somente status HTTP

Persistência ou audit podem ter sido alterados.

### Fazer query global para decidir 404

A existência do recurso pode vazar.

### Não testar count

A paginação revela quantidade de dados ocultos.

### Dar poder automático a ROLE_ADMIN

Role não substitui permission explícita.

### Aceitar authority por startsWith

Valores semelhantes podem ganhar privilégio.

### Gerar produto cartesiano infinito

Use partições relevantes e policy de cobertura.

---

## Comandos úteis

### Matriz HTTP

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixHttpTest `
  test
```

### Method Security

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixMethodSecurityTest `
  test
```

### Policies

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixPolicyTest,AuthorizationDenyByDefaultPolicyTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar método sem PreAuthorize

```powershell
git grep `
  -n `
  -E `
  "public .*\\b(create|findById|search|update|transitionStatus|delete)\\("
```

---

## Exercício guiado

### Parte 1 — Atores

Defina identities, roles, permissions e memberships.

### Parte 2 — Actions

Mapeie HTTP, method e permission.

### Parte 3 — Resources

Crie own, other owner, other tenant e missing.

### Parte 4 — States

Inclua OPEN, IN_PROGRESS, COMPLETED e CANCELED.

### Parte 5 — Matriz

Registre resultado e side effects.

### Parte 6 — HTTP

Execute casos parametrizados com MockMvc.

### Parte 7 — Método

Chame o bean proxied diretamente.

### Parte 8 — Persistência

Comprove query, count e ausência de mutação.

### Parte 9 — Policies

Prove deny-by-default e coverage.

### Parte 10 — Evidência

Atualize matriz, threat model e documentos.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 443 foi preservada;
- roles, permissions, tenant, ownership e estado foram separados;
- atores foram catalogados;
- actions foram catalogadas;
- resource scopes foram catalogados;
- estados foram catalogados;
- matriz YAML foi criada;
- IDs de cenários são estáveis;
- resultados incluem HTTP, code e side effects;
- authorities por actor são explícitas;
- `ROLE_ADMIN` sem permission foi testada;
- permission sem role especial foi testada;
- auditor read-only foi testado;
- supervisor same-tenant foi testado;
- global admin exige tenant;
- tenant selection sem membership retorna `403`;
- recurso cross-tenant retorna `404`;
- ownership same-tenant foi testado;
- missing e hidden possuem contrato equivalente;
- listagem e count são scoped;
- create deriva tenant e owner;
- update respeita permission, ownership, state e ETag;
- transições válidas e inválidas foram testadas;
- delete respeita permission, amplitude, state e ETag;
- testes HTTP foram parametrizados;
- Method Security foi testada no bean Spring;
- chamadas permitidas e negadas foram cobertas;
- self-invocation foi documentada;
- methods sensíveis possuem policy;
- deny-by-default foi testado;
- authorities desconhecidas e semelhantes foram negadas;
- JWT converter foi testado;
- auditoria de denial não vaza resource;
- rollback e side effects foram verificados;
- matriz geral da aula 443 foi atualizada;
- documentos de matriz e contrato foram criados;
- threat model e OWASP foram atualizados;
- hardening geral não foi antecipado;
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
  "@Disabled|startsWith\\(.*service-order|ROLE_ADMIN.*permit"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/security `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/src/test `
  docs/security `
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
git commit -m "test(m15): validar matriz completa de autorizacao"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- usuário real;
- tenant real;
- response com dados pessoais;
- logs com IDs ocultos;
- fixtures de produção;
- regra permissiva temporária;
- teste desabilitado;
- matrix sem owner.

---

## Fechamento e ponte para a próxima aula

Nesta aula, autorização deixou de ser um conjunto de exemplos isolados.

A matriz passou a combinar:

```text
actor;

role;

permission;

tenant;

ownership;

action;

resource;

state;

expected result;

side effects.
```

A aplicação foi testada por duas fronteiras:

```text
HTTP;

Method Security.
```

A decisão passou a respeitar esta ordem:

```text
authentication;

permission;

tenant;

resource;

ownership;

precondition;

state;

mutation.
```

Os contratos ficaram:

```text
401:
autenticação ausente ou inválida.

403:
permission ausente
ou seleção de tenant negada.

404:
resource inexistente
ou oculto.

409:
estado ou transição inválida.

412:
ETag divergente.

428:
If-Match ausente.
```

A listagem também foi tratada como autorização.

Content, count e paginação ficaram scoped.

A decisão central foi:

```text
autorização confiável
exige testar
quem,
o quê,
sobre qual recurso,
em qual tenant,
em qual estado
e por qual caminho de execução.
```

A API possui agora uma suíte forte de decisões.

O próximo passo é revisar a superfície técnica completa antes de aproximar o sistema de produção.

A próxima aula será:

```text
445 - M15.35 - Hardening de API
```

Nela, você irá:

- revisar métodos e media types;
- limitar headers e payloads;
- configurar timeouts;
- revisar parsing;
- restringir management endpoints;
- endurecer cookies;
- revisar redirects;
- proteger proxies;
- remover informações de servidor;
- validar configuração produtiva;
- criar smoke tests de hardening.

---

# Material complementar

## Checkpoint final

- [ ] Criei a matriz ator–ação–recurso.
- [ ] Testei permission, tenant, ownership e estado.
- [ ] Comparei HTTP e Method Security.
- [ ] Validei `403`, `404` e side effects.
- [ ] Provei deny-by-default e scope de listagem.

---

## Troubleshooting adicional

### HTTP nega, mas chamada direta permite

O service pode não estar proxied ou o método não possui `@PreAuthorize`.

### Chamada direta sempre permite no teste

Você pode ter criado o objeto com `new`.

Obtenha o bean do contexto Spring.

### Operator vê totalElements maior

A count query não usa o mesmo predicate de ownership e tenant.

### Resource Beta retorna 403 em vez de 404

A aplicação pode estar consultando globalmente e autorizando depois.

Use lookup tenant-scoped.

### Auditor consegue criar

Ele recebeu `service-order:create` indevidamente ou a rota usa apenas role.

### ROLE_ADMIN acessa tudo

Existe regra implícita por role.

Remova o bypass e exija permissions.

### Transition inválida retorna 403

Verifique se o actor possui permission e acesso ao resource antes de testar estado.

### Matriz ficou enorme

Use equivalence partitions e teste de cobertura mínima, não produto cartesiano cego.

---

## Perguntas de revisão

1. O que a autorização decide?
2. Permission é suficiente?
3. O que é actor?
4. O que é resource scope?
5. Quais actions foram usadas?
6. Por que testar estado?
7. Qual é a ordem da decisão?
8. Quando usar `403`?
9. Quando usar `404`?
10. Global admin pode operar sem tenant?
11. ROLE_ADMIN concede tudo?
12. Auditor pode alterar OS?
13. Supervisor atravessa tenant?
14. `@WithMockUser(roles=...)` cria o quê?
15. Como testar Method Security?
16. Por que não usar `new`?
17. O que precisa ser validado na listagem?
18. O que deny-by-default protege?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Actor, ação, recurso e contexto.
2. Não.
3. Identidade e authorities de teste.
4. Relação do recurso com actor e tenant.
5. List, read, create, update, transition e delete.
6. Porque regras de domínio também limitam a ação.
7. Auth, permission, tenant, resource, ownership, precondition e state.
8. Permission ausente ou tenant selection negada.
9. Resource inexistente ou oculto.
10. Não.
11. Não.
12. Não.
13. Não.
14. Authorities com prefixo `ROLE_`.
15. Chamando o bean Spring.
16. Porque ignora o proxy.
17. Content, count e paginação.
18. Rotas e métodos sem regra explícita.
19. Hardening de API.
20. Superfície e configuração produtiva.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 444 - M15.34 - Testes de autorizacao

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Modelei autorização como decisão contextual.
- Separei role, permission, tenant, ownership e estado.
- Criei `authorization-test-matrix.yaml`.
- Criei actors sintéticos.
- Criei actions de list, read, create, update, transition e delete.
- Criei resource scopes own, other owner, other tenant e missing.
- Incluí estados OPEN, IN_PROGRESS, COMPLETED e CANCELED.
- Criei resultados com HTTP, code e side effects.
- Criei `AuthorizationScenario`.
- Criei `AuthorizationScenarioLoader`.
- Criei `AuthorizationTestAuthenticationFactory`.
- Criei annotation com `WithSecurityContext`.
- Testei anonymous.
- Testei operator owner.
- Testei operator non-owner.
- Testei auditor read-only.
- Testei supervisor no mesmo tenant.
- Testei `ROLE_ADMIN` sem permissions.
- Testei global admin com tenant obrigatório.
- Testei seleção de tenant sem membership.
- Testei recurso cross-tenant com `404`.
- Comparei resource missing e hidden.
- Testei listagem, count e paginação scoped.
- Testei create derivando tenant e owner.
- Testei update com permission, ownership, state e ETag.
- Testei transições válidas e inválidas.
- Testei delete e status OPEN.
- Criei `AuthorizationMatrixHttpTest`.
- Criei `AuthorizationMatrixMethodSecurityTest`.
- Chamei o bean proxied do Spring.
- Não usei `new` para testar Method Security.
- Testei chamada direta cross-tenant.
- Documentei self-invocation.
- Criei deny-by-default policy test.
- Testei authorities desconhecidas e semelhantes.
- Testei o JWT authority converter.
- Testei auditoria de denials sem vazamento.
- Testei rollback e ausência de side effects.
- Atualizei a matriz geral da aula 443.
- Criei `M15_AUTHORIZATION_TEST_MATRIX.md`.
- Criei `M15_AUTHORIZATION_TEST_STRATEGY.md`.
- Criei `M15_AUTHORIZATION_DECISION_CONTRACT.md`.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Hardening de API.
```

---

## Referência técnica curta

- [Spring Security — Testing Method Security](https://docs.spring.io/spring-security/reference/servlet/test/method.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Security — Authorize HttpServletRequests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring Security — MockMvc Authentication](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/authentication.html)
- [Spring Security — WithMockUser](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/test/context/support/WithMockUser.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Authorization Testing Automation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

Regra final:

```text
testes de autorização devem executar uma matriz de actor, permission, role, tenant, ownership, action, resource e state: a FilterChain e o Method Security precisam concordar, permissões gerais falham com 403, recursos individuais ocultos por tenant ou ownership permanecem indistinguíveis do inexistente por 404, regras de estado continuam produzindo conflitos após a autorização, listagens filtram content e count no banco, roles não concedem poderes implícitos e novos endpoints ou métodos permanecem negados até receberem uma policy explícita.
```
