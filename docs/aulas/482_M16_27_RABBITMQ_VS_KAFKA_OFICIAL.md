# 482 - M16.27 - RabbitMQ vs Kafka

## Apresentação da aula

Nas aulas 475 a 478, você construiu um laboratório completo com RabbitMQ.

O fluxo passou por:

```text
fundamentos;

exchange;

queue;

binding;

producer;

consumer;

acknowledgement;

retry;

backoff;

dead-letter exchange;

dead-letter queue.
```

Nas aulas 479 a 481, você construiu um laboratório completo com Kafka.

O fluxo passou por:

```text
broker;

topic;

partition;

key;

offset;

consumer group;

lag;

reset;

replay;

KafkaTemplate;

@KafkaListener.
```

Agora existe conhecimento suficiente para responder uma pergunta arquitetural que aparece com frequência em projetos backend:

```text
quando usar RabbitMQ
e quando usar Kafka?
```

Essa pergunta costuma receber respostas ruins.

Exemplos:

```text
Kafka é sempre mais escalável;

RabbitMQ é mais simples;

Kafka substitui fila;

RabbitMQ não serve para eventos;

Kafka é banco de dados;

Kafka é sempre melhor para microsserviços.
```

Nenhuma dessas frases, isoladamente, é uma regra confiável.

RabbitMQ e Kafka resolvem problemas de mensageria, mas partem de modelos diferentes.

RabbitMQ foi utilizado no curso como um broker orientado a:

```text
entrega;

roteamento;

queues;

distribuição de trabalho;

acknowledgement;

retry;

dead-lettering.
```

Kafka foi utilizado como uma plataforma orientada a:

```text
log distribuído;

retenção;

partitions;

consumer groups;

offsets;

replay;

fluxo contínuo de eventos.
```

A pergunta central desta aula será:

```text
como escolher entre RabbitMQ e Kafka
a partir do problema real,

sem usar moda, preferência pessoal
ou comparação superficial?
```

A resposta será construída por meio de:

```text
modelo mental;

semântica de armazenamento;

roteamento;

ordenação;

replay;

paralelismo;

falhas;

retenção;

operações;

custos;

governança;

casos de uso;

anti-casos;

uso combinado;

ADR.
```

A aula não implementará uma nova ferramenta.

O objetivo é consolidar os laboratórios anteriores e transformar conhecimento técnico em decisão arquitetural justificável.

Ao final, você deverá ser capaz de defender uma escolha diante de um time técnico, arquiteto, product owner, SRE ou gestor.

Você deverá explicar:

```text
qual problema está sendo resolvido;

qual comportamento é obrigatório;

qual tecnologia atende melhor;

quais riscos permanecem;

quais compensações foram aceitas;

qual seria o plano de validação.
```

A aula utilizará cinco cenários principais:

```text
1. processamento de envio de e-mail;

2. integração de faturamento;

3. histórico de eventos de pedidos;

4. reconstrução de projeções;

5. distribuição de tarefas assíncronas.
```

Também haverá um cenário em que a melhor resposta será:

```text
usar RabbitMQ e Kafka juntos.
```

A aula não antecipará:

- modelagem completa de eventos de domínio;
- schema evolution;
- Schema Registry;
- poison message em Kafka;
- deduplicação;
- outbox;
- inbox;
- saga;
- CDC;
- projeto final de mensageria.

Esses assuntos continuam nas aulas seguintes.

A próxima aula será:

```text
483 - M16.28 - Eventos de domínio
```

Por isso, nesta aula os exemplos de evento serão utilizados apenas como objetos de decisão arquitetural. A modelagem rigorosa de evento de domínio ainda não será implementada.

---

## Onde estamos na formação

A sequência oficial é:

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

483:
Eventos de domínio.

484:
Schema evolution.
```

A aula 481 respondeu:

```text
como integrar uma aplicação Spring Boot
com producers e consumers Kafka?
```

A aula 482 responderá:

```text
como escolher conscientemente
entre RabbitMQ e Kafka?
```

Nesta aula:

```text
comparação arquitetural:
sim.

matriz de decisão:
sim.

cenários:
sim.

trade-offs:
sim.

ADR:
sim.

uso combinado:
sim.

novo código de broker:
não.

novo consumer:
não.

novo producer:
não.

eventos de domínio profundos:
não.

schema evolution:
não.

outbox:
não.

saga:
não.
```

A regra central será:

```text
a tecnologia deve ser escolhida
pela semântica exigida pelo sistema,

