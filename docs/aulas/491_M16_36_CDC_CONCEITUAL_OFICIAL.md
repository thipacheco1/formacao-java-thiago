# 491 - M16.36 - CDC conceitual

## Apresentação da aula

Na aula 488, você implementou o Outbox Pattern com polling publisher.

O fluxo ficou:

```text
transação local;

estado de negócio;

registro outbox;

commit;

job periódico;

publicação no Kafka;

marcação PUBLISHED.
```

Na aula 490, você modelou uma saga conceitual sustentada por:

```text
Outbox;

Inbox;

deduplicação;

mensageria;

transações locais.
```

Agora surge outra forma de propagar alterações confirmadas no banco:

```text
Change Data Capture;

CDC.
```

Considere uma tabela:

```text
outbox_event.
```

O polling publisher consulta periodicamente:

```sql
SELECT ...
FROM outbox_event
WHERE status IN ('PENDING', 'FAILED')
  AND next_attempt_at <= now();
```

Essa abordagem funciona, mas exige consultas recorrentes, índices, claims, stale recovery, atualização de status, cleanup e capacidade adicional no banco.

Outra possibilidade é observar as alterações que o banco já registra internamente em seu transaction log.

No PostgreSQL, esse log é o:

```text
WAL;

Write-Ahead Log.
```

Em outros bancos, aparecem nomes como:

```text
binlog;

redo log;

transaction log;

oplog.
```

A pergunta central desta aula será:

```text
como capturar alterações confirmadas
diretamente do log transacional

e transformá-las em eventos
para outros sistemas?
```

A resposta será construída com:

```text
log-based CDC;

connector;

snapshot;

streaming;

source offset;

replication slot;

publication;

change event;

ordering;

schema history;

delete;

tombstone;

recovery;

observabilidade.
```

A aula utilizará Debezium, Kafka Connect e PostgreSQL como referências conceituais.

Nenhum componente, replication slot, connector ou topic do Kafka Connect será criado, e o PostgreSQL não será alterado.

O objetivo é compreender o modelo antes de operar a infraestrutura.

O fluxo conceitual será:

```text
aplicação;

transação PostgreSQL;

COMMIT;

WAL;

logical decoding;

replication slot;

Debezium connector;

Kafka Connect;

Kafka topic;

consumers.
```

Para uma tabela `orders`, um evento de alteração pode representar:

```text
before;

after;

source;

operation;

transaction metadata;

database timestamp;

connector timestamp.
```

Exemplo conceitual:

```json
{
  "before": null,
  "after": {
    "order_id": "ORD-491-0001",
    "status": "CREATED"
  },
  "source": {
    "database": "orders_db",
    "schema": "public",
    "table": "orders",
    "lsn": 27839416
  },
  "op": "c",
  "ts_ms": 1783885200000
}
```

Esse evento não é automaticamente um evento de domínio.

Ele representa:

```text
uma mudança de linha.
```

O banco sabe que:

```text
status mudou
de PENDING para CONFIRMED.
```

Ele não necessariamente sabe que o fato de negócio é:

```text
OrderConfirmed.
```

Por isso, CDC e eventos de domínio não são equivalentes.

CDC pode ser utilizado para:

- replicação;
- integração legada;
- atualização de cache;
- sincronização com data lake;
- indexação;
- auditoria técnica;
- modernização;
- publicação de uma outbox;
- construção de projeções.

Mas expor tabelas diretamente como contratos externos pode criar:

- acoplamento ao schema;
- eventos CRUD;
- vazamento de dados;
- quebra em migrations;
- excesso de volume;
- consumidores dependentes de detalhes internos.

Uma relação segura com Outbox é capturar a linha que já contém o contrato de integração deliberado, em vez de inferir significado a partir de tabelas internas.

A aula também esclarecerá um risco operacional importante no PostgreSQL:

```text
replication slot
pode reter WAL
enquanto o consumidor
não confirma o progresso.
```

Se o connector ficar parado e o slot continuar ativo, o banco pode acumular WAL.

Isso pode consumir disco.

Portanto, CDC não é:

```text
instalar e esquecer.
```

Ele exige operação conjunta entre aplicação, banco e plataforma.

Próxima aula:

```text
492 - M16.37 - Reprocessamento seguro
```

Ela tratará replay, offsets, reconstrução, dry run, idempotência e controle operacional.

Nesta aula, nenhum offset será resetado e nenhum evento será reprocessado.

Ao final, você deverá explicar:

```text
o que é CDC;

por que log-based CDC
difere de polling;

o que snapshot representa;

como snapshot e streaming
precisam formar uma visão consistente;

o que é source offset;

o que é replication slot;

por que slot parado
pode pressionar disco;

o que significam before, after e op;

por que delete pode gerar tombstone;

por que schema history é necessária;

por que ordering não é global;

por que CDC não é evento de domínio;

como CDC e Outbox
podem trabalhar juntos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
489:
Inbox Pattern.

490:
Saga conceitual.

491:
CDC conceitual.

492:
Reprocessamento seguro.
```

A aula 490 respondeu:

```text
como coordenar
transações locais distribuídas
com compensações?
```

A aula 491 responderá:

```text
como transformar alterações
confirmadas no banco
em um fluxo de eventos?
```

Nesta aula:

```text
CDC:
sim.

polling:
comparado.

transaction log:
sim.

WAL:
sim.

logical decoding:
sim.

replication slot:
sim.

Debezium:
conceitual.

Kafka Connect:
conceitual.

snapshot:
sim.

streaming:
sim.

source offsets:
sim.

schema history:
sim.

deletes:
sim.

tombstones:
sim.

ordering:
sim.

observabilidade:
sim.

instalação:
não.

connector real:
não.

slot real:
não.

offset reset:
não.

reprocessamento:
não.
```

A regra central será:

```text
CDC observa fatos técnicos
confirmados no banco;

a arquitetura decide
como transformá-los
em contratos úteis e seguros.
```

---

## Objetivo prático

Ao final, o repositório terá:

```text
docs/architecture/cdc
├── CDC_CONCEPTS.md
├── POLLING_VS_LOG_BASED_CDC.md
├── POSTGRESQL_CDC_MODEL.md
├── CDC_SNAPSHOT_PLAN.md
├── CDC_OFFSET_AND_RECOVERY.md
├── CDC_SCHEMA_CHANGE_POLICY.md
├── CDC_FAILURE_MATRIX.md
├── CDC_OBSERVABILITY.md
├── CDC_SECURITY_CHECKLIST.md
└── ADR-003-outbox-polling-vs-cdc.md
```

Também serão criados:

```text
contracts/cdc/orders
├── create-envelope.json
├── update-envelope.json
├── delete-envelope.json
├── tombstone-example.json
└── outbox-routed-event.json
```

Você irá:

1. definir CDC;
2. comparar polling e log-based CDC;
3. modelar o WAL;
4. explicar logical decoding;
5. explicar replication slot;
6. explicar publication;
7. modelar connector e task;
8. modelar snapshot inicial;
9. modelar streaming contínuo;
10. explicar source offset;
11. desenhar restart;
12. criar envelopes de create, update e delete;
13. explicar tombstone;
14. separar row change de domain event;
15. relacionar CDC e Outbox;
16. estudar ordering;
17. estudar transactions;
18. estudar schema changes;
19. criar matriz de falhas;
20. criar métricas e alertas;
21. criar checklist de segurança;
22. criar ADR;
23. documentar rollout;
24. commitar;
25. preparar reprocessamento seguro.

---

## Conceito essencial

### O que é CDC

Change Data Capture é uma técnica para detectar e propagar alterações de dados.

Operações típicas:

```text
INSERT;

UPDATE;

DELETE.
```

A captura pode ocorrer por:

- triggers;
- timestamp polling;
- query incremental;
- tabela de auditoria;
- log transacional;
- recurso nativo do banco.

Nesta aula, o foco será:

```text
log-based CDC.
```

---

### Polling

Polling consulta uma fonte repetidamente.

Exemplo:

```sql
SELECT *
FROM outbox_event
WHERE status = 'PENDING'
ORDER BY created_at
LIMIT 100;
```

Vantagens:

- fácil de compreender;
- implementável na aplicação;
- controle explícito;
- sem acesso ao transaction log;
- testes diretos.

Custos:

- queries recorrentes;
- índices;
- intervalos;
- claims;
- atualizações de status;
- latência do polling;
- potencial contenção.

---

### Log-based CDC

Log-based CDC lê as alterações registradas pelo banco para garantir recuperação.

O banco já escreve no log antes ou durante o commit conforme seu mecanismo.

O connector acompanha posições desse log e emite change events.

Vantagens:

- baixa interferência no modelo de consulta;
- captura contínua;
- ordem ligada ao log;
- acesso a todas as mudanças capturadas;
- menor necessidade de polling de tabela;
- integração com snapshots e offsets.

Custos:

- privilégios especiais;
- operação do connector;
- retenção do log;
- schema history;
- complexidade de recovery;
- dependência da plataforma;
- risco de vazamento de dados;
- contratos técnicos.

---

### WAL

No PostgreSQL, WAL significa:

```text
Write-Ahead Log.
```

O banco registra alterações no WAL para durabilidade e recuperação.

CDC não deve consultar arquivos WAL diretamente por código de aplicação.

O PostgreSQL oferece logical decoding e protocolo de replicação para clientes apropriados.

---

### Logical decoding

Logical decoding transforma informações do WAL em uma representação lógica de mudanças.

Em vez de expor somente blocos físicos, o banco permite observar:

- transaction begin;
- row insert;
- row update;
- row delete;
- transaction commit;
- relation metadata.

Um output plugin define o formato lógico utilizado.

Para PostgreSQL moderno, `pgoutput` é uma referência importante no ecossistema de logical replication.

---

### Replication slot

Replication slot mantém a posição de consumo de um fluxo de replicação.

Ele permite que o connector continue de onde parou.

Conceitualmente:

```text
slot:
de onde o cliente
ainda precisa ler?
```

O banco não pode remover WAL necessário ao slot sem considerar a política configurada.

Se o connector fica parado, WAL pode acumular.

Métricas de slot são obrigatórias.

---

### Publication

No PostgreSQL, publication define quais alterações de quais tabelas participam da logical replication.

