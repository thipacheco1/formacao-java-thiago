# 479 - M16.24 - Kafka fundamentos

## Apresentação da aula

Na aula 478, você concluiu a primeira sequência prática de RabbitMQ.

O laboratório passou por:

```text
fundamentos;

exchanges;

queues;

bindings;

producers;

consumers;

acknowledgements;

retry;

backoff;

dead-letter exchange;

dead-letter queue.
```

O RabbitMQ foi utilizado para distribuir trabalho e entregar mensagens a capacidades consumidoras independentes.

Agora começa uma nova etapa do M16.

A pergunta deixa de ser apenas:

```text
qual consumer deve receber
esta mensagem agora?
```

e passa a incluir:

```text
como registrar uma sequência de eventos;

mantê-la disponível por um período;

permitir que consumidores avancem
em ritmos diferentes;

e possibilitar nova leitura
sem republicar cada evento?
```

A tecnologia estudada será:

```text
Apache Kafka.
```

Kafka não será apresentado como “RabbitMQ melhor” nem como substituto automático.

As duas tecnologias possuem sobreposição, mas partem de modelos operacionais diferentes.

No RabbitMQ trabalhado até aqui, o fluxo principal foi:

```text
producer;

exchange;

binding;

queue;

consumer;

ack;

remoção da mensagem
da queue ativa.
```

No Kafka, a visão inicial será:

```text
producer;

topic;

append de record;

log retido;

consumer lê;

posição de leitura;

record continua disponível
conforme a política de retenção.
```

A diferença central desta aula será:

```text
RabbitMQ:
entrega orientada a queues
e processamento.

Kafka:
log distribuído orientado
a eventos retidos e leitura.
```

Essa simplificação é didática. RabbitMQ também possui recursos avançados, streams e retenção em modelos específicos. Kafka também pode ser utilizado em integrações semelhantes a filas. O objetivo é compreender a arquitetura predominante de cada ferramenta antes de comparar detalhes.

A pergunta central será:

```text
o que é Apache Kafka,

qual problema seu log distribuído resolve,

e como produzir e consumir
os primeiros records
em um ambiente local controlado?
```

O laboratório utilizará:

```text
Apache Kafka 4.3.1;

imagem oficial apache/kafka;

KRaft;

um broker local;

um topic;

console producer;

console consumer;

retenção;

replay manual inicial.
```

A versão ficará explícita:

```text
apache/kafka:4.3.1
```

Não use:

```text
latest.
```

A baseline utilizará um único container e um único broker.

Isso é suficiente para aprender o modelo, mas não representa produção.

O ambiente produtivo exigiria decisões adicionais sobre:

- múltiplos brokers;
- replicação;
- disponibilidade;
- rack awareness;
- segurança;
- TLS;
- SASL;
- autorização;
- observabilidade;
- armazenamento;
- capacidade;
- upgrades;
- disaster recovery;
- operação de controllers;
- balanceamento.

Esses assuntos não serão antecipados.

Kafka 4 utiliza KRaft como arquitetura de metadata. ZooKeeper não será instalado nem configurado.

O laboratório começará somente com ferramentas oficiais do próprio Kafka.

Não será criado projeto Spring Boot nesta aula.

A integração Java virá depois:

```text
480:
Topics partitions offsets.

481:
Consumers producers Kafka.
```

A aula 480 aprofundará:

- partitions;
- ordenação por partition;
- offsets;
- consumer groups;
- distribuição;
- paralelismo;
- posição atual;
- lag;
- reset de offsets.

A aula 481 utilizará Spring for Apache Kafka.

Nesta aula, partitions e offsets serão apenas reconhecidos na saída das ferramentas, sem aprofundamento.

Ao final, você deverá explicar:

```text
o que é um broker Kafka;

o que é um topic;

o que é um record;

por que Kafka é tratado como log;

por que consumir não remove o record;

o que retenção controla;

como replay é possível;

por que um broker local
não representa alta disponibilidade;

por que Kafka e RabbitMQ
não devem ser escolhidos
apenas por popularidade.
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

481:
Consumers producers Kafka.

482:
RabbitMQ vs Kafka.
```

A aula 478 respondeu:

```text
como tratar falhas de consumo
sem redelivery infinito?
```

A aula 479 responderá:

```text
como funciona um log de eventos
retido e consumido
por posição de leitura?
```

Nesta aula:

```text
Kafka:
sim.

imagem oficial:
sim.

KRaft:
sim.

broker único:
sim.

topic:
sim.

record:
sim.

key:
introdução.

value:
sim.

timestamp:
introdução.

headers:
conceito.

retenção:
sim.

replay:
sim.

console producer:
sim.

console consumer:
sim.

partition:
somente reconhecimento.

offset:
somente reconhecimento.

consumer group:
somente reconhecimento.

Spring Kafka:
não.

KafkaTemplate:
não.

@KafkaListener:
não.

Schema Registry:
não.

Kafka Connect:
não.

Kafka Streams:
não.
```

A regra central será:

```text
Kafka mantém records
em um log organizado por topic;

consumidores leem esse log
e controlam sua posição;

a retenção é independente
da leitura individual.
```

---

## Objetivo prático

Ao final, você terá:

```text
container:
m16-kafka.

imagem:
apache/kafka:4.3.1.

porta:
9092.

topic:
m16.orders.events.v1.

records:
produzidos e consumidos.

replay:
validado com --from-beginning.
```

Diretório de apoio:

```text
labs/m16/aula-479-kafka-fundamentos
├── README-LAB.md
├── commands
│   ├── 01-start-kafka.ps1
│   ├── 02-create-topic.ps1
│   ├── 03-describe-topic.ps1
│   ├── 04-produce-records.ps1
│   ├── 05-consume-records.ps1
│   └── 06-stop-kafka.ps1
└── evidence
    └── .gitkeep
```

Os scripts serão pequenos e copiáveis.

Eles não esconderão os comandos importantes.

Você irá:

1. compreender Kafka como plataforma de event streaming;
2. diferenciar broker, cluster e controller;
3. compreender KRaft em nível inicial;
4. iniciar a imagem oficial;
5. validar o processo;
6. localizar as ferramentas CLI;
7. criar um topic;
8. descrever o topic;
9. produzir records sem key;
10. consumir records;
11. produzir records com key;
12. exibir key, partition, offset e timestamp;
13. observar que consumir não apaga;
14. repetir a leitura desde o início;
15. entender retenção;
16. inspecionar configurações do topic;
17. testar broker indisponível;
18. registrar limitações;
19. documentar o laboratório;
20. commitar;
21. preparar partitions e offsets.

---

## Conceito essencial

### O que é Apache Kafka

Apache Kafka é uma plataforma distribuída de event streaming.

Ela permite:

```text
publicar eventos;

armazenar eventos;

consumir eventos;

processar fluxos;

integrar sistemas.
```

O conceito central não é apenas “mandar uma mensagem”.

É manter uma sequência ordenada de records dentro de logs particionados.

Nesta aula, o laboratório utilizará apenas o núcleo:

```text
broker;

topic;

record;

producer;

consumer;

retenção.
```

---

### Evento e record

Um evento representa algo que aconteceu.

Exemplos:

```text
pedido criado;

pagamento autorizado;

produto reservado;

entrega confirmada.
```

No Kafka, o dado publicado é chamado de record.

Um record pode possuir:

```text
key;

value;

timestamp;

headers;

topic;

partition;

offset.
```

Antes de ser armazenado, o producer escolhe ou permite que o cliente determine:

```text
topic;

key;

value;

headers.
```

Depois do append, o broker atribui a posição correspondente.

---

### Broker

Broker é um servidor Kafka.

Ele recebe records, mantém partitions, atende producers e consumers e participa da operação do cluster.

Nesta aula:

```text
cluster:
um broker.

controller:
no mesmo processo.

modo:
KRaft combinado.
```

Em produção, controllers e brokers podem ser organizados de maneira diferente.

Um broker único significa:

```text
sem tolerância à falha do processo;

sem réplica em outro broker;

sem manutenção transparente;

sem alta disponibilidade.
```

O laboratório não deve ser chamado de cluster produtivo.

---

### Cluster

Cluster é o conjunto de servidores Kafka que cooperam.

Mesmo com um único broker, as ferramentas falam com um endpoint de bootstrap:

```text
localhost:9092.
```

`bootstrap.servers` não precisa listar todos os brokers.

Ele fornece pontos iniciais para o cliente descobrir metadata do cluster.

Na baseline:

```text
bootstrap server:
localhost:9092.
```

---

### KRaft

KRaft é o modo de gerenciamento de metadata baseado no protocolo de consenso do próprio Kafka.

Ele substitui a dependência histórica de ZooKeeper.

A metadata inclui informações como:

- brokers registrados;
- topics;
- partitions;
- leaders;
- configurações;
- estado do cluster.

Nesta aula, a imagem oficial prepara um ambiente local simples.

Você não configurará quorum de controllers manualmente.

---

### Topic

Topic é uma categoria lógica de records.

Exemplo:

```text
m16.orders.events.v1.
```

