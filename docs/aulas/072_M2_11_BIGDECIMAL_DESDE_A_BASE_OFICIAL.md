# 072 — M2.11 — BigDecimal desde a Base

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
068 — M2.07 — StringBuilder e StringBuffer;
069 — M2.08 — Wrappers e autoboxing;
070 — M2.09 — Conversões e casting;
071 — M2.10 — Math, Random e números utilitários;
072 — M2.11 — BigDecimal desde a base.
```

Na aula anterior, estudamos `Math`, `Random` e números utilitários.

Vimos que `double` funciona para muitas contas matemáticas, mas deixamos um alerta importante:

```text
double não é ideal para dinheiro.
```

Agora vamos entender por quê.

Em sistemas backend, dinheiro aparece em:

```text
pedido;
pagamento;
frete;
desconto;
comissão;
remuneração;
provisão;
imposto;
saldo;
estorno;
rateio;
parcela;
custo;
multa;
juros.
```

Se o sistema calcula dinheiro errado, o problema não é apenas técnico.

É problema de negócio.

Por isso, Java oferece uma classe muito importante:

```java
BigDecimal
```

---

## A pergunta central da aula

Observe este código:

```java
public class Main {
    public static void main(String[] args) {
        double total = 0.1 + 0.2;

        System.out.println(total);
    }
}
```

Você talvez espere:

```text
0.3
```

Mas a saída pode ser:

```text
0.30000000000000004
```

Isso acontece porque `double` usa representação binária de ponto flutuante.

Nem todos os números decimais podem ser representados exatamente.

Para cálculo científico, gráfico, estatística simples e medições, `double` pode ser adequado.

Para dinheiro, geralmente não.

Para dinheiro, queremos precisão decimal previsível.

Por isso usamos:

```java
BigDecimal
```

---

## O que é BigDecimal

`BigDecimal` é uma classe do Java para representar números decimais com precisão controlada.

Ela fica no pacote:

```java
java.math
```

Import:

```java
import java.math.BigDecimal;
```

Exemplo:

```java
BigDecimal valor = new BigDecimal("10.50");
```

`BigDecimal` é objeto.

Ele é imutável.

Isso significa:

```text
operações não alteram o BigDecimal original;
operações retornam um novo BigDecimal.
```

Exemplo:

```java
BigDecimal valor = new BigDecimal("10.00");

valor.add(new BigDecimal("5.00"));

System.out.println(valor);
```

Saída:

```text
10.00
```

Para guardar resultado:

```java
valor = valor.add(new BigDecimal("5.00"));
```

---

## Por que não usar double para dinheiro

`double` é aproximado.

Exemplo:

```java
double total = 0.1 + 0.2;
```

Pode gerar:

```text
0.30000000000000004
```

Em dinheiro, isso pode causar:

```text
centavos incorretos;
arredondamentos inconsistentes;
diferença em conciliação;
erro em relatórios;
valor divergente no banco;
problema em nota, pagamento ou repasse;
teste instável;
erro acumulado em somas grandes.
```

Alternativas comuns:

```text
usar BigDecimal;
ou representar dinheiro em centavos com long quando fizer sentido.
```

No curso, usamos muito `long valorCentavos` até aqui para simplificar.

Agora vamos aprender `BigDecimal`, que é muito comum em regras financeiras de backend.

---

## Vocabulário essencial

Termos desta aula:

```text
BigDecimal;
precisão;
scale;
escala;
RoundingMode;
arredondamento;
HALF_UP;
HALF_EVEN;
DOWN;
UP;
add;
subtract;
multiply;
divide;
setScale;
compareTo;
equals;
valueOf;
String constructor;
double constructor;
ArithmeticException;
decimal exato;
dinheiro;
centavos;
parcela;
rateio;
imutabilidade;
valor monetário;
normalização;
formatação;
cálculo financeiro.
```

Termos mais importantes:

```text
BigDecimal -> classe para número decimal preciso;
scale -> quantidade de casas decimais;
precision -> quantidade de dígitos significativos;
RoundingMode -> regra de arredondamento;
setScale -> ajusta quantidade de casas decimais;
compareTo -> compara valor numérico;
equals -> compara valor e escala;
add -> soma;
subtract -> subtração;
multiply -> multiplicação;
divide -> divisão;
valueOf -> forma segura para criar a partir de double ou long;
new BigDecimal("10.50") -> forma segura a partir de texto decimal.
```

---

## Formas corretas de criar BigDecimal

Formas recomendadas:

```java
BigDecimal valor = new BigDecimal("10.50");
```

ou:

```java
BigDecimal valor = BigDecimal.valueOf(10.50);
```

ou:

```java
BigDecimal valor = BigDecimal.valueOf(1050, 2);
```

A última significa:

```text
1050 com escala 2 -> 10.50
```

Evite:

```java
new BigDecimal(10.50)
```

Por quê?

Porque o `double` já pode vir com imprecisão antes de entrar no `BigDecimal`.

---

## Forma perigosa: new BigDecimal(double)

Arquivo:

```text
BigDecimalDoublePerigoso.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalDoublePerigoso {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal(0.1);

        System.out.println(valor);
    }
}
```

A saída pode ser algo como:

```text
0.1000000000000000055511151231257827021181583404541015625
```

Isso assusta, mas é importante.

O `BigDecimal` mostrou a imprecisão que já veio do `double`.

Correção:

```java
BigDecimal valor = new BigDecimal("0.1");
```

ou:

```java
BigDecimal valor = BigDecimal.valueOf(0.1);
```

---

## Forma segura com String

Arquivo:

```text
BigDecimalStringSeguro.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalStringSeguro {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("0.1");

        System.out.println(valor);
    }
}
```

Saída:

```text
0.1
```

Quando você tem um texto decimal confiável, como `"10.50"`, essa é uma forma precisa.

Atenção:

```text
o texto precisa usar ponto como separador decimal nesse formato básico.
```

Formatação com vírgula, moeda e localidade será assunto da próxima aula.

---

## Forma segura com valueOf

Arquivo:

```text
BigDecimalValueOfSeguro.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalValueOfSeguro {
    public static void main(String[] args) {
        BigDecimal valor = BigDecimal.valueOf(0.1);

        System.out.println(valor);
    }
}
```

Saída:

```text
0.1
```

`BigDecimal.valueOf(double)` usa uma conversão mais segura do que `new BigDecimal(double)` para muitos casos comuns.

Regra prática:

```text
para literal decimal em código, prefira String;
para valor double já existente e inevitável, prefira BigDecimal.valueOf;
para dinheiro vindo de texto, use new BigDecimal(texto validado);
para centavos em long, use BigDecimal.valueOf(centavos, 2).
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        BigDecimal primeiro = new BigDecimal("0.10");
        BigDecimal segundo = new BigDecimal("0.20");

        BigDecimal total = primeiro.add(segundo);

        System.out.println("Total: " + total);
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
Total: 0.30
```

Esse é o primeiro ganho:

```text
decimal previsível.
```

---

## BigDecimal é imutável

Arquivo:

```text
BigDecimalImutavel.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalImutavel {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("10.00");

        valor.add(new BigDecimal("5.00"));

        System.out.println("Valor sem atribuir retorno: " + valor);

        valor = valor.add(new BigDecimal("5.00"));

        System.out.println("Valor atribuindo retorno: " + valor);
    }
}
```

Saída:

```text
Valor sem atribuir retorno: 10.00
Valor atribuindo retorno: 15.00
```

Regra:

```text
operações de BigDecimal retornam novo BigDecimal.
```

Sempre capture o retorno.

---

## Operações principais

Principais métodos:

```java
add
subtract
multiply
divide
setScale
compareTo
equals
```

Exemplo:

```java
BigDecimal a = new BigDecimal("10.00");
BigDecimal b = new BigDecimal("2.00");

