# 052 — M1.32 — Matriz Bidimensional Inicial

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.32.01` — Matriz bidimensional inicial — Conceito, por que existe e vocabulário essencial.
- `M1.32.02` — Matriz bidimensional inicial — Exemplo mínimo digitado do zero.
- `M1.32.03` — Matriz bidimensional inicial — Exemplo aplicado ao domínio corporativo.
- `M1.32.04` — Matriz bidimensional inicial — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar linhas, colunas, tabela simples, leitura, exibição, matriz bidimensional em Java, acesso por dois índices, laços aninhados, uso correto de `length`, leitura com `Scanner`, exibição tabular, erros comuns e aplicação em cenários de produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 1, fechando o bloco inicial de arrays e preparando a entrada em métodos.

A sequência recente foi:

```text
048 — M1.28 — Busca em array;
049 — M1.29 — Maior, menor, soma e média em array;
050 — M1.30 — Arrays de String;
051 — M1.31 — Arrays paralelos;
052 — M1.32 — Matriz bidimensional inicial.
```

Na aula anterior, estudamos arrays paralelos.

Exemplo:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valores = {1000L, 2500L, 5000L};
String[] status = {"PENDENTE", "APROVADO", "RECUSADO"};
```

Neles, o mesmo índice ligava os dados.

Agora vamos estudar outro tipo de estrutura:

```text
matriz bidimensional.
```

Uma matriz bidimensional representa dados em duas dimensões:

```text
linhas;
colunas.
```

Pense em uma tabela:

```text
        Coluna 0   Coluna 1   Coluna 2
Linha 0    10         20         30
Linha 1    40         50         60
```

Em Java, isso pode ser representado assim:

```java
int[][] matriz = {
    {10, 20, 30},
    {40, 50, 60}
};
```

Agora não acessamos apenas com um índice.

Acessamos com dois:

```java
matriz[linha][coluna]
```

---

## Hoje a aula é sobre linha e coluna

Até agora, um array comum era uma lista.

Exemplo:

```java
int[] valores = {10, 20, 30};
```

Visual:

```text
índice:  0   1   2
valor:   10  20  30
```

Agora, uma matriz é como uma tabela.

Exemplo:

```java
int[][] valores = {
    {10, 20, 30},
    {40, 50, 60}
};
```

Visual:

```text
linha/coluna | 0   1   2
0            | 10  20  30
1            | 40  50  60
```

Acesso:

```java
valores[0][0] -> 10
valores[0][1] -> 20
valores[0][2] -> 30
valores[1][0] -> 40
valores[1][1] -> 50
valores[1][2] -> 60
```

A primeira posição indica a linha.

A segunda indica a coluna.

---

## O que é matriz bidimensional

Matriz bidimensional é uma estrutura com duas dimensões.

Em Java, podemos pensar nela como:

```text
array de arrays.
```

Exemplo:

```java
int[][] matriz = new int[2][3];
```

Leitura:

```text
crie uma matriz de int com 2 linhas e 3 colunas.
```

Visual:

```text
        coluna 0   coluna 1   coluna 2
linha 0     0          0          0
linha 1     0          0          0
```

Como é `int`, os valores padrão começam em:

```text
0.
```

---

## Por que matriz existe

Matriz é útil quando os dados têm estrutura de tabela.

Exemplos:

```text
notas de alunos por bimestre;
estoque de produtos por depósito;
vendas por mês;
pagamentos por parcela;
atividades por OS e etapa;
tentativas de mensagem por dia;
eventos de auditoria por tipo e dia;
quantidade por categoria e status;
agenda de dias e horários;
tabela simples de resultados.
```

Matriz aparece quando uma pergunta tem duas dimensões.

Exemplo:

```text
produto e mês;
cliente e pedido;
dia e tipo de evento;
OS e atividade;
linha e coluna;
categoria e status.
```

Se você consegue desenhar como tabela, matriz pode fazer sentido.

---

## Vocabulário essencial

Termos desta aula:

```text
matriz;
matriz bidimensional;
linha;
coluna;
tabela;
célula;
elemento;
índice de linha;
índice de coluna;
array de arrays;
int[][];
double[][];
String[][];
length;
matriz.length;
matriz[linha].length;
laço aninhado;
loop externo;
loop interno;
leitura;
exibição;
tabela simples;
valor padrão;
linha inválida;
coluna inválida.
```

Termos mais importantes:

```text
linha -> primeira dimensão da matriz;
coluna -> segunda dimensão da matriz;
célula -> posição específica formada por linha e coluna;
matriz[linha][coluna] -> acesso a um elemento;
matriz.length -> quantidade de linhas;
matriz[linha].length -> quantidade de colunas daquela linha;
laço aninhado -> forma comum de percorrer matriz.
```

---

## Declaração de matriz

Forma comum:

```java
int[][] numeros;
```

Leitura:

```text
numeros é uma matriz de int.
```

Outros exemplos:

```java
double[][] notas;
long[][] valoresCentavos;
String[][] textos;
```

