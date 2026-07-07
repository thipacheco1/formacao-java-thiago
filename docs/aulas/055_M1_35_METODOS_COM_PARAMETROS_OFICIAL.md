# 055 — M1.35 — Métodos com Parâmetros

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.35.01` — Métodos com parâmetros — Conceito, por que existe e vocabulário essencial.
- `M1.35.02` — Métodos com parâmetros — Exemplo mínimo digitado do zero.
- `M1.35.03` — Métodos com parâmetros — Exemplo aplicado ao domínio corporativo.
- `M1.35.04` — Métodos com parâmetros — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para aprofundar entrada de dados para métodos, ordem dos parâmetros, nomes, legibilidade, parâmetros de tipos primitivos, `String`, arrays, matrizes, diferença entre parâmetro e argumento, validação de entrada recebida por método, efeitos em legibilidade, erros comuns, diagnóstico e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 1, aprofundando métodos.

A sequência recente foi:

```text
051 — M1.31 — Arrays paralelos;
052 — M1.32 — Matriz bidimensional inicial;
053 — M1.33 — Métodos sem retorno;
054 — M1.34 — Métodos com retorno;
055 — M1.35 — Métodos com parâmetros.
```

Na aula 053, estudamos métodos sem retorno:

```java
public static void exibirMensagem() {
    System.out.println("Mensagem");
}
```

Na aula 054, estudamos métodos com retorno:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Agora vamos aprofundar algo que já apareceu nas duas aulas:

```text
parâmetros.
```

Parâmetros são a forma de enviar dados para dentro de um método.

Exemplo:

```java
public static void exibirCliente(String nome) {
    System.out.println("Cliente: " + nome);
}
```

Aqui:

```java
String nome
```

é um parâmetro.

Na chamada:

```java
exibirCliente("Ana");
```

o valor `"Ana"` entra no método e fica disponível na variável `nome`.

Sem parâmetros, o método fica limitado a dados fixos.

Com parâmetros, o método fica reutilizável.

---

## Hoje a aula é sobre entrada de dados para métodos

Um método pode precisar receber informações para executar sua responsabilidade.

Exemplo sem parâmetro:

```java
public static void exibirPedido() {
    System.out.println("Cliente: Ana");
    System.out.println("Valor: 1000");
    System.out.println("Status: PENDENTE");
}
```

Esse método é rígido.

Sempre exibe Ana, 1000 e PENDENTE.

Agora com parâmetros:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status) {
    System.out.println("Cliente: " + cliente);
    System.out.println("Valor: " + valorCentavos);
    System.out.println("Status: " + status);
}
```

Agora o método pode exibir qualquer pedido:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
exibirPedido("Bruno", 2500L, "APROVADO");
exibirPedido("Carla", 5000L, "RECUSADO");
```

Essa é a função do parâmetro:

```text
levar informação de fora para dentro do método.
```

---

## O que é parâmetro

Parâmetro é uma variável declarada na assinatura do método.

Exemplo:

```java
public static void exibirCliente(String nome) {
    System.out.println("Cliente: " + nome);
}
```

Neste método:

```java
String nome
```

é o parâmetro.

Ele tem:

```text
tipo -> String;
nome -> nome.
```

Dentro do método, usamos o parâmetro como uma variável normal:

```java
System.out.println(nome);
```

O valor dele vem da chamada.

---

## O que é argumento

Argumento é o valor enviado para o parâmetro na chamada do método.

Declaração:

```java
public static void exibirCliente(String nome) {
    System.out.println("Cliente: " + nome);
}
```

Chamada:

```java
exibirCliente("Ana");
```

Aqui:

```text
parâmetro -> nome;
argumento -> "Ana".
```

Outra chamada:

```java
exibirCliente("Bruno");
```

Agora:

```text
parâmetro -> nome;
argumento -> "Bruno".
```

O parâmetro é como uma vaga.

O argumento é o valor que ocupa essa vaga em uma chamada específica.

---

## Parâmetro versus argumento

Resumo direto:

```text
parâmetro fica na declaração do método;
argumento fica na chamada do método.
```

Exemplo:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status) {
    System.out.println(cliente);
    System.out.println(valorCentavos);
    System.out.println(status);
}
```

Parâmetros:

```text
cliente;
valorCentavos;
status.
```

Chamada:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
```

Argumentos:

```text
"Ana";
1000L;
"PENDENTE".
```

Essa diferença precisa ficar clara.

---

## Vocabulário essencial

Termos desta aula:

```text
método;
parâmetro;
argumento;
assinatura;
tipo do parâmetro;
nome do parâmetro;
ordem dos parâmetros;
legibilidade;
entrada de dados;
chamada;
valor literal;
variável como argumento;
parâmetro obrigatório;
escopo do parâmetro;
parâmetro primitivo;
parâmetro String;
parâmetro array;
parâmetro matriz;
imutabilidade de String;
referência de array;
efeito colateral;
responsabilidade;
nome expressivo;
muitos parâmetros;
parâmetros relacionados;
validação de parâmetro.
```

Termos mais importantes:

```text
parâmetro -> variável que o método recebe;
argumento -> valor enviado na chamada;
ordem -> sequência em que os argumentos precisam ser enviados;
legibilidade -> facilidade de entender a chamada e a assinatura;
escopo -> região onde o parâmetro existe;
efeito colateral -> alteração em estrutura recebida, como array.
```

---

## Assinatura com parâmetros

Exemplo:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status)
```

Essa assinatura diz:

```text
o método se chama exibirPedido;
não retorna valor, porque é void;
recebe uma String chamada cliente;
recebe um long chamado valorCentavos;
recebe uma String chamada status.
```

