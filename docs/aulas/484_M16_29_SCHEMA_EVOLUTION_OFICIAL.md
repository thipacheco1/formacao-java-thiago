# 484 - M16.29 - Schema evolution

## Apresentação da aula

Na aula 483, você modelou a diferença entre:

```text
comando;

evento de domínio;

evento de integração.
```

O fluxo ficou:

```text
command;

application service;

aggregate;

invariant;

domain event;

mapper;

integration event;

publisher.
```

O contrato externo criado para o evento de pedido foi:

```text
OrderCreatedIntegrationEventV1
```

com campos como:

```text
eventId;

eventType;

eventVersion;

occurredAt;

orderId;

customerId;

total.
```

Esse contrato funciona hoje.

Mas sistemas distribuídos não são atualizados todos ao mesmo tempo.

Considere a necessidade de adicionar:

```text
salesChannel.
```

O producer pode ser implantado antes de alguns consumers.

Um consumer pode permanecer na versão antiga por dias.

Records antigos continuam retidos no Kafka.

Um replay pode entregar eventos produzidos meses antes.

A pergunta central desta aula será:

```text
como evoluir um contrato de evento

sem impedir consumers antigos
de ler novos eventos

e sem impedir consumers novos
de ler eventos antigos?
```

A resposta será construída com:

```text
writer schema;

reader schema;

backward compatibility;

forward compatibility;

full compatibility;

campos opcionais;

defaults de aplicação;

consumers tolerantes;

testes de matriz;

mudanças incompatíveis;

versão majoritária.
```

A aula utilizará JSON e JSON Schema como artefatos versionados.

Ainda não será utilizado um Schema Registry.

A validação automática será feita no repositório por meio de:

```text
fixtures;

deserialização com Jackson;

testes de compatibilidade;

inspeção estrutural dos schemas;

matriz documentada.
```

Na aula 485, esses conceitos serão levados ao contexto de um Schema Registry conceitual.

A evolução compatível escolhida será:

```text
contrato orders.created.v1;

schema revision inicial:
1;

schema revision evoluída:
2;

novo campo:
salesChannel;

campo:
opcional;

fallback do consumer novo:
UNKNOWN.
```

O tipo lógico continuará:

```text
orders.created.v1.
```

Motivo:

```text
a adição é compatível
e não altera o significado central
do evento.
```

Uma versão majoritária nova será reservada para mudanças incompatíveis.

Exemplo:

```text
orders.created.v2
```

seria necessário se o contrato:

- renomeasse `orderId`;
- alterasse `total` de número para objeto;
- removesse `customerId`;
- mudasse radicalmente a semântica;
- exigisse campo inexistente em eventos antigos;
- alterasse a unidade monetária sem representação explícita.

A aula adotará uma política tolerante para evolução aditiva.

Consumers antigos deverão:

```text
ignorar propriedades desconhecidas.
```

Consumers novos deverão:

```text
aceitar ausência do campo novo
e aplicar fallback de aplicação.
```

Importante:

```text
default em JSON Schema
não preenche automaticamente
o payload durante a validação.
```

O fallback precisa existir no consumer, mapper ou camada de aplicação.

A aula também mostrará que:

```text
additionalProperties: false
```

é uma escolha rigorosa, mas pode impedir uma evolução aditiva sob o mesmo schema quando o consumer antigo valida o payload estritamente.

A baseline utilizará:

```text
additionalProperties: true
```

para a família `orders.created.v1`, acompanhada de:

- propriedades conhecidas documentadas;
- testes;
- naming policy;
- proibição de reutilizar campos;
- revisão de contrato.

Não existe escolha universal.

Organizações que exigem schemas fechados podem criar um novo major para qualquer campo adicional.

Ao final, você deverá explicar:

```text
o que writer schema representa;

o que reader schema representa;

por que backward e forward
dependem da direção da leitura;

por que campo novo deve ser opcional;

por que default não altera a mensagem;

por que consumers antigos
precisam tolerar unknown fields;

por que renomear é remover e adicionar;

por que mudança semântica
pode quebrar sem alterar o JSON;

por que compatibilidade
precisa ser testada;

por que Schema Registry
não será implementado ainda.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
483:
Eventos de domínio.

484:
Schema evolution.

485:
Schema Registry conceitual.

486:
Poison message.

487:
Deduplicação.

488:
Outbox Pattern.
```

A aula 483 respondeu:

```text
como representar
um fato do domínio?
```

A aula 484 responderá:

```text
como esse contrato evolui
enquanto producers, consumers
e dados históricos coexistem?
```

Nesta aula:

