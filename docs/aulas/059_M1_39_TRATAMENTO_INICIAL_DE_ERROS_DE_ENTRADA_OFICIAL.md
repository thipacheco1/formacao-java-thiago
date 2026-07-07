# 059 — M1.39 — Tratamento Inicial de Erros de Entrada

## Onde estamos na formação

Estamos no Módulo 1, depois de métodos, escopo e passagem de valores.

A sequência recente foi:

```text
055 — M1.35 — Métodos com parâmetros;
056 — M1.36 — Sobrecarga de métodos inicial;
057 — M1.37 — Escopo de variáveis;
058 — M1.38 — Passagem de valores e referências;
059 — M1.39 — Tratamento inicial de erros de entrada.
```

Até agora, usamos bastante `Scanner`.

Exemplo:

```java
Scanner scanner = new Scanner(System.in);

System.out.println("Digite uma quantidade:");
int quantidade = scanner.nextInt();
```

Isso funciona quando o usuário digita um número inteiro.

Mas e se o usuário digitar:

```text
abc
```

em vez de:

```text
10
```

O programa quebra.

O Java lança uma exceção chamada:

```text
InputMismatchException.
```

Nesta aula, vamos aprender o tratamento inicial desse problema.

O objetivo ainda não é dominar exceções profundamente.

O objetivo é saber:

```text
por que o programa quebra;
o que é InputMismatchException;
o que é try/catch;
como capturar erro básico;
como limpar a entrada inválida;
como pedir o dado novamente;
como criar métodos simples de leitura segura;
como não esconder erro com código ruim.
```

---

## Hoje a aula é sobre entrada inválida

Entrada inválida acontece quando o programa espera um tipo de dado, mas o usuário digita outro.

Exemplo:

```text
programa espera int;
usuário digita "abc".
```

Ou:

```text
programa espera long;
usuário digita "dez".
```

Ou:

```text
programa espera double;
usuário digita texto inválido.
```

Com `Scanner`, isso geralmente aparece em métodos como:

```java
nextInt()
nextLong()
nextDouble()
```

Se o texto digitado não pode ser convertido para o tipo esperado, acontece:

```text
InputMismatchException.
```

Esse erro não é bug do Java.

É o Java dizendo:

```text
você pediu um tipo, mas a entrada não combina com esse tipo.
```

---

## O que é InputMismatchException

`InputMismatchException` é uma exceção que ocorre quando o `Scanner` encontra um dado incompatível com o tipo solicitado.

Exemplo:

```java
int idade = scanner.nextInt();
```

Entrada esperada:

```text
10
25
100
```

Entrada problemática:

```text
abc
dez
10.5
```

Se o usuário digitar `abc`, o `Scanner` não consegue entregar um `int`.

Então lança:

```text
InputMismatchException.
```

Para usar essa exceção diretamente, importamos:

```java
import java.util.InputMismatchException;
```

---

## O que é exceção

Exceção é uma situação anormal durante a execução do programa.

Não é sempre erro de compilação.

O código pode compilar perfeitamente, mas quebrar durante a execução.

Exemplo:

```java
int quantidade = scanner.nextInt();
```

Esse código compila.

Mas pode quebrar em tempo de execução se o usuário digitar texto.

Então temos dois mundos:

```text
erro de compilação -> Java nem gera o programa;
erro de execução -> programa inicia, mas quebra durante o uso.
```

`InputMismatchException` é erro de execução.

---

## O que é try/catch

`try/catch` é uma estrutura para tentar executar um bloco e capturar uma exceção caso ela aconteça.

Formato básico:

```java
try {
    // código que pode gerar erro
} catch (InputMismatchException erro) {
    // código executado se esse erro acontecer
}
```

Tradução mental:

```text
tente fazer isso;
se der InputMismatchException, faça aquilo.
```

Exemplo:

```java
try {
    int quantidade = scanner.nextInt();
    System.out.println("Quantidade: " + quantidade);
} catch (InputMismatchException erro) {
    System.out.println("Entrada inválida. Digite um número inteiro.");
}
```

---

## try não significa que o erro sumiu

`try/catch` não apaga o problema.

Ele permite responder ao problema de forma controlada.

Sem `try/catch`, o programa quebra e mostra pilha de erro.

Com `try/catch`, podemos mostrar mensagem amigável:

```text
Entrada inválida. Digite um número inteiro.
```

Mas o dado continua inválido.

Por isso, muitas vezes precisamos:

```text
capturar erro;
limpar entrada inválida;
pedir novamente.
```

Essa recuperação é o foco da aula.

---

## Vocabulário essencial

Termos desta aula:

```text
entrada;
entrada inválida;
Scanner;
nextInt;
nextLong;
nextDouble;
nextLine;
InputMismatchException;
exceção;
try;
catch;
tratamento de erro;
recuperação;
buffer;
limpar entrada;
loop de leitura;
repetir até válido;
mensagem amigável;
falha de execução;
validação;
tipo esperado;
tipo recebido;
import;
erro controlado;
erro não tratado.
```

Termos mais importantes:

```text
InputMismatchException -> erro quando Scanner recebe tipo incompatível;
try -> bloco onde colocamos código que pode falhar;
catch -> bloco que captura e trata uma exceção;
recuperação -> continuar o programa depois de uma entrada inválida;
buffer -> entrada pendente que ainda precisa ser consumida;
scanner.nextLine() -> usado para consumir a linha inválida em muitos cenários;
loop de leitura -> repetição até o usuário informar dado válido.
```

---

## Primeiro problema: programa quebrando

Arquivo:

```text
EntradaSemTratamento.java
```

Código:

```java
import java.util.Scanner;

public class EntradaSemTratamento {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite uma quantidade:");
        int quantidade = scanner.nextInt();

        System.out.println("Quantidade informada: " + quantidade);

        scanner.close();
    }
}
```

Compile:

```powershell
javac EntradaSemTratamento.java
```

Execute:

```powershell
java EntradaSemTratamento
```

Digite:

```text
abc
```

Resultado esperado:

```text
o programa quebra com InputMismatchException.
```

Esse é o problema que vamos resolver.

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        try {
            System.out.println("Digite uma quantidade:");
            int quantidade = scanner.nextInt();

            System.out.println("Quantidade informada: " + quantidade);
        } catch (InputMismatchException erro) {
            System.out.println("Entrada inválida. Digite um número inteiro.");
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
10
```

Depois teste com:

```text
abc
```

Com `abc`, o programa não deve quebrar com pilha de erro.

Ele deve exibir:

```text
Entrada inválida. Digite um número inteiro.
```

Esse é o primeiro passo.

---

## Entendendo o fluxo do try/catch

Código:

```java
try {
    int quantidade = scanner.nextInt();
    System.out.println("Quantidade informada: " + quantidade);
} catch (InputMismatchException erro) {
    System.out.println("Entrada inválida.");
}
```

Se o usuário digita:

```text
10
```

acontece:

```text
entra no try;
lê quantidade;
imprime quantidade;
não entra no catch.
```

Se o usuário digita:

```text
abc
```

acontece:

```text
entra no try;
tenta ler int;
falha;
pula para o catch;
imprime mensagem de erro.
```

Depois do `catch`, o programa continua após o bloco.

---

## O catch recebe o erro

Neste trecho:

```java
catch (InputMismatchException erro) {
```

`erro` é uma variável que representa a exceção capturada.

Nesta fase, não precisamos explorar tudo o que ela tem.

Mas podemos usar:

```java
erro.getMessage()
```

em alguns casos.

Para usuário final, normalmente mostramos mensagem amigável.

Exemplo:

```java
System.out.println("Entrada inválida. Digite um número inteiro.");
```

Não é bom mostrar mensagem técnica para usuário comum.

---

## Mensagem técnica versus mensagem amigável

Mensagem técnica:

```text
java.util.InputMismatchException
```

Mensagem amigável:

```text
Entrada inválida. Digite um número inteiro.
```

Em sistemas reais, muitas vezes fazemos os dois:

```text
mensagem amigável para o usuário;
detalhe técnico em log.
```

Nesta fase, vamos focar na mensagem amigável.

Exemplo:

```java
System.out.println("Quantidade inválida. Informe apenas números inteiros.");
```

---

## Segundo problema: recuperar e pedir novamente

O primeiro `try/catch` apenas evita quebrar.

Mas ele não pede novamente.

Exemplo:

```java
try {
    int quantidade = scanner.nextInt();
} catch (InputMismatchException erro) {
    System.out.println("Entrada inválida.");
}
```

Se o usuário digita errado, o programa exibe erro e termina.

Melhor:

```text
se errar, pedir de novo.
```

Para isso, usamos loop.

---

## Entrada segura com while

Arquivo:

```text
LerInteiroComWhile.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class LerInteiroComWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        boolean entradaValida = false;
        int quantidade = 0;

        while (!entradaValida) {
            try {
                System.out.println("Digite uma quantidade:");
                quantidade = scanner.nextInt();

                entradaValida = true;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }

        System.out.println("Quantidade final: " + quantidade);

        scanner.close();
    }
}
```

Aqui temos recuperação.

Se o usuário digita inválido, o programa avisa e volta a pedir.

---

## Por que usar scanner.nextLine no catch

Quando o usuário digita:

```text
abc
```

e o `nextInt()` falha, esse texto inválido pode continuar pendente no `Scanner`.

Se não consumirmos essa entrada, o loop pode ficar repetindo o mesmo erro sem deixar o usuário digitar novamente.

Por isso, dentro do `catch`, usamos:

```java
scanner.nextLine();
```

para consumir a entrada inválida.

Pense assim:

```text
deu erro lendo int;
limpe a linha problemática;
peça novamente.
```

Esse é um dos pontos mais importantes da aula.

---

## Loop infinito por não limpar entrada

Arquivo:

```text
ErroNaoLimparEntrada.java
```

Código propositalmente problemático:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class ErroNaoLimparEntrada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        boolean entradaValida = false;
        int quantidade = 0;

        while (!entradaValida) {
            try {
                System.out.println("Digite uma quantidade:");
                quantidade = scanner.nextInt();

                entradaValida = true;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida.");
            }
        }

        System.out.println("Quantidade: " + quantidade);

        scanner.close();
    }
}
```

Se digitar:

```text
abc
```

pode entrar em repetição de erro.

Correção:

```java
scanner.nextLine();
```

dentro do `catch`.

---

## Método para ler inteiro

Agora vamos organizar em método.

Arquivo:

```text
MetodoLerInteiro.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class MetodoLerInteiro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade = lerInteiro(scanner, "Digite uma quantidade:");

        System.out.println("Quantidade: " + quantidade);

        scanner.close();
    }

    public static int lerInteiro(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }
}
```

Esse método é muito importante.

Ele encapsula a leitura segura de inteiro.

O `while (true)` funciona porque o método só sai quando retorna valor válido.

---

## Entendendo o método lerInteiro

Assinatura:

```java
public static int lerInteiro(Scanner scanner, String mensagem)
```

Ele recebe:

```text
scanner;
mensagem a ser exibida.
```

Ele retorna:

```text
um int válido.
```

Dentro:

```java
while (true)
```

repete até conseguir retornar.

Quando `nextInt()` funciona:

```java
return valor;
```

Quando dá erro:

```java
catch
```

mostra mensagem, limpa entrada e tenta novamente.

---

## Por que passar Scanner como parâmetro

Poderíamos criar `Scanner` dentro do método, mas isso não é ideal nesta fase.

Melhor:

```java
Scanner scanner = new Scanner(System.in);

int valor = lerInteiro(scanner, "Digite valor:");
```

E o método recebe:

```java
public static int lerInteiro(Scanner scanner, String mensagem)
```

Assim usamos um único `Scanner` no programa.

Evite criar vários `Scanner` para `System.in` sem necessidade.

---

## Método para ler long

Arquivo:

```text
MetodoLerLong.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class MetodoLerLong {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long valorCentavos = lerLong(scanner, "Digite o valor em centavos:");

        System.out.println("Valor informado: " + valorCentavos);

        scanner.close();
    }

    public static long lerLong(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                long valor = scanner.nextLong();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro longo.");

                scanner.nextLine();
            }
        }
    }
}
```

Use `long` para:

```text
valores monetários em centavos;
identificadores maiores;
totais acumulados.
```

---

## Método para ler double

Arquivo:

```text
MetodoLerDouble.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class MetodoLerDouble {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double media = lerDouble(scanner, "Digite a média:");

        System.out.println("Média informada: " + media);

        scanner.close();
    }

    public static double lerDouble(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                double valor = scanner.nextDouble();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número decimal.");

                scanner.nextLine();
            }
        }
    }
}
```

Atenção:

```text
em alguns ambientes, o separador decimal pode depender da configuração regional.
```

Nesta aula, o foco é o tratamento inicial do erro.

---

## Validação de regra depois da leitura

`try/catch` trata tipo inválido.

Mas ainda precisamos validar regra de negócio.

Exemplo:

```text
o usuário digitou um número inteiro;
mas o número é negativo.
```

Isso não gera `InputMismatchException`.

É entrada do tipo certo, mas regra inválida.

Exemplo:

```java
int quantidade = lerInteiro(scanner, "Digite quantidade:");

while (quantidade <= 0) {
    System.out.println("Quantidade deve ser maior que zero.");
    quantidade = lerInteiro(scanner, "Digite quantidade:");
}
```

Diferença:

```text
try/catch -> trata tipo incompatível;
validação -> trata valor fora da regra.
```

---

## Método para ler inteiro positivo

Arquivo:

```text
MetodoLerInteiroPositivo.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class MetodoLerInteiroPositivo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade = lerInteiroPositivo(scanner, "Digite uma quantidade positiva:");

        System.out.println("Quantidade: " + quantidade);

        scanner.close();
    }

    public static int lerInteiroPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                if (valor > 0) {
                    return valor;
                }

                System.out.println("Valor inválido. Digite número maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }
}
```

Esse método combina:

```text
tratamento de tipo inválido;
validação de regra;
recuperação.
```

---

## Método para ler long positivo

Arquivo:

```text
MetodoLerLongPositivo.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class MetodoLerLongPositivo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long valorCentavos = lerLongPositivo(scanner, "Digite o valor em centavos:");

        System.out.println("Valor: " + valorCentavos);

        scanner.close();
    }

    public static long lerLongPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                long valor = scanner.nextLong();
                scanner.nextLine();

                if (valor > 0) {
                    return valor;
                }

                System.out.println("Valor inválido. Digite valor maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }
}
```

Esse padrão será usado em pagamento e pedido.

---

## Tratamento com nextLine para texto

Para `String`, normalmente usamos:

```java
scanner.nextLine()
```

Ele não gera `InputMismatchException` por tipo, porque qualquer entrada pode ser texto.

Mas ainda precisamos validar regra.

Exemplo:

```java
String cliente = scanner.nextLine().trim();

if (cliente.isBlank()) {
    System.out.println("Cliente obrigatório.");
}
```

Texto inválido não é erro de tipo.

É erro de regra.

---

## Método para ler texto obrigatório

Arquivo:

```text
MetodoLerTextoObrigatorio.java
```

Código:

```java
import java.util.Scanner;

public class MetodoLerTextoObrigatorio {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = lerTextoObrigatorio(scanner, "Digite o nome do cliente:");

        System.out.println("Cliente: " + cliente);

        scanner.close();
    }

    public static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);

            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Campo obrigatório. Digite um texto válido.");
        }
    }
}
```

Aqui não usamos `try/catch`.

Para texto obrigatório, usamos validação.

---

## Lendo status válido

Arquivo:

```text
MetodoLerStatusValido.java
```

Código:

```java
import java.util.Scanner;

public class MetodoLerStatusValido {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String status = lerStatusValido(scanner, "Digite o status:");

        System.out.println("Status: " + status);

        scanner.close();
    }

    public static String lerStatusValido(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: PENDENTE, APROVADO, RECUSADO ou CANCELADO");

            String status = scanner.nextLine().trim().toUpperCase();

            if (statusValido(status)) {
                return status;
            }

            System.out.println("Status inválido.");
        }
    }

    public static boolean statusValido(String status) {
        return "PENDENTE".equals(status)
                || "APROVADO".equals(status)
                || "RECUSADO".equals(status)
                || "CANCELADO".equals(status);
    }
}
```

Esse exemplo combina:

```text
leitura textual;
normalização;
validação;
método boolean;
recuperação.
```

---

## Exemplo aplicado: cadastro de pedido

Arquivo:

```text
CadastroPedidoSeguro.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CadastroPedidoSeguro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = lerTextoObrigatorio(scanner, "Digite o cliente:");
        long valorCentavos = lerLongPositivo(scanner, "Digite o valor em centavos:");
        String status = lerStatusValido(scanner, "Digite o status do pedido:");

        System.out.println("Pedido cadastrado:");
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);

        scanner.close();
    }

    public static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);

            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Campo obrigatório.");
        }
    }

    public static long lerLongPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                long valor = scanner.nextLong();
                scanner.nextLine();

                if (valor > 0) {
                    return valor;
                }

                System.out.println("Valor deve ser maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }

    public static String lerStatusValido(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: PENDENTE, APROVADO, RECUSADO ou CANCELADO");

            String status = scanner.nextLine().trim().toUpperCase();

            if (statusValido(status)) {
                return status;
            }

            System.out.println("Status inválido.");
        }
    }

    public static boolean statusValido(String status) {
        return "PENDENTE".equals(status)
                || "APROVADO".equals(status)
                || "RECUSADO".equals(status)
                || "CANCELADO".equals(status);
    }
}
```

Esse é um exemplo central.

Ele junta:

```text
texto obrigatório;
long positivo;
status válido;
try/catch;
recuperação.
```

---

## Exemplo aplicado: produto

Arquivo:

```text
CadastroProdutoSeguro.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CadastroProdutoSeguro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Digite o nome do produto:");
        int estoque = lerInteiroNaoNegativo(scanner, "Digite o estoque:");
        String status = lerStatusProduto(scanner, "Digite o status do produto:");

        System.out.println("Produto cadastrado:");
        System.out.println("Nome: " + nome);
        System.out.println("Estoque: " + estoque);
        System.out.println("Status: " + status);

        scanner.close();
    }

    public static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);

            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Campo obrigatório.");
        }
    }

    public static int lerInteiroNaoNegativo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                if (valor >= 0) {
                    return valor;
                }

                System.out.println("Valor não pode ser negativo.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }

    public static String lerStatusProduto(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: ATIVO ou INATIVO");

            String status = scanner.nextLine().trim().toUpperCase();

            if ("ATIVO".equals(status) || "INATIVO".equals(status)) {
                return status;
            }

            System.out.println("Status inválido.");
        }
    }
}
```

Esse exemplo aplica erro de entrada em produto.

---

## Exemplo aplicado: pagamento

Arquivo:

```text
CadastroPagamentoSeguro.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CadastroPagamentoSeguro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long valorCentavos = lerLongPositivo(scanner, "Digite o valor em centavos:");
        int parcelas = lerInteiroPositivo(scanner, "Digite a quantidade de parcelas:");

        long valorParcela = valorCentavos / parcelas;

        System.out.println("Pagamento:");
        System.out.println("Valor total: " + valorCentavos);
        System.out.println("Parcelas: " + parcelas);
        System.out.println("Valor da parcela: " + valorParcela);

        scanner.close();
    }

    public static long lerLongPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                long valor = scanner.nextLong();
                scanner.nextLine();

                if (valor > 0) {
                    return valor;
                }

                System.out.println("Valor deve ser maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }

    public static int lerInteiroPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                if (valor > 0) {
                    return valor;
                }

                System.out.println("Valor deve ser maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }
}
```

Aqui evitamos:

```text
parcelas zero;
valor negativo;
texto onde deveria ser número.
```

---

## Exemplo aplicado: OS

Arquivo:

```text
CadastroOsSeguro.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CadastroOsSeguro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String certificado = lerTextoObrigatorio(scanner, "Digite o certificado da OS:");
        int atividades = lerInteiroPositivo(scanner, "Digite a quantidade de atividades:");
        String status = lerStatusOs(scanner, "Digite o status da OS:");

        System.out.println("OS:");
        System.out.println("Certificado: " + certificado);
        System.out.println("Atividades: " + atividades);
        System.out.println("Status: " + status);

        scanner.close();
    }

    public static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);

            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Campo obrigatório.");
        }
    }

    public static int lerInteiroPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                if (valor > 0) {
                    return valor;
                }

                System.out.println("Valor deve ser maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }

    public static String lerStatusOs(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: ABERTA, AGENDADA, CONCLUIDA ou CANCELADA");

            String status = scanner.nextLine().trim().toUpperCase();

            if ("ABERTA".equals(status)
                    || "AGENDADA".equals(status)
                    || "CONCLUIDA".equals(status)
                    || "CANCELADA".equals(status)) {
                return status;
            }

            System.out.println("Status inválido.");
        }
    }
}
```

Esse exemplo aplica validação de OS.

---

## Exemplo aplicado: mensageria

Arquivo:

```text
CadastroMensagemSeguro.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CadastroMensagemSeguro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = lerTextoObrigatorio(scanner, "Digite o cliente:");
        String tipo = lerTipoMensagem(scanner, "Digite o tipo de mensagem:");
        int tentativas = lerInteiroNaoNegativo(scanner, "Digite a quantidade de tentativas:");

        System.out.println("Mensagem:");
        System.out.println("Cliente: " + cliente);
        System.out.println("Tipo: " + tipo);
        System.out.println("Tentativas: " + tentativas);

        scanner.close();
    }

    public static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);

            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Campo obrigatório.");
        }
    }

    public static String lerTipoMensagem(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: BOAS_VINDAS, ENTREGA, NPS");

            String tipo = scanner.nextLine().trim().toUpperCase();

            if ("BOAS_VINDAS".equals(tipo)
                    || "ENTREGA".equals(tipo)
                    || "NPS".equals(tipo)) {
                return tipo;
            }

            System.out.println("Tipo inválido.");
        }
    }

    public static int lerInteiroNaoNegativo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                if (valor >= 0) {
                    return valor;
                }

                System.out.println("Valor não pode ser negativo.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }
}
```

Esse exemplo aplica entrada segura em mensageria.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
CadastroAuditoriaSeguro.java
```

Código:

```java
import java.util.Scanner;

public class CadastroAuditoriaSeguro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String usuario = lerTextoObrigatorio(scanner, "Digite o usuário:");
        String operacao = lerOperacao(scanner, "Digite a operação:");
        String status = lerStatusAuditoria(scanner, "Digite o status:");

        System.out.println("Auditoria:");
        System.out.println(usuario + " | " + operacao + " | " + status);

        scanner.close();
    }

    public static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);

            String texto = scanner.nextLine().trim();

            if (!texto.isBlank()) {
                return texto;
            }

            System.out.println("Campo obrigatório.");
        }
    }

    public static String lerOperacao(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: CRIACAO, EDICAO, EXCLUSAO");

            String operacao = scanner.nextLine().trim().toUpperCase();

            if ("CRIACAO".equals(operacao)
                    || "EDICAO".equals(operacao)
                    || "EXCLUSAO".equals(operacao)) {
                return operacao;
            }

            System.out.println("Operação inválida.");
        }
    }

    public static String lerStatusAuditoria(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            System.out.println("Opções: SUCESSO ou ERRO");

            String status = scanner.nextLine().trim().toUpperCase();

            if ("SUCESSO".equals(status) || "ERRO".equals(status)) {
                return status;
            }

            System.out.println("Status inválido.");
        }
    }
}
```

Nesse exemplo, tudo é texto.

Então o tratamento principal é validação, não `InputMismatchException`.

---

## try/catch dentro do método de leitura

Um bom padrão inicial é deixar o `try/catch` dentro de métodos específicos de leitura.

Exemplo:

```java
int quantidade = lerInteiroPositivo(scanner, "Digite quantidade:");
```

O `main` fica limpo.

O detalhe técnico fica no método:

```java
try {
    int valor = scanner.nextInt();
} catch (InputMismatchException erro) {
    scanner.nextLine();
}
```

Isso organiza responsabilidades:

```text
main -> fluxo da aplicação;
método de leitura -> recuperação de entrada;
método de validação -> regra de negócio.
```

---

## Não exagerar no try/catch

Evite colocar o programa inteiro dentro de um único `try/catch` gigante.

Ruim:

```java
try {
    // programa inteiro aqui dentro
} catch (Exception erro) {
    System.out.println("Erro");
}
```

Problemas:

```text
esconde onde o erro aconteceu;
captura coisas demais;
dificulta diagnóstico;
mistura responsabilidades;
pode mascarar bug.
```

Nesta fase, prefira tratar o ponto de risco:

```text
leitura numérica com Scanner.
```

---

## Por que evitar catch Exception nesta fase

`Exception` é muito genérico.

Exemplo:

```java
catch (Exception erro) {
    System.out.println("Erro");
}
```

Isso captura muitos tipos de problema.

Pode esconder erro de programação.

Nesta aula, o foco é:

```java
catch (InputMismatchException erro)
```

Porque sabemos qual erro queremos tratar:

```text
entrada incompatível com o tipo esperado.
```

Regra inicial:

```text
capture o erro que você sabe tratar.
```

---

## Erros comuns

### Erro 1 — Não importar InputMismatchException

Se usar:

```java
catch (InputMismatchException erro)
```

precisa importar:

```java
import java.util.InputMismatchException;
```

Ou usar nome completo, mas nesta fase prefira importar.

---

### Erro 2 — Não limpar entrada inválida

Dentro do `catch`, use:

```java
scanner.nextLine();
```

para consumir a entrada problemática.

---

### Erro 3 — Achar que try/catch valida regra de negócio

`try/catch` trata erro de tipo.

Regra como:

```text
valor maior que zero
status válido
campo obrigatório
```

precisa de validação.

---

### Erro 4 — Usar catch genérico demais

Evite:

```java
catch (Exception erro)
```

sem necessidade.

---

### Erro 5 — Engolir erro sem mensagem

Ruim:

```java
catch (InputMismatchException erro) {
}
```

O usuário não sabe o que aconteceu.

---

### Erro 6 — Criar vários Scanners para System.in

Prefira criar um `Scanner` no `main` e passar para métodos.

---

### Erro 7 — Misturar nextInt e nextLine sem limpar linha

Depois de `nextInt`, `nextLong` ou `nextDouble`, use:

```java
scanner.nextLine();
```

quando em seguida for ler texto com `nextLine`.

---

### Erro 8 — Loop sem saída

Se o loop nunca retorna ou nunca muda condição, pode ficar infinito.

---

### Erro 9 — Mensagem de erro genérica demais

Ruim:

```text
Erro.
```

Melhor:

```text
Entrada inválida. Digite um número inteiro.
```

---

### Erro 10 — Repetir try/catch em todo lugar

Melhor criar método reutilizável:

```java
lerInteiroPositivo(...)
lerLongPositivo(...)
lerTextoObrigatorio(...)
```

---

## Diagnóstico de erro de entrada

Quando o programa quebrar ou travar, siga o roteiro.

### 1. O erro é InputMismatchException?

Veja se o problema aconteceu em:

```java
nextInt()
nextLong()
nextDouble()
```

### 2. O usuário digitou tipo incompatível?

Exemplo:

```text
abc onde era int.
```

### 3. Existe try/catch no ponto certo?

O `nextInt()` precisa estar dentro do `try`.

### 4. O catch está capturando InputMismatchException?

Verifique:

```java
catch (InputMismatchException erro)
```

### 5. A entrada inválida está sendo limpa?

Verifique:

```java
scanner.nextLine();
```

dentro do catch.

### 6. O loop tem condição de saída?

Ou o método usa `return` quando valor válido é lido?

### 7. O valor lido passa pela regra de negócio?

Exemplo:

```text
maior que zero.
```

### 8. Está misturando número e texto?

Use `scanner.nextLine()` após leitura numérica.

### 9. A mensagem para o usuário é clara?

Diga o que ele deve digitar.

### 10. Use debug

Acompanhe:

```text
tentativa de leitura;
entrada inválida;
catch;
limpeza;
nova tentativa.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Sem try/catch

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int valor = scanner.nextInt();

        System.out.println(valor);

        scanner.close();
    }
}
```

Digite:

```text
abc
```

Observe o erro.

---

### Teste 2 — try/catch sem limpar entrada

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                int valor = scanner.nextInt();

                System.out.println(valor);
                break;
            } catch (InputMismatchException erro) {
                System.out.println("Inválido");
            }
        }

        scanner.close();
    }
}
```

