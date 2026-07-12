# 460 - M16.05 - Retry com backoff

## Apresentação da aula

Na aula 459, as integrações HTTP deixaram de esperar indefinidamente.

O `RestClient` recebeu:

```text
connect timeout;

read timeout.
```

O `WebClient` recebeu:

```text
connect timeout;

response timeout;

read idle timeout;

deadline total.
```

As falhas passaram a ser classificadas como:

```text
CONNECT;

RESPONSE;

READ;

TOTAL.
```

O consumidor passou a responder com:

```text
504 Gateway Timeout
```

quando o catálogo não respondia a tempo.

Também preservamos:

```text
503 Service Unavailable
```

para indisponibilidade imediata, como connection refused.

Agora surge uma pergunta inevitável:

```text
quando uma chamada falha,
devemos tentar novamente?
```

A resposta profissional não é:

```text
sim.
```

Também não é:

```text
nunca.
```

A resposta correta depende de:

- natureza da operação;
- método HTTP;
- idempotência;
- estágio da falha;
- status retornado;
- orçamento restante;
- número de tentativas;
- capacidade do provedor;
- efeito de carga;
- presença de `Retry-After`;
- política operacional.

Nesta aula, implementaremos retry com backoff de forma criteriosa.

A pergunta central será:

```text
como repetir
somente falhas transitórias,
dentro do orçamento,
sem duplicar efeitos,
amplificar incidentes
ou esconder erros permanentes?
```

Retry não é recuperação automática garantida.

Ele é uma nova tentativa de uma operação que pode voltar a funcionar.

Pode ajudar quando existe uma falha breve:

```text
conexão recusada
durante restart;

502 temporário;

503 temporário;

504 upstream;

read timeout pontual;

response timeout pontual.
```

Pode piorar quando a falha é permanente:

```text
401;

403;

404;

JSON incompatível;

mass assignment;

product code inválido;

permission ausente;

contrato quebrado.
```

Também pode piorar uma sobrecarga.

Se mil requests falham e cada uma gera três tentativas, o provedor pode receber até três mil chamadas.

Por isso, retry será implementado com:

```text
limite de tentativas;

backoff exponencial;

jitter;

filtro de falhas;

orçamento restante;

observabilidade;

testes determinísticos.
```

No consumidor imperativo, usaremos:

```text
Resilience4j Retry.
```

No consumidor reativo, usaremos:

```text
Reactor Retry.
```

As bibliotecas serão diferentes porque os modelos de execução são diferentes.

A política de negócio, entretanto, será a mesma.

Criaremos:

```text
CatalogRetryPolicy;

CatalogRetryDecision;

CatalogRetryProperties;

CatalogRetryMetrics;

CatalogRetryEvents.
```

A política responderá:

```text
deve tentar novamente?

quantas tentativas restam?

qual espera aplicar?

o deadline permite?
```

O fluxo imperativo continuará bloqueante.

O backoff ocupará a thread durante a espera.

Isso será registrado como custo.

O fluxo reativo utilizará espera agendada pelo Reactor.

Ele não bloqueará o event loop.

Ainda assim, continuará consumindo orçamento e mantendo a operação pendente.

A aula não implementará:

```text
circuit breaker;

bulkhead;

fallback;

hedging;

fila;

cache;

idempotency key para escrita;

retry infinito.
```

O circuit breaker será a aula 461.

Bulkhead e isolamento serão a aula 462.

A operação atual é:

```http
GET /api/v1/products/{productCode}/availability
```

Ela é segura para repetição do ponto de vista do método e do contrato atual:

- não altera o catálogo;
- não cria ordem;
- não publica evento;
- não incrementa saldo;
- não possui side effect de negócio esperado.

Isso não significa que qualquer `GET` seja automaticamente livre de efeitos.

O provedor ainda pode registrar auditoria, métricas ou acesso.

Mas repetir esse `GET` não deve alterar o resultado de negócio.

A política base será:

```text
máximo:
3 tentativas totais.

tentativa inicial:
1.

retries:
até 2.

backoff inicial:
100 ms.

multiplicador:
2.

jitter:
50%.

deadline total:
herdado da aula 459.
```

Os valores são didáticos.

Produção exige métricas e capacity review.

A política repetirá apenas:

```text
ProductCatalogUnavailableException;

ProductCatalogTimeoutException
nos estágios CONNECT,
RESPONSE
ou READ;

ProductCatalogRateLimitedException
somente quando Retry-After
for compatível com o orçamento
e a policy permitir.
```

Não repetirá:

```text
ProductNotFoundException;

ProductCatalogAuthenticationException;

ProductCatalogContractException;

CatalogCredentialsUnavailableException;

ProductUnavailableForOrderException;

ProductCatalogTimeoutException TOTAL.
```

O estágio `TOTAL` não é retryable porque o orçamento já acabou.

A aula também criará um conceito central:

```text
remaining budget.
```

Se o fluxo possui 1.200 ms e a primeira tentativa consumiu 850 ms, não faz sentido esperar 400 ms e iniciar outra chamada completa.

A policy deve desistir antes.

Ao final, você deverá conseguir explicar:

```text
por que retry
não é padrão universal;

por que máximo de tentativas
inclui a inicial;

por que backoff sem jitter
sincroniza clientes;

por que retry precisa
respeitar deadline;

por que 401, 403 e 404
não devem ser repetidos;

por que retry bem implementado
ainda precisa de circuit breaker.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
458:
WebClient.

459:
Timeouts.

460:
Retry com backoff.

461:
Circuit breaker.

462:
Bulkhead e isolamento.
```

A aula 459 respondeu:

```text
quanto tempo
uma tentativa pode esperar?
```

A aula 460 responderá:

```text
quando uma nova tentativa
é permitida,
quanto esperar
e quando desistir?
```

Nesta aula:

```text
retry criterioso:
sim.

backoff exponencial:
sim.

jitter:
sim.

orçamento restante:
sim.

RestClient:
sim.

WebClient:
sim.

métricas:
sim.

testes determinísticos:
sim.

circuit breaker:
próxima aula.

bulkhead:
aula 462.
```

A regra central será:

```text
retry só é aceitável
quando a falha é transitória,
a operação é repetível
e ainda existe orçamento.
```

---

## Objetivo prático

Ao final da aula, os dois consumidores terão:

```text
CatalogRetryProperties;

CatalogRetryPolicy;

CatalogRetryDecision;

CatalogRetryReason;

CatalogRetryBudget;

CatalogRetryMetrics;

CatalogRetryEventLogger.
```

No consumidor imperativo:

```text
Resilience4jCatalogRetryConfiguration;

RetryingProductCatalogGateway.
```

No consumidor reativo:

```text
ReactiveCatalogRetryFactory;

ReactiveRetryingProductCatalogGateway.
```

Testes:

```text
CatalogRetryPropertiesTest;

CatalogRetryPolicyTest;

RestClientRetryIntegrationTest;

ReactiveRetryIntegrationTest;

ReactiveRetryVirtualTimeTest;

RetryBudgetTest;

RetryAfterPolicyTest;

RetryMetricsTest;

RetryLoggingSecurityTest;

NoRetryOnPermanentFailureTest;

RetryAmplificationPolicyTest.
```

Documentação:

```text
docs/
├── RETRY_POLICY.md
├── RETRY_FAILURE_MATRIX.md
├── RETRY_BUDGET.md
└── RETRY_RUNBOOK.md
```

Você irá:

1. definir tentativas;
2. definir falhas transitórias;
3. definir falhas permanentes;
4. modelar properties;
5. calcular backoff;
6. adicionar jitter;
7. modelar budget;
8. implementar policy;
9. configurar retry imperativo;
10. configurar retry reativo;
11. preservar timeout;
12. respeitar `Retry-After`;
13. evitar retry de `4xx`;
14. criar métricas;
15. criar logs seguros;
16. criar servidor flaky;
17. testar tentativas;
18. testar budget;
19. testar amplificação;
20. preparar circuit breaker.

---

## Conceito essencial

### Tentativa inicial conta

Quando definimos:

```text
maxAttempts:
3.
```

isso normalmente significa:

```text
tentativa 1:
original.

tentativa 2:
primeiro retry.

tentativa 3:
segundo retry.
```

Não significa três retries além da original.

A documentação e as métricas precisam usar a mesma definição.

---

### Falha transitória

Falha transitória é uma condição que pode desaparecer sem mudança no request.

Exemplos:

```text
restart do provider;

502 temporário;

503 temporário;

504 temporário;

conexão encerrada;

timeout pontual.
```

Mesmo uma falha transitória não deve ser repetida sem limite.

---

### Falha permanente

Falha permanente exige mudança no request, credencial, contrato ou código.

Exemplos:

```text
400 invalid request;

401 token inválido;

403 permission ausente;

404 produto inexistente;

JSON incompatível;

code mismatch;

campo obrigatório ausente.
```

Repetir a mesma request não resolve.

---

### Idempotência

Uma operação idempotente produz o mesmo efeito quando repetida com os mesmos parâmetros.

`GET` é definido como método seguro e idempotente na semântica HTTP.

Nosso endpoint apenas consulta.

Por isso, é candidato ao retry.

Para um `POST` que cria ordem:

```text
não aplicar retry
sem estratégia de idempotência.
```

Pode ser necessária:

- idempotency key;
- unique constraint;
- deduplication;
- state machine;
- replay detection.

Esses controles serão aprofundados futuramente.

---

### Timeout stage

Policy:

```text
CONNECT:
retryable.

RESPONSE:
retryable.

READ:
retryable com cautela.

TOTAL:
não retryable.
```

O read timeout pode ocorrer depois de o provider começar a enviar resposta.

Para `GET`, ainda é aceitável repetir conforme o contrato.

Para escrita, isso seria mais perigoso porque o provider pode ter processado.

---

### Status retryable

Baseline:

```text
502:
retryable.

503:
retryable.

504:
retryable.

429:
condicional.

500:
não automaticamente.
```

Por que não repetir qualquer `500`?

Porque pode representar:

- bug determinístico;
- input que dispara falha;
- invariant quebrada;
- estado inválido;
- defeito permanente.

A política pode incluir `500` somente com evidência do provider.

Nesta aula, não inclui.

---

### 429 e Retry-After

`429` informa limitação.

Se houver:

```http
Retry-After: 2
```

a policy pode aguardar dois segundos.

Mas apenas se:

- o caller ainda tem orçamento;
- o valor está dentro do máximo permitido;
- a operação é repetível;
- a policy habilita retry de rate limit.

No laboratório:

```text
maxRetryAfter:
500 ms.
```

Valores maiores encerram a operação.

Não ignore `Retry-After` para usar um backoff menor.

---

### Backoff

Sem backoff:

```text
falhou;

tenta imediatamente;

falhou;

tenta imediatamente.
```

Isso pressiona o provider durante a falha.

Backoff adiciona espera entre tentativas.

Exemplo:

```text
100 ms;

200 ms;

400 ms.
```

Como temos apenas dois retries:

```text
100 ms;

200 ms.
```

antes do jitter.

---

### Backoff exponencial

Fórmula conceitual:

```text
delay =
initialDelay
*
multiplier^(retryIndex - 1).
```

Para:

```text
initial:
100 ms;

multiplier:
2.
```

Temos:

```text
retry 1:
100 ms.

retry 2:
200 ms.
```

---

### Jitter

Se centenas de instâncias falham ao mesmo tempo e usam o mesmo backoff, elas voltam juntas.

Isso cria:

```text
thundering herd.
```

Jitter varia a espera.

Com jitter de 50%, o atraso de 100 ms pode ficar em faixa aproximada:

```text
50 a 150 ms.
```

A implementação precisa ser testável.

Injete uma fonte aleatória ou uma estratégia de jitter.

Não use `Math.random()` escondido na policy.

---

### Budget

Crie:

```java
public interface CatalogRetryBudget {

    Duration remaining();
}
```

O budget usa:

- clock monotônico;
- deadline local;
- duração já consumida.

Não use `Instant.now()` para medir duração quando `System.nanoTime()` ou abstração monotônica estiver disponível.

Wall clock pode mudar.

---

### Deve caber a próxima tentativa

A policy não verifica apenas o delay.

Ela considera:

```text
delay;

minimumAttemptBudget;

margem de resposta.
```

Exemplo:

```text
remaining:
250 ms.

delay:
100 ms.

minimumAttempt:
300 ms.
```

Não existe espaço.

A operação termina.

---

### Retry e total timeout

No fluxo reativo, o total timeout precisa envolver a cadeia com retries.

Ordem:

```text
defer original;

retryWhen;

timeout total.
```

Se o `.timeout()` estiver dentro de cada tentativa, cada retry pode ganhar um novo orçamento completo.

Isso viola a política.

A barreira total fica fora.

---

### Retry síncrono

No modelo imperativo, o retry executor chama o delegate novamente.

Durante backoff, a thread espera.

Esse custo precisa ser considerado em:

- thread pool;
- concorrência;
- capacity;
- bulkhead futuro.

---

### Retry reativo

No Reactor, `retryWhen` re-subscreve ao publisher original.

Por isso, a chamada precisa ser criada com:

```text
Mono.defer.
```

Caso contrário, parte do trabalho pode ser executada apenas uma vez fora da subscription.

Token e correlation precisam ser avaliados conscientemente.

A policy desta aula:

```text
correlation ID:
mesmo para toda a operação.

access token:
obtido novamente por tentativa
se o provider suportar refresh futuro.
```

---

### Correlation e attempt

Use o mesmo correlation ID para todas as tentativas do mesmo fluxo.

Adicione um header técnico opcional:

```text
X-Retry-Attempt:
1, 2, 3.
```

Somente em rede confiável e com contrato interno.

Nesta aula, registraremos attempt em log e métrica.

Não o usaremos como autenticação.

---

### Observabilidade

Métricas:

```text
catalog.retry.attempts;

catalog.retry.exhausted;

catalog.retry.skipped.
```

Tags permitidas:

```text
client.type;

failure.kind;

decision;

attempt;
```

Evite `attempt` como cardinalidade aberta.

Como máximo é três, é controlado.

---

### Log seguro

Evento:

```text
event=catalog_retry_scheduled;

attempt=2;

delay_ms=137;

failure_kind=timeout_response;

client=webclient;

correlation_id=corr-460-001.
```

Não logue:

- token;
- body;
- product code se classificado;
- URL completa;
- exception message.

---

### Retry exhausted

Quando as tentativas acabam, preserve a última causa classificada.

Não transforme tudo em:

```text
RetryExhaustedException.
```

O caller precisa continuar recebendo:

```text
ProductCatalogUnavailableException;

ProductCatalogTimeoutException;

ProductCatalogRateLimitedException.
```

A informação de exhaustion fica em metric e log.

---

### Retry storm

Retry storm ocorre quando clientes ampliam a carga durante uma falha.

Mitigações:

- baixo número de tentativas;
- backoff;
- jitter;
- budget;
- `Retry-After`;
- circuit breaker;
- bulkhead;
- rate limit;
- capacity.

A aula 461 adicionará circuit breaker.

---

## Mão na massa guiada

### 1. Criar RETRY_POLICY.md

Arquivo:

```text
docs/RETRY_POLICY.md
```

Registre:

| Item | Valor didático |
|---|---|
| max attempts | 3 |
| retries | 2 |
| initial backoff | 100 ms |
| multiplier | 2 |
| jitter | 50% |
| max Retry-After | 500 ms |
| minimum attempt budget | 300 ms |

---

### 2. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.catalog.retry"
)
public record CatalogRetryProperties(
        int maxAttempts,
        Duration initialBackoff,
        double multiplier,
        double jitterFactor,
        Duration maxRetryAfter,
        Duration minimumAttemptBudget
) {
    public CatalogRetryProperties {
        if (
            maxAttempts < 1
            || maxAttempts > 5
        ) {
            throw new IllegalArgumentException(
                "maxAttempts must be between 1 and 5"
            );
        }

        if (
            initialBackoff.isNegative()
            || initialBackoff.isZero()
        ) {
            throw new IllegalArgumentException(
                "initialBackoff must be positive"
            );
        }

        if (multiplier < 1.0) {
            throw new IllegalArgumentException(
                "multiplier must be at least 1"
            );
        }

        if (
            jitterFactor < 0.0
            || jitterFactor > 1.0
        ) {
            throw new IllegalArgumentException(
                "jitterFactor must be between 0 and 1"
            );
        }
    }
}
```

---

### 3. Configurar profile local

```yaml
integrations:
  catalog:
    retry:
      max-attempts: 3
      initial-backoff: 100ms
      multiplier: 2
      jitter-factor: 0.5
      max-retry-after: 500ms
      minimum-attempt-budget: 300ms
