# 426 - M15.16 - Roles authorities e permissoes

## Apresentação da aula

Na aula 425, a autenticação ganhou renovação controlada.

O fluxo passou a utilizar:

```text
access token JWT curto;

refresh token opaco;

hash persistido;

família de tokens;

rotação obrigatória;

detecção de reutilização;

revogação da família;

expiração ociosa e absoluta.
```

A aplicação já consegue:

- autenticar username e password;
- emitir access token;
- validar bearer token;
- carregar authorities do PostgreSQL;
- transportar authorities no JWT;
- renovar tokens;
- impedir reutilização silenciosa de refresh token.

Até agora, porém, as authorities foram tratadas principalmente como strings transportadas entre:

```text
security_user_authority;

DatabaseUserPrincipal;

JwtTokenService;

claim authorities;

JwtAuthoritiesConverter;

Authentication.
```

Exemplos já existentes:

```text
ROLE_OPERATOR;

service-order:read;

service-order:write;

ROLE_ADMIN.
```

A pergunta central desta aula será:

```text
qual é a diferença entre role,
authority e permission
e como transformar essas strings
em uma política de autorização
clara, mínima e testável?
```

O problema não é apenas técnico.

Uma API pode autenticar corretamente e ainda ser insegura quando:

- todo usuário autenticado acessa tudo;
- roles são amplas demais;
- permissões possuem nomes inconsistentes;
- endpoints novos herdam acesso sem decisão;
- frontend esconde botão, mas backend não protege;
- a aplicação verifica acesso apenas em alguns caminhos;
- `ROLE_ADMIN` vira justificativa para qualquer operação;
- tokens antigos mantêm permissões excessivas;
- testes cobrem apenas o cenário permitido.

Nesta aula, a API deixará de usar:

```java
.anyRequest()
.authenticated();
```

como regra geral para os endpoints de negócio.

Ela passará a exigir permissões específicas:

```text
GET:
service-order:read.

POST:
service-order:create.

PUT:
service-order:update.

PATCH de status:
service-order:status:update.

DELETE:
service-order:delete.
```

Roles continuarão existindo:

```text
ROLE_OPERATOR;

ROLE_SUPERVISOR;

ROLE_AUDITOR;

ROLE_ADMIN.
```

Mas uma role não concederá permissões magicamente.

A conta persistida e o access token carregarão explicitamente:

```text
a role;

as permissions efetivas.
```

Exemplo de operador:

```text
ROLE_OPERATOR;

service-order:read;

service-order:create;

service-order:update;

service-order:status:update.
```

Ele não receberá:

```text
service-order:delete.
```

Exemplo de auditor:

```text
ROLE_AUDITOR;

service-order:read.
```

Exemplo de supervisor:

```text
ROLE_SUPERVISOR;

service-order:read;

service-order:create;

service-order:update;

service-order:status:update;

service-order:delete.
```

A palavra `authority` será usada como conceito geral do Spring Security.

Uma authority pode representar:

- role;
- permission;
- escopo técnico;
- direito concedido por outro modelo.

A convenção desta formação será:

```text
role:
ROLE_<NOME_EM_MAIUSCULO>.

permission:
<recurso>:<acao>,
em lowercase.
```

O catálogo ficará centralizado em código para evitar:

- erros de digitação;
- prefixos inconsistentes;
- tokens com valores desconhecidos;
- divergência entre banco, JWT e filter chain.

A prática criará:

```text
SecurityAuthorityCatalog;

AuthorityProfiles;

AuthorizationMatrixIntegrationTest;

docs/security/M15_AUTHORIZATION_MATRIX.md.
```

Também atualizará:

```text
ApplicationUser;

DatabaseAuthenticationLabInitializer;

JwtAccessTokenProfileValidator;

ApiSecurityConfiguration;

testes de login;

testes de Resource Server;

testes de refresh.
```

A autorização desta aula ocorrerá na camada HTTP:

```text
authorizeHttpRequests.
```

Ela protegerá rotas e métodos HTTP.

Não serão adicionados ainda:

- `@EnableMethodSecurity`;
- `@PreAuthorize`;
- `@PostAuthorize`;
- `@PreFilter`;
- `@PostFilter`;
- `PermissionEvaluator`;
- autorização por ownership;
- regras baseadas no estado da OS.

Esses assuntos começam na aula seguinte:

```text
427 - M15.17 - Method Security
```

---

## Onde estamos na formação

A sequência atual é:

```text
424:
Validacao de token e filtros.

425:
Refresh token.

426:
Roles authorities e permissoes.

427:
Method Security.

428:
Autorizacao por regra de negocio.

429:
IDOR e autorizacao por recurso.
```

A aula 425 respondeu:

```text
como renovar acesso
sem reutilizar a mesma credencial?
```

A aula 426 responderá:

```text
como representar e aplicar
direitos de acesso
sem transformar autenticação
em autorização total?
```

Nesta aula:

```text
GrantedAuthority:
sim.

role:
sim.

permission:
sim.

nomenclatura:
sim.

catálogo:
sim.

matriz HTTP:
sim.

least privilege:
sim.

deny by default:
sim.

testes positivos:
sim.

testes negativos:
sim.

role hierarchy:
conceito, não ativada.

Method Security:
não.

ownership:
não.

regra de negócio:
não.
```

