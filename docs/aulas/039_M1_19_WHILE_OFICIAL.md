# 039 — M1.19 — While

## Hoje a aula é sobre repetir enquanto uma condição for verdadeira

A palavra:

```java
while
```

significa:

```text
enquanto.
```

A ideia é:

```text
enquanto a condição for verdadeira, execute o bloco.
```

Exemplo em português:

```text
enquanto houver registros pendentes, processe o próximo;
enquanto houver tentativas restantes, permita tentar;
enquanto a opção do menu for diferente de sair, continue;
enquanto a página atual for menor que o total de páginas, busque a próxima página;
enquanto houver mensagens na fila, envie a próxima mensagem;
enquanto a quantidade processada for menor que o total, continue processando.
```

Em Java:

```java
while (condicao) {
    // bloco repetido
}
```

A condição precisa ser booleana.

Enquanto ela for `true`, o bloco executa.

Quando virar `false`, o `while` termina.

---

## O que é loop

Loop é repetição.

Um loop executa o mesmo bloco de código várias vezes.

Exemplo:

```java
while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Esse bloco:

```java
System.out.println(contador);
contador++;
```

é executado repetidamente.

Cada execução é chamada informalmente de:

```text
volta;
iteração;
ciclo.
```

Termo técnico importante:

```text
iteração.
```

Se o bloco executa 5 vezes, dizemos que o loop teve 5 iterações.

---

## Estrutura do while

Estrutura básica:

```java
while (condicao) {
    // código repetido
}
```

Partes:

```text
while -> inicia a repetição;
condicao -> expressão booleana testada antes de cada repetição;
bloco -> código executado enquanto a condição for verdadeira.
```

Exemplo:

```java
int contador = 1;

while (contador <= 3) {
    System.out.println(contador);
    contador++;
}
```

Fluxo:

```text
contador = 1;
1 <= 3? true -> imprime 1 -> contador vira 2;
2 <= 3? true -> imprime 2 -> contador vira 3;
3 <= 3? true -> imprime 3 -> contador vira 4;
4 <= 3? false -> sai do while.
```

---

## While testa antes de executar

O `while` testa a condição antes de executar o bloco.

Exemplo:

```java
int contador = 10;

while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Saída:

```text
```

Não imprime nada.

Por quê?

Porque a condição já começa falsa:

```java
contador <= 5
```

com `contador = 10`.

Isso é uma característica importante:

```text
while pode executar zero vezes.
```

Na próxima aula, estudaremos `do while`, que executa pelo menos uma vez.

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
        int contador = 1;

        while (contador <= 5) {
            System.out.println("Contador: " + contador);
            contador++;
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
Contador: 1
Contador: 2
Contador: 3
Contador: 4
Contador: 5
Fim do programa
```

---

## As três partes de um while controlado por contador

Um `while` com contador geralmente tem três partes.

### 1. Inicialização

```java
int contador = 1;
```

### 2. Condição

```java
while (contador <= 5)
```

### 3. Atualização

```java
contador++;
```

Juntas:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Se esquecer uma dessas partes, o loop pode falhar.

A atualização é especialmente importante para evitar loop infinito.

---

## Loop infinito

Loop infinito acontece quando a condição nunca fica falsa.

Exemplo perigoso:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println("Contador: " + contador);
}
```

O contador nunca muda.

Ele começa em 1.

A condição:

```java
contador <= 5
```

sempre será verdadeira.

O programa imprime para sempre:

```text
Contador: 1
Contador: 1
Contador: 1
...
```

Isso é loop infinito.

---

## Como evitar loop infinito

Pergunta obrigatória em todo `while`:

```text
o que faz a condição mudar?
```

Exemplo correto:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println("Contador: " + contador);
    contador++;
}
```

Aqui:

```java
contador++;
```

faz a condição mudar.

Em algum momento, `contador` vira 6.

A condição:

```java
contador <= 5
```

vira `false`.

O loop termina.

Regra:

```text
todo while precisa ter um caminho claro para terminar.
```

---

## While crescente

Exemplo:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Saída:

```text
1
2
3
4
5
```

Esse loop cresce.

A variável começa menor e aumenta até ultrapassar o limite.

---

## While decrescente

Exemplo:

```java
int contador = 5;

