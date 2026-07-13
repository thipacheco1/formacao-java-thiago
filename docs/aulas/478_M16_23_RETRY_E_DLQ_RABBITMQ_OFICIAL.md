# 478 - M16.23 - Retry e DLQ RabbitMQ

## Apresentação da aula

Na aula 477, o laboratório passou a utilizar producers e consumers reais sobre a topologia declarada na aula 476.

O fluxo ficou:

```text
controller;

OrderEventPublisher;

RabbitTemplate;

direct exchange;

routing key orders.created.v1;

fulfillment queue;

audit queue;

listener containers;

consumers;

acknowledgement AUTO.
```

Também ficou comprovado que:

```text
duas queues diferentes:
recebem cópias independentes;

dois consumers na mesma queue:
competem pela mesma entrega.
```

A aula anterior encerrou com uma limitação proposital.

Quando o consumer de fulfillment retorna normalmente, o listener container confirma a entrega. Quando o processamento lança uma exceção, é preciso decidir o que fazer com a mensagem.

Uma decisão ingênua seria:

```text
falhou:
requeue para sempre.
```

Esse comportamento pode criar um ciclo:

```text
delivery;

exception;

requeue;

redelivery;

exception;

requeue;

redelivery;
```

A mensagem continua ocupando capacidade do consumer, produz logs repetidos, aumenta latência das outras mensagens e pode pressionar dependências já indisponíveis.

Outra decisão ingênua seria:

```text
falhou uma vez:
descartar.
```

Isso perde mensagens que poderiam funcionar em uma nova tentativa após uma falha transitória.

A pergunta central desta aula será:

```text
como repetir o processamento
um número limitado de vezes,

aplicar espera entre tentativas,

interromper o ciclo quando a falha persiste

e preservar a mensagem problemática
para diagnóstico e ação operacional?
```

A resposta será construída com:

```text
retry local ao listener;

número máximo de tentativas;

backoff;

rejeição sem requeue;

dead-letter exchange;

dead-letter queue;

headers x-death;

poison message;

critérios de reprocessamento.
```

O caminho de sucesso continuará:

```text
main queue
   |
   | delivery
   v
consumer
   |
   | processamento concluído
   v
ack
```

O caminho de falha transitória será:

```text
main queue
   |
   v
consumer
   |
   | tentativa 1 falha
   | espera
   | tentativa 2 falha
   | espera
   | tentativa 3 funciona
   v
ack
```

O caminho de falha permanente será:

```text
main queue
   |
   v
consumer
   |
   | tentativas esgotadas
   v
reject sem requeue
   |
   v
dead-letter exchange
   |
   | binding de dead letter
   v
dead-letter queue
```

A cópia destinada à auditoria continuará independente.

Uma publicação problemática para fulfillment poderá gerar:

```text
audit:
processada normalmente;

fulfillment:
tentativas esgotadas;

fulfillment DLQ:
uma mensagem preservada.
```

A aula utilizará retry stateless no listener container.

Isso significa que as tentativas acontecem dentro da mesma entrega recebida pelo container. O broker não precisa reenviar a mensagem a cada tentativa local.

Consequência importante:

```text
tentativa local do interceptor:
não é redelivery do broker.
```

O header ou flag:

```text
redelivered
```

pode permanecer `false` durante as tentativas locais.

A mensagem só será rejeitada ao broker depois que o retry se esgotar.

A topologia de dead letter será:

```text
source queue:
m16.fulfillment.orders-created.v1

dead-letter exchange:
m16.fulfillment.orders-created.dlx.v1

dead-letter routing key:
orders.created.dead.v1

dead-letter queue:
m16.fulfillment.orders-created.dlq.v1
```

A DLQ não será consumida automaticamente.

Essa é uma decisão intencional.

Consumir e republicar automaticamente toda mensagem morta pode criar um segundo loop, esconder poison messages e repetir efeitos colaterais.

Nesta aula, a DLQ será:

```text
destino de preservação;

fonte de diagnóstico;

ponto de decisão operacional.
```

A aula não implementará:

- retry infinito;
- retry por TTL em filas intermediárias;
- múltiplas retry queues;
- delayed message exchange;
- publisher confirms;
- transação AMQP;
- reprocessador automático;
- deduplicação persistente;
- inbox pattern;
- outbox pattern;
- poison message em Kafka;
- Kafka;
- saga;
- CDC.

Esses limites preservam o foco.

Ao final, você deverá explicar:

```text
por que nem toda falha merece retry;

por que retry precisa de limite;

por que backoff protege dependências;

por que requeue infinito é perigoso;

por que reject sem requeue pode gerar dead letter;

por que DLX roteia e DLQ armazena;

por que x-death é metadata operacional;

por que retry local não altera redelivered;

por que DLQ não deve ser consumida cegamente;

por que reprocessar exige corrigir a causa
e considerar idempotência.
```

---

## Onde estamos na formação

A sequência oficial do M16 é:

```text
475:
RabbitMQ fundamentos.

476:
Exchanges queues bindings.

477:
Producers consumers.

478:
Retry e DLQ RabbitMQ.

479:
Kafka fundamentos.

480:
Topics partitions offsets.
```

A aula 477 respondeu:

```text
como publicar e consumir
com responsabilidades separadas?
```

A aula 478 responderá:

```text
como tratar falhas de consumo
sem perder mensagens
e sem criar redelivery infinito?
```

Nesta aula:

```text
retry limitado:
sim.

backoff:
sim.

retry stateless:
sim.

requeue infinito:
não.

dead-letter exchange:
sim.

dead-letter queue:
sim.

reject sem requeue:
sim.

x-death:
sim.

falha transitória:
sim.

poison message:
sim.

inspeção operacional:
sim.

reprocessamento automático:
não.

publisher confirm:
não.

manual ack:
não.

Kafka:
não.
```

