# 683 - M20.13 - Implementacao seguranca

## Apresentação da aula

Na aula 682, você implementou a API REST do OrderFlow.

O módulo `orderflow-api` passou a possuir:

- aplicação Spring Boot;
- controllers finos;
- DTOs de request e response;
- Bean Validation;
- request context;
- correlation ID;
- header de idempotência;
- tenant provisório por header;
- Problem Details;
- tratamento centralizado de erros;
- OpenAPI;
- testes com MockMvc;
- testes de integração;
- validação multi-tenant;
- gate arquitetural.

A API já consegue receber comandos e consultas.

Mas ela ainda confia em um header enviado pelo próprio client:

```text
X-Tenant-Id.
```

Esse mecanismo foi útil para integrar as camadas.

Ele não é suficiente para um sistema profissional.

Um client poderia tentar enviar:

```text
X-Tenant-Id:
tenant-de-outra-empresa.
```

Sem autenticação e autorização, a API não consegue provar:

- quem está chamando;
- qual tenant pertence ao chamador;
- quais ações são permitidas;
- qual identidade executou a operação;
- se o token é válido;
- se o token expirou;
- se o audience está correto;
- se o emissor é confiável;
- se o workload possui permissão;
- se o acesso deve ser auditado.

Nesta aula, você implementará a segurança do OrderFlow.

O foco será:

```text
Spring Security;

OAuth2 Resource Server;

JWT;

issuer validation;

audience validation;

tenant claim;

scopes;

roles;

method authorization;

endpoint policies;

workload identity;

access audit;

security tests;

security evidence.
```

A autenticação responderá:

```text
quem e o chamador?
```

A autorização responderá:

```text
o que esse chamador
pode fazer?
```

O isolamento multi-tenant responderá:

```text
em qual tenant
essa identidade
pode atuar?
```

O controller não confiará mais em tenant arbitrário enviado pelo client.

O tenant será derivado de uma claim autenticada:

```text
tenant_id.
```

O header `X-Tenant-Id` poderá continuar existindo apenas como confirmação opcional.

Quando existir, seu valor deverá coincidir com a claim.

O laboratório será:

```text
labs/m20/aula-683-implementacao-seguranca/orderflow-security-implementation
```

Você criará:

- configuração do Resource Server;
- validação de issuer;
- validação de audience;
- conversor de authorities;
- principal do OrderFlow;
- tenant context autenticado;
- policies de endpoint;
- method security;
- scopes;
- roles;
- proteção contra IDOR;
- autenticação de workloads;
- audit de acesso;
- Problem Details de segurança;
- OpenAPI protegido;
- testes unitários;
- testes MockMvc;
- testes de integração;
- testes de tenant;
- testes arquiteturais;
- reports, evidence e gate.

A próxima aula será:

```text
684 - M20.14 - Implementacao integracoes
```

Na aula 684, o Integration Gateway receberá adapters de estoque, pagamento e fulfillment, com autenticação de workload, timeouts, retries, circuit breaker, normalização de respostas e testes de contrato.

Nesta aula, nenhum provider externo será implementado.

Regra central:

```text
tenant,
identidade
e permissao

devem vir
de contexto autenticado,

nunca de dados
livremente escolhidos
pelo client.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
680:
Implementacao casos de uso.

681:
Implementacao persistencia.

682:
Implementacao API REST.

683:
Implementacao seguranca.

684:
Implementacao integracoes.

685:
Mensageria e eventos.
```

A segurança será adicionada sobre uma API já funcional.

Isso reduz a chance de misturar:

- autenticação;
- autorização;
- regras de domínio;
- validação de DTO;
- persistência;
- integração externa.

A aula 683 deve proteger:

- endpoints;
- input ports;
- queries;
- tenant context;
- operações críticas;
- administração;
- reconciliação;
- auditoria;
- documentação;
- observabilidade.

Ela não deve antecipar:

- clients de estoque;
- clients de pagamento;
- clients de fulfillment;
- retry de provider;
- circuit breaker;
- contratos externos;
- mensageria real;
- publicação no broker;
- consumo de eventos.

---

## Objetivo prático

Será criada a estrutura:

```text
apps/orderflow-api
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/orderflow/api
│   │   │       ├── security
│   │   │       │   ├── SecurityConfiguration.java
│   │   │       │   ├── JwtAudienceValidator.java
│   │   │       │   ├── OrderFlowJwtAuthenticationConverter.java
│   │   │       │   ├── OrderFlowPrincipal.java
│   │   │       │   ├── AuthenticatedRequestContext.java
│   │   │       │   ├── AuthenticatedRequestContextResolver.java
│   │   │       │   ├── SecurityAuthorities.java
│   │   │       │   ├── SecurityClaims.java
│   │   │       │   ├── TenantClaimValidator.java
│   │   │       │   ├── AccessPolicy.java
│   │   │       │   ├── WorkloadPolicy.java
│   │   │       │   ├── SecurityAuditService.java
│   │   │       │   ├── SecurityProblemHandler.java
│   │   │       │   └── SecurityProperties.java
│   │   │       ├── controller
│   │   │       │   ├── OrderCommandController.java
│   │   │       │   ├── OrderQueryController.java
│   │   │       │   ├── OrderOperationController.java
│   │   │       │   └── ReconciliationController.java
│   │   │       └── config
│   │   │           └── OpenApiSecurityConfiguration.java
│   │   └── resources
│   │       ├── application.yml
│   │       └── application-test.yml
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/api/security
│               ├── JwtAudienceValidatorTest.java
│               ├── TenantClaimValidatorTest.java
│               ├── JwtAuthenticationConverterTest.java
│               ├── SecurityAuthenticationTest.java
│               ├── SecurityAuthorizationTest.java
│               ├── SecurityTenantIsolationTest.java
│               ├── SecurityWorkloadIdentityTest.java
│               ├── SecurityProblemDetailsTest.java
│               ├── SecurityOpenApiTest.java
│               ├── SecurityAuditTest.java
│               └── SecurityArchitectureTest.java
└── target
```

