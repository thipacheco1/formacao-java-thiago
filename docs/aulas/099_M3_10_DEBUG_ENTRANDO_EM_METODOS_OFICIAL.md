# 099 — M3.10 — Debug entrando em métodos

## Revisão do cronograma antes de gerar

O cronograma oficial auditável foi revisado antes desta geração.

A sequência correta neste ponto é:

```text
097 — M3.08 — Métodos de leitura
098 — M3.09 — Reuso sem duplicação
099 — M3.10 — Debug entrando em métodos
100 — M3.11 — Refatoração Extract Method no IntelliJ
101 — M3.12 — Mini arquitetura procedural
```

Portanto, o próximo documento oficial após a aula `098_M3_09_REUSO_SEM_DUPLICACAO_OFICIAL.md` é:

```text
099_M3_10_DEBUG_ENTRANDO_EM_METODOS_OFICIAL.md
```

---

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M3.10.01` — Debug entrando em métodos — Conceito profundo e quando usar.
- `M3.10.02` — Debug entrando em métodos — Implementação guiada com código realista.
- `M3.10.03` — Debug entrando em métodos — Refatoração, melhoria e leitura crítica.
- `M3.10.04` — Debug entrando em métodos — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `step into`, `step out`, `step over`, `call stack`, fluxo de chamada, passagem de parâmetros, retorno de métodos, investigação de bugs, leitura crítica, armadilhas comuns, depuração de validação, cálculo, leitura, exibição e reuso.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado;
debug básico funcionando.
```

Antes de começar:

```powershell
java -version
javac -version
git --version
```

No IntelliJ:

```text
projeto abre pela raiz;
Project SDK configurado;
botão de Run funciona;
botão de Debug funciona;
breakpoint funciona;
janela Debug aparece;
aba Variables aparece;
aba Frames ou Call Stack aparece.
```

A prática desta aula será feita em:

```text
labs/m3/aula-099-debug-entrando-em-metodos
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

Nas aulas anteriores, criamos métodos para:

```text
validar;
calcular;
exibir;
ler;
reutilizar código.
```

Agora surge uma necessidade natural:

```text
como investigar o fluxo quando um método chama outro método?
```

Quando o programa estava todo no `main`, o debug era linear.

Agora temos chamadas como:

```java
PedidoEntrada pedido = lerPedido(scanner);
BigDecimal total = calcularTotalPedido(pedido);
imprimirResumoPedido(pedido, total);
```

Cada linha pode chamar vários métodos.

Para entender bugs, precisamos entrar nos métodos, sair deles e acompanhar a pilha de chamadas.

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
099 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 99
Aulas oficiais restantes: 439
```

Contando o arquivo de abertura `000`, teremos:

```text
100 arquivos gerados no total.
```

---

## A pergunta central da aula

Quando você está parado nesta linha:

```java
BigDecimal total = calcularTotalPedido(pedido);
```

Como descobrir:

```text
qual pedido foi enviado para o método;
qual preço chegou;
qual quantidade chegou;
qual cálculo foi feito;
qual valor retornou;
em qual método estou agora;
quem chamou esse método;
como voltar para o método anterior?
```

A resposta envolve:

```text
breakpoint;
step over;
step into;
step out;
call stack;
variables;
evaluate expression;
retorno do método.
```

---

## O que é debug entrando em métodos

Debug entrando em métodos é a prática de pausar o programa e navegar pelas chamadas.

Em vez de apenas executar:

```java
calcularTotalPedido(pedido)
```

você entra no método para ver:

```text
parâmetro recebido;
linha executada;
variáveis locais;
retorno produzido.
```

Isso é essencial quando:

```text
o resultado está errado;
a validação falhou sem motivo claro;
um valor chegou null;
uma regra foi aplicada de forma inesperada;
um método não foi chamado;
o fluxo parou antes do esperado;
um retorno boolean veio false;
um cálculo trouxe valor diferente.
```

---

## Vocabulário essencial

### Breakpoint

Ponto onde o programa pausa.

No IntelliJ, normalmente você clica na margem esquerda da linha.

### Step Over

Executa a linha atual sem entrar dentro do método chamado.

Use quando você confia no método ou não quer ver detalhes internos.

### Step Into

Entra dentro do método chamado na linha atual.

Use quando quer investigar o que acontece dentro do método.

### Step Out

Sai do método atual e volta para quem chamou.

