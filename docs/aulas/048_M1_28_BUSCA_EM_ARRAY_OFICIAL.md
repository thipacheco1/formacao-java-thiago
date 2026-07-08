# 048 — M1.28 — Busca em Array

## Hoje a aula é sobre procurar valor

Imagine que você tem vários códigos:

```java
int[] codigosProdutos = {101, 205, 330, 412};
```

E precisa responder:

```text
existe o código 330?
em qual posição ele está?
se encontrou, posso alterar?
se não encontrou, devo mostrar mensagem?
preciso parar ao encontrar ou continuar procurando?
```

Essas perguntas formam a base da busca em array.

Busca em array significa percorrer as posições até encontrar o valor desejado.

Exemplo em português:

```text
comece no índice 0;
compare o valor da posição com o valor procurado;
se for igual, marque que encontrou;
guarde a posição;
pare a busca se só precisa do primeiro resultado;
se terminar sem encontrar, informe que não existe.
```

Em Java, isso vira:

```java
for (int indice = 0; indice < array.length; indice++) {
    if (array[indice] == valorProcurado) {
        encontrou = true;
        posicaoEncontrada = indice;
        break;
    }
}
```

---

## O que é busca linear

A busca que vamos estudar hoje é chamada de busca linear.

Linear significa que olhamos os itens em sequência.

Exemplo:

```text
posição 0;
posição 1;
posição 2;
posição 3;
...
até encontrar ou terminar.
```

Código:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    if (numeros[indice] == valorProcurado) {
        encontrou = true;
        break;
    }
}
```

Essa busca é simples e fundamental.

Ela não exige que o array esteja ordenado.

Ela funciona olhando posição por posição.

---

## Por que busca em array existe

Buscar em array resolve perguntas como:

```text
o código existe?
o produto foi encontrado?
há pagamento com valor específico?
alguma OS possui determinada quantidade de atividades?
há ocorrência com determinado código?
alguma mensagem passou de certo número de tentativas?
qual posição devo alterar?
qual índice contém o valor procurado?
```

Sem busca, você até pode percorrer e imprimir.

Mas não consegue tomar decisão com base na existência de um valor.

Busca transforma array em estrutura consultável.

---

## Vocabulário essencial

Termos desta aula:

```text
busca;
busca linear;
valor procurado;
valor encontrado;
flag;
flag encontrou;
posição encontrada;
índice encontrado;
sentinela;
break;
primeira ocorrência;
última ocorrência;
não encontrado;
percorrer;
comparar;
critério de busca;
resultado da busca;
posição técnica;
posição do usuário.
```

Termos mais importantes:

```text
flag -> variável booleana que marca uma condição;
encontrou -> flag que indica se a busca teve sucesso;
posicaoEncontrada -> índice onde o valor foi encontrado;
break -> interrompe a busca quando não precisa continuar;
primeira ocorrência -> primeiro lugar onde o valor aparece;
não encontrado -> resultado quando a busca termina sem sucesso.
```

---

## Flag encontrou

Flag é uma variável booleana usada para marcar uma situação.

Exemplo:

```java
boolean encontrou = false;
```

Começa como `false` porque, antes de procurar, ainda não encontramos nada.

Quando achamos o valor:

```java
encontrou = true;
```

Depois do loop, usamos:

```java
if (encontrou) {
    System.out.println("Valor encontrado");
} else {
    System.out.println("Valor não encontrado");
}
```

Essa estrutura é muito comum.

---

## Posição encontrada

Além de saber se encontrou, muitas vezes precisamos saber onde encontrou.

Para isso, usamos uma variável de posição.

Exemplo:

```java
int posicaoEncontrada = -1;
```

Por que `-1`?

Porque índices válidos de array começam em 0.

Então `-1` é um bom valor para representar:

```text
nenhuma posição encontrada.
```

Quando encontrar:

```java
posicaoEncontrada = indice;
```

Depois do loop:

```java
if (posicaoEncontrada != -1) {
    System.out.println("Encontrado no índice " + posicaoEncontrada);
} else {
    System.out.println("Não encontrado");
}
```

---

## Por que usar -1 para posição não encontrada

Array tem índices válidos:

```text
0 até array.length - 1.
```

Então `-1` nunca será um índice válido.

Por isso, ele pode representar ausência.

Exemplo:

```java
int posicaoEncontrada = -1;
```

Leitura:

```text
ainda não encontrei posição nenhuma.
```

Se encontrar no índice 0:

```java
posicaoEncontrada = 0;
```

Isso precisa funcionar.

Por isso, não use `0` para representar “não encontrado”.

Se usar 0, você confunde:

```text
não encontrado
```

com:

```text
encontrado na primeira posição.
```

Esse erro é clássico.

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
        int[] numeros = {10, 20, 30, 40};

        int valorProcurado = 30;
        boolean encontrou = false;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                encontrou = true;
                break;
            }
        }

        if (encontrou) {
            System.out.println("Valor encontrado");
        } else {
            System.out.println("Valor não encontrado");
        }
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
Valor encontrado
```

