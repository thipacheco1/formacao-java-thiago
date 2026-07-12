# 420 - M15.10 - Login basico usuario em memoria

## Apresentação da aula

Na aula 419, o Spring Security entrou no runtime da aplicação.

A baseline passou a possuir:

```text
duas SecurityFilterChains;

deny by default;

paths públicos explícitos;

sessão stateless;

request cache desativado;

form login desativado;

HTTP Basic desativado;

CORS integrado;

CSRF decidido;

security headers;

Problem Details para 401 e 403.
```

O comportamento ficou:

```text
health e documentação local:
permitidos.

API anônima:
401.

identidade de teste sem regra:
403.

path desconhecido:
negado.
```

A fronteira foi criada antes da porta de entrada.

Agora será criado o primeiro mecanismo real de autenticação da formação.

A pergunta central desta aula será:

```text
como receber username e password,
validar a credencial com Spring Security
e disponibilizar uma identidade autenticada
sem criar banco de usuários antes da hora?
```

A solução didática usará:

```text
HTTP Basic;

InMemoryUserDetailsManager;

PasswordEncoder;

DaoAuthenticationProvider;

SecurityContext;

authorities;

MockMvc;

profile basic-lab.
```

O usuário ficará somente em memória.

Isso significa:

- não existe tabela;
- não existe migration;
- não existe cadastro;
- não existe atualização persistente;
- não existe recuperação de senha;
- não existe lockout distribuído;
- um restart recria o mesmo usuário configurado;
- cada instância possui sua própria memória.

O objetivo não é criar a autenticação final.

O objetivo é observar o fluxo real:

```text
Authorization header;

BasicAuthenticationFilter;

UsernamePasswordAuthenticationToken;

AuthenticationManager;

DaoAuthenticationProvider;

InMemoryUserDetailsManager;

PasswordEncoder.matches;

Authentication autenticada;

SecurityContext;

autorização;

controller.
```

HTTP Basic será utilizado porque torna esse fluxo visível com pouca infraestrutura.

Ele transporta:

```text
username:password
```

codificado em Base64 dentro de:

```http
Authorization: Basic <valor>
```

Base64 não é criptografia.

Qualquer pessoa que capture o header consegue recuperar username e password.

Consequência:

```text
HTTP Basic somente pode transportar
credenciais reais sobre HTTPS.
```

O laboratório local ainda utiliza HTTP.

Por isso, ele aceitará apenas:

- credencial sintética;
- dados sintéticos;
- localhost;
- profile explícito;
- nenhuma exposição pública.

O profile será:

```text
basic-lab.
```

Fora desse profile:

```text
nenhum usuário em memória;

nenhum HTTP Basic disponível;

API continua respondendo 401.
```

O username e o hash da password não serão versionados.

Eles chegarão por:

```text
APP_SECURITY_BASIC_USERNAME;

APP_SECURITY_BASIC_PASSWORD_HASH.
```

A aplicação não receberá a password em texto puro na configuração.

O valor armazenado seguirá o formato:

```text
{bcrypt}$2a$...
```

O prefixo:

```text
{bcrypt}
```

permite ao `DelegatingPasswordEncoder` escolher o algoritmo correto.

A aula 417 definiu Argon2id como preferência para novos sistemas persistidos.

Por que usar BCrypt aqui?

Porque este é um laboratório transitório de usuário em memória:

- sem base de usuários;
- sem migration;
- sem dado real;
- sem permanência;
- com suporte simples no runtime atual;
- sem adicionar Bouncy Castle ao runtime somente por uma aula temporária.

A decisão de produção continua:

```text
novo sistema persistido:
Argon2id calibrado.

laboratório in-memory:
BCrypt com custo didático.

compatibilidade:
formato versionado.
```

A API chain deixará de terminar em:

```java
anyRequest().denyAll()
```

e passará a exigir:

```java
anyRequest().authenticated()
```

Essa mudança não implementa autorização de negócio.

Ela responde somente:

```text
existe uma identidade válida?
```

Para demonstrar `403`, será criado um endpoint de laboratório que exige:

```text
ROLE_ADMIN.
```

O usuário em memória terá:

```text
ROLE_OPERATOR;

service-order:read;

service-order:write.
```

Logo:

```text
/api/security/me:
200 com credencial válida.

/api/security/admin-probe:
403 com o usuário operator.
```

A próxima aula oficial será:

```text
421 - M15.11 - Autenticacao com banco
```

Nela, o usuário deixará de ser configurado em memória e será carregado de PostgreSQL por uma implementação de `UserDetailsService`.

---

## Onde estamos na formação

A sequência atual é:

```text
418:
Spring Security arquitetura.

419:
SecurityFilterChain.

420:
Login basico usuario em memoria.

421:
Autenticacao com banco.

422:
JWT fundamentos.

423:
Geracao e validacao JWT.
```

A aula 419 respondeu:

```text
como fechar a aplicação
antes de criar credenciais?
```

A aula 420 responderá:

```text
como autenticar uma request
com username e password
usando um usuário temporário em memória?
```

Nesta aula:

```text
HTTP Basic:
sim.

InMemoryUserDetailsManager:
sim.

PasswordEncoder:
sim.

DaoAuthenticationProvider:
sim.

SecurityContext:
sim.

authorities:
sim.

401:
sim.

403:
sim.

WWW-Authenticate:
sim.

usuário no banco:
não.

cadastro:
não.

form login:
não.

sessão:
não.

JWT:
não.
```

A regra central será:

```text
autenticar significa
validar a credencial
e criar uma identidade;

não significa autorizar
todas as operações.
```

---

## Objetivo prático

Ao final da aula, a aplicação possuirá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── security
        ├── BasicAuthenticationProperties.java
        ├── InMemoryBasicAuthenticationConfiguration.java
        └── ApiSecurityConfiguration.java
