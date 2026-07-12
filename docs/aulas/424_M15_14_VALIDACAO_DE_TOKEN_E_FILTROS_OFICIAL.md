# 424 - M15.14 - Validacao de token e filtros

## Apresentação da aula

Na aula 423, a aplicação passou a emitir access tokens JWT depois de autenticar username e password.

O fluxo criado foi:

```text
POST /api/auth/login
-> AuthenticationManager
-> DaoAuthenticationProvider
-> DatabaseUserDetailsService
-> PasswordEncoder
-> DatabaseUserPrincipal
-> JwtTokenService
-> NimbusJwtEncoder
-> access token RS256
```

O token contém:

```text
typ:
at+jwt.

alg:
RS256.

kid:
identificador da chave.

iss:
formacao-java-api.

sub:
UUID persistido.

aud:
service-order-api.

iat, nbf, exp:
claims temporais.

jti:
identificador único.

authorities:
permissões ordenadas.
```

Na aula anterior, o token foi validado apenas nos testes de emissão.

Enviar:

```http
Authorization: Bearer eyJ...
```

para um endpoint protegido ainda retornava:

```http
401 Unauthorized
```

Isso foi proposital.

Emitir um token e aceitar um token são responsabilidades diferentes.

A pergunta central desta aula será:

```text
como extrair um bearer token,
verificar a assinatura,
validar o perfil completo
e transformar claims confiáveis
em uma Authentication?
```

A solução usará o suporte de OAuth 2.0 Resource Server do Spring Security.

Isso não transforma a aplicação em um Authorization Server completo.

Nesta formação:

```text
o endpoint de login:
autentica e emite.

o Resource Server:
recebe e valida access tokens.
```

O fluxo final será:

```text
HTTP request
-> Authorization: Bearer
-> BearerTokenAuthenticationFilter
-> BearerTokenAuthenticationToken
-> JwtAuthenticationProvider
-> NimbusJwtDecoder
-> signature RS256
-> validators
-> JwtAuthenticationConverter
-> JwtAuthenticationToken
-> SecurityContext
-> AuthorizationFilter
-> controller
```

A private key continuará restrita à emissão.

A validação utilizará apenas a public key.

A política exigirá:

- RS256;
- `typ=at+jwt`;
- issuer exato;
- audience esperada;
- subject UUID;
- `jti` não vazio;
- `iat`, `nbf` e `exp`;
- clock skew de 30 segundos;
- TTL máximo permitido;
- authorities não vazias;
- formato conhecido de authorities.

Somente depois dessas verificações os claims poderão virar authorities do Spring Security.

A API também deixará de aceitar HTTP Basic nos endpoints de negócio.

A password será aceita somente em:

```text
POST /api/auth/login
```

Assim:

```text
HTTP Basic em recurso:
401.

Bearer válido:
200.

Bearer inválido:
401.

Bearer válido sem ROLE_ADMIN:
403.
```

O endpoint `/api/security/me` agora receberá um `JwtAuthenticationToken`.

O principal não será mais `DatabaseUserPrincipal`.

Ele será o JWT validado.

A aplicação não consultará o banco em cada request bearer.

Consequência:

```text
uma conta bloqueada
pode manter um access token válido
até a expiração.
```

O TTL curto reduz essa janela.

Refresh token e revogação serão tratados nas próximas aulas.

A próxima aula será:

```text
425 - M15.15 - Refresh token
```

---

## Onde estamos na formação

A sequência atual é:

```text
422:
JWT conceitos header payload signature.

423:
JWT implementacao login.

424:
Validacao de token e filtros.

425:
Refresh token.

426:
Logout e revogacao.

427:
Autorizacao por roles e authorities.
```

A aula 423 respondeu:

```text
como emitir um access token
depois de autenticar a conta?
```

A aula 424 responderá:

```text
como aceitar somente tokens
criptograficamente válidos
e compatíveis com a policy da API?
```

Nesta aula:

```text
Resource Server:
sim.

BearerTokenAuthenticationFilter:
sim.

JwtDecoder:
sim.

public key:
sim.

signature RS256:
sim.

issuer:
sim.

audience:
sim.

typ:
sim.

claims temporais:
sim.

authorities:
sim.

HTTP Basic nos recursos:
não.

login JSON:
sim.

refresh token:
não.
```

A regra central será:

```text
um bearer token só cria identidade
depois de passar por assinatura,
algoritmo, tipo, issuer,
audience, tempo e perfil.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
configuration/security/jwt/
├── JwtResourceServerConfiguration.java
├── JwtAccessTokenProfileValidator.java
└── JwtAuthoritiesConverter.java
```

Tratamento de erros:

```text
configuration/security/
├── ApiBearerAuthenticationEntryPoint.java
├── ApiBearerAccessDeniedHandler.java
└── ApiInvalidBearerTokenException.java
```

Arquivos atualizados:

```text
ApiSecurityConfiguration.java
SecurityIdentityController.java
SecurityIdentityResponse.java
GlobalExceptionHandler.java
application-jwt-lab.yaml
```

Teste:

```text
JwtResourceServerIntegrationTest.java
```

Documentação:

```text
docs/security/M15_JWT_RESOURCE_SERVER.md
```

A API demonstrará:

```text
sem token:
401 authentication_required.

token válido:
200.

token adulterado:
401 invalid_token.

token expirado:
401 invalid_token.

issuer incorreto:
401 invalid_token.

audience incorreta:
401 invalid_token.

typ incorreto:
401 invalid_token.

authority insuficiente:
403 access_denied.

HTTP Basic em recurso:
401.

login JSON:
continua funcionando.
```

Você irá:

1. adicionar o starter Resource Server;
2. remover JOSE redundante;
3. criar `JwtDecoder`;
4. restringir RS256;
5. configurar clock skew;
6. validar issuer;
7. validar audience;
8. validar `typ`;
9. validar subject;
10. validar `jti`;
11. validar authorities;
12. converter authorities;
13. configurar bearer resolver;
14. configurar entry point;
15. configurar denied handler;
16. ativar Resource Server;
17. desativar HTTP Basic nos recursos;
18. testar tokens válidos e inválidos;
19. atualizar OpenAPI;
20. preparar refresh token.

---

## Conceito essencial

### Resource Server

Resource Server protege recursos usando access tokens.

Ele não precisa:

- conhecer a password;
- executar password hashing;
- emitir o token;
- possuir a private key;
- criar usuário no banco.

Ele precisa:

- extrair o bearer;
- validar o token;
- criar identidade;
- aplicar autorização;
- produzir erros de protocolo.

Nesta formação, a mesma aplicação emite e valida, mas os componentes permanecem separados.

---

### BearerTokenAuthenticationFilter

O filtro procura o bearer no header:

```http
Authorization: Bearer <token>
```

Quando encontra:

1. cria `BearerTokenAuthenticationToken`;
2. delega ao `AuthenticationManager`;
3. recebe uma autenticação válida;
4. salva no `SecurityContext`;
5. continua a chain.

Token inválido aciona o `AuthenticationEntryPoint`.

Token válido sem permissão aciona o `AccessDeniedHandler`.

---

### DefaultBearerTokenResolver

O resolver será explícito:

```text
header Authorization:
permitido.

query parameter:
proibido.

form body:
proibido.
```

Tokens em query vazam para logs, histórico, analytics, proxies e screenshots.

---

### JwtAuthenticationProvider

O provider usa o `JwtDecoder`.

Depois da validação, um converter cria:

```text
JwtAuthenticationToken.
```

O provider não consulta `DatabaseUserDetailsService`.

A identidade nasce dos claims validados.

Isso reduz consultas por request, mas mudanças de conta não afetam imediatamente tokens já emitidos.

---

### JwtDecoder

`JwtDecoder` não faz apenas Base64URL decode.

Ele precisa:

- parsear;
- verificar signature;
- restringir algoritmo;
- executar validators;
- rejeitar token inválido.

A implementação será:

```text
NimbusJwtDecoder.
```

Ela receberá somente a public key.

---

### Algorithm allowlist

O decoder aceitará apenas:

```text
RS256.
```

Um token declarando outro algoritmo será rejeitado.

O header recebido não escolhe a política criptográfica do servidor.

---

### Validação temporal

O validator de timestamps verifica:

- `exp`;
- `nbf`.

O profile validator também verificará `iat`.

Clock skew:

```text
30 segundos.
```

Serão rejeitados:

- token expirado além do skew;
- `nbf` futuro além do skew;
- `iat` futuro além do skew;
- `exp` anterior ou igual a `iat`;
- TTL maior que quinze minutos.

O token do laboratório dura cinco minutos.

---

### Issuer e audience

Issuer esperado:

```text
formacao-java-api.
```

Audience esperada:

```text
service-order-api.
```

Uma signature válida de outro emissor ou para outro serviço não é suficiente.

---

### typ

O header protegido precisa conter:

```text
at+jwt.
```

Isso reduz confusão com:

- ID token;
- refresh token;
- reset token;
- verification token.

---

### Subject e JWT ID

O subject precisa ser um UUID válido.

O `jti` precisa existir e não estar vazio.

Nesta aula, `jti` apoia identificação e auditoria futura.

Ele ainda não é consultado em denylist.

---

### Authorities

O claim:

```text
authorities
```

será convertido sem prefixo automático.

Exemplo:

```text
ROLE_OPERATOR
service-order:read
service-order:write
```

O converter não deve criar:

```text
SCOPE_ROLE_OPERATOR.
```

As authorities serão validadas antes da conversão.

---

### JwtAuthenticationToken

Depois do sucesso:

```text
principal:
Jwt.

authorities:
claims convertidos.

name:
subject UUID.
```

Controllers não devem receber o token completo sem necessidade.

Use `Authentication.getName()` e authorities.

---

### 401 e 403

Token ausente ou inválido:

```http
401 Unauthorized
WWW-Authenticate: Bearer
```

Códigos:

```text
authentication_required:
token ausente.

invalid_token:
token apresentado e inválido.
```

Token válido sem authority:

```http
403 Forbidden
```

Código:

```text
access_denied.
```

A causa criptográfica não será exposta.

---

### Estado da conta

Bearer self-contained não relê:

- `enabled`;
- `account_non_locked`;
- authorities;
- password version.

Mudanças passam a valer na expiração ou quando houver revogação, security version ou introspection.

Essa lacuna será documentada.

---

## Mão na massa guiada

