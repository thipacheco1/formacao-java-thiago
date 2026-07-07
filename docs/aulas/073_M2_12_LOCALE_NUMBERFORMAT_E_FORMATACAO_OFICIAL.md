# 073 — M2.12 — Locale, NumberFormat e Formatação

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
069 — M2.08 — Wrappers e autoboxing;
070 — M2.09 — Conversões e casting;
071 — M2.10 — Math, Random e números utilitários;
072 — M2.11 — BigDecimal desde a base;
073 — M2.12 — Locale, NumberFormat e formatação.
```

Na aula anterior, estudamos `BigDecimal`.

Vimos que ele é importante para valores monetários porque permite trabalhar com precisão decimal, escala e arredondamento controlado.

Agora vamos estudar um problema diferente:

```text
como exibir e ler números de acordo com a localidade.
```

Exemplo:

```text
Brasil:       R$ 1.234,56
Estados Unidos: $1,234.56
```

O valor pode ser o mesmo.

A apresentação muda.

Isso envolve:

```text
Locale;
NumberFormat;
moeda;
decimal;
porcentagem;
separador de milhar;
separador decimal;
entrada e saída de dados.
```

---

## A pergunta central da aula

Observe:

```java
BigDecimal valor = new BigDecimal("1234.56");
```

Esse valor representa:

```text
mil duzentos e trinta e quatro reais e cinquenta e seis centavos.
```

Mas como mostrar isso para uma pessoa no Brasil?

```text
R$ 1.234,56
```

E para uma pessoa nos Estados Unidos?

```text
$1,234.56
```

Se você simplesmente fizer:

```java
System.out.println(valor);
```

a saída será:

```text
1234.56
```

Isso é bom para cálculo, debug técnico e persistência em formato controlado.

Mas não é a melhor apresentação para usuário final.

Para apresentação, usamos formatação.

Em Java, uma forma clássica de fazer isso é com:

```java
Locale
NumberFormat
```

---

## Cálculo não é apresentação

Essa separação é muito importante.

### Cálculo

Para cálculo monetário, usamos:

```java
BigDecimal
```

Exemplo:

```java
BigDecimal total = subtotal.add(frete).subtract(desconto);
```

### Apresentação

Para mostrar para usuário, usamos:

```java
NumberFormat
```

Exemplo:

```java
NumberFormat formato = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR"));
String texto = formato.format(total);
```

Resultado:

```text
R$ 1.234,56
```

Regra profissional:

```text
não calcule usando texto formatado;
não persista moeda formatada como valor numérico;
formate apenas na borda de exibição.
```

---

## O que é Locale

`Locale` representa uma localidade.

Uma localidade combina informações como:

```text
idioma;
país/região;
convenções de escrita;
formato de número;
formato de moeda;
formato de data;
separadores;
símbolos.
```

Exemplos:

```java
Locale brasil = Locale.forLanguageTag("pt-BR");
Locale estadosUnidos = Locale.US;
Locale franca = Locale.FRANCE;
```

`pt-BR` significa:

```text
português do Brasil.
```

`en-US` significa:

```text
inglês dos Estados Unidos.
```

Locale não é apenas idioma.

É convenção regional.

Português de Portugal e português do Brasil podem ter diferenças.

---

## O que é NumberFormat

`NumberFormat` é uma classe usada para formatar e interpretar números conforme uma localidade.

Import:

```java
import java.text.NumberFormat;
```

Usos principais:

```java
NumberFormat.getCurrencyInstance(locale)
NumberFormat.getNumberInstance(locale)
NumberFormat.getPercentInstance(locale)
```

Exemplo:

```java
Locale brasil = Locale.forLanguageTag("pt-BR");

NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

