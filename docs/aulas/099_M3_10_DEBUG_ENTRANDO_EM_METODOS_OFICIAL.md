# 099 — Debug entrando em métodos

## Objetivo da aula

Nesta aula, você aprenderá a dominar a depuração (debugging) de fluxos que transitam entre diferentes métodos e classes. O foco principal é entender a navegação interna de execução usando as ferramentas do IntelliJ IDEA, interpretando a **Call Stack (Pilha de Chamadas)** e inspecionando variáveis em tempo real enquanto transita entre métodos utilizando os comandos **Step Into**, **Step Over** e **Step Out**.

Ao final desta aula, você deverá ser capaz de:
- Explicar o que é e como funciona a Call Stack (Pilha de Chamadas) no Java;
- Utilizar os comandos de debug: Step Over (`F8`), Step Into (`F7`) e Step Out (`Shift + F8`);
- Rastrear a origem de um bug em cálculos ou validações navegando através de múltiplos métodos;
- Analisar a pilha de exceções (StackTrace) para encontrar a linha exata onde ocorreu um erro.

---

## Explicação conceitual clara

### O que é a Call Stack (Pilha de Chamadas)?
A pilha de chamadas (Call Stack) é a estrutura de dados que a JVM (Java Virtual Machine) usa para rastrear quais métodos estão ativos em um determinado momento e qual método chamou quem.
Quando o `main` chama o `metodoA()`, o `main` fica pausado e o `metodoA()` é empilhado no topo da execução. Se o `metodoA()` chama o `metodoB()`, o `metodoB()` vai para o topo da pilha. Quando `metodoB()` termina, ele é desempilhado e o Java retoma o `metodoA()` de onde parou.

### Comandos essenciais de Debug
Para navegar nessa pilha de chamadas, usamos os seguintes comandos da IDE:
*   **Step Over (F8):** Avança para a próxima linha do arquivo atual, sem entrar em métodos declarados na linha atual (ele executa o método por completo e vai para a próxima linha).
*   **Step Into (F7):** Entra no código do método que está na linha atual. Útil para navegar para dentro das suas funções auxiliares de cálculo ou validação.
*   **Step Out (Shift + F8):** Executa o restante do método atual e retorna imediatamente para a linha do método chamador (que estava abaixo na pilha).

---

## Por que o assunto importa

No ecossistema Java Backend real, o fluxo de uma única requisição web costuma atravessar dezenas de camadas: da API Controller, passando por Services, Validadores, Repositories até chegar ao driver do Banco de Dados. Quando ocorre um erro ou comportamento inesperado, ler o código de forma estática não é suficiente. Saber debugar entrando nos métodos e analisando a pilha de chamadas é o divisor de águas entre adivinhar onde está o problema e localizá-lo com precisão cirúrgica em segundos.

---

## Criação da pasta da aula

Crie a pasta de laboratório para a aula de hoje:

```powershell
mkdir labs\m3\aula-099-debug-entrando-em-metodos
cd labs\m3\aula-099-debug-entrando-em-metodos
```

---

## Exemplos práticos completos

### Exemplo 1: `DebugCallStack.java`
Este código ajuda a visualizar fisicamente a ordem de empilhamento de métodos no debugger.

```java
public class DebugCallStack {
    public static void main(String[] args) {
        System.out.println("Iniciando main...");
        executarPrimeiroNivel();
        System.out.println("Finalizando main...");
    }

    public static void executarPrimeiroNivel() {
        System.out.println("Entrou no Primeiro Nível");
        executarSegundoNivel();
        System.out.println("Saiu do Primeiro Nível");
    }

    public static void executarSegundoNivel() {
        System.out.println("Entrou no Segundo Nível (Topo da Pilha)");
        // Coloque um breakpoint na linha abaixo
        System.out.println("Executando lógica no topo...");
    }
}
```

### Exemplo 2: `DebugCalculoComBug.java`
Um cenário prático contendo um erro sutil em um cálculo encadeado de imposto e frete. Vamos identificar o bug via depuração.

```java
import java.math.BigDecimal;

public class DebugCalculoComBug {
    public static void main(String[] args) {
        BigDecimal precoProduto = new BigDecimal("100.00");
        int quantidade = 3;

        // O total esperado com frete fixo de R$ 15 e taxa de 5% sobre o total bruto seria R$ 330.00
        BigDecimal totalCalculado = processarCompra(precoProduto, quantidade);

        System.out.println("Total Calculado Final: R$ " + totalCalculado);
    }

    public static BigDecimal processarCompra(BigDecimal preco, int qtde) {
        BigDecimal totalBruto = preco.multiply(BigDecimal.valueOf(qtde));
        BigDecimal comImposto = aplicarImposto(totalBruto);
        // O bug está na linha abaixo: o frete não está sendo somado corretamente ao total final
        BigDecimal comFrete = aplicarFrete(totalBruto); 

        return comFrete;
    }

    public static BigDecimal aplicarImposto(BigDecimal valor) {
        BigDecimal taxa = new BigDecimal("0.05"); // 5%
        return valor.add(valor.multiply(taxa));
    }

    public static BigDecimal aplicarFrete(BigDecimal valor) {
        BigDecimal freteFixo = new BigDecimal("15.00");
        return valor.add(freteFixo);
    }
}
```