while (contador >= 1) {
    System.out.println(contador);
    contador--;
}
```

Saída:

```text
5
4
3
2
1
```

Esse loop decresce.

A variável começa maior e diminui até ficar menor que o limite.

---

## Contador dentro do while

A aula de incremento volta aqui.

Exemplo:

```java
int quantidadeProcessada = 0;

while (quantidadeProcessada < 3) {
    System.out.println("Processando item");
    quantidadeProcessada++;
}
```

Saída:

```text
Processando item
Processando item
Processando item
```

O contador controla a quantidade de repetições.

Se remover:

```java
quantidadeProcessada++;
```

o loop nunca termina.

---

## Acumulador dentro do while

Também podemos acumular valores.

Exemplo:

```java
int contador = 1;
int total = 0;

while (contador <= 5) {
    total += contador;
    contador++;
}

System.out.println("Total: " + total);
```

Cálculo:

```text
1 + 2 + 3 + 4 + 5 = 15.
```

Saída:

```text
Total: 15
```

Aqui temos:

```text
contador -> controla o loop;
total -> acumula valores.
```

Não confunda os dois.

---

## Contador e acumulador juntos

Exemplo:

```java
int itemAtual = 1;
int totalItens = 5;
int totalProcessado = 0;

while (itemAtual <= totalItens) {
    totalProcessado++;
    itemAtual++;
}

System.out.println("Total processado: " + totalProcessado);
```

Aqui:

```text
itemAtual controla a repetição;
totalProcessado conta quantos itens foram processados.
```

Em muitos casos, eles podem ser a mesma variável.

Mas em regras reais, separar nomes pode melhorar a leitura.

---

## While com condição booleana

O `while` não precisa depender apenas de contador.

Ele pode depender de uma variável booleana.

Exemplo:

```java
boolean continuar = true;
int contador = 1;

while (continuar) {
    System.out.println("Executando ciclo " + contador);

    contador++;

    if (contador > 3) {
        continuar = false;
    }
}
```

Saída:

```text
Executando ciclo 1
Executando ciclo 2
Executando ciclo 3
```

Aqui a condição é:

```java
continuar
```

O loop termina quando:

```java
continuar = false;
```

---

## While com Scanner

Podemos repetir leitura de dados.

Exemplo simples:

```java
import java.util.Scanner;

public class LeituraEnquantoPositivo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite um número positivo ou 0 para sair:");
        int numero = scanner.nextInt();

        while (numero > 0) {
            System.out.println("Número informado: " + numero);

            System.out.println("Digite outro número positivo ou 0 para sair:");
            numero = scanner.nextInt();
        }

        System.out.println("Fim");

        scanner.close();
    }
}
```

Esse padrão é chamado de:

```text
valor sentinela.
```

O valor `0` indica parada.

---

## Valor sentinela

Valor sentinela é um valor especial que encerra a repetição.

Exemplos:

```text
0 para sair;
-1 para encerrar;
"SAIR" para terminar;
opção 0 no menu;
status FIM;
quantidade 0.
```

Exemplo:

```java
while (opcao != 0) {
    // repetir menu
}
```

O valor `0` não é dado comum.

Ele significa:

```text
parar.
```

Esse padrão aparece muito em programas de console.

---

## Exemplo com menu usando while

Arquivo:

```text
MenuWhile.java
```

Código:

```java
import java.util.Scanner;

