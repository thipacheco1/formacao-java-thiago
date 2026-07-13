# 493 - M16.38 - Logs de correlacao em integracoes

## Apresentação da aula

Na aula 492, você transformou replay em uma operação controlada.

Cada execução passou a possuir:

```text
runId;

topic;

partition;

offset;

range;

checkpoint;

status;

auditoria.
```

Antes disso, a formação construiu uma cadeia completa de integração:

```text
HTTP request;

domínio;

Outbox;

Kafka;

Inbox;

worker;

projeção;

replay.
```

Quando essa cadeia falha, uma pergunta aparece imediatamente:

```text
quais logs pertencem
à mesma jornada?
```

Considere um pedido que percorre:

```text
POST /orders;

transação local;

registro outbox;

polling publisher;

Kafka topic;

consumer;

inbox;

worker;

projeção.
```

Cada etapa pode executar:

- em thread diferente;
- em instante diferente;
- em processo diferente;
- em serviço diferente;
- depois de um restart;
- durante um retry;
- durante uma redelivery;
- durante um replay.

Sem uma identidade propagada, a investigação vira uma busca por:

- horário aproximado;
- orderId;
- texto da exception;
- nome da thread;
- offsets;
- tentativa;
- hipótese.

A pergunta central desta aula será:

```text
como conectar os logs
de uma integração distribuída

sem depender apenas
de timestamps ou payloads?
```

A solução será construída com quatro identidades:

```text
correlationId;

messageId;

causationId;

replayRunId.
```

A responsabilidade será:

```text
correlationId:
jornada distribuída.

messageId:
interação atual.

causationId:
mensagem causadora.

replayRunId:
execução de reprocessamento.
```

Exemplo:

```text
HTTP request:

correlationId = C-1;
messageId = H-1;
causationId = ausente.

evento OrderCreated:

correlationId = C-1;
messageId = E-1;
causationId = H-1.

consumer:

correlationId = C-1;
messageId = E-1;
causationId = H-1.

evento ProjectionUpdated:

correlationId = C-1;
messageId = E-2;
causationId = E-1.
```

O `correlationId` atravessa a jornada, cada interação recebe outro `messageId` e o `causationId` mantém a cadeia causal.

Durante um replay:

```text
correlationId:
continua pertencendo ao evento original.

messageId:
continua pertencendo ao evento original.

replayRunId:
identifica a execução histórica.

topic, partition e offset:
identificam a posição processada.
```

A implementação utilizará SLF4J, MDC, HTTP, Kafka, Outbox, Inbox e testes.

MDC significa:

```text
Mapped Diagnostic Context.
```

Ele associa campos ao contexto da thread atual.

Os logs passam a incluir automaticamente:

```text
correlationId;

messageId;

causationId;

replayRunId;

topic;

partition;

offset.
```

Mas existe um risco importante:

```text
MDC é baseado em thread.
```

Se o contexto não for limpo, uma requisição pode herdar IDs da anterior.

Se o trabalho mudar de thread, os IDs podem desaparecer.

Por isso, a aula implementará:

- abertura explícita de escopo;
- restauração do contexto anterior;
- limpeza em `finally`;
- propagação para executors;
- escopo específico para listeners;
- testes contra vazamento.

A aula também diferenciará correlação de tracing: `correlationId` identifica a jornada lógica, enquanto `traceId` e `spanId` pertencem à instrumentação distribuída. Eles coexistem.

Nesta aula, não serão instalados:

- OpenTelemetry;
- Micrometer Tracing;
- Zipkin;
- Jaeger;
- Tempo;
- collector;
- agente;
- backend de logs.

Esses temas pertencem à observabilidade e ao monitoramento das próximas etapas.

O objetivo é produzir logs seguros.

A próxima aula será `494 - M16.39 - Monitoramento de integracoes`.

Ao final, você deverá explicar:

```text
por que correlationId
não substitui messageId;

por que causationId
reconstrói a cadeia;

por que eventId
pode ser usado como messageId;

por que MDC precisa
ser limpo e restaurado;

por que headers precisam
de validação;

por que payload
não pertence ao MDC;

como HTTP, Outbox,
Kafka, Inbox e replay
preservam contexto;

por que logs correlacionados
não substituem métricas e tracing.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
491:
CDC conceitual.

492:
Reprocessamento seguro.

493:
Logs de correlacao em integracoes.

494:
Monitoramento de integracoes.

495:
Testes de integracao de ponta a ponta.
```

A aula 492 respondeu:

```text
como reprocessar
um range histórico
com segurança?
```

A aula 493 responderá:

```text
como localizar
todas as operações
de uma mesma jornada?
```

Nesta aula:

```text
correlationId:
sim.

messageId:
sim.

causationId:
sim.

replayRunId:
sim.

MDC:
sim.

HTTP ingress:
sim.

HTTP egress:
sim.

Outbox:
sim.

Kafka headers:
sim.

Kafka listener:
sim.

Inbox:
sim.

replay:
sim.

threads assíncronas:
sim.

logs estruturados:
sim.

payload em log:
não.

Tracing distribuído:
não.

métricas:
não aprofundadas.

alertas:
não aprofundados.

monitoramento:
não antecipado.
```

A regra central será:

```text
o contexto precisa
ser propagado explicitamente

e limpo em toda fronteira
de execução.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/kafka
└── correlation
    ├── CorrelationContext.java
    ├── CorrelationHeaders.java
    ├── CorrelationMetadata.java
    ├── CorrelationScope.java
    ├── CorrelationValuePolicy.java
    ├── http
    │   ├── CorrelationHttpFilter.java
    │   └── CorrelationRestClientConfiguration.java
    ├── kafka
    │   ├── KafkaCorrelationExtractor.java
    │   └── KafkaCorrelationHeadersWriter.java
    └── task
        └── MdcTaskDecorator.java
```

Arquivos adicionais:

```text
src/main/resources
└── logback-spring.xml
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/correlation
├── CorrelationScopeTest.java
├── CorrelationHttpFilterTest.java
├── KafkaCorrelationPropagationIntegrationTest.java
├── MdcTaskDecoratorTest.java
└── ReplayCorrelationContextTest.java
```

