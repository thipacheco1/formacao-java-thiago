# 458 - M16.03 - WebClient

## Apresentação da aula

Na aula 457, o `order-consumer` recebeu um adapter HTTP síncrono:

```text
RestClientProductCatalogGateway.
```

O fluxo ficou:

```text
thread do consumidor;

RestClient;

request HTTP;

espera bloqueante;

response;

mapper;

ProductAvailabilitySnapshot.
```

Essa implementação é adequada para um caso de uso imperativo quando:

- a equipe deseja um modelo simples;
- cada request pode ocupar uma thread;
- o volume é compatível com a infraestrutura;
- a cadeia de dependências é predominantemente bloqueante;
- o benefício de um pipeline reativo não compensa a complexidade.

Agora estudaremos uma alternativa:

```text
WebClient.
```

O `WebClient` oferece uma API funcional baseada em Reactor para compor chamadas HTTP assíncronas e não bloqueantes.

A pergunta central desta aula será:

```text
como implementar
a mesma integração de catálogo
com WebClient
sem introduzir bloqueios,
subscriptions manuais
ou abstrações reativas
pela metade?
```

Essa última parte é importante.

Adicionar `WebClient` e terminar com:

```java
webClient
    .get()
    .retrieve()
    .bodyToMono(...)
    .block();
```

não transforma automaticamente uma aplicação em reativa.

O `.block()` interrompe o pipeline e faz a thread esperar.

Ele pode ser uma ponte deliberada em uma fronteira imperativa cuidadosamente controlada, mas não será usado no código principal desta aula.

Também não usaremos:

```java
mono.subscribe();
```

dentro de controllers ou services.

O framework deve realizar a subscription.

Quando a aplicação chama `subscribe()` manualmente, ela normalmente perde:

- propagação natural de erro;
- cancelamento;
- contexto;
- composição;
- controle do lifecycle;
- resposta correta para o caller.

Para tornar a comparação honesta, não alteraremos o projeto imperativo da aula 457.

Criaremos um terceiro projeto:

```text
order-consumer-reactive.
```

A estrutura do laboratório ficará:

```text
labs/m16/aula-456-integracoes-http-entre-sistemas/
├── catalog-provider
├── order-consumer
└── order-consumer-reactive
```

Assim poderemos comparar:

```text
order-consumer:
RestClient + fluxo imperativo.

order-consumer-reactive:
WebClient + fluxo reativo.
```

O domínio continuará protegido por uma porta.

Porém, a porta reativa terá assinatura coerente com o modelo:

```java
public interface ReactiveProductCatalogGateway {

    Mono<ProductAvailabilitySnapshot>
    findAvailability(
            ProductCode productCode
    );
}
```

O caso de uso também retornará `Mono`.

O controller retornará `Mono`.

A chamada HTTP permanecerá dentro do pipeline.

Nenhuma camada fará `.block()` para converter o resultado em objeto imediato.

O projeto utilizará:

```text
Spring WebFlux;

Project Reactor;

Reactor Netty;

WebClient;

StepVerifier.
```

A aula revisará:

- `Publisher`;
- `Subscriber`;
- subscription;
- `Mono`;
- `Flux`;
- lazy execution;
- operators;
- Reactor Context;
- error signals;
- cancelamento;
- backpressure;
- event loop;
- blocking acidental.

O foco prático continuará sendo o contrato já conhecido:

```http
GET /api/v1/products/{productCode}/availability
```

O adapter reativo será:

```text
WebClientProductCatalogGateway.
```

Ele será responsável por:

- base URL;
- URI template;
- `Accept`;
- bearer token;
- correlation ID;
- status;
- body;
- DTO externo;
- validação semântica;
- tradução de falhas.

A aula ainda não implementará:

```text
timeout;

retry;

backoff;

circuit breaker;

cache;

fallback;

OAuth2 Client Credentials automático.
```

Timeout será a aula 459.

Retry com backoff será a aula 460.

A comparação desta aula precisa ser justa.

Não diremos:

```text
WebClient é sempre melhor.
```

Também não diremos:

```text
RestClient é ultrapassado.
```

A decisão depende de:

- modelo da aplicação;
- dependências;
- volume;
- latência;
- capacidade da equipe;
- observabilidade;
- necessidade de streaming;
- custo de operação;
- compatibilidade com bibliotecas bloqueantes.

Ao final, você deverá conseguir responder:

```text
quando manter RestClient;

quando escolher WebClient;

por que um fluxo reativo
precisa permanecer reativo;

por que Mono não é
o valor em si;

por que backpressure
não substitui rate limiting;

por que .block()
não deve ser escondido.
```

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
Retry com backoff.
```

A aula 457 respondeu:

```text
como implementar
um adapter síncrono
com RestClient?
```

A aula 458 responderá:

```text
como implementar
um adapter não bloqueante
com WebClient
e Reactor?
```

Nesta aula:

```text
WebClient:
sim.

Mono:
sim.

Reactor Context:
sim.

StepVerifier:
sim.

servidor stub:
sim.

.block no código principal:
não.

.subscribe manual:
não.

timeout:
próxima aula.

retry:
aula 460.
```

A regra central será:

```text
se a fronteira é reativa,
o pipeline precisa permanecer
componível até o caller.
```

---

## Objetivo prático

Ao final da aula, o laboratório terá:

```text
order-consumer-reactive/
├── pom.xml
├── src/main/java/
│   └── br/com/formacao/orderconsumerreactive/
│       ├── application/catalog/
│       ├── application/order/
│       ├── infrastructure/http/catalog/
│       ├── web/
│       └── shared/observability/
├── src/main/resources/
│   ├── application.yaml
│   └── application-local.yaml
└── src/test/java/
```

Componentes:

```text
ReactiveProductCatalogGateway;

ReactiveValidateProductForOrderService;

ReactiveCatalogAccessTokenProvider;

EnvironmentReactiveCatalogAccessTokenProvider;

ReactiveCorrelationIdProvider;

ReactorContextCorrelationIdProvider;

WebClientCatalogConfiguration;

ProductAvailabilityHttpResponse;