public class MenuWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao = -1;

        while (opcao != 0) {
            System.out.println("Menu");
            System.out.println("1 - Cadastrar");
            System.out.println("2 - Consultar");
            System.out.println("0 - Sair");

            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    System.out.println("Cadastrar");
                    break;
                case 2:
                    System.out.println("Consultar");
                    break;
                case 0:
                    System.out.println("Saindo");
                    break;
                default:
                    System.out.println("Opção inválida");
                    break;
            }
        }

        scanner.close();
    }
}
```

Aqui temos:

```text
while;
Scanner;
switch;
valor sentinela.
```

O menu repete até a opção ser 0.

---

## Por que iniciar opção com -1

No exemplo:

```java
int opcao = -1;

while (opcao != 0) {
    // menu
}
```

A variável começa com `-1` para garantir que a condição inicial seja verdadeira.

Se começasse com:

```java
int opcao = 0;
```

o while nem executaria.

Como `while` testa antes, precisamos de um valor inicial que permita entrar no loop.

Na próxima aula, `do while` vai resolver esse tipo de menu de forma mais natural, porque executa primeiro e testa depois.

---

## While com processamento de lote

Imagine que há 5 registros para processar.

Arquivo:

```text
ProcessamentoLoteWhile.java
```

Código:

```java
public class ProcessamentoLoteWhile {
    public static void main(String[] args) {
        int totalRegistros = 5;
        int registroAtual = 1;
        int registrosProcessados = 0;

        while (registroAtual <= totalRegistros) {
            System.out.println("Processando registro " + registroAtual);

            registrosProcessados++;
            registroAtual++;
        }

        System.out.println("Registros processados: " + registrosProcessados);
    }
}
```

Saída:

```text
Processando registro 1
Processando registro 2
Processando registro 3
Processando registro 4
Processando registro 5
Registros processados: 5
```

Esse exemplo representa um lote simples.

---

## While com erros em lote

Agora vamos simular erros.

Arquivo:

```text
ProcessamentoLoteComErro.java
```

Código:

```java
public class ProcessamentoLoteComErro {
    public static void main(String[] args) {
        int totalRegistros = 5;
        int registroAtual = 1;
        int registrosProcessados = 0;
        int registrosComErro = 0;

        while (registroAtual <= totalRegistros) {
            System.out.println("Processando registro " + registroAtual);

            if (registroAtual == 3) {
                System.out.println("Erro no registro " + registroAtual);
                registrosComErro++;
            } else {
                registrosProcessados++;
            }

            registroAtual++;
        }

        System.out.println("Registros processados com sucesso: " + registrosProcessados);
        System.out.println("Registros com erro: " + registrosComErro);
    }
}
```

Esse exemplo junta:

```text
while;
if;
contador;
erro simulado;
processamento de lote.
```

---

## While com tentativas

Um padrão muito comum é limitar tentativas.

Arquivo:

```text
TentativasWhile.java
```

Código:

```java
public class TentativasWhile {
    public static void main(String[] args) {
        int tentativasRealizadas = 0;
        int limiteTentativas = 3;

        while (tentativasRealizadas < limiteTentativas) {
            tentativasRealizadas++;

            System.out.println("Tentativa " + tentativasRealizadas);
        }

        System.out.println("Limite de tentativas atingido");
    }
}
```

Saída:

```text
Tentativa 1
Tentativa 2
Tentativa 3
Limite de tentativas atingido
```

Esse padrão aparece em:

```text
login;
reprocessamento;
integração;
envio de mensagem;
tentativa de conexão;
consulta com retry.
```

---

## While com senha simulada

Arquivo:

```text
TentativaSenhaConsole.java
```

Código:

```java
import java.util.Scanner;

