# 244 — M10.22 — Revisão técnica: Design Patterns aplicados ao Backend

## Objetivo da aula

Nesta aula, vamos consolidar o módulo de Design Patterns.

Você estudou vários padrões de projeto, mas o ponto mais importante agora não é decorar nomes.

O ponto mais importante é saber responder:

```text
qual problema eu tenho?
qual padrão resolve esse tipo de problema?
esse padrão é necessário aqui?
como aplicar sem exagerar?
como isso aparece em backend real?
como isso vai aparecer depois com ferramentas e Spring?
```

Design Pattern não é enfeite.

Design Pattern é ferramenta de raciocínio.

Ao final desta aula, você deve conseguir:

```text
revisar todos os padrões estudados no módulo;
classificar padrões por intenção;
comparar padrões parecidos;
identificar sintomas de código ruim;
escolher padrão pelo problema;
evitar excesso de abstração;
refatorar fluxo backend com padrões;
entender como os padrões aparecem em arquitetura;
preparar o terreno para ferramentas profissionais;
preparar o terreno para Spring;
aprofundar quando o assunto exigir profundidade real.
```

---

## Aviso importante sobre profundidade

A partir daqui, quando entrarmos em ferramentas importantes, ecossistema Java, build, testes, banco, containers, observabilidade e Spring, a ideia não será apenas citar ou conectar superficialmente.

A ideia será aprofundar de verdade.

Quando o assunto exigir, vamos entrar em:

```text
conceito;
por que existe;
problema que resolve;
como funciona por dentro;
como usar;
como testar;
erros comuns;
boas práticas;
como aparece no mercado;
como aparece em projetos reais;
como explicar em entrevista;
como aplicar em backend profissional.
```

Ou seja:

```text
não é só conectar.
é dominar o fundamento e a aplicação.
```

---

# Parte 1 — O que é um Design Pattern de verdade

Um Design Pattern é uma solução recorrente para um problema recorrente de projeto de software.

Ele não é:

```text
classe bonita;
nome difícil;
obrigação;
moda;
receita para usar em tudo.
```

Ele é:

```text
vocabulário técnico;
forma de organizar código;
forma de reduzir acoplamento;
forma de aumentar coesão;
forma de proteger regras;
forma de deixar mudança menos dolorosa.
```

Exemplo:

```text
Tenho várias regras de frete que mudam.
Strategy pode ajudar.

Tenho muitos ifs de status.
State pode ajudar.

Tenho muitos objetos reagindo a um evento.
Observer pode ajudar.

Tenho uma API externa incompatível.
Adapter pode ajudar.

Tenho fluxo complexo de várias chamadas.
Facade pode ajudar.
```

---

## Regra principal

```text
Não escolha o padrão pelo nome.
Escolha o padrão pelo problema.
```

---

# Parte 2 — Frase arquitetural do módulo

Durante o módulo, usamos várias vezes:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Essa frase continua valendo.

Os padrões entram para organizar responsabilidades.

Exemplo:

```text
Strategy:
organiza variações de regra.

Factory:
organiza criação.

Builder:
organiza construção complexa.

Adapter:
organiza integração incompatível.

Facade:
organiza fluxo complexo.

State:
organiza comportamento por status.

Command:
organiza ações executáveis.

Observer:
organiza reações a eventos.

Decorator:
organiza comportamentos extras.

Proxy:
organiza controle de acesso ao objeto real.

Composite:
organiza árvore.

Iterator:
organiza navegação.

Visitor:
organiza operações sobre estrutura.

Interpreter:
organiza regras expressivas.
```

Mas nenhum deles anula a arquitetura.

---

# Parte 3 — Categorias dos padrões estudados

Os padrões geralmente são classificados em três grupos.

## Criacionais

Focam na criação de objetos.

Estudamos:

```text
Factory;
Builder.
```

Eles respondem:

```text
como criar objetos sem espalhar new e regras de construção pelo sistema?
```

---

## Estruturais

Focam na composição de classes e objetos.

Estudamos:

```text
Adapter;
Facade;
Decorator;
Proxy;
Composite;
Flyweight;
Bridge.
```

Eles respondem:

```text
como organizar a estrutura dos objetos?
como conectar partes?
como reduzir acoplamento estrutural?
como evitar explosão de classes?
como compartilhar objetos?
```

---

## Comportamentais

Focam na comunicação e comportamento entre objetos.

Estudamos:

```text
Strategy;
Template Method;
Chain of Responsibility;
State;
Command;
Observer;
Mediator;
Memento;
Iterator;
Visitor;
Interpreter.
```

Eles respondem:

```text
como objetos se comportam?
como variam regras?
como coordenam ações?
como percorrem dados?
como reagem a eventos?
como representam regras?
```

---

# Parte 4 — Lista completa do módulo

Você estudou:

```text
M10.01 — Introdução a Design Patterns
M10.02 — Strategy
M10.03 — Factory
M10.04 — Builder
M10.05 — Adapter
M10.06 — Facade
M10.07 — Template Method
M10.08 — Chain of Responsibility
M10.09 — State
M10.10 — Command
M10.11 — Observer
M10.12 — Decorator
M10.13 — Proxy
M10.14 — Composite
M10.15 — Flyweight
M10.16 — Bridge
M10.17 — Mediator
M10.18 — Memento
M10.19 — Iterator
M10.20 — Visitor
M10.21 — Interpreter
```

Agora vamos revisar por intenção.

---

# Parte 5 — Padrões por problema

## Quando tenho várias regras alternativas

Use como candidato:

```text
Strategy
```

Exemplos:

```text
cálculo de frete;
cálculo de desconto;
política de comissão;
política de prioridade;
regra de remuneração;
regra de roteamento.
```

Pergunta-chave:

```text
tenho várias formas de fazer a mesma coisa?
```

---

## Quando preciso criar objetos com regra

Use como candidato:

```text
Factory
```

Exemplos:

```text
criar gateway por provedor;
criar política por tipo;
criar handler por status;
criar mensagem por template;
criar strategy por configuração.
```

Pergunta-chave:

```text
a criação está cheia de if espalhado?
```

---

## Quando preciso montar objeto complexo

Use como candidato:

```text
Builder
```

Exemplos:

```text
request complexa;
DTO grande;
relatório;
documento;
payload de integração;
objeto de teste;
fixture.
```

Pergunta-chave:

```text
o construtor ficou enorme ou ilegível?
```

---

## Quando preciso adaptar integração externa

Use como candidato:

```text
Adapter
```

Exemplos:

```text
API externa de pagamento;
serviço legado;
client Oracle;
client SAP;
client mensageria;
client transportadora.
```

Pergunta-chave:

```text
o contrato externo é diferente do contrato que meu sistema quer usar?
```

---

## Quando preciso simplificar fluxo complexo

Use como candidato:

```text
Facade
```

Exemplos:

```text
checkout;
criação completa de OS;
importação;
reagendamento;
provisão;
aprovação;
jornada digital.
```

Pergunta-chave:

```text
quem chama precisa conhecer detalhes demais do fluxo?
```

---

## Quando tenho fluxo fixo com etapas variáveis

Use como candidato:

```text
Template Method
```

Exemplos:

```text
processamento de arquivo;
validação padrão;
envio de notificação;
importação;
exportação;
ciclo de aprovação.
```

Pergunta-chave:

```text
o esqueleto é sempre igual, mas algumas etapas mudam?
```

---

## Quando tenho sequência de validações ou handlers

Use como candidato:

```text
Chain of Responsibility
```

Exemplos:

```text
validações de request;
validação de OS;
validação de atividade;
alçadas;
pipeline de aprovação;
roteamento por handlers.
```

Pergunta-chave:

```text
tenho uma sequência de verificações ou handlers encadeados?
```

---

## Quando comportamento muda por status

Use como candidato:

```text
State
```

Exemplos:

```text
pedido criado/pago/cancelado;
OS aberta/concluída/cancelada;
atividade agendada/em andamento/concluída/frustrada;
transação pendente/aprovada/recusada.
```

Pergunta-chave:

```text
os ifs por status estão crescendo?
```

---

## Quando preciso encapsular uma ação

Use como candidato:

```text
Command
```

Exemplos:

```text
aprovar transação;
recusar transação;
enviar mensagem;
mover para fila;
reprocessar;
executar ação assíncrona;
auditar comando.
```

Pergunta-chave:

```text
essa ação precisa ser registrada, enfileirada, executada depois ou reprocessada?
```

---

## Quando vários interessados reagem a algo

Use como candidato:

```text
Observer
```

Exemplos:

```text
pedido pago;
OS concluída;
atividade frustrada;
transação aprovada;
importação finalizada;
mensagem enviada.
```

Pergunta-chave:

```text
um fato aconteceu e várias partes precisam reagir?
```

---

## Quando preciso adicionar comportamento extra

Use como candidato:

```text
Decorator
```

Exemplos:

```text
log;
métrica;
cache;
validação;
autorização;
auditoria;
normalização;
retry.
```

Pergunta-chave:

```text
quero adicionar comportamento mantendo o mesmo contrato?
```

---

## Quando preciso controlar acesso ao objeto real

Use como candidato:

```text
Proxy
```

