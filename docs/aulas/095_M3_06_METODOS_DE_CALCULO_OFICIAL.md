# 095 — M3.06 — Métodos de cálculo

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M3.06.01` — Métodos de cálculo — Conceito profundo e quando usar.
- `M3.06.02` — Métodos de cálculo — Implementação guiada com código realista.
- `M3.06.03` — Métodos de cálculo — Refatoração, melhoria e leitura crítica.
- `M3.06.04` — Métodos de cálculo — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar métodos que retornam números, totais, médias, maior, menor, arredondamento, retorno claro, cálculo sem efeito colateral, validação mínima antes do cálculo, nomes profissionais, leitura crítica, refatoração incremental e aplicação em cenários de pedido, produto, pagamento, OS, SLA, mensageria, auditoria e relatórios.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK configurado;
terminal integrado funciona;
debug funciona;
renomear método/parâmetro está acessível;
extrair método está acessível;
introduzir variável está acessível.
```

A prática desta aula será feita em:

```text
labs/m3/aula-095-metodos-de-calculo
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

A sequência recente foi:

```text
091 — M3.02 — Assinatura de método profissional;
092 — M3.03 — Coesão em métodos;
093 — M3.04 — Parâmetros demais e alternativas;
094 — M3.05 — Retorno boolean para validação;
095 — M3.06 — Métodos de cálculo.
```

Na aula anterior, estudamos métodos de validação que retornam `boolean`.

Agora vamos estudar outro tipo de método muito comum:

```text
método que calcula e retorna um valor.
```

Exemplos:

```java
calcularTotalPedido(...)
calcularMedia(...)
calcularMaiorValor(...)
calcularMenorValor(...)
calcularPercentual(...)
calcularDesconto(...)
calcularTotalFinal(...)
calcularDiasAtraso(...)
```

Métodos de cálculo aparecem o tempo todo em sistemas reais.

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
095 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 95
Aulas oficiais restantes: 443
```

Contando o arquivo de abertura `000`, teremos:

```text
96 arquivos gerados no total.
```

---

## A pergunta central da aula

Qual dessas versões é melhor?

```java
public static void calcularTotal(BigDecimal preco, int quantidade) {
    System.out.println(preco.multiply(BigDecimal.valueOf(quantidade)));
}
```

ou:

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}
```

A segunda é melhor para cálculo.

Por quê?

Porque cálculo deve produzir valor.

Depois, outra parte decide se imprime, salva, envia ou usa o resultado.

A pergunta central da aula é:

```text
como criar métodos de cálculo que retornam valores claros, sem misturar cálculo com exibição ou efeitos colaterais?
```

---

## O que é método de cálculo

Método de cálculo é um método cujo objetivo principal é transformar entradas em um resultado numérico ou mensurável.

Exemplos:

```java
public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade)
```

```java
public static double calcularMedia(double nota1, double nota2, double nota3)
```

```java
public static int calcularMaior(int primeiro, int segundo)
```

```java
public static long calcularDiasAtraso(LocalDate vencimento, LocalDate dataReferencia)
```

Um método de cálculo deve responder:

```text
com estes dados de entrada, qual é o resultado?
```

---

## Cálculo deve retornar

A regra principal desta aula:

```text
método que calcula deve retornar o resultado.
```

Ruim:

```java
public static void calcularMedia(double a, double b) {
    double media = (a + b) / 2;
    System.out.println(media);
}
```

Melhor:

```java
public static double calcularMedia(double a, double b) {
    return (a + b) / 2;
}
```

Depois:

```java
double media = calcularMedia(8.0, 7.0);
System.out.println(media);
```

Separação:

```text
calcular -> retorna;
imprimir -> exibe.
```

---

## Por que separar cálculo e exibição

Se o método calcula e imprime ao mesmo tempo, ele fica menos reutilizável.

Exemplo ruim:

```java
public static void calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    BigDecimal total = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

    System.out.println("Total: " + total);
}
```

Problemas:

```text
não consigo usar o total em outro cálculo;
não consigo testar facilmente;
não consigo salvar o resultado;
não consigo aplicar desconto depois;
não consigo formatar de outro jeito;
cálculo ficou preso ao console.
```

Melhor:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Agora o resultado pode ser usado em qualquer lugar.

---

## Tipos de retorno em cálculo

O tipo de retorno deve representar o resultado.

Exemplos:

```text
quantidade -> int ou long;
dinheiro -> BigDecimal;
média simples -> double ou BigDecimal, dependendo do contexto;
dias -> long;
percentual monetário -> BigDecimal;
maior/menor inteiro -> int;
maior/menor valor monetário -> BigDecimal;
```

Para dinheiro, nesta formação, prefira:

```java
BigDecimal
```

Não use `double` para valores financeiros reais.

---

## BigDecimal em cálculos monetários

Exemplo correto:

```java
BigDecimal preco = new BigDecimal("199.90");
int quantidade = 2;

BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));
```

Evite:

```java
double preco = 199.90;
```

`double` pode ter imprecisões binárias.

Para aula simples de média escolar, `double` pode ser aceitável.

Para dinheiro, use `BigDecimal`.

---

## Arredondamento

Cálculo monetário frequentemente precisa de escala e arredondamento.

Exemplo:

```java
public static BigDecimal arredondarMoeda(BigDecimal valor) {
    return valor.setScale(2, RoundingMode.HALF_UP);
}
```

Mas cuidado:

```text
não arredonde cedo demais se ainda haverá outros cálculos;
arredonde no momento correto da regra;
documente a decisão;
mantenha padrão.
```

Nesta aula, usaremos arredondamento simples para fins didáticos.

---

## Validação mínima antes de cálculo

Cálculo precisa receber dados válidos.

Exemplo:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    if (precoUnitario == null) {
        throw new IllegalArgumentException("Preço unitário é obrigatório.");
    }

    if (quantidade <= 0) {
        throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
    }

    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Por que lançar exception aqui?

Porque o método não consegue calcular corretamente sem esses dados.

Essa validação é diferente de uma validação de tela.

É proteção do contrato do método.

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
CalculoBasico.java
```

Código:

```java
public class CalculoBasico {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 20;

        int soma = somar(primeiro, segundo);
        int maior = calcularMaior(primeiro, segundo);
        double media = calcularMedia(primeiro, segundo);

        System.out.println("Soma: " + soma);
        System.out.println("Maior: " + maior);
        System.out.println("Média: " + media);
    }

    public static int somar(int primeiro, int segundo) {
        return primeiro + segundo;
    }

    public static int calcularMaior(int primeiro, int segundo) {
        if (primeiro >= segundo) {
            return primeiro;
        }

        return segundo;
    }

    public static double calcularMedia(int primeiro, int segundo) {
        return (primeiro + segundo) / 2.0;
    }
}
```

Compile:

```powershell
javac CalculoBasico.java
```

Execute:

```powershell
java CalculoBasico
```

Saída esperada:

```text
Soma: 30
Maior: 20
Média: 15.0
```

---

## Exemplo com total e desconto

Arquivo:

```text
CalculoPedido.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculoPedido {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        BigDecimal totalBruto = calcularTotalBruto(precoUnitario, quantidade);
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        System.out.println("Total bruto: " + arredondarMoeda(totalBruto));
        System.out.println("Desconto: " + arredondarMoeda(desconto));
        System.out.println("Total final: " + arredondarMoeda(totalFinal));
    }

    public static BigDecimal calcularTotalBruto(BigDecimal precoUnitario, int quantidade) {
        if (precoUnitario == null) {
            throw new IllegalArgumentException("Preço unitário é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal totalBruto) {
        if (totalBruto == null) {
            throw new IllegalArgumentException("Total bruto é obrigatório.");
        }

        BigDecimal limiteDesconto = new BigDecimal("300.00");
        BigDecimal percentualDesconto = new BigDecimal("0.10");

        if (totalBruto.compareTo(limiteDesconto) >= 0) {
            return totalBruto.multiply(percentualDesconto);
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal totalBruto, BigDecimal desconto) {
        if (totalBruto == null || desconto == null) {
            throw new IllegalArgumentException("Total bruto e desconto são obrigatórios.");
        }

        return totalBruto.subtract(desconto);
    }

    public static BigDecimal arredondarMoeda(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
```

