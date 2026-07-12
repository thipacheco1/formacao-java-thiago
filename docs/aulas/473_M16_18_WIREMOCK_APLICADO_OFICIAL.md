# 473 - M16.18 - WireMock aplicado

## Apresentação da aula

Na aula 472, as integrações do Módulo 16 deixaram de depender apenas de código e documentação dispersa.

O laboratório passou a possuir contratos versionados:

```text
OpenAPI para HTTP;

AsyncAPI e JSON Schema para webhooks;

WSDL e XSD para SOAP;

manifesto próprio para CSV;

catálogo central de erros;

ownership;

examples executáveis;

gates de compatibilidade.
```

Agora precisamos utilizar esses contratos para testar os clients HTTP sem depender do `catalog-provider` real.

A pergunta central será:

```text
como simular
um provider HTTP
com fidelidade suficiente
para testar sucesso,
erros,
latência,
falhas de conexão,
retries,
circuit breaker,
bulkhead
e fallback?
```

A ferramenta aplicada será:

```text
WireMock.
```

WireMock executa um servidor HTTP controlado pelos testes.

Ele permite:

- registrar stubs;
- combinar método, URL, headers e body;
- devolver status, headers e payload;
- introduzir delays;
- interromper conexões;
- manter cenários stateful;
- registrar requests recebidas;
- verificar quantidade e conteúdo das chamadas;
- carregar mappings por arquivo;
- utilizar porta dinâmica.

WireMock não será usado para esconder um contrato inexistente.

A fonte de verdade continuará sendo:

```text
contracts/catalog-http/v1/openapi.yaml.
```

Os examples da aula 472 serão reutilizados nas responses.

A organização ficará:

```text
contracts/
└── catalog-http/v1/
    ├── openapi.yaml
    └── examples/
        ├── availability-available.json
        ├── availability-unavailable.json
        ├── product-not-found.problem.json
        ├── catalog-unavailable.problem.json
        ├── reservation-created.json
        └── validation-error.problem.json
```

Nos consumers:

```text
order-consumer/
└── src/test/java/
    └── .../wiremock/

order-consumer-reactive/
└── src/test/java/
    └── .../wiremock/
```

Componentes de teste:

```text
CatalogWireMockServer;

CatalogWireMockStubs;

CatalogContractExampleLoader;

CatalogRequestMatchers;

CatalogWireMockAssertions;

WireMockResilienceTestSupport.
```

O servidor utilizará:

```text
porta dinâmica;

loopback;

request journal habilitado;

proxy desabilitado;

recording desabilitado;

admin API somente local ao teste.
```

A versão ficará explicitamente fixada no build.

Baseline didática:

```xml
<wiremock.version>3.13.2</wiremock.version>
```

O número deve ser atualizado somente com:

- leitura do changelog;
- execução dos testes;
- validação do JUnit extension;
- validação dos faults;
- validação das APIs utilizadas.

A aula usará a extensão JUnit Jupiter em testes focados e um suporte programático quando o Spring context precisar conhecer a URL antes de criar o client.

O primeiro cenário será sucesso:

```http
GET /api/v1/products/SKU-1001/availability
Accept: application/json
X-Correlation-Id: test-correlation
Authorization: Bearer <token>
```

Response:

```http
200 OK
Content-Type: application/json
```

Body:

```json
{
  "productCode": "SKU-1001",
  "available": true,
  "quantity": 25,
  "observedAt": "2026-07-12T15:00:00Z",
  "source": "LIVE"
}
```

O stub não deverá aceitar apenas qualquer `GET`.

Ele verificará:

- path;
- product code;
- `Accept`;
- authorization presente;
- correlation ID presente;
- ausência de query inesperada.

Um matcher amplo como:

```java
get(urlMatching(".*"))
```

poderia permitir que o client chamasse uma URL errada e o teste ainda passasse.

O laboratório terá uma regra:

```text
stubs específicos
antes de stubs genéricos.
```

Também existirá um catch-all de baixa prioridade.

Uma request não reconhecida produzirá:

```http
599 WireMock Unmatched Request
```

O teste ainda consultará o journal de unmatched requests e falhará com diagnóstico.

O código `599` é somente uma convenção de teste.

Ele não entra no contrato público.

Os cenários de erro cobrirão:

```text
400 validation;

401 authentication;

403 authorization;

404 product not found;

409 idempotency conflict;

429 rate limited;

500 invalid upstream behavior;

502 bad gateway;

503 unavailable;

504 gateway timeout;

malformed JSON;

body vazio;

media type incorreto;

campo obrigatório ausente;

enum desconhecido.
```

A resposta fake não será considerada automaticamente válida apenas por ter status correto.

O client precisa provar:

- classificação de erro;
- exception pública;
- retryability;
- ausência de vazamento;
- quantidade de tentativas;
- métricas;
- comportamento da resiliência.

A aula 459 definiu timeout.

WireMock introduzirá um fixed delay maior que o deadline.

A aula 460 definiu retry.

Um scenario retornará `503` na primeira tentativa e `200` na segunda.

A aula 461 definiu circuit breaker.

WireMock produzirá falhas suficientes para abrir o breaker.

Depois de aberto, uma nova chamada deverá ser rejeitada localmente sem chegar ao servidor fake.

A aula 462 definiu bulkhead.

WireMock segurará quatro requests com delay.

A quinta deverá ser recusada pelo consumer antes de chegar ao provider.

A aula 463 definiu fallback.

WireMock simulará timeout e o consumer devolverá snapshot válido somente para `PREVIEW`.

A aula 464 definiu idempotência.

O primeiro `POST /reservations` falhará transitoriamente.

O retry deverá repetir:

- a mesma `Idempotency-Key`;
- o mesmo payload;
- a mesma intenção.