Ela pode incluir:

- tabelas específicas;
- operações específicas;
- conjunto controlado.

Não capture todas as tabelas por conveniência.

Use allowlist explícita.

---

### Connector

O connector conhece:

- banco;
- credenciais;
- slot;
- publication;
- tabelas incluídas;
- topic prefix;
- snapshot mode;
- transforms;
- schema history;
- offset storage.

Ele converte alterações da origem em source records.

---

### Kafka Connect

Kafka Connect executa connectors por meio de workers e tasks, mantendo configuração, status e offsets operacionais.

O source connector acompanha uma posição na origem; o consumer final acompanha offsets nos topics Kafka. Esses progressos não são equivalentes.

---

### Source offset

Source offset identifica a posição do connector na origem.

No PostgreSQL, isso se relaciona ao:

```text
LSN;

Log Sequence Number.
```

O formato exato pertence ao connector.

A aplicação de negócio não deve interpretar source offset como ID de domínio.

---

### Posições diferentes

```text
WAL position
-> source offset
-> Kafka record offset
-> consumer committed offset.
```

Cada posição pertence a uma camada e não deve ser usada como ID de negócio.

---

### Snapshot

Quando o connector inicia pela primeira vez, existem dados anteriores à instalação.

O snapshot cria eventos representando o estado existente.

Depois, o connector continua com streaming de mudanças.

Objetivo:

```text
não perder alterações
entre a leitura inicial
e o início do streaming.
```

Um snapshot consistente precisa coordenar:

- ponto no log;
- leitura das tabelas;
- alterações concorrentes;
- posição de retomada.

Não implemente snapshot por:

```text
SELECT *;

depois iniciar CDC.
```

sem protocolo de consistência.

Mudanças podem ser perdidas ou duplicadas.

---

### Snapshot inicial

Fluxo conceitual:

```text
1. connector determina
   posição consistente;

2. captura schema;

3. lê linhas existentes;

4. emite eventos snapshot;

5. registra progresso;

6. passa para streaming.
```

Eventos de snapshot podem usar operação equivalente a:

```text
read;

op = r.
```

---

### Envelope de alteração

Um change event comum contém:

```text
before;

after;

source;

op;

timestamp.
```

#### Create

```text
before:
null.

after:
novo estado.

op:
c.
```

#### Update

```text
before:
estado anterior quando disponível.

after:
novo estado.

op:
u.
```

#### Delete

```text
before:
estado removido.

after:
null.

op:
d.
```

#### Snapshot read

```text
before:
null.

after:
estado atual.

op:
r.
```

---

### Source metadata

Metadata pode incluir banco, schema, tabela, LSN, indicação de snapshot, transação e timestamps.

Ela ajuda em auditoria e diagnóstico, mas não deve expor dados sensíveis nem virar regra de domínio.

---

### Tombstone

Em topics compactados, um tombstone é um record com:

```text
key:
presente.

value:
null.
```

Ele sinaliza que a key pode ser removida durante compaction.

Um fluxo de delete pode gerar:

```text
1. delete event com before;

2. tombstone com value null.
```

O comportamento depende da configuração e transformação.

Consumers precisam diferenciar:

- delete envelope;
- tombstone;
- null inesperado.

---

### Ordering

A origem possui ordem de commit no log, mas depois da publicação os records podem estar em topics e partitions diferentes.

Kafka preserva ordem por partition, não uma ordem global entre todas as tabelas. Requisitos de ordenação entre entidades precisam de key, versionamento e desenho explícito.

---

### Schema history

O connector precisa compreender o schema que existia quando cada alteração foi registrada.

Uma migration pode ocorrer entre:

```text
LSN A;

LSN B.
```

O connector mantém histórico suficiente para interpretar alterações antigas.

Topics internos de schema history não são para consumo de negócio.

Perder schema history pode impedir restart correto.

Backup, compactação e configuração desses topics exigem cuidado.

---

### CDC não é evento de domínio

Alteração técnica:

```text
orders.status:
PENDING -> CONFIRMED.
```

Evento de domínio:

```text
OrderConfirmed.
```

O segundo expressa intenção e significado de negócio.

CDC direto da tabela pode produzir:

- muitos updates irrelevantes;
- ordem dependente da persistência;
- campos internos;
- nomes técnicos;
- vazamento de colunas;
- acoplamento a migrations.

---

### CDC com Outbox

Fluxo recomendado:

```text
business transaction;

aggregate state;

outbox row com contrato deliberado;

COMMIT;

CDC captura outbox row;

Outbox Event Router;

topic final.
```

O CDC não precisa inferir significado a partir das tabelas do domínio.

A outbox contém:

- eventId;
- aggregate type;
- aggregate ID;
- event type;
- payload;
- occurredAt.

---

### Outbox Event Router

Uma transformação conceitual pode:

- ler a tabela outbox;
- usar aggregate ID como key;
- usar event type para roteamento;
- publicar payload;
- copiar headers permitidos;
- omitir envelope técnico;
- encaminhar ao topic final.

Não será configurada nesta aula.

---

## Mão na massa guiada

### 1. Criar diretórios

Na raiz:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/architecture/cdc" |
  Out-Null

