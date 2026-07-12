# 419 - M15.09 - SecurityFilterChain

## Apresentação da aula

Na aula 418, você desmontou a arquitetura do Spring Security antes de configurar a aplicação.

O fluxo estudado foi:

```text
HTTP request;

DelegatingFilterProxy;

FilterChainProxy;

SecurityFilterChain;

mecanismo de autenticação;

AuthenticationManager;

AuthenticationProvider;

SecurityContext;

AuthorizationManager;

controller.
```

Você também diferenciou:

- autenticação e autorização;
- token não autenticado e autenticado;
- principal, credentials e authorities;
- `401 Unauthorized` e `403 Forbidden`;
- contexto stateful e stateless;
- usuário anônimo e identidade real;
- request cache web e contrato de API.

Aquela aula respondeu:

```text
quais componentes
participam das decisões de segurança
dentro do framework?
```

Agora a aplicação receberá sua primeira configuração de segurança em runtime.

A pergunta central será:

```text
como ativar Spring Security
sem criar um login prematuro
e sem deixar endpoints novos
publicamente acessíveis por acidente?
```

A resposta será construída com:

```text
deny by default;

endpoints públicos explícitos;

duas SecurityFilterChains;

sessão stateless;

request cache desativado;

form login desativado;

HTTP Basic desativado;

CSRF decidido pela arquitetura atual;

CORS integrado;

security headers migrados;

Problem Details para 401 e 403;

testes de acesso.
```

A aplicação ficará protegida antes mesmo de possuir um usuário.

Depois desta aula:

```text
GET /api/v2/service-orders
sem autenticação:
401.

GET /api/v2/service-orders
com identidade de teste:
403.

GET /livez:
200.

GET /v3/api-docs:
200.

origin CORS aprovada:
preflight permitido.

path novo não declarado:
negado.
```

Por que uma identidade de teste ainda recebe `403`?

Porque a API chain terminará com:

```text
anyRequest().denyAll().
```

A aula 420 criará o primeiro usuário em memória e substituirá a negação absoluta por uma regra autenticada nos endpoints selecionados.

Hoje não haverá mecanismo de login.

Não serão criados:

- username de aplicação;
- password de aplicação;
- `UserDetailsService` real;
- usuário em memória;
- usuário no banco;
- form login;
- HTTP Basic;
- JWT;
- role de negócio.

O objetivo desta aula é construir a fronteira.

Somente depois será criada uma porta de entrada autenticada.

Essa ordem evita adicionar login enquanto endpoints continuam públicos.

O projeto também migrará os security headers da aula 416.

Os arquivos customizados:

```text
SecurityHeadersFilter;

SecurityHeadersConfiguration
```

serão removidos.

A classe:

```text
SecurityHeadersProperties
```

será preservada.

A policy passará a ser aplicada pela DSL do Spring Security dentro da chain de `/api/**`.

Benefícios:

- ordem gerenciada;
- menor risco de duplicação;
- configuração próxima da autorização;
- testes integrados.

A política CORS da aula 414 continuará definida no Spring MVC.

A API chain utilizará:

```java
cors(withDefaults())
```

para integrar o processamento CORS antes das decisões de segurança.

A decisão de CSRF da aula 415 também será aplicada.

A arquitetura atual é:

```text
stateless;

sem cookie de autenticação;

sem sessão autenticada;

sem HTTP Basic;

sem bearer token ainda.
```

Por isso, CSRF será desabilitado nesta baseline.

Essa decisão será revisada se surgir:

- sessão;
- cookie autenticado;
- JWT em cookie;
- credencial automática do navegador.

Desabilitar CSRF aqui não cria uma regra universal para APIs.

O tratamento de erros de segurança será conectado ao catálogo de Problem Details já existente.

Em vez de escrever JSON manualmente dentro do filtro, o `AuthenticationEntryPoint` e o `AccessDeniedHandler` delegarão ao `HandlerExceptionResolver`.

Assim, a aplicação preservará:

- `application/problem+json`;
- `code` estável;
- correlation ID;
- títulos consistentes;
- ausência de stack trace;
- um único padrão de erro.

A próxima aula será:

```text
420 - M15.10 - Login basico usuario em memoria
```

Nela, a chain receberá o primeiro mecanismo de autenticação didático.

---

## Onde estamos na formação

A sequência atual é:

```text
417:
Hash de senha BCrypt Argon2 conceitual.

418:
Spring Security arquitetura.

419:
SecurityFilterChain.

420:
Login basico usuario em memoria.

421:
Usuario no banco UserDetailsService.

422:
JWT fundamentos.
```

A aula 418 respondeu:

```text
como o framework organiza
autenticação, contexto e autorização?
```

A aula 419 responderá:

```text
como transformar essa arquitetura
em uma configuração segura
sem inventar usuários antes da hora?
```

Nesta aula:

```text
starter de runtime:
sim.

SecurityFilterChain:
sim.

deny by default:
sim.

paths públicos:
sim.

401 Problem Details:
sim.

403 Problem Details:
sim.

stateless:
sim.

NullRequestCache:
sim.

CORS:
integrado.

CSRF:
desabilitado por decisão atual.

security headers:
migrados.

login:
não.

usuário:
não.

password:
não.

JWT:
não.
```

A regra central será:

```text
todo endpoint começa negado;

acesso público ou autenticado
precisa ser declarado
e testado explicitamente.
```

---

## Objetivo prático

Ao final da aula, a aplicação terá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── security
        ├── ApiSecurityConfiguration.java
        ├── ApiAuthenticationEntryPoint.java
        ├── ApiAccessDeniedHandler.java
        ├── ApiAuthenticationRequiredException.java
        └── ApiForbiddenException.java
```

O projeto preservará:

```text
configuration/web/
├── WebCorsProperties.java
├── WebCorsConfiguration.java
└── SecurityHeadersProperties.java
```

Arquivos removidos:

```text
SecurityHeadersFilter.java;

