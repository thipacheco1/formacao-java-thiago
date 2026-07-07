# 031 — M1.11 — Operadores Aritméticos

## Onde estamos na formação

Estamos no Módulo 1, evoluindo dos tipos para operações.

Até aqui, já passamos por:

```text
M1.01 — primeiro programa Java destrinchado;
M1.02 — blocos, chaves, indentação e leitura de código;
M1.03 — comentários úteis e documentação inicial;
M1.04 — variáveis e nomes profissionais;
M1.05 — tipos inteiros em Java;
M1.06 — tipos decimais e primeiras limitações;
M1.07 — boolean e regras verdadeiras/falsas;
M1.08 — char e String em uso inicial;
M1.09 — String básica;
M1.10 — entrada de dados com Scanner.
```

Agora vamos estudar operadores aritméticos.

Até aqui, criamos variáveis e guardamos valores.

Agora vamos calcular.

Exemplo:

```java
int quantidadeEstoque = 10;
int quantidadeReservada = 3;

int quantidadeDisponivel = quantidadeEstoque - quantidadeReservada;
```

Esse pequeno cálculo já representa regra de negócio.

Aritmética em Java não é só fazer conta.

É transformar dados em informação.

---

## Hoje a aula é sobre calcular com clareza

Em backend, cálculos aparecem o tempo todo.

Exemplos:

```text
total de itens;
quantidade disponível;
quantidade restante;
valor total;
valor de desconto;
percentual de conclusão;
tempo restante;
página inicial;
offset de paginação;
quantidade de tentativas;
saldo em centavos;
média de avaliações;
prazo em dias;
diferença entre datas em quantidade de dias;
contadores de eventos;
controle de lote.
```

Mesmo sistemas grandes dependem de pequenas operações corretas.

Um erro simples como:

```java
10 / 4
```

quando você esperava:

```text
2.5
```

pode gerar regra errada.

Um erro de precedência pode transformar um cálculo correto em resultado incorreto.

Por isso, operadores aritméticos precisam ser estudados com atenção.

---

## Operadores aritméticos principais

Java possui estes operadores aritméticos básicos:

| Operador | Nome | Exemplo | Resultado |
|---|---|---|---|
| `+` | soma | `10 + 5` | `15` |
| `-` | subtração | `10 - 5` | `5` |
| `*` | multiplicação | `10 * 5` | `50` |
| `/` | divisão | `10 / 5` | `2` |
| `%` | resto da divisão | `10 % 3` | `1` |

Esses operadores trabalham com valores numéricos.

Exemplos:

```java
int soma = 10 + 5;
int subtracao = 10 - 5;
int multiplicacao = 10 * 5;
int divisao = 10 / 5;
int resto = 10 % 3;
```

---

## Soma com `+`

O operador:

```java
+
```

soma números.

Exemplo:

```java
int quantidadeA = 10;
int quantidadeB = 5;

int total = quantidadeA + quantidadeB;

System.out.println(total);
```

Saída:

```text
15
```

A soma é usada para:

```text
totalizar;
acumular;
somar itens;
somar valores;
somar eventos;
somar quantidades.
```

---

## Subtração com `-`

O operador:

```java
-
```

subtrai.

Exemplo:

```java
int estoqueTotal = 10;
int estoqueReservado = 3;

int estoqueDisponivel = estoqueTotal - estoqueReservado;

System.out.println(estoqueDisponivel);
```

Saída:

```text
7
```

A subtração é usada para:

```text
calcular restante;
calcular diferença;
reduzir estoque;
abater desconto;
calcular saldo;
calcular prazo restante.
```

---

## Multiplicação com `*`

O operador:

```java
*
```

multiplica.

Exemplo:

```java
int quantidade = 4;
int valorUnitarioCentavos = 2500;

int valorTotalCentavos = quantidade * valorUnitarioCentavos;

System.out.println(valorTotalCentavos);
```

Saída:

```text
10000
```

Isso representa:

```text
4 itens * 2500 centavos = 10000 centavos.
```

A multiplicação é usada para:

```text
quantidade vezes valor;
percentual;
cálculo de lote;
cálculo de páginas;
cálculo de totais;
projeções.
```

---

## Divisão com `/`

O operador:

```java
/
```

