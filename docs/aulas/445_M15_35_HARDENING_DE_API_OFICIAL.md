# 445 - M15.35 - Hardening de API

## Apresentação da aula

Na aula 444, a autorização deixou de ser validada por poucos exemplos isolados.

A aplicação ganhou uma matriz executável que combinou:

```text
actor;

role;

permission;

tenant;

ownership;

action;

resource;

state;

resultado esperado;

side effects.
```

As duas fronteiras principais foram testadas:

```text
HTTP;

Method Security.
```

Também ficaram comprovados:

- deny-by-default;
- `401` para autenticação ausente ou inválida;
- `403` para permission ausente ou seleção de tenant negada;
- `404` para recurso inexistente ou oculto;
- `409` para estado ou transição inválida;
- `412` para versão divergente;
- `428` para ausência de `If-Match`;
- content e count filtrados por tenant e ownership;
- ausência de bypass em chamada direta;
- ausência de poder implícito para `ROLE_ADMIN`.

Esses controles protegem quem pode executar cada operação.

Ainda precisamos endurecer a superfície técnica que recebe essas operações.

Considere alguns requests hostis:

```http
TRACE /api/v2/service-orders HTTP/1.1
Host: api.example.test
```

```http
POST /api/auth/login HTTP/1.1
Content-Type: text/plain

{"username":"a","password":"b"}
```

```http
POST /api/v2/service-orders HTTP/1.1
Content-Type: application/json
Content-Length: 999999999
```

```http
GET /api/v2/service-orders HTTP/1.1
X-Forwarded-Proto: https
X-Forwarded-Host: attacker.example
```

```http
GET /actuator/env HTTP/1.1
Host: public-api.example.test
```

Mesmo que autenticação e autorização estejam corretas, uma API pode continuar exposta a riscos causados por:

- métodos HTTP desnecessários;
- media types permissivos;
- headers excessivos;
- payloads sem limite;
- parâmetros em quantidade extrema;
- conexões lentas;
- keep-alive ilimitado;
- filas sem limite;
- confiança indevida em proxy;
- endpoints de management públicos;
- páginas de erro padrão;
- versão do servidor em headers;
- cookies inseguros;
- redirects absolutos forjados;
- configuração divergente entre ambientes.

A pergunta central desta aula será:

```text
como reduzir a superfície
e limitar o consumo de recursos
antes que requests hostis
alcancem os casos de uso,
sem quebrar os contratos
já construídos?
```

Hardening torna defaults e limites explícitos, sem substituir autenticação, autorização, validação, rate limiting, observabilidade, patching, infraestrutura ou testes.

A baseline será aplicada por um profile:

```text
hardening.
```

E por um fragmento de produção:

```text
application-hardening.yaml.
```

Os valores de laboratório serão explícitos: headers de request em 16KB, response em 8KB, JSON em 1MB, formulário em 256KB, cem parâmetros, timeouts curtos, cem requests por conexão, fila de cem e shutdown de vinte segundos. Produção exige calibração com tráfego, JWTs, payloads, proxy, carga e rollback.

A aplicação utiliza Tomcat embarcado.

Portanto, algumas propriedades serão específicas:

```text
server.tomcat.*.
```

A aula também distinguirá limites do container e limites da aplicação.

Exemplo:

```text
server.tomcat.max-http-form-post-size
```

limita conteúdo de formulário.

Ele não representa um limite universal para qualquer JSON transmitido por streaming.

Por isso, o projeto criará:

```text
BoundedRequestBodyFilter.
```

Esse filtro contará os bytes realmente lidos do `ServletInputStream`.

Se o limite for ultrapassado:

```text
413 Payload Too Large.
```

O request não chegará ao controller.

A API continuará aceitando somente JSON nos endpoints que recebem JSON.

Contratos:

```text
Content-Type ausente
em body obrigatório:
415.

Content-Type incompatível:
415.

Accept incompatível:
406.

método não suportado:
405.

payload grande:
413.

headers grandes:
rejeição do container.

parâmetros excessivos:
rejeição do container.
```

Management continuará em `127.0.0.1:8082`, expondo somente health e, quando aprovado, Prometheus. Endpoints de configuração, dumps, loggers, exchanges, shutdown e logfile permanecem indisponíveis publicamente.

O laboratório manterá:

```text
liveness;

readiness;

health.
```

O profile de produção não confiará em headers forwarded por padrão.

Configuração inicial:

```text
server.forward-headers-strategy:
none.
```

A mudança para uma estratégia de forwarded headers exigirá proxy restrito, limpeza de headers, lista de confiança, testes de spoofing, redirects e HSTS, além de documentação de TLS termination.

A próxima aula será:

```text
446 - M15.36 - Checklist seguranca em PR
```

Nela, os controles do módulo serão transformados em um checklist operacional para revisão de pull requests.

---

## Onde estamos na formação

A sequência oficial é:

```text
443:
Testes de seguranca.

444:
Testes de autorizacao.

445:
Hardening de API.

446:
Checklist seguranca em PR.

447:
Projeto API segura parte 1.

448:
Projeto API segura parte 2.
```

A aula 444 respondeu:

```text
quem pode fazer
o quê,
sobre qual recurso,
em qual contexto?
```

A aula 445 responderá:

```text
quais requests,
protocolos,
limites e interfaces
a API deve aceitar?
```

Nesta aula:

```text
métodos HTTP:
restritos.

media types:
restritos.

headers:
limitados.

payload JSON:
limitado.

forms:
limitados.

multipart:
desabilitado.

parâmetros:
limitados.

timeouts:
sim.

keep-alive:
limitado.

fila:
limitada.

forwarded headers:
não confiados por padrão.

Actuator:
isolado.

erros padrão:
desabilitados.

server header:
suprimido.

cookies:
endurecidos.

graceful shutdown:
sim.

checklist de PR:
próxima aula.
```

