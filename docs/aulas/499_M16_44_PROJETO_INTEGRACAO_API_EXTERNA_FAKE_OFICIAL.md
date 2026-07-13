# 499 - M16.44 - Projeto integracao API externa fake

## Apresentação da aula

Na aula 498, você concluiu o projeto de mensageria de ordens de serviço dentro do laboratório.

A jornada ficou:

```text
HTTP;

Service Order;

Outbox;

Kafka;

Notification Inbox;

Notification Intent;

Dispatcher;

FakeNotificationProvider;

SENT.
```

O dispatcher já depende de uma porta:

```java
NotificationProvider
```

A implementação anterior era local.

Ela gravava diretamente em:

```text
fake_notification_delivery.
```

Esse adapter foi útil para provar:

- claim;
- retry;
- idempotência;
- quarantine;
- stale recovery;
- métricas;
- correlação;
- fluxo ponta a ponta.

Ainda não havia uma fronteira HTTP real.

Nesta aula, o adapter local será substituído por:

```text
HttpNotificationProvider.
```

Ele utilizará:

```text
Spring RestClient;

contrato JSON;

timeouts;

headers;

status HTTP;

idempotency key;

correlation ID;

respostas tipadas;

exceptions classificadas.
```

Também será criada uma API fake:

```text
POST /fake-provider/v1/notifications
```

Ela executará no laboratório, mas será acessada por HTTP como um sistema externo.

O fluxo ficará:

```text
NotificationDispatchWorker
        |
        v
NotificationProvider
        |
        v
HttpNotificationProvider
        |
        v
HTTP
        |
        v
Fake External Notification API
        |
        v
fake_external_notification_delivery.
```

A porta do domínio não mudará.

O dispatcher continuará chamando:

```java
provider.send(command)
```

Somente o adapter será trocado.

Isso demonstra uma vantagem direta da arquitetura por portas e adapters:

```text
regra de aplicação estável;

tecnologia externa substituível.
```

A API fake exigirá:

```text
Authorization;

Idempotency-Key;

X-Correlation-Id;

X-Request-Id;

X-Causation-Id.
```

O body conterá apenas dados técnicos do laboratório:

```text
serviceOrderId;

customerId;

scheduleId;

channel;

templateCode.
```

Nenhum telefone, e-mail ou contato real será enviado.

A primeira chamada com uma idempotency key válida retornará:

```text
202 Accepted;

status:
ACCEPTED.
```

Uma repetição com a mesma key e o mesmo conteúdo retornará:

```text
200 OK;

status:
ALREADY_ACCEPTED.
```

A mesma key com conteúdo diferente retornará:

```text
409 Conflict.
```

Esse status representa:

```text
conflito de idempotência.
```

Ele não deve ser repetido automaticamente.

A API fake também simulará:

```text
400:

request inválido.

401:

token inválido.

422:

regra rejeitada.

429:

rate limit.

503:

indisponibilidade temporária.

timeout:

resultado potencialmente ambíguo.
```

O adapter classificará as respostas:

```text
2xx válido:
sucesso.

400, 401, 403, 404, 409, 422:
falha permanente.

429:
falha transitória
com Retry-After.

500, 502, 503, 504:
falha transitória.

connection timeout:
falha transitória.

read timeout:
falha transitória e ambígua.

2xx com body inválido:
falha permanente de contrato.
```

O timeout é ambíguo porque o provider pode ter aceitado a solicitação antes de a resposta chegar.

A estratégia segura continuará sendo:

```text
repetir com a mesma
Idempotency-Key.
```

A aula utilizará o `RestClient` síncrono porque o dispatcher atual também é síncrono e executa em worker dedicado.

Isso não significa que chamadas síncronas devam ocorrer no listener Kafka.

O dispatcher permanece separado.

Os timeouts serão configurados no client HTTP.

A chamada não poderá aguardar indefinidamente.

Valores de laboratório:

```text
connect timeout:
500 ms.

read timeout:
1 s.
```

Produção precisa de valores baseados em:

- SLA do provider;
- latência histórica;
- budget da operação;
- número de retries;
- capacidade do worker;
- deadline de negócio.

A integração também preservará os sinais construídos anteriormente:

```text
logs correlacionados;

http.client.requests;

integration.notification.dispatch;

retry;

quarantine;

oldest backlog age.
```

A próxima aula será:

```text
500 - M16.45 - Revisao integracoes parte 1
```

Portanto, esta aula concluirá a implementação da API externa fake e não antecipará a revisão consolidada.

Ao final, você deverá explicar:

```text
por que a porta
não mudou;

por que RestClient
fica no adapter;

por que timeout
não pode ser infinito;

por que 429
é diferente de 400;

por que 409
não deve virar retry cego;

por que timeout
pode ser ambíguo;

por que a mesma
Idempotency-Key
precisa ser repetida;

como correlation ID
atravessa HTTP;

como testar o client
sem depender de internet;

como verificar
a integração ponta a ponta.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
497:
Projeto mensageria OS parte 2.

498:
Projeto mensageria OS parte 3.

499:
Projeto integracao API externa fake.

500:
Revisao integracoes parte 1.

501:
Revisao integracoes parte 2.
```

A aula 498 respondeu:

```text
como despachar
uma intenção idempotente
para um provider local?
```

A aula 499 responderá:

```text
como atravessar
uma fronteira HTTP real
com contrato e resiliência?
```

Nesta aula:

```text
NotificationProvider:
reutilizado.

HttpNotificationProvider:
sim.

RestClient:
sim.

fake API HTTP:
sim.

contrato request:
sim.

contrato response:
sim.

Authorization:
simulada.

idempotency header:
sim.

correlation headers:
sim.

connect timeout:
sim.

read timeout:
sim.

2xx:
sim.

400:
sim.

401 e 403:
sim.

409:
sim.

422:
sim.

429:
sim.

5xx:
sim.

timeout:
sim.

MockRestServiceServer:
sim.

teste com servidor real:
sim.

internet:
não.

revisão geral:
não antecipada.
```

