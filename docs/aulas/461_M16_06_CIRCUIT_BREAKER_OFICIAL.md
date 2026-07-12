# 461 - M16.06 - Circuit breaker

## Apresentação da aula

Na aula 460, as integrações passaram a repetir somente falhas transitórias.

O `order-consumer` imperativo passou a utilizar:

```text
Resilience4j Retry;

backoff exponencial;

jitter;

orçamento restante.
```

O `order-consumer-reactive` passou a utilizar:

```text
Reactor Retry;

Mono.delay;

virtual time;

deadline total.
```

A política de retry definiu:

```text
máximo:
3 tentativas totais;

falhas permanentes:
sem retry;

falhas transitórias:
retry condicionado;

timeout TOTAL:
sem retry;

Retry-After:
respeitado;

budget insuficiente:
sem nova tentativa.
```

Mesmo com esses controles, existe um problema: se o `catalog-provider` permanecer indisponível, cada nova request ainda poderá executar tentativa inicial, backoff e novas tentativas. O retry é limitado, mas novas operações continuam chamando um provedor já doente.

Isso produz:

- ocupação de threads;
- pipelines pendentes;
- conexões;
- filas;
- métricas de erro;
- pressão sobre o provider;
- aumento da latência do consumidor;
- falha em cascata.

A pergunta central desta aula será:

```text
como interromper temporariamente
chamadas a um provider
que está falhando de forma persistente,
sem tornar o bloqueio permanente
e sem confundir falha técnica
com erro de negócio?
```

A resposta será:

```text
circuit breaker.
```

O circuit breaker funciona como uma máquina de estados.

Estados principais:

```text
CLOSED;

OPEN;

HALF_OPEN.
```

No estado `CLOSED`, as chamadas são permitidas e seus resultados são medidos.

Quando a taxa de falhas ou chamadas lentas ultrapassa o limite configurado, o breaker abre.

No estado `OPEN`, novas chamadas são rejeitadas imediatamente.

O provider não é chamado.

Depois de uma janela de espera, o breaker permite um conjunto pequeno de chamadas de teste em `HALF_OPEN`.

Se essas probes demonstrarem recuperação:

```text
HALF_OPEN -> CLOSED.
```

Se demonstrarem que a falha persiste:

```text
HALF_OPEN -> OPEN.
```

Nesta aula, implementaremos circuit breaker para a consulta:

```http
GET /api/v1/products/{productCode}/availability
```

A integração permanecerá:

- autenticada;
- protegida por timeout;
- protegida por retry;
- observável;
- sem fallback;
- sem bulkhead.

Fallback será estudado depois.

Bulkhead e isolamento serão a próxima aula:

```text
462 - M16.07 - Bulkhead e isolamento.
```

A configuração didática será:

```text
sliding window:
COUNT_BASED;

window size:
10 chamadas lógicas;

minimum calls:
5;

failure rate threshold:
50%;

slow call duration:
600 ms;

slow call rate threshold:
50%;

wait in OPEN:
2 segundos;

permitted calls in HALF_OPEN:
2;

automatic transition:
desabilitada.
```

Esses valores não são produtivos.

Eles existem para tornar o laboratório rápido e observável.

A política de falhas será explícita.

Contam como falha do breaker:

```text
ProductCatalogUnavailableException;

ProductCatalogTimeoutException
nos estágios CONNECT,
RESPONSE,
READ
e TOTAL;

ProductCatalogContractException;

ProductCatalogAuthenticationException.
```

Não contam como falha do breaker:

```text
ProductNotFoundException;

ProductCatalogRateLimitedException;

ProductUnavailableForOrderException;

InvalidOrderQuantityException;

CatalogCredentialsUnavailableException.
```

A escolha exige cuidado: `404` é resposta válida e indica produto ausente, não catálogo doente. `429` indica provider vivo aplicando controle de capacidade e será observado separadamente.

Já `401` ou `403` na comunicação entre sistemas representa uma integração inutilizável até correção de credencial ou permission.

Essas falhas serão registradas pelo breaker e também gerarão alerta específico.

O circuit breaker não corrigirá autenticação.

Ele apenas evitará chamadas repetidas enquanto a falha persiste.

A ordem com retry será:

```text
Circuit Breaker
    |
    v
Retry
    |
    v
HTTP client
```

Essa ordem rejeita antes do retry quando `OPEN`; quando `CLOSED`, permite as tentativas internas, registra o resultado final da operação lógica e mantém as tentativas individuais nas métricas de retry.

Essa é uma decisão do laboratório.

Também seria possível medir cada tentativa no breaker.

Porém, isso faria o sliding window contar retries como chamadas independentes e poderia abrir o circuito por amplificação gerada pelo próprio client.

A decisão será documentada e testada.

Quando o breaker estiver aberto, o adapter lançará:

```text
ProductCatalogCircuitOpenException.
```

A response pública do consumidor será:

```text
503 Service Unavailable;

code:
product_catalog_circuit_open.
```

Não será `504`, porque a aplicação não esperou o provider.

Ela rejeitou imediatamente.

A response poderá incluir:

```text
Retry-After
```

somente se a aplicação conseguir calcular um valor seguro e coerente com o estado do breaker.

Não será criada uma promessa exata de recuperação.

Também não será implementado fallback.

O caller receberá uma falha clara e rápida.

Ao final da aula, você deverá conseguir explicar:

```text
por que circuit breaker
não é retry;

por que OPEN
não significa provider morto;

por que HALF_OPEN
precisa de probes limitadas;

por que 404
não abre o circuito;

por que a ordem
entre breaker e retry
muda as métricas;

por que o breaker
não substitui timeout,
bulkhead
ou observabilidade.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
459:
Timeouts.

460:
Retry com backoff.

461:
Circuit breaker.

462:
Bulkhead e isolamento.

463:
Fallback.
```

A aula 459 respondeu:

```text
quanto tempo
uma tentativa pode esperar?
```

A aula 460 respondeu:

```text
quando repetir
e quanto esperar
entre tentativas?
```