String texto = moeda.format(1234.56);
```

Resultado aproximado:

```text
R$ 1.234,56
```

---

## Vocabulário essencial

Termos desta aula:

```text
Locale;
NumberFormat;
Currency;
moeda;
número;
percentual;
formatação;
parse;
parsing;
pt-BR;
en-US;
separador decimal;
separador de milhar;
vírgula;
ponto;
símbolo monetário;
casas decimais;
mínimo de casas;
máximo de casas;
BigDecimal;
Double;
Number;
ParseException;
entrada;
saída;
exibição;
persistência;
normalização;
localidade;
internacionalização;
i18n.
```

Termos mais importantes:

```text
Locale -> representa idioma/região e suas convenções;
NumberFormat -> formata ou interpreta números conforme Locale;
getCurrencyInstance -> formato monetário;
getNumberInstance -> formato numérico geral;
getPercentInstance -> formato percentual;
format -> transforma número em texto;
parse -> transforma texto em Number;
separador decimal -> caractere que separa parte inteira da decimal;
separador de milhar -> caractere que agrupa milhares;
i18n -> internacionalização.
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formatoMoeda = NumberFormat.getCurrencyInstance(brasil);

        String valorFormatado = formatoMoeda.format(1234.56);

        System.out.println(valorFormatado);
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
R$ 1.234,56
```

Pode haver pequena variação de espaço dependendo da versão e configuração da JVM, mas o padrão brasileiro deve usar:

```text
R$
ponto como separador de milhar
vírgula como separador decimal
```

---

## Formatando moeda em pt-BR e en-US

Arquivo:

```text
MoedaBrasilEstadosUnidos.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class MoedaBrasilEstadosUnidos {
    public static void main(String[] args) {
        double valor = 1234.56;

        Locale brasil = Locale.forLanguageTag("pt-BR");
        Locale estadosUnidos = Locale.US;

        NumberFormat formatoBrasil = NumberFormat.getCurrencyInstance(brasil);
        NumberFormat formatoEstadosUnidos = NumberFormat.getCurrencyInstance(estadosUnidos);

        System.out.println("Brasil: " + formatoBrasil.format(valor));
        System.out.println("EUA: " + formatoEstadosUnidos.format(valor));
    }
}
```

Saída esperada:

```text
Brasil: R$ 1.234,56
EUA: $1,234.56
```

O valor é o mesmo.

A exibição muda.

---

## Formatação com BigDecimal

`NumberFormat.format` aceita `Object` ou números.

Podemos passar `BigDecimal`.

Arquivo:

```text
MoedaComBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class MoedaComBigDecimal {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("1234.56");

        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formatoMoeda = NumberFormat.getCurrencyInstance(brasil);

        System.out.println(formatoMoeda.format(valor));
    }
}
```

Saída esperada:

```text
R$ 1.234,56
```

Regra:

```text
BigDecimal para cálculo;
NumberFormat para apresentação.
```

---

## Formatação de número comum

Moeda inclui símbolo monetário.

Número comum não.

Arquivo:

```text
NumeroFormatado.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class NumeroFormatado {
    public static void main(String[] args) {
        double valor = 1234567.89;

        Locale brasil = Locale.forLanguageTag("pt-BR");
        Locale estadosUnidos = Locale.US;

        NumberFormat formatoBrasil = NumberFormat.getNumberInstance(brasil);
        NumberFormat formatoEstadosUnidos = NumberFormat.getNumberInstance(estadosUnidos);

        System.out.println("Brasil: " + formatoBrasil.format(valor));
        System.out.println("EUA: " + formatoEstadosUnidos.format(valor));
    }
}
```

Saída esperada:

```text
Brasil: 1.234.567,89
EUA: 1,234,567.89
```

No Brasil:

```text
ponto separa milhar;
vírgula separa decimal.
```

Nos Estados Unidos:

```text
vírgula separa milhar;
ponto separa decimal.
```

---

## Formatação de percentual

Arquivo:

```text
PercentualFormatado.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class PercentualFormatado {
    public static void main(String[] args) {
        double taxa = 0.075;

        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formatoPercentual = NumberFormat.getPercentInstance(brasil);

        System.out.println(formatoPercentual.format(taxa));
    }
}
```

Saída típica:

```text
8%
```

Por quê?

Porque o formato percentual multiplica por 100 e arredonda conforme configuração padrão.

Se quiser casas decimais, configure.

---

## Configurando casas decimais em percentual

Arquivo:

```text
PercentualComCasas.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class PercentualComCasas {
    public static void main(String[] args) {
        double taxa = 0.075;

        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formatoPercentual = NumberFormat.getPercentInstance(brasil);

        formatoPercentual.setMinimumFractionDigits(2);
        formatoPercentual.setMaximumFractionDigits(2);

        System.out.println(formatoPercentual.format(taxa));
    }
}
```

Saída esperada:

```text
7,50%
```

Esse ponto é muito importante:

```text
0.075 representa 7,5%.
```

---

## Configurando casas decimais em número

Arquivo:

```text
NumeroComCasas.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class NumeroComCasas {
    public static void main(String[] args) {
        double valor = 1234.5;

        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formato = NumberFormat.getNumberInstance(brasil);

        formato.setMinimumFractionDigits(2);
        formato.setMaximumFractionDigits(2);

        System.out.println(formato.format(valor));
    }
}
```

Saída esperada:

```text
1.234,50
```

`setMinimumFractionDigits(2)` garante duas casas.

`setMaximumFractionDigits(2)` limita a duas casas.

---

## Minimum versus Maximum Fraction Digits

Exemplo:

```java
formato.setMinimumFractionDigits(2);
formato.setMaximumFractionDigits(4);
```

Significa:

```text
mostrar no mínimo 2 casas;
mostrar no máximo 4 casas.
```

Arquivo:

```text
MinMaxFractionDigits.java
```

Código:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class MinMaxFractionDigits {
    public static void main(String[] args) {
        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formato = NumberFormat.getNumberInstance(brasil);

        formato.setMinimumFractionDigits(2);
        formato.setMaximumFractionDigits(4);

        System.out.println(formato.format(10));
        System.out.println(formato.format(10.5));
        System.out.println(formato.format(10.56789));
    }
}
```

