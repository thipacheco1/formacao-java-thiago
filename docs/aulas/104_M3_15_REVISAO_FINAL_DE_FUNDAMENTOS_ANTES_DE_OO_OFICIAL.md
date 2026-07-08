# 104 — M3.15 — Revisão final de fundamentos antes de OO

## Objetivo da aula

Nesta aula você vai revisar os fundamentos mais importantes antes de entrar em Orientação a Objetos.

A ideia é confirmar se você consegue programar com segurança usando:

```text
variáveis;
tipos;
condições;
laços;
arrays;
records;
enums;
métodos;
leitura no console;
validação;
cálculo;
exibição;
debug;
refatoração;
Git.
```

Esta aula funciona como uma pequena prova prática. Não é para decorar. É para mostrar que você consegue resolver um problema simples, explicar suas decisões e manter o código organizado.

Ao final, você deve estar pronto para começar Orientação a Objetos sem carregar dúvidas graves sobre fundamentos.

---

## Por que revisar antes de Orientação a Objetos

Orientação a Objetos não resolve falta de base.

Se o aluno ainda sofre com:

```text
if;
for;
while;
array;
método;
parâmetro;
retorno;
validação;
debug;
organização do main;
```

então classes e objetos vão parecer mais difíceis do que realmente são.

Antes de criar classes, precisamos garantir que você sabe organizar raciocínio.

Pense nesta revisão como uma ponte:

```text
fundamentos procedurais bem organizados
        ↓
pensamento orientado a objetos
        ↓
backend Java com estrutura real
```

A partir da próxima aula, vamos começar a pensar em classe, objeto, estado, comportamento e identidade.

Mas antes disso, vamos fechar bem esta etapa.

---

## O que você precisa conseguir explicar

Antes de codar, responda em voz alta ou por escrito.

### Fundamentos

```text
1. Para que serve uma variável?
2. Qual a diferença entre int, double, boolean, char e String?
3. Quando usar BigDecimal?
4. O que é uma condição?
5. O que é um laço?
6. Quando usar while?
7. Quando usar for?
8. O que é um array?
9. O que é um método?
10. O que é parâmetro?
11. O que é retorno?
12. O que é escopo?
13. O que é null?
14. O que é enum?
15. O que é record?
```

### Organização

```text
1. Por que não deixar tudo no main?
2. O que é método de leitura?
3. O que é método de validação?
4. O que é método de cálculo?
5. O que é método de exibição?
6. O que é reuso sem duplicação?
7. Quando Extract Method ajuda?
8. O que é debug entrando em métodos?
9. Como a call stack ajuda?
10. Como saber se um método está fazendo coisa demais?
```

Se você não souber responder alguma dessas perguntas, volte nas aulas anteriores e revise.

---

## Mapa mental da revisão

O raciocínio que queremos consolidar é este:

```text
Entrada
  ↓
Leitura
  ↓
Validação
  ↓
Processamento
  ↓
Resumo
  ↓
Exibição
  ↓
Histórico / relatório
```

Esse fluxo apareceu nas últimas aulas porque ele é muito comum em sistemas backend.

Em uma API real, a entrada pode vir de uma requisição HTTP.

No console, a entrada vem do teclado.

A ideia central é a mesma:

```text
receber dados;
validar;
aplicar regra;
produzir resposta.
```

---

## Prova prática da aula

Você vai criar um pequeno sistema console chamado:

```text
RevisaoFundamentosAntesDeOo.java
```

Ele vai processar solicitações internas de atendimento.

O programa deve permitir:

```text
1 - Cadastrar solicitação
2 - Ver histórico
3 - Ver relatório
0 - Sair
```

Cada solicitação terá:

```text
protocolo;
cliente;
tipo;
prioridade;
quantidade de dias em aberto.
```

O sistema deve calcular:

```text
se está atrasada;
se é crítica;
fila sugerida;
resumo da solicitação.
```

---

## Regras do sistema

Use estas regras:

```text
protocolo é obrigatório;
cliente é obrigatório;
tipo é obrigatório;
prioridade deve ser BAIXA, MEDIA ou ALTA;
dias em aberto não pode ser negativo;
solicitação com mais de 5 dias em aberto está atrasada;
solicitação de prioridade ALTA é crítica;
solicitação atrasada também é crítica;
solicitação crítica vai para fila "Casos Críticos";
solicitação não crítica vai para fila "Entrada";
histórico terá limite de 10 solicitações.
```

Essas regras são simples, mas suficientes para revisar fundamentos.

---

## Código base da prova prática

Crie a pasta:

```powershell
mkdir labs\m3\aula-104-revisao-final-de-fundamentos-antes-de-oo
cd labs\m3\aula-104-revisao-final-de-fundamentos-antes-de-oo
```

Crie o arquivo:

```text
RevisaoFundamentosAntesDeOo.java
```

Digite o código:

```java
import java.util.Scanner;

public class RevisaoFundamentosAntesDeOo {
    private static final int LIMITE_HISTORICO = 10;
    private static final int DIAS_PARA_ATRASO = 5;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ResumoSolicitacao[] historico = new ResumoSolicitacao[LIMITE_HISTORICO];
        int quantidadeHistorico = 0;

        boolean executando = true;

        while (executando) {
            imprimirMenu();

            int opcao = lerInteiro(scanner, "Escolha uma opção: ");

            if (opcao == 0) {
                executando = false;
            } else if (opcao == 1) {
                ResumoSolicitacao resumo = executarCadastroSolicitacao(scanner);

                if (resumo != null) {
                    quantidadeHistorico = registrarNoHistorico(
                            historico,
                            quantidadeHistorico,
                            resumo
                    );
                }
            } else if (opcao == 2) {
                imprimirHistorico(historico, quantidadeHistorico);
            } else if (opcao == 3) {
                imprimirRelatorio(historico, quantidadeHistorico);
            } else {
                imprimirErro("Opção inválida.");
            }

            imprimirLinha();
        }

        imprimirEncerramento(historico, quantidadeHistorico);
    }

    public static void imprimirMenu() {
        System.out.println("====================================");
        System.out.println("REVISÃO DE FUNDAMENTOS");
        System.out.println("====================================");
        System.out.println("1 - Cadastrar solicitação");
        System.out.println("2 - Ver histórico");
        System.out.println("3 - Ver relatório");
        System.out.println("0 - Sair");
        System.out.println("------------------------------------");
    }

    public static ResumoSolicitacao executarCadastroSolicitacao(Scanner scanner) {
        SolicitacaoEntrada solicitacao = lerSolicitacao(scanner);

        if (!solicitacaoValida(solicitacao)) {
            imprimirErro("Solicitação inválida.");
            return null;
        }

        ResumoSolicitacao resumo = processarSolicitacao(solicitacao);

        imprimirResumoSolicitacao(resumo);

        return resumo;
    }

    public static SolicitacaoEntrada lerSolicitacao(Scanner scanner) {
        String protocolo = lerTextoObrigatorio(scanner, "Protocolo: ");
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String tipo = lerTextoObrigatorio(scanner, "Tipo: ");
        Prioridade prioridade = lerPrioridade(scanner);
        int diasEmAberto = lerInteiroMinimo(scanner, "Dias em aberto: ", 0);

        return new SolicitacaoEntrada(
                protocolo,
                cliente,
                tipo,
                prioridade,
                diasEmAberto
        );
    }

    public static Prioridade lerPrioridade(Scanner scanner) {
        while (true) {
            System.out.println("Prioridade:");
            System.out.println("1 - BAIXA");
            System.out.println("2 - MEDIA");
            System.out.println("3 - ALTA");

            int opcao = lerInteiro(scanner, "Prioridade: ");

            if (opcao == 1) {
                return Prioridade.BAIXA;
            }

            if (opcao == 2) {
                return Prioridade.MEDIA;
            }

            if (opcao == 3) {
                return Prioridade.ALTA;
            }

            imprimirErro("Prioridade inválida.");
        }
    }

    public static boolean solicitacaoValida(SolicitacaoEntrada solicitacao) {
        return solicitacao != null
                && textoInformado(solicitacao.protocolo())
                && textoInformado(solicitacao.cliente())
                && textoInformado(solicitacao.tipo())
                && solicitacao.prioridade() != null
                && solicitacao.diasEmAberto() >= 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static ResumoSolicitacao processarSolicitacao(SolicitacaoEntrada solicitacao) {
        boolean atrasada = estaAtrasada(solicitacao.diasEmAberto());
        boolean critica = ehCritica(solicitacao.prioridade(), atrasada);
        String filaSugerida = definirFilaSugerida(critica);

        return new ResumoSolicitacao(
                solicitacao.protocolo(),
                solicitacao.cliente(),
                solicitacao.tipo(),
                solicitacao.prioridade(),
                solicitacao.diasEmAberto(),
                atrasada,
                critica,
                filaSugerida
        );
    }

    public static boolean estaAtrasada(int diasEmAberto) {
        return diasEmAberto > DIAS_PARA_ATRASO;
    }

    public static boolean ehCritica(Prioridade prioridade, boolean atrasada) {
        return prioridade == Prioridade.ALTA || atrasada;
    }

    public static String definirFilaSugerida(boolean critica) {
        if (critica) {
            return "Casos Críticos";
        }

        return "Entrada";
    }

    public static int registrarNoHistorico(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico,
            ResumoSolicitacao resumo
    ) {
        if (quantidadeHistorico >= historico.length) {
            imprimirErro("Histórico cheio. Esta solicitação não será armazenada.");
            return quantidadeHistorico;
        }

        historico[quantidadeHistorico] = resumo;

        return quantidadeHistorico + 1;
    }

    public static void imprimirResumoSolicitacao(ResumoSolicitacao resumo) {
        imprimirCabecalho("RESUMO DA SOLICITAÇÃO");
        System.out.println("Protocolo: " + resumo.protocolo());
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Tipo: " + resumo.tipo());
        System.out.println("Prioridade: " + resumo.prioridade());
        System.out.println("Dias em aberto: " + resumo.diasEmAberto());
        System.out.println("Atrasada: " + resumo.atrasada());
        System.out.println("Crítica: " + resumo.critica());
        System.out.println("Fila sugerida: " + resumo.filaSugerida());
    }

    public static void imprimirHistorico(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico
    ) {
        if (quantidadeHistorico == 0) {
            System.out.println("Nenhuma solicitação cadastrada.");
            return;
        }

        imprimirCabecalho("HISTÓRICO");

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            ResumoSolicitacao resumo = historico[indice];

            System.out.println((indice + 1) + " - "
                    + resumo.protocolo()
                    + " | Cliente: " + resumo.cliente()
                    + " | Prioridade: " + resumo.prioridade()
                    + " | Fila: " + resumo.filaSugerida());
        }
    }

    public static void imprimirRelatorio(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico
    ) {
        if (quantidadeHistorico == 0) {
            System.out.println("Não há dados para relatório.");
            return;
        }

        int atrasadas = contarAtrasadas(historico, quantidadeHistorico);
        int criticas = contarCriticas(historico, quantidadeHistorico);
        int filaEntrada = contarPorFila(historico, quantidadeHistorico, "Entrada");
        int filaCriticos = contarPorFila(historico, quantidadeHistorico, "Casos Críticos");
        double mediaDias = calcularMediaDiasEmAberto(historico, quantidadeHistorico);

        imprimirCabecalho("RELATÓRIO");
        System.out.println("Total de solicitações: " + quantidadeHistorico);
        System.out.println("Atrasadas: " + atrasadas);
        System.out.println("Críticas: " + criticas);
        System.out.println("Fila Entrada: " + filaEntrada);
        System.out.println("Fila Casos Críticos: " + filaCriticos);
        System.out.println("Média de dias em aberto: " + mediaDias);
    }

    public static int contarAtrasadas(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico
    ) {
        int contador = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            if (historico[indice].atrasada()) {
                contador++;
            }
        }

        return contador;
    }

    public static int contarCriticas(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico
    ) {
        int contador = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            if (historico[indice].critica()) {
                contador++;
            }
        }

        return contador;
    }

    public static int contarPorFila(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico,
            String fila
    ) {
        int contador = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            if (historico[indice].filaSugerida().equals(fila)) {
                contador++;
            }
        }

        return contador;
    }

    public static double calcularMediaDiasEmAberto(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico
    ) {
        int soma = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            soma += historico[indice].diasEmAberto();
        }

        return (double) soma / quantidadeHistorico;
    }

    public static void imprimirEncerramento(
            ResumoSolicitacao[] historico,
            int quantidadeHistorico
    ) {
        System.out.println("Encerrando revisão.");
        imprimirRelatorio(historico, quantidadeHistorico);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            imprimirErro("Valor obrigatório.");
        }
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

    public static int lerInteiroMinimo(Scanner scanner, String prompt, int minimo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo) {
                return valor;
            }

            imprimirErro("Digite um valor maior ou igual a " + minimo + ".");
        }
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }

    public static void imprimirLinha() {
        System.out.println("------------------------------------");
    }
}

enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA
}

record SolicitacaoEntrada(
        String protocolo,
        String cliente,
        String tipo,
        Prioridade prioridade,
        int diasEmAberto
) {
}

record ResumoSolicitacao(
        String protocolo,
        String cliente,
        String tipo,
        Prioridade prioridade,
        int diasEmAberto,
        boolean atrasada,
        boolean critica,
        String filaSugerida
) {
}
```

