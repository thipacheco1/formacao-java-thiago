# 024 — M1.04 — Variáveis e Nomes Profissionais

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.04.01` — Variáveis e nomes profissionais — Conceito, por que existe e vocabulário essencial.
- `M1.04.02` — Variáveis e nomes profissionais — Exemplo mínimo digitado do zero.
- `M1.04.03` — Variáveis e nomes profissionais — Exemplo aplicado ao domínio corporativo.
- `M1.04.04` — Variáveis e nomes profissionais — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar declaração, atribuição, alteração, intenção, `camelCase`, variáveis temporárias, leitura profissional de nomes e diagnóstico dos primeiros erros envolvendo variáveis em Java.

---

## Onde estamos na formação

Estamos no Módulo 1, estudando Java de verdade.

Até aqui, já passamos por:

```text
M1.01 — primeiro programa Java destrinchado;
M1.02 — blocos, chaves, indentação e leitura de código;
M1.03 — comentários úteis e documentação inicial.
```

Agora vamos estudar variáveis.

Essa aula se conecta diretamente com a anterior.

Na aula de comentários, vimos que nem sempre o comentário é a melhor solução.

Muitas vezes, o melhor comentário é um bom nome.

Exemplo ruim:

```java
// quantidade de pedidos pendentes
int x = 5;
```

Exemplo melhor:

```java
int quantidadePedidosPendentes = 5;
```

O nome já comunica intenção.

Nesta aula, vamos entender o que é uma variável, como declarar, como atribuir valor, como alterar valor e como escolher nomes profissionais.

---

## Hoje a aula é sobre dar nome para informações

Programas trabalham com informações.

Exemplos:

```text
idade;
nome;
preço;
status;
quantidade;
data;
código;
ativo;
valor total;
número da ordem;
ID do cliente;
status do pedido;
tentativas de login;
limite de crédito.
```

Em Java, uma variável permite guardar uma informação com nome.

Exemplo:

```java
int idade = 30;
```

Aqui temos:

```text
tipo: int;
nome: idade;
valor: 30.
```

A variável permite que o programa use esse valor depois.

Sem variável, você ficaria repetindo valores soltos.

Com variável, você dá intenção para o valor.

---

## O que é uma variável

Variável é um espaço nomeado para guardar um valor durante a execução do programa.

Pense assim:

```text
uma variável é uma etiqueta colada em uma informação.
```

Exemplo:

```java
String nomeCliente = "Cliente Exemplo";
```

A informação é:

```text
"Cliente Exemplo"
```

O nome dado para ela é:

```text
nomeCliente
```

O tipo é:

```text
String
```

O programa pode usar `nomeCliente` em vez de repetir o texto direto.

---

## Por que variáveis existem

Variáveis existem para:

```text
guardar dados;
dar nome a valores;
evitar repetição;
melhorar leitura;
permitir alteração;
representar estado;
preparar cálculos;
organizar regras;
aproximar código do domínio.
```

Compare.

Sem variável:

```java
System.out.println("Cliente Exemplo");
System.out.println("Cliente Exemplo");
System.out.println("Cliente Exemplo");
```

Com variável:

```java
String nomeCliente = "Cliente Exemplo";