SecurityHeadersConfiguration.java.
```

Teste:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── security
        └── ApiSecurityConfigurationTest.java
```

Dependências:

```text
spring-boot-starter-security:
runtime.

spring-security-test:
test.
```

A configuração utilizará duas chains:

```text
Order 1:
    /api/**.

Order 2:
    infraestrutura e fallback.
```

A API chain:

```text
CORS;

stateless;

sem request cache;

sem login;

sem Basic;

sem logout;

CSRF desabilitado;

headers da API;

preflight público;

qualquer outra request negada.
```

A fallback chain:

```text
health público;

OpenAPI público no laboratório;

Swagger público no laboratório;

Actuator health/info público;

dispatch de erro permitido;

qualquer outro path negado.
```

Você irá:

1. adicionar o starter;
2. adicionar suporte de testes;
3. evitar o usuário default do Boot;
4. criar exceptions de segurança;
5. criar entry point;
6. criar denied handler;
7. integrar o resolver MVC;
8. estender o catálogo de Problem Details;
9. criar a API chain;
10. criar a fallback chain;
11. migrar headers;
12. integrar CORS;
13. aplicar decisão CSRF;
14. configurar stateless;
15. configurar request cache;
16. negar por default;
17. testar paths públicos;
18. testar `401`;
19. testar `403`;
20. executar o gate.

---

## Conceito essencial

### O starter muda o runtime

Adicionar:

```text
spring-boot-starter-security
```

coloca Spring Security no classpath da aplicação.

Sem uma configuração própria, o Spring Boot protege toda a aplicação e fornece um usuário default com password gerada para desenvolvimento.

A criação de um bean `SecurityFilterChain` substitui a configuração web default.

Porém, isso não desativa automaticamente a criação do `UserDetailsService` default.

Para evitar um usuário invisível nesta aula, será fornecido temporariamente um bean `AuthenticationManager` que não autentica nenhum mecanismo.

Na aula 420, ele será substituído pelo fluxo de usuário em memória.

A aplicação não deve iniciar exibindo:

```text
Using generated security password
```

e fingir que esse usuário faz parte da arquitetura planejada.

---

### Deny by default

Uma regra permissiva costuma assumir:

```text
se eu não restringi,
está liberado.
```

A regra segura assume:

```text
se eu não declarei,
está negado.
```

Exemplo:

```java
.anyRequest()
.denyAll();
```

Quando um desenvolvedor cria:

```text
/api/v2/admin/export
```

o endpoint não fica público por acidente.

Ele será negado até uma decisão explícita.

Deny by default reduz falhas de configuração e Broken Access Control.

---

### PermitAll também precisa de critério

`permitAll` significa:

```text
a request não exige
uma identidade autenticada.
```

Ele não significa:

- endpoint sem risco;
- endpoint sem rate limit;
- endpoint sem validation;
- endpoint sem logging;
- endpoint apropriado para produção pública.

Na baseline local, serão públicos:

```text
/livez;

/readyz;

/v3/api-docs/**;

/swagger-ui/**;

/swagger-ui.html;

/actuator/health/**;

/actuator/info.
```

Swagger e OpenAPI estão públicos apenas no laboratório atual.

Antes de ambiente real, será necessário decidir:

- desabilitar;
- restringir por rede;
- exigir autenticação;
- publicar documentação separada.

---

### Uma chain por fronteira

A API possui necessidades diferentes da infraestrutura.

`/api/**` precisa de:

- CORS;
- CSP restrita;
- no-store;
- resposta JSON;
- futura autenticação;
- futura autorização.

Swagger e health possuem outras necessidades.

Separar chains permite:

```text
policy específica;

matching claro;

ordem explícita;

menos exceções dentro da mesma chain.
```

A chain mais específica deve possuir:

```java
@Order(1)
```

e:

```java
securityMatcher("/api/**");
```

A fallback vem depois.

A primeira chain correspondente processa a request.

---

### Não ignorar paths pelo WebSecurityCustomizer

Existe diferença entre:

```text
ignorar segurança;

permitir dentro da chain.
```

Quando um path é completamente ignorado, ele não recebe os filtros do Spring Security.

Isso pode remover:

- headers;
- contexto;
- firewall;
- observabilidade de segurança;
- comportamento consistente.

Para endpoints HTTP da aplicação, prefira:

```text
permitAll.
```

Use exclusão completa somente quando houver uma razão técnica comprovada.

---

### Stateless

A policy:

```java
SessionCreationPolicy.STATELESS
```

informa que o Spring Security não deve criar ou usar `HttpSession` para persistir autenticação.

Isso não significa:

```text
nenhuma parte da aplicação
pode criar sessão.
```

Outras bibliotecas ou controllers ainda poderiam criar.

Os testes precisam verificar ausência de `JSESSIONID` nos fluxos de segurança.

Quando HTTP Basic ou bearer forem usados, a identidade será reconstruída em cada request.

Quando form login e sessão forem estudados, a policy poderá mudar para a chain correspondente.

---

### NullRequestCache

O request cache é útil em aplicações web com redirecionamento para login.

Uma API prefere:

```text
401;

cliente autentica;

cliente repete a request.
```

Configuração:

```java
.requestCache(
        cache ->
                cache.requestCache(
                        new NullRequestCache()
                )
)
```

Isso evita sessão criada apenas para guardar uma request original.

---

### Form login e HTTP Basic desativados

Adicionar o starter pode ativar defaults quando não existe configuração explícita.

Nesta aula:

```java
.formLogin(
        AbstractHttpConfigurer::disable
)

.httpBasic(
        AbstractHttpConfigurer::disable
)
```

Motivos:

- login pertence à aula 420;
- não queremos página HTML;
- não queremos challenge Basic ainda;
- não queremos usuário default;
- os testes precisam observar `401` Problem Details.

Logout e remember-me também serão desabilitados porque não existe sessão autenticada.