A aula 461 responderá:

```text
quando parar temporariamente
de chamar um provider
que está falhando
de forma persistente?
```

Nesta aula:

```text
CLOSED:
sim.

OPEN:
sim.

HALF_OPEN:
sim.

sliding window:
sim.

failure rate:
sim.

slow call rate:
sim.

RestClient:
sim.

WebClient:
sim.

métricas:
sim.

health interno:
sim.

fallback:
não.

bulkhead:
próxima aula.
```

A regra central será:

```text
o circuit breaker
protege o consumidor
e o provider
contra falhas persistentes,
mas não recupera
a dependência sozinho.
```

---

## Objetivo prático

Ao final da aula, os dois consumidores terão:

```text
CatalogCircuitBreakerProperties;

CatalogCircuitBreakerPolicy;

CatalogCircuitBreakerFailureClassifier;

ProductCatalogCircuitOpenException;

CatalogCircuitBreakerMetrics;

CatalogCircuitBreakerEventLogger;

CatalogCircuitBreakerHealthIndicator.
```

No consumidor imperativo:

```text
CatalogCircuitBreakerConfiguration;

CircuitBreakingProductCatalogGateway.
```

No consumidor reativo:

```text
ReactiveCatalogCircuitBreakerConfiguration;

ReactiveCircuitBreakingProductCatalogGateway.
```

Testes:

```text
CatalogCircuitBreakerPropertiesTest;

CatalogCircuitBreakerFailureClassifierTest;

CatalogCircuitBreakerStateTest;

CircuitBreakingRestClientIntegrationTest;

CircuitBreakingWebClientIntegrationTest;

CircuitBreakerRetryOrderTest;

CircuitBreakerSlowCallTest;

CircuitBreakerHalfOpenTest;

CircuitBreakerMetricsTest;

CircuitBreakerHealthTest;

CircuitBreakerLoggingSecurityTest;

NoFallbackBeforeFallbackLessonPolicyTest;

CircuitBreakerIsolationPolicyTest.
```

Documentação:

```text
docs/
├── CIRCUIT_BREAKER_POLICY.md
├── CIRCUIT_BREAKER_STATE_MACHINE.md
├── CIRCUIT_BREAKER_FAILURE_MATRIX.md
├── CIRCUIT_BREAKER_RETRY_ORDER.md
└── CIRCUIT_BREAKER_RUNBOOK.md
```

Você irá:

1. modelar estados;
2. escolher sliding window;
3. definir minimum calls;
4. definir failure rate;
5. definir slow call rate;
6. classificar exceptions;
7. criar properties;
8. configurar Resilience4j;
9. integrar o consumidor imperativo;
10. integrar o consumidor reativo;
11. preservar retry;
12. preservar timeout;
13. traduzir circuito aberto;
14. criar métricas;
15. criar events;
16. criar health interno;
17. testar transições;
18. testar concorrência;
19. testar ordem dos decorators;
20. preparar bulkhead.

---

## Conceito essencial

### CLOSED

No estado `CLOSED`, chamadas são permitidas.

O breaker registra resultados dentro de uma janela deslizante.

Resultados possíveis:

```text
success;

failure;

slow success;

slow failure;

ignored.
```

Enquanto o número mínimo de chamadas não é atingido, o breaker não calcula uma decisão suficiente para abrir.

Isso evita reagir a uma amostra pequena demais.

---

### OPEN

No estado `OPEN`, chamadas são recusadas imediatamente.

O provider não recebe request.

No Resilience4j, a recusa é representada por:

```text
CallNotPermittedException.
```

A aplicação traduzirá para:

```text
ProductCatalogCircuitOpenException.
```

O breaker não interrompe chamadas que já estavam em execução quando a transição ocorreu.

Ele controla novas permissões.

---

### HALF_OPEN

Depois do período em `OPEN`, o breaker permite um número limitado de probes.

No laboratório:

```text
2 chamadas.
```

Essas chamadas testam recuperação.

Se a taxa de falhas das probes atingir o limite:

```text
volta para OPEN.
```

Se as probes forem suficientes e saudáveis:

```text
volta para CLOSED.
```

Chamadas além do limite em `HALF_OPEN` são rejeitadas.

---

### Sliding window por contagem

Usaremos:

```text
COUNT_BASED.
```

A janela contém os últimos dez resultados lógicos.

Vantagens didáticas:

- comportamento fácil de reproduzir;
- número fixo de samples;
- testes diretos.

Uma janela por tempo agregaria chamadas de um período em segundos.

Ela pode ser melhor em alguns cenários de tráfego variável.

Não existe uma escolha universal.

---

### Minimum number of calls

Configuração:

```text
5.
```

Com quatro falhas consecutivas, o breaker permanece `CLOSED` porque ainda não há amostra mínima.

Na quinta chamada, a taxa pode ser calculada.

Exemplo:

```text
3 falhas;

2 sucessos;

failure rate:
60%.
```

Como o limite é 50%:

```text
CLOSED -> OPEN.
```

---

### Failure rate

Fórmula:

```text
falhas registradas
/
chamadas registradas
*
100.
```

Ignored exceptions não entram como falha.

Dependendo da configuração, também não entram como sucesso.

A policy precisa ser testada contra a versão utilizada.

---

### Slow call

Uma chamada pode retornar sucesso e ainda assim representar risco.

Exemplo:

```text
catálogo responde
em 750 ms;

timeout:
800 ms.
```

A chamada não estourou timeout.

Mas está muito próxima do limite.

Configuraremos:

```text
slowCallDurationThreshold:
600 ms.
```

Se pelo menos 50% das chamadas na janela forem lentas, o breaker abre.

---

### Slow call não é timeout

Slow call:

```text
terminou,
mas ultrapassou
o limite de lentidão.
```

Timeout:

```text
não terminou
dentro do prazo.
```

Uma slow call pode ser sucesso.

Ela ainda consome recursos e reduz margem.

---

### Failure classifier

O breaker não deve contar qualquer exception.

Crie:

```java
public final class CatalogCircuitBreakerFailureClassifier {

    public boolean record(
            Throwable failure
    ) {
        return failure instanceof ProductCatalogUnavailableException
                || failure instanceof ProductCatalogTimeoutException
                || failure instanceof ProductCatalogContractException
                || failure instanceof ProductCatalogAuthenticationException;
    }

    public boolean ignore(
            Throwable failure
    ) {
        return failure instanceof ProductNotFoundException
                || failure instanceof ProductCatalogRateLimitedException
                || failure instanceof CatalogCredentialsUnavailableException
                || failure instanceof ProductUnavailableForOrderException;
    }
}
```

A implementação final deve lidar com herança sem sobreposição.

---

### Por que contract error conta

Se o provider retorna `200` com JSON incompatível, ele está disponível em rede, mas indisponível para o contrato esperado pelo consumidor.

Chamadas repetidas provavelmente falharão do mesmo modo.

O circuit breaker pode interromper essa pressão.

A causa precisa gerar alerta de alta prioridade.

---

### Por que 404 não conta

O `404` é uma resposta de negócio válida do catálogo.

Abrir o circuito porque vários produtos não existem confundiria:

```text
dado ausente
com
provider doente.
```

---

### Por que 429 não conta na baseline

`429` significa que o provider está respondendo e controlando capacidade.

A policy de retry respeita `Retry-After`.

O circuit breaker não contará o status como failure nesta baseline.

A aula de bulkhead tratará isolamento no consumidor.

---

### Autenticação como failure registrada

`401` e `403` da integração significam que o consumer não consegue utilizar o provider.

Contar essas falhas permite rejeitar rapidamente chamadas repetidas.

Entretanto, o alerta não deve ser tratado como instabilidade comum.

Ele indica:

- token inválido;
- audience errada;
- permission ausente;
- configuração quebrada.

---

### Circuit breaker não testa saúde ativa

O breaker não executa ping sozinho.

Ele observa chamadas reais.

Em `HALF_OPEN`, as probes são chamadas reais permitidas pelo fluxo.

Não crie uma thread que chame o provider continuamente sem necessidade.

---

### Wait duration

Configuração:

```text
2 segundos no laboratório.
```

Durante esse período, o breaker permanece `OPEN`.

Depois, a próxima tentativa elegível pode iniciar `HALF_OPEN`.

A transição automática ficará desabilitada.

Isso evita uma thread dedicada apenas para alterar estado.

---

### Configuração produtiva

Produção precisa considerar volume, p95, p99, taxa normal de erro, deploys, capacidade, SLO, recuperação, número de instâncias, retry e carga.

Copiar `windowSize=10` para produção sem análise é incorreto.

---

### Um breaker por provider e capacidade

Nome:

```text
catalogAvailability.
```

Não use um breaker global para:

- catálogo;
- pagamento;
- identidade;
- logística.

Falhas possuem owners e comportamentos diferentes.

Também pode ser necessário separar capacidades do mesmo provider quando possuem perfis diferentes.

---

### Circuit breaker em memória

Cada instância da aplicação possui seu próprio estado.

Em um cluster:

```text
instância A:
OPEN;

instância B:
CLOSED.
```

Isso é esperado no Resilience4j local.

O breaker não é uma coordenação distribuída.

Métricas precisam ser agregadas por instância.

---

### Ordem com retry

Fluxo escolhido:

```text
CircuitBreaker(
    Retry(
        HTTP call
    )
)
```

Consequências:

- breaker `OPEN` impede todas as tentativas;
- uma operação lógica ocupa um sample;
- retries internos ficam nas métricas de retry;
- falha final alimenta o breaker;
- sucesso após retry conta como sucesso lógico.

---

### Ordem alternativa

```text
Retry(
    CircuitBreaker(
        HTTP call
    )
)
```

Nesse modelo:

- cada tentativa solicita permissão;
- cada tentativa pode ser registrada;
- o breaker pode abrir no meio do retry;
- retries podem receber `CallNotPermittedException`;
- window conta tentativas.

Não usaremos essa ordem.

O teste de arquitetura deve impedir inversão acidental.

---

### Circuit open não recebe retry

`ProductCatalogCircuitOpenException` não é retryable.

Repetir imediatamente uma rejeição local só produz:

- nova rejeição;
- métricas inúteis;
- consumo de budget.

O circuit breaker decide quando uma probe é permitida.

---

### Health indicator

O estado do breaker pode ser exposto internamente.

Não coloque details em endpoint público.

Liveness não deve ficar `DOWN` apenas porque uma dependência externa está aberta.

Caso contrário, a plataforma pode reiniciar uma aplicação saudável e aumentar a instabilidade.

Readiness exige decisão consciente.

Nesta aula, o health detalhado ficará na porta de management local.

---

### Métricas

Métricas importantes:

```text
state;

calls by kind;

failure rate;

slow call rate;

not permitted calls;

state transitions.
```

Tags:

```text
breaker.name;

client.type;

result.kind.
```

Não use:

- product code;
- correlation ID;
- token;
- URL completa;
- exception message.

---

### Events

Eventos úteis:

```text
SUCCESS;

ERROR;

IGNORED_ERROR;

STATE_TRANSITION;

NOT_PERMITTED;

SLOW_CALL_RATE_EXCEEDED;

FAILURE_RATE_EXCEEDED.
```

O event logger não deve imprimir `Throwable.toString()` sem controle.

Use reason codes.

---

### Reset manual

Resetar o breaker apaga sua janela e volta a `CLOSED`.

Não exponha endpoint público de reset.

Em testes, use:

```text
circuitBreaker.reset().
```

Em operação, reset manual exige runbook e autorização.

---

### Fallback não faz parte desta aula

Quando `OPEN`, o sistema falha rápido.

Não retorna:

- produto disponível por padrão;
- quantidade zero falsa;
- cache sem validade;
- response antiga sem policy.

Fallback será tratado em aula específica.

---

## Mão na massa guiada

### 1. Criar policy document

Arquivo:

```text
docs/CIRCUIT_BREAKER_POLICY.md
```

