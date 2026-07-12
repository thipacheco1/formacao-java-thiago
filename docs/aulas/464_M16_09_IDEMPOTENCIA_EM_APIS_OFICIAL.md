# 464 - M16.09 - Idempotencia em APIs

## Apresentação da aula

Até a aula anterior, o laboratório trabalhou principalmente com uma leitura:

```http
GET /api/v1/products/{productCode}/availability
```

Essa chamada recebeu timeout, retry, circuit breaker, bulkhead e fallback conservador.

Agora o problema muda.

O `order-consumer` precisará criar uma reserva no `catalog-provider`:

```http
POST /api/v1/reservations
```

Request:

```json
{
  "orderId": "ORD-2026-0001",
  "productCode": "SKU-1001",
  "quantity": 2
}
```

A primeira chamada pode criar:

```text
reservationId:
RSV-10001;

estoque:
25 -> 23;

status:
201 Created.
```

Imagine o fluxo:

```text
consumer envia POST;

provider cria a reserva;

transação confirma;

response se perde;

consumer recebe timeout.
```

O consumidor não sabe se a operação foi concluída.

Se repetir o `POST` sem proteção, o provider pode criar outra reserva:

```text
RSV-10002;

estoque:
23 -> 21.
```

Uma única intenção produziu dois efeitos.

Esse problema pode gerar:

- reserva duplicada;
- cobrança duplicada;
- ordem duplicada;
- estoque incorreto;
- eventos repetidos;
- divergência entre sistemas.

A pergunta central será:

```text
como repetir
uma operação de escrita
sem duplicar
o efeito de negócio?
```

A resposta é:

```text
idempotência.
```

Uma operação idempotente aceita repetição da mesma intenção sem produzir um novo efeito de negócio.

Isso não significa que nenhuma request será processada novamente.

No replay, o provider ainda pode:

- autenticar;
- autorizar;
- validar headers;
- consultar o banco;
- registrar métricas;
- devolver uma response armazenada.

O que ele não pode fazer é criar uma segunda reserva para a mesma intenção.

Nesta aula, usaremos:

```http
Idempotency-Key: 9f62bc58-8cb8-4de4-bfc8-7e1b5e37ad9f
```

A key será gerada pelo client e enviada em todas as tentativas da mesma operação.

O provider armazenará:

- tenant;
- operation;
- idempotency key;
- fingerprint da request;
- status de processamento;
- recurso criado;
- status HTTP;
- body da response;
- timestamps;
- expiração.

O escopo será:

```text
tenant
+
operation
+
idempotency key.
```

No PostgreSQL:

```text
UNIQUE (
    tenant_id,
    operation_name,
    idempotency_key
)
```

A state machine inicial será:

```text
PROCESSING;

COMPLETED.
```

Primeira request:

```text
cria PROCESSING;

executa reserva;

altera estoque;

salva response;

marca COMPLETED;

retorna 201.
```

Replay com mesma key e mesmo payload:

```text
COMPLETED encontrado;

nenhuma nova reserva;

response original;

Idempotent-Replayed: true.
```

Mesma key com payload diferente:

```text
409 Conflict;

code:
idempotency_key_reused_with_different_request.
```

Segunda request enquanto a primeira ainda processa:

```text
409 Conflict;

code:
idempotency_request_in_progress.
```

O registro ficará no PostgreSQL, não em cache local.

A proteção precisa sobreviver a:

- múltiplas réplicas;
- reinício;
- concorrência;
- retry;
- failover da aplicação.

A request será ligada à key por um fingerprint SHA-256 calculado sobre uma representação canônica.

Não usaremos os bytes brutos do JSON.

Estes payloads possuem a mesma semântica:

```json
{
  "orderId": "ORD-1",
  "productCode": "SKU-1",
  "quantity": 2
}
```

```json
{"quantity":2,"productCode":"SKU-1","orderId":"ORD-1"}
```

A ordem dos campos e os espaços não podem gerar conflito.

O fingerprint incluirá:

- tenant;
- operation;
- orderId;
- productCode;
- quantity;
- versão do esquema idempotente.

Não incluirá:

- bearer token;
- correlation ID;
- whitespace;
- timestamps de transporte;
- headers semânticos irrelevantes.

A implementação usará uma única transação para:

```text
registrar PROCESSING;

validar estoque;

criar reserva;

reduzir quantidade;

armazenar response;

marcar COMPLETED.
```

Se a transação falhar, todos os efeitos serão desfeitos.

O consumer também será atualizado.

Ele deverá:

1. gerar uma key uma única vez;
2. manter a key fora da execução repetida;
3. reutilizar a key no retry;
4. reutilizar o mesmo payload;
5. validar o resultado recebido;
6. nunca criar nova key para a mesma intenção.

A composição continuará:

```text
Bulkhead;

Circuit Breaker;

Retry;

Timeout;

HTTP POST
com Idempotency-Key.
```

O retry da escrita passa a ser aceitável somente porque o provider impede duplicidade.

A próxima aula será:

```text
465 - M16.10 - Webhooks
```

A idempotência construída aqui será reutilizada no recebimento de entregas duplicadas de webhooks.

---

## Onde estamos na formação

A sequência oficial é:

```text
462:
Bulkhead e isolamento.

463:
Fallback.

464:
Idempotencia em APIs.

465:
Webhooks.

466:
SOAP conceitual.
```

A aula 463 respondeu:

```text
qual resposta alternativa
é segura
quando uma leitura falha?
```

A aula 464 responderá:

```text
como repetir uma escrita
sem repetir
o efeito de negócio?
```

Nesta aula:

```text
POST de reserva:
sim.

Idempotency-Key:
sim.

fingerprint:
sim.

unique constraint:
sim.

concorrência:
sim.

response replay:
sim.

retry de escrita:
sim, após proteção.

webhooks:
próxima aula.
```

A regra central será:

```text
mesma intenção,
mesma key,
mesmo payload,
um único efeito.
```

---

## Objetivo prático

Ao final, o `catalog-provider` terá:

```text
ReservationController;

CreateReservationService;

Reservation;

ReservationRepository;

IdempotencyRecord;

IdempotencyRecordRepository;

IdempotencyKey;

ReservationRequestFingerprint;

ReservationIdempotencyCoordinator;

ReservationHttpResult;

ReservationProblemHandler.
```

Migration:

```text
V5__create_reservations_and_idempotency.sql.
```

Nos consumers:

```text
ReservationGateway;

RestClientReservationGateway;

ReactiveReservationGateway;

WebClientReservationGateway;

ReservationIdempotencyKeyFactory;

CreateOrderReservationService.
```

Testes:

```text
IdempotencyKeyValidationTest;

ReservationRequestFingerprintTest;

ReservationIdempotencyCoordinatorTest;

ReservationConcurrencyTest;

ReservationReplayContractTest;

ReservationPayloadConflictTest;

ReservationProcessingConflictTest;

ReservationTransactionRollbackTest;

ReservationExpirationTest;

RestClientReservationRetryTest;

WebClientReservationRetryTest;

IdempotencySecurityTest;

IdempotencyMetricsTest;

IdempotencyBoundaryPolicyTest.
```

Documentação:

```text
docs/
├── IDEMPOTENCY_POLICY.md
├── IDEMPOTENCY_STATE_MACHINE.md
├── IDEMPOTENCY_DATA_MODEL.md
├── IDEMPOTENCY_CONCURRENCY.md
└── IDEMPOTENCY_RUNBOOK.md
```

Você irá:

1. diferenciar método e operação;
2. definir o contrato;
3. modelar a key;
4. criar fingerprint;
5. criar migrations;
6. criar unique constraint;
7. modelar estados;
8. implementar aquisição;
9. implementar replay;
10. proteger concorrência;
11. manter transação única;
12. armazenar response segura;
13. configurar retenção;
14. integrar RestClient;
15. integrar WebClient;
16. habilitar retry seguro;
17. criar métricas;
18. criar logs;
19. testar perda de response;
20. preparar webhooks.

---

## Conceito essencial

### Método idempotente e operação idempotente

`GET`, `PUT` e `DELETE` possuem semântica idempotente no HTTP.

`POST` não possui essa garantia por padrão.

Entretanto, uma API pode tornar um `POST` idempotente por contrato.

A propriedade precisa existir no comportamento real, não apenas na documentação.

Um `PUT` também pode ser implementado incorretamente e duplicar efeitos colaterais.

---

### Mesmo efeito, não mesma execução

No replay, o provider pode executar controles técnicos novamente.

A reserva, a redução de estoque e o recurso final não podem ser criados novamente.

---

### Quem gera a key

O client gera a key porque ele conhece a intenção que poderá ser repetida.

Baseline:

```text
UUID aleatório;
valor opaco;
sem dados pessoais.
```

A key não é autenticação.

Ela não substitui token, permission ou tenant.

---

### Validação da key

Regras:

```text
mínimo:
16 caracteres;

máximo:
100 caracteres;

permitidos:
letras, números,
hífen e underscore.
```

Não aceite controles, espaços ou conteúdo ilimitado.

---

### Escopo da key

O scope inclui:

```text
tenant;

operation;

key.
```

A mesma key em outro tenant não pode recuperar a response.

A mesma key em outra operação não deve colidir.

---

### Fingerprint

O fingerprint liga a key ao payload sem depender do texto bruto.

Use:

```text
SHA-256.
```

Material canônico:

```java
public record ReservationIdempotencyMaterial(
        String tenantId,
        String operation,
        String orderId,
        String productCode,
        int quantity,
        int schemaVersion
) {
}
```