divide.

Exemplo com inteiro exato:

```java
int total = 10;
int partes = 2;

int resultado = total / partes;

System.out.println(resultado);
```

Saída:

```text
5
```

Mas a divisão exige cuidado quando envolve inteiros.

Exemplo:

```java
int total = 10;
int partes = 4;

int resultado = total / partes;

System.out.println(resultado);
```

Saída:

```text
2
```

Não é `2.5`, porque a divisão foi inteira.

---

## Divisão inteira

Quando os dois lados da divisão são inteiros, Java faz divisão inteira.

Exemplo:

```java
int resultado = 10 / 4;

System.out.println(resultado);
```

Saída:

```text
2
```

A parte decimal é descartada.

Não arredonda.

Não vira `3`.

Apenas descarta o resto.

Isso é muito importante.

---

## Divisão decimal

Para obter resultado decimal, use `double` em pelo menos um dos lados.

Exemplo:

```java
double resultado = 10.0 / 4;

System.out.println(resultado);
```

Saída:

```text
2.5
```

Outro exemplo:

```java
int total = 10;
int partes = 4;

double resultado = (double) total / partes;

System.out.println(resultado);
```

Saída:

```text
2.5
```

O cast:

```java
(double) total
```

faz a divisão virar decimal.

---

## Armadilha: guardar divisão inteira em double

Código:

```java
double resultado = 10 / 4;

System.out.println(resultado);
```

Saída:

```text
2.0
```

Por quê?

Porque primeiro o Java calcula:

```java
10 / 4
```

como divisão inteira.

Resultado:

```text
2
```

Depois coloca esse `2` dentro do `double` como:

```text
2.0
```

A variável final ser `double` não muda a operação que já aconteceu.

Correção:

```java
double resultado = 10.0 / 4;
```

ou:

```java
double resultado = (double) 10 / 4;
```

---

## Resto da divisão com `%`

O operador:

```java
%
```

retorna o resto da divisão.

Exemplo:

```java
int resto = 10 % 3;

System.out.println(resto);
```

Saída:

```text
1
```

Porque:

```text
10 dividido por 3 dá 3, e sobra 1.
```

Outro exemplo:

```java
int resto = 10 % 2;

System.out.println(resto);
```

Saída:

```text
0
```

Porque 10 é divisível por 2.

---

## Para que serve o resto

O operador `%` é muito útil.

Exemplos:

```text
verificar se número é par;
verificar múltiplos;
alternar comportamento;
calcular ciclos;
distribuir itens;
paginação;
lógica de calendário;
quebrar lotes;
processar grupos.
```

Exemplo de número par:

```java
int numero = 10;

boolean numeroPar = numero % 2 == 0;

System.out.println(numeroPar);
```

Saída:

```text
true
```

Ainda vamos aprofundar operadores relacionais na próxima aula.

Mas já podemos ler:

```text
número é par se o resto da divisão por 2 é zero.
```

---

## Resto em lote

Imagine dividir itens em caixas com capacidade 10.

```java
int quantidadeItens = 23;
int capacidadeCaixa = 10;

int caixasCompletas = quantidadeItens / capacidadeCaixa;
int itensRestantes = quantidadeItens % capacidadeCaixa;

System.out.println("Caixas completas: " + caixasCompletas);
System.out.println("Itens restantes: " + itensRestantes);
```

Saída:

```text
Caixas completas: 2
Itens restantes: 3
```

Isso é muito útil em lógica de lote.

---

## Precedência de operadores

Java não calcula sempre da esquerda para a direita sem regra.

Existe precedência.

Multiplicação, divisão e resto vêm antes de soma e subtração.

Exemplo:

```java
int resultado = 10 + 5 * 2;

System.out.println(resultado);
```

Saída:

```text
20
```

Por quê?

Porque primeiro calcula:

```text
5 * 2 = 10
```

Depois:

```text
10 + 10 = 20
```

Não é:

```text
(10 + 5) * 2 = 30
```

---

## Parênteses

Parênteses controlam a ordem.

Exemplo:

```java
int resultado = (10 + 5) * 2;

System.out.println(resultado);
```

Saída:

```text
30
```

Com parênteses, primeiro vem:

```text
10 + 5 = 15
```