A regra central será:

```text
a API aceita somente
protocolos e volumes
que foram deliberadamente
aprovados e testados.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/
└── application-hardening.yaml
```

Configuração:

```text
configuration/hardening/
├── ApiHardeningProperties.java
├── ApiHardeningConfiguration.java
├── BoundedRequestBodyFilter.java
├── LimitedHttpServletRequest.java
├── LimitedServletInputStream.java
├── StrictMediaTypeFilter.java
├── AllowedHttpMethodsFilter.java
└── HardeningProblemWriter.java
```

Testes:

```text
ApiHardeningPropertiesTest;

RequestBodyLimitIntegrationTest;

StrictMediaTypeIntegrationTest;

HttpMethodHardeningIntegrationTest;

ForwardedHeaderTrustTest;

ActuatorExposureHardeningTest;

SessionCookieHardeningTest;

ProductionHardeningPolicyTest;

GracefulShutdownConfigurationTest.
```

Documentação:

```text
docs/security/
├── M15_API_HARDENING_BASELINE.md
├── M15_API_LIMITS_MATRIX.md
└── M15_TRUSTED_PROXY_RUNBOOK.md
```

Você irá:

1. inventariar a superfície;
2. definir métodos permitidos;
3. definir media types;
4. limitar request headers;
5. limitar response headers;
6. limitar parâmetros;
7. desabilitar multipart;
8. limitar JSON real;
9. padronizar `413`;
10. limitar conexões;
11. limitar fila;
12. configurar timeouts;
13. configurar graceful shutdown;
14. suprimir Server header;
15. desabilitar páginas padrão;
16. endurecer cookies;
17. restringir forwarded headers;
18. restringir Actuator;
19. testar o profile;
20. preparar checklist de PR.

---

## Conceito essencial

### Hardening reduz superfície

Cada recurso desnecessário aumenta caminhos, parsing, estados e chance de configuração incorreta. A baseline restringe aquilo que a API não utiliza.
### Limites são requisitos

Sem limites explícitos, memória, sockets, threads, banco, proxy e timeouts tornam-se limites acidentais. Hardening transforma esses valores em contrato operacional.
### Limite do proxy e da aplicação

CDN, WAF, proxy, Tomcat e Spring podem impor limites diferentes. A menor camada vence; por isso, valores precisam ser alinhados e documentados.
### Header size

Headers podem crescer por:

- JWT;
- cookies;
- tracing;
- forwarded headers;
- CORS;
- client metadata.

Headers excessivos consomem memória antes do body.

A baseline define:

```yaml
server:
  max-http-request-header-size: 16KB

  tomcat:
    max-http-response-header-size: 8KB
```

O limite de request é aplicado pelo servidor embarcado conforme sua implementação.

Para Tomcat, a soma da request line, nomes e valores participa do limite.

---

### Server header

`server.server-header: ""` reduz exposição passiva da implementação, mas não substitui patching e inventário.
### Métodos HTTP

A API aceita somente métodos declarados. TRACE e CONNECT ficam bloqueados; OPTIONS continua disponível apenas para o fluxo CORS aprovado. Métodos incompatíveis retornam `405`.
### Content-Type

Endpoints com body aceitam somente `application/json` e UTF-8. `application/problem+json` permanece response; XML, texto e form são rejeitados.
### Accept

Quando o endpoint produz JSON e o client exige apenas outro formato, a API retorna `406` sem negociação silenciosa.
### Request body

`Content-Length` permite rejeição antecipada, mas pode faltar em transferências chunked. O limite efetivo é aplicado durante a leitura do stream.
### Multipart

Como o projeto não possui upload ativo, `spring.servlet.multipart.enabled` fica `false`. Upload futuro terá configuração e limites próprios.
### Form parsing

Tomcat limita formulário e quantidade de parâmetros. A API JSON não depende desse binding, mas o limite reduz parsing acidental e abuso.
### Queue e conexões

Conexões, threads e fila precisam ser finitas. Uma fila enorme apenas converte saturação em latência e memória acumulada.
### Connection timeout

O timeout limita quanto o connector espera a request line após aceitar a conexão, complementando controles do proxy e da rede.
### Keep-alive

Keep-alive reduz handshakes, mas ocupa recursos. A baseline usa timeout de 15 segundos e até 100 requests por conexão, sujeitos a calibração.
### Graceful shutdown

Durante shutdown:

1. readiness recusa tráfego;
2. novas requests deixam de chegar;
3. requests em andamento recebem tempo;
4. aplicação fecha recursos.

Configuração:

```yaml
server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s
```

O timeout deve ser menor que o grace period da plataforma, deixando margem para finalizar o processo.

---

### Compression

Compressão permanece desabilitada até haver análise de conteúdo, carga, media types e risco de respostas que combinem secrets com input controlado.
### HTTP/2

HTTP/2 permanece desabilitado até que proxy, limites, observabilidade e testes sejam aprovados.
### Forwarded headers

`X-Forwarded-*` é input do cliente quando não existe proxy confiável.

Confiar nesses headers pode alterar:

- scheme;
- host;
- port;
- remote IP;
- redirects;
- links;
- HSTS;
- rate limiting.

Por padrão:

```yaml
server:
  forward-headers-strategy: none
```

A mudança exige o runbook de proxy.

---

### Host header

Host é input. Redirects OIDC e links externos usam URLs aprovadas, nunca qualquer Host recebido.
### Erros padrão