Documentação:

```text
docs/security
├── AUTHENTICATION_MODEL.md
├── AUTHORIZATION_MATRIX.md
├── JWT_CLAIM_CONTRACT.md
├── TENANT_ISOLATION_POLICY.md
├── WORKLOAD_IDENTITY_POLICY.md
├── TOKEN_VALIDATION_POLICY.md
├── SECURITY_ERROR_CATALOG.md
├── SECURITY_TEST_MATRIX.md
├── SECURITY_RISK_REGISTER.md
├── SECURITY_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Autenticação não é autorização

Um token válido prova identidade.

Ele não concede automaticamente todas as ações.

Exemplo:

```text
usuario autenticado
sem scope orders:cancel
```

não pode cancelar pedido.

### Claim não deve ser aceita sem validação

A presença de uma claim não basta.

O token precisa ter:

- assinatura válida;
- issuer permitido;
- audience esperado;
- tempo válido;
- formato esperado;
- tenant válido;
- subject;
- authorities.

### Tenant é uma fronteira de autorização

Mesmo quando o pedido usa UUID, o acesso deve incluir tenant.

O fluxo correto é:

```text
token autenticado;

tenant derivado da claim;

command e query recebem esse tenant;

repository busca por tenant + order.
```

Isso reduz IDOR:

```text
Insecure Direct Object Reference.
```

### Scope representa capacidade

Exemplos:

```text
orders:read;

orders:write;

orders:cancel;

orders:reconcile;

orders:audit.
```

### Role representa função organizacional

Exemplos:

```text
TENANT_OPERATOR;

TENANT_ADMIN;

SUPPORT_OPERATOR;

AUDITOR;

PLATFORM_OPERATOR;

WORKLOAD.
```

Scopes e roles podem coexistir.

O endpoint exige a combinação adequada.

### Workload também precisa de identidade

Workers e gateways não devem usar token de usuário.

Eles devem possuir identidade própria:

```text
client credentials;

workload identity;

service account;

mTLS
quando aplicavel.
```

---

## Mão na massa guiada

### 1. Atualizar dependências

No `apps/orderflow-api/pom.xml`, adicione:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>
        spring-boot-starter-security
    </artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>
        spring-boot-starter-oauth2-resource-server
    </artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>
        spring-security-test
    </artifactId>
    <scope>test</scope>
</dependency>
```

A segurança fica no adapter HTTP.

O domínio e a aplicação continuam sem Spring Security.

---

### 2. Criar SecurityClaims

```java
package br.com.formacao.orderflow.api.security;

public final class SecurityClaims {

    public static final String TENANT_ID =
            "tenant_id";

    public static final String ROLES =
            "roles";

    public static final String SCOPE =
            "scope";

    public static final String TOKEN_TYPE =
            "token_type";

    private SecurityClaims() {
    }
}
```

---

### 3. Criar SecurityAuthorities

```java
package br.com.formacao.orderflow.api.security;

public final class SecurityAuthorities {

    public static final String ORDERS_READ =
            "SCOPE_orders:read";

    public static final String ORDERS_WRITE =
            "SCOPE_orders:write";

    public static final String ORDERS_CANCEL =
            "SCOPE_orders:cancel";

    public static final String ORDERS_RECONCILE =
            "SCOPE_orders:reconcile";

    public static final String ORDERS_AUDIT =
            "SCOPE_orders:audit";

    public static final String ROLE_TENANT_OPERATOR =
            "ROLE_TENANT_OPERATOR";

    public static final String ROLE_TENANT_ADMIN =
            "ROLE_TENANT_ADMIN";

    public static final String ROLE_SUPPORT_OPERATOR =
            "ROLE_SUPPORT_OPERATOR";

    public static final String ROLE_AUDITOR =
            "ROLE_AUDITOR";

    public static final String ROLE_WORKLOAD =
            "ROLE_WORKLOAD";

    private SecurityAuthorities() {
    }
}
```

---

### 4. Criar contrato de claims

Arquivo:

```text
docs/security/JWT_CLAIM_CONTRACT.md
```

Claims obrigatórias:

```text
iss;

sub;

aud;

exp;

iat;

tenant_id;

scope;

roles;

token_type.
```

Valores de `token_type`:

```text
user;

workload.
```

Regras:

- `tenant_id` obrigatório para identities tenant-scoped;
- workload de plataforma pode usar tenant técnico controlado;
- `aud` deve conter OrderFlow API;
- issuer precisa ser permitido;
- token expirado falha;
- subject vazio falha;
- roles desconhecidas não concedem acesso.

---

### 5. Criar SecurityProperties

```java
package br.com.formacao.orderflow.api.security;

import java.util.Set;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
        prefix = "orderflow.security")
public record SecurityProperties(
        String issuer,
        String audience,
        Set<String> trustedAlgorithms) {

    public SecurityProperties {
        trustedAlgorithms =
                Set.copyOf(trustedAlgorithms);
    }
}
```

Não coloque secret no arquivo de configuração.

Resource Server usa chaves públicas do issuer confiável.

---

### 6. Configurar application.yml

Exemplo:

```yaml
orderflow:
  security:
    issuer: ${ORDERFLOW_SECURITY_ISSUER}
    audience: ${ORDERFLOW_SECURITY_AUDIENCE}
    trusted-algorithms:
      - RS256

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${ORDERFLOW_SECURITY_ISSUER}
```

O ambiente fornece os valores.

