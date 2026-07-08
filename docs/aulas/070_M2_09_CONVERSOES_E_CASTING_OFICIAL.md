# 070 — M2.09 — Conversões e Casting

## A pergunta central da aula

Observe:

```java
double valor = 10.75;

int inteiro = (int) valor;

System.out.println(inteiro);
```

Saída:

```text
10
```

O Java não arredondou para 11.

Ele descartou a parte decimal.

Agora observe:

```java
String texto = "10.75";

int numero = Integer.parseInt(texto);
```

Esse código compila.

Mas quebra em execução:

```text
NumberFormatException.
```

Por quê?

Porque `"10.75"` não é um inteiro válido para `Integer.parseInt`.

Conversão não é só “mudar tipo”.

Conversão precisa respeitar:

```text
tipo de origem;
tipo de destino;
faixa de valores;
precisão;
formato textual;
regra de negócio;
risco de erro.
```

---

## Tipos de conversão nesta aula

Vamos estudar:

```text
widening;
narrowing;
casting explícito;
conversão de texto para número;
parseInt;
parseLong;
parseDouble;
valueOf;
NumberFormatException;
validação antes de converter;
métodos seguros de conversão;
leitura crítica em código de backend.
```

Não vamos ainda entrar profundamente em:

```text
BigDecimal;
Locale;
Date parsing;
JSON serialization;
conversões com frameworks;
mappers profissionais;
Bean Validation.
```

Esses assuntos virão depois.

---

## O que é widening

`Widening` é conversão para um tipo maior ou mais amplo.

Exemplo:

```java
int quantidade = 10;
long quantidadeLong = quantidade;
```

`int` cabe dentro de `long`.

Então Java permite automaticamente.

Outro exemplo:

```java
int valor = 10;
double valorDouble = valor;
```

`int` pode virar `double` automaticamente.

Isso é widening.

Normalmente é conversão implícita.

Exemplos comuns:

```text
byte -> short -> int -> long -> float -> double
char -> int
int -> long
long -> double
float -> double
```

A ideia:

```text
o destino consegue representar uma faixa maior ou mais ampla.
```

Mas mesmo widening pode ter detalhes de precisão em alguns casos, especialmente com números muito grandes e ponto flutuante.

---

## O que é narrowing

`Narrowing` é conversão para um tipo menor ou mais restrito.

Exemplo:

```java
long valorLong = 1000L;
int valorInt = (int) valorLong;
```

Java exige cast explícito:

```java
(int)
```

Porque pode haver perda.

Outro exemplo:

```java
double media = 9.8;
int mediaInteira = (int) media;
```

Aqui há perda da parte decimal.

`narrowing` pode causar:

```text
perda de precisão;
corte de casas decimais;
overflow;
resultado inesperado.
```

Por isso precisa ser explícito.

---

## O que é cast

Cast é a indicação explícita de conversão.

Exemplo:

```java
double valor = 10.75;

int inteiro = (int) valor;
```

O trecho:

```java
(int)
```

é o cast.

Ele diz ao compilador:

```text
eu sei que estou convertendo para int.
```

Mas atenção:

```text
cast não garante que a conversão faz sentido para o negócio.
```

Cast só força a conversão em nível de linguagem.

Se houver perda, a responsabilidade é do desenvolvedor.

---

## Vocabulário essencial

Termos desta aula:

```text
conversão;
casting;
cast;
widening;
narrowing;
conversão implícita;
conversão explícita;
parse;
parsing;
parseInt;
parseLong;
parseDouble;
valueOf;
NumberFormatException;
validação;
overflow;
perda de precisão;
truncamento;
arredondamento;
tipo de origem;
tipo de destino;
faixa de valores;
texto numérico;
formato inválido;
wrapper;
primitivo;
autoboxing;
unboxing.
```

Termos mais importantes:

```text
widening -> conversão automática para tipo mais amplo;
narrowing -> conversão para tipo mais restrito, geralmente com cast;
cast -> instrução explícita de conversão;
parse -> converter texto para valor numérico;
NumberFormatException -> erro ao tentar converter texto inválido para número;
overflow -> valor ultrapassa limite do tipo e gera resultado incorreto;
truncamento -> descarte da parte decimal ao converter para inteiro;
validação -> checagem antes ou durante a conversão.
```

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
        int quantidade = 10;

        long quantidadeLong = quantidade;

        double quantidadeDouble = quantidade;

        System.out.println("int: " + quantidade);
        System.out.println("long: " + quantidadeLong);
        System.out.println("double: " + quantidadeDouble);
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