```text
JSON Schema:
sim.

writer schema:
sim.

reader schema:
sim.

backward compatibility:
sim.

forward compatibility:
sim.

full compatibility:
sim.

campo opcional:
sim.

default de aplicação:
sim.

fixtures:
sim.

testes de compatibilidade:
sim.

mudança semântica:
sim.

novo major:
sim.

Schema Registry:
não.

Avro:
não.

Protobuf:
não.

registro remoto:
não.

validação no broker:
não.
```

A regra central será:

```text
contratos precisam evoluir
de forma explícita e testável;

um deploy novo não pode presumir
que todo consumer e todo record
também são novos.
```

---

## Objetivo prático

O projeto continua em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Ao final, a estrutura terá:

```text
contracts/events/orders-created
├── README.md
├── compatibility-matrix.md
├── v1
│   ├── schema-revision-1.json
│   └── examples
│       └── order-created-v1.json
├── v1-revision-2
│   ├── schema-revision-2.json
│   └── examples
│       └── order-created-v1-with-sales-channel.json
└── breaking-examples
    ├── order-created-required-sales-channel.json
    ├── order-created-renamed-order-number.json
    └── order-created-total-as-object.json
```

Código:

```text
src/main/java/br/com/formacao/m16/kafka
├── integration
│   ├── event
│   │   ├── OrderCreatedIntegrationEventV1.java
│   │   └── OrderCreatedIntegrationEventV1Revision2.java
│   └── compatibility
│       ├── OrderCreatedV1Reader.java
│       └── OrderCreatedV1Revision2Reader.java
└── message
    └── SalesChannel.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka
└── integration
    └── compatibility
        ├── OrderCreatedBackwardCompatibilityTest.java
        ├── OrderCreatedForwardCompatibilityTest.java
        ├── OrderCreatedSchemaPolicyTest.java
        └── OrderCreatedBreakingChangesTest.java
```

Você irá:

1. definir writer e reader schema;
2. criar o schema revision 1;
3. criar uma fixture antiga;
4. criar a revision 2;
5. adicionar `salesChannel`;
6. manter o novo campo opcional;
7. criar fixture nova;
8. tornar o reader antigo tolerante;
9. criar fallback no reader novo;
10. testar novo reader com payload antigo;
11. testar reader antigo com payload novo;
12. documentar full compatibility;
13. criar exemplos incompatíveis;
14. detectar campo obrigatório novo;
15. detectar renomeação;
16. detectar mudança de tipo;
17. detectar mudança semântica;
18. criar matriz de compatibilidade;
19. criar política de versionamento;
20. executar o gate;
21. commitar;
22. preparar Schema Registry.

---

## Conceito essencial

### Schema

Schema descreve a estrutura e as restrições de um contrato.

Para JSON, ele pode declarar:

- tipo do documento;
- propriedades;
- campos obrigatórios;
- tipos;
- formatos;
- enums;
- limites;
- objetos;
- arrays;
- propriedades adicionais.

Um schema não é apenas documentação.

Ele pode ser usado por:

- testes;
- geração;
- validação;
- revisão;
- compatibilidade;
- governança.

---

### Writer schema

Writer schema é o schema utilizado pelo producer para escrever o dado.

Exemplo:

```text
producer revision 2
escreve salesChannel.
```

O payload novo pertence ao writer schema revision 2.

---

### Reader schema

Reader schema é a visão que o consumer utiliza para interpretar o dado.

Exemplo:

```text
consumer antigo
conhece revision 1.

consumer novo
conhece revision 2.
```

Compatibilidade depende de combinar:

```text
writer;

reader.
```

Não é propriedade abstrata de um único arquivo.

---

### Backward compatibility

Nesta aula, backward compatibility significa:

```text
reader novo
consegue ler dados antigos.
```

Exemplo:

```text
consumer revision 2
lê payload revision 1
sem salesChannel.
```

Para isso, `salesChannel` não pode ser obrigatório no reader novo ou precisa existir uma estratégia compatível de resolução.

Na baseline JSON:

```text
campo ausente
vira UNKNOWN
na camada de aplicação.
```

---

### Forward compatibility

Forward compatibility significa:

```text
reader antigo
consegue ler dados novos.
```

Exemplo:

```text
consumer revision 1
lê payload revision 2
com salesChannel.
```

Para isso, o consumer antigo precisa tolerar campos desconhecidos.

No Jackson:

```java
@JsonIgnoreProperties(
    ignoreUnknown = true
)
```

Sem essa tolerância, o campo adicional pode quebrar a deserialização.

---

### Full compatibility

Full compatibility combina:

```text
backward;

forward.
```

Na baseline:

```text
reader novo lê payload antigo;

reader antigo lê payload novo.
```

A matriz precisa provar os dois sentidos.

---

### Compatibilidade transitive

Uma verificação pode comparar:

```text
novo schema
contra a versão imediatamente anterior
```