Você irá:

1. definir a taxonomia de IDs;
2. definir nomes de headers;
3. validar valores recebidos;
4. gerar IDs ausentes;
5. criar metadata imutável;
6. criar scope MDC;
7. restaurar contexto anterior;
8. criar filtro HTTP;
9. devolver headers de resposta;
10. propagar contexto em HTTP de saída;
11. persistir IDs na Outbox;
12. publicar IDs como headers Kafka;
13. extrair IDs no consumer;
14. enriquecer logs com metadata Kafka;
15. persistir IDs na Inbox;
16. relacionar eventId e messageId;
17. incluir replayRunId;
18. propagar MDC em executor;
19. impedir vazamento entre threads;
20. padronizar o layout de log;
21. definir campos obrigatórios;
22. proibir dados sensíveis;
23. testar HTTP;
24. testar Kafka;
25. testar async;
26. executar o gate;
27. commitar;
28. preparar monitoramento.

---

## Conceito essencial

### Correlation ID

`correlationId` identifica uma jornada distribuída.

Exemplo:

```text
criação do pedido
até a atualização da projeção.
```

Ele deve permanecer estável enquanto as operações pertencem à mesma intenção.

Não use um novo correlation ID em cada serviço.

---

### Message ID

`messageId` identifica uma mensagem ou interação específica.

Exemplos incluem requisição HTTP, comando, evento, chamada externa e mensagem Kafka.

Um evento já possui:

```text
eventId.
```

Nesse caso:

```text
messageId = eventId.
```

Não gere outro ID.

---

### Causation ID

`causationId` aponta para a interação anterior.

Exemplo:

```text
HTTP request H-1
causa
evento E-1.

E-1:
causationId = H-1.
```

Outro exemplo:

```text
evento E-1
causa
evento E-2.

E-2:
causationId = E-1.
```

Isso reconstrói a cadeia causal.

---

### Replay Run ID

`replayRunId` identifica a execução de replay.

Ele não substitui o correlation ID original.

Exemplo:

```text
evento E-1
foi processado originalmente
na jornada C-1;

depois foi relido
na execução R-9.
```

No replay, os logs preservam `correlationId` e `messageId` originais e acrescentam `replayRunId`.

---

### Request ID

Uma requisição HTTP é uma mensagem.

A baseline utilizará:

```text
X-Request-Id
```

como `messageId` da interação HTTP.

A resposta devolve o request ID.

---

### Headers HTTP

Headers padronizados:

```text
X-Correlation-Id;

X-Request-Id;

X-Causation-Id.
```

Um cliente externo pode enviar `X-Correlation-Id`.

A aplicação valida o valor.

Ela não deve aceitar:

- string enorme;
- quebra de linha;
- controle;
- JSON;
- token;
- e-mail;
- documento;
- texto livre.

---

### Headers Kafka

Headers padronizados:

```text
correlationId;

messageId;

causationId;

replayRunId.
```

Headers Kafka são case-sensitive.

Use constantes compartilhadas.

Não dependa de variações como:

```text
CorrelationId;

correlation-id;

X-Correlation-Id.
```

dentro do Kafka.

---

### Política de valores

A baseline aceitará:

```text
UUID textual;

ou identificador seguro
de até 100 caracteres.
```

Caracteres permitidos:

```text
A-Z;

a-z;

0-9;

ponto;

dois-pontos;

underscore;

hífen.
```

Valor inválido é descartado e substituído.

Não registre o valor rejeitado completo.

---

### MDC

MDC armazena pares chave/valor associados à thread.

Exemplo:

```java
MDC.put(
    "correlationId",
    metadata.correlationId()
);
```

Depois:

```java
LOGGER.info(
    "Order accepted"
);
```

O layout inclui o campo automaticamente.

---

### Limpeza

Fluxo obrigatório:

```text
salvar contexto anterior;

aplicar novo contexto;

executar;

limpar;

restaurar contexto anterior.
```

A restauração permite scopes aninhados. Não use apenas `MDC.clear()` sem considerar o contexto anterior.

---

### Boundaries

O contexto precisa ser reconstruído em HTTP, Kafka, schedulers, executors, Outbox, Inbox e replay.

MDC não atravessa processo, broker ou banco sozinho.

---

### Logs estruturados

Um log correlacionado precisa usar campos estáveis.

Exemplo:

```text
event=outbox.publication.completed
outcome=SUCCESS
correlationId=...
messageId=...
topic=...
partition=...
offset=...
```

Evite depender somente de frases.

---

### Cardinalidade

Correlation IDs possuem alta cardinalidade.

Eles são adequados para logs.

Eles normalmente não devem virar labels de métricas.

Criar uma série de métrica por correlation ID pode explodir cardinalidade e custo.

A próxima aula tratará métricas.

---

### Dados sensíveis

Não coloque no MDC:

- payload;
- token;
- senha;
- documento;
- e-mail;
- telefone;
- endereço;
- cartão;
- stacktrace;
- SQL;
- corpo HTTP.

Use IDs técnicos e metadata operacional.

---

### Correlation e tracing

Correlação por log ajuda a buscar uma jornada.

Tracing ajuda a visualizar causalidade temporal e latência entre spans.

Os dois podem compartilhar contexto, mas possuem responsabilidades distintas.

Não invente `traceId` manual para simular tracing.

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

Os laboratórios anteriores precisam continuar verdes.

---

### 2. Criar constantes de headers

Arquivo:

```text
CorrelationHeaders.java
```

```java
package br.com.formacao.m16.kafka.correlation;

public final class CorrelationHeaders {

    public static final String HTTP_CORRELATION_ID =
        "X-Correlation-Id";

    public static final String HTTP_REQUEST_ID =
        "X-Request-Id";

    public static final String HTTP_CAUSATION_ID =
        "X-Causation-Id";

    public static final String KAFKA_CORRELATION_ID =
        "correlationId";

    public static final String KAFKA_MESSAGE_ID =
        "messageId";

    public static final String KAFKA_CAUSATION_ID =
        "causationId";

    public static final String KAFKA_REPLAY_RUN_ID =
        "replayRunId";

    private CorrelationHeaders() {
    }
}
```