O projeto já possui Problem Details próprio.

O fallback padrão não deve expor exception ou stack trace.

Na linha atual do Spring Boot, o profile define:

```yaml
spring:
  web:
    error:
      include-exception: false
      include-message: never
      include-stacktrace: never
      include-binding-errors: never
      whitelabel:
        enabled: false
```

Os handlers catalogados continuam sendo a fonte do contrato.

---

### Actuator

Disponível não significa exposto.

A baseline mantém:

```yaml
management:
  server:
    port: 8082
    address: 127.0.0.1

  endpoints:
    web:
      exposure:
        include:
          - health
```

`prometheus` pode ser incluído somente quando o ambiente possui caminho privado e autenticação ou rede controlada.

---

### Health details

Health não expõe hosts, usuários, queries, stack ou configuração. Mesmo na porta local, detalhes seguem necessidade operacional.
### Cookies

A API Bearer stateless não usa cookie de sessão.

O laboratório OIDC usa sessão.

No profile externo com HTTPS:

```yaml
server:
  servlet:
    session:
      cookie:
        http-only: true
        secure: true
        same-site: lax
      timeout: 10m
```

`Secure=false` permanece somente no profile local da aula 436.

---

### Defaults fail-fast

O profile de produção precisa incluir hardening e falhar nos testes quando reativar profiles locais, Keycloak dev, exposure ampla, forwarded headers permissivos ou cookies inseguros.
## Mão na massa guiada

### 1. Criar a matriz de limites

Arquivo:

```text
docs/security/M15_API_LIMITS_MATRIX.md
```

Tabela:

| Limite | Baseline lab | Fonte | Evidência |
|---|---:|---|---|
| Request header | 16KB | Spring Boot/Tomcat | integration test |
| Response header | 8KB | Tomcat | configuration test |
| JSON body | 1MB | filter | integration test |
| Form body | 256KB | Tomcat | configuration test |
| Parameters | 100 | Tomcat | integration test |
| Multipart | disabled | Spring | context test |
| Connection timeout | 5s | Tomcat | configuration test |
| Keep-alive | 15s | Tomcat | configuration test |
| Requests/connection | 100 | Tomcat | configuration test |
| Accept queue | 100 | Tomcat | configuration test |
| Shutdown phase | 20s | Spring | configuration test |

Marque:

```text
requires production calibration.
```

---

### 2. Criar ApiHardeningProperties

```java
@ConfigurationProperties(
    prefix = "app.security.hardening"
)
public record ApiHardeningProperties(
        DataSize maxJsonBodySize,
        Set<String> bodyMethods,
        Set<String> allowedRequestMediaTypes,
        Set<String> allowedMethods
) {
    public ApiHardeningProperties {
        Objects.requireNonNull(
                maxJsonBodySize
        );

        bodyMethods =
                Set.copyOf(
                        bodyMethods
                );

        allowedRequestMediaTypes =
                Set.copyOf(
                        allowedRequestMediaTypes
                );

        allowedMethods =
                Set.copyOf(
                        allowedMethods
                );
    }
}
```

---

### 3. Criar application-hardening.yaml

```yaml
app:
  security:
    hardening:
      max-json-body-size: 1MB
      body-methods:
        - POST
        - PUT
        - PATCH
      allowed-request-media-types:
        - application/json
      allowed-methods:
        - GET
        - POST
        - PUT
        - PATCH
        - DELETE
        - OPTIONS
        - HEAD

server:
  server-header: ""
  max-http-request-header-size: 16KB
  forward-headers-strategy: none
  shutdown: graceful

  compression:
    enabled: false

  http2:
    enabled: false

  tomcat:
    connection-timeout: 5s
    keep-alive-timeout: 15s
    max-keep-alive-requests: 100
    max-http-response-header-size: 8KB
    max-http-form-post-size: 256KB
    max-parameter-count: 100
    max-connections: 1000
    accept-count: 100
    threads:
      max: 200
      min-spare: 10
      max-queue-capacity: 200

spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s

  servlet:
    multipart:
      enabled: false

  web:
    error:
      include-exception: false
      include-message: never
      include-stacktrace: never
      include-binding-errors: never
      whitelabel:
        enabled: false
```

---

### 4. Configurar management

No mesmo fragmento:

```yaml
management:
  server:
    port: 8082
    address: 127.0.0.1

  endpoints:
    access:
      default: none

    web:
      discovery:
        enabled: false

      exposure:
        include:
          - health

  endpoint:
    health:
      access: read-only
      probes:
        enabled: true
      show-details: never

    shutdown:
      access: none
```

O modelo usa allowlist de exposição e de acesso.

---

### 5. Criar ApiHardeningConfiguration

```java
@Configuration
@Profile("hardening")
@EnableConfigurationProperties(
    ApiHardeningProperties.class
)
public class ApiHardeningConfiguration {

    @Bean
    FilterRegistrationBean<AllowedHttpMethodsFilter>
    allowedHttpMethodsFilter(
            ApiHardeningProperties properties,
            HardeningProblemWriter writer
    ) {
        var registration =
                new FilterRegistrationBean<>(
                    new AllowedHttpMethodsFilter(
                        properties,
                        writer
                    )
                );

        registration.setOrder(
                Ordered.HIGHEST_PRECEDENCE + 5
        );

        return registration;
    }

    @Bean
    FilterRegistrationBean<StrictMediaTypeFilter>
    strictMediaTypeFilter(
            ApiHardeningProperties properties,
            HardeningProblemWriter writer
    ) {
        var registration =
                new FilterRegistrationBean<>(
                    new StrictMediaTypeFilter(
                        properties,
                        writer
                    )
                );

        registration.setOrder(
                Ordered.HIGHEST_PRECEDENCE + 10
        );

        return registration;
    }
}
```

