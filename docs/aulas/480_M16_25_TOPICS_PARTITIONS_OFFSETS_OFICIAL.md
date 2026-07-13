# 480 - M16.25 - Topics partitions offsets

## Apresentação da aula

Na aula 479, você iniciou o Apache Kafka 4.3.1 em um ambiente local KRaft, criou o primeiro topic e comprovou o modelo fundamental:

```text
producer;

topic;

record;

log retido;

consumer;

replay.
```

O topic utilizado possuía:

```text
partitions:
1.

replication factor:
1.
```

Essa configuração foi adequada para o primeiro contato porque existia apenas um log, uma sequência de offsets e nenhuma distribuição entre consumers.

Agora surgem perguntas que não podem ser respondidas com uma única partition:

```text
como o Kafka distribui records?

como preservar a ordem de um mesmo pedido?

como vários consumers dividem trabalho?

por que um consumer pode ficar sem partition?

como o grupo sabe de onde continuar?

o que significa consumer lag?

como repetir uma leitura
sem criar outro topic?
```

A resposta exige aprofundar três elementos:

```text
topics;

partitions;

offsets.
```

E conectar esses elementos ao conceito de:

```text
consumer group.
```

O laboratório criará um novo topic:

```text
m16.orders.partitioned.v1
```

com:

```text
3 partitions;

replication factor 1.
```

A escolha de três partitions permitirá observar:

- records distribuídos;
- keys iguais permanecendo na mesma partition;
- ordem garantida somente dentro da partition;
- até três consumers ativos no mesmo grupo;
- um quarto consumer sem assignment;
- offsets independentes por partition;
- lag calculado por partition;
- grupos independentes lendo o mesmo topic;
- reset de offsets para replay.

O fluxo ficará:

```text
producer
   |
   | key + value
   v
topic
   |
   +--> partition 0
   |
   +--> partition 1
   |
   +--> partition 2
```

Para um consumer group:

```text
group m16-order-projection-v1
   |
   +--> consumer A -> partition 0
   |
   +--> consumer B -> partition 1
   |
   +--> consumer C -> partition 2
```

Outro grupo poderá ler os mesmos records:

```text
group m16-order-audit-v1
   |
   +--> suas próprias posições
        nas mesmas partitions
```

A regra central será:

```text
dentro de um grupo,
cada partition é atribuída
a no máximo um consumer por vez;

grupos diferentes
possuem offsets independentes.
```

A aula também esclarecerá uma confusão comum:

```text
offset do record
não é o mesmo que
offset confirmado pelo grupo.
```

O record recebe uma posição dentro da partition.

O consumer group mantém uma posição confirmada para saber qual record deverá ser lido na retomada.

Exemplo:

```text
partition 0 possui records:
offsets 0, 1, 2 e 3.

CURRENT-OFFSET do grupo:
4.
```

Isso normalmente significa:

```text
os offsets 0 a 3
já foram confirmados;

o próximo record esperado
é o offset 4.
```

A aula utilizará somente as ferramentas CLI oficiais do Kafka.

A integração Java continuará reservada para:

```text
481 - M16.26 - Consumers producers Kafka
```

Não serão implementados:

- `KafkaTemplate`;
- `@KafkaListener`;
- serializers Java;
- deserializers Java;
- manual commit em código;
- transactions;
- exactly-once;
- retry topics;
- dead-letter topic;
- Kafka Connect;
- Kafka Streams;
- Schema Registry;
- compactação por key;
- cluster com múltiplos brokers.

Ao final, você deverá explicar:

```text
por que topic é dividido em partitions;

por que ordem é local à partition;

como key influencia distribuição;

por que partition count limita
o paralelismo de um grupo;

o que é consumer group;

o que é rebalance;

o que é committed offset;

o que é log-end-offset;

como calcular lag;

quando auto.offset.reset é usado;

por que reset exige grupo inativo;

por que replay pode repetir efeitos.
```

---

## Onde estamos na formação

A sequência oficial do M16 é:

```text
479:
Kafka fundamentos.

480:
Topics partitions offsets.

481:
Consumers producers Kafka.

482:
RabbitMQ vs Kafka.

483:
Eventos de domínio.
```

A aula 479 respondeu:

```text
como produzir, consumir
e reler records retidos?
```

A aula 480 responderá:

```text
como Kafka distribui records
e como consumers coordenam
a posição de leitura?
```

Nesta aula:

```text
topic com múltiplas partitions:
sim.

key:
sim.

distribuição:
sim.

ordem por partition:
sim.

consumer group:
sim.

group coordinator:
conceitual.

assignment:
sim.

rebalance:
sim.

offset do record:
sim.

committed offset:
sim.

log-end-offset:
sim.

lag:
sim.

auto.offset.reset:
sim.

reset de offsets:
sim.

replay por grupo:
sim.

Spring Kafka:
não.

commit manual Java:
não.

transactions:
não.
```