System.out.println(nomeCliente);
System.out.println(nomeCliente);
System.out.println(nomeCliente);
```

Se o nome mudar, você altera em um lugar.

Mais importante: o código ganhou intenção.

---

## Declaração de variável

Declarar variável é dizer ao Java que uma variável existe.

Exemplo:

```java
int quantidade;
```

Aqui você declarou uma variável chamada:

```text
quantidade
```

do tipo:

```text
int
```

Mas ainda não colocou valor nela.

Declaração responde:

```text
qual é o tipo?
qual é o nome?
```

---

## Atribuição de valor

Atribuir é colocar valor em uma variável.

Exemplo:

```java
quantidade = 10;
```

O operador:

```java
=
```

em Java significa atribuição.

Ele coloca o valor da direita dentro da variável da esquerda.

Leitura correta:

```text
quantidade recebe 10.
```

Não leia como:

```text
quantidade é igual a 10.
```

Em Java, igualdade será estudada com outro operador:

```java
==
```

Por enquanto:

```java
=
```

significa recebe.

---

## Declaração e atribuição juntas

É comum declarar e atribuir na mesma linha:

```java
int quantidade = 10;
```

Isso significa:

```text
crie uma variável inteira chamada quantidade e coloque o valor 10 nela.
```

Outro exemplo:

```java
String nomeCliente = "Cliente Exemplo";
```

Significa:

```text
crie uma variável de texto chamada nomeCliente e coloque o texto "Cliente Exemplo" nela.
```

Essa é a forma mais comum nos primeiros exemplos.

---

## Alteração de valor

Variável pode ter o valor alterado.

Exemplo:

```java
int quantidadePedidos = 5;

System.out.println(quantidadePedidos);

quantidadePedidos = 8;

System.out.println(quantidadePedidos);
```

Saída:

```text
5
8
```

A mesma variável recebeu outro valor.

Por isso o nome é variável.

Mas atenção:

```text
alterar valor sem critério deixa código difícil de entender.
```

Variáveis devem representar bem a informação durante o fluxo.

---

## Exemplo mínimo com variável

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        String mensagem = "Aprendendo variáveis em Java";

        System.out.println(mensagem);
    }
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída:

```text
Aprendendo variáveis em Java
```

O texto foi guardado em uma variável chamada `mensagem`.

Depois foi impresso.

---

## Variável dentro do método

Neste momento, vamos criar variáveis dentro do método `main`.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        String nome = "Ana";
        int idade = 25;

        System.out.println(nome);
        System.out.println(idade);
    }
}
```

Essas variáveis estão dentro do bloco do método.

Mais tarde, vamos estudar:

```text
variáveis locais;
atributos;
parâmetros;
escopo;
variáveis de instância;
variáveis estáticas.
```

Agora, foque em variável local dentro do `main`.

---

## Variável local

Variável local é uma variável declarada dentro de um método ou bloco.

Exemplo:

```java
public static void main(String[] args) {
    String nomeCliente = "Cliente Exemplo";
}
```

`nomeCliente` é local ao método `main`.

Ela existe dentro daquele bloco.

Ainda não vamos aprofundar escopo.

Mas guarde:

```text
onde a variável é declarada importa.
```

Na aula de blocos, aprendemos a enxergar chaves.

Isso começa a fazer sentido agora.

---

## Java é fortemente tipado

Em Java, a variável tem tipo.

Exemplo:

```java
int quantidade = 10;
String nome = "Cliente";
boolean ativo = true;
```

O tipo define que tipo de valor a variável pode receber.

Exemplo errado:

```java
int quantidade = "dez";
```

Por quê?

Porque `int` guarda número inteiro.

`"dez"` é texto.

Java não aceita misturar assim.

Isso protege o programa contra muitos erros.

---

## Tipo vem antes do nome

A sintaxe básica é:

```java
tipo nome = valor;
```

Exemplos:

```java
int idade = 30;
double valorTotal = 150.75;
boolean clienteAtivo = true;
char categoria = 'A';
String nomeCliente = "Cliente Exemplo";
```

Padrão:

```text
tipo;
nome;
atribuição opcional;
valor;
ponto e vírgula.
```

---

## Primeiros tipos que veremos

Nesta aula, vamos usar alguns tipos sem aprofundar todos ainda.

Exemplos:

```java
int quantidade = 10;
double valor = 99.90;
boolean ativo = true;
char categoria = 'A';
String nome = "Produto";
```

Mas os tipos serão estudados em aulas próprias.

Aqui o foco é:

```text
o que é variável;
como declarar;
como atribuir;
como nomear.
```

A próxima aula vai começar pelos tipos inteiros.

---

## `String` como texto inicial

`String` representa texto.

Exemplo:

```java
String nomeCliente = "Cliente Exemplo";
```

Texto usa aspas duplas:

```java
"Cliente Exemplo"
```

Erro:

```java
String nomeCliente = 'Cliente Exemplo';
```

Aspas simples são para `char`, caractere único.

Exemplo:

```java
char categoria = 'A';
```

---

## `int` como número inteiro inicial

`int` representa número inteiro.

Exemplo:

```java
int quantidade = 10;
```

Sem aspas.

Erro:

```java
int quantidade = "10";
```

Aqui `"10"` é texto, não número.

Certo:

```java
int quantidade = 10;
```

Os tipos inteiros serão aprofundados na próxima aula.

---

## `double` como número decimal inicial

`double` representa número com casas decimais.

Exemplo:

```java
double valorTotal = 199.90;
```

Em Java, usamos ponto decimal:

```java
199.90
```

Não vírgula:

```java
199,90
```

A vírgula não é usada para decimal em código Java.

---

## `boolean` como verdadeiro ou falso

`boolean` representa verdadeiro ou falso.

Exemplo:

```java
boolean clienteAtivo = true;
boolean pedidoCancelado = false;
```

Os valores são:

```java
true
false
```

Com letras minúsculas.

Erro:

```java
boolean ativo = "true";
```

Aqui `"true"` é texto, não boolean.

---

## `char` como caractere

`char` representa um único caractere.

Exemplo:

```java
char categoria = 'A';
```

Usa aspas simples.

Erro:

```java
char categoria = "A";
```

`"A"` é `String`.

`'A'` é `char`.

Também é erro:

```java
char categoria = 'AB';
```

`char` é um caractere.

---

## Nome de variável

Nome de variável é uma das coisas mais importantes para legibilidade.

Compare:

```java
int x = 10;
```

com:

```java
int quantidadeProdutos = 10;
```

O primeiro exige adivinhação.

O segundo comunica intenção.

Em código profissional, nome ruim causa muito problema.

Nome bom reduz comentário, erro e retrabalho.

---

## camelCase

Em Java, variáveis e métodos normalmente usam `camelCase`.

Exemplos:

```java
nomeCliente
quantidadePedidos
valorTotal
clienteAtivo
statusOrdemServico
dataAgendamento
```

Regra:

```text
primeira palavra começa minúscula;
palavras seguintes começam com letra maiúscula;
sem espaço;
sem hífen;
sem underscore em variáveis comuns.
```

Exemplos ruins:

```java
NomeCliente
nome_cliente
nome-cliente
nome cliente
NOMECLIENTE
```

`NomeCliente` parece nome de classe.

`nome_cliente` não é o padrão Java para variável comum.

`nome-cliente` nem é válido.

`nome cliente` nem é válido.

---

## Nome deve revelar intenção

Nome bom responde:

```text
o que esse valor representa?
```

Exemplos bons:

```java
String nomeCliente = "Cliente Exemplo";
int quantidadeTentativas = 3;
double valorTotalPedido = 150.75;
boolean clienteAtivo = true;
String statusOrdemServico = "ABERTA";
```

Exemplos ruins:

```java
String n = "Cliente Exemplo";
int qtd = 3;
double v = 150.75;
boolean flag = true;
String s = "ABERTA";
```

Às vezes abreviações são aceitáveis em contextos muito conhecidos.

Mas no começo, prefira clareza.

---

## Cuidado com `flag`

Muita gente chama boolean de:

```java
flag
```

Exemplo ruim:

```java
boolean flag = true;
```

Flag de quê?

Melhor:

```java
boolean clienteAtivo = true;
boolean pagamentoAprovado = true;
boolean pedidoCancelado = false;
boolean usuarioAutenticado = true;
```

Booleanos devem soar como uma pergunta respondida por verdadeiro ou falso.

Exemplos:

```text
clienteAtivo?
pagamentoAprovado?
pedidoCancelado?
usuarioAutenticado?
```

Isso melhora muito a leitura.

