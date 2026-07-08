# 095 — Métodos de cálculo

## Objetivo da aula

Nesta aula, você aprenderá a criar métodos focados exclusivamente em cálculos matemáticos e de negócios. O objetivo é compreender como projetar assinaturas de métodos coerentes, escolher os tipos primitivos e objetos corretos (como `BigDecimal` para valores monetários), aplicar validações básicas de contrato e manter a separação de responsabilidades entre lógica de cálculo e exibição de dados.

Ao final desta aula, você deverá ser capaz de:
- Projetar métodos que realizam operações matemáticas e retornam resultados claros;
- Explicar por que lógica de cálculo não deve conter instruções de saída no console (como `System.out.println`);
- Utilizar `BigDecimal` corretamente em cenários financeiros, aplicando regras de arredondamento;
- Identificar e proteger seu código de erros comuns, como divisões inteiras acidentais e divisão por zero;
- Validar pré-condições básicas para garantir a integridade dos cálculos.

---

## Explicação conceitual clara

### O que é um método de cálculo?
Um método de cálculo é uma função pura ou um método de domínio que recebe parâmetros de entrada, executa uma operação lógica ou aritmética e retorna um resultado. A sua principal característica é a previsibilidade: com as mesmas entradas, ele sempre deve produzir a mesma saída, sem causar efeitos colaterais.

### Por que separar cálculo de exibição?
Um dos princípios mais importantes no desenvolvimento de software backend é a **Separação de Responsabilidades (Separation of Concerns)**. 
Se um método faz um cálculo e também imprime o resultado no console, ele fica acoplado à interface de usuário (neste caso, o terminal). Se amanhã você precisar expor esse mesmo cálculo em uma API Web (Spring Boot) ou salvar o resultado em um banco de dados, você não poderá reutilizar o método porque ele está "sujo" com saídas de terminal.

Portanto:
*   **Quem calcula:** apenas processa e retorna o valor.
*   **Quem chama:** decide o que fazer com o valor retornado (imprimir, salvar, enviar por rede).

### A escolha dos tipos: double vs BigDecimal
Para a maioria dos cálculos comuns (como médias de notas ou percentuais simples de medição), os tipos `double` ou `float` são aceitáveis. No entanto, para valores monetários (dinheiro), eles são perigosos devido à representação em ponto flutuante binário, que causa imprecisões decimais acumuladas. 
Nesses casos, a regra profissional é usar **`BigDecimal`**, configurando explicitamente a escala (casas decimais) e o modo de arredondamento (como `RoundingMode.HALF_UP`).

---

## Por que o assunto importa

No desenvolvimento Backend real, o cálculo de impostos, taxas de frete, juros e conciliações financeiras são o coração das regras de negócio. Um bug de arredondamento centesimal pode gerar prejuízos acumulados gigantescos ou inconsistências contábeis em sistemas de produção. Dominar a criação de métodos isolados de cálculo permite que essas regras sejam testadas de forma automatizada e fáceis de dar manutenção.

---

## Criação da pasta da aula

Para iniciar os exercícios práticos, crie o diretório correspondente no seu workspace:

```powershell
mkdir labs\m3\aula-095-metodos-de-calculo
cd labs\m3\aula-095-metodos-de-calculo
```

---

## Exemplos práticos completos

Crie os arquivos a seguir dentro da pasta da aula.

### Exemplo 1: `CalculoBasico.java`
Este arquivo aborda operações simples usando tipos primitivos comuns (`int` e `double`).

```java
public class CalculoBasico {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 20;

        int soma = somar(primeiro, segundo);
        int maior = calcularMaior(primeiro, segundo);
        double media = calcularMedia(primeiro, segundo);

        System.out.println("Soma: " + soma);
        System.out.println("Maior: " + maior);
        System.out.println("Média: " + media);
    }

    public static int somar(int primeiro, int segundo) {
        return primeiro + segundo;
    }

    public static int calcularMaior(int primeiro, int segundo) {
        return (primeiro >= segundo) ? primeiro : segundo;
    }

    public static double calcularMedia(int primeiro, int segundo) {
        // O uso do 2.0 evita que ocorra uma divisão inteira truncada
        return (primeiro + segundo) / 2.0;
    }
}
```