WireMock não substitui o teste do provider idempotente.

Ele apenas prova o comportamento do client.

A aula 472 introduziu tests de compatibilidade estrutural.

Esta aula ainda não implementará Pact ou provider verification completa.

Isso ficará para:

```text
474 - M16.19 - Testes de contrato.
```

Ao final, você deverá explicar:

```text
por que WireMock
não substitui OpenAPI;

por que stub amplo
gera falso positivo;

por que o journal
precisa ser verificado;

por que cenários
precisam ser resetados;

por que fault de conexão
é diferente de HTTP 503;

por que um retry test
precisa contar requests;

por que circuit open
deve reduzir chamadas;

por que exemplos do contrato
não devem ser duplicados.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
471:
Upload download em integracoes.

472:
Contratos de integracao.

473:
WireMock aplicado.

474:
Testes de contrato.

475:
RabbitMQ fundamentos.
```

A aula 472 respondeu:

```text
como declarar
e governar
as promessas
entre sistemas?
```

A aula 473 responderá:

```text
como simular
o provider HTTP
para testar consumers
de forma determinística?
```

Nesta aula:

```text
WireMock:
sim.

JUnit Jupiter:
sim.

Java DSL:
sim.

request matching:
sim.

delays e faults:
sim.

stateful scenarios:
sim.

verification:
sim.

recording de produção:
não.

Pact:
próxima aula.

RabbitMQ:
aula 475.
```

A regra central será:

```text
um stub só é útil
quando falha
diante de uma request errada
e reproduz
o comportamento contratual
que o teste pretende validar.
```

---

## Objetivo prático

Ao final, os consumers terão:

```text
CatalogWireMockExtensionFactory;

CatalogWireMockStubs;

CatalogWireMockScenarios;

CatalogContractExampleLoader;

CatalogWireMockRequestAssertions;

WireMockTestStateCleaner;

WireMockClientPropertiesSupport.
```

Testes imperativos:

```text
RestClientAvailabilityWireMockTest;

RestClientAvailabilityErrorWireMockTest;

RestClientTimeoutWireMockTest;

RestClientRetryWireMockTest;

RestClientCircuitBreakerWireMockTest;

RestClientBulkheadWireMockTest;

RestClientFallbackWireMockTest;

RestClientReservationIdempotencyWireMockTest.
```

Testes reativos:

```text
WebClientAvailabilityWireMockTest;

WebClientAvailabilityErrorWireMockTest;

WebClientTimeoutWireMockTest;

WebClientRetryWireMockTest;

WebClientCircuitBreakerWireMockTest;

WebClientBulkheadWireMockTest;

WebClientFallbackWireMockTest;

WebClientCancellationWireMockTest.
```

Testes de infraestrutura fake:

```text
WireMockContractExamplesTest;

WireMockUnmatchedRequestTest;

WireMockScenarioIsolationTest;

WireMockRequestJournalTest;

WireMockStubPriorityTest;

WireMockSecuritySanitizationTest.
```

Documentação:

```text
docs/wiremock/
├── WIREMOCK_TEST_PROFILE.md
├── WIREMOCK_SCENARIO_CATALOG.md
├── WIREMOCK_FAULT_MATRIX.md
├── WIREMOCK_STUB_POLICY.md
└── WIREMOCK_TROUBLESHOOTING.md
```

Você irá:

1. adicionar a dependência;
2. criar servidor dinâmico;
3. conectar o client;
4. reutilizar examples;
5. criar stubs de sucesso;
6. criar stubs de erro;
7. validar requests;
8. configurar prioridades;
9. detectar unmatched;
10. simular delay;
11. simular faults;
12. criar scenarios;
13. verificar retries;
14. verificar circuit breaker;
15. verificar bulkhead;
16. verificar fallback;
17. verificar idempotency key;
18. testar WebClient;
19. limpar estado;
20. preparar testes de contrato.

---

## Conceito essencial

### Mock, stub e fake

No cotidiano, os termos são usados de forma flexível.

Nesta aula:

```text
stub:
resposta configurada
para uma request.

mock HTTP:
servidor verificável
que registra interações.

fake:
implementação simplificada
com comportamento executável.
```

WireMock pode exercer as três funções.

---

### Service virtualization

O consumer chama um servidor HTTP real no loopback.

Ele utiliza:

- DNS/IP local;
- socket;
- codec HTTP;
- serialization;
- headers;
- timeout;
- client connector.

Isso oferece mais fidelidade do que mockar diretamente a interface Java do gateway.

---

### Porta dinâmica

Use:

```text
dynamicPort.
```

Não fixe `8089`.

Portas fixas causam:

- conflito local;
- flakiness no CI;
- testes não paralelizáveis;
- dependência de processo externo.

---

### JUnit Jupiter

Modo declarativo:

```java
@WireMockTest
```

É simples para um servidor.

Modo programático:

```java
@RegisterExtension
static WireMockExtension wireMock =
        WireMockExtension
            .newInstance()
            .options(
                wireMockConfig()
                    .dynamicPort()
            )
            .build();
```

O modo programático permite configuração explícita e múltiplos servidores.

---

### Servidor programático e Spring

Quando o Spring context precisa da base URL antes da criação dos beans, uma solução é iniciar um `WireMockServer` de teste de forma controlada e registrar:

```text
integrations.catalog.base-url
```

com `DynamicPropertyRegistry`.

O lifecycle precisa parar o servidor depois da classe.

Não deixe processo órfão.

---

### Request matching

Matchers podem observar:

- método;
- URL;
- path;
- query;
- path template;
- headers;
- cookies;
- body;
- JSON;
- XML;
- multipart.

Prefira matching de path separado de query parameters quando a ordem da query não possui semântica.

