# 097 — M3.08 — Métodos de leitura

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M3.08.01` — Métodos de leitura — Conceito profundo e quando usar.
- `M3.08.02` — Métodos de leitura — Implementação guiada com código realista.
- `M3.08.03` — Métodos de leitura — Refatoração, melhoria e leitura crítica.
- `M3.08.04` — Métodos de leitura — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `lerInteiro`, `lerDouble`, `lerTexto`, leitura com `Scanner`, validação centralizada, repetição até entrada válida, tratamento de erro no console, separação entre leitura, cálculo e exibição, refatoração de leituras duplicadas, leitura aplicada a cliente, produto, pedido, pagamento, OS, mensageria, auditoria e checklist de aprovação.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
```

Antes de começar:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK configurado;
terminal integrado funciona;
debug funciona;
renomear método/parâmetro está acessível;
extrair método está acessível;
introduzir variável está acessível.
```

A prática desta aula será feita em:

```text
labs/m3/aula-097-metodos-de-leitura
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

A sequência recente foi:

```text
093 — M3.04 — Parâmetros demais e alternativas;
094 — M3.05 — Retorno boolean para validação;
095 — M3.06 — Métodos de cálculo;
096 — M3.07 — Métodos de exibição;
097 — M3.08 — Métodos de leitura.
```

Na aula anterior, estudamos métodos de exibição.

A regra principal foi:

```text
quem exibe deve exibir;
quem calcula deve calcular;
quem lê deve ler.
```

Agora vamos estudar a parte de leitura.

Em programas console, isso significa:

```text
mostrar um prompt;
ler texto digitado;
converter para número quando necessário;
validar;
repetir se estiver inválido;
retornar o valor pronto para uso.
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
097 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 97
Aulas oficiais restantes: 441
```

Contando o arquivo de abertura `000`, teremos:

```text
98 arquivos gerados no total.
```

---

## A pergunta central da aula

Qual código é mais profissional?

```java
System.out.print("Idade: ");
int idade = Integer.parseInt(scanner.nextLine());

System.out.print("Quantidade: ");
int quantidade = Integer.parseInt(scanner.nextLine());

System.out.print("Estoque: ");
int estoque = Integer.parseInt(scanner.nextLine());
```

ou:

```java
int idade = lerInteiro(scanner, "Idade: ");
int quantidade = lerInteiro(scanner, "Quantidade: ");
int estoque = lerInteiro(scanner, "Estoque: ");
```

A segunda versão é melhor porque a regra de leitura fica centralizada.

A pergunta central da aula é:

```text
como criar métodos de leitura que deixam o main mais limpo e evitam repetição de Scanner, parse e validação?
```

---

## O que é método de leitura

Método de leitura é um método responsável por receber entrada do usuário.

No console, geralmente envolve:

```text
mostrar prompt;
ler linha com Scanner;
normalizar texto;
converter tipo;
validar;
repetir enquanto estiver inválido;
retornar valor pronto.
```

Exemplos:

```java
public static String lerTexto(Scanner scanner, String prompt)
```

```java
public static String lerTextoObrigatorio(Scanner scanner, String prompt)
```

```java
public static int lerInteiro(Scanner scanner, String prompt)
```

```java
public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo)
```

```java
public static double lerDouble(Scanner scanner, String prompt)
```

```java
public static BigDecimal lerBigDecimal(Scanner scanner, String prompt)
```

Nesta aula, o foco principal da grade é:

```text
lerInteiro;
lerDouble;
lerTexto;
validação centralizada.
```

Também veremos `BigDecimal` como extensão natural para valores monetários.

---

## Por que não deixar tudo no main

Código ruim:

```java
Scanner scanner = new Scanner(System.in);

System.out.print("Nome: ");
String nome = scanner.nextLine();

System.out.print("Idade: ");
int idade = Integer.parseInt(scanner.nextLine());

System.out.print("E-mail: ");
String email = scanner.nextLine();
```

Esse código parece simples.

Mas conforme cresce, aparecem problemas:

```text
parse repetido;
mensagens repetidas;
try/catch repetido;
validação repetida;
main gigante;
tratamento de erro espalhado;
difícil mudar padrão de leitura;
difícil testar mentalmente.
```

Com métodos:

```java
String nome = lerTextoObrigatorio(scanner, "Nome: ");
int idade = lerInteiroEntre(scanner, "Idade: ", 0, 130);
String email = lerTextoObrigatorio(scanner, "E-mail: ");
```

O `main` conta a história.

Os detalhes ficam nos métodos.

---

## Scanner: regra recomendada nesta formação

Nesta fase, vamos preferir:

```java
scanner.nextLine()
```

e converter manualmente com:

```java
Integer.parseInt(...)
Double.parseDouble(...)
new BigDecimal(...)
```

Por quê?

Porque misturar:

```java
nextInt()
nextDouble()
nextLine()
```

costuma gerar confusão com quebra de linha pendente.

Exemplo clássico:

```java
int idade = scanner.nextInt();
String nome = scanner.nextLine();
```

O `nextLine()` pode capturar a quebra de linha deixada pelo `nextInt()`.

Para evitar isso, nesta formação:

```text
leia tudo com nextLine;
converta depois.
```

Essa regra reduz erro para quem está consolidando fundamentos.

---

## Método `lerTexto`

Arquivo:

```text
LeituraTextoBasica.java
```

Código:

```java
import java.util.Scanner;

public class LeituraTextoBasica {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTexto(scanner, "Digite seu nome: ");

        System.out.println("Nome informado: " + nome);
    }

    public static String lerTexto(Scanner scanner, String prompt) {
        System.out.print(prompt);

        return scanner.nextLine();
    }
}
```

Esse método é simples.

Ele:

```text
mostra prompt;
lê linha;
retorna texto.
```

Ainda não valida obrigatório.

---

## Método `lerTextoObrigatorio`

Arquivo:

```text
LeituraTextoObrigatorio.java
```

Código:

```java
import java.util.Scanner;

public class LeituraTextoObrigatorio {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Nome: ");

        System.out.println("Nome informado: " + nome);
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

Aqui temos um padrão importante:

```text
enquanto não houver valor válido, continue pedindo.
```

Esse é um dos métodos mais úteis para console.

---

## Método `lerInteiro`

Arquivo:

```text
LeituraInteiro.java
```

Código:

```java
import java.util.Scanner;

public class LeituraInteiro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade = lerInteiro(scanner, "Idade: ");

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

Esse método:

```text
lê texto;
tenta converter para int;
retorna se conseguir;
mostra erro se não conseguir;
repete.
```

---

## Método `lerInteiroEntre`

Arquivo:

```text
LeituraInteiroEntre.java
```

Código:

```java
import java.util.Scanner;

public class LeituraInteiroEntre {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao = lerInteiroEntre(scanner, "Opção: ", 0, 4);

        System.out.println("Opção escolhida: " + opcao);
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

Aqui reaproveitamos:

```java
lerInteiro(...)
```

dentro de:

```java
lerInteiroEntre(...)
```

Isso é reuso.

---

## Método `lerDouble`

Arquivo:

```text
LeituraDouble.java
```

Código:

```java
import java.util.Scanner;

public class LeituraDouble {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double nota = lerDouble(scanner, "Nota: ");

        System.out.println("Nota informada: " + nota);
    }

    public static double lerDouble(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return Double.parseDouble(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número decimal válido.");
            }
        }
    }
}
```

Observe:

```java
replace(",", ".")
```

Isso permite digitar:

```text
7,5
```

e converter como:

```text
7.5
```

Em sistemas reais, locale deve ser tratado com mais cuidado.

Aqui é uma simplificação didática.

---

## Método `lerBigDecimal`

Embora a grade cite `lerDouble`, para valores monetários é melhor usar `BigDecimal`.

Arquivo:

```text
LeituraBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class LeituraBigDecimal {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        BigDecimal valor = lerBigDecimal(scanner, "Valor: ");

        System.out.println("Valor informado: " + valor);
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return new BigDecimal(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor monetário válido.");
            }
        }
    }
}
```

Use `BigDecimal` para dinheiro.

Use `double` para exemplos didáticos, média simples e cálculos não financeiros de baixa criticidade.

---

## Validação centralizada

Validação centralizada significa não repetir a mesma regra em vários lugares.

Ruim:

```java
System.out.print("Nome: ");
String nome = scanner.nextLine().trim();

while (nome.isBlank()) {
    System.out.println("Nome obrigatório.");
    System.out.print("Nome: ");
    nome = scanner.nextLine().trim();
}
```

Repetir isso para cliente, produto, email, certificado, operação e entidade gera duplicação.

Melhor:

```java
String nome = lerTextoObrigatorio(scanner, "Nome: ");
String email = lerTextoObrigatorio(scanner, "E-mail: ");
String certificado = lerTextoObrigatorio(scanner, "Certificado: ");
```

A validação fica em um método.

---

## Separação de responsabilidades

Método de leitura pode:

```text
mostrar prompt;
ler entrada;
converter;
validar formato básico;
repetir se inválido;
retornar valor.
```

Método de leitura não deveria:

```text
calcular desconto;
salvar no banco;
registrar auditoria;
enviar mensagem;
processar pedido inteiro;
decidir regra de negócio complexa.
```

Exemplo bom:

```java
int quantidade = lerInteiroEntre(scanner, "Quantidade: ", 1, 999);
```

Exemplo ruim:

```java
Pedido pedido = lerValidarCalcularSalvarPedido(scanner);
```

O nome já denuncia excesso.

---

## Aplicação em cliente

Arquivo:

```text
CadastroClienteConsole.java
```

Código:

```java
import java.util.Scanner;