ou:

```text
novo schema
contra todas as versões anteriores.
```

A segunda política é transitive.

Sem registry, o repositório desta aula manterá todas as fixtures históricas e executará testes contra cada uma.

Isso cria uma baseline transitive local.

---

### Campo opcional

Adicionar campo opcional é uma evolução comum.

Exemplo:

```json
{
  "salesChannel": "WEB"
}
```

O campo não entra no array:

```json
"required": [...]
```

Consumers novos precisam aceitar ausência.

Consumers antigos precisam ignorar presença desconhecida.

---

### Default

Em JSON Schema:

```json
"default": "UNKNOWN"
```

documenta um valor recomendado ou esperado.

Ele não obriga um validador a alterar o documento.

Portanto, este payload:

```json
{
  "orderId": "ORD-1"
}
```

continua sem `salesChannel`.

O código novo precisa resolver:

```java
salesChannel == null
    ? SalesChannel.UNKNOWN
    : salesChannel;
```

---

### Campo required novo

Adicionar um campo novo ao array `required` quebra a leitura de dados antigos.

Exemplo:

```text
schema novo exige salesChannel;

evento antigo não possui salesChannel.
```

O reader novo não consegue validar o histórico.

Isso quebra backward compatibility.

---

### Remoção de campo

Remover `customerId` pode quebrar consumers que dependem dele.

Mesmo que o producer novo continue produzindo JSON válido para seu próprio schema, readers antigos podem falhar semanticamente.

Remoção exige:

- análise de uso;
- depreciação;
- período de coexistência;
- novo major quando necessário;
- migração dos consumers.

---

### Renomeação

Renomear:

```text
orderId
```

para:

```text
orderNumber
```

é equivalente a:

```text
remover orderId;

adicionar orderNumber.
```

Não trate como mudança cosmética.

Uma transição segura pode publicar os dois campos temporariamente, mas isso exige política clara e prazo de remoção.

---

### Mudança de tipo

Alterar:

```text
total:
number
```

para:

```text
total:
object
```

é incompatível.

Mesmo que o novo objeto seja mais completo, consumers antigos esperam número.

Use novo campo ou novo major.

---

### Mudança semântica

Uma mudança pode manter o mesmo tipo JSON e ainda quebrar.

Exemplo:

```text
total antes:
valor bruto do pedido.

total depois:
valor líquido com desconto.
```

O schema continua dizendo:

```text
number.
```

Mas o significado mudou.

Compatibilidade estrutural não garante compatibilidade semântica.

Descrição, naming, testes e revisão humana continuam necessários.

---

### Enum evolution

Adicionar valor a enum pode quebrar consumers que utilizam:

```java
switch
```

sem fallback.

Exemplo:

```text
WEB;

STORE;

MARKETPLACE.
```

Um consumer antigo que conhece apenas `WEB` e `STORE` pode falhar com `MARKETPLACE`.

Para contratos extensíveis, considere:

- fallback `UNKNOWN`;
- valor textual tolerante;
- tratamento default;
- novo major quando o conjunto é fechado por negócio.

---

### Coreografia de implantação

Compatibilidade estrutural precisa ser acompanhada por uma ordem segura de deploy.

Para uma adição opcional, a sequência recomendada é:

```text
1. publicar schemas e fixtures no repositório;

2. atualizar readers e validators;

3. implantar consumers tolerantes;

4. confirmar métricas e ausência de rejeições;

5. implantar o producer que envia o campo novo;

6. monitorar consumers antigos;

7. manter fixtures das duas revisions.
```

O producer não deve começar a emitir o campo antes que os consumers críticos estejam preparados.

Em ambientes com muitos consumers, mantenha um inventário com:

- aplicação;
- owner;
- versão implantada;
- reader schema;
- política de unknown fields;
- data da última validação;
- contato operacional.

A coreografia não elimina todos os riscos, mas reduz a janela em que um payload novo encontra um reader incompatível.

### Revisão de compatibilidade semântica

Toda alteração de schema deve responder:

```text
o nome mantém o mesmo significado?

a unidade permanece igual?

o valor continua representando
o mesmo instante ou período?

a precisão numérica mudou?

o campo passou a aceitar
um estado antes impossível?

a ausência continua significando
a mesma coisa?
```

Essas perguntas não são resolvidas apenas por um validador estrutural.

Uma mudança de reais para centavos, de horário UTC para local ou de valor bruto para líquido pode manter o mesmo tipo JSON e ainda quebrar o negócio.

### additionalProperties

Com:

```json
"additionalProperties": false
```

qualquer campo não declarado é inválido.

Vantagem:

```text
detecta typos;

mantém contrato fechado.
```

Custo:

```text
consumer antigo que valida estritamente
rejeita campo novo.
```

