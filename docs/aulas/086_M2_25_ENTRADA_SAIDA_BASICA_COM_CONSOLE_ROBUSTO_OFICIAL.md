# 086 — M2.25 — Entrada/saída básica com console robusto

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.25.01` — Entrada/saída básica com console robusto — Conceito profundo e quando usar.
- `M2.25.02` — Entrada/saída básica com console robusto — Implementação guiada com código realista.
- `M2.25.03` — Entrada/saída básica com console robusto — Refatoração, melhoria e leitura crítica.
- `M2.25.04` — Entrada/saída básica com console robusto — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar leitura segura, prompts claros, validação, repetição, entrada com `Scanner`, cuidado com `nextInt`, uso de `nextLine`, conversão controlada, tratamento de `NumberFormatException`, leitura de textos obrigatórios, inteiros, decimais, datas, confirmação sim/não, menus, refatoração para métodos utilitários e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Atualização de continuidade

Antes desta aula, foi feita uma pausa importante para revisar os arquivos do Módulo 0 ligados a instalação, configuração e validação de ambiente.

A partir daqui, fica mantida a regra:

```text
Módulo 0 -> baixar, instalar, configurar, validar e diagnosticar ferramentas.
Módulo 1 em diante -> praticar Java e backend assumindo ambiente validado.
```

Esta aula não exige ferramenta nova.

Ela usa apenas:

```text
JDK já instalado;
IntelliJ IDEA Community já configurado;
terminal já validado;
Git já preparado.
```

Se algum desses pontos falhar, volte ao Módulo 0 antes de continuar.

---

## Pré-requisito de ambiente

Antes de começar, valide:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK está configurado;
Main.java executa;
terminal integrado funciona.
```

Esta aula será feita em:

```text
labs/m2/aula-086-console-robusto
```

Se o terminal, o JDK ou a IDE não estiverem funcionando, o problema não é console robusto ainda. É ambiente.

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
082 — M2.21 — Sealed classes e interfaces;
083 — M2.22 — Pattern matching;
084 — M2.23 — Text blocks;
085 — M2.24 — Exceptions por baixo;
086 — M2.25 — Entrada/saída básica com console robusto.
```

Na aula anterior, estudamos exceptions por baixo.

Agora vamos aplicar esse conhecimento em um cenário muito comum para quem está aprendendo Java:

```text
entrada e saída no console.
```

O console parece simples.

Mas é nele que aparecem vários erros clássicos:

```text
usuário digita texto onde era número;
usuário aperta Enter vazio;
usuário digita número decimal com vírgula;
usuário digita data inválida;
Scanner pula uma pergunta;
programa quebra com NumberFormatException;
menu aceita opção inexistente;
loop infinito por validação mal feita;
mensagem confusa para o usuário;
código cheio de repetição.
```

Esta aula existe para transformar console de exemplo frágil em console minimamente robusto.

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
086 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 86
Aulas oficiais restantes: 452
```

Contando o arquivo de abertura `000`, teremos:

```text
87 arquivos gerados no total.
```

Ainda estamos consolidando Java Core antes de avançar para organização de pacotes, classes, encapsulamento, coleções, exceções mais estruturadas, Maven, banco de dados, Spring Boot e arquitetura backend.

---

## A pergunta central da aula

Imagine este programa:

```java
Scanner scanner = new Scanner(System.in);

System.out.print("Digite sua idade: ");
int idade = scanner.nextInt();

System.out.println("Idade: " + idade);
```

Funciona se o usuário digitar:

```text
30
```

Mas quebra se o usuário digitar:

```text
abc
```

Ou pode se comportar de forma estranha quando misturamos:

```java
nextInt()
nextLine()
```

Então a pergunta desta aula é:

```text
como ler dados do console sem quebrar com qualquer entrada inválida?
```

A resposta é:

```text
ler como texto;
limpar espaços;
validar;
converter com cuidado;
repetir até ficar válido;
mostrar mensagens claras;
separar leitura em métodos.
```

Esse é o caminho para console robusto.

---

## O que é entrada e saída no console

### Entrada

Entrada é aquilo que o programa recebe.

No console, a entrada normalmente vem do teclado.

Exemplo:

```text
nome;
idade;
preço;
status;
opção de menu;
data;
confirmação sim/não.
```

### Saída

Saída é aquilo que o programa mostra.

No console, a saída aparece no terminal.

Exemplo:

```text
mensagens;
menus;
erros;
resultado;
resumo;
instruções.
```

Em Java básico, usamos principalmente:

```java
System.out.print()
System.out.println()
Scanner
```