A regra central será:

```text
falha transitória pode receber
poucas novas tentativas;

falha persistente deve sair
do fluxo principal;

a mensagem precisa permanecer
visível, diagnosticável
e controlável.
```

---

## Objetivo prático

O laboratório continua em:

```text
labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos
```

Ao final, a estrutura principal terá:

```text
src/main/java/br/com/formacao/m16/rabbitmq
├── config
│   ├── RabbitListenerRetryConfiguration.java
│   ├── RabbitMessagingConfiguration.java
│   ├── RabbitMqTopologyConfiguration.java
│   └── RabbitTopologyNames.java
├── consumer
│   └── FulfillmentOrderCreatedConsumer.java
├── error
│   ├── FulfillmentProcessingException.java
│   └── PermanentFulfillmentException.java
├── processing
│   ├── FulfillmentAttemptRegistry.java
│   └── FulfillmentProcessingService.java
└── web
    └── FulfillmentAttemptsController.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/rabbitmq
├── config
│   ├── RabbitMqDeadLetterTopologyTest.java
│   └── RabbitListenerRetryConfigurationTest.java
└── processing
    └── FulfillmentProcessingServiceTest.java
```

A aplicação deverá:

1. adicionar Spring Retry sem versão manual;
2. criar uma DLX direta;
3. criar uma DLQ durável;
4. ligar a DLQ com routing key específica;
5. configurar a queue principal com dead-letter arguments;
6. recriar conscientemente a queue local existente;
7. criar retry stateless;
8. limitar a três tentativas;
9. aplicar backoff de um, dois e até quatro segundos;
10. rejeitar sem requeue após esgotar;
11. simular sucesso imediato;
12. simular falha transitória;
13. simular poison message;
14. observar tentativas no log;
15. observar mensagem na DLQ;
16. inspecionar `x-death`;
17. confirmar auditoria independente;
18. testar ausência de loop;
19. documentar critérios de reprocessamento;
20. executar o gate;
21. commitar;
22. preparar a introdução ao Kafka.

---

## Conceito essencial

### Falha transitória

Falha transitória é aquela que pode desaparecer em uma nova tentativa.

Exemplos:

- timeout curto;
- conexão temporariamente indisponível;
- lock momentâneo;
- downstream respondendo `503`;
- limite temporário;
- indisponibilidade breve de rede;
- concorrência otimista que pode ser refeita com segurança.

Retry pode ajudar quando:

```text
a operação é segura para repetir;

a causa tende a desaparecer;

o número de tentativas é limitado;

há espera entre tentativas;

o custo está controlado.
```

Retry não transforma uma operação insegura em idempotente.

---

### Falha permanente

Falha permanente não tende a desaparecer apenas esperando.

Exemplos:

- payload inválido;
- campo obrigatório ausente;
- versão não suportada;
- regra de negócio impossível;
- identificador inexistente quando não haverá criação;
- formato incompatível;
- mensagem corrompida;
- evento destinado ao consumer errado.

Repetir a mesma operação muitas vezes aumenta custo sem alterar o resultado.

Na baseline desta aula, o retry interceptará as exceções de processamento de forma uniforme para manter o laboratório pequeno. A aplicação simulará uma falha permanente que esgota as três tentativas.

Em produção, a evolução correta é classificar exceções para que falhas claramente permanentes sejam rejeitadas mais cedo.

---

### Poison message

Poison message é uma mensagem que falha repetidamente de forma determinística.

Ela pode conter:

- contrato inválido;
- dado impossível;
- versão incompatível;
- valor que ativa um bug;
- referência que nunca existirá;
- conteúdo corrompido.

Uma poison message não deve bloquear indefinidamente a queue principal.

A DLQ isola o problema.

Ela não corrige o problema.

---

### Retry limitado

A baseline utilizará:

```text
max attempts:
3.
```

Esse total inclui a primeira execução.

Logo:

```text
tentativa 1:
imediata.

tentativa 2:
após backoff.

tentativa 3:
após novo backoff.

depois:
recoverer.
```

Não interprete `maxAttempts(3)` como:

```text
uma tentativa original
mais três retries.
```

São três execuções no total.

---

### Backoff

Backoff adiciona espera entre tentativas.

Baseline:

```text
intervalo inicial:
1 segundo.

multiplicador:
2.

intervalo máximo:
4 segundos.
```

Sequência esperada:

```text
tentativa 1;

espera aproximada de 1 segundo;

tentativa 2;

espera aproximada de 2 segundos;

tentativa 3.
```

O backoff reduz pressão sobre uma dependência temporariamente indisponível.

Sem backoff, três tentativas podem acontecer quase no mesmo instante e falhar pela mesma causa.

Não use sleeps manuais dentro do consumer.

O interceptor controla a espera.

---

### Retry local e redelivery

O interceptor stateless repete a chamada do listener dentro do processo consumidor.

```text
mesma delivery;

mesmo payload;

múltiplas invocações locais.
```

Enquanto o retry acontece:

```text
a mensagem permanece Unacked.
```

Quando uma tentativa funciona:

```text
listener retorna;

container envia ack.
```

Quando todas falham:

```text
recoverer rejeita sem requeue;

broker aplica dead-lettering.
```

O flag `redelivered` normalmente representa uma nova entrega feita pelo broker, não uma repetição local do método.

---

### Reject, nack e requeue

Do ponto de vista do broker, uma entrega pode ser:

```text
acknowledged:
processada.

rejected/nacked com requeue=true:
volta para a queue.

rejected/nacked com requeue=false:
descartada ou dead-lettered.
```