Saída esperada:

```text
int: 10
long: 10
double: 10.0
```

Aqui ocorreu widening:

```text
int -> long;
int -> double.
```

Não foi necessário cast explícito.

---

## Widening com tipos numéricos

Arquivo:

```text
WideningNumerico.java
```

Código:

```java
public class WideningNumerico {
    public static void main(String[] args) {
        byte valorByte = 10;
        short valorShort = valorByte;
        int valorInt = valorShort;
        long valorLong = valorInt;
        float valorFloat = valorLong;
        double valorDouble = valorFloat;

        System.out.println("byte: " + valorByte);
        System.out.println("short: " + valorShort);
        System.out.println("int: " + valorInt);
        System.out.println("long: " + valorLong);
        System.out.println("float: " + valorFloat);
        System.out.println("double: " + valorDouble);
    }
}
```

O Java aceita porque o destino é mais amplo.

Mesmo assim, cuidado com `float` e `double` em valores muito grandes ou dinheiro.

Para dinheiro, mais adiante veremos alternativas melhores.

No nosso curso, já usamos centavos com `long` para evitar problemas iniciais com ponto flutuante.

---

## Narrowing com cast

Arquivo:

```text
NarrowingComCast.java
```

Código:

```java
public class NarrowingComCast {
    public static void main(String[] args) {
        long valorLong = 1000L;

        int valorInt = (int) valorLong;

        System.out.println("long: " + valorLong);
        System.out.println("int: " + valorInt);
    }
}
```

Saída:

```text
long: 1000
int: 1000
```

Aqui deu certo porque `1000` cabe em `int`.

Mas se o valor for maior que o limite de `int`, o resultado pode ficar errado.

---

## Overflow em narrowing

Arquivo:

```text
OverflowNarrowing.java
```

Código:

```java
public class OverflowNarrowing {
    public static void main(String[] args) {
        long valorLong = 3_000_000_000L;

        int valorInt = (int) valorLong;

        System.out.println("long: " + valorLong);
        System.out.println("int convertido: " + valorInt);
        System.out.println("Integer.MAX_VALUE: " + Integer.MAX_VALUE);
    }
}
```

Saída pode ser algo inesperado, como:

```text
long: 3000000000
int convertido: -1294967296
Integer.MAX_VALUE: 2147483647
```

O número não coube em `int`.

O cast não protegeu.

Ele apenas forçou a conversão.

Regra:

```text
antes de converter para tipo menor, valide a faixa.
```

---

## Conversão segura de long para int

Arquivo:

```text
LongParaIntSeguro.java
```

Código:

```java
public class LongParaIntSeguro {
    public static void main(String[] args) {
        long valor = 1000L;

        int convertido = converterLongParaInt(valor);

        System.out.println("Convertido: " + convertido);
    }

    public static int converterLongParaInt(long valor) {
        if (valor < Integer.MIN_VALUE || valor > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Valor fora da faixa de int: " + valor);
        }

        return (int) valor;
    }
}
```

Agora o código falha cedo com mensagem clara se não couber.

Isso é melhor do que gerar valor incorreto silenciosamente.

---

## Double para int

Arquivo:

```text
DoubleParaInt.java
```

Código:

```java
public class DoubleParaInt {
    public static void main(String[] args) {
        double valor = 10.75;

        int inteiro = (int) valor;

        System.out.println("double: " + valor);
        System.out.println("int: " + inteiro);
    }
}
```

Saída:

```text
double: 10.75
int: 10
```

A parte decimal foi descartada.

Não houve arredondamento.

Isso se chama truncamento.

Se você precisa arredondar, não use cast como se fosse arredondamento.

Arredondamentos serão estudados na próxima aula com `Math`.

---

## Cast não arredonda

Arquivo:

```text
CastNaoArredonda.java
```

Código:

```java
public class CastNaoArredonda {
    public static void main(String[] args) {
        double primeiro = 10.1;
        double segundo = 10.5;
        double terceiro = 10.9;

        System.out.println((int) primeiro);
        System.out.println((int) segundo);
        System.out.println((int) terceiro);
    }
}
```

Saída:

```text
10
10
10
```

Conclusão:

```text
cast de double para int descarta a parte decimal.
```

Não use cast quando a regra pede arredondamento.

---

## Conversão de char para int

Arquivo:

```text
CharParaInt.java
```

Código:

```java
public class CharParaInt {
    public static void main(String[] args) {
        char letra = 'A';

        int codigo = letra;

        System.out.println("Letra: " + letra);
        System.out.println("Código: " + codigo);
    }
}
```

