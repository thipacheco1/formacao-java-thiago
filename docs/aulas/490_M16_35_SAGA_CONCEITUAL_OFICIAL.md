# 490 - M16.35 - Saga conceitual

## Apresentação da aula

Nas aulas anteriores, você construiu mecanismos técnicos importantes para sistemas distribuídos:

```text
Outbox Pattern:

não perder a intenção
de publicar um evento.

Inbox Pattern:

não perder a recepção
de uma mensagem.

Deduplicação:

não repetir o efeito
da mesma mensagem.

Poison message:

não bloquear o fluxo
com uma mensagem inválida.
```

Esses mecanismos melhoram a entrega e o processamento de mensagens.

Eles ainda não resolvem uma transação de negócio que atravessa vários serviços.

Considere a criação de um pedido.

O fluxo de negócio exige:

```text
1. criar pedido;

2. reservar estoque;

3. autorizar pagamento;

4. agendar entrega;

5. confirmar pedido.
```

Cada etapa pode estar em um serviço diferente:

```text
Order Service;

Inventory Service;

Payment Service;

Delivery Service.
```

Cada serviço possui:

- banco próprio;
- transação local própria;
- tempo de resposta próprio;
- falhas próprias;
- regras próprias;
- deploy independente.

Não existe uma única transação ACID envolvendo todos os bancos.

Se o estoque for reservado e o pagamento falhar, o sistema precisa decidir:

```text
o estoque continuará reservado?

será liberado?

o pedido ficará aguardando?

o pagamento será tentado novamente?

o fluxo será cancelado?
```

A pergunta central desta aula será:

```text
como coordenar uma transação
de negócio distribuída

sem usar uma transação técnica global
entre todos os serviços?
```

A resposta será:

```text
Saga.
```

Uma saga divide uma transação de negócio em uma sequência de transações locais.

Cada passo confirmado pode possuir uma ação compensatória.

Exemplo:

```text
reservar estoque
        |
        v
autorizar pagamento
        |
        v
agendar entrega
```

Se o agendamento falhar permanentemente:

```text
cancelar autorização de pagamento;

liberar estoque;

cancelar pedido.
```

Importante:

```text
compensação
não é rollback técnico.
```

Uma transação de banco já confirmada não volta no tempo.

A compensação é uma nova operação de negócio.

Exemplo:

```text
reserveStock:

transação concluída.

releaseStock:

nova transação.
```

Entre as duas operações, o estado reservado existiu e pode ter sido observado.

A saga aceita consistência eventual.

Ela registra progresso até alcançar:

```text
conclusão;

compensação concluída;

falha operacional
que exige intervenção.
```

A aula será conceitual e documental.

Nenhuma saga distribuída será executada com múltiplos microsserviços.

Nenhum engine de workflow será instalado.

Nenhum broker novo será configurado.

O objetivo é modelar corretamente:

- participantes;
- passos;
- comandos;
- eventos;
- compensações;
- estados;
- timeouts;
- retries;
- idempotência;
- falhas parciais;
- observabilidade;
- ownership;
- escolha entre orquestração e coreografia.

O cenário principal será:

```text
Order Fulfillment Saga.
```

Fluxo de sucesso:

```text
pedido criado;

estoque reservado;

pagamento autorizado;

entrega agendada;

pedido confirmado.
```

Fluxo de compensação:

```text
entrega falhou permanentemente;

pagamento cancelado ou estornado;

estoque liberado;

pedido cancelado.
```

A aula utilizará os padrões anteriores como base:

```text
Outbox:

publicar comandos e eventos
sem perder intenção.

Inbox:

persistir mensagens recebidas.

Deduplicação:

repetir comandos com segurança.

Poison handling:

isolar mensagens inválidas.
```

A próxima aula será:

```text
491 - M16.36 - CDC conceitual
```

Ela mostrará como alterações confirmadas no banco podem ser capturadas a partir do log transacional.

Nesta aula, CDC não será implementado.

Ao final, você deverá explicar:

```text
o que é uma saga;

por que ela não é uma transação ACID global;

o que é transação local;

o que é compensação;

por que compensação pode falhar;

como modelar estados;

como tratar timeout;

como diferenciar retry
de compensação;

como comparar orquestração
e coreografia;

como Outbox e Inbox
sustentam uma saga confiável;

por que saga não significa
exactly-once.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
488:
Outbox Pattern.

489:
Inbox Pattern.

490:
Saga conceitual.

491:
CDC conceitual.

492:
Reprocessamento seguro.
```

A aula 489 respondeu:

```text
como persistir uma mensagem recebida
e processá-la depois
com lifecycle e recovery?
```

A aula 490 responderá:

```text
como coordenar
várias transações locais
como uma única intenção de negócio?
```

Nesta aula:

```text
Saga:
sim.

transações locais:
sim.

compensações:
sim.

orquestração:
sim.

coreografia:
sim.

máquina de estados:
sim.

timeout:
sim.

retry:
sim.

falha de compensação:
sim.

observabilidade:
sim.

Outbox e Inbox:
relacionados.

engine de workflow:
não.

implementação distribuída:
não.

CDC:
não.

reprocessamento automático:
não.
```

A regra central será:

```text
uma saga coordena
consistência de negócio;

ela não cria
atomicidade técnica global.
```

---

## Objetivo prático

Ao final, o repositório terá:

```text
docs/architecture/saga
├── SAGA_CONCEPTS.md
├── ORDER_FULFILLMENT_SAGA.md
├── SAGA_STATE_MACHINE.md
├── SAGA_FAILURE_MATRIX.md
├── SAGA_OBSERVABILITY.md
├── SAGA_VALIDATION_CHECKLIST.md
└── ADR-002-saga-orchestration-vs-choreography.md
```