Saída esperada:

```text
10,00
10,50
10,5679
```

A última foi arredondada para 4 casas.

---

## Formatação não deve alterar o valor original

Formatar gera texto.

Exemplo:

```java
BigDecimal valor = new BigDecimal("10.567");
String texto = formato.format(valor);
```

`texto` pode ser:

```text
10,57
```

Mas `valor` continua:

```text
10.567
```

Formatação é saída.

Se a regra de negócio exige arredondar valor, isso deve ser feito com `BigDecimal.setScale`.

Não confunda:

```text
arredondamento para exibição;
arredondamento de regra de negócio.
```

---

## Locale padrão da máquina

Java pode usar o Locale padrão do ambiente.

Exemplo:

```java
Locale localePadrao = Locale.getDefault();
```

Arquivo:

```text
LocalePadrao.java
```

Código:

```java
import java.util.Locale;

public class LocalePadrao {
    public static void main(String[] args) {
        Locale padrao = Locale.getDefault();

        System.out.println("Locale padrão: " + padrao);
        System.out.println("Idioma: " + padrao.getLanguage());
        System.out.println("País: " + padrao.getCountry());
    }
}
```

A saída depende da máquina.

Por isso, em sistemas que precisam comportamento previsível, informe o Locale explicitamente.

Regra:

```text
não dependa do Locale padrão quando a regra exige um formato específico.
```

---

## Problema clássico: vírgula e ponto

No Brasil, usuário pode digitar:

```text
1.234,56
```

Em formato técnico Java simples, `BigDecimal` espera:

```text
1234.56
```

Se você fizer:

```java
new BigDecimal("1.234,56")
```

vai dar erro.

Se fizer:

```java
new BigDecimal("1234,56")
```

também vai dar erro.

Para ler texto formatado conforme localidade, usamos parsing com `NumberFormat`.

---

## Parse com NumberFormat

Arquivo:

```text
ParseNumeroBrasil.java
```

Código:

```java
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

public class ParseNumeroBrasil {
    public static void main(String[] args) throws ParseException {
        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formato = NumberFormat.getNumberInstance(brasil);

        Number numero = formato.parse("1.234,56");

        System.out.println(numero);
        System.out.println(numero.doubleValue());
    }
}
```

Saída aproximada:

```text
1234.56
1234.56
```

Atenção:

```text
parse retorna Number;
não retorna BigDecimal diretamente.
```

Para dinheiro com precisão, precisamos cuidado adicional.

---

## Parse de moeda brasileira

Arquivo:

```text
ParseMoedaBrasil.java
```

Código:

```java
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

public class ParseMoedaBrasil {
    public static void main(String[] args) throws ParseException {
        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formatoMoeda = NumberFormat.getCurrencyInstance(brasil);

        Number numero = formatoMoeda.parse("R$ 1.234,56");

        System.out.println(numero);
    }
}
```

Saída aproximada:

```text
1234.56
```

Parsing de moeda pode variar conforme espaços e símbolo.

Para entrada crítica de dinheiro, o ideal é controlar o formato aceito.

---

## Parse com tratamento de erro

Arquivo:

```text
ParseComTratamento.java
```

Código:

```java
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

public class ParseComTratamento {
    public static void main(String[] args) {
        Double valor = tentarLerNumeroBrasil("1.234,56");

        if (valor == null) {
            System.out.println("Número inválido.");
        } else {
            System.out.println("Valor: " + valor);
        }
    }

    public static Double tentarLerNumeroBrasil(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        try {
            Locale brasil = Locale.forLanguageTag("pt-BR");
            NumberFormat formato = NumberFormat.getNumberInstance(brasil);

            Number numero = formato.parse(texto.trim());

            return numero.doubleValue();
        } catch (ParseException erro) {
            return null;
        }
    }
}
```

Esse exemplo é didático.

Para dinheiro, vamos preferir transformar em `BigDecimal` com cuidado.

---

## Convertendo texto brasileiro para BigDecimal

Uma estratégia simples para entrada controlada brasileira:

```text
remover separador de milhar;
trocar vírgula decimal por ponto;
criar BigDecimal.
```

Exemplo:

```text
1.234,56 -> 1234.56
```

Arquivo:

```text
TextoBrasilParaBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class TextoBrasilParaBigDecimal {
    public static void main(String[] args) {
        BigDecimal valor = converterMoedaBrasil("1.234,56");

        System.out.println(valor);
    }

    public static BigDecimal converterMoedaBrasil(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        String normalizado = texto.trim()
                .replace(".", "")
                .replace(",", ".");

        try {
            return new BigDecimal(normalizado).setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Valor monetário inválido.");
        }
    }
}
```

Isso é útil para entrada controlada.

Mas cuidado:

```text
não aceite qualquer texto sem validação;
não remova caracteres sem entender o formato;
símbolo R$, espaços e valores negativos exigem regra adicional.
```

---

## Convertendo BigDecimal para texto brasileiro

Arquivo:

```text
BigDecimalParaTextoBrasil.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class BigDecimalParaTextoBrasil {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("1234.56");

        String texto = formatarMoedaBrasil(valor);

        System.out.println(texto);
    }

    public static String formatarMoedaBrasil(BigDecimal valor) {
        if (valor == null) {
            return "R$ 0,00";
        }

        Locale brasil = Locale.forLanguageTag("pt-BR");

        NumberFormat formato = NumberFormat.getCurrencyInstance(brasil);

        return formato.format(valor);
    }
}
```

Esse método formata para exibição.

Não use o retorno para cálculo.

---

## NumberFormat é mutável

Quando fazemos:

```java
formato.setMinimumFractionDigits(2);
formato.setMaximumFractionDigits(2);
```

estamos alterando a configuração daquele objeto `NumberFormat`.

Isso significa que `NumberFormat` é mutável.

Além disso, `NumberFormat` não deve ser compartilhado de qualquer jeito entre múltiplas threads sem cuidado.

Nesta fase, regra simples:

```text
crie o NumberFormat dentro do método quando precisar;
não use NumberFormat estático global sem entender concorrência.
```

Mais adiante estudaremos concorrência e thread-safety.

---

## Aplicação em produto

Arquivo:

```text
ProdutoFormatacaoMoeda.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class ProdutoFormatacaoMoeda {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", "199.90");

        System.out.println(montarResumo(produto));
    }

    public static Produto criarProduto(String nome, String precoTexto) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.preco = new BigDecimal(precoTexto);

        return produto;
    }

    public static String montarResumo(Produto produto) {
        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        return produto.nome + " custa " + moeda.format(produto.preco);
    }
}

class Produto {
    String nome;
    BigDecimal preco;
}
```

Saída esperada:

```text
Cadeira custa R$ 199,90
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoFormatacaoResumo.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class PedidoFormatacaoResumo {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("Ana", "100.00", "15.50", "9.90");

        System.out.println(montarResumoPedido(pedido));
    }

    public static Pedido criarPedido(String cliente, String subtotalTexto, String descontoTexto, String freteTexto) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.subtotal = new BigDecimal(subtotalTexto);
        pedido.desconto = new BigDecimal(descontoTexto);
        pedido.frete = new BigDecimal(freteTexto);

        return pedido;
    }

    public static String montarResumoPedido(Pedido pedido) {
        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        BigDecimal total = pedido.subtotal.subtract(pedido.desconto).add(pedido.frete);

        StringBuilder builder = new StringBuilder();

        builder.append("Cliente: ").append(pedido.cliente).append("\n");
        builder.append("Subtotal: ").append(moeda.format(pedido.subtotal)).append("\n");
        builder.append("Desconto: ").append(moeda.format(pedido.desconto)).append("\n");
        builder.append("Frete: ").append(moeda.format(pedido.frete)).append("\n");
        builder.append("Total: ").append(moeda.format(total)).append("\n");

        return builder.toString();
    }
}

class Pedido {
    String cliente;
    BigDecimal subtotal;
    BigDecimal desconto;
    BigDecimal frete;
}
```

Aqui combinamos:

```text
BigDecimal para cálculo;
NumberFormat para exibição;
StringBuilder para relatório.
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoFormatacaoParcelas.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Locale;

public class PagamentoFormatacaoParcelas {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("100.00");

        System.out.println(montarResumoParcelamento(total, 3));
    }

    public static String montarResumoParcelamento(BigDecimal total, int parcelas) {
        if (parcelas <= 0) {
            throw new IllegalArgumentException("Parcelas deve ser maior que zero.");
        }

        BigDecimal valorParcela = total.divide(BigDecimal.valueOf(parcelas), 2, RoundingMode.HALF_UP);

        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        return parcelas + "x de " + moeda.format(valorParcela);
    }
}
```

Saída:

```text
3x de R$ 33,33
```

Atenção:

```text
exibição de parcela não resolve rateio de centavos;
é apenas apresentação.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoFormatacaoCusto.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class OrdemServicoFormatacaoCusto {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "120.00", "35.50");

        System.out.println(montarResumo(os));
    }

    public static OrdemServico criarOs(String certificado, String tecnicoTexto, String pecaTexto) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.custoTecnico = new BigDecimal(tecnicoTexto);
        os.custoPeca = new BigDecimal(pecaTexto);

        return os;
    }

    public static String montarResumo(OrdemServico os) {
        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        BigDecimal total = os.custoTecnico.add(os.custoPeca);

        return "OS " + os.certificado + " | Custo total: " + moeda.format(total);
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
MensageriaFormatacaoCusto.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class MensageriaFormatacaoCusto {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "0.35", 12);

        System.out.println(montarResumo(mensagem));
    }

    public static Mensagem criarMensagem(String cliente, String custoUnitarioTexto, int quantidade) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.custoUnitario = new BigDecimal(custoUnitarioTexto);
        mensagem.quantidade = quantidade;

        return mensagem;
    }

    public static String montarResumo(Mensagem mensagem) {
        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        BigDecimal total = mensagem.custoUnitario.multiply(BigDecimal.valueOf(mensagem.quantidade));

        return "Cliente: " + mensagem.cliente
                + " | Mensagens: " + mensagem.quantidade
                + " | Custo: " + moeda.format(total);
    }
}

class Mensagem {
    String cliente;
    BigDecimal custoUnitario;
    int quantidade;
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaFormatacaoValor.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class AuditoriaFormatacaoValor {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "ALTERACAO_VALOR", "99.995");

        System.out.println(montarLinha(registro));
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao, String valorTexto) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.valorAuditado = new BigDecimal(valorTexto);

        return registro;
    }

    public static String montarLinha(RegistroAuditoria registro) {
        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        return registro.usuario
                + " | "
                + registro.operacao
                + " | "
                + moeda.format(registro.valorAuditado);
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    BigDecimal valorAuditado;
}
```

Aqui a formatação pode arredondar para exibição.

Se a regra exige scale 2 antes de auditar, isso deve acontecer antes, com `setScale`.

---

## Refatoração: utilitário de formatação

Código repetido:

```java
Locale brasil = Locale.forLanguageTag("pt-BR");
NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);
return moeda.format(valor);
```

Refatoração:

```java
public static String formatarMoedaBrasil(BigDecimal valor) {
    if (valor == null) {
        return "R$ 0,00";
    }

    Locale brasil = Locale.forLanguageTag("pt-BR");
    NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

    return moeda.format(valor);
}
```

Melhora:

```text
centralização;
padronização;
menos repetição;
mudança futura em um ponto.
```

Mas cuidado:

```text
utilitário de formatação não deve fazer cálculo de negócio escondido.
```

---

## Classe utilitária didática

Arquivo:

```text
FormatadorBrasil.java
```

