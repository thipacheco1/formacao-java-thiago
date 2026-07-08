# 145 — M4.41 — Fechamento do Módulo 4 — Orientação a Objetos

## Objetivo da aula

Nesta aula você vai fazer o fechamento oficial do Módulo 4.

Este módulo foi dedicado à Orientação a Objetos com uma visão mais profissional, indo além de apenas criar classes com atributos e métodos.

Ao final desta aula, você deve conseguir:

```text
revisar tudo que foi estudado no Módulo 4;
identificar os principais conceitos de OO;
explicar entidade, objeto de valor, composição e agregado;
entender onde usar construtor, factory e builder;
avaliar se um objeto está anêmico;
identificar acoplamento e coesão;
entender a importância de invariantes;
entender limites do domínio;
revisar o mini-projeto de Ordem de Serviço;
preparar a transição para o próximo módulo.
```

Essa aula não é para decorar conceitos.

É para organizar a cabeça.

Você precisa sair deste módulo entendendo como pensar em objetos.

---

## O que você construiu neste módulo

Durante o Módulo 4, você saiu de uma visão básica de classe e objeto e chegou em um mini-projeto com:

```text
domínio;
entidades;
objetos de valor;
coleções protegidas;
composição;
agregados;
builder;
service de aplicação;
infraestrutura em memória;
console organizado;
operações de negócio;
histórico de ocorrências;
regras de bloqueio.
```

O mini-projeto de Ordem de Serviço foi o fechamento prático.

Ele mostrou que Orientação a Objetos não é só escrever:

```java
class Pessoa {
    String nome;
    int idade;
}
```

Orientação a Objetos de verdade envolve:

```text
modelar comportamento;
proteger estado;
dar nome correto para conceitos;
controlar regras;
organizar responsabilidades;
evitar acoplamento desnecessário;
criar código que evolui melhor.
```

---

## Mapa do Módulo 4

O Módulo 4 percorreu este caminho:

```text
1. Pensamento orientado a objetos
2. Modelagem no papel
3. Classe e objeto
4. Atributos com significado
5. Métodos de comportamento
6. Construtores
7. Encapsulamento
8. Getters e setters com critério
9. Imutabilidade
10. Composição
11. Relacionamento entre objetos
12. Objetos de valor
13. Entidades
14. Identidade
15. equals e hashCode
16. toString com critério
17. static com critério
18. final
19. Sobrecarga de construtores
20. this
21. Organização de classes
22. Pacotes de domínio
23. Modificadores de acesso
24. Coesão
25. Acoplamento
26. Colaboração entre objetos
27. Tell, Don't Ask
28. Objetos anêmicos
29. Invariantes
30. Serviços de domínio
31. Factories simples
32. Builder inicial
33. Coleções dentro de objetos
34. Composição com coleções
35. Agregados
36. Limites do domínio
37. Revisão prática
38. Mini-projeto OS Console — Parte 1
39. Mini-projeto OS Console — Parte 2
40. Mini-projeto OS Console — Parte 3
41. Fechamento do módulo
```

Esse caminho foi proposital.

Primeiro você aprendeu a criar objetos.

Depois aprendeu a proteger objetos.

Depois aprendeu a fazer objetos colaborarem.

Depois aprendeu a organizar objetos dentro de um domínio.

---

## Ideia principal do módulo

A ideia principal do Módulo 4 é:

```text
um objeto não deve ser apenas um saco de dados.
```

Um bom objeto tem:

```text
estado;
comportamento;
regras;
limites;
responsabilidade clara;
nome de domínio;
proteção contra uso inválido.
```

Exemplo fraco:

```java
pedido.setStatus(StatusPedido.PAGO);
pedido.setTotal(Dinheiro.de("100.00"));
pedido.getItens().clear();
```

Exemplo melhor:

```java
pedido.adicionarItem(...);
pedido.confirmarPagamento(valorPago);
pedido.cancelar(motivo);
```

A diferença é enorme.

No primeiro caso, qualquer código externo manipula o pedido.

No segundo, o pedido protege sua própria regra.

---

## Classe não é só arquivo

Uma classe representa uma ideia.

Durante o módulo, você viu que criar uma classe não é apenas separar código em arquivos.

Uma classe boa deve responder:

```text
o que este objeto representa?
quais dados fazem sentido nele?
quais comportamentos pertencem a ele?
quais regras ele precisa proteger?
quais objetos ele conhece?
quais objetos ele cria?
quais objetos ele não deveria conhecer?
```

Se uma classe não tem responsabilidade clara, ela vira bagunça.

Se uma classe tem responsabilidade demais, ela vira uma classe gigante.

O equilíbrio vem com prática.

---

## Atributo com significado

No começo do módulo, você viu que atributos não devem ser apenas variáveis jogadas dentro da classe.

Ruim:

```java
String status;
String tipo;
String data;
double valor;
```

Melhor:

```java
StatusOs status;
PeriodoAtendimento periodo;
Dinheiro valor;
PrioridadeOs prioridade;
```

Atributos bons ajudam o domínio a ficar mais expressivo.

Eles reduzem erro e deixam o código mais claro.

---

## Método de comportamento

Você também viu que métodos devem representar ações reais.

Ruim:

```java
setStatus(...)
setData(...)
setValor(...)
```

Melhor:

```java
reagendar(...)
concluir(...)
cancelar(...)
confirmarPagamento(...)
adicionarAtividade(...)
```

Método de comportamento expressa intenção de negócio.

Isso é mais forte do que apenas permitir alteração de campo.

---

## Encapsulamento de verdade

Encapsulamento não é só deixar atributo `private`.

Este código tem atributos privados, mas ainda é fraco:

```java
private StatusOs status;

public void setStatus(StatusOs status) {
    this.status = status;
}
```

O atributo é privado, mas qualquer código pode mudar o status sem regra.

Encapsulamento de verdade é:

```java
public void concluir() {
    if (!todasAtividadesConcluidas()) {
        throw new IllegalStateException("Todas as atividades precisam estar concluídas.");
    }

    status = StatusOs.CONCLUIDA;
}
```

Aqui o objeto protege a mudança.

Esse foi um dos pontos mais importantes do módulo.

---

## Getter e setter com critério

Você aprendeu que getter e setter não são proibidos.

Mas devem ter critério.

Getter pode fazer sentido para consulta:

```java
codigo()
cliente()
quantidadeAtividades()
resumo()
```

Setter genérico pode ser perigoso:

```java
setStatus(...)
setPeriodo(...)
setAtividades(...)
```

A pergunta correta é:

```text
eu quero permitir uma alteração ou quero permitir uma ação de negócio?
```

Se for ação de negócio, crie método com nome de negócio.

---

## Imutabilidade

Você viu que alguns objetos são melhores quando imutáveis.

Exemplos:

```text
Dinheiro;
CodigoOs;
PeriodoAtendimento;
PeriodoContrato;
CodigoPagamento.
```

Objetos de valor geralmente combinam bem com imutabilidade.

Eles não precisam mudar por dentro.

Quando um valor muda, você cria outro valor.

Isso reduz bugs e deixa o código mais previsível.

---

## Objeto de valor

Objeto de valor representa um conceito identificado pelo valor, não por identidade própria.

Exemplos:

```text
Dinheiro;
CodigoOs;
PeriodoAtendimento;
CodigoPagamento;
PeriodoContrato.
```

Características comuns:

```text
campos final;
sem setters;
validação no construtor;
equals;
hashCode;
toString;
métodos de comportamento pequenos.
```

Exemplo:

```java
CodigoOs codigo1 = new CodigoOs("OS-2026-0001");
CodigoOs codigo2 = new CodigoOs("OS-2026-0001");
```

Eles representam o mesmo valor.

---

## Entidade

Entidade tem identidade.

Exemplos:

```text
Pedido;
OrdemServico;
Contrato;
Cliente;
Pagamento.
```

Mesmo que alguns dados mudem, a entidade continua sendo a mesma entidade.

Uma OS pode ser reagendada.

Mas continua sendo a mesma OS.

Um contrato pode ser ativado.

Mas continua sendo o mesmo contrato.

A identidade normalmente está em algo como:

```text
id;
codigo;
numero;
chave de negócio.
```

---

## Identidade

Você estudou que identidade é diferente de igualdade por valor.

Um `CodigoOs` pode ser objeto de valor.

Uma `OrdemServico` é entidade.

Duas OS com o mesmo código provavelmente representam a mesma OS.