---

## `print` versus `println`

`println` imprime e pula linha:

```java
System.out.println("Olá");
```

`print` imprime sem pular linha:

```java
System.out.print("Digite seu nome: ");
```

Para perguntas, `print` costuma ser melhor:

```text
Digite seu nome: Ana
```

Para mensagens e resultados, `println` costuma ser melhor:

```text
Cliente cadastrado com sucesso.
```

---

## Scanner

`Scanner` lê entrada.

Exemplo:

```java
Scanner scanner = new Scanner(System.in);
```

`System.in` representa a entrada padrão do programa.

No console, isso normalmente é o teclado.

Com Scanner, existem métodos como:

```text
nextLine()
next()
nextInt()
nextLong()
nextDouble()
hasNextInt()
hasNextDouble()
```

Nesta aula, a recomendação principal será:

```text
para programas de console robustos, prefira ler linha inteira com nextLine e depois converter.
```

Isso reduz muitos problemas.

---

## O problema de `nextInt` com `nextLine`

Um erro clássico:

Arquivo:

```text
ProblemaNextInt.java
```

Código:

```java
import java.util.Scanner;

public class ProblemaNextInt {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite sua idade: ");
        int idade = scanner.nextInt();

        System.out.print("Digite seu nome: ");
        String nome = scanner.nextLine();

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
    }
}
```

O problema:

```text
nextInt lê o número, mas deixa a quebra de linha pendente;
nextLine lê essa quebra de linha pendente;
a pergunta do nome parece ser pulada.
```

Por isso, para iniciantes e para console robusto, usar `nextLine` para tudo é mais previsível.

---

## Estratégia recomendada

A estratégia desta aula:

```text
1. Sempre ler a linha com nextLine.
2. Aplicar trim ou strip.
3. Validar vazio.
4. Converter quando necessário.
5. Capturar erro de conversão.
6. Repetir enquanto inválido.
7. Retornar valor já validado.
```

Exemplo:

```java
String linha = scanner.nextLine().trim();
int idade = Integer.parseInt(linha);
```

Se a linha não for número, `Integer.parseInt` lança:

```text
NumberFormatException
```

Agora a aula anterior entra em ação.

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

        System.out.print("Digite seu nome: ");
        String nome = scanner.nextLine().trim();

        System.out.println("Olá, " + nome + "!");
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

Entrada:

```text
Ana
```

Saída:

```text
Olá, Ana!
```

Esse exemplo ainda não valida vazio.

Vamos melhorar.

---

## Texto obrigatório

Arquivo:

```text
TextoObrigatorio.java
```

Código:

```java
import java.util.Scanner;

public class TextoObrigatorio {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Digite seu nome: ");

        System.out.println("Nome cadastrado: " + nome);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }
}
```

Agora, se o usuário apertar Enter vazio, o programa não aceita.

Ele repete.

Isso é console robusto básico.

---

## Por que usar `trim` ou `strip`

Se o usuário digita:

```text
   Ana   
```

o valor bruto contém espaços.

Com:

```java
trim()
```

ou:

```java
strip()
```

vira:

```text
Ana
```

Diferença geral:

```text
trim -> método antigo, remove espaços simples no começo/fim;
strip -> mais moderno, baseado em Unicode.
```

Para esta aula, qualquer um resolve na maioria dos exemplos simples.

Usaremos `trim()` por simplicidade e familiaridade.

---

## Inteiro obrigatório

Arquivo:

```text
InteiroObrigatorio.java
```

Código:

```java
import java.util.Scanner;

public class InteiroObrigatorio {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade = lerInteiro(scanner, "Digite sua idade: ");

        System.out.println("Idade informada: " + idade);
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}
```

Se o usuário digitar:

```text
abc
```

o programa não quebra.

Ele mostra:

```text
Digite um número inteiro válido.
```

e pergunta de novo.

---

## Inteiro com faixa

Muitas vezes não basta ser inteiro.

Precisa estar em uma faixa.

Exemplo:

```text
idade entre 0 e 130;
opção de menu entre 1 e 5;
quantidade maior que zero.
```

Arquivo:

```text
InteiroComFaixa.java
```

Código:

```java
import java.util.Scanner;

public class InteiroComFaixa {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade = lerInteiroEntre(scanner, "Digite sua idade: ", 0, 130);

        System.out.println("Idade válida: " + idade);
    }

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite um valor entre " + minimo + " e " + maximo + ".");
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}
```

Agora validamos:

```text
formato;
faixa.
```

---

## Decimal com BigDecimal