A regra central será:

```text
uma falha HTTP
precisa ser classificada
pela semântica da resposta;

não apenas pela existência
de uma exception.
```

---

## Objetivo prático

Ao final, a estrutura terá:

```text
src/main/java/br/com/formacao/m16/architecture/os
└── notification
    ├── provider
    │   ├── NotificationProvider.java
    │   ├── NotificationProviderCommand.java
    │   ├── NotificationProviderPermanentException.java
    │   ├── NotificationProviderTransientException.java
    │   └── http
    │       ├── FakeProviderNotificationRequest.java
    │       ├── FakeProviderNotificationResponse.java
    │       ├── HttpNotificationProvider.java
    │       ├── NotificationProviderHttpConfiguration.java
    │       └── NotificationProviderProperties.java
    └── externalapi
        └── fake
            ├── FakeExternalNotificationController.java
            ├── FakeExternalNotificationService.java
            ├── FakeExternalNotificationDeliveryEntity.java
            ├── FakeExternalNotificationDeliveryRepository.java
            ├── FakeExternalNotificationRequest.java
            └── FakeExternalNotificationResponse.java
```

Documentação:

```text
docs/architecture/external-api
├── FAKE_NOTIFICATION_API_CONTRACT.md
├── HTTP_ERROR_CLASSIFICATION.md
├── HTTP_IDEMPOTENCY_POLICY.md
├── HTTP_TIMEOUT_POLICY.md
└── EXTERNAL_API_RUNBOOK.md
```

Testes:

```text
src/test/java/br/com/formacao/m16/architecture/os
├── HttpNotificationProviderContractTest.java
├── HttpNotificationProviderStatusClassificationTest.java
├── HttpNotificationProviderTimeoutIntegrationTest.java
├── FakeExternalNotificationApiIntegrationTest.java
└── ServiceOrderExternalApiEndToEndIntegrationTest.java
```

Você irá:

1. confirmar a baseline;
2. preservar a porta;
3. criar propriedades tipadas;
4. configurar RestClient;
5. configurar timeouts;
6. criar request externo;
7. criar response externo;
8. propagar autenticação;
9. propagar idempotency key;
10. propagar correlação;
11. mapear 2xx;
12. mapear 400;
13. mapear 401 e 403;
14. mapear 409;
15. mapear 422;
16. mapear 429;
17. mapear 5xx;
18. mapear timeout;
19. criar API fake;
20. criar storage idempotente;
21. simular falhas;
22. substituir o adapter local;
23. preservar retry do dispatcher;
24. preservar quarantine;
25. testar contrato;
26. testar timeout;
27. testar idempotência;
28. testar a jornada completa;
29. validar métricas;
30. executar o gate;
31. commitar;
32. preparar a revisão.

---

## Conceito essencial

### Porta estável

O dispatcher já depende de:

```java
NotificationProvider
```

A interface continua igual.

O domínio não importa:

- `RestClient`;
- URL;
- HTTP status;
- Authorization;
- JSON externo;
- timeout;
- retry HTTP.

Esses detalhes pertencem ao adapter.

---

### Adapter HTTP

O adapter converte:

```text
NotificationProviderCommand
```

em:

```text
request HTTP externo.
```

Depois converte:

```text
status + body
```

em:

```text
NotificationProviderResult
```

ou exception tipada.

---

### Contrato externo

O contrato externo não precisa ser igual ao modelo interno.

Exemplo interno:

```text
sourceEventId;

intentId;

correlationId.
```

Exemplo externo:

```text
serviceOrderId;

customerReference;

scheduleReference;

channel;

template.
```

O mapper protege o domínio de mudanças externas.

---

### Idempotency-Key

Header:

```text
Idempotency-Key.
```

Valor:

```text
sourceEventId.
```

Ele permanece estável em:

- retry do dispatcher;
- timeout;
- 503;
- restart;
- stale recovery;
- falha depois do aceite.

---

### Correlation headers

A chamada utilizará:

```text
X-Correlation-Id;

X-Request-Id;

X-Causation-Id.
```

`X-Request-Id` será novo para cada tentativa HTTP.

`X-Causation-Id` será o `sourceEventId`.

O correlation ID permanece o da jornada da OS.

---

### Authorization

A API fake exigirá:

```text
Authorization:
Bearer <token>.
```

O token será externalizado por configuração.

Nenhum token real deve ser versionado.

No laboratório, uma variável de ambiente poderá possuir valor padrão local.

---

### Connect timeout

Connect timeout limita o tempo para estabelecer a conexão.

Ele cobre problemas como:

- host indisponível;
- porta fechada;
- rota inexistente;
- conexão lenta.

---

### Read timeout

Read timeout limita a espera por dados da resposta depois da conexão.

Quando ele ocorre:

```text
o client não sabe
se o provider aceitou
antes de atrasar a resposta.
```

A repetição precisa usar a mesma key.

---

### 2xx

Nem todo 2xx é automaticamente válido.

O adapter precisa validar:

- body presente;
- provider message ID;
- status conhecido;
- idempotency key coerente quando retornada.

Um body incompatível é falha de contrato.

---

### 400 e 422

Representam erro do request ou regra rejeitada.

Sem mudança de dados ou configuração, retry não resolve.

Classificação:

```text
permanente.
```

---

### 401 e 403

Representam falha de autenticação ou autorização.

Um retry imediato com o mesmo token normalmente não resolve.

Classificação da baseline:

```text
permanente operacional.
```

O item vai para quarantine com reason code controlado.

Após correção da configuração, um reprocessamento pode ser aprovado.

---

### 409

A API fake utilizará 409 quando:

```text
a mesma idempotency key
é reutilizada
com conteúdo diferente.
```

Isso é um conflito crítico.

Não gere outra key para contornar.