Depois:

```text
15 * 2 = 30
```

Regra profissional:

```text
quando a expressão puder gerar dúvida, use parênteses.
```

Mesmo que a precedência resolva, parênteses podem melhorar leitura.

---

## Precedência prática

Ordem simplificada nesta aula:

```text
1. parênteses;
2. multiplicação, divisão e resto;
3. soma e subtração.
```

Exemplo:

```java
int resultado = 20 - 4 * 3 + 10 / 2;
```

Passos:

```text
4 * 3 = 12;
10 / 2 = 5;
20 - 12 + 5 = 13.
```

Resultado:

```text
13
```

Se quiser outra ordem, use parênteses.

---

## Expressão legível

Compare:

```java
int total = quantidade * valorUnitario - desconto + frete;
```

com:

```java
int subtotal = quantidade * valorUnitario;
int total = subtotal - desconto + frete;
```

A segunda versão pode ser mais legível.

Nem sempre uma expressão gigante é melhor.

Variáveis intermediárias ajudam a explicar o cálculo.

Essa é uma prática profissional.

---

## Variáveis intermediárias

Exemplo:

```java
int quantidadeItens = 4;
int valorUnitarioCentavos = 2500;
int valorFreteCentavos = 1500;

int subtotalCentavos = quantidadeItens * valorUnitarioCentavos;
int totalCentavos = subtotalCentavos + valorFreteCentavos;

System.out.println("Subtotal: " + subtotalCentavos);
System.out.println("Total: " + totalCentavos);
```

Isso é melhor do que:

```java
int totalCentavos = quantidadeItens * valorUnitarioCentavos + valorFreteCentavos;
```

quando você quer explicar etapas.

Código claro é mais fácil de testar, revisar e corrigir.

---

## Operadores com tipos diferentes

Quando mistura `int` e `double`, o resultado tende a ser `double`.

Exemplo:

```java
int quantidade = 3;
double valorUnitario = 19.90;

double total = quantidade * valorUnitario;

System.out.println(total);
```

Resultado:

```text
59.699999999999996
```

Esse resultado mostra novamente a limitação de `double`.

Para dinheiro real, cuidado.

Para exemplo didático, serve para entender tipos.

---

## Cálculo monetário didático

Exemplo didático com `double`:

```java
double valorProduto = 100.00;
double percentualDesconto = 10.0;

double valorDesconto = valorProduto * percentualDesconto / 100;
double valorFinal = valorProduto - valorDesconto;

System.out.println("Desconto: " + valorDesconto);
System.out.println("Final: " + valorFinal);
```

Esse exemplo ensina aritmética.

Mas, em regra financeira real, vamos usar abordagem mais segura no futuro.

Por enquanto, registre:

```text
double é didático aqui;
dinheiro real exige cuidado.
```

---

## Cálculo monetário com centavos

Exemplo mais seguro para inteiros:

```java
long valorProdutoCentavos = 10000L;
int percentualDesconto = 10;

long valorDescontoCentavos = valorProdutoCentavos * percentualDesconto / 100;
long valorFinalCentavos = valorProdutoCentavos - valorDescontoCentavos;

System.out.println("Desconto em centavos: " + valorDescontoCentavos);
System.out.println("Final em centavos: " + valorFinalCentavos);
```

Saída:

```text
Desconto em centavos: 1000
Final em centavos: 9000
```

Representa:

```text
R$ 10,00 de desconto;
R$ 90,00 final.
```

Ainda não formatamos como moeda, mas evitamos ponto flutuante.

---

## Incremento simples

Muitas vezes queremos somar 1.

Exemplo:

```java
int tentativas = 0;

tentativas = tentativas + 1;

System.out.println(tentativas);
```

Saída:

```text
1
```

Isso significa:

```text
tentativas recebe o valor atual de tentativas mais 1.
```

Mais tarde veremos operadores de incremento como:

```java
tentativas++;
```

Nesta aula, use a forma explícita primeiro.

---

## Acumulador

Acumulador é uma variável que guarda uma soma progressiva.

Exemplo:

```java
int total = 0;

total = total + 10;
total = total + 20;
total = total + 30;

System.out.println(total);
```

Saída:

```text
60
```

Acumuladores serão muito usados com loops.