Troque:

```java
int valorProcurado = 30;
```

por:

```java
int valorProcurado = 99;
```

Saída:

```text
Valor não encontrado
```

---

## Exemplo com posição encontrada

Arquivo:

```text
BuscaComPosicao.java
```

Código:

```java
public class BuscaComPosicao {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30, 40};

        int valorProcurado = 30;
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Valor encontrado no índice " + posicaoEncontrada);
        } else {
            System.out.println("Valor não encontrado");
        }
    }
}
```

Saída:

```text
Valor encontrado no índice 2
```

Lembre:

```text
índice 2 é a terceira posição.
```

Para o usuário, poderíamos mostrar:

```java
System.out.println("Valor encontrado na posição " + (posicaoEncontrada + 1));
```

---

## Índice técnico versus posição do usuário

Internamente, Java usa:

```text
índice 0, 1, 2...
```

Mas para o usuário, normalmente mostramos:

```text
posição 1, 2, 3...
```

Exemplo:

```java
int posicaoUsuario = posicaoEncontrada + 1;
```

Se:

```java
posicaoEncontrada = 2;
```

então:

```java
posicaoUsuario = 3.
```

Mensagem melhor para usuário:

```java
System.out.println("Valor encontrado na posição " + (posicaoEncontrada + 1));
```

Mensagem técnica para desenvolvedor:

```java
System.out.println("Índice encontrado: " + posicaoEncontrada);
```

As duas podem ser úteis, mas não são a mesma coisa.

---

## Por que usar break

Quando queremos encontrar apenas a primeira ocorrência, não precisamos continuar procurando depois que achamos.

Exemplo:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    if (numeros[indice] == valorProcurado) {
        encontrou = true;
        posicaoEncontrada = indice;
        break;
    }
}
```

O `break` interrompe o loop.

Vantagens:

```text
evita trabalho desnecessário;
deixa claro que a primeira ocorrência basta;
impede que a posição encontrada seja sobrescrita por outra ocorrência posterior.
```

Se o objetivo é encontrar apenas um item, `break` faz sentido.

---

## O que acontece sem break

Exemplo:

```java
int[] numeros = {10, 20, 30, 20, 40};

int valorProcurado = 20;
int posicaoEncontrada = -1;

for (int indice = 0; indice < numeros.length; indice++) {
    if (numeros[indice] == valorProcurado) {
        posicaoEncontrada = indice;
    }
}

System.out.println(posicaoEncontrada);
```

Saída:

```text
3
```

Por quê?

Porque encontrou 20 no índice 1, mas continuou procurando.

Depois encontrou 20 de novo no índice 3 e sobrescreveu a posição.

Sem `break`, esse código retorna a última ocorrência.

Com `break`, retornaria a primeira.

---

## Primeira ocorrência

Primeira ocorrência é o primeiro lugar onde o valor aparece.

Exemplo:

```java
int[] numeros = {10, 20, 30, 20, 40};
```

Valor procurado:

```text
20
```

Primeira ocorrência:

```text
índice 1.
```

Código:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    if (numeros[indice] == valorProcurado) {
        posicaoEncontrada = indice;
        break;
    }
}
```

O `break` garante que a busca pare no primeiro encontro.

---

## Última ocorrência

Última ocorrência é o último lugar onde o valor aparece.

No mesmo array:

```java
int[] numeros = {10, 20, 30, 20, 40};
```

Valor procurado:

```text
20
```

Última ocorrência:

```text
índice 3.
```

Código sem `break`:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    if (numeros[indice] == valorProcurado) {
        posicaoEncontrada = indice;
    }
}
```

Esse código deixa a posição encontrada sempre com o último índice que bateu.

Isso pode ser intencional.

Mas precisa ser consciente.

---

## Buscar primeira ou contar todos

Não confunda duas necessidades.

### Preciso saber se existe e onde está o primeiro

Use `break`.

```java
if (array[indice] == valorProcurado) {
    encontrou = true;
    posicaoEncontrada = indice;
    break;
}
```

### Preciso contar quantas vezes aparece

Não use `break`.

```java
if (array[indice] == valorProcurado) {
    quantidadeEncontrada++;
}
```

Se usar `break` ao contar, você vai contar apenas uma ocorrência.

Essa diferença é muito importante.

---

## Contando ocorrências

Arquivo:

```text
ContarOcorrencias.java
```

Código:

```java
public class ContarOcorrencias {
    public static void main(String[] args) {
        int[] codigos = {100, 200, 100, 300, 100};

        int codigoProcurado = 100;
        int quantidadeEncontrada = 0;

        for (int indice = 0; indice < codigos.length; indice++) {
            if (codigos[indice] == codigoProcurado) {
                quantidadeEncontrada++;
            }
        }

        System.out.println("Quantidade encontrada: " + quantidadeEncontrada);
    }
}
```

Saída:

```text
Quantidade encontrada: 3
```

Aqui não usamos `break`.

Porque queremos todas as ocorrências.

---

## Busca com Scanner

Arquivo:

```text
BuscaComScanner.java
```

Código:

```java
import java.util.Scanner;