A intenção precisa ser investigada.

---

### 429

Representa rate limit.

Classificação:

```text
transitória.
```

O adapter lê:

```text
Retry-After.
```

O dispatcher usa o maior valor entre:

- backoff local;
- Retry-After;
- limite máximo configurado.

---

### 5xx

Erros 500, 502, 503 e 504 indicam falha do provider ou infraestrutura.

Classificação:

```text
transitória.
```

A mesma idempotency key precisa ser mantida.

---

### Exceptions de transporte

Falhas de conexão, reset e timeout chegam como exceptions do client.

O adapter as converte em:

```text
NotificationProviderTransientException.
```

A exception não deve carregar token ou body completo.

---

### Testes de client

Existem dois níveis úteis:

```text
MockRestServiceServer:

valida request e response
sem servidor real.

servidor fake HTTP:

valida rede, timeout,
serialização e integração.
```

Os dois são complementares.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

A aula 498 precisa continuar verde.

---

### 2. Criar propriedades tipadas

Arquivo:

```text
NotificationProviderProperties.java
```

```java
package br.com.formacao.m16.architecture.os.notification.provider.http;

import java.net.URI;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
    prefix = "app.notification.provider"
)
public record NotificationProviderProperties(
    URI baseUrl,
    String token,
    Duration connectTimeout,
    Duration readTimeout
) {
}
```

Habilite com:

```java
@EnableConfigurationProperties(
    NotificationProviderProperties.class
)
```

---

### 3. Configurar propriedades

No `application.yaml`:

```yaml
app:
  notification:
    provider:
      base-url:
        "${FAKE_NOTIFICATION_API_BASE_URL:http://localhost:8084}"

      token:
        "${FAKE_NOTIFICATION_API_TOKEN:lab-only-token}"

      connect-timeout: 500ms
      read-timeout: 1s
```

O valor padrão existe apenas para laboratório.

---

### 4. Configurar RestClient

Arquivo:

```text
NotificationProviderHttpConfiguration.java
```

```java
package br.com.formacao.m16.architecture.os.notification.provider.http;

import java.net.http.HttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class NotificationProviderHttpConfiguration {

    @Bean
    RestClient notificationProviderRestClient(
        RestClient.Builder builder,
        NotificationProviderProperties properties
    ) {
        HttpClient httpClient =
            HttpClient
                .newBuilder()
                .connectTimeout(
                    properties.connectTimeout()
                )
                .build();

        JdkClientHttpRequestFactory requestFactory =
            new JdkClientHttpRequestFactory(
                httpClient
            );

        requestFactory.setReadTimeout(
            properties.readTimeout()
        );

        return builder
            .baseUrl(
                properties
                    .baseUrl()
                    .toString()
            )
            .requestFactory(
                requestFactory
            )
            .build();
    }
}
```

A builder injetada preserva customizações do Spring Boot, incluindo instrumentação quando configurada.

---

### 5. Evoluir exception transitória

Adicione `retryAfter`:

```java
package br.com.formacao.m16.architecture.os.notification.provider;

import java.time.Duration;

public class NotificationProviderTransientException
        extends RuntimeException {

    private final Duration retryAfter;

    public NotificationProviderTransientException(
        String message
    ) {
        this(
            message,
            null,
            null
        );
    }

    public NotificationProviderTransientException(
        String message,
        Duration retryAfter,
        Throwable cause
    ) {
        super(message, cause);
        this.retryAfter = retryAfter;
    }

    public Duration retryAfter() {
        return retryAfter;
    }
}
```

O dispatcher poderá considerar esse valor.

---

### 6. Criar request externo

```java
package br.com.formacao.m16.architecture.os.notification.provider.http;

public record FakeProviderNotificationRequest(
    String serviceOrderId,
    String customerReference,
    String scheduleReference,
    String channel,
    String template
) {
}
```

Não envie IDs internos desnecessários no body.

---

### 7. Criar response externo

```java
package br.com.formacao.m16.architecture.os.notification.provider.http;

public record FakeProviderNotificationResponse(
    String providerMessageId,
    String status
) {
}
```

Status aceitos:

```text
ACCEPTED;

ALREADY_ACCEPTED.
```

---

### 8. Criar HttpNotificationProvider