Por enquanto, entenda a ideia.

---

## Diferença entre cálculo e atribuição

Código:

```java
int total = 10 + 5;
```

Aqui acontece:

```text
10 + 5 é calculado;
resultado 15 é atribuído à variável total.
```

Outro exemplo:

```java
int quantidade = 10;
quantidade = quantidade - 3;
```

Leitura:

```text
quantidade recebe o valor atual de quantidade menos 3.
```

Não leia como matemática pura:

```text
quantidade é igual a quantidade menos 3.
```

Em programação, o lado direito é calculado primeiro.

Depois o resultado é guardado no lado esquerdo.

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int valorA = 10;
        int valorB = 3;

        int soma = valorA + valorB;
        int subtracao = valorA - valorB;
        int multiplicacao = valorA * valorB;
        int divisao = valorA / valorB;
        int resto = valorA % valorB;

        System.out.println("Soma: " + soma);
        System.out.println("Subtração: " + subtracao);
        System.out.println("Multiplicação: " + multiplicacao);
        System.out.println("Divisão: " + divisao);
        System.out.println("Resto: " + resto);
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
Soma: 13
Subtração: 7
Multiplicação: 30
Divisão: 3
Resto: 1
```

A divisão é `3`, não `3.333...`, porque é divisão inteira.

---

## Exemplo com divisão decimal

Arquivo:

```text
DivisaoDecimal.java
```

Código:

```java
public class DivisaoDecimal {
    public static void main(String[] args) {
        int valorA = 10;
        int valorB = 3;

        double divisaoInteiraGuardadaEmDouble = valorA / valorB;
        double divisaoDecimal = (double) valorA / valorB;

        System.out.println("Divisão inteira guardada em double: " + divisaoInteiraGuardadaEmDouble);
        System.out.println("Divisão decimal: " + divisaoDecimal);
    }
}
```

Saída:

```text
Divisão inteira guardada em double: 3.0
Divisão decimal: 3.3333333333333335
```

Esse exemplo é essencial.

Ele mostra que o tipo da operação importa.

---

## Exemplo com precedência

Arquivo:

```text
PrecedenciaAritmetica.java
```

Código:

```java
public class PrecedenciaAritmetica {
    public static void main(String[] args) {
        int resultadoSemParenteses = 10 + 5 * 2;
        int resultadoComParenteses = (10 + 5) * 2;

        System.out.println("Sem parênteses: " + resultadoSemParenteses);
        System.out.println("Com parênteses: " + resultadoComParenteses);
    }
}
```

Saída:

```text
Sem parênteses: 20
Com parênteses: 30
```

Esse exemplo mostra que parênteses mudam resultado.

---

## Exemplo aplicado ao domínio corporativo: pedido

Arquivo:

```text
CalculoPedido.java
```

Código:

```java
public class CalculoPedido {
    public static void main(String[] args) {
        int quantidadeItens = 4;
        long valorUnitarioCentavos = 2500L;
        long valorFreteCentavos = 1500L;

        long subtotalCentavos = quantidadeItens * valorUnitarioCentavos;
        long totalCentavos = subtotalCentavos + valorFreteCentavos;

        System.out.println("Quantidade de itens: " + quantidadeItens);
        System.out.println("Valor unitário em centavos: " + valorUnitarioCentavos);
        System.out.println("Subtotal em centavos: " + subtotalCentavos);
        System.out.println("Frete em centavos: " + valorFreteCentavos);
        System.out.println("Total em centavos: " + totalCentavos);
    }
}
```

Resultado:

```text
Subtotal em centavos: 10000
Total em centavos: 11500
```

Representa:

```text
subtotal R$ 100,00;
total R$ 115,00.
```

---

## Exemplo aplicado ao domínio corporativo: estoque

Arquivo:

```text
CalculoEstoque.java
```

Código:

```java
public class CalculoEstoque {
    public static void main(String[] args) {
        int quantidadeEstoque = 120;
        int quantidadeReservada = 15;
        int quantidadeVendida = 20;

        int quantidadeDisponivel = quantidadeEstoque - quantidadeReservada - quantidadeVendida;

        System.out.println("Estoque total: " + quantidadeEstoque);
        System.out.println("Reservado: " + quantidadeReservada);
        System.out.println("Vendido: " + quantidadeVendida);
        System.out.println("Disponível: " + quantidadeDisponivel);
    }
}
```

Esse cálculo representa regra simples de disponibilidade.

---

## Exemplo aplicado ao domínio corporativo: paginação

Arquivo:

```text
CalculoPaginacao.java
```

Código:

```java
public class CalculoPaginacao {
    public static void main(String[] args) {
        int paginaAtual = 2;
        int tamanhoPagina = 20;

        int offset = paginaAtual * tamanhoPagina;

        System.out.println("Página atual: " + paginaAtual);
        System.out.println("Tamanho da página: " + tamanhoPagina);
        System.out.println("Offset: " + offset);
    }
}
```

Se a página começa em zero, a página 2 com tamanho 20 começa no item 40.

Esse cálculo aparece em APIs e consultas.

Mais tarde, veremos isso com banco de dados.

---

## Exemplo aplicado ao domínio corporativo: lote

Arquivo:

```text
CalculoLote.java
```

Código:

```java
public class CalculoLote {
    public static void main(String[] args) {
        int totalItens = 23;
        int tamanhoLote = 10;

        int lotesCompletos = totalItens / tamanhoLote;
        int itensRestantes = totalItens % tamanhoLote;

        System.out.println("Total de itens: " + totalItens);
        System.out.println("Tamanho do lote: " + tamanhoLote);
        System.out.println("Lotes completos: " + lotesCompletos);
        System.out.println("Itens restantes: " + itensRestantes);
    }
}
```

Saída:

```text
Lotes completos: 2
Itens restantes: 3
```

Isso é uso real de divisão inteira e resto.

---

## Exemplo aplicado ao domínio corporativo: percentual de conclusão

Arquivo:

```text
PercentualConclusao.java
```

Código:

```java
public class PercentualConclusao {
    public static void main(String[] args) {
        int atividadesConcluidas = 7;
        int totalAtividades = 10;

        double percentualConclusao = ((double) atividadesConcluidas / totalAtividades) * 100;

        System.out.println("Atividades concluídas: " + atividadesConcluidas);
        System.out.println("Total de atividades: " + totalAtividades);
        System.out.println("Percentual de conclusão: " + percentualConclusao + "%");
    }
}
```

Sem o cast, o resultado seria errado.

Com o cast, temos:

```text
70.0%
```

---

## Exemplo aplicado com Scanner: cálculo de pedido

Arquivo:

```text
CalculoPedidoConsole.java
```

Código:

```java
import java.util.Scanner;