A regra central será:

```text
autenticação responde quem é;

autorização responde
o que essa identidade pode fazer
nesta operação.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── security
        └── authorization
            ├── SecurityAuthorityCatalog.java
            └── AuthorityProfiles.java
```

Configuração atualizada:

```text
ApiSecurityConfiguration.java;

JwtAccessTokenProfileValidator.java;

ApplicationUser.java;

DatabaseAuthenticationLabInitializer.java.
```

Teste:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── security
        └── AuthorizationMatrixIntegrationTest.java
```

Documento:

```text
docs/security/M15_AUTHORIZATION_MATRIX.md
```

A matriz será:

| Operação | Regra |
|---|---|
| Login | Público |
| Refresh | Público |
| Consultar identidade | Autenticado |
| Listar OS | `service-order:read` |
| Consultar OS | `service-order:read` |
| Criar OS | `service-order:create` |
| Substituir OS | `service-order:update` |
| Alterar status | `service-order:status:update` |
| Excluir OS | `service-order:delete` |
| Probe administrativo | `ROLE_ADMIN` |
| Qualquer endpoint não declarado | Negado |

Perfis do laboratório:

| Perfil | Authorities |
|---|---|
| Operador | role, read, create, update e status update |
| Supervisor | role e todas as permissions de OS |
| Auditor | role e read |
| Admin | role e todas as permissions de OS |

Você irá:

1. diferenciar autenticação e autorização;
2. definir authority;
3. definir role;
4. definir permission;
5. entender `hasRole`;
6. entender `hasAuthority`;
7. criar nomenclatura;
8. criar catálogo;
9. criar perfis;
10. validar authorities na entrada;
11. validar authorities no JWT;
12. atualizar bootstrap;
13. aplicar matriz HTTP;
14. terminar em `denyAll`;
15. testar operador;
16. testar supervisor;
17. testar auditor;
18. testar admin;
19. testar values desconhecidos;
20. preparar Method Security.

---

## Conceito essencial

### GrantedAuthority é o conceito geral

No Spring Security, uma identidade autenticada expõe:

```java
authentication.getAuthorities();
```

O retorno é uma coleção de:

```text
GrantedAuthority.
```

A interface representa um direito concedido ao principal.

A implementação comum é:

```text
SimpleGrantedAuthority.
```

O framework não exige que toda authority seja role.

Exemplos válidos:

```text
ROLE_OPERATOR;

service-order:read;

invoice:approve;

report:export.
```

O significado pertence à policy da aplicação.

---

### Role

Role representa normalmente uma função ampla ou persona organizacional.

Exemplos:

```text
OPERATOR;

SUPERVISOR;

AUDITOR;

ADMIN.
```

Na convenção padrão do Spring Security, roles aparecem como authorities com prefixo:

```text
ROLE_.
```

Assim:

```java
.hasRole("ADMIN")
```

é um atalho conceitual para:

```java
.hasAuthority("ROLE_ADMIN")
```

Não use:

```java
.hasRole("ROLE_ADMIN")
```

porque o prefixo seria aplicado novamente conforme a configuração padrão.

Quando o valor completo já está disponível, use:

```java
.hasAuthority("ROLE_ADMIN")
```

ou use corretamente:

```java
.hasRole("ADMIN")
```

---

### Permission

Permission representa uma ação específica sobre um recurso ou capacidade.

A convenção será:

```text
resource:action.
```

Exemplos:

```text
service-order:read;

service-order:create;

service-order:update;

service-order:status:update;

service-order:delete.
```

Permissions são mais adequadas para proteger operações da API porque descrevem diretamente a capacidade necessária.

---

### Authority, role e permission

Resumo:

```text
authority:
conceito técnico geral.

role:
authority ampla com prefixo ROLE_.

permission:
authority fina que representa uma ação.
```

Toda role desta aplicação será uma authority.

Toda permission também será uma authority.

Nem toda authority futura precisará ser classificada como role ou permission.

---

### Role não é bundle automático

Ter:

```text
ROLE_OPERATOR
```

não faz o Spring Security inferir:

```text
service-order:read.
```

Essa implicação só existiria se a aplicação configurasse:

- role hierarchy;
- mapper;
- provider customizado;
- expansão no carregamento;
- policy própria.

Nesta baseline, o banco armazena a role e cada permission efetiva.

Isso torna o access token explícito e auditável.

---

### Perfis são atalhos de provisionamento

`AuthorityProfiles` definirá conjuntos recomendados.

Exemplo:

```text
operator();
supervisor();
auditor();
admin();
```

Esses perfis ajudam:

- bootstrap;
- fixtures;
- documentação;
- testes.

Eles não serão usados pelo endpoint para decidir acesso.

A filter chain avaliará permissions concretas.

Assim, uma alteração no perfil afeta novas atribuições ou operações administrativas, não muda silenciosamente tokens já emitidos.

---

### Least privilege

Cada identidade recebe somente o necessário.

Exemplo:

```text
auditor:
read.

operator:
read, create, update e status update.

supervisor:
inclui delete.