Com:

```json
"additionalProperties": true
```

campos novos podem passar.

Vantagem:

```text
facilita evolução aditiva.
```

Custo:

```text
typos podem não ser detectados
sem outras políticas.
```

A decisão precisa ser organizacional.

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

Os testes anteriores precisam continuar verdes.

---

### 2. Criar diretórios de contrato

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "contracts/events/orders-created/v1/examples" |
  Out-Null

New-Item `
  -ItemType Directory `
  -Force `
  "contracts/events/orders-created/v1-revision-2/examples" |
  Out-Null

New-Item `
  -ItemType Directory `
  -Force `
  "contracts/events/orders-created/breaking-examples" |
  Out-Null
```

---

### 3. Criar schema revision 1

Arquivo:

```text
contracts/events/orders-created/v1/schema-revision-1.json
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:formacao:m16:orders-created:v1:revision-1",
  "title": "OrderCreatedV1Revision1",
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "eventId": {
      "type": "string",
      "format": "uuid"
    },
    "eventType": {
      "const": "orders.created.v1"
    },
    "eventVersion": {
      "const": 1
    },
    "occurredAt": {
      "type": "string",
      "format": "date-time"
    },
    "orderId": {
      "type": "string",
      "minLength": 1
    },
    "customerId": {
      "type": "string",
      "minLength": 1
    },
    "total": {
      "type": "number",
      "exclusiveMinimum": 0
    }
  },
  "required": [
    "eventId",
    "eventType",
    "eventVersion",
    "occurredAt",
    "orderId",
    "customerId",
    "total"
  ]
}
```

---

### 4. Criar fixture antiga

Arquivo:

```text
contracts/events/orders-created/v1/examples/order-created-v1.json
```

```json
{
  "eventId": "3aa73ab6-4878-4cf0-a099-7513ebf06144",
  "eventType": "orders.created.v1",
  "eventVersion": 1,
  "occurredAt": "2026-07-12T18:00:00Z",
  "orderId": "ORD-484-0001",
  "customerId": "CUS-484-0001",
  "total": 149.90
}
```

Não adicione `salesChannel`.

---

### 5. Criar enum tolerante

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/message/SalesChannel.java
```

```java
package br.com.formacao.m16.kafka.message;

public enum SalesChannel {
    WEB,
    STORE,
    MARKETPLACE,
    UNKNOWN
}
```

`UNKNOWN` protege o consumer contra ausência e evolução controlada.

---

### 6. Criar contrato revision 2

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/event/OrderCreatedIntegrationEventV1Revision2.java
```

```java
package br.com.formacao.m16.kafka.integration.event;

import br.com.formacao.m16.kafka.message.SalesChannel;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderCreatedIntegrationEventV1Revision2(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total,
    SalesChannel salesChannel
) {

    public OrderCreatedIntegrationEventV1Revision2 {
        if (salesChannel == null) {
            salesChannel = SalesChannel.UNKNOWN;
        }
    }
}
```

O tipo lógico continua `v1`.

---

### 7. Criar schema revision 2

Arquivo:

```text
contracts/events/orders-created/v1-revision-2/schema-revision-2.json
```

Copie as propriedades da revision 1 e adicione:

```json
"salesChannel": {
  "type": "string",
  "enum": [
    "WEB",
    "STORE",
    "MARKETPLACE",
    "UNKNOWN"
  ],
  "default": "UNKNOWN"
}
```

Não adicione `salesChannel` em `required`.

Mantenha:

```json
"additionalProperties": true
```

Atualize `$id` e `title`.

---

### 8. Criar fixture nova

Arquivo:

```text
contracts/events/orders-created/v1-revision-2/examples/order-created-v1-with-sales-channel.json
```

```json
{
  "eventId": "4b201e3d-bf53-44b0-bc9a-93ea2cd93cbb",
  "eventType": "orders.created.v1",
  "eventVersion": 1,
  "occurredAt": "2026-07-12T18:10:00Z",
  "orderId": "ORD-484-0002",
  "customerId": "CUS-484-0002",
  "total": 249.90,
  "salesChannel": "WEB"
}
```

---

### 9. Criar reader antigo tolerante

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/compatibility/OrderCreatedV1Reader.java
```

```java
package br.com.formacao.m16.kafka.integration.compatibility;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@JsonIgnoreProperties(
    ignoreUnknown = true
)
public record OrderCreatedV1Reader(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

Esse reader simula um consumer antigo.

---

### 10. Criar reader novo

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/compatibility/OrderCreatedV1Revision2Reader.java
```

