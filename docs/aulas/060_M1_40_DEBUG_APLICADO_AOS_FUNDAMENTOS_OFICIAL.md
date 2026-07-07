# 060 — M1.40 — Debug Aplicado aos Fundamentos

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M1.40.01` — Debug aplicado aos fundamentos — Conceito, por que existe e vocabulário essencial.
- `M1.40.02` — Debug aplicado aos fundamentos — Exemplo mínimo digitado do zero.
- `M1.40.03` — Debug aplicado aos fundamentos — Exemplo aplicado ao domínio corporativo.
- `M1.40.04` — Debug aplicado aos fundamentos — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar breakpoint em `if`, laço, array, método e inspeção de variáveis, com foco em fundamentos Java, leitura de fluxo, entrada de dados, validação, métodos, escopo, passagem de valores, erros comuns, diagnóstico e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no encerramento técnico do Módulo 1 antes do mini projeto.

A sequência recente foi:

```text
056 — M1.36 — Sobrecarga de métodos inicial;
057 — M1.37 — Escopo de variáveis;
058 — M1.38 — Passagem de valores e referências;
059 — M1.39 — Tratamento inicial de erros de entrada;
060 — M1.40 — Debug aplicado aos fundamentos.
```

Até agora, aprendemos muitos fundamentos:

```text
variáveis;
tipos;
if;
switch;
while;
do while;
for;
break;
continue;
arrays;
matriz;
métodos;
parâmetros;
retorno;
sobrecarga;
escopo;
passagem de valores e referências;
tratamento inicial de entrada inválida.
```

Agora precisamos aprender a observar o programa por dentro.

Isso é debug.

Debug é uma habilidade central para qualquer pessoa que quer trabalhar bem com backend.

Não basta escrever código.

É preciso conseguir responder:

```text
por que entrou nesse if?
por que não entrou nesse else?
qual valor chegou no método?
em qual volta do for o erro acontece?
qual posição do array está sendo lida?
por que a variável mudou?
por que o método retornou esse valor?
por que o Scanner caiu no catch?
por que o status ficou inválido?
```

Debug é a ferramenta que permite investigar essas perguntas sem chute.

---

## Hoje a aula é sobre enxergar o fluxo

Quando você executa um programa normalmente, ele roda rápido.

Exemplo:

```java
int total = calcularTotal(valores);
System.out.println(total);
```

Você vê apenas o resultado final.

Com debug, você consegue pausar a execução e observar:

```text
qual linha está executando;
qual valor cada variável tem;
qual condição deu true ou false;
qual método foi chamado;
qual retorno voltou;
qual índice do array está em uso;
qual exceção foi capturada;
qual caminho o programa seguiu.
```

O debug transforma um programa invisível em uma sequência observável.

Esse é o objetivo da aula.

---

## O que é debug

Debug é o processo de investigar o comportamento do programa durante a execução.

Com debug, você executa o código passo a passo.

Ferramentas principais:

```text
breakpoint;
Step Over;
Step Into;
Step Out;
Resume;
Variables;
Watches;
Call Stack;
Evaluate Expression.
```

Nesta aula, o foco será:

```text
breakpoint em if;
breakpoint em laço;
breakpoint em array;
breakpoint em método;
inspeção de variáveis;
acompanhar retorno;
acompanhar entrada inválida;
diagnóstico com base em fatos.
```

Não vamos usar debug avançado ainda.

Vamos usar debug aplicado aos fundamentos.

---

## Por que debug existe

Debug existe porque ler o código nem sempre é suficiente.

Às vezes você acha que o programa faz uma coisa.

Mas ele faz outra.

Exemplo:

```java
if ("APROVADO".equals(status)) {
    System.out.println("Aprovado");
}
```

Você acha que `status` está `APROVADO`.

Mas no debug descobre que está:

```text
" aprovado "
```

com espaço e minúsculo.

Outro exemplo:

```java
for (int indice = 0; indice < valores.length; indice++) {
    total += valores[indice];
}
```

Você acha que o total está errado por causa da soma.

Mas no debug descobre que o array já chegou com valor errado.

Debug evita chute.

Debug mostra fato.

---

## Vocabulário essencial

Termos desta aula:

```text
debug;
depuração;
breakpoint;
ponto de parada;
execução passo a passo;
Step Over;
Step Into;
Step Out;
Resume;
Variables;
Watches;
Call Stack;
Evaluate Expression;
fluxo;
condição;
inspeção;
estado;
valor atual;
linha atual;
método atual;
pilha de chamadas;
entrada;
saída;
retorno;
exceção;
diagnóstico.
```

Termos mais importantes:

```text
breakpoint -> marcação onde o programa deve pausar;
Step Over -> executa a linha atual sem entrar no método chamado;
Step Into -> entra dentro do método chamado;
Step Out -> sai do método atual e volta para quem chamou;
Resume -> continua execução até o próximo breakpoint ou fim;
Variables -> área que mostra variáveis disponíveis no escopo atual;
Call Stack -> mostra a sequência de métodos chamados até o ponto atual;
Evaluate Expression -> permite avaliar uma expressão durante o debug.
```

---

## Preparação no IntelliJ

Para debugar no IntelliJ Community:

```text
1. abra o arquivo Java;
2. clique na lateral esquerda da linha para criar um breakpoint;
3. rode usando Debug, não Run;
4. quando parar, observe a janela Debug;
5. use Step Over ou Step Into;
6. veja as variáveis;
7. continue com Resume se necessário.
```

Atalhos comuns:

```text
Debug: Shift + F9;
Run: Shift + F10;
Step Over: F8;
Step Into: F7;
Step Out: Shift + F8;
Resume: F9;
Evaluate Expression: Alt + F8.
```

Os atalhos podem variar conforme keymap.

Se não funcionar, use:

```text
Ctrl + Shift + A
```

e procure:

```text
Debug
Step Over
Step Into
Resume
Evaluate Expression
```

---

## Breakpoint

Breakpoint é o ponto onde você manda o programa parar.

Exemplo:

```java
int total = calcularTotal(valores);
```

Se você coloca breakpoint nessa linha, o programa pausa antes de executar a linha.

A partir daí, você consegue:

```text
ver variáveis;
avançar linha por linha;
entrar em métodos;
ver retorno;
entender o caminho.
```

Breakpoint não altera o código.

Ele é uma ferramenta do ambiente.

---

## Debug não é só para erro

Muita gente acha que debug só serve quando o programa quebra.

Não.

Debug também serve para aprender.

Exemplos:

```text
entender um for;
entender um if;
entender um método;
entender um array;
entender Scanner;
entender try/catch;
entender passagem por valor;
entender retorno;
entender escopo.
```

Nesta aula, vamos usar debug como ferramenta de aprendizado.

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = 10;
        int limite = 5;

        if (quantidade > limite) {
            System.out.println("Quantidade acima do limite");
        } else {
            System.out.println("Quantidade dentro do limite");
        }
    }
}
```