public class BuscaComScanner {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] numeros = {10, 20, 30, 40, 50};

        System.out.println("Digite o valor que deseja buscar:");
        int valorProcurado = scanner.nextInt();

        int posicaoEncontrada = -1;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Valor encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Valor não encontrado");
        }

        scanner.close();
    }
}
```

Esse exemplo conecta busca com entrada do usuário.

---

## Busca depois de preencher array

Arquivo:

```text
PreencherEBuscarArray.java
```

Código:

```java
import java.util.Scanner;

public class PreencherEBuscarArray {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] numeros = new int[5];

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println("Digite o valor " + (indice + 1) + ":");
            numeros[indice] = scanner.nextInt();
        }

        System.out.println("Digite o valor que deseja buscar:");
        int valorProcurado = scanner.nextInt();

        int posicaoEncontrada = -1;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Não encontrado");
        }

        scanner.close();
    }
}
```

Aqui temos o fluxo completo:

```text
criar array;
preencher array;
ler valor procurado;
buscar;
exibir resultado.
```

---

## Busca e alteração

Depois de encontrar uma posição, podemos alterar o valor.

Exemplo:

```java
if (posicaoEncontrada != -1) {
    numeros[posicaoEncontrada] = novoValor;
}
```

Esse padrão conecta esta aula com a anterior.

Fluxo:

```text
buscar valor;
se encontrou, alterar a posição encontrada;
se não encontrou, informar.
```

Isso é muito comum.

---

## Exemplo: buscar e alterar

Arquivo:

```text
BuscarEAlterarValor.java
```

Código:

```java
import java.util.Scanner;

public class BuscarEAlterarValor {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] numeros = {10, 20, 30, 40};

        System.out.println("Digite o valor que deseja substituir:");
        int valorProcurado = scanner.nextInt();

        int posicaoEncontrada = -1;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Digite o novo valor:");
            int novoValor = scanner.nextInt();

            int valorAntigo = numeros[posicaoEncontrada];
            numeros[posicaoEncontrada] = novoValor;

            System.out.println("Valor alterado");
            System.out.println("Antigo: " + valorAntigo);
            System.out.println("Novo: " + numeros[posicaoEncontrada]);
        } else {
            System.out.println("Valor não encontrado");
        }

        scanner.close();
    }
}
```

Esse exemplo mostra uma atualização baseada em busca.

---

## Busca em array vazio

Um array vazio não tem elementos.

Exemplo:

```java
int[] numeros = {};
```

Buscar nele não dá erro se o loop estiver correto:

```java
for (int indice = 0; indice < numeros.length; indice++) {
    // não executa
}
```

Como `numeros.length` é 0, o loop não roda.

Resultado:

```java
encontrou
```

continua `false`, ou:

```java
posicaoEncontrada
```

continua `-1`.

Isso é correto.

O perigo é acessar:

```java
numeros[0]
```

sem verificar.

Na busca com loop correto, array vazio é tratado naturalmente.

---

## Busca em array de long

Para valores monetários em centavos, usamos `long[]`.

Arquivo:

```text
BuscaPagamentoCentavos.java
```

Código:

```java
public class BuscaPagamentoCentavos {
    public static void main(String[] args) {
        long[] pagamentosCentavos = {1000L, 2500L, 5000L, 7500L};

        long valorProcurado = 5000L;
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < pagamentosCentavos.length; indice++) {
            if (pagamentosCentavos[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Pagamento encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Pagamento não encontrado");
        }
    }
}
```

Mesmo padrão.

Só muda o tipo do array e do valor procurado.

---

## Busca em array de double

Com `double`, precisamos ter cuidado.

Exemplo simples:

```java
double[] notas = {8.5, 7.0, 10.0};

double notaProcurada = 7.0;
```

Código:

```java
if (notas[indice] == notaProcurada) {
    // encontrou
}
```

Para notas digitadas simples, isso pode funcionar.

Mas números decimais em computação podem ter detalhes de precisão.

Nesta fase, use `double` em exemplos didáticos como notas e horas.

Para dinheiro, continue usando `long` em centavos.

Mais tarde, estudaremos `BigDecimal`.

---

## Busca por condição

Nem toda busca é por igualdade exata.

Às vezes procuramos o primeiro valor que atende uma condição.

Exemplo:

```text
primeiro estoque zerado;
primeiro pagamento acima de 5000;
primeira mensagem com mais de 3 tentativas;
primeiro tempo de atendimento acima do SLA.
```

Código:

```java
for (int indice = 0; indice < estoques.length; indice++) {
    if (estoques[indice] == 0) {
        posicaoEncontrada = indice;
        break;
    }
}
```

Ou:

```java
if (temposHoras[indice] > limiteSlaHoras) {
    posicaoEncontrada = indice;
    break;
}
```

Busca não é apenas valor igual.

Busca é encontrar um elemento que satisfaça um critério.

---

## Exemplo: primeiro produto sem estoque

Arquivo:

```text
PrimeiroProdutoSemEstoque.java
```

Código:

```java
public class PrimeiroProdutoSemEstoque {
    public static void main(String[] args) {
        int[] estoques = {10, 5, 0, 8, 0};

        int posicaoEncontrada = -1;

        for (int indice = 0; indice < estoques.length; indice++) {
            if (estoques[indice] == 0) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Primeiro produto sem estoque na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Nenhum produto sem estoque");
        }
    }
}
```

Saída:

```text
Primeiro produto sem estoque na posição 3
```

O primeiro estoque zerado está no índice 2, posição do usuário 3.

---

## Exemplo: primeira mensagem com muitas tentativas

Arquivo:

```text
PrimeiraMensagemComMuitasTentativas.java
```

Código:

```java
public class PrimeiraMensagemComMuitasTentativas {
    public static void main(String[] args) {
        int[] tentativas = {1, 2, 4, 1, 5};

        int limiteTentativas = 3;
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < tentativas.length; indice++) {
            if (tentativas[indice] > limiteTentativas) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Primeira mensagem acima do limite na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Nenhuma mensagem acima do limite");
        }
    }
}
```

Esse exemplo é aplicado ao domínio de mensageria.

---

## Exemplo: primeiro atendimento fora do SLA

Arquivo:

```text
PrimeiroAtendimentoForaSla.java
```

Código:

```java
public class PrimeiroAtendimentoForaSla {
    public static void main(String[] args) {
        double[] temposHoras = {2.0, 3.5, 6.0, 1.5};

        double limiteSlaHoras = 4.0;
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < temposHoras.length; indice++) {
            if (temposHoras[indice] > limiteSlaHoras) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Atendimento fora do SLA na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Todos os atendimentos estão dentro do SLA");
        }
    }
}
```

Esse exemplo mostra busca por condição com `double[]`.

---

## Exemplo aplicado: buscar código de produto

Arquivo:

```text
BuscarCodigoProduto.java
```

Código:

```java
import java.util.Scanner;

