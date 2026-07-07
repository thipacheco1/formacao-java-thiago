# 054 — M1.34 — Métodos com Retorno

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.34.01` — Métodos com retorno — Conceito, por que existe e vocabulário essencial.
- `M1.34.02` — Métodos com retorno — Exemplo mínimo digitado do zero.
- `M1.34.03` — Métodos com retorno — Exemplo aplicado ao domínio corporativo.
- `M1.34.04` — Métodos com retorno — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `return`, tipo de retorno, uso do resultado, clareza, diferença entre método `void` e método com retorno, retorno de `int`, `long`, `double`, `boolean` e `String`, retorno calculado a partir de arrays, tratamento de caminhos de retorno, erros comuns, diagnóstico e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 1, logo depois da primeira aula sobre métodos.

A sequência recente foi:

```text
050 — M1.30 — Arrays de String;
051 — M1.31 — Arrays paralelos;
052 — M1.32 — Matriz bidimensional inicial;
053 — M1.33 — Métodos sem retorno;
054 — M1.34 — Métodos com retorno.
```

Na aula anterior, aprendemos métodos sem retorno.

Exemplo:

```java
public static void exibirMensagem() {
    System.out.println("Operação concluída");
}
```

Esse método executa uma ação, mas não devolve valor.

A chamada é assim:

```java
exibirMensagem();
```

Agora vamos estudar métodos que devolvem resultado.

Exemplo:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Esse método calcula e devolve um `int`.

A chamada pode guardar o resultado:

```java
int resultado = somar(10, 20);
```

Essa é a virada da aula.

Método com retorno não serve apenas para “fazer algo”.

Ele serve para produzir um valor que será usado por outra parte do programa.

---

## Hoje a aula é sobre devolver resultado

Um método com retorno responde alguma coisa.

Exemplos:

```text
qual é a soma?
qual é a média?
o status é válido?
qual é o índice encontrado?
qual é o total aprovado?
qual é o maior valor?
qual é a mensagem de status?
o pagamento é válido?
a OS pode ser processada?
```

Em Java, isso aparece no tipo do método.

Exemplos:

```java
public static int somar(int a, int b)
public static long calcularTotal(long[] valores)
public static double calcularMedia(int[] valores)
public static boolean statusValido(String status)
public static String obterMensagemStatus(String status)
```

O tipo antes do nome indica o que o método promete devolver.

Se o método promete `int`, precisa retornar `int`.

Se promete `boolean`, precisa retornar `boolean`.

Se promete `String`, precisa retornar `String`.

O comando que devolve o valor é:

```java
return
```

---

## O que é método com retorno

Método com retorno é um método que executa uma lógica e devolve um valor para quem chamou.

Exemplo:

```java
public static int obterQuantidadePadrao() {
    return 10;
}
```

Chamada:

```java
int quantidade = obterQuantidadePadrao();
```

Agora a variável `quantidade` recebe o valor retornado.

Isso é diferente de:

```java
public static void exibirQuantidadePadrao() {
    System.out.println(10);
}
```

Esse segundo método apenas imprime.

Ele não devolve o número para ser usado depois.

---

## Por que métodos com retorno existem

Métodos com retorno existem para separar cálculo de uso do resultado.

Exemplo ruim:

```java
public static void exibirSoma(int a, int b) {
    System.out.println(a + b);
}
```

Esse método imprime a soma, mas não permite reutilizar o valor.

Se eu quiser:

```text
somar;
guardar;
comparar;
enviar para outro cálculo;
validar limite;
montar relatório;
```

não consigo facilmente.

Melhor:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Agora posso fazer:

```java
int total = somar(10, 20);

if (total > 25) {
    System.out.println("Total acima do limite");
}
```

O método calculou.

O `main` decidiu o que fazer com o resultado.

Essa separação é muito importante para backend.

---

## Vocabulário essencial

Termos desta aula:

```text
método com retorno;
return;
tipo de retorno;
resultado;
valor retornado;
uso do resultado;
assinatura;
parâmetro;
argumento;
int;
long;
double;
boolean;
String;
caminho de retorno;
return condicional;
return antecipado;
método puro;
cálculo;
validação;
busca;
índice retornado;
clareza;
responsabilidade.
```

Termos mais importantes:

```text
tipo de retorno -> tipo que o método promete devolver;
return -> comando que devolve o valor e encerra o método;
valor retornado -> valor entregue para quem chamou;
uso do resultado -> guardar, comparar, imprimir ou passar adiante;
caminho de retorno -> cada caminho possível do método precisa devolver algo quando o método não é void;
método puro -> método que calcula e devolve sem alterar estado externo nem imprimir.
```

---

## Anatomia de um método com retorno

Exemplo:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Partes:

```text
public -> modificador de acesso;
static -> usado nesta fase para chamar a partir do main;
int -> tipo de retorno;
somar -> nome do método;
(int a, int b) -> parâmetros;
return a + b; -> valor devolvido.
```

Assinatura simplificada:

```java
public static int somar(int a, int b)
```

Corpo:

```java
{
    return a + b;
}
```

Chamada:

```java
int resultado = somar(10, 20);
```

---

## O que o return faz

O `return` faz duas coisas:

```text
devolve um valor;
encerra a execução do método.
```

Exemplo:

```java
public static int obterNumero() {
    return 10;
}
```

Quando o Java encontra:

```java
return 10;
```

ele devolve 10 para quem chamou e sai do método.

Código depois de um `return` direto não executa.

Exemplo errado:

```java
public static int obterNumero() {
    return 10;
    System.out.println("Depois do return");
}
```

Esse `System.out.println` está inacessível.

---

## Tipo de retorno

O tipo de retorno precisa combinar com o valor devolvido.

Exemplo correto:

```java
public static int obterQuantidade() {
    return 5;
}
```

Correto:

```java
public static String obterStatus() {
    return "APROVADO";
}
```

Correto:

```java
public static boolean pagamentoValido(long valorCentavos) {
    return valorCentavos > 0;
}
```

Errado:

```java
public static int obterQuantidade() {
    return "cinco";
}
```

O método promete `int`, mas tenta devolver `String`.

Não compila.

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
        int resultado = somar(10, 20);

        System.out.println("Resultado: " + resultado);
    }

    public static int somar(int a, int b) {
        return a + b;
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
Resultado: 30
```