O body filter ficará depois da validação de método e media type.

---

### 6. Criar AllowedHttpMethodsFilter

```java
public final class AllowedHttpMethodsFilter
        extends OncePerRequestFilter {

    private final Set<String> allowedMethods;

    private final HardeningProblemWriter writer;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String method =
                request.getMethod()
                       .toUpperCase(
                           Locale.ROOT
                       );

        if (
            !allowedMethods.contains(
                    method
            )
        ) {
            writer.methodNotAllowed(
                    request,
                    response
            );

            return;
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}
```

A allowlist global não substitui o `@RequestMapping`.

Ela bloqueia métodos totalmente fora da aplicação.

---

### 7. Tratar OPTIONS

`OPTIONS` é necessário para preflight quando CORS se aplica.

O filtro permite OPTIONS.

A configuração CORS decide:

- origin;
- method;
- headers;
- credentials.

Não responda `200` genérico para qualquer origin.

---

### 8. Criar StrictMediaTypeFilter

```java
public final class StrictMediaTypeFilter
        extends OncePerRequestFilter {

    private final ApiHardeningProperties properties;

    private final HardeningProblemWriter writer;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        if (
            !hasRequestBodyMethod(
                request
            )
        ) {
            chain.doFilter(
                    request,
                    response
            );

            return;
        }

        if (
            request.getContentLengthLong() == 0
        ) {
            chain.doFilter(
                    request,
                    response
            );

            return;
        }

        String raw =
                request.getContentType();

        if (
            raw == null
            || !isAllowedJson(
                    raw
            )
        ) {
            writer.unsupportedMediaType(
                    request,
                    response
            );

            return;
        }

        chain.doFilter(
                request,
                response
        );
    }
}
```

A comparação usa `MediaType`, não `startsWith`.

---

### 9. Validar charset

Para JSON:

```text
UTF-8
```

é a baseline.

Aceite:

```text
application/json;

application/json;charset=UTF-8.
```

Rejeite charsets incompatíveis.

Não tente transcodificar conteúdo arbitrário silenciosamente.

---

### 10. Criar LimitedServletInputStream

```java
public final class LimitedServletInputStream
        extends ServletInputStream {

    private final ServletInputStream delegate;

    private final long maximumBytes;

    private long consumed;

    public LimitedServletInputStream(
            ServletInputStream delegate,
            long maximumBytes
    ) {
        this.delegate = delegate;
        this.maximumBytes = maximumBytes;
    }

    @Override
    public int read() throws IOException {
        int value =
                delegate.read();

        if (value >= 0) {
            incrementOrThrow(
                    1
            );
        }

        return value;
    }

    @Override
    public int read(
            byte[] buffer,
            int offset,
            int length
    ) throws IOException {
        int read =
                delegate.read(
                        buffer,
                        offset,
                        length
                );

        if (read > 0) {
            incrementOrThrow(
                    read
            );
        }

        return read;
    }

    private void incrementOrThrow(
            int amount
    ) {
        consumed += amount;

        if (consumed > maximumBytes) {
            throw new RequestBodyTooLargeException();
        }
    }
}
```

Implemente também os métodos abstratos delegando estado e listener.

---

### 11. Criar LimitedHttpServletRequest

```java
public final class LimitedHttpServletRequest
        extends HttpServletRequestWrapper {

    private final long maximumBytes;

    private ServletInputStream inputStream;

    public LimitedHttpServletRequest(
            HttpServletRequest request,
            long maximumBytes
    ) {
        super(request);
        this.maximumBytes = maximumBytes;
    }

    @Override
    public ServletInputStream getInputStream()
            throws IOException {

        if (inputStream == null) {
            inputStream =
                    new LimitedServletInputStream(
                        super.getInputStream(),
                        maximumBytes
                    );
        }

        return inputStream;
    }
}
```

Não permita leituras alternativas sem o mesmo limite.

---

### 12. Criar BoundedRequestBodyFilter

```java
public final class BoundedRequestBodyFilter
        extends OncePerRequestFilter {

    private final long maximumBytes;

    private final HardeningProblemWriter writer;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        long contentLength =
                request.getContentLengthLong();

        if (
            contentLength > maximumBytes
        ) {
            writer.payloadTooLarge(
                    request,
                    response
            );

            return;
        }

        try {
            chain.doFilter(
                new LimitedHttpServletRequest(
                    request,
                    maximumBytes
                ),
                response
            );
        }
        catch (
            RequestBodyTooLargeException exception
        ) {
            if (!response.isCommitted()) {
                writer.payloadTooLarge(
                        request,
                        response
                );
            }
        }
    }
}
```

O filtro não armazena o body em memória.

---

### 13. Criar Problem Details 413

Contrato:

```text
status:
413.

type:
urn:problem:payload-too-large.

title:
Payload too large.

detail:
The request payload exceeds the permitted limit.

code:
payload_too_large.
```

Headers:

```text
Cache-Control:
no-store.

Content-Type:
application/problem+json.
```

Não devolva o limite exato quando isso não fizer parte do contrato.

No laboratório, ele pode ser documentado na OpenAPI.

---

### 14. Padronizar 405, 406 e 415

Codes:

```text
method_not_allowed;

not_acceptable;

unsupported_media_type.
```

Não inclua:

- parser internals;
- stack;
- media type bruto sem sanitização;
- headers completos;
- request body.

O `Allow` header pode listar métodos suportados quando o framework conhece a rota.

O filtro global não deve inventar methods de uma rota específica.