Código:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class FormatadorBrasil {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("1234.56");
        double percentual = 0.075;

        System.out.println(formatarMoeda(valor));
        System.out.println(formatarNumero(valor));
        System.out.println(formatarPercentual(percentual));
    }

    public static String formatarMoeda(BigDecimal valor) {
        if (valor == null) {
            return "R$ 0,00";
        }

        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat formato = NumberFormat.getCurrencyInstance(brasil);

        return formato.format(valor);
    }

    public static String formatarNumero(Number valor) {
        if (valor == null) {
            return "0,00";
        }

        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat formato = NumberFormat.getNumberInstance(brasil);

        formato.setMinimumFractionDigits(2);
        formato.setMaximumFractionDigits(2);

        return formato.format(valor);
    }

    public static String formatarPercentual(double valor) {
        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat formato = NumberFormat.getPercentInstance(brasil);

        formato.setMinimumFractionDigits(2);
        formato.setMaximumFractionDigits(2);

        return formato.format(valor);
    }
}
```

Esse utilitário é didático.

No futuro, será melhor organizar em pacotes e classes de responsabilidade clara.

---

## Refatoração: separar parse de format

Evite uma classe que faz tudo misturado sem clareza.

Separação conceitual:

```text
Formatador -> transforma valor em texto para exibição;
Conversor -> transforma texto em valor;
Validador -> valida regra.
```

Exemplo:

```java
formatarMoeda(valor)
converterMoedaBrasil(texto)
validarValorPositivo(valor)
```

Essa separação melhora manutenção.

---

## Erros comuns

### Erro 1 — Usar replace simples sem entender formato

```java
texto.replace(",", ".")
```

pode falhar se houver separador de milhar.

Exemplo:

```text
1.234,56
```

vira:

```text
1.234.56
```

inválido.

---

### Erro 2 — Usar formato brasileiro no cálculo

Não calcule com:

```text
R$ 1.234,56
```

Converta para valor primeiro.

---

### Erro 3 — Persistir texto formatado como número

Evite guardar:

```text
R$ 1.234,56
```

em campo que deveria ser número.

---

### Erro 4 — Depender do Locale padrão

O ambiente pode mudar.

Informe Locale explicitamente quando a regra exigir.

---

### Erro 5 — Confundir vírgula decimal com ponto decimal

Brasil usa vírgula na exibição.

BigDecimal em String básica usa ponto.

---

### Erro 6 — Achar que formatar muda o valor

Formatar gera texto.

Não altera o BigDecimal original.

---

### Erro 7 — Usar NumberFormat global sem entender mutabilidade

NumberFormat é mutável.

Não compartilhe globalmente sem entender thread-safety.

---

### Erro 8 — Usar double sem necessidade em dinheiro

Preferir BigDecimal para dinheiro.

---

### Erro 9 — Parse permissivo demais

Entrada crítica deve ter formato bem definido.

---

### Erro 10 — Não tratar ParseException

Parsing pode falhar.

Trate erro ou propague com mensagem clara.

---

## Diagnóstico de formatação

Quando número aparecer errado, pergunte:

### 1. Qual Locale está sendo usado?

```java
Locale.getDefault()
Locale.forLanguageTag("pt-BR")
Locale.US
```

### 2. É cálculo ou exibição?

Cálculo usa valor.

Exibição usa texto formatado.

### 3. O separador decimal está correto?

Brasil:

```text
vírgula decimal.
```

Técnico BigDecimal:

```text
ponto decimal.
```

### 4. Há separador de milhar?

Exemplo:

```text
1.234,56.
```

### 5. O formato é moeda, número ou percentual?

Use a instância correta.

### 6. Casas decimais foram configuradas?

Verifique:

```java
setMinimumFractionDigits
setMaximumFractionDigits
```

### 7. O texto vem de usuário?

Valide com cuidado.

### 8. O NumberFormat é reutilizado?

Cuidado com mutabilidade.

### 9. O valor original está correto?

Verifique BigDecimal antes de formatar.

### 10. Use debug

Veja valor antes e depois de `format`.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class DebugFormatacao {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("1234.56");

        Locale brasil = Locale.forLanguageTag("pt-BR");
        NumberFormat moeda = NumberFormat.getCurrencyInstance(brasil);

        String texto = moeda.format(valor);

        System.out.println(texto);
    }
}
```

Coloque breakpoint em:

```java
String texto = moeda.format(valor);
```

Observe:

```text
valor = 1234.56;
locale = pt_BR;
texto = R$ 1.234,56.
```

Depois teste com:

```java
Locale.US
```

e observe a diferença.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — BigDecimal com vírgula

```java
import java.math.BigDecimal;

public class Main {
    public static void main(String[] args) {
        BigDecimal valor = new BigDecimal("1234,56");

        System.out.println(valor);
    }
}
```

Explique por que quebra.

---

### Teste 2 — Replace incompleto

```java
public class Main {
    public static void main(String[] args) {
        String texto = "1.234,56";

        String normalizado = texto.replace(",", ".");

        System.out.println(normalizado);
    }
}
```

Explique por que fica `1.234.56`.

---

### Teste 3 — Locale padrão

Formate moeda sem informar Locale.

Depois mude para Locale explícito `pt-BR`.

Explique por que depender do ambiente pode ser ruim.

---

### Teste 4 — Percentual errado

```java
double taxa = 7.5;
```

Formate com `getPercentInstance`.

Explique por que aparece como 750% se você passar 7.5.

O valor correto para 7,5% é:

```java
0.075
```

---

### Teste 5 — Formatação usada como cálculo

Formate `BigDecimal` para `String`.

Depois tente somar com outro valor.