A regra central será:

```text
partition define
unidade de ordem e paralelismo;

offset define posição
dentro da partition;

consumer group define
quem lê cada partition
e onde o grupo continuará.
```

---

## Objetivo prático

O laboratório continua em:

```text
labs/m16/aula-479-kafka-fundamentos
```

Ao final, a estrutura terá:

```text
commands
├── 07-create-partitioned-topic.ps1
├── 08-produce-keyed-orders.ps1
├── 09-consume-with-metadata.ps1
├── 10-describe-consumer-group.ps1
├── 11-preview-offset-reset.ps1
└── 12-execute-offset-reset.ps1
```

Recursos:

```text
topic:
m16.orders.partitioned.v1.

partitions:
3.

replication factor:
1.

projection group:
m16-order-projection-v1.

audit group:
m16-order-audit-v1.
```

Você irá:

1. revisar topic e partition;
2. criar um topic com três partitions;
3. descrever leaders e replicas;
4. produzir records sem key;
5. produzir records com keys repetidas;
6. exibir partition e offset;
7. comprovar ordem por partition;
8. iniciar um consumer group;
9. observar committed offsets;
10. produzir backlog;
11. calcular lag;
12. retomar do committed offset;
13. iniciar três consumers concorrentes;
14. observar assignments;
15. iniciar um quarto consumer;
16. observar member sem partition;
17. iniciar outro grupo;
18. comprovar leitura independente;
19. interromper consumers;
20. visualizar reset para earliest;
21. executar reset;
22. repetir o consumo;
23. diferenciar reset de `auto.offset.reset`;
24. registrar riscos de replay;
25. executar o fluxo completo;
26. commitar;
27. preparar Spring Kafka.

---

## Conceito essencial

### Topic como conjunto de partitions

Topic é uma categoria lógica.

Fisicamente, seus records são distribuídos entre partitions.

```text
m16.orders.partitioned.v1
├── partition 0
├── partition 1
└── partition 2
```

Cada partition é um log append-only com offsets próprios.

O topic não possui uma única sequência global de offsets.

Existem sequências independentes:

```text
partition 0:
0, 1, 2, 3...

partition 1:
0, 1, 2...

partition 2:
0, 1, 2, 3, 4...
```

---

### Por que particionar

Partitions permitem:

- distribuir armazenamento;
- distribuir escrita;
- distribuir leitura;
- aumentar paralelismo;
- organizar records relacionados;
- replicar logs entre brokers.

No laboratório há apenas um broker, portanto todas as partitions permanecem no mesmo processo. Ainda assim, consumers podem dividir partitions.

Em produção, partitions podem possuir leaders distribuídos entre brokers.

---

### Ordem

Kafka preserva a ordem dos records dentro de uma partition.

Não existe garantia automática de ordem global entre partitions.

Exemplo:

```text
partition 0:
A1, A2, A3.

partition 1:
B1, B2, B3.
```

Um consumer pode observar:

```text
A1, B1, B2, A2...
```

conforme fetch, assignment e processamento.

Se todos os eventos de um pedido precisam de ordem relativa, eles devem utilizar uma estratégia de key consistente para permanecer na mesma partition.

---

### Key e partition

Quando existe key, o producer normalmente utiliza a key serializada para selecionar uma partition de forma determinística.

Consequência desejada:

```text
key ORD-1001
    -> mesma partition
       enquanto a topologia e a estratégia
       permanecerem compatíveis.
```

A key não garante distribuição equilibrada.

Se grande parte do volume utiliza uma única key, uma partition pode ficar muito mais carregada que as outras.

Isso é chamado de:

```text
hot partition.
```

Sem key, o producer pode distribuir records entre partitions conforme sua estratégia e batching.

Não dependa de uma alternância exata e simples.

---

### Aumentar partitions

Kafka permite aumentar o número de partitions de um topic.

Entretanto:

- partitions antigas não redistribuem records existentes;
- o mapeamento de keys pode mudar;
- ordem futura de uma key pode passar para outra partition;
- consumers precisam descobrir as novas partitions;
- capacidade e governança mudam.

Por isso, partition count deve ser planejado.

Não é uma configuração que se reduz depois.

Nesta aula, um novo topic será criado com três partitions em vez de alterar o topic da aula 479.

---

### Consumer group

Consumer group é um conjunto de consumers que coopera para processar um topic.

Cada grupo possui um `group.id`.

Exemplo:

```text
m16-order-projection-v1.
```

Dentro de um grupo:

```text
uma partition
é atribuída a no máximo
um consumer ativo por vez.
```