Se não existir DLX configurada, uma rejeição sem requeue pode resultar em descarte.

Nesta aula, a DLX evita que a mensagem permanente desapareça silenciosamente.

---

### Dead-letter exchange

DLX é um exchange utilizado pelo broker para republicar mensagens que saíram de uma queue por uma condição de dead lettering.

Eventos comuns incluem:

- consumer rejeitou ou aplicou nack sem requeue;
- mensagem expirou por TTL;
- limite da queue foi excedido em configuração compatível;
- delivery limit foi excedido em quorum queue.

Nesta aula, o motivo utilizado será:

```text
rejected.
```

DLX roteia.

Ela não armazena.

---

### Dead-letter queue

DLQ é uma queue ligada à DLX.

Ela armazena a mensagem para:

- inspeção;
- alerta;
- diagnóstico;
- correção;
- decisão de descarte;
- reprocessamento controlado.

A DLQ deve possuir owner.

Não é “lixeira eterna”.

Operação precisa definir:

- retenção;
- limite;
- alerta;
- acesso;
- dados sensíveis;
- procedimento;
- responsável;
- critério de descarte.

---

### x-death

Quando o RabbitMQ dead-lettera uma mensagem, ele adiciona metadata no header:

```text
x-death.
```

Essa estrutura registra informações como:

- queue de origem;
- exchange anterior;
- routing keys;
- motivo;
- quantidade;
- momento.

Use `x-death` para diagnóstico.

Não transforme seu formato interno em contrato de negócio.

A propriedade pode acumular histórico quando uma mensagem percorre mais de um ciclo de dead lettering.

---

### Queue arguments e policies

Uma queue pode receber arguments como:

```text
x-dead-letter-exchange;

x-dead-letter-routing-key.
```

A baseline declarará esses arguments pelo código para deixar o laboratório autocontido e testável.

Entretanto, alterar arguments de uma queue existente pode exigir recriação.

Em ambientes operacionais, policies do RabbitMQ frequentemente são preferíveis porque permitem administrar dead lettering sem recompilar a aplicação.

A decisão depende do modelo de ownership entre aplicação e plataforma.

---

### Reprocessamento seguro

Antes de reprocessar uma mensagem da DLQ, responda:

1. A causa foi corrigida?
2. O contrato ainda é aceito?
3. A operação é idempotente?
4. Algum efeito parcial já aconteceu?
5. A mensagem expirou semanticamente?
6. O downstream suporta nova tentativa?
7. Existe limite de reprocessamento?
8. A ação será auditada?
9. Quem aprovou?
10. Como impedir novo loop?

Nesta aula, não haverá reprocessador automático.

O laboratório fará uma nova publicação pelo endpoint original somente depois de corrigir o cenário simulado.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos"
```

Confirme o broker:

```powershell
docker ps `
  --filter "name=formacao-rabbitmq"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Confirme que fulfillment e auditoria estão funcionando antes da mudança.

---

### 2. Adicionar Spring Retry

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>
```

Não fixe versão.

O gerenciamento de dependências do Spring Boot deve manter compatibilidade.

Compile:

```powershell
.\mvnw.cmd clean compile
```

---

### 3. Adicionar nomes da DLQ

Em `RabbitTopologyNames`:

```java
public static final String FULFILLMENT_ORDERS_CREATED_DLX =
    "m16.fulfillment.orders-created.dlx.v1";

public static final String FULFILLMENT_ORDERS_CREATED_DLQ =
    "m16.fulfillment.orders-created.dlq.v1";

public static final String FULFILLMENT_ORDERS_CREATED_DEAD_KEY =
    "orders.created.dead.v1";
```

Não use o mesmo nome para DLX e DLQ.

---

### 4. Atualizar a queue principal

Na criação da queue de fulfillment:

```java
Queue fulfillmentQueue =
    QueueBuilder
        .durable(
            RabbitTopologyNames
                .FULFILLMENT_ORDERS_CREATED_QUEUE
        )
        .deadLetterExchange(
            RabbitTopologyNames
                .FULFILLMENT_ORDERS_CREATED_DLX
        )
        .deadLetterRoutingKey(
            RabbitTopologyNames
                .FULFILLMENT_ORDERS_CREATED_DEAD_KEY
        )
        .build();
```

As outras queues permanecem sem essa política nesta aula.

O erro de fulfillment não deve enviar a cópia de auditoria para a DLQ.

---

### 5. Declarar DLX e DLQ

Adicione em `RabbitMqTopologyConfiguration`:

```java
@Bean
Declarables fulfillmentDeadLetterTopology() {
    DirectExchange deadLetterExchange =
        new DirectExchange(
            RabbitTopologyNames
                .FULFILLMENT_ORDERS_CREATED_DLX,
            true,
            false
        );

    Queue deadLetterQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .FULFILLMENT_ORDERS_CREATED_DLQ
            )
            .build();

    Binding deadLetterBinding =
        BindingBuilder
            .bind(deadLetterQueue)
            .to(deadLetterExchange)
            .with(
                RabbitTopologyNames
                    .FULFILLMENT_ORDERS_CREATED_DEAD_KEY
            );

    return new Declarables(
        deadLetterExchange,
        deadLetterQueue,
        deadLetterBinding
    );
}
```

A DLQ não recebe `@RabbitListener`.

---

### 6. Recriar a queue local conscientemente

A queue:

```text
m16.fulfillment.orders-created.v1
```

já existe sem dead-letter arguments.

Se a aplicação tentar redeclará-la com arguments diferentes, o broker poderá responder:

```text
PRECONDITION_FAILED.
```

No laboratório local:

1. pare a aplicação;
2. confirme que a queue está vazia;
3. confirme que nenhum outro projeto a utiliza;
4. exclua somente essa queue pela UI;
5. mantenha exchanges e outras queues;
6. inicie a aplicação;
7. confirme a nova declaração.

Não automatize a exclusão.

Em produção, use migração ou policy administrada.

---

### 7. Criar as exceções

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/error/FulfillmentProcessingException.java
```

```java
package br.com.formacao.m16.rabbitmq.error;

public class FulfillmentProcessingException
        extends RuntimeException {

    public FulfillmentProcessingException(
        String message
    ) {
        super(message);
    }
}
```

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/error/PermanentFulfillmentException.java
```

```java
package br.com.formacao.m16.rabbitmq.error;

public class PermanentFulfillmentException
        extends RuntimeException {

    public PermanentFulfillmentException(
        String message
    ) {
        super(message);
    }
}
```

As duas exceções serão repetidas pela baseline.

A distinção ajuda a explicar a evolução futura de classificação.

---

### 8. Criar o registry de tentativas

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/processing/FulfillmentAttemptRegistry.java
```

```java
package br.com.formacao.m16.rabbitmq.processing;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class FulfillmentAttemptRegistry {

    private final Map<UUID, AtomicInteger> attempts =
        new ConcurrentHashMap<>();

    public int nextAttempt(UUID messageId) {
        return attempts
            .computeIfAbsent(
                messageId,
                ignored -> new AtomicInteger()
            )
            .incrementAndGet();
    }

    public int attemptsOf(UUID messageId) {
        AtomicInteger value = attempts.get(messageId);

        return value == null
            ? 0
            : value.get();
    }

    public Map<UUID, Integer> snapshot() {
        Map<UUID, Integer> result =
            new java.util.LinkedHashMap<>();

        attempts.forEach(
            (messageId, value) ->
                result.put(
                    messageId,
                    value.get()
                )
        );

        return Map.copyOf(result);
    }

    public void clear() {
        attempts.clear();
    }
}
```

Esse registry é somente do laboratório.

Ele não substitui idempotência persistente.

---

### 9. Criar o serviço de processamento

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/processing/FulfillmentProcessingService.java
```

```java
package br.com.formacao.m16.rabbitmq.processing;

import br.com.formacao.m16.rabbitmq.error.FulfillmentProcessingException;
import br.com.formacao.m16.rabbitmq.error.PermanentFulfillmentException;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FulfillmentProcessingService {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            FulfillmentProcessingService.class
        );

    private final FulfillmentAttemptRegistry attemptRegistry;

    public FulfillmentProcessingService(
        FulfillmentAttemptRegistry attemptRegistry
    ) {
        this.attemptRegistry = attemptRegistry;
    }

    public void process(OrderCreatedMessage message) {
        int attempt =
            attemptRegistry.nextAttempt(
                message.messageId()
            );

        LOGGER.info(
            "Fulfillment attempt={} messageId={} orderId={}",
            attempt,
            message.messageId(),
            message.orderId()
        );

        if (
            message.orderId()
                .startsWith("TRANSIENT-")
            && attempt < 3
        ) {
            throw new FulfillmentProcessingException(
                "Simulated transient fulfillment failure"
            );
        }

        if (
            message.orderId()
                .startsWith("POISON-")
        ) {
            throw new PermanentFulfillmentException(
                "Simulated permanent fulfillment failure"
            );
        }

        LOGGER.info(
            "Fulfillment completed messageId={} orderId={} attempt={}",
            message.messageId(),
            message.orderId(),
            attempt
        );
    }
}
```

Cenários:

```text
ORD-478-OK:
sucesso na primeira tentativa.

TRANSIENT-478-0001:
sucesso na terceira tentativa.

POISON-478-0001:
três falhas e DLQ.
```

---

### 10. Criar o interceptor de retry

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/config/RabbitListenerRetryConfiguration.java
```

```java
package br.com.formacao.m16.rabbitmq.config;

import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.interceptor.RetryOperationsInterceptor;

@Configuration
public class RabbitListenerRetryConfiguration {

    @Bean
    RetryOperationsInterceptor fulfillmentRetryInterceptor() {
        return RetryInterceptorBuilder
            .stateless()
            .maxAttempts(3)
            .backOffOptions(
                1_000L,
                2.0,
                4_000L
            )
            .recoverer(
                new RejectAndDontRequeueRecoverer()
            )
            .build();
    }
}
```

O recoverer rejeita sem requeue quando as tentativas acabam.

Como a queue possui DLX, o broker roteia a mensagem para a DLQ.

---

### 11. Criar uma factory específica

No mesmo arquivo, adicione imports:

```java
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.boot.autoconfigure.amqp.SimpleRabbitListenerContainerFactoryConfigurer;
```

Adicione o bean:

```java
@Bean
SimpleRabbitListenerContainerFactory
        fulfillmentRetryListenerContainerFactory(
    SimpleRabbitListenerContainerFactoryConfigurer configurer,
    ConnectionFactory connectionFactory,
    RetryOperationsInterceptor fulfillmentRetryInterceptor
) {
    SimpleRabbitListenerContainerFactory factory =
        new SimpleRabbitListenerContainerFactory();

    configurer.configure(
        factory,
        connectionFactory
    );

    factory.setAdviceChain(
        fulfillmentRetryInterceptor
    );

    factory.setDefaultRequeueRejected(false);

    return factory;
}
```

A factory utiliza as propriedades do Spring Boot e adiciona o retry apenas ao fulfillment.

Auditoria continua na factory padrão.

---

### 12. Atualizar o consumer de fulfillment

Injete:

```text
FulfillmentProcessingService.
```

Antes de registrar a observação de sucesso:

```java
fulfillmentProcessingService.process(payload);
```

Atualize a annotation:

```java
@RabbitListener(
    id = "fulfillment-orders-created",
    queues =
        RabbitTopologyNames
            .FULFILLMENT_ORDERS_CREATED_QUEUE,
    concurrency = "2",
    containerFactory =
        "fulfillmentRetryListenerContainerFactory"
)
```

Fluxo do método:

```java
OrderCreatedMessage payload =
    messageReader.read(amqpMessage);