não pela popularidade
nem pela familiaridade do time.
```

---

## Objetivo prático

Ao final, você terá:

```text
docs/architecture/messaging
├── ADR-001-rabbitmq-vs-kafka.md
├── MESSAGING_DECISION_MATRIX.md
├── MESSAGING_SCENARIOS.md
└── MESSAGING_VALIDATION_CHECKLIST.md
```

Você irá:

1. revisar os dois modelos;
2. comparar queue e log;
3. comparar exchange e topic;
4. comparar binding e partitioning;
5. comparar ack e offset commit;
6. comparar DLQ e replay;
7. comparar concorrência;
8. comparar ordenação;
9. comparar retenção;
10. comparar topologia;
11. comparar operação;
12. comparar custos;
13. identificar requisitos decisivos;
14. classificar cenários;
15. escolher RabbitMQ;
16. escolher Kafka;
17. escolher ambos;
18. registrar riscos;
19. criar uma matriz de decisão;
20. criar um ADR;
21. criar critérios de validação;
22. revisar erros comuns;
23. commitar;
24. preparar eventos de domínio.

---

## Conceito essencial

### A comparação começa pelo modelo

RabbitMQ e Kafka podem transportar dados entre sistemas, mas não devem ser reduzidos a:

```text
duas formas de fila.
```

O modelo predominante do RabbitMQ é:

```text
mensagem publicada;

exchange roteia;

queue recebe;

consumer processa;

ack confirma;

mensagem deixa o fluxo ativo.
```

O modelo predominante do Kafka é:

```text
record publicado;

topic recebe;

partition armazena;

consumer lê;

offset avança;

record permanece pela retenção.
```

Essa diferença altera:

- replay;
- retenção;
- independência entre consumidores;
- operação;
- troubleshooting;
- escalabilidade;
- governança;
- custo;
- forma de pensar o contrato.

---

### Queue versus log

No RabbitMQ, a queue representa um destino de consumo.

Exemplo:

```text
m16.fulfillment.orders-created.v1
```

Ela pertence a uma capacidade.

Quando a mensagem é confirmada, ela deixa de estar disponível na queue principal.

No Kafka, o topic representa uma categoria de records retidos.

Exemplo:

```text
m16.orders.partitioned.v1
```

Consumers diferentes mantêm offsets independentes sobre o mesmo log.

Pergunta decisiva:

```text
o dado precisa existir
apenas até ser processado

ou precisa permanecer disponível
para outras leituras?
```

Se o objetivo principal é executar trabalho uma vez, RabbitMQ pode ser mais natural.

Se o objetivo inclui histórico, replay e múltiplas leituras, Kafka tende a ser mais natural.

---

### Exchange versus topic

Exchange RabbitMQ:

```text
recebe uma publicação;

aplica bindings;

decide destinos;

não armazena.
```

Topic Kafka:

```text
recebe records;

organiza partitions;

armazena por retenção;

serve múltiplos consumer groups.
```

RabbitMQ separa roteamento e armazenamento:

```text
exchange:
roteia.

queue:
armazena.
```

Kafka concentra a categoria lógica e o armazenamento no topic particionado.

---

### Binding versus partitioning

Binding RabbitMQ responde:

```text
para qual queue
esta mensagem deve ir?
```

Partitioning Kafka responde:

```text
em qual partition
este record será anexado?
```

Binding seleciona destinos.

Partitioning seleciona localização dentro do log.

Uma key Kafka não é equivalente a uma routing key RabbitMQ.

```text
routing key:
participa do roteamento entre exchange e queues.

key Kafka:
participa da escolha de partition
e do agrupamento lógico.
```

---

### Acknowledgement versus offset commit

No RabbitMQ:

```text
ack:
confirma uma entrega.
```

No Kafka:

```text
commit:
registra progresso do consumer group.
```

A diferença é importante.

No RabbitMQ, a mensagem confirmada deixa a queue ativa.

No Kafka, o record continua no topic. O commit apenas registra que o grupo avançou.

Pergunta decisiva:

```text
o sistema precisa controlar
entregas individuais

ou posições de leitura
em um histórico?
```

---

### DLQ versus replay

RabbitMQ utiliza com frequência:

```text
retry;

reject;

DLX;

DLQ.
```

A mensagem problemática é isolada em outra queue.

Kafka utiliza com frequência:

```text
offsets;

replay;

retry topic;

dead-letter topic;

reprocessamento.
```

Nesta formação, retry topic e DLT ainda não foram implementados.

Mesmo assim, o modelo de retenção já permite reler records.

Replay não substitui DLQ.

Um record inválido pode falhar novamente em todos os replays.

DLQ ou DLT continua útil para isolar falhas específicas.

---

### Retenção

RabbitMQ normalmente mantém a mensagem até:

- consumo confirmado;
- expiração;
- remoção;
- limite;
- dead lettering.

Kafka mantém records conforme:

- tempo;
- tamanho;
- compactação;
- política do topic.

Pergunta decisiva:

```text
qual é o lifecycle do dado?
```

Exemplo:

```text
tarefa de envio de e-mail:
até processar.

