# 043 — M1.23 — Laços Aninhados

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.23.01` — Laços aninhados — Conceito, por que existe e vocabulário essencial.
- `M1.23.02` — Laços aninhados — Exemplo mínimo digitado do zero.
- `M1.23.03` — Laços aninhados — Exemplo aplicado ao domínio corporativo.
- `M1.23.04` — Laços aninhados — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar laços dentro de laços, leitura de fluxo com linha e coluna, matriz conceitual, menus com subfluxos, processamento de entidades relacionadas, uso cuidadoso de `break` e `continue` em loops internos, riscos de complexidade e estratégias de simplificação.

---

## Onde estamos na formação

Estamos no Módulo 1, fechando uma parte muito importante do bloco de repetição.

A sequência recente foi:

```text
039 — M1.19 — While;
040 — M1.20 — Do while;
041 — M1.21 — For clássico;
042 — M1.22 — Break e continue;
043 — M1.23 — Laços aninhados.
```

Até aqui, já sabemos repetir com:

```java
while (condicao) {
    // repetição baseada em condição
}
```

```java
do {
    // executa pelo menos uma vez
} while (condicao);
```

```java
for (int contador = 1; contador <= 5; contador++) {
    // repetição controlada por contador
}
```

Também aprendemos:

```java
break;
```

para parar uma repetição, e:

```java
continue;
```

para pular a iteração atual.

Agora vamos colocar uma repetição dentro de outra.

Exemplo:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

Isso é um laço aninhado.

---

## Hoje a aula é sobre repetição dentro de repetição

Laço aninhado é quando um loop fica dentro de outro loop.

Exemplo visual:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

O loop de fora controla:

```text
linha.
```

O loop de dentro controla:

```text
coluna.
```

A leitura é:

```text
para cada linha,
percorra todas as colunas.
```

Esse padrão aparece muito quando lidamos com estruturas em dois níveis.

Exemplos:

```text
linhas e colunas;
clientes e pedidos;
pedidos e itens;
OS e atividades;
lotes e registros;
páginas e itens da página;
menus e submenus;
dias e horários;
categorias e produtos;
mensagens e tentativas;
tabelas conceituais;
matrizes conceituais.
```

---

## O que é laço aninhado

Laço aninhado é um laço dentro de outro.

Pode ser:

```java
for dentro de for;
```

```java
while dentro de while;
```

```java
for dentro de while;
```

```java
while dentro de do while;
```

ou outras combinações.

O mais comum nesta fase será:

```java
for dentro de for.
```

Exemplo:

```java
for (int cliente = 1; cliente <= 3; cliente++) {
    for (int pedido = 1; pedido <= 2; pedido++) {
        System.out.println("Cliente " + cliente + ", pedido " + pedido);
    }
}
```

Leitura:

```text
para cada cliente,
percorra os pedidos desse cliente.
```

---

## Vocabulário essencial

Termos desta aula:

```text
laço aninhado;
loop externo;
loop interno;
iteração externa;
iteração interna;
linha;
coluna;
matriz conceitual;
combinação;
subfluxo;
menu principal;
submenu;
complexidade;
multiplicação de iterações;
break no loop interno;
continue no loop interno;
fluxo principal;
indentação.
```

Termos mais importantes:

```text
loop externo -> o loop de fora;
loop interno -> o loop de dentro;
iteração externa -> cada volta do loop de fora;
iteração interna -> cada volta do loop de dentro;
matriz conceitual -> organização mental em linhas e colunas;
complexidade -> quantidade de caminhos e repetições que o código cria.
```

---

## Loop externo e loop interno

Veja:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 2; coluna++) {
        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

O loop externo é:

```java
for (int linha = 1; linha <= 3; linha++)
```

O loop interno é:

```java
for (int coluna = 1; coluna <= 2; coluna++)
```

Para cada valor de `linha`, o loop de `coluna` roda inteiro.

Fluxo:

```text
linha 1 -> coluna 1, coluna 2;
linha 2 -> coluna 1, coluna 2;
linha 3 -> coluna 1, coluna 2.
```

Total:

```text
3 linhas × 2 colunas = 6 execuções internas.
```

---

## A multiplicação das iterações

Este ponto é fundamental.

Se o loop externo roda 3 vezes e o interno roda 4 vezes, o bloco interno roda:

```text
3 × 4 = 12 vezes.
```

Exemplo:

```java
for (int externo = 1; externo <= 3; externo++) {
    for (int interno = 1; interno <= 4; interno++) {
        System.out.println("Executando");
    }
}
```

A palavra:

```text
Executando
```

aparece 12 vezes.

Laços aninhados multiplicam trabalho.

Isso é útil, mas pode ficar pesado se os números crescerem.

Exemplo:

```text
1000 × 1000 = 1.000.000 execuções.
```

Por isso, cuidado com complexidade.

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
        for (int linha = 1; linha <= 3; linha++) {
            for (int coluna = 1; coluna <= 3; coluna++) {
                System.out.println("Linha " + linha + ", coluna " + coluna);
            }
        }

        System.out.println("Fim do programa");
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
Linha 1, coluna 1
Linha 1, coluna 2
Linha 1, coluna 3
Linha 2, coluna 1
Linha 2, coluna 2
Linha 2, coluna 3
Linha 3, coluna 1
Linha 3, coluna 2
Linha 3, coluna 3
Fim do programa
```

Esse é o exemplo base.

Ele mostra claramente o fluxo.

---

## Como ler o fluxo

Leia o código assim:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

Em português:

```text
comece na linha 1;
para a linha 1, percorra colunas 1, 2 e 3;
avance para a linha 2;
para a linha 2, percorra colunas 1, 2 e 3;
avance para a linha 3;
para a linha 3, percorra colunas 1, 2 e 3;
encerre.
```