```java
package br.com.formacao.m16.kafka.integration.compatibility;

import br.com.formacao.m16.kafka.message.SalesChannel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@JsonIgnoreProperties(
    ignoreUnknown = true
)
public record OrderCreatedV1Revision2Reader(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total,
    SalesChannel salesChannel
) {

    public SalesChannel resolvedSalesChannel() {
        return salesChannel == null
            ? SalesChannel.UNKNOWN
            : salesChannel;
    }
}
```

O fallback é explícito.

---

### 11. Testar backward compatibility

Arquivo:

```text
OrderCreatedBackwardCompatibilityTest.java
```

```java
package br.com.formacao.m16.kafka.integration.compatibility;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.formacao.m16.kafka.message.SalesChannel;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class OrderCreatedBackwardCompatibilityTest {

    private final ObjectMapper objectMapper =
        new ObjectMapper()
            .findAndRegisterModules();

    @Test
    void newReaderShouldReadOldPayload()
            throws Exception {
        String json =
            Files.readString(
                Path.of(
                    "contracts/events/orders-created/"
                        + "v1/examples/order-created-v1.json"
                )
            );

        OrderCreatedV1Revision2Reader event =
            objectMapper.readValue(
                json,
                OrderCreatedV1Revision2Reader.class
            );

        assertThat(event.orderId())
            .isEqualTo("ORD-484-0001");

        assertThat(
            event.resolvedSalesChannel()
        )
            .isEqualTo(
                SalesChannel.UNKNOWN
            );
    }
}
```

Novo reader leu dado antigo.

---

### 12. Testar forward compatibility

Arquivo:

```text
OrderCreatedForwardCompatibilityTest.java
```

```java
package br.com.formacao.m16.kafka.integration.compatibility;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class OrderCreatedForwardCompatibilityTest {

    private final ObjectMapper objectMapper =
        new ObjectMapper()
            .findAndRegisterModules();

    @Test
    void oldReaderShouldIgnoreNewOptionalField()
            throws Exception {
        String json =
            Files.readString(
                Path.of(
                    "contracts/events/orders-created/"
                        + "v1-revision-2/examples/"
                        + "order-created-v1-with-sales-channel.json"
                )
            );

        OrderCreatedV1Reader event =
            objectMapper.readValue(
                json,
                OrderCreatedV1Reader.class
            );

        assertThat(event.orderId())
            .isEqualTo("ORD-484-0002");

        assertThat(event.total())
            .isEqualByComparingTo("249.90");
    }
}
```

Reader antigo ignorou o campo novo.

---

### 13. Criar teste de policy

Leia os schemas como `JsonNode`.

Confirme:

```text
eventType permanece orders.created.v1;

eventVersion permanece 1;

required antigo continua presente;

salesChannel existe;

salesChannel não é required;

additionalProperties é true;

default é apenas metadata.
```

O teste não deve inserir automaticamente o default no payload.

---

### 14. Criar exemplo incompatível: required

Arquivo:

```text
breaking-examples/order-created-required-sales-channel.json
```

Represente um schema que adiciona:

```json
"salesChannel"
```

ao array `required`.

O teste deve classificá-lo como:

```text
BACKWARD_INCOMPATIBLE.
```

Motivo:

```text
reader novo rejeita eventos antigos.
```

---

### 15. Criar exemplo incompatível: rename

Arquivo:

```text
breaking-examples/order-created-renamed-order-number.json
```

Substitua:

```text
orderId
```

por:

```text
orderNumber.
```

Classifique:

```text
BREAKING.
```

Motivo:

```text
consumers antigos não recebem orderId;

records antigos não possuem orderNumber.
```

---

### 16. Criar exemplo incompatível: type

Arquivo:

```text
breaking-examples/order-created-total-as-object.json
```

Altere:

```json
"total": {
  "type": "number"
}
```

para:

```json
"total": {
  "type": "object",
  "properties": {
    "amount": {
      "type": "number"
    },
    "currency": {
      "type": "string"
    }
  },
  "required": [
    "amount",
    "currency"
  ]
}
```

Classifique como incompatível sob o mesmo contrato V1.

---

### 17. Criar matriz de compatibilidade

Arquivo:

```text
contracts/events/orders-created/compatibility-matrix.md
```

```markdown
# Compatibility matrix — orders.created.v1

| Writer | Reader | Resultado | Tipo |
|---|---|---|---|
| Revision 1 | Revision 1 | Aceito | Baseline |
| Revision 1 | Revision 2 | Aceito | Backward |
| Revision 2 | Revision 1 | Aceito | Forward |
| Revision 2 | Revision 2 | Aceito | Atual |
| Required salesChannel | Revision 1 data | Rejeitado | Breaking |
| Renamed orderId | Revision 1 reader | Rejeitado | Breaking |
| total object | Revision 1 reader | Rejeitado | Breaking |
```

---

### 18. Criar README de policy

Arquivo:

```text
contracts/events/orders-created/README.md
```

Registre:

```text
event family:
orders.created.

major contract:
v1.

compatible additions:
same major.

breaking changes:
new major.

unknown fields:
tolerated.

new fields:
optional.

defaults:
applied by consumer code.

field reuse:
forbidden.

semantic change:
requires review.

historical fixtures:
never deleted.
```

---

### 19. Testar enum desconhecido

Crie uma fixture temporária com:

```text
salesChannel:
SOCIAL_COMMERCE.
```

O enum Java estrito falhará.

Registre a decisão:

```text
enum fechado:
novo valor pode ser breaking.
```

Opções futuras:

- custom deserializer para `UNKNOWN`;
- string com validação na aplicação;
- novo major;
- política de enum extensível.

Não implemente um deserializer complexo nesta aula.

---

### 20. Testar mudança semântica

Crie um teste documental:

```text
total mantém number,
mas descrição muda.
```

O teste estrutural não detecta.

Adicione uma regra na revisão:

```text
mudança de significado
exige aprovação humana
e pode exigir novo major.
```

---

### 21. Executar testes de compatibilidade

```powershell
.\mvnw.cmd `
  -Dtest=OrderCreatedBackwardCompatibilityTest,OrderCreatedForwardCompatibilityTest,OrderCreatedSchemaPolicyTest,OrderCreatedBreakingChangesTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 22. Não alterar o producer ainda

A aula não mudará o producer principal para emitir revision 2 em produção.

O objetivo é preparar e testar o contrato.

Uma implantação segura seguirá:

```text
1. atualizar consumers para tolerância;

2. validar consumers novos com dados antigos;

3. implantar consumers;

4. atualizar producer para campo opcional;

5. monitorar;

6. remover compatibilidade somente
em novo major planejado.
```

---

## Entendendo o que foi feito

### O contrato ganhou histórico

Revision 1 e revision 2 permaneceram versionadas.

### A evolução aditiva ficou explícita

`salesChannel` foi adicionado como opcional.

### Backward compatibility foi comprovada

Reader novo leu payload antigo.

### Forward compatibility foi comprovada

Reader antigo ignorou campo novo.

### Full compatibility surgiu da matriz

Os dois sentidos funcionaram.

### Default deixou de ser mágico

O fallback foi implementado no código.

### Mudanças quebradoras ficaram visíveis

Required novo, rename e type change falharam na policy.

### Compatibilidade semântica ganhou revisão humana

Tipo igual não garante significado igual.

### O major permaneceu estável

Mudança compatível continuou em `orders.created.v1`.

### A próxima etapa ficou preparada

Um Schema Registry poderá automatizar policies e versões.

---

## Erros comuns importantes

### Adicionar required novo

Dados históricos deixam de validar.

### Renomear campo diretamente

É remoção mais adição.

### Alterar tipo no mesmo major

Consumers antigos quebram.

### Confiar em default do JSON Schema

O payload não é preenchido automaticamente.

### Consumer antigo falhar em unknown field

Evolução aditiva fica impossível.

### Permitir qualquer campo sem governança

Typos passam despercebidos.

### Remover fixtures antigas

Compatibilidade transitive deixa de ser testada.

### Testar só schema novo com payload novo

A matriz histórica não é exercitada.

### Confundir versão de schema e major semântico

Nem toda revisão compatível precisa de novo event type.

### Adicionar valor de enum sem fallback

Consumers antigos podem falhar.

### Alterar significado sem alterar tipo

Testes estruturais podem ficar verdes e negócio quebrar.

### Implantar producer primeiro

Consumers antigos recebem o novo formato antes de estarem preparados.

---

## Comandos úteis

### Testes de compatibilidade

```powershell
.\mvnw.cmd `
  -Dtest=*CompatibilityTest,*SchemaPolicyTest,*BreakingChangesTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Localizar schemas

```powershell
Get-ChildItem `
  "contracts/events/orders-created" `
  -Recurse
```

### Procurar required

```powershell
git grep `
  -n `
  '"required"' `
  -- `
  "contracts/events"
```

### Ver mudanças de contrato

```powershell
git diff `
  -- `
  "contracts/events"
```

---

## Exercício guiado

### Parte 1 — Revision 1

Crie schema e fixture.

### Parte 2 — Revision 2

Adicione campo opcional.

### Parte 3 — Backward

Novo reader lê antigo.

### Parte 4 — Forward

Reader antigo lê novo.

### Parte 5 — Default

Implemente fallback.

### Parte 6 — Required

Comprove quebra.

### Parte 7 — Rename

Comprove quebra.

### Parte 8 — Type

Comprove quebra.

### Parte 9 — Matriz

Documente todos os pares.

### Parte 10 — Rollout