---

### URL path template

WireMock 3 suporta path templates.

Exemplo:

```java
get(
    urlPathTemplate(
        "/api/v1/products/{productCode}/availability"
    )
)
.withPathParam(
    "productCode",
    equalTo("SKU-1001")
)
```

Isso reduz regex opaca.

---

### Headers

Valide headers contratuais.

Exemplos:

```text
Accept;

Content-Type;

Idempotency-Key;

If-None-Match;

Content-Digest;

X-Correlation-Id.
```

Não fixe token real.

Use matcher estrutural:

```text
Bearer + conteúdo não vazio.
```

---

### Body JSON

Para request completa:

```java
equalToJson(
    expectedJson,
    false,
    false
)
```

A ordem de propriedades JSON não importa.

`ignoreExtraElements=false` impede fields inesperados.

Para um field específico:

```java
matchingJsonPath(
    "$.quantity",
    equalTo("2")
)
```

Não substitua um contrato completo por um único JSONPath.

---

### Prioridade

Número menor representa maior prioridade.

Use:

```text
1:
casos específicos.

5:
casos normais.

10:
catch-all.
```

Um stub genérico não pode capturar uma request que deveria atingir um cenário de erro.

---

### Request journal

WireMock registra requests recebidas.

O journal permite:

- `verify`;
- contar requests;
- inspecionar headers;
- encontrar unmatched;
- analisar ordem aproximada;
- conferir body.

O journal é estado de teste.

Precisa ser resetado.

---

### Stub reset

Existem diferenças entre:

```text
reset de mappings;

reset do journal;

reset de scenarios;

reset completo.
```

A support class deve aplicar a limpeza necessária antes de cada teste.

Sem reset, um cenário pode começar no estado deixado pelo teste anterior.

---

### Delay

Fixed delay:

```java
withFixedDelay(2_000)
```

Ele simula latência antes da response.

O teste de timeout precisa possuir margem suficiente.

Exemplo:

```text
client timeout:
200 ms.

WireMock delay:
1.000 ms.
```

Evite diferença de poucos milissegundos.

---

### Random delay

WireMock suporta distribuições de atraso.

São úteis para testes de comportamento estatístico e cauda longa.

Não use random delay em assertions determinísticas unitárias.

Para o gate principal, use fixed delay.

---

### Chunked dribble

A response pode ser entregue em partes durante um período.

Esse cenário ajuda a testar:

- read timeout;
- cancelamento;
- body parcial;
- streaming.

Ele é diferente de fixed delay antes do primeiro byte.

---

### Fault

WireMock pode simular falhas abaixo do nível do status HTTP.

Exemplos:

```text
CONNECTION_RESET_BY_PEER;

EMPTY_RESPONSE;

MALFORMED_RESPONSE_CHUNK;

RANDOM_DATA_THEN_CLOSE.
```

O suporte real depende do client e transporte.

O teste deve validar a categoria interna, não a mensagem exata da exception de baixo nível.

---

### HTTP error versus fault

`503` significa:

```text
o servidor respondeu
com uma mensagem HTTP válida.
```

Connection reset significa:

```text
a conversa HTTP
não terminou normalmente.
```

Retry classifiers podem tratar ambos como transitórios, mas a origem é diferente.

---

### Scenario

Scenario é uma state machine local do WireMock.

Estado inicial:

```text
Scenario.STARTED.
```

Um stub pode:

- exigir estado;
- devolver response;
- mover para próximo estado.

Isso permite:

```text
503;

503;

200.
```

sem contador manual global.

---

### Verification

Exemplo:

```java
wireMock.verify(
    exactly(2),
    getRequestedFor(
        urlPathEqualTo(
            "/api/v1/products/SKU-1001/availability"
        )
    )
);
```

A assertion prova que retry ocorreu na quantidade esperada.

---

### Unmatched requests

Uma request não matched normalmente recebe response default.

Não aceite isso silenciosamente.

No final do teste:

```java
assertThat(
    wireMock.findUnmatchedRequests()
).isEmpty();
```

O catch-all também melhora o diagnóstico.

---

### Stubs e contrato

O stub deve carregar o mesmo example validado pela aula 472.

Evite manter:

```text
um JSON no contrato;

outro JSON no teste.
```

A duplicação cria drift.

---

### Recording

WireMock pode gravar tráfego de um sistema real.

No laboratório:

```text
recording:
desabilitado no CI.
```

Gravação pode capturar:

- Authorization;
- cookies;
- dados pessoais;
- hosts reais;
- payloads produtivos.

Se utilizada em homologação, exige allowlist, sanitização e revisão manual.

---

### Response templating

Templates podem refletir partes da request na response.

São úteis quando o contrato exige:

- correlation ID;
- resource ID;
- path param.

Use apenas quando necessário.

Templates complexos podem esconder uma fake application dentro do stub.

---

### Stateful versus regra de negócio

Scenario serve para controle de teste.

Não replique todo o domínio do provider no WireMock.

Se a simulação precisa de banco, regras completas e transactions, talvez seja necessário executar o provider real ou uma fake dedicada.

---

## Mão na massa guiada

### 1. Adicionar dependência

Nos dois consumers:

```xml
<properties>
    <wiremock.version>3.13.2</wiremock.version>
</properties>

<dependency>
    <groupId>org.wiremock</groupId>
    <artifactId>wiremock</artifactId>
    <version>${wiremock.version}</version>
    <scope>test</scope>
</dependency>
```

Não use dependency antiga do group `com.github.tomakehurst` para uma nova baseline 3.x.

---

### 2. Criar example loader