### 1. Adicionar Resource Server

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>
        spring-boot-starter-oauth2-resource-server
    </artifactId>
</dependency>
```

O starter já traz JOSE.

Revise e remova a dependency direta redundante:

```text
spring-security-oauth2-jose.
```

Valide:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security:spring-security-oauth2-resource-server,org.springframework.security:spring-security-oauth2-jose"
```

---

### 2. Criar JwtAccessTokenProfileValidator

```java
package br.com.formacao.backend.configuration.security.jwt;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.security.oauth2.core
        .OAuth2Error;
import org.springframework.security.oauth2.core
        .OAuth2TokenValidator;
import org.springframework.security.oauth2.core
        .OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtAccessTokenProfileValidator
        implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error
            INVALID_TOKEN =
            new OAuth2Error(
                    "invalid_token",
                    "The access token is invalid",
                    null
            );

    private static final Pattern
            AUTHORITY_PATTERN =
            Pattern.compile(
                    "^(ROLE_[A-Z0-9_]+"
                    + "|[a-z0-9-]+:[a-z0-9-]+)$"
            );

    private final String audience;
    private final Duration maxTtl;
    private final Duration clockSkew;
    private final Clock clock;

    public JwtAccessTokenProfileValidator(
            String audience,
            Duration maxTtl,
            Duration clockSkew,
            Clock clock
    ) {
        this.audience = audience;
        this.maxTtl = maxTtl;
        this.clockSkew = clockSkew;
        this.clock = clock;
    }

    @Override
    public OAuth2TokenValidatorResult validate(
            Jwt jwt
    ) {
        try {
            validateType(jwt);
            validateAudience(jwt);
            validateSubject(jwt);
            validateJwtId(jwt);
            validateTimes(jwt);
            validateAuthorities(jwt);

            return OAuth2TokenValidatorResult
                    .success();
        }
        catch (RuntimeException exception) {
            return OAuth2TokenValidatorResult
                    .failure(INVALID_TOKEN);
        }
    }
```

Continue:

```java
    private void validateType(Jwt jwt) {
        Object type =
                jwt.getHeaders().get("typ");

        if (!"at+jwt".equals(type)) {
            throw new IllegalArgumentException();
        }
    }

    private void validateAudience(Jwt jwt) {
        if (
            jwt.getAudience() == null
            || !jwt.getAudience()
                    .contains(audience)
        ) {
            throw new IllegalArgumentException();
        }
    }

    private void validateSubject(Jwt jwt) {
        UUID.fromString(jwt.getSubject());
    }

    private void validateJwtId(Jwt jwt) {
        if (
            jwt.getId() == null
            || jwt.getId().isBlank()
        ) {
            throw new IllegalArgumentException();
        }
    }

    private void validateTimes(Jwt jwt) {
        Instant now = clock.instant();
        Instant issuedAt = require(jwt.getIssuedAt());
        Instant notBefore = require(jwt.getNotBefore());
        Instant expiresAt = require(jwt.getExpiresAt());

        if (
            issuedAt.isAfter(
                    now.plus(clockSkew)
            )
            || notBefore.isAfter(
                    now.plus(clockSkew)
            )
            || !expiresAt.isAfter(issuedAt)
            || Duration.between(
                    issuedAt,
                    expiresAt
            ).compareTo(maxTtl) > 0
        ) {
            throw new IllegalArgumentException();
        }
    }

    private void validateAuthorities(Jwt jwt) {
        List<String> authorities =
                jwt.getClaimAsStringList(
                        "authorities"
                );

        if (
            authorities == null
            || authorities.isEmpty()
            || authorities.size() > 50
        ) {
            throw new IllegalArgumentException();
        }

        boolean invalid =
                authorities
                        .stream()
                        .anyMatch(
                                authority ->
                                        authority == null
                                        || !AUTHORITY_PATTERN
                                                .matcher(
                                                        authority
                                                )
                                                .matches()
                        );

        if (invalid) {
            throw new IllegalArgumentException();
        }
    }

    private Instant require(Instant value) {
        if (value == null) {
            throw new IllegalArgumentException();
        }

        return value;
    }
}
```

O validator não informa qual regra falhou.

---

### 3. Criar JwtAuthoritiesConverter

```java
package br.com.formacao.backend.configuration.security.jwt;

import org.springframework.core.convert.converter
        .Converter;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource
        .authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource
        .authentication.JwtGrantedAuthoritiesConverter;

public final class JwtAuthoritiesConverter
        implements Converter<
                Jwt,
                JwtAuthenticationToken
        > {

    private final JwtGrantedAuthoritiesConverter
            authoritiesConverter;

    public JwtAuthoritiesConverter() {
        authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter
                .setAuthoritiesClaimName(
                        "authorities"
                );

        authoritiesConverter
                .setAuthorityPrefix("");
    }

    @Override
    public JwtAuthenticationToken convert(
            Jwt jwt
    ) {
        return new JwtAuthenticationToken(
                jwt,
                authoritiesConverter.convert(jwt),
                jwt.getSubject()
        );
    }
}
```

---

### 4. Criar JwtResourceServerConfiguration