Defina ordem de implantação.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 483 foi preservada;
- schema foi definido;
- writer schema foi explicado;
- reader schema foi explicado;
- backward compatibility foi explicada;
- forward compatibility foi explicada;
- full compatibility foi explicada;
- transitive compatibility foi contextualizada;
- revision 1 foi criada;
- fixture antiga foi criada;
- revision 2 foi criada;
- fixture nova foi criada;
- `salesChannel` foi adicionado;
- campo novo permaneceu opcional;
- campo novo não entrou em required;
- default foi documentado;
- default foi implementado no consumer;
- default não foi tratado como mutação automática;
- reader antigo ignora unknown fields;
- reader novo aceita ausência;
- backward test foi criado;
- forward test foi criado;
- full matrix foi criada;
- schemas históricos foram preservados;
- fixtures históricas foram preservadas;
- `additionalProperties` foi discutido;
- baseline tolerante foi escolhida;
- trade-off de schema fechado foi registrado;
- required novo foi classificado como breaking;
- rename foi classificado como breaking;
- type change foi classificado como breaking;
- remoção foi discutida;
- mudança semântica foi discutida;
- compatibilidade estrutural não foi tratada como suficiente;
- enum evolution foi discutida;
- enum desconhecido foi testado;
- fallback de enum foi considerado;
- event type permaneceu `orders.created.v1`;
- eventVersion permaneceu `1`;
- revisão compatível não criou major novo;
- novo major foi reservado para quebra;
- field reuse foi proibido;
- producer-first rollout foi proibido;
- consumer-first rollout foi documentado;
- testes foram executados;
- gate foi executado;
- Schema Registry não foi implementado;
- Avro e Protobuf não foram antecipados;
- deduplicação não foi antecipada;
- outbox não foi antecipado;
- commit recomendado está pronto;
- ponte para aula 485 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Revise contratos:

```powershell
git diff `
  -- `
  contracts/events/orders-created
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
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
git commit -m "test(m16): validar schema evolution de eventos"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- payload real;
- dados pessoais;
- schema temporário;
- fixture com segredo;
- major novo sem decisão;
- Schema Registry antecipado;
- dependência de registry;
- contrato sem teste.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o contrato `orders.created.v1` passou a possuir uma política de evolução.

O fluxo ficou:

```text
schema revision 1;

payload antigo;

schema revision 2;

campo opcional;

reader antigo;

reader novo;

backward test;

forward test;