a.add(b);       // soma
a.subtract(b);  // subtrai
a.multiply(b);  // multiplica
a.divide(b);    // divide, com cuidado
```

`divide` merece atenção especial.

Algumas divisões não terminam.

Exemplo:

```java
10 / 3
```

gera decimal infinito:

```text
3.333333...
```

BigDecimal precisa saber como arredondar.

---

## Soma com BigDecimal

Arquivo:

```text
BigDecimalSoma.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalSoma {
    public static void main(String[] args) {
        BigDecimal produto = new BigDecimal("10.50");
        BigDecimal frete = new BigDecimal("5.25");

        BigDecimal total = produto.add(frete);

        System.out.println("Total: " + total);
    }
}
```

Saída:

```text
Total: 15.75
```

---

## Subtração com BigDecimal

Arquivo:

```text
BigDecimalSubtracao.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalSubtracao {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("100.00");
        BigDecimal desconto = new BigDecimal("15.50");

        BigDecimal valorFinal = total.subtract(desconto);

        System.out.println("Valor final: " + valorFinal);
    }
}
```

Saída:

```text
Valor final: 84.50
```

---

## Multiplicação com BigDecimal

Arquivo:

```text
BigDecimalMultiplicacao.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalMultiplicacao {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("19.90");
        BigDecimal quantidade = new BigDecimal("3");

        BigDecimal total = precoUnitario.multiply(quantidade);

        System.out.println("Total: " + total);
    }
}
```

Saída:

```text
Total: 59.70
```

Para quantidade inteira, muitas vezes usamos `int`.

Exemplo:

```java
BigDecimal total = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
```

---

## Divisão com BigDecimal

Arquivo:

```text
BigDecimalDivisaoExata.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalDivisaoExata {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("10.00");
        BigDecimal parcelas = new BigDecimal("2");

        BigDecimal valorParcela = total.divide(parcelas);

        System.out.println("Parcela: " + valorParcela);
    }
}
```

Saída:

```text
Parcela: 5.00
```

Essa divisão é exata.

Mas nem toda divisão é.

---

## Divisão não exata

Arquivo:

```text
BigDecimalDivisaoNaoExata.java
```

Código propositalmente problemático:

```java
import java.math.BigDecimal;

public class BigDecimalDivisaoNaoExata {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("10.00");
        BigDecimal parcelas = new BigDecimal("3");

        BigDecimal valorParcela = total.divide(parcelas);