---

## Nomes booleanos

Bons nomes booleanos:

```java
boolean clienteAtivo = true;
boolean possuiPendencia = false;
boolean pedidoPago = true;
boolean usuarioBloqueado = false;
boolean permiteReagendamento = true;
```

Evite:

```java
boolean status = true;
boolean tipo = false;
boolean x = true;
boolean retorno = false;
```

`status` normalmente não é boolean.

Status costuma ser uma palavra ou enum no futuro.

Exemplo melhor:

```java
String statusPedido = "PENDENTE";
boolean pedidoPendente = true;
```

---

## Variáveis temporárias

Variável temporária é criada para guardar um valor intermediário.

Exemplo:

```java
double valorProduto = 100.00;
double valorFrete = 20.00;

double valorTotal = valorProduto + valorFrete;

System.out.println(valorTotal);
```

`valorTotal` é resultado intermediário do cálculo.

Isso melhora leitura.

Sem variável temporária:

```java
System.out.println(100.00 + 20.00);
```

Funciona.

Mas comunica menos.

Com nomes:

```java
double valorProduto = 100.00;
double valorFrete = 20.00;
double valorTotal = valorProduto + valorFrete;
```

A regra ficou clara.

---

## Variável temporária ruim

Nem toda variável temporária ajuda.

Exemplo:

```java
String a = "Cliente";
String b = a;
System.out.println(b);
```

`b` não agrega intenção.

Melhor:

```java
String nomeCliente = "Cliente";
System.out.println(nomeCliente);
```

Variável temporária deve melhorar leitura.

Se só troca um nome bom por um nome ruim, atrapalha.

---

## Atribuição não é comparação

Em Java:

```java
=
```

é atribuição.

Exemplo:

```java
int quantidade = 10;
```

Leitura:

```text
quantidade recebe 10.
```

Comparação de igualdade usa:

```java
==
```

Exemplo futuro:

```java
quantidade == 10
```

Ainda vamos estudar operadores.

Mas desde já, não leia `=` como igualdade matemática.

Em programação:

```text
= recebe.
```

---

## Variável precisa ser declarada antes de usar

Erro:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(nomeCliente);

        String nomeCliente = "Cliente Exemplo";
    }
}
```

Você tentou usar `nomeCliente` antes de declarar.

Correção:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente Exemplo";

        System.out.println(nomeCliente);
    }
}
```

A ordem importa.

---

## Variável local precisa ter valor antes de usar

Erro:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente;

        System.out.println(nomeCliente);
    }
}
```

A variável foi declarada, mas não recebeu valor.

Java não permite usar variável local sem inicialização.

Correção:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente Exemplo";

        System.out.println(nomeCliente);
    }
}
```

Esse erro é comum e importante.

---

## Não declarar duas variáveis locais com mesmo nome no mesmo bloco

Erro:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente A";
        String nomeCliente = "Cliente B";

        System.out.println(nomeCliente);
    }
}
```

Você declarou duas variáveis com o mesmo nome no mesmo bloco.

Correção:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente A";
        nomeCliente = "Cliente B";

        System.out.println(nomeCliente);
    }
}
```

Aqui você declarou uma vez e depois alterou o valor.

---

## Declarar versus alterar

Declaração:

```java
String statusPedido = "PENDENTE";
```

Alteração:

```java
statusPedido = "APROVADO";
```

Na alteração, você não repete o tipo.

Errado:

```java
String statusPedido = "PENDENTE";
String statusPedido = "APROVADO";
```

Certo:

```java
String statusPedido = "PENDENTE";
statusPedido = "APROVADO";
```

Regra:

```text
tipo aparece na declaração;
alteração usa apenas o nome.
```

---

## Exemplo com alteração

Código:

```java
public class Main {
    public static void main(String[] args) {
        String statusPedido = "PENDENTE";

        System.out.println(statusPedido);

        statusPedido = "APROVADO";

        System.out.println(statusPedido);
    }
}
```

