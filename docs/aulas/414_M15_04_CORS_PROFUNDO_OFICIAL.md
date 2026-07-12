# 414 - M15.04 - CORS profundo

## Apresentação da aula

Na aula 413, você aplicou o OWASP Top 10:2025 ao projeto.

A revisão identificou:

```text
controle de acesso quebrado;

configuração insegura;

riscos de supply chain;

falhas criptográficas;

injection;

design inseguro;

falhas de autenticação;

integridade de software e dados;

logging e alerting;

exceptional conditions.
```

A análise também reforçou um ponto importante:

```text
configuração de navegador
pode reduzir ou ampliar
a superfície de ataque.
```

Agora o M15 entra em um tema frequentemente mal compreendido:

```text
CORS.
```

CORS significa:

```text
Cross-Origin Resource Sharing.
```

Ele é um mecanismo baseado em headers HTTP que permite ao servidor informar ao navegador quais origins podem acessar uma response por JavaScript.

A pergunta central desta aula será:

```text
quando um frontend em outra origin
pode chamar a API
e como permitir somente
o que realmente é necessário?
```

A resposta precisa começar por uma distinção.

CORS não é:

- autenticação;
- autorização;
- firewall;
- proteção contra qualquer request;
- substituto de TLS;
- substituto de CSRF;
- controle aplicado por Postman;
- controle aplicado por curl;
- validação de usuário;
- prova de identidade.

CORS é aplicado principalmente pelo navegador.

Um cliente server-to-server pode chamar a API sem obedecer à política CORS.

Por isso:

```text
uma origin não autorizada
pode continuar enviando requests
fora do browser;

CORS controla o acesso do JavaScript
à response dentro do browser.
```

Outro ponto fundamental:

```text
o servidor pode processar a request,
mas o navegador pode impedir
que o JavaScript leia a response.
```

Essa característica explica por que CORS não pode ser tratado como autorização.

Também explica a ponte para a próxima aula:

```text
415 - M15.05 - CSRF quando importa em APIs
```

Uma request pode ser enviada pelo navegador em determinadas condições mesmo quando a leitura da response é bloqueada.

CSRF possui outra pergunta:

```text
um site malicioso consegue induzir
o browser autenticado da vítima
a executar uma ação?
```

Nesta aula, CSRF será apenas diferenciado.

O aprofundamento ficará para a aula 415.

O laboratório adicionará uma política CORS explícita à aplicação.

Ela será:

```text
desativada por default;

ativada no profile local;

limitada a /api/**;

baseada em allowlist;

sem credentials;

com methods explícitos;

com headers explícitos;

com response headers expostos;

com max-age controlado;

testada com MockMvc;

testada no navegador.
```

A origin permitida no laboratório será:

```text
http://localhost:5173
```

A origin rejeitada será:

```text
https://evil.example
```

A configuração não utilizará:

```text
*.
```

Mesmo sem credenciais, a allowlist explícita é melhor para uma API de negócio que conhece seus consumidores web.

A política permitirá:

```text
GET;

POST;

PUT;

PATCH;

DELETE;

OPTIONS.
```

Headers de request permitidos:

```text
Content-Type;

If-Match;

X-Correlation-Id;

X-Client-Id.
```

Headers de response expostos ao JavaScript:

```text
ETag;

Location;

X-Correlation-Id;

Retry-After.
```

Essa distinção é essencial.

`Access-Control-Allow-Headers` responde:

```text
quais headers o browser
pode enviar na request?
```

`Access-Control-Expose-Headers` responde:

```text
quais headers da response
o JavaScript pode ler?
```

Sem exposição explícita, o JavaScript não consegue ler livremente todos os headers da response.

Na API OS, isso afeta diretamente:

- `ETag`;
- `Location`;
- `Retry-After`;
- `X-Correlation-Id`.

A configuração será centralizada.

Não serão espalhados `@CrossOrigin` por controllers.

Motivos:

- visibilidade da política;
- revisão central;
- menor risco de divergência;
- configuração por ambiente;
- testes únicos;
- menor chance de liberar um endpoint por engano.

A aula criará:

```text
WebCorsProperties;

WebCorsConfiguration;

WebCorsConfigurationTest;

tools/cors-lab/index.html.
```

Não será adicionada dependency externa.

O Spring Framework já possui suporte CORS no Spring MVC.

Spring Security ainda não será instalado.

Quando ele for introduzido, a integração de CORS com a filter chain será tratada no momento correto.

---

## Onde estamos na formação

A sequência atual do M15 é:

```text
411:
Fundamentos seguranca web.

412:
Threat modeling inicial.

413:
OWASP Top 10 aplicado.

414:
CORS profundo.

415:
CSRF quando importa em APIs.

416:
Security headers.

417:
Senhas nunca em texto puro.
```

A aula 413 respondeu:

```text
como as categorias OWASP
aparecem no projeto?
```

A aula 414 responderá:

```text
como o navegador decide
se um JavaScript de outra origin
pode ler responses da API?
```

Nesta aula:

```text
same-origin policy:
sim.

origin:
sim.

CORS:
sim.

simple request:
sim.

preflight:
sim.

credentials:
sim.

allowlist:
sim.

Spring MVC:
sim.

MockMvc:
sim.

browser lab:
sim.

CSRF:
somente diferenciação.

Spring Security:
não.

session login:
não.

JWT:
não.
```

A regra central será:

```text
CORS precisa ser
tão específico quanto possível
e tão amplo quanto necessário;

ele nunca substitui
autenticação e autorização.
```

---

## Objetivo prático