public class CalculoPedidoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade de itens:");
        int quantidadeItens = scanner.nextInt();

        System.out.println("Digite o valor unitário em centavos:");
        long valorUnitarioCentavos = scanner.nextLong();

        System.out.println("Digite o frete em centavos:");
        long valorFreteCentavos = scanner.nextLong();

        long subtotalCentavos = quantidadeItens * valorUnitarioCentavos;
        long totalCentavos = subtotalCentavos + valorFreteCentavos;

        System.out.println("Subtotal em centavos: " + subtotalCentavos);
        System.out.println("Total em centavos: " + totalCentavos);

        scanner.close();
    }
}
```

Esse exemplo junta:

```text
Scanner;
int;
long;
multiplicação;
soma;
domínio de pedido.
```

---

## Exemplo aplicado com Scanner: cálculo de lotes

Arquivo:

```text
CalculoLoteConsole.java
```

Código:

```java
import java.util.Scanner;

public class CalculoLoteConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o total de itens:");
        int totalItens = scanner.nextInt();

        System.out.println("Digite o tamanho do lote:");
        int tamanhoLote = scanner.nextInt();

        int lotesCompletos = totalItens / tamanhoLote;
        int itensRestantes = totalItens % tamanhoLote;

        System.out.println("Lotes completos: " + lotesCompletos);
        System.out.println("Itens restantes: " + itensRestantes);

        scanner.close();
    }
}
```

Entrada:

```text
23
10
```

Saída:

```text
Lotes completos: 2
Itens restantes: 3
```

Atenção: se `tamanhoLote` for zero, dará erro.

Tratamento de divisão por zero será comentado a seguir.

---

## Divisão por zero

Divisão inteira por zero gera erro em execução.

Exemplo:

```java
int resultado = 10 / 0;
```

Erro:

```text
ArithmeticException: / by zero
```

O mesmo vale para:

```java
int resto = 10 % 0;
```

Nunca divida por zero.

Antes de dividir, a regra precisa garantir que o divisor é diferente de zero.

Exemplo futuro com `if`:

```java
if (tamanhoLote != 0) {
    int lotes = totalItens / tamanhoLote;
}
```

Nesta aula, apenas entenda o risco.

---

## Divisão decimal por zero

Com `double`, o comportamento pode ser diferente.

Exemplo:

```java
double resultado = 10.0 / 0.0;