Observe a separação:

```text
calcularTotalBruto;
calcularDesconto;
calcularTotalFinal;
arredondarMoeda;
imprimir no main.
```

Cada método tem uma função.

---

## Exemplo com média

Arquivo:

```text
CalculoMedia.java
```

Código:

```java
public class CalculoMedia {
    public static void main(String[] args) {
        double nota1 = 8.0;
        double nota2 = 7.5;
        double nota3 = 9.0;

        double media = calcularMedia(nota1, nota2, nota3);

        System.out.println("Média: " + media);

        if (media >= 7.0) {
            System.out.println("Aprovado.");
        } else {
            System.out.println("Reprovado.");
        }
    }

    public static double calcularMedia(double nota1, double nota2, double nota3) {
        return (nota1 + nota2 + nota3) / 3.0;
    }
}
```

Aqui, o cálculo retorna a média.

A decisão de aprovação fica fora do método de cálculo.

Isso é importante.

---

## Exemplo com maior e menor

Arquivo:

```text
CalculoMaiorMenor.java
```

Código:

```java
public class CalculoMaiorMenor {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 25;
        int terceiro = 7;

        int maior = calcularMaior(primeiro, segundo, terceiro);
        int menor = calcularMenor(primeiro, segundo, terceiro);

        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);
    }

    public static int calcularMaior(int primeiro, int segundo, int terceiro) {
        int maior = primeiro;

        if (segundo > maior) {
            maior = segundo;
        }

        if (terceiro > maior) {
            maior = terceiro;
        }

        return maior;
    }

    public static int calcularMenor(int primeiro, int segundo, int terceiro) {
        int menor = primeiro;

        if (segundo < menor) {
            menor = segundo;
        }

        if (terceiro < menor) {
            menor = terceiro;
        }

        return menor;
    }
}
```

Esse padrão prepara para arrays.

Mais tarde, calcularemos maior e menor percorrendo coleções.

---

## Exemplo com percentual

Arquivo:

```text
CalculoPercentual.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculoPercentual {
    public static void main(String[] args) {
        BigDecimal total = new BigDecimal("500.00");
        BigDecimal percentual = new BigDecimal("0.12");

        BigDecimal valorPercentual = calcularValorPercentual(total, percentual);

        System.out.println("Valor percentual: " + arredondarMoeda(valorPercentual));
    }

    public static BigDecimal calcularValorPercentual(BigDecimal total, BigDecimal percentual) {
        if (total == null || percentual == null) {
            throw new IllegalArgumentException("Total e percentual são obrigatórios.");
        }

        return total.multiply(percentual);
    }

    public static BigDecimal arredondarMoeda(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
```

Observação:

```text
0.12 representa 12%.
```

Em sistemas reais, a representação de percentual precisa de padrão claro.

---

## Exemplo aplicado: produto

Arquivo:

```text
CalculoProduto.java
```

Código:

```java
import java.math.BigDecimal;

public class CalculoProduto {
    public static void main(String[] args) {
        Produto produto = new Produto("Cadeira", new BigDecimal("199.90"), 10);

        BigDecimal valorEmEstoque = calcularValorEmEstoque(produto);
        boolean estoqueBaixo = estoqueBaixo(produto.estoque(), 5);

        System.out.println("Produto: " + produto.nome());
        System.out.println("Valor em estoque: " + valorEmEstoque);
        System.out.println("Estoque baixo: " + estoqueBaixo);
    }

    public static BigDecimal calcularValorEmEstoque(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        return produto.precoUnitario().multiply(BigDecimal.valueOf(produto.estoque()));
    }

    public static boolean estoqueBaixo(int estoqueAtual, int limiteBaixo) {
        return estoqueAtual <= limiteBaixo;
    }
}

record Produto(String nome, BigDecimal precoUnitario, int estoque) {
}
```

Aqui temos cálculo e validação simples separados:

```text
calcularValorEmEstoque -> cálculo;
estoqueBaixo -> boolean.
```