---

### CSRF por arquitetura

A decisão da aula 415 será transformada em código:

```java
.csrf(
        AbstractHttpConfigurer::disable
)
```

Justificativa atual:

```text
nenhum cookie autentica a API;

nenhuma sessão autenticada existe;

nenhum browser anexa autoridade de usuário.
```

A decisão precisa ser revisada quando a arquitetura mudar.

O código será acompanhado por comentário curto apontando para:

```text
docs/security/M15_CSRF_DECISION.md
```

Comentários longos no Java seriam difíceis de manter.

---

### CORS antes da segurança

Preflight normalmente não contém credentials de sessão.

Se Spring Security tentar autorizar antes de processar CORS, a request pode ser rejeitada incorretamente.

Configuração:

```java
.cors(withDefaults())
```

A policy continua definida no Spring MVC. Também será permitido:

```java
.requestMatchers(
        CorsUtils::isPreFlightRequest
)
.permitAll();
```

O preflight não executa o controller nem o caso de uso.

A request real continuará sujeita à segurança.

---

### 401 é início de autenticação

Quando uma request anônima tenta acessar uma regra negada ou protegida, o `ExceptionTranslationFilter` decide iniciar autenticação.

A integração utiliza:

```text
ApiAuthenticationEntryPoint.
```

Resultado:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json
```

Código:

```text
authentication_required.
```

A response não deve redirecionar, retornar HTML ou expor detalhes internos.

---

### 403 é acesso negado

Uma identidade autenticada de teste ainda não possui acesso porque a API está em deny-all.

Resultado:

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json
```

Código:

```text
access_denied.
```

A diferença prova que existe identidade, mas ainda não há policy que a autorize.

---

### HandlerExceptionResolver preserva o contrato

Filtros executam antes do controller.

Uma exception lançada no filtro não passa automaticamente pelos mesmos caminhos de um controller.

O entry point e o denied handler usarão:

```text
HandlerExceptionResolver.
```

Fluxo:

```text
security exception;

entry point ou denied handler;

exception da aplicação;

resolver MVC;

GlobalExceptionHandler;

Problem Details.
```

Isso evita duplicar serialização JSON e preserva o `GlobalExceptionHandler` como catálogo público.

---

### Security headers na DSL

A aula 416 criou um filtro didático.

Agora a API chain utilizará o suporte oficial.

Configuração:

```text
defaultsDisabled;

content type options;

frame deny;

CSP;

referrer policy;

permissions policy;

X-XSS-Protection 0;

cache control;

HSTS condicionado.
```

A policy continua vindo de:

```text
SecurityHeadersProperties.
```

A migração preserva configuração por ambiente e inclui `no-store`.

---

### Headers da fallback chain

A fallback chain utilizará os defaults seguros do Spring Security.

Ela não receberá a CSP estrita da API.

Isso preserva Swagger UI.

HSTS continuará dependendo de HTTPS.

A configuração específica de Swagger será revisada antes de qualquer exposição real.

---

## Mão na massa guiada

### 1. Atualizar o pom.xml

Adicione em runtime:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Adicione em testes:

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

Remova dependencies explícitas de teste que agora chegam pelo starter quando ficarem redundantes:

```text
spring-security-core;

spring-security-web;

spring-security-crypto.
```

Preserve Bouncy Castle em test scope para o laboratório Argon2id.

Valide:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security"
```

---

### 2. Remover o filtro didático de headers

Remova:

```text
SecurityHeadersFilter.java;

SecurityHeadersConfiguration.java.
```

Preserve:

```text
SecurityHeadersProperties.java.
```

Remova ou reescreva o teste antigo para não validar uma classe que deixou de existir.

A nova suíte da chain validará os mesmos headers.

---

### 3. Criar exceptions públicas internas

`ApiAuthenticationRequiredException.java`:

```java
package br.com.formacao.backend.configuration.security;

public final class
        ApiAuthenticationRequiredException
        extends RuntimeException {

    public ApiAuthenticationRequiredException() {
        super(
                "Authentication is required"
        );
    }
}
```

`ApiForbiddenException.java`:

```java
package br.com.formacao.backend.configuration.security;

public final class ApiForbiddenException
        extends RuntimeException {

    public ApiForbiddenException() {
        super(
                "Access is denied"
        );
    }
}
```

As mensagens são genéricas.

A exception original não será exposta ao cliente.

---

### 4. Criar ApiAuthenticationEntryPoint

```java
package br.com.formacao.backend.configuration.security;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation
        .Qualifier;
import org.springframework.security.core
        .AuthenticationException;
import org.springframework.security.web
        .AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet
        .HandlerExceptionResolver;