Também será criado:

```text
contracts/saga/order-fulfillment
├── commands
│   ├── reserve-inventory.v1.json
│   ├── authorize-payment.v1.json
│   ├── schedule-delivery.v1.json
│   ├── release-inventory.v1.json
│   ├── cancel-payment-authorization.v1.json
│   └── cancel-delivery.v1.json
└── events
    ├── inventory-reserved.v1.json
    ├── inventory-reservation-failed.v1.json
    ├── payment-authorized.v1.json
    ├── payment-authorization-failed.v1.json
    ├── delivery-scheduled.v1.json
    └── delivery-scheduling-failed.v1.json
```

Você irá:

1. definir a intenção da saga;
2. definir o aggregate principal;
3. listar participantes;
4. definir transações locais;
5. definir comandos;
6. definir eventos de resposta;
7. definir compensações;
8. definir estados;
9. desenhar o fluxo de sucesso;
10. desenhar o fluxo de falha;
11. modelar retries;
12. modelar timeouts;
13. modelar compensação falha;
14. definir idempotency keys;
15. definir correlation e causation IDs;
16. comparar orquestração e coreografia;
17. criar uma matriz de decisão;
18. escrever um ADR;
19. definir métricas e alertas;
20. criar checklist operacional;
21. registrar limitações;
22. commitar;
23. preparar CDC conceitual.

---

## Conceito essencial

### O que é Saga

Saga é uma sequência de transações locais que, juntas, realizam uma intenção de negócio distribuída.

Cada transação local:

- atualiza o banco do participante;
- preserva suas invariantes;
- produz um resultado;
- pode provocar o próximo passo.

A saga termina em:

```text
COMPLETED;

COMPENSATED;

MANUAL_INTERVENTION.
```

Os nomes exatos podem variar.

O importante é que o lifecycle seja explícito.

---

### Transação local

Uma transação local pertence a um único boundary.

Exemplo:

```text
Inventory Service:

BEGIN;

criar reservation;

reduzir available quantity;

insert outbox;

COMMIT.
```

Ela não inclui o banco do Payment Service.

A mensagem resultante será entregue depois.

---

### Compensação

Compensação desfaz ou neutraliza o efeito de uma transação local sob a ótica do negócio.

Exemplo:

```text
ação:
AuthorizePayment.

compensação:
CancelPaymentAuthorization.
```

Outro exemplo:

```text
ação:
CapturePayment.

compensação:
RefundPayment.
```

Cancelar uma autorização não é igual a estornar um pagamento capturado.

A compensação depende do estado real.

---

### Compensação não é rollback

Rollback técnico:

```text
a transação ainda não confirmou.
```

Compensação:

```text
a transação confirmou
e uma nova transação
corrige o negócio.
```

Consequências:

- pode falhar;
- pode ser assíncrona;
- pode exigir retry;
- pode ter custo;
- pode não restaurar exatamente o estado anterior;
- pode exigir intervenção humana.

---

### Compensação semântica

Algumas ações não podem ser literalmente desfeitas.

Exemplo:

```text
e-mail enviado.
```

Não existe rollback do recebimento do e-mail.

A compensação pode ser:

```text
enviar correção;

registrar ocorrência;

oferecer crédito;

notificar operador.
```

Por isso, nem toda etapa deve acontecer cedo na saga.

A ordem dos passos reduz compensações irreversíveis.

---

### Pivot transaction

Em uma saga, pode existir um passo após o qual a conclusão deve continuar até o fim.

Esse passo é chamado de:

```text
pivot transaction.
```

Antes do pivot:

```text
a saga pode compensar.
```

Depois do pivot:

```text
a saga tende a usar retry
até concluir os passos restantes.
```

Exemplo possível:

```text
pagamento capturado
pode ser pivot,
dependendo do negócio.
```

Essa decisão precisa ser explícita.

---

### Compensable, pivot e retriable

Classificação útil:

```text
compensable:

possui compensação viável.

pivot:

ponto de compromisso.

retriable:

depois do pivot,
deve eventualmente concluir.
```

No laboratório:

```text
ReserveInventory:
compensable.

AuthorizePayment:
compensable.

ConfirmOrder:
pivot conceitual.

NotifyCustomer:
retriable.
```

O agendamento de entrega pode ser compensável dependendo do contrato com o parceiro.

---

### Saga instance

Cada execução precisa de um identificador:

```text
sagaId.
```

A saga também referencia:

```text
orderId.
```

Não use apenas `orderId` como sagaId.

Um mesmo pedido pode possuir:

- nova tentativa;
- reabertura;
- saga de cancelamento;
- saga de devolução.

---

### Correlation ID

`correlationId` conecta todas as mensagens do fluxo.

Na baseline:

```text
correlationId = sagaId.
```

Isso facilita logs e tracing.

---

### Causation ID

`causationId` identifica qual mensagem causou a mensagem atual.

Exemplo:

```text
ReserveInventory command
causou
InventoryReserved event.
```

O evento aponta para o `messageId` do comando.

A cadeia ajuda a reconstruir o fluxo.

---

### Message ID

Cada comando e evento possui:

```text
messageId.
```

Esse ID é utilizado por:

- inbox;
- deduplicação;
- auditoria;
- retry;
- tracing.

Retry da mesma mensagem deve preservar o `messageId`.

Uma nova decisão de negócio gera uma nova mensagem.

---

### Estado da saga

A saga precisa persistir:

- sagaId;
- business key;
- type;
- status;
- current step;
- version;
- timestamps;
- deadline;
- failure code;
- last message;
- compensation progress;
- retry count.