Esse é o primeiro padrão:

```text
chamar método;
receber retorno;
usar retorno.
```

---

## Chamando e usando diretamente

Você pode guardar o retorno:

```java
int resultado = somar(10, 20);
System.out.println(resultado);
```

Ou usar diretamente:

```java
System.out.println(somar(10, 20));
```

Os dois funcionam.

Mas, para aprender e debugar, muitas vezes é melhor guardar em variável:

```java
int resultado = somar(10, 20);
```

Assim você consegue ver o valor com clareza.

---

## Diferença entre imprimir e retornar

Este método imprime:

```java
public static void exibirSoma(int a, int b) {
    System.out.println(a + b);
}
```

Este método retorna:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Uso do primeiro:

```java
exibirSoma(10, 20);
```

Uso do segundo:

```java
int resultado = somar(10, 20);
System.out.println(resultado);
```

A diferença é enorme:

```text
imprimir joga informação na tela;
retornar entrega valor para o programa continuar usando.
```

Backend quase sempre precisa retornar valores entre camadas.

Por isso, método com retorno é fundamental.

---

## Exemplo comparativo completo

Arquivo:

```text
ImprimirVsRetornar.java
```

Código:

```java
public class ImprimirVsRetornar {
    public static void main(String[] args) {
        exibirSoma(10, 20);

        int resultado = somar(10, 20);

        if (resultado > 25) {
            System.out.println("Resultado acima de 25");
        }
    }

    public static void exibirSoma(int a, int b) {
        System.out.println("Soma exibida: " + (a + b));
    }

    public static int somar(int a, int b) {
        return a + b;
    }
}
```

Saída:

```text
Soma exibida: 30
Resultado acima de 25
```

O método `somar` permitiu usar o resultado em uma regra.

---

## Retorno int

Use `int` para quantidades, contadores e números inteiros simples.

Arquivo:

```text
RetornoInt.java
```

Código:

```java
public class RetornoInt {
    public static void main(String[] args) {
        int total = somarQuantidades(10, 5);

        System.out.println("Total: " + total);
    }

    public static int somarQuantidades(int quantidadeA, int quantidadeB) {
        return quantidadeA + quantidadeB;
    }
}
```

Exemplos de uso:

```text
quantidade de pedidos;
quantidade de tentativas;
quantidade de produtos;
quantidade de atividades;
contador de registros válidos.
```

---

## Retorno long

Use `long` para valores inteiros maiores e, nesta fase, dinheiro em centavos.

Arquivo:

```text
RetornoLong.java
```

Código:

```java
public class RetornoLong {
    public static void main(String[] args) {
        long totalCentavos = somarValores(1000L, 2500L);

        System.out.println("Total em centavos: " + totalCentavos);
    }

    public static long somarValores(long valorA, long valorB) {
        return valorA + valorB;
    }
}
```

Para dinheiro, continuamos evitando `double`.

Usamos:

```text
centavos em long.
```

---

## Retorno double

Use `double` para médias, notas, tempos e percentuais didáticos.

Arquivo:

```text
RetornoDouble.java
```

Código:

```java
public class RetornoDouble {
    public static void main(String[] args) {
        double media = calcularMedia(8, 7, 10);

        System.out.println("Média: " + media);
    }

    public static double calcularMedia(int nota1, int nota2, int nota3) {
        int soma = nota1 + nota2 + nota3;

        return (double) soma / 3;
    }
}
```

Atenção:

```java
(double) soma
```

garante divisão decimal.

---

## Retorno boolean

Use `boolean` quando o método responde uma pergunta de sim ou não.

Exemplos:

```java
statusValido(...)
pagamentoValido(...)
clientePreenchido(...)
estoqueDisponivel(...)
indiceValido(...)
temPendencia(...)
```

Arquivo:

```text
RetornoBoolean.java
```

Código:

```java
public class RetornoBoolean {
    public static void main(String[] args) {
        boolean valido = pagamentoValido(2500L);

        if (valido) {
            System.out.println("Pagamento válido");
        } else {
            System.out.println("Pagamento inválido");
        }
    }

    public static boolean pagamentoValido(long valorCentavos) {
        return valorCentavos > 0;
    }
}
```

Esse padrão será muito usado.

Método boolean deve ter nome que parece pergunta.

---

## Nome bom para método boolean

Bons nomes:

```java
isStatusValido()
temEstoque()
possuiPendencia()
deveEnviarMensagem()
podeAprovar()
estaDentroDoSla()
indiceValido()
```

Em português, também funciona:

```java
statusValido()
pagamentoValido()
clientePreenchido()
estoqueDisponivel()
```

O importante é que o nome deixe claro que retorna verdadeiro ou falso.

Evite:

```java
validarStatus()
```

se ele retorna boolean?

Pode funcionar, mas `statusValido` comunica melhor o resultado.

Mais tarde, veremos padrões de nomenclatura mais profissionais.

---

## Retorno String

Use `String` quando o método devolve texto.