A chamada precisa respeitar isso:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
```

Se trocar a ordem e os tipos não baterem, não compila.

Se trocar a ordem entre dois parâmetros do mesmo tipo, pode compilar, mas gerar erro lógico.

Esse ponto é muito importante.

---

## Ordem dos parâmetros

A ordem dos parâmetros importa.

Exemplo:

```java
public static void exibirCliente(String nome, String documento) {
    System.out.println("Nome: " + nome);
    System.out.println("Documento: " + documento);
}
```

Chamada correta:

```java
exibirCliente("Ana", "12345678900");
```

Chamada errada, mas que compila:

```java
exibirCliente("12345678900", "Ana");
```

Por quê compila?

Porque os dois argumentos são `String`.

Mas a lógica fica errada:

```text
Nome: 12345678900
Documento: Ana
```

Por isso, a ordem precisa ser clara.

---

## Nome ajuda a ordem

Compare.

Menos claro:

```java
public static void exibir(String a, String b, String c) {
}
```

Mais claro:

```java
public static void exibirPedido(String cliente, String certificado, String status) {
}
```

Na chamada ainda não aparecem os nomes dos parâmetros, mas a assinatura fica muito mais compreensível.

Dentro do método, nomes bons reduzem erro.

Exemplo ruim:

```java
System.out.println(a);
System.out.println(b);
System.out.println(c);
```

Exemplo bom:

```java
System.out.println(cliente);
System.out.println(certificado);
System.out.println(status);
```

Nome é parte da qualidade do código.

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        exibirMensagem("Olá, parâmetros!");
    }

    public static void exibirMensagem(String mensagem) {
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
Olá, parâmetros!
```

Esse é o menor exemplo útil.

O método recebe uma `String`.

A chamada envia uma `String`.

O método imprime a mensagem recebida.

---

## Parâmetro com valor literal

No exemplo:

```java
exibirMensagem("Olá, parâmetros!");
```

o argumento é um valor literal.

Valor literal é um valor escrito diretamente no código.

Exemplos:

```java
"Texto"
10
1000L
8.5
true
```

Chamadas com literais:

```java
exibirMensagem("Pedido aprovado");
exibirQuantidade(10);
exibirValor(1000L);
exibirMedia(8.5);
exibirResultado(true);
```

---

## Parâmetro com variável como argumento

Também podemos enviar variável.

Exemplo:

```java
String mensagem = "Pedido criado com sucesso";

exibirMensagem(mensagem);
```

Código completo:

```java
public class Main {
    public static void main(String[] args) {
        String mensagem = "Pedido criado com sucesso";

        exibirMensagem(mensagem);
    }

    public static void exibirMensagem(String mensagem) {
        System.out.println(mensagem);
    }
}
```

Aqui existe uma variável chamada `mensagem` no `main` e outra chamada `mensagem` no método.

Elas estão em escopos diferentes.

---

## Escopo do parâmetro

O parâmetro existe apenas dentro do método.

Exemplo:

```java
public static void exibirMensagem(String mensagem) {
    System.out.println(mensagem);
}
```

A variável `mensagem` só existe dentro de:

```java
exibirMensagem
```

Fora dele, ela não existe.

Errado:

```java
public static void main(String[] args) {
    exibirMensagem("Olá");
    System.out.println(mensagem);
}
```

`mensagem` não existe no `main`.

Ela é parâmetro do método `exibirMensagem`.

---

## Parâmetro int

Arquivo:

```text
ParametroInt.java
```

Código:

```java
public class ParametroInt {
    public static void main(String[] args) {
        exibirQuantidade(5);
        exibirQuantidade(10);
    }

    public static void exibirQuantidade(int quantidade) {
        System.out.println("Quantidade: " + quantidade);
    }
}
```

Saída:

```text
Quantidade: 5
Quantidade: 10
```

Use `int` para:

```text
quantidades;
contadores;
índices;
tentativas;
parcelas;
estoque;
atividades.
```

---

## Parâmetro long

Arquivo:

```text
ParametroLong.java
```

Código:

```java
public class ParametroLong {
    public static void main(String[] args) {
        exibirValorCentavos(1000L);
        exibirValorCentavos(2500L);
    }

    public static void exibirValorCentavos(long valorCentavos) {
        System.out.println("Valor em centavos: " + valorCentavos);
    }
}
```

Use `long` para:

```text
valores monetários em centavos;
identificadores numéricos grandes;
totais acumulados maiores.
```

Nesta fase, dinheiro segue como centavos em `long`.

---

## Parâmetro double

Arquivo:

```text
ParametroDouble.java
```

Código:

```java
public class ParametroDouble {
    public static void main(String[] args) {
        exibirMedia(8.5);
        exibirMedia(7.25);
    }

    public static void exibirMedia(double media) {
        System.out.println("Média: " + media);
    }
}
```

Use `double` para:

```text
notas;
médias;
tempos;
percentuais didáticos.
```

Para dinheiro, não use `double` nesta fase.

---

## Parâmetro boolean

Arquivo:

```text
ParametroBoolean.java
```

Código:

```java
public class ParametroBoolean {
    public static void main(String[] args) {
        exibirResultadoValidacao(true);
        exibirResultadoValidacao(false);
    }

    public static void exibirResultadoValidacao(boolean valido) {
        if (valido) {
            System.out.println("Registro válido");
        } else {
            System.out.println("Registro inválido");
        }
    }
}
```

Use `boolean` quando o método precisa receber uma decisão pronta:

```text
válido ou inválido;
ativo ou inativo;
encontrou ou não encontrou;
deve enviar ou não;
tem estoque ou não.
```

---

## Parâmetro String

Arquivo:

```text
ParametroString.java
```

Código:

```java
public class ParametroString {
    public static void main(String[] args) {
        exibirStatus("PENDENTE");
        exibirStatus("APROVADO");
    }

    public static void exibirStatus(String status) {
        System.out.println("Status: " + status);
    }
}
```