Não use:

```java
request.toString();
```

---

### Payload diferente

Mesma key com fingerprint diferente é conflito.

Não sobrescreva o registro.

Não gere nova reserva.

Não retorne a response antiga para uma intenção diferente.

---

### PROCESSING

`PROCESSING` representa a aquisição da key por uma request.

Enquanto esse estado existe, outra request não pode executar a operação.

Ela recebe conflito controlado.

---

### COMPLETED

`COMPLETED` possui:

- resource ID;
- response status;
- content type;
- body;
- completion time;
- expiration.

O replay devolve esse snapshot.

---

### Transação

O fluxo crítico usa uma única transação PostgreSQL:

```text
idempotency PROCESSING;

lock/controle de estoque;

reservation;

stock mutation;

response snapshot;

idempotency COMPLETED;

commit.
```

Se qualquer etapa falhar antes do commit:

```text
rollback de tudo.
```

---

### Unique constraint

Duas requests podem executar:

```text
find:
vazio;

insert:
simultâneo.
```

Sem unique constraint, ambas podem vencer.

A constraint é a proteção final.

A aplicação tenta inserir e faz `flush`.

Uma request vence.

A outra detecta a constraint, busca o registro vencedor e decide:

- replay;
- in-progress;
- payload conflict.

Não capture qualquer integrity violation como idempotência.

Identifique a constraint esperada.

---

### Lock de estoque

Idempotência impede duplicidade da mesma intenção.

Ela não impede duas ordens diferentes de reservar o mesmo estoque.

O domínio ainda precisa de:

- optimistic locking;
- pessimistic lock;
- update condicional;
- constraint adequada.

Nesta aula, o service usa lock ou update seguro na quantidade.

---

### Response armazenada

Armazene somente:

- status;
- content type;
- body allowlisted;
- resource ID;
- Location segura.

Não armazene:

- bearer token;
- cookies;
- correlation ID original;
- stack;
- headers completos;
- secrets.

No replay, a nova request recebe novo correlation ID.

---

### Status do replay

A baseline devolve o status original.

Primeira resposta:

```text
201 Created.
```

Replay:

```text
201 Created;

Idempotent-Replayed: true.
```

O mesmo `reservationId` é devolvido.

---

### Expiração

Configuração didática:

```text
retention:
24 horas.
```

A retenção deve cobrir a janela máxima de retry do client.

Se o registro for apagado cedo demais, uma repetição tardia pode criar um novo efeito.

O cleanup precisa ser:

- em batch;
- observável;
- testado;
- configurável.

---

### Retry do POST

Depois que a API é idempotente, o client pode repetir em falhas transitórias:

- connection failure;
- timeout CONNECT;
- timeout RESPONSE;
- timeout READ;
- `502`;
- `503`;
- `504`.

Não repetir:

- `400`;
- `401`;
- `403`;
- payload conflict;
- business rejection;
- contract error.

---

### Key fora do retry

A key é criada antes da cadeia de retry.

Correto:

```text
service gera key;

cria command;

retry repete command.
```

Incorreto:

```text
retry chama factory;

cada tentativa recebe nova key.
```

No Reactor, a key não deve ser criada dentro de um `Mono.defer` que será reexecutado por `retryWhen`.

---

### Circuit breaker e bulkhead

Se o circuit breaker está aberto ou o bulkhead rejeita, o provider não recebeu a request.

A mesma key pode continuar representando a mesma intenção em uma tentativa futura.

O sistema não pode marcar a reserva como concluída.

---

### Idempotência não é exactly-once universal

A idempotência protege um efeito definido dentro de um escopo e uma janela.

Ainda existem desafios:

- falha pós-commit;
- integração com outros bancos;
- evento externo;
- envio de webhook;
- outbox;
- reconciliação;
- retenção.

A aula não promete exactly-once em todo o sistema distribuído.

---

## Mão na massa guiada

### 1. Criar a policy

Arquivo:

```text
docs/IDEMPOTENCY_POLICY.md
```

| Item | Decisão |
|---|---|
| Header | Idempotency-Key |
| Scope | tenant + operation + key |
| Retention | 24h |
| Hash | SHA-256 |
| Replay status | original |
| Payload diferente | 409 |
| Processing | 409 |
| Missing key | 400 |
| Max key | 100 |
| Retry | mesma key |

---

### 2. Criar migration V5

```sql
CREATE TABLE reservation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    order_id VARCHAR(80) NOT NULL,
    product_code VARCHAR(40) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT reservation_quantity_positive
        CHECK (quantity > 0)
);

CREATE TABLE idempotency_record (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    operation_name VARCHAR(80) NOT NULL,
    idempotency_key VARCHAR(100) NOT NULL,
    request_fingerprint CHAR(64) NOT NULL,
    processing_status VARCHAR(30) NOT NULL,
    resource_id UUID,
    response_status INTEGER,
    response_content_type VARCHAR(120),
    response_body TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_idempotency_scope
        UNIQUE (
            tenant_id,
            operation_name,
            idempotency_key
        )
);

CREATE INDEX ix_idempotency_expiration
    ON idempotency_record (
        expires_at
    );
```

