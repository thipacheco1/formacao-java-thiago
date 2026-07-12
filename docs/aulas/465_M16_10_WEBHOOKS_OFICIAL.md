# 465 - M16.10 - Webhooks

## Apresentação da aula

Na aula 464, o laboratório tornou idempotente a criação de reservas:

```http
POST /api/v1/reservations
```

O client envia:

```http
Idempotency-Key: <key>
```

O `catalog-provider` garante que a mesma intenção, com a mesma key e o mesmo payload, produza uma única reserva e uma única redução de estoque.

Agora surge outra necessidade.

Depois que a reserva é confirmada, o `order-consumer` precisa ser avisado.

Uma solução seria consultar o catálogo continuamente:

```text
a reserva foi confirmada?

e agora?

e agora?

e agora?
```

Esse modelo é polling.

Ele pode gerar:

- chamadas sem mudança;
- atraso entre a mudança e a descoberta;
- consumo de capacidade;
- acoplamento ao intervalo de consulta;
- picos sincronizados.

Nesta aula, o catálogo iniciará uma chamada HTTP para avisar o consumidor quando o fato ocorrer.

Esse callback HTTP é um:

```text
webhook.
```

O fluxo será:

```text
order-consumer
cria reserva;

catalog-provider
confirma;

catalog-provider
envia webhook;

order-consumer
recebe e registra;

processamento local
atualiza a ordem.
```

A pergunta central será:

```text
como enviar e receber
webhooks de forma segura,
deduplicada,
observável
e resistente a falhas?
```

Uma implementação ingênua seria:

```java
restClient.post()
          .uri(callbackUrl)
          .body(event)
          .retrieve();
```

executada dentro da transação que cria a reserva.

Esse desenho é perigoso.

Se o receiver estiver lento, a transação do catálogo fica aberta.

Se a chamada falhar, pode ocorrer rollback da reserva por uma indisponibilidade externa.

Se a reserva confirmar e o processo morrer antes do webhook, o evento é perdido.

Se o emissor repetir, o receiver pode processar duas vezes.

Se o endpoint for público e não validar autenticidade, qualquer pessoa pode forjar eventos.

Nesta aula, construiremos duas responsabilidades separadas.

No emissor:

```text
WebhookDelivery;

WebhookDeliveryRepository;

ReservationWebhookFactory;

WebhookDispatcher;

WebhookSigner;

WebhookDeliveryRetryPolicy.
```

No receptor:

```text
CatalogWebhookController;

WebhookSignatureVerifier;

WebhookReplayProtection;

WebhookInbox;

WebhookInboxRepository;

WebhookInboxProcessor.
```

A entrega terá semântica:

```text
at-least-once.
```

Isso significa:

- o emissor pode entregar mais de uma vez;
- o receiver precisa deduplicar;
- o mesmo evento mantém o mesmo `eventId`;
- o mesmo evento mantém o mesmo payload;
- sucesso só é assumido após response `2xx`;
- timeout ou erro transitório pode gerar nova tentativa.

Não prometeremos exactly-once pela rede.

A segurança usará uma assinatura HMAC-SHA-256 calculada sobre:

```text
timestamp
+
"."
+
raw request body.
```

Headers:

```http
X-Webhook-Id: evt_01J2Y7K9M6R3A
X-Webhook-Timestamp: 1783828800
X-Webhook-Key-Id: catalog-webhook-v1
X-Webhook-Signature: v1=<hex>
```

O receiver:

1. lê o body bruto;
2. limita o tamanho;
3. valida timestamp;
4. resolve o secret pelo key ID;
5. recalcula a assinatura;
6. compara em tempo constante;
7. valida o envelope;
8. persiste no inbox;
9. responde rapidamente;
10. processa de forma separada.

O body será:

```json
{
  "eventId": "evt_01J2Y7K9M6R3A",
  "eventType": "reservation.confirmed.v1",
  "occurredAt": "2026-07-12T04:30:00Z",
  "producer": "catalog-provider",
  "tenantId": "bd1ca237-4320-43ca-badc-61f96efad602",
  "data": {
    "reservationId": "RSV-10001",
    "orderId": "ORD-2026-0001",
    "productCode": "SKU-1001",
    "quantity": 2,
    "status": "CONFIRMED"
  }
}
```

O `eventId` é a identidade da ocorrência.

Ele não muda entre tentativas.

O receiver terá uma unique constraint:

```text
UNIQUE (
    producer,
    event_id
)
```

Também armazenará o hash do payload.

Se o mesmo `eventId` chegar com o mesmo hash:

```text
duplicate delivery;

204 No Content;

nenhum novo processamento.
```

Se o mesmo `eventId` chegar com payload diferente:

```text
409 Conflict;

security event;

nenhum processamento.
```

A resposta `204` significa:

```text
evento autenticado
e persistido
para processamento.
```

Ela não significa que todo o efeito de negócio já terminou.

Isso mantém o endpoint rápido.

O handler HTTP não executará:

- chamadas externas longas;
- processamento pesado;
- espera de retry;
- atualização extensa;
- envio de outro webhook.

O processamento será feito por um componente de inbox persistente.

O emissor também não enviará diretamente após o commit sem registro.

A criação da reserva e a criação do `webhook_delivery` ocorrerão na mesma transação.

Depois, um dispatcher buscará entregas `PENDING`.

Esse desenho se aproxima de um outbox transacional, mas o foco desta aula será a entrega HTTP do webhook.

O módulo de mensageria aprofundará outros mecanismos posteriormente.

A política de retry do emissor será:

```text
network failure:
retry.

timeout:
retry.

408:
retry.

425:
retry.

429:
retry respeitando Retry-After.

500, 502, 503, 504:
retry.

outros 4xx:
falha final.
```

A mesma delivery reutiliza:

- `eventId`;
- payload;
- subscription;
- assinatura recalculada com timestamp da tentativa;
- correlation técnica da entrega.

O timestamp da assinatura muda por tentativa.

O `eventId` e o body não mudam.

A aula não aceitará callback URL enviada livremente pelo usuário.

A URL do receiver será configuração controlada:

```text
WEBHOOK_ORDER_CONSUMER_URL.
```

Isso evita que o provider seja usado para chamar hosts arbitrários.

Em produção, a URL precisa usar HTTPS.

O laboratório local poderá usar HTTP somente em loopback.

Ao final, você deverá explicar:

```text
por que webhook
não é mensageria broker;

por que entrega
é at-least-once;

por que receiver
precisa ser idempotente;

por que assinatura
usa o body bruto;

por que timestamp
reduz replay;

por que 2xx significa
accepted e persisted;

por que o handler
precisa responder rápido;

por que secrets,
URLs e payloads
não podem vazar em logs.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
463:
Fallback.

464:
Idempotencia em APIs.

465:
Webhooks.

466:
SOAP conceitual.

467:
XML.
```

A aula 464 respondeu:

```text
como repetir uma escrita
sem duplicar seu efeito?
```

A aula 465 responderá:

```text
como notificar outro sistema
por callback HTTP
com autenticação,
deduplicação
e retry?
```

Nesta aula:

```text
webhook emitter:
sim.

webhook receiver:
sim.

HMAC:
sim.

timestamp:
sim.

replay protection:
sim.

inbox:
sim.

delivery ledger:
sim.

retry:
sim.

SOAP:
próxima aula.
```

A regra central será:

```text
o emissor pode repetir,
então o receptor
precisa autenticar,
persistir e deduplicar.
```

---

## Objetivo prático

Ao final, o `catalog-provider` terá:

```text
ReservationWebhookFactory;

WebhookEventEnvelope;

WebhookDelivery;

WebhookDeliveryRepository;

WebhookDeliveryStatus;

WebhookSubscriptionProperties;

WebhookSigner;

WebhookHttpClient;

WebhookDispatcher;

WebhookDeliveryRetryPolicy;

WebhookDeliveryMetrics.
```

O `order-consumer` terá:

```text
CatalogWebhookController;

WebhookHeaders;

WebhookSignatureVerifier;

WebhookSecretProvider;

WebhookReplayWindow;

WebhookEventEnvelope;

WebhookInbox;

WebhookInboxRepository;

WebhookInboxStatus;

CatalogWebhookInboxProcessor;

WebhookProblemHandler;

WebhookMetrics.
```

Migrations:

```text
catalog-provider:
V6__create_webhook_delivery.sql.

order-consumer:
V6__create_webhook_inbox.sql.
```

Testes:

```text
WebhookSignerTest;

WebhookSignatureVerifierTest;

WebhookTimestampReplayTest;

WebhookRawBodyTest;

WebhookDeliveryPersistenceTest;

WebhookDispatcherRetryTest;

WebhookDispatcherStatusPolicyTest;

WebhookInboxDeduplicationTest;

WebhookPayloadConflictTest;

WebhookFastAcknowledgementTest;

WebhookInboxProcessingTest;

WebhookSecretRotationTest;

WebhookSsrfPolicyTest;

WebhookLoggingSecurityTest;

WebhookMetricsTest;

WebhookContractTest.
```

Documentação:

```text
docs/
├── WEBHOOK_CONTRACT.md
├── WEBHOOK_SECURITY.md
├── WEBHOOK_DELIVERY_POLICY.md
├── WEBHOOK_INBOX_MODEL.md
└── WEBHOOK_RUNBOOK.md
```

Você irá:

1. diferenciar webhook e polling;
2. definir o envelope;
3. definir headers;
4. modelar assinatura;
5. limitar replay;
6. persistir deliveries;
7. criar dispatcher;
8. configurar retry;
9. criar endpoint receptor;
10. ler body bruto;
11. verificar assinatura;
12. validar contrato;
13. persistir inbox;
14. deduplicar eventos;
15. responder rápido;
16. processar inbox;
17. criar métricas;
18. proteger logs;
19. testar concorrência;
20. preparar SOAP conceitual.

---

## Conceito essencial

### Webhook é callback HTTP

O receiver publica um endpoint.

O producer chama esse endpoint quando um evento ocorre.

Não existe broker intermediário obrigatório.

Isso cria acoplamento a:

- disponibilidade do endpoint;
- rede;
- DNS;
- TLS;
- contrato HTTP;
- autenticação;
- política de retry.

---

### Polling e webhook

Polling:

```text
consumer pergunta.
```

Webhook:

```text
producer avisa.
```

Webhooks reduzem consultas vazias, mas adicionam responsabilidade de entrega, assinatura e deduplicação.

Em muitos sistemas, polling de reconciliação continua existindo como mecanismo complementar.

---

### At-least-once

O producer não consegue distinguir com certeza:

```text
receiver não processou
```

de:

```text
receiver processou,
mas a response se perdeu.
```

Por isso, ele pode entregar novamente.

A consequência é:

```text
duplicate delivery
é comportamento esperado.
```

---

### eventId e deliveryId

`eventId` identifica o fato de negócio:

```text
reserva confirmada.
```

`deliveryId` identifica uma tentativa ou uma entrega para determinada subscription.

Nesta baseline:

- o evento mantém `eventId`;
- cada tentativa incrementa `attemptCount`;
- o registro de delivery mantém seu próprio ID.

Não use um novo `eventId` em retry.

---

### Envelope versionado

Event type:

```text
reservation.confirmed.v1.
```

A versão pertence ao nome do contrato.

Mudança incompatível cria:

```text
reservation.confirmed.v2.
```

Campos adicionais compatíveis podem ser aceitos conforme a policy do receiver.

---

### HMAC

HMAC comprova que alguém com o secret calculou a assinatura sobre a mensagem.

Algoritmo:

```text
HmacSHA256.
```

Material:

```text
timestamp + "." + rawBody.
```

A verificação precisa usar os mesmos bytes recebidos.

Não desserialize e serialize novamente antes de verificar.

---

### Comparação em tempo constante

Use:

```java
MessageDigest.isEqual(
    expectedBytes,
    receivedBytes
);
```

Não use `String.equals` para comparar material criptográfico.

Valide o formato antes.

---

### Timestamp e replay

Uma assinatura válida poderia ser capturada e reenviada.

O timestamp limita a janela aceita.

Baseline:

```text
tolerância:
5 minutos.
```

O receiver rejeita timestamps:

- inválidos;
- muito antigos;
- muito no futuro.

A deduplicação por `eventId` permanece necessária.

Timestamp sozinho não evita duas entregas dentro da janela.

---

### Secret e key ID

Header:

```text
X-Webhook-Key-Id.
```

O key ID seleciona o secret correto.

Ele não é o secret.

O laboratório suporta:

- key atual;
- key anterior durante rotação.

Secrets vêm de variável de ambiente ou secret manager.

Não entram no Git nem no banco em texto aberto.

---

### URL controlada

A callback URL não vem do body da reserva.

Ela é configuração da subscription.

Valide:

- scheme;
- host;
- porta;
- ausência de user info;
- ausência de fragment;
- allowlist em produção.

No laboratório, permita apenas `localhost`.

---

### Body limitado

Defina limite:

```text
64 KiB.
```

O endpoint rejeita body maior com:

```text
413 Payload Too Large.
```

Isso reduz risco de consumo de memória e abuso.

---

### Verificação antes da desserialização

Ordem:

1. validar headers;
2. ler body com limite;
3. validar timestamp;
4. verificar HMAC;
5. calcular payload hash;
6. desserializar;
7. validar schema;
8. persistir.

Não use fields do body antes da assinatura.

---

### Inbox persistente

O receiver persiste o evento antes de responder `2xx`.

Tabela:

```text
webhook_inbox.
```

Campos:

- producer;
- event ID;
- event type;
- payload hash;
- raw payload;
- status;
- receivedAt;
- processedAt;
- attempt count;
- last error code.

O raw payload possui retenção e acesso restrito.

Se houver dados sensíveis, aplique minimização ou criptografia.

---

### Responder rápido

O endpoint não executa o processamento final.

Ele responde após persistir.

Motivos:

- evitar timeout do sender;
- reduzir retries desnecessários;
- liberar thread;
- desacoplar duração do negócio;
- permitir reprocessamento local.

---

### Deduplicação

Unique constraint:

```text
producer + event_id.
```

Duplicata com mesmo hash:

```text
204.
```

Duplicata com hash diferente:

```text
409;

security alert.
```

Não atualize o payload original.

---

### Inbox processor

O processor busca:

```text
RECEIVED.
```

Ele atualiza a ordem de forma idempotente.

Status:

```text
RECEIVED;

PROCESSING;

PROCESSED;

FAILED_RETRYABLE;

FAILED_FINAL.
```

Nesta aula, a baseline implementará `RECEIVED`, `PROCESSING` e `PROCESSED`.

Falhas ficam registradas para reprocessamento controlado.

---

### Delivery ledger

O producer persiste:

```text
PENDING;

DELIVERING;

DELIVERED;

FAILED_RETRYABLE;

FAILED_FINAL.
```

Campos:

- event ID;
- destination;
- body;
- attempt count;
- nextAttemptAt;
- last status;
- last error code;
- deliveredAt.

A URL armazenada precisa vir da subscription validada.

---

### Transação de negócio e delivery

Ao confirmar a reserva:

```text
reservation;

stock;

idempotency;

webhook_delivery PENDING;
```

entram na mesma transação.

O envio HTTP ocorre depois.

Assim, o fato não é perdido entre commit e chamada.

---

### Retry de delivery

Backoff didático:

```text
1s;

5s;

30s;

2m;

10m.
```

Com jitter.

Máximo:

```text
5 tentativas.
```

Valores produtivos dependem de contrato e SLO.

---

### Status do receiver

Sucesso:

```text
200 a 299.
```

Retry:

```text
408;

425;

429;

500;

502;

503;

504;

network;

timeout.
```

Falha final:

```text
400;

401;

403;

404;

409 payload conflict;

410;

422.
```

`409 in-progress` poderia ser retryable em outro contrato, mas o receiver desta aula responde `204` para duplicata válida.

---

### Retry-After

Em `429`, respeite `Retry-After` se:

- formato válido;
- dentro do máximo;
- compatível com retention;
- dentro da policy.

Não tente antes do valor informado.

---

### Assinatura por tentativa

O payload e o `eventId` permanecem iguais.

O timestamp muda.

A assinatura muda porque inclui o timestamp.

Isso mantém a proteção de replay da tentativa atual.

---

### Segurança em logs

Permitido:

```text
eventId;

eventType;

attempt;

outcome;

status class;

duration;

correlation ID;

key ID.
```

Proibido:

- secret;
- signature completa;
- bearer token;
- body completo;
- URL com query sensível;
- stack no response.

---

## Mão na massa guiada

### 1. Criar o contrato

Arquivo:

```text
docs/WEBHOOK_CONTRACT.md
```

Defina:

| Item | Valor |
|---|---|
| Endpoint | POST /api/v1/webhooks/catalog |
| Content-Type | application/json |
| Event | reservation.confirmed.v1 |
| Ack | 204 |
| Auth | HMAC-SHA256 |
| Replay window | 5m |
| Max body | 64 KiB |
| Delivery | at-least-once |
| Duplicate | 204 |
| Conflict | 409 |

---

### 2. Criar migration do delivery

No provider:

```sql
CREATE TABLE webhook_delivery (
    id UUID PRIMARY KEY,
    event_id VARCHAR(80) NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    subscription_name VARCHAR(120) NOT NULL,
    destination_url VARCHAR(500) NOT NULL,
    payload TEXT NOT NULL,
    payload_hash CHAR(64) NOT NULL,
    status VARCHAR(40) NOT NULL,
    attempt_count INTEGER NOT NULL,
    next_attempt_at TIMESTAMPTZ NOT NULL,
    last_http_status INTEGER,
    last_error_code VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL,
    delivered_at TIMESTAMPTZ,
    CONSTRAINT uq_webhook_event_subscription
        UNIQUE (
            event_id,
            subscription_name
        )
);

CREATE INDEX ix_webhook_delivery_dispatch
    ON webhook_delivery (
        status,
        next_attempt_at
    );
```

---

### 3. Criar delivery na transação

Depois de confirmar a reserva:

```java
WebhookEventEnvelope event =
        webhookFactory.reservationConfirmed(
            reservation
        );

deliveryRepository.save(
    WebhookDelivery.pending(
        event,
        subscription
    )
);
```

Não execute HTTP dentro dessa transação.

---

### 4. Criar envelope

```java
public record WebhookEventEnvelope<T>(
        String eventId,
        String eventType,
        Instant occurredAt,
        String producer,
        UUID tenantId,
        T data
) {
}
```

O `eventId` é gerado uma vez.

---

### 5. Criar payload determinístico

Serialize o envelope uma vez ao criar a delivery.

Armazene os bytes ou a string UTF-8 exata.

As tentativas reutilizam o mesmo payload.

Não reserialize a entity a cada retry.

---

### 6. Criar signer

```java
@Component
public class WebhookSigner {

    public String sign(
            String timestamp,
            byte[] rawBody,
            SecretKey secretKey
    ) {
        byte[] prefix =
                (timestamp + ".")
                    .getBytes(
                        StandardCharsets.UTF_8
                    );

        byte[] material =
                ByteBuffer
                    .allocate(
                        prefix.length
                        + rawBody.length
                    )
                    .put(prefix)
                    .put(rawBody)
                    .array();

        Mac mac =
                Mac.getInstance(
                    "HmacSHA256"
                );

        mac.init(secretKey);

        return "v1="
                + HexFormat.of()
                           .formatHex(
                               mac.doFinal(
                                   material
                               )
                           );
    }
}
```

Trate checked exceptions em uma exception interna segura.

---

### 7. Criar subscription properties

```yaml
integrations:
  order-webhook:
    url: ${ORDER_WEBHOOK_URL:http://localhost:8080/api/v1/webhooks/catalog}
    key-id: ${ORDER_WEBHOOK_KEY_ID:catalog-webhook-v1}
    secret: ${ORDER_WEBHOOK_SECRET}
```

O secret não possui default.

---

### 8. Validar URL

Rejeite:

- scheme diferente de HTTP/HTTPS;
- user info;
- fragment;
- host ausente;
- host não permitido em release;
- URL enviada pelo usuário.

Em produção:

```text
HTTPS obrigatório.
```

---

### 9. Criar WebhookHttpClient

Use `RestClient` dedicado no dispatcher imperativo.

Envie:

```http
Content-Type: application/json
X-Webhook-Id
X-Webhook-Timestamp
X-Webhook-Key-Id
X-Webhook-Signature
X-Correlation-Id
```

Aplique timeout menor que o intervalo de dispatch.

---

### 10. Criar dispatcher

Fluxo:

1. buscar deliveries vencidas;
2. adquirir lote com lock controlado;
3. marcar `DELIVERING`;
4. enviar;
5. classificar response;
6. marcar `DELIVERED`, `FAILED_RETRYABLE` ou `FAILED_FINAL`;
7. calcular `nextAttemptAt`.

Evite dois workers entregando a mesma row.

Use `FOR UPDATE SKIP LOCKED` ou aquisição equivalente.

---

### 11. Criar retry policy

```java
public WebhookDeliveryDecision decide(
        DeliveryAttemptResult result,
        int attempt
) {
    if (result.isSuccess()) {
        return delivered();
    }

    if (
        attempt >= maxAttempts
        || result.isPermanentFailure()
    ) {
        return failedFinal();
    }

    return retryAt(
        clock.instant()
             .plus(
                 backoff.withJitter(
                     attempt
                 )
             )
    );
}
```

---

### 12. Criar migration do inbox

No receiver:

```sql
CREATE TABLE webhook_inbox (
    id UUID PRIMARY KEY,
    producer VARCHAR(120) NOT NULL,
    event_id VARCHAR(80) NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    payload_hash CHAR(64) NOT NULL,
    raw_payload TEXT NOT NULL,
    status VARCHAR(40) NOT NULL,
    received_at TIMESTAMPTZ NOT NULL,
    processing_started_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    processing_attempts INTEGER NOT NULL,
    last_error_code VARCHAR(120),
    CONSTRAINT uq_webhook_inbox_event
        UNIQUE (
            producer,
            event_id
        )
);

CREATE INDEX ix_webhook_inbox_processing
    ON webhook_inbox (
        status,
        received_at
    );
```