public class BuscarCodigoProduto {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] codigosProdutos = {101, 205, 330, 412};

        System.out.println("Digite o código do produto:");
        int codigoProcurado = scanner.nextInt();

        int indiceProduto = -1;

        for (int indice = 0; indice < codigosProdutos.length; indice++) {
            if (codigosProdutos[indice] == codigoProcurado) {
                indiceProduto = indice;
                break;
            }
        }

        if (indiceProduto != -1) {
            System.out.println("Produto encontrado na posição " + (indiceProduto + 1));
        } else {
            System.out.println("Produto não encontrado");
        }

        scanner.close();
    }
}
```

Esse é um cenário clássico.

Temos códigos e queremos localizar um deles.

---

## Exemplo aplicado: buscar pedido por valor

Arquivo:

```text
BuscarPedidoPorValor.java
```

Código:

```java
import java.util.Scanner;

public class BuscarPedidoPorValor {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long[] valoresPedidosCentavos = {1000L, 2500L, 5000L, 7500L};

        System.out.println("Digite o valor do pedido em centavos:");
        long valorProcurado = scanner.nextLong();

        int indicePedido = -1;

        for (int indice = 0; indice < valoresPedidosCentavos.length; indice++) {
            if (valoresPedidosCentavos[indice] == valorProcurado) {
                indicePedido = indice;
                break;
            }
        }

        if (indicePedido != -1) {
            System.out.println("Pedido encontrado na posição " + (indicePedido + 1));
        } else {
            System.out.println("Pedido não encontrado");
        }

        scanner.close();
    }
}
```

Aqui usamos `long[]` para valores em centavos.

---

## Exemplo aplicado: buscar OS por quantidade de atividades

Arquivo:

```text
BuscarOsPorQuantidadeAtividades.java
```

Código:

```java
import java.util.Scanner;