Saída:

```text
Letra: A
Código: 65
```

`char` pode ser convertido para `int`.

Isso mostra o código numérico do caractere.

Não é algo que usamos o tempo todo em backend, mas ajuda a entender conversões.

---

## Conversão numérica em expressões

Em expressões aritméticas, Java pode promover tipos.

Exemplo:

```java
int a = 10;
double b = 2.5;

double resultado = a + b;
```

O `int` é promovido para `double` na expressão.

Arquivo:

```text
PromocaoExpressao.java
```

Código:

```java
public class PromocaoExpressao {
    public static void main(String[] args) {
        int quantidade = 10;
        double preco = 2.5;

        double total = quantidade * preco;

        System.out.println("Total: " + total);
    }
}
```

Saída:

```text
Total: 25.0
```

---

## Divisão inteira

Arquivo:

```text
DivisaoInteira.java
```

Código:

```java
public class DivisaoInteira {
    public static void main(String[] args) {
        int total = 10;
        int quantidade = 4;

        int resultadoInteiro = total / quantidade;
        double resultadoDoubleErrado = total / quantidade;
        double resultadoDoubleCorreto = (double) total / quantidade;

        System.out.println("int / int em int: " + resultadoInteiro);
        System.out.println("int / int em double: " + resultadoDoubleErrado);
        System.out.println("double / int em double: " + resultadoDoubleCorreto);
    }
}
```

Saída:

```text
int / int em int: 2
int / int em double: 2.0
double / int em double: 2.5
```

Por quê?

```text
total / quantidade
```

com os dois operandos `int` faz divisão inteira.

Só depois o resultado é colocado em `double`.

Para obter decimal, converta um lado antes:

```java
(double) total / quantidade
```

---

## Conversão de texto para número

Em sistemas reais, muitos dados chegam como texto:

```text
entrada de usuário;
arquivo CSV;
JSON;
parâmetro HTTP;
formulário;
integração externa;
variável de ambiente;
configuração.
```

Exemplo:

```java
String texto = "123";
int numero = Integer.parseInt(texto);
```

Isso é parsing.

Parsing é converter uma representação textual para um tipo.

---

## parseInt

Arquivo:

```text
ParseIntExemplo.java
```

Código:

```java
public class ParseIntExemplo {
    public static void main(String[] args) {
        String texto = "123";

        int numero = Integer.parseInt(texto);

        System.out.println("Número: " + numero);
    }
}
```

Saída:

```text
Número: 123
```

`Integer.parseInt` retorna `int`.

Se o texto não for inteiro válido, lança `NumberFormatException`.

---

## parseLong

Arquivo:

```text
ParseLongExemplo.java
```

Código:

```java
public class ParseLongExemplo {
    public static void main(String[] args) {
        String texto = "10000000000";

        long numero = Long.parseLong(texto);

        System.out.println("Número: " + numero);
    }
}
```

Use `Long.parseLong` quando o valor pode ser maior que `int`.

IDs e valores em centavos frequentemente usam `long`.

---

## parseDouble

Arquivo:

```text
ParseDoubleExemplo.java
```

Código:

```java
public class ParseDoubleExemplo {
    public static void main(String[] args) {
        String texto = "10.75";

        double numero = Double.parseDouble(texto);

        System.out.println("Número: " + numero);
    }
}
```

Saída:

```text
Número: 10.75
```

Atenção:

```text
Double.parseDouble normalmente espera ponto como separador decimal.
```

Texto `"10,75"` pode falhar.

Questões de locale serão tratadas depois.

---

## valueOf

`valueOf` retorna wrapper.

Exemplo:

```java
Integer numero = Integer.valueOf("123");
Long id = Long.valueOf("1000");
Double media = Double.valueOf("9.5");
```

Arquivo:

```text
ValueOfExemplo.java
```

Código:

```java
public class ValueOfExemplo {
    public static void main(String[] args) {
        Integer quantidade = Integer.valueOf("10");
        Long valorCentavos = Long.valueOf("1000");
        Double media = Double.valueOf("9.5");

        System.out.println("Quantidade: " + quantidade);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Média: " + media);
    }
}
```

Diferença inicial:

```text
parseInt -> int;
valueOf -> Integer.
```

---

## NumberFormatException

Arquivo:

```text
ErroNumberFormatException.java
```

Código propositalmente problemático:

```java
public class ErroNumberFormatException {
    public static void main(String[] args) {
        String texto = "abc";

        int numero = Integer.parseInt(texto);

        System.out.println(numero);
    }
}
```