```

Endpoint de diagnóstico:

```text
src/main/java/br/com/formacao/backend
└── web
    └── security
        ├── SecurityIdentityController.java
        └── SecurityIdentityResponse.java
```

Gerador manual de hash:

```text
src/test/java/br/com/formacao/backend
└── security
    └── password
        └── BasicLabPasswordHashGeneratorTest.java
```

Teste principal:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── security
        └── InMemoryBasicAuthenticationTest.java
```

Configuração:

```text
application-basic-lab.yaml
```

Documentação:

```text
docs/security/M15_IN_MEMORY_BASIC_AUTH.md
```

A aplicação demonstrará:

```text
sem header:
401.

username inválido:
401.

password inválida:
401.

credencial válida:
200.

usuário autenticado sem ROLE_ADMIN:
403.

sem JSESSIONID:
stateless.

challenge Basic:
presente.

password e hash:
ausentes da response.
```

Você irá:

1. compreender HTTP Basic;
2. diferenciar Base64 de proteção;
3. criar properties seguras;
4. exigir hash versionado;
5. criar `PasswordEncoder`;
6. criar `InMemoryUserDetailsManager`;
7. remover o manager temporário;
8. ativar HTTP Basic por property;
9. exigir autenticação na API;
10. criar endpoint `/me`;
11. criar endpoint administrativo de laboratório;
12. gerar hash sem versionar password;
13. configurar profile;
14. testar anonymous;
15. testar credenciais inválidas;
16. testar credencial válida;
17. testar authorities;
18. testar `401` e `403`;
19. comprovar stateless;
20. atualizar documentação.

---

## Conceito essencial

### HTTP Basic

HTTP Basic é um esquema de autenticação HTTP.

O cliente envia:

```http
Authorization: Basic dXNlcjpwYXNzd29yZA==
```

O conteúdo após `Basic` representa:

```text
username:password
```

em Base64.

A request carrega a credencial novamente a cada chamada.

Não existe login que produz um token diferente.

Não existe logout de servidor no modelo stateless.

Para parar de enviar a credencial, o cliente precisa descartá-la.

Browsers podem armazenar temporariamente credenciais Basic, tornando a experiência de logout pouco previsível.

Por isso, HTTP Basic é útil para:

- laboratório;
- ferramentas internas simples;
- integrações controladas;
- bootstrap técnico;
- demonstração do fluxo.

Ele raramente oferece a melhor experiência para aplicações modernas voltadas ao usuário.

---

### Challenge e WWW-Authenticate

Quando o servidor exige Basic, uma response `401` deve informar o esquema.

Exemplo:

```http
WWW-Authenticate:
Basic realm="formacao-java-api", charset="UTF-8"
```

`realm` identifica a área de proteção.

Ele não é:

- tenant;
- role;
- username;
- segredo;
- autorização.

Clientes usam o challenge para saber qual esquema é aceito.

A response continuará em Problem Details.

O header e o body possuem responsabilidades diferentes:

```text
WWW-Authenticate:
protocolo de autenticação.

Problem Details:
contrato de erro da API.
```

---

### BasicAuthenticationFilter

Quando HTTP Basic está habilitado, o Spring Security adiciona um filtro apropriado.

Fluxo:

1. lê `Authorization`;
2. verifica o esquema `Basic`;
3. decodifica username e password;
4. cria token não autenticado;
5. chama `AuthenticationManager`;
6. recebe resultado;
7. salva no `SecurityContext`;
8. continua a chain;
9. limpa o contexto ao final.

O filtro não deveria consultar banco diretamente.

A validação é delegada à arquitetura estudada na aula 418.

---

### InMemoryUserDetailsManager

`InMemoryUserDetailsManager` implementa:

```text
UserDetailsService;

UserDetailsManager.
```

Ele armazena `UserDetails` em memória.

Pode:

- criar;
- localizar;
- atualizar;
- remover;
- alterar password em memória.

Nesta aula, ele será construído uma vez com um usuário.

Nenhum endpoint administrativo permitirá modificar esse usuário.

A memória não é fonte durável.

---

### UserDetails e password hash

O `UserDetails` conterá:

- username;
- password hash;
- authorities;
- flags de conta.

Ele não conterá a password em texto puro.

A configuração receberá:

```text
{bcrypt}$2...
```

O `DaoAuthenticationProvider` chamará:

```java
passwordEncoder.matches(
        rawPassword,
        encodedPassword
);
```

A raw password existirá somente durante a tentativa de autenticação.

Ela não será salva no `SecurityContext`.

---

### DelegatingPasswordEncoder

`PasswordEncoderFactories.createDelegatingPasswordEncoder()` cria um encoder que reconhece prefixos.

Exemplos:

```text
{bcrypt};

{argon2};

{pbkdf2};

{scrypt}.
```

O formato permite:

- identificar algoritmo;
- verificar hashes antigos;
- migrar gradualmente;
- trocar o default futuro.

Um hash sem prefixo pode provocar:

```text
There is no PasswordEncoder mapped for id "null".
```

Não “corrija” isso adicionando:

```text
{noop}.
```

Adicione o prefixo correto ao hash codificado.

---

### PasswordEncoder não define política de password

O encoder protege o armazenamento.

Ele não decide:

- comprimento mínimo;
- senhas comprometidas;
- passphrase;
- MFA;
- rate limiting;
- lockout;
- recuperação;
- rotação.

Esses controles pertencem a outras partes da autenticação.

Nesta aula, a password é sintética e local.

---

### AuthenticationProvider automático

Quando existem:

- `UserDetailsService`;
- `PasswordEncoder`;
- HTTP Basic;

o Spring Security configura a autenticação username/password por meio de `DaoAuthenticationProvider`.

O provider:

1. carrega o usuário;
2. verifica flags;
3. compara a password;
4. cria `Authentication`;
5. atribui authorities;
6. remove credentials quando possível.