admin:
role administrativa e permissions explícitas.
```

Não conceda `service-order:delete` ao operador apenas porque “talvez precise”.

Acesso deve ser justificado.

---

### Deny by default

A policy termina em:

```java
.anyRequest()
.denyAll();
```

Isso significa:

```text
endpoint novo:
negado até receber regra.
```

Uma regra final:

```java
.anyRequest()
.authenticated();
```

seria ampla demais nesta etapa.

Autenticação não informa qual operação é permitida.

---

### Validar em toda request

O frontend pode esconder ou desabilitar botões.

Isso melhora experiência, mas não protege a API.

Cada request precisa atravessar autorização no backend.

O atacante pode chamar diretamente:

- URL;
- curl;
- Postman;
- script;
- replay;
- cliente modificado.

A filter chain será a primeira camada.

Method Security será a segunda camada na aula 427.

---

### Coarse-grained e fine-grained

Roles são úteis para decisões amplas:

```text
somente administradores
acessam uma área administrativa.
```

Permissions são úteis para ações:

```text
quem pode excluir uma OS?
```

A aplicação utilizará:

```text
role:
admin probe e classificação.

permission:
CRUD da API OS.
```

Essa divisão evita criar roles como:

```text
ROLE_CAN_DELETE_SERVICE_ORDER.
```

Esse nome seria uma permission disfarçada de role.

---

### Role explosion

Role explosion ocorre quando cada combinação gera uma role:

```text
ROLE_OPERATOR_READ_ONLY;

ROLE_OPERATOR_WITH_DELETE;

ROLE_OPERATOR_WITH_EXPORT;

ROLE_SUPERVISOR_WITHOUT_UPDATE.
```

O número de roles cresce rapidamente.

A separação entre role e permission reduz esse problema.

---

### Permission explosion

Também é possível exagerar no detalhamento:

```text
service-order:read-field-customer-name;

service-order:read-field-address;

service-order:read-field-created-at.
```

Permissions precisam corresponder a decisões reais de segurança.

Regras por campo, ownership ou estado podem ser melhor expressas em código de domínio e Method Security.

---

### Sem wildcard de autoridade

Não será criada:

```text
service-order:*;

*:*;

SUPERUSER.
```

Wildcards dificultam auditoria e podem conceder operações futuras automaticamente.

Cada permission será explícita.

---

### Sem ID de recurso na authority

Não crie:

```text
service-order:123:read.
```

para cada OS.

Isso gera milhares de authorities e tokens grandes.

Autorização por objeto deve verificar:

- ownership;
- cliente;
- vínculo;
- estado;
- tenant.

Esse aprofundamento ficará para aulas futuras.

---

### Role hierarchy

Spring Security possui suporte a hierarquia de roles.

Exemplo conceitual:

```text
ROLE_ADMIN > ROLE_SUPERVISOR
ROLE_SUPERVISOR > ROLE_OPERATOR
```

Nesta aula, a hierarquia não será ativada.

Motivos:

- permissions já serão explícitas;
- herança pode ocultar privilégios;
- a matriz precisa continuar legível;
- o comportamento deve ser comprovado antes de ser adotado.

Role hierarchy não é proibida.

Ela apenas não será introduzida sem necessidade.

---

### Claims e estado persistido

As authorities seguem o fluxo:

```text
PostgreSQL;

DatabaseUserPrincipal;

Authentication;

JwtTokenService;

claim authorities;

JwtAccessTokenProfileValidator;

JwtAuthoritiesConverter;

JwtAuthenticationToken.
```

O catálogo precisa ser aplicado nos pontos de entrada:

- criação ou alteração de usuário;
- bootstrap;
- emissão;
- validação do JWT.

Assim, uma string desconhecida não chega silenciosamente à autorização.

---

## Mão na massa guiada

### 1. Criar SecurityAuthorityCatalog

Arquivo:

```text
SecurityAuthorityCatalog.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration
        .security.authorization;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class SecurityAuthorityCatalog {

    public static final String
            ROLE_OPERATOR =
            "ROLE_OPERATOR";

    public static final String
            ROLE_SUPERVISOR =
            "ROLE_SUPERVISOR";

    public static final String
            ROLE_AUDITOR =
            "ROLE_AUDITOR";

    public static final String
            ROLE_ADMIN =
            "ROLE_ADMIN";

    public static final String
            SERVICE_ORDER_READ =
            "service-order:read";

    public static final String
            SERVICE_ORDER_CREATE =
            "service-order:create";

    public static final String
            SERVICE_ORDER_UPDATE =
            "service-order:update";

    public static final String
            SERVICE_ORDER_STATUS_UPDATE =
            "service-order:status:update";

    public static final String
            SERVICE_ORDER_DELETE =
            "service-order:delete";

    private static final Set<String>
            KNOWN_AUTHORITIES =
            Set.of(
                    ROLE_OPERATOR,
                    ROLE_SUPERVISOR,
                    ROLE_AUDITOR,
                    ROLE_ADMIN,
                    SERVICE_ORDER_READ,
                    SERVICE_ORDER_CREATE,
                    SERVICE_ORDER_UPDATE,
                    SERVICE_ORDER_STATUS_UPDATE,
                    SERVICE_ORDER_DELETE
            );

    private SecurityAuthorityCatalog() {
    }
```

Continue:

```java
    public static boolean isKnown(
            String authority
    ) {
        return authority != null
                && KNOWN_AUTHORITIES
                        .contains(authority);
    }

    public static Set<String>
    normalizeAndValidate(
            Collection<String> authorities
    ) {
        if (
            authorities == null
            || authorities.isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "At least one authority is required"
            );
        }

        Set<String> normalized =
                authorities
                        .stream()
                        .map(
                                authority ->
                                        authority == null
                                                ? ""
                                                : authority
                                                        .trim()
                        )
                        .collect(
                                Collectors
                                        .toCollection(
                                                LinkedHashSet::new
                                        )
                        );

        if (
            normalized.isEmpty()
            || normalized
                    .stream()
                    .anyMatch(
                            authority ->
                                    !isKnown(authority)
                    )
        ) {
            throw new IllegalArgumentException(
                    "Unknown security authority"
            );
        }

        return Set.copyOf(normalized);
    }

    public static Set<String> all() {
        return KNOWN_AUTHORITIES;
    }
}
```

A exception não repete o valor rejeitado.

---

### 2. Criar AuthorityProfiles

```java
package br.com.formacao.backend.configuration
        .security.authorization;