Um consumer pode receber várias partitions.

---

### Paralelismo máximo

Com:

```text
3 partitions;
```

um grupo pode ter no máximo:

```text
3 consumers com trabalho simultâneo
para esse topic.
```

Com quatro consumers:

```text
3 recebem partitions;

1 fica sem assignment.
```

Adicionar consumers além das partitions não aumenta o paralelismo desse topic.

---

### Grupos independentes

Dois grupos mantêm posições independentes.

```text
projection group:
constrói uma projeção.

audit group:
registra auditoria.
```

Os dois leem os mesmos records sem criar cópias físicas por consumer group.

Cada grupo possui seus committed offsets.

---

### Group coordinator

Kafka escolhe um broker para coordenar cada consumer group.

O coordinator participa de:

- descoberta do grupo;
- associação de members;
- rebalances;
- commits;
- recuperação de offsets.

Nesta aula existe um único broker, portanto o mesmo processo executa todas as funções.

---

### Rebalance

Rebalance ocorre quando o conjunto de members ou partitions muda e as assignments precisam ser recalculadas.

Exemplos:

- consumer entra;
- consumer sai;
- consumer falha;
- subscription muda;
- partitions são adicionadas.

Durante rebalance, o processamento pode pausar temporariamente.

A aula 481 mostrará como a aplicação Spring observa esse lifecycle.

---

### Offset do record

Offset é a posição de um record dentro de uma partition.

Ele é atribuído pelo broker.

Propriedades:

- crescente;
- local à partition;
- não é ID de negócio;
- não é timestamp;
- não é global;
- pode possuir lacunas observáveis em alguns cenários internos;
- não deve ser usado como chave externa universal.

---

### Consumer position e committed offset

A posição atual representa de onde o consumer continuará lendo durante a sessão.

O committed offset é a posição armazenada para retomada do grupo.

Exemplo:

```text
consumer processou record offset 8;

commit armazenado:
9.
```

O valor confirmado normalmente representa o próximo offset esperado.

Se o processo falhar antes de confirmar, records já processados podem ser entregues novamente.

Isso participa da semântica at-least-once comum.

---

### Armazenamento dos offsets

Kafka registra offsets dos consumer groups no topic interno compactado:

```text
__consumer_offsets.
```

O group coordinator gerencia commits e consultas.

Não leia ou altere esse topic manualmente como rotina operacional.

Use as ferramentas administrativas.

---

### Log end offset

`LOG-END-OFFSET` representa a posição ao final do log da partition.

Se existem records nos offsets:

```text
0, 1, 2, 3
```

o log end offset é:

```text
4.
```

Ele representa a próxima posição que seria atribuída.

---

### Lag

Para uma partition, a visão básica é:

```text
LAG =
LOG-END-OFFSET
-
CURRENT-OFFSET.
```

Exemplo:

```text
CURRENT-OFFSET:
7.

LOG-END-OFFSET:
10.

LAG:
3.
```

Existem três records ainda não confirmados pelo grupo naquela partition.

Lag não é tempo.

Três records podem representar milissegundos ou horas, dependendo do processamento e do fluxo.

---

### auto.offset.reset

`auto.offset.reset` é utilizado quando:

- o grupo não possui offset inicial;
- o offset confirmado não existe mais por retenção;
- a posição está fora da faixa disponível.

Valores principais:

```text
earliest:
começar no offset mais antigo disponível.

latest:
começar no final atual.

none:
falhar se não existir posição.
```

Em Kafka 4.3 também existe reset por duração em configurações compatíveis, mas o laboratório utilizará `earliest`.

Importante:

```text
auto.offset.reset
não volta ao começo
em todo restart.
```

Se o grupo possui committed offsets válidos, ele retoma deles.

---

### Reset administrativo

Reset de offsets altera a posição confirmada de um grupo.

Ele pode:

- voltar ao início;
- avançar ao fim;
- ir para offset específico;
- deslocar por quantidade;
- usar data ou duração.

É uma operação de impacto.

O grupo precisa estar inativo para o reset seguro com a ferramenta.

Sempre visualize o resultado antes de executar.

---

## Mão na massa guiada

### 1. Iniciar o ambiente

Entre:

```powershell
Set-Location `
  "labs/m16/aula-479-kafka-fundamentos"
```

Inicie o container existente:

```powershell
docker start `
  "m16-kafka"
```

Aguarde:

```powershell
docker logs `
  --tail 50 `
  "m16-kafka"
```

---

### 2. Criar o topic particionado

Arquivo:

```text
commands/07-create-partitioned-topic.ps1
```

Conteúdo:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --create `
  --if-not-exists `
  --topic "m16.orders.partitioned.v1" `
  --partitions 3 `
  --replication-factor 1