public class BuscarOsPorQuantidadeAtividades {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] atividadesPorOs = {2, 4, 1, 3};

        System.out.println("Digite a quantidade de atividades procurada:");
        int quantidadeProcurada = scanner.nextInt();

        int indiceOs = -1;

        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            if (atividadesPorOs[indice] == quantidadeProcurada) {
                indiceOs = indice;
                break;
            }
        }

        if (indiceOs != -1) {
            System.out.println("Primeira OS encontrada na posição " + (indiceOs + 1));
        } else {
            System.out.println("Nenhuma OS encontrada com essa quantidade");
        }

        scanner.close();
    }
}
```

Esse exemplo reforça primeira ocorrência.

Pode haver mais de uma OS com a mesma quantidade, mas paramos na primeira.

---

## Exemplo aplicado: contar OS com quantidade de atividades

Se a necessidade for contar todas, não usamos `break`.

Arquivo:

```text
ContarOsPorQuantidadeAtividades.java
```

Código:

```java
import java.util.Scanner;

public class ContarOsPorQuantidadeAtividades {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] atividadesPorOs = {2, 4, 1, 3, 2};

        System.out.println("Digite a quantidade de atividades procurada:");
        int quantidadeProcurada = scanner.nextInt();

        int quantidadeEncontrada = 0;

        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            if (atividadesPorOs[indice] == quantidadeProcurada) {
                quantidadeEncontrada++;
            }
        }

        System.out.println("Quantidade de OS encontradas: " + quantidadeEncontrada);

        scanner.close();
    }
}
```

Esse exemplo ensina a diferença entre:

```text
buscar uma;
contar todas.
```

---

## Exemplo aplicado: buscar código de ocorrência

Arquivo:

```text
BuscarCodigoOcorrencia.java
```

Código:

```java
import java.util.Scanner;

public class BuscarCodigoOcorrencia {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] codigosOcorrencia = {100, 200, 300, 400};

        System.out.println("Digite o código de ocorrência:");
        int codigoProcurado = scanner.nextInt();

        boolean encontrou = false;

        for (int indice = 0; indice < codigosOcorrencia.length; indice++) {
            if (codigosOcorrencia[indice] == codigoProcurado) {
                encontrou = true;
                break;
            }
        }

        if (encontrou) {
            System.out.println("Código de ocorrência encontrado");
        } else {
            System.out.println("Código de ocorrência não encontrado");
        }

        scanner.close();
    }
}
```

Aqui não precisamos da posição.

Só queremos saber se existe.

Por isso, a flag basta.

---

## Flag versus posição

Você pode usar apenas flag quando só precisa saber se encontrou:

```java
boolean encontrou = false;
```

Você usa posição quando precisa saber onde encontrou:

```java
int posicaoEncontrada = -1;
```

Muitas vezes, a posição já substitui a flag.

Exemplo:

```java
if (posicaoEncontrada != -1) {
    // encontrou
}
```

Então, em alguns casos, não precisa usar os dois.

### Usando apenas posição

```java
int posicaoEncontrada = -1;

for (...) {
    if (...) {
        posicaoEncontrada = indice;
        break;
    }
}

if (posicaoEncontrada != -1) {
    System.out.println("Encontrou");
}
```

### Usando flag e posição

```java
boolean encontrou = false;
int posicaoEncontrada = -1;
```

Também funciona, mas pode ser redundante.

No começo, usar os dois pode ajudar a entender.

Com o tempo, você simplifica.

---

## Busca com array preenchido pelo usuário

Arquivo:

```text
BuscaEmArrayInformadoUsuario.java
```

Código:

```java
import java.util.Scanner;

public class BuscaEmArrayInformadoUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos códigos deseja informar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        int[] codigos = new int[quantidade];

        for (int indice = 0; indice < codigos.length; indice++) {
            System.out.println("Digite o código " + (indice + 1) + ":");
            codigos[indice] = scanner.nextInt();
        }

        System.out.println("Digite o código que deseja buscar:");
        int codigoProcurado = scanner.nextInt();

        int posicaoEncontrada = -1;

        for (int indice = 0; indice < codigos.length; indice++) {
            if (codigos[indice] == codigoProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        if (posicaoEncontrada != -1) {
            System.out.println("Código encontrado na posição " + (posicaoEncontrada + 1));
        } else {
            System.out.println("Código não encontrado");
        }

        scanner.close();
    }
}
```

Esse exemplo junta as últimas aulas:

```text
tamanho definido pelo usuário;
preenchimento;
busca;
posição encontrada;
break.
```

---

## Busca e atualização de estoque por código

Ainda não temos objetos nem arrays paralelos ideais, mas podemos simular.

Arquivo:

```text
BuscarProdutoEAjustarEstoque.java
```

Código:

```java
import java.util.Scanner;