```java
@Component
class CatalogContractExampleLoader {

    private final Path contractRoot;

    String read(
            String fileName
    ) {
        Path path =
                contractRoot
                    .resolve(
                        "catalog-http/v1/examples"
                    )
                    .resolve(fileName)
                    .normalize();

        requireInsideRoot(
            path
        );

        return Files.readString(
            path,
            StandardCharsets.UTF_8
        );
    }
}
```

Esse `readString` é adequado para examples pequenos, não para uploads.

---

### 3. Criar extension factory

```java
final class CatalogWireMockExtensionFactory {

    static WireMockExtension create() {
        return WireMockExtension
                .newInstance()
                .options(
                    wireMockConfig()
                        .dynamicPort()
                        .bindAddress(
                            "127.0.0.1"
                        )
                )
                .build();
    }
}
```

O request journal permanece habilitado.

---

### 4. Criar teste JUnit simples

```java
@RegisterExtension
static WireMockExtension catalog =
        CatalogWireMockExtensionFactory
            .create();
```

No teste, use:

```java
catalog.baseUrl();
```

---

### 5. Conectar o RestClient

Crie o gateway com base URL do WireMock:

```java
RestClient restClient =
        RestClient
            .builder()
            .baseUrl(
                catalog.baseUrl()
            )
            .build();
```

Use as mesmas factories e interceptors da aplicação quando possível.

---

### 6. Conectar o WebClient

```java
WebClient webClient =
        WebClient
            .builder()
            .baseUrl(
                catalog.baseUrl()
            )
            .build();
```

Não use um codec diferente do runtime sem justificativa.

---

### 7. Criar stub de disponibilidade

```java
catalog.stubFor(
    get(
        urlPathTemplate(
            "/api/v1/products/{productCode}/availability"
        )
    )
    .withPathParam(
        "productCode",
        equalTo("SKU-1001")
    )
    .withHeader(
        "Accept",
        containing(
            "application/json"
        )
    )
    .withHeader(
        "Authorization",
        matching(
            "Bearer\\s+.+"
        )
    )
    .willReturn(
        okJson(
            examples.read(
                "availability-available.json"
            )
        )
    )
);
```

---

### 8. Verificar request de sucesso

```java
catalog.verify(
    exactly(1),
    getRequestedFor(
        urlPathEqualTo(
            "/api/v1/products/SKU-1001/availability"
        )
    )
    .withHeader(
        "X-Correlation-Id",
        matching(".+")
    )
);
```

---

### 9. Criar stub 404

Response:

```text
application/problem+json;

code:
product_not_found.
```

O test confirma:

```text
ProductNotFoundException;

zero retry;

uma request.
```

---

### 10. Criar stub 503

Response:

```text
code:
product_catalog_unavailable.
```

Use esse stub em testes de retry e circuit breaker.

---

### 11. Criar malformed JSON

```java
willReturn(
    ok()
        .withHeader(
            "Content-Type",
            "application/json"
        )
        .withBody(
            "{\"productCode\":"
        )
)
```

Esperado:

```text
ProductCatalogContractException;

sem fallback;

sem retry de contrato.
```

---

### 12. Criar media type incorreto

Response `200` com:

```text
text/html.
```

O body contém HTML sanitizado.

O client precisa rejeitar.

---

### 13. Criar campo ausente

Use um example inválido:

```json
{
  "productCode": "SKU-1001",
  "available": true
}
```

Se `quantity` é obrigatório, o mapper ou validator falha.

---

### 14. Criar catch-all

```java
catalog.stubFor(
    any(
        anyUrl()
    )
    .atPriority(10)
    .willReturn(
        aResponse()
            .withStatus(599)
            .withHeader(
                "Content-Type",
                "application/problem+json"
            )
            .withBody(
                """
                {
                  "code": "wiremock_unmatched_request",
                  "title": "Unmatched test request",
                  "status": 599
                }
                """
            )
    )
);
```

Ele não substitui a consulta ao unmatched journal.

---

### 15. Criar cleaner

Antes de cada teste:

```java
catalog.resetAll();

resilienceRegistryCleaner.reset();

testClock.resetIfMutable();

fallbackCache.clear();
```

Depois, registre stubs padrão necessários.

---

### 16. Testar unmatched

Chame path incorreto propositalmente.

Confirme:

```text
599;

journal contém unmatched;

diagnóstico mostra
closest stub.
```

Depois remova esse teste negativo do fluxo normal.

---

### 17. Criar fixed delay

```java
catalog.stubFor(
    get(
        urlPathEqualTo(
            "/api/v1/products/SKU-SLOW/availability"
        )
    )
    .willReturn(
        okJson(
            examples.read(
                "availability-available.json"
            )
        )
        .withFixedDelay(
            1_000
        )
    )
);
```

Client timeout:

```text
200 ms.
```

Esperado:

```text
ProductCatalogTimeoutException.
```

---

### 18. Testar timeout imperativo

Confirme:

- duração possui margem;
- exception normalizada;
- request chegou ao WireMock;
- resposta tardia não vira sucesso;
- permit do bulkhead foi liberado;
- métrica de timeout incrementou.

Não faça assertion de tempo em milissegundo exato.

---

### 19. Testar timeout reativo

Use `StepVerifier`.

Confirme:

```text
onError;

nenhum onNext;

cancelamento do pipeline;

permit liberado.
```

O server pode terminar a response depois que o client cancelou.

---

### 20. Criar retry scenario