Saída:

```text
PENDENTE
APROVADO
```

A variável mudou de valor.

---

## Exemplo com vários tipos

Código:

```java
public class Main {
    public static void main(String[] args) {
        String nomeProduto = "Mesa";
        int quantidade = 2;
        double valorUnitario = 150.00;
        boolean produtoAtivo = true;
        char categoria = 'M';

        System.out.println(nomeProduto);
        System.out.println(quantidade);
        System.out.println(valorUnitario);
        System.out.println(produtoAtivo);
        System.out.println(categoria);
    }
}
```

Esse exemplo usa vários tipos.

Ainda não vamos aprofundar limites e detalhes.

O objetivo é enxergar variáveis nomeadas.

---

## Exemplo com concatenação simples

Você pode juntar texto com variável usando `+`.

Exemplo:

```java
String nomeCliente = "Cliente Exemplo";

System.out.println("Nome do cliente: " + nomeCliente);
```

Saída:

```text
Nome do cliente: Cliente Exemplo
```

Outro exemplo:

```java
int quantidadePedidos = 3;

System.out.println("Quantidade de pedidos: " + quantidadePedidos);
```

Saída:

```text
Quantidade de pedidos: 3
```

Esse uso de `+` com texto será praticado bastante.

Mais tarde, veremos detalhes de concatenação.

---

## Exemplo mínimo completo

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente Exemplo";
        int quantidadePedidos = 3;
        boolean clienteAtivo = true;

        System.out.println("Nome: " + nomeCliente);
        System.out.println("Pedidos: " + quantidadePedidos);
        System.out.println("Ativo: " + clienteAtivo);
    }
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída:

```text
Nome: Cliente Exemplo
Pedidos: 3
Ativo: true
```

---

## Exemplo aplicado ao domínio corporativo: ordem de serviço

Arquivo:

```text
OrdemServicoVariaveis.java
```

Código:

```java
public class OrdemServicoVariaveis {
    public static void main(String[] args) {
        String numeroOrdemServico = "OS-1001";
        String statusOrdemServico = "ABERTA";
        String responsavel = "Backoffice";
        boolean permiteNovaAtividade = true;

        System.out.println("Ordem de Serviço: " + numeroOrdemServico);
        System.out.println("Status: " + statusOrdemServico);
        System.out.println("Responsável: " + responsavel);
        System.out.println("Permite nova atividade: " + permiteNovaAtividade);
    }
}
```

Esse código é simples, mas já tem cara de domínio.

Nomes importantes:

```text
numeroOrdemServico;
statusOrdemServico;
responsavel;
permiteNovaAtividade.
```