```java
package br.com.formacao.m16.architecture.os.notification.provider.http;

import br.com.formacao.m16.architecture.os.notification.dispatch.NotificationProviderResult;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProvider;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderCommand;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderPermanentException;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderTransientException;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.time.Duration;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component
public class HttpNotificationProvider
        implements NotificationProvider {

    private final RestClient restClient;
    private final NotificationProviderProperties properties;

    public HttpNotificationProvider(
        RestClient notificationProviderRestClient,
        NotificationProviderProperties properties
    ) {
        this.restClient =
            notificationProviderRestClient;

        this.properties = properties;
    }

    @Override
    public NotificationProviderResult send(
        NotificationProviderCommand command
    ) {
        String requestId =
            UUID.randomUUID().toString();

        try {
            FakeProviderNotificationResponse response =
                restClient
                    .post()
                    .uri(
                        "/fake-provider/v1/notifications"
                    )
                    .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer "
                            + properties.token()
                    )
                    .header(
                        "Idempotency-Key",
                        command.idempotencyKey()
                    )
                    .header(
                        "X-Correlation-Id",
                        command.correlationId()
                    )
                    .header(
                        "X-Request-Id",
                        requestId
                    )
                    .header(
                        "X-Causation-Id",
                        command
                            .sourceEventId()
                            .toString()
                    )
                    .body(
                        new FakeProviderNotificationRequest(
                            command.serviceOrderId(),
                            command.customerId(),
                            command.scheduleId(),
                            command.channel(),
                            command.templateCode()
                        )
                    )
                    .retrieve()
                    .onStatus(
                        status ->
                            status.value() == 429,
                        (request, httpResponse) -> {
                            throw transientFailure(
                                "PROVIDER_RATE_LIMITED",
                                retryAfter(
                                    httpResponse
                                        .getHeaders()
                                        .getFirst(
                                            "Retry-After"
                                        )
                                ),
                                null
                            );
                        }
                    )
                    .onStatus(
                        status ->
                            status.value() >= 500,
                        (request, httpResponse) -> {
                            throw transientFailure(
                                "PROVIDER_SERVER_ERROR",
                                null,
                                null
                            );
                        }
                    )
                    .onStatus(
                        HttpStatusCode::is4xxClientError,
                        (request, httpResponse) -> {
                            throw permanentFailure(
                                httpResponse
                                    .getStatusCode()
                                    .value()
                            );
                        }
                    )
                    .body(
                        FakeProviderNotificationResponse.class
                    );

            return mapResponse(response);
        } catch (
            NotificationProviderPermanentException
                | NotificationProviderTransientException
                classified
        ) {
            throw classified;
        } catch (ResourceAccessException transportFailure) {
            throw transientFailure(
                "PROVIDER_TRANSPORT_FAILURE",
                null,
                transportFailure
            );
        }
    }

    private NotificationProviderResult mapResponse(
        FakeProviderNotificationResponse response
    ) {
        if (
            response == null
                || response.providerMessageId() == null
                || response.providerMessageId().isBlank()
                || response.status() == null
        ) {
            throw new NotificationProviderPermanentException(
                "PROVIDER_INVALID_RESPONSE"
            );
        }

        return switch (response.status()) {
            case "ACCEPTED" ->
                new NotificationProviderResult(
                    NotificationProviderResult
                        .Outcome
                        .ACCEPTED,
                    response.providerMessageId()
                );

            case "ALREADY_ACCEPTED" ->
                new NotificationProviderResult(
                    NotificationProviderResult
                        .Outcome
                        .ALREADY_ACCEPTED,
                    response.providerMessageId()
                );

            default ->
                throw new NotificationProviderPermanentException(
                    "PROVIDER_UNKNOWN_RESPONSE_STATUS"
                );
        };
    }

    private NotificationProviderPermanentException
            permanentFailure(
        int status
    ) {
        String reason = switch (status) {
            case 400 -> "PROVIDER_BAD_REQUEST";
            case 401 -> "PROVIDER_UNAUTHORIZED";
            case 403 -> "PROVIDER_FORBIDDEN";
            case 404 -> "PROVIDER_ENDPOINT_NOT_FOUND";
            case 409 -> "PROVIDER_IDEMPOTENCY_CONFLICT";
            case 422 -> "PROVIDER_REJECTED";
            default -> "PROVIDER_CLIENT_ERROR";
        };

        return new NotificationProviderPermanentException(
            reason
        );
    }

    private NotificationProviderTransientException
            transientFailure(
        String reason,
        Duration retryAfter,
        Throwable cause
    ) {
        return new NotificationProviderTransientException(
            reason,
            retryAfter,
            cause
        );
    }

    private Duration retryAfter(
        String value
    ) {
        if (
            value == null
                || value.isBlank()
        ) {
            return null;
        }

        try {
            return Duration.ofSeconds(
                Long.parseLong(value)
            );
        } catch (NumberFormatException ignored) {
            return null;
        }
    }
}
```

Não registre o token ou body de erro.

---

### 9. Considerar Retry-After no dispatcher

No cálculo de retry:

```text
localBackoff;

providerRetryAfter.
```

Use:

```text
max(localBackoff, providerRetryAfter)
```

limitado por:

```text
retry-max-seconds.
```

Se a exception não possui `retryAfter`, use apenas o backoff local.

---

### 10. Desativar o provider local

Mantenha `FakeNotificationProvider` disponível apenas por property ou profile.

Exemplo:

```java
@ConditionalOnProperty(
    name = "app.notification.provider.mode",
    havingValue = "local"
)
```

O `HttpNotificationProvider` utiliza:

```java
@ConditionalOnProperty(
    name = "app.notification.provider.mode",
    havingValue = "http",
    matchIfMissing = true
)
```

No YAML:

```yaml
app:
  notification:
    provider:
      mode: "http"
```

Apenas um bean implementa `NotificationProvider`.

---

### 11. Criar contrato da API fake

Arquivo:

```text
FAKE_NOTIFICATION_API_CONTRACT.md
```

Endpoint:

```text
POST /fake-provider/v1/notifications
```

Headers obrigatórios:

```text
Authorization;

Idempotency-Key;

X-Correlation-Id;

X-Request-Id;

X-Causation-Id.
```

Request:

```json
{
  "serviceOrderId": "OS-499-0001",
  "customerReference": "CUSTOMER-499-0001",
  "scheduleReference": "SCHEDULE-499-0001",
  "channel": "IN_APP",
  "template": "SERVICE_ORDER_SCHEDULED_V1"
}
```

Response inicial:

```json
{
  "providerMessageId": "EXT-499-0001",
  "status": "ACCEPTED"
}
```

---

### 12. Criar entidade da API fake

```java
package br.com.formacao.m16.architecture.os.notification.externalapi.fake;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "fake_external_notification_delivery",
    uniqueConstraints = {
        @UniqueConstraint(
            name =
                "uk_fake_external_idempotency",
            columnNames = "idempotency_key"
        )
    }
)
public class FakeExternalNotificationDeliveryEntity {

    @Id
    private UUID id;

    @Column(
        name = "idempotency_key",
        nullable = false,
        length = 120
    )
    private String idempotencyKey;

    @Column(
        name = "request_hash",
        nullable = false,
        length = 64
    )
    private String requestHash;

    @Column(
        name = "provider_message_id",
        nullable = false,
        length = 120
    )
    private String providerMessageId;

    @Column(
        name = "correlation_id",
        nullable = false,
        length = 100
    )
    private String correlationId;

    @Column(
        name = "accepted_at",
        nullable = false
    )
    private Instant acceptedAt;

    protected FakeExternalNotificationDeliveryEntity() {
    }
}
```