---

## Como executar

Compile:

```powershell
javac RevisaoFundamentosAntesDeOo.java
```

Execute:

```powershell
java RevisaoFundamentosAntesDeOo
```

Teste um caso normal:

```text
1
PROT-001
Ana Silva
Entrega
1
2
```

Resultado esperado:

```text
prioridade BAIXA;
não atrasada;
não crítica;
fila Entrada.
```

Teste um caso crítico por prioridade:

```text
1
PROT-002
Carlos Souza
Reagendamento
3
1
```

Resultado esperado:

```text
prioridade ALTA;
crítica;
fila Casos Críticos.
```

Teste um caso crítico por atraso:

```text
1
PROT-003
Maria Lima
Suporte
2
8
```

Resultado esperado:

```text
prioridade MEDIA;
atrasada;
crítica;
fila Casos Críticos.
```

Depois use:

```text
2 - Ver histórico
3 - Ver relatório
0 - Sair
```

---

## O que este projeto revisa

Este projeto revisa muita coisa importante.

### Variáveis e tipos

Você usa:

```text
String;
int;
double;
boolean;
array;
enum;
record.
```

### Condições

Você usa:

```java
if
else if
else
```

para controlar o menu e aplicar regras.

### Laços

Você usa:

```java
while
```

para manter o programa aberto.

