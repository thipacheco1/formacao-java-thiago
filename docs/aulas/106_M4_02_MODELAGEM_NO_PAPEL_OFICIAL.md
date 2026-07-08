# 106 — M4.02 — Modelagem no papel

## Objetivo da aula

Nesta aula você vai aprender a modelar um problema antes de sair codando.

Modelar no papel significa ler uma descrição, identificar os conceitos principais, separar dados, comportamentos, responsabilidades e regras, e só depois transformar isso em código.

O objetivo não é criar diagrama bonito. O objetivo é pensar melhor.

Ao final da aula, você deve conseguir:

```text
ler uma regra de negócio;
encontrar substantivos importantes;
encontrar verbos e ações;
separar possíveis entidades;
identificar responsabilidades;
distinguir dado de comportamento;
anotar regras do domínio;
evitar sair codando sem entender o problema.
```

Essa aula é fundamental para Orientação a Objetos, porque antes de criar classes você precisa saber **o que merece virar classe**.

---

## Por que modelar antes de codar

Um erro comum de quem está começando é abrir a IDE imediatamente e tentar resolver tudo no código.

O problema é que, se você não entendeu o domínio, o código costuma nascer confuso:

```text
nomes ruins;
classes sem sentido;
métodos fazendo coisa demais;
regras espalhadas;
dados duplicados;
responsabilidades misturadas;
dificuldade para evoluir.
```

Modelar no papel reduz esse risco.

Antes de perguntar:

```text
qual código eu escrevo?
```

pergunte:

```text
qual problema eu estou resolvendo?
quais conceitos existem aqui?
quais regras precisam ser respeitadas?
quem é responsável por cada decisão?
```

Essa mudança parece simples, mas é uma das diferenças entre apenas programar comandos e começar a desenhar software.

---

## O que é modelagem no papel

Modelagem no papel é um rascunho técnico.

Pode ser feito em:

```text
caderno;
quadro;
bloco de notas;
Markdown;
comentários temporários;
arquivo de análise.
```

O formato não precisa ser sofisticado.

Um bom rascunho pode ter apenas:

```text
Descrição do problema
Substantivos importantes
Verbos e ações
Possíveis classes
Dados de cada classe
Comportamentos de cada classe
Regras do domínio
Dúvidas
Primeira versão do fluxo
```

O objetivo é criar clareza antes do código.

---

## A técnica principal

Nesta aula vamos usar uma técnica simples:

```text
1. Ler o problema.
2. Marcar substantivos.
3. Marcar verbos.
4. Identificar regras.
5. Escolher candidatos a classes.
6. Separar responsabilidades.
7. Desenhar um fluxo simples.
8. Só então escrever um código inicial.
```

Substantivos geralmente apontam para coisas do domínio.

Exemplos:

```text
cliente;
pedido;
produto;
ordem de serviço;
pagamento;
contrato;
cotação;
mensagem;
auditoria;
fila.
```

Verbos geralmente apontam para comportamentos ou operações.

Exemplos:

```text
calcular;
validar;
aprovar;
cancelar;
reagendar;
confirmar;
enviar;
registrar;
bloquear;
liberar.
```

Nem todo substantivo vira classe.  
Nem todo verbo vira método.  
Mas eles ajudam a enxergar o problema.

---

## Exemplo 1 — Ordem de Serviço

Leia a descrição:

```text
O sistema recebe uma Ordem de Serviço de um cliente.
A OS possui certificado, status, data de abertura e quantidade de reagendamentos.
Uma OS com mais de 3 dias em aberto é considerada atrasada.
Uma OS atrasada deve ir para a fila de Casos Críticos.
Uma OS com 2 ou mais reagendamentos deve ir para a fila de Reagendamento.
OS concluída ou cancelada não deve ir para fila de atendimento.
```

Antes de codar, vamos modelar.

---

## Passo 1 — Substantivos importantes

Marque os substantivos:

```text
sistema;
Ordem de Serviço;
cliente;
certificado;
status;
data de abertura;
quantidade de reagendamentos;
dias em aberto;
fila;
Casos Críticos;
Reagendamento;
atendimento.
```