ReactiveProductAvailabilityHttpMapper;

CatalogClientResponseTranslator;

WebClientProductCatalogGateway;

CorrelationContextWebFilter;

ReactiveOrderValidationController.
```

Testes:

```text
WebClientProductCatalogGatewayTest;

ReactiveProductAvailabilityHttpMapperTest;

CatalogClientResponseTranslatorTest;

ReactiveValidateProductForOrderServiceTest;

ReactiveOrderValidationControllerTest;

ReactorContextPropagationTest;

NoBlockingCallPolicyTest;

ReactiveIntegrationBoundaryTest.
```

Documentação:

```text
docs/
├── WEBCLIENT_DESIGN.md
├── REACTIVE_EXECUTION_MODEL.md
├── RESTCLIENT_VS_WEBCLIENT.md
└── WEBCLIENT_TEST_MATRIX.md
```

Você irá:

1. criar o projeto reativo;
2. compreender `Mono`;
3. compreender subscription;
4. compreender lazy execution;
5. modelar uma porta reativa;
6. criar caso de uso reativo;
7. configurar `WebClient`;
8. criar token provider reativo;
9. propagar correlation no Context;
10. criar DTO externo;
11. mapear o contrato;
12. traduzir status;
13. usar `exchangeToMono`;
14. evitar `.block()`;
15. evitar `.subscribe()`;
16. testar com `StepVerifier`;
17. testar HTTP real efêmero;
18. comparar modelos;
19. registrar limitações;
20. preparar timeouts.

---

## Conceito essencial

### Programação reativa

Programação reativa modela dados e eventos como streams assíncronos e componíveis.

No Project Reactor:

```text
Mono<T>:
zero ou um item.

Flux<T>:
zero a muitos itens.
```

Nosso endpoint retorna uma disponibilidade.

Portanto:

```text
Mono<ProductAvailabilitySnapshot>.
```

---

### Mono não é o valor

Isto:

```java
Mono<ProductAvailabilitySnapshot>
```

não é um snapshot já carregado.

É uma descrição de uma computação que poderá produzir:

- um valor;
- conclusão vazia;
- erro.

O pipeline só executa quando existe subscription.

---

### Subscription

Em uma aplicação WebFlux, o framework realiza a subscription ao resultado retornado pelo controller.

Exemplo:

```java
@PostMapping
Mono<OrderValidationResponse> validate(
        @Valid
        @RequestBody
        OrderValidationRequest request
) {
    return service
            .validate(
                request
            );
}
```

O controller retorna o pipeline.

Ele não chama:

```java
.subscribe();
```

---

### Lazy execution

Considere:

```java
Mono<ProductAvailabilitySnapshot> result =
        gateway.findAvailability(
            code
        );
```

Nesse momento, a request pode ainda não ter sido enviada.

A execução ocorre na subscription.

Isso permite:

- compor operators;
- propagar cancelamento;
- propagar contexto;
- definir error handling;
- controlar a cadeia.

---

### Sinais

Um pipeline Reactor trabalha com sinais:

```text
onNext;

onComplete;

onError;

cancel.
```

Um `Mono` bem-sucedido normalmente produz:

```text
onNext(value);

onComplete.
```

Um erro produz:

```text
onError(exception).
```

Depois de terminal signal, não há novos sinais válidos.

---

### map

Use `map` para transformação síncrona de um valor.

```java
responseMono.map(
    response ->
        mapper.toSnapshot(
            productCode,
            response
        )
);
```

O mapper não retorna outro publisher.

---

### flatMap

Use `flatMap` quando a próxima etapa retorna outro `Mono`.

```java
tokenProvider
    .currentAccessToken()
    .flatMap(
        token ->
            callCatalog(
                token,
                code
            )
    );
```

Usar `map` nesse caso produziria:

```text
Mono<Mono<T>>.
```

---

### switchIfEmpty

Use quando um publisher completa sem item e isso possui significado.

Exemplo:

```java
bodyToMono(
    ProductAvailabilityHttpResponse.class
)
.switchIfEmpty(
    Mono.error(
        new ProductCatalogContractException(
            "Catalog body is required"
        )
    )
);
```

Um `200` vazio não vira sucesso com defaults.

---

### defer

`Mono.defer` adia a criação até a subscription.

Exemplo:

```java
Mono.defer(
    tokenProvider::currentAccessToken
);
```

Isso é útil quando o valor precisa ser obtido por chamada.

Não use `Mono.just` para executar trabalho antecipadamente.

---

### Error signal

Em Reactor, errors percorrem o pipeline como sinal terminal.

Use:

```text
onErrorMap:
traduzir categoria.

onErrorResume:
recuperar com outro publisher.

doOnError:
observação, não recuperação.
```

Não use `onErrorResume` amplo para retornar um objeto falso.

---

### onErrorResume perigoso

Exemplo inseguro:

```java
.onErrorResume(
    exception ->
        Mono.just(
            availableSnapshot()
        )
);
```

O catálogo indisponível seria interpretado como produto disponível.

Fallback precisa de decisão de negócio.

Nesta aula, falhas continuam falhas.

---

### doOnNext

`doOnNext` é apropriado para observação.

Evite usá-lo para mutações de negócio obrigatórias.

A mutação em `doOnNext` pode ser ignorada, repetida ou ficar mal representada no fluxo.

Para operação reativa obrigatória, use composição:

```java
.flatMap(
    snapshot ->
        repository.save(
            entity
        )
);
```

---

### Não usar subscribe no service

Exemplo ruim:

```java
gateway
    .findAvailability(
        code
    )
    .subscribe(
        snapshot ->
            process(
                snapshot
            )
    );

return Mono.empty();
```

O caller perde o resultado e o erro.

Exemplo correto:

```java
return gateway
        .findAvailability(
            code
        )
        .flatMap(
            this::process
        );
```

---

### Não usar block no event loop

`block()` espera de forma síncrona.

Em threads marcadas para trabalho não bloqueante, isso pode causar exception ou degradar o modelo.

No código desta aula:

```text
src/main:
nenhum .block().