Exemplos:

```text
autorização;
lazy loading;
cache de acesso;
transação;
segurança;
objeto remoto;
controle de custo.
```

Pergunta-chave:

```text
preciso de um intermediário entre consumidor e objeto real?
```

---

## Quando tenho árvore ou parte-todo

Use como candidato:

```text
Composite
```

Exemplos:

```text
menus;
categorias;
permissões;
checklists;
pacotes de serviço;
árvore organizacional.
```

Pergunta-chave:

```text
tenho folhas e grupos que devem ser tratados pelo mesmo contrato?
```

---

## Quando tenho muitos objetos repetidos

Use como candidato:

```text
Flyweight
```

Exemplos:

```text
permissões;
templates;
tipos de serviço;
códigos de ocorrência;
produtos de referência;
dados auxiliares.
```

Pergunta-chave:

```text
há muita repetição de dados imutáveis?
```

---

## Quando duas dimensões variam

Use como candidato:

```text
Bridge
```

Exemplos:

```text
relatório e formato;
notificação e canal;
pagamento e provedor;
documento e renderizador;
arquivo e storage.
```

Pergunta-chave:

```text
estou criando classes por combinação?
```

---

## Quando vários objetos conversam demais

Use como candidato:

```text
Mediator
```

Exemplos:

```text
chat;
central de atendimento;
módulos que interagem;
componentes de uma tela;
coordenação interna.
```

Pergunta-chave:

```text
há acoplamento muitos-para-muitos entre objetos?
```

---

## Quando preciso restaurar estado anterior

Use como candidato:

```text
Memento
```

Exemplos:

```text
undo;
snapshot;
histórico de edição;
restaurar configuração;
rascunho.
```

Pergunta-chave:

```text
preciso voltar para um estado anterior?
```

---

## Quando preciso percorrer dados sem expor estrutura

Use como candidato:

```text
Iterator
```

Exemplos:

```text
lote paginado;
arquivo;
árvore;
coleção customizada;
API paginada.
```

Pergunta-chave:

```text
quero percorrer sem expor como os dados são armazenados ou buscados?
```

---

## Quando preciso aplicar várias operações em uma estrutura

Use como candidato:

```text
Visitor
```

Exemplos:

```text
validar checklist;
exportar documento;
contar elementos;
calcular total;
gerar resumo.
```

Pergunta-chave:

```text
a estrutura é estável e novas operações aparecem?
```

---

## Quando preciso interpretar regras ou expressões

Use como candidato:

```text
Interpreter
```

Exemplos:

```text
filtros dinâmicos;
regras configuráveis;
DSL simples;
motor de regras simples;
elegibilidade.
```

Pergunta-chave:

```text
tenho uma pequena linguagem ou expressão para avaliar?
```

---

# Parte 6 — Tabela de decisão rápida

| Sintoma no código | Padrão candidato |
|---|---|
| Muitos `if` escolhendo algoritmo | Strategy |
| Muitos `if` criando objetos | Factory |
| Construtor enorme | Builder |
| API externa incompatível | Adapter |
| Fluxo complexo exposto para quem chama | Facade |
| Fluxo fixo com etapas variáveis | Template Method |
| Várias validações em sequência | Chain of Responsibility |
| Muitos `if` por status | State |
| Ação precisa ser enfileirada/auditada/reexecutada | Command |
| Vários interessados reagem a um evento | Observer |
| Quero adicionar log/cache/métrica sem mexer no objeto | Decorator |
| Quero controlar acesso/lazy/cache ao objeto real | Proxy |
| Tenho árvore de grupos e itens | Composite |
| Muitos objetos repetidos e imutáveis | Flyweight |
| Duas dimensões variando e criando combinações | Bridge |
| Objetos conversando muitos-para-muitos | Mediator |
| Preciso salvar/restaurar estado | Memento |
| Preciso percorrer fonte sem expor estrutura | Iterator |
| Preciso aplicar operações em estrutura estável | Visitor |
| Preciso interpretar regra/DSL | Interpreter |

---

# Parte 7 — Comparações que confundem

## Strategy vs State

## Strategy

Você escolhe uma política.

```text
CalcularFreteSedex;
CalcularFretePac;
CalcularFreteRetirada.
```

A escolha costuma vir de fora:

```text
tipo de entrega;
configuração;
cliente;
parâmetro.
```

## State

O comportamento depende do estado interno do objeto.

```text
PedidoCriadoState;
PedidoPagoState;
PedidoCanceladoState.
```

O próprio ciclo de vida muda o comportamento.

## Regra prática

```text
Strategy:
variação de algoritmo.

State:
variação por status/ciclo de vida.
```