Compila.

Mas ao executar:

```text
NumberFormatException.
```

Motivo:

```text
abc não tem formato de inteiro.
```

Outros exemplos inválidos para `parseInt`:

```text
"10.5"
"10,5"
"abc"
""
"   "
"12a"
```

---

## Tratando NumberFormatException

Arquivo:

```text
ParseComTryCatch.java
```

Código:

```java
public class ParseComTryCatch {
    public static void main(String[] args) {
        String texto = "abc";

        try {
            int numero = Integer.parseInt(texto);

            System.out.println("Número: " + numero);
        } catch (NumberFormatException erro) {
            System.out.println("Valor inválido para inteiro: " + texto);
        }
    }
}
```

Saída:

```text
Valor inválido para inteiro: abc
```

O programa não quebra de forma feia.

Ele informa o problema.

---

## Método seguro para parse de inteiro

Arquivo:

```text
ParseInteiroSeguro.java
```

Código:

```java
public class ParseInteiroSeguro {
    public static void main(String[] args) {
        Integer numero = tentarConverterParaInteiro("123");
        Integer invalido = tentarConverterParaInteiro("abc");

        System.out.println("Número: " + numero);
        System.out.println("Inválido: " + invalido);
    }

    public static Integer tentarConverterParaInteiro(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        try {
            return Integer.valueOf(texto.trim());
        } catch (NumberFormatException erro) {
            return null;
        }
    }
}
```

Aqui retornamos `Integer` porque pode não haver valor válido.

Contrato:

```text
retorna Integer quando converter;
retorna null quando não converter.
```

Quem chama precisa validar.

---

## Método com valor padrão

Arquivo:

```text
ParseInteiroComPadrao.java
```

Código:

```java
public class ParseInteiroComPadrao {
    public static void main(String[] args) {
        int quantidade = converterParaInteiroOuPadrao("abc", 0);

        System.out.println("Quantidade: " + quantidade);
    }

    public static int converterParaInteiroOuPadrao(String texto, int valorPadrao) {
        if (texto == null || texto.isBlank()) {
            return valorPadrao;
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            return valorPadrao;
        }
    }
}
```

Atenção:

```text
valor padrão deve ter regra.
```

Se `"abc"` deveria bloquear o fluxo, retornar `0` pode esconder erro.

---

## Método que falha com mensagem clara

Arquivo:

```text
ParseInteiroObrigatorio.java
```

Código:

```java
public class ParseInteiroObrigatorio {
    public static void main(String[] args) {
        int quantidade = converterInteiroObrigatorio("10", "Quantidade");

        System.out.println("Quantidade: " + quantidade);
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser um número inteiro válido.");
        }
    }
}
```

Esse padrão é melhor quando o campo é obrigatório.

A ausência ou formato inválido não vira `0`.

Ela vira erro claro.

---

## Validação antes de converter

Podemos fazer validação simples antes de parse.

Exemplo para inteiro positivo:

Arquivo:

```text
ValidarDigitosAntesParse.java
```

Código:

```java
public class ValidarDigitosAntesParse {
    public static void main(String[] args) {
        String texto = "123";

        if (somenteDigitos(texto)) {
            int numero = Integer.parseInt(texto);
            System.out.println("Número: " + numero);
        } else {
            System.out.println("Texto inválido.");
        }
    }

    public static boolean somenteDigitos(String texto) {
        if (texto == null || texto.isBlank()) {
            return false;
        }

        for (int indice = 0; indice < texto.length(); indice++) {
            char caractere = texto.charAt(indice);

            if (caractere < '0' || caractere > '9') {
                return false;
            }
        }

        return true;
    }
}
```

Esse método aceita apenas dígitos positivos.

Não aceita:

```text
-10;
10.5;
10,5;
espaços internos.
```

É uma regra simples e explícita.

---

## Conversão com trim

Sempre pense em espaços.

Exemplo:

```java
String texto = " 123 ";
int numero = Integer.parseInt(texto.trim());
```

Sem `trim`, alguns formatos com espaços podem falhar ou ficar inconsistentes.

Regra inicial:

```text
normalizar texto antes de converter.
```

Exemplo:

```java
texto.trim()
```

Mas não remova espaços internos sem entender a regra.

---

## Conversão e regra de negócio

Nem toda conversão válida tecnicamente é válida para o negócio.

Exemplo:

```java
String texto = "-5";
int quantidade = Integer.parseInt(texto);
```

Tecnicamente converte.

Mas quantidade negativa pode ser inválida.

Então o fluxo correto é:

```text
converter;
validar regra.
```

Arquivo:

```text
ConverterEValidarQuantidade.java
```

Código:

```java
public class ConverterEValidarQuantidade {
    public static void main(String[] args) {
        int quantidade = converterQuantidadeObrigatoria("10");

        System.out.println("Quantidade: " + quantidade);
    }

    public static int converterQuantidadeObrigatoria(String texto) {
        int quantidade = converterInteiroObrigatorio(texto, "Quantidade");

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        return quantidade;
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser um número inteiro válido.");
        }
    }
}
```

Conversão e validação são responsabilidades diferentes, mas podem ser encadeadas.

---

## Aplicação em cliente

Arquivo:

```text
ClienteConversao.java
```

Código:

```java
public class ClienteConversao {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana", "30");

        System.out.println("Cliente: " + cliente.nome);
        System.out.println("Idade: " + cliente.idade);
    }

    public static Cliente criarCliente(String nome, String idadeTexto) {
        Cliente cliente = new Cliente();

        cliente.nome = normalizarTextoObrigatorio(nome, "Nome");
        cliente.idade = converterIdade(idadeTexto);

        return cliente;
    }

    public static int converterIdade(String texto) {
        int idade = converterInteiroObrigatorio(texto, "Idade");

        if (idade < 0) {
            throw new IllegalArgumentException("Idade não pode ser negativa.");
        }

        return idade;
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser um inteiro válido.");
        }
    }

    public static String normalizarTextoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        return texto.trim();
    }
}

class Cliente {
    String nome;
    int idade;
}
```

Esse exemplo mostra dados chegando como texto e virando domínio validado.

---

## Aplicação em produto

Arquivo:

```text
ProdutoConversao.java
```

Código:

```java
public class ProdutoConversao {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", "10", "true");

        System.out.println("Produto: " + produto.nome);
        System.out.println("Estoque: " + produto.estoque);
        System.out.println("Ativo: " + produto.ativo);
    }

    public static Produto criarProduto(String nome, String estoqueTexto, String ativoTexto) {
        Produto produto = new Produto();

        produto.nome = textoObrigatorio(nome, "Nome do produto");
        produto.estoque = converterEstoque(estoqueTexto);
        produto.ativo = converterBooleanObrigatorio(ativoTexto, "Ativo");

        return produto;
    }

    public static int converterEstoque(String texto) {
        int estoque = converterInteiroObrigatorio(texto, "Estoque");

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        return estoque;
    }

    public static boolean converterBooleanObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        String normalizado = texto.trim().toLowerCase();

        if ("true".equals(normalizado)) {
            return true;
        }

        if ("false".equals(normalizado)) {
            return false;
        }

        throw new IllegalArgumentException(nomeCampo + " deve ser true ou false.");
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser inteiro válido.");
        }
    }

    public static String textoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        return texto.trim();
    }
}

class Produto {
    String nome;
    int estoque;
    boolean ativo;
}
```

Aqui evitamos o problema de `Boolean.parseBoolean("abc")` virar `false` silenciosamente.

---

## Aplicação em pedido

Arquivo:

```text
PedidoConversao.java
```

Código:

```java
public class PedidoConversao {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("1001", "Ana", "2500");

        System.out.println("ID: " + pedido.id);
        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Valor: " + pedido.valorCentavos);
    }

    public static Pedido criarPedido(String idTexto, String clienteTexto, String valorTexto) {
        Pedido pedido = new Pedido();

        pedido.id = converterLongObrigatorio(idTexto, "ID");
        pedido.cliente = textoObrigatorio(clienteTexto, "Cliente");
        pedido.valorCentavos = converterValorCentavos(valorTexto);

        return pedido;
    }

    public static long converterValorCentavos(String texto) {
        long valor = converterLongObrigatorio(texto, "Valor em centavos");

        if (valor <= 0) {
            throw new IllegalArgumentException("Valor em centavos deve ser maior que zero.");
        }

        return valor;
    }

    public static long converterLongObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Long.parseLong(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser long válido.");
        }
    }

    public static String textoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        return texto.trim();
    }
}

class Pedido {
    long id;
    String cliente;
    long valorCentavos;
}
```

Usamos `long` para IDs e centavos.

Isso evita `double` para dinheiro nessa fase.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoConversao.java
```

Código:

```java
public class PagamentoConversao {
    public static void main(String[] args) {
        Pagamento pagamento = criarPagamento("10000", "4");

        System.out.println("Valor: " + pagamento.valorCentavos);
        System.out.println("Parcelas: " + pagamento.parcelas);
        System.out.println("Parcela: " + pagamento.valorCentavos / pagamento.parcelas);
    }