System.out.println(resultado);
```

Pode imprimir:

```text
Infinity
```

Isso também exige cuidado.

Regra profissional:

```text
divisor zero precisa ser tratado.
```

Não confie em resultado especial sem entender o domínio.

---

## Overflow em operações aritméticas

Aritmética também pode gerar overflow.

Exemplo:

```java
int valorA = 2_000_000_000;
int valorB = 2_000_000_000;

int resultado = valorA + valorB;

System.out.println(resultado);
```

O resultado não cabe em `int`.

Pode gerar valor incorreto.

Correção:

```java
long valorA = 2_000_000_000L;
long valorB = 2_000_000_000L;

long resultado = valorA + valorB;
```

Aritmética precisa respeitar limites dos tipos.

---

## Erros comuns

### Erro 1 — Esperar decimal em divisão inteira

Código:

```java
double resultado = 10 / 4;
```

Resultado:

```text
2.0
```

Correção:

```java
double resultado = 10.0 / 4;
```

ou:

```java
double resultado = (double) 10 / 4;
```

---

### Erro 2 — Esquecer precedência

Código:

```java
int resultado = 10 + 5 * 2;
```

Resultado:

```text
20
```

Se queria 30:

```java
int resultado = (10 + 5) * 2;
```

---

### Erro 3 — Soma virar concatenação

Código:

```java
System.out.println("Resultado: " + 10 + 20);
```

Saída:

```text
Resultado: 1020
```

Correção:

```java
System.out.println("Resultado: " + (10 + 20));
```

---

### Erro 4 — Dividir por zero

Erro:

```java
int resultado = 10 / 0;
```

Correção:

```text
validar divisor antes.
```

---

### Erro 5 — Usar `%` sem entender resto

Código:

```java
int resto = 10 % 3;
```

Resultado:

```text
1
```

Não é porcentagem.

É resto da divisão.

---

### Erro 6 — Confundir `%` com percentual

Em Java:

```java
%
```

é operador de resto.

Não significa “por cento” em cálculo aritmético direto.

Para calcular 10% de 200:

```java
int valor = 200;
int percentual = 10;

int resultado = valor * percentual / 100;
```

Resultado:

```text
20
```

---

### Erro 7 — Esquecer que dinheiro com double é perigoso

Exemplo didático:

```java
double total = 0.1 + 0.2;
```

Pode gerar:

```text
0.30000000000000004
```

Para dinheiro real, veremos abordagem adequada depois.

---

### Erro 8 — Expressão grande sem variáveis intermediárias

Ruim:

```java
long total = quantidade * valorUnitario - desconto + frete + taxa - bonus;
```

Pode ser correto, mas difícil de revisar.

Melhor:

```java
long subtotal = quantidade * valorUnitario;
long totalComFrete = subtotal + frete;
long totalFinal = totalComFrete - desconto;
```

Depende do contexto.

Clareza é prioridade.

---

### Erro 9 — Overflow silencioso

Código:

```java
int resultado = 2_000_000_000 + 2_000_000_000;
```

Pode gerar resultado incorreto.

Use `long` quando necessário.

---

### Erro 10 — Não testar com valores diferentes

Um cálculo pode parecer certo com um exemplo e falhar em outro.

Teste:

```text
valores pequenos;
zero;
valores grandes;
valores que geram resto;
valores com divisão não exata.
```

---

## Diagnóstico de erro com operadores aritméticos

Quando o resultado estiver errado, siga o roteiro.

### 1. Quais operadores aparecem?

```text
+;
-;
*;
/;
%.
```

### 2. Há divisão?

Verifique se é inteira ou decimal.

### 3. Há divisor zero?

Se sim, o erro está aí.

### 4. Há resto `%`?

Confirme se você queria resto mesmo, não porcentagem.

### 5. Há precedência envolvida?

Use parênteses.

### 6. Há concatenação com String?

Se sim, confira parênteses.

### 7. Há valores grandes?

Verifique overflow.

### 8. O tipo do resultado é adequado?

`int`, `long` ou `double`?

### 9. A expressão está grande demais?

Quebre em variáveis intermediárias.

### 10. O resultado foi testado com casos diferentes?

Teste mais de um cenário.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Divisão inteira

```java
public class Main {
    public static void main(String[] args) {
        double resultado = 10 / 4;

        System.out.println(resultado);
    }
}
```

Observe `2.0`.

Corrija com:

```java
double resultado = 10.0 / 4;
```

### Teste 2 — Precedência

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(10 + 5 * 2);
        System.out.println((10 + 5) * 2);
    }
}
```