Adicione construtor e getters.

---

### 13. Criar request e response da API

```java
package br.com.formacao.m16.architecture.os.notification.externalapi.fake;

public record FakeExternalNotificationRequest(
    String serviceOrderId,
    String customerReference,
    String scheduleReference,
    String channel,
    String template
) {
}
```

```java
package br.com.formacao.m16.architecture.os.notification.externalapi.fake;

public record FakeExternalNotificationResponse(
    String providerMessageId,
    String status
) {
}
```

Esses records pertencem ao server fake.

Eles não precisam ser reutilizados pelo client.

---

### 14. Criar hash canônico

O service fake gera SHA-256 sobre:

```text
serviceOrderId;

customerReference;

scheduleReference;

channel;

template.
```

Use separador e ordem fixos.

Não use `Object.toString()`.

A mesma key com hash diferente gera:

```text
409 Conflict.
```

---

### 15. Criar service fake

Responsabilidades:

1. validar token;
2. validar headers;
3. validar body;
4. simular falhas;
5. calcular hash;
6. buscar idempotency key;
7. comparar hash;
8. retornar duplicate ou criar delivery.

O primeiro aceite retorna:

```text
created = true.
```

A repetição idêntica retorna:

```text
created = false.
```

---

### 16. Criar controller fake

```java
package br.com.formacao.m16.architecture.os.notification.externalapi.fake;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    "/fake-provider/v1/notifications"
)
public class FakeExternalNotificationController {

    private final FakeExternalNotificationService service;

    public FakeExternalNotificationController(
        FakeExternalNotificationService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<
        FakeExternalNotificationResponse
    > send(
        @RequestHeader(
            HttpHeaders.AUTHORIZATION
        )
        String authorization,
        @RequestHeader(
            "Idempotency-Key"
        )
        String idempotencyKey,
        @RequestHeader(
            "X-Correlation-Id"
        )
        String correlationId,
        @RequestHeader(
            "X-Request-Id"
        )
        String requestId,
        @RequestHeader(
            "X-Causation-Id"
        )
        String causationId,
        @RequestBody
        FakeExternalNotificationRequest request
    ) {
        FakeExternalResult result =
            service.accept(
                authorization,
                idempotencyKey,
                correlationId,
                requestId,
                causationId,
                request
            );

        var body =
            new FakeExternalNotificationResponse(
                result.providerMessageId(),
                result.created()
                    ? "ACCEPTED"
                    : "ALREADY_ACCEPTED"
            );

        return result.created()
            ? ResponseEntity
                .accepted()
                .body(body)
            : ResponseEntity
                .ok(body);
    }
}
```

Use `ResponseStatusException` ou exception handlers para os erros simulados.

---

### 17. Simular status HTTP

Regras do fake server:

```text
customerReference começa com BAD-:
400.

token diferente:
401.

customerReference começa com FORBIDDEN-:
403.

customerReference começa com MISSING-:
404.

mesma key, hash diferente:
409.

customerReference começa com REJECTED-:
422.

customerReference começa com RATE-LIMIT-:
429 nas duas primeiras chamadas.

customerReference começa com UNAVAILABLE-:
503 nas duas primeiras chamadas.

customerReference começa com TIMEOUT-:
persiste o aceite
e atrasa a resposta
além do read timeout
na primeira chamada.
```

A simulação de timeout prova o cenário ambíguo.

---

### 18. Testar contrato com MockRestServiceServer

Crie um `RestClient.Builder` dedicado ao teste.

Associe:

```java
MockRestServiceServer.bindTo(builder)
```

Espere:

- método POST;
- path correto;
- Authorization;
- Idempotency-Key;
- correlation;
- request ID;
- causation;
- body.

Responda `202` com JSON válido.

Confirme:

```text
Outcome:
ACCEPTED.
```

---

### 19. Testar duplicate 200

Responda:

```json
{
  "providerMessageId": "EXT-1",
  "status": "ALREADY_ACCEPTED"
}
```

Confirme o outcome correspondente.

---

### 20. Testar 400 e 422

Confirme:

```text
NotificationProviderPermanentException.
```

Reason codes:

```text
PROVIDER_BAD_REQUEST;

PROVIDER_REJECTED.
```

O dispatcher deve levar a quarantine sem retry.

---

### 21. Testar 401, 403 e 409

Confirme falha permanente.

Para 409:

```text
PROVIDER_IDEMPOTENCY_CONFLICT.
```

Não gere nova key.

---

### 22. Testar 429

O mock responde:

```text
429;

Retry-After: 3.
```

Confirme:

```text
NotificationProviderTransientException;

retryAfter:
3 segundos.
```

O dispatcher persiste `nextAttemptAt` respeitando o valor.

---

### 23. Testar 503

Confirme exception transitória.

O item fica:

```text
RETRY_WAIT.
```

A idempotency key permanece igual.

---

### 24. Testar body 2xx inválido

Responda `202` com:

- body vazio;
- providerMessageId vazio;
- status desconhecido.

Confirme falha permanente de contrato.

Não marque a intent como `SENT`.

---

### 25. Testar timeout real

Inicie o fake server em porta aleatória.

Configure o client com read timeout curto.

Use:

```text
customerReference:
TIMEOUT-CUSTOMER-499.
```

Primeira chamada:

```text
provider persiste;

resposta atrasa;

client recebe timeout;

intent vai para retry.
```

Segunda chamada:

```text
mesma key;

API encontra delivery;

retorna ALREADY_ACCEPTED;

intent vira SENT.
```

Confirme uma única delivery externa.

---

### 26. Testar rate limit real

Use:

```text
RATE-LIMIT-CUSTOMER-499.
```

Confirme duas respostas 429 e sucesso posterior.

Valide que o número de chamadas respeita o lifecycle esperado.

