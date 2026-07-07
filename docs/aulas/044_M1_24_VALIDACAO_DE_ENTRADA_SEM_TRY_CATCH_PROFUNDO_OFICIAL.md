# 044 — M1.24 — Validação de Entrada sem Try/Catch Profundo

## Onde estamos na formação

Estamos no Módulo 1, depois de estudar decisões e repetições.

A sequência recente foi:

```text
040 — M1.20 — Do while;
041 — M1.21 — For clássico;
042 — M1.22 — Break e continue;
043 — M1.23 — Laços aninhados;
044 — M1.24 — Validação de entrada sem try/catch profundo.
```

Agora temos ferramentas suficientes para fazer um programa de console não aceitar qualquer coisa de qualquer jeito.

Até aqui já sabemos:

```java
if (condicao) {
    // decide
}
```

```java
while (condicao) {
    // repete enquanto a condição for verdadeira
}
```

```java
do {
    // executa pelo menos uma vez
} while (condicao);
```

```java
for (int contador = 1; contador <= 5; contador++) {
    // repete com contador
}
```

Também já usamos `Scanner` para ler dados.

Agora vamos juntar tudo para resolver um problema real:

```text
o usuário digita um valor inválido,
o programa mostra uma mensagem clara,
e pede novamente até receber algo aceitável.
```

Sem mergulhar ainda em `try/catch`.

---

## Hoje a aula é sobre proteger a entrada antes de seguir

Um programa iniciante normalmente faz isso:

```java
System.out.println("Digite a quantidade:");
int quantidade = scanner.nextInt();

System.out.println("Quantidade: " + quantidade);
```

Mas e se a quantidade for:

```text
0
-5
```

O programa aceita.

Isso pode ser ruim.

Em um sistema real, não faz sentido processar:

```text
pedido com quantidade zero;
produto com estoque negativo;
valor de pagamento menor ou igual a zero;
opção de menu inexistente;
e-mail sem arroba;
nome em branco;
status desconhecido;
tentativa sem limite;
código fora da faixa esperada.
```

Validação de entrada é o hábito de verificar se o dado recebido pode ser usado.

A ideia é:

```text
antes de processar, valide.
```

---

## O que é validação de entrada

Validação de entrada é conferir se um dado informado atende a uma regra mínima antes do programa continuar.

Exemplo:

```text
quantidade precisa ser maior que zero;
nome não pode estar vazio;
e-mail precisa conter @;
opção do menu precisa estar entre as opções permitidas;
valor em centavos precisa ser positivo;
idade precisa estar dentro de uma faixa possível;
status precisa ser conhecido;
senha não pode estar vazia;
CPF precisa ter 11 caracteres;
tentativas não podem passar do limite.
```

Em Java, neste nível, vamos validar com:

```text
if;
while;
do while;
boolean;
String;
Scanner;
mensagens claras.
```

Não vamos aprofundar ainda:

```text
try/catch;
exceções;
InputMismatchException;
validadores profissionais;
Bean Validation;
DTO;
Spring;
camadas de aplicação;
API REST.
```

Esses assuntos virão depois.

---

## Por que sem try/catch profundo agora

`try/catch` é importante.

Mas estudar `try/catch` profundamente antes de dominar fluxo, condição, repetição e validação manual costuma atrapalhar.

Nesta aula, vamos focar em regras que conseguimos validar com o que já sabemos.

Exemplo:

```java
while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite novamente:");
    quantidade = scanner.nextInt();
}
```

Isso não resolve todos os problemas possíveis.

Por exemplo, se o usuário digitar texto onde o programa espera número, ainda haverá erro.

Mas este é o ponto correto da formação:

```text
primeiro entender validação lógica;
depois aprender tratamento técnico de exceções.
```

Hoje o foco é:

```text
o valor até pode ser lido,
mas não é aceitável para a regra.
```

---

## Validação lógica versus erro técnico

É importante separar duas coisas.

### Validação lógica

O valor foi lido, mas não serve para a regra.

Exemplo:

```text
quantidade = -3
valor = 0
nome = ""
status = "ABC"
opcao = 99
```

Isso conseguimos tratar agora.

### Erro técnico de leitura

O programa esperava um tipo e recebeu outro.

Exemplo:

```text
programa espera int;
usuário digita "abc".
```

Isso pode gerar erro técnico no `Scanner`.

Esse tema será tratado com mais profundidade depois.

Nesta aula, vamos validar entradas coerentes com o tipo esperado.

---

## Vocabulário essencial

Termos desta aula:

```text
validação;
entrada;
dado inválido;
mensagem de erro;
tentar novamente;
loop de validação;
proteção inicial;
valor permitido;
valor sentinela;
faixa válida;
campo obrigatório;
normalização;
trim;
toUpperCase;
isBlank;
contains;
regra de negócio;
bloqueio;
fluxo válido.
```

Termos mais importantes:

```text
validação -> conferir se o dado pode ser aceito;
entrada -> dado informado pelo usuário ou recebido pelo sistema;
loop de validação -> repetição que pede novamente até o valor estar correto;
mensagem clara -> orientação sobre o que precisa ser corrigido;
proteção inicial -> impedir que o fluxo principal rode com dado inválido.
```

---

## Validação simples com if

Comecemos com `if`.

Arquivo:

```text
ValidacaoComIf.java
```

Código:

```java
public class ValidacaoComIf {
    public static void main(String[] args) {
        int quantidade = -2;

        if (quantidade <= 0) {
            System.out.println("Quantidade inválida");
        } else {
            System.out.println("Quantidade válida: " + quantidade);
        }
    }
}
```

Esse código identifica o problema.

Mas ele não pede novamente.

Ele apenas informa.

Para pedir novamente, precisamos de repetição.

---

## Validação com while

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

Esse é o primeiro padrão da aula.

Leitura:

```text
peça a quantidade;
enquanto a quantidade for inválida,
mostre mensagem e peça novamente;
quando sair do while, a quantidade é válida.
```

---

## Por que o while funciona aqui

O `while` repete enquanto a condição é verdadeira.

Condição:

```java
quantidade <= 0
```

Leitura:

```text
enquanto a quantidade for menor ou igual a zero.
```

Dentro do loop, fazemos duas coisas:

```java
System.out.println("Quantidade inválida. Digite novamente:");
quantidade = scanner.nextInt();
```

Ou seja:

```text
avisa o erro;
lê uma nova tentativa.
```

Se o usuário digitar novamente um valor inválido, repete.

Se digitar valor válido, sai do loop.

---

## A variável precisa ser atualizada dentro do loop

Erro comum:

```java
System.out.println("Digite uma quantidade maior que zero:");
int quantidade = scanner.nextInt();

while (quantidade <= 0) {
    System.out.println("Quantidade inválida.");
}
```

Se a quantidade for `-1`, esse loop nunca termina.

Por quê?

Porque `quantidade` nunca muda dentro do `while`.

A correção:

```java
while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite novamente:");
    quantidade = scanner.nextInt();
}
```

Regra:

```text
se o while valida uma entrada, ele precisa permitir uma nova entrada.
```

---

## Validação com do while

O mesmo caso pode ser escrito com `do while`.

Arquivo:

```text
QuantidadeDoWhile.java
```

Código:

```java
import java.util.Scanner;

public class QuantidadeDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade;

        do {
            System.out.println("Digite uma quantidade maior que zero:");
            quantidade = scanner.nextInt();

            if (quantidade <= 0) {
                System.out.println("Quantidade inválida.");
            }
        } while (quantidade <= 0);

        System.out.println("Quantidade válida: " + quantidade);

        scanner.close();
    }
}
```

Aqui faz sentido porque:

```text
precisamos pedir a quantidade pelo menos uma vez.
```

Depois validamos.

Se estiver inválida, repete.

---

## While ou do while para validação

As duas formas podem funcionar.

### Com while

```java
System.out.println("Digite a quantidade:");
int quantidade = scanner.nextInt();

while (quantidade <= 0) {
    System.out.println("Inválida. Digite novamente:");
    quantidade = scanner.nextInt();
}
```

### Com do while

```java
int quantidade;

do {
    System.out.println("Digite a quantidade:");
    quantidade = scanner.nextInt();

    if (quantidade <= 0) {
        System.out.println("Inválida.");
    }
} while (quantidade <= 0);
```

Use `do while` quando a leitura naturalmente precisa acontecer dentro do bloco.

Use `while` quando você já tem um valor inicial antes da validação.

Em console, `do while` costuma ser muito natural para pedir até acertar.

---

## Mensagem clara

Mensagem ruim:

```text
Erro.
```

Mensagem melhor:

```text
Quantidade inválida. Digite um valor maior que zero.
```

Mensagem ruim:

```text
Inválido.
```

Mensagem melhor:

```text
Opção inválida. Escolha 1, 2 ou 0 para sair.
```

Mensagem ruim:

```text
Campo errado.
```

Mensagem melhor:

```text
Nome obrigatório. Digite pelo menos um caractere.
```

Validação boa não apenas bloqueia.

Ela orienta.

---

## Mensagem deve explicar a regra

Quando o valor está errado, diga qual é a regra.

Exemplos:

```text
Quantidade deve ser maior que zero.
Valor em centavos deve ser maior que zero.
Opção deve estar entre 1 e 4.
E-mail precisa conter @.
Nome não pode ficar em branco.
Status deve ser PENDENTE, APROVADO, RECUSADO ou CANCELADO.
Senha precisa ter no mínimo 6 caracteres.
```

Isso melhora a experiência e reduz tentativa aleatória.

Em backend real, mensagens de validação também ajudam suporte, QA e integração.

---

## Validação de faixa

Arquivo:

```text
ValidacaoFaixa.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoFaixa {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int prioridade;

        do {
            System.out.println("Digite a prioridade de 1 a 3:");
            prioridade = scanner.nextInt();

            if (prioridade < 1 || prioridade > 3) {
                System.out.println("Prioridade inválida. Use 1, 2 ou 3.");
            }
        } while (prioridade < 1 || prioridade > 3);

        System.out.println("Prioridade válida: " + prioridade);

        scanner.close();
    }
}
```

Aqui a regra é:

```text
prioridade precisa estar entre 1 e 3.
```

Condição inválida:

```java
prioridade < 1 || prioridade > 3
```

Leitura:

```text
se for menor que 1 ou maior que 3, é inválida.
```

---

## Validação de menu

Arquivo:

```text
MenuComValidacao.java
```

Código:

```java
import java.util.Scanner;

public class MenuComValidacao {
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

            if (opcao != 1 && opcao != 2 && opcao != 0) {
                System.out.println("Opção inválida. Escolha 1, 2 ou 0.");
            }
        } while (opcao != 1 && opcao != 2 && opcao != 0);

        System.out.println("Opção escolhida: " + opcao);

        scanner.close();
    }
}
```

Esse exemplo valida uma opção única.

Depois de validar, o programa segue.

---

## Melhorando a validação de menu com boolean

A condição anterior ficou repetida:

```java
opcao != 1 && opcao != 2 && opcao != 0
```

Podemos melhorar com variável booleana.

Arquivo:

```text
MenuComBoolean.java
```

Código:

```java
import java.util.Scanner;

public class MenuComBoolean {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;
        boolean opcaoValida;

        do {
            System.out.println("Menu");
            System.out.println("1 - Cadastrar");
            System.out.println("2 - Consultar");
            System.out.println("0 - Sair");
            System.out.println("Digite uma opção:");

            opcao = scanner.nextInt();

            opcaoValida = opcao == 1 || opcao == 2 || opcao == 0;

            if (!opcaoValida) {
                System.out.println("Opção inválida. Escolha 1, 2 ou 0.");
            }
        } while (!opcaoValida);

        System.out.println("Opção válida: " + opcao);

        scanner.close();
    }
}
```

Agora temos:

```java
opcaoValida
```

Esse nome explica a regra.

O loop fica mais legível:

```java
while (!opcaoValida)
```

Leitura:

```text
repita enquanto a opção não for válida.
```

---

## Nomear regra deixa o código melhor

Compare:

```java
while (opcao != 1 && opcao != 2 && opcao != 0)
```

com:

```java
while (!opcaoValida)
```

A segunda versão é mais fácil de entender.

A regra foi nomeada.

Esse hábito será muito importante em backend.

