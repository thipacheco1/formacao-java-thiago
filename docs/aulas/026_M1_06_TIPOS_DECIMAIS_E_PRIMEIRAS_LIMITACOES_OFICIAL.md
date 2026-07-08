# 026 — M1.06 — Tipos Decimais e Primeiras Limitações

## Hoje a aula é sobre decimais sem ingenuidade

Na vida real, parece simples:

```text
0,1 + 0,2 = 0,3
```

Mas em linguagens de programação, números decimais como `double` e `float` usam representação binária aproximada.

Isso pode gerar resultados inesperados.

Exemplo clássico em Java:

```java
double resultado = 0.1 + 0.2;

System.out.println(resultado);
```

Você talvez espere:

```text
0.3
```

Mas pode ver algo como:

```text
0.30000000000000004
```

Isso não significa que Java está quebrado.

Significa que `double` não representa todos os decimais exatamente.

Nesta aula, vamos entender o básico sem entrar ainda em matemática pesada.

---

## O que é um número decimal

Número decimal é número com parte fracionária.

Exemplos:

```text
10.5;
99.90;
0.25;
3.1415;
150.75.
```

Em Java, usamos ponto como separador decimal:

```java
double valor = 99.90;
```

Não usamos vírgula:

```java
double valor = 99,90; // errado
```

No código Java, o separador decimal é:

```text
.
```

Mesmo que em português a gente escreva `99,90`.

---

## `float` e `double`

Java possui dois tipos primitivos principais para números decimais:

```text
float;
double.
```

Diferença geral:

| Tipo | Tamanho | Precisão aproximada | Uso comum |
|---|---:|---:|---|
| `float` | 32 bits | menor | casos específicos, gráficos, interoperabilidade, economia de memória |
| `double` | 64 bits | maior | decimal padrão em exemplos e cálculos gerais |

Regra prática inicial:

```text
use double para números decimais comuns;
use float apenas quando houver motivo claro;
não use double/float para dinheiro real sem entender as limitações.
```

---

## `double` é o padrão decimal comum

Quando você escreve:

```java
double valor = 10.5;
```

isso é natural.

Em Java, um literal decimal como:

```java
10.5
```

é tratado como `double` por padrão.

Por isso:

```java
double valor = 10.5;
```

funciona sem sufixo.

Exemplos:

```java
double nota = 8.5;
double peso = 72.3;
double distanciaKm = 15.75;
double percentualDesconto = 12.5;
```

`double` é o decimal mais comum no começo.

---

## `float` precisa de sufixo `F`

Se você tentar:

```java
float nota = 8.5;
```

pode dar erro.

Por quê?

Porque `8.5` é um literal `double` por padrão.

Para indicar `float`, use:

```java
float nota = 8.5F;
```

ou:

```java
float nota = 8.5f;
```

Prefira:

```java
F
```

maiúsculo, por legibilidade.

Exemplo:

```java
float temperatura = 36.5F;
```

Regra:

```text
literal decimal para float precisa de F.
```

---

## `double` não precisa de sufixo

Exemplo:

```java
double temperatura = 36.5;
double valorMedio = 150.75;
double percentual = 12.5;
```

Isso funciona porque decimal sem sufixo é `double`.

Também existe sufixo `D`:

```java
double valor = 10.5D;
```

Mas quase nunca é necessário no começo.

Use simplesmente:

```java
double valor = 10.5;
```

---

## Ponto decimal, não vírgula

Errado:

```java
double valor = 99,90;
```

Certo:

```java
double valor = 99.90;
```

No Brasil, escrevemos dinheiro com vírgula:

```text
R$ 99,90
```

Mas em Java, no código, decimal usa ponto:

```java
99.90
```

Isso vale para:

```text
double;
float;
literais decimais;
cálculos.
```

---

## Decimal não é texto

Errado:

```java
double valor = "99.90";
```

Aqui `"99.90"` é texto.

Certo:

```java
double valor = 99.90;
```

Se está entre aspas duplas, é `String`.

Se é número decimal sem aspas, pode ser `double`.

---