---

### 15. Restringir default servlet e static resources

A API não serve arquivos estáticos.

Defina:

```yaml
server:
  servlet:
    register-default-servlet: false

spring:
  web:
    resources:
      add-mappings: false
```

O laboratório OIDC retorna HTML por controller, não por pasta pública.

---

### 16. Revisar redirects

A API stateless não redireciona para login.

O laboratório OIDC possui redirects configurados.

Não construa redirects com:

```text
Host;

X-Forwarded-Host;

X-Forwarded-Proto
```

não validados.

A callback permanece exata.

---

### 17. Criar trusted proxy runbook

Arquivo:

```text
docs/security/M15_TRUSTED_PROXY_RUNBOOK.md
```

Inclua:

- topologia;
- ranges do proxy;
- headers removidos;
- headers inseridos;
- TLS termination;
- host allowlist;
- strategy escolhida;
- testes de spoofing;
- rollback;
- owner.

A baseline local permanece `none`.

---

### 18. Configurar cookie externo

No profile que utiliza OIDC por HTTPS:

```yaml
server:
  servlet:
    session:
      timeout: 10m

      cookie:
        name: __Host-FORMACAO_SESSION
        http-only: true
        secure: true
        same-site: lax
        path: /
```

O prefixo `__Host-` exige:

- Secure;
- path `/`;
- ausência de Domain.

Não use esse profile em HTTP local.

---

### 19. Revisar sessão da API

Requests Bearer para `/api/**` continuam:

```text
STATELESS.
```

Teste que:

- não recebem `Set-Cookie`;
- não criam sessão;
- não usam request cache;
- não redirecionam;
- não persistem SecurityContext em sessão.

---

### 20. Criar ApiHardeningPropertiesTest

Valide:

- max body positivo;
- limite não excede teto da organização;
- métodos em uppercase;
- media types parseáveis;
- TRACE ausente;
- CONNECT ausente;
- multipart desabilitado;
- forwarded strategy `none`;
- management em loopback;
- exposure allowlist.

---

### 21. Criar RequestBodyLimitIntegrationTest

Cenários:

- body abaixo do limite;
- body exatamente no limite;
- body um byte acima;
- Content-Length acima;
- chunked acima;
- Unicode com bytes diferentes de chars;
- body vazio;
- GET sem body;
- response `413`;
- controller não chamado;
- repository não chamado;
- audit success ausente.

O limite é em bytes.

---

### 22. Criar StrictMediaTypeIntegrationTest

Cenários:

```text
application/json:
aceito.

application/json;charset=UTF-8:
aceito.

text/plain:
415.

application/xml:
415.

body sem Content-Type:
415.

Accept application/json:
aceito.

Accept application/xml:
406.
```

Valide `no-store` nos errors.

---

### 23. Criar HttpMethodHardeningIntegrationTest

Cenários:

- GET permitido;
- POST permitido na rota correta;
- TRACE bloqueado;
- CONNECT bloqueado;
- PUT em rota sem PUT produz `405`;
- OPTIONS preflight válido segue CORS;
- origin não autorizada não recebe acesso.

Confirme ausência de redirect.

---

### 24. Testar header size

Um integration test de servidor real inicia porta aleatória.

Envie header dentro do limite.

Depois envie header acima do limite.

A rejeição pode ocorrer no Tomcat antes do Spring.

Não exija Problem Details quando o request não chegou à aplicação.

Valide:

- conexão rejeitada ou status compatível;
- controller não chamado;
- processo permanece saudável.

---

### 25. Testar parameter count

Envie query com:

```text
100 parâmetros:
baseline.

101 parâmetros:
rejeição.
```

O endpoint real possui poucos filtros.

Esse teste prova o limite do container.

Não aumente o número para aceitar input sem requisito.

---

### 26. Criar ForwardedHeaderTrustTest

Envie:

```text
X-Forwarded-Proto: https;

X-Forwarded-Host: attacker.example;

X-Forwarded-For: 203.0.113.10.
```

Com strategy `none`, confirme:

- scheme interno não muda;
- host lógico de segurança não muda;
- rate limit usa remote address;
- links não usam attacker host;
- HSTS não é ativado por header falso em HTTP.

---

### 27. Criar ActuatorExposureHardeningTest

Inicie profile hardening.

Na porta principal:

```text
/actuator/env:
não disponível.

/actuator/beans:
não disponível.

/actuator/heapdump:
não disponível.
```

Na porta de management:

```text
health:
disponível.

env:
não exposto.

shutdown:
não disponível.

discovery page:
desabilitada.
```

A porta deve bindar loopback.

---

### 28. Criar SessionCookieHardeningTest

No profile HTTPS de teste, valide:

```text
Set-Cookie contém:
Secure;
HttpOnly;
SameSite=Lax;
Path=/.

não contém:
Domain.
```

No `/api/**` Bearer:

```text
Set-Cookie ausente.
```

---

### 29. Criar ProductionHardeningPolicyTest

Leia os profiles de produção.

Falhe se encontrar:

```text
forward-headers-strategy: framework
sem runbook aprovado;

multipart enabled;

show-details: always;

exposure include "*";

whitelabel enabled;

include-stacktrace diferente de never;

compression enabled sem aprovação;

http2 enabled sem aprovação;

server header preenchido;

management address 0.0.0.0;

Keycloak start-dev;

Secure cookie false.
```

---

### 30. Criar GracefulShutdownConfigurationTest

Valide:

```text
server.shutdown:
graceful.

timeout phase:
20s.

readiness:
probes enabled.
```

Simule `AvailabilityChangeEvent`.

Confirme que readiness muda para:

```text
REFUSING_TRAFFIC.
```

antes do encerramento.

---

### 31. Revisar outbound clients

A API não possui chamada externa de negócio no CRUD principal. Registre como policy que todo `RestClient`, `WebClient` ou `HttpClient` futuro exige connect e response timeout; não crie client global sem uso.

---

### 32. Revisar banco e Redis

Registre como gaps pool, timeouts, circuit breakers, paginação e fallbacks; valores de infraestrutura só mudam com teste.

---

### 33. Revisar paginação

Use default 20 e máximo 100. Valores acima retornam `400 invalid_page_size`; não faça clamp silencioso.

---

### 34. Revisar sort

Permita apenas `createdAt`, `scheduledFor`, `status` e `customerName`. Tenant, owner, flags, relações, funções e expressões são rejeitados.

---

### 35. Revisar filtros de texto

Limite `customerName` a 160 e `serviceType` a 80 caracteres, aplicando trim, policy Unicode e remoção de controles. A query permanece parametrizada.

---

### 36. Criar documento principal

Arquivo:

```text
docs/security/M15_API_HARDENING_BASELINE.md
```

Inclua:

```markdown
# Baseline de hardening

## Protocolos

- methods allowlist.
- JSON only.
- no XML.
- no multipart.

## Limites

- headers.
- body.
- parameters.
- pages.
- sort.

## Servidor

- timeouts.
- queue.
- keep-alive.
- graceful shutdown.
- no server header.

## Proxy

- no forwarded trust by default.
- runbook required.

## Management

- separate port.
- loopback.
- allowlist exposure.

## Browser

- headers.
- secure cookies.
- no session on API.

## Gaps

- production load test.
- proxy calibration.
- outbound client timeouts.
- infrastructure limits.
```

---

### 37. Atualizar OpenAPI

Documente:

- `405`;
- `406`;
- `413`;
- `415`;
- limite de body;
- media types;
- paginação máxima;
- sort permitido;
- ausência de XML;
- headers de precondition;
- no-store em errors sensíveis.

OpenAPI não substitui o runtime.

---

### 38. Atualizar Postman e Insomnia

Cenários:

- TRACE;
- media type errado;
- Accept errado;
- body acima do limite;
- query params excessivos;
- page size excessivo;
- sort não permitido;
- forwarded headers falsos;
- actuator público;
- API sem cookie.

Não salve payload gigante no Git.

Gere-o em pre-request script local.

---

### 39. Atualizar threat model

Adicione:

```text
THR-265:
método HTTP desnecessário
alcança a aplicação.

THR-266:
media type permissivo
ativa parser inesperado.

THR-267:
payload sem limite
consome memória.

THR-268:
Content-Length ausente
contorna limite.

THR-269:
headers excessivos
consomem recursos.

THR-270:
parâmetros excessivos
pressionam parser.

THR-271:
keep-alive ou queue
mantêm recursos ocupados.

THR-272:
forwarded header falso
altera scheme, host ou IP.

THR-273:
Actuator expõe configuração
ou dump.

THR-274:
cookie OIDC trafega
sem Secure.

THR-275:
erro padrão exibe detalhes.

THR-276:
shutdown abrupto
interrompe mutação.

THR-277:
sort arbitrário
expõe propriedade interna.

THR-278:
profile produtivo
não carrega hardening.
```

Controles:

- method allowlist;
- media type allowlist;
- stream limit;
- actual byte count;
- server header limit;
- parameter limit;
- timeouts;
- no forwarded trust;
- management loopback;
- cookie flags;
- error config;
- graceful shutdown;
- sort allowlist;
- policy test.

---

### 40. Atualizar OWASP e baseline

A02 Security Misconfiguration:

```text
Actuator;

errors;

server header;

proxy;

cookies;

profiles.
```

A04 Insecure Design:

```text
resource limits;

timeouts;

queue;

pagination;

sort.
```

A05 Injection:

```text
strict media type;

parameterized persistence;

sort allowlist.
```

A07 Authentication Failures:

```text
OIDC cookie hardened;

API stateless.
```

A10 Mishandling of Exceptional Conditions:

```text
413;

415;

406;

405;

graceful shutdown;

fail-fast config.
```

Baseline:

```text
methods:
allowlist.

media:
JSON only.

body:
1MB.

headers:
explicit limits.

proxy:
untrusted by default.

Actuator:
loopback.

errors:
generic.

session:
secure only when used.

produção pública:
NO-GO.
```

---

### 41. Executar o gate

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=ApiHardeningPropertiesTest,RequestBodyLimitIntegrationTest,StrictMediaTypeIntegrationTest,HttpMethodHardeningIntegrationTest,ForwardedHeaderTrustTest,ActuatorExposureHardeningTest,SessionCookieHardeningTest,ProductionHardeningPolicyTest,GracefulShutdownConfigurationTest `
  test
```

Suítes anteriores:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixHttpTest,AuthenticationErrorContractTest,SecurityHeadersContractTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- profile carregado;
- methods;
- media types;
- body em bytes;
- chunked;
- header size;
- parameter count;
- multipart;
- queue;
- timeouts;
- shutdown;
- forwarded headers;
- Actuator;
- cookies;
- errors;
- pagination;
- sort;
- OpenAPI;
- collections;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### A superfície ficou explícita

Methods e media types deixaram de depender apenas de defaults.

### Limites chegaram antes do caso de uso

Headers, parameters e body são rejeitados antes de consumo desnecessário.

### JSON real passou a ter limite

O controle conta bytes lidos, inclusive sem `Content-Length`.

### O servidor ganhou capacidade finita

