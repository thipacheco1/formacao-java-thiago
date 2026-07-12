# 416 - M15.06 - Security headers

## Apresentação da aula

Na aula 415, você aprofundou CSRF.

A decisão deixou de ser baseada no rótulo:

```text
REST API.
```

Ela passou a considerar:

```text
qual credencial autentica;

quem anexa a credencial;

se o navegador envia automaticamente;

se a operação altera estado;

qual prova de intenção existe.
```

O laboratório demonstrou:

```text
cookie automático
mais operação mutável
sem token
permite falsificação;

cookie automático
mais token vinculado à sessão
rejeita a request forjada.
```

Aquela aula respondeu:

```text
quando CSRF importa
em uma API?
```

Agora o foco será a resposta HTTP enviada ao navegador.

A pergunta central será:

```text
quais instruções de segurança
o servidor deve enviar
para reduzir interpretações perigosas,
vazamento de contexto
e uso indevido do conteúdo?
```

Essas instruções são conhecidas como:

```text
security headers.
```

Security headers ajudam o navegador a aplicar políticas sobre:

- carregamento de recursos;
- execução de scripts;
- framing;
- MIME sniffing;
- envio de Referer;
- uso de recursos do dispositivo;
- transporte HTTPS;
- armazenamento em cache.

Eles funcionam como defesa em profundidade.

Eles não substituem:

- autenticação;
- autorização;
- validation;
- encoding;
- TLS;
- correção de XSS;
- proteção CSRF;
- gestão de secrets;
- patching;
- testes.

Um header não transforma uma aplicação vulnerável em segura.

Exemplo:

```text
Content-Security-Policy
pode reduzir impacto de XSS;

ela não autoriza acesso
a uma Ordem de Serviço.
```

Outro exemplo:

```text
X-Frame-Options
reduz framing;

ele não impede
um usuário autenticado
de chamar um endpoint proibido.
```

Nesta aula, a aplicação ainda não possui Spring Security.

A política será implementada com um filtro Servlet próprio e pequeno.

Mais adiante, quando a arquitetura do Spring Security for introduzida, a política será migrada para a configuração oficial da security filter chain.

O objetivo não é criar um framework particular.

O objetivo é:

- compreender cada header;
- aplicar uma baseline explícita;
- validar compatibilidade;
- criar testes;
- registrar limites;
- preparar a migração futura.

A política desta aula será aplicada somente em:

```text
/api/**.
```

Isso inclui:

- API de Ordem de Serviço;
- managed messages;
- upload;
- download;
- notificações;
- responses de erro da API.

Ela não será aplicada automaticamente em:

- `/swagger-ui/**`;
- `/v3/api-docs`;
- `/actuator/**`;
- `/livez`;
- `/readyz`;
- `/labs/**`.

A exclusão é intencional.

Swagger UI precisa de uma CSP HTML própria. A policy estrita da API JSON poderia quebrar seus recursos. Actuator e laboratórios permanecem em escopos separados.

A baseline de `/api/**` enviará:

```text
X-Content-Type-Options:
nosniff.

X-Frame-Options:
DENY.

Content-Security-Policy:
default-src 'none';
base-uri 'none';
form-action 'none';
frame-ancestors 'none';
object-src 'none'.

Referrer-Policy:
no-referrer.

Permissions-Policy:
camera=(),
microphone=(),
geolocation=(),
payment=(),
usb=().

X-XSS-Protection:
0.

Cache-Control:
no-store.
```

Em HTTPS, quando explicitamente habilitado:

```text
Strict-Transport-Security:
max-age=31536000.
```

No laboratório HTTP:

```text
HSTS:
ausente.
```

Essa decisão evita ensinar um header de HTTPS como decoração em uma response HTTP.

`includeSubDomains` e `preload` permanecerão desativados.

Eles afetam todo o domínio e podem causar indisponibilidade quando habilitados sem inventário, certificados e processo operacional adequados.

A aula criará:

```text
SecurityHeadersProperties;

SecurityHeadersConfiguration;

SecurityHeadersFilter;

SecurityHeadersConfigurationTest;

SecurityHeadersLabController;

docs/security/M15_SECURITY_HEADERS.md.
```

O laboratório terá um documento HTML servido dentro de `/api/**`.

A CSP estrita bloqueará um script inline.

O objetivo é observar no navegador:

```text
o HTML chegou;

o script não executou;

o console registrou a violação.
```

A próxima aula oficial será:

```text
417 - M15.07 - Hash de senha BCrypt Argon2 conceitual
```

Por isso, armazenamento de senhas será apenas citado como próximo passo.

Nenhum usuário, login ou hash será implementado agora.

---

## Onde estamos na formação

A sequência atual é:

```text
414:
CORS profundo.

415:
CSRF quando importa em APIs.

416:
Security headers.

417:
Hash de senha BCrypt Argon2 conceitual.

418:
Spring Security arquitetura geral.

419:
SecurityFilterChain na pratica.
```

A aula 415 respondeu:

```text
quando uma credencial automática
torna CSRF relevante?
```

A aula 416 responderá:

```text
como instruir o navegador
a interpretar responses
com políticas mais seguras?
```

Nesta aula:

```text
CSP:
sim.

X-Content-Type-Options:
sim.

X-Frame-Options:
sim.

frame-ancestors:
sim.

Referrer-Policy:
sim.

Permissions-Policy:
sim.

HSTS:
sim, condicionado a HTTPS.

Cache-Control:
sim.

X-XSS-Protection:
sim, valor zero.

Clear-Site-Data:
conceito.

COOP, COEP e CORP:
conceito e decisão.

Spring Security:
não.

password hashing:
não.

autenticação:
não.
```

A regra central será:

```text
security headers
precisam refletir
o conteúdo,
o ambiente
e a arquitetura;

copiar uma lista universal
pode quebrar a aplicação
ou criar falsa segurança.
```