Nesta aula, o foco principal será em números.

Mas também veremos exemplo textual inicial.

---

## Inicialização com valores conhecidos

Exemplo:

```java
int[][] matriz = {
    {10, 20, 30},
    {40, 50, 60}
};
```

Essa matriz tem:

```text
2 linhas;
3 colunas por linha.
```

Linha 0:

```text
10, 20, 30.
```

Linha 1:

```text
40, 50, 60.
```

Acesso:

```java
matriz[0][0]
matriz[0][1]
matriz[0][2]
matriz[1][0]
matriz[1][1]
matriz[1][2]
```

---

## Inicialização com tamanho

Exemplo:

```java
int[][] matriz = new int[2][3];
```

Isso cria:

```text
2 linhas;
3 colunas.
```

Visual:

```text
0 0 0
0 0 0
```

Depois podemos preencher:

```java
matriz[0][0] = 10;
matriz[0][1] = 20;
matriz[0][2] = 30;

matriz[1][0] = 40;
matriz[1][1] = 50;
matriz[1][2] = 60;
```

---

## Acesso por linha e coluna

Para acessar uma matriz, usamos dois índices:

```java
matriz[linha][coluna]
```

Exemplo:

```java
int[][] matriz = {
    {10, 20, 30},
    {40, 50, 60}
};

System.out.println(matriz[1][2]);
```

Saída:

```text
60
```

Por quê?

```text
linha 1 -> {40, 50, 60}
coluna 2 -> 60
```

Lembre:

```text
índice começa em 0.
```

---

## Primeiro índice é linha

Em:

```java
matriz[1][2]
```

o primeiro índice é:

```java
1
```

Ele representa a linha.

O segundo índice é:

```java
2
```

Ele representa a coluna.

Então leia assim:

```text
matriz na linha 1, coluna 2.
```

Não leia como:

```text
posição 1 e posição 2 soltas.
```

Sempre pense:

```text
linha;
coluna.
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
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        System.out.println(matriz[0][0]);
        System.out.println(matriz[0][1]);
        System.out.println(matriz[0][2]);
        System.out.println(matriz[1][0]);
        System.out.println(matriz[1][1]);
        System.out.println(matriz[1][2]);
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
10
20
30
40
50
60
```

Esse exemplo mostra acesso manual.

Depois vamos usar laços.

---

## Exibindo matriz com laços aninhados

Para percorrer matriz, usamos laço dentro de laço.

Arquivo:

```text
ExibirMatriz.java
```

Código:

```java
public class ExibirMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

Saída:

```text
10 20 30
40 50 60
```

Aqui temos:

```text
loop externo -> linhas;
loop interno -> colunas.
```

---

## matriz.length

Em matriz:

```java
matriz.length
```

representa a quantidade de linhas.

Exemplo:

```java
int[][] matriz = {
    {10, 20, 30},
    {40, 50, 60}
};
```

Então:

```java
matriz.length
```

vale:

```text
2.
```

Porque existem duas linhas.

Não vale 6.

Não vale 3.

Vale a quantidade de arrays internos.

---

## matriz[linha].length

Para saber quantas colunas uma linha tem:

```java
matriz[linha].length
```

Exemplo:

```java
matriz[0].length
```

vale:

```text
3.
```

Porque a linha 0 tem três elementos:

```text
10, 20, 30.
```

E:

```java
matriz[1].length
```

também vale:

```text
3.
```

Porque a linha 1 também tem três elementos:

```text
40, 50, 60.
```

O padrão seguro de loop é:

```java
for (int linha = 0; linha < matriz.length; linha++) {
    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
        System.out.println(matriz[linha][coluna]);
    }
}
```

---

## Por que não usar matriz.length para colunas

Erro comum:

```java
for (int coluna = 0; coluna < matriz.length; coluna++)
```

Isso usa a quantidade de linhas como se fosse quantidade de colunas.

Se a matriz tiver 2 linhas e 3 colunas, `matriz.length` é 2.

O loop de coluna iria apenas até 1, ignorando a coluna 2.

Ou, em outro formato, poderia gerar erro.

Para colunas, use:

```java
matriz[linha].length
```

Regra:

```text
linhas -> matriz.length;
colunas -> matriz[linha].length.
```

---

## Exibindo com rótulo de linha e coluna

Arquivo:

```text
ExibirComIndice.java
```

Código:

```java
public class ExibirComIndice {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.println("Linha " + linha
                        + ", coluna " + coluna
                        + ": " + matriz[linha][coluna]);
            }
        }
    }
}
```

Saída:

```text
Linha 0, coluna 0: 10
Linha 0, coluna 1: 20
Linha 0, coluna 2: 30
Linha 1, coluna 0: 40
Linha 1, coluna 1: 50
Linha 1, coluna 2: 60
```

Esse exemplo é ótimo para fixar índice.

---

## Criando matriz vazia e preenchendo manualmente

Arquivo:

```text
PreencherManual.java
```

Código:

```java
public class PreencherManual {
    public static void main(String[] args) {
        int[][] matriz = new int[2][3];

        matriz[0][0] = 10;
        matriz[0][1] = 20;
        matriz[0][2] = 30;

        matriz[1][0] = 40;
        matriz[1][1] = 50;
        matriz[1][2] = 60;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

Aqui usamos:

```java
new int[2][3]
```

e depois atribuímos valor por célula.

---

## Preenchendo com cálculo

Arquivo:

```text
PreencherComCalculo.java
```

Código:

```java
public class PreencherComCalculo {
    public static void main(String[] args) {
        int[][] matriz = new int[3][3];

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                matriz[linha][coluna] = linha + coluna;
            }
        }

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

Saída:

```text
0 1 2
1 2 3
2 3 4
```

Esse exemplo mostra preenchimento automático com base em linha e coluna.

---

## Leitura com Scanner

A grade cita:

```text
leitura e exibição.
```

Vamos ler uma matriz do usuário.

Arquivo:

```text
LerMatrizConsole.java
```

Código:

```java
import java.util.Scanner;

public class LerMatrizConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[][] matriz = new int[2][3];

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.println("Digite o valor da linha "
                        + (linha + 1)
                        + ", coluna "
                        + (coluna + 1)
                        + ":");

                matriz[linha][coluna] = scanner.nextInt();
            }
        }

        System.out.println("Matriz informada:");

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }

        scanner.close();
    }
}
```

Esse exemplo é essencial.

Ele mostra:

```text
leitura;
linha;
coluna;
exibição tabular.
```

---

## Índice técnico e posição amigável

No código, usamos:

```java
matriz[linha][coluna]
```

com índices que começam em 0.

Mas para o usuário, mostramos:

```java
(linha + 1)
(coluna + 1)
```

Exemplo:

```java
System.out.println("Linha " + (linha + 1) + ", coluna " + (coluna + 1));
```

Isso evita confundir o usuário.

Regra:

```text
internamente: começa em 0;
na mensagem para usuário: normalmente começa em 1.
```

---

## Soma de todos os elementos

Arquivo:

```text
SomarMatriz.java
```

Código:

```java
public class SomarMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int soma = 0;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                soma += matriz[linha][coluna];
            }
        }

        System.out.println("Soma: " + soma);
    }
}
```

Saída:

```text
Soma: 210
```

Esse exemplo junta matriz com acumulador.

---

## Média dos elementos

Arquivo:

```text
MediaMatriz.java
```

Código:

```java
public class MediaMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int soma = 0;
        int quantidade = 0;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                soma += matriz[linha][coluna];
                quantidade++;
            }
        }

        double media = (double) soma / quantidade;

        System.out.println("Média: " + media);
    }
}
```

Saída:

```text
Média: 35.0
```

Aqui contamos os elementos com:

```java
quantidade++;
```

Isso funciona mesmo se as linhas tiverem tamanhos diferentes.

---

## Maior e menor na matriz

Arquivo:

```text
MaiorMenorMatriz.java
```

Código:

```java
public class MaiorMenorMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 5, 60}
        };

        int maior = matriz[0][0];
        int menor = matriz[0][0];

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                if (matriz[linha][coluna] > maior) {
                    maior = matriz[linha][coluna];
                }

                if (matriz[linha][coluna] < menor) {
                    menor = matriz[linha][coluna];
                }
            }
        }

        System.out.println("Maior: " + maior);
        System.out.println("Menor: " + menor);
    }
}
```

Saída:

```text
Maior: 60
Menor: 5
```

A inicialização usa:

```java
matriz[0][0]
```

Isso exige que a matriz tenha pelo menos uma linha e uma coluna.

---

## Matriz vazia e cuidado com matriz[0][0]

Se a matriz estiver vazia:

```java
int[][] matriz = new int[0][0];
```

não podemos acessar:

```java
matriz[0][0]
```

Isso dá erro.

Nesta aula, vamos trabalhar com matrizes preenchidas.

Mas guarde o alerta:

```text
antes de usar matriz[0][0], garanta que existe linha 0 e coluna 0.
```

Exemplo de proteção simples:

```java
if (matriz.length == 0 || matriz[0].length == 0) {
    System.out.println("Matriz sem dados");
} else {
    int maior = matriz[0][0];
}
```

Esse assunto será aprofundado mais à frente.

---

## Exemplo aplicado: notas de alunos por bimestre

Arquivo:

```text
NotasAlunosBimestres.java
```

Código:

```java
public class NotasAlunosBimestres {
    public static void main(String[] args) {
        double[][] notas = {
                {8.0, 7.5, 9.0, 8.5},
                {6.0, 7.0, 6.5, 8.0},
                {9.0, 9.5, 10.0, 9.0}
        };

        for (int aluno = 0; aluno < notas.length; aluno++) {
            double soma = 0.0;

            for (int bimestre = 0; bimestre < notas[aluno].length; bimestre++) {
                soma += notas[aluno][bimestre];
            }

            double media = soma / notas[aluno].length;

            System.out.println("Aluno " + (aluno + 1) + " - média: " + media);
        }
    }
}
```

Aqui:

```text
linhas -> alunos;
colunas -> bimestres.
```

Esse exemplo é simples e muito didático.

---

## Exemplo aplicado: produtos por mês

Arquivo:

```text
VendasProdutosMes.java
```

Código:

```java
public class VendasProdutosMes {
    public static void main(String[] args) {
        int[][] vendas = {
                {10, 12, 8},
                {5, 7, 9},
                {20, 18, 22}
        };

        for (int produto = 0; produto < vendas.length; produto++) {
            int totalProduto = 0;

            for (int mes = 0; mes < vendas[produto].length; mes++) {
                totalProduto += vendas[produto][mes];
            }

            System.out.println("Produto " + (produto + 1)
                    + " - total vendido: " + totalProduto);
        }
    }
}
```

Aqui:

```text
linhas -> produtos;
colunas -> meses.
```

Cada linha representa um produto.

Cada coluna representa um mês.

---

## Exemplo aplicado: pedidos por status e mês

Arquivo:

```text
PedidosStatusMes.java
```

Código:

```java
public class PedidosStatusMes {
    public static void main(String[] args) {
        int[][] pedidos = {
                {10, 12, 8},
                {5, 7, 4},
                {2, 1, 3}
        };

        String[] status = {"PENDENTE", "APROVADO", "RECUSADO"};

        for (int linha = 0; linha < pedidos.length; linha++) {
            int totalStatus = 0;

            for (int mes = 0; mes < pedidos[linha].length; mes++) {
                totalStatus += pedidos[linha][mes];
            }

            System.out.println(status[linha] + " - total: " + totalStatus);
        }
    }
}
```

Aqui usamos uma matriz e um array paralelo para rótulo de linha.

Didaticamente:

```text
linha 0 -> PENDENTE;
linha 1 -> APROVADO;
linha 2 -> RECUSADO.
```

---

## Exemplo aplicado: OS e atividades

Arquivo:

```text
OrdensAtividadesMatriz.java
```

Código:

```java
public class OrdensAtividadesMatriz {
    public static void main(String[] args) {
        int[][] atividadesPorOs = {
                {1, 0, 1},
                {1, 1, 1},
                {0, 1, 0}
        };

        for (int os = 0; os < atividadesPorOs.length; os++) {
            int totalAtividades = 0;

            for (int atividade = 0; atividade < atividadesPorOs[os].length; atividade++) {
                totalAtividades += atividadesPorOs[os][atividade];
            }

            System.out.println("OS " + (os + 1)
                    + " - atividades marcadas: " + totalAtividades);
        }
    }
}
```

Aqui:

```text
linhas -> ordens de serviço;
colunas -> atividades possíveis;
valor 1 -> atividade presente;
valor 0 -> atividade ausente.
```

Esse é um exemplo conceitual.

No futuro, objetos representarão isso melhor.

---

## Exemplo aplicado: pagamentos por parcela

Arquivo:

```text
PagamentosParcelasMatriz.java
```

Código:

```java
public class PagamentosParcelasMatriz {
    public static void main(String[] args) {
        long[][] pagamentosCentavos = {
                {1000L, 1000L, 1000L},
                {2500L, 2500L, 0L},
                {5000L, 0L, 0L}
        };

        for (int pagamento = 0; pagamento < pagamentosCentavos.length; pagamento++) {
            long totalPagamento = 0L;

            for (int parcela = 0; parcela < pagamentosCentavos[pagamento].length; parcela++) {
                totalPagamento += pagamentosCentavos[pagamento][parcela];
            }

            System.out.println("Pagamento " + (pagamento + 1)
                    + " - total em centavos: " + totalPagamento);
        }
    }
}
```

Aqui:

```text
linhas -> pagamentos;
colunas -> parcelas;
valor 0 -> parcela inexistente ou não usada neste exemplo.
```

Para dinheiro, seguimos usando `long` em centavos.

---

## Exemplo aplicado: auditoria por dia e operação

Arquivo:

```text
AuditoriaDiaOperacaoMatriz.java
```

Código:

```java
public class AuditoriaDiaOperacaoMatriz {
    public static void main(String[] args) {
        int[][] eventos = {
                {5, 2, 1},
                {8, 4, 0},
                {3, 1, 2}
        };

        String[] operacoes = {"CRIACAO", "EDICAO", "EXCLUSAO"};

        for (int dia = 0; dia < eventos.length; dia++) {
            System.out.println("Dia " + (dia + 1));

            for (int operacao = 0; operacao < eventos[dia].length; operacao++) {
                System.out.println("  " + operacoes[operacao]
                        + ": " + eventos[dia][operacao]);
            }
        }
    }
}
```

Aqui:

```text
linhas -> dias;
colunas -> tipos de operação.
```

Esse exemplo mostra matriz com rótulo de coluna em um array separado.

---

## Exemplo aplicado: mensageria por dia e tipo

Arquivo:

```text
MensageriaDiaTipoMatriz.java
```

Código:

```java
public class MensageriaDiaTipoMatriz {
    public static void main(String[] args) {
        int[][] envios = {
                {10, 5, 2},
                {8, 7, 3},
                {12, 4, 1}
        };

        String[] tipos = {"BOAS_VINDAS", "ENTREGA", "NPS"};

        for (int dia = 0; dia < envios.length; dia++) {
            int totalDia = 0;

            System.out.println("Dia " + (dia + 1));

            for (int tipo = 0; tipo < envios[dia].length; tipo++) {
                System.out.println("  " + tipos[tipo] + ": " + envios[dia][tipo]);
                totalDia += envios[dia][tipo];
            }

            System.out.println("  Total do dia: " + totalDia);
        }
    }
}
```

Esse exemplo aplica matriz a um cenário de mensageria.

---

## Somando por linha

Somar por linha significa calcular o total de cada linha.

Exemplo:

```java
for (int linha = 0; linha < matriz.length; linha++) {
    int totalLinha = 0;

    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
        totalLinha += matriz[linha][coluna];
    }

    System.out.println(totalLinha);
}
```

Esse padrão aparece em:

```text
total por produto;
total por aluno;
total por OS;
total por dia;
total por cliente.
```

---

## Somando por coluna

Somar por coluna exige percorrer as linhas para uma coluna específica.

Arquivo:

```text
SomarColunas.java
```

Código:

```java
public class SomarColunas {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int quantidadeColunas = matriz[0].length;