```

Marque como valores didáticos.

---

### 4. Criar reasons

```java
public enum CatalogRetryReason {
    CONNECTION_UNAVAILABLE,
    TIMEOUT_CONNECT,
    TIMEOUT_RESPONSE,
    TIMEOUT_READ,
    UPSTREAM_502,
    UPSTREAM_503,
    UPSTREAM_504,
    RATE_LIMITED
}
```

Não crie reason para failures permanentes.

---

### 5. Criar decision

```java
public record CatalogRetryDecision(
        boolean retry,
        CatalogRetryReason reason,
        Duration delay
) {
    public static CatalogRetryDecision stop() {
        return new CatalogRetryDecision(
                false,
                null,
                Duration.ZERO
        );
    }
}
```

---

### 6. Criar jitter strategy

```java
public interface JitterStrategy {

    Duration apply(
            Duration base,
            double factor
    );
}
```

Implementação produtiva usa `ThreadLocalRandom`.

Teste usa determinística.

---

### 7. Criar budget

```java
public final class MonotonicCatalogRetryBudget
        implements CatalogRetryBudget {

    private final long deadlineNanos;

    public MonotonicCatalogRetryBudget(
            Duration total
    ) {
        this.deadlineNanos =
                System.nanoTime()
                + total.toNanos();
    }

    @Override
    public Duration remaining() {
        long nanos =
                deadlineNanos
                - System.nanoTime();

        return nanos <= 0
                ? Duration.ZERO
                : Duration.ofNanos(
                    nanos
                );
    }
}
```

Para testes, injete `Ticker`.

---

### 8. Criar policy

```java
@Component
public class CatalogRetryPolicy {

    private final CatalogRetryProperties properties;
    private final JitterStrategy jitter;

    public CatalogRetryDecision decide(
            Throwable failure,
            int completedAttempts,
            CatalogRetryBudget budget
    ) {
        if (
            completedAttempts
            >= properties.maxAttempts()
        ) {
            return CatalogRetryDecision.stop();
        }

        Optional<CatalogRetryReason> reason =
                classify(
                    failure
                );

        if (reason.isEmpty()) {
            return CatalogRetryDecision.stop();
        }

        Duration delay =
                delayFor(
                    failure,
                    completedAttempts
                );

        Duration required =
                delay.plus(
                    properties.minimumAttemptBudget()
                );

        if (
            budget.remaining()
                  .compareTo(
                      required
                  ) < 0
        ) {
            return CatalogRetryDecision.stop();
        }

        return new CatalogRetryDecision(
                true,
                reason.get(),
                delay
        );
    }
}
```

---

### 9. Classificar failures

```text
ProductCatalogUnavailableException:
retryable quando origem transitória.

ProductCatalogTimeoutException CONNECT:
retryable.

RESPONSE:
retryable.

READ:
retryable.

TOTAL:
não.

ProductCatalogRateLimitedException:
condicional.

ProductNotFoundException:
não.

ProductCatalogAuthenticationException:
não.

ProductCatalogContractException:
não.
```

A exception de indisponibilidade pode receber um reason interno para diferenciar `502`, `503`, `504` e connection failure.

---

### 10. Aplicar Retry-After

Se exception contém:

```text
retryAfter:
300 ms.
```

Use esse delay em vez do backoff calculado.

Se:

```text
retryAfter:
2 segundos.
```

e o máximo é 500 ms:

```text
não retry.
```

Não reduza unilateralmente o valor do provider.

---

### 11. Configurar Resilience4j

Adicione a dependency aprovada para retry.

Crie configuração programática para manter a policy visível.

Use `Retry` com:

- max attempts;
- interval function baseada na policy;
- exception predicate.

Evite configuração genérica aplicada a todos os clients.

---

### 12. Criar decorator imperativo

```java
@Component
public class RetryingProductCatalogGateway
        implements ProductCatalogGateway {

    private final ProductCatalogGateway delegate;
    private final CatalogRetryPolicy policy;
    private final CatalogRetryMetrics metrics;
    private final Sleeper sleeper;
    private final CatalogTotalBudgetFactory budgetFactory;

    @Override
    public ProductAvailabilitySnapshot findAvailability(
            ProductCode productCode
    ) {
        CatalogRetryBudget budget =
                budgetFactory.create();

        int attempt = 1;

        while (true) {
            try {
                metrics.recordAttempt(
                    "restclient",
                    attempt
                );

                return delegate.findAvailability(
                        productCode
                );
            }
            catch (
                ProductCatalogException failure
            ) {
                CatalogRetryDecision decision =
                        policy.decide(
                            failure,
                            attempt,
                            budget
                        );

                if (!decision.retry()) {
                    metrics.recordExhausted(
                        "restclient",
                        failure
                    );

                    throw failure;
                }

                metrics.recordScheduled(
                    "restclient",
                    attempt + 1,
                    decision
                );

                sleeper.sleep(
                    decision.delay()
                );

                attempt++;
            }
        }
    }
}
```

Você pode encapsular essa lógica no Resilience4j.

O exemplo explicita a semântica.

---

### 13. Criar Sleeper

```java
public interface Sleeper {