Para dinheiro, não use `double` como primeira opção profissional.

Use `BigDecimal`.

Arquivo:

```text
DecimalBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class DecimalBigDecimal {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        BigDecimal valor = lerBigDecimalPositivo(scanner, "Digite o valor do pagamento: ");

        System.out.println("Valor informado: " + valor);
    }

    public static BigDecimal lerBigDecimalPositivo(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                BigDecimal valor = new BigDecimal(linha);

                if (valor.compareTo(BigDecimal.ZERO) > 0) {
                    return valor;
                }

                System.out.println("O valor deve ser maior que zero.");
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor decimal válido. Exemplo: 10.50");
            }
        }
    }
}
```

Observação:

```text
replace(",", ".") ajuda o usuário brasileiro que digita 10,50;
em aplicações reais, Locale e formatação precisam ser tratados com mais cuidado.
```

Já estudamos `BigDecimal`, então agora aplicamos.

---

## Confirmação sim/não

Arquivo:

```text
ConfirmacaoSimNao.java
```

Código:

```java
import java.util.Scanner;

public class ConfirmacaoSimNao {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        boolean confirmado = confirmar(scanner, "Deseja continuar? (S/N): ");

        System.out.println("Confirmado: " + confirmado);
    }

    public static boolean confirmar(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String resposta = scanner.nextLine().trim();

            if (resposta.equalsIgnoreCase("S") || resposta.equalsIgnoreCase("SIM")) {
                return true;
            }

            if (resposta.equalsIgnoreCase("N") || resposta.equalsIgnoreCase("NAO") || resposta.equalsIgnoreCase("NÃO")) {
                return false;
            }

            System.out.println("Resposta inválida. Digite S para sim ou N para não.");
        }
    }
}
```

Esse método evita várias versões de `if` espalhadas.

---

## Menu robusto

Arquivo:

```text
MenuRobusto.java
```

Código:

```java
import java.util.Scanner;

public class MenuRobusto {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            mostrarMenu();

            int opcao = lerInteiroEntre(scanner, "Escolha uma opção: ", 1, 4);

            if (opcao == 1) {
                System.out.println("Cadastrar cliente.");
            } else if (opcao == 2) {
                System.out.println("Listar clientes.");
            } else if (opcao == 3) {
                System.out.println("Remover cliente.");
            } else if (opcao == 4) {
                System.out.println("Saindo.");
                break;
            }
        }
    }

    public static void mostrarMenu() {
        System.out.println();
        System.out.println("=== MENU ===");
        System.out.println("1 - Cadastrar cliente");
        System.out.println("2 - Listar clientes");
        System.out.println("3 - Remover cliente");
        System.out.println("4 - Sair");
    }

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite uma opção entre " + minimo + " e " + maximo + ".");
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}
```

Esse menu não quebra se o usuário digitar:

```text
abc
0
99
```

Ele orienta e repete.

---

## Data com LocalDate

Já estudamos `java.time`.

Agora podemos ler data com cuidado.

Arquivo:

```text
DataLocalDate.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class DataLocalDate {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        LocalDate data = lerDataIso(scanner, "Digite a data no formato yyyy-MM-dd: ");

        System.out.println("Data informada: " + data);
    }

    public static LocalDate lerDataIso(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return LocalDate.parse(linha);
            } catch (DateTimeParseException erro) {
                System.out.println("Data inválida. Use o formato yyyy-MM-dd. Exemplo: 2026-07-07");
            }
        }
    }
}
```

Entrada válida:

```text
2026-07-07
```

Entrada inválida:

```text
07/07/2026
```

O programa não quebra.

Ele explica o formato esperado.

---

## Prompt claro

Prompt é a mensagem que pede informação ao usuário.

Prompt ruim:

```text
Digite:
```

Prompt melhor:

```text
Digite o nome do cliente:
```

Prompt melhor ainda:

```text
Digite o nome do cliente (obrigatório):
```

Prompt para formato:

```text
Digite a data de agendamento (yyyy-MM-dd):
```

Prompt para faixa:

```text
Digite a quantidade de itens (1 a 100):
```

Prompt claro reduz erro de entrada.

---

## Mensagem de erro clara

Erro ruim:

```text
Inválido.
```

Erro melhor:

```text
Digite um número inteiro válido.
```

Erro melhor ainda:

```text
Quantidade inválida. Digite um número inteiro entre 1 e 100.
```

Mensagem boa deve dizer:

```text
o que está errado;
qual formato esperado;
como corrigir.
```

Não precisa ser gigante.

Precisa ser útil.

---