---

## Strategy vs Template Method

## Strategy

Troca o algoritmo inteiro ou uma política.

## Template Method

Mantém esqueleto fixo e troca etapas.

Regra prática:

```text
Strategy:
composição.

Template Method:
herança com fluxo fixo.
```

---

## Chain vs Command

## Chain

Sequência de handlers.

```text
ValidadorCliente -> ValidadorProduto -> ValidadorPagamento.
```

## Command

Ação encapsulada.

```text
AprovarTransacaoCommand.
```

Regra prática:

```text
Chain:
quem trata ou valida em sequência?

Command:
qual ação executar?
```

---

## Observer vs Mediator

## Observer

Um fato acontece e interessados reagem.

```text
PedidoPagoEvent -> NotificacaoListener -> AuditoriaListener.
```

## Mediator

Participantes conversam por um coordenador.

```text
Cliente -> Mediator -> Analista.
```

Regra prática:

```text
Observer:
evento e reação.

Mediator:
comunicação coordenada.
```

---

## Decorator vs Proxy

Ambos podem ter estrutura parecida.

## Decorator

Intenção:

```text
adicionar comportamento.
```

## Proxy

Intenção:

```text
controlar acesso ao objeto real.
```

Regra prática:

```text
Decorator:
enriquecer.

Proxy:
intermediar/controlar.
```

---

## Adapter vs Facade

## Adapter

Adapta contrato incompatível.

## Facade

Simplifica subsistema complexo.

Regra prática:

```text
Adapter:
compatibilidade.

Facade:
simplicidade.
```

---

## Bridge vs Strategy

## Strategy

Troca algoritmo dentro de um contexto.

## Bridge

Separa duas dimensões de variação.

Regra prática:

```text
Strategy:
uma variação principal.

Bridge:
duas hierarquias independentes.
```

---

## Composite vs Visitor

## Composite

Estrutura em árvore.

## Visitor

Operação sobre estrutura.

Regra prática:

```text
Composite:
como representar árvore?

Visitor:
o que fazer com a árvore?
```

---

## Iterator vs Visitor

## Iterator

Percorre.

## Visitor

Processa por tipo.

Regra prática:

```text
Iterator:
como navegar?

Visitor:
qual operação aplicar?
```

---

## Interpreter vs Specification

## Specification

Regra de domínio ou critério de seleção.

## Interpreter

Expressão/linguagem/DSL.

Regra prática:

```text
Specification:
regra combinável de negócio.

Interpreter:
interpretação de expressão ou gramática.
```

Em muitos sistemas, os dois ficam parecidos.

---

## Memento vs Auditoria

## Memento

Restaura estado.

## Auditoria

Rastreia ação.

Regra prática:

```text
Memento:
voltar estado.

Auditoria:
saber quem fez o quê.
```

---

# Parte 8 — Excesso de padrão é problema

Um erro comum é tentar usar padrão em tudo.

Exemplo ruim:

```text
Factory para criar uma classe simples sem variação.
Strategy para um if que nunca muda.
Chain para duas validações simples.
Visitor para uma lista com um tipo só.
Interpreter para uma regra fixa.
Bridge sem duas dimensões reais.
```

Design Patterns devem reduzir complexidade, não aumentar.

Pergunta principal:

```text
o código ficou mais fácil de mudar, testar e entender?
```

Se a resposta for não, o padrão pode estar atrapalhando.

---

# Parte 9 — Sinais de overengineering

Cuidado quando aparecer:

```text
muitas interfaces sem motivo;
muitas classes para regra simples;
nomes genéricos demais;
abstração sem variação real;
padrão aplicado antes de existir problema;
dificuldade para explicar o fluxo;
testes mais difíceis;
debug mais confuso;
time não consegue manter.
```

O objetivo não é parecer sofisticado.

O objetivo é resolver o problema.

---

# Parte 10 — Padrões e testes

Design Patterns bem aplicados facilitam testes.

## Strategy

Testa cada regra isolada.

```text
FreteSedexTest;
FreteRetiradaTest.
```

## State

Testa comportamento por status.

```text
PedidoPagoStateTest;
PedidoCanceladoStateTest.
```

## Chain

Testa cada validador e a cadeia.

```text
ValidadorClienteTest;
PipelineValidacaoTest.
```

## Command

Testa ação isolada.

```text
AprovarTransacaoCommandTest.
```

## Observer

Testa se evento publicado aciona listeners.

```text
PedidoPagoEventTest.
```

## Adapter

Testa tradução entre contrato externo e interno.

```text
SapProvisionamentoAdapterTest.
```

## Facade

Testa fluxo de alto nível com dependências simuladas.