    void sleep(
            Duration duration
    );
}
```

Produção:

```text
Thread.sleep.
```

Teste:

```text
registra durations,
não espera.
```

O bloqueio do modelo imperativo é explícito.

---

### 14. Evitar double retry

Apenas uma camada aplica retry.

Não configure:

- gateway;
- RestClient interceptor;
- service;
- controller;

ao mesmo tempo.

Crie policy test para detectar múltiplos decorators.

---

### 15. Criar publisher original reativo

```java
private Mono<ProductAvailabilitySnapshot> callOnce(
        ProductCode productCode,
        String correlationId,
        int attempt
) {
    return Mono.defer(
        () ->
            delegate.findAvailability(
                productCode,
                correlationId,
                attempt
            )
    );
}
```

O publisher precisa ser recriado por tentativa.

---

### 16. Criar Retry reativo

```java
@Component
public class ReactiveCatalogRetryFactory {

    public Retry create(
            CatalogRetryBudget budget,
            String correlationId
    ) {
        return Retry
                .from(
                    companion ->
                        companion.concatMap(
                            signal -> {
                                int completedAttempts =
                                        Math.toIntExact(
                                            signal.totalRetries()
                                            + 1
                                        );

                                Throwable failure =
                                        signal.failure();

                                CatalogRetryDecision decision =
                                        policy.decide(
                                            failure,
                                            completedAttempts,
                                            budget
                                        );

                                if (!decision.retry()) {
                                    return Mono.error(
                                        failure
                                    );
                                }

                                metrics.recordScheduled(
                                    "webclient",
                                    completedAttempts + 1,
                                    decision
                                );

                                return Mono.delay(
                                    decision.delay()
                                );
                            }
                        )
                );
    }
}
```

O delay é não bloqueante.

---

### 17. Aplicar no gateway reativo

```java
public Mono<ProductAvailabilitySnapshot> findAvailability(
        ProductCode productCode
) {
    return correlationProvider
            .currentOrCreate()
            .flatMap(
                correlationId -> {
                    CatalogRetryBudget budget =
                            budgetFactory.create();

                    return Mono.defer(
                                () ->
                                    delegate
                                        .findAvailability(
                                            productCode
                                        )
                            )
                            .retryWhen(
                                retryFactory.create(
                                    budget,
                                    correlationId
                                )
                            )
                            .timeout(
                                timeoutProperties.total()
                            );
                }
            );
}
```

A barreira total fica fora dos retries.

---

### 18. Preservar correlation

O mesmo correlation ID é criado uma vez antes do retry.

Cada tentativa recebe o mesmo valor.

A métrica registra attempt.

Não crie correlation nova a cada subscription interna.

---

### 19. Obter token por tentativa

O delegate reativo obtém token dentro de `Mono.defer`.

Assim, uma implementação futura poderá renovar credencial.

Se a primeira falha for `401`:

```text
não retry.
```

Refresh de Client Credentials será uma policy separada.

---

### 20. Criar FlakyCatalogStubServer

Comportamento configurável:

```text
primeiras N requests:
503.

depois:
200.
```

O server registra count.

Não use estado compartilhado entre testes sem reset.

---

### 21. Testar sucesso na segunda tentativa

Configuração:

```text
primeira:
503.

segunda:
200.
```

Esperado:

```text
2 requests;

1 retry;

snapshot retornado.
```

---

### 22. Testar exhaustion

Stub sempre retorna `503`.

Esperado:

```text
3 requests;

2 retries;

última ProductCatalogUnavailableException.
```

---

### 23. Testar 404 sem retry

Esperado:

```text
1 request;

ProductNotFoundException.
```

---

### 24. Testar 401 sem retry

Esperado:

```text
1 request;

ProductCatalogAuthenticationException.
```

---

### 25. Testar contract error sem retry

Response `200` com JSON inválido.

Esperado:

```text
1 request;

ProductCatalogContractException.
```

---

### 26. Testar timeout retryable

Primeira response demora acima do response timeout.

Segunda responde rápido.

Esperado:

```text
2 requests;

sucesso.
```

O total timeout precisa comportar as duas tentativas.

---

### 27. Testar TOTAL sem retry

Use pipeline que consome todo o deadline.

Esperado:

```text
ProductCatalogTimeoutException TOTAL;

zero nova tentativa.
```

---

### 28. Testar budget insuficiente

Remaining:

```text
250 ms.
```

Delay:

```text
100 ms.
```

Minimum attempt:

```text
300 ms.
```

Esperado:

```text
stop.
```

---

### 29. Testar jitter determinístico

Strategy retorna:

```text
base - 25%.
```

Valide delays:

```text
75 ms;

150 ms.
```

Não valide aleatoriedade em teste unitário.

---

### 30. Testar Retry-After aceitável

`429` com:

```text
Retry-After:
0.
```

ou header date controlada conforme contrato.

Use valor dentro do máximo.

O server retorna sucesso depois.

---

### 31. Testar Retry-After excessivo

`Retry-After: 5`.

Com máximo de 500 ms:

```text
1 request;

ProductCatalogRateLimitedException.
```

---

### 32. Testar ausência de Retry-After

A policy desta aula:

```text
não retry 429
sem Retry-After.
```

Essa decisão evita adivinhar.

---

### 33. Testar reactive retry com virtual time

Use:

```java
StepVerifier.withVirtualTime(
    () ->
        flakyPublisher
            .retryWhen(
                retry
            )
)
```

Avance:

```text
100 ms;

200 ms.
```

Valide tentativas sem esperar.

---

### 34. Testar imperativo sem sleep real

Use `RecordingSleeper`.

Valide:

```text
100 ms;

200 ms.
```

O integration test pode manter delays pequenos.

---

### 35. Testar logs

Sentinelas:

```text
token-retry-sentinel;

body-retry-sentinel;

product-retry-sentinel.
```

Nenhuma aparece.

Logs mostram:

- attempt;
- delay;
- reason;
- client;
- correlation.

---

### 36. Testar métricas

Confirme:

```text
attempt total;