histórico de mudanças de pedido:
dias, meses ou anos.
```

Esses lifecycles apontam para modelos diferentes.

---

### Replay

RabbitMQ não oferece replay de uma queue consumida como parte natural do modelo tradicional.

É possível criar cópias, auditoria, shovel, stream, armazenamento externo ou republicação, mas isso exige desenho adicional.

Kafka mantém replay como parte central do modelo.

Pergunta decisiva:

```text
um novo consumer
precisará ler eventos antigos?
```

Se sim, Kafka possui vantagem natural.

---

### Competing consumers

RabbitMQ:

```text
vários consumers
na mesma queue
dividem mensagens.
```

Kafka:

```text
vários consumers
no mesmo group
dividem partitions.
```

Diferença:

```text
RabbitMQ:
paralelismo pode crescer
com consumers e prefetch.

Kafka:
paralelismo do group
é limitado pelas partitions.
```

Adicionar dez consumers em um topic com três partitions não cria dez workers ativos para aquele group.

---

### Ordenação

RabbitMQ pode preservar ordem dentro de uma queue sob condições controladas, mas concorrência, redelivery, prioridade e múltiplos consumers podem alterar a ordem observada.

Kafka garante ordem dentro da partition.

A key permite agrupar eventos relacionados.

Pergunta decisiva:

```text
qual é a unidade de ordem?
```

Exemplos:

```text
todos os eventos do sistema:
ordem global quase nunca é necessária.

todos os eventos de um pedido:
ordem por orderId pode ser necessária.
```

Kafka oferece uma estratégia clara por key e partition.

RabbitMQ pode exigir uma queue ou estratégia de serialização específica.

---

### Roteamento

RabbitMQ possui recursos ricos de roteamento:

```text
direct;

fanout;

topic;

headers;

bindings.
```

Kafka utiliza principalmente:

```text
topic;

key;

partition;

consumer subscription.
```

Para roteamento dinâmico e distribuição baseada em regras, RabbitMQ costuma ser mais expressivo.

Para categorias de evento estáveis e consumo por grupos, Kafka costuma ser mais natural.

---

### Latência

Os dois podem operar com baixa latência.

A escolha não deve ser feita apenas por uma frase como:

```text
RabbitMQ é baixa latência;

Kafka é throughput.
```

A latência real depende de:

- durability;
- acknowledgements;
- batching;
- compression;
- rede;
- storage;
- replicas;
- consumer settings;
- carga;
- payload;
- infraestrutura.

Use medição no cenário real.

---

### Throughput

Kafka foi projetado para alto throughput de logs particionados e leitura sequencial.

RabbitMQ também suporta cargas elevadas, mas sua arquitetura, roteamento, acknowledgements e queue lifecycle possuem características diferentes.

Não compare benchmarks de fornecedores sem:

- mesmo hardware;
- mesma durabilidade;
- mesma replicação;
- mesmo tamanho de payload;
- mesma confirmação;
- mesma retenção;
- mesma quantidade de consumers.

---

### Operação

RabbitMQ exige operar:

- nodes;
- queues;
- exchanges;
- bindings;
- memory alarms;
- disk alarms;
- consumers;
- unacked;
- DLQs;
- policies;
- quorum queues quando aplicável.

Kafka exige operar:

- brokers;
- controllers;
- topics;
- partitions;
- replicas;
- ISR;
- consumer groups;
- lag;
- storage;
- retention;
- rebalances;
- partition count.

Kafka tende a exigir forte disciplina de capacity planning e governança de topics.

RabbitMQ exige forte disciplina de topology ownership e queue lifecycle.

---

### Custo de armazenamento

RabbitMQ normalmente não é escolhido para manter um histórico extenso de todas as mensagens processadas em queues tradicionais.

Kafka foi desenhado para retenção de logs, mas isso tem custo.

Mais retenção significa:

- mais disco;
- mais replicação;
- mais tempo de recuperação;
- mais governança;
- mais capacidade de replay;
- maior exposição de dados.

Retenção precisa ser justificada.

---

### Múltiplos consumidores independentes

RabbitMQ:

```text
cada capacidade independente
precisa de sua própria queue.
```

Kafka:

```text
cada capacidade independente
precisa de seu próprio group id.
```

No RabbitMQ, isso cria cópias físicas nas queues.

No Kafka, os grupos leem o mesmo log retido.

Para muitos consumidores independentes e histórico compartilhado, Kafka pode ser mais eficiente conceitualmente.

---

### Semântica de trabalho

RabbitMQ é muito natural para comandos e tarefas:

```text
enviar e-mail;

gerar PDF;

processar imagem;

executar job;

chamar integração;

reservar recurso.
```

Kafka é natural para fatos e streams:

```text
pedido criado;

pagamento autorizado;

estoque alterado;

cliente atualizado;

telemetria recebida.
```

Essa divisão não é absoluta.

O importante é distinguir:

```text
faça algo
```

de:

```text
algo aconteceu.
```

A modelagem rigorosa será aprofundada na aula 483.

---

### Uso combinado

Uma arquitetura pode utilizar ambos.

Exemplo:

```text
Kafka:
mantém o histórico de order events.

consumer:
detecta necessidade de envio.

RabbitMQ:
distribui tarefas de envio de e-mail.

