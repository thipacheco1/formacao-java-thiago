# 047 — M1.27 — Alteração de Posições do Array

## Hoje a aula é sobre substituir valor sem mudar o tamanho

Array tem tamanho fixo.

Se você criou:

```java
int[] valores = new int[3];
```

ele terá 3 posições:

```text
0, 1, 2.
```

Esse tamanho não muda.

Mas o conteúdo de cada posição pode mudar.

Exemplo:

```java
valores[0] = 10;
valores[1] = 20;
valores[2] = 30;

valores[1] = 99;
```

O tamanho continua 3.

O que mudou foi o valor armazenado na posição 1.

Isso é muito importante:

```text
array tem tamanho fixo;
mas os elementos do array podem ser alterados.
```

---

## O que significa alterar uma posição

Alterar uma posição significa atribuir um novo valor a um índice específico.

Exemplo:

```java
int[] estoques = {10, 5, 0};

estoques[1] = 8;
```

Leitura:

```text
na posição 1 do array estoques, coloque o valor 8.
```

Antes:

```text
estoques[0] = 10
estoques[1] = 5
estoques[2] = 0
```

Depois:

```text
estoques[0] = 10
estoques[1] = 8
estoques[2] = 0
```

O valor antigo da posição 1 foi substituído.

---

## Vocabulário essencial

Termos desta aula:

```text
alteração;
posição;
índice;
substituição;
atribuição;
elemento;
valor antigo;
valor novo;
default value;
valor padrão;
índice válido;
índice inválido;
ArrayIndexOutOfBoundsException;
atualização incremental;
tamanho fixo;
conteúdo mutável;
posição informada pelo usuário;
índice técnico;
validação de índice.
```

Termos mais importantes:

```text
substituição -> trocar o valor de uma posição por outro;
índice válido -> posição existente dentro do array;
índice inválido -> posição fora do intervalo permitido;
default value -> valor padrão inicial de um array recém-criado;
conteúdo mutável -> os valores podem ser alterados mesmo com tamanho fixo.
```

---

## Tamanho fixo, conteúdo mutável

Esta frase precisa ficar gravada:

```text
o tamanho do array é fixo, mas os valores internos podem mudar.
```

Exemplo:

```java
int[] numeros = new int[3];

numeros[0] = 10;
numeros[1] = 20;
numeros[2] = 30;

numeros[1] = 200;
```

O array continua com 3 posições.

Não virou 4.

Não perdeu posição.

Apenas alterou um elemento.

Visual:

```text
antes:
[10] [20] [30]

depois:
[10] [200] [30]
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
        int[] numeros = {10, 20, 30};

        System.out.println("Antes da alteração:");
        System.out.println(numeros[0]);
        System.out.println(numeros[1]);
        System.out.println(numeros[2]);

        numeros[1] = 99;

        System.out.println("Depois da alteração:");
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
Antes da alteração:
10
20
30
Depois da alteração:
10
99
30
```

A posição alterada foi:

```java
numeros[1]
```

Lembre:

```text
índice 1 é a segunda posição.
```

---

## Alterando e exibindo com for

Podemos exibir com `for`.

Arquivo:

```text
AlteracaoComFor.java
```

Código:

```java
public class AlteracaoComFor {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        numeros[1] = 99;

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println("Índice " + indice + ": " + numeros[indice]);
        }
    }
}
```

Saída:

```text
Índice 0: 10
Índice 1: 99
Índice 2: 30
```

O `for` ajuda a conferir o estado completo do array depois da alteração.

---

## Valor antigo é perdido

Quando fazemos:

```java
numeros[1] = 99;
```

o valor antigo daquela posição é substituído.

Se antes era:

```java
numeros[1] = 20;
```

depois da alteração, o `20` não está mais naquela posição.

Se precisar guardar o valor antigo, salve antes:

```java
int valorAntigo = numeros[1];

numeros[1] = 99;

System.out.println("Valor antigo: " + valorAntigo);
System.out.println("Valor novo: " + numeros[1]);
```

Isso é útil para auditoria, log e comparação.

---

## Guardando valor antigo

Arquivo:

```text
ValorAntigoENovo.java
```

Código:

```java
public class ValorAntigoENovo {
    public static void main(String[] args) {
        int[] estoques = {10, 5, 8};

        int indiceAlterado = 1;
        int valorAntigo = estoques[indiceAlterado];

        estoques[indiceAlterado] = 12;

        System.out.println("Valor antigo: " + valorAntigo);
        System.out.println("Valor novo: " + estoques[indiceAlterado]);
    }
}
```

Saída:

```text
Valor antigo: 5
Valor novo: 12
```

