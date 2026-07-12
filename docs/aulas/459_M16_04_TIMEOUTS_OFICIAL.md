# 459 - M16.04 - Timeouts

## Apresentação da aula

Nas aulas anteriores, construímos duas integrações com o catálogo.

A implementação imperativa utiliza:

```text
RestClientProductCatalogGateway.
```

A implementação reativa utiliza:

```text
WebClientProductCatalogGateway.
```

As duas conseguem:

- montar a request;
- enviar bearer token;
- propagar correlation ID;
- receber JSON;
- validar o contrato;
- traduzir status;
- diferenciar falha de contrato e indisponibilidade.

Entretanto, ambas ainda possuem uma lacuna crítica:

```text
quanto tempo
o consumidor aceita esperar?
```

Sem uma resposta explícita, a aplicação pode depender de defaults da biblioteca, do sistema operacional, do proxy ou da infraestrutura.

Isso cria comportamentos perigosos:

```text
thread bloqueada;

event loop aguardando;

pool esgotado;

fila crescendo;

caller desistindo antes;

request órfã;

latência imprevisível;

efeito cascata.
```

A pergunta central desta aula será:

```text
como definir,
configurar,
testar
e observar timeouts
sem confundir indisponibilidade,
lentidão,
cancelamento
e retry?
```

Timeout não é um número colocado aleatoriamente no YAML.

Ele é parte do contrato operacional.

Uma integração precisa responder:

- qual é o orçamento total do fluxo;
- quanto pode ser gasto para conectar;
- quanto pode ser gasto aguardando resposta;
- quanto tempo sem bytes é aceitável;
- qual componente aplica cada limite;
- qual exception representa a falha;
- qual status público será retornado;
- qual métrica permitirá acompanhar;
- qual teste comprova.

Nesta aula, utilizaremos o fluxo:

```text
order-consumer
ou
order-consumer-reactive;

catalog-provider.
```

O contrato continua:

```http
GET /api/v1/products/{productCode}/availability
```

O provedor receberá endpoints de teste somente no profile de laboratório:

```text
/dev/delay-before-response;

dev/slow-body.
```

Esses endpoints não pertencem ao contrato público.

Eles servem para simular:

- resposta que demora a começar;
- body que para de enviar;
- request que nunca recebe resposta.

Também criaremos um blackhole TCP local para testes.

Ele aceita a conexão e não envia bytes.

Isso permite reproduzir read/response timeout de forma controlada sem depender da internet.

A aula configurará:

No `RestClient`:

```text
connect timeout;

read timeout.
```

No `WebClient`:

```text
connect timeout;

response timeout;

read idle timeout;

deadline total do pipeline.
```

A diferença não será escondida.

Cada biblioteca possui mecanismos e semânticas próprias.

Não tentaremos inventar uma configuração “universal” que trate tudo da mesma forma.

A aplicação criará uma categoria estável:

```text
ProductCatalogTimeoutException.
```

Com um estágio:

```text
CONNECT;

RESPONSE;

READ;

TOTAL.
```

O domínio continuará sem conhecer:

- `SocketTimeoutException`;
- `HttpConnectTimeoutException`;
- `ReadTimeoutException`;
- `TimeoutException`;
- Reactor Netty;
- JDK HttpClient.

A response pública do consumidor utilizará:

```text
504 Gateway Timeout;

code:
product_catalog_timeout.
```

O `504` será usado porque o consumidor não recebeu uma resposta a tempo de uma dependência upstream necessária para concluir a operação.

Uma conexão recusada imediatamente continuará sendo:

```text
503 Service Unavailable;

code:
product_catalog_unavailable.
```

A aula não implementará retry.

Isso é essencial.

Quando o timeout acontece, ainda não sabemos:

- se a operação é retryable;
- se o caller ainda tem orçamento;
- se o provider processou;
- qual backoff usar;
- quantas tentativas são seguras;
- se há idempotência;
- se o retry amplificará a falha.

A próxima aula será:

```text
460 - M16.05 - Retry com backoff
```

Ela utilizará os timeouts desta aula como pré-requisito.

Retry sem timeout pode apenas repetir uma espera indefinida.

Timeout sem orçamento pode cortar operações legítimas ou liberar recursos tarde demais.

Ao final, você deverá conseguir explicar:

```text
por que timeout
é parte da arquitetura;

por que connect timeout
não substitui response timeout;

por que read timeout
não é necessariamente
o prazo total;

por que timeout
não significa retry;

por que o caller
precisa falhar
antes de seu próprio prazo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
457:
RestClient.

458:
WebClient.

459:
Timeouts.

460:
Retry com backoff.

461:
Circuit breaker.
```

A aula 457 respondeu:

```text
como chamar
um provider
de forma síncrona?
```

A aula 458 respondeu:

```text
como chamar
um provider
de forma reativa?
```

A aula 459 responderá:

```text
por quanto tempo
cada client pode esperar
e como falhar
de forma previsível?
```

Nesta aula:

```text
orçamento de latência:
sim.

connect timeout:
sim.

response timeout:
sim.

read timeout:
sim.

deadline total:
sim.

tradução de timeout:
sim.

métricas:
sim.

testes lentos controlados:
sim.

retry:
próxima aula.

circuit breaker:
aula 461.
```

A regra central será:

```text
toda chamada externa
precisa de um limite
menor que o orçamento
do fluxo que a iniciou.
```

---

## Objetivo prático

Ao final da aula, os consumidores terão:

```text
CatalogTimeoutProperties;

ProductCatalogTimeoutException;

CatalogTimeoutStage;

CatalogTimeoutClassifier;

CatalogClientMetrics.
```

No consumidor imperativo:

```text
CatalogRestClientTimeoutConfiguration;

RestClientProductCatalogGateway
com tradução de timeout.
```

No consumidor reativo:

```text
ReactiveCatalogTimeoutConfiguration;

WebClientProductCatalogGateway
com timeouts de transporte
e deadline total.
```

No laboratório de testes:

```text
DelayedCatalogStubServer;

TcpBlackholeServer;

CatalogTimeoutTestFixtures.
```

Testes:

```text
CatalogTimeoutPropertiesTest;

RestClientConnectTimeoutConfigurationTest;

RestClientReadTimeoutIntegrationTest;

WebClientResponseTimeoutIntegrationTest;

WebClientReadTimeoutIntegrationTest;

ReactiveTotalDeadlineTest;

CatalogTimeoutProblemDetailsTest;

CatalogTimeoutMetricsTest;

NoRetryBeforeTimeoutPolicyTest.
```

Documentação:

```text
docs/
├── LATENCY_BUDGET.md
├── TIMEOUT_SEMANTICS.md
├── TIMEOUT_TEST_MATRIX.md
└── TIMEOUT_RUNBOOK.md
```

Você irá:

1. definir um SLO didático;
2. criar orçamento de latência;
3. separar tipos de timeout;
4. modelar propriedades;
5. validar durations;
6. configurar RestClient;
7. configurar WebClient;
8. criar deadline total;
9. classificar exceptions;
10. criar timeout exception estável;
11. criar Problem Details;
12. criar métricas;
13. construir servidor lento;
14. construir blackhole local;
15. testar RestClient;
16. testar WebClient;
17. testar cancelamento;
18. evitar testes frágeis;
19. registrar limitações;
20. preparar retry.

---

## Conceito essencial

### Orçamento de latência

Um fluxo precisa de um prazo máximo.

Exemplo didático:

```text
SLO do endpoint do consumidor:
2 segundos.
```

Reserva:

```text
receber e validar request:
100 ms;

regra local:
100 ms;

serializar response:
100 ms;

margem de segurança:
300 ms.
```

Disponível para o catálogo:

```text
1,4 segundo.
```

Esse valor é um orçamento.

Não é uma promessa de que toda chamada levará exatamente isso.

---

### Timeout deve ser menor que o caller

Imagine:

```text
load balancer:
2 segundos;

consumer:
3 segundos;

catalog client:
5 segundos.
```

O load balancer desiste primeiro.

A aplicação continua ocupando recursos para uma resposta que ninguém receberá.

Ordem correta:

```text
catalog client
<
consumer request
<
gateway externo.
```

Sempre mantenha margem para:

- traduzir error;
- registrar métricas;
- liberar recursos;
- responder ao caller.

---

### Deadline versus timeout

Timeout:

```text
duração máxima
para uma etapa.
```

Deadline:

```text
instante final absoluto
ou prazo restante
do fluxo completo.
```

Exemplo:

```text
request iniciou às 10:00:00.000;

deadline:
10:00:02.000.
```

Se a aplicação gastou 600 ms antes de chamar o catálogo, não deve conceder mais dois segundos inteiros ao provider.

Nesta aula, modelaremos um prazo total local.

Propagação de deadline entre serviços será uma evolução futura.

---

### Connect timeout

Connect timeout limita o tempo para estabelecer conexão com o peer.

Ele cobre principalmente:

```text
tentativa de conexão TCP.
```

Não cobre todo o processamento da request.

Uma conexão estabelecida pode permanecer sem resposta depois.

---

### Connection refused não é timeout

Se não existe processo ouvindo na porta, o sistema pode responder imediatamente:

```text
connection refused.
```

Isso é indisponibilidade rápida.

Não é connect timeout.

A tradução continua:

```text
ProductCatalogUnavailableException.
```

---

### Pool acquisition timeout

Clients com pool podem esperar por uma conexão livre.

Essa espera é diferente de conectar ao provider.

Categorias:

```text
acquire connection;

establish connection;

wait response;

read body.
```

Nesta aula, manteremos o pool padrão do Reactor Netty e documentaremos acquisition timeout como próximo controle operacional.

Não aumente pool apenas para mascarar latência.

---

### TLS handshake timeout

HTTPS adiciona negociação TLS depois da conexão.

Esse estágio também precisa de limite em produção.

O laboratório local usa HTTP.

O relatório registrará:

```text
TLS handshake timeout:
não validado no laboratório.
```

Não declare o ambiente público pronto.

---

### Response timeout

No Reactor Netty, response timeout é configurado no `HttpClient`.

Ele limita a espera pela resposta conforme a semântica do client.

Use-o como controle de transporte.

Não dependa de valor implícito.

---

### Read timeout

Read timeout controla períodos sem leitura de dados.

Exemplo:

```text
servidor envia headers;

envia metade do JSON;

para de enviar.
```

A conexão foi estabelecida.

A response começou.

Ainda assim, o body pode ficar parado.

---

### Write timeout

Write timeout limita períodos sem conseguir enviar bytes.

Nosso GET não possui body relevante.

Mesmo assim, o conceito será registrado.

Ele será mais importante em uploads e requests grandes.

---

### Total timeout no pipeline

No Reactor, o operator:

```java
.timeout(
    properties.totalTimeout()
)
```

limita o pipeline completo a partir de sua aplicação.

Ele pode incluir:

- token provider;
- correlation;
- aquisição;
- conexão;
- response;
- decoding;
- mapping.

Ele não substitui timeouts específicos de transporte.

Timeouts específicos produzem diagnóstico melhor.

O total funciona como última barreira.

---

### Read timeout não é prazo total

Alguns read timeouts são reiniciados quando bytes continuam chegando.

Um servidor pode enviar um byte periodicamente e nunca concluir dentro do prazo desejado.

Por isso, o deadline total pode ser necessário.

---

### Valores baixos demais

Timeout muito baixo pode causar:

- falsos positivos;
- falhas em picos normais;
- aumento de retry futuro;
- carga adicional;
- experiência instável.

A decisão deve usar dados de latência.

No laboratório, os valores são pequenos apenas para tornar testes rápidos.

---

### Valores altos demais

Timeout muito alto pode causar:

- threads bloqueadas;
- event loops aguardando;
- pool ocupado;
- filas;
- efeito cascata;
- cancelamento tardio;
- recuperação lenta.

---

### Percentis

Métricas úteis:

```text
p50;

p95;

p99;

máximo controlado.
```

Não escolha timeout apenas pela média.

A média pode esconder caudas longas.

O valor final considera:

- SLO;
- p99;
- margem;
- custo da falha;
- capacidade;
- dependências.

---

### Timeout é falha esperada

A exception não deve aparecer como erro desconhecido genérico.

Crie:

```java
public final class ProductCatalogTimeoutException
        extends ProductCatalogException {

    private final CatalogTimeoutStage stage;

    public ProductCatalogTimeoutException(
            CatalogTimeoutStage stage
    ) {
        super(
            "Product catalog timed out"
        );

        this.stage =
                stage;
    }

    public CatalogTimeoutStage stage() {
        return stage;
    }
}
```

A mensagem pública não contém URL nem detalhes internos.

---

### Estágios

```java
public enum CatalogTimeoutStage {
    CONNECT,
    RESPONSE,
    READ,
    TOTAL
}
```

Nem toda biblioteca permite identificar perfeitamente cada estágio.

Quando a causa não puder ser distinguida com segurança, use a categoria documentada mais próxima.

Não adivinhe pelo texto da mensagem.

---

### Cause chain

Exceptions podem estar encapsuladas.

Crie um classificador que percorre a cause chain por tipo.

Evite:

```java
exception.getMessage()
         .contains(
             "timeout"
         );
```

Mensagens mudam, podem ser localizadas e podem conter dados.

---

### Erro público

No controller do consumidor:

```text
504 Gateway Timeout;

type:
urn:problem:integration:catalog-timeout;

code:
product_catalog_timeout;

detail:
The product catalog did not respond in time.
```

Inclua correlation ID.

Não inclua:

- host;
- porta;
- duração interna;
- stack;
- nome da biblioteca;
- token.

---

### Métricas

Métrica:

```text
catalog.client.requests.
```

Tags permitidas:

```text
outcome;

failure.kind;

client.type;

route.template.
```

Exemplos:

```text
failure.kind=timeout_connect;

failure.kind=timeout_response;

failure.kind=timeout_read;

failure.kind=timeout_total.
```

Não use:

- product code;
- correlation ID;
- URL completa;
- exception message.

---

### Log seguro

Exemplo:

```text
event=catalog_call_failed;

outcome=timeout;

stage=response;

client=webclient;

route=/api/v1/products/{productCode}/availability;

correlation_id=corr-459-001.
```

Não logue o body.

---

### Cancelamento reativo

Quando o deadline total dispara, o upstream é cancelado.

O adapter não deve continuar processando a response como sucesso.

O teste deve verificar:

```text
pipeline terminou com timeout;

nenhum success event;

nenhum fallback falso.
```

---

### Timeout não é retry

A decisão de repetir depende de:

- método;
- idempotência;
- stage;
- orçamento restante;
- número de tentativas;
- tipo de falha;
- capacidade do provider.

Nesta aula:

```text
zero retries.
```

Criaremos um policy test para impedir antecipação.

---

## Mão na massa guiada

### 1. Criar o orçamento

Arquivo:

```text
docs/LATENCY_BUDGET.md
```

Conteúdo:

| Etapa | Orçamento |
|---|---:|
| Request local | 100 ms |
| Regra local | 100 ms |
| Catálogo | 1.400 ms |
| Response local | 100 ms |
| Margem | 300 ms |
| Total | 2.000 ms |

Registre que os valores são didáticos.

---

### 2. Criar properties comuns

Em cada consumidor:

```java
@ConfigurationProperties(
    prefix = "integrations.catalog.timeouts"
)
public record CatalogTimeoutProperties(
        Duration connect,
        Duration response,
        Duration readIdle,
        Duration total
) {
    public CatalogTimeoutProperties {
        requirePositive(
            connect,
            "connect"
        );

        requirePositive(
            response,
            "response"
        );

        requirePositive(
            readIdle,
            "readIdle"
        );

        requirePositive(
            total,
            "total"
        );

        if (
            total.compareTo(
                response
            ) < 0
        ) {
            throw new IllegalArgumentException(
                "Total timeout must not be smaller than response timeout"
            );
        }
    }
}
```

---

### 3. Configurar o profile local

```yaml
integrations:
  catalog:
    timeouts:
      connect: 300ms
      response: 800ms
      read-idle: 500ms
      total: 1200ms
```