Compare os resultados.

### Teste 3 — Resto

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(10 % 3);
        System.out.println(10 % 2);
    }
}
```

Observe os restos.

### Teste 4 — Divisão por zero

```java
public class Main {
    public static void main(String[] args) {
        int resultado = 10 / 0;

        System.out.println(resultado);
    }
}
```

Execute e leia o erro.

### Teste 5 — Soma virando concatenação

```java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println("Resultado: " + a + b);
        System.out.println("Resultado: " + (a + b));
    }
}
```

Compare os resultados.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-031-operadores-aritmeticos
cd labs\m1\aula-031-operadores-aritmeticos
```

Crie arquivos:

```text
Main.java
DivisaoDecimal.java
PrecedenciaAritmetica.java
CalculoPedido.java
CalculoEstoque.java
CalculoPaginacao.java
CalculoLote.java
PercentualConclusao.java
CalculoPedidoConsole.java
CalculoLoteConsole.java
```

Compile:

```powershell
javac Main.java
javac DivisaoDecimal.java
javac PrecedenciaAritmetica.java
javac CalculoPedido.java
javac CalculoEstoque.java
javac CalculoPaginacao.java
javac CalculoLote.java
javac PercentualConclusao.java
javac CalculoPedidoConsole.java
javac CalculoLoteConsole.java
```

Execute:

```powershell
java Main
java DivisaoDecimal
java PrecedenciaAritmetica
java CalculoPedido
java CalculoEstoque
java CalculoPaginacao
java CalculoLote
java PercentualConclusao
java CalculoPedidoConsole
java CalculoLoteConsole
```

Depois quebre erros de propósito e registre no diário.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar expressões |
| Renomear variável | `Shift + F6` | Melhorar nomes de cálculos |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver valores intermediários |
| Step Over | `F8` em muitos keymaps | Avançar linha por linha |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Recent Files | `Ctrl + E` | Alternar arquivos |
| Commit | `Ctrl + K` | Revisar alterações |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug para operadores aritméticos

Use debug para ver valores intermediários.

Exemplo:

```java
int quantidadeItens = 4;
long valorUnitarioCentavos = 2500L;
long valorFreteCentavos = 1500L;

long subtotalCentavos = quantidadeItens * valorUnitarioCentavos;
long totalCentavos = subtotalCentavos + valorFreteCentavos;
```

Coloque breakpoint na linha do subtotal.

Avance com Step Over.

Observe:

```text
quantidadeItens;
valorUnitarioCentavos;
valorFreteCentavos;
subtotalCentavos;
totalCentavos.
```

Debug ajuda a enxergar a conta acontecendo linha por linha.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 031 — Operadores aritméticos

### O que aprendi
Aprendi os operadores aritméticos `+`, `-`, `*`, `/` e `%`, além de precedência, parênteses, divisão inteira, divisão decimal e resto da divisão.

### O que pratiquei
Criei exemplos de soma, subtração, multiplicação, divisão, resto, cálculo de pedido, estoque, paginação, lote e percentual de conclusão.

### Conceitos principais
- soma
- subtração
- multiplicação
- divisão
- resto da divisão
- divisão inteira
- divisão decimal
- precedência
- parênteses
- variáveis intermediárias
- divisor zero
- overflow
- concatenação acidental
- cálculo em centavos

