# 061 — M1.41 — Mini Projeto Calculadora Profissional Console

## O que este mini projeto precisa entregar

A calculadora profissional console deve conter:

```text
menu principal;
opção de soma;
opção de subtração;
opção de multiplicação;
opção de divisão;
opção para exibir histórico;
opção para exibir estatísticas;
opção para sair;
leitura segura de opções;
leitura segura de números;
tratamento de entrada inválida;
bloqueio de divisão por zero;
métodos para cada responsabilidade;
histórico em array com até 10 resultados;
controle de quantidade de resultados armazenados;
contagem de resultados pares;
relatório ao sair;
mensagens claras;
código organizado;
nomes profissionais;
comentários úteis;
documentação curta do projeto;
debug recomendado;
commit limpo.
```

A grade cita explicitamente:

```text
menu;
métodos;
histórico em array;
resultados pares;
validações;
documentação.
```

Esses itens são obrigatórios nesta entrega.

---

## Por que este projeto existe

Um projeto consolida fundamentos melhor do que exercícios isolados.

Nos exercícios anteriores, cada aula treinou um ponto:

```text
if;
for;
array;
método;
Scanner;
try/catch;
debug.
```

Agora precisamos combinar esses pontos.

Em sistemas reais, as coisas aparecem juntas.

Um backend não usa só `if`.

Ele usa:

```text
entrada;
validação;
regra;
cálculo;
persistência;
resposta;
erro;
log;
organização;
teste.
```

Neste mini projeto de console, faremos uma versão pequena dessa mentalidade:

```text
usuário escolhe uma operação;
programa valida;
programa executa regra;
programa guarda histórico;
programa apresenta relatório;
programa permite continuar;
programa encerra com resumo.
```

Essa é a primeira versão do raciocínio de aplicação.

---

## O que é uma calculadora profissional console

Neste contexto, “profissional” não significa ter interface gráfica.

Significa ter código com qualidade mínima.

Uma calculadora amadora seria assim:

```java
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    System.out.println("Digite a:");
    double a = scanner.nextDouble();

    System.out.println("Digite b:");
    double b = scanner.nextDouble();

    System.out.println(a + b);
}
```

Funciona, mas é limitada.

Uma versão profissional inicial deve ter:

```text
menu;
opções claras;
métodos;
validação;
tratamento de erro;
histórico;
relatório;
separação de responsabilidades;
nomes legíveis;
debug possível.
```

Esse é o objetivo.

---

## Vocabulário essencial

Termos desta aula:

```text
mini projeto;
console;
menu;
opção;
operação;
soma;
subtração;
multiplicação;
divisão;
validação;
entrada inválida;
try/catch;
InputMismatchException;
método;
responsabilidade;
histórico;
array;
capacidade;
limite;
resultado;
resultado par;
relatório;
estatística;
contador;
acumulador;
loop principal;
encerramento;
documentação;
debug;
commit;
entrega.
```

Termos mais importantes:

```text
menu -> lista de ações disponíveis para o usuário;
loop principal -> repetição que mantém o programa aberto até o usuário sair;
histórico -> array que armazena resultados calculados;
capacidade -> quantidade máxima de resultados guardados;
resultado par -> resultado inteiro divisível por 2;
validação -> regra que impede entrada ou operação inválida;
método auxiliar -> método que organiza parte da responsabilidade;
relatório final -> resumo exibido ao encerrar a aplicação.
```

---

## Regras do projeto

A aplicação terá as seguintes regras:

```text
1. O programa deve exibir um menu enquanto o usuário não escolher sair.
2. O usuário deve poder escolher soma, subtração, multiplicação ou divisão.
3. A opção escolhida deve ser validada.
4. Os números devem ser lidos com tratamento de entrada inválida.
5. A divisão por zero deve ser bloqueada.
6. Cada operação deve ser executada por método específico.
7. Cada resultado calculado deve ser armazenado em histórico.
8. O histórico deve guardar até 10 resultados.
9. Quando passar de 10 resultados, o resultado mais antigo deve sair e o novo deve entrar.
10. O sistema deve informar quantos resultados armazenados são pares.
11. Resultado par será considerado apenas quando o resultado for inteiro e divisível por 2.
12. O usuário deve poder consultar o histórico.
13. O usuário deve poder consultar estatísticas.
14. Ao sair, o programa deve exibir relatório final.
15. O código deve estar organizado em métodos.
16. O projeto deve ter documentação curta.
17. O projeto deve ser versionado com commit.
```

A regra 9 é uma decisão profissional para evitar estourar o array.

Em vez de deixar dar erro quando o histórico encher, faremos rotação simples:

```text
remove o mais antigo;
adiciona o mais novo no fim.
```

---

## Decisão sobre resultado par

Como a calculadora usa `double`, precisamos definir com clareza o que é par.

Exemplo:

```text
10.0 é par;
8.0 é par;
5.0 não é par;
2.5 não é par;
-4.0 é par.
```

Regra usada:

```text
um resultado será considerado par se for inteiro e divisível por 2.
```

Em código:

```java
public static boolean resultadoPar(double resultado) {
    return resultado % 1 == 0 && resultado % 2 == 0;
}
```

Explicação:

```text
resultado % 1 == 0 -> verifica se não tem parte decimal;
resultado % 2 == 0 -> verifica se é divisível por 2.
```

Essa decisão precisa estar documentada.

---

## Arquitetura simples do projeto

Teremos um arquivo principal:

```text
CalculadoraProfissionalConsole.java
```

Dentro dele, teremos métodos organizados por responsabilidade.