```java
@Configuration(
        proxyBeanMethods = false
)
@ConditionalOnProperty(
        prefix = "app.security.jwt",
        name = "enabled",
        havingValue = "true"
)
public class JwtResourceServerConfiguration {

    @Bean
    JwtDecoder jwtDecoder(
            JwtSigningKeyPair keyPair,
            JwtIssuerProperties properties,
            Clock jwtClock
    ) {
        NimbusJwtDecoder decoder =
                NimbusJwtDecoder
                        .withPublicKey(
                                keyPair.publicKey()
                        )
                        .signatureAlgorithm(
                                SignatureAlgorithm.RS256
                        )
                        .build();

        JwtTimestampValidator timestamps =
                new JwtTimestampValidator(
                        Duration.ofSeconds(30)
                );

        timestamps.setClock(jwtClock);

        OAuth2TokenValidator<Jwt> validator =
                new DelegatingOAuth2TokenValidator<>(
                        timestamps,
                        new JwtIssuerValidator(
                                properties.getIssuer()
                        ),
                        new JwtAccessTokenProfileValidator(
                                properties.getAudience(),
                                Duration.ofMinutes(15),
                                Duration.ofSeconds(30),
                                jwtClock
                        )
                );

        decoder.setJwtValidator(validator);

        return decoder;
    }

    @Bean
    JwtAuthoritiesConverter
    jwtAuthenticationConverter() {
        return new JwtAuthoritiesConverter();
    }

    @Bean
    DefaultBearerTokenResolver
    bearerTokenResolver() {
        DefaultBearerTokenResolver resolver =
                new DefaultBearerTokenResolver();

        resolver.setAllowFormEncodedBodyParameter(
                false
        );

        resolver.setAllowUriQueryParameter(
                false
        );

        return resolver;
    }
}
```

---

### 5. Criar ApiInvalidBearerTokenException

```java
public final class
        ApiInvalidBearerTokenException
        extends RuntimeException {

    public ApiInvalidBearerTokenException() {
        super(
                "The bearer token is invalid"
        );
    }
}
```

---

### 6. Criar ApiBearerAuthenticationEntryPoint

```java
@Component
public class ApiBearerAuthenticationEntryPoint
        implements AuthenticationEntryPoint {

    private final BearerTokenAuthenticationEntryPoint
            delegate =
            new BearerTokenAuthenticationEntryPoint();

    private final HandlerExceptionResolver
            resolver;

    public ApiBearerAuthenticationEntryPoint(
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

        delegate.commence(
                request,
                response,
                exception
        );

        RuntimeException publicException =
                isInvalidToken(exception)
                        ? new ApiInvalidBearerTokenException()
                        : new ApiAuthenticationRequiredException();

        resolver.resolveException(
                request,
                response,
                null,
                publicException
        );
    }

    private boolean isInvalidToken(
            AuthenticationException exception
    ) {
        return exception
                instanceof
                OAuth2AuthenticationException oauth
                && "invalid_token".equals(
                        oauth.getError()
                                .getErrorCode()
                );
    }
}
```

---

### 7. Criar ApiBearerAccessDeniedHandler

```java
@Component
public class ApiBearerAccessDeniedHandler
        implements AccessDeniedHandler {

    private final BearerTokenAccessDeniedHandler
            delegate =
            new BearerTokenAccessDeniedHandler();

    private final HandlerExceptionResolver
            resolver;

    public ApiBearerAccessDeniedHandler(
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

        delegate.handle(
                request,
                response,
                exception
        );

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

### 8. Mapear invalid_token

No `GlobalExceptionHandler`:

```java
@ExceptionHandler(
        ApiInvalidBearerTokenException.class
)
ResponseEntity<ProblemDetail>
handleInvalidBearerToken(
        ApiInvalidBearerTokenException exception,
        HttpServletRequest request
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.UNAUTHORIZED,
                    "The bearer token is invalid."
            );

    problem.setTitle("Invalid token");
    problem.setType(
            URI.create(
                    "urn:problem:invalid-token"
            )
    );
    problem.setProperty(
            "code",
            "invalid_token"
    );

    addCorrelationId(problem, request);

    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .cacheControl(
                    CacheControl.noStore()
            )
            .contentType(
                    MediaType.APPLICATION_PROBLEM_JSON
            )
            .body(problem);
}
```

---

### 9. Ativar Resource Server na API chain

Injete decoder, converter, resolver e handlers.

Quando JWT estiver habilitado:

```java
http.oauth2ResourceServer(
        resourceServer ->
                resourceServer
                        .bearerTokenResolver(
                                bearerTokenResolver
                        )
                        .authenticationEntryPoint(
                                bearerEntryPoint
                        )
                        .accessDeniedHandler(
                                bearerDeniedHandler
                        )
                        .jwt(
                                jwt ->
                                        jwt
                                                .decoder(
                                                        jwtDecoder
                                                )
                                                .jwtAuthenticationConverter(
                                                        jwtConverter
                                                )
                        )
);
```

Use os handlers Bearer também no tratamento geral da chain.

---

### 10. Desativar HTTP Basic no modo JWT

```java
if (jwtProperties.isEnabled()) {
    http.httpBasic(
            AbstractHttpConfigurer::disable
    );
}
else if (httpBasicProperties.isEnabled()) {
    configureBasic(...);
}
else {
    http.httpBasic(
            AbstractHttpConfigurer::disable
    );
}
```

O login JSON continua funcionando porque chama o `AuthenticationManager` diretamente.

---

### 11. Preservar autorização

A chain continua:

```java
.requestMatchers(
        HttpMethod.POST,
        "/api/auth/login"
)
.permitAll()