Esse padrão é importante em sistemas reais.

Antes de alterar, muitas vezes precisamos saber:

```text
qual era o valor antigo?
qual ficou o valor novo?
quem alterou?
quando alterou?
por que alterou?
```

Aqui estamos no começo, mas a mentalidade já nasce.

---

## Default values

A grade desta aula cita:

```text
default values.
```

Default value significa valor padrão.

Quando criamos um array por tamanho, o Java preenche com valores padrão.

Exemplo:

```java
int[] numeros = new int[3];
```

Conteúdo inicial:

```text
numeros[0] = 0
numeros[1] = 0
numeros[2] = 0
```

Para `int`, o padrão é:

```text
0.
```

Para `long`:

```text
0.
```

Para `double`:

```text
0.0.
```

Para `boolean`:

```text
false.
```

Nesta aula, nosso foco segue em números.

---

## Exemplo de valores padrão

Arquivo:

```text
ValoresPadraoArray.java
```

Código:

```java
public class ValoresPadraoArray {
    public static void main(String[] args) {
        int[] numeros = new int[3];

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println("Índice " + indice + ": " + numeros[indice]);
        }
    }
}
```

Saída:

```text
Índice 0: 0
Índice 1: 0
Índice 2: 0
```

O array não está sem valor.

Ele está preenchido com o valor padrão do tipo.

---

## Alterando valor padrão

Arquivo:

```text
AlterandoValorPadrao.java
```

Código:

```java
public class AlterandoValorPadrao {
    public static void main(String[] args) {
        int[] numeros = new int[3];

        numeros[0] = 10;
        numeros[1] = 20;
        numeros[2] = 30;

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
```

Cada atribuição substituiu o valor padrão `0`.

---

## Cuidado com valor padrão confundindo regra

Imagine:

```java
int[] estoques = new int[5];
```

Todas as posições começam com:

```text
0.
```

Mas isso pode ter dois significados possíveis:

```text
produto realmente sem estoque;
produto ainda não preenchido.
```

O Java não sabe a diferença.

Para ele, é tudo `0`.

Quem precisa controlar isso é a regra do programa.

Por isso, em sistemas reais, é importante saber se o dado foi preenchido ou se ainda está no padrão.

Nesta fase, o alerta é suficiente.

---

## Atualização incremental

Nem sempre queremos substituir por um valor fixo.

Às vezes queremos atualizar com base no valor atual.

Exemplo:

```java
int[] estoques = {10, 5, 8};

estoques[0] = estoques[0] - 2;
```

Ou de forma abreviada:

```java
estoques[0] -= 2;
```

Antes:

```text
estoques[0] = 10
```

Depois:

```text
estoques[0] = 8
```

Isso é atualização incremental.

---

## Incrementando posição

Exemplo:

```java
int[] tentativas = {1, 2, 0};

tentativas[2]++;
```

Antes:

```text
tentativas[2] = 0
```

Depois:

```text
tentativas[2] = 1
```

Também podemos fazer:

```java
tentativas[2] = tentativas[2] + 1;
```

ou:

```java
tentativas[2] += 1;
```

Os três representam aumento de uma unidade.

---

## Exemplo: baixa de estoque

Arquivo:

```text
BaixaEstoqueArray.java
```

Código:

```java
public class BaixaEstoqueArray {
    public static void main(String[] args) {
        int[] estoques = {10, 5, 8};

        int indiceProduto = 0;
        int quantidadeBaixa = 3;

        estoques[indiceProduto] -= quantidadeBaixa;

        System.out.println("Estoque atualizado: " + estoques[indiceProduto]);
    }
}
```

Saída:

```text
Estoque atualizado: 7
```

Esse é um exemplo realista.

Alterar posição de array pode representar atualizar o estoque de um produto.

---

## Validação antes de baixar estoque

Baixar sem validar pode gerar estoque negativo.

Exemplo ruim:

```java
estoques[indiceProduto] -= quantidadeBaixa;
```

Se estoque era 2 e baixa é 5, fica:

```text
-3.
```

Podemos validar:

```java
if (quantidadeBaixa <= estoques[indiceProduto]) {
    estoques[indiceProduto] -= quantidadeBaixa;
} else {
    System.out.println("Estoque insuficiente");
}
```

Esse padrão combina:

```text
array;
índice;
if;
regra de negócio;
alteração segura.
```

---

## Baixa de estoque segura

Arquivo:

```text
BaixaEstoqueSegura.java
```

Código:

```java
public class BaixaEstoqueSegura {
    public static void main(String[] args) {
        int[] estoques = {10, 5, 8};

        int indiceProduto = 1;
        int quantidadeBaixa = 3;

        if (quantidadeBaixa <= 0) {
            System.out.println("Quantidade de baixa inválida");
        } else if (quantidadeBaixa > estoques[indiceProduto]) {
            System.out.println("Estoque insuficiente");
        } else {
            estoques[indiceProduto] -= quantidadeBaixa;
            System.out.println("Baixa realizada");
            System.out.println("Estoque atualizado: " + estoques[indiceProduto]);
        }
    }
}
```

Esse exemplo mostra alteração com proteção.

---

## Risco de índice inválido

A grade também cita:

```text
risco de índice inválido.
```

Se o array tem 3 posições:

```java
int[] numeros = {10, 20, 30};
```

índices válidos:

```text
0, 1, 2.
```

Esse acesso é inválido:

```java
numeros[3] = 99;
```

Erro:

```text
ArrayIndexOutOfBoundsException.
```

Esse erro significa:

```text
você tentou acessar uma posição que não existe.
```

---

## Validação de índice

Antes de alterar uma posição informada por variável, valide:

```java
if (indice >= 0 && indice < array.length) {
    array[indice] = novoValor;
} else {
    System.out.println("Índice inválido");
}
```

Exemplo:

```java
int[] numeros = {10, 20, 30};

int indice = 3;

if (indice >= 0 && indice < numeros.length) {
    numeros[indice] = 99;
} else {
    System.out.println("Índice inválido");
}
```

Saída:

```text
Índice inválido
```

A validação impediu o erro.

---

## Índice válido

Um índice é válido quando está dentro do intervalo:

```text
0 até array.length - 1.
```

Em Java:

```java
indice >= 0 && indice < array.length
```

Essa condição deve virar reflexo.

Sempre que o índice vier de fora, valide.

Origem externa pode ser:

```text
usuário;
arquivo;
API;
banco;
mensagem;
outro sistema;
cálculo;
posição escolhida em menu.
```

---

## Exemplo mínimo com validação de índice

Arquivo:

```text
ValidacaoIndice.java
```

Código:

```java
public class ValidacaoIndice {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        int indice = 3;
        int novoValor = 99;

        if (indice >= 0 && indice < numeros.length) {
            numeros[indice] = novoValor;
            System.out.println("Valor alterado");
        } else {
            System.out.println("Índice inválido");
        }
    }
}
```

Saída:

```text
Índice inválido
```

Troque:

```java
int indice = 3;
```

por:

```java
int indice = 2;
```

Agora o valor será alterado.

---

## Posição do usuário versus índice técnico

Usuário geralmente pensa em:

```text
posição 1;
posição 2;
posição 3.
```

Java usa:

```text
índice 0;
índice 1;
índice 2.
```

Se o usuário escolher a posição 2, o índice técnico é:

```java
int indice = posicaoUsuario - 1;
```

Exemplo:

```java
int posicaoUsuario = 2;
int indice = posicaoUsuario - 1;
```

Resultado:

```text
indice = 1.
```

Assim alteramos a segunda posição do array.

---

## Validando posição do usuário

Se o usuário informa posição começando em 1, valide assim:

```java
if (posicaoUsuario >= 1 && posicaoUsuario <= array.length) {
    int indice = posicaoUsuario - 1;
    array[indice] = novoValor;
} else {
    System.out.println("Posição inválida");
}
```

Repare:

```text
usuário: 1 até array.length;
Java: 0 até array.length - 1.
```

Essa tradução precisa ser feita com cuidado.

---

## Exemplo com Scanner: alterar posição

Arquivo:

```text
AlterarPosicaoConsole.java
```

Código:

```java
import java.util.Scanner;

public class AlterarPosicaoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] numeros = {10, 20, 30};

        System.out.println("Valores atuais:");
        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println("Posição " + (indice + 1) + ": " + numeros[indice]);
        }

        System.out.println("Qual posição deseja alterar?");
        int posicaoUsuario = scanner.nextInt();

        if (posicaoUsuario >= 1 && posicaoUsuario <= numeros.length) {
            int indice = posicaoUsuario - 1;

            System.out.println("Digite o novo valor:");
            int novoValor = scanner.nextInt();

            numeros[indice] = novoValor;

            System.out.println("Valor alterado com sucesso");
        } else {
            System.out.println("Posição inválida");
        }

        System.out.println("Valores finais:");
        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println("Posição " + (indice + 1) + ": " + numeros[indice]);
        }

        scanner.close();
    }
}
```

Esse exemplo é central.

Ele conecta:

```text
array;
índice técnico;
posição do usuário;
validação;
alteração.
```