src/main:
nenhum .subscribe().
```

Testes podem usar `StepVerifier`.

---

### Event loop

Reactor Netty utiliza event loops para processar I/O.

Um número limitado de threads pode atender muitas conexões quando o trabalho não bloqueia.

Se uma dessas threads executar:

- JDBC bloqueante;
- `Thread.sleep`;
- leitura de arquivo lenta;
- chamada SDK bloqueante;
- `.block`;

ela deixa de atender outros eventos durante o bloqueio.

---

### WebClient não torna tudo reativo

Se o pipeline chama um repository JPA bloqueante, o fluxo não é reativo de ponta a ponta.

Nesta aula, o novo consumer não terá banco.

Ele fará:

```text
HTTP reativo;

validação em memória;

response reativa.
```

Quando houver persistência, será necessário decidir:

- manter arquitetura imperativa;
- usar scheduler controlado para legado;
- usar R2DBC;
- separar workflows.

Não esconda blocking code.

---

### boundedElastic

`boundedElastic` existe para bridges inevitáveis com código bloqueante.

Ele não deve ser usado para mascarar qualquer operação.

Exemplo de ponte explícita:

```java
Mono.fromCallable(
        legacyBlockingClient::call
)
.subscribeOn(
    Schedulers.boundedElastic()
);
```

Nesta aula, isso não será necessário.

---

### Reactor Context

ThreadLocal e MDC não são suficientes como fonte principal em um pipeline que pode trocar de thread.

Reactor Context acompanha a subscription.

Use uma chave:

```text
correlationId.
```

O WebFilter obtém ou cria o ID e aplica:

```java
chain.filter(
    exchange
)
.contextWrite(
    context ->
        context.put(
            CorrelationKeys.CORRELATION_ID,
            correlationId
        )
);
```

O adapter consulta com:

```java
Mono.deferContextual(...).
```

---

### Context não é para secrets

Não armazene no Reactor Context:

- access token;
- password;
- body;
- PII;
- entity;
- connection;
- objeto mutável.

Use-o para metadados técnicos pequenos e controlados.

---

### Backpressure

Backpressure permite que o consumidor expresse demanda ao produtor.

Esse conceito é mais visível em:

```text
Flux;

streams;

muitos itens;

pipelines com prefetch.
```

Nosso adapter produz um único item por request:

```text
Mono.
```

Backpressure não é o principal benefício deste exemplo.

Também não substitui:

- rate limiting;
- capacity planning;
- timeout;
- bulkhead;
- controle do provedor.

---

### WebClient

O `WebClient` possui API fluente e não bloqueante.

Exemplo:

```java
webClient
    .get()
    .uri(
        "/api/v1/products/{code}/availability",
        code
    )
    .retrieve()
    .bodyToMono(
        ProductAvailabilityHttpResponse.class
    );
```

Nesta aula usaremos:

```text
exchangeToMono.
```

Ele oferece controle explícito do status, headers e body.

---

### retrieve versus exchangeToMono

`retrieve` é simples para mapeamento de body com status handlers.

`exchangeToMono` permite decidir por response:

```java
.exchangeToMono(
    response ->
        translator.translate(
            response,
            requestedCode
        )
);
```

Isso será útil para:

- ler `Retry-After`;
- liberar body em errors;
- diferenciar status;
- validar `200` vazio;
- manter tradução em um componente.

---

### Liberar body de erro

Quando o body não será consumido, libere-o antes de sinalizar erro:

```java
return response
        .releaseBody()
        .then(
            Mono.error(
                exception
            )
        );
```

Não propague body remoto por padrão.

---

### Porta reativa

A porta será:

```java
public interface ReactiveProductCatalogGateway {

    Mono<ProductAvailabilitySnapshot>
    findAvailability(
            ProductCode productCode
    );
}
```

A presença de `Mono` torna o contrato de execução explícito.

Não implemente uma porta síncrona com WebClient e `.block()` escondido.

---

### Token provider reativo

```java
public interface ReactiveCatalogAccessTokenProvider {

    Mono<String> currentAccessToken();
}
```

A implementação local pode usar:

```java
Mono.defer(
    () -> {
        String token =
                System.getenv(
                    "CATALOG_SERVICE_TOKEN"
                );

        if (
            token == null
            || token.isBlank()
        ) {
            return Mono.error(
                new CatalogCredentialsUnavailableException()
            );
        }

        return Mono.just(
            token
        );
    }
);
```

A implementação futura poderá obter Client Credentials sem alterar o gateway.

---

### Erros preservados

As categorias permanecem equivalentes às da aula 457:

```text
ProductNotFoundException;

ProductCatalogAuthenticationException;

ProductCatalogRateLimitedException;

ProductCatalogUnavailableException;

ProductCatalogContractException.
```

A diferença está no transporte do erro:

```text
Mono.error(exception).
```

---

### Cancelamento

Se o client cancela a request antes da conclusão, o pipeline pode propagar cancelamento para o I/O.

Não capture cancelamento como erro de negócio.

Não crie subscription paralela que continue trabalhando sem caller.

---

### Comparação honesta

RestClient:

```text
imperativo;

síncrono;

fácil de seguir;

uma thread aguarda.
```

WebClient:

```text
reativo;

não bloqueante;

componível;

exige disciplina no pipeline.
```

Nenhum é vencedor universal.

---

## Mão na massa guiada

### 1. Criar o projeto

Na pasta do laboratório:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas

New-Item `
  -ItemType Directory `
  -Path order-consumer-reactive `
  -Force
```

Crie o projeto Spring Boot com:

```text
Java 21;

Spring Reactive Web;

Validation;

Actuator;

Security quando necessário;

Test.
```

Use as versões já validadas na formação.

---

### 2. Criar packages

```text
application/catalog;

application/order;

domain/product;

infrastructure/http/catalog;

web;