Em vez de deixar regra complexa espalhada, damos nome:

```java
boolean opcaoValida = opcao == 1 || opcao == 2 || opcao == 0;
```

Mais tarde, esse tipo de regra poderá virar método.

Por enquanto, usamos variável booleana.

---

## Validação de texto obrigatório

Arquivo:

```text
NomeObrigatorio.java
```

Código:

```java
import java.util.Scanner;

public class NomeObrigatorio {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome;

        do {
            System.out.println("Digite o nome:");
            nome = scanner.nextLine();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório. Digite pelo menos um caractere.");
            }
        } while (nome.isBlank());

        System.out.println("Nome válido: " + nome);

        scanner.close();
    }
}
```

Aqui usamos:

```java
isBlank()
```

Ele verifica se o texto está vazio ou só com espaços.

Exemplos inválidos:

```text
""
"   "
```

---

## trim

`trim()` remove espaços no começo e no fim da String.

Exemplo:

```java
String nome = "  Maria  ";
String nomeTratado = nome.trim();

System.out.println(nomeTratado);
```

Saída:

```text
Maria
```

Em entrada de usuário, `trim()` é muito útil.

Arquivo:

```text
NomeComTrim.java
```

Código:

```java
import java.util.Scanner;

public class NomeComTrim {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome;

        do {
            System.out.println("Digite o nome:");
            nome = scanner.nextLine().trim();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório.");
            }
        } while (nome.isBlank());

        System.out.println("Nome válido: " + nome);

        scanner.close();
    }
}
```

Agora, se o usuário digitar:

```text
  João  
```

o programa guarda:

```text
João.
```

---

## Validação de e-mail simples

Arquivo:

```text
EmailSimples.java
```

Código:

```java
import java.util.Scanner;

public class EmailSimples {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String email;

        do {
            System.out.println("Digite o e-mail:");
            email = scanner.nextLine().trim();

            if (!email.contains("@")) {
                System.out.println("E-mail inválido. O e-mail precisa conter @.");
            }
        } while (!email.contains("@"));

        System.out.println("E-mail válido: " + email);

        scanner.close();
    }
}
```

Essa validação é simples de propósito.

Validação real de e-mail é mais complexa.

Nesta fase, o objetivo é praticar:

```text
String;
contains;
loop de validação;
mensagem clara.
```

---

## Validação de status

Arquivo:

```text
StatusPedidoValidado.java
```

Código:

```java
import java.util.Scanner;

public class StatusPedidoValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String status;
        boolean statusValido;

        do {
            System.out.println("Digite o status do pedido:");
            System.out.println("PENDENTE, APROVADO, RECUSADO ou CANCELADO");

            status = scanner.nextLine().trim().toUpperCase();

            statusValido = status.equals("PENDENTE")
                    || status.equals("APROVADO")
                    || status.equals("RECUSADO")
                    || status.equals("CANCELADO");

            if (!statusValido) {
                System.out.println("Status inválido.");
            }
        } while (!statusValido);

        System.out.println("Status válido: " + status);

        scanner.close();
    }
}
```

Aqui usamos:

```java
trim()
toUpperCase()
equals()
boolean
do while
```

Esse é um padrão muito comum.

---

## Por que usar toUpperCase

Se o usuário digitar:

```text
aprovado
```

e o programa comparar com:

```java
"APROVADO"
```

sem padronizar, não bate.

Com:

```java
toUpperCase()
```

a entrada:

```text
aprovado
```

vira:

```text
APROVADO.
```

Isso reduz erro bobo.

Também usamos:

```java
trim()
```

para remover espaços.

Entrada:

```text
 aprovado 
```

vira:

```text
APROVADO.
```

---

## Validação com switch moderno depois de validar

Podemos validar e depois usar `switch`.

Arquivo:

```text
StatusPedidoComSwitch.java
```

Código:

```java
import java.util.Scanner;

public class StatusPedidoComSwitch {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String status;
        boolean statusValido;

        do {
            System.out.println("Digite o status:");
            status = scanner.nextLine().trim().toUpperCase();

            statusValido = status.equals("PENDENTE")
                    || status.equals("APROVADO")
                    || status.equals("RECUSADO")
                    || status.equals("CANCELADO");

            if (!statusValido) {
                System.out.println("Status inválido. Tente novamente.");
            }
        } while (!statusValido);

        String mensagem = switch (status) {
            case "PENDENTE" -> "Pedido aguardando análise";
            case "APROVADO" -> "Pedido aprovado";
            case "RECUSADO" -> "Pedido recusado";
            case "CANCELADO" -> "Pedido cancelado";
            default -> "Status desconhecido";
        };

        System.out.println(mensagem);

        scanner.close();
    }
}
```

Mesmo validando antes, mantemos `default`.

Por quê?

Porque ele serve como proteção extra e deixa o switch completo.

---

## Validação de senha simples

Arquivo:

```text
SenhaMinima.java
```

Código:

```java
import java.util.Scanner;

public class SenhaMinima {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String senha;

        do {
            System.out.println("Digite uma senha com pelo menos 6 caracteres:");
            senha = scanner.nextLine();

            if (senha.length() < 6) {
                System.out.println("Senha inválida. Use pelo menos 6 caracteres.");
            }
        } while (senha.length() < 6);

        System.out.println("Senha aceita");

        scanner.close();
    }
}
```

Aqui usamos:

```java
length()
```

para verificar o tamanho da String.

---

## Validação de CPF simples

Arquivo:

```text
CpfSimples.java
```

Código:

```java
import java.util.Scanner;

public class CpfSimples {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cpf;

        do {
            System.out.println("Digite o CPF com 11 caracteres numéricos:");
            cpf = scanner.nextLine().trim();

            if (cpf.length() != 11) {
                System.out.println("CPF inválido. O CPF deve ter 11 caracteres.");
            }
        } while (cpf.length() != 11);

        System.out.println("CPF recebido: " + cpf);

        scanner.close();
    }
}
```

Essa ainda não é validação real de CPF.

Não verificamos dígitos, máscara ou cálculo.

O objetivo é validar tamanho inicial.

Em desenvolvimento real, o cuidado seria maior.

---

## Validação de valor monetário em centavos

Nesta formação, vamos preferir centavos em `long` para evitar problemas com decimal em dinheiro.