Uma saga apenas em memória é perdida no restart.

Nesta aula, a persistência será modelada, não implementada.

---

### Máquina de estados

A baseline utilizará:

```text
STARTED;

WAITING_INVENTORY;

WAITING_PAYMENT;

WAITING_DELIVERY;

COMPLETED;

COMPENSATING_DELIVERY;

COMPENSATING_PAYMENT;

COMPENSATING_INVENTORY;

COMPENSATED;

FAILED_MANUAL.
```

A máquina impede transições inválidas.

Exemplo:

```text
InventoryReserved
não pode mover diretamente
de WAITING_DELIVERY
para WAITING_PAYMENT.
```

Mensagens atrasadas ou duplicadas devem ser reconhecidas.

---

### Orquestração

Na orquestração, um componente central decide o próximo passo.

```text
Saga Orchestrator
    |
    +--> ReserveInventory
    |
    +--> AuthorizePayment
    |
    +--> ScheduleDelivery
```

Participantes respondem com eventos.

O orquestrador mantém o estado da saga.

Vantagens:

- fluxo explícito;
- visualização central;
- timeouts centralizados;
- compensações coordenadas;
- operação mais direta;
- mudança de ordem mais controlada.

Custos:

- componente adicional;
- risco de concentração de lógica;
- disponibilidade crítica;
- acoplamento do workflow;
- necessidade de persistência.

---

### Coreografia

Na coreografia, cada serviço reage a eventos.

```text
OrderCreated
    |
    v
Inventory Service
    |
    v
InventoryReserved
    |
    v
Payment Service
    |
    v
PaymentAuthorized
    |
    v
Delivery Service.
```

Não existe um coordenador único.

Vantagens:

- autonomia;
- baixo acoplamento direto;
- fluxo distribuído;
- expansão por novos consumidores.

Custos:

- fluxo difícil de visualizar;
- ciclos acidentais;
- dependências escondidas;
- timeouts mais difíceis;
- compensações espalhadas;
- debugging complexo.

---

### Orquestração não é comando síncrono

Um orquestrador pode enviar comandos assíncronos por broker.

Ele não precisa chamar todos os serviços por HTTP.

Fluxo:

```text
persist saga state + outbox;

publish command;

participant inbox;

local transaction;

participant outbox;

publish result event;

orchestrator inbox;

advance state.
```

Outbox e Inbox aparecem em todos os boundaries.

---

### Coreografia não significa ausência de estado

Mesmo sem orquestrador, cada participante precisa manter seu estado local.

Também pode existir uma visão operacional para rastrear a jornada.

A ausência de um coordenador não elimina complexidade.

Ela distribui a complexidade.

---

### Retry versus compensação

Retry:

```text
a operação ainda é desejada;

a falha pode ser transitória.
```

Compensação:

```text
a operação não deve mais continuar;

efeitos anteriores precisam
ser neutralizados.
```

Exemplo:

```text
Payment Service timeout:

primeiro:
consultar status e retry.

não:
compensar estoque imediatamente
sem saber se o pagamento foi autorizado.
```

Falhas ambíguas exigem reconciliação.

---

### Timeout

Timeout de saga é uma decisão de negócio.

Exemplo:

```text
reserva de estoque válida
por quinze minutos.
```

Quando o prazo termina:

- confirmar estado atual;
- impedir resposta tardia indevida;
- iniciar compensação;
- registrar timeout;
- notificar operação quando necessário.

Timeout não é apenas timeout de socket.

---

### Resposta tardia

Cenário:

```text
orquestrador considera pagamento expirado;

inicia liberação de estoque;

PaymentAuthorized chega depois.
```

A saga precisa consultar seu estado.

Se já está compensando:

- não avança para entrega;
- pode iniciar cancelamento da autorização;
- registra resposta tardia;
- mantém idempotência.

---

### Compensação falhando

Exemplo:

```text
ReleaseInventory falha.
```

A saga não pode afirmar:

```text
COMPENSATED.
```

Ela permanece em:

```text
COMPENSATING_INVENTORY
```

com retries e alertas.

Após limite operacional:

```text
FAILED_MANUAL.
```

Compensações precisam da mesma qualidade dos passos de avanço.

---

### Ordenação de compensações

Em geral, compensações acontecem na ordem inversa dos passos confirmados.

Sucesso parcial:

```text
InventoryReserved;

PaymentAuthorized;

DeliveryFailed.
```

Compensação:

```text
CancelPaymentAuthorization;

ReleaseInventory.
```

Não execute compensação de passo que não foi confirmado.

---

### Idempotência

Todos os comandos da saga precisam ser idempotentes.

Exemplo:

```text
ReserveInventoryCommand
com reservationId estável.
```

Se entregue duas vezes:

```text
a mesma reserva
não reduz estoque duas vezes.
```

Compensações também:

```text
ReleaseInventoryCommand
entregue duas vezes
não libera quantidade duplicada.
```

---

### Concurrency

Duas mensagens podem chegar quase ao mesmo tempo.

A saga state precisa de:

- optimistic locking;
- versão;
- transições condicionais;
- inbox;
- deduplicação.

Exemplo:

```text
PaymentAuthorized;

PaymentTimeout.
```

A transação que vence precisa deixar o estado consistente.

A outra reavalia o estado.

---

## Mão na massa guiada

### 1. Criar o diretório

Na raiz:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/architecture/saga" |
  Out-Null

New-Item `
  -ItemType Directory `
  -Force `
  "contracts/saga/order-fulfillment/commands" |
  Out-Null

New-Item `
  -ItemType Directory `
  -Force `
  "contracts/saga/order-fulfillment/events" |
  Out-Null