@Component
public class ApiAuthenticationEntryPoint
        implements AuthenticationEntryPoint {

    private final HandlerExceptionResolver resolver;

    public ApiAuthenticationEntryPoint(
            @Qualifier("handlerExceptionResolver")
            HandlerExceptionResolver resolver
    ) {
        this.resolver = resolver;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException, ServletException {

        resolver.resolveException(
                request,
                response,
                null,
                new ApiAuthenticationRequiredException()
        );
    }
}
```

Não inclua `exception.getMessage()` no contrato público.

---

### 5. Criar ApiAccessDeniedHandler

```java
package br.com.formacao.backend.configuration.security;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation
        .Qualifier;
import org.springframework.security.access
        .AccessDeniedException;
import org.springframework.security.web.access
        .AccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet
        .HandlerExceptionResolver;

@Component
public class ApiAccessDeniedHandler
        implements AccessDeniedHandler {

    private final HandlerExceptionResolver resolver;

    public ApiAccessDeniedHandler(
            @Qualifier("handlerExceptionResolver")
            HandlerExceptionResolver resolver
    ) {
        this.resolver = resolver;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException exception
    ) throws IOException, ServletException {

        resolver.resolveException(
                request,
                response,
                null,
                new ApiForbiddenException()
        );
    }
}
```

---

### 6. Atualizar GlobalExceptionHandler

Adicione:

```java
@ExceptionHandler(
        ApiAuthenticationRequiredException.class
)
ResponseEntity<ProblemDetail>
handleAuthenticationRequired(
        ApiAuthenticationRequiredException exception,
        HttpServletRequest request
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required."
            );

    problem.setTitle(
            "Authentication required"
    );

    problem.setType(
            URI.create(
                    "urn:problem:authentication-required"
            )
    );

    problem.setProperty(
            "code",
            "authentication_required"
    );

    addCorrelationId(
            problem,
            request
    );

    return ResponseEntity
            .status(
                    HttpStatus.UNAUTHORIZED
            )
            .contentType(
                    MediaType.APPLICATION_PROBLEM_JSON
            )
            .body(problem);
}
```

E:

```java
@ExceptionHandler(
        ApiForbiddenException.class
)
ResponseEntity<ProblemDetail>
handleForbidden(
        ApiForbiddenException exception,
        HttpServletRequest request
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.FORBIDDEN,
                    "The current identity cannot access this resource."
            );

    problem.setTitle(
            "Access denied"
    );

    problem.setType(
            URI.create(
                    "urn:problem:access-denied"
            )
    );

    problem.setProperty(
            "code",
            "access_denied"
    );

    addCorrelationId(
            problem,
            request
    );

    return ResponseEntity
            .status(
                    HttpStatus.FORBIDDEN
            )
            .contentType(
                    MediaType.APPLICATION_PROBLEM_JSON
            )
            .body(problem);
}
```

Reutilize o helper de correlation ID já existente.

---

### 7. Criar ApiSecurityConfiguration

Imports principais:

```java
package br.com.formacao.backend.configuration.security;

import static org.springframework.security.config
        .Customizer.withDefaults;

import jakarta.servlet.DispatcherType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication
        .AuthenticationManager;
import org.springframework.security.authentication
        .ProviderNotFoundException;
import org.springframework.security.config.annotation.web
        .builders.HttpSecurity;
import org.springframework.security.config.annotation.web
        .configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http
        .SessionCreationPolicy;
import org.springframework.security.web
        .SecurityFilterChain;
import org.springframework.security.web.header.writers
        .ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers
        .XXssProtectionHeaderWriter;
import org.springframework.security.web.savedrequest
        .NullRequestCache;
import org.springframework.web.cors.CorsUtils;
```

Também injete:

```text
SecurityHeadersProperties;

ApiAuthenticationEntryPoint;

ApiAccessDeniedHandler.
```

---

### 8. Criar AuthenticationManager temporário

```java
@Bean
AuthenticationManager
unconfiguredAuthenticationManager() {
    return authentication -> {
        throw new ProviderNotFoundException(
                "No authentication mechanism is configured"
        );
    };
}
```

Objetivos:

- impedir o usuário gerado pelo Boot;
- tornar explícito que ainda não existe login;
- evitar credencial oculta de desenvolvimento.

Esse bean será removido na aula 420.

A mensagem nunca será exposta ao cliente.

---

### 9. Criar a API chain

```java
@Bean
@Order(1)
SecurityFilterChain apiSecurityFilterChain(

        HttpSecurity http,

        SecurityHeadersProperties
                securityHeaders,

        ApiAuthenticationEntryPoint
                authenticationEntryPoint,

        ApiAccessDeniedHandler
                accessDeniedHandler

) throws Exception {

    http.securityMatcher(
            "/api/**"
    );

    http.cors(
            withDefaults()
    );

    http.csrf(
            AbstractHttpConfigurer::disable
    );

    http.sessionManagement(
            session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
    );

    http.requestCache(
            cache ->
                    cache.requestCache(
                            new NullRequestCache()
                    )
    );

    http.formLogin(
            AbstractHttpConfigurer::disable
    );

    http.httpBasic(
            AbstractHttpConfigurer::disable
    );

    http.logout(
            AbstractHttpConfigurer::disable
    );

    http.rememberMe(
            AbstractHttpConfigurer::disable
    );

    http.exceptionHandling(
            exceptions ->
                    exceptions
                            .authenticationEntryPoint(
                                    authenticationEntryPoint
                            )
                            .accessDeniedHandler(
                                    accessDeniedHandler
                            )
    );

    http.authorizeHttpRequests(
            authorization ->
                    authorization
                            .requestMatchers(
                                    CorsUtils
                                            ::isPreFlightRequest
                            )
                            .permitAll()
                            .anyRequest()
                            .denyAll()
    );

    configureApiHeaders(
            http,
            securityHeaders
    );

    return http.build();
}
```

---

### 10. Migrar security headers

Crie um método privado:

```java
private void configureApiHeaders(

        HttpSecurity http,

        SecurityHeadersProperties properties

) throws Exception {

    http.headers(
            headers ->
                    headers
                            .defaultsDisabled()
                            .contentTypeOptions(
                                    withDefaults()
                            )
                            .frameOptions(
                                    frame ->
                                            frame.deny()
                            )
                            .contentSecurityPolicy(
                                    csp ->
                                            csp.policyDirectives(
                                                    properties
                                                            .getContentSecurityPolicy()
                                            )
                            )
                            .referrerPolicy(
                                    referrer ->
                                            referrer.policy(
                                                    ReferrerPolicyHeaderWriter
                                                            .ReferrerPolicy
                                                            .NO_REFERRER
                                            )
                            )
                            .permissionsPolicy(
                                    permissions ->
                                            permissions.policy(
                                                    properties
                                                            .getPermissionsPolicy()
                                            )
                            )
                            .xssProtection(
                                    xss ->
                                            xss.headerValue(
                                                    XXssProtectionHeaderWriter
                                                            .HeaderValue
                                                            .DISABLED
                                            )
                            )
                            .cacheControl(
                                    withDefaults()
                            )
                            .httpStrictTransportSecurity(
                                    hsts ->
                                            hsts
                                                    .requestMatcher(
                                                            request ->
                                                                    properties
                                                                            .isHstsEnabled()
                                                                    && request
                                                                            .isSecure()
                                                    )
                                                    .maxAgeInSeconds(
                                                            properties
                                                                    .getHstsMaxAge()
                                                                    .toSeconds()
                                                    )
                                                    .includeSubDomains(
                                                            properties
                                                                    .isHstsIncludeSubDomains()
                                                    )
                                                    .preload(
                                                            properties
                                                                    .isHstsPreload()
                                                    )
                            )
    );
}
```

O método continua configurando headers pela DSL oficial.

---

### 11. Criar a fallback chain

```java
@Bean
@Order(2)
SecurityFilterChain infrastructureSecurityFilterChain(

        HttpSecurity http,

        ApiAuthenticationEntryPoint
                authenticationEntryPoint,

        ApiAccessDeniedHandler
                accessDeniedHandler

) throws Exception {

    http.cors(
            AbstractHttpConfigurer::disable
    );

    http.csrf(
            AbstractHttpConfigurer::disable
    );

    http.sessionManagement(
            session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
    );

    http.requestCache(
            cache ->
                    cache.requestCache(
                            new NullRequestCache()
                    )
    );

    http.formLogin(
            AbstractHttpConfigurer::disable
    );

    http.httpBasic(
            AbstractHttpConfigurer::disable
    );

    http.logout(
            AbstractHttpConfigurer::disable
    );

    http.rememberMe(
            AbstractHttpConfigurer::disable
    );

    http.exceptionHandling(
            exceptions ->
                    exceptions
                            .authenticationEntryPoint(
                                    authenticationEntryPoint
                            )
                            .accessDeniedHandler(
                                    accessDeniedHandler
                            )
    );

    http.authorizeHttpRequests(
            authorization ->
                    authorization
                            .dispatcherTypeMatchers(
                                    DispatcherType.ERROR
                            )
                            .permitAll()
                            .requestMatchers(
                                    "/livez",
                                    "/readyz",
                                    "/v3/api-docs/**",
                                    "/swagger-ui/**",
                                    "/swagger-ui.html",
                                    "/actuator/health/**",
                                    "/actuator/info"
                            )
                            .permitAll()
                            .anyRequest()
                            .denyAll()
    );

    return http.build();
}
```

Os headers defaults do Spring Security permanecem nessa chain.

---

### 12. Criar ApiSecurityConfigurationTest

Use o contexto real:

```java
package br.com.formacao.backend.configuration.security;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web
        .servlet.request
        .SecurityMockMvcRequestPostProcessors
        .user;
