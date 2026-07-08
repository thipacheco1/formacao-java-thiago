# 101 — M3.12 — Mini arquitetura procedural

## Objetivo da aula

Nesta aula você vai aprender a organizar um programa console em uma **mini arquitetura procedural**.

Isso significa deixar o `main` como coordenador do fluxo e separar o restante em métodos por responsabilidade:

```text
ler dados;
validar dados;
calcular resultado;
montar resumo;
exibir saída.
```

A ideia não é criar arquitetura avançada ainda. A ideia é preparar seu raciocínio para escrever código mais limpo antes de entrar mais fundo em orientação a objetos.

Ao final da aula, o aluno deve conseguir olhar para um `main` grande e reorganizá-lo em funções menores, com nomes claros e responsabilidades bem separadas.

---

## O problema que vamos resolver

Nas aulas anteriores, criamos métodos separados:

```text
métodos de leitura;
métodos de validação;
métodos de cálculo;
métodos de exibição;
métodos reutilizáveis;
debug entrando em métodos;
Extract Method no IntelliJ.
```

Agora vamos juntar tudo isso.

Um programa iniciante geralmente fica assim:

```java
public static void main(String[] args) {
    // lê dados
    // valida dados
    // calcula
    // imprime
    // trata erro
    // repete lógica
}
```

Com o tempo, o `main` vira um bloco gigante.

Nesta aula, queremos chegar em algo assim:

```java
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    PedidoEntrada pedido = lerPedido(scanner);

    if (!pedidoValido(pedido)) {
        imprimirErro("Pedido inválido.");
        return;
    }

    ResumoPedido resumo = gerarResumoPedido(pedido);

    imprimirResumoPedido(resumo);
}
```

Esse `main` conta uma história:

```text
ler pedido;
validar pedido;
gerar resumo;
imprimir resumo.
```

Isso é mini arquitetura procedural.

---

## Conceito principal

Mini arquitetura procedural é uma organização simples onde cada função tem um papel claro.

Antes de criar classes ricas, serviços, controllers, repositories e camadas, o aluno precisa aprender a separar responsabilidades dentro do próprio código procedural.

Pense assim:

```text
main não deve fazer tudo;
main deve coordenar;
métodos pequenos fazem o trabalho;
cada método tem uma intenção.
```

A estrutura básica fica:

```text
main
 ├── ler dados
 ├── validar
 ├── calcular / processar
 └── exibir resultado
```

Essa estrutura é simples, mas muda completamente a leitura do código.

---

## Antes: main fazendo tudo

Crie o arquivo:

```text
PedidoMainGrande.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoMainGrande {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Cliente: ");
        String cliente = scanner.nextLine().trim();

        while (cliente.isBlank()) {
            System.out.println("Cliente obrigatório.");
            System.out.print("Cliente: ");
            cliente = scanner.nextLine().trim();
        }

        System.out.print("Produto: ");
        String produto = scanner.nextLine().trim();

        while (produto.isBlank()) {
            System.out.println("Produto obrigatório.");
            System.out.print("Produto: ");
            produto = scanner.nextLine().trim();
        }

        System.out.print("Preço unitário: ");
        BigDecimal precoUnitario = new BigDecimal(scanner.nextLine().trim().replace(",", "."));

        System.out.print("Quantidade: ");
        int quantidade = Integer.parseInt(scanner.nextLine().trim());

        if (precoUnitario.compareTo(BigDecimal.ZERO) <= 0 || quantidade <= 0) {
            System.out.println("Preço e quantidade devem ser maiores que zero.");
            return;
        }

        BigDecimal totalBruto = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

        BigDecimal desconto = BigDecimal.ZERO;

        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            desconto = totalBruto.multiply(new BigDecimal("0.10"));
        }

        BigDecimal totalFinal = totalBruto.subtract(desconto);

        System.out.println("====================================");
        System.out.println("RESUMO DO PEDIDO");
        System.out.println("====================================");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Preço unitário: " + precoUnitario);
        System.out.println("Quantidade: " + quantidade);
        System.out.println("Total bruto: " + totalBruto);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
        System.out.println("------------------------------------");
    }
}
```