O topic não é uma classe Java.

Ele é um recurso compartilhado no cluster.

Um topic pode conter diferentes records pertencentes à mesma família de eventos, conforme a governança do sistema.

A baseline utilizará apenas:

```text
orders.created.v1.
```

como tipo lógico do payload.

Não misture eventos sem relação apenas para reduzir a quantidade de topics.

Também não crie um topic por cliente, pedido ou request.

---

### Log

Kafka grava records em sequência dentro de partitions.

A comparação didática é:

```text
append no fim;

leitura por posição;

dados permanecem por retenção.
```

O log não significa arquivo de texto de aplicação.

É uma estrutura de armazenamento organizada pelo Kafka.

O record não é removido porque um consumer leu.

Essa propriedade permite:

- consumidores independentes;
- reconstrução;
- reprocessamento;
- novas projeções;
- auditoria técnica;
- integração tardia;
- replay controlado.

---

### Retenção

Retenção define por quanto tempo ou volume os records permanecem disponíveis.

A política comum:

```text
cleanup.policy=delete
```

remove segmentos antigos quando limites de tempo ou tamanho são atingidos.

Kafka também oferece compactação por key, mas ela não será implementada nesta aula.

Retenção não é backup.

Se a política apagar o record e não existir cópia externa adequada, ele deixa de estar disponível no topic.

A baseline usará a retenção padrão do broker.

Você apenas inspecionará a configuração.

---

### Producer

Producer publica records.

Ele escolhe:

```text
topic;

key opcional;

value;

headers opcionais.
```

O console producer será utilizado para aprender o protocolo de uso sem introduzir código Java.

A entrega real envolve configurações como:

- acknowledgements;
- retries;
- batching;
- compression;
- timeout;
- idempotência;
- serializers.

Esses detalhes serão tratados nas aulas de producer.

---

### Consumer

Consumer lê records.

Diferentemente da queue tradicional estudada no RabbitMQ:

```text
a leitura não remove
o record do topic.
```

O consumer mantém ou recebe uma posição de leitura.

Nesta aula, o console consumer será executado:

```text
sem grupo persistente explícito;

com --from-beginning;

com exibição de metadata.
```

Consumer groups serão aprofundados na aula 480.

---

### Key

Key é opcional.

Ela pode influenciar o roteamento para partitions e ajudar a manter records relacionados na mesma partition.

Exemplo:

```text
key:
ORD-479-0001.
```

O aprofundamento será feito na próxima aula.

Nesta etapa, memorize:

```text
key não é ID global obrigatório;

key não é routing key RabbitMQ;

key não é nome do consumer.
```

---

### Partition

Topic é dividido em uma ou mais partitions.

Cada partition possui seu próprio log ordenado.

A baseline criará:

```text
partitions:
1.
```

Isso reduz variáveis no primeiro laboratório.

A aula 480 criará múltiplas partitions e estudará distribuição e ordenação.

---

### Offset

Offset é a posição de um record dentro de uma partition.

Exemplo:

```text
partition:
0.

offset:
3.
```

Offsets não são globais para todo o cluster.

A mesma numeração existe independentemente em partitions diferentes.

Nesta aula, você apenas exibirá offsets.

---

### Replay

Replay é uma nova leitura de records que continuam retidos.

No laboratório, executar novamente:

```text
kafka-console-consumer.sh
--from-beginning
```

permitirá ler os mesmos records.

Isso não significa que qualquer aplicação pode reprocessar cegamente.

Reprocessamento real exige:

- idempotência;
- efeitos controlados;
- versão de contrato;
- destino apropriado;
- posição escolhida;
- autorização operacional;
- observabilidade.

---

### Kafka e RabbitMQ

Comparação inicial:

```text
RabbitMQ:
queues recebem mensagens;
consumer ack libera a entrega;
roteamento por exchanges e bindings;
bom para distribuição de trabalho
e integrações orientadas a entrega.

Kafka:
topics retêm records;
consumers leem por posição;
replay é parte do modelo;
bom para logs de eventos,
integração de dados
e múltiplas leituras independentes.
```

Não escolha apenas pela taxa máxima divulgada.

Considere:

- semântica;
- retenção;
- replay;
- ordenação;
- roteamento;
- operação;
- latência;
- volume;
- ecossistema;
- experiência da equipe.

A aula 482 fará a comparação estruturada.

---

## Mão na massa guiada

### 1. Criar o diretório do laboratório

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "labs/m16/aula-479-kafka-fundamentos/commands" |
  Out-Null

