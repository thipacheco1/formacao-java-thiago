# 046 — M1.26 — Arrays com Tamanho Definido pelo Usuário

## Hoje a aula é sobre criar o array depois de saber o tamanho

Até agora, o tamanho era decidido pelo programador.

Exemplo:

```java
double[] valores = new double[5];
```

Agora, o tamanho será decidido em tempo de execução.

Exemplo:

```java
Scanner scanner = new Scanner(System.in);

System.out.println("Quantos valores deseja informar?");
int quantidade = scanner.nextInt();

double[] valores = new double[quantidade];
```

Se o usuário digitar:

```text
3
```

o array terá 3 posições.

Se digitar:

```text
10
```

o array terá 10 posições.

O código fica mais flexível.

Mas também fica mais perigoso se não validarmos a quantidade.

Por isso, esta aula junta dois assuntos:

```text
arrays;
validação de entrada.
```

---

## Por que validar o tamanho antes de criar o array

Este código é perigoso:

```java
System.out.println("Quantos valores deseja informar?");
int quantidade = scanner.nextInt();

double[] valores = new double[quantidade];
```

Se o usuário digitar:

```text
0
```

o array fica vazio.

Se digitar:

```text
-5
```

o programa quebra, porque array não pode ter tamanho negativo.

Por isso, antes de criar o array, precisamos validar:

```java
while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite um valor maior que zero:");
    quantidade = scanner.nextInt();
}
```

Regra desta aula:

```text
nunca crie array com tamanho informado pelo usuário sem validar antes.
```

---

## O que significa tamanho definido pelo usuário

Significa que o programa pergunta o tamanho durante a execução.

Exemplo:

```text
Usuário informa 4.
Programa cria array com 4 posições.
```

Código:

```java
int tamanho = scanner.nextInt();

double[] valores = new double[tamanho];
```

O valor dentro de:

```java
new double[tamanho]
```

não precisa ser um número fixo.

Pode ser uma variável.

Exemplos válidos:

```java
int quantidadeNotas = 5;
double[] notas = new double[quantidadeNotas];
```

```java
int quantidadePedidos = scanner.nextInt();
long[] pedidosCentavos = new long[quantidadePedidos];
```

```java
int totalAtividades = scanner.nextInt();
int[] atividades = new int[totalAtividades];
```

---

## Vocabulário essencial

Termos desta aula:

```text
array;
tamanho;
tamanho dinâmico de entrada;
tempo de execução;
new double[n];
new int[n];
new long[n];
Scanner;
quantidade;
validação de quantidade;
preenchimento;
índice;
length;
loop de preenchimento;
loop de processamento;
soma;
média;
maior valor;
menor valor;
tamanho inválido;
NegativeArraySizeException;
array vazio;
proteção antes da criação.
```

Termos mais importantes:

```text
tempo de execução -> momento em que o programa está rodando;
tamanho informado -> quantidade digitada pelo usuário;
validação de quantidade -> garantir que o tamanho é aceitável;
new double[n] -> cria array de double com n posições;
preenchimento -> atribuir valor a cada posição do array;
length -> tamanho real do array criado.
```

---

## `new double[n]`

A grade desta aula cita explicitamente:

```java
new double[n]
```

Isso significa:

```text
crie um array de double com n posições.
```

Exemplo:

```java
int n = 3;

double[] notas = new double[n];
```

Agora `notas` tem 3 posições:

```text
índice:  0    1    2
valor:   0.0  0.0  0.0
```

Como é array de `double`, o valor padrão é:

```text
0.0.
```

Depois podemos preencher:

```java
notas[0] = 8.5;
notas[1] = 7.0;
notas[2] = 10.0;
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantas notas deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite um valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        double[] notas = new double[quantidade];

        for (int indice = 0; indice < notas.length; indice++) {
            System.out.println("Digite a nota da posição " + indice + ":");
            notas[indice] = scanner.nextDouble();
        }

        System.out.println("Notas informadas:");

        for (int indice = 0; indice < notas.length; indice++) {
            System.out.println(notas[indice]);
        }

        scanner.close();
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

Teste com:

```text
3
8.5
7.0
10.0
```

Saída esperada:

```text
Notas informadas:
8.5
7.0
10.0
```

---

## O fluxo completo

O exemplo anterior tem quatro fases.

### 1. Ler a quantidade

```java
int quantidade = scanner.nextInt();
```

### 2. Validar a quantidade

```java
while (quantidade <= 0) {
    quantidade = scanner.nextInt();
}
```

### 3. Criar o array

```java
double[] notas = new double[quantidade];
```

### 4. Preencher o array

```java
for (int indice = 0; indice < notas.length; indice++) {
    notas[indice] = scanner.nextDouble();
}
```

A ordem é importante.

Não crie o array antes de validar a quantidade.

---

## Por que usar `notas.length` e não `quantidade`

Depois que criamos:

```java
double[] notas = new double[quantidade];
```

poderíamos percorrer usando:

```java
for (int indice = 0; indice < quantidade; indice++)
```

Funciona.

Mas é melhor usar:

```java
for (int indice = 0; indice < notas.length; indice++)
```

Por quê?

Porque o array sabe seu próprio tamanho.

Se no futuro o nome da variável mudar ou o array vier de outro lugar, `length` continua correto.

Regra profissional:

```text
ao percorrer um array, prefira usar array.length.
```

---

## Preenchimento de array

Preencher array significa atribuir valor para cada posição.

Exemplo:

```java
double[] notas = new double[3];