Valores produtivos não devem ser copiados do laboratório.

---

### 4. Criar exception e stage

Crie:

```text
CatalogTimeoutStage;

ProductCatalogTimeoutException.
```

Mantenha-os no package de aplicação da integração.

O domínio de ordens só precisa saber que o catálogo não respondeu a tempo.

---

### 5. Configurar RestClient com JDK client

```java
@Bean
RestClient catalogRestClient(
        RestClient.Builder builder,
        CatalogClientProperties clientProperties,
        CatalogTimeoutProperties timeoutProperties,
        CatalogHttpErrorTranslator errorTranslator
) {
    HttpClient jdkClient =
            HttpClient
                .newBuilder()
                .connectTimeout(
                    timeoutProperties.connect()
                )
                .build();

    JdkClientHttpRequestFactory requestFactory =
            new JdkClientHttpRequestFactory(
                jdkClient
            );

    requestFactory.setReadTimeout(
            timeoutProperties.response()
    );

    return builder
            .baseUrl(
                clientProperties
                    .baseUrl()
                    .toString()
            )
            .requestFactory(
                requestFactory
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

Para responses pequenas, o read timeout atende o laboratório imperativo.

Documente que ele não representa necessariamente um deadline absoluto de toda a jornada.

---

### 6. Criar classificador imperativo

Procure tipos na cause chain:

```text
HttpConnectTimeoutException:
CONNECT.

HttpTimeoutException:
RESPONSE.

SocketTimeoutException:
READ.
```

Se a causa for `ConnectException` sem timeout:

```text
unavailable.
```

Não classifique por mensagem.

---

### 7. Atualizar RestClient gateway

Na captura de `ResourceAccessException`:

```java
catch (
    ResourceAccessException exception
) {
    Optional<CatalogTimeoutStage> stage =
            timeoutClassifier
                .classify(
                    exception
                );

    if (stage.isPresent()) {
        throw new ProductCatalogTimeoutException(
                stage.get()
        );
    }

    throw new ProductCatalogUnavailableException();
}
```

Preserve exceptions já traduzidas.

---

### 8. Configurar WebClient com Reactor Netty

```java
@Bean
WebClient catalogWebClient(
        WebClient.Builder builder,
        ReactiveCatalogClientProperties clientProperties,
        CatalogTimeoutProperties timeoutProperties
) {
    HttpClient httpClient =
            HttpClient
                .create()
                .option(
                    ChannelOption.CONNECT_TIMEOUT_MILLIS,
                    Math.toIntExact(
                        timeoutProperties
                            .connect()
                            .toMillis()
                    )
                )
                .responseTimeout(
                    timeoutProperties.response()
                )
                .doOnConnected(
                    connection ->
                        connection.addHandlerLast(
                            new ReadTimeoutHandler(
                                timeoutProperties
                                    .readIdle()
                                    .toMillis(),
                                TimeUnit.MILLISECONDS
                            )
                        )
                );

    return builder
            .baseUrl(
                clientProperties
                    .baseUrl()
                    .toString()
            )
            .clientConnector(
                new ReactorClientHttpConnector(
                    httpClient
                )
            )
            .defaultHeader(
                HttpHeaders.ACCEPT,
                MediaType.APPLICATION_JSON_VALUE
            )
            .build();
}
```

O `ReadTimeoutHandler` mede inatividade de leitura.

---

### 9. Adicionar deadline total reativo

No final do pipeline do gateway:

```java
.timeout(
    timeoutProperties.total()
)
```

Aplique depois de compor:

- token;
- correlation;
- HTTP;
- mapper.

Traduza `TimeoutException` para:

```text
CatalogTimeoutStage.TOTAL.
```

Não remapeie uma `ProductCatalogTimeoutException` já existente.

---

### 10. Classificar falhas do WebClient

Cause types possíveis:

```text
ConnectTimeoutException:
CONNECT.

ReadTimeoutException:
READ.

TimeoutException do operator:
TOTAL.

failure de response timeout:
RESPONSE.
```

Encapsulamentos podem variar por client.

Teste a configuração concreta do projeto.

---

### 11. Criar translator reativo seguro

Ordem conceitual:

```java
.onErrorMap(
    this::isConnectTimeout,
    exception ->
        new ProductCatalogTimeoutException(
            CONNECT
        )
)
.onErrorMap(
    this::isReadTimeout,
    exception ->
        new ProductCatalogTimeoutException(
            READ
        )
)
.timeout(
    timeoutProperties.total()
)
.onErrorMap(
    TimeoutException.class,
    exception ->
        new ProductCatalogTimeoutException(
            TOTAL
        )
);
```

Não permita que o último `onErrorMap` capture exception já traduzida.

---

### 12. Criar endpoint lento no provider

Somente profile `timeout-lab`:

```java
@RestController
@Profile("timeout-lab")
class CatalogDelayController {