New-Item `
  -ItemType Directory `
  -Force `
  "labs/m16/aula-479-kafka-fundamentos/evidence" |
  Out-Null
```

Entre:

```powershell
Set-Location `
  "labs/m16/aula-479-kafka-fundamentos"
```

---

### 2. Confirmar Docker

```powershell
docker version
```

Confirme que client e server respondem.

Kafka local precisará de memória disponível.

Feche containers desnecessários quando o Docker Desktop estiver limitado.

---

### 3. Baixar a imagem oficial

```powershell
docker pull `
  "apache/kafka:4.3.1"
```

Confirme:

```powershell
docker image inspect `
  "apache/kafka:4.3.1" `
  --format `
  '{{.RepoTags}}'
```

Não use `latest`.

---

### 4. Iniciar o broker

Remova somente uma instância antiga do mesmo laboratório:

```powershell
docker rm `
  --force `
  "m16-kafka" `
  2>$null
```

Inicie:

```powershell
docker run `
  --name "m16-kafka" `
  --detach `
  --publish "9092:9092" `
  "apache/kafka:4.3.1"
```

A imagem oficial inicia uma configuração local apropriada para o quickstart.

Ela não é a configuração produtiva do curso.

---

### 5. Acompanhar os logs

```powershell
docker logs `
  --follow `
  "m16-kafka"
```

Aguarde o broker ficar pronto.

Interrompa apenas o acompanhamento:

```text
Ctrl + C.
```

O container continua executando.

---

### 6. Confirmar o processo

```powershell
docker ps `
  --filter "name=m16-kafka"
```

Confirme:

```text
status:
Up.

port:
9092.
```

Se o container encerrou:

```powershell
docker logs `
  "m16-kafka"
```

---

### 7. Localizar as ferramentas

```powershell
docker exec `
  "m16-kafka" `
  sh `
  -c `
  "ls -1 /opt/kafka/bin | head -20"
```

Procure:

```text
kafka-topics.sh;

kafka-console-producer.sh;

kafka-console-consumer.sh;

kafka-configs.sh;

kafka-metadata-quorum.sh.
```

As ferramentas serão executadas dentro do container.

---

### 8. Consultar metadata do quorum

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-metadata-quorum.sh `
  --bootstrap-server "localhost:9092" `
  describe `
  --status
```

Observe:

```text
cluster ID;

leader;

voters;

high watermark.
```

Não aprofunde o protocolo de quorum agora.

O objetivo é comprovar KRaft ativo.

---

### 9. Criar o topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --create `
  --topic "m16.orders.events.v1" `
  --partitions 1 `
  --replication-factor 1
```

Resultado esperado:

```text
Created topic m16.orders.events.v1.
```

A replication factor `1` é apenas local.

---

### 10. Listar topics

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --list
```

Confirme:

```text
m16.orders.events.v1.
```

Topics internos podem ou não aparecer conforme o estado do ambiente.

---

### 11. Descrever o topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.events.v1"
```

Observe:

```text
PartitionCount:
1.

ReplicationFactor:
1.

Partition:
0.

Leader:
broker local.

Replicas:
broker local.

Isr:
broker local.
```

Partition, leader, replicas e ISR serão aprofundados depois.

---

### 12. Produzir records simples

Abra um terminal interativo:

```powershell
docker exec `
  --interactive `
  --tty `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-producer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1"
```

Digite uma linha por record:

```json
{"messageId":"MSG-479-0001","type":"orders.created.v1","orderId":"ORD-479-0001"}
{"messageId":"MSG-479-0002","type":"orders.created.v1","orderId":"ORD-479-0002"}
{"messageId":"MSG-479-0003","type":"orders.created.v1","orderId":"ORD-479-0003"}
```

Finalize com:

```text
Ctrl + C.
```

Cada linha foi enviada como value textual.

---

### 13. Consumir desde o início

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --from-beginning `
  --max-messages 3
```

Resultado esperado:

```text
os três JSONs.
```

O consumer termina depois de três records.

---

### 14. Consumir novamente

Execute o mesmo comando outra vez.

Os mesmos três records aparecem.

Isso comprova:

```text
ler não removeu os records.
```

O replay foi possível porque eles continuam retidos.

---

### 15. Exibir metadata

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --from-beginning `
  --max-messages 3 `
  --property "print.topic=true" `
  --property "print.partition=true" `
  --property "print.offset=true" `
  --property "print.timestamp=true"
```

Observe:

```text
topic;

partition 0;

offsets crescentes;

timestamp;

value.
```

Não tente alterar offsets nesta aula.

---

### 16. Produzir records com key

Abra o producer:

```powershell
docker exec `
  --interactive `
  --tty `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-producer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --property "parse.key=true" `
  --property "key.separator=|"
```

Digite:

```text
ORD-479-0101|{"messageId":"MSG-479-0101","type":"orders.created.v1","orderId":"ORD-479-0101"}
ORD-479-0102|{"messageId":"MSG-479-0102","type":"orders.created.v1","orderId":"ORD-479-0102"}
```

Finalize com `Ctrl + C`.

A parte antes de `|` é a key.

---

### 17. Consumir exibindo key

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --from-beginning `
  --max-messages 5 `
  --property "print.key=true" `
  --property "key.separator=|" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Os records antigos podem mostrar:

```text
null
```

como key.

Os dois novos apresentam a key do pedido.

---

### 18. Produzir por pipeline

Crie:

```text
commands/04-produce-records.ps1
```

Conteúdo:

```powershell
$records = @(
  'ORD-479-0201|{"messageId":"MSG-479-0201","type":"orders.created.v1","orderId":"ORD-479-0201"}'
  'ORD-479-0202|{"messageId":"MSG-479-0202","type":"orders.created.v1","orderId":"ORD-479-0202"}'
)

$records -join "`n" |
  docker exec `
    --interactive `
    "m16-kafka" `
    /opt/kafka/bin/kafka-console-producer.sh `
    --bootstrap-server "localhost:9092" `
    --topic "m16.orders.events.v1" `
    --property "parse.key=true" `
    --property "key.separator=|"
```

Execute:

```powershell
.\commands\04-produce-records.ps1
```

Não coloque dados reais no script.

---

### 19. Observar o fim do log

Execute sem `--from-beginning`:

```powershell
docker exec `
  --interactive `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --property "print.offset=true"
```

O consumer aguarda records novos.

Em outro terminal, produza um record.

Ele aparece.

Finalize com `Ctrl + C`.

---

### 20. Inspecionar configurações do topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-configs.sh `
  --bootstrap-server "localhost:9092" `
  --entity-type topics `
  --entity-name "m16.orders.events.v1" `
  --describe `
  --all
```

Procure:

```text
cleanup.policy;

retention.ms;

retention.bytes.
```

Valores podem vir do default do broker.

Não altere retenção para poucos segundos.

A aula precisa preservar os records durante o laboratório.

---

### 21. Compreender a retenção efetiva

Registre:

```text
topic config explícita:
pode estar ausente.

valor efetivo:
pode vir do broker.
```

Uma configuração herdada continua valendo.

Não suponha que ausência na criação significa retenção infinita.

---

### 22. Validar broker indisponível

Pare:

```powershell
docker stop `
  "m16-kafka"
```

Tente listar topics:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --list
```

Como o container está parado, o próprio `docker exec` falha.

Reinicie:

```powershell
docker start `
  "m16-kafka"
```

Aguarde os logs.

---

### 23. Confirmar persistência após restart

Depois do restart:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --from-beginning `
  --max-messages 1
```

No mesmo container, os dados locais devem permanecer após `docker stop/start`.

Isso não equivale a backup.

Se o container for removido, a persistência depende do filesystem e dos mounts definidos.

A baseline não configurará volume externo para evitar transformar a aula em operação de storage.

---

### 24. Criar scripts essenciais

`commands/01-start-kafka.ps1`:

```powershell
docker rm `
  --force `
  "m16-kafka" `
  2>$null

docker run `
  --name "m16-kafka" `
  --detach `
  --publish "9092:9092" `
  "apache/kafka:4.3.1"
```

`commands/02-create-topic.ps1`:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --create `
  --if-not-exists `
  --topic "m16.orders.events.v1" `
  --partitions 1 `
  --replication-factor 1
```

`commands/03-describe-topic.ps1`:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.events.v1"
```

`commands/06-stop-kafka.ps1`:

```powershell
docker stop `
  "m16-kafka"
```

---

### 25. Criar o README do laboratório

Arquivo:

```text
README-LAB.md
```

Registre:

```text
versão Kafka:
4.3.1.

imagem:
apache/kafka:4.3.1.

modo:
KRaft local.

brokers:
1.

porta:
9092.

topic:
m16.orders.events.v1.

partitions:
1.

replication factor:
1.

segurança:
não configurada.

uso:
somente laboratório local.
```

Inclua a ordem:

```text
start;

aguardar;

create topic;

describe;

produce;

consume;

stop.
```

---

### 26. Revisar segurança

A porta local:

```text
9092
```

não possui baseline de autenticação nesta aula.

Não exponha o broker na internet ou em rede não controlada.

Não publique:

- senha;
- token;
- CPF;
- e-mail real;
- payload corporativo;
- dados de cliente;
- segredo;
- evento de produção.

Use somente dados sintéticos.

---

### 27. Não habilitar auto topic creation como contrato

Mesmo que o broker local permita criação automática em alguma situação, a baseline cria o topic explicitamente.

Motivos:

- nome revisável;
- partitions explícitas;
- replication factor explícito;
- falha visível;
- infraestrutura reproduzível.

---

### 28. Não instalar uma UI

Nenhuma UI de terceiros será adicionada.

As ferramentas CLI oficiais são suficientes para compreender o modelo.

Uma UI pode ser adotada depois como apoio operacional, mas não substitui entendimento de topics, records, offsets e configurações.

---

### 29. Executar o fluxo completo

```powershell
.\commands\01-start-kafka.ps1
```

Aguarde.

```powershell
.\commands\02-create-topic.ps1
.\commands\03-describe-topic.ps1
.\commands\04-produce-records.ps1
```

Consuma e valide replay.

Depois:

```powershell
.\commands\06-stop-kafka.ps1
```

---

## Entendendo o que foi feito

### Kafka foi iniciado sem ZooKeeper

O laboratório utilizou KRaft.

### O broker recebeu um topic explícito

Nome, partition count e replication factor foram definidos.

### Records foram anexados ao log

Cada linha publicada virou um record.

### O consumer leu sem remover

Uma segunda execução recuperou os mesmos dados.

### Replay foi comprovado

`--from-beginning` iniciou a leitura no começo disponível.

### Key foi introduzida

Alguns records passaram a possuir identificador de agrupamento.

### Metadata ficou visível

Topic, partition, offset e timestamp apareceram na saída.

### Retenção foi diferenciada de consumo

O record permanece conforme a política do topic, não conforme a primeira leitura.

### A limitação do ambiente ficou clara

Um broker e replication factor `1` não oferecem alta disponibilidade.

### A integração Java foi adiada corretamente

Spring Kafka permanece para a aula 481.

---

## Erros comuns importantes

### Tratar Kafka como uma queue comum

Isso esconde retenção, posição e replay.

### Acreditar que consumir apaga

Records permanecem pelo período de retenção.

### Usar latest

O ambiente muda sem alteração do curso.

### Instalar ZooKeeper

A baseline Kafka 4 utiliza KRaft.

### Chamar um broker de alta disponibilidade

Não existe réplica em outro servidor.

### Usar replication factor maior que brokers disponíveis

A criação do topic falha.

### Criar topic por entidade

A quantidade de topics cresce sem governança.

### Colocar dados reais no console producer

O laboratório não possui segurança produtiva.

### Confundir key Kafka com routing key RabbitMQ

São conceitos diferentes.

### Tratar offset como ID global

Ele pertence a uma partition.

### Achar que replay sempre é seguro

Efeitos colaterais podem ser repetidos.

### Alterar retenção para segundos

Records desaparecem antes da validação.

### Usar UI sem aprender CLI

O diagnóstico fica dependente da ferramenta.

### Remover o container esperando persistência garantida

Sem volume externo, o lifecycle do filesystem precisa ser considerado.

---

## Comandos úteis

### Iniciar

```powershell
docker run `
  --name "m16-kafka" `
  --detach `
  --publish "9092:9092" `
  "apache/kafka:4.3.1"
```

### Criar topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --create `
  --topic "m16.orders.events.v1" `
  --partitions 1 `
  --replication-factor 1
```

### Descrever

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.events.v1"
```

### Consumir

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.events.v1" `
  --from-beginning
```

### Logs

```powershell
docker logs `
  "m16-kafka"
```

---

## Exercício guiado

### Parte 1 — Ambiente

Inicie Kafka 4.3.1.

### Parte 2 — Topic

Crie `m16.orders.events.v1`.

### Parte 3 — Records

Produza três JSONs sem key.

### Parte 4 — Replay

Consuma duas vezes desde o início.

### Parte 5 — Key

Produza dois records com key.

### Parte 6 — Metadata

Exiba topic, partition, offset e timestamp.

### Parte 7 — Retenção

Consulte configurações efetivas.

### Parte 8 — Restart

Pare, reinicie e leia novamente.

### Parte 9 — Segurança

Confirme uso apenas local e sintético.

### Parte 10 — Registro

