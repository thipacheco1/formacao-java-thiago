# 475 - M16.20 - RabbitMQ fundamentos

## Apresentação da aula

Na aula 474, você criou uma proteção importante para integrações HTTP: os consumers passaram a registrar suas expectativas com Pact, o provider passou a verificar essas interações contra a aplicação real e o processo de deploy ganhou uma matriz de compatibilidade por versão.

O fluxo estudado ficou assim:

```text
consumer HTTP;

contrato Pact;

provider verification;

Pact Broker;

can-i-deploy;

deploy controlado.
```

Esse modelo continua valioso quando um sistema precisa chamar outro e aguardar uma resposta imediata. Entretanto, nem toda colaboração entre sistemas precisa acontecer como uma chamada síncrona.

Considere um serviço de pedidos. Depois que um pedido é confirmado, várias ações podem ser necessárias:

```text
enviar e-mail;

reservar estoque;

gerar cobrança;

atualizar analytics;

notificar antifraude;

registrar auditoria.
```

Uma implementação ingênua poderia fazer tudo dentro da mesma request HTTP:

```text
cliente
   |
   v
order-service
   |
   +--> inventory-service
   |
   +--> billing-service
   |
   +--> notification-service
   |
   +--> analytics-service
```

Esse desenho aumenta latência e faz a operação principal depender da disponibilidade de funções secundárias. Também concentra no serviço de pedidos a recuperação de várias integrações.

A pergunta central desta aula será:

```text
como desacoplar a produção de um trabalho

do momento em que esse trabalho é processado,

permitindo que outro componente o execute

de forma assíncrona e controlada?
```

A resposta prática será a introdução de um broker de mensagens:

```text
RabbitMQ.
```

O fluxo básico será:

```text
producer
   |
   | publica uma mensagem
   v
RabbitMQ
   |
   | armazena e entrega
   v
queue
   |
   | disponibiliza a mensagem
   v
consumer
```

Nesta aula, o laboratório implementará o caminho mínimo completo:

```text
request HTTP de laboratório;

producer Spring;

RabbitTemplate;

RabbitMQ;

queue durável;

mensagem JSON;

consumer com @RabbitListener;

acknowledgement automático;

validação pela interface de management;

validação pela aplicação.
```

O laboratório usará a exchange padrão do RabbitMQ de maneira intencional. Isso permitirá publicar diretamente para uma queue conhecida usando o nome da queue como routing key.

A próxima aula será dedicada a:

```text
exchanges;

queues;

bindings;

routing keys;

modelos de roteamento.
```

Por isso, nesta aula não serão aprofundados:

- direct exchange customizada;
- topic exchange;
- fanout exchange;
- headers exchange;
- bindings customizados;
- múltiplas queues;
- retry;
- dead-letter queue;
- poison message;
- Kafka;
- outbox;
- inbox;
- saga;
- CDC;
- contratos de mensagens;
- observabilidade avançada do broker.

Também não será criado um projeto final de mensageria. O objetivo é estabelecer a fundação correta para que as próximas aulas aprofundem cada decisão sem confundir conceitos.

---

## Onde estamos na formação

A sequência oficial do M16 agora é:

```text
472:
Contratos de integração.

473:
WireMock aplicado.

474:
Testes de contrato.

475:
RabbitMQ fundamentos.

476:
Exchanges queues bindings.

477:
Producers consumers.

478:
Retry e DLQ RabbitMQ.
```

A aula 474 respondeu:

```text
como verificar se versões reais

de consumers e providers HTTP

continuam compatíveis?
```

A aula 475 responderá:

```text
como publicar um trabalho

para processamento assíncrono

por meio de um broker?
```

Nesta aula:

```text
comunicação assíncrona:
sim.

RabbitMQ local:
sim.

producer:
sim.

consumer:
sim.

queue:
sim.

connection:
sim, em nível fundamental.

channel:
sim, em nível fundamental.

acknowledgement:
sim, conceitual e observado.

queue durável:
sim.

mensagem persistente:
sim.

management UI:
sim.

exchange padrão:
sim.

exchange customizada:
não.

bindings em profundidade:
não.

retry:
não.

DLQ:
não.

Kafka:
não.

outbox:
não.

saga:
não.
```

A regra central será:

```text
producer publica uma intenção ou fato;

broker recebe, armazena e entrega;

consumer processa;

ack confirma que a entrega

pode ser removida da queue.
```

---

## Objetivo prático

Ao final da aula, você terá um laboratório Spring Boot em:

```text
labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos
```

Estrutura principal:

```text
rabbitmq-fundamentos
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/m16/rabbitmq
│   │   │       ├── RabbitMqFundamentosApplication.java
│   │   │       ├── config
│   │   │       │   └── RabbitMqFundamentosConfiguration.java
│   │   │       ├── consumer
│   │   │       │   └── OrderMessageConsumer.java
│   │   │       ├── message
│   │   │       │   └── OrderCreatedMessage.java
│   │   │       ├── observation
│   │   │       │   └── ConsumedMessageRegistry.java
│   │   │       ├── producer
│   │   │       │   └── OrderMessagePublisher.java
│   │   │       └── web
│   │   │           ├── OrderMessageController.java
│   │   │           ├── PublishOrderMessageRequest.java
│   │   │           └── PublishOrderMessageResponse.java
│   │   └── resources
│   │       └── application.yaml
│   └── test
│       └── java
│           └── br/com/formacao/m16/rabbitmq
│               └── RabbitMqFundamentosApplicationTests.java
└── README.md
```