## Leitura segura não é só try/catch

Console robusto não é apenas colocar `try/catch`.

Console robusto envolve:

```text
prompt claro;
entrada como texto;
trim/strip;
validação de obrigatório;
conversão controlada;
faixa;
mensagem útil;
repetição;
métodos pequenos;
nomes claros;
resultado confiável.
```

`try/catch` é uma parte.

Não é tudo.

---

## Fechar ou não fechar Scanner

Em muitos exemplos, você verá:

```java
scanner.close();
```

Mas cuidado.

Quando o Scanner usa:

```java
System.in
```

fechar o Scanner também fecha a entrada padrão.

Em programas pequenos que terminam logo, tudo bem.

Mas em exemplos com vários métodos, fechar cedo pode atrapalhar leituras futuras.

Nesta formação, em exemplos simples de console, podemos não fechar explicitamente o Scanner quando ele envolve `System.in`.

Em aplicações reais, gerenciamento de recursos precisa ser analisado caso a caso.

---

## Aplicação em cliente

Arquivo:

```text
ClienteConsole.java
```

Código:

```java
import java.util.Scanner;

public class ClienteConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Nome do cliente: ");
        String email = lerTextoObrigatorio(scanner, "E-mail do cliente: ");
        int idade = lerInteiroEntre(scanner, "Idade do cliente: ", 0, 130);

        Cliente cliente = new Cliente(nome, email, idade);

        System.out.println();
        System.out.println("Cliente cadastrado:");
        System.out.println(cliente);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite um valor entre " + minimo + " e " + maximo + ".");
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}

record Cliente(String nome, String email, int idade) {
}
```

Aqui temos:

```text
texto obrigatório;
inteiro com faixa;
record para agrupar dados;
saída clara.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoConsole.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class ProdutoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Nome do produto: ");
        BigDecimal preco = lerBigDecimalPositivo(scanner, "Preço do produto: ");
        int estoque = lerInteiroEntre(scanner, "Estoque inicial: ", 0, 100000);

        Produto produto = new Produto(nome, preco, estoque);

        System.out.println();
        System.out.println("Produto cadastrado:");
        System.out.println(produto);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static BigDecimal lerBigDecimalPositivo(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                BigDecimal valor = new BigDecimal(linha);

                if (valor.compareTo(BigDecimal.ZERO) > 0) {
                    return valor;
                }

                System.out.println("O valor deve ser maior que zero.");
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor decimal válido. Exemplo: 10.50");
            }
        }
    }

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite um valor entre " + minimo + " e " + maximo + ".");
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}

record Produto(String nome, BigDecimal preco, int estoque) {
}
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoConsole.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String codigo = lerTextoObrigatorio(scanner, "Código do pedido: ");
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        BigDecimal total = lerBigDecimalPositivo(scanner, "Total do pedido: ");

        Pedido pedido = new Pedido(codigo, cliente, total);

        System.out.println();
        System.out.println("Pedido registrado:");
        System.out.println("Código: " + pedido.codigo());
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Total: " + pedido.total());
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static BigDecimal lerBigDecimalPositivo(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                BigDecimal valor = new BigDecimal(linha);

                if (valor.compareTo(BigDecimal.ZERO) > 0) {
                    return valor;
                }

                System.out.println("O valor deve ser maior que zero.");
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor decimal válido. Exemplo: 10.50");
            }
        }
    }
}

record Pedido(String codigo, String cliente, BigDecimal total) {
}
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoConsole.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PagamentoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String codigo = lerTextoObrigatorio(scanner, "Código do pagamento: ");
        BigDecimal valor = lerBigDecimalPositivo(scanner, "Valor do pagamento: ");
        FormaPagamento forma = lerFormaPagamento(scanner);

        Pagamento pagamento = new Pagamento(codigo, valor, forma);

        System.out.println();
        System.out.println("Pagamento registrado:");
        System.out.println(pagamento);
    }

    public static FormaPagamento lerFormaPagamento(Scanner scanner) {
        while (true) {
            System.out.println("Forma de pagamento:");
            System.out.println("1 - PIX");
            System.out.println("2 - CARTAO");
            System.out.println("3 - BOLETO");

            int opcao = lerInteiroEntre(scanner, "Escolha: ", 1, 3);

            if (opcao == 1) {
                return FormaPagamento.PIX;
            }

            if (opcao == 2) {
                return FormaPagamento.CARTAO;
            }

            if (opcao == 3) {
                return FormaPagamento.BOLETO;
            }
        }
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static BigDecimal lerBigDecimalPositivo(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                BigDecimal valor = new BigDecimal(linha);

                if (valor.compareTo(BigDecimal.ZERO) > 0) {
                    return valor;
                }

                System.out.println("O valor deve ser maior que zero.");
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor decimal válido. Exemplo: 10.50");
            }
        }
    }

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite um valor entre " + minimo + " e " + maximo + ".");
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record Pagamento(String codigo, BigDecimal valor, FormaPagamento forma) {
}
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoConsole.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class OrdemServicoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String certificado = lerTextoObrigatorio(scanner, "Certificado da OS: ");
        LocalDate dataAgendamento = lerDataIso(scanner, "Data de agendamento (yyyy-MM-dd): ");
        String periodo = lerTextoObrigatorio(scanner, "Período (MANHA/TARDE): ");

        OrdemServico os = new OrdemServico(certificado, dataAgendamento, periodo.toUpperCase());

        System.out.println();
        System.out.println("OS registrada:");
        System.out.println(os);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static LocalDate lerDataIso(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return LocalDate.parse(linha);
            } catch (DateTimeParseException erro) {
                System.out.println("Data inválida. Use o formato yyyy-MM-dd. Exemplo: 2026-07-07");
            }
        }
    }
}

record OrdemServico(String certificado, LocalDate dataAgendamento, String periodo) {
}
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaConsole.java
```