```

Execute:

```powershell
.\commands\07-create-partitioned-topic.ps1
```

---

### 3. Descrever o topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.partitioned.v1"
```

Confirme:

```text
PartitionCount:
3.

ReplicationFactor:
1.

partitions:
0, 1 e 2.
```

Como existe um broker, o mesmo broker é leader e replica de todas.

---

### 4. Produzir records com keys repetidas

Arquivo:

```text
commands/08-produce-keyed-orders.ps1
```

```powershell
$records = @(
  'ORD-A|{"type":"orders.created.v1","orderId":"ORD-A","sequence":1}'
  'ORD-B|{"type":"orders.created.v1","orderId":"ORD-B","sequence":1}'
  'ORD-C|{"type":"orders.created.v1","orderId":"ORD-C","sequence":1}'
  'ORD-A|{"type":"orders.updated.v1","orderId":"ORD-A","sequence":2}'
  'ORD-B|{"type":"orders.updated.v1","orderId":"ORD-B","sequence":2}'
  'ORD-C|{"type":"orders.updated.v1","orderId":"ORD-C","sequence":2}'
  'ORD-A|{"type":"orders.completed.v1","orderId":"ORD-A","sequence":3}'
  'ORD-B|{"type":"orders.completed.v1","orderId":"ORD-B","sequence":3}'
  'ORD-C|{"type":"orders.completed.v1","orderId":"ORD-C","sequence":3}'
)

$records -join "`n" |
  docker exec `
    --interactive `
    "m16-kafka" `
    /opt/kafka/bin/kafka-console-producer.sh `
    --bootstrap-server "localhost:9092" `
    --topic "m16.orders.partitioned.v1" `
    --property "parse.key=true" `
    --property "key.separator=|"
```

Execute:

```powershell
.\commands\08-produce-keyed-orders.ps1
```

Não presuma qual key irá para qual número de partition.

---

### 5. Consumir com metadata

Arquivo:

```text
commands/09-consume-with-metadata.ps1
```

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.partitioned.v1" `
  --from-beginning `
  --max-messages 9 `
  --property "print.key=true" `
  --property "key.separator=|" `
  --property "print.partition=true" `
  --property "print.offset=true" `
  --property "print.timestamp=true"
```

Execute e registre:

```text
ORD-A:
mesma partition.

ORD-B:
mesma partition.

ORD-C:
mesma partition.
```

Duas keys podem cair na mesma partition.

Isso não viola o modelo.

---

### 6. Validar ordem por key

Para cada key, confirme:

```text
sequence 1;

sequence 2;

sequence 3.
```

A ordem relativa foi preservada porque os records da mesma key foram para a mesma partition e foram produzidos na sequência.

Não afirme ordem global entre A, B e C.

---

### 7. Criar o primeiro consumer group

Execute:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.partitioned.v1" `
  --group "m16-order-projection-v1" `
  --from-beginning `
  --max-messages 9 `
  --property "print.partition=true" `
  --property "print.offset=true"
```

O consumer lê os records e o grupo mantém offsets.

A confirmação do console consumer pode ocorrer de forma assíncrona. Aguarde alguns segundos antes de descrever o grupo.

---

### 8. Descrever offsets e lag

Arquivo:

```text
commands/10-describe-consumer-group.ps1
```

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-v1"
```

Execute:

```powershell
.\commands\10-describe-consumer-group.ps1
```

Observe por partition:

```text
CURRENT-OFFSET;

LOG-END-OFFSET;

LAG.
```

Após consumo completo:

```text
LAG:
0.
```

---

### 9. Criar backlog

Produza mais seis records:

```powershell
$records = @(
  'ORD-A|{"type":"orders.updated.v1","orderId":"ORD-A","sequence":4}'
  'ORD-B|{"type":"orders.updated.v1","orderId":"ORD-B","sequence":4}'
  'ORD-C|{"type":"orders.updated.v1","orderId":"ORD-C","sequence":4}'
  'ORD-A|{"type":"orders.updated.v1","orderId":"ORD-A","sequence":5}'
  'ORD-B|{"type":"orders.updated.v1","orderId":"ORD-B","sequence":5}'
  'ORD-C|{"type":"orders.updated.v1","orderId":"ORD-C","sequence":5}'
)

$records -join "`n" |
  docker exec `
    --interactive `
    "m16-kafka" `
    /opt/kafka/bin/kafka-console-producer.sh `
    --bootstrap-server "localhost:9092" `
    --topic "m16.orders.partitioned.v1" `
    --property "parse.key=true" `
    --property "key.separator=|"
```

Não inicie o group consumer ainda.

---

### 10. Observar lag

Execute novamente:

```powershell
.\commands\10-describe-consumer-group.ps1
```