Compile ou rode pelo IntelliJ.

Agora coloque breakpoint nesta linha:

```java
if (quantidade > limite) {
```

Execute em modo Debug.

Observe as variáveis:

```text
quantidade = 10;
limite = 5.
```

A condição:

```java
quantidade > limite
```

deve ser:

```text
true.
```

Ao avançar, o programa entra no bloco do `if`.

Esse é o primeiro debug.

---

## Debug em if

Arquivo:

```text
DebugIf.java
```

Código:

```java
public class DebugIf {
    public static void main(String[] args) {
        String status = " aprovado ";

        String statusNormalizado = status.trim().toUpperCase();

        if ("APROVADO".equals(statusNormalizado)) {
            System.out.println("Pedido aprovado");
        } else {
            System.out.println("Pedido não aprovado");
        }
    }
}
```

Coloque breakpoint em:

```java
String statusNormalizado = status.trim().toUpperCase();
```

Depois avance linha por linha.

Observe:

```text
antes da normalização:
status = " aprovado "

depois da normalização:
statusNormalizado = "APROVADO"
```

Depois observe a condição:

```java
"APROVADO".equals(statusNormalizado)
```

Resultado esperado:

```text
true.
```

Esse debug mostra por que normalização muda a decisão.

---

## Debug em if com erro proposital

Arquivo:

```text
DebugIfErroProposital.java
```

Código:

```java
public class DebugIfErroProposital {
    public static void main(String[] args) {
        String status = " aprovado ";

        if ("APROVADO".equals(status)) {
            System.out.println("Pedido aprovado");
        } else {
            System.out.println("Pedido não aprovado");
        }
    }
}
```

Coloque breakpoint no `if`.

Observe:

```text
status = " aprovado "
```

A condição será:

```text
false.
```

Por quê?

Porque existem espaços e letras minúsculas.

Correção:

```java
String statusNormalizado = status.trim().toUpperCase();
```

Esse é um exemplo perfeito de debug evitando chute.

---

## Step Over

`Step Over` executa a linha atual e vai para a próxima linha.

Use quando você não quer entrar dentro de um método.

Exemplo:

```java
String statusNormalizado = status.trim().toUpperCase();
```

Se usar Step Over, o IntelliJ executa essa linha inteira e mostra o próximo estado.

Você verá:

```text
statusNormalizado = "APROVADO".
```

Use Step Over para avançar sem entrar em detalhes internos.

---

## Step Into

`Step Into` entra dentro do método chamado.

Exemplo:

```java
int total = calcularTotal(valores);
```

Se usar Step Into nessa linha, o IntelliJ entra no método:

```java
public static int calcularTotal(int[] valores) {
```

Use Step Into quando você quer entender o método chamado.

Para métodos seus, é muito útil.

Para métodos internos do Java, como `println`, nem sempre é útil.

Nesta fase:

```text
Step Into nos seus métodos;
Step Over em println e métodos da biblioteca.
```