---

## Objetivo prático

Ao final da aula, a aplicação terá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── web
        ├── SecurityHeadersProperties.java
        ├── SecurityHeadersConfiguration.java
        └── SecurityHeadersFilter.java
```

Laboratório:

```text
src/main/java/br/com/formacao/backend
└── security
    └── lab
        └── SecurityHeadersLabController.java
```

Teste:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── web
        └── SecurityHeadersConfigurationTest.java
```

Documentação:

```text
docs/security/M15_SECURITY_HEADERS.md
```

Configuração:

```text
app.web.security-headers.enabled:
true.

mapping:
somente /api/**.

HSTS:
desativado no local.
```

Você irá:

1. definir security headers;
2. diferenciar prevenção e mitigação;
3. estudar CSP;
4. estudar framing;
5. estudar MIME sniffing;
6. estudar Referrer-Policy;
7. estudar Permissions-Policy;
8. estudar HSTS;
9. estudar cache;
10. avaliar headers legados;
11. criar properties;
12. criar filtro;
13. limitar paths;
14. configurar headers;
15. condicionar HSTS a HTTPS;
16. criar testes;
17. criar laboratório CSP;
18. inspecionar responses;
19. atualizar documentos;
20. commitar.

---

## Conceito essencial

### Header é política, não correção automática

Um security header comunica uma regra ao user agent.

Exemplo:

```http
X-Content-Type-Options: nosniff
```

A regra informa:

```text
respeite o Content-Type declarado;
não tente adivinhar outro tipo.
```

Isso não corrige um servidor que declara:

```text
image/png
```

para um arquivo HTML.

A aplicação ainda precisa produzir metadata correta.

---

### Browser e clientes técnicos

Muitos security headers são interpretados por browsers.

Postman, curl e integrações backend podem:

- exibir;
- ignorar;
- não aplicar a mesma política.

A presença do header pode ser validada com qualquer cliente HTTP.

O efeito real de CSP, framing e Permissions-Policy precisa ser observado em navegador compatível.

---

### Content-Security-Policy

`Content-Security-Policy`, ou CSP, controla quais recursos um documento pode carregar e executar.

Diretivas comuns:

```text
default-src;

script-src;

style-src;

img-src;

connect-src;

font-src;

object-src;

base-uri;

form-action;

frame-ancestors.
```

A baseline da API será:

```text
default-src 'none';
base-uri 'none';
form-action 'none';
frame-ancestors 'none';
object-src 'none'
```

Significados:

`default-src 'none'`

```text
nega por default
fontes de recursos
não definidas.
```

`base-uri 'none'`

```text
impede uso de elemento base
para alterar resolução de URLs.
```

`form-action 'none'`

```text
impede submissão de forms
pelo documento.
```

`frame-ancestors 'none'`

```text
impede que o documento
seja embutido em frames.
```

`object-src 'none'`

```text
nega plugins e objetos embutidos.
```

Em JSON, CSP possui efeito limitado, mas restringe a response quando interpretada como documento. Páginas HTML, como Swagger UI, exigem política própria.

---

### CSP não corrige XSS

Uma CSP forte pode bloquear:

- script inline;
- script de origin não autorizada;
- object;
- form;
- framing.

Ela não elimina a necessidade de:

- output encoding;
- templates seguros;
- sanitização contextual;
- evitar `innerHTML`;
- corrigir injection;
- proteger dependencies.

CSP é defesa em profundidade.

---

### unsafe-inline e unsafe-eval

Diretivas como:

```text
'unsafe-inline';

'unsafe-eval'.
```

reduzem a proteção da CSP.

Não as adicione apenas para fazer uma interface funcionar.

Uma aplicação HTML profissional pode utilizar:

- nonces;
- hashes;
- bundles externos autorizados;
- migração gradual por Report-Only.

O Swagger UI será tratado separadamente.

---

### Content-Security-Policy-Report-Only

Header:

```http
Content-Security-Policy-Report-Only
```

permite observar violações sem bloquear.

Ele é útil durante implantação de CSP em interfaces existentes.

Fluxo recomendado:

1. inventariar recursos;
2. criar policy;
3. ativar report-only;
4. observar violações;
5. corrigir dependências;
6. aplicar enforcement;
7. monitorar regressões.

Nesta API JSON nova, a policy estrita pode ser aplicada diretamente em `/api/**`.

Não será criado endpoint de reports nesta aula.

---

### Proteção contra framing

Framing permite embutir um documento em:

- `frame`;
- `iframe`;
- `object`;
- `embed`.

Um atacante pode sobrepor elementos e induzir cliques.

Isso é conhecido como:

```text
clickjacking.
```

Controles:

```http
Content-Security-Policy:
frame-ancestors 'none'

X-Frame-Options:
DENY
```

`frame-ancestors` é o controle moderno e flexível.

`X-Frame-Options` é mantido como compatibilidade.

A baseline nega qualquer framing.

---

### X-Content-Type-Options

Header:

```http
X-Content-Type-Options: nosniff
```

Instrui o browser a respeitar o MIME type declarado.

Ele reduz riscos de MIME confusion.

O servidor ainda precisa declarar corretamente JSON, Problem Details, arquivos e `Content-Disposition`. O header passa a ser uma policy consistente da API.

---

### Referrer-Policy

O browser pode enviar:

```http
Referer
```

quando navega ou busca recursos.

O valor pode revelar:

- URL;
- path;
- parâmetros;
- estrutura interna.

Baseline:

```http
Referrer-Policy: no-referrer
```

Isso impede o envio de Referer a partir do documento.

Em JSON, o impacto é menor; em páginas com links e recursos, é relevante. A baseline escolhe `no-referrer` por ser restritiva e compatível com a API.

---

### Permissions-Policy

`Permissions-Policy` restringe recursos do browser.

Exemplos:

- câmera;
- microfone;
- geolocalização;
- pagamento;
- USB;
- fullscreen;
- sensores.

Baseline:

```http
Permissions-Policy:
camera=(),
microphone=(),
geolocation=(),
payment=(),
usb=()
```

A API não precisa dessas capacidades.

Negá-las reduz possibilidades caso uma response seja interpretada como documento.

A policy precisa ser revisada para aplicações web que realmente utilizem alguma feature.

Não use o header antigo:

```text
Feature-Policy.
```

---

### Strict-Transport-Security

HSTS usa o header:

```http
Strict-Transport-Security
```

Ele informa ao browser que um host deve ser acessado somente por HTTPS em conexões futuras.

Exemplo:

```http
Strict-Transport-Security:
max-age=31536000
```

O header só deve ser processado quando recebido por HTTPS.

Enviar HSTS na response HTTP local não cria HTTPS.

Também não protege a primeira conexão de um host que nunca recebeu a policy, exceto em cenários de preload.

Nesta aula:

```text
local HTTP:
sem HSTS.

request HTTPS:
HSTS quando habilitado.
```

---

### includeSubDomains

Diretiva:

```text
includeSubDomains.
```

Estende HSTS a subdomínios.

Antes de habilitar, inventarie:

- todos os subdomínios;
- certificados;
- serviços antigos;
- redirects;
- ambientes externos.

Um subdomínio sem HTTPS pode se tornar inacessível.

A baseline mantém:

```text
false.
```

---

### preload

`preload` solicita inclusão em listas distribuídas por browsers, quando os requisitos do ecossistema são atendidos.

É uma decisão de domínio inteiro.

Ela é difícil de reverter rapidamente.

A baseline mantém:

```text
false.
```

Não copie `preload` de uma recomendação genérica.

---

### TLS atrás de proxy

Em produção, TLS pode terminar em:

- load balancer;
- ingress;
- reverse proxy;
- API gateway.

A aplicação pode receber HTTP internamente.

Nesse caso, `request.isSecure()` depende da configuração correta de forwarded headers e da confiança no proxy.

Não aceite `X-Forwarded-Proto` de qualquer cliente público.

A topologia de produção precisa definir:

- proxy confiável;
- forwarded headers;
- redirect;
- HSTS no ponto correto;
- testes externos.

---

### Cache-Control

Responses com dados de negócio podem permanecer em caches do browser ou intermediários.

Baseline:

```http
Cache-Control: no-store
```

`no-store` instrui caches a não armazenar a response.

Isso é apropriado para a API OS nesta etapa.

Não significa que toda API precisa de `no-store`.

Recursos públicos e imutáveis podem usar caching seguro e eficiente.

`ETag` continua sendo utilizado para concorrência otimista.

Nesta aplicação:

```text
ETag:
precondição de versão.

Cache-Control:
política de armazenamento.
```

São responsabilidades diferentes.

---

### X-XSS-Protection

Header legado:

```http
X-XSS-Protection
```

Ativava filtros XSS em browsers antigos.

Esses filtros apresentaram comportamentos problemáticos.

A baseline enviará:

```http
X-XSS-Protection: 0
```

A proteção moderna depende de:

- encoding;
- CSP;
- código seguro;
- sanitização;
- browser atualizado.

Não envie:

```text
1; mode=block
```

como principal controle moderno.

---

### Clear-Site-Data

Header:

```http
Clear-Site-Data
```

pode solicitar limpeza de:

- cache;
- cookies;
- storage;
- execution contexts.

Ele é útil em operações como:

- logout;
- revogação;
- limpeza de conta;
- incidente.

Não deve ser enviado em toda response.

A aplicação ainda não possui login real.

O header não será implementado nesta aula.

---

### COOP, COEP e CORP

Headers de isolamento cross-origin incluem:

```text
Cross-Origin-Opener-Policy;

Cross-Origin-Embedder-Policy;

Cross-Origin-Resource-Policy.
```

Eles podem habilitar isolamento mais forte.

Também podem quebrar:

- popups;
- embeds;
- recursos;
- integrações;
- CORS;
- documentos.

Não serão aplicados automaticamente.

A decisão exige inventário de frontend e testes de compatibilidade.

---

### Server e X-Powered-By

Ocultar detalhes de tecnologia pode reduzir informação casual.

Isso não é uma defesa principal.

A segurança não pode depender de obscuridade. Revise `Server` e `X-Powered-By`, removendo detalhes desnecessários sem confundi-los com correções de vulnerabilidades reais.

---

## Mão na massa guiada

### 1. Criar SecurityHeadersProperties

Arquivo:

```text
SecurityHeadersProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration.web;

import java.time.Duration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation
        .Validated;

@ConfigurationProperties(
        prefix = "app.web.security-headers"
)
@Validated
public class SecurityHeadersProperties {

    private boolean enabled = true;

    @NotBlank
    private String contentSecurityPolicy =
            """
            default-src 'none'; \
            base-uri 'none'; \
            form-action 'none'; \
            frame-ancestors 'none'; \
            object-src 'none'
            """
            .trim();

    @NotBlank
    private String referrerPolicy =
            "no-referrer";

    @NotBlank
    private String permissionsPolicy =
            """
            camera=(), \
            microphone=(), \
            geolocation=(), \
            payment=(), \
            usb=()
            """
            .trim();

    private boolean hstsEnabled;

    @NotNull
    private Duration hstsMaxAge =
            Duration.ofDays(365);

    private boolean hstsIncludeSubDomains;

    private boolean hstsPreload;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(
            boolean enabled
    ) {
        this.enabled = enabled;
    }

    public String getContentSecurityPolicy() {
        return contentSecurityPolicy;
    }

    public void setContentSecurityPolicy(
            String value
    ) {
        this.contentSecurityPolicy = value;
    }

    public String getReferrerPolicy() {
        return referrerPolicy;
    }

    public void setReferrerPolicy(
            String value
    ) {
        this.referrerPolicy = value;
    }

    public String getPermissionsPolicy() {
        return permissionsPolicy;
    }

    public void setPermissionsPolicy(
            String value
    ) {
        this.permissionsPolicy = value;
    }

    public boolean isHstsEnabled() {
        return hstsEnabled;
    }

    public void setHstsEnabled(
            boolean value
    ) {
        this.hstsEnabled = value;
    }

    public Duration getHstsMaxAge() {
        return hstsMaxAge;
    }

    public void setHstsMaxAge(
            Duration value
    ) {
        this.hstsMaxAge = value;
    }

    public boolean isHstsIncludeSubDomains() {
        return hstsIncludeSubDomains;
    }

    public void setHstsIncludeSubDomains(
            boolean value
    ) {
        this.hstsIncludeSubDomains = value;
    }

    public boolean isHstsPreload() {
        return hstsPreload;
    }

    public void setHstsPreload(
            boolean value
    ) {
        this.hstsPreload = value;
    }
}
```