Código:

```java
import java.util.Scanner;

public class MensageriaConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = lerTextoObrigatorio(scanner, "Nome do cliente: ");
        String certificado = lerTextoObrigatorio(scanner, "Certificado: ");
        boolean enviarAgora = confirmar(scanner, "Enviar mensagem agora? (S/N): ");

        Mensagem mensagem = new Mensagem(cliente, certificado, enviarAgora);

        System.out.println();
        System.out.println("Mensagem preparada:");
        System.out.println(mensagem);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static boolean confirmar(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String resposta = scanner.nextLine().trim();

            if (resposta.equalsIgnoreCase("S") || resposta.equalsIgnoreCase("SIM")) {
                return true;
            }

            if (resposta.equalsIgnoreCase("N") || resposta.equalsIgnoreCase("NAO") || resposta.equalsIgnoreCase("NÃO")) {
                return false;
            }

            System.out.println("Resposta inválida. Digite S para sim ou N para não.");
        }
    }
}

record Mensagem(String cliente, String certificado, boolean enviarAgora) {
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaConsole.java
```

Código:

```java
import java.time.Instant;
import java.util.Scanner;

public class AuditoriaConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String usuario = lerTextoObrigatorio(scanner, "Usuário: ");
        String operacao = lerTextoObrigatorio(scanner, "Operação: ");
        String entidade = lerTextoObrigatorio(scanner, "Entidade: ");
        long entidadeId = lerLongPositivo(scanner, "ID da entidade: ");

        RegistroAuditoria registro = new RegistroAuditoria(usuario, operacao, entidade, entidadeId, Instant.now());

        System.out.println();
        System.out.println("Registro de auditoria:");
        System.out.println(registro);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
    }

    public static long lerLongPositivo(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                long valor = Long.parseLong(linha);

                if (valor > 0) {
                    return valor;
                }

                System.out.println("O ID deve ser maior que zero.");
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro longo válido.");
            }
        }
    }
}

record RegistroAuditoria(String usuario, String operacao, String entidade, long entidadeId, Instant criadoEm) {
}
```

---

## Refatoração: leitura duplicada para utilitário

Quando vários arquivos repetem:

```java
lerTextoObrigatorio
lerInteiro
lerBigDecimalPositivo
confirmar
lerDataIso
```

isso indica uma oportunidade.

Em uma aula futura, com pacotes e classes, podemos criar:

```text
ConsoleInput.java
```

ou:

```text
LeitorConsole.java
```

Mas nesta aula ainda estamos em Java básico.

Então o objetivo é perceber:

```text
repetição existe;
método reduz duplicação;
classe utilitária virá depois;
pacotes virão na próxima aula.
```

Não vamos antecipar arquitetura.

Vamos preparar o terreno.

---

## Código ruim versus código melhor

### Ruim

```java
System.out.print("Idade: ");
int idade = scanner.nextInt();
```

Problemas:

```text
quebra com texto;
pode causar problema com nextLine depois;
não valida faixa;
mensagem pobre;
não repete.
```

### Melhor

```java
int idade = lerInteiroEntre(scanner, "Idade: ", 0, 130);
```

Ganhos:

```text
lê de forma segura;
valida formato;
valida faixa;
repete;
centraliza mensagem;
melhora intenção.
```