### Exemplo 2: `CalculoPedido.java`
Aqui demonstramos o uso profissional de `BigDecimal` com arredondamento seguro para lidar com finanças.

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculoPedido {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        BigDecimal totalBruto = calcularTotalBruto(precoUnitario, quantidade);
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        System.out.println("Total bruto: " + arredondarMoeda(totalBruto));
        System.out.println("Desconto: " + arredondarMoeda(desconto));
        System.out.println("Total final: " + arredondarMoeda(totalFinal));
    }

    public static BigDecimal calcularTotalBruto(BigDecimal precoUnitario, int quantidade) {
        if (precoUnitario == null) {
            throw new IllegalArgumentException("Preço unitário é obrigatório.");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal totalBruto) {
        if (totalBruto == null) {
            throw new IllegalArgumentException("Total bruto é obrigatório.");
        }
        BigDecimal limiteDesconto = new BigDecimal("300.00");
        BigDecimal percentualDesconto = new BigDecimal("0.10"); // 10%

        if (totalBruto.compareTo(limiteDesconto) >= 0) {
            return totalBruto.multiply(percentualDesconto);
        }
        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal totalBruto, BigDecimal desconto) {
        if (totalBruto == null || desconto == null) {
            throw new IllegalArgumentException("Total bruto e desconto são obrigatórios.");
        }
        return totalBruto.subtract(desconto);
    }

    public static BigDecimal arredondarMoeda(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }
        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
```

### Exemplo 3: `TestesManuaisCalculo.java`
Criaremos um validador simples para verificar se nossos métodos de cálculo estão corretos com base em valores esperados.

```java
import java.math.BigDecimal;

public class TestesManuaisCalculo {
    public static void main(String[] args) {
        testarTotalPedido();
        testarPercentual();

        System.out.println("Todos os testes manuais passaram!");
    }

    public static void testarTotalPedido() {
        BigDecimal preco = new BigDecimal("10.00");
        BigDecimal total = preco.multiply(BigDecimal.valueOf(3));
        
        if (total.compareTo(new BigDecimal("30.00")) != 0) {
            throw new IllegalStateException("Falha no cálculo do total do pedido. Esperado: 30.00, Obtido: " + total);
        }
    }

    public static void testarPercentual() {
        int parte = 25;
        int total = 100;
        double resultado = (parte * 100.0) / total;

        if (Math.abs(resultado - 25.0) > 0.0001) {
            throw new IllegalStateException("Falha no percentual. Esperado: 25.0, Obtido: " + resultado);
        }
    }
}
```

---

## Explicação depois de cada exemplo

*   **`CalculoBasico.java`**: Mostra que operações simples podem retornar tipos primitivos. Observe que a divisão na média é feita por `2.0` para forçar o Java a computar o resultado como `double`. Se usássemos apenas `2`, a expressão faria uma divisão inteira e truncaria a parte decimal.
*   **`CalculoPedido.java`**: Destaca o uso do `BigDecimal` e o método `compareTo` para comparações lógicas (evitando usar `==` ou `equals` para valores numéricos, pois o comportamento pode falhar se as escalas forem diferentes). Mostra também o tratamento protetivo de parâmetros com `IllegalArgumentException`.
*   **`TestesManuaisCalculo.java`**: Ensina o aluno a verificar o resultado das suas funções usando asserções manuais simples (`esperado` vs `atual`), criando o hábito de teste desde o início.

---

## Boas práticas

1.  **Imutabilidade do BigDecimal**: Lembre-se que `BigDecimal` é imutável. Operações como `.add()` ou `.subtract()` não alteram a instância original, elas sempre retornam uma nova instância.
2.  **Valide Parâmetros**: Sempre verifique se os valores de entrada são nulos ou inválidos (ex: divisão por zero ou quantidade negativa) antes de começar a calcular.
3.  **Use Nomes Claros**: Prefira `calcularValorComDesconto` a `calcDesc` ou `conta`. O código backend deve ser legível como prosa.
4.  **Arredonde no Final**: Evite arredondar valores intermediários, faça o arredondamento de escala apenas na apresentação ou no resultado final para não propagar erros de precisão.

---

## Erros comuns

*   **Divisão Inteira Oculta**: Escrever `double pct = parte / total * 100` resulta em zero quando a `parte` é menor que o `total`, pois o Java faz primeiro uma divisão inteira de inteiros.
*   **Não Atribuir o Retorno do BigDecimal**: Escrever `total.add(taxa)` achando que `total` mudou. O correto é `total = total.add(taxa)`.
*   **Esquecer de Tratar Divisão por Zero**: Se o divisor for dinâmico e puder chegar a zero, seu backend lançará um `ArithmeticException`. Valide antes.

---

## Atividade guiada

1.  Compilar e executar o `CalculoPedido.java`.
2.  Tente enviar uma quantidade negativa (`-5`) no método `calcularTotalBruto` e observe o lançamento da exceção no console.
3.  Altere temporariamente a divisão no método `calcularMedia` em `CalculoBasico.java` para dividir por `2` ao invés de `2.0`, execute informando notas ímpares (ex: 7 e 8) e observe o truncamento do resultado. Retorne ao código original após a constatação.

---

## Desafio prático

Implemente uma classe chamada `CalculoComissao.java` na mesma pasta do lab.

**Regras**:
1.  O programa deve calcular a comissão de um vendedor com base no total de vendas (`BigDecimal`).
2.  Se as vendas totais forem maiores ou iguais a R$ 10.000,00, a comissão é de 5%.
3.  Caso contrário, a comissão é de 2%.
4.  O cálculo da comissão deve ficar em um método chamado `calcularComissaoVendedor(BigDecimal totalVendas)`.
5.  A exibição formatada do valor final deve ficar fora do método de cálculo, no `main`.

---

## Debug recomendado

1.  Coloque um Breakpoint na primeira linha de `calcularDesconto` no `CalculoPedido.java`.
2.  Inicie a execução em modo Debug no IntelliJ (`Shift + F9` ou no ícone da barata).
3.  Utilize o **Step Into** (`F7`) para navegar dentro das operações matemáticas e verifique a aba *Variables* para acompanhar a transformação dos objetos de `BigDecimal`.

---

## Registro rápido da aula

Responda em poucas linhas no seu caderno de estudos ou arquivo pessoal de anotações:
1.  Por que dinheiro deve ser manipulado com `BigDecimal` e não com `double`?
2.  Qual é a principal desvantagem de misturar cálculos e impressões de tela (`System.out.println`) em um mesmo método?
3.  Como evitar o erro de divisão inteira no cálculo de porcentagens usando inteiros?

---

## Critério de conclusão

Você concluiu esta aula se conseguir:
- Explicar a importância da separação entre computação lógica e exibição visual;
- Compilar e rodar com sucesso os códigos `CalculoBasico.java` e `CalculoPedido.java`;
- Explicar por que o `BigDecimal` é preferível para representação financeira no ecossistema Java;
- Resolver de maneira funcional o desafio do cálculo de comissão garantindo o lançamento de exceções preventivas.

---

## Commit recomendado

Faça o commit de suas práticas usando o terminal git:

```bash
git status
git add labs/m3/aula-095-metodos-de-calculo
git commit -m "Aula 095: Pratica metodos de calculo e uso de BigDecimal"
git status
```

---

## Fechamento

Nesta aula, entendemos como construir métodos focados e especializados em processar dados brutos e retornar respostas limpas. Essa capacidade de isolar regras de cálculo é o que viabiliza a criação de testes e reuso sistemático.

Na próxima aula, daremos o passo complementar: vamos entender como criar **Métodos de Exibição**, responsáveis por interagir com o usuário no terminal de forma amigável e isolada da lógica de negócios.