Não é necessário criar um provider customizado para este laboratório.

A customização só seria adequada com um requisito real.

---

### Autenticação versus autorização

Depois da validação da password:

```text
authentication.isAuthenticated():
true.
```

Isso não garante acesso a qualquer recurso.

A autorização ainda verifica:

- regra da request;
- role;
- authority;
- propriedade;
- estado do recurso;
- contexto de negócio.

Nesta aula:

```text
anyRequest().authenticated()
```

permite os endpoints normais da API para qualquer identidade válida.

Essa regra é ampla e temporária.

A API OS ainda precisará de:

- leitura;
- escrita;
- ownership;
- roles;
- policy por objeto.

As aulas posteriores aprofundarão autorização.

---

### Authorities

O usuário terá:

```text
ROLE_OPERATOR;

service-order:read;

service-order:write.
```

`ROLE_OPERATOR` é uma role convencional.

As outras duas são permissions.

Spring Security não interpreta automaticamente o significado de permissions.

A configuração precisa declarar onde cada authority é exigida.

O endpoint administrativo exigirá:

```text
ROLE_ADMIN.
```

Como o usuário não possui essa role, receberá `403`.

---

### 401 sem enumeração

Os cenários:

```text
username inexistente;

password incorreta;
```

devem produzir o mesmo contrato público:

```text
401;

authentication_required;

WWW-Authenticate Basic.
```

Não retorne:

```text
usuário não encontrado.
```

ou:

```text
password errada.
```

Isso ajuda a evitar enumeração de contas.

Logs internos também devem ser avaliados para não expor detalhes em nível inadequado.

---

### Stateless com HTTP Basic

A API continua usando:

```text
SessionCreationPolicy.STATELESS.
```

A identidade é reconstruída em cada request.

O servidor não cria `HttpSession` para guardar autenticação.

Consequências:

- cliente envia Basic sempre;
- verificação de password ocorre sempre;
- custo do hash participa de cada request;
- não existe logout de sessão;
- escalabilidade não depende de sticky session;
- credencial fica mais exposta ao uso repetido.

Essa é outra razão para HTTP Basic não ser o mecanismo final.

JWT será estudado depois, mas também possui trade-offs.

---

### Custo da password em toda request

BCrypt é deliberadamente caro.

No Basic stateless:

```text
cada request
pode executar BCrypt.matches.
```

Em alto volume, isso é caro.

Alternativas futuras:

- sessão autenticada;
- token de acesso curto;
- gateway;
- mTLS;
- API key com desenho adequado;
- OAuth2.

Não reduza o cost somente para compensar uma arquitetura inadequada.

Escolha o mecanismo correto.

---

### TLS é obrigatório fora do laboratório

Basic não protege a credencial.

TLS protege o transporte contra leitura e alteração por terceiros no caminho, quando corretamente configurado.

Fora de localhost:

```text
HTTP:
proibido.

HTTPS:
obrigatório.
```

HSTS pode complementar HTTPS depois que o domínio estiver preparado.

Não teste password real no laboratório HTTP.

---

### Variáveis de ambiente e hash

O profile receberá:

```text
APP_SECURITY_BASIC_USERNAME;

APP_SECURITY_BASIC_PASSWORD_HASH.
```

O hash ainda é sensível porque permite ataque offline.

Ele não deve aparecer em:

- Git;
- logs;
- tickets;
- prints;
- documentação;
- collection;
- response.

A password raw será usada apenas pelo cliente durante o teste.

---

### Profile de laboratório

O profile `basic-lab` impede ativação acidental na configuração normal.

Mesmo assim, profile não é controle suficiente de produção.

Também serão usadas:

- property `enabled`;
- validação;
- ausência de defaults de credencial;
- documentação;
- testes;
- deny by default fora do profile.

---

### with(user()) versus httpBasic()

Nos testes:

```java
.with(
        user("operator")
)
```

cria diretamente uma identidade no contexto.

Ele não testa password.

Já:

```java
.with(
        httpBasic(
                "operator",
                "password"
        )
)
```

cria o header Basic.

Esse caminho atravessa:

- filter;
- manager;
- provider;
- `UserDetailsService`;
- `PasswordEncoder`.

Para esta aula, os testes principais devem usar:

```text
httpBasic().
```

---

## Mão na massa guiada

### 1. Criar BasicAuthenticationProperties

Arquivo:

```text
BasicAuthenticationProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration.security;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.AssertTrue;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation
        .Validated;

@ConfigurationProperties(
        prefix = "app.security.basic"
)
@Validated
public class BasicAuthenticationProperties {

    private boolean enabled;

    private String username;

    private String passwordHash;

    private List<String> authorities =
            new ArrayList<>();

    @AssertTrue(
            message = """
                    Basic authentication requires username,
                    versioned password hash and authorities
                    """
    )
    public boolean isConfigurationValid() {
        if (!enabled) {
            return true;
        }

        return hasText(username)
                && hasText(passwordHash)
                && passwordHash.startsWith("{")
                && passwordHash.contains("}")
                && !authorities.isEmpty();
    }

    private boolean hasText(
            String value
    ) {
        return value != null
                && !value.isBlank();
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(
            boolean enabled
    ) {
        this.enabled = enabled;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(
            String username
    ) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(
            String passwordHash
    ) {
        this.passwordHash = passwordHash;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(
            List<String> authorities
    ) {
        this.authorities =
                new ArrayList<>(
                        authorities
                );
    }
}
```

A validação não imprime o hash.

---

### 2. Criar InMemoryBasicAuthenticationConfiguration