Digite:

```text
abc
```

Depois corrija com:

```java
scanner.nextLine();
```

---

### Teste 3 — try/catch para regra de negócio

```java
int valor = lerInteiro(scanner, "Digite valor:");
```

Digite:

```text
-10
```

Veja que `-10` é `int`.

Não gera `InputMismatchException`.

Você precisa validar:

```java
valor > 0
```

---

### Teste 4 — catch vazio

```java
catch (InputMismatchException erro) {
}
```

Observe que o usuário não sabe o que aconteceu.

Depois adicione mensagem clara.

---

### Teste 5 — esquecer nextLine depois de nextInt

Leia número e depois texto.

Veja o texto sendo pulado.

Depois corrija com:

```java
scanner.nextLine();
```

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-059-tratamento-inicial-erros-entrada
cd labs\m1\aula-059-tratamento-inicial-erros-entrada
```

Crie arquivos:

```text
Main.java
EntradaSemTratamento.java
LerInteiroComWhile.java
ErroNaoLimparEntrada.java
MetodoLerInteiro.java
MetodoLerLong.java
MetodoLerDouble.java
MetodoLerInteiroPositivo.java
MetodoLerLongPositivo.java
MetodoLerTextoObrigatorio.java
MetodoLerStatusValido.java
CadastroPedidoSeguro.java
CadastroProdutoSeguro.java
CadastroPagamentoSeguro.java
CadastroOsSeguro.java
CadastroMensagemSeguro.java
CadastroAuditoriaSeguro.java
ErroSemTryCatch.java
ErroCatchSemLimparEntrada.java
ErroCatchVazio.java
ErroRegraNegocioSemValidacao.java
ErroVariosScanners.java
ErroNextIntNextLine.java
```

Compile:

```powershell
javac Main.java
javac EntradaSemTratamento.java
javac LerInteiroComWhile.java
javac ErroNaoLimparEntrada.java
javac MetodoLerInteiro.java
javac MetodoLerLong.java
javac MetodoLerDouble.java
javac MetodoLerInteiroPositivo.java
javac MetodoLerLongPositivo.java
javac MetodoLerTextoObrigatorio.java
javac MetodoLerStatusValido.java
javac CadastroPedidoSeguro.java
javac CadastroProdutoSeguro.java
javac CadastroPagamentoSeguro.java
javac CadastroOsSeguro.java
javac CadastroMensagemSeguro.java
javac CadastroAuditoriaSeguro.java
javac ErroSemTryCatch.java
javac ErroCatchSemLimparEntrada.java
javac ErroCatchVazio.java
javac ErroRegraNegocioSemValidacao.java
javac ErroVariosScanners.java
javac ErroNextIntNextLine.java
```

Execute:

```powershell
java Main
java EntradaSemTratamento
java LerInteiroComWhile
java ErroNaoLimparEntrada
java MetodoLerInteiro
java MetodoLerLong
java MetodoLerDouble
java MetodoLerInteiroPositivo
java MetodoLerLongPositivo
java MetodoLerTextoObrigatorio
java MetodoLerStatusValido
java CadastroPedidoSeguro
java CadastroProdutoSeguro
java CadastroPagamentoSeguro
java CadastroOsSeguro
java CadastroMensagemSeguro
java CadastroAuditoriaSeguro
java ErroSemTryCatch
java ErroCatchSemLimparEntrada
java ErroCatchVazio
java ErroRegraNegocioSemValidacao
java ErroVariosScanners
java ErroNextIntNextLine
```

Alguns arquivos de erro proposital podem quebrar, travar em loop ou demonstrar comportamento inadequado.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroSemTryCatch.java`

