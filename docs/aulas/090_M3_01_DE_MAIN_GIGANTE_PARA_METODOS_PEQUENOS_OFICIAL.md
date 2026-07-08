# 090 — M3.01 — De main gigante para métodos pequenos

## A pergunta central da aula

Imagine um programa assim:

```java
public class Main {
    public static void main(String[] args) {
        // lê dados
        // valida dados
        // calcula total
        // calcula desconto
        // formata saída
        // imprime resumo
        // registra status
        // trata erro
    }
}
```

No começo, parece normal.

Mas conforme o programa cresce, o `main` vira um bloco enorme.

Sinais:

```text
muitas linhas;
muitos ifs;
muitas variáveis;
muita duplicação;
muitos comentários explicando blocos;
difícil saber onde começa e termina uma regra;
difícil testar uma parte sem rodar tudo;
difícil mudar sem quebrar outra coisa.
```

A pergunta da aula é:

```text
como transformar um main gigante em métodos pequenos, claros e responsáveis?
```

A resposta é:

```text
identificar blocos com intenção;
dar nome para esses blocos;
extrair métodos;
passar parâmetros necessários;
retornar resultado quando fizer sentido;
evitar método que faz tudo;
refatorar em passos pequenos;
rodar após cada mudança.
```

---

## O que é um main gigante

Um `main` gigante é um método principal que concentra responsabilidades demais.

Exemplo de responsabilidades misturadas:

```text
entrada de dados;
validação;
conversão;
cálculo;
regra de negócio;
formatação;
impressão;
menu;
controle de fluxo;
tratamento de erro;
persistência futura;
integração futura.
```

O `main` deveria ser o ponto de entrada.

Mas ele não deveria conter toda a inteligência do programa.

Pense assim:

```text
main coordena;
métodos fazem partes nomeadas do trabalho.
```

---

## Por que main gigante é problema

Um `main` gigante dificulta:

```text
leitura;
debug;
teste;
manutenção;
reuso;
refatoração;
explicação;
revisão;
evolução para orientação a objetos.
```

Quando tudo está no `main`, não há fronteiras.

Sem fronteiras, qualquer mudança pode afetar qualquer coisa.

Esse é o começo da bagunça.

---

## O que é método pequeno

Método pequeno não significa método minúsculo sem sentido.

Método pequeno é aquele que tem:

```text
nome claro;
responsabilidade clara;
entrada clara;
saída clara;
tamanho razoável;
baixo nível de surpresa;
poucas razões para mudar.
```

Exemplo:

```java
public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Esse método é pequeno e claro.

Ele tem:

```text
nome;
parâmetros;
retorno;
responsabilidade.
```

---

## Método pequeno não é método artificial

Nem todo bloco precisa virar método.

Exemplo ruim:

```java
public static void imprimirLinhaEmBranco() {
    System.out.println();
}
```

Isso pode ser exagero se usado sem necessidade.

A pergunta não é:

```text
posso extrair?
```

A pergunta é:

```text
extrair melhora leitura, responsabilidade ou reuso?
```

Refatoração precisa ter intenção.

---

## Sinais de que um trecho merece virar método

Extraia método quando perceber:

```text
o bloco tem uma intenção nomeável;
o bloco aparece repetido;
o bloco tem regra própria;
o bloco é difícil de entender no meio do main;
o bloco pode ser testado isoladamente;
o bloco mistura nível de detalhe com visão geral;
o comentário explica o que o bloco faz;
o main está grande demais.
```

Exemplo:

```java
// calcula valor total do pedido
BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));
```

Se há comentário explicando intenção, talvez o método devesse se chamar:

```java
calcularTotalPedido
```

---

## Comentário que denuncia método ausente

Se você escreve:

```java
// validar cliente
```

e abaixo há várias linhas, talvez exista um método:

```java
validarCliente(...)
```

Se você escreve:

```java
// calcular desconto
```

talvez exista:

```java
calcularDesconto(...)
```

Se você escreve:

```java
// imprimir resumo
```

talvez exista:

```java
imprimirResumo(...)
```

Comentário não é errado.

Mas muitas vezes comentário indica que o código ainda não tem nome suficiente.

Método bom dá nome para intenção.

---

## Níveis de detalhe

Um `main` bom deve contar a história em alto nível.

Exemplo:

```java
public static void main(String[] args) {
    Produto produto = criarProdutoExemplo();
    Pedido pedido = criarPedido(produto);

    BigDecimal total = calcularTotal(pedido);
    BigDecimal desconto = calcularDesconto(total);
    BigDecimal totalFinal = aplicarDesconto(total, desconto);

    imprimirResumo(pedido, total, desconto, totalFinal);
}
```

Esse `main` permite entender o fluxo sem mergulhar nos detalhes.

Os detalhes ficam em métodos.

Isso melhora leitura.

---

## Responsabilidade

Responsabilidade é o motivo pelo qual um trecho existe.

Exemplo de responsabilidades diferentes:

```text
ler entrada;
validar entrada;
calcular total;
formatar dinheiro;
imprimir resumo.
```

Se um método faz tudo isso, ele tem responsabilidades demais.

Um método deve ter uma responsabilidade principal.

Exemplo ruim:

```java
public static void processarPedido() {
    // lê dados
    // valida dados
    // calcula
    // imprime
}
```

Exemplo melhor:

```java
Pedido pedido = lerPedido(scanner);
ResultadoValidacao validacao = validarPedido(pedido);
BigDecimal total = calcularTotal(pedido);
imprimirResumo(pedido, total);
```

---

## Parâmetros

Quando extraímos método, precisamos passar o que ele precisa.

Exemplo:

```java
public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Parâmetros:

```text
precoUnitario;
quantidade.
```

Eles são os dados necessários para o método cumprir sua responsabilidade.

Evite método que depende de variável global sem necessidade.

Nesta fase, ainda estamos usando métodos `static`, mas já podemos praticar parâmetros claros.

---

## Retorno

Método deve retornar resultado quando calcula ou produz valor.

Exemplo:

```java
public static BigDecimal calcularDesconto(BigDecimal total) {
    if (total.compareTo(new BigDecimal("100.00")) >= 0) {
        return total.multiply(new BigDecimal("0.10"));
    }

    return BigDecimal.ZERO;
}
```

Esse método calcula e retorna.

Evite fazer cálculo e impressão no mesmo método sem necessidade.

Ruim:

```java
public static void calcularEImprimirDesconto(BigDecimal total) {
    // calcula
    // imprime
}
```

Melhor separar:

```java
BigDecimal desconto = calcularDesconto(total);
imprimirDesconto(desconto);
```

---

## void não é errado

Método `void` não é errado.

Ele faz sentido quando o objetivo é executar uma ação sem devolver valor.

Exemplo:

```java
public static void imprimirResumo(Pedido pedido, BigDecimal total) {
    System.out.println("Pedido: " + pedido.codigo());
    System.out.println("Total: " + total);
}
```

Esse método imprime.

Ele não precisa retornar.

O problema não é usar `void`.

O problema é usar `void` para esconder regra que deveria retornar resultado.

---

## Exemplo ruim inicial

Arquivo:

```text
MainGigante.java
```

Código:

```java
import java.math.BigDecimal;

public class MainGigante {
    public static void main(String[] args) {
        String cliente = "  ana silva ";
        String produto = "cadeira";
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        cliente = cliente.trim().toUpperCase();
        produto = produto.trim().toUpperCase();

        if (cliente.isBlank()) {
            System.out.println("Cliente obrigatório.");
            return;
        }

        if (produto.isBlank()) {
            System.out.println("Produto obrigatório.");
            return;
        }

        if (precoUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("Preço deve ser maior que zero.");
            return;
        }

        if (quantidade <= 0) {
            System.out.println("Quantidade deve ser maior que zero.");
            return;
        }

        BigDecimal total = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

        BigDecimal desconto;
        if (total.compareTo(new BigDecimal("300.00")) >= 0) {
            desconto = total.multiply(new BigDecimal("0.10"));
        } else {
            desconto = BigDecimal.ZERO;
        }

        BigDecimal totalFinal = total.subtract(desconto);

        System.out.println("=== RESUMO DO PEDIDO ===");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Preço unitário: " + precoUnitario);
        System.out.println("Quantidade: " + quantidade);
        System.out.println("Total: " + total);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
    }
}
```

