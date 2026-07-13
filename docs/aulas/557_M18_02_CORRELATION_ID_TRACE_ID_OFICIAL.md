# 557 - M18.02 - Correlation ID trace ID

## Apresentação da aula

Na aula 556, a `orders-api` passou a produzir logs estruturados.

Os eventos agora podem carregar:

```text
application;

environment;

release_id;

event;

outcome;

duration_ms;

error_type;

message.
```

Essa estrutura resolveu uma parte do problema de diagnóstico.

Entretanto, imagine este fluxo:

```text
cliente envia uma requisição;

orders-api valida o pedido;

serviço chama o banco;

evento é publicado;

consumer processa;

outra operação é iniciada;

uma falha acontece.
```

Os logs podem estar corretos e ainda assim permanecerem desconectados.

Exemplo:

```json
{
  "event": "order.creation.started",
  "order_id": "ord-123"
}
```

Depois:

```json
{
  "event": "database.operation.completed",
  "operation": "order.insert"
}
```

Depois:

```json
{
  "event": "message.processing.failed",
  "error_type": "TimeoutException"
}
```

Sem um contexto comum, o operador precisa tentar reconstruir o fluxo manualmente.

A pergunta central desta aula será:

```text
como conectar
todos os eventos
pertencentes à mesma operação

através de HTTP,
threads,
mensagens
e dependências?
```

Você irá implementar dois identificadores complementares:

```text
correlation ID;

trace ID.
```

O correlation ID será o identificador operacional aceito na borda da aplicação ou criado quando ausente.

Ele será útil para:

- suporte;
- troubleshooting;
- comunicação com consumidores;
- busca em logs;
- integração com sistemas legados;
- devolução ao cliente;
- investigação de incidentes.

O trace ID representará a identidade técnica de um fluxo distribuído.

Ele será útil para:

- relacionar eventos entre serviços;
- preservar compatibilidade com padrões de tracing;
- preparar a aplicação para spans;
- integrar futuramente com OpenTelemetry;
- manter uma identidade comum em requisições e mensagens.

Nesta aula, você irá:

- diferenciar correlation ID e trace ID;
- definir formato;
- validar entrada;
- gerar valores seguros;
- armazenar contexto;
- escrever no MDC;
- incluir em logs estruturados;
- retornar o correlation ID na resposta;
- propagar em chamadas HTTP;
- propagar em mensagens;
- transportar contexto para execução assíncrona;
- limpar o contexto;
- impedir log forging;
- testar isolamento entre requisições;
- testar propagação;
- criar evidence.

A aula não irá aprofundar:

- configuração de endpoints do Actuator;
- exposure de endpoints;
- health groups;
- métricas do Actuator;
- Prometheus;
- exemplars;
- spans completos;
- sampling;
- baggage distribuído;
- collector;
- Jaeger;
- Zipkin;
- Tempo.

A próxima aula oficial será:

```text
558 - M18.03 - Actuator
```

A regra central será:

```text
todo fluxo
precisa receber
uma identidade válida,

propagá-la
sem misturar requisições

e removê-la
ao final.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
555:
Fechamento do Modulo 17.

556:
Logs estruturados.

557:
Correlation ID trace ID.

558:
Actuator.
```

Na aula 556, você criou o evento.

Na aula 557, você irá conectar eventos do mesmo fluxo.

O raciocínio será:

```text
evento estruturado
+
identidade do fluxo
=
busca operacional confiável.
```

Nesta aula:

```text
correlation ID:
sim.

trace ID:
sim.

MDC:
sim.

HTTP inbound:
sim.

HTTP outbound:
sim.

mensageria:
sim.

async:
sim.

limpeza de contexto:
sim.

testes:
sim.

Actuator:
não.

métricas:
não.

spans completos:
não.

collector:
não.
```

A progressão será:

```text
1.
definir semântica.

2.
definir formatos.

3.
criar contexto.

4.
receber em HTTP.

5.
propagar.

6.
isolar threads.

7.
testar.

8.
coletar evidence.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
src/main/java
└── .../observability/context
    ├── CorrelationHeaders.java
    ├── CorrelationContext.java
    ├── CorrelationIdGenerator.java
    ├── TraceIdGenerator.java
    ├── TraceParent.java
    ├── TraceParentParser.java
    ├── CorrelationContextHolder.java
    ├── CorrelationMdc.java
    ├── CorrelationIdFilter.java
    ├── CorrelationTaskDecorator.java
    ├── CorrelationRestClientInterceptor.java
    ├── MessagingCorrelationHeaders.java
    └── CorrelationMessageContext.java

src/main/java
└── .../configuration
    └── CorrelationConfiguration.java

src/test/java
└── .../observability/context
    ├── CorrelationIdGeneratorTest.java
    ├── TraceParentParserTest.java
    ├── CorrelationIdFilterTest.java
    ├── CorrelationTaskDecoratorTest.java
    ├── CorrelationRestClientInterceptorTest.java
    ├── CorrelationMessageContextTest.java
    └── CorrelationIsolationTest.java

observability/context
├── correlation-contract.yaml
├── trace-context-contract.yaml
├── propagation-policy.yaml
├── context-data-classification.yaml
├── context-lifecycle-policy.yaml
├── context-failure-policy.yaml
└── correlation-trace-evidence.yaml

scripts/observability/context
├── validate-correlation-contract.ps1
├── validate-traceparent-format.ps1
├── simulate-http-correlation.ps1
├── simulate-async-context.ps1
├── simulate-message-context.ps1
├── verify-context-isolation.ps1
├── scan-context-output.ps1
├── collect-correlation-trace-evidence.ps1
└── verify-correlation-trace-baseline.ps1

docs/observability/context
├── CORRELATION_ID_AND_TRACE_ID.md
├── HTTP_CONTEXT_PROPAGATION.md
├── ASYNC_CONTEXT_PROPAGATION.md
├── MESSAGE_CONTEXT_PROPAGATION.md
├── CONTEXT_SECURITY.md
├── CONTEXT_TEST_MATRIX.md
└── CONTEXT_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
correlation ID validado;

trace ID validado;

contexto imutável;

MDC controlado;

HTTP inbound instrumentado;

HTTP outbound instrumentado;

threads assíncronas instrumentadas;

mensageria instrumentada;

limpeza garantida;

isolamento testado;

evidence sanitizada.
```