---

### 13. Criar body reader limitado

No Spring MVC, leia `byte[]` com limite configurado.

No WebFlux, agregue o body somente até o limite.

Se exceder:

```text
413.
```

Não converta para String antes de verificar charset e limite.

Baseline:

```text
UTF-8;

application/json;

sem compressão.
```

---

### 14. Criar secret provider

```java
public interface WebhookSecretProvider {

    Optional<SecretKey> find(
            String keyId
    );
}
```

Implementação resolve key atual e anterior.

Key ID desconhecido:

```text
401.
```

Não revele quais IDs existem.

---

### 15. Criar replay window

```java
@Component
public class WebhookReplayWindow {

    private final Clock clock;
    private final Duration tolerance;

    public void validate(
            Instant requestTimestamp
    ) {
        Duration difference =
                Duration.between(
                    requestTimestamp,
                    clock.instant()
                ).abs();

        if (
            difference.compareTo(
                tolerance
            ) > 0
        ) {
            throw new WebhookTimestampRejectedException();
        }
    }
}
```

Use epoch seconds no header.

---

### 16. Criar verifier

```java
public void verify(
        WebhookHeaders headers,
        byte[] rawBody
) {
    replayWindow.validate(
        headers.timestamp()
    );

    SecretKey secret =
            secretProvider
                .find(
                    headers.keyId()
                )
                .orElseThrow(
                    InvalidWebhookSignatureException::new
                );

    String expected =
            signer.sign(
                headers.rawTimestamp(),
                rawBody,
                secret
            );

    if (
        !MessageDigest.isEqual(
            expected.getBytes(
                StandardCharsets.US_ASCII
            ),
            headers.signature()
                   .getBytes(
                       StandardCharsets.US_ASCII
                   )
        )
    ) {
        throw new InvalidWebhookSignatureException();
    }
}
```

Valide o formato `v1=` antes.

---

### 17. Criar controller

Fluxo do endpoint:

1. validar headers obrigatórios;
2. ler body bruto limitado;
3. verificar assinatura;
4. calcular SHA-256 do payload;
5. desserializar envelope;
6. validar `eventId` do body igual ao header;
7. validar producer e event type;
8. persistir no inbox;
9. responder `204`.

---

### 18. Implementar deduplicação

Na unique violation:

- buscar evento existente;
- comparar payload hash;
- mesmo hash: `204`;
- hash diferente: `409`;
- não sobrescrever;
- registrar security event.

A comparação deve ocorrer dentro de uma transação curta.

---

### 19. Criar processor

O processor busca `RECEIVED`.

Para `reservation.confirmed.v1`:

- validar tenant;
- localizar ordem por `orderId`;
- validar reservation ID;
- aplicar transição idempotente;
- marcar `PROCESSED`.

Se a ordem já estiver confirmada com a mesma reservation:

```text
sucesso idempotente.
```

Se estiver confirmada com outra reservation:

```text
FAILED_FINAL;

alerta.
```

---

### 20. Responder rápido

Teste que o controller não chama o processor diretamente.

Architecture test falha se o controller importar:

- order repository;
- external clients;
- retry service;
- dispatcher.

O controller só valida e persiste.

---

### 21. Testar assinatura válida

Use secret sintético.

Esperado:

```text
204;

1 inbox row.
```

---

### 22. Testar body alterado

Assine body A e envie body B.

Esperado:

```text
401;

zero inbox rows.
```

---

### 23. Testar timestamp antigo

Timestamp com seis minutos de idade.

Esperado:

```text
401;

zero inbox rows.
```

Use mensagem pública genérica:

```text
invalid webhook authentication.
```

---

### 24. Testar timestamp futuro

Acima da tolerância:

```text
401.
```

---

### 25. Testar key ID desconhecido

Esperado:

```text
401.
```

Não diferencie publicamente assinatura inválida e key desconhecida.

---

### 26. Testar duplicata

Envie o mesmo evento duas vezes.

Esperado:

```text
204 nas duas;

1 inbox row;

1 processamento.
```

---

### 27. Testar conflito de payload

Mesmo `eventId`, body diferente e assinatura válida.

Esperado:

```text
409;

payload original preservado;

security metric.
```

---

### 28. Testar concorrência

Duas deliveries iguais simultâneas.

A unique constraint garante:

```text
1 row;

0 duplicação de processamento.
```

---

### 29. Testar ack rápido

Mantenha o processor bloqueado em uma barrier.

O endpoint ainda retorna após persistir.

Não use limite exato frágil; valide ausência de chamada síncrona e uma margem ampla.

---

### 30. Testar retry do emissor

Stub receiver:

```text
primeira tentativa:
503;

segunda:
204.
```

Esperado:

```text
mesmo eventId;

mesmo body;

timestamps diferentes;

signatures diferentes;

status DELIVERED.
```

---

### 31. Testar falha permanente

Receiver retorna:

```text
400.
```

Esperado:

```text
1 tentativa;

FAILED_FINAL.
```

---

### 32. Testar 429

Retorne:

```http
429 Too Many Requests
Retry-After: 10
```

O `nextAttemptAt` respeita o valor.

---

### 33. Testar timeout

Receiver persiste e não devolve response.

O emissor repete.

O receiver deduplica.

Esse teste demonstra at-least-once.

