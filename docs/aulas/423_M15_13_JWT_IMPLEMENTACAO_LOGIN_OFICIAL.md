# 423 - M15.13 - JWT implementacao login

## Apresentação da aula

Na aula 422, você desmontou a estrutura de um JWT assinado.

O modelo estudado foi:

```text
header;

payload;

signature.
```

O laboratório demonstrou que:

```text
header e payload
podem ser decodificados sem chave;

a signature detecta alterações;

signature válida
não substitui validação de claims.
```

Você também definiu um perfil inicial:

```text
proteção:
JWS.

tipo:
access token.

issuer:
formacao-java-api.

audience:
service-order-api.

subject:
UUID imutável do usuário.

duração:
cinco minutos no laboratório.

claims:
iss, sub, aud, iat, nbf, exp, jti e authorities.
```

A aplicação ainda autentica cada request por HTTP Basic, repetindo username, password, consulta ao PostgreSQL e password hashing.

A pergunta central desta aula será:

```text
como autenticar username e password
uma única vez no endpoint de login
e emitir um access token assinado,
sem ainda aceitar esse token
nos endpoints protegidos?
```

Nesta aula, login e emissão JWT serão implementados, mas bearer, filtro por request e refresh token continuarão ausentes. O token será validado apenas nos testes de emissão; a aula 424 o conectará à `SecurityFilterChain`.

O endpoint será:

```http
POST /api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "username": "operator",
  "password": "senha-sintetica"
}
```

Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 300
}
```

O endpoint reutilizará `AuthenticationManager`, `DaoAuthenticationProvider`, `DatabaseUserDetailsService` e `PasswordEncoder`. O controller apenas cria uma solicitação não autenticada; somente o resultado confiável será entregue ao `JwtEncoder`.

A assinatura usará:

```text
RS256.
```

A private key assinará.

A public key poderá verificar.

Esse desenho separa:

```text
emissor:
possui private key.

resource server:
precisa apenas da public key.
```

A chave ficará em `.secrets/jwt-lab.p12`, gerada localmente, ignorada pelo Git, protegida por password, montada read-only e nunca copiada para a imagem, logs ou tickets.

O formato PKCS12 armazenará:

- private key RSA;
- certificado com public key;
- alias;
- metadata da chave.

As passwords do keystore chegarão por variáveis de ambiente.

Elas não serão defaults da aplicação.

O header JWS utilizará:

```json
{
  "alg": "RS256",
  "typ": "at+jwt",
  "kid": "jwt-lab-2026-01"
}
```

O payload não incluirá username, e-mail, hash ou entity.

O `sub` será o UUID persistido.

As authorities serão copiadas em ordem estável.

Como bearer, o token poderá ser usado por quem o possuir. TLS, `no-store`, ausência de logs e dados sintéticos permanecem obrigatórios; armazenamento em cookie ou localStorage não será decidido nesta aula.

A próxima aula será:

```text
424 - M15.14 - Validacao de token e filtros
```

Nela, a public key será usada para validar o bearer token em cada request e transformar claims confiáveis em `Authentication`.

---

## Onde estamos na formação

A sequência atual é:

```text
421:
Autenticacao com banco.

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
```

A aula 422 respondeu:

```text
o que existe dentro de um JWT
e o que precisa ser validado?
```

A aula 423 responderá:

```text
como emitir um access token
somente depois de autenticar
a conta persistida?
```

Nesta aula:

```text
endpoint de login:
sim.

AuthenticationManager:
sim.

RS256:
sim.

PKCS12:
sim.

JwtEncoder:
sim.

claims:
sim.

response Bearer:
sim.

teste criptográfico:
sim.

BearerTokenAuthenticationFilter:
não.

JwtDecoder no runtime:
não.

resource server:
não.

refresh token:
não.
```

A regra central será:

```text
o login valida credenciais;

o emissor transforma
a identidade autenticada
em claims mínimos;

a private key assina;

a API ainda não aceita
o token até a validação
ser configurada.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── security
        └── jwt
            ├── JwtIssuerProperties.java
            ├── JwtSigningKeyPair.java
            ├── JwtKeyStoreLoader.java
            ├── JwtIssuerConfiguration.java
            └── JwtTokenService.java
```

Contrato web:

```text
src/main/java/br/com/formacao/backend
└── web
    └── auth
        ├── JwtLoginController.java
        ├── JwtLoginRequest.java
        └── JwtAccessTokenResponse.java
```

Erros:

```text
configuration/security/
└── InvalidLoginCredentialsException.java
```

Configuração:

```text
application-jwt-lab.yaml
```

Segredo local:

```text
.secrets/jwt-lab.p12
```

Documentação:

```text
docs/security/M15_JWT_LOGIN.md
```

Teste:

```text
JwtLoginIntegrationTest.java
```

O fluxo será:

```text
POST /api/auth/login;

validação do JSON;

AuthenticationManager.authenticate;

DatabaseUserPrincipal;

JwtTokenService.issue;

NimbusJwtEncoder;

RS256;

access token response.
```

Você irá:

1. adicionar o módulo JOSE;
2. criar um keystore local;
3. ignorar `.secrets`;
4. montar o arquivo no container;
5. criar properties validadas;
6. carregar RSA private e public keys;
7. criar `JwtEncoder`;
8. criar serviço de emissão;
9. criar request e response;
10. criar controller;
11. padronizar erro de login;
12. liberar apenas o endpoint;
13. preservar autenticação dos demais paths;
14. testar login válido;
15. testar password inválida;
16. testar conta bloqueada;
17. verificar signature no teste;
18. verificar claims;
19. provar que bearer ainda não é aceito;
20. atualizar documentação.

---

## Conceito essencial

### Login não é validação de bearer

Existem dois fluxos diferentes.

Login:

```text
username + password;

AuthenticationManager;

password hash;

identidade autenticada;

emissão de token.
```

Request protegida futura:

```text
Authorization: Bearer;

extração do token;

JwtDecoder;

validação criptográfica;

validação de claims;

Authentication;