    @GetMapping(
        "/dev/delay-before-response"
    )
    Mono<ResponseEntity<String>> delayBeforeResponse(
            @RequestParam
            Duration delay
    ) {
        return Mono
                .delay(
                    delay
                )
                .map(
                    ignored ->
                        ResponseEntity.ok(
                            "ready"
                        )
                );
    }
}
```

Não habilite em release.

---

### 13. Criar slow-body endpoint

Use Reactor Netty ou WebFlux para:

- enviar headers;
- emitir primeira parte;
- aguardar;
- emitir segunda parte.

O objetivo é testar inatividade durante body.

Não use payloads grandes.

---

### 14. Criar DelayedCatalogStubServer

Em `src/test`:

```java
final class DelayedCatalogStubServer
        implements AutoCloseable {

    private DisposableServer server;

    URI start(
            Duration delay
    ) {
        server =
            HttpServer
                .create()
                .port(
                    0
                )
                .route(
                    routes ->
                        routes.get(
                            "/api/v1/products/{code}/availability",
                            (request, response) ->
                                Mono
                                    .delay(
                                        delay
                                    )
                                    .then(
                                        response
                                            .header(
                                                HttpHeaderNames.CONTENT_TYPE,
                                                MediaType.APPLICATION_JSON_VALUE
                                            )
                                            .sendString(
                                                Mono.just(
                                                    validBody()
                                                )
                                            )
                                            .then()
                                    )
                        )
                )
                .bindNow();

        return URI.create(
            "http://localhost:"
            + server.port()
        );
    }
}
```

---

### 15. Criar TcpBlackholeServer

O servidor:

1. abre `ServerSocket`;
2. aceita conexão;
3. não envia resposta;
4. fecha no teardown.

Use executor daemon.

Garanta cleanup em `close()`.

Esse fixture testa espera por response/read.

---

### 16. Testar properties

Cenários:

- duration positiva;
- zero rejeitado;
- negativa rejeitada;
- total menor que response rejeitado;
- binding `300ms`;
- binding `1s`.

---

### 17. Testar RestClient read timeout

Servidor demora dois segundos.

Client possui timeout de 300 ms.

Esperado:

```text
ProductCatalogTimeoutException;

stage:
RESPONSE ou READ
conforme factory concreta.
```

O teste deve validar a categoria documentada do projeto.

---

### 18. Não afirmar milissegundo exato

Mensure para diagnóstico, mas use margem.

Exemplo:

```text
maior que 200 ms;

menor que 2 s.
```

Não espere exatamente 300 ms.

Scheduler e sistema operacional introduzem variação.

---

### 19. Testar connection refused

Use porta fechada local.

Esperado:

```text
ProductCatalogUnavailableException.
```

Isso prova a diferença entre indisponibilidade rápida e timeout.

---

### 20. Testar connect timeout

Connect timeout real é sensível à rede e ao sistema operacional.

Crie dois níveis:

```text
configuration test:
obrigatório.

environment integration test:
tag integration-network.
```

O gate comum não depende de endereço externo não roteável.

---

### 21. Testar WebClient response timeout

Servidor atrasa o início da response.

Use `StepVerifier`:

```java
StepVerifier.create(
        gateway.findAvailability(
            code
        )
)
.expectErrorSatisfies(
    error -> {
        assertThat(
            error
        )
        .isInstanceOf(
            ProductCatalogTimeoutException.class
        );

        assertThat(
            ((ProductCatalogTimeoutException) error)
                .stage()
        )
        .isEqualTo(
            CatalogTimeoutStage.RESPONSE
        );
    }
)
.verify();
```

---

### 22. Testar WebClient read timeout

O stub envia parte do body e pausa acima de `readIdle`.

Esperado:

```text
CatalogTimeoutStage.READ.
```

O body incompleto não deve virar contract error se a causa foi timeout de leitura claramente identificada.

---

### 23. Testar deadline total com virtual time

Crie uma função que recebe:

```text
Mono.never().
```

Use:

```java
StepVerifier
    .withVirtualTime(
        () ->
            applyTotalDeadline(
                Mono.never()
            )
    )
    .thenAwait(
        properties.total()
    )
    .expectErrorSatisfies(
        ...
    )
    .verify();
```

Isso testa o operator sem esperar em tempo real.

---

### 24. Testar cancelamento upstream

Use:

```text
doOnCancel.
```

Quando o deadline total disparar, confirme cancelamento do upstream.

Não crie thread órfã.

---

### 25. Testar token lento

Token provider retorna após tempo maior que o total.

Esperado:

```text
TOTAL timeout;

nenhuma request HTTP enviada.
```

Isso comprova que o deadline cobre a cadeia completa.

---

### 26. Testar mapper lento

Não use `Thread.sleep` no event loop.

Para teste didático, crie publisher artificial atrasado antes do mapper.

Confirme que o total ainda se aplica.

---

### 27. Criar Problem Details

Mapeamento:

```text
ProductCatalogTimeoutException:
504.
```

Body:

```json
{
  "type": "urn:problem:integration:catalog-timeout",
  "title": "Product catalog timeout",
  "status": 504,
  "detail": "The product catalog did not respond in time.",
  "code": "product_catalog_timeout",
  "correlationId": "corr-459-001"
}
```

Não exponha `stage` publicamente neste contrato.

Ele fica em logs e métricas.

---

### 28. Criar métricas

```java
catalogClientMetrics.recordTimeout(
    clientType,
    stage
);
```

Tags:

```text
client.type=restclient|webclient;

failure.kind=timeout_connect|timeout_response|timeout_read|timeout_total;

route.template=product-availability.
```

---

### 29. Testar cardinalidade

Policy test falha se tags usarem:

- product code;
- correlation ID;
- host dinâmico;
- URL completa;
- exception message.

---

### 30. Criar log sentinel test

Sentinelas:

```text
token-timeout-sentinel;

product-timeout-sentinel;