shared/observability.
```

Não importe packages do `order-consumer` imperativo.

Os projetos compartilham contrato, não classes internas.

---

### 3. Criar ProductCode

Mantenha a regra:

```text
[A-Z0-9_-]{3,40}.
```

O value object permanece independente de Reactor.

---

### 4. Criar ProductAvailabilitySnapshot

```java
public record ProductAvailabilitySnapshot(
        ProductCode productCode,
        boolean available,
        int availableQuantity
) {
    public ProductAvailabilitySnapshot {
        Objects.requireNonNull(
                productCode
        );

        if (availableQuantity < 0) {
            throw new IllegalArgumentException(
                "Quantity cannot be negative"
            );
        }
    }
}
```

---

### 5. Criar a porta reativa

```java
public interface ReactiveProductCatalogGateway {

    Mono<ProductAvailabilitySnapshot>
    findAvailability(
            ProductCode productCode
    );
}
```

---

### 6. Criar o caso de uso

```java
@Service
public class ReactiveValidateProductForOrderService {

    private final ReactiveProductCatalogGateway gateway;

    public Mono<ProductAvailabilitySnapshot> requireAvailable(
            ProductCode productCode,
            int requestedQuantity
    ) {
        if (requestedQuantity <= 0) {
            return Mono.error(
                    new InvalidOrderQuantityException()
            );
        }

        return gateway
                .findAvailability(
                    productCode
                )
                .filter(
                    ProductAvailabilitySnapshot::available
                )
                .filter(
                    snapshot ->
                        snapshot.availableQuantity()
                        >= requestedQuantity
                )
                .switchIfEmpty(
                    Mono.error(
                        new ProductUnavailableForOrderException()
                    )
                );
    }
}
```

O method não chama `.block()`.

---

### 7. Testar o caso de uso

Use fake reativo:

```java
final class FakeReactiveProductCatalogGateway
        implements ReactiveProductCatalogGateway {

    private Mono<ProductAvailabilitySnapshot>
            result =
                Mono.empty();

    void returns(
            ProductAvailabilitySnapshot snapshot
    ) {
        result =
                Mono.just(
                    snapshot
                );
    }

    void failsWith(
            RuntimeException exception
    ) {
        result =
                Mono.error(
                    exception
                );
    }

    @Override
    public Mono<ProductAvailabilitySnapshot> findAvailability(
            ProductCode productCode
    ) {
        return result;
    }
}
```

Teste com `StepVerifier`.

---

### 8. Criar properties

Reutilize a validação conceitual da base URL:

```java
@ConfigurationProperties(
    prefix = "integrations.catalog"
)
public record ReactiveCatalogClientProperties(
        URI baseUrl
) {
}
```

Valide scheme, host, user info, query e fragment.

---

### 9. Configurar WebClient

```java
@Bean
WebClient catalogWebClient(
        WebClient.Builder builder,
        ReactiveCatalogClientProperties properties
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
            .build();
}
```

Não configure timeout ainda.

---

### 10. Criar token provider reativo

```java
public interface ReactiveCatalogAccessTokenProvider {

    Mono<String> currentAccessToken();
}
```

Implementação local com `Mono.defer`.

Não use `Mono.just(System.getenv(...))` no startup se o valor precisa ser lido por subscription.

---

### 11. Criar chaves de Context

```java
public final class CorrelationKeys {

    public static final String
            CORRELATION_ID =
                "correlationId";

    private CorrelationKeys() {
    }
}
```

---

### 12. Criar WebFilter

```java
@Component
public class CorrelationContextWebFilter
        implements WebFilter {

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            WebFilterChain chain
    ) {
        String correlationId =
                resolveOrCreate(
                    exchange.getRequest()
                );

        exchange.getResponse()
                .getHeaders()
                .set(
                    "X-Correlation-Id",
                    correlationId
                );

        return chain
                .filter(
                    exchange
                )
                .contextWrite(
                    context ->
                        context.put(
                            CorrelationKeys.CORRELATION_ID,
                            correlationId
                        )
                );
    }
}
```

Valide tamanho e caracteres.

---

### 13. Criar correlation provider

```java
@Component
public class ReactorContextCorrelationIdProvider {

    public Mono<String> currentOrCreate() {
        return Mono.deferContextual(
            contextView -> {
                if (
                    contextView.hasKey(
                        CorrelationKeys.CORRELATION_ID
                    )
                ) {
                    return Mono.just(
                        contextView.get(
                            CorrelationKeys.CORRELATION_ID
                        )
                    );
                }

                return Mono.just(
                        UUID.randomUUID()
                            .toString()
                );
            }
        );
    }
}
```

---

### 14. Criar DTO externo

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

Mantenha wrappers para fields obrigatórios.

---

### 15. Criar mapper

O mapper continua síncrono:

```java
@Component
class ReactiveProductAvailabilityHttpMapper {

    ProductAvailabilitySnapshot toSnapshot(
            ProductCode requestedCode,
            ProductAvailabilityHttpResponse response
    ) {
        validate(
            requestedCode,
            response
        );

        return new ProductAvailabilitySnapshot(
                requestedCode,
                response.available(),
                response.availableQuantity()
        );
    }
}
```

Não transforme um mapper puro em `Mono` sem necessidade.

Use `.map(mapper::toSnapshot)`.

---

### 16. Criar response translator

```java
@Component
class CatalogClientResponseTranslator {

    Mono<ProductAvailabilityHttpResponse> translate(
            ClientResponse response
    ) {
        int status =
                response.statusCode()
                        .value();

        if (status == 200) {
            return response
                    .bodyToMono(
                        ProductAvailabilityHttpResponse.class
                    )
                    .switchIfEmpty(
                        Mono.error(
                            new ProductCatalogContractException(
                                "Catalog body is required"
                            )
                        )
                    );
        }

        if (status == 404) {
            return releaseAndFail(
                    response,
                    new ProductNotFoundException()
            );
        }

        if (
            status == 401
            || status == 403
        ) {
            return releaseAndFail(
                    response,
                    new ProductCatalogAuthenticationException(
                        status
                    )
            );
        }

        if (status == 429) {
            return releaseAndFail(
                    response,
                    rateLimited(
                        response.headers()
                                .asHttpHeaders()
                    )
            );
        }

        if (
            response.statusCode()
                    .is5xxServerError()
        ) {
            return releaseAndFail(
                    response,
                    new ProductCatalogUnavailableException()
            );
        }

        return releaseAndFail(
                response,
                new ProductCatalogContractException(
                    "Unexpected catalog status"
                )
        );
    }

