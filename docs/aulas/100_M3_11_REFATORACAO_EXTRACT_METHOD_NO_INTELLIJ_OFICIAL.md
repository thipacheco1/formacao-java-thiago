# 100 — Refatoração Extract Method no IntelliJ

## Objetivo da aula

Nesta aula, você aprenderá a utilizar uma das ferramentas de refatoração automatizadas mais poderosas das IDEs modernas: o **Extract Method (Extrair Método)** do IntelliJ IDEA. O objetivo é compreender o conceito de refatoração (melhorar a estrutura interna do código sem alterar seu comportamento externo) e aprender como extrair blocos de código complexos do método `main` para funções auxiliares com segurança e agilidade usando atalhos de teclado.

Ao final desta aula, você deverá ser capaz de:
- Explicar o que é refatoração de código e qual a importância de manter testes ou validações durante o processo;
- Executar a refatoração Extract Method usando o atalho de teclado do IntelliJ (`Ctrl + Alt + M` no Windows/Linux ou `Cmd + Option + M` no macOS);
- Explicar como a IDE resolve a passagem de parâmetros e retornos de variáveis locais durante a extração;
- Avaliar criticamente se o código extraído gerou assinaturas de métodos limpas e coesas.

---

## Explicação conceitual clara

### O que é Refatoração?
Refatorar é o processo de modificar um sistema de software para melhorar sua estrutura interna (legibilidade, modularidade, facilidade de manutenção) sem alterar seu comportamento funcional observado pelo usuário final.

### O atalho Extract Method
Escrever novos métodos manualmente, copiando declarações de variáveis e ajustando assinaturas, é um processo lento e sujeito a erros de digitação. No IntelliJ, você pode simplesmente:
1.  **Selecionar** o bloco de código que deseja isolar.
2.  Pressionar o atalho **`Ctrl + Alt + M`** (ou clicar com o botão direito -> *Refactor* -> *Extract Method*).
3.  Digitar o **novo nome** do método.
4.  Pressionar **Enter**.

A IDE automaticamente:
*   Cria a assinatura do método abaixo;
*   Identifica quais variáveis locais do escopo anterior precisam virar argumentos (parâmetros);
*   Detecta se há alguma variável modificada dentro do bloco que precisa ser devolvida (retorno);
*   Substitui o bloco original de código pela chamada do novo método.

---

## Por que o assunto importa

No dia a dia do desenvolvimento Backend de sistemas corporativos, você raramente escreverá código perfeito de primeira. O fluxo de desenvolvimento profissional consiste em fazer a lógica funcionar primeiro e, logo em seguida, refatorá-la para torná-la limpa, legível e de fácil manutenção por outros engenheiros. Dominar as ferramentas automatizadas de refatoração do IntelliJ permite que você limpe seu código em segundos, com riscos de quebra próximos a zero.

---

## Criação da pasta da aula

Crie o diretório do laboratório prático no terminal:

```powershell
mkdir labs\m3\aula-100-refatoracao-extract-method
cd labs\m3\aula-100-refatoracao-extract-method
```

---

## Exemplos práticos completos

### Exemplo 1: O Código Antes da Extração (`PedidoExtractAntes.java`)
Este código possui todas as lógicas acumuladas e misturadas dentro de um único método `main`.

```java
import java.math.BigDecimal;

public class PedidoExtractAntes {
    public static void main(String[] args) {
        BigDecimal preco = new BigDecimal("120.00");
        int quantidade = 3;

        // Bloco 1: Cálculo do valor bruto
        BigDecimal totalBruto = preco.multiply(BigDecimal.valueOf(quantidade));

        // Bloco 2: Regra de frete (R$ 15 se menor que 300, grátis caso contrário)
        BigDecimal frete = BigDecimal.ZERO;
        if (totalBruto.compareTo(new BigDecimal("300.00")) < 0) {
            frete = new BigDecimal("15.00");
        }

        // Bloco 3: Cálculo do total final
        BigDecimal totalFinal = totalBruto.add(frete);

        // Bloco 4: Impressão do resultado
        System.out.println("--- DETALHES COMPRA ---");
        System.out.println("Bruto: R$ " + totalBruto);
        System.out.println("Frete: R$ " + frete);
        System.out.println("Final: R$ " + totalFinal);
    }
}
```

### Exemplo 2: O Código Depois da Extração (`PedidoExtractDepois.java`)
Aqui vemos como o código fica estruturado após aplicarmos a extração automática em cada bloco relevante de lógica.

```java
import java.math.BigDecimal;

public class PedidoExtractDepois {
    public static void main(String[] args) {
        BigDecimal preco = new BigDecimal("120.00");
        int quantidade = 3;

        BigDecimal totalBruto = calcularTotalBruto(preco, quantidade);
        BigDecimal frete = calcularFrete(totalBruto);
        BigDecimal totalFinal = totalBruto.add(frete);

        imprimirResumo(totalBruto, frete, totalFinal);
    }

    public static BigDecimal calcularTotalBruto(BigDecimal preco, int quantidade) {
        return preco.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularFrete(BigDecimal totalBruto) {
        BigDecimal frete = BigDecimal.ZERO;
        if (totalBruto.compareTo(new BigDecimal("300.00")) < 0) {
            frete = new BigDecimal("15.00");
        }
        return frete;
    }

    public static void imprimirResumo(BigDecimal totalBruto, BigDecimal frete, BigDecimal totalFinal) {
        System.out.println("--- DETALHES COMPRA ---");
        System.out.println("Bruto: R$ " + totalBruto);
        System.out.println("Frete: R$ " + frete);
        System.out.println("Final: R$ " + totalFinal);
    }
}
```