---

### 3. Criar IdempotencyKey

```java
public record IdempotencyKey(
        String value
) {
    private static final Pattern ALLOWED =
            Pattern.compile(
                "[A-Za-z0-9_-]{16,100}"
            );

    public IdempotencyKey {
        if (
            value == null
            || !ALLOWED.matcher(
                    value
               ).matches()
        ) {
            throw new InvalidIdempotencyKeyException();
        }
    }
}
```

---

### 4. Criar request DTO

```java
public record CreateReservationRequest(
        @NotBlank
        String orderId,

        @NotBlank
        String productCode,

        @Positive
        int quantity
) {
}
```

Tenant, status e IDs server-controlled não vêm do body.

---

### 5. Criar fingerprint

```java
@Component
public class ReservationRequestFingerprint {

    String calculate(
            TenantId tenantId,
            CreateReservationRequest request
    ) {
        String canonical =
                String.join(
                    "\n",
                    "schema:v1",
                    tenantId.value().toString(),
                    "create-reservation",
                    normalize(request.orderId()),
                    normalize(request.productCode()),
                    Integer.toString(request.quantity())
                );

        return sha256(
            canonical.getBytes(
                StandardCharsets.UTF_8
            )
        );
    }
}
```

O `normalize` não pode alterar a semântica.

---

### 6. Criar estados

```java
public enum IdempotencyProcessingStatus {
    PROCESSING,
    COMPLETED
}
```

Mantenha a baseline pequena.

---

### 7. Criar entity e repository

A entity contém:

```text
scope;

fingerprint;

status;

resourceId;

response;

timestamps;

expiration.
```

Repository:

```java
Optional<IdempotencyRecord>
findByTenantIdAndOperationNameAndIdempotencyKey(
        UUID tenantId,
        String operation,
        String key
);

long deleteByExpiresAtBefore(
        Instant threshold
);
```

---

### 8. Criar coordinator

```java
@Component
public class ReservationIdempotencyCoordinator {

    private static final String OPERATION =
            "create-reservation";

    @Transactional
    public ReservationHttpResult execute(
            TenantId tenantId,
            IdempotencyKey key,
            String fingerprint,
            Supplier<ReservationHttpResult> operation
    ) {
        Acquisition acquisition =
                acquire(
                    tenantId,
                    key,
                    fingerprint
                );

        if (acquisition instanceof Replay replay) {
            return replay.result();
        }

        ReservationHttpResult result =
                operation.get();

        complete(
            acquisition.record(),
            result
        );

        return result;
    }
}
```

A operação precisa executar dentro da transação.

---

### 9. Implementar aquisição

Passos:

1. criar `PROCESSING`;
2. salvar e fazer `flush`;
3. se sucesso, a request é owner;
4. se unique violation, buscar existente;
5. comparar fingerprint;
6. `COMPLETED` produz replay;
7. `PROCESSING` produz conflict.

Ao tratar a unique violation, limpe o persistence context quando necessário antes da nova consulta.

---

### 10. Criar ReservationHttpResult

```java
public record ReservationHttpResult(
        int status,
        String contentType,
        String responseBody,
        URI location,
        UUID reservationId,
        boolean replayed
) {
}
```

O replay cria uma nova instância com `replayed=true`, mantendo o snapshot original.

---

### 11. Criar service de reserva

Na transação:

1. validar produto;
2. bloquear ou atualizar estoque com concorrência segura;
3. validar quantidade;
4. criar reservation;
5. reduzir estoque;
6. serializar response allowlisted;
7. completar idempotency record.

Não publique evento externo dentro da transação nesta aula.

---

### 12. Criar controller

```java
@PostMapping(
    path = "/api/v1/reservations",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
ResponseEntity<String> create(
        @RequestHeader("Idempotency-Key")
        String rawKey,

        @Valid
        @RequestBody
        CreateReservationRequest request
) {
    ReservationHttpResult result =
            service.create(
                new IdempotencyKey(rawKey),
                request
            );

    return ResponseEntity
            .status(result.status())
            .contentType(
                MediaType.parseMediaType(
                    result.contentType()
                )
            )
            .location(result.location())
            .header(
                "Idempotent-Replayed",
                Boolean.toString(
                    result.replayed()
                )
            )
            .body(result.responseBody());
}
```

---

### 13. Proteger endpoint

Permission:

```text
reservation:create.
```

Valide:

- Resource Server;
- audience `catalog-api`;
- user ativo;
- tenant membership;
- permission;
- rate limit.

