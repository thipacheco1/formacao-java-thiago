# 096 — Métodos de exibição

## Objetivo da aula

Nesta aula, você aprenderá a projetar e organizar **métodos de exibição (ou apresentação)**. O objetivo principal é consolidar a separação entre a lógica de negócios (processamento, regras e cálculos) e a interface de usuário (neste caso, o terminal de texto via console). Você entenderá quando e por que criar métodos com retorno `void` e como estruturar layouts de texto reutilizáveis e legíveis.

Ao final desta aula, você deverá ser capaz de:
- Projetar métodos especializados em exibir menus, mensagens de status e resumos de dados;
- Explicar o papel do tipo de retorno `void` em métodos de exibição;
- Utilizar *Text Blocks* (Java 15+) para formatar blocos de texto multilinha de forma limpa;
- Centralizar rotinas de console comuns em classes utilitárias para evitar duplicação de código.

---

## Explicação conceitual clara

### O que é um método de exibição?
Um método de exibição é aquele cuja única responsabilidade é renderizar e apresentar dados para o usuário ou para outros sistemas. No contexto de console, esses métodos concentram comandos como `System.out.println()` ou `System.out.printf()`.

### A regra do void
Diferente dos métodos de cálculo que computam e retornam novos dados (ex: `int`, `BigDecimal`), os métodos de exibição geralmente não precisam devolver informações a quem os chamou. Por isso, a assinatura padrão deles utiliza o tipo de retorno **`void`**.
No entanto, lembre-se: `void` indica ausência de valor de retorno, mas não significa ausência de responsabilidade. Um método `void` não deve conter lógica complexa de negócios ou realizar alterações ocultas de estado da aplicação.

### Text Blocks (Java 15+)
Ao criar menus longos ou relatórios no terminal, concatenar strings linha por linha gera um código poluído de ler. Os *Text Blocks* de Java, delimitados por três aspas duplas (`"""`), permitem escrever blocos multilinha mantendo a formatação e a indentação visual de forma nativa e limpa.

---

## Por que o assunto importa

No desenvolvimento de APIs backend comerciais, a separação da exibição é essencial. Hoje a exibição do seu sistema pode ser um terminal de texto, mas amanhã será um arquivo JSON retornado por um controlador web (Spring Boot). Se as regras de negócios estiverem acopladas a prints de tela, você terá que reescrever todo o sistema. Isolar o `System.out` em métodos ou classes dedicadas à visualização garante que a lógica de negócios permaneça intacta diante de qualquer mudança de interface.

---

## Criação da pasta da aula

Crie a pasta de laboratório para a aula de hoje:

```powershell
mkdir labs\m3\aula-096-metodos-de-exibicao
cd labs\m3\aula-096-metodos-de-exibicao
```

---

## Exemplos práticos completos

### Exemplo 1: `ExibicaoBasica.java`
Aqui criamos funções de impressão de linha e cabeçalhos reutilizáveis.

```java
public class ExibicaoBasica {
    public static void main(String[] args) {
        imprimirCabecalho("Sistema de Pedidos");
        imprimirMensagem("Bem-vindo ao sistema.");
        imprimirLinhaSeparadora();
        imprimirMensagem("Fim da execução.");
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirMensagem(String mensagem) {
        System.out.println(mensagem);
    }

    public static void imprimirLinhaSeparadora() {
        System.out.println("------------------------------------");
    }
}
```

### Exemplo 2: `MenuComTextBlock.java`
Demonstração do uso de Text Blocks em Java para menus de console.

```java
public class MenuComTextBlock {
    public static void main(String[] args) {
        imprimirMenu();
    }

    public static void imprimirMenu() {
        String menu = """
                ====================================
                MENU PRINCIPAL
                ====================================
                1 - Cadastrar cliente
                2 - Cadastrar produto
                3 - Criar pedido
                0 - Sair
                ------------------------------------
                Escolha uma opção:
                """;
        System.out.print(menu);
    }
}
```

### Exemplo 3: `ResumoPedidoConsole.java`
Neste exemplo, recebemos um objeto de transferência de dados (`record`) e apenas formatamos sua exibição.

```java
import java.math.BigDecimal;

public class ResumoPedidoConsole {
    public static void main(String[] args) {
        ResumoPedido resumo = new ResumoPedido(
                "Ana Silva",
                "Notebook Pro",
                new BigDecimal("5000.00"),
                new BigDecimal("500.00"),
                new BigDecimal("4500.00")
        );

        imprimirResumoPedido(resumo);
    }

    public static void imprimirResumoPedido(ResumoPedido resumo) {
        if (resumo == null) {
            System.out.println("[ERRO] Resumo do pedido é obrigatório.");
            return;
        }

        System.out.println("====================================");
        System.out.println("          RESUMO DO PEDIDO          ");
        System.out.println("====================================");
        System.out.println("Cliente:      " + resumo.cliente());
        System.out.println("Produto:      " + resumo.produto());
        System.out.println("Total Bruto:  R$ " + resumo.totalBruto());
        System.out.println("Desconto:     R$ " + resumo.desconto());
        System.out.println("Total Final:  R$ " + resumo.totalFinal());
        System.out.println("------------------------------------");
    }
}

record ResumoPedido(
        String cliente,
        String produto,
        BigDecimal totalBruto,
        BigDecimal desconto,
        BigDecimal totalFinal
) {}
```