notas[0] = 8.5;
notas[1] = 7.0;
notas[2] = 10.0;
```

Com `for`:

```java
for (int indice = 0; indice < notas.length; indice++) {
    notas[indice] = scanner.nextDouble();
}
```

A cada volta:

```text
indice = 0 -> preenche notas[0];
indice = 1 -> preenche notas[1];
indice = 2 -> preenche notas[2].
```

Esse padrão será usado muitas vezes.

---

## Validação de cada valor

Não basta validar o tamanho.

Também podemos validar cada valor informado.

Exemplo:

```java
for (int indice = 0; indice < notas.length; indice++) {
    System.out.println("Digite a nota " + (indice + 1) + ":");
    notas[indice] = scanner.nextDouble();

    while (notas[indice] < 0 || notas[indice] > 10) {
        System.out.println("Nota inválida. Digite valor entre 0 e 10:");
        notas[indice] = scanner.nextDouble();
    }
}
```

Aqui validamos:

```text
nota precisa estar entre 0 e 10.
```

Observe:

```java
(indice + 1)
```

É usado apenas para mostrar ao usuário uma contagem mais natural.

Internamente, o índice continua começando em 0.

---

## Índice técnico versus número para usuário

Para o programa:

```text
primeira posição = índice 0.
```

Para o usuário, normalmente falamos:

```text
nota 1;
nota 2;
nota 3.
```

Por isso usamos:

```java
System.out.println("Digite a nota " + (indice + 1) + ":");
```

Exemplo:

```text
indice = 0 -> mostra nota 1;
indice = 1 -> mostra nota 2;
indice = 2 -> mostra nota 3.
```

Isso melhora a usabilidade sem quebrar a regra técnica.

---

## Exemplo: notas com média

Arquivo:

```text
NotasComMedia.java
```

Código:

```java
import java.util.Scanner;

public class NotasComMedia {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantas notas deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite um valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        double[] notas = new double[quantidade];

        for (int indice = 0; indice < notas.length; indice++) {
            System.out.println("Digite a nota " + (indice + 1) + ":");
            notas[indice] = scanner.nextDouble();

            while (notas[indice] < 0 || notas[indice] > 10) {
                System.out.println("Nota inválida. Digite valor entre 0 e 10:");
                notas[indice] = scanner.nextDouble();
            }
        }

        double total = 0.0;

        for (int indice = 0; indice < notas.length; indice++) {
            total += notas[indice];
        }

        double media = total / notas.length;

        System.out.println("Média: " + media);

        scanner.close();
    }
}
```

Esse exemplo usa `double[]`.

Ele é fiel ao objetivo da sessão:

```text
new double[n];
preenchimento com Scanner;
validação de quantidade.
```

---

## Soma durante preenchimento ou depois?

No exemplo anterior, preenchemos primeiro e somamos depois.

Também poderíamos somar durante o preenchimento:

```java
double total = 0.0;

for (int indice = 0; indice < notas.length; indice++) {
    notas[indice] = scanner.nextDouble();
    total += notas[indice];
}
```

As duas formas podem ser corretas.

### Somar durante o preenchimento

Vantagem:

```text
menos um loop.
```

### Somar depois

Vantagem:

```text
separa preenchimento de processamento;
fica mais didático;
permite reutilizar o array para várias operações.
```

Nesta fase, muitas vezes vamos separar para aprender melhor.

---

## Exemplo: maior e menor nota

Arquivo:

```text
MaiorMenorNota.java
```

Código:

```java
import java.util.Scanner;

public class MaiorMenorNota {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantas notas deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        double[] notas = new double[quantidade];