public class BuscarProdutoEAjustarEstoque {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] codigosProdutos = {101, 205, 330};
        int[] estoques = {10, 5, 0};

        System.out.println("Digite o código do produto:");
        int codigoProcurado = scanner.nextInt();

        int indiceProduto = -1;

        for (int indice = 0; indice < codigosProdutos.length; indice++) {
            if (codigosProdutos[indice] == codigoProcurado) {
                indiceProduto = indice;
                break;
            }
        }

        if (indiceProduto == -1) {
            System.out.println("Produto não encontrado");
        } else {
            System.out.println("Produto encontrado");
            System.out.println("Estoque atual: " + estoques[indiceProduto]);

            System.out.println("Digite o novo estoque:");
            int novoEstoque = scanner.nextInt();

            if (novoEstoque < 0) {
                System.out.println("Estoque inválido");
            } else {
                int estoqueAntigo = estoques[indiceProduto];
                estoques[indiceProduto] = novoEstoque;

                System.out.println("Estoque alterado");
                System.out.println("Antigo: " + estoqueAntigo);
                System.out.println("Novo: " + estoques[indiceProduto]);
            }
        }

        scanner.close();
    }
}
```

Esse exemplo é muito importante.

Ele mostra como a posição encontrada em um array pode ser usada para acessar outro array relacionado.

Atenção:

```text
isso é didático.
```

No futuro, objetos serão melhores para representar produto com código e estoque juntos.

---

## Cuidado com arrays paralelos

No exemplo anterior:

```java
int[] codigosProdutos = {101, 205, 330};
int[] estoques = {10, 5, 0};
```

A posição 0 de cada array representa o mesmo produto.

```text
codigosProdutos[0] -> 101
estoques[0] -> 10
```

Isso funciona didaticamente, mas pode ser perigoso em sistemas maiores.

Se os arrays ficarem desalinhados, os dados ficam errados.

No futuro, criaremos classes e objetos:

```text
Produto
  código
  estoque
```

Por enquanto, o objetivo é aprender o papel da posição encontrada.

---

## Busca com mensagem detalhada

Mensagem ruim:

```text
Achou.
```

Mensagem melhor:

```text
Produto encontrado na posição 2.
```

Mensagem melhor ainda em contexto:

```text
Produto 205 encontrado na posição 2. Estoque atual: 5.
```

Em busca, sempre que possível, informe:

```text
o que foi procurado;
se foi encontrado;
onde foi encontrado;
qual ação será feita depois.
```

Isso ajuda no aprendizado e no diagnóstico.

---

## Break por performance simples

Em arrays pequenos, continuar depois de encontrar não muda quase nada.

Mas a lógica correta importa.

Imagine array com 100.000 posições.

Se o valor está na posição 2, com `break` você para cedo.

Sem `break`, você continua percorrendo tudo sem necessidade.

Exemplo:

```java
if (array[indice] == valorProcurado) {
    posicaoEncontrada = indice;
    break;
}
```

Esse `break` comunica:

```text
já encontrei o que precisava.
```

---

## Quando não usar break

Não use `break` quando precisa analisar todos os elementos.

Exemplos:

```text
contar quantas vezes aparece;
somar todos que atendem a condição;
listar todos os produtos sem estoque;
contar todas as mensagens com erro;
calcular total de pagamentos válidos;
validar se todos os itens estão corretos.
```

Exemplo:

```java
int produtosSemEstoque = 0;

for (int indice = 0; indice < estoques.length; indice++) {
    if (estoques[indice] == 0) {
        produtosSemEstoque++;
    }
}
```

Se usar `break`, vai contar só o primeiro.

---

## Busca por todos os inválidos

Arquivo:

```text
ListarProdutosSemEstoque.java
```

Código:

```java
public class ListarProdutosSemEstoque {
    public static void main(String[] args) {
        int[] estoques = {10, 0, 5, 0, 3};

        int produtosSemEstoque = 0;

        for (int indice = 0; indice < estoques.length; indice++) {
            if (estoques[indice] == 0) {
                System.out.println("Produto sem estoque na posição " + (indice + 1));
                produtosSemEstoque++;
            }
        }

        System.out.println("Total sem estoque: " + produtosSemEstoque);
    }
}
```

Aqui queremos todos.

Logo, sem `break`.

---

## Busca por qualquer inválido

Se a pergunta for apenas:

```text
existe algum produto sem estoque?
```

aí podemos usar `break`.

Arquivo:

```text
ExisteProdutoSemEstoque.java
```

Código:

```java
public class ExisteProdutoSemEstoque {
    public static void main(String[] args) {
        int[] estoques = {10, 0, 5, 0, 3};

        boolean existeSemEstoque = false;

        for (int indice = 0; indice < estoques.length; indice++) {
            if (estoques[indice] == 0) {
                existeSemEstoque = true;
                break;
            }
        }

        if (existeSemEstoque) {
            System.out.println("Existe produto sem estoque");
        } else {
            System.out.println("Todos os produtos possuem estoque");
        }
    }
}
```

A pergunta define o algoritmo.

---

## Erros comuns

### Erro 1 — Inicializar posição encontrada com 0

Errado:

```java
int posicaoEncontrada = 0;
```

Se não encontrar nada, parece que encontrou no índice 0.

Use:

```java
int posicaoEncontrada = -1;
```

---

### Erro 2 — Esquecer de mudar a flag

Errado:

```java
boolean encontrou = false;