Use quando já viu o suficiente dentro do método.

### Call Stack

Pilha de chamadas.

Mostra o caminho de métodos até o ponto atual.

Exemplo:

```text
calcularTotalPedido
processarPedido
main
```

Isso significa:

```text
main chamou processarPedido;
processarPedido chamou calcularTotalPedido;
o debug está dentro de calcularTotalPedido.
```

### Variables

Área onde você vê variáveis disponíveis no ponto atual.

### Evaluate Expression

Ferramenta para testar uma expressão durante o debug.

Exemplo:

```java
pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()))
```

---

## Step Over versus Step Into

Imagine esta linha:

```java
BigDecimal total = calcularTotalPedido(pedido);
```

Se usar `Step Over`:

```text
o IntelliJ executa calcularTotalPedido inteiro;
volta para a próxima linha;
você vê o total depois.
```

Se usar `Step Into`:

```text
o IntelliJ entra dentro de calcularTotalPedido;
você acompanha cada linha interna;
vê parâmetros e retorno.
```

Regra prática:

```text
Step Over quando o método já é confiável;
Step Into quando o método é suspeito.
```

---

## Step Out

Quando você entrou em um método e já entendeu o que precisava, use `Step Out`.

Exemplo:

```java
public static BigDecimal calcularTotalPedido(PedidoEntrada pedido) {
    return pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()));
}
```

Se entrou nesse método e já viu que os dados estão corretos, `Step Out` executa até o retorno e volta para quem chamou.

Isso evita ficar avançando linha por linha sem necessidade.

---

## Call Stack

A call stack mostra a sequência de chamadas.

Exemplo:

```java
public static void main(String[] args) {
    processarPedido();
}

public static void processarPedido() {
    BigDecimal total = calcularTotalPedido(new BigDecimal("10.00"), 3);
}

public static BigDecimal calcularTotalPedido(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}
```

Se o debug está dentro de `calcularTotalPedido`, a pilha é:

```text
calcularTotalPedido
processarPedido
main
```

Leia de baixo para cima para entender o caminho:

```text
main começou;
main chamou processarPedido;
processarPedido chamou calcularTotalPedido.
```

Leia de cima para baixo para entender onde você está agora:

```text
estou em calcularTotalPedido;
ele foi chamado por processarPedido;
que foi chamado por main.
```

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
DebugMetodoBasico.java
```

Código:

```java
import java.math.BigDecimal;

public class DebugMetodoBasico {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("10.00");
        int quantidade = 3;

        BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);

        System.out.println("Total: " + total);
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        BigDecimal total = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

        return total;
    }
}
```

### Como debugar

Coloque breakpoint nesta linha:

```java
BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);
```

Inicie com Debug.

Faça:

```text
1. Observe precoUnitario e quantidade.
2. Use Step Into para entrar em calcularTotalPedido.
3. Observe os parâmetros dentro do método.
4. Use Step Over na linha do cálculo.
5. Observe a variável total.
6. Use Step Out para voltar ao main.
7. Observe total no main.
```

---

## Exemplo com validação boolean

Arquivo:

```text
DebugValidacaoBoolean.java
```

Código:

```java
import java.math.BigDecimal;

public class DebugValidacaoBoolean {
    public static void main(String[] args) {
        PedidoEntrada pedido = new PedidoEntrada("Ana", new BigDecimal("100.00"), 2, false);

        if (!podeProcessarPedido(pedido)) {
            System.out.println("Pedido inválido.");
            return;
        }

        System.out.println("Pedido pode ser processado.");
    }

    public static boolean podeProcessarPedido(PedidoEntrada pedido) {
        return pedido != null
                && textoInformado(pedido.cliente())
                && valorPositivo(pedido.valor())
                && pedido.quantidade() > 0
                && !pedido.bloqueado();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }
}

