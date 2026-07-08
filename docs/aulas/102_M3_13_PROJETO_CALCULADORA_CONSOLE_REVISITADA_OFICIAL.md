# 102 — M3.13 — Projeto calculadora console revisitada

## Objetivo da aula

Nesta aula você vai reconstruir a calculadora console, só que agora usando tudo que já foi trabalhado no módulo:

```text
métodos pequenos;
validação;
leitura centralizada;
exibição organizada;
cálculos separados;
histórico de operações;
relatório final;
debug;
refatoração com Extract Method.
```

A calculadora deixa de ser apenas um exercício de `if`, `switch` e operadores. Ela passa a ser um pequeno projeto procedural organizado.

Ao final, o aluno deve conseguir montar um programa console com menu, operações matemáticas, validação de entrada, histórico limitado e relatório, mantendo o `main` limpo e os métodos com responsabilidades claras.

---

## O que vamos construir

Vamos criar uma calculadora console com este fluxo:

```text
1. Mostrar menu
2. Ler opção
3. Ler os dois números
4. Executar a operação escolhida
5. Guardar o resultado no histórico
6. Permitir continuar usando
7. Exibir histórico e relatório quando solicitado
8. Encerrar com resumo final
```

Operações disponíveis:

```text
1 - Somar
2 - Subtrair
3 - Multiplicar
4 - Dividir
5 - Ver histórico
6 - Ver relatório
0 - Sair
```

Regras principais:

```text
divisão por zero não pode ser executada;
opção inválida deve ser rejeitada;
histórico terá limite de 10 operações;
relatório deve mostrar total de operações, quantidade por tipo e média dos resultados;
o código deve ser separado por responsabilidade.
```

---

## Por que revisitar a calculadora

A calculadora é um ótimo projeto para consolidar fundamento.

No começo do curso, uma calculadora poderia ficar assim:

```java
if (opcao == 1) {
    System.out.println(a + b);
} else if (opcao == 2) {
    System.out.println(a - b);
}
```

Isso é suficiente para aprender operadores.

Agora queremos outro nível.

Queremos treinar:

```text
como organizar um pequeno programa;
como evitar main gigante;
como validar entradas;
como reutilizar leitura;
como separar cálculo de exibição;
como armazenar resultados;
como gerar um relatório simples.
```

Essa é a diferença entre “fazer funcionar” e “começar a programar com organização”.

---

## Estrutura esperada do projeto

Crie a pasta:

```powershell
mkdir labs\m3\aula-102-projeto-calculadora-console-revisitada
cd labs\m3\aula-102-projeto-calculadora-console-revisitada
```

Crie o arquivo:

```text
CalculadoraConsoleRevisitada.java
```

Nesta aula, vamos manter tudo em um arquivo para reforçar arquitetura procedural antes de separar em classes no futuro.

---

## Código completo da calculadora

Digite o código abaixo com calma.

Não copie correndo. A proposta é entender cada método.

