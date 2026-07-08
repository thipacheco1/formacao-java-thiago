# 098 — M3.09 — Reuso sem duplicação

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M3.09.01` — Reuso sem duplicação — Conceito profundo e quando usar.
- `M3.09.02` — Reuso sem duplicação — Implementação guiada com código realista.
- `M3.09.03` — Reuso sem duplicação — Refatoração, melhoria e leitura crítica.
- `M3.09.04` — Reuso sem duplicação — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar identificação de código repetido, extração segura, reaproveitamento, limites do reuso, diferença entre duplicação real e coincidência visual, risco de abstração artificial, nomes profissionais, refatoração incremental, leitura crítica e aplicação em cliente, produto, pedido, pagamento, OS, mensageria, auditoria e utilitários de console.

---

## Pré-requisito de ambiente

Esta aula não exige instalação nova.

Ela depende do ambiente validado no Módulo 0:

```text
JDK instalado;
IntelliJ IDEA Community configurado;
terminal funcionando;
Git funcionando;
repositório organizado.
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
terminal integrado funciona;
debug funciona;
renomear método/parâmetro está acessível;
extrair método está acessível;
introduzir variável está acessível;
localizar usos está acessível.
```

A prática desta aula será feita em:

```text
labs/m3/aula-098-reuso-sem-duplicacao
```

---

## Onde estamos na formação

Estamos no Módulo 3:

```text
Métodos, organização procedural e projetos console.
```

A sequência recente foi:

```text
094 — M3.05 — Retorno boolean para validação;
095 — M3.06 — Métodos de cálculo;
096 — M3.07 — Métodos de exibição;
097 — M3.08 — Métodos de leitura;
098 — M3.09 — Reuso sem duplicação.
```

Nas aulas anteriores, criamos vários métodos:

```text
lerTextoObrigatorio;
lerInteiro;
lerInteiroEntre;
lerBigDecimal;
imprimirCabecalho;
imprimirErro;
calcularTotalPedido;
valorPositivo;
textoInformado.
```

Naturalmente, começamos a perceber repetição.

Essa repetição é um sinal importante.

Mas o objetivo não é sair extraindo qualquer coisa de qualquer jeito.

O objetivo é:

```text
identificar duplicação real;
extrair com segurança;
dar nome bom;
não criar abstração artificial;
validar comportamento depois da refatoração.
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
098 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 98
Aulas oficiais restantes: 440
```

Contando o arquivo de abertura `000`, teremos:

```text
99 arquivos gerados no total.
```

---

## A pergunta central da aula

Quando este código deve virar método reutilizável?

```java
if (nome == null || nome.isBlank()) {
    System.out.println("Nome obrigatório.");
    return;
}
```

Se aparece uma vez, talvez não precise.

Se aparece em vários lugares:

```text
cliente;
produto;
certificado;
usuário;
entidade;
operação;
mensagem;
telefone.
```

provavelmente existe uma regra reutilizável:

```java
textoInformado(valor)
```

ou:

```java
lerTextoObrigatorio(scanner, prompt)
```

A pergunta central da aula é:

```text
como reutilizar código sem duplicação, mas também sem criar abstrações ruins?
```

---

## O que é duplicação

Duplicação é repetição de uma ideia, regra ou estrutura em mais de um lugar.

Exemplo simples:

```java
String nome = scanner.nextLine().trim();