Esse código funciona.

Mas já tem sinais de `main` inchado:

```text
normalização;
validação;
cálculo;
regra de desconto;
impressão;
tudo misturado.
```

---

## Primeiro passo de refatoração

Não refatore tudo de uma vez.

Primeiro extraia normalização.

Antes:

```java
cliente = cliente.trim().toUpperCase();
produto = produto.trim().toUpperCase();
```

Depois:

```java
cliente = normalizarNome(cliente);
produto = normalizarNome(produto);
```

Método:

```java
public static String normalizarNome(String valor) {
    return valor.trim().toUpperCase();
}
```

Melhor ainda, tratando `null`:

```java
public static String normalizarNome(String valor) {
    if (valor == null) {
        return "";
    }

    return valor.trim().toUpperCase();
}
```

Ganho:

```text
o main fica mais legível;
a regra tem nome;
o tratamento de null fica centralizado.
```

---

## Segundo passo: validação de texto

Antes:

```java
if (cliente.isBlank()) {
    System.out.println("Cliente obrigatório.");
    return;
}

if (produto.isBlank()) {
    System.out.println("Produto obrigatório.");
    return;
}
```

Depois:

```java
if (textoEmBranco(cliente)) {
    System.out.println("Cliente obrigatório.");
    return;
}

if (textoEmBranco(produto)) {
    System.out.println("Produto obrigatório.");
    return;
}
```

Método:

```java
public static boolean textoEmBranco(String valor) {
    return valor == null || valor.isBlank();
}
```

Esse método tem uma responsabilidade clara.

---

## Terceiro passo: validação numérica

Antes:

```java
if (precoUnitario.compareTo(BigDecimal.ZERO) <= 0) {
    System.out.println("Preço deve ser maior que zero.");
    return;
}

if (quantidade <= 0) {
    System.out.println("Quantidade deve ser maior que zero.");
    return;
}
```

Depois:

```java
if (!valorPositivo(precoUnitario)) {
    System.out.println("Preço deve ser maior que zero.");
    return;
}

if (!quantidadePositiva(quantidade)) {
    System.out.println("Quantidade deve ser maior que zero.");
    return;
}
```

Métodos:

```java
public static boolean valorPositivo(BigDecimal valor) {
    return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
}

public static boolean quantidadePositiva(int quantidade) {
    return quantidade > 0;
}
```

Ganho:

```text
a regra fica nomeada;
a comparação BigDecimal não fica espalhada;
o main conta a intenção.
```

---

## Quarto passo: cálculo de total

Antes:

```java
BigDecimal total = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
```

Depois:

```java
BigDecimal total = calcularTotal(precoUnitario, quantidade);
```

Método:

```java
public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Ganho:

```text
o cálculo tem nome;
pode ser testado isoladamente;
o main fica mais expressivo.
```

---

## Quinto passo: desconto

Antes:

```java
BigDecimal desconto;
if (total.compareTo(new BigDecimal("300.00")) >= 0) {
    desconto = total.multiply(new BigDecimal("0.10"));
} else {
    desconto = BigDecimal.ZERO;
}
```

Depois:

```java
BigDecimal desconto = calcularDesconto(total);
```

Método:

```java
public static BigDecimal calcularDesconto(BigDecimal total) {
    BigDecimal limiteDesconto = new BigDecimal("300.00");
    BigDecimal percentualDesconto = new BigDecimal("0.10");

    if (total.compareTo(limiteDesconto) >= 0) {
        return total.multiply(percentualDesconto);
    }

    return BigDecimal.ZERO;
}
```

Ganho:

```text
regra de desconto isolada;
números ganham nomes;
main não carrega detalhe.
```

---

## Sexto passo: total final

Antes:

```java
BigDecimal totalFinal = total.subtract(desconto);
```

Depois:

```java
BigDecimal totalFinal = aplicarDesconto(total, desconto);
```

Método:

```java
public static BigDecimal aplicarDesconto(BigDecimal total, BigDecimal desconto) {
    return total.subtract(desconto);
}
```

Esse método é simples.

Mas ele pode fazer sentido porque expressa regra de domínio:

```text
total final = total - desconto.
```

Em outro contexto, talvez fosse simples demais.

Aqui, ajuda a história do pedido.

---

## Sétimo passo: impressão do resumo

Antes, várias linhas no `main`:

```java
System.out.println("=== RESUMO DO PEDIDO ===");
System.out.println("Cliente: " + cliente);
System.out.println("Produto: " + produto);
System.out.println("Preço unitário: " + precoUnitario);
System.out.println("Quantidade: " + quantidade);
System.out.println("Total: " + total);
System.out.println("Desconto: " + desconto);
System.out.println("Total final: " + totalFinal);
```

Depois:

```java
imprimirResumo(cliente, produto, precoUnitario, quantidade, total, desconto, totalFinal);
```

Método:

```java
public static void imprimirResumo(
        String cliente,
        String produto,
        BigDecimal precoUnitario,
        int quantidade,
        BigDecimal total,
        BigDecimal desconto,
        BigDecimal totalFinal
) {
    System.out.println("=== RESUMO DO PEDIDO ===");
    System.out.println("Cliente: " + cliente);
    System.out.println("Produto: " + produto);
    System.out.println("Preço unitário: " + precoUnitario);
    System.out.println("Quantidade: " + quantidade);
    System.out.println("Total: " + total);
    System.out.println("Desconto: " + desconto);
    System.out.println("Total final: " + totalFinal);
}
```

Atenção:

```text
muitos parâmetros podem ser sinal de que uma classe/record fará sentido depois.
```

Mas nesta aula, ainda estamos praticando métodos.

---

## Versão refatorada completa

Arquivo:

```text
PedidoRefatorado.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoRefatorado {
    public static void main(String[] args) {
        String cliente = normalizarNome("  ana silva ");
        String produto = normalizarNome("cadeira");
        BigDecimal precoUnitario = new BigDecimal("199.90");
        int quantidade = 2;

        if (!dadosValidos(cliente, produto, precoUnitario, quantidade)) {
            return;
        }

        BigDecimal total = calcularTotal(precoUnitario, quantidade);
        BigDecimal desconto = calcularDesconto(total);
        BigDecimal totalFinal = aplicarDesconto(total, desconto);

        imprimirResumo(cliente, produto, precoUnitario, quantidade, total, desconto, totalFinal);
    }

    public static boolean dadosValidos(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        if (textoEmBranco(cliente)) {
            System.out.println("Cliente obrigatório.");
            return false;
        }

        if (textoEmBranco(produto)) {
            System.out.println("Produto obrigatório.");
            return false;
        }

        if (!valorPositivo(precoUnitario)) {
            System.out.println("Preço deve ser maior que zero.");
            return false;
        }

        if (!quantidadePositiva(quantidade)) {
            System.out.println("Quantidade deve ser maior que zero.");
            return false;
        }

        return true;
    }

    public static String normalizarNome(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().toUpperCase();
    }

    public static boolean textoEmBranco(String valor) {
        return valor == null || valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static boolean quantidadePositiva(int quantidade) {
        return quantidade > 0;
    }

    public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal total) {
        BigDecimal limiteDesconto = new BigDecimal("300.00");
        BigDecimal percentualDesconto = new BigDecimal("0.10");

        if (total.compareTo(limiteDesconto) >= 0) {
            return total.multiply(percentualDesconto);
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal aplicarDesconto(BigDecimal total, BigDecimal desconto) {
        return total.subtract(desconto);
    }

    public static void imprimirResumo(
            String cliente,
            String produto,
            BigDecimal precoUnitario,
            int quantidade,
            BigDecimal total,
            BigDecimal desconto,
            BigDecimal totalFinal
    ) {
        System.out.println("=== RESUMO DO PEDIDO ===");
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Preço unitário: " + precoUnitario);
        System.out.println("Quantidade: " + quantidade);
        System.out.println("Total: " + total);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
    }
}
```

Agora o `main` está menor.

Ainda não está perfeito.

Mas está muito mais legível.

---

## Leitura crítica da versão refatorada

Pontos bons:

```text
main conta a história;
validações têm métodos;
cálculos têm métodos;
impressão foi isolada;
nomes melhoraram;
BigDecimal compareTo está centralizado;
cada método pode ser entendido separadamente.
```

Pontos que ainda podem melhorar futuramente:

```text
muitos parâmetros em imprimirResumo;
dados de pedido ainda são variáveis soltas;
cliente/produto poderiam virar record;
regra de desconto poderia ter nome de negócio;
mensagens poderiam ser padronizadas;
testes manuais poderiam ser adicionados.
```

Isso é normal.

Refatoração é incremental.

O objetivo da aula é sair do `main` gigante para métodos pequenos.

Não resolver toda arquitetura de uma vez.

---

## Extração manual versus extração pela IDE

Você pode extrair método manualmente:

```text
1. Identificar bloco.
2. Criar método.
3. Copiar bloco.
4. Definir parâmetros.
5. Definir retorno.
6. Substituir bloco pela chamada.
7. Rodar.
```

Ou pode usar a IDE:

```text
Refactor
Extract Method
```

Atalho pode variar conforme keymap.

O mais importante:

```text
a IDE ajuda a executar a refatoração;
você precisa saber por que está extraindo.
```

Não use refatoração automática sem entender.

---

## Exemplo com console robusto

Na aula 086, o console robusto já mostrou métodos como:

```java
lerTextoObrigatorio
lerInteiro
lerInteiroEntre
confirmar
```

Isso é a mesma ideia.

Em vez de deixar toda leitura no `main`, criamos métodos.

Arquivo:

```text
CadastroClienteRefatorado.java
```

Código:

```java
import java.util.Scanner;

public class CadastroClienteRefatorado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Nome: ");
        String email = lerTextoObrigatorio(scanner, "E-mail: ");
        int idade = lerInteiroEntre(scanner, "Idade: ", 0, 130);

        imprimirCliente(nome, email, idade);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();

            if (!valor.isBlank()) {
                return valor;
            }

            System.out.println("Valor obrigatório. Tente novamente.");
        }
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

    public static void imprimirCliente(String nome, String email, int idade) {
        System.out.println("Cliente cadastrado:");
        System.out.println("Nome: " + nome);
        System.out.println("E-mail: " + email);
        System.out.println("Idade: " + idade);
    }
}
```

Aqui temos:

```text
main coordenando;
métodos lendo;
método imprimindo.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoRefatorado.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoRefatorado {
    public static void main(String[] args) {
        String nome = normalizarTexto("  cadeira gamer  ");
        BigDecimal preco = new BigDecimal("799.90");
        int estoque = 5;

        if (!produtoValido(nome, preco, estoque)) {
            return;
        }

        BigDecimal valorEstoque = calcularValorEstoque(preco, estoque);

        imprimirProduto(nome, preco, estoque, valorEstoque);
    }

    public static String normalizarTexto(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().replaceAll("\\s+", " ");
    }

    public static boolean produtoValido(String nome, BigDecimal preco, int estoque) {
        if (nome.isBlank()) {
            System.out.println("Nome do produto é obrigatório.");
            return false;
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("Preço deve ser maior que zero.");
            return false;
        }

        if (estoque < 0) {
            System.out.println("Estoque não pode ser negativo.");
            return false;
        }

        return true;
    }

    public static BigDecimal calcularValorEstoque(BigDecimal preco, int estoque) {
        return preco.multiply(BigDecimal.valueOf(estoque));
    }

    public static void imprimirProduto(String nome, BigDecimal preco, int estoque, BigDecimal valorEstoque) {
        System.out.println("Produto: " + nome);
        System.out.println("Preço: " + preco);
        System.out.println("Estoque: " + estoque);
        System.out.println("Valor em estoque: " + valorEstoque);
    }
}
```

Repare:

```text
validar produto;
calcular valor em estoque;
imprimir produto.
```

Cada método tem intenção.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoRefatorado.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PagamentoRefatorado {
    public static void main(String[] args) {
        BigDecimal valorBruto = new BigDecimal("100.005");
        String forma = normalizarFormaPagamento(" pix ");

        BigDecimal valorFinal = arredondarMoeda(valorBruto);

        if (!pagamentoValido(valorFinal, forma)) {
            return;
        }

        imprimirPagamento(valorFinal, forma);
    }

    public static String normalizarFormaPagamento(String forma) {
        if (forma == null) {
            return "";
        }

        return forma.trim().toUpperCase();
    }

    public static BigDecimal arredondarMoeda(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static boolean pagamentoValido(BigDecimal valor, String forma) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("Valor do pagamento deve ser maior que zero.");
            return false;
        }

        if (forma.isBlank()) {
            System.out.println("Forma de pagamento é obrigatória.");
            return false;
        }

        return true;
    }

    public static void imprimirPagamento(BigDecimal valor, String forma) {
        System.out.println("Pagamento:");
        System.out.println("Valor: " + valor);
        System.out.println("Forma: " + forma);
    }
}
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoRefatorada.java
```