record PedidoEntrada(String cliente, BigDecimal valor, int quantidade, boolean bloqueado) {
}
```

### Como debugar

Coloque breakpoint aqui:

```java
if (!podeProcessarPedido(pedido)) {
```

Use `Step Into`.

Entre em:

```text
podeProcessarPedido;
textoInformado;
valorPositivo.
```

Observe:

```text
pedido;
cliente;
valor;
quantidade;
bloqueado;
retorno boolean.
```

---

## Cuidado com curto-circuito no debug

No método:

```java
return pedido != null
        && textoInformado(pedido.cliente())
        && valorPositivo(pedido.valor())
        && pedido.quantidade() > 0
        && !pedido.bloqueado();
```

Java usa curto-circuito.

Se `pedido != null` for `false`, nada depois executa.

Isso significa que o debug talvez não entre em:

```text
textoInformado;
valorPositivo.
```

Isso não é bug.

É a regra do `&&`.

Para investigar melhor, você pode quebrar em variáveis:

```java
boolean pedidoExiste = pedido != null;
boolean clienteInformado = pedidoExiste && textoInformado(pedido.cliente());
boolean valorValido = pedidoExiste && valorPositivo(pedido.valor());
boolean quantidadeValida = pedidoExiste && pedido.quantidade() > 0;
boolean naoBloqueado = pedidoExiste && !pedido.bloqueado();

return pedidoExiste && clienteInformado && valorValido && quantidadeValida && naoBloqueado;
```

Essa versão é mais longa, mas facilita debug.

---

## Exemplo refatorado para debug

Arquivo:

```text
DebugValidacaoComVariaveis.java
```

Código:

```java
import java.math.BigDecimal;

public class DebugValidacaoComVariaveis {
    public static void main(String[] args) {
        PedidoEntrada pedido = new PedidoEntrada("Ana", new BigDecimal("100.00"), 2, false);

        if (!podeProcessarPedido(pedido)) {
            System.out.println("Pedido inválido.");
            return;
        }

        System.out.println("Pedido pode ser processado.");
    }

    public static boolean podeProcessarPedido(PedidoEntrada pedido) {
        boolean pedidoExiste = pedido != null;
        boolean clienteInformado = pedidoExiste && textoInformado(pedido.cliente());
        boolean valorValido = pedidoExiste && valorPositivo(pedido.valor());
        boolean quantidadeValida = pedidoExiste && pedido.quantidade() > 0;
        boolean naoBloqueado = pedidoExiste && !pedido.bloqueado();

        return pedidoExiste
                && clienteInformado
                && valorValido
                && quantidadeValida
                && naoBloqueado;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }
}

record PedidoEntrada(String cliente, BigDecimal valor, int quantidade, boolean bloqueado) {
}
```

Agora, no debug, você consegue ver:

```text
pedidoExiste;
clienteInformado;
valorValido;
quantidadeValida;
naoBloqueado.
```

Isso acelera diagnóstico.

---

## Exemplo com cálculo errado

Arquivo:

```text
DebugCalculoComBug.java
```

Código:

```java
import java.math.BigDecimal;

public class DebugCalculoComBug {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("100.00");
        int quantidade = 3;

        BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);
        BigDecimal desconto = calcularDesconto(total);
        BigDecimal totalFinal = calcularTotalFinal(total, desconto);

        System.out.println("Total: " + total);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal total) {
        if (total.compareTo(new BigDecimal("300.00")) >= 0) {
            return total.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal total, BigDecimal desconto) {
        return total.add(desconto);
    }
}
```

O bug está aqui:

```java
return total.add(desconto);
```

O correto seria:

```java
return total.subtract(desconto);
```

### Como encontrar com debug

Coloque breakpoint no `main` na linha:

```java
BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);
```

Faça:

```text
1. Step Over em calcularTotalPedido.
2. Veja total = 300.00.
3. Step Over em calcularDesconto.
4. Veja desconto = 30.0000.
5. Step Into em calcularTotalFinal.
6. Observe total e desconto.
7. Veja que o método soma em vez de subtrair.
```

Esse é o tipo de bug que o debug revela rapidamente.

---

## Exemplo com leitura

Arquivo:

```text
DebugLeitura.java
```

Código:

```java
import java.util.Scanner;

public class DebugLeitura {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int idade = lerInteiroEntre(scanner, "Idade: ", 0, 130);

        System.out.println("Idade: " + idade);
    }

    public static int lerInteiroEntre(Scanner scanner, String prompt, int minimo, int maximo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);

            if (valor >= minimo && valor <= maximo) {
                return valor;
            }

            System.out.println("Digite um valor entre " + minimo + " e " + maximo + ".");
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
}
```

### Como debugar

Coloque breakpoint em:

```java
int idade = lerInteiroEntre(scanner, "Idade: ", 0, 130);
```

Use `Step Into`.

Observe:

```text
entrada no lerInteiroEntre;
entrada no lerInteiro;
linha digitada;
parse;
retorno para lerInteiroEntre;
validação de mínimo e máximo;
retorno para main.
```

Digite primeiro:

```text
abc
```

Depois:

```text
200
```

Depois:

```text
30
```

Veja o loop funcionando.

---

## Exemplo com exibição

Arquivo:

```text
DebugExibicao.java
```

Código:

```java
public class DebugExibicao {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com");