Você irá:

1. revisar a baseline;
2. definir semântica;
3. definir headers;
4. gerar correlation ID;
5. gerar trace ID;
6. interpretar `traceparent`;
7. criar contexto;
8. criar holder;
9. preencher MDC;
10. limpar MDC;
11. criar filtro HTTP;
12. devolver correlation ID;
13. propagar em cliente HTTP;
14. propagar em async;
15. propagar em mensagens;
16. validar entrada;
17. impedir contexto malicioso;
18. evitar ThreadLocal leak;
19. testar isolamento;
20. testar propagação;
21. simular fluxos;
22. coletar evidence;
23. executar gate;
24. commitar;
25. preparar a aula 558.

---

## Conceito essencial

### Correlation ID

Identificador operacional usado para relacionar eventos pertencentes à mesma interação.

---

### Trace ID

Identificador técnico de um trace distribuído.

---

### Span ID

Identificador de uma operação individual dentro de um trace.

Nesta aula, o span ID será apenas reconhecido no formato `traceparent`.

A criação de spans completos não será implementada.

---

### Traceparent

Header padronizado que transporta versão, trace ID, parent ID e flags.

Exemplo:

```text
00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

---

### MDC

Mapa de contexto associado à thread e utilizado pelo sistema de logging.

---

### Context propagation

Transporte explícito do contexto entre bordas e unidades de execução.

---

### Context isolation

Garantia de que uma requisição não reutiliza o contexto de outra.

---

### Inbound context

Contexto recebido pela aplicação.

---

### Outbound context

Contexto enviado para outra dependência.

---

### Context lifecycle

Criação, instalação, propagação, uso e limpeza do contexto.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Inicie com o profile de observabilidade:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability"
```

Confirme:

- logs estruturados;
- application;
- environment;
- release ID;
- catálogo de eventos;
- sanitização;
- nenhum Secret;
- nenhum MDC residual conhecido.

Execute duas requisições.

Observe que ainda não existe uma identidade consistente entre todos os eventos.

Registre o estado anterior.

---

### 2. Diferenciar correlation ID e trace ID

O correlation ID pode ter origem:

- cliente;
- gateway;
- suporte;
- sistema legado;
- aplicação atual.

O trace ID deve respeitar formato técnico estável.

A aplicação não deve presumir que os dois são iguais.

Exemplo:

```text
correlation_id:
ticket-INC-2026-000123.

trace_id:
4bf92f3577b34da6a3ce929d0e0e4736.
```

Em fluxos simples, ambos podem ser gerados juntos.

Mesmo assim, mantenha campos separados.

---

### 3. Definir os headers

Arquivo:

```text
CorrelationHeaders.java
```

Conteúdo:

```java
package com.formacao.orders.observability.context;

public final class CorrelationHeaders {

    public static final String CORRELATION_ID =
            "X-Correlation-Id";

    public static final String TRACE_PARENT =
            "traceparent";

    private CorrelationHeaders() {
    }
}
```

O nome do header de correlation ID não é padronizado universalmente.

O projeto adotará:

```text
X-Correlation-Id.
```

Para tracing, use:

```text
traceparent.
```

Não invente múltiplos aliases sem necessidade.

---

### 4. Criar contrato de correlação

Arquivo:

```text
correlation-contract.yaml
```

Conteúdo:

```yaml
correlation:
  inboundHeader:
    X-Correlation-Id

  responseHeader:
    X-Correlation-Id

  generation:
    whenMissing:
      required

  validation:
    maxLength:
      128

    allowedCharacters:
      alphanumeric-dash-underscore-dot-colon

    controlCharacters:
      forbidden

  logging:
    field:
      correlation_id

  lifecycle:
    cleanup:
      required

  security:
    trustedForAuthorization:
      false
```

Correlation ID nunca deve ser usado como autenticação ou autorização.

---

### 5. Definir contrato de trace context

Arquivo:

```text
trace-context-contract.yaml
```

Conteúdo:

```yaml
trace:
  inboundHeader:
    traceparent

  format:
    version:
      twoHexCharacters

    traceId:
      thirtyTwoHexCharacters

    parentId:
      sixteenHexCharacters

    flags:
      twoHexCharacters

  invalid:
    action:
      generateNewTraceContext

  logging:
    fields:
      - trace_id
      - parent_span_id

  fullSpanCreation:
    deferred
```

Trace ID de todos os zeros é inválido.

Parent ID de todos os zeros também é inválido.

---

### 6. Criar gerador de correlation ID

Arquivo:

```text
CorrelationIdGenerator.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

import java.util.UUID;

public final class CorrelationIdGenerator {

    public String generate() {
        return UUID.randomUUID()
                .toString();
    }
}
```

UUID é suficiente para o laboratório.

Requisitos:

- não sequencial;
- difícil de colidir;
- seguro para logs;
- sem dados pessoais;
- sem significado de negócio.

Não use:

```text
email;

CPF;

telefone;

token;

session ID.
```

---

### 7. Criar gerador de trace ID

Arquivo:

```text
TraceIdGenerator.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

import java.security.SecureRandom;
import java.util.HexFormat;

public final class TraceIdGenerator {

    private static final int TRACE_ID_BYTES = 16;
    private static final int SPAN_ID_BYTES = 8;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public String generateTraceId() {
        return generateNonZeroHex(
                TRACE_ID_BYTES);
    }

    public String generateSpanId() {
        return generateNonZeroHex(
                SPAN_ID_BYTES);
    }

    private String generateNonZeroHex(int size) {
        var bytes = new byte[size];

        do {
            secureRandom.nextBytes(bytes);
        } while (allZero(bytes));

        return HexFormat.of()
                .formatHex(bytes);
    }

    private boolean allZero(byte[] bytes) {
        for (byte value : bytes) {
            if (value != 0) {
                return false;
            }
        }

        return true;
    }
}
```

O trace ID possui 16 bytes.

O span ID possui 8 bytes.

---

### 8. Modelar `TraceParent`

Arquivo:

```text
TraceParent.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

public record TraceParent(
        String version,
        String traceId,
        String parentId,
        String flags) {

    public String headerValue() {
        return String.join(
                "-",
                version,
                traceId,
                parentId,
                flags);
    }
}
```

O record representa o valor validado.

Não armazene o header bruto depois da validação.

---

### 9. Criar parser de `traceparent`

Arquivo:

```text
TraceParentParser.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

import java.util.Optional;
import java.util.regex.Pattern;

public final class TraceParentParser {

    private static final Pattern PATTERN =
            Pattern.compile(
                    "^(?<version>[0-9a-f]{2})-"
                    + "(?<traceId>[0-9a-f]{32})-"
                    + "(?<parentId>[0-9a-f]{16})-"
                    + "(?<flags>[0-9a-f]{2})$");

    public Optional<TraceParent> parse(
            String headerValue) {

        if (headerValue == null
                || headerValue.isBlank()) {
            return Optional.empty();
        }

        var matcher = PATTERN.matcher(
                headerValue.trim().toLowerCase());

        if (!matcher.matches()) {
            return Optional.empty();
        }

        var traceId = matcher.group("traceId");
        var parentId = matcher.group("parentId");

        if (isAllZero(traceId)
                || isAllZero(parentId)) {
            return Optional.empty();
        }

        return Optional.of(
                new TraceParent(
                        matcher.group("version"),
                        traceId,
                        parentId,
                        matcher.group("flags")));
    }

    private boolean isAllZero(String value) {
        return value.chars()
                .allMatch(character ->
                        character == '0');
    }
}
```

Nesta aula, versões não suportadas devem ser rejeitadas conforme a política do projeto.

Não aceite conteúdo arbitrário apenas porque contém hífens.

---

### 10. Criar contexto imutável

Arquivo:

```text
CorrelationContext.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

public record CorrelationContext(
        String correlationId,
        String traceId,
        String parentSpanId,
        String currentSpanId,
        String traceFlags) {

    public String traceParentValue() {
        return String.join(
                "-",
                "00",
                traceId,
                currentSpanId,
                traceFlags);
    }
}
```

O contexto representa:

- correlation ID operacional;
- trace ID do fluxo;
- parent span recebido;
- current span local;
- flags.

A implementação de spans reais ficará para uma etapa futura de tracing.

---

### 11. Criar política de validação

Valores de entrada devem aceitar apenas:

```text
A-Z;

a-z;

0-9;

hífen;

underscore;

ponto;

dois-pontos.
```

Limite:

```text
128 caracteres.
```

Rejeite:

- quebra de linha;
- tab;
- espaços;
- caracteres de controle;
- valor excessivo;
- JSON;
- HTML;
- header concatenado;
- valor com token.

Quando inválido:

```text
gere novo correlation ID.
```

Não devolva o valor malicioso.

---

### 12. Criar holder do contexto

Arquivo:

```text
CorrelationContextHolder.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

import java.util.Optional;

public final class CorrelationContextHolder {

    private static final ThreadLocal<CorrelationContext>
            CONTEXT =
            new ThreadLocal<>();

    private CorrelationContextHolder() {
    }

    public static void set(
            CorrelationContext context) {

        CONTEXT.set(context);
    }

    public static Optional<CorrelationContext>
            current() {

        return Optional.ofNullable(
                CONTEXT.get());
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
```

`ThreadLocal` exige limpeza.

Um pool reutiliza threads.

Sem `remove()`, uma requisição pode herdar o contexto anterior.

---

### 13. Criar integração com MDC

Arquivo:

```text
CorrelationMdc.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

import org.slf4j.MDC;

public final class CorrelationMdc {

    public static final String CORRELATION_ID =
            "correlation_id";

    public static final String TRACE_ID =
            "trace_id";

    public static final String SPAN_ID =
            "span_id";

    public void install(
            CorrelationContext context) {

        MDC.put(
                CORRELATION_ID,
                context.correlationId());

        MDC.put(
                TRACE_ID,
                context.traceId());

        MDC.put(
                SPAN_ID,
                context.currentSpanId());
    }

    public void clear() {
        MDC.remove(CORRELATION_ID);
        MDC.remove(TRACE_ID);
        MDC.remove(SPAN_ID);
    }
}
```

A configuração de logs estruturados precisa incluir esses campos quando presentes.

---

### 14. Criar factory do contexto

Centralize a criação.

Fluxo:

```text
validar correlation ID;

interpretar traceparent;

gerar trace ID quando ausente;

gerar current span ID;

criar contexto.
```