        System.out.println("Parcela: " + valorParcela);
    }
}
```

Esse código compila.

Mas pode quebrar com:

```text
ArithmeticException: Non-terminating decimal expansion
```

Motivo:

```text
10 / 3 gera decimal infinito;
BigDecimal não sabe como cortar sem regra de arredondamento.
```

Correção:

```java
total.divide(parcelas, 2, RoundingMode.HALF_UP)
```

---

## Divisão com escala e arredondamento

Arquivo:

```text
BigDecimalDivisaoComRounding.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalDivisaoComRounding {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("10.00");
        BigDecimal parcelas = new BigDecimal("3");

        BigDecimal valorParcela = total.divide(parcelas, 2, RoundingMode.HALF_UP);

        System.out.println("Parcela: " + valorParcela);
    }
}
```

Saída:

```text
Parcela: 3.33
```

Aqui dissemos:

```text
quero 2 casas decimais;
quero arredondar com HALF_UP.
```

---

## O que é scale

`scale` é a quantidade de casas decimais.

Exemplos:

```text
10       -> scale 0
10.0     -> scale 1
10.00    -> scale 2
10.500   -> scale 3
```

Arquivo:

```text
BigDecimalScale.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalScale {
    public static void main(String[] args) {
        BigDecimal primeiro = new BigDecimal("10");
        BigDecimal segundo = new BigDecimal("10.0");
        BigDecimal terceiro = new BigDecimal("10.00");

        System.out.println(primeiro.scale());
        System.out.println(segundo.scale());
        System.out.println(terceiro.scale());
    }
}
```

Saída:

```text
0
1
2
```

Scale importa em formatação, comparação com `equals` e regras de dinheiro.

---

## setScale

`setScale` ajusta a quantidade de casas decimais.

Exemplo:

```java
valor.setScale(2, RoundingMode.HALF_UP)
```

Arquivo:

```text
BigDecimalSetScale.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalSetScale {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("10.567");

        BigDecimal ajustado = valor.setScale(2, RoundingMode.HALF_UP);

        System.out.println("Original: " + valor);
        System.out.println("Ajustado: " + ajustado);
    }
}
```

Saída:

```text
Original: 10.567
Ajustado: 10.57
```

`setScale` também retorna novo objeto.

---

## RoundingMode

`RoundingMode` define a regra de arredondamento.

Import:

```java
import java.math.RoundingMode;
```

Modos comuns:

```text
HALF_UP;
HALF_EVEN;
UP;
DOWN;
CEILING;
FLOOR.
```

Nesta fase, o mais comum para entendimento inicial é:

```java
RoundingMode.HALF_UP
```

Ele representa o arredondamento “meio para cima” em muitos cenários didáticos.

Mas em financeiro real, a regra precisa vir do negócio, contrato, contabilidade ou legislação.

Não escolha por chute.

---

## Exemplo de RoundingMode

Arquivo:

```text
BigDecimalRoundingModes.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalRoundingModes {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("10.555");

        System.out.println("HALF_UP: " + valor.setScale(2, RoundingMode.HALF_UP));
        System.out.println("DOWN: " + valor.setScale(2, RoundingMode.DOWN));
        System.out.println("UP: " + valor.setScale(2, RoundingMode.UP));
    }
}
```

Saída:

```text
HALF_UP: 10.56
DOWN: 10.55
UP: 10.56
```

Isso mostra que o modo muda o resultado.

---

## compareTo versus equals

Esse é um ponto crítico.

Observe:

```java
BigDecimal primeiro = new BigDecimal("1.0");
BigDecimal segundo = new BigDecimal("1.00");
```

Numericamente, os dois representam o mesmo valor.

Mas:

```java
primeiro.equals(segundo)
```

retorna:

```text
false
```

Porque `equals` considera valor e scale.

Já:

```java
primeiro.compareTo(segundo)
```

retorna:

```text
0
```

Porque `compareTo` compara valor numérico.

Regra:

```text
para comparar valor monetário, geralmente use compareTo.
```

---

## Exemplo compareTo e equals

Arquivo:

```text
BigDecimalCompareToEquals.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalCompareToEquals {
    public static void main(String[] args) {
        BigDecimal primeiro = new BigDecimal("1.0");
        BigDecimal segundo = new BigDecimal("1.00");

        System.out.println("equals: " + primeiro.equals(segundo));
        System.out.println("compareTo: " + primeiro.compareTo(segundo));
        System.out.println("Mesmo valor numérico: " + (primeiro.compareTo(segundo) == 0));
    }
}
```

Saída:

```text
equals: false
compareTo: 0
Mesmo valor numérico: true
```

Esse exemplo precisa ficar muito claro.

---

## Comparações com compareTo

Padrões:

```java
valor.compareTo(BigDecimal.ZERO) == 0
valor.compareTo(BigDecimal.ZERO) > 0
valor.compareTo(BigDecimal.ZERO) < 0
valor.compareTo(limite) >= 0
valor.compareTo(limite) <= 0
```

Exemplo:

```java
if (valor.compareTo(BigDecimal.ZERO) > 0) {
    System.out.println("Valor positivo");
}
```

Não use:

```java
valor > BigDecimal.ZERO
```

Isso nem compila.

BigDecimal é objeto.

---

## Constantes úteis

BigDecimal tem constantes:

```java
BigDecimal.ZERO
BigDecimal.ONE
BigDecimal.TEN
```

Use:

```java
BigDecimal.ZERO
```

em vez de:

```java
new BigDecimal("0")
```

Arquivo:

```text
BigDecimalConstantes.java
```

Código:

```java
import java.math.BigDecimal;