        imprimirCliente(cliente);
    }

    public static void imprimirCliente(Cliente cliente) {
        imprimirCabecalho("CLIENTE");
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("------------------------");
    }
}

record Cliente(String nome, String email) {
}
```

### Como debugar

Coloque breakpoint em:

```java
imprimirCliente(cliente);
```

Use `Step Into`.

Veja:

```text
cliente recebido;
entrada em imprimirCabecalho;
volta para imprimirCliente;
impressão dos dados;
entrada em imprimirSeparador.
```

Métodos `void` também entram no debug.

Eles não retornam valor, mas executam ação.

---

## Exemplo com reuso

Arquivo:

```text
DebugReuso.java
```

Código:

```java
import java.math.BigDecimal;

public class DebugReuso {
    public static void main(String[] args) {
        Produto produto = new Produto("Cadeira", new BigDecimal("199.90"), 10);

        if (!produtoValido(produto)) {
            imprimirErro("Produto inválido.");
            return;
        }

        BigDecimal valorEstoque = calcularValorEstoque(produto);

        imprimirProduto(produto, valorEstoque);
    }

    public static boolean produtoValido(Produto produto) {
        return produto != null
                && textoInformado(produto.nome())
                && valorPositivo(produto.preco())
                && produto.estoque() >= 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static BigDecimal calcularValorEstoque(Produto produto) {
        return produto.preco().multiply(BigDecimal.valueOf(produto.estoque()));
    }

    public static void imprimirProduto(Produto produto, BigDecimal valorEstoque) {
        System.out.println("Produto: " + produto.nome());
        System.out.println("Valor em estoque: " + valorEstoque);
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record Produto(String nome, BigDecimal preco, int estoque) {
}
```

### Como debugar

Coloque breakpoint no começo do `main`.

Use:

```text
Step Into em produtoValido;
Step Into em textoInformado;
Step Into em valorPositivo;
Step Out para voltar;
Step Over para cálculo se já entendeu;
Step Into em imprimirProduto.
```

Esse exemplo combina validação, cálculo e exibição.

---

## Call stack na prática

Use o arquivo:

```text
DebugCallStack.java
```

Código:

```java
public class DebugCallStack {
    public static void main(String[] args) {
        iniciarFluxo();
    }

    public static void iniciarFluxo() {
        processarPedido();
    }

    public static void processarPedido() {
        validarPedido();
    }

    public static void validarPedido() {
        validarCliente();
    }

    public static void validarCliente() {
        System.out.println("Validando cliente...");
    }
}
```

Coloque breakpoint em:

```java
System.out.println("Validando cliente...");
```

Inicie o debug.

Na call stack, você deverá ver algo como:

```text
validarCliente
validarPedido
processarPedido
iniciarFluxo
main
```

Esse recurso é fundamental.

Ele responde:

```text
como cheguei até aqui?
```

---

## Evaluate Expression

Durante o debug, você pode avaliar expressões.

Exemplo no arquivo `DebugCalculoComBug.java`, quando estiver com:

```text
total = 300.00
desconto = 30.0000
```

Você pode avaliar:

```java
total.subtract(desconto)
```

e comparar com:

```java
total.add(desconto)
```

Isso ajuda a testar hipóteses sem alterar o código imediatamente.

Use com cuidado.

Não substitui correção no código.

---

## Watches

Em alguns cenários, você pode adicionar uma expressão como Watch.

Exemplo:

```java
pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()))
```

ou:

```java
valor.compareTo(BigDecimal.ZERO) > 0
```

Watch ajuda a acompanhar expressões importantes enquanto avança.

Mas não exagere.

Muitos watches podem poluir a tela.

---

## Debug e retorno de método

Quando um método retorna valor, observe:

```text
valor antes do return;
valor mostrado após Step Out;
variável que recebe o retorno no chamador.
```

Exemplo:

```java
BigDecimal total = calcularTotalPedido(preco, quantidade);
```

Dentro do método:

```java
return preco.multiply(BigDecimal.valueOf(quantidade));
```

Ao sair, observe:

```text
total no main.
```

Esse movimento fecha o entendimento:

```text
entrada -> processamento -> retorno -> uso.
```

---

## Debug e exceptions

Quando uma exception acontece, o debug ajuda a descobrir onde.

Exemplo:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Se `precoUnitario` for `null`, ocorre:

```text
NullPointerException
```

No debug, veja:

```text
qual método recebeu null;
quem chamou esse método;
qual valor foi passado;
em qual ponto quebrou.
```

A call stack mostra o caminho.

---

## Exemplo com exception

Arquivo:

```text
DebugException.java
```

Código:

```java
import java.math.BigDecimal;

public class DebugException {
    public static void main(String[] args) {
        BigDecimal precoUnitario = null;
        int quantidade = 2;

        BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);