Use `String` para:

```text
nome;
status;
descrição;
tipo;
mensagem;
certificado;
usuário;
categoria.
```

Sempre pense em validação textual quando `String` vem de fora.

---

## Vários parâmetros

Arquivo:

```text
VariosParametros.java
```

Código:

```java
public class VariosParametros {
    public static void main(String[] args) {
        exibirPedido("Ana", 1000L, "PENDENTE");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Status: " + status);
    }
}
```

Aqui o método recebe três parâmetros.

A chamada precisa enviar três argumentos.

Na mesma ordem:

```text
cliente;
valor;
status.
```

---

## Ordem errada com tipos diferentes

Assinatura:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status)
```

Chamada errada:

```java
exibirPedido(1000L, "Ana", "PENDENTE");
```

Isso não compila, porque o primeiro parâmetro espera `String`, mas recebeu `long`.

Erro de compilação é bom.

Ele impede o problema.

---

## Ordem errada com tipos iguais

Assinatura:

```java
public static void exibirCliente(String nome, String documento)
```

Chamada errada:

```java
exibirCliente("12345678900", "Ana");
```

Isso compila.

Mas fica semanticamente errado.

Por isso, quando existem muitos parâmetros do mesmo tipo, redobre o cuidado com:

```text
nome dos parâmetros;
ordem;
nome do método;
testes manuais;
mensagens de saída.
```

No futuro, objetos ajudarão a reduzir esse problema.

---

## Exemplo aplicado: cliente

Arquivo:

```text
ClienteComParametros.java
```

Código:

```java
public class ClienteComParametros {
    public static void main(String[] args) {
        exibirCliente("Ana", "12345678900", "ATIVO");
        exibirCliente("Bruno", "98765432100", "INATIVO");
    }

    public static void exibirCliente(String nome, String documento, String status) {
        System.out.println("Cliente: " + nome);
        System.out.println("Documento: " + documento);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Esse exemplo mostra vários textos.

Como todos são `String`, a ordem precisa ser respeitada com atenção.

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoComParametros.java
```

Código:

```java
public class ProdutoComParametros {
    public static void main(String[] args) {
        exibirProduto("Mesa", 10, "ATIVO");
        exibirProduto("Cadeira", 0, "ATIVO");
    }

    public static void exibirProduto(String nome, int estoque, String status) {
        System.out.println("Produto: " + nome);
        System.out.println("Estoque: " + estoque);
        System.out.println("Status: " + status);

        if (estoque == 0 && "ATIVO".equals(status)) {
            System.out.println("Atenção: produto ativo sem estoque.");
        }

        System.out.println("--------------------");
    }
}
```

Aqui temos:

```text
String;
int;
String.
```

A ordem fica mais protegida porque os tipos são diferentes em parte da assinatura.

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoComParametros.java
```

Código:

```java
public class PedidoComParametros {
    public static void main(String[] args) {
        exibirPedido("Ana", 1000L, "PENDENTE");
        exibirPedido("Bruno", 2500L, "APROVADO");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Pedido");
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Esse é o exemplo corporativo central desta aula.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoComParametros.java
```

Código:

```java
public class PagamentoComParametros {
    public static void main(String[] args) {
        exibirPagamento(10000L, 4);
        exibirPagamento(2500L, 1);
    }

    public static void exibirPagamento(long valorCentavos, int parcelas) {
        System.out.println("Pagamento");
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Parcelas: " + parcelas);

        if (valorCentavos <= 0 || parcelas <= 0) {
            System.out.println("Pagamento inválido");
        } else {
            long valorParcela = valorCentavos / parcelas;
            System.out.println("Valor aproximado da parcela: " + valorParcela);
        }

        System.out.println("--------------------");
    }
}
```

Esse método recebe entradas necessárias para exibir e calcular a parcela.

Ainda é método `void`, mas com parâmetros.

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoComParametros.java
```

Código:

```java
public class OrdemServicoComParametros {
    public static void main(String[] args) {
        exibirOrdemServico("OS-001", "ABERTA", 3);
        exibirOrdemServico("OS-002", "CONCLUIDA", 5);
    }

    public static void exibirOrdemServico(String certificado, String status, int quantidadeAtividades) {
        System.out.println("Ordem de Serviço");
        System.out.println("Certificado: " + certificado);
        System.out.println("Status: " + status);
        System.out.println("Quantidade de atividades: " + quantidadeAtividades);
        System.out.println("--------------------");
    }
}
```

Aqui os parâmetros representam campos resumidos de uma OS.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaComParametros.java
```

Código:

```java
public class AuditoriaComParametros {
    public static void main(String[] args) {
        registrarAuditoria("aline", "CRIACAO", "SUCESSO");
        registrarAuditoria("jackson", "EDICAO", "SUCESSO");
        registrarAuditoria("guilherme", "EXCLUSAO", "RECUSADO");
    }

    public static void registrarAuditoria(String usuario, String operacao, String status) {
        System.out.println("AUDITORIA");
        System.out.println("Usuário: " + usuario);
        System.out.println("Operação: " + operacao);
        System.out.println("Status: " + status);
        System.out.println("--------------------");
    }
}
```

Esse exemplo mostra método de ação com parâmetros textuais.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaComParametros.java
```

Código:

```java
public class MensageriaComParametros {
    public static void main(String[] args) {
        exibirMensagem("Ana", "BOAS_VINDAS", 1);
        exibirMensagem("Bruno", "ENTREGA", 3);
    }

    public static void exibirMensagem(String cliente, String tipoMensagem, int tentativas) {
        System.out.println("Mensagem");
        System.out.println("Cliente: " + cliente);
        System.out.println("Tipo: " + tipoMensagem);
        System.out.println("Tentativas: " + tentativas);

        if (tentativas > 2) {
            System.out.println("Atenção: mensagem com muitas tentativas.");
        }

        System.out.println("--------------------");
    }
}
```

Esse método recebe os dados necessários para exibir o estado da mensagem.

---

## Método com parâmetro e retorno

Parâmetro e retorno podem trabalhar juntos.

Exemplo:

```java
public static boolean statusValido(String status) {
    if (status == null || status.isBlank()) {
        return false;
    }

    String normalizado = status.trim().toUpperCase();

    return "PENDENTE".equals(normalizado)
            || "APROVADO".equals(normalizado)
            || "RECUSADO".equals(normalizado);
}
```

Entrada:

```text
status.
```

Saída:

```text
true ou false.
```

Esse padrão será cada vez mais comum.

Método recebe dados, processa e retorna resposta.

---

## Exemplo: validar status com parâmetro

Arquivo:

```text
ValidarStatusComParametro.java
```

Código:

```java
public class ValidarStatusComParametro {
    public static void main(String[] args) {
        String status = " aprovado ";

        boolean valido = statusValido(status);

        if (valido) {
            System.out.println("Status válido");
        } else {
            System.out.println("Status inválido");
        }
    }

    public static boolean statusValido(String status) {
        if (status == null || status.isBlank()) {
            return false;
        }

        String normalizado = status.trim().toUpperCase();

        return "PENDENTE".equals(normalizado)
                || "APROVADO".equals(normalizado)
                || "RECUSADO".equals(normalizado)
                || "CANCELADO".equals(normalizado);
    }
}
```

Esse exemplo aprofunda legibilidade e validação.

---

## Parâmetro array

Métodos podem receber arrays.

Exemplo:

```java
public static void exibirClientes(String[] clientes) {
    for (int indice = 0; indice < clientes.length; indice++) {
        System.out.println(clientes[indice]);
    }
}
```

Chamada:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};

exibirClientes(clientes);
```

O array entra como parâmetro.

O método percorre o array.

---

## Exemplo com array de números

Arquivo:

```text
ArrayComoParametro.java
```

Código:

```java
public class ArrayComoParametro {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        exibirValores(valores);
    }

    public static void exibirValores(int[] valores) {
        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println("Valor " + (indice + 1) + ": " + valores[indice]);
        }
    }
}
```

Esse método é `void`.

Ele recebe o array e exibe.

---

## Exemplo com array e retorno

Arquivo:

```text
ArrayParametroComRetorno.java
```

Código:

```java
public class ArrayParametroComRetorno {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        int total = calcularTotal(valores);

        System.out.println("Total: " + total);
    }

    public static int calcularTotal(int[] valores) {
        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        return total;
    }
}
```

Aqui o array é parâmetro.

O total é retorno.

Essa combinação é extremamente importante.

---

## Parâmetro matriz

Métodos também podem receber matriz.

Arquivo:

```text
MatrizComoParametro.java
```

Código:

```java
public class MatrizComoParametro {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        exibirMatriz(matriz);
    }

    public static void exibirMatriz(int[][] matriz) {
        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

O parâmetro é:

```java
int[][] matriz
```

Isso significa:

```text
o método recebe uma matriz de inteiros.
```

---

## Parâmetro matriz com retorno

Arquivo:

```text
MatrizParametroComRetorno.java
```

Código:

```java
public class MatrizParametroComRetorno {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        int total = calcularTotalMatriz(matriz);

        System.out.println("Total: " + total);
    }

    public static int calcularTotalMatriz(int[][] matriz) {
        int total = 0;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                total += matriz[linha][coluna];
            }
        }