Ao final da aula, a aplicação possuirá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── web
        ├── WebCorsProperties.java
        └── WebCorsConfiguration.java
```

Testes:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── web
        └── WebCorsConfigurationTest.java
```

Laboratório browser:

```text
tools/cors-lab/index.html
```

Configuração local:

```text
application-local.yaml
```

A política será:

```text
mapping:
    /api/**

allowed origin:
    http://localhost:5173

allow credentials:
    false

max age:
    3600 segundos
```

Você irá:

1. compreender same-origin policy;
2. decompor uma origin;
3. diferenciar same-origin e cross-origin;
4. entender requests safelisted;
5. entender preflight;
6. conhecer os headers;
7. criar configuração tipada;
8. ativar CORS por profile;
9. configurar allowlist;
10. configurar methods;
11. configurar request headers;
12. configurar exposed headers;
13. manter credentials desativadas;
14. criar testes de preflight;
15. testar origin permitida;
16. testar origin rejeitada;
17. testar request real;
18. testar pelo navegador;
19. registrar evidências;
20. atualizar a documentação de segurança.

---

## Conceito essencial

### Same-Origin Policy

A Same-Origin Policy, ou SOP, é uma política de isolamento aplicada pelo browser.

Ela restringe como scripts de uma origin interagem com recursos de outra origin.

O objetivo é impedir que um site qualquer leia dados de outro site usando a sessão da vítima ou recursos acessíveis pelo browser.

Exemplo:

```text
frontend:
http://localhost:5173

API:
http://localhost:8081
```

As origins são diferentes porque as portas são diferentes.

Sem uma resposta CORS compatível, o navegador não entrega a response da API ao JavaScript do frontend.

---

### O que forma uma origin

Uma origin é composta por:

```text
scheme;

host;

port.
```

Exemplo:

```text
http://localhost:5173
```

Componentes:

```text
scheme:
http.

host:
localhost.

port:
5173.
```

O path não participa da origin.

Estes dois recursos possuem a mesma origin:

```text
http://localhost:5173/orders

http://localhost:5173/admin.
```

Estes possuem origins diferentes:

```text
http://localhost:5173

http://localhost:8081.
```

Também são diferentes:

```text
http://example.com

https://example.com.
```

E:

```text
http://localhost:5173

http://127.0.0.1:5173.
```

Mesmo apontando para a mesma máquina, os hosts serializados são diferentes.

A allowlist precisa usar a origin exata do frontend.

---

### Cross-origin não significa cross-site

Origin e site são conceitos relacionados, mas diferentes.

Nesta aula, o foco é origin.

Essa diferença ficará relevante em CSRF e cookies.

Não trate:

```text
same-site
```

como sinônimo automático de:

```text
same-origin.
```

---

### CORS é um protocolo de permissão

O browser envia:

```http
Origin: http://localhost:5173
```

O servidor pode responder:

```http
Access-Control-Allow-Origin: http://localhost:5173
```

Quando os valores são compatíveis, o browser pode compartilhar a response com o JavaScript.

O servidor não deve refletir qualquer origin sem validação.

Exemplo perigoso:

```text
recebe Origin;

copia o valor;

responde como permitido.
```

Isso equivale a uma allowlist universal disfarçada.

---

### Request safelisted

Algumas requests cross-origin podem seguir sem preflight.

Elas são frequentemente chamadas de:

```text
simple requests.
```

Em termos práticos, existem restrições sobre:

- método;
- headers;
- content type.

Métodos safelisted:

```text
GET;

HEAD;

POST.
```

Content types safelisted:

```text
application/x-www-form-urlencoded;

multipart/form-data;

text/plain.
```

`application/json` não está nessa lista.

Uma request JSON cross-origin normalmente provoca preflight.

Headers customizados também provocam preflight.

Exemplo:

```http
X-Client-Id: browser-lab
```

---

### Preflight

Preflight é uma request `OPTIONS` enviada pelo browser antes da request real.

Exemplo:

```http
OPTIONS /api/v2/service-orders HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type,x-client-id
```

O browser pergunta:

```text
esta origin pode usar POST?

pode enviar Content-Type?

pode enviar X-Client-Id?
```

Uma response permitida pode conter:

```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,If-Match,X-Correlation-Id,X-Client-Id
Access-Control-Max-Age: 3600
```

Depois do preflight aprovado, o browser envia a request real.

O preflight não deve executar o caso de uso.

Ele valida a política CORS.

---

### Response real também precisa de CORS

Não basta responder corretamente ao `OPTIONS`.

A response do `POST`, `GET`, `PUT`, `PATCH` ou `DELETE` também precisa conter o header CORS correspondente.

Caso contrário, o browser bloqueia o compartilhamento da response com o JavaScript.

O servidor pode ter criado o recurso.

O frontend pode enxergar apenas:

```text
TypeError: Failed to fetch.
```

Por isso, CORS mal configurado pode gerar:

- operação executada;
- response invisível;
- retry do usuário;
- duplicação;
- diagnóstico confuso.

---

### Access-Control-Allow-Origin

Esse header informa a origin autorizada.

Exemplo:

```http
Access-Control-Allow-Origin: http://localhost:5173
```

Para requests sem credentials, `*` pode ser tecnicamente válido em cenários públicos.

Nesta API de negócio, será usada uma allowlist explícita.

Não permita:

```text
https://evil.example.
```

Não permita a origin especial:

```text
null.
```

Ela pode aparecer em contextos como arquivos locais e documentos sandboxed.

---

### Vary: Origin