Arquivo:

```text
ValorCentavosValidado.java
```

Código:

```java
import java.util.Scanner;

public class ValorCentavosValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long valorCentavos;

        do {
            System.out.println("Digite o valor em centavos:");
            valorCentavos = scanner.nextLong();

            if (valorCentavos <= 0) {
                System.out.println("Valor inválido. Informe valor maior que zero.");
            }
        } while (valorCentavos <= 0);

        System.out.println("Valor válido em centavos: " + valorCentavos);

        scanner.close();
    }
}
```

Exemplo:

```text
R$ 10,00 -> 1000 centavos.
```

Validação:

```java
valorCentavos > 0
```

---

## Exemplo aplicado: pedido validado

Arquivo:

```text
PedidoValidado.java
```

Código:

```java
import java.util.Scanner;

public class PedidoValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidadeItens;
        long valorUnitarioCentavos;

        do {
            System.out.println("Digite a quantidade de itens:");
            quantidadeItens = scanner.nextInt();

            if (quantidadeItens <= 0) {
                System.out.println("Quantidade deve ser maior que zero.");
            }
        } while (quantidadeItens <= 0);

        do {
            System.out.println("Digite o valor unitário em centavos:");
            valorUnitarioCentavos = scanner.nextLong();

            if (valorUnitarioCentavos <= 0) {
                System.out.println("Valor unitário deve ser maior que zero.");
            }
        } while (valorUnitarioCentavos <= 0);

        long totalCentavos = quantidadeItens * valorUnitarioCentavos;

        System.out.println("Pedido válido");
        System.out.println("Quantidade: " + quantidadeItens);
        System.out.println("Valor unitário: " + valorUnitarioCentavos);
        System.out.println("Total: " + totalCentavos);

        scanner.close();
    }
}
```

Aqui o pedido só é calculado depois das validações.

Isso é proteção inicial.

---

## Proteção inicial

Proteção inicial significa impedir que o fluxo principal execute com dados ruins.

Exemplo ruim:

```java
long total = quantidadeItens * valorUnitarioCentavos;
```

antes de validar quantidade e valor.

Exemplo melhor:

```java
// valida quantidade
// valida valor
// depois calcula total
```

Fluxo:

```text
entrada;
validação;
processamento.
```

Essa ordem é muito importante.

Em backend real, isso aparece como:

```text
recebe DTO;
valida dados;
aplica regra;
salva ou retorna erro.
```

Ainda não estamos em API, mas o raciocínio começa aqui.

---

## Exemplo aplicado: produto validado

Arquivo:

```text
ProdutoValidado.java
```

Código:

```java
import java.util.Scanner;

public class ProdutoValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nomeProduto;
        int estoque;

        do {
            System.out.println("Digite o nome do produto:");
            nomeProduto = scanner.nextLine().trim();

            if (nomeProduto.isBlank()) {
                System.out.println("Nome do produto é obrigatório.");
            }
        } while (nomeProduto.isBlank());

        do {
            System.out.println("Digite o estoque inicial:");
            estoque = scanner.nextInt();

            if (estoque < 0) {
                System.out.println("Estoque não pode ser negativo.");
            }
        } while (estoque < 0);

        System.out.println("Produto válido");
        System.out.println("Nome: " + nomeProduto);
        System.out.println("Estoque: " + estoque);

        scanner.close();
    }
}
```

Regra:

```text
nome obrigatório;
estoque não pode ser negativo.
```

Produto com estoque zero pode ser válido.

Produto com estoque negativo não.

---

## Exemplo aplicado: cliente validado

Arquivo:

```text
ClienteValidado.java
```

Código:

```java
import java.util.Scanner;

public class ClienteValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome;
        String email;

        do {
            System.out.println("Digite o nome do cliente:");
            nome = scanner.nextLine().trim();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório.");
            }
        } while (nome.isBlank());

        do {
            System.out.println("Digite o e-mail do cliente:");
            email = scanner.nextLine().trim();

            if (!email.contains("@")) {
                System.out.println("E-mail inválido. Deve conter @.");
            }
        } while (!email.contains("@"));

        System.out.println("Cliente válido");
        System.out.println("Nome: " + nome);
        System.out.println("E-mail: " + email);

        scanner.close();
    }
}
```

Esse exemplo junta duas validações de texto.

---

## Exemplo aplicado: ordem de serviço validada

Arquivo:

```text
OrdemServicoValidada.java
```

Código:

```java
import java.util.Scanner;

public class OrdemServicoValidada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String certificado;
        int quantidadeAtividades;

        do {
            System.out.println("Digite o certificado da OS:");
            certificado = scanner.nextLine().trim();

            if (certificado.isBlank()) {
                System.out.println("Certificado obrigatório.");
            }
        } while (certificado.isBlank());

        do {
            System.out.println("Digite a quantidade de atividades:");
            quantidadeAtividades = scanner.nextInt();

            if (quantidadeAtividades <= 0) {
                System.out.println("A OS deve possuir ao menos uma atividade.");
            }
        } while (quantidadeAtividades <= 0);

        System.out.println("OS válida");
        System.out.println("Certificado: " + certificado);
        System.out.println("Quantidade de atividades: " + quantidadeAtividades);

        scanner.close();
    }
}
```

Regra:

```text
certificado obrigatório;
OS precisa ter pelo menos uma atividade.
```

---

## Exemplo aplicado: mensageria validada

Arquivo:

```text
MensageriaValidada.java
```

Código:

```java
import java.util.Scanner;

public class MensageriaValidada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String telefone;
        String tipoMensagem;
        boolean tipoValido;

        do {
            System.out.println("Digite o telefone:");
            telefone = scanner.nextLine().trim();

            if (telefone.length() < 10) {
                System.out.println("Telefone inválido. Informe ao menos 10 dígitos.");
            }
        } while (telefone.length() < 10);

        do {
            System.out.println("Digite o tipo de mensagem:");
            System.out.println("BOAS_VINDAS, ENTREGA ou NPS");

            tipoMensagem = scanner.nextLine().trim().toUpperCase();

            tipoValido = tipoMensagem.equals("BOAS_VINDAS")
                    || tipoMensagem.equals("ENTREGA")
                    || tipoMensagem.equals("NPS");

            if (!tipoValido) {
                System.out.println("Tipo de mensagem inválido.");
            }
        } while (!tipoValido);

        System.out.println("Mensageria válida");
        System.out.println("Telefone: " + telefone);
        System.out.println("Tipo: " + tipoMensagem);

        scanner.close();
    }
}
```