Tabela:

| Propriedade | Valor didático |
|---|---|
| name | catalogAvailability |
| window type | COUNT_BASED |
| window size | 10 |
| minimum calls | 5 |
| failure threshold | 50% |
| slow duration | 600 ms |
| slow threshold | 50% |
| open wait | 2 s |
| half-open calls | 2 |
| auto transition | false |

---

### 2. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.catalog.circuit-breaker"
)
public record CatalogCircuitBreakerProperties(
        int slidingWindowSize,
        int minimumNumberOfCalls,
        float failureRateThreshold,
        Duration slowCallDurationThreshold,
        float slowCallRateThreshold,
        Duration waitDurationInOpenState,
        int permittedCallsInHalfOpenState
) {
    public CatalogCircuitBreakerProperties {
        if (slidingWindowSize < 2) {
            throw new IllegalArgumentException(
                "slidingWindowSize must be at least 2"
            );
        }

        if (
            minimumNumberOfCalls < 1
            || minimumNumberOfCalls > slidingWindowSize
        ) {
            throw new IllegalArgumentException(
                "minimumNumberOfCalls is invalid"
            );
        }

        requirePercentage(
            failureRateThreshold
        );

        requirePercentage(
            slowCallRateThreshold
        );

        requirePositive(
            slowCallDurationThreshold
        );

        requirePositive(
            waitDurationInOpenState
        );
    }
}
```

---

### 3. Configurar local profile

```yaml
integrations:
  catalog:
    circuit-breaker:
      sliding-window-size: 10
      minimum-number-of-calls: 5
      failure-rate-threshold: 50
      slow-call-duration-threshold: 600ms
      slow-call-rate-threshold: 50
      wait-duration-in-open-state: 2s
      permitted-calls-in-half-open-state: 2
```

---

### 4. Adicionar dependencies

No consumidor imperativo:

```text
resilience4j-circuitbreaker;

resilience4j-micrometer.
```

No consumidor reativo:

```text
resilience4j-circuitbreaker;

resilience4j-reactor;

resilience4j-micrometer.
```

Mantenha versões gerenciadas e fixas.

Não use version ranges.

---

### 5. Criar configuration

```java
@Bean
CircuitBreaker catalogAvailabilityCircuitBreaker(
        CatalogCircuitBreakerProperties properties,
        CatalogCircuitBreakerFailureClassifier classifier
) {
    CircuitBreakerConfig config =
            CircuitBreakerConfig
                .custom()
                .slidingWindowType(
                    CircuitBreakerConfig
                        .SlidingWindowType
                        .COUNT_BASED
                )
                .slidingWindowSize(
                    properties.slidingWindowSize()
                )
                .minimumNumberOfCalls(
                    properties.minimumNumberOfCalls()
                )
                .failureRateThreshold(
                    properties.failureRateThreshold()
                )
                .slowCallDurationThreshold(
                    properties.slowCallDurationThreshold()
                )
                .slowCallRateThreshold(
                    properties.slowCallRateThreshold()
                )
                .waitDurationInOpenState(
                    properties.waitDurationInOpenState()
                )
                .permittedNumberOfCallsInHalfOpenState(
                    properties.permittedCallsInHalfOpenState()
                )
                .automaticTransitionFromOpenToHalfOpenEnabled(
                    false
                )
                .recordException(
                    classifier::record
                )
                .ignoreException(
                    classifier::ignore
                )
                .build();

    return CircuitBreaker.of(
            "catalogAvailability",
            config
    );
}
```

---

### 6. Criar open exception

```java
public final class ProductCatalogCircuitOpenException
        extends ProductCatalogException {

    public ProductCatalogCircuitOpenException() {
        super(
            "Product catalog circuit is open"
        );
    }
}
```

Ela não recebe o nome interno do breaker no detail público.

---

### 7. Decorar o gateway imperativo

```java
@Component
@Primary
public class CircuitBreakingProductCatalogGateway
        implements ProductCatalogGateway {

    private final ProductCatalogGateway retryingDelegate;
    private final CircuitBreaker circuitBreaker;

    @Override
    public ProductAvailabilitySnapshot findAvailability(
            ProductCode productCode
    ) {
        Supplier<ProductAvailabilitySnapshot> operation =
                CircuitBreaker.decorateSupplier(
                    circuitBreaker,
                    () ->
                        retryingDelegate
                            .findAvailability(
                                productCode
                            )
                );

        try {
            return operation.get();
        }
        catch (
            CallNotPermittedException exception
        ) {
            throw new ProductCatalogCircuitOpenException();
        }
    }
}
```

Garanta que o delegate já representa a camada com retry.

---

### 8. Evitar ciclo de injection

Use qualifiers:

```text
rawCatalogGateway;

retryingCatalogGateway;

circuitBreakingCatalogGateway.
```

Ordem:

```text
raw HTTP adapter;

retry decorator;

circuit breaker decorator;

application service.
```

Não dependa apenas de `@Primary` em uma cadeia ambígua.

---

### 9. Decorar o gateway reativo

```java
@Component
@Primary
public class ReactiveCircuitBreakingProductCatalogGateway
        implements ReactiveProductCatalogGateway {

    private final ReactiveProductCatalogGateway retryingDelegate;
    private final CircuitBreaker circuitBreaker;

    @Override
    public Mono<ProductAvailabilitySnapshot> findAvailability(
            ProductCode productCode
    ) {
        return Mono.defer(
                    () ->
                        retryingDelegate
                            .findAvailability(
                                productCode
                            )
                )
                .transformDeferred(
                    CircuitBreakerOperator.of(
                        circuitBreaker
                    )
                )
                .onErrorMap(
                    CallNotPermittedException.class,
                    exception ->
                        new ProductCatalogCircuitOpenException()
                );
    }
}
```

`transformDeferred` aplica a proteção por subscription.

---

### 10. Criar event logger

Registre:

```text
state transition;

not permitted;

failure rate exceeded;