retry scheduled;

retry exhausted;

retry skipped.
```

Tags sem product code ou exception message.

---

### 37. Criar amplification policy test

Calcule limite teórico:

```text
incomingRequests
*
maxAttempts.
```

Documente:

```text
1.000 requests
*
3
=
3.000 chamadas máximas.
```

A policy falha se `maxAttempts` ultrapassar cinco no laboratório.

---

### 38. Criar NoRetryOnPermanentFailureTest

Tabela:

| Falha | Tentativas |
|---|---:|
| 400 | 1 |
| 401 | 1 |
| 403 | 1 |
| 404 | 1 |
| contract | 1 |
| TOTAL timeout | 1 |
| missing credentials | 1 |

---

### 39. Criar RETRY_FAILURE_MATRIX.md

| Falha | Retry |
|---|---|
| connection unavailable | sim |
| timeout CONNECT | sim |
| timeout RESPONSE | sim |
| timeout READ | sim |
| timeout TOTAL | não |
| 502 | sim |
| 503 | sim |
| 504 | sim |
| 500 | não |
| 429 com Retry-After permitido | sim |
| 429 sem Retry-After | não |
| 401/403/404 | não |
| contract | não |

---

### 40. Criar RETRY_RUNBOOK.md

Perguntas:

- quantas tentativas ocorreram;
- qual failure kind;
- qual delay;
- provider recebeu todas;
- `Retry-After` existia;
- budget foi esgotado;
- houve aumento de `503`;
- retries ampliaram carga;
- circuit breaker ainda está fechado;
- deploy recente alterou max attempts;
- p99 mudou.

---

### 41. Executar testes imperativos

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=CatalogRetryPropertiesTest,CatalogRetryPolicyTest,RetryBudgetTest,RestClientRetryIntegrationTest,RetryAfterPolicyTest,RetryMetricsTest,RetryLoggingSecurityTest,NoRetryOnPermanentFailureTest `
  test
```

---

### 42. Executar testes reativos

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=CatalogRetryPropertiesTest,CatalogRetryPolicyTest,RetryBudgetTest,ReactiveRetryIntegrationTest,ReactiveRetryVirtualTimeTest,RetryAfterPolicyTest,RetryMetricsTest,RetryLoggingSecurityTest,NoRetryOnPermanentFailureTest `
  test
```

---

### 43. Executar fluxo local

Configure provider para falhar uma vez com `503`.

Execute consumer.

Confirme:

```text
primeira tentativa:
503.

backoff:

segunda tentativa:
200.

response final:
sucesso.
```

---

### 44. Executar exhaustion

Provider sempre `503`.

Confirme:

```text
3 tentativas;

falha final;

sem loop infinito;

métrica exhausted.
```

---

### 45. Executar gates

Em cada consumer:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- max attempts;
- backoff;
- jitter;
- budget;
- Retry-After;
- no permanent retry;
- no double retry;
- logs;
- metrics;
- timeout preservado;
- nenhum circuit breaker antecipado.

---

### 46. Atualizar documentação

Nos documentos dos clients, registre:

```text
retry:
implementado.

circuit breaker:
ainda ausente.

bulkhead:
ainda ausente.
```

---

### 47. Registrar limitações

Ainda faltam:

```text
circuit breaker;

bulkhead;

pool isolation;

production tuning;

distributed deadline;

idempotency key para writes;

load test;

coordenação com provider.
```

---

## Entendendo o que foi feito

### Retry ganhou uma policy

A decisão deixou de ser um `.retry(3)` genérico.

### Falhas foram classificadas

Transitórias e permanentes receberam comportamentos diferentes.

### O budget foi preservado

Uma nova tentativa só começa quando existe tempo suficiente.

### Backoff reduziu pressão

As chamadas não são repetidas imediatamente.

### Jitter evitou sincronização

Instâncias não voltam todas no mesmo instante.

### Retry-After foi respeitado

O consumidor não substituiu a orientação do provider por um atraso menor.

### Modelos permaneceram coerentes

RestClient bloqueia durante o backoff; WebClient agenda sem bloquear.

### A última causa foi preservada

O caller não recebeu uma exception genérica de exhaustion.

### A próxima lacuna ficou visível

Mesmo com backoff, muitas requests podem continuar pressionando um provider doente.

---

## Erros comuns importantes

### Usar retry em qualquer exception

Erros permanentes geram tráfego inútil.

### Configurar três retries achando que são três tentativas

O total vira quatro.

### Não usar jitter

Instâncias sincronizam.

### Reiniciar o deadline por tentativa

O caller espera mais do que o contrato permite.

### Repetir 401

Token inválido não melhora com espera.

### Repetir 404

Produto inexistente não aparece por insistência.

### Repetir contract error

O mesmo JSON quebrado continuará quebrado.

### Ignorar Retry-After

O cliente viola a sinalização do provider.

### Configurar retry em várias camadas

Tentativas se multiplicam.

### Considerar retry substituto de circuit breaker

O provider doente continua recebendo chamadas.

---

## Comandos úteis

### Testes de policy

```powershell
.\mvnw.cmd `
  -Dtest=CatalogRetryPropertiesTest,CatalogRetryPolicyTest,RetryBudgetTest,RetryAfterPolicyTest `
  test
```

### Retry imperativo

```powershell
.\mvnw.cmd `
  -Dtest=RestClientRetryIntegrationTest,RetryMetricsTest,RetryLoggingSecurityTest `
  test
```

### Retry reativo

```powershell
.\mvnw.cmd `
  -Dtest=ReactiveRetryIntegrationTest,ReactiveRetryVirtualTimeTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar retry duplicado

```powershell
git grep `
  -n `
  -E `
  "\\.retry\\(|\\.retryWhen\\(|@Retry|Retry\\.of|RetryRegistry"
```