public class CadastroClienteConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        ClienteEntrada cliente = lerCliente(scanner);

        imprimirCliente(cliente);
    }

    public static ClienteEntrada lerCliente(Scanner scanner) {
        String nome = lerTextoObrigatorio(scanner, "Nome: ");
        String email = lerTextoObrigatorio(scanner, "E-mail: ");
        int idade = lerInteiroEntre(scanner, "Idade: ", 0, 130);

        return new ClienteEntrada(nome, email, idade);
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

    public static void imprimirCliente(ClienteEntrada cliente) {
        System.out.println("Cliente cadastrado:");
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Idade: " + cliente.idade());
    }
}

record ClienteEntrada(String nome, String email, int idade) {
}
```

O método `lerCliente` coordena leitura de cliente.

Ele não calcula.

Ele não salva.

Ele não envia mensagem.

---

## Aplicação em produto

Arquivo:

```text
CadastroProdutoConsole.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class CadastroProdutoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        ProdutoEntrada produto = lerProduto(scanner);

        imprimirProduto(produto);
    }

    public static ProdutoEntrada lerProduto(Scanner scanner) {
        String nome = lerTextoObrigatorio(scanner, "Produto: ");
        BigDecimal preco = lerBigDecimalPositivo(scanner, "Preço: ");
        int estoque = lerInteiroEntre(scanner, "Estoque: ", 0, 999999);

        return new ProdutoEntrada(nome, preco, estoque);
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
            BigDecimal valor = lerBigDecimal(scanner, prompt);

            if (valor.compareTo(BigDecimal.ZERO) > 0) {
                return valor;
            }

            System.out.println("Digite um valor maior que zero.");
        }
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return new BigDecimal(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor monetário válido.");
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

    public static void imprimirProduto(ProdutoEntrada produto) {
        System.out.println("Produto cadastrado:");
        System.out.println("Nome: " + produto.nome());
        System.out.println("Preço: " + produto.preco());
        System.out.println("Estoque: " + produto.estoque());
    }
}

record ProdutoEntrada(String nome, BigDecimal preco, int estoque) {
}
```

Aqui usamos:

```text
lerTextoObrigatorio;
lerBigDecimalPositivo;
lerInteiroEntre.
```

---

## Aplicação em pedido

Arquivo:

```text
CriacaoPedidoConsole.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class CriacaoPedidoConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        PedidoEntrada pedido = lerPedido(scanner);
        BigDecimal total = calcularTotalPedido(pedido);

        imprimirResumoPedido(pedido, total);
    }

    public static PedidoEntrada lerPedido(Scanner scanner) {
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String produto = lerTextoObrigatorio(scanner, "Produto: ");
        BigDecimal precoUnitario = lerBigDecimalPositivo(scanner, "Preço unitário: ");
        int quantidade = lerInteiroEntre(scanner, "Quantidade: ", 1, 999);

        return new PedidoEntrada(cliente, produto, precoUnitario, quantidade);
    }

    public static BigDecimal calcularTotalPedido(PedidoEntrada pedido) {
        return pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()));
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
            BigDecimal valor = lerBigDecimal(scanner, prompt);

            if (valor.compareTo(BigDecimal.ZERO) > 0) {
                return valor;
            }

            System.out.println("Digite um valor maior que zero.");
        }
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return new BigDecimal(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor monetário válido.");
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

    public static void imprimirResumoPedido(PedidoEntrada pedido, BigDecimal total) {
        System.out.println("Resumo do pedido:");
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Preço unitário: " + pedido.precoUnitario());
        System.out.println("Quantidade: " + pedido.quantidade());
        System.out.println("Total: " + total);
    }
}