autorização.
```

Misturar os dois fluxos em uma única classe produz acoplamento e dificulta testes.

Nesta aula, somente o primeiro fluxo será implementado.

---

### O controller não autentica

O controller recebe o contrato HTTP.

Ele não deve:

- buscar usuário;
- comparar password;
- verificar flags manualmente;
- montar `SecurityContext`;
- assinar por conta própria;
- acessar private key diretamente.

Ele chama um caso de uso ou serviço de login.

Esse serviço entrega a credencial ao `AuthenticationManager`.

---

### UsernamePasswordAuthenticationToken não autenticado

A solicitação é criada com:

```java
UsernamePasswordAuthenticationToken
        .unauthenticated(
                username,
                password
        );
```

Nesse momento:

```text
isAuthenticated:
false.
```

O token ainda não é confiável.

Somente o `AuthenticationManager` pode retornar o resultado autenticado.

Não use a factory `authenticated` no controller.

Isso permitiria criar uma identidade sem validar password.

---

### AuthenticationManager

O manager delega ao provider configurado na aula 421.

O `DaoAuthenticationProvider`:

1. normaliza e carrega o usuário;
2. verifica flags;
3. compara password com o hash;
4. retorna o principal autenticado;
5. remove credentials quando possível.

O login não precisa conhecer detalhes do repository.

---

### Falhas de login

Os seguintes cenários devem produzir o mesmo contrato externo:

- username inexistente;
- password incorreta;
- conta desabilitada;
- conta bloqueada;
- credentials expiradas;
- conta expirada.

Response:

```http
401 Unauthorized
Content-Type: application/problem+json
Cache-Control: no-store
```

Código:

```text
invalid_credentials.
```

O contrato não revela a causa.

Internamente, métricas podem diferenciar categorias com cuidado e acesso restrito.

A password nunca entra no log.

---

### Rate limiting de login

Password hashing torna o login alvo de brute force, credential stuffing e DoS. O limite por `X-Client-Id` não é suficiente; produção precisará de sinais de rede, limites globais, backoff, alertas e MFA. O laboratório continua NO-GO público.

---

### JwtEncoder

`JwtEncoder` recebe:

```text
JwsHeader;

JwtClaimsSet.
```

e devolve um `Jwt` com representação compacta.

`NimbusJwtEncoder` é a implementação do Spring Security baseada no Nimbus JOSE + JWT.

Ele assina JWS.

Ele não autentica username e password.

Ele também não configura automaticamente a validação de bearer.

---

### RS256

RS256 combina:

```text
RSA;

SHA-256.
```

A private key assina.

A public key verifica.

A chave RSA do laboratório terá:

```text
3072 bits.
```

O tamanho não elimina a necessidade de:

- rotação;
- proteção da private key;
- backup controlado;
- inventário;
- retirada;
- auditabilidade;
- algoritmo allowlisted.

---

### PKCS12

PKCS12 armazenará private key e certificado sob alias `jwt-signing`, com passwords externas. O arquivo não pode ficar em `src/main/resources`, pois seria empacotado no JAR.

---

### kid

O `kid` identifica qual chave assinou.

Nesta aula existe apenas uma chave, mas o header já prepara rotação.

O encoder também recebe o `kid` no JWK interno.

Isso evita ambiguidade quando mais de uma chave estiver disponível.

O valor não contém:

- path;
- alias secreto;
- hostname;
- informação sensível.

Exemplo:

```text
jwt-lab-2026-01.
```

---

### typ at+jwt

O header utilizará:

```text
at+jwt.
```

Esse tipo explicita que o objeto é um access token JWT.

A validação futura deverá exigir o tipo esperado.

Isso reduz confusão com:

- ID token;
- refresh token;
- reset token;
- e-mail verification token.

---

### Claims mínimos

O token terá:

```text
iss;

sub;

aud;

iat;

nbf;

exp;

jti;

authorities.
```

Não terá:

- username;
- e-mail;
- password;
- hash;
- flags internas;
- endereço;
- entidade;
- correlation ID;
- dados de request.

O subject UUID é suficiente para identificar o usuário.

As authorities serão usadas para autorização depois da validação.

---

### Ordenação de authorities

Collections podem não possuir ordem estável.

Antes de emitir:

```java
authentication
        .getAuthorities()
        .stream()
        .map(GrantedAuthority::getAuthority)
        .sorted()
        .toList();
```

A ordenação melhora:

- determinismo de testes;
- inspeção;
- comparação;
- consistência.

Ela não altera o significado da autorização.

---

### Access token response

O contrato usa nomes comuns:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 300
}
```

`expires_in` é expresso em segundos.

A response não inclui:

- refresh token;
- user entity;
- password;
- hash;
- private key;
- public key;
- internal authentication object.

---

### Cache e transporte

A response de login precisa de:

```http
Cache-Control: no-store
```

e não deve ser armazenada por browser, proxy ou observabilidade.

Fora de localhost:

```text
HTTPS obrigatório.
```

O token não deve aparecer em:

- query string;
- fragment de URL;
- logs;
- analytics;
- tracing;
- exception message;
- screenshot.

---

### Não salvar o token no banco

Um access token JWT assinado pode ser verificado pela public key.

Nesta etapa, ele não será persistido.

O banco também não receberá:

- hash do access token;
- `jti`;
- sessão;
- revogação.

Esses elementos serão avaliados nas aulas de refresh e revogação.

---

## Mão na massa guiada

### 1. Adicionar a dependency JOSE

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

Essa dependency fornece:

- `JwtEncoder`;
- `NimbusJwtEncoder`;
- `JwtClaimsSet`;
- `JwsHeader`;
- suporte Nimbus.

Não adicione outra biblioteca JWT paralela.

Valide:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security:spring-security-oauth2-jose,com.nimbusds:nimbus-jose-jwt"
```

---

### 2. Ignorar o diretório de secrets

No `.gitignore`:

```gitignore
.secrets/
```

Valide:

```powershell
git check-ignore `
  -v `
  ".secrets/jwt-lab.p12"
```

O arquivo precisa ser ignorado antes de ser criado.

---

### 3. Criar o keystore local

Crie o diretório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  ".secrets"
```

Execute o `keytool` sem password na linha de comando:

```powershell
keytool `
  -genkeypair `
  -alias "jwt-signing" `
  -keyalg RSA `
  -keysize 3072 `
  -sigalg SHA256withRSA `
  -validity 365 `
  -storetype PKCS12 `
  -keystore ".secrets/jwt-lab.p12" `
  -dname "CN=JWT Lab, OU=Formation, O=Local, C=BR"
```

O `keytool` solicitará a password interativamente.

Use somente uma password sintética do laboratório.

Não a reutilize.

---

### 4. Inspecionar sem exportar private key

```powershell
keytool `
  -list `
  -v `
  -keystore ".secrets/jwt-lab.p12" `
  -alias "jwt-signing"
```

Confirme:

- tipo PrivateKeyEntry;
- algoritmo RSA;
- tamanho;
- validade;
- alias.

Não copie fingerprints e metadata para um local público sem necessidade.

---

### 5. Criar JwtIssuerProperties

```java
package br.com.formacao.backend.configuration.security.jwt;

import java.time.Duration;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation
        .Validated;

@ConfigurationProperties(
        prefix = "app.security.jwt"
)
@Validated
public class JwtIssuerProperties {

    private boolean enabled;

    @NotBlank
    private String issuer;

    @NotBlank
    private String audience;

    @NotNull
    private Duration accessTokenTtl =
            Duration.ofMinutes(5);

    @NotBlank
    private String keyId;

    @NotBlank
    private String keyStoreLocation;

    @NotBlank
    private String keyStoreType =
            "PKCS12";

    @NotBlank
    private String keyStorePassword;

    @NotBlank
    private String keyAlias;

    @NotBlank
    private String keyPassword;

    @AssertTrue(
            message = """
                    JWT access token TTL must be
                    between 1 and 15 minutes
                    """
    )
    public boolean isTtlValid() {
        if (!enabled) {
            return true;
        }

        return !accessTokenTtl
                .minusMinutes(1)
                .isNegative()
                && accessTokenTtl
                        .compareTo(
                                Duration.ofMinutes(15)
                        ) <= 0;
    }

    // getters e setters
}
```

Não implemente `toString()` com secrets.

---

### 6. Criar JwtSigningKeyPair

```java
package br.com.formacao.backend.configuration.security.jwt;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public record JwtSigningKeyPair(
        RSAPublicKey publicKey,
        RSAPrivateKey privateKey
) {
}
```

O record não deve ser serializado.

---

### 7. Criar JwtKeyStoreLoader

```java
package br.com.formacao.backend.configuration.security.jwt;

import java.io.InputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

public final class JwtKeyStoreLoader {

    private JwtKeyStoreLoader() {
    }

    public static JwtSigningKeyPair load(
            JwtIssuerProperties properties,
            ResourceLoader resourceLoader
    ) {
        try {
            Resource resource =
                    resourceLoader.getResource(
                            properties
                                    .getKeyStoreLocation()
                    );

            KeyStore keyStore =
                    KeyStore.getInstance(
                            properties
                                    .getKeyStoreType()
                    );

            try (
                InputStream input =
                        resource.getInputStream()
            ) {
                keyStore.load(
                        input,
                        properties
                                .getKeyStorePassword()
                                .toCharArray()
                );
            }

            Key key =
                    keyStore.getKey(
                            properties
                                    .getKeyAlias(),
                            properties
                                    .getKeyPassword()
                                    .toCharArray()
                    );

            if (
                !(key instanceof
                        RSAPrivateKey privateKey)
            ) {
                throw new IllegalStateException(
                        "JWT signing key is not RSA private key"
                );
            }

            Certificate certificate =
                    keyStore.getCertificate(
                            properties
                                    .getKeyAlias()
                    );

            if (
                certificate == null
                || !(certificate.getPublicKey()
                        instanceof
                        RSAPublicKey publicKey)
            ) {
                throw new IllegalStateException(
                        "JWT verification key is not RSA public key"
                );
            }

            return new JwtSigningKeyPair(
                    publicKey,
                    privateKey
            );
        }
        catch (Exception exception) {
            throw new IllegalStateException(
                    "Could not load JWT signing material",
                    exception
            );
        }
    }
}
```

A exception pública não inclui path, alias ou password.

O stack trace interno precisa de acesso restrito.

---

### 8. Criar JwtIssuerConfiguration

```java
package br.com.formacao.backend.configuration.security.jwt;

import java.time.Clock;

import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.boot.context.properties
        .EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.oauth2.jose.jws
        .SignatureAlgorithm;
import org.springframework.security.oauth2.jwt
        .JwtEncoder;
import org.springframework.security.oauth2.jwt
        .NimbusJwtEncoder;

@Configuration(
        proxyBeanMethods = false
)
@EnableConfigurationProperties(
        JwtIssuerProperties.class
)
@ConditionalOnProperty(
        prefix = "app.security.jwt",
        name = "enabled",
        havingValue = "true"
)
public class JwtIssuerConfiguration {

    @Bean
    JwtSigningKeyPair jwtSigningKeyPair(
            JwtIssuerProperties properties,
            ResourceLoader resourceLoader
    ) {
        return JwtKeyStoreLoader.load(
                properties,
                resourceLoader
        );
    }

    @Bean
    JwtEncoder jwtEncoder(
            JwtSigningKeyPair keyPair,
            JwtIssuerProperties properties
    ) {
        return NimbusJwtEncoder
                .withKeyPair(
                        keyPair.publicKey(),
                        keyPair.privateKey()
                )
                .algorithm(
                        SignatureAlgorithm.RS256
                )
                .jwkPostProcessor(
                        builder ->
                                builder.keyID(
                                        properties
                                                .getKeyId()
                                )
                )
                .build();
    }

    @Bean
    Clock jwtClock() {
        return Clock.systemUTC();
    }
}
```

A API atual do Spring Security permite construir o encoder RSA diretamente pelo par de chaves.

Se o projeto estiver em uma linha anterior à API builder, utilize o `JWKSource` equivalente sem alterar a política.

---

### 9. Criar JwtAccessTokenResponse

```java
package br.com.formacao.backend.web.auth;