A classe permite configuração por ambiente.

---

### 2. Criar SecurityHeadersFilter

Arquivo:

```text
SecurityHeadersFilter.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter
        .OncePerRequestFilter;

public class SecurityHeadersFilter
        extends OncePerRequestFilter {

    private static final String CSP =
            "Content-Security-Policy";

    private static final String PERMISSIONS_POLICY =
            "Permissions-Policy";

    private static final String REFERRER_POLICY =
            "Referrer-Policy";

    private static final String HSTS =
            "Strict-Transport-Security";

    private static final String X_FRAME_OPTIONS =
            "X-Frame-Options";

    private static final String X_CONTENT_TYPE_OPTIONS =
            "X-Content-Type-Options";

    private static final String X_XSS_PROTECTION =
            "X-XSS-Protection";

    private final SecurityHeadersProperties properties;

    public SecurityHeadersFilter(
            SecurityHeadersProperties properties
    ) {
        this.properties = properties;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {
        String contextPath =
                request.getContextPath();

        String path =
                request
                        .getRequestURI()
                        .substring(
                                contextPath.length()
                        );

        return !path.startsWith(
                "/api/"
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        response.setHeader(
                X_CONTENT_TYPE_OPTIONS,
                "nosniff"
        );

        response.setHeader(
                X_FRAME_OPTIONS,
                "DENY"
        );

        response.setHeader(
                CSP,
                properties
                        .getContentSecurityPolicy()
        );

        response.setHeader(
                REFERRER_POLICY,
                properties
                        .getReferrerPolicy()
        );

        response.setHeader(
                PERMISSIONS_POLICY,
                properties
                        .getPermissionsPolicy()
        );

        response.setHeader(
                X_XSS_PROTECTION,
                "0"
        );

        response.setHeader(
                "Cache-Control",
                "no-store"
        );

        if (
            properties.isHstsEnabled()
            && request.isSecure()
        ) {
            response.setHeader(
                    HSTS,
                    hstsValue()
            );
        }

        filterChain.doFilter(
                request,
                response
        );
    }

    private String hstsValue() {
        List<String> directives =
                new ArrayList<>();

        directives.add(
                "max-age="
                + properties
                        .getHstsMaxAge()
                        .toSeconds()
        );

        if (
            properties
                    .isHstsIncludeSubDomains()
        ) {
            directives.add(
                    "includeSubDomains"
            );
        }

        if (properties.isHstsPreload()) {
            directives.add(
                    "preload"
            );
        }

        return String.join(
                "; ",
                directives
        );
    }
}
```

O filtro adiciona os headers antes do caso de uso.

Assim, responses de erro da API também os preservam.

---

### 3. Criar SecurityHeadersConfiguration

```java
package br.com.formacao.backend.configuration.web;

import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.boot.context.properties
        .EnableConfigurationProperties;
import org.springframework.boot.web.servlet
        .FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.core.Ordered;

@Configuration(
        proxyBeanMethods = false
)
@EnableConfigurationProperties(
        SecurityHeadersProperties.class
)
public class SecurityHeadersConfiguration {

    @Bean
    @ConditionalOnProperty(
            prefix = "app.web.security-headers",
            name = "enabled",
            havingValue = "true",
            matchIfMissing = true
    )
    FilterRegistrationBean<
            SecurityHeadersFilter
    > securityHeadersFilter(
            SecurityHeadersProperties properties
    ) {
        SecurityHeadersFilter filter =
                new SecurityHeadersFilter(
                        properties
                );

        FilterRegistrationBean<
                SecurityHeadersFilter
        > registration =
                new FilterRegistrationBean<>(
                        filter
                );

        registration.setOrder(
                Ordered.HIGHEST_PRECEDENCE + 20
        );

        registration.setName(
                "securityHeadersFilter"
        );

        return registration;
    }
}
```

Não anote o filter com `@Component`.

Isso evitaria registro duplicado.

---

### 4. Configurar application.yaml

```yaml
app:
  web:
    security-headers:
      enabled: true

      content-security-policy: >-
        default-src 'none';
        base-uri 'none';
        form-action 'none';
        frame-ancestors 'none';
        object-src 'none'

      referrer-policy: no-referrer

      permissions-policy: >-
        camera=(),
        microphone=(),
        geolocation=(),
        payment=(),
        usb=()

      hsts-enabled: false
      hsts-max-age: 365d
      hsts-include-sub-domains: false
      hsts-preload: false
```

No laboratório HTTP, HSTS permanece desligado.

Não crie um profile chamado production sem ambiente de produção real.

---

### 5. Criar o teste de configuração

Arquivo:

```text
SecurityHeadersConfigurationTest.java
```

Base:

```java
package br.com.formacao.backend.configuration.web;

import static org.springframework.test.web.servlet
        .request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation
        .Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet
        .WebMvcTest;
import org.springframework.context.annotation.Import;
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
        SecurityHeadersConfiguration.class,
        SecurityHeadersConfigurationTest
                .ProbeController.class
})
@TestPropertySource(
        properties = {
                """
                app.web.security-headers.\
                enabled=true
                """,
                """
                app.web.security-headers.\
                hsts-enabled=true
                """
        }
)
class SecurityHeadersConfigurationTest {

    @Autowired
    private MockMvc mockMvc;

    @RestController
    static class ProbeController {

        @GetMapping(
                "/api/security-headers-probe"
        )
        String apiProbe() {
            return "ok";
        }

        @GetMapping(
                "/outside-security-headers"
        )
        String outsideProbe() {
            return "ok";
        }
    }
}
```

---

### 6. Testar a baseline

```java
@Test
void shouldAddSecurityHeadersToApi()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security-headers-probe"
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            header().string(
                    "X-Content-Type-Options",
                    "nosniff"
            )
    )
    .andExpect(
            header().string(
                    "X-Frame-Options",
                    "DENY"
            )
    )
    .andExpect(
            header().string(
                    "Referrer-Policy",
                    "no-referrer"
            )
    )
    .andExpect(
            header().string(
                    "X-XSS-Protection",
                    "0"
            )
    )
    .andExpect(
            header().string(
                    "Cache-Control",
                    "no-store"
            )
    );
}
```

---

### 7. Testar CSP

```java
@Test
void shouldAddRestrictiveCsp()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security-headers-probe"
            )
    )
    .andExpect(
            header().string(
                    "Content-Security-Policy",
                    org.hamcrest.Matchers.allOf(
                            org.hamcrest.Matchers
                                    .containsString(
                                            "default-src 'none'"
                                    ),
                            org.hamcrest.Matchers
                                    .containsString(
                                            "frame-ancestors 'none'"
                                    ),
                            org.hamcrest.Matchers
                                    .containsString(
                                            "form-action 'none'"
                                    )
                    )
            )
    );
}
```

---

### 8. Testar Permissions-Policy

```java
@Test
void shouldDenyUnusedBrowserFeatures()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security-headers-probe"
            )
    )
    .andExpect(
            header().string(
                    "Permissions-Policy",
                    org.hamcrest.Matchers.allOf(
                            org.hamcrest.Matchers
                                    .containsString(
                                            "camera=()"
                                    ),
                            org.hamcrest.Matchers
                                    .containsString(
                                            "microphone=()"
                                    ),
                            org.hamcrest.Matchers
                                    .containsString(
                                            "geolocation=()"
                                    )
                    )
            )
    );
}
```

---

### 9. Testar HSTS

Request insegura:

```java
@Test
void shouldNotAddHstsToHttp()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security-headers-probe"
            )
    )
    .andExpect(
            header().doesNotExist(
                    "Strict-Transport-Security"
            )
    );
}
```

Request HTTPS simulada:

```java
@Test
void shouldAddHstsToHttps()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/security-headers-probe"
            )
            .secure(true)
    )
    .andExpect(
            header().string(
                    "Strict-Transport-Security",
                    "max-age=31536000"
            )
    );
}
```

Como includeSubDomains e preload estão false, eles não aparecem.

---

### 10. Testar escopo

```java
@Test
void shouldNotApplyApiPolicyOutsideApi()
        throws Exception {

    mockMvc.perform(
            get(
                "/outside-security-headers"
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

Isso prova que a policy estrita não foi espalhada para Swagger e labs.

---

### 11. Testar response 404 da API

```java
@Test
void shouldProtectApiErrorResponse()
        throws Exception {

    mockMvc.perform(
            get(
                "/api/resource-that-does-not-exist"
            )
    )
    .andExpect(
            status().isNotFound()
    )
    .andExpect(
            header().string(
                    "X-Content-Type-Options",
                    "nosniff"
            )
    )
    .andExpect(
            header().string(
                    "Cache-Control",
                    "no-store"
            )
    );
}
```

Security headers também fazem parte das responses de erro.

---

### 12. Criar o controller de laboratório

Arquivo:

```text
SecurityHeadersLabController.java
```

```java
package br.com.formacao.backend.security.lab;

import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation
        .GetMapping;
import org.springframework.web.bind.annotation
        .RestController;

@RestController
@Profile("security-headers-lab")
public class SecurityHeadersLabController {

    @GetMapping(
            value = "/api/security-headers-lab/document",
            produces = MediaType.TEXT_HTML_VALUE
    )
    String document() {
        return """
                <!doctype html>
                <html lang="pt-BR">
                <head>
                  <meta charset="utf-8">
                  <title>Security Headers Lab</title>
                </head>
                <body>
                  <h1 id="status">
                    Script nao executou
                  </h1>

                  <script>
                    document
                      .querySelector("#status")
                      .textContent =
                        "Script executou";
                  </script>
                </body>
                </html>
                """;
    }
}
```

O script inline deve ser bloqueado pela CSP.

---

### 13. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=SecurityHeadersConfigurationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 14. Subir o laboratório

Ative conscientemente:

```text
local,security-headers-lab.
```

Suba:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Confirme o profile nos logs.

Nunca deixe o profile ativo por default.

---

### 15. Inspecionar a API

PowerShell:

```powershell
$response = Invoke-WebRequest `
  "http://localhost:8081/api/v2/service-orders?page=0&size=5"

$response.StatusCode
$response.Headers
```

Confirme:

- CSP;
- `nosniff`;
- `DENY`;
- Referrer-Policy;
- Permissions-Policy;
- `X-XSS-Protection: 0`;
- `Cache-Control: no-store`;
- ausência de HSTS.

---

### 16. Testar o documento CSP

Abra no browser:

```text
http://localhost:8081/api/security-headers-lab/document
```

