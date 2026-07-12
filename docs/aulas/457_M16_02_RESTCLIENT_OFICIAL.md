# 457 - M16.02 - RestClient

## Apresentação da aula

Na aula 456, o Módulo 16 foi iniciado com dois sistemas separados:

```text
catalog-provider;

order-consumer.
```

O provedor publicou o contrato:

```http
GET /api/v1/products/{productCode}/availability
```

O consumidor passou a depender de uma porta:

```java
public interface ProductCatalogGateway {

    ProductAvailabilitySnapshot
    findAvailability(
            ProductCode productCode
    );
}
```

A separação foi intencional. O domínio sabe que precisa consultar uma capacidade externa, mas ainda não conhece biblioteca HTTP, base URL, headers, access token, desserialização, tradução de status ou falhas de transporte.

Nesta aula, implementaremos o primeiro adapter HTTP real do módulo:

```text
RestClientProductCatalogGateway.
```

A pergunta central será:

```text
como implementar
uma integração HTTP síncrona
com RestClient
sem acoplar o domínio
ao protocolo, à credencial
ou ao contrato externo?
```

O `RestClient` será utilizado porque o fluxo atual é:

```text
síncrono;

request-response;

bloqueante;

com resposta necessária
antes de continuar.
```

O caso de uso precisa saber se o produto está disponível antes de aceitar a ordem.

Isso não significa que toda integração deve ser síncrona.

Significa apenas que essa decisão foi tomada para o cenário atual.

A próxima aula estudará `WebClient`.

Ela permitirá comparar:

```text
cliente síncrono;

cliente não bloqueante;

modelo imperativo;

modelo reativo;

custos e benefícios.
```

Nesta aula, o foco será exclusivamente:

- construir o `RestClient`;
- configurar base URL;
- enviar `Accept`;
- enviar bearer token;
- propagar correlation ID;
- expandir URI template;
- receber o JSON;
- validar o contrato;
- mapear o DTO externo;
- traduzir status;
- proteger logs;
- testar o adapter.

Ainda não serão implementados:

```text
timeout explícito;

retry;

backoff;

circuit breaker;

bulkhead;

cache;

fallback;

OAuth2 Client Credentials automático.
```

O token continuará vindo de uma abstração:

```text
CatalogAccessTokenProvider.
```

No laboratório local, essa abstração lerá uma variável de ambiente.

Essa solução é aceitável apenas para a etapa didática atual.

Ela evita:

- token literal no YAML;
- token passado ao domínio;
- token concatenado em todos os services;
- dependência do caso de uso em OAuth.

A obtenção automatizada de credencial de serviço será evoluída em aula própria.

O adapter ficará em:

```text
order-consumer/
└── src/main/java/
    └── br/com/formacao/orderconsumer/
        └── infrastructure/http/catalog/
```

A estrutura será:

```text
CatalogClientConfiguration;

CatalogClientProperties;

CatalogAccessTokenProvider;

EnvironmentCatalogAccessTokenProvider;

CorrelationIdProvider;

RestClientProductCatalogGateway;

ProductAvailabilityHttpResponse;

ProductAvailabilityHttpMapper;

CatalogHttpErrorTranslator.
```

A regra central será:

```text
o adapter traduz
o mundo HTTP
para o mundo do consumidor.
```

Na prática:

```text
404
vira ProductNotFoundException;

401 ou 403
vira ProductCatalogAuthenticationException;

429
vira ProductCatalogRateLimitedException;

5xx
vira ProductCatalogUnavailableException;

JSON inválido
vira ProductCatalogContractException;

connection failure
vira ProductCatalogUnavailableException.
```

O domínio não precisa conhecer:

```text
HttpStatusCode;

RestClientException;

ClientHttpResponse;

HttpHeaders;

ObjectMapper;

URI template.
```

Também construiremos testes capazes de observar:

- método;
- path;
- headers;
- authorization;
- correlation;
- response mapping;
- status translation;
- contrato ausente;
- contrato malformado;
- campos inconsistentes;
- ausência de vazamento.

A aula termina quando o `order-consumer` consegue consultar o `catalog-provider` pelo adapter real e o caso de uso continua dependendo apenas de `ProductCatalogGateway`.

---

## Onde estamos na formação

A sequência oficial é:

```text
456:
Integracoes HTTP entre sistemas.

457:
RestClient.

458:
WebClient.

459:
Timeouts.

460:
Retry com criterio.
```

A aula 456 respondeu:

```text
qual contrato existe
e onde fica
a fronteira externa?
```

A aula 457 responderá:

```text
como implementar
um adapter HTTP síncrono
para essa fronteira?
```

Nesta aula:

```text
RestClient:
sim.

base URL:
sim.

headers:
sim.

bearer token:
sim.

correlation:
sim.

mapeamento:
sim.

tradução de status:
sim.

testes do adapter:
sim.

WebClient:
próxima aula.

timeout explícito:
aula 459.

retry:
aula 460.
```

A regra central será:

```text
o RestClient pertence
à infraestrutura;

o caso de uso continua
dependendo da porta.
```

---

## Objetivo prático

Ao final da aula, o `order-consumer` terá:

```text
src/main/java/
└── br/com/formacao/orderconsumer/
    ├── application/catalog/
    │   ├── ProductCatalogGateway.java
    │   ├── ProductCatalogException.java
    │   ├── ProductNotFoundException.java
    │   ├── ProductCatalogAuthenticationException.java
    │   ├── ProductCatalogRateLimitedException.java
    │   ├── ProductCatalogUnavailableException.java
    │   └── ProductCatalogContractException.java
    ├── infrastructure/http/catalog/
    │   ├── CatalogClientConfiguration.java
    │   ├── CatalogClientProperties.java
    │   ├── CatalogAccessTokenProvider.java
    │   ├── EnvironmentCatalogAccessTokenProvider.java
    │   ├── CorrelationIdProvider.java
    │   ├── ProductAvailabilityHttpResponse.java
    │   ├── ProductAvailabilityHttpMapper.java
    │   ├── CatalogHttpErrorTranslator.java
    │   └── RestClientProductCatalogGateway.java
    └── shared/observability/
        └── CurrentCorrelationIdProvider.java
```