slow call rate exceeded.
```

Não registre body ou token.

Exemplo:

```java
circuitBreaker
    .getEventPublisher()
    .onStateTransition(
        event ->
            log.info(
                "event=catalog_circuit_transition "
                + "from={} to={}",
                event.getStateTransition()
                     .getFromState(),
                event.getStateTransition()
                     .getToState()
            )
    );
```

Inclua correlation apenas em eventos de chamada quando disponível.

---

### 11. Criar metrics binding

Ligue o registry ao `MeterRegistry`.

Valide métricas:

```text
resilience4j.circuitbreaker.state;

resilience4j.circuitbreaker.calls;

resilience4j.circuitbreaker.failure.rate;

resilience4j.circuitbreaker.slow.call.rate;

resilience4j.circuitbreaker.not.permitted.calls.
```

Os nomes exatos devem ser confirmados na versão usada.

O teste pode procurar meters por prefixo e tags.

---

### 12. Criar Problem Details

Mapeamento:

```text
ProductCatalogCircuitOpenException:
503.
```

Response:

```json
{
  "type": "urn:problem:integration:catalog-circuit-open",
  "title": "Product catalog temporarily unavailable",
  "status": 503,
  "detail": "The product catalog is temporarily unavailable.",
  "code": "product_catalog_circuit_open",
  "correlationId": "corr-461-001"
}
```

---

### 13. Criar health indicator

Informações internas:

```text
name;

state;

failureRate;

slowCallRate;

bufferedCalls;

notPermittedCalls.
```

Não exponha exception ou URLs.

Mantenha management em loopback.

---

### 14. Testar estado inicial

Esperado:

```text
CLOSED.
```

Metrics:

```text
buffered calls:
0.
```

---

### 15. Testar minimum calls

Execute quatro failures registradas.

Esperado:

```text
CLOSED.
```

A quinta failure pode abrir.

---

### 16. Testar failure rate

Sequência:

```text
failure;

failure;

failure;

success;

success.
```

Failure rate:

```text
60%.
```

Esperado:

```text
OPEN.
```

---

### 17. Testar taxa abaixo do limite

Sequência:

```text
failure;

failure;

success;

success;

success.
```

Failure rate:

```text
40%.
```

Esperado:

```text
CLOSED.
```

---

### 18. Testar ignored 404

Execute vários `ProductNotFoundException`.

Esperado:

```text
breaker não abre.
```

Valide contadores conforme a semântica da versão.

---

### 19. Testar contract errors

Execute cinco contract failures.

Esperado:

```text
OPEN.
```

Isso protege contra um provider incompatível.

---

### 20. Testar auth failures

Execute cinco falhas de integração `401/403`.

Esperado:

```text
OPEN;

alerta específico.
```

Não trate como recuperação silenciosa.

---

### 21. Testar slow calls

Use server com responses de:

```text
650 ms.
```

Abaixo do timeout, acima do slow threshold.

Com três slow calls em cinco:

```text
slow rate:
60%.

OPEN.
```

---

### 22. Testar OPEN

Depois de abrir:

```text
execute nova request.
```

Esperado:

```text
ProductCatalogCircuitOpenException;

zero chamada HTTP;

zero retry;

latência baixa.
```

---

### 23. Testar transição determinística

Em teste unitário, use transition methods controlados:

```text
transitionToOpenState;

transitionToHalfOpenState;

transitionToClosedState.
```

Não use `Thread.sleep` longo.

O teste de wait duration pode ser separado e curto.

---

### 24. Testar HALF_OPEN com sucesso

Coloque em `HALF_OPEN`.

Execute duas probes com sucesso.

Esperado:

```text
CLOSED.
```

---

### 25. Testar HALF_OPEN com falha

Primeira probe falha conforme threshold.

Esperado:

```text
OPEN.
```

A quantidade exata necessária depende da configuração.

Teste o cenário definido, não um comportamento assumido.

---

### 26. Testar limite de probes

Em `HALF_OPEN`, inicie chamadas concorrentes acima de duas.

Esperado:

```text
somente duas permitidas;

demais not permitted.
```

Use barrier para sincronizar.

---

### 27. Testar ordem com retry

Cenário:

```text
primeira tentativa:
503;

segunda:
200.
```

Esperado:

```text
retry:
2 raw calls;

breaker:
1 logical success;

state:
CLOSED.
```

---

### 28. Testar falha final

Cenário:

```text
3 tentativas:
503.
```

Esperado:

```text
breaker registra
1 logical failure.
```

Repita operações lógicas até abrir.

---

### 29. Testar circuito aberto não retryable

Quando `OPEN`:

```text
raw HTTP calls:
0;

retry scheduled:
0.
```

---

### 30. Testar timeout TOTAL

O timeout total conta como failure do breaker.

Não recebe retry.

Depois de minimum calls, pode abrir.

---

### 31. Testar 429 ignorado

Execute rate limits.

Esperado:

```text
não altera failure rate.
```

A exception continua sendo devolvida.

---

### 32. Testar state metrics

Valide tags estáveis:

```text
name=catalogAvailability;

state=closed|open|half_open.
```

Não adicione instance ID como tag de alta cardinalidade sem policy.

---

### 33. Testar event logs

Capture transições e not permitted.

Sentinelas:

```text
token-circuit-sentinel;

body-circuit-sentinel;

product-circuit-sentinel.
```

Nenhuma aparece.

---

### 34. Testar health interno

Em `CLOSED`:

```text
state:
CLOSED.
```

Em `OPEN`:

```text
state:
OPEN.
```

Não valide que liveness global ficará `DOWN`.

A policy deve impedir esse acoplamento.

---

### 35. Criar isolation policy

Falhe se:

- payment e catalog usam o mesmo breaker;
- name é `default`;
- breaker é singleton genérico para todos os providers;
- controller acessa CircuitBreaker diretamente;
- domínio importa Resilience4j;
- reset endpoint público existe.

---

### 36. Criar no fallback policy

Falhe se encontrar:

```text
onErrorReturn;

recover com snapshot;

available=true default;

quantity=0 fallback;