public class BigDecimalConstantes {
    public static void main(String[] args) {
        System.out.println(BigDecimal.ZERO);
        System.out.println(BigDecimal.ONE);
        System.out.println(BigDecimal.TEN);
    }
}
```

---

## Dinheiro com BigDecimal

Exemplo de valor monetário:

```java
BigDecimal valor = new BigDecimal("99.90");
```

Boas práticas iniciais:

```text
criar com String ou valueOf;
definir scale quando necessário;
usar compareTo para comparar valor;
usar RoundingMode explícito em divisão;
não usar double diretamente;
não ignorar retorno das operações;
centralizar métodos de cálculo.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoBigDecimal {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", "199.90");

        System.out.println("Produto: " + produto.nome);
        System.out.println("Preço: " + produto.preco);
    }

    public static Produto criarProduto(String nome, String precoTexto) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.preco = new BigDecimal(precoTexto);

        return produto;
    }
}

class Produto {
    String nome;
    BigDecimal preco;
}
```

Esse exemplo é simples, mas ainda falta validação.

Vamos melhorar.

---

## Produto com validação

Arquivo:

```text
ProdutoBigDecimalValidado.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProdutoBigDecimalValidado {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", "199.905");

        System.out.println("Produto: " + produto.nome);
        System.out.println("Preço: " + produto.preco);
    }

    public static Produto criarProduto(String nome, String precoTexto) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }

        BigDecimal preco = converterDinheiro(precoTexto, "Preço");

        if (preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        Produto produto = new Produto();

        produto.nome = nome.trim();
        produto.preco = preco;

        return produto;
    }

    public static BigDecimal converterDinheiro(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        try {
            return new BigDecimal(texto.trim()).setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve ser decimal válido.");
        }
    }
}

class Produto {
    String nome;
    BigDecimal preco;
}
```

Saída:

```text
Preço: 199.91
```

Arredondamento definido explicitamente.

---

## Aplicação em pedido

Arquivo:

```text
PedidoBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoBigDecimal {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("Ana", "100.00", "15.50", "9.90");

        BigDecimal total = calcularTotal(pedido);

        System.out.println("Total: " + total);
    }

    public static Pedido criarPedido(String cliente, String subtotalTexto, String descontoTexto, String freteTexto) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.subtotal = dinheiro(subtotalTexto);
        pedido.desconto = dinheiro(descontoTexto);
        pedido.frete = dinheiro(freteTexto);

        return pedido;
    }

    public static BigDecimal calcularTotal(Pedido pedido) {
        BigDecimal total = pedido.subtotal
                .subtract(pedido.desconto)
                .add(pedido.frete);

        return total.setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal dinheiro(String texto) {
        return new BigDecimal(texto).setScale(2, RoundingMode.HALF_UP);
    }
}

class Pedido {
    String cliente;
    BigDecimal subtotal;
    BigDecimal desconto;
    BigDecimal frete;
}
```

Cálculo:

```text
100.00 - 15.50 + 9.90 = 94.40
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PagamentoBigDecimal {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("100.00");

        BigDecimal parcela = calcularParcela(valor, 3);

        System.out.println("Parcela: " + parcela);
    }

    public static BigDecimal calcularParcela(BigDecimal valor, int parcelas) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        if (parcelas <= 0) {
            throw new IllegalArgumentException("Parcelas deve ser maior que zero.");
        }

        return valor.divide(BigDecimal.valueOf(parcelas), 2, RoundingMode.HALF_UP);
    }
}
```

Saída:

```text
Parcela: 33.33
```

Atenção:

```text
3 parcelas de 33.33 somam 99.99.
```

Rateio correto de centavos exige regra adicional.

Veremos a seguir um exemplo didático.

---

## Rateio simples de centavos

Em dinheiro, dividir pode gerar sobra.

Exemplo:

```text
100.00 / 3 = 33.33 + 33.33 + 33.34
```

Uma estratégia simples:

```text
converter para centavos;
dividir inteiro;
distribuir resto.
```

Arquivo:

```text
RateioCentavos.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class RateioCentavos {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("100.00");

        BigDecimal[] parcelas = ratear(valor, 3);

        for (int indice = 0; indice < parcelas.length; indice++) {
            System.out.println("Parcela " + (indice + 1) + ": " + parcelas[indice]);
        }
    }

    public static BigDecimal[] ratear(BigDecimal valor, int quantidadeParcelas) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        if (quantidadeParcelas <= 0) {
            throw new IllegalArgumentException("Quantidade de parcelas deve ser maior que zero.");
        }

        long centavos = valor.movePointRight(2)
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        long valorBase = centavos / quantidadeParcelas;
        long resto = centavos % quantidadeParcelas;

        BigDecimal[] parcelas = new BigDecimal[quantidadeParcelas];

        for (int indice = 0; indice < parcelas.length; indice++) {
            long centavosParcela = valorBase;

            if (indice < resto) {
                centavosParcela++;
            }

            parcelas[indice] = BigDecimal.valueOf(centavosParcela, 2);
        }

        return parcelas;
    }
}
```

Saída:

```text
Parcela 1: 33.34
Parcela 2: 33.33
Parcela 3: 33.33
```

Esse exemplo mostra que dinheiro exige regra.

---

## Aplicação em comissão

Arquivo:

```text
ComissaoBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ComissaoBigDecimal {
    public static void main(String[] args) {
        BigDecimal valorVenda = new BigDecimal("1000.00");
        BigDecimal percentual = new BigDecimal("7.5");

        BigDecimal comissao = calcularComissao(valorVenda, percentual);

        System.out.println("Comissão: " + comissao);
    }

    public static BigDecimal calcularComissao(BigDecimal valorVenda, BigDecimal percentual) {
        if (valorVenda == null || percentual == null) {
            throw new IllegalArgumentException("Valor e percentual são obrigatórios.");
        }

        BigDecimal taxa = percentual.divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP);

        return valorVenda.multiply(taxa).setScale(2, RoundingMode.HALF_UP);
    }
}
```

Resultado:

```text
Comissão: 75.00
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class OrdemServicoBigDecimal {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "120.00", "35.50");

        BigDecimal custoTotal = calcularCustoTotal(os);

        System.out.println("OS: " + os.certificado);
        System.out.println("Custo total: " + custoTotal);
    }

    public static OrdemServico criarOs(String certificado, String custoTecnicoTexto, String custoPecaTexto) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.custoTecnico = dinheiro(custoTecnicoTexto);
        os.custoPeca = dinheiro(custoPecaTexto);

        return os;
    }

    public static BigDecimal calcularCustoTotal(OrdemServico os) {
        return os.custoTecnico.add(os.custoPeca).setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal dinheiro(String texto) {
        return new BigDecimal(texto).setScale(2, RoundingMode.HALF_UP);
    }
}