Arquivo:

```text
RetornoString.java
```

Código:

```java
public class RetornoString {
    public static void main(String[] args) {
        String mensagem = obterMensagemStatus("APROVADO");

        System.out.println(mensagem);
    }

    public static String obterMensagemStatus(String status) {
        if ("APROVADO".equals(status)) {
            return "Pedido aprovado com sucesso.";
        }

        if ("RECUSADO".equals(status)) {
            return "Pedido recusado.";
        }

        return "Status não reconhecido.";
    }
}
```

Esse exemplo mostra múltiplos `return`.

Quando uma condição é atendida, o método retorna e encerra.

---

## Múltiplos returns

Métodos podem ter mais de um `return`.

Exemplo:

```java
public static String obterMensagemStatus(String status) {
    if ("APROVADO".equals(status)) {
        return "Aprovado";
    }

    if ("RECUSADO".equals(status)) {
        return "Recusado";
    }

    return "Desconhecido";
}
```

Isso é válido.

Mas todo caminho precisa retornar algo.

Se nenhum `if` for verdadeiro, o último `return` garante uma resposta.

---

## Todo caminho precisa retornar

Este código não compila:

```java
public static String obterMensagemStatus(String status) {
    if ("APROVADO".equals(status)) {
        return "Aprovado";
    }
}
```

Se o status não for `"APROVADO"`, o método não teria o que retornar.

Erro conceitual:

```text
método promete String, mas existe caminho sem retorno.
```

Correção:

```java
public static String obterMensagemStatus(String status) {
    if ("APROVADO".equals(status)) {
        return "Aprovado";
    }

    return "Status desconhecido";
}
```

Regra:

```text
se não é void, todo caminho precisa retornar valor compatível.
```

---

## Return em if else

Também podemos usar `if else`.

Arquivo:

```text
ReturnIfElse.java
```

Código:

```java
public class ReturnIfElse {
    public static void main(String[] args) {
        String resultado = classificarPagamento(2500L);

        System.out.println(resultado);
    }

    public static String classificarPagamento(long valorCentavos) {
        if (valorCentavos <= 0) {
            return "INVÁLIDO";
        } else if (valorCentavos < 5000L) {
            return "BAIXO";
        } else {
            return "ALTO";
        }
    }
}
```

Aqui todos os caminhos retornam `String`.

---

## Return antecipado

`return` pode ser usado para sair cedo quando entrada é inválida.

Exemplo:

```java
public static double calcularMedia(int[] valores) {
    if (valores.length == 0) {
        return 0.0;
    }

    int soma = 0;

    for (int indice = 0; indice < valores.length; indice++) {
        soma += valores[indice];
    }

    return (double) soma / valores.length;
}
```

Se o array estiver vazio, retorna `0.0` cedo.

Depois, se não estiver vazio, calcula normalmente.

Esse padrão é chamado de retorno antecipado.

Use com clareza.

---

## Método puro

Um método puro, de forma simplificada, é um método que:

```text
recebe entrada;
calcula;
retorna resultado;
não imprime;
não altera dados externos.
```

Exemplo:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Esse método é fácil de testar.

Se chamar:

```java
somar(10, 20)
```

sempre retorna:

```text
30.
```

Métodos de cálculo geralmente devem ser assim.

Na prática profissional, separar cálculo de exibição melhora muito a manutenção.

---

## Método que calcula não deve imprimir

Compare.

Menos flexível:

```java
public static void calcularEExibirTotal(int[] valores) {
    int total = 0;

    for (int indice = 0; indice < valores.length; indice++) {
        total += valores[indice];
    }

    System.out.println(total);
}
```

Mais flexível:

```java
public static int calcularTotal(int[] valores) {
    int total = 0;

    for (int indice = 0; indice < valores.length; indice++) {
        total += valores[indice];
    }

    return total;
}
```

Agora quem chama decide:

```java
int total = calcularTotal(valores);
System.out.println("Total: " + total);
```

Esse padrão é muito mais profissional.

---

## Exemplo com array: calcular total

Arquivo:

```text
CalcularTotalArray.java
```

Código:

```java
public class CalcularTotalArray {
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

Esse método retorna `int`.

Ele não imprime.

O `main` imprime.

Responsabilidades separadas.

---

## Exemplo com array: calcular média

Arquivo:

```text
CalcularMediaArray.java
```

Código:

```java
public class CalcularMediaArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        double media = calcularMedia(valores);

        System.out.println("Média: " + media);
    }

    public static double calcularMedia(int[] valores) {
        if (valores.length == 0) {
            return 0.0;
        }

        int total = calcularTotal(valores);

        return (double) total / valores.length;
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

Aqui um método com retorno chama outro método com retorno:

```java
int total = calcularTotal(valores);
```

Isso é comum.

---

## Exemplo com array: maior valor

Arquivo:

```text
CalcularMaiorValor.java
```

Código:

```java
public class CalcularMaiorValor {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int maior = calcularMaior(valores);

        System.out.println("Maior: " + maior);
    }

    public static int calcularMaior(int[] valores) {
        if (valores.length == 0) {
            return 0;
        }

        int maior = valores[0];

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] > maior) {
                maior = valores[indice];
            }
        }

        return maior;
    }
}
```

Nesta fase, para array vazio, retornamos 0 por simplicidade.

Mais à frente, estudaremos formas melhores de tratar ausência de resultado.

---

## Exemplo com array: buscar índice

Arquivo:

```text
BuscarIndiceArray.java
```

Código:

```java
public class BuscarIndiceArray {
    public static void main(String[] args) {
        int[] codigos = {100, 200, 300};

        int indice = buscarIndice(codigos, 200);

        if (indice != -1) {
            System.out.println("Código encontrado na posição " + (indice + 1));
        } else {
            System.out.println("Código não encontrado");
        }
    }

    public static int buscarIndice(int[] valores, int valorProcurado) {
        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] == valorProcurado) {
                return indice;
            }
        }

        return -1;
    }
}
```

Esse exemplo é muito importante.

Quando encontra, retorna imediatamente:

```java
return indice;
```

Se termina o loop sem encontrar:

```java
return -1;
```

---

## Por que retornar -1 em busca

Índices válidos começam em 0.

Então `-1` representa:

```text
não encontrado.
```

Exemplo:

```java
int indice = buscarIndice(codigos, 999);

if (indice == -1) {
    System.out.println("Não encontrado");
}
```

Esse padrão já apareceu em busca em array.

Agora ele vira método com retorno.

---

## Exemplo com String: validar status

Arquivo:

```text
ValidarStatusMetodo.java
```

Código:

```java
public class ValidarStatusMetodo {
    public static void main(String[] args) {
        String status = "APROVADO";

        if (statusValido(status)) {
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

Esse método retorna `boolean`.

Ele responde:

```text
este status é válido?
```

O `main` decide o que fazer com a resposta.

---

## Exemplo com String: normalizar e retornar

Arquivo:

```text
NormalizarStatusRetorno.java
```

Código:

```java
public class NormalizarStatusRetorno {
    public static void main(String[] args) {
        String status = " aprovado ";

        String normalizado = normalizarStatus(status);

        System.out.println(normalizado);
    }

    public static String normalizarStatus(String status) {
        if (status == null) {
            return "";
        }

        return status.trim().toUpperCase();
    }
}
```

Esse método não altera um array.

Ele recebe uma `String` e retorna outra `String`.

Responsabilidade:

```text
normalizar um status.
```

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoMetodosRetorno.java
```

Código:

```java
public class PedidoMetodosRetorno {
    public static void main(String[] args) {
        long[] valoresPedidosCentavos = {1000L, 2500L, 5000L};

        long total = calcularTotalPedidos(valoresPedidosCentavos);
        double media = calcularMediaPedidos(valoresPedidosCentavos);

        System.out.println("Total em centavos: " + total);
        System.out.println("Média em centavos: " + media);
    }

    public static long calcularTotalPedidos(long[] valoresCentavos) {
        long total = 0L;

        for (int indice = 0; indice < valoresCentavos.length; indice++) {
            total += valoresCentavos[indice];
        }

        return total;
    }

    public static double calcularMediaPedidos(long[] valoresCentavos) {
        if (valoresCentavos.length == 0) {
            return 0.0;
        }

        long total = calcularTotalPedidos(valoresCentavos);

        return (double) total / valoresCentavos.length;
    }
}
```

Esse exemplo aplica retorno em pedidos.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoMetodosRetorno.java
```

Código:

```java
public class PagamentoMetodosRetorno {
    public static void main(String[] args) {
        long valorCentavos = 10000L;
        int parcelas = 4;

        if (pagamentoValido(valorCentavos, parcelas)) {
            long valorParcela = calcularValorParcela(valorCentavos, parcelas);
            System.out.println("Valor da parcela: " + valorParcela);
        } else {
            System.out.println("Pagamento inválido");
        }
    }

    public static boolean pagamentoValido(long valorCentavos, int parcelas) {
        return valorCentavos > 0 && parcelas > 0;
    }

    public static long calcularValorParcela(long valorCentavos, int parcelas) {
        return valorCentavos / parcelas;
    }
}
```

Aqui temos:

```text
um método boolean para validar;
um método long para calcular.
```

Isso é mais organizado do que colocar tudo no `main`.

---

## Exemplo aplicado: produto e estoque

Arquivo:

```text
ProdutoEstoqueMetodoRetorno.java
```

Código:

```java
public class ProdutoEstoqueMetodoRetorno {
    public static void main(String[] args) {
        int estoqueAtual = 10;
        int quantidadeSolicitada = 3;

        if (temEstoqueDisponivel(estoqueAtual, quantidadeSolicitada)) {
            int estoqueFinal = calcularEstoqueAposBaixa(estoqueAtual, quantidadeSolicitada);
            System.out.println("Estoque final: " + estoqueFinal);
        } else {
            System.out.println("Estoque insuficiente");
        }
    }

    public static boolean temEstoqueDisponivel(int estoqueAtual, int quantidadeSolicitada) {
        return quantidadeSolicitada > 0 && quantidadeSolicitada <= estoqueAtual;
    }

    public static int calcularEstoqueAposBaixa(int estoqueAtual, int quantidadeSolicitada) {
        return estoqueAtual - quantidadeSolicitada;
    }
}
```

Esse exemplo mostra regra de produto.

Um método responde se pode baixar.

Outro calcula o estoque final.

---

## Exemplo aplicado: OS

Arquivo:

```text
OrdemServicoMetodoRetorno.java
```

Código:

```java
public class OrdemServicoMetodoRetorno {
    public static void main(String[] args) {
        String statusOs = "ABERTA";
        int atividadesPendentes = 0;

        if (podeConcluirOs(statusOs, atividadesPendentes)) {
            System.out.println("OS pode ser concluída");
        } else {
            System.out.println("OS não pode ser concluída");
        }
    }

    public static boolean podeConcluirOs(String statusOs, int atividadesPendentes) {
        if (statusOs == null || statusOs.isBlank()) {
            return false;
        }

        String statusNormalizado = statusOs.trim().toUpperCase();

        return "ABERTA".equals(statusNormalizado) && atividadesPendentes == 0;
    }
}
```

Esse método retorna uma decisão.

Ele encapsula a regra:

```text
OS aberta e sem atividades pendentes pode ser concluída.
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaMetodoRetorno.java
```

Código:

```java
public class MensageriaMetodoRetorno {
    public static void main(String[] args) {
        int tentativas = 2;
        boolean telefoneValido = true;

        if (deveEnviarMensagem(tentativas, telefoneValido)) {
            System.out.println("Mensagem pode ser enviada");
        } else {
            System.out.println("Mensagem não deve ser enviada");
        }
    }

    public static boolean deveEnviarMensagem(int tentativas, boolean telefoneValido) {
        int limiteTentativas = 3;

        return telefoneValido && tentativas < limiteTentativas;
    }
}
```

Esse é um exemplo de decisão booleana.

O método responde:

```text
deve enviar mensagem?
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaMetodoRetorno.java
```

Código:

```java
public class AuditoriaMetodoRetorno {
    public static void main(String[] args) {
        String operacao = "EDICAO";

        String descricao = obterDescricaoOperacao(operacao);

        System.out.println(descricao);
    }

    public static String obterDescricaoOperacao(String operacao) {
        if (operacao == null || operacao.isBlank()) {
            return "Operação não informada";
        }

        String normalizada = operacao.trim().toUpperCase();

        if ("CRIACAO".equals(normalizada)) {
            return "Criação de registro";
        }

        if ("EDICAO".equals(normalizada)) {
            return "Edição de registro";
        }

        if ("EXCLUSAO".equals(normalizada)) {
            return "Exclusão de registro";
        }

        return "Operação desconhecida";
    }
}
```

Esse exemplo retorna texto de acordo com uma regra.

---

## Exemplo aplicado: arrays paralelos com retorno

Arquivo:

```text
TotalAprovadoMetodoRetorno.java
```

Código:

```java
public class TotalAprovadoMetodoRetorno {
    public static void main(String[] args) {
        long[] valoresCentavos = {1000L, 2500L, 5000L, 3000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO"};

        long totalAprovado = calcularTotalAprovado(valoresCentavos, statusPedidos);

        System.out.println("Total aprovado: " + totalAprovado);
    }

    public static long calcularTotalAprovado(long[] valoresCentavos, String[] statusPedidos) {
        if (valoresCentavos.length != statusPedidos.length) {
            return 0L;
        }

        long total = 0L;

        for (int indice = 0; indice < valoresCentavos.length; indice++) {
            if ("APROVADO".equals(statusPedidos[indice])) {
                total += valoresCentavos[indice];
            }
        }

        return total;
    }
}
```

Esse método retorna o total aprovado.

Se os arrays estiverem desalinhados, retorna 0 por simplicidade didática.

Mais tarde, com exceções e objetos, trataremos isso melhor.

---

## Exemplo aplicado: buscar cliente

Arquivo:

```text
BuscarClienteMetodoRetorno.java
```

Código:

```java
public class BuscarClienteMetodoRetorno {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};

        int indice = buscarCliente(clientes, "Bruno");

        if (indice != -1) {
            System.out.println("Cliente encontrado na posição " + (indice + 1));
        } else {
            System.out.println("Cliente não encontrado");
        }
    }

    public static int buscarCliente(String[] clientes, String clienteProcurado) {
        if (clienteProcurado == null || clienteProcurado.isBlank()) {
            return -1;
        }

        String procuradoNormalizado = clienteProcurado.trim();

        for (int indice = 0; indice < clientes.length; indice++) {
            if (procuradoNormalizado.equalsIgnoreCase(clientes[indice])) {
                return indice;
            }
        }

        return -1;
    }
}
```

Esse exemplo retorna índice.

O método não imprime.

Quem chama decide como exibir.

---

## Exemplo aplicado: matriz com retorno

Arquivo:

```text
TotalMatrizMetodoRetorno.java
```

Código:

```java
public class TotalMatrizMetodoRetorno {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int total = calcularTotalMatriz(matriz);