    public static Pagamento criarPagamento(String valorTexto, String parcelasTexto) {
        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = converterValor(valorTexto);
        pagamento.parcelas = converterParcelas(parcelasTexto);

        return pagamento;
    }

    public static long converterValor(String texto) {
        long valor = converterLongObrigatorio(texto, "Valor");

        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        return valor;
    }

    public static int converterParcelas(String texto) {
        int parcelas = converterInteiroObrigatorio(texto, "Parcelas");

        if (parcelas <= 0) {
            throw new IllegalArgumentException("Parcelas deve ser maior que zero.");
        }

        return parcelas;
    }

    public static long converterLongObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Long.parseLong(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser long válido.");
        }
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser inteiro válido.");
        }
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
}
```

Aqui validamos antes de dividir.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoConversao.java
```

Código:

```java
public class OrdemServicoConversao {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "3", "false");

        System.out.println("Certificado: " + os.certificado);
        System.out.println("Atividades: " + os.quantidadeAtividades);
        System.out.println("Urgente: " + os.urgente);
    }

    public static OrdemServico criarOs(String certificadoTexto, String atividadesTexto, String urgenteTexto) {
        OrdemServico os = new OrdemServico();

        os.certificado = textoObrigatorio(certificadoTexto, "Certificado");
        os.quantidadeAtividades = converterInteiroNaoNegativo(atividadesTexto, "Atividades");
        os.urgente = converterBooleanObrigatorio(urgenteTexto, "Urgente");

        return os;
    }

    public static int converterInteiroNaoNegativo(String texto, String nomeCampo) {
        int valor = converterInteiroObrigatorio(texto, nomeCampo);

        if (valor < 0) {
            throw new IllegalArgumentException(nomeCampo + " não pode ser negativo.");
        }

        return valor;
    }

    public static boolean converterBooleanObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        String normalizado = texto.trim().toLowerCase();

        if ("true".equals(normalizado)) {
            return true;
        }

        if ("false".equals(normalizado)) {
            return false;
        }

        throw new IllegalArgumentException(nomeCampo + " deve ser true ou false.");
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser inteiro válido.");
        }
    }

    public static String textoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        return texto.trim();
    }
}

class OrdemServico {
    String certificado;
    int quantidadeAtividades;
    boolean urgente;
}
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaConversao.java
```

Código:

```java
public class MensageriaConversao {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "ENTREGA", "2");

        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Tipo: " + mensagem.tipo);
        System.out.println("Tentativas: " + mensagem.tentativas);
    }

    public static Mensagem criarMensagem(String clienteTexto, String tipoTexto, String tentativasTexto) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = textoObrigatorio(clienteTexto, "Cliente");
        mensagem.tipo = textoObrigatorio(tipoTexto, "Tipo").toUpperCase();
        mensagem.tentativas = converterInteiroNaoNegativo(tentativasTexto, "Tentativas");

        return mensagem;
    }

    public static int converterInteiroNaoNegativo(String texto, String nomeCampo) {
        int valor = converterInteiroObrigatorio(texto, nomeCampo);

        if (valor < 0) {
            throw new IllegalArgumentException(nomeCampo + " não pode ser negativo.");
        }

        return valor;
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser inteiro válido.");
        }
    }

    public static String textoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        return texto.trim();
    }
}

class Mensagem {
    String cliente;
    String tipo;
    int tentativas;
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaConversao.java
```

Código:

```java
public class AuditoriaConversao {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("100", "aline", "1");

        System.out.println("ID: " + registro.id);
        System.out.println("Usuário: " + registro.usuario);
        System.out.println("Tentativa: " + registro.tentativa);
    }

    public static RegistroAuditoria criarRegistro(String idTexto, String usuarioTexto, String tentativaTexto) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.id = converterLongObrigatorio(idTexto, "ID");
        registro.usuario = textoObrigatorio(usuarioTexto, "Usuário").toLowerCase();
        registro.tentativa = converterInteiroPositivo(tentativaTexto, "Tentativa");

        return registro;
    }

    public static int converterInteiroPositivo(String texto, String nomeCampo) {
        int valor = converterInteiroObrigatorio(texto, nomeCampo);

        if (valor <= 0) {
            throw new IllegalArgumentException(nomeCampo + " deve ser maior que zero.");
        }

        return valor;
    }

    public static long converterLongObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Long.parseLong(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser long válido.");
        }
    }

    public static int converterInteiroObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser inteiro válido.");
        }
    }

    public static String textoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        return texto.trim();
    }
}

class RegistroAuditoria {
    long id;
    String usuario;
    int tentativa;
}
```