import static org.springframework.test.web.servlet
        .request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet
        .request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context
        .SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure
        .AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context
        .TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
```

Anotações:

```java
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
        properties = {
                "app.web.cors.enabled=true",
                """
                app.web.cors.allowed-origins=\
                http://localhost:5173
                """
        }
)
class ApiSecurityConfigurationTest {
}
```

---

### 13. Testar endpoint público

```java
@Test
void shouldPermitLiveness() throws Exception {
    mockMvc.perform(
            get("/livez")
    )
    .andExpect(
            status().isOk()
    );
}
```

Adicione teste para:

```text
/v3/api-docs.
```

Não valide apenas Swagger UI visualmente.

---

### 14. Testar 401

```java
@Test
void shouldReturnProblemDetailsForAnonymousApiRequest()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/v2/service-orders"
            )
            .header(
                    "X-Correlation-Id",
                    "security-401-test"
            )
    )
    .andExpect(
            status().isUnauthorized()
    )
    .andExpect(
            content().contentType(
                    "application/problem+json"
            )
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "authentication_required"
                    )
    )
    .andExpect(
            jsonPath("$.status")
                    .value(401)
    )
    .andExpect(
            header().string(
                    "X-Content-Type-Options",
                    "nosniff"
            )
    )
    .andExpect(
            header().string(
                    "Content-Security-Policy",
                    containsString(
                            "default-src 'none'"
                    )
            )
    )
    .andExpect(
            header().doesNotExist(
                    HttpHeaders.LOCATION
            )
    )
    .andExpect(
            header().doesNotExist(
                    HttpHeaders.SET_COOKIE
            )
    );
}
```

A response não redireciona e não cria sessão.

---

### 15. Testar 403

```java
@Test
void shouldReturnProblemDetailsForAuthenticatedButDenied()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/v2/service-orders"
            )
            .with(
                    user(
                            "operator"
                    )
                    .authorities(
                            () ->
                                    "service-order:read"
                    )
            )
    )
    .andExpect(
            status().isForbidden()
    )
    .andExpect(
            content().contentType(
                    "application/problem+json"
            )
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "access_denied"
                    )
    )
    .andExpect(
            jsonPath("$.status")
                    .value(403)
    );
}
```

A identidade é criada pelo suporte de teste.

Nenhuma senha foi autenticada.

Esse teste valida autorização e exception translation, não o login.

---

### 16. Testar CORS

```java
@Test
void shouldPermitConfiguredPreflight()
        throws Exception {

    mockMvc.perform(
            options(
                    "/api/v2/service-orders"
            )
            .header(
                    HttpHeaders.ORIGIN,
                    "http://localhost:5173"
            )
            .header(
                    HttpHeaders
                            .ACCESS_CONTROL_REQUEST_METHOD,
                    "POST"
            )
            .header(
                    HttpHeaders
                            .ACCESS_CONTROL_REQUEST_HEADERS,
                    "content-type,x-client-id"
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            header().string(
                    HttpHeaders
                            .ACCESS_CONTROL_ALLOW_ORIGIN,
                    "http://localhost:5173"
            )
    );
}
```

Adicione o cenário de origin rejeitada.

A request real continuará retornando `401` ou `403`.

---

### 17. Testar deny by default

Escolha um path inexistente fora das allowlists:

```java
@Test
void shouldDenyUnknownPath()
        throws Exception {

    mockMvc.perform(
            get(
                    "/internal/new-endpoint"
            )
    )
    .andExpect(
            status().isUnauthorized()
    );
}
```

O resultado não será `404` para uma request anônima.

A segurança nega antes de revelar a existência do recurso.

Com identidade de teste:

```text
403.
```

---

### 18. Testar Swagger sem CSP da API

```java
@Test
void shouldKeepApiDocsOutsideStrictApiCsp()
        throws Exception {

    mockMvc.perform(
            get(
                    "/v3/api-docs"
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            header().doesNotExist(
                    "Content-Security-Policy"
            )
    );
}
```

Os headers defaults da fallback chain ainda podem aparecer.

A CSP específica de `/api/**` não deve aparecer.

---

### 19. Testar ausência de usuário default

Injete:

```java
@Autowired
ApplicationContext context;
```

Teste:

```java
@Test
void shouldNotCreateDefaultUserDetailsService() {
    assertThat(
            context.getBeansOfType(
                    UserDetailsService.class
            )
    )
    .isEmpty();
}
```

Também observe os logs.

Não deve existir password gerada automaticamente.

---

### 20. Atualizar os testes existentes

Testes de controller que antes chamavam `/api/**` anonimamente agora receberão `401`.

Existem duas estratégias:

`Teste de contrato de segurança`

```text
mantém anonymous
e espera 401.
```

`Teste funcional de controller`

```java
.with(
        user("test-user")
)
```

Porém, enquanto a API chain usa `denyAll`, até o usuário de teste recebe `403`.

Portanto, nesta aula, os testes funcionais existentes podem:

- importar uma chain de teste específica;
- desabilitar filtros somente em testes não voltados à segurança;
- ser ajustados para a nova fronteira na aula 420.

A escolha recomendada é:

```text
não desabilitar filtros
na suíte de integração principal;

usar configuração de teste controlada
somente em slices isolados.
```

Registre quaisquer testes temporariamente adaptados.

---

### 21. Executar a aplicação

Suba:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Teste:

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"
```

Depois:

```powershell
Invoke-WebRequest `
  "http://localhost:8081/api/v2/service-orders" `
  -SkipHttpErrorCheck
```

Confirme:

```text
livez:
200.

API:
401 Problem Details.
```

---

### 22. Inspecionar a filter chain

Ative temporariamente no ambiente local:

```yaml
logging:
  level:
    org.springframework.security: DEBUG
```

Faça uma request.

Observe:

- chain selecionada;
- anonymous;
- authorization denied;
- entry point.

Depois restaure o nível anterior.

Não deixe DEBUG de segurança ativo por default.

Ele pode gerar volume e expor detalhes operacionais.

---

### 23. Atualizar a documentação

Crie ou atualize:

```text
docs/security/M15_SECURITY_FILTER_CHAIN.md
```

Registre:

- ordem das chains;
- matchers;
- paths públicos;
- paths negados;
- session policy;
- CSRF decision;
- CORS;
- headers;
- 401;
- 403;
- ausência de login;
- mudança prevista na aula 420.

Atualize também:

- baseline;
- threat model;
- OWASP review;
- security headers;
- CSRF decision;
- OpenAPI.

A documentação da API precisa informar que endpoints de negócio agora exigem um mecanismo ainda não disponibilizado.

---

### 24. Atualizar OpenAPI

Documente responses:

```text
401:
authentication_required.

403:
access_denied.
```

Ainda não declare um security scheme de Basic, bearer ou cookie.

Nenhum mecanismo foi implementado.

A aula 420 adicionará o primeiro scheme didático.

---

### 25. Executar o gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- context loads;
- security tests verdes;
- controller tests conscientemente adaptados;
- no default password;
- nenhum redirect de login;
- nenhum `JSESSIONID`;
- CORS verde;
- headers verdes;
- OpenAPI verde.

---

## Entendendo o que foi feito

### O runtime passou a ser protegido

Spring Security deixou o escopo de teste.

### A API começou fechada

Nenhum endpoint de negócio foi liberado por acidente.

### Infraestrutura recebeu regras explícitas

Health e documentação não dependeram de defaults ocultos.

### Erros mantiveram o contrato

401 e 403 usam Problem Details.

### CORS entrou antes da autorização

Preflight não foi tratado como usuário.

### CSRF virou decisão rastreável

A desativação corresponde à arquitetura atual.

### Security headers foram migrados

A DSL substituiu o filtro didático.

### Login permaneceu ausente

Proteção de fronteira veio antes da credencial.

---

## Erros comuns importantes

### Adicionar o starter sem criar chain

Defaults do Boot podem surpreender.

### Liberar `/api/**` para “testar”

Isso destrói deny by default.

### Usar `anyRequest().authenticated()` antes do login

O comportamento fica incompleto e dependente de usuário default.

### Ignorar Swagger completamente

Paths ignorados não recebem a infraestrutura de segurança.

### Retornar HTML em 401

Clientes REST esperam contrato JSON.

### Retornar 403 para anonymous

Autenticação ausente precisa de 401.

### Criar sessão por request cache

Uma API stateless não deve salvar a request.

### Desabilitar CSRF sem decisão

A escolha depende da credencial futura.

### Duplicar filtro de headers

Duas infraestruturas podem gerar conflito.

### Usar `with(user())` como prova de login

Esse helper cria contexto; não valida credentials.

---

## Comandos úteis

### Dependências

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security"
```

### Teste de segurança

```powershell
.\mvnw.cmd `
  -Dtest=ApiSecurityConfigurationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Testar 401

```powershell
Invoke-WebRequest `
  "http://localhost:8081/api/v2/service-orders" `
  -SkipHttpErrorCheck
```

### Ver logs

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String "Security"
```

### Revisar filters antigos

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "SecurityHeadersFilter|FilterRegistrationBean"
```

---

## Exercício guiado

### Parte 1 — Dependency

Adicione starter e security test.

### Parte 2 — Erros

Crie entry point, denied handler e Problem Details.

### Parte 3 — API chain

Configure matcher, stateless e deny-all.

### Parte 4 — Fallback

Libere somente infraestrutura declarada.

### Parte 5 — CORS e CSRF

Aplique as decisões das aulas anteriores.

### Parte 6 — Headers

Migre o filtro para a DSL.

### Parte 7 — Testes

Comprove public, 401, 403 e preflight.

### Parte 8 — Defaults

Confirme ausência de usuário e redirect.

### Parte 9 — Execução

Teste a stack com requests reais.

### Parte 10 — Documentação

Atualize contratos e artefatos de segurança.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 418 foi preservada;
- starter security foi adicionado em runtime;
- spring-security-test foi adicionado em test scope;
- dependencies redundantes foram revisadas;
- Bouncy Castle permaneceu em test scope;
- usuário default do Boot foi discutido;
- SecurityFilterChain substituiu configuração web default;
- UserDetailsService default não permaneceu oculto;
- AuthenticationManager temporário foi criado;
- manager temporário não autentica;
- manager temporário será removido na aula 420;
- deny by default foi explicado;
- `permitAll` não foi tratado como sem risco;
- duas chains foram justificadas;
- API chain possui Order 1;
- fallback possui Order 2;
- primeira chain correspondente foi respeitada;
- WebSecurityCustomizer ignore não foi usado;
- permitAll foi preferido;
- stateless foi configurado;
- limites de stateless foram explicados;
- NullRequestCache foi configurado;
- form login foi desativado;
- HTTP Basic foi desativado;
- logout foi desativado;
- remember-me foi desativado;
- login não foi antecipado;
- CSRF foi desativado por decisão documentada;
- CSRF não foi declarado irrelevante para toda API;
- CORS foi integrado;
- CORS continuou definido no MVC;
- preflight foi permitido;
- request real continuou protegida;
- ApiAuthenticationRequiredException foi criada;
- ApiForbiddenException foi criada;
- mensagens foram genéricas;
- entry point foi criado;
- denied handler foi criado;
- HandlerExceptionResolver foi usado;
- exception interna não foi exposta;
- GlobalExceptionHandler foi atualizado;
- 401 usa application/problem+json;
- 401 possui code estável;
- 403 usa application/problem+json;
- 403 possui code estável;
- correlation ID foi preservado;
- 401 não redireciona;
- 403 foi diferenciado de 401;
- filtro custom de headers foi removido;
- configuration custom de headers foi removida;
- SecurityHeadersProperties foi preservada;
- headers foram migrados para DSL;
- defaultsDisabled foi usado na API;
- nosniff foi configurado;
- frame deny foi configurado;
- CSP foi configurada;
- referrer no-referrer foi configurado;
- Permissions-Policy foi configurada;
- X-XSS-Protection zero foi configurado;
- cache control foi configurado;
- HSTS depende de property e HTTPS;
- API chain usa `/api/**`;
- API chain termina em denyAll;
- fallback permite dispatcher ERROR;
- livez foi permitido;
- readyz foi permitido;
- OpenAPI foi permitido no laboratório;
- Swagger foi permitido no laboratório;
- Actuator health foi permitido;
- Actuator info foi permitido;
- fallback termina em denyAll;
- Swagger público recebeu ressalva de produção;
- teste de liveness foi criado;
- teste de OpenAPI foi criado;
- teste 401 foi criado;
- teste 401 validou Problem Details;
- teste 401 validou ausência de redirect;
- teste 401 validou ausência de cookie;
- teste 401 validou headers;
- teste 403 foi criado;
- teste 403 usou identidade de teste;
- identity helper não foi chamado de login real;
- teste CORS foi criado;
- origin permitida foi validada;
- origin rejeitada foi planejada;
- deny de path desconhecido foi testado;
- path anônimo desconhecido não revelou 404;
- CSP não foi aplicada ao OpenAPI;
- ausência de UserDetailsService default foi testada;
- logs não exibiram password gerada;
- testes existentes foram revisados;
- filtros não foram desabilitados na integração principal;
- stack foi executada;
- livez real retornou 200;
- API real retornou 401;
- DEBUG de segurança foi usado temporariamente;
- DEBUG não ficou ativo por default;
- documento da chain foi criado;
- baseline foi atualizada;
- threat model foi atualizado;
- OWASP review foi atualizada;
- security headers foram atualizados;
- CSRF decision foi atualizada;
- OpenAPI recebeu 401 e 403;
- security scheme não foi inventado;
- gate completo foi executado;
- nenhum usuário foi criado;
- nenhuma password foi criada;
- nenhum JWT foi criado;
- commit recomendado está pronto;
- ponte para a aula 420 está correta.

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
git commit -m "feat(m15): proteger aplicacao com SecurityFilterChain"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- usuário;
- password;
- hash;
- token;
- secret;
- env file;
- logs de DEBUG;
- default password;
- configuração de produção inventada;
- certificado;
- SecurityFilterChain de teste fora do escopo.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o Spring Security entrou no runtime.

A configuração passou a possuir:

```text
API chain;

fallback chain;

deny by default;

paths públicos explícitos;

stateless;

NullRequestCache;

CORS;

CSRF decidido;

security headers;

401;

403.
```

A aplicação agora responde:

```text
endpoint público:
permitido.

API anônima:
401.

identidade sem acesso:
403.

path desconhecido:
negado.
```

A decisão central foi:

```text
a fronteira de segurança
deve existir antes do login;

endpoints novos começam negados
e somente regras explícitas
abrem acesso.
```

Nenhum usuário foi criado.

Nenhuma senha foi configurada.

Nenhum mecanismo de autenticação foi disponibilizado.

Isso acontecerá na próxima aula:

```text
420 - M15.10 - Login basico usuario em memoria
```

Nela, você irá:

- criar `InMemoryUserDetailsManager`;
- usar hash seguro;
- ativar HTTP Basic didático;
- autenticar requests;
- liberar endpoints autenticados;
- preservar endpoints públicos;
- testar credencial válida;
- testar credencial inválida;
- validar `WWW-Authenticate`;
- diferenciar 401 e 403 com usuário real;
- documentar limitações do usuário em memória.

O usuário em memória será apenas uma etapa pedagógica.

Persistência em banco ficará para a aula 421.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei Spring Security ao runtime.
- [ ] Criei API chain e fallback.
- [ ] Implementei deny by default.
- [ ] Padronizei 401 e 403.
- [ ] Testei acesso público, negado e CORS.

---

## Troubleshooting adicional

### A aplicação imprime password gerada

Confirme o bean temporário `AuthenticationManager`.

Revise se a auto-configuração de usuário realmente recuou.

### Toda request retorna 401

Confirme os paths públicos na fallback chain e a ordem das chains.

### Swagger retorna 401

Verifique:

- `/swagger-ui/**`;
- `/swagger-ui.html`;
- `/v3/api-docs/**`;
- fallback chain.

### Preflight retorna 401

Confirme:

- `cors(withDefaults())`;
- policy MVC;
- matcher de `CorsUtils`;
- origin;
- method;
- headers.

### Response 401 vem em HTML

Confirme:

- custom entry point;
- `HandlerExceptionResolver`;
- handler de exception;
- form login desativado.

### Usuário de teste recebe 401 em vez de 403

Confirme `spring-security-test`, `.with(user(...))` e aplicação da filter chain no MockMvc.

### CSP quebra Swagger

Confirme que a CSP estrita está somente na API chain.

### Controller tests começaram a falhar

Eles agora atravessam segurança.

Diferencie testes de contrato de segurança e testes isolados de controller.

---

## Perguntas de revisão

1. O que o starter muda?
2. O que substitui a configuração web default?
3. A chain desativa o usuário default?
4. O que é deny by default?
5. Por que usar duas chains?
6. Qual chain vem primeiro?
7. Para que serve securityMatcher?
8. Para que serve STATELESS?
9. Para que serve NullRequestCache?
10. Por que form login foi desativado?
11. Por que CSRF foi desativado?
12. CORS autentica?
13. Qual status para anonymous?
14. Qual status para autenticado negado?
15. Para que serve AuthenticationEntryPoint?
16. Para que serve AccessDeniedHandler?
17. Por que usar HandlerExceptionResolver?
18. A API já possui login?
19. Swagger está aprovado para produção pública?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Coloca Spring Security no runtime.
2. Um bean SecurityFilterChain.
3. Não automaticamente.
4. Negar o que não foi declarado.
5. Separar API e infraestrutura.
6. A mais específica.
7. Selecionar requests da chain.
8. Não persistir auth em sessão.
9. Não salvar request para redirect.
10. Login pertence à próxima aula.
11. Não existe credencial automática.
12. Não.
13. 401.
14. 403.
15. Iniciar autenticação.
16. Responder falta de permissão.
17. Reutilizar Problem Details.
18. Não.
19. Não.
20. Login básico usuário em memória.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 419 - M15.09 - SecurityFilterChain

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Adicionei `spring-boot-starter-security` ao runtime.
- Adicionei `spring-security-test`.
- Revisei dependencies redundantes.
- Impedi a criação do usuário default do Spring Boot.
- Criei um AuthenticationManager temporário sem mecanismo.
- Criei a primeira configuração de segurança de runtime.
- Apliquei deny by default.
- Criei uma API chain com Order 1.
- Limitei a API chain a `/api/**`.
- Criei uma fallback chain com Order 2.
- Mantive health e documentação pública somente no laboratório.
- Neguei paths não declarados.
- Configurei SessionCreationPolicy.STATELESS.
- Configurei NullRequestCache.
- Desativei form login, HTTP Basic, logout e remember-me.
- Apliquei a decisão atual de CSRF.
- Integrei CORS com a filter chain.
- Permiti preflight sem liberar a request real.
- Criei ApiAuthenticationEntryPoint.
- Criei ApiAccessDeniedHandler.
- Deleguei erros ao HandlerExceptionResolver.
- Criei Problem Details para 401.
- Criei Problem Details para 403.
- Preservei correlation ID.
- Removi o filtro didático de security headers.
- Migrei os headers para a DSL do Spring Security.
- Preservei CSP, nosniff, DENY, Referrer-Policy e Permissions-Policy.
- Mantive HSTS condicionado a HTTPS.
- Testei liveness e OpenAPI públicos.
- Testei 401 para anonymous.
- Testei 403 para identidade sem acesso.
- Testei ausência de redirect e JSESSIONID.
- Testei CORS e deny by default.
- Confirmei ausência de usuário default.
- Executei a stack e o gate completo.
- Atualizei documentação, threat model, OWASP, CSRF e headers.
- Não criei usuário, login, password ou JWT.
- Próxima aula: Login basico usuario em memoria.
```

---

## Referência técnica curta

- [Spring Security — Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)
- [Spring Security — Authorize HttpServletRequests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring Security — Session Management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)
- [Spring Security — CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
- [Spring Security — CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [Spring Security — Response Headers](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html)
- [Spring Boot — Spring Security](https://docs.spring.io/spring-boot/reference/web/spring-security.html)

Regra final:

```text
uma SecurityFilterChain segura deve começar negando requests não declaradas, separar fronteiras com matchers e ordem explícita, produzir contratos distintos para 401 e 403, evitar sessão e request cache quando a API é stateless, processar CORS antes da autorização e aplicar CSRF conforme a credencial real; nesta baseline, os security headers migram para a DSL, health e documentação possuem exceções explícitas e nenhum mecanismo de login é criado antes da próxima aula.
```