Recursos:

```text
src/main/resources/
├── application.yaml
└── application-local.yaml
```

Testes:

```text
RestClientProductCatalogGatewayTest;

CatalogHttpErrorTranslatorTest;

ProductAvailabilityHttpMapperTest;

CatalogClientConfigurationTest;

CatalogClientSecurityTest;

RestClientIntegrationBoundaryTest.
```

Documentação:

```text
docs/
├── RESTCLIENT_DESIGN.md
├── RESTCLIENT_ERROR_TRANSLATION.md
└── RESTCLIENT_TEST_MATRIX.md
```

Você irá:

1. revisar o modelo síncrono;
2. configurar properties;
3. validar a base URL;
4. construir o RestClient;
5. criar token provider;
6. criar correlation provider;
7. criar DTO externo;
8. validar campos obrigatórios;
9. criar mapper;
10. criar translator;
11. implementar o gateway;
12. enviar headers;
13. usar URI template;
14. mapear response;
15. tratar body vazio;
16. tratar status;
17. tratar transporte;
18. testar com servidor controlado;
19. executar integração local;
20. preparar a comparação com WebClient.

---

## Conceito essencial

### RestClient é síncrono

O `RestClient` executa a request e aguarda a resposta antes de devolver o controle.

Fluxo:

```text
thread do order-consumer;

envia GET;

aguarda o provider;

recebe response;

desserializa;

continua o caso de uso.
```

Enquanto a chamada não termina, a thread permanece ocupada.

Esse comportamento é coerente com o estilo imperativo do projeto atual.

Ele também exige atenção futura a:

- connect timeout;
- read timeout;
- pool;
- concorrência;
- saturação.

Esses controles não serão escondidos nesta aula.

Eles serão implementados na aula 459.

---

### RestClient e RestTemplate

O foco atual é `RestClient`.

Não criaremos um novo `RestTemplate`.

Usaremos uma API fluente:

```java
restClient
    .get()
    .uri(
        "/api/v1/products/{code}/availability",
        code
    )
    .retrieve()
    .body(
        ProductAvailabilityHttpResponse.class
    );
```

A escolha do client não muda a arquitetura: o domínio continua dependendo de `ProductCatalogGateway`.

---

### Builder e client

O builder configura:

- base URL;
- default headers;
- message converters;
- interceptors;
- request factory;
- status handlers.

Depois do `build`, o client é reutilizado.

Não crie um novo client a cada request.

Não use um client global para todos os provedores com configurações misturadas.

Crie um client dedicado ao catálogo.

---

### Base URL

Configuração local:

```yaml
integrations:
  catalog:
    base-url: ${CATALOG_BASE_URL:http://localhost:8081}
```

A base URL não deve vir do body da request.

Ela é configuração da aplicação.

Validações:

- scheme `http` ou `https`;
- host presente;
- sem user info;
- sem query;
- sem fragment;
- sem path de endpoint específico.

O path do recurso fica no adapter.

---

### SSRF e destino controlado

Quando a aplicação aceita uma URL enviada pelo usuário e a utiliza para chamar outro sistema, pode surgir SSRF.

Nesta integração:

```text
o usuário escolhe
o product code;

a aplicação escolhe
o host do catálogo.
```

O product code entra como URI variable.

Ele não controla:

- scheme;
- host;
- porta;
- base URL.

Isso reduz o risco de chamadas arbitrárias.

---

### URI template

Use:

```java
.uri(
    "/api/v1/products/{productCode}/availability",
    productCode.value()
)
```

Não use:

```java
.uri(
    baseUrl
    + "/api/v1/products/"
    + rawInput
    + "/availability"
)
```

URI template torna a intenção clara e utiliza a infraestrutura de expansão e encoding do client.

O `ProductCode` já limita os caracteres aceitos.

---

### Header Accept

O consumidor declara:

```http
Accept: application/json
```

Isso documenta a representação esperada.

Se o provedor não conseguir produzir JSON, o contrato prevê erro.

Não use:

```text
Accept: */*
```

quando a integração depende de JSON estruturado.

---

### Content-Type em GET

Uma request GET sem body não precisa enviar:

```http
Content-Type: application/json
```

`Content-Type` descreve o body enviado.

`Accept` descreve a resposta desejada.

Misturar os dois gera contratos confusos.

---

### Bearer token

O adapter adiciona:

```java
headers.setBearerAuth(
    token
);
```

O token:

- não entra no domínio;
- não entra no DTO;
- não entra em logs;
- não entra em exception;
- não entra no correlation ID;
- não é armazenado no Git.

No laboratório, ele vem de:

```text
CATALOG_SERVICE_TOKEN.
```

---

### Token provider

Porta de infraestrutura:

```java
public interface CatalogAccessTokenProvider {

    String currentAccessToken();
}
```

Implementação local:

```java
@Component
@Profile("local")
public class EnvironmentCatalogAccessTokenProvider
        implements CatalogAccessTokenProvider {

    @Override
    public String currentAccessToken() {
        String token =
                System.getenv(
                    "CATALOG_SERVICE_TOKEN"
                );

        if (
            token == null
            || token.isBlank()
        ) {
            throw new CatalogCredentialsUnavailableException();
        }

        return token;
    }
}
```

A implementação é substituível; o gateway não precisa saber como o token foi obtido.

---

### Correlation ID

Porta:

```java
public interface CorrelationIdProvider {

    String currentOrCreate();
}
```

A implementação pode consultar o MDC atual.

Se não existir:

```text
gera UUID.
```

O adapter envia:

```http
X-Correlation-Id: <valor>
```

Não gere um correlation novo para cada integração se o fluxo já possui um.

A ideia é correlacionar toda a jornada.

---

### DTO externo

Crie:

```java
record ProductAvailabilityHttpResponse(
        String code,
        String name,
        Boolean available,
        Integer availableQuantity,
        Long version,
        Instant updatedAt
) {
}
```

Use wrappers para campos obrigatórios.

Se usar `boolean` e `int`, um campo ausente pode virar:

```text
false;

0.
```

Isso mascara uma quebra de contrato.

Com wrappers, o mapper consegue detectar ausência.

---

### Modelo interno mínimo

O DTO externo contém seis campos.

O domínio consumidor usa três:

```text
productCode;

available;

availableQuantity.
```

O mapper produz:

```java
ProductAvailabilitySnapshot.
```

Essa separação permite:

- proteger o domínio;
- validar o contrato;
- ignorar campos adicionais compatíveis;
- evitar compartilhamento de modelos;
- adaptar mudanças externas.

---

### Validação semântica

JSON válido pode ser semanticamente inválido.

Exemplos:

```text
code diferente
do solicitado;

available ausente;

quantity negativa;

available false
com quantity positiva
quando o contrato proíbe;

version ausente;

updatedAt ausente.
```

O mapper precisa validar.

Não confie apenas no Jackson.

---

### Código retornado precisa coincidir

Request:

```text
SKU-1001.
```

Response:

```text
SKU-9999.
```

Mesmo com `200`, o adapter deve falhar.

Isso pode indicar:

- cache incorreto;
- bug de roteamento;
- resposta misturada;
- contrato quebrado.

Mapeie para:

```text
ProductCatalogContractException.
```

---

### Status handlers

Por padrão, respostas `4xx` e `5xx` geram exceptions do client.

Nesta integração, o adapter precisa de exceptions de aplicação.

Crie um translator dedicado.

Mapeamento:

```text
404:
ProductNotFoundException.

401:
ProductCatalogAuthenticationException.

403:
ProductCatalogAuthenticationException
com reason diferente.

429:
ProductCatalogRateLimitedException.

500, 502, 503, 504:
ProductCatalogUnavailableException.

outros 4xx:
ProductCatalogContractException.

outros 5xx:
ProductCatalogUnavailableException.
```

Não inclua body remoto na mensagem pública.

---

### 401 e 403 do provedor

Para o consumidor, `401` ou `403` não significa que o usuário da ordem deve fazer login.

Significa que a integração entre sistemas está mal autenticada ou mal autorizada.

Portanto, traduza para uma categoria interna de integração.

Não devolva automaticamente o mesmo status ao caller externo sem uma decisão do caso de uso.

---

### 404

O catálogo informa que o produto não existe.

Isso é uma condição de negócio conhecida.

O adapter traduz:

```text
HTTP 404;

ProductNotFoundException.
```

O caso de uso decide:

```text
a ordem não pode continuar.
```

---

### 429

`429` indica que o provedor aplicou rate limiting.

O adapter pode capturar:

```text
Retry-After.
```

Nesta aula, ele cria:

```text
ProductCatalogRateLimitedException.
```

Não implementaremos espera ou retry.

---

### 5xx

Um `5xx` indica falha no provedor ou em sua infraestrutura.

O consumidor não deve interpretar como produto inexistente.

Tradução:

```text
ProductCatalogUnavailableException.
```

A indisponibilidade será tratada sem retry automático nesta etapa.

---

### Falha de transporte

Exemplos:

- connection refused;
- DNS;
- socket;
- interrupção;
- TLS;
- I/O.

Mapeie para:

```text
ProductCatalogUnavailableException.
```

Não coloque `exception.getMessage()` em Problem Details.

Logs técnicos devem usar:

- event;
- provider;
- outcome;
- reason code;
- correlation.

---

### Erro de desserialização

Se o provedor retorna JSON incompatível, a falha é de contrato.

Exemplo:

```json
{
  "availableQuantity": "vinte"
}
```

Tradução:

```text
ProductCatalogContractException.
```

Não confunda com indisponibilidade.

O provider respondeu.

O conteúdo não respeitou o contrato.

---

### Body vazio

Um `200` sem body é inválido para este endpoint.

O adapter deve rejeitar:

```text
ProductCatalogContractException.
```

Não crie um snapshot com defaults.

---

### retrieve e exchange

`retrieve()` é adequado quando:

- queremos converter o body;
- status handlers estão configurados;
- o fluxo é direto.

`exchange()` oferece controle completo da request e response.

Nesta aula, utilizaremos:

```text
retrieve + status handlers.
```

A escolha fica explícita.

Não misture as duas abordagens sem necessidade.

---

### Logging

Log permitido:

```text
event=catalog_availability_call;

provider=catalog-provider;

outcome=success|failure;

reason_code;

route_template;

correlation_id;

duration_bucket futuro.
```

Log proibido:

- token;
- response body completo;
- headers completos;
- URL com query sensível;
- exception remota completa em response;
- environment value.

---

### Testes do client

O adapter precisa ser testado sem depender do catálogo real em todos os cenários.

Utilizaremos:

```text
MockRestServiceServer
ligado ao RestClient.Builder.
```

Ele permite verificar:

- request;
- path;
- method;
- headers;
- response;
- status;
- body.

A integração manual com o provider continua validando o fluxo real local.

---

### Limite dos mocks

Um mock de client não comprova:

- DNS;
- conexão real;
- TLS;
- pool;
- timeout;
- socket;
- comportamento do servidor real.

Essas evidências serão ampliadas nas próximas aulas.

Não trate o teste do adapter como prova completa de transporte.

---

## Mão na massa guiada

### 1. Continuar o laboratório

Entre em:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer
```

Crie os packages:

```text
application/catalog;

infrastructure/http/catalog;