---

### 7. Criar JwtAudienceValidator

```java
package br.com.formacao.orderflow.api.security;

import java.util.List;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtAudienceValidator
        implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error ERROR =
            new OAuth2Error(
                    "invalid_token",
                    "Required audience is missing",
                    null);

    private final String audience;

    public JwtAudienceValidator(String audience) {
        this.audience = audience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(
            Jwt jwt) {

        List<String> audiences =
                jwt.getAudience();

        if (audiences.contains(audience)) {
            return OAuth2TokenValidatorResult
                    .success();
        }

        return OAuth2TokenValidatorResult
                .failure(ERROR);
    }
}
```

---

### 8. Criar TenantClaimValidator

```java
package br.com.formacao.orderflow.api.security;

import br.com.formacao.orderflow.domain.value.TenantId;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public final class TenantClaimValidator
        implements OAuth2TokenValidator<Jwt> {

    @Override
    public OAuth2TokenValidatorResult validate(
            Jwt jwt) {

        String tenant = jwt.getClaimAsString(
                SecurityClaims.TENANT_ID);

        try {
            new TenantId(tenant);

            return OAuth2TokenValidatorResult
                    .success();
        } catch (RuntimeException exception) {
            OAuth2Error error =
                    new OAuth2Error(
                            "invalid_token",
                            "Invalid tenant claim",
                            null);

            return OAuth2TokenValidatorResult
                    .failure(error);
        }
    }
}
```

---

### 9. Compor validadores JWT

Use:

- issuer validator;
- timestamp validator;
- audience validator;
- tenant validator;
- validator de token type.

Falha em qualquer um deles rejeita autenticação.

---

### 10. Criar OrderFlowPrincipal

```java
package br.com.formacao.orderflow.api.security;

import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Set;

public record OrderFlowPrincipal(
        String subject,
        TenantId tenantId,
        String tokenType,
        Set<String> scopes,
        Set<String> roles) {

    public OrderFlowPrincipal {
        scopes = Set.copyOf(scopes);
        roles = Set.copyOf(roles);
    }

    public boolean workload() {
        return "workload".equals(tokenType);
    }
}
```

---

### 11. Criar conversor de authentication

`OrderFlowJwtAuthenticationConverter` deve:

- ler subject;
- ler tenant;
- ler scopes;
- ler roles;
- ler token type;
- converter scopes para `SCOPE_`;
- converter roles para `ROLE_`;
- criar principal;
- rejeitar formatos inválidos;
- não confiar em authority duplicada.

---

### 12. Tratar scope em formatos possíveis

O contrato oficial usa string separada por espaço:

```text
orders:read orders:write
```

O converter pode tolerar lista apenas se documentado.

Não aceite qualquer claim arbitrária como authority.

---

### 13. Criar SecurityConfiguration

```java
package br.com.formacao.orderflow.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityProblemHandler problemHandler)
            throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/actuator/health",
                                "/actuator/info")
                        .permitAll()
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**")
                        .hasAuthority(
                                SecurityAuthorities.ORDERS_READ)
                        .anyRequest()
                        .authenticated())
                .oauth2ResourceServer(resource -> resource
                        .jwt(jwt -> {
                        })
                        .authenticationEntryPoint(
                                problemHandler)
                        .accessDeniedHandler(
                                problemHandler))
                .build();
    }
}
```

CSRF é desabilitado porque a API usa bearer token e não sessão de browser.

---

### 14. Definir matriz de autorização

Arquivo:

```text
docs/security/AUTHORIZATION_MATRIX.md
```

Matriz:

```text
POST /v1/orders
orders:write
TENANT_OPERATOR ou TENANT_ADMIN.

GET /v1/orders/**
orders:read
TENANT_OPERATOR, TENANT_ADMIN,
SUPPORT_OPERATOR ou AUDITOR.

POST cancellation
orders:cancel
TENANT_OPERATOR ou TENANT_ADMIN.

POST reconciliation
orders:reconcile
SUPPORT_OPERATOR ou PLATFORM_OPERATOR.

GET history
orders:audit
AUDITOR, SUPPORT_OPERATOR
ou TENANT_ADMIN.

callbacks internos futuros
ROLE_WORKLOAD.
```

Scope e role precisam corresponder à intenção.

---

### 15. Criar AccessPolicy

```java
package br.com.formacao.orderflow.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accessPolicy")
public final class AccessPolicy {

    public boolean canWriteOrders(
            Authentication authentication) {

        return hasAuthority(
                authentication,
                SecurityAuthorities.ORDERS_WRITE)
                && hasAnyRole(
                        authentication,
                        SecurityAuthorities
                                .ROLE_TENANT_OPERATOR,
                        SecurityAuthorities
                                .ROLE_TENANT_ADMIN);
    }

    private boolean hasAuthority(
            Authentication authentication,
            String authority) {

        return authentication
                .getAuthorities()
                .stream()
                .anyMatch(granted ->
                        granted.getAuthority()
                                .equals(authority));
    }

    private boolean hasAnyRole(
            Authentication authentication,
            String... roles) {

        var available = authentication
                .getAuthorities()
                .stream()
                .map(granted ->
                        granted.getAuthority())
                .collect(
                        java.util.stream.Collectors
                                .toSet());

        return java.util.Arrays
                .stream(roles)
                .anyMatch(available::contains);
    }
}
```

---

### 16. Proteger controller por policy

Exemplo:

```java
@PreAuthorize(
        "@accessPolicy.canWriteOrders(authentication)")
@PostMapping
public ResponseEntity<RegisterOrderResponse> register(
        @Valid @RequestBody
        RegisterOrderRequest body,
        @RequestHeader(
                name = ApiHeaders.IDEMPOTENCY_KEY)
        String idempotencyKey) {
    // fluxo do controller
}
```