        System.out.println("Total da matriz: " + total);
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

Aqui retornamos o total da matriz.

Isso reaproveita a aula anterior.

---

## Usar resultado do retorno

O retorno só faz sentido se for usado.

Exemplo:

```java
somar(10, 20);
```

Esse código chama o método, mas ignora o resultado.

Se o método só calcula e retorna, ignorar o retorno geralmente é inútil.

Melhor:

```java
int resultado = somar(10, 20);
System.out.println(resultado);
```

Ou:

```java
if (somar(10, 20) > 25) {
    System.out.println("Acima do limite");
}
```

Regra:

```text
se o método retorna algo, pense onde esse resultado será usado.
```

---

## Clareza na responsabilidade

Compare.

Ruim:

```java
public static int calcularTotalEExibirRelatorio(int[] valores) {
    int total = 0;

    for (...) {
        total += valores[indice];
    }

    System.out.println(total);

    return total;
}
```

Esse método calcula, imprime e retorna.

Pode até funcionar, mas mistura responsabilidades.

Melhor:

```java
public static int calcularTotal(int[] valores) {
    int total = 0;

    for (...) {
        total += valores[indice];
    }

    return total;
}

public static void exibirTotal(int total) {
    System.out.println("Total: " + total);
}
```

Um método calcula.

Outro exibe.

Essa separação será cada vez mais importante.

---

## Tipo de retorno e nome do método devem combinar

Se o método se chama:

```java
calcularTotal
```

esperamos que ele retorne um número.

Se o método se chama:

```java
statusValido
```

esperamos que ele retorne `boolean`.

Se o método se chama:

```java
obterMensagem
```

esperamos que ele retorne `String`.

Nome, tipo e comportamento precisam contar a mesma história.

Exemplos bons:

```java
public static int calcularTotal(...)
public static boolean statusValido(...)
public static String obterMensagem(...)
public static int buscarIndice(...)
public static double calcularMedia(...)
```

Exemplos ruins:

```java
public static void calcularTotal(...)
```

se só imprime.

```java
public static int exibirTotal(...)
```

se também imprime.

---

## Erros comuns

### Erro 1 — Esquecer return

Errado:

```java
public static int somar(int a, int b) {
    int resultado = a + b;
}
```

O método promete `int`, mas não retorna.

Certo:

```java
return resultado;
```

---

### Erro 2 — Retornar tipo errado

Errado:

```java
public static int obterCodigo() {
    return "123";
}
```

Certo:

```java
return 123;
```

Ou altere o tipo para `String`, se a regra for texto.

---

### Erro 3 — Nem todo caminho retorna

Errado:

```java
public static String obterMensagem(boolean sucesso) {
    if (sucesso) {
        return "OK";
    }
}
```

Certo:

```java
public static String obterMensagem(boolean sucesso) {
    if (sucesso) {
        return "OK";
    }

    return "ERRO";
}
```

---

### Erro 4 — Tentar retornar valor em void

Errado:

```java
public static void somar(int a, int b) {
    return a + b;
}
```

Se retorna soma, o método não deve ser `void`.

Certo:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

---

### Erro 5 — Ignorar retorno importante

Ruim:

```java
calcularTotal(valores);
```

Melhor:

```java
int total = calcularTotal(valores);
```

---

### Erro 6 — Imprimir dentro de método de cálculo

Evite misturar cálculo e exibição.

Método de cálculo deve retornar.

O método que chama decide se imprime.

---

### Erro 7 — Usar retorno boolean com nome confuso

Ruim:

```java
public static boolean processarStatus(String status)
```

Melhor:

```java
public static boolean statusValido(String status)
```

---

### Erro 8 — Retornar `0` para erro sem deixar claro

Às vezes retornamos 0 por simplicidade didática.

Mas em sistema real, isso pode esconder problema.

Exemplo:

```java
if (valores.length != status.length) {
    return 0L;
}
```

Nesta fase tudo bem como simplificação.

Mas registre que, futuramente, usaremos tratamentos melhores.

---

### Erro 9 — Confundir parâmetro com retorno

Parâmetro entra no método.

Retorno sai do método.

Exemplo:

```java
public static int somar(int a, int b)
```

`a` e `b` entram.

`return a + b` sai.

---

### Erro 10 — Código inacessível depois do return

Errado:

```java
return total;
System.out.println("Fim");
```

Depois do `return`, o método já encerrou.

---

## Diagnóstico de métodos com retorno

Quando um método com retorno não funcionar, siga o roteiro.

### 1. Qual tipo o método promete retornar?

Veja a assinatura:

```java
public static int ...
public static boolean ...
public static String ...
```

### 2. Existe return?

Se não for `void`, precisa retornar.

### 3. O valor retornado combina com o tipo?

`int` retorna número inteiro.

`String` retorna texto.

`boolean` retorna `true` ou `false`.

### 4. Todos os caminhos retornam?

Verifique `if`, `else`, loops e casos padrão.

### 5. O resultado está sendo usado?

Guarde em variável ou use em condição.

### 6. O método imprime quando deveria apenas calcular?

Separe responsabilidades.

### 7. O nome combina com o retorno?

Nome deve deixar claro o que retorna.

### 8. O retorno representa erro de forma clara?

Cuidado com `0`, `""` ou `-1`.

### 9. Há código depois de return?

Ele não executa.

### 10. Use debug

Entre no método, veja os parâmetros e acompanhe o valor retornado.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Esquecer return

```java
public class Main {
    public static void main(String[] args) {
        int resultado = somar(10, 20);
        System.out.println(resultado);
    }

    public static int somar(int a, int b) {
        int resultado = a + b;
    }
}
```

Depois corrija:

```java
return resultado;
```

### Teste 2 — Retornar tipo errado

```java
public class Main {
    public static void main(String[] args) {
        int codigo = obterCodigo();
        System.out.println(codigo);
    }

    public static int obterCodigo() {
        return "123";
    }
}
```

Depois corrija retornando `123` ou alterando o tipo para `String`.

### Teste 3 — Caminho sem retorno

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(obterMensagem(false));
    }

    public static String obterMensagem(boolean sucesso) {
        if (sucesso) {
            return "OK";
        }
    }
}
```

Depois adicione:

```java
return "ERRO";
```

### Teste 4 — Void tentando retornar valor

```java
public class Main {
    public static void main(String[] args) {
        somar(10, 20);
    }