        for (int indice = 0; indice < notas.length; indice++) {
            System.out.println("Digite a nota " + (indice + 1) + ":");
            notas[indice] = scanner.nextDouble();

            while (notas[indice] < 0 || notas[indice] > 10) {
                System.out.println("Nota inválida. Digite valor entre 0 e 10:");
                notas[indice] = scanner.nextDouble();
            }
        }

        double maior = notas[0];
        double menor = notas[0];

        for (int indice = 1; indice < notas.length; indice++) {
            if (notas[indice] > maior) {
                maior = notas[indice];
            }

            if (notas[indice] < menor) {
                menor = notas[indice];
            }
        }

        System.out.println("Maior nota: " + maior);
        System.out.println("Menor nota: " + menor);

        scanner.close();
    }
}
```

Como validamos que quantidade é maior que zero, podemos usar:

```java
notas[0]
```

com segurança.

---

## Validação protege o acesso ao índice 0

Se permitíssemos quantidade 0:

```java
double[] notas = new double[0];
```

e depois fizéssemos:

```java
double maior = notas[0];
```

teríamos erro.

Por isso, a validação:

```java
while (quantidade <= 0)
```

protege também os cálculos posteriores.

Validação não é detalhe.

Ela muda a segurança do fluxo.

---

## Exemplo aplicado: valores de pedidos em centavos

Arquivo:

```text
PedidosComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class PedidosComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos pedidos deseja informar?");
        int quantidadePedidos = scanner.nextInt();

        while (quantidadePedidos <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 pedido:");
            quantidadePedidos = scanner.nextInt();
        }

        long[] valoresPedidosCentavos = new long[quantidadePedidos];

        for (int indice = 0; indice < valoresPedidosCentavos.length; indice++) {
            System.out.println("Digite o valor do pedido " + (indice + 1) + " em centavos:");
            valoresPedidosCentavos[indice] = scanner.nextLong();

            while (valoresPedidosCentavos[indice] <= 0) {
                System.out.println("Valor inválido. Digite valor maior que zero:");
                valoresPedidosCentavos[indice] = scanner.nextLong();
            }
        }

        long totalCentavos = 0L;

        for (int indice = 0; indice < valoresPedidosCentavos.length; indice++) {
            totalCentavos += valoresPedidosCentavos[indice];
        }

        double mediaCentavos = (double) totalCentavos / valoresPedidosCentavos.length;

        System.out.println("Total em centavos: " + totalCentavos);
        System.out.println("Média em centavos: " + mediaCentavos);

        scanner.close();
    }
}
```

Esse é um exemplo mais próximo de backend.

O usuário define quantos pedidos serão informados.

Cada valor precisa ser positivo.

---

## Por que long para centavos

Para valores monetários, continuamos usando:

```java
long
```

em centavos.

Exemplo:

```text
R$ 10,00 -> 1000
R$ 25,50 -> 2550
```

Nesta fase, isso evita confusão com ponto flutuante.

Mais tarde, estudaremos `BigDecimal`.

Por enquanto:

```java
long[] valoresCentavos
```

é suficiente para exercitar arrays numéricos com dinheiro.

---

## Exemplo aplicado: estoque de produtos

Arquivo:

```text
ProdutosComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class ProdutosComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos produtos deseja informar?");
        int quantidadeProdutos = scanner.nextInt();

        while (quantidadeProdutos <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 produto:");
            quantidadeProdutos = scanner.nextInt();
        }

        int[] estoques = new int[quantidadeProdutos];

        for (int indice = 0; indice < estoques.length; indice++) {
            System.out.println("Digite o estoque do produto " + (indice + 1) + ":");
            estoques[indice] = scanner.nextInt();

            while (estoques[indice] < 0) {
                System.out.println("Estoque não pode ser negativo. Digite novamente:");
                estoques[indice] = scanner.nextInt();
            }
        }

        int totalEstoque = 0;
        int produtosSemEstoque = 0;

        for (int indice = 0; indice < estoques.length; indice++) {
            totalEstoque += estoques[indice];

            if (estoques[indice] == 0) {
                produtosSemEstoque++;
            }
        }

        System.out.println("Total em estoque: " + totalEstoque);
        System.out.println("Produtos sem estoque: " + produtosSemEstoque);

        scanner.close();
    }
}
```

Regra:

```text
quantidade de produtos precisa ser maior que zero;
estoque pode ser zero;
estoque não pode ser negativo.
```

---

## Exemplo aplicado: atividades por OS

Arquivo:

```text
AtividadesPorOsComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class AtividadesPorOsComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantas OS deseja informar?");
        int quantidadeOs = scanner.nextInt();

        while (quantidadeOs <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 OS:");
            quantidadeOs = scanner.nextInt();
        }

        int[] atividadesPorOs = new int[quantidadeOs];

        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            System.out.println("Digite a quantidade de atividades da OS " + (indice + 1) + ":");
            atividadesPorOs[indice] = scanner.nextInt();

            while (atividadesPorOs[indice] <= 0) {
                System.out.println("A OS deve possuir ao menos 1 atividade. Digite novamente:");
                atividadesPorOs[indice] = scanner.nextInt();
            }
        }

        int totalAtividades = 0;
        int maiorQuantidade = atividadesPorOs[0];

        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            totalAtividades += atividadesPorOs[indice];

            if (atividadesPorOs[indice] > maiorQuantidade) {
                maiorQuantidade = atividadesPorOs[indice];
            }
        }

        System.out.println("Total de atividades: " + totalAtividades);
        System.out.println("Maior quantidade de atividades em uma OS: " + maiorQuantidade);

        scanner.close();
    }
}
```

Esse exemplo aplica arrays com tamanho definido pelo usuário em domínio de OS.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class MensageriaComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantas mensagens deseja analisar?");
        int quantidadeMensagens = scanner.nextInt();

        while (quantidadeMensagens <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 mensagem:");
            quantidadeMensagens = scanner.nextInt();
        }

        int[] tentativasPorMensagem = new int[quantidadeMensagens];

        for (int indice = 0; indice < tentativasPorMensagem.length; indice++) {
            System.out.println("Digite a quantidade de tentativas da mensagem " + (indice + 1) + ":");
            tentativasPorMensagem[indice] = scanner.nextInt();

            while (tentativasPorMensagem[indice] <= 0) {
                System.out.println("Tentativas deve ser maior que zero. Digite novamente:");
                tentativasPorMensagem[indice] = scanner.nextInt();
            }
        }

        int totalTentativas = 0;
        int mensagensComMuitasTentativas = 0;

        for (int indice = 0; indice < tentativasPorMensagem.length; indice++) {
            totalTentativas += tentativasPorMensagem[indice];

            if (tentativasPorMensagem[indice] > 2) {
                mensagensComMuitasTentativas++;
            }
        }

        System.out.println("Total de tentativas: " + totalTentativas);
        System.out.println("Mensagens com mais de 2 tentativas: " + mensagensComMuitasTentativas);

        scanner.close();
    }
}
```