## Exemplo mínimo com `double`

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        double valorProduto = 99.90;

        System.out.println("Valor do produto: " + valorProduto);
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
Valor do produto: 99.9
```

Perceba que o Java pode imprimir `99.9`, não necessariamente `99.90`.

Isso não significa que perdeu dinheiro aqui.

Significa que a impressão padrão não formata casas decimais como moeda.

Formatação será estudada depois.

---

## Exemplo mínimo com `float`

Código:

```java
public class Main {
    public static void main(String[] args) {
        float temperatura = 36.5F;

        System.out.println("Temperatura: " + temperatura);
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
Temperatura: 36.5
```

O `F` foi necessário porque `36.5` seria `double` por padrão.

---

## Comparando `float` e `double`

Código:

```java
public class Main {
    public static void main(String[] args) {
        float valorFloat = 1.23456789F;
        double valorDouble = 1.23456789;

        System.out.println("float: " + valorFloat);
        System.out.println("double: " + valorDouble);
    }
}
```

A saída pode mostrar que `float` guarda menos precisão.

Exemplo possível:

```text
float: 1.2345679
double: 1.23456789
```

O `float` arredondou mais cedo.

Regra prática:

```text
double tem mais precisão que float.
```

---

## Precisão aproximada

`float` e `double` são tipos de ponto flutuante.

Eles representam muitos números decimais de forma aproximada.

Isso é normal nesse modelo.

Exemplo:

```java
double resultado = 0.1 + 0.2;

System.out.println(resultado);
```

Saída possível:

```text
0.30000000000000004
```

Esse comportamento surpreende no começo.

Mas é essencial saber.

`double` não deve ser tratado como se fosse uma calculadora decimal exata.

---

## Por que `0.1 + 0.2` pode não dar exatamente `0.3`

Computadores representam números em binário.

Alguns números decimais não têm representação binária exata finita.

Então eles são aproximados.

Quando você soma aproximações, o resultado pode ter uma pequena diferença.

No uso comum, isso pode ser aceitável.

Exemplos onde `double` pode servir:

```text
medidas aproximadas;
temperatura;
distância;
peso;
percentuais em cálculos simples;
médias estatísticas;
simulações;
dados científicos com tolerância.
```

Exemplos onde exige cuidado maior:

```text
dinheiro;
cobrança;
juros;
saldo;
imposto;
comissão;
contabilidade;
divisão financeira.
```

---

## Dinheiro não deve ser tratado com ingenuidade

Exemplo perigoso:

```java
double valorProduto = 0.10;
double valorFrete = 0.20;
double total = valorProduto + valorFrete;

System.out.println(total);
```

Pode imprimir:

```text
0.30000000000000004
```

Agora imagine isso em:

```text
pagamento;
saldo;
fatura;
remuneração;
comissão;
nota fiscal;
provisão;
imposto.
```

Não é aceitável depender de aproximação sem controle.

Mais tarde, vamos estudar:

```text
BigDecimal;
arredondamento;
escala;
representação monetária;
valores em centavos;
formatação.
```

Por enquanto, guarde a regra:

```text
para dinheiro real, não use double de forma ingênua.
```

---

## Alternativa inicial: centavos como inteiro

Na aula anterior, vimos uma alternativa simples:

```java
long valorEmCentavos = 9990L;
```

Isso representa:

```text
R$ 99,90
```

Exemplo:

```java
long valorProdutoCentavos = 9990L;
long valorFreteCentavos = 1500L;
long totalCentavos = valorProdutoCentavos + valorFreteCentavos;

System.out.println("Total em centavos: " + totalCentavos);
```

Saída:

```text
Total em centavos: 11490
```

Isso significa:

```text
R$ 114,90
```

Ainda não estamos formatando para reais.

Mas estamos evitando erro decimal.

Essa técnica é comum em alguns contextos.

Para aplicações financeiras mais completas, `BigDecimal` será estudado depois.

---

## Decimal para medidas

`double` é mais aceitável quando o domínio tolera aproximação.

Exemplo:

```java
double pesoKg = 72.5;
double alturaMetros = 1.75;
double distanciaKm = 12.8;

System.out.println("Peso: " + pesoKg);
System.out.println("Altura: " + alturaMetros);
System.out.println("Distância: " + distanciaKm);
```

Para medidas físicas, sensores, médias e estatísticas, aproximação pode ser aceitável.

Mesmo assim, depende do sistema.

Em sistemas críticos, a regra pode ser mais rigorosa.

---

## Decimal para percentual

Percentuais podem usar `double` em exemplos simples.

Exemplo:

```java
double percentualDesconto = 10.5;

System.out.println("Desconto: " + percentualDesconto + "%");
```

Mas, em regras financeiras reais, desconto também pode impactar dinheiro.

Então o cálculo final deve ser tratado com cuidado.

Regra:

```text
percentual em exemplo didático pode usar double;
cálculo financeiro real exige abordagem mais segura.
```

---

## Divisão com inteiros versus divisão com decimais

Exemplo importante:

```java
int total = 10;
int quantidade = 4;

System.out.println(total / quantidade);
```

Saída:

```text
2
```

Por quê?

Porque os dois operandos são inteiros.

A divisão inteira descarta a parte decimal.

Agora:

```java
double total = 10;
double quantidade = 4;

System.out.println(total / quantidade);
```

Saída:

```text
2.5
```

Se quiser resultado decimal, pelo menos um dos lados precisa ser decimal:

```java
int total = 10;
int quantidade = 4;

double media = total / 4.0;

System.out.println(media);
```

Saída:

```text
2.5
```

Esse erro é muito comum.

---

## `10 / 4` não é `2.5` em Java

Código:

```java
public class Main {
    public static void main(String[] args) {
        double resultado = 10 / 4;

        System.out.println(resultado);
    }
}
```

Saída:

```text
2.0
```

Por quê?

Porque a divisão aconteceu entre inteiros:

```java
10 / 4
```

Resultado inteiro:

```text
2
```

Depois esse `2` foi colocado no `double` como:

```text
2.0
```

Correção:

```java
double resultado = 10.0 / 4;

System.out.println(resultado);
```

Saída:

```text
2.5
```

---

## Divisão inteira é uma armadilha inicial

Esse código parece certo:

```java
int totalItens = 10;
int quantidadePedidos = 4;

double mediaItensPorPedido = totalItens / quantidadePedidos;

System.out.println(mediaItensPorPedido);
```

Mas imprime:

```text
2.0
```

Correção:

```java
double mediaItensPorPedido = (double) totalItens / quantidadePedidos;
```

ou:

```java
double mediaItensPorPedido = totalItens / 4.0;
```

Ainda não vamos aprofundar casting.

Mas é importante saber que divisão entre inteiros gera resultado inteiro.

---

## Cast inicial para decimal

Cast é uma conversão explícita.

Exemplo:

```java
int totalItens = 10;
int quantidadePedidos = 4;

double mediaItensPorPedido = (double) totalItens / quantidadePedidos;

System.out.println(mediaItensPorPedido);
```

Saída:

```text
2.5
```

O trecho:

```java
(double) totalItens
```

converte `totalItens` para `double` antes da divisão.

Assim a divisão vira decimal.

Casting será aprofundado em outro momento.

Nesta aula, use apenas para entender a armadilha da divisão inteira.

---

## Exemplo com média

Arquivo:

```text
MediaPedidos.java
```

Código:

```java
public class MediaPedidos {
    public static void main(String[] args) {
        int totalItens = 10;
        int quantidadePedidos = 4;

        double mediaItensPorPedido = (double) totalItens / quantidadePedidos;

        System.out.println("Média de itens por pedido: " + mediaItensPorPedido);
    }
}
```

Saída:

```text
Média de itens por pedido: 2.5
```

Esse tipo de cálculo aparece em relatórios e indicadores.

---

## `double` e formatação

Quando você imprime:

```java
double valor = 99.90;

System.out.println(valor);
```

pode aparecer:

```text
99.9
```

Isso é a representação padrão da saída.

Não significa automaticamente que o valor monetário foi formatado corretamente.

Para exibir com duas casas, existem formas como:

```java
System.out.printf("%.2f%n", valor);
```

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        double valor = 99.9;

        System.out.printf("%.2f%n", valor);
    }
}
```

Saída:

```text
99.90
```

Mas formatação não resolve o problema de precisão em cálculos financeiros.

Formatação só muda como aparece.

---

## `printf` básico

`System.out.printf` permite imprimir texto formatado.

Exemplo:

```java
double percentual = 12.5;

System.out.printf("Percentual: %.2f%%%n", percentual);
```

Saída:

```text
Percentual: 12.50%
```

Explicação rápida:

```text
%.2f -> número decimal com 2 casas;
%% -> imprime o símbolo %;
%n -> quebra de linha.
```

Não vamos aprofundar formatação agora.

Use apenas como primeira exposição.

---

## Exemplo aplicado: distância de entrega

Arquivo:

```text
DistanciaEntrega.java
```

Código:

```java
public class DistanciaEntrega {
    public static void main(String[] args) {
        double distanciaKm = 12.75;
        double tempoEstimadoHoras = 0.5;

        System.out.println("Distância: " + distanciaKm + " km");
        System.out.println("Tempo estimado: " + tempoEstimadoHoras + " horas");
    }
}
```

Aqui `double` faz sentido.

Distância e tempo estimado podem ter casas decimais.

A precisão exata de dinheiro não é o foco.

---

## Exemplo aplicado: nota média de avaliação

Arquivo:

```text
MediaAvaliacao.java
```

Código:

```java
public class MediaAvaliacao {
    public static void main(String[] args) {
        double notaAtendimento = 4.5;
        double notaEntrega = 4.0;
        double notaProduto = 5.0;

        double media = (notaAtendimento + notaEntrega + notaProduto) / 3;

        System.out.println("Média da avaliação: " + media);
    }
}
```

Resultado:

```text
Média da avaliação: 4.5
```

Esse uso de `double` é aceitável para uma média simples de avaliação.

---

## Exemplo aplicado: percentual de conclusão

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

        System.out.println("Percentual de conclusão: " + percentualConclusao + "%");
    }
}
```

Saída:

```text
Percentual de conclusão: 70.0%
```

Aqui o cast evita divisão inteira.

Sem cast:

```java
atividadesConcluidas / totalAtividades
```

seria:

```text
0
```

porque `7 / 10` com inteiros resulta em `0`.

---

## Exemplo aplicado: pedido com valores

Arquivo:

```text
PedidoDecimal.java
```

Código:

```java
public class PedidoDecimal {
    public static void main(String[] args) {
        double valorProduto = 100.00;
        double percentualDesconto = 10.0;
        double valorDesconto = valorProduto * percentualDesconto / 100;
        double valorFinal = valorProduto - valorDesconto;

        System.out.println("Valor do produto: " + valorProduto);
        System.out.println("Percentual de desconto: " + percentualDesconto);
        System.out.println("Valor do desconto: " + valorDesconto);
        System.out.println("Valor final: " + valorFinal);
    }
}
```

Esse exemplo é didático.

Em sistema financeiro real, não trataríamos dinheiro assim sem critério.

Comentário profissional:

```java
// Exemplo didático: BigDecimal será estudado depois para cálculos monetários.
```

---

## Exemplo aplicado: usando centavos para pedido

Arquivo:

```text
PedidoCentavos.java
```

Código:

```java
public class PedidoCentavos {
    public static void main(String[] args) {
        long valorProdutoCentavos = 10000L;
        int percentualDesconto = 10;

        long valorDescontoCentavos = valorProdutoCentavos * percentualDesconto / 100;
        long valorFinalCentavos = valorProdutoCentavos - valorDescontoCentavos;

        System.out.println("Valor produto em centavos: " + valorProdutoCentavos);
        System.out.println("Valor desconto em centavos: " + valorDescontoCentavos);
        System.out.println("Valor final em centavos: " + valorFinalCentavos);
    }
}
```

Saída:

```text
Valor produto em centavos: 10000
Valor desconto em centavos: 1000
Valor final em centavos: 9000
```

Isso representa:

```text
produto: R$ 100,00;
desconto: R$ 10,00;
final: R$ 90,00.
```

Ainda não formatamos como moeda.

Mas evitamos `double` no cálculo monetário.

---

## Exemplo aplicado: SLA em horas

Arquivo:

```text
SlaAtendimento.java
```

Código:

```java
public class SlaAtendimento {
    public static void main(String[] args) {
        double horasPrevistas = 4.5;
        double horasConsumidas = 2.75;
        double horasRestantes = horasPrevistas - horasConsumidas;

        System.out.println("Horas previstas: " + horasPrevistas);
        System.out.println("Horas consumidas: " + horasConsumidas);
        System.out.println("Horas restantes: " + horasRestantes);
    }
}
```

Aqui `double` pode ser aceitável para medição aproximada.

Se o sistema exigir precisão de minutos, poderíamos modelar como inteiro:

```text
minutos previstos;
minutos consumidos;
minutos restantes.
```

Exemplo:

```java
int minutosPrevistos = 270;
int minutosConsumidos = 165;
int minutosRestantes = minutosPrevistos - minutosConsumidos;
```

Essa escolha depende do domínio.

---

## Exemplo aplicado: peso e cubagem

Arquivo:

```text
PesoCubagem.java
```

Código:

```java
public class PesoCubagem {
    public static void main(String[] args) {
        double pesoKg = 12.35;
        double volumeM3 = 0.85;

        System.out.println("Peso: " + pesoKg + " kg");
        System.out.println("Volume: " + volumeM3 + " m3");
    }
}
```

Medidas físicas geralmente aceitam `double`, dependendo do nível de precisão exigido.

---

## Escolha de tipo decimal no backend

Regra prática:

```text
double -> medidas, médias, percentuais simples, cálculos aproximados;
float -> raro em backend comum, usado quando API, biblioteca ou memória exigirem;
BigDecimal -> dinheiro e cálculos decimais exatos;
long em centavos -> alternativa comum para valores monetários inteiros.
```

Ainda não estamos na aula de `BigDecimal`.

Mas já precisamos saber que ele existe.

Regra de segurança:

```text
não construa regra financeira séria com double sem entender as consequências.
```

---

## `float` é menor, mas não necessariamente melhor

Alguém pode pensar:

```text
float usa menos memória, então vou usar sempre.
```

Cuidado.

Em backend comum, economia de memória com `float` raramente compensa perda de precisão e conversões.

Use `float` quando houver motivo:

```text
biblioteca exige float;
arquivo/protocolo usa float;
grande volume de dados numéricos com tolerância;
gráficos;
jogos;
processamento específico.
```

Para aprendizado e código comum:

```text
double é mais natural.
```

---

## Erros comuns

### Erro 1 — Usar vírgula em decimal

Errado:

```java
double valor = 99,90;
```

Certo:

```java
double valor = 99.90;
```

---

### Erro 2 — Atribuir decimal a `float` sem `F`

Errado:

```java
float nota = 8.5;
```

Certo:

```java
float nota = 8.5F;
```

---

### Erro 3 — Colocar decimal em `int`

Errado:

```java
int valor = 10.5;
```

Certo:

```java
double valor = 10.5;
```

ou, dependendo do domínio:

```java
long valorCentavos = 1050L;
```

---

### Erro 4 — Achar que `double` é exato

Perigoso:

```java
double total = 0.1 + 0.2;
```

Não espere sempre `0.3` exato na saída.

---

### Erro 5 — Usar `double` para dinheiro real sem critério

Evite:

```java
double saldo = 1000.00;
double juros = 0.1;
```

para regra financeira séria.

Estudaremos alternativas depois.

---

### Erro 6 — Divisão inteira guardada em `double`

Errado conceitualmente:

```java
double media = 10 / 4;
```

Resultado:

```text
2.0
```

Certo:

```java
double media = 10.0 / 4;
```

ou:

```java
double media = (double) 10 / 4;
```

---

### Erro 7 — Achar que `printf` corrige precisão

Formatação:

```java
System.out.printf("%.2f%n", valor);
```

só muda a exibição.

Não muda a natureza do cálculo.

---

### Erro 8 — Misturar dinheiro, medida e percentual sem pensar

Cada número tem domínio.

Pergunte:

```text
é dinheiro?
é medida?
é percentual?
é quantidade?
é contador?
é ID?
é média?
```

A resposta influencia o tipo.

---

### Erro 9 — Usar `float` por padrão

No backend comum, prefira `double` para decimais gerais.

Use `float` com justificativa.

---

### Erro 10 — Ignorar arredondamento

Cálculos decimais podem exigir arredondamento.

Ainda não vamos aprofundar.

Mas saiba que arredondamento é decisão de negócio, principalmente em dinheiro.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-026-tipos-decimais
cd labs\m1\aula-026-tipos-decimais
```