---

### 3. Criar metadata

Arquivo:

```text
CorrelationMetadata.java
```

```java
package br.com.formacao.m16.kafka.correlation;

import java.util.Objects;

public record CorrelationMetadata(
    String correlationId,
    String messageId,
    String causationId,
    String replayRunId
) {

    public CorrelationMetadata {
        Objects.requireNonNull(
            correlationId,
            "correlationId must not be null"
        );

        Objects.requireNonNull(
            messageId,
            "messageId must not be null"
        );
    }

    public CorrelationMetadata child(
        String childMessageId
    ) {
        return new CorrelationMetadata(
            correlationId,
            childMessageId,
            messageId,
            replayRunId
        );
    }

    public CorrelationMetadata withReplayRunId(
        String value
    ) {
        return new CorrelationMetadata(
            correlationId,
            messageId,
            causationId,
            value
        );
    }
}
```

---

### 4. Criar policy de valores

Arquivo:

```text
CorrelationValuePolicy.java
```

```java
package br.com.formacao.m16.kafka.correlation;

import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class CorrelationValuePolicy {

    private static final int MAX_LENGTH = 100;

    private static final Pattern SAFE_VALUE =
        Pattern.compile(
            "[A-Za-z0-9._:-]+"
        );

    public String acceptOrGenerate(
        String candidate
    ) {
        return isValid(candidate)
            ? candidate
            : UUID.randomUUID().toString();
    }

    public String acceptOrNull(
        String candidate
    ) {
        return isValid(candidate)
            ? candidate
            : null;
    }

    private boolean isValid(
        String candidate
    ) {
        return candidate != null
            && !candidate.isBlank()
            && candidate.length() <= MAX_LENGTH
            && SAFE_VALUE
                .matcher(candidate)
                .matches();
    }
}
```

Não faça log do header inválido completo.

---

### 5. Criar CorrelationContext

Arquivo:

```text
CorrelationContext.java
```

```java
package br.com.formacao.m16.kafka.correlation;

import java.util.Map;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Component
public class CorrelationContext {

    public CorrelationMetadata newRoot() {
        String correlationId =
            UUID.randomUUID().toString();

        String messageId =
            UUID.randomUUID().toString();

        return new CorrelationMetadata(
            correlationId,
            messageId,
            null,
            null
        );
    }

    public CorrelationMetadata current() {
        String correlationId =
            MDC.get("correlationId");

        String messageId =
            MDC.get("messageId");

        if (
            correlationId == null
                || messageId == null
        ) {
            return newRoot();
        }

        return new CorrelationMetadata(
            correlationId,
            messageId,
            MDC.get("causationId"),
            MDC.get("replayRunId")
        );
    }

    public Map<String, String> copyMdc() {
        Map<String, String> values =
            MDC.getCopyOfContextMap();

        return values == null
            ? Map.of()
            : Map.copyOf(values);
    }
}
```

`current()` não altera o MDC.

---

### 6. Criar CorrelationScope

Arquivo:

```text
CorrelationScope.java
```

```java
package br.com.formacao.m16.kafka.correlation;

import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.MDC;

public final class CorrelationScope
        implements AutoCloseable {

    private final Map<String, String> previous;
    private boolean closed;

    private CorrelationScope(
        Map<String, String> values
    ) {
        Map<String, String> current =
            MDC.getCopyOfContextMap();

        previous = current == null
            ? Map.of()
            : Map.copyOf(current);

        MDC.clear();

        values.forEach(
            (key, value) -> {
                if (
                    value != null
                        && !value.isBlank()
                ) {
                    MDC.put(key, value);
                }
            }
        );
    }

    public static CorrelationScope open(
        CorrelationMetadata metadata
    ) {
        Map<String, String> values =
            new LinkedHashMap<>();

        values.put(
            "correlationId",
            metadata.correlationId()
        );

        values.put(
            "messageId",
            metadata.messageId()
        );

        values.put(
            "causationId",
            metadata.causationId()
        );

        values.put(
            "replayRunId",
            metadata.replayRunId()
        );

        return new CorrelationScope(values);
    }

    public static CorrelationScope open(
        Map<String, String> values
    ) {
        return new CorrelationScope(values);
    }

    @Override
    public void close() {
        if (closed) {
            return;
        }

        closed = true;

        MDC.clear();

        if (!previous.isEmpty()) {
            MDC.setContextMap(previous);
        }
    }
}
```

O scope restaura o contexto anterior.

---

### 7. Criar o filtro HTTP

Arquivo:

```text
CorrelationHttpFilter.java
```

```java
package br.com.formacao.m16.kafka.correlation.http;

import br.com.formacao.m16.kafka.correlation.CorrelationHeaders;
import br.com.formacao.m16.kafka.correlation.CorrelationMetadata;
import br.com.formacao.m16.kafka.correlation.CorrelationScope;
import br.com.formacao.m16.kafka.correlation.CorrelationValuePolicy;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationHttpFilter
        extends OncePerRequestFilter {

    private final CorrelationValuePolicy valuePolicy;

    public CorrelationHttpFilter(
        CorrelationValuePolicy valuePolicy
    ) {
        this.valuePolicy = valuePolicy;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String correlationId =
            valuePolicy.acceptOrGenerate(
                request.getHeader(
                    CorrelationHeaders
                        .HTTP_CORRELATION_ID
                )
            );

        String requestId =
            valuePolicy.acceptOrGenerate(
                request.getHeader(
                    CorrelationHeaders
                        .HTTP_REQUEST_ID
                )
            );

        String causationId =
            valuePolicy.acceptOrNull(
                request.getHeader(
                    CorrelationHeaders
                        .HTTP_CAUSATION_ID
                )
            );

        CorrelationMetadata metadata =
            new CorrelationMetadata(
                correlationId,
                requestId,
                causationId,
                null
            );

        response.setHeader(
            CorrelationHeaders.HTTP_CORRELATION_ID,
            correlationId
        );

        response.setHeader(
            CorrelationHeaders.HTTP_REQUEST_ID,
            requestId
        );

        try (
            CorrelationScope ignored =
                CorrelationScope.open(metadata)
        ) {
            filterChain.doFilter(
                request,
                response
            );
        }
    }
}
```