Esse exemplo mostra análise simples de mensagens.

O usuário define quantas mensagens serão analisadas.

---

## Exemplo aplicado: auditoria por dia

Arquivo:

```text
AuditoriaComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class AuditoriaComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos dias deseja analisar?");
        int quantidadeDias = scanner.nextInt();

        while (quantidadeDias <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 dia:");
            quantidadeDias = scanner.nextInt();
        }

        int[] eventosPorDia = new int[quantidadeDias];

        for (int indice = 0; indice < eventosPorDia.length; indice++) {
            System.out.println("Digite a quantidade de eventos do dia " + (indice + 1) + ":");
            eventosPorDia[indice] = scanner.nextInt();

            while (eventosPorDia[indice] < 0) {
                System.out.println("Eventos não pode ser negativo. Digite novamente:");
                eventosPorDia[indice] = scanner.nextInt();
            }
        }

        int totalEventos = 0;
        int maiorVolume = eventosPorDia[0];

        for (int indice = 0; indice < eventosPorDia.length; indice++) {
            totalEventos += eventosPorDia[indice];

            if (eventosPorDia[indice] > maiorVolume) {
                maiorVolume = eventosPorDia[indice];
            }
        }

        double mediaEventos = (double) totalEventos / eventosPorDia.length;

        System.out.println("Total de eventos: " + totalEventos);
        System.out.println("Maior volume diário: " + maiorVolume);
        System.out.println("Média diária: " + mediaEventos);

        scanner.close();
    }
}
```

Aqui a quantidade de dias é definida pelo usuário.

Cada dia pode ter zero eventos, mas não pode ter quantidade negativa.

---

## Exemplo aplicado: pagamentos e parcelas

Arquivo:

```text
PagamentosComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class PagamentosComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos pagamentos deseja informar?");
        int quantidadePagamentos = scanner.nextInt();

        while (quantidadePagamentos <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 pagamento:");
            quantidadePagamentos = scanner.nextInt();
        }

        long[] pagamentosCentavos = new long[quantidadePagamentos];

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            System.out.println("Digite o valor do pagamento " + (indice + 1) + " em centavos:");
            pagamentosCentavos[indice] = scanner.nextLong();

            while (pagamentosCentavos[indice] <= 0) {
                System.out.println("Valor inválido. Digite valor maior que zero:");
                pagamentosCentavos[indice] = scanner.nextLong();
            }
        }

        long totalCentavos = 0L;
        long maiorPagamento = pagamentosCentavos[0];
        long menorPagamento = pagamentosCentavos[0];

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            totalCentavos += pagamentosCentavos[indice];

            if (pagamentosCentavos[indice] > maiorPagamento) {
                maiorPagamento = pagamentosCentavos[indice];
            }

            if (pagamentosCentavos[indice] < menorPagamento) {
                menorPagamento = pagamentosCentavos[indice];
            }
        }

        System.out.println("Total pago em centavos: " + totalCentavos);
        System.out.println("Maior pagamento: " + maiorPagamento);
        System.out.println("Menor pagamento: " + menorPagamento);

        scanner.close();
    }
}
```

Esse exemplo junta:

```text
array com tamanho informado;
long para dinheiro em centavos;
validação;
total;
maior;
menor.
```

---

## Exemplo aplicado: SLA em horas

Arquivo:

```text
SlaComTamanhoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class SlaComTamanhoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos atendimentos deseja informar?");
        int quantidadeAtendimentos = scanner.nextInt();

        while (quantidadeAtendimentos <= 0) {
            System.out.println("Quantidade inválida. Informe ao menos 1 atendimento:");
            quantidadeAtendimentos = scanner.nextInt();
        }

        double[] horasAtendimento = new double[quantidadeAtendimentos];

        for (int indice = 0; indice < horasAtendimento.length; indice++) {
            System.out.println("Digite o tempo em horas do atendimento " + (indice + 1) + ":");
            horasAtendimento[indice] = scanner.nextDouble();

            while (horasAtendimento[indice] < 0) {
                System.out.println("Tempo não pode ser negativo. Digite novamente:");
                horasAtendimento[indice] = scanner.nextDouble();
            }
        }

        double totalHoras = 0.0;
        double maiorTempo = horasAtendimento[0];

        for (int indice = 0; indice < horasAtendimento.length; indice++) {
            totalHoras += horasAtendimento[indice];

            if (horasAtendimento[indice] > maiorTempo) {
                maiorTempo = horasAtendimento[indice];
            }
        }

        double mediaHoras = totalHoras / horasAtendimento.length;

        System.out.println("Total de horas: " + totalHoras);
        System.out.println("Maior tempo: " + maiorTempo);
        System.out.println("Média de horas: " + mediaHoras);

        scanner.close();
    }
}
```

Esse exemplo usa `double[]` em um cenário de tempo.

---

## O que acontece se o usuário digitar tamanho negativo

Código perigoso:

```java
int quantidade = -3;
double[] valores = new double[quantidade];
```

Isso gera erro:

```text
NegativeArraySizeException
```

Esse erro significa:

```text
você tentou criar um array com tamanho negativo.
```

Correção:

```java
while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite valor maior que zero:");
    quantidade = scanner.nextInt();
}
```

A validação evita o erro.

---

## Tamanho zero pode existir, mas cuidado

Java permite:

```java
int[] valores = new int[0];
```

Esse array existe, mas não tem posições.

O problema é tentar acessar:

```java
valores[0]
```

Isso gera erro.

Nesta aula, para simplificar, vamos exigir:

```text
quantidade maior que zero.
```

Em cenários reais, array vazio pode fazer sentido.

Mas precisa ser tratado com cuidado.

---

## Limite máximo também pode ser necessário

Validar apenas maior que zero pode não ser suficiente.

Imagine o usuário digitar:

```text
1000000000
```

O programa tentaria criar um array enorme.

Isso pode causar problema de memória.

Podemos limitar:

```java
while (quantidade <= 0 || quantidade > 100) {
    System.out.println("Quantidade inválida. Digite valor entre 1 e 100:");
    quantidade = scanner.nextInt();
}
```

Exemplo:

```text
mínimo: 1;
máximo: 100.
```

Esse é um bom hábito quando o tamanho vem de fora.

---

## Exemplo com limite máximo

Arquivo:

```text
TamanhoComLimiteMaximo.java
```

Código:

```java
import java.util.Scanner;

public class TamanhoComLimiteMaximo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos valores deseja informar? Limite: 1 a 100");
        int quantidade = scanner.nextInt();

        while (quantidade < 1 || quantidade > 100) {
            System.out.println("Quantidade inválida. Digite valor entre 1 e 100:");
            quantidade = scanner.nextInt();
        }

        double[] valores = new double[quantidade];

        System.out.println("Array criado com tamanho: " + valores.length);

        scanner.close();
    }
}
```