---

## Exemplo: alterar valor com valor antigo

Arquivo:

```text
AlterarPosicaoComHistorico.java
```

Código:

```java
import java.util.Scanner;

public class AlterarPosicaoComHistorico {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] estoques = {10, 5, 8};

        System.out.println("Qual produto deseja alterar? 1 a " + estoques.length);
        int posicaoUsuario = scanner.nextInt();

        if (posicaoUsuario >= 1 && posicaoUsuario <= estoques.length) {
            int indice = posicaoUsuario - 1;

            int valorAntigo = estoques[indice];

            System.out.println("Digite o novo estoque:");
            int novoEstoque = scanner.nextInt();

            if (novoEstoque < 0) {
                System.out.println("Estoque não pode ser negativo");
            } else {
                estoques[indice] = novoEstoque;

                System.out.println("Estoque alterado");
                System.out.println("Valor antigo: " + valorAntigo);
                System.out.println("Valor novo: " + estoques[indice]);
            }
        } else {
            System.out.println("Produto inválido");
        }

        scanner.close();
    }
}
```

Esse exemplo já parece um mini fluxo de alteração.

Ele preserva:

```text
validação de posição;
valor antigo;
validação do novo valor;
alteração;
evidência do resultado.
```

---

## Exemplo aplicado: ajuste de estoque

Arquivo:

```text
AjusteEstoqueProduto.java
```

Código:

```java
import java.util.Scanner;

public class AjusteEstoqueProduto {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] estoques = {10, 5, 8, 0};

        System.out.println("Produtos disponíveis:");
        for (int indice = 0; indice < estoques.length; indice++) {
            System.out.println("Produto " + (indice + 1) + " - estoque: " + estoques[indice]);
        }

        System.out.println("Informe o produto para ajuste:");
        int produto = scanner.nextInt();

        if (produto < 1 || produto > estoques.length) {
            System.out.println("Produto inválido");
        } else {
            int indice = produto - 1;

            System.out.println("Informe o novo estoque:");
            int novoEstoque = scanner.nextInt();

            if (novoEstoque < 0) {
                System.out.println("Estoque não pode ser negativo");
            } else {
                int estoqueAntigo = estoques[indice];
                estoques[indice] = novoEstoque;

                System.out.println("Estoque ajustado");
                System.out.println("Antigo: " + estoqueAntigo);
                System.out.println("Novo: " + estoques[indice]);
            }
        }

        scanner.close();
    }
}
```

Esse cenário é comum:

```text
selecionar produto;
validar posição;
informar novo estoque;
validar valor;
alterar.
```

---

## Exemplo aplicado: corrigir valor de pedido

Arquivo:

```text
CorrigirValorPedido.java
```

Código:

```java
import java.util.Scanner;

public class CorrigirValorPedido {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long[] valoresPedidosCentavos = {1000L, 2500L, 5000L};

        System.out.println("Pedidos:");
        for (int indice = 0; indice < valoresPedidosCentavos.length; indice++) {
            System.out.println("Pedido " + (indice + 1) + ": " + valoresPedidosCentavos[indice]);
        }

        System.out.println("Qual pedido deseja corrigir?");
        int pedido = scanner.nextInt();

        if (pedido < 1 || pedido > valoresPedidosCentavos.length) {
            System.out.println("Pedido inválido");
        } else {
            int indice = pedido - 1;

            System.out.println("Digite o novo valor em centavos:");
            long novoValorCentavos = scanner.nextLong();

            if (novoValorCentavos <= 0) {
                System.out.println("Valor inválido");
            } else {
                long valorAntigo = valoresPedidosCentavos[indice];
                valoresPedidosCentavos[indice] = novoValorCentavos;

                System.out.println("Pedido corrigido");
                System.out.println("Valor antigo: " + valorAntigo);
                System.out.println("Valor novo: " + valoresPedidosCentavos[indice]);
            }
        }

        scanner.close();
    }
}
```

Aqui usamos `long[]` para valores monetários em centavos.

Regra:

```text
valor do pedido deve ser maior que zero.
```

---

## Exemplo aplicado: atualizar quantidade de atividades por OS

Arquivo:

```text
AtualizarAtividadesOs.java
```

Código:

```java
import java.util.Scanner;

public class AtualizarAtividadesOs {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] atividadesPorOs = {2, 4, 1};

        System.out.println("OS cadastradas:");
        for (int indice = 0; indice < atividadesPorOs.length; indice++) {
            System.out.println("OS " + (indice + 1) + ": " + atividadesPorOs[indice] + " atividade(s)");
        }

        System.out.println("Qual OS deseja atualizar?");
        int os = scanner.nextInt();

        if (os < 1 || os > atividadesPorOs.length) {
            System.out.println("OS inválida");
        } else {
            int indice = os - 1;

            System.out.println("Digite a nova quantidade de atividades:");
            int novaQuantidade = scanner.nextInt();

            if (novaQuantidade <= 0) {
                System.out.println("A OS deve ter ao menos uma atividade");
            } else {
                int quantidadeAntiga = atividadesPorOs[indice];
                atividadesPorOs[indice] = novaQuantidade;

                System.out.println("OS atualizada");
                System.out.println("Quantidade antiga: " + quantidadeAntiga);
                System.out.println("Quantidade nova: " + atividadesPorOs[indice]);
            }
        }

        scanner.close();
    }
}
```

Esse exemplo aplica alteração de posição ao domínio de OS.

---

## Exemplo aplicado: tentativas de mensageria

Arquivo:

```text
IncrementarTentativaMensagem.java
```

Código:

```java
import java.util.Scanner;

public class IncrementarTentativaMensagem {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] tentativasPorMensagem = {1, 2, 0};

        System.out.println("Qual mensagem recebeu nova tentativa?");
        int mensagem = scanner.nextInt();

        if (mensagem < 1 || mensagem > tentativasPorMensagem.length) {
            System.out.println("Mensagem inválida");
        } else {
            int indice = mensagem - 1;

            tentativasPorMensagem[indice]++;

            System.out.println("Tentativas atualizadas: " + tentativasPorMensagem[indice]);
        }

        scanner.close();
    }
}
```

Aqui não substituímos por um valor digitado.

Nós incrementamos a posição:

```java
tentativasPorMensagem[indice]++;
```

Esse padrão representa:

```text
registrar nova tentativa;
incrementar contador;
atualizar posição do array.
```

---

## Exemplo aplicado: auditoria de eventos por dia

Arquivo:

```text
RegistrarEventoAuditoriaArray.java
```

Código:

```java
import java.util.Scanner;

public class RegistrarEventoAuditoriaArray {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] eventosPorDia = {5, 8, 3, 0, 4};

        System.out.println("Informe o dia para registrar evento. 1 a " + eventosPorDia.length);
        int dia = scanner.nextInt();

        if (dia < 1 || dia > eventosPorDia.length) {
            System.out.println("Dia inválido");
        } else {
            int indice = dia - 1;

            int valorAntigo = eventosPorDia[indice];
            eventosPorDia[indice]++;

            System.out.println("Evento registrado");
            System.out.println("Eventos antes: " + valorAntigo);
            System.out.println("Eventos agora: " + eventosPorDia[indice]);
        }

        scanner.close();
    }
}
```

Aqui a alteração é incremento de contador.

Esse padrão é comum em métricas.

---

## Exemplo aplicado: ajuste de SLA

Arquivo:

```text
AjustarSlaHoras.java
```

Código:

```java
import java.util.Scanner;

public class AjustarSlaHoras {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double[] temposHoras = {2.5, 4.0, 1.5};

        System.out.println("Atendimentos:");
        for (int indice = 0; indice < temposHoras.length; indice++) {
            System.out.println("Atendimento " + (indice + 1) + ": " + temposHoras[indice] + " hora(s)");
        }

        System.out.println("Qual atendimento deseja ajustar?");
        int atendimento = scanner.nextInt();

        if (atendimento < 1 || atendimento > temposHoras.length) {
            System.out.println("Atendimento inválido");
        } else {
            int indice = atendimento - 1;

            System.out.println("Digite o novo tempo em horas:");
            double novoTempo = scanner.nextDouble();

            if (novoTempo < 0) {
                System.out.println("Tempo não pode ser negativo");
            } else {
                double tempoAntigo = temposHoras[indice];
                temposHoras[indice] = novoTempo;

                System.out.println("SLA ajustado");
                System.out.println("Tempo antigo: " + tempoAntigo);
                System.out.println("Tempo novo: " + temposHoras[indice]);
            }
        }

        scanner.close();
    }
}
```

Esse exemplo mostra alteração com `double[]`.

---

## Recalculando total depois de alteração

Depois de alterar um array, totais e médias anteriores podem ficar desatualizados.

Exemplo:

```java
int[] valores = {10, 20, 30};

int total = 60;

valores[1] = 100;
```

Agora o total correto não é mais 60.

O array virou:

```text
10 + 100 + 30 = 140.
```

Se o total foi calculado antes da alteração, precisa recalcular ou ajustar.

---

## Recalcular total

Arquivo:

```text
RecalcularTotalAposAlteracao.java
```