Mas duas OS com códigos diferentes, mesmo que tenham os mesmos dados, são entidades diferentes.

Esse pensamento será essencial quando chegarmos em banco de dados e JPA.

---

## equals e hashCode

Você viu que `equals` e `hashCode` precisam ser usados com critério.

Em objetos de valor, normalmente fazem muito sentido.

Exemplo:

```text
Dinheiro;
CodigoOs;
PeriodoAtendimento.
```

Em entidades, é preciso mais cuidado.

Dependendo do momento, a entidade pode ainda não ter ID.

Mais adiante, em JPA, esse assunto volta com mais profundidade.

Por enquanto, a ideia é:

```text
não gere equals/hashCode automaticamente sem pensar no conceito de identidade.
```

---

## toString com critério

Você viu que `toString` e métodos como `resumo()` ajudam na leitura e no debug.

Mas é preciso cuidado.

Bom para estudo:

```java
resumo()
```

Cuidado em sistema real:

```java
toJson()
gerarHtml()
montarResponseHttp()
```

Esses últimos já começam a misturar apresentação e domínio.

No nosso curso, usamos `resumo()` para facilitar a aprendizagem no console.

---

## static com critério

Você viu que `static` não é vilão, mas precisa ser usado com cuidado.

Bom uso:

```java
Dinheiro.de("10.00");
Dinheiro.zero();
CodigoOs.deNumero(2026, 1);
```

Uso perigoso:

```java
PedidoServiceGlobal.confirmarPagamento(...)
BancoGlobal.salvar(...)
EstadoGlobal.usuarioLogado
```

Static é útil para factory methods e constantes.

Mas pode virar acoplamento global se usado sem critério.

---

## final

Você viu `final` em:

```text
atributos;
classes;
variáveis locais;
parâmetros;
objetos de valor.
```

`final` ajuda a indicar que algo não deve mudar de referência.

Mas cuidado:

```java
private final List<ItemPedido> itens;
```

Isso não torna a lista imutável.

A referência é final.

O conteúdo da lista ainda pode mudar.

Por isso usamos métodos controlados e `List.copyOf`.

---

## this

Você estudou `this` como referência ao próprio objeto.

Ele aparece em construtores e métodos:

```java
this.codigo = codigo;
this.cliente = cliente;
```

Também aparece em builders:

```java
return this;
```

O ponto mais importante é entender que `this` representa o objeto atual.

Isso ajuda a ler código orientado a objetos.

---

## Pacotes de domínio

Você organizou classes em pacotes como:

```text
dominio.cliente
dominio.ordemservico
dominio.contrato
dominio.valor
aplicacao
infra
app
```

Essa organização prepara o pensamento de backend profissional.

Pacote não é só pasta.

Pacote representa separação de responsabilidade.

---

## Modificadores de acesso

Você usou:

```text
public;
private;
package-private;
final.
```

O uso de package-private foi muito importante em filhos de composição.

Exemplo:

```java
AtividadeOs(...)
OcorrenciaOs(...)
ItemPedido(...)
ServicoContrato(...)
```

Sem `public`, o app não consegue criar esses filhos diretamente.

Isso ajuda a reforçar que a raiz do agregado controla os filhos.

---

## Coesão

Uma classe coesa tem responsabilidade clara.

Exemplo coeso:

```text
CodigoOs valida código de OS.
PeriodoAtendimento representa data e turno.
AtividadeOs controla estado da atividade.
OrdemServico coordena regras da OS.
```

Exemplo pouco coeso:

```text
Classe que cria OS, salva banco, envia e-mail, lê console, calcula relatório e imprime menu.
```

Classe pouco coesa fica difícil de entender e manter.

---

## Acoplamento

Acoplamento é dependência entre partes do código.

Algum acoplamento sempre existe.

O problema é acoplamento desnecessário.

Exemplo ruim:

```text
OrdemServico conhecendo Scanner;
Pedido conhecendo SQL;
Contrato conhecendo HTTP;
Atividade conhecendo repositório.
```

Exemplo melhor:

```text
app conhece service;
service conhece domínio e infra;
domínio não conhece infra;
infra conhece domínio para salvar/notificar.
```

Esse desenho reduz dependência indevida.

---

## Colaboração entre objetos

OO não é uma classe fazendo tudo.

OO é colaboração.