```

---

### 2. Criar o documento de conceitos

Arquivo:

```text
docs/architecture/saga/SAGA_CONCEPTS.md
```

Estrutura:

```markdown
# Saga — conceitos

## Problema

## Transações locais

## Compensações

## Pivot

## Retriable steps

## Orquestração

## Coreografia

## Idempotência

## Timeouts

## Observabilidade

## Limitações
```

---

### 3. Definir a intenção de negócio

Arquivo:

```text
docs/architecture/saga/ORDER_FULFILLMENT_SAGA.md
```

Comece:

```markdown
# Order Fulfillment Saga

## Intenção

Confirmar um pedido somente quando:

- estoque estiver reservado;
- pagamento estiver autorizado;
- entrega estiver agendada.

## Resultado de sucesso

Order status = CONFIRMED.

## Resultado compensado

Order status = CANCELLED.
```

---

### 4. Definir participantes

Adicione:

```markdown
## Participantes

| Participante | Responsabilidade | Banco próprio |
|---|---|---:|
| Order Service | Estado do pedido e saga | Sim |
| Inventory Service | Reserva e liberação | Sim |
| Payment Service | Autorização e cancelamento | Sim |
| Delivery Service | Agendamento e cancelamento | Sim |
```

---

### 5. Definir passos

```markdown
## Passos de avanço

1. ReserveInventory.
2. AuthorizePayment.
3. ScheduleDelivery.
4. ConfirmOrder.
```

Cada passo precisa de:

- command;
- success event;
- failure event;
- timeout;
- retry policy;
- idempotency key;
- compensation.

---

### 6. Definir compensações

```markdown
## Compensações

| Passo confirmado | Compensação |
|---|---|
| Inventory reserved | ReleaseInventory |
| Payment authorized | CancelPaymentAuthorization |
| Delivery scheduled | CancelDelivery |
| Order confirmed | Política específica, fora desta saga |
```

Registre que `ConfirmOrder` será o pivot conceitual desta modelagem.

---

### 7. Criar o comando de reserva

Arquivo:

```text
contracts/saga/order-fulfillment/commands/reserve-inventory.v1.json
```

```json
{
  "messageId": "0fbc2d70-5814-4771-a2ef-df4a93277a01",
  "messageType": "inventory.reserve.v1",
  "messageVersion": 1,
  "sagaId": "70ad8d4d-b8bd-4e3c-9e33-6cb799f9e09c",
  "correlationId": "70ad8d4d-b8bd-4e3c-9e33-6cb799f9e09c",
  "causationId": "6a7cf3ba-3d51-4343-9374-b5d0d14c26ea",
  "occurredAt": "2026-07-12T19:10:00Z",
  "orderId": "ORD-490-0001",
  "reservationId": "RES-490-0001",
  "items": [
    {
      "productId": "PROD-1",
      "quantity": 2
    }
  ]
}
```

A key Kafka conceitual será:

```text
orderId.
```

A idempotency key do Inventory Service será:

```text
reservationId.
```

---

### 8. Criar o evento de sucesso

Arquivo:

```text
events/inventory-reserved.v1.json
```

```json
{
  "messageId": "28435ad1-7f0d-4c54-bf4c-c86a1ff2f7dc",
  "messageType": "inventory.reserved.v1",
  "messageVersion": 1,
  "sagaId": "70ad8d4d-b8bd-4e3c-9e33-6cb799f9e09c",
  "correlationId": "70ad8d4d-b8bd-4e3c-9e33-6cb799f9e09c",
  "causationId": "0fbc2d70-5814-4771-a2ef-df4a93277a01",
  "occurredAt": "2026-07-12T19:10:01Z",
  "orderId": "ORD-490-0001",
  "reservationId": "RES-490-0001",
  "expiresAt": "2026-07-12T19:25:00Z"
}
```

---

### 9. Criar o evento de falha

Arquivo:

```text
events/inventory-reservation-failed.v1.json
```

Campos:

```text
messageId;

messageType;

sagaId;

correlationId;

causationId;

orderId;

reservationId;

failureCode;

retryable;

occurredAt.
```

Não coloque stacktrace.

---

### 10. Criar os demais contratos

Crie os comandos:

```text
authorize-payment.v1.json;

schedule-delivery.v1.json;

release-inventory.v1.json;

cancel-payment-authorization.v1.json;

cancel-delivery.v1.json.
```

Crie os eventos:

```text
payment-authorized.v1.json;

payment-authorization-failed.v1.json;

delivery-scheduled.v1.json;

delivery-scheduling-failed.v1.json.
```

Todos precisam preservar:

```text
sagaId;

correlationId;

causationId;

messageId;

business IDs.
```

---

### 11. Criar a máquina de estados

Arquivo:

```text
docs/architecture/saga/SAGA_STATE_MACHINE.md
```

Adicione:

```text
STARTED
   |
   | ReserveInventory
   v
WAITING_INVENTORY
   |
   | InventoryReserved
   v
WAITING_PAYMENT
   |
   | PaymentAuthorized
   v
WAITING_DELIVERY
   |
   | DeliveryScheduled
   v
COMPLETED
```

Fluxo de compensação:

```text
WAITING_DELIVERY
   |
   | DeliverySchedulingFailed permanent
   v
COMPENSATING_PAYMENT
   |
   | PaymentAuthorizationCancelled
   v
COMPENSATING_INVENTORY
   |
   | InventoryReleased
   v