for (...) {
    if (array[indice] == valorProcurado) {
        break;
    }
}
```

Depois do loop, `encontrou` continua `false`.

Certo:

```java
encontrou = true;
break;
```

---

### Erro 3 — Comparar índice com valor procurado

Errado:

```java
if (indice == valorProcurado)
```

Certo:

```java
if (array[indice] == valorProcurado)
```

A busca é no valor do array, não no índice.

---

### Erro 4 — Usar `<= array.length`

Errado:

```java
for (int indice = 0; indice <= array.length; indice++)
```

Certo:

```java
for (int indice = 0; indice < array.length; indice++)
```

---

### Erro 5 — Usar break quando queria contar todas as ocorrências

Se precisa contar todos, não use `break`.

---

### Erro 6 — Não usar break quando só queria a primeira ocorrência

Sem `break`, a posição pode virar a última ocorrência.

---

### Erro 7 — Não tratar valor não encontrado

Ruim:

```java
System.out.println(array[posicaoEncontrada]);
```

sem verificar se `posicaoEncontrada != -1`.

Se não encontrou, o índice é `-1`, que é inválido.

---

### Erro 8 — Usar posição do usuário como índice técnico

Se mostrar posição 1 ao usuário, internamente o índice é 0.

Converta quando necessário.

---

### Erro 9 — Buscar em array errado

Exemplo:

```java
if (estoques[indice] == codigoProcurado)
```

quando deveria buscar em:

```java
codigosProdutos[indice]
```

Em arrays paralelos, esse erro é comum.

---

### Erro 10 — Comparar double sem entender precisão

Para dinheiro, não use `double`.

Use `long` em centavos nesta fase.

Para notas e horas didáticas, `double` é aceitável, mas saiba que decimais têm detalhes.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-048-busca-array
cd labs\m1\aula-048-busca-array
```

Crie arquivos:

```text
Main.java
BuscaComPosicao.java
ContarOcorrencias.java
BuscaComScanner.java
PreencherEBuscarArray.java
BuscarEAlterarValor.java
BuscaPagamentoCentavos.java
PrimeiroProdutoSemEstoque.java
PrimeiraMensagemComMuitasTentativas.java
PrimeiroAtendimentoForaSla.java
BuscarCodigoProduto.java
BuscarPedidoPorValor.java
BuscarOsPorQuantidadeAtividades.java
ContarOsPorQuantidadeAtividades.java
BuscarCodigoOcorrencia.java
BuscaEmArrayInformadoUsuario.java
BuscarProdutoEAjustarEstoque.java
ListarProdutosSemEstoque.java
ExisteProdutoSemEstoque.java
ErroPosicaoInicialZero.java
ErroCompararIndice.java
ErroEsquecerFlag.java
ErroBreakAoContar.java
ErroAcessarPosicaoNaoEncontrada.java
```

Compile:

```powershell
javac Main.java
javac BuscaComPosicao.java
javac ContarOcorrencias.java
javac BuscaComScanner.java
javac PreencherEBuscarArray.java
javac BuscarEAlterarValor.java
javac BuscaPagamentoCentavos.java
javac PrimeiroProdutoSemEstoque.java
javac PrimeiraMensagemComMuitasTentativas.java
javac PrimeiroAtendimentoForaSla.java
javac BuscarCodigoProduto.java
javac BuscarPedidoPorValor.java
javac BuscarOsPorQuantidadeAtividades.java
javac ContarOsPorQuantidadeAtividades.java
javac BuscarCodigoOcorrencia.java
javac BuscaEmArrayInformadoUsuario.java
javac BuscarProdutoEAjustarEstoque.java
javac ListarProdutosSemEstoque.java
javac ExisteProdutoSemEstoque.java
javac ErroPosicaoInicialZero.java
javac ErroCompararIndice.java
javac ErroEsquecerFlag.java
javac ErroBreakAoContar.java
javac ErroAcessarPosicaoNaoEncontrada.java
```

Execute:

```powershell
java Main
java BuscaComPosicao
java ContarOcorrencias
java BuscaComScanner
java PreencherEBuscarArray
java BuscarEAlterarValor
java BuscaPagamentoCentavos
java PrimeiroProdutoSemEstoque
java PrimeiraMensagemComMuitasTentativas
java PrimeiroAtendimentoForaSla
java BuscarCodigoProduto
java BuscarPedidoPorValor
java BuscarOsPorQuantidadeAtividades
java ContarOsPorQuantidadeAtividades
java BuscarCodigoOcorrencia
java BuscaEmArrayInformadoUsuario
java BuscarProdutoEAjustarEstoque
java ListarProdutosSemEstoque
java ExisteProdutoSemEstoque
java ErroPosicaoInicialZero
java ErroCompararIndice
java ErroEsquecerFlag
java ErroBreakAoContar
java ErroAcessarPosicaoNaoEncontrada
```