---

## Exemplo aplicado: pagamento

Arquivo:

```text
CalculoPagamento.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculoPagamento {
    public static void main(String[] args) {
        BigDecimal valorBruto = new BigDecimal("1000.00");
        BigDecimal taxa = new BigDecimal("0.029");

        BigDecimal valorTaxa = calcularTaxa(valorBruto, taxa);
        BigDecimal valorLiquido = calcularValorLiquido(valorBruto, valorTaxa);

        System.out.println("Valor bruto: " + arredondarMoeda(valorBruto));
        System.out.println("Taxa: " + arredondarMoeda(valorTaxa));
        System.out.println("Valor líquido: " + arredondarMoeda(valorLiquido));
    }

    public static BigDecimal calcularTaxa(BigDecimal valorBruto, BigDecimal percentualTaxa) {
        if (valorBruto == null || percentualTaxa == null) {
            throw new IllegalArgumentException("Valor bruto e taxa são obrigatórios.");
        }

        return valorBruto.multiply(percentualTaxa);
    }

    public static BigDecimal calcularValorLiquido(BigDecimal valorBruto, BigDecimal valorTaxa) {
        if (valorBruto == null || valorTaxa == null) {
            throw new IllegalArgumentException("Valor bruto e valor da taxa são obrigatórios.");
        }

        return valorBruto.subtract(valorTaxa);
    }

    public static BigDecimal arredondarMoeda(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
```

---

## Exemplo aplicado: OS e SLA

Arquivo:

```text
CalculoSlaOs.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class CalculoSlaOs {
    public static void main(String[] args) {
        LocalDate dataAbertura = LocalDate.now().minusDays(5);
        LocalDate dataReferencia = LocalDate.now();
        int prazoSlaDias = 3;

        long diasEmAberto = calcularDiasEmAberto(dataAbertura, dataReferencia);
        long diasAtraso = calcularDiasAtraso(diasEmAberto, prazoSlaDias);

        System.out.println("Dias em aberto: " + diasEmAberto);
        System.out.println("Dias de atraso: " + diasAtraso);
    }

    public static long calcularDiasEmAberto(LocalDate dataAbertura, LocalDate dataReferencia) {
        if (dataAbertura == null || dataReferencia == null) {
            throw new IllegalArgumentException("Datas são obrigatórias.");
        }

        return ChronoUnit.DAYS.between(dataAbertura, dataReferencia);
    }

    public static long calcularDiasAtraso(long diasEmAberto, int prazoSlaDias) {
        long atraso = diasEmAberto - prazoSlaDias;

        if (atraso < 0) {
            return 0;
        }

        return atraso;
    }
}
```

Observe:

```text
calcularDiasEmAberto retorna long;
calcularDiasAtraso nunca retorna negativo.
```

Essa é uma decisão de regra.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
CalculoMensageria.java
```

Código:

```java
public class CalculoMensageria {
    public static void main(String[] args) {
        int enviadas = 92;
        int totalTentativas = 100;

        double taxaSucesso = calcularTaxaSucesso(enviadas, totalTentativas);

        System.out.println("Taxa de sucesso: " + taxaSucesso + "%");
    }

    public static double calcularTaxaSucesso(int enviadas, int totalTentativas) {
        if (totalTentativas <= 0) {
            throw new IllegalArgumentException("Total de tentativas deve ser maior que zero.");
        }

        return (enviadas * 100.0) / totalTentativas;
    }
}
```

Por que `100.0`?

Para garantir cálculo com decimal.

Se fosse `100`, poderia virar divisão inteira em alguns cenários.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
CalculoAuditoria.java
```

Código:

```java
public class CalculoAuditoria {
    public static void main(String[] args) {
        int criacoes = 10;
        int edicoes = 5;
        int exclusoes = 2;

        int totalOperacoes = calcularTotalOperacoes(criacoes, edicoes, exclusoes);
        double percentualExclusoes = calcularPercentual(exclusoes, totalOperacoes);

        System.out.println("Total de operações: " + totalOperacoes);
        System.out.println("Percentual de exclusões: " + percentualExclusoes + "%");
    }

    public static int calcularTotalOperacoes(int criacoes, int edicoes, int exclusoes) {
        return criacoes + edicoes + exclusoes;
    }

    public static double calcularPercentual(int parte, int total) {
        if (total <= 0) {
            throw new IllegalArgumentException("Total deve ser maior que zero.");
        }

        return (parte * 100.0) / total;
    }
}
```

