# 098 — Reuso sem duplicação

## Objetivo da aula

Nesta aula, você aprenderá a aplicar o princípio **DRY (Don't Repeat Yourself)** para evitar a duplicação de código. O objetivo é compreender como identificar trechos repetitivos em validações, cálculos e formatações de console, e encapsulá-los em métodos reutilizáveis. Você também aprenderá a organizar esses métodos em classes de apoio específicas, evitando a criação de "classes utilitárias gigantes" sem coesão.

Ao final desta aula, você deverá ser capaz de:
- Identificar e eliminar duplicações de código no desenvolvimento Java;
- Explicar a diferença entre duplicação acidental (visual) e duplicação conceitual (de regra);
- Criar classes de apoio coesas (como `ValidacoesBasicas` e `CalculosPedido`) para centralizar a lógica reutilizável;
- Refatorar códigos existentes de forma segura.

---

## Explicação conceitual clara

### O Princípio DRY (Don't Repeat Yourself)
O DRY afirma que "cada pedaço de conhecimento em um sistema deve ter uma representação única, inequívoca e autoritativa". 
Quando você copia e cola o mesmo bloco de código em vários lugares (ex: validação de email ou cálculo de juros), você cria um problema de manutenção. Se a regra mudar, você precisará encontrar e atualizar todos os arquivos duplicados, aumentando as chances de introduzir bugs.

### Duplicação Real vs. Duplicação Acidental
*   **Duplicação Real (Semântica):** Dois ou mais blocos representam a mesma regra de negócio. Se a regra de imposto mudar de 10% para 12%, todos os pontos devem mudar juntos.
*   **Duplicação Acidental (Visual):** Dois trechos de código são idênticos no texto atual, mas representam conceitos que podem evoluir separadamente. Por exemplo, a validação de quantidade mínima de itens no estoque e a quantidade mínima de dependentes do funcionário. Embora ambos chequem se `valor > 0`, são conceitos de domínio distintos e não devem necessariamente ser unificados.

---

## Por que o assunto importa

No desenvolvimento de sistemas backend complexos, a duplicação de lógica de banco de dados, regras fiscais ou chamadas de API externas gera uma base de código difícil de ler e modificar. A refatoração contínua para extrair métodos e classes reutilizáveis garante que o sistema permaneça modular, permitindo alterações ágeis e seguras com impacto localizado.

---

## Criação da pasta da aula

Crie a pasta correspondente para os exercícios práticos da aula:

```powershell
mkdir labs\m3\aula-098-reuso-sem-duplicacao
cd labs\m3\aula-098-reuso-sem-duplicacao
```

---

## Exemplos práticos completos

### Exemplo 1: O Cenário Ruim (Duplicação)
Abra a mente analisando a classe a seguir. Nela, a validação de strings nulas ou em branco está copiada no cadastro de cliente e no cadastro de produto de forma duplicada.

*Não crie esta classe ruim no seu repositório definitivo, ela serve apenas como base de comparação conceitual.*

```java
// CONCEITO DE DUPLICAÇÃO RUIM
public class DuplicacaoValidacaoRuim {
    public static void cadastrarCliente(String nome, String email) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }
        // ... lógica de cadastro
    }

    public static void cadastrarProduto(String nomeProduto, String categoria) {
        if (nomeProduto == null || nomeProduto.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }
        if (categoria == null || categoria.trim().isEmpty()) {
            throw new IllegalArgumentException("Categoria do produto é obrigatória.");
        }
        // ... lógica de cadastro
    }
}
```

### Exemplo 2: O Cenário Refatorado
Agora, criaremos uma estrutura limpa e profissional, dividida em classes coesas e reutilizáveis.

#### Classe 1: `ValidacoesBasicas.java` (Validador Reutilizável)
Esta classe conterá métodos focados apenas em validações básicas de tipos e strings.

```java
public final class ValidacoesBasicas {
    private ValidacoesBasicas() {
    }

    public static void validarTextoObrigatorio(String texto, String nomeCampo) {
        if (texto == null || texto.trim().isEmpty()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatório e não pode estar em branco.");
        }
    }
}
```

#### Classe 2: `CalculosPedido.java` (Regra de Cálculo Reutilizável)
Concentra a matemática financeira dos pedidos.

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public final class CalculosPedido {
    private CalculosPedido() {
    }

    public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {
        if (precoUnitario == null) {
            throw new IllegalArgumentException("Preço unitário é obrigatório.");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal aplicarDesconto(BigDecimal total, BigDecimal percentualDesconto) {
        if (total == null || percentualDesconto == null) {
            return BigDecimal.ZERO;
        }
        return total.multiply(percentualDesconto).setScale(2, RoundingMode.HALF_UP);
    }
}
```

#### Classe 3: `TesteManualReuso.java` (Aplicação)
Aqui instanciamos e testamos o reuso das validações e cálculos de forma limpa.

```java
import java.math.BigDecimal;

public class TesteManualReuso {
    public static void main(String[] args) {
        // Testando as validações centralizadas
        try {
            ValidacoesBasicas.validarTextoObrigatorio("", "Nome do Cliente");
        } catch (IllegalArgumentException e) {
            System.out.println("Validação funcionou corretamente: " + e.getMessage());
        }

        // Testando cálculos centralizados
        BigDecimal preco = new BigDecimal("49.90");
        int qtde = 3;
        
        BigDecimal totalBruto = CalculosPedido.calcularTotal(preco, qtde);
        BigDecimal desconto = CalculosPedido.aplicarDesconto(totalBruto, new BigDecimal("0.10")); // 10%
        
        System.out.println("Total Bruto: " + totalBruto);
        System.out.println("Desconto Aplicado: " + desconto);
    }
}
```

---

## Explicação depois de cada exemplo

*   **`ValidacoesBasicas.java`**: Extrai a lógica repetida de checar strings nulas ou vazias. Note o uso de `nomeCampo` para tornar as mensagens de erro customizáveis para cada chamada.
*   **`CalculosPedido.java`**: Garante que o processamento do total e a aplicação de percentuais de desconto sejam operados da mesma forma em toda a aplicação, evitando espalhar cálculos manuais de multiplicação decimal.
*   **`TesteManualReuso.java`**: Consome ambas as classes auxiliares, demonstrando como o arquivo principal fica legível e modularizado.

---

## Boas práticas

1.  **Mantenha as Classes Coesas**: Evite criar uma classe utilitária única com o nome `Utils` ou `Helper` contendo validações, cálculos, conexões com banco e envio de emails misturados. Crie pequenas classes focadas na sua especialidade (ex: `Validacoes`, `CalculadoraFinanceira`).
2.  **Declare Construtores Privados**: Se suas classes utilitárias contêm apenas métodos estáticos, declare um construtor privado para evitar instanciações desnecessárias.
3.  **Não force o DRY na Duplicação Acidental**: Unificar comportamentos que apenas se parecem visualmente hoje, mas pertencem a regras que vão mudar por motivos diferentes no futuro, cria um acoplamento ruim.

---

## Erros comuns

*   **Criar Classes Utilitárias Gigantes (God Utility Class)**: A clássica classe `Utils.java` com 3 mil linhas contendo de tudo um pouco.
*   **Encapsulamento de DRY Excessivo**: Criar métodos para reusar linhas extremamente triviais e de baixa mudança (como `return a + b;` em um utilitário genérico de soma simples). Avalie se a abstração compensa a complexidade.

---

## Atividade guiada

1.  Crie as classes `ValidacoesBasicas.java`, `CalculosPedido.java` e `TesteManualReuso.java`.
2.  Compile todas usando o comando:
    ```powershell
    javac ValidacoesBasicas.java CalculosPedido.java TesteManualReuso.java
    ```
3.  Execute a classe `TesteManualReuso` e analise o comportamento no terminal.

---

## Desafio prático

Refatore a classe `TesteManualReuso.java` para validar e calcular os valores de um produto.

**Regras**:
1.  O nome do produto não pode ser nulo ou em branco (use `ValidacoesBasicas`).
2.  O cálculo do valor em estoque deve ser operado de forma reutilizável. Crie um método utilitário em `CalculosPedido` ou crie uma classe de cálculo própria chamada `CalculosEstoque.java` se achar mais coeso.
3.  Imprima o resultado formatado no console com a proteção de validação ativada.

---

## Debug recomendado

1.  Insira um Breakpoint no início do `main` de `TesteManualReuso.java`.
2.  Inicie a execução em modo Debug.
3.  Utilize o **Step Into** (`F7`) nas chamadas estáticas `ValidacoesBasicas.validarTextoObrigatorio` e observe como a IDE muda de arquivo para o utilitário e depois retorna ao fluxo principal.

---

## Registro rápido da aula

Responda brevemente:
1.  Qual a diferença conceitual entre duplicação real de regra de negócio e duplicação acidental visual?
2.  Por que é considerado um antipadrão criar uma única classe genérica chamada `Utils.java`?
3.  Como garantir que o compilador impeça a criação de instâncias de classes focadas apenas em métodos estáticos?

---

## Critério de conclusão

A aula está concluída quando:
- As classes utilitárias `ValidacoesBasicas.java` e `CalculosPedido.java` estiverem criadas com construtores privados;
- A classe de teste rodar sem erros estruturais;
- O desafio do cálculo e validação do estoque estiver implementado sem replicação manual de código.

---

## Commit recomendado

Registre as alterações no git:

```bash
git status
git add labs/m3/aula-098-reuso-sem-duplicacao
git commit -m "Aula 098: Pratica DRY com classes utilitarias coesas"
git status
```

---

## Fechamento

Nesta aula, compreendemos o poder de isolar regras de dados e strings em componentes menores e centralizados, evitando a cópia e colagem de código e reduzindo a superfície de bugs.

Na próxima aula, aprenderemos a utilizar a ferramenta de **Debug** do IntelliJ de forma profunda, analisando como rastrear a execução de chamadas entre classes diferentes.