No mini-projeto:

```text
OrdemServico usa CodigoOs;
OrdemServico usa Cliente;
OrdemServico usa PeriodoAtendimento;
OrdemServico cria AtividadeOs;
OrdemServico cria OcorrenciaOs;
Service usa repositório;
Service usa notificador;
App usa service.
```

Cada objeto tem um papel.

Isso é colaboração.

---

## Tell, Don't Ask

Você estudou a ideia:

```text
diga ao objeto o que ele deve fazer, não pergunte dados para decidir por ele fora.
```

Ruim:

```java
if (os.getStatus() != StatusOs.CONCLUIDA) {
    os.setStatus(StatusOs.CONCLUIDA);
}
```

Melhor:

```java
os.concluir();
```

A OS decide se pode concluir.

O código externo não deveria manipular as regras internas.

---

## Objetos anêmicos

Objeto anêmico tem dados, mas quase nenhum comportamento.

Exemplo:

```java
class Pedido {
    private StatusPedido status;
    private List<ItemPedido> itens;

    public StatusPedido getStatus() { ... }
    public void setStatus(StatusPedido status) { ... }
    public List<ItemPedido> getItens() { ... }
}
```

A regra acaba indo para services gigantes.

Um domínio mais rico coloca comportamento no objeto certo:

```java
pedido.adicionarItem(...);
pedido.confirmarPagamento(...);
pedido.cancelar(...);
```

Isso foi um marco do Módulo 4.

---

## Invariantes

Invariante é uma regra que precisa estar sempre verdadeira.

Exemplos:

```text
Dinheiro não pode ser nulo.
Código da OS precisa iniciar com OS-.
OS concluída não pode ser reagendada.
Pedido pago não pode ter item alterado.
Contrato ativo não pode receber serviço.
Checklist finalizado não pode ter pergunta obrigatória sem resposta.
```

Objeto bom protege invariantes.

Não deixa qualquer código externo quebrar o estado interno.

---

## Serviços de domínio

Você viu que serviço de domínio serve para regras que não pertencem naturalmente a uma única entidade.

Exemplos:

```text
PoliticaDescontoPedido;
PoliticaAlocacaoTecnico;
ElegibilidadeReagendamentoOs.
```

Mas cuidado:

```text
não crie PedidoService para roubar tudo que deveria estar em Pedido.
```

Serviço de domínio deve ser usado com critério.

---

## Factories simples

Factories ajudam a centralizar criação.

Exemplos:

```java
Pedido.novo(...)
CodigoOs.deNumero(...)
Dinheiro.de(...)
```

Factory é útil quando a criação tem nome de negócio, padrão ou conversão.

Ela evita espalhar `new` complicado em vários lugares.

---

## Builder

Builder ajuda quando a criação tem muitos dados, opcionais ou parâmetros confusos.

Exemplo:

```java
OrdemServico os = new OrdemServicoBuilder()
        .codigo(CodigoOs.deNumero(2026, 1))
        .cliente(cliente)
        .periodo(periodo)
        .prioridade(PrioridadeOs.ALTA)
        .origem("CONSOLE")
        .build();
```

Builder monta.

Objeto final valida.

Builder não deve virar service.

---

## Coleções dentro de objetos

Você aprendeu que listas internas precisam ser protegidas.

Ruim:

```java
public List<AtividadeOs> getAtividades() {
    return atividades;
}
```

Melhor:

```java
public List<AtividadeOs> atividades() {
    return List.copyOf(atividades);
}
```

E alterações devem passar por métodos da raiz:

```java
os.adicionarAtividade(...);
os.concluirAtividade(...);
os.cancelarAtividade(...);
```

---

## Composição com coleções

Composição significa que o objeto pai é dono dos filhos.

Exemplos:

```text
OrdemServico -> AtividadeOs
OrdemServico -> OcorrenciaOs
Pedido -> ItemPedido
Contrato -> ServicoContrato
Checklist -> PerguntaChecklist
```

O filho não deve ser compartilhado livremente entre vários pais.

A raiz controla sua criação e alteração.

---

## Agregados

Agregado é uma unidade de consistência protegida por uma raiz.

Exemplo:

```text
OrdemServico é raiz.
AtividadeOs é filha.
OcorrenciaOs é filha.
Cliente é associação.
```

A regra é:

```text
fora do agregado, fale com a raiz.
```

Então:

```java
os.concluirAtividade("ATV-001");
```

não:

```java
atividade.concluir();
```

Isso protege consistência e histórico.

---

## Limites do domínio

Você aprendeu que domínio deve proteger regra, mas não deve conhecer infraestrutura.

Domínio não deve depender de:

```text
Scanner;
System.out como notificação principal;
SQL;
HTTP;
repository;
controller;
DTO;
JSON;
arquivo;
e-mail;
WhatsApp;
framework.
```

Domínio deve cuidar de:

```text
estado;
regras;
invariantes;
comportamento;
cálculos;
transições.
```

No mini-projeto:

```text
OrdemServico cuida da regra.
OrdemServicoService coordena.
RepositorioMemoria salva.
NotificadorConsole notifica.
ConsoleApp lê e exibe.
```

---

## Revisão do mini-projeto

O mini-projeto de OS demonstrou a união de tudo.

Ele tinha:

```text
Cliente;
CodigoOs;
PeriodoAtendimento;
AtividadeOs;
OcorrenciaOs;
OrdemServico;
OrdemServicoBuilder;
OrdemServicoService;
OrdemServicoRepositorioMemoria;
NotificadorOsConsole;
ConsoleLeitura;
OrdemServicoConsoleApp;
FluxoAutomaticoTesteApp;
FluxoErroTesteApp.
```

Esse projeto mostrou uma arquitetura simples, mas organizada.

Ainda não usamos Spring.

Ainda não usamos banco.

Mas a base mental já está muito mais profissional.

---

## O que você deve conseguir explicar agora

Você deve conseguir explicar:

```text
por que OrdemServico é raiz;
por que AtividadeOs é filha;
por que OcorrenciaOs é filha;
por que Cliente é associação;
por que CodigoOs é objeto de valor;
por que PeriodoAtendimento é objeto de valor;
por que status é enum;
por que não usamos setStatus;
por que listas são protegidas;
por que o service salva depois de alterar;
por que o domínio não conhece Scanner;
por que notificador fica fora do domínio;
por que Builder foi útil.
```

Se você consegue explicar isso, você realmente avançou.

---

## Checklist de qualidade de OO

Use este checklist em projetos OO:

```text
A classe tem responsabilidade clara?
O nome da classe representa conceito do domínio?
Os atributos têm tipos significativos?
Existem setters perigosos?
Os métodos representam ações de negócio?
As invariantes estão protegidas?
Status usa enum?
Dinheiro usa BigDecimal?
Datas usam java.time?
Listas internas são protegidas?
Filhos de composição são criados pela raiz?
Agregado tem uma raiz clara?
A infraestrutura está fora do domínio?
O app está sem regra central espalhada?
O código compila e roda?
```

Esse checklist vai te acompanhar em muitos módulos.

---

## Sinais de alerta

Alguns sinais indicam que o modelo pode estar ruim:

```text
muitos setters;
status como String;
listas públicas;
main gigante;
classe com mais de uma responsabilidade;
objeto sem comportamento;
service fazendo tudo;
domínio chamando banco;
domínio lendo Scanner;
entidade enviando e-mail;
regra duplicada em vários lugares;
objeto podendo nascer inválido.
```

Quando você enxergar esses sinais, pare e refatore.

---

## Exercício de diagnóstico

Analise este código mentalmente:

```java
class OrdemServico {
    public String status;
    public List<String> atividades;

    public void setStatus(String status) {
        this.status = status;
    }
}
```

Problemas:

```text
status público;
status como String;
lista pública;
atividade como String;
setter genérico;
sem regra de conclusão;
sem ocorrência;
sem cliente;
sem período;
sem invariantes;
sem raiz protegendo filhos.
```

Agora compare com o mini-projeto.

A diferença é a maturidade de modelagem.

---

## Revisão prática sugerida

Antes de avançar para o próximo módulo, faça esta revisão prática.

Abra o mini-projeto da aula 144 e responda:

```text
1. Onde uma OS é criada?
2. Onde o código da OS é validado?
3. Onde a atividade é criada?
4. Onde a atividade é concluída?
5. Onde a OS decide se pode concluir?
6. Onde a OS registra ocorrência?
7. Onde a OS é salva?
8. Onde a notificação é enviada?
9. Onde o usuário digita os dados?
10. Onde a listagem é exibida?
```

