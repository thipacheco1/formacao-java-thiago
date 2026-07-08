# 040 — M1.20 — Do While

## Hoje a aula é sobre repetir depois de executar pelo menos uma vez

A ideia do `do while` é:

```text
faça primeiro;
depois pergunte se deve repetir.
```

Em Java:

```java
do {
    // bloco executado pelo menos uma vez
} while (condicao);
```

A palavra:

```java
do
```

significa:

```text
faça.
```

A palavra:

```java
while
```

significa:

```text
enquanto.
```

Juntas:

```text
faça o bloco enquanto a condição for verdadeira.
```

A diferença principal é a ordem.

No `while`:

```text
testa primeiro;
executa depois.
```

No `do while`:

```text
executa primeiro;
testa depois.
```

---

## Por que o do while existe

Algumas situações precisam acontecer ao menos uma vez.

Exemplos:

```text
mostrar um menu antes de perguntar a opção;
pedir um valor ao usuário antes de validar;
solicitar senha antes de decidir se repete;
mostrar opções antes de sair;
pedir confirmação antes de repetir operação;
coletar entrada antes de verificar se é válida;
executar uma tentativa antes de avaliar nova tentativa.
```

Um menu é o exemplo clássico.

Você não quer perguntar se deve mostrar o menu antes de mostrar o menu.

Você mostra o menu, lê a opção e depois decide:

```text
se a opção não for sair, mostra de novo.
```

Isso combina muito com `do while`.

---

## Estrutura do do while

Estrutura básica:

```java
do {
    // código executado
} while (condicao);
```

Exemplo:

```java
int contador = 1;

do {
    System.out.println(contador);
    contador++;
} while (contador <= 5);
```

Saída:

```text
1
2
3
4
5
```

Partes:

```text
do -> inicia o bloco;
bloco -> código executado pelo menos uma vez;
while -> condição de repetição;
condição -> se true, repete; se false, termina;
ponto e vírgula -> obrigatório no final.
```

Esse ponto e vírgula final é um detalhe importante:

```java
} while (condicao);
```

---

## Do while executa pelo menos uma vez

Exemplo:

```java
int contador = 10;

do {
    System.out.println("Contador: " + contador);
    contador++;
} while (contador <= 5);
```

Saída:

```text
Contador: 10
```

Mesmo com a condição falsa no final, o bloco executou uma vez.

Por quê?

Porque o teste acontece depois.

Esse é o comportamento essencial do `do while`.

---

## Comparação direta com while

### While

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

### Do while

```java
int contador = 10;

do {
    System.out.println(contador);
    contador++;
} while (contador <= 5);
```

Saída:

```text
10
```

O `do while` executa pelo menos uma vez.

Essa é a diferença que precisa ficar gravada.

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
        int contador = 1;

        do {
            System.out.println("Contador: " + contador);
            contador++;
        } while (contador <= 5);

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

Esse exemplo é simples.

Mas a grande utilidade do `do while` aparecerá nos menus e validações interativas.

---

## O ponto e vírgula final é obrigatório

No `do while`, esta linha termina com ponto e vírgula:

```java
} while (contador <= 5);
```

Esse `;` faz parte da sintaxe.

Errado:

```java
do {
    System.out.println(contador);
    contador++;
} while (contador <= 5)
```

Certo:

```java
do {
    System.out.println(contador);
    contador++;
} while (contador <= 5);
```

Esse é um erro comum de compilação.

---

## Do while com contador crescente

Arquivo:

```text
DoWhileCrescente.java
```

Código:

```java
public class DoWhileCrescente {
    public static void main(String[] args) {
        int contador = 1;

        do {
            System.out.println(contador);
            contador++;
        } while (contador <= 5);
    }
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

Esse exemplo é equivalente ao `while` crescente da aula anterior.

A diferença só aparece quando a condição começa falsa.

---

## Do while com condição inicialmente falsa

Arquivo:

```text
DoWhileExecutaUmaVez.java
```

Código:

```java
public class DoWhileExecutaUmaVez {
    public static void main(String[] args) {
        int contador = 10;

        do {
            System.out.println("Executou com contador: " + contador);
            contador++;
        } while (contador <= 5);

        System.out.println("Fim");
    }
}
```

Saída:

```text
Executou com contador: 10
Fim
```

Esse arquivo existe para provar o comportamento.

O `do while` sempre executa ao menos uma vez.

---

## Do while com contador decrescente

Arquivo:

```text
DoWhileDecrescente.java
```

Código:

```java
public class DoWhileDecrescente {
    public static void main(String[] args) {
        int contador = 5;

        do {
            System.out.println(contador);
            contador--;
        } while (contador >= 1);
    }
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

Assim como no `while`, a variável de controle precisa mudar na direção correta.

Se a condição depende de diminuir, use:

```java
contador--;
```

Se depende de aumentar, use:

```java
contador++;
```

---

## Do while com menu

O menu é o exemplo mais importante desta aula.

Arquivo:

```text
MenuDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class MenuDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;

        do {
            System.out.println("Menu");
            System.out.println("1 - Cadastrar");
            System.out.println("2 - Consultar");
            System.out.println("0 - Sair");
            System.out.println("Digite uma opção:");

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
        } while (opcao != 0);

        scanner.close();
    }
}
```

Esse menu executa pelo menos uma vez.

Depois repete enquanto a opção for diferente de zero.

---

## Por que do while combina com menu

No `while`, normalmente fazemos:

```java
int opcao = -1;

while (opcao != 0) {
    // mostra menu
    // lê opção
}
```

Precisamos inicializar `opcao` com um valor artificial para entrar no loop.

No `do while`, podemos fazer:

```java
int opcao;

do {
    // mostra menu
    // lê opção
} while (opcao != 0);
```

Isso é mais natural.

A opção ainda não existe antes do menu.

Ela será lida dentro do bloco.

Depois o programa decide se repete.

---

## Valor sentinela no do while

No menu, o valor sentinela é:

```text
0.
```

Sentinela significa:

```text
valor especial que indica parada.
```

Exemplo:

```java
do {
    // menu
    opcao = scanner.nextInt();
} while (opcao != 0);
```

Leitura:

```text
faça o menu enquanto a opção for diferente de 0.
```

Quando a opção é 0, a condição fica falsa e o loop termina.

---

## Do while com validação interativa

Outro uso muito importante: pedir novamente até o valor ser válido.

Arquivo:

```text
ValidacaoQuantidadeDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoQuantidadeDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade;

        do {
            System.out.println("Digite uma quantidade maior que zero:");
            quantidade = scanner.nextInt();

            if (quantidade <= 0) {
                System.out.println("Quantidade inválida");
            }
        } while (quantidade <= 0);

        System.out.println("Quantidade válida: " + quantidade);

        scanner.close();
    }
}
```

Aqui faz sentido usar `do while` porque precisamos pedir o valor pelo menos uma vez.

Depois validamos.

Se estiver inválido, repete.

---

## Do while com validação de texto

Arquivo:

```text
ValidacaoNomeDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoNomeDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome;

        do {
            System.out.println("Digite o nome do cliente:");
            nome = scanner.nextLine();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório");
            }
        } while (nome.isBlank());

        System.out.println("Nome informado: " + nome);

        scanner.close();
    }
}
```

Esse exemplo mostra validação interativa de texto.

O programa só segue quando o nome não estiver em branco.

---

## Do while com confirmação

Às vezes queremos repetir enquanto a pessoa responder sim.

Arquivo:

```text
ConfirmacaoDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class ConfirmacaoDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String continuar;

        do {
            System.out.println("Executando operação");

            System.out.println("Deseja executar novamente? S/N");
            continuar = scanner.nextLine().trim().toUpperCase();
        } while ("S".equals(continuar));

        System.out.println("Fim");

        scanner.close();
    }
}
```

Esse padrão é comum em programas de console.

A operação executa.

Depois o usuário decide se quer repetir.

---

## Padronização de entrada textual

No exemplo anterior usamos:

```java
continuar = scanner.nextLine().trim().toUpperCase();
```

Isso ajuda a aceitar entradas como:

```text
s
S
 s
S 
```

Todas viram:

```text
S.
```

Esse cuidado evita erro bobo de entrada.

Para comparação segura:

```java
"S".equals(continuar)
```

É melhor do que:

```java
continuar.equals("S")
```

porque evita erro se `continuar` for `null`.

Aqui ela não deve ser `null`, mas o hábito é bom.

---

## Do while com senha

Arquivo:

```text
SenhaDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class SenhaDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String senhaCorreta = "java123";
        String senhaInformada;
        int tentativas = 0;
        int limiteTentativas = 3;

        do {
            System.out.println("Digite a senha:");
            senhaInformada = scanner.nextLine();
            tentativas++;

            if (!senhaCorreta.equals(senhaInformada)) {
                System.out.println("Senha incorreta");
            }
        } while (!senhaCorreta.equals(senhaInformada) && tentativas < limiteTentativas);

        if (senhaCorreta.equals(senhaInformada)) {
            System.out.println("Acesso autorizado");
        } else {
            System.out.println("Acesso bloqueado");
        }

        scanner.close();
    }
}
```

Esse exemplo mostra:

```text
do while;
tentativas;
limite;
String;
equals;
condição composta.
```

A primeira tentativa sempre acontece.

Depois repete enquanto:

```text
senha estiver errada
E ainda houver tentativas.
```

---

## Condição composta no do while

Observe:

```java
while (!senhaCorreta.equals(senhaInformada) && tentativas < limiteTentativas);
```

A repetição continua se:

```text
a senha ainda está errada;
e o número de tentativas ainda está abaixo do limite.
```

Se a senha estiver correta, para.

Se atingir o limite, para.

Isso é regra de negócio.

A estrutura de repetição apenas executa a regra.

---

## Do while com pedido

Arquivo:

```text
PedidoDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class PedidoDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidadeItens;
        long valorTotalCentavos;

        do {
            System.out.println("Digite a quantidade de itens:");
            quantidadeItens = scanner.nextInt();

            if (quantidadeItens <= 0) {
                System.out.println("Quantidade deve ser maior que zero");
            }
        } while (quantidadeItens <= 0);

        do {
            System.out.println("Digite o valor total em centavos:");
            valorTotalCentavos = scanner.nextLong();

            if (valorTotalCentavos <= 0) {
                System.out.println("Valor total deve ser maior que zero");
            }
        } while (valorTotalCentavos <= 0);

        System.out.println("Pedido válido");
        System.out.println("Quantidade: " + quantidadeItens);
        System.out.println("Valor em centavos: " + valorTotalCentavos);

        scanner.close();
    }
}
```

Esse exemplo aplica `do while` em validação de pedido.

O programa não segue enquanto os dados principais estiverem inválidos.

---

## Do while com produto

Arquivo:

```text
ProdutoDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class ProdutoDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nomeProduto;
        int quantidadeEstoque;

        do {
            System.out.println("Digite o nome do produto:");
            nomeProduto = scanner.nextLine();

            if (nomeProduto.isBlank()) {
                System.out.println("Nome do produto é obrigatório");
            }
        } while (nomeProduto.isBlank());

        do {
            System.out.println("Digite a quantidade em estoque:");
            quantidadeEstoque = scanner.nextInt();

            if (quantidadeEstoque < 0) {
                System.out.println("Quantidade em estoque não pode ser negativa");
            }
        } while (quantidadeEstoque < 0);

        System.out.println("Produto válido");
        System.out.println("Nome: " + nomeProduto);
        System.out.println("Estoque: " + quantidadeEstoque);

        scanner.close();
    }
}
```

Esse exemplo reforça uma ideia importante:

```text
alguns campos não podem estar vazios;
alguns números não podem ser negativos.
```

`do while` é uma forma simples de insistir até a entrada ser válida.

---

## Do while com cliente

Arquivo:

```text
ClienteDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class ClienteDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String email;

        do {
            System.out.println("Digite o e-mail do cliente:");
            email = scanner.nextLine().trim();

            if (!email.contains("@")) {
                System.out.println("E-mail inválido");
            }
        } while (!email.contains("@"));

        System.out.println("E-mail válido: " + email);

        scanner.close();
    }
}
```

Esse exemplo é propositalmente simples.

Validação real de e-mail é mais complexa.

Aqui o objetivo é praticar repetição interativa.

---

## Do while com OS

Arquivo:

```text
OrdemServicoDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class OrdemServicoDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;

        do {
            System.out.println("Menu da OS");
            System.out.println("1 - Consultar OS");
            System.out.println("2 - Reagendar OS");
            System.out.println("3 - Registrar ocorrência");
            System.out.println("0 - Sair");
            System.out.println("Digite uma opção:");

            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    System.out.println("Consultando OS");
                    break;
                case 2:
                    System.out.println("Reagendando OS");
                    break;
                case 3:
                    System.out.println("Registrando ocorrência");
                    break;
                case 0:
                    System.out.println("Saindo do menu da OS");
                    break;
                default:
                    System.out.println("Opção inválida");
                    break;
            }
        } while (opcao != 0);

        scanner.close();
    }
}
```

Esse exemplo aplica menu interativo em domínio de ordem de serviço.

---

## Do while com mensageria

Arquivo:

```text
MensageriaDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class MensageriaDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;
        int mensagensEnviadas = 0;

        do {
            System.out.println("Menu de mensageria");
            System.out.println("1 - Enviar mensagem");
            System.out.println("2 - Ver total enviado");
            System.out.println("0 - Sair");

            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    mensagensEnviadas++;
                    System.out.println("Mensagem enviada");
                    break;
                case 2:
                    System.out.println("Mensagens enviadas: " + mensagensEnviadas);
                    break;
                case 0:
                    System.out.println("Encerrando mensageria");
                    break;
                default:
                    System.out.println("Opção inválida");
                    break;
            }
        } while (opcao != 0);

        scanner.close();
    }
}
```

Esse exemplo combina:

```text
do while;
menu;
switch;
contador.
```

---

## Do while com auditoria

Arquivo:

```text
AuditoriaDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class AuditoriaDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;
        int eventosRegistrados = 0;

        do {
            System.out.println("Menu de auditoria");
            System.out.println("1 - Registrar evento");
            System.out.println("2 - Exibir total");
            System.out.println("0 - Sair");

            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    eventosRegistrados++;
                    System.out.println("Evento registrado");
                    break;
                case 2:
                    System.out.println("Eventos registrados: " + eventosRegistrados);
                    break;
                case 0:
                    System.out.println("Encerrando auditoria");
                    break;
                default:
                    System.out.println("Opção inválida");
                    break;
            }
        } while (opcao != 0);

        scanner.close();
    }
}
```

Esse exemplo é semelhante ao de mensageria, mas aplicado a auditoria.

A repetição mantém o menu ativo até sair.

---

## Do while com switch moderno

Também podemos usar switch moderno.

Arquivo:

```text
MenuDoWhileSwitchModerno.java
```

Código:

```java
import java.util.Scanner;

public class MenuDoWhileSwitchModerno {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;

        do {
            System.out.println("Menu");
            System.out.println("1 - Criar pedido");
            System.out.println("2 - Consultar pedido");
            System.out.println("3 - Cancelar pedido");
            System.out.println("0 - Sair");

            opcao = scanner.nextInt();

            String mensagem = switch (opcao) {
                case 1 -> "Criar pedido";
                case 2 -> "Consultar pedido";
                case 3 -> "Cancelar pedido";
                case 0 -> "Sair";
                default -> "Opção inválida";
            };

            System.out.println(mensagem);
        } while (opcao != 0);

        scanner.close();
    }
}
```

Aqui usamos:

```text
do while;
Scanner;
switch moderno;
opção sair.
```

Esse padrão é limpo para menus simples.

---

## Cuidado com Scanner: nextInt e nextLine

Um erro comum em programas de console é misturar:

```java
nextInt()
```

com:

```java
nextLine()
```

Depois de `nextInt()`, fica uma quebra de linha pendente.

Exemplo problemático:

```java
int opcao = scanner.nextInt();
String nome = scanner.nextLine();
```

O `nextLine()` pode capturar a quebra de linha que sobrou.

Correção comum:

```java
int opcao = scanner.nextInt();
scanner.nextLine();

String nome = scanner.nextLine();
```

Esse detalhe não é exclusivo do `do while`, mas aparece muito em menus.

Quando misturar número e texto, fique atento.

---

## Exemplo com menu e texto

Arquivo:

```text
MenuCadastroClienteDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class MenuCadastroClienteDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;

        do {
            System.out.println("Menu Cliente");
            System.out.println("1 - Cadastrar cliente");
            System.out.println("0 - Sair");

            opcao = scanner.nextInt();
            scanner.nextLine();

            switch (opcao) {
                case 1:
                    System.out.println("Digite o nome do cliente:");
                    String nome = scanner.nextLine();

                    if (nome.isBlank()) {
                        System.out.println("Nome obrigatório");
                    } else {
                        System.out.println("Cliente cadastrado: " + nome);
                    }
                    break;
                case 0:
                    System.out.println("Saindo");
                    break;
                default:
                    System.out.println("Opção inválida");
                    break;
            }
        } while (opcao != 0);

        scanner.close();
    }
}
```

A linha:

```java
scanner.nextLine();
```

limpa a quebra de linha após o `nextInt()`.

---

## Do while versus while

Use `while` quando:

```text
talvez o bloco nem deva executar;
a condição precisa ser validada antes;
você já tem a condição antes do bloco;
processamento depende de existir algo previamente.
```

Exemplo:

```java
while (mensagensPendentes > 0) {
    enviarMensagem();
}
```

Use `do while` quando:

```text
o bloco deve executar ao menos uma vez;
você precisa pedir entrada antes de validar;
um menu precisa aparecer antes de ler a opção;
a decisão de repetir só existe depois da primeira execução.
```

Exemplo:

```java
do {
    mostrarMenu();
    lerOpcao();
} while (opcao != 0);
```

Na prática:

```text
menu interativo combina muito com do while.
```

---

## Nem todo menu precisa de do while

Apesar de combinar muito com menu, não é uma lei absoluta.

Um menu também pode ser feito com `while`.

Exemplo:

```java
int opcao = -1;

while (opcao != 0) {
    // menu
}
```

Funciona.

Mas quando o menu precisa aparecer pelo menos uma vez, `do while` costuma expressar melhor a intenção.

Código bom não é só funcionar.

É comunicar.

---

## Do while e loop infinito

`do while` também pode criar loop infinito.

Exemplo perigoso:

```java
int opcao = 1;

do {
    System.out.println("Menu");
} while (opcao != 0);
```

A opção nunca muda.

Se `opcao` começa 1, sempre será diferente de 0.

O loop nunca termina.

Correção:

```java
do {
    System.out.println("Digite uma opção:");
    opcao = scanner.nextInt();
} while (opcao != 0);
```

A variável da condição precisa ser atualizada.

---

## Do while com condição errada

Erro comum:

```java
do {
    System.out.println("Menu");
    opcao = scanner.nextInt();
} while (opcao == 0);
```

Se a intenção era repetir até digitar 0, a condição está invertida.

Com:

```java
while (opcao == 0)
```

o menu só repetiria quando a opção fosse 0.

O correto para menu com 0 para sair:

```java
while (opcao != 0)
```

Leia sempre em português:

```text
repita enquanto opção for diferente de 0.
```

---

## Do while com break

Também é possível usar `break`.

Exemplo:

```java
int contador = 1;

do {
    if (contador == 5) {
        break;
    }

    System.out.println(contador);
    contador++;
} while (contador <= 10);
```

Saída:

```text
1
2
3
4
```

Assim como no `while`, use `break` com cuidado.

No começo, prefira condição clara no `while`.

---

## Do while com continue

Também é possível usar `continue`.

Exemplo:

```java
int contador = 0;

do {
    contador++;

    if (contador == 3) {
        continue;
    }

    System.out.println(contador);
} while (contador < 5);
```

Saída:

```text
1
2
4
5
```

O `continue` pula o restante da iteração e volta para o teste da condição.

Use com cuidado.

---

## Erros comuns

### Erro 1 — Esquecer ponto e vírgula final

Errado:

```java
do {
    System.out.println("Olá");
} while (continuar)
```

Certo:

```java
do {
    System.out.println("Olá");
} while (continuar);
```

---

### Erro 2 — Não atualizar a variável da condição

Errado:

```java
int opcao = 1;

do {
    System.out.println("Menu");
} while (opcao != 0);
```

Causa loop infinito.

---

### Erro 3 — Inverter a condição de parada

Errado para menu com 0 para sair:

```java
} while (opcao == 0);
```

Certo:

```java
} while (opcao != 0);
```

---

### Erro 4 — Usar do while quando o bloco não deveria executar nenhuma vez

Se o processamento só deve acontecer quando houver pendência, talvez `while` seja melhor.

Exemplo:

```java
while (mensagensPendentes > 0) {
    // envia
}
```

Se `mensagensPendentes` for 0, não deve enviar nada.

`do while` executaria uma vez.

---

### Erro 5 — Esquecer que do while executa antes de validar

Exemplo:

```java
int quantidade = -10;

do {
    System.out.println("Processando quantidade " + quantidade);
} while (quantidade > 0);
```

Mesmo inválida, processa uma vez.

Se isso for ruim, use `while` ou valide antes.

---

### Erro 6 — Misturar nextInt e nextLine sem limpar buffer

Problemático:

```java
opcao = scanner.nextInt();
String nome = scanner.nextLine();
```

Correção:

```java
opcao = scanner.nextInt();
scanner.nextLine();
String nome = scanner.nextLine();
```

---

### Erro 7 — Criar menu sem opção de saída clara

Um menu deve ter uma saída.

Exemplo bom:

```text
0 - Sair
```

E condição:

```java
while (opcao != 0);
```

---

### Erro 8 — Não tratar opção inválida

Menu sem `default` pode ficar confuso.

Use:

```java
default:
    System.out.println("Opção inválida");
    break;
```

ou switch moderno com:

```java
default -> "Opção inválida";
```

---

### Erro 9 — Colocar lógica demais dentro do menu

Menu deve direcionar ações.

Se um `case` fica enorme, depois precisaremos extrair métodos.

Por enquanto, mantenha exemplos pequenos.

---

### Erro 10 — Não testar a primeira execução

Como `do while` sempre executa uma vez, teste o que acontece na primeira execução.

Exemplo:

```text
opção sair logo de primeira;
valor válido de primeira;
valor inválido de primeira;
entrada textual com espaços;
opção inválida no menu.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-040-do-while
cd labs\m1\aula-040-do-while
```

Crie arquivos:

```text
Main.java
DoWhileCrescente.java
DoWhileExecutaUmaVez.java
DoWhileDecrescente.java
MenuDoWhile.java
ValidacaoQuantidadeDoWhile.java
ValidacaoNomeDoWhile.java
ConfirmacaoDoWhile.java
SenhaDoWhile.java
PedidoDoWhile.java
ProdutoDoWhile.java
ClienteDoWhile.java
OrdemServicoDoWhile.java
MensageriaDoWhile.java
AuditoriaDoWhile.java
MenuDoWhileSwitchModerno.java
MenuCadastroClienteDoWhile.java
DoWhileBreak.java
DoWhileContinue.java
```

Compile:

```powershell
javac Main.java
javac DoWhileCrescente.java
javac DoWhileExecutaUmaVez.java
javac DoWhileDecrescente.java
javac MenuDoWhile.java
javac ValidacaoQuantidadeDoWhile.java
javac ValidacaoNomeDoWhile.java
javac ConfirmacaoDoWhile.java
javac SenhaDoWhile.java
javac PedidoDoWhile.java
javac ProdutoDoWhile.java
javac ClienteDoWhile.java
javac OrdemServicoDoWhile.java
javac MensageriaDoWhile.java
javac AuditoriaDoWhile.java
javac MenuDoWhileSwitchModerno.java
javac MenuCadastroClienteDoWhile.java
javac DoWhileBreak.java
javac DoWhileContinue.java
```

Execute:

```powershell
java Main
java DoWhileCrescente
java DoWhileExecutaUmaVez
java DoWhileDecrescente
java MenuDoWhile
java ValidacaoQuantidadeDoWhile
java ValidacaoNomeDoWhile
java ConfirmacaoDoWhile
java SenhaDoWhile
java PedidoDoWhile
java ProdutoDoWhile
java ClienteDoWhile
java OrdemServicoDoWhile
java MensageriaDoWhile
java AuditoriaDoWhile
java MenuDoWhileSwitchModerno
java MenuCadastroClienteDoWhile
java DoWhileBreak
java DoWhileContinue
```

Depois quebre erros de propósito e registre no diário.

---

## Arquivo sugerido: `DoWhileBreak.java`

```java
public class DoWhileBreak {
    public static void main(String[] args) {
        int contador = 1;

        do {
            if (contador == 5) {
                break;
            }

            System.out.println(contador);
            contador++;
        } while (contador <= 10);
    }
}
```

Objetivo:

```text
ver como break interrompe um do while.
```

---

## Arquivo sugerido: `DoWhileContinue.java`

```java
public class DoWhileContinue {
    public static void main(String[] args) {
        int contador = 0;

        do {
            contador++;

            if (contador == 3) {
                continue;
            }

            System.out.println(contador);
        } while (contador < 5);
    }
}
```

Objetivo:

```text
ver como continue pula uma iteração no do while.
```

---

## Debug para do while

Use debug neste exemplo:

```java
int opcao;

do {
    System.out.println("Menu");
    opcao = 0;
} while (opcao != 0);
```

Coloque breakpoint dentro do bloco.

Observe:

```text
o bloco executa;
opcao recebe 0;
a condição é testada;
como opcao != 0 é false, o loop termina.
```

Compare com `while`:

```java
int opcao = 0;

while (opcao != 0) {
    System.out.println("Menu");
}
```

Nesse caso, o bloco nem executa.

O debug deixa a diferença muito clara.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-040-do-while docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 040: pratica do while em Java"
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
explicar do while;
criar do while simples;
explicar que executa ao menos uma vez;
comparar while com do while;
usar contador crescente;
usar contador decrescente;
criar menu com do while;
usar opção sair;
usar valor sentinela;
usar Scanner com do while;
usar switch tradicional dentro do do while;
usar switch moderno dentro do do while;
validar quantidade com do while;
validar texto com do while;
validar senha com limite de tentativas;
aplicar do while em pedido;
aplicar do while em produto;
aplicar do while em cliente;
aplicar do while em OS;
aplicar do while em mensageria;
aplicar do while em auditoria;
entender ponto e vírgula final;
evitar loop infinito;
tratar opção inválida;
entender cuidado com nextInt e nextLine;
entender break em nível inicial;
entender continue em nível inicial;
diagnosticar erros comuns;
debugar primeira execução;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `for`.

Não precisa ainda dominar arrays.

Não precisa ainda dominar métodos.

Não precisa ainda dominar menus profissionais com arquitetura.

Esses assuntos virão depois.

O objetivo é dominar a repetição que executa primeiro e testa depois, principalmente em menus e validações interativas.

---

## Fechamento da aula

Hoje estudamos `do while`.

Ele é parecido com `while`, mas tem uma diferença decisiva:

```text
o bloco executa pelo menos uma vez.
```

Isso torna o `do while` muito útil para:

```text
menus;
opção sair;
validação interativa;
pedido de senha;
confirmação de repetição;
entrada obrigatória;
fluxos de console.
```

Vimos também os riscos:

```text
esquecer ponto e vírgula;
não atualizar a variável da condição;
inverter a condição de parada;
usar do while quando o bloco não deveria executar;
misturar nextInt e nextLine sem cuidado.
```

A pergunta central para escolher entre `while` e `do while` é:

```text
eu preciso testar antes ou executar pelo menos uma vez?
```

Se precisa testar antes, use `while`.

Se precisa executar primeiro, `do while` pode ser a melhor escolha.

Na próxima aula, vamos estudar `for` clássico.

Com ele, vamos organizar loops controlados por contador em uma sintaxe mais compacta e muito usada no Java.