workers:
processam e confirmam.
```

Outro exemplo:

```text
RabbitMQ:
recebe comandos operacionais.

serviço:
executa e publica resultado.

Kafka:
registra eventos resultantes
para analytics e projeções.
```

Usar ambos aumenta:

- complexidade;
- operação;
- observabilidade;
- contratos;
- custo;
- necessidade de skills.

Só use ambos quando os dois modelos forem realmente necessários.

---

## Mão na massa guiada

### 1. Criar o diretório de arquitetura

Na raiz do repositório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/architecture/messaging" |
  Out-Null
```

---

### 2. Criar a matriz de decisão

Arquivo:

```text
docs/architecture/messaging/MESSAGING_DECISION_MATRIX.md
```

Estrutura:

```markdown
# Matriz de decisão de mensageria

| Critério | RabbitMQ | Kafka | Peso | Observação |
|---|---|---|---:|---|
| Distribuição de tarefas | Forte | Possível | 5 | |
| Roteamento complexo | Forte | Limitado | 4 | |
| Retenção longa | Limitado | Forte | 5 | |
| Replay | Exige desenho | Nativo | 5 | |
| Muitos consumers independentes | Uma queue por capacidade | Um group por capacidade | 4 | |
| Ordem por entidade | Exige desenho | Key + partition | 4 | |
| DLQ simples | Forte | Exige desenho adicional | 3 | |
| Operação atual do time | Avaliar | Avaliar | 5 | |
| Custo de storage | Menor para filas transitórias | Maior com retenção | 3 | |
| Auditoria histórica | Exige cópia | Natural com retenção | 4 | |
```

A tabela não deve decidir sozinha.

Ela organiza a conversa.

---

### 3. Definir perguntas obrigatórias

Adicione:

```markdown
## Perguntas obrigatórias

1. O dado é comando ou evento?
2. Precisa de replay?
3. Quanto tempo precisa permanecer disponível?
4. Quantos consumidores independentes existirão?
5. Existe roteamento por regras?
6. Qual é a unidade de ordem?
7. Qual volume esperado?
8. Qual latência aceitável?
9. Como falhas serão isoladas?
10. O time sabe operar a tecnologia?
11. Quais dados sensíveis serão retidos?
12. Qual custo operacional é aceitável?
```

---

### 4. Criar cenário 1: envio de e-mail

Arquivo:

```text
docs/architecture/messaging/MESSAGING_SCENARIOS.md
```

Adicione:

```markdown
## Cenário 1 — Envio assíncrono de e-mail

Requisitos:

- uma tarefa deve ser executada;
- múltiplos workers dividem trabalho;
- confirmação remove a tarefa ativa;
- retry limitado;
- DLQ;
- replay histórico não é requisito;
- roteamento por tipo de e-mail.

Decisão sugerida:

RabbitMQ.
```

Justificativa:

```text
queue representa trabalho;

competing consumers;

ack;

retry;

DLQ;

roteamento.
```

---

### 5. Criar cenário 2: histórico de pedidos

```markdown
## Cenário 2 — Histórico de eventos de pedidos

Requisitos:

- eventos permanecem por 180 dias;
- projeções podem ser reconstruídas;
- analytics entra depois;
- auditoria lê o mesmo histórico;
- ordem por orderId;
- alto volume contínuo.

Decisão sugerida:

Kafka.
```

Justificativa:

```text
retention;

replay;

consumer groups;

key por orderId;

partitions;

novos consumers.
```

---

### 6. Criar cenário 3: integração de faturamento

```markdown
## Cenário 3 — Solicitação de faturamento

Requisitos:

- cada solicitação deve ser processada;
- não existe replay histórico;
- falha deve ir para DLQ;
- apenas um sistema executa;
- baixa taxa;
- operação simples.

Decisão sugerida:

RabbitMQ.
```

Registre que Kafka seria possível, mas adicionaria um modelo de log e offsets sem benefício claro.

---

### 7. Criar cenário 4: telemetria

```markdown
## Cenário 4 — Telemetria de dispositivos

Requisitos:

- milhões de eventos;
- retenção;
- processamento em tempo real;
- múltiplos consumers;
- analytics;
- detecção de anomalias;
- replay.

Decisão sugerida:

Kafka.
```

---

### 8. Criar cenário 5: notificação e histórico

```markdown
## Cenário 5 — Pedido criado com notificação

Requisitos:

- manter histórico do evento;
- reconstruir projeções;
- acionar envio de e-mail;
- workers de e-mail;
- retry e DLQ do envio;
- analytics futuro.

Decisão sugerida:

Kafka + RabbitMQ.
```

Fluxo:

```text
order service
   |
   v
Kafka order events
   |
   +--> projection group
   |
   +--> analytics group
   |
   +--> notification dispatcher
            |
            v
       RabbitMQ email queue
            |
            v
       email workers
```

---

### 9. Criar cenário 6: processamento simples