O broker local será executado em um container chamado:

```text
formacao-rabbitmq
```

Portas:

```text
5672:
protocolo AMQP usado pela aplicação.

15672:
interface HTTP de gerenciamento.
```

Queue do laboratório:

```text
m16.orders.created.v1
```

Fluxo HTTP para publicação:

```text
POST /api/v1/lab/orders/messages
```

Fluxo para observar mensagens consumidas:

```text
GET /api/v1/lab/orders/messages/consumed
```

---

## Conceito essencial

### Comunicação síncrona

Em uma comunicação síncrona, o chamador normalmente espera a resposta para continuar.

Exemplo:

```text
order-service
   |
   | GET /products/SKU-1001/availability
   v
catalog-service
   |
   | 200 OK
   v
order-service continua
```

Esse modelo é apropriado quando a resposta é necessária naquele momento.

Exemplos:

- validar credencial;
- consultar disponibilidade antes de confirmar uma compra;
- calcular frete que precisa aparecer na tela;
- obter uma informação necessária para decidir o resultado da operação.

O acoplamento temporal é explícito:

```text
para o chamador concluir agora,

o provider precisa responder agora.
```

### Comunicação assíncrona

Na comunicação assíncrona, o producer publica uma mensagem e não espera que o consumer conclua o trabalho dentro da mesma interação.

Exemplo:

```text
order-service
   |
   | order created
   v
RabbitMQ
   |
   | entrega depois
   v
notification-consumer
```

O producer ainda depende do broker para publicar. Porém ele não precisa aguardar o processamento final do consumer.

Isso reduz o acoplamento temporal entre producer e consumer:

```text
o consumer não precisa estar

processando exatamente no instante

em que o producer publica.
```

Reduzir acoplamento não significa remover todos os acoplamentos. Producer e consumer continuam compartilhando expectativas sobre:

- significado da mensagem;
- estrutura do payload;
- identificação;
- versionamento;
- ordem esperada;
- regras de repetição;
- segurança;
- retenção.

Esses contratos serão aprofundados em aulas posteriores.

### O que é RabbitMQ

RabbitMQ é um broker de mensagens. Ele recebe mensagens de publishers, aplica regras de roteamento e disponibiliza entregas para consumers.

Nesta primeira aula, pense no broker como uma infraestrutura intermediária com responsabilidades próprias:

```text
aceitar conexões;

receber publicações;

manter queues;

entregar mensagens;

controlar acknowledgements;

redeliver quando necessário;

expor informações operacionais.
```

RabbitMQ não executa a regra de negócio do pedido. Ele não envia o e-mail por conta própria e não reserva estoque. Essas responsabilidades pertencem aos consumers.

### Producer, broker, queue e consumer

O fluxo possui quatro responsabilidades. O producer cria e publica a mensagem; o broker recebe e entrega; a queue mantém mensagens disponíveis; o consumer processa as entregas. No laboratório, `OrderMessagePublisher` será o producer e `OrderMessageConsumer` será o consumer.

Publicar com sucesso não significa que o consumer terminou. A resposta HTTP será `202 Accepted` para indicar aceitação da publicação, não conclusão da regra de negócio.

A queue `m16.orders.created.v1` permitirá que producer e consumer trabalhem em ritmos diferentes. Se o consumer estiver parado, mensagens podem aguardar. Esse acúmulo exige capacidade e monitoramento em ambientes reais.

RabbitMQ não executa a regra do pedido. Ele oferece infraestrutura para conexões, queues, entrega e acknowledgements; a regra de negócio continua pertencendo aos consumers.

### Exchange padrão

No modelo AMQP 0-9-1 usado pelo RabbitMQ, producers publicam em exchanges. Exchanges roteiam mensagens para queues por meio de bindings.

Mesmo quando o código parece publicar diretamente para uma queue, existe uma exchange envolvida.

RabbitMQ oferece uma exchange padrão, sem nome. Cada queue declarada é ligada automaticamente a essa exchange usando o próprio nome da queue como routing key.

Nesta aula, o producer usará:

```java
rabbitTemplate.convertAndSend(
    RabbitMqFundamentosConfiguration.ORDERS_CREATED_QUEUE,
    payload,
    messagePostProcessor
);
```

Essa sobrecarga envia para a exchange padrão e usa o primeiro argumento como routing key.

Esse atalho é adequado para o laboratório fundamental. Na aula 476, você declarará exchanges e bindings explicitamente e compreenderá diferentes modelos de roteamento.

### Routing key

Routing key é um valor usado pelo broker durante o roteamento.

Na exchange padrão:

```text
routing key = nome exato da queue.
```

No laboratório:

```text
m16.orders.created.v1.
```

Em exchanges customizadas, o significado da routing key dependerá do tipo de exchange e dos bindings. Isso pertence à próxima aula.

### Connection e channel

Connection é a conexão de rede reutilizável entre aplicação e RabbitMQ. Channel é uma sessão lógica mais leve sobre essa connection. Operações AMQP são executadas em channels, evitando abrir uma conexão TCP para cada mensagem.

Spring Boot cria a infraestrutura a partir de `spring.rabbitmq.*`; `RabbitTemplate` e os listener containers reutilizam connections e gerenciam channels. O código de negócio não deve abrir sockets ou channels manualmente.

### Mensagem, acknowledgement e redelivery

Uma mensagem possui body e propriedades, como content type, message ID, timestamp e delivery mode. O body do laboratório será JSON com `messageId`, `messageType`, `occurredAt`, `orderId`, `customerId` e `total`. Não publique entidade JPA diretamente; use um modelo próprio e estável.