A annotation expressa a policy.

Ela não substitui tenant scope nos casos de uso.

---

### 17. Criar AuthenticatedRequestContext

```java
package br.com.formacao.orderflow.api.security;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.TenantId;

public record AuthenticatedRequestContext(
        String subject,
        TenantId tenantId,
        CorrelationId correlationId,
        String tokenType) {
}
```

---

### 18. Criar AuthenticatedRequestContextResolver

O resolver deve obter o principal de:

```text
SecurityContextHolder.
```

Ele não lê tenant diretamente do header.

O correlation continua vindo do filtro.

---

### 19. Remover confiança no X-Tenant-Id

Novo comportamento:

```text
sem header:
usa claim.

header igual a claim:
aceita.

header diferente da claim:
403 TENANT_CONTEXT_MISMATCH.
```

O header pode ser removido depois.

Durante a transição, ele funciona como confirmação.

---

### 20. Atualizar controllers

Os controllers agora recebem contexto autenticado.

Exemplo:

```text
tenant:
principal.tenantId.

subject:
principal.subject.

correlation:
request context.
```

Nenhum client escolhe livremente o tenant efetivo.

---

## Proteção multi-tenant

### 21. Criar Tenant Isolation Policy

Arquivo:

```text
docs/security/TENANT_ISOLATION_POLICY.md
```

Camadas:

```text
token claim;

request context;

command;

query port;

repository key;

database key;

audit;

Outbox;

Inbox;

logs sanitizados.
```

A segurança depende de várias defesas.

---

### 22. Proteger contra IDOR

Cenário:

- token pertence ao tenant A;
- path contém order ID do tenant B.

Fluxo:

```text
query usa tenant A + order ID;

nenhum resultado;

404.
```

Não retorne:

```text
403 pedido pertence a outro tenant.
```

Isso revelaria existência.

---

### 23. Não aceitar tenant no body

DTOs de pedido não possuem:

```text
tenantId.
```

O tenant vem do principal.

Se algum contrato futuro receber tenant explícito para operação de plataforma, ele exigirá policy administrativa específica.

---

### 24. Proteger paginação e filtros

Toda query usa tenant autenticado.

Filtros de tenant enviados por query string são ignorados ou rejeitados.

---

## Workload identity

### 25. Criar Workload Identity Policy

Arquivo:

```text
docs/security/WORKLOAD_IDENTITY_POLICY.md
```

Regras:

- workload usa token próprio;
- token type `workload`;
- subject identifica serviço;
- scopes específicos;
- role `WORKLOAD`;
- audience específica;
- token curto;
- sem senha estática;
- rotação automática;
- audit de chamadas;
- nenhum token de usuário compartilhado.

---

### 26. Criar WorkloadPolicy

```java
package br.com.formacao.orderflow.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("workloadPolicy")
public final class WorkloadPolicy {

    public boolean isTrustedWorkload(
            Authentication authentication) {

        if (!(authentication.getPrincipal()
                instanceof OrderFlowPrincipal principal)) {
            return false;
        }

        return principal.workload()
                && authentication
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals(
                                        SecurityAuthorities
                                                .ROLE_WORKLOAD));
    }
}
```

---

### 27. Reservar endpoints internos

Callbacks ou endpoints administrativos futuros usam:

```text
/internal/**
```

Eles exigem workload identity.

Nesta aula, não implemente os adapters de integração.

Apenas prepare a policy.

---

### 28. Separar audience de usuário e workload

Quando o provedor de identidade permitir, use audiences distintas:

```text
orderflow-api;

orderflow-internal.
```

Isso reduz reutilização de token em destino incorreto.

---

## Auditoria de segurança

### 29. Criar SecurityAuditService

Eventos auditáveis:

- authentication failure;
- access denied;
- tenant mismatch;
- reconciliation access;
- administrative action;
- workload call;
- invalid audience;
- invalid token type.

Não registre token completo.

---

### 30. Criar modelo de audit de acesso

Campos:

- subject;
- tenant;
- action;
- endpoint;
- decision;
- reason;
- correlation;
- token type;
- occurred at.

O audit técnico pode ser separado do audit de domínio.

---

### 31. Registrar autorização negada

Access denied deve gerar:

```text
decision:
DENIED.

reason:
MISSING_SCOPE
ou
MISSING_ROLE.
```

Evite expor detalhes completos ao client.

---

### 32. Sanitizar logs de segurança

Nunca registrar:

- bearer token;
- JWT completo;
- refresh token;
- private key;
- client secret;
- authorization header;
- body sensível.

---

## Problem Details de segurança

### 33. Criar SecurityProblemHandler

Implemente:

- `AuthenticationEntryPoint`;
- `AccessDeniedHandler`.

Respostas:

```text
401 AUTHENTICATION_REQUIRED;

401 INVALID_TOKEN;

403 ACCESS_DENIED;

403 TENANT_CONTEXT_MISMATCH.
```

Sempre inclua correlation ID.

---

### 34. Diferenciar 401 e 403

Use:

```text
401:
identidade ausente ou invalida.

403:
identidade valida,
mas sem permissao.
```

Não use `404` para autenticação inválida.

O `404` continua sendo usado para recurso de outro tenant após autenticação válida.

---

### 35. Não revelar regra interna

Mensagem externa:

```text
Access is not allowed.
```

Log interno pode registrar:

```text
missing scope orders:cancel.
```

---

## OpenAPI protegido

### 36. Criar OpenApiSecurityConfiguration

Defina bearer JWT:

```java
package br.com.formacao.orderflow.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiSecurityConfiguration {

    @Bean
    OpenAPI securedOpenApi() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes(
                                "bearerAuth",
                                new SecurityScheme()
                                        .type(
                                                SecurityScheme
                                                        .Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
```