record PedidoEntrada(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
}
```

Observe a separação:

```text
lerPedido -> leitura;
calcularTotalPedido -> cálculo;
imprimirResumoPedido -> exibição.
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

        PagamentoEntrada pagamento = lerPagamento(scanner);

        imprimirPagamento(pagamento);
    }

    public static PagamentoEntrada lerPagamento(Scanner scanner) {
        String codigo = lerTextoObrigatorio(scanner, "Código do pagamento: ");
        BigDecimal valor = lerBigDecimalPositivo(scanner, "Valor: ");
        FormaPagamento forma = lerFormaPagamento(scanner);

        return new PagamentoEntrada(codigo, valor, forma);
    }

    public static FormaPagamento lerFormaPagamento(Scanner scanner) {
        while (true) {
            System.out.println("Formas de pagamento:");
            System.out.println("1 - PIX");
            System.out.println("2 - CARTAO");
            System.out.println("3 - BOLETO");

            int opcao = lerInteiroEntre(scanner, "Opção: ", 1, 3);

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
            BigDecimal valor = lerBigDecimal(scanner, prompt);

            if (valor.compareTo(BigDecimal.ZERO) > 0) {
                return valor;
            }

            System.out.println("Digite um valor maior que zero.");
        }
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return new BigDecimal(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor monetário válido.");
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

    public static void imprimirPagamento(PagamentoEntrada pagamento) {
        System.out.println("Pagamento:");
        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor: " + pagamento.valor());
        System.out.println("Forma: " + pagamento.forma());
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record PagamentoEntrada(String codigo, BigDecimal valor, FormaPagamento forma) {
}
```

---

## Aplicação em OS

Arquivo:

```text
AgendamentoOsConsole.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class AgendamentoOsConsole {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        AgendamentoOs agendamento = lerAgendamento(scanner);

        imprimirAgendamento(agendamento);
    }

    public static AgendamentoOs lerAgendamento(Scanner scanner) {
        String certificado = lerTextoObrigatorio(scanner, "Certificado: ");
        LocalDate data = lerData(scanner, "Data do agendamento (AAAA-MM-DD): ");
        Periodo periodo = lerPeriodo(scanner);

        return new AgendamentoOs(certificado, data, periodo);
    }

    public static LocalDate lerData(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return LocalDate.parse(linha);
            } catch (DateTimeParseException erro) {
                System.out.println("Digite uma data válida no formato AAAA-MM-DD.");
            }
        }
    }

    public static Periodo lerPeriodo(Scanner scanner) {
        while (true) {
            System.out.println("Período:");
            System.out.println("1 - MANHA");
            System.out.println("2 - TARDE");

            int opcao = lerInteiroEntre(scanner, "Opção: ", 1, 2);

            if (opcao == 1) {
                return Periodo.MANHA;
            }

            if (opcao == 2) {
                return Periodo.TARDE;
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

    public static void imprimirAgendamento(AgendamentoOs agendamento) {
        System.out.println("Agendamento:");
        System.out.println("Certificado: " + agendamento.certificado());
        System.out.println("Data: " + agendamento.data());
        System.out.println("Período: " + agendamento.periodo());
    }
}

enum Periodo {
    MANHA,
    TARDE
}

record AgendamentoOs(String certificado, LocalDate data, Periodo periodo) {
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

        DadosMensagem dados = lerDadosMensagem(scanner);

        imprimirDadosMensagem(dados);
    }

    public static DadosMensagem lerDadosMensagem(Scanner scanner) {
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String telefone = lerTextoObrigatorio(scanner, "Telefone: ");
        TipoMensagem tipo = lerTipoMensagem(scanner);

        return new DadosMensagem(cliente, telefone, tipo);
    }

    public static TipoMensagem lerTipoMensagem(Scanner scanner) {
        while (true) {
            System.out.println("Tipo de mensagem:");
            System.out.println("1 - BOAS_VINDAS");
            System.out.println("2 - ENTREGA");
            System.out.println("3 - NPS");

            int opcao = lerInteiroEntre(scanner, "Opção: ", 1, 3);

            if (opcao == 1) {
                return TipoMensagem.BOAS_VINDAS;
            }

            if (opcao == 2) {
                return TipoMensagem.ENTREGA;
            }

            if (opcao == 3) {
                return TipoMensagem.NPS;
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

    public static void imprimirDadosMensagem(DadosMensagem dados) {
        System.out.println("Dados da mensagem:");
        System.out.println("Cliente: " + dados.cliente());
        System.out.println("Telefone: " + dados.telefone());
        System.out.println("Tipo: " + dados.tipo());
    }
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}

record DadosMensagem(String cliente, String telefone, TipoMensagem tipo) {
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

        RegistroAuditoria auditoria = lerRegistroAuditoria(scanner);

        imprimirAuditoria(auditoria);
    }

    public static RegistroAuditoria lerRegistroAuditoria(Scanner scanner) {
        String usuario = lerTextoObrigatorio(scanner, "Usuário: ");
        OperacaoAuditoria operacao = lerOperacao(scanner);
        String entidade = lerTextoObrigatorio(scanner, "Entidade: ");
        long entidadeId = lerLongPositivo(scanner, "ID da entidade: ");

        return new RegistroAuditoria(usuario, operacao, entidade, entidadeId, Instant.now());
    }

    public static OperacaoAuditoria lerOperacao(Scanner scanner) {
        while (true) {
            System.out.println("Operação:");
            System.out.println("1 - CRIACAO");
            System.out.println("2 - EDICAO");
            System.out.println("3 - EXCLUSAO");

            int opcao = lerInteiroEntre(scanner, "Opção: ", 1, 3);

            if (opcao == 1) {
                return OperacaoAuditoria.CRIACAO;
            }

            if (opcao == 2) {
                return OperacaoAuditoria.EDICAO;
            }

            if (opcao == 3) {
                return OperacaoAuditoria.EXCLUSAO;
            }
        }
    }

    public static long lerLongPositivo(Scanner scanner, String prompt) {
        while (true) {
            long valor = lerLong(scanner, prompt);

            if (valor > 0) {
                return valor;
            }

            System.out.println("Digite um valor maior que zero.");
        }
    }

    public static long lerLong(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Long.parseLong(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro longo válido.");
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

    public static void imprimirAuditoria(RegistroAuditoria auditoria) {
        System.out.println("Auditoria:");
        System.out.println("Usuário: " + auditoria.usuario());
        System.out.println("Operação: " + auditoria.operacao());
        System.out.println("Entidade: " + auditoria.entidade());
        System.out.println("Entidade ID: " + auditoria.entidadeId());
        System.out.println("Criado em: " + auditoria.criadoEm());
    }
}

enum OperacaoAuditoria {
    CRIACAO,
    EDICAO,
    EXCLUSAO
}

record RegistroAuditoria(
        String usuario,
        OperacaoAuditoria operacao,
        String entidade,
        long entidadeId,
        Instant criadoEm
) {
}
```

---

## Criando uma classe utilitária de leitura

À medida que os exemplos crescem, repetimos:

```text
lerTextoObrigatorio;
lerInteiro;
lerInteiroEntre;
lerBigDecimal;
lerBigDecimalPositivo.
```

Isso indica uma classe de apoio.

Arquivo:

```text
ConsoleInput.java
```

Código:

```java
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public final class ConsoleInput {
    private ConsoleInput() {
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

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite um valor entre " + minimo + " e " + maximo + ".");
        }
    }

    public static double lerDouble(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return Double.parseDouble(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número decimal válido.");
            }
        }
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return new BigDecimal(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor monetário válido.");
            }
        }
    }

    public static BigDecimal lerBigDecimalPositivo(Scanner scanner, String prompt) {
        while (true) {
            BigDecimal valor = lerBigDecimal(scanner, prompt);

            if (valor.compareTo(BigDecimal.ZERO) > 0) {
                return valor;
            }

            System.out.println("Digite um valor maior que zero.");
        }
    }

    public static LocalDate lerData(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return LocalDate.parse(linha);
            } catch (DateTimeParseException erro) {
                System.out.println("Digite uma data válida no formato AAAA-MM-DD.");
            }
        }
    }
}
```

Essa classe utilitária é simples.

Ela prepara o caminho para organizar reuso sem duplicação.

---

## Usando ConsoleInput

Arquivo:

```text
PedidoComConsoleInput.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoComConsoleInput {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = ConsoleInput.lerTextoObrigatorio(scanner, "Cliente: ");
        String produto = ConsoleInput.lerTextoObrigatorio(scanner, "Produto: ");
        BigDecimal preco = ConsoleInput.lerBigDecimalPositivo(scanner, "Preço: ");
        int quantidade = ConsoleInput.lerInteiroEntre(scanner, "Quantidade: ", 1, 999);

        BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

        System.out.println("Pedido:");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Total: " + total);
    }
}
```

Compile junto:

```powershell
javac ConsoleInput.java PedidoComConsoleInput.java
```

Execute:

```powershell
java PedidoComConsoleInput
```

---

## Fechar ou não fechar Scanner

Quando usamos:

```java
Scanner scanner = new Scanner(System.in);
```

se fecharmos esse scanner, também fechamos `System.in`.

Em programas pequenos, fechar no final pode parecer correto.

Mas durante aulas e exemplos, fechar `System.in` pode atrapalhar se outro trecho tentar ler depois.

Nesta formação, para exemplos simples de console, aceitaremos não fechar explicitamente o scanner de `System.in`.

Em aplicações maiores, gestão de recurso será tratada com mais cuidado.

---

## Refatoração: leitura duplicada

Antes:

```java
System.out.print("Nome: ");
String nome = scanner.nextLine().trim();