O loop interno reinicia a cada nova iteração do loop externo.

Esse detalhe é crucial.

---

## O loop interno reinicia

Exemplo:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 2; coluna++) {
        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

Quando `linha` é 1:

```text
coluna começa em 1 e vai até 2.
```

Quando `linha` vira 2:

```text
coluna começa de novo em 1 e vai até 2.
```

Quando `linha` vira 3:

```text
coluna começa de novo em 1 e vai até 2.
```

A inicialização do loop interno acontece de novo para cada volta do externo.

---

## Matriz conceitual

Ainda não estamos estudando arrays nem matrizes reais.

Mas podemos pensar em uma matriz conceitual.

Exemplo:

```text
        coluna 1   coluna 2   coluna 3
linha 1    X          X          X
linha 2    X          X          X
linha 3    X          X          X
```

Cada `X` representa uma combinação:

```text
linha, coluna.
```

O laço aninhado percorre esses pontos.

Código:

```java
for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        System.out.println("[" + linha + "," + coluna + "]");
    }
}
```

Isso prepara a cabeça para matrizes reais, que virão depois.

---

## Desenhando uma grade

Arquivo:

```text
GradeConceitual.java
```

Código:

```java
public class GradeConceitual {
    public static void main(String[] args) {
        for (int linha = 1; linha <= 3; linha++) {
            for (int coluna = 1; coluna <= 4; coluna++) {
                System.out.print("[X]");
            }

            System.out.println();
        }
    }
}
```

Saída:

```text
[X][X][X][X]
[X][X][X][X]
[X][X][X][X]
```

Aqui usamos:

```java
System.out.print()
```

para imprimir na mesma linha.

E:

```java
System.out.println()
```

para quebrar a linha no final de cada linha externa.

---

## print versus println

`System.out.print()` imprime sem quebrar linha.

Exemplo:

```java
System.out.print("[X]");
System.out.print("[X]");
```

Saída:

```text
[X][X]
```

`System.out.println()` imprime e quebra linha.

Exemplo:

```java
System.out.println("[X]");
System.out.println("[X]");
```

Saída:

```text
[X]
[X]
```

Em laços aninhados, usamos muito:

```java
print
```

no loop interno, e:

```java
println
```

depois do loop interno.

---

## Tabuada com laço aninhado

Arquivo:

```text
TabuadaAninhada.java
```

Código:

```java
public class TabuadaAninhada {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 3; numero++) {
            System.out.println("Tabuada do " + numero);

            for (int multiplicador = 1; multiplicador <= 10; multiplicador++) {
                int resultado = numero * multiplicador;
                System.out.println(numero + " x " + multiplicador + " = " + resultado);
            }

            System.out.println();
        }
    }
}
```

Aqui:

```text
loop externo -> número da tabuada;
loop interno -> multiplicador.
```

Para cada número, percorremos os multiplicadores de 1 a 10.

---

## Combinações entre categorias e produtos

Arquivo:

```text
CategoriasProdutos.java
```

Código:

```java
public class CategoriasProdutos {
    public static void main(String[] args) {
        for (int categoria = 1; categoria <= 3; categoria++) {
            System.out.println("Categoria " + categoria);

            for (int produto = 1; produto <= 4; produto++) {
                System.out.println("  Produto " + produto + " da categoria " + categoria);
            }
        }
    }
}
```

Saída conceitual:

```text
Categoria 1
  Produto 1 da categoria 1
  Produto 2 da categoria 1
  Produto 3 da categoria 1
  Produto 4 da categoria 1
Categoria 2
  Produto 1 da categoria 2
...
```

Esse padrão aparece em cadastros hierárquicos.

---

## Exemplo aplicado: clientes e pedidos

Arquivo:

```text
ClientesPedidos.java
```

Código:

```java
public class ClientesPedidos {
    public static void main(String[] args) {
        for (int cliente = 1; cliente <= 3; cliente++) {
            System.out.println("Cliente " + cliente);

            for (int pedido = 1; pedido <= 2; pedido++) {
                System.out.println("  Pedido " + pedido + " do cliente " + cliente);
            }
        }
    }
}
```

Leitura:

```text
para cada cliente,
liste seus pedidos.
```

Mesmo sem arrays ou banco de dados, o padrão mental é real.

Em backend, isso poderia representar:

```text
buscar clientes;
para cada cliente, buscar pedidos;
para cada pedido, processar.
```

Mais tarde, vamos discutir por que isso pode ser perigoso no banco se feito sem critério.

Por enquanto, foque no fluxo.

---

## Exemplo aplicado: pedido e itens

Arquivo:

```text
PedidosItens.java
```

Código:

```java
public class PedidosItens {
    public static void main(String[] args) {
        for (int pedido = 1; pedido <= 3; pedido++) {
            long totalPedidoCentavos = 0L;

            System.out.println("Pedido " + pedido);

            for (int item = 1; item <= 4; item++) {
                long valorItemCentavos = 1000L * item;
                totalPedidoCentavos += valorItemCentavos;

                System.out.println("  Item " + item + ": " + valorItemCentavos);
            }

            System.out.println("Total do pedido " + pedido + ": " + totalPedidoCentavos);
        }
    }
}
```

Aqui o acumulador:

```java
totalPedidoCentavos
```

é reiniciado para cada pedido.

Isso é importante.

Cada pedido tem seu próprio total.

---

## Cuidado: acumulador no lugar errado

Compare.

### Correto

```java
for (int pedido = 1; pedido <= 3; pedido++) {
    long totalPedidoCentavos = 0L;

    for (int item = 1; item <= 4; item++) {
        totalPedidoCentavos += 1000L;
    }

    System.out.println(totalPedidoCentavos);
}
```

O total reinicia para cada pedido.

### Errado conceitualmente

```java
long totalPedidoCentavos = 0L;

for (int pedido = 1; pedido <= 3; pedido++) {
    for (int item = 1; item <= 4; item++) {
        totalPedidoCentavos += 1000L;
    }

    System.out.println(totalPedidoCentavos);
}
```

Agora o total acumula entre pedidos.

Pode ser certo se a intenção for total geral.

Mas se a intenção for total por pedido, está errado.

Pergunte sempre:

```text
o acumulador pertence ao loop externo ou ao processamento inteiro?
```

---

## Total por pedido e total geral

Arquivo:

```text
TotalPedidoETotalGeral.java
```

Código:

```java
public class TotalPedidoETotalGeral {
    public static void main(String[] args) {
        long totalGeralCentavos = 0L;

        for (int pedido = 1; pedido <= 3; pedido++) {
            long totalPedidoCentavos = 0L;

            for (int item = 1; item <= 4; item++) {
                long valorItemCentavos = 1000L * item;

                totalPedidoCentavos += valorItemCentavos;
                totalGeralCentavos += valorItemCentavos;
            }

            System.out.println("Total do pedido " + pedido + ": " + totalPedidoCentavos);
        }

        System.out.println("Total geral: " + totalGeralCentavos);
    }
}
```

Aqui temos dois acumuladores:

```text
totalPedidoCentavos -> reinicia a cada pedido;
totalGeralCentavos -> acumula tudo.
```

Isso é muito comum em relatórios.

---

## Exemplo aplicado: OS e atividades

Arquivo:

```text
OrdensServicoAtividades.java
```

Código:

```java
public class OrdensServicoAtividades {
    public static void main(String[] args) {
        for (int ordemServico = 1; ordemServico <= 3; ordemServico++) {
            System.out.println("OS " + ordemServico);

            for (int atividade = 1; atividade <= 2; atividade++) {
                System.out.println("  Atividade " + atividade + " da OS " + ordemServico);
            }
        }
    }
}
```

Leitura:

```text
para cada OS,
liste suas atividades.
```

Esse padrão é muito comum em sistemas de atendimento, logística, assistência técnica e operações.

---

## Exemplo aplicado: OS, atividades e checklist conceitual

Arquivo:

```text
OrdensAtividadesChecklist.java
```

Código:

```java
public class OrdensAtividadesChecklist {
    public static void main(String[] args) {
        for (int ordemServico = 1; ordemServico <= 2; ordemServico++) {
            System.out.println("OS " + ordemServico);

            for (int atividade = 1; atividade <= 2; atividade++) {
                System.out.println("  Atividade " + atividade);

                for (int pergunta = 1; pergunta <= 3; pergunta++) {
                    System.out.println("    Pergunta " + pergunta + " do checklist");
                }
            }
        }
    }
}
```

Aqui temos três níveis.

Isso funciona, mas já começa a ficar mais complexo.

Leitura:

```text
para cada OS;
para cada atividade da OS;
para cada pergunta do checklist.
```

Três níveis exigem cuidado.

---

## Cuidado com muitos níveis

Laços aninhados demais deixam o código difícil.

Exemplo:

```java
for (...) {
    for (...) {
        for (...) {
            for (...) {
                // regra
            }
        }
    }
}
```

Isso pode ficar pesado para ler e para executar.

Sinais de alerta:

```text
muita indentação;
muitos contadores;
dificuldade de nomear variáveis;
muitos ifs dentro dos loops;
break e continue confundindo;
acumuladores em vários níveis;
regra principal escondida.
```

Quando isso acontece, mais tarde aprenderemos a extrair métodos e organizar responsabilidades.

Nesta fase, reconheça o problema.

---

## Exemplo aplicado: páginas e itens

Arquivo:

```text
PaginasItens.java
```

Código:

```java
public class PaginasItens {
    public static void main(String[] args) {
        int totalPaginas = 3;
        int itensPorPagina = 4;

        for (int pagina = 1; pagina <= totalPaginas; pagina++) {
            System.out.println("Página " + pagina);

            for (int item = 1; item <= itensPorPagina; item++) {
                System.out.println("  Item " + item + " da página " + pagina);
            }
        }
    }
}
```

Esse padrão representa uma API paginada:

```text
para cada página,
processar cada item da página.
```

Em backend, isso é muito comum.

---

## Exemplo aplicado: mensageria e tentativas

Arquivo:

```text
MensagensTentativas.java
```

Código:

```java
public class MensagensTentativas {
    public static void main(String[] args) {
        int totalMensagens = 3;
        int limiteTentativas = 2;

        for (int mensagem = 1; mensagem <= totalMensagens; mensagem++) {
            System.out.println("Mensagem " + mensagem);

            for (int tentativa = 1; tentativa <= limiteTentativas; tentativa++) {
                System.out.println("  Tentativa " + tentativa + " de envio");
            }
        }
    }
}
```

Leitura:

```text
para cada mensagem,
realize até duas tentativas.
```

Esse é um padrão real em integração.

Claro que, em sistema real, a tentativa pararia em caso de sucesso.

Vamos simular isso mais abaixo.

---

## Break no loop interno

Arquivo:

```text
BreakLoopInterno.java
```

Código:

```java
public class BreakLoopInterno {
    public static void main(String[] args) {
        for (int mensagem = 1; mensagem <= 3; mensagem++) {
            System.out.println("Mensagem " + mensagem);

            for (int tentativa = 1; tentativa <= 3; tentativa++) {
                System.out.println("  Tentativa " + tentativa);

                boolean envioComSucesso = tentativa == 2;

                if (envioComSucesso) {
                    System.out.println("  Envio realizado com sucesso");
                    break;
                }
            }
        }
    }
}
```

O `break` interrompe apenas o loop de tentativas.

Depois o loop externo continua para a próxima mensagem.

Isso é muito importante:

```text
break sai do loop mais próximo.
```

---

## Continue no loop interno

Arquivo:

```text
ContinueLoopInterno.java
```

Código:

```java
public class ContinueLoopInterno {
    public static void main(String[] args) {
        for (int pedido = 1; pedido <= 2; pedido++) {
            System.out.println("Pedido " + pedido);

            for (int item = 1; item <= 4; item++) {
                boolean itemCancelado = item == 3;

                if (itemCancelado) {
                    System.out.println("  Item cancelado ignorado: " + item);
                    continue;
                }

                System.out.println("  Processando item " + item);
            }
        }
    }
}
```

O `continue` pula apenas a iteração do loop interno.

Ele não pula o pedido inteiro.

Para cada pedido, o item 3 é ignorado e os demais são processados.

---

## Break não sai de todos os loops

Exemplo:

```java
for (int cliente = 1; cliente <= 3; cliente++) {
    for (int pedido = 1; pedido <= 3; pedido++) {
        if (pedido == 2) {
            break;
        }

        System.out.println("Cliente " + cliente + ", pedido " + pedido);
    }
}
```

Saída:

```text
Cliente 1, pedido 1
Cliente 2, pedido 1
Cliente 3, pedido 1
```

O `break` sai do loop de pedidos.

Mas o loop de clientes continua.

Isso pode ser correto ou não.

Se você esperava parar tudo, esse código não faz isso.

---

## Parar o processamento externo com variável de controle

Uma forma simples de parar processamento externo é usar uma variável booleana.

Arquivo:

```text
PararProcessamentoExterno.java
```

Código:

```java
public class PararProcessamentoExterno {
    public static void main(String[] args) {
        boolean erroCritico = false;

        for (int lote = 1; lote <= 3 && !erroCritico; lote++) {
            System.out.println("Lote " + lote);

            for (int registro = 1; registro <= 4; registro++) {
                System.out.println("  Registro " + registro);

                if (lote == 2 && registro == 3) {
                    erroCritico = true;
                    System.out.println("  Erro crítico encontrado");
                    break;
                }
            }
        }

        System.out.println("Erro crítico: " + erroCritico);
    }
}
```

Aqui o `break` sai do loop interno.

A variável:

```java
erroCritico
```

faz o loop externo parar na próxima verificação.

Essa abordagem é mais clara para iniciantes do que labels.

---

## Labels existem, mas evite nesta fase

Java permite labels com `break` rotulado.

Exemplo apenas para reconhecer:

```java
externo:
for (int lote = 1; lote <= 3; lote++) {
    for (int registro = 1; registro <= 4; registro++) {
        if (registro == 3) {
            break externo;
        }
    }
}
```

Isso sai do loop rotulado.

Mas nesta formação inicial, evite usar labels.

Eles podem dificultar a leitura.

Prefira:

```text
variável de controle;
métodos no futuro;
fluxo mais claro.
```

Mais tarde, quando estudarmos métodos, veremos formas melhores de organizar esse tipo de parada.

---

## Menus com subfluxos

Laços aninhados também aparecem em menus.

Exemplo:

```text
menu principal;
submenu de clientes;
submenu de pedidos;
voltar ao menu principal.
```

Isso é um tipo de subfluxo.

O menu principal pode usar `do while`.

Dentro dele, uma opção pode abrir outro `do while`.

Isso é útil, mas precisa de cuidado para não virar confusão.

---

## Exemplo aplicado: menu com submenu

Arquivo:

```text
MenuComSubmenu.java
```

Código:

```java
import java.util.Scanner;

public class MenuComSubmenu {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcaoPrincipal;

        do {
            System.out.println("Menu principal");
            System.out.println("1 - Clientes");
            System.out.println("2 - Pedidos");
            System.out.println("0 - Sair");

            opcaoPrincipal = scanner.nextInt();

            switch (opcaoPrincipal) {
                case 1:
                    int opcaoCliente;

                    do {
                        System.out.println("Submenu Clientes");
                        System.out.println("1 - Cadastrar cliente");
                        System.out.println("2 - Consultar cliente");
                        System.out.println("0 - Voltar");

                        opcaoCliente = scanner.nextInt();

                        switch (opcaoCliente) {
                            case 1:
                                System.out.println("Cadastrar cliente");
                                break;
                            case 2:
                                System.out.println("Consultar cliente");
                                break;
                            case 0:
                                System.out.println("Voltando ao menu principal");
                                break;
                            default:
                                System.out.println("Opção inválida");
                                break;
                        }
                    } while (opcaoCliente != 0);

                    break;

                case 2:
                    System.out.println("Fluxo de pedidos");
                    break;

                case 0:
                    System.out.println("Saindo");
                    break;

                default:
                    System.out.println("Opção inválida");
                    break;
            }
        } while (opcaoPrincipal != 0);

        scanner.close();
    }
}
```

Esse exemplo mostra um submenu real.

Mas também mostra como o código cresce rápido.

---

## Cuidado com menu aninhado demais

Menus aninhados podem ficar grandes.

Sinais de alerta:

```text
switch dentro de switch;
do while dentro de do while;
muita indentação;
muitos cases;
muitas regras dentro do menu;
difícil saber onde está o break;
difícil saber qual opção volta;
difícil saber qual opção sai.
```

No futuro, métodos vão resolver isso melhor:

```text
mostrarMenuPrincipal();
executarMenuClientes();
executarMenuPedidos();
```

Por enquanto, entenda o fluxo.

Não tente criar um sistema inteiro dentro de uma única classe enorme.

---

## Exemplo aplicado: clientes, pedidos e itens

Arquivo:

```text
ClientesPedidosItens.java
```

Código:

```java
public class ClientesPedidosItens {
    public static void main(String[] args) {
        for (int cliente = 1; cliente <= 2; cliente++) {
            System.out.println("Cliente " + cliente);

            for (int pedido = 1; pedido <= 2; pedido++) {
                System.out.println("  Pedido " + pedido);

                for (int item = 1; item <= 3; item++) {
                    System.out.println("    Item " + item);
                }
            }
        }
    }
}
```

Esse exemplo tem três níveis:

```text
cliente;
pedido;
item.
```

Ele é útil para entender hierarquia.

Mas, em código real, três níveis exigem muita atenção.

---

## Exemplo aplicado: relatório de pedidos

Arquivo:

```text
RelatorioPedidos.java
```

Código:

```java
public class RelatorioPedidos {
    public static void main(String[] args) {
        long totalGeralCentavos = 0L;

        for (int cliente = 1; cliente <= 2; cliente++) {
            long totalClienteCentavos = 0L;

            System.out.println("Cliente " + cliente);

            for (int pedido = 1; pedido <= 3; pedido++) {
                long totalPedidoCentavos = 0L;

                for (int item = 1; item <= 2; item++) {
                    long valorItemCentavos = 1000L * item;

                    totalPedidoCentavos += valorItemCentavos;
                    totalClienteCentavos += valorItemCentavos;
                    totalGeralCentavos += valorItemCentavos;
                }

                System.out.println("  Total pedido " + pedido + ": " + totalPedidoCentavos);
            }

            System.out.println("Total cliente " + cliente + ": " + totalClienteCentavos);
        }

        System.out.println("Total geral: " + totalGeralCentavos);
    }
}
```

Aqui temos acumuladores em três níveis:

```text
total do pedido;
total do cliente;
total geral.
```

Esse exemplo é muito importante para raciocínio de relatórios.

---

## Exemplo aplicado: matriz de permissões conceitual

Arquivo:

```text
MatrizPermissoesConceitual.java
```

Código:

```java
public class MatrizPermissoesConceitual {
    public static void main(String[] args) {
        for (int perfil = 1; perfil <= 3; perfil++) {
            System.out.println("Perfil " + perfil);

            for (int funcionalidade = 1; funcionalidade <= 4; funcionalidade++) {
                boolean permitido = perfil == 1 || funcionalidade <= 2;

                System.out.println("  Funcionalidade " + funcionalidade + ": permitido = " + permitido);
            }
        }
    }
}
```

Esse exemplo simula uma matriz de permissões:

```text
perfis x funcionalidades.
```

Ainda sem arrays, mas com raciocínio de matriz.

---

## Exemplo aplicado: agenda conceitual

Arquivo:

```text
AgendaConceitual.java
```

Código:

```java
public class AgendaConceitual {
    public static void main(String[] args) {
        for (int dia = 1; dia <= 3; dia++) {
            System.out.println("Dia " + dia);

            for (int horario = 8; horario <= 12; horario += 2) {
                System.out.println("  Horário disponível: " + horario + "h");
            }
        }
    }
}
```

Aqui temos:

```text
dias;
horários.
```

Esse tipo de raciocínio aparece em agendamento, janelas, capacity e disponibilidade.

---

## Exemplo aplicado: comparação de combinações

Arquivo:

```text
CombinacoesPagamento.java
```

Código:

```java
public class CombinacoesPagamento {
    public static void main(String[] args) {
        for (int formaPagamento = 1; formaPagamento <= 3; formaPagamento++) {
            for (int parcela = 1; parcela <= 4; parcela++) {
                System.out.println("Forma " + formaPagamento + ", parcela " + parcela);
            }
        }
    }
}
```

Isso gera combinações entre:

```text
formas de pagamento;
quantidade de parcelas.
```

Laços aninhados são muito usados para gerar combinações.

---

## Custo de combinações

Se você tem:

```text
3 formas de pagamento;
4 parcelas;
```

Total:

```text
3 × 4 = 12 combinações.
```

Se tiver:

```text
100 clientes;
50 pedidos por cliente;
20 itens por pedido;
```

Total conceitual:

```text
100 × 50 × 20 = 100.000 iterações.
```

Laços aninhados crescem rápido.

Esse é o cuidado de complexidade.

---

## Complexidade em linguagem simples

Complexidade aqui significa:

```text
quanto trabalho o programa faz.
```

Um loop simples de 100 iterações faz 100 execuções.

Um loop aninhado 100 × 100 faz:

```text
10.000 execuções.
```

Três loops 100 × 100 × 100 fazem:

```text
1.000.000 execuções.
```

Por isso, laço aninhado precisa ser usado com intenção.

Nem sempre é problema.

Mas precisa ser consciente.

---

## Quando laço aninhado faz sentido

Laço aninhado faz sentido quando existe uma relação hierárquica ou uma grade.

Exemplos:

```text
pedido -> itens;
cliente -> pedidos;
OS -> atividades;
atividade -> perguntas;
página -> itens;
perfil -> funcionalidades;
dia -> horários;
categoria -> produtos;
mensagem -> tentativas;
lote -> registros.
```

A pergunta é:

```text
para cada X, preciso percorrer vários Y?
```

Se sim, laço aninhado pode fazer sentido.

---

## Quando desconfiar de laço aninhado

Desconfie quando:

```text
o loop interno consulta banco para cada item externo;
o código tem muitos níveis;
há muitos ifs dentro do loop interno;
há muitos acumuladores difíceis de entender;
o tempo de execução cresce demais;
o mesmo dado é recalculado muitas vezes;
o loop externo e interno poderiam ser reduzidos;
a regra parece difícil de explicar.
```

Em backend real, loops aninhados com acesso a banco podem causar problemas sérios de performance.

Mais tarde, isso será ligado a consultas, joins, paginação e N+1.

Por enquanto, guarde o alerta.

---

## Laços aninhados e indentação

Indentação ajuda a enxergar níveis.

Exemplo:

```java
for (int cliente = 1; cliente <= 2; cliente++) {
    System.out.println("Cliente " + cliente);

    for (int pedido = 1; pedido <= 2; pedido++) {
        System.out.println("  Pedido " + pedido);

        for (int item = 1; item <= 3; item++) {
            System.out.println("    Item " + item);
        }
    }
}
```

Cada nível tem indentação.

Isso deixa a hierarquia visual:

```text
cliente;
  pedido;
    item.
```

Sem indentação, o código fica quase impossível de ler.

---

## Nome dos contadores importa

Ruim:

```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 4; j++) {
        System.out.println(i + " " + j);
    }
}
```

Funciona.

Mas em domínio, nomes melhores ajudam:

```java
for (int cliente = 1; cliente <= 3; cliente++) {
    for (int pedido = 1; pedido <= 4; pedido++) {
        System.out.println("Cliente " + cliente + ", pedido " + pedido);
    }
}
```

Use `i` e `j` em exemplos técnicos curtos.

Use nomes de domínio quando o código representa negócio.

---

## Evite reutilizar o mesmo contador

Erro grave:

```java
for (int i = 1; i <= 3; i++) {
    for (int i = 1; i <= 3; i++) {
        System.out.println(i);
    }
}
```

Isso nem compila, porque `i` já foi declarado no escopo externo.

Mesmo quando compila em outras variações, reutilizar nomes parecidos pode confundir.

Use nomes claros:

```java
linha;
coluna;
cliente;
pedido;
item;
pagina;
registro;
tentativa.
```

---

## Erros comuns

### Erro 1 — Não perceber a multiplicação

Se o externo roda 10 vezes e o interno 10 vezes, o bloco interno roda 100 vezes.

Muita gente espera 20.

Mas é multiplicação:

```text
10 × 10 = 100.
```

---

### Erro 2 — Colocar acumulador no nível errado

Se o total deveria reiniciar por pedido, declare dentro do loop de pedido.

Se deveria acumular tudo, declare fora.

Esse erro muda o resultado.

---

### Erro 3 — Usar break achando que sai de todos os loops

`break` sai apenas do loop mais próximo.

Em loop aninhado, ele normalmente sai do loop interno.

---

### Erro 4 — Usar continue achando que pula o loop externo

`continue` pula a iteração do loop onde ele está.

Se estiver no interno, pula só o interno.

---

### Erro 5 — Criar muitos níveis sem necessidade

Três níveis já exigem cuidado.

Quatro ou mais níveis geralmente pedem reorganização.

---

### Erro 6 — Misturar muitos ifs dentro de muitos loops

Isso cria complexidade alta.

Tente nomear regras booleanas e simplificar.

---

### Erro 7 — Não reiniciar variável interna

Exemplo conceitual ruim:

```java
int item = 1;

for (int pedido = 1; pedido <= 3; pedido++) {
    while (item <= 3) {
        System.out.println(item);
        item++;
    }
}
```

O item não reinicia para cada pedido.

Se a intenção era reiniciar, declare dentro do loop externo.

---

### Erro 8 — Esquecer quebra de linha ao desenhar grade

Se usar apenas `print`, tudo sai na mesma linha.

Use `println()` depois do loop interno.

---

### Erro 9 — Usar nomes genéricos demais

`i`, `j`, `k` podem ser aceitáveis em matriz pequena.

Em domínio corporativo, prefira nomes claros.

---

### Erro 10 — Não testar casos pequenos

Antes de testar 100 por 100, teste 2 por 3.

É mais fácil validar mentalmente.

---

## Diagnóstico de laços aninhados

Quando um laço aninhado não funcionar, siga o roteiro.

### 1. Qual é o loop externo?

Identifique o primeiro nível.

### 2. Qual é o loop interno?

Identifique o segundo nível.

### 3. Quantas vezes o externo roda?

Calcule.

### 4. Quantas vezes o interno roda para cada externo?

Calcule.

### 5. Qual é o total esperado?

Multiplique.

### 6. O loop interno reinicia a cada volta do externo?

Verifique onde a variável interna é declarada.

### 7. Os acumuladores estão no nível correto?

Total por item, por pedido, por cliente ou geral?

### 8. Há break ou continue?

Eles afetam qual loop?

### 9. A indentação está correta?

Reformate o código.

### 10. Testou com números pequenos?

Use 2 e 3 antes de usar números grandes.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Multiplicação de iterações

```java
public class Main {
    public static void main(String[] args) {
        int total = 0;

        for (int externo = 1; externo <= 3; externo++) {
            for (int interno = 1; interno <= 4; interno++) {
                total++;
            }
        }

        System.out.println("Total: " + total);
    }
}
```

Explique por que o total é 12.

### Teste 2 — Break sai só do interno

```java
public class Main {
    public static void main(String[] args) {
        for (int cliente = 1; cliente <= 3; cliente++) {
            for (int pedido = 1; pedido <= 3; pedido++) {
                if (pedido == 2) {
                    break;
                }

                System.out.println("Cliente " + cliente + ", pedido " + pedido);
            }
        }
    }
}
```

Observe que os clientes continuam.

### Teste 3 — Continue pula só item interno

```java
public class Main {
    public static void main(String[] args) {
        for (int pedido = 1; pedido <= 2; pedido++) {
            for (int item = 1; item <= 3; item++) {
                if (item == 2) {
                    continue;
                }

                System.out.println("Pedido " + pedido + ", item " + item);
            }
        }
    }
}
```

Observe que só o item 2 é pulado.

### Teste 4 — Acumulador no nível errado

Crie uma versão com total por pedido declarado fora do loop de pedido.

Depois corrija declarando dentro.

Compare os resultados.

### Teste 5 — Grade sem quebra de linha

```java
public class Main {
    public static void main(String[] args) {
        for (int linha = 1; linha <= 3; linha++) {
            for (int coluna = 1; coluna <= 3; coluna++) {
                System.out.print("[X]");
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

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-043-lacos-aninhados
cd labs\m1\aula-043-lacos-aninhados
```

Crie arquivos:

```text
Main.java
GradeConceitual.java
TabuadaAninhada.java
CategoriasProdutos.java
ClientesPedidos.java
PedidosItens.java
TotalPedidoETotalGeral.java
OrdensServicoAtividades.java
OrdensAtividadesChecklist.java
PaginasItens.java
MensagensTentativas.java
BreakLoopInterno.java
ContinueLoopInterno.java
PararProcessamentoExterno.java
MenuComSubmenu.java
ClientesPedidosItens.java
RelatorioPedidos.java
MatrizPermissoesConceitual.java
AgendaConceitual.java
CombinacoesPagamento.java
MultiplicacaoIteracoes.java
BreakSaiDoInterno.java
ContinueNoInterno.java
```

Compile:

```powershell
javac Main.java
javac GradeConceitual.java
javac TabuadaAninhada.java
javac CategoriasProdutos.java
javac ClientesPedidos.java
javac PedidosItens.java
javac TotalPedidoETotalGeral.java
javac OrdensServicoAtividades.java
javac OrdensAtividadesChecklist.java
javac PaginasItens.java
javac MensagensTentativas.java
javac BreakLoopInterno.java
javac ContinueLoopInterno.java
javac PararProcessamentoExterno.java
javac MenuComSubmenu.java
javac ClientesPedidosItens.java
javac RelatorioPedidos.java
javac MatrizPermissoesConceitual.java
javac AgendaConceitual.java
javac CombinacoesPagamento.java
javac MultiplicacaoIteracoes.java
javac BreakSaiDoInterno.java
javac ContinueNoInterno.java
```

Execute:

```powershell
java Main
java GradeConceitual
java TabuadaAninhada
java CategoriasProdutos
java ClientesPedidos
java PedidosItens
java TotalPedidoETotalGeral
java OrdensServicoAtividades
java OrdensAtividadesChecklist
java PaginasItens
java MensagensTentativas
java BreakLoopInterno
java ContinueLoopInterno
java PararProcessamentoExterno
java MenuComSubmenu
java ClientesPedidosItens
java RelatorioPedidos
java MatrizPermissoesConceitual
java AgendaConceitual
java CombinacoesPagamento
java MultiplicacaoIteracoes
java BreakSaiDoInterno
java ContinueNoInterno
```

Depois quebre erros de propósito e registre no diário.

---

## Arquivo sugerido: `MultiplicacaoIteracoes.java`

```java
public class MultiplicacaoIteracoes {
    public static void main(String[] args) {
        int totalExecucoes = 0;

        for (int externo = 1; externo <= 3; externo++) {
            for (int interno = 1; interno <= 4; interno++) {
                totalExecucoes++;
            }
        }

        System.out.println("Total de execuções internas: " + totalExecucoes);
    }
}
```

Objetivo:

```text
entender que laços aninhados multiplicam iterações.
```

---

## Arquivo sugerido: `BreakSaiDoInterno.java`

```java
public class BreakSaiDoInterno {
    public static void main(String[] args) {
        for (int cliente = 1; cliente <= 3; cliente++) {
            for (int pedido = 1; pedido <= 3; pedido++) {
                if (pedido == 2) {
                    break;
                }

                System.out.println("Cliente " + cliente + ", pedido " + pedido);
            }
        }
    }
}
```

Objetivo:

```text
ver que break sai apenas do loop interno.
```

---

## Arquivo sugerido: `ContinueNoInterno.java`

```java
public class ContinueNoInterno {
    public static void main(String[] args) {
        for (int pedido = 1; pedido <= 2; pedido++) {
            for (int item = 1; item <= 3; item++) {
                if (item == 2) {
                    continue;
                }

                System.out.println("Pedido " + pedido + ", item " + item);
            }
        }
    }
}
```

Objetivo:

```text
ver que continue pula apenas a iteração do loop interno.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar indentação dos loops |
| Renomear variável | `Shift + F6` | Melhorar nomes de contadores |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Parar execução | botão Stop ou `Ctrl + F2` em muitos keymaps | Interromper loop problemático |
| Debug | `Shift + F9` | Ver loop externo e interno |
| Step Over | `F8` em muitos keymaps | Avançar linha por linha |
| Project | `Alt + 1` | Navegar arquivos |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |
| Recent Files | `Ctrl + E` | Alternar arquivos |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug para laços aninhados

Use debug neste exemplo:

```java
for (int linha = 1; linha <= 2; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        System.out.println("Linha " + linha + ", coluna " + coluna);
    }
}
```

Coloque breakpoint no `println`.

Observe:

```text
linha = 1, coluna = 1;
linha = 1, coluna = 2;
linha = 1, coluna = 3;
linha = 2, coluna = 1;
linha = 2, coluna = 2;
linha = 2, coluna = 3.
```

Repare que `coluna` reinicia quando `linha` muda.

Esse é o comportamento central.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 043 — Laços aninhados

### O que aprendi
Aprendi que laço aninhado é uma repetição dentro de outra, e que o loop interno executa completamente para cada iteração do loop externo.

### O que pratiquei
Criei exemplos com linha e coluna, grade conceitual, tabuada, categorias e produtos, clientes e pedidos, pedidos e itens, OS e atividades, checklist, páginas e itens, mensageria com tentativas, menus com submenus, matriz de permissões, agenda e relatórios.

### Conceitos principais
- laço aninhado
- loop externo
- loop interno
- iteração externa
- iteração interna
- matriz conceitual
- linha e coluna
- multiplicação de iterações
- acumulador por nível
- total por pedido
- total por cliente
- total geral
- menu com submenu
- break no loop interno
- continue no loop interno
- complexidade
- indentação
- nomes de contadores

### Arquivos criados
- `labs/m1/aula-043-lacos-aninhados/Main.java`
- `labs/m1/aula-043-lacos-aninhados/GradeConceitual.java`
- `labs/m1/aula-043-lacos-aninhados/TabuadaAninhada.java`
- `labs/m1/aula-043-lacos-aninhados/CategoriasProdutos.java`
- `labs/m1/aula-043-lacos-aninhados/ClientesPedidos.java`
- `labs/m1/aula-043-lacos-aninhados/PedidosItens.java`
- `labs/m1/aula-043-lacos-aninhados/TotalPedidoETotalGeral.java`
- `labs/m1/aula-043-lacos-aninhados/OrdensServicoAtividades.java`
- `labs/m1/aula-043-lacos-aninhados/OrdensAtividadesChecklist.java`
- `labs/m1/aula-043-lacos-aninhados/PaginasItens.java`
- `labs/m1/aula-043-lacos-aninhados/MensagensTentativas.java`
- `labs/m1/aula-043-lacos-aninhados/BreakLoopInterno.java`
- `labs/m1/aula-043-lacos-aninhados/ContinueLoopInterno.java`
- `labs/m1/aula-043-lacos-aninhados/PararProcessamentoExterno.java`
- `labs/m1/aula-043-lacos-aninhados/MenuComSubmenu.java`
- `labs/m1/aula-043-lacos-aninhados/ClientesPedidosItens.java`
- `labs/m1/aula-043-lacos-aninhados/RelatorioPedidos.java`
- `labs/m1/aula-043-lacos-aninhados/MatrizPermissoesConceitual.java`
- `labs/m1/aula-043-lacos-aninhados/AgendaConceitual.java`
- `labs/m1/aula-043-lacos-aninhados/CombinacoesPagamento.java`
- `labs/m1/aula-043-lacos-aninhados/MultiplicacaoIteracoes.java`
- `labs/m1/aula-043-lacos-aninhados/BreakSaiDoInterno.java`
- `labs/m1/aula-043-lacos-aninhados/ContinueNoInterno.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac GradeConceitual.java
java GradeConceitual
javac TabuadaAninhada.java
java TabuadaAninhada
javac ClientesPedidos.java
java ClientesPedidos
javac RelatorioPedidos.java
java RelatorioPedidos
```

### Erros que quero evitar
- não perceber a multiplicação das iterações;
- colocar acumulador no nível errado;
- usar `break` achando que sai de todos os loops;
- usar `continue` achando que pula o loop externo;
- criar muitos níveis sem necessidade;
- misturar muitos `if`s dentro de muitos loops;
- não reiniciar variável interna quando necessário;
- esquecer quebra de linha ao desenhar grade;
- usar nomes genéricos demais;
- não testar casos pequenos.

### Próximo passo
Estudar validação de entrada sem try/catch profundo.
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
git add labs/m1/aula-043-lacos-aninhados docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 043: pratica lacos aninhados em Java"
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
1. O que é um laço aninhado?
2. Qual a diferença entre loop externo e loop interno?
3. Se o loop externo roda 3 vezes e o interno 4 vezes, quantas execuções internas acontecem?
4. Por que o loop interno reinicia a cada volta do externo?
5. O que é matriz conceitual?
6. Por que acumuladores precisam estar no nível correto?
7. O que acontece com `break` dentro do loop interno?
8. O que acontece com `continue` dentro do loop interno?
9. Por que muitos níveis de laço podem ser perigosos?
10. Quando um laço aninhado faz sentido em domínio corporativo?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar laço aninhado;
identificar loop externo;
identificar loop interno;
explicar iteração externa;
explicar iteração interna;
calcular multiplicação de iterações;
criar for dentro de for;
desenhar grade conceitual;
usar print e println corretamente;
criar tabuada aninhada;
aplicar em categorias e produtos;
aplicar em clientes e pedidos;
aplicar em pedidos e itens;
aplicar em OS e atividades;
aplicar em checklist conceitual;
aplicar em páginas e itens;
aplicar em mensageria e tentativas;
usar break no loop interno;
usar continue no loop interno;
explicar que break sai do loop mais próximo;
explicar que continue pula iteração do loop atual;
parar loop externo com variável de controle;
entender menus com submenus;
identificar complexidade;
usar acumuladores por nível;
testar casos pequenos;
diagnosticar erros comuns;
debugar loop externo e interno;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar arrays.

Não precisa ainda dominar matrizes reais.

Não precisa ainda dominar labels.

Não precisa ainda dominar métodos para simplificação.

Não precisa ainda dominar performance de banco ou N+1.

Esses assuntos virão depois.

O objetivo é dominar o raciocínio de repetição em dois ou mais níveis e reconhecer quando isso começa a ficar complexo.

---

## Fechamento da aula

Hoje aprendemos laços aninhados.

A ideia central é:

```text
para cada item do loop externo,
o loop interno executa seu ciclo completo.
```

Isso permite representar:

```text
linhas e colunas;
clientes e pedidos;
pedidos e itens;
OS e atividades;
páginas e itens;
mensagens e tentativas;
menus e submenus;
perfis e funcionalidades;
dias e horários.
```

Também vimos que laços aninhados multiplicam execuções.

Por isso, eles precisam ser usados com consciência.

Aprendemos ainda que:

```text
break sai do loop mais próximo;
continue pula a iteração do loop atual;
acumuladores precisam estar no nível correto;
muitos níveis aumentam complexidade;
nomes claros e indentação são essenciais.
```

Na próxima aula, vamos estudar validação de entrada sem try/catch profundo.

Isso vai organizar melhor os fluxos de console, evitando entradas ruins antes de avançarmos para assuntos mais estruturados.