    private Mono<ProductAvailabilityHttpResponse>
    releaseAndFail(
            ClientResponse response,
            RuntimeException exception
    ) {
        return response
                .releaseBody()
                .then(
                    Mono.error(
                        exception
                    )
                );
    }
}
```

---

### 17. Criar o gateway

```java
@Component
public class WebClientProductCatalogGateway
        implements ReactiveProductCatalogGateway {

    private final WebClient webClient;
    private final ReactiveCatalogAccessTokenProvider tokenProvider;
    private final ReactorContextCorrelationIdProvider correlationProvider;
    private final CatalogClientResponseTranslator responseTranslator;
    private final ReactiveProductAvailabilityHttpMapper mapper;

    @Override
    public Mono<ProductAvailabilitySnapshot> findAvailability(
            ProductCode productCode
    ) {
        return Mono.zip(
                    tokenProvider.currentAccessToken(),
                    correlationProvider.currentOrCreate()
                )
                .flatMap(
                    credentials ->
                        webClient
                            .get()
                            .uri(
                                "/api/v1/products/{productCode}/availability",
                                productCode.value()
                            )
                            .headers(
                                headers -> {
                                    headers.setBearerAuth(
                                        credentials.getT1()
                                    );

                                    headers.set(
                                        "X-Correlation-Id",
                                        credentials.getT2()
                                    );
                                }
                            )
                            .exchangeToMono(
                                responseTranslator::translate
                            )
                )
                .map(
                    response ->
                        mapper.toSnapshot(
                            productCode,
                            response
                        )
                )
                .onErrorMap(
                    WebClientRequestException.class,
                    exception ->
                        new ProductCatalogUnavailableException()
                )
                .onErrorMap(
                    DecodingException.class,
                    exception ->
                        new ProductCatalogContractException(
                            "Catalog response could not be decoded"
                        )
                );
    }
}
```

Não use `onErrorMap` genérico que remapeia exceptions já classificadas.

---

### 18. Preservar exceptions conhecidas

Se necessário, use predicate:

```java
.onErrorMap(
    exception ->
        exception instanceof WebClientException
        && !(exception instanceof ProductCatalogException),
    exception ->
        new ProductCatalogContractException(
            "Unexpected catalog client failure"
        )
)
```

Teste a hierarquia.

---

### 19. Criar request DTO

```java
public record ReactiveOrderValidationRequest(
        @NotBlank
        String productCode,

        @Positive
        int quantity
) {
}
```

O DTO não recebe URL ou token.

---

### 20. Criar response DTO

```java
public record ReactiveOrderValidationResponse(
        String productCode,
        boolean available,
        int availableQuantity
) {
}
```

---

### 21. Criar controller reativo

```java
@RestController
@RequestMapping(
    "/api/v1/reactive-order-validations"
)
public class ReactiveOrderValidationController {

    private final ReactiveValidateProductForOrderService service;

    @PostMapping
    Mono<ReactiveOrderValidationResponse> validate(
            @Valid
            @RequestBody
            ReactiveOrderValidationRequest request
    ) {
        ProductCode code =
                new ProductCode(
                    request.productCode()
                );

        return service
                .requireAvailable(
                    code,
                    request.quantity()
                )
                .map(
                    snapshot ->
                        new ReactiveOrderValidationResponse(
                            snapshot.productCode()
                                    .value(),
                            snapshot.available(),
                            snapshot.availableQuantity()
                        )
                );
    }
}
```

O framework realiza a subscription.

---

### 22. Criar Problem Details reativo

Use `@RestControllerAdvice` compatível com WebFlux.

Mapeie:

- produto não encontrado;
- produto indisponível;
- integração sem credencial;
- integração não autorizada;
- catálogo limitado;
- catálogo indisponível;
- contrato inválido.

Não exponha exception message bruta.

---

### 23. Testar mapper com unit test

Cenários:

- response válido;
- body nulo;
- field obrigatório ausente;
- code mismatch;
- quantity negativa;
- campo adicional ignorado pelo decoder.

---

### 24. Testar o service com StepVerifier

```java
StepVerifier.create(
        service.requireAvailable(
            new ProductCode(
                "SKU-1001"
            ),
            2
        )
)
.assertNext(
    snapshot ->
        assertThat(
            snapshot.availableQuantity()
        )
        .isEqualTo(
            25
        )
)
.verifyComplete();
```

---

### 25. Testar erro com StepVerifier

```java
StepVerifier.create(
        service.requireAvailable(
            code,
            30
        )
)
.expectError(
    ProductUnavailableForOrderException.class
)
.verify();
```

---

### 26. Criar ExchangeFunction fake

Para unit tests focados, crie um `ExchangeFunction` que:

- captura `ClientRequest`;
- retorna `ClientResponse`;
- não abre socket.

Valide:

- método;
- URL;
- Accept;
- Authorization;
- correlation.

Esse teste é rápido.

---

### 27. Criar servidor HTTP efêmero

Para integração do adapter, use Reactor Netty:

```java
HttpServer server =
        HttpServer.create()
                  .port(
                      0
                  )
                  .handle(
                      routes
                  )
                  .bindNow();
```

Obtenha a porta real.

Construa `WebClient` para:

```text
http://localhost:<porta>.
```

Isso testa HTTP real local sem depender do provider completo.

---

### 28. Testar sucesso por HTTP

O stub retorna:

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

Use `StepVerifier`.

Confirme request capturada.

---

### 29. Testar 404

Stub retorna `404`.

Esperado:

```text
ProductNotFoundException.
```

---

### 30. Testar 401 e 403

Esperado:

```text
ProductCatalogAuthenticationException.
```

Preserve reason interno diferente.

---

### 31. Testar 429

Retorne:

```text
Retry-After: 30.
```

Espere:

```text
ProductCatalogRateLimitedException.
```

Não espere trinta segundos.

Não execute retry.

---

### 32. Testar 5xx

Teste:

```text
500;

502;

503;