class OrdemServico {
    String certificado;
    BigDecimal custoTecnico;
    BigDecimal custoPeca;
}
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class MensageriaBigDecimal {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "0.35", 12);

        BigDecimal custo = calcularCusto(mensagem);

        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Custo total: " + custo);
    }

    public static Mensagem criarMensagem(String cliente, String custoUnitarioTexto, int quantidade) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.custoUnitario = new BigDecimal(custoUnitarioTexto).setScale(2, RoundingMode.HALF_UP);
        mensagem.quantidade = quantidade;

        return mensagem;
    }

    public static BigDecimal calcularCusto(Mensagem mensagem) {
        return mensagem.custoUnitario
                .multiply(BigDecimal.valueOf(mensagem.quantidade))
                .setScale(2, RoundingMode.HALF_UP);
    }
}

class Mensagem {
    String cliente;
    BigDecimal custoUnitario;
    int quantidade;
}
```

Exemplo de uso:

```text
mensagens enviadas * custo unitário.
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class AuditoriaBigDecimal {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "ALTERACAO_VALOR", "99.995");

        System.out.println("Usuário: " + registro.usuario);
        System.out.println("Operação: " + registro.operacao);
        System.out.println("Valor auditado: " + registro.valorAuditado);
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao, String valorTexto) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.valorAuditado = new BigDecimal(valorTexto).setScale(2, RoundingMode.HALF_UP);

        return registro;
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    BigDecimal valorAuditado;
}
```

Saída:

```text
Valor auditado: 100.00
```

Mostra arredondamento explícito em valor registrado.

---

## Refatoração: centralizar dinheiro

Código repetido:

```java
new BigDecimal(texto).setScale(2, RoundingMode.HALF_UP)
```

Refatoração:

```java
public static BigDecimal dinheiro(String texto) {
    if (texto == null || texto.isBlank()) {
        throw new IllegalArgumentException("Valor monetário é obrigatório.");
    }

    try {
        return new BigDecimal(texto.trim()).setScale(2, RoundingMode.HALF_UP);
    } catch (NumberFormatException erro) {
        throw new IllegalArgumentException("Valor monetário inválido.");
    }
}
```

Benefícios:

```text
padroniza criação;
padroniza escala;
padroniza arredondamento;
centraliza mensagem;
evita duplicação;
facilita manutenção.
```

---

## Refatoração: método para valor positivo

Código repetido:

```java
if (valor.compareTo(BigDecimal.ZERO) <= 0) {
    throw new IllegalArgumentException("Valor deve ser maior que zero.");
}
```

Refatoração:

```java
public static void validarPositivo(BigDecimal valor, String nomeCampo) {
    if (valor == null) {
        throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
    }

    if (valor.compareTo(BigDecimal.ZERO) <= 0) {
        throw new IllegalArgumentException(nomeCampo + " deve ser maior que zero.");
    }
}
```

Isso melhora leitura.

---

## Classe utilitária didática

Arquivo:

```text
DinheiroUtil.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class DinheiroUtil {
    public static void main(String[] args) {
        BigDecimal valor = dinheiro("10.567");

        validarPositivo(valor, "Valor");

        System.out.println(valor);
    }

    public static BigDecimal dinheiro(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Valor monetário é obrigatório.");
        }

        try {
            return new BigDecimal(texto.trim()).setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Valor monetário inválido.");
        }
    }

    public static void validarPositivo(BigDecimal valor, String nomeCampo) {
        if (valor == null) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório.");
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(nomeCampo + " deve ser maior que zero.");
        }
    }
}
```

Por enquanto é uma classe simples.

No futuro, utilitários serão organizados melhor em pacotes.

---

## Erros comuns

### Erro 1 — Usar new BigDecimal(double)

Evite:

```java
new BigDecimal(0.1)
```

Prefira:

```java
new BigDecimal("0.1")
```

ou:

```java
BigDecimal.valueOf(0.1)
```

---

### Erro 2 — Ignorar retorno das operações

BigDecimal é imutável.

Errado:

```java
valor.add(outro);
```

Certo:

```java
valor = valor.add(outro);
```

---

### Erro 3 — Dividir sem arredondamento

```java
total.divide(parcelas)
```

pode quebrar se a divisão não terminar.

Use:

```java
total.divide(parcelas, 2, RoundingMode.HALF_UP)
```

quando a regra permitir.

---

### Erro 4 — Comparar com equals quando queria comparar valor

```java
new BigDecimal("1.0").equals(new BigDecimal("1.00"))
```

retorna `false`.

Para valor numérico:

```java
compareTo
```

---

### Erro 5 — Não definir escala para dinheiro

Dinheiro normalmente precisa de escala clara, como 2 casas.

---

### Erro 6 — Usar RoundingMode no chute

Arredondamento é regra de negócio.

---

### Erro 7 — Usar double para dinheiro e depois tentar corrigir

Se o valor já veio impreciso, pode ser tarde.

---

### Erro 8 — Usar BigDecimal sem validar null

BigDecimal é objeto.

Pode ser null.

---

### Erro 9 — Converter BigDecimal para double sem necessidade

Pode perder precisão.

---

### Erro 10 — Achar que parcela arredondada sempre fecha total

`100.00 / 3 = 33.33`.

Três parcelas dão `99.99`.

Rateio precisa de regra.

---

## Diagnóstico de BigDecimal

Quando houver erro ou diferença, pergunte:

### 1. Como o BigDecimal foi criado?

Perigoso:

```java
new BigDecimal(double)
```

Seguro:

```java
new BigDecimal("10.50")
BigDecimal.valueOf(10.50)
```

### 2. A operação capturou o retorno?

BigDecimal é imutável.

### 3. A divisão tem escala e RoundingMode?

Se não, pode quebrar.

### 4. Está usando equals?

Talvez precise `compareTo`.

### 5. A scale está correta?

Use:

```java
valor.scale()
```

### 6. O valor pode ser null?

Valide.

### 7. O arredondamento está definido pela regra?

Não escolha por chute.

### 8. O total de parcelas fecha?

Se não, precisa rateio.

### 9. Está usando double em algum ponto?

Investigue.

### 10. Use debug

Veja valor, scale e resultado após cada operação.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class DebugBigDecimal {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("10.00");
        BigDecimal parcelas = new BigDecimal("3");

        BigDecimal valorParcela = total.divide(parcelas, 2, RoundingMode.HALF_UP);

        System.out.println(valorParcela);
    }
}
```