---

### 34. Testar rotação de secret

Durante a janela:

- assinatura com key atual: aceita;
- assinatura com key anterior: aceita;
- key desconhecida: rejeita.

Depois da janela, remova a key anterior.

---

### 35. Testar SSRF policy

Falhe no startup se a URL de release apontar para:

- HTTP;
- loopback;
- link-local;
- user info;
- host não allowlisted.

O profile local permite apenas loopback.

---

### 36. Criar métricas do emissor

```text
webhook.delivery.created;

webhook.delivery.attempt;

webhook.delivery.success;

webhook.delivery.retry;

webhook.delivery.failed_final;

webhook.delivery.duration.
```

Tags:

```text
event.type;

subscription;

outcome;

status.class.
```

---

### 37. Criar métricas do receiver

```text
webhook.received;

webhook.auth_failed;

webhook.replay_rejected;

webhook.duplicate;

webhook.payload_conflict;

webhook.inbox.processed;

webhook.inbox.failed.
```

Não use event ID como tag.

---

### 38. Criar logs seguros

Sentinelas:

```text
webhook-secret-sentinel;

webhook-signature-sentinel;

webhook-body-sentinel;

webhook-token-sentinel.
```

Capture logs de sucesso e falha.

Nenhuma sentinela aparece.

---

### 39. Criar contract tests

Valide:

- headers;
- event type;
- required fields;
- timestamp format;
- status codes;
- duplicate behavior;
- response sem body no `204`.

Não antecipe WireMock; ele terá aula própria.

Use server stub controlado nesta aula.

---

### 40. Criar runbook

Arquivo:

```text
docs/WEBHOOK_RUNBOOK.md
```

Perguntas:

- qual event ID;
- qual subscription;
- qual attempt;
- receiver respondeu;
- status class;
- timestamp aceito;
- key ID ativo;
- signature falhou;
- inbox contém evento;
- payload hash coincide;
- processor concluiu;
- retry está agendado;
- delivery virou final;
- secret foi rotacionado;
- URL foi alterada;
- duplicatas aumentaram.

---

### 41. Executar testes provider

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider

.\mvnw.cmd `
  -Dtest=WebhookSignerTest,WebhookDeliveryPersistenceTest,WebhookDispatcherRetryTest,WebhookDispatcherStatusPolicyTest,WebhookSsrfPolicyTest,WebhookLoggingSecurityTest,WebhookMetricsTest,WebhookContractTest `
  test
```

---

### 42. Executar testes receiver

```powershell
Set-Location `
  ..\order-consumer

.\mvnw.cmd `
  -Dtest=WebhookSignatureVerifierTest,WebhookTimestampReplayTest,WebhookRawBodyTest,WebhookInboxDeduplicationTest,WebhookPayloadConflictTest,WebhookFastAcknowledgementTest,WebhookInboxProcessingTest,WebhookSecretRotationTest,WebhookLoggingSecurityTest,WebhookMetricsTest,WebhookContractTest `
  test
```

---

### 43. Executar cenário integrado

1. suba consumer;
2. suba provider;
3. crie reserva;
4. confirme delivery `PENDING`;
5. execute dispatcher;
6. confirme `204`;
7. confirme delivery `DELIVERED`;
8. confirme inbox `RECEIVED`;
9. execute processor;
10. confirme `PROCESSED`.

---

### 44. Executar perda de response

Faça o receiver persistir e o client perder a response.

Confirme:

```text
retry do emissor;

duplicate no receiver;

1 inbox row;

1 processamento.
```

---

### 45. Executar gates

Nos dois projetos:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- migrations;
- signature;
- replay window;
- dedup;
- retry;
- fast ack;
- processing;
- URL policy;
- logs;
- metrics;
- no secrets.

---

### 46. Registrar limitações

Ainda faltam:

```text
mTLS;

secret manager real;

DNS rebinding protection;

delivery dashboard;

replay manual autorizado;

payload encryption;

multi-region;

schema registry;

outbox genérico;

load test;

retenção produtiva.
```

---

## Entendendo o que foi feito

### O produtor passou a avisar mudanças

O consumer não precisa consultar continuamente.

### A entrega ficou persistente

A reserva e o registro de delivery confirmam juntos.

### A rede ficou at-least-once

Timeout pode produzir nova entrega.

### O receiver ficou idempotente

O `eventId` e a unique constraint impedem processamento duplicado.

### A autenticidade ficou verificável

HMAC protege timestamp e body bruto.

### Replay ficou limitado

Timestamp e deduplicação atuam juntos.

### O ack ficou rápido

O endpoint persiste e responde antes do processamento.

### Retry ficou classificado

Falhas transitórias e permanentes recebem decisões diferentes.

### Segurança operacional foi preservada

Secrets, signatures e payloads não aparecem nos logs.

### A próxima tecnologia ficou contextualizada

SOAP também usa contratos de integração, mas com envelope, XML e padrões próprios.

---

## Erros comuns importantes

### Enviar dentro da transação

A dependência externa segura locks e pode causar rollback.

### Gerar novo event ID no retry

O receiver não consegue deduplicar.

### Verificar assinatura após desserializar

Os bytes podem mudar.

### Assinar somente o body

Uma assinatura capturada pode ser reutilizada por mais tempo.

### Confiar apenas no timestamp

Duas entregas na janela ainda podem ocorrer.

### Processar tudo no controller

O sender recebe timeout e repete.

### Retornar `2xx` antes de persistir

O evento pode ser perdido após o ack.

### Aceitar callback URL do usuário

O provider pode virar ferramenta de SSRF.