Esse exemplo mostra validação antes de envio.

Em sistema real, telefone teria validação melhor.

Aqui estamos no nível inicial.

---

## Exemplo aplicado: auditoria validada

Arquivo:

```text
AuditoriaValidada.java
```

Código:

```java
import java.util.Scanner;

public class AuditoriaValidada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String usuario;
        String tipoOperacao;
        boolean operacaoValida;

        do {
            System.out.println("Digite o usuário:");
            usuario = scanner.nextLine().trim();

            if (usuario.isBlank()) {
                System.out.println("Usuário obrigatório.");
            }
        } while (usuario.isBlank());

        do {
            System.out.println("Digite o tipo de operação:");
            System.out.println("CRIACAO, EDICAO ou EXCLUSAO");

            tipoOperacao = scanner.nextLine().trim().toUpperCase();

            operacaoValida = tipoOperacao.equals("CRIACAO")
                    || tipoOperacao.equals("EDICAO")
                    || tipoOperacao.equals("EXCLUSAO");

            if (!operacaoValida) {
                System.out.println("Tipo de operação inválido.");
            }
        } while (!operacaoValida);

        System.out.println("Evento de auditoria válido");
        System.out.println("Usuário: " + usuario);
        System.out.println("Operação: " + tipoOperacao);

        scanner.close();
    }
}
```

Validação de auditoria evita registrar evento sem usuário ou com operação desconhecida.

---

## Exemplo aplicado: pagamento validado

Arquivo:

```text
PagamentoValidado.java
```

Código:

```java
import java.util.Scanner;

public class PagamentoValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        long valorCentavos;
        int parcelas;

        do {
            System.out.println("Digite o valor do pagamento em centavos:");
            valorCentavos = scanner.nextLong();

            if (valorCentavos <= 0) {
                System.out.println("Valor deve ser maior que zero.");
            }
        } while (valorCentavos <= 0);

        do {
            System.out.println("Digite a quantidade de parcelas de 1 a 12:");
            parcelas = scanner.nextInt();

            if (parcelas < 1 || parcelas > 12) {
                System.out.println("Parcelas inválidas. Use valor entre 1 e 12.");
            }
        } while (parcelas < 1 || parcelas > 12);

        long valorParcelaCentavos = valorCentavos / parcelas;

        System.out.println("Pagamento válido");
        System.out.println("Valor total: " + valorCentavos);
        System.out.println("Parcelas: " + parcelas);
        System.out.println("Valor aproximado da parcela: " + valorParcelaCentavos);

        scanner.close();
    }
}
```

Aqui a validação evita:

```text
pagamento zerado;
pagamento negativo;
parcelas menores que 1;
parcelas maiores que 12;
divisão por zero.
```

Observe:

```text
validar parcelas evita dividir por zero.
```

Isso é proteção inicial.

---

## Cuidado com nextInt e nextLine

Já vimos esse cuidado, mas ele volta aqui.

Quando usamos:

```java
nextInt()
```

e depois:

```java
nextLine()
```

pode sobrar uma quebra de linha.

Exemplo problemático:

```java
int idade = scanner.nextInt();
String nome = scanner.nextLine();
```

O `nome` pode receber a quebra de linha vazia.

Correção:

```java
int idade = scanner.nextInt();
scanner.nextLine();

String nome = scanner.nextLine();
```

A linha:

```java
scanner.nextLine();
```

limpa a quebra pendente.

---

## Exemplo com número e texto

Arquivo:

```text
NumeroETextoValidado.java
```

Código:

```java
import java.util.Scanner;

public class NumeroETextoValidado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade;
        String nome;

        do {
            System.out.println("Digite a idade:");
            idade = scanner.nextInt();

            if (idade < 0 || idade > 130) {
                System.out.println("Idade inválida.");
            }
        } while (idade < 0 || idade > 130);

        scanner.nextLine();

        do {
            System.out.println("Digite o nome:");
            nome = scanner.nextLine().trim();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório.");
            }
        } while (nome.isBlank());

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);

        scanner.close();
    }
}
```

Esse exemplo mostra o cuidado ao alternar número e texto.

---

## Limite de tentativas

Às vezes não queremos repetir para sempre.

Podemos limitar tentativas.

Arquivo:

```text
ValidacaoComLimiteTentativas.java
```

Código:

```java
import java.util.Scanner;

public class ValidacaoComLimiteTentativas {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int tentativas = 0;
        int limiteTentativas = 3;
        int codigo;
        boolean codigoValido = false;

        do {
            System.out.println("Digite o código de confirmação entre 100 e 999:");
            codigo = scanner.nextInt();

            codigoValido = codigo >= 100 && codigo <= 999;
            tentativas++;

            if (!codigoValido) {
                System.out.println("Código inválido.");
            }
        } while (!codigoValido && tentativas < limiteTentativas);

        if (codigoValido) {
            System.out.println("Código aceito");
        } else {
            System.out.println("Limite de tentativas atingido");
        }

        scanner.close();
    }
}
```

Aqui o loop para quando:

```text
o código fica válido;
ou as tentativas acabam.
```

Condição:

```java
!codigoValido && tentativas < limiteTentativas
```

Leitura:

```text
repita enquanto o código não for válido e ainda houver tentativas.
```

---

## Validação com boolean de erro

Podemos usar boolean para controlar várias regras.

Arquivo:

```text
CadastroClienteComErro.java
```

Código:

```java
import java.util.Scanner;

public class CadastroClienteComErro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome;
        String email;
        boolean possuiErro;

        do {
            possuiErro = false;

            System.out.println("Digite o nome:");
            nome = scanner.nextLine().trim();

            System.out.println("Digite o e-mail:");
            email = scanner.nextLine().trim();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório.");
                possuiErro = true;
            }

            if (!email.contains("@")) {
                System.out.println("E-mail inválido.");
                possuiErro = true;
            }

            if (possuiErro) {
                System.out.println("Corrija os dados e tente novamente.");
            }
        } while (possuiErro);

        System.out.println("Cliente válido");
        System.out.println("Nome: " + nome);
        System.out.println("E-mail: " + email);

        scanner.close();
    }
}
```