Atualize README e diário.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 478 foi preservada;
- Kafka foi apresentado como event streaming;
- Kafka não foi tratado como RabbitMQ melhor;
- broker foi explicado;
- cluster foi explicado;
- controller foi contextualizado;
- KRaft foi explicado em nível inicial;
- ZooKeeper não foi instalado;
- imagem oficial foi usada;
- versão `4.3.1` foi fixada;
- tag latest não foi usada;
- um broker local foi criado;
- porta 9092 foi publicada;
- logs foram inspecionados;
- ferramentas oficiais foram localizadas;
- quorum KRaft foi consultado;
- topic foi criado explicitamente;
- nome do topic segue a convenção;
- partition count ficou em um;
- replication factor ficou em um;
- limitação de alta disponibilidade foi registrada;
- topic foi listado;
- topic foi descrito;
- leader foi observado;
- replicas foram observadas;
- ISR foi observada;
- records sem key foram produzidos;
- records foram consumidos;
- segunda leitura recuperou os mesmos records;
- consumo foi diferenciado de remoção;
- replay foi comprovado;
- records com key foram produzidos;
- key foi exibida;
- key foi diferenciada de routing key;
- topic foi exibido;
- partition foi exibida;
- offset foi exibido;
- timestamp foi exibido;
- partition não foi aprofundada;
- offset não foi aprofundado;
- consumer groups não foram aprofundados;
- retenção foi explicada;
- cleanup policy foi consultada;
- retenção foi diferenciada de backup;
- auto topic creation não virou contrato;
- scripts foram criados;
- README do laboratório foi criado;
- dados sintéticos foram usados;
- segurança produtiva não foi simulada;
- UI de terceiros não foi instalada;
- Spring Kafka não foi antecipado;
- KafkaTemplate não foi antecipado;
- `@KafkaListener` não foi antecipado;
- Kafka Connect não foi antecipado;
- Kafka Streams não foi antecipado;
- Schema Registry não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 480 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure versões e dados indevidos:

```powershell
git grep `
  -n `
  -E `
  "apache/kafka|latest|9092|m16\\.orders\\.events\\.v1|CPF|password|token"
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
git commit -m "feat(m16): introduzir fundamentos do Apache Kafka"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- dados reais;
- logs do broker;
- arquivos de storage;
- imagem exportada;
- secrets;
- screenshots temporários;
- topic com nome experimental;
- configuração produtiva inventada;
- dependência Spring Kafka antecipada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou o Apache Kafka e trabalhou com seu modelo fundamental.

O fluxo ficou:

```text
producer;

topic;

record;

append;

log retido;

consumer;

leitura;

replay.
```

Você comprovou que:

- Kafka 4 opera em KRaft;
- ZooKeeper não pertence à baseline;
- broker é um servidor do cluster;
- topic organiza records;
- record pode possuir key e value;
- o consumer lê sem remover;
- retenção controla disponibilidade temporal;
- replay reutiliza records retidos;
- partition contém um log ordenado;
- offset identifica posição dentro da partition;
- um broker local não oferece alta disponibilidade;
- Kafka e RabbitMQ respondem a modelos diferentes;
- infraestrutura explícita é melhor que topic criado por acidente.

A próxima aula será:

```text
480 - M16.25 - Topics partitions offsets
```

Nela, você irá:

- criar topic com múltiplas partitions;
- compreender distribuição de records;
- analisar efeito da key;
- estudar ordenação por partition;
- compreender offsets em profundidade;
- criar consumer groups;
- observar divisão de partitions;
- medir lag;
- resetar offsets com segurança no laboratório;
- diferenciar replay individual e replay de grupo;
- preparar consumers e producers Spring.

Nada disso foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Iniciei Kafka 4.3.1 em KRaft.
- [ ] Criei e descrevi um topic.
- [ ] Produzi records com e sem key.
- [ ] Consumi e executei replay.
- [ ] Observei partition, offset e timestamp.
- [ ] Registrei retenção e limitações.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Container encerra

Leia:

```powershell
docker logs m16-kafka
```

Confirme memória, porta e imagem correta.

### Porta 9092 ocupada

Descubra o processo ou container que já publica a porta.

Não altere comandos aleatoriamente sem revisar advertised listeners.

### Topic já existe

Use `--if-not-exists` no script repetível ou apenas descreva o topic existente.

### Replication factor inválido

Com um broker, utilize `1`.

### Consumer não mostra dados

Confirme:

- topic correto;
- `--from-beginning`;
- records produzidos;
- broker ativo;
- bootstrap server.

### Producer interativo parece travado

Ele aguarda linhas no stdin.

Digite o record e pressione Enter.

### Key aparece null

O record foi produzido sem `parse.key=true` ou antes do laboratório com key.

### Replay não mostra tudo