Eles explicam o que cada valor representa.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
PedidoVariaveis.java
```

Código:

```java
public class PedidoVariaveis {
    public static void main(String[] args) {
        String codigoPedido = "PED-2026-001";
        String nomeCliente = "Cliente Exemplo";
        int quantidadeItens = 4;
        double valorTotalPedido = 389.90;
        boolean pagamentoAprovado = false;

        System.out.println("Pedido: " + codigoPedido);
        System.out.println("Cliente: " + nomeCliente);
        System.out.println("Quantidade de itens: " + quantidadeItens);
        System.out.println("Valor total: " + valorTotalPedido);
        System.out.println("Pagamento aprovado: " + pagamentoAprovado);
    }
}
```

Observe que os nomes evitam comentários desnecessários.

Não precisamos escrever:

```java
// código do pedido
```

porque `codigoPedido` já explica.

---

## Exemplo aplicado ao domínio corporativo: auditoria

Arquivo:

```text
AuditoriaVariaveis.java
```

Código:

```java
public class AuditoriaVariaveis {
    public static void main(String[] args) {
        String usuarioResponsavel = "usuario.exemplo";
        String eventoAuditoria = "ALTERACAO_STATUS";
        String origemEvento = "SISTEMA";
        boolean eventoCritico = true;

        System.out.println("Usuário: " + usuarioResponsavel);
        System.out.println("Evento: " + eventoAuditoria);
        System.out.println("Origem: " + origemEvento);
        System.out.println("Crítico: " + eventoCritico);
    }
}
```

Esse exemplo mostra nomes mais profissionais.

Compare:

```java
String u = "usuario.exemplo";
String e = "ALTERACAO_STATUS";
String o = "SISTEMA";
boolean c = true;
```

Funciona, mas é ruim de ler.

Nomes bons ajudam o revisor, o time e você mesmo.

---

## Exemplo com variável temporária de cálculo

Arquivo:

```text
CalculoPedido.java
```

Código:

```java
public class CalculoPedido {
    public static void main(String[] args) {
        double valorProduto = 100.00;
        double valorFrete = 25.00;
        double valorDesconto = 10.00;

        double valorTotalPedido = valorProduto + valorFrete - valorDesconto;

        System.out.println("Valor do produto: " + valorProduto);
        System.out.println("Valor do frete: " + valorFrete);
        System.out.println("Valor do desconto: " + valorDesconto);
        System.out.println("Valor total do pedido: " + valorTotalPedido);
    }
}
```

Aqui `valorTotalPedido` é variável temporária útil.

Ela dá nome ao resultado da regra.

---

## Erros comuns

### Erro 1 — Usar variável antes de declarar

Errado:

```java
System.out.println(nomeCliente);
String nomeCliente = "Cliente";
```

Correção:

```java
String nomeCliente = "Cliente";
System.out.println(nomeCliente);
```

---

### Erro 2 — Declarar sem inicializar e usar

Errado:

```java
String nomeCliente;
System.out.println(nomeCliente);
```

Correção:

```java
String nomeCliente = "Cliente";
System.out.println(nomeCliente);
```

---

### Erro 3 — Tipo incompatível

Errado:

```java
int quantidade = "10";
```

Correção:

```java
int quantidade = 10;
```

---

### Erro 4 — Aspas erradas

Errado:

```java
String nome = 'Cliente';
```

Correção:

```java
String nome = "Cliente";
```

Para `char`:

```java
char categoria = 'A';
```

---

### Erro 5 — Redefinir variável no mesmo bloco

Errado:

```java
String status = "PENDENTE";
String status = "APROVADO";
```

Correção:

```java
String status = "PENDENTE";
status = "APROVADO";
```

---

### Erro 6 — Nome sem intenção

Ruim:

```java
int x = 10;
String s = "ABERTA";
boolean f = true;
```

Melhor:

```java
int quantidadePedidos = 10;
String statusOrdemServico = "ABERTA";
boolean permiteReagendamento = true;
```

---

### Erro 7 — Nome com padrão errado

Ruim:

```java
String NomeCliente = "Cliente";
String nome_cliente = "Cliente";
String NOMECLIENTE = "Cliente";
```

Melhor:

```java
String nomeCliente = "Cliente";
```

---

### Erro 8 — Usar acento em nome técnico

Evite:

```java
String situaçãoPedido = "PENDENTE";
```

Mesmo que Java suporte Unicode em identificadores, evite acentos em nomes técnicos.

Melhor:

```java
String situacaoPedido = "PENDENTE";
```

Isso reduz problemas de compatibilidade, leitura e padrão de time.

---

### Erro 9 — Usar palavra reservada

Errado:

```java
String class = "Teste";
```

`class` é palavra reservada.

Correção:

```java
String nomeClasse = "Teste";
```

---

### Erro 10 — Ler `=` como igualdade

Errado conceitualmente:

```text
quantidade é igual a 10.
```

Melhor:

```text
quantidade recebe 10.
```

Comparação virá depois.

---

## Diagnóstico de erro com variável

Quando der erro, siga o roteiro.

### 1. A variável foi declarada?

Procure:

```java
tipo nomeVariavel
```

Exemplo:

```java
String nomeCliente
```

### 2. Foi declarada antes do uso?

Java lê de cima para baixo dentro do método.

### 3. Foi inicializada antes do uso?

Variável local precisa receber valor antes de ser usada.

### 4. O tipo combina com o valor?

Exemplos:

```java
int quantidade = 10;
String nome = "Cliente";
boolean ativo = true;
char categoria = 'A';
```

### 5. O nome foi escrito igual?

Java diferencia maiúsculas e minúsculas.

```java
nomeCliente
```

é diferente de:

```java
NomeCliente
```

### 6. Há duas declarações com mesmo nome no mesmo bloco?

Remova a segunda declaração ou altere o valor sem repetir o tipo.

### 7. Usou aspas corretas?

String usa `"texto"`.

Char usa `'A'`.

### 8. Faltou ponto e vírgula?

Variáveis terminam com:

```java
;
```

### 9. O nome usa palavra reservada?

Não use `class`, `public`, `static`, `void`, `int`, etc.

### 10. O erro aponta qual linha?

Leia a mensagem do compilador.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Usar antes de declarar

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(nomeCliente);
        String nomeCliente = "Cliente";
    }
}
```

