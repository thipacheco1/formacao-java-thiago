# 436 - M15.26 - Login com Keycloak

## Apresentação da aula

Na aula 435, o projeto ganhou um OpenID Provider local executável.

A infraestrutura ficou composta por:

```text
Keycloak 26.7.0;

PostgreSQL 17.10;

volume persistente;

rede dedicada;

banco sem porta publicada;

interface principal em:
127.0.0.1:8180;

management em:
127.0.0.1:9190;

secrets por arquivo.
```

Também foram validados:

```text
startup;

liveness;

readiness;

health agregado;

metrics;

discovery;

JWKS.
```

O realm `master` foi utilizado somente para administração e comprovação operacional.

Nenhum elemento funcional da aplicação foi criado.

Ainda não existem:

- realm da formação;
- client OIDC da aplicação;
- redirect URI;
- usuário de laboratório;
- login real;
- sessão local criada pelo Spring Security;
- callback OIDC;
- validação de ID Token pela aplicação.

A pergunta central desta aula será:

```text
como autenticar um usuário real
no Keycloak por Authorization Code
com OpenID Connect e PKCE,
sem transformar a API inteira
em uma aplicação stateful
e sem expor tokens ao navegador?
```

A solução criará um laboratório de login dentro do mesmo projeto Spring Boot.

O laboratório será isolado em:

```text
profile:
keycloak-login-lab.

paths:
    /labs/keycloak/**
    /oauth2/**
    /login/oauth2/**
```

A aplicação continuará possuindo duas naturezas distintas.

API:

```text
/api/**;

Bearer Token;

stateless;

401 em autenticação ausente;

sem redirect para tela de login.
```

Laboratório OIDC:

```text
/labs/keycloak/**;

Authorization Code;

PKCE S256;

sessão HTTP local;

redirect para Keycloak;

ID Token validado pelo Spring Security.
```

A separação será feita por uma nova `SecurityFilterChain` de ordem superior.

Ela não substituirá:

- a chain da API;
- o Resource Server;
- as permissions;
- ownership;
- refresh token próprio;
- contratos `401`, `403` e `404`.

Nesta aula, o objetivo é autenticação interativa.

A migração completa da API para tokens emitidos pelo Keycloak não será realizada.

O fluxo será:

```text
1. navegador acessa
   /labs/keycloak;

2. usuário inicia login;

3. Spring redireciona para
   o authorization endpoint;

4. Keycloak autentica
   o usuário;

5. Keycloak devolve
   authorization code;

6. Spring troca code
   por tokens;

7. Spring valida
   o ID Token;

8. aplicação cria
   sessão local;

9. /labs/keycloak/me
   mostra claims permitidas.
```

O navegador verá redirects, `state`, authorization code e cookie local, mas não receberá tokens, client secret, password ou ID Token raw em JavaScript.

O client do Keycloak será público:

```text
client authentication:
Off.

client secret:
inexistente.
```

No Spring Security:

```text
client-authentication-method:
none.
```

A ausência de secret é deliberada.

O client público será protegido por Authorization Code, PKCE S256, redirect URI exata, `state`, `nonce` e TLS em produção. Sem PKCE correto, o login falhará.

A aula também provará que o Spring Security usa PKCE automaticamente quando o client é público, está configurado com método de autenticação `none` e não possui client secret.

O realm será:

```text
formacao-java.
```

O client será:

```text
formacao-java-login-lab.
```

O usuário de laboratório será:

```text
aluno.keycloak.
```

A password será definida localmente no Admin Console e nunca armazenada no Git.

A redirect URI será exata:

```text
http://localhost:8081/login/oauth2/code/keycloak-lab
```

O Web Origin será:

```text
http://localhost:8081
```

O laboratório utilizará:

```text
http://localhost:8081/labs/keycloak
```

como página inicial.

A aplicação receberá:

```text
spring-boot-starter-oauth2-client;

KeycloakLoginLabSecurityConfiguration;

KeycloakLoginLabController;

KeycloakIdentityResponse;

application-keycloak-login-lab.yaml;

KeycloakLoginLabSecurityTest.
```

O controller devolverá uma allowlist com issuer, subject, username preferido, nome, e-mail, verificação e instante de autenticação, sem tokens, code, nonce, state, sessão, claims completas ou roles.

Roles e authorities do Keycloak não serão modeladas nesta aula.

A próxima aula oficial será:

```text
437 - M15.27 - Multi tenancy seguranca
```

Nela, a identidade autenticada será analisada no contexto de isolamento entre tenants, sem confiar em tenant IDs enviados livremente pelo cliente.

---

## Onde estamos na formação

A sequência oficial é:

```text
434:
PKCE.

435:
Keycloak ambiente local.

436:
Login com Keycloak.

437:
Multi tenancy seguranca.

438:
LGPD para backend.

439:
Testes de seguranca.
```

A aula 435 respondeu:

```text
como disponibilizar
um OpenID Provider
local e observável?
```

A aula 436 responderá:

```text
como realizar
uma autenticação OIDC real
contra esse provedor?
```

Nesta aula:

```text
realm dedicado:
sim.

client OIDC:
sim.

Authorization Code:
sim.

PKCE S256:
sim.

usuário local:
sim.

oauth2Login:
sim.

sessão do laboratório:
sim.

ID Token:
validado.

claims:
minimizadas.

API stateless:
preservada.

roles Keycloak:
não.

multi-tenancy:
próxima aula.

logout OIDC:
não.
```

A regra central será:

```text
o login interativo
pode usar sessão e redirects
em uma chain isolada;

a API continua stateless
e não deve redirecionar
um consumidor HTTP para HTML.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/java/br/com/formacao/backend/
└── configuration
    └── security
        └── keycloak
            ├── KeycloakLoginLabSecurityConfiguration.java
            ├── KeycloakLoginLabController.java
            └── KeycloakIdentityResponse.java
```