Esse exemplo introduz um cuidado importante:

```text
entrada externa também precisa de limite máximo.
```

---

## Criar array depois de validar tudo

A ordem ideal:

```java
int quantidade = scanner.nextInt();

while (quantidade < 1 || quantidade > 100) {
    quantidade = scanner.nextInt();
}

double[] valores = new double[quantidade];
```

Não faça:

```java
double[] valores = new double[quantidade];
```

antes da validação.

A criação do array deve acontecer quando o tamanho já é confiável.

---

## Usando variável booleana para tamanho válido

Podemos nomear a regra:

```java
boolean quantidadeValida = quantidade >= 1 && quantidade <= 100;
```

Exemplo:

```java
System.out.println("Digite a quantidade de valores:");
int quantidade = scanner.nextInt();

boolean quantidadeValida = quantidade >= 1 && quantidade <= 100;

while (!quantidadeValida) {
    System.out.println("Quantidade inválida. Digite valor entre 1 e 100:");
    quantidade = scanner.nextInt();

    quantidadeValida = quantidade >= 1 && quantidade <= 100;
}
```

Isso deixa a regra mais explícita.

Mas cuidado para atualizar o boolean dentro do loop.

---

## Erro comum com boolean não atualizado

Errado:

```java
boolean quantidadeValida = quantidade >= 1 && quantidade <= 100;

while (!quantidadeValida) {
    System.out.println("Digite novamente:");
    quantidade = scanner.nextInt();
}
```

Se `quantidadeValida` começou `false`, continuará `false`.

O loop pode nunca terminar.

Correção:

```java
while (!quantidadeValida) {
    System.out.println("Digite novamente:");
    quantidade = scanner.nextInt();

    quantidadeValida = quantidade >= 1 && quantidade <= 100;
}
```

Sempre atualize a variável que controla o loop.

---

## Usando do while para tamanho

Uma forma bem natural:

```java
int quantidade;

do {
    System.out.println("Digite a quantidade entre 1 e 100:");
    quantidade = scanner.nextInt();

    if (quantidade < 1 || quantidade > 100) {
        System.out.println("Quantidade inválida.");
    }
} while (quantidade < 1 || quantidade > 100);

double[] valores = new double[quantidade];
```

Essa forma evita leitura antes do loop.

A leitura acontece dentro do `do`.

Para entrada obrigatória, `do while` costuma ficar claro.

---

## Exemplo completo com do while

Arquivo:

```text
NotasComDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class NotasComDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade;

        do {
            System.out.println("Quantas notas deseja informar? Use valor entre 1 e 50:");
            quantidade = scanner.nextInt();

            if (quantidade < 1 || quantidade > 50) {
                System.out.println("Quantidade inválida.");
            }
        } while (quantidade < 1 || quantidade > 50);

        double[] notas = new double[quantidade];

        for (int indice = 0; indice < notas.length; indice++) {
            do {
                System.out.println("Digite a nota " + (indice + 1) + ":");
                notas[indice] = scanner.nextDouble();

                if (notas[indice] < 0 || notas[indice] > 10) {
                    System.out.println("Nota inválida. Use valor entre 0 e 10.");
                }
            } while (notas[indice] < 0 || notas[indice] > 10);
        }

        double total = 0.0;

        for (int indice = 0; indice < notas.length; indice++) {
            total += notas[indice];
        }

        double media = total / notas.length;

        System.out.println("Média: " + media);

        scanner.close();
    }
}
```

Esse exemplo é um bom modelo para esta aula.

---

## Separando fases no código

Mesmo dentro do `main`, organize mentalmente o código por fases:

```text
1. ler e validar tamanho;
2. criar array;
3. preencher array;
4. processar array;
5. exibir resultado.
```

Exemplo comentado:

```java
// 1. ler e validar quantidade

// 2. criar array

// 3. preencher array

// 4. calcular resultados

// 5. exibir resultados
```

Comentários assim podem ajudar no início.

Mais tarde, essas fases virarão métodos.

---

## Tamanho definido pelo usuário não significa crescimento dinâmico

Cuidado com a interpretação.

Quando dizemos:

```text
tamanho definido pelo usuário
```

não significa que o array cresce enquanto o usuário adiciona dados.

Significa:

```text
o usuário informa o tamanho antes;
o array é criado com esse tamanho;
depois o tamanho continua fixo.
```

Exemplo:

```java
int quantidade = 5;
int[] valores = new int[quantidade];
```

Depois disso, o array tem 5 posições.

Não cresce para 6 automaticamente.

---

## E se eu precisar adicionar mais depois?