Conexões, fila, threads e keep-alive ficaram documentados.

### Proxy deixou de ser confiado implicitamente

Headers forwarded não alteram segurança no acesso direto.

### Management permaneceu privado

Actuator usa porta separada, loopback e exposure allowlist.

### Browser e sessão foram separados da API

Cookies seguros existem somente no fluxo OIDC; Bearer continua stateless.

### Configuração produtiva ganhou policy tests

Defaults perigosos passam a falhar no build.

---

## Erros comuns importantes

### Achar que max form size limita todo JSON

Form parsing e body JSON são caminhos diferentes.

### Confiar apenas em Content-Length

Chunked transfer pode não possuir o header.

### Bufferizar o body inteiro para medir

A própria defesa pode causar consumo excessivo.

### Permitir qualquer Content-Type

Parsers e conversores inesperados ampliam a superfície.

### Confiar em X-Forwarded-For diretamente

O atacante pode forjar origem.

### Expor Actuator e proteger só com URL secreta

Path obscuro não é controle de acesso.

### Usar fila ilimitada

A saturação vira latência e memória acumulada.

### Habilitar compressão sem análise

Banda menor não significa risco menor.

### Definir limite sem teste de carga

Clientes legítimos podem ser quebrados.

### Copiar profile local para produção

Cookies, Keycloak e HTTP local possuem decisões diferentes.

---

## Comandos úteis

### Testes de hardening

```powershell
.\mvnw.cmd `
  -Dtest=RequestBodyLimitIntegrationTest,StrictMediaTypeIntegrationTest,HttpMethodHardeningIntegrationTest `
  test
```

### Policy de produção

```powershell
.\mvnw.cmd `
  -Dtest=ProductionHardeningPolicyTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar exposure ampla

```powershell
git grep `
  -n `
  -E `
  "exposure.*\\*|show-details: *always|forward-headers-strategy: *(framework|native)"
```

### Procurar multipart

```powershell
git grep `
  -n `
  -E `
  "multipart:|MultipartFile"
```

---

## Exercício guiado

### Parte 1 — Superfície

Liste methods, media types, endpoints e interfaces.

### Parte 2 — Limites

Defina headers, body, parameters, page e sort.

### Parte 3 — Stream

Implemente limite real sem buffer completo.

### Parte 4 — Servidor

Configure timeout, queue, keep-alive e graceful shutdown.

### Parte 5 — Proxy

Mantenha forwarded headers não confiáveis.

### Parte 6 — Management

Restrinja Actuator por porta, address e exposure.

### Parte 7 — Browser

Endureça cookie somente no fluxo de sessão.

### Parte 8 — Errors

Desabilite detalhes e páginas padrão.

### Parte 9 — Testes

Cubra limites, spoofing e profiles.

### Parte 10 — Contrato

Atualize OpenAPI, collections e baseline.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 444 foi preservada;
- matriz de limites foi criada para calibração produtiva;
- métodos e media types usam allowlist;
- TRACE e CONNECT foram bloqueados;
- `405`, `406`, `413` e `415` foram padronizados;
- headers, formulários, parâmetros e JSON possuem limites;
- JSON é contado pelos bytes lidos, inclusive chunked;
- rejeição ocorre antes do controller e sem buffer integral;
- conexões, threads, fila, keep-alive e timeouts são finitos;
- graceful shutdown foi configurado;
- compressão e HTTP/2 permanecem desabilitados;
- Server header, default servlet e static mappings foram removidos;
- forwarded headers não são confiados sem proxy aprovado;
- errors padrão não expõem detalhes;
- Actuator usa porta separada, loopback e exposure mínima;
- cookie OIDC externo usa Secure, HttpOnly e SameSite;
- API Bearer não cria sessão ou cookie;
- paginação, sort e filtros possuem allowlists e limites;
- profile produtivo é validado por policy test;
- OpenAPI, collections, threat model e OWASP foram atualizados;
- checklist de PR não foi antecipado;
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
  "exposure.*\\*|show-details: *always|server-header: *[^\"']|forward-headers-strategy: *(framework|native)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/src/main `
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
git commit -m "feat(m15): aplicar baseline de hardening da API"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- valores produtivos sem validação;
- proxy ranges reais não aprovados;
- certificados;
- cookies capturados;
- payloads gigantes;
- dump do Actuator;
- profile com secrets;
- logs de teste com tokens;
- configuração que expõe management.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API passou a possuir uma baseline explícita de hardening.

A superfície permitida ficou restrita a methods, JSON, rotas e management aprovados.

Os limites passaram a cobrir headers, body, parâmetros, conexões, threads, fila, keep-alive, paginação e sort.

O body passou a ser limitado pelos bytes lidos, mesmo sem `Content-Length`.

A infraestrutura passou a usar forwarded headers não confiáveis por padrão, Actuator em loopback, erros genéricos, Server header suprimido, shutdown gracioso e sessão somente no OIDC.

A decisão central foi:

```text
hardening é reduzir
opções, exposição
e consumo não controlado
antes do caso de uso.
```

A baseline ainda não libera produção pública: precisa de revisão, calibração, carga, alinhamento com proxy e aplicação contínua.

A próxima aula será:

```text
446 - M15.36 - Checklist seguranca em PR
```

Nela, você criará um checklist de revisão por risco, cobrindo autenticação, autorização, DTOs, logs, secrets, dependências, migrations, testes negativos e exceções com owner e expiração.

---

# Material complementar

## Checkpoint final

- [ ] Restringi métodos e media types.
- [ ] Limitei headers, parâmetros e body real.
- [ ] Configurei timeouts, queue e graceful shutdown.
- [ ] Mantive proxy e Actuator em fronteiras confiáveis.
- [ ] Testei profile produtivo e erros seguros.