O `try-with-resources` garante limpeza.

---

### 8. Criar o layout de log

Arquivo:

```text
src/main/resources/logback-spring.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <springProperty
        scope="context"
        name="applicationName"
        source="spring.application.name"
        defaultValue="kafka-orders-lab"
    />

    <appender
        name="CONSOLE"
        class="ch.qos.logback.core.ConsoleAppender"
    >
        <encoder>
            <pattern>
                %d{yyyy-MM-dd'T'HH:mm:ss.SSSXXX}
                level=%-5level
                service=${applicationName}
                correlationId=%X{correlationId:-}
                messageId=%X{messageId:-}
                causationId=%X{causationId:-}
                replayRunId=%X{replayRunId:-}
                topic=%X{topic:-}
                partition=%X{partition:-}
                offset=%X{offset:-}
                logger=%logger{36}
                msg="%replace(%msg){'[\r\n]+',' '}"%n
            </pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>

</configuration>
```

O replace reduz quebra de linha no campo `msg`.

---

### 9. Padronizar eventos de log

Em vez de:

```java
LOGGER.info(
    "Funcionou aqui"
);
```

Use:

```java
LOGGER.info(
    "event=order.create.accepted outcome=SUCCESS orderId={}",
    orderId
);
```

Campos recorrentes:

```text
event;

outcome;

operation;

durationMs;

attempt;

status;

reasonCode.
```

Não use orderId como substituto de correlation ID.

---

### 10. Propagar HTTP de saída

Arquivo:

```text
CorrelationRestClientConfiguration.java
```

```java
package br.com.formacao.m16.kafka.correlation.http;

import br.com.formacao.m16.kafka.correlation.CorrelationContext;
import br.com.formacao.m16.kafka.correlation.CorrelationHeaders;
import br.com.formacao.m16.kafka.correlation.CorrelationMetadata;
import java.util.UUID;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class CorrelationRestClientConfiguration {

    @Bean
    RestClient integrationRestClient(
        RestClient.Builder builder,
        CorrelationContext context
    ) {
        return builder
            .requestInterceptor(
                (request, body, execution) -> {
                    CorrelationMetadata current =
                        context.current();

                    String requestId =
                        UUID.randomUUID().toString();

                    request.getHeaders().set(
                        CorrelationHeaders
                            .HTTP_CORRELATION_ID,
                        current.correlationId()
                    );

                    request.getHeaders().set(
                        CorrelationHeaders
                            .HTTP_REQUEST_ID,
                        requestId
                    );

                    request.getHeaders().set(
                        CorrelationHeaders
                            .HTTP_CAUSATION_ID,
                        current.messageId()
                    );

                    return execution.execute(
                        request,
                        body
                    );
                }
            )
            .build();
    }
}
```

A nova chamada possui outro request ID.

O causation ID aponta para a interação atual.

---

### 11. Persistir correlação na Outbox

Adicione à entidade `OutboxEventEntity`:

```java
@Column(
    name = "correlation_id",
    nullable = false,
    length = 100
)
private String correlationId;

@Column(
    name = "causation_id",
    length = 100
)
private String causationId;
```

O `id` da outbox continua sendo:

```text
eventId;

messageId do evento.
```

No service de criação:

```java
CorrelationMetadata current =
    correlationContext.current();

UUID eventId =
    UUID.randomUUID();

CorrelationMetadata eventMetadata =
    current.child(
        eventId.toString()
    );
```

Persista:

```text
correlationId:
eventMetadata.correlationId.

causationId:
eventMetadata.causationId.

messageId:
eventId.
```

---

### 12. Escrever headers Kafka

Arquivo:

```text
KafkaCorrelationHeadersWriter.java
```

```java
package br.com.formacao.m16.kafka.correlation.kafka;

import br.com.formacao.m16.kafka.correlation.CorrelationHeaders;
import br.com.formacao.m16.kafka.correlation.CorrelationMetadata;
import java.nio.charset.StandardCharsets;
import org.apache.kafka.common.header.Headers;
import org.springframework.stereotype.Component;

@Component
public class KafkaCorrelationHeadersWriter {

    public void write(
        Headers headers,
        CorrelationMetadata metadata
    ) {
        add(
            headers,
            CorrelationHeaders
                .KAFKA_CORRELATION_ID,
            metadata.correlationId()
        );

        add(
            headers,
            CorrelationHeaders
                .KAFKA_MESSAGE_ID,
            metadata.messageId()
        );

        add(
            headers,
            CorrelationHeaders
                .KAFKA_CAUSATION_ID,
            metadata.causationId()
        );

        add(
            headers,
            CorrelationHeaders
                .KAFKA_REPLAY_RUN_ID,
            metadata.replayRunId()
        );
    }

    private void add(
        Headers headers,
        String name,
        String value
    ) {
        if (
            value == null
                || value.isBlank()
        ) {
            return;
        }

        headers.remove(name);

        headers.add(
            name,
            value.getBytes(
                StandardCharsets.UTF_8
            )
        );
    }
}
```

`headers.remove` evita valores duplicados para a mesma chave.

---

### 13. Atualizar o Outbox publisher

Antes de enviar:

```java
CorrelationMetadata metadata =
    new CorrelationMetadata(
        publication.correlationId(),
        publication.id().toString(),
        publication.causationId(),
        null
    );

headersWriter.write(
    headers,
    metadata
);
```

Depois abra um scope para os logs do job:

```java
try (
    CorrelationScope ignored =
        CorrelationScope.open(metadata)
) {
    LOGGER.info(
        "event=outbox.publish.started outcome=STARTED"
    );

    PublishedKafkaRecord result =
        publishToKafka(publication);

    LOGGER.info(
        "event=outbox.publish.completed outcome=SUCCESS topic={} partition={} offset={}",
        publication.topic(),
        result.partition(),
        result.offset()
    );
}
```

---

### 14. Extrair headers Kafka

Arquivo:

```text
KafkaCorrelationExtractor.java
```