Essas respostas mostram se você entendeu as responsabilidades.

---

## Refatoração final opcional

Como exercício, refatore o mini-projeto da aula 144 e tente melhorar:

```text
nomes de métodos;
mensagens de erro;
organização dos métodos no app;
ordem dos métodos na OrdemServico;
separação do relatório;
opções do menu;
comentários desnecessários;
legibilidade de resumo.
```

Não altere a arquitetura principal.

Apenas melhore clareza.

Isso treina cuidado profissional.

---

## Autoavaliação

Marque mentalmente seu nível em cada item.

```text
1. Sei criar uma classe simples.
2. Sei criar construtor com validação.
3. Sei usar private corretamente.
4. Sei evitar setter perigoso.
5. Sei criar método de comportamento.
6. Sei criar enum.
7. Sei criar objeto de valor.
8. Sei criar entidade.
9. Sei proteger lista interna.
10. Sei criar composição.
11. Sei identificar agregado.
12. Sei usar Builder.
13. Sei separar domínio de infraestrutura.
14. Sei criar service de aplicação simples.
15. Sei montar um mini-projeto console organizado.
```

Se algum item ainda parecer fraco, volte na aula correspondente.

---

## Como estudar este módulo novamente

Não tente reler tudo de uma vez.

Sugestão:

```text
Dia 1:
revisar objetos de valor, entidades e encapsulamento.

Dia 2:
revisar Tell Don't Ask, objetos anêmicos e invariantes.

Dia 3:
revisar factories, builder e coleções.

Dia 4:
revisar composição, agregados e limites do domínio.

Dia 5:
refazer o mini-projeto OS console sem copiar.
```

Refazer sem copiar é a melhor prova de aprendizado.

---

## Desafio final do Módulo 4

Crie um mini-projeto semelhante ao de OS, mas usando `Checklist`.

Regras:

```text
Checklist é raiz do agregado.
PerguntaChecklist é filha.
OcorrenciaChecklist é filha.
Checklist nasce EM_EDICAO.
Pode adicionar pergunta em edição.
Pode responder pergunta em edição.
Pode remover pergunta em edição.
Pode finalizar se tiver perguntas.
Não pode finalizar com pergunta obrigatória sem resposta.
Finalizado não pode alterar pergunta.
Cancelado não pode alterar pergunta.
Toda ação relevante registra ocorrência.
```

Estrutura sugerida:

```text
app
  ChecklistConsoleApp
  ConsoleLeitura

aplicacao
  ChecklistService

infra
  ChecklistRepositorioMemoria
  NotificadorChecklistConsole

dominio
  checklist
    CodigoChecklist
    StatusChecklist
    Checklist
    ChecklistBuilder
    PerguntaChecklist
    OcorrenciaChecklist
```

Menu sugerido:

```text
1. Criar checklist
2. Adicionar pergunta
3. Responder pergunta
4. Remover pergunta
5. Finalizar checklist
6. Cancelar checklist
7. Listar checklists
8. Buscar checklist
0. Sair
```

Critério principal:

```text
o app não pode alterar perguntas diretamente.
```

---

## Projeto final opcional do módulo

Se quiser consolidar ainda mais, crie um segundo mini-projeto usando `Contrato`.

Regras:

```text
Contrato é raiz.
ServicoContrato é filho.
EventoContrato é filho.
Cliente é associação.
Contrato nasce RASCUNHO.
Pode adicionar serviço em RASCUNHO.
Pode remover serviço em RASCUNHO.
Não pode ativar sem serviço.
Ativo não pode alterar serviço.
Pode cancelar com motivo.
Toda ação relevante registra evento.
```

Menu sugerido:

```text
1. Criar contrato
2. Adicionar serviço
3. Remover serviço
4. Ativar contrato
5. Cancelar contrato
6. Listar contratos
7. Buscar contrato
0. Sair
```

Esse projeto reforça todos os conceitos do módulo.

---

## Erros que você deve evitar daqui para frente

A partir de agora, evite voltar para estes padrões:

```text
classe com todos os atributos públicos;
status como String;
valor monetário com double;
data como String;
setStatus livre;
getLista retornando lista mutável;
main fazendo tudo;
regra espalhada no app;
service gigante roubando domínio;
entidade salvando banco;
entidade chamando API;
objeto sem validação no construtor.
```