---

## Debug em método com retorno

Arquivo:

```text
DebugMetodoRetorno.java
```

Código:

```java
public class DebugMetodoRetorno {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        int total = calcularTotal(valores);

        System.out.println("Total: " + total);
    }

    public static int calcularTotal(int[] valores) {
        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        return total;
    }
}
```

Coloque breakpoint em:

```java
int total = calcularTotal(valores);
```

Execute em Debug.

Use Step Into.

Você entra em:

```java
public static int calcularTotal(int[] valores)
```

Observe:

```text
valores -> array com 10, 20, 30;
total = 0;
indice muda a cada volta;
total muda a cada soma.
```

No final, observe:

```java
return total;
```

O valor retornado deve ser:

```text
60.
```

Ao voltar para o `main`, observe:

```text
total = 60.
```

---

## Debug em laço for

Arquivo:

```text
DebugFor.java
```

Código:

```java
public class DebugFor {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        int total = 0;

        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }

        System.out.println("Total: " + total);
    }
}
```

Coloque breakpoint dentro do `for`:

```java
total += valores[indice];
```

Observe a cada volta:

```text
volta 1:
indice = 0
valores[indice] = 10
total antes = 0
total depois = 10

volta 2:
indice = 1
valores[indice] = 20
total antes = 10
total depois = 30

volta 3:
indice = 2
valores[indice] = 30
total antes = 30
total depois = 60
```

Esse debug fixa array, índice e acumulador.

---

## Debug em array

Arquivo:

```text
DebugArray.java
```

Código:

```java
public class DebugArray {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};

        for (int indice = 0; indice < clientes.length; indice++) {
            String clienteAtual = clientes[indice];

            System.out.println("Cliente: " + clienteAtual);
        }
    }
}
```

Coloque breakpoint em:

```java
String clienteAtual = clientes[indice];
```

Observe:

```text
clientes.length = 3;
indice = 0, clienteAtual = "Ana";
indice = 1, clienteAtual = "Bruno";
indice = 2, clienteAtual = "Carla".
```

Esse debug ajuda a entender por que o índice começa em 0.

---

## Debug em busca de array

Arquivo:

```text
DebugBuscaArray.java
```

Código:

```java
public class DebugBuscaArray {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};

        int indiceEncontrado = buscarCliente(clientes, "Bruno");

        if (indiceEncontrado != -1) {
            System.out.println("Encontrado na posição " + (indiceEncontrado + 1));
        } else {
            System.out.println("Cliente não encontrado");
        }
    }

    public static int buscarCliente(String[] clientes, String clienteProcurado) {
        for (int indice = 0; indice < clientes.length; indice++) {
            if (clienteProcurado.equalsIgnoreCase(clientes[indice])) {
                return indice;
            }
        }

        return -1;
    }
}
```

Coloque breakpoint em:

```java
int indiceEncontrado = buscarCliente(clientes, "Bruno");
```

Use Step Into.

Observe:

```text
indice = 0 -> clientes[0] = Ana -> não encontrou;
indice = 1 -> clientes[1] = Bruno -> encontrou;
return indice -> retorna 1.
```

Ao voltar para o `main`:

```text
indiceEncontrado = 1.
```

Esse debug mostra retorno antecipado.

---

## Debug em matriz

Arquivo:

```text
DebugMatriz.java
```

Código:

```java
public class DebugMatriz {
    public static void main(String[] args) {
        int[][] matriz = {
                {10, 20},
                {30, 40}
        };

        int total = 0;

        for (int linha = 0; linha < matriz.length; linha++) {
            for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
                total += matriz[linha][coluna];
            }
        }

        System.out.println("Total: " + total);
    }
}
```

Coloque breakpoint em:

```java
total += matriz[linha][coluna];
```

Observe:

```text
linha = 0, coluna = 0, valor = 10;
linha = 0, coluna = 1, valor = 20;
linha = 1, coluna = 0, valor = 30;
linha = 1, coluna = 1, valor = 40.
```

Esse debug fixa laço aninhado.

---

## Debug em passagem de valores

Arquivo:

```text
DebugPassagemValor.java
```

Código:

```java
public class DebugPassagemValor {
    public static void main(String[] args) {
        int quantidade = 10;

        alterarQuantidade(quantidade);

        System.out.println("Quantidade no main: " + quantidade);
    }

    public static void alterarQuantidade(int quantidade) {
        quantidade = 99;

        System.out.println("Quantidade no método: " + quantidade);
    }
}
```

Coloque breakpoint em:

```java
alterarQuantidade(quantidade);
```

Use Step Into.

Observe:

```text
no main: quantidade = 10;
no método: parâmetro quantidade = 10;
depois da atribuição no método: quantidade = 99;
ao voltar ao main: quantidade = 10.
```

Esse debug mostra passagem por valor em primitivo.

---

## Debug em referência de array

Arquivo:

```text
DebugReferenciaArray.java
```