A soma do lag deve refletir os seis novos records.

A distribuição entre partitions depende das keys.

---

### 11. Retomar do committed offset

Execute sem `--from-beginning`:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.partitioned.v1" `
  --group "m16-order-projection-v1" `
  --max-messages 6 `
  --property "print.key=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Apenas os seis records pendentes devem ser consumidos.

Isso comprova:

```text
o grupo retomou
do committed offset.
```

---

### 12. Preparar consumers concorrentes

Abra três terminais.

Em cada um, execute o mesmo comando sem `--max-messages`:

```powershell
docker exec `
  --interactive `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.partitioned.v1" `
  --group "m16-order-live-v1" `
  --property "print.key=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Aguarde os três members entrarem no grupo.

---

### 13. Inspecionar assignments

Em um quarto terminal:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-live-v1" `
  --members `
  --verbose
```

Confirme:

```text
três members;

três partitions distribuídas.
```

A estratégia exata pode variar.

---

### 14. Produzir durante o grupo ativo

Produza records com as três keys.

Observe que cada terminal recebe records das partitions atribuídas.

Um member não recebe records de uma partition atribuída a outro member do mesmo grupo.

---

### 15. Iniciar um quarto member

Abra outro terminal e execute o mesmo consumer no grupo:

```text
m16-order-live-v1.
```

Descreva os members novamente.

Com três partitions, um member pode ficar com:

```text
0 partitions.
```

Ele faz parte do grupo, mas não aumenta o paralelismo.

Finalize o quarto member com `Ctrl + C`.

---

### 16. Observar rebalance

Finalize um dos três consumers que possui partition.

Descreva novamente:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-live-v1" `
  --members `
  --verbose
```

As partitions do member removido são redistribuídas.

Isso é um rebalance.

Finalize todos os consumers do grupo ao concluir.

---

### 17. Criar um grupo independente

Execute:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.partitioned.v1" `
  --group "m16-order-audit-v1" `
  --from-beginning `
  --max-messages 15 `
  --property "print.key=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Ajuste `--max-messages` ao total existente se você produziu records adicionais.

O grupo de auditoria lê seu próprio histórico.

Os offsets do projection group não interferem.

---

### 18. Listar grupos

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --list
```

Procure:

```text
m16-order-projection-v1;

m16-order-live-v1;

m16-order-audit-v1.
```

---

### 19. Preparar reset de offsets

Todos os consumers do grupo de projection precisam estar encerrados.

Confirme o state:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-v1" `
  --state
```

Não execute reset com members ativos.

---

### 20. Visualizar reset para earliest

Arquivo:

```text
commands/11-preview-offset-reset.ps1
```

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --group "m16-order-projection-v1" `
  --topic "m16.orders.partitioned.v1" `
  --reset-offsets `
  --to-earliest
```

Sem `--execute`, a ferramenta mostra os novos offsets propostos.

Revise todas as partitions.

---

### 21. Executar o reset

Arquivo:

```text
commands/12-execute-offset-reset.ps1
```

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --group "m16-order-projection-v1" `
  --topic "m16.orders.partitioned.v1" `
  --reset-offsets `
  --to-earliest `
  --execute
```

Execute somente depois de validar a prévia.

---

### 22. Confirmar novos offsets

```powershell
.\commands\10-describe-consumer-group.ps1
```

O `CURRENT-OFFSET` volta ao earliest disponível.

O lag cresce até o fim atual do log.

---

### 23. Executar replay do grupo

Inicie o projection group sem `--from-beginning`:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.partitioned.v1" `
  --group "m16-order-projection-v1" `
  --property "print.key=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

O grupo relê porque seus committed offsets foram alterados.

Finalize quando o backlog chegar a zero.

---

### 24. Diferenciar reset de auto.offset.reset

O reset administrativo alterou offsets existentes.

`auto.offset.reset=earliest` seria consultado apenas se o grupo não possuísse posição válida.

Não adicione `--from-beginning` indiscriminadamente a comandos operacionais de grupos existentes.

---

### 25. Registrar risco de replay

Antes de resetar um grupo real, confirme:

- consumers parados;
- topic correto;
- grupo correto;
- partitions corretas;
- novo offset revisado;
- efeitos idempotentes;
- downstream preparado;
- volume estimado;
- janela operacional;
- observabilidade;
- rollback ou interrupção;
- aprovação do owner.

No laboratório, o console apenas imprime records.

Em uma aplicação, replay pode repetir gravações, e-mails, cobranças ou chamadas externas.

---

### 26. Não alterar partitions do topic principal

Não execute nesta aula:

```powershell
kafka-topics.sh `
  --alter `
  --partitions 6