```java
import java.util.Scanner;

public class ErroSemTryCatch {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite um número:");
        int valor = scanner.nextInt();

        System.out.println("Valor: " + valor);

        scanner.close();
    }
}
```

Objetivo:

```text
ver InputMismatchException acontecer sem tratamento.
```

---

## Arquivo sugerido: `ErroCatchSemLimparEntrada.java`

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class ErroCatchSemLimparEntrada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                System.out.println("Digite um número:");
                int valor = scanner.nextInt();

                System.out.println("Valor: " + valor);
                break;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida.");
            }
        }

        scanner.close();
    }
}
```

Depois corrija dentro do `catch`:

```java
scanner.nextLine();
```

Objetivo:

```text
entender por que a entrada inválida precisa ser consumida.
```

---

## Arquivo sugerido: `ErroRegraNegocioSemValidacao.java`

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class ErroRegraNegocioSemValidacao {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade = lerInteiro(scanner, "Digite quantidade:");

        System.out.println("Quantidade aceita: " + quantidade);

        scanner.close();
    }

    public static int lerInteiro(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida.");

                scanner.nextLine();
            }
        }
    }
}
```

Digite:

```text
-10
```

O tipo está correto, mas a regra talvez esteja errada.

Objetivo:

```text
entender diferença entre erro de tipo e validação de regra.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar try/catch |
| Renomear método | `Shift + F6` | Melhorar nomes como `lerInteiroPositivo` |
| Ir para declaração | `Ctrl + B` em muitos keymaps | Navegar até método de leitura |
| Terminal integrado | `Alt + F12` | Testar entradas inválidas |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Debug | `Shift + F9` | Ver fluxo no try/catch |
| Step Into | `F7` em muitos keymaps | Entrar no método de leitura |
| Step Over | `F8` em muitos keymaps | Avançar tentativa de leitura |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Inspecionar variáveis |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Debug recomendado

Use debug neste trecho:

```java
while (true) {
    try {
        System.out.println("Digite uma quantidade:");

        int valor = scanner.nextInt();
        scanner.nextLine();

        return valor;
    } catch (InputMismatchException erro) {
        System.out.println("Entrada inválida.");

        scanner.nextLine();
    }
}
```

Teste com:

```text
abc
```

Observe:

```text
entra no try;
falha no nextInt;
vai para catch;
mostra mensagem;
limpa entrada inválida;
volta para o while.
```

Depois teste com:

```text
10
```

Observe:

```text
entra no try;
lê valor;
limpa quebra de linha;
retorna valor;
sai do método.
```

Esse debug fixa recuperação de entrada.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 059 — Tratamento inicial de erros de entrada

### O que aprendi
Aprendi que `InputMismatchException` acontece quando o `Scanner` tenta ler um tipo incompatível com a entrada digitada, e que `try/catch` permite capturar esse erro e recuperar a leitura.

### O que pratiquei
Criei exemplos sem tratamento, com `try/catch`, com repetição até entrada válida, limpeza de entrada inválida com `scanner.nextLine()`, leitura segura de `int`, `long`, `double`, texto obrigatório e status válido. Também apliquei em pedido, produto, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- entrada inválida
- `Scanner`
- `nextInt`
- `nextLong`
- `nextDouble`
- `nextLine`
- `InputMismatchException`
- `try`
- `catch`
- recuperação
- limpar entrada inválida
- `scanner.nextLine()`
- loop até valor válido
- mensagem amigável
- validação de regra
- tipo inválido
- valor inválido
- método de leitura segura
- evitar `catch Exception`
- evitar catch vazio
- evitar vários Scanners

### Arquivos criados
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/Main.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/EntradaSemTratamento.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/LerInteiroComWhile.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroNaoLimparEntrada.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerInteiro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerLong.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerDouble.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerInteiroPositivo.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerLongPositivo.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerTextoObrigatorio.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/MetodoLerStatusValido.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/CadastroPedidoSeguro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/CadastroProdutoSeguro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/CadastroPagamentoSeguro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/CadastroOsSeguro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/CadastroMensagemSeguro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/CadastroAuditoriaSeguro.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroSemTryCatch.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroCatchSemLimparEntrada.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroCatchVazio.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroRegraNegocioSemValidacao.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroVariosScanners.java`
- `labs/m1/aula-059-tratamento-inicial-erros-entrada/ErroNextIntNextLine.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac LerInteiroComWhile.java
java LerInteiroComWhile
javac MetodoLerInteiroPositivo.java
java MetodoLerInteiroPositivo
javac CadastroPedidoSeguro.java
java CadastroPedidoSeguro
javac CadastroPagamentoSeguro.java
java CadastroPagamentoSeguro
```