import java.util.Set;

import static br.com.formacao.backend.configuration
        .security.authorization
        .SecurityAuthorityCatalog.*;

public final class AuthorityProfiles {

    private AuthorityProfiles() {
    }

    public static Set<String> operator() {
        return Set.of(
                ROLE_OPERATOR,
                SERVICE_ORDER_READ,
                SERVICE_ORDER_CREATE,
                SERVICE_ORDER_UPDATE,
                SERVICE_ORDER_STATUS_UPDATE
        );
    }

    public static Set<String> supervisor() {
        return Set.of(
                ROLE_SUPERVISOR,
                SERVICE_ORDER_READ,
                SERVICE_ORDER_CREATE,
                SERVICE_ORDER_UPDATE,
                SERVICE_ORDER_STATUS_UPDATE,
                SERVICE_ORDER_DELETE
        );
    }

    public static Set<String> auditor() {
        return Set.of(
                ROLE_AUDITOR,
                SERVICE_ORDER_READ
        );
    }

    public static Set<String> admin() {
        return Set.of(
                ROLE_ADMIN,
                SERVICE_ORDER_READ,
                SERVICE_ORDER_CREATE,
                SERVICE_ORDER_UPDATE,
                SERVICE_ORDER_STATUS_UPDATE,
                SERVICE_ORDER_DELETE
        );
    }
}
```

Os conjuntos são imutáveis.

---

### 3. Atualizar ApplicationUser

Na factory:

```java
user.authorities =
        new LinkedHashSet<>(
                SecurityAuthorityCatalog
                        .normalizeAndValidate(
                                authorities
                        )
        );
```

Crie operação futura segura:

```java
public void replaceAuthorities(
        Set<String> authorities,
        Clock clock
) {
    this.authorities =
            new LinkedHashSet<>(
                    SecurityAuthorityCatalog
                            .normalizeAndValidate(
                                    authorities
                            )
            );

    touch(clock);
}
```

Ainda não crie endpoint administrativo.

---

### 4. Atualizar o bootstrap

Substitua a lista textual por:

```java
AuthorityProfiles.operator()
```

O profile `db-auth-lab` pode deixar de receber authorities por variável/configuração.

A configuração fica:

```yaml
bootstrap:
  enabled: true
  username:
    ${APP_SECURITY_DB_BOOTSTRAP_USERNAME}
  password-hash:
    ${APP_SECURITY_DB_BOOTSTRAP_PASSWORD_HASH}
  profile: OPERATOR
```

Uma opção ainda mais simples para o laboratório é fixar o perfil `OPERATOR` dentro do initializer.

Não aceite authority arbitrária de variável sem validação.

---

### 5. Atualizar o profile validator JWT

Substitua a regex genérica:

```java
boolean invalid =
        authorities
                .stream()
                .anyMatch(
                        authority ->
                                !SecurityAuthorityCatalog
                                        .isKnown(
                                                authority
                                        )
                );
```

Preserve:

- lista obrigatória;
- limite de quantidade;
- valores sem duplicação;
- erro genérico.

Agora um token corretamente assinado com:

```text
service-order:destroy
```

será rejeitado como:

```text
401 invalid_token.
```

---

### 6. Validar authorities na emissão

Antes de montar o claim:

```java
Set<String> validated =
        SecurityAuthorityCatalog
                .normalizeAndValidate(
                        authentication
                                .getAuthorities()
                                .stream()
                                .map(
                                        GrantedAuthority
                                                ::getAuthority
                                )
                                .toList()
                );

List<String> authorities =
        validated
                .stream()
                .sorted()
                .toList();