        return total;
    }
}
```

Esse exemplo junta:

```text
parâmetro matriz;
laços aninhados;
retorno numérico.
```

---

## Parâmetro primitivo e cópia de valor

Tipos primitivos, como `int`, `long`, `double` e `boolean`, são passados por valor.

Nesta fase, entenda assim:

```text
o método recebe uma cópia do valor.
```

Exemplo:

```java
public class PrimitivoComoParametro {
    public static void main(String[] args) {
        int quantidade = 10;

        alterarQuantidade(quantidade);

        System.out.println("Quantidade no main: " + quantidade);
    }

    public static void alterarQuantidade(int quantidade) {
        quantidade = 99;

        System.out.println("Quantidade no método: " + quantidade);
    }
}
```

Saída:

```text
Quantidade no método: 99
Quantidade no main: 10
```

O valor do `main` não mudou.

---

## Array como parâmetro pode ser alterado

Arrays são objetos.

Quando um array é passado para um método, o método consegue alterar o conteúdo do array.

Exemplo:

```java
public class ArrayAlteradoPorMetodo {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        alterarPrimeiroValor(valores);

        System.out.println(valores[0]);
    }

    public static void alterarPrimeiroValor(int[] valores) {
        valores[0] = 99;
    }
}
```

Saída:

```text
99
```

O array original foi alterado.

Esse é um efeito colateral.

---

## Efeito colateral com parâmetro

Efeito colateral acontece quando o método altera algo fora dele.

Exemplo:

```java
alterarPrimeiroValor(valores);
```

Depois da chamada, o array do `main` mudou.

Isso pode ser útil, mas precisa estar claro no nome.

Nome ruim:

```java
exibirValores(valores)
```

mas dentro altera.

Nome bom:

```java
alterarPrimeiroValor(valores)
normalizarStatus(statusPedidos)
incrementarTentativa(tentativas, indice)
```

O nome deve avisar que há alteração.

---

## Exemplo: normalizar array de status

Arquivo:

```text
NormalizarArrayStatusParametro.java
```

Código:

```java
public class NormalizarArrayStatusParametro {
    public static void main(String[] args) {
        String[] statusPedidos = {" pendente ", "aprovado", " RECUSADO "};

        normalizarStatus(statusPedidos);
        exibirStatus(statusPedidos);
    }