```java
package br.com.formacao.m16.kafka.correlation.kafka;

import br.com.formacao.m16.kafka.correlation.CorrelationHeaders;
import br.com.formacao.m16.kafka.correlation.CorrelationMetadata;
import br.com.formacao.m16.kafka.correlation.CorrelationValuePolicy;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.Header;
import org.springframework.stereotype.Component;

@Component
public class KafkaCorrelationExtractor {

    private final CorrelationValuePolicy valuePolicy;

    public KafkaCorrelationExtractor(
        CorrelationValuePolicy valuePolicy
    ) {
        this.valuePolicy = valuePolicy;
    }

    public CorrelationMetadata extract(
        ConsumerRecord<?, ?> record,
        String fallbackMessageId
    ) {
        String correlationId =
            valuePolicy.acceptOrGenerate(
                value(
                    record,
                    CorrelationHeaders
                        .KAFKA_CORRELATION_ID
                )
            );

        String messageId =
            valuePolicy.acceptOrGenerate(
                firstNonBlank(
                    value(
                        record,
                        CorrelationHeaders
                            .KAFKA_MESSAGE_ID
                    ),
                    fallbackMessageId,
                    UUID.randomUUID().toString()
                )
            );

        String causationId =
            valuePolicy.acceptOrNull(
                value(
                    record,
                    CorrelationHeaders
                        .KAFKA_CAUSATION_ID
                )
            );

        String replayRunId =
            valuePolicy.acceptOrNull(
                value(
                    record,
                    CorrelationHeaders
                        .KAFKA_REPLAY_RUN_ID
                )
            );

        return new CorrelationMetadata(
            correlationId,
            messageId,
            causationId,
            replayRunId
        );
    }

    private String value(
        ConsumerRecord<?, ?> record,
        String name
    ) {
        Header header =
            record
                .headers()
                .lastHeader(name);

        return header == null
            ? null
            : new String(
                header.value(),
                StandardCharsets.UTF_8
            );
    }

    private String firstNonBlank(
        String... values
    ) {
        for (String value : values) {
            if (
                value != null
                    && !value.isBlank()
            ) {
                return value;
            }
        }

        return null;
    }
}
```

Para eventos:

```text
fallbackMessageId = event.eventId.
```

---

### 15. Abrir scope no listener

Atualize um listener:

```java
CorrelationMetadata metadata =
    extractor.extract(
        record,
        record.value()
            .eventId()
            .toString()
    );

Map<String, String> values =
    new LinkedHashMap<>();

values.put(
    "correlationId",
    metadata.correlationId()
);

values.put(
    "messageId",
    metadata.messageId()
);

values.put(
    "causationId",
    metadata.causationId()
);

values.put(
    "replayRunId",
    metadata.replayRunId()
);

values.put(
    "topic",
    record.topic()
);

values.put(
    "partition",
    Integer.toString(record.partition())
);

values.put(
    "offset",
    Long.toString(record.offset())
);

try (
    CorrelationScope ignored =
        CorrelationScope.open(values)
) {
    LOGGER.info(
        "event=order.inbox.received outcome=STARTED"
    );

    handler.handle(record);

    LOGGER.info(
        "event=order.inbox.received outcome=SUCCESS"
    );
}
```

O scope termina após o record.

---

### 16. Persistir IDs na Inbox

Adicione:

```text
correlation_id;

causation_id.
```

O `event_id` continua como `messageId`.

Ao persistir:

```java
CorrelationMetadata metadata =
    extractor.extract(
        record,
        event.eventId().toString()
    );
```

Grave os valores junto com topic, partition e offset.

Isso permite que o worker reconstrua o contexto depois.

---

### 17. Abrir scope no worker Inbox

Quando o worker carregar `InboxWorkItem`, inclua:

```text
correlationId;

messageId;

causationId.
```

Antes de processar:

```java
CorrelationMetadata metadata =
    new CorrelationMetadata(
        item.correlationId(),
        item.eventId().toString(),
        item.causationId(),
        null
    );

try (
    CorrelationScope ignored =
        CorrelationScope.open(metadata)
) {
    processingService.process(
        item,
        workerId
    );
}
```

O contexto sobrevive ao intervalo entre ingestão e processamento porque foi persistido.

---

### 18. Correlacionar replay

No `ReplayProcessor`:

```java
CorrelationMetadata metadata =
    extractor.extract(
        record,
        event.eventId().toString()
    )
    .withReplayRunId(
        replayJobId.toString()
    );
```

Adicione ao scope:

```text
topic;

partition;

offset.
```

Os logs passam a responder:

```text
qual evento original?

qual jornada original?

qual execução de replay?

qual posição?
```

---

### 19. Criar TaskDecorator

Arquivo:

```text
MdcTaskDecorator.java
```

```java
package br.com.formacao.m16.kafka.correlation.task;

import java.util.Map;
import org.slf4j.MDC;
import org.springframework.core.task.TaskDecorator;
import org.springframework.stereotype.Component;

@Component
public class MdcTaskDecorator
        implements TaskDecorator {

    @Override
    public Runnable decorate(
        Runnable delegate
    ) {
        Map<String, String> captured =
            MDC.getCopyOfContextMap();

        return () -> {
            Map<String, String> previous =
                MDC.getCopyOfContextMap();

            try {
                MDC.clear();

                if (captured != null) {
                    MDC.setContextMap(captured);
                }

                delegate.run();
            } finally {
                MDC.clear();

                if (previous != null) {
                    MDC.setContextMap(previous);
                }
            }
        };
    }
}
```

---

### 20. Configurar executor

```java
@Bean
ThreadPoolTaskExecutor integrationTaskExecutor(
    MdcTaskDecorator taskDecorator
) {
    ThreadPoolTaskExecutor executor =
        new ThreadPoolTaskExecutor();

    executor.setCorePoolSize(4);
    executor.setMaxPoolSize(8);
    executor.setQueueCapacity(100);
    executor.setThreadNamePrefix(
        "integration-"
    );
    executor.setTaskDecorator(
        taskDecorator
    );
    executor.initialize();

    return executor;
}
```

Não dependa de MDC automático em `CompletableFuture`.

---

### 21. Abrir contexto em schedulers