Acknowledgement, ou ack, confirma ao broker que a entrega pode ser removida da queue. No modo automático usado nesta aula, o retorno normal do listener permite o ack; uma exceção aciona a política de falha do container. Retry, DLQ e ack manual ficam para aulas posteriores.

Uma mensagem pode ser entregue novamente. Por exemplo, o consumer pode processar e perder a conexão antes de o ack chegar. Portanto, não presuma exactly once: consumers precisam tolerar redelivery e, em cenários reais, aplicar idempotência ou deduplicação.

A queue será durável e a mensagem será marcada como persistente. Durabilidade preserva a definição da queue; persistência é uma propriedade da mensagem. A combinação melhora a recuperação, mas não promete perda zero sem publisher confirms, tipo de queue, armazenamento e políticas operacionais adequadas.

### Quando usar e quando evitar

Mensageria não é uma chamada remota disfarçada. Se o producer precisa da resposta agora, HTTP pode ser mais simples. RabbitMQ é útil quando o trabalho pode ser processado depois, producers e consumers possuem ritmos diferentes, picos precisam ser absorvidos ou vários workers precisam dividir entregas.

Evite adicionar broker quando uma chamada local resolve, a equipe não consegue operá-lo, não existe política para mensagens repetidas ou o usuário depende de resposta imediata. Mensageria reduz acoplamento temporal, mas adiciona contratos, estados e novas formas de falha.

---

## Mão na massa guiada

### 1. Criar a pasta do laboratório

Na raiz da formação:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "labs/m16/aula-475-rabbitmq-fundamentos" |
  Out-Null

Set-Location `
  "labs/m16/aula-475-rabbitmq-fundamentos"
```

Crie o projeto Spring Boot com Java 21 e Maven usando o mesmo padrão de versão adotado pela formação.

Nome:

```text
rabbitmq-fundamentos
```

Group:

```text
br.com.formacao.m16
```

Artifact:

```text
rabbitmq-fundamentos
```

Package:

```text
br.com.formacao.m16.rabbitmq
```

Dependências:

```text
Spring Web;

Spring for RabbitMQ;

Validation;

Spring Boot Test.
```

Não adicione Kafka, Spring Integration, Spring Cloud Stream ou bibliotecas de retry.

### 2. Iniciar RabbitMQ local

Crie um volume:

```powershell
docker volume create `
  "formacao-rabbitmq-data"
```

Remova um container antigo, se existir:

```powershell
docker rm -f `
  "formacao-rabbitmq" `
  2>$null
```

Inicie o broker:

```powershell
docker run `
  --name "formacao-rabbitmq" `
  --detach `
  --hostname "formacao-rabbitmq" `
  --publish "5672:5672" `
  --publish "127.0.0.1:15672:15672" `
  --env "RABBITMQ_DEFAULT_USER=formacao" `
  --env "RABBITMQ_DEFAULT_PASS=formacao-local" `
  --mount "type=volume,source=formacao-rabbitmq-data,target=/var/lib/rabbitmq" `
  rabbitmq:management
```

A tag `management` é suficiente para o laboratório local e inclui a interface de gerenciamento. Em pipelines e ambientes controlados, a organização deve fixar uma versão ou digest aprovado em vez de depender de uma tag mutável.

### 3. Verificar o broker

Acompanhe os logs:

```powershell
docker logs `
  --follow `
  "formacao-rabbitmq"
```

Interrompa o acompanhamento com `Ctrl + C` depois que o broker estiver pronto.

Liste o container:

```powershell
docker ps `
  --filter "name=formacao-rabbitmq"
```

Teste a porta AMQP:

```powershell
Test-NetConnection `
  -ComputerName "localhost" `
  -Port 5672
```

Resultado esperado:

```text
TcpTestSucceeded:
True.
```

### 4. Acessar a interface de gerenciamento

Abra no navegador:

```text
http://127.0.0.1:15672
```

Credenciais locais:

```text
usuário:
formacao

senha:
formacao-local
```

Observe as áreas:

```text
Overview;

Connections;

Channels;

Exchanges;

Queues and Streams.
```

Não altere configurações avançadas.

Antes da aplicação iniciar, a queue do laboratório ainda não deve existir.

### 5. Revisar o pom.xml

Entre no projeto:

```powershell
Set-Location `
  "rabbitmq-fundamentos"
```

Confirme a dependency AMQP:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

Confirme Web:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Confirme Validation:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Não fixe manualmente versões gerenciadas pelo Spring Boot.

Compile:

```powershell
.\mvnw.cmd clean compile
```

### 6. Configurar conexão

Arquivo:

```text
src/main/resources/application.yaml
```

Conteúdo:

```yaml
spring:
  application:
    name: "rabbitmq-fundamentos"

  rabbitmq:
    host: "${RABBITMQ_HOST:localhost}"
    port: "${RABBITMQ_PORT:5672}"
    username: "${RABBITMQ_USERNAME:formacao}"
    password: "${RABBITMQ_PASSWORD:formacao-local}"
    virtual-host: "${RABBITMQ_VIRTUAL_HOST:/}"

    listener:
      simple:
        acknowledge-mode: "auto"
        prefetch: 1

server:
  port: "${SERVER_PORT:8090}"

logging:
  level:
    org.springframework.amqp.rabbit.connection: "INFO"
    org.springframework.amqp.rabbit.listener: "INFO"
```

