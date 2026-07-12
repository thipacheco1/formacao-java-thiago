# 476 - M16.21 - Exchanges queues bindings

## Apresentação da aula

Na aula 475, você construiu o primeiro fluxo assíncrono completo com RabbitMQ.

O caminho ficou:

```text
request HTTP;

producer;

RabbitTemplate;

exchange padrão;

routing key igual ao nome da queue;

queue durável;

consumer com @RabbitListener;

acknowledgement automático.
```

Aquela baseline foi propositalmente simples. O producer publicou pela exchange padrão, cujo nome AMQP é uma string vazia, e utilizou o nome da queue como routing key. Isso criou a impressão de que a mensagem foi enviada diretamente para a queue.

O que realmente aconteceu foi:

```text
producer
   |
   | exchange = ""
   | routing key = nome da queue
   v
exchange padrão
   |
   | binding automático criado pelo broker
   v
queue
```

Essa conveniência não deve esconder o modelo de roteamento.

Considere agora que o evento:

```text
orders.created.v1
```

precisa alimentar três capacidades independentes:

```text
fulfillment;

auditoria;

analytics.
```

O producer não deveria conhecer três nomes de queues nem publicar três vezes. Ele também não deveria decidir quantas aplicações receberão o evento.

A pergunta central desta aula será:

```text
como declarar uma topologia explícita

na qual o producer publica em um exchange,

as regras de binding decidem o roteamento

e cada capacidade possui sua própria queue?
```

A resposta usa três elementos:

```text
exchange;

queue;

binding.
```

E duas chaves distintas:

```text
routing key:
valor enviado pelo publisher.

binding key ou pattern:
regra configurada entre exchange e queue.
```

A topologia principal será:

```text
producer
   |
   | routing key
   v
exchange
   |
   | binding
   +-------------------+
   |                   |
   v                   v
queue A             queue B
```

A aula aprofundará os exchanges:

```text
direct;

fanout;

topic.
```

O exchange `headers` será explicado conceitualmente, mas não será implementado no laboratório. Ele possui uma lógica diferente, baseada em headers e argumentos de binding, e não é necessário para dominar a baseline atual.

O laboratório continuará no projeto da aula 475:

```text
labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos
```

A queue `m16.orders.created.v1` será mantida como baseline. Nesta aula, você adicionará topologias explícitas, mas deixará a migração do producer e do consumer para a aula 477.

Não serão aprofundados:

- publisher confirms;
- returns para mensagens não roteadas;
- concorrência de consumers;
- prefetch avançado;
- acknowledgement manual;
- retry;
- dead-letter exchange;
- dead-letter queue;
- poison message;
- idempotência completa;
- contratos de mensagens;
- Kafka;
- outbox;
- inbox;
- saga;
- CDC.

Ao final, você deverá explicar por que o producer publica em exchange, por que a queue representa uma capacidade consumidora e como direct, fanout e topic produzem rotas diferentes sem acoplar publisher e consumers.

---

## Onde estamos na formação

A sequência oficial do M16 é:

```text
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

479:
Kafka fundamentos.
```

A aula 475 respondeu:

```text
como publicar e consumir
a primeira mensagem
por meio de um broker?
```

A aula 476 responderá:

```text
como modelar o caminho
entre publisher e queues
sem acoplar o producer
aos consumidores?
```

Nesta aula:

```text
exchange padrão:
revisão.

direct exchange:
sim.

fanout exchange:
sim.

topic exchange:
sim.

headers exchange:
conceitual.

queues duráveis:
sim.

bindings explícitos:
sim.

routing keys:
sim.

binding keys:
sim.

patterns com * e #:
sim.

topologia como código:
sim.

RabbitAdmin:
conceitual e operacional.

Declarables:
sim.

producer real refatorado:
não.

novos consumers:
não.

retry:
não.

DLQ:
não.

Kafka:
não.
```

A regra central será:

```text
producer conhece o exchange
e a linguagem de roteamento;

consumer possui uma queue;

binding conecta os dois lados
sem exigir que eles se conheçam diretamente.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/rabbitmq/config
├── RabbitMqFundamentosConfiguration.java
├── RabbitMqTopologyConfiguration.java
└── RabbitTopologyNames.java
```

A configuração nova declarará:

```text
Direct topology:

exchange:
m16.orders.events.direct.v1

queues:
m16.fulfillment.orders-created.v1
m16.audit.orders-created.v1
m16.billing.orders-cancelled.v1

bindings:
orders.created.v1
orders.created.v1
orders.cancelled.v1
```

Também declarará:

```text
Fanout topology:

exchange:
m16.platform.broadcast.fanout.v1

queues:
m16.audit.platform-broadcast.v1
m16.analytics.platform-broadcast.v1

bindings:
sem filtro por routing key
```

E:

```text
Topic topology:

exchange:
m16.domain.events.topic.v1

queues:
m16.notifications.order-events.v1
m16.integration.created-events.v1
m16.audit.all-domain-events.v1

patterns:
orders.*.v1
*.created.v1
#
```

Você irá:

1. revisar a exchange padrão;
2. diferenciar exchange, queue e binding;
3. definir nomes e routing keys;
4. declarar topologias direct, fanout e topic;
5. criar bindings exatos e por pattern;
6. iniciar e inspecionar o broker;
7. publicar mensagens de prova;
8. validar multicast, broadcast e filtros;
9. comprovar uma mensagem sem destino;
10. criar teste estrutural;
11. commitar;
12. preparar producers e consumers.


---

## Conceito essencial

### Exchange

Exchange é o componente que recebe uma publicação e decide para quais destinos ela será roteada.

O publisher envia:

```text
exchange;

routing key;

properties;

payload.
```

O exchange aplica seu tipo e seus bindings.

Ele não é uma fila intermediária.

Regra importante:

```text
exchange roteia;

queue armazena.
```