A key não seleciona tenant.

---

### 14. Criar errors

Problem codes:

```text
idempotency_key_required;

invalid_idempotency_key;

idempotency_key_reused_with_different_request;

idempotency_request_in_progress;

reservation_product_not_found;

reservation_quantity_unavailable.
```

Use `Cache-Control: no-store`.

---

### 15. Testar primeira execução

Esperado:

```text
201;

replayed false;

1 reservation;

1 stock mutation;

1 COMPLETED record.
```

---

### 16. Testar replay

Mesma key e payload:

```text
201;

replayed true;

mesmo body;

mesmo reservationId;

1 reservation total.
```

---

### 17. Testar payload diferente

Mesma key, quantity diferente:

```text
409;

sem nova reserva;

sem nova redução.
```

---

### 18. Testar canonicalização

Varie:

- ordem dos fields;
- whitespace;
- quebra de linha;
- formatação JSON.

O fingerprint permanece igual porque é calculado sobre o DTO canônico.

---

### 19. Testar concorrência

Use barrier para duas requests simultâneas.

Resultados aceitos:

```text
uma cria;

outra recebe in-progress
ou replay após o commit.
```

Resultado proibido:

```text
duas reservas.
```

---

### 20. Testar unique constraint

Teste de migration confirma:

```text
uq_idempotency_scope.
```

Sem a constraint, o gate falha.

---

### 21. Testar rollback

Forçe erro depois da mutação de estoque e antes da conclusão.

Esperado:

```text
reservation rollback;

stock rollback;

idempotency rollback.
```

Nova tentativa processa normalmente.

---

### 22. Testar response perdida

Execute e confirme a transação.

Simule timeout no consumer antes de receber o body.

Repita com a mesma key.

Esperado:

```text
replay;

nenhum novo efeito.
```

---

### 23. Criar cleanup

```java
@Transactional
public long deleteExpired(
        Instant now
) {
    return repository
            .deleteByExpiresAtBefore(
                now
            );
}
```

Execute em batch e registre métrica.

---

### 24. Testar retenção

Com Clock controlado:

```text
antes de 24h:
replay.

depois do cleanup:
registro ausente.
```

Documente que uma repetição depois da retenção pode não ser reconhecida.

---

### 25. Criar gateway no consumer

```java
public interface ReservationGateway {

    ReservationResult create(
            IdempotentReservationCommand command
    );
}
```

Command:

```java
public record IdempotentReservationCommand(
        IdempotencyKey key,
        OrderId orderId,
        ProductCode productCode,
        int quantity
) {
}
```

---

### 26. Gerar key uma vez

```java
IdempotentReservationCommand command =
        new IdempotentReservationCommand(
            keyFactory.create(),
            orderId,
            productCode,
            quantity
        );

return reservationGateway.create(
        command
);
```

O retry recebe o mesmo command.

---

### 27. RestClient POST

```java
restClient
    .post()
    .uri("/api/v1/reservations")
    .header(
        "Idempotency-Key",
        command.key().value()
    )
    .contentType(
        MediaType.APPLICATION_JSON
    )
    .body(toRequest(command))
    .retrieve();
```

Mantenha Authorization e correlation.

---

### 28. WebClient POST

```java
Mono.defer(
    () ->
        gateway.createOnce(
            command
        )
)
.retryWhen(
    retryPolicy
);
```

A key já existe antes do `defer`.

---

### 29. Atualizar retry policy

Retryable:

```text
connection;

timeout CONNECT;

timeout RESPONSE;

timeout READ;

502;

503;

504.
```

Não retryable:

```text
400;

401;

403;

409 payload conflict;

409 processing;

contract;

business rejection.
```

---

### 30. Validar replay no consumer

Confirme:

- reservationId;
- orderId;
- productCode;
- quantity;
- status.

O header de replay é informativo.

O body continua sendo validado.

---

### 31. Criar métricas

Provider:

```text
idempotency.first_execution;

idempotency.replay;

idempotency.payload_conflict;

idempotency.in_progress;

idempotency.rollback;

idempotency.cleanup.
```

Consumer:

```text
reservation.retry;

reservation.replay_received;

reservation.unconfirmed.
```

Não use key como tag.

---

### 32. Criar logs seguros

Registre:

```text
operation;

outcome;

key hash prefix;

tenant technical ID;

correlation ID.
```

Não logue:

- key completa;
- body;
- token;
- response armazenada.

---

### 33. Criar state machine

Arquivo:

```text
docs/IDEMPOTENCY_STATE_MACHINE.md
```

```text
NEW
 |
 | insert
 v
PROCESSING
 |
 | commit
 v
COMPLETED
```

Rollback remove o estado não confirmado.

---

### 34. Criar data model

Documente:

- scope;
- columns;
- indexes;
- constraint;
- retention;
- response allowlist;
- hash material;
- cleanup.