---

### 37. Documentar scopes

A documentação deve informar:

- scope necessário;
- role esperada;
- tenant derivado de claim;
- idempotency key;
- responses 401 e 403.

---

### 38. Proteger Swagger em ambientes

Opções:

- desabilitado em produção;
- protegido por scope;
- publicado como artifact estático;
- acessível apenas em rede administrativa.

Nesta aula, use proteção por `orders:read`.

---

## Testes unitários de segurança

### 39. Testar audience validator

Cenários:

- audience presente;
- audience ausente;
- audience diferente;
- múltiplos audiences.

---

### 40. Testar tenant validator

Cenários:

- claim válida;
- claim ausente;
- claim vazia;
- formato inválido;
- tamanho inválido.

---

### 41. Testar converter

Valide:

- scopes;
- roles;
- principal;
- tenant;
- token type;
- authorities duplicadas;
- subject.

---

### 42. Testar policy de acesso

Cenários:

- scope e role corretos;
- scope sem role;
- role sem scope;
- authority desconhecida;
- authentication nula;
- workload tentando endpoint de usuário.

---

## Testes HTTP com Spring Security

### 43. Testar endpoint sem token

Resultado:

```text
401.
```

O use case não é chamado.

---

### 44. Testar token inválido

Cenários:

- issuer inválido;
- audience inválido;
- expirado;
- tenant inválido;
- assinatura inválida.

Resultado:

```text
401 INVALID_TOKEN.
```

---

### 45. Testar falta de scope

Token válido sem `orders:write`.

Resultado:

```text
403 ACCESS_DENIED.
```

---

### 46. Testar falta de role

Token possui scope, mas role incompatível.

Resultado:

```text
403.
```

---

### 47. Testar registro autorizado

Token:

```text
tenant_id:
tenant-demo.

scope:
orders:write.

roles:
TENANT_OPERATOR.
```

Valide:

- `201`;
- command recebe tenant da claim;
- subject aparece no audit;
- correlation é preservada.

---

### 48. Testar mismatch de tenant

Token:

```text
tenant-a.
```

Header:

```text
X-Tenant-Id:
tenant-b.
```

Resultado:

```text
403 TENANT_CONTEXT_MISMATCH.
```

---

### 49. Testar acesso cross-tenant

Token do tenant A solicita order ID do tenant B.

Resultado:

```text
404 ORDER_NOT_FOUND.
```

O audit registra tentativa sem expor dados do tenant B.

---

### 50. Testar cancelamento autorizado

Exigir:

```text
orders:cancel;

TENANT_OPERATOR
ou TENANT_ADMIN.
```

Sem um deles, `403`.

---

### 51. Testar reconciliação

Exigir:

```text
orders:reconcile;

SUPPORT_OPERATOR
ou PLATFORM_OPERATOR.
```

Tenant operator comum não pode reconciliar.

---

### 52. Testar workload identity

Token type `workload` e role `WORKLOAD`.

Valide:

- endpoint interno permitido;
- endpoint de usuário negado quando policy assim definir;
- tenant técnico validado;
- subject auditado.

---

### 53. Testar Problem Details

Valide para `401` e `403`:

- status;
- code;
- correlation;
- instance;
- sem stack trace;
- sem token;
- content type correto.

---

### 54. Testar OpenAPI

Valide:

- bearer scheme;
- respostas 401 e 403;
- scopes documentados;
- tenant claim descrita;
- header provisório marcado como confirmação.

---

## Teste de integração

### 55. Configurar issuer de teste

Nos testes, use:

- `JwtDecoder` fake controlado;
- chave de teste;
- tokens montados;
- relógio fixo;
- audience conhecido.

Não dependa de provedor externo real.

---

### 56. Testar fluxo completo autenticado

Fluxo:

```text
token valido;

POST pedido;

persistencia;

audit de dominio;

audit de seguranca;

Outbox;

response.
```

Valide tenant e subject.

---

### 57. Testar replay autenticado

Mesmo token, key e body.

Valide:

- mesmo pedido;
- nenhum efeito duplicado;
- identidade do replay auditada;
- response consistente.

---

### 58. Testar segurança antes da transação

Token inválido deve falhar antes de:

- handler;
- transaction manager;
- repository;
- idempotency store;
- Outbox.

---

## Arquitetura e qualidade

### 59. Criar SecurityArchitectureTest

Regras:

- security depende da API, não do domínio;
- domínio não depende de Spring Security;
- aplicação não depende de Spring Security;
- controllers não leem JWT claims diretamente;
- apenas resolver e converter lidam com claims;
- policies não acessam repository;
- tenant não vem de DTO;
- tokens não aparecem em logs ou entities;
- integrations ainda não existem no módulo.

---

### 60. Criar Security Test Matrix

Arquivo:

```text
docs/security/SECURITY_TEST_MATRIX.md
```

Categorias:

- authentication;
- token validation;
- authorization;
- tenant isolation;
- IDOR;
- workload identity;
- audit;
- errors;
- OpenAPI;
- regression.

---

### 61. Criar Security Risk Register

Arquivo:

```text
docs/security/SECURITY_RISK_REGISTER.md
```

Riscos:

```text
tenant claim ausente;

audience incorreto;

scope excessivo;

role excessiva;

token em log;

header divergente;

IDOR;

swagger publico;

workload usando token de usuario;

clock skew;

chave antiga;

audit incompleto;

erro revelando detalhe interno.
```

---

### 62. Criar traceability

Arquivo:

```text
docs/security/SECURITY_TRACEABILITY.md
```

Exemplo:

```text
SEC-001 Tenant autenticado
-> JWT tenant_id
-> TenantClaimValidator
-> AuthenticatedRequestContext
-> SecurityTenantIsolationTest.

SEC-002 Cancelamento autorizado
-> orders:cancel
-> TENANT_OPERATOR
-> AccessPolicy
-> SecurityAuthorizationTest.

SEC-003 Workload identity
-> token_type workload
-> ROLE_WORKLOAD
-> WorkloadPolicy
-> SecurityWorkloadIdentityTest.
```

---

### 63. Executar testes da API

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  clean `
  test
```

---

### 64. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

---

### 65. Validar configuração externa

Confirme que:

- issuer vem do ambiente;
- audience vem do ambiente;
- nenhuma private key está no repositório;
- nenhuma senha está no YAML;
- tokens de teste são fictícios;
- logs não imprimem authorization header.

---

### 66. Criar report

Arquivo:

```text
reports/security-implementation-report.yaml
```

Exemplo:

```yaml
securityImplementation:
  module:
    orderflow-api

  authentication:
    resourceServer:
      true
    issuerValidation:
      true
    audienceValidation:
      true
    expirationValidation:
      true

  authorization:
    scopes:
      5
    roles:
      6
    protectedEndpoints:
      9

  tenantIsolation:
    claimBased:
      true
    headerTrusted:
      false
    IDORTests:
      PASS

  workloadIdentity:
    prepared:
      true

  tests:
    unit:
      19
    web:
      24
    integration:
      6
    architecture:
      1
    failures:
      0

  integrations:
    implemented:
      false

  gate:
    PASS
```

---

### 67. Criar evidence

Arquivo:

```text
contracts/security-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- issuer validation status;
- audience validation status;
- expiration validation status;
- tenant claim validation status;
- scope count;
- role count;
- protected endpoint count;
- authentication test count;
- authorization test count;
- tenant isolation test count;
- workload test count;
- audit test count;
- Problem Details test status;
- OpenAPI security status;
- token leak count;
- IDOR test status;
- architecture test status;
- integration adapters implemented;
- documentation status;
- gate status;
- timestamp.

---

### 68. Criar gate de segurança

Status:

```text
PASS;

FAIL_SECURITY_MODULE;

FAIL_RESOURCE_SERVER;

FAIL_ISSUER_VALIDATION;

FAIL_AUDIENCE_VALIDATION;

FAIL_TOKEN_TIME_VALIDATION;

FAIL_TENANT_CLAIM;

FAIL_AUTHORITY_MAPPING;

FAIL_ENDPOINT_POLICY;

FAIL_METHOD_SECURITY;

FAIL_TENANT_CONTEXT;

FAIL_IDOR_PROTECTION;

FAIL_WORKLOAD_IDENTITY;

FAIL_SECURITY_AUDIT;

FAIL_SECURITY_PROBLEM_DETAILS;

FAIL_OPENAPI_SECURITY;

FAIL_TOKEN_LEAK;

FAIL_SECURITY_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_INTEGRATION_ANTICIPATION;

INCONCLUSIVE.
```

---

### 69. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Confirme:

- token obrigatório;
- issuer validado;
- audience validado;
- tenant derivado da claim;
- scopes e roles aplicados;
- cross-tenant retorna 404;
- mismatch retorna 403;
- erros 401 e 403 padronizados;
- tokens não vazam;
- integrações não implementadas.

---

### 70. Encerrar o laboratório

Confirme:

- dependências;
- properties;
- claims;
- validators;
- converter;
- principal;
- Resource Server;
- policies;
- method security;
- tenant context autenticado;
- IDOR protection;
- workload policy;
- security audit;
- security errors;
- OpenAPI;
- unit tests;
- web tests;
- integration tests;
- architecture test;
- report;
- evidence;
- gate aprovado;
- integrações não implementadas.

---

## Entendendo o que foi feito

### A API deixou de confiar no client

O tenant agora vem de claim autenticada.

### Identidade e permissão foram separadas

Token válido não significa acesso total.

### Scopes e roles ganharam finalidade

Scopes representam capacidades.

Roles representam funções.

### IDOR ganhou defesa

Recursos continuam sendo buscados por tenant e ID.

### Workloads ganharam identidade própria

Integrações futuras não usarão token de usuário.

### Erros de segurança ficaram previsíveis

Clients recebem `401` ou `403` com correlation.

### O domínio permaneceu independente

Spring Security existe apenas no adapter HTTP.

---

## Erros comuns importantes

### Confiar no tenant do header

Claim autenticada precisa ser a autoridade.

### Usar somente role

Scope ajuda a limitar capacidade.

### Usar somente scope

Role ajuda a limitar função organizacional.

### Retornar 403 para recurso de outro tenant

Isso pode revelar existência.

### Colocar JWT no command

A aplicação deve receber tenant, subject e capacidades necessárias, não o token inteiro.

### Logar authorization header

O token pode ser reutilizado por atacante.

### Workload usar usuário técnico com senha

Prefira identidade de workload e tokens curtos.

### Security annotation no domínio

A regra técnica vaza para o modelo.

### Swagger público sem decisão

O contrato pode revelar superfície.

### Implementar provider agora

Integrações pertencem à aula 684.

---

## Comandos úteis

### Testar segurança

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  test
```

### Executar teste específico

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -Dtest=SecurityTenantIsolationTest `
  test
```

### Build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Procurar token em logs

```powershell
Get-ChildItem `
  apps/orderflow-api/src `
  -Recurse `
| Select-String `
    -Pattern `
    "Authorization|Bearer |access_token|refresh_token"