Esse exemplo simula dados textuais virando tipos adequados.

---

## Refatoração: remover cast perigoso

Código perigoso:

```java
long valor = 3_000_000_000L;

int convertido = (int) valor;
```

Refatoração:

```java
int convertido = converterLongParaInt(valor);
```

com validação de faixa:

```java
public static int converterLongParaInt(long valor) {
    if (valor < Integer.MIN_VALUE || valor > Integer.MAX_VALUE) {
        throw new IllegalArgumentException("Valor fora da faixa de int.");
    }

    return (int) valor;
}
```

---

## Refatoração: não usar cast para arredondar

Código ruim:

```java
int valor = (int) 10.9;
```

Se a regra pede arredondamento, isso está errado.

A próxima aula vai mostrar `Math.round`, `Math.floor`, `Math.ceil`.

Por enquanto:

```text
cast corta;
não arredonda.
```

---

## Refatoração: parse centralizado

Código repetido:

```java
int quantidade = Integer.parseInt(quantidadeTexto.trim());
int parcelas = Integer.parseInt(parcelasTexto.trim());
int tentativas = Integer.parseInt(tentativasTexto.trim());
```

Refatoração:

```java
int quantidade = converterInteiroObrigatorio(quantidadeTexto, "Quantidade");
int parcelas = converterInteiroObrigatorio(parcelasTexto, "Parcelas");
int tentativas = converterInteiroObrigatorio(tentativasTexto, "Tentativas");
```

Benefícios:

```text
mensagens melhores;
tratamento padrão;
menos duplicação;
mais clareza;
mais fácil alterar depois.
```

---

## Erros comuns

### Erro 1 — Achar que cast valida faixa

Cast não valida faixa.

Ele força conversão.

---

### Erro 2 — Achar que cast arredonda

Cast de `double` para `int` trunca.

---

### Erro 3 — Converter long grande para int sem validar

Pode gerar overflow.

---

### Erro 4 — Fazer divisão inteira sem perceber

```java
double resultado = 10 / 4;
```

gera `2.0`, não `2.5`.

---

### Erro 5 — Usar parseInt em decimal

```java
Integer.parseInt("10.5")
```

gera `NumberFormatException`.

---

### Erro 6 — Não tratar NumberFormatException

Entrada textual pode vir inválida.

---

### Erro 7 — Usar Boolean.parseBoolean achando que valida

`Boolean.parseBoolean("abc")` retorna `false`.

---

### Erro 8 — Converter null sem validar

`Integer.parseInt(null)` quebra.

---

### Erro 9 — Retornar 0 para todo parse inválido

Pode esconder erro de regra.

---

### Erro 10 — Misturar conversão com regra sem clareza