---

## Quando usar console robusto

Use console robusto quando:

```text
o programa depende de entrada do usuário;
a entrada pode vir vazia;
a entrada precisa de tipo específico;
a entrada precisa de faixa;
a entrada precisa de formato;
você quer evitar programa quebrando;
quer treinar validação;
quer simular fluxos antes de API;
quer criar exercício de lógica com qualidade.
```

Console robusto ajuda muito na fase de fundamentos.

---

## Quando evitar exagero

Evite criar uma arquitetura gigante para console simples.

Não precisa, nesta aula:

```text
framework;
camadas complexas;
injeção de dependência;
DTO avançado;
exceção própria para cada campo;
validador genérico demais;
classe abstrata;
reflection;
anotações;
biblioteca externa.
```

O objetivo é:

```text
ler bem;
validar bem;
repetir bem;
organizar em métodos.
```

---

## Erros comuns

### Erro 1 — Misturar `nextInt` e `nextLine` sem entender

Pode pular entrada.

---

### Erro 2 — Não tratar `NumberFormatException`

Programa quebra com texto inválido.

---

### Erro 3 — Aceitar vazio como válido sem querer

`""` pode virar dado ruim.

---

### Erro 4 — Prompt confuso

Usuário não sabe o que digitar.

---

### Erro 5 — Mensagem de erro genérica

Dizer apenas “erro” não ajuda.

---

### Erro 6 — Não repetir após erro

Programa termina sem permitir correção.

---

### Erro 7 — Loop infinito sem saída

A condição nunca muda ou o scanner não consome a entrada.

---

### Erro 8 — Usar `double` para dinheiro sem critério

Já sabemos que `BigDecimal` é melhor para valores monetários.

---

### Erro 9 — Fechar Scanner cedo demais

Pode fechar `System.in` e atrapalhar leituras futuras.

---

### Erro 10 — Copiar métodos sem entender

Console robusto deve ser entendido, não só colado.

---

## Diagnóstico de console

Quando o console falhar, pergunte:

### 1. O programa leu a entrada como linha?

Se usou `nextInt`, há risco de sobra de quebra de linha.

### 2. A entrada foi limpa?

Use `trim()` ou `strip()`.

### 3. Vazio foi tratado?

Use `isBlank()`.

### 4. Conversão está dentro de try/catch?

`Integer.parseInt`, `Long.parseLong` e `new BigDecimal` podem falhar.

### 5. A mensagem explica o formato esperado?

Mostre exemplo.

### 6. O loop repete corretamente?

Depois de erro, precisa voltar para perguntar.

### 7. A faixa foi validada?

Formato válido não significa valor aceitável.

### 8. O prompt é claro?

Prompt ruim aumenta erro.

### 9. O método está fazendo coisa demais?

Separe leitura, validação e ação principal quando fizer sentido.

### 10. A saída final confirma o que foi lido?

Mostrar resumo ajuda a validar.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.util.Scanner;

public class DebugConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade = lerInteiro(scanner, "Idade: ");

        System.out.println("Idade: " + idade);
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }
}
```

Coloque breakpoint em:

```java
String linha = scanner.nextLine().trim();
```

Teste entradas:

```text
abc
10
```

Observe:

```text
linha;
entrada inválida;
catch;
retorno ao while;
entrada válida;
return.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — misturar nextInt e nextLine

Reproduza o problema de pergunta pulada.

Explique a causa.

---

### Teste 2 — parse inválido

Digite:

```text
abc
```

em um método que usa `Integer.parseInt`.

Explique a exceção.

---

### Teste 3 — vazio

Aperte Enter em campo obrigatório.

O programa deve repetir.

---

### Teste 4 — valor fora da faixa

Digite:

```text
999
```

para idade.

O programa deve explicar a faixa.

---

### Teste 5 — decimal com vírgula

Digite:

```text
10,50
```

no método de `BigDecimal`.