Jobs como Outbox, Inbox e replay não recebem request HTTP diretamente.

Eles precisam reconstruir o contexto a partir da linha persistida.

Quando o job executa manutenção sem mensagem específica, crie uma raiz operacional:

```text
correlationId:
novo.

messageId:
novo.

event:
outbox.scan.started.
```

Não reutilize IDs de uma execução anterior da thread.

---

### 22. Logar exceptions

Use:

```java
LOGGER.error(
    "event=outbox.publish.failed outcome=ERROR reasonCode=KAFKA_SEND_FAILED attempt={}",
    attempt,
    exception
);
```

A exception entra no argumento final.

Não concatene stacktrace no texto.

Não coloque stacktrace no MDC ou header.

---

### 23. Não logar payload

Evite:

```java
LOGGER.info(
    "Received payload={}",
    payload
);
```

Prefira:

```java
LOGGER.info(
    "event=order.received outcome=SUCCESS eventType={} eventVersion={} payloadBytes={}",
    eventType,
    eventVersion,
    payloadSize
);
```

Quando necessário, use hash com policy explícita.

---

### 24. Testar CorrelationScope

`CorrelationScopeTest` deve provar:

1. scope aplica valores;
2. close limpa;
3. scope aninhado restaura o anterior;
4. close duplicado não quebra;
5. valor nulo não entra no MDC;
6. teste seguinte começa sem resíduos.

---

### 25. Testar filtro HTTP

Com `MockMvc`:

```text
sem headers:
gera IDs.

com correlation válido:
preserva.

com request ID válido:
preserva.

com header inválido:
substitui.

response:
devolve IDs.

depois do request:
MDC vazio.
```

Crie um endpoint de teste que capture:

```text
MDC.get("correlationId");

MDC.get("messageId").
```

---

### 26. Testar HTTP de saída

Use um `MockRestServiceServer` ou server de teste.

Confirme:

```text
X-Correlation-Id:
preservado.

X-Request-Id:
novo.

X-Causation-Id:
messageId atual.
```

A chamada seguinte recebe outro request ID.

---

### 27. Testar propagação Kafka

Com `@EmbeddedKafka`:

1. publique evento com correlation ID;
2. use eventId como messageId;
3. consuma;
4. capture MDC dentro do listener;
5. confirme correlation ID;
6. confirme message ID;
7. confirme causation ID;
8. confirme topic;
9. confirme partition;
10. confirme offset;
11. confirme MDC vazio depois.

Não valide logs por texto quando o objetivo pode ser testado por contexto capturado.

---

### 28. Testar fallback Kafka

Publique um record sem headers.

Resultado esperado:

```text
correlationId:
gerado.

messageId:
eventId.

causationId:
null.
```

Registre uma métrica futura para header ausente, mas não implemente monitoramento nesta aula.

---

### 29. Testar TaskDecorator

Use um executor de uma thread.

Execute duas tasks:

```text
task A:
correlation A.

task B:
correlation B.
```

Confirme:

- A não recebe B;
- B não recebe A;
- thread fica limpa depois;
- contexto do caller é preservado.

---

### 30. Testar replay

Crie record com:

```text
correlationId C-1;

messageId E-1.
```

Execute replay:

```text
runId R-1.
```

Dentro do processor, confirme:

```text
correlationId C-1;

messageId E-1;

replayRunId R-1;

partition e offset corretos.
```

---

### 31. Criar guia de logging

Arquivo:

```text
docs/architecture/messaging/CORRELATION_LOGGING_POLICY.md
```

Inclua:

```text
campos permitidos;

campos obrigatórios;

headers;

geração;

validação;

propagação;

MDC;

limpeza;

async;

dados proibidos;

naming;

testes;

retenção.
```

---

### 32. Definir eventos de log

Tabela:

```markdown
| Event | Momento |
|---|---|
| http.request.started | Entrada HTTP |
| http.request.completed | Resposta HTTP |
| outbox.event.created | Commit local |
| outbox.publish.started | Início do send |
| outbox.publish.completed | Ack do broker |
| kafka.record.received | Entrada no listener |
| inbox.message.persisted | Recepção durável |
| inbox.processing.started | Worker iniciou |
| inbox.processing.completed | Efeito concluído |
| replay.record.processed | Record histórico |
```

---

### 33. Executar a aplicação

```powershell
docker start `
  "m16-kafka"
```

```powershell
.\mvnw.cmd spring-boot:run
```

Crie um pedido com header:

```powershell
$correlationId =
  [guid]::NewGuid().ToString()

Invoke-RestMethod `
  -Method Post `
  -Uri (
    "http://localhost:8084" +
    "/api/v1/lab/kafka/outbox/orders"
  ) `
  -Headers @{
    "X-Correlation-Id" = $correlationId
  } `
  -ContentType "application/json" `
  -Body $body
```

Procure o mesmo ID nos logs.

---

### 34. Verificar jornada

A busca deve mostrar HTTP, Outbox, Kafka, Inbox e worker.

Os `messageId` mudam conforme a interação.

O `correlationId` permanece.

---

### 35. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=CorrelationScopeTest,CorrelationHttpFilterTest,KafkaCorrelationPropagationIntegrationTest,MdcTaskDecoratorTest,ReplayCorrelationContextTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### A jornada ganhou uma identidade

O mesmo correlation ID atravessou múltiplas etapas.

### Mensagens individuais continuaram distinguíveis

Cada request ou evento possui message ID próprio.

### A causalidade ficou navegável

Causation ID aponta para a interação anterior.

### Replay não apagou o contexto original

Replay run ID foi adicionado sem substituir os IDs do evento.

### HTTP ganhou geração e validação

Headers externos não são confiados cegamente.

### Outbox preservou contexto no tempo

O job reconstruiu IDs depois do request.

### Kafka transportou o contexto

Headers atravessaram o broker.

### Inbox preservou contexto para o worker

O processamento posterior continuou correlacionado.

### MDC ficou seguro

Scopes e decorators restauraram o estado.

### Logs ficaram pesquisáveis

Campos estáveis substituíram buscas por texto aproximado.

---

## Erros comuns importantes

### Usar orderId como correlation ID