.requestMatchers(
        "/api/security/admin-probe"
)
.hasRole("ADMIN")

.anyRequest()
.authenticated()
```

Agora um bearer válido satisfaz `authenticated()`.

---

### 12. Atualizar a response de identidade

Use:

```java
public record SecurityIdentityResponse(
        String subject,
        List<String> authorities,
        String authenticationType
) {
}
```

Controller:

```java
@GetMapping("/me")
SecurityIdentityResponse me(
        Authentication authentication
) {
    return new SecurityIdentityResponse(
            authentication.getName(),
            authentication
                    .getAuthorities()
                    .stream()
                    .map(
                            GrantedAuthority
                                    ::getAuthority
                    )
                    .sorted()
                    .toList(),
            authentication
                    .getClass()
                    .getSimpleName()
    );
}
```

Não devolva o token.

---

### 13. Atualizar application-jwt-lab.yaml

```yaml
app:
  security:
    http-basic:
      enabled: false

    jwt:
      enabled: true
```

O banco e o `AuthenticationManager` continuam disponíveis para o login JSON.

---

### 14. Criar JwtResourceServerIntegrationTest

Use:

```java
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
        properties = {
                "app.security.jwt.enabled=true",
                "app.security.http-basic.enabled=false",
                "app.security.database.enabled=true",
                "app.security.database.bootstrap.enabled=false"
        }
)
@Import(
        JwtTestConfiguration.class
)
class JwtResourceServerIntegrationTest {
}
```

A configuração de teste fornece:

- RSA key pair;
- `JwtEncoder`;
- `JwtDecoder`;
- clock fixo;
- usuário PostgreSQL.

---

### 15. Criar helper de login

```java
private String loginAndGetAccessToken()
        throws Exception {

    MvcResult result =
            mockMvc.perform(
                    post(
                            "/api/auth/login"
                    )
                    .contentType(
                            MediaType.APPLICATION_JSON
                    )
                    .content(
                            """
                            {
                              "username": "operator",
                              "password":
                                "Laboratorio-JWT-M15!2026"
                            }
                            """
                    )
            )
            .andExpect(
                    status().isOk()
            )
            .andReturn();

    return objectMapper
            .readTree(
                    result
                            .getResponse()
                            .getContentAsString()
            )
            .get("access_token")
            .asText();
}
```

Nunca imprima o retorno.

---

### 16. Testar bearer válido

```java
@Test
void shouldAuthenticateValidBearerToken()
        throws Exception {

    String token =
            loginAndGetAccessToken();

    mockMvc.perform(
            get(
                "/api/security/me"
            )
            .header(
                    HttpHeaders.AUTHORIZATION,
                    "Bearer " + token
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            authenticated()
    )
    .andExpect(
            jsonPath("$.subject")
                    .value(
                            userId.toString()
                    )
    )
    .andExpect(
            jsonPath("$.authenticationType")
                    .value(
                            "JwtAuthenticationToken"
                    )
    )
    .andExpect(
            jsonPath("$.authorities")
                    .value(
                            hasItems(
                                    "ROLE_OPERATOR",
                                    "service-order:read",
                                    "service-order:write"
                            )
                    )
    );
}
```

---

### 17. Testar HTTP Basic rejeitado

```java
@Test
void shouldRejectBasicOnProtectedResource()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security/me"
            )
            .with(
                    httpBasic(
                            "operator",
                            "Laboratorio-JWT-M15!2026"
                    )
            )
    )
    .andExpect(
            status().isUnauthorized()
    )
    .andExpect(
            unauthenticated()
    );
}
```

---

### 18. Testar token adulterado

Altere um caractere da signature sem recalcular.

Resultado esperado:

```text
401;

invalid_token;

WWW-Authenticate Bearer.
```

Não valide a mensagem interna do decoder.

---

### 19. Criar tokens incompatíveis

Use o encoder de teste para criar tokens com:

- issuer incorreto;
- audience incorreta;
- `typ=JWT`;
- subject não UUID;
- `jti` ausente;
- authorities vazias;
- authority fora do padrão;
- `iat` futuro;
- `nbf` futuro;
- `exp` passado;
- TTL acima de quinze minutos.

Todos podem possuir signature válida.

Todos devem retornar:

```text
401 invalid_token.
```

---

### 20. Testar algoritmo incompatível

Crie um token HS256 em teste.

O decoder RS256 deve rejeitar.

Não habilite múltiplos algoritmos apenas para facilitar o cenário.

---

### 21. Testar 403

```java
@Test
void shouldReturnForbiddenForMissingAdminRole()
        throws Exception {

    String token =
            loginAndGetAccessToken();

    mockMvc.perform(
            get(
                "/api/security/admin-probe"
            )
            .header(
                    HttpHeaders.AUTHORIZATION,
                    "Bearer " + token
            )
    )
    .andExpect(
            status().isForbidden()
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "access_denied"
                    )
    )
    .andExpect(
            authenticated()
    );
}
```

---

### 22. Testar token em query

```java
@Test
void shouldRejectTokenInQueryParameter()
        throws Exception {

    String token =
            loginAndGetAccessToken();

    mockMvc.perform(
            get(
                "/api/security/me"
                + "?access_token="
                + token
            )
    )
    .andExpect(
            status().isUnauthorized()
    );
}
```

Não registre a URL do teste.

---

### 23. Testar token ausente

```java
@Test
void shouldChallengeMissingBearerToken()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security/me"
            )
    )
    .andExpect(
            status().isUnauthorized()
    )
    .andExpect(
            header().string(
                    HttpHeaders.WWW_AUTHENTICATE,
                    containsString("Bearer")
            )
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "authentication_required"
                    )
    );
}
```

---

### 24. Testar no-store e ausência de sessão

```java
.andExpect(
        header().string(
                HttpHeaders.CACHE_CONTROL,
                containsString("no-store")
        )
)
.andExpect(
        header().doesNotExist(
                HttpHeaders.SET_COOKIE
        )
);
```

A autenticação permanece stateless.

---

### 25. Executar a suíte

```powershell
.\mvnw.cmd `
  -Dtest=JwtResourceServerIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- token válido;
- validators;
- `401`;
- `403`;
- Basic rejeitado;
- nenhuma sessão;
- nenhuma chave ou token em logs;
- PostgreSQL real no login.

---

### 26. Executar no laboratório local

Ative:

```text
local;