```markdown
## Cenário 6 — Geração de relatórios sob demanda

Requisitos:

- usuário solicita;
- um worker gera;
- resultado é armazenado;
- tarefa não precisa ficar 90 dias;
- retry e DLQ;
- prioridade futura.

Decisão sugerida:

RabbitMQ.
```

---

### 10. Criar cenário 7: reconstrução de projeção

```markdown
## Cenário 7 — Reconstrução de saldo por eventos

Requisitos:

- histórico completo;
- leitura desde o início;
- versão de projeção nova;
- group id novo;
- ordem por conta;
- retenção longa.

Decisão sugerida:

Kafka.
```

---

### 11. Criar anti-cenários

Adicione:

```markdown
## Anti-cenários

### Kafka para uma única tarefa simples

Evitar quando:

- baixo volume;
- nenhum replay;
- nenhum histórico;
- um consumer;
- equipe sem operação Kafka.

### RabbitMQ como histórico corporativo

Evitar quando:

- anos de retenção;
- dezenas de consumers históricos;
- replay recorrente;
- reconstrução de projeções;
- analytics sobre o mesmo fluxo.
```

---

### 12. Criar o ADR

Arquivo:

```text
docs/architecture/messaging/ADR-001-rabbitmq-vs-kafka.md
```

Conteúdo base:

```markdown
# ADR-001 — Escolha de mensageria

## Status

Proposto.

## Contexto

Descrever o problema real.

## Requisitos decisivos

- retenção;
- replay;
- roteamento;
- ordenação;
- consumidores;
- volume;
- falhas;
- operação.

## Opções consideradas

### RabbitMQ

Vantagens.

Riscos.

### Kafka

Vantagens.

Riscos.

### Ambos

Vantagens.

Riscos.

## Decisão

Registrar a escolha.

## Consequências positivas

Registrar.

## Consequências negativas

Registrar.

## Plano de validação

Registrar testes e métricas.
```

---

### 13. Preencher o ADR para o cenário 5

Contexto:

```text
pedido criado precisa alimentar
projeções, analytics e envio de e-mail.
```

Decisão:

```text
Kafka:
fonte de eventos retidos.

RabbitMQ:
fila de trabalho de notificação.
```

Consequências positivas:

- replay de pedidos;
- grupos independentes;
- workers simples;
- DLQ de e-mail;
- escalabilidade separada.

Consequências negativas:

- duas plataformas;
- dois modelos de observabilidade;
- ponte entre Kafka e RabbitMQ;
- risco de publicação parcial;
- necessidade futura de outbox;
- maior custo operacional.

Não implemente outbox nesta aula.

Apenas registre que o risco existe.

---

### 14. Criar checklist de validação

Arquivo:

```text
docs/architecture/messaging/MESSAGING_VALIDATION_CHECKLIST.md
```

Conteúdo:

```markdown
# Checklist de validação de mensageria

## Funcional

- [ ] O producer publica o contrato correto.
- [ ] O consumer processa o caso de sucesso.
- [ ] Consumers independentes recebem o necessário.
- [ ] A ordem exigida foi validada.
- [ ] Replay foi testado quando aplicável.

## Falhas

- [ ] Broker indisponível.
- [ ] Consumer indisponível.
- [ ] Mensagem inválida.
- [ ] Retry limitado.
- [ ] DLQ ou DLT.
- [ ] Redelivery.
- [ ] Reprocessamento.

## Operação

- [ ] Métricas.
- [ ] Alertas.
- [ ] Ownership.
- [ ] Runbook.
- [ ] Retenção.
- [ ] Capacity planning.
- [ ] Segurança.
- [ ] Custo.

## Evolução

- [ ] Versionamento.
- [ ] Compatibilidade.
- [ ] Schema evolution.
- [ ] Novos consumers.
- [ ] Migração.
```

---

### 15. Aplicar uma pontuação

Para cada cenário, atribua notas de `1` a `5`.

Exemplo para histórico de pedidos:

```text
retenção:
peso 5.

replay:
peso 5.

múltiplos consumers:
peso 4.

roteamento complexo:
peso 2.

DLQ simples:
peso 2.
```

Calcule:

```text
nota da opção x peso.
```

Não transforme o resultado numérico em decisão automática.

A pontuação torna premissas explícitas.

---

### 16. Registrar riscos não funcionais

Para RabbitMQ:

- crescimento de queues;
- mensagens Unacked;
- DLQ acumulada;
- indisponibilidade do cluster;
- roteamento incorreto;
- consumers lentos;
- memória;
- disco;
- quorum;
- política de retry.

Para Kafka:

- crescimento de partitions;
- lag;
- rebalances;
- retenção insuficiente;
- storage;
- keys desbalanceadas;
- grupos abandonados;
- schema incompatível;
- replay perigoso;
- replication factor.

---

### 17. Comparar observabilidade

RabbitMQ:

```text
queue depth;

Ready;

Unacked;

consumer count;

publish rate;

deliver rate;

ack rate;

redelivery;

DLQ depth.
```

