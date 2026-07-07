# 045 — M1.25 — Arrays de Números

## Onde estamos na formação

Estamos no Módulo 1, entrando em estruturas que guardam vários valores.

A sequência recente foi:

```text
041 — M1.21 — For clássico;
042 — M1.22 — Break e continue;
043 — M1.23 — Laços aninhados;
044 — M1.24 — Validação de entrada sem try/catch profundo;
045 — M1.25 — Arrays de números.
```

Até agora, quando precisávamos guardar valores, fazíamos assim:

```java
int nota1 = 8;
int nota2 = 7;
int nota3 = 10;
```

Ou:

```java
long valorPedido1 = 1000L;
long valorPedido2 = 2500L;
long valorPedido3 = 5000L;
```

Isso funciona para poucos valores.

Mas imagine guardar:

```text
10 notas;
50 pagamentos;
100 produtos;
500 códigos;
1000 registros;
```

Criar uma variável para cada item não escala.

É aqui que entram os arrays.

Array é uma estrutura que permite guardar vários valores do mesmo tipo em uma única variável.

Exemplo:

```java
int[] notas = {8, 7, 10};
```

Agora temos uma única variável:

```java
notas
```

guardando vários números.

---

## Hoje a aula é sobre parar de criar variável repetida

Sem array:

```java
int valor1 = 10;
int valor2 = 20;
int valor3 = 30;
int valor4 = 40;
int valor5 = 50;
```

Com array:

```java
int[] valores = {10, 20, 30, 40, 50};
```

A diferença parece pequena agora.

Mas com loops, o array fica poderoso:

```java
for (int indice = 0; indice < valores.length; indice++) {
    System.out.println(valores[indice]);
}
```

Esse código percorre todos os valores.

Hoje vamos aprender:

```text
como declarar array;
como inicializar array;
como acessar posição;
por que índice começa em zero;
como usar length;
como percorrer com for;
como somar valores;
como calcular média;
como aplicar em cenários de backend;
quais erros evitar.
```

---

## O que é array

Array é uma estrutura que armazena vários valores do mesmo tipo.

Exemplo:

```java
int[] numeros = {10, 20, 30};
```

Esse array tem três posições.

Visualmente:

```text
índice:   0   1   2
valor:   10  20  30
```

Atenção ao detalhe mais importante:

```text
o primeiro índice é 0.
```

Então:

```java
numeros[0]
```

é o primeiro valor.

```java
numeros[1]
```

é o segundo valor.

```java
numeros[2]
```

é o terceiro valor.

---

## Por que arrays existem

Arrays existem porque muitos problemas trabalham com coleção de valores.

Exemplos simples:

```text
notas de um aluno;
valores de pedidos;
quantidades em estoque;
códigos de ocorrências;
tempos de atendimento;
parcelas;
idades;
pontuações;
valores de transações;
quantidade de tentativas por mensagem.
```

Sem array, o código fica repetitivo.

Com array, conseguimos combinar:

```text
vários valores;
loop;
índice;
processamento em lote.
```

Exemplo:

```java
int[] quantidades = {3, 5, 2, 8};

for (int i = 0; i < quantidades.length; i++) {
    System.out.println(quantidades[i]);
}
```

O loop não precisa saber manualmente cada variável.

Ele percorre as posições.

---

## Vocabulário essencial

Termos desta aula:

```text
array;
vetor;
posição;
índice;
elemento;
length;
tamanho;
declaração;
inicialização;
iteração;
percorrer;
acessar;
atribuir;
soma;
média;
maior valor;
menor valor;
índice zero;
ArrayIndexOutOfBoundsException;
valor padrão;
tamanho fixo.
```

Termos mais importantes:

```text
array -> estrutura que guarda vários valores do mesmo tipo;
elemento -> cada valor dentro do array;
índice -> posição usada para acessar um elemento;
length -> tamanho do array;
iteração -> percorrer o array com loop;
tamanho fixo -> array não cresce automaticamente.
```

---

## Declaração de array

Forma mais comum:

```java
int[] numeros;
```

Isso declara uma variável chamada:

```java
numeros
```

capaz de apontar para um array de `int`.

Também existe esta forma:

```java
int numeros[];
```

Mas, em Java moderno, prefira:

```java
int[] numeros;
```

Porque deixa claro que o tipo é:

```text
array de int.
```

Outros exemplos:

```java
long[] valoresCentavos;
double[] medias;
```

---

## Inicialização com valores conhecidos

Quando já sabemos os valores:

```java
int[] notas = {8, 7, 10};
```

Ou:

```java
long[] valoresCentavos = {1000L, 2500L, 5000L};
```

Ou:

```java
int[] quantidades = {3, 5, 2, 8};
```

Essa forma cria o array e já preenche os elementos.

Visual:

```text
int[] notas = {8, 7, 10};

índice:  0  1   2
valor:   8  7  10
```

---

## Inicialização com tamanho definido

Também podemos criar um array vazio com tamanho definido.

Exemplo:

```java
int[] numeros = new int[5];
```

Isso cria um array com 5 posições.

Visual:

```text
índice:  0  1  2  3  4
valor:   0  0  0  0  0
```

Para `int`, o valor padrão é:

```text
0.
```

Para `long`, também é:

```text
0.
```

Para `double`, é:

```text
0.0.
```

Mais tarde, quando estudarmos objetos e String em array, veremos outros valores padrão.

---

## Tamanho fixo

Array tem tamanho fixo.

Se você cria:

```java
int[] numeros = new int[3];
```

ele terá 3 posições:

```text
0, 1, 2.
```

Você não pode colocar um quarto elemento como se ele crescesse sozinho.

Isso dá erro:

```java
numeros[3] = 40;
```

Por quê?

Porque o índice 3 seria a quarta posição.

Mas o array tem índices:

```text
0, 1, 2.
```

Esse erro será um dos mais comuns.

---

## Índice começa em zero

Este é o ponto que mais derruba iniciante.

Array com 5 posições:

```java
int[] numeros = new int[5];
```

Tem índices:

```text
0, 1, 2, 3, 4.
```

Não tem índice 5.

A regra é:

```text
primeiro índice = 0;
último índice = length - 1.
```

Se:

```java
numeros.length
```

é 5, então o último índice é:

```java
5 - 1 = 4.
```

---

## length

`length` informa o tamanho do array.

Exemplo:

```java
int[] numeros = {10, 20, 30};

System.out.println(numeros.length);
```

Saída:

```text
3
```

Atenção:

```java
numeros.length
```

não tem parênteses.

Para String, usamos:

```java
texto.length()
```

com parênteses.

Para array, usamos:

```java
array.length
```

sem parênteses.

Esse detalhe é muito importante.

---

## Primeiro exemplo mínimo

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        System.out.println(numeros[0]);
        System.out.println(numeros[1]);
        System.out.println(numeros[2]);
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
```

Esse é o primeiro contato.

O array tem três elementos.

Acessamos cada um pelo índice.

---

## Acessando posições

Exemplo:

```java
int[] valores = {100, 200, 300};

System.out.println(valores[0]);
System.out.println(valores[1]);
System.out.println(valores[2]);
```

Visual:

```text
valores[0] -> 100
valores[1] -> 200
valores[2] -> 300
```

A posição entre colchetes é o índice:

```java
[0]
[1]
[2]
```

Colchetes fazem parte do acesso ao array.

---

## Alterando posição

Podemos alterar um elemento.

Arquivo:

```text
AlterandoArray.java
```

Código:

```java
public class AlterandoArray {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        numeros[1] = 99;

        System.out.println(numeros[0]);
        System.out.println(numeros[1]);
        System.out.println(numeros[2]);
    }
}
```

Saída:

```text
10
99
30
```

Alteramos a posição 1.

Lembre:

```text
posição 1 é o segundo elemento.
```

---

## Preenchendo array criado por tamanho

Arquivo:

```text
PreenchendoArray.java
```

Código:

```java
public class PreenchendoArray {
    public static void main(String[] args) {
        int[] numeros = new int[3];

        numeros[0] = 10;
        numeros[1] = 20;
        numeros[2] = 30;

        System.out.println(numeros[0]);
        System.out.println(numeros[1]);
        System.out.println(numeros[2]);
    }
}
```

Aqui criamos primeiro:

```java
new int[3]
```

Depois preenchemos cada posição.

---

## Percorrendo array com for

O jeito mais comum de percorrer array é com `for`.

Arquivo:

```text
PercorrendoArray.java
```

Código:

```java
public class PercorrendoArray {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30, 40, 50};

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println("Índice " + indice + ": " + numeros[indice]);
        }
    }
}
```

Saída:

```text
Índice 0: 10
Índice 1: 20
Índice 2: 30
Índice 3: 40
Índice 4: 50
```

Esse padrão é obrigatório:

```java
for (int indice = 0; indice < array.length; indice++)
```

---

## Por que usar `< array.length`

Se o array tem tamanho 5:

```java
numeros.length
```

é 5.

Os índices válidos são:

```text
0, 1, 2, 3, 4.
```

Então o loop correto é:

```java
indice < numeros.length
```

Porque o último valor de `indice` será 4.

Se usar:

```java
indice <= numeros.length
```

o loop tentará acessar:

```java
numeros[5]
```

Isso dá erro.

---

## Erro clássico: ArrayIndexOutOfBoundsException

Exemplo errado:

```java
int[] numeros = {10, 20, 30};