Exemplo conceitual:

```java
public CorrelationContext create(
        String correlationHeader,
        String traceParentHeader) {

    var correlationId =
            validator.isValid(correlationHeader)
                    ? correlationHeader
                    : correlationIdGenerator.generate();

    var receivedTraceParent =
            traceParentParser.parse(
                    traceParentHeader);

    var traceId = receivedTraceParent
            .map(TraceParent::traceId)
            .orElseGet(
                    traceIdGenerator::generateTraceId);

    var parentId = receivedTraceParent
            .map(TraceParent::parentId)
            .orElse("0000000000000000");

    var flags = receivedTraceParent
            .map(TraceParent::flags)
            .orElse("01");

    return new CorrelationContext(
            correlationId,
            traceId,
            parentId,
            traceIdGenerator.generateSpanId(),
            flags);
}
```

O parent ID interno ausente pode ser representado separadamente.

Evite emitir um `traceparent` outbound com parent ID zero.

---

### 15. Criar filtro HTTP

Arquivo:

```text
CorrelationIdFilter.java
```

Use `OncePerRequestFilter`.

Fluxo:

```java
@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

    var context = contextFactory.create(
            request.getHeader(
                    CorrelationHeaders.CORRELATION_ID),
            request.getHeader(
                    CorrelationHeaders.TRACE_PARENT));

    try {
        CorrelationContextHolder.set(context);
        correlationMdc.install(context);

        response.setHeader(
                CorrelationHeaders.CORRELATION_ID,
                context.correlationId());

        filterChain.doFilter(
                request,
                response);
    } finally {
        correlationMdc.clear();
        CorrelationContextHolder.clear();
    }
}
```

O `finally` é obrigatório.

Ele executa também quando:

- controller falha;
- validação falha;
- resposta é interrompida;
- exception handler atua.

---

### 16. Registrar evento de entrada

Após instalar o contexto, o log estruturado pode conter:

```text
event:
http.request.received.

correlation_id:
...

trace_id:
...

span_id:
...
```

Evite registrar:

- query string completa;
- Authorization;
- Cookie;
- body;
- headers completos.

O filtro de correlation não precisa virar um access log completo.

---

### 17. Retornar correlation ID

O response header permite que o cliente informe:

```text
X-Correlation-Id:
...
```

em uma solicitação de suporte.

O trace ID pode permanecer interno conforme política.

Quando for devolvido, documente o header.

Nunca trate o correlation ID como segredo.

Mesmo assim, não permita que ele revele dados pessoais.

---

### 18. Propagar em cliente HTTP

Arquivo:

```text
CorrelationRestClientInterceptor.java
```

Exemplo para cliente HTTP compatível:

```java
public void apply(HttpHeaders headers) {
    CorrelationContextHolder.current()
            .ifPresent(context -> {
                headers.set(
                        CorrelationHeaders.CORRELATION_ID,
                        context.correlationId());

                headers.set(
                        CorrelationHeaders.TRACE_PARENT,
                        context.traceParentValue());
            });
}
```

Quando uma nova operação outbound representa um novo span, gere um novo current span ID.

Sem tracer completo, documente a limitação.

O trace ID permanece o mesmo.

---

### 19. Não propagar headers cegamente

Headers recebidos do cliente não devem ser copiados em bloco.

Propague apenas:

- correlation ID validado;
- traceparent reconstruído;
- contexto explicitamente permitido.

Não propague:

- Authorization de entrada para destino diferente;
- Cookie;
- IP;
- headers internos desconhecidos;
- baggage arbitrário;
- valores não validados.

---

### 20. Propagar para execução assíncrona

Pools de threads não herdam `ThreadLocal` com segurança.

Crie:

```text
CorrelationTaskDecorator.java
```

Exemplo:

```java
package com.formacao.orders.observability.context;

import org.springframework.core.task.TaskDecorator;

public final class CorrelationTaskDecorator
        implements TaskDecorator {

    private final CorrelationMdc correlationMdc;

    public CorrelationTaskDecorator(
            CorrelationMdc correlationMdc) {

        this.correlationMdc = correlationMdc;
    }

    @Override
    public Runnable decorate(Runnable task) {
        var captured =
                CorrelationContextHolder.current()
                        .orElse(null);

        return () -> {
            try {
                if (captured != null) {
                    CorrelationContextHolder.set(
                            captured);

                    correlationMdc.install(
                            captured);
                }

                task.run();
            } finally {
                correlationMdc.clear();
                CorrelationContextHolder.clear();
            }
        };
    }
}
```

O contexto é capturado no momento da submissão.

---

### 21. Configurar executor

Arquivo:

```text
CorrelationConfiguration.java
```

Exemplo conceitual:

```java
@Bean
TaskExecutor applicationTaskExecutor(
        CorrelationMdc correlationMdc) {

    var executor =
            new ThreadPoolTaskExecutor();

    executor.setCorePoolSize(4);
    executor.setMaxPoolSize(8);
    executor.setQueueCapacity(100);

    executor.setTaskDecorator(
            new CorrelationTaskDecorator(
                    correlationMdc));

    executor.setThreadNamePrefix(
            "orders-async-");

    executor.initialize();

    return executor;
}
```

Não aplique o decorator apenas em um executor e use outro sem perceber.

Documente qual executor atende `@Async`.

---

### 22. Evitar propagação de contexto obsoleto

O decorator precisa limpar:

- holder;
- MDC;
- valores anteriores da thread.

Teste:

```text
task A
usa correlation A.

task B
usa correlation B.

task sem contexto
não herda A nem B.
```

Esse cenário é obrigatório.

---