    public static void normalizarStatus(String[] statusPedidos) {
        for (int indice = 0; indice < statusPedidos.length; indice++) {
            statusPedidos[indice] = statusPedidos[indice].trim().toUpperCase();
        }
    }

    public static void exibirStatus(String[] statusPedidos) {
        for (int indice = 0; indice < statusPedidos.length; indice++) {
            System.out.println(statusPedidos[indice]);
        }
    }
}
```

Esse exemplo tem dois métodos com parâmetros:

```text
um altera;
outro exibe.
```

Nomes deixam a responsabilidade clara.

---

## Muitos parâmetros

Métodos com muitos parâmetros ficam difíceis de ler.

Exemplo:

```java
public static void cadastrarPedido(
        String cliente,
        String documento,
        String produto,
        int quantidade,
        long valorCentavos,
        String status,
        String usuario,
        String origem
) {
}
```

Isso ainda pode acontecer em código inicial.

Mas é um sinal de que os dados pertencem juntos.

No futuro, usaremos objetos:

```text
Pedido;
Cliente;
Produto;
Usuario.
```

Por enquanto, a regra é:

```text
mantenha parâmetros necessários;
use nomes claros;
evite misturar responsabilidades.
```

---

## Parâmetros relacionados indicam futuro objeto

Se você sempre passa juntos:

```text
cliente;
documento;
telefone.
```

talvez exista um futuro objeto:

```text
Cliente.
```

Se você sempre passa juntos:

```text
valor;
parcelas;
statusPagamento.
```

talvez exista:

```text
Pagamento.
```

Se você sempre passa juntos:

```text
certificado;
status;
quantidadeAtividades.
```

talvez exista:

```text
OrdemServico.
```

Essa percepção é parte da evolução para arquitetura.

Por enquanto, estamos usando parâmetros.

Mas o raciocínio já prepara para classes.

---

## Exemplo de legibilidade ruim

Arquivo:

```text
LegibilidadeRuimParametros.java
```

Código:

```java
public class LegibilidadeRuimParametros {
    public static void main(String[] args) {
        p("Ana", "PENDENTE", 1000L);
    }

    public static void p(String a, String b, long c) {
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    }
}
```

Esse código compila.

Mas é ruim.

Problemas:

```text
nome do método não diz nada;
nomes dos parâmetros não dizem nada;
ordem não fica clara;
manutenção fica difícil.
```

---

## Exemplo de legibilidade boa

Arquivo:

```text
LegibilidadeBoaParametros.java
```

Código:

```java
public class LegibilidadeBoaParametros {
    public static void main(String[] args) {
        exibirPedido("Ana", 1000L, "PENDENTE");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Status: " + status);
    }
}
```

Agora a intenção aparece no código.

Isso é legibilidade.

---

## Validando parâmetros

Quando um método recebe parâmetros, ele não deve confiar cegamente.

Exemplo:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status) {
    if (cliente == null || cliente.isBlank()) {
        System.out.println("Cliente inválido");
        return;
    }

    if (valorCentavos <= 0) {
        System.out.println("Valor inválido");
        return;
    }

    if (status == null || status.isBlank()) {
        System.out.println("Status inválido");
        return;
    }

    System.out.println("Cliente: " + cliente);
    System.out.println("Valor: " + valorCentavos);
    System.out.println("Status: " + status);
}
```

O método protege sua responsabilidade.

Isso será cada vez mais importante.

---

## Exemplo aplicado com validação de parâmetros

Arquivo:

```text
PedidoParametrosValidados.java
```

Código:

```java
public class PedidoParametrosValidados {
    public static void main(String[] args) {
        exibirPedido("Ana", 1000L, "PENDENTE");
        exibirPedido("", 2500L, "APROVADO");
        exibirPedido("Carla", -1L, "RECUSADO");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        if (cliente == null || cliente.isBlank()) {
            System.out.println("Cliente inválido.");
            return;
        }

        if (valorCentavos <= 0) {
            System.out.println("Valor inválido.");
            return;
        }

        if (status == null || status.isBlank()) {
            System.out.println("Status inválido.");
            return;
        }

        System.out.println("Cliente: " + cliente.trim());
        System.out.println("Valor em centavos: " + valorCentavos);
        System.out.println("Status: " + status.trim().toUpperCase());
        System.out.println("--------------------");
    }
}
```

Esse exemplo usa `return;` em método `void` para sair cedo.

---

## Parâmetro com nome igual a variável do main

Isso é permitido:

```java
public class NomeIgualParametro {
    public static void main(String[] args) {
        String status = "APROVADO";

        exibirStatus(status);
    }

    public static void exibirStatus(String status) {
        System.out.println("Status: " + status);
    }
}
```

Existe uma variável `status` no `main`.

Existe um parâmetro `status` no método.

São escopos diferentes.

O argumento passa o valor para o parâmetro.

Não é a mesma variável.

---

## Parâmetro com nome diferente da variável do main

Também é permitido:

```java
public class NomeDiferenteParametro {
    public static void main(String[] args) {
        String statusPedido = "APROVADO";

        exibirStatus(statusPedido);
    }

    public static void exibirStatus(String status) {
        System.out.println("Status: " + status);
    }
}
```

O nome do argumento no `main` não precisa ser igual ao nome do parâmetro.

O que importa é:

```text
tipo;
ordem;
valor enviado.
```

---

## Erros comuns

### Erro 1 — Confundir parâmetro com argumento

Parâmetro fica na declaração.

Argumento fica na chamada.

---

### Erro 2 — Passar argumentos na ordem errada

Especialmente perigoso quando os tipos são iguais.

Exemplo:

```java
exibirCliente(documento, nome);
```

quando a assinatura espera:

```java
exibirCliente(nome, documento);
```

---