Se uma mensagem não combinar com nenhum binding, ela pode ficar sem destino. Na baseline desta aula, isso será demonstrado pelo retorno:

```json
{
  "routed": false
}
```

do HTTP API do management plugin.

O tratamento confiável de mensagens não roteadas exigirá decisões adicionais, como `mandatory`, returned messages, publisher confirms ou alternate exchange. Esses assuntos não serão implementados agora.

---

### Queue

Queue mantém mensagens disponíveis para consumers.

Ela possui identidade e propriedades próprias:

```text
name;

durable;

exclusive;

auto-delete;

arguments;

queue type.
```

Nesta aula, todas as queues serão:

```text
durable:
true.

exclusive:
false.

auto-delete:
false.
```

A queue deve representar uma capacidade ou um grupo consumidor.

Exemplo melhor:

```text
m16.fulfillment.orders-created.v1
```

Esse nome informa:

```text
quem é o dono lógico:
fulfillment.

o que será processado:
orders-created.

versão operacional:
v1.
```

Exemplo menos saudável:

```text
orders.created.v1
```

Esse nome descreve apenas o evento e não deixa claro qual consumer é dono da queue.

Dois sistemas independentes não devem compartilhar uma queue apenas porque consomem o mesmo evento.

Se auditoria e fulfillment usam a mesma queue, os consumers competem e cada mensagem tende a ser entregue para apenas um deles.

Para ambos receberem o evento, cada capacidade precisa de sua própria queue:

```text
exchange
   |
   +--> fulfillment queue
   |
   +--> audit queue
```

---

### Binding

Binding é a relação declarada entre uma origem e um destino.

Na baseline:

```text
source:
exchange.

destination:
queue.
```

O binding pode conter:

```text
binding key;

pattern;

arguments.
```

Ele não transporta o payload.

Ele descreve a regra usada pelo exchange para decidir se a mensagem deve chegar à queue.

A mesma queue pode possuir vários bindings.

O mesmo exchange pode possuir bindings para muitas queues.

A mesma routing key pode combinar com mais de uma queue.

---

### Routing key e binding key

Routing key acompanha a publicação.

Exemplo:

```text
orders.created.v1
```

Binding key pertence a um binding de direct exchange.

Exemplo:

```text
orders.created.v1
```

Quando os valores são iguais em um direct exchange, há match.

No topic exchange, o binding utiliza pattern:

```text
orders.*.v1
```

e pode combinar com:

```text
orders.created.v1;

orders.cancelled.v1.
```

A routing key não é endereço físico de consumer.

Ela é parte do vocabulário da integração.

---

### Exchange padrão

A exchange padrão possui nome:

```text
""
```

Ela é um direct exchange especial e predefinido.

Quando uma queue é declarada, o RabbitMQ cria automaticamente um binding da exchange padrão para essa queue usando o nome da queue como routing key.

Por isso, na aula 475 foi possível executar conceitualmente:

```text
exchange:
""

routing key:
m16.orders.created.v1
```

A exchange padrão não aceita bindings customizados.

Ela continuará existindo, mas a evolução profissional da topologia utilizará exchanges nomeados.

---

### Direct exchange

Direct exchange compara exatamente:

```text
routing key da mensagem
com
binding key.
```

Exemplo:

```text
binding:
orders.created.v1

message routing key:
orders.created.v1

resultado:
match.
```

Outro exemplo:

```text
binding:
orders.created.v1

message routing key:
orders.cancelled.v1

resultado:
sem match.
```

Um direct exchange é apropriado quando a taxonomia exige destinos explícitos e igualdade exata.

Ele não significa obrigatoriamente que apenas uma queue receberá.

Se duas queues estiverem ligadas com a mesma binding key, ambas receberão uma cópia.

```text
                    +--> fulfillment queue
orders.created.v1 --|
                    +--> audit queue
```

---

### Fanout exchange

Fanout exchange ignora a routing key e envia uma cópia para cada queue ligada.

```text
publisher
   |
   v
fanout exchange
   |
   +--> queue A
   |
   +--> queue B
   |
   +--> queue C
```

Ele é adequado para broadcast quando todas as queues devem receber todas as mensagens daquele exchange.

Exemplos:

- invalidação de cache distribuída;
- aviso operacional global;
- atualização de configuração;
- evento de auditoria que precisa alimentar destinos independentes;
- sinal de refresh para múltiplos componentes.

Fanout não significa que todos os processos receberão uma cópia.

A unidade de cópia é a queue.

Se três instâncias consomem a mesma queue, elas competem pelas mensagens dessa queue.

---

### Topic exchange

Topic exchange compara uma routing key segmentada com patterns de binding.

Os segmentos são separados por ponto:

```text
orders.created.v1
```

O wildcard:

```text
*
```

representa exatamente um segmento.

O wildcard:

```text
#
```

representa zero ou mais segmentos.

Exemplos:

```text
orders.*.v1
```

combina com:

```text
orders.created.v1;

orders.cancelled.v1.
```

Não combina com:

```text
orders.payment.authorized.v1
```

porque existem dois segmentos entre `orders` e `v1`.

Pattern:

```text
orders.# 
```

combina com:

```text
orders.v1;

orders.created.v1;

orders.payment.authorized.v1.
```

Pattern:

```text
*.created.v1
```

combina com:

```text
orders.created.v1;

customers.created.v1.
```

Topic exchange é útil quando consumers escolhem famílias de eventos sem exigir um binding separado para cada routing key.

---

### Headers exchange

Headers exchange roteia por metadados da mensagem em vez da routing key. Ele será apenas reconhecido nesta aula; prefira direct ou topic enquanto o requisito puder ser expresso por uma taxonomia estável.


### Topologia como código

Exchanges, queues e bindings não devem existir apenas porque alguém clicou na interface administrativa.

A aplicação precisa declarar o que depende para funcionar.

No Spring AMQP, objetos como:

```text
Queue;

DirectExchange;

FanoutExchange;

TopicExchange;

Binding;

Declarables.
```