Esse código funciona, mas está difícil de manter.

Problemas principais:

```text
main faz leitura;
main faz validação;
main faz cálculo;
main faz exibição;
há detalhes demais no fluxo principal;
qualquer mudança deixa o main maior.
```

O objetivo agora é reorganizar sem mudar o comportamento.

---

## Depois: main coordenando responsabilidades

Agora crie:

```text
PedidoMiniArquiteturaProcedural.java
```

Código:

```java
import java.math.BigDecimal;
import java.util.Scanner;

public class PedidoMiniArquiteturaProcedural {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        PedidoEntrada pedido = lerPedido(scanner);

        if (!pedidoValido(pedido)) {
            imprimirErro("Pedido inválido. Verifique cliente, produto, preço e quantidade.");
            return;
        }

        ResumoPedido resumo = gerarResumoPedido(pedido);

        imprimirResumoPedido(resumo);
    }

    public static PedidoEntrada lerPedido(Scanner scanner) {
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String produto = lerTextoObrigatorio(scanner, "Produto: ");
        BigDecimal precoUnitario = lerBigDecimal(scanner, "Preço unitário: ");
        int quantidade = lerInteiro(scanner, "Quantidade: ");

        return new PedidoEntrada(cliente, produto, precoUnitario, quantidade);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório.");
        }
    }

    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim().replace(",", ".");

            try {
                return new BigDecimal(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um valor monetário válido.");
            }
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String linha = scanner.nextLine().trim();

            try {
                return Integer.parseInt(linha);
            } catch (NumberFormatException erro) {
                System.out.println("Digite um número inteiro válido.");
            }
        }
    }

    public static boolean pedidoValido(PedidoEntrada pedido) {
        return pedido != null
                && textoInformado(pedido.cliente())
                && textoInformado(pedido.produto())
                && valorPositivo(pedido.precoUnitario())
                && pedido.quantidade() > 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static ResumoPedido gerarResumoPedido(PedidoEntrada pedido) {
        BigDecimal totalBruto = calcularTotalBruto(pedido.precoUnitario(), pedido.quantidade());
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        return new ResumoPedido(
                pedido.cliente(),
                pedido.produto(),
                pedido.precoUnitario(),
                pedido.quantidade(),
                totalBruto,
                desconto,
                totalFinal
        );
    }

    public static BigDecimal calcularTotalBruto(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal totalBruto) {
        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal totalBruto, BigDecimal desconto) {
        return totalBruto.subtract(desconto);
    }

    public static void imprimirResumoPedido(ResumoPedido resumo) {
        imprimirCabecalho("RESUMO DO PEDIDO");
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Produto: " + resumo.produto());
        System.out.println("Preço unitário: " + resumo.precoUnitario());
        System.out.println("Quantidade: " + resumo.quantidade());
        System.out.println("Total bruto: " + resumo.totalBruto());
        System.out.println("Desconto: " + resumo.desconto());
        System.out.println("Total final: " + resumo.totalFinal());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirSeparador() {
        System.out.println("------------------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record PedidoEntrada(
        String cliente,
        String produto,
        BigDecimal precoUnitario,
        int quantidade
) {
}

record ResumoPedido(
        String cliente,
        String produto,
        BigDecimal precoUnitario,
        int quantidade,
        BigDecimal totalBruto,
        BigDecimal desconto,
        BigDecimal totalFinal
) {
}
```

---

## O que melhorou

O comportamento continua parecido, mas a organização mudou muito.

O `main` agora mostra o fluxo principal:

```java
PedidoEntrada pedido = lerPedido(scanner);

if (!pedidoValido(pedido)) {
    imprimirErro("Pedido inválido. Verifique cliente, produto, preço e quantidade.");
    return;
}

ResumoPedido resumo = gerarResumoPedido(pedido);

imprimirResumoPedido(resumo);
```

Isso é mais fácil de ler porque cada linha representa uma etapa do processo.

A leitura foi para métodos de leitura:

```text
lerPedido;
lerTextoObrigatorio;
lerBigDecimal;
lerInteiro.
```

A validação foi para métodos de validação:

```text
pedidoValido;
textoInformado;
valorPositivo.
```

O cálculo foi para métodos de cálculo:

```text
gerarResumoPedido;
calcularTotalBruto;
calcularDesconto;
calcularTotalFinal.
```

A exibição foi para métodos de exibição:

```text
imprimirResumoPedido;
imprimirCabecalho;
imprimirSeparador;
imprimirErro.
```

Esse é o ponto da aula.

---

## Como pensar em responsabilidades

Sempre que olhar para um código grande, pergunte:

```text
isso está lendo entrada?
isso está validando regra?
isso está calculando?
isso está montando um resultado?
isso está exibindo algo?
isso está coordenando fluxo?
```

Cada resposta pode virar um método.

Exemplo:

```java
public static PedidoEntrada lerPedido(Scanner scanner)
```

Responsabilidade:

```text
ler os dados necessários para montar um pedido de entrada.
```

Exemplo:

```java
public static boolean pedidoValido(PedidoEntrada pedido)
```

Responsabilidade:

```text
responder se o pedido possui dados mínimos válidos.
```

Exemplo:

```java
public static ResumoPedido gerarResumoPedido(PedidoEntrada pedido)
```

Responsabilidade:

```text
calcular e montar o resumo do pedido.
```

Exemplo:

```java
public static void imprimirResumoPedido(ResumoPedido resumo)
```

Responsabilidade:

```text
exibir o resumo no console.
```

---

## O papel do main

Nesta arquitetura, o `main` não desaparece.

Ele continua sendo importante.

Mas o papel dele é coordenar.

Um bom `main` procedural deve parecer um roteiro:

```text
1. preparar recurso;
2. ler entrada;
3. validar;
4. processar;
5. exibir saída;
6. encerrar.
```

Ele não deve conter todos os detalhes internos de cada etapa.

Pense no `main` como um índice da história.

Se o aluno conseguir entender o fluxo olhando só para o `main`, a organização está no caminho certo.

---

## Ordem sugerida dos métodos

Para programas console simples, uma ordem prática é:

```text
main;
métodos de fluxo principal;
métodos de leitura;
métodos de validação;
métodos de cálculo/processamento;
métodos de exibição;
records e enums.
```

Não é uma lei, mas ajuda o aluno a navegar.

No nosso exemplo, essa ordem foi usada:

```text
main
lerPedido
lerTextoObrigatorio
lerBigDecimal
lerInteiro
pedidoValido
textoInformado
valorPositivo
gerarResumoPedido
calcularTotalBruto
calcularDesconto
calcularTotalFinal
imprimirResumoPedido
imprimirCabecalho
imprimirSeparador
imprimirErro
records
```

Mais tarde, em orientação a objetos, isso será reorganizado em classes.

Agora, a intenção é treinar o olhar.

---

## Atenção: procedural não é bagunça

Às vezes o aluno associa código procedural a código ruim.

Não é isso.

Código procedural pode ser organizado.

O problema não é ser procedural.

O problema é:

```text
main gigante;
método fazendo tudo;
repetição sem controle;
nomes ruins;
responsabilidades misturadas;
fluxo difícil de entender.
```

Uma mini arquitetura procedural bem feita já ensina fundamentos que serão úteis depois em arquitetura de backend:

```text
separação de responsabilidades;
nome de operação;
fluxo principal claro;
validação isolada;
processamento isolado;
saída isolada.
```

---

## Limites dessa abordagem

Essa organização ainda não é arquitetura final.

Ela tem limites:

```text
todos os métodos ainda estão na mesma classe;
não há camada de domínio;
não há service;
não há repository;
não há controller;
não há testes automatizados;
não há injeção de dependência;
não há persistência.
```

Isso é esperado.

A aula está no momento certo do curso.

Antes de separar em classes, o aluno precisa entender como separar responsabilidades.

---

## Erros comuns

### 1. Criar método com nome genérico

Evite:

```java
processar()
executar()
fazer()
validar()
```