Código:

```java
public class DebugReferenciaArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        alterarPrimeiro(valores);

        System.out.println("Primeiro no main: " + valores[0]);
    }

    public static void alterarPrimeiro(int[] valores) {
        valores[0] = 99;

        System.out.println("Primeiro no método: " + valores[0]);
    }
}
```

Coloque breakpoint em:

```java
alterarPrimeiro(valores);
```

Use Step Into.

Observe:

```text
valores[0] antes = 10;
dentro do método, valores[0] vira 99;
ao voltar ao main, valores[0] continua 99.
```

Esse debug mostra alteração de conteúdo do array.

---

## Debug em String

Arquivo:

```text
DebugString.java
```

Código:

```java
public class DebugString {
    public static void main(String[] args) {
        String status = " aprovado ";

        normalizar(status);

        System.out.println("Status no main: " + status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();

        System.out.println("Status no método: " + status);
    }
}
```

Coloque breakpoint em:

```java
normalizar(status);
```

Use Step Into.

Observe:

```text
status no main = " aprovado ";
parâmetro status recebe " aprovado ";
parâmetro status vira "APROVADO";
ao voltar ao main, status continua " aprovado ".
```

Esse debug fixa String com retorno ausente.

Correção:

```java
status = normalizar(status);
```

com método retornando `String`.

---

## Debug em try/catch

Arquivo:

```text
DebugTryCatch.java
```

Código:

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class DebugTryCatch {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade = lerInteiro(scanner, "Digite uma quantidade:");

        System.out.println("Quantidade: " + quantidade);

        scanner.close();
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
}
```

Coloque breakpoint em:

```java
int valor = scanner.nextInt();
```

Execute com Debug.

Digite:

```text
abc
```

Observe:

```text
falha no nextInt;
vai para catch;
mostra mensagem;
limpa entrada;
volta para while.
```

Depois digite:

```text
10
```

Observe:

```text
lê valor;
executa nextLine;
return valor;
volta para main.
```

Esse debug fixa tratamento de entrada.

---

## Debug aplicado: pedido

Arquivo:

```text
DebugPedido.java
```

Código:

```java
public class DebugPedido {
    public static void main(String[] args) {
        String cliente = "Ana";
        long valorCentavos = 1000L;
        String status = " aprovado ";

        String statusNormalizado = normalizarStatus(status);
        boolean valido = statusValido(statusNormalizado);

        exibirPedido(cliente, valorCentavos, statusNormalizado, valido);
    }

    public static String normalizarStatus(String status) {
        if (status == null) {
            return "";
        }

        return status.trim().toUpperCase();
    }

    public static boolean statusValido(String status) {
        return "PENDENTE".equals(status)
                || "APROVADO".equals(status)
                || "RECUSADO".equals(status)
                || "CANCELADO".equals(status);
    }

    public static void exibirPedido(String cliente, long valorCentavos, String status, boolean valido) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Status: " + status);
        System.out.println("Status válido: " + valido);
    }
}
```

Debug recomendado:

```text
1. coloque breakpoint em statusNormalizado;
2. use Step Into em normalizarStatus;
3. observe o retorno;
4. entre em statusValido;
5. observe boolean valido;
6. entre em exibirPedido.
```

Esse exemplo junta:

```text
String;
método com retorno;
boolean;
parâmetros;
debug de fluxo.
```

---

## Debug aplicado: produto

Arquivo:

```text
DebugProduto.java
```

Código:

```java
public class DebugProduto {
    public static void main(String[] args) {
        String produto = "Cadeira";
        int estoque = 0;
        String status = "ATIVO";

        boolean precisaAlerta = produtoAtivoSemEstoque(estoque, status);

        if (precisaAlerta) {
            System.out.println("Produto ativo sem estoque.");
        } else {
            System.out.println("Produto sem alerta.");
        }
    }

    public static boolean produtoAtivoSemEstoque(int estoque, String status) {
        return estoque == 0 && "ATIVO".equals(status);
    }
}
```

Coloque breakpoint em:

```java
boolean precisaAlerta = produtoAtivoSemEstoque(estoque, status);
```

Use Step Into.

Observe:

```text
estoque = 0;
status = ATIVO;
retorno = true.
```

Depois veja o `if`.

---

## Debug aplicado: pagamento

Arquivo:

```text
DebugPagamento.java
```

Código:

```java
public class DebugPagamento {
    public static void main(String[] args) {
        long valorCentavos = 10000L;
        int parcelas = 4;

        boolean pagamentoValido = pagamentoValido(valorCentavos, parcelas);

        if (pagamentoValido) {
            long valorParcela = calcularParcela(valorCentavos, parcelas);

            System.out.println("Valor da parcela: " + valorParcela);
        } else {
            System.out.println("Pagamento inválido");
        }
    }

    public static boolean pagamentoValido(long valorCentavos, int parcelas) {
        return valorCentavos > 0 && parcelas > 0;
    }