---

### 27. Testar autenticação

Configure token inválido.

Resultado:

```text
401;

intent QUARANTINED;

reason:
PROVIDER_UNAUTHORIZED.
```

Depois de corrigir o token, a recuperação deve ocorrer por procedimento aprovado, não por loop infinito.

---

### 28. Criar política de erro HTTP

Arquivo:

```text
HTTP_ERROR_CLASSIFICATION.md
```

Tabela:

```markdown
| Situação | Classificação | Ação |
|---|---|---|
| 200/202 válido | Sucesso | SENT |
| 400 | Permanente | Quarantine |
| 401/403 | Permanente operacional | Quarantine |
| 404 | Permanente/configuração | Quarantine |
| 409 | Conflito de idempotência | Quarantine |
| 422 | Rejeição permanente | Quarantine |
| 429 | Transitória | Retry-After |
| 500/502/503/504 | Transitória | Backoff |
| Connect timeout | Transitória | Mesma key |
| Read timeout | Transitória ambígua | Mesma key |
| 2xx inválido | Contrato inválido | Quarantine |
```

---

### 29. Criar política de timeout

Arquivo:

```text
HTTP_TIMEOUT_POLICY.md
```

Inclua:

- connect timeout;
- read timeout;
- deadline;
- retries;
- idempotência;
- chamadas ambíguas;
- configuração;
- métricas;
- logs;
- testes.

Não trate timeout como certeza de não processamento.

---

### 30. Criar política de idempotência HTTP

Arquivo:

```text
HTTP_IDEMPOTENCY_POLICY.md
```

Defina:

```text
key:
sourceEventId.

reuso:
obrigatório.

conteúdo:
imutável.

409:
investigação.

retenção:
superior à janela máxima de retry.

log:
hash ou IDs técnicos,
nunca token.
```

---

### 31. Atualizar métricas

Confirme métricas automáticas do client:

```text
http.client.requests.
```

Adicione reason codes de provider às métricas de dispatch.

Não use URL com IDs dinâmicos.

O URI template deve permanecer:

```text
/fake-provider/v1/notifications.
```

---

### 32. Criar runbook externo

Arquivo:

```text
EXTERNAL_API_RUNBOOK.md
```

Seção `429`:

1. verificar taxa;
2. verificar Retry-After;
3. reduzir concorrência quando necessário;
4. acompanhar backlog;
5. não trocar idempotency key.

Seção `timeout`:

1. assumir resultado ambíguo;
2. consultar logs;
3. repetir com a mesma key;
4. verificar `ALREADY_ACCEPTED`;
5. não criar nova intent.

Seção `409`:

1. interromper retries;
2. comparar request hash;
3. verificar mutação da intent;
4. investigar origem;
5. não contornar com outra key.

---

### 33. Testar jornada completa

Com servidor em porta aleatória:

1. criar OS;
2. aguardar Outbox publicada;
3. aguardar Inbox processada;
4. aguardar intent criada;
5. dispatcher chama HTTP;
6. fake API persiste delivery;
7. intent vira `SENT`;
8. correlation ID aparece nos dois lados;
9. idempotency key é igual ao event ID;
10. uma delivery existe.

---

### 34. Testar jornada com timeout

Repita o E2E com customer `TIMEOUT-`.

Confirme:

- primeiro dispatch falha;
- intent entra em retry;
- fake API possui delivery;
- segundo dispatch recebe duplicate;
- intent termina `SENT`;
- apenas uma delivery existe.

---

### 35. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=HttpNotificationProviderContractTest,HttpNotificationProviderStatusClassificationTest,HttpNotificationProviderTimeoutIntegrationTest,FakeExternalNotificationApiIntegrationTest,ServiceOrderExternalApiEndToEndIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### A porta permaneceu estável

A aplicação não mudou para conhecer HTTP.

### O adapter ganhou responsabilidade técnica

URL, headers, timeout e status ficaram na infraestrutura.

### O contrato externo ficou isolado

Mudanças da API não vazam diretamente para o domínio.

### A idempotência atravessou HTTP

A mesma key fecha retries e timeouts ambíguos.

### Status HTTP ganharam semântica

4xx, 429 e 5xx não foram tratados da mesma forma.

### Retry-After foi respeitado

O provider pode controlar a próxima tentativa.

### Timeout deixou de significar falha definitiva

O resultado pode já ter sido aceito.

### O fake server virou uma fronteira real

Serialização, rede e timeout foram exercitados.

### Testes permaneceram independentes da internet

Mocks e servidor local tornam o laboratório repetível.

### O projeto ficou pronto para revisão

HTTP, mensageria, contratos, resiliência e observabilidade agora formam uma jornada completa.

---

## Erros comuns importantes

### Colocar RestClient no dispatcher

A regra de aplicação fica acoplada à infraestrutura.

### Não configurar timeout

Threads podem aguardar indefinidamente.

### Repetir 400 automaticamente

O request inválido não se corrige sozinho.

### Tratar 429 como permanente

Rate limit normalmente pede espera.

### Ignorar Retry-After

O client pode agravar a limitação.

### Criar nova key depois de timeout

Uma segunda entrega pode ser criada.

### Tratar timeout como não aceito

O provider pode ter persistido antes da resposta.

### Logar Authorization

O segredo fica exposto.

### Usar body de erro como tag

Cardinalidade e dados sensíveis aumentam.

### Aceitar qualquer body 2xx

A aplicação pode marcar SENT sem confirmação válida.

### Compartilhar DTO externo com domínio

O contrato remoto invade o modelo interno.

### Depender da internet nos testes

A suíte fica lenta e instável.

---

## Comandos úteis

### Executar testes HTTP

```powershell
.\mvnw.cmd `
  -Dtest=HttpNotificationProvider*Test `
  test
```

### Procurar timeouts

```powershell
git grep `
  -n `
  -E `
  "connectTimeout|readTimeout|Retry-After"