shared/observability.
```

---

### 2. Criar CatalogClientProperties

```java
@ConfigurationProperties(
    prefix = "integrations.catalog"
)
public record CatalogClientProperties(
        URI baseUrl
) {
    public CatalogClientProperties {
        Objects.requireNonNull(
                baseUrl
        );

        String scheme =
                baseUrl.getScheme();

        if (
            !"http".equalsIgnoreCase(
                scheme
            )
            && !"https".equalsIgnoreCase(
                scheme
            )
        ) {
            throw new IllegalArgumentException(
                "Catalog base URL scheme is invalid"
            );
        }

        if (
            baseUrl.getHost() == null
            || baseUrl.getUserInfo() != null
            || baseUrl.getQuery() != null
            || baseUrl.getFragment() != null
        ) {
            throw new IllegalArgumentException(
                "Catalog base URL is invalid"
            );
        }
    }
}
```

Não inclua token nas properties.

---

### 3. Configurar application-local.yaml

```yaml
integrations:
  catalog:
    base-url: ${CATALOG_BASE_URL:http://localhost:8081}
```

O token permanece fora do YAML.

---

### 4. Habilitar properties

Na configuration:

```java
@Configuration
@EnableConfigurationProperties(
    CatalogClientProperties.class
)
public class CatalogClientConfiguration {
}
```

---

### 5. Criar o translator

```java
@Component
public class CatalogHttpErrorTranslator {

    public void handle(
            HttpRequest request,
            ClientHttpResponse response
    ) throws IOException {
        HttpStatusCode status =
                response.getStatusCode();

        if (
            status.value() == 404
        ) {
            throw new ProductNotFoundException();
        }

        if (
            status.value() == 401
            || status.value() == 403
        ) {
            throw new ProductCatalogAuthenticationException(
                    status.value()
            );
        }

        if (
            status.value() == 429
        ) {
            throw new ProductCatalogRateLimitedException(
                    retryAfter(
                        response.getHeaders()
                    )
            );
        }

        if (
            status.is5xxServerError()
        ) {
            throw new ProductCatalogUnavailableException();
        }

        throw new ProductCatalogContractException(
                "Unexpected catalog status"
        );
    }
}
```

A exception pública não recebe body remoto.

---

### 6. Criar RestClient dedicado

```java
@Bean
RestClient catalogRestClient(
        RestClient.Builder builder,
        CatalogClientProperties properties,
        CatalogHttpErrorTranslator errorTranslator
) {
    return builder
            .baseUrl(
                properties.baseUrl()
                          .toString()
            )
            .defaultHeader(
                HttpHeaders.ACCEPT,
                MediaType.APPLICATION_JSON_VALUE
            )
            .defaultStatusHandler(
                HttpStatusCode::isError,
                errorTranslator::handle
            )
            .build();
}
```

Não configure timeout ainda.

Registre essa limitação.

---

### 7. Criar token provider

```java
public interface CatalogAccessTokenProvider {

    String currentAccessToken();
}
```

Implementação local:

```java
@Component
@Profile("local")
public class EnvironmentCatalogAccessTokenProvider
        implements CatalogAccessTokenProvider {

    @Override
    public String currentAccessToken() {
        String token =
                System.getenv(
                    "CATALOG_SERVICE_TOKEN"
                );

        if (
            token == null
            || token.isBlank()
        ) {
            throw new CatalogCredentialsUnavailableException();
        }

        return token;
    }
}
```

---

### 8. Criar provider para testes

Em testes, use:

```java
final class FixedCatalogAccessTokenProvider
        implements CatalogAccessTokenProvider {

    private final String token;

    FixedCatalogAccessTokenProvider(
            String token
    ) {
        this.token = token;
    }

    @Override
    public String currentAccessToken() {
        return token;
    }
}
```

O valor é sintético.

---

### 9. Criar CorrelationIdProvider

```java
public interface CorrelationIdProvider {

    String currentOrCreate();
}
```

Implementação:

```java
@Component
public class CurrentCorrelationIdProvider
        implements CorrelationIdProvider {

    @Override
    public String currentOrCreate() {
        String current =
                MDC.get(
                    "correlation_id"
                );

        if (
            current != null
            && !current.isBlank()
        ) {
            return current;
        }

        return UUID.randomUUID()
                   .toString();
    }
}
```

---

### 10. Criar DTO externo

```java
record ProductAvailabilityHttpResponse(
        String code,
        String name,
        Boolean available,
        Integer availableQuantity,
        Long version,
        Instant updatedAt
) {
}
```

Mantenha package-private se apenas o adapter usa.

---

### 11. Criar mapper

```java
@Component
class ProductAvailabilityHttpMapper {

    ProductAvailabilitySnapshot toSnapshot(
            ProductCode requestedCode,
            ProductAvailabilityHttpResponse response
    ) {
        if (response == null) {
            throw new ProductCatalogContractException(
                    "Catalog response body is required"
            );
        }

        if (
            response.code() == null
            || response.available() == null
            || response.availableQuantity() == null
            || response.version() == null
            || response.updatedAt() == null
        ) {
            throw new ProductCatalogContractException(
                    "Catalog response is incomplete"
            );
        }

        if (
            !requestedCode.value()
                          .equals(
                              response.code()
                          )
        ) {
            throw new ProductCatalogContractException(
                    "Catalog response code mismatch"
            );
        }

        if (
            response.availableQuantity() < 0
        ) {
            throw new ProductCatalogContractException(
                    "Catalog quantity is invalid"
            );
        }

        return new ProductAvailabilitySnapshot(
                requestedCode,
                response.available(),
                response.availableQuantity()
        );
    }
}
```

Mensagens são internas e não devem ser devolvidas diretamente.

---

### 12. Criar exceptions base

```java
public abstract class ProductCatalogException
        extends RuntimeException {

    protected ProductCatalogException(
            String message
    ) {
        super(
            message
        );
    }
}
```

Subclasses representam categorias estáveis.

---

### 13. Criar rate limited exception

```java
public final class ProductCatalogRateLimitedException
        extends ProductCatalogException {

    private final Optional<Duration> retryAfter;

    public ProductCatalogRateLimitedException(
            Optional<Duration> retryAfter
    ) {
        super(
            "Product catalog rate limit exceeded"
        );

        this.retryAfter =
                retryAfter;
    }

    public Optional<Duration> retryAfter() {
        return retryAfter;
    }
}
```

Não espere automaticamente.

---

### 14. Criar o adapter

```java
@Component
public class RestClientProductCatalogGateway
        implements ProductCatalogGateway {

    private static final String
            CORRELATION_HEADER =
                "X-Correlation-Id";

    private final RestClient restClient;
    private final CatalogAccessTokenProvider tokenProvider;
    private final CorrelationIdProvider correlationIdProvider;
    private final ProductAvailabilityHttpMapper mapper;

    public RestClientProductCatalogGateway(
            RestClient restClient,
            CatalogAccessTokenProvider tokenProvider,
            CorrelationIdProvider correlationIdProvider,
            ProductAvailabilityHttpMapper mapper
    ) {
        this.restClient =
                restClient;

        this.tokenProvider =
                tokenProvider;

        this.correlationIdProvider =
                correlationIdProvider;

        this.mapper =
                mapper;
    }

    @Override
    public ProductAvailabilitySnapshot findAvailability(
            ProductCode productCode
    ) {
        String accessToken =
                tokenProvider
                    .currentAccessToken();

        String correlationId =
                correlationIdProvider
                    .currentOrCreate();

        try {
            ProductAvailabilityHttpResponse response =
                    restClient
                        .get()
                        .uri(
                            "/api/v1/products/{productCode}/availability",
                            productCode.value()
                        )
                        .headers(
                            headers -> {
                                headers.setBearerAuth(
                                    accessToken
                                );

                                headers.set(
                                    CORRELATION_HEADER,
                                    correlationId
                                );
                            }
                        )
                        .retrieve()
                        .body(
                            ProductAvailabilityHttpResponse.class
                        );

            return mapper.toSnapshot(
                    productCode,
                    response
            );
        }
        catch (
            ProductCatalogException exception
        ) {
            throw exception;
        }
        catch (
            ResourceAccessException exception
        ) {
            throw new ProductCatalogUnavailableException();
        }
        catch (
            RestClientException exception
        ) {
            throw new ProductCatalogContractException(
                    "Catalog response could not be processed"
            );
        }
    }
}
```

A ordem dos catches importa.

---

### 15. Não logar o token

Evite:

```java
log.info(
    "Calling catalog with token {}",
    accessToken
);
```

Use:

```java
log.info(
    "event=catalog_availability_call "
    + "outcome=started "
    + "route=/api/v1/products/{productCode}/availability "
    + "correlation_id={}",
    correlationId
);
```

Mesmo o código do produto pode exigir classificação.

No laboratório, ele é interno e sintético.

---

### 16. Criar teste base do adapter

Use:

```java
RestClient.Builder builder =
        RestClient.builder();

MockRestServiceServer server =
        MockRestServiceServer
            .bindTo(
                builder
            )
            .build();
```

Depois construa o client com a mesma configuration usada pela aplicação.

---

### 17. Testar request correta

Expectativas:

```java
server.expect(
        requestTo(
            "http://catalog.test"
            + "/api/v1/products/SKU-1001/availability"
        )
)
.andExpect(
    method(
        HttpMethod.GET
    )
)
.andExpect(
    header(
        HttpHeaders.ACCEPT,
        MediaType.APPLICATION_JSON_VALUE
    )
)
.andExpect(
    header(
        HttpHeaders.AUTHORIZATION,
        "Bearer token-test-sentinel"
    )
)
.andExpect(
    header(
        "X-Correlation-Id",
        "corr-test-457"
    )
);
```

Retorne JSON válido.

---

### 18. Validar o snapshot

Response externa:

```json
{
  "code": "SKU-1001",
  "name": "Teclado mecanico",
  "available": true,
  "availableQuantity": 25,
  "version": 7,
  "updatedAt": "2026-07-12T03:00:00Z"
}
```

Snapshot interno:

```text
SKU-1001;

true;

25.
```

`name`, `version` e `updatedAt` não vazam para o caso de uso.

---

### 19. Testar campo adicional

Retorne:

```json
{
  "code": "SKU-1001",
  "name": "Teclado mecanico",
  "available": true,
  "availableQuantity": 25,
  "version": 7,
  "updatedAt": "2026-07-12T03:00:00Z",
  "warehouse": "SP-01"
}
```

O client pode ignorar `warehouse` se a política de DTO externo permitir compatibilidade aditiva.

Não configure desconhecidos como erro nesta fronteira sem decisão de contrato.

Isso difere dos request DTOs internos controlados pela nossa API.

---

### 20. Testar 404

Response:

```text
404 application/problem+json.
```

Esperado:

```text
ProductNotFoundException.
```

O body do Problem Details não precisa ser propagado.

---

### 21. Testar 401

Esperado:

```text
ProductCatalogAuthenticationException.
```

Reason interno:

```text
CATALOG_AUTHENTICATION_FAILED.
```

Não devolva o token ou o body remoto.

---

### 22. Testar 403

Esperado:

```text
ProductCatalogAuthenticationException.
```

Reason:

```text
CATALOG_PERMISSION_DENIED.
```

Diferencie internamente para diagnóstico seguro.

---

### 23. Testar 429

Headers:

```text
Retry-After: 30.
```

Esperado:

```text
ProductCatalogRateLimitedException;

retryAfter:
30 segundos.
```

Nenhum retry ocorre.

---

### 24. Testar 503

Esperado:

```text
ProductCatalogUnavailableException.
```

O caso de uso recebe uma categoria estável.

---

### 25. Testar status inesperado

Exemplo:

```text
409.
```

O contrato não prevê esse status para o GET.

Esperado:

```text
ProductCatalogContractException.
```

---

### 26. Testar body vazio

Response:

```text
200;

sem body.
```

Esperado:

```text
ProductCatalogContractException.
```

---

### 27. Testar JSON inválido

Response:

```json
{
  "availableQuantity": "vinte"
}
```

Esperado:

```text
ProductCatalogContractException.
```

---

### 28. Testar campo obrigatório ausente

Remova:

```text
available.
```

Esperado:

```text
ProductCatalogContractException.
```

O uso de `Boolean` permite detectar ausência.

---

### 29. Testar code mismatch

Request:

```text
SKU-1001.
```

Response:

```text
SKU-9999.
```

Esperado:

```text
ProductCatalogContractException.
```

---

### 30. Testar quantidade negativa

Response:

```text
availableQuantity:
-1.
```

Esperado:

```text
ProductCatalogContractException.
```

---

### 31. Testar ausência de token

O token provider lança:

```text
CatalogCredentialsUnavailableException.
```

Verifique:

```text
nenhuma request foi enviada.
```

---

### 32. Testar correlation existente

Coloque:

```text
corr-existing-457
```

no provider de teste.

Confirme que o mesmo valor foi enviado.

---

### 33. Testar geração de correlation

Sem valor atual, o provider gera UUID.

Valide apenas formato e presença.

Não fixe implementação aleatória sem injetar gerador quando determinismo for necessário.

---

### 34. Criar security sentinel test

Sentinelas:

```text
token-test-sentinel;

catalog-body-secret-sentinel;

remote-error-secret-sentinel.
```

Capture logs durante:

- sucesso;
- `401`;
- `403`;
- `429`;
- `503`;
- JSON inválido.

Nenhuma sentinela aparece.

O token sintético pode aparecer na expectation interna do teste, mas não na saída capturada.

---

### 35. Criar boundary test

Falhe se:

- application importar `RestClient`;
- domain importar `HttpHeaders`;
- service receber token;
- gateway receber base URL;
- DTO HTTP sair do package de infraestrutura;
- controller construir o client;
- client for criado por request.

---

### 36. Criar configuration test

Valide:

- base URL válida;
- scheme inválido falha;
- user info falha;
- query na base falha;
- fragment falha;
- client dedicado existe;
- Accept default é JSON;
- status handler está ativo.

---

### 37. Atualizar o caso de uso

Nenhuma alteração estrutural deve ser necessária.

Ele já depende de:

```text
ProductCatalogGateway.
```

Ao iniciar a aplicação com o adapter real, o Spring injeta:

```text
RestClientProductCatalogGateway.
```

Isso comprova o valor da porta.

---

### 38. Preparar profile local

No ambiente local:

```powershell
$env:CATALOG_BASE_URL =
  "http://localhost:8081"

$env:CATALOG_SERVICE_TOKEN =
  "<token-local>"
```

Não copie o token para o terminal compartilhado ou documentação.

---

### 39. Executar o provider

Terminal 1:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

---

### 40. Executar o consumer

Terminal 2:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

Defina uma porta diferente, por exemplo:

```text
8080.
```

---

### 41. Criar endpoint local de demonstração

O consumer pode expor:

```text
POST /api/v1/order-validations
```

Request:

```json
{
  "productCode": "SKU-1001",
  "quantity": 2
}
```

O controller chama:

```text
ValidateProductForOrderService.
```

Essa rota é apenas uma entrada para demonstrar o fluxo.

Mantenha DTO e validação.

---

### 42. Executar o fluxo integrado

Request ao consumer.

Fluxo esperado:

```text
consumer recebe;

gateway chama provider;

provider valida token;

provider retorna JSON;

adapter valida contrato;

mapper cria snapshot;

service aceita a quantidade;

consumer responde.
```

---

### 43. Parar o provider

Com o provider desligado, execute novamente.

Esperado:

```text
ProductCatalogUnavailableException.
```

A resposta pública do consumer deve ser segura.

Ainda não existe timeout explícito ou retry.

Connection refused normalmente falha rápido, mas não use isso como substituto de timeout.

---

### 44. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=RestClientProductCatalogGatewayTest,CatalogHttpErrorTranslatorTest,ProductAvailabilityHttpMapperTest,CatalogClientConfigurationTest,CatalogClientSecurityTest,RestClientIntegrationBoundaryTest `
  test
```

---

### 45. Executar regressão do consumer

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- domínio;
- fake;
- gateway;
- adapter;
- security;
- contracts;
- logs;
- boundaries.

---

### 46. Atualizar documentação

Arquivo:

```text
docs/RESTCLIENT_DESIGN.md
```

Inclua:

- por que RestClient;
- sync/blocking;
- packages;
- port e adapter;
- base URL;
- token provider;
- correlation;
- DTO externo;
- mapper;
- errors;
- limits;
- próximos passos.

---

### 47. Criar matriz de tradução

Arquivo:

```text
docs/RESTCLIENT_ERROR_TRANSLATION.md
```

| Origem | Tradução |
|---|---|
| 404 | ProductNotFound |
| 401 | CatalogAuthentication |
| 403 | CatalogPermissionDenied |
| 429 | CatalogRateLimited |
| 5xx | CatalogUnavailable |
| connection | CatalogUnavailable |
| invalid JSON | CatalogContract |
| empty body | CatalogContract |
| code mismatch | CatalogContract |

---

### 48. Registrar limitações

No README:

```text
sem timeout explícito;

sem retry;

sem pool tuning;

sem circuit breaker;

sem OAuth2 Client Credentials automático;

HTTP local sem TLS;

produção pública:
NO-GO.
```

---

## Entendendo o que foi feito

### A porta recebeu um adapter real

O domínio não precisou mudar.

### O client ficou dedicado ao provedor

Base URL, headers e errors não foram misturados com outras integrações.

### O token ficou na infraestrutura

O service e o domínio não conhecem credenciais.

### O correlation ID atravessou a fronteira

A jornada pode ser rastreada entre consumer e provider.

### O contrato foi validado além do JSON

Campos obrigatórios, código e quantidade foram verificados.

### Status foram traduzidos

O caso de uso recebe categorias estáveis, não detalhes HTTP.

### Testes observaram a request

Método, URI, headers e body foram validados.

### Limites permaneceram explícitos

Timeout e retry ainda não existem e não foram simulados.

---

## Erros comuns importantes

### Criar RestClient dentro do método

Connections, configuração e testes ficam prejudicados.

### Passar token ao service

Credencial vaza para o domínio.

### Usar base URL do request do usuário

Abre risco de SSRF.

### Concatenar URI com input raw

Encoding e validação ficam frágeis.

### Usar primitives no DTO externo

Campo ausente pode virar default silencioso.

### Mapear todo erro para indisponibilidade

`404`, contrato inválido e `401` perdem significado.

### Propagar body remoto

O provider pode expor internals.

### Implementar retry em onStatus

A política fica improvisada e sem controle.

### Ignorar body vazio

O domínio recebe informação falsa.

### Considerar mock como prova de transporte

DNS, TLS e timeout continuam sem evidência.

---

## Comandos úteis

### Testes do adapter

```powershell
.\mvnw.cmd `
  -Dtest=RestClientProductCatalogGatewayTest,CatalogHttpErrorTranslatorTest,ProductAvailabilityHttpMapperTest `
  test
```

### Testes de segurança e boundaries

```powershell
.\mvnw.cmd `
  -Dtest=CatalogClientConfigurationTest,CatalogClientSecurityTest,RestClientIntegrationBoundaryTest `
  test
```

### Executar consumer

```powershell
$env:CATALOG_BASE_URL =
  "http://localhost:8081"

$env:CATALOG_SERVICE_TOKEN =
  "<token-local>"

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Configuração

Crie properties e RestClient dedicado.

### Parte 2 — Credencial

Crie token provider substituível.

### Parte 3 — Observabilidade

Propague correlation ID.

### Parte 4 — Contrato

Crie DTO HTTP com wrappers.

### Parte 5 — Mapper

Valide campos e produza snapshot.

### Parte 6 — Errors

Traduza status e transporte.

### Parte 7 — Gateway

Implemente a porta.

### Parte 8 — Testes

Valide request, response e falhas.

### Parte 9 — Integração

Execute consumer e provider.

### Parte 10 — Limitações

Registre timeout, retry e OAuth pendentes.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 456 foi preservada;
- `RestClient` foi usado como client síncrono;
- `WebClient` não foi antecipado;
- timeout explícito não foi antecipado;
- retry não foi antecipado;
- client dedicado ao catálogo foi criado;
- base URL é configurável e validada;
- base URL não vem do usuário;
- URI template foi usado;
- `Accept: application/json` foi configurado;
- GET não envia Content-Type sem body;
- bearer token é adicionado por infraestrutura;
- token provider foi abstraído;
- token não foi salvo no YAML;
- correlation ID foi propagado;
- DTO externo usa wrappers em campos obrigatórios;
- modelo interno permanece mínimo;
- mapper valida body, fields, code e quantity;
- `404` vira ProductNotFound;
- `401` e `403` viram falhas de integração seguras;
- `429` preserva Retry-After sem retry automático;
- `5xx` vira indisponibilidade;
- falha de transporte vira indisponibilidade;
- JSON inválido vira contract exception;
- body vazio vira contract exception;
- response code mismatch é rejeitado;
- logs não contêm token ou body remoto;
- `MockRestServiceServer` foi ligado ao builder;
- método, URI e headers foram testados;
- security sentinel test foi criado;
- boundary test mantém HTTP fora do domínio;
- configuration test foi criado;
- consumer continuou dependendo de ProductCatalogGateway;
- fluxo local provider-consumer foi executado;
- provider desligado foi exercitado;
- documentação e matriz de tradução foram criadas;
- limitações foram registradas;
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
git diff --stat

git grep `
  -n `
  -E `
  "CATALOG_SERVICE_TOKEN:|Bearer ey|log\\..*token|new RestClient|RestClient\\.create\\("
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/docs `
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
git commit -m "feat(m16): integrar catalogo com RestClient"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access token;
- client secret;
- `.env`;
- log de response;
- body remoto;
- config produtiva;
- timeout improvisado;
- retry;
- WebClient;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a porta:

```text
ProductCatalogGateway
```

recebeu sua primeira implementação real:

```text
RestClientProductCatalogGateway.
```

O fluxo passou a ser:

```text
ValidateProductForOrderService;

ProductCatalogGateway;

RestClient adapter;

HTTP GET;

catalog-provider;

JSON;

mapper;

ProductAvailabilitySnapshot.
```

O adapter ficou responsável por base URL, URI, headers, bearer token, correlation ID, DTO externo, desserialização, status, transporte e tradução de contrato.

O domínio continuou responsável por:

- disponibilidade;
- quantidade;
- decisão da ordem.

A principal decisão foi:

```text
o client HTTP
não define o domínio;

ele implementa
uma porta já definida.
```

Também ficou claro que `RestClient` é adequado para o fluxo imperativo atual, mas sua natureza síncrona precisa ser comparada com alternativas.

A próxima aula será:

```text
458 - M16.03 - WebClient
```

Nela, você irá:

- criar um adapter equivalente com `WebClient`;
- compreender `Mono`;
- comparar blocking e non-blocking;
- configurar base URL e headers;
- mapear status e body;
- testar com servidor controlado;
- discutir quando usar ou evitar `.block()`;
- comparar complexidade, throughput e modelo de execução;
- manter timeout e retry para as aulas específicas seguintes.

---

# Material complementar

## Checkpoint final

- [ ] Criei RestClient dedicado ao catálogo.
- [ ] Mantive token e HTTP fora do domínio.
- [ ] Validei e mapeei o contrato externo.
- [ ] Traduzi status e falhas.
- [ ] Testei headers, responses e vazamentos.

---

## Troubleshooting adicional

### RestClient bean não é encontrado

Confirme package scanning e `CatalogClientConfiguration`.

### Base URL falha no startup

Verifique scheme, host, user info, query e fragment.

### Request retorna 401

Confirme token, issuer, audience e expiração.

### Request retorna 403

Confirme `catalog:availability:read`.

### Correlation ID não chega

Confirme o provider e o header `X-Correlation-Id`.

### 404 vira RestClientResponseException

O status handler não foi registrado no client usado.

### JSON inválido vira indisponibilidade

O catch está amplo ou na ordem errada.

### Teste não captura o client

O `MockRestServiceServer` precisa ser ligado ao mesmo builder.

### Token aparece no log de teste

A failure message ou request dump pode estar imprimindo headers.

### Chamada pode travar

Timeout ainda não foi configurado; isso será corrigido na aula 459.

---

## Perguntas de revisão

1. RestClient é síncrono ou reativo?
2. Onde o RestClient deve ficar?
3. O domínio conhece a base URL?
4. A URL pode vir do usuário?
5. Por que usar URI template?
6. O que Accept descreve?
7. GET sem body precisa de Content-Type?
8. Onde fica o bearer token?
9. O que o token provider permite?
10. Por que usar wrappers no DTO externo?
11. O que ocorre com body vazio?
12. O que ocorre com code mismatch?
13. Como traduzir 404?
14. Como traduzir 5xx?
15. Como traduzir JSON inválido?
16. 429 executa retry nesta aula?
17. Mock prova TLS e timeout?
18. O caso de uso mudou?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Síncrono.
2. No adapter de infraestrutura.
3. Não.
4. Não.
5. Para expansão e encoding controlados.
6. A representação esperada.
7. Não.
8. Na infraestrutura.
9. Trocar a obtenção da credencial.
10. Detectar campos ausentes.
11. Contract exception.
12. Contract exception.
13. ProductNotFound.
14. CatalogUnavailable.
15. CatalogContract.
16. Não.
17. Não.
18. Não.
19. WebClient.
20. Adapter não bloqueante e comparação.

---

## Desafio opcional

Crie um segundo adapter:

```text
RestClientProductPriceGateway.
```

Antes de codificar, reutilize apenas abstrações realmente comuns:

- correlation provider;
- token provider quando a audience e credencial forem iguais;
- Problem Details remoto apenas como contrato interno;
- padrões de teste.

Não crie uma classe genérica universal de integrações.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 457 - M16.02 - RestClient

- Implementei o primeiro adapter HTTP real do Módulo 16.
- Revisei o modelo síncrono e bloqueante.
- Mantive `ProductCatalogGateway` como porta do consumidor.
- Criei `CatalogClientProperties`.
- Validei a base URL.
- Mantive a base URL fora do input do usuário.
- Criei `CatalogClientConfiguration`.
- Criei um `RestClient` dedicado ao catálogo.
- Configurei `Accept: application/json`.
- Usei URI template.
- Criei `CatalogAccessTokenProvider`.
- Criei provider local baseado em environment.
- Mantive o token fora do YAML e do domínio.
- Criei `CorrelationIdProvider`.
- Propaguei `X-Correlation-Id`.
- Criei `ProductAvailabilityHttpResponse`.
- Usei wrappers para detectar campos ausentes.
- Criei `ProductAvailabilityHttpMapper`.
- Validei body vazio.
- Validei fields obrigatórios.
- Validei code mismatch.
- Validei quantity negativa.
- Criei `CatalogHttpErrorTranslator`.
- Traduzi `404` para ProductNotFound.
- Traduzi `401` e `403` para falhas de integração.
- Traduzi `429` e preservei Retry-After.
- Traduzi `5xx` para indisponibilidade.
- Traduzi falha de transporte.
- Traduzi JSON inválido para contract exception.
- Criei `RestClientProductCatalogGateway`.
- Mantive HTTP e status fora do domínio.
- Criei testes com `MockRestServiceServer`.
- Validei método, URI, Accept, Authorization e correlation.
- Testei body adicional compatível.
- Testei body vazio e JSON inválido.
- Testei ausência de token.
- Criei security sentinel test.
- Criei boundary test.
- Criei configuration test.
- Executei o fluxo local entre consumer e provider.
- Testei provider desligado.
- Documentei a matriz de tradução.
- Não antecipei WebClient, timeout ou retry.
- Mantive produção pública como NO-GO.
- Próxima aula: WebClient.
```

---

## Referência técnica curta

- [Spring Framework — REST Clients](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
- [Spring Framework — RestClient.Builder](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestClient.Builder.html)
- [Spring Framework — MockRestServiceServer](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/test/web/client/MockRestServiceServer.html)
- [Spring Framework — Testing Client Applications](https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-client.html)
- [Spring Security — OAuth 2.0 Client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 6750 — Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html)
- [OWASP Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

Regra final:

```text
uma integração com RestClient deve manter a arquitetura orientada por portas: o client síncrono é configurado uma vez para um provedor conhecido, a base URL é controlada pela aplicação, URI templates recebem valores validados, headers de representação, autenticação e correlação pertencem à infraestrutura, DTOs externos preservam ausência e incompatibilidade de campos, o mapper produz um modelo interno mínimo, status, transporte e desserialização são traduzidos para categorias estáveis e testes verificam request, response, side effects e ausência de credenciais, sem antecipar timeout, retry ou o modelo reativo da próxima aula.
```