---

## Exercício guiado

### Parte 1 — Classificação

Separe failures transitórias e permanentes.

### Parte 2 — Idempotência

Justifique retry do GET e bloqueie escrita.

### Parte 3 — Properties

Defina tentativas, backoff, jitter e budget.

### Parte 4 — Policy

Crie a decisão central.

### Parte 5 — RestClient

Implemente retry sem sleep em teste.

### Parte 6 — WebClient

Implemente retryWhen com virtual time.

### Parte 7 — Retry-After

Respeite valores compatíveis.

### Parte 8 — Observabilidade

Crie metrics e logs seguros.

### Parte 9 — Amplificação

Calcule o pior caso.

### Parte 10 — Gate

Comprove ausência de retry permanente e duplicado.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 459 foi preservada;
- retry foi tratado como policy;
- tentativas totais incluem a inicial;
- operação GET foi justificada como repetível;
- escrita não recebeu retry sem idempotência;
- failures transitórias foram listadas;
- failures permanentes foram listadas;
- `500` não foi automaticamente repetido;
- `502`, `503` e `504` foram tratados;
- `401`, `403` e `404` não receberam retry;
- contract errors não receberam retry;
- timeout TOTAL não recebeu retry;
- timeouts CONNECT, RESPONSE e READ foram avaliados;
- properties validam max attempts;
- backoff inicial foi configurado;
- multiplicador foi configurado;
- jitter foi configurado;
- fonte de jitter é testável;
- budget monotônico foi criado;
- próxima tentativa exige budget mínimo;
- deadline total envolve todas as tentativas;
- `Retry-After` foi respeitado;
- `429` sem Retry-After não recebeu retry;
- Resilience4j foi usado no modelo imperativo;
- Reactor Retry foi usado no modelo reativo;
- backoff imperativo não foi escondido;
- backoff reativo não bloqueia;
- publisher foi recriado com defer;
- correlation ID foi preservado;
- token pode ser reavaliado por tentativa;
- nenhuma retry layer duplicada foi criada;
- última exception classificada foi preservada;
- metrics de attempts, scheduled, exhausted e skipped foram criadas;
- logs não contêm token ou body;
- servidor flaky foi criado;
- sucesso após falha transitória foi testado;
- exhaustion foi testado;
- failures permanentes tiveram uma tentativa;
- budget insuficiente foi testado;
- jitter determinístico foi testado;
- virtual time foi usado no retry reativo;
- amplification policy foi criada;
- circuit breaker não foi antecipado;
- bulkhead não foi antecipado;
- limitações foram registradas;
- produção pública permaneceu NO-GO;
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
  "\\.retry\\(|\\.retryWhen\\(|@Retry|Retry\\.of|RetryRegistry|Bearer ey|CATALOG_SERVICE_TOKEN:"
```

Revise cada ocorrência de retry e confirme que pertence à camada aprovada.

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
git commit -m "feat(m16): aplicar retry com backoff e jitter"
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
- retry infinito;
- retry de `4xx`;
- circuit breaker antecipado;
- bulkhead;
- valor produtivo inventado;
- teste com sleep longo;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as integrações passaram a repetir somente falhas transitórias e somente quando ainda havia orçamento.

A policy consolidou:

```text
failure kind;

idempotência;

attempt count;

backoff;

jitter;

Retry-After;

remaining budget.
```

O consumidor imperativo passou a usar:

```text
Resilience4j Retry;

Sleeper controlado;

thread bloqueada
durante backoff.
```

O consumidor reativo passou a usar:

```text
Reactor Retry;

Mono.delay;

virtual time;

sem block.
```

A principal decisão foi:

```text
retry não é
uma reação automática
a qualquer erro;

é uma política limitada
para falhas transitórias
em operações repetíveis.
```

Também ficou comprovado:

```text
401, 403 e 404
não melhoram com espera;

contract error
não melhora com repetição;

TOTAL timeout
não possui budget;

backoff sem jitter
sincroniza clientes;