    public static long calcularParcela(long valorCentavos, int parcelas) {
        return valorCentavos / parcelas;
    }
}
```

Debug recomendado:

```text
1. verificar valorCentavos e parcelas;
2. entrar em pagamentoValido;
3. observar retorno true;
4. entrar no if;
5. entrar em calcularParcela;
6. observar retorno 2500.
```

Esse exemplo junta decisão e cálculo.

---

## Debug aplicado: OS

Arquivo:

```text
DebugOs.java
```

Código:

```java
public class DebugOs {
    public static void main(String[] args) {
        String statusOs = "ABERTA";
        int atividadesPendentes = 0;

        boolean podeConcluir = podeConcluirOs(statusOs, atividadesPendentes);

        if (podeConcluir) {
            System.out.println("OS pode ser concluída");
        } else {
            System.out.println("OS não pode ser concluída");
        }
    }

    public static boolean podeConcluirOs(String statusOs, int atividadesPendentes) {
        return "ABERTA".equals(statusOs) && atividadesPendentes == 0;
    }
}
```

Com debug, observe:

```text
statusOs = ABERTA;
atividadesPendentes = 0;
retorno = true;
entrou no if.
```

Depois altere:

```java
int atividadesPendentes = 2;
```

Observe o retorno virar `false`.

---

## Debug aplicado: mensageria

Arquivo:

```text
DebugMensageria.java
```

Código:

```java
public class DebugMensageria {
    public static void main(String[] args) {
        int tentativas = 3;
        boolean telefoneValido = true;

        boolean deveEnviar = deveEnviarMensagem(tentativas, telefoneValido);

        if (deveEnviar) {
            System.out.println("Mensagem será enviada");
        } else {
            System.out.println("Mensagem não será enviada");
        }
    }

    public static boolean deveEnviarMensagem(int tentativas, boolean telefoneValido) {
        int limiteTentativas = 3;

        return telefoneValido && tentativas < limiteTentativas;
    }
}
```

Debug recomendado:

```text
tentativas = 3;
telefoneValido = true;
limiteTentativas = 3;
tentativas < limiteTentativas = false;
retorno = false.
```

Esse exemplo mostra uma regra que pode parecer verdadeira, mas não é.

Debug ajuda a enxergar o detalhe:

```text
3 < 3 é false.
```

---

## Debug aplicado: auditoria

Arquivo:

```text
DebugAuditoria.java
```

Código:

```java
public class DebugAuditoria {
    public static void main(String[] args) {
        String usuario = "aline";
        String operacao = " edicao ";
        String status = "sucesso";

        String linha = montarLinhaAuditoria(usuario, operacao, status);

        System.out.println(linha);
    }

    public static String montarLinhaAuditoria(String usuario, String operacao, String status) {
        String operacaoNormalizada = operacao.trim().toUpperCase();
        String statusNormalizado = status.trim().toUpperCase();

        return usuario + " | " + operacaoNormalizada + " | " + statusNormalizado;
    }
}
```

Debug recomendado:

```text
entrar em montarLinhaAuditoria;
observar parâmetros;
observar operacaoNormalizada;
observar statusNormalizado;
observar retorno.
```

---

## Variables

A janela `Variables` mostra variáveis visíveis no escopo atual.

Exemplo dentro de um método:

```java
public static long calcularParcela(long valorCentavos, int parcelas) {
    return valorCentavos / parcelas;
}
```

Durante o debug, você deve ver:

```text
valorCentavos = 10000;
parcelas = 4.
```

Se estiver dentro de um `for`, verá:

```text
indice;
total;
array;
valor atual.
```

Se a variável não aparece, talvez ela esteja fora do escopo atual.

Isso reforça a aula de escopo.

---

## Watches

`Watches` permite acompanhar expressões específicas.

Exemplo:

```java
"APROVADO".equals(statusNormalizado)
```

ou:

```java
indice < valores.length
```

ou:

```java
valores[indice]
```

Você pode adicionar uma expressão para observar seu resultado durante o debug.

Isso é útil quando a condição é grande.

Exemplo:

```java
valorCentavos > 0 && parcelas > 0
```

Com watch, você acompanha se a regra é verdadeira ou falsa.

---

## Evaluate Expression

`Evaluate Expression` permite avaliar uma expressão durante o debug.

Exemplos:

```java
status.trim().toUpperCase()
```

```java
"APROVADO".equals(statusNormalizado)
```

```java
valores[indice]
```

```java
valorCentavos / parcelas
```

Use com cuidado.

Nesta fase, use para verificar hipóteses.

Exemplo:

```text
será que status.trim().toUpperCase() vira APROVADO?
```

Avalie e confirme.

---

## Call Stack

`Call Stack` mostra a pilha de chamadas.

Exemplo:

```text
main
 -> calcularMedia
    -> calcularTotal