fulfillmentProcessingService.process(payload);

ConsumedMessageObservation observation =
    observationFactory.create(
        "fulfillment",
        payload,
        amqpMessage
    );

registry.register(observation);
```

A observação de consumo concluído só é registrada após sucesso.

---

### 13. Criar endpoint de tentativas

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/web/FulfillmentAttemptsController.java
```

```java
package br.com.formacao.m16.rabbitmq.web;

import br.com.formacao.m16.rabbitmq.processing.FulfillmentAttemptRegistry;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    "/api/v1/lab/fulfillment/attempts"
)
public class FulfillmentAttemptsController {

    private final FulfillmentAttemptRegistry registry;

    public FulfillmentAttemptsController(
        FulfillmentAttemptRegistry registry
    ) {
        this.registry = registry;
    }

    @GetMapping
    public Map<UUID, Integer> findAll() {
        return registry.snapshot();
    }
}
```

Não crie endpoint para apagar a DLQ.

---

### 14. Iniciar a aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

Na UI, confirme:

```text
main fulfillment queue:
DLX configurada.

dead-letter exchange:
existente.

dead-letter queue:
existente.

DLQ consumers:
0.
```

---

### 15. Testar sucesso imediato

Publique:

```powershell
$body = @{
  orderId = "ORD-478-OK"
  customerId = "CUS-478-OK"
  total = 100.00
} |
  ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri (
    "http://localhost:8080" +
    "/api/v1/lab/orders/messages"
  ) `
  -ContentType "application/json" `
  -Body $body
```

Resultado esperado:

```text
fulfillment attempts:
1.

fulfillment observation:
1.

audit observation:
1.

DLQ:
0.
```

---

### 16. Testar falha transitória

Publique:

```powershell
$body = @{
  orderId = "TRANSIENT-478-0001"
  customerId = "CUS-478-TRANSIENT"
  total = 200.00
} |
  ConvertTo-Json

$response =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8080" +
      "/api/v1/lab/orders/messages"
    ) `
    -ContentType "application/json" `
    -Body $body
```

Observe nos logs:

```text
attempt=1;
falha;
espera;

attempt=2;
falha;
espera;

attempt=3;
sucesso.
```

Consulte:

```powershell
Invoke-RestMethod `
  "http://localhost:8080/api/v1/lab/fulfillment/attempts"
```

Resultado esperado para o messageId:

```text
3.
```

A DLQ permanece vazia.

A observação de fulfillment aparece uma vez.

---

### 17. Comprovar que retry local não é redelivery

Na observação do cenário transitório, confirme:

```text
redelivered:
false
```

ou o estado informado pela entrega original.

O método foi executado três vezes, mas o broker entregou a mensagem uma vez ao listener container.

Não use `redelivered` como contador de retry local.

---

### 18. Testar poison message

Publique:

```powershell
$body = @{
  orderId = "POISON-478-0001"
  customerId = "CUS-478-POISON"
  total = 300.00
} |
  ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri (
    "http://localhost:8080" +
    "/api/v1/lab/orders/messages"
  ) `
  -ContentType "application/json" `
  -Body $body
```

Observe:

```text
três tentativas;

recoverer;

reject sem requeue;

dead-lettering.
```

Resultado esperado:

```text
main fulfillment queue:
0 Ready após conclusão do fluxo.

fulfillment DLQ:
1 Ready.

audit:
processou sua cópia.

fulfillment success observation:
não existe.
```

---

### 19. Inspecionar a DLQ

Na UI:

```text
Queues and Streams;

m16.fulfillment.orders-created.dlq.v1;

Get messages.
```

Use:

```text
Ack mode:
Nack message requeue true
```

ou o modo equivalente que preserve a mensagem.

Inspecione:

- payload;
- content type;
- messageId;
- type;
- original routing key;
- headers;
- `x-death`.

Não use modo que remova a mensagem sem intenção.

---

### 20. Inspecionar x-death pelo HTTP API

Prepare autenticação conforme a aula 476.

Execute:

```powershell
$body = @{
  count = 1
  ackmode = "ack_requeue_true"
  encoding = "auto"
  truncate = 50000
} |
  ConvertTo-Json

$deadMessages =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://127.0.0.1:15672" +
      "/api/queues/%2F/" +
      "m16.fulfillment.orders-created.dlq.v1/get"
    ) `
    -Headers $headers `
    -Body $body

$deadMessages[0].properties.headers
```

Procure:

```text
x-death;

reason:
rejected;

queue:
m16.fulfillment.orders-created.v1;

count:
1.
```

A representação exata do JSON pode variar.

---

### 21. Confirmar ausência de loop

Aguarde pelo menos um minuto.

Confirme:

```text
DLQ Ready:
permanece 1.

logs:
não repetem tentativas.

