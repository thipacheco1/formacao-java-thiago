# 504 - M16.49 - Aula ensinavel integracoes

## Apresentação da aula

Você chegou ao momento de transformar conhecimento técnico em conhecimento ensinável.

Ao longo do Módulo 16, foram construídos e revisados temas como:

```text
HTTP;

contratos;

arquivos;

mensageria;

eventos;

Kafka;

Outbox;

Inbox;

idempotência;

retry;

timeout;

resiliência;

correlação;

monitoramento;

quarantine;

reprocessamento;

arquitetura modular.
```

Na aula 503, o projeto foi refatorado para ficar mais claro, testável e sustentável.

Agora o desafio muda.

A pergunta deixa de ser apenas:

```text
eu consigo implementar?
```

Ela passa a ser:

```text
eu consigo explicar
de forma clara,
progressiva,
demonstrável
e verificável?
```

Saber fazer não garante saber ensinar.

Uma explicação ruim pode:

- apresentar abstrações antes do problema;
- mostrar código sem contexto;
- misturar transporte e negócio;
- usar termos como at-least-once sem demonstrar duplicidade;
- falar de idempotência sem mostrar uma tentativa repetida;
- falar de timeout sem explicar ambiguidade;
- apresentar Outbox como receita mágica;
- mostrar métricas sem relacioná-las a uma decisão;
- transformar a aula em leitura de slides;
- esconder os trade-offs;
- sobrecarregar o aluno com detalhes simultâneos.

Uma aula ensinável precisa possuir:

```text
objetivo;

problema;

história;

sequência;

exemplo;

demonstração;

prática;

erro intencional;

pergunta;

evidência;

fechamento.
```

O objetivo desta aula será preparar uma aula técnica completa sobre integrações, capaz de ser apresentada para outra pessoa ou equipe.

A aula deverá explicar a jornada:

```text
requisição HTTP;

transação local;

Outbox;

Kafka;

Inbox;

worker;

provider HTTP;

retry;

idempotência;

quarantine;

observabilidade.
```

A narrativa principal será baseada em uma ordem de serviço.

Cenário:

```text
uma OS foi agendada;

o sistema precisa
notificar outro componente;

o processo não pode
perder o evento;

a mensagem pode repetir;

a chamada externa pode falhar;

a equipe precisa investigar.
```

A aula ensinável não começará com Kafka.

Ela começará com o problema.

A sequência pedagógica será:

```text
1. chamada direta;

2. risco de indisponibilidade;

3. evento assíncrono;

4. dual write;

5. Outbox;

6. redelivery;

7. Inbox;

8. efeito idempotente;

9. timeout ambíguo;

10. observabilidade;

11. decisão arquitetural.
```

Cada etapa responderá uma pergunta.

Exemplo:

```text
por que não chamar
o provider diretamente?

por que salvar o evento
na mesma transação?

por que a mensagem repete?

por que deduplicar?

por que repetir com a mesma key?

como saber onde parou?
```

A aula também diferenciará conceitos que frequentemente são confundidos:

```text
evento versus comando;

entrega versus efeito;

retry versus replay;

dead letter versus quarantine;

correlationId versus eventId;

consumer lag versus Inbox backlog;

monólito modular versus microsserviço.
```

O resultado será um kit de ensino em:

```text
docs/teaching/integrations
```

Com:

```text
LESSON_PLAN.md;

TEACHING_STORY.md;

WHITEBOARD_SCRIPT.md;

LIVE_DEMO_SCRIPT.md;

EXERCISES.md;

ASSESSMENT.md;

COMMON_MISCONCEPTIONS.md;

TEACHING_CHECKLIST.md.
```

A aula não criará uma nova feature no laboratório.

Ela utilizará o projeto existente como material didático.

A próxima aula será:

```text
505 - M16.50 - Fechamento do Modulo 16
```

Portanto, esta aula ensinará o conteúdo e preparará o encerramento oficial do módulo.

Ao final, você deverá ser capaz de:

- apresentar integrações em ordem pedagógica;
- explicar o problema antes da solução;
- demonstrar falhas intencionalmente;
- diferenciar garantias;
- conduzir uma prática;
- avaliar compreensão;
- adaptar profundidade ao público;
- responder perguntas comuns;
- fechar com trade-offs reais;
- preparar outra pessoa para aplicar o conhecimento.

---

## Onde estamos na formação

A sequência oficial é:

```text
502:
Prova pratica integracoes.

503:
Refatoracao final integracoes.

504:
Aula ensinavel integracoes.

505:
Fechamento do Modulo 16.
```

A prova prática respondeu:

```text
você consegue construir
uma integração confiável?
```