O `prefetch: 1` facilita observar o laboratório com um processamento por vez. Estratégias de throughput serão tratadas depois.

Não coloque credenciais de produção no arquivo. Os valores default existem apenas para o broker local da aula.

### 7. Criar a classe principal

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/RabbitMqFundamentosApplication.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RabbitMqFundamentosApplication {

    public static void main(String[] args) {
        SpringApplication.run(
            RabbitMqFundamentosApplication.class,
            args
        );
    }
}
```

### 8. Declarar a queue

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/config/RabbitMqFundamentosConfiguration.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqFundamentosConfiguration {

    public static final String ORDERS_CREATED_QUEUE =
        "m16.orders.created.v1";

    @Bean
    Queue ordersCreatedQueue() {
        return QueueBuilder
            .durable(ORDERS_CREATED_QUEUE)
            .build();
    }
}
```

Quando a aplicação iniciar, a infraestrutura do Spring AMQP declarará a queue no broker.

A queue é durável, não exclusiva e não auto-delete.

Essas decisões significam:

```text
durable:
metadata pode sobreviver ao restart do broker.

exclusive false:
não pertence apenas a uma conexão.

auto-delete false:
não é removida automaticamente
quando o último consumer sai.
```

### 9. Criar o modelo da mensagem

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/message/OrderCreatedMessage.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.message;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderCreatedMessage(
    UUID messageId,
    String messageType,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

O record representa o payload do laboratório.

Não coloque entidade JPA diretamente na mensagem. Mensagens precisam de modelos próprios e estáveis.

### 10. Criar o request HTTP

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/web/PublishOrderMessageRequest.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.web;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PublishOrderMessageRequest(
    @NotBlank
    String orderId,

    @NotBlank
    String customerId,

    @NotNull
    @DecimalMin("0.01")
    BigDecimal total
) {
}
```

### 11. Criar a response HTTP

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/web/PublishOrderMessageResponse.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.web;

import java.time.Instant;
import java.util.UUID;

public record PublishOrderMessageResponse(
    UUID messageId,
    String status,
    Instant acceptedAt
) {
}
```

O status será:

```text
PUBLISH_REQUEST_ACCEPTED.
```

Ele não afirmará que o consumer concluiu o trabalho.

### 12. Criar o producer

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/producer/OrderMessagePublisher.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.producer;

import br.com.formacao.m16.rabbitmq.config.RabbitMqFundamentosConfiguration;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderMessagePublisher {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public OrderMessagePublisher(
        RabbitTemplate rabbitTemplate,
        ObjectMapper objectMapper
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public void publish(OrderCreatedMessage message) {
        String payload = serialize(message);

        rabbitTemplate.convertAndSend(
            RabbitMqFundamentosConfiguration.ORDERS_CREATED_QUEUE,
            payload,
            amqpMessage -> {
                MessageProperties properties =
                    amqpMessage.getMessageProperties();

                properties.setContentType(
                    MessageProperties.CONTENT_TYPE_JSON
                );
                properties.setContentEncoding("UTF-8");
                properties.setMessageId(
                    message.messageId().toString()
                );
                properties.setType(
                    message.messageType()
                );
                properties.setTimestamp(
                    java.util.Date.from(message.occurredAt())
                );
                properties.setDeliveryMode(
                    MessageDeliveryMode.PERSISTENT
                );

                return amqpMessage;
            }
        );
    }

    private String serialize(OrderCreatedMessage message) {
        try {
            return objectMapper.writeValueAsString(message);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                "Could not serialize order message",
                exception
            );
        }
    }
}
```

O laboratório serializa explicitamente para JSON, mantendo o payload visível. Em projetos maiores, um `MessageConverter` pode centralizar essa responsabilidade conforme a versão do Spring AMQP e a política de interoperabilidade.

### 13. Criar o registro de observação

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/observation/ConsumedMessageRegistry.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.observation;

import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;

@Component
public class ConsumedMessageRegistry {

    private final List<OrderCreatedMessage> messages =
        new CopyOnWriteArrayList<>();

    public void register(OrderCreatedMessage message) {
        messages.add(message);
    }

    public List<OrderCreatedMessage> findAll() {
        return List.copyOf(messages);
    }

    public void clear() {
        messages.clear();
    }
}
```

Esse registry existe somente para validar o laboratório. Ele não substitui persistência de negócio.

Ao reiniciar a aplicação, a lista em memória será perdida. As mensagens já confirmadas também não voltarão para a queue apenas porque o registry foi apagado.

### 14. Criar o consumer

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/consumer/OrderMessageConsumer.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.consumer;

import br.com.formacao.m16.rabbitmq.config.RabbitMqFundamentosConfiguration;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageRegistry;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderMessageConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(OrderMessageConsumer.class);

    private final ObjectMapper objectMapper;
    private final ConsumedMessageRegistry registry;

    public OrderMessageConsumer(
        ObjectMapper objectMapper,
        ConsumedMessageRegistry registry
    ) {
        this.objectMapper = objectMapper;
        this.registry = registry;
    }

    @RabbitListener(
        queues = RabbitMqFundamentosConfiguration.ORDERS_CREATED_QUEUE
    )
    public void consume(
        org.springframework.amqp.core.Message amqpMessage
    ) {
        String payload = new String(
            amqpMessage.getBody(),
            StandardCharsets.UTF_8
        );

        OrderCreatedMessage message = deserialize(payload);

        LOGGER.info(
            "Consumed messageId={} orderId={} total={}",
            message.messageId(),
            message.orderId(),
            message.total()
        );

        registry.register(message);
    }

    private OrderCreatedMessage deserialize(String payload) {
        try {
            return objectMapper.readValue(
                payload,
                OrderCreatedMessage.class
            );
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException(
                "Could not deserialize order message",
                exception
            );
        }
    }
}
```

Com `acknowledge-mode: auto`, o retorno normal do método permite a confirmação da entrega.

Uma exceção terá consequências conforme a configuração do listener. Não provoque falhas repetidas nesta aula porque retry e DLQ serão tratados na aula 478.

### 15. Criar o controller

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/web/OrderMessageController.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.web;

import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageRegistry;
import br.com.formacao.m16.rabbitmq.producer.OrderMessagePublisher;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/lab/orders/messages")
public class OrderMessageController {

    private final OrderMessagePublisher publisher;
    private final ConsumedMessageRegistry registry;

    public OrderMessageController(
        OrderMessagePublisher publisher,
        ConsumedMessageRegistry registry
    ) {
        this.publisher = publisher;
        this.registry = registry;
    }

    @PostMapping
    public ResponseEntity<PublishOrderMessageResponse> publish(
        @Valid @RequestBody PublishOrderMessageRequest request
    ) {
        Instant now = Instant.now();
        UUID messageId = UUID.randomUUID();

        OrderCreatedMessage message =
            new OrderCreatedMessage(
                messageId,
                "order.created.v1",
                now,
                request.orderId(),
                request.customerId(),
                request.total()
            );

        publisher.publish(message);

        PublishOrderMessageResponse response =
            new PublishOrderMessageResponse(
                messageId,
                "PUBLISH_REQUEST_ACCEPTED",
                now
            );

        return ResponseEntity
            .accepted()
            .location(
                URI.create(
                    "/api/v1/lab/orders/messages/consumed"
                )
            )
            .body(response);
    }

    @GetMapping("/consumed")
    public List<OrderCreatedMessage> consumed() {
        return registry.findAll();
    }

    @DeleteMapping("/consumed")
    public ResponseEntity<Void> clear() {
        registry.clear();
        return ResponseEntity.noContent().build();
    }
}
```

