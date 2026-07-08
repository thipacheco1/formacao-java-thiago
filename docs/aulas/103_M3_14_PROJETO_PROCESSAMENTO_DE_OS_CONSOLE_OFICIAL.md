# 103 — M3.14 — Projeto processamento de OS console

## Objetivo da aula

Nesta aula você vai construir um pequeno projeto console para processar Ordens de Serviço.

A ideia é aplicar a mesma organização procedural da aula anterior, mas agora em um cenário mais próximo de backend real:

```text
ler dados de uma OS;
validar campos obrigatórios;
calcular dias em aberto;
identificar situação operacional;
gerar resumo;
exibir resultado;
armazenar um histórico simples.
```

O foco não é criar um sistema completo de OS. O foco é treinar como transformar uma regra de negócio pequena em código organizado, legível e preparado para evoluir.

Ao final da aula, o aluno deve conseguir montar um programa console com fluxo claro, métodos por responsabilidade e regras simples de processamento.

---

## O que vamos construir

Vamos criar um programa chamado:

```text
ProcessamentoOsConsole.java
```

Ele terá um menu com opções:

```text
1 - Processar nova OS
2 - Ver histórico
3 - Ver relatório
0 - Sair
```

Para cada OS, o programa vai ler:

```text
certificado;
nome do cliente;
status da OS;
data de abertura;
quantidade de reagendamentos.
```

Depois vai calcular:

```text
dias em aberto;
se está atrasada;
se precisa de atenção;
fila operacional sugerida.
```

E vai exibir um resumo.

---

## Regras do projeto

Para esta aula, vamos usar regras simples:

```text
certificado é obrigatório;
cliente é obrigatório;
status é obrigatório;
data de abertura é obrigatória;
quantidade de reagendamentos não pode ser negativa;
OS com mais de 3 dias em aberto é considerada atrasada;
OS com 2 ou mais reagendamentos precisa de atenção;
OS cancelada não deve ir para fila de atendimento;
OS concluída não deve ir para fila de atendimento;
OS atrasada vai para fila "Casos Críticos";
OS com muitos reagendamentos vai para fila "Reagendamento";
demais OS abertas/agendadas vão para fila "Entrada".
```

Essas regras são didáticas, mas já se parecem com decisões de backend.

---

## Como pensar no fluxo

O fluxo principal deve ficar parecido com uma história:

```java
OrdemServicoEntrada os = lerOrdemServico(scanner);

if (!ordemServicoValida(os)) {
    imprimirErro("OS inválida.");
    return;
}

ResumoOs resumo = processarOrdemServico(os);

imprimirResumoOs(resumo);
```

Esse é o padrão que queremos consolidar:

```text
ler;
validar;
processar;
exibir.
```

O `main` coordena. Os métodos trabalham.

---

## Código completo do projeto

Crie o arquivo:

```text
ProcessamentoOsConsole.java
```