Prefira nomes que expliquem a etapa:

```java
lerPedido()
pedidoValido()
gerarResumoPedido()
imprimirResumoPedido()
```

### 2. Método fazendo mais de uma coisa

Exemplo ruim:

```java
lerCalcularEImprimirPedido(scanner)
```

Esse nome já mostra mistura de responsabilidades.

### 3. Main ainda grande demais

Se o `main` continua com muitos detalhes, a extração não foi suficiente.

### 4. Extrair método sem intenção

Não extraia só para diminuir linhas. Extraia para dar nome a uma responsabilidade.

### 5. Parâmetros demais

Se um método começa a receber muitos dados soltos, pense em `record`.

### 6. Esconder código ruim em método

Criar método não resolve tudo. Um método ruim continua ruim, só ficou escondido.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar o código grande

Crie e execute:

```text
PedidoMainGrande.java
```

Com entradas válidas, por exemplo:

```text
Cliente: Ana
Produto: Cadeira
Preço unitário: 199,90
Quantidade: 2
```

Observe o resultado.

### Parte 2 — Criar a versão organizada

Crie e execute:

```text
PedidoMiniArquiteturaProcedural.java
```

Use as mesmas entradas.

Compare a saída.

O comportamento deve permanecer equivalente.

### Parte 3 — Debug do fluxo

Coloque breakpoint no `main`.

Entre com `Step Into` em:

```text
lerPedido;
pedidoValido;
gerarResumoPedido;
imprimirResumoPedido.
```

Observe que cada método tem um papel.

### Parte 4 — Revisão com Git Diff

Depois de criar a versão organizada, rode:

```bash
git diff
```

ou veja o diff pelo IntelliJ.

A pergunta é:

```text
a alteração melhorou a leitura sem mudar a regra principal?
```

---

## Desafio prático

Agora crie um segundo programa, inspirado no contexto de OS.

Arquivo sugerido:

```text
OsMiniArquiteturaProcedural.java
```

O fluxo deve ser:

```text
ler OS;
validar OS;
calcular dias em aberto;
montar resumo;
imprimir resumo.
```

Sugestão de records:

```java
record OrdemServicoEntrada(
        String certificado,
        String status,
        String dataAbertura
) {
}
```

ou, se quiser usar `LocalDate`:

```java
record OrdemServicoEntrada(
        String certificado,
        String status,
        LocalDate dataAbertura
) {
}
```

Sugestão de métodos:

```java
lerOrdemServico(scanner)
ordemServicoValida(os)
calcularDiasEmAberto(dataAbertura)
gerarResumoOs(os)
imprimirResumoOs(resumo)
```

A regra pode ser simples:

```text
certificado obrigatório;
status obrigatório;
data obrigatória;
dias em aberto calculado com base na data atual.
```

Não precisa complicar.

O objetivo é organizar o fluxo.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual era o problema do main grande?
2. Qual responsabilidade ficou mais clara depois da refatoração?
3. Qual método você achou mais importante nesta aula?
```

Esse registro é curto. A intenção é consolidar o aprendizado sem virar burocracia.

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o que é mini arquitetura procedural;
deixar o main como coordenador do fluxo;
separar leitura, validação, cálculo e exibição;
usar records simples para agrupar entrada e resumo;
criar nomes claros para métodos;
rodar e comparar antes/depois;
usar debug para acompanhar o fluxo entre métodos;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m3/aula-101-mini-arquitetura-procedural docs/diario-de-bordo.md
git commit -m "Aula 101: organiza mini arquitetura procedural"
git status
```

Se não estiver usando `docs/diario-de-bordo.md`, faça o commit apenas com a pasta da aula.

---

## Fechamento

A principal ideia desta aula é simples:

```text
antes de aprender arquitetura em camadas, aprenda a organizar o fluxo dentro de um programa pequeno.
```

Quando o `main` coordena e os métodos fazem trabalhos bem definidos, o código fica mais fácil de ler, testar, debugar e evoluir.

Essa base vai ser usada nas próximas aulas de projeto console e, mais tarde, na transição para orientação a objetos e backend real.