compatibility matrix.
```

Você comprovou que:

- reader novo precisa ler dados antigos;
- reader antigo precisa tolerar dados novos;
- campo adicional deve ser opcional para a baseline;
- default do schema não preenche o payload;
- fallback precisa existir no código;
- required novo quebra dados históricos;
- rename equivale a remoção e adição;
- mudança de tipo exige novo contrato;
- enum pode quebrar consumers;
- mudança semântica pode escapar de validação estrutural;
- fixtures históricas protegem compatibilidade transitive;
- producer deve ser implantado depois dos consumers tolerantes;
- mudança compatível pode permanecer em `orders.created.v1`;
- mudança incompatível exige novo major.

A próxima aula será:

```text
485 - M16.30 - Schema Registry conceitual
```

Nela, você irá:

- compreender subject;
- compreender schema id;
- compreender versões registradas;
- comparar BACKWARD, FORWARD e FULL;
- compreender variantes TRANSITIVE;
- estudar validação antes do publish;
- relacionar serializer e registry;
- compreender cache de schemas;
- analisar indisponibilidade do registry;
- comparar Avro, JSON Schema e Protobuf;
- desenhar governança;
- preparar poison message.

A próxima aula continuará conceitual.

Nenhum registry será instalado ou acoplado ao laboratório antecipadamente.

---

# Material complementar

## Checkpoint final

- [ ] Versionei schemas e fixtures.
- [ ] Adicionei campo opcional.
- [ ] Testei backward compatibility.
- [ ] Testei forward compatibility.
- [ ] Criei matriz de compatibilidade.
- [ ] Classifiquei mudanças quebradoras.
- [ ] Documentei rollout.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Reader novo recebe null

A fixture antiga não possui o campo. Use fallback de aplicação.

### Reader antigo falha no campo novo

Confirme `ignoreUnknown=true` e configuração global do ObjectMapper.

### Default não aparece no objeto

JSON Schema não insere o valor automaticamente.

### Teste de forward passa sem querer

O ObjectMapper pode estar configurado globalmente para ignorar unknowns. Confirme que isso é policy consciente.

### required novo não quebra teste

O teste pode estar deserializando sem validar a policy do schema.

### Enum desconhecido falha

Defina política extensível ou novo major.

### additionalProperties false quebra adição

Isso é esperado em schema fechado.

### Matriz não cobre revisão antiga

Não remova fixtures históricas.

### Mudança semântica fica verde

Adicione revisão humana, descrição e testes de negócio.

### Producer novo quebra consumers

A ordem de rollout foi invertida.

---

## Perguntas de revisão

1. O que é writer schema?
2. O que é reader schema?
3. O que é backward compatibility?
4. O que é forward compatibility?
5. O que é full compatibility?
6. O que é transitive?
7. Campo novo deve ser required?
8. Default preenche o JSON?
9. Onde aplicar fallback?
10. Como reader antigo tolera campo novo?
11. Renomear é compatível?
12. Alterar tipo é compatível?
13. Remover campo é seguro?
14. Enum novo pode quebrar?
15. additionalProperties false ajuda em quê?
16. Qual custo dessa rigidez?
17. Mudança semântica é detectada pelo tipo?
18. Quem deve ser implantado primeiro?
19. Schema Registry foi instalado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Schema usado pelo producer.
2. Schema usado pelo consumer.
3. Reader novo lê dados antigos.
4. Reader antigo lê dados novos.
5. Os dois sentidos.
6. Comparação com todo histórico.
7. Não na evolução aditiva.
8. Não.
9. No código do consumer.
10. Ignorando unknown fields.
11. Não.
12. Não.
13. Não sem migração.
14. Sim.
15. Detectar campos inesperados.
16. Dificulta adições compatíveis.
17. Não necessariamente.
18. Consumers tolerantes.
19. Não.
20. Schema Registry conceitual.

---

## Desafio opcional

Evolua:

```text
orders.confirmed.v1
```

Adicione:

```text
confirmationSource.
```

Requisitos:

- revision 1;
- revision 2;
- campo opcional;
- fallback `UNKNOWN`;
- reader antigo;
- reader novo;
- backward test;
- forward test;
- matriz;
- exemplo de rename incompatível;
- nenhuma instalação de Schema Registry.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 484 - M16.29 - Schema evolution

- Continuei a partir dos eventos de domínio.
- Defini schema de evento.
- Diferenciei writer schema e reader schema.
- Entendi backward compatibility.
- Entendi forward compatibility.
- Entendi full compatibility.
- Contextualizei compatibilidade transitive.
- Criei schema revision 1.
- Criei fixture histórica revision 1.
- Criei schema revision 2.
- Adicionei `salesChannel`.
- Mantive o campo opcional.
- Não adicionei o campo em `required`.
- Criei fixture revision 2.
- Mantive `orders.created.v1`.
- Mantive `eventVersion=1`.
- Criei `SalesChannel.UNKNOWN`.
- Implementei fallback no consumer novo.
- Entendi que JSON Schema default não preenche dados.
- Tornei o reader antigo tolerante a campos desconhecidos.
- Testei reader novo com payload antigo.
- Testei reader antigo com payload novo.
- Criei matriz de compatibilidade.
- Preservei schemas e fixtures históricas.
- Discuti `additionalProperties`.
- Escolhi policy tolerante para evolução aditiva.
- Classifiquei required novo como breaking.
- Classifiquei rename como breaking.
- Classifiquei mudança de tipo como breaking.
- Discuti remoção de campo.
- Discuti enum evolution.
- Testei valor de enum desconhecido.
- Diferenciei compatibilidade estrutural e semântica.
- Documentei rollout consumer-first.
- Reservei novo major para mudanças incompatíveis.
- Não antecipei Schema Registry.
- Próxima aula: Schema Registry conceitual.
```

---

## Referência técnica curta

- JSON Schema — Specification.
- JSON Schema — Object properties.
- JSON Schema — Required properties.
- JSON Schema — Annotations and default.
- AsyncAPI — Message validation.
- AsyncAPI — Message schemas.
- Confluent Schema Registry — Schema evolution.
- Confluent Schema Registry — Compatibility types.
- Apache Kafka — Data contracts.
- Spring Kafka — JSON serialization.

Regra final:

```text
schema evolution precisa considerar writers, readers e dados históricos: backward compatibility permite que readers novos leiam payloads antigos; forward compatibility permite que readers antigos leiam payloads novos; full compatibility exige os dois sentidos; campos adicionais devem ser opcionais na policy aditiva, readers antigos precisam ignorar propriedades desconhecidas e readers novos precisam aplicar fallback quando o campo estiver ausente; JSON Schema default documenta, mas não preenche o payload; required novo, rename, remoção, mudança de tipo, enum fechado e mudança semântica podem quebrar consumers; fixtures históricas e uma matriz de testes protegem compatibilidade transitive; consumers tolerantes devem ser implantados antes do producer novo, e mudanças incompatíveis exigem um novo major em vez de alterar silenciosamente orders.created.v1.
```