Código:

```java
public class RecalcularTotalAposAlteracao {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        valores[1] = 100;

        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        System.out.println("Total atualizado: " + total);
    }
}
```

Saída:

```text
Total atualizado: 140
```

Regra:

```text
se o array mudou, resultados derivados podem precisar ser recalculados.
```

---

## Ajustar total sem recalcular tudo

Às vezes podemos ajustar o total usando o valor antigo e o novo.

Exemplo:

```java
int[] valores = {10, 20, 30};

int total = 60;

int indice = 1;
int valorAntigo = valores[indice];
int valorNovo = 100;

valores[indice] = valorNovo;

total = total - valorAntigo + valorNovo;

System.out.println(total);
```

Resultado:

```text
140.
```

Esse padrão é útil, mas exige cuidado.

Para iniciantes, recalcular tudo costuma ser mais simples e seguro.

---

## Exemplo de ajuste de total com valor antigo

Arquivo:

```text
AjustarTotalComValorAntigo.java
```

Código:

```java
public class AjustarTotalComValorAntigo {
    public static void main(String[] args) {
        long[] valoresCentavos = {1000L, 2000L, 3000L};

        long totalCentavos = 0L;

        for (int indice = 0; indice < valoresCentavos.length; indice++) {
            totalCentavos += valoresCentavos[indice];
        }

        int indiceAlterado = 1;
        long valorAntigo = valoresCentavos[indiceAlterado];
        long valorNovo = 5000L;

        valoresCentavos[indiceAlterado] = valorNovo;

        totalCentavos = totalCentavos - valorAntigo + valorNovo;

        System.out.println("Total ajustado: " + totalCentavos);
    }
}
```

Esse exemplo mostra atualização incremental do total.

---

## Alterar várias posições com loop

Podemos alterar várias posições.

Exemplo: aplicar aumento de 10 em todos os valores.

Arquivo:

```text
AumentarTodosValores.java
```

Código:

```java
public class AumentarTodosValores {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        for (int indice = 0; indice < valores.length; indice++) {
            valores[indice] += 10;
        }

        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println(valores[indice]);
        }
    }
}
```

Saída:

```text
20
30
40
```

Aqui alteramos todas as posições.

---

## Zerar valores negativos

Arquivo:

```text
ZerarValoresNegativos.java
```

Código:

```java
public class ZerarValoresNegativos {
    public static void main(String[] args) {
        int[] valores = {10, -5, 20, -1, 30};

        for (int indice = 0; indice < valores.length; indice++) {
            if (valores[indice] < 0) {
                valores[indice] = 0;
            }
        }

        for (int indice = 0; indice < valores.length; indice++) {
            System.out.println(valores[indice]);
        }
    }
}
```

Saída:

```text
10
0
20
0
30
```

Esse padrão é útil para normalizar dados.

---

## Aplicar limite máximo

Exemplo: qualquer valor acima de 100 deve virar 100.

Arquivo:

```text
AplicarLimiteMaximo.java
```

Código:

```java
public class AplicarLimiteMaximo {
    public static void main(String[] args) {
        int[] pontuacoes = {80, 120, 95, 150};

        for (int indice = 0; indice < pontuacoes.length; indice++) {
            if (pontuacoes[indice] > 100) {
                pontuacoes[indice] = 100;
            }
        }

        for (int indice = 0; indice < pontuacoes.length; indice++) {
            System.out.println(pontuacoes[indice]);
        }
    }
}
```

Saída:

```text
80
100
95
100
```

Aqui alteramos apenas posições que violam uma regra.

---

## Substituir valores padrão não preenchidos

Imagine que `0` representa valor não preenchido em um cenário didático.

Arquivo:

```text
SubstituirZeros.java
```

Código:

```java
public class SubstituirZeros {
    public static void main(String[] args) {
        int[] quantidades = {3, 0, 5, 0};

        for (int indice = 0; indice < quantidades.length; indice++) {
            if (quantidades[indice] == 0) {
                quantidades[indice] = 1;
            }
        }

        for (int indice = 0; indice < quantidades.length; indice++) {
            System.out.println(quantidades[indice]);
        }
    }
}
```

Saída:

```text
3
1
5
1
```

Atenção:

```text
isso só faz sentido se a regra disser que zero deve virar um.
```

Não altere valor padrão sem regra clara.

---

## Cuidado: valor padrão pode ser valor legítimo

Em estoque:

```text
0 pode significar produto sem estoque.
```

Em eventos por dia:

```text
0 pode significar nenhum evento.
```

Em tentativas:

```text
0 pode significar ainda não tentou.
```