Exemplo de grupos:

```text
main;
exibição de menu;
leitura segura;
execução de opção;
operações matemáticas;
histórico;
estatísticas;
relatório;
validações;
documentação em comentários úteis.
```

Ainda não estamos usando classes de domínio.

Ainda não estamos usando pacotes avançados.

Ainda não estamos usando Maven para este mini projeto.

É um projeto console de fundamentos.

Mas o código já deve ter mentalidade organizada.

---

## Estrutura mental do fluxo

O fluxo será:

```text
iniciar programa;
criar Scanner;
criar array de histórico com 10 posições;
iniciar quantidade de resultados em 0;
iniciar controle de execução como true;

enquanto programa estiver rodando:
    exibir menu;
    ler opção;
    se opção for operação:
        ler dois números;
        validar se operação é divisão por zero;
        calcular resultado;
        exibir resultado;
        salvar no histórico;
    se opção for histórico:
        exibir histórico;
    se opção for estatísticas:
        exibir estatísticas;
    se opção for sair:
        exibir relatório final;
        encerrar loop;
    se opção inválida:
        mostrar mensagem;

fechar Scanner;
encerrar.
```

Esse fluxo usa praticamente tudo que aprendemos.

---

## Exemplo mínimo digitado do zero

Antes da versão completa, vamos criar um mínimo funcional.

Arquivo:

```text
CalculadoraMinima.java
```

Código:

```java
import java.util.Scanner;

public class CalculadoraMinima {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o primeiro número:");
        double primeiro = scanner.nextDouble();

        System.out.println("Digite o segundo número:");
        double segundo = scanner.nextDouble();

        double resultado = somar(primeiro, segundo);

        System.out.println("Resultado: " + resultado);

        scanner.close();
    }

    public static double somar(double primeiro, double segundo) {
        return primeiro + segundo;
    }
}
```

Compile:

```powershell
javac CalculadoraMinima.java
```

Execute:

```powershell
java CalculadoraMinima
```

Teste:

```text
10
20
```

Saída esperada:

```text
Resultado: 30.0
```

Esse exemplo mínimo só prova a ideia de operação por método.

Agora vamos evoluir.

---

## Versão com menu simples

Arquivo:

```text
CalculadoraMenuSimples.java
```

Código:

```java
import java.util.Scanner;

public class CalculadoraMenuSimples {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        boolean executando = true;

        while (executando) {
            exibirMenu();

            int opcao = scanner.nextInt();

            if (opcao == 1) {
                System.out.println("Soma selecionada.");
            } else if (opcao == 2) {
                System.out.println("Subtração selecionada.");
            } else if (opcao == 0) {
                executando = false;
            } else {
                System.out.println("Opção inválida.");
            }
        }

        System.out.println("Programa encerrado.");

        scanner.close();
    }

    public static void exibirMenu() {
        System.out.println("==== CALCULADORA ====");
        System.out.println("1 - Soma");
        System.out.println("2 - Subtração");
        System.out.println("0 - Sair");
        System.out.println("Escolha uma opção:");
    }
}
```

Esse exemplo treina:

```text
menu;
while;
if;
método sem retorno.
```

Mas ainda não tem tratamento de erro.

---

## Versão final oficial do projeto

Agora vamos criar a versão completa.

Arquivo oficial:

```text
CalculadoraProfissionalConsole.java
```

Esse é o arquivo que será considerado entrega principal.