A refatoração respondeu:

```text
você consegue melhorar
a estrutura sem quebrar
o comportamento?
```

Esta aula responderá:

```text
você consegue transformar
esse conhecimento
em uma experiência de aprendizagem?
```

Nesta aula:

```text
plano de ensino:
sim.

narrativa:
sim.

diagramas:
sim.

demonstração:
sim.

prática:
sim.

perguntas:
sim.

avaliação:
sim.

misconceptions:
sim.

adaptação de público:
sim.

nova integração:
não.

novo padrão:
não.

mudança de contrato:
não.

fechamento do módulo:
não antecipado.
```

A regra central será:

```text
ensinar integrações
é mostrar problemas,
garantias,
falhas e decisões;

não apenas ferramentas.
```

---

## Objetivo prático

Ao final, você terá:

```text
docs/teaching/integrations
├── LESSON_PLAN.md
├── TEACHING_STORY.md
├── WHITEBOARD_SCRIPT.md
├── LIVE_DEMO_SCRIPT.md
├── EXERCISES.md
├── ASSESSMENT.md
├── COMMON_MISCONCEPTIONS.md
└── TEACHING_CHECKLIST.md
```

Também terá um roteiro de aula com:

```text
duração total:
120 minutos.

bloco conceitual:
35 minutos.

demonstração:
30 minutos.

prática:
35 minutos.

revisão:
15 minutos.

fechamento:
5 minutos.
```

Você irá:

1. definir o público;
2. definir pré-requisitos;
3. definir objetivos observáveis;
4. escolher uma história;
5. criar mapa conceitual;
6. criar sequência de perguntas;
7. preparar quadro branco;
8. preparar demonstração;
9. selecionar falhas intencionais;
10. preparar exercício;
11. preparar checkpoints;
12. criar avaliação;
13. criar respostas esperadas;
14. listar misconceptions;
15. preparar variações por nível;
16. revisar linguagem;
17. revisar tempo;
18. ensaiar a aula;
19. registrar melhorias;
20. preparar o fechamento do módulo.

---

## Conceito essencial

### Conhecimento ensinável

Conhecimento ensinável possui estrutura.

Ele precisa responder:

```text
por que isso existe?

qual problema resolve?

qual custo introduz?

como provar?

quando não usar?
```

Uma lista de definições não é suficiente.

---

### Objetivo observável

Objetivo fraco:

```text
entender Kafka.
```

Objetivo observável:

```text
explicar por que
uma mensagem pode repetir

e implementar uma deduplicação
por eventId.
```

O objetivo precisa permitir avaliação.

---

### Carga cognitiva

O aluno possui capacidade limitada de processar conceitos simultâneos.

Não apresente juntos:

- Kafka partitions;
- consumer groups;
- Outbox;
- Inbox;
- retries;
- tracing;
- métricas;
- sagas.

Apresente uma necessidade por vez.

---

### Scaffolding

Scaffolding significa construir suporte progressivo.

Exemplo:

```text
chamada direta;

fila em memória;

broker;

Outbox;

Inbox;

provider idempotente.
```

Cada etapa utiliza a anterior.

---

### Exemplo contínuo

Trocar de domínio a cada conceito aumenta a carga cognitiva.

Use uma história contínua:

```text
ordem de serviço agendada
gera notificação.
```

O aluno acompanha a evolução do mesmo fluxo.

---

### Falha intencional

Uma boa demonstração não mostra apenas sucesso.

Ela provoca:

- broker indisponível;
- mensagem duplicada;
- banco da Inbox indisponível;
- provider 429;
- timeout pós-aceite;
- quarantine.

A falha torna a garantia visível.

---

### Pergunta diagnóstica

Perguntas diagnósticas revelam o modelo mental.

Exemplo:

```text
se o consumer recebeu
a mesma mensagem duas vezes,

o Kafka está quebrado?
```

Resposta esperada:

```text
não;

at-least-once permite
redelivery.
```

---

### Checkpoint

Checkpoint interrompe a aula para validar compreensão.

Exemplo:

```text
qual identidade
deve permanecer
em todas as tentativas?
```

Resposta:

```text
eventId
ou idempotency key
da intenção lógica.
```

---

### Transferência

Aprender não é repetir o exemplo.

Transferência é aplicar o conceito a outro cenário.

Exemplo:

```text
pagamento;

estoque;

e-mail;

processamento de arquivo;

webhook.
```

O exercício final deve mudar o domínio.

---

### Trade-off

Toda solução possui custo.

Outbox adiciona:

- tabela;
- job;
- estados;
- limpeza;
- monitoramento.