import com.fasterxml.jackson.annotation
        .JsonProperty;

public record JwtAccessTokenResponse(

        @JsonProperty("access_token")
        String accessToken,

        @JsonProperty("token_type")
        String tokenType,

        @JsonProperty("expires_in")
        long expiresIn

) {
}
```

Não sobrescreva `toString()`.

Records podem incluir valores no `toString` gerado.

Nunca registre esse response.

---

### 10. Criar JwtLoginRequest

```java
package br.com.formacao.backend.web.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JwtLoginRequest(

        @NotBlank
        @Size(max = 120)
        String username,

        @NotBlank
        @Size(max = 200)
        String password

) {
}
```

A password existe temporariamente como `String`.

Ela não pode ser zerada com segurança.

Por isso:

- não logar;
- não armazenar;
- não lançar em exceptions;
- não incluir em traces;
- manter o objeto com escopo curto.

---

### 11. Criar InvalidLoginCredentialsException

```java
package br.com.formacao.backend.configuration.security;

public final class
        InvalidLoginCredentialsException
        extends RuntimeException {

    public InvalidLoginCredentialsException() {
        super(
                "Invalid login credentials"
        );
    }
}
```

Ela não revela a causa.

---

### 12. Criar JwtTokenService

```java
package br.com.formacao.backend.configuration.security.jwt;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core
        .Authentication;
import org.springframework.security.core
        .GrantedAuthority;
import org.springframework.security.oauth2.jose.jws
        .SignatureAlgorithm;
import org.springframework.security.oauth2.jwt
        .JwsHeader;
import org.springframework.security.oauth2.jwt
        .Jwt;
import org.springframework.security.oauth2.jwt
        .JwtClaimsSet;
import org.springframework.security.oauth2.jwt
        .JwtEncoder;
import org.springframework.security.oauth2.jwt
        .JwtEncoderParameters;
import org.springframework.stereotype.Service;

import br.com.formacao.backend.configuration.security
        .DatabaseUserPrincipal;
import br.com.formacao.backend.web.auth
        .JwtAccessTokenResponse;

@Service
public class JwtTokenService {

    private final JwtEncoder encoder;
    private final JwtIssuerProperties properties;
    private final Clock clock;

    public JwtTokenService(
            JwtEncoder encoder,
            JwtIssuerProperties properties,
            Clock clock
    ) {
        this.encoder = encoder;
        this.properties = properties;
        this.clock = clock;
    }

    public JwtAccessTokenResponse issue(
            Authentication authentication
    ) {
        if (
            !(authentication.getPrincipal()
                    instanceof
                    DatabaseUserPrincipal principal)
        ) {
            throw new IllegalStateException(
                    "Authenticated principal is not supported"
            );
        }

        Instant issuedAt =
                clock.instant();

        Instant expiresAt =
                issuedAt.plus(
                        properties
                                .getAccessTokenTtl()
                );

        List<String> authorities =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(
                                GrantedAuthority
                                        ::getAuthority
                        )
                        .sorted()
                        .toList();

        JwsHeader header =
                JwsHeader
                        .with(
                                SignatureAlgorithm.RS256
                        )
                        .type(
                                "at+jwt"
                        )
                        .keyId(
                                properties
                                        .getKeyId()
                        )
                        .build();

        JwtClaimsSet claims =
                JwtClaimsSet
                        .builder()
                        .issuer(
                                properties
                                        .getIssuer()
                        )
                        .subject(
                                principal
                                        .getUserId()
                                        .toString()
                        )
                        .audience(
                                List.of(
                                        properties
                                                .getAudience()
                                )
                        )
                        .issuedAt(
                                issuedAt
                        )
                        .notBefore(
                                issuedAt
                        )
                        .expiresAt(
                                expiresAt
                        )
                        .id(
                                UUID.randomUUID()
                                        .toString()
                        )
                        .claim(
                                "authorities",
                                authorities
                        )
                        .build();

        Jwt jwt =
                encoder.encode(
                        JwtEncoderParameters
                                .from(
                                        header,
                                        claims
                                )
                );

        return new JwtAccessTokenResponse(
                jwt.getTokenValue(),
                "Bearer",
                properties
                        .getAccessTokenTtl()
                        .toSeconds()
        );
    }
}
```

O serviço recebe somente uma identidade já autenticada.

---

### 13. Criar JwtLoginController

```java
package br.com.formacao.backend.web.auth;

import jakarta.validation.Valid;

import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication
        .AuthenticationManager;
import org.springframework.security.authentication
        .UsernamePasswordAuthenticationToken;
import org.springframework.security.core
        .Authentication;
import org.springframework.security.core
        .AuthenticationException;
import org.springframework.web.bind.annotation
        .PostMapping;
import org.springframework.web.bind.annotation
        .RequestBody;
import org.springframework.web.bind.annotation
        .RequestMapping;
import org.springframework.web.bind.annotation
        .RestController;

import br.com.formacao.backend.configuration.security
        .InvalidLoginCredentialsException;
import br.com.formacao.backend.configuration.security.jwt
        .JwtTokenService;

@RestController
@RequestMapping("/api/auth")
@ConditionalOnProperty(
        prefix = "app.security.jwt",
        name = "enabled",
        havingValue = "true"
)
public class JwtLoginController {

    private final AuthenticationManager
            authenticationManager;

    private final JwtTokenService
            tokenService;

    public JwtLoginController(
            AuthenticationManager
                    authenticationManager,
            JwtTokenService tokenService
    ) {
        this.authenticationManager =
                authenticationManager;
        this.tokenService =
                tokenService;
    }