Records podem não estar mais retidos ou o comando não começou do início.

### docker exec falha após stop

O container precisa estar em execução.

### Dados somem após remover container

A baseline não configurou volume externo.

Restart e recriação são operações diferentes.

---

## Perguntas de revisão

1. O que é Kafka?
2. O que é broker?
3. O que é cluster?
4. O que é KRaft?
5. ZooKeeper foi usado?
6. O que é topic?
7. O que é record?
8. Quais partes um record pode possuir?
9. O que é log?
10. Consumir remove o record?
11. O que é retenção?
12. Retenção é backup?
13. O que é key?
14. Key é routing key?
15. O que é partition?
16. O que é offset?
17. Offset é global?
18. O que é replay?
19. Spring Kafka foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Plataforma distribuída de event streaming.
2. Servidor Kafka.
3. Conjunto de servidores Kafka.
4. Arquitetura de metadata do Kafka.
5. Não.
6. Categoria lógica de records.
7. Evento armazenado no Kafka.
8. Key, value, timestamp e headers.
9. Sequência de records anexados.
10. Não.
11. Política de permanência dos records.
12. Não.
13. Identificador opcional usado pelo producer.
14. Não.
15. Log ordenado dentro do topic.
16. Posição dentro da partition.
17. Não.
18. Nova leitura de records retidos.
19. Não.
20. Topics partitions offsets.

---

## Desafio opcional

Crie um segundo topic:

```text
m16.customers.events.v1.
```

Requisitos:

- uma partition;
- replication factor `1`;
- três records `customers.created.v1`;
- keys com customerId;
- consumo desde o início;
- exibição de key, topic, partition e offset;
- consulta de retenção;
- script separado;
- nenhum consumer group explícito;
- nenhuma integração Java;
- nenhuma alteração no topic de orders.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 479 - M16.24 - Kafka fundamentos

- Concluí a sequência introdutória de RabbitMQ.
- Iniciei o estudo do Apache Kafka.
- Diferenciei distribuição por queue e log retido.
- Entendi Kafka como plataforma de event streaming.
- Diferenciei broker, cluster e controller.
- Entendi KRaft em nível inicial.
- Não utilizei ZooKeeper.
- Fixei a imagem oficial `apache/kafka:4.3.1`.
- Não usei `latest`.
- Iniciei um broker local na porta 9092.
- Inspecionei os logs.
- Localizei as ferramentas CLI oficiais.
- Consultei o quorum de metadata.
- Criei o topic `m16.orders.events.v1`.
- Usei uma partition.
- Usei replication factor `1`.
- Registrei que o laboratório não possui alta disponibilidade.
- Listei e descrevi o topic.
- Observei leader, replicas e ISR.
- Produzi records JSON sem key.
- Consumi records desde o início.
- Comprovei que consumir não remove.
- Executei replay dos mesmos records.
- Produzi records com key.
- Diferenciei key Kafka de routing key RabbitMQ.
- Exibi topic, partition, offset e timestamp.
- Entendi partition e offset em nível inicial.
- Consultei configurações de retenção.
- Diferenciei retenção de backup.
- Parei e reiniciei o broker.
- Validei leitura após restart.
- Criei scripts PowerShell do laboratório.
- Documentei versão, porta, topic e limitações.
- Usei somente dados sintéticos.
- Não instalei UI de terceiros.
- Não antecipei Spring Kafka, Kafka Connect ou Kafka Streams.
- Próxima aula: Topics partitions offsets.
```

---

## Referência técnica curta

- Apache Kafka — Quickstart.
- Apache Kafka — Introduction.
- Apache Kafka — Docker Image.
- Apache Kafka — Topic Operations.
- Apache Kafka — Console Producer.
- Apache Kafka — Console Consumer.
- Apache Kafka — KRaft.
- Apache Kafka — Topic Configurations.
- Apache Kafka — Design.
- Spring Boot — Apache Kafka Support.

Regra final:

```text
Apache Kafka organiza eventos como records anexados a logs particionados e retidos: producers publicam em topics, brokers armazenam os records, consumers leem por posição e a leitura não remove o dado; retenção controla por quanto tempo o histórico permanece disponível e permite replay controlado; KRaft mantém a metadata sem ZooKeeper; key, partition e offset participam do posicionamento e da leitura, mas serão aprofundados na próxima aula; nesta baseline, a imagem oficial apache/kafka:4.3.1 executa um broker local, o topic m16.orders.events.v1 recebe records sintéticos e as ferramentas CLI comprovam produção, consumo, metadata e replay sem antecipar Spring Kafka ou arquitetura produtiva.
```