Inbox adiciona:

- persistência;
- worker;
- backlog interno;
- recovery.

Ensinar apenas benefícios cria uma visão irreal.

---

### Demonstração executável

A demo precisa possuir:

- baseline;
- comandos;
- dados conhecidos;
- resultado esperado;
- fallback;
- reset;
- tempo limitado.

Não improvise a infraestrutura durante a apresentação.

---

### Avaliação formativa

Acontece durante a aula.

Exemplos:

- perguntas;
- votação;
- previsão do resultado;
- mini exercício;
- explicação em dupla.

Ela corrige entendimento antes do fim.

---

### Avaliação somativa

Acontece ao final.

Exemplo:

```text
desenhar um fluxo
com Outbox,
Inbox,
retry
e idempotência.
```

---

## Mão na massa guiada

### 1. Definir o público

Arquivo:

```text
LESSON_PLAN.md
```

Público principal:

```text
desenvolvedor Java
que conhece Spring Boot,
HTTP e banco relacional,

mas ainda não domina
mensageria confiável.
```

Pré-requisitos:

- Java;
- Spring Boot;
- transações;
- JSON;
- REST;
- testes básicos;
- SQL básico.

Não exigir conhecimento prévio de Kafka.

---

### 2. Definir objetivos

Ao final, o aluno deverá:

1. diferenciar comunicação síncrona e assíncrona;
2. explicar dual write;
3. explicar Outbox;
4. explicar at-least-once;
5. explicar Inbox;
6. implementar deduplicação;
7. classificar falhas;
8. explicar timeout ambíguo;
9. usar idempotency key;
10. identificar sinais operacionais.

Use verbos observáveis:

```text
explicar;

desenhar;

classificar;

implementar;

testar;

comparar.
```

---

### 3. Criar a história

Arquivo:

```text
TEACHING_STORY.md
```

Abertura:

```text
Uma OS foi agendada.

O sistema precisa
avisar o módulo de notificação.

O que acontece
se o provider estiver fora?
```

Primeira solução:

```text
ServiceOrderService
chama NotificationService.
```

Pergunta:

```text
a criação da OS
deve falhar
porque a notificação falhou?
```

Essa pergunta introduz desacoplamento temporal.

---

### 4. Evoluir a história

Etapas:

#### Etapa A — chamada direta

Benefício:

```text
simples.
```

Risco:

```text
acoplamento temporal.
```

#### Etapa B — publicar evento direto

Benefício:

```text
assíncrono.
```

Risco:

```text
dual write.
```

#### Etapa C — Outbox

Benefício:

```text
estado e intenção
na mesma transação.
```

Custo:

```text
publisher e backlog.
```

#### Etapa D — consumer direto

Risco:

```text
efeito duplicado.
```

#### Etapa E — Inbox

Benefício:

```text
recepção durável
e deduplicação.
```

#### Etapa F — provider HTTP

Risco:

```text
timeout ambíguo.
```

#### Etapa G — idempotency key

Benefício:

```text
uma entrega lógica.
```

---

### 5. Criar roteiro de quadro branco

Arquivo:

```text
WHITEBOARD_SCRIPT.md
```

Desenho inicial:

```text
[Client]
   |
   v
[Service Order]
   |
   v
[Notification]
```

Depois:

```text
[Service Order]
   |
   +--> [Database]
   |
   +--> [Kafka]
```

Pergunta:

```text
e se o banco confirmar
e o Kafka falhar?
```

Adicione:

```text
[Database]
  |- service_order
  |- outbox_event
```

Depois:

```text
[Outbox Publisher]
        |
        v
      [Kafka]
```

Depois:

```text
[Kafka]
   |
   v
[Inbox]
   |
   v
[Worker]
```

Finalize:

```text
[Dispatcher]
   |
   v
[External Provider]
```

Marque:

- commits;
- boundaries;
- IDs;
- pontos de retry;
- estados terminais.

---

### 6. Preparar analogias

Use analogias com cuidado.

#### Outbox

```text
registrar uma carta
na caixa de saída
antes de o carteiro buscá-la.
```

Limite da analogia:

```text
banco oferece transação;

caixa física não explica
constraints e claims.
```

#### Inbox

```text
protocolo de recebimento
antes de executar o trabalho.
```

#### Idempotência

```text
mesmo comprovante
não gera uma segunda cobrança.
```

Sempre explique onde a analogia deixa de funcionar.

---

### 7. Preparar a demonstração

Arquivo:

```text
LIVE_DEMO_SCRIPT.md
```

Duração:

```text
30 minutos.
```

Cenários:

1. happy path;
2. Outbox pendente;
3. redelivery;
4. timeout pós-aceite;
5. quarantine;
6. métricas.

Antes da aula:

```powershell
docker start `
  "m16-kafka"

.\mvnw.cmd clean verify
```

Confirme:

- porta;
- banco limpo;
- topic;
- consumer group;
- Actuator;
- dados de teste.

---

### 8. Demo 1 — happy path

Execute a criação de OS.

Mostre:

```text
response:
PENDING_PUBLICATION.
```

Pergunte:

```text
por que não SENT?
```

Depois mostre:

- Outbox;
- Kafka;
- Inbox;
- intent;
- provider;
- status final.

Acompanhe pelo mesmo `correlationId`.

---

### 9. Demo 2 — Outbox

Pause o publisher.

Crie uma OS.

Mostre:

```text
service_order:
persistida.

outbox_event:
PENDING.

Kafka:
sem record novo.
```

Reative.

Mostre:

```text
PUBLISHED.
```

Pergunta:

```text
o backlog é perda?
```

Resposta:

```text
não;

é trabalho persistido
aguardando processamento.
```

---

### 10. Demo 3 — redelivery

Publique duas vezes o mesmo `eventId`.

Mostre:

```text
records Kafka:
2.

Inbox:
1.

Intent:
1.

Delivery:
1.
```

Pergunta:

```text
a mensagem foi entregue
uma ou duas vezes?
```

Resposta:

```text
duas tentativas;

um efeito lógico.
```

---

### 11. Demo 4 — timeout ambíguo

Use customer `TIMEOUT-`.

Primeira tentativa:

```text
provider persiste;

client recebe timeout.
```

Pergunte:

```text
podemos criar outra key?
```

Resposta:

```text
não.
```

Segunda tentativa:

```text
ALREADY_ACCEPTED.
```

Mostre uma única delivery.

---

### 12. Demo 5 — quarantine

Use uma rejeição permanente.

Mostre:

- intent `QUARANTINED`;
- reason code;
- attempts;
- correlation ID;
- runbook.

Pergunte:

```text
por que não continuar retry?
```

---

### 13. Demo 6 — monitoramento

Mostre:

```text
consumer lag;

Inbox backlog;

notification backlog;

oldest age;

quarantine count.
```

Pergunta:

```text
lag zero significa
fluxo completo?
```

Resposta:

```text
não.
```

---

### 14. Preparar checkpoints

Checkpoint 1:

```text
qual problema
o assíncrono resolve?
```

Checkpoint 2:

```text
qual problema
a Outbox resolve?
```

Checkpoint 3:

```text
por que a mensagem repete?
```

Checkpoint 4:

```text
qual ID deduplica?
```

Checkpoint 5:

```text
quando retry é errado?
```

Checkpoint 6:

```text
qual sinal mostra
o item mais antigo?
```

---

### 15. Criar exercício principal

Arquivo:

```text
EXERCISES.md
```

Cenário:

```text
pedido aprovado
precisa reservar estoque
e enviar confirmação.
```

O aluno deve desenhar:

- HTTP;
- transação;
- Outbox;
- topic;
- key;
- evento;
- Inbox;
- efeito;
- retry;
- quarantine;
- correlação;
- métricas.

Restrições:

- mensagem pode repetir;
- estoque pode ficar indisponível;
- provider pode dar timeout;
- dados pessoais não podem entrar no evento.

---

### 16. Criar exercício de classificação

Classifique:

```text
400;

409;

422;

429;

503;

connect timeout;

read timeout;

evento duplicado;

versão desconhecida.
```

Categorias:

```text
sucesso;

duplicata;

transitória;

permanente;

ambígua.
```

---

### 17. Criar exercício de diagnóstico

Dado:

```text
Kafka lag:
0.

Inbox ready:
500.

Inbox oldest age:
20 minutos.
```

Pergunta:

```text
onde está o gargalo?
```

Resposta:

```text
depois do commit Kafka;

worker da Inbox.
```

---

### 18. Criar avaliação

Arquivo:

```text
ASSESSMENT.md
```

Avaliação curta:

1. explique dual write;
2. desenhe Outbox;
3. diferencie eventId e correlationId;
4. explique redelivery;
5. explique Inbox;
6. classifique 429;
7. explique timeout ambíguo;
8. escolha idempotency key;
9. diferencie lag e backlog;
10. liste um trade-off.

Critério:

```text
8 de 10
com justificativa.
```

---

### 19. Criar rubrica

Níveis:

#### Inicial

Repete definições sem conectar problemas.

#### Em desenvolvimento

Explica padrões, mas não falhas.

#### Competente

Conecta problema, padrão, garantia e teste.

#### Avançado

Explica trade-offs, operação e limites.

---

### 20. Criar misconceptions

Arquivo:

```text
COMMON_MISCONCEPTIONS.md
```

#### “Kafka não duplica”

Correção:

```text
at-least-once permite redelivery.
```

#### “Outbox publica dentro da transação”

Correção:

```text
a transação grava a intenção;