### Exemplo 4: `ConsoleView.java` (Classe Utilitária)
Centralizando padrões de console para evitar duplicação de cabeçalhos e formatações de sucesso ou erro.

```java
public final class ConsoleView {
    private ConsoleView() {
        // Construtor privado previne instanciação
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(" " + titulo.toUpperCase());
        System.out.println("====================================");
    }

    public static void imprimirLinha() {
        System.out.println("------------------------------------");
    }

    public static void imprimirSucesso(String mensagem) {
        System.out.println("[SUCESSO] " + mensagem);
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}
```

---

## Explicação depois de cada exemplo

*   **`ExibicaoBasica.java`**: Mostra que podemos parametrizar strings fixas para reutilizar o layout visual de linhas e divisórias, evitando reescrever vários sinais de igual (`=`) pelo código.
*   **`MenuComTextBlock.java`**: Introduz o formato de aspas triplas. Note que a indentação do bloco dentro do código Java é compensada automaticamente pela IDE, mantendo o visual final encostado à esquerda no console.
*   **`ResumoPedidoConsole.java`**: Demonstra como receber um agrupador de dados (`record`) e extrair seus valores para apresentação, mantendo o método de exibição puramente visual.
*   **`ConsoleView.java`**: É uma classe utilitária contendo apenas métodos estáticos e um construtor privado. Ela centraliza a estilização de logs rápidos de terminal (ex: prefixando com `[ERRO]` ou `[SUCESSO]`).

---

## Boas práticas

1.  **Não calcule dentro da exibição**: Métodos de exibição não devem realizar descontos ou somas. Receba sempre o dado já calculado e pronto para ser impresso.
2.  **Não leia entradas na exibição**: Evite instanciar `Scanner` ou fazer leituras diretas dentro de métodos que deveriam apenas pintar dados.
3.  **Previna NullPointer**: Verifique se o objeto recebido para impressão é `null` antes de acessar seus atributos.
4.  **Use Construtores Privados para Utilitários**: Se a classe possui apenas métodos utilitários estáticos (como a `ConsoleView`), declare um construtor `private` para impedir que alguém crie instâncias dela.

---

## Erros comuns

*   **Esconder Lógica de Negócios no Print**: Calcular a taxa ou desconto diretamente no meio de um comando `println`.
*   **Retornos Desnecessários**: Criar um método `String imprimirErro(String msg)` que imprime e retorna a string original sem utilidade real de fluxo. Use `void`.
*   **Prints Espalhados e Fora de Padrão**: Ter cabeçalhos de tamanhos diferentes (`====` em um arquivo e `-------------` em outro). Centralizar a identidade visual do console facilita a manutenção.

---

## Atividade guiada

1.  Crie os arquivos `MenuComTextBlock.java` e `ConsoleView.java`.
2.  Compile e execute o arquivo `MenuComTextBlock.java`.
3.  Crie uma classe temporária de teste que chama `ConsoleView.imprimirSucesso("Operação executada")` e depois `ConsoleView.imprimirErro("Falha catastrófica")`. Certifique-se de que a formatação prefixada funciona no terminal.

---

## Desafio prático

Crie uma classe chamada `OrdemServicoExibicao.java`.

**Regras**:
1.  Crie um `record OrdemServico(String id, String cliente, String descricao, double preco)`.
2.  Crie um método estático `void exibirOS(OrdemServico os)` responsável por exibir a Ordem de Serviço formatada com divisórias e cabeçalhos.
3.  Se a OS for `null`, o método deve acionar o `ConsoleView.imprimirErro` informando que a OS não existe.
4.  No `main`, instancie duas OS (uma preenchida e outra nula) e teste o comportamento de exibição de ambas.

---

## Debug recomendado

1.  Coloque um breakpoint na primeira linha do método `exibirOS` do seu desafio.
2.  Execute o debug e use o **Step Over** (`F8`) para observar a sequência de renderização das linhas no console integrado do IntelliJ.

---

## Registro rápido da aula

Responda no seu arquivo de estudos:
1.  Por que métodos de exibição normalmente utilizam o retorno `void`?
2.  Qual é a principal facilidade trazida pelos *Text Blocks* ao lidar com menus de console?
3.  Qual o objetivo de criarmos uma classe como `ConsoleView` no nosso projeto?

---

## Critério de conclusão

Esta aula está concluída se você:
- Explicar com clareza a separação entre lógica de dados e interface console;
- Estruturar métodos estáticos com retorno `void` para renderização de texto;
- Utilizar *Text Blocks* e strings concatenadas de forma organizada;
- Concluir o desafio prático de exibição de OS sem realizar processamentos matemáticos dentro do método de exibição.

---

## Commit recomendado

Registre seu progresso no Git:

```bash
git status
git add labs/m3/aula-096-metodos-de-exibicao
git commit -m "Aula 096: Implementa metodos de exibicao e ConsoleView"
git status
```

---

## Fechamento

Nesta aula, consolidamos a separação entre a lógica computacional e a lógica de apresentação no terminal de console, padronizando cabeçalhos e retornos nulos (`void`).

Na próxima aula, abordaremos a terceira via dessa mini-arquitetura: os **Métodos de Leitura**, aprendendo a receber interações do usuário pelo teclado com validação direta de entrada.