---

### 35. Criar concurrency document

Explique:

```text
find then insert
não basta;

unique constraint
define o vencedor.
```

Inclua o fluxo da request perdedora.

---

### 36. Criar runbook

Perguntas:

- qual operation;
- key hash;
- tenant;
- status;
- fingerprint coincide;
- reservation existe;
- estoque foi alterado;
- response existe;
- rollback ocorreu;
- cleanup removeu cedo;
- retries usaram mesma key;
- duas reservas existem;
- constraint está ativa.

---

### 37. Executar testes provider

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider

.\mvnw.cmd `
  -Dtest=IdempotencyKeyValidationTest,ReservationRequestFingerprintTest,ReservationIdempotencyCoordinatorTest,ReservationConcurrencyTest,ReservationReplayContractTest,ReservationPayloadConflictTest,ReservationProcessingConflictTest,ReservationTransactionRollbackTest,ReservationExpirationTest,IdempotencySecurityTest,IdempotencyMetricsTest `
  test
```

---

### 38. Executar RestClient tests

```powershell
Set-Location `
  ..\order-consumer

.\mvnw.cmd `
  -Dtest=RestClientReservationRetryTest,ReservationReplayContractTest,IdempotencyBoundaryPolicyTest `
  test
```

---

### 39. Executar WebClient tests

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=WebClientReservationRetryTest,ReservationReplayContractTest,IdempotencyBoundaryPolicyTest `
  test
```

---

### 40. Executar cenário manual

1. envie key A;
2. confirme `201`;
3. repita key A e mesmo body;
4. confirme replay;
5. use key A com quantity diferente;
6. confirme `409`;
7. consulte o banco;
8. confirme uma reserva e uma redução.

---

### 41. Executar gates

Nos três projetos:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- migrations;
- constraint;
- transaction;
- concurrency;
- replay;
- security;
- metrics;
- logs;
- retry;
- um único efeito.

---

### 42. Registrar limitações

Ainda faltam:

```text
consulta por key;

reconciliação pós-commit;

outbox;

eventos;

webhook delivery;

cleanup produtivo;

load test;

retenção aprovada.
```

---

## Entendendo o que foi feito

### A intenção ganhou uma identidade

A key acompanha todas as tentativas da mesma operação.

### O banco protegeu a corrida

A unique constraint impede dois owners da mesma key.

### O payload ficou ligado à key

Fingerprint diferente gera conflito.

### A response passou a ser replayable

O provider não precisa criar outra reserva.

### A transação protegeu o efeito

Reserva, estoque e idempotência confirmam ou rollbackam juntos.

### O retry da escrita ficou condicionado

Ele reutiliza a mesma key e o mesmo payload.

### RestClient e WebClient preservaram a intenção

Nenhuma tentativa interna gera nova key.

### Segurança continuou independente

Key não substitui token, permission ou tenant.

### Webhooks foram preparados

O receiver futuro também precisará deduplicar entregas.

---

## Erros comuns importantes

### Gerar nova key em cada retry

Cada tentativa vira uma nova operação.

### Armazenar somente key

Payload diferente pode recuperar resultado errado.

### Usar cache local

Réplicas não compartilham proteção.

### Fazer find then insert sem constraint

Duas requests podem vencer.

### Marcar COMPLETED cedo

Replay pode devolver sucesso sem efeito.

### Executar negócio fora da transação

Registro e reserva divergem.

### Repetir conflito permanente

O payload continuará incompatível.

### Logar key completa e body

Aumenta exposição.

### Retenção curta

Uma repetição tardia pode duplicar efeito.

### Confundir com exactly-once

Sistemas distribuídos continuam exigindo reconciliação.

---

## Comandos úteis

### Testes centrais

```powershell
.\mvnw.cmd `
  -Dtest=ReservationIdempotencyCoordinatorTest,ReservationConcurrencyTest,ReservationReplayContractTest,ReservationPayloadConflictTest `
  test
```

### Transação e retenção

```powershell
.\mvnw.cmd `
  -Dtest=ReservationTransactionRollbackTest,ReservationExpirationTest `
  test
```

### Consumers

```powershell
.\mvnw.cmd `
  -Dtest=RestClientReservationRetryTest,WebClientReservationRetryTest,IdempotencyBoundaryPolicyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar key instável

```powershell
git grep `
  -n `
  -E `
  "randomUUID\\(|Idempotency-Key|idempotencyKey|retryWhen|Retry"