### Arquivos criados
- `labs/m1/aula-031-operadores-aritmeticos/Main.java`
- `labs/m1/aula-031-operadores-aritmeticos/DivisaoDecimal.java`
- `labs/m1/aula-031-operadores-aritmeticos/PrecedenciaAritmetica.java`
- `labs/m1/aula-031-operadores-aritmeticos/CalculoPedido.java`
- `labs/m1/aula-031-operadores-aritmeticos/CalculoEstoque.java`
- `labs/m1/aula-031-operadores-aritmeticos/CalculoPaginacao.java`
- `labs/m1/aula-031-operadores-aritmeticos/CalculoLote.java`
- `labs/m1/aula-031-operadores-aritmeticos/PercentualConclusao.java`
- `labs/m1/aula-031-operadores-aritmeticos/CalculoPedidoConsole.java`
- `labs/m1/aula-031-operadores-aritmeticos/CalculoLoteConsole.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac DivisaoDecimal.java
java DivisaoDecimal
javac PrecedenciaAritmetica.java
java PrecedenciaAritmetica
javac CalculoPedido.java
java CalculoPedido
```

### Erros que quero evitar
- esperar decimal em divisão inteira;
- esquecer precedência;
- esquecer parênteses;
- soma virar concatenação;
- dividir por zero;
- confundir `%` com porcentagem;
- ignorar overflow;
- usar `double` para dinheiro real sem critério;
- criar expressão grande sem clareza;
- testar cálculo com apenas um cenário.

### Próximo passo
Estudar operadores relacionais.
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
git add labs/m1/aula-031-operadores-aritmeticos docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 031: pratica operadores aritmeticos em Java"
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
1. Quais são os operadores aritméticos básicos em Java?
2. Para que serve o operador `%`?
3. Qual o resultado de `10 / 4` em uma divisão inteira?
4. Como fazer `10 / 4` resultar em `2.5`?
5. Por que `double resultado = 10 / 4;` gera `2.0`?
6. Qual operador tem prioridade: soma ou multiplicação?
7. Para que servem parênteses em expressões aritméticas?
8. Por que `"Resultado: " + 10 + 20` gera `Resultado: 1020`?
9. O que acontece ao dividir inteiro por zero?
10. Por que variáveis intermediárias podem melhorar um cálculo?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
usar soma;
usar subtração;
usar multiplicação;
usar divisão;
usar resto da divisão;
explicar divisão inteira;
corrigir divisão inteira para decimal;
usar cast para double em exemplo simples;
explicar operador de resto;
usar resto para identificar sobra;
usar resto em cálculo de lote;
explicar precedência;
usar parênteses;
evitar soma virar concatenação;
explicar divisor zero;
identificar risco de overflow;
usar variáveis intermediárias;
aplicar cálculo em pedido;
aplicar cálculo em estoque;
aplicar cálculo em paginação;
aplicar cálculo em lote;
aplicar cálculo de percentual;
usar Scanner em cálculo simples;
debugar valores intermediários;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar operadores compostos como `+=`.

Não precisa ainda dominar incremento `++` em profundidade.

Não precisa ainda dominar `Math`.

Não precisa ainda dominar BigDecimal.

Esses assuntos virão depois.

O objetivo é dominar os operadores aritméticos básicos e os erros mais comuns.

---

## Fechamento da aula

Hoje começamos a transformar variáveis em cálculos.

Os operadores aritméticos são simples na aparência:

```text
+;
-;
*;
/;
%.
```

Mas carregam armadilhas importantes:

```text
divisão inteira;
precedência;
parênteses;
resto;
divisão por zero;
overflow;
concatenação acidental;
dinheiro com double.
```

Em backend, esses detalhes aparecem em regras reais:

```text
pedido;
estoque;
paginação;
lote;
percentual;
contador;
saldo;
prazo;
tentativas.
```

A partir da próxima aula, vamos estudar operadores relacionais.

Com operadores relacionais, os cálculos começam a virar perguntas:

```text
quantidade > 0?
valor <= limite?
status é igual?
total é diferente de zero?
```

Esse é o caminho para condicionais e regras de negócio completas.