while (nome.isBlank()) {
    System.out.println("Nome obrigatório.");
    System.out.print("Nome: ");
    nome = scanner.nextLine().trim();
}

System.out.print("Produto: ");
String produto = scanner.nextLine().trim();

while (produto.isBlank()) {
    System.out.println("Produto obrigatório.");
    System.out.print("Produto: ");
    produto = scanner.nextLine().trim();
}
```

Depois:

```java
String nome = lerTextoObrigatorio(scanner, "Nome: ");
String produto = lerTextoObrigatorio(scanner, "Produto: ");
```

Ganho:

```text
menos duplicação;
regra centralizada;
main mais legível;
alteração mais fácil.
```

---

## Refatoração: parse espalhado

Antes:

```java
int idade = Integer.parseInt(scanner.nextLine());
int quantidade = Integer.parseInt(scanner.nextLine());
int estoque = Integer.parseInt(scanner.nextLine());
```

Depois:

```java
int idade = lerInteiro(scanner, "Idade: ");
int quantidade = lerInteiro(scanner, "Quantidade: ");
int estoque = lerInteiro(scanner, "Estoque: ");
```

Agora o tratamento de erro está centralizado.

---

## Refatoração: método de leitura fazendo demais

Ruim:

```java
public static void lerCalcularEImprimirPedido(Scanner scanner) {
    String cliente = scanner.nextLine();
    BigDecimal preco = new BigDecimal(scanner.nextLine());
    int quantidade = Integer.parseInt(scanner.nextLine());
    BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));

    System.out.println(total);
}
```

Melhor:

```java
PedidoEntrada pedido = lerPedido(scanner);
BigDecimal total = calcularTotalPedido(pedido);
imprimirResumoPedido(pedido, total);
```

Cada parte tem responsabilidade.

---

## Erros comuns

### Erro 1 — Misturar `nextInt` com `nextLine`

Pode sobrar quebra de linha.

Prefira `nextLine` e conversão manual nesta fase.

### Erro 2 — Não tratar `NumberFormatException`

Usuário pode digitar texto no lugar de número.

### Erro 3 — Loop infinito sem mensagem clara

Se a entrada é inválida, explique o que o usuário deve digitar.

### Erro 4 — Método de leitura fazendo cálculo

Leitura lê.

Cálculo calcula.

### Erro 5 — Método de leitura imprimindo resumo

Leitura não deve exibir relatório final.

### Erro 6 — Não usar `trim`

Espaços podem gerar comportamento estranho.

### Erro 7 — Aceitar texto obrigatório em branco

Use `isBlank`.

### Erro 8 — Usar double para dinheiro sem necessidade

Use BigDecimal para dinheiro.

### Erro 9 — Fechar Scanner de System.in cedo demais

Pode atrapalhar novas leituras.

### Erro 10 — Repetir validação em todos os lugares

Centralize.

---

## Diagnóstico

Quando leitura der errado:

```text
1. Verifique se está usando nextLine.
2. Verifique se a conversão está dentro de try/catch.
3. Verifique se o loop retorna quando valor é válido.
4. Verifique se a mensagem de erro é clara.
5. Verifique se usou trim.
6. Verifique se a validação de mínimo/máximo está correta.
7. Verifique se BigDecimal aceita vírgula ou ponto.
8. Verifique se a responsabilidade do método é só leitura.
9. Verifique se Scanner foi fechado antes da hora.
10. Teste entradas válidas e inválidas.
```

---

## Debug recomendado

Use debug em:

```text
LeituraInteiroEntre.java
```

Coloque breakpoints em:

```java
lerInteiroEntre(...)
lerInteiro(...)
Integer.parseInt(...)
```

Observe:

```text
linha digitada;
valor convertido;
exceção quando digita texto;
repetição do while;
retorno quando valor é válido.
```

Use debug em:

```text
CadastroProdutoConsole.java
```

Observe:

```text
leitura do nome;
leitura do preço;
leitura do estoque;
criação do record ProdutoEntrada.
```

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — digitar texto em inteiro

Digite:

```text
abc
```

em `lerInteiro`.

O programa deve pedir novamente.

### Teste 2 — digitar valor fora da faixa

Digite:

```text
99
```

em uma opção entre `1` e `3`.

O programa deve pedir novamente.

### Teste 3 — digitar texto em branco

Digite apenas espaços em `lerTextoObrigatorio`.

O programa deve pedir novamente.

### Teste 4 — remover try/catch

Remova o `try/catch` de `lerInteiro`.

Digite `abc`.

Observe o programa quebrar.

### Teste 5 — misturar nextInt e nextLine

Crie exemplo com `nextInt` seguido de `nextLine`.

Observe a leitura pulada.

### Teste 6 — fechar Scanner cedo

Feche o scanner e tente ler depois.

Observe o erro.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-097-metodos-de-leitura
cd labs\m3\aula-097-metodos-de-leitura
```