```

Se você está dentro de `calcularTotal`, a call stack mostra que ele foi chamado por `calcularMedia`, que foi chamado pelo `main`.

Isso ajuda a responder:

```text
como o programa chegou aqui?
```

Esse conceito será muito importante em backend, quando chamadas passarem por:

```text
controller;
service;
repository;
client;
mapper;
validator.
```

Nesta fase, use para métodos simples.

---

## Debug não substitui pensar

Debug mostra dados.

Mas você ainda precisa interpretar.

Exemplo:

```text
status = " aprovado "
condição = false
```

Debug mostrou o fato.

Você interpreta:

```text
faltou normalizar.
```

Outro exemplo:

```text
tentativas = 3
limite = 3
tentativas < limite = false
```

Você interpreta:

```text
a regra permite somente menor que 3, não menor ou igual.
```

Debug é ferramenta.

Raciocínio continua sendo necessário.

---

## Como diagnosticar com debug

Roteiro prático:

```text
1. reproduza o problema;
2. coloque breakpoint antes do ponto suspeito;
3. execute em Debug;
4. observe variáveis de entrada;
5. avance linha por linha;
6. veja qual condição muda o fluxo;
7. entre nos métodos importantes;
8. observe retornos;
9. confirme se o valor esperado bate com o valor real;
10. corrija uma coisa por vez.
```

Não saia colocando breakpoint aleatório em tudo.

Coloque onde a decisão acontece.

Exemplos de bons pontos:

```text
antes do if;
dentro do for;
antes do return;
na chamada do método;
no catch;
na alteração do array;
na normalização de String.
```

---

## Erros comuns

### Erro 1 — Rodar Run em vez de Debug

Se usar Run, breakpoint não pausa.

Use Debug.

---

### Erro 2 — Colocar breakpoint depois do problema

Se o erro acontece antes, o programa pode quebrar antes de chegar no breakpoint.

Coloque antes do ponto suspeito.

---

### Erro 3 — Usar Step Into em println

Entrar em métodos internos do Java pode confundir.

Use Step Over em `System.out.println`.

---

### Erro 4 — Não observar variáveis

Debug sem olhar `Variables` vira só execução lenta.

Olhe os valores.

---

### Erro 5 — Achar que o valor é um, sem conferir

Sempre confirme no debug.

---

### Erro 6 — Não testar o caminho falso

Teste `if` quando dá true e quando dá false.

---

### Erro 7 — Não testar entrada inválida

Se a aula é sobre entrada, teste `abc`, vazio, negativo e valor válido.

---

### Erro 8 — Ignorar retorno do método

Veja o valor antes e depois do retorno.

---

### Erro 9 — Debugar código desorganizado demais

Métodos pequenos são mais fáceis de debugar.

---

### Erro 10 — Corrigir várias coisas ao mesmo tempo

Corrija uma hipótese por vez.

---

## Diagnóstico por tipo de problema

### Problema em if

Verifique:

```text
valor das variáveis;
resultado da condição;
normalização de String;
operador usado;
true ou false real.
```

### Problema em for

Verifique:

```text
valor inicial do índice;
condição de parada;
incremento;
array.length;
posição acessada;
acumulador.
```

### Problema em array

Verifique:

```text
conteúdo do array;
índice atual;
length;
valor na posição;
alterações anteriores.
```

### Problema em método

Verifique:

```text
argumentos enviados;
parâmetros recebidos;
fluxo interno;
return;
valor recebido por quem chamou.
```

### Problema em try/catch

Verifique:

```text
entrada digitada;
linha que lança erro;
catch executado;
limpeza com nextLine;
retorno ao loop.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — If falso por falta de normalização

```java
public class Main {
    public static void main(String[] args) {
        String status = " aprovado ";

        if ("APROVADO".equals(status)) {
            System.out.println("Aprovado");
        } else {
            System.out.println("Não aprovado");
        }
    }
}
```

Use debug para descobrir o motivo.

Depois corrija com:

```java
status.trim().toUpperCase()
```

---

### Teste 2 — Total errado por acumulador no lugar errado

```java
public class Main {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        for (int indice = 0; indice < valores.length; indice++) {
            int total = 0;
            total += valores[indice];

            System.out.println(total);
        }
    }
}
```

Debugue e observe que `total` volta para 0 a cada iteração.

Depois corrija declarando `total` fora do loop.

---

### Teste 3 — Busca retorna -1

```java
public class Main {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno"};

        int indice = buscarCliente(clientes, "Carla");

        System.out.println(indice);
    }

    public static int buscarCliente(String[] clientes, String procurado) {
        for (int indice = 0; indice < clientes.length; indice++) {
            if (procurado.equalsIgnoreCase(clientes[indice])) {
                return indice;
            }
        }

        return -1;
    }
}
```

Debugue o loop e veja por que não encontrou.

---

### Teste 4 — String não muda fora do método

```java
public class Main {
    public static void main(String[] args) {
        String status = " pendente ";

        normalizar(status);

        System.out.println(status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();
    }
}
```

Debugue a passagem para método.