```java
package br.com.formacao.backend.configuration.security;

import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.boot.context.properties
        .EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.security.core.userdetails
        .User;
import org.springframework.security.core.userdetails
        .UserDetails;
import org.springframework.security.crypto.factory
        .PasswordEncoderFactories;
import org.springframework.security.crypto.password
        .PasswordEncoder;
import org.springframework.security.provisioning
        .InMemoryUserDetailsManager;

@Configuration(
        proxyBeanMethods = false
)
@EnableConfigurationProperties(
        BasicAuthenticationProperties.class
)
@ConditionalOnProperty(
        prefix = "app.security.basic",
        name = "enabled",
        havingValue = "true"
)
public class
        InMemoryBasicAuthenticationConfiguration {

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories
                .createDelegatingPasswordEncoder();
    }

    @Bean
    InMemoryUserDetailsManager
    inMemoryUserDetailsManager(

            BasicAuthenticationProperties
                    properties

    ) {
        UserDetails operator =
                User
                        .withUsername(
                                properties
                                        .getUsername()
                        )
                        .password(
                                properties
                                        .getPasswordHash()
                        )
                        .authorities(
                                properties
                                        .getAuthorities()
                                        .toArray(
                                                String[]::new
                                        )
                        )
                        .build();

        return new InMemoryUserDetailsManager(
                operator
        );
    }
}
```

Nenhuma raw password entra nesse bean.

---

### 3. Configurar application.yaml

No arquivo base:

```yaml
app:
  security:
    basic:
      enabled: false
      username:
      password-hash:
      authorities: []
```

O default continua fechado.

---

### 4. Criar application-basic-lab.yaml

```yaml
spring:
  config:
    activate:
      on-profile: basic-lab

app:
  security:
    basic:
      enabled: true
      username: ${APP_SECURITY_BASIC_USERNAME}
      password-hash: ${APP_SECURITY_BASIC_PASSWORD_HASH}
      authorities:
        - ROLE_OPERATOR
        - service-order:read
        - service-order:write
```

Sem as variáveis, a aplicação deve falhar no startup do profile.

Fail fast é melhor que iniciar com usuário desconhecido.

---

### 5. Ajustar o manager temporário

Na configuração da aula 419, altere:

```java
@Bean
@ConditionalOnProperty(
        prefix = "app.security.basic",
        name = "enabled",
        havingValue = "false",
        matchIfMissing = true
)
AuthenticationManager
unconfiguredAuthenticationManager() {
    return authentication -> {
        throw new ProviderNotFoundException(
                "No authentication mechanism is configured"
        );
    };
}
```

Quando Basic está ativo, o manager real é construído pela configuração de username/password.

---

### 6. Ativar HTTP Basic na API chain

Injete:

```text
BasicAuthenticationProperties.
```

Substitua o disable fixo:

```java
if (basicProperties.isEnabled()) {
    http.httpBasic(
            basic ->
                    basic
                            .realmName(
                                    "formacao-java-api"
                            )
                            .authenticationEntryPoint(
                                    authenticationEntryPoint
                            )
    );
}
else {
    http.httpBasic(
            AbstractHttpConfigurer::disable
    );
}
```

O comportamento continua explícito.

---

### 7. Atualizar o entry point

Injete:

```text
BasicAuthenticationProperties.
```

Antes de delegar ao resolver:

```java
if (properties.isEnabled()) {
    response.setHeader(
            HttpHeaders.WWW_AUTHENTICATE,
            """
            Basic realm="formacao-java-api", \
            charset="UTF-8"
            """
            .trim()
    );
}
```

Depois:

```java
resolver.resolveException(...);
```

O body continua no catálogo de Problem Details.

---

### 8. Atualizar autorização da API chain

Use:

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
                                "/api/security/admin-probe"
                        )
                        .hasRole(
                                "ADMIN"
                        )
                        .anyRequest()
                        .authenticated()
);
```

A ordem importa.

O matcher administrativo precisa vir antes de `anyRequest`.

---

### 9. Criar SecurityIdentityResponse

```java
package br.com.formacao.backend.web.security;

import java.util.List;

public record SecurityIdentityResponse(
        String username,
        List<String> authorities
) {
}
```

Não inclua:

- password;
- hash;
- credentials;
- details internos;
- session ID.

---

### 10. Criar SecurityIdentityController

```java
package br.com.formacao.backend.web.security;

import java.util.List;

import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core
        .Authentication;
import org.springframework.web.bind.annotation
        .GetMapping;
import org.springframework.web.bind.annotation
        .RequestMapping;
import org.springframework.web.bind.annotation
        .RestController;

@RestController
@RequestMapping(
        "/api/security"
)
@ConditionalOnProperty(
        prefix = "app.security.basic",
        name = "enabled",
        havingValue = "true"
)
public class SecurityIdentityController {

    @GetMapping("/me")
    SecurityIdentityResponse me(
            Authentication authentication
    ) {
        List<String> authorities =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(
                                granted ->
                                        granted
                                                .getAuthority()
                        )
                        .sorted()
                        .toList();

        return new SecurityIdentityResponse(
                authentication.getName(),
                authorities
        );
    }

    @GetMapping("/admin-probe")
    ResponseEntity<Void> adminProbe() {
        return ResponseEntity
                .noContent()
                .build();
    }
}
```

O endpoint administrativo existe somente quando Basic está habilitado.

---

### 11. Criar o gerador manual de hash

```java
package br.com.formacao.backend.security.password;

import static org.junit.jupiter.api.Assumptions
        .assumeTrue;

import org.junit.jupiter.api.Test;

import org.springframework.security.crypto.bcrypt
        .BCryptPasswordEncoder;

class BasicLabPasswordHashGeneratorTest {