Aqui validamos um conjunto de campos.

Se qualquer campo estiver errado, repetimos o cadastro.

---

## Mostrar todos os erros ou apenas o primeiro

Existem duas estratégias.

### Mostrar todos os erros

```java
if (nome.isBlank()) {
    System.out.println("Nome obrigatório.");
    possuiErro = true;
}

if (!email.contains("@")) {
    System.out.println("E-mail inválido.");
    possuiErro = true;
}
```

Mostra todos os problemas.

### Mostrar apenas o primeiro erro

```java
if (nome.isBlank()) {
    System.out.println("Nome obrigatório.");
} else if (!email.contains("@")) {
    System.out.println("E-mail inválido.");
} else {
    System.out.println("Cliente válido.");
}
```

Mostra o primeiro problema.

Ambas existem.

Em formulários, muitas vezes é melhor mostrar todos.

Em fluxos simples, o primeiro erro pode bastar.

---

## Não misture validação com processamento pesado

Ruim:

```java
// lê dado
// calcula total
// envia mensagem
// depois valida se dado era válido
```

Melhor:

```text
ler;
validar;
processar.
```

Validação deve acontecer antes de ações importantes.

Exemplo:

```text
não envie mensagem antes de validar telefone;
não calcule pagamento antes de validar valor e parcelas;
não registre auditoria sem usuário;
não processe pedido com quantidade inválida;
não atualize estoque com valor negativo.
```

Essa ordem protege o sistema.

---

## Validação não é desconfiança do usuário

Validação não existe porque o usuário é ruim.

Existe porque entrada externa sempre pode vir errada.

Origem da entrada:

```text
usuário digitando;
arquivo importado;
API externa;
banco legado;
mensageria;
integração;
planilha;
sistema parceiro.
```

Todo dado que vem de fora precisa ser conferido.

Em backend, essa mentalidade é obrigatória.

---

## Erros comuns

### Erro 1 — Validar uma vez e seguir com dado inválido

Ruim:

```java
if (quantidade <= 0) {
    System.out.println("Inválida");
}

System.out.println("Processando quantidade " + quantidade);
```

Mesmo inválida, processa depois.

Melhor:

```java
while (quantidade <= 0) {
    // pedir novamente
}
```

---

### Erro 2 — Não pedir novamente dentro do loop

Causa loop infinito:

```java
while (quantidade <= 0) {
    System.out.println("Inválida");
}
```

---

### Erro 3 — Mensagem genérica demais

Ruim:

```text
Erro.
```

Melhor:

```text
Quantidade inválida. Digite um valor maior que zero.
```

---

### Erro 4 — Repetir condição complexa sem nome

Ruim:

```java
while (opcao != 1 && opcao != 2 && opcao != 0)
```

Melhor:

```java
boolean opcaoValida = opcao == 1 || opcao == 2 || opcao == 0;
```

---

### Erro 5 — Comparar String com `==`

Errado:

```java
if (status == "APROVADO") {
}
```

Certo:

```java
if (status.equals("APROVADO")) {
}
```

Ou, em algumas situações:

```java
if ("APROVADO".equals(status)) {
}
```

---

### Erro 6 — Não usar trim

Se o usuário digitar:

```text
 aprovado 
```

sem `trim()`, a comparação pode falhar.

Use:

```java
trim()
```

---

### Erro 7 — Não padronizar caixa

Se espera:

```text
APROVADO
```

e o usuário digita:

```text
aprovado
```

use:

```java
toUpperCase()
```

quando fizer sentido.

---

### Erro 8 — Misturar nextInt e nextLine sem limpar buffer

Depois de `nextInt()`, use:

```java
scanner.nextLine();
```

antes de ler texto com `nextLine()`.

---

### Erro 9 — Não limitar tentativas quando precisa

Alguns fluxos podem repetir até acertar.

Outros precisam de limite.

Exemplo:

```text
senha;
código de confirmação;
tentativa de operação crítica.
```

---

### Erro 10 — Achar que esta aula resolve todo erro de entrada

Ainda não.

Se o usuário digitar texto onde o código espera número, pode quebrar.

Isso será aprofundado com tratamento de exceções depois.

Hoje estamos validando regras lógicas dos valores lidos.

---

## Diagnóstico de validação

Quando a validação não funcionar, siga o roteiro.

### 1. Qual é a regra de validade?

Exemplo:

```text
quantidade > 0
```

### 2. Qual é a condição de invalidez?

Exemplo:

```text
quantidade <= 0
```

### 3. O loop repete enquanto inválido?

Exemplo:

```java
while (quantidade <= 0)
```

ou:

```java
while (!opcaoValida)
```

### 4. A entrada é lida novamente dentro do loop?

Se não, pode virar loop infinito.

### 5. A mensagem explica a regra?

Mensagem precisa orientar.

### 6. A String foi tratada com trim?

Espaços podem atrapalhar.

### 7. A String foi padronizada se necessário?

Use `toUpperCase()` quando o domínio for em maiúsculo.

### 8. A comparação de String usa equals?

Evite `==`.

### 9. Existe mistura de nextInt e nextLine?

Limpe buffer.

### 10. O processamento só acontece depois da validação?

Essa é a proteção principal.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Loop sem nova leitura

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida");
        }

        scanner.close();
    }
}
```

Execute com valor inválido e veja o problema.

Depois corrija lendo novamente.

### Teste 2 — String com `==`

```java
public class Main {
    public static void main(String[] args) {
        String status = new String("APROVADO");

        if (status == "APROVADO") {
            System.out.println("Aprovado");
        } else {
            System.out.println("Não aprovado");
        }
    }
}
```

Depois corrija com:

```java
status.equals("APROVADO")
```

### Teste 3 — Sem trim

```java
public class Main {
    public static void main(String[] args) {
        String status = " APROVADO ";

        if (status.equals("APROVADO")) {
            System.out.println("Aprovado");
        } else {
            System.out.println("Desconhecido");
        }
    }
}
```

Depois corrija com:

```java
status.trim()
```

### Teste 4 — Sem toUpperCase

```java
public class Main {
    public static void main(String[] args) {
        String status = "aprovado";

        if (status.equals("APROVADO")) {
            System.out.println("Aprovado");
        } else {
            System.out.println("Desconhecido");
        }
    }
}
```

Depois corrija com:

```java
status.toUpperCase()
```

### Teste 5 — nextInt e nextLine

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade = scanner.nextInt();
        String nome = scanner.nextLine();

        System.out.println("Idade: " + idade);
        System.out.println("Nome: " + nome);

        scanner.close();
    }
}
```

