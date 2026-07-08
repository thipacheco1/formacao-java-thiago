# 097 — Métodos de leitura

## Objetivo da aula

Nesta aula, você aprenderá a criar e organizar **métodos de leitura** de dados do terminal de console. O objetivo é isolar a complexidade do recebimento de interações do teclado, tratando capturas de dados obrigatórios, conversões de tipos primitivos (`int`, `double`), tipos de objetos (`BigDecimal`) e, principalmente, a validação defensiva e tratamento de erros do console para evitar travamento da aplicação.

Ao final desta aula, você deverá ser capaz de:
- Utilizar a classe `java.util.Scanner` de forma segura no terminal;
- Resolver o bug clássico do consumo de quebra de linha (`\n`) deixado pelo método `nextInt()`;
- Tratar exceções de formato (como `NumberFormatException` ou `InputMismatchException`) causadas por entradas inválidas;
- Criar um utilitário de leitura dinâmico que repete a pergunta ao usuário até que ele digite uma entrada válida.

---

## Explicação conceitual clara

### O papel dos métodos de leitura
Métodos de leitura coletam e interpretam dados externos (entradas do teclado) e os transformam em dados estruturados do sistema. Eles servem como um "adaptador de entrada".

### O clássico bug do Scanner no Java
Ao usar o `Scanner` para ler um número usando `nextInt()` ou `nextDouble()`, o Java consome os dígitos digitados, mas deixa o caractere de quebra de linha (`\n` ou *Enter*) pendente no buffer do console. Se logo em seguida você chamar `nextLine()` para ler um texto, esse método consumirá o `\n` remanescente e retornará uma string vazia imediatamente, impedindo o usuário de digitar.

**Como evitar:**
Sempre que utilizar métodos numéricos do Scanner, consuma a quebra de linha executando um `scanner.nextLine()` fantasma logo após a leitura, ou leia tudo como string com `nextLine()` e faça o parse manual (ex: `Integer.parseInt(texto.trim())`).

### Validação defensiva com repetição (Looping de Entrada)
Para garantir que o programa não quebre caso o usuário digite letras onde se espera um número, criamos métodos com estrutura de repetição (`while(true)`) e blocos `try-catch`. O loop só é interrompido (`return` ou `break`) quando a entrada for convertida com sucesso.

---

## Por que o assunto importa

No ambiente de produção corporativo de APIs backend, o equivalente às leituras de console são os dados recebidos via JSON HTTP Request. Validar formatos numéricos e sanitizar strings vazias na borda da aplicação (na camada de controladores/API) impede que dados corrompidos atinjam o núcleo do seu banco de dados ou causem quebras inesperadas no servidor. Estudar esse isolamento no console solidifica seu entendimento sobre tratamento estruturado de dados.

---

## Criação da pasta da aula

Crie a pasta de laboratório no seu workspace:

```powershell
mkdir labs\m3\aula-097-metodos-de-leitura
cd labs\m3\aula-097-metodos-de-leitura
```

---

## Exemplos práticos completos

### Exemplo 1: `LeituraTextoObrigatorio.java`
Garante que o aluno não avance no fluxo enviando um campo de texto em branco.

```java
import java.util.Scanner;

public class LeituraTextoObrigatorio {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String nome = lerTextoObrigatorio(scanner, "Digite seu nome completo: ");
        System.out.println("Nome armazenado com sucesso: " + nome);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String instrucao) {
        while (true) {
            System.out.print(instrucao);
            String entrada = scanner.nextLine();

            if (entrada != null && !entrada.trim().isEmpty()) {
                return entrada.trim();
            }
            System.out.println("[ERRO] Este campo é obrigatório. Tente novamente.");
        }
    }
}
```

### Exemplo 2: `LeituraInteiro.java`
Aborda a leitura numérica segura com tratamento de erros de tipo.

```java
import java.util.Scanner;

public class LeituraInteiro {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int idade = lerInteiro(scanner, "Digite sua idade: ");
        System.out.println("Idade registrada: " + idade + " anos.");
    }

    public static int lerInteiro(Scanner scanner, String instrucao) {
        while (true) {
            System.out.print(instrucao);
            String entrada = scanner.nextLine(); // Leitura como String evita o bug do buffer

            try {
                return Integer.parseInt(entrada.trim());
            } catch (NumberFormatException e) {
                System.out.println("[ERRO] Valor numérico inválido. Por favor, digite um número inteiro.");
            }
        }
    }
}
```

### Exemplo 3: `ConsoleInput.java` (Classe Utilitária)
Centralizando todas as operações comuns de captura de console para reutilização em projetos maiores.

```java
import java.math.BigDecimal;
import java.util.Scanner;

public final class ConsoleInput {
    private ConsoleInput() {
    }

    public static String lerTexto(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = scanner.nextLine();
            if (entrada != null && !entrada.trim().isEmpty()) {
                return entrada.trim();
            }
            System.out.println("[ERRO] Texto inválido.");
        }
    }

    public static int lerInteiroPositivo(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = scanner.nextLine();
            try {
                int valor = Integer.parseInt(entrada.trim());
                if (valor > 0) {
                    return valor;
                }
                System.out.println("[ERRO] Digite um valor maior que zero.");
            } catch (NumberFormatException e) {
                System.out.println("[ERRO] Digite um número inteiro válido.");
            }
        }
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = scanner.nextLine();
            try {
                BigDecimal valor = new BigDecimal(entrada.trim());
                if (valor.compareTo(BigDecimal.ZERO) > 0) {
                    return valor;
                }
                System.out.println("[ERRO] Digite um valor decimal positivo.");
            } catch (NumberFormatException e) {
                System.out.println("[ERRO] Formato decimal inválido (use ponto como separador).");
            }
        }
    }
}
```