504.
```

Todos viram indisponibilidade.

Isso não significa que todos serão retryable no futuro.

A aula 460 definirá critérios.

---

### 33. Testar body vazio

`200` sem body.

Esperado:

```text
ProductCatalogContractException.
```

---

### 34. Testar JSON inválido

Use field de tipo incorreto.

Esperado:

```text
ProductCatalogContractException.
```

---

### 35. Testar conexão recusada

Use uma porta local fechada.

Esperado:

```text
ProductCatalogUnavailableException.
```

Sem timeout explícito, não teste blackhole de rede nesta aula.

---

### 36. Testar Reactor Context

Crie pipeline:

```java
gateway
    .findAvailability(
        code
    )
    .contextWrite(
        context ->
            context.put(
                CorrelationKeys.CORRELATION_ID,
                "corr-reactor-458"
            )
    );
```

Confirme header correspondente.

---

### 37. Testar cancelamento

Crie uma response atrasada no stub.

Use `StepVerifier` para cancelar antes da emissão.

Valide que o pipeline encerra sem side effect de negócio.

Não transforme cancelamento em `ProductCatalogUnavailableException`.

---

### 38. Criar NoBlockingCallPolicyTest

Inspecione `src/main/java`.

Falhe se encontrar:

```text
.block();

.blockFirst();

.blockLast();

.toIterable();

.toStream();

.subscribe();
```

Permita exceptions documentadas apenas via registro aprovado.

Nesta aula, o registro começa vazio.

---

### 39. Criar boundary test

Falhe se:

- domínio importar `WebClient`;
- domínio importar Reactor Netty;
- controller criar WebClient;
- service receber access token;
- URL vier do DTO;
- adapter retornar DTO HTTP;
- projeto reativo importar JPA bloqueante;
- código principal usar `.block()`.

---

### 40. Testar controller com WebTestClient

Use:

```java
WebTestClient
    .bindToApplicationContext(
        context
    )
    .build();
```

Cenários:

- request válida;
- quantity inválida;
- product indisponível;
- integração indisponível;
- correlation response;
- Problem Details.

---

### 41. Executar provider

Terminal 1:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

---

### 42. Executar reactive consumer

Terminal 2:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive

$env:CATALOG_BASE_URL =
  "http://localhost:8081"

$env:CATALOG_SERVICE_TOKEN =
  "<token-local>"

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

Use outra porta, como `8083`.

---

### 43. Executar fluxo real

```http
POST http://localhost:8083/api/v1/reactive-order-validations
Content-Type: application/json
X-Correlation-Id: corr-reactive-458

{
  "productCode": "SKU-1001",
  "quantity": 2
}
```

Confirme:

- response;
- correlation;
- chamada ao provider;
- ausência de token nos logs.

---

### 44. Comparar threads

Somente em ambiente local, registre nomes técnicos de threads sem dados sensíveis.

Observe:

```text
RestClient:
thread aguarda.

WebClient:
I/O não bloqueante.
```

Não use essa observação como benchmark.

---

### 45. Comparar código

Crie:

```text
docs/RESTCLIENT_VS_WEBCLIENT.md
```

Tabela:

| Aspecto | RestClient | WebClient |
|---|---|---|
| Modelo | imperativo | reativo |
| Retorno | valor/exception | Mono/error signal |
| Thread | aguarda I/O | I/O não bloqueante |
| Composição | sequencial | operators |
| Streaming | limitado | natural com Flux |
| Complexidade | menor | maior |
| `.block()` | não necessário | quebra o fluxo |
| Melhor uso | stack imperativa | stack reativa |

---

### 46. Registrar decisão

Para o projeto principal atual:

```text
RestClient continua válido.
```

Para o projeto comparativo:

```text
WebClient é válido
porque o fluxo permanece reativo.
```

Não migre apenas por tendência.

---

### 47. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=WebClientProductCatalogGatewayTest,ReactiveProductAvailabilityHttpMapperTest,CatalogClientResponseTranslatorTest,ReactiveValidateProductForOrderServiceTest,ReactorContextPropagationTest,NoBlockingCallPolicyTest,ReactiveIntegrationBoundaryTest `
  test
```

---

### 48. Executar controller tests

```powershell
.\mvnw.cmd `
  -Dtest=ReactiveOrderValidationControllerTest `
  test
```

---

### 49. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- nenhuma subscription manual;
- nenhum block;
- Context;
- errors;
- cancelamento;
- boundaries;
- security sentinels;
- contrato.

---

### 50. Atualizar documentação

Crie:

```text
WEBCLIENT_DESIGN.md;

REACTIVE_EXECUTION_MODEL.md;

RESTCLIENT_VS_WEBCLIENT.md;

WEBCLIENT_TEST_MATRIX.md.
```

Registre que timeout e retry ainda estão pendentes.

---

## Entendendo o que foi feito

### O modelo reativo ficou explícito

A porta, o service e o controller retornam `Mono`.

### O WebClient não foi escondido atrás de block

A cadeia permanece componível até o framework.

### O token continuou na infraestrutura

O provider reativo permite evolução futura da credencial.

### Correlation saiu do ThreadLocal como fonte principal

O Reactor Context acompanha a subscription.

### Status e body foram tratados por response

`exchangeToMono` centralizou a tradução.

### Testes cobriram signals

`StepVerifier` validou valor, erro, conclusão e cancelamento.

### HTTP real local foi exercitado

O servidor efêmero complementou o fake de `ExchangeFunction`.

### A comparação permaneceu honesta

O projeto não migrou o fluxo imperativo por moda.

---

## Erros comuns importantes

### Usar WebClient com block em todo lugar

O benefício não bloqueante desaparece.

### Chamar subscribe no controller

O framework perde o controle do resultado.

### Usar ThreadLocal como única fonte

A troca de threads pode perder ou misturar contexto.

### Colocar token no Reactor Context

O contexto não é cofre de secrets.

### Usar onErrorResume para sucesso falso

A indisponibilidade vira dado incorreto.

### Colocar JDBC bloqueante no event loop

Poucas threads ficam presas.

### Adicionar boundedElastic sem analisar

O bloqueio é escondido em vez de removido.

### Dizer que Mono resolve sobrecarga

Rate limiting e capacidade continuam necessários.

### Testar apenas com ExchangeFunction fake

Transporte real local fica sem evidência.

### Migrar todos os clients para WebClient

A complexidade pode aumentar sem benefício.

---

## Comandos úteis

### Testes reativos

```powershell
.\mvnw.cmd `
  -Dtest=WebClientProductCatalogGatewayTest,ReactiveProductAvailabilityHttpMapperTest,CatalogClientResponseTranslatorTest,ReactiveValidateProductForOrderServiceTest `
  test