db-auth-lab;

jwt-lab.
```

Faça login sem imprimir o token.

Armazene:

```powershell
$accessToken =
  $response.access_token
```

Use:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/security/me" `
  -Headers @{
    Authorization =
      "Bearer $accessToken"
  }
```

Não use query parameter.

---

### 27. Testar expiração real

Use um TTL menor apenas em profile de demonstração controlado ou aguarde os cinco minutos.

Depois repita a request.

Resultado:

```text
401 invalid_token.
```

Não reduza parâmetros reais somente para facilitar o teste.

---

### 28. Atualizar OpenAPI

Declare:

```text
security scheme:
bearerAuth.

type:
http.

scheme:
bearer.

bearerFormat:
JWT.
```

Aplique:

- endpoints de negócio: `bearerAuth`;
- `/api/auth/login`: público;
- health e documentação local: públicos;
- responses `401` e `403`.

Não documente token em query.

---

### 29. Criar documentação

Crie:

```text
docs/security/M15_JWT_RESOURCE_SERVER.md
```

Registre:

- fluxo do filtro;
- decoder;
- algoritmo;
- public key;
- validators;
- claims;
- converter;
- errors;
- challenge;
- CORS;
- stateless;
- account state;
- testes;
- gaps;
- NO-GO público.

Atualize:

- JWT concepts;
- JWT login;
- database authentication;
- baseline;
- threat model;
- OWASP;
- OpenAPI;
- collection Postman/Insomnia.

Não salve tokens em environments versionados.

---

### 30. Atualizar threat model

Adicione:

```text
THR-042:
algoritmo incompatível aceito.

THR-043:
issuer ou audience ignorado.

THR-044:
typ incorreto aceito.

THR-045:
authorities malformadas viram permissões.

THR-046:
token em query vaza.

THR-047:
conta bloqueada mantém token válido.

THR-048:
erro interno de token é exposto.

THR-049:
Basic continua ativo junto com bearer.
```

Controles:

- decoder RS256;
- validators;
- converter sem prefixo;
- resolver restrito ao header;
- TTL curto;
- erro genérico;
- Basic desativado;
- testes.

---

## Entendendo o que foi feito

### O bearer entrou na filter chain

A API passou a reconhecer access tokens.

### A public key ficou suficiente para validar

A private key permaneceu restrita à emissão.

### O decoder aplicou allowlist

Somente RS256 foi aceito.

### Validators formaram o perfil

Signature válida deixou de ser o único critério.

### Claims viraram authorities

Somente depois da validação.

### Basic saiu dos recursos

Password hashing ficou restrito ao login.

### 401 e 403 permaneceram distintos

Token inválido não foi confundido com falta de permissão.

### O banco saiu do caminho de cada request

Com a consequência de consistência eventual do estado da conta.

---

## Erros comuns importantes

### Criar filtro JWT manual

O Resource Server já fornece um fluxo testado.

### Decodificar antes de verificar

Claims não validados são input hostil.

### Aceitar qualquer algoritmo

O header não define a policy.

### Converter authorities sem validar

Claims malformados podem ampliar acesso.

### Manter Basic e Bearer juntos

Duas credenciais aumentam superfície e ambiguidade.

### Aceitar token em query

Ele vaza em várias camadas.

### Ignorar bloqueio durante a vida do token

TTL e revogação precisam ser planejados.

### Retornar detalhe criptográfico

O cliente recebe somente `invalid_token`.

### Usar helper `jwt()` como única prova

Ele pode pular signature e decoder.

---

## Comandos úteis

### Dependency tree

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security:spring-security-oauth2-resource-server,org.springframework.security:spring-security-oauth2-jose"
```

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=JwtResourceServerIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Request bearer

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/security/me" `
  -Headers @{
    Authorization =
      "Bearer $accessToken"
  }
```

### Procurar tokens

```powershell
git grep `
  -n `
  -E `
  "Bearer eyJ|access_token=.*eyJ"
```

### Verificar Basic residual

```powershell
git grep `
  -n `
  "httpBasic"
```