Depois corrija com:

```java
scanner.nextLine();
```

antes de ler o nome.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-044-validacao-entrada
cd labs\m1\aula-044-validacao-entrada
```

Crie arquivos:

```text
Main.java
ValidacaoComIf.java
QuantidadeDoWhile.java
ValidacaoFaixa.java
MenuComValidacao.java
MenuComBoolean.java
NomeObrigatorio.java
NomeComTrim.java
EmailSimples.java
StatusPedidoValidado.java
StatusPedidoComSwitch.java
SenhaMinima.java
CpfSimples.java
ValorCentavosValidado.java
PedidoValidado.java
ProdutoValidado.java
ClienteValidado.java
OrdemServicoValidada.java
MensageriaValidada.java
AuditoriaValidada.java
PagamentoValidado.java
NumeroETextoValidado.java
ValidacaoComLimiteTentativas.java
CadastroClienteComErro.java
```

Compile:

```powershell
javac Main.java
javac ValidacaoComIf.java
javac QuantidadeDoWhile.java
javac ValidacaoFaixa.java
javac MenuComValidacao.java
javac MenuComBoolean.java
javac NomeObrigatorio.java
javac NomeComTrim.java
javac EmailSimples.java
javac StatusPedidoValidado.java
javac StatusPedidoComSwitch.java
javac SenhaMinima.java
javac CpfSimples.java
javac ValorCentavosValidado.java
javac PedidoValidado.java
javac ProdutoValidado.java
javac ClienteValidado.java
javac OrdemServicoValidada.java
javac MensageriaValidada.java
javac AuditoriaValidada.java
javac PagamentoValidado.java
javac NumeroETextoValidado.java
javac ValidacaoComLimiteTentativas.java
javac CadastroClienteComErro.java
```

Execute:

```powershell
java Main
java ValidacaoComIf
java QuantidadeDoWhile
java ValidacaoFaixa
java MenuComValidacao
java MenuComBoolean
java NomeObrigatorio
java NomeComTrim
java EmailSimples
java StatusPedidoValidado
java StatusPedidoComSwitch
java SenhaMinima
java CpfSimples
java ValorCentavosValidado
java PedidoValidado
java ProdutoValidado
java ClienteValidado
java OrdemServicoValidada
java MensageriaValidada
java AuditoriaValidada
java PagamentoValidado
java NumeroETextoValidado
java ValidacaoComLimiteTentativas
java CadastroClienteComErro
```

Teste entradas válidas e inválidas.

Registre no diário quais entradas foram bloqueadas.

---

## Arquivo sugerido: `ValidacaoComLimiteTentativas.java`

```java
import java.util.Scanner;

public class ValidacaoComLimiteTentativas {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int tentativas = 0;
        int limiteTentativas = 3;
        int codigo;
        boolean codigoValido = false;

        do {
            System.out.println("Digite o código de confirmação entre 100 e 999:");
            codigo = scanner.nextInt();

            codigoValido = codigo >= 100 && codigo <= 999;
            tentativas++;

            if (!codigoValido) {
                System.out.println("Código inválido.");
            }
        } while (!codigoValido && tentativas < limiteTentativas);

        if (codigoValido) {
            System.out.println("Código aceito");
        } else {
            System.out.println("Limite de tentativas atingido");
        }

        scanner.close();
    }
}
```

Objetivo:

```text
entender validação com limite de tentativas.
```

---

## Arquivo sugerido: `CadastroClienteComErro.java`

```java
import java.util.Scanner;

public class CadastroClienteComErro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome;
        String email;
        boolean possuiErro;

        do {
            possuiErro = false;

            System.out.println("Digite o nome:");
            nome = scanner.nextLine().trim();

            System.out.println("Digite o e-mail:");
            email = scanner.nextLine().trim();

            if (nome.isBlank()) {
                System.out.println("Nome obrigatório.");
                possuiErro = true;
            }

            if (!email.contains("@")) {
                System.out.println("E-mail inválido.");
                possuiErro = true;
            }

            if (possuiErro) {
                System.out.println("Corrija os dados e tente novamente.");
            }
        } while (possuiErro);

        System.out.println("Cliente válido");
        System.out.println("Nome: " + nome);
        System.out.println("E-mail: " + email);

        scanner.close();
    }
}
```

Objetivo:

```text
validar conjunto de campos e repetir quando houver erro.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Reformatar código | `Ctrl + Alt + L` | Organizar loops de validação |
| Renomear variável | `Shift + F6` | Melhorar nomes como `opcaoValida` |
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Rodar programa | `Shift + F10` | Executar no IntelliJ |
| Parar execução | botão Stop ou `Ctrl + F2` em muitos keymaps | Interromper loop infinito |
| Debug | `Shift + F9` | Ver validação passo a passo |
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

## Debug para validação

Use debug neste exemplo:

```java
int quantidade = scanner.nextInt();

while (quantidade <= 0) {
    System.out.println("Quantidade inválida. Digite novamente:");
    quantidade = scanner.nextInt();
}

System.out.println("Quantidade válida: " + quantidade);
```

Teste com:

```text
-1
0
5
```

Observe:

```text
-1 entra no while;
0 entra no while;
5 sai do while.
```

O debug mostra claramente que o programa só passa quando a condição de invalidez fica falsa.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 044 — Validação de entrada sem try/catch profundo

### O que aprendi
Aprendi a validar entradas usando `if`, `while`, `do while`, variáveis booleanas, mensagens claras e nova tentativa, sem aprofundar ainda em `try/catch`.