Compile e leia o erro.

### Teste 2 — Tipo incompatível

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = "10";
    }
}
```

Compile e leia o erro.

### Teste 3 — Variável sem inicializar

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente;
        System.out.println(nomeCliente);
    }
}
```

Compile e leia o erro.

### Teste 4 — Nome com maiúscula diferente

```java
public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Cliente";
        System.out.println(NomeCliente);
    }
}
```

Compile e leia o erro.

Depois corrija todos.

Essa prática ensina mais do que só copiar código certo.

---

## Prática recomendada

Crie pasta:

```powershell
mkdir labs\m1\aula-024-variaveis-nomes
cd labs\m1\aula-024-variaveis-nomes
```

Crie arquivos:

```text
Main.java
OrdemServicoVariaveis.java
PedidoVariaveis.java
AuditoriaVariaveis.java
CalculoPedido.java
```

Compile:

```powershell
javac Main.java
javac OrdemServicoVariaveis.java
javac PedidoVariaveis.java
javac AuditoriaVariaveis.java
javac CalculoPedido.java
```

Execute:

```powershell
java Main
java OrdemServicoVariaveis
java PedidoVariaveis
java AuditoriaVariaveis
java CalculoPedido
```

Depois quebre erros de propósito e corrija.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Renomear variável | `Shift + F6` | Trocar nome com segurança |
| Reformatar código | `Ctrl + Alt + L` | Organizar código |
| Organizar imports | `Ctrl + Alt + O` | Será mais útil depois |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar pelos arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Search Everywhere | `Shift Shift` | Buscar arquivos/classes |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Duplicar linha | `Ctrl + D` em muitos keymaps | Criar variações rápidas |
| Apagar linha | `Ctrl + Y` em muitos keymaps | Remover linha |
| Commit | `Ctrl + K` | Revisar alterações |
| Push | `Ctrl + Shift + K` | Enviar commits |

Atalhos variam conforme keymap.

Se algum não funcionar:

```text
Ctrl + Shift + A
```

e procure pelo nome da ação.

---

## Por que `Shift + F6` é importante

Se você escreveu:

```java
String cliente = "Cliente Exemplo";
```

e quer melhorar para:

```java
String nomeCliente = "Cliente Exemplo";
```

Não saia alterando manualmente em todos os lugares.

Use refatoração de renomear:

```text
Shift + F6
```

A IDE troca de forma segura nos usos corretos.

Isso é hábito profissional.

Renomear bem é parte da qualidade do código.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 024 — Variáveis e nomes profissionais

### O que aprendi
Aprendi que variável é um espaço nomeado para guardar valor durante a execução do programa. Também aprendi declaração, atribuição, alteração e padrão `camelCase`.

### O que pratiquei
Criei variáveis com nomes profissionais aplicadas a cliente, pedido, ordem de serviço, auditoria e cálculo simples.