System.out.println(numeros[3]);
```

O array tem índices:

```text
0, 1, 2.
```

Não existe índice 3.

Erro comum:

```text
ArrayIndexOutOfBoundsException
```

Esse erro significa:

```text
você tentou acessar uma posição que não existe no array.
```

A correção é usar índices válidos.

---

## Último elemento

Para acessar o último elemento de forma segura:

```java
int ultimoIndice = numeros.length - 1;
System.out.println(numeros[ultimoIndice]);
```

Exemplo:

```java
int[] numeros = {10, 20, 30};

int ultimoIndice = numeros.length - 1;

System.out.println(numeros[ultimoIndice]);
```

Saída:

```text
30
```

Regra:

```text
último índice = length - 1.
```

---

## Soma de valores

Arquivo:

```text
SomaArray.java
```

Código:

```java
public class SomaArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30, 40};

        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        System.out.println("Total: " + total);
    }
}
```

Saída:

```text
Total: 100
```

Aqui usamos:

```text
array;
for;
índice;
length;
acumulador.
```

---

## Média de valores

Arquivo:

```text
MediaArray.java
```

Código:

```java
public class MediaArray {
    public static void main(String[] args) {
        int[] notas = {8, 7, 10, 9};

        int total = 0;

        for (int indice = 0; indice < notas.length; indice++) {
            total += notas[indice];
        }

        double media = (double) total / notas.length;

        System.out.println("Média: " + media);
    }
}
```

Saída:

```text
Média: 8.5
```

Atenção:

```java
(double) total
```

força divisão decimal.

Sem isso, se fizermos:

```java
int media = total / notas.length;
```

podemos perder casas decimais.

---

## Divisão inteira

Exemplo:

```java
int total = 34;
int quantidade = 4;

System.out.println(total / quantidade);
```

Saída:

```text
8
```

Mas a média real seria:

```text
8.5.
```

Como `total` e `quantidade` são inteiros, Java faz divisão inteira.

Para média decimal:

```java
double media = (double) total / quantidade;
```

Saída:

```text
8.5
```

Esse cuidado é importante.

---

## Maior valor

Arquivo:

```text
MaiorValorArray.java
```

Código:

```java
public class MaiorValorArray {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int maior = valores[0];

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] > maior) {
                maior = valores[indice];
            }
        }

        System.out.println("Maior valor: " + maior);
    }
}
```

Começamos com:

```java
int maior = valores[0];
```

Depois percorremos a partir do índice 1.

Por quê?

Porque o primeiro valor já foi usado como referência inicial.

---

## Menor valor

Arquivo:

```text
MenorValorArray.java
```

Código:

```java
public class MenorValorArray {
    public static void main(String[] args) {
        int[] valores = {15, 40, 7, 99, 23};

        int menor = valores[0];

        for (int indice = 1; indice < valores.length; indice++) {
            if (valores[indice] < menor) {
                menor = valores[indice];
            }
        }

        System.out.println("Menor valor: " + menor);
    }
}
```

Mesma lógica do maior valor.

Só muda a comparação:

```java
valores[indice] < menor
```

---

## Cuidado com array vazio

Se o array estiver vazio:

```java
int[] valores = {};
```

Este código dá erro:

```java
int maior = valores[0];
```

Porque não existe posição 0.

Nesta aula, vamos trabalhar com arrays preenchidos.

Mas já guarde o alerta:

```text
antes de acessar valores[0], garanta que o array tenha pelo menos um elemento.
```

Exemplo:

```java
if (valores.length > 0) {
    int maior = valores[0];
}
```

Arrays vazios serão tratados com mais maturidade ao longo do curso.

---

## Contando valores pares

Arquivo:

```text
ContarParesArray.java
```

Código:

```java
public class ContarParesArray {
    public static void main(String[] args) {
        int[] numeros = {1, 2, 3, 4, 5, 6};

        int pares = 0;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] % 2 == 0) {
                pares++;
            }
        }

        System.out.println("Quantidade de pares: " + pares);
    }
}
```

Aqui juntamos:

```text
array;
for;
if;
módulo;
contador.
```

---

## Somando apenas valores válidos

Arquivo:

```text
SomarValoresValidosArray.java
```

Código:

```java
public class SomarValoresValidosArray {
    public static void main(String[] args) {
        int[] valores = {10, -5, 20, 0, 30};

        int total = 0;
        int ignorados = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] <= 0) {
                ignorados++;
                continue;
            }

            total += valores[indice];
        }

        System.out.println("Total válido: " + total);
        System.out.println("Valores ignorados: " + ignorados);
    }
}
```

Aqui usamos `continue` para pular valores inválidos.

Isso conecta com a aula anterior.

---

## Array de long para dinheiro em centavos

Para dinheiro, vamos continuar usando centavos em `long`.

Arquivo:

```text
ValoresCentavosArray.java
```

Código:

```java
public class ValoresCentavosArray {
    public static void main(String[] args) {
        long[] valoresCentavos = {1000L, 2500L, 5000L};

        long totalCentavos = 0L;

        for (int indice = 0; indice < valoresCentavos.length; indice++) {
            totalCentavos += valoresCentavos[indice];
        }

        System.out.println("Total em centavos: " + totalCentavos);
    }
}
```

Saída:

```text
Total em centavos: 8500
```

Isso representa:

```text
R$ 85,00.
```

Ainda não vamos formatar moeda profissionalmente.

O objetivo é preservar cálculo inteiro.

---

## Exemplo aplicado: valores de pedidos

Arquivo:

```text
PedidosValoresArray.java
```

Código:

```java
public class PedidosValoresArray {
    public static void main(String[] args) {
        long[] valoresPedidosCentavos = {1000L, 2500L, 5000L, 3000L};

        long totalCentavos = 0L;

        for (int indice = 0; indice < valoresPedidosCentavos.length; indice++) {
            totalCentavos += valoresPedidosCentavos[indice];
        }

        double mediaCentavos = (double) totalCentavos / valoresPedidosCentavos.length;

        System.out.println("Total dos pedidos em centavos: " + totalCentavos);
        System.out.println("Média dos pedidos em centavos: " + mediaCentavos);
    }
}
```

Esse exemplo aplica soma e média em valores de pedidos.

---

## Exemplo aplicado: estoque de produtos

Arquivo:

```text
EstoqueProdutosArray.java
```

Código:

```java
public class EstoqueProdutosArray {
    public static void main(String[] args) {
        int[] estoques = {10, 0, 5, 2, 20};

        int produtosSemEstoque = 0;
        int totalEstoque = 0;

        for (int indice = 0; indice < estoques.length; indice++) {
            totalEstoque += estoques[indice];

            if (estoques[indice] == 0) {
                produtosSemEstoque++;
            }
        }

        System.out.println("Total em estoque: " + totalEstoque);
        System.out.println("Produtos sem estoque: " + produtosSemEstoque);
    }
}
```

Aqui aplicamos array em produto.

O array guarda o estoque de cada produto.

---

## Exemplo aplicado: atividades por OS

Arquivo:

```text
AtividadesPorOsArray.java
```

Código:

```java
public class AtividadesPorOsArray {
    public static void main(String[] args) {
        int[] atividadesPorOs = {2, 4, 1, 3};

        int totalAtividades = 0;
        int maiorQuantidade = atividadesPorOs[0];

        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            totalAtividades += atividadesPorOs[indice];

            if (atividadesPorOs[indice] > maiorQuantidade) {
                maiorQuantidade = atividadesPorOs[indice];
            }
        }