A resposta profissional virá depois:

```text
ArrayList.
```

Por enquanto, com array:

```text
defina o tamanho;
preencha as posições;
não ultrapasse o limite.
```

Se precisar de crescimento dinâmico, array puro não é a melhor estrutura.

Mas arrays são fundamentais para entender índice, memória, iteração e base de coleções.

---

## Erros comuns

### Erro 1 — Criar array antes de validar quantidade

Errado:

```java
int quantidade = scanner.nextInt();
double[] valores = new double[quantidade];

while (quantidade <= 0) {
    quantidade = scanner.nextInt();
}
```

Se a quantidade for negativa, o programa quebra antes da validação.

Certo:

```java
int quantidade = scanner.nextInt();

while (quantidade <= 0) {
    quantidade = scanner.nextInt();
}

double[] valores = new double[quantidade];
```

---

### Erro 2 — Permitir quantidade negativa

Pode causar:

```text
NegativeArraySizeException.
```

Valide:

```java
quantidade > 0
```

ou:

```java
quantidade >= 1 && quantidade <= limiteMaximo
```

---

### Erro 3 — Permitir quantidade zero e acessar índice 0

Array vazio não tem posição 0.

Se o fluxo usa:

```java
valores[0]
```

exija quantidade maior que zero.

---

### Erro 4 — Usar `<= array.length`

Errado:

```java
for (int indice = 0; indice <= valores.length; indice++)
```

Certo:

```java
for (int indice = 0; indice < valores.length; indice++)
```

---

### Erro 5 — Usar quantidade no loop depois e alterar quantidade sem perceber

Prefira:

```java
valores.length
```

em vez de:

```java
quantidade
```

ao percorrer o array.

---

### Erro 6 — Não validar cada valor preenchido

Validar o tamanho não valida os elementos.

Exemplo:

```text
quantidade é válida;
nota digitada é 99.
```

Valide também cada elemento quando houver regra.

---

### Erro 7 — Não limitar tamanho máximo

Se o usuário puder informar qualquer número, pode pedir array grande demais.

Defina limite quando fizer sentido.

---

### Erro 8 — Confundir índice técnico com número do usuário

Mostre:

```java
(indice + 1)
```

para o usuário.

Use:

```java
indice
```

para acessar o array.

---

### Erro 9 — Esquecer de atualizar boolean de validação

Se usar `quantidadeValida`, atualize dentro do loop após nova leitura.

---

### Erro 10 — Tentar adicionar além do tamanho

Se o array tem 5 posições, não escreva na posição 5.

Última posição:

```java
array.length - 1
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-046-arrays-tamanho-usuario
cd labs\m1\aula-046-arrays-tamanho-usuario
```

Crie arquivos:

```text
Main.java
NotasComMedia.java
MaiorMenorNota.java
PedidosComTamanhoUsuario.java
ProdutosComTamanhoUsuario.java
AtividadesPorOsComTamanhoUsuario.java
MensageriaComTamanhoUsuario.java
AuditoriaComTamanhoUsuario.java
PagamentosComTamanhoUsuario.java
SlaComTamanhoUsuario.java
TamanhoComLimiteMaximo.java
NotasComDoWhile.java
ErroTamanhoNegativo.java
ErroCriarAntesDeValidar.java
ErroLoopComMenorIgual.java
ErroBooleanNaoAtualizado.java
```

Compile:

```powershell
javac Main.java
javac NotasComMedia.java
javac MaiorMenorNota.java
javac PedidosComTamanhoUsuario.java
javac ProdutosComTamanhoUsuario.java
javac AtividadesPorOsComTamanhoUsuario.java
javac MensageriaComTamanhoUsuario.java
javac AuditoriaComTamanhoUsuario.java
javac PagamentosComTamanhoUsuario.java
javac SlaComTamanhoUsuario.java
javac TamanhoComLimiteMaximo.java
javac NotasComDoWhile.java
javac ErroTamanhoNegativo.java
javac ErroCriarAntesDeValidar.java
javac ErroLoopComMenorIgual.java
javac ErroBooleanNaoAtualizado.java
```

Execute:

```powershell
java Main
java NotasComMedia
java MaiorMenorNota
java PedidosComTamanhoUsuario
java ProdutosComTamanhoUsuario
java AtividadesPorOsComTamanhoUsuario
java MensageriaComTamanhoUsuario
java AuditoriaComTamanhoUsuario
java PagamentosComTamanhoUsuario
java SlaComTamanhoUsuario
java TamanhoComLimiteMaximo
java NotasComDoWhile
java ErroTamanhoNegativo
java ErroCriarAntesDeValidar
java ErroLoopComMenorIgual
java ErroBooleanNaoAtualizado
```