```

### Procurar segredo indevido

```powershell
git grep `
  -n `
  -E `
  "Authorization|Bearer|lab-only-token"
```

Revise se o token aparece apenas em configuração de laboratório e headers, nunca em logs.

### Ver métricas HTTP

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "http_client_requests"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Propriedades

Externalize URL, token e timeouts.

### Parte 2 — RestClient

Configure o client.

### Parte 3 — Contratos

Crie request e response externos.

### Parte 4 — Headers

Envie autenticação, idempotência e correlação.

### Parte 5 — Status

Classifique 2xx, 4xx, 429 e 5xx.

### Parte 6 — Timeout

Trate resultado ambíguo.

### Parte 7 — Fake API

Crie endpoint e storage.

### Parte 8 — Idempotência

Valide duplicate e conflict.

### Parte 9 — Testes

Use mock e servidor real.

### Parte 10 — E2E

Comprove OS até API externa fake.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 498 foi preservada;
- projeto da API externa fake foi criado;
- NotificationProvider foi reutilizado;
- dispatcher não depende de RestClient;
- HttpNotificationProvider foi criado;
- propriedades tipadas foram criadas;
- base URL foi externalizada;
- token foi externalizado;
- connect timeout foi configurado;
- read timeout foi configurado;
- RestClient.Builder injetada foi usada;
- request factory foi configurada;
- DTO externo de request foi criado;
- DTO externo de response foi criado;
- DTO externo não invadiu o domínio;
- Authorization foi enviado;
- Idempotency-Key foi enviado;
- X-Correlation-Id foi enviado;
- X-Request-Id foi enviado;
- X-Causation-Id foi enviado;
- request ID novo foi criado por tentativa;
- sourceEventId permaneceu idempotency key;
- 202 ACCEPTED foi tratado;
- 200 ALREADY_ACCEPTED foi tratado;
- body 2xx foi validado;
- body vazio foi rejeitado;
- provider message ID vazio foi rejeitado;
- status desconhecido foi rejeitado;
- 400 foi classificado como permanente;
- 401 foi classificado como permanente operacional;
- 403 foi classificado como permanente operacional;
- 404 foi classificado como configuração;
- 409 foi classificado como conflito;
- nova key não foi gerada no 409;
- 422 foi classificado como permanente;
- 429 foi classificado como transitório;
- Retry-After foi lido;
- Retry-After foi integrado ao backoff;
- 500 foi classificado como transitório;
- 502 foi classificado como transitório;
- 503 foi classificado como transitório;
- 504 foi classificado como transitório;
- falha de conexão foi classificada;
- read timeout foi classificado;
- timeout ambíguo foi explicado;
- mesma key foi preservada depois de timeout;
- provider local foi condicionado;
- adapter HTTP foi selecionado;
- fake API controller foi criado;
- fake API service foi criado;
- fake API repository foi criado;
- storage externo fake foi criado;
- unique constraint de idempotência foi criada;
- request hash foi criado;
- duplicate idêntico retorna ALREADY_ACCEPTED;
- key com conteúdo diferente retorna 409;
- 400 foi simulado;
- 401 foi simulado;
- 403 foi simulado;
- 404 foi simulado;
- 422 foi simulado;
- 429 foi simulado;
- 503 foi simulado;
- timeout pós-aceite foi simulado;
- MockRestServiceServer foi utilizado;
- método e path foram testados;
- headers foram testados;
- body foi testado;
- classificações foram testadas;
- timeout real foi testado;
- uma única delivery foi confirmada;
- jornada E2E de sucesso foi testada;
- jornada E2E de timeout foi testada;
- correlation ID foi preservado;
- métricas do client foram verificadas;
- IDs dinâmicos não viraram URI tags;
- política de erros foi criada;
- política de timeout foi criada;
- política de idempotência foi criada;
- runbook foi criado;
- internet não foi necessária;
- revisão da aula 500 não foi antecipada;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 500 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure riscos:

```powershell
git grep `
  -n `
  -E `
  "RestClient|Idempotency-Key|Retry-After|Authorization|connectTimeout|readTimeout|PROVIDER_"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/external-api `
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
git commit -m "feat(m16): integrar provider HTTP fake"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- URL produtiva;
- payload real;
- contato pessoal;
- logs;
- banco H2;
- diretório data;
- target;
- certificado privado;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o dispatcher atravessou uma fronteira HTTP real sem alterar a regra central da aplicação.

A jornada ficou:

```text
OS;

Outbox;

Kafka;

Inbox;

Intent;

Dispatcher;

RestClient;

Fake External API;