Explique por que usamos `replace(",", ".")`.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-086-console-robusto
cd labs\m2\aula-086-console-robusto
```

Crie arquivos:

```text
Main.java
ProblemaNextInt.java
TextoObrigatorio.java
InteiroObrigatorio.java
InteiroComFaixa.java
DecimalBigDecimal.java
ConfirmacaoSimNao.java
MenuRobusto.java
DataLocalDate.java
ClienteConsole.java
ProdutoConsole.java
PedidoConsole.java
PagamentoConsole.java
OrdemServicoConsole.java
MensageriaConsole.java
AuditoriaConsole.java
DebugConsole.java
ErroNextIntNextLine.java
ErroSemTryCatch.java
ErroPromptConfuso.java
ErroLoopInfinito.java
ErroScannerFechadoCedo.java
README.md
```

Compile exemplos:

```powershell
javac Main.java
javac ProblemaNextInt.java
javac TextoObrigatorio.java
javac InteiroObrigatorio.java
javac InteiroComFaixa.java
javac DecimalBigDecimal.java
javac ConfirmacaoSimNao.java
javac MenuRobusto.java
javac DataLocalDate.java
javac ClienteConsole.java
javac ProdutoConsole.java
javac PedidoConsole.java
javac PagamentoConsole.java
javac OrdemServicoConsole.java
javac MensageriaConsole.java
javac AuditoriaConsole.java
javac DebugConsole.java
```

Execute exemplos:

```powershell
java Main
java ProblemaNextInt
java TextoObrigatorio
java InteiroObrigatorio
java InteiroComFaixa
java DecimalBigDecimal
java ConfirmacaoSimNao
java MenuRobusto
java DataLocalDate
java ClienteConsole
java ProdutoConsole
java PedidoConsole
java PagamentoConsole
java OrdemServicoConsole
java MensageriaConsole
java AuditoriaConsole
java DebugConsole
```

Arquivos de erro ou leitura crítica:

```text
ErroNextIntNextLine.java
ErroSemTryCatch.java
ErroPromptConfuso.java
ErroLoopInfinito.java
ErroScannerFechadoCedo.java
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 086 — Entrada/saída básica com console robusto

## Objetivo

Praticar entrada e saída no console com leitura segura, prompts claros, validação, repetição e conversão controlada.

## Conceitos

- `System.out.print`
- `System.out.println`
- `Scanner`
- `nextLine`
- problema de `nextInt` com `nextLine`
- `trim`
- `isBlank`
- `Integer.parseInt`
- `Long.parseLong`
- `BigDecimal`
- `LocalDate.parse`
- `try/catch`
- `NumberFormatException`
- `DateTimeParseException`
- validação de faixa
- confirmação sim/não
- menu robusto
- métodos utilitários

## Comandos

```powershell
javac Main.java
java Main
javac MenuRobusto.java
java MenuRobusto
javac ClienteConsole.java
java ClienteConsole
```

## Observações

- Preferir `nextLine` e converter manualmente.
- Mostrar prompts claros.
- Repetir enquanto entrada for inválida.
- Não aceitar vazio quando o campo for obrigatório.
- Não usar `double` para dinheiro sem critério.
- Não fechar `Scanner` cedo demais quando usa `System.in`.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Executar exemplos |
| Debug | `Shift + F9` | Observar leitura e validação |
| Run | `Shift + F10` | Executar pela IDE |
| Step Over | `F8` em muitos keymaps | Avançar linha a linha |
| Step Into | `F7` em muitos keymaps | Entrar em método de leitura |
| Variables | janela Debug | Ver valor digitado |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `trim`, `isBlank`, parse |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Criar métodos de leitura |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar no console |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 086 — Entrada/saída básica com console robusto

### O que aprendi
Aprendi a ler entradas do console com mais segurança, usando `Scanner`, preferindo `nextLine`, limpando espaços, validando vazio, convertendo números com cuidado, tratando exceções e repetindo a pergunta até a entrada ser válida.

### O que pratiquei
Criei exemplos com texto obrigatório, inteiro, inteiro com faixa, BigDecimal, confirmação sim/não, menu robusto, data com LocalDate e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- System.out.print
- System.out.println
- Scanner
- nextLine
- nextInt
- trim
- isBlank
- parseInt
- parseLong
- BigDecimal
- LocalDate
- try/catch
- NumberFormatException
- DateTimeParseException
- loop de validação
- prompt claro
- mensagem de erro clara
- menu robusto
- métodos utilitários