Código:

```java
import java.time.LocalDate;

public class OrdemServicoRefatorada {
    public static void main(String[] args) {
        String certificado = normalizarCertificado(" os-001 ");
        LocalDate dataAgendamento = LocalDate.now().plusDays(2);

        if (!ordemServicoValida(certificado, dataAgendamento)) {
            return;
        }

        imprimirOrdemServico(certificado, dataAgendamento);
    }

    public static String normalizarCertificado(String certificado) {
        if (certificado == null) {
            return "";
        }

        return certificado.trim().toUpperCase();
    }

    public static boolean ordemServicoValida(String certificado, LocalDate dataAgendamento) {
        if (certificado.isBlank()) {
            System.out.println("Certificado é obrigatório.");
            return false;
        }

        if (dataAgendamento == null) {
            System.out.println("Data de agendamento é obrigatória.");
            return false;
        }

        if (dataAgendamento.isBefore(LocalDate.now())) {
            System.out.println("Data de agendamento não pode estar no passado.");
            return false;
        }

        return true;
    }

    public static void imprimirOrdemServico(String certificado, LocalDate dataAgendamento) {
        System.out.println("Ordem de Serviço:");
        System.out.println("Certificado: " + certificado);
        System.out.println("Data: " + dataAgendamento);
    }
}
```