COMPENSATED
```

---

### 12. Criar tabela de transições

```markdown
| Estado atual | Mensagem | Próximo estado | Ação |
|---|---|---|---|
| STARTED | SagaStarted | WAITING_INVENTORY | Enviar ReserveInventory |
| WAITING_INVENTORY | InventoryReserved | WAITING_PAYMENT | Enviar AuthorizePayment |
| WAITING_INVENTORY | InventoryReservationFailed permanent | COMPENSATED | Cancelar pedido |
| WAITING_PAYMENT | PaymentAuthorized | WAITING_DELIVERY | Enviar ScheduleDelivery |
| WAITING_PAYMENT | PaymentAuthorizationFailed permanent | COMPENSATING_INVENTORY | Enviar ReleaseInventory |
| WAITING_DELIVERY | DeliveryScheduled | COMPLETED | Confirmar pedido |
| WAITING_DELIVERY | DeliverySchedulingFailed permanent | COMPENSATING_PAYMENT | Cancelar autorização |
```

Inclua mensagens tardias e duplicadas.

---

### 13. Definir resposta duplicada

Exemplo:

```text
estado:
WAITING_DELIVERY.

mensagem:
InventoryReserved duplicada.
```

Decisão:

```text
ignorar como duplicata;

não enviar outro AuthorizePayment;

registrar métrica;

manter estado.
```

A inbox impede processamento repetido do mesmo `messageId`.

A state machine protege contra mensagens semanticamente repetidas com outro ID.

---

### 14. Definir timeout de estoque

No documento:

```text
reservation expiresAt:
definido pelo Inventory Service.

orchestrator deadline:
menor que o expiresAt
com margem operacional.
```

Quando o deadline expirar:

1. consultar ou reconciliar o estado;
2. não assumir falha apenas por silêncio;
3. iniciar compensação quando confirmado;
4. rejeitar avanço tardio incompatível.

---

### 15. Definir timeout de pagamento

Diferencie:

```text
HTTP timeout;

payment status unknown;

payment declined.
```

`timeout` não significa `declined`.

O orquestrador pode precisar enviar:

```text
QueryPaymentAuthorizationStatus.
```

Não compense antes de resolver um estado ambíguo quando houver risco financeiro.

---

### 16. Criar a matriz de falhas

Arquivo:

```text
docs/architecture/saga/SAGA_FAILURE_MATRIX.md
```

Tabela:

```markdown
| Passo | Falha | Retry? | Compensação? | Estado final possível |
|---|---|---:|---:|---|
| Reserve inventory | Timeout transitório | Sim | Não imediatamente | WAITING_INVENTORY |
| Reserve inventory | Sem estoque | Não | Nenhuma anterior | COMPENSATED |
| Authorize payment | Gateway 503 | Sim | Não imediatamente | WAITING_PAYMENT |
| Authorize payment | Recusado | Não | Release inventory | COMPENSATED |
| Schedule delivery | Serviço indisponível | Sim | Depende do prazo | WAITING_DELIVERY |
| Schedule delivery | Região não atendida | Não | Cancel payment + release inventory | COMPENSATED |
| Cancel payment | Timeout | Sim | Continua compensando | FAILED_MANUAL possível |
| Release inventory | Timeout | Sim | Continua compensando | FAILED_MANUAL possível |
```

---

### 17. Modelar compensação falha

Exemplo:

```text
CancelPaymentAuthorization:
falhou cinco vezes.

ReleaseInventory:
ainda não foi enviado.
```

Decisão:

```text
não pular automaticamente
para a próxima compensação
se a ordem for obrigatória;

manter COMPENSATING_PAYMENT;

alertar;

permitir intervenção;

registrar cada tentativa.
```

A ordem pode variar conforme as invariantes.

---

### 18. Criar ADR

Arquivo:

```text
docs/architecture/saga/ADR-002-saga-orchestration-vs-choreography.md
```

Estrutura:

```markdown
# ADR-002 — Saga de atendimento do pedido

## Status

Proposto.

## Contexto

Quatro serviços participam.

## Opções

### Orquestração

### Coreografia

## Decisão

Orquestração.

## Motivos

- compensações complexas;
- timeouts;
- necessidade de visão central;
- ordem explícita;
- auditoria;
- operação.

## Consequências positivas

## Consequências negativas

## Mitigações

## Plano de validação
```

---

### 19. Justificar orquestração

Para o cenário desta aula:

```text
múltiplas compensações;

pagamento;

prazo de estoque;

entrega;

falhas ambíguas;

intervenção operacional.
```

A orquestração é escolhida.

Isso não significa que coreografia seja sempre incorreta.

---

### 20. Criar diagrama orquestrado

```text
Order API
   |
   v
Order Service
   |
   | state + outbox
   v
Saga Orchestrator
   |
   +--> ReserveInventory
   |       |
   |       v
   |   Inventory Service
   |       |
   |       v
   |   InventoryReserved
   |
   +--> AuthorizePayment
   |       |
   |       v
   |   Payment Service
   |
   +--> ScheduleDelivery
           |
           v
       Delivery Service
```

Cada seta assíncrona usa:

```text
outbox;

broker;

inbox;

deduplicação.
```

---

### 21. Criar modelo de persistência conceitual

No documento:

```sql
saga_instance
-------------
saga_id
saga_type
business_key
status
current_step
version
deadline_at
failure_code
last_message_id
created_at
updated_at
completed_at
```

Tabela de histórico:

```sql
saga_transition
---------------
id
saga_id
from_status
to_status
message_id
message_type
occurred_at
metadata
```

Não execute migrations nesta aula.

---

### 22. Definir optimistic locking

A coluna:

```text
version.
```

Protege atualizações concorrentes.

Fluxo:

```text
transaction A lê version 4;

transaction B lê version 4;