```java
String scenario =
        "availability-retry-then-success";

catalog.stubFor(
    get(
        urlPathEqualTo(
            "/api/v1/products/SKU-RETRY/availability"
        )
    )
    .inScenario(scenario)
    .whenScenarioStateIs(
        Scenario.STARTED
    )
    .willSetStateTo(
        "second-attempt"
    )
    .willReturn(
        aResponse()
            .withStatus(503)
            .withHeader(
                "Content-Type",
                "application/problem+json"
            )
            .withBody(
                examples.read(
                    "catalog-unavailable.problem.json"
                )
            )
    )
);

catalog.stubFor(
    get(
        urlPathEqualTo(
            "/api/v1/products/SKU-RETRY/availability"
        )
    )
    .inScenario(scenario)
    .whenScenarioStateIs(
        "second-attempt"
    )
    .willReturn(
        okJson(
            examples.read(
                "availability-available.json"
            )
        )
    )
);
```

---

### 21. Verificar retry

```java
catalog.verify(
    exactly(2),
    getRequestedFor(
        urlPathEqualTo(
            "/api/v1/products/SKU-RETRY/availability"
        )
    )
);
```

Confirme backoff com Clock/scheduler controlado quando a arquitetura permitir.

---

### 22. Testar erro não retryable

Stub `404`.

Confirme:

```text
uma request;

zero backoff;

exception de negócio.
```

---

### 23. Criar connection reset

```java
catalog.stubFor(
    get(
        urlPathEqualTo(
            "/api/v1/products/SKU-RESET/availability"
        )
    )
    .willReturn(
        aResponse()
            .withFault(
                Fault.CONNECTION_RESET_BY_PEER
            )
    )
);
```

O RestClient e o WebClient podem produzir causes diferentes.

Ambos devem chegar à categoria interna:

```text
ProductCatalogUnavailableException.
```

---

### 24. Criar empty response

Use:

```text
Fault.EMPTY_RESPONSE.
```

Confirme classificação transitória conforme a policy.

---

### 25. Criar malformed response chunk

Use somente se o client connector do ambiente suporta o comportamento de forma estável.

Se houver diferença por sistema operacional, mova para teste de integração não bloqueante.

Não crie flakiness no gate principal.

---

### 26. Testar circuit breaker

Configure WireMock para `503` persistente.

Faça chamadas suficientes para atingir a janela mínima.

Confirme:

```text
breaker OPEN;

requests no WireMock
param de crescer;

chamada seguinte:
CircuitOpenException;

zero nova request.
```

Registre a contagem antes e depois da chamada rejeitada localmente.

---

### 27. Testar half-open

Avance o Clock ou aguarde a duração configurada de forma controlada.

WireMock muda para response `200`.

Confirme:

```text
trial permit;

request chega;

success;

breaker CLOSED.
```

Não use sleep longo no teste.

---

### 28. Testar bulkhead

Stub com delay.

Inicie quatro requests concorrentes.

Use barrier para garantir que elas estão em voo.

Quinta chamada:

```text
ProductCatalogBulkheadFullException.
```

WireMock deve registrar somente quatro requests.

---

### 29. Testar fallback

Prepare cache com snapshot live.

WireMock devolve timeout.

Purpose:

```text
PREVIEW.
```

Esperado:

```text
CACHE_FALLBACK;

observedAt preservado;

age explícita;

uma tentativa protegida.
```

---

### 30. Testar fallback proibido

Mesmo cache, purpose:

```text
COMMIT.
```

Esperado:

```text
erro original;

sem cached success.
```

---

### 31. Criar reservation stub

Matcher:

```java
post(
    urlPathEqualTo(
        "/api/v1/reservations"
    )
)
.withHeader(
    "Idempotency-Key",
    matching(
        "[A-Za-z0-9_-]{16,100}"
    )
)
.withRequestBody(
    matchingJsonPath(
        "$.orderId",
        equalTo(
            "ORD-2026-0001"
        )
    )
)
.withRequestBody(
    matchingJsonPath(
        "$.quantity",
        equalTo("2")
    )
)
```

Response final vem de:

```text
reservation-created.json.
```

---

### 32. Criar reservation retry scenario

Primeira tentativa:

```text
503.
```

Segunda:

```text
201;

Location;

Idempotent-Replayed:
true ou false
conforme cenário.
```

Para testar o client, o importante é preservar a intenção.

---

### 33. Verificar mesma key

Obtenha os serve events matched pelo path.

Extraia:

```text
Idempotency-Key;

body.
```

Confirme:

```text
duas requests;

mesma key;

mesmos bytes JSON
ou JSON semanticamente igual.
```

Correlation ID pode mudar conforme policy.

---

### 34. Testar payload diferente proibido

Force um client defeituoso em fixture.

A segunda tentativa altera quantity.

O stub específico não deve casar.

O catch-all retorna `599`.

O teste prova que o matcher detecta a regressão.

---

### 35. Testar Authorization sem vazar

Matcher exige formato.

O test de log usa token sentinela.

Ao falhar, o relatório não deve imprimir o token completo.

Se WireMock imprime request no diagnóstico, sanitize a saída capturada antes de publicar em CI.

---

### 36. Testar request journal

Use:

```java
List<ServeEvent> events =
        catalog.getAllServeEvents();
```

Valide:

- matched;
- response status;
- path;
- quantidade;
- ausência de unexpected request.

Não exponha bodies reais em mensagens de assertion.

---

### 37. Testar scenario isolation

Teste A leva scenario para estado final.

O cleaner executa.

Teste B confirma:

```text
Scenario.STARTED.
```

Sem essa prova, a suíte pode depender de ordem.

---

### 38. Testar stub priority

Registre:

- specific 404 priority 1;
- success priority 5;
- catch-all priority 10.

Confirme cada response correta.

---

### 39. Reutilizar body files

Para payload maior, configure `__files` de teste ou carregue o example central.

Não copie manualmente um segundo JSON.

Um test compara checksum do example usado pelo stub com o arquivo do contrato.

---

### 40. Criar JSON mapping opcional

Além da Java DSL, crie uma mapping file didática:

```json
{
  "request": {
    "method": "GET",
    "urlPath": "/api/v1/products/SKU-1001/availability"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "bodyFileName": "availability-available.json"
  }
}
```

A baseline principal usa Java DSL para cenários por teste.

---

### 41. Response templating controlado

Caso precise devolver correlation:

```text
X-Correlation-Id
da request
na response.
```

Ative o transformer somente no stub necessário.

Não habilite templates globais sem necessidade.

---

### 42. Testar rate limit

Stub:

```http
429 Too Many Requests
Retry-After: 2
```

Confirme que a policy:

- interpreta `Retry-After`;
- respeita limite máximo;
- não trata como retry infinito;
- registra categoria correta.

---

### 43. Testar response body grande

Gere body acima do limite do client.

Esperado:

```text
contract/size exception;

stream encerrado;

sem alocação ilimitada.
```

Não mantenha fixture gigante no Git; gere no teste.

---

### 44. Testar cancelamento WebClient

Stub com chunked ou fixed delay.

Inicie request e cancele via `StepVerifier`.

Confirme:

- subscription cancelada;
- bulkhead permit liberado;
- nenhuma fallback em cancellation;
- journal registra no máximo uma request.

---

### 45. Testar concorrência dos testes

Execute classes em paralelo somente se cada uma possui servidor e registries isolados.

Não compartilhe WireMock estático global entre classes paralelas.

---

### 46. Criar test profile

```yaml
integrations:
  catalog:
    base-url: ${WIREMOCK_CATALOG_BASE_URL}
```

Nenhum fallback para URL real.

Se a property está ausente no profile de teste:

```text
startup falha.
```

---

### 47. Proibir proxy

A configuração do WireMock não usa:

- `proxyAllTo`;
- recording;
- browser proxy;
- target real.

Crie policy test por busca de código e options.

---

### 48. Criar fault matrix

Arquivo:

```text
WIREMOCK_FAULT_MATRIX.md
```

| Cenário | Simulação | Resultado esperado |
|---|---|---|
| upstream 503 | HTTP 503 | retry/unavailable |
| timeout | fixed delay | timeout |
| reset | connection reset | unavailable |
| malformed JSON | invalid body | contract |
| not found | HTTP 404 | business error |
| open breaker | repeated 503 | local rejection |
| bulkhead full | delayed concurrency | local capacity error |
| fallback | timeout + cache | stale preview |

---

### 49. Criar stub policy

Regras:

- path preciso;
- method obrigatório;
- headers contratuais;
- body validado;
- priority explícita quando há overlap;
- examples centrais;
- catch-all;
- unmatched vazio;
- reset por teste;
- sem proxy;
- sem secrets;
- sem sleeps longos;
- sem lógica de domínio completa.

---

### 50. Executar testes imperativos

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=RestClientAvailabilityWireMockTest,RestClientAvailabilityErrorWireMockTest,RestClientTimeoutWireMockTest,RestClientRetryWireMockTest,RestClientCircuitBreakerWireMockTest,RestClientBulkheadWireMockTest,RestClientFallbackWireMockTest,RestClientReservationIdempotencyWireMockTest,WireMockUnmatchedRequestTest,WireMockScenarioIsolationTest `
  test
```

---

### 51. Executar testes reativos

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=WebClientAvailabilityWireMockTest,WebClientAvailabilityErrorWireMockTest,WebClientTimeoutWireMockTest,WebClientRetryWireMockTest,WebClientCircuitBreakerWireMockTest,WebClientBulkheadWireMockTest,WebClientFallbackWireMockTest,WebClientCancellationWireMockTest `
  test
```

---

### 52. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- examples;
- matching;
- unmatched;
- delays;
- faults;
- scenarios;
- verification;
- reset;
- RestClient;
- WebClient;
- resilience registries;
- security logs;
- contract regressions.

---

### 53. Registrar limitações

Ainda faltam:

```text
Pact;

provider verification;

contract broker;

Spring Cloud Contract;

mocks compartilhados;

performance test;

HTTP/2 específico;

TLS client certificate;

proxy recording aprovado;

teste com provider real.
```

---

## Entendendo o que foi feito

### O provider virou controlável

Sucesso, erro, latência e falha de conexão podem ser reproduzidos.

### O contrato permaneceu central

Responses vêm dos examples validados.

### Requests ficaram verificáveis

Method, URL, headers, body e quantidade são assertions.

### Resiliência ficou observável

Retry, breaker, bulkhead e fallback são medidos pelas chamadas reais ao fake HTTP.

### Fault e status foram separados

Connection reset não é tratado como simples `503`.

### Cenários ficaram determinísticos

State machines substituem counters globais frágeis.

### Estado foi isolado

Mappings, journal, scenario e registries são resetados.

### WireMock não virou provider paralelo

A fake continua pequena e focada nos comportamentos do teste.

---

## Erros comuns importantes

### Stub com qualquer URL

Uma regressão de path continua verde.

### Validar somente status

Headers, body e número de chamadas podem estar errados.

### Duplicar JSON

Contrato e stub divergem.

### Não resetar scenario

O teste depende da ordem de execução.

### Usar sleep longo

A suíte fica lenta e instável.

### Retry test sem verify

O teste não prova que houve repetição.

### Circuit breaker test sem journal

Não prova que a chamada foi bloqueada localmente.

### Fault assertion por mensagem

Mensagem varia por connector e sistema.

### Permitir proxy real

O teste deixa de ser hermético.

### Gravar tráfego produtivo

Tokens e dados podem ir para o repositório.

---

## Comandos úteis

### Testes de matching

```powershell
.\mvnw.cmd `
  -Dtest=WireMockUnmatchedRequestTest,WireMockStubPriorityTest,WireMockRequestJournalTest `
  test
```