```java
import java.util.Scanner;

public class CalculadoraConsoleRevisitada {
    private static final int LIMITE_HISTORICO = 10;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ResultadoOperacao[] historico = new ResultadoOperacao[LIMITE_HISTORICO];
        int quantidadeHistorico = 0;

        boolean executando = true;

        while (executando) {
            imprimirMenu();

            int opcao = lerInteiro(scanner, "Escolha uma opção: ");

            if (opcao == 0) {
                executando = false;
            } else if (opcao == 5) {
                imprimirHistorico(historico, quantidadeHistorico);
            } else if (opcao == 6) {
                imprimirRelatorio(historico, quantidadeHistorico);
            } else if (opcaoValidaDeOperacao(opcao)) {
                ResultadoOperacao resultado = executarFluxoOperacao(scanner, opcao);

                if (resultado != null) {
                    quantidadeHistorico = registrarNoHistorico(historico, quantidadeHistorico, resultado);
                }
            } else {
                imprimirErro("Opção inválida.");
            }

            imprimirLinha();
        }

        imprimirEncerramento(historico, quantidadeHistorico);
    }

    public static void imprimirMenu() {
        System.out.println("====================================");
        System.out.println("CALCULADORA CONSOLE");
        System.out.println("====================================");
        System.out.println("1 - Somar");
        System.out.println("2 - Subtrair");
        System.out.println("3 - Multiplicar");
        System.out.println("4 - Dividir");
        System.out.println("5 - Ver histórico");
        System.out.println("6 - Ver relatório");
        System.out.println("0 - Sair");
        System.out.println("------------------------------------");
    }

    public static ResultadoOperacao executarFluxoOperacao(Scanner scanner, int opcao) {
        double primeiroNumero = lerDouble(scanner, "Primeiro número: ");
        double segundoNumero = lerDouble(scanner, "Segundo número: ");

        if (opcao == 4 && segundoNumero == 0) {
            imprimirErro("Não é possível dividir por zero.");
            return null;
        }

        double resultado = calcularResultado(opcao, primeiroNumero, segundoNumero);
        String nomeOperacao = nomeOperacao(opcao);

        ResultadoOperacao operacao = new ResultadoOperacao(
                nomeOperacao,
                primeiroNumero,
                segundoNumero,
                resultado
        );

        imprimirResultado(operacao);

        return operacao;
    }

    public static boolean opcaoValidaDeOperacao(int opcao) {
        return opcao >= 1 && opcao <= 4;
    }

    public static double calcularResultado(int opcao, double primeiroNumero, double segundoNumero) {
        if (opcao == 1) {
            return somar(primeiroNumero, segundoNumero);
        }

        if (opcao == 2) {
            return subtrair(primeiroNumero, segundoNumero);
        }

        if (opcao == 3) {
            return multiplicar(primeiroNumero, segundoNumero);
        }

        if (opcao == 4) {
            return dividir(primeiroNumero, segundoNumero);
        }

        throw new IllegalArgumentException("Operação inválida: " + opcao);
    }

    public static double somar(double primeiroNumero, double segundoNumero) {
        return primeiroNumero + segundoNumero;
    }

    public static double subtrair(double primeiroNumero, double segundoNumero) {
        return primeiroNumero - segundoNumero;
    }

    public static double multiplicar(double primeiroNumero, double segundoNumero) {
        return primeiroNumero * segundoNumero;
    }

    public static double dividir(double primeiroNumero, double segundoNumero) {
        return primeiroNumero / segundoNumero;
    }

    public static String nomeOperacao(int opcao) {
        if (opcao == 1) {
            return "SOMA";
        }

        if (opcao == 2) {
            return "SUBTRAÇÃO";
        }

        if (opcao == 3) {
            return "MULTIPLICAÇÃO";
        }

        if (opcao == 4) {
            return "DIVISÃO";
        }

        return "DESCONHECIDA";
    }

    public static int registrarNoHistorico(
            ResultadoOperacao[] historico,
            int quantidadeHistorico,
            ResultadoOperacao resultado
    ) {
        if (quantidadeHistorico >= historico.length) {
            imprimirErro("Histórico cheio. Esta operação não será armazenada.");
            return quantidadeHistorico;
        }

        historico[quantidadeHistorico] = resultado;

        return quantidadeHistorico + 1;
    }

    public static void imprimirResultado(ResultadoOperacao resultado) {
        System.out.println("Resultado:");
        System.out.println(resultado.primeiroNumero() + " "
                + simboloOperacao(resultado.operacao()) + " "
                + resultado.segundoNumero() + " = "
                + resultado.resultado());
    }

    public static void imprimirHistorico(ResultadoOperacao[] historico, int quantidadeHistorico) {
        if (quantidadeHistorico == 0) {
            System.out.println("Nenhuma operação realizada ainda.");
            return;
        }

        System.out.println("Histórico de operações:");

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            ResultadoOperacao operacao = historico[indice];

            System.out.println((indice + 1) + " - "
                    + operacao.operacao() + ": "
                    + operacao.primeiroNumero() + " "
                    + simboloOperacao(operacao.operacao()) + " "
                    + operacao.segundoNumero() + " = "
                    + operacao.resultado());
        }
    }

    public static void imprimirRelatorio(ResultadoOperacao[] historico, int quantidadeHistorico) {
        if (quantidadeHistorico == 0) {
            System.out.println("Não há dados para relatório.");
            return;
        }

        int somas = contarOperacoes(historico, quantidadeHistorico, "SOMA");
        int subtracoes = contarOperacoes(historico, quantidadeHistorico, "SUBTRAÇÃO");
        int multiplicacoes = contarOperacoes(historico, quantidadeHistorico, "MULTIPLICAÇÃO");
        int divisoes = contarOperacoes(historico, quantidadeHistorico, "DIVISÃO");
        double mediaResultados = calcularMediaResultados(historico, quantidadeHistorico);

        System.out.println("Relatório:");
        System.out.println("Total de operações: " + quantidadeHistorico);
        System.out.println("Somas: " + somas);
        System.out.println("Subtrações: " + subtracoes);
        System.out.println("Multiplicações: " + multiplicacoes);
        System.out.println("Divisões: " + divisoes);
        System.out.println("Média dos resultados: " + mediaResultados);
    }

    public static int contarOperacoes(
            ResultadoOperacao[] historico,
            int quantidadeHistorico,
            String operacao
    ) {
        int contador = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            if (historico[indice].operacao().equals(operacao)) {
                contador++;
            }
        }

        return contador;
    }

    public static double calcularMediaResultados(ResultadoOperacao[] historico, int quantidadeHistorico) {
        double soma = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            soma += historico[indice].resultado();
        }

        return soma / quantidadeHistorico;
    }

    public static void imprimirEncerramento(ResultadoOperacao[] historico, int quantidadeHistorico) {
        System.out.println("Encerrando calculadora.");
        imprimirRelatorio(historico, quantidadeHistorico);
    }

    public static String simboloOperacao(String operacao) {
        if (operacao.equals("SOMA")) {
            return "+";
        }

        if (operacao.equals("SUBTRAÇÃO")) {
            return "-";
        }

        if (operacao.equals("MULTIPLICAÇÃO")) {
            return "*";
        }

        if (operacao.equals("DIVISÃO")) {
            return "/";
        }

        return "?";
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                imprimirErro("Digite um número inteiro válido.");
            }
        }
    }

    public static double lerDouble(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return Double.parseDouble(linha);
            } catch (NumberFormatException erro) {
                imprimirErro("Digite um número decimal válido.");
            }
        }
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }

    public static void imprimirLinha() {
        System.out.println("------------------------------------");
    }
}

record ResultadoOperacao(
        String operacao,
        double primeiroNumero,
        double segundoNumero,
        double resultado
) {
}
```