    @Test
    void generateFromTemporaryEnvironmentVariable() {
        String rawPassword =
                System.getenv(
                        "BASIC_LAB_RAW_PASSWORD"
                );

        assumeTrue(
                rawPassword != null
                && !rawPassword.isBlank(),
                """
                Set BASIC_LAB_RAW_PASSWORD only
                for this manual test
                """
        );

        String encoded =
                "{bcrypt}"
                + new BCryptPasswordEncoder(
                        12
                )
                .encode(
                        rawPassword
                );

        System.out.println(
                "APP_SECURITY_BASIC_PASSWORD_HASH="
                + encoded
        );
    }
}
```

Ele imprime somente o hash.

Não redirecione o output para arquivo versionado.

---

### 12. Gerar a credencial no PowerShell

Crie uma password sintética:

```powershell
$securePassword =
  Read-Host `
    "Senha sintetica do basic-lab" `
    -AsSecureString

$pointer =
  [Runtime.InteropServices.Marshal]::
    SecureStringToBSTR(
      $securePassword
    )

try {
  $env:BASIC_LAB_RAW_PASSWORD =
    [Runtime.InteropServices.Marshal]::
      PtrToStringBSTR(
        $pointer
      )

  .\mvnw.cmd `
    -Dtest=BasicLabPasswordHashGeneratorTest `
    test
}
finally {
  [Runtime.InteropServices.Marshal]::
    ZeroFreeBSTR(
      $pointer
    )

  Remove-Item `
    Env:BASIC_LAB_RAW_PASSWORD `
    -ErrorAction SilentlyContinue
}
```

Copie apenas o valor depois de:

```text
APP_SECURITY_BASIC_PASSWORD_HASH=
```

Não copie a raw password para documento.

---

### 13. Ativar o profile local

Na sessão atual:

```powershell
$env:SPRING_PROFILES_ACTIVE =
  "local,basic-lab"

$env:APP_SECURITY_BASIC_USERNAME =
  "operator"

$env:APP_SECURITY_BASIC_PASSWORD_HASH =
  '{bcrypt}$2a$12$...'
```

Use aspas simples no PowerShell para preservar os caracteres `$` do hash.

Não coloque esses valores no Git.

---

### 14. Criar InMemoryBasicAuthenticationTest

Anotações:

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("basic-lab")
@TestPropertySource(
        properties = {
                """
                app.security.basic.username=operator
                """,
                """
                app.security.basic.password-hash=\
                {bcrypt}$2y$12$cvwiU/V2bG/UL/sTxBnrue\
                me1YmXvk52BI80w6Z.NZElOFJ3aSpnm
                """
        }
)
class InMemoryBasicAuthenticationTest {
}
```

A password sintética correspondente no teste será:

```text
Laboratorio-M15!2026
```

Ela não deve ser usada fora da suíte.

---

### 15. Testar anonymous

```java
@Test
void shouldChallengeAnonymousRequest()
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
                    containsString(
                            "Basic realm="
                    )
            )
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "authentication_required"
                    )
    )
    .andExpect(
            unauthenticated()
    );
}
```

Use o matcher de resultado do Spring Security Test.

---

### 16. Testar username inválido

```java
@Test
void shouldRejectUnknownUsername()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/security/me"
            )
            .with(
                    httpBasic(
                            "unknown",
                            "Laboratorio-M15!2026"
                    )
            )
    )
    .andExpect(
            status().isUnauthorized()
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "authentication_required"
                    )
    )
    .andExpect(
            unauthenticated()
    );
}
```

---

### 17. Testar password inválida

```java
@Test
void shouldRejectInvalidPassword()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/security/me"
            )
            .with(
                    httpBasic(
                            "operator",
                            "wrong-password"
                    )
            )
    )
    .andExpect(
            status().isUnauthorized()
    )
    .andExpect(
            jsonPath("$.code")
                    .value(
                            "authentication_required"
                    )
    )
    .andExpect(
            unauthenticated()
    );
}
```

O contrato é igual ao username inválido.

---

### 18. Testar credencial válida

```java
@Test
void shouldAuthenticateValidBasicCredentials()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/security/me"
            )
            .with(
                    httpBasic(
                            "operator",
                            "Laboratorio-M15!2026"
                    )
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            jsonPath("$.username")
                    .value(
                            "operator"
                    )
    )
    .andExpect(
            jsonPath("$.authorities")
                    .isArray()
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
    )
    .andExpect(
            authenticated()
                    .withUsername(
                            "operator"
                    )
    )
    .andExpect(
            header().doesNotExist(
                    HttpHeaders.SET_COOKIE
            )
    );
}
```

Esse teste atravessa o mecanismo real de Basic.

---

### 19. Testar 403

```java
@Test
void shouldReturnForbiddenWithoutAdminRole()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/security/admin-probe"
            )
            .with(
                    httpBasic(
                            "operator",
                            "Laboratorio-M15!2026"
                    )
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
                    .withUsername(
                            "operator"
                    )
    );
}
```

A password foi validada.

A role necessária não existe.

---

### 20. Testar ausência de dados sensíveis

No teste de `/me`:

```java
.andExpect(
        jsonPath("$.password")
                .doesNotExist()
)
.andExpect(
        jsonPath("$.passwordHash")
                .doesNotExist()
)
.andExpect(
        jsonPath("$.credentials")
                .doesNotExist()
);
```

A response contém somente informação necessária ao diagnóstico.

---

### 21. Testar CORS com Basic

Preflight:

```text
continua sem credentials;
continua 200 para origin permitida.
```

Request real:

```java
mockMvc.perform(
        get(
                "/api/security/me"
        )
        .header(
                HttpHeaders.ORIGIN,
                "http://localhost:5173"
        )
        .with(
                httpBasic(
                        "operator",
                        "Laboratorio-M15!2026"
                )
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
```

Basic no header `Authorization` deve ser incluído na allowlist CORS quando o frontend cross-origin realmente usar esse mecanismo.

Atualize:

```yaml
allowed-headers:
  - Authorization
```

Preserve os headers anteriores.

---

### 22. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=InMemoryBasicAuthenticationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

O teste gerador pode aparecer como skipped sem a variável manual.