```

### Context e boundaries

```powershell
.\mvnw.cmd `
  -Dtest=ReactorContextPropagationTest,NoBlockingCallPolicyTest,ReactiveIntegrationBoundaryTest `
  test
```

### Controller

```powershell
.\mvnw.cmd `
  -Dtest=ReactiveOrderValidationControllerTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar blocking calls

```powershell
git grep `
  -n `
  -E `
  "\\.block\\(|\\.blockFirst\\(|\\.blockLast\\(|\\.subscribe\\(|Thread\\.sleep"
```

---

## Exercício guiado

### Parte 1 — Projeto

Crie o consumer reativo separado.

### Parte 2 — Reactor

Modele porta e service com `Mono`.

### Parte 3 — WebClient

Configure o client dedicado.

### Parte 4 — Context

Propague correlation ID.

### Parte 5 — Contrato

Crie DTO, mapper e translator.

### Parte 6 — Gateway

Implemente sem block.

### Parte 7 — Controller

Retorne Mono ao framework.

### Parte 8 — Testes

Use StepVerifier, fake e servidor efêmero.

### Parte 9 — Comparação

Documente RestClient versus WebClient.

### Parte 10 — Limites

Mantenha timeout e retry para as próximas aulas.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 457 foi preservada;
- projeto reativo separado foi criado;
- Spring WebFlux e Reactor foram usados;
- `Mono` foi explicado como zero ou um item;
- lazy execution e subscription foram explicadas;
- framework realiza a subscription;
- código principal não usa `.subscribe()`;
- código principal não usa `.block()`;
- event loop e blocking accidental foram explicados;
- `boundedElastic` não foi usado sem necessidade;
- backpressure foi explicado sem exagero para Mono;
- porta reativa retorna `Mono`;
- caso de uso retorna `Mono`;
- controller retorna `Mono`;
- token provider é reativo;
- token permanece fora do domínio e Context;
- Reactor Context carrega correlation ID;
- WebFilter aplica correlation;
- WebClient dedicado foi configurado;
- URI template foi usado;
- Accept JSON foi configurado;
- `exchangeToMono` foi usado;
- body de erro foi liberado;
- `200` vazio é contract error;
- JSON inválido é contract error;
- code mismatch é contract error;
- `404`, `401`, `403`, `429` e `5xx` foram traduzidos;
- falha de transporte foi traduzida;
- cancelamento não virou erro de negócio;
- mapper permaneceu síncrono e puro;
- `onErrorResume` não criou fallback falso;
- StepVerifier validou sucesso e erro;
- ExchangeFunction fake validou request;
- servidor HTTP efêmero validou transporte local;
- WebTestClient validou controller;
- NoBlockingCallPolicyTest foi criado;
- boundary test impediu dependências bloqueantes;
- RestClient e WebClient foram comparados;
- nenhuma migração por tendência foi proposta;
- timeout não foi antecipado;
- retry não foi antecipado;
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
  "\\.block\\(|\\.blockFirst\\(|\\.blockLast\\(|\\.subscribe\\(|CATALOG_SERVICE_TOKEN:|Bearer ey"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive `
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
git commit -m "feat(m16): integrar catalogo com WebClient"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- client secret;
- `.env`;
- blocking call;
- subscribe manual;
- timeout antecipado;
- retry;
- fallback falso;
- dados reais;
- log de body;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o catálogo recebeu uma segunda implementação de integração no lado consumidor:

```text
WebClientProductCatalogGateway.
```

O novo fluxo ficou:

```text
ReactiveOrderValidationController;

ReactiveValidateProductForOrderService;

ReactiveProductCatalogGateway;

WebClient;

catalog-provider;

Mono response;

mapper;

snapshot;

response.
```

A principal diferença não foi apenas trocar a classe do client.

O modelo de execução mudou.

Com `RestClient`:

```text
o método aguarda
e devolve um valor
ou lança exception.
```

Com `WebClient`:

```text
o método devolve
um pipeline Mono
que produzirá valor,
conclusão ou erro
após subscription.
```

A principal decisão foi:

```text
um client reativo
precisa ser acompanhado
por uma fronteira reativa;