---

## Como executar

Compile:

```powershell
javac CalculadoraConsoleRevisitada.java
```

Execute:

```powershell
java CalculadoraConsoleRevisitada
```

Teste este fluxo:

```text
1
10
5
2
20
3
3
4
2
4
10
0
5
6
0
```

O que deve acontecer:

```text
somar 10 + 5;
subtrair 20 - 3;
multiplicar 4 * 2;
tentar dividir por zero e receber erro;
ver histórico;
ver relatório;
sair com resumo final.
```

---

## Entendendo o fluxo principal

O `main` ficou com cara de coordenação:

```java
while (executando) {
    imprimirMenu();

    int opcao = lerInteiro(scanner, "Escolha uma opção: ");

    if (opcao == 0) {
        executando = false;
    } else if (opcao == 5) {
        imprimirHistorico(historico, quantidadeHistorico);
    } else if (opcao == 6) {
        imprimirRelatorio(historico, quantidadeHistorico);
    } else if (opcaoValidaDeOperacao(opcao)) {
        ResultadoOperacao resultado = executarFluxoOperacao(scanner, opcao);

        if (resultado != null) {
            quantidadeHistorico = registrarNoHistorico(historico, quantidadeHistorico, resultado);
        }
    } else {
        imprimirErro("Opção inválida.");
    }

    imprimirLinha();
}
```

Ele não sabe como soma, como subtrai, como imprime histórico ou como calcula média.

Ele apenas direciona o fluxo.

Isso é exatamente o que queríamos treinar.

---

## Onde estão as responsabilidades

A calculadora foi organizada por grupos de responsabilidade.

Leitura:

```text
lerInteiro;
lerDouble.
```

Validação:

```text
opcaoValidaDeOperacao;
bloqueio de divisão por zero;
limite do histórico.
```

Cálculo:

```text
calcularResultado;
somar;
subtrair;
multiplicar;
dividir;
calcularMediaResultados;
contarOperacoes.
```

Exibição:

```text
imprimirMenu;
imprimirResultado;
imprimirHistorico;
imprimirRelatorio;
imprimirEncerramento;
imprimirErro;
imprimirLinha.
```

Histórico:

```text
registrarNoHistorico;
ResultadoOperacao[];
ResultadoOperacao.
```

Esse agrupamento torna o código mais fácil de navegar.

---

## Pontos importantes do projeto

### Histórico limitado

O histórico usa array fixo:

```java
ResultadoOperacao[] historico = new ResultadoOperacao[LIMITE_HISTORICO];
```

Isso reforça os fundamentos de array.

Quando o histórico chega ao limite, o programa avisa:

```java
if (quantidadeHistorico >= historico.length) {
    imprimirErro("Histórico cheio. Esta operação não será armazenada.");
    return quantidadeHistorico;
}
```