---

## Explicação depois de cada exemplo

*   **`DebugCallStack.java`**: Ao debugar este arquivo e parar no breakpoint do `executarSegundoNivel`, a aba *Frames* do IntelliJ mostrará o histórico de empilhamento: `executarSegundoNivel` no topo, `executarPrimeiroNivel` no meio e `main` na base.
*   **`DebugCalculoComBug.java`**: O cálculo do imposto (`aplicarImposto`) é calculado e guardado em `comImposto`, mas o método `processarCompra` acidentalmente passa `totalBruto` (sem o imposto) para a função `aplicarFrete`, descartando o valor do imposto na composição do preço final. Debugando passo a passo, você verá o valor cair de R$ 315.00 para R$ 315.00 novamente na inspeção de variáveis.

---

## Boas práticas

1.  **Observe os Frames (Pilha)**: A janela *Frames* no rodapé do depurador permite clicar nas funções anteriores da pilha para inspecionar os valores que as variáveis possuíam naquelas funções no momento da pausa.
2.  **Não entre em bibliotecas do Java (Step Over em APIs nativas)**: Ao depurar uma linha que contém métodos nativos como `System.out.println` ou `Math.max`, utilize o **Step Over** (`F8`), a menos que precise de fato inspecionar a classe nativa do JDK (o que raramente é o caso).
3.  **Use o Step Out**: Se você entrou acidentalmente em um método muito longo ou irrelevante usando o Step Into, pressione **Step Out** (`Shift + F8`) para voltar imediatamente ao método de origem.

---

## Erros comuns

*   **Avançar rápido demais (Step Over em tudo)**: Pressionar `F8` continuamente e passar direto pelo método que continha o bug, tendo que reiniciar o debug.
*   **Confundir a StackTrace de Exceptions**: A leitura de uma StackTrace de erro no console deve ser feita de cima para baixo. A linha do topo é a que gerou a exceção diretamente.

---

## Atividade guiada

1.  Abra a classe `DebugCallStack.java` no IntelliJ.
2.  Adicione um Breakpoint na linha do `System.out.println("Executando lógica no topo...");` (clicando na calha cinza ao lado do número da linha).
3.  Inicie o debug (`Shift + F9`).
4.  Observe a aba **Frames** na guia Debug. Clique em `executarPrimeiroNivel` e note como o escopo das variáveis muda. Clique em `main` e faça o mesmo.
5.  Aperte `F8` para continuar a execução.

---

## Desafio prático

Abra o arquivo `DebugCalculoComBug.java` no IntelliJ.

**Regras**:
1.  Rode a classe com o depurador ativo, colocando o breakpoint em `processarCompra`.
2.  Use o **Step Into** (`F7`) para navegar dentro dos métodos `aplicarImposto` e `aplicarFrete` e identifique as variáveis.
3.  Corrija a lógica do método `processarCompra` para que o frete seja somado em cima do valor que já possui o imposto aplicado.
4.  Execute a classe corrigida e garanta que a saída final seja de R$ 330.00.

---

## Debug recomendado

Use a janela **Evaluate Expression** (`Alt + F8`) durante o breakpoint em `processarCompra` para testar expressões matemáticas ou manipulações temporárias com `BigDecimal` sem precisar alterar o código do arquivo.

---

## Registro rápido da aula

Responda brevemente:
1.  O que é a Pilha de Chamadas (Call Stack) e como ela ajuda a JVM a controlar a execução do programa?
2.  Em qual situação o comando **Step Into** é mais indicado do que o **Step Over**?
3.  Como a StackTrace de um erro impresso no console se relaciona com a Call Stack do Java?

---

## Critério de conclusão

A aula está concluída se você:
- Explicar conceitualmente o que são frames de pilha e navegação de debug;
- Localizar e corrigir o erro de encadeamento matemático em `DebugCalculoComBug.java` através do depurador;
- Demonstrar a navegação passo a passo usando Step Into e Step Out no IntelliJ.

---

## Commit recomendado

Commit suas práticas do debugger:

```bash
git status
git add labs/m3/aula-099-debug-entrando-em-metodos
git commit -m "Aula 099: Pratica de depuracao e analise de Call Stack"
git status
```

---

## Fechamento

Nesta aula, dominamos a depuração de fluxos encadeados, aprendendo a navegar entre chamadas de métodos, inspecionar a pilha de execução e avaliar expressões dinâmicas.

Na próxima aula, utilizaremos esses conhecimentos de depuração para realizar nossa primeira refatoração de código automática usando a ferramenta **Extract Method** do IntelliJ.