Configuração:

```text
src/main/resources/
└── application-keycloak-login-lab.yaml
```

Teste:

```text
src/test/java/br/com/formacao/backend/
└── configuration
    └── security
        └── keycloak
            └── KeycloakLoginLabSecurityTest.java
```

Documentação:

```text
docs/security/
├── M15_KEYCLOAK_LOGIN.md
└── M15_KEYCLOAK_LOGIN_CHECKLIST.md
```

Configuração no Keycloak:

```text
realm:
formacao-java.

client:
formacao-java-login-lab.

user:
aluno.keycloak.

flow:
Standard Flow.

PKCE:
S256.

client authentication:
Off.

direct access grants:
Off.

implicit:
Off.

service accounts:
Off.
```

O laboratório demonstrará:

```text
/labs/keycloak:
página pública.

/oauth2/authorization/keycloak-lab:
início do login.

/login/oauth2/code/keycloak-lab:
callback do Spring Security.

/labs/keycloak/me:
identidade autenticada.
```

Você irá:

1. criar realm dedicado;
2. revisar discovery do realm;
3. criar client público;
4. configurar redirect URI exata;
5. configurar Web Origin;
6. habilitar Standard Flow;
7. exigir PKCE S256;
8. desabilitar grants indevidos;
9. criar usuário;
10. definir password local;
11. adicionar OAuth2 Client;
12. configurar provider por issuer;
13. criar chain isolada;
14. preservar API stateless;
15. criar página de entrada;
16. criar endpoint de identidade;
17. minimizar claims;
18. executar login;
19. inspecionar PKCE e callback;
20. testar isolamento das chains.

---

## Conceito essencial

### Login OIDC é um fluxo de browser

O login interativo utiliza o user-agent.

O client não coleta a password do usuário.

O navegador é redirecionado para o OpenID Provider.

O OP:

- apresenta a tela;
- autentica o usuário;
- aplica políticas;
- cria sessão SSO;
- emite authorization code;
- redireciona de volta.

O client troca o code no back channel.

---

### oauth2Login no Spring Security

O Spring Security oferece suporte a OAuth 2.0 Login.

Esse recurso usa:

```text
Authorization Code Grant.
```

Quando o scope inclui:

```text
openid
```

o fluxo é tratado como OpenID Connect.

O framework inicia a authorization request, cria `state`, `nonce` e PKCE, processa a callback, troca o code, valida o ID Token e cria o `OidcUser`.

A biblioteca reduz código protocolar manual, mas ainda exige issuer, client, redirect URI, scopes, PKCE, sessão, cookies, claims e chains corretos.

---

### Realm dedicado

O realm `formacao-java` será criado para o laboratório.

Ele separa:

- usuários da formação;
- clients da formação;
- chaves do realm;
- issuer;
- sessões;
- políticas.

Issuer:

```text
http://localhost:8180/realms/formacao-java
```

A aplicação não usa `master`.

---

### Client público

O client será público porque não utilizará shared secret.

Configuração:

```text
Client authentication:
Off.
```

Isso não significa que qualquer aplicação possa usar o client de forma segura.

A segurança depende de redirect estrita, PKCE, `state`, `nonce`, browser confiável, sessão protegida e hostname correto.

---

### Client ID não é secret

O valor:

```text
formacao-java-login-lab
```

pode aparecer na configuração e na authorization request.

Ele identifica o client.

Não concede acesso sozinho.

---

### Standard Flow

No Keycloak, Standard Flow representa o Authorization Code Flow.

Ele ficará:

```text
On.
```

Serão desligados:

```text
Implicit Flow;

Direct Access Grants;

Service Accounts.
```

A aula precisa somente do browser login.

Não habilite fluxos “para testar” sem necessidade.

---

### Direct Access Grants

Direct Access Grants permite um fluxo baseado em username e password enviados ao token endpoint.

Esse padrão fica `Off` na baseline moderna.

O usuário digitará sua password na tela do Keycloak.

---

### Redirect URI exata

A callback padrão do Spring Security será:

```text
{baseUrl}/login/oauth2/code/{registrationId}
```

Com:

```text
baseUrl:
http://localhost:8081.

registrationId:
keycloak-lab.
```

Resultado:

```text
http://localhost:8081/login/oauth2/code/keycloak-lab
```

Essa URI será cadastrada exatamente.

Não use:

```text
http://localhost:8081/*.
```

O wildcard ampliaria a superfície.

---

### Web Origins

Web Origins controla CORS para origens do client.

O laboratório registrará:

```text
http://localhost:8081
```

Ele não substitui Valid Redirect URIs.

No fluxo server-side, o redirect não depende de CORS.

Mesmo assim, manter origin exata evita uma configuração ampla quando endpoints browser-side forem utilizados.

---

### PKCE obrigatório no client

No Keycloak:

```text
Advanced settings
-> PKCE method
-> S256.
```

Com esse requisito, authorization requests sem challenge compatível serão rejeitadas.

No Spring:

```text
client-authentication-method:
none.

client-secret:
ausente.
```

O client público aciona o suporte automático a PKCE.

---

### Issuer discovery

A configuração usará:

```yaml
issuer-uri:
  http://localhost:8180/realms/formacao-java
```

O Spring obtém metadata OIDC a partir do issuer.

Ele descobre:

- authorization endpoint;
- token endpoint;
- UserInfo;
- JWKS URI;
- end session endpoint;
- algoritmos e capacidades.

A aplicação não hardcode cada endpoint.

---

### ID Token validation

Depois da troca do code, o Spring Security valida o ID Token.

Entre as verificações estão:

- signature;
- issuer;
- audience do client;
- expiração;
- nonce;
- claims obrigatórias.

A sessão local só deve ser criada depois da validação.

---

### Sessão local isolada

`oauth2Login()` utiliza sessão para manter:

- authorization request;
- `state`;
- contexto autenticado;
- `OAuth2AuthorizedClient`.

Isso é aceitável no laboratório web.

A chain será restrita aos paths do laboratório.

A chain da API continuará:

```text
SessionCreationPolicy.STATELESS.
```

Um request para `/api/**` sem bearer token continua retornando JSON `401`.

Ele não será redirecionado ao Keycloak.

---

### Cookie de sessão

No profile local:

```text
HttpOnly:
true.

SameSite:
Lax.

Secure:
false,
porque o laboratório usa HTTP local.

timeout:
10 minutos.
```

Em produção:

```text
Secure:
true.

HTTPS:
obrigatório.
```

Não copie `Secure=false` para ambiente externo.

---

### Claims em allowlist

O endpoint `/labs/keycloak/me` não devolverá o mapa completo de claims.

Ele extrairá somente:

```text
iss;

sub;

preferred_username;

name;

email;

email_verified;

auth_time.
```

Isso aplica minimização de dados.

Roles ficarão para outra decisão arquitetural.

---

### Tokens permanecem no servidor

O controller não receberá:

```text
@RegisteredOAuth2AuthorizedClient
```

nesta aula.

Ele não devolverá `OAuth2AuthorizedClient`.

Também não chamará:

```text
getTokenValue().
```

O objetivo é provar o login sem expor credenciais.

---

### Sessão SSO do Keycloak e sessão local

Existem duas sessões distintas.

Keycloak:

```text
sessão SSO no OP.
```

Aplicação:

```text
sessão local do RP.
```

Encerrar a sessão local não encerra automaticamente a sessão SSO.

RP-Initiated Logout será tratado quando houver requisito e configuração próprios.

Nesta aula, não será afirmado que logout local equivale a logout global.

---

### Usuário de laboratório

O usuário:

```text
aluno.keycloak
```

será criado no realm da formação.

A password será local e sintética.

Ela não será:

- commitada;
- incluída no diário;
- colocada em collection;
- mostrada em screenshot;
- reutilizada;
- igual à password bootstrap.

---

### Login bem-sucedido não concede regra de negócio

Autenticar prova uma identidade.

Isso não concede automaticamente:

- leitura de qualquer OS;
- acesso administrativo;
- role de supervisor;
- tenant;
- ownership.

A próxima etapa da formação analisará isolamento multi-tenant.

---

## Mão na massa guiada

### 1. Criar o realm

Acesse:

```text
http://localhost:8180/admin/
```

Entre no realm:

```text
master.
```

No seletor de realms:

```text
Create realm.
```

Defina:

```text
Realm name:
formacao-java.

Enabled:
On.
```

Salve.

Não importe configurações desconhecidas.

---

### 2. Validar discovery do realm

No PowerShell:

```powershell
$discovery =
  Invoke-RestMethod `
    "http://localhost:8180/realms/formacao-java/.well-known/openid-configuration"

$discovery.issuer
$discovery.authorization_endpoint
$discovery.token_endpoint
$discovery.jwks_uri
```

Esperado:

```text
issuer:
http://localhost:8180/realms/formacao-java.
```

A URL diferencia esse realm do `master`.

---

### 3. Criar o client

No realm `formacao-java`:

```text
Clients
-> Create client.
```

Defina:

```text
Client type:
OpenID Connect.

Client ID:
formacao-java-login-lab.

Name:
Formacao Java Login Lab.
```

Avance.

---

### 4. Configurar capabilities

Defina:

```text
Client authentication:
Off.

Authorization:
Off.

Standard flow:
On.

Direct access grants:
Off.

Implicit flow:
Off.

Service accounts roles:
Off.

OAuth 2.0 Device Authorization Grant:
Off.

OIDC CIBA Grant:
Off.
```

O client é público e possui somente o fluxo necessário.

---

### 5. Configurar URLs

Use:

```text
Root URL:
http://localhost:8081

Home URL:
http://localhost:8081/labs/keycloak

Valid Redirect URIs:
http://localhost:8081/login/oauth2/code/keycloak-lab

Valid Post Logout Redirect URIs:
deixar vazio nesta aula.

Web Origins:
http://localhost:8081

Admin URL:
deixar vazio.
```

Salve.

Não utilize wildcard.

---

### 6. Exigir PKCE S256

Abra:

```text
Advanced
-> Advanced settings
-> Proof Key for Code Exchange Code Challenge Method.
```

Selecione:

```text
S256.
```

Salve.

Não selecione `plain`.

Não deixe em branco.

---

### 7. Revisar client scopes

Em:

```text
Client scopes.
```

Confirme que o client consegue solicitar:

```text
openid;

profile;

email.
```

Não configure roles nesta aula.

Não adicione address ou phone.

---

### 8. Criar o usuário

No realm `formacao-java`:

```text
Users
-> Add user.
```

Defina:

```text
Username:
aluno.keycloak.

Email:
aluno.keycloak@example.test.

First name:
Aluno.

Last name:
Keycloak.

Email verified:
On.

Enabled:
On.
```

Salve.

---

### 9. Definir a password

Na aba:

```text
Credentials.
```

Use:

```text
Set password.
```

Defina um valor sintético forte.

Para o laboratório:

```text
Temporary:
Off.
```

Não reutilize a password administrativa.

Não registre o valor.

---

### 10. Adicionar a dependency

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>
        spring-boot-starter-oauth2-client
    </artifactId>
</dependency>
```

O starter adiciona suporte a OAuth2 Client e OIDC Login.

Não adicione Spring Authorization Server.

---

### 11. Criar o profile

Arquivo:

```text
application-keycloak-login-lab.yaml
```