representam a topologia.

O `AmqpAdmin` detecta esses declarables e os declara quando a conexão com o broker é estabelecida.

Benefícios:

- reprodutibilidade;
- revisão por pull request;
- nomes centralizados;
- ambientes consistentes;
- documentação próxima do código;
- falha visível quando a topologia é incompatível.

A aplicação não deve apagar automaticamente entidades produtivas para “corrigir” diferenças.

---

### Equivalência de declaração

RabbitMQ valida se uma nova declaração é compatível com a entidade existente.

Exemplo:

```text
queue existente:
durable = true.

aplicação tenta declarar:
durable = false.
```

O broker rejeita a declaração com erro de channel, normalmente identificado como:

```text
PRECONDITION_FAILED.
```

Não trate isso como defeito aleatório.

A mensagem indica que o código e o broker discordam sobre uma propriedade imutável ou relevante.

No laboratório local, você pode apagar a entidade e recriar conscientemente.

Em produção, a mudança exige migração planejada:

```text
nova queue;

novo nome/versionamento;

novo binding;

drenagem;

troca de consumers;

remoção posterior.
```

---

### Convenção de routing key

A baseline utilizará:

```text
<dominio>.<evento>.<versao>
```

Exemplos:

```text
orders.created.v1;

orders.cancelled.v1;

customers.created.v1;

payments.authorized.v1.
```

Regras:

- letras minúsculas;
- segmentos separados por ponto;
- sem espaços;
- sem nomes de classe Java;
- sem hostname;
- sem ambiente;
- sem ID de entidade;
- sem informação secreta;
- sem nome de queue;
- versão explícita quando existir contrato incompatível.

Routing keys precisam ser estáveis e compreensíveis fora da aplicação Java.

---

### Convenção de nomes da topologia

A baseline usa exchanges no formato `m16.<dominio>.<funcao>.<tipo>.v1` e queues no formato `m16.<capacidade>.<familia-processada>.v1`. O prefixo `m16` é apenas didático; sistemas reais devem seguir a convenção corporativa.


---

## Mão na massa guiada

### 1. Confirmar o broker da aula 475

Liste o container:

```powershell
docker ps `
  --filter "name=m16-rabbitmq"
```

Se estiver parado:

```powershell
docker start `
  "m16-rabbitmq"
```

Confirme o management plugin:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:15672/api/overview" `
  -Authentication Basic `
  -Credential (
    New-Object `
      System.Management.Automation.PSCredential(
        "formacao",
        (
          ConvertTo-SecureString `
            "formacao-local" `
            -AsPlainText `
            -Force
        )
      )
  )
```

O usuário e a senha são somente do laboratório local.

---

### 2. Entrar no projeto

```powershell
Set-Location `
  "labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos"
```

Execute:

```powershell
.\mvnw.cmd clean compile
```

Não crie um novo projeto.

A aula evolui o mesmo laboratório.

---

### 3. Preservar a configuração anterior

Mantenha:

```text
RabbitMqFundamentosConfiguration.java
```

e a queue:

```text
m16.orders.created.v1.
```

Ela será chamada nesta aula de:

```text
legacy queue da baseline.
```

Não remova o producer nem o consumer da aula 475.

A migração será feita na aula 477.

---

### 4. Criar os nomes da topologia

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/config/RabbitTopologyNames.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.config;

public final class RabbitTopologyNames {

    public static final String ORDERS_DIRECT_EXCHANGE =
        "m16.orders.events.direct.v1";

    public static final String FULFILLMENT_ORDERS_CREATED_QUEUE =
        "m16.fulfillment.orders-created.v1";

    public static final String AUDIT_ORDERS_CREATED_QUEUE =
        "m16.audit.orders-created.v1";

    public static final String BILLING_ORDERS_CANCELLED_QUEUE =
        "m16.billing.orders-cancelled.v1";

    public static final String ORDERS_CREATED_KEY =
        "orders.created.v1";

    public static final String ORDERS_CANCELLED_KEY =
        "orders.cancelled.v1";

    public static final String PLATFORM_FANOUT_EXCHANGE =
        "m16.platform.broadcast.fanout.v1";

    public static final String PLATFORM_AUDIT_QUEUE =
        "m16.audit.platform-broadcast.v1";

    public static final String PLATFORM_ANALYTICS_QUEUE =
        "m16.analytics.platform-broadcast.v1";

    public static final String DOMAIN_TOPIC_EXCHANGE =
        "m16.domain.events.topic.v1";

    public static final String NOTIFICATIONS_ORDER_EVENTS_QUEUE =
        "m16.notifications.order-events.v1";

    public static final String INTEGRATION_CREATED_EVENTS_QUEUE =
        "m16.integration.created-events.v1";

    public static final String AUDIT_ALL_DOMAIN_EVENTS_QUEUE =
        "m16.audit.all-domain-events.v1";

    public static final String ORDERS_V1_PATTERN =
        "orders.*.v1";

    public static final String CREATED_V1_PATTERN =
        "*.created.v1";

    public static final String ALL_EVENTS_PATTERN =
        "#";

    private RabbitTopologyNames() {
    }
}
```

A classe não possui comportamento.

Ela centraliza o vocabulário que será utilizado também na próxima aula.

---

### 5. Criar a configuração de topologia

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/config/RabbitMqTopologyConfiguration.java
```

Comece com:

```java
package br.com.formacao.m16.rabbitmq.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqTopologyConfiguration {
}
```

Nenhum `package` ou `import` deve ser quebrado em duas linhas.

---

### 6. Declarar a topologia direct

Dentro da configuração:

```java
@Bean
Declarables orderDirectTopology() {
    DirectExchange exchange =
        new DirectExchange(
            RabbitTopologyNames.ORDERS_DIRECT_EXCHANGE,
            true,
            false
        );

    Queue fulfillmentQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .FULFILLMENT_ORDERS_CREATED_QUEUE
            )
            .build();

    Queue auditQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .AUDIT_ORDERS_CREATED_QUEUE
            )
            .build();

    Queue billingQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .BILLING_ORDERS_CANCELLED_QUEUE
            )
            .build();

    Binding fulfillmentBinding =
        BindingBuilder
            .bind(fulfillmentQueue)
            .to(exchange)
            .with(
                RabbitTopologyNames.ORDERS_CREATED_KEY
            );

    Binding auditBinding =
        BindingBuilder
            .bind(auditQueue)
            .to(exchange)
            .with(
                RabbitTopologyNames.ORDERS_CREATED_KEY
            );

    Binding billingBinding =
        BindingBuilder
            .bind(billingQueue)
            .to(exchange)
            .with(
                RabbitTopologyNames.ORDERS_CANCELLED_KEY
            );

    return new Declarables(
        exchange,
        fulfillmentQueue,
        auditQueue,
        billingQueue,
        fulfillmentBinding,
        auditBinding,
        billingBinding
    );
}
```

Observe a decisão:

```text
orders.created.v1
```

possui duas queues correspondentes.

Logo, uma publicação roteada com essa key produzirá:

```text
uma cópia para fulfillment;