---

## Explicação depois de cada exemplo

*   **`LeituraTextoObrigatorio.java`**: Demonstra o uso de `entrada.trim().isEmpty()` para ignorar espaços em branco digitados pelo usuário (como apenas apertar a barra de espaço várias vezes).
*   **`LeituraInteiro.java`**: Ao invés de usar `scanner.nextInt()`, o exemplo utiliza `scanner.nextLine()` seguido de `Integer.parseInt()`. Isso limpa o buffer do teclado automaticamente e permite interceptar qualquer caractere inválido (letras) através do `NumberFormatException`.
*   **`ConsoleInput.java`**: Consolida essas lógicas defensivas em um único utilitário parametrizado. Métodos que exigem números positivos ou decimais são tratados internamente, retornando dados 100% higienizados para o chamador.

---

## Boas práticas

1.  **Use nextLine() como padrão**: Prefira capturar sempre strings completas com `nextLine()` e convertê-las manualmente. Isso evita o vazamento de quebra de linha residual no Scanner.
2.  **Não instancie múltiplos Scanners**: Evite abrir e fechar múltiplos objetos de `Scanner(System.in)` pelo código. Passe um único Scanner instanciado no `main` como parâmetro para seus métodos de leitura.
3.  **Nunca feche System.in**: Chamar `scanner.close()` fecha o stream de entrada padrão do sistema (`System.in`), o que impede novas leituras até que a aplicação seja reiniciada.

---

## Erros comuns

*   **Travamento por InputMismatchException**: Usar `scanner.nextInt()` e o usuário digitar "abc". Se não houver `try-catch`, o Java aborta o programa imediatamente.
*   **Menu Pulado**: O menu ou pergunta de texto não esperar a digitação do usuário. Isso acontece quase sempre quando um `nextInt()` foi usado anteriormente e a quebra de linha não foi consumida.
*   **Regra de Negócio na Leitura**: Criar métodos de leitura que fazem contas (como calcular desconto ou comissão). Leituras apenas recolhem dados.

---

## Atividade guiada

1.  Crie e execute a classe `LeituraInteiro.java`.
2.  No terminal de entrada, digite letras e aperte Enter. Observe que o programa exibe a mensagem de erro formatada e repete a pergunta, ao invés de lançar erro no terminal e travar.
3.  Digite `25` e observe o encerramento correto do programa.

---

## Desafio prático

Crie uma classe chamada `CadastroProdutoConsole.java`.

**Regras**:
1.  Utilize o utilitário `ConsoleInput.java` para capturar os dados do produto.
2.  O sistema deve perguntar e ler de forma segura:
    - Nome do produto (obrigatório);
    - Quantidade em estoque (inteiro positivo);
    - Preço do produto (`BigDecimal` positivo).
3.  Ao final da coleta, o sistema deve imprimir os dados do produto cadastrado em formato legível utilizando o utilitário `ConsoleView` desenvolvido na aula anterior (ou prints básicos organizados).

---

## Debug recomendado

1.  Insira um breakpoint no método `lerBigDecimal` de `ConsoleInput.java` durante o teste de cadastro.
2.  Acompanhe a conversão da string informada no terminal para o objeto `BigDecimal` na janela *Debugger* do IntelliJ.

---

## Registro rápido da aula

Responda em poucas linhas:
1.  Como acontece o bug do consumo de quebra de linha no `Scanner` e como contorná-lo?
2.  Qual é a vantagem de ler um valor numérico como String com `nextLine()` e realizar a conversão manual?
3.  Por que não devemos instanciar múltiplos objetos `Scanner(System.in)` ou fechá-los no código auxiliar?

---

## Critério de conclusão

Você concluiu esta aula se conseguir:
- Explicar o comportamento do buffer do console no Java;
- Utilizar `try-catch` para capturar e tratar entradas não numéricas com elegância;
- Criar entradas dinâmicas que validam limites mínimos (como valores estritamente positivos);
- Implementar o cadastro de produto rodando sobre a classe `ConsoleInput`.

---

## Commit recomendado

Salve suas alterações no repositório local:

```bash
git status
git add labs/m3/aula-097-metodos-de-leitura
git commit -m "Aula 097: Pratica metodos de leitura segura com Scanner"
git status
```

---

## Fechamento

Nesta aula, aprendemos a blindar nosso console de dados inesperados e formatos incompatíveis, garantindo que o programa continue rodando de forma resiliente mesmo com entradas erradas do usuário.

Na próxima aula, aprenderemos a reaproveitar esses blocos utilitários de exibição, leitura e cálculo de forma integrada, aplicando o princípio **DRY (Don't Repeat Yourself)** para evitar duplicações de código.