Kafka:

```text
producer errors;

request latency;

consumer lag;

records consumed;

rebalance;

partition count;

under-replicated partitions;

ISR;

storage;

retention.
```

Registre que:

```text
queue depth
não é equivalente direto
a consumer lag.
```

Ambos representam backlog, mas em modelos diferentes.

---

### 18. Comparar segurança

RabbitMQ:

- virtual hosts;
- users;
- permissions;
- TLS;
- exchange e queue permissions;
- policies.

Kafka:

- TLS;
- SASL;
- ACLs;
- topic permissions;
- group permissions;
- cluster actions.

A baseline local não configurou segurança produtiva em nenhuma ferramenta.

Não use o laboratório como modelo de exposição.

---

### 19. Comparar governança

RabbitMQ:

```text
quem cria exchange;

quem cria queue;

quem cria binding;

quem é owner da queue;

quem trata DLQ.
```

Kafka:

```text
quem cria topic;

quantas partitions;

qual retenção;

qual key;

quais groups;

quem monitora lag;

quem aprova replay.
```

Sem ownership, qualquer tecnologia degrada.

---

### 20. Criar decisão resumida

Adicione à matriz:

```markdown
## Regra resumida

Escolha RabbitMQ quando o problema central for:

- entrega;
- roteamento;
- distribuição de tarefas;
- acknowledgement;
- retry e DLQ;
- lifecycle curto.

Escolha Kafka quando o problema central for:

- log de eventos;
- retenção;
- replay;
- múltiplos grupos;
- alto volume contínuo;
- ordem por key;
- reconstrução.

Use ambos quando os dois modelos forem necessários
e o custo operacional for aceito.
```

---

## Entendendo o que foi feito

### A comparação deixou de ser superficial

Queue e log foram tratados como modelos diferentes.

### Requisitos passaram a dirigir a escolha

Retenção, replay, roteamento e ordenação ganharam prioridade.

### RabbitMQ ficou associado ao trabalho

Queues, ack, retry e DLQ formam uma solução natural para tarefas.

### Kafka ficou associado ao histórico

Topics, partitions, offsets e groups formam uma solução natural para streams retidos.

### O uso combinado foi justificado

Kafka mantém fatos; RabbitMQ distribui tarefas derivadas.

### O custo operacional ficou explícito

Duas tecnologias exigem duas operações.

### O ADR registrou a decisão

A escolha passou a ter contexto, alternativas e consequências.

### A matriz deixou premissas visíveis

Pesos ajudam a discutir prioridades.

### Observabilidade foi diferenciada

Queue depth e lag não foram tratados como a mesma métrica.

### A próxima etapa ficou preparada

Eventos de domínio poderão ser modelados sem confundir fatos e comandos.

---

## Erros comuns importantes

### Escolher pela popularidade

A tecnologia pode não atender à semântica necessária.

### Escolher apenas pelo throughput

Retenção, roteamento e operação podem ser mais importantes.

### Usar Kafka como fila simples

O sistema assume custo de log e offsets sem benefício.

### Usar RabbitMQ como histórico longo

Queues tradicionais não substituem um log retido.

### Usar o mesmo group para capacidades independentes

Consumers dividem records em vez de todos receberem.

### Usar a mesma queue para capacidades independentes

Consumers competem em vez de todos receberem.

### Confundir key e routing key

Elas resolvem problemas diferentes.

### Confundir ack e commit

Um confirma entrega; outro registra posição.

### Tratar replay como solução de erro

Replay pode repetir o mesmo defeito.

### Criar DLQ sem operação

Mensagens acumulam sem owner.

### Criar muitos topics ou queues sem governança

A plataforma fica difícil de operar.

### Usar ambos sem necessidade

Complexidade e custo dobram.

### Esquecer o time

Uma tecnologia correta no papel pode falhar por ausência de operação e conhecimento.

---

## Comandos úteis

### Criar diretório

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/architecture/messaging" |
  Out-Null
```

### Revisar documentos

```powershell
Get-ChildItem `
  "docs/architecture/messaging"
```

### Procurar decisões

```powershell
git grep `
  -n `
  -E `
  "RabbitMQ|Kafka|retenção|replay|DLQ|consumer group|ADR"