### Retry de qualquer `4xx`

Erros permanentes geram pressão inútil.

### Logar signature e body

Secrets e dados podem vazar.

---

## Comandos úteis

### Testes de segurança

```powershell
.\mvnw.cmd `
  -Dtest=WebhookSignerTest,WebhookSignatureVerifierTest,WebhookTimestampReplayTest,WebhookSecretRotationTest,WebhookSsrfPolicyTest `
  test
```

### Deduplicação

```powershell
.\mvnw.cmd `
  -Dtest=WebhookInboxDeduplicationTest,WebhookPayloadConflictTest,WebhookInboxProcessingTest `
  test
```

### Delivery

```powershell
.\mvnw.cmd `
  -Dtest=WebhookDeliveryPersistenceTest,WebhookDispatcherRetryTest,WebhookDispatcherStatusPolicyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar vazamentos

```powershell
git grep `
  -n `
  -E `
  "webhook.*secret|X-Webhook-Signature|rawPayload|destinationUrl|log\\..*body"
```

---

## Exercício guiado

### Parte 1 — Contrato

Defina endpoint, envelope, headers e status.

### Parte 2 — Emissor

Persista delivery na transação da reserva.

### Parte 3 — Assinatura

Implemente HMAC sobre timestamp e body bruto.

### Parte 4 — Dispatcher

Envie e classifique responses.

### Parte 5 — Receiver

Valide headers, limite body e verifique assinatura.

### Parte 6 — Inbox

Persista e deduplique por `eventId`.

### Parte 7 — Processor

Aplique o evento de forma idempotente.

### Parte 8 — Retry

Teste perda de response e duplicata.

### Parte 9 — Segurança

Teste replay, secret rotation, SSRF e logs.

### Parte 10 — Gate

Comprove uma entrega lógica e um processamento.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 464 foi preservada;
- webhook foi diferenciado de polling;
- entrega at-least-once foi explicada;
- envelope versionado foi criado;
- `eventId` permanece estável;
- payload permanece estável entre tentativas;
- delivery foi persistida;
- delivery foi criada na transação da reserva;
- HTTP não ocorre dentro da transação;
- dispatcher foi criado;
- statuses de delivery foram modelados;
- retry usa backoff e jitter;
- status transitórios e permanentes foram classificados;
- `Retry-After` foi respeitado;
- URL é configuração controlada;
- HTTPS é obrigatório em release;
- policy de SSRF foi criada;
- HMAC-SHA-256 foi implementado;
- assinatura cobre timestamp e body bruto;
- key ID foi criado;
- secret não está no Git;
- comparação usa tempo constante;
- replay window foi configurada;
- timestamps antigos e futuros são rejeitados;
- body possui limite;
- assinatura é verificada antes do parse;
- endpoint receiver foi criado;
- inbox persistente foi criada;
- unique constraint por producer e event ID foi criada;
- payload hash foi armazenado;
- duplicata idêntica retorna `204`;
- payload conflitante retorna `409`;
- controller responde após persistir;
- processamento não ocorre no controller;
- processor de inbox foi criado;
- processamento é idempotente;
- concorrência de duplicates foi testada;
- ack rápido foi testado;
- perda de response foi testada;
- retry preserva event ID;
- timestamp e assinatura mudam por tentativa;
- secret rotation foi testada;
- métricas do sender foram criadas;
- métricas do receiver foram criadas;
- logs não contêm secret, assinatura ou body;
- contract tests foram criados;
- runbook foi criado;
- SOAP não foi antecipado;
- limitações foram registradas;
- produção pública permaneceu NO-GO;
- gates dos dois projetos foram executados;
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
  "X-Webhook-Signature|ORDER_WEBHOOK_SECRET|raw_payload|destination_url|log\\..*payload|log\\..*signature"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider `
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
git commit -m "feat(m16): implementar entrega segura de webhooks"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- webhook secret;
- signature real;
- `.env`;
- callback arbitrário;
- payload real;
- dump do inbox;
- endpoint público sem HMAC;
- retry infinito;
- processamento pesado no controller;
- SOAP antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a confirmação de reserva passou a gerar um callback HTTP seguro.

No provider:

```text
reserva confirmada;

delivery PENDING;

commit;

dispatcher;

assinatura;

HTTP POST;

retry;

DELIVERED.
```

No receiver:

```text
body limitado;

timestamp;

HMAC;

contrato;

inbox;

deduplicação;

204;

processamento.
```

A principal decisão foi:

```text
webhook possui
entrega at-least-once;

duplicata é esperada;

o receiver precisa
ser idempotente.
```

Também ficou comprovado que:

- o mesmo evento mantém o mesmo `eventId`;
- retries recalculam timestamp e assinatura;
- assinatura usa o body bruto;
- timestamp e inbox reduzem replay;
- `2xx` só é devolvido após persistência;
- o processamento final não pertence ao controller;
- callback URL não pode ser input arbitrário;
- segredo e payload não pertencem aos logs.

A idempotência da aula 464 apareceu novamente.

No sender, ela preserva a criação da reserva.

No receiver, ela impede que entregas repetidas atualizem a ordem mais de uma vez.

A próxima aula será:

```text
466 - M16.11 - SOAP conceitual
```

Nela, você irá:

- compreender o que é SOAP;
- diferenciar SOAP e REST;
- compreender envelope, header e body;
- conhecer WSDL;
- entender operações e bindings;
- compreender faults;
- discutir WS-Security;
- analisar quando sistemas legados ainda utilizam SOAP;
- preparar o estudo prático de XML da aula seguinte.

---

# Material complementar

## Checkpoint final