```

O aumento será apenas discutido.

O topic de três partitions precisa permanecer estável para a evidência e para a aula 481.

---

### 27. Executar a validação final

Confirme:

```text
topic:
3 partitions.

same key:
same partition.

order:
local à partition.

projection group:
offsets próprios.

audit group:
offsets próprios.

3 consumers:
3 assignments.

4 consumers:
um sem trabalho.

lag:
observado.

reset:
preview e execute.

replay:
comprovado.
```

---

## Entendendo o que foi feito

### O topic passou a ter paralelismo

Três partitions criaram três logs independentes.

### A key agrupou records relacionados

Records do mesmo pedido permaneceram na mesma partition.

### A ordem ficou corretamente delimitada

A garantia existe dentro da partition, não no topic inteiro.

### Consumer groups dividiram o trabalho

Partitions foram atribuídas entre members.

### O limite de paralelismo ficou visível

Um quarto consumer não recebeu partition.

### Grupos diferentes receberam o mesmo histórico

Projection e audit mantiveram posições independentes.

### Offsets passaram a representar progresso

Cada grupo armazenou uma posição por partition.

### Lag ficou mensurável

A diferença entre log end e current offset mostrou backlog.

### Restart não voltou ao início

O grupo retomou do committed offset.

### Reset permitiu replay

A posição confirmada voltou ao earliest disponível.

### O risco operacional ficou explícito

Reler records pode repetir efeitos.

---

## Erros comuns importantes

### Esperar ordem global

Partitions independentes não formam uma sequência única de consumo.

### Usar key aleatória

Records do mesmo agregado podem se dispersar.

### Usar uma key única para tudo

Uma partition concentra toda a carga.

### Aumentar partitions sem avaliar keys

O mapeamento futuro pode mudar.

### Criar mais consumers que partitions

Members ficam ociosos.

### Confundir grupos com consumers

Grupo é a identidade coletiva; consumer é um member.

### Confundir offset do record e committed offset

Um identifica posição; o outro registra progresso do grupo.

### Interpretar current offset como último processado

Ele normalmente representa o próximo a consumir.

### Tratar lag como tempo

É quantidade de records.

### Usar earliest em todo startup

Committed offsets válidos têm precedência.

### Resetar grupo ativo

A operação pode falhar ou conflitar com commits.

### Executar reset sem prévia

O impacto pode atingir partitions erradas.

### Fazer replay sem idempotência

Efeitos colaterais podem se repetir.

### Ler __consumer_offsets manualmente

Use ferramentas administrativas.

---

## Comandos úteis

### Descrever topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.partitioned.v1"
```

### Descrever grupo

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-v1"
```

### Ver members

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-live-v1" `
  --members `
  --verbose
```

### Prévia de reset

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --group "m16-order-projection-v1" `
  --topic "m16.orders.partitioned.v1" `
  --reset-offsets `
  --to-earliest
```

---

## Exercício guiado

### Parte 1 — Topic

Crie três partitions.

### Parte 2 — Keys

Publique sequências para três pedidos.

### Parte 3 — Ordem

Valide ordem por key e partition.

### Parte 4 — Grupo

Consuma e confirme offsets.

### Parte 5 — Lag

Produza backlog e calcule lag.

### Parte 6 — Paralelismo

Inicie três e depois quatro members.

### Parte 7 — Independência

Leia com outro grupo.

### Parte 8 — Reset

Visualize e execute reset para earliest.

### Parte 9 — Replay

Relê o histórico pelo mesmo grupo.

### Parte 10 — Registro

Documente assignments, offsets e riscos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 479 foi preservada;
- o mesmo ambiente Kafka foi reutilizado;
- topic novo foi criado explicitamente;
- topic possui três partitions;
- replication factor permaneceu um;
- limitação de um broker foi registrada;
- topic foi descrito;
- partitions 0, 1 e 2 foram observadas;
- topic foi definido como conjunto de partitions;
- partition foi definida como log ordenado;
- ordem global não foi prometida;
- ordem por partition foi explicada;
- key foi utilizada;
- records com a mesma key ficaram na mesma partition;
- número exato da partition não foi presumido;
- hot partition foi explicada;
- ausência de key foi contextualizada;
- aumento de partitions foi explicado;
- records antigos não são redistribuídos;
- risco de remapeamento de key foi explicado;
- topic não foi alterado durante a aula;
- consumer group foi explicado;
- group.id foi explicado;
- coordinator foi contextualizado;
- assignment foi observado;
- rebalance foi observado;
- três consumers receberam partitions;
- quarto consumer pôde ficar sem assignment;
- paralelismo máximo foi ligado às partitions;
- grupos independentes foram criados;
- projection e audit possuem offsets próprios;
- offset do record foi explicado;
- offset foi mantido local à partition;
- offset não foi tratado como ID global;
- consumer position foi explicada;
- committed offset foi explicado;
- current offset foi interpretado como próxima posição;
- offsets internos foram contextualizados;
- `__consumer_offsets` não foi manipulado;
- log-end-offset foi explicado;
- lag foi calculado;
- lag não foi tratado como tempo;
- backlog foi criado;
- retomada por committed offset foi comprovada;
- `auto.offset.reset` foi explicado;
- earliest, latest e none foram contextualizados;
- earliest não foi tratado como ação em todo restart;
- reset administrativo foi explicado;
- grupo foi encerrado antes do reset;
- prévia foi executada;
- `--execute` foi usado somente depois;
- offsets voltaram ao earliest;
- replay do mesmo grupo foi comprovado;
- riscos de replay foram registrados;
- Spring Kafka não foi antecipado;
- commit manual Java não foi antecipado;
- transactions não foram antecipadas;
- retry topic não foi antecipado;
- dead-letter topic não foi antecipado;
- Kafka Streams e Connect não foram antecipados;
- Schema Registry não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 481 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure nomes e operações críticas:

```powershell
git grep `
  -n `
  -E `
  "m16\\.orders\\.partitioned\\.v1|m16-order-projection-v1|reset-offsets|to-earliest|partitions 3"
```

Adicione:

```powershell
git add `
  labs/m16/aula-479-kafka-fundamentos `
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
git commit -m "feat(m16): aprofundar partitions e offsets Kafka"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- logs do Kafka;
- storage do broker;
- payload real;
- offsets exportados de produção;
- scripts com groups corporativos;
- screenshots temporários;
- alteração acidental de partitions;
- integração Spring antecipada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o topic deixou de ser tratado como um único log.

O modelo ficou:

```text
topic;

partitions;

keys;

offsets;

consumer groups;

assignments;

commits;

lag;

reset;

replay.
```

Você comprovou que:

- topic é dividido em partitions;
- cada partition possui offsets próprios;
- a ordem é preservada dentro da partition;
- key consistente mantém records relacionados juntos;
- três partitions permitem até três consumers ativos por grupo;
- consumer extra pode ficar sem assignment;
- entrada e saída de members provocam rebalance;
- grupos diferentes leem o mesmo histórico independentemente;
- committed offset registra a próxima posição do grupo;
- log-end-offset representa o fim atual;
- lag mede records ainda não confirmados;
- `auto.offset.reset` só atua quando não existe posição válida;
- reset administrativo altera offsets existentes;
- reset deve ser visualizado antes da execução;
- replay exige análise de efeitos colaterais.

A próxima aula será:

```text
481 - M16.26 - Consumers producers Kafka
```

Nela, você irá:

- adicionar Spring for Apache Kafka;
- configurar `spring.kafka.*`;
- declarar topics por código;
- criar serializers e deserializers JSON;
- publicar com `KafkaTemplate`;
- receber com `@KafkaListener`;
- trabalhar com keys;
- observar topic, partition e offset no código;
- configurar consumer group;
- tratar commits no nível planejado;
- criar testes com Kafka;
- conectar a aplicação Java ao laboratório.

Transactions, exactly-once, retry topics e dead-letter topics continuarão fora do escopo até as etapas apropriadas.

---

# Material complementar

## Checkpoint final

- [ ] Criei topic com três partitions.
- [ ] Produzi records com keys.
- [ ] Validei ordem por partition.
- [ ] Trabalhei com consumer groups.
- [ ] Observei assignments e lag.
- [ ] Visualizei e executei reset.
- [ ] Comprovei replay.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Topic continua com uma partition

Confirme o nome novo e o script `07-create-partitioned-topic.ps1`.

### Mesma key aparece em partitions diferentes

Revise separador, parser de key, mudanças na quantidade de partitions e producer utilizado.

### Uma partition recebe quase tudo

As keys podem estar concentradas ou ter distribuição ruim.

### Quarto consumer recebe records

Confirme se existem mais de três partitions ou se ele está em outro group.id.

### Grupo não aparece

O console consumer pode não ter concluído join ou commit.

### CURRENT-OFFSET aparece vazio

O grupo ainda não confirmou posição naquela partition.

### Lag não diminui

Consumer pode estar parado, usando outro group.id ou falhando antes do commit.

### Consumer volta ao início inesperadamente

Revise group.id, committed offsets, reset executado e retenção.

### Reset é recusado

Encerre todos os members do grupo.

### Reset parece não executar

Confirme o uso de `--execute`.

### Replay não mostra records antigos

Eles podem ter sido removidos pela retenção ou o reset não alcançou o earliest esperado.

### Ordem parece incorreta

Compare somente records da mesma partition e key.