### 23. Propagar em mensageria

Arquivo:

```text
MessagingCorrelationHeaders.java
```

Headers lógicos:

```text
correlation_id;

traceparent.
```

Ao publicar:

```java
headers.put(
        "correlation_id",
        context.correlationId());

headers.put(
        "traceparent",
        context.traceParentValue());
```

Ao consumir:

1. leia;
2. valide;
3. crie novo contexto;
4. instale;
5. processe;
6. registre;
7. limpe em `finally`.

Não confie no header apenas porque veio do broker.

---

### 24. Criar contexto de mensagem

Arquivo:

```text
CorrelationMessageContext.java
```

Responsabilidades:

- decodificar header;
- validar tamanho;
- validar caracteres;
- interpretar traceparent;
- gerar contexto quando ausente;
- instalar holder;
- instalar MDC;
- executar callback;
- limpar.

Exemplo conceitual:

```java
public void runWithContext(
        MessageHeaders headers,
        Runnable operation) {

    var context = factory.create(
            readCorrelationId(headers),
            readTraceParent(headers));

    try {
        CorrelationContextHolder.set(context);
        correlationMdc.install(context);
        operation.run();
    } finally {
        correlationMdc.clear();
        CorrelationContextHolder.clear();
    }
}
```

---

### 25. Separar correlation ID de business ID

Não use:

```text
order_id
como correlation_id.
```

Um pedido pode participar de vários fluxos:

- criação;
- pagamento;
- cancelamento;
- reprocessamento;
- suporte.

Um fluxo pode envolver vários pedidos.

Registre ambos:

```text
correlation_id;

order_id.
```

---

### 26. Criar política de lifecycle

Arquivo:

```text
context-lifecycle-policy.yaml
```

Conteúdo:

```yaml
lifecycle:
  inbound:
    validate:
      required

  create:
    whenMissing:
      required

  install:
    holder:
      required

    mdc:
      required

  propagate:
    http:
      allowlistedHeaders

    async:
      taskDecorator

    messaging:
      explicitHeaders

  cleanup:
    finally:
      required

  reuseAcrossRequests:
    forbidden
```

O lifecycle precisa ser simétrico.

Instalar sem limpar é defeito.

---

### 27. Criar classificação dos dados de contexto

Arquivo:

```text
context-data-classification.yaml
```

Conteúdo:

```yaml
context:
  correlationId:
    classification:
      internal

    personalData:
      forbidden

  traceId:
    classification:
      internal

  spanId:
    classification:
      internal

  authorization:
    classification:
      restricted

    propagation:
      forbiddenByCorrelationComponent

  baggage:
    support:
      notEnabled
```

Não coloque dados de usuário em baggage ou IDs.

---

### 28. Criar política de falha

Arquivo:

```text
context-failure-policy.yaml
```

Regras:

```yaml
failure:
  invalidCorrelationId:
    action:
      generate-new

    log:
      sanitized-warning

  invalidTraceparent:
    action:
      start-new-trace

    log:
      sanitized-debug-or-warn

  missingContextInOutbound:
    action:
      generate-or-block-by-boundary-policy

  mdcInstallationFailure:
    action:
      continue-with-minimal-safe-log

  cleanupFailure:
    action:
      operational-error
```

Não rejeite toda requisição apenas porque o correlation ID é inválido.

Gere um novo valor seguro.

---

### 29. Registrar valores inválidos com cuidado

Não registre o valor bruto.

Exemplo:

```java
log.atWarn()
        .addKeyValue(
                "event",
                "correlation.input.rejected")
        .addKeyValue(
                "outcome",
                "rejected")
        .addKeyValue(
                "reason",
                "invalid_format")
        .log("Inbound correlation identifier rejected");
```

Não inclua o header malicioso.

---

### 30. Atualizar logs estruturados

Inclua no contrato da aula 556:

```text
correlation_id;

trace_id;

span_id.
```

Esses campos são:

```text
obrigatórios
quando o contexto está instalado.
```

Eventos de startup podem não possuir contexto de requisição.

Não invente correlation ID global para startup.

---

### 31. Testar o parser

Arquivo:

```text
TraceParentParserTest.java
```

Cenários:

- valor válido;
- letras maiúsculas normalizadas conforme política;
- trace ID zero;
- parent ID zero;
- tamanho incorreto;
- campo extra;
- caracteres inválidos;
- `null`;
- blank;
- versão não suportada;
- flags válidas.

Teste o header como contrato, não apenas regex.

---

### 32. Testar o filtro HTTP

Arquivo:

```text
CorrelationIdFilterTest.java
```

Cenários:

- correlation ID válido é preservado;
- correlation ID ausente é gerado;
- correlation ID inválido é substituído;
- traceparent válido preserva trace ID;
- traceparent inválido inicia novo trace;
- response possui header;
- MDC existe durante o chain;
- holder existe durante o chain;
- contexto é limpo após sucesso;
- contexto é limpo após exceção.

---

### 33. Testar isolamento entre requisições

Arquivo:

```text
CorrelationIsolationTest.java
```

Execute duas chamadas em sequência usando a mesma thread simulada.

Confirme:

```text
primeira:
correlation A.

segunda:
correlation B.

depois:
holder vazio.

MDC vazio.
```

Esse teste protege contra vazamento de contexto.

---

### 34. Testar async

Arquivo:

```text
CorrelationTaskDecoratorTest.java
```

Cenários:

- contexto é capturado;
- MDC é instalado;
- tarefa registra valores corretos;
- limpeza ocorre;
- tarefa sem contexto permanece vazia;
- erro na tarefa não impede cleanup;
- duas tarefas não se misturam.