---

## Refatoração: cálculo com print

Antes:

```java
public static void calcularEImprimirTotal(BigDecimal preco, int quantidade) {
    BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

    System.out.println("Total: " + total);
}
```

Depois:

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}

public static void imprimirTotal(BigDecimal total) {
    System.out.println("Total: " + total);
}
```

Ganho:

```text
cálculo reutilizável;
impressão separada;
teste mais fácil;
responsabilidade mais clara.
```

---

## Refatoração: cálculo com nome genérico

Antes:

```java
public static BigDecimal calc(BigDecimal a, int b) {
    return a.multiply(BigDecimal.valueOf(b));
}
```

Depois:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Ganho:

```text
nome comunica domínio;
parâmetros têm significado;
retorno é entendido.
```

---

## Refatoração: cálculo grande

Antes:

```java
public static BigDecimal calcular(BigDecimal preco, int quantidade) {
    BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

    if (total.compareTo(new BigDecimal("300.00")) >= 0) {
        total = total.subtract(total.multiply(new BigDecimal("0.10")));
    }

    return total.setScale(2, RoundingMode.HALF_UP);
}
```

Depois:

```java
BigDecimal totalBruto = calcularTotalBruto(preco, quantidade);
BigDecimal desconto = calcularDesconto(totalBruto);
BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);
BigDecimal totalArredondado = arredondarMoeda(totalFinal);
```

Métodos separados:

```text
calcularTotalBruto;
calcularDesconto;
calcularTotalFinal;
arredondarMoeda.
```

Cada regra tem nome.

---

## Cálculo e regra de negócio

Nem todo cálculo é apenas matemática.

Exemplo:

```java
calcularDiasAtraso
```

tem regra:

```text
se atraso for negativo, retorna zero.
```

Isso é regra de negócio.

Outro exemplo:

```java
calcularDesconto
```

tem regra:

```text
aplica 10% se total bruto >= 300.
```

Método de cálculo pode conter regra.

Mas deve ter uma intenção clara.

---

## Cálculo e validação

Cálculo pode validar pré-condições.

Exemplo:

```java
if (totalTentativas <= 0) {
    throw new IllegalArgumentException("Total de tentativas deve ser maior que zero.");
}
```

Isso evita divisão por zero.

Mas cuidado para não transformar método de cálculo em método que:

```text
lê entrada;
valida tudo;
imprime;
salva;
audita;
envia mensagem.
```

Validação de pré-condição é aceitável.

Mistura de responsabilidades não.

---

## Cálculo e arredondamento

Arredondamento é decisão importante.

Exemplo:

```java
public static BigDecimal arredondarMoeda(BigDecimal valor) {
    return valor.setScale(2, RoundingMode.HALF_UP);
}
```

Evite espalhar:

```java
setScale(2, RoundingMode.HALF_UP)
```

em todo lugar.

Crie método com nome claro.

---

## Cálculo e int versus double

Cuidado com divisão inteira.

Exemplo:

```java
int parte = 1;
int total = 2;

double percentual = parte / total * 100;
```

Resultado pode ser:

```text
0.0
```

Por quê?

Porque `parte / total` faz divisão inteira.

Melhor:

```java
double percentual = (parte * 100.0) / total;
```

ou:

```java
double percentual = ((double) parte / total) * 100;
```

---

## Testes manuais de cálculo

Arquivo:

```text
TestesManuaisCalculo.java
```

Código:

```java
import java.math.BigDecimal;

public class TestesManuaisCalculo {
    public static void main(String[] args) {
        testarTotalPedido();
        testarMedia();
        testarMaiorMenor();
        testarPercentual();

        System.out.println("Testes manuais de cálculo finalizados.");
    }