- [ ] Persisti delivery antes do envio.
- [ ] Assinei timestamp e body bruto.
- [ ] Deduplicatei pelo event ID.
- [ ] Respondi após persistir no inbox.
- [ ] Testei retry, replay e perda de response.

---

## Troubleshooting adicional

### Assinatura sempre falha

Confirme bytes UTF-8, timestamp textual, prefixo `v1=` e ausência de reserialização.

### Duplicata cria nova row

A unique constraint pode não estar aplicada ou o producer difere.

### Sender repete após `204`

Confirme tratamento de toda a classe `2xx`.

### Receiver demora demais

Procure processamento de negócio no controller.

### Timestamp válido é rejeitado

Revise Clock, timezone e uso de epoch seconds.

### Payload conflitante retorna `204`

O hash não está sendo comparado.

### Dois dispatchers enviam a mesma row

Implemente aquisição com lock e `SKIP LOCKED`.

### Secret aparece no log

Revise exceptions, config binding e request dumps.

### URL de release aceita HTTP

A policy de startup não está ativa no profile correto.

### Evento foi aceito, mas não processado

Consulte status e erro do inbox processor.

---

## Perguntas de revisão

1. O que é webhook?
2. Qual a diferença para polling?
3. A entrega é exactly-once?
4. Por que duplicatas acontecem?
5. O que identifica o fato?
6. O event ID muda no retry?
7. O que a assinatura cobre?
8. Por que usar body bruto?
9. Para que serve o timestamp?
10. Timestamp substitui deduplicação?
11. O que seleciona o secret?
12. Key ID é secret?
13. Quando retornar `2xx`?
14. O controller processa o negócio?
15. Como deduplicar?
16. O que fazer com mesmo ID e body diferente?
17. Callback URL pode vir do usuário?
18. Webhook é um broker?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Callback HTTP iniciado pelo producer.
2. Polling pergunta; webhook avisa.
3. Não, at-least-once.
4. Timeout e response perdida.
5. `eventId`.
6. Não.
7. Timestamp e body bruto.
8. Para preservar os bytes assinados.
9. Limitar replay.
10. Não.
11. Key ID.
12. Não.
13. Após autenticar e persistir.
14. Não.
15. Unique constraint e payload hash.
16. `409` e alerta.
17. Não.
18. Não.
19. SOAP conceitual.
20. Envelope, WSDL, faults e segurança.

---

## Desafio opcional

Implemente uma segunda subscription para auditoria.

Requisitos:

- delivery independente;
- mesmo `eventId`;
- outro subscription name;
- outro secret;
- outro destination;
- status próprio;
- falha de auditoria não altera a entrega para ordens;
- métricas separadas;
- nenhuma URL fornecida pelo usuário.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 465 - M16.10 - Webhooks

- Diferenciei webhook e polling.
- Modelei entrega at-least-once.
- Criei envelope `reservation.confirmed.v1`.
- Mantive `eventId` estável entre tentativas.
- Persisti `webhook_delivery` na transação da reserva.
- Mantive HTTP fora da transação.
- Criei dispatcher de deliveries.
- Modelei estados de entrega.
- Classifiquei statuses retryable e finais.
- Implementei backoff, jitter e `Retry-After`.
- Mantive callback URL em configuração controlada.
- Criei policy contra SSRF.
- Exigi HTTPS em release.
- Implementei HMAC-SHA-256.
- Assinei timestamp e body bruto.
- Criei `X-Webhook-Key-Id`.
- Mantive secret fora do Git.
- Usei comparação em tempo constante.
- Criei replay window de cinco minutos.
- Limitei body a 64 KiB.
- Verifiquei assinatura antes do parse.
- Criei endpoint receiver.
- Criei tabela `webhook_inbox`.
- Deduplicatei por producer e event ID.
- Armazenei payload hash.
- Retornei `204` para duplicata idêntica.
- Retornei `409` para payload conflitante.
- Respondi somente após persistir.
- Mantive processamento fora do controller.
- Criei inbox processor idempotente.
- Testei concorrência de duplicatas.
- Testei ack rápido.
- Testei perda de response.
- Confirmei mesmo event ID e body no retry.
- Confirmei timestamp e assinatura novos por tentativa.
- Testei rotação de secrets.
- Criei métricas de sender e receiver.
- Criei logs sem secret, signature ou payload.
- Criei contract tests e runbook.
- Registrei gaps de mTLS, secret manager e multi-region.
- Não antecipei SOAP.
- Mantive produção pública como NO-GO.
- Próxima aula: SOAP conceitual.
```

---

## Referência técnica curta

- [RFC 2104 — HMAC](https://www.rfc-editor.org/rfc/rfc2104)
- [RFC 4231 — HMAC-SHA Test Cases](https://www.rfc-editor.org/rfc/rfc4231)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [OWASP — Webhook Security Guidelines](https://cheatsheetseries.owasp.org/)
- [Spring Framework — RestClient](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
- [PostgreSQL — Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)

Regra final:

```text
webhooks seguros devem assumir entrega at-least-once: o producer persiste a delivery junto ao fato de negócio, envia depois do commit, mantém event ID e payload entre tentativas, aplica timeout, retry, backoff e classificação de status, assina timestamp e body bruto com HMAC e usa uma URL controlada; o receiver limita o body, valida timestamp, key ID e assinatura antes do parse, persiste em inbox antes do ack, deduplica por producer e event ID, rejeita payload conflitante, responde rapidamente e processa de forma idempotente, enquanto secrets, signatures, URLs sensíveis e payloads permanecem fora de logs e contratos públicos.
```