New-Item `
  -ItemType Directory `
  -Force `
  "contracts/cdc/orders" |
  Out-Null
```

---

### 2. Criar CDC_CONCEPTS.md

Arquivo:

```text
docs/architecture/cdc/CDC_CONCEPTS.md
```

Estrutura:

```markdown
# Change Data Capture — conceitos

## Problema

## Polling

## Log-based CDC

## Transaction log

## Connector

## Snapshot

## Streaming

## Source offset

## Ordering

## Schema history

## Deletes

## Operação
```

---

### 3. Criar comparação polling versus CDC

Arquivo:

```text
docs/architecture/cdc/POLLING_VS_LOG_BASED_CDC.md
```

Tabela:

```markdown
| Critério | Polling publisher | Log-based CDC |
|---|---|---|
| Fonte | Tabela consultada | Transaction log |
| Latência | Intervalo do job | Próxima do streaming |
| Queries | Recorrentes | Menos polling de tabela |
| Claims | Aplicação implementa | Connector controla posição |
| Status PUBLISHED | Comum | Pode não ser necessário |
| Privilégios | SQL da aplicação | Replicação/logical decoding |
| Risco principal | Race e backlog | Slot e retenção de log |
| Operação | Job da aplicação | Connect + connector + banco |
| Schema | Modelo da tabela | History e envelopes |
| Recovery | Estado da tabela | Source offsets + log |
```

---

### 4. Criar ADR

Arquivo:

```text
docs/architecture/cdc/ADR-003-outbox-polling-vs-cdc.md
```

Contexto:

```text
publicar outbox_event
para Kafka.
```

Opções:

```text
polling publisher;

CDC + outbox router.
```

Decisão do laboratório:

```text
manter polling
na implementação atual;

adotar CDC somente
após maturidade operacional.
```

Motivos:

- laboratório já possui polling;
- nenhuma plataforma Connect instalada;
- nenhum owner de banco definido;
- CDC exige operação multidisciplinar;
- conceitos precisam ser validados antes da migração.

Registre que a decisão pode mudar.

---

### 5. Modelar PostgreSQL CDC

Arquivo:

```text
docs/architecture/cdc/POSTGRESQL_CDC_MODEL.md
```

Diagrama:

```text
Application
    |
    v
PostgreSQL transaction
    |
    v
COMMIT
    |
    v
WAL
    |
    v
logical decoding
    |
    v
replication slot
    |
    v
Debezium PostgreSQL connector
    |
    v
Kafka Connect source task
    |
    v
Kafka topics.
```

---

### 6. Modelar configurações conceituais

Documente sem criar connector real:

```json
{
  "name": "m16-orders-postgres-cdc",
  "connector.class": "PostgresConnector",
  "database.hostname": "orders-postgres",
  "database.port": "5432",
  "database.user": "${secret}",
  "database.password": "${secret}",
  "database.dbname": "orders",
  "topic.prefix": "m16.orders.cdc",
  "plugin.name": "pgoutput",
  "slot.name": "m16_orders_cdc",
  "publication.name": "m16_orders_publication",
  "table.include.list": "public.outbox_event",
  "snapshot.mode": "initial"
}
```

Registre:

```text
exemplo conceitual;

não enviar para Connect;

não contém valores produtivos;

nomes devem seguir governança.
```

---

### 7. Criar plano de snapshot

Arquivo:

```text
docs/architecture/cdc/CDC_SNAPSHOT_PLAN.md
```

Inclua:

- volume por tabela;
- duração estimada;
- impacto de leitura;
- locks possíveis;
- janela;
- ponto no log;
- snapshot mode;
- progresso;
- reinício;
- validação de contagem;
- alterações concorrentes;
- limite de throughput;
- owner;
- rollback;
- alerta.

---

### 8. Criar envelope de create

Arquivo:

```text
contracts/cdc/orders/create-envelope.json
```

```json
{
  "before": null,
  "after": {
    "order_id": "ORD-491-0001",
    "customer_id": "CUS-491-0001",
    "status": "CREATED",
    "total": 299.90
  },
  "source": {
    "database": "orders",
    "schema": "public",
    "table": "orders",
    "lsn": 27839416,
    "snapshot": "false"
  },
  "op": "c",
  "ts_ms": 1783885200000
}
```

Os valores são fictícios.

---

### 9. Criar envelope de update

Arquivo:

```text
contracts/cdc/orders/update-envelope.json
```

```json
{
  "before": {
    "order_id": "ORD-491-0001",
    "status": "CREATED"
  },
  "after": {
    "order_id": "ORD-491-0001",
    "status": "CONFIRMED"
  },
  "source": {
    "database": "orders",
    "schema": "public",
    "table": "orders",
    "lsn": 27839584
  },
  "op": "u",
  "ts_ms": 1783885210000
}
```

Registre que disponibilidade de `before` depende da origem e da configuração de replica identity.

---

### 10. Criar envelope de delete

Arquivo:

```text
contracts/cdc/orders/delete-envelope.json
```

```json
{
  "before": {
    "order_id": "ORD-491-0001",
    "status": "CANCELLED"
  },
  "after": null,
  "source": {
    "database": "orders",
    "schema": "public",
    "table": "orders",
    "lsn": 27839712
  },
  "op": "d",
  "ts_ms": 1783885220000
}
```