        System.out.println("Total de atividades: " + totalAtividades);
        System.out.println("Maior quantidade em uma OS: " + maiorQuantidade);
    }
}
```

Esse exemplo simula:

```text
cada posição representa uma OS;
o valor representa quantas atividades ela possui.
```

---

## Exemplo aplicado: códigos de ocorrência

Arquivo:

```text
OcorrenciasArray.java
```

Código:

```java
public class OcorrenciasArray {
    public static void main(String[] args) {
        int[] codigosOcorrencia = {100, 200, 100, 300, 100};

        int ocorrenciasCodigo100 = 0;

        for (int indice = 0; indice < codigosOcorrencia.length; indice++) {
            if (codigosOcorrencia[indice] == 100) {
                ocorrenciasCodigo100++;
            }
        }

        System.out.println("Ocorrências com código 100: " + ocorrenciasCodigo100);
    }
}
```

Aqui contamos quantas vezes um código aparece.

Esse padrão será útil quando estudarmos coleções de objetos.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaTentativasArray.java
```

Código:

```java
public class MensageriaTentativasArray {
    public static void main(String[] args) {
        int[] tentativasPorMensagem = {1, 3, 2, 1, 4};

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
    }
}
```

Esse exemplo aplica array em mensageria.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaEventosArray.java
```

Código:

```java
public class AuditoriaEventosArray {
    public static void main(String[] args) {
        int[] eventosPorDia = {5, 8, 3, 10, 4};

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
    }
}
```

Aqui temos:

```text
soma;
maior valor;
média.
```

Tudo com array.

---

## Exemplo aplicado: SLA em horas

Arquivo:

```text
SlaHorasArray.java
```

Código:

```java
public class SlaHorasArray {
    public static void main(String[] args) {
        int[] temposHoras = {2, 5, 1, 8, 3};

        int totalHoras = 0;
        int maiorTempo = temposHoras[0];

        for (int indice = 0; indice < temposHoras.length; indice++) {
            totalHoras += temposHoras[indice];

            if (temposHoras[indice] > maiorTempo) {
                maiorTempo = temposHoras[indice];
            }
        }

        double mediaHoras = (double) totalHoras / temposHoras.length;

        System.out.println("Total de horas: " + totalHoras);
        System.out.println("Maior tempo: " + maiorTempo);
        System.out.println("Média de horas: " + mediaHoras);
    }
}
```

Esse exemplo simula tempos de atendimento.

---

## Lendo valores para array com Scanner

Podemos preencher um array lendo valores.

Arquivo:

```text
LendoArrayConsole.java
```

Código:

```java
import java.util.Scanner;