Registre essa razão no relatório de testes.

---

### 23. Executar com Compose

Depois de definir as variáveis:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Confirme o profile nos logs sem imprimir o hash.

---

### 24. Criar PSCredential

```powershell
$credential =
  [System.Management.Automation.PSCredential]::
    new(
      "operator",
      $securePassword
    )
```

A `SecureString` fica na sessão PowerShell.

Não coloque a password na linha de comando.

---

### 25. Testar anonymous real

```powershell
Invoke-WebRequest `
  "http://localhost:8081/api/security/me" `
  -SkipHttpErrorCheck
```

Confirme:

```text
401;

WWW-Authenticate;

Problem Details.
```

---

### 26. Testar credencial válida real

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/security/me" `
  -Authentication Basic `
  -Credential $credential
```

Confirme:

- username;
- authorities;
- ausência de password;
- ausência de cookie.

---

### 27. Testar API OS

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/v2/service-orders?page=0&size=5" `
  -Authentication Basic `
  -Credential $credential
```

A request autenticada deve alcançar o controller.

A autorização fina ainda não foi aplicada.

---

### 28. Testar 403 real

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:8081/api/security/admin-probe" `
  -Authentication Basic `
  -Credential $credential `
  -SkipHttpErrorCheck
```

Confirme:

```text
403;

access_denied.
```

---

### 29. Documentar limitações

Crie:

```text
docs/security/M15_IN_MEMORY_BASIC_AUTH.md
```

Registre:

```text
uso:
somente laboratório.

transporte:
HTTPS obrigatório fora de localhost.

persistência:
nenhuma.

usuários:
um.

credencial:
variável de ambiente com hash.

sessão:
stateless.

custo:
BCrypt executado em cada request.

logout:
cliente descarta credencial.

produção pública:
não aprovada.
```

---

### 30. Atualizar documentos anteriores

Baseline:

```text
autenticação:
presente somente no basic-lab.
```

Threat model:

```text
THR-021:
captura de Basic em HTTP.

THR-022:
brute force sem rate limit específico de login.

THR-023:
hash exposto por configuração.

THR-024:
custo BCrypt por request causa DoS.
```

OWASP:

```text
A04:
Basic exige TLS.

A07:
primeiro mecanismo didático presente.

A09:
sucesso e falha ainda precisam auditoria.

A10:
falha de provider retorna 401 controlado.
```

OpenAPI:

```text
security scheme:
basicAuth;

somente no profile/laboratório documentado.
```

A próxima aula substituirá a origem do usuário.

---

### 31. Encerrar e limpar variáveis

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down

Remove-Item `
  Env:APP_SECURITY_BASIC_USERNAME `
  -ErrorAction SilentlyContinue

Remove-Item `
  Env:APP_SECURITY_BASIC_PASSWORD_HASH `
  -ErrorAction SilentlyContinue

Remove-Item `
  Env:SPRING_PROFILES_ACTIVE `
  -ErrorAction SilentlyContinue
```

Descarte também a referência PowerShell quando terminar:

```powershell
Remove-Variable `
  credential,
  securePassword `
  -ErrorAction SilentlyContinue
```

---

## Entendendo o que foi feito

### A fronteira ganhou uma porta

A API fechada passou a aceitar uma identidade válida.

### A password não foi versionada

Somente o hash chegou ao servidor.

### O provider foi configurado pelo framework

Não houve autenticação customizada desnecessária.

### O SecurityContext passou a ter usuário real

O principal veio de `UserDetails`.

### 401 ganhou challenge

O cliente sabe que Basic é o mecanismo aceito.

### 403 comprovou autorização separada

Password válida não concedeu `ROLE_ADMIN`.

### Stateless permaneceu ativo

Nenhum `JSESSIONID` foi criado.

### O laboratório continuou temporário

Banco, cadastro e produção permaneceram fora do escopo.

---

## Erros comuns importantes

### Usar `{noop}`

Isso armazena password sem hash.

### Colocar raw password no YAML

Configuração versionada não é secret manager.

### Commitar um hash real

Hash ainda permite ataque offline.

### Usar HTTP Basic por HTTP público

Base64 é facilmente reversível.

### Liberar tudo após autenticar

Autenticação não substitui autorização.

### Usar `with(user())` para testar password

Esse helper pula o mecanismo de autenticação.

### Criar usuário default invisível

Credenciais devem ser explícitas e controladas.

### Retornar erros diferentes

Username e password inválidos não devem permitir enumeração.

### Criar sessão sem perceber

Basic stateless deve reconstruir a identidade por request.

### Tratar in-memory como produção

Não existe persistência, governança ou escala adequada.

---

## Comandos úteis

### Gerar hash manual

```powershell
.\mvnw.cmd `
  -Dtest=BasicLabPasswordHashGeneratorTest `
  test
```

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=InMemoryBasicAuthenticationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Consultar identidade

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/security/me" `
  -Authentication Basic `
  -Credential $credential
```

### Testar 403

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:8081/api/security/admin-probe" `
  -Authentication Basic `
  -Credential $credential `
  -SkipHttpErrorCheck
```

### Limpar ambiente

```powershell
Remove-Item `
  Env:APP_SECURITY_BASIC_USERNAME,
  Env:APP_SECURITY_BASIC_PASSWORD_HASH `
  -ErrorAction SilentlyContinue