o publisher entrega depois.
```

#### “Lag zero significa concluído”

Correção:

```text
Inbox ou worker
podem continuar acumulados.
```

#### “Retry resolve qualquer erro”

Correção:

```text
falha permanente
não melhora repetindo.
```

#### “Correlation ID deduplica”

Correção:

```text
correlation ID agrupa jornadas;

event ID identifica o fato.
```

#### “Microsserviço é obrigatório”

Correção:

```text
monólito modular
pode preservar boundaries.
```

---

### 21. Preparar respostas a perguntas difíceis

Pergunta:

```text
Outbox garante exactly-once?
```

Resposta:

```text
não;

ela reduz dual write;

a publicação continua
at-least-once.
```

Pergunta:

```text
por que não usar transação Kafka?
```

Resposta:

```text
ela não torna
o banco e o provider externo
uma única transação global.
```

Pergunta:

```text
por que não apagar quarantine?
```

Resposta:

```text
ela é evidência,
auditoria e ponto
de recuperação.
```

---

### 22. Adaptar para público iniciante

Reduza:

- detalhes de partitions;
- queries de claim;
- métricas avançadas;
- sagas;
- replay.

Foque:

```text
problema;

mensagem;

duplicidade;

idempotência;

falha.
```

---

### 23. Adaptar para público avançado

Aprofunde:

- ordering;
- rebalance;
- stale claims;
- consistency windows;
- schema evolution;
- consumer lag;
- cardinalidade;
- SLO;
- arquitetura de times;
- trade-offs de banco por serviço.

---

### 24. Preparar o fechamento

Últimos cinco minutos:

```text
integração confiável
não é somente enviar;

é preservar estado,
identidade,
recuperação
e visibilidade.
```

Pergunta final:

```text
onde o sistema
pode repetir

e como você prova
que o efeito permanece único?
```

---

### 25. Criar checklist de ensino

Arquivo:

```text
TEACHING_CHECKLIST.md
```

Antes:

- [ ] objetivo claro;
- [ ] ambiente validado;
- [ ] demo ensaiada;
- [ ] dados preparados;
- [ ] fallback pronto;
- [ ] tempo estimado;
- [ ] exercícios revisados.

Durante:

- [ ] problema antes da solução;
- [ ] uma ideia por etapa;
- [ ] perguntas frequentes;
- [ ] checkpoints;
- [ ] falha demonstrada;
- [ ] trade-offs explícitos.

Depois:

- [ ] avaliação;
- [ ] dúvidas registradas;
- [ ] melhorias anotadas;
- [ ] materiais enviados;
- [ ] feedback coletado.

---

### 26. Ensaiar a aula

Faça um ensaio cronometrado.

Registre:

```text
tempo real;

partes longas;

perguntas difíceis;

falhas de demo;

conceitos confusos;

ajustes.
```

A primeira versão raramente cabe no tempo.

---

### 27. Executar validação do material

Confira:

- todos os comandos;
- todos os nomes;
- diagramas;
- respostas;
- contratos;
- ausência de segredos;
- links internos;
- coerência com o projeto.

Execute:

```powershell
.\mvnw.cmd clean verify
```

A aula ensinável precisa partir de um projeto verde.

---

### 28. Criar plano minuto a minuto

No `LESSON_PLAN.md`, detalhe a execução:

```text
00–05:
contexto e objetivo.

05–15:
chamada direta
e acoplamento temporal.

15–25:
dual write
e Outbox.

25–35:
at-least-once,
redelivery
e Inbox.

35–45:
idempotência
e timeout ambíguo.

45–50:
checkpoint conceitual.

50–80:
live demo.

80–85:
pausa e dúvidas.

85–110:
exercício em grupos.

110–118:
correção e avaliação.

118–120:
síntese final.
```

O plano não precisa ser obedecido cegamente.

Ele ajuda a identificar desvios.

Se a discussão de dual write consumir vinte minutos extras, a prática será prejudicada.

Defina conteúdos opcionais que podem ser reduzidos:

- detalhes de partition assignment;
- replay;
- métricas avançadas;
- health versus readiness;
- modularidade organizacional.

Nunca corte:

- problema;
- Outbox;
- redelivery;
- idempotência;
- timeout ambíguo;
- exercício.

---

### 29. Utilizar previsão, observação e explicação

Antes de cada demo, peça uma previsão.

Exemplo:

```text
vou publicar o mesmo eventId
duas vezes.