### Erros que quero evitar
- não importar `InputMismatchException`;
- não limpar entrada inválida;
- achar que `try/catch` valida regra de negócio;
- usar `catch Exception` sem necessidade;
- deixar catch vazio;
- criar vários `Scanner` para `System.in`;
- misturar `nextInt` e `nextLine` sem limpar linha;
- criar loop sem saída;
- exibir mensagem de erro genérica demais;
- repetir `try/catch` em todo lugar sem criar métodos reutilizáveis.

### Próximo passo
Estudar debug aplicado aos fundamentos.
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
git add labs/m1/aula-059-tratamento-inicial-erros-entrada docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 059: pratica tratamento inicial de erros de entrada em Java"
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
1. O que é `InputMismatchException`?
2. Em quais situações `Scanner.nextInt()` pode gerar erro?
3. Para que serve `try`?
4. Para que serve `catch`?
5. Por que precisamos limpar a entrada inválida com `scanner.nextLine()`?
6. Qual a diferença entre erro de tipo e valor inválido pela regra?
7. Por que texto obrigatório normalmente não precisa de `InputMismatchException`?
8. Por que é melhor criar métodos como `lerInteiroPositivo`?
9. Por que evitar `catch Exception` nesta fase?
10. O que torna uma mensagem de erro amigável?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar entrada inválida;
explicar InputMismatchException;
provocar InputMismatchException;
capturar InputMismatchException com try/catch;
mostrar mensagem amigável;
limpar entrada inválida com scanner.nextLine;
usar while para repetir até valor válido;
criar método lerInteiro;
criar método lerLong;
criar método lerDouble;
criar método lerInteiroPositivo;
criar método lerLongPositivo;
criar método lerTextoObrigatorio;
criar método lerStatusValido;
diferenciar erro de tipo de erro de regra;
validar valor maior que zero;
validar texto obrigatório;
validar status;
aplicar em pedido;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
evitar catch vazio;
evitar catch genérico sem necessidade;
evitar loop infinito;
diagnosticar erros comuns;
debugar fluxo try/catch;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar hierarquia de exceções.