uma cópia para auditoria.
```

Isso não é duplicação acidental.

É multicast explícito por topologia.

---

### 7. Declarar a topologia fanout

Adicione:

```java
@Bean
Declarables platformFanoutTopology() {
    FanoutExchange exchange =
        new FanoutExchange(
            RabbitTopologyNames.PLATFORM_FANOUT_EXCHANGE,
            true,
            false
        );

    Queue auditQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames.PLATFORM_AUDIT_QUEUE
            )
            .build();

    Queue analyticsQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .PLATFORM_ANALYTICS_QUEUE
            )
            .build();

    Binding auditBinding =
        BindingBuilder
            .bind(auditQueue)
            .to(exchange);

    Binding analyticsBinding =
        BindingBuilder
            .bind(analyticsQueue)
            .to(exchange);

    return new Declarables(
        exchange,
        auditQueue,
        analyticsQueue,
        auditBinding,
        analyticsBinding
    );
}
```

O fanout não recebe `.with(...)`.

A routing key enviada pelo publisher não altera o resultado.

---

### 8. Declarar a topologia topic

Adicione:

```java
@Bean
Declarables domainTopicTopology() {
    TopicExchange exchange =
        new TopicExchange(
            RabbitTopologyNames.DOMAIN_TOPIC_EXCHANGE,
            true,
            false
        );

    Queue notificationsQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .NOTIFICATIONS_ORDER_EVENTS_QUEUE
            )
            .build();

    Queue integrationQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .INTEGRATION_CREATED_EVENTS_QUEUE
            )
            .build();

    Queue auditQueue =
        QueueBuilder
            .durable(
                RabbitTopologyNames
                    .AUDIT_ALL_DOMAIN_EVENTS_QUEUE
            )
            .build();

    Binding notificationsBinding =
        BindingBuilder
            .bind(notificationsQueue)
            .to(exchange)
            .with(
                RabbitTopologyNames.ORDERS_V1_PATTERN
            );

    Binding integrationBinding =
        BindingBuilder
            .bind(integrationQueue)
            .to(exchange)
            .with(
                RabbitTopologyNames.CREATED_V1_PATTERN
            );

    Binding auditBinding =
        BindingBuilder
            .bind(auditQueue)
            .to(exchange)
            .with(
                RabbitTopologyNames.ALL_EVENTS_PATTERN
            );

    return new Declarables(
        exchange,
        notificationsQueue,
        integrationQueue,
        auditQueue,
        notificationsBinding,
        integrationBinding,
        auditBinding
    );
}
```

A queue de auditoria usa:

```text
#
```

somente para demonstrar um consumer que recebe toda a taxonomia desse exchange.

Em produção, um binding muito amplo precisa de análise de volume, retenção e responsabilidade.

---

### 9. Compilar

```powershell
.\mvnw.cmd clean compile
```

Corrija qualquer erro antes de iniciar.

Erros comuns nesta etapa:

- import incorreto;
- nome de constante divergente;
- `.with(...)` usado em fanout;
- `Queue` importada de outro package;
- classe `Binding` importada incorretamente;
- package diferente da estrutura de diretórios.

---

### 10. Iniciar a aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

Durante o startup, a aplicação abre conexão com o broker e o `AmqpAdmin` declara os beans encontrados.

Não é necessário criar as entidades manualmente na UI.

Procure ausência de erros como:

```text
PRECONDITION_FAILED;

NOT_FOUND;

ACCESS_REFUSED.
```

---

### 11. Inspecionar os exchanges

Abra:

```text
http://127.0.0.1:15672
```

Entre com:

```text
formacao;

formacao-local.
```

Na aba Exchanges, procure:

```text
m16.orders.events.direct.v1;

m16.platform.broadcast.fanout.v1;

m16.domain.events.topic.v1.
```

Confirme os tipos:

```text
direct;

fanout;

topic.
```

Confirme:

```text
durable:
true.

auto-delete:
false.

internal:
false.
```

Não altere propriedades pela UI.

---

### 12. Inspecionar as queues

Na aba Queues and Streams, procure as oito queues novas.

Confirme que não possuem consumers.

Resultado esperado:

```text
consumers:
0.
```

Isso é intencional.

A aula valida a topologia antes de implementar os consumers da aula 477.

---

### 13. Inspecionar bindings

Abra o direct exchange.

Confirme:

```text
orders.created.v1
    -> m16.fulfillment.orders-created.v1

orders.created.v1
    -> m16.audit.orders-created.v1

orders.cancelled.v1
    -> m16.billing.orders-cancelled.v1
```

Abra o fanout exchange.

Confirme duas destinations sem filtro efetivo por routing key.

Abra o topic exchange.

Confirme:

```text
orders.*.v1;

