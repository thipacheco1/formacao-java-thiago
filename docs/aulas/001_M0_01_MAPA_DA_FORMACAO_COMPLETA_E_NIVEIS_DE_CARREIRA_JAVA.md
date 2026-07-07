# 001 — M0.01 — Mapa da Formação Completa e Níveis de Carreira Java

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.01.01` — Mapa da formação completa e níveis de carreira Java — Conceito, por que existe e vocabulário essencial.
- `M0.01.02` — Mapa da formação completa e níveis de carreira Java — Exemplo mínimo digitado do zero.
- `M0.01.03` — Mapa da formação completa e níveis de carreira Java — Exemplo aplicado ao domínio corporativo.
- `M0.01.04` — Mapa da formação completa e níveis de carreira Java — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para evitar repetição artificial e manter a explicação mais natural, completa e conectada.

---

## Hoje a aula é sobre o mapa inteiro

Antes de abrir o IntelliJ, antes de escrever `public static void main`, antes de instalar ferramenta, antes de falar de Spring Boot, banco ou arquitetura, precisamos fazer uma coisa que muita gente ignora:

entender o caminho.

Um aluno comum começa assim:

```text
Vou aprender Java.
```

Mas isso é vago demais.

Java é linguagem.

Backend é construção de sistema.

Engenharia é raciocínio técnico aplicado a qualidade, evolução, manutenção, risco e produção.

Arquitetura é decisão estrutural, trade-off, fronteira, integração, consistência, escala, custo e clareza.

Então, nesta formação, o objetivo não é apenas “aprender Java”.

O objetivo é construir uma trajetória.

A pergunta certa não é:

```text
Qual aula vem agora?
```

A pergunta certa é:

```text
Que tipo de profissional esta aula está tentando formar?
```

Essa aula existe para você entender isso.

---

## A formação tem camadas

Pensa na formação como uma construção.

Você não começa pelo telhado.

Você começa pela fundação.

Mas também não constrói só fundação para sempre.

A formação precisa sair do básico e chegar ao nível profissional.

O caminho geral é este:

```text
Ambiente e método
↓
Java fundamentos
↓
Java Core profundo
↓
Organização de código
↓
Orientação a Objetos
↓
Collections e Java moderno
↓
Código limpo, SOLID e padrões
↓
Build, Git e qualidade
↓
Testes
↓
SQL e banco de dados
↓
Persistência com JDBC/JPA/Hibernate/Spring Data
↓
Spring Boot e APIs REST
↓
Segurança
↓
Integrações, mensageria e resiliência
↓
Docker, CI/CD, Kubernetes e cloud
↓
Observabilidade, performance e produção
↓
Arquitetura, DDD e sistemas distribuídos
↓
Projeto final, carreira e capacidade de explicar
```

Isso não é uma lista aleatória.

Cada camada prepara a próxima.

Se você não entende Java básico, vai copiar Spring Boot sem entender.

Se você não entende OO, vai criar entidades e services ruins.

Se você não entende SQL, vai usar JPA no escuro.

Se você não entende transação, vai criar bug de consistência.

Se você não entende testes, vai ter medo de mudar código.

Se você não entende Git e build, vai sofrer em time.

Se você não entende logs e observabilidade, vai travar quando o erro aparecer em produção.

Se você não entende arquitetura, vai chamar qualquer separação de pasta de “Clean Architecture”.

Então o mapa existe para evitar estudo solto.

---

## O que significa sair do zero até engenheiro/arquiteto

Vamos separar bem os níveis.

Não como cargo formal de empresa, porque cada empresa usa nomes de um jeito.

Vamos falar de capacidade técnica.

### Nível 1 — Iniciante

O iniciante ainda está tentando entender a linguagem.

Ele pergunta:

```text
Como eu declaro uma variável?
Por que precisa de ponto e vírgula?
O que é main?
O que é classe?
Por que deu erro?
Onde eu rodo isso?
```

O iniciante precisa de base, repetição, exemplos simples e correção.

Aqui, errar faz parte.

O problema não é errar.

O problema é copiar resposta sem entender o erro.

---

### Nível 2 — Júnior

O júnior já consegue implementar pequenas tarefas, mas ainda precisa de direção.

Ele consegue:

```text
criar uma classe;
fazer um método;
usar if;
usar laço;
usar lista;
criar endpoint simples;
seguir padrão existente;
corrigir bug pequeno;
rodar projeto local;
fazer commit;
perguntar quando trava.
```

Mas o júnior ainda costuma sofrer com:

```text
decidir onde colocar regra;
entender impacto de mudança;
modelar domínio;
tratar erro corretamente;
escrever teste bom;
lidar com banco e transação;
investigar problema sozinho;
perceber acoplamento.
```

O júnior precisa aprender a sair do “funcionou” para o “está correto, legível, testável e seguro”.

---

### Nível 3 — Pleno

O pleno já entrega com mais autonomia.

Ele não apenas pergunta “como fazer”.

Ele começa a perguntar:

```text
Qual é a melhor forma de fazer neste contexto?
Qual é o padrão do projeto?
Tem regra de negócio escondida?
Preciso validar entrada?
Preciso tratar concorrência?
Preciso criar teste?
Essa consulta pode ficar lenta?
Esse endpoint está quebrando compatibilidade?
```

O pleno já precisa ter visão de fluxo.

Ele entende que uma alteração pode passar por várias camadas:

```text
Controller
DTO
Validação
Service
Domínio
Repository
Banco
Transação
Logs
Testes
Documentação
```

O pleno ainda pode não desenhar a arquitetura inteira, mas já consegue trabalhar dentro dela sem destruir tudo.

---

### Nível 4 — Sênior

O sênior não é apenas alguém com mais anos de experiência.

Sênior é alguém que reduz risco técnico.

Ele olha para uma tarefa e enxerga consequências.

Ele pergunta:

```text
Essa regra pertence a qual contexto?
Essa alteração quebra contrato?
Esse método está assumindo algo perigoso?
Esse processamento precisa ser idempotente?
Essa operação precisa de transação?
Esse evento pode ser duplicado?
Esse retry pode causar cobrança duplicada?
Esse lock pode gerar deadlock?
Esse log ajuda ou só polui?
Esse teste prova o comportamento certo?
Esse design vai ser sustentável?
```

O sênior também ajuda outras pessoas.

Ele explica.

Ele revisa.

Ele orienta.

Ele antecipa problema.

Ele não entrega apenas código.

Ele entrega confiança.

---

### Nível 5 — Staff, principal, engenheiro forte

Aqui a pessoa começa a ter impacto além da própria tarefa.

Ela pensa em sistemas, padrões, plataformas, qualidade e decisões que afetam times.

Ela começa a se preocupar com:

```text
padronização;
governança técnica;
evolução de arquitetura;
observabilidade;
estratégia de testes;
estratégia de deploy;
resiliência;
custos;
segurança;
produtividade do time;
dívida técnica;
qualidade de APIs;
contratos entre sistemas;
decisões registradas.
```

Esse profissional não precisa ser “gerente”.

Ele pode continuar profundamente técnico.

Mas ele deixa de pensar apenas no método que está escrevendo e passa a pensar na saúde do sistema.

---

### Nível 6 — Arquiteto

O arquiteto técnico precisa tomar e defender decisões estruturais.

Ele pensa em perguntas como:

```text
Este sistema deve ser monólito modular ou microserviços?
Onde estão os bounded contexts?
Qual é a estratégia de integração?
Qual consistência é necessária?
Onde aceitamos consistência eventual?
Como lidar com falha parcial?
Qual é a estratégia de autenticação/autorização?
Como garantir observabilidade?
Como evoluir legado sem parar o negócio?
Como evitar acoplamento entre domínios?
Como documentar decisões?
Como guiar times sem virar gargalo?
```

Um bom arquiteto não desenha diagrama bonito para impressionar.

Um bom arquiteto reduz ambiguidade.

Ele ajuda o sistema a evoluir com menos caos.

E, para chegar nisso, ele precisa ter passado por base, código, teste, banco, produção e domínio.

Arquitetura sem chão de código vira discurso vazio.

Código sem arquitetura vira crescimento desordenado.

A formação precisa unir os dois.

---

## O ponto mais importante: cada nível muda a pergunta

Uma forma boa de entender evolução profissional é observar o tipo de pergunta que a pessoa faz.

### Iniciante pergunta:

```text
Como escreve?
```

### Júnior pergunta:

```text
Como faço funcionar?
```

### Pleno pergunta:

```text
Como faço certo dentro do padrão?
```

### Sênior pergunta:

```text
Qual é o impacto disso no sistema?
```

### Engenheiro forte pergunta:

```text
Como essa decisão afeta manutenção, escala, segurança, operação e time?
```

### Arquiteto pergunta:

```text
Qual estrutura permite o sistema evoluir com menos risco?
```

A formação inteira quer levar você nessa evolução de perguntas.

Não é só aprender respostas.

É aprender a perguntar melhor.

---

## Exemplo mínimo: uma mesma tarefa vista por vários níveis

Imagine uma tarefa simples:

```text
Criar um endpoint para cadastrar pedido.
```

Um iniciante pensa:

```text
Preciso criar um método que receba dados.
```

Um júnior pensa:

```text
Preciso criar um controller com POST e salvar no banco.
```

Um pleno pensa:

```text
Preciso criar DTO, validar entrada, chamar service, persistir com repository e retornar status correto.
```

Um sênior pensa:

```text
Preciso entender regra de negócio, idempotência, transação, duplicidade, status inicial, auditoria, teste e contrato da API.
```

Um engenheiro pensa:

```text
Esse cadastro participa de qual fluxo maior? Tem mensageria? Precisa emitir evento? Tem impacto em estoque, pagamento, faturamento ou notificação? Como observar falha?
```

Um arquiteto pensa:

```text
Pedido pertence a qual bounded context? Qual integração deve ser síncrona? Qual pode ser assíncrona? Qual consistência o negócio exige? Como essa decisão evolui quando houver múltiplos canais?
```

A tarefa é a mesma.

A profundidade muda.

É isso que esta formação precisa construir.

---

## Exemplo aplicado ao domínio corporativo

Imagine uma atividade técnica em um sistema corporativo.

Ela pode ter:

```text
ordem de serviço;
cliente;
produto;
status;
agenda;
histórico;
ocorrência;
mensageria;
integração externa;
auditoria;
responsável;
prazo;
regra de negócio.
```

Um desenvolvedor fraco pode olhar só para a tela ou só para o endpoint.

Um desenvolvedor melhor pergunta:

```text
Qual é o ciclo de vida dessa atividade?
Quais status são permitidos?
Quem pode alterar?
Quando gera histórico?
Quando gera ocorrência?
Essa mudança dispara mensagem?
Essa mensagem precisa ser idempotente?
E se a integração externa falhar?
O banco precisa manter consistência?
Como testo esse fluxo?
Como investigo isso em produção?
```

Percebe?

Backend real não é só CRUD.

CRUD é só a superfície.

Por trás existe regra, fluxo, consistência, integração e rastreabilidade.

Essa formação vai bater muito nisso.

---

## O papel de cada módulo na sua evolução

Agora vamos olhar a formação como um mapa.

### M0 — Ambiente, método, ferramentas e rotina profissional

Esse módulo parece preparatório, mas ele é muito importante.

Muita gente começa a codar sem ambiente organizado.

Depois sofre com:

```text
Java errado;
PATH errado;
Git bagunçado;
projeto fora de pasta;
arquivo perdido;
IDE mal configurada;
Maven não funciona;
Docker não sobe;
banco local quebrado;
sem diário;
sem rastreabilidade.
```

Um profissional forte não depende de sorte no ambiente.

Ele sabe preparar, validar e diagnosticar.

---

### M1 — Java fundamentos absolutos e lógica aplicada

Aqui entra a base de linguagem.

Variáveis, tipos, if, switch, laços, arrays, métodos, entrada de dados.

Parece básico.

Mas é aqui que se forma a leitura de código.

Se você não lê bem fluxo simples, não vai ler bem fluxo de backend.

Se você não entende `if`, vai criar regra ruim.

Se você não entende array, vai sofrer com lista.

Se você não entende método, vai criar service gigante.

Fundamento fraco aparece depois como arquitetura ruim.

---

### M2 — Java Core profundo e APIs essenciais

Aqui você começa a entender o Java por dentro.

Memória, stack, heap, String, wrappers, BigDecimal, datas, exceptions, enums, records, annotations, reflection, sealed, pattern matching.

Isso diferencia alguém que só escreve código de alguém que entende comportamento.

Exemplo simples:

```text
double para dinheiro pode dar problema.
BigDecimal resolve outro tipo de problema.
String é imutável.
LocalDate não é a mesma coisa que LocalDateTime.
Exception mal usada esconde erro.
Enum bem usado modela regra.
```

Essas coisas aparecem o tempo todo em backend.

---

### M3 — Métodos, organização procedural e projetos console

Antes de OO de verdade, você precisa aprender a organizar raciocínio.

Método não é só “um bloco de código”.

Método é responsabilidade.

Um método bom tem intenção clara.

Um método ruim mistura tudo.

Essa fase treina:

```text
nome;
entrada;
saída;
responsabilidade;
separação;
reutilização;
leitura;
fluxo.
```

Quem não aprende isso cria código difícil de testar.

---

### M4 — Orientação a Objetos de verdade e modelagem de domínio

Aqui começa uma das viradas mais importantes.

OO não é decorar:

```text
classe
objeto
herança
polimorfismo
```

OO é aprender a modelar comportamento e regra.

Você precisa entender:

```text
estado;
invariante;
encapsulamento;
composição;
identidade;
valor;
responsabilidade;
colaboração entre objetos.
```

Sem isso, você vira refém de DTO, service procedural e entidade anêmica.

---

### M5 — Collections, Generics, Streams e Java moderno

Backend manipula conjuntos o tempo todo:

```text
lista de pedidos;
mapa de status;
conjunto de permissões;
fila de eventos;
agrupamento de dados;
filtros;
transformações;
ordenações.
```

Collections não são só sintaxe.

Cada estrutura tem comportamento.

`List`, `Set` e `Map` não existem por acaso.

Generics trazem segurança de tipo.

Streams trazem expressividade, mas também podem virar confusão se mal usados.

Aqui você aprende a escolher melhor.

---

### M6 — Código limpo, SOLID, refatoração e design patterns

Aqui você começa a sair de “funcionou” para “é sustentável”.

Código limpo não é frescura.

Código limpo reduz custo de mudança.

SOLID não é religião.

É um conjunto de princípios para reduzir acoplamento e melhorar evolução.

Design patterns não são enfeites.

São soluções conhecidas para problemas recorrentes.

Mas cuidado: pattern mal usado vira complexidade artificial.

Aqui vamos aprender quando usar e quando não usar.

---

### M7 — Build, Git profissional, Maven, Gradle e qualidade estática

Projeto profissional não é só código.

Tem build.

Tem dependência.

Tem versão.

Tem branch.

Tem pull request.

Tem conflito.

Tem análise estática.

Tem pipeline.

Maven e Gradle não são apenas comandos.

Eles definem como o projeto nasce, compila, testa, empacota e se integra com o ecossistema.

Git não é só commit.

Git é colaboração, histórico e segurança de mudança.

---

### M8 — Testes profissionais em Java

Teste não é etapa final.

Teste é ferramenta de design e confiança.

Você vai aprender:

```text
teste unitário;
teste de borda;
teste de erro;
mock;
fixture;
builder;
integração;
Testcontainers;
WireMock;
contrato;
mutação;
arquitetura com ArchUnit.
```

Um backend sem teste vira medo.

Com teste ruim, vira falsa segurança.

Com teste bom, vira evolução confiável.

---

### M9 — SQL, PostgreSQL e modelagem relacional

Backend que não entende banco é perigoso.

JPA não substitui SQL.

Você precisa saber:

```text
tabela;
chave;
relacionamento;
índice;
join;
group by;
transação;
lock;
deadlock;
explain;
normalização;
modelo relacional.
```

Muitos bugs graves de backend são bugs de dado.

Muitas lentidões são consultas ruins.

Muitas inconsistências são transações mal pensadas.

---

### M10 — Persistência Java: JDBC, JPA, Hibernate e Spring Data

Aqui você liga Java ao banco.

Você vai entender desde JDBC até JPA/Hibernate.

Isso é essencial porque muita gente usa Spring Data sem entender o que está acontecendo.

Conceitos críticos:

```text
persistence context;
dirty checking;
flush;
lazy/eager;
N+1;
transação;
JPQL;
Criteria;
projection;
paginação;
lock;
repository.
```

Essa parte separa backend mediano de backend que sabe diagnosticar produção.

---

### M11 — Spring Boot, REST APIs e backend profissional

Aqui o backend moderno aparece com força.

Mas Spring Boot não deve ser aprendido como mágica.

Você precisa entender:

```text
injeção de dependência;
beans;
auto configuration;
controller;
DTO;
validation;
service;
repository;
transactional;
exception handler;
problem details;
logs;
profiles;
filtros;
interceptors;
cache;
scheduler;
upload;
paginação;
Swagger/OpenAPI;
testes.
```

Spring Boot facilita.

Mas quem não entende cria aplicação acoplada, frágil e difícil de manter.

---

### M12 — Segurança de aplicações Java

Segurança não pode ser lembrada no final.

Você precisa entender:

```text
autenticação;
autorização;
CORS;
CSRF;
headers;
BCrypt;
JWT;
refresh token;
roles;
OAuth2;
OIDC;
PKCE;
Keycloak;
secrets;
auditoria;
LGPD;
multi-tenancy;
OWASP.
```

Backend lida com dados, identidade e permissão.

Erro de segurança pode virar incidente real.

---

### M13 — Integrações, arquivos, mensageria, eventos e resiliência

Sistema real conversa com outros sistemas.

E sistemas falham.

Você precisa entender:

```text
timeout;
retry;
circuit breaker;
bulkhead;
idempotência;
webhook;
SOAP;
XML;
CSV;
SFTP;
batch;
RabbitMQ;
Kafka;
evento;
schema evolution;
DLQ;
outbox;
inbox;
saga;
CDC.
```

A pergunta não é “a integração funciona?”.

A pergunta é:

```text
O que acontece quando ela falha parcialmente?
```

---

### M14 — Docker, CI/CD, Kubernetes e Cloud

Código que só funciona localmente não basta.

Você precisa entender como a aplicação vai para ambiente.

Aqui entram:

```text
Docker;
Dockerfile;
imagem;
container;
Compose;
pipeline;
GitHub Actions;
Kubernetes;
Ingress;
probes;
resources;
HPA;
Helm;
AWS;
RDS;
SQS/SNS;
custos.
```

Não é para virar DevOps puro.

É para ser backend que entende produção.

---

### M15 — Observabilidade, performance, concorrência e produção

Produção exige leitura.

Você precisa saber observar o sistema.

Aqui entram:

```text
logs estruturados;
correlation ID;
Actuator;
Micrometer;
SLI;
SLO;
SLA;
Prometheus;
Grafana;
OpenTelemetry;
alertas;
runbooks;
postmortem;
thread dump;
heap dump;
GC logs;
JVM tuning;
load testing;
HikariCP;
concorrência;
virtual threads.
```

Quem não observa, adivinha.

Engenharia não pode depender de adivinhação.

---

### M16 — Arquitetura, DDD, sistemas distribuídos e liderança técnica

Aqui juntamos tudo.

Você vai estudar:

```text
camadas;
Clean Architecture;
hexagonal;
monólito modular;
DDD;
entity;
value object;
aggregate;
repository DDD;
domain service;
use case;
domain events;
bounded context;
context map;
ACL;
event storming;
CQRS;
event sourcing;
CAP;
PACELC;
consistência eventual;
design de sistemas;
escalabilidade;
resiliência;
multi-tenancy;
arquitetura corporativa;
modernização de legado;
ADR;
RFC;
code review.
```

Arquitetura não é desenho bonito.

Arquitetura é decisão sustentada.

---

### M17 — Projeto final, carreira, entrevistas e capacidade de ensinar

No final, você precisa provar capacidade.

Não basta dizer que estudou.

Você precisa construir, documentar, defender e explicar.

O projeto final precisa mostrar:

```text
código;
API;
banco;
teste;
segurança;
integração;
observabilidade;
Docker;
pipeline;
arquitetura;
decisões;
README;
diagramas;
trade-offs;
evolução.
```

E você precisa conseguir falar sobre isso em entrevista ou banca técnica.

Quem consegue ensinar o que fez, entende melhor o que fez.

---

## Erros comuns ao olhar a formação

### Erro 1 — Querer pular base

A base parece lenta.

Mas ela sustenta todo o resto.

Pular base dá uma sensação falsa de velocidade.

Depois, quando aparece erro em Spring, JPA ou arquitetura, falta chão.

---

### Erro 2 — Achar que ferramenta resolve raciocínio

IDE ajuda.

Maven ajuda.

Spring ajuda.

IA ajuda.

Mas nenhuma ferramenta substitui entendimento.

Ferramenta acelera quem pensa bem.

Ferramenta confunde quem copia sem entender.

---

### Erro 3 — Confundir volume com evolução

Ter muitos arquivos não significa evoluir.

Ler muitos tópicos também não.

Evolução acontece quando você entende, pratica, erra, corrige e consegue explicar.

Por isso, a grade é grande, mas o objetivo não é “passar por ela”.

O objetivo é ser transformado por ela.

---

### Erro 4 — Achar que arquitetura vem só no final

Arquitetura como disciplina avançada vem mais tarde.

Mas pensamento arquitetural começa cedo.

Quando você escolhe um nome de método, separa uma responsabilidade ou evita acoplamento, já está treinando arquitetura em pequena escala.

O final só amplia essa visão.

---

### Erro 5 — Achar que backend é só API REST

API REST é uma parte.

Backend envolve:

```text
regra;
estado;
dado;
integração;
segurança;
concorrência;
falha;
observabilidade;
evolução;
operação;
arquitetura.
```

A formação precisa mostrar tudo isso.

---

## Diagnóstico rápido: como saber onde você está

Sem transformar isso em prova, pense nas perguntas abaixo.

Se você ainda não sabe responder, tudo bem. A formação existe para construir essas respostas.

```text
Eu sei explicar o que acontece quando rodo um programa Java?
Eu sei por que Java usa JVM?
Eu sei organizar um projeto sem depender da IDE?
Eu sei escrever código simples sem copiar?
Eu sei modelar uma regra de negócio em classe?
Eu sei quando usar List, Set ou Map?
Eu sei escrever teste útil?
Eu sei ler uma query SQL?
Eu sei explicar transação?
Eu sei criar uma API REST com validação e erro decente?
Eu sei proteger endpoint?
Eu sei lidar com falha de integração?
Eu sei observar aplicação em produção?
Eu sei explicar trade-off arquitetural?
```

Essas perguntas vão aparecer ao longo da formação.

Não como cobrança vazia.

Como norte.

---

## O que precisa ficar claro ao final desta aula

Ao final desta aula, você precisa entender que a formação tem uma intenção.

Ela não é uma sequência de assuntos soltos.

Ela começa no ambiente porque profissional precisa ter controle da própria máquina.

Ela passa por Java básico porque tudo depende disso.

Ela aprofunda Java Core porque comportamento importa.

Ela entra em OO porque backend modela domínio.

Ela entra em banco porque dado é central.

Ela entra em Spring porque é a ferramenta profissional dominante no ecossistema Java Backend.

Ela entra em segurança porque sistema real precisa proteger acesso e dados.

Ela entra em integração porque sistemas conversam.

Ela entra em produção porque software precisa operar.

Ela entra em arquitetura porque sistemas crescem.

Ela entra em projeto final porque conhecimento precisa ser demonstrado.

Esse é o mapa.

A partir da próxima aula, começamos a preparar o estudo para percorrer esse mapa sem virar apenas colecionador de documentos.

---

## Pequena prática recomendada

Esta aula não precisa de exercício de código.

Mas precisa de uma prática de consciência.

Abra seu diário de bordo e escreva:

```markdown
# Mapa da formação

## O que eu achava que era aprender Java Backend
...

## O que agora entendi que envolve uma formação completa
...

## Os módulos que mais parecem fáceis para mim
...

## Os módulos que mais parecem difíceis para mim
...

## O tipo de profissional que quero me tornar ao final
...

## O que eu não posso mais fazer
Exemplo: copiar sem entender, pular base, estudar sem registrar, ignorar erro.
```

Esse registro vai servir como ponto de partida.

Mais tarde, você vai voltar nele e perceber a evolução.

---

## Fechamento da aula

A formação é grande porque o objetivo é grande.

Mas grande não pode significar confuso.

Daqui para frente, cada aula precisa cumprir um papel.

Algumas vão ensinar fundamento.

Algumas vão ensinar ferramenta.

Algumas vão ensinar raciocínio.

Algumas vão ensinar prática.

Algumas vão corrigir vícios.

Algumas vão abrir visão arquitetural.

O importante é que todas apontem para o mesmo destino:

```text
formar um desenvolvedor Java Backend forte,
com base para atuar em nível sênior,
e evoluir para pensamento de engenharia e arquitetura.
```

Esse é o mapa.

Agora começa a caminhada.