```

### Validar Markdown

```powershell
git diff --check
```

---

## Exercício guiado

### Parte 1 — Matriz

Crie os critérios e pesos.

### Parte 2 — Cenários

Classifique sete cenários.

### Parte 3 — RabbitMQ

Defenda uma escolha orientada a tarefas.

### Parte 4 — Kafka

Defenda uma escolha orientada a histórico.

### Parte 5 — Ambos

Defenda o cenário combinado.

### Parte 6 — Riscos

Registre riscos operacionais.

### Parte 7 — Observabilidade

Compare queue depth e lag.

### Parte 8 — ADR

Registre decisão e consequências.

### Parte 9 — Validação

Crie checklist funcional e operacional.

### Parte 10 — Defesa técnica

Apresente a decisão em cinco minutos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 481 foi preservada;
- RabbitMQ e Kafka foram comparados;
- a comparação começou pelo modelo;
- queue foi diferenciada de log;
- exchange foi diferenciado de topic;
- binding foi diferenciado de partitioning;
- routing key foi diferenciada de key Kafka;
- ack foi diferenciado de offset commit;
- DLQ foi diferenciada de replay;
- retenção foi comparada;
- replay foi comparado;
- competing consumers foram comparados;
- consumer groups foram comparados;
- paralelismo por partition foi explicado;
- ordenação por partition foi explicada;
- roteamento RabbitMQ foi explicado;
- múltiplos groups Kafka foram explicados;
- lifecycle curto foi associado a tarefas;
- retenção longa foi associada a eventos;
- throughput não foi usado isoladamente;
- latência não foi simplificada;
- benchmarks superficiais foram rejeitados;
- operação RabbitMQ foi registrada;
- operação Kafka foi registrada;
- custos de storage foram registrados;
- governança de queues foi registrada;
- governança de topics foi registrada;
- segurança foi contextualizada;
- observabilidade foi comparada;
- queue depth foi diferenciada de lag;
- cenário de e-mail escolheu RabbitMQ;
- cenário histórico escolheu Kafka;
- cenário telemetria escolheu Kafka;
- cenário faturamento escolheu RabbitMQ;
- cenário combinado utilizou ambos;
- custo de duas tecnologias foi registrado;
- anti-cenários foram criados;
- matriz de decisão foi criada;
- perguntas obrigatórias foram criadas;
- pesos foram usados;
- pontuação não virou decisão automática;
- ADR foi criado;
- alternativas foram registradas;
- consequências positivas foram registradas;
- consequências negativas foram registradas;
- plano de validação foi criado;
- checklist foi criado;
- ownership foi incluído;
- runbook foi incluído;
- retenção foi incluída;
- capacity planning foi incluído;
- replay seguro foi incluído;
- outbox não foi antecipado;
- eventos de domínio não foram aprofundados;
- schema evolution não foi antecipada;
- saga e CDC não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 483 está correta.

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
  docs/architecture/messaging `
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
git commit -m "docs(m16): comparar RabbitMQ e Kafka"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credenciais;
- dados reais;
- arquitetura corporativa confidencial;
- custos não validados;
- benchmark sem fonte;
- decisão sem contexto;
- código de outbox;
- implementação de saga;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou dois laboratórios de mensageria em uma decisão arquitetural.

A comparação ficou:

```text
RabbitMQ:

queue;

exchange;

binding;

ack;

retry;

DLQ;

trabalho;

roteamento.

Kafka:

topic;

partition;

key;

offset;

consumer group;

retention;

replay;

stream.
```

Você comprovou que:

- RabbitMQ é natural para distribuição de tarefas;
- Kafka é natural para logs de eventos retidos;
- RabbitMQ oferece roteamento expressivo;
- Kafka oferece replay e grupos independentes;
- queue depth e consumer lag são métricas diferentes;
- ack e commit resolvem problemas diferentes;
- key e routing key não são equivalentes;
- ordem precisa de uma unidade explícita;
- retenção aumenta capacidade e custo;
- DLQ exige operação;
- replay exige idempotência;
- usar ambos pode ser correto;
- usar ambos também aumenta complexidade;
- ADR e matriz tornam a decisão auditável.

A próxima aula será:

```text
483 - M16.28 - Eventos de domínio
```

Nela, você irá:

- diferenciar evento de domínio e evento de integração;
- diferenciar comando e evento;
- nomear eventos no passado;
- definir payload mínimo;
- evitar entidades anêmicas ou eventos gigantes;
- modelar versionamento;
- relacionar agregado e evento;
- registrar eventos durante transações;
- preparar schema evolution;
- preparar outbox pattern.

Nenhum desses pontos foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Comparei queue e log.
- [ ] Comparei ack e offset.
- [ ] Classifiquei os cenários.
- [ ] Criei a matriz.
- [ ] Criei o ADR.
- [ ] Registrei riscos e operação.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A matriz sempre aponta para a mesma ferramenta

Os pesos podem estar enviesados ou os requisitos incompletos.

### O time discute tecnologia sem cenário

Volte ao contexto e aos requisitos decisivos.

### Kafka parece vencer por replay

Confirme se replay é realmente necessário.

### RabbitMQ parece vencer por simplicidade

Confirme se histórico e novos consumers futuros foram ignorados.

### Ambos parecem necessários

Calcule o custo operacional e procure uma arquitetura mais simples antes de confirmar.

### ADR ficou genérico

Inclua números, retenção, volume, owners e riscos reais.

### Cenários misturam comando e evento

A aula 483 aprofundará essa distinção.

### Replay foi tratado como backup

Retenção Kafka não substitui estratégia de backup e recuperação.