---

### 11. Criar tombstone

Arquivo:

```text
contracts/cdc/orders/tombstone-example.json
```

Como JSON não representa uma key/value Kafka completa, documente:

```json
{
  "key": {
    "order_id": "ORD-491-0001"
  },
  "value": null,
  "meaning": "Kafka compaction tombstone example"
}
```

Não confunda com delete envelope.

---

### 12. Criar outbox routed event

Arquivo:

```text
contracts/cdc/orders/outbox-routed-event.json
```

```json
{
  "eventId": "d8575a0a-3c5b-4b6c-b07c-9f26ef504301",
  "eventType": "orders.created.v1",
  "eventVersion": 1,
  "occurredAt": "2026-07-12T19:20:00Z",
  "orderId": "ORD-491-0002",
  "customerId": "CUS-491-0002",
  "total": 399.90
}
```

Esse é o contrato de integração.

Ele não expõe o envelope completo da linha outbox.

---

### 13. Criar plano de offsets

Arquivo:

```text
docs/architecture/cdc/CDC_OFFSET_AND_RECOVERY.md
```

Diferencie:

```text
PostgreSQL LSN;

connector source offset;

Kafka topic offset;

consumer group offset.
```

Registre o restart:

```text
1. connector lê offset persistido;

2. verifica se a posição
   ainda está disponível;

3. reconstrói schema necessário;

4. retoma o stream;

5. pode falhar se log
   ou history foram perdidos.
```

---

### 14. Modelar perda de offset

Cenário:

```text
connector offset apagado;

slot ainda existe;

topics possuem dados.
```

Não escolha automaticamente:

```text
novo snapshot.
```

Primeiro determine:

- posição real;
- duplicidade possível;
- retenção do WAL;
- dados já publicados;
- consumers;
- snapshot mode;
- objetivo de recovery.

A aula 492 tratará reprocessamento seguro.

---

### 15. Modelar slot atrasado

Cenário:

```text
connector parado por seis horas;

slot ativo;

WAL acumulando.
```

Ações:

1. medir lag do slot;
2. medir disco;
3. verificar connector;
4. evitar remover slot impulsivamente;
5. restaurar processamento;
6. definir limite e alerta;
7. avaliar perda de posição;
8. seguir runbook.

Remover slot pode permitir limpeza do WAL, mas também elimina a posição necessária ao connector.

---

### 16. Criar schema policy

Arquivo:

```text
docs/architecture/cdc/CDC_SCHEMA_CHANGE_POLICY.md
```

Inclua mudanças:

```text
add nullable column;

add required column with default;

rename column;

drop column;

change type;

change primary key;

change replica identity;

move table;

online migration.
```

Para cada uma, registre:

- impacto no connector;
- impacto no envelope;
- impacto no key schema;
- impacto nos consumers;
- rollout;
- rollback;
- compatibilidade.

---

### 18. Modelar ordering

Documente que o log da origem possui ordem, mas o Kafka preserva ordem apenas por partition. Tabelas e topics diferentes não oferecem uma sequência global simples.

---

### 20. Criar matriz de falhas

Arquivo:

```text
docs/architecture/cdc/CDC_FAILURE_MATRIX.md
```

Tabela:

```markdown
| Falha | Sintoma | Risco | Ação |
|---|---|---|---|
| Connector parado | Nenhum evento novo | WAL e backlog | Restaurar task |
| Slot lag alto | Disco cresce | Indisponibilidade do banco | Alertar e recuperar |
| Offset perdido | Connector não retoma | Duplicata ou gap | Runbook |
| Schema history indisponível | Restart falha | Stream interrompido | Restaurar history |
| Kafka indisponível | Source records acumulam | Backpressure | Recuperar cluster |
| Permissão revogada | Connector falha | Sem captura | Corrigir menor privilégio |
| Snapshot interrompido | Estado incompleto | Recomeço ou continuação | Validar mode |
| Migration incompatível | Eventos falham | Connector parado | Rollback/migração |
| Topic removido | Escrita falha | Perda operacional | Recriar por runbook |
| Disco PostgreSQL alto | Banco em risco | Incidente crítico | Tratar slot |
```

---

### 21. Criar observabilidade

Arquivo:

```text
docs/architecture/cdc/CDC_OBSERVABILITY.md
```

Métricas do connector:

- status;
- task state;
- event rate;
- last event age;
- source lag;
- snapshot progress;
- error count;
- retry count;
- queue capacity;
- batch size;
- offset commit failures.

Métricas PostgreSQL:

- slot active;
- restart LSN;
- confirmed flush LSN;
- WAL retained;
- disk free;
- replication connection;
- transaction rate.

Métricas Kafka Connect:

- worker health;
- rebalance;
- task count;
- config topic;
- offset topic;
- status topic;
- producer errors;
- request latency.

---

### 22. Criar alertas

Alertas mínimos:

- connector FAILED;
- task FAILED;
- nenhum evento com banco ativo;
- source lag acima do SLA;
- WAL retido acima do limite;
- disco abaixo do limite;
- snapshot parado;
- offset commit falhando;
- schema history indisponível;
- auth failure;
- topic publish error;
- delete/tombstone volume anormal.