quantas linhas
vocês esperam na Inbox?
```

Depois, execute.

Peça observação:

```text
o que o banco mostra?

quantos records existem?

quantos efeitos ocorreram?
```

Por fim, peça explicação:

```text
qual mecanismo
produziu esse resultado?
```

Essa sequência evita que o aluno apenas assista.

Ela transforma a demonstração em raciocínio.

Use o mesmo método no timeout:

```text
previsão:

o provider criou a delivery?

observação:

delivery existe,
mas o client recebeu timeout.

explicação:

resultado ambíguo
e repetição com a mesma key.
```

---

### 30. Criar matriz de evidências didáticas

No `TEACHING_CHECKLIST.md`, adicione:

```markdown
| Conceito | Evidência mostrada | Pergunta |
|---|---|---|
| Dual write | Rollback test | O que poderia divergir? |
| Outbox | Linha PENDING | Por que ainda não perdeu? |
| Redelivery | Dois records | Quantos efeitos? |
| Inbox | Unique constraint | Quem rejeitou a duplicata? |
| Timeout | Delivery + exception | O resultado é conhecido? |
| Idempotência | ALREADY_ACCEPTED | Por que a key não muda? |
| Backlog | Count + oldest age | Onde está o gargalo? |
| Quarantine | Reason code | Qual ação é segura? |
```

A evidência precisa ser observável.

Evite afirmar:

```text
o sistema é resiliente.
```

Mostre:

- falha;
- estado intermediário;
- retry;
- resultado;
- registro final.

---

### 31. Coletar feedback após a aula

Use três perguntas:

```text
qual conceito ficou mais claro?

qual conceito ainda está confuso?

qual parte você conseguiria
aplicar amanhã?
```

Registre padrões.

Se várias pessoas confundirem:

```text
eventId
e
correlationId,
```

o problema provavelmente está na aula, não apenas no público.

Atualize:

- diagrama;
- exemplo;
- pergunta;
- exercício;
- tempo.

Material ensinável evolui com evidência de aprendizagem.

---

## Entendendo o que foi feito

### O problema virou a entrada

A aula não começou por tecnologia.

### A história permaneceu contínua

A mesma OS atravessou todas as etapas.

### As falhas ficaram visíveis

Duplicidade, timeout e quarantine foram demonstrados.

### Garantias foram separadas

Entrega e efeito não foram confundidos.

### A prática exigiu transferência

O exercício mudou para estoque.

### Misconceptions foram antecipadas

A aula preparou correções para modelos mentais comuns.

### O público ganhou adaptação

A mesma aula pode ser reduzida ou aprofundada.

### A demo ganhou roteiro

Resultados e fallback foram preparados.

### A avaliação ficou observável

O aluno precisa explicar, desenhar e classificar.

### O fechamento sintetizou o módulo

Integração foi apresentada como estado, identidade, falha e visibilidade.

---

## Erros comuns importantes

### Começar por configuração Kafka

O aluno não entende o problema.

### Mostrar apenas happy path

A confiabilidade permanece abstrata.

### Explicar tudo de uma vez

A carga cognitiva aumenta.

### Usar analogia sem limite

O aluno aplica a analogia literalmente.

### Ler código por trinta minutos

A aula perde narrativa.

### Fazer perguntas retóricas

Não existe verificação de compreensão.

### Confundir demonstração com prova

A demo ilustra; o teste comprova.

### Esconder trade-offs

Os padrões parecem gratuitos.

### Usar termos sem definição

O aluno memoriza palavras.

### Não ensaiar

Infraestrutura e tempo quebram a aula.

### Avaliar somente definição

Transferência não é medida.

### Antecipar o fechamento do módulo

A aula 505 possui objetivo próprio.

---

## Comandos úteis

### Validar o projeto

```powershell
.\mvnw.cmd clean verify
```

### Iniciar Kafka

```powershell
docker start `
  "m16-kafka"
```

### Inspecionar group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-notification-service-order-v1"
```

### Ver métricas

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "integration_"
```

### Revisar materiais

```powershell
Get-ChildItem `
  "docs/teaching/integrations" `
  -File
```

---

## Exercício guiado

### Parte 1 — Público

Defina conhecimentos prévios.

### Parte 2 — Objetivos

Use verbos observáveis.

### Parte 3 — História

Comece por uma falha real.

### Parte 4 — Quadro

Desenhe a evolução.

### Parte 5 — Demo

Mostre sucesso e falhas.

### Parte 6 — Checkpoints