main queue:
não recebe novamente.
```

Isso prova que:

```text
reject sem requeue
não é requeue.
```

A DLQ está sem consumer automático.

---

### 22. Corrigir e reprocessar no laboratório

Não retire a mensagem da DLQ automaticamente.

Para simular correção:

1. registre o conteúdo e o messageId;
2. reconheça que o prefixo `POISON-` causou a falha;
3. publique uma nova mensagem pelo endpoint com:
   `ORD-478-REPROCESSED`;
4. confirme sucesso;
5. somente depois remova manualmente a mensagem antiga da DLQ;
6. registre a ação no diário.

Essa não é uma estratégia produtiva completa.

Ela demonstra que reprocessar só deve ocorrer depois da correção da causa.

---

### 23. Testar broker parado durante retry

Não pare o broker no meio do processamento como teste obrigatório.

A conexão pode cair com mensagem Unacked e provocar redelivery após recuperação.

Esse cenário pertence a testes de confiabilidade mais avançados.

A baseline desta aula valida falha de processamento, não falha de infraestrutura durante ack.

---

### 24. Criar teste da topologia de dead letter

Valide:

```text
DLX:
nome e tipo.

DLQ:
durable.

binding:
routing key de dead letter.

main queue:
arguments corretos.
```

Exemplo de asserção dos arguments:

```java
assertThat(
    fulfillmentQueue.getArguments()
)
    .containsEntry(
        "x-dead-letter-exchange",
        RabbitTopologyNames
            .FULFILLMENT_ORDERS_CREATED_DLX
    )
    .containsEntry(
        "x-dead-letter-routing-key",
        RabbitTopologyNames
            .FULFILLMENT_ORDERS_CREATED_DEAD_KEY
    );
```

Não conecte ao broker nesse teste estrutural.

---

### 25. Criar teste do serviço

Cenário transitório:

```java
assertThatThrownBy(
    () -> service.process(message)
)
    .isInstanceOf(
        FulfillmentProcessingException.class
    );

assertThatThrownBy(
    () -> service.process(message)
)
    .isInstanceOf(
        FulfillmentProcessingException.class
    );

assertThatCode(
    () -> service.process(message)
)
    .doesNotThrowAnyException();
```

Cenário poison:

```java
assertThatThrownBy(
    () -> service.process(poisonMessage)
)
    .isInstanceOf(
        PermanentFulfillmentException.class
    );
```

O teste do serviço não mede o backoff.

---

### 26. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=RabbitMqDeadLetterTopologyTest,FulfillmentProcessingServiceTest,RabbitListenerRetryConfigurationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 27. Revisar a configuração

Confirme:

```text
max attempts:
3.

initial interval:
1000 ms.

multiplier:
2.

max interval:
4000 ms.

recoverer:
RejectAndDontRequeueRecoverer.

default requeue rejected:
false.

DLQ consumer:
nenhum.

audit retry:
não alterado.
```

---

## Entendendo o que foi feito

### Retry deixou de ser infinito

O listener executa no máximo três vezes.

### Backoff reduziu pressão

As tentativas não acontecem no mesmo instante.

### A mensagem permaneceu Unacked durante retry

O broker ainda aguardava a decisão do consumer.

### Sucesso transitório terminou em ack

A terceira tentativa retornou normalmente.

### Falha permanente saiu da queue principal

O recoverer rejeitou sem requeue.

### DLX e DLQ tiveram papéis separados

DLX roteou; DLQ armazenou.

### x-death preservou contexto operacional

A mensagem registrou a origem e o motivo do dead lettering.

### Auditoria permaneceu independente

A cópia da auditoria não foi afetada pela falha de fulfillment.

### O loop foi interrompido

A DLQ sem consumer automático manteve a mensagem estável.

### Reprocessamento ficou condicionado à correção

A mensagem não voltou automaticamente ao fluxo principal.

---

## Erros comuns importantes

### Requeue infinito

A poison message consome capacidade sem progresso.

### Retry sem backoff

O consumer pressiona ainda mais a dependência indisponível.

### Retry de todas as exceções para sempre

Falhas permanentes ficam caras e barulhentas.

### DLQ sem owner

Mensagens acumulam sem resposta operacional.

### DLQ consumida automaticamente

O sistema cria um segundo loop invisível.

### Confundir DLX e DLQ

Exchange roteia; queue armazena.

### Criar DLQ sem binding

Mensagens podem não encontrar destino.

### Rejeitar sem DLX

A mensagem pode ser descartada.

### Alterar queue arguments sem migração

O broker rejeita a declaração incompatível.

### Apagar queue com mensagens

Dados ainda não processados são perdidos.

### Tratar x-death como contrato de domínio

É metadata do broker.

### Reprocessar sem idempotência

Efeitos já aplicados podem ocorrer novamente.

### Interpretar retry local como redelivery

O flag não conta invocações do interceptor.

### Acreditar que DLQ resolve a causa

Ela apenas preserva e isola.

---

## Comandos úteis

### Iniciar broker

```powershell
docker start `
  "formacao-rabbitmq"
```

### Iniciar aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Consultar tentativas

```powershell
Invoke-RestMethod `
  "http://localhost:8080/api/v1/lab/fulfillment/attempts"
```

### Consultar a DLQ

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri (
    "http://127.0.0.1:15672" +
    "/api/queues/%2F/" +
    "m16.fulfillment.orders-created.dlq.v1"
  ) `
  -Headers $headers
```

### Procurar configuração

```powershell
git grep `
  -n `
  -E `
  "maxAttempts|backOffOptions|RejectAndDontRequeueRecoverer|deadLetterExchange|deadLetterRoutingKey"
```

---

## Exercício guiado

### Parte 1 — Topologia

Crie DLX, DLQ e binding.

### Parte 2 — Migração local

Recrie apenas a queue vazia e incompatível.

### Parte 3 — Retry

Configure três tentativas com backoff.

### Parte 4 — Transitório

Faça a terceira tentativa funcionar.

### Parte 5 — Poison