```

O emissor não assina valores desconhecidos.

---

### 7. Criar a matriz HTTP

Na API chain:

```java
http.authorizeHttpRequests(
        authorization ->
                authorization

                        .requestMatchers(
                                CorsUtils
                                        ::isPreFlightRequest
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/refresh"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/security/me"
                        )
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/security/admin-probe"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v2/service-orders/**"
                        )
                        .hasAuthority(
                                SERVICE_ORDER_READ
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v2/service-orders"
                        )
                        .hasAuthority(
                                SERVICE_ORDER_CREATE
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/v2/service-orders/*"
                        )
                        .hasAuthority(
                                SERVICE_ORDER_UPDATE
                        )

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/v2/service-orders/*/status"
                        )
                        .hasAuthority(
                                SERVICE_ORDER_STATUS_UPDATE
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/v2/service-orders/*"
                        )
                        .hasAuthority(
                                SERVICE_ORDER_DELETE
                        )

                        .anyRequest()
                        .denyAll()
);
```

Use imports estáticos dos constants.

A ordem dos matchers precisa ser revisada.

---

### 8. Preservar paths públicos fora da API

A fallback chain continua responsável por:

- liveness;
- readiness;
- OpenAPI local;
- Swagger local;
- Actuator health;
- error dispatch.

Ela também termina em:

```java
.anyRequest()
.denyAll();
```

A matriz de negócio não deve liberar paths de infraestrutura.

---

### 9. Atualizar o usuário operador do laboratório

Authorities:

```text
ROLE_OPERATOR;

service-order:read;

service-order:create;

service-order:update;

service-order:status:update.
```

Remova a permission antiga genérica:

```text
service-order:write.
```

A permission `write` é ampla demais porque mistura:

- criar;
- atualizar;
- mudar status;
- excluir.

A migração de dados de laboratório pode ocorrer por recriação controlada do volume.

Não altere migrations já aplicadas.

---

### 10. Atualizar testes JWT anteriores

Os testes que esperavam:

```text
service-order:write
```

passam a esperar:

```text
service-order:create;

service-order:update;

service-order:status:update.
```

Preserve a ordenação determinística.

Atualize:

- login;
- Resource Server;
- refresh;
- `/me`;
- fixtures de usuário.

---

### 11. Criar helper de token real

No teste da matriz, crie usuários persistidos com perfis diferentes.

Faça login para cada usuário e obtenha um JWS real.

Não use apenas:

```java
with(jwt())
```

porque esse helper pode pular:

- assinatura;
- decoder;
- profile validator;
- converter.

Um helper aceitável:

```java
private String login(
        String username,
        String password
) throws Exception {
    // POST /api/auth/login
    // extrai access_token sem imprimir
}
```

---

### 12. Testar auditor

Com `AuthorityProfiles.auditor()`:

```text
GET lista:
200.

GET detalhe:
200.

POST:
403.

PUT:
403.

PATCH status:
403.

DELETE:
403.
```

Crie uma OS de fixture antes do teste.

---

### 13. Testar operador

Com `AuthorityProfiles.operator()`:

```text
GET:
permitido.

POST:
permitido.

PUT:
permitido.

PATCH status:
permitido.

DELETE:
403.
```

Quando a operação passa pela autorização e falha depois por validation ou regra de negócio, o teste precisa distinguir:

```text
não retornou 403.
```

Para testes completos, envie requests válidas e prepare dados reais.

---

### 14. Testar supervisor

Com `AuthorityProfiles.supervisor()`:

```text
GET:
permitido.

POST:
permitido.

PUT:
permitido.

PATCH:
permitido.

DELETE:
permitido.
```

A exclusão precisa usar uma OS em estado compatível com o contrato atual.

Autorização não elimina regras de negócio.

---

### 15. Testar admin

O perfil admin possui:

```text
ROLE_ADMIN;

todas as permissions conhecidas de OS.
```

Teste:

```text
admin probe:
204.

operações de OS:
conforme permissions.
```

Depois crie um token apenas com:

```text
ROLE_ADMIN.
```

Ele acessa o probe administrativo, mas não a API OS.

Isso comprova:

```text
role não implica permission
sem configuração explícita.
```

---

### 16. Testar role operator isolada

Crie um token assinado contendo somente:

```text
ROLE_OPERATOR.
```

Resultado:

```text
GET /api/v2/service-orders:
403.
```

O token é válido.

A permission está ausente.

Não transforme esse cenário em `401`.

---

### 17. Testar permission sem role

Crie uma conta com:

```text
service-order:read.
```

sem role.

Resultado:

```text
GET:
permitido.

admin probe:
403.
```

Isso comprova que a permission é suficiente para o endpoint que a exige.

A política de provisionamento pode decidir exigir também uma role, mas a autorização HTTP permanece baseada na capacidade concreta.

---

### 18. Testar authority desconhecida

Emita manualmente, no teste, um token assinado com:

```text
service-order:destroy.
```

O `JwtAccessTokenProfileValidator` deve rejeitá-lo:

```text
401 invalid_token.
```

Não espere `403`.

O token viola o perfil antes de virar `Authentication`.

---

### 19. Testar capitalização incorreta

Valores:

```text
role_admin;

ROLE_admin;

Service-Order:Read;

service-order:READ.
```

devem ser rejeitados como desconhecidos.

Authorities são case-sensitive.

Não normalize permissões silenciosamente durante validação do token.

---

### 20. Testar endpoint não declarado

Use bearer admin válido:

```text
GET /api/internal/new-operation
```

Resultado:

```text
403.
```

A request não deve cair em:

```text
anyRequest().authenticated().
```

Deny by default protege endpoints futuros.

---

### 21. Testar método HTTP não declarado

Exemplo:

```text
PATCH /api/v2/service-orders/{id}
```

sem `/status`.

Mesmo com todas as permissions:

```text
403.
```

A operação não está na matriz.

---

### 22. Testar ausência de permission

Para cada regra, mantenha dois testes:

```text
com permission:
permitido.

sem permission:
403.
```

Um teste positivo isolado não demonstra que a regra está protegendo.

---

### 23. Criar documento de matriz

Arquivo:

```text
docs/security/M15_AUTHORIZATION_MATRIX.md
```

Inclua:

```markdown
# Matriz de autorizacao

## Principios

- Least privilege.
- Deny by default.
- Validar toda request.
- Roles nao implicam permissions automaticamente.
- Frontend nao e controle de seguranca.

## Nomenclatura

Role:
`ROLE_<NOME>`.

Permission:
`<recurso>:<acao>`.

## Matriz HTTP

| Metodo | Path | Authority |
| ... |

## Perfis

| Perfil | Authorities |
| ... |

## Fora de escopo

- Ownership.
- Tenant.
- Estado da OS.
- Method Security.
```

---

### 24. Atualizar OpenAPI

Para cada operação, documente a permission necessária na descrição.

O security scheme continua:

```text
bearerAuth.
```

OpenAPI não substitui a enforcement da filter chain.

Não coloque token de exemplo.

---

### 25. Atualizar collection

Crie requests separadas por perfil somente como estrutura.

Não versione:

- access token;
- refresh token;
- password;
- hash;
- private key.

Use variáveis locais ou secret vault da ferramenta.

Adicione testes de status:

```text
auditor DELETE:
403.

operator DELETE:
403.

supervisor DELETE:
sucesso.
```

---

### 26. Atualizar threat model

Adicione:

```text
THR-058:
usuário autenticado recebe acesso genérico.

THR-059:
role ampla substitui permission específica.

THR-060:
authority desconhecida entra no JWT.

THR-061:
endpoint novo herda authenticated.

THR-062:
frontend é tratado como enforcement.

THR-063:
role prefixada incorretamente.

THR-064:
wildcard concede operação futura.

THR-065:
permission por objeto explode token.
```

Controles:

- catálogo;
- matriz;
- denyAll;
- testes negativos;
- permission por ação;
- backend enforcement;
- ausência de wildcard.

---

### 27. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
matriz HTTP implementada;

least privilege aplicado;

deny by default preservado;

object-level authorization ainda pendente.
```

Baseline:

```text
autenticação:
JWT.

autorização HTTP:
permissions explícitas.

roles:
classificação ampla.

Method Security:
pendente.

produção:
NO-GO.
```

Não marque Broken Access Control como resolvido.

---

### 28. Executar o gate

Teste focado:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- tokens reais;
- PostgreSQL real;
- matriz positiva e negativa;
- unknown authority rejeitada;
- endpoints desconhecidos negados;
- refresh preservado;
- nenhum token em logs;
- nenhuma sessão;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### Authority virou o termo guarda-chuva

Roles e permissions usam o mesmo contrato técnico.

### Role ficou ampla

Ela representa uma persona, não cada ação.

### Permission ficou operacional

Cada método HTTP exige uma capacidade específica.

### A role não concedeu direitos ocultos

Permissions efetivas estão explícitas no banco e no token.

### O catálogo reduziu divergência

Banco, emissão, validação e filter chain usam os mesmos valores.

### A chain voltou a deny-all

Autenticação deixou de liberar endpoints desconhecidos.

### Testes negativos ganharam prioridade

Cada permissão foi provada também pela ausência.

### Object-level authorization continuou pendente

Ler qualquer OS ainda não significa poder ler toda OS.

---

## Erros comuns importantes

### Usar role e authority como sinônimos absolutos

Role é uma categoria de authority.

### Chamar hasRole com ROLE_

Use `hasRole("ADMIN")` ou `hasAuthority("ROLE_ADMIN")`.

### Criar permission genérica write

Ela mistura operações com riscos diferentes.

### Conceder tudo ao admin por mágica

Admin precisa das permissions concretas quando a regra exige permission.

### Usar authenticated como regra final

Todo usuário autenticado ganharia acesso amplo.

### Confiar no frontend

O backend precisa validar cada request.

### Criar wildcard

Operações futuras podem nascer permitidas.

### Guardar resource ID em authority

O token cresce e a policy fica inviável.

### Testar apenas sucesso

A ausência de permission precisa produzir `403`.

### Ativar role hierarchy sem necessidade

Herança pode ocultar privilégios efetivos.

---

## Comandos úteis

### Teste da matriz

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar authenticated amplo

```powershell
git grep `
  -n `
  "anyRequest().authenticated"
```

### Procurar authorities antigas

```powershell
git grep `
  -n `
  "service-order:write"
```

### Procurar wildcards

```powershell
git grep `
  -n `
  -E `
  "service-order:\\*|\\*:\\*|SUPERUSER"
```

### Consultar authorities

```sql
select
    u.username,
    a.authority
from
    security_user u
join
    security_user_authority a
        on a.user_id = u.id
order by
    u.username,
    a.authority;
```

---

## Exercício guiado

### Parte 1 — Conceitos

Explique authority, role e permission.

### Parte 2 — Catálogo

Centralize os valores conhecidos.

### Parte 3 — Perfis

Crie operator, supervisor, auditor e admin.

### Parte 4 — Domínio

Valide authorities na conta persistida.

### Parte 5 — JWT

Rejeite valores desconhecidos antes da Authentication.

### Parte 6 — Matriz

Proteja cada operação da API OS.

### Parte 7 — Deny by default

Negue endpoint e método não declarados.

### Parte 8 — Testes positivos

Comprove acesso com permission.

### Parte 9 — Testes negativos

Comprove `403` sem permission.

### Parte 10 — Documentação

Atualize OpenAPI, matriz e threat model.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 425 foi preservada;
- authority, role e permission foram diferenciadas;
- `GrantedAuthority` foi explicado;
- role foi tratada como authority com `ROLE_`;
- permission segue `resource:action`;
- `hasRole("ADMIN")` foi diferenciado de `hasAuthority("ROLE_ADMIN")`;
- `hasRole("ROLE_ADMIN")` foi rejeitado;
- roles não implicam permissions automaticamente;
- least privilege foi aplicado;
- deny by default foi preservado;
- frontend não foi tratado como controle;
- coarse-grained e fine-grained foram diferenciados;
- role explosion e permission explosion foram discutidos;
- wildcard de permission não foi criado;
- IDs de OS não entraram em authorities;
- role hierarchy não foi ativada sem necessidade;
- `SecurityAuthorityCatalog` foi criado;
- roles conhecidas foram centralizadas;
- permissions de OS foram centralizadas;
- authority desconhecida é rejeitada;
- erro não repete o valor rejeitado;
- `AuthorityProfiles` foi criado;
- operador não possui delete;
- supervisor possui permissions de OS;
- auditor possui apenas read;
- admin possui role e permissions explícitas;
- `ApplicationUser` valida authorities;
- bootstrap usa perfil controlado;
- authority arbitrária de configuração não é aceita;
- emissor JWT valida authorities;
- profile validator rejeita unknown authority;
- permission antiga `service-order:write` foi removida;
- matriz HTTP foi criada;
- login e refresh permanecem públicos;
- `/me` exige autenticação;
- admin probe exige role ADMIN;
- GET de OS exige read;
- POST exige create;
- PUT exige update;
- PATCH status exige status update;
- DELETE exige delete;
- API chain termina em `denyAll`;
- fallback continua negando paths não declarados;
- testes usam JWS real;
- auditor lê e não escreve;
- operador não exclui;
- supervisor executa delete permitido pelo negócio;
- admin acessa probe;
- ROLE_ADMIN isolada não concede permissions;
- ROLE_OPERATOR isolada não concede read;
- permission read sem role permite leitura;
- unknown authority retorna `401 invalid_token`;
- capitalização incorreta é rejeitada;
- endpoint desconhecido retorna `403`;
- método HTTP não declarado retorna `403`;
- cada regra possui teste permitido e negado;
- regras de negócio continuam separadas;
- object-level authorization não foi antecipada;
- documento da matriz foi criado;
- OpenAPI informa permissions;
- collection não versiona tokens;
- threat model foi atualizado;
- OWASP A01 foi atualizado sem ser marcado resolvido;
- baseline foi atualizada;
- PostgreSQL real foi usado;
- refresh token continuou funcionando;
- nenhum token apareceu em logs;
- Method Security não foi antecipado;
- gate completo foi executado;
- commit recomendado está pronto;
- ponte para a aula 427 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git grep -n "service-order:write"
git grep -n "anyRequest().authenticated"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): aplicar matriz de roles e permissoes"
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
- private key;
- authorities inventadas;
- wildcard;
- environment com credenciais;
- collection com tokens;
- Method Security antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a autorização deixou de ser:

```text
está autenticado?
```

e passou a responder:

```text
possui a capacidade exigida
por esta operação?
```

A nomenclatura ficou:

```text
role:
ROLE_OPERATOR.

permission:
service-order:read.

authority:
conceito técnico que representa ambos.
```

A API OS passou a exigir:

```text
read;

create;

update;

status update;

delete.
```

A matriz terminou em:

```text
denyAll.
```

Assim, endpoints e métodos novos não nascem permitidos.

Os perfis do laboratório ficaram explícitos:

```text
auditor:
leitura.

operator:
operações sem delete.

supervisor:
operações completas.

admin:
role administrativa e permissions concretas.
```

A decisão central foi:

```text
roles classificam identidades;

permissions autorizam capacidades;

o backend valida cada request;

e nenhum acesso é herdado
sem uma regra explícita e testada.
```

A filter chain protege a fronteira HTTP.

Porém, serviços podem ser chamados por:

- outro controller;
- scheduler;
- listener;
- evento;
- código interno;
- futura interface.

A próxima camada será aplicada na aula:

```text
427 - M15.17 - Method Security
```

Nela, você irá:

- ativar `@EnableMethodSecurity`;
- usar `@PreAuthorize`;
- proteger serviços;
- combinar role e permission;
- testar chamadas diretas;
- preservar defesa em profundidade;
- evitar annotations espalhadas sem policy;
- preparar autorização por regra de negócio.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei authority, role e permission.
- [ ] Centralizei a nomenclatura.
- [ ] Apliquei uma matriz por endpoint.
- [ ] Terminei a chain em deny-all.
- [ ] Testei acesso permitido e negado.

---

## Troubleshooting adicional

### Usuário autenticado recebe 403 em tudo

Confirme:

- authorities persistidas;
- claim JWT;
- catálogo;
- converter;
- valor exato exigido;
- token renovado após mudança de permissions.

### hasRole não encontra ROLE_ADMIN

Use:

```java
hasRole("ADMIN")
```

ou:

```java
hasAuthority("ROLE_ADMIN")
```

### Token antigo ainda possui service-order:write

Faça novo login ou refresh depois de atualizar a conta.

Access tokens existentes permanecem self-contained até expirar.

### Supervisor recebe 403 no DELETE

Confirme `service-order:delete` no banco e no claim.

Depois valide regras de negócio do endpoint.

### Endpoint desconhecido retorna 404

Isso pode indicar que a request não atravessou a chain esperada.

Revise `securityMatcher`, ordem das chains e matcher.

### Unknown authority retorna 403

O validator pode não estar usando o catálogo.

Ela deve ser rejeitada antes da Authentication com `401`.

### Teste com jwt() passa e o real falha

Use token assinado pela stack real para testar decoder e converter.

### Permission existe no frontend, mas não no backend

Frontend não concede authority.

A conta persistida e o token são as fontes efetivas.

---

## Perguntas de revisão

1. O que é `GrantedAuthority`?
2. Toda authority é role?
3. Como uma role é representada?
4. O que `hasRole("ADMIN")` procura?
5. Quando usar `hasAuthority`?
6. O que é permission?
7. Qual nomenclatura foi escolhida?
8. ROLE_OPERATOR concede read automaticamente?
9. Qual permission lista OS?
10. Qual permission exclui OS?
11. O operador pode excluir?
12. O auditor pode criar?
13. O supervisor pode excluir?
14. Admin sem permission pode ler OS?
15. Por que terminar em denyAll?
16. Frontend protege a API?
17. Wildcard foi usado?
18. IDs de OS entram no token?
19. Method Security já foi ativado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Direito concedido ao principal.
2. Não.
3. Authority com prefixo `ROLE_`.
4. `ROLE_ADMIN`.
5. Para o valor completo e permissions.
6. Capacidade específica.
7. `resource:action`.
8. Não.
9. `service-order:read`.
10. `service-order:delete`.
11. Não.
12. Não.
13. Sim.
14. Não.
15. Negar operações não declaradas.
16. Não.
17. Não.
18. Não.
19. Não.
20. Method Security.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 426 - M15.16 - Roles authorities e permissoes

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei autenticação e autorização.
- Estudei `GrantedAuthority`.
- Diferenciei authority, role e permission.
- Padronizei roles com prefixo `ROLE_`.
- Padronizei permissions como `resource:action`.
- Diferenciei `hasRole` e `hasAuthority`.
- Confirmei que role não implica permission automaticamente.
- Apliquei least privilege.
- Mantive deny by default.
- Registrei que frontend não protege a API.
- Diferenciei autorização ampla e fina.
- Evitei role explosion, wildcards e IDs em authorities.
- Não ativei role hierarchy sem necessidade.
- Criei `SecurityAuthorityCatalog`.
- Centralizei roles e permissions conhecidas.
- Criei `AuthorityProfiles`.
- Defini perfis de operador, supervisor, auditor e admin.
- Removi a permission genérica `service-order:write`.
- Validei authorities no domínio.
- Validei authorities antes da emissão JWT.
- Rejeitei authorities desconhecidas no Resource Server.
- Atualizei o bootstrap do laboratório.
- Criei uma matriz por método e endpoint.
- Exigi read para consultas.
- Exigi create para criação.
- Exigi update para substituição.
- Exigi status update para alteração de status.
- Exigi delete para exclusão.
- Mantive role ADMIN no probe administrativo.
- Terminei a API chain em `denyAll`.
- Testei auditor, operador, supervisor e admin.
- Testei role sem permission.
- Testei permission sem role.
- Testei authority desconhecida e capitalização incorreta.
- Testei endpoint e método não declarados.
- Criei `docs/security/M15_AUTHORIZATION_MATRIX.md`.
- Atualizei OpenAPI, collection, threat model, OWASP e baseline.
- Não implementei Method Security ou autorização por objeto.
- Próxima aula: Method Security.
```

---

## Referência técnica curta

- [Spring Security — Authorize HttpServletRequests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring Security — Authorization Architecture](https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html)
- [Spring Security — Authentication Architecture](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html)
- [Spring Security — Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

Regra final:

```text
a política de autorização precisa distinguir o conceito técnico de authority, a classificação ampla de role e a capacidade específica de permission: nesta baseline, roles usam ROLE_, permissions usam resource:action, nenhuma role implica direitos ocultos, banco e JWT carregam permissions efetivas, valores desconhecidos são rejeitados antes da Authentication, cada operação HTTP exige sua permission, frontend não é enforcement, wildcards e authorities por objeto são evitados, testes cobrem concessão e negação e qualquer request não declarada termina em denyAll.
```