---

### 35. Testar HTTP outbound

Arquivo:

```text
CorrelationRestClientInterceptorTest.java
```

Valide:

- header de correlation;
- traceparent válido;
- mesmo trace ID;
- novo span ID;
- ausência de headers proibidos;
- ausência de contexto;
- nenhum valor malicioso.

---

### 36. Testar mensageria

Arquivo:

```text
CorrelationMessageContextTest.java
```

Cenários:

- headers válidos;
- correlation ausente;
- traceparent ausente;
- traceparent inválido;
- mensagem processada;
- exceção;
- retry;
- cleanup;
- duas mensagens na mesma thread.

Retry pode manter correlation ID do fluxo.

A política de span pode criar nova operação local.

---

### 37. Simular HTTP

Script:

```text
simulate-http-correlation.ps1
```

Fluxos:

```powershell
$correlationId = "support-case-123"

Invoke-WebRequest `
  -Uri `
  http://localhost:8080/orders `
  -Headers @{
    "X-Correlation-Id" = $correlationId
  }
```

Confirme:

- response header;
- logs com correlation;
- trace ID;
- span ID;
- nenhum valor não validado.

Depois execute sem header.

Depois execute com quebra de linha simulada em teste controlado, não em terminal que rejeite a entrada.

---

### 38. Simular async

Script:

```text
simulate-async-context.ps1
```

O cenário precisa mostrar:

```text
request thread;

async thread;

mesmo correlation ID;

mesmo trace ID;