Em nota:

```text
0 pode ser nota válida, dependendo da regra.
```

Então, antes de substituir zeros, pergunte:

```text
zero é ausência de preenchimento ou é valor real do domínio?
```

Isso é raciocínio de backend.

---

## Erros comuns

### Erro 1 — Achar que alterar valor muda o tamanho do array

Errado conceitualmente:

```java
numeros[1] = 99;
```

não adiciona posição.

Apenas substitui valor.

---

### Erro 2 — Usar posição do usuário direto como índice

Se o usuário escolhe posição 1:

```java
array[1]
```

altera a segunda posição.

O correto, se a interface começa em 1, é:

```java
int indice = posicaoUsuario - 1;
```

---

### Erro 3 — Não validar índice

Errado:

```java
array[indice] = novoValor;
```

quando `indice` vem de fora.

Valide:

```java
indice >= 0 && indice < array.length
```

---

### Erro 4 — Não validar novo valor

Exemplo ruim:

```java
estoques[indice] = -10;
```

Se estoque não pode ser negativo, valide antes.

---

### Erro 5 — Perder valor antigo necessário

Se precisa auditar, salve antes:

```java
int valorAntigo = array[indice];
```

---

### Erro 6 — Recalcular errado após alteração

Se total ou média já foram calculados, eles podem ficar desatualizados depois da alteração.

Recalcule ou ajuste usando valor antigo e novo.

---

### Erro 7 — Confundir valor padrão com dado preenchido

`new int[5]` cria zeros.

Mas zero pode não significar que o usuário preencheu.

---

### Erro 8 — Usar `<= array.length`

Ao percorrer para alterar várias posições, use:

```java
indice < array.length
```

---

### Erro 9 — Alterar todas as posições quando queria alterar uma

Cuidado com alteração dentro de loop.

Exemplo:

```java
for (...) {
    array[indice] = novoValor;
}
```

Isso altera várias posições.

Se queria uma só, não use loop ou controle melhor.

---

### Erro 10 — Alterar uma posição e não exibir o resultado

Depois de alterar, sempre valide o resultado.

Use `println` ou debug.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-047-alteracao-posicoes-array
cd labs\m1\aula-047-alteracao-posicoes-array
```

Crie arquivos:

```text
Main.java
AlteracaoComFor.java
ValorAntigoENovo.java
ValoresPadraoArray.java
AlterandoValorPadrao.java
BaixaEstoqueArray.java
BaixaEstoqueSegura.java
ValidacaoIndice.java
AlterarPosicaoConsole.java
AlterarPosicaoComHistorico.java
AjusteEstoqueProduto.java
CorrigirValorPedido.java
AtualizarAtividadesOs.java
IncrementarTentativaMensagem.java
RegistrarEventoAuditoriaArray.java
AjustarSlaHoras.java
RecalcularTotalAposAlteracao.java
AjustarTotalComValorAntigo.java
AumentarTodosValores.java
ZerarValoresNegativos.java
AplicarLimiteMaximo.java
SubstituirZeros.java
ErroIndiceInvalido.java
ErroPosicaoUsuarioComoIndice.java
ErroTotalDesatualizado.java
```

Compile:

```powershell
javac Main.java
javac AlteracaoComFor.java
javac ValorAntigoENovo.java
javac ValoresPadraoArray.java
javac AlterandoValorPadrao.java
javac BaixaEstoqueArray.java
javac BaixaEstoqueSegura.java
javac ValidacaoIndice.java
javac AlterarPosicaoConsole.java
javac AlterarPosicaoComHistorico.java
javac AjusteEstoqueProduto.java
javac CorrigirValorPedido.java
javac AtualizarAtividadesOs.java
javac IncrementarTentativaMensagem.java
javac RegistrarEventoAuditoriaArray.java
javac AjustarSlaHoras.java
javac RecalcularTotalAposAlteracao.java
javac AjustarTotalComValorAntigo.java
javac AumentarTodosValores.java
javac ZerarValoresNegativos.java
javac AplicarLimiteMaximo.java
javac SubstituirZeros.java
javac ErroIndiceInvalido.java
javac ErroPosicaoUsuarioComoIndice.java
javac ErroTotalDesatualizado.java
```

Execute:

```powershell
java Main
java AlteracaoComFor
java ValorAntigoENovo
java ValoresPadraoArray
java AlterandoValorPadrao
java BaixaEstoqueArray
java BaixaEstoqueSegura
java ValidacaoIndice
java AlterarPosicaoConsole
java AlterarPosicaoComHistorico
java AjusteEstoqueProduto
java CorrigirValorPedido
java AtualizarAtividadesOs
java IncrementarTentativaMensagem
java RegistrarEventoAuditoriaArray
java AjustarSlaHoras
java RecalcularTotalAposAlteracao
java AjustarTotalComValorAntigo
java AumentarTodosValores
java ZerarValoresNegativos
java AplicarLimiteMaximo
java SubstituirZeros
java ErroIndiceInvalido
java ErroPosicaoUsuarioComoIndice
java ErroTotalDesatualizado
```

Alguns arquivos de erro proposital podem quebrar ou mostrar resultado errado.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroIndiceInvalido.java`