### Erro 3 — Usar nomes genéricos

Ruim:

```java
public static void metodo(String a, String b, int c)
```

Bom:

```java
public static void exibirProduto(String nome, String status, int estoque)
```

---

### Erro 4 — Esquecer tipo do parâmetro

Errado:

```java
public static void exibir(nome) {
}
```

Certo:

```java
public static void exibir(String nome) {
}
```

---

### Erro 5 — Chamar método sem enviar argumento obrigatório

Assinatura:

```java
exibirMensagem(String mensagem)
```

Chamada errada:

```java
exibirMensagem();
```

Se o método pede parâmetro, a chamada precisa enviar argumento.

---

### Erro 6 — Enviar tipo incompatível

Assinatura:

```java
exibirQuantidade(int quantidade)
```

Chamada errada:

```java
exibirQuantidade("dez");
```

---

### Erro 7 — Achar que alterar primitivo dentro do método altera fora

Com `int`, `long`, `double`, `boolean`, o método recebe cópia do valor.

---

### Erro 8 — Alterar array sem perceber

Array recebido como parâmetro pode ter seu conteúdo alterado.

Isso precisa ser intencional.

---

### Erro 9 — Método com parâmetros demais

Muitos parâmetros reduzem legibilidade e indicam possível futuro objeto.

---

### Erro 10 — Não validar parâmetro vindo de fora

Se o parâmetro pode ser inválido, valide.

Principalmente:

```text
String null;
String em branco;
valor negativo;
índice fora do array;
array vazio;
matriz vazia.
```

---

## Diagnóstico de métodos com parâmetros

Quando um método com parâmetros der erro, siga o roteiro.

### 1. A assinatura está correta?

Verifique nome, tipos e ordem.

### 2. A chamada usa o nome certo?

Java diferencia letras maiúsculas e minúsculas.

### 3. A quantidade de argumentos bate?

Se o método pede 3, envie 3.

### 4. Os tipos batem?

`String` recebe texto.

`int` recebe inteiro.

`long` recebe long.

### 5. A ordem faz sentido?

Principalmente quando há vários `String`.

### 6. Os nomes dos parâmetros são claros?

Se não, renomeie.

### 7. O parâmetro existe no escopo onde está sendo usado?

Parâmetro só existe dentro do método.

### 8. O método altera array?

Verifique se isso é esperado.

### 9. O método valida entradas inválidas?

Não confie em dados externos.

### 10. Use debug

Veja os argumentos entrando e os parâmetros recebendo valor.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Esquecer tipo do parâmetro

```java
public class Main {
    public static void main(String[] args) {
        exibirNome("Ana");
    }

    public static void exibirNome(nome) {
        System.out.println(nome);
    }
}
```

Depois corrija:

```java
public static void exibirNome(String nome)
```

---

### Teste 2 — Chamar sem argumento

```java
public class Main {
    public static void main(String[] args) {
        exibirNome();
    }

    public static void exibirNome(String nome) {
        System.out.println(nome);
    }
}
```

Depois corrija:

```java
exibirNome("Ana");
```

---

### Teste 3 — Ordem errada com String

```java
public class Main {
    public static void main(String[] args) {
        exibirCliente("12345678900", "Ana");
    }

    public static void exibirCliente(String nome, String documento) {
        System.out.println("Nome: " + nome);
        System.out.println("Documento: " + documento);
    }
}
```

O código compila, mas a saída está semanticamente errada.

Corrija a ordem.

---

### Teste 4 — Alterar primitivo esperando mudar fora

```java
public class Main {
    public static void main(String[] args) {
        int estoque = 10;

        alterarEstoque(estoque);

        System.out.println("Estoque no main: " + estoque);
    }

    public static void alterarEstoque(int estoque) {
        estoque = 99;
    }
}
```

Observe que o valor no `main` continua 10.

---

### Teste 5 — Alterar array sem perceber

```java
public class Main {
    public static void main(String[] args) {
        int[] estoques = {10, 20};

        alterarPrimeiro(estoques);

        System.out.println(estoques[0]);
    }

    public static void alterarPrimeiro(int[] valores) {
        valores[0] = 99;
    }
}
```

Observe que o array mudou.