contexto limpo depois.
```

O nome da thread pode mudar.

A identidade do fluxo permanece.

---

### 39. Simular mensagem

Script:

```text
simulate-message-context.ps1
```

Valide:

- producer envia headers;
- consumer recebe;
- logs compartilham correlation;
- trace ID permanece;
- span local muda conforme política;
- retry não mistura mensagens;
- cleanup ocorre.

Use mensagens fictícias.

---

### 40. Verificar isolamento

Script:

```text
verify-context-isolation.ps1
```

Execute vários fluxos concorrentes.

Para cada correlation ID, verifique:

- nenhum evento com correlation de outro fluxo;
- nenhum trace ID trocado;
- nenhuma thread mantém contexto depois;
- nenhum header inválido aparece;
- nenhum valor nulo inesperado.

Resultado:

```text
CONTEXT_ISOLATION_APPROVED
ou
CONTEXT_ISOLATION_BLOCKED.
```

---

### 41. Escanear o output

Script:

```text
scan-context-output.ps1
```

Procure:

- quebra de linha;
- tab;
- Authorization;
- Cookie;
- token;
- senha;
- CPF;
- email completo;
- correlation maior que o limite;
- trace ID fora do formato;
- span ID fora do formato;
- IDs iguais entre fluxos independentes.

Amostras ficam em:

```text
target/observability/context.
```

Não versione.

---

### 42. Criar matriz de testes

Arquivo:

```text
CONTEXT_TEST_MATRIX.md
```

Cenários:

- inbound correlation válido;
- inbound ausente;
- inbound inválido;
- traceparent válido;
- traceparent inválido;
- trace ID zero;
- parent ID zero;
- response header;
- logs estruturados;
- success cleanup;
- exception cleanup;
- async propagation;
- async isolation;
- HTTP outbound;
- message producer;
- message consumer;
- message retry;
- concurrent requests;
- no context startup;
- no sensitive values.

---

### 43. Criar troubleshooting

Arquivo:

```text
CONTEXT_TROUBLESHOOTING.md
```

Inclua:

- correlation ausente no log;
- response sem header;
- traceparent inválido;
- IDs trocados;
- async perde contexto;
- consumer herda mensagem anterior;
- MDC permanece após resposta;
- dois filtros criam IDs diferentes;
- proxy remove header;
- cliente duplica header;
- logs possuem correlation e trace divergentes;
- header malicioso aparece;
- span ID não muda em outbound;
- contexto global usado indevidamente.

---

### 44. Coletar evidence

Script:

```text
collect-correlation-trace-evidence.ps1
```

Arquivo:

```text
correlation-trace-evidence.json.
```

Campos permitidos:

- lesson;
- application;
- environment;
- correlation header;
- traceparent status;
- inbound validation status;
- response propagation status;
- HTTP outbound status;
- async propagation status;
- messaging propagation status;
- isolation status;
- cleanup status;
- sensitive scan status;
- tests status;
- timestamp.

Não inclua:

- headers completos;
- Authorization;
- Cookie;
- payload;
- dados pessoais;
- logs completos.

---

### 45. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\context\validate-correlation-contract.ps1

.\scripts\observability\context\validate-traceparent-format.ps1

.\scripts\observability\context\simulate-http-correlation.ps1

.\scripts\observability\context\simulate-async-context.ps1

.\scripts\observability\context\simulate-message-context.ps1

.\scripts\observability\context\verify-context-isolation.ps1

.\scripts\observability\context\scan-context-output.ps1

.\scripts\observability\context\collect-correlation-trace-evidence.ps1

.\scripts\observability\context\verify-correlation-trace-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- correlation ID validado;
- traceparent validado;
- trace ID gerado;
- MDC instalado;
- response header presente;
- HTTP outbound propagado;
- async propagado;
- mensageria propagada;
- cleanup aprovado;
- isolamento aprovado;
- nenhum Secret;
- nenhum dado pessoal;
- Actuator não antecipado.

---

## Entendendo o que foi feito

### Eventos ganharam ligação

Logs pertencentes ao mesmo fluxo passaram a ser consultáveis juntos.

### Correlation ID ganhou função operacional

Suporte e troubleshooting passaram a compartilhar uma referência.

### Trace ID ganhou formato técnico

O fluxo ficou preparado para tracing padronizado.

### O contexto ganhou lifecycle

Criação, instalação, propagação e limpeza foram explicitadas.

### O MDC ganhou controle

Campos foram adicionados sem depender de parâmetros repetidos em cada log.

### HTTP ganhou continuidade

Entrada, resposta e saída passaram a transportar contexto validado.

### Async ganhou propagação explícita

Pools deixaram de depender de herança acidental.

### Mensageria ganhou contexto

Producer e consumer passaram a compartilhar a identidade do fluxo.

### Segurança ganhou validação

Headers arbitrários deixaram de entrar diretamente nos logs.

### Isolamento ganhou testes

Thread reuse passou a ser tratado como risco real.

---

## Erros comuns importantes

### Usar correlation ID como autenticação

O valor é contexto, não credencial.

### Usar order ID como correlation ID

Business ID e flow ID possuem semânticas diferentes.

### Aceitar qualquer header

Log forging e valores excessivos entram no sistema.

### Esquecer o `finally`

Threads reutilizadas vazam contexto.

### Presumir que `ThreadLocal` atravessa async

O contexto desaparece ou fica incorreto.

### Copiar todos os headers outbound

Credenciais e dados internos podem vazar.

### Registrar o header inválido

O conteúdo malicioso volta ao log.

### Criar novo trace ID em cada camada

O fluxo deixa de ser correlacionável.

### Reutilizar o mesmo span ID em tudo

Operações distintas perdem identidade.

### Antecipar Actuator

A configuração operacional de endpoints pertence à aula 558.

---

## Comandos úteis

### Executar testes

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Simular HTTP

```powershell
.\scripts\observability\context\simulate-http-correlation.ps1
```

### Simular async

```powershell
.\scripts\observability\context\simulate-async-context.ps1
```

### Simular mensageria

```powershell
.\scripts\observability\context\simulate-message-context.ps1
```

### Verificar isolamento

```powershell
.\scripts\observability\context\verify-context-isolation.ps1
```

---

## Exercício guiado

### Parte 1 — Semântica

Diferencie correlation, trace e business IDs.

### Parte 2 — Format

Valide correlation e traceparent.

### Parte 3 — Context

Crie record, holder e MDC.

### Parte 4 — HTTP inbound

Instale contexto e devolva header.

### Parte 5 — HTTP outbound

Propague allowlist de headers.

### Parte 6 — Async

Use TaskDecorator e cleanup.

### Parte 7 — Messaging

Propague headers explícitos.

### Parte 8 — Security

Rejeite valores maliciosos.

### Parte 9 — Isolation

Execute fluxos concorrentes.

### Parte 10 — Evidence

Simule, escaneie e aprove.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 556 e ponte para a aula 558 foram preservadas;
- correlation ID e trace ID foram diferenciados;
- span ID foi apresentado sem implementar tracing completo;
- headers `X-Correlation-Id` e `traceparent` foram definidos;
- contrato de correlation foi criado;
- contrato de trace context foi criado;
- correlation ID possui limite e caracteres permitidos;
- correlation ID inválido é substituído;
- correlation ID não é usado em autorização;
- traceparent possui version, trace ID, parent ID e flags;
- trace ID zero é rejeitado;
- parent ID zero é rejeitado;
- geradores usam valores aleatórios seguros;
- contexto é imutável;
- holder usa ThreadLocal com cleanup;
- MDC recebe correlation, trace e span;
- filtro usa `OncePerRequestFilter`;
- response devolve correlation ID;
- `finally` limpa holder e MDC;
- HTTP outbound propaga somente headers permitidos;
- traceparent outbound é reconstruído;
- async usa TaskDecorator;
- tarefas sem contexto não herdam valores;
- mensageria usa headers explícitos;
- consumer valida contexto recebido;
- business ID não substitui correlation ID;
- lifecycle policy foi criada;
- data classification foi criada;
- failure policy foi criada;
- valores inválidos não são registrados;
- logs estruturados incluem contexto quando disponível;
- startup não recebe correlation ID artificial;
- parser possui testes;
- filtro possui testes;
- cleanup após sucesso e exceção foi testado;
- isolamento entre requisições foi testado;
- async foi testado;
- HTTP outbound foi testado;
- mensageria e retry foram testados;
- simulações HTTP, async e mensagem foram criadas;
- concorrência foi verificada;
- output foi escaneado;
- troubleshooting e test matrix foram criados;
- evidence é sanitizada;
- nenhum Secret ou dado pessoal foi utilizado;
- endpoints e configuração de Actuator não foram antecipados;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/context `
  scripts/observability/context `
  docs/observability/context `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|BEGIN PRIVATE KEY|cookie"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): propagar correlation ID e trace ID"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- logs completos;
- headers reais;
- Authorization;
- Cookie;
- payloads;
- dados pessoais;
- Secret;
- configuração da aula 558;
- endpoints do Actuator.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os eventos estruturados passaram a compartilhar uma identidade de fluxo.

A aplicação passou a trabalhar com:

```text
correlation_id;

trace_id;

span_id;

X-Correlation-Id;

traceparent;

MDC;

context holder;

propagation;

cleanup;

isolation.
```

Você comprovou que correlation ID e trace ID possuem objetivos complementares; business IDs não substituem IDs de fluxo; headers de entrada precisam ser validados; traceparent possui formato técnico; valores inválidos iniciam contexto seguro; MDC precisa ser instalado e limpo; `ThreadLocal` não atravessa async automaticamente; TaskDecorator precisa capturar e limpar; HTTP outbound não pode copiar headers cegamente; mensageria precisa carregar contexto explícito; retries não podem misturar mensagens; e testes de isolamento são obrigatórios quando threads são reutilizadas.