### Conceitos principais
- Variável
- Tipo
- Nome
- Valor
- Declaração
- Atribuição
- Alteração
- `camelCase`
- Variável temporária
- Nome com intenção
- Tipo incompatível
- Variável local

### Arquivos criados
- `labs/m1/aula-024-variaveis-nomes/Main.java`
- `labs/m1/aula-024-variaveis-nomes/OrdemServicoVariaveis.java`
- `labs/m1/aula-024-variaveis-nomes/PedidoVariaveis.java`
- `labs/m1/aula-024-variaveis-nomes/AuditoriaVariaveis.java`
- `labs/m1/aula-024-variaveis-nomes/CalculoPedido.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac OrdemServicoVariaveis.java
java OrdemServicoVariaveis
javac PedidoVariaveis.java
java PedidoVariaveis
javac AuditoriaVariaveis.java
java AuditoriaVariaveis
javac CalculoPedido.java
java CalculoPedido
```

### Atalhos úteis
- `Shift + F6` — renomear variável.
- `Ctrl + Alt + L` — reformatar.
- `Alt + F12` — terminal integrado.
- `Alt + 1` — Project.
- `Ctrl + Shift + A` — buscar ação.
- `Ctrl + K` — Commit.

### Erros que quero evitar
- usar variável antes de declarar;
- usar variável sem inicializar;
- atribuir texto em variável `int`;
- usar aspas erradas;
- redeclarar variável no mesmo bloco;
- usar nomes como `x`, `s`, `flag`;
- fugir do `camelCase`;
- usar acento em nome técnico;
- ler `=` como igualdade.

### Próximo passo
Estudar tipos inteiros em Java.
```

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-024-variaveis-nomes docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 024: pratica variaveis e nomes profissionais"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é uma variável?
2. Qual a diferença entre declarar e atribuir?
3. O que significa alterar o valor de uma variável?
4. Por que Java exige tipo na variável?
5. O que significa `camelCase`?
6. Por que `quantidadePedidos` é melhor que `x`?
7. Por que `flag` geralmente é um nome ruim?
8. Qual a diferença entre `String nome = "Ana";` e `char letra = 'A';`?
9. Por que `int quantidade = "10";` está errado?
10. Por que o operador `=` deve ser lido como “recebe”?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é variável;
declarar variável;
atribuir valor;
alterar valor;
diferenciar declaração e alteração;
usar String;
usar int em exemplo simples;
usar double em exemplo simples;
usar boolean em exemplo simples;
usar char em exemplo simples;
usar camelCase;
escolher nomes com intenção;
evitar nomes genéricos;
evitar flag sem contexto;
usar variável temporária útil;
explicar que Java é fortemente tipado;
corrigir variável usada antes de declarar;
corrigir variável local sem inicialização;
corrigir tipo incompatível;
corrigir redeclaração no mesmo bloco;
corrigir aspas erradas;
usar Shift + F6 para renomear;
compilar exemplos;
executar exemplos;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar todos os tipos.

Não precisa ainda entender limites de `int`, `long`, `byte` e `short`.

Isso começa na próxima aula.

O objetivo aqui é dominar a ideia de variável e nome profissional.

---

## Fechamento da aula

Hoje o código começou a guardar informações com nomes.

Isso muda a leitura.

Antes:

```java
System.out.println("Cliente Exemplo");
```

Agora:

```java
String nomeCliente = "Cliente Exemplo";
System.out.println(nomeCliente);
```

O valor ganhou intenção.

O código começa a representar domínio.

Variáveis são a base para cálculo, regras, decisões, objetos, métodos, APIs e banco de dados.

Mas variável mal nomeada vira ruído.

Por isso, desde cedo, nomes profissionais fazem parte da formação.

Na próxima aula, vamos entrar nos tipos inteiros:

```text
byte;
short;
int;
long;
limites;
overflow;
sufixo L;
escolha correta.
```

Agora que já sabemos declarar variável, podemos estudar melhor os tipos que elas carregam.