Resultado visual:

```text
Script nao executou.
```

Abra DevTools:

```text
Console.
```

Confirme uma violação relacionada a script inline.

No Network, inspecione:

```text
Content-Security-Policy.
```

Não adicione `unsafe-inline` para fazer o script funcionar.

O bloqueio é a evidência do laboratório.

---

### 17. Testar framing

Crie temporariamente em `tools/security-headers-lab/frame.html`:

```html
<!doctype html>
<html lang="pt-BR">
<body>
  <iframe
    src="http://localhost:8081/api/security-headers-lab/document"
    width="800"
    height="400">
  </iframe>
</body>
</html>
```

Sirva:

```powershell
npx --yes http-server `
  "tools/security-headers-lab" `
  -p 5175 `
  -c-1
```

O navegador deve rejeitar o framing por:

- CSP `frame-ancestors`;
- `X-Frame-Options: DENY`.

Observe o console.

---

### 18. Verificar Swagger UI

Abra:

```text
http://localhost:8081/swagger-ui/index.html
```

Ela deve continuar funcionando.

Confirme que a CSP de `/api/**` não foi aplicada à página.

Registre:

```text
Swagger UI requer policy própria
antes de exposição em ambiente real.
```

Não trate ausência de CSP no Swagger local como aprovação pública.

---

### 19. Verificar download

Faça download de um arquivo de laboratório.

Confirme:

- `Content-Type`;
- `Content-Disposition`;
- `X-Content-Type-Options`;
- CSP;
- no-store.

O conteúdo precisa manter o tipo correto.

`nosniff` não compensa metadata errada.

---

### 20. Documentar a baseline

Crie:

```text
docs/security/M15_SECURITY_HEADERS.md
```

Estrutura:

```markdown
# Baseline de security headers

## Escopo
## Headers aplicados
## Politica CSP
## HSTS
## Cache
## Paths excluidos
## Evidencias
## Compatibilidade
## Limitacoes
## Migracao futura para Spring Security
```

Registre:

```text
/api/**:
policy estrita.

Swagger:
policy pendente.

Actuator:
management separado.

labs:
fora da policy.

/local HTTP:
sem HSTS.
```

---

### 21. Atualizar CORS

No documento de CORS, registre:

```text
security headers e CORS
podem coexistir;

CORS controla compartilhamento;

CSP controla recursos e framing;

exposed headers
não precisam incluir
os security headers
para o browser aplicá-los.
```

O JavaScript não precisa ler CSP para o browser aplicá-la.

---

### 22. Atualizar CSRF

Registre:

```text
security headers
não substituem token anti-CSRF;

frame-ancestors e DENY
reduzem clickjacking;

não provam intenção
de uma operação autenticada.
```

---

### 23. Atualizar threat model e OWASP

Threat model:

```text
controle de framing;

controle de MIME;

controle de referrer;

HSTS pendente de HTTPS.
```

OWASP:

```text
A02:
baseline de configuração.

A04:
HSTS depende de TLS.

A05:
CSP reduz impacto,
não elimina injection.

A06:
policy explícita é controle de design.
```

A01 e A07 continuam não resolvidas.

---

### 24. Revisar headers desnecessários

Inspecione:

```text
Server;

X-Powered-By.
```

Se existirem, registre.

Não altere container ou proxy sem teste.

Não crie uma narrativa de segurança baseada apenas em esconder versão.

---

### 25. Encerrar laboratório

Pare o servidor estático:

```text
Ctrl + C.
```

Derrube a stack:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Remova o profile do ambiente local.

Preserve os arquivos didáticos versionados.

---

## Entendendo o que foi feito

### A policy foi aplicada por escopo

A API recebeu uma baseline sem quebrar Swagger e labs.

### CSP ficou restritiva

A allowlist começou negando tudo.

### Framing ganhou duas camadas

CSP moderna e header legado foram combinados.

### MIME sniffing foi desabilitado

O browser deve respeitar o Content-Type.

### Referrer foi minimizado

A API não depende de informação de navegação.

### Recursos do browser foram negados

Câmera, microfone e geolocalização não pertencem à API.

### HSTS respeitou HTTPS

O header não virou decoração no HTTP local.

### Cache ficou restrito

Dados de negócio não devem ser armazenados pelo browser nesta baseline.

### Testes protegeram a configuração

Headers, paths, erros e HSTS foram verificados.

---

## Erros comuns importantes

### Copiar todos os headers da internet

Cada policy precisa de contexto e teste.

### Aplicar CSP de API ao Swagger

A interface pode quebrar.

### Adicionar unsafe-inline imediatamente

A proteção da CSP é reduzida.

### Enviar HSTS por HTTP e considerar resolvido

HSTS depende de HTTPS.

### Habilitar preload sem governança

A reversão é difícil.

### Usar X-Frame-Options sem frame-ancestors

A policy moderna fica ausente.

### Confiar em nosniff com Content-Type errado

O metadata ainda precisa estar correto.

### Enviar Clear-Site-Data em toda response

Cookies e storage seriam apagados indevidamente.

### Tratar headers como autorização

Acesso a objeto continua sem proteção.

### Não testar no navegador

Presença e efeito são evidências diferentes.

---

## Comandos úteis

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=SecurityHeadersConfigurationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Inspecionar headers

```powershell
$response = Invoke-WebRequest `
  "http://localhost:8081/api/v2/service-orders"

$response.Headers
```

### Servir frame lab

```powershell
npx --yes http-server `
  "tools/security-headers-lab" `
  -p 5175 `
  -c-1
```

### Ver logs

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api
```

### Encerrar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

---

## Exercício guiado

### Parte 1 — Inventário

Relacione header, risco e user agent.

### Parte 2 — CSP

Explique cada diretiva da baseline.

### Parte 3 — Framing

Diferencie frame-ancestors e X-Frame-Options.

### Parte 4 — Transporte

Explique por que HSTS depende de HTTPS.

### Parte 5 — Privacidade

Revise Referrer-Policy e cache.

### Parte 6 — Spring

Crie properties, filter e registration.

### Parte 7 — Testes

Valide API, erro, escopo e HTTPS.

### Parte 8 — Navegador

Observe CSP bloqueando script e framing.

### Parte 9 — Compatibilidade

Confirme Swagger e download.

### Parte 10 — Documentação

Atualize os artefatos de segurança.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 415 foi preservada;
- security headers foram definidos;
- headers foram tratados como defesa em profundidade;
- headers não foram tratados como autenticação;
- headers não foram tratados como autorização;
- headers não foram tratados como correção automática;
- browser foi diferenciado de client técnico;
- CSP foi explicada;
- default-src foi explicado;
- base-uri foi explicado;
- form-action foi explicado;
- frame-ancestors foi explicado;
- object-src foi explicado;
- policy default deny foi usada;
- CSP não foi chamada de correção de XSS;
- unsafe-inline foi criticado;
- unsafe-eval foi criticado;
- Report-Only foi explicado;
- endpoint de reports não foi antecipado;
- framing foi explicado;
- clickjacking foi explicado;
- X-Frame-Options foi aplicado;
- DENY foi usado;
- frame-ancestors foi aplicado;
- X-Content-Type-Options foi aplicado;
- nosniff foi usado;
- Content-Type correto continuou obrigatório;
- Referrer-Policy foi explicada;
- no-referrer foi usado;
- Permissions-Policy foi explicada;
- Feature-Policy não foi usada;
- câmera foi negada;
- microfone foi negado;
- geolocalização foi negada;
- payment foi negado;
- USB foi negado;
- HSTS foi explicado;
- HSTS não foi emitido no HTTP;
- HSTS foi testado em HTTPS;
- max-age foi configurado;
- includeSubDomains permaneceu false;
- preload permaneceu false;
- riscos de includeSubDomains foram explicados;
- riscos de preload foram explicados;
- proxy TLS foi explicado;
- forwarded headers foram tratados com cautela;
- Cache-Control foi explicado;
- no-store foi aplicado;
- ETag foi diferenciado de cache;
- X-XSS-Protection foi explicado;
- valor zero foi usado;
- Clear-Site-Data foi explicado;
- Clear-Site-Data não foi aplicado globalmente;
- COOP foi citado;
- COEP foi citado;
- CORP foi citado;
- isolamento avançado não foi aplicado sem teste;
- Server foi revisado;
- obscuridade não foi tratada como controle principal;
- properties foram criadas;
- properties foram validadas;
- CSP é configurável;
- Referrer-Policy é configurável;
- Permissions-Policy é configurável;
- HSTS é configurável;
- filter foi criado;
- OncePerRequestFilter foi usado;
- mapping foi limitado a `/api/**`;
- headers foram adicionados antes da chain;
- HSTS usa request secure;
- valor HSTS foi construído;
- configuration foi criada;
- FilterRegistrationBean foi usado;
- filter não foi registrado duas vezes;
- order foi definido;
- application.yaml foi atualizado;
- HSTS local ficou false;
- teste web foi criado;
- baseline foi testada;
- CSP foi testada;
- Permissions-Policy foi testada;
- HTTP sem HSTS foi testado;
- HTTPS com HSTS foi testado;
- path externo foi testado;
- 404 da API foi testado;
- gate completo foi executado;
- lab controller possui profile;
- lab controller fica em `/api/**`;
- HTML com script inline foi criado;
- script foi bloqueado;
- violação CSP foi observada;
- unsafe-inline não foi adicionado;
- framing foi testado;
- frame foi rejeitado;
- Swagger continuou funcional;
- Swagger recebeu ressalva própria;
- download foi revisado;
- no-store foi comprovado;
- documento da baseline foi criado;
- CORS foi atualizado;
- CSRF foi atualizado;
- threat model foi atualizado;
- OWASP review foi atualizado;
- A01 não foi marcada como resolvida;
- A07 não foi marcada como resolvida;
- laboratório foi encerrado;
- profile não ficou ativo por default;
- Spring Security não foi instalado;
- password hashing não foi antecipado;
- autenticação não foi implementada;
- commit recomendado está pronto;
- ponte para a aula 417 está correta.

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
git commit -m "feat(m15): aplicar baseline de security headers"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- cookies;
- tokens;
- env files;
- certificados;
- chaves;
- reports de browser com dados;
- node_modules;
- logs;
- configuração HSTS de domínio real não aprovada;
- profile lab ativo por default.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou uma baseline de security headers à API.

A política passou a incluir:

```text
CSP;

nosniff;

DENY;

no-referrer;

Permissions-Policy;

X-XSS-Protection: 0;

no-store;

HSTS condicionado a HTTPS.
```

A implementação foi:

```text
central;

tipada;

configurável;

limitada a /api/**;

testada;

documentada.
```

O laboratório comprovou:

```text
script inline bloqueado;

framing rejeitado;

Swagger preservado;

HSTS ausente em HTTP.
```

A decisão central foi:

```text
security headers
reduzem comportamentos perigosos
do navegador;

eles não corrigem
controle de acesso,
autenticação,
injection
ou lógica de negócio.
```

A aplicação continua sem:

- usuário;
- senha;
- login;
- autenticação;
- autorização.

A próxima aula será:

```text
417 - M15.07 - Hash de senha BCrypt Argon2 conceitual
```

Nela, você estudará:

- por que senha nunca é armazenada em texto puro;
- hash versus criptografia;
- salt;
- pepper;
- work factor;
- BCrypt;
- Argon2;
- resistência a ataques offline;
- migração de algoritmo;
- rehash;
- testes;
- limites operacionais.

Spring Security ainda não será configurado nessa aula conceitual.

---

# Material complementar

## Checkpoint final

- [ ] Apliquei policy somente na API.
- [ ] Configurei CSP, framing e nosniff.
- [ ] Mantive HSTS condicionado a HTTPS.
- [ ] Testei headers, errors e paths.
- [ ] Documentei compatibilidade e limites.

---

## Troubleshooting adicional

### CSP não aparece

Confirme:

- path começa com `/api/`;
- property enabled;
- filter registration;
- profile;
- ausência de outro filter sobrescrevendo.

### Swagger fica em branco

Confirme que a policy não foi aplicada a `/swagger-ui/**`.

Não libere unsafe-inline na policy da API.

### HSTS não aparece localmente

O laboratório usa HTTP.

Esse é o comportamento esperado.

Use `.secure(true)` no teste.

### Script inline executa

Inspecione o header real.

Confirme ausência de `unsafe-inline`.

Limpe cache e recarregue.

### Iframe mostra o conteúdo

Confirme:

- `frame-ancestors 'none'`;
- `X-Frame-Options: DENY`;
- response veio do path protegido.

### Download deixa de abrir

Confirme o `Content-Type`.

`nosniff` expõe metadata incorreta.

### Teste 404 perde headers

Confirme que o filter adiciona headers antes de `doFilter`.

### Profile lab aparece no ambiente normal

Remova de `SPRING_PROFILES_ACTIVE`.

O endpoint HTML não deve existir por default.

---

## Perguntas de revisão

1. O que são security headers?
2. Eles substituem autorização?
3. Para que serve CSP?
4. O que default-src none faz?
5. Para que serve frame-ancestors?
6. Para que serve X-Frame-Options?
7. O que nosniff faz?
8. O que Referrer-Policy controla?
9. O que Permissions-Policy controla?
10. Para que serve HSTS?
11. HSTS funciona por HTTP?
12. Por que preload exige cuidado?
13. Para que serve no-store?
14. ETag é política de cache nesta API?
15. Por que X-XSS-Protection é zero?
16. Quando usar Clear-Site-Data?
17. Por que Swagger foi excluído?
18. Qual path recebeu a policy?
19. A01 foi resolvida?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Políticas HTTP aplicadas pelo user agent.
2. Não.
3. Restringir recursos e comportamentos do documento.
4. Nega fontes por default.
5. Impedir framing.
6. Compatibilidade contra framing.
7. Impede MIME sniffing.
8. Quanto Referer é enviado.
9. Features do browser.
10. Forçar HTTPS em conexões futuras.
11. Não de forma efetiva.
12. Afeta o domínio e é difícil reverter.
13. Impedir armazenamento da response.
14. Não; ele representa versão para concorrência.
15. Desabilitar filtro legado problemático.
16. Logout ou limpeza de estado.
17. Ela precisa de policy HTML própria.
18. `/api/**`.
19. Não.
20. Hash de senha BCrypt Argon2 conceitual.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 416 - M15.06 - Security headers

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Tratei security headers como defesa em profundidade.
- Confirmei que headers não substituem autenticação ou autorização.
- Estudei Content-Security-Policy.
- Usei uma CSP default deny para a API.
- Estudei default-src, base-uri, form-action, frame-ancestors e object-src.
- Rejeitei unsafe-inline e unsafe-eval como atalhos.
- Estudei Content-Security-Policy-Report-Only.
- Estudei clickjacking.
- Combinei frame-ancestors e X-Frame-Options DENY.
- Apliquei X-Content-Type-Options nosniff.
- Mantive Content-Type correto como obrigação.
- Apliquei Referrer-Policy no-referrer.
- Apliquei Permissions-Policy.
- Neguei câmera, microfone, geolocalização, payment e USB.
- Estudei HSTS.
- Não emiti HSTS no HTTP local.
- Testei HSTS em request HTTPS.
- Mantive includeSubDomains e preload desativados.
- Estudei o impacto de reverse proxy e forwarded headers.
- Apliquei Cache-Control no-store à API.
- Diferenciei ETag de cache.
- Apliquei X-XSS-Protection com valor zero.
- Estudei Clear-Site-Data.
- Introduzi COOP, COEP e CORP sem ativá-los.
- Criei `SecurityHeadersProperties`.
- Criei `SecurityHeadersFilter`.
- Criei `SecurityHeadersConfiguration`.
- Limitei a policy a `/api/**`.
- Mantive Swagger, Actuator e labs fora da policy estrita.
- Criei testes de headers, paths, erros e HTTPS.
- Criei um laboratório CSP por profile.
- Confirmei bloqueio de script inline.
- Confirmei bloqueio de framing.
- Confirmei funcionamento do Swagger UI.
- Revisei headers de download.
- Criei `docs/security/M15_SECURITY_HEADERS.md`.
- Atualizei CORS, CSRF, threat model e OWASP review.
- Mantive A01 e A07 não resolvidas.
- Não instalei Spring Security.
- Não antecipei usuários, senhas ou autenticação.
- Próxima aula: Hash de senha BCrypt Argon2 conceitual.
```

---

## Referência técnica curta

- [OWASP HTTP Security Response Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Spring Security — Security HTTP Response Headers](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html)
- [MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [MDN — Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
- [RFC 6797 — HTTP Strict Transport Security](https://www.rfc-editor.org/rfc/rfc6797)
- [MDN — Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)

Regra final:

```text
uma baseline de security headers precisa ser específica para o conteúdo e o ambiente, aplicar CSP e framing de forma compatível, impedir MIME sniffing, reduzir referrer e recursos desnecessários, controlar cache e emitir HSTS somente quando HTTPS estiver corretamente estabelecido; nesta aplicação, a policy fica limitada a /api/**, possui testes de presença e efeito, preserva Swagger e laboratórios e permanece uma defesa em profundidade que não resolve autenticação, autorização ou injection.
```