A atualiza para 5;

B tenta atualizar version 4;

B falha;

B relê o estado
e reavalia a mensagem.
```

Não faça retry cego sem reavaliar a transição.

---

### 23. Definir política de retry

Para cada comando, registre:

- maximum attempts;
- backoff;
- timeout;
- retryable failure codes;
- non-retryable failure codes;
- status query;
- compensação;
- owner.

Não use a mesma policy para todos os participantes.

---

### 24. Definir observabilidade

Arquivo:

```text
docs/architecture/saga/SAGA_OBSERVABILITY.md
```

Métricas:

```text
sagas started;

completed;

compensated;

failed manual;

duration;

current state count;

step latency;

retry count;

timeout count;

late responses;

duplicate messages;

compensation failures;

oldest active saga.
```

Logs estruturados:

```text
sagaId;

orderId;

messageId;

causationId;

state;

step;

participant;

attempt;

outcome.
```

Tracing:

```text
correlationId;

traceparent;

span por passo.
```

---

### 25. Definir alertas

Alertas mínimos:

- saga ativa acima do SLA;
- crescimento em `FAILED_MANUAL`;
- compensação falhando;
- timeout elevado;
- participante sem resposta;
- backlog de outbox;
- backlog de inbox;
- poison messages;
- duplicates inesperadas;
- divergência de reconciliação.

---

### 26. Criar checklist

Arquivo:

```text
docs/architecture/saga/SAGA_VALIDATION_CHECKLIST.md
```

Inclua:

```markdown
## Modelagem

- [ ] Intenção definida.
- [ ] Participantes definidos.
- [ ] Passos definidos.
- [ ] Compensações definidas.
- [ ] Pivot definido.
- [ ] Estados definidos.

## Mensagens

- [ ] messageId.
- [ ] sagaId.
- [ ] correlationId.
- [ ] causationId.
- [ ] versionamento.
- [ ] idempotency key.

## Falhas

- [ ] Retry transitório.
- [ ] Falha permanente.
- [ ] Timeout.
- [ ] Resposta tardia.
- [ ] Compensação falha.
- [ ] Intervenção manual.

## Operação

- [ ] Métricas.
- [ ] Alertas.
- [ ] Runbook.
- [ ] Reconciliação.
- [ ] Ownership.
- [ ] Auditoria.
```

---

### 27. Criar casos de teste conceituais

Cenários obrigatórios:

```text
happy path;

estoque indisponível;

pagamento recusado;

gateway indisponível;

entrega não atendida;

resposta tardia;

comando duplicado;

evento duplicado;

orquestrador reinicia;

compensação de pagamento falha;

liberação de estoque falha;

duas respostas concorrentes;

timeout e sucesso simultâneos;

intervenção manual.
```

---

### 28. Criar runbook resumido

Para `FAILED_MANUAL`:

1. localizar saga;
2. verificar passos confirmados;
3. verificar mensagens;
4. consultar estado real nos participantes;
5. impedir comando duplicado indevido;
6. executar compensação idempotente;
7. registrar operador e justificativa;
8. reconciliar estado final;
9. encerrar ou reabrir;
10. preservar auditoria.

---

### 29. Não implementar engine

Não adicione:

- Temporal;
- Camunda;
- Zeebe;
- Conductor;
- AWS Step Functions;
- state machine framework;
- tabela real de saga;
- consumers reais;
- commands reais.

A escolha de engine depende de requisitos futuros.

A aula é conceitual.

---

### 30. Validar os artefatos

```powershell
Get-ChildItem `
  "docs/architecture/saga" `
  -Recurse
```

```powershell
Get-ChildItem `
  "contracts/saga/order-fulfillment" `
  -Recurse
```

Execute:

```powershell
git diff --check
```

Procure conceitos obrigatórios:

```powershell
git grep `
  -n `
  -E `
  "sagaId|correlationId|causationId|compensation|timeout|FAILED_MANUAL|Outbox|Inbox"
```

---

## Entendendo o que foi feito

### A transação distribuída virou workflow

A intenção foi dividida em transações locais.

### Compensações ficaram explícitas

Cada passo confirmado possui resposta de negócio.

### A ordem ganhou importância

A saga sabe quais efeitos realmente ocorreram.

### O estado ficou persistente

Restart não deveria apagar o progresso.

### Retry e compensação foram separados

Falha transitória não provoca cancelamento prematuro.

### Timeouts ganharam semântica de negócio

Silêncio não foi confundido com recusa.

### Respostas tardias foram previstas

A máquina de estados decide como reagir.

### Falha de compensação ficou visível

O fluxo pode exigir intervenção.

### Orquestração foi escolhida com justificativa

A complexidade do cenário pede visão central.

### Outbox e Inbox sustentaram a confiabilidade

Todos os boundaries continuam at-least-once e idempotentes.

---

## Erros comuns importantes

### Chamar saga de transação distribuída ACID

Ela oferece consistência eventual de negócio.

### Tratar compensação como rollback

É uma nova operação.

### Não definir compensação

Falha intermediária deixa estado preso.

### Compensar passo não confirmado

O sistema pode criar novo erro.

### Usar retry infinito

Falha permanente nunca conclui.

### Compensar em qualquer timeout

O resultado pode estar ambíguo.

### Ignorar resposta tardia

A saga pode avançar depois de iniciar compensação.

### Não persistir o estado

Restart perde o workflow.

### Não usar idempotência

Comandos duplicados repetem efeitos.

### Escolher coreografia por parecer desacoplada

O workflow pode ficar invisível.

### Colocar toda lógica no orquestrador

Participantes ainda precisam proteger suas invariantes.