```

---

## Exercício guiado

### Parte 1 — Protocolo

Decodifique uma credencial sintética e comprove que Base64 não protege.

### Parte 2 — Configuração

Crie properties sem defaults de credencial.

### Parte 3 — Hash

Gere BCrypt com prefixo versionado.

### Parte 4 — Usuário

Crie `InMemoryUserDetailsManager`.

### Parte 5 — Chain

Ative Basic e exija autenticação.

### Parte 6 — Identidade

Crie `/api/security/me`.

### Parte 7 — Autorização

Crie um probe administrativo e valide `403`.

### Parte 8 — Testes

Use `httpBasic`, `authenticated` e `unauthenticated`.

### Parte 9 — Execução

Teste via PowerShell sem password na linha de comando.

### Parte 10 — Documentação

Registre limites e prepare a persistência.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 419 foi preservada;
- HTTP Basic foi explicado;
- Base64 foi diferenciado de criptografia;
- TLS foi exigido fora do laboratório;
- dados sintéticos foram exigidos;
- BasicAuthenticationFilter foi explicado;
- challenge foi explicado;
- WWW-Authenticate foi configurado;
- realm foi explicado;
- InMemoryUserDetailsManager foi explicado;
- UserDetailsManager foi citado;
- usuário em memória não foi tratado como persistente;
- restart e múltiplas instâncias foram discutidos;
- PasswordEncoder foi usado;
- DelegatingPasswordEncoder foi usado;
- prefixo bcrypt foi exigido;
- noop foi rejeitado;
- DaoAuthenticationProvider foi explicado;
- provider customizado não foi criado sem necessidade;
- raw password não entrou no bean;
- raw password não entrou no YAML;
- hash não foi versionado;
- hash foi tratado como sensível;
- BCrypt foi justificado somente para o lab;
- Argon2id permaneceu preferencial para novo banco;
- autenticação foi diferenciada de autorização;
- ROLE_OPERATOR foi criada;
- permissions de OS foram criadas;
- ROLE_ADMIN não foi concedida;
- 401 e 403 foram preservados;
- username inválido e password inválida possuem mesmo contrato;
- SessionCreationPolicy.STATELESS foi preservada;
- custo BCrypt por request foi explicado;
- logout stateless foi explicado;
- BasicAuthenticationProperties foi criada;
- enabled default é false;
- username sem default foi usado;
- password hash sem default foi usado;
- authorities vazias por default foram usadas;
- configuração inválida falha;
- InMemoryBasicAuthenticationConfiguration foi criada;
- conditional property foi usada;
- PasswordEncoder bean foi criado;
- InMemoryUserDetailsManager bean foi criado;
- application-basic-lab.yaml foi criado;
- variáveis de ambiente foram usadas;
- manager temporário foi condicionado;
- HTTP Basic foi habilitado somente quando configurado;
- entry point adicionou challenge;
- API chain passou a authenticated;
- admin matcher veio antes de anyRequest;
- SecurityIdentityResponse foi criado;
- response não possui password;
- response não possui hash;
- response não possui credentials;
- SecurityIdentityController foi criado;
- controller existe somente com Basic habilitado;
- `/me` foi criado;
- `/admin-probe` foi criado;
- gerador manual de hash foi criado;
- SecureString foi usado no PowerShell;
- raw password temporária foi removida do ambiente;
- hash recebeu prefixo `{bcrypt}`;
- aspas simples foram recomendadas para `$`;
- teste de integração foi criado;
- profile basic-lab foi ativado no teste;
- hash sintético foi usado;
- password sintética foi usada;
- anonymous retornou 401;
- challenge foi testado;
- username inválido retornou 401;
- password inválida retornou 401;
- credencial válida retornou 200;
- authorities foram testadas;
- authenticated matcher foi usado;
- ausência de cookie foi testada;
- admin probe retornou 403;
- ausência de campos sensíveis foi testada;
- preflight continuou permitido;
- Authorization foi adicionado aos allowed headers;
- request CORS real foi testada;
- httpBasic foi usado em vez de with user;
- gerador manual skipped foi explicado;
- gate completo foi executado;
- Compose foi executado;
- profile foi confirmado sem logar hash;
- PSCredential foi usado;
- anonymous real foi testado;
- credencial válida real foi testada;
- API OS autenticada foi testada;
- 403 real foi testado;
- documento do Basic foi criado;
- limitações foram registradas;
- produção pública permaneceu não aprovada;
- baseline foi atualizada;
- threat model foi atualizado;
- OWASP foi atualizado;
- OpenAPI recebeu basicAuth com ressalva;
- variáveis foram removidas;
- stack foi encerrada;
- usuário no banco não foi antecipado;
- migration não foi criada;
- cadastro não foi criado;
- JWT não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 421 está correta.

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
git commit -m "feat(m15): autenticar usuario em memoria com HTTP Basic"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- raw password;
- hash real de ambiente;
- credential;
- env file;
- Basic header;
- logs de autenticação;
- cookie;
- usuário de produção;
- tabela antecipada;
- debug de segurança.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação autenticou sua primeira identidade real.

O fluxo executado foi:

```text
Authorization Basic;

BasicAuthenticationFilter;

AuthenticationManager;

DaoAuthenticationProvider;

InMemoryUserDetailsManager;

PasswordEncoder.matches;

SecurityContext;

AuthorizationFilter;

controller.
```

A API agora diferencia:

```text
sem credential:
401.

credential inválida:
401.

credential válida:
200.

identidade sem role:
403.
```

A implementação preservou:

```text
stateless;

sem JSESSIONID;

Problem Details;

CORS;

security headers;

deny by default;

credenciais fora do Git.
```

A decisão central foi:

```text
HTTP Basic demonstra
o fluxo completo de autenticação,
mas não protege o transporte
e não substitui autorização;