        System.out.println("Total: " + total);
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}
```

Execute em debug.

Observe:

```text
precoUnitario = null;
linha que quebra;
call stack;
mensagem da exception.
```

Depois corrija:

```java
if (precoUnitario == null) {
    throw new IllegalArgumentException("Preço unitário é obrigatório.");
}
```

---

## Refatoração para facilitar debug

Às vezes, uma linha muito grande dificulta debug.

Ruim:

```java
return pedido != null && pedido.cliente() != null && !pedido.cliente().isBlank() && pedido.valor().compareTo(BigDecimal.ZERO) > 0;
```

Melhor para debug:

```java
boolean pedidoExiste = pedido != null;
boolean clienteInformado = pedidoExiste && pedido.cliente() != null && !pedido.cliente().isBlank();
boolean valorPositivo = pedidoExiste && pedido.valor() != null && pedido.valor().compareTo(BigDecimal.ZERO) > 0;

return pedidoExiste && clienteInformado && valorPositivo;
```

Não precisa fazer isso em toda regra simples.

Mas quando está investigando bug, variáveis intermediárias ajudam muito.

---

## Estratégia de investigação

Quando algo estiver errado:

```text
1. Reproduza o erro.
2. Coloque breakpoint antes do erro.
3. Use Step Over para avançar fluxo geral.
4. Use Step Into quando o método for suspeito.
5. Observe variáveis.
6. Observe retornos.
7. Veja call stack.
8. Use Step Out quando já entendeu o método.
9. Corrija a menor parte possível.
10. Rode novamente.
```

Debug não é clicar aleatoriamente.

Debug é investigação controlada.

---

## Erros comuns

### Erro 1 — Usar Step Into em tudo

Isso deixa o debug lento.

Entre apenas no que é relevante.

### Erro 2 — Nunca usar Step Into

Você nunca entende o que ocorre dentro dos métodos.

### Erro 3 — Ignorar call stack

A call stack mostra como você chegou no bug.

### Erro 4 — Não observar variáveis

Debug sem olhar variáveis vira apenas execução lenta.

### Erro 5 — Não observar retorno

Método pode receber certo e retornar errado.

### Erro 6 — Confundir Step Over com Step Into

Step Over executa o método sem entrar.

Step Into entra.

### Erro 7 — Esquecer curto-circuito

Com `&&`, métodos posteriores podem nem ser chamados.

### Erro 8 — Debugar sem hipótese

Antes de depurar, tenha uma pergunta.

Exemplo:

```text
o desconto está errado?
a quantidade chegou errada?
o método nem foi chamado?
o retorno boolean está false por qual parte?
```

### Erro 9 — Corrigir sem reproduzir

Primeiro veja o erro.

Depois corrija.

### Erro 10 — Alterar muita coisa antes de testar

Corrija pequeno e teste.

---

## Diagnóstico

Ao debugar método, pergunte:

```text
1. Onde o fluxo deveria passar?
2. Onde ele realmente passou?
3. Quais parâmetros chegaram?
4. As variáveis locais estão corretas?
5. Qual método chamou este método?
6. O retorno está correto?
7. Houve curto-circuito?
8. A exception veio de qual linha?
9. O método faz coisa demais?
10. Variáveis intermediárias ajudariam?
```

---

## Debug recomendado para a aula

Faça debug nos arquivos nesta ordem:

```text
1. DebugMetodoBasico.java
2. DebugValidacaoBoolean.java
3. DebugValidacaoComVariaveis.java
4. DebugCalculoComBug.java
5. DebugLeitura.java
6. DebugExibicao.java
7. DebugReuso.java
8. DebugCallStack.java
9. DebugException.java
```

Para cada arquivo, registre no diário:

```text
qual breakpoint usei;
quando usei Step Into;
quando usei Step Over;
quando usei Step Out;
o que apareceu na call stack;
qual bug ou fluxo entendi.
```

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — total final errado

No `DebugCalculoComBug`, mantenha `add` em vez de `subtract`.

Use debug para encontrar.

### Teste 2 — pedido null

No `DebugValidacaoBoolean`, passe:

```java
PedidoEntrada pedido = null;
```

Veja curto-circuito.

### Teste 3 — cliente blank

Use:

```java
PedidoEntrada pedido = new PedidoEntrada("   ", new BigDecimal("100.00"), 2, false);
```

Veja onde retorna false.

### Teste 4 — quantidade negativa

Use:

```java
quantidade = -1;
```

Veja variável `quantidadeValida`.

### Teste 5 — exception por null

No `DebugException`, passe `precoUnitario = null`.

Veja call stack.

### Teste 6 — leitura inválida

No `DebugLeitura`, digite `abc`, depois `200`, depois `30`.

Acompanhe os loops.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-099-debug-entrando-em-metodos
cd labs\m3\aula-099-debug-entrando-em-metodos
```

Crie arquivos:

```text
DebugMetodoBasico.java
DebugValidacaoBoolean.java
DebugValidacaoComVariaveis.java
DebugCalculoComBug.java
DebugLeitura.java
DebugExibicao.java
DebugReuso.java
DebugCallStack.java
DebugException.java
ErroStepIntoEmTudo.java
ErroSemCallStack.java
ErroCurtoCircuitoNaoEntendido.java
ErroRetornoNaoObservado.java
ErroCorrigirSemReproduzir.java
README.md
```

Compile exemplos principais:

```powershell
javac DebugMetodoBasico.java
javac DebugValidacaoBoolean.java
javac DebugValidacaoComVariaveis.java
javac DebugCalculoComBug.java
javac DebugLeitura.java
javac DebugExibicao.java
javac DebugReuso.java
javac DebugCallStack.java
javac DebugException.java
```

Execute alguns normalmente:

```powershell
java DebugMetodoBasico
java DebugValidacaoBoolean
java DebugValidacaoComVariaveis
java DebugCalculoComBug
java DebugExibicao
java DebugReuso
java DebugCallStack
```

Execute em debug no IntelliJ:

```text
DebugMetodoBasico;
DebugCalculoComBug;
DebugLeitura;
DebugCallStack;
DebugException.
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 099 — Debug entrando em métodos

## Objetivo

Aprender a usar debug para entrar em métodos, sair deles, observar variáveis, retornos e call stack.

## Conceitos

- Breakpoint pausa o programa.
- Step Over executa a linha sem entrar no método.
- Step Into entra no método.
- Step Out sai do método atual.
- Call Stack mostra o caminho de chamadas.
- Variables mostra valores disponíveis.
- Evaluate Expression ajuda a testar hipóteses.
- Curto-circuito pode impedir chamadas.
- Variáveis intermediárias ajudam debug.
- Debug deve responder uma pergunta.

## Comandos

```powershell
javac DebugMetodoBasico.java
java DebugMetodoBasico
javac DebugCalculoComBug.java
java DebugCalculoComBug
```

## Exercício

Executar em debug:

- `DebugMetodoBasico`
- `DebugValidacaoBoolean`
- `DebugCalculoComBug`
- `DebugLeitura`
- `DebugCallStack`
- `DebugException`
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Debug | `Shift + F9` em muitos keymaps | Iniciar depuração |
| Breakpoint | clique na margem | Pausar linha |
| Step Over | `F8` em muitos keymaps | Executar sem entrar |
| Step Into | `F7` em muitos keymaps | Entrar no método |
| Step Out | `Shift + F8` em muitos keymaps | Sair do método |
| Resume | `F9` em muitos keymaps | Continuar até próximo breakpoint |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar expressão |
| Variables | janela Debug | Ver valores |
| Frames/Call Stack | janela Debug | Ver pilha de chamadas |
| Stop | botão vermelho | Parar debug |
| Rerun Debug | ação da IDE | Rodar debug de novo |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 099 — Debug entrando em métodos

### O que aprendi

Aprendi a usar Step Into, Step Over, Step Out e Call Stack para entender o fluxo quando métodos chamam outros métodos.

### O que pratiquei

Depurei métodos de cálculo, validação, leitura, exibição, reuso, call stack e exception. Acompanhei parâmetros, variáveis locais, retornos e bugs intencionais.

### Conceitos principais

- breakpoint
- debug
- step over
- step into
- step out
- call stack
- variables
- frames
- evaluate expression
- watch
- retorno de método
- parâmetros
- curto-circuito
- exception
- hipótese de debug
- investigação controlada

### Arquivos criados

- `labs/m3/aula-099-debug-entrando-em-metodos/DebugMetodoBasico.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugValidacaoBoolean.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugValidacaoComVariaveis.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugCalculoComBug.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugLeitura.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugExibicao.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugReuso.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugCallStack.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/DebugException.java`
- `labs/m3/aula-099-debug-entrando-em-metodos/README.md`

### Comandos usados

```powershell
javac DebugMetodoBasico.java
java DebugMetodoBasico
javac DebugCalculoComBug.java
java DebugCalculoComBug
javac DebugCallStack.java
java DebugCallStack
```

### O que observei no debug

- parâmetros chegando nos métodos;
- retornos sendo produzidos;
- call stack mostrando o caminho;
- bug de soma em vez de subtração;
- curto-circuito em validação;
- exception por valor null;
- loop de leitura inválida.

### Erros que quero evitar

- usar Step Into em tudo;
- nunca entrar nos métodos;
- ignorar call stack;
- não olhar variáveis;
- não observar retorno;
- confundir Step Over com Step Into;
- esquecer curto-circuito;
- depurar sem hipótese;
- corrigir sem reproduzir;
- alterar muita coisa antes de testar.
```

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m3/aula-099-debug-entrando-em-metodos docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 099: pratica debug entrando em metodos"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é breakpoint?
2. Para que serve Step Over?
3. Para que serve Step Into?
4. Para que serve Step Out?
5. O que é Call Stack?
6. Como ler a call stack?
7. O que aparece em Variables?
8. Para que serve Evaluate Expression?
9. Quando usar Step Into?
10. Quando usar Step Over?
11. Quando usar Step Out?
12. Como observar retorno de método?
13. Como debug ajuda em cálculo?
14. Como debug ajuda em validação boolean?
15. Como curto-circuito afeta o debug?
16. Como debug ajuda em leitura com Scanner?
17. Como encontrar bug de soma em vez de subtração?
18. Como call stack ajuda em exception?
19. Por que debug precisa de hipótese?
20. Qual bug você encontrou nesta aula e como encontrou?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
criar breakpoint;
iniciar debug;
usar Step Over;
usar Step Into;
usar Step Out;
ler Variables;
ler Call Stack;
explicar fluxo de chamada;
entrar em método de cálculo;
entrar em método de validação;
entrar em método de leitura;
entrar em método de exibição;
identificar retorno errado;
identificar parâmetro errado;
identificar curto-circuito;
identificar exception com call stack;
usar Evaluate Expression;
corrigir bug pequeno;
executar novamente após correção;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar debugging remoto.

Não precisa ainda debugar aplicação web.

Não precisa ainda debugar threads.

Não precisa ainda debugar banco de dados.

Não precisa ainda usar logs estruturados.

Não precisa ainda usar breakpoints condicionais avançados.

Esses assuntos virão depois.

O objetivo é:

```text
entender o fluxo real quando métodos chamam outros métodos.
```

---

## Fechamento

Hoje estudamos debug entrando em métodos.

A ideia central foi:

```text
quando o código passa a ter métodos, o debug precisa acompanhar chamadas, parâmetros, retornos e call stack.
```

Vimos que:

```text
Step Into entra no método;
Step Over executa sem entrar;
Step Out sai do método atual;
Call Stack mostra como chegamos ali;
Variables mostra estado atual;
Evaluate Expression ajuda a testar hipóteses;
curto-circuito pode impedir chamadas;
variáveis intermediárias ajudam investigação;
debug deve ser guiado por pergunta.
```

O ponto mais importante é:

```text
debug profissional não é apertar botão aleatório; é investigar uma hipótese com controle.
```

Na próxima aula, vamos estudar:

```text
Refatoração Extract Method no IntelliJ.
```

A próxima aula vai aprofundar seleção correta, nome, parâmetros gerados, revisão da assinatura e uso profissional da IDE para extrair métodos sem quebrar comportamento.