Depois corrija usando retorno.

---

### Teste 5 — InputMismatchException

Use o exemplo de leitura de inteiro e digite:

```text
abc
```

Debugue o fluxo até o `catch`.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m1\aula-060-debug-aplicado-fundamentos
cd labs\m1\aula-060-debug-aplicado-fundamentos
```

Crie arquivos:

```text
Main.java
DebugIf.java
DebugIfErroProposital.java
DebugMetodoRetorno.java
DebugFor.java
DebugArray.java
DebugBuscaArray.java
DebugMatriz.java
DebugPassagemValor.java
DebugReferenciaArray.java
DebugString.java
DebugTryCatch.java
DebugPedido.java
DebugProduto.java
DebugPagamento.java
DebugOs.java
DebugMensageria.java
DebugAuditoria.java
ErroIfSemNormalizacao.java
ErroAcumuladorEscopo.java
ErroBuscaNaoEncontrada.java
ErroStringSemRetornoDebug.java
ErroEntradaInvalidaDebug.java
```

Compile:

```powershell
javac Main.java
javac DebugIf.java
javac DebugIfErroProposital.java
javac DebugMetodoRetorno.java
javac DebugFor.java
javac DebugArray.java
javac DebugBuscaArray.java
javac DebugMatriz.java
javac DebugPassagemValor.java
javac DebugReferenciaArray.java
javac DebugString.java
javac DebugTryCatch.java
javac DebugPedido.java
javac DebugProduto.java
javac DebugPagamento.java
javac DebugOs.java
javac DebugMensageria.java
javac DebugAuditoria.java
javac ErroIfSemNormalizacao.java
javac ErroAcumuladorEscopo.java
javac ErroBuscaNaoEncontrada.java
javac ErroStringSemRetornoDebug.java
javac ErroEntradaInvalidaDebug.java
```

Execute normalmente e depois em Debug:

```powershell
java Main
java DebugIf
java DebugIfErroProposital
java DebugMetodoRetorno
java DebugFor
java DebugArray
java DebugBuscaArray
java DebugMatriz
java DebugPassagemValor
java DebugReferenciaArray
java DebugString
java DebugTryCatch
java DebugPedido
java DebugProduto
java DebugPagamento
java DebugOs
java DebugMensageria
java DebugAuditoria
java ErroIfSemNormalizacao
java ErroAcumuladorEscopo
java ErroBuscaNaoEncontrada
java ErroStringSemRetornoDebug
java ErroEntradaInvalidaDebug
```

Nesta aula, a evidência principal não é apenas a saída.

A evidência principal é conseguir explicar o que viu no debug.

---

## Arquivo sugerido: `ErroIfSemNormalizacao.java`

```java
public class ErroIfSemNormalizacao {
    public static void main(String[] args) {
        String status = " aprovado ";

        if ("APROVADO".equals(status)) {
            System.out.println("Pedido aprovado");
        } else {
            System.out.println("Pedido não aprovado");
        }
    }
}
```

Objetivo:

```text
usar debug para descobrir que o texto não foi normalizado.
```

---

## Arquivo sugerido: `ErroAcumuladorEscopo.java`

```java
public class ErroAcumuladorEscopo {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        for (int indice = 0; indice < valores.length; indice++) {
            int total = 0;

            total += valores[indice];