### Testes de resiliência

```powershell
.\mvnw.cmd `
  -Dtest=RestClientTimeoutWireMockTest,RestClientRetryWireMockTest,RestClientCircuitBreakerWireMockTest,RestClientBulkheadWireMockTest,RestClientFallbackWireMockTest `
  test
```

### Testes reativos

```powershell
.\mvnw.cmd `
  -Dtest=WebClientTimeoutWireMockTest,WebClientRetryWireMockTest,WebClientCancellationWireMockTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar stubs amplos

```powershell
git grep `
  -n `
  -E `
  "urlMatching\\(\"\\.\\*\"|anyUrl\\(\\)|proxyAllTo|startRecording|Thread\\.sleep|allowUnknown"
```

Revise usos legítimos do catch-all pela prioridade.

---

## Exercício guiado

### Parte 1 — Servidor

Suba WireMock em porta dinâmica.

### Parte 2 — Contrato

Carregue examples centrais.

### Parte 3 — Matching

Valide path, headers e body.

### Parte 4 — Erros

Simule 404, 429, 503 e payload inválido.

### Parte 5 — Falhas

Simule delay e connection reset.

### Parte 6 — Scenario

Crie 503 seguido de 200.

### Parte 7 — Resiliência

Teste retry, breaker, bulkhead e fallback.

### Parte 8 — Idempotência

Confirme mesma key e payload.

### Parte 9 — Isolamento

Resete journal, mappings e scenarios.

### Parte 10 — Gate

Execute consumers imperativo e reativo.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 472 foi preservada;
- WireMock foi diferenciado de contrato;
- versão do WireMock foi fixada;
- artifact 3.x foi usado;
- porta dinâmica foi usada;
- bind local foi configurado;
- JUnit Jupiter foi utilizado;
- RestClient aponta para WireMock;
- WebClient aponta para WireMock;
- URL real não possui fallback;
- examples centrais foram reutilizados;
- duplicação de JSON foi evitada;
- stub de sucesso foi criado;
- path template foi usado;
- method foi validado;
- headers foram validados;
- authorization foi validada sem token real;
- correlation foi validada;
- body JSON foi validado;
- extra fields possuem policy;
- 400 foi simulado;
- 401 foi simulado;
- 403 foi simulado;
- 404 foi simulado;
- 409 foi simulado;
- 429 foi simulado;
- 503 foi simulado;
- malformed JSON foi simulado;
- media type incorreto foi simulado;
- field ausente foi simulado;
- prioridades foram configuradas;
- catch-all de baixa prioridade foi criado;
- unmatched requests são inspecionadas;
- request journal é utilizado;
- mappings são resetados;
- journal é resetado;
- scenarios são resetados;
- registries de resiliência são resetados;
- fixed delay foi aplicado;
- timeout imperativo foi testado;
- timeout reativo foi testado;
- random delay não entrou no gate determinístico;
- connection reset foi testado;
- empty response foi contextualizada;
- faults são classificados internamente;
- scenario de retry foi criado;
- quantidade de retries foi verificada;
- erro não retryable gera uma chamada;
- circuit breaker aberto reduz requests;
- half-open foi testado;
- bulkhead limita requests no provider;
- fallback PREVIEW foi testado;
- fallback COMMIT foi proibido;
- reservation POST foi simulado;
- Idempotency-Key foi matched;
- mesma key foi preservada no retry;
- mesmo payload foi preservado;
- payload alterado falha no matcher;
- rate limit foi testado;
- cancelamento reativo foi testado;
- scenario isolation foi comprovado;
- stub priority foi testada;
- templates não foram habilitados globalmente;
- recording foi proibido;
- proxy real foi proibido;
- logs não contêm token ou payload sensível;
- tests imperativos foram executados;
- tests reativos foram executados;
- Pact não foi antecipado;
- limitações foram registradas;
- produção permaneceu NO-GO;
- gate foi executado;
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
  "wiremock|urlMatching\\(\"\\.\\*\"|anyUrl|proxyAllTo|recording|Thread\\.sleep|Authorization.*Bearer"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive `
  labs/m16/aula-456-integracoes-http-entre-sistemas/contracts `
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
git commit -m "test(m16): simular integracoes HTTP com WireMock"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- endpoint real;
- recording de produção;
- payload produtivo;
- fixture duplicada;
- sleep longo;
- proxy;
- keystore;
- Pact antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os consumers passaram a testar a integração HTTP contra um servidor controlado.

O WireMock passou a oferecer:

```text
stubs;

request matchers;

responses;

delays;

faults;

stateful scenarios;

journal;