```

---

## Exercício guiado

### Parte 1 — Contrato

Defina header, scope e retenção.

### Parte 2 — Fingerprint

Crie material canônico.

### Parte 3 — Banco

Crie migration e unique constraint.

### Parte 4 — Coordinator

Implemente acquire, execute, complete e replay.

### Parte 5 — Concorrência

Teste duas requests simultâneas.

### Parte 6 — Transação

Prove rollback conjunto.

### Parte 7 — Consumers

Envie a mesma key no retry.

### Parte 8 — Errors

Trate payload diferente e in-progress.

### Parte 9 — Observabilidade

Crie metrics, logs e runbook.

### Parte 10 — Gate

Comprove um único efeito.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 463 foi preservada;
- método idempotente foi diferenciado de operação idempotente;
- POST idempotente foi definido por contrato;
- endpoint de reserva foi criado;
- `Idempotency-Key` é obrigatório;
- key possui formato e tamanho limitados;
- key não contém dados pessoais;
- scope inclui tenant, operation e key;
- migration V5 foi criada;
- unique constraint foi criada;
- fingerprint usa SHA-256;
- fingerprint usa material canônico;
- correlation e token não entram no hash;
- ordem dos fields não altera o hash;
- payload diferente retorna `409`;
- PROCESSING foi modelado;
- COMPLETED foi modelado;
- concorrência não cria duas reservas;
- request in-progress retorna conflito;
- replay retorna status original;
- replay retorna body original;
- replay retorna o mesmo resource ID;
- header de replay foi criado;
- response snapshot usa allowlist;
- token e headers completos não são armazenados;
- reserva, estoque e idempotência usam uma transação;
- rollback remove efeitos parciais;
- unique violation esperada é tratada;
- outras integrity violations não viram replay;
- tenant permanece validado;
- permission `reservation:create` foi aplicada;
- key não substitui autenticação;
- retention foi configurada;
- cleanup foi criado;
- risco de expiração foi documentado;
- consumer gera key uma vez;
- retry reutiliza a mesma key;
- RestClient envia a key;
- WebClient envia a key;
- timeout após commit foi testado;
- retry de escrita só ocorre após idempotência;
- erros permanentes não recebem retry;
- replay é validado pelo consumer;
- métricas de first execution, replay e conflict foram criadas;
- logs não contêm body ou key completa;
- testes de concorrência foram executados;
- testes de rollback foram executados;
- teste de payload diferente foi executado;
- teste de field order foi executado;
- teste de response perdida foi executado;
- cache local não foi usado como storage principal;
- uma reserva e uma redução foram comprovadas;
- webhooks não foram antecipados;
- limitações foram registradas;
- produção pública permaneceu NO-GO;
- gates dos três projetos foram executados;
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
  "Idempotency-Key|idempotencyKey|randomUUID\\(|responseBody|Bearer ey|Authorization"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
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
git commit -m "feat(m16): garantir idempotencia na reserva"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- bearer token;
- client secret;
- `.env`;
- body real;
- key com dado pessoal;
- response headers completos;
- cache local como storage principal;
- retry com key nova;
- webhook antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o laboratório saiu de uma leitura segura para uma escrita repetível.

O endpoint:

```http
POST /api/v1/reservations
```

passou a exigir:

```http
Idempotency-Key: <key>
```

A key representa uma intenção do client.

O provider protege essa intenção com:

```text
tenant;

operation;

key;

fingerprint;

unique constraint;

transaction;

response snapshot;

retention.
```

Na primeira execução:

```text
reserva criada;

estoque alterado;

COMPLETED;

201.
```

No replay:

```text
mesma key;

mesmo payload;

mesma response;

nenhum novo efeito.
```

No conflito:

```text
mesma key;

payload diferente;

409;