Converta e valide com responsabilidades claras.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugConversao {
    public static void main(String[] args) {
        String texto = "10.5";

        int numero = Integer.parseInt(texto);

        System.out.println(numero);
    }
}
```

Coloque breakpoint em:

```java
int numero = Integer.parseInt(texto);
```

Observe:

```text
texto = "10.5".
```

Avance e veja `NumberFormatException`.

Depois debugue:

```java
double valor = 10.9;
int convertido = (int) valor;
```

Observe:

```text
valor = 10.9;
convertido = 10.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-070-conversoes-casting
cd labs\m2\aula-070-conversoes-casting
```

Crie arquivos:

```text
Main.java
WideningNumerico.java
NarrowingComCast.java
OverflowNarrowing.java
LongParaIntSeguro.java
DoubleParaInt.java
CastNaoArredonda.java
CharParaInt.java
PromocaoExpressao.java
DivisaoInteira.java
ParseIntExemplo.java
ParseLongExemplo.java
ParseDoubleExemplo.java
ValueOfExemplo.java
ErroNumberFormatException.java
ParseComTryCatch.java
ParseInteiroSeguro.java
ParseInteiroComPadrao.java
ParseInteiroObrigatorio.java
ValidarDigitosAntesParse.java
ConverterEValidarQuantidade.java
ClienteConversao.java
ProdutoConversao.java
PedidoConversao.java
PagamentoConversao.java
OrdemServicoConversao.java
MensageriaConversao.java
AuditoriaConversao.java
DebugConversao.java
ErroCastOverflow.java
ErroCastArredondamento.java
ErroDivisaoInteira.java
ErroBooleanParse.java
README.md
```

Compile:

```powershell
javac Main.java
javac WideningNumerico.java
javac NarrowingComCast.java
javac OverflowNarrowing.java
javac LongParaIntSeguro.java
javac DoubleParaInt.java
javac CastNaoArredonda.java
javac CharParaInt.java
javac PromocaoExpressao.java
javac DivisaoInteira.java
javac ParseIntExemplo.java
javac ParseLongExemplo.java
javac ParseDoubleExemplo.java
javac ValueOfExemplo.java
javac ErroNumberFormatException.java
javac ParseComTryCatch.java
javac ParseInteiroSeguro.java
javac ParseInteiroComPadrao.java
javac ParseInteiroObrigatorio.java
javac ValidarDigitosAntesParse.java
javac ConverterEValidarQuantidade.java
javac ClienteConversao.java
javac ProdutoConversao.java
javac PedidoConversao.java
javac PagamentoConversao.java
javac OrdemServicoConversao.java
javac MensageriaConversao.java
javac AuditoriaConversao.java
javac DebugConversao.java
javac ErroCastOverflow.java
javac ErroCastArredondamento.java
javac ErroDivisaoInteira.java
javac ErroBooleanParse.java
```

Execute os exemplos válidos:

```powershell
java Main
java WideningNumerico
java NarrowingComCast
java OverflowNarrowing
java LongParaIntSeguro
java DoubleParaInt
java CastNaoArredonda
java CharParaInt
java PromocaoExpressao
java DivisaoInteira
java ParseIntExemplo
java ParseLongExemplo
java ParseDoubleExemplo
java ValueOfExemplo
java ParseComTryCatch
java ParseInteiroSeguro
java ParseInteiroComPadrao
java ParseInteiroObrigatorio
java ValidarDigitosAntesParse
java ConverterEValidarQuantidade
java ClienteConversao
java ProdutoConversao
java PedidoConversao
java PagamentoConversao
java OrdemServicoConversao
java MensageriaConversao
java AuditoriaConversao
```

Execute os de erro proposital separadamente:

```powershell
java ErroNumberFormatException
java DebugConversao
java ErroCastOverflow
java ErroCastArredondamento
java ErroDivisaoInteira
java ErroBooleanParse
```

Alguns exemplos devem quebrar ou demonstrar resultado perigoso.

Use para diagnóstico.

---

## Observações

- Não usar cast como validação.
- Não usar cast como arredondamento.
- Não retornar 0 para erro sem regra clara.
- Normalizar texto com `trim` antes de converter quando fizer sentido.
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
git add labs/m2/aula-070-conversoes-casting docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 070: pratica conversoes e casting em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar conversão;
explicar cast;
explicar widening;
explicar narrowing;
fazer conversão int para long;
fazer conversão int para double;
fazer cast long para int;
explicar overflow;
validar faixa antes de long para int;
fazer cast double para int;
explicar truncamento;
explicar que cast não arredonda;
explicar divisão inteira;
corrigir divisão inteira com cast;
usar parseInt;
usar parseLong;
usar parseDouble;
usar valueOf;
provocar NumberFormatException;
tratar NumberFormatException;
criar método de parse seguro;
criar método de parse obrigatório;
validar texto com trim;
validar regra após conversão;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar conversão;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `BigDecimal`.

Não precisa ainda dominar `NumberFormat`.

Não precisa ainda dominar `Locale`.

Não precisa ainda dominar parsing de datas.

Não precisa ainda dominar conversão entre objetos.

Não precisa ainda dominar mappers.

Esses assuntos virão depois.

O objetivo é dominar as conversões fundamentais e evitar bugs de cast, parse e validação.

---

## Fechamento da aula

Hoje estudamos conversões e casting.

A ideia central foi:

```text
converter tipo não é apenas mudar forma; é respeitar faixa, precisão, formato e regra de negócio.
```

Vimos que:

```text
widening costuma ser automático;
narrowing exige cast;
cast pode perder precisão;
cast pode causar overflow;
cast não arredonda;
divisão entre inteiros continua inteira;
parseInt converte texto para int;
valueOf retorna wrapper;
texto inválido gera NumberFormatException;
validação precisa acompanhar conversão.
```

O ponto mais importante é:

```text
cast e parse resolvem a conversão técnica, mas não garantem que o valor convertido é válido para o negócio.
```

Na próxima aula, vamos estudar:

```text
Math, Random e números utilitários.
```

A próxima aula vai explicar arredondamentos, potência, aleatoriedade, limites numéricos e uso em testes simples.