        for (int coluna = 0; coluna < quantidadeColunas; coluna++) {
            int totalColuna = 0;

            for (int linha = 0; linha < matriz.length; linha++) {
                totalColuna += matriz[linha][coluna];
            }

            System.out.println("Total da coluna " + (coluna + 1)
                    + ": " + totalColuna);
        }
    }
}
```

Saída:

```text
Total da coluna 1: 50
Total da coluna 2: 70
Total da coluna 3: 90
```

Aqui assumimos matriz retangular.

Ou seja:

```text
todas as linhas têm a mesma quantidade de colunas.
```

---

## Matriz retangular

Uma matriz retangular tem todas as linhas com o mesmo número de colunas.

Exemplo:

```java
int[][] matriz = {
    {10, 20, 30},
    {40, 50, 60}
};
```

Linhas:

```text
linha 0 -> 3 colunas;
linha 1 -> 3 colunas.
```

É o caso mais simples e o mais importante nesta aula.

---

## Matriz irregular existe, mas não é foco agora

Java permite algo como:

```java
int[][] matriz = {
    {10, 20},
    {30, 40, 50}
};
```

Aqui:

```text
linha 0 tem 2 colunas;
linha 1 tem 3 colunas.
```

Isso é possível porque matriz em Java é array de arrays.

Mas nesta aula inicial, vamos trabalhar principalmente com matriz retangular.

Ainda assim, por segurança, o loop usa:

```java
matriz[linha].length
```

e não um número fixo.

---

## Buscando valor em matriz

Arquivo:

```text
BuscarValorMatriz.java
```

Código:

```java
public class BuscarValorMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int valorProcurado = 50;
        int linhaEncontrada = -1;
        int colunaEncontrada = -1;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                if (matriz[linha][coluna] == valorProcurado) {
                    linhaEncontrada = linha;
                    colunaEncontrada = coluna;
                    break;
                }
            }

            if (linhaEncontrada != -1) {
                break;
            }
        }

        if (linhaEncontrada != -1) {
            System.out.println("Valor encontrado na linha "
                    + (linhaEncontrada + 1)
                    + ", coluna "
                    + (colunaEncontrada + 1));
        } else {
            System.out.println("Valor não encontrado");
        }
    }
}
```

Esse exemplo mostra busca em duas dimensões.

Usamos dois `breaks` controlados:

```text
um para sair do loop interno;
outro para sair do loop externo.
```

---

## Alterando valor em matriz

Arquivo:

```text
AlterarValorMatriz.java
```

Código:

```java
public class AlterarValorMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int linha = 1;
        int coluna = 2;

        matriz[linha][coluna] = 99;

        for (int l = 0; l < matriz.length; l++) {
            for (int c = 0; c < matriz[l].length; c++) {
                System.out.print(matriz[l][c] + " ");
            }

            System.out.println();
        }
    }
}
```

Saída:

```text
10 20 30
40 50 99
```

Alteramos:

```java
matriz[1][2]
```

que era 60.

---

## Validando linha e coluna

Quando linha e coluna vêm de fora, valide antes.

Arquivo:

```text
ValidarLinhaColuna.java
```

Código:

```java
public class ValidarLinhaColuna {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        int linha = 1;
        int coluna = 2;