caso contrário,
o block escondido
devolve o sistema
ao modelo imperativo
com complexidade adicional.
```

A aula também confirmou:

- Reactor Context é melhor que ThreadLocal como fonte principal do fluxo;
- `StepVerifier` testa signals;
- backpressure não substitui proteção de capacidade;
- WebClient não elimina timeout;
- WebClient não autoriza retry automático;
- código bloqueante precisa ser identificado.

A próxima aula será:

```text
459 - M16.04 - Timeouts
```

Nela, você irá:

- diferenciar connect timeout, response timeout e read timeout;
- definir orçamento de latência;
- configurar timeout no RestClient;
- configurar timeout no WebClient;
- testar servidor lento e blackhole controlado;
- traduzir timeout para categoria própria;
- evitar espera infinita;
- propagar cancelamento;
- registrar métricas;
- preparar a base correta para retry com backoff.

---

# Material complementar

## Checkpoint final

- [ ] Criei a porta e o caso de uso reativos.
- [ ] Implementei WebClient sem block.
- [ ] Propaguei correlation pelo Reactor Context.
- [ ] Testei signals, cancelamento e HTTP.
- [ ] Comparei RestClient e WebClient honestamente.

---

## Troubleshooting adicional

### Nada acontece no pipeline

Pode não existir subscription.

Retorne o `Mono` ao framework em vez de descartá-lo.

### O erro não chega ao caller

Procure `.subscribe()` manual ou `onErrorResume` amplo.

### A aplicação acusa blocking call

Revise `.block()`, JDBC, file I/O e SDKs no event loop.

### Correlation ID desaparece

Confirme `contextWrite` e `deferContextual`.

### Token foi salvo no Context

Remova-o e mantenha no escopo mínimo do adapter.

### 404 virou WebClientResponseException

O translator não está sendo usado pelo `exchangeToMono`.

### Body de error gera leak

Consuma ou libere o body antes de `Mono.error`.

### StepVerifier não termina

O pipeline pode estar aguardando I/O sem timeout; use stub determinístico nesta aula.

### Teste de cancelamento gera error

O cancelamento está sendo remapeado indevidamente.

### WebClient ficou mais complexo que RestClient

Isso pode indicar que o fluxo imperativo é a escolha correta para o caso.

---

## Perguntas de revisão

1. WebClient é bloqueante?
2. O que é `Mono<T>`?
3. Quando o pipeline executa?
4. Quem faz subscribe no controller?
5. Service deve chamar subscribe?
6. O que faz map?
7. O que faz flatMap?
8. Para que serve switchIfEmpty?
9. O que faz block?
10. Por que block é perigoso no event loop?
11. ThreadLocal é suficiente?
12. O que vai no Reactor Context?
13. Token pode ir no Context?
14. Backpressure é principal em Mono?
15. WebClient torna JPA reativo?
16. Para que serve exchangeToMono?
17. Como testar signals?
18. WebClient elimina timeout?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Não.
2. Publisher de zero ou um item.
3. Na subscription.
4. O framework.
5. Não.
6. Transformação síncrona.
7. Composição com outro publisher.
8. Tratar conclusão vazia.
9. Espera síncrona.
10. Prende thread não bloqueante.
11. Não como fonte principal.
12. Metadados técnicos pequenos.
13. Não.
14. Não.
15. Não.
16. Controlar status, headers e body.
17. StepVerifier.
18. Não.
19. Timeouts.
20. Orçamento e configuração de espera.

---

## Desafio opcional

Crie um endpoint de streaming didático no provider:

```text
GET /api/v1/products/availability-events
```

Retorne `Flux` com eventos sintéticos.

No consumer reativo:

- consuma com WebClient;
- limite quantidade;
- teste cancelamento;
- observe backpressure;
- não exponha o stream em produção;
- não antecipe retry.

O desafio serve para tornar backpressure mais visível que no `Mono`.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 458 - M16.03 - WebClient

- Criei `order-consumer-reactive`.
- Mantive o consumer RestClient para comparação.
- Estudei programação reativa com Project Reactor.
- Diferenciei `Mono` e `Flux`.
- Entendi lazy execution e subscription.
- Entendi signals de sucesso, erro, conclusão e cancelamento.
- Usei `map`, `flatMap`, `switchIfEmpty` e `defer`.
- Evitei `onErrorResume` como fallback falso.
- Evitei side effects obrigatórios em `doOnNext`.
- Mantive `.subscribe()` fora de controllers e services.
- Mantive `.block()` fora do código principal.
- Entendi event loop e blocking accidental.
- Não usei `boundedElastic` sem necessidade.
- Revisei backpressure sem exagerar seu papel em Mono.
- Criei `ReactiveProductCatalogGateway`.
- Criei `ReactiveValidateProductForOrderService`.
- Criei token provider reativo.
- Mantive token fora do Reactor Context.
- Criei `CorrelationContextWebFilter`.
- Propaguei correlation ID pelo Reactor Context.
- Criei `WebClient` dedicado ao catálogo.
- Usei URI template e Accept JSON.
- Criei DTO externo com wrappers.
- Criei mapper síncrono e puro.
- Criei `CatalogClientResponseTranslator`.
- Usei `exchangeToMono`.
- Liberei bodies de erro.
- Traduzi `404`, `401`, `403`, `429` e `5xx`.
- Traduzi falhas de transporte e decoding.
- Criei `WebClientProductCatalogGateway`.
- Criei controller reativo.
- Criei Problem Details reativo.
- Testei o service com StepVerifier.
- Testei request com ExchangeFunction fake.
- Testei HTTP com Reactor Netty efêmero.
- Testei Reactor Context.
- Testei cancelamento.
- Criei `NoBlockingCallPolicyTest`.
- Criei boundary test.
- Testei controller com WebTestClient.
- Comparei RestClient e WebClient.
- Não antecipei timeouts ou retry.
- Mantive produção pública como NO-GO.
- Próxima aula: Timeouts.
```

---

## Referência técnica curta

- [Spring Framework — WebClient](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)
- [Spring Framework — WebClient retrieve](https://docs.spring.io/spring-framework/reference/web/webflux-webclient/client-retrieve.html)
- [Spring Framework — WebClient exchange](https://docs.spring.io/spring-framework/reference/web/webflux-webclient/client-exchange.html)
- [Spring Framework — WebTestClient](https://docs.spring.io/spring-framework/reference/testing/webtestclient.html)
- [Project Reactor — Getting Started](https://projectreactor.io/docs/core/release/reference/gettingStarted.html)
- [Project Reactor — Mono](https://projectreactor.io/docs/core/release/reference/coreFeatures/mono.html)
- [Project Reactor — Threading and Schedulers](https://projectreactor.io/docs/core/release/reference/coreFeatures/schedulers.html)
- [Reactive Streams Specification](https://www.reactive-streams.org/)

Regra final:

```text
uma integração com WebClient precisa ser reativa por contrato e não apenas por biblioteca: a porta, o caso de uso e o controller retornam Mono, o framework controla a subscription, o código principal não chama block nem subscribe, token e HTTP permanecem na infraestrutura, correlation ID viaja pelo Reactor Context, exchangeToMono traduz status e libera bodies, mappers validam o contrato, errors continuam categorias estáveis, StepVerifier observa sinais e cancelamento e a escolha entre RestClient e WebClient considera o modelo completo da aplicação, sem usar reatividade como moda ou como substituta de timeout, retry e proteção de capacidade.
```