Coloque breakpoint em:

```java
BigDecimal valorParcela = total.divide(parcelas, 2, RoundingMode.HALF_UP);
```

Observe:

```text
total = 10.00;
parcelas = 3;
scale do resultado = 2;
valor = 3.33.
```

Depois debugue:

```java
BigDecimal primeiro = new BigDecimal("1.0");
BigDecimal segundo = new BigDecimal("1.00");
```

Teste:

```java
primeiro.equals(segundo)
primeiro.compareTo(segundo)
primeiro.scale()
segundo.scale()
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — new BigDecimal(double)

```java
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal(0.1);

        System.out.println(valor);
    }
}
```

Explique o resultado.

---

### Teste 2 — Ignorar retorno

```java
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("10.00");

        valor.add(new BigDecimal("5.00"));

        System.out.println(valor);
    }
}
```

Explique por que continua `10.00`.

---

### Teste 3 — Divisão sem arredondamento

```java
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("10.00");
        BigDecimal parcelas = new BigDecimal("3");

        System.out.println(total.divide(parcelas));
    }
}
```

Explique `ArithmeticException`.

---

### Teste 4 — equals versus compareTo

```java
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("1.0");
        BigDecimal b = new BigDecimal("1.00");

        System.out.println(a.equals(b));
        System.out.println(a.compareTo(b) == 0);
    }
}
```

Explique a diferença.

---

### Teste 5 — Parcela que não fecha total

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class Main {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("100.00");

        BigDecimal parcela = total.divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);

        System.out.println(parcela);
        System.out.println(parcela.multiply(new BigDecimal("3")));
    }
}
```