A próxima aula será:

```text
558 - M18.03 - Actuator
```

Nela, você irá configurar e proteger endpoints operacionais da aplicação, revisar exposure, health, info e comportamento por ambiente.

Nenhuma configuração completa de Actuator, exposure de endpoints ou laboratório específico da aula 558 foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei correlation ID e trace ID.
- [ ] Validei correlation e traceparent.
- [ ] Criei contexto, holder e MDC.
- [ ] Instrumentei HTTP inbound e outbound.
- [ ] Propaguei em async e mensageria.
- [ ] Garanti cleanup em `finally`.
- [ ] Testei isolamento e concorrência.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### Correlation ID não aparece no log

Revise ordem do filtro, MDC e configuração do encoder.

### Response não possui header

Confirme que o filtro executa antes do controller.

### Traceparent é sempre substituído

Revise regex, versão, case e IDs zero.

### Async perde contexto

Confirme o executor realmente usado pelo `@Async`.

### Consumer mistura mensagens

Limpe contexto em `finally` e teste thread reuse.

### Dois filtros geram IDs diferentes

Mantenha uma única borda responsável pela criação.

### Proxy remove `X-Correlation-Id`

Documente a allowlist e valide no gateway.

### Trace ID muda em chamada outbound

Preserve trace ID e altere apenas o span local.

### Valor inválido aparece no log

Não registre o header bruto.

### Endpoints do Actuator apareceram

Preserve esse conteúdo para a aula 558.

---

## Perguntas de revisão

1. O que é correlation ID?
2. O que é trace ID?
3. O que é span ID?
4. O que transporta `traceparent`?
5. Por que separar business ID?
6. Como validar correlation ID?
7. O que fazer quando ele é inválido?
8. Por que usar MDC?
9. Qual risco existe no ThreadLocal?
10. Por que usar `finally`?
11. Como propagar em HTTP outbound?
12. Por que não copiar todos os headers?
13. Como propagar em async?
14. Como propagar em mensagens?
15. O que acontece em retry?
16. Como testar isolamento?
17. Por que não registrar header inválido?
18. O que não foi implementado nesta aula?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Identidade operacional do fluxo.
2. Identidade técnica do trace.
3. Identidade de uma operação.
4. Version, trace, parent e flags.
5. Semânticas diferentes.
6. Tamanho e caracteres.
7. Gerar novo valor.
8. Incluir contexto nos logs.
9. Vazamento entre threads reutilizadas.
10. Garantir limpeza.
11. Headers reconstruídos e permitidos.
12. Evitar vazamento.
13. TaskDecorator.
14. Headers explícitos.
15. Preservar fluxo e isolar operação.
16. Requisições e tarefas concorrentes.
17. Evitar log forging.
18. Spans completos e collector.
19. Actuator.
20. Actuator.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 557 - M18.02 - Correlation ID trace ID

- Continuei após Logs estruturados.
- Diferenciei correlation ID, trace ID, span ID e business ID.
- Defini os headers `X-Correlation-Id` e `traceparent`.
- Criei contrato de validação e propagação.
- Implementei gerador seguro de correlation ID.
- Implementei geradores de trace ID e span ID.
- Modelei e validei o formato `traceparent`.
- Rejeitei trace ID e parent ID formados apenas por zeros.
- Criei contexto imutável.
- Criei holder baseado em ThreadLocal.
- Integrei correlation, trace e span ao MDC.
- Implementei filtro HTTP com cleanup em `finally`.
- Devolvi correlation ID no response.
- Propaguei contexto em chamadas HTTP outbound.
- Evitei cópia indiscriminada de headers.
- Propaguei contexto em execução assíncrona com TaskDecorator.
- Propaguei contexto em producer e consumer de mensageria.
- Separei IDs de fluxo e IDs de negócio.
- Criei lifecycle, data classification e failure policy.
- Evitei registrar headers inválidos.
- Testei parser, filtro, async, outbound e mensageria.
- Testei isolamento entre requisições e mensagens.
- Simulei HTTP, async e mensageria.
- Escaneei o output e coletei evidence sanitizada.
- Não antecipei a configuração do Actuator.
- Próxima aula: Actuator.
```

---

## Referência técnica curta

- Correlation Identifiers.
- W3C Trace Context.
- `traceparent`.
- SLF4J MDC.
- Spring `OncePerRequestFilter`.
- Spring `TaskDecorator`.
- HTTP Context Propagation.
- Messaging Header Propagation.
- ThreadLocal Lifecycle.
- Context Isolation Testing.

Regra final:

```text
correlation ID e trace ID precisam conectar eventos sem criar vazamento entre fluxos: X-Correlation-Id é validado, limitado, seguro para logs e nunca usado como credencial, enquanto traceparent transporta version, trace ID, parent ID e flags em formato controlado; IDs ausentes ou inválidos geram contexto novo, o contexto imutável é instalado em holder e MDC, devolvido na resposta e propagado somente por headers permitidos; HTTP outbound preserva o trace ID e cria operação local, execução assíncrona usa TaskDecorator, mensageria carrega headers explícitos e consumers validam novamente; cada instalação possui cleanup em finally, threads reutilizadas não podem herdar contexto anterior, valores maliciosos não são registrados e testes cobrem sucesso, exceção, concorrência, retry e isolamento; spans completos, tracing distribuído e configuração do Actuator permanecem fora do escopo, deixando para a aula 558 os endpoints operacionais da aplicação.
```