---

### 23. Criar checklist de segurança

Arquivo:

```text
docs/architecture/cdc/CDC_SECURITY_CHECKLIST.md
```

Inclua:

```markdown
## Banco

- [ ] Usuário dedicado.
- [ ] Privilégio mínimo.
- [ ] Replication privilege controlada.
- [ ] Tabelas allowlisted.
- [ ] TLS.
- [ ] Secret externalizado.

## Kafka Connect

- [ ] API protegida.
- [ ] Plugins aprovados.
- [ ] Worker isolado.
- [ ] Config topic protegido.
- [ ] Offset topic protegido.
- [ ] Status topic protegido.

## Dados

- [ ] Colunas sensíveis excluídas.
- [ ] Masking definido.
- [ ] Retenção definida.
- [ ] Owners definidos.
- [ ] Auditoria de configuração.
```

---

### 24. Criar plano de rollout

Defina owner, dados permitidos, ambiente de teste, snapshot, validação de contagens, envelopes, deletes, migrations, restart, slot lag, ativação de consumers e monitoramento.

O polling só deve ser desligado depois de um cutover explícito, com deduplicação e reconciliação.

---

### 29. Não instalar componentes

Não execute:

- `CREATE_REPLICATION_SLOT`;
- `CREATE PUBLICATION`;
- alteração de `wal_level`;
- alteração de `max_replication_slots`;
- container Debezium;
- Kafka Connect;
- connector REST;
- snapshot;
- offset reset;
- remoção de slot.

A aula permanece conceitual.

---

### 30. Validar os artefatos

```powershell
Get-ChildItem `
  "docs/architecture/cdc" `
  -Recurse
```

```powershell
Get-ChildItem `
  "contracts/cdc/orders" `
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
  "WAL|logical decoding|replication slot|snapshot|source offset|tombstone|schema history|outbox"
```

---

## Entendendo o que foi feito

### CDC deixou de ser sinônimo de polling

Os dois modelos foram comparados explicitamente.

### O transaction log virou fonte

Alterações confirmadas podem ser observadas sem varrer a tabela continuamente.

### Snapshot e streaming ficaram conectados

A visão inicial precisa chegar a uma posição contínua do log.

### Source offset ganhou identidade própria

Ele não foi confundido com offset Kafka.

### Replication slot ganhou responsabilidade operacional

Um connector parado pode pressionar o disco do banco.

### Envelopes ficaram explícitos

Create, update, delete e read possuem semânticas distintas.

### Tombstone foi separado de delete

O valor nulo participa da compaction.

### Ordering ganhou limites claros

A ordem é local aos streams e partitions, não global entre todos os topics.

### CDC foi separado do domínio

Row change não virou automaticamente evento de negócio.

### Outbox e CDC se complementaram

CDC pode transportar contratos deliberados da tabela outbox.

---

## Erros comuns importantes

### Chamar qualquer polling de CDC log-based

Polling e log são arquiteturas diferentes.

### Capturar todas as tabelas

Volume, risco e acoplamento aumentam.

### Dar superuser ao connector

Use usuário dedicado e menor privilégio.

### Ignorar replication slot

WAL pode crescer até consumir disco.

### Remover slot para liberar espaço sem runbook

A posição do connector pode ser perdida.

### Confundir source offset e Kafka offset

Eles pertencem a camadas diferentes.

### Fazer snapshot com SELECT independente

Alterações concorrentes podem criar gaps.

### Tratar tombstone como erro

Ele pode ser necessário para compaction.

### Expor envelope de tabela como evento de domínio

Consumers ficam acoplados ao schema.

### Ignorar schema history

Restart pode interpretar alterações com schema errado.

### Prometer ordem global

Topics e partitions limitam a garantia.

### Migrar polling e CDC sem deduplicação

O mesmo evento pode ser publicado duas vezes.

---

## Comandos úteis

### Listar documentos

```powershell
Get-ChildItem `
  "docs/architecture/cdc" `
  -Recurse
```

### Listar exemplos

```powershell
Get-ChildItem `
  "contracts/cdc/orders" `
  -Recurse
```

### Revisar conceitos

```powershell
git grep `
  -n `
  -E `
  "snapshot|streaming|source offset|replication slot|tombstone"