cache não versionado.
```

Fallback será estudado depois.

---

### 37. Criar state machine document

Arquivo:

```text
docs/CIRCUIT_BREAKER_STATE_MACHINE.md
```

Diagrama:

```text
             failure/slow threshold
CLOSED ------------------------------> OPEN
  ^                                      |
  |                                      |
  | successful probes                    | wait duration
  |                                      v
  +---------------------------------- HALF_OPEN
                      failed probes ------+
```

Inclua `not permitted` em `OPEN`.

---

### 38. Criar failure matrix

Arquivo:

```text
docs/CIRCUIT_BREAKER_FAILURE_MATRIX.md
```

| Falha | Conta |
|---|---|
| unavailable | sim |
| timeout CONNECT | sim |
| timeout RESPONSE | sim |
| timeout READ | sim |
| timeout TOTAL | sim |
| contract | sim |
| integration auth | sim |
| not found | não |
| rate limited | não |
| invalid order | não |
| missing local credential | não |

---

### 39. Criar retry order document

Arquivo:

```text
docs/CIRCUIT_BREAKER_RETRY_ORDER.md
```

Registre:

```text
CB outer;

Retry inner;

one logical sample;

raw attempts separate.
```

Inclua a alternativa rejeitada.

---

### 40. Criar runbook

Arquivo:

```text
docs/CIRCUIT_BREAKER_RUNBOOK.md
```

Perguntas:

- qual breaker;
- qual estado;
- qual failure rate;
- qual slow rate;
- quantas calls buffered;
- qual failure kind;
- houve deploy;
- auth falhou;
- contract mudou;
- provider está recebendo probes;
- retries aumentaram calls;
- quanto tempo em OPEN;
- HALF_OPEN voltou a abrir;
- reset manual foi solicitado;
- fallback ainda está ausente.

---

### 41. Executar testes imperativos

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=CatalogCircuitBreakerPropertiesTest,CatalogCircuitBreakerFailureClassifierTest,CatalogCircuitBreakerStateTest,CircuitBreakingRestClientIntegrationTest,CircuitBreakerRetryOrderTest,CircuitBreakerSlowCallTest,CircuitBreakerHalfOpenTest,CircuitBreakerMetricsTest,CircuitBreakerHealthTest,CircuitBreakerLoggingSecurityTest,CircuitBreakerIsolationPolicyTest `
  test
```

---

### 42. Executar testes reativos

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=CatalogCircuitBreakerPropertiesTest,CatalogCircuitBreakerFailureClassifierTest,CatalogCircuitBreakerStateTest,CircuitBreakingWebClientIntegrationTest,CircuitBreakerRetryOrderTest,CircuitBreakerSlowCallTest,CircuitBreakerHalfOpenTest,CircuitBreakerMetricsTest,CircuitBreakerHealthTest,CircuitBreakerLoggingSecurityTest,NoFallbackBeforeFallbackLessonPolicyTest,CircuitBreakerIsolationPolicyTest `
  test
```

---

### 43. Executar fluxo OPEN

Configure provider para falhar persistentemente.

Execute operações suficientes.

Confirme:

```text
CLOSED -> OPEN;

novas requests:
503 rápido;

provider:
não chamado.
```

---

### 44. Executar recuperação

Restaure o provider.

Transicione para `HALF_OPEN` no teste ou aguarde o período didático.

Execute probes.

Confirme:

```text
HALF_OPEN -> CLOSED.
```

---

### 45. Executar regressão

Confirme:

- timeout;
- retry;
- budget;
- correlation;
- security;
- contract;
- no fallback;
- no bulkhead;
- circuit open sem retry.

---

### 46. Executar gates

Nos dois consumidores:

```powershell
.\mvnw.cmd clean verify
```

---

### 47. Registrar limitações

Ainda faltam:

```text
bulkhead;

fallback;

tuning produtivo;

load test;

breaker distribuído não existe;

health integrado à plataforma;

alertas reais;

dashboard;

runbook operacional validado.
```

---

## Entendendo o que foi feito

### Falha persistente passou a ser interrompida

O consumidor não chama indefinidamente um provider doente.

### Estados ficaram explícitos

`CLOSED`, `OPEN` e `HALF_OPEN` possuem responsabilidades distintas.

### Amostra mínima reduziu reações precipitadas

Poucas falhas não abrem o circuito.

### Lentidão passou a contar

Sucessos lentos podem indicar degradação.

### Negócio foi separado de falha técnica

`404` não abre o breaker.

### Retry e breaker receberam ordem definida

Tentativas internas formam uma operação lógica.

### Circuito aberto falha rápido

Não há HTTP nem retry.

### Probes controlam recuperação

O breaker não fecha apenas porque o tempo passou.

### A próxima proteção ficou visível

Mesmo com circuito, concorrência local ainda pode esgotar recursos antes de o threshold ser atingido.

---

## Erros comuns importantes

### Usar breaker global

Falha do catálogo derruba integrações sem relação.

### Abrir por 404

Dado ausente vira indisponibilidade técnica.

### Contar qualquer exception

Erros do caller contaminam failure rate.

### Não configurar minimum calls

Uma ou duas falhas podem abrir cedo demais.

### Ignorar slow calls

A dependência degrada antes de falhar.

### Colocar retry fora do breaker sem decisão

Cada tentativa pode contaminar a janela.

### Repetir CallNotPermitted

O breaker já tomou a decisão.

### Fechar automaticamente sem probes

Recuperação não foi comprovada.

### Usar liveness para circuit open

A plataforma reinicia uma aplicação saudável.

### Implementar fallback falso

O sistema retorna dados incorretos em vez de falhar claramente.

---

## Comandos úteis

### Testes de estados

```powershell
.\mvnw.cmd `
  -Dtest=CatalogCircuitBreakerStateTest,CircuitBreakerSlowCallTest,CircuitBreakerHalfOpenTest `
  test
```

### Integração imperativa

```powershell
.\mvnw.cmd `
  -Dtest=CircuitBreakingRestClientIntegrationTest,CircuitBreakerRetryOrderTest `
  test