        boolean linhaValida = linha >= 0 && linha < matriz.length;
        boolean colunaValida = linhaValida
                && coluna >= 0
                && coluna < matriz[linha].length;

        if (linhaValida && colunaValida) {
            System.out.println("Valor: " + matriz[linha][coluna]);
        } else {
            System.out.println("Linha ou coluna inválida");
        }
    }
}
```

Repare:

```java
colunaValida
```

só pode verificar:

```java
matriz[linha].length
```

se `linhaValida` for verdadeira.

Caso contrário, tentar acessar `matriz[linha]` com linha inválida também causaria erro.

---

## Erros comuns

### Erro 1 — Confundir linha e coluna

Errado conceitualmente:

```java
matriz[coluna][linha]
```

quando a intenção era:

```java
matriz[linha][coluna]
```

A ordem importa.

---

### Erro 2 — Usar matriz.length para colunas

Errado:

```java
for (int coluna = 0; coluna < matriz.length; coluna++)
```

Certo:

```java
for (int coluna = 0; coluna < matriz[linha].length; coluna++)
```

---

### Erro 3 — Usar `<=`

Errado:

```java
linha <= matriz.length
coluna <= matriz[linha].length
```

Certo:

```java
linha < matriz.length
coluna < matriz[linha].length
```

---

### Erro 4 — Não quebrar linha na exibição

Se usar apenas:

```java
System.out.print(...)
```

sem `System.out.println()` depois do loop de colunas, a tabela sai em uma linha só.

---

### Erro 5 — Acessar matriz[0][0] em matriz vazia

Proteja quando existir risco de matriz vazia.

---

### Erro 6 — Somar índice em vez de valor

Errado:

```java
soma += linha + coluna;
```

quando a intenção era:

```java
soma += matriz[linha][coluna];
```

---

### Erro 7 — Validar coluna antes de validar linha

Perigoso:

```java
coluna < matriz[linha].length
```

se `linha` for inválida.

Valide linha primeiro.

---

### Erro 8 — Esquecer que matriz em Java é array de arrays

Por isso, cada linha pode ter tamanho diferente.

Use:

```java
matriz[linha].length
```

---

### Erro 9 — Usar nomes ruins

Evite:

```java
i
j
```

em exemplo de negócio grande.

Prefira:

```java
linha;
coluna;
produto;
mes;
dia;
tipo.
```

---

### Erro 10 — Fazer matriz quando um array simples bastava

Se só existe uma dimensão, use array simples.

Matriz faz sentido quando há duas dimensões reais.

---

## Diagnóstico de matriz

Quando uma matriz não funcionar, siga o roteiro.

### 1. Quantas linhas existem?

Verifique:

```java
matriz.length
```

### 2. Quantas colunas existem na linha atual?

Verifique:

```java
matriz[linha].length
```

### 3. O loop externo percorre linhas?

Deve usar:

```java
linha < matriz.length
```

### 4. O loop interno percorre colunas da linha atual?

Deve usar:

```java
coluna < matriz[linha].length
```

### 5. Você está acessando na ordem correta?

```java
matriz[linha][coluna]
```

### 6. A exibição quebra linha no lugar certo?

`println()` deve ficar depois do loop interno.

### 7. A matriz pode estar vazia?

Não acesse `matriz[0][0]` sem proteção.

### 8. Linha e coluna vindas de fora foram validadas?

Valide antes de acessar.

### 9. A soma usa o valor da célula?

Use:

```java
matriz[linha][coluna]
```

### 10. Use debug

Observe:

```text
linha;
coluna;
matriz.length;
matriz[linha].length;
matriz[linha][coluna].
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Usar matriz.length para coluna