public class TentativaSenhaConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String senhaCorreta = "java123";
        String senhaInformada = "";
        int tentativas = 0;
        int limiteTentativas = 3;

        while (!senhaCorreta.equals(senhaInformada) && tentativas < limiteTentativas) {
            System.out.println("Digite a senha:");
            senhaInformada = scanner.nextLine();

            tentativas++;
        }

        if (senhaCorreta.equals(senhaInformada)) {
            System.out.println("Acesso autorizado");
        } else {
            System.out.println("Acesso bloqueado por excesso de tentativas");
        }

        scanner.close();
    }
}
```

Regra:

```text
enquanto senha estiver errada
E tentativas forem menores que o limite,
pedir senha novamente.
```

Esse exemplo usa:

```text
while;
String;
equals;
operador lógico;
contador;
if final.
```

---

## Cuidado com condição composta em while

Veja:

```java
while (!senhaCorreta.equals(senhaInformada) && tentativas < limiteTentativas) {
```

Essa condição tem duas partes:

```text
senha ainda está errada;
ainda há tentativas disponíveis.
```

O loop continua apenas enquanto as duas forem verdadeiras.

Se a senha ficar correta, para.

Se acabar tentativa, para.

Essa é a força do `while`.

Ele repete enquanto a regra permitir.

---

## While com estoque

Arquivo:

```text
BaixaEstoqueWhile.java
```

Código:

```java
public class BaixaEstoqueWhile {
    public static void main(String[] args) {
        int estoque = 5;
        int quantidadeSolicitada = 3;
        int quantidadeBaixada = 0;

        while (quantidadeBaixada < quantidadeSolicitada && estoque > 0) {
            estoque--;
            quantidadeBaixada++;

            System.out.println("Baixou 1 item");
        }

        System.out.println("Estoque final: " + estoque);
        System.out.println("Quantidade baixada: " + quantidadeBaixada);
    }
}
```

Esse exemplo representa uma baixa item a item.

Em sistemas reais, muitas vezes a baixa seria feita de forma mais direta.

Mas didaticamente ele mostra:

```text
duas condições controlando repetição.
```

---

## While com paginação

Paginação é muito comum em backend.

Arquivo:

```text
PaginacaoWhile.java
```

Código:

```java
public class PaginacaoWhile {
    public static void main(String[] args) {
        int paginaAtual = 1;
        int totalPaginas = 3;

        while (paginaAtual <= totalPaginas) {
            System.out.println("Buscando página " + paginaAtual);

            paginaAtual++;
        }

        System.out.println("Todas as páginas foram buscadas");
    }
}
```

Saída:

```text
Buscando página 1
Buscando página 2
Buscando página 3
Todas as páginas foram buscadas
```

Esse padrão aparece em:

```text
APIs paginadas;
consultas por lote;
relatórios;
integrações;
sincronização.
```

---

## While com mensageria

Arquivo:

```text
MensageriaWhile.java
```

Código:

```java
public class MensageriaWhile {
    public static void main(String[] args) {
        int mensagensPendentes = 4;
        int mensagensEnviadas = 0;

        while (mensagensPendentes > 0) {
            System.out.println("Enviando mensagem");

            mensagensPendentes--;
            mensagensEnviadas++;
        }

        System.out.println("Mensagens enviadas: " + mensagensEnviadas);
        System.out.println("Mensagens pendentes: " + mensagensPendentes);
    }
}
```

Esse exemplo mostra uma fila simples.

Enquanto houver mensagens pendentes, envia.

Cada envio:

```text
reduz pendentes;
aumenta enviadas.
```

---

## While com auditoria

Arquivo:

```text
AuditoriaWhile.java
```

Código:

```java
public class AuditoriaWhile {
    public static void main(String[] args) {
        int eventosPendentes = 3;
        int eventosRegistrados = 0;

        while (eventosPendentes > 0) {
            System.out.println("Registrando evento de auditoria");

            eventosPendentes--;
            eventosRegistrados++;
        }

        System.out.println("Eventos registrados: " + eventosRegistrados);
    }
}
```

Esse exemplo é simples, mas representa processamento repetitivo.

---

## While com validação de entrada

Podemos repetir enquanto o valor estiver inválido.

Arquivo:

```text
ValidacaoEntradaWhile.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoEntradaWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite uma quantidade maior que zero:");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite novamente:");
            quantidade = scanner.nextInt();
        }

        System.out.println("Quantidade válida: " + quantidade);

        scanner.close();
    }
}
```

Esse padrão é muito útil.

O programa não segue enquanto a entrada estiver inválida.

---

## Cuidado: repetição com entrada precisa atualizar a variável

Erro comum:

```java
System.out.println("Digite uma quantidade maior que zero:");
int quantidade = scanner.nextInt();