Crie arquivos:

```text
Main.java
FloatDouble.java
PrecisaoDecimal.java
DivisaoInteiraDecimal.java
MediaPedidos.java
DistanciaEntrega.java
MediaAvaliacao.java
PercentualConclusao.java
PedidoDecimal.java
PedidoCentavos.java
SlaAtendimento.java
PesoCubagem.java
```

Compile:

```powershell
javac Main.java
javac FloatDouble.java
javac PrecisaoDecimal.java
javac DivisaoInteiraDecimal.java
javac MediaPedidos.java
javac DistanciaEntrega.java
javac MediaAvaliacao.java
javac PercentualConclusao.java
javac PedidoDecimal.java
javac PedidoCentavos.java
javac SlaAtendimento.java
javac PesoCubagem.java
```

Execute:

```powershell
java Main
java FloatDouble
java PrecisaoDecimal
java DivisaoInteiraDecimal
java MediaPedidos
java DistanciaEntrega
java MediaAvaliacao
java PercentualConclusao
java PedidoDecimal
java PedidoCentavos
java SlaAtendimento
java PesoCubagem
```

Depois quebre os erros de propósito e registre no diário.

---

## Arquivo sugerido: `PrecisaoDecimal.java`

```java
public class PrecisaoDecimal {
    public static void main(String[] args) {
        double resultado = 0.1 + 0.2;

        System.out.println("Resultado: " + resultado);
    }
}
```