Uma entidade pode participar de várias jornadas.

### Gerar correlation ID novo em cada serviço

A cadeia é quebrada.

### Reutilizar o mesmo message ID em novas mensagens

A causalidade fica ambígua.

### Colocar payload no MDC

Aumenta risco, volume e exposição.

### Confiar em headers sem validação

Logs podem receber caracteres maliciosos ou valores enormes.

### Esquecer MDC.clear

Threads reutilizadas vazam contexto.

### Usar CompletableFuture sem propagação

O contexto desaparece.

### Persistir Outbox sem correlation ID

O job perde a jornada original.

### Substituir correlation ID por replayRunId

A relação com o evento original é perdida.

### Usar correlation ID como label de métrica

Cardinalidade cresce sem controle.

### Inventar traceId manual

Correlação não substitui tracing.

### Logar exception sem event e outcome

A busca fica inconsistente.

---

## Comandos úteis

### Executar testes de correlação

```powershell
.\mvnw.cmd `
  -Dtest=*Correlation*,MdcTaskDecoratorTest `
  test
```

### Procurar MDC

```powershell
git grep `
  -n `
  -E `
  "MDC.put|MDC.clear|CorrelationScope|TaskDecorator"
```

### Procurar headers

```powershell
git grep `
  -n `
  -E `
  "X-Correlation-Id|X-Request-Id|correlationId|messageId|causationId|replayRunId"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — IDs

Defina correlation, message e causation.

### Parte 2 — Scope

Crie MDC seguro.

### Parte 3 — HTTP

Gere, valide e devolva headers.

### Parte 4 — Egress

Propague para chamada externa.

### Parte 5 — Outbox

Persista o contexto.

### Parte 6 — Kafka

Escreva e leia headers.

### Parte 7 — Inbox

Preserve contexto até o worker.

### Parte 8 — Replay

Adicione replayRunId.

### Parte 9 — Async

Use TaskDecorator.

### Parte 10 — Testes

Prove ausência de vazamento.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 492 foi preservada;
- correlationId foi definido;
- messageId foi definido;
- causationId foi definido;
- replayRunId foi definido;
- request ID foi relacionado a messageId;
- eventId foi relacionado a messageId;
- correlationId permanece na jornada;
- messageId muda por interação;
- causationId aponta para a causa;
- replayRunId não substitui correlationId;
- headers HTTP foram definidos;
- headers Kafka foram definidos;
- case sensitivity Kafka foi registrada;
- policy de valor foi criada;
- tamanho máximo foi definido;
- caracteres seguros foram definidos;
- header inválido foi substituído;
- valor rejeitado não foi logado integralmente;
- CorrelationMetadata foi criada;
- child metadata foi criada;
- CorrelationScope foi criado;
- contexto anterior foi salvo;
- contexto anterior foi restaurado;
- close duplicado foi protegido;
- valores nulos foram ignorados;
- filtro HTTP foi criado;
- filtro usa OncePerRequestFilter;
- response devolve correlation e request IDs;
- scope usa try-with-resources;
- logback-spring.xml foi criado;
- layout inclui IDs;
- layout inclui topic, partition e offset;
- mensagem multiline foi tratada;
- eventos de log foram padronizados;
- HTTP de saída preserva correlationId;
- HTTP de saída cria requestId novo;
- causation HTTP usa messageId atual;
- Outbox persiste correlationId;
- Outbox persiste causationId;
- eventId permanece messageId;
- publisher escreve headers Kafka;
- headers duplicados foram removidos;
- listener extrai headers;
- eventId foi usado como fallback;
- metadata Kafka entrou no MDC;
- topic entrou no MDC;
- partition entrou no MDC;
- offset entrou no MDC;
- Inbox persiste IDs;
- worker reconstrói contexto;
- replay adiciona replayRunId;
- replay preserva IDs originais;
- TaskDecorator foi criado;
- contexto foi propagado para thread pool;
- contexto anterior foi restaurado no executor;
- schedulers receberam contexto próprio;
- exceptions foram logadas como argumento;
- stacktrace não foi colocado no MDC;
- payload não foi logado;
- dados sensíveis foram proibidos;
- correlation ID não virou métrica;
- tracing foi diferenciado;
- tracing não foi implementado;
- teste de scope foi criado;
- teste de filtro foi criado;
- teste Kafka foi criado;
- teste async foi criado;
- teste de replay foi criado;
- ausência de vazamento foi testada;
- política de logging foi criada;
- gate foi executado;
- monitoramento não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 494 está correta.

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
  "MDC|correlationId|messageId|causationId|replayRunId|payload|Authorization"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/messaging/CORRELATION_LOGGING_POLICY.md `
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
git commit -m "feat(m16): adicionar logs de correlacao"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- payload real;
- token;
- senha;
- documento;
- e-mail;
- banco H2;
- logs;
- target;
- backend de observabilidade;
- agente de tracing;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a cadeia de integração passou a possuir contexto pesquisável de ponta a ponta.

O fluxo ficou:

```text
HTTP correlation;

request message;

Outbox persistence;

Kafka headers;

Inbox persistence;

worker MDC;

replay run.
```

Você comprovou que:

- correlation ID identifica a jornada;
- message ID identifica a interação;
- causation ID conecta causa e efeito;
- replay run ID identifica a execução histórica;
- headers externos precisam de validação;
- eventId pode ser o message ID do evento;
- Outbox precisa preservar a correlação;
- Kafka precisa transportar headers;
- Inbox precisa persistir o contexto;
- jobs precisam reconstruir o MDC;
- MDC precisa ser limpo e restaurado;
- executors exigem propagação explícita;
- payload e dados sensíveis não pertencem ao contexto;
- logs correlacionados não substituem tracing ou métricas.

A próxima aula será:

```text
494 - M16.39 - Monitoramento de integracoes
```

Nela, você irá:

- definir métricas de producer e consumer;
- medir taxa, erro e duração;
- medir consumer lag;
- medir Outbox backlog;
- medir Inbox backlog;
- medir poison messages;
- medir retries;
- definir SLIs;
- definir alertas;
- criar dashboards;
- controlar cardinalidade;
- usar correlation IDs apenas para investigação;
- preparar testes de integração ponta a ponta.