SENT.
```

Você comprovou que:

- a porta protege a aplicação;
- o adapter concentra HTTP;
- URL, token e timeout são configuração;
- idempotency key atravessa retries;
- correlation ID atravessa a rede;
- 400 e 422 são permanentes;
- 401 e 403 exigem correção operacional;
- 409 exige investigação;
- 429 respeita Retry-After;
- 5xx utiliza retry;
- timeout possui resultado ambíguo;
- repetir a mesma key evita uma segunda entrega;
- 2xx ainda precisa de validação de body;
- MockRestServiceServer valida o contrato do client;
- o servidor local valida rede e timeout;
- a suíte não depende de internet.

A próxima aula será:

```text
500 - M16.45 - Revisao integracoes parte 1
```

Nela, você irá revisar:

- contratos HTTP;
- classificação de erros;
- timeouts;
- idempotência;
- mensageria;
- Outbox;
- Inbox;
- deduplicação;
- poison messages;
- retry;
- correlação;
- monitoramento;
- decisões arquiteturais;
- projeto de OS.

Nenhuma revisão consolidada foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mantive a porta do provider.
- [ ] Criei o adapter RestClient.
- [ ] Configurei timeouts.
- [ ] Enviei headers obrigatórios.
- [ ] Classifiquei os status.
- [ ] Criei a API HTTP fake.
- [ ] Testei timeout idempotente.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### RestClient não conecta

Confirme base URL, porta, connect timeout e aplicação fake ativa.

### O timeout nunca ocorre

O read timeout pode não estar aplicado à request factory utilizada.

### 429 entra em quarantine

A classificação de status pode estar passando pelo handler genérico de 4xx antes do handler específico.

### 409 entra em retry

Conflito de idempotência precisa ser permanente.

### A segunda tentativa cria outra delivery

A idempotency key mudou ou a constraint não existe.

### O client marca SENT com body vazio

A validação de response não está sendo executada.

### correlationId não chega à API fake

Confirme header e valor persistido na intent.

### Métrica HTTP mostra URI dinâmica

Use template fixo no `.uri(...)`.

### Teste depende da porta 8084

Use random port e propriedades dinâmicas nos testes de integração.

### Token aparece no log

Remova logging de headers e exceptions que incluam request completo.

---

## Perguntas de revisão

1. Qual porta foi preservada?
2. Onde fica RestClient?
3. Qual é o endpoint fake?
4. Qual é a idempotency key?
5. Ela muda no retry?
6. Qual header leva correlação?
7. O que é connect timeout?
8. O que é read timeout?
9. Timeout garante que o provider não aceitou?
10. Como repetir após timeout?
11. Como tratar 400?
12. Como tratar 409?
13. Como tratar 429?
14. Como tratar 503?
15. O que significa ALREADY_ACCEPTED?
16. O que acontece com 2xx inválido?
17. Para que serve MockRestServiceServer?
18. A suíte usa internet?
19. A revisão foi antecipada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. NotificationProvider.
2. No adapter HTTP.
3. POST /fake-provider/v1/notifications.
4. sourceEventId.
5. Não.
6. X-Correlation-Id.
7. Limite para estabelecer conexão.
8. Limite para aguardar resposta.
9. Não.
10. Com a mesma key.
11. Falha permanente.
12. Quarantine e investigação.
13. Retry com Retry-After.
14. Retry com backoff.
15. A key já foi aceita.
16. Falha de contrato.
17. Testar o client sem servidor real.
18. Não.
19. Não.
20. Revisao integracoes parte 1.

---

## Desafio opcional

Adicione suporte a resposta:

```text
202 Accepted
sem body,
com header Location.
```

Requisitos:

- contrato documentado;
- location validada;
- provider message ID derivado com segurança;
- nenhuma chamada de polling adicional;
- teste de status;
- decisão arquitetural registrada;
- não quebrar o contrato atual;
- não antecipar a revisão.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 499 - M16.44 - Projeto integracao API externa fake

- Continuei após o projeto de mensageria de OS.
- Preservei a porta `NotificationProvider`.
- Criei `HttpNotificationProvider`.
- Mantive RestClient no adapter.
- Criei propriedades tipadas.
- Externalizei base URL e token.
- Configurei connect timeout.
- Configurei read timeout.
- Reutilizei a builder do Spring Boot.
- Criei DTO externo de request.
- Criei DTO externo de response.
- Separei contratos externos do domínio.
- Enviei Authorization.
- Enviei Idempotency-Key.
- Enviei X-Correlation-Id.
- Criei X-Request-Id por tentativa.
- Enviei X-Causation-Id.
- Mantive sourceEventId como idempotency key.
- Tratei 202 ACCEPTED.
- Tratei 200 ALREADY_ACCEPTED.
- Validei body de sucesso.
- Classifiquei 400 como permanente.
- Classifiquei 401 e 403 como falhas operacionais.
- Classifiquei 404 como configuração.
- Classifiquei 409 como conflito de idempotência.
- Classifiquei 422 como rejeição permanente.
- Classifiquei 429 como transitório.
- Li Retry-After.
- Classifiquei 5xx como transitório.
- Classifiquei falhas de transporte.
- Tratei timeout como resultado ambíguo.
- Repeti timeout com a mesma key.
- Condicionei o provider local anterior.
- Criei API externa fake por HTTP.
- Criei storage idempotente da API fake.
- Criei request hash.
- Retornei duplicate para a mesma key e conteúdo.
- Retornei 409 para a mesma key e conteúdo diferente.
- Simulei 400, 401, 403, 404, 422, 429 e 503.
- Simulei timeout depois do aceite.
- Testei o client com MockRestServiceServer.
- Testei timeout com servidor real local.
- Testei a jornada E2E.
- Confirmei uma única delivery externa.
- Validei métricas HTTP.
- Não usei internet.
- Não antecipei a revisão consolidada.
- Próxima aula: Revisao integracoes parte 1.
```

---

## Referência técnica curta

- Spring Framework — RestClient.
- Spring Framework — REST Client Error Handling.
- Spring Framework — Testing Client Applications.
- Spring Framework — MockRestServiceServer.
- Spring Boot — Calling REST Services.
- Spring Boot Actuator — HTTP Client Metrics.
- HTTP Semantics — Status Codes.
- Retry-After Header.
- Idempotency Key Pattern.
- Ports and Adapters.

Regra final:

```text
a integração com a API externa fake substitui o adapter local sem alterar NotificationProvider: HttpNotificationProvider converte o comando interno em request HTTP, externaliza URL, token e timeouts, envia Authorization, Idempotency-Key e headers de correlação e converte status e body em resultado ou exception tipada; 2xx exige response válido, 400, 401, 403, 404, 409 e 422 são permanentes, 429 usa Retry-After, 5xx e falhas de transporte são transitórios e timeout é ambíguo; toda nova tentativa preserva sourceEventId como idempotency key; a API fake persiste uma única delivery por key, retorna ALREADY_ACCEPTED para repetição idêntica e 409 para conteúdo divergente; MockRestServiceServer valida o contrato do client, o servidor local valida rede e timeout, e o teste ponta a ponta comprova uma única entrega sem depender de internet.
```