### DLQ foi tratada como arquivo morto

Defina owner, alerta, retenção e procedimento.

### Pontuação virou verdade absoluta

Use a matriz como apoio à decisão, não como algoritmo final.

---

## Perguntas de revisão

1. Qual é o modelo predominante do RabbitMQ?
2. Qual é o modelo predominante do Kafka?
3. O que exchange faz?
4. O que topic faz?
5. Routing key é key Kafka?
6. O que ack confirma?
7. O que offset commit registra?
8. Consumir Kafka remove o record?
9. RabbitMQ possui replay natural de queue consumida?
10. O que limita consumers ativos em um group Kafka?
11. O que competing consumers fazem?
12. Quando RabbitMQ é natural?
13. Quando Kafka é natural?
14. Queue depth é igual a lag?
15. DLQ resolve a causa?
16. Replay é sempre seguro?
17. Quando usar ambos?
18. O que ADR registra?
19. Eventos de domínio foram modelados?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Entrega por queues.
2. Log retido por topics.
3. Roteia.
4. Armazena records particionados.
5. Não.
6. Entrega processada.
7. Progresso do group.
8. Não.
9. Não no modelo tradicional.
10. Quantidade de partitions.
11. Dividem mensagens da mesma queue.
12. Tarefas, roteamento, ack e DLQ.
13. Retenção, replay e múltiplos groups.
14. Não.
15. Não.
16. Não.
17. Quando os dois modelos são necessários.
18. Contexto, opções, decisão e consequências.
19. Não.
20. Eventos de domínio.

---

## Desafio opcional

Analise o cenário:

```text
plataforma de entregas
com eventos de rastreamento,
notificações e geração de relatórios.
```

Requisitos:

- tracking retido por 365 dias;
- reconstrução de timeline;
- analytics;
- envio de SMS;
- envio de e-mail;
- retry;
- DLQ;
- milhões de eventos;
- ordem por entrega;
- relatórios sob demanda.

Entregue:

- matriz;
- decisão;
- uso de RabbitMQ;
- uso de Kafka;
- fronteiras;
- riscos;
- ADR;
- plano de validação;
- sem implementar código.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 482 - M16.27 - RabbitMQ vs Kafka

- Consolidei os laboratórios de RabbitMQ e Kafka.
- Diferenciei queue e log.
- Diferenciei exchange e topic.
- Diferenciei binding e partitioning.
- Diferenciei routing key e key Kafka.
- Diferenciei acknowledgement e offset commit.
- Diferenciei DLQ e replay.
- Comparei retenção.
- Comparei ordenação.
- Comparei paralelismo.
- Comparei roteamento.
- Comparei operação.
- Comparei observabilidade.
- Diferenciei queue depth de consumer lag.
- Registrei custos de storage.
- Registrei riscos de governança.
- Entendi RabbitMQ como escolha natural para tarefas.
- Entendi Kafka como escolha natural para logs de eventos.
- Classifiquei cenários de e-mail, faturamento e relatórios.
- Classifiquei cenários de histórico, telemetria e projeções.
- Modelei um cenário com RabbitMQ e Kafka juntos.
- Registrei o custo operacional de duas tecnologias.
- Criei uma matriz de decisão.
- Criei perguntas obrigatórias.
- Usei pesos sem automatizar a decisão.
- Criei anti-cenários.
- Criei um ADR.
- Registrei alternativas.
- Registrei consequências positivas e negativas.
- Criei plano de validação.
- Criei checklist funcional, operacional e evolutivo.
- Não escolhi por moda ou benchmark isolado.
- Não antecipei eventos de domínio, schema evolution ou outbox.
- Próxima aula: Eventos de domínio.
```

---

## Referência técnica curta

- RabbitMQ — AMQP Concepts.
- RabbitMQ — Queues.
- RabbitMQ — Consumer Acknowledgements.
- RabbitMQ — Dead Letter Exchanges.
- Apache Kafka — Introduction.
- Apache Kafka — Design.
- Apache Kafka — Consumer Groups.
- Apache Kafka — Topic Configurations.
- Spring AMQP — Reference.
- Spring Kafka — Reference.
- Architecture Decision Records — conceito de ADR.

Regra final:

```text
RabbitMQ e Kafka devem ser escolhidos pela semântica do problema: RabbitMQ organiza entrega, roteamento, queues, acknowledgements, retry e DLQ, sendo natural para comandos, tarefas e distribuição de trabalho; Kafka organiza logs retidos, topics, partitions, keys, offsets, consumer groups e replay, sendo natural para eventos históricos, múltiplas leituras, projeções e alto volume contínuo; queue não é log, ack não é commit, routing key não é key Kafka e DLQ não é replay; uma arquitetura pode utilizar ambos quando precisa de histórico de eventos e filas de trabalho, mas deve aceitar o custo de duas plataformas; matriz, cenários, ADR, métricas, owners e plano de validação transformam preferência técnica em decisão arquitetural defensável.
```