    public static void somar(int a, int b) {
        return a + b;
    }
}
```

Depois corrija para:

```java
public static int somar(int a, int b)
```

e use o resultado.

### Teste 5 — Ignorar retorno

```java
public class Main {
    public static void main(String[] args) {
        somar(10, 20);
    }

    public static int somar(int a, int b) {
        return a + b;
    }
}
```

O código compila, mas o resultado é ignorado.

Depois corrija:

```java
int resultado = somar(10, 20);
System.out.println(resultado);
```

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-054-metodos-com-retorno
cd labs\m1\aula-054-metodos-com-retorno
```

Crie arquivos:

```text
Main.java
ImprimirVsRetornar.java
RetornoInt.java
RetornoLong.java
RetornoDouble.java
RetornoBoolean.java
RetornoString.java
ReturnIfElse.java
CalcularTotalArray.java
CalcularMediaArray.java
CalcularMaiorValor.java
BuscarIndiceArray.java
ValidarStatusMetodo.java
NormalizarStatusRetorno.java
PedidoMetodosRetorno.java
PagamentoMetodosRetorno.java
ProdutoEstoqueMetodoRetorno.java
OrdemServicoMetodoRetorno.java
MensageriaMetodoRetorno.java
AuditoriaMetodoRetorno.java
TotalAprovadoMetodoRetorno.java
BuscarClienteMetodoRetorno.java
TotalMatrizMetodoRetorno.java
ErroSemReturn.java
ErroTipoRetornoErrado.java
ErroCaminhoSemRetorno.java
ErroVoidRetornandoValor.java
ErroIgnorarRetorno.java
ErroCodigoAposReturn.java
```