Explique por que texto formatado não deve ser usado como número.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-073-locale-numberformat-formatacao
cd labs\m2\aula-073-locale-numberformat-formatacao
```

Crie arquivos:

```text
Main.java
MoedaBrasilEstadosUnidos.java
MoedaComBigDecimal.java
NumeroFormatado.java
PercentualFormatado.java
PercentualComCasas.java
NumeroComCasas.java
MinMaxFractionDigits.java
LocalePadrao.java
ParseNumeroBrasil.java
ParseMoedaBrasil.java
ParseComTratamento.java
TextoBrasilParaBigDecimal.java
BigDecimalParaTextoBrasil.java
ProdutoFormatacaoMoeda.java
PedidoFormatacaoResumo.java
PagamentoFormatacaoParcelas.java
OrdemServicoFormatacaoCusto.java
MensageriaFormatacaoCusto.java
AuditoriaFormatacaoValor.java
FormatadorBrasil.java
DebugFormatacao.java
ErroBigDecimalVirgula.java
ErroReplaceIncompleto.java
ErroPercentual.java
ErroFormatoComoCalculo.java
README.md
```

Compile:

```powershell
javac Main.java
javac MoedaBrasilEstadosUnidos.java
javac MoedaComBigDecimal.java
javac NumeroFormatado.java
javac PercentualFormatado.java
javac PercentualComCasas.java
javac NumeroComCasas.java
javac MinMaxFractionDigits.java
javac LocalePadrao.java
javac ParseNumeroBrasil.java
javac ParseMoedaBrasil.java
javac ParseComTratamento.java
javac TextoBrasilParaBigDecimal.java
javac BigDecimalParaTextoBrasil.java
javac ProdutoFormatacaoMoeda.java
javac PedidoFormatacaoResumo.java
javac PagamentoFormatacaoParcelas.java
javac OrdemServicoFormatacaoCusto.java
javac MensageriaFormatacaoCusto.java
javac AuditoriaFormatacaoValor.java
javac FormatadorBrasil.java
javac DebugFormatacao.java
javac ErroBigDecimalVirgula.java
javac ErroReplaceIncompleto.java
javac ErroPercentual.java
javac ErroFormatoComoCalculo.java
```

Execute os exemplos válidos:

```powershell
java Main
java MoedaBrasilEstadosUnidos
java MoedaComBigDecimal
java NumeroFormatado
java PercentualFormatado
java PercentualComCasas
java NumeroComCasas
java MinMaxFractionDigits
java LocalePadrao
java ParseNumeroBrasil
java ParseMoedaBrasil
java ParseComTratamento
java TextoBrasilParaBigDecimal
java BigDecimalParaTextoBrasil
java ProdutoFormatacaoMoeda
java PedidoFormatacaoResumo
java PagamentoFormatacaoParcelas
java OrdemServicoFormatacaoCusto
java MensageriaFormatacaoCusto
java AuditoriaFormatacaoValor
java FormatadorBrasil
java DebugFormatacao
```

Execute os de erro ou comportamento perigoso separadamente:

```powershell
java ErroBigDecimalVirgula
java ErroReplaceIncompleto
java ErroPercentual
java ErroFormatoComoCalculo
```

Use os resultados para registrar os erros comuns no diário.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 073 — Locale, NumberFormat e formatação

## Objetivo

Entender como formatar números, moedas e percentuais em Java usando `Locale` e `NumberFormat`, com foco em `pt-BR`, vírgula decimal, ponto de milhar e separação entre cálculo e exibição.

## Conceitos

- `Locale` representa localidade.
- `pt-BR` representa português do Brasil.
- `NumberFormat.getCurrencyInstance` formata moeda.
- `NumberFormat.getNumberInstance` formata número comum.
- `NumberFormat.getPercentInstance` formata percentual.
- `format` transforma número em texto.
- `parse` transforma texto em `Number`.
- Brasil usa vírgula decimal e ponto de milhar.
- Estados Unidos usa ponto decimal e vírgula de milhar.
- BigDecimal deve ser usado para cálculo monetário.
- NumberFormat deve ser usado para exibição.
- Texto formatado não deve ser usado para cálculo.
- Locale explícito evita comportamento dependente da máquina.

## Comandos

```powershell
javac Main.java
java Main
javac MoedaBrasilEstadosUnidos.java
java MoedaBrasilEstadosUnidos
javac FormatadorBrasil.java
java FormatadorBrasil
```

## Observações

- Não persistir moeda formatada como número.
- Não depender do Locale padrão quando a regra exigir formato fixo.
- Não confundir `1234.56` com `1.234,56`.
- Não usar replace simples sem entender o formato.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver valor antes/depois de formatar |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar formatação |
| Variables | janela Debug | Ver Locale, NumberFormat e texto |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `format` e `parse` |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Criar formatador utilitário |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 073 — Locale, NumberFormat e formatação

### O que aprendi
Aprendi que `Locale` representa uma localidade e que `NumberFormat` formata números, moedas e percentuais conforme as convenções dessa localidade. Também aprendi que cálculo e exibição são responsabilidades diferentes.

### O que pratiquei
Criei exemplos com moeda brasileira, moeda americana, número comum, percentual, casas decimais, Locale padrão, parse de número brasileiro, conversão de texto brasileiro para BigDecimal, formatação de BigDecimal e aplicações em produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- Locale
- pt-BR
- en-US
- NumberFormat
- getCurrencyInstance
- getNumberInstance
- getPercentInstance
- format
- parse
- ParseException
- moeda
- número
- percentual
- vírgula decimal
- ponto de milhar
- separador decimal
- separador de milhar
- BigDecimal
- formatação
- exibição
- persistência
- Locale padrão
- i18n

### Arquivos criados
- `labs/m2/aula-073-locale-numberformat-formatacao/Main.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/MoedaBrasilEstadosUnidos.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/MoedaComBigDecimal.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/NumeroFormatado.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/PercentualFormatado.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/PercentualComCasas.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/NumeroComCasas.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/MinMaxFractionDigits.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/LocalePadrao.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ParseNumeroBrasil.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ParseMoedaBrasil.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ParseComTratamento.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/TextoBrasilParaBigDecimal.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/BigDecimalParaTextoBrasil.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ProdutoFormatacaoMoeda.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/PedidoFormatacaoResumo.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/PagamentoFormatacaoParcelas.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/OrdemServicoFormatacaoCusto.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/MensageriaFormatacaoCusto.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/AuditoriaFormatacaoValor.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/FormatadorBrasil.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/DebugFormatacao.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ErroBigDecimalVirgula.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ErroReplaceIncompleto.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ErroPercentual.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/ErroFormatoComoCalculo.java`
- `labs/m2/aula-073-locale-numberformat-formatacao/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac MoedaBrasilEstadosUnidos.java
java MoedaBrasilEstadosUnidos
javac TextoBrasilParaBigDecimal.java
java TextoBrasilParaBigDecimal
javac FormatadorBrasil.java
java FormatadorBrasil
```

### Erros que quero evitar
- usar replace simples sem entender formato;
- usar formato brasileiro no cálculo;
- persistir texto formatado como número;
- depender do Locale padrão;
- confundir vírgula decimal com ponto decimal;
- achar que formatar muda o valor;
- usar NumberFormat global sem entender mutabilidade;
- usar double sem necessidade em dinheiro;
- fazer parse permissivo demais;
- não tratar ParseException.

### Próximo passo
Estudar java.time básico.
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
git add labs/m2/aula-073-locale-numberformat-formatacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 073: pratica Locale NumberFormat e formatacao em Java"
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
1. O que é Locale?
2. O que representa pt-BR?
3. O que representa en-US?
4. Para que serve NumberFormat?
5. Para que serve getCurrencyInstance?
6. Para que serve getNumberInstance?
7. Para que serve getPercentInstance?
8. Qual é o separador decimal brasileiro?
9. Qual é o separador de milhar brasileiro?
10. Qual é o separador decimal americano?
11. Por que cálculo e apresentação devem ser separados?
12. Por que não devo persistir R$ 1.234,56 como número?
13. O que NumberFormat.format retorna?
14. O que NumberFormat.parse retorna?
15. Por que parse pode lançar ParseException?
16. Por que depender do Locale padrão pode ser perigoso?
17. Como configurar casas decimais?
18. O que significa 0.075 formatado como percentual?
19. Por que replace simples pode falhar?
20. Quando criar utilitário de formatação?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar Locale;
explicar pt-BR;
explicar NumberFormat;
formatar moeda brasileira;
formatar moeda americana;
formatar número comum;
formatar percentual;
configurar casas decimais;
explicar separador decimal;
explicar separador de milhar;
explicar diferença entre cálculo e exibição;
formatar BigDecimal;
evitar usar texto formatado em cálculo;
explicar Locale padrão;
explicar por que usar Locale explícito;
fazer parse de número brasileiro;
tratar ParseException;
converter texto brasileiro controlado para BigDecimal;
explicar riscos de replace simples;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
criar utilitário didático de formatação;
debugar valor antes e depois do format;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `DecimalFormat` profundamente.

Não precisa ainda dominar `Currency`.

Não precisa ainda dominar todos os detalhes de internacionalização.

Não precisa ainda dominar formatação de datas.

Não precisa ainda dominar mensagens traduzidas.

Não precisa ainda dominar thread-safety em profundidade.

Esses assuntos virão depois.

O objetivo é dominar a base de `Locale`, `NumberFormat`, moeda, número, percentual e os problemas clássicos de vírgula e ponto.

---

## Fechamento da aula

Hoje estudamos `Locale`, `NumberFormat` e formatação.

A ideia central foi:

```text
valor numérico e texto formatado são coisas diferentes.
```

Vimos que:

```text
Locale define convenções regionais;
pt-BR usa vírgula decimal e ponto de milhar;
en-US usa ponto decimal e vírgula de milhar;
NumberFormat formata moeda, número e percentual;
format transforma valor em texto;
parse transforma texto em Number;
BigDecimal continua sendo o valor de cálculo;
texto formatado é para exibição;
Locale explícito evita comportamento dependente da máquina.
```

O ponto mais importante é:

```text
calcule com tipos numéricos adequados e formate apenas na borda de apresentação.
```

Na próxima aula, vamos estudar:

```text
java.time básico.
```

A próxima aula vai explicar `LocalDate`, `LocalTime`, `LocalDateTime`, `Duration`, `Period` e formatação básica de datas e horários.