public class LendoArrayConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] valores = new int[5];

        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println("Digite o valor da posição " + indice + ":");
            valores[indice] = scanner.nextInt();
        }

        System.out.println("Valores informados:");

        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println(valores[indice]);
        }

        scanner.close();
    }
}
```

Aqui usamos dois loops:

```text
um para preencher;
outro para exibir.
```

Isso é muito comum.

---

## Lendo e somando valores

Arquivo:

```text
LendoESomandoArrayConsole.java
```

Código:

```java
import java.util.Scanner;

public class LendoESomandoArrayConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] valores = new int[5];
        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println("Digite o valor da posição " + indice + ":");
            valores[indice] = scanner.nextInt();

            total += valores[indice];
        }

        double media = (double) total / valores.length;

        System.out.println("Total: " + total);
        System.out.println("Média: " + media);

        scanner.close();
    }
}
```

Aqui preenchemos e somamos no mesmo loop.

Isso é aceitável quando a regra é simples.

---

## Validação ao preencher array

Podemos validar cada posição.

Arquivo:

```text
ArrayComValidacaoConsole.java
```

Código:

```java
import java.util.Scanner;

public class ArrayComValidacaoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] quantidades = new int[5];

        for (int indice = 0; indice < quantidades.length; indice++) {
            do {
                System.out.println("Digite a quantidade da posição " + indice + ":");
                quantidades[indice] = scanner.nextInt();

                if (quantidades[indice] < 0) {
                    System.out.println("Quantidade não pode ser negativa.");
                }
            } while (quantidades[indice] < 0);
        }

        System.out.println("Quantidades válidas:");

        for (int indice = 0; indice < quantidades.length; indice++) {
            System.out.println(quantidades[indice]);
        }

        scanner.close();
    }
}
```

Esse exemplo conecta:

```text
array;
for;
do while;
validação de entrada.
```

---

## Array com tamanho fixo nesta aula

Nesta aula, os tamanhos serão definidos diretamente no código.

Exemplo:

```java
int[] valores = new int[5];
```

Na próxima aula, vamos estudar arrays com tamanho definido pelo usuário.

Exemplo futuro:

```java
System.out.println("Quantos valores deseja informar?");
int tamanho = scanner.nextInt();

int[] valores = new int[tamanho];
```

Hoje o foco é entender o array em si:

```text
índice;
length;
acesso;
iteração;
soma;
média.
```

---

## Array não é lista

Um array tem tamanho fixo.

Uma lista, que estudaremos depois, é mais flexível.

Por enquanto, guarde:

```text
array é simples, rápido e fixo;
lista é mais flexível e será estudada depois.
```

Não tente fazer array crescer sozinho.

Se precisa adicionar/remover dinamicamente, mais tarde usaremos estruturas como:

```text
ArrayList.
```

---

## Arrays e métodos no futuro

Hoje estamos escrevendo tudo dentro do `main`.

Mais tarde, vamos criar métodos como:

```java
calcularTotal(...)
calcularMedia(...)
buscarMaior(...)
contarPares(...)
```

Por enquanto, o objetivo é dominar o mecanismo básico.

O caminho é:

```text
primeiro entender array;
depois organizar lógica em métodos;
depois trabalhar com objetos e coleções.
```

Não pule etapa.

---

## Erros comuns

### Erro 1 — Achar que o primeiro índice é 1

Errado:

```java
int[] numeros = {10, 20, 30};

System.out.println(numeros[1]);
```

Se a intenção era pegar o primeiro, isso pega o segundo.

Primeiro elemento:

```java
numeros[0]
```

---

### Erro 2 — Usar `<= array.length`

Errado:

```java
for (int indice = 0; indice <= numeros.length; indice++) {
    System.out.println(numeros[indice]);
}
```

Certo:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    System.out.println(numeros[indice]);
}
```

---

### Erro 3 — Confundir `length` de array com `length()` de String

Array:

```java
numeros.length
```

String:

```java
texto.length()
```

Não misture.

---

### Erro 4 — Acessar índice que não existe

Errado:

```java
int[] numeros = new int[3];

numeros[3] = 10;
```

Índices válidos:

```text
0, 1, 2.
```

---

### Erro 5 — Calcular média com divisão inteira

Errado:

```java
int media = total / numeros.length;
```

Melhor:

```java
double media = (double) total / numeros.length;
```

---

### Erro 6 — Usar `valores[0]` em array vazio

Se o array pode estar vazio, acessar posição 0 dá erro.

Valide:

```java
if (valores.length > 0) {
    int primeiro = valores[0];
}
```

---

### Erro 7 — Esquecer que `new int[5]` começa com zeros

Exemplo:

```java
int[] numeros = new int[5];
```

Todos os valores começam em 0.

Se você esperava valores preenchidos, precisa atribuir.

---

### Erro 8 — Confundir índice com valor

Exemplo:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    System.out.println(indice);
}
```

Isso imprime o índice.

Para imprimir o valor:

```java
System.out.println(numeros[indice]);
```

---

### Erro 9 — Usar array quando precisa de crescimento dinâmico

Array tem tamanho fixo.

Se precisa adicionar sem saber limite, futuramente usaremos lista.

---

### Erro 10 — Não testar primeiro, último e fora do limite

Sempre teste:

```text
índice 0;
último índice;
loop completo;
tentativa fora do limite para entender o erro.
```

---

## Diagnóstico de problemas com array

Quando um array não funcionar, siga o roteiro.

### 1. Qual é o tamanho do array?

Veja:

```java
array.length
```

### 2. Quais são os índices válidos?

Se tamanho é 5:

```text
0 a 4.
```

### 3. O loop usa `< array.length`?

Verifique.

### 4. Você está imprimindo índice ou valor?

Índice:

```java
indice
```

Valor:

```java
array[indice]
```

### 5. O array foi preenchido?

Se criou com `new int[5]`, começa com zeros.

### 6. O acumulador foi inicializado?

Exemplo:

```java
int total = 0;
```

### 7. A média usa divisão decimal?

Use cast para `double`.

### 8. O array pode estar vazio?

Não acesse `[0]` sem verificar.

### 9. O erro é ArrayIndexOutOfBoundsException?

Você acessou índice inexistente.

### 10. Use debug

Observe:

```text
indice;
array.length;
array[indice].
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Índice fora do limite

```java
public class Main {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        System.out.println(numeros[3]);
    }
}
```

Leia o erro.

Depois corrija para:

```java
numeros[2]
```

### Teste 2 — Loop com `<=`

```java
public class Main {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        for (int indice = 0; indice <= numeros.length; indice++) {
            System.out.println(numeros[indice]);
        }
    }
}
```

Depois corrija para:

```java
indice < numeros.length
```

### Teste 3 — Imprimir índice em vez do valor

```java
public class Main {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println(indice);
        }
    }
}
```

Depois corrija para:

```java
System.out.println(numeros[indice]);
```

### Teste 4 — Média com divisão inteira

```java
public class Main {
    public static void main(String[] args) {
        int[] notas = {8, 7, 10, 9};

        int total = 0;

        for (int indice = 0; indice < notas.length; indice++) {
            total += notas[indice];
        }

        int media = total / notas.length;

        System.out.println(media);
    }
}
```

Depois corrija para:

```java
double media = (double) total / notas.length;
```

### Teste 5 — Array vazio

```java
public class Main {
    public static void main(String[] args) {
        int[] valores = {};

        System.out.println(valores[0]);
    }
}
```

Leia o erro.

Depois proteja com:

```java
if (valores.length > 0) {
    System.out.println(valores[0]);
}
```

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-045-arrays-numeros
cd labs\m1\aula-045-arrays-numeros
```

Crie arquivos:

```text
Main.java
AlterandoArray.java
PreenchendoArray.java
PercorrendoArray.java
SomaArray.java
MediaArray.java
MaiorValorArray.java
MenorValorArray.java
ContarParesArray.java
SomarValoresValidosArray.java
ValoresCentavosArray.java
PedidosValoresArray.java
EstoqueProdutosArray.java
AtividadesPorOsArray.java
OcorrenciasArray.java
MensageriaTentativasArray.java
AuditoriaEventosArray.java
SlaHorasArray.java
LendoArrayConsole.java
LendoESomandoArrayConsole.java
ArrayComValidacaoConsole.java
ErroIndiceForaDoLimite.java
ErroLoopComMenorIgual.java
ErroMediaInteira.java
```

Compile:

```powershell
javac Main.java
javac AlterandoArray.java
javac PreenchendoArray.java
javac PercorrendoArray.java
javac SomaArray.java
javac MediaArray.java
javac MaiorValorArray.java
javac MenorValorArray.java
javac ContarParesArray.java
javac SomarValoresValidosArray.java
javac ValoresCentavosArray.java
javac PedidosValoresArray.java
javac EstoqueProdutosArray.java
javac AtividadesPorOsArray.java
javac OcorrenciasArray.java
javac MensageriaTentativasArray.java
javac AuditoriaEventosArray.java
javac SlaHorasArray.java
javac LendoArrayConsole.java
javac LendoESomandoArrayConsole.java
javac ArrayComValidacaoConsole.java
javac ErroIndiceForaDoLimite.java
javac ErroLoopComMenorIgual.java
javac ErroMediaInteira.java
```

Execute:

```powershell
java Main
java AlterandoArray
java PreenchendoArray
java PercorrendoArray
java SomaArray
java MediaArray
java MaiorValorArray
java MenorValorArray
java ContarParesArray
java SomarValoresValidosArray
java ValoresCentavosArray
java PedidosValoresArray
java EstoqueProdutosArray
java AtividadesPorOsArray
java OcorrenciasArray
java MensageriaTentativasArray
java AuditoriaEventosArray
java SlaHorasArray
java LendoArrayConsole
java LendoESomandoArrayConsole
java ArrayComValidacaoConsole
java ErroIndiceForaDoLimite
java ErroLoopComMenorIgual
java ErroMediaInteira
```

Alguns arquivos de erro proposital podem quebrar em execução.

Isso é esperado para diagnóstico.

---

## Arquivo sugerido: `ErroIndiceForaDoLimite.java`

```java
public class ErroIndiceForaDoLimite {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        System.out.println(numeros[3]);
    }
}
```

Objetivo:

```text
entender ArrayIndexOutOfBoundsException.
```

---

## Arquivo sugerido: `ErroLoopComMenorIgual.java`

```java
public class ErroLoopComMenorIgual {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        for (int indice = 0; indice <= numeros.length; indice++) {
            System.out.println(numeros[indice]);
        }
    }
}
```

Objetivo:

```text
ver por que array deve ser percorrido com indice < array.length.
```

---

## Arquivo sugerido: `ErroMediaInteira.java`

```java
public class ErroMediaInteira {
    public static void main(String[] args) {
        int[] notas = {8, 7, 10, 9};

        int total = 0;

        for (int indice = 0; indice < notas.length; indice++) {
            total += notas[indice];
        }

        int media = total / notas.length;

        System.out.println("Média inteira: " + media);
    }
}
```

Depois corrija:

```java
double media = (double) total / notas.length;
```

Objetivo:

```text
entender divisão inteira versus média decimal.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar loops com array |
| Renomear variável | `Shift + F6` | Melhorar nomes como `indice`, `total` |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver índice e valor |
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

## Debug para arrays

Use debug neste exemplo:

```java
int[] numeros = {10, 20, 30};

for (int indice = 0; indice < numeros.length; indice++) {
    System.out.println(numeros[indice]);
}
```

Coloque breakpoint dentro do loop.

Observe:

```text
indice = 0, numeros[indice] = 10;
indice = 1, numeros[indice] = 20;
indice = 2, numeros[indice] = 30;
indice = 3, condição fica false e o loop termina.
```

Debug ajuda muito a entender:

```text
índice;
length;
valor acessado;
momento de parada.
```

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 045 — Arrays de números

### O que aprendi
Aprendi que array guarda vários valores do mesmo tipo, que os índices começam em zero, que o tamanho é acessado com `length` e que o último índice é `length - 1`.

### O que pratiquei
Criei arrays de números, acessei posições, alterei valores, preenchi arrays, percorri com `for`, somei valores, calculei média, busquei maior e menor, contei pares, ignorei valores inválidos e apliquei arrays em pedidos, produtos, OS, ocorrência, mensageria, auditoria e SLA.

### Conceitos principais
- array
- vetor
- índice
- elemento
- posição
- `length`
- tamanho fixo
- inicialização
- `new int[]`
- `new int[5]`
- índice zero
- último índice
- iteração com `for`
- soma
- média
- maior valor
- menor valor
- `ArrayIndexOutOfBoundsException`
- valores padrão
- array de `int`
- array de `long`