if (nome.isBlank()) {
    System.out.println("Valor obrigatório.");
}
```

Se isso se repete para vários campos, temos duplicação.

Outro exemplo:

```java
System.out.println("====================================");
System.out.println(titulo);
System.out.println("====================================");
```

Se aparece em vários arquivos, pode virar:

```java
imprimirCabecalho(titulo)
```

Duplicação pode acontecer em:

```text
leitura;
validação;
cálculo;
exibição;
formatação;
mensagens;
conversão;
comparação;
tratamento de erro.
```

---

## Duplicação real versus coincidência visual

Nem toda repetição visual é duplicação real.

Exemplo:

```java
cliente.trim().toUpperCase()
certificado.trim().toUpperCase()
```

Visualmente parecem iguais.

Mas semanticamente podem ser regras diferentes:

```text
normalizar nome de cliente;
normalizar certificado de OS.
```

Hoje a regra é igual.

Amanhã pode mudar:

```text
cliente pode manter acento e espaço composto;
certificado pode remover hífen e sempre ficar sem espaço.
```

Se você criar um método genérico cedo demais:

```java
normalizarTexto(valor)
```

talvez amarre regras que deveriam evoluir separadas.

Duplicação real é quando a intenção também é a mesma.

---

## A pergunta antes de reutilizar

Antes de extrair, pergunte:

```text
isso é a mesma regra ou apenas código parecido?
```

Exemplo:

```java
textoInformado(nome)
textoInformado(email)
textoInformado(certificado)
```

Aqui a regra é a mesma:

```text
texto não pode ser null nem blank.
```

Boa reutilização.

Exemplo diferente:

```java
normalizarNomeCliente
normalizarCertificadoOs
```

Mesmo que hoje usem `trim`, talvez não devam ser unificados.

---

## Por que duplicação é problema

Duplicação causa:

```text
mudança em vários lugares;
risco de esquecer um ponto;
comportamento inconsistente;
mais código para ler;
mais bugs;
mais esforço de teste;
mais dificuldade de manutenção;
mais chance de regra divergente.
```

Exemplo:

```text
em um lugar aceita valor zero;
em outro não aceita;
em um lugar usa vírgula;
em outro não;
em um lugar trata null;
em outro quebra.
```

Quando a regra deveria ser a mesma, a duplicação vira risco real.

---

## Por que reuso mal feito também é problema

Reuso exagerado cria abstração artificial.

Exemplo ruim:

```java
public static String processarTexto(String valor, boolean maiusculo, boolean removerEspacos, boolean obrigatorio) {
}
```

Esse método tenta servir para tudo.

Resultado:

```text
assinatura confusa;
booleans misteriosos;
regra difícil de entender;
método genérico demais;
mudança em uma regra quebra outra.
```

Reuso bom reduz duplicação sem destruir clareza.

Reuso ruim junta coisas que deveriam ficar separadas.

---

## Regra prática

Use este equilíbrio:

```text
duplicação pequena e temporária pode ser aceitável;
duplicação de regra importante deve ser extraída;
duplicação visual sem mesma intenção deve ser analisada;
reuso precisa melhorar leitura;
reuso não pode esconder responsabilidade.
```

Não seja refém de frases prontas.

Nem:

```text
nunca duplique nada.
```

Nem:

```text
duplicação não importa.
```

O correto é julgamento técnico.

---

## Exemplo inicial ruim: validação duplicada

Arquivo:

```text
DuplicacaoValidacaoRuim.java
```

Código:

```java
public class DuplicacaoValidacaoRuim {
    public static void main(String[] args) {
        String nomeCliente = "Ana";
        String emailCliente = "ana@email.com";
        String nomeProduto = "Cadeira";
        String certificadoOs = "OS-001";

        if (nomeCliente == null || nomeCliente.isBlank()) {
            System.out.println("Nome do cliente obrigatório.");
            return;
        }

        if (emailCliente == null || emailCliente.isBlank()) {
            System.out.println("E-mail obrigatório.");
            return;
        }

        if (nomeProduto == null || nomeProduto.isBlank()) {
            System.out.println("Nome do produto obrigatório.");
            return;
        }

        if (certificadoOs == null || certificadoOs.isBlank()) {
            System.out.println("Certificado obrigatório.");
            return;
        }

        System.out.println("Dados válidos.");
    }
}
```

Há duplicação clara:

```java
valor == null || valor.isBlank()
```

A regra é a mesma:

```text
texto precisa estar informado.
```

---

## Refatoração: extraindo textoInformado

Arquivo:

```text
ReusoValidacaoTexto.java
```

Código:

```java
public class ReusoValidacaoTexto {
    public static void main(String[] args) {
        String nomeCliente = "Ana";
        String emailCliente = "ana@email.com";
        String nomeProduto = "Cadeira";
        String certificadoOs = "OS-001";

        if (!textoInformado(nomeCliente)) {
            System.out.println("Nome do cliente obrigatório.");
            return;
        }

        if (!textoInformado(emailCliente)) {
            System.out.println("E-mail obrigatório.");
            return;
        }

        if (!textoInformado(nomeProduto)) {
            System.out.println("Nome do produto obrigatório.");
            return;
        }

        if (!textoInformado(certificadoOs)) {
            System.out.println("Certificado obrigatório.");
            return;
        }

        System.out.println("Dados válidos.");
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Melhorou porque:

```text
a regra foi centralizada;
o nome comunica intenção;
cada if ficou mais legível;
se a regra mudar, muda em um ponto.
```

---

## Exemplo ruim: exibição duplicada

Arquivo:

```text
DuplicacaoExibicaoRuim.java
```

Código:

```java
public class DuplicacaoExibicaoRuim {
    public static void main(String[] args) {
        System.out.println("====================================");
        System.out.println("CLIENTE");
        System.out.println("====================================");
        System.out.println("Nome: Ana");
        System.out.println("------------------------------------");

        System.out.println("====================================");
        System.out.println("PRODUTO");
        System.out.println("====================================");
        System.out.println("Nome: Cadeira");
        System.out.println("------------------------------------");

        System.out.println("====================================");
        System.out.println("PEDIDO");
        System.out.println("====================================");
        System.out.println("Total: 100.00");
        System.out.println("------------------------------------");
    }
}
```

Há repetição de cabeçalho e separador.

---

## Refatoração: extraindo métodos de exibição

Arquivo:

```text
ReusoExibicao.java
```

Código:

```java
public class ReusoExibicao {
    public static void main(String[] args) {
        imprimirCabecalho("CLIENTE");
        System.out.println("Nome: Ana");
        imprimirSeparador();

        imprimirCabecalho("PRODUTO");
        System.out.println("Nome: Cadeira");
        imprimirSeparador();

        imprimirCabecalho("PEDIDO");
        System.out.println("Total: 100.00");
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
}
```

Melhorou porque:

```text
layout repetido ficou centralizado;
mudar estilo do cabeçalho exige alteração em um ponto;
o main ficou mais curto;
a intenção ficou clara.
```

---

## Exemplo ruim: leitura duplicada

Arquivo:

```text
DuplicacaoLeituraRuim.java
```

Código:

```java
import java.util.Scanner;

public class DuplicacaoLeituraRuim {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Nome: ");
        String nome = scanner.nextLine().trim();

        while (nome.isBlank()) {
            System.out.println("Valor obrigatório.");
            System.out.print("Nome: ");
            nome = scanner.nextLine().trim();
        }

        System.out.print("Produto: ");
        String produto = scanner.nextLine().trim();

        while (produto.isBlank()) {
            System.out.println("Valor obrigatório.");
            System.out.print("Produto: ");
            produto = scanner.nextLine().trim();
        }

        System.out.println("Nome: " + nome);
        System.out.println("Produto: " + produto);
    }
}
```

Aqui há duplicação de leitura obrigatória.

---

## Refatoração: extraindo lerTextoObrigatorio

Arquivo:

```text
ReusoLeitura.java
```

Código:

```java
import java.util.Scanner;

public class ReusoLeitura {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String nome = lerTextoObrigatorio(scanner, "Nome: ");
        String produto = lerTextoObrigatorio(scanner, "Produto: ");

        System.out.println("Nome: " + nome);
        System.out.println("Produto: " + produto);
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
}
```

Este é reuso bom.

A regra é a mesma:

```text
ler texto obrigatório.
```

---

## Exemplo ruim: cálculo duplicado

Arquivo:

```text
DuplicacaoCalculoRuim.java
```

Código:

```java
import java.math.BigDecimal;

public class DuplicacaoCalculoRuim {
    public static void main(String[] args) {
        BigDecimal precoPedido1 = new BigDecimal("100.00");
        int quantidadePedido1 = 2;
        BigDecimal totalPedido1 = precoPedido1.multiply(BigDecimal.valueOf(quantidadePedido1));

        BigDecimal precoPedido2 = new BigDecimal("50.00");
        int quantidadePedido2 = 3;
        BigDecimal totalPedido2 = precoPedido2.multiply(BigDecimal.valueOf(quantidadePedido2));

        BigDecimal precoPedido3 = new BigDecimal("10.00");
        int quantidadePedido3 = 5;
        BigDecimal totalPedido3 = precoPedido3.multiply(BigDecimal.valueOf(quantidadePedido3));

        System.out.println("Total 1: " + totalPedido1);
        System.out.println("Total 2: " + totalPedido2);
        System.out.println("Total 3: " + totalPedido3);
    }
}
```

A regra repetida é:

```java
preco.multiply(BigDecimal.valueOf(quantidade))
```

---

## Refatoração: extraindo calcularTotal

Arquivo:

```text
ReusoCalculo.java
```

Código:

```java
import java.math.BigDecimal;

public class ReusoCalculo {
    public static void main(String[] args) {
        BigDecimal totalPedido1 = calcularTotalPedido(new BigDecimal("100.00"), 2);
        BigDecimal totalPedido2 = calcularTotalPedido(new BigDecimal("50.00"), 3);
        BigDecimal totalPedido3 = calcularTotalPedido(new BigDecimal("10.00"), 5);

        System.out.println("Total 1: " + totalPedido1);
        System.out.println("Total 2: " + totalPedido2);
        System.out.println("Total 3: " + totalPedido3);
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        if (precoUnitario == null) {
            throw new IllegalArgumentException("Preço unitário obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}
```

Agora a regra tem nome.

Se amanhã total do pedido considerar taxa, a regra muda em um ponto.

---

## Exemplo aplicado: cliente

Arquivo:

```text
ClienteReuso.java
```

Código:

```java
public class ClienteReuso {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Ana", "ana@email.com", "11999999999");

        if (!clienteValido(cliente)) {
            imprimirErro("Cliente inválido.");
            return;
        }

        imprimirCliente(cliente);
    }

    public static boolean clienteValido(Cliente cliente) {
        return cliente != null
                && textoInformado(cliente.nome())
                && emailValido(cliente.email())
                && textoInformado(cliente.telefone());
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean emailValido(String email) {
        return textoInformado(email) && email.contains("@");
    }

    public static void imprimirCliente(Cliente cliente) {
        imprimirCabecalho("CLIENTE");
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record Cliente(String nome, String email, String telefone) {
}
```

Reuso aplicado:

```text
textoInformado;
emailValido;
imprimirCabecalho;
imprimirSeparador;
imprimirErro.
```

---

## Exemplo aplicado: produto

Arquivo:

```text
ProdutoReuso.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoReuso {
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
        imprimirCabecalho("PRODUTO");
        System.out.println("Nome: " + produto.nome());
        System.out.println("Preço: " + produto.preco());
        System.out.println("Estoque: " + produto.estoque());
        System.out.println("Valor em estoque: " + valorEstoque);
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record Produto(String nome, BigDecimal preco, int estoque) {
}
```

---

## Exemplo aplicado: pedido

Arquivo:

```text
PedidoReuso.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoReuso {
    public static void main(String[] args) {
        Pedido pedido = new Pedido("Ana", "Cadeira", new BigDecimal("199.90"), 2);

        if (!pedidoValido(pedido)) {
            imprimirErro("Pedido inválido.");
            return;
        }

        BigDecimal totalBruto = calcularTotalPedido(pedido.precoUnitario(), pedido.quantidade());
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        imprimirResumoPedido(pedido, totalBruto, desconto, totalFinal);
    }

    public static boolean pedidoValido(Pedido pedido) {
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

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
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

    public static void imprimirResumoPedido(
            Pedido pedido,
            BigDecimal totalBruto,
            BigDecimal desconto,
            BigDecimal totalFinal
    ) {
        imprimirCabecalho("PEDIDO");
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Total bruto: " + totalBruto);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

record Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
}
```

---

## Exemplo aplicado: pagamento

Arquivo:

```text
PagamentoReuso.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoReuso {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento("PAG-001", new BigDecimal("100.00"), FormaPagamento.PIX);

        if (!pagamentoValido(pagamento)) {
            imprimirErro("Pagamento inválido.");
            return;
        }

        imprimirPagamento(pagamento);
    }

    public static boolean pagamentoValido(Pagamento pagamento) {
        return pagamento != null
                && textoInformado(pagamento.codigo())
                && valorPositivo(pagamento.valor())
                && pagamento.forma() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static void imprimirPagamento(Pagamento pagamento) {
        imprimirCabecalho("PAGAMENTO");
        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor: " + pagamento.valor());
        System.out.println("Forma: " + pagamento.forma());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record Pagamento(String codigo, BigDecimal valor, FormaPagamento forma) {
}
```

---

## Exemplo aplicado: OS

Arquivo:

```text
OsReuso.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OsReuso {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico("OS-001", LocalDate.now().minusDays(5), StatusOs.AGENDADA);

        if (!osValida(os)) {
            imprimirErro("OS inválida.");
            return;
        }

        long diasEmAberto = calcularDiasEmAberto(os.dataAbertura(), LocalDate.now());

        imprimirOs(os, diasEmAberto);
    }

    public static boolean osValida(OrdemServico os) {
        return os != null
                && textoInformado(os.certificado())
                && os.dataAbertura() != null
                && os.status() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static long calcularDiasEmAberto(LocalDate dataAbertura, LocalDate dataReferencia) {
        return ChronoUnit.DAYS.between(dataAbertura, dataReferencia);
    }

    public static void imprimirOs(OrdemServico os, long diasEmAberto) {
        imprimirCabecalho("ORDEM DE SERVIÇO");
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Status: " + os.status());
        System.out.println("Data abertura: " + os.dataAbertura());
        System.out.println("Dias em aberto: " + diasEmAberto);
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

record OrdemServico(String certificado, LocalDate dataAbertura, StatusOs status) {
}
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaReuso.java
```

Código:

```java
public class MensageriaReuso {
    public static void main(String[] args) {
        DadosMensagem dados = new DadosMensagem("Ana", "11999999999", TipoMensagem.ENTREGA, true);

        if (!podeEnviarMensagem(dados)) {
            imprimirErro("Mensagem não pode ser enviada.");
            return;
        }

        String mensagem = montarMensagem(dados);

        imprimirMensagem(mensagem);
    }

    public static boolean podeEnviarMensagem(DadosMensagem dados) {
        return dados != null
                && textoInformado(dados.cliente())
                && textoInformado(dados.telefone())
                && dados.tipo() != null
                && dados.optIn();
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static String montarMensagem(DadosMensagem dados) {
        return "Olá, %s. Acompanhamento da mensagem %s."
                .formatted(dados.cliente(), dados.tipo());
    }

    public static void imprimirMensagem(String mensagem) {
        imprimirCabecalho("MENSAGEM");
        System.out.println(mensagem);
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}

record DadosMensagem(String cliente, String telefone, TipoMensagem tipo, boolean optIn) {
}
```

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaReuso.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaReuso {
    public static void main(String[] args) {
        RegistroAuditoria auditoria = new RegistroAuditoria(
                "aline",
                OperacaoAuditoria.CRIACAO,
                "Produto",
                10L,
                Instant.now()
        );

        if (!auditoriaValida(auditoria)) {
            imprimirErro("Auditoria inválida.");
            return;
        }

        imprimirAuditoria(auditoria);
    }

    public static boolean auditoriaValida(RegistroAuditoria auditoria) {
        return auditoria != null
                && textoInformado(auditoria.usuario())
                && auditoria.operacao() != null
                && textoInformado(auditoria.entidade())
                && idPositivo(auditoria.entidadeId())
                && auditoria.criadoEm() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean idPositivo(Long id) {
        return id != null && id > 0;
    }

    public static void imprimirAuditoria(RegistroAuditoria auditoria) {
        imprimirCabecalho("AUDITORIA");
        System.out.println("Usuário: " + auditoria.usuario());
        System.out.println("Operação: " + auditoria.operacao());
        System.out.println("Entidade: " + auditoria.entidade());
        System.out.println("Entidade ID: " + auditoria.entidadeId());
        System.out.println("Criado em: " + auditoria.criadoEm());
        imprimirSeparador();
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }
}

enum OperacaoAuditoria {
    CRIACAO,
    EDICAO,
    EXCLUSAO
}

record RegistroAuditoria(
        String usuario,
        OperacaoAuditoria operacao,
        String entidade,
        Long entidadeId,
        Instant criadoEm
) {
}
```

---

## Criando utilitários com cuidado

Quando vários arquivos repetem os mesmos métodos, podemos criar uma classe utilitária.

Exemplo:

```text
ConsoleView;
ConsoleInput;
Validacoes;
Calculos.
```

Mas cuidado.

Utilitário genérico demais pode virar depósito de tudo.

Ruim:

```text
Utils.java
```

com:

```text
validarCliente;
calcularPedido;
imprimirMenu;
lerInteiro;
formatarData;
enviarMensagem;
salvarArquivo.
```

Isso vira bagunça.

Melhor:

```text
ConsoleInput -> leitura;
ConsoleView -> exibição;
ValidacoesBasicas -> validações simples;
CalculosPedido -> cálculos de pedido.
```

Mesmo em utilitário, responsabilidade importa.

---

## Exemplo: ValidacoesBasicas

Arquivo:

```text
ValidacoesBasicas.java
```

Código:

```java
import java.math.BigDecimal;

public final class ValidacoesBasicas {
    private ValidacoesBasicas() {
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static boolean valorPositivo(BigDecimal valor) {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public static boolean idPositivo(Long id) {
        return id != null && id > 0;
    }
}
```

Uso:

```java
if (!ValidacoesBasicas.textoInformado(nome)) {
    System.out.println("Nome obrigatório.");
}
```

Essa classe tem responsabilidade clara:

```text
validações básicas.
```

---

## Exemplo: ConsoleView

Arquivo:

```text
ConsoleView.java
```

Código:

```java
public final class ConsoleView {
    private ConsoleView() {
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("==== " + titulo + " ====");
    }

    public static void imprimirSeparador() {
        System.out.println("-------------------------");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }

    public static void imprimirSucesso(String mensagem) {
        System.out.println("[SUCESSO] " + mensagem);
    }
}
```

Responsabilidade:

```text
exibição padronizada no console.
```

---

## Exemplo: CalculosPedido

Arquivo:

```text
CalculosPedido.java
```

Código:

```java
import java.math.BigDecimal;

public final class CalculosPedido {
    private CalculosPedido() {
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        if (precoUnitario == null) {
            throw new IllegalArgumentException("Preço unitário obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDesconto(BigDecimal totalBruto) {
        if (totalBruto == null) {
            throw new IllegalArgumentException("Total bruto obrigatório.");
        }

        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal totalBruto, BigDecimal desconto) {
        if (totalBruto == null || desconto == null) {
            throw new IllegalArgumentException("Total bruto e desconto são obrigatórios.");
        }

        return totalBruto.subtract(desconto);
    }
}
```

Responsabilidade:

```text
cálculos de pedido.
```

Não coloque leitura e impressão aqui.

---

## Teste manual de reuso

Arquivo:

```text
TesteManualReuso.java
```

Código:

```java
import java.math.BigDecimal;

public class TesteManualReuso {
    public static void main(String[] args) {
        testarTextoInformado();
        testarValorPositivo();
        testarCalculoTotalPedido();

        System.out.println("Testes manuais de reuso finalizados.");
    }

    public static void testarTextoInformado() {
        conferir(true, ValidacoesBasicas.textoInformado("Ana"), "texto informado");
        conferir(false, ValidacoesBasicas.textoInformado("   "), "texto em branco");
        conferir(false, ValidacoesBasicas.textoInformado(null), "texto null");
    }

    public static void testarValorPositivo() {
        conferir(true, ValidacoesBasicas.valorPositivo(new BigDecimal("1.00")), "valor positivo");
        conferir(false, ValidacoesBasicas.valorPositivo(BigDecimal.ZERO), "valor zero");
        conferir(false, ValidacoesBasicas.valorPositivo(null), "valor null");
    }

    public static void testarCalculoTotalPedido() {
        BigDecimal total = CalculosPedido.calcularTotalPedido(new BigDecimal("10.00"), 3);

        if (total.compareTo(new BigDecimal("30.00")) != 0) {
            throw new IllegalStateException("total pedido esperado=30.00 atual=" + total);
        }
    }

    public static void conferir(boolean esperado, boolean atual, String nome) {
        if (esperado != atual) {
            throw new IllegalStateException(nome + " | esperado=" + esperado + " | atual=" + atual);
        }
    }
}
```

Compile junto:

```powershell
javac ValidacoesBasicas.java CalculosPedido.java TesteManualReuso.java
```

Execute:

```powershell
java TesteManualReuso
```

---

## Limites do reuso

Reuso tem limite.

Exemplo ruim:

```java
public static boolean validarTudo(Object valor) {
}
```

Isso não é bom.

Por quê?

```text
perde tipo;
perde intenção;
perde clareza;
aumenta if interno;
fica difícil de manter;
esconde regras diferentes.
```

Outro exemplo ruim:

```java
public static void executarOperacao(String tipo, Object dados) {
}
```

Isso vira método genérico demais.

Reuso bom é específico o bastante para ser entendido.

---

## Sinais de abstração artificial

Uma abstração pode estar artificial quando:

```text
o nome é genérico demais;
há muitos parâmetros booleanos;
há muitos ifs internos por tipo;
o método recebe Object;
a chamada não fica mais clara;
regras diferentes foram unidas à força;
mudar uma regra quebra outra;
ninguém entende o que o método faz sem abrir o corpo.
```

Exemplo de nome suspeito:

```text
processar;
gerenciar;
executar;
util;
helper;
tratarTudo.
```

Esses nomes podem ser usados em alguns contextos, mas frequentemente escondem falta de intenção.

---

## Regra dos três usos

Uma heurística comum:

```text
se apareceu uma vez, talvez não extraia;
se apareceu duas vezes, observe;
se apareceu três vezes, considere extrair.
```

Não é lei.

Mas ajuda.

Em aula, às vezes extraímos antes para ensinar.

Em projeto real, às vezes esperamos um pouco para entender melhor a regra.

---

## Extração segura

Passos:

```text
1. Identifique repetição.
2. Confirme se é a mesma intenção.
3. Escolha nome claro.
4. Crie método pequeno.
5. Substitua uma ocorrência.
6. Compile.
7. Execute.
8. Substitua a próxima.
9. Compile.
10. Execute.
11. Revise se o código ficou melhor.
```

Não extraia tudo de uma vez.

Refatoração segura é incremental.

---

## Usando a IDE

O IntelliJ pode ajudar com:

```text
Extract Method;
Rename;
Find Usages;
Change Signature;
Inline Method.
```

Mas a IDE não decide por você.

Ela ajuda a executar.

A decisão técnica é sua.

Pergunte:

```text
isso melhorou leitura?
isso reduziu risco?
o nome ficou claro?
a regra é realmente a mesma?
```

---

## Erros comuns

### Erro 1 — Extrair só porque visualmente parece igual

Pode unir regras diferentes.

### Erro 2 — Criar Utils gigante

`Utils` vira depósito de bagunça.

### Erro 3 — Criar método genérico demais

```java
processar(Object dados)
```

### Erro 4 — Usar boolean misterioso para reuso

```java
formatar(valor, true, false)
```

### Erro 5 — Esconder regra de negócio em helper genérico

A regra perde nome de domínio.

### Erro 6 — Refatorar tudo de uma vez

Difícil saber onde quebrou.

### Erro 7 — Não compilar depois da extração

Sempre compile.

### Erro 8 — Não executar depois da extração

Sempre execute.

### Erro 9 — Criar abstração que ninguém usa

Reuso inútil complica.

### Erro 10 — Achar que zero duplicação é sempre o objetivo

O objetivo é clareza, segurança e manutenção.

---

## Diagnóstico

Ao ver duplicação, pergunte:

```text
1. O código repetido representa a mesma regra?
2. A intenção é a mesma?
3. O nome do método é óbvio?
4. A extração reduz risco?
5. A extração melhora leitura?
6. Há parâmetros demais?
7. Há boolean misterioso?
8. A regra pode mudar separadamente?
9. O método criado ficou coeso?
10. O comportamento foi preservado?
```

Se não melhorar, não extraia.

Ou extraia de outro jeito.

---

## Debug recomendado

Use debug em:

```text
ReusoCalculo.java
```

Coloque breakpoints em:

```java
calcularTotalPedido(...)
```

Observe:

```text
precoUnitario recebido;
quantidade recebida;
retorno;
uso em vários pedidos.
```

Use debug em:

```text
ReusoLeitura.java
```

Observe:

```text
prompt recebido;
linha digitada;
loop quando em branco;
return quando válido.
```

Use debug em:

```text
TesteManualReuso.java
```

Observe:

```text
uso de ValidacoesBasicas;
uso de CalculosPedido;
falha quando esperado e atual diferem.
```

---

## Quebrando de propósito

Faça estes testes:

### Teste 1 — unificar regras diferentes

Crie um método único:

```java
normalizarTexto
```

para cliente e certificado.

Depois imagine que certificado deve remover hífen e cliente não.

Explique o problema.

### Teste 2 — criar Utils gigante

Crie:

```java
Utils.java
```

com validação, cálculo e exibição.

Explique por que perdeu responsabilidade.

### Teste 3 — reuso com boolean misterioso

Crie:

```java
formatarTexto(valor, true)
```

Explique por que a chamada não é clara.

### Teste 4 — extrair método e não rodar

Faça uma extração errada e veja como o erro só aparece ao compilar/executar.

### Teste 5 — método genérico demais

Crie:

```java
processar(Object valor)
```

Explique por que perdeu tipo e intenção.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m3\aula-098-reuso-sem-duplicacao
cd labs\m3\aula-098-reuso-sem-duplicacao
```

Crie arquivos:

```text
DuplicacaoValidacaoRuim.java
ReusoValidacaoTexto.java
DuplicacaoExibicaoRuim.java
ReusoExibicao.java
DuplicacaoLeituraRuim.java
ReusoLeitura.java
DuplicacaoCalculoRuim.java
ReusoCalculo.java
ClienteReuso.java
ProdutoReuso.java
PedidoReuso.java
PagamentoReuso.java
OsReuso.java
MensageriaReuso.java
AuditoriaReuso.java
ValidacoesBasicas.java
ConsoleView.java
CalculosPedido.java
TesteManualReuso.java
ErroAbstracaoArtificial.java
ErroUtilsGigante.java
ErroDuplicacaoVisualNaoSemantica.java
ErroBooleanMisteriosoNoReuso.java
ErroRefatoracaoSemRodar.java
README.md
```

Compile exemplos principais:

```powershell
javac DuplicacaoValidacaoRuim.java
javac ReusoValidacaoTexto.java
javac DuplicacaoExibicaoRuim.java
javac ReusoExibicao.java
javac DuplicacaoLeituraRuim.java
javac ReusoLeitura.java
javac DuplicacaoCalculoRuim.java
javac ReusoCalculo.java
```

Compile exemplos aplicados:

```powershell
javac ClienteReuso.java
javac ProdutoReuso.java
javac PedidoReuso.java
javac PagamentoReuso.java
javac OsReuso.java
javac MensageriaReuso.java
javac AuditoriaReuso.java
```

Compile utilitários e teste manual:

```powershell
javac ValidacoesBasicas.java ConsoleView.java CalculosPedido.java TesteManualReuso.java
```

Execute:

```powershell
java ReusoValidacaoTexto
java ReusoExibicao
java ReusoCalculo
java ClienteReuso
java ProdutoReuso
java PedidoReuso
java PagamentoReuso
java OsReuso
java MensageriaReuso
java AuditoriaReuso
java TesteManualReuso
```

Os exemplos com leitura exigem interação:

```powershell
java ReusoLeitura
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 098 — Reuso sem duplicação

## Objetivo

Aprender a identificar código repetido, diferenciar duplicação real de coincidência visual e extrair métodos reutilizáveis com segurança, sem criar abstrações artificiais.

## Conceitos

- Duplicação é repetição de regra, intenção ou estrutura.
- Nem toda repetição visual é duplicação real.
- Reuso bom melhora leitura e reduz risco.
- Reuso ruim cria abstração artificial.
- Extração deve ser incremental.
- Métodos reutilizáveis precisam de nome claro.
- Utils gigante é cheiro de código.
- ValidacoesBasicas, ConsoleView e CalculosPedido são exemplos de responsabilidades separadas.
- A regra precisa ser a mesma para merecer reuso.
- Depois de refatorar, compile e execute.

## Comandos

```powershell
javac ReusoCalculo.java
java ReusoCalculo
javac ValidacoesBasicas.java CalculosPedido.java TesteManualReuso.java
java TesteManualReuso
```
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Project | `Alt + 1` | Navegar arquivos |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extract Method | ação da IDE | Extrair duplicação |
| Inline Method | ação da IDE | Desfazer abstração ruim |
| Find Usages | ação da IDE | Ver onde método é usado |
| Change Signature | ação da IDE | Ajustar parâmetros |
| Debug | `Shift + F9` | Observar reuso |
| Step Into | `F7` em muitos keymaps | Entrar no método reutilizado |
| Step Over | `F8` em muitos keymaps | Avançar |
| Compilar | `javac Arquivo.java` | Validar |
| Executar | `java Classe` | Testar comportamento |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 098 — Reuso sem duplicação

### O que aprendi

Aprendi que duplicação deve ser avaliada pela intenção, não só pela aparência visual. Também aprendi que reuso bom reduz risco e melhora leitura, mas reuso ruim cria abstrações artificiais.

### O que pratiquei

Refatorei duplicação de validação, exibição, leitura e cálculo. Criei métodos reutilizáveis e classes simples como `ValidacoesBasicas`, `ConsoleView` e `CalculosPedido`.

### Conceitos principais

- duplicação
- reuso
- duplicação real
- coincidência visual
- extração segura
- abstração artificial
- Utils gigante
- método reutilizável
- responsabilidade
- coesão
- nome claro
- Find Usages
- Extract Method
- Inline Method
- teste manual
- compile e execute

### Arquivos criados

- `labs/m3/aula-098-reuso-sem-duplicacao/DuplicacaoValidacaoRuim.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ReusoValidacaoTexto.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/DuplicacaoExibicaoRuim.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ReusoExibicao.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/DuplicacaoLeituraRuim.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ReusoLeitura.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/DuplicacaoCalculoRuim.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ReusoCalculo.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ClienteReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ProdutoReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/PedidoReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/PagamentoReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/OsReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/MensageriaReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/AuditoriaReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ValidacoesBasicas.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/ConsoleView.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/CalculosPedido.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/TesteManualReuso.java`
- `labs/m3/aula-098-reuso-sem-duplicacao/README.md`

### Comandos usados

```powershell
javac ReusoCalculo.java
java ReusoCalculo
javac ClienteReuso.java
java ClienteReuso
javac ValidacoesBasicas.java CalculosPedido.java TesteManualReuso.java
java TesteManualReuso
```

### Erros que quero evitar

- extrair só porque o código parece igual;
- unir regras que podem mudar separadamente;
- criar Utils gigante;
- criar método genérico demais;
- usar Object sem necessidade;
- usar boolean misterioso para reaproveitar;
- refatorar tudo de uma vez;
- não compilar depois da extração;
- não executar depois da extração;
- achar que zero duplicação é sempre melhor que clareza.
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
git add labs/m3/aula-098-reuso-sem-duplicacao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 098: pratica reuso sem duplicacao"
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
1. O que é duplicação?
2. Por que duplicação pode ser problema?
3. O que é duplicação real?
4. O que é coincidência visual?
5. Por que nem todo código parecido deve ser unificado?
6. O que é reuso bom?
7. O que é reuso ruim?
8. O que é abstração artificial?
9. Por que Utils gigante é ruim?
10. Quando extrair método?
11. Quando não extrair método?
12. O que é regra dos três usos?
13. Por que extração deve ser incremental?
14. Por que compilar depois de refatorar?
15. Por que executar depois de refatorar?
16. Como aplicar reuso em validação?
17. Como aplicar reuso em exibição?
18. Como aplicar reuso em leitura?
19. Como aplicar reuso em cálculo?
20. Qual duplicação você removeu nesta aula e por quê?
```

---

## Critério de aprovação

Esta aula está concluída quando a pessoa consegue:

```text
explicar duplicação;
diferenciar duplicação real de coincidência visual;
identificar repetição de validação;
identificar repetição de exibição;
identificar repetição de leitura;
identificar repetição de cálculo;
extrair método com nome claro;
evitar abstração artificial;
evitar Utils gigante;
criar ValidacoesBasicas;
criar ConsoleView;
criar CalculosPedido;
usar método reutilizável em mais de um lugar;
usar Find Usages quando aplicável;
usar Extract Method com revisão;
usar Inline Method quando abstração piorar;
compilar depois da refatoração;
executar depois da refatoração;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda aplicar design patterns.

Não precisa ainda usar herança.

Não precisa ainda usar interfaces.

Não precisa ainda usar generics avançado.

Não precisa ainda usar arquitetura em camadas.

Não precisa ainda perseguir zero duplicação.

Esses assuntos virão depois.

O objetivo é:

```text
reutilizar código com critério, sem transformar clareza em abstração artificial.
```

---

## Fechamento

Hoje estudamos reuso sem duplicação.

A ideia central foi:

```text
duplicação deve ser removida quando representa a mesma intenção, não apenas quando o código parece igual.
```

Vimos que:

```text
duplicação real aumenta risco;
coincidência visual exige cuidado;
reuso bom melhora leitura;
reuso ruim cria abstração artificial;
Utils gigante vira bagunça;
extração precisa de nome claro;
refatoração deve ser incremental;
depois de extrair, compile e execute;
zero duplicação não é mais importante que clareza.
```

O ponto mais importante é:

```text
o melhor reuso é aquele que dá nome para uma regra real e reduz risco sem esconder intenção.
```

Na próxima aula, vamos estudar:

```text
Debug entrando em métodos.
```

A próxima aula vai aprofundar `step into`, `step out`, call stack, fluxo de chamada e como investigar bugs quando métodos começam a chamar outros métodos.