            System.out.println("Total parcial: " + total);
        }
    }
}
```

Objetivo:

```text
usar debug para perceber que total nasce de novo em cada volta.
```

---

## Arquivo sugerido: `ErroStringSemRetornoDebug.java`

```java
public class ErroStringSemRetornoDebug {
    public static void main(String[] args) {
        String status = " pendente ";

        normalizar(status);

        System.out.println("Status no main: " + status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();

        System.out.println("Status no método: " + status);
    }
}
```

Objetivo:

```text
usar debug para ver que o parâmetro muda, mas a variável do main não.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Iniciar Debug | `Shift + F9` | Rodar pausando em breakpoints |
| Rodar normal | `Shift + F10` | Executar sem debug |
| Step Over | `F8` em muitos keymaps | Avançar sem entrar no método |
| Step Into | `F7` em muitos keymaps | Entrar no método chamado |
| Step Out | `Shift + F8` em muitos keymaps | Sair do método atual |
| Resume | `F9` em muitos keymaps | Continuar até próximo breakpoint |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Avaliar expressão no debug |
| Toggle Breakpoint | clique na lateral da linha | Marcar ponto de parada |
| Ir para declaração | `Ctrl + B` em muitos keymaps | Conferir método chamado |
| Reformatar código | `Ctrl + Alt + L` | Melhorar leitura antes do debug |

Se algum atalho variar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Checklist de debug para cada exercício

Antes de considerar o exercício concluído, responda:

```text
1. Onde coloquei o breakpoint?
2. Por que escolhi essa linha?
3. Quais variáveis observei?
4. Qual valor eu esperava?
5. Qual valor apareceu de verdade?
6. Qual linha mudou o fluxo?
7. Entrei em algum método com Step Into?
8. Observei algum return?
9. O resultado final bate com o fluxo observado?
10. Qual conclusão técnica eu tirei?
```

Esse checklist transforma debug em aprendizado real.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 060 — Debug aplicado aos fundamentos

### O que aprendi
Aprendi a usar debug para observar o fluxo do programa, inspecionar variáveis, acompanhar `if`, laços, arrays, métodos, retornos, passagem de valores, referências e tratamento inicial de erro com `try/catch`.

### O que pratiquei
Coloquei breakpoints em `if`, `for`, array, matriz, método com retorno, passagem de valor, referência de array, String, `try/catch` e exemplos aplicados de pedido, produto, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- debug
- breakpoint
- Step Over
- Step Into
- Step Out
- Resume
- Variables
- Watches
- Evaluate Expression
- Call Stack
- fluxo de execução
- inspeção de variáveis
- condição true/false
- retorno de método
- índice de array
- acumulador
- passagem de valor
- referência de array
- String sem retorno
- try/catch em debug

### Arquivos criados
- `labs/m1/aula-060-debug-aplicado-fundamentos/Main.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugIf.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugIfErroProposital.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugMetodoRetorno.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugFor.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugArray.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugBuscaArray.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugMatriz.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugPassagemValor.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugReferenciaArray.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugString.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugTryCatch.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugPedido.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugProduto.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugPagamento.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugOs.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugMensageria.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/DebugAuditoria.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/ErroIfSemNormalizacao.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/ErroAcumuladorEscopo.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/ErroBuscaNaoEncontrada.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/ErroStringSemRetornoDebug.java`
- `labs/m1/aula-060-debug-aplicado-fundamentos/ErroEntradaInvalidaDebug.java`

### Comandos usados
```powershell
javac Main.java
java Main
javac DebugIf.java
java DebugIf
javac DebugMetodoRetorno.java
java DebugMetodoRetorno
javac DebugTryCatch.java
java DebugTryCatch
```

### Erros que quero evitar
- rodar Run em vez de Debug;
- colocar breakpoint depois do problema;
- usar Step Into em `println` sem necessidade;
- não observar variáveis;
- achar que o valor é um sem conferir;
- não testar caminho falso;
- não testar entrada inválida;
- ignorar retorno do método;
- debugar código desorganizado demais;
- corrigir várias coisas ao mesmo tempo.

### Próximo passo
Fazer o mini projeto Calculadora Profissional Console.
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
git add labs/m1/aula-060-debug-aplicado-fundamentos docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 060: pratica debug aplicado aos fundamentos em Java"
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
1. O que é debug?
2. O que é breakpoint?
3. Qual a diferença entre Run e Debug?
4. Qual a diferença entre Step Over e Step Into?
5. Para que serve a área Variables?
6. Para que serve Evaluate Expression?
7. Como debug ajuda a entender um if?
8. Como debug ajuda a entender um for?
9. Como debug ajuda a entender métodos com retorno?
10. Como debug ajuda a diagnosticar entrada inválida no Scanner?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar debug;
criar breakpoint;
executar em modo Debug;
usar Step Over;
usar Step Into;
usar Resume;
inspecionar variáveis;
acompanhar if true;
acompanhar if false;
acompanhar for;
acompanhar array;
acompanhar matriz;
entrar em método;
observar parâmetros;
observar retorno;
observar passagem de valor;
observar alteração de array por referência;
observar String sem retorno;
acompanhar try/catch;
acompanhar InputMismatchException;
usar debug em pedido;
usar debug em produto;
usar debug em pagamento;
usar debug em OS;
usar debug em mensageria;
usar debug em auditoria;
identificar valor esperado versus valor real;
corrigir uma hipótese por vez;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar debug remoto.

Não precisa ainda dominar conditional breakpoint.

Não precisa ainda dominar watch avançado.

Não precisa ainda dominar análise de thread.

Não precisa ainda dominar profiler.

Esses assuntos virão depois.

O objetivo é usar debug como ferramenta diária para entender fundamentos Java.

---

## Fechamento da aula

Hoje aprendemos debug aplicado aos fundamentos.

A ideia central foi:

```text
debug permite observar o programa por dentro enquanto ele executa.
```

Vimos breakpoint em:

```text
if;
for;
array;
matriz;
método;
return;
String;
passagem de valor;
referência de array;
try/catch.
```

Também vimos ferramentas:

```text
Step Over;
Step Into;
Resume;
Variables;
Watches;
Evaluate Expression;
Call Stack.
```

O ponto mais importante é:

```text
debug reduz chute e aumenta diagnóstico baseado em fatos.
```

Na próxima aula, vamos fazer o mini projeto Calculadora Profissional Console.

Esse projeto vai consolidar o Módulo 1 com entrada segura, métodos, validação, operações, menu, laço, tratamento de erro, organização e debug.