Envie a mensagem para a DLQ.

### Parte 6 — Metadata

Inspecione `x-death`.

### Parte 7 — Independência

Confirme auditoria concluída.

### Parte 8 — Sem loop

Aguarde e valide estabilidade da DLQ.

### Parte 9 — Reprocessamento

Corrija a causa antes de uma nova publicação.

### Parte 10 — Testes

Valide topologia, serviço e configuração.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 477 foi preservada;
- o mesmo laboratório foi evoluído;
- Spring Retry foi adicionado sem versão manual;
- retry foi limitado;
- max attempts foi definido como três;
- max attempts incluiu a primeira execução;
- backoff inicial foi configurado;
- multiplicador foi configurado;
- intervalo máximo foi configurado;
- sleep manual não foi usado;
- retry stateless foi usado;
- retry local foi diferenciado de redelivery;
- mensagem permaneceu Unacked durante retry;
- sucesso transitório ocorreu na terceira tentativa;
- observação de sucesso foi registrada uma vez;
- poison message foi simulada;
- tentativas esgotadas foram registradas;
- recoverer rejeita sem requeue;
- default requeue rejected ficou false;
- requeue infinito foi impedido;
- DLX foi criada;
- DLQ foi criada;
- DLX foi diferenciada da DLQ;
- DLQ é durável;
- binding de dead letter foi criado;
- routing key de dead letter foi explícita;
- main queue recebeu dead-letter arguments;
- queue incompatível foi recriada conscientemente;
- exclusão automática foi proibida;
- migração produtiva foi mencionada;
- policies foram contextualizadas;
- auditoria permaneceu independente;
- poison message chegou à DLQ;
- main queue ficou livre;
- DLQ permaneceu sem consumer;
- ausência de loop foi comprovada;
- `x-death` foi inspecionado;
- reason rejected foi observado;
- queue de origem foi observada;
- count foi observado;
- `x-death` não virou contrato de negócio;
- reprocessador automático não foi criado;
- causa foi corrigida antes de nova publicação;
- idempotência foi considerada;
- falhas transitórias e permanentes foram diferenciadas;
- classificação avançada ficou como evolução;
- publisher confirms não foram antecipados;
- manual ack não foi antecipado;
- retry por TTL não foi antecipado;
- delayed exchange não foi antecipado;
- Kafka não foi antecipado;
- outbox, inbox, saga e CDC não foram antecipados;
- testes estruturais foram criados;
- teste do serviço foi criado;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 479 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure configurações perigosas:

```powershell
git grep `
  -n `
  -E `
  "requeue.?true|while.*retry|Thread\\.sleep|DLQ|x-death|RejectAndDontRequeueRecoverer"
```

Adicione:

```powershell
git add `
  labs/m16/aula-475-rabbitmq-fundamentos `
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
git commit -m "feat(m16): adicionar retry e DLQ no RabbitMQ"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- mensagens exportadas da DLQ;
- payload real;
- logs;
- volume do broker;
- queue definitions completas sem revisão;
- reprocessador automático;
- retry infinito;
- código temporário;
- DLQ consumer experimental.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o fluxo de consumo passou a possuir uma política explícita de falha.

O caminho ficou:

```text
delivery;

retry limitado;

backoff;

sucesso e ack;

ou

tentativas esgotadas;

reject sem requeue;

DLX;

DLQ.
```

Você comprovou que:

- falha transitória pode funcionar em nova tentativa;
- retry precisa de limite;
- backoff reduz pressão;
- retry local não é redelivery do broker;
- poison message não deve permanecer na queue principal;
- rejeição sem requeue ativa dead lettering quando existe DLX;
- DLX roteia e DLQ armazena;
- `x-death` registra contexto operacional;
- auditoria continua independente;
- DLQ sem consumer automático interrompe o ciclo;
- reprocessamento exige correção e análise de idempotência;
- DLQ não corrige o defeito;
- queue arguments incompatíveis exigem migração.

A sequência de RabbitMQ foi concluída no nível planejado para esta etapa:

```text
475:
fundamentos.

476:
topologia.

477:
producers e consumers.

478:
retry e DLQ.
```

A próxima aula será:

```text
479 - M16.24 - Kafka fundamentos
```

Nela, você irá:

- compreender log distribuído;
- diferenciar queue e stream;
- conhecer broker, topic e record;
- entender retenção;
- compreender replay;
- diferenciar consumer RabbitMQ e consumer Kafka;
- criar o primeiro ambiente Kafka local;
- produzir e consumir registros;
- preparar partitions e offsets.

A aula 479 não substituirá RabbitMQ por Kafka.

Ela iniciará uma comparação baseada no problema que cada tecnologia resolve.

---

# Material complementar

## Checkpoint final

- [ ] Configurei retry limitado.
- [ ] Adicionei backoff.
- [ ] Criei DLX e DLQ.
- [ ] Enviei poison message para a DLQ.
- [ ] Inspecionei `x-death`.
- [ ] Impedi requeue infinito.
- [ ] Executei os testes e o commit.

---

## Troubleshooting adicional

### PRECONDITION_FAILED no startup

A queue antiga ainda possui arguments diferentes.

Pare a aplicação, confirme que está vazia e recrie somente no ambiente local.

### Mensagem continua voltando para a main queue

Revise:

```text
RejectAndDontRequeueRecoverer;

defaultRequeueRejected=false;

nenhum handler convertendo para requeue.
```

### DLQ permanece vazia

Confirme:

- DLX no argument da main queue;
- routing key;
- binding;
- exceção realmente esgotou o retry;
- queue correta;
- aplicação conectada ao virtual host correto.

### Tentativas acontecem sem espera