Verifique compreensão.

### Parte 7 — Exercício

Mude o domínio.

### Parte 8 — Avaliação

Meça explicação e aplicação.

### Parte 9 — Adaptação

Crie versão iniciante e avançada.

### Parte 10 — Ensaio

Cronometre e ajuste.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 503 foi preservada;
- público foi definido;
- pré-requisitos foram definidos;
- objetivos observáveis foram criados;
- narrativa foi criada;
- problema foi apresentado antes da tecnologia;
- exemplo contínuo foi utilizado;
- chamada direta foi explicada;
- acoplamento temporal foi explicado;
- dual write foi explicado;
- Outbox foi explicada;
- at-least-once foi explicado;
- redelivery foi explicado;
- Inbox foi explicada;
- deduplicação foi explicada;
- idempotency key foi explicada;
- timeout ambíguo foi explicado;
- quarantine foi explicada;
- monitoramento foi explicado;
- trade-offs foram explicados;
- mapa conceitual foi criado;
- roteiro de quadro branco foi criado;
- commits transacionais foram marcados;
- boundaries foram marcados;
- pontos de retry foram marcados;
- analogias foram criadas;
- limites das analogias foram registrados;
- live demo foi roteirizada;
- baseline da demo foi definida;
- happy path foi demonstrado;
- Outbox pendente foi demonstrada;
- redelivery foi demonstrada;
- timeout pós-aceite foi demonstrado;
- quarantine foi demonstrada;
- monitoramento foi demonstrado;
- correlationId foi utilizado na demo;
- checkpoints foram criados;
- exercício principal foi criado;
- transferência para outro domínio foi exigida;
- exercício de classificação foi criado;
- exercício de diagnóstico foi criado;
- avaliação foi criada;
- critérios de avaliação foram definidos;
- rubrica foi criada;
- misconceptions foram listadas;
- respostas corretivas foram preparadas;
- perguntas difíceis foram preparadas;
- versão iniciante foi definida;
- versão avançada foi definida;
- fechamento foi preparado;
- checklist de ensino foi criado;
- ensaio cronometrado foi exigido;
- fallback da demo foi preparado;
- materiais foram validados;
- projeto verde foi exigido;
- nova feature não foi criada;
- contratos não foram alterados;
- fechamento do módulo não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 505 está correta.

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
  docs/teaching/integrations `
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
git commit -m "docs(m16): preparar aula ensinavel de integracoes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- payload real;
- contato real;
- log completo;
- banco local;
- target;
- vídeo não revisado;
- resposta da avaliação junto do enunciado público;
- arquivo temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o conhecimento técnico virou uma experiência de ensino.

A estrutura criada foi:

```text
problema;

história;

evolução;

falha;

garantia;

demonstração;

prática;

avaliação;

trade-off;

fechamento.
```

Você comprovou que uma aula técnica precisa:

- começar pela necessidade;
- limitar carga cognitiva;
- manter um exemplo contínuo;
- demonstrar falhas;
- verificar compreensão;
- exigir transferência;
- explicar custos;
- adaptar profundidade;
- possuir evidências;
- terminar com síntese.

A mensagem principal ficou:

```text
integração confiável
não é apenas comunicação;