Aqui fica claro:

```text
normalização;
validação;
impressão.
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaRefatorada.java
```

Código:

```java
public class MensageriaRefatorada {
    public static void main(String[] args) {
        String cliente = normalizarNome(" ana ");
        String certificado = normalizarCertificado(" os-001 ");

        if (!dadosMensagemValidos(cliente, certificado)) {
            return;
        }

        String mensagem = montarMensagem(cliente, certificado);

        imprimirMensagem(mensagem);
    }

    public static String normalizarNome(String nome) {
        if (nome == null) {
            return "";
        }

        return nome.trim();
    }

    public static String normalizarCertificado(String certificado) {
        if (certificado == null) {
            return "";
        }

        return certificado.trim().toUpperCase();
    }

    public static boolean dadosMensagemValidos(String cliente, String certificado) {
        if (cliente.isBlank()) {
            System.out.println("Cliente é obrigatório.");
            return false;
        }

        if (certificado.isBlank()) {
            System.out.println("Certificado é obrigatório.");
            return false;
        }

        return true;
    }

    public static String montarMensagem(String cliente, String certificado) {
        return """
                Olá, %s.
                Sua OS %s está em acompanhamento.
                """.formatted(cliente, certificado);
    }

    public static void imprimirMensagem(String mensagem) {
        System.out.println(mensagem);
    }
}
```