Alguns arquivos de erro proposital podem quebrar ou gerar loop incorreto.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroTamanhoNegativo.java`

```java
public class ErroTamanhoNegativo {
    public static void main(String[] args) {
        int quantidade = -3;

        double[] valores = new double[quantidade];

        System.out.println(valores.length);
    }
}
```

Objetivo:

```text
entender NegativeArraySizeException.
```

---

## Arquivo sugerido: `ErroCriarAntesDeValidar.java`

```java
import java.util.Scanner;

public class ErroCriarAntesDeValidar {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade:");
        int quantidade = scanner.nextInt();

        double[] valores = new double[quantidade];

        while (quantidade <= 0) {
            System.out.println("Digite novamente:");
            quantidade = scanner.nextInt();
        }

        System.out.println("Tamanho: " + valores.length);

        scanner.close();
    }
}
```

Objetivo:

```text
ver por que a validação precisa vir antes da criação do array.
```

---

## Arquivo sugerido: `ErroBooleanNaoAtualizado.java`

```java
import java.util.Scanner;

public class ErroBooleanNaoAtualizado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade:");
        int quantidade = scanner.nextInt();

        boolean quantidadeValida = quantidade > 0;

        while (!quantidadeValida) {
            System.out.println("Quantidade inválida. Digite novamente:");
            quantidade = scanner.nextInt();
        }

        System.out.println("Quantidade aceita: " + quantidade);

        scanner.close();
    }
}
```

Depois corrija:

```java
quantidadeValida = quantidade > 0;
```

dentro do loop.

Objetivo:

```text
entender que variável booleana de controle também precisa ser atualizada.
```

---

## Debug recomendado

Use debug neste trecho:

```java
System.out.println("Quantas notas deseja informar?");
int quantidade = scanner.nextInt();

while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite um valor maior que zero:");
    quantidade = scanner.nextInt();
}

double[] notas = new double[quantidade];
```

Teste com:

```text
-1
0
3
```

Observe:

```text
quantidade começa inválida;
entra no while;
lê novamente;
só cria o array quando quantidade é válida.
```

Depois debugue:

```java
for (int indice = 0; indice < notas.length; indice++) {
    notas[indice] = scanner.nextDouble();
}
```

Observe:

```text
indice;
notas.length;
notas[indice].
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
git add labs/m1/aula-046-arrays-tamanho-usuario docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 046: pratica arrays com tamanho informado pelo usuario"
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
explicar array com tamanho definido pelo usuário;
usar Scanner para ler quantidade;
validar quantidade mínima;
validar quantidade máxima;
criar array com new double[n];
criar array com new int[n];
criar array com new long[n];
preencher array com Scanner;
usar índice começando em zero;
exibir índice amigável com indice + 1;
percorrer com array.length;
validar cada elemento preenchido;
calcular soma;
calcular média;
encontrar maior valor;
encontrar menor valor;
aplicar em notas;
aplicar em pedidos;
aplicar em produtos;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
aplicar em pagamento;
aplicar em SLA;
evitar NegativeArraySizeException;
entender risco de array vazio;
validar antes de criar;
usar boolean de validação corretamente;
diagnosticar erros comuns;
debugar quantidade, length e índice;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar alteração avançada de posições.

Não precisa ainda dominar arrays de String.

Não precisa ainda dominar matrizes.

Não precisa ainda dominar ArrayList.

Não precisa ainda dominar métodos para receber arrays.

Esses assuntos virão depois.

O objetivo é dominar criação de arrays cujo tamanho vem da entrada do usuário, com validação antes da criação e preenchimento seguro.

---

## Fechamento da aula

Hoje aprendemos a criar arrays com tamanho definido pelo usuário.

A ideia central foi:

```text
perguntar a quantidade;
validar a quantidade;
criar o array;
preencher as posições;
processar os dados.
```

Vimos:

```java
double[] notas = new double[quantidade];
```

e também exemplos com:

```java
int[] estoques = new int[quantidadeProdutos];
long[] pagamentosCentavos = new long[quantidadePagamentos];
```

O maior cuidado da aula foi:

```text
não crie array com tamanho vindo de fora sem validar antes.
```

Também vimos que tamanho definido pelo usuário não significa crescimento dinâmico.

Depois que o array é criado, ele continua com tamanho fixo.

Na próxima aula, vamos estudar alteração de posições do array.

Aí vamos entender melhor como atualizar valores já armazenados, substituir conteúdo, recalcular resultados e evitar alterações fora do índice correto.