### Arquivos criados
- `labs/m1/aula-045-arrays-numeros/Main.java`
- `labs/m1/aula-045-arrays-numeros/AlterandoArray.java`
- `labs/m1/aula-045-arrays-numeros/PreenchendoArray.java`
- `labs/m1/aula-045-arrays-numeros/PercorrendoArray.java`
- `labs/m1/aula-045-arrays-numeros/SomaArray.java`
- `labs/m1/aula-045-arrays-numeros/MediaArray.java`
- `labs/m1/aula-045-arrays-numeros/MaiorValorArray.java`
- `labs/m1/aula-045-arrays-numeros/MenorValorArray.java`
- `labs/m1/aula-045-arrays-numeros/ContarParesArray.java`
- `labs/m1/aula-045-arrays-numeros/SomarValoresValidosArray.java`
- `labs/m1/aula-045-arrays-numeros/ValoresCentavosArray.java`
- `labs/m1/aula-045-arrays-numeros/PedidosValoresArray.java`
- `labs/m1/aula-045-arrays-numeros/EstoqueProdutosArray.java`
- `labs/m1/aula-045-arrays-numeros/AtividadesPorOsArray.java`
- `labs/m1/aula-045-arrays-numeros/OcorrenciasArray.java`
- `labs/m1/aula-045-arrays-numeros/MensageriaTentativasArray.java`
- `labs/m1/aula-045-arrays-numeros/AuditoriaEventosArray.java`
- `labs/m1/aula-045-arrays-numeros/SlaHorasArray.java`
- `labs/m1/aula-045-arrays-numeros/LendoArrayConsole.java`
- `labs/m1/aula-045-arrays-numeros/LendoESomandoArrayConsole.java`
- `labs/m1/aula-045-arrays-numeros/ArrayComValidacaoConsole.java`
- `labs/m1/aula-045-arrays-numeros/ErroIndiceForaDoLimite.java`
- `labs/m1/aula-045-arrays-numeros/ErroLoopComMenorIgual.java`
- `labs/m1/aula-045-arrays-numeros/ErroMediaInteira.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac PercorrendoArray.java
java PercorrendoArray
javac SomaArray.java
java SomaArray
javac MediaArray.java
java MediaArray
javac PedidosValoresArray.java
java PedidosValoresArray
```

### Erros que quero evitar
- achar que o primeiro índice é 1;
- usar `<= array.length`;
- confundir `length` de array com `length()` de String;
- acessar índice que não existe;
- calcular média com divisão inteira;
- acessar `valores[0]` em array vazio;
- esquecer que `new int[5]` começa com zeros;
- confundir índice com valor;
- usar array quando precisa de crescimento dinâmico;
- não testar primeiro, último e fora do limite.

### Próximo passo
Estudar arrays com tamanho definido pelo usuário.
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
git add labs/m1/aula-045-arrays-numeros docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 045: pratica arrays de numeros em Java"
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
1. O que é um array?
2. Para que serve um array de números?
3. Qual é o primeiro índice de um array?
4. Se um array tem length 5, qual é o último índice?
5. Qual a diferença entre `array.length` e `texto.length()`?
6. Por que o for normalmente usa `indice < array.length`?
7. O que significa ArrayIndexOutOfBoundsException?
8. Como somar todos os valores de um array?
9. Como calcular média decimal sem cair em divisão inteira?
10. Por que array não cresce automaticamente?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é array;
declarar array de int;
declarar array de long;
inicializar array com valores;
criar array com tamanho fixo;
explicar índice zero;
acessar primeiro elemento;
acessar último elemento;
usar array.length;
diferenciar length de array e length() de String;
alterar valor por índice;
preencher array por posição;
percorrer array com for;
usar indice < array.length;
somar valores de um array;
calcular média decimal;
encontrar maior valor;
encontrar menor valor;
contar valores pares;
ignorar valores inválidos com continue;
usar long[] para centavos;
aplicar array em pedidos;
aplicar array em estoque;
aplicar array em OS;
aplicar array em ocorrências;
aplicar array em mensageria;
aplicar array em auditoria;
aplicar array em SLA;
ler valores para array com Scanner;
validar valores ao preencher array;
identificar ArrayIndexOutOfBoundsException;
diagnosticar erros comuns;
debugar índice e valor;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar arrays com tamanho definido pelo usuário.

Não precisa ainda dominar arrays de String.

Não precisa ainda dominar matrizes.

Não precisa ainda dominar listas.

Não precisa ainda dominar objetos dentro de arrays.

Esses assuntos virão depois.

O objetivo é dominar arrays numéricos básicos, índice, `length`, iteração, soma e média.

---

## Fechamento da aula

Hoje aprendemos arrays de números.

A ideia central foi:

```text
guardar vários valores do mesmo tipo em uma única estrutura.
```

Vimos:

```text
declaração;
inicialização;
índice;
posição;
length;
tamanho fixo;
valores padrão;
acesso;
alteração;
iteração com for;
soma;
média;
maior;
menor;
contagem;
validação ao preencher;
erros de índice.
```

O ponto mais importante é:

```text
array começa no índice 0.
```

Se um array tem tamanho 5, os índices válidos são:

```text
0, 1, 2, 3, 4.
```

Por isso, o padrão de loop é:

```java
for (int indice = 0; indice < array.length; indice++) {
    // usa array[indice]
}
```

Na próxima aula, vamos estudar arrays com tamanho definido pelo usuário.

Isso permitirá perguntar quantos valores serão informados e criar o array com esse tamanho.