while (quantidade <= 0) {
    System.out.println("Quantidade inválida");
}
```

Se a quantidade for inválida, o loop nunca termina.

Por quê?

Porque dentro do `while` não há nova leitura.

Correção:

```java
while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite novamente:");
    quantidade = scanner.nextInt();
}
```

A variável da condição precisa mudar.

---

## While e escopo de variáveis

Variáveis criadas dentro do bloco do `while` existem apenas dentro dele.

Exemplo:

```java
while (contador <= 3) {
    String mensagem = "Executando";
    System.out.println(mensagem);
}

System.out.println(mensagem); // erro
```

`mensagem` foi criada dentro do bloco.

Fora do bloco, ela não existe.

Isso vale para blocos em geral.

Se precisar usar uma variável depois do `while`, declare antes.

---

## Exemplo de escopo correto

```java
int contador = 1;
int total = 0;

while (contador <= 3) {
    total += contador;
    contador++;
}

System.out.println("Total: " + total);
```

`total` foi declarado antes do `while`.

Por isso pode ser usado depois.

---

## While e break

Existe a palavra:

```java
break
```

Ela interrompe o loop.

Exemplo:

```java
int contador = 1;

while (contador <= 10) {
    if (contador == 5) {
        break;
    }

    System.out.println(contador);
    contador++;
}
```

Saída:

```text
1
2
3
4
```

Quando contador chega em 5, o `break` encerra o loop.

Nesta fase, use `break` com cuidado.

Muitas vezes é melhor controlar o loop pela condição do `while`.

---

## Não abuse de break

Compare:

```java
while (true) {
    if (opcao == 0) {
        break;
    }
}
```

Esse padrão existe.

Mas para quem está aprendendo, pode esconder a condição de parada.

Prefira:

```java
while (opcao != 0) {
    // ...
}
```

A condição fica visível no topo.

Regra inicial:

```text
prefira while com condição clara.
```

Depois, em casos específicos, `break` será útil.

---

## While e continue

Existe também:

```java
continue
```

Ele pula para a próxima iteração.

Exemplo:

```java
int contador = 0;