Conteúdo:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          keycloak-lab:
            provider: keycloak-lab
            client-id:
              formacao-java-login-lab
            client-authentication-method:
              none
            authorization-grant-type:
              authorization_code
            redirect-uri:
              "{baseUrl}/login/oauth2/code/{registrationId}"
            scope:
              - openid
              - profile
              - email

        provider:
          keycloak-lab:
            issuer-uri:
              http://localhost:8180/realms/formacao-java

server:
  servlet:
    session:
      timeout: 10m
      cookie:
        http-only: true
        same-site: lax
        secure: false
```

Não existe:

```text
client-secret.
```

`secure=false` é somente para HTTP local.

---

### 12. Criar a configuração de segurança

```java
package br.com.formacao.backend.configuration
        .security.keycloak;

import static org.springframework.security
        .config.Customizer.withDefaults;

@Configuration
@Profile("keycloak-login-lab")
@EnableWebSecurity
public class
        KeycloakLoginLabSecurityConfiguration {

    @Bean
    @Order(0)
    SecurityFilterChain keycloakLoginLabChain(
            HttpSecurity http
    ) throws Exception {

        http
            .securityMatcher(
                    "/labs/keycloak/**",
                    "/oauth2/**",
                    "/login/oauth2/**"
            )
            .authorizeHttpRequests(
                    authorization ->
                            authorization
                                .requestMatchers(
                                        "/labs/keycloak"
                                )
                                .permitAll()
                                .requestMatchers(
                                        "/oauth2/**",
                                        "/login/oauth2/**"
                                )
                                .permitAll()
                                .anyRequest()
                                .authenticated()
            )
            .oauth2Login(
                    oauth2 ->
                            oauth2
                                .defaultSuccessUrl(
                                        "/labs/keycloak/me",
                                        true
                                )
            )
            .sessionManagement(
                    sessions ->
                            sessions
                                .sessionCreationPolicy(
                                    SessionCreationPolicy
                                        .IF_REQUIRED
                                )
            )
            .requestCache(withDefaults());

        return http.build();
    }
}
```

Não desabilite CSRF nessa chain.

O laboratório possui sessão de browser.

---

### 13. Confirmar ordem das chains

A configuração existente deve permanecer:

```text
Order 1:
API /api/**.

Order 2:
infraestrutura e fallback.
```

A nova chain utiliza:

```text
Order 0.
```

Ela processa somente os matchers do login.

Não use:

```text
anyRequest().authenticated()
```

sem um `securityMatcher` restrito.

---

### 14. Criar KeycloakIdentityResponse

```java
package br.com.formacao.backend.configuration
        .security.keycloak;

import java.net.URI;
import java.time.Instant;

public record KeycloakIdentityResponse(
        URI issuer,
        String subject,
        String preferredUsername,
        String name,
        String email,
        Boolean emailVerified,
        Instant authenticationTime
) {
}
```

Nenhum campo armazena token.

---

### 15. Criar o controller

```java
@RestController
@Profile("keycloak-login-lab")
@RequestMapping(
        "/labs/keycloak"
)
public class KeycloakLoginLabController {

    @GetMapping(
        produces =
            MediaType.TEXT_HTML_VALUE
    )
    String home() {
        return """
            <!doctype html>
            <html lang="pt-BR">
              <head>
                <meta charset="utf-8">
                <title>Keycloak Login Lab</title>
              </head>
              <body>
                <h1>Keycloak Login Lab</h1>
                <p>
                  Login por Authorization Code
                  com OpenID Connect e PKCE.
                </p>
                <a href="/oauth2/authorization/keycloak-lab">
                  Entrar com Keycloak
                </a>
              </body>
            </html>
            """;
    }
```

Endpoint autenticado:

```java
    @GetMapping(
        path = "/me",
        produces =
            MediaType.APPLICATION_JSON_VALUE
    )
    KeycloakIdentityResponse me(
            @AuthenticationPrincipal
            OidcUser user
    ) {
        OidcIdToken idToken =
                user.getIdToken();

        return new KeycloakIdentityResponse(
                idToken.getIssuer(),
                user.getSubject(),
                user.getPreferredUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getEmailVerified(),
                idToken.getAuthenticatedAt()
        );
    }
}
```

Feche a classe.

Não utilize:

```java
idToken.getTokenValue()
```

---

### 16. Tratar claims opcionais

Nem toda claim é obrigatória.

O endpoint aceita:

```text
name:
null.

email:
null.

email_verified:
null.

auth_time:
null.
```

Obrigatórios:

```text
issuer;

subject.
```

Aceite ausências.

---

### 17. Iniciar o Keycloak

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d
```

Valide:

```powershell
Invoke-RestMethod `
  "http://localhost:9190/health/ready"
```

Esperado:

```text
status:
UP.
```

---

### 18. Iniciar a aplicação

Na raiz do laboratório:

```powershell
.\mvnw.cmd `
  spring-boot:run `
  "-Dspring-boot.run.profiles=keycloak-login-lab"
```

Confirme:

```text
API:
http://localhost:8081.

Keycloak:
http://localhost:8180.
```

Se o issuer não estiver disponível, o startup pode falhar durante discovery.

---

### 19. Abrir a página do laboratório

Acesse:

```text
http://localhost:8081/labs/keycloak
```

Clique:

```text
Entrar com Keycloak.
```

O browser deve ser redirecionado ao realm:

```text
formacao-java.
```

Não ao realm `master`.

---

### 20. Inspecionar a authorization request

No DevTools, verifique a request ao endpoint de autorização.

Ela deve conter:

```text
client_id=
formacao-java-login-lab;

response_type=code;

scope=
openid profile email;

redirect_uri=
http://localhost:8081/login/oauth2/code/keycloak-lab;

state=
valor imprevisível;

nonce=
valor imprevisível;

code_challenge=
valor Base64URL;

code_challenge_method=
S256.
```

Não copie os valores para documentação.

---

### 21. Realizar o login

Autentique com:

```text
aluno.keycloak.
```

Use a password local definida no Keycloak.

O OP deve redirecionar para:

```text
/login/oauth2/code/keycloak-lab
```

A callback carrega:

```text
code;

state;

session_state;

iss,
conforme o provedor.
```

Ela não deve carregar access token ou ID Token na URL.

---

### 22. Validar a identidade

Depois do sucesso:

```text
http://localhost:8081/labs/keycloak/me
```

Exemplo estrutural:

```json
{
  "issuer":
    "http://localhost:8180/realms/formacao-java",
  "subject":
    "identificador-opaco",
  "preferredUsername":
    "aluno.keycloak",
  "name":
    "Aluno Keycloak",
  "email":
    "aluno.keycloak@example.test",
  "emailVerified":
    true,
  "authenticationTime":
    "2026-07-11T..."
}
```

O subject é gerado pelo Keycloak.

Não assuma que ele é igual ao username.

---

### 23. Verificar a sessão

No browser, observe:

```text
JSESSIONID.
```

Confirme:

- HttpOnly;
- SameSite=Lax;
- path adequado;
- nenhum token em Local Storage;
- nenhum token em Session Storage.

Em HTTP local, `Secure` estará ausente.

Isso não é aceitável em produção.

---

### 24. Verificar PKCE no Keycloak

Altere temporariamente o client para exigir `S256` caso ainda não esteja.

O login continua funcionando.

Depois, tente iniciar uma authorization request manual sem PKCE.

O Keycloak deve rejeitar.

Não desabilite o requisito para contornar falhas.

---

### 25. Verificar que a API continua stateless

Sem bearer token:

```powershell
Invoke-WebRequest `
  -SkipHttpErrorCheck `
  -Uri `
    "http://localhost:8081/api/v2/service-orders"
```

Esperado:

```text
401;

application/problem+json;

sem redirect;

sem HTML do Keycloak;

sem JSESSIONID criado
para o fluxo da API.
```

---

### 26. Verificar chain do laboratório

Sem sessão:

```powershell
Invoke-WebRequest `
  -MaximumRedirection 0 `
  -SkipHttpErrorCheck `
  -Uri `
    "http://localhost:8081/labs/keycloak/me"
```

Espere redirecionamento de autenticação.

Com sessão do browser:

```text
200.
```

A diferença existe somente nos paths do laboratório.

---

### 27. Criar teste da página pública

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(
        "keycloak-login-lab"
)
class KeycloakLoginLabSecurityTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void shouldExposeLoginPage() throws Exception {
        mockMvc.perform(
                get(
                    "/labs/keycloak"
                )
        )
        .andExpect(
                status().isOk()
        )
        .andExpect(
                content().string(
                    containsString(
                        "/oauth2/authorization/keycloak-lab"
                    )
                )
        );
    }
}
```

---

### 28. Testar identidade OIDC

Use suporte do Spring Security Test:

```java
@Test
void shouldReturnWhitelistedIdentity()
        throws Exception {

    mockMvc.perform(
            get(
                "/labs/keycloak/me"
            )
            .with(
                oidcLogin()
                    .idToken(
                        token ->
                            token
                                .issuer(
                                    URI.create(
                                      "http://localhost:8180/realms/formacao-java"
                                    )
                                )
                                .subject(
                                    "subject-123"
                                )
                                .claim(
                                    "preferred_username",
                                    "aluno.keycloak"
                                )
                                .claim(
                                    "email",
                                    "aluno.keycloak@example.test"
                                )
                                .claim(
                                    "email_verified",
                                    true
                                )
                    )
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            jsonPath("$.subject")
                .value("subject-123")
    )
    .andExpect(
            jsonPath("$.preferredUsername")
                .value("aluno.keycloak")
    )
    .andExpect(
            jsonPath("$.accessToken")
                .doesNotExist()
    )
    .andExpect(
            jsonPath("$.idToken")
                .doesNotExist()
    );
}
```

O teste não depende do container Keycloak.

---

### 29. Testar isolamento da API

```java
@Test
void shouldKeepApiWithoutBrowserRedirect()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/v2/service-orders"
            )
    )
    .andExpect(
            status().isUnauthorized()
    )
    .andExpect(
            content().contentTypeCompatibleWith(
                MediaType.APPLICATION_PROBLEM_JSON
            )
    )
    .andExpect(
            header().doesNotExist(
                HttpHeaders.LOCATION
            )
    );
}
```

Esse teste impede regressão para login HTML na API.

---

### 30. Testar sessão somente no laboratório

Com `oidcLogin()`:

```java
MvcResult result =
        mockMvc.perform(
                get(
                    "/labs/keycloak/me"
                )
                .with(
                    oidcLogin()
                )
        )
        .andExpect(
                status().isOk()
        )
        .andReturn();

assertThat(
        result.getRequest()
              .getSession(false)
)
.isNotNull();
```

Para um request anônimo da API, não exija criação de sessão.

---

### 31. Testar profile desligado

Sem:

```text
keycloak-login-lab.
```

Os endpoints:

```text
/labs/keycloak;
```

não devem existir ou devem permanecer negados pelo fallback.

A configuração OIDC não deve ser carregada em produção por acidente.

---

### 32. Criar M15_KEYCLOAK_LOGIN.md

Inclua:

```markdown
# Login com Keycloak

## Realm

formacao-java.

## Client

formacao-java-login-lab.

## Flow

Authorization Code + OIDC + PKCE S256.

## Client type

Public;
sem client secret.

## Redirect

URL exata do Spring Security.

## Chains

- Lab OIDC: session e redirect.
- API: stateless e bearer.

## Claims expostas

Allowlist mínima.

## Limites

- HTTP local.
- usuário sintético.
- sem roles.
- sem logout OIDC.
- sem trust do access token Keycloak na API.
```

---

### 33. Criar checklist do login

Arquivo:

```text
docs/security/M15_KEYCLOAK_LOGIN_CHECKLIST.md
```

Itens:

```markdown
# Checklist do login

- Realm não é master.
- Client authentication está Off.
- Standard Flow está On.
- Direct Access Grants está Off.
- Implicit está Off.
- PKCE está em S256.
- Redirect URI é exata.
- Web Origin é exata.
- Password não está documentada.
- Request possui state.
- Request possui nonce.
- Request possui code_challenge.
- Callback possui code, não tokens.
- ID Token é validado pelo framework.
- Endpoint /me não expõe tokens.
- API continua 401 sem redirect.
```

---

### 34. Atualizar auditoria planejada

Registre eventos futuros:

```text
OIDC_LOGIN_STARTED;

OIDC_LOGIN_SUCCEEDED;

OIDC_LOGIN_FAILED.
```

O audit trail atual utiliza UUID interno como actor.

O subject externo ainda não foi ligado a uma identidade local.

Não force o `sub` textual em `actor_id`.

A ligação de identidade precisa de decisão explícita.

Proibido registrar:

- password;
- authorization code;
- ID Token;
- access token;
- refresh token;
- state;
- nonce;
- verifier;
- cookie.

---

### 35. Atualizar threat model

Adicione:

```text
THR-156:
API redireciona clientes HTTP
para login HTML.

THR-157:
realm master é usado no login.

THR-158:
client público recebe secret.

THR-159:
redirect URI usa wildcard amplo.

THR-160:
Direct Access Grants fica habilitado.

THR-161:
PKCE não é exigido.

THR-162:
tokens são devolvidos no endpoint /me.

THR-163:
claims completas são expostas.

THR-164:
session cookie é usado
fora da chain do laboratório.

THR-165:
subject é confundido
com username ou e-mail.

THR-166:
profile de laboratório
é ativado em produção.
```

Controles:

- chains isoladas;
- realm dedicado;
- public client sem secret;
- redirect exata;
- grants mínimos;
- S256;
- allowlist;
- cookie restrito;
- `iss + sub`;
- profile explícito.

---

### 36. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
login:
não concede permissions.

API:
continua com autorização própria.
```

A02 Security Misconfiguration:

```text
realm:
dedicado.

redirect:
exata.

grants:
mínimos.

profile:
isolado.
```

A07 Authentication Failures:

```text
password:
somente no Keycloak.

Authorization Code:
validado.

PKCE:
S256.

ID Token:
validado.
```

A09 Security Logging:

```text
tokens, code,
state, nonce e cookie:
não registrados.
```

Baseline:

```text
login Keycloak:
funcional no laboratório.

sessão:
somente chain web.

API:
stateless.

roles:
pendentes.

multi-tenancy:
próxima aula.

produção pública:
NO-GO.
```

---

### 37. Executar o gate

Keycloak:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d
```

Aplicação:

```powershell
.\mvnw.cmd `
  spring-boot:run `
  "-Dspring-boot.run.profiles=keycloak-login-lab"
```

Teste:

```powershell
.\mvnw.cmd `
  -Dtest=KeycloakLoginLabSecurityTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- realm correto;
- client correto;
- PKCE S256;
- redirect exata;
- login real;
- callback sem tokens;
- `/me` com allowlist;
- cookie HttpOnly;
- API com `401`;
- ausência de redirect da API;
- profile isolado;
- nenhum secret;
- nenhum token em logs;
- nenhuma role antecipada.

---

## Entendendo o que foi feito

### O Keycloak passou a autenticar um usuário real

A aplicação deixou de validar somente infraestrutura.

### O realm ficou separado do master

Usuários e clients funcionais ganharam um domínio próprio.

### O client ficou público e sem secret

PKCE protege a continuidade do Authorization Code Flow.

### O Spring executou o protocolo

Authorization request, callback, token exchange e validação foram delegados à biblioteca.

### A sessão foi isolada

Somente os paths do laboratório utilizam estado de browser.

### A API continuou stateless

Consumidores HTTP recebem `401`, não páginas HTML.

### As claims foram minimizadas

O endpoint de identidade não expõe tokens nem mapa completo.

### O login não virou autorização

Roles, tenant e regras de negócio continuam pendentes.

---

## Erros comuns importantes

### Usar o realm master

Administração e negócio ficam misturados.

### Ativar client authentication com secret em client público

O secret não pode ser protegido adequadamente.

### Usar wildcard no redirect

Um callback indevido pode receber o code.

### Habilitar Direct Access Grants

O client volta a coletar password.

### Desabilitar PKCE para corrigir erro

A causa precisa ser investigada, não removida.

### Aplicar oauth2Login à API inteira

Requests de API começam a receber redirects HTML.

### Expor OAuth2AuthorizedClient

Tokens podem chegar ao body ou log.

### Usar e-mail como identidade

A chave externa é `issuer + subject`.

### Considerar sessão local igual à sessão SSO

Logout e lifecycle são distintos.

### Ativar o profile em produção

O laboratório usa HTTP e cookie sem `Secure`.

---

## Comandos úteis

### Discovery do realm

```powershell
Invoke-RestMethod `
  "http://localhost:8180/realms/formacao-java/.well-known/openid-configuration"
```

### Subir a aplicação

```powershell
.\mvnw.cmd `
  spring-boot:run `
  "-Dspring-boot.run.profiles=keycloak-login-lab"
```

### Teste de segurança

```powershell
.\mvnw.cmd `
  -Dtest=KeycloakLoginLabSecurityTest `
  test
```

### Verificar API sem redirect

```powershell
Invoke-WebRequest `
  -SkipHttpErrorCheck `
  "http://localhost:8081/api/v2/service-orders"
```

### Procurar exposição de token

```powershell
git grep `
  -n `
  -E `
  "getTokenValue|OAuth2AuthorizedClient|idToken.*body"
```

---

## Exercício guiado

### Parte 1 — Realm

Crie `formacao-java`.

### Parte 2 — Client

Crie client público com Standard Flow.

### Parte 3 — URLs

Cadastre redirect e origin exatas.

### Parte 4 — PKCE

Exija `S256`.

### Parte 5 — Usuário

Crie credencial sintética local.

### Parte 6 — Spring

Adicione OAuth2 Client e issuer discovery.

### Parte 7 — Chain

Isole sessão e redirects.

### Parte 8 — Identidade

Exponha somente claims permitidas.

### Parte 9 — Testes

Comprove login web e API stateless.

### Parte 10 — Segurança

Atualize riscos e documentação.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 435 foi preservada;
- ponte aponta para Multi tenancy seguranca;
- realm `formacao-java` foi criado;
- realm `master` não foi usado pela aplicação;
- discovery do realm foi validada;
- issuer correto foi confirmado;
- client `formacao-java-login-lab` foi criado;
- client type é OpenID Connect;
- client authentication está Off;
- client secret não existe;
- Standard Flow está On;
- Direct Access Grants está Off;
- Implicit Flow está Off;
- Service Accounts está Off;
- Device Authorization está Off;
- CIBA está Off;
- redirect URI é exata;
- wildcard não foi usado;
- Web Origin é exata;
- Admin URL ficou vazia;
- PKCE S256 foi exigido;
- método plain não foi usado;
- scopes `openid`, `profile` e `email` foram usados;
- claims extras não foram solicitadas;
- usuário sintético foi criado;
- password não foi documentada;
- password bootstrap não foi reutilizada;
- OAuth2 Client starter foi adicionado;
- Authorization Server dependency não foi adicionada;
- profile `keycloak-login-lab` foi criado;
- client authentication method está como `none`;
- client secret está ausente;
- issuer-uri foi configurado;
- redirect-uri padrão foi usada;
- cookie HttpOnly foi configurado;
- SameSite Lax foi configurado;
- Secure false foi limitado ao local;
- timeout de sessão foi definido;
- nova SecurityFilterChain possui `Order(0)`;
- securityMatcher restringe a chain;
- página do laboratório está pública;
- callback e authorization paths estão permitidos;
- endpoint `/me` exige autenticação;
- `oauth2Login()` foi habilitado;
- success URL foi definida;
- sessão `IF_REQUIRED` foi usada;
- CSRF não foi desabilitado na chain;
- API chain permaneceu stateless;
- API não redireciona;
- fallback permaneceu deny-by-default;
- controller foi criado;
- response possui allowlist;
- tokens não aparecem na response;
- claims opcionais foram tratadas;
- login real foi concluído;
- authorization request possui state;
- authorization request possui nonce;
- authorization request possui code challenge;
- método S256 foi observado;
- callback possui code e state;
- callback não possui tokens;
- ID Token foi validado pelo framework;
- issuer e subject foram exibidos;
- subject não foi confundido com username;
- sessão local foi observada;
- nenhum token foi colocado em Local Storage;
- nenhum token foi colocado em Session Storage;
- API sem bearer recebeu `401`;
- API não recebeu header Location;
- teste com `oidcLogin()` foi criado;
- teste da página pública foi criado;
- teste de isolamento da API foi criado;
- profile desligado foi testado;
- documentos de login foram criados;
- auditoria futura não força sub em UUID;
- threat model foi atualizado;
- OWASP A01, A02, A07 e A09 foram atualizados;
- roles Keycloak não foram antecipadas;
- multi-tenancy não foi antecipado;
- logout OIDC não foi fingido;
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
git grep -n -E "client-secret|getTokenValue|OAuth2AuthorizedClient"
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
git commit -m "feat(m15): autenticar usuario com Keycloak e OIDC"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- password do usuário;
- password administrativa;
- client secret;
- ID Token;
- access token;
- refresh token;
- authorization code;
- state;
- nonce;
- verifier;
- cookie;
- realm export com credenciais;
- configuração produtiva fictícia.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto realizou um login OpenID Connect real.

O fluxo ficou:

```text
browser;

Spring OAuth2 Client;

Keycloak;

Authorization Code;

PKCE S256;

ID Token validado;

sessão local.
```

O Keycloak recebeu:

```text
realm dedicado;

client público;

redirect exata;

Web Origin exata;

grants mínimos;

usuário sintético.
```

O Spring recebeu:

```text
issuer discovery;

OAuth2 Client;

chain web isolada;

session IF_REQUIRED;

endpoint de identidade
com allowlist.
```

A API permaneceu:

```text
Bearer;

stateless;

Problem Details;

sem redirect;

sem sessão obrigatória.
```

A decisão central foi:

```text
autenticação interativa
e API stateless
podem coexistir
quando possuem chains,
sessões e contratos separados.
```

O login agora prova:

```text
issuer;

subject;

usuário autenticado.
```

Ele ainda não define:

- tenant;
- organização;
- escopo de dados;
- vínculo entre usuário e cliente corporativo;
- isolamento de queries;
- autorização cross-tenant;
- onboarding de identidade externa.

Essas decisões não podem ser derivadas de um parâmetro livre na request.

A próxima aula será:

```text
437 - M15.27 - Multi tenancy seguranca
```

Nela, você irá:

- definir tenant confiável;
- diferenciar tenant de usuário;
- modelar membership;
- resolver tenant a partir da identidade;
- impedir tenant switching arbitrário;
- filtrar queries no banco;
- testar acesso cross-tenant;
- preservar ownership dentro do tenant;
- tratar administrador multi-tenant;
- atualizar auditoria com tenant context.

---

# Material complementar

## Checkpoint final

- [ ] Criei realm e client dedicados.
- [ ] Exigi Authorization Code com PKCE S256.
- [ ] Completei um login real.
- [ ] Não expus tokens no navegador ou endpoint.
- [ ] Mantive `/api/**` stateless e sem redirects.

---

## Troubleshooting adicional

### O Keycloak retorna invalid_redirect_uri

Compare o valor recebido com:

```text
http://localhost:8081/login/oauth2/code/keycloak-lab.
```

A URI precisa coincidir exatamente.

### O erro informa PKCE ausente

Confirme:

```text
client-authentication-method:
none.

client-secret:
ausente.

PKCE method no Keycloak:
S256.
```

### O Spring não inicia

Confirme readiness do Keycloak e issuer-uri.

Discovery precisa estar disponível.

### O login vai para master

Revise o issuer do profile.

Ele precisa terminar em:

```text
/realms/formacao-java.
```

### /me retorna 302 repetidamente

Verifique cookie, hostname, callback, session e logs do OAuth2 Client.

### A API retorna HTML

A chain do laboratório pode estar ampla demais.

Revise `securityMatcher` e `@Order`.

### A response contém claims demais

Não devolva `user.getClaims()` diretamente.

Use o record com allowlist.

### O e-mail está ausente

Confirme o scope `email`, a claim no usuário e client scopes.

O endpoint deve tolerar ausência.

---

## Perguntas de revisão

1. Qual realm foi criado?
2. Por que não usar master?
3. Qual é o client ID?
4. O client possui secret?
5. Qual flow foi habilitado?
6. Direct Access Grants ficou ativo?
7. Qual método PKCE foi exigido?
8. Qual é a redirect URI?
9. Qual é o issuer?
10. O que `oauth2Login()` processa?
11. O que o ID Token prova?
12. O ID Token vai para a API?
13. Onde a sessão é utilizada?
14. A API continua stateful?
15. Quais claims foram expostas?
16. Tokens aparecem no endpoint?
17. Subject é igual ao username?
18. Logout local encerra sempre o SSO?
19. Qual é a próxima aula?
20. Qual será o foco dela?

---

## Roteiro de resposta

1. `formacao-java`.
2. Porque é administrativo.
3. `formacao-java-login-lab`.
4. Não.
5. Standard Flow.
6. Não.
7. S256.
8. A callback padrão do Spring em `8081`.
9. O realm `formacao-java` em `8180`.
10. Redirect, callback, troca e validação.
11. Autenticação do usuário para o client.
12. Não.
13. Somente na chain do laboratório.
14. Não; continua stateless.
15. Uma allowlist mínima.
16. Não.
17. Não necessariamente.
18. Não.
19. Multi tenancy seguranca.
20. Isolamento seguro entre tenants.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 436 - M15.26 - Login com Keycloak

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Criei o realm `formacao-java`.
- Mantive o realm `master` somente para administração.
- Validei discovery e issuer do novo realm.
- Criei o client `formacao-java-login-lab`.
- Configurei o client como público.
- Não criei client secret.
- Habilitei Standard Flow.
- Desabilitei Direct Access Grants, Implicit, Service Accounts, Device e CIBA.
- Cadastrei redirect URI exata.
- Cadastrei Web Origin exata.
- Exigi PKCE `S256`.
- Mantive `plain` desabilitado.
- Usei somente scopes `openid`, `profile` e `email`.
- Criei o usuário sintético `aluno.keycloak`.
- Não documentei a password.
- Adicionei `spring-boot-starter-oauth2-client`.
- Criei `application-keycloak-login-lab.yaml`.
- Configurei `client-authentication-method=none`.
- Usei issuer discovery.
- Criei uma `SecurityFilterChain` com `Order(0)`.
- Isolei a chain nos paths do laboratório.
- Mantive CSRF ativo na chain web.
- Usei sessão `IF_REQUIRED`.
- Mantive `/api/**` stateless.
- Criei `KeycloakLoginLabController`.
- Criei `KeycloakIdentityResponse`.
- Expus somente claims em allowlist.
- Não expus ID Token, access token ou refresh token.
- Completei um login OIDC real.
- Observei state, nonce e PKCE na authorization request.
- Observei authorization code na callback.
- Confirmei que tokens não aparecem na callback.
- Validei issuer, subject e claims do usuário.
- Observei cookie de sessão HttpOnly.
- Confirmei ausência de tokens no storage do browser.
- Testei a página pública.
- Testei `/me` com `oidcLogin()`.
- Testei que a API continua retornando `401` sem redirect.
- Criei `docs/security/M15_KEYCLOAK_LOGIN.md`.
- Criei `docs/security/M15_KEYCLOAK_LOGIN_CHECKLIST.md`.
- Atualizei auditoria planejada, threat model, OWASP e baseline.
- Não implementei roles ou multi-tenancy nesta aula.
- Próxima aula: Multi tenancy seguranca.
```

---

## Referência técnica curta

- [Keycloak — Server Administration Guide](https://www.keycloak.org/docs/latest/server_admin/)
- [Keycloak — OpenID Connect layers and endpoints](https://www.keycloak.org/securing-apps/oidc-layers)
- [Spring Security — OAuth 2.0 Login](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/index.html)
- [Spring Security — Authorization Grant Support](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/authorization-grants.html)
- [Spring Security — OAuth2 Client Authentication](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/client-authentication.html)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [RFC 7636 — Proof Key for Code Exchange](https://www.rfc-editor.org/rfc/rfc7636.html)
- [RFC 9700 — OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)

Regra final:

```text
o login com Keycloak deve permanecer isolado da API stateless: nesta baseline, um realm dedicado autentica um usuário por Authorization Code com OpenID Connect e PKCE S256, o client público não possui secret, redirect URI e Web Origin são exatas, grants desnecessários ficam desligados, o Spring Security valida o ID Token e cria sessão somente na chain do laboratório, o endpoint de identidade expõe uma allowlist mínima e nunca tokens, enquanto /api continua usando bearer, Problem Details e 401 sem redirect; autenticação não concede tenant ou acesso de negócio automaticamente.
```