### Operação inválida

A opção precisa ser conhecida:

```java
public static boolean opcaoValidaDeOperacao(int opcao) {
    return opcao >= 1 && opcao <= 4;
}
```

### Divisão por zero

A divisão é validada antes de calcular:

```java
if (opcao == 4 && segundoNumero == 0) {
    imprimirErro("Não é possível dividir por zero.");
    return null;
}
```

Aqui usamos `null` como sinal de que a operação não gerou resultado. Mais tarde, aprenderemos formas melhores de representar esse tipo de retorno, mas neste momento a solução é suficiente para o nível da aula.

### Relatório

O relatório é calculado a partir do histórico:

```text
total de operações;
quantidade de somas;
quantidade de subtrações;
quantidade de multiplicações;
quantidade de divisões;
média dos resultados.
```

Esse relatório mostra que dados armazenados podem ser processados depois.

---

## Melhorias possíveis

O projeto já está organizado, mas ainda há melhorias possíveis.

Algumas ideias:

```text
trocar if por switch moderno;
criar enum para operação;
formatar resultado com casas decimais;
não usar null para operação inválida;
permitir limpar histórico;
aumentar limite do histórico;
criar relatório com maior e menor resultado;
separar entrada, cálculo e exibição em classes no futuro.
```

Não faça tudo agora.

O objetivo desta aula é consolidar organização procedural, não antecipar assuntos de módulos futuros.

---

## Debug recomendado

Use debug para acompanhar o fluxo.

Coloque breakpoint em:

```java
int opcao = lerInteiro(scanner, "Escolha uma opção: ");
```

Depois entre em:

```text
lerInteiro;
executarFluxoOperacao;
calcularResultado;
registrarNoHistorico;
imprimirRelatorio.
```

Observe principalmente:

```text
valor da opção;
valores digitados;
objeto ResultadoOperacao criado;
posição do histórico;
quantidadeHistorico aumentando;
contadores do relatório.
```

Esse debug ajuda a enxergar o programa funcionando por dentro.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar operações simples

Execute:

```text
somar 10 + 5;
subtrair 20 - 8;
multiplicar 3 * 4;
dividir 10 / 2.
```

Confirme se os resultados estão corretos.

### Parte 2 — Testar entradas inválidas

Teste:

```text
opção inválida;
texto no lugar de número;
divisão por zero.
```

O programa não deve quebrar.

### Parte 3 — Testar histórico

Realize três operações e escolha:

```text
5 - Ver histórico
```

Confirme se aparecem as três operações na ordem correta.

### Parte 4 — Testar relatório

Depois de algumas operações, escolha:

```text
6 - Ver relatório
```

Confirme se os contadores fazem sentido.

### Parte 5 — Testar limite do histórico

Faça mais de 10 operações.

O programa deve avisar que o histórico está cheio.

---

## Desafio prático

Crie uma versão chamada:

```text
CalculadoraConsoleRevisitadaV2.java
```

Adicione ao relatório:

```text
maior resultado;
menor resultado;
quantidade de resultados positivos;
quantidade de resultados negativos;
quantidade de resultados iguais a zero.
```

Sugestão de métodos:

```java
calcularMaiorResultado(...)
calcularMenorResultado(...)
contarResultadosPositivos(...)
contarResultadosNegativos(...)
contarResultadosZerados(...)
```

Não altere a ideia principal do programa.

Apenas melhore o relatório.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que mudou em relação a uma calculadora simples?
2. Qual método deixou o código mais organizado?
3. Qual validação evitou o erro mais importante?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o fluxo da calculadora;
separar menu, leitura, cálculo, histórico e relatório;
criar métodos para cada operação matemática;
validar divisão por zero;
armazenar resultados em array;
exibir histórico;
gerar relatório;
debugar o fluxo principal;
criar uma melhoria pequena sem bagunçar o main;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m3/aula-102-projeto-calculadora-console-revisitada
git commit -m "Aula 102: revisita calculadora console procedural"
git status
```

Se você também mantiver um registro curto em algum arquivo de anotações, inclua esse arquivo no commit.

---

## Fechamento

A principal ideia desta aula é:

```text
um projeto pequeno já pode ter organização profissional.
```

A calculadora não é só sobre somar e dividir. Ela é um treino de estrutura.

Quando você separa leitura, validação, cálculo, histórico e relatório, o código fica mais fácil de entender e evoluir.

Esse mesmo raciocínio será usado na próxima aula, onde vamos aplicar a ideia em um projeto de processamento de OS no console.