Objetivo:

```text
ver a limitação inicial do double.
```

---

## Arquivo sugerido: `DivisaoInteiraDecimal.java`

```java
public class DivisaoInteiraDecimal {
    public static void main(String[] args) {
        double resultadoInteiro = 10 / 4;
        double resultadoDecimal = 10.0 / 4;

        System.out.println("Resultado com divisão inteira: " + resultadoInteiro);
        System.out.println("Resultado com divisão decimal: " + resultadoDecimal);
    }
}
```

Objetivo:

```text
entender que o tipo da operação importa.
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
git add labs/m1/aula-026-tipos-decimais docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 026: pratica tipos decimais em Java"
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
declarar variável double;
declarar variável float;
usar sufixo F em float;
explicar que decimal sem sufixo é double por padrão;
usar ponto decimal;
evitar vírgula em literal decimal;
diferenciar inteiro de decimal;
explicar que double e float têm precisão aproximada;
reproduzir 0.1 + 0.2;
entender por que isso acontece em nível inicial;
explicar por que dinheiro exige cuidado;
representar valor em centavos com long em exemplo simples;
explicar divisão inteira;
corrigir divisão inteira para decimal;
usar cast para double em exemplo simples;
usar printf em nível inicial;
aplicar double em medidas, médias e percentuais simples;
diagnosticar float sem F;
diagnosticar decimal em int;
diagnosticar decimal como texto;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `BigDecimal`.

Não precisa ainda dominar arredondamento.

Não precisa ainda dominar formatação avançada.

Não precisa ainda dominar representação binária em profundidade.

O objetivo é usar decimais com consciência das primeiras limitações.

---

## Fechamento da aula

Hoje aprendemos que números decimais em Java exigem atenção.

`double` é prático.

`float` existe, mas é menos comum em backend geral.

Ambos trabalham com aproximação.

Isso pode surpreender em cálculos como:

```java
0.1 + 0.2
```

Também vimos que divisão entre inteiros pode gerar resultado inteiro mesmo quando a variável final é `double`.

E começamos a separar domínios:

```text
medidas e médias simples podem usar double;
dinheiro exige cuidado maior;
centavos como inteiro é uma alternativa inicial;
BigDecimal será estudado depois.
```

Na próxima aula, vamos estudar `boolean`.

Isso vai abrir caminho para regras verdadeiras e falsas, decisões, validações e, mais tarde, estruturas condicionais com `if`.