Quando a response varia conforme a origin, caches intermediários precisam saber disso.

Header:

```http
Vary: Origin
```

Sem ele, um cache pode reutilizar uma response CORS preparada para uma origin em outra origin.

O processamento CORS do Spring gerencia headers `Vary` relevantes.

O teste verificará a presença de `Origin` no `Vary`.

---

### Access-Control-Allow-Methods

Usado principalmente no preflight.

Informa os métodos permitidos para CORS.

Não confunda com:

```http
Allow:
```

O header `Allow` possui outra finalidade no HTTP.

A política deve listar somente o necessário.

Nesta feature:

```text
GET;

POST;

PUT;

PATCH;

DELETE;

OPTIONS.
```

---

### Access-Control-Allow-Headers

Informa quais headers da request real podem ser enviados pelo browser.

A baseline precisa de:

```text
Content-Type;

If-Match;

X-Correlation-Id;

X-Client-Id.
```

`If-Match` é necessário para mutações da API OS.

Não adicionar esse header à política causaria falha no preflight.

---

### Access-Control-Expose-Headers

O JavaScript não recebe acesso automático a todos os headers da response.

A API precisa expor os headers relevantes:

```text
ETag;

Location;

X-Correlation-Id;

Retry-After.
```

Exemplo no browser:

```javascript
response.headers.get("ETag");
```

Sem `Access-Control-Expose-Headers`, o valor pode não ficar acessível ao script.

---

### Access-Control-Max-Age

O browser pode armazenar o resultado do preflight em um cache específico.

Exemplo:

```http
Access-Control-Max-Age: 3600
```

Isso reduz requests `OPTIONS` repetidas.

O browser pode aplicar limites próprios.

Não configure durações enormes durante desenvolvimento, pois mudanças de policy podem parecer não funcionar por causa do cache.

Nesta aula:

```text
3600 segundos.
```

Ao depurar, desabilite o cache no DevTools ou use uma nova sessão.

---

### Credentials

Credentials em requests cross-origin podem incluir:

- cookies;
- HTTP authentication;
- certificados TLS de cliente.

No Fetch API:

```javascript
credentials: "include"
```

solicita inclusão em contexto cross-origin.

O servidor precisa responder:

```http
Access-Control-Allow-Credentials: true
```

Quando credentials estão incluídas, a origin permitida não pode ser `*`.

A baseline desta aula utilizará:

```text
allowCredentials:
false.
```

Motivo:

```text
a aplicação ainda não possui
sessão nem autenticação.
```

Ativar credentials antes de existir um caso de uso seria ampliar a confiança sem necessidade.

---

### CORS e autenticação

Uma origin permitida não representa um usuário autenticado.

Exemplo:

```text
http://localhost:5173
```

pode conter:

- código legítimo;
- extensão maliciosa;
- XSS;
- usuário sem permissão.

CORS responde:

```text
este código de navegador
pode ler a response?
```

Autenticação responde:

```text
quem é a identidade?
```

Autorização responde:

```text
essa identidade pode executar?
```

Os três controles possuem responsabilidades diferentes.

---

### CORS e CSRF

CORS não é uma defesa completa contra CSRF.

Motivos:

- certas requests podem ser enviadas sem preflight;
- forms HTML podem enviar dados cross-site;
- cookies podem acompanhar requests conforme atributos e contexto;
- bloquear leitura não impede todo efeito no servidor.

A próxima aula analisará quando CSRF importa em APIs.

Nesta aula, mantenha:

```text
credentials:
false.
```

---

### no-cors não resolve

No Fetch API:

```javascript
mode: "no-cors"
```

não desabilita a segurança do browser.

Ele cria uma request limitada e produz uma response:

```text
opaque.
```

O JavaScript não consegue ler:

- status útil;
- body;
- headers.

Não use `no-cors` para “corrigir” CORS.

Corrija a política do servidor.

---

### Postman não testa o bloqueio do browser

Postman, Insomnia, curl e backend clients não aplicam a Same-Origin Policy como um browser.

Eles conseguem chamar a API mesmo quando CORS está ausente.

Essas ferramentas ajudam a inspecionar headers.

Elas não substituem o teste no navegador.

---

### Configuração local e global

Spring MVC permite:

- `@CrossOrigin`;
- configuração global;
- `CorsFilter`;
- integração posterior com Spring Security.

Nesta baseline será usada configuração global por path.

`@CrossOrigin` ficará fora porque a política pertence à aplicação, não a um método isolado.

---

### allowedOrigins e allowedOriginPatterns

`allowedOrigins` utiliza origins explícitas.

Exemplo:

```text
http://localhost:5173.
```

`allowedOriginPatterns` aceita padrões.

Padrões amplos podem liberar subdomínios não confiáveis ou futuramente abandonados.

Nesta aula, não serão usados patterns.

Uma lista pequena e explícita é mais fácil de revisar.

---

## Mão na massa guiada

### 1. Criar WebCorsProperties

Arquivo:

```text
src/main/java/br/com/formacao/backend/configuration/web/WebCorsProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration.web;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.AssertTrue;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation
        .Validated;

@ConfigurationProperties(
        prefix = "app.web.cors"
)
@Validated
public class WebCorsProperties {

    private boolean enabled;

    private List<String> allowedOrigins =
            new ArrayList<>();

    private List<String> allowedMethods =
            new ArrayList<>();

    private List<String> allowedHeaders =
            new ArrayList<>();

    private List<String> exposedHeaders =
            new ArrayList<>();

    private boolean allowCredentials;

    private Duration maxAge =
            Duration.ofHours(1);

    @AssertTrue(
            message = """
                    CORS enabled requires explicit origins,
                    and credentials cannot use wildcard
                    """
    )
    public boolean isPolicyValid() {
        if (!enabled) {
            return true;
        }

        if (allowedOrigins.isEmpty()) {
            return false;
        }

        return !allowCredentials
                || !allowedOrigins.contains("*");
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(
            boolean enabled
    ) {
        this.enabled = enabled;
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(
            List<String> allowedOrigins
    ) {
        this.allowedOrigins =
                new ArrayList<>(
                        allowedOrigins
                );
    }

    public List<String> getAllowedMethods() {
        return allowedMethods;
    }

    public void setAllowedMethods(
            List<String> allowedMethods
    ) {
        this.allowedMethods =
                new ArrayList<>(
                        allowedMethods
                );
    }

    public List<String> getAllowedHeaders() {
        return allowedHeaders;
    }

    public void setAllowedHeaders(
            List<String> allowedHeaders
    ) {
        this.allowedHeaders =
                new ArrayList<>(
                        allowedHeaders
                );
    }

    public List<String> getExposedHeaders() {
        return exposedHeaders;
    }

    public void setExposedHeaders(
            List<String> exposedHeaders
    ) {
        this.exposedHeaders =
                new ArrayList<>(
                        exposedHeaders
                );
    }

    public boolean isAllowCredentials() {
        return allowCredentials;
    }

    public void setAllowCredentials(
            boolean allowCredentials
    ) {
        this.allowCredentials =
                allowCredentials;
    }

    public Duration getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(
            Duration maxAge
    ) {
        this.maxAge = maxAge;
    }
}
```

A validação impede:

```text
enabled sem origin;

credentials com wildcard.
```

---

### 2. Criar WebCorsConfiguration

Arquivo:

```text
src/main/java/br/com/formacao/backend/configuration/web/WebCorsConfiguration.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration.web;

import org.springframework.boot.context.properties
        .EnableConfigurationProperties;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.web.servlet.config.annotation
        .CorsRegistry;
import org.springframework.web.servlet.config.annotation
        .WebMvcConfigurer;

@Configuration(
        proxyBeanMethods = false
)
@EnableConfigurationProperties(
        WebCorsProperties.class
)
public class WebCorsConfiguration
        implements WebMvcConfigurer {

    private final WebCorsProperties properties;

    public WebCorsConfiguration(
            WebCorsProperties properties
    ) {
        this.properties = properties;
    }

    @Override
    public void addCorsMappings(
            CorsRegistry registry
    ) {
        if (!properties.isEnabled()) {
            return;
        }

        registry
                .addMapping(
                        "/api/**"
                )
                .allowedOrigins(
                        properties
                                .getAllowedOrigins()
                                .toArray(
                                        String[]::new
                                )
                )
                .allowedMethods(
                        properties
                                .getAllowedMethods()
                                .toArray(
                                        String[]::new
                                )
                )
                .allowedHeaders(
                        properties
                                .getAllowedHeaders()
                                .toArray(
                                        String[]::new
                                )
                )
                .exposedHeaders(
                        properties
                                .getExposedHeaders()
                                .toArray(
                                        String[]::new
                                )
                )
                .allowCredentials(
                        properties
                                .isAllowCredentials()
                )
                .maxAge(
                        properties
                                .getMaxAge()
                                .toSeconds()
                );
    }
}
```

O mapping não inclui:

```text
/actuator/**;

/swagger-ui/**;

/v3/api-docs.
```

Esses recursos não precisam ser chamados pelo frontend do laboratório.

---

### 3. Configurar o default desativado

No `application.yaml`:

```yaml
app:
  web:
    cors:
      enabled: false
      allowed-origins: []
      allowed-methods:
        - GET
        - POST
        - PUT
        - PATCH
        - DELETE
        - OPTIONS
      allowed-headers:
        - Content-Type
        - If-Match
        - X-Correlation-Id
        - X-Client-Id
      exposed-headers:
        - ETag
        - Location
        - X-Correlation-Id
        - Retry-After
      allow-credentials: false
      max-age: 1h
```

A política default não libera nenhuma origin.

---

### 4. Ativar no profile local

No `application-local.yaml`:

```yaml
app:
  web:
    cors:
      enabled: true
      allowed-origins:
        - http://localhost:5173
```

O profile local herda methods, headers e max-age do arquivo base.

Não adicione:

```text
http://127.0.0.1:5173
```

a menos que esse frontend seja realmente utilizado.

---

### 5. Criar o teste da configuração

Arquivo:

```text
WebCorsConfigurationTest.java
```

Use um controller de teste:

```java
package br.com.formacao.backend.configuration.web;

import static org.springframework.test.web.servlet
        .request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet
        .request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation
        .Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet
        .WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context
        .TestPropertySource;
import org.springframework.test.web.servlet
        .MockMvc;
import org.springframework.web.bind.annotation
        .GetMapping;
import org.springframework.web.bind.annotation
        .RestController;

@WebMvcTest
@Import({
        WebCorsConfiguration.class,
        WebCorsConfigurationTest
                .CorsProbeController.class
})
@TestPropertySource(
        properties = {
                "app.web.cors.enabled=true",
                """
                app.web.cors.allowed-origins=\
                http://localhost:5173
                """,
                """
                app.web.cors.allowed-methods=\
                GET,POST,PUT,PATCH,DELETE,OPTIONS
                """,
                """
                app.web.cors.allowed-headers=\
                Content-Type,If-Match,\
                X-Correlation-Id,X-Client-Id
                """,
                """
                app.web.cors.exposed-headers=\
                ETag,Location,\
                X-Correlation-Id,Retry-After
                """,
                "app.web.cors.allow-credentials=false",
                "app.web.cors.max-age=1h"
        }
)
class WebCorsConfigurationTest {

    private static final String ALLOWED_ORIGIN =
            "http://localhost:5173";

    @Autowired
    private MockMvc mockMvc;

    @RestController
    static class CorsProbeController {

        @GetMapping(
                "/api/cors-probe"
        )
        ResponseEntity<Void> probe() {
            return ResponseEntity
                    .ok()
                    .eTag("\"7\"")
                    .header(
                            "X-Correlation-Id",
                            "cors-test"
                    )
                    .build();
        }
    }

    @Test
    void shouldAllowConfiguredPreflight()
            throws Exception {

        mockMvc.perform(
                options(
                        "/api/cors-probe"
                )
                .header(
                        HttpHeaders.ORIGIN,
                        ALLOWED_ORIGIN
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
                        ALLOWED_ORIGIN
                )
        )
        .andExpect(
                header().string(
                        HttpHeaders
                                .ACCESS_CONTROL_ALLOW_METHODS,
                        Matchers.containsString(
                                "POST"
                        )
                )
        )
        .andExpect(
                header().string(
                        HttpHeaders
                                .ACCESS_CONTROL_MAX_AGE,
                        "3600"
                )
        );
    }
}
```

---

### 6. Testar origin rejeitada

Adicione:

```java
@Test
void shouldRejectUnknownOrigin()
        throws Exception {

    mockMvc.perform(
            options(
                    "/api/cors-probe"
            )
            .header(
                    HttpHeaders.ORIGIN,
                    "https://evil.example"
            )
            .header(
                    HttpHeaders
                            .ACCESS_CONTROL_REQUEST_METHOD,
                    "GET"
            )
    )
    .andExpect(
            status().isForbidden()
    )
    .andExpect(
            header().doesNotExist(
                    HttpHeaders
                            .ACCESS_CONTROL_ALLOW_ORIGIN
            )
    );
}
```

A request é rejeitada pelo processamento CORS antes do controller.

---

### 7. Testar response real

Adicione:

```java
@Test
void shouldExposeRequiredResponseHeaders()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/cors-probe"
            )
            .header(
                    HttpHeaders.ORIGIN,
                    ALLOWED_ORIGIN
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            header().string(
                    HttpHeaders
                            .ACCESS_CONTROL_ALLOW_ORIGIN,
                    ALLOWED_ORIGIN
            )
    )
    .andExpect(
            header().string(
                    HttpHeaders
                            .ACCESS_CONTROL_EXPOSE_HEADERS,
                    Matchers.allOf(
                            Matchers.containsString(
                                    "ETag"
                            ),
                            Matchers.containsString(
                                    "Location"
                            ),
                            Matchers.containsString(
                                    "X-Correlation-Id"
                            ),
                            Matchers.containsString(
                                    "Retry-After"
                            )
                    )
            )
    )
    .andExpect(
            header().string(
                    HttpHeaders.VARY,
                    Matchers.containsString(
                            "Origin"
                    )
            )
    )
    .andExpect(
            header().string(
                    HttpHeaders.ETAG,
                    "\"7\""
            )
    );
}
```

---

### 8. Testar request sem Origin

```java
@Test
void shouldNotAddCorsHeadersWithoutOrigin()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/cors-probe"
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            header().doesNotExist(
                    HttpHeaders
                            .ACCESS_CONTROL_ALLOW_ORIGIN
            )
    );
}
```

Uma request same-origin ou server-to-server pode não conter `Origin`.

---

### 9. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=WebCorsConfigurationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 10. Criar o laboratório browser

Arquivo:

```text
tools/cors-lab/index.html
```

Conteúdo:

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Laboratório CORS</title>
</head>
<body>
  <h1>Laboratório CORS</h1>

  <button id="list">
    Listar OS
  </button>

  <button id="create">
    Criar OS
  </button>

  <pre id="output"></pre>

  <script>
    const api =
      "http://localhost:8081";

    const output =
      document.querySelector(
        "#output"
      );

    function show(value) {
      output.textContent =
        JSON.stringify(
          value,
          null,
          2
        );
    }

    document
      .querySelector("#list")
      .addEventListener(
        "click",
        async () => {
          try {
            const response =
              await fetch(
                api
                + "/api/v2/service-orders"
                + "?page=0"
                + "&size=5"
                + "&sort=createdAt"
                + "&direction=desc",
                {
                  credentials: "omit"
                }
              );

            const body =
              await response.json();

            show({
              status: response.status,
              correlationId:
                response.headers.get(
                  "X-Correlation-Id"
                ),
              body
            });
          }
          catch (error) {
            show({
              error: error.message
            });
          }
        }
      );

    document
      .querySelector("#create")
      .addEventListener(
        "click",
        async () => {
          const scheduledFor =
            new Date(
              Date.now()
              + 24 * 60 * 60 * 1000
            ).toISOString();

          try {
            const response =
              await fetch(
                api
                + "/api/v2/service-orders",
                {
                  method: "POST",
                  credentials: "omit",
                  headers: {
                    "Content-Type":
                      "application/json",
                    "X-Client-Id":
                      "cors-browser-lab"
                  },
                  body: JSON.stringify({
                    customerName:
                      "Cliente CORS",
                    serviceType:
                      "Vistoria",
                    description:
                      "Criado pelo navegador",
                    serviceAddress:
                      "Rua CORS, 100",
                    scheduledFor
                  })
                }
              );

            const body =
              await response.json();

            show({
              status: response.status,
              location:
                response.headers.get(
                  "Location"
                ),
              etag:
                response.headers.get(
                  "ETag"
                ),
              correlationId:
                response.headers.get(
                  "X-Correlation-Id"
                ),
              body
            });
          }
          catch (error) {
            show({
              error: error.message
            });
          }
        }
      );
  </script>