```

### Validar alterações

```powershell
git diff --check
```

---

## Exercício guiado

### Parte 1 — Fonte

Diferencie polling e WAL.

### Parte 2 — PostgreSQL

Modele decoding, slot e publication.

### Parte 3 — Connector

Modele Kafka Connect e Debezium.

### Parte 4 — Snapshot

Crie plano inicial.

### Parte 5 — Streaming

Modele offsets e restart.

### Parte 6 — Envelopes

Crie create, update e delete.

### Parte 7 — Tombstone

Defina comportamento do consumer.

### Parte 8 — Schema

Crie policy de migrations.

### Parte 9 — Operação

Crie métricas e failure matrix.

### Parte 10 — Decisão

Crie ADR de polling versus CDC.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 490 foi preservada;
- CDC foi definido;
- polling foi definido;
- log-based CDC foi definido;
- polling e CDC foram comparados;
- transaction log foi explicado;
- WAL foi explicado;
- logical decoding foi explicado;
- output plugin foi contextualizado;
- replication slot foi explicado;
- risco de WAL retido foi explicado;
- publication foi explicada;
- allowlist foi recomendada;
- Debezium foi contextualizado;
- Kafka Connect foi contextualizado;
- connector foi diferenciado de task;
- source record foi contextualizado;
- source offset foi explicado;
- LSN foi contextualizado;
- source offset foi diferenciado de Kafka offset;
- Kafka offset foi diferenciado de consumer offset;
- snapshot foi explicado;
- snapshot inicial foi explicado;
- incremental snapshot foi contextualizado;
- snapshot e streaming foram conectados;
- gaps foram rejeitados;
- envelope before/after foi explicado;
- op create foi explicado;
- op update foi explicado;
- op delete foi explicado;
- op read foi explicado;
- source metadata foi explicada;
- create envelope foi criado;
- update envelope foi criado;
- delete envelope foi criado;
- tombstone foi explicado;
- tombstone foi diferenciado de delete;
- log compaction foi contextualizada;
- ordering foi explicado;
- ordem global não foi prometida;
- transações entre tabelas foram discutidas;
- transaction metadata foi contextualizada;
- schema history foi explicada;
- topic interno não foi usado por negócio;
- schema changes foram documentadas;
- primary key change foi tratada como crítica;
- CDC foi diferenciado de evento de domínio;
- row change não foi tratado como fato de negócio;
- Outbox e CDC foram relacionados;
- Outbox Event Router foi contextualizado;
- polling permaneceu como decisão atual;
- ADR foi criado;
- plano de snapshot foi criado;
- plano de offsets e recovery foi criado;
- matriz de falhas foi criada;
- observabilidade foi criada;
- segurança foi documentada;
- usuário dedicado foi recomendado;
- menor privilégio foi recomendado;
- dados sensíveis foram considerados;
- rollout foi criado;
- coexistência foi tratada;
- deduplicação foi relacionada;
- nenhum slot real foi criado;
- nenhuma publication real foi criada;
- Kafka Connect não foi instalado;
- Debezium não foi instalado;
- offsets não foram resetados;
- reprocessamento não foi antecipado;
- commit recomendado está pronto;
- ponte para aula 492 está correta.

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
  "CDC|WAL|replication slot|snapshot|source offset|tombstone|schema history|Outbox"
```

Adicione:

```powershell
git add `
  docs/architecture/cdc `
  contracts/cdc/orders `
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
git commit -m "docs(m16): modelar CDC conceitual"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credenciais;
- endpoint de banco real;
- connector produtivo;
- slot real;
- LSN real;
- payload corporativo;
- dados sensíveis;
- script de remoção de slot;
- instalação parcial;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a captura de mudanças deixou de ser apenas um job que consulta tabelas.

O modelo ficou:

```text
database transaction;

COMMIT;

transaction log;

logical decoding;

replication slot;

connector;

source offset;

Kafka topic;

consumer.
```

Você comprovou que:

- polling e log-based CDC possuem trade-offs diferentes;
- o WAL já registra alterações confirmadas;
- logical decoding transforma log físico em mudanças lógicas;
- replication slot preserva uma posição;
- slot atrasado pode reter WAL e pressionar disco;
- source offset não é Kafka offset;
- snapshot precisa se conectar ao streaming sem gaps;
- create, update, delete e read possuem envelopes distintos;
- tombstone não é o mesmo que delete envelope;
- schema history é necessária para restart;
- ordem global entre todos os topics não deve ser presumida;
- row change não é automaticamente evento de domínio;
- CDC pode capturar uma outbox deliberadamente modelada;
- operação exige métricas do banco, connector e Kafka Connect.

A próxima aula será:

```text
492 - M16.37 - Reprocessamento seguro
```

Nela, você irá:

- definir replay e reprocessamento;
- diferenciar retry, redelivery e replay;
- selecionar origem e intervalo;
- criar dry run;
- validar idempotência;
- controlar offsets;
- criar group dedicado;
- limitar throughput;
- observar backlog;
- interromper com segurança;
- reconciliar resultados;
- registrar auditoria;
- evitar efeitos externos duplicados.

Nenhum offset foi alterado nem evento foi reprocessado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei polling e CDC.
- [ ] Modelei WAL, decoding e slot.
- [ ] Modelei snapshot e streaming.
- [ ] Diferenciei os offsets.
- [ ] Criei envelopes de alteração.
- [ ] Modelei schema changes.
- [ ] Criei métricas e failure matrix.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Connector não produz eventos

Verifique task, slot, publication, allowlist, permissões e offset.

### Snapshot termina, mas streaming não inicia

Revise posição de origem, slot e configuração do connector.

### Banco perde espaço em disco

Verifique WAL retido e lag do replication slot.

### Restart falha após migration

Schema history pode estar incompleta ou incompatível.

### Delete não remove cache

O consumer pode estar ignorando delete envelope ou tombstone.

### Evento possui before vazio

Replica identity ou origem pode não fornecer todas as colunas anteriores.

### Consumers quebram após coluna nova