---

## Troubleshooting adicional

### Body acima de 1MB ainda chega ao controller

O wrapper pode não estar sendo usado pelo message converter ou o filtro está depois do MVC.

Revise order e `getInputStream()`.

### Chunked não é bloqueado

O controle depende apenas de `Content-Length`.

Use contagem durante a leitura.

### JSON válido recebe 415

Compare `MediaType` incluindo parâmetros e charset.

Não compare string literal inteira.

### Actuator aparece na porta principal

Management pode estar usando a mesma porta.

Revise `management.server.port`.

### X-Forwarded-Proto altera HSTS em local

Existe `ForwardedHeaderFilter` ou strategy diferente de `none`.

Remova até haver proxy confiável.

### API envia JSESSIONID

A chain Bearer pode estar usando sessão ou request cache.

Revise `STATELESS`.

### Header grande retorna resposta sem Problem Details

A rejeição ocorreu antes do Spring.

Esse comportamento é esperado; valide ausência de side effects e saúde do processo.

### Shutdown encerra request em andamento

O grace period da plataforma pode ser menor que o timeout da aplicação.

Alinhe os dois.

---

## Perguntas de revisão

1. O que é hardening?
2. Hardening substitui autenticação?
3. Por que limitar methods?
4. Qual status para method inesperado?
5. Qual status para Content-Type errado?
6. Qual status para Accept incompatível?
7. Qual status para payload grande?
8. Content-Length é suficiente?
9. Form limit controla JSON?
10. Por que limitar parâmetros?
11. Por que limitar queue?
12. O que forwarded headers podem alterar?
13. Quando confiar neles?
14. Onde fica Actuator?
15. Quais endpoints ficam expostos?
16. API Bearer usa sessão?
17. Qual cookie precisa de Secure?
18. O que graceful shutdown protege?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Redução explícita de superfície e defaults.
2. Não.
3. Para remover caminhos desnecessários.
4. 405.
5. 415.
6. 406.
7. 413.
8. Não.
9. Não.
10. Para proteger parsing e recursos.
11. Para evitar saturação acumulada.
12. Scheme, host, port e IP.
13. Somente com proxy confiável.
14. Em `127.0.0.1:8082`.
15. Health e probes aprovadas.
16. Não.
17. O cookie do fluxo OIDC externo.
18. Requests em andamento e consistência.
19. Checklist seguranca em PR.
20. Revisão segura de mudanças.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 445 - M15.35 - Hardening de API

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei hardening de autenticação e correção de vulnerabilidades.
- Criei `application-hardening.yaml`.
- Criei `ApiHardeningProperties`.
- Criei uma matriz de limites.
- Restrigi métodos HTTP.
- Bloqueei TRACE e CONNECT.
- Mantive OPTIONS condicionado ao CORS.
- Restringi requests a JSON nos endpoints com body.
- Padronizei `405`, `406`, `413` e `415`.
- Configurei limite de request headers.
- Configurei limite de response headers.
- Limitei form body e parameter count.
- Desabilitei multipart sem uso.
- Criei `LimitedServletInputStream`.
- Criei `LimitedHttpServletRequest`.
- Criei `BoundedRequestBodyFilter`.
- Limitei JSON por bytes realmente lidos.
- Testei requests chunked.
- Não armazenei body completo no filtro.
- Configurei conexões, threads e fila finitas.
- Configurei connection e keep-alive timeouts.
- Limitei requests por conexão.
- Mantive compressão desabilitada.
- Mantive HTTP/2 desabilitado.
- Configurei graceful shutdown.
- Suprimi o Server header.
- Desabilitei default servlet e static mappings.
- Mantive forwarded headers sem confiança por padrão.
- Criei `M15_TRUSTED_PROXY_RUNBOOK.md`.
- Mantive URLs sensíveis independentes de Host arbitrário.
- Desabilitei detalhes e whitelabel errors.
- Mantive Actuator em `127.0.0.1:8082`.
- Usei allowlist de exposure.
- Desabilitei discovery page e shutdown.
- Mantive health details mínimos.
- Endureci cookie do OIDC externo.
- Mantive `/api/**` stateless e sem cookie.
- Limitei paginação e sort.
- Limitei filtros de texto.
- Criei testes de limits, media types, methods e forwarded headers.
- Criei testes de Actuator, cookies e graceful shutdown.
- Criei `ProductionHardeningPolicyTest`.
- Criei `M15_API_HARDENING_BASELINE.md`.
- Criei `M15_API_LIMITS_MATRIX.md`.
- Atualizei OpenAPI e collections.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Checklist seguranca em PR.
```

---

## Referência técnica curta

- [Spring Boot — Common Application Properties](https://docs.spring.io/spring-boot/appendix/application-properties/index.html)
- [Spring Boot — Embedded Web Servers](https://docs.spring.io/spring-boot/how-to/webserver.html)
- [Spring Boot — Actuator Endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)
- [Spring Security — Security HTTP Response Headers](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9112 — HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112.html)

Regra final:

```text
hardening de API exige uma superfície deliberadamente pequena e limites verificáveis: métodos e media types usam allowlist, headers, parâmetros e bodies possuem limites antes do caso de uso, JSON é contado pelos bytes realmente lidos, conexões, filas e keep-alive são finitos, forwarded headers permanecem não confiáveis sem proxy aprovado, Actuator fica em loopback com exposure mínima, cookies existem apenas no fluxo stateful com flags seguras, errors não revelam detalhes e profiles produtivos falham no build quando reativam defaults perigosos.
```