Não precisa ainda dominar exceções customizadas.

Não precisa ainda dominar `throws`.

Não precisa ainda dominar logs profissionais.

Não precisa ainda dominar validação com Bean Validation.

Esses assuntos virão depois.

O objetivo é dominar tratamento inicial de entrada inválida com `Scanner`, `InputMismatchException`, `try/catch` básico e recuperação simples.

---

## Fechamento da aula

Hoje aprendemos tratamento inicial de erros de entrada.

A ideia central foi:

```text
quando o usuário digita um tipo incompatível com o esperado, o Scanner pode lançar InputMismatchException.
```

O padrão principal foi:

```java
try {
    int valor = scanner.nextInt();
    scanner.nextLine();

    return valor;
} catch (InputMismatchException erro) {
    System.out.println("Entrada inválida. Digite um número inteiro.");

    scanner.nextLine();
}
```

Também vimos que:

```text
try/catch trata erro de tipo;
validação trata regra de negócio;
scanner.nextLine limpa a entrada inválida;
loop permite pedir novamente;
métodos reutilizáveis deixam o main limpo.
```

O ponto mais importante é:

```text
não basta evitar que o programa quebre; é preciso recuperar a entrada e orientar o usuário.
```

Na próxima aula, vamos estudar debug aplicado aos fundamentos.

Vamos usar breakpoint em `if`, laços, arrays, métodos e inspeção de variáveis para entender o programa por dentro.