Você usa:

```java
for
```

para percorrer o histórico.

### Arrays

Você armazena até 10 resumos:

```java
ResumoSolicitacao[] historico = new ResumoSolicitacao[LIMITE_HISTORICO];
```

### Métodos

Você separa responsabilidades:

```text
ler;
validar;
processar;
contar;
calcular média;
imprimir.
```

### Enum

Você controla os valores possíveis de prioridade:

```java
enum Prioridade {
    BAIXA,
    MEDIA,
    ALTA
}
```

### Record

Você agrupa dados de entrada e saída:

```text
SolicitacaoEntrada;
ResumoSolicitacao.
```

### Debug

Você pode entrar nos métodos e acompanhar o fluxo completo.

---

## Refatoração e leitura crítica

Depois que o programa estiver funcionando, revise o código.

Pergunte:

```text
o main está coordenando ou fazendo detalhes demais?
os métodos têm nomes claros?
algum método faz mais de uma coisa?
alguma validação ficou duplicada?
alguma regra está escondida demais?
o histórico está fácil de entender?
o relatório está fácil de manter?
```

Um bom sinal é conseguir entender o fluxo lendo apenas este trecho:

```java
ResumoSolicitacao resumo = executarCadastroSolicitacao(scanner);

if (resumo != null) {
    quantidadeHistorico = registrarNoHistorico(
            historico,
            quantidadeHistorico,
            resumo
    );
}
```

Você não precisa abrir todos os métodos para entender a intenção principal.

---

## Debug recomendado

Coloque breakpoint nesta linha:

```java
ResumoSolicitacao resumo = executarCadastroSolicitacao(scanner);
```

Entre nos métodos:

```text
executarCadastroSolicitacao;
lerSolicitacao;
lerPrioridade;
solicitacaoValida;
processarSolicitacao;
estaAtrasada;
ehCritica;
definirFilaSugerida;
registrarNoHistorico;
imprimirRelatorio.
```

Observe:

```text
dados digitados;
prioridade escolhida;
resultado da validação;
cálculo de atraso;
decisão de criticidade;
fila sugerida;
posição no array;
quantidadeHistorico aumentando.
```

Esse exercício fecha bem o módulo porque junta lógica, método e debug.

---

## Perguntas orais de revisão

Responda sem olhar o código primeiro.

```text
1. Por que usamos enum para prioridade?
2. Por que usamos record para entrada e resumo?
3. Por que o main não deve calcular a fila diretamente?
4. Por que o histórico precisa de quantidadeHistorico?
5. O que aconteceria se percorrêssemos o array inteiro em vez da quantidade usada?
6. Por que a leitura de inteiro usa try/catch?
7. Qual método define se uma solicitação é crítica?
8. Qual método calcula a média de dias em aberto?
9. Onde a regra de atraso está centralizada?
10. Como você adicionaria uma nova fila sem bagunçar o main?
```

Se você conseguir responder bem, está pronto para seguir.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Executar o fluxo feliz

Cadastre três solicitações válidas.

Depois veja histórico e relatório.

### Parte 2 — Testar entradas inválidas

Teste:

```text
opção de menu inválida;
texto vazio em protocolo;
texto vazio em cliente;
prioridade inválida;
dias em aberto negativo;
texto no lugar de número.
```

O programa não deve quebrar.

### Parte 3 — Confirmar regras

Crie casos para validar:

```text
solicitação atrasada;
solicitação crítica por prioridade;
solicitação crítica por atraso;
solicitação normal.
```

### Parte 4 — Debug

Use debug em pelo menos uma solicitação crítica.

Acompanhe como ela chega na fila:

```text
Casos Críticos
```

### Parte 5 — Git limpo

Ao terminar, rode:

```bash
git status
```

Garanta que você não adicionou arquivos `.class`.

---

## Desafio prático

Crie uma versão:

```text
RevisaoFundamentosAntesDeOoV2.java
```

Adicione uma nova regra:

```text
solicitação do tipo "Fraude" sempre deve ser crítica.
```

Ajuste o código sem colocar essa regra diretamente no `main`.

Sugestão:

```java
public static boolean ehCritica(SolicitacaoEntrada solicitacao, boolean atrasada) {
    return solicitacao.prioridade() == Prioridade.ALTA
            || atrasada
            || solicitacao.tipo().equalsIgnoreCase("Fraude");
}
```

Depois atualize o relatório para mostrar:

```text
quantidade de solicitações de alta prioridade;
quantidade de solicitações do tipo Fraude;
maior número de dias em aberto.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual fundamento você percebeu que já domina melhor?
2. Qual parte ainda precisa revisar?
3. O que mudou na organização do seu código desde o começo do curso?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o fluxo completo do programa;
criar menu com while;
usar if/else para controlar opções;
usar enum para valores controlados;
usar record para agrupar dados;
usar array com contador;
validar entrada do usuário;
centralizar regras em métodos;
processar dados e gerar resumo;
exibir histórico e relatório;
usar debug para acompanhar chamadas;
responder perguntas orais sobre o código;
refatorar uma regra sem bagunçar o main;
manter o Git limpo.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m3/aula-104-revisao-final-de-fundamentos-antes-de-oo
git commit -m "Aula 104: revisa fundamentos antes de OO"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

Esta aula encerra a base procedural antes de Orientação a Objetos.

Você não precisa saber tudo perfeitamente, mas precisa conseguir construir, explicar e organizar um programa pequeno sem depender de copiar código pronto.

A partir da próxima aula, vamos mudar a forma de pensar.

Em vez de perguntar apenas:

```text
quais funções meu programa precisa?
```

vamos começar a perguntar:

```text
quais objetos existem neste problema?
que estado eles carregam?
que comportamento eles têm?
como eles se relacionam?
```

Esse é o começo da Orientação a Objetos.