---

## Perguntas de revisão

1. O que é partition?
2. Um topic possui offset global?
3. Onde a ordem é garantida?
4. Para que serve key?
5. Key garante equilíbrio?
6. O que é hot partition?
7. O que é consumer group?
8. Quantos consumers ativos cabem em três partitions?
9. O que é assignment?
10. O que é rebalance?
11. Grupos diferentes compartilham offsets?
12. O que é offset do record?
13. O que é committed offset?
14. O que CURRENT-OFFSET representa?
15. O que é LOG-END-OFFSET?
16. Como calcular lag?
17. Quando auto.offset.reset é usado?
18. O que reset de offsets altera?
19. Por que o grupo precisa estar inativo?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Log ordenado dentro de um topic.
2. Não.
3. Dentro de cada partition.
4. Agrupar records relacionados.
5. Não.
6. Partition com carga desproporcional.
7. Consumers que cooperam.
8. Três.
9. Partitions atribuídas ao member.
10. Redistribuição de assignments.
11. Não.
12. Posição do record na partition.
13. Próxima posição confirmada do grupo.
14. Próximo offset esperado.
15. Final atual do log.
16. End menos current.
17. Quando não existe posição válida.
18. Posição confirmada do grupo.
19. Para evitar conflito com commits ativos.
20. Consumers producers Kafka.

---

## Desafio opcional

Crie:

```text
topic:
m16.customers.partitioned.v1.

partitions:
4.

group:
m16-customer-projection-v1.
```

Requisitos:

- keys por customerId;
- quatro consumers;
- quinto member sem assignment;
- dois grupos independentes;
- backlog e lag;
- prévia de reset;
- reset para earliest;
- replay;
- nenhuma alteração de partition count depois da criação;
- nenhuma integração Java.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 480 - M16.25 - Topics partitions offsets

- Continuei no laboratório Kafka da aula 479.
- Criei o topic `m16.orders.partitioned.v1`.
- Configurei três partitions.
- Mantive replication factor `1` no broker local.
- Entendi topic como conjunto de partitions.
- Entendi partition como log ordenado.
- Diferenciei ordem por partition de ordem global.
- Produzi records com keys repetidas.
- Mantive eventos do mesmo pedido na mesma partition.
- Não presumi o número exato da partition.
- Compreendi hot partitions.
- Entendi riscos de aumentar partitions.
- Não alterei o partition count durante o laboratório.
- Criei o grupo `m16-order-projection-v1`.
- Consumi o histórico inicial.
- Observei committed offsets.
- Criei backlog.
- Observei `CURRENT-OFFSET`.
- Observei `LOG-END-OFFSET`.
- Calculei lag.
- Retomei do committed offset.
- Iniciei três consumers concorrentes.
- Observei assignments.
- Iniciei um quarto member sem partition.
- Observei rebalance após saída de consumer.
- Criei o grupo independente `m16-order-audit-v1`.
- Comprovei offsets independentes entre grupos.
- Diferenciei offset do record e progresso do grupo.
- Entendi o topic interno `__consumer_offsets`.
- Não manipulei offsets internos manualmente.
- Entendi `auto.offset.reset`.
- Diferenciei earliest, latest e none.
- Encerrei o grupo antes do reset.
- Visualizei o reset para earliest.
- Executei o reset conscientemente.
- Comprovei replay pelo mesmo group.id.
- Registrei riscos de efeitos duplicados.
- Não antecipei Spring Kafka ou transactions.
- Próxima aula: Consumers producers Kafka.
```

---

## Referência técnica curta

- Apache Kafka — Introduction.
- Apache Kafka — Basic Kafka Operations.
- Apache Kafka — Distribution.
- Apache Kafka — Consumer Configurations.
- Apache Kafka — Topic Operations.
- Apache Kafka — Console Consumer.
- Apache Kafka — Consumer Groups.
- Apache Kafka — Design: Log.
- Apache Kafka — Topic Configurations.
- Spring Boot — Apache Kafka Support.

Regra final:

```text
topics Kafka são divididos em partitions, e cada partition é um log ordenado com offsets próprios; keys consistentes mantêm records relacionados na mesma partition, mas podem criar desequilíbrio; dentro de um consumer group, cada partition é atribuída a no máximo um member por vez, por isso o número de partitions limita o paralelismo; grupos diferentes mantêm committed offsets independentes; CURRENT-OFFSET representa a próxima posição confirmada, LOG-END-OFFSET representa o fim atual e a diferença forma o lag; auto.offset.reset atua somente quando não existe posição válida, enquanto reset administrativo altera offsets existentes e deve ser visualizado, executado com o grupo inativo e usado apenas quando o replay for seguro para os efeitos da aplicação.
```