Métodos pequenos deixam a mensagem mais fácil de mudar.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaRefatorada.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaRefatorada {
    public static void main(String[] args) {
        String usuario = normalizar(" aline ");
        String operacao = normalizar(" criacao ");
        String entidade = normalizar(" produto ");
        Long entidadeId = 10L;

        if (!auditoriaValida(usuario, operacao, entidade, entidadeId)) {
            return;
        }

        String registro = montarRegistroAuditoria(usuario, operacao, entidade, entidadeId, Instant.now());

        imprimirRegistro(registro);
    }

    public static String normalizar(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().toUpperCase();
    }

    public static boolean auditoriaValida(String usuario, String operacao, String entidade, Long entidadeId) {
        if (usuario.isBlank()) {
            System.out.println("Usuário é obrigatório.");
            return false;
        }

        if (operacao.isBlank()) {
            System.out.println("Operação é obrigatória.");
            return false;
        }

        if (entidade.isBlank()) {
            System.out.println("Entidade é obrigatória.");
            return false;
        }

        if (entidadeId == null || entidadeId <= 0) {
            System.out.println("ID da entidade deve ser maior que zero.");
            return false;
        }

        return true;
    }

    public static String montarRegistroAuditoria(
            String usuario,
            String operacao,
            String entidade,
            Long entidadeId,
            Instant criadoEm
    ) {
        return "AUDITORIA | usuario=%s | operacao=%s | entidade=%s | entidadeId=%d | criadoEm=%s"
                .formatted(usuario, operacao, entidade, entidadeId, criadoEm);
    }

    public static void imprimirRegistro(String registro) {
        System.out.println(registro);
    }
}
```

---

## Diferença entre extrair método e criar arquitetura

Nesta aula, estamos extraindo métodos.

Ainda não estamos criando arquitetura em camadas.

Não estamos criando:

```text
Controller;
Service;
Repository;
DTO;
Mapper;
UseCase;
Gateway.
```

Isso virá depois.

Agora a ideia é mais básica:

```text
não deixe tudo dentro do main.
```

Esse hábito será reaproveitado em todos os módulos futuros.

---

## Erros comuns

### Erro 1 — Extrair método sem nome claro

Ruim:

```java
fazer();
processar();
executar();
validarCoisas();
```

Melhor:

```java
calcularTotal();
validarProduto();
imprimirResumo();
normalizarNome();
```

---

### Erro 2 — Método faz coisas demais

Ruim:

```java
lerValidarCalcularEImprimirPedido()
```

O nome já denuncia excesso.

---

### Erro 3 — Parâmetros demais sem perceber

Muitos parâmetros podem indicar que falta agrupar dados em classe ou record.

Nesta aula, apenas observe.

Vamos evoluir isso depois.

---

### Erro 4 — Método sem retorno quando deveria retornar

Ruim:

```java
public static void calcularTotal(...) {
    System.out.println(total);
}
```

Melhor:

```java
public static BigDecimal calcularTotal(...) {
    return total;
}
```

---

### Erro 5 — Retornar boolean sem mensagem em regra complexa

Para validação simples, boolean pode bastar.

Para validações mais ricas, futuramente usaremos resultado mais expressivo.

---

### Erro 6 — Refatorar tudo de uma vez

Refatore em passos pequenos.

Depois de cada passo:

```text
compile;
execute;
verifique saída.
```

---

### Erro 7 — Mudar comportamento sem perceber

Refatoração deve preservar comportamento, salvo quando a mudança for intencional.

---

### Erro 8 — Não rodar depois da refatoração

Refatoração sem validação é risco.

---

### Erro 9 — Criar método para uma linha óbvia sem melhorar leitura

Nem toda linha precisa virar método.

---

### Erro 10 — Deixar main vazio e métodos confusos

Um `main` pequeno não adianta se os métodos extraídos continuam ruins.

---

## Debug recomendado

Use debug na versão refatorada.

Coloque breakpoints em:

```java
dadosValidos(...)
calcularTotal(...)
calcularDesconto(...)
aplicarDesconto(...)
imprimirResumo(...)
```

Observe:

```text
entrada de cada método;
retorno de cada método;
ordem de execução;
valores calculados;
quando o fluxo para;
quando o fluxo continua.
```

O debug ajuda a enxergar método como unidade de comportamento.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m3\aula-090-de-main-gigante-para-metodos-pequenos
cd labs\m3\aula-090-de-main-gigante-para-metodos-pequenos
```

Crie arquivos:

```text
MainGigante.java
PedidoRefatorado.java
CadastroClienteRefatorado.java
ProdutoRefatorado.java
PagamentoRefatorado.java
OrdemServicoRefatorada.java
MensageriaRefatorada.java
AuditoriaRefatorada.java
DebugMetodosPequenos.java
ErroMetodoFazTudo.java
ErroNomeGenerico.java
ErroSemRetorno.java
ErroParametrosDemais.java
ErroRefatoracaoSemValidar.java
README.md
```

Compile:

```powershell
javac MainGigante.java
javac PedidoRefatorado.java
javac CadastroClienteRefatorado.java
javac ProdutoRefatorado.java
javac PagamentoRefatorado.java
javac OrdemServicoRefatorada.java
javac MensageriaRefatorada.java
javac AuditoriaRefatorada.java
```

Execute:

```powershell
java MainGigante
java PedidoRefatorado
java CadastroClienteRefatorado
java ProdutoRefatorado
java PagamentoRefatorado
java OrdemServicoRefatorada
java MensageriaRefatorada
java AuditoriaRefatorada
```

Arquivos de erro ou leitura crítica:

```text
ErroMetodoFazTudo.java
ErroNomeGenerico.java
ErroSemRetorno.java
ErroParametrosDemais.java
ErroRefatoracaoSemValidar.java
```

---

## Arquivos

- `MainGigante.java`
- `PedidoRefatorado.java`
- `CadastroClienteRefatorado.java`
- `ProdutoRefatorado.java`
- `PagamentoRefatorado.java`
- `OrdemServicoRefatorada.java`
- `MensageriaRefatorada.java`
- `AuditoriaRefatorada.java`

## Observações

- Não extrair método sem melhorar leitura.
- Não criar método com nome genérico.
- Não esconder regra em método `void`.
- Não refatorar tudo de uma vez.
- Não mudar comportamento sem perceber.
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
git add labs/m3/aula-090-de-main-gigante-para-metodos-pequenos docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 090: refatora main gigante em metodos pequenos"
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
explicar o que é main gigante;
identificar sinais de main inchado;
explicar responsabilidade de método;
extrair método manualmente;
usar nome claro;
definir parâmetros necessários;
definir retorno adequado;
diferenciar método de cálculo e método de impressão;
usar void quando fizer sentido;
refatorar validação;
refatorar cálculo;
refatorar impressão;
preservar comportamento após refatoração;
compilar depois de cada mudança;
executar depois de cada mudança;
debugar chamadas de método;
aplicar refatoração em pedido;
aplicar refatoração em cliente;
aplicar refatoração em produto;
aplicar refatoração em pagamento;
aplicar refatoração em OS;
aplicar refatoração em mensageria;
aplicar refatoração em auditoria;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda criar classes de serviço.

Não precisa ainda usar orientação a objetos avançada.

Não precisa ainda criar testes automatizados.

Não precisa ainda usar JUnit.

Não precisa ainda usar Maven.

Não precisa ainda criar arquitetura em camadas.

Esses assuntos virão depois.

O objetivo desta aula é claro:

```text
parar de deixar tudo no main e começar a organizar comportamento em métodos pequenos.
```

---

## Fechamento da aula

Hoje iniciamos o Módulo 3 estudando como sair de um `main` gigante para métodos pequenos.

A ideia central foi:

```text
main deve coordenar; métodos devem carregar intenções menores e claras.
```

Vimos que:

```text
main gigante mistura responsabilidades;
comentários podem indicar métodos ausentes;
método pequeno precisa ter intenção;
nome bom reduz confusão;
parâmetros devem representar dependências do método;
retorno deve representar resultado;
void faz sentido para ações;
refatoração deve ser incremental;
comportamento precisa ser preservado;
debug ajuda a entender fluxo entre métodos.
```

O ponto mais importante é:

```text
organização começa antes de orientação a objetos.
```

Na próxima aula, vamos estudar:

```text
Assinatura de método profissional.
```

A próxima aula vai aprofundar nome, parâmetros, retorno, ordem, tipo, intenção, legibilidade e como desenhar métodos que comunicam melhor o que fazem.