Métricas, dashboards e alertas não foram implementados antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini os quatro IDs.
- [ ] Criei CorrelationScope.
- [ ] Correlacionei HTTP.
- [ ] Correlacionei Outbox e Kafka.
- [ ] Correlacionei Inbox e worker.
- [ ] Correlacionei replay.
- [ ] Propaguei MDC entre threads.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### correlationId muda entre serviços

Alguma fronteira está gerando ID novo em vez de propagar o existente.

### messageId é igual em todos os eventos

O producer está reutilizando a identidade da causa em vez de criar a identidade da nova mensagem.

### causationId está vazio

Confirme se o producer recebeu um messageId atual antes de criar o evento filho.

### logs mostram ID de outra requisição

Existe vazamento de MDC. Revise `finally`, scope e decorator.

### async perde os campos

O executor não possui `TaskDecorator`.

### Outbox publisher não possui correlação

Os IDs não foram persistidos na linha outbox.

### Kafka listener gera correlation novo

O header pode não ter sido escrito ou foi rejeitado pela policy.

### replay perde a jornada original

O replay está sobrescrevendo correlationId com runId.

### logs ficaram grandes

Revise payloads, exception messages e campos redundantes.

### busca por correlationId não encontra tudo

Algum componente não propagou, persistiu ou restaurou o contexto.

---

## Perguntas de revisão

1. O que identifica correlationId?
2. O que identifica messageId?
3. O que identifica causationId?
4. O que identifica replayRunId?
5. Request ID é o quê?
6. EventId pode ser o quê?
7. MDC atravessa processos?
8. MDC atravessa threads automaticamente?
9. Por que usar scope?
10. Por que restaurar contexto anterior?
11. Quais headers HTTP foram usados?
12. Quais headers Kafka foram usados?
13. Por que validar headers?
14. Por que persistir na Outbox?
15. Por que persistir na Inbox?
16. Como correlacionar replay?
17. Payload pode entrar no MDC?
18. Correlation ID deve ser label de métrica?
19. Tracing foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. A jornada distribuída.
2. A interação atual.
3. A mensagem causadora.
4. A execução histórica.
5. Message ID HTTP.
6. Message ID do evento.
7. Não.
8. Não.
9. Aplicar e limpar com segurança.
10. Permitir scopes aninhados.
11. Correlation, Request e Causation.
12. Correlation, Message, Causation e Replay.
13. Segurança e estabilidade.
14. O job executa depois.
15. O worker executa depois.
16. Preservar IDs e adicionar runId.
17. Não.
18. Normalmente não.
19. Não.
20. Monitoramento de integracoes.

---

## Desafio opcional

Adicione correlação ao fluxo de poison message.

Requisitos:

- preservar correlationId quando o header for válido;
- usar eventId como messageId quando disponível;
- incluir original topic, partition e offset;
- não colocar payload no MDC;
- persistir IDs na quarantine topic;
- gerar correlationId quando ausente;
- testar cleanup do MDC;
- não implementar métricas.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 493 - M16.38 - Logs de correlacao em integracoes

- Continuei após o reprocessamento seguro.
- Defini correlationId como identidade da jornada.
- Defini messageId como identidade da interação.
- Defini causationId como identidade da causa.
- Defini replayRunId como identidade da execução histórica.
- Relacionei request ID e messageId.
- Relacionei eventId e messageId.
- Mantive correlationId estável.
- Criei novos messageIds para novas interações.
- Modelei a cadeia causal.
- Padronizei headers HTTP.
- Padronizei headers Kafka.
- Considerei case sensitivity no Kafka.
- Criei policy de validação.
- Limitei tamanho e caracteres.
- Substituí headers inválidos.
- Criei CorrelationMetadata.
- Criei CorrelationScope.
- Salvei e restaurei contexto anterior.
- Limpei MDC com segurança.
- Criei filtro HTTP.
- Devolvi IDs na resposta.
- Criei layout estruturado no Logback.
- Padronizei eventos de log.
- Propaguei contexto em HTTP de saída.
- Persistei correlação na Outbox.
- Publiquei IDs nos headers Kafka.
- Extraí IDs no listener.
- Adicionei topic, partition e offset ao MDC.
- Persistei correlação na Inbox.
- Reconstruí o contexto no worker.
- Preservei IDs originais no replay.
- Adicionei replayRunId.
- Criei TaskDecorator.
- Propaguei MDC entre threads.
- Evitei vazamento entre tarefas.
- Não coloquei payload no MDC.
- Proibi tokens e dados pessoais.
- Diferenciei correlação e tracing.
- Evitei correlationId como label de métrica.
- Criei testes HTTP, Kafka, async e replay.
- Criei política de logs correlacionados.
- Não antecipei monitoramento.
- Próxima aula: Monitoramento de integracoes.
```

---

## Referência técnica curta

- SLF4J — MDC.
- Logback — MDC.
- Spring Framework — `TaskDecorator`.
- Spring Framework — `RestClient`.
- Spring Web — `OncePerRequestFilter`.
- Apache Kafka — Record Headers.
- Spring Kafka — Message Headers.
- W3C Trace Context — conceitos.
- OpenTelemetry — Context Propagation.
- OWASP Logging Cheat Sheet.

Regra final:

```text
logs de correlação conectam uma jornada distribuída sem depender de payloads ou horários aproximados: correlationId permanece estável do HTTP ao Outbox, Kafka, Inbox, worker e replay; messageId identifica cada request ou mensagem, causationId aponta para a interação que causou a atual e replayRunId adiciona a identidade da execução histórica sem apagar o contexto original; headers externos precisam ser validados, IDs precisam ser persistidos quando o processamento acontece depois e headers Kafka precisam ser escritos e extraídos de forma padronizada; MDC enriquece logs por thread, mas exige scope, limpeza, restauração e TaskDecorator em execução assíncrona; topic, partition e offset completam o diagnóstico, enquanto payloads, tokens e dados pessoais permanecem fora do contexto; correlação melhora investigação, mas não substitui métricas, alertas ou tracing, que serão aprofundados na próxima aula.
```