Compile:

```powershell
javac Main.java
javac ImprimirVsRetornar.java
javac RetornoInt.java
javac RetornoLong.java
javac RetornoDouble.java
javac RetornoBoolean.java
javac RetornoString.java
javac ReturnIfElse.java
javac CalcularTotalArray.java
javac CalcularMediaArray.java
javac CalcularMaiorValor.java
javac BuscarIndiceArray.java
javac ValidarStatusMetodo.java
javac NormalizarStatusRetorno.java
javac PedidoMetodosRetorno.java
javac PagamentoMetodosRetorno.java
javac ProdutoEstoqueMetodoRetorno.java
javac OrdemServicoMetodoRetorno.java
javac MensageriaMetodoRetorno.java
javac AuditoriaMetodoRetorno.java
javac TotalAprovadoMetodoRetorno.java
javac BuscarClienteMetodoRetorno.java
javac TotalMatrizMetodoRetorno.java
javac ErroSemReturn.java
javac ErroTipoRetornoErrado.java
javac ErroCaminhoSemRetorno.java
javac ErroVoidRetornandoValor.java
javac ErroIgnorarRetorno.java
javac ErroCodigoAposReturn.java
```

Execute:

```powershell
java Main
java ImprimirVsRetornar
java RetornoInt
java RetornoLong
java RetornoDouble
java RetornoBoolean
java RetornoString
java ReturnIfElse
java CalcularTotalArray
java CalcularMediaArray
java CalcularMaiorValor
java BuscarIndiceArray
java ValidarStatusMetodo
java NormalizarStatusRetorno
java PedidoMetodosRetorno
java PagamentoMetodosRetorno
java ProdutoEstoqueMetodoRetorno
java OrdemServicoMetodoRetorno
java MensageriaMetodoRetorno
java AuditoriaMetodoRetorno
java TotalAprovadoMetodoRetorno
java BuscarClienteMetodoRetorno
java TotalMatrizMetodoRetorno
java ErroSemReturn
java ErroTipoRetornoErrado
java ErroCaminhoSemRetorno
java ErroVoidRetornandoValor
java ErroIgnorarRetorno
java ErroCodigoAposReturn
```

Alguns arquivos de erro proposital não devem compilar ou devem demonstrar problema de uso.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroSemReturn.java`

```java
public class ErroSemReturn {
    public static void main(String[] args) {
        int resultado = somar(10, 20);

        System.out.println(resultado);
    }

    public static int somar(int a, int b) {
        int resultado = a + b;
    }
}
```

Objetivo:

```text
entender que método com retorno precisa usar return.
```

---

## Arquivo sugerido: `ErroCaminhoSemRetorno.java`

```java
public class ErroCaminhoSemRetorno {
    public static void main(String[] args) {
        System.out.println(obterMensagem(false));
    }

    public static String obterMensagem(boolean sucesso) {
        if (sucesso) {
            return "OK";
        }
    }
}
```

Depois corrija:

```java
return "ERRO";
```

Objetivo:

```text
entender que todo caminho precisa retornar valor.
```

---

## Arquivo sugerido: `ErroIgnorarRetorno.java`

```java
public class ErroIgnorarRetorno {
    public static void main(String[] args) {
        somar(10, 20);
    }