### O que pratiquei
Criei validações para quantidade, faixa, menu, nome obrigatório, e-mail, status, senha, CPF simples, valor em centavos, pedido, produto, cliente, OS, mensageria, auditoria, pagamento, número com texto, limite de tentativas e cadastro com múltiplos erros.

### Conceitos principais
- validação de entrada
- validação lógica
- entrada inválida
- mensagem clara
- tentar novamente
- loop de validação
- proteção inicial
- `while`
- `do while`
- `boolean`
- `isBlank`
- `trim`
- `toUpperCase`
- `contains`
- `equals`
- faixa válida
- campo obrigatório
- limite de tentativas
- `nextInt`
- `nextLine`

### Arquivos criados
- `labs/m1/aula-044-validacao-entrada/Main.java`
- `labs/m1/aula-044-validacao-entrada/ValidacaoComIf.java`
- `labs/m1/aula-044-validacao-entrada/QuantidadeDoWhile.java`
- `labs/m1/aula-044-validacao-entrada/ValidacaoFaixa.java`
- `labs/m1/aula-044-validacao-entrada/MenuComValidacao.java`
- `labs/m1/aula-044-validacao-entrada/MenuComBoolean.java`
- `labs/m1/aula-044-validacao-entrada/NomeObrigatorio.java`
- `labs/m1/aula-044-validacao-entrada/NomeComTrim.java`
- `labs/m1/aula-044-validacao-entrada/EmailSimples.java`
- `labs/m1/aula-044-validacao-entrada/StatusPedidoValidado.java`
- `labs/m1/aula-044-validacao-entrada/StatusPedidoComSwitch.java`
- `labs/m1/aula-044-validacao-entrada/SenhaMinima.java`
- `labs/m1/aula-044-validacao-entrada/CpfSimples.java`
- `labs/m1/aula-044-validacao-entrada/ValorCentavosValidado.java`
- `labs/m1/aula-044-validacao-entrada/PedidoValidado.java`
- `labs/m1/aula-044-validacao-entrada/ProdutoValidado.java`
- `labs/m1/aula-044-validacao-entrada/ClienteValidado.java`
- `labs/m1/aula-044-validacao-entrada/OrdemServicoValidada.java`
- `labs/m1/aula-044-validacao-entrada/MensageriaValidada.java`
- `labs/m1/aula-044-validacao-entrada/AuditoriaValidada.java`
- `labs/m1/aula-044-validacao-entrada/PagamentoValidado.java`
- `labs/m1/aula-044-validacao-entrada/NumeroETextoValidado.java`
- `labs/m1/aula-044-validacao-entrada/ValidacaoComLimiteTentativas.java`
- `labs/m1/aula-044-validacao-entrada/CadastroClienteComErro.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac NomeObrigatorio.java
java NomeObrigatorio
javac StatusPedidoValidado.java
java StatusPedidoValidado
javac PedidoValidado.java
java PedidoValidado
javac CadastroClienteComErro.java
java CadastroClienteComErro
```

### Erros que quero evitar
- validar uma vez e seguir com dado inválido;
- não pedir novamente dentro do loop;
- usar mensagem genérica demais;
- repetir condição complexa sem nome;
- comparar String com `==`;
- não usar `trim`;
- não padronizar caixa quando necessário;
- misturar `nextInt` e `nextLine` sem limpar buffer;
- não limitar tentativas quando precisa;
- achar que esta aula resolve todo erro de entrada.

### Próximo passo
Estudar arrays de números.
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
git add labs/m1/aula-044-validacao-entrada docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 044: pratica validacao de entrada em Java"
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
1. O que é validação de entrada?
2. Qual a diferença entre validação lógica e erro técnico de leitura?
3. Por que esta aula evita aprofundar try/catch?
4. Por que um loop de validação precisa pedir o valor novamente?
5. Quando `do while` combina com validação?
6. Por que mensagens de erro devem explicar a regra?
7. Para que servem `trim` e `toUpperCase`?
8. Por que String deve ser comparada com `equals`?
9. Qual cuidado existe ao misturar `nextInt` e `nextLine`?
10. O que significa proteção inicial?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar validação de entrada;
diferenciar validação lógica de erro técnico;
criar validação com if;
criar validação com while;
criar validação com do while;
pedir nova tentativa dentro do loop;
evitar loop infinito em validação;
criar mensagem clara;
validar quantidade maior que zero;
validar faixa numérica;
validar opção de menu;
usar boolean para nomear regra;
validar texto obrigatório com isBlank;
usar trim;
usar toUpperCase;
usar contains;
usar equals;
validar status;
validar senha mínima;
validar CPF simples por tamanho;
validar valor em centavos;
aplicar validação em pedido;
aplicar validação em produto;
aplicar validação em cliente;
aplicar validação em OS;
aplicar validação em mensageria;
aplicar validação em auditoria;
aplicar validação em pagamento;
cuidar de nextInt e nextLine;
usar limite de tentativas;
validar múltiplos campos com possuiErro;
diagnosticar erros comuns;
debugar validação;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `try/catch`.

Não precisa ainda dominar exceções.

Não precisa ainda dominar validação profissional com Bean Validation.

Não precisa ainda dominar APIs REST.

Não precisa ainda dominar DTOs.

Esses assuntos virão depois.

O objetivo é aprender a proteger o fluxo com validações simples, claras e repetíveis usando o conhecimento atual.

---

## Fechamento da aula

Hoje aprendemos a validar entrada sem aprofundar em `try/catch`.

A ideia central foi:

```text
não processe dado ruim.
```

O fluxo correto é:

```text
ler;
validar;
pedir novamente se necessário;
só então processar.
```

Vimos validações com:

```text
while;
do while;
if;
boolean;
mensagem clara;
trim;
toUpperCase;
isBlank;
contains;
equals;
limite de tentativas.
```

Também vimos que esta aula trata validação lógica.

Se o usuário digitar texto onde o programa espera número, isso ainda pode gerar erro técnico.

Esse assunto será estudado depois, quando entrarmos em exceções.

Por enquanto, o mais importante é formar o hábito:

```text
entrada externa não deve ser confiada automaticamente.
```

Na próxima aula, vamos iniciar arrays de números.

Com arrays, vamos aprender a guardar vários valores do mesmo tipo em uma única estrutura e percorrer esses valores com loops.