fora do laboratório,
TLS é obrigatório.
```

O usuário ainda não é persistente.

Ele desaparece como entidade gerenciável quando a configuração muda.

A próxima aula será:

```text
421 - M15.11 - Autenticacao com banco
```

Nela, você irá:

- modelar usuário;
- criar migration;
- armazenar password hash;
- criar repository;
- implementar `UserDetailsService`;
- adaptar domínio para `UserDetails`;
- preservar flags de conta;
- autenticar pelo PostgreSQL;
- testar usuário ausente;
- testar password inválida;
- testar usuário desabilitado;
- migrar do in-memory;
- manter o contrato HTTP Basic como mecanismo didático.

JWT continuará reservado para as aulas seguintes.

---

# Material complementar

## Checkpoint final

- [ ] Criei usuário em memória sem raw password no código.
- [ ] Ativei HTTP Basic somente no laboratório.
- [ ] Testei 401, 200 e 403.
- [ ] Comprovei ausência de sessão.
- [ ] Documentei limites e preparei o banco.

---

## Troubleshooting adicional

### A aplicação não inicia no basic-lab

Confirme:

- username;
- hash;
- prefixo `{bcrypt}`;
- authorities;
- variáveis disponíveis no processo.

### Aparece “id null” no PasswordEncoder

O hash não possui prefixo de algoritmo.

Use:

```text
{bcrypt}$2...
```

### Credencial válida retorna 401

Confirme:

- raw password correspondente;
- hash completo;
- caracteres `$` preservados;
- username case-sensitive;
- profile ativo.

### `/me` retorna 404

Confirme `app.security.basic.enabled=true`.

O controller é condicional.

### `/admin-probe` retorna 200

Revise o matcher e as authorities.

O usuário não deve possuir `ROLE_ADMIN`.

### O browser mostra prompt nativo

Esse é um comportamento comum de HTTP Basic.

O laboratório pode usar PowerShell ou Postman para maior controle.

### Surge JSESSIONID

Revise:

- stateless;
- request cache;
- outro componente criando sessão;
- endpoint acessado.

### O teste gerador fica skipped

Isso é esperado quando `BASIC_LAB_RAW_PASSWORD` não foi definida.

---

## Perguntas de revisão

1. O que HTTP Basic transporta?
2. Base64 protege a password?
3. Qual header carrega Basic?
4. Para que serve WWW-Authenticate?
5. O que é realm?
6. Quem lê o header Basic?
7. Quem carrega o usuário?
8. Quem compara a password?
9. Onde o usuário fica armazenado?
10. O usuário sobrevive a restart?
11. O que faz DelegatingPasswordEncoder?
12. Por que existe `{bcrypt}`?
13. Qual status para credencial inválida?
14. Qual status para role ausente?
15. Basic cria sessão nesta aula?
16. A password pode ir no YAML?
17. Hash pode ir para o frontend?
18. `with(user())` testa password?
19. Basic está aprovado para HTTP público?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Username e password.
2. Não.
3. Authorization.
4. Informar o esquema aceito.
5. Área de proteção.
6. BasicAuthenticationFilter.
7. InMemoryUserDetailsManager.
8. DaoAuthenticationProvider com PasswordEncoder.
9. Na memória da instância.
10. Não como dado gerenciado.
11. Escolhe encoder pelo prefixo.
12. Identificar o algoritmo.
13. 401.
14. 403.
15. Não.
16. Não.
17. Não.
18. Não.
19. Não.
20. Autenticação com banco.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 420 - M15.10 - Login basico usuario em memoria

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Estudei HTTP Basic.
- Confirmei que Base64 não protege credentials.
- Exigi HTTPS fora do laboratório local.
- Estudei BasicAuthenticationFilter.
- Configurei WWW-Authenticate com realm.
- Criei `BasicAuthenticationProperties`.
- Mantive Basic desativado por default.
- Criei `application-basic-lab.yaml`.
- Usei username e hash por variáveis de ambiente.
- Não versionei raw password ou hash real.
- Criei `InMemoryBasicAuthenticationConfiguration`.
- Criei `DelegatingPasswordEncoder`.
- Criei `InMemoryUserDetailsManager`.
- Usei um hash BCrypt versionado por prefixo.
- Mantive Argon2id como decisão futura para usuários persistidos.
- Condicionei o AuthenticationManager temporário.
- Ativei HTTP Basic somente quando configurado.
- Alterei a API chain para exigir autenticação.
- Mantive deny by default para regras não declaradas.
- Criei `SecurityIdentityResponse`.
- Criei `/api/security/me`.
- Criei `/api/security/admin-probe`.
- Não expus password, hash ou credentials.
- Criei um gerador manual de hash.
- Usei SecureString no PowerShell.
- Criei `InMemoryBasicAuthenticationTest`.
- Testei anonymous com 401.
- Testei username e password inválidos com o mesmo contrato.
- Testei credencial válida com `httpBasic`.
- Testei authorities.
- Testei ausência de JSESSIONID.
- Testei `403` sem ROLE_ADMIN.
- Adicionei Authorization à allowlist CORS.
- Testei preflight e request real.
- Executei a aplicação com Compose.
- Testei a identidade com PSCredential.
- Testei a API OS autenticada.
- Criei `docs/security/M15_IN_MEMORY_BASIC_AUTH.md`.
- Atualizei baseline, threat model, OWASP e OpenAPI.
- Mantive produção pública não aprovada.
- Não criei tabela, migration, cadastro ou JWT.
- Próxima aula: Autenticacao com banco.
```

---

## Referência técnica curta

- [Spring Security — In-Memory Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/in-memory.html)
- [Spring Security — HTTP Basic](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html)
- [Spring Security — UserDetailsService](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html)
- [Spring Security — PasswordEncoder](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html)
- [Spring Security — Testing HTTP Basic](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/http-basic.html)
- [RFC 7617 — The Basic HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc7617)

Regra final:

```text
o login básico em memória precisa demonstrar o fluxo real de username e password sem transformar credenciais de laboratório em configuração permanente; nesta baseline, HTTP Basic é ativado somente por profile, o usuário recebe hash versionado por variável de ambiente, InMemoryUserDetailsManager e PasswordEncoder alimentam o DaoAuthenticationProvider, 401 e 403 permanecem distintos, a API continua stateless e TLS é obrigatório sempre que a credencial deixar o localhost controlado.
```