*.created.v1;

#.
```

---

### 14. Preparar autenticação para o HTTP API

Em outro PowerShell:

```powershell
$pair = "formacao:formacao-local"

$basicToken =
  [Convert]::ToBase64String(
    [Text.Encoding]::ASCII.GetBytes(
      $pair
    )
  )

$headers = @{
  Authorization = "Basic $basicToken"
  "Content-Type" = "application/json"
}
```

Essas variáveis ficam apenas na sessão local.

O HTTP API será usado para laboratório e troubleshooting, não como protocolo produtivo de publicação.

---

### 15. Criar função de publicação de prova

```powershell
function Publish-RabbitLabMessage {

  param(
    [Parameter(Mandatory)]
    [string] $Exchange,

    [Parameter(Mandatory)]
    [string] $RoutingKey,

    [Parameter(Mandatory)]
    [hashtable] $Payload
  )

  $body = @{
    properties = @{
      content_type = "application/json"
      delivery_mode = 2
      type = $RoutingKey
    }
    routing_key = $RoutingKey
    payload = (
      $Payload |
        ConvertTo-Json `
          -Compress
    )
    payload_encoding = "string"
  } |
    ConvertTo-Json `
      -Depth 10

  Invoke-RestMethod `
    -Method Put `
    -Uri (
      "http://127.0.0.1:15672" +
      "/api/exchanges/%2F/$Exchange/publish"
    ) `
    -Headers $headers `
    -Body $body
}
```

A resposta informa se a mensagem foi roteada para ao menos uma queue.

Ela não substitui o protocolo AMQP usado pela aplicação.

---

### 16. Testar direct com orders.created.v1

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.orders.events.direct.v1" `
  -RoutingKey "orders.created.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "orders.created.v1"
    orderId = "ORD-476-0001"
    occurredAt = (
      Get-Date
    ).ToUniversalTime().ToString("o")
  }
```

Resultado esperado:

```json
{
  "routed": true
}
```

Na UI, confirme:

```text
m16.fulfillment.orders-created.v1:
1 Ready.

m16.audit.orders-created.v1:
1 Ready.

m16.billing.orders-cancelled.v1:
0 Ready.
```

Uma publicação gerou duas cópias em duas queues diferentes.

---

### 17. Testar direct com orders.cancelled.v1

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.orders.events.direct.v1" `
  -RoutingKey "orders.cancelled.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "orders.cancelled.v1"
    orderId = "ORD-476-0002"
    occurredAt = (
      Get-Date
    ).ToUniversalTime().ToString("o")
  }
```

Resultado:

```text
billing queue:
recebe uma mensagem.

fulfillment:
não recebe essa publicação.

audit orders-created:
não recebe essa publicação.
```

O match foi exato.

---

### 18. Testar direct sem binding

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.orders.events.direct.v1" `
  -RoutingKey "orders.approved.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "orders.approved.v1"
    orderId = "ORD-476-0003"
  }
```

Resultado esperado:

```json
{
  "routed": false
}
```

Não crie um binding aleatório apenas para transformar o resultado em `true`.

A ausência de destino revela uma lacuna de contrato ou topologia.

Na aula 477, o producer será preparado para lidar com publicação e roteamento de maneira explícita.

---

### 19. Testar fanout

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.platform.broadcast.fanout.v1" `
  -RoutingKey "ignored.by.fanout" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "platform.configuration.refreshed.v1"
  }
```

Confirme:

```text
m16.audit.platform-broadcast.v1:
recebeu uma cópia.

m16.analytics.platform-broadcast.v1:
recebeu uma cópia.
```

Repita com outra routing key.

O resultado permanece igual porque fanout ignora a chave.

---

### 20. Testar topic com orders.created.v1

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.domain.events.topic.v1" `
  -RoutingKey "orders.created.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "orders.created.v1"
    orderId = "ORD-476-0004"
  }
```

A mensagem combina com:

```text
orders.*.v1;

*.created.v1;

#.
```

Logo, três queues recebem cópias.

---

### 21. Testar topic com orders.cancelled.v1

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.domain.events.topic.v1" `
  -RoutingKey "orders.cancelled.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "orders.cancelled.v1"
    orderId = "ORD-476-0005"
  }
```

Combina com:

```text
orders.*.v1;

#.
```

Não combina com:

```text
*.created.v1.
```

Logo:

```text
notifications:
sim.

integration created-events:
não.

audit:
sim.
```

---

### 22. Testar topic com customers.created.v1

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.domain.events.topic.v1" `
  -RoutingKey "customers.created.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "customers.created.v1"
    customerId = "CUS-476-0001"
  }
```

Combina com:

```text
*.created.v1;

#.
```

Não combina com:

```text
orders.*.v1.
```

---

### 23. Provar que * representa um segmento

```powershell
Publish-RabbitLabMessage `
  -Exchange "m16.domain.events.topic.v1" `
  -RoutingKey "orders.payment.authorized.v1" `
  -Payload @{
    messageId = [guid]::NewGuid().ToString()
    eventType = "orders.payment.authorized.v1"
  }
```

Esse valor não combina com:

```text
orders.*.v1
```

porque existem dois segmentos:

```text
payment;

authorized.
```

entre `orders` e `v1`.

Ele combina com:

```text
#.
```

A queue de auditoria recebe a mensagem.

---


### 24. Criar teste estrutural

Arquivo:

```text
src/test/java/br/com/formacao/m16/rabbitmq/config/RabbitMqTopologyConfigurationTest.java
```

Código:

```java
package br.com.formacao.m16.rabbitmq.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;

class RabbitMqTopologyConfigurationTest {

    private final RabbitMqTopologyConfiguration configuration =
        new RabbitMqTopologyConfiguration();

    @Test
    void shouldDeclareDirectTopology() {
        Declarables topology =
            configuration.orderDirectTopology();

        assertThat(
            topology.getDeclarablesByType(
                DirectExchange.class
            )
        )
            .extracting(DirectExchange::getName)
            .containsExactly(
                RabbitTopologyNames.ORDERS_DIRECT_EXCHANGE
            );

        assertThat(queueNames(topology))
            .containsExactlyInAnyOrder(
                RabbitTopologyNames
                    .FULFILLMENT_ORDERS_CREATED_QUEUE,
                RabbitTopologyNames
                    .AUDIT_ORDERS_CREATED_QUEUE,
                RabbitTopologyNames
                    .BILLING_ORDERS_CANCELLED_QUEUE
            );

        assertThat(bindingKeys(topology))
            .containsExactlyInAnyOrder(
                RabbitTopologyNames.ORDERS_CREATED_KEY,
                RabbitTopologyNames.ORDERS_CREATED_KEY,
                RabbitTopologyNames.ORDERS_CANCELLED_KEY
            );
    }

    @Test
    void shouldDeclareFanoutTopology() {
        Declarables topology =
            configuration.platformFanoutTopology();

        assertThat(
            topology.getDeclarablesByType(
                FanoutExchange.class
            )
        )
            .extracting(FanoutExchange::getName)
            .containsExactly(
                RabbitTopologyNames
                    .PLATFORM_FANOUT_EXCHANGE
            );

        assertThat(queueNames(topology))
            .containsExactlyInAnyOrder(
                RabbitTopologyNames.PLATFORM_AUDIT_QUEUE,
                RabbitTopologyNames
                    .PLATFORM_ANALYTICS_QUEUE
            );
    }

    @Test
    void shouldDeclareTopicTopology() {
        Declarables topology =
            configuration.domainTopicTopology();

        assertThat(
            topology.getDeclarablesByType(
                TopicExchange.class
            )
        )
            .extracting(TopicExchange::getName)
            .containsExactly(
                RabbitTopologyNames.DOMAIN_TOPIC_EXCHANGE
            );

        assertThat(bindingKeys(topology))
            .containsExactlyInAnyOrder(
                RabbitTopologyNames.ORDERS_V1_PATTERN,
                RabbitTopologyNames.CREATED_V1_PATTERN,
                RabbitTopologyNames.ALL_EVENTS_PATTERN
            );
    }

    private List<String> queueNames(
        Declarables topology
    ) {
        return topology
            .getDeclarablesByType(Queue.class)
            .stream()
            .map(Queue::getName)
            .toList();
    }

    private List<String> bindingKeys(
        Declarables topology
    ) {
        return topology
            .getDeclarablesByType(Binding.class)
            .stream()
            .map(Binding::getRoutingKey)
            .toList();
    }
}
```

Esse teste não conecta ao broker.

Ele verifica a estrutura declarada em código.

A prova de roteamento continua sendo realizada contra o RabbitMQ local.

---

### 25. Executar os testes

```powershell
.\mvnw.cmd `
  -Dtest=RabbitMqTopologyConfigurationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

A aplicação da aula 475 precisa continuar compilando e testando.

---


## Entendendo o que foi feito

### O producer deixou de ser o dono dos destinos

A topologia decide quais queues recebem cada publicação.

### Exchanges passaram a possuir função explícita

Direct compara igualdade, fanout transmite para todas as queues ligadas e topic aplica patterns.

### Queues passaram a representar capacidades

Fulfillment, auditoria, billing, notifications e integration possuem destinos próprios.

### Bindings tornaram o roteamento revisável

As regras estão no código e podem ser testadas.

### Routing keys viraram linguagem de integração

Elas descrevem eventos, não infraestrutura de consumer.

### Multicast foi comprovado

Duas queues com a mesma binding key receberam cópias independentes.

### Competição foi diferenciada de broadcast

Consumers na mesma queue competem; queues diferentes recebem cópias.

### Topologia ficou reprodutível

O `AmqpAdmin` declara os `Declarables` quando a aplicação conecta.

### Incompatibilidade ficou visível

Uma redeclaração com propriedades diferentes não é corrigida silenciosamente.

### A próxima etapa ficou preparada

Os producers poderão publicar nos exchanges nomeados e os consumers poderão possuir responsabilidades separadas.

---

## Erros comuns importantes

### Publicar diretamente para nome de queue em todos os fluxos

Isso mantém o producer acoplado ao destino físico.

### Usar uma queue para vários sistemas independentes

Os consumers passam a competir em vez de todos receberem o evento.

### Criar uma queue por instância

Escalabilidade horizontal normalmente usa várias instâncias consumindo a mesma queue da capacidade.

### Confundir routing key com binding key

Uma acompanha a mensagem; a outra pertence à topologia.

### Acreditar que direct sempre entrega para uma queue

Múltiplas queues podem possuir a mesma binding key.

### Acreditar que fanout entrega para cada processo

Ele entrega para cada queue ligada.

### Usar topic com taxonomia improvisada

Patterns ficam imprevisíveis quando as routing keys não seguem gramática.

### Usar # sem avaliar volume

Uma queue pode receber todos os eventos e crescer rapidamente.

### Alterar durable ou queue type em produção

A declaração incompatível falha e pode interromper startup ou consumidores.

### Corrigir conflito apagando queue automaticamente

A exclusão pode perder mensagens.

### Criar topologia apenas pela UI

O ambiente fica dependente de configuração manual.

### Presumir que routed true significa processado

Significa apenas que ao menos uma queue foi destino da publicação feita pelo HTTP API.

### Usar HTTP API como publisher produtivo

O endpoint é voltado a desenvolvimento e troubleshooting; aplicações devem usar um protocolo de mensageria suportado.

---

## Comandos úteis

### Compilar

```powershell
.\mvnw.cmd clean compile
```

### Iniciar

```powershell
.\mvnw.cmd spring-boot:run
```

### Executar teste estrutural

```powershell
.\mvnw.cmd `
  -Dtest=RabbitMqTopologyConfigurationTest `
  test
```