```text
ImportacaoFacadeTest.
```

## Builder

Facilita montar objetos em testes.

```text
PedidoTestBuilder.
```

---

# Parte 11 — Padrões em uma arquitetura backend

Um fluxo de backend pode combinar vários padrões.

Exemplo:

```text
POST /ordens-servico/{id}/reagendar
```

Internamente:

```text
Controller recebe request.
Use case coordena.
Chain valida regras.
State verifica se status permite reagendar.
Command encapsula ação de reagendar.
Repository salva.
Observer publica evento OS_REAGENDADA.
Listeners geram histórico, auditoria e mensageria.
Adapter chama API externa se necessário.
Decorator adiciona log/métrica.
Proxy controla transação/autorização futuramente.
```

O fluxo não precisa usar tudo.

Mas entender cada padrão ajuda a reconhecer onde ele entra.

---

# Parte 12 — Exemplo de refatoração guiada

## Código problemático

Imagine um service assim:

```java
public void reagendar(String osId, Request request) {
    if (request == null) {
        throw new RuntimeException("Request inválido");
    }

    OrdemServico os = repository.buscar(osId);

    if (os.status().equals("CONCLUIDA")) {
        throw new RuntimeException("Não pode reagendar");
    }

    if (os.status().equals("CANCELADA")) {
        throw new RuntimeException("Não pode reagendar");
    }

    if (request.data().isBefore(LocalDate.now())) {
        throw new RuntimeException("Data inválida");
    }

    os.setData(request.data());
    os.setPeriodo(request.periodo());
    os.setStatus("REAGENDADA");

    repository.save(os);

    historico.registrar(os);
    auditoria.registrar(os);
    whatsapp.enviar(os.cliente());
    fila.mover(os);
}
```

Problemas:

```text
validação misturada;
status em if;
persistência misturada;
histórico misturado;
mensageria misturada;
fila misturada;
difícil testar;
difícil mudar;
difícil reaproveitar.
```

---

## Possível refatoração

Sem exagerar, você poderia separar:

```text
Validadores:
Chain of Responsibility.

Status:
State ou regra na entidade.

Ação:
Command ou Use Case claro.

Reações pós-reagendamento:
Observer.

Integração WhatsApp:
Adapter.

Fluxo simplificado para chamada externa:
Facade, se houver subsistema complexo.
```

Possível fluxo:

```text
ReagendarOrdemServicoUseCase
  -> ValidacaoReagendamentoChain
  -> OrdemServico.reagendar(...)
  -> OrdemServicoRepository.salvar(...)
  -> EventPublisher.publicar(new OrdemServicoReagendadaEvent(...))
```

Listeners:

```text
RegistrarHistoricoReagendamentoListener
RegistrarAuditoriaReagendamentoListener
EnviarMensagemReagendamentoListener
MoverFilaReagendamentoListener
```

Isso deixa mais claro.

---

## Mas cuidado

Nem todo service precisa virar 20 classes.

Se a regra for pequena, mantenha simples.

A decisão depende de:

```text
complexidade atual;
chance de mudança;
testabilidade;
reuso;
clareza;
padrão do time;
criticidade do fluxo.
```

---

# Parte 13 — Mini arquitetura usando padrões

Um desenho possível:

```text
controller
  ReagendamentoController

application/usecase
  ReagendarOrdemServicoUseCase

application/validation
  ValidacaoReagendamentoHandler
  ValidarDataHandler
  ValidarStatusHandler
  ValidarPeriodoHandler

domain
  OrdemServico
  StatusOrdemServico
  OrdemServicoReagendadaEvent

application/port
  OrdemServicoRepository
  MensageriaGateway
  AuditoriaGateway
  HistoricoGateway

infra
  OrdemServicoRepositoryPostgres
  WhatsAppAdapter
  AuditoriaPostgresAdapter

event
  EventPublisher
  OrdemServicoReagendadaListener
```

Padrões envolvidos:

```text
Chain:
validadores.

State:
status da OS, se necessário.

Observer:
evento de OS reagendada.

Adapter:
WhatsApp/SAP/serviço externo.

Repository:
porta de persistência, mesmo não sendo GoF clássico.

Use Case:
orquestração da aplicação.
```

---

# Parte 14 — Padrões GoF vs padrões arquiteturais

Nem tudo que usamos em backend é GoF.

GoF são os padrões clássicos do livro Design Patterns.

Mas backend moderno também usa padrões arquiteturais.

Exemplos:

```text
Repository;
DTO;
Use Case;
Service Layer;
Controller;
Gateway;
Port and Adapter;
Unit of Work;
Outbox;
CQRS;
Event Sourcing;
Specification;
Dependency Injection.
```