    @PostMapping("/login")
    ResponseEntity<JwtAccessTokenResponse>
    login(
            @Valid
            @RequestBody
            JwtLoginRequest request
    ) {
        try {
            Authentication authentication =
                    authenticationManager
                            .authenticate(
                                    UsernamePasswordAuthenticationToken
                                            .unauthenticated(
                                                    request
                                                            .username(),
                                                    request
                                                            .password()
                                            )
                            );

            return ResponseEntity
                    .ok()
                    .cacheControl(
                            CacheControl
                                    .noStore()
                    )
                    .body(
                            tokenService.issue(
                                    authentication
                            )
                    );
        }
        catch (
            AuthenticationException exception
        ) {
            throw new InvalidLoginCredentialsException();
        }
    }
}
```

Não registre o objeto `request`.

---

### 14. Mapear invalid_credentials

No `GlobalExceptionHandler`:

```java
@ExceptionHandler(
        InvalidLoginCredentialsException.class
)
ResponseEntity<ProblemDetail>
handleInvalidLoginCredentials(
        InvalidLoginCredentialsException exception,
        HttpServletRequest request
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid username or password."
            );

    problem.setTitle(
            "Invalid credentials"
    );

    problem.setType(
            URI.create(
                    "urn:problem:invalid-credentials"
            )
    );

    problem.setProperty(
            "code",
            "invalid_credentials"
    );

    addCorrelationId(
            problem,
            request
    );

    return ResponseEntity
            .status(
                    HttpStatus.UNAUTHORIZED
            )
            .cacheControl(
                    CacheControl.noStore()
            )
            .contentType(
                    MediaType.APPLICATION_PROBLEM_JSON
            )
            .body(problem);
}
```

Conta bloqueada e password inválida produzem o mesmo body.

---

### 15. Liberar apenas o login

Na API chain, antes de `anyRequest()`:

```java
.requestMatchers(
        HttpMethod.POST,
        "/api/auth/login"
)
.permitAll()
```

Preserve:

```text
OPTIONS preflight:
permitAll.