Crie arquivos:

```text
LeituraTextoBasica.java
LeituraTextoObrigatorio.java
LeituraInteiro.java
LeituraInteiroEntre.java
LeituraDouble.java
LeituraBigDecimal.java
CadastroClienteConsole.java
CadastroProdutoConsole.java
CriacaoPedidoConsole.java
PagamentoConsole.java
AgendamentoOsConsole.java
MensageriaConsole.java
AuditoriaConsole.java
ConsoleInput.java
PedidoComConsoleInput.java
ErroNextIntNextLine.java
ErroSemTryCatch.java
ErroScannerFechado.java
ErroLeituraFazendoCalculo.java
ErroValidacaoDuplicada.java
README.md
```

Compile exemplos simples:

```powershell
javac LeituraTextoBasica.java
javac LeituraTextoObrigatorio.java
javac LeituraInteiro.java
javac LeituraInteiroEntre.java
javac LeituraDouble.java
javac LeituraBigDecimal.java
```

Compile exemplos aplicados:

```powershell
javac CadastroClienteConsole.java
javac CadastroProdutoConsole.java
javac CriacaoPedidoConsole.java
javac PagamentoConsole.java
javac AgendamentoOsConsole.java
javac MensageriaConsole.java
javac AuditoriaConsole.java
```