```

---

## Exercício guiado

Proteja o fluxo:

```text
cancelar pedido.
```

Inclua:

1. scope `orders:cancel`;
2. role permitida;
3. token válido;
4. tenant claim;
5. principal;
6. request context;
7. policy;
8. `@PreAuthorize`;
9. tenant mismatch;
10. cross-tenant;
11. audit;
12. `401`;
13. `403`;
14. `404`;
15. Problem Details;
16. OpenAPI;
17. teste sem token;
18. teste sem scope;
19. teste sem role;
20. teste autorizado;
21. teste IDOR;
22. evidence.

Não implemente client externo.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 682 e ponte para a aula 684 foram preservadas;
- dependências de segurança foram adicionadas;
- SecurityClaims foi criado;
- SecurityAuthorities foi criado;
- contrato de claims foi criado;
- SecurityProperties foi criado;
- issuer e audience ficaram externos;
- JwtAudienceValidator foi criado;
- TenantClaimValidator foi criado;
- validadores foram compostos;
- OrderFlowPrincipal foi criado;
- authentication converter foi criado;
- scopes foram convertidos;
- SecurityConfiguration foi criada;
- Resource Server foi configurado;
- matriz de autorização foi criada;
- AccessPolicy foi criada;
- controller foi protegido por policy;
- AuthenticatedRequestContext foi criado;
- resolver autenticado foi criado;
- confiança no header foi removida;
- mismatch de tenant retorna 403;
- controllers usam tenant autenticado;
- Tenant Isolation Policy foi criada;
- IDOR foi protegido;
- tenant não existe no body;
- paginação usa tenant autenticado;
- Workload Identity Policy foi criada;
- WorkloadPolicy foi criada;
- endpoints internos foram reservados;
- audience de workload foi discutido;
- SecurityAuditService foi criado;
- audit de acesso foi definido;
- autorização negada foi auditada;
- logs foram sanitizados;
- SecurityProblemHandler foi criado;
- 401 e 403 foram diferenciados;
- detalhes internos não vazam;
- OpenAPI Security Configuration foi criada;
- scopes foram documentados;
- Swagger foi protegido;
- audience validator foi testado;
- tenant validator foi testado;
- converter foi testado;
- policies foram testadas;
- endpoint sem token foi testado;
- token inválido foi testado;
- falta de scope foi testada;
- falta de role foi testada;
- registro autorizado foi testado;
- tenant mismatch foi testado;
- cross-tenant foi testado;
- cancelamento autorizado foi testado;
- reconciliação foi testada;
- workload identity foi testada;
- Problem Details foi testado;
- OpenAPI foi testada;
- issuer de teste foi configurado;
- fluxo autenticado foi testado;
- replay autenticado foi testado;
- segurança antes da transação foi testada;
- teste arquitetural foi criado;
- Security Test Matrix foi criada;
- Security Risk Register foi criado;
- traceability foi criada;
- build do módulo passou;
- build completo passou;
- configuração externa foi validada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- integrações não foram antecipadas.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Adicione:

```powershell
git add `
  apps/orderflow-api `
  docs/security `
  reports/security-implementation-report.yaml `
  contracts/security-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "client_secret|private_key|BEGIN PRIVATE KEY|access_token|refresh_token|Bearer ey|realIssuer|realClientId"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(security): secure OrderFlow API"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- secret real;
- private key;
- token real;
- provider client;
- circuit breaker;
- retry de integração;
- conteúdo detalhado da aula 684.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou a segurança do OrderFlow.

Você criou:

```text
OAuth2 Resource Server;

JWT validation;

issuer validation;

audience validation;

tenant claim validation;

OrderFlowPrincipal;

scope mapping;

role mapping;

endpoint policies;

method security;

authenticated tenant context;

IDOR protection;

workload identity policy;

security audit;

401 and 403 Problem Details;

OpenAPI security;

unit tests;

web tests;

integration tests;

architecture test;

report, evidence e gate.
```

A API agora autentica o chamador, deriva tenant da claim e verifica capacidades antes de executar casos de uso.

A próxima aula será:

```text
684 - M20.14 - Implementacao integracoes
```

Nela, você implementará os adapters de estoque, pagamento e fulfillment dentro do Integration Gateway, incluindo autenticação de workload, deadlines, retries, circuit breaker, mapeamento de contratos, normalização de respostas, idempotência externa e testes de contrato.

Nenhuma integração com provider foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Configurei Resource Server.
- [ ] Validei issuer.
- [ ] Validei audience.
- [ ] Validei tenant claim.
- [ ] Criei principal.
- [ ] Mapeei scopes.
- [ ] Mapeei roles.
- [ ] Protegi endpoints.
- [ ] Derivei tenant do token.
- [ ] Protegi IDOR.
- [ ] Preparei workload identity.
- [ ] Criei audit de segurança.
- [ ] Padronizei 401 e 403.
- [ ] Testei segurança.
- [ ] Preservei integrações para a aula 684.

---

## Troubleshooting adicional

### Token válido retorna 401

Revise issuer, audience, expiração e assinatura.

### Scope não vira authority

Revise o authentication converter.

### Role aparece sem prefixo

Padronize `ROLE_`.

### Tenant da claim não chega ao command

Revise AuthenticatedRequestContextResolver.

### Header diferente não falha

Adicione comparação explícita.

### Pedido de outro tenant retorna 403

A query deve resultar em 404.

### Access denied retorna HTML

Configure handlers JSON com Problem Details.

### Swagger não mostra bearer

Revise security scheme do OpenAPI.

### Teste depende de issuer externo

Use decoder ou chave de teste local.

### Quero criar client de pagamento

Essa etapa pertence à aula 684.

---

## Perguntas de revisão