Explique por que isso é efeito colateral.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-055-metodos-com-parametros
cd labs\m1\aula-055-metodos-com-parametros
```

Crie arquivos:

```text
Main.java
ParametroInt.java
ParametroLong.java
ParametroDouble.java
ParametroBoolean.java
ParametroString.java
VariosParametros.java
ClienteComParametros.java
ProdutoComParametros.java
PedidoComParametros.java
PagamentoComParametros.java
OrdemServicoComParametros.java
AuditoriaComParametros.java
MensageriaComParametros.java
ValidarStatusComParametro.java
ArrayComoParametro.java
ArrayParametroComRetorno.java
MatrizComoParametro.java
MatrizParametroComRetorno.java
PrimitivoComoParametro.java
ArrayAlteradoPorMetodo.java
NormalizarArrayStatusParametro.java
LegibilidadeRuimParametros.java
LegibilidadeBoaParametros.java
PedidoParametrosValidados.java
NomeIgualParametro.java
NomeDiferenteParametro.java
ErroSemTipoParametro.java
ErroChamadaSemArgumento.java
ErroOrdemString.java
ErroAlterarPrimitivo.java
ErroAlterarArraySemPerceber.java
```

Compile:

```powershell
javac Main.java
javac ParametroInt.java
javac ParametroLong.java
javac ParametroDouble.java
javac ParametroBoolean.java
javac ParametroString.java
javac VariosParametros.java
javac ClienteComParametros.java
javac ProdutoComParametros.java
javac PedidoComParametros.java
javac PagamentoComParametros.java
javac OrdemServicoComParametros.java
javac AuditoriaComParametros.java
javac MensageriaComParametros.java
javac ValidarStatusComParametro.java
javac ArrayComoParametro.java
javac ArrayParametroComRetorno.java
javac MatrizComoParametro.java
javac MatrizParametroComRetorno.java
javac PrimitivoComoParametro.java
javac ArrayAlteradoPorMetodo.java
javac NormalizarArrayStatusParametro.java
javac LegibilidadeRuimParametros.java
javac LegibilidadeBoaParametros.java
javac PedidoParametrosValidados.java
javac NomeIgualParametro.java
javac NomeDiferenteParametro.java
javac ErroSemTipoParametro.java
javac ErroChamadaSemArgumento.java
javac ErroOrdemString.java
javac ErroAlterarPrimitivo.java
javac ErroAlterarArraySemPerceber.java
```

Execute:

```powershell
java Main
java ParametroInt
java ParametroLong
java ParametroDouble
java ParametroBoolean
java ParametroString
java VariosParametros
java ClienteComParametros
java ProdutoComParametros
java PedidoComParametros
java PagamentoComParametros
java OrdemServicoComParametros
java AuditoriaComParametros
java MensageriaComParametros
java ValidarStatusComParametro
java ArrayComoParametro
java ArrayParametroComRetorno
java MatrizComoParametro
java MatrizParametroComRetorno
java PrimitivoComoParametro
java ArrayAlteradoPorMetodo
java NormalizarArrayStatusParametro
java LegibilidadeRuimParametros
java LegibilidadeBoaParametros
java PedidoParametrosValidados
java NomeIgualParametro
java NomeDiferenteParametro
java ErroSemTipoParametro
java ErroChamadaSemArgumento
java ErroOrdemString
java ErroAlterarPrimitivo
java ErroAlterarArraySemPerceber
```

Alguns arquivos de erro proposital não devem compilar ou devem demonstrar problema conceitual.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroSemTipoParametro.java`

```java
public class ErroSemTipoParametro {
    public static void main(String[] args) {
        exibirNome("Ana");
    }

    public static void exibirNome(nome) {
        System.out.println(nome);
    }
}
```

Objetivo:

```text
entender que parâmetro precisa de tipo e nome.
```

---

## Arquivo sugerido: `ErroChamadaSemArgumento.java`

```java
public class ErroChamadaSemArgumento {
    public static void main(String[] args) {
        exibirNome();
    }

    public static void exibirNome(String nome) {
        System.out.println(nome);
    }
}
```

Objetivo:

```text
entender que chamada precisa enviar argumentos obrigatórios.
```

---

## Arquivo sugerido: `ErroAlterarPrimitivo.java`

```java
public class ErroAlterarPrimitivo {
    public static void main(String[] args) {
        int estoque = 10;

        alterarEstoque(estoque);

        System.out.println("Estoque no main: " + estoque);
    }

    public static void alterarEstoque(int estoque) {
        estoque = 99;

        System.out.println("Estoque no método: " + estoque);
    }
}
```

Objetivo:

```text
entender que primitivo passado como parâmetro não altera a variável original.
```

---

## Arquivo sugerido: `ErroAlterarArraySemPerceber.java`

```java
public class ErroAlterarArraySemPerceber {
    public static void main(String[] args) {
        int[] estoques = {10, 20};

        alterarPrimeiro(estoques);

        System.out.println("Primeiro estoque: " + estoques[0]);
    }

    public static void alterarPrimeiro(int[] valores) {
        valores[0] = 99;
    }
}
```

Objetivo:

```text
entender que array recebido como parâmetro pode ter seu conteúdo alterado.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar assinaturas e chamadas |
| Renomear parâmetro | `Shift + F6` | Melhorar nomes de parâmetros |
| Renomear método | `Shift + F6` | Melhorar nomes de métodos |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Criar método com parâmetros |
| Mostrar parâmetros | `Ctrl + P` em muitos keymaps | Ver assinatura durante a chamada |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver argumentos e parâmetros |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Passar pela chamada |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class Main {
    public static void main(String[] args) {
        exibirPedido("Ana", 1000L, "PENDENTE");
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
    }
}
```