retry duplicado
multiplica tentativas.
```

As integrações agora possuem:

- timeout;
- deadline;
- retry;
- backoff;
- jitter;
- métricas;
- logs;
- testes.

Ainda existe uma fragilidade.

Mesmo com três tentativas e backoff, um provedor persistentemente indisponível continuará recebendo tentativas de todas as requests novas.

A próxima aula será:

```text
461 - M16.06 - Circuit breaker
```

Nela, você irá:

- modelar estados CLOSED, OPEN e HALF_OPEN;
- definir failure rate;
- definir sliding window;
- impedir chamadas durante falha persistente;
- testar transições;
- integrar RestClient e WebClient;
- combinar circuit breaker com retry na ordem correta;
- criar métricas e health indicators;
- evitar circuit breaker global para providers diferentes;
- preparar isolamento com bulkhead.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei failures antes de repetir.
- [ ] Implementei backoff e jitter.
- [ ] Preservei o budget total.
- [ ] Testei retry e exhaustion.
- [ ] Mantive circuit breaker para a próxima aula.

---

## Troubleshooting adicional

### O client faz quatro chamadas com maxAttempts três

A tentativa inicial está sendo somada incorretamente.

### O retry reativo acontece sem delay

Confirme o publisher retornado pelo companion e o virtual time.

### O RestClient dorme nos testes

Substitua o `Sleeper` por implementação de gravação.

### 404 está sendo repetido

A exception predicate ou classifier está amplo demais.

### TOTAL timeout está sendo repetido

A stage não foi preservada ou a policy está olhando apenas a classe base.

### Retry-After de cinco segundos foi ignorado

A policy não deve usar um atraso menor que o solicitado.

### O budget reinicia

A factory está sendo chamada dentro de cada tentativa.

### O token não é reavaliado

A chamada foi criada fora de `defer`.

### A quantidade de calls explode

Procure retry em gateway, service e client ao mesmo tempo.

### O provider continua sobrecarregado

Essa é a lacuna tratada pelo circuit breaker na próxima aula.

---

## Perguntas de revisão

1. A tentativa inicial conta?
2. O que é falha transitória?
3. O que é falha permanente?
4. GET é candidato a retry?
5. POST pode receber retry sem idempotência?
6. 401 deve ser repetido?
7. 404 deve ser repetido?
8. Contract error deve ser repetido?
9. O que faz backoff?
10. Por que usar jitter?
11. O que é thundering herd?
12. O que é remaining budget?
13. TOTAL timeout recebe retry?
14. O que fazer com Retry-After?
15. 500 é sempre retryable?
16. Pode configurar retry em duas camadas?
17. Qual exception fica ao final?
18. Retry substitui circuit breaker?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Sim.
2. Pode desaparecer sem mudar request.
3. Exige mudança de request, credencial ou código.
4. Sim, conforme contrato.
5. Não.
6. Não.
7. Não.
8. Não.
9. Espaça tentativas.
10. Evitar sincronização.
11. Clientes voltando juntos.
12. Tempo ainda disponível.
13. Não.
14. Respeitar se couber na policy.
15. Não.
16. Não.
17. A última causa classificada.
18. Não.
19. Circuit breaker.
20. Estados e bloqueio de falha persistente.

---

## Desafio opcional

Modele retry seguro para um `POST` de reserva.

Exija:

- idempotency key;
- unique constraint;
- response replay;
- status query;
- timeout;
- budget;
- duplicate detection;
- audit;
- teste concorrente.

Não aplique ao projeto principal sem uma aula específica de idempotência.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 460 - M16.05 - Retry com backoff

- Implementei retry criterioso nas integrações do catálogo.
- Entendi que a tentativa inicial conta no total.
- Diferenciei falhas transitórias e permanentes.
- Justifiquei retry do GET por sua semântica.
- Bloqueei retry de escrita sem idempotência.
- Criei `CatalogRetryProperties`.
- Configurei máximo de tentativas.
- Configurei backoff exponencial.
- Configurei jitter.
- Criei estratégia de jitter testável.
- Criei `CatalogRetryBudget`.
- Usei medição monotônica.
- Exigi orçamento para delay e próxima tentativa.
- Criei `CatalogRetryPolicy`.
- Criei `CatalogRetryDecision`.
- Criei reasons fechados.
- Permiti retry de connection unavailable.
- Permiti retry de timeouts CONNECT, RESPONSE e READ.
- Bloqueei retry de timeout TOTAL.
- Permiti retry de `502`, `503` e `504`.
- Mantive `500` fora da policy base.
- Bloqueei retry de `401`, `403` e `404`.
- Bloqueei retry de contract errors.
- Respeitei `Retry-After`.
- Bloqueei `429` sem Retry-After.
- Usei Resilience4j no consumidor imperativo.
- Mantive o custo bloqueante do backoff explícito.
- Usei Reactor Retry no consumidor reativo.
- Usei `Mono.delay` sem bloquear.
- Mantive o total timeout fora das tentativas.
- Preservei correlation ID.
- Reavaliei token por tentativa.
- Impedi double retry.
- Preservei a última exception classificada.
- Criei métricas de attempts, scheduled, exhausted e skipped.
- Criei logs sem token ou body.
- Criei `FlakyCatalogStubServer`.
- Testei sucesso após falha transitória.
- Testei exhaustion.
- Testei failures permanentes com uma tentativa.
- Testei budget insuficiente.
- Testei jitter determinístico.
- Testei Retry-After permitido e excessivo.
- Usei virtual time no retry reativo.
- Criei policy de amplificação.
- Criei `RETRY_POLICY.md`.
- Criei `RETRY_FAILURE_MATRIX.md`.
- Criei `RETRY_BUDGET.md`.
- Criei `RETRY_RUNBOOK.md`.
- Não antecipei circuit breaker ou bulkhead.
- Mantive produção pública como NO-GO.
- Próxima aula: Circuit breaker.
```

---

## Referência técnica curta

- [Resilience4j Retry](https://resilience4j.readme.io/docs/retry)
- [Project Reactor — Retry](https://projectreactor.io/docs/core/release/reference/coreFeatures/error-handling.html#_retrying)
- [Project Reactor — RetrySpec](https://projectreactor.io/docs/core/release/api/reactor/util/retry/RetrySpec.html)
- [RFC 9110 — Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9110 — Retry-After](https://www.rfc-editor.org/rfc/rfc9110.html)
- [AWS Architecture Blog — Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Google Cloud — Retry Strategy](https://cloud.google.com/storage/docs/retry-strategy)

Regra final:

```text
retry com backoff deve ser uma política explícita, não um operador genérico: a tentativa inicial conta, apenas falhas transitórias e operações repetíveis entram na matriz, timeouts de estágio podem ser repetidos mas o timeout total não, backoff exponencial reduz pressão, jitter evita clientes sincronizados, Retry-After é respeitado, o orçamento restante limita delay e nova tentativa, RestClient e WebClient aplicam a mesma decisão em modelos diferentes, métricas mostram amplificação e exhaustion e a última causa continua visível, enquanto circuit breaker e bulkhead permanecem controles separados para as próximas aulas.
```