Digite o código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class ProcessamentoOsConsole {
    private static final int LIMITE_HISTORICO = 10;
    private static final int DIAS_PARA_ATRASO = 3;
    private static final int REAGENDAMENTOS_PARA_ATENCAO = 2;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ResumoOs[] historico = new ResumoOs[LIMITE_HISTORICO];
        int quantidadeHistorico = 0;

        boolean executando = true;

        while (executando) {
            imprimirMenu();

            int opcao = lerInteiro(scanner, "Escolha uma opção: ");

            if (opcao == 0) {
                executando = false;
            } else if (opcao == 1) {
                ResumoOs resumo = executarFluxoProcessamento(scanner);

                if (resumo != null) {
                    quantidadeHistorico = registrarNoHistorico(historico, quantidadeHistorico, resumo);
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
        System.out.println("PROCESSAMENTO DE OS");
        System.out.println("====================================");
        System.out.println("1 - Processar nova OS");
        System.out.println("2 - Ver histórico");
        System.out.println("3 - Ver relatório");
        System.out.println("0 - Sair");
        System.out.println("------------------------------------");
    }

    public static ResumoOs executarFluxoProcessamento(Scanner scanner) {
        OrdemServicoEntrada os = lerOrdemServico(scanner);

        if (!ordemServicoValida(os)) {
            imprimirErro("OS inválida. Verifique os dados informados.");
            return null;
        }

        ResumoOs resumo = processarOrdemServico(os);

        imprimirResumoOs(resumo);

        return resumo;
    }

    public static OrdemServicoEntrada lerOrdemServico(Scanner scanner) {
        String certificado = lerTextoObrigatorio(scanner, "Certificado: ");
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        StatusOs status = lerStatusOs(scanner);
        LocalDate dataAbertura = lerData(scanner, "Data de abertura (AAAA-MM-DD): ");
        int quantidadeReagendamentos = lerInteiroMinimo(scanner, "Quantidade de reagendamentos: ", 0);

        return new OrdemServicoEntrada(
                certificado,
                cliente,
                status,
                dataAbertura,
                quantidadeReagendamentos
        );
    }

    public static StatusOs lerStatusOs(Scanner scanner) {
        while (true) {
            System.out.println("Status da OS:");
            System.out.println("1 - ABERTA");
            System.out.println("2 - AGENDADA");
            System.out.println("3 - REAGENDADA");
            System.out.println("4 - CONCLUIDA");
            System.out.println("5 - CANCELADA");

            int opcao = lerInteiro(scanner, "Status: ");

            if (opcao == 1) {
                return StatusOs.ABERTA;
            }

            if (opcao == 2) {
                return StatusOs.AGENDADA;
            }

            if (opcao == 3) {
                return StatusOs.REAGENDADA;
            }

            if (opcao == 4) {
                return StatusOs.CONCLUIDA;
            }

            if (opcao == 5) {
                return StatusOs.CANCELADA;
            }

            imprimirErro("Status inválido.");
        }
    }

    public static boolean ordemServicoValida(OrdemServicoEntrada os) {
        return os != null
                && textoInformado(os.certificado())
                && textoInformado(os.cliente())
                && os.status() != null
                && os.dataAbertura() != null
                && os.quantidadeReagendamentos() >= 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static ResumoOs processarOrdemServico(OrdemServicoEntrada os) {
        long diasEmAberto = calcularDiasEmAberto(os.dataAbertura(), LocalDate.now());
        boolean atrasada = osAtrasada(diasEmAberto);
        boolean precisaAtencao = precisaAtencao(os, atrasada);
        String filaSugerida = definirFilaSugerida(os, atrasada, precisaAtencao);

        return new ResumoOs(
                os.certificado(),
                os.cliente(),
                os.status(),
                os.dataAbertura(),
                os.quantidadeReagendamentos(),
                diasEmAberto,
                atrasada,
                precisaAtencao,
                filaSugerida
        );
    }

    public static long calcularDiasEmAberto(LocalDate dataAbertura, LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);

        if (dias < 0) {
            return 0;
        }

        return dias;
    }

    public static boolean osAtrasada(long diasEmAberto) {
        return diasEmAberto > DIAS_PARA_ATRASO;
    }

    public static boolean precisaAtencao(OrdemServicoEntrada os, boolean atrasada) {
        return atrasada || os.quantidadeReagendamentos() >= REAGENDAMENTOS_PARA_ATENCAO;
    }

    public static String definirFilaSugerida(
            OrdemServicoEntrada os,
            boolean atrasada,
            boolean precisaAtencao
    ) {
        if (os.status() == StatusOs.CANCELADA || os.status() == StatusOs.CONCLUIDA) {
            return "Sem fila";
        }

        if (atrasada) {
            return "Casos Críticos";
        }

        if (precisaAtencao) {
            return "Reagendamento";
        }

        return "Entrada";
    }

    public static int registrarNoHistorico(
            ResumoOs[] historico,
            int quantidadeHistorico,
            ResumoOs resumo
    ) {
        if (quantidadeHistorico >= historico.length) {
            imprimirErro("Histórico cheio. Esta OS não será armazenada.");
            return quantidadeHistorico;
        }

        historico[quantidadeHistorico] = resumo;

        return quantidadeHistorico + 1;
    }

    public static void imprimirResumoOs(ResumoOs resumo) {
        imprimirCabecalho("RESUMO DA OS");
        System.out.println("Certificado: " + resumo.certificado());
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Status: " + resumo.status());
        System.out.println("Data de abertura: " + resumo.dataAbertura());
        System.out.println("Reagendamentos: " + resumo.quantidadeReagendamentos());
        System.out.println("Dias em aberto: " + resumo.diasEmAberto());
        System.out.println("Atrasada: " + resumo.atrasada());
        System.out.println("Precisa atenção: " + resumo.precisaAtencao());
        System.out.println("Fila sugerida: " + resumo.filaSugerida());
    }

    public static void imprimirHistorico(ResumoOs[] historico, int quantidadeHistorico) {
        if (quantidadeHistorico == 0) {
            System.out.println("Nenhuma OS processada ainda.");
            return;
        }

        imprimirCabecalho("HISTÓRICO DE OS");

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            ResumoOs resumo = historico[indice];

            System.out.println((indice + 1) + " - "
                    + resumo.certificado()
                    + " | Cliente: " + resumo.cliente()
                    + " | Status: " + resumo.status()
                    + " | Fila: " + resumo.filaSugerida());
        }
    }

    public static void imprimirRelatorio(ResumoOs[] historico, int quantidadeHistorico) {
        if (quantidadeHistorico == 0) {
            System.out.println("Não há dados para relatório.");
            return;
        }

        int atrasadas = contarAtrasadas(historico, quantidadeHistorico);
        int comAtencao = contarComAtencao(historico, quantidadeHistorico);
        int semFila = contarPorFila(historico, quantidadeHistorico, "Sem fila");
        int filaEntrada = contarPorFila(historico, quantidadeHistorico, "Entrada");
        int filaReagendamento = contarPorFila(historico, quantidadeHistorico, "Reagendamento");
        int filaCriticos = contarPorFila(historico, quantidadeHistorico, "Casos Críticos");

        imprimirCabecalho("RELATÓRIO");
        System.out.println("Total de OS processadas: " + quantidadeHistorico);
        System.out.println("OS atrasadas: " + atrasadas);
        System.out.println("OS que precisam de atenção: " + comAtencao);
        System.out.println("Fila Entrada: " + filaEntrada);
        System.out.println("Fila Reagendamento: " + filaReagendamento);
        System.out.println("Fila Casos Críticos: " + filaCriticos);
        System.out.println("Sem fila: " + semFila);
    }

    public static int contarAtrasadas(ResumoOs[] historico, int quantidadeHistorico) {
        int contador = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            if (historico[indice].atrasada()) {
                contador++;
            }
        }

        return contador;
    }

    public static int contarComAtencao(ResumoOs[] historico, int quantidadeHistorico) {
        int contador = 0;

        for (int indice = 0; indice < quantidadeHistorico; indice++) {
            if (historico[indice].precisaAtencao()) {
                contador++;
            }
        }

        return contador;
    }

    public static int contarPorFila(
            ResumoOs[] historico,
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

    public static void imprimirEncerramento(ResumoOs[] historico, int quantidadeHistorico) {
        System.out.println("Encerrando processamento de OS.");
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

    public static LocalDate lerData(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return LocalDate.parse(linha);
            } catch (DateTimeParseException erro) {
                imprimirErro("Digite uma data válida no formato AAAA-MM-DD.");
            }
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

enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

record OrdemServicoEntrada(
        String certificado,
        String cliente,
        StatusOs status,
        LocalDate dataAbertura,
        int quantidadeReagendamentos
) {
}

record ResumoOs(
        String certificado,
        String cliente,
        StatusOs status,
        LocalDate dataAbertura,
        int quantidadeReagendamentos,
        long diasEmAberto,
        boolean atrasada,
        boolean precisaAtencao,
        String filaSugerida
) {
}
```

---

## Como executar

Compile:

```powershell
javac ProcessamentoOsConsole.java
```

Execute:

```powershell
java ProcessamentoOsConsole
```

Teste um caso simples:

```text
1
OS-001
Ana Silva
1
2026-07-01
0
```

Depois escolha:

```text
2
3
0
```

Você deve conseguir ver:

```text
resumo da OS;
histórico;
relatório;
encerramento.
```

---

## Entendendo o fluxo principal

O `main` ficou responsável por coordenar:

```java
if (opcao == 0) {
    executando = false;
} else if (opcao == 1) {
    ResumoOs resumo = executarFluxoProcessamento(scanner);

    if (resumo != null) {
        quantidadeHistorico = registrarNoHistorico(historico, quantidadeHistorico, resumo);
    }
} else if (opcao == 2) {
    imprimirHistorico(historico, quantidadeHistorico);
} else if (opcao == 3) {
    imprimirRelatorio(historico, quantidadeHistorico);
} else {
    imprimirErro("Opção inválida.");
}
```

Ele não calcula dias em aberto.  
Ele não decide fila diretamente.  
Ele não valida campo por campo.  
Ele não imprime o resumo manualmente.

Ele apenas direciona o fluxo.

---

## Onde estão as responsabilidades

Leitura:

```text
lerOrdemServico;
lerStatusOs;
lerTextoObrigatorio;
lerInteiro;
lerInteiroMinimo;
lerData.
```

Validação:

```text
ordemServicoValida;
textoInformado.
```

Processamento:

```text
processarOrdemServico;
calcularDiasEmAberto;
osAtrasada;
precisaAtencao;
definirFilaSugerida.
```

Histórico e relatório:

```text
registrarNoHistorico;
imprimirHistorico;
imprimirRelatorio;
contarAtrasadas;
contarComAtencao;
contarPorFila.
```

Exibição:

```text
imprimirMenu;
imprimirResumoOs;
imprimirCabecalho;
imprimirErro;
imprimirLinha;
imprimirEncerramento.
```

Records e enum:

```text
StatusOs;
OrdemServicoEntrada;
ResumoOs.
```

Essa separação prepara a cabeça para pensar em camadas no futuro.

---

## Por que usar enum para status

Poderíamos ler status como texto, mas isso abriria margem para variações:

```text
aberta;
Aberta;
ABERTO;
agendado;
REAGENDADA;
```

Com enum, limitamos os valores possíveis:

```java
enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Isso reduz erro e deixa o código mais seguro.

No backend real, status costuma vir de banco, API, enum, tabela ou domínio controlado.

---

## Por que usar records

Usamos `record` para agrupar dados relacionados.

Entrada da OS:

```java
record OrdemServicoEntrada(
        String certificado,
        String cliente,
        StatusOs status,
        LocalDate dataAbertura,
        int quantidadeReagendamentos
) {
}
```

Resumo processado:

```java
record ResumoOs(
        String certificado,
        String cliente,
        StatusOs status,
        LocalDate dataAbertura,
        int quantidadeReagendamentos,
        long diasEmAberto,
        boolean atrasada,
        boolean precisaAtencao,
        String filaSugerida
) {
}
```

Isso evita passar muitos parâmetros soltos entre métodos.

Também deixa mais claro o que é dado de entrada e o que é resultado do processamento.

---

## Pontos importantes do projeto

### Data de abertura futura

No método:

```java
public static long calcularDiasEmAberto(LocalDate dataAbertura, LocalDate dataReferencia) {
    long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);

    if (dias < 0) {
        return 0;
    }

    return dias;
}
```

Se o aluno digitar uma data futura, o sistema retorna zero dias em aberto.

Essa foi uma decisão simples para evitar resultado negativo.

### Fila sugerida

A fila é definida por prioridade:

```text
cancelada/concluída -> Sem fila;
atrasada -> Casos Críticos;
muitos reagendamentos -> Reagendamento;
demais casos -> Entrada.
```

A ordem importa.

Se uma OS está atrasada e também tem muitos reagendamentos, ela vai para:

```text
Casos Críticos
```

porque atraso tem prioridade maior no nosso exemplo.

### Histórico limitado

O histórico tem limite de 10 registros.

Isso mantém o exercício dentro do conteúdo de arrays e controle simples.

---

## Debug recomendado

Use debug para acompanhar o fluxo.

Coloque breakpoint em:

```java
ResumoOs resumo = executarFluxoProcessamento(scanner);
```

Entre nos métodos:

```text
executarFluxoProcessamento;
lerOrdemServico;
ordemServicoValida;
processarOrdemServico;
calcularDiasEmAberto;
definirFilaSugerida;
registrarNoHistorico;
imprimirRelatorio.
```

Observe:

```text
os dados digitados;
o status escolhido;
a data convertida;
os dias em aberto;
a decisão de atraso;
a decisão de atenção;
a fila sugerida;
a posição no histórico.
```

Essa aula é ótima para treinar call stack e fluxo de métodos.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Processar OS normal

Entrada sugerida:

```text
Certificado: OS-001
Cliente: Ana
Status: ABERTA
Data de abertura: data de hoje
Reagendamentos: 0
```

Resultado esperado:

```text
não atrasada;
não precisa atenção;
fila Entrada.
```

### Parte 2 — Processar OS atrasada

Use uma data de abertura com mais de 3 dias no passado.

Resultado esperado:

```text
atrasada;
precisa atenção;
fila Casos Críticos.
```

### Parte 3 — Processar OS com reagendamento

Use:

```text
reagendamentos: 2
```

Resultado esperado:

```text
precisa atenção;
fila Reagendamento, se não estiver atrasada.
```

### Parte 4 — Processar OS concluída

Use status:

```text
CONCLUIDA
```

Resultado esperado:

```text
fila Sem fila.
```

### Parte 5 — Ver histórico e relatório

Depois de processar algumas OS, use:

```text
2 - Ver histórico
3 - Ver relatório
```

Verifique se os números fazem sentido.

---

## Desafio prático

Crie uma versão chamada:

```text
ProcessamentoOsConsoleV2.java
```

Adicione uma nova regra:

```text
OS com status REAGENDADA deve ir para fila Reagendamento, mesmo que tenha menos de 2 reagendamentos.
```

Mas mantenha a prioridade:

```text
cancelada/concluída -> Sem fila;
atrasada -> Casos Críticos;
reagendada ou muitos reagendamentos -> Reagendamento;
demais casos -> Entrada.
```

Depois acrescente no relatório:

```text
quantidade de OS por status;
quantidade média de dias em aberto.
```

Sugestão de métodos:

```java
contarPorStatus(...)
calcularMediaDiasEmAberto(...)
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual regra definiu a fila da OS?
2. Qual método representa o processamento principal?
3. O que ficou mais fácil de entender depois da separação por responsabilidade?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar um fluxo console para processar OS;
usar enum para status;
usar record para entrada e resumo;
validar campos obrigatórios;
calcular dias em aberto;
identificar OS atrasada;
definir fila sugerida;
armazenar histórico em array;
gerar relatório simples;
debugar o fluxo entre métodos;
adicionar uma nova regra sem bagunçar o main;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m3/aula-103-projeto-processamento-de-os-console
git commit -m "Aula 103: cria processamento de OS console"
git status
```

Se você mantiver anotações da aula em outro arquivo, inclua também no commit.

---

## Fechamento

A principal ideia desta aula é:

```text
regra de negócio pequena também precisa de organização.
```

Mesmo em um programa console, já conseguimos separar entrada, validação, processamento, histórico, relatório e saída.

Esse raciocínio é essencial para backend.

Mais tarde, quando entrarmos em classes, services, repositories, DTOs e APIs, a base será a mesma:

```text
cada parte do código precisa ter uma responsabilidade clara.
```