Alguns arquivos de erro proposital podem gerar resultado errado ou exceção.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroPosicaoInicialZero.java`

```java
public class ErroPosicaoInicialZero {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        int valorProcurado = 99;
        int posicaoEncontrada = 0;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        System.out.println("Posição encontrada: " + posicaoEncontrada);
    }
}
```

Objetivo:

```text
entender por que posição não encontrada deve começar com -1.
```

---

## Arquivo sugerido: `ErroCompararIndice.java`

```java
public class ErroCompararIndice {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        int valorProcurado = 20;
        boolean encontrou = false;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (indice == valorProcurado) {
                encontrou = true;
                break;
            }
        }

        System.out.println("Encontrou: " + encontrou);
    }
}
```

Depois corrija:

```java
if (numeros[indice] == valorProcurado)
```

Objetivo:

```text
entender diferença entre índice e valor armazenado.
```

---

## Arquivo sugerido: `ErroAcessarPosicaoNaoEncontrada.java`

```java
public class ErroAcessarPosicaoNaoEncontrada {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        int valorProcurado = 99;
        int posicaoEncontrada = -1;

        for (int indice = 0; indice < numeros.length; indice++) {
            if (numeros[indice] == valorProcurado) {
                posicaoEncontrada = indice;
                break;
            }
        }

        System.out.println(numeros[posicaoEncontrada]);
    }
}
```

Depois corrija verificando:

```java
posicaoEncontrada != -1
```

Objetivo:

```text
entender que resultado não encontrado precisa ser tratado antes de acessar o array.
```

---

## Debug recomendado

Use debug neste trecho:

```java
int[] numeros = {10, 20, 30, 40};

int valorProcurado = 30;
int posicaoEncontrada = -1;

for (int indice = 0; indice < numeros.length; indice++) {
    if (numeros[indice] == valorProcurado) {
        posicaoEncontrada = indice;
        break;
    }
}
```

Coloque breakpoint no `if`.

Observe:

```text
indice = 0, numeros[indice] = 10;
indice = 1, numeros[indice] = 20;
indice = 2, numeros[indice] = 30;
condição true;
posicaoEncontrada = 2;
break encerra o loop.
```

Depois teste com:

```java
int valorProcurado = 99;
```

Observe:

```text
o loop percorre tudo;
posicaoEncontrada continua -1.
```

Esse debug fixa a aula.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-048-busca-array docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 048: pratica busca em array"
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
explicar busca em array;
explicar busca linear;
criar busca com for;
usar valor procurado;
usar flag encontrou;
inicializar encontrou como false;
mudar encontrou para true ao achar;
usar posição encontrada;
inicializar posição com -1;
guardar índice encontrado;
usar break para primeira ocorrência;
explicar primeira ocorrência;
explicar última ocorrência;
contar todas as ocorrências sem break;
buscar valor informado pelo usuário;
buscar depois de preencher array;
buscar e alterar valor encontrado;
buscar em int[];
buscar em long[];
buscar por condição;
aplicar busca em produto;
aplicar busca em pedido;
aplicar busca em pagamento;
aplicar busca em OS;
aplicar busca em ocorrência;
aplicar busca em mensageria;
aplicar busca em estoque;
aplicar busca em SLA;
diferenciar flag e posição;
tratar não encontrado;
evitar acesso com índice -1;
diagnosticar erros comuns;
debugar a busca passo a passo;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar busca binária.

Não precisa ainda dominar ordenação.

Não precisa ainda dominar listas.

Não precisa ainda dominar objetos.

Não precisa ainda dominar banco de dados.

Esses assuntos virão depois.

O objetivo é dominar busca linear em arrays e entender flag, posição encontrada e `break`.

---

## Fechamento da aula

Hoje aprendemos busca em array.

A ideia central foi:

```text
percorrer o array;
comparar cada elemento com o valor procurado;
marcar quando encontrou;
guardar a posição quando necessário;
parar com break se a primeira ocorrência basta;
tratar o caso não encontrado.
```

O padrão principal foi:

```java
int posicaoEncontrada = -1;

for (int indice = 0; indice < array.length; indice++) {
    if (array[indice] == valorProcurado) {
        posicaoEncontrada = indice;
        break;
    }
}
```

Também vimos que `break` depende da intenção.

Se quero a primeira ocorrência, uso `break`.

Se quero contar todas, não uso.

O ponto mais importante é:

```text
não encontrado precisa ser tratado.
```

Se a posição continua `-1`, não podemos acessar:

```java
array[-1]
```

Na próxima aula, vamos estudar maior, menor, soma e média em array.

Essas operações consolidam o raciocínio de percorrer array acumulando, comparando e produzindo resultado.