### Declarar COMPLETED antes dos passos confirmados

O estado externo fica incorreto.

---

## Comandos úteis

### Criar diretórios

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/architecture/saga" |
  Out-Null
```

### Listar documentos

```powershell
Get-ChildItem `
  "docs/architecture/saga" `
  -Recurse
```

### Revisar contratos

```powershell
Get-ChildItem `
  "contracts/saga/order-fulfillment" `
  -Recurse
```

### Procurar IDs

```powershell
git grep `
  -n `
  -E `
  "messageId|sagaId|correlationId|causationId"
```

### Validar Markdown

```powershell
git diff --check
```

---

## Exercício guiado

### Parte 1 — Intenção

Defina o resultado da saga.

### Parte 2 — Participantes

Liste boundaries e owners.

### Parte 3 — Passos

Defina transações locais.

### Parte 4 — Compensações

Mapeie ordem inversa.

### Parte 5 — Mensagens

Crie commands e events.

### Parte 6 — Estados

Crie máquina de estados.

### Parte 7 — Falhas

Crie matriz de retry e compensação.

### Parte 8 — Decisão

Compare orquestração e coreografia.

### Parte 9 — Operação

Defina métricas e runbook.

### Parte 10 — Validação

Cubra respostas tardias e concorrência.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 489 foi preservada;
- Saga foi definida;
- transação local foi definida;
- consistência eventual foi explicada;
- compensação foi definida;
- compensação foi diferenciada de rollback;
- compensação semântica foi explicada;
- pivot transaction foi explicada;
- passos compensáveis foram definidos;
- passos retriable foram definidos;
- sagaId foi definido;
- orderId foi mantido como business key;
- correlationId foi definido;
- causationId foi definido;
- messageId foi definido;
- retry preserva messageId;
- estado da saga foi modelado;
- máquina de estados foi criada;
- transições inválidas foram consideradas;
- optimistic locking foi explicado;
- orquestração foi explicada;
- coreografia foi explicada;
- vantagens de orquestração foram registradas;
- riscos de orquestração foram registrados;
- vantagens de coreografia foram registradas;
- riscos de coreografia foram registrados;
- ADR foi criado;
- orquestração foi escolhida para o cenário;
- participantes foram definidos;
- passos de avanço foram definidos;
- compensações foram definidas;
- ordem inversa foi considerada;
- comando de reserva foi modelado;
- eventos de sucesso e falha foram modelados;
- contratos preservam IDs;
- stacktrace não foi colocado em evento;
- idempotency key foi definida;
- timeout de negócio foi definido;
- timeout de socket foi diferenciado;
- estado ambíguo foi considerado;
- resposta tardia foi considerada;
- retry foi diferenciado de compensação;
- falha de compensação foi considerada;
- estado FAILED_MANUAL foi criado;
- intervenção manual foi documentada;
- matriz de falhas foi criada;
- política de retry por participante foi criada;
- Outbox foi relacionado;
- Inbox foi relacionado;
- deduplicação foi relacionada;
- poison handling foi relacionado;
- métricas foram definidas;
- alertas foram definidos;
- logs estruturados foram definidos;
- tracing foi definido;
- runbook foi criado;
- casos conceituais foram criados;
- engine não foi instalado;
- implementação distribuída não foi antecipada;
- CDC não foi antecipado;
- reprocessamento seguro não foi antecipado;
- commit recomendado está pronto;
- ponte para aula 491 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure conceitos essenciais:

```powershell
git grep `
  -n `
  -E `
  "Saga|compensation|sagaId|correlationId|causationId|FAILED_MANUAL|orchestration|choreography"
```

Adicione:

```powershell
git add `
  docs/architecture/saga `
  contracts/saga/order-fulfillment `
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
git commit -m "docs(m16): modelar Saga conceitual"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credenciais;
- dados reais de pagamento;
- IDs corporativos;
- stacktraces;
- engine de workflow;
- implementação parcial de saga;
- CDC antecipado;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a transação de negócio distribuída foi transformada em uma saga explícita.

O modelo ficou:

```text
saga instance;

transações locais;

commands;

events;

state machine;

timeouts;

retries;

compensations;