---

## Exercício guiado

### Parte 1 — Dependency

Adicione Resource Server e remova redundâncias.

### Parte 2 — Decoder

Configure public key e RS256.

### Parte 3 — Validators

Valide tipo, issuer, audience, tempos e perfil.

### Parte 4 — Converter

Transforme `authorities` sem prefixo.

### Parte 5 — Erros

Padronize `authentication_required`, `invalid_token` e `access_denied`.

### Parte 6 — Chain

Ative bearer e desative Basic.

### Parte 7 — Identidade

Atualize `/me` para `JwtAuthenticationToken`.

### Parte 8 — Testes

Valide token real, adulterado e incompatível.

### Parte 9 — Operação

Teste sem query, cookie ou sessão.

### Parte 10 — Documentação

Atualize OpenAPI, threat model e coleção.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 423 foi preservada;
- Resource Server foi diferenciado do emissor;
- starter Resource Server foi adicionado;
- JOSE redundante foi revisado;
- fluxo oficial bearer foi utilizado;
- filtro JWT manual não foi criado;
- bearer ficou restrito ao header Authorization;
- token em query e form body foi proibido;
- decoder usa somente public key;
- RS256 foi fixado;
- clock skew de 30 segundos foi configurado;
- issuer e audience foram validados;
- `typ=at+jwt` foi validado;
- subject UUID e `jti` foram validados;
- `iat`, `nbf`, `exp` e TTL máximo foram validados;
- authorities vazias, excessivas ou inválidas foram rejeitadas;
- erro de validator permaneceu genérico;
- converter usa o claim `authorities`;
- prefixo `SCOPE_` foi removido;
- `JwtAuthenticationToken` foi criado;
- challenge Bearer foi preservado;
- token ausente e inválido têm códigos distintos;
- denied handler preserva `access_denied`;
- Resource Server foi conectado à API chain;
- HTTP Basic foi desativado nos recursos;
- login JSON continuou funcionando;
- `/me` não expõe o token;
- profile JWT desativa Basic;
- testes usam RSA efêmera e PostgreSQL real;
- bearer válido retornou `200`;
- Basic em recurso retornou `401`;
- token adulterado, expirado e incompatível foi rejeitado;
- issuer, audience, tipo, subject e `jti` inválidos foram rejeitados;
- tempos, TTL, algoritmo e authorities inválidos foram rejeitados;
- token válido sem role retornou `403`;
- token em query foi rejeitado;
- token ausente retornou challenge Bearer;
- `no-store` e ausência de sessão foram preservados;
- token completo não apareceu em logs;
- testes passaram pelo decoder real;
- OpenAPI recebeu `bearerAuth`;
- login ficou público e endpoints protegidos receberam bearer;
- coleção não versionou tokens;
- documentação Resource Server foi criada;
- baseline, threat model e OWASP foram atualizados;
- janela de conta bloqueada foi registrada;
- produção pública permaneceu NO-GO;
- refresh token e revogação não foram antecipados;
- gate completo foi executado;
- commit recomendado está pronto;
- ponte para a aula 425 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git grep -n -E "Bearer eyJ|access_token=.*eyJ"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): validar bearer JWT na filter chain"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access token;
- private key;
- keystore;
- password;
- hash;
- Authorization header;
- response de login;
- env file;
- logs de decoder;
- token em collection;
- refresh token antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o token emitido passou a ser aceito pela API.

O fluxo ficou:

```text
Authorization Bearer
-> BearerTokenAuthenticationFilter
-> BearerTokenAuthenticationToken
-> JwtAuthenticationProvider
-> NimbusJwtDecoder
-> signature RS256
-> validators
-> JwtAuthoritiesConverter
-> JwtAuthenticationToken
-> SecurityContext
-> AuthorizationFilter
```

A validação exige:

```text
RS256;

typ at+jwt;

issuer;

audience;

subject UUID;

issued-at;

not-before;

expiration;

JWT ID;

authorities válidas.
```

A API agora diferencia:

```text
token ausente:
401 authentication_required.

token inválido:
401 invalid_token.

token válido:
acesso conforme regra.

token válido sem authority:
403 access_denied.
```

A password deixou de acompanhar requests protegidas.

HTTP Basic foi removido dos recursos.

O login JSON continua sendo o único lugar que autentica username e password.

A decisão central foi:

```text
claims só podem virar identidade
depois que assinatura,
algoritmo e perfil completo
forem validados;

decodificar não é autenticar.
```

A aplicação ainda não possui refresh token.

Quando o access token expira, o cliente precisa autenticar novamente.

A próxima aula será:

```text
425 - M15.15 - Refresh token
```

Nela, você irá:

- diferenciar access e refresh token;
- escolher refresh token opaco;
- persistir somente hash;
- criar rotação;
- detectar reutilização;
- associar família de tokens;
- definir expiração;
- criar endpoint de refresh;
- revogar família comprometida;
- testar concorrência;
- não reutilizar access token como refresh token.

---

# Material complementar

## Checkpoint final

- [ ] Ativei Resource Server com public key.
- [ ] Validei algoritmo, tipo, issuer, audience e tempo.
- [ ] Converti authorities somente após validação.
- [ ] Desativei HTTP Basic nos recursos.
- [ ] Testei token válido, inválido, expirado e sem permissão.