```java
public class ErroIndiceInvalido {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        numeros[3] = 99;
    }
}
```

Objetivo:

```text
entender risco de índice inválido ao alterar posição.
```

---

## Arquivo sugerido: `ErroPosicaoUsuarioComoIndice.java`

```java
public class ErroPosicaoUsuarioComoIndice {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30};

        int posicaoUsuario = 1;

        numeros[posicaoUsuario] = 99;

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println(numeros[indice]);
        }
    }
}
```

Depois corrija:

```java
int indice = posicaoUsuario - 1;
numeros[indice] = 99;
```

Objetivo:

```text
entender diferença entre posição do usuário e índice técnico.
```

---

## Arquivo sugerido: `ErroTotalDesatualizado.java`

```java
public class ErroTotalDesatualizado {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        int total = 60;

        valores[1] = 100;

        System.out.println("Total desatualizado: " + total);
    }
}
```

Depois corrija recalculando o total.

Objetivo:

```text
perceber que valores derivados precisam ser atualizados após alteração no array.
```

---

## Debug recomendado

Use debug neste trecho:

```java
int[] numeros = {10, 20, 30};

int indice = 1;
int valorAntigo = numeros[indice];

numeros[indice] = 99;
```

Observe:

```text
antes: numeros[1] = 20;
valorAntigo = 20;
depois: numeros[1] = 99.
```

Depois debugue este trecho:

```java
if (indice >= 0 && indice < numeros.length) {
    numeros[indice] = 99;
} else {
    System.out.println("Índice inválido");
}
```

Teste com:

```text
indice = -1;
indice = 0;
indice = 2;
indice = 3.
```

Veja quais passam e quais bloqueiam.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-047-alteracao-posicoes-array docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 047: pratica alteracao de posicoes do array"
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
explicar alteração de posição do array;
alterar valor por índice;
explicar que o tamanho do array não muda;
explicar que o conteúdo é mutável;
guardar valor antigo;
substituir por valor novo;
entender default values;
identificar valor padrão de int;
identificar valor padrão de long;
identificar valor padrão de double;
validar índice técnico;
converter posição do usuário para índice;
bloquear índice inválido;
explicar ArrayIndexOutOfBoundsException;
alterar posição com Scanner;
validar novo valor antes de alterar;
aplicar alteração em estoque;
aplicar alteração em pedido;
aplicar alteração em OS;
aplicar incremento em mensageria;
aplicar incremento em auditoria;
aplicar alteração em SLA;
recalcular total após alteração;
ajustar total com valor antigo e novo;
alterar várias posições com loop;
normalizar valores negativos;
aplicar limite máximo;
explicar risco de confundir zero padrão com zero real;
diagnosticar erros comuns;
debugar valor antes e depois;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar busca em array.

Não precisa ainda dominar remoção de elemento.

Não precisa ainda dominar inserção dinâmica.

Não precisa ainda dominar ArrayList.

Não precisa ainda dominar objetos em array.

Esses assuntos virão depois.

O objetivo é dominar substituição e atualização segura de valores em posições existentes do array.

---

## Fechamento da aula

Hoje aprendemos a alterar posições do array.

A ideia central foi:

```text
array tem tamanho fixo,
mas seus elementos podem ser substituídos.
```

Vimos:

```java
array[indice] = novoValor;
```

Também vimos que, quando o índice vem de fora, precisamos validar:

```java
indice >= 0 && indice < array.length
```

E quando o usuário informa posição começando em 1, precisamos converter:

```java
int indice = posicaoUsuario - 1;
```

Além disso, estudamos:

```text
valor antigo;
valor novo;
default values;
estoque;
pedido;
OS;
mensageria;
auditoria;
SLA;
recalculo de total;
alteração incremental;
risco de índice inválido.
```

O ponto mais importante da aula é:

```text
alterar dado exige cuidado com índice, regra e consequência.
```

Na próxima aula, vamos estudar busca em array.

Depois de saber guardar, percorrer e alterar, precisamos aprender a encontrar valores dentro do array.