---

## Explicação depois de cada exemplo

*   **`PedidoExtractAntes.java`**: O arquivo funciona, mas ler as regras de negócio exige navegar por variáveis locais intermediárias dispersas e ler comentários de linha que indicam a intenção do código.
*   **`PedidoExtractDepois.java`**: Os comentários foram eliminados porque os nomes dos métodos (`calcularTotalBruto`, `calcularFrete` e `imprimirResumo`) já expressam o que o código faz de forma autoexplicativa. O `main` agora serve como um orquestrador limpo de alto nível.

---

## Boas práticas

1.  **Refatore Apenas Código que Compila**: Nunca tente usar ferramentas automatizadas de extração em trechos de código que estão com erros de sintaxe (linhas vermelhas). A IDE precisa entender o grafo de compilação para extrair com segurança.
2.  **Não misture refatoração com novas regras**: Ao refatorar, melhore a estrutura física e rode o programa para confirmar que a saída permaneceu idêntica. Só comece a implementar novas funções *após* concluir e commitar a refatoração.
3.  **Atenção às variáveis locais**: Se você tentar extrair um bloco de código que altera o valor de duas variáveis locais diferentes, o Java (que só permite retornar um valor por método) impedirá a extração direta ou criará uma assinatura confusa. Nesses casos, divida a seleção em blocos menores antes de extrair.

---

## Erros comuns

*   **Nomes Ruins Gerados**: Deixar o método com o nome sugerido automaticamente pela IDE (como `extracted()` ou `helper()`). Use o **Rename** (`Shift + F6`) para dar um nome que descreva a intenção de negócio.
*   **Seleção Incompleta**: Selecionar apenas metade de uma condição `if` ou esquecer a inicialização de uma variável usada no cálculo. Garanta que selecionou um bloco lógico íntegro.

---

## Atividade guiada

1.  Crie o arquivo `PedidoExtractAntes.java` no seu IntelliJ.
2.  Selecione as linhas do "Bloco 2" (cálculo de frete).
3.  Pressione `Ctrl + Alt + M` (ou `Cmd + Option + M` no Mac).
4.  No campo de nome do método, digite `calcularFrete` e dê Enter.
5.  Observe como a IDE criou o método automaticamente e substituiu o bloco original pela chamada.
6.  Faça o mesmo para os blocos de cálculo bruto e impressão.

---

## Desafio prático

Implemente uma classe chamada `OsExtractMethod.java` contendo uma ordem de serviço não refatorada no `main` (com leitura de dados da OS, cálculo de valor total baseado em horas de suporte cobradas a R$ 80,00 e impressão de aviso de SLA). 

**Regras**:
1.  Rode a aplicação e garanta que ela funciona.
2.  Utilize o IntelliJ para extrair o cálculo das horas cobradas para um método `calcularPrecoOS`.
3.  Utilize o IntelliJ para extrair a lógica de verificação de atraso para `verificarSLA`.
4.  Substitua as strings de exibição por um método `exibirFichaOS`.
5.  Valide que a saída final do console é a mesma após a refatoração.

---

## Debug recomendado

Coloque um breakpoint na chamada de `calcularFrete` em `PedidoExtractDepois.java`. Ao parar no ponto de pausa, pressione **Step Into** (`F7`) e veja a linha de execução pular diretamente para a declaração do método extraído.

---

## Registro rápido da aula

Responda no seu arquivo de notas:
1.  O que é refatoração de código e qual sua diferença em relação à implementação de novas funcionalidades?
2.  Como o atalho do IntelliJ lida com os parâmetros de entrada ao gerar o novo método automaticamente?
3.  Qual é a limitação de retorno do Java que pode dificultar a extração de um bloco de código que altera múltiplas variáveis locais?

---

## Critério de conclusão

Você concluiu esta aula se conseguir:
- Explicar conceitualmente o atalho de extração de métodos;
- Refatorar o arquivo `PedidoExtractAntes.java` para o padrão `PedidoExtractDepois.java` usando os comandos automáticos da IDE;
- Completar o desafio da Ordem de Serviço realizando as três extrações sem quebrar o código de teste.

---

## Commit recomendado

Commit suas práticas no Git:

```bash
git status
git add labs/m3/aula-100-refatoracao-extract-method
git commit -m "Aula 100: Pratica refatoracao Extract Method no IntelliJ"
git status
```

---

## Fechamento

Nesta aula, aprendemos a elevar o nível de legibilidade do nosso código usando as ferramentas automáticas de refatoração da IDE, transformando blocos de códigos gigantes em assinaturas de métodos limpas e modulares.

Parabéns por alcançar a aula 100! Nas próximas aulas, começaremos a arquitetar projetos de console organizados em estruturas mais robustas, consolidando toda a base processual que desenvolvemos até aqui para estarmos prontos para o mergulho na Orientação a Objetos.