Revise `backOffOptions`.

Confirme que o listener usa a factory customizada.

### Audit também falha

A cópia de auditoria pode estar usando lógica compartilhada incorreta.

O retry de fulfillment não deve ser aplicado à factory padrão.

### Redelivered continua false

Isso é esperado para retry local na mesma delivery.

### x-death não aparece

Confirme que a mensagem foi dead-lettered pelo broker, não publicada diretamente na DLQ.

### DLQ cresce continuamente

Crie alerta, identifique a causa e pause o producer ou consumer quando necessário.

### Reprocessamento falha novamente

A causa não foi corrigida, o contrato expirou ou o processamento não é seguro para repetir.

### Aplicação fica lenta durante poison messages

Backoff ocorre na thread do consumer. Limite de tentativas, concorrência e quantidade de poison messages precisam ser controlados.

---

## Perguntas de revisão

1. O que é falha transitória?
2. O que é falha permanente?
3. O que é poison message?
4. Por que retry precisa de limite?
5. O que backoff faz?
6. Max attempts três significa quantas execuções?
7. Retry local é redelivery?
8. O que ocorre durante retry?
9. O que faz o recoverer?
10. O que significa requeue false?
11. O que é DLX?
12. O que é DLQ?
13. Quem armazena a mensagem?
14. O que é `x-death`?
15. Qual reason foi utilizado?
16. Auditoria falha junto?
17. DLQ deve ter consumer automático?
18. O que verificar antes de reprocessar?
19. Kafka foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Pode desaparecer em nova tentativa.
2. Não tende a mudar apenas esperando.
3. Mensagem que falha repetidamente.
4. Para impedir ciclos e pressão infinita.
5. Espera entre tentativas.
6. Três.
7. Não.
8. A mesma delivery fica Unacked.
9. Decide após tentativas esgotadas.
10. Não voltar à queue de origem.
11. Exchange de dead letter.
12. Queue de dead letter.
13. DLQ.
14. Metadata do histórico de dead lettering.
15. Rejected.
16. Não, possui cópia independente.
17. Não cegamente.
18. Causa, idempotência e efeitos anteriores.
19. Não.
20. Kafka fundamentos.

---

## Desafio opcional

Crie retry e DLQ para:

```text
m16.billing.orders-cancelled.v1.
```

Requisitos:

- DLX própria;
- DLQ própria;
- routing key própria;
- três tentativas;
- backoff;
- poison message de cancelamento;
- auditoria ou outro consumer independente;
- teste estrutural;
- inspeção de `x-death`;
- nenhuma queue de retry por TTL;
- nenhum reprocessador automático;
- nenhuma reutilização da DLQ de fulfillment.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 478 - M16.23 - Retry e DLQ RabbitMQ

- Continuei no laboratório RabbitMQ das aulas 475 a 477.
- Diferenciei falha transitória e permanente.
- Entendi poison messages.
- Adicionei Spring Retry sem versão manual.
- Criei retry stateless no listener.
- Limitei o processamento a três tentativas.
- Entendi que max attempts inclui a primeira execução.
- Configurei backoff exponencial limitado.
- Não usei sleep manual.
- Mantive a mensagem Unacked durante o retry local.
- Diferenciei retry local de redelivery do broker.
- Criei uma falha transitória que funciona na terceira tentativa.
- Criei uma poison message que falha sempre.
- Usei `RejectAndDontRequeueRecoverer`.
- Configurei `defaultRequeueRejected=false`.
- Impedi requeue infinito.
- Criei uma dead-letter exchange.
- Criei uma dead-letter queue durável.
- Criei binding com routing key de dead letter.
- Configurei dead-letter arguments na queue de fulfillment.
- Recriei conscientemente a queue local incompatível.
- Não automatizei exclusão de queues.
- Mantive auditoria independente.
- Enviei poison message para a DLQ.
- Inspecionei payload e propriedades.
- Inspecionei o header `x-death`.
- Observei reason `rejected`.
- Observei queue de origem e count.
- Comprovei ausência de loop.
- Mantive a DLQ sem consumer automático.
- Corrigi a causa antes de uma nova publicação.
- Considerei idempotência antes de reprocessar.
- Criei testes da topologia de dead letter.
- Criei teste do serviço de processamento.
- Não antecipei retry por TTL, delayed exchange ou Kafka.
- Próxima aula: Kafka fundamentos.
```

---

## Referência técnica curta

- Spring AMQP Reference — Exception Handling.
- Spring AMQP Reference — Resilience: Recovering from Errors and Broker Failures.
- Spring AMQP API — `RetryInterceptorBuilder`.
- Spring AMQP API — `RejectAndDontRequeueRecoverer`.
- RabbitMQ Documentation — Dead Letter Exchanges.
- RabbitMQ Documentation — Consumer Acknowledgements.
- RabbitMQ Documentation — Negative Acknowledgements.
- RabbitMQ Documentation — Queues and Redelivery.
- RabbitMQ Documentation — Reliability Guide.
- RabbitMQ HTTP API Reference.

Regra final:

```text
falhas de consumo precisam de uma política limitada e observável: operações potencialmente transitórias podem ser repetidas poucas vezes com backoff; a mensagem permanece Unacked durante retry local e só recebe ack quando o processamento termina; quando as tentativas se esgotam, o consumer rejeita sem requeue, a queue de origem dead-lettera para uma DLX e a DLQ preserva a mensagem com metadata x-death; auditoria e outras capacidades continuam independentes porque possuem queues próprias; DLQ não é descarte silencioso nem mecanismo de retry automático, mas um ponto operacional com owner, diagnóstico, retenção e reprocessamento controlado após correção da causa e análise de idempotência.
```