```

### Integração reativa

```powershell
.\mvnw.cmd `
  -Dtest=CircuitBreakingWebClientIntegrationTest,CircuitBreakerRetryOrderTest `
  test
```

### Policies

```powershell
.\mvnw.cmd `
  -Dtest=CircuitBreakerIsolationPolicyTest,NoFallbackBeforeFallbackLessonPolicyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Estados

Desenhe CLOSED, OPEN e HALF_OPEN.

### Parte 2 — Janela

Configure count-based window e minimum calls.

### Parte 3 — Classificação

Separe negócio, contrato e infraestrutura.

### Parte 4 — Imperativo

Decore o gateway com breaker externo ao retry.

### Parte 5 — Reativo

Use `CircuitBreakerOperator`.

### Parte 6 — Errors

Traduza CallNotPermitted.

### Parte 7 — Tests

Valide threshold, slow calls e probes.

### Parte 8 — Observabilidade

Crie metrics, events e health interno.

### Parte 9 — Policies

Impeça breaker global e fallback antecipado.

### Parte 10 — Gate

Comprove que OPEN não chama provider.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 460 foi preservada;
- circuit breaker foi diferenciado de retry;
- estados CLOSED, OPEN e HALF_OPEN foram explicados;
- sliding window count-based foi configurada;
- window size foi validado;
- minimum calls foi validado;
- failure rate threshold foi configurado;
- slow call duration foi configurada;
- slow call rate foi configurada;
- wait duration foi configurada;
- probes HALF_OPEN foram limitadas;
- automatic transition ficou desabilitada;
- values foram marcados como didáticos;
- failure classifier foi criado;
- unavailable conta como failure;
- timeouts contam como failure;
- contract error conta como failure;
- integration auth conta como failure;
- not found não conta como failure;
- rate limit não conta na baseline;
- credentials locais ausentes não contaminam o breaker;
- um breaker dedicado ao catálogo foi criado;
- domínio não importa Resilience4j;
- RestClient recebeu decorator;
- WebClient recebeu CircuitBreakerOperator;
- retry permaneceu interno ao breaker;
- ordem dos decorators foi documentada;
- uma operação lógica produz um sample;
- retries permanecem medidos separadamente;
- circuito OPEN não executa retry;
- CallNotPermitted virou exception estável;
- circuito aberto retorna `503`;
- logs não contêm token ou body;
- metrics de estado, calls e rates foram criadas;
- events de transição foram registrados;
- health detalhado ficou interno;
- liveness não depende diretamente do breaker;
- minimum calls foi testado;
- failure rate foi testada;
- slow call rate foi testada;
- ignored 404 foi testado;
- contract failure foi testada;
- auth failure foi testada;
- OPEN sem HTTP foi testado;
- HALF_OPEN com sucesso e falha foi testado;
- limite concorrente de probes foi testado;
- isolation policy foi criada;
- fallback não foi antecipado;
- bulkhead não foi antecipado;
- limitações foram registradas;
- produção pública permaneceu NO-GO;
- gates dos dois consumidores foram executados;
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
  "CircuitBreaker|CallNotPermitted|onErrorReturn|recover\\(|available\\(true\\)|reset\\(\\)"
```

Revise cada ocorrência.

Adicione:

```powershell
git add `
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
git commit -m "feat(m16): aplicar circuit breaker no catalogo"
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
- breaker global;
- reset endpoint público;
- fallback;
- bulkhead antecipado;
- values produtivos inventados;
- health público detalhado;
- teste com sleep longo;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a integração deixou de insistir em um provider persistentemente doente.

O fluxo ficou:

```text
Circuit Breaker;

Retry;

Timeout;

HTTP client;

catalog-provider.
```

Quando `CLOSED`:

```text
operações são permitidas;

resultados são medidos.
```

Quando thresholds são excedidos:

```text
CLOSED -> OPEN.
```

Quando `OPEN`:

```text
novas operações
falham rápido;

provider não é chamado;

retry não inicia.
```

Quando chega o momento de testar recuperação:

```text
OPEN -> HALF_OPEN;

poucas probes são permitidas.
```

Se o provider se recuperou:

```text
HALF_OPEN -> CLOSED.
```

Se continua falhando:

```text
HALF_OPEN -> OPEN.
```

A principal decisão foi:

```text
o breaker mede
operações lógicas
depois do retry,
enquanto métricas de retry
continuam medindo
tentativas individuais.
```

Também ficou comprovado:

```text
404 não representa
provider doente;

slow success
pode indicar degradação;

OPEN não deve ser retryado;

health do breaker
não deve derrubar liveness;

circuit breaker
não produz fallback.
```

Ainda existe outra forma de falha.

Antes de o breaker abrir, muitas requests concorrentes podem ocupar:

- threads;
- event loops;
- connections;
- pools;
- memória.

O breaker decide com base em histórico.

Ele não limita diretamente quantas chamadas simultâneas podem atravessar.

A próxima aula será:

```text
462 - M16.07 - Bulkhead e isolamento
```

Nela, você irá:

- limitar chamadas concorrentes;
- separar recursos por integração;
- comparar semaphore bulkhead e thread pool bulkhead;
- aplicar isolamento no RestClient;
- aplicar isolamento no WebClient;
- tratar fila cheia;
- medir rejeições;
- combinar bulkhead, circuit breaker, retry e timeout na ordem correta;
- impedir que o catálogo consuma todos os recursos do consumidor;
- preparar a aula de fallback.

---

# Material complementar

## Checkpoint final

- [ ] Modelei CLOSED, OPEN e HALF_OPEN.
- [ ] Configurei failure e slow call rates.
- [ ] Integrei breaker externo ao retry.
- [ ] Testei OPEN, HALF_OPEN e métricas.
- [ ] Mantive bulkhead e fallback para depois.

---

## Troubleshooting adicional

### O breaker nunca abre

Confirme minimum calls, classifier e se o decorator usado é o bean injetado.

### O breaker abre com 404

A exception não está na ignore policy.

### Cada retry aparece como sample