Código completo:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CalculadoraProfissionalConsole {
    public static final int CAPACIDADE_HISTORICO = 10;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double[] historicoResultados = new double[CAPACIDADE_HISTORICO];
        int quantidadeResultados = 0;
        int quantidadeOperacoesRealizadas = 0;

        boolean executando = true;

        exibirBoasVindas();

        while (executando) {
            exibirMenu();

            int opcao = lerInteiro(scanner, "Escolha uma opção:");

            if (opcao == 1) {
                double resultado = executarSoma(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 2) {
                double resultado = executarSubtracao(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 3) {
                double resultado = executarMultiplicacao(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 4) {
                boolean operacaoRealizada = executarDivisao(scanner, historicoResultados, quantidadeResultados);

                if (operacaoRealizada) {
                    quantidadeResultados = registrarResultado(
                            historicoResultados,
                            quantidadeResultados,
                            ultimoResultado(historicoResultados, quantidadeResultados)
                    );

                    quantidadeOperacoesRealizadas++;
                }
            } else if (opcao == 5) {
                exibirHistorico(historicoResultados, quantidadeResultados);
            } else if (opcao == 6) {
                exibirEstatisticas(historicoResultados, quantidadeResultados, quantidadeOperacoesRealizadas);
            } else if (opcao == 0) {
                exibirRelatorioFinal(historicoResultados, quantidadeResultados, quantidadeOperacoesRealizadas);
                executando = false;
            } else {
                System.out.println("Opção inválida. Escolha uma opção do menu.");
            }
        }

        scanner.close();
    }

    public static void exibirBoasVindas() {
        System.out.println("========================================");
        System.out.println("CALCULADORA PROFISSIONAL CONSOLE");
        System.out.println("========================================");
        System.out.println("Projeto de consolidação do Módulo 1.");
        System.out.println();
    }

    public static void exibirMenu() {
        System.out.println();
        System.out.println("============ MENU ============");
        System.out.println("1 - Somar");
        System.out.println("2 - Subtrair");
        System.out.println("3 - Multiplicar");
        System.out.println("4 - Dividir");
        System.out.println("5 - Exibir histórico");
        System.out.println("6 - Exibir estatísticas");
        System.out.println("0 - Sair");
        System.out.println("==============================");
    }

    public static int lerInteiro(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }

    public static double lerDouble(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                double valor = scanner.nextDouble();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número válido.");

                scanner.nextLine();
            }
        }
    }

    public static double executarSoma(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        double resultado = somar(primeiro, segundo);

        exibirResultado("Soma", primeiro, segundo, resultado);

        return resultado;
    }

    public static double executarSubtracao(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        double resultado = subtrair(primeiro, segundo);

        exibirResultado("Subtração", primeiro, segundo, resultado);

        return resultado;
    }

    public static double executarMultiplicacao(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        double resultado = multiplicar(primeiro, segundo);

        exibirResultado("Multiplicação", primeiro, segundo, resultado);

        return resultado;
    }

    public static boolean executarDivisao(Scanner scanner, double[] historicoResultados, int quantidadeResultados) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        if (segundo == 0) {
            System.out.println("Divisão inválida. Não é permitido dividir por zero.");
            return false;
        }

        double resultado = dividir(primeiro, segundo);

        exibirResultado("Divisão", primeiro, segundo, resultado);

        if (quantidadeResultados < CAPACIDADE_HISTORICO) {
            historicoResultados[quantidadeResultados] = resultado;
        } else {
            deslocarHistoricoParaEsquerda(historicoResultados);
            historicoResultados[CAPACIDADE_HISTORICO - 1] = resultado;
        }

        return true;
    }

    public static double somar(double primeiro, double segundo) {
        return primeiro + segundo;
    }

    public static double subtrair(double primeiro, double segundo) {
        return primeiro - segundo;
    }

    public static double multiplicar(double primeiro, double segundo) {
        return primeiro * segundo;
    }

    public static double dividir(double primeiro, double segundo) {
        return primeiro / segundo;
    }

    public static void exibirResultado(String operacao, double primeiro, double segundo, double resultado) {
        System.out.println();
        System.out.println("Operação: " + operacao);
        System.out.println("Primeiro número: " + primeiro);
        System.out.println("Segundo número: " + segundo);
        System.out.println("Resultado: " + resultado);

        if (resultadoPar(resultado)) {
            System.out.println("Classificação: resultado par");
        } else {
            System.out.println("Classificação: resultado não par");
        }
    }

    public static int registrarResultado(double[] historicoResultados, int quantidadeResultados, double resultado) {
        if (quantidadeResultados < CAPACIDADE_HISTORICO) {
            historicoResultados[quantidadeResultados] = resultado;
            return quantidadeResultados + 1;
        }

        deslocarHistoricoParaEsquerda(historicoResultados);
        historicoResultados[CAPACIDADE_HISTORICO - 1] = resultado;

        return CAPACIDADE_HISTORICO;
    }

    public static void deslocarHistoricoParaEsquerda(double[] historicoResultados) {
        for (int indice = 0; indice < historicoResultados.length - 1; indice++) {
            historicoResultados[indice] = historicoResultados[indice + 1];
        }
    }

    public static double ultimoResultado(double[] historicoResultados, int quantidadeResultados) {
        if (quantidadeResultados == 0) {
            return historicoResultados[0];
        }

        if (quantidadeResultados < CAPACIDADE_HISTORICO) {
            return historicoResultados[quantidadeResultados];
        }

        return historicoResultados[CAPACIDADE_HISTORICO - 1];
    }

    public static void exibirHistorico(double[] historicoResultados, int quantidadeResultados) {
        System.out.println();
        System.out.println("========== HISTÓRICO ==========");

        if (quantidadeResultados == 0) {
            System.out.println("Nenhum resultado registrado.");
            return;
        }

        for (int indice = 0; indice < quantidadeResultados; indice++) {
            System.out.println((indice + 1) + " - " + historicoResultados[indice]);
        }
    }

    public static void exibirEstatisticas(
            double[] historicoResultados,
            int quantidadeResultados,
            int quantidadeOperacoesRealizadas
    ) {
        System.out.println();
        System.out.println("======== ESTATÍSTICAS ========");
        System.out.println("Operações realizadas: " + quantidadeOperacoesRealizadas);
        System.out.println("Resultados no histórico: " + quantidadeResultados);
        System.out.println("Resultados pares no histórico: " + contarResultadosPares(historicoResultados, quantidadeResultados));

        if (quantidadeResultados > 0) {
            System.out.println("Maior resultado: " + calcularMaior(historicoResultados, quantidadeResultados));
            System.out.println("Menor resultado: " + calcularMenor(historicoResultados, quantidadeResultados));
            System.out.println("Média dos resultados: " + calcularMedia(historicoResultados, quantidadeResultados));
        }
    }

    public static int contarResultadosPares(double[] historicoResultados, int quantidadeResultados) {
        int quantidadePares = 0;

        for (int indice = 0; indice < quantidadeResultados; indice++) {
            if (resultadoPar(historicoResultados[indice])) {
                quantidadePares++;
            }
        }

        return quantidadePares;
    }

    public static boolean resultadoPar(double resultado) {
        return resultado % 1 == 0 && resultado % 2 == 0;
    }

    public static double calcularMaior(double[] historicoResultados, int quantidadeResultados) {
        double maior = historicoResultados[0];

        for (int indice = 1; indice < quantidadeResultados; indice++) {
            if (historicoResultados[indice] > maior) {
                maior = historicoResultados[indice];
            }
        }

        return maior;
    }

    public static double calcularMenor(double[] historicoResultados, int quantidadeResultados) {
        double menor = historicoResultados[0];

        for (int indice = 1; indice < quantidadeResultados; indice++) {
            if (historicoResultados[indice] < menor) {
                menor = historicoResultados[indice];
            }
        }

        return menor;
    }

    public static double calcularMedia(double[] historicoResultados, int quantidadeResultados) {
        double soma = 0.0;

        for (int indice = 0; indice < quantidadeResultados; indice++) {
            soma += historicoResultados[indice];
        }

        return soma / quantidadeResultados;
    }

    public static void exibirRelatorioFinal(
            double[] historicoResultados,
            int quantidadeResultados,
            int quantidadeOperacoesRealizadas
    ) {
        System.out.println();
        System.out.println("======== RELATÓRIO FINAL ========");
        System.out.println("Operações realizadas: " + quantidadeOperacoesRealizadas);
        System.out.println("Resultados armazenados: " + quantidadeResultados);
        System.out.println("Resultados pares armazenados: " + contarResultadosPares(historicoResultados, quantidadeResultados));

        if (quantidadeResultados > 0) {
            System.out.println("Últimos resultados:");
            exibirHistorico(historicoResultados, quantidadeResultados);
        }

        System.out.println("Programa encerrado.");
    }
}
```

Essa versão compila, mas tem um ponto que merece revisão técnica.

O método `executarDivisao` registra o resultado diretamente no histórico e depois o `main` tenta registrar novamente usando `ultimoResultado`.

Isso é uma oportunidade de refatoração.

Como estamos fazendo mini projeto profissional, vamos corrigir.

A versão final deve ter comportamento consistente:

```text
cada método executarOperacao deve apenas calcular, exibir e retornar resultado;
o main deve registrar o resultado no histórico.
```

Para divisão, precisamos retornar algo que indique se a operação aconteceu ou não.

Como ainda não estudamos objetos nem `Optional`, usaremos um padrão simples:

```text
para divisão, validaremos antes no próprio método principal de execução.
```

Mas a melhor forma, neste nível, é fazer `executarDivisao` repetir a leitura do divisor enquanto for zero.

Assim ela sempre retorna um resultado válido.

---

## Versão final corrigida e recomendada

Use esta versão como entrega oficial.

Arquivo:

```text
CalculadoraProfissionalConsole.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class CalculadoraProfissionalConsole {
    public static final int CAPACIDADE_HISTORICO = 10;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double[] historicoResultados = new double[CAPACIDADE_HISTORICO];
        int quantidadeResultados = 0;
        int quantidadeOperacoesRealizadas = 0;

        boolean executando = true;

        exibirBoasVindas();

        while (executando) {
            exibirMenu();

            int opcao = lerInteiro(scanner, "Escolha uma opção:");

            if (opcao == 1) {
                double resultado = executarSoma(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 2) {
                double resultado = executarSubtracao(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 3) {
                double resultado = executarMultiplicacao(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 4) {
                double resultado = executarDivisao(scanner);
                quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
                quantidadeOperacoesRealizadas++;
            } else if (opcao == 5) {
                exibirHistorico(historicoResultados, quantidadeResultados);
            } else if (opcao == 6) {
                exibirEstatisticas(historicoResultados, quantidadeResultados, quantidadeOperacoesRealizadas);
            } else if (opcao == 0) {
                exibirRelatorioFinal(historicoResultados, quantidadeResultados, quantidadeOperacoesRealizadas);
                executando = false;
            } else {
                System.out.println("Opção inválida. Escolha uma opção do menu.");
            }
        }

        scanner.close();
    }

    public static void exibirBoasVindas() {
        System.out.println("========================================");
        System.out.println("CALCULADORA PROFISSIONAL CONSOLE");
        System.out.println("========================================");
        System.out.println("Projeto de consolidação do Módulo 1.");
        System.out.println();
    }

    public static void exibirMenu() {
        System.out.println();
        System.out.println("============ MENU ============");
        System.out.println("1 - Somar");
        System.out.println("2 - Subtrair");
        System.out.println("3 - Multiplicar");
        System.out.println("4 - Dividir");
        System.out.println("5 - Exibir histórico");
        System.out.println("6 - Exibir estatísticas");
        System.out.println("0 - Sair");
        System.out.println("==============================");
    }

    public static int lerInteiro(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                int valor = scanner.nextInt();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número inteiro.");

                scanner.nextLine();
            }
        }
    }

    public static double lerDouble(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);

                double valor = scanner.nextDouble();
                scanner.nextLine();

                return valor;
            } catch (InputMismatchException erro) {
                System.out.println("Entrada inválida. Digite um número válido.");

                scanner.nextLine();
            }
        }
    }

    public static double lerDivisorValido(Scanner scanner) {
        while (true) {
            double divisor = lerDouble(scanner, "Digite o segundo número:");

            if (divisor != 0) {
                return divisor;
            }

            System.out.println("Divisão inválida. O segundo número não pode ser zero.");
        }
    }

    public static double executarSoma(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        double resultado = somar(primeiro, segundo);

        exibirResultado("Soma", primeiro, segundo, resultado);

        return resultado;
    }

    public static double executarSubtracao(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        double resultado = subtrair(primeiro, segundo);

        exibirResultado("Subtração", primeiro, segundo, resultado);

        return resultado;
    }

    public static double executarMultiplicacao(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDouble(scanner, "Digite o segundo número:");

        double resultado = multiplicar(primeiro, segundo);

        exibirResultado("Multiplicação", primeiro, segundo, resultado);

        return resultado;
    }

    public static double executarDivisao(Scanner scanner) {
        double primeiro = lerDouble(scanner, "Digite o primeiro número:");
        double segundo = lerDivisorValido(scanner);

        double resultado = dividir(primeiro, segundo);

        exibirResultado("Divisão", primeiro, segundo, resultado);

        return resultado;
    }

    public static double somar(double primeiro, double segundo) {
        return primeiro + segundo;
    }

    public static double subtrair(double primeiro, double segundo) {
        return primeiro - segundo;
    }

    public static double multiplicar(double primeiro, double segundo) {
        return primeiro * segundo;
    }

    public static double dividir(double primeiro, double segundo) {
        return primeiro / segundo;
    }

    public static void exibirResultado(String operacao, double primeiro, double segundo, double resultado) {
        System.out.println();
        System.out.println("Operação: " + operacao);
        System.out.println("Primeiro número: " + primeiro);
        System.out.println("Segundo número: " + segundo);
        System.out.println("Resultado: " + resultado);

        if (resultadoPar(resultado)) {
            System.out.println("Classificação: resultado par");
        } else {
            System.out.println("Classificação: resultado não par");
        }
    }

    public static int registrarResultado(double[] historicoResultados, int quantidadeResultados, double resultado) {
        if (quantidadeResultados < historicoResultados.length) {
            historicoResultados[quantidadeResultados] = resultado;
            return quantidadeResultados + 1;
        }

        deslocarHistoricoParaEsquerda(historicoResultados);
        historicoResultados[historicoResultados.length - 1] = resultado;

        return historicoResultados.length;
    }

    public static void deslocarHistoricoParaEsquerda(double[] historicoResultados) {
        for (int indice = 0; indice < historicoResultados.length - 1; indice++) {
            historicoResultados[indice] = historicoResultados[indice + 1];
        }
    }

    public static void exibirHistorico(double[] historicoResultados, int quantidadeResultados) {
        System.out.println();
        System.out.println("========== HISTÓRICO ==========");

        if (quantidadeResultados == 0) {
            System.out.println("Nenhum resultado registrado.");
            return;
        }

        for (int indice = 0; indice < quantidadeResultados; indice++) {
            System.out.println((indice + 1) + " - " + historicoResultados[indice]);
        }
    }

    public static void exibirEstatisticas(
            double[] historicoResultados,
            int quantidadeResultados,
            int quantidadeOperacoesRealizadas
    ) {
        System.out.println();
        System.out.println("======== ESTATÍSTICAS ========");
        System.out.println("Operações realizadas: " + quantidadeOperacoesRealizadas);
        System.out.println("Resultados no histórico: " + quantidadeResultados);
        System.out.println("Resultados pares no histórico: " + contarResultadosPares(historicoResultados, quantidadeResultados));

        if (quantidadeResultados > 0) {
            System.out.println("Maior resultado: " + calcularMaior(historicoResultados, quantidadeResultados));
            System.out.println("Menor resultado: " + calcularMenor(historicoResultados, quantidadeResultados));
            System.out.println("Média dos resultados: " + calcularMedia(historicoResultados, quantidadeResultados));
        }
    }

    public static int contarResultadosPares(double[] historicoResultados, int quantidadeResultados) {
        int quantidadePares = 0;

        for (int indice = 0; indice < quantidadeResultados; indice++) {
            if (resultadoPar(historicoResultados[indice])) {
                quantidadePares++;
            }
        }

        return quantidadePares;
    }

    public static boolean resultadoPar(double resultado) {
        return resultado % 1 == 0 && resultado % 2 == 0;
    }

    public static double calcularMaior(double[] historicoResultados, int quantidadeResultados) {
        double maior = historicoResultados[0];

        for (int indice = 1; indice < quantidadeResultados; indice++) {
            if (historicoResultados[indice] > maior) {
                maior = historicoResultados[indice];
            }
        }

        return maior;
    }

    public static double calcularMenor(double[] historicoResultados, int quantidadeResultados) {
        double menor = historicoResultados[0];

        for (int indice = 1; indice < quantidadeResultados; indice++) {
            if (historicoResultados[indice] < menor) {
                menor = historicoResultados[indice];
            }
        }

        return menor;
    }

    public static double calcularMedia(double[] historicoResultados, int quantidadeResultados) {
        double soma = 0.0;

        for (int indice = 0; indice < quantidadeResultados; indice++) {
            soma += historicoResultados[indice];
        }

        return soma / quantidadeResultados;
    }

    public static void exibirRelatorioFinal(
            double[] historicoResultados,
            int quantidadeResultados,
            int quantidadeOperacoesRealizadas
    ) {
        System.out.println();
        System.out.println("======== RELATÓRIO FINAL ========");
        System.out.println("Operações realizadas: " + quantidadeOperacoesRealizadas);
        System.out.println("Resultados armazenados: " + quantidadeResultados);
        System.out.println("Resultados pares armazenados: " + contarResultadosPares(historicoResultados, quantidadeResultados));

        if (quantidadeResultados > 0) {
            System.out.println("Maior resultado: " + calcularMaior(historicoResultados, quantidadeResultados));
            System.out.println("Menor resultado: " + calcularMenor(historicoResultados, quantidadeResultados));
            System.out.println("Média dos resultados: " + calcularMedia(historicoResultados, quantidadeResultados));
            exibirHistorico(historicoResultados, quantidadeResultados);
        }

        System.out.println("Programa encerrado.");
    }
}
```

Essa é a versão oficial recomendada para a entrega do mini projeto.

---

## Por que existe uma versão corrigida

No desenvolvimento profissional, é normal criar uma primeira versão e depois refatorar.

A primeira versão pode funcionar parcialmente, mas ter responsabilidade mal distribuída.

No caso anterior, o método de divisão tentava registrar histórico dentro dele.

Isso misturava responsabilidades.

Melhor:

```text
método executarDivisao calcula e retorna;
main registra resultado;
método registrarResultado cuida do histórico.
```

Essa separação é importante.

Regra:

```text
cada método deve ter uma responsabilidade principal.
```

---

## Explicação dos principais métodos

### main

Responsável por:

```text
criar Scanner;
criar histórico;
controlar loop principal;
ler opção;
chamar métodos conforme opção;
registrar resultados;
encerrar programa.
```

O `main` é o roteiro.

Ele não deve ter todos os detalhes internos.

---

### exibirMenu

Responsável por:

```text
mostrar opções ao usuário.
```

É `void` porque apenas exibe.

---

### lerInteiro

Responsável por:

```text
ler número inteiro com tratamento de entrada inválida.
```

Retorna:

```text
int.
```

Usa:

```text
try/catch;
InputMismatchException;
scanner.nextLine().
```

---

### lerDouble

Responsável por:

```text
ler número decimal com tratamento de entrada inválida.
```

Retorna:

```text
double.
```

---

### lerDivisorValido

Responsável por:

```text
ler o segundo número da divisão;
impedir zero;
repetir até valor válido.
```

Retorna:

```text
double diferente de zero.
```

---

### executarSoma, executarSubtracao, executarMultiplicacao, executarDivisao

Responsáveis por:

```text
ler números necessários;
chamar operação matemática;
exibir resultado;
retornar resultado.
```

---

### somar, subtrair, multiplicar, dividir

Responsáveis apenas pelo cálculo.

Exemplo:

```java
public static double somar(double primeiro, double segundo) {
    return primeiro + segundo;
}
```

Esses métodos não devem imprimir.

Eles calculam e retornam.

---

### registrarResultado

Responsável por:

```text
guardar resultado no histórico;
respeitar limite do array;
deslocar histórico quando estiver cheio;
retornar nova quantidade de resultados.
```

Esse método usa passagem de referência para alterar o conteúdo do array.

Também retorna o novo contador.

---

### deslocarHistoricoParaEsquerda

Responsável por remover o resultado mais antigo na prática.

Exemplo:

```text
antes:
[10, 20, 30]