    public static int somar(int a, int b) {
        return a + b;
    }
}
```

Depois corrija:

```java
int resultado = somar(10, 20);
System.out.println(resultado);
```

Objetivo:

```text
entender que retorno deve ser usado.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar métodos |
| Renomear método | `Shift + F6` | Melhorar nomes como `calcularTotal` |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Criar método de cálculo |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver valor retornado |
| Step Into | `F7` em muitos keymaps | Entrar dentro do método |
| Step Over | `F8` em muitos keymaps | Passar pela chamada |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Avaliar retorno no debug |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |

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
        int resultado = somar(10, 20);

        System.out.println(resultado);
    }

    public static int somar(int a, int b) {
        return a + b;
    }
}
```

Coloque breakpoint na linha:

```java
int resultado = somar(10, 20);
```

Use Step Into.

Observe:

```text
a = 10;
b = 20;
return a + b;
valor retornado = 30;
resultado recebe 30.
```

Esse debug fixa o fluxo:

```text
argumentos entram;
método calcula;
return devolve;
variável recebe.
```

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 054 — Métodos com retorno

### O que aprendi
Aprendi que métodos com retorno produzem um valor para quem chamou, usando `return` e um tipo de retorno como `int`, `long`, `double`, `boolean` ou `String`.

### O que pratiquei
Criei métodos que retornam soma, total, média, maior valor, índice encontrado, status válido, status normalizado, mensagem textual, valor de parcela, estoque final, decisão de OS, decisão de mensageria, descrição de auditoria, total aprovado e total de matriz.

### Conceitos principais
- método com retorno
- `return`
- tipo de retorno
- valor retornado
- uso do resultado
- assinatura
- `int`
- `long`
- `double`
- `boolean`
- `String`
- retorno antecipado
- múltiplos returns
- caminho de retorno
- método puro
- separação entre cálculo e exibição
- busca retornando índice
- validação retornando boolean
- texto retornando String

### Arquivos criados
- `labs/m1/aula-054-metodos-com-retorno/Main.java`
- `labs/m1/aula-054-metodos-com-retorno/ImprimirVsRetornar.java`
- `labs/m1/aula-054-metodos-com-retorno/RetornoInt.java`
- `labs/m1/aula-054-metodos-com-retorno/RetornoLong.java`
- `labs/m1/aula-054-metodos-com-retorno/RetornoDouble.java`
- `labs/m1/aula-054-metodos-com-retorno/RetornoBoolean.java`
- `labs/m1/aula-054-metodos-com-retorno/RetornoString.java`
- `labs/m1/aula-054-metodos-com-retorno/ReturnIfElse.java`
- `labs/m1/aula-054-metodos-com-retorno/CalcularTotalArray.java`
- `labs/m1/aula-054-metodos-com-retorno/CalcularMediaArray.java`
- `labs/m1/aula-054-metodos-com-retorno/CalcularMaiorValor.java`
- `labs/m1/aula-054-metodos-com-retorno/BuscarIndiceArray.java`
- `labs/m1/aula-054-metodos-com-retorno/ValidarStatusMetodo.java`
- `labs/m1/aula-054-metodos-com-retorno/NormalizarStatusRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/PedidoMetodosRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/PagamentoMetodosRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/ProdutoEstoqueMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/OrdemServicoMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/MensageriaMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/AuditoriaMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/TotalAprovadoMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/BuscarClienteMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/TotalMatrizMetodoRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/ErroSemReturn.java`
- `labs/m1/aula-054-metodos-com-retorno/ErroTipoRetornoErrado.java`
- `labs/m1/aula-054-metodos-com-retorno/ErroCaminhoSemRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/ErroVoidRetornandoValor.java`
- `labs/m1/aula-054-metodos-com-retorno/ErroIgnorarRetorno.java`
- `labs/m1/aula-054-metodos-com-retorno/ErroCodigoAposReturn.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac CalcularTotalArray.java
java CalcularTotalArray
javac ValidarStatusMetodo.java
java ValidarStatusMetodo
javac PagamentoMetodosRetorno.java
java PagamentoMetodosRetorno
javac TotalAprovadoMetodoRetorno.java
java TotalAprovadoMetodoRetorno
```

### Erros que quero evitar
- esquecer `return`;
- retornar tipo errado;
- deixar caminho sem retorno;
- tentar retornar valor em método `void`;
- ignorar retorno importante;
- imprimir dentro de método de cálculo;
- usar nome confuso para método boolean;
- retornar `0` para erro sem clareza;
- confundir parâmetro com retorno;
- escrever código inacessível depois do `return`.

### Próximo passo
Estudar métodos com parâmetros.
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
git add labs/m1/aula-054-metodos-com-retorno docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 054: pratica metodos com retorno em Java"
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
1. O que é um método com retorno?
2. Qual é a função do `return`?
3. O que significa tipo de retorno?
4. Qual a diferença entre imprimir e retornar?
5. Por que o resultado retornado deve ser usado?
6. Por que todo caminho de um método com retorno precisa retornar algo?
7. Quando um método deve retornar `boolean`?
8. Quando um método deve retornar `String`?
9. Por que métodos de cálculo geralmente não devem imprimir?
10. O que significa separar cálculo de exibição?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar método com retorno;
explicar return;
explicar tipo de retorno;
criar método retornando int;
criar método retornando long;
criar método retornando double;
criar método retornando boolean;
criar método retornando String;
chamar método com retorno;
guardar retorno em variável;
usar retorno em if;
usar retorno em println;
diferenciar void de retorno;
diferenciar imprimir de retornar;
garantir que todo caminho retorna;
usar retorno antecipado;
usar múltiplos returns com clareza;
criar método de soma;
criar método de média;
criar método de maior valor;
criar método de busca retornando índice;
criar método de validação retornando boolean;
criar método de normalização retornando String;
aplicar retorno em pedido;
aplicar retorno em pagamento;
aplicar retorno em produto;
aplicar retorno em OS;
aplicar retorno em mensageria;
aplicar retorno em auditoria;
aplicar retorno em arrays paralelos;
aplicar retorno em matriz;
diagnosticar erros comuns;
debugar valor retornado;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar sobrecarga.

Não precisa ainda dominar recursão.

Não precisa ainda dominar objetos.

Não precisa ainda dominar exceções profissionais.

Não precisa ainda dominar testes automatizados.

Esses assuntos virão depois.

O objetivo é dominar métodos que calculam, validam, buscam ou montam valor e devolvem resultado para quem chamou.

---

## Fechamento da aula

Hoje aprendemos métodos com retorno.

A ideia central foi:

```text
um método com retorno produz um valor que pode ser usado pelo programa.
```

O padrão principal foi:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

E o uso:

```java
int resultado = somar(10, 20);
```

Também vimos:

```text
tipo de retorno;
return;
uso do resultado;
retorno int;
retorno long;
retorno double;
retorno boolean;
retorno String;
múltiplos returns;
todo caminho precisa retornar;
separação entre cálculo e exibição.
```

O ponto mais importante é:

```text
retornar é entregar valor para o código que chamou.
```

Na próxima aula, vamos estudar métodos com parâmetros.

A ideia de parâmetro já apareceu, mas agora ela será aprofundada com foco em entrada de dados para métodos, ordem, nomes e legibilidade.