```java
public class Main {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz.length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

Explique por que a coluna 3 não aparece.

Depois corrija:

```java
coluna < matriz[linha].length
```

### Teste 2 — Usar <=

```java
public class Main {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        for (int linha = 0; linha <= matriz.length; linha++) {
            for (int coluna = 0; coluna <= matriz[linha].length; coluna++) {
                System.out.println(matriz[linha][coluna]);
            }
        }
    }
}
```

Leia o erro.

Depois corrija usando `<`.

### Teste 3 — Não quebrar linha

```java
public class Main {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }
        }
    }
}
```

Depois adicione:

```java
System.out.println();
```

após o loop interno.

### Teste 4 — Validar coluna antes da linha

```java
public class Main {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30}
        };

        int linha = 5;
        int coluna = 0;

        if (coluna >= 0 && coluna < matriz[linha].length) {
            System.out.println(matriz[linha][coluna]);
        }
    }
}
```

Depois corrija validando linha primeiro.

### Teste 5 — Somar índice em vez de valor

```java
public class Main {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        int soma = 0;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                soma += linha + coluna;
            }
        }

        System.out.println("Soma errada: " + soma);
    }
}
```

Depois corrija:

```java
soma += matriz[linha][coluna];
```

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-052-matriz-bidimensional-inicial
cd labs\m1\aula-052-matriz-bidimensional-inicial
```

Crie arquivos:

```text
Main.java
ExibirMatriz.java
ExibirComIndice.java
PreencherManual.java
PreencherComCalculo.java
LerMatrizConsole.java
SomarMatriz.java
MediaMatriz.java
MaiorMenorMatriz.java
NotasAlunosBimestres.java
VendasProdutosMes.java
PedidosStatusMes.java
OrdensAtividadesMatriz.java
PagamentosParcelasMatriz.java
AuditoriaDiaOperacaoMatriz.java
MensageriaDiaTipoMatriz.java
SomarColunas.java
BuscarValorMatriz.java
AlterarValorMatriz.java
ValidarLinhaColuna.java
ErroLengthColuna.java
ErroMenorIgual.java
ErroSemQuebraLinha.java
ErroValidarColunaAntesLinha.java
ErroSomarIndice.java
```

Compile:

```powershell
javac Main.java
javac ExibirMatriz.java
javac ExibirComIndice.java
javac PreencherManual.java
javac PreencherComCalculo.java
javac LerMatrizConsole.java
javac SomarMatriz.java
javac MediaMatriz.java
javac MaiorMenorMatriz.java
javac NotasAlunosBimestres.java
javac VendasProdutosMes.java
javac PedidosStatusMes.java
javac OrdensAtividadesMatriz.java
javac PagamentosParcelasMatriz.java
javac AuditoriaDiaOperacaoMatriz.java
javac MensageriaDiaTipoMatriz.java
javac SomarColunas.java
javac BuscarValorMatriz.java
javac AlterarValorMatriz.java
javac ValidarLinhaColuna.java
javac ErroLengthColuna.java
javac ErroMenorIgual.java
javac ErroSemQuebraLinha.java
javac ErroValidarColunaAntesLinha.java
javac ErroSomarIndice.java
```

Execute:

```powershell
java Main
java ExibirMatriz
java ExibirComIndice
java PreencherManual
java PreencherComCalculo
java LerMatrizConsole
java SomarMatriz
java MediaMatriz
java MaiorMenorMatriz
java NotasAlunosBimestres
java VendasProdutosMes
java PedidosStatusMes
java OrdensAtividadesMatriz
java PagamentosParcelasMatriz
java AuditoriaDiaOperacaoMatriz
java MensageriaDiaTipoMatriz
java SomarColunas
java BuscarValorMatriz
java AlterarValorMatriz
java ValidarLinhaColuna
java ErroLengthColuna
java ErroMenorIgual
java ErroSemQuebraLinha
java ErroValidarColunaAntesLinha
java ErroSomarIndice
```

Alguns arquivos de erro proposital podem quebrar ou exibir resultado errado.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroLengthColuna.java`

```java
public class ErroLengthColuna {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30},
                {40, 50, 60}
        };

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz.length; coluna++) {
                System.out.print(matriz[linha][coluna] + " ");
            }

            System.out.println();
        }
    }
}
```

Depois corrija:

```java
coluna < matriz[linha].length
```

Objetivo:

```text
entender diferença entre quantidade de linhas e quantidade de colunas.
```

---

## Arquivo sugerido: `ErroValidarColunaAntesLinha.java`

```java
public class ErroValidarColunaAntesLinha {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20, 30}
        };

        int linha = 5;
        int coluna = 0;

        if (coluna >= 0 && coluna < matriz[linha].length) {
            System.out.println(matriz[linha][coluna]);
        }
    }
}
```

Depois corrija validando linha antes de validar coluna.

Objetivo:

```text
entender que a coluna depende de uma linha válida.
```

---

## Arquivo sugerido: `ErroSomarIndice.java`

```java
public class ErroSomarIndice {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        int soma = 0;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                soma += linha + coluna;
            }
        }

        System.out.println("Soma errada: " + soma);
    }
}
```

Depois corrija:

```java
soma += matriz[linha][coluna];
```

Objetivo:

```text
diferenciar índice de linha/coluna do valor armazenado na célula.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar laços aninhados |
| Renomear variável | `Shift + F6` | Melhorar nomes como `linha` e `coluna` |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver linha, coluna e célula |
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

## Debug recomendado

Use debug neste trecho:

```java
int[][] matriz = {
        {10, 20, 30},
        {40, 50, 60}
};

for (int linha = 0; linha < matriz.length; linha++) {
    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
        System.out.println(matriz[linha][coluna]);
    }
}
```

Observe:

```text
linha = 0, coluna = 0, valor = 10;
linha = 0, coluna = 1, valor = 20;
linha = 0, coluna = 2, valor = 30;
linha = 1, coluna = 0, valor = 40;
linha = 1, coluna = 1, valor = 50;
linha = 1, coluna = 2, valor = 60.
```

Esse debug fixa:

```text
linha;
coluna;
valor;
loop externo;
loop interno.
```

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 052 — Matriz bidimensional inicial

### O que aprendi
Aprendi que matriz bidimensional representa dados em linhas e colunas, acessados com dois índices: `matriz[linha][coluna]`.

### O que pratiquei
Criei, preenchi, exibi, somei, calculei média, encontrei maior e menor, busquei e alterei valores em matrizes. Também apliquei matriz em notas, produtos por mês, pedidos por status e mês, OS e atividades, pagamentos por parcela, auditoria e mensageria.