O contrato CDC está acoplado ao schema e precisa de policy de evolução.

### Ordem entre topics parece incorreta

Não existe garantia global entre partitions e topics.

### Polling e CDC publicam duplicado

Preserve eventId e aplique deduplicação durante o cutover.

### Slot foi removido

Não recrie impulsivamente. Determine posição, snapshot e impacto.

---

## Perguntas de revisão

1. O que é CDC?
2. O que é polling?
3. O que é log-based CDC?
4. O que é WAL?
5. O que é logical decoding?
6. O que é replication slot?
7. Qual risco de um slot atrasado?
8. O que é publication?
9. O que é source offset?
10. Ele é Kafka offset?
11. O que é snapshot?
12. Por que snapshot precisa de consistência?
13. O que significa op `c`?
14. O que significa op `u`?
15. O que significa op `d`?
16. O que é tombstone?
17. Para que serve schema history?
18. CDC é evento de domínio?
19. Debezium foi instalado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Captura e propagação de mudanças.
2. Consulta periódica.
3. Leitura do log transacional.
4. Write-Ahead Log.
5. Conversão para mudanças lógicas.
6. Posição persistente de replicação.
7. Retenção de WAL e disco.
8. Seleção lógica de tabelas/operações.
9. Posição na origem.
10. Não.
11. Carga inicial consistente.
12. Evitar gap e duplicidade indevida.
13. Create.
14. Update.
15. Delete.
16. Key com value null.
17. Interpretar schemas históricos.
18. Não automaticamente.
19. Não.
20. Reprocessamento seguro.

---

## Desafio opcional

Modele CDC para:

```text
customer_address.
```

Requisitos:

- topic mapping;
- primary key;
- snapshot plan;
- update envelope;
- delete envelope;
- tombstone;
- PII masking;
- replication slot risk;
- schema change policy;
- polling versus CDC ADR;
- nenhuma instalação;
- nenhum dado real.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 491 - M16.36 - CDC conceitual

- Continuei após Saga conceitual.
- Defini Change Data Capture.
- Diferenciei polling e log-based CDC.
- Comparei latência, queries, claims e operação.
- Entendi o transaction log como fonte.
- Entendi WAL no PostgreSQL.
- Entendi logical decoding.
- Contextualizei output plugins.
- Entendi replication slot.
- Relacionei slot com posição de leitura.
- Identifiquei risco de retenção de WAL.
- Entendi publication e allowlist.
- Contextualizei Debezium.
- Contextualizei Kafka Connect.
- Diferenciei connector, task e worker.
- Defini source offset.
- Contextualizei LSN.
- Diferenciei source offset, Kafka offset e consumer offset.
- Modelei snapshot inicial.
- Contextualizei incremental snapshot.
- Conectei snapshot e streaming.
- Evitei estratégia com gap.
- Criei envelopes de create, update e delete.
- Contextualizei operação snapshot read.
- Diferenciei delete e tombstone.
- Contextualizei log compaction.
- Analisei ordering por topic e partition.
- Não prometi ordem global.
- Analisei transações com várias tabelas.
- Contextualizei transaction metadata.
- Entendi schema history.
- Diferenciei history interna e schema events.
- Criei policy de schema changes.
- Tratei mudança de primary key como crítica.
- Diferenciei row change e evento de domínio.
- Relacionei CDC e Outbox.
- Contextualizei Outbox Event Router.
- Criei ADR de polling versus CDC.
- Mantive polling como decisão atual do laboratório.
- Criei snapshot plan.
- Criei offset e recovery plan.
- Criei failure matrix.
- Criei métricas e alertas.
- Criei checklist de segurança.
- Não instalei Debezium ou Kafka Connect.
- Não criei replication slot real.
- Não antecipei reprocessamento.
- Próxima aula: Reprocessamento seguro.
```

---

## Referência técnica curta

- Debezium — Architecture.
- Debezium — PostgreSQL Connector.
- Debezium — Snapshots.
- Debezium — Outbox Event Router.
- Debezium — Event Flattening.
- Apache Kafka — Kafka Connect.
- Apache Kafka — Connect Source Offsets.
- PostgreSQL — Logical Decoding.
- PostgreSQL — Replication Slots.
- PostgreSQL — Logical Replication Architecture.

Regra final:

```text
CDC captura alterações confirmadas e pode usar o transaction log em vez de consultar tabelas continuamente; no PostgreSQL, logical decoding transforma WAL em mudanças lógicas e replication slots preservam a posição necessária ao connector, mas um slot atrasado pode reter WAL e pressionar o disco; um connector como Debezium executado no Kafka Connect realiza snapshot inicial, continua em streaming e persiste source offsets, que não são iguais aos offsets dos topics nem aos committed offsets dos consumers; envelopes before/after/op representam create, update, delete e snapshot read, enquanto tombstones são values nulos usados em fluxos compactados; schema history permite interpretar mudanças no ponto correto do log; CDC expõe alterações de linhas, não fatos de domínio, por isso uma combinação forte é gravar eventos deliberados em uma outbox e usar CDC para roteá-los; toda adoção exige allowlist, segurança, métricas, runbook, controle de slot, plano de snapshot e preparação para o reprocessamento seguro da próxima aula.
```