    public static void testarTotalPedido() {
        BigDecimal total = calcularTotalPedido(new BigDecimal("10.00"), 3);

        conferirBigDecimal(new BigDecimal("30.00"), total, "total do pedido");
    }

    public static void testarMedia() {
        double media = calcularMedia(8.0, 6.0);

        conferirDouble(7.0, media, "média");
    }

    public static void testarMaiorMenor() {
        conferirInt(10, calcularMaior(10, 3), "maior");
        conferirInt(3, calcularMenor(10, 3), "menor");
    }

    public static void testarPercentual() {
        double percentual = calcularPercentual(25, 100);

        conferirDouble(25.0, percentual, "percentual");
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static double calcularMedia(double primeiro, double segundo) {
        return (primeiro + segundo) / 2.0;
    }

    public static int calcularMaior(int primeiro, int segundo) {
        if (primeiro >= segundo) {
            return primeiro;
        }

        return segundo;
    }

    public static int calcularMenor(int primeiro, int segundo) {
        if (primeiro <= segundo) {
            return primeiro;
        }

        return segundo;
    }

    public static double calcularPercentual(int parte, int total) {
        if (total <= 0) {
            throw new IllegalArgumentException("Total deve ser maior que zero.");
        }

        return (parte * 100.0) / total;
    }

    public static void conferirInt(int esperado, int atual, String nome) {
        if (esperado != atual) {
            throw new IllegalStateException(nome + " | esperado=" + esperado + " | atual=" + atual);
        }
    }

    public static void conferirDouble(double esperado, double atual, String nome) {
        double diferenca = Math.abs(esperado - atual);

        if (diferenca > 0.0001) {
            throw new IllegalStateException(nome + " | esperado=" + esperado + " | atual=" + atual);
        }
    }

    public static void conferirBigDecimal(BigDecimal esperado, BigDecimal atual, String nome) {
        if (esperado.compareTo(atual) != 0) {
            throw new IllegalStateException(nome + " | esperado=" + esperado + " | atual=" + atual);
        }
    }
}
```

Esse arquivo reforça:

```text
cálculo retorna;
teste compara;
erro mostra esperado e atual.
```

---

## Erros comuns

### Erro 1 — Método de cálculo com `void`

Cálculo deve retornar.

### Erro 2 — Cálculo imprimindo no console

Impressão deve ficar separada.

### Erro 3 — Usar `double` para dinheiro

Use `BigDecimal`.

### Erro 4 — Esquecer atribuição com BigDecimal

Errado:

```java
total.add(valor);
```

Correto:

```java
total = total.add(valor);
```

### Erro 5 — Divisão inteira sem perceber

Use `100.0` ou cast para double.

### Erro 6 — Arredondar cedo demais

Arredonde no momento correto.

### Erro 7 — Nome genérico

`calc`, `fazConta`, `total` não comunicam bem.

### Erro 8 — Não validar divisão por zero

Sempre proteja cálculo de percentual ou média quando o total pode ser zero.

### Erro 9 — Misturar cálculo com validação complexa, impressão e auditoria

Mantenha foco.

### Erro 10 — Retornar valor sem explicar regra

Nome do método deve explicar a regra.

---

## Diagnóstico

Quando cálculo der errado:

```text
1. Confira entradas.
2. Confira tipo usado.
3. Confira se houve divisão inteira.
4. Confira se BigDecimal foi atribuído.
5. Confira se arredondamento foi aplicado no momento certo.
6. Confira se o método retorna o valor.
7. Confira se o método imprime sem necessidade.
8. Confira se a regra de desconto/faixa está correta.
9. Confira se há divisão por zero.
10. Crie teste manual com esperado e atual.
```

Exemplo:

```java
System.out.println("precoUnitario: " + precoUnitario);
System.out.println("quantidade: " + quantidade);
System.out.println("totalBruto: " + totalBruto);
System.out.println("desconto: " + desconto);
System.out.println("totalFinal: " + totalFinal);
```

---

## Debug recomendado

Use debug em:

```text
CalculoPedido.java
```

Coloque breakpoints em:

```java
calcularTotalBruto(...)
calcularDesconto(...)
calcularTotalFinal(...)
arredondarMoeda(...)
```

Observe:

```text
entrada de cada método;
retorno de cada método;
BigDecimal antes e depois;
percentual aplicado;
total final.
```

Depois use debug em:

```text
TestesManuaisCalculo.java
```

Observe:

```text
valor esperado;
valor atual;
comparação;
falha quando diferença aparece.
```

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — método de cálculo sem retorno

Transforme `calcularTotalPedido` em `void`.

Explique por que o código perde reutilização.

### Teste 2 — divisão inteira

Altere:

```java
return (parte * 100.0) / total;
```

para:

```java
return parte / total * 100;
```

Use parte `1` e total `2`.

Explique o erro.

### Teste 3 — BigDecimal sem atribuição

Use:

```java
total.add(new BigDecimal("10.00"));
```

sem atribuir.

Explique por que total não muda.

### Teste 4 — arredondar cedo demais

Arredonde antes de aplicar desconto.

Compare com arredondamento no final.

### Teste 5 — desconto com regra invertida

Troque `>= 300` por `< 300`.

Rode teste manual e explique.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-095-metodos-de-calculo
cd labs\m3\aula-095-metodos-de-calculo
```

Crie arquivos:

```text
CalculoBasico.java
CalculoPedido.java
CalculoMedia.java
CalculoMaiorMenor.java
CalculoPercentual.java
CalculoProduto.java
CalculoPagamento.java
CalculoSlaOs.java
CalculoMensageria.java
CalculoAuditoria.java
TestesManuaisCalculo.java
ErroCalculoVoid.java
ErroDivisaoInteira.java
ErroBigDecimalSemAtribuir.java
ErroArredondamentoCedo.java
ErroCalculoComPrint.java
README.md
```

Compile:

```powershell
javac CalculoBasico.java
javac CalculoPedido.java
javac CalculoMedia.java
javac CalculoMaiorMenor.java
javac CalculoPercentual.java
javac CalculoProduto.java
javac CalculoPagamento.java
javac CalculoSlaOs.java
javac CalculoMensageria.java
javac CalculoAuditoria.java
javac TestesManuaisCalculo.java
```

Execute:

```powershell
java CalculoBasico
java CalculoPedido
java CalculoMedia
java CalculoMaiorMenor
java CalculoPercentual
java CalculoProduto
java CalculoPagamento
java CalculoSlaOs
java CalculoMensageria
java CalculoAuditoria
java TestesManuaisCalculo
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 095 — Métodos de cálculo

## Objetivo

Aprender a criar métodos de cálculo que retornam valores claros, separando cálculo, impressão, validação mínima e arredondamento.

## Conceitos

- Método de cálculo deve retornar resultado.
- Cálculo não deve imprimir por padrão.
- Dinheiro deve usar BigDecimal.
- Média simples pode usar double em exemplos didáticos.
- Percentual precisa evitar divisão inteira.
- Divisão por zero precisa ser protegida.
- BigDecimal é imutável.
- Arredondamento deve ter regra clara.
- Métodos de cálculo precisam de nomes específicos.
- Testes manuais ajudam a validar esperado e atual.

## Comandos

```powershell
javac CalculoPedido.java
java CalculoPedido
javac TestesManuaisCalculo.java
java TestesManuaisCalculo
```
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extract Method | ação da IDE | Separar cálculo |
| Introduce Variable | ação da IDE | Nomear resultado intermediário |
| Debug | `Shift + F9` | Observar cálculo |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Avançar |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar expressão |
| Compilar | `javac Arquivo.java` | Validar |
| Executar | `java Classe` | Testar comportamento |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 095 — Métodos de cálculo

### O que aprendi

Aprendi que métodos de cálculo devem retornar resultado, sem misturar impressão, e que o tipo de retorno precisa representar o tipo de cálculo realizado.

### O que pratiquei

Criei métodos para somar, calcular média, maior, menor, total bruto, desconto, total final, percentual, taxa, valor líquido, dias em aberto, dias de atraso e taxa de sucesso.

### Conceitos principais

- método de cálculo
- retorno
- BigDecimal
- double
- int
- long
- total
- média
- maior
- menor
- percentual
- desconto
- arredondamento
- RoundingMode
- divisão inteira
- divisão por zero
- teste manual
- esperado versus atual

### Arquivos criados

- `labs/m3/aula-095-metodos-de-calculo/CalculoBasico.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoPedido.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoMedia.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoMaiorMenor.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoPercentual.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoProduto.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoPagamento.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoSlaOs.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoMensageria.java`
- `labs/m3/aula-095-metodos-de-calculo/CalculoAuditoria.java`
- `labs/m3/aula-095-metodos-de-calculo/TestesManuaisCalculo.java`
- `labs/m3/aula-095-metodos-de-calculo/README.md`

### Comandos usados

```powershell
javac CalculoPedido.java
java CalculoPedido
javac TestesManuaisCalculo.java
java TestesManuaisCalculo
```

### Erros que quero evitar

- método de cálculo com `void`;
- cálculo imprimindo no console;
- usar `double` para dinheiro;
- esquecer atribuição com BigDecimal;
- fazer divisão inteira sem perceber;
- não proteger divisão por zero;
- arredondar cedo demais;
- usar nome genérico;
- misturar cálculo, impressão e auditoria;
- não testar esperado e atual.
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
git add labs/m3/aula-095-metodos-de-calculo docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 095: pratica metodos de calculo"
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
1. O que é método de cálculo?
2. Por que método de cálculo deve retornar valor?
3. Por que cálculo e impressão devem ficar separados?
4. Quando usar BigDecimal?
5. Quando double pode ser aceitável em exemplo didático?
6. Por que BigDecimal é importante para dinheiro?
7. Por que BigDecimal.add precisa de atribuição?
8. O que é arredondamento?
9. Para que serve RoundingMode?
10. Por que evitar arredondar cedo demais?
11. Como calcular total bruto?
12. Como calcular desconto?
13. Como calcular total final?
14. Como calcular média?
15. Como calcular maior e menor?
16. Como calcular percentual evitando divisão inteira?
17. Por que proteger divisão por zero?
18. Como testar cálculo manualmente?
19. Como aplicar cálculo em OS/SLA?
20. Qual método de cálculo você criou nesta aula e por quê?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar método de cálculo;
criar método que retorna int;
criar método que retorna double;
criar método que retorna BigDecimal;
criar método que retorna long;
separar cálculo de impressão;
usar BigDecimal para dinheiro;
usar compareTo quando necessário;
usar setScale e RoundingMode;
calcular total bruto;
calcular desconto;
calcular total final;
calcular média;
calcular maior;
calcular menor;
calcular percentual;
evitar divisão inteira;
proteger divisão por zero;
criar teste manual de cálculo;
debugar cálculo;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda usar arrays para todos os cálculos.

Não precisa ainda usar collections.

Não precisa ainda usar streams.

Não precisa ainda usar JUnit.

Não precisa ainda usar Bean Validation.

Não precisa ainda criar serviços.

Esses assuntos virão depois.

O objetivo é:

```text
criar métodos de cálculo pequenos, claros, reutilizáveis e com retorno correto.
```

---

## Fechamento

Hoje estudamos métodos de cálculo.

A ideia central foi:

```text
quem calcula deve retornar o resultado; quem exibe deve exibir.
```

Vimos que:

```text
cálculo deve ter retorno;
impressão deve ficar separada;
BigDecimal é indicado para dinheiro;
double exige cuidado;
percentual precisa evitar divisão inteira;
divisão por zero precisa ser protegida;
arredondamento precisa de regra;
nomes devem comunicar o cálculo;
testes manuais ajudam a validar esperado e atual.
```

O ponto mais importante é:

```text
um cálculo bem separado pode ser reutilizado, testado e combinado em regras maiores.
```

Na próxima aula, vamos estudar:

```text
Métodos de exibição.
```

A próxima aula vai aprofundar `imprimirResumo`, `imprimirMenu`, separação de UI console, diferença entre calcular e exibir, organização de saída e clareza para o usuário.