é estado,
identidade,
recuperação
e visibilidade.
```

A próxima aula será:

```text
505 - M16.50 - Fechamento do Modulo 16
```

Nela, você irá:

- consolidar o que foi aprendido;
- revisar competências;
- revisar entregáveis;
- revisar o projeto;
- revisar os padrões;
- identificar lacunas;
- registrar evolução;
- fechar o módulo;
- preparar a transição para o próximo módulo.

Nenhum conteúdo do fechamento oficial foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini público e objetivos.
- [ ] Criei história contínua.
- [ ] Preparei quadro branco.
- [ ] Preparei demos de falha.
- [ ] Criei exercícios.
- [ ] Criei avaliação.
- [ ] Listei misconceptions.
- [ ] Ensaiar e ajustar a aula.

---

## Troubleshooting adicional

### A aula ficou longa demais

Remova detalhes avançados, não a narrativa principal.

### O aluno não entende Outbox

Volte ao dual write e demonstre a falha.

### A demo falha por infraestrutura

Use logs, banco e outputs previamente capturados como fallback.

### O aluno confunde eventId e correlationId

Desenhe uma jornada com vários eventos.

### Retry parece sempre bom

Mostre 422 repetindo inutilmente.

### Lag zero gera confusão

Mostre Inbox acumulada.

### A analogia virou regra

Explique explicitamente o limite.

### O exercício copia a demo

Mude domínio, falhas e constraints.

### A avaliação mede memória

Inclua desenho, classificação e justificativa.

### O tempo estourou

Cronometre blocos e corte detalhes opcionais.

---

## Perguntas de revisão

1. Por que começar pelo problema?
2. O que é objetivo observável?
3. O que é carga cognitiva?
4. O que é scaffolding?
5. Por que manter um exemplo contínuo?
6. Por que demonstrar falha?
7. O que é pergunta diagnóstica?
8. O que é checkpoint?
9. O que é transferência?
10. O que é trade-off?
11. O que a Outbox resolve?
12. O que a Inbox resolve?
13. Por que a mensagem repete?
14. Qual ID deduplica?
15. Por que timeout é ambíguo?
16. Lag zero encerra o fluxo?
17. O que uma rubrica avalia?
18. Por que adaptar ao público?
19. Qual é a mensagem principal?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Criar contexto e necessidade.
2. Permite verificar aprendizagem.
3. Limite de processamento mental.
4. Suporte progressivo.
5. Reduzir esforço de contexto.
6. Tornar garantias visíveis.
7. Revelar o modelo mental.
8. Verificar compreensão.
9. Aplicar em outro cenário.
10. Custo e benefício.
11. Dual write local.
12. Recepção durável e deduplicação.
13. At-least-once.
14. eventId.
15. O provider pode ter aceitado.
16. Não.
17. Níveis de domínio.
18. Controlar profundidade.
19. Estado, identidade, recuperação e visibilidade.
20. Fechamento do Modulo 16.

---

## Desafio opcional

Grave uma apresentação de quinze minutos.

Estrutura:

```text
2 min:
problema.

3 min:
dual write e Outbox.

3 min:
redelivery e Inbox.

3 min:
timeout e idempotência.

2 min:
monitoramento.

2 min:
trade-offs e fechamento.
```

Depois, revise:

- clareza;
- velocidade;
- termos não explicados;
- diagramas;
- exemplos;
- conclusão.

Não inclua segredos ou dados reais na gravação.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 504 - M16.49 - Aula ensinavel integracoes

- Continuei após a refatoração final de integrações.
- Transformei o conteúdo técnico em material ensinável.
- Defini o público e os pré-requisitos.
- Criei objetivos observáveis.
- Criei uma narrativa contínua de OS.
- Comecei pelo problema antes da tecnologia.
- Expliquei chamada direta e acoplamento temporal.
- Expliquei dual write.
- Expliquei Outbox.
- Expliquei at-least-once e redelivery.
- Expliquei Inbox e deduplicação.
- Expliquei provider HTTP e timeout ambíguo.
- Expliquei idempotency key.
- Expliquei quarantine e monitoramento.
- Criei roteiro de quadro branco.
- Marquei boundaries e transações.
- Preparei analogias e limites.
- Criei roteiro de live demo.
- Preparei happy path.
- Preparei Outbox pendente.
- Preparei redelivery.
- Preparei timeout pós-aceite.
- Preparei quarantine.
- Preparei monitoramento.
- Criei checkpoints.
- Criei exercício em outro domínio.
- Criei exercício de classificação.
- Criei exercício de diagnóstico.
- Criei avaliação e rubrica.
- Listei misconceptions.
- Preparei respostas a perguntas difíceis.
- Criei adaptação iniciante e avançada.
- Criei checklist de ensino.
- Planejei ensaio cronometrado.
- Não criei nova feature.
- Próxima aula: Fechamento do Modulo 16.
```

---

## Referência técnica curta

- Instructional Design.
- Cognitive Load Theory.
- Scaffolding.
- Retrieval Practice.
- Formative Assessment.
- Worked Examples.
- Live Coding.
- Transactional Outbox Pattern.
- Idempotent Consumer Pattern.
- Production Readiness Review.

Regra final:

```text
uma aula ensinável de integrações começa pelo problema e evolui uma história contínua: chamada direta revela acoplamento temporal, publicação direta revela dual write, Outbox preserva estado e intenção, Kafka introduz at-least-once, Inbox torna recepção durável, eventId protege contra redelivery, sourceEventId mantém idempotência no provider, timeout demonstra resultado ambíguo e métricas e logs mostram onde a jornada parou; cada conceito deve possuir pergunta, diagrama, demonstração, falha intencional, checkpoint e trade-off; exercícios precisam transferir o conhecimento para outro domínio, a avaliação precisa medir explicação e aplicação, misconceptions devem ser corrigidas explicitamente e a profundidade precisa ser adaptada ao público; ao final, o aluno deve compreender que integração confiável é a combinação de estado, identidade, recuperação e visibilidade.
```