### Quality gate

```powershell
.\mvnw.cmd clean verify
```

### Listar exchanges da aula

```powershell
$definitions.exchanges |
  Where-Object {
    $_.name -like "m16.*"
  }
```

### Listar bindings da aula

```powershell
$definitions.bindings |
  Where-Object {
    $_.source -like "m16.*"
  }
```

### Consultar uma queue

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri (
    "http://127.0.0.1:15672" +
    "/api/queues/%2F/" +
    "m16.audit.all-domain-events.v1"
  ) `
  -Headers $headers
```

---

## Exercício guiado

### Parte 1 — Direct

Adicione uma queue:

```text
m16.notification.orders-cancelled.v1
```

Ligue-a ao direct exchange com:

```text
orders.cancelled.v1.
```

Publique o evento e confirme duas destinations:

```text
billing;

notification.
```

### Parte 2 — Fanout

Adicione uma terceira queue:

```text
m16.security.platform-broadcast.v1.
```

Confirme que qualquer routing key enviada ao fanout produz uma cópia nela.

### Parte 3 — Topic

Crie uma queue:

```text
m16.operations.all-order-events.v1.
```

Use o pattern:

```text
orders.#.
```

Valide:

```text
orders.created.v1:
match.

orders.payment.authorized.v1:
match.

customers.created.v1:
sem match.
```

### Parte 4 — Sem destino

Publique:

```text
inventory.reserved.v1
```

no direct exchange de orders.

Confirme:

```text
routed:
false.
```

Explique por que criar uma queue não é suficiente sem binding compatível.

### Parte 5 — Concorrência versus cópia

Responda:

```text
duas instâncias na mesma queue:
competição.

duas queues no mesmo binding:
cópias independentes.
```

### Parte 6 — Evidência

Registre:

- exchanges;
- tipos;
- queues;
- bindings;
- routing keys testadas;
- resultado de cada match;
- mensagem não roteada;
- declaração incompatível;
- comando de validação.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 475 foi preservada;
- o mesmo projeto foi reutilizado;
- a queue anterior foi mantida como baseline;
- exchange, queue e binding foram diferenciados;
- routing key e binding key foram diferenciadas;
- a exchange padrão e seu binding automático foram revisados;
- direct exchange foi declarado e validado;
- duas queues receberam `orders.created.v1`;
- `orders.cancelled.v1` chegou somente aos destinos compatíveis;
- fanout exchange foi declarado e ignorou a routing key;
- topic exchange foi declarado;
- `*` foi validado como um segmento;
- `#` foi validado como zero ou mais segmentos;
- headers exchange permaneceu conceitual;
- queues expressam capacidades consumidoras;
- routing keys expressam eventos;
- nomes foram centralizados;
- topologia foi declarada com `Declarables`;
- exchanges e queues são duráveis;
- auto-delete e exclusive permaneceram false;
- a aplicação declarou a topologia no startup;
- exchanges, queues e bindings foram inspecionados;
- o HTTP API foi usado somente no laboratório;
- `routed=true` e `routed=false` foram comprovados;
- teste estrutural foi criado e executado;
- declaração incompatível e `PRECONDITION_FAILED` foram explicados;
- exclusão automática de entidades produtivas foi proibida;
- producer e consumers novos não foram antecipados;
- retry, DLQ, Kafka, outbox, inbox, saga e CDC não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 477 está correta.
## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Revise os nomes:

```powershell
git grep `
  -n `
  -E `
  "DirectExchange|FanoutExchange|TopicExchange|Declarables|BindingBuilder|orders\\.created\\.v1"
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
git commit -m "feat(m16): declarar exchanges queues e bindings"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials reais;
- definitions completas sem revisão;
- mensagens exportadas;
- logs;
- volume do RabbitMQ;
- dumps;
- alterações manuais não representadas no código;
- retry;
- DLQ;
- Kafka;
- código temporário da declaração incompatível.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o RabbitMQ deixou de parecer uma queue acessada diretamente.

O modelo completo ficou:

```text
publisher;

exchange;

routing key;

binding;

queue;

consumer.
```

Você comprovou três estratégias:

```text
direct:
match exato.

fanout:
broadcast para todas as queues ligadas.

topic:
match por patterns.
```

Também ficou claro que:

```text
exchange não armazena;

queue armazena;

binding roteia;

routing key descreve a publicação;

queue representa a capacidade consumidora.
```

A topologia agora é declarada por código com:

```text
DirectExchange;

FanoutExchange;

TopicExchange;

Queue;

BindingBuilder;

Declarables.
```

As decisões principais foram:

- producer não conhece a lista de queues;
- dois consumers independentes precisam de queues independentes;
- duas instâncias da mesma capacidade compartilham a mesma queue;
- direct pode entregar para várias queues com binding key igual;
- fanout ignora routing key;
- topic depende de taxonomia estável;
- `*` representa um segmento;
- `#` representa zero ou mais segmentos;
- mensagem sem binding compatível pode não ser roteada;
- declaração incompatível precisa de migração, não exclusão automática.

A próxima aula será:

```text
477 - M16.22 - Producers consumers
```

Nela, você irá:

- refatorar o producer da aula 475;
- publicar em exchanges nomeados;
- selecionar routing keys por caso de uso;
- configurar conversão JSON de forma centralizada;
- criar consumers separados por capacidade;
- trabalhar com listener containers;
- compreender concorrência;
- aprofundar prefetch;
- diferenciar erro de publicação e erro de consumo;
- observar metadata de entrega;
- preparar o cenário para retry e DLQ.

Retry e dead-lettering continuarão reservados para a aula 478.

---

# Material complementar

## Checkpoint final

- [ ] Declarei direct, fanout e topic exchanges.
- [ ] Criei queues por capacidade.
- [ ] Liguei queues com bindings explícitos.
- [ ] Validei routing keys e patterns.
- [ ] Comprovei uma mensagem sem destino.
- [ ] Executei o teste estrutural.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Exchange não aparece