nenhuma mutação.
```

A principal decisão foi:

```text
retry de escrita
só é seguro
quando todas as tentativas
reutilizam a mesma intenção
e o provider protege
o efeito com persistência
e concorrência.
```

Também ficou comprovado que cache local não protege múltiplas réplicas, hash de JSON bruto é frágil, unique constraint é indispensável, PROCESSING não é sucesso, COMPLETED pode ser replayado e idempotência não substitui autenticação ou reconciliação distribuída.

A próxima aula será:

```text
465 - M16.10 - Webhooks
```

Nela, você irá:

- modelar callback HTTP;
- criar emitter e receiver;
- validar assinatura;
- proteger contra replay;
- deduplicar entregas;
- responder rapidamente;
- registrar tentativas;
- tratar retry do emissor;
- aplicar idempotência no receiver;
- preparar observabilidade de entrega.

---

# Material complementar

## Checkpoint final

- [ ] Modelei uma intenção idempotente.
- [ ] Criei fingerprint e unique constraint.
- [ ] Implementei replay sem novo efeito.
- [ ] Testei concorrência, rollback e retry.
- [ ] Preparei a transição para webhooks.

---

## Troubleshooting adicional

### Duas reservas foram criadas

Confirme a unique constraint, a transação e se todas as réplicas usam o mesmo banco.

### Replay retorna body diferente

A response está sendo recalculada em vez de armazenada.

### Payload diferente recebe replay

O fingerprint não inclui todos os campos semânticos.

### Fields em outra ordem conflitam

O hash usa JSON bruto.

### Retry gera key nova

A key foi criada dentro do delegate ou do publisher repetido.

### PROCESSING fica preso

Revise rollback, crash recovery e runbook de reconciliação.

### Integrity violation vira replay

Traduza apenas a constraint esperada.

### Expiração cria duplicidade tardia

A retention está menor que a janela real de retry.

### Outro tenant recebe a response

O scope ou a consulta não inclui tenant.

### Consumer repete `409`

A retry classifier está ampla demais.

---

## Perguntas de revisão

1. O que é idempotência?
2. Mesmo efeito significa mesma execução?
3. POST pode ser idempotente?
4. Quem gera a key?
5. Key é autenticação?
6. Qual é o scope?
7. Para que serve fingerprint?
8. Pode usar JSON bruto no hash?
9. O que ocorre com payload diferente?
10. O que significa PROCESSING?
11. O que significa COMPLETED?
12. Por que unique constraint é necessária?
13. Cache local é suficiente?
14. Response pode ser armazenada?
15. Quais headers não devem ser armazenados?
16. Retry gera nova key?
17. Timeout após commit pode ser recuperado?
18. Idempotência garante exactly-once universal?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Repetir sem duplicar o efeito.
2. Não.
3. Sim, por contrato.
4. O client.
5. Não.
6. Tenant, operation e key.
7. Ligar key ao payload.
8. Não.
9. `409`.
10. Operação em andamento.
11. Resultado persistido.
12. Evitar race condition.
13. Não.
14. Sim, com allowlist.
15. Token, cookies e headers completos.
16. Não.
17. Sim, por replay.
18. Não.
19. Webhooks.
20. Callback HTTP seguro e deduplicado.

---

## Desafio opcional

Implemente:

```http
GET /api/v1/idempotency-operations/{key}
```

Restrições:

- mesmo tenant;
- permission específica;
- sem body sensível;
- estados PROCESSING e COMPLETED;
- resource link;
- retention;
- rate limit;
- proteção contra enumeração.

Não exponha fingerprint ou response armazenada diretamente.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 464 - M16.09 - Idempotencia em APIs

- Diferenciei método HTTP idempotente e operação idempotente.
- Criei `POST /api/v1/reservations`.
- Adicionei o header obrigatório `Idempotency-Key`.
- Modelei a key como valor opaco e limitado.
- Defini o scope tenant + operation + key.
- Criei a migration V5.
- Criei unique constraint para proteção concorrente.
- Modelei PROCESSING e COMPLETED.
- Criei fingerprint SHA-256 sobre material canônico.
- Excluí token, correlation e whitespace do fingerprint.
- Tratei fields JSON em ordem diferente.
- Criei `ReservationIdempotencyCoordinator`.
- Implementei aquisição da key por insert e constraint.
- Implementei replay de response.
- Tratei payload diferente com `409`.
- Tratei request em processamento.
- Armazenei somente status, content type, body e resource ID permitidos.
- Mantive token e headers completos fora do registro.
- Coloquei reserva, estoque e idempotência na mesma transação.
- Testei rollback conjunto.
- Testei concorrência com duas requests.
- Comprovei uma reserva e uma redução.
- Criei retention e cleanup.
- Criei permission `reservation:create`.
- Mantive tenant e audience.
- Criei `ReservationGateway`.
- Gerei a key uma vez por intenção.
- Reutilizei a mesma key no retry.
- Implementei POST com RestClient.
- Implementei POST com WebClient.
- Bloqueei retry de erros permanentes.
- Testei response perdida após commit.
- Recebi replay sem novo efeito.
- Criei métricas e logs seguros.
- Criei policy, state machine, data model, concurrency e runbook.
- Registrei gaps de reconciliação, outbox e cleanup produtivo.
- Não antecipei webhooks.
- Mantive produção pública como NO-GO.
- Próxima aula: Webhooks.
```

---

## Referência técnica curta

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [IETF HTTPAPI — Idempotency-Key Header](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)
- [PostgreSQL — Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL — Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Spring Framework — Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html)
- [Spring Data JPA — Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)

Regra final:

```text
idempotência em APIs de escrita deve transformar uma intenção repetida em um único efeito observável: o client cria uma key opaca uma vez e a reutiliza em todas as tentativas, o provider limita e escopa a key por tenant e operação, calcula fingerprint canônico do payload, usa unique constraint e transação para adquirir a execução, mantém PROCESSING diferente de COMPLETED, armazena uma response allowlisted para replay, rejeita a mesma key com payload diferente, protege concorrência no banco, aplica retention compatível com a janela de retry e só habilita retry de POST depois que a mesma key, o mesmo payload e o mesmo efeito estão comprovadamente preservados.
```