Explique por que o total não fecha.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-072-bigdecimal-desde-a-base
cd labs\m2\aula-072-bigdecimal-desde-a-base
```

Crie arquivos:

```text
Main.java
BigDecimalDoublePerigoso.java
BigDecimalStringSeguro.java
BigDecimalValueOfSeguro.java
BigDecimalImutavel.java
BigDecimalSoma.java
BigDecimalSubtracao.java
BigDecimalMultiplicacao.java
BigDecimalDivisaoExata.java
BigDecimalDivisaoNaoExata.java
BigDecimalDivisaoComRounding.java
BigDecimalScale.java
BigDecimalSetScale.java
BigDecimalRoundingModes.java
BigDecimalCompareToEquals.java
BigDecimalConstantes.java
ProdutoBigDecimal.java
ProdutoBigDecimalValidado.java
PedidoBigDecimal.java
PagamentoBigDecimal.java
RateioCentavos.java
ComissaoBigDecimal.java
OrdemServicoBigDecimal.java
MensageriaBigDecimal.java
AuditoriaBigDecimal.java
DinheiroUtil.java
DebugBigDecimal.java
ErroBigDecimalDouble.java
ErroBigDecimalImutavel.java
ErroBigDecimalDivide.java
ErroBigDecimalEquals.java
ErroRateioParcela.java
README.md
```

Compile:

```powershell
javac Main.java
javac BigDecimalDoublePerigoso.java
javac BigDecimalStringSeguro.java
javac BigDecimalValueOfSeguro.java
javac BigDecimalImutavel.java
javac BigDecimalSoma.java
javac BigDecimalSubtracao.java
javac BigDecimalMultiplicacao.java
javac BigDecimalDivisaoExata.java
javac BigDecimalDivisaoNaoExata.java
javac BigDecimalDivisaoComRounding.java
javac BigDecimalScale.java
javac BigDecimalSetScale.java
javac BigDecimalRoundingModes.java
javac BigDecimalCompareToEquals.java
javac BigDecimalConstantes.java
javac ProdutoBigDecimal.java
javac ProdutoBigDecimalValidado.java
javac PedidoBigDecimal.java
javac PagamentoBigDecimal.java
javac RateioCentavos.java
javac ComissaoBigDecimal.java
javac OrdemServicoBigDecimal.java
javac MensageriaBigDecimal.java
javac AuditoriaBigDecimal.java
javac DinheiroUtil.java
javac DebugBigDecimal.java
javac ErroBigDecimalDouble.java
javac ErroBigDecimalImutavel.java
javac ErroBigDecimalDivide.java
javac ErroBigDecimalEquals.java
javac ErroRateioParcela.java
```

Execute os exemplos válidos:

```powershell
java Main
java BigDecimalDoublePerigoso
java BigDecimalStringSeguro
java BigDecimalValueOfSeguro
java BigDecimalImutavel
java BigDecimalSoma
java BigDecimalSubtracao
java BigDecimalMultiplicacao
java BigDecimalDivisaoExata
java BigDecimalDivisaoComRounding
java BigDecimalScale
java BigDecimalSetScale
java BigDecimalRoundingModes
java BigDecimalCompareToEquals
java BigDecimalConstantes
java ProdutoBigDecimal
java ProdutoBigDecimalValidado
java PedidoBigDecimal
java PagamentoBigDecimal
java RateioCentavos
java ComissaoBigDecimal
java OrdemServicoBigDecimal
java MensageriaBigDecimal
java AuditoriaBigDecimal
java DinheiroUtil
java DebugBigDecimal
```

Execute os de erro proposital separadamente:

```powershell
java BigDecimalDivisaoNaoExata
java ErroBigDecimalDouble
java ErroBigDecimalImutavel
java ErroBigDecimalDivide
java ErroBigDecimalEquals
java ErroRateioParcela
```

Alguns devem quebrar ou demonstrar comportamento perigoso.

Use para diagnóstico e anotação no diário.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 072 — BigDecimal desde a base

## Objetivo

Entender por que `double` não é ideal para dinheiro, como criar `BigDecimal` corretamente, como operar, comparar, arredondar, controlar escala e aplicar em cálculos monetários simples.

## Conceitos

- `BigDecimal` representa decimal com precisão controlada.
- Evitar `new BigDecimal(double)`.
- Preferir `new BigDecimal("10.50")` ou `BigDecimal.valueOf`.
- `BigDecimal` é imutável.
- Operações retornam novo `BigDecimal`.
- `add` soma.
- `subtract` subtrai.
- `multiply` multiplica.
- `divide` precisa de cuidado.
- Divisão não exata precisa de escala e `RoundingMode`.
- `scale` representa casas decimais.
- `setScale` ajusta escala.
- `compareTo` compara valor numérico.
- `equals` compara valor e escala.
- Para dinheiro, normalmente definir 2 casas decimais.
- Arredondamento deve seguir regra de negócio.
- Rateio de parcelas pode exigir tratamento de centavos.

## Comandos

```powershell
javac Main.java
java Main
javac BigDecimalCompareToEquals.java
java BigDecimalCompareToEquals
javac RateioCentavos.java
java RateioCentavos
```

## Observações

- Não usar `double` para dinheiro sem critério.
- Não ignorar retorno das operações.
- Não dividir sem regra de arredondamento.
- Não comparar valor monetário com `equals` sem entender escala.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver valor e scale |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar operações |
| Variables | janela Debug | Ver BigDecimal |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `compareTo`, `scale`, `setScale` |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Centralizar dinheiro |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 072 — BigDecimal desde a base

### O que aprendi
Aprendi que `double` pode gerar imprecisão decimal e que `BigDecimal` é a classe adequada para cálculos monetários com precisão controlada. Também aprendi a criar `BigDecimal` corretamente, operar, arredondar, controlar escala e comparar valores.

### O que pratiquei
Criei exemplos com `new BigDecimal("...")`, `BigDecimal.valueOf`, soma, subtração, multiplicação, divisão exata, divisão com arredondamento, `setScale`, `RoundingMode`, `compareTo`, `equals`, rateio de centavos e aplicações em produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- BigDecimal
- precisão decimal
- scale
- RoundingMode
- HALF_UP
- setScale
- add
- subtract
- multiply
- divide
- compareTo
- equals
- BigDecimal.ZERO
- BigDecimal.ONE
- BigDecimal.TEN
- imutabilidade
- dinheiro
- centavos
- rateio
- ArithmeticException
- NumberFormatException
- valueOf
- new BigDecimal(String)
- evitar new BigDecimal(double)

### Arquivos criados
- `labs/m2/aula-072-bigdecimal-desde-a-base/Main.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalDoublePerigoso.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalStringSeguro.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalValueOfSeguro.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalImutavel.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalSoma.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalSubtracao.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalMultiplicacao.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalDivisaoExata.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalDivisaoNaoExata.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalDivisaoComRounding.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalScale.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalSetScale.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalRoundingModes.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalCompareToEquals.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/BigDecimalConstantes.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ProdutoBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ProdutoBigDecimalValidado.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/PedidoBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/PagamentoBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/RateioCentavos.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ComissaoBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/OrdemServicoBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/MensageriaBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/AuditoriaBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/DinheiroUtil.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/DebugBigDecimal.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ErroBigDecimalDouble.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ErroBigDecimalImutavel.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ErroBigDecimalDivide.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ErroBigDecimalEquals.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/ErroRateioParcela.java`
- `labs/m2/aula-072-bigdecimal-desde-a-base/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac BigDecimalDivisaoComRounding.java
java BigDecimalDivisaoComRounding
javac BigDecimalCompareToEquals.java
java BigDecimalCompareToEquals
javac RateioCentavos.java
java RateioCentavos
```

### Erros que quero evitar
- usar `new BigDecimal(double)`;
- ignorar retorno das operações;
- dividir sem arredondamento;
- comparar com `equals` quando queria comparar valor;
- não definir escala para dinheiro;
- usar `RoundingMode` no chute;
- usar `double` para dinheiro e tentar corrigir depois;
- usar `BigDecimal` sem validar null;
- converter `BigDecimal` para `double` sem necessidade;
- achar que parcela arredondada sempre fecha total.

### Próximo passo
Estudar Locale, NumberFormat e formatação.
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
git add labs/m2/aula-072-bigdecimal-desde-a-base docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 072: pratica BigDecimal desde a base em Java"
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
1. Por que double pode ser ruim para dinheiro?
2. O que é BigDecimal?
3. Qual pacote precisa importar para BigDecimal?
4. Por que evitar new BigDecimal(double)?
5. Qual a diferença entre new BigDecimal("0.1") e new BigDecimal(0.1)?
6. Para que serve BigDecimal.valueOf?
7. BigDecimal é mutável ou imutável?
8. O que acontece se eu chamar add e ignorar o retorno?
9. Para que serve add?
10. Para que serve subtract?
11. Para que serve multiply?
12. Qual o risco do divide?
13. Para que serve RoundingMode?
14. O que é scale?
15. Para que serve setScale?
16. Qual a diferença entre equals e compareTo?
17. Como verificar se BigDecimal é maior que zero?
18. Por que parcelas podem não fechar total?
19. Como converter valor em centavos para BigDecimal?
20. Por que arredondamento precisa vir da regra de negócio?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar por que double pode ser impreciso;
explicar BigDecimal;
importar java.math.BigDecimal;
criar BigDecimal com String;
criar BigDecimal com valueOf;
evitar new BigDecimal(double);
explicar imutabilidade de BigDecimal;
usar add;
usar subtract;
usar multiply;
usar divide exato;
provocar erro em divide não exato;
corrigir divide com escala e RoundingMode;
usar setScale;
explicar scale;
usar RoundingMode.HALF_UP;
comparar BigDecimal com compareTo;
explicar problema do equals;
usar BigDecimal.ZERO;
validar valor positivo;
criar método dinheiro;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em comissão;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
ratear centavos de forma simples;
debugar valor e scale;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `MathContext`.

Não precisa ainda dominar todos os `RoundingMode`.

Não precisa ainda dominar formatação monetária com locale.

Não precisa ainda dominar JPA com BigDecimal.

Não precisa ainda dominar serialização JSON de BigDecimal.

Não precisa ainda dominar regras contábeis reais.

Esses assuntos virão depois.

O objetivo é dominar a base de criação, operação, escala, arredondamento e comparação de `BigDecimal`.

---

## Fechamento da aula

Hoje estudamos `BigDecimal` desde a base.

A ideia central foi:

```text
para dinheiro e decimais de negócio, BigDecimal dá controle que double não oferece.
```

Vimos que:

```text
double pode ter imprecisão decimal;
new BigDecimal(double) é perigoso;
new BigDecimal(String) é seguro para texto decimal válido;
BigDecimal.valueOf é alternativa útil;
BigDecimal é imutável;
operações retornam novo objeto;
divide pode exigir RoundingMode;
scale representa casas decimais;
setScale ajusta escala;
compareTo compara valor;
equals compara valor e escala;
dinheiro exige arredondamento definido por regra;
parcelamento pode exigir rateio de centavos.
```

O ponto mais importante é:

```text
BigDecimal resolve precisão técnica, mas a regra de arredondamento e rateio continua sendo decisão de negócio.
```

Na próxima aula, vamos estudar:

```text
Locale, NumberFormat e formatação.
```

A próxima aula vai explicar como apresentar números, moedas e percentuais de acordo com localidade, separador decimal, separador de milhar e padrões de exibição.