Alguns vamos aprofundar muito quando entrarmos em ferramentas e Spring.

---

# Parte 15 — Como isso aparece no Spring futuramente

Quando entrarmos em Spring, não será apenas uma conexão rasa.

Vamos aprofundar.

Exemplos:

## Dependency Injection

Você vai entender:

```text
por que existe;
como reduz acoplamento;
como o Spring cria objetos;
como injeta dependências;
ciclo de vida de beans;
escopos;
erros comuns;
injeção por construtor;
testes com mocks.
```

Relação com padrões:

```text
Factory;
Strategy;
Decorator;
Proxy;
DIP.
```

---

## Spring AOP e Proxies

Você vai entender:

```text
proxy dinâmico;
interceptação;
@Transactional;
@Cacheable;
@PreAuthorize;
logs;
métricas;
limitações de self-invocation;
diferença entre JDK proxy e CGLIB em alto nível.
```

Relação com padrões:

```text
Proxy;
Decorator;
Command;
Template Method.
```

---

## Spring Data

Você vai entender:

```text
Repository;
query method;
JPQL;
native query;
paginação;
sort;
Specification;
Criteria;
transação;
N+1;
lazy/eager;
mapeamento JPA.
```

Relação com padrões:

```text
Repository;
Proxy;
Iterator;
Specification;
Interpreter em filtros.
```

---

## Spring MVC / REST

Você vai entender:

```text
Controller;
DTO;
Request;
Response;
validation;
exception handler;
status code;
OpenAPI;
contrato com front;
paginação;
filtros;
upload/download.
```

Relação com padrões:

```text
Adapter;
Facade;
DTO;
Command em requests;
Strategy em validações.
```

---

## Mensageria

Você vai entender:

```text
eventos;
filas;
retry;
DLQ;
idempotência;
outbox;
consumer;
producer;
mensagens duplicadas;
ordem;
observabilidade.
```

Relação com padrões:

```text
Observer;
Command;
Adapter;
Strategy;
State.
```

---

## Testes

Você vai entender:

```text
unitário;
integração;
contrato;
testcontainers;
mock;
spy;
stub;
fixtures;
builders;
cenários de erro;
testes de repository;
testes de controller;
testes com banco.
```

Relação com padrões:

```text
Builder;
Factory;
Adapter;
Strategy;
Repository;
Use Case.
```

---

# Parte 16 — Como ferramentas importantes entram no plano

Quando chegarmos em ferramentas profissionais, vamos aprofundar:

```text
JDK;
Maven;
Gradle;
Git;
JUnit;
Mockito;
AssertJ;
Postman/Insomnia;
Docker;
Docker Compose;
PostgreSQL;
MongoDB quando fizer sentido;
Redis;
Kafka/RabbitMQ quando fizer sentido;
OpenAPI/Swagger;
Sonar;
logs;
métricas;
tracing;
CI/CD;
GitHub Actions;
Testcontainers;
IDE e debugging.
```

Não será só uma lista.

Cada ferramenta será tratada com:

```text
por que existe;
problema que resolve;
como instalar/configurar;
como usar no projeto;
boas práticas;
erros comuns;
exercício prático;
como aparece em empresa;
como explicar tecnicamente.
```

---

# Parte 17 — Padrões que mais aparecem em backend Java

Na prática, os que você mais verá são:

```text
Strategy;
Factory;
Builder;
Adapter;
Facade;
Template Method;
Chain;
State;
Command;
Observer;
Decorator;
Proxy;
Composite em árvores;
Iterator em paginação/lotes;
Specification/Interpreter em filtros;
Repository;
DTO;
Dependency Injection.
```

Alguns aparecem explicitamente.

Outros aparecem escondidos nos frameworks.

Exemplo:

```text
@Transactional usa proxy.
@Cacheable usa proxy/interceptor.
Bean creation usa factory/container.
Filtros HTTP lembram Chain.
Spring MVC usa adapter/dispatcher.
Events lembram Observer.
Repositories usam proxies.
```

---

# Parte 18 — Como responder em entrevista

Se perguntarem:

```text
Você conhece Design Patterns?
```

Uma resposta boa:

```text
Conheço e procuro aplicar pelo problema, não pelo nome. 
Por exemplo, uso Strategy quando há variações de regra, Adapter para isolar integrações externas, Chain para pipelines de validação, State quando o comportamento muda por status, Observer para reações a eventos e Builder para montar objetos complexos de forma legível. 
Também tomo cuidado para não aplicar padrão quando um código simples resolve melhor.
```

Se perguntarem:

```text
Qual padrão você mais usa em backend?
```

Resposta possível:

```text
Em backend, vejo muito Strategy, Adapter, Builder, Factory, Chain, Observer e Proxy. 
Com Spring, muitos proxies aparecem por baixo em transação, segurança e cache. 
Também uso bastante a ideia de Repository, DTO, Use Case e portas/adapters para separar domínio, aplicação e infraestrutura.
```

Se perguntarem:

```text
Quando não usar Design Pattern?
```

Resposta forte:

```text
Quando o padrão aumenta complexidade sem resolver um problema real. Se uma regra é simples, fixa e fácil de testar, um código direto pode ser melhor. O padrão deve melhorar manutenção, teste e evolução, não apenas deixar o código sofisticado.
```

---

# Parte 19 — Exercício de diagnóstico

Leia os sintomas e indique o padrão candidato.

## Caso 1

Você tem:

```text
if (tipoFrete == SEDEX)
if (tipoFrete == PAC)
if (tipoFrete == RETIRADA)
```

Candidato:

```text
Strategy
```

---

## Caso 2

Você tem:

```text
if (status == PENDENTE) aprovar
if (status == APROVADA) não aprovar
if (status == RECUSADA) não aprovar
```

Candidato:

```text
State
```

---

## Caso 3

Você chama API externa que retorna:

```text
cod_cli
vl_total
dt_emissao
```

Mas seu sistema quer:

```text
codigoCliente
valorTotal
dataEmissao
```

Candidato:

```text
Adapter
```

---

## Caso 4

Depois que uma OS é concluída, precisa:

```text
gerar histórico;
auditar;
enviar NPS;
atualizar fila;
publicar métrica.
```

Candidato:

```text
Observer
```

---

## Caso 5

Você tem menu:

```text
Cadastros
  Produtos
  Clientes
Operação
  OS
  Atividades
```

Candidato:

```text
Composite
```

---

## Caso 6

Você precisa processar 1 milhão de registros sem carregar tudo.

Candidato:

```text
Iterator paginado
```

---

## Caso 7

Você precisa permitir regra configurável:

```text
VALOR_MAIOR_QUE:1000 E STATUS_IGUAL:PAGO
```

Candidato:

```text
Interpreter
```

---

## Caso 8

Você precisa adicionar log e métrica a um gateway sem alterar o gateway real.

Candidato:

```text
Decorator
```

---

## Caso 9

Você precisa controlar transação antes e depois de chamar um service.

Candidato:

```text
Proxy
```

---

## Caso 10

Você tem:

```text
RelatorioVendasPdf
RelatorioVendasCsv
RelatorioFinanceiroPdf
RelatorioFinanceiroCsv
```

Candidato:

```text
Bridge
```

---

# Parte 20 — Exercício prático de revisão

## Contexto

Modele um fluxo de aprovação de transação.

Regras:

```text
Transação começa PENDENTE.
Pode ser APROVADA ou RECUSADA.
Toda decisão gera auditoria.
Toda decisão notifica solicitante.
Antes da decisão, deve passar por validações.
A decisão deve ser encapsulada como ação.
```

---

## Padrões candidatos

Use:

```text
State:
status da transação.

Chain:
validações antes da decisão.

Command:
aprovar/recusar.

Observer:
reações após decisão.

Adapter:
notificação externa.

Builder:
montar request/resultado, se necessário.
```

---

## Estrutura sugerida

```text
domain
  Transacao
  TransacaoStatus
  EstadoTransacao
  EstadoPendente
  EstadoAprovada
  EstadoRecusada

application
  AprovarTransacaoCommand
  RecusarTransacaoCommand
  ValidacaoTransacaoHandler
  ValidarUsuarioAprovadorHandler
  ValidarValorHandler

event
  TransacaoAprovadaEvent
  TransacaoRecusadaEvent
  EventPublisher
  AuditoriaListener
  NotificacaoListener

infra
  NotificacaoEmailAdapter
  AuditoriaConsoleGateway
```

---

## Critérios

```text
não colocar tudo em um service gigante;
não usar padrão sem motivo;
cada classe deve ter responsabilidade clara;
o fluxo principal deve ser fácil de ler;
cada padrão deve ser justificável.
```

---

# Parte 21 — Simulado final do módulo

## Questão 1

Quando o comportamento muda conforme status interno do objeto, o padrão candidato é:

```text
A) State
B) Adapter
C) Builder
D) Flyweight
```

---

## Questão 2

Quando uma API externa tem contrato incompatível com seu domínio, o padrão candidato é:

```text
A) Adapter
B) Memento
C) Iterator
D) Composite
```

---

## Questão 3

Quando vários listeners precisam reagir a um evento de domínio, o padrão candidato é:

```text
A) Observer
B) Builder
C) Factory
D) Bridge
```

---

## Questão 4

Quando você precisa encapsular uma ação para executar, auditar ou enfileirar, o padrão candidato é:

```text
A) Command
B) Visitor
C) Flyweight
D) Facade
```

---

## Questão 5

Quando há uma estrutura em árvore de grupos e itens, o padrão candidato é:

```text
A) Composite
B) Proxy
C) Strategy
D) Template Method
```

---

## Questão 6

Quando você precisa salvar e restaurar estado anterior, o padrão candidato é:

```text
A) Memento
B) Chain
C) Adapter
D) Factory
```

---

## Questão 7

Quando duas dimensões variam independentemente e estão gerando classes por combinação, o padrão candidato é:

```text
A) Bridge
B) Singleton
C) Command
D) Iterator
```

---

## Questão 8

Quando você precisa interpretar uma regra textual simples, o padrão candidato é:

```text
A) Interpreter
B) Decorator
C) Proxy
D) State
```

---

## Questão 9

Quando você quer adicionar cache/log/métrica sem alterar o objeto original, o padrão candidato é:

```text
A) Decorator
B) Adapter
C) Memento
D) Visitor
```

---

## Questão 10

Quando você precisa controlar acesso ou lazy loading a um objeto real, o padrão candidato é:

```text
A) Proxy
B) Composite
C) Template Method
D) Builder
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
7. A
8. A
9. A
10. A
```

---

# Parte 22 — Checklist final do módulo

Marque mentalmente:

```text
[ ] Sei explicar por que Design Patterns existem.
[ ] Sei separar padrões criacionais, estruturais e comportamentais.
[ ] Sei escolher padrão pelo problema.
[ ] Sei diferenciar Strategy de State.
[ ] Sei diferenciar Adapter de Facade.
[ ] Sei diferenciar Decorator de Proxy.
[ ] Sei diferenciar Observer de Mediator.
[ ] Sei diferenciar Iterator de Visitor.
[ ] Sei diferenciar Memento de auditoria.
[ ] Sei diferenciar Interpreter de Strategy.
[ ] Sei aplicar padrões em backend.
[ ] Sei evitar overengineering.
[ ] Sei explicar padrões em entrevista.
[ ] Sei conectar padrões com arquitetura backend.
[ ] Estou pronto para avançar para ferramentas profissionais e depois Spring com profundidade.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é um Design Pattern?
2. Por que não devo usar padrão por moda?
3. Quais padrões criacionais estudamos?
4. Quais padrões estruturais estudamos?
5. Quais padrões comportamentais estudamos?
6. Qual padrão você usaria para regra variável?
7. Qual padrão você usaria para integração externa?
8. Qual padrão você usaria para eventos e reações?
9. Qual padrão você usaria para status?
10. Qual padrão você usaria para regra textual configurável?
11. Qual padrão você mais vê utilidade no backend?
12. Qual padrão você acha mais fácil exagerar?
13. Como Spring usa proxies?
14. Como Chain aparece em filtros?
15. Como Observer aparece em eventos?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
reconhecer sintomas de código;
escolher padrões candidatos;
justificar tecnicamente a escolha;
evitar aplicação desnecessária;
combinar padrões em fluxos reais;
entender como eles aparecem no backend;
preparar a transição para ferramentas profissionais;
preparar a transição para Spring.
```

---

## Commit recomendado

Depois de concluir a revisão:

```bash
git status
git add labs/m10
git commit -m "Aula 244: revisao tecnica design patterns backend"
git status
```

Se preferir, faça commits por aula prática já criada.

---

## Fechamento

A principal ideia desta aula é:

```text
Design Patterns são ferramentas para resolver problemas recorrentes de projeto, não enfeites arquiteturais.
```

Você revisou:

```text
Strategy;
Factory;
Builder;
Adapter;
Facade;
Template Method;
Chain of Responsibility;
State;
Command;
Observer;
Decorator;
Proxy;
Composite;
Flyweight;
Bridge;
Mediator;
Memento;
Iterator;
Visitor;
Interpreter.
```

Também consolidou:

```text
comparações entre padrões;
quando usar;
quando evitar;
como aplicar em backend;
como explicar em entrevista;
como isso prepara ferramentas e Spring.
```

Na próxima aula, vamos iniciar um novo módulo:

```text
M11 — Ferramentas essenciais do Java Backend profissional.
```

A ideia será sair apenas do código Java puro e começar a aprofundar ferramentas reais de trabalho: JDK, Maven, Gradle, Git, IDE, execução de projetos, dependências, build, empacotamento, testes e preparação para Spring.