Esses erros são comuns em código iniciante.

Você já tem base para evitá-los.

---

## Preparação para o próximo módulo

O próximo módulo vai aprofundar estruturas de dados e recursos essenciais da linguagem para backend.

Você vai estudar melhor:

```text
Collections Framework;
List;
Set;
Map;
Queue;
Comparable;
Comparator;
Generics;
Optional;
Iteração;
forEach;
organização de dados em memória;
boas práticas com coleções;
cenários comuns de backend.
```

Isso conecta diretamente com o que vimos em listas internas.

No Módulo 4, você usou coleções dentro de objetos.

No próximo módulo, você vai entender melhor as coleções do Java por fora e por dentro.

---

## Por que o próximo módulo importa

Backend trabalha com coleções o tempo todo.

Exemplos:

```text
lista de pedidos;
mapa de usuários por id;
conjunto de permissões;
fila de eventos;
agrupamento de dados;
remoção de duplicados;
ordenação;
filtros;
buscas;
transformações.
```

Antes de chegar em banco, APIs e Spring, você precisa dominar coleções.

Coleções são base para:

```text
DTOs;
repositories;
services;
testes;
streams;
processamento em memória;
regras de negócio.
```

---

## Atividade guiada de fechamento

Faça em ordem.

### Parte 1 — Revisar o mini-projeto

Abra a aula 144 e revise:

```text
OrdemServico;
AtividadeOs;
OcorrenciaOs;
OrdemServicoService;
OrdemServicoRepositorioMemoria;
OrdemServicoConsoleApp.
```

### Parte 2 — Explicar responsabilidades

Escreva em poucas linhas:

```text
App:
Aplicação:
Domínio:
Infra:
```

### Parte 3 — Rodar novamente

Compile e rode:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula144.app.FluxoAutomaticoTesteApp
java -cp out br.com.curso.aula144.app.FluxoErroTesteApp
```

### Parte 4 — Fazer uma alteração pequena

Adicione uma mensagem nova no relatório.

Exemplo:

```text
Módulo 4 concluído com sucesso.
```

### Parte 5 — Commit final do módulo

Faça um commit final se ainda não fez.

---

## Registro final do módulo

Responda:

```text
1. Qual foi o conceito mais importante do Módulo 4?
2. Qual conceito ainda precisa de mais prática?
3. Qual classe do mini-projeto você entendeu melhor?
4. Qual classe foi mais difícil?
5. Como você explicaria agregado em uma frase?
6. Como você explicaria objeto de valor em uma frase?
7. Como você explicaria encapsulamento de verdade?
8. O que você não deve mais fazer em classes de domínio?
```

Esse registro ajuda a fixar.

---

## Critério de conclusão do Módulo 4

Você pode considerar o Módulo 4 concluído quando conseguir:

```text
explicar classe e objeto;
criar entidades com comportamento;
criar objetos de valor;
usar enum com segurança;
usar BigDecimal para dinheiro;
usar LocalDate para datas;
proteger atributos;
evitar setters perigosos;
proteger listas internas;
usar composição;
identificar associação;
identificar raiz de agregado;
criar factories simples;
criar builder simples;
separar domínio, aplicação, infra e app;
entender o mini-projeto OS console;
explicar as decisões de modelagem;
fazer commit limpo das práticas.
```

---

## Commit recomendado

Depois de concluir a revisão:

```bash
git status
git add labs/m4
git commit -m "Fechamento do modulo 4 orientacao a objetos"
git status
```

Se já fez commits aula por aula, você pode apenas conferir:

```bash
git status
```

O ideal é terminar o módulo com o repositório limpo.

---

## Fechamento oficial

Você concluiu o Módulo 4.

Esse módulo é um divisor de águas.

Até aqui, você aprendeu a programar em Java de forma mais estruturada.

A partir daqui, você começa a pensar como alguém que modela sistemas.

A diferença é grande:

```text
programar é fazer funcionar;
modelar é fazer funcionar com sentido, regra e evolução.
```

O próximo módulo vai continuar essa evolução.

Vamos aprofundar coleções, generics e estruturas de dados essenciais do Java, que são fundamentais para qualquer backend profissional.