---

## Troubleshooting adicional

### Todo bearer retorna 401

Confirme:

- public key correspondente;
- RS256;
- issuer;
- audience;
- clock;
- `typ`;
- profile;
- converter.

### O token válido retorna invalid_token

Revise `iat`, `nbf`, `exp`, TTL e authorities.

Não desabilite validators para fazer o teste passar.

### Authorities aparecem com SCOPE_

Confirme:

```java
setAuthorityPrefix("");
```

e o claim `authorities`.

### HTTP Basic ainda funciona

Quando JWT está ativo, Basic precisa estar desabilitado.

### Token em query funciona

Confirme as duas propriedades do resolver.

### Conta bloqueada ainda acessa

Esse é o comportamento self-contained até a expiração.

### Response inválida vem sem body

Confirme a ordem entre delegate, resolver e Problem Details.

### Helper `jwt()` passa, token real falha

O helper pode pular decoder e signature.

Mantenha JWS real na suíte.

---

## Perguntas de revisão

1. O que faz um Resource Server?
2. Qual filtro lê o bearer?
3. Onde o token deve ser enviado?
4. Query parameter é permitido?
5. Quem valida a signature?
6. Qual chave valida RS256?
7. Qual algoritmo é aceito?
8. Qual `typ` é exigido?
9. Qual issuer é aceito?
10. Qual audience é aceita?
11. O que vira o nome da Authentication?
12. De qual claim vêm as authorities?
13. Por que remover `SCOPE_`?
14. Qual status para token inválido?
15. Qual status para falta de role?
16. HTTP Basic continua nos recursos?
17. O banco é consultado por bearer?
18. Bloqueio invalida token imediatamente?
19. Existe refresh token?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Proteger recursos com access token.
2. `BearerTokenAuthenticationFilter`.
3. Header Authorization.
4. Não.
5. `NimbusJwtDecoder`.
6. Public key.
7. RS256.
8. `at+jwt`.
9. `formacao-java-api`.
10. `service-order-api`.
11. Subject UUID.
12. `authorities`.
13. Preservar roles e permissions.
14. 401.
15. 403.
16. Não.
17. Não.
18. Não.
19. Não.
20. Refresh token.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 424 - M15.14 - Validacao de token e filtros

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei emissor e Resource Server.
- Adicionei `spring-boot-starter-oauth2-resource-server`.
- Revisei a dependency JOSE redundante.
- Usei `BearerTokenAuthenticationFilter`.
- Configurei `DefaultBearerTokenResolver`.
- Proibi bearer em query parameter e form body.
- Criei `NimbusJwtDecoder` com public key.
- Fixei RS256.
- Configurei clock skew de 30 segundos.
- Validei issuer e audience.
- Criei `JwtAccessTokenProfileValidator`.
- Validei `typ=at+jwt`.
- Validei subject UUID e `jti`.
- Validei `iat`, `nbf`, `exp` e TTL máximo.
- Validei quantidade e formato de authorities.
- Criei `JwtAuthoritiesConverter`.
- Removi o prefixo automático `SCOPE_`.
- Criei entry point e denied handler Bearer.
- Diferenciei token ausente e `invalid_token`.
- Preservei `access_denied` para `403`.
- Ativei Resource Server na API chain.
- Desativei HTTP Basic nos endpoints protegidos.
- Mantive o login JSON com `AuthenticationManager`.
- Atualizei `/api/security/me` para `JwtAuthenticationToken`.
- Não expus o token na response.
- Testei bearer válido com JWS real.
- Testei Basic rejeitado.
- Testei token adulterado, expirado e incompatível.
- Testei issuer, audience, tipo, algoritmo, subject, `jti`, tempos e authorities.
- Testei `403` sem ROLE_ADMIN.
- Testei token ausente e em query.
- Preservei stateless e `no-store`.
- Atualizei OpenAPI com `bearerAuth`.
- Criei `docs/security/M15_JWT_RESOURCE_SERVER.md`.
- Atualizei baseline, threat model e OWASP.
- Registrei a janela de validade após bloqueio de conta.
- Não criei refresh token ou revogação.
- Próxima aula: Refresh token.
```

---

## Referência técnica curta

- [Spring Security — OAuth 2.0 Resource Server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring Security — OAuth 2.0 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)
- [Spring Security — Bearer Tokens](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/bearer-tokens.html)
- [Spring Security — Testing JWT Authentication](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html)
- [Spring Security — JwtDecoder](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/oauth2/jwt/JwtDecoder.html)
- [RFC 6750 — Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html)
- [RFC 8725 — JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)
- [RFC 9068 — JWT Access Token Profile](https://www.rfc-editor.org/rfc/rfc9068.html)

Regra final:

```text
a validação bearer deve usar o fluxo oficial do Resource Server, extrair tokens somente do header Authorization, fixar o algoritmo aceito, verificar a signature com public key e aplicar validators de tipo, issuer, audience, subject, tempos, jti e authorities antes de criar a Authentication; nesta baseline, HTTP Basic sai dos recursos, o login JSON permanece público e controlado, tokens inválidos retornam Problem Details genérico, tokens válidos sem permissão retornam 403 e o estado da conta permanece consistente apenas até a janela curta de expiração, complementada depois por refresh e revogação.
```