### Arquivos criados
- `labs/m2/aula-086-console-robusto/Main.java`
- `labs/m2/aula-086-console-robusto/ProblemaNextInt.java`
- `labs/m2/aula-086-console-robusto/TextoObrigatorio.java`
- `labs/m2/aula-086-console-robusto/InteiroObrigatorio.java`
- `labs/m2/aula-086-console-robusto/InteiroComFaixa.java`
- `labs/m2/aula-086-console-robusto/DecimalBigDecimal.java`
- `labs/m2/aula-086-console-robusto/ConfirmacaoSimNao.java`
- `labs/m2/aula-086-console-robusto/MenuRobusto.java`
- `labs/m2/aula-086-console-robusto/DataLocalDate.java`
- `labs/m2/aula-086-console-robusto/ClienteConsole.java`
- `labs/m2/aula-086-console-robusto/ProdutoConsole.java`
- `labs/m2/aula-086-console-robusto/PedidoConsole.java`
- `labs/m2/aula-086-console-robusto/PagamentoConsole.java`
- `labs/m2/aula-086-console-robusto/OrdemServicoConsole.java`
- `labs/m2/aula-086-console-robusto/MensageriaConsole.java`
- `labs/m2/aula-086-console-robusto/AuditoriaConsole.java`
- `labs/m2/aula-086-console-robusto/DebugConsole.java`
- `labs/m2/aula-086-console-robusto/ErroNextIntNextLine.java`
- `labs/m2/aula-086-console-robusto/ErroSemTryCatch.java`
- `labs/m2/aula-086-console-robusto/ErroPromptConfuso.java`
- `labs/m2/aula-086-console-robusto/ErroLoopInfinito.java`
- `labs/m2/aula-086-console-robusto/ErroScannerFechadoCedo.java`
- `labs/m2/aula-086-console-robusto/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac MenuRobusto.java
java MenuRobusto
javac ClienteConsole.java
java ClienteConsole
javac AuditoriaConsole.java
java AuditoriaConsole
```

### Erros que quero evitar
- misturar `nextInt` e `nextLine` sem entender;
- não tratar `NumberFormatException`;
- aceitar vazio sem querer;
- criar prompt confuso;
- mostrar mensagem de erro genérica;
- não repetir após erro;
- criar loop infinito;
- usar `double` para dinheiro sem critério;
- fechar Scanner cedo demais;
- copiar método sem entender.

### Próximo passo
Estudar organização de pacotes desde cedo.
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
git add labs/m2/aula-086-console-robusto docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 086: pratica console robusto em Java"
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
1. O que é entrada no console?
2. O que é saída no console?
3. Qual a diferença entre print e println?
4. Para que serve Scanner?
5. Por que nextInt com nextLine pode causar problema?
6. Qual estratégia esta aula recomenda para leitura robusta?
7. Para que serve trim?
8. Para que serve isBlank?
9. Por que ler como String antes de converter?
10. O que pode lançar NumberFormatException?
11. Como validar texto obrigatório?
12. Como validar inteiro?
13. Como validar inteiro com faixa?
14. Por que BigDecimal é melhor para dinheiro?
15. Como ler confirmação sim/não?
16. Como criar menu robusto?
17. Como ler LocalDate em formato ISO?
18. O que é prompt claro?
19. O que é mensagem de erro clara?
20. Por que não fechar Scanner cedo demais?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar entrada e saída no console;
usar System.out.print;
usar System.out.println;
criar Scanner;
explicar nextLine;
explicar problema de nextInt com nextLine;
ler texto obrigatório;
usar trim;
usar isBlank;
ler inteiro com parseInt;
tratar NumberFormatException;
validar faixa;
ler BigDecimal positivo;
ler confirmação sim/não;
criar menu robusto;
ler LocalDate com tratamento de erro;
criar prompts claros;
criar mensagens de erro úteis;
refatorar leitura repetida para método;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar leitura inválida;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda criar classe utilitária em pacote separado.

Não precisa ainda usar arquitetura em camadas.

Não precisa ainda usar testes automatizados.

Não precisa ainda usar biblioteca de CLI.

Não precisa ainda usar Spring Boot.

Não precisa ainda ler arquivo.

Esses assuntos virão depois.

O objetivo é dominar entrada de console com robustez suficiente para exercícios sérios.

---

## Fechamento da aula

Hoje estudamos entrada/saída básica com console robusto.

A ideia central foi:

```text
programa de console não deve quebrar com a primeira entrada inválida.
```

Vimos que:

```text
prompt claro reduz erro;
nextLine é mais previsível para leitura robusta;
texto deve ser limpo com trim;
vazio deve ser validado com isBlank;
números devem ser convertidos com try/catch;
faixa deve ser validada depois do formato;
BigDecimal é melhor para dinheiro;
LocalDate exige formato claro;
menu precisa limitar opções;
métodos pequenos reduzem repetição;
mensagens de erro precisam ajudar o usuário.
```

O ponto mais importante é:

```text
ler bem é parte de programar bem.
```

Na próxima aula, vamos estudar:

```text
Organização de pacotes desde cedo.
```

A próxima aula vai explicar `package`, `import`, nomes, separação por domínio, `app`, `util`, organização inicial e como parar de deixar todos os arquivos soltos no mesmo lugar.