Coloque breakpoint na chamada:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
```

Use Step Into.

Observe dentro do método:

```text
cliente = "Ana";
valorCentavos = 1000;
status = "PENDENTE".
```

Esse debug fixa:

```text
argumentos entram;
parâmetros recebem;
método executa usando os parâmetros.
```

Depois debugue:

```java
alterarEstoque(estoque);
```

e:

```java
alterarPrimeiro(estoques);
```

Compare primitivo e array.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 055 — Métodos com parâmetros

### O que aprendi
Aprendi que parâmetros são entradas declaradas na assinatura do método e que argumentos são os valores enviados na chamada. Também aprendi que ordem, nomes e tipos dos parâmetros impactam diretamente a legibilidade e a segurança do código.

### O que pratiquei
Criei métodos com parâmetros `int`, `long`, `double`, `boolean`, `String`, arrays e matrizes. Também pratiquei métodos com vários parâmetros, validação de parâmetros, parâmetros com retorno, efeitos em primitivos e arrays, e exemplos aplicados a cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

### Conceitos principais
- parâmetro
- argumento
- assinatura
- tipo do parâmetro
- nome do parâmetro
- ordem dos parâmetros
- entrada de dados para método
- chamada de método
- escopo do parâmetro
- parâmetro primitivo
- parâmetro String
- parâmetro array
- parâmetro matriz
- efeito colateral
- legibilidade
- validação de parâmetro
- muitos parâmetros
- parâmetros relacionados
- preparação para objetos

### Arquivos criados
- `labs/m1/aula-055-metodos-com-parametros/Main.java`
- `labs/m1/aula-055-metodos-com-parametros/ParametroInt.java`
- `labs/m1/aula-055-metodos-com-parametros/ParametroLong.java`
- `labs/m1/aula-055-metodos-com-parametros/ParametroDouble.java`
- `labs/m1/aula-055-metodos-com-parametros/ParametroBoolean.java`
- `labs/m1/aula-055-metodos-com-parametros/ParametroString.java`
- `labs/m1/aula-055-metodos-com-parametros/VariosParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/ClienteComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/ProdutoComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/PedidoComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/PagamentoComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/OrdemServicoComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/AuditoriaComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/MensageriaComParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/ValidarStatusComParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/ArrayComoParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/ArrayParametroComRetorno.java`
- `labs/m1/aula-055-metodos-com-parametros/MatrizComoParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/MatrizParametroComRetorno.java`
- `labs/m1/aula-055-metodos-com-parametros/PrimitivoComoParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/ArrayAlteradoPorMetodo.java`
- `labs/m1/aula-055-metodos-com-parametros/NormalizarArrayStatusParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/LegibilidadeRuimParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/LegibilidadeBoaParametros.java`
- `labs/m1/aula-055-metodos-com-parametros/PedidoParametrosValidados.java`
- `labs/m1/aula-055-metodos-com-parametros/NomeIgualParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/NomeDiferenteParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/ErroSemTipoParametro.java`
- `labs/m1/aula-055-metodos-com-parametros/ErroChamadaSemArgumento.java`
- `labs/m1/aula-055-metodos-com-parametros/ErroOrdemString.java`
- `labs/m1/aula-055-metodos-com-parametros/ErroAlterarPrimitivo.java`
- `labs/m1/aula-055-metodos-com-parametros/ErroAlterarArraySemPerceber.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac PedidoComParametros.java
java PedidoComParametros
javac ValidarStatusComParametro.java
java ValidarStatusComParametro
javac ArrayParametroComRetorno.java
java ArrayParametroComRetorno
javac PrimitivoComoParametro.java
java PrimitivoComoParametro
javac ArrayAlteradoPorMetodo.java
java ArrayAlteradoPorMetodo
```

### Erros que quero evitar
- confundir parâmetro com argumento;
- passar argumentos na ordem errada;
- usar nomes genéricos;
- esquecer tipo do parâmetro;
- chamar método sem enviar argumento obrigatório;
- enviar tipo incompatível;
- achar que alterar primitivo dentro do método altera fora;
- alterar array sem perceber;
- criar método com parâmetros demais;
- não validar parâmetro vindo de fora.

### Próximo passo
Estudar sobrecarga de métodos inicial.
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
git add labs/m1/aula-055-metodos-com-parametros docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 055: pratica metodos com parametros em Java"
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
1. O que é parâmetro?
2. O que é argumento?
3. Qual a diferença entre parâmetro e argumento?
4. Por que a ordem dos parâmetros importa?
5. Por que parâmetros do mesmo tipo exigem mais cuidado?
6. O que é escopo do parâmetro?
7. O que acontece quando passamos um int para um método e alteramos o valor lá dentro?
8. O que acontece quando passamos um array e alteramos uma posição dentro do método?
9. Por que nomes de parâmetros influenciam a legibilidade?
10. Por que muitos parâmetros podem indicar futuro objeto?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar parâmetro;
explicar argumento;
diferenciar parâmetro de argumento;
criar método com um parâmetro;
criar método com vários parâmetros;
usar parâmetro int;
usar parâmetro long;
usar parâmetro double;
usar parâmetro boolean;
usar parâmetro String;
usar parâmetro array;
usar parâmetro matriz;
chamar método com literais;
chamar método com variáveis;
respeitar ordem dos argumentos;
explicar risco de parâmetros do mesmo tipo;
nomear parâmetros com clareza;
explicar escopo do parâmetro;
validar parâmetros String;
validar parâmetros numéricos;
usar método com parâmetro e retorno;
aplicar parâmetros em cliente;
aplicar parâmetros em produto;
aplicar parâmetros em pedido;
aplicar parâmetros em pagamento;
aplicar parâmetros em OS;
aplicar parâmetros em auditoria;
aplicar parâmetros em mensageria;
explicar diferença entre primitivo e array como parâmetro;
entender efeito colateral em arrays;
identificar método com parâmetros demais;
relacionar parâmetros demais com futuro objeto;
diagnosticar erros comuns;
debugar argumentos e parâmetros;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar sobrecarga.

Não precisa ainda dominar objetos.

Não precisa ainda dominar varargs.

Não precisa ainda dominar genéricos.

Não precisa ainda dominar injeção de dependência.

Esses assuntos virão depois.

O objetivo é dominar entrada de dados para métodos, com ordem, nomes e legibilidade.

---

## Fechamento da aula

Hoje aprofundamos métodos com parâmetros.

A ideia central foi:

```text
parâmetros são entradas que o método recebe para executar sua responsabilidade.
```

A assinatura define os parâmetros:

```java
public static void exibirPedido(String cliente, long valorCentavos, String status)
```

A chamada envia os argumentos:

```java
exibirPedido("Ana", 1000L, "PENDENTE");
```

Vimos que parâmetros exigem cuidado com:

```text
tipo;
ordem;
nome;
legibilidade;
escopo;
validação;
efeito colateral;
muitos parâmetros.
```

Também vimos que tipos primitivos não alteram a variável original quando modificados dentro do método, mas arrays podem ter seu conteúdo alterado.

O ponto mais importante é:

```text
um método bem parametrizado recebe exatamente o que precisa, com nomes claros e responsabilidade clara.
```

Na próxima aula, vamos estudar sobrecarga de métodos inicial.

Aí veremos como Java permite métodos com o mesmo nome quando os parâmetros são diferentes, e quando isso ajuda ou atrapalha a legibilidade.