demais /api/**:
authenticated.
```

Não libere:

```text
/api/auth/**.
```

Um wildcard amplo abriria endpoints futuros por acidente.

---

### 16. Criar application-jwt-lab.yaml

```yaml
spring:
  config:
    activate:
      on-profile: jwt-lab

app:
  security:
    jwt:
      enabled: true
      issuer: formacao-java-api
      audience: service-order-api
      access-token-ttl: 5m
      key-id: jwt-lab-2026-01
      key-store-location: file:/run/secrets/jwt-lab.p12
      key-store-type: PKCS12
      key-store-password:
        ${APP_SECURITY_JWT_KEYSTORE_PASSWORD}
      key-alias: jwt-signing
      key-password:
        ${APP_SECURITY_JWT_KEY_PASSWORD}
```

Sem as passwords, o startup falha.

---

### 17. Montar o keystore no Compose local

No serviço da API:

```yaml
volumes:
  - type: bind
    source: ./.secrets/jwt-lab.p12
    target: /run/secrets/jwt-lab.p12
    read_only: true
```

Esse mount pertence ao override local.

Não adicione a private key à imagem.

Valide:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config
```

Confirme somente path e read-only.

Não imprima passwords.

---

### 18. Criar a configuração de teste

Em `JwtLoginIntegrationTest`, use uma chave RSA efêmera.

```java
@TestConfiguration(
        proxyBeanMethods = false
)
static class JwtTestConfiguration {

    @Bean
    KeyPair testJwtKeyPair()
            throws Exception {

        KeyPairGenerator generator =
                KeyPairGenerator.getInstance(
                        "RSA"
                );

        generator.initialize(
                2048
        );

        return generator.generateKeyPair();
    }

    @Bean
    @Primary
    JwtEncoder testJwtEncoder(
            KeyPair pair
    ) {
        return NimbusJwtEncoder
                .withKeyPair(
                        (RSAPublicKey)
                                pair.getPublic(),
                        (RSAPrivateKey)
                                pair.getPrivate()
                )
                .algorithm(
                        SignatureAlgorithm.RS256
                )
                .jwkPostProcessor(
                        builder ->
                                builder.keyID(
                                        "jwt-test-key"
                                )
                )
                .build();
    }

    @Bean
    JwtDecoder testJwtDecoder(
            KeyPair pair
    ) {
        return NimbusJwtDecoder
                .withPublicKey(
                        (RSAPublicKey)
                                pair.getPublic()
                )
                .signatureAlgorithm(
                        SignatureAlgorithm.RS256
                )
                .build();
    }
}
```

O decoder existe somente no teste para verificar a emissão.

Ele não entra na filter chain.

---

### 19. Preparar o usuário de teste

Use o fixture PostgreSQL da aula 421.

Crie um usuário com:

```text
username:
operator.

password:
Laboratorio-JWT-M15!2026.

authorities:
ROLE_OPERATOR;
service-order:read;
service-order:write.
```

O hash é gerado pelo `PasswordEncoder`.

A raw password existe somente na suíte.

---

### 20. Testar login válido

```java
@Test
void shouldIssueAccessTokenForValidCredentials()
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
            .andExpect(
                    header().string(
                            HttpHeaders.CACHE_CONTROL,
                            containsString(
                                    "no-store"
                            )
                    )
            )
            .andExpect(
                    jsonPath("$.token_type")
                            .value("Bearer")
            )
            .andExpect(
                    jsonPath("$.expires_in")
                            .value(300)
            )
            .andExpect(
                    jsonPath("$.access_token")
                            .isString()
            )
            .andExpect(
                    jsonPath("$.password")
                            .doesNotExist()
            )
            .andExpect(
                    jsonPath("$.passwordHash")
                            .doesNotExist()
            )
            .andReturn();

    String token =
            objectMapper
                    .readTree(
                            result
                                    .getResponse()
                                    .getContentAsString()
                    )
                    .get(
                            "access_token"
                    )
                    .asText();

    assertThat(
            token.split("\\.")
    )
    .hasSize(3);
}
```

Não imprima `token`.

---

### 21. Verificar signature e claims no teste

```java
Jwt jwt =
        jwtDecoder.decode(
                token
        );

assertThat(
        jwt.getHeaders()
)
.containsEntry(
        "typ",
        "at+jwt"
)
.containsEntry(
        "kid",
        "jwt-test-key"
);

assertThat(
        jwt.getIssuer()
                .toString()
)
.isEqualTo(
        "formacao-java-api"
);

assertThat(
        jwt.getAudience()
)
.containsExactly(
        "service-order-api"
);

assertThat(
        jwt.getSubject()
)
.isEqualTo(
        userId.toString()
);

assertThat(
        jwt.getClaimAsStringList(
                "authorities"
        )
)
.containsExactly(
        "ROLE_OPERATOR",
        "service-order:read",
        "service-order:write"
);

assertThat(
        jwt.getExpiresAt()
)
.isEqualTo(
        jwt.getIssuedAt()
                .plusSeconds(300)
);

assertThat(
        jwt.getId()
)
.isNotBlank();
```

A ordenação precisa ser estável.

---

### 22. Testar falhas iguais

Crie cenários para:

- username inexistente;
- password incorreta;
- usuário bloqueado;
- usuário desabilitado.

Todos:

```text
401;

application/problem+json;

code invalid_credentials;

Cache-Control no-store;

sem access_token;

sem WWW-Authenticate Basic obrigatório no login.
```

O endpoint de login possui contrato próprio.

---

### 23. Testar validação de request

Cenários:

```text
username vazio;

password vazia;

username maior que 120;

password maior que 200;

JSON inválido;

Content-Type incorreto.
```

Resultados:

```text
400 ou 415
conforme o contrato existente.
```

A password não pode aparecer nas mensagens de validation.

---

### 24. Provar que bearer ainda não funciona

Depois de obter o token:

```java
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
        status().isUnauthorized()
);
```

Esse resultado é esperado.

A filter chain ainda não possui OAuth2 Resource Server ou filtro bearer.

A aula 424 mudará esse teste para `200`.

---

### 25. Testar CORS do login

Preflight:

```text
POST /api/auth/login;

Origin permitida;

Content-Type permitido;

200.
```

Request real com origin permitida:

```text
Access-Control-Allow-Origin correto;

response 200 para credencial válida.
```

Uma origin rejeitada não recebe autorização CORS.

O login continua sendo processado conforme a política do browser e do servidor.

---

### 26. Executar a suíte

```powershell
.\mvnw.cmd `
  -Dtest=JwtLoginIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- PostgreSQL real;
- RSA efêmera no teste;
- nenhum arquivo de chave versionado;
- nenhum token em reports;
- login válido e inválido;
- bearer ainda rejeitado;
- nenhuma sessão.

---

### 27. Subir o laboratório local

Defina:

```powershell
$env:SPRING_PROFILES_ACTIVE =
  "local,db-auth-lab,jwt-lab"

$env:APP_SECURITY_JWT_KEYSTORE_PASSWORD =
  Read-Host `
    "JWT keystore password" `
    -AsSecureString
```

Variáveis de ambiente de processos precisam de texto.

Converta somente na sessão e remova ao final, como nos laboratórios anteriores.

Defina também:

```text
APP_SECURITY_JWT_KEY_PASSWORD.
```

Nunca coloque passwords no `.docker/compose.local.env` versionado.

---

### 28. Executar login real

Use um body em memória:

```powershell
$loginBody =
  @{
    username = "operator"
    password = $rawLabPassword
  } |
  ConvertTo-Json
```

Request:

```powershell
$response =
  Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:8081/api/auth/login" `
    -ContentType "application/json" `
    -Body $loginBody
```

Inspecione apenas:

```powershell
$response.token_type
$response.expires_in
```

Não imprima:

```powershell
$response.access_token
```

---

### 29. Inspecionar somente metadata local

Para compreender a estrutura, use uma ferramenta local controlada ou um pequeno script que decodifique apenas o token sintético.

Não envie o token para sites de debug JWT.

Mesmo em laboratório, criar esse hábito é perigoso.

A private key nunca sai do processo emissor.

---

### 30. Atualizar OpenAPI

Documente:

```text
POST /api/auth/login;

request username/password;

200 access token;

400 validation;

401 invalid_credentials;

429 futuro para login throttling;

no-store;

TLS obrigatório.
```

Não marque `bearerAuth` nos endpoints protegidos ainda.

O token não é aceito pela API nesta aula.

---

### 31. Atualizar documentação de segurança

Crie:

```text
docs/security/M15_JWT_LOGIN.md
```

Registre:

- endpoint;
- fluxo;
- key store;
- algoritmo;
- `kid`;
- claims;
- TTL;
- contrato;
- falhas;
- CORS;
- cache;
- testes;
- riscos;
- ausência de bearer validation;
- produção NO-GO.

Atualize:

- baseline;
- threat model;
- OWASP;
- JWT concepts;
- database authentication;
- password storage;
- OpenAPI.

---

### 32. Atualizar threat model

Adicione:

```text
THR-034:
login expõe motivo da falha.

THR-035:
credential stuffing.

THR-036:
password hashing usado para DoS.

THR-037:
private key entra na imagem ou Git.

THR-038:
token completo entra em log.

THR-039:
claims excessivos vazam dados.

THR-040:
token emitido com principal incompatível.

THR-041:
endpoint auth wildcard libera paths futuros.
```

Controles:

- erro genérico;
- endpoint exato;
- no-store;
- private key externa;
- profile;
- TTL curto;
- claims mínimos;
- provider padrão;
- testes.

---

### 33. Encerrar e limpar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Remova:

```powershell
Remove-Item `
  Env:APP_SECURITY_JWT_KEYSTORE_PASSWORD,
  Env:APP_SECURITY_JWT_KEY_PASSWORD,
  Env:SPRING_PROFILES_ACTIVE `
  -ErrorAction SilentlyContinue
```

Limpe também:

- body de login;
- raw password;
- response com token;
- variáveis PowerShell.

O keystore pode permanecer em `.secrets` para o laboratório local, desde que continue ignorado e protegido.

---

## Entendendo o que foi feito

### O login reutilizou a autenticação existente

Repository e password hashing não foram duplicados.

### A emissão começou após o sucesso

Nenhum token foi criado para uma identidade não autenticada.

### O subject ficou estável

O UUID substituiu username mutável.

### Claims ficaram mínimos

Somente contexto necessário foi transferido.

### A chave ficou fora da aplicação

O JAR e a imagem não receberam private key.

### A assinatura ficou assimétrica

Verificadores futuros usarão apenas public key.

### O contrato ficou cache-safe

A response recebeu `no-store`.

### Bearer continuou desativado

A emissão não foi confundida com validação por request.

---

## Erros comuns importantes

### Consultar repository no controller

Isso duplica a arquitetura de autenticação.

### Comparar password manualmente

O `DaoAuthenticationProvider` já executa esse papel.

### Criar token antes de authenticate

Uma identidade não confiável seria assinada.

### Colocar private key em resources

Ela seria empacotada no JAR.

### Versionar keystore de teste

Private key continua sendo segredo.

### Incluir username como subject

Username pode mudar.

### Retornar entity no login

Dados e hash podem vazar.

### Logar o response record

O `toString` pode conter o token.

### Aceitar `/api/auth/**`

Endpoints futuros ficariam públicos.

### Achar que emissão já protege a API

O bearer ainda não é validado.

---

## Comandos úteis

### Dependency JOSE

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security:spring-security-oauth2-jose,com.nimbusds:nimbus-jose-jwt"
```

### Verificar ignore

```powershell
git check-ignore `
  -v `
  ".secrets/jwt-lab.p12"
```

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=JwtLoginIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Listar keystore

```powershell
keytool `
  -list `
  -keystore ".secrets/jwt-lab.p12" `
  -alias "jwt-signing"
```

### Procurar tokens versionados

```powershell
git grep `
  -n `
  -E `
  "eyJ[a-zA-Z0-9_-]+\."
```

---

## Exercício guiado

### Parte 1 — Dependency

Adicione JOSE sem biblioteca paralela.

### Parte 2 — Chave

Crie PKCS12 fora do Git.

### Parte 3 — Properties

Valide issuer, audience, TTL, `kid` e key store.

### Parte 4 — Encoder

Carregue RSA e crie `NimbusJwtEncoder`.

### Parte 5 — Token

Emita claims mínimos com `JwtTokenService`.

### Parte 6 — Login

Autentique com `AuthenticationManager`.

### Parte 7 — Erros

Unifique falhas em `invalid_credentials`.

### Parte 8 — Chain

Libere somente `POST /api/auth/login`.

### Parte 9 — Testes

Valide signature, claims, falhas e bearer ausente.

### Parte 10 — Operação

Monte key store read-only e limpe secrets.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- login e validação bearer permanecem separados;
- `POST /api/auth/login` recebe JSON validado;
- `spring-security-oauth2-jose` foi adicionado sem stack JWT paralela;
- `JwtEncoder` e `NimbusJwtEncoder` assinam com RS256;
- chave RSA local fica em PKCS12 ignorado pelo Git;
- private key não entra no JAR, imagem, log ou evidência;
- keystore é criado interativamente e montado read-only;
- properties validam issuer, audience, TTL, `kid`, alias e localização;
- secrets não possuem defaults nem aparecem em `toString`;
- key pair é carregado com falha segura;
- `typ=at+jwt` e `kid` são emitidos;
- request limita username e password;
- response usa `access_token`, `token_type` e `expires_in`;
- response e request de login não são logados;
- `AuthenticationManager` autentica antes da emissão;
- controller não consulta repository nem compara password;
- token usa `DatabaseUserPrincipal` e subject UUID;
- claims incluem issuer, audience, tempos, `jti` e authorities ordenadas;
- username, password, hash e entity não entram no token;
- access token dura cinco minutos e não é persistido;
- login e falhas usam `Cache-Control: no-store`;
- falhas de conta e credencial retornam `invalid_credentials`;
- correlation ID e Problem Details foram preservados;
- somente o path exato do login é público;
- demais endpoints continuam autenticados;
- CORS e validation do login foram testados;
- OpenAPI documenta emissão sem declarar bearer ativo;
- testes usam RSA efêmera e PostgreSQL real;
- decoder de teste não entra na filter chain;
- signature, header, claims, TTL e authorities foram verificados;
- password e hash não aparecem na response;
- usuário inexistente, password inválida e flags foram testados;
- token emitido ainda recebe `401` como bearer;
- nenhuma sessão, chave ou token foi persistido;
- rate limiting específico de login foi registrado como gap;
- threat model, baseline, OWASP e documentos JWT foram atualizados;
- produção pública continua NO-GO;
- filtro bearer e refresh token não foram antecipados;
- gate completo e commit recomendado estão prontos.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git check-ignore -v ".secrets/jwt-lab.p12"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Confirme que `.secrets` não apareceu no staging:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m15): emitir access token JWT no login"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- private key;
- public key desnecessária;
- keystore;
- store password;
- key password;
- raw password;
- access token;
- Authorization header;
- response de login;
- env file;
- logs com credenciais;
- decoder de runtime antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação passou a emitir access tokens assinados.

O fluxo ficou:

```text
POST /api/auth/login;

username e password;

AuthenticationManager;

DaoAuthenticationProvider;

DatabaseUserDetailsService;

PasswordEncoder;

DatabaseUserPrincipal;

JwtTokenService;

NimbusJwtEncoder;

RS256;

access token.
```

O token contém:

```text
typ at+jwt;

kid;

issuer;

subject UUID;

audience;

issued-at;

not-before;

expiration;

JWT ID;

authorities.
```

A implementação manteve:

```text
private key fora do Git;

claims mínimos;

no-store;

falha genérica;

TTL curto;

sem sessão;

sem refresh token;

sem token em logs.
```

Decisão:

```text
o token somente pode ser emitido
depois que o AuthenticationManager
retorna uma identidade confiável;

o JwtEncoder assina claims,
mas não substitui
a autenticação da password.
```

O bearer token ainda não abre nenhum endpoint.

Isso não é defeito.

É a separação pedagógica e arquitetural desta aula.

A próxima aula será:

```text
424 - M15.14 - Validacao de token e filtros
```

Nela, você irá:

- adicionar suporte Resource Server;
- criar `JwtDecoder`;
- usar somente a public key;
- validar RS256;
- exigir `typ=at+jwt`;
- validar issuer;
- validar audience;
- validar expiração e `nbf`;
- converter authorities;
- processar `Authorization: Bearer`;
- criar `Authentication`;
- remover HTTP Basic dos endpoints de negócio;
- testar token válido, adulterado, expirado e incompatível;
- manter o login público e controlado.

Refresh token continuará reservado para a aula 425.

---

# Material complementar

## Checkpoint final

- [ ] Criei o endpoint de login.
- [ ] Reutilizei o `AuthenticationManager`.
- [ ] Mantive a private key fora do Git.
- [ ] Emitei token RS256 com claims mínimos.
- [ ] Testei que bearer ainda não é aceito.

---

## Troubleshooting adicional

### O encoder não inicia

Confirme:

- profile `jwt-lab`;
- path montado;
- alias;
- passwords;
- tipo PKCS12;
- private key RSA.

### O keystore funciona no host, mas não no container

Confirme o bind mount e o path:

```text
/run/secrets/jwt-lab.p12.
```

Valide permissões de leitura do usuário não root.

### O login válido retorna 401

Confirme o usuário persistido, o `AuthenticationManager` e o hash.

O problema pode estar antes da emissão JWT.

### O header não contém kid

Confirme `jwkPostProcessor` e `JwsHeader.keyId`.

Os dois devem usar o mesmo valor.

### O subject contém username

Use o UUID de `DatabaseUserPrincipal`.

Não utilize `authentication.getName()` como subject.

### O teste aceita Bearer

Alguma configuração de Resource Server foi antecipada.

Remova-a até a aula 424.

### O token apareceu no relatório

Remova logs, `println`, assertion messages e dumps de response.

### O keytool pede passwords incompatíveis

Use uma password de laboratório conforme os requisitos do PKCS12 e registre-a somente no secret local.

---

## Perguntas de revisão

1. Qual endpoint emite o token?
2. Quem autentica username e password?
3. O controller consulta o repository?
4. Qual token inicia a autenticação?
5. Quando o JWT pode ser emitido?
6. Qual algoritmo foi usado?
7. Quem possui a private key?
8. Quem precisará da public key?
9. Onde fica o keystore?
10. Ele pode ir para o Git?
11. Para que serve `kid`?
12. Qual `typ` foi usado?
13. O que foi usado como subject?
14. Username entrou no payload?
15. Qual é o TTL?
16. O token é persistido?
17. Qual code representa login inválido?
18. Bearer já funciona na API?
19. Por que usar no-store?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `POST /api/auth/login`.
2. `AuthenticationManager` e provider.
3. Não.
4. `UsernamePasswordAuthenticationToken` não autenticado.
5. Depois do sucesso da autenticação.
6. RS256.
7. O emissor.
8. O resource server.
9. Em `.secrets`, montado read-only.
10. Não.
11. Identificar a chave.
12. `at+jwt`.
13. UUID persistido.
14. Não.
15. Cinco minutos no laboratório.
16. Não.
17. `invalid_credentials`.
18. Não.
19. Evitar cache da credencial.
20. Validação de token e filtros.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 423 - M15.13 - JWT implementacao login

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Separei emissão de token e validação bearer.
- Adicionei `spring-security-oauth2-jose`.
- Mantive uma única stack JWT no projeto.
- Escolhi RS256 para o laboratório.
- Criei uma chave RSA local em PKCS12.
- Mantive `.secrets/` fora do Git.
- Montei o keystore read-only no container.
- Não copiei private key para JAR ou imagem.
- Criei `JwtIssuerProperties`.
- Validei issuer, audience, TTL, `kid` e keystore.
- Criei `JwtSigningKeyPair`.
- Criei `JwtKeyStoreLoader`.
- Carreguei private e public keys RSA.
- Criei `NimbusJwtEncoder`.
- Configurei RS256 e `kid`.
- Criei `JwtLoginRequest`.
- Criei `JwtAccessTokenResponse`.
- Criei `InvalidLoginCredentialsException`.
- Criei `JwtTokenService`.
- Usei `typ=at+jwt`.
- Usei UUID persistido como subject.
- Emitei issuer, audience, iat, nbf, exp e jti.
- Emitei authorities ordenadas.
- Não incluí username, password, hash ou entity no token.
- Criei `JwtLoginController`.
- Autentiquei com `AuthenticationManager`.
- Não consultei repository no controller.
- Não comparei password manualmente.
- Padronizei falhas em `invalid_credentials`.
- Liberei somente `POST /api/auth/login`.
- Mantive os demais endpoints autenticados.
- Criei `application-jwt-lab.yaml`.
- Testei com RSA efêmera.
- Validei signature, header e claims.
- Testei credenciais inválidas e flags de conta.
- Testei `Cache-Control: no-store`.
- Comprovei que bearer ainda retorna `401`.
- Atualizei OpenAPI, baseline, threat model e documentos JWT.
- Registrei rate limiting específico de login como gap.
- Não criei decoder de runtime, filtro bearer ou refresh token.
- Próxima aula: Validacao de token e filtros.
```

---

## Referência técnica curta

- [Spring Security — JwtEncoder](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/oauth2/jwt/JwtEncoder.html)
- [Spring Security — NimbusJwtEncoder](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/oauth2/jwt/NimbusJwtEncoder.html)
- [Spring Security — JwtClaimsSet](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/oauth2/jwt/JwtClaimsSet.html)
- [Spring Security — AuthenticationManager](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/authentication/AuthenticationManager.html)
- [Spring Security — Username/Password Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/index.html)
- [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html)
- [RFC 8725 — JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)
- [RFC 9068 — JWT Access Token Profile](https://www.rfc-editor.org/rfc/rfc9068.html)

Regra final:

```text
a emissão de JWT precisa ocorrer somente depois da autenticação completa pelo AuthenticationManager, reutilizando o provider, o UserDetailsService e o PasswordEncoder já existentes; nesta baseline, o endpoint público exato recebe username e password, falhas são genéricas, a private key RSA permanece fora do Git e da imagem, o NimbusJwtEncoder emite um access token RS256 de curta duração com typ, kid e claims mínimos, a response usa no-store e o bearer continua rejeitado até que a public key, os validators e o filtro de request sejam configurados na próxima aula.
```