Agora filtre.

Nem tudo precisa virar classe.

Candidatos mais fortes:

```text
OrdemServico;
Cliente;
StatusOs;
FilaAtendimento.
```

Possíveis dados:

```text
certificado;
dataAbertura;
quantidadeReagendamentos;
diasEmAberto.
```

Possíveis valores controlados:

```text
status;
fila.
```

---

## Passo 2 — Verbos e comportamentos

Marque os verbos e ações:

```text
recebe;
possui;
é considerada atrasada;
deve ir;
não deve ir.
```

Traduzindo para comportamentos:

```text
calcular dias em aberto;
verificar se está atrasada;
verificar se está encerrada;
definir fila de atendimento.
```

Possíveis métodos:

```java
boolean atrasada()
boolean encerrada()
FilaAtendimento filaSugerida()
```

Perceba que esses métodos parecem pertencer à própria OS, porque usam dados da OS para responder perguntas sobre ela.

---

## Passo 3 — Regras do domínio

Agora escreva as regras de forma objetiva:

```text
Regra 1: OS com mais de 3 dias em aberto é atrasada.
Regra 2: OS concluída ou cancelada fica sem fila.
Regra 3: OS atrasada vai para Casos Críticos.
Regra 4: OS com 2 ou mais reagendamentos vai para Reagendamento.
Regra 5: Demais OS vão para Entrada.
```

A ordem das regras importa.

Se uma OS estiver concluída e atrasada, a regra de encerramento deve vir primeiro:

```text
concluída/cancelada -> sem fila
```

Isso evita mandar OS encerrada para atendimento.

---

## Passo 4 — Candidatos a classes

Agora monte uma lista inicial.

```text
OrdemServico
StatusOs
FilaAtendimento
```

Talvez `Cliente` apareça depois.  
Mas, para este primeiro modelo, podemos manter cliente apenas como texto dentro da OS.

Não tente criar classe para tudo no começo.

Uma boa modelagem inicial é simples.

---

## Passo 5 — Responsabilidades

Agora separe quem deve saber o quê.

### OrdemServico

Responsabilidade:

```text
representar uma OS e responder perguntas operacionais sobre ela.
```

Dados:

```text
certificado;
cliente;
status;
dataAbertura;
quantidadeReagendamentos.
```

Comportamentos:

```text
diasEmAberto;
atrasada;
encerrada;
precisaReagendamento;
filaSugerida.
```

### StatusOs

Responsabilidade:

```text
controlar os status possíveis de uma OS.
```

Valores:

```text
ABERTA;
AGENDADA;
REAGENDADA;
CONCLUIDA;
CANCELADA.
```

### FilaAtendimento

Responsabilidade:

```text
representar a fila operacional sugerida.
```

Valores:

```text
ENTRADA;
REAGENDAMENTO;
CASOS_CRITICOS;
SEM_FILA.
```

Esse desenho já ajuda muito antes de codar.

---

## Rascunho no papel

Um rascunho possível ficaria assim:

```text
Classe: OrdemServico

Estado:
- certificado: String
- cliente: String
- status: StatusOs
- dataAbertura: LocalDate
- quantidadeReagendamentos: int

Comportamentos:
- diasEmAberto(dataReferencia)
- atrasada(dataReferencia)
- encerrada()
- precisaReagendamento()
- filaSugerida(dataReferencia)

Regras:
- encerrada: CONCLUIDA ou CANCELADA
- atrasada: dias em aberto > 3
- precisa reagendamento: quantidadeReagendamentos >= 2
- fila:
  1. encerrada -> SEM_FILA
  2. atrasada -> CASOS_CRITICOS
  3. precisa reagendamento -> REAGENDAMENTO
  4. caso contrário -> ENTRADA
```

Esse rascunho é simples, mas já orienta a implementação.

---

## Código inicial a partir do modelo

Agora sim faz sentido escrever código.

Crie a pasta:

```powershell
mkdir labs\m4\aula-106-modelagem-no-papel
cd labs\m4\aula-106-modelagem-no-papel
```

Crie o arquivo:

```text
ModelagemOs.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class ModelagemOs {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana Silva",
                StatusOs.ABERTA,
                LocalDate.now().minusDays(5),
                1
        );

        LocalDate hoje = LocalDate.now();

        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Fila sugerida: " + os.filaSugerida(hoje));
    }
}

enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum FilaAtendimento {
    ENTRADA,
    REAGENDAMENTO,
    CASOS_CRITICOS,
    SEM_FILA
}

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServico(
            String certificado,
            String cliente,
            StatusOs status,
            LocalDate dataAbertura,
            int quantidadeReagendamentos
    ) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.quantidadeReagendamentos = quantidadeReagendamentos;
    }

    String certificado() {
        return certificado;
    }

    String cliente() {
        return cliente;
    }

    StatusOs status() {
        return status;
    }

    long diasEmAberto(LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);

        if (dias < 0) {
            return 0;
        }

        return dias;
    }

    boolean atrasada(LocalDate dataReferencia) {
        return diasEmAberto(dataReferencia) > 3;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean precisaReagendamento() {
        return quantidadeReagendamentos >= 2;
    }

    FilaAtendimento filaSugerida(LocalDate dataReferencia) {
        if (encerrada()) {
            return FilaAtendimento.SEM_FILA;
        }

        if (atrasada(dataReferencia)) {
            return FilaAtendimento.CASOS_CRITICOS;
        }

        if (precisaReagendamento()) {
            return FilaAtendimento.REAGENDAMENTO;
        }

        return FilaAtendimento.ENTRADA;
    }
}
```

---

## O que este código mostra

O código nasceu do rascunho.

Não foi uma tentativa aleatória.

A classe `OrdemServico` tem estado:

```text
certificado;
cliente;
status;
dataAbertura;
quantidadeReagendamentos.
```

E tem comportamento:

```text
diasEmAberto;
atrasada;
encerrada;
precisaReagendamento;
filaSugerida.
```

Os enums controlam valores possíveis:

```text
StatusOs;
FilaAtendimento.
```

O `main` apenas cria uma OS e imprime informações.

A regra de fila está perto da OS, porque depende do estado da OS.

---

## Exemplo 2 — Pedido

Agora vamos modelar um pedido.

Descrição:

```text
Um pedido possui cliente, produto, preço unitário e quantidade.
O total bruto é o preço unitário multiplicado pela quantidade.
Pedidos com total bruto maior ou igual a 300 recebem 10% de desconto.
O total final é o total bruto menos o desconto.
Pedido com quantidade menor ou igual a zero é inválido.
Pedido com preço unitário menor ou igual a zero é inválido.
```

---

## Substantivos do pedido

Substantivos importantes:

```text
pedido;
cliente;
produto;
preço unitário;
quantidade;
total bruto;
desconto;
total final.
```

Candidatos:

```text
Pedido;
Cliente;
Produto;
ResumoPedido.
```

Para um primeiro modelo, podemos começar apenas com `Pedido`.

---

## Verbos e comportamentos do pedido

Verbos e ações:

```text
possui;
multiplicado;
recebem desconto;
é inválido.
```

Possíveis métodos:

```java
boolean valido()
BigDecimal totalBruto()
BigDecimal desconto()
BigDecimal totalFinal()
```

---

## Rascunho do pedido

```text
Classe: Pedido

Estado:
- cliente: String
- produto: String
- precoUnitario: BigDecimal
- quantidade: int

Comportamentos:
- valido()
- totalBruto()
- desconto()
- totalFinal()

Regras:
- cliente obrigatório
- produto obrigatório
- preço unitário > 0
- quantidade > 0
- desconto de 10% se total bruto >= 300
```

---

## Código do pedido a partir do modelo

Crie:

```text
ModelagemPedido.java
```

Código:

```java
import java.math.BigDecimal;

public class ModelagemPedido {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Válido: " + pedido.valido());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() {
        return cliente;
    }

    String produto() {
        return produto;
    }

    boolean valido() {
        return textoInformado(cliente)
                && textoInformado(produto)
                && precoUnitario != null
                && precoUnitario.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0;
    }

    BigDecimal totalBruto() {
        if (!valido()) {
            return BigDecimal.ZERO;
        }

        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        BigDecimal totalBruto = totalBruto();

        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Esse exemplo mostra como um rascunho simples vira código com mais intenção.

---

## Responsabilidade: o ponto mais importante

Modelagem não é só escolher nomes de classes.

Modelagem é decidir responsabilidades.

Pergunte sempre:

```text
quem deve saber essa informação?
quem deve aplicar essa regra?
quem deve responder essa pergunta?
quem deve executar essa ação?
```

Exemplo:

```text
Pedido deve calcular total?
```

Sim, faz sentido, porque o total depende dos dados do pedido.

```text
Pedido deve ler dados do Scanner?
```

Não é uma boa ideia, porque leitura de console não é responsabilidade do pedido.

```text
OrdemServico deve saber se está atrasada?
```

Sim, faz sentido, porque atraso depende da data de abertura da OS.

```text
OrdemServico deve imprimir relatório no console?
```

Não. Isso é responsabilidade de exibição.

Essa separação evita classes confusas.

---

## Entidade, valor e serviço: uma primeira noção

Ainda vamos estudar isso com profundidade depois, mas já vale abrir a cabeça.

### Entidade

Entidade geralmente representa algo com identidade.

Exemplos:

```text
Cliente;
Pedido;
OrdemServico;
Contrato;
Produto.
```

Uma OS tem certificado ou id.  
Um pedido tem número.  
Um cliente tem código.

### Valor

Objeto de valor representa uma informação sem identidade própria naquele contexto.

Exemplos:

```text
Endereço;
Dinheiro;
Período;
Telefone;
Email.
```

Por enquanto, não vamos implementar todos.  
Só entenda a ideia.

### Serviço

Serviço representa uma operação que não pertence naturalmente a uma única entidade.

Exemplo:

```text
EnviarMensagem;
GerarRelatorio;
ImportarArquivo;
CalcularRemuneracaoComplexa.
```

Se uma regra usa muitas entidades ou depende de infraestrutura, talvez não deva ficar dentro de uma entidade.

Nesta fase, basta começar a perceber essas diferenças.

---

## O que não fazer na modelagem

Evite sair criando classes para cada palavra.

Descrição:

```text
O cliente faz um pedido de um produto.
```

Você poderia criar:

```text
Cliente;
Pedido;
Produto.
```

Isso pode fazer sentido.

Mas não precisa criar:

```text
Sistema;
Tela;
Botão;
Campo;
Informação;
Resultado;
Coisa;
Dados.
```

Classes demais também atrapalham.

Outro erro é criar nomes genéricos:

```text
Processador;
Gerenciador;
Util;
Dados;
Info;
Helper.
```

Esses nomes não explicam o domínio.

Prefira nomes que venham do problema real.

---

## Como saber se uma classe faz sentido

Uma classe candidata faz mais sentido quando:

```text
representa um conceito importante do domínio;
tem dados próprios;
tem regras relacionadas a esses dados;
aparece em várias partes do problema;
tem nome claro;
não é apenas uma função disfarçada;
não é genérica demais.
```

Uma classe candidata é suspeita quando:

```text
tem nome vago;
não tem dados;
não tem comportamento;
só existe para chamar outro método;
mistura leitura, cálculo, banco, relatório e impressão;
foi criada só porque apareceu um substantivo qualquer.
```

---

## Modelagem não precisa acertar tudo de primeira

Modelagem é rascunho.

Você pode começar com:

```text
Pedido
```

Depois perceber que precisa de:

```text
ItemPedido;
Cliente;
Produto;
Pagamento.
```

Isso é normal.

Você também pode começar com um comportamento dentro da classe e depois perceber que ele deveria sair.

Isso também é normal.

O importante é não codar no escuro.

Modelar é criar uma primeira hipótese organizada.

Depois o código, os testes e a leitura crítica ajudam a melhorar.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Modelar OS no papel

Sem olhar o código, escreva:

```text
Classe principal:
Estado:
Comportamentos:
Regras:
Dúvidas:
```

Use a descrição da Ordem de Serviço.

Depois compare com o exemplo `ModelagemOs.java`.

### Parte 2 — Modelar Pedido no papel

Faça o mesmo para pedido.

Escreva:

```text
Classe principal:
Estado:
Comportamentos:
Regras:
```

Depois compare com `ModelagemPedido.java`.

### Parte 3 — Alterar uma regra

Na OS, mude:

```text
OS atrasada é acima de 5 dias, não acima de 3.
```

Veja em qual método essa regra muda.

### Parte 4 — Criar uma nova regra

No pedido, crie a regra:

```text
pedido com quantidade acima de 10 recebe 15% de desconto.
```

Ajuste o método `desconto`.

### Parte 5 — Explicar a responsabilidade

Explique por que:

```text
Pedido calcula total;
Pedido não lê Scanner;
OrdemServico define fila sugerida;
OrdemServico não imprime relatório.
```

---

## Desafio prático

Modele no papel um problema de cliente.

Descrição:

```text
Um cliente possui nome, email, telefone e status.
Cliente ativo com telefone informado pode receber mensagem.
Cliente inativo não pode receber mensagem.
Cliente sem email não possui contato completo.
```

Antes de codar, escreva:

```text
Substantivos:
Verbos:
Possíveis classes:
Estado:
Comportamentos:
Regras:
Dúvidas:
```

Depois crie o arquivo:

```text
ModelagemCliente.java
```

Implemente uma classe `Cliente` com:

```text
nome;
email;
telefone;
ativo;
contatoCompleto();
podeReceberMensagem();
```

Crie dois clientes no `main` e imprima o resultado dos comportamentos.

---

## Erros comuns

### 1. Codar antes de entender o problema

Se você não consegue explicar a regra em texto, ainda não deveria codar.

### 2. Criar classe para tudo

Nem todo substantivo vira classe.

### 3. Criar método para todo verbo

Nem todo verbo vira método do objeto principal.

### 4. Misturar responsabilidades

Classe de domínio não deveria ler console, imprimir relatório ou salvar banco diretamente nesta fase.

### 5. Usar nomes genéricos

Evite nomes como:

```text
Dados;
Info;
Manager;
Processor;
Helper;
Utils.
```

### 6. Colocar regra longe do conceito

Se a regra depende do estado do pedido, talvez pertença ao pedido.  
Se a regra depende da OS, talvez pertença à OS.

### 7. Achar que o primeiro modelo é definitivo

Modelo inicial é hipótese. Ele pode melhorar.

---

## Debug recomendado

Use debug em:

```text
ModelagemOs.java
```

Coloque breakpoint em:

```java
System.out.println("Fila sugerida: " + os.filaSugerida(hoje));
```

Entre em:

```text
filaSugerida;
encerrada;
atrasada;
precisaReagendamento.
```

Observe como os comportamentos usam o estado da OS.

Depois use debug em:

```text
ModelagemPedido.java
```

Entre em:

```text
valido;
totalBruto;
desconto;
totalFinal.
```

Observe como um comportamento chama outro.

Esse debug ajuda a enxergar objetos trabalhando com seus próprios dados.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual substantivo virou a classe mais importante?
2. Qual comportamento pertence naturalmente a essa classe?
3. Qual responsabilidade não deveria ficar dentro dela?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
ler uma descrição de problema;
identificar substantivos importantes;
identificar verbos e ações;
separar possíveis classes;
definir estado de uma classe;
definir comportamentos de uma classe;
anotar regras do domínio;
identificar responsabilidades;
evitar classe genérica;
evitar classe fazendo tudo;
criar um rascunho antes de codar;
transformar o rascunho em uma classe simples;
explicar suas decisões;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-106-modelagem-no-papel
git commit -m "Aula 106: pratica modelagem no papel"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
não comece uma classe pela sintaxe; comece pelo problema.
```

Modelagem no papel ajuda você a entender o domínio antes de escrever código.

Quando você identifica substantivos, verbos, responsabilidades, entidades e regras, a classe nasce com mais sentido.

Na próxima aula, vamos entrar com mais força em Java:

```text
classe e objeto em Java.
```

Vamos estudar `new`, instância, atributos, métodos e `this` com mais detalhes.