Compile exemplo com utilitário:

```powershell
javac ConsoleInput.java PedidoComConsoleInput.java
```

Execute:

```powershell
java LeituraTextoObrigatorio
java LeituraInteiroEntre
java LeituraDouble
java LeituraBigDecimal
java CadastroClienteConsole
java CadastroProdutoConsole
java CriacaoPedidoConsole
java PagamentoConsole
java AgendamentoOsConsole
java MensageriaConsole
java AuditoriaConsole
java PedidoComConsoleInput
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 097 — Métodos de leitura

## Objetivo

Aprender a criar métodos de leitura com Scanner, centralizando entrada de texto, inteiro, decimal e valor monetário, com validação e repetição até entrada válida.

## Conceitos

- Método de leitura recebe entrada do usuário.
- Nesta fase, preferimos `nextLine`.
- Conversão deve ser feita com `parse`.
- `NumberFormatException` precisa ser tratada.
- `lerTextoObrigatorio` evita texto vazio.
- `lerInteiro` centraliza parse de int.
- `lerInteiroEntre` valida faixa.
- `lerDouble` lê decimal.
- `lerBigDecimal` lê valor monetário.
- Leitura deve ficar separada de cálculo e exibição.
- Scanner de `System.in` não deve ser fechado cedo demais.

## Comandos

```powershell
javac LeituraInteiroEntre.java
java LeituraInteiroEntre
javac ConsoleInput.java PedidoComConsoleInput.java
java PedidoComConsoleInput
```
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extract Method | ação da IDE | Extrair leitura repetida |
| Introduce Variable | ação da IDE | Nomear linha lida |
| Debug | `Shift + F9` | Observar leitura |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Over | `F8` em muitos keymaps | Avançar |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar parse |
| Compilar | `javac Arquivo.java` | Validar |
| Executar | `java Classe` | Testar interação |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 097 — Métodos de leitura

### O que aprendi

Aprendi a criar métodos de leitura com Scanner, usando `nextLine`, conversão manual, try/catch e repetição até entrada válida.

### O que pratiquei

Criei métodos `lerTexto`, `lerTextoObrigatorio`, `lerInteiro`, `lerInteiroEntre`, `lerDouble`, `lerBigDecimal`, `lerBigDecimalPositivo`, `lerData` e apliquei em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais

- Scanner
- nextLine
- prompt
- parse
- Integer.parseInt
- Double.parseDouble
- BigDecimal
- NumberFormatException
- DateTimeParseException
- while true
- return
- trim
- isBlank
- validação centralizada
- leitura separada de cálculo
- leitura separada de exibição
- ConsoleInput

### Arquivos criados

- `labs/m3/aula-097-metodos-de-leitura/LeituraTextoBasica.java`
- `labs/m3/aula-097-metodos-de-leitura/LeituraTextoObrigatorio.java`
- `labs/m3/aula-097-metodos-de-leitura/LeituraInteiro.java`
- `labs/m3/aula-097-metodos-de-leitura/LeituraInteiroEntre.java`
- `labs/m3/aula-097-metodos-de-leitura/LeituraDouble.java`
- `labs/m3/aula-097-metodos-de-leitura/LeituraBigDecimal.java`
- `labs/m3/aula-097-metodos-de-leitura/CadastroClienteConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/CadastroProdutoConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/CriacaoPedidoConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/PagamentoConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/AgendamentoOsConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/MensageriaConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/AuditoriaConsole.java`
- `labs/m3/aula-097-metodos-de-leitura/ConsoleInput.java`
- `labs/m3/aula-097-metodos-de-leitura/PedidoComConsoleInput.java`
- `labs/m3/aula-097-metodos-de-leitura/README.md`

### Comandos usados

```powershell
javac LeituraInteiroEntre.java
java LeituraInteiroEntre
javac CadastroProdutoConsole.java
java CadastroProdutoConsole
javac ConsoleInput.java PedidoComConsoleInput.java
java PedidoComConsoleInput
```

### Erros que quero evitar

- misturar `nextInt` com `nextLine`;
- não tratar `NumberFormatException`;
- não usar `trim`;
- aceitar texto obrigatório em branco;
- deixar loop sem mensagem clara;
- fazer cálculo dentro de método de leitura;
- imprimir relatório dentro de método de leitura;
- fechar Scanner cedo demais;
- repetir validação em vários lugares;
- usar double para dinheiro quando BigDecimal é melhor.
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
git add labs/m3/aula-097-metodos-de-leitura docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 097: centraliza metodos de leitura"
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
1. O que é método de leitura?
2. Por que preferimos nextLine nesta fase?
3. Qual problema de misturar nextInt e nextLine?
4. Para que serve lerTextoObrigatorio?
5. Para que serve lerInteiro?
6. Para que serve lerInteiroEntre?
7. Para que serve lerDouble?
8. Quando usar BigDecimal em leitura?
9. Por que tratar NumberFormatException?
10. Por que usar trim?
11. Por que usar isBlank?
12. Como criar leitura que repete até valor válido?
13. Qual responsabilidade de um método de leitura?
14. O que método de leitura não deveria fazer?
15. Por que não fechar Scanner de System.in cedo demais?
16. Como aplicar leitura em cliente?
17. Como aplicar leitura em produto?
18. Como aplicar leitura em OS?
19. Como ConsoleInput reduz duplicação?
20. Qual método de leitura você criou nesta aula e por quê?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar método de leitura;
usar Scanner com nextLine;
criar lerTexto;
criar lerTextoObrigatorio;
criar lerInteiro;
criar lerInteiroEntre;
criar lerDouble;
criar lerBigDecimal;
criar lerBigDecimalPositivo;
criar lerData;
tratar NumberFormatException;
tratar DateTimeParseException;
usar while para repetir até entrada válida;
usar trim;
usar isBlank;
separar leitura de cálculo;
separar leitura de exibição;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
criar ConsoleInput simples;
debugar leitura inválida;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda criar interface gráfica.

Não precisa ainda usar arquivos.

Não precisa ainda usar Spring.

Não precisa ainda usar Bean Validation.

Não precisa ainda usar JUnit.

Não precisa ainda usar bibliotecas externas de CLI.

Esses assuntos virão depois.

O objetivo é:

```text
centralizar leitura de console em métodos pequenos, reutilizáveis e seguros.
```

---

## Fechamento

Hoje estudamos métodos de leitura.

A ideia central foi:

```text
quem lê deve ler; quem calcula deve calcular; quem exibe deve exibir.
```

Vimos que:

```text
Scanner deve ser usado com cuidado;
nextLine reduz problemas nesta fase;
parse precisa de try/catch;
lerTextoObrigatorio centraliza texto obrigatório;
lerInteiro centraliza conversão;
lerInteiroEntre centraliza faixa;
lerDouble trata decimal;
lerBigDecimal é melhor para dinheiro;
validação centralizada reduz duplicação;
ConsoleInput prepara reuso;
método de leitura não deve fazer tudo.
```

O ponto mais importante é:

```text
entrada inválida é normal; código profissional precisa lidar com ela de forma previsível.
```

Na próxima aula, vamos estudar:

```text
Reuso sem duplicação.
```

A próxima aula vai aprofundar identificação de código repetido, extração segura, reaproveitamento, limites do reuso e como evitar duplicação sem criar abstração artificial.