depois de deslocar:
[20, 30, 30]

depois de inserir novo no fim:
[20, 30, 40]
```

É um método de mutação.

Ele altera o array recebido.

---

### exibirHistorico

Responsável por:

```text
mostrar resultados armazenados.
```

Se não houver resultados, mostra mensagem clara.

---

### contarResultadosPares

Responsável por:

```text
percorrer histórico;
contar resultados considerados pares.
```

Retorna:

```text
int.
```

---

### resultadoPar

Responsável por:

```text
verificar se um resultado é inteiro e divisível por 2.
```

Retorna:

```text
boolean.
```

---

### calcularMaior, calcularMenor, calcularMedia

Responsáveis por estatísticas.

Esses métodos assumem:

```text
quantidadeResultados > 0.
```

Por isso, só são chamados após validação.

---

## Testes manuais obrigatórios

Execute a aplicação e teste.

### Teste 1 — Soma

Entrada:

```text
1
10
20
0
```

Resultado esperado:

```text
resultado 30.0;
relatório final com 1 operação;
resultado par armazenado.
```

---

### Teste 2 — Subtração

Entrada:

```text
2
20
5
0
```

Resultado esperado:

```text
resultado 15.0;
não par.
```

---

### Teste 3 — Multiplicação

Entrada:

```text
3
4
5
0
```

Resultado esperado:

```text
resultado 20.0;
par.
```

---

### Teste 4 — Divisão válida

Entrada:

```text
4
10
2
0
```

Resultado esperado:

```text
resultado 5.0;
não par.
```

---

### Teste 5 — Divisão por zero

Entrada:

```text
4
10
0
2
0
```

Resultado esperado:

```text
programa avisa que divisor não pode ser zero;
pede o segundo número novamente;
calcula 10 / 2;
resultado 5.0.
```

---

### Teste 6 — Entrada inválida no menu

Entrada:

```text
abc
0
```

Resultado esperado:

```text
mensagem de entrada inválida;
programa não quebra;
menu continua;
sair funciona.
```

---

### Teste 7 — Entrada inválida em número

Entrada:

```text
1
abc
10
20
0
```

Resultado esperado:

```text
mensagem de entrada inválida;
programa pede novamente;
soma 10 + 20.
```

---

### Teste 8 — Histórico vazio

Entrada:

```text
5
0
```

Resultado esperado:

```text
Nenhum resultado registrado.
```

---

### Teste 9 — Estatísticas vazias

Entrada:

```text
6
0
```

Resultado esperado:

```text
Operações realizadas: 0;
Resultados no histórico: 0;
Resultados pares no histórico: 0;
sem maior, menor e média.
```

---

### Teste 10 — Histórico com mais de 10 resultados

Faça 11 operações simples.

Exemplo:

```text
1 1 1
1 2 2
1 3 3
1 4 4
1 5 5
1 6 6
1 7 7
1 8 8
1 9 9
1 10 10
1 11 11
5
0
```

Resultado esperado:

```text
histórico mantém apenas 10 resultados;
o mais antigo sai;
o novo entra no fim.
```

---

## Debug obrigatório do projeto

Use debug nos seguintes pontos.

### Breakpoint 1 — leitura da opção

Linha:

```java
int opcao = lerInteiro(scanner, "Escolha uma opção:");
```

Observe:

```text
opção digitada;
retorno do método lerInteiro.
```

---

### Breakpoint 2 — escolha da operação

Linha:

```java
if (opcao == 1) {
```

Observe:

```text
qual if será executado.
```

---

### Breakpoint 3 — execução de soma

Linha:

```java
double resultado = executarSoma(scanner);
```

Use Step Into.

Observe:

```text
primeiro número;
segundo número;
resultado;
return.
```

---

### Breakpoint 4 — registro no histórico

Linha:

```java
quantidadeResultados = registrarResultado(historicoResultados, quantidadeResultados, resultado);
```

Use Step Into.

Observe:

```text
array antes;
quantidade antes;
posição de gravação;
quantidade retornada.
```

---

### Breakpoint 5 — histórico cheio

Quando o histórico tiver 10 resultados, entre em:

```java
deslocarHistoricoParaEsquerda(historicoResultados);
```

Observe:

```text
cada posição recebendo a próxima.
```

---

### Breakpoint 6 — resultado par

Linha:

```java
if (resultadoPar(resultado)) {
```

Use Step Into.

Observe:

```text
resultado % 1;
resultado % 2;
boolean final.
```

---

### Breakpoint 7 — divisão por zero

Linha:

```java
if (divisor != 0) {
```

Teste com zero.

Observe o loop repetindo.

---

### Breakpoint 8 — relatório final

Linha:

```java
exibirRelatorioFinal(historicoResultados, quantidadeResultados, quantidadeOperacoesRealizadas);
```

Observe:

```text
quantidade de operações;
quantidade de resultados;
pares;
maior;
menor;
média.
```

---

## Documentação curta obrigatória do projeto

Crie um arquivo:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Calculadora Profissional Console

## Funcionalidades

- Soma
- Subtração
- Multiplicação
- Divisão com bloqueio de divisão por zero
- Histórico de até 10 resultados
- Rotação do histórico quando ultrapassa 10 resultados
- Contagem de resultados pares
- Maior resultado
- Menor resultado
- Média dos resultados
- Tratamento de entrada inválida com `try/catch`
- Menu em loop até o usuário sair

## Regras

- O histórico armazena no máximo 10 resultados.
- Quando o histórico está cheio, o resultado mais antigo é removido.
- Um resultado é considerado par quando é inteiro e divisível por 2.
- Divisão por zero não é permitida.
- Entrada inválida não deve quebrar o programa.

## Como executar

```powershell
javac CalculadoraProfissionalConsole.java
java CalculadoraProfissionalConsole
```

## Conceitos praticados

- Variáveis
- Tipos
- Operadores
- Condicionais
- Laços
- Arrays
- Métodos
- Parâmetros
- Retorno
- Escopo
- Passagem de valores e referências
- Tratamento inicial de erros
- Debug
```

Esse README faz parte da entrega.

---

## Organização recomendada da pasta

Crie a pasta:

```powershell
mkdir labs\m1\aula-061-mini-projeto-calculadora-profissional-console
cd labs\m1\aula-061-mini-projeto-calculadora-profissional-console
```

Arquivos:

```text
CalculadoraProfissionalConsole.java
CalculadoraMinima.java
CalculadoraMenuSimples.java
README.md
TESTES_MANUAIS.md
```

O arquivo principal é:

```text
CalculadoraProfissionalConsole.java
```

Os outros servem como evolução e apoio.

---

## Arquivo de testes manuais

Crie:

```text
TESTES_MANUAIS.md
```

Conteúdo sugerido:

```markdown
# Testes manuais — Calculadora Profissional Console

## Teste 1 — Soma válida

Entrada:
```text
1
10
20
0
```

Resultado esperado:
```text
Resultado: 30.0
Operações realizadas: 1
Resultados pares armazenados: 1
```

## Teste 2 — Divisão por zero

Entrada:
```text
4
10
0
2
0
```

Resultado esperado:
```text
Mensagem de divisor inválido
Resultado final 5.0
```

## Teste 3 — Entrada inválida no menu

Entrada:
```text
abc
0
```

Resultado esperado:
```text
Mensagem de entrada inválida
Programa continua
Programa encerra ao digitar 0
```

## Teste 4 — Histórico vazio

Entrada:
```text
5
0
```

Resultado esperado:
```text
Nenhum resultado registrado.
```

## Teste 5 — Estatísticas vazias

Entrada:
```text
6
0
```

Resultado esperado:
```text
Operações realizadas: 0
Resultados no histórico: 0
Resultados pares no histórico: 0
```
```

A documentação não precisa ser enorme.

Mas precisa existir e ser clara.

---

## Erros comuns no mini projeto

### Erro 1 — Colocar todo código no main

O `main` deve ser roteiro.

Não deve concentrar todos os detalhes.

---

### Erro 2 — Não tratar entrada inválida

Se digitar `abc`, o programa não deve quebrar.

---

### Erro 3 — Não limpar Scanner no catch

Sem:

```java
scanner.nextLine();
```

o programa pode travar em erro repetido.

---

### Erro 4 — Permitir divisão por zero

A divisão deve bloquear divisor zero.

---

### Erro 5 — Estourar o array do histórico

Se tentar gravar na posição 10 de um array de tamanho 10, dá erro.

Lembre:

```text
último índice válido é 9.
```

---

### Erro 6 — Não controlar quantidadeResultados

O array tem 10 posições, mas nem todas estão preenchidas no início.

Use:

```java
quantidadeResultados
```

para saber quantos resultados são válidos.

---

### Erro 7 — Contar pares percorrendo array inteiro

Se percorrer as 10 posições sempre, pode contar zeros não usados.

Use:

```java
indice < quantidadeResultados
```

---

### Erro 8 — Calcular maior e menor sem resultado

Se `quantidadeResultados == 0`, não acesse:

```java
historicoResultados[0]
```

---

### Erro 9 — Misturar cálculo com exibição

Métodos como `somar`, `subtrair`, `multiplicar` e `dividir` devem apenas calcular e retornar.

---

### Erro 10 — Não documentar a regra de par

Como usamos `double`, a regra precisa ficar clara:

```text
par apenas se for inteiro e divisível por 2.
```

---

## Checklist de qualidade do código

Antes de entregar, confirme:

```text
o arquivo principal se chama CalculadoraProfissionalConsole.java;
a classe se chama CalculadoraProfissionalConsole;
o programa compila;
o programa executa;
o menu aparece;
a opção sair funciona;
soma funciona;
subtração funciona;
multiplicação funciona;
divisão funciona;
divisão por zero é bloqueada;
entrada inválida não quebra o programa;
histórico vazio mostra mensagem correta;
histórico com resultados mostra apenas resultados válidos;
histórico não estoura após 10 resultados;
estatísticas funcionam com histórico vazio;
estatísticas funcionam com histórico preenchido;
resultado par segue regra documentada;
métodos têm nomes claros;
cálculos estão em métodos com retorno;
exibições estão em métodos void;
README foi criado;
TESTES_MANUAIS foi criado;
debug foi feito;
git status está limpo após commit.
```

---

## Checklist de aprendizado

Além do código, você precisa conseguir explicar:

```text
por que o menu usa while;
por que executando começa true;
por que opção 0 muda executando para false;
por que lerInteiro usa try/catch;
por que scanner.nextLine aparece após nextInt/nextDouble;
por que divisão por zero precisa validação;
por que histórico usa array;
por que quantidadeResultados é necessária;
por que o array tem capacidade 10;
por que deslocar histórico evita erro;
por que resultadoPar precisa verificar se é inteiro;
por que somar retorna double;
por que exibirMenu é void;
por que main deve ser roteiro;
por que métodos pequenos ajudam debug.
```

Se não consegue explicar, ainda não terminou.

---

## Atividade guiada

Execute os comandos:

```powershell
mkdir labs\m1\aula-061-mini-projeto-calculadora-profissional-console
cd labs\m1\aula-061-mini-projeto-calculadora-profissional-console
```

Crie:

```text
CalculadoraProfissionalConsole.java
README.md
TESTES_MANUAIS.md
```

Compile:

```powershell
javac CalculadoraProfissionalConsole.java
```

Execute:

```powershell
java CalculadoraProfissionalConsole
```

Teste entradas válidas e inválidas.

Depois rode debug no IntelliJ.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-061-mini-projeto-calculadora-profissional-console docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 061: mini projeto calculadora profissional console"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
criar o projeto na pasta correta;
criar CalculadoraProfissionalConsole.java;
compilar o projeto;
executar o projeto;
exibir menu em loop;
ler opção com tratamento de erro;
implementar soma;
implementar subtração;
implementar multiplicação;
implementar divisão;
bloquear divisão por zero;
criar métodos de operação;
criar métodos de leitura segura;
usar try/catch com InputMismatchException;
limpar entrada inválida;
armazenar resultados em array;
limitar histórico a 10 resultados;
deslocar histórico quando cheio;
contar resultados pares;
explicar regra de par para double;
exibir histórico vazio;
exibir histórico preenchido;
exibir estatísticas;
calcular maior;
calcular menor;
calcular média;
exibir relatório final;
criar README;
criar TESTES_MANUAIS;
executar testes manuais;
usar debug nos pontos principais;
explicar responsabilidades dos métodos;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda usar orientação a objetos.

Não precisa ainda usar Maven.

Não precisa ainda usar banco de dados.

Não precisa ainda usar testes automatizados.

Não precisa ainda usar interface gráfica.

Não precisa ainda usar Spring Boot.

Esses assuntos virão depois.

O objetivo é consolidar o Módulo 1 com um projeto de console completo, organizado e explicável.

---

## Fechamento do Módulo 1

Este mini projeto encerra o Módulo 1.

Você saiu de:

```text
primeiro programa Java;
variáveis;
if;
laços;
arrays;
métodos;
entrada;
debug.
```

E chegou a:

```text
uma aplicação console organizada;
com menu;
com validação;
com tratamento de erro;
com histórico;
com estatística;
com documentação;
com debug;
com commit.
```

Isso é uma base real.

Ainda não é backend com Spring.

Ainda não é arquitetura.

Ainda não é API REST.

Mas é o chão necessário para tudo isso.

Sem esse chão, Spring vira decoreba.

Com esse chão, Spring começa a fazer sentido.

---

## Fechamento da aula

Hoje construímos o mini projeto Calculadora Profissional Console.

A ideia central foi:

```text
consolidar fundamentos em uma aplicação pequena, organizada e testável.
```

O projeto usou:

```text
menu;
while;
if;
métodos;
retorno;
parâmetros;
arrays;
histórico;
validação;
try/catch;
debug;
documentação.
```

O ponto mais importante é:

```text
não basta funcionar; precisa estar organizado, validado, testado e explicável.
```

Na próxima aula, iniciaremos o Módulo 2.

O próximo tema será:

```text
JVM, bytecode e execução por baixo.
```

A partir daqui, vamos começar a entender Java de forma mais profunda, saindo do uso básico da linguagem e entrando no funcionamento interno da plataforma.