verification.
```

A principal decisão foi:

```text
a fake deve ser
estrita o suficiente
para rejeitar
uma request incorreta
e pequena o suficiente
para não duplicar
o provider.
```

Também ficou comprovado que:

- OpenAPI continua sendo a fonte do contrato;
- examples centrais evitam drift;
- porta dinâmica evita conflitos;
- unmatched request precisa falhar;
- HTTP error e connection fault são diferentes;
- retry precisa ser comprovado por contagem;
- circuit breaker aberto reduz tráfego;
- bulkhead protege o provider;
- fallback depende do propósito;
- idempotency key permanece entre tentativas;
- scenario e journal precisam de reset;
- recording e proxy real quebram o isolamento.

A próxima aula será:

```text
474 - M16.19 - Testes de contrato
```

Nela, você irá:

- compreender consumer-driven contracts;
- criar contratos do consumer;
- publicar ou armazenar pacts;
- verificar o provider;
- usar provider states;
- testar versões;
- integrar contratos ao CI;
- bloquear incompatibilidades;
- diferenciar contract test, WireMock e end-to-end;
- conectar os artefatos da aula 472 às verificações automatizadas.

---

# Material complementar

## Checkpoint final

- [ ] Subi WireMock em porta dinâmica.
- [ ] Reutilizei examples do contrato.
- [ ] Validei requests e unmatched calls.
- [ ] Testei delays, faults e scenarios.
- [ ] Comprovei retry, breaker, bulkhead e fallback.

---

## Troubleshooting adicional

### Stub não é encontrado

Confirme method, path, query, headers, priority e body matcher.

### Catch-all responde em vez do stub

O stub específico pode ter matcher excessivo ou prioridade menor.

### Retry executa uma vez

A exception pode estar classificada como permanente ou o scenario não mudou de estado.

### Retry executa mais vezes

Revise max attempts e contagem da tentativa inicial.

### Circuit breaker não abre

A janela mínima ou predicate pode não considerar o erro.

### Breaker abre, mas WireMock continua recebendo

O decorator order ou a instance do breaker pode estar incorreta.

### Bulkhead test é instável

Use barrier para manter as primeiras calls em voo.

### Scenario começa no estado errado

O reset não foi aplicado.

### WebClient test trava

Revise virtual time, timeout, conexão e cancelamento.

### Logs exibem token

Sanitize assertion output, exceptions e request journal antes do CI.

---

## Perguntas de revisão

1. Para que serve WireMock?
2. WireMock substitui OpenAPI?
3. Por que usar porta dinâmica?
4. O que um stub combina?
5. Por que evitar matcher amplo?
6. Para que serve priority?
7. O que é request journal?
8. O que é unmatched request?
9. O que fixed delay simula?
10. HTTP 503 é connection reset?
11. O que é scenario?
12. Qual é o estado inicial?
13. Como provar retry?
14. Como provar circuit open?
15. Como testar bulkhead?
16. Por que resetar registries?
17. Podemos gravar produção?
18. Onde ficam os examples?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Simular e verificar HTTP.
2. Não.
3. Evitar conflitos.
4. Request e response.
5. Evitar falso positivo.
6. Resolver overlap.
7. Registrar chamadas.
8. Request sem stub correspondente.
9. Latência.
10. Não.
11. Máquina de estados.
12. `STARTED`.
13. Contar requests.
14. Nenhuma nova request.
15. Concorrência e contagem.
16. Isolar testes.
17. Não sem processo seguro.
18. No contrato central.
19. Testes de contrato.
20. Consumer/provider verification.

---

## Desafio opcional

Crie uma execução standalone para desenvolvimento local.

Requisitos:

- mappings versionados;
- body files vindos dos contracts;
- porta configurável;
- admin API ligada apenas em loopback;
- sem proxy;
- sem recording;
- health endpoint;
- script de start e stop;
- checksum das fixtures;
- profile separado;
- nunca utilizado como prova única de compatibilidade.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 473 - M16.18 - WireMock aplicado

- Diferenciei WireMock, contrato e provider real.
- Fixei WireMock 3.x no build.
- Usei a extensão JUnit Jupiter.
- Configurei porta dinâmica e loopback.
- Apontei RestClient e WebClient para o fake.
- Reutilizei examples da raiz `contracts`.
- Criei loader com proteção de path.
- Criei stubs de disponibilidade e reserva.
- Usei path templates.
- Validei method, headers, path params e body.
- Impedi token real nas fixtures.
- Criei responses 400, 401, 403, 404, 409, 429 e 503.
- Simulei JSON malformado, media type errado e field ausente.
- Criei prioridade de stubs.
- Criei catch-all de baixa prioridade.
- Inspecionei unmatched requests.
- Usei request journal.
- Resetei mappings, requests e scenarios.
- Resetei registries de resiliência.
- Simulei fixed delay.
- Testei timeout imperativo e reativo.
- Simulei connection reset.
- Diferenciei HTTP error e transport fault.
- Criei scenario de 503 seguido de 200.
- Verifiquei quantidade de retries.
- Confirmei zero retry para 404.
- Abri circuit breaker com falhas controladas.
- Confirmei ausência de request depois de open.
- Testei half-open e recuperação.
- Testei bulkhead com concorrência.
- Confirmei quatro calls no provider e uma rejeição local.
- Testei fallback em PREVIEW.
- Proibi fallback em COMMIT.
- Testei retry de reservation POST.
- Confirmei a mesma Idempotency-Key.
- Confirmei o mesmo payload.
- Testei rate limit e Retry-After.
- Testei cancelamento no WebClient.
- Criei fault matrix e stub policy.
- Proibi proxy e recording de produção.
- Criei logs sem token e payload sensível.
- Executei testes imperativos e reativos.
- Não antecipei Pact.
- Mantive produção como NO-GO.
- Próxima aula: Testes de contrato.
```

---

## Referência técnica curta

- WireMock — JUnit Jupiter.
- WireMock — Request Matching.
- WireMock — Stubbing.
- WireMock — Verifying.
- WireMock — Stateful Behaviour.
- WireMock — Simulating Faults.
- WireMock — Response Templating.
- WireMock — Record and Playback.

Regra final:

```text
WireMock deve ser usado como servidor HTTP de teste estrito e hermético: a versão é fixada, a porta é dinâmica, a base URL real é substituída sem fallback, stubs reutilizam examples do contrato, requests são matched por método, path, headers e body, prioridades impedem overlap, unmatched calls falham, journal e scenarios são resetados, delays e faults simulam latência e transporte, scenarios produzem retries determinísticos, verificações contam chamadas para provar retry, circuit breaker e bulkhead, a mesma idempotency key é preservada, RestClient e WebClient usam a mesma policy de runtime e recording, proxy e dados reais permanecem fora do gate.
```