while (contador < 5) {
    contador++;

    if (contador == 3) {
        continue;
    }

    System.out.println(contador);
}
```

Saída:

```text
1
2
4
5
```

Quando contador é 3, o `continue` pula o `println`.

Nesta fase, apenas reconheça.

Vamos priorizar loops simples.

---

## Não abuse de continue

Assim como `break`, `continue` pode ser útil.

Mas usado sem cuidado, dificulta a leitura.

No começo, prefira escrever condições claras.

Exemplo mais explícito:

```java
if (contador != 3) {
    System.out.println(contador);
}
```

Use `continue` quando realmente melhorar o fluxo.

---

## While versus if

`if` decide uma vez.

`while` repete enquanto a condição for verdadeira.

Exemplo com `if`:

```java
if (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Executa uma vez.

Exemplo com `while`:

```java
while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Executa várias vezes até a condição ficar falsa.

Essa é a diferença fundamental.

---

## Erros comuns

### Erro 1 — Esquecer atualização do contador

Errado:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println(contador);
}
```

Causa loop infinito.

Certo:

```java
contador++;
```

dentro do loop.

---

### Erro 2 — Atualizar na direção errada

Errado:

```java
int contador = 1;

while (contador <= 5) {
    System.out.println(contador);
    contador--;
}
```

O contador vai para 0, -1, -2...

A condição continua verdadeira para sempre.

Certo:

```java
contador++;
```

---

### Erro 3 — Condição inicial já falsa

```java
int contador = 10;

while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Não executa nenhuma vez.

Isso pode ser correto ou erro, dependendo da regra.

Lembre:

```text
while testa antes.
```

---

### Erro 4 — Usar `<` quando deveria usar `<=`

Exemplo:

```java
int contador = 1;

while (contador < 5) {
    System.out.println(contador);
    contador++;
}
```

Imprime:

```text
1
2
3
4
```

Não imprime 5.

Se quiser incluir 5:

```java
contador <= 5
```

---

### Erro 5 — Usar `<=` quando deveria usar `<`

Se você quer processar índices de 0 até 4, use:

```java
while (indice < 5)
```

Se usar:

```java
indice <= 5
```

processa 6 vezes:

```text
0, 1, 2, 3, 4, 5.
```

Esse erro será muito importante quando chegarmos a arrays e listas.

---

### Erro 6 — Não atualizar entrada no loop

Errado:

```java
while (quantidade <= 0) {
    System.out.println("Inválida");
}
```

Certo:

```java
while (quantidade <= 0) {
    System.out.println("Inválida. Digite novamente:");
    quantidade = scanner.nextInt();
}
```

---

### Erro 7 — Criar loop infinito com `while (true)` sem break

Perigoso:

```java
while (true) {
    System.out.println("Executando");
}
```

Isso nunca termina.

Use apenas quando souber exatamente onde e por que vai interromper.

---

### Erro 8 — Confundir contador com acumulador

Errado conceitualmente:

```java
contador += valorPedido;
```

se o objetivo era contar pedidos.

Para contar:

```java
contador++;
```

Para acumular valor:

```java
total += valorPedido;
```

---

### Erro 9 — Declarar variável dentro do while e tentar usar fora

Errado:

```java
while (contador <= 3) {
    int total = 10;
}

System.out.println(total);
```

`total` não existe fora do bloco.

Declare antes se precisar depois.

---

### Erro 10 — Não testar o cenário de zero iterações

Se o `while` pode não executar, teste esse caso.

Exemplo:

```text
totalRegistros = 0;
mensagensPendentes = 0;
opcao inicial = 0;
quantidade já válida;
senha correta de primeira.
```

Esse teste revela se o fluxo está correto.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-039-while
cd labs\m1\aula-039-while
```

Crie arquivos:

```text
Main.java
WhileCrescente.java
WhileDecrescente.java
AcumuladorWhile.java
LeituraEnquantoPositivo.java
MenuWhile.java
ProcessamentoLoteWhile.java
ProcessamentoLoteComErro.java
TentativasWhile.java
TentativaSenhaConsole.java
BaixaEstoqueWhile.java
PaginacaoWhile.java
MensageriaWhile.java
AuditoriaWhile.java
ValidacaoEntradaWhile.java
WhileBreak.java
WhileContinue.java
```

Compile:

```powershell
javac Main.java
javac WhileCrescente.java
javac WhileDecrescente.java
javac AcumuladorWhile.java
javac LeituraEnquantoPositivo.java
javac MenuWhile.java
javac ProcessamentoLoteWhile.java
javac ProcessamentoLoteComErro.java
javac TentativasWhile.java
javac TentativaSenhaConsole.java
javac BaixaEstoqueWhile.java
javac PaginacaoWhile.java
javac MensageriaWhile.java
javac AuditoriaWhile.java
javac ValidacaoEntradaWhile.java
javac WhileBreak.java
javac WhileContinue.java
```

Execute:

```powershell
java Main
java WhileCrescente
java WhileDecrescente
java AcumuladorWhile
java LeituraEnquantoPositivo
java MenuWhile
java ProcessamentoLoteWhile
java ProcessamentoLoteComErro
java TentativasWhile
java TentativaSenhaConsole
java BaixaEstoqueWhile
java PaginacaoWhile
java MensageriaWhile
java AuditoriaWhile
java ValidacaoEntradaWhile
java WhileBreak
java WhileContinue
```

Depois quebre erros de propósito e registre no diário.

---

## Arquivo sugerido: `WhileCrescente.java`

```java
public class WhileCrescente {
    public static void main(String[] args) {
        int contador = 1;

        while (contador <= 5) {
            System.out.println(contador);
            contador++;
        }
    }
}
```

Objetivo:

```text
entender while controlado por contador crescente.
```

---

## Arquivo sugerido: `WhileDecrescente.java`

```java
public class WhileDecrescente {
    public static void main(String[] args) {
        int contador = 5;

        while (contador >= 1) {
            System.out.println(contador);
            contador--;
        }
    }
}
```

Objetivo:

```text
entender while controlado por contador decrescente.
```

---

## Arquivo sugerido: `WhileBreak.java`

```java
public class WhileBreak {
    public static void main(String[] args) {
        int contador = 1;

        while (contador <= 10) {
            if (contador == 5) {
                break;
            }

            System.out.println(contador);
            contador++;
        }
    }
}
```

Objetivo:

```text
ver como break interrompe o loop.
```

---

## Arquivo sugerido: `WhileContinue.java`

```java
public class WhileContinue {
    public static void main(String[] args) {
        int contador = 0;

        while (contador < 5) {
            contador++;

            if (contador == 3) {
                continue;
            }

            System.out.println(contador);
        }
    }
}
```

Objetivo:

```text
ver como continue pula uma iteração.
```

---

## Debug para while

Use debug neste exemplo:

```java
int contador = 1;

while (contador <= 3) {
    System.out.println(contador);
    contador++;
}
```

Coloque breakpoint na linha do `while`.

Observe:

```text
contador = 1;
contador = 2;
contador = 3;
contador = 4.
```

Quando `contador` vira 4, a condição:

```java
contador <= 3
```

fica falsa.

O loop termina.

Debug é uma das melhores formas de entender repetição.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-039-while docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 039: pratica while em Java"
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
explicar while;
criar while simples;
usar contador crescente;
usar contador decrescente;
explicar iteração;
explicar condição booleana;
explicar que while testa antes;
demonstrar zero iterações;
identificar loop infinito;
corrigir loop infinito com atualização;
usar contador dentro do while;
usar acumulador dentro do while;
usar valor sentinela;
usar Scanner com while;
criar menu simples com while;
usar switch dentro de while;
processar lote com while;
contar erros em lote;
controlar tentativas;
validar entrada com while;
aplicar while em estoque;
aplicar while em paginação;
aplicar while em mensageria;
aplicar while em auditoria;
entender break em nível inicial;
entender continue em nível inicial;
diagnosticar erros comuns;
debugar iterações;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `do while`.

Não precisa ainda dominar `for`.

Não precisa ainda dominar arrays.

Não precisa ainda dominar streams.

Não precisa ainda dominar concorrência ou filas reais.

Esses assuntos virão depois.

O objetivo é dominar repetição com condição antes da execução e evitar loop infinito.

---

## Fechamento da aula

Hoje o programa aprendeu a repetir.

Com `while`, conseguimos executar um bloco enquanto uma condição for verdadeira.

Isso abre caminho para:

```text
menus;
validações repetidas;
processamento de lotes;
tentativas;
contadores;
acumuladores;
paginação;
mensageria;
auditoria;
estoque;
integrações.
```

Também vimos o maior risco do `while`:

```text
loop infinito.
```

Todo `while` precisa responder:

```text
o que faz essa condição deixar de ser verdadeira?
```

Se não houver resposta, o loop provavelmente está errado.

Na próxima aula, vamos estudar `do while`.

Ele é parecido com `while`, mas tem uma diferença fundamental:

```text
executa primeiro e testa depois.
```

Isso será especialmente útil para menus e situações em que o bloco precisa rodar pelo menos uma vez.