A ordem dos decorators foi invertida.

### OPEN ainda chama o provider

O retry ou client pode estar fora do decorator.

### OPEN recebe retry

`ProductCatalogCircuitOpenException` entrou na retry policy.

### HALF_OPEN permite chamadas demais

Confirme permitted calls e concorrência do teste.

### O breaker fecha sem probes

Automatic transition ou reset manual pode estar ativo.

### Liveness fica DOWN

Separe dependência externa de liveness da aplicação.

### Metrics não aparecem

Confirme Micrometer, Actuator e binding do registry.

### O caller recebe CallNotPermittedException

Traduza na fronteira da integração.

---

## Perguntas de revisão

1. O que o circuit breaker protege?
2. Qual é o estado inicial?
3. O que ocorre em CLOSED?
4. O que ocorre em OPEN?
5. O que ocorre em HALF_OPEN?
6. O que é sliding window?
7. Para que serve minimum calls?
8. O que é failure rate?
9. O que é slow call?
10. Slow call é timeout?
11. 404 conta como failure?
12. Contract error conta?
13. 429 conta na baseline?
14. Qual é a ordem com retry?
15. OPEN executa retry?
16. Um breaker deve ser global?
17. Circuit open derruba liveness?
18. Circuit breaker fornece fallback?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Consumer e provider contra falha persistente.
2. CLOSED.
3. Permite e mede.
4. Rejeita rapidamente.
5. Permite probes limitadas.
6. Janela dos resultados recentes.
7. Evitar decisão com amostra pequena.
8. Percentual de falhas.
9. Chamada concluída acima do limite.
10. Não.
11. Não.
12. Sim.
13. Não.
14. Breaker externo ao retry.
15. Não.
16. Não.
17. Não automaticamente.
18. Não.
19. Bulkhead e isolamento.
20. Limitar concorrência e separar recursos.

---

## Desafio opcional

Crie uma comparação entre:

```text
COUNT_BASED;

TIME_BASED.
```

Execute tráfego sintético com:

- baixa taxa;
- burst;
- falhas concentradas;
- falhas espaçadas.

Documente qual janela reage melhor em cada cenário.

Não altere a baseline sem evidência.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 461 - M16.06 - Circuit breaker

- Implementei circuit breaker nas integrações do catálogo.
- Diferenciei circuit breaker e retry.
- Modelei os estados CLOSED, OPEN e HALF_OPEN.
- Usei sliding window por contagem.
- Configurei window size.
- Configurei minimum calls.
- Configurei failure rate threshold.
- Configurei slow call duration.
- Configurei slow call rate threshold.
- Configurei wait duration em OPEN.
- Limitei probes em HALF_OPEN.
- Desabilitei transição automática.
- Marquei os valores como didáticos.
- Criei `CatalogCircuitBreakerProperties`.
- Criei `CatalogCircuitBreakerFailureClassifier`.
- Registrei indisponibilidade e timeouts como failures.
- Registrei contract e integration auth como failures.
- Ignorei not found.
- Ignorei rate limit na baseline.
- Criei breaker dedicado `catalogAvailability`.
- Mantive Resilience4j fora do domínio.
- Criei `ProductCatalogCircuitOpenException`.
- Criei decorator imperativo.
- Criei decorator reativo com `CircuitBreakerOperator`.
- Mantive retry dentro do breaker.
- Tratei uma operação lógica como um sample.
- Mantive raw attempts nas métricas de retry.
- Impedi retry de circuito aberto.
- Mapeei circuito aberto para `503`.
- Criei event logger seguro.
- Criei métricas de state, calls, failure rate e slow rate.
- Criei health indicator interno.
- Mantive liveness independente do breaker.
- Testei estado inicial.
- Testei minimum calls.
- Testei failure rate acima e abaixo do threshold.
- Testei ignored 404.
- Testei contract failures.
- Testei integration auth failures.
- Testei slow calls.
- Testei OPEN sem HTTP.
- Testei HALF_OPEN com sucesso e falha.
- Testei limite concorrente de probes.
- Testei a ordem com retry.
- Criei isolation policy.
- Criei policy impedindo fallback antecipado.
- Criei `CIRCUIT_BREAKER_POLICY.md`.
- Criei `CIRCUIT_BREAKER_STATE_MACHINE.md`.
- Criei `CIRCUIT_BREAKER_FAILURE_MATRIX.md`.
- Criei `CIRCUIT_BREAKER_RETRY_ORDER.md`.
- Criei `CIRCUIT_BREAKER_RUNBOOK.md`.
- Não antecipei bulkhead ou fallback.
- Mantive produção pública como NO-GO.
- Próxima aula: Bulkhead e isolamento.
```

---

## Referência técnica curta

- [Resilience4j — CircuitBreaker](https://resilience4j.readme.io/docs/circuitbreaker)
- [Resilience4j — Getting Started](https://resilience4j.readme.io/docs/getting-started)
- [Resilience4j Reactor — Examples](https://resilience4j.readme.io/docs/examples-1)
- [Spring Cloud CircuitBreaker — Metrics](https://docs.spring.io/spring-cloud-circuitbreaker/reference/spring-cloud-circuitbreaker-resilience4j/collecting-metrics.html)
- [Martin Fowler — Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Microsoft Azure Architecture Center — Circuit Breaker](https://learn.microsoft.com/azure/architecture/patterns/circuit-breaker)

Regra final:

```text
um circuit breaker deve medir falhas persistentes de uma capacidade externa sem confundir erros de negócio com indisponibilidade: CLOSED permite e agrega resultados, OPEN rejeita rapidamente sem chamar o provider, HALF_OPEN permite probes limitadas, minimum calls evita decisões prematuras, failure e slow call rates tornam degradação observável, a classificação define o que conta, um breaker dedicado isola cada provider e capacidade, a ordem externa ao retry registra uma operação lógica sem duplicar samples, CallNotPermitted é traduzida para uma falha estável e métricas, eventos e health interno sustentam operação, enquanto bulkhead e fallback continuam controles separados.
```