O endpoint de limpeza remove apenas a observação em memória. Ele não remove mensagens da queue.

### 16. Criar o teste de contexto

Arquivo:

```text
src/test/java/br/com/formacao/m16/rabbitmq/RabbitMqFundamentosApplicationTests.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RabbitMqFundamentosApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

Esse teste exige o broker configurado porque a aplicação declara infraestrutura AMQP durante o startup. Mantenha RabbitMQ ativo ao executar o gate desta aula.

Testcontainers e testes de integração completos de mensageria serão tratados em evolução posterior.

### 17. Compilar e executar testes

Com RabbitMQ ativo:

```powershell
.\mvnw.cmd clean test
```

Depois:

```powershell
.\mvnw.cmd spring-boot:run
```

Observe nos logs:

```text
conexão com localhost:5672;

listener container iniciado;

aplicação na porta 8090.
```

### 18. Confirmar a queue

Na management UI, abra:

```text
Queues and Streams.
```

Confirme:

```text
name:
m16.orders.created.v1.

durable:
true.

consumers:
1.
```

Abra a queue e observe:

```text
Ready;

Unacked;

Total;

Consumers;

Message rates.
```

Com a aplicação ociosa, os contadores devem permanecer próximos de zero.

### 19. Publicar a primeira mensagem

Execute:

```powershell
$body = @{
  orderId = "ORD-2026-0001"
  customerId = "CUS-1001"
  total = 199.90
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8090/api/v1/lab/orders/messages" `
  -ContentType "application/json" `
  -Body $body

$response
```

Resultado esperado:

```text
messageId:
UUID.

status:
PUBLISH_REQUEST_ACCEPTED.

acceptedAt:
timestamp.
```

O HTTP `202` significa que a aplicação aceitou a tentativa de publicação. Ele não confirma o processamento do consumer nem substitui publisher confirms, que serão estudados depois.

### 20. Observar o consumer

Nos logs, procure:

```text
Consumed messageId=...
orderId=ORD-2026-0001
```

Consulte o registry:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8090/api/v1/lab/orders/messages/consumed"
```

Resultado esperado contém a mensagem publicada.

Na management UI, a queue tende a voltar para:

```text
Ready:
0.

Unacked:
0.
```

A mensagem foi entregue, processada e confirmada.

### 21. Observar acúmulo sem consumer

Pare a aplicação com `Ctrl + C`.

Agora o broker continua ativo, mas o consumer não está conectado.

Na management UI, confirme:

```text
Consumers:
0.
```

Como o endpoint HTTP também foi parado, publique diretamente pela interface da queue apenas para este experimento:

1. abra a queue `m16.orders.created.v1`;
2. localize `Publish message`;
3. use payload:

```json
{
  "messageId": "8d3d112f-9992-4fa8-9aa6-2c24a4ccf700",
  "messageType": "order.created.v1",
  "occurredAt": "2026-07-12T18:30:00Z",
  "orderId": "ORD-MANUAL-0001",
  "customerId": "CUS-MANUAL-0001",
  "total": 250.00
}
```

4. marque a mensagem como persistent quando a interface oferecer a propriedade;
5. publique.

Observe:

```text
Ready:
1.

Consumers:
0.
```

A mensagem aguarda porque não existe consumer ativo.

### 22. Reiniciar o consumer

Inicie novamente:

```powershell
.\mvnw.cmd spring-boot:run
```

Observe:

```text
consumer conecta;

mensagem manual é entregue;

log de consumo aparece;

Ready volta para 0.
```

Consulte o registry.

A mensagem manual deve aparecer depois que a nova instância processá-la.

Esse experimento comprova o desacoplamento temporal básico:

```text
producer publica em um momento;

consumer processa em outro.
```

### 23. Observar connection e channel

Na management UI:

1. abra `Connections`;
2. localize a conexão criada pela aplicação;
3. observe usuário, virtual host e estado;
4. abra `Channels`;
5. observe os channels associados.

Não feche connections manualmente durante o fluxo normal.

Registre:

```text
uma aplicação pode manter connection reutilizável;

operações AMQP usam channels lógicos;

Spring gerencia essa infraestrutura.
```

### 24. Observar acknowledgements

Publique uma mensagem e acompanhe a queue. O caminho esperado é `Ready`, entrega, `Unacked`, retorno do listener, ack e remoção. Como o processamento é rápido, `Unacked` pode aparecer por pouco tempo. Não adicione atrasos artificiais ao código versionado.

### 25. Reiniciar o broker com mensagem aguardando

Pare a aplicação para deixar `Consumers: 0`.

Publique uma mensagem persistente pela management UI.

Confirme:

```text
Ready:
1.
```

Reinicie o broker:

```powershell
docker restart `
  "formacao-rabbitmq"
```

Aguarde o startup e volte à management UI.

Confirme que:

```text
a queue durável ainda existe;

a mensagem persistente continua aguardando.
```

Depois inicie a aplicação e observe o consumo.

Esse experimento é local e não constitui prova de alta disponibilidade ou perda zero.

### 26. Validar erro de conexão

Pare o broker:

```powershell
docker stop `
  "formacao-rabbitmq"
```

Com a aplicação ativa, tente publicar.

Resultado esperado:

```text
publicação falha;

logs mostram indisponibilidade de conexão;

não existe confirmação de processamento.
```

Reinicie:

```powershell
docker start `
  "formacao-rabbitmq"
```

Aguarde a reconexão.

Não esconda indisponibilidade do broker retornando `202` quando o envio lançou erro. Publisher confirms e garantias mais fortes serão aprofundados depois.

### 27. Executar o gate

Com RabbitMQ ativo:

```powershell
.\mvnw.cmd clean verify
```

Depois execute o laboratório novamente e valide:

```text
startup;

queue declarada;

consumer conectado;

POST retorna 202;

mensagem consumida;

queue volta a zero;

broker restart preserva queue e mensagem persistente aguardando.
```

---

## Entendendo o que foi feito

### A integração ganhou um ponto intermediário

O producer não chama diretamente o consumer. Ele publica no broker.

### O processamento deixou de acontecer dentro da request

O endpoint responde depois da publicação, enquanto o consumer executa separadamente.

### A queue absorveu diferença de ritmo

Mensagens podem aguardar quando o consumer está parado ou mais lento.

### Spring gerenciou a infraestrutura AMQP

A aplicação não abriu sockets ou channels manualmente.

### A exchange padrão simplificou o primeiro fluxo

O nome da queue foi usado como routing key sem declarar exchange customizada.

### O consumer confirmou entregas

O retorno normal do listener permitiu acknowledgement automático.

### Durabilidade e persistência foram separadas

A queue foi declarada como durável e as mensagens foram marcadas como persistentes.

### A management UI tornou o broker observável

Connections, channels, consumers, Ready e Unacked puderam ser inspecionados.

### A resposta HTTP ficou semanticamente honesta

`202 Accepted` informou aceitação para entrega, não conclusão do processamento.

---

## Erros comuns importantes

### Retornar sucesso final logo após publicar

A publicação não comprova que o consumer concluiu a regra de negócio.

### Chamar consumer diretamente e também publicar

Isso duplica responsabilidades e pode processar duas vezes.

### Usar entidade de banco como payload

A mensagem fica acoplada à persistência interna.

### Presumir exactly once

Redelivery pode acontecer. Consumers precisam de estratégia de idempotência.

### Confundir queue durável com mensagem persistente

São propriedades diferentes.

### Criar connection por mensagem

Connections são recursos reutilizáveis e mais pesados.

### Gerenciar channel no service de negócio

Spring AMQP já fornece abstrações apropriadas.

### Usar localhost de outro container

Dentro de um container, `localhost` representa o próprio container. Esta aula executa a aplicação no host.

### Expor management UI publicamente

A porta 15672 foi publicada apenas no loopback local.

### Colocar credencial produtiva no YAML

Use configuração externa e secret manager em ambientes reais.

### Usar a management UI como producer operacional

A publicação manual serve apenas para diagnóstico e laboratório.

### Aprofundar retry antes da DLQ

Falhas repetidas sem política podem gerar loops. O tema pertence à aula 478.

---

## Comandos úteis

### Iniciar RabbitMQ

```powershell
docker start "formacao-rabbitmq"
```

### Parar RabbitMQ

```powershell
docker stop "formacao-rabbitmq"
```

### Logs

```powershell
docker logs --follow "formacao-rabbitmq"
```

### Verificar porta

```powershell
Test-NetConnection localhost -Port 5672
```

### Executar aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

### Publicar

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8090/api/v1/lab/orders/messages" `
  -ContentType "application/json" `
  -Body (@{
      orderId = "ORD-2026-0001"
      customerId = "CUS-1001"
      total = 199.90
  } | ConvertTo-Json)
```

### Consultar consumidas

```powershell
Invoke-RestMethod `
  "http://localhost:8090/api/v1/lab/orders/messages/consumed"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Broker

Inicie RabbitMQ com volume e management UI.

### Parte 2 — Conexão

Configure host, port, user, password e virtual host.

### Parte 3 — Queue

Declare `m16.orders.created.v1` como durável.

### Parte 4 — Producer

Publique JSON com `messageId`, `type` e delivery mode persistente.

### Parte 5 — Consumer

Consuma com `@RabbitListener` e acknowledgement automático.

### Parte 6 — Validação

Confirme logs, registry e contadores da queue.

### Parte 7 — Desacoplamento temporal

Pare o consumer, publique manualmente, reinicie e observe o processamento.

### Parte 8 — Persistência introdutória

Reinicie o broker com uma mensagem persistente aguardando.

### Parte 9 — Falha

Pare o broker e confirme que a publicação não pode ser tratada como sucesso.

### Parte 10 — Registro

Documente a diferença entre producer, broker, queue, consumer e ack.

---

## Critérios de aceite

- arquivo, H1, número, módulo e continuidade com a aula 474 estão corretos;
- comunicação síncrona e assíncrona foram diferenciadas;
- broker, producer, consumer, queue, connection, channel, mensagem e ack foram explicados;
- exchange padrão e routing key foram usadas sem antecipar bindings customizados;
- redelivery foi apresentado e exactly once não foi prometido;
- queue durável e mensagem persistente foram diferenciadas;
- RabbitMQ local foi iniciado com volume, AMQP em 5672 e management em 15672 somente no loopback;
- `spring-boot-starter-amqp` foi usado sem versões manuais;
- propriedades `spring.rabbitmq` ficaram externalizáveis;
- `m16.orders.created.v1` foi declarada como queue durável;
- payload próprio foi criado, sem publicar entidade JPA;
- `RabbitTemplate` publicou JSON com content type, message ID, type e delivery mode persistente;
- `@RabbitListener` consumiu com acknowledgement automático;
- POST retornou `202 Accepted` sem afirmar conclusão do processamento;
- logs, registry, Ready, Unacked, connections e channels foram observados;
- mensagem aguardou sem consumer e foi processada após a reconexão;
- restart do broker foi testado com queue durável e mensagem persistente aguardando;
- indisponibilidade do broker não foi tratada como publicação bem-sucedida;
- credenciais produtivas não foram incluídas;
- retry, DLQ, exchanges customizadas, Kafka, outbox e saga não foram antecipados;
- gate foi executado, commit está pronto e a ponte para a aula 476 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Confirme que não existem:

```text
credentials produtivas;

logs do broker;

volume exportado;

target;

arquivos temporários.
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
git commit -m "feat(m16): introduzir fundamentos do RabbitMQ"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- senha real;
- definição exportada do broker com segredo;
- volume de dados;
- dump de mensagens;
- `target`;
- logs;
- artefatos temporários;
- código de retry antecipado;
- DLQ antecipada;
- Kafka antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a formação saiu do modelo exclusivamente síncrono e criou o primeiro fluxo assíncrono com RabbitMQ.

O caminho ficou:

```text
request HTTP;

producer;

RabbitTemplate;

exchange padrão;

queue durável;

mensagem persistente;

consumer;

acknowledgement automático.
```

Você comprovou que:

```text
producer e consumer

não precisam executar

no mesmo instante;

mensagens podem aguardar;

consumer pode reconectar;

ack controla a conclusão da entrega;

queue durável e mensagem persistente

são decisões diferentes;

management UI permite observar

connections, channels e queues.
```

A decisão central foi:

```text
mensageria desacopla o momento

da publicação do momento

do processamento;

mas exige contrato de mensagem,

política de entrega,

idempotência

e operação do broker.
```

A próxima aula será:

```text
476 - M16.21 - Exchanges queues bindings
```

Nela, você deixará de depender apenas da exchange padrão e compreenderá explicitamente:

- o papel de uma exchange;
- bindings;
- routing keys;
- direct exchange;
- fanout exchange;
- topic exchange;
- relação entre uma publicação e múltiplas queues;
- topologia declarada pelo Spring AMQP;
- critérios para nomear exchanges, queues e bindings.

Nada disso foi aprofundado antecipadamente aqui.

---

# Material complementar

## Checkpoint final

- [ ] Iniciei RabbitMQ localmente.
- [ ] Declarei uma queue durável.
- [ ] Publiquei uma mensagem JSON persistente.
- [ ] Consumi com `@RabbitListener` e ack automático.
- [ ] Observei Ready, Unacked, connection e channel.
- [ ] Executei o gate e preparei o commit.

---

## Troubleshooting adicional

### A aplicação não conecta

Confirme:

```text
container ativo;

porta 5672 publicada;

host localhost;

usuário e senha locais;

virtual host /.
```

Execute:

```powershell
Test-NetConnection localhost -Port 5672
```

### A management UI não abre

Confirme:

```text
imagem com management plugin;

porta 15672 publicada;

container pronto;

URL 127.0.0.1.
```

Leia:

```powershell
docker logs formacao-rabbitmq
```

### A queue não aparece

Confirme:

```text
bean Queue carregado;

aplicação conectada;

nome correto;

nenhuma falha de declaração.
```

### O POST retorna erro de conexão

O broker pode estar parado ou reiniciando.

Não retorne `202` quando a publicação falhou.

### A mensagem fica em Ready

Confirme:

```text
consumer conectado;

Consumers maior que zero;

nome da queue idêntico;

listener iniciado.
```

### A mensagem fica em Unacked

O consumer pode estar processando, bloqueado ou sem retornar.

Remova `sleep` de laboratório e verifique logs.

### O consumer não desserializa

Confirme:

```text
JSON válido;

nomes dos campos;

Instant em ISO-8601;

UUID válido;

total numérico.
```

### A queue some depois do restart

Confirme que ela foi declarada como durável e que o mesmo volume do broker foi reutilizado.

### A mensagem some depois do restart

Confirme:

```text
queue durável;

mensagem persistente;

mensagem ainda não confirmada;

volume preservado.
```

Ainda assim, não trate o laboratório como garantia de alta disponibilidade.

---

## Perguntas de revisão

1. Qual problema a comunicação assíncrona ajuda a resolver?
2. O que é um broker?
3. Quem é o producer?
4. Quem é o consumer?
5. O que é uma queue?
6. Publicar significa processamento concluído?
7. Por que o endpoint retorna 202?
8. O que é uma connection?
9. O que é um channel?
10. O que é acknowledgement?
11. Quando o ack automático acontece no laboratório?
12. Uma mensagem pode ser entregue novamente?
13. Queue durável garante mensagem persistente?
14. Mensagem persistente garante perda zero?
15. Qual exchange foi usada?
16. Qual routing key foi usada?
17. Quando RabbitMQ é apropriado?
18. Quando HTTP direto pode ser melhor?
19. Qual é a próxima aula?
20. O que será aprofundado nela?

---

## Roteiro de resposta

1. Separar o momento da publicação do processamento.
2. Infraestrutura que recebe, organiza e entrega mensagens.
3. Componente que publica.
4. Componente que processa entregas.
5. Estrutura que mantém mensagens disponíveis.
6. Não.
7. Porque a mensagem foi aceita para entrega, não concluída.
8. Conexão de rede reutilizável com o broker.
9. Sessão lógica sobre a connection.
10. Confirmação de processamento da entrega.
11. Quando o listener retorna normalmente.
12. Sim.
13. Não.
14. Não.
15. Exchange padrão.
16. Nome da queue.
17. Quando o trabalho pode ser assíncrono e desacoplado no tempo.
18. Quando a resposta é necessária imediatamente.
19. Exchanges queues bindings.
20. Roteamento e topologia explícita.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
Aula 475 - M16.20 - RabbitMQ fundamentos

- Continuei o M16 depois dos testes de contrato HTTP.
- Diferenciei comunicação síncrona e assíncrona.
- Compreendi acoplamento temporal.
- Defini RabbitMQ como broker de mensagens.
- Diferenciei producer, broker, queue e consumer.
- Entendi que publicar não significa concluir o processamento.
- Usei `202 Accepted` para representar aceitação da publicação.
- Compreendi connection e channel.
- Conheci o papel da exchange padrão.
- Usei o nome da queue como routing key.
- Criei o broker local com Docker.
- Publiquei AMQP na porta 5672.
- Limitei a management UI ao loopback na porta 15672.
- Criei volume para dados locais do broker.
- Adicionei `spring-boot-starter-amqp`.
- Configurei propriedades `spring.rabbitmq`.
- Declarei a queue `m16.orders.created.v1` como durável.
- Criei um modelo próprio de mensagem.
- Não publiquei entidade JPA.
- Criei producer com `RabbitTemplate`.
- Serializei o payload como JSON.
- Configurei content type, message ID, type e timestamp.
- Marquei a mensagem como persistente.
- Criei consumer com `@RabbitListener`.
- Usei acknowledgement automático.
- Observei Ready e Unacked.
- Observei connections e channels.
- Parei o consumer e acumulei mensagem na queue.
- Reiniciei o consumer e processei a mensagem aguardando.
- Reiniciei o broker com queue durável e mensagem persistente.
- Diferenciei queue durável de mensagem persistente.
- Compreendi que redelivery pode acontecer.
- Não presumi exactly once.
- Registrei que consumers precisam de idempotência.
- Não antecipei retry, DLQ, Kafka, outbox ou saga.
- Próxima aula: Exchanges queues bindings.
```

---

## Referência técnica curta

- Spring Boot Reference — AMQP e configuração `spring.rabbitmq`.
- Spring AMQP Reference — `RabbitTemplate` e envio de mensagens.
- Spring AMQP Reference — consumers com `@RabbitListener`.
- Spring AMQP Reference — configuração do broker e declaração de queues.
- RabbitMQ Documentation — AMQP 0-9-1 Model Explained.
- RabbitMQ Documentation — Reliability Guide.
- RabbitMQ Tutorials — Work Queues.
- RabbitMQ Documentation — Management Plugin.

Regra final:

```text
RabbitMQ deve ser usado como broker explícito, não como chamada remota disfarçada: o producer publica uma mensagem com significado e propriedades controladas; a exchange roteia; a queue mantém entregas; o consumer processa e confirma; connection e channels são gerenciados pela infraestrutura; queue durável e mensagem persistente aumentam a capacidade de recuperação, mas não prometem perda zero; redelivery é possível e exige consumers preparados; a resposta HTTP deve distinguir aceitação da publicação de conclusão do processamento; nesta baseline, Spring AMQP declara uma queue durável, RabbitTemplate publica JSON persistente pela exchange padrão e @RabbitListener consome com acknowledgement automático, preparando exchanges, queues e bindings explícitos na próxima aula.
```