</body>
</html>
```

O `POST` provoca preflight porque usa:

- `application/json`;
- `X-Client-Id`.

---

### 11. Servir o laboratório

Na raiz do projeto:

```powershell
npx --yes http-server `
  "tools/cors-lab" `
  -p 5173 `
  -c-1
```

Abra:

```text
http://localhost:5173
```

Não abra o HTML diretamente por `file://`.

Isso produziria outra origin, possivelmente `null`.

---

### 12. Iniciar a API com profile local

Confirme que o Compose ativa o profile local esperado.

Suba:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Acompanhe:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow `
  "api"
```

---

### 13. Testar listagem no browser

Clique:

```text
Listar OS.
```

No DevTools, abra:

```text
Network.
```

Confirme:

- request GET;
- header Origin;
- response `Access-Control-Allow-Origin`;
- JavaScript recebeu body;
- `X-Correlation-Id` ficou legível.

---

### 14. Testar criação no browser

Clique:

```text
Criar OS.
```

Confirme duas requests:

```text
OPTIONS;

POST.
```

No `OPTIONS`, observe:

- `Origin`;
- `Access-Control-Request-Method`;
- `Access-Control-Request-Headers`;
- `Access-Control-Allow-Origin`;
- `Access-Control-Allow-Methods`;
- `Access-Control-Allow-Headers`;
- `Access-Control-Max-Age`.

No `POST`, confirme:

- 201;
- `Location`;
- `ETag`;
- `X-Correlation-Id`;
- body.

O JavaScript precisa conseguir ler os três headers expostos.

---

### 15. Testar origin não autorizada

Inicie outra instância do servidor estático:

```powershell
npx --yes http-server `
  "tools/cors-lab" `
  -p 5174 `
  -c-1
```

Abra:

```text
http://localhost:5174
```

Essa origin não está na allowlist.

Clique nos botões.

Resultado esperado:

```text
erro CORS no browser.
```

No DevTools, confirme que a origin enviada é:

```text
http://localhost:5174.
```

Não adicione 5174 à allowlist apenas para esconder o teste.

---

### 16. Testar manualmente o preflight

PowerShell:

```powershell
$preflight = Invoke-WebRequest `
  -Method Options `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -Headers @{
    "Origin" =
      "http://localhost:5173"

    "Access-Control-Request-Method" =
      "POST"

    "Access-Control-Request-Headers" =
      "content-type,x-client-id"
  }

$preflight.StatusCode
$preflight.Headers
```

Esse comando inspeciona headers.

Ele não reproduz o bloqueio do navegador.

---

### 17. Testar preflight rejeitado

```powershell
Invoke-WebRequest `
  -Method Options `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -Headers @{
    "Origin" =
      "https://evil.example"

    "Access-Control-Request-Method" =
      "POST"

    "Access-Control-Request-Headers" =
      "content-type,x-client-id"
  } `
  -SkipHttpErrorCheck
```

Resultado esperado:

```text
403;

sem Access-Control-Allow-Origin.
```

---

### 18. Atualizar a baseline de segurança

Em:

```text
docs/security/M15_SECURITY_BASELINE.md
```

Adicione:

```markdown
## CORS

- Status: PRESENTE NO PROFILE LOCAL
- Mapping: `/api/**`
- Allowed origin: `http://localhost:5173`
- Credentials: desativadas
- Strategy: allowlist explicita
- Management: fora do mapping
- Evidencia: `WebCorsConfigurationTest`
- Limitacao: CORS nao autentica nem autoriza
```

---

### 19. Atualizar threat model e OWASP review

No threat model, associe:

```text
configuração CORS permissiva
a TB1.
```

No OWASP review:

```text
A01:
CORS não substitui authorization.

A02:
policy explícita reduz misconfiguration.
```

Não marque A01 como resolvida.

---

### 20. Encerrar os processos

Pare os servidores estáticos com:

```text
Ctrl + C.
```

Depois:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Preserve volumes.

---

## Entendendo o que foi feito

### A origin foi definida com precisão

Scheme, host e port foram tratados como parte do contrato.

### A política ficou centralizada

Controllers não receberam configurações divergentes.

### O default permaneceu fechado

CORS só é ativado no profile local.

### O preflight foi testado

Origin, método e headers foram validados antes da request real.

### Headers de response foram expostos

O frontend consegue ler ETag e Location.

### Credentials ficaram desativadas

A política não antecipou sessão ou login.

### Browser e clientes técnicos foram diferenciados

Postman não foi usado como prova suficiente.

### CORS permaneceu no papel correto

Ele não foi chamado de autenticação, autorização ou CSRF protection.

---

## Erros comuns importantes

### Usar `*` por conveniência

Uma API de negócio deve conhecer seus frontends.

### Refletir qualquer Origin

Isso cria permissão ampla disfarçada.

### Combinar wildcard e credentials

O browser rejeita essa combinação.

### Liberar todos os headers

A política deixa de documentar a necessidade real.

### Esquecer exposed headers

O request funciona, mas o frontend não lê ETag ou Location.

### Testar somente com Postman

O bloqueio CORS pertence ao navegador.

### Usar `mode: no-cors`

A response vira opaque.

### Configurar apenas OPTIONS

A response real também precisa de CORS.

### Liberar Actuator para o frontend

Management não pertence ao caso de uso.

### Tratar CORS como CSRF

As ameaças são diferentes.

---

## Comandos úteis

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=WebCorsConfigurationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Servir frontend

```powershell
npx --yes http-server `
  "tools/cors-lab" `
  -p 5173 `
  -c-1
```

### Preflight permitido

```powershell
Invoke-WebRequest `
  -Method Options `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -Headers @{
    Origin =
      "http://localhost:5173"

    "Access-Control-Request-Method" =
      "POST"
  }
```

### Ver logs

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api
```

---

## Exercício guiado

### Parte 1 — Origin

Compare scheme, host, port e path.

### Parte 2 — SOP

Explique por que o navegador bloqueia leitura cross-origin.

### Parte 3 — Preflight

Monte manualmente uma request OPTIONS.

### Parte 4 — Headers

Diferencie allow e expose headers.

### Parte 5 — Spring

Crie properties e configuração global.

### Parte 6 — Testes

Teste origin permitida e rejeitada.

### Parte 7 — Browser

Execute GET e POST no laboratório.

### Parte 8 — Credentials

Explique por que permanecem desativadas.

### Parte 9 — Segurança

Diferencie CORS, autenticação, autorização e CSRF.

### Parte 10 — Evidência

Atualize baseline, threat model e OWASP review.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 413 foi preservada;
- CORS foi definido;
- same-origin policy foi explicada;
- origin foi decomposta em scheme, host e port;
- path foi excluído da origin;
- localhost e 127.0.0.1 foram diferenciados;
- portas diferentes foram tratadas como origins diferentes;
- HTTP e HTTPS foram tratados como origins diferentes;
- cross-origin foi diferenciado de cross-site;
- CORS foi tratado como protocolo de browser;
- CORS não foi chamado de autenticação;
- CORS não foi chamado de autorização;
- CORS não foi chamado de firewall;
- clients server-to-server foram diferenciados;
- request processada e response bloqueada foram explicadas;
- request safelisted foi explicada;
- methods safelisted foram listados;
- content types safelisted foram listados;
- application/json foi associado a preflight;
- custom header foi associado a preflight;
- OPTIONS foi explicado;
- Origin foi explicado;
- Access-Control-Request-Method foi explicado;
- Access-Control-Request-Headers foi explicado;
- Access-Control-Allow-Origin foi explicado;
- Access-Control-Allow-Methods foi explicado;
- Access-Control-Allow-Headers foi explicado;
- Access-Control-Expose-Headers foi explicado;
- Access-Control-Max-Age foi explicado;
- Access-Control-Allow-Credentials foi explicado;
- Vary Origin foi explicado;
- response real recebeu CORS;
- wildcard não foi usado;
- origin null não foi permitida;
- credentials foram desativadas;
- wildcard com credentials foi rejeitado;
- no-cors foi rejeitado como solução;
- allowedOriginPatterns não foi usado;
- configuração central foi escolhida;
- @CrossOrigin espalhado foi evitado;
- WebCorsProperties foi criada;
- configuração tipada foi validada;
- enabled default é false;
- allowlist vazia com enabled foi rejeitada;
- wildcard com credentials foi rejeitado pela validation;
- WebCorsConfiguration foi criada;
- mapping foi limitado a `/api/**`;
- Actuator não foi incluído;
- Swagger não foi incluído;
- methods foram explícitos;
- request headers foram explícitos;
- ETag foi exposto;
- Location foi exposto;
- X-Correlation-Id foi exposto;
- Retry-After foi exposto;
- max-age foi configurado;
- profile local foi configurado;
- origin 5173 foi permitida;
- origin 5174 não foi permitida;
- WebCorsConfigurationTest foi criado;
- preflight permitido foi testado;
- preflight rejeitado foi testado;
- response real foi testada;
- request sem Origin foi testada;
- Vary foi testado;
- gate completo foi executado;
- laboratório HTML foi criado;
- fetch GET foi criado;
- fetch POST foi criado;
- credentials omit foi usado;
- application/json foi usado;
- X-Client-Id foi usado;
- ETag foi lido pelo JavaScript;
- Location foi lido pelo JavaScript;
- correlation ID foi lido pelo JavaScript;
- frontend foi servido por HTTP;
- file origin não foi usada;
- DevTools foi utilizado;
- OPTIONS foi observado;
- POST foi observado;
- origin rejeitada foi observada no browser;
- preflight manual foi executado;
- limitação do teste manual foi registrada;
- baseline foi atualizada;
- threat model foi atualizado;
- OWASP review foi atualizado;
- A01 não foi marcada como resolvida;
- CSRF não foi aprofundado;
- security headers não foram antecipados;
- Spring Security não foi instalado;
- sessão não foi implementada;
- JWT não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 415 está correta.

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
git commit -m "feat(m15): configurar CORS com allowlist explicita"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- tokens;
- env files;
- dados pessoais;
- node_modules;
- logs;
- responses;
- origins de produção não aprovadas;
- certificados;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou o comportamento cross-origin do navegador.

A análise passou por:

```text
SOP;

origin;

request safelisted;

preflight;

credentials;

allowlist;

headers;

cache;

Spring MVC;

browser.
```

A política implementada ficou:

```text
default:
desativada.

profile local:
ativada.

origin:
http://localhost:5173.

mapping:
/api/**.

credentials:
false.
```

A decisão central foi:

```text
CORS controla
se o JavaScript de uma origin
pode acessar uma response;

ele não decide
quem é o usuário
nem se ele pode acessar o recurso.
```

A aplicação continua sem autenticação e autorização.

CORS não mudou essa condição.

A próxima aula será:

```text
415 - M15.05 - CSRF quando importa em APIs
```

Nela, você analisará:

- browser ambient authority;
- cookies;
- sessão;
- requests automáticas;
- simple forms;
- SameSite;
- CSRF token;
- double submit;
- API stateless;
- bearer token;
- quando desabilitar;
- quando manter;
- testes.

A aula não assumirá que toda API precisa do mesmo tratamento.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei origin, site e path.
- [ ] Entendi preflight e response real.
- [ ] Configurei allowlist no Spring MVC.
- [ ] Testei headers e origins no browser.
- [ ] Mantive CORS separado de auth e CSRF.

---

## Troubleshooting adicional

### O browser continua usando policy antiga

Desabilite cache no DevTools.

O preflight pode estar armazenado.

### O preflight retorna 403

Verifique:

- origin exata;
- method;
- request headers;
- profile local;
- mapping `/api/**`.

### localhost funciona e 127.0.0.1 não

São origins diferentes.

Adicione somente a origin realmente aprovada.

### O POST cria, mas fetch lança erro

Verifique headers CORS na response real.

O servidor pode ter processado a request.

### ETag aparece no Network, mas JavaScript lê null

Adicione `ETag` em exposed headers.

### O teste de origin rejeitada retorna 200

Confirme se existe outro `@CrossOrigin`, `CorsFilter` ou configuração global.

### A aplicação falha no startup

Revise properties.

`enabled=true` exige origin explícita.

### credentials não funcionam

Elas estão desativadas de propósito.

Sessões e CSRF serão tratados depois.

---

## Perguntas de revisão

1. O que é CORS?
2. Quem aplica a SOP?
3. O que forma uma origin?
4. Path participa da origin?
5. Portas diferentes são mesma origin?
6. JSON costuma gerar preflight?
7. Qual método é usado no preflight?
8. Qual header informa a origin?
9. Qual header permite a origin?
10. Qual header permite request headers?
11. Qual header expõe response headers?
12. Para que serve max-age?
13. CORS autentica?
14. CORS autoriza?
15. Postman aplica SOP?
16. `no-cors` libera leitura?
17. Credentials estão ativas?
18. Qual origin foi permitida?
19. Management recebeu CORS?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Mecanismo de compartilhamento cross-origin por headers.
2. O navegador.
3. Scheme, host e port.
4. Não.
5. Não.
6. Sim.
7. OPTIONS.
8. Origin.
9. Access-Control-Allow-Origin.
10. Access-Control-Allow-Headers.
11. Access-Control-Expose-Headers.
12. Cachear o preflight.
13. Não.
14. Não.
15. Não.
16. Não.
17. Não.
18. `http://localhost:5173`.
19. Não.
20. CSRF quando importa em APIs.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 414 - M15.04 - CORS profundo

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Estudei Same-Origin Policy.
- Defini origin por scheme, host e port.
- Confirmei que path não participa da origin.
- Diferenciei localhost de 127.0.0.1.
- Diferenciei cross-origin de cross-site.
- Entendi CORS como protocolo aplicado pelo browser.
- Confirmei que CORS não é autenticação ou autorização.
- Diferenciei browser de Postman, Insomnia e curl.
- Estudei requests safelisted.
- Entendi por que JSON e headers customizados geram preflight.
- Estudei OPTIONS e os headers de preflight.
- Estudei Access-Control-Allow-Origin.
- Estudei allow methods e allow headers.
- Estudei exposed headers.
- Estudei max-age e cache de preflight.
- Estudei credentials e a proibição de wildcard.
- Rejeitei `mode: no-cors` como solução.
- Criei `WebCorsProperties`.
- Validei allowlist explícita.
- Criei `WebCorsConfiguration`.
- Limitei CORS a `/api/**`.
- Mantive management fora da policy.
- Mantive CORS desativado por default.
- Ativei a origin `http://localhost:5173` no profile local.
- Mantive credentials desativadas.
- Expus ETag, Location, X-Correlation-Id e Retry-After.
- Criei testes de preflight permitido e rejeitado.
- Testei response real e Vary Origin.
- Criei `tools/cors-lab/index.html`.
- Executei GET e POST pelo navegador.
- Observei OPTIONS no DevTools.
- Confirmei leitura de ETag e Location.
- Testei uma origin não permitida.
- Atualizei baseline, threat model e OWASP review.
- Não antecipei CSRF, security headers ou Spring Security.
- Próxima aula: CSRF quando importa em APIs.
```

---

## Referência técnica curta

- [Spring Framework — CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
- [Fetch Standard — CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)
- [MDN — Cross-Origin Resource Sharing](https://developer.mozilla.org/docs/Web/HTTP/Guides/CORS)
- [OWASP REST Security Cheat Sheet — CORS](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#cors)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

Regra final:

```text
uma política CORS segura precisa conhecer exatamente as origins de frontend, limitar methods e headers, expor somente os response headers necessários e manter credentials desativadas enquanto não houver um caso de autenticação; nesta baseline, Spring MVC aplica allowlist em /api/**, o profile local permite apenas localhost:5173, preflight e responses reais são testados e CORS permanece separado de autenticação, autorização e proteção contra CSRF.
```