remote-body-timeout-sentinel.
```

Execute timeouts nos dois clients.

Nenhuma sentinela aparece nos logs de falha.

---

### 31. Criar NoRetryBeforeTimeoutPolicyTest

Falhe se o código principal contiver:

```text
.retry(;

.retryWhen(;

Retry.backoff;

Retry.fixedDelay.
```

A aula 460 removerá essa proibição de forma controlada.

---

### 32. Criar matriz de testes

Arquivo:

```text
docs/TIMEOUT_TEST_MATRIX.md
```

| Client | Cenário | Esperado |
|---|---|---|
| RestClient | porta fechada | unavailable |
| RestClient | blackhole | timeout |
| WebClient | response lenta | RESPONSE |
| WebClient | body parado | READ |
| WebClient | pipeline infinito | TOTAL |
| Ambos | sem token | credentials unavailable |
| Ambos | 503 rápido | unavailable |

---

### 33. Criar runbook

Arquivo:

```text
docs/TIMEOUT_RUNBOOK.md
```

Perguntas:

- qual client;
- qual stage;
- qual provider;
- qual p95/p99;
- houve mudança de deploy;
- pool está saturado;
- DNS está lento;
- TLS está lento;
- provider recebeu request;
- correlation aparece nos dois lados;
- timeout aumentou após mudança;
- caller desistiu antes.

---

### 34. Não aumentar timeout primeiro

Durante incidente, aumentar timeout pode piorar:

- ocupação;
- filas;
- pool;
- cascata.

Antes, identifique o stage.

---

### 35. Executar testes imperativos

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=CatalogTimeoutPropertiesTest,RestClientConnectTimeoutConfigurationTest,RestClientReadTimeoutIntegrationTest,CatalogTimeoutProblemDetailsTest,CatalogTimeoutMetricsTest `
  test
```

---

### 36. Executar testes reativos

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=CatalogTimeoutPropertiesTest,WebClientResponseTimeoutIntegrationTest,WebClientReadTimeoutIntegrationTest,ReactiveTotalDeadlineTest,CatalogTimeoutProblemDetailsTest,CatalogTimeoutMetricsTest,NoRetryBeforeTimeoutPolicyTest `
  test
```

---

### 37. Executar teste de rede separado

Quando o ambiente suportar:

```powershell
.\mvnw.cmd `
  -Dgroups=integration-network `
  test
```

Não dependa de internet pública.

---

### 38. Executar fluxo local

Configure provider com atraso maior que o budget.

Execute consumers.

Valide:

```text
504;

correlation;

métrica;

log seguro;

nenhum retry.
```

---

### 39. Remover profile de atraso do uso normal

O endpoint `/dev` só existe em:

```text
timeout-lab.
```

Policy test falha se ele estiver ativo em:

```text
release.
```

---

### 40. Executar gates

Em cada consumer:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- timeout properties;
- timeout translation;
- Problem Details;
- metrics;
- logs;
- cancellation;
- no retry;
- no secrets.

---

### 41. Atualizar documentos de design

No documento de RestClient:

```text
connect e read timeout:
implementados.
```

No documento de WebClient:

```text
connect, response,
read idle e total:
implementados.
```

---

### 42. Registrar limitações

Ainda faltam:

```text
pool acquisition timeout;

TLS handshake timeout real;

deadline propagado;

retry com backoff;

circuit breaker;

load test;

valores produtivos baseados em percentis.
```

---

## Entendendo o que foi feito

### Espera deixou de ser implícita

Os clients agora possuem limites configurados.

### O orçamento veio antes dos números

Os valores foram derivados do prazo do caller.

### Estágios foram diferenciados

Connect, response, read e total não foram tratados como sinônimos.

### Falha rápida foi separada de timeout

Connection refused continua indisponibilidade.

### RestClient e WebClient receberam controles próprios

A aula não inventou uma abstração falsa sobre bibliotecas diferentes.

### O domínio recebeu uma exception estável

Detalhes de JDK, Netty e Reactor permaneceram no adapter.

### Testes ficaram determinísticos

Servidor lento, blackhole e virtual time reduziram dependência do ambiente.

### Retry permaneceu ausente

A próxima aula começará sobre uma base limitada e observável.

---

## Erros comuns importantes

### Usar o mesmo timeout em todas as integrações

Cada operação possui orçamento e risco próprios.

### Confiar no default

Defaults podem ser longos, ausentes ou inadequados.

### Configurar apenas connect timeout

A conexão pode abrir e a response nunca chegar.

### Configurar apenas read timeout

A jornada total pode ultrapassar o prazo.

### Tratar connection refused como timeout

Diagnóstico e métricas ficam errados.

### Testar com endereço aleatório da internet

O gate se torna instável.

### Asserir duração exata

Scheduler e sistema operacional variam.

### Expor stage no Problem Details sem necessidade

Detalhes operacionais vazam para o contrato público.

### Aumentar timeout durante todo incidente

A ocupação pode piorar.

### Adicionar retry junto com timeout

Fica difícil comprovar cada política separadamente.

---

## Comandos úteis

### Testes RestClient

```powershell
.\mvnw.cmd `
  -Dtest=CatalogTimeoutPropertiesTest,RestClientConnectTimeoutConfigurationTest,RestClientReadTimeoutIntegrationTest `
  test
```

### Testes WebClient

```powershell
.\mvnw.cmd `
  -Dtest=WebClientResponseTimeoutIntegrationTest,WebClientReadTimeoutIntegrationTest,ReactiveTotalDeadlineTest `
  test
```

### Policies

```powershell
.\mvnw.cmd `
  -Dtest=CatalogTimeoutProblemDetailsTest,CatalogTimeoutMetricsTest,NoRetryBeforeTimeoutPolicyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar retry antecipado

```powershell
git grep `
  -n `
  -E `
  "\\.retry\\(|\\.retryWhen\\(|Retry\\.backoff|Retry\\.fixedDelay"
```

---

## Exercício guiado

### Parte 1 — Budget

Defina o prazo do fluxo e a reserva.

### Parte 2 — Semântica

Diferencie connect, response, read e total.

### Parte 3 — Properties

Modele durations positivas.

### Parte 4 — RestClient

Configure JDK client e request factory.

### Parte 5 — WebClient

Configure Reactor Netty e deadline.

### Parte 6 — Exceptions

Traduza causes sem mensagens.

### Parte 7 — Test fixtures

Crie servidor lento e blackhole.

### Parte 8 — Observabilidade

Crie metrics, logs e Problem Details.

### Parte 9 — Policies

Impeça retry antecipado e endpoints dev em release.

### Parte 10 — Gate

Execute os dois consumidores.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 458 foi preservada;
- orçamento de latência foi criado;
- prazo do client é menor que o caller;
- connect timeout foi explicado;
- response timeout foi explicado;
- read timeout foi explicado;
- write timeout foi contextualizado;
- pool acquisition foi diferenciado;
- TLS handshake foi registrado como gap;
- deadline total foi diferenciado;
- values de laboratório foram marcados como didáticos;
- properties aceitam Duration;
- values zero e negativos são rejeitados;
- RestClient possui connect timeout;
- RestClient possui read timeout;
- WebClient possui connect timeout;
- WebClient possui response timeout;
- WebClient possui read idle timeout;
- pipeline reativo possui total timeout;
- nenhuma chamada `.block()` foi adicionada;
- `ProductCatalogTimeoutException` foi criada;
- stages CONNECT, RESPONSE, READ e TOTAL foram modelados;
- causes são classificadas por tipo;
- messages não são usadas para classificação;
- connection refused permanece indisponibilidade;
- timeout público retorna `504`;
- indisponibilidade rápida permanece `503`;
- Problem Details não expõe internals;
- métricas usam baixa cardinalidade;
- logs não contêm token ou body;
- DelayedCatalogStubServer foi criado;
- TcpBlackholeServer foi criado;
- testes não dependem de internet;
- duração exata não é asserida;
- virtual time testa deadline reativo;
- cancelamento upstream foi testado;
- token lento foi testado;
- endpoint dev está restrito ao profile de laboratório;
- retry não foi implementado;
- policy test impede retry antecipado;
- documentação e runbook foram criados;
- limitações foram registradas;
- produção pública permanece NO-GO;
- gates dos dois consumers foram executados;
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
  "\\.retry\\(|\\.retryWhen\\(|Retry\\.backoff|Retry\\.fixedDelay|Thread\\.sleep|Bearer ey|CATALOG_SERVICE_TOKEN:"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider `
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
git commit -m "feat(m16): configurar timeouts dos clientes HTTP"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- secret;
- `.env`;
- endpoint dev ativo em release;
- retry;
- circuit breaker;
- valor produtivo inventado;
- dump de logs;
- teste dependente de internet;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as integrações deixaram de esperar indefinidamente.

O fluxo passou a possuir:

```text
orçamento;

connect timeout;

response timeout;

read timeout;

deadline total;

tradução;

métricas;

testes.
```

No `RestClient`, configuramos:

```text
connect timeout
no JDK HttpClient;

read timeout
na request factory.
```

No `WebClient`, configuramos:

```text
connect timeout;

response timeout;

read idle timeout;

timeout total do Mono.
```

A principal decisão foi:

```text
timeout não é
um detalhe do client;

é uma política operacional
derivada do prazo
do fluxo chamador.
```

Também ficou claro:

```text
connection refused
não é timeout;

read timeout
não é deadline total;

timeout
não é retry;

valor de laboratório
não é valor produtivo.
```

As falhas agora produzem categorias observáveis.

O consumidor consegue responder com `504` sem expor internals.

Logs e métricas mostram o stage de forma segura.

Os testes reproduzem lentidão sem depender de serviços externos.

A próxima aula será:

```text
460 - M16.05 - Retry com backoff
```

Nela, você irá:

- decidir quais falhas podem ser repetidas;
- preservar o orçamento total;
- configurar número máximo de tentativas;
- implementar backoff;
- adicionar jitter;
- impedir retry de `4xx` e contract errors;
- comparar retry síncrono e reativo;
- testar tentativas com tempo virtual;
- observar amplificação de carga;
- preparar a base para circuit breaker.

---

# Material complementar

## Checkpoint final

- [ ] Derivei timeouts de um orçamento.
- [ ] Diferenciei os estágios.
- [ ] Configurei RestClient e WebClient.
- [ ] Testei lentidão e cancelamento.
- [ ] Mantive retry fora desta aula.

---

## Troubleshooting adicional

### RestClient continua esperando

Confirme se o bean utilizado recebeu a request factory configurada.

### WebClient ignora response timeout

Confirme se o `ReactorClientHttpConnector` usa o `HttpClient` configurado.

### Read timeout aparece como contract error

Revise a ordem dos `onErrorMap` e a cause chain.

### TOTAL captura timeout já classificado

Use predicate para preservar `ProductCatalogTimeoutException`.

### Teste de connect timeout oscila

Remova do gate comum e use fixture de rede controlado.

### Blackhole não fecha

Implemente `AutoCloseable` e encerre socket e executor.

### StepVerifier demora em tempo real

Use virtual time apenas para operators; timeout de transporte exige integração real.

### Métrica cria milhares de séries

Remova product code, URL e correlation das tags.

### Timeout desaparece após retry futuro

A próxima aula precisa preservar deadline total.

### Alguém quer aumentar para trinta segundos

Revise SLO, percentis, pool e efeito cascata antes.

---

## Perguntas de revisão

1. O que é orçamento de latência?
2. Timeout do client pode ser maior que o caller?
3. O que connect timeout limita?
4. Connection refused é timeout?
5. O que response timeout limita?
6. O que read timeout observa?
7. Read timeout é deadline total?
8. O que pool acquisition mede?
9. TLS possui outro estágio?
10. Por que usar Duration?
11. Como classificar causes?
12. Pode usar exception message?
13. Qual status público usamos?
14. Qual status fica para indisponibilidade rápida?
15. O stage vai no Problem Details?
16. Product code vai em tag?
17. Como testar deadline reativo?
18. Retry foi implementado?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Divisão do prazo do fluxo.
2. Não.
3. Estabelecer conexão.
4. Não.
5. Espera pela resposta.
6. Período sem bytes.
7. Não.
8. Espera por conexão do pool.
9. Sim.
10. Para configuração tipada.
11. Pela cadeia de tipos.
12. Não.
13. `504`.
14. `503`.
15. Não.
16. Não.
17. StepVerifier com virtual time.
18. Não.
19. Retry com backoff.
20. Critérios, tentativas, backoff e jitter.

---

## Desafio opcional

Implemente propagação de prazo restante por um header interno:

```text
X-Request-Deadline-Epoch-Millis.
```

Antes de usar:

- valide origem confiável;
- limite valores;
- use clock injetável;
- nunca aumente o prazo recebido;
- não exponha como autenticação;
- teste clock skew;
- documente compatibilidade.

O desafio não altera a implementação base.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 459 - M16.04 - Timeouts

- Derivei timeouts de um orçamento de latência.
- Diferenciei timeout e deadline.
- Mantive o prazo do client menor que o caller.
- Diferenciei connect, acquisition, TLS, response, read, write e total.
- Entendi que connection refused não é timeout.
- Criei `CatalogTimeoutProperties`.
- Usei `Duration`.
- Rejeitei values zero e negativos.
- Criei `CatalogTimeoutStage`.
- Criei `ProductCatalogTimeoutException`.
- Configurei connect timeout no RestClient.
- Configurei read timeout no RestClient.
- Criei classificador por cause types.
- Configurei connect timeout no WebClient.
- Configurei response timeout no WebClient.
- Configurei read idle timeout no WebClient.
- Configurei deadline total no pipeline reativo.
- Preservei exceptions já classificadas.
- Mapeei timeout público para `504`.
- Mantive indisponibilidade rápida em `503`.
- Criei Problem Details seguro.
- Criei métricas de baixa cardinalidade.
- Criei logs sem token ou body.
- Criei `DelayedCatalogStubServer`.
- Criei `TcpBlackholeServer`.
- Testei response lenta.
- Testei body parado.
- Testei connection refused.
- Separei connect timeout dependente do ambiente.
- Usei virtual time para deadline total.
- Testei cancelamento upstream.
- Testei token provider lento.
- Evitei asserções exatas de duração.
- Criei `NoRetryBeforeTimeoutPolicyTest`.
- Restrigi endpoints de atraso ao profile de laboratório.
- Criei `LATENCY_BUDGET.md`.
- Criei `TIMEOUT_SEMANTICS.md`.
- Criei `TIMEOUT_TEST_MATRIX.md`.
- Criei `TIMEOUT_RUNBOOK.md`.
- Registrei gaps de pool, TLS e valores produtivos.
- Não implementei retry.
- Mantive produção pública como NO-GO.
- Próxima aula: Retry com backoff.
```

---

## Referência técnica curta

- [Spring Framework — REST Clients](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
- [Spring Framework — WebClient Configuration and Timeouts](https://docs.spring.io/spring-framework/reference/web/webflux-webclient/client-builder.html)
- [Reactor Netty — HTTP Client Timeouts](https://projectreactor.io/docs/netty/release/reference/http-client.html)
- [Spring Framework — JdkClientHttpRequestFactory](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/client/JdkClientHttpRequestFactory.html)
- [Project Reactor — Handling Errors](https://projectreactor.io/docs/core/release/reference/coreFeatures/error-handling.html)
- [Project Reactor — Testing with StepVerifier](https://projectreactor.io/docs/core/release/reference/testing.html)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

Regra final:

```text
timeouts em integrações HTTP devem ser derivados do orçamento do caller e aplicados por estágio: connect limita o estabelecimento, response limita a espera pela resposta, read limita inatividade de bytes e um deadline total protege a jornada completa; RestClient e WebClient recebem configurações adequadas às suas implementações, exceptions são classificadas por tipo e traduzidas para uma categoria estável, métricas distinguem o estágio sem alta cardinalidade, testes usam servidores lentos e blackholes controlados e retry permanece ausente até que idempotência, orçamento restante, backoff e amplificação de carga sejam analisados explicitamente.
```