manual intervention.
```

Você comprovou que:

- uma saga não cria ACID global;
- cada participante confirma sua transação local;
- compensação é uma nova operação;
- compensação também pode falhar;
- passos confirmados precisam ser registrados;
- mensagens precisam de messageId, sagaId, correlationId e causationId;
- timeouts precisam de semântica de negócio;
- respostas tardias precisam consultar o estado;
- retry e compensação resolvem problemas diferentes;
- orquestração oferece fluxo central explícito;
- coreografia distribui o fluxo entre eventos;
- Outbox e Inbox sustentam a entrega confiável;
- deduplicação protege comandos repetidos;
- operação exige métricas, alertas e runbook.

A próxima aula será:

```text
491 - M16.36 - CDC conceitual
```

Nela, você irá:

- compreender Change Data Capture;
- diferenciar polling e leitura do transaction log;
- compreender log-based CDC;
- compreender snapshots;
- compreender offsets do conector;
- modelar Debezium conceitualmente;
- relacionar CDC e Outbox;
- analisar ordering;
- analisar schema changes;
- analisar deletes e tombstones;
- analisar falhas e recuperação;
- preparar reprocessamento seguro.

Nenhum conector CDC foi instalado ou configurado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini a saga.
- [ ] Listei participantes e passos.
- [ ] Modelei compensações.
- [ ] Criei máquina de estados.
- [ ] Diferenciei retry e compensação.
- [ ] Comparei orquestração e coreografia.
- [ ] Criei ADR, métricas e runbook.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O fluxo parece uma sequência HTTP

Modele transações locais, mensagens, estados e retomada.

### Não existe compensação

Revise o impacto de cada passo confirmado.

### Toda falha compensa imediatamente

Separe falha transitória, permanente e ambígua.

### A saga conclui fora de ordem

Use máquina de estados e versionamento.

### Mensagens duplicadas avançam duas vezes

Use Inbox, deduplicação e transição condicional.

### Resposta tardia reabre a saga

Consulte o estado atual antes de aplicar.

### Compensação falha e desaparece

Crie estado próprio, retry e alerta.

### O orquestrador conhece detalhes internos

Comandos devem expressar intenção, não manipular tabelas remotas.

### A coreografia ficou impossível de desenhar

O fluxo pode estar distribuído demais e precisar de orquestração.

### O ADR não possui consequências negativas

Toda escolha arquitetural possui trade-offs.

---

## Perguntas de revisão

1. O que é uma saga?
2. Ela é uma transação ACID global?
3. O que é transação local?
4. O que é compensação?
5. Compensação é rollback?
6. O que é pivot?
7. O que é passo retriable?
8. O que identifica uma saga?
9. Para que serve correlationId?
10. Para que serve causationId?
11. Por que persistir estado?
12. O que é orquestração?
13. O que é coreografia?
14. Quando usar retry?
15. Quando compensar?
16. O que fazer com timeout ambíguo?
17. Compensação pode falhar?
18. Outbox e Inbox ajudam?
19. CDC foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sequência de transações locais.
2. Não.
3. Transação dentro de um boundary.
4. Nova operação que neutraliza efeito.
5. Não.
6. Ponto de compromisso.
7. Passo que deve eventualmente concluir.
8. sagaId.
9. Conectar o fluxo inteiro.
10. Indicar a mensagem causadora.
11. Recuperar após restart.
12. Coordenador central.
13. Reações distribuídas a eventos.
14. Falha transitória.
15. Quando o fluxo não deve continuar.
16. Consultar ou reconciliar estado.
17. Sim.
18. Sim.
19. Não.
20. CDC conceitual.

---

## Desafio opcional

Modele uma saga de:

```text
cancelamento de pedido.
```

Participantes:

- Order Service;
- Payment Service;
- Inventory Service;
- Delivery Service.

Requisitos:

- pedido já confirmado;
- cancelamento da entrega;
- estorno de pagamento;
- devolução de estoque;
- passo irreversível;
- compensação de compensação não permitida;
- timeouts;
- respostas tardias;
- estado manual;
- ADR entre orquestração e coreografia;
- nenhum código distribuído.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 490 - M16.35 - Saga conceitual

- Continuei após Outbox e Inbox Pattern.
- Entendi Saga como sequência de transações locais.
- Diferenciei Saga de transação ACID global.
- Entendi consistência eventual de negócio.
- Diferenciei compensação de rollback.
- Entendi compensação semântica.
- Classifiquei passos compensáveis, pivot e retriable.
- Modelei a Order Fulfillment Saga.
- Defini Order, Inventory, Payment e Delivery como participantes.
- Defini ReserveInventory.
- Defini AuthorizePayment.
- Defini ScheduleDelivery.
- Defini ConfirmOrder.
- Modelei ReleaseInventory.
- Modelei CancelPaymentAuthorization.
- Modelei CancelDelivery.
- Criei contratos conceituais de comandos e eventos.
- Adicionei messageId.
- Adicionei sagaId.
- Adicionei correlationId.
- Adicionei causationId.
- Defini idempotency keys.
- Criei máquina de estados.
- Modelei fluxo de sucesso.
- Modelei fluxo de compensação.
- Modelei mensagens duplicadas.
- Modelei respostas tardias.
- Diferenciei timeout de negócio e timeout técnico.
- Diferenciei retry e compensação.
- Modelei falha de compensação.
- Criei estado FAILED_MANUAL.
- Comparei orquestração e coreografia.
- Escolhi orquestração para o cenário.
- Criei ADR.
- Criei matriz de falhas.
- Criei métricas e alertas.
- Criei runbook de intervenção.
- Relacionei Outbox, Inbox, deduplicação e poison handling.
- Não instalei engine de workflow.
- Não antecipei CDC.
- Próxima aula: CDC conceitual.
```

---

## Referência técnica curta

- Saga Pattern.
- Microservices Patterns — Sagas.
- Enterprise Integration Patterns — Process Manager.
- Enterprise Integration Patterns — Compensating Transaction.
- Azure Architecture Center — Saga Pattern.
- AWS Prescriptive Guidance — Saga orchestration.
- Google Cloud Architecture — Saga pattern.
- Temporal — Saga compensation concept.
- Transactional Outbox Pattern.
- Idempotent Receiver Pattern.

Regra final:

```text
Saga coordena uma intenção de negócio distribuída como uma sequência persistente de transações locais; cada participante preserva suas próprias invariantes e responde por comandos e eventos; compensação não é rollback técnico, mas uma nova operação idempotente que neutraliza um efeito confirmado e também pode falhar; sagaId identifica a instância, correlationId conecta o fluxo, causationId registra a cadeia e messageId sustenta Inbox e deduplicação; a máquina de estados impede transições inválidas, timeouts exigem reconciliação e respostas tardias precisam respeitar o estado atual; retry trata falhas transitórias, compensação trata abandono do fluxo e FAILED_MANUAL preserva falhas não resolvidas; orquestração centraliza estado e decisões, coreografia distribui reações, e Outbox e Inbox tornam ambos os modelos at-least-once e recuperáveis sem criar atomicidade global ou exactly-once.
```