1. O que é autenticação?
2. O que é autorização?
3. Token válido concede tudo?
4. O que é issuer?
5. O que é audience?
6. Por que validar expiração?
7. Qual claim informa tenant?
8. Tenant deve vir do body?
9. O que é scope?
10. O que é role?
11. Por que combinar scope e role?
12. O que é IDOR?
13. Como cross-tenant é tratado?
14. O que é workload identity?
15. Workload usa token de usuário?
16. O que significa 401?
17. O que significa 403?
18. Quando usar 404?
19. O que não deve ser logado?
20. Onde Spring Security deve existir?
21. O domínio conhece JWT?
22. O que a aula 684 fará?
23. O que não foi implementado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Provar identidade.
2. Verificar permissão.
3. Não.
4. Emissor confiável.
5. Destino esperado do token.
6. Para rejeitar token vencido.
7. `tenant_id`.
8. Não.
9. Capacidade concedida.
10. Função organizacional.
11. Para reduzir privilégio.
12. Acesso inseguro por identificador.
13. Busca por tenant e 404.
14. Identidade própria de serviço.
15. Não.
16. Identidade ausente ou inválida.
17. Identidade válida sem permissão.
18. Recurso não visível no tenant.
19. Tokens, secrets e authorization header.
20. No adapter HTTP.
21. Não.
22. Implementar integrações.
23. Provider clients e resiliência externa.
24. Implementação integrações.
25. Tenant e permissão vêm de contexto autenticado.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 683 - M20.13 - Implementacao seguranca

- Continuei após Implementação API REST.
- Adicionei dependências de segurança.
- Criei SecurityClaims.
- Criei SecurityAuthorities.
- Criei contrato de claims JWT.
- Criei SecurityProperties.
- Externalizei issuer e audience.
- Criei JwtAudienceValidator.
- Criei TenantClaimValidator.
- Compus validadores JWT.
- Criei OrderFlowPrincipal.
- Criei authentication converter.
- Mapeei scopes.
- Mapeei roles.
- Criei SecurityConfiguration.
- Configurei OAuth2 Resource Server.
- Criei matriz de autorização.
- Criei AccessPolicy.
- Protegi controllers com policy.
- Criei AuthenticatedRequestContext.
- Criei resolver autenticado.
- Removi confiança no tenant do header.
- Tratei mismatch de tenant.
- Atualizei controllers.
- Criei Tenant Isolation Policy.
- Protegi contra IDOR.
- Removi tenant dos bodies.
- Protegi paginação e filtros.
- Criei Workload Identity Policy.
- Criei WorkloadPolicy.
- Reservei endpoints internos.
- Analisei audience de workload.
- Criei SecurityAuditService.
- Defini audit de acesso.
- Auditei autorização negada.
- Sanitizei logs.
- Criei SecurityProblemHandler.
- Diferenciei 401 e 403.
- Evitei vazamento de regra interna.
- Criei OpenApiSecurityConfiguration.
- Documentei scopes e roles.
- Protegi Swagger.
- Testei audience.
- Testei tenant claim.
- Testei converter.
- Testei policies.
- Testei endpoint sem token.
- Testei token inválido.
- Testei falta de scope.
- Testei falta de role.
- Testei registro autorizado.
- Testei tenant mismatch.
- Testei cross-tenant.
- Testei cancelamento.
- Testei reconciliação.
- Testei workload identity.
- Testei Problem Details.
- Testei OpenAPI.
- Configurei issuer de teste.
- Testei fluxo autenticado.
- Testei replay autenticado.
- Testei segurança antes da transação.
- Criei teste arquitetural.
- Criei Security Test Matrix.
- Criei Security Risk Register.
- Criei Security Traceability.
- Executei build do módulo.
- Executei build completo.
- Validei configuração externa.
- Criei report, evidence e gate.
- Não antecipei integrações.
- Próxima aula: Implementacao integracoes.
```

---

## Referência técnica curta

- Authentication.
- Authorization.
- OAuth2 Resource Server.
- JWT.
- Issuer.
- Audience.
- Scope.
- Role.
- Principal.
- Tenant Claim.
- IDOR.
- Workload Identity.
- Method Security.
- Access Policy.
- Security Audit.
- AuthenticationEntryPoint.
- AccessDeniedHandler.
- Spring Security Test.

Regra final:

```text
A implementação de segurança do OrderFlow deve remover a confiança em tenant escolhido pelo client e derivar identidade, tenant e authorities de um JWT validado: Spring Security Resource Server valida assinatura, issuer, audience, expiração, subject, token type e tenant_id, OrderFlowJwtAuthenticationConverter transforma scopes em SCOPE_ e roles em ROLE_, OrderFlowPrincipal carrega subject, TenantId, token type, scopes e roles, AuthenticatedRequestContextResolver obtém o principal autenticado e correlation, X-Tenant-Id deixa de ser autoridade e mismatch retorna 403, commands e queries continuam recebendo TenantId autenticado, cross-tenant usa tenant + order e retorna 404 para evitar IDOR, AccessPolicy combina scope e role para registrar, consultar, cancelar, reconciliar e auditar, endpoints internos futuros exigem token_type workload e ROLE_WORKLOAD, tokens de usuário não são usados por serviços, SecurityAuditService registra decisões sem armazenar bearer token, SecurityProblemHandler devolve 401 para identidade ausente ou inválida e 403 para acesso negado, OpenAPI documenta bearer JWT, scopes, roles e claims, testes cobrem issuer, audience, tenant, converter, policies, mismatch, IDOR, workload, audit e Problem Details, e ArchUnit impede Spring Security no domínio e na aplicação; o gate termina com validators, principal, converter, policies, tenant isolation, workload identity, audit, errors, OpenAPI, tests, report e evidence aprovados, enquanto clients de estoque, pagamento e fulfillment, deadlines, retries, circuit breaker, normalização e contratos externos permanecem reservados para a aula 684.
```