Confirme:

- aplicação conectada;
- `@Configuration`;
- método com `@Bean`;
- bean `Declarables`;
- credenciais;
- virtual host;
- logs de declaration.

### Queue aparece sem binding customizado

Confirme se você está olhando apenas o binding automático da exchange padrão.

Abra o exchange nomeado e revise os destinations.

### Direct envia para queue errada

Compare literalmente:

```text
routing key;

binding key.
```

Espaços, maiúsculas e segmentos diferentes não combinam.

### Topic não combina

Conte os segmentos.

Lembre:

```text
*:
um segmento.

#:
zero ou mais.
```

### Fanout parece respeitar routing key

Revise se a publicação foi feita no fanout exchange correto.

Fanout ignora a key.

### Routed false

Nenhum binding combinou, o exchange não existe ou a publicação foi enviada ao exchange errado.

Revise primeiro a topologia.

### PRECONDITION_FAILED no startup

Uma entidade já existe com propriedades incompatíveis.

Não tente capturar e ignorar permanentemente.

Compare:

- durable;
- auto-delete;
- exclusive;
- type;
- arguments.

### A queue antiga continua existindo

Isso é esperado.

Ela pertence à baseline da aula 475 e será migrada conscientemente na aula 477.

---

## Perguntas de revisão

1. Qual é a função de um exchange?
2. Exchange armazena mensagens?
3. Qual componente armazena?
4. O que é binding?
5. O que é routing key?
6. O que é binding key?
7. Como funciona direct exchange?
8. Direct sempre entrega para uma queue?
9. Como funciona fanout?
10. Fanout entrega uma cópia para cada processo?
11. Como funciona topic?
12. O que `*` representa?
13. O que `#` representa?
14. Para que serve headers exchange?
15. Por que queue deve representar capacidade?
16. O que ocorre com consumers na mesma queue?
17. O que ocorre com queues diferentes no mesmo binding?
18. O que é topologia como código?
19. O que significa PRECONDITION_FAILED?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Receber publicação e decidir os destinos.
2. Não.
3. Queue.
4. Relação entre exchange e destino.
5. Valor enviado na publicação.
6. Regra exata de um binding direct.
7. Compara routing key e binding key.
8. Não.
9. Envia para todas as queues ligadas.
10. Não, para cada queue.
11. Compara routing key com patterns.
12. Exatamente um segmento.
13. Zero ou mais segmentos.
14. Roteamento por headers.
15. Para deixar ownership e consumo explícitos.
16. Competem pelas entregas.
17. Recebem cópias independentes.
18. Declarar exchanges, queues e bindings no código.
19. Entidade existente incompatível com a declaração.
20. Producers consumers.

---


## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 476 - M16.21 - Exchanges queues bindings

- Continuei no projeto RabbitMQ da aula 475.
- Revisei a exchange padrão.
- Entendi o binding automático pelo nome da queue.
- Diferenciei exchange, queue e binding.
- Entendi que exchange roteia e queue armazena.
- Diferenciei routing key e binding key.
- Defini convenção de routing keys.
- Defini convenção de nomes da topologia.
- Centralizei nomes em `RabbitTopologyNames`.
- Criei `RabbitMqTopologyConfiguration`.
- Declarei topologia com `Declarables`.
- Criei direct exchange durável.
- Criei queues de fulfillment, audit e billing.
- Criei bindings exatos.
- Comprovei duas queues na mesma binding key.
- Compreendi multicast em direct exchange.
- Criei fanout exchange durável.
- Criei queues de audit e analytics.
- Comprovei que fanout ignora routing key.
- Criei topic exchange durável.
- Criei patterns `orders.*.v1`, `*.created.v1` e `#`.
- Comprovei que `*` representa um segmento.
- Comprovei que `#` representa zero ou mais segmentos.
- Mantive headers exchange apenas conceitual.
- Inspecionei exchanges, queues e bindings.
- Publiquei mensagens de prova pelo HTTP API.
- Usei o HTTP API somente para laboratório.
- Comprovei `routed=true`.
- Comprovei `routed=false`.
- Criei teste estrutural da topologia.
- Entendi `PRECONDITION_FAILED`.
- Não apaguei entidades produtivas automaticamente.
- Mantive a queue da aula 475 para migração posterior.
- Não antecipei retry, DLQ, Kafka, outbox ou saga.
- Próxima aula: Producers consumers.
```

---

## Referência técnica curta

- RabbitMQ Documentation — AMQP 0-9-1 Model Explained.
- RabbitMQ Documentation — Exchanges.
- RabbitMQ Documentation — Queues.
- RabbitMQ Tutorial — Publish/Subscribe.
- RabbitMQ Tutorial — Routing.
- RabbitMQ Tutorial — Topics.
- RabbitMQ Documentation — HTTP API Reference.
- Spring AMQP Reference — Configuring the Broker.
- Spring AMQP Reference — AMQP Abstractions.
- Spring AMQP API — `BindingBuilder`.
- Spring AMQP API — `Declarables`.
- Spring Boot Reference — AMQP.

Regra final:

```text
uma topologia RabbitMQ profissional separa publicação, roteamento e consumo: o producer publica em um exchange com uma routing key pertencente ao vocabulário da integração; o exchange aplica seu tipo e os bindings; queues duráveis representam capacidades consumidoras e armazenam cópias independentes; direct exige match exato, fanout transmite para todas as queues ligadas e topic aplica patterns com * e #; consumers na mesma queue competem, enquanto queues distintas recebem cópias; exchanges, queues e bindings devem ser declarados como código, testados e migrados conscientemente quando propriedades mudam; nesta baseline, Spring AMQP usa Declarables para criar topologias direct, fanout e topic, o HTTP API comprova cada rota e a aula seguinte conectará producers e consumers reais a esses destinos.
```