### Conceitos principais
- matriz bidimensional
- `int[][]`
- `double[][]`
- `long[][]`
- linha
- coluna
- célula
- tabela simples
- `matriz[linha][coluna]`
- `matriz.length`
- `matriz[linha].length`
- laços aninhados
- loop externo
- loop interno
- leitura com Scanner
- exibição tabular
- soma por linha
- soma por coluna
- busca em matriz
- alteração em matriz
- validação de linha e coluna

### Arquivos criados
- `labs/m1/aula-052-matriz-bidimensional-inicial/Main.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ExibirMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ExibirComIndice.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/PreencherManual.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/PreencherComCalculo.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/LerMatrizConsole.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/SomarMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/MediaMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/MaiorMenorMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/NotasAlunosBimestres.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/VendasProdutosMes.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/PedidosStatusMes.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/OrdensAtividadesMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/PagamentosParcelasMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/AuditoriaDiaOperacaoMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/MensageriaDiaTipoMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/SomarColunas.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/BuscarValorMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/AlterarValorMatriz.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ValidarLinhaColuna.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ErroLengthColuna.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ErroMenorIgual.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ErroSemQuebraLinha.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ErroValidarColunaAntesLinha.java`
- `labs/m1/aula-052-matriz-bidimensional-inicial/ErroSomarIndice.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac ExibirMatriz.java
java ExibirMatriz
javac LerMatrizConsole.java
java LerMatrizConsole
javac SomarMatriz.java
java SomarMatriz
javac MensageriaDiaTipoMatriz.java
java MensageriaDiaTipoMatriz
```

### Erros que quero evitar
- confundir linha e coluna;
- usar `matriz.length` para colunas;
- usar `<=`;
- não quebrar linha na exibição;
- acessar `matriz[0][0]` em matriz vazia;
- somar índice em vez de valor;
- validar coluna antes de validar linha;
- esquecer que matriz em Java é array de arrays;
- usar nomes ruins;
- fazer matriz quando array simples bastava.

### Próximo passo
Estudar métodos sem retorno.
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
git add labs/m1/aula-052-matriz-bidimensional-inicial docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 052: pratica matriz bidimensional inicial em Java"
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
1. O que é uma matriz bidimensional?
2. Qual a diferença entre array simples e matriz?
3. O que representa o primeiro índice em `matriz[linha][coluna]`?
4. O que representa o segundo índice?
5. O que significa `matriz.length`?
6. O que significa `matriz[linha].length`?
7. Por que usamos laços aninhados para percorrer matriz?
8. Por que não devemos usar `matriz.length` como quantidade de colunas?
9. Como validar linha e coluna antes de acessar uma célula?
10. Em quais cenários de backend uma tabela simples pode ser representada didaticamente por matriz?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar matriz bidimensional;
diferenciar array simples de matriz;
declarar int[][];
declarar double[][];
declarar long[][];
criar matriz com valores conhecidos;
criar matriz com new int[linhas][colunas];
acessar matriz[linha][coluna];
explicar linha;
explicar coluna;
explicar célula;
usar matriz.length;
usar matriz[linha].length;
percorrer matriz com laços aninhados;
exibir matriz em formato de tabela;
preencher matriz manualmente;
preencher matriz com cálculo;
ler matriz com Scanner;
somar elementos da matriz;
calcular média dos elementos;
encontrar maior valor;
encontrar menor valor;
somar por linha;
somar por coluna;
buscar valor em matriz;
alterar valor em matriz;
validar linha e coluna;
aplicar matriz em notas;
aplicar matriz em produtos por mês;
aplicar matriz em pedidos por status e mês;
aplicar matriz em OS e atividades;
aplicar matriz em pagamentos por parcela;
aplicar matriz em auditoria;
aplicar matriz em mensageria;
diagnosticar erros comuns;
debugar linha, coluna e valor;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar matrizes avançadas.

Não precisa ainda dominar objetos.

Não precisa ainda dominar listas.

Não precisa ainda dominar algoritmos complexos de matriz.

Não precisa ainda dominar banco de dados.

Esses assuntos virão depois.

O objetivo é dominar a ideia inicial de matriz como tabela simples com linhas e colunas.

---

## Fechamento da aula

Hoje aprendemos matriz bidimensional inicial.

A ideia central foi:

```text
uma matriz representa dados em linhas e colunas.
```

O acesso principal é:

```java
matriz[linha][coluna]
```

O padrão principal de percurso é:

```java
for (int linha = 0; linha < matriz.length; linha++) {
    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
        System.out.println(matriz[linha][coluna]);
    }
}
```

O ponto mais importante é:

```text
matriz.length indica quantidade de linhas;
matriz[linha].length indica quantidade de colunas daquela linha.
```

Também vimos leitura, exibição, soma, média, maior, menor, busca, alteração, validação de linha e coluna, e aplicações em cenários corporativos.

Na próxima aula, vamos começar métodos sem retorno.

Esse será um marco importante: vamos sair de programas grandes dentro do `main` e começar a organizar o código em blocos com responsabilidade.
