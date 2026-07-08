# 093 — M3.04 — Parâmetros demais e alternativas

## A pergunta central da aula

Qual chamada é mais fácil de entender?

```java
imprimirResumo("Ana", "Cadeira", new BigDecimal("199.90"), 2, new BigDecimal("399.80"), new BigDecimal("39.98"), new BigDecimal("359.82"));
```

ou:

```java
ResumoPedido resumo = new ResumoPedido(
        "Ana",
        "Cadeira",
        new BigDecimal("199.90"),
        2,
        new BigDecimal("399.80"),
        new BigDecimal("39.98"),
        new BigDecimal("359.82")
);

imprimirResumo(resumo);
```

As duas podem funcionar.

Mas a primeira tem um problema:

```text
quem lê precisa contar posição por posição para entender o que cada valor significa.
```

A segunda começa a agrupar dados relacionados.

A pergunta central da aula é:

```text
quando parâmetros demais viram problema e quais alternativas simples podemos usar?
```

---

## O que são parâmetros demais

Parâmetros demais acontecem quando um método exige muitos dados soltos para funcionar.

Exemplo:

```java
public static void imprimirResumoPedido(
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

Esse método tem 7 parâmetros.

Isso não é automaticamente proibido.

Mas é um alerta.

Porque muitos parâmetros podem indicar:

```text
dados relacionados que deveriam estar agrupados;
método fazendo coisa demais;
assinatura difícil de ler;
ordem perigosa;
chamadas fáceis de errar;
duplicação de grupos de dados;
falta de um conceito no código.
```

---

## Parâmetro demais é cheiro de código

Cheiro de código não significa erro de compilação.

O código pode compilar e rodar.

Mas ele indica que algo pode estar ficando difícil de manter.

Parâmetros demais são um cheiro porque:

```text
a chamada fica longa;
a ordem importa demais;
dois parâmetros do mesmo tipo podem ser trocados sem o compilador perceber;
o método fica difícil de testar;
o método fica difícil de reutilizar;
o método pode estar misturando responsabilidades;
dados relacionados continuam soltos.
```

Exemplo perigoso:

```java
registrarAuditoria("Produto", "CRIACAO", "aline");
```

A assinatura esperada era:

```java
registrarAuditoria(String usuario, String operacao, String entidade)
```

Mas a chamada passou os textos em ordem errada.

Como todos são `String`, o compilador não reclama.

O erro vira regra errada em tempo de execução.

---

## Quando muitos parâmetros são aceitáveis

Nem todo método com vários parâmetros é ruim.

Pode ser aceitável quando:

```text
é método pequeno e muito local;
os parâmetros são poucos e claros;
a chamada aparece uma vez;
não há conceito de domínio ainda;
o agrupamento deixaria o código artificial;
o método é temporário em aula inicial;
a refatoração está em andamento.
```

Exemplo aceitável por enquanto:

```java
calcularTotalPedido(BigDecimal precoUnitario, int quantidade)
```

Dois parâmetros claros.

Exemplo que já pede revisão:

```java
imprimirResumoPedido(String cliente, String produto, BigDecimal preco, int quantidade, BigDecimal total, BigDecimal desconto, BigDecimal totalFinal)
```

Sete parâmetros relacionados.

---

## Quantos parâmetros são demais?

Não existe número mágico.

Mas como guia inicial:

```text
0 parâmetros -> método usa dados internos ou constantes;
1 parâmetro -> simples;
2 parâmetros -> geralmente ok;
3 parâmetros -> atenção;
4 parâmetros -> revisar;
5 ou mais -> forte cheiro de código.
```

Não aplique como lei.

Use como alerta.

A pergunta mais importante é:

```text
esses parâmetros representam um único conceito maior?
```

Se sim, talvez devamos agrupar.

---

## Alternativa 1 — melhorar nomes

Antes de criar estrutura nova, melhore nomes.

Ruim:

```java
public static BigDecimal calcular(BigDecimal a, int b, BigDecimal c) {
    return a.multiply(BigDecimal.valueOf(b)).subtract(c);
}
```

Melhor:

```java
public static BigDecimal calcularTotalFinal(
        BigDecimal precoUnitario,
        int quantidade,
        BigDecimal desconto
) {
    BigDecimal totalBruto = precoUnitario.multiply(BigDecimal.valueOf(quantidade));

    return totalBruto.subtract(desconto);
}
```

Ainda há três parâmetros.

Mas agora a assinatura comunica intenção.

Nem todo problema exige record imediatamente.

---

## Alternativa 2 — dividir método

Às vezes há muitos parâmetros porque o método faz coisas demais.

Antes:

```java
public static void validarCalcularEImprimir(
        String cliente,
        String produto,
        BigDecimal preco,
        int quantidade,
        BigDecimal desconto,
        boolean clienteVip
) {
}
```

Esse método mistura:

```text
validar;
calcular;
imprimir;
usar regra de cliente VIP.
```

Melhor:

```java
boolean valido = pedidoValido(cliente, produto, preco, quantidade);
BigDecimal total = calcularTotal(preco, quantidade);
BigDecimal totalFinal = aplicarDesconto(total, desconto);
imprimirResumo(cliente, produto, totalFinal);
```

Dividir responsabilidades pode reduzir parâmetros ou pelo menos deixar a intenção mais clara.

---

## Alternativa 3 — criar variáveis intermediárias

Antes:

```java
imprimirResumoPedido(cliente, produto, preco.multiply(BigDecimal.valueOf(quantidade)), preco.multiply(new BigDecimal("0.10")));
```

Melhor:

```java
BigDecimal totalBruto = calcularTotalBruto(preco, quantidade);
BigDecimal desconto = calcularDesconto(totalBruto);

imprimirResumoPedido(cliente, produto, totalBruto, desconto);
```

Variáveis intermediárias com nomes bons ajudam a chamada.

Isso não remove parâmetros, mas melhora leitura.

---

## Alternativa 4 — agrupar com record

Quando os parâmetros representam um conceito, use um tipo.

Exemplo:

```java
record PedidoEntrada(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
}
```

Agora, em vez de:

```java
validarPedido(cliente, produto, precoUnitario, quantidade)
```

podemos usar:

```java
validarPedido(pedidoEntrada)
```

Assinatura:

```java
public static boolean validarPedido(PedidoEntrada pedido) {
}
```

A ideia é:

```text
dados que andam juntos podem ganhar um nome.
```

Essa é uma ponte para orientação a objetos.

---

## Alternativa 5 — agrupar resultado

Também podemos agrupar resultado.

Exemplo:

```java
record ResumoPedido(
        String cliente,
        String produto,
        BigDecimal totalBruto,
        BigDecimal desconto,
        BigDecimal totalFinal
) {
}
```

Assim, em vez de passar vários valores para impressão:

```java
imprimirResumo(cliente, produto, totalBruto, desconto, totalFinal)
```

podemos passar:

```java
imprimirResumo(resumo)
```

Isso melhora a assinatura e reduz risco de ordem errada.

---

## Alternativa 6 — separar entrada, cálculo e saída

Muitos parâmetros aparecem quando o mesmo método recebe dados de entrada, dados calculados e dados de saída.

Separe:

```text
Entrada -> PedidoEntrada
Cálculo -> ResumoPedido
Saída -> imprimirResumo(ResumoPedido)
```

Essa separação deixa o fluxo mais legível.

---

## Alternativa 7 — enum no lugar de boolean

Boolean como parâmetro costuma piorar legibilidade.

Ruim:

```java
formatarNome("Ana", true)
```

Melhor:

```java
formatarNome("Ana", TipoNormalizacao.MAIUSCULA)
```

Com enum:

```java
enum TipoNormalizacao {
    ORIGINAL,
    MAIUSCULA,
    MINUSCULA
}
```

Chamada com enum comunica mais.

---

## Exemplo inicial ruim

Arquivo:

```text
ParametrosDemaisRuim.java
```

Código:

```java
import java.math.BigDecimal;

public class ParametrosDemaisRuim {
    public static void main(String[] args) {
        imprimirResumoPedido(
                "Ana",
                "Cadeira",
                new BigDecimal("199.90"),
                2,
                new BigDecimal("399.80"),
                new BigDecimal("39.98"),
                new BigDecimal("359.82")
        );
    }

    public static void imprimirResumoPedido(
            String cliente,
            String produto,
            BigDecimal precoUnitario,
            int quantidade,
            BigDecimal totalBruto,
            BigDecimal desconto,
            BigDecimal totalFinal
    ) {
        System.out.println("Cliente: " + cliente);
        System.out.println("Produto: " + produto);
        System.out.println("Preço unitário: " + precoUnitario);
        System.out.println("Quantidade: " + quantidade);
        System.out.println("Total bruto: " + totalBruto);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
    }
}
```

Problemas:

```text
muitos parâmetros;
muitos valores do mesmo tipo;
ordem perigosa;
chamada difícil de ler;
dados de pedido e resumo misturados.
```

---

## Refatoração 1 — criar PedidoEntrada

Arquivo:

```text
PedidoComRecordEntrada.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoComRecordEntrada {
    public static void main(String[] args) {
        PedidoEntrada pedido = new PedidoEntrada(
                "Ana",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        if (!pedidoValido(pedido)) {
            System.out.println("Pedido inválido.");
            return;
        }

        BigDecimal totalBruto = calcularTotalBruto(pedido);
        BigDecimal desconto = calcularDesconto(totalBruto);
        BigDecimal totalFinal = calcularTotalFinal(totalBruto, desconto);

        imprimirResumoPedido(pedido, totalBruto, desconto, totalFinal);
    }

    public static boolean pedidoValido(PedidoEntrada pedido) {
        return pedido != null
                && pedido.cliente() != null
                && !pedido.cliente().isBlank()
                && pedido.produto() != null
                && !pedido.produto().isBlank()
                && pedido.precoUnitario() != null
                && pedido.precoUnitario().compareTo(BigDecimal.ZERO) > 0
                && pedido.quantidade() > 0;
    }

    public static BigDecimal calcularTotalBruto(PedidoEntrada pedido) {
        return pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()));
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
            PedidoEntrada pedido,
            BigDecimal totalBruto,
            BigDecimal desconto,
            BigDecimal totalFinal
    ) {
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Preço unitário: " + pedido.precoUnitario());
        System.out.println("Quantidade: " + pedido.quantidade());
        System.out.println("Total bruto: " + totalBruto);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
    }
}

record PedidoEntrada(
        String cliente,
        String produto,
        BigDecimal precoUnitario,
        int quantidade
) {
}
```

Melhorou:

```text
cliente, produto, preço e quantidade agora têm nome conjunto: PedidoEntrada.
```

Mas ainda há muitos parâmetros no `imprimirResumoPedido`.

Vamos melhorar.

---

## Refatoração 2 — criar ResumoPedido

Arquivo:

```text
PedidoComResumo.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoComResumo {
    public static void main(String[] args) {
        PedidoEntrada pedido = new PedidoEntrada(
                "Ana",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        if (!pedidoValido(pedido)) {
            System.out.println("Pedido inválido.");
            return;
        }

        ResumoPedido resumo = gerarResumoPedido(pedido);

        imprimirResumoPedido(resumo);
    }

    public static boolean pedidoValido(PedidoEntrada pedido) {
        return pedido != null
                && textoInformado(pedido.cliente())
                && textoInformado(pedido.produto())
                && pedido.precoUnitario() != null
                && pedido.precoUnitario().compareTo(BigDecimal.ZERO) > 0
                && pedido.quantidade() > 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static ResumoPedido gerarResumoPedido(PedidoEntrada pedido) {
        BigDecimal totalBruto = calcularTotalBruto(pedido);
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

    public static BigDecimal calcularTotalBruto(PedidoEntrada pedido) {
        return pedido.precoUnitario().multiply(BigDecimal.valueOf(pedido.quantidade()));
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
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Produto: " + resumo.produto());
        System.out.println("Preço unitário: " + resumo.precoUnitario());
        System.out.println("Quantidade: " + resumo.quantidade());
        System.out.println("Total bruto: " + resumo.totalBruto());
        System.out.println("Desconto: " + resumo.desconto());
        System.out.println("Total final: " + resumo.totalFinal());
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

Agora a assinatura ficou muito mais clara:

```java
imprimirResumoPedido(ResumoPedido resumo)
```

O método recebe um conceito, não sete valores soltos.

---

## Leitura crítica da refatoração

Pontos bons:

```text
dados relacionados foram agrupados;
a chamada ficou menor;
o risco de trocar ordem diminuiu;
PedidoEntrada comunica entrada;
ResumoPedido comunica saída/cálculo;
imprimirResumoPedido ficou mais simples;
gerarResumoPedido concentra montagem do resumo.
```

Pontos de atenção:

```text
record não deve ser usado para esconder método ruim;
record com campos demais também pode virar cheiro;
não crie record sem conceito claro;
não agrupe dados sem relação só para reduzir parâmetros.
```

Agrupamento precisa fazer sentido.

---

## Exemplo aplicado em cliente

Arquivo:

```text
ClienteParametros.java
```

Código:

```java
public class ClienteParametros {
    public static void main(String[] args) {
        ClienteEntrada cliente = new ClienteEntrada("Ana Silva", "ana@email.com", "11999999999");

        if (!clienteValido(cliente)) {
            System.out.println("Cliente inválido.");
            return;
        }

        imprimirCliente(cliente);
    }

    public static boolean clienteValido(ClienteEntrada cliente) {
        return cliente != null
                && textoInformado(cliente.nome())
                && textoInformado(cliente.email())
                && cliente.email().contains("@")
                && textoInformado(cliente.telefone());
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static void imprimirCliente(ClienteEntrada cliente) {
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
    }
}

record ClienteEntrada(String nome, String email, String telefone) {
}
```

Antes poderia ser:

```java
clienteValido(nome, email, telefone)
```

Com record:

```java
clienteValido(cliente)
```

Mais claro.

---

## Exemplo aplicado em produto

Arquivo:

```text
ProdutoParametros.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoParametros {
    public static void main(String[] args) {
        ProdutoEntrada produto = new ProdutoEntrada("Cadeira", new BigDecimal("199.90"), 10);

        if (!produtoValido(produto)) {
            System.out.println("Produto inválido.");
            return;
        }

        BigDecimal valorEmEstoque = calcularValorEmEstoque(produto);

        imprimirProduto(produto, valorEmEstoque);
    }

    public static boolean produtoValido(ProdutoEntrada produto) {
        return produto != null
                && produto.nome() != null
                && !produto.nome().isBlank()
                && produto.preco() != null
                && produto.preco().compareTo(BigDecimal.ZERO) > 0
                && produto.estoque() >= 0;
    }

    public static BigDecimal calcularValorEmEstoque(ProdutoEntrada produto) {
        return produto.preco().multiply(BigDecimal.valueOf(produto.estoque()));
    }

    public static void imprimirProduto(ProdutoEntrada produto, BigDecimal valorEmEstoque) {
        System.out.println("Produto: " + produto.nome());
        System.out.println("Preço: " + produto.preco());
        System.out.println("Estoque: " + produto.estoque());
        System.out.println("Valor em estoque: " + valorEmEstoque);
    }
}

record ProdutoEntrada(String nome, BigDecimal preco, int estoque) {
}
```

---

## Exemplo aplicado em pagamento

Arquivo:

```text
PagamentoParametros.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoParametros {
    public static void main(String[] args) {
        PagamentoEntrada pagamento = new PagamentoEntrada(
                "PAG-001",
                new BigDecimal("100.00"),
                FormaPagamento.PIX
        );

        ResultadoPagamento resultado = processarPagamento(pagamento);

        imprimirResultado(resultado);
    }

    public static ResultadoPagamento processarPagamento(PagamentoEntrada pagamento) {
        if (pagamento == null) {
            return new ResultadoPagamento(false, "Pagamento obrigatório.");
        }

        if (pagamento.valor() == null || pagamento.valor().compareTo(BigDecimal.ZERO) <= 0) {
            return new ResultadoPagamento(false, "Valor inválido.");
        }

        if (pagamento.formaPagamento() == null) {
            return new ResultadoPagamento(false, "Forma de pagamento obrigatória.");
        }

        return new ResultadoPagamento(true, "Pagamento aprovado: " + pagamento.codigo());
    }

    public static void imprimirResultado(ResultadoPagamento resultado) {
        System.out.println(resultado.mensagem());
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record PagamentoEntrada(String codigo, BigDecimal valor, FormaPagamento formaPagamento) {
}

record ResultadoPagamento(boolean aprovado, String mensagem) {
}
```

Antes:

```java
processarPagamento(codigo, valor, formaPagamento)
```

Depois:

```java
processarPagamento(pagamento)
```

---

## Exemplo aplicado em OS

Arquivo:

```text
OsParametros.java
```

Código:

```java
import java.time.LocalDate;

public class OsParametros {
    public static void main(String[] args) {
        AgendamentoOs agendamento = new AgendamentoOs(
                "OS-001",
                LocalDate.now().plusDays(2),
                Periodo.MANHA
        );

        if (!agendamentoValido(agendamento)) {
            System.out.println("Agendamento inválido.");
            return;
        }

        imprimirAgendamento(agendamento);
    }

    public static boolean agendamentoValido(AgendamentoOs agendamento) {
        return agendamento != null
                && agendamento.certificado() != null
                && !agendamento.certificado().isBlank()
                && agendamento.data() != null
                && !agendamento.data().isBefore(LocalDate.now())
                && agendamento.periodo() != null;
    }

    public static void imprimirAgendamento(AgendamentoOs agendamento) {
        System.out.println("Certificado: " + agendamento.certificado());
        System.out.println("Data: " + agendamento.data());
        System.out.println("Período: " + agendamento.periodo());
    }
}

enum Periodo {
    MANHA,
    TARDE
}

record AgendamentoOs(String certificado, LocalDate data, Periodo periodo) {
}
```

Aqui `AgendamentoOs` evita passar:

```java
certificado, data, periodo
```

soltos o tempo todo.

---

## Exemplo aplicado em mensageria

Arquivo:

```text
MensageriaParametros.java
```

Código:

```java
public class MensageriaParametros {
    public static void main(String[] args) {
        DadosMensagem dados = new DadosMensagem("Ana", "OS-001", TipoMensagem.ENTREGA);

        if (!dadosMensagemValidos(dados)) {
            System.out.println("Dados inválidos.");
            return;
        }

        String mensagem = montarMensagem(dados);

        System.out.println(mensagem);
    }

    public static boolean dadosMensagemValidos(DadosMensagem dados) {
        return dados != null
                && dados.cliente() != null
                && !dados.cliente().isBlank()
                && dados.certificado() != null
                && !dados.certificado().isBlank()
                && dados.tipo() != null;
    }

    public static String montarMensagem(DadosMensagem dados) {
        if (dados.tipo() == TipoMensagem.ENTREGA) {
            return "Olá, %s. Sua OS %s teve entrega confirmada."
                    .formatted(dados.cliente(), dados.certificado());
        }

        if (dados.tipo() == TipoMensagem.NPS) {
            return "Olá, %s. Avalie sua experiência da OS %s."
                    .formatted(dados.cliente(), dados.certificado());
        }

        return "Olá, %s. Acompanhamento da OS %s."
                .formatted(dados.cliente(), dados.certificado());
    }
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}

record DadosMensagem(String cliente, String certificado, TipoMensagem tipo) {
}
```

---

## Exemplo aplicado em auditoria

Arquivo:

```text
AuditoriaParametros.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaParametros {
    public static void main(String[] args) {
        RegistroAuditoria auditoria = new RegistroAuditoria(
                "aline",
                "CRIACAO",
                "Produto",
                10L,
                Instant.now()
        );

        if (!auditoriaValida(auditoria)) {
            System.out.println("Auditoria inválida.");
            return;
        }

        imprimirAuditoria(auditoria);
    }

    public static boolean auditoriaValida(RegistroAuditoria auditoria) {
        return auditoria != null
                && textoInformado(auditoria.usuario())
                && textoInformado(auditoria.operacao())
                && textoInformado(auditoria.entidade())
                && auditoria.entidadeId() != null
                && auditoria.entidadeId() > 0
                && auditoria.criadoEm() != null;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static void imprimirAuditoria(RegistroAuditoria auditoria) {
        System.out.println("AUDITORIA");
        System.out.println("Usuário: " + auditoria.usuario());
        System.out.println("Operação: " + auditoria.operacao());
        System.out.println("Entidade: " + auditoria.entidade());
        System.out.println("Entidade ID: " + auditoria.entidadeId());
        System.out.println("Criado em: " + auditoria.criadoEm());
    }
}

record RegistroAuditoria(
        String usuario,
        String operacao,
        String entidade,
        Long entidadeId,
        Instant criadoEm
) {
}
```

Antes:

```java
imprimirAuditoria(usuario, operacao, entidade, entidadeId, criadoEm)
```

Depois:

```java
imprimirAuditoria(auditoria)
```

Muito mais seguro e expressivo.

---

## Quando não criar record

Não crie record só para esconder parâmetro.

Evite:

```java
record Dados(String a, String b, String c) {
}
```

Isso não melhorou nada.

Um record precisa ter nome de conceito:

```text
PedidoEntrada;
ResumoPedido;
ClienteEntrada;
PagamentoEntrada;
AgendamentoOs;
DadosMensagem;
RegistroAuditoria.
```

Se você não consegue dar um nome bom para o agrupamento, talvez os dados não pertençam juntos.

---

## Método com record ainda pode ser ruim

Isso é importante.

Antes:

```java
processar(a, b, c, d, e)
```

Depois:

```java
processar(dados)
```

Pode parecer melhor.

Mas se `processar` ainda faz:

```text
validar;
calcular;
imprimir;
salvar;
enviar;
auditar.
```

o problema continua.

Record reduz parâmetros.

Mas não corrige falta de coesão sozinho.

---

## Agrupamento e objeto futuro

Nesta fase, usar record é um passo intermediário.

Mais tarde, em orientação a objetos, alguns records podem virar classes com comportamento.

Exemplo hoje:

```java
record PedidoEntrada(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
}
```

Futuro possível:

```text
Pedido;
ItemPedido;
Cliente;
Produto;
ResumoPedido;
Pagamento.
```

Nesta aula, não precisamos antecipar tudo.

Apenas começamos a perceber que dados relacionados merecem nome.

---

## Erros comuns

### Erro 1 — Aceitar método com 8 parâmetros sem questionar

Pode funcionar, mas deve ser revisado.

### Erro 2 — Trocar ordem de parâmetros do mesmo tipo

Exemplo:

```java
registrarAuditoria(entidade, operacao, usuario)
```

quando a assinatura esperava:

```java
registrarAuditoria(usuario, operacao, entidade)
```

### Erro 3 — Criar record genérico

Ruim:

```java
record Dados(String a, String b) {
}
```

### Erro 4 — Agrupar dados sem relação

Não crie agrupamento artificial.

### Erro 5 — Usar boolean misterioso

```java
formatarNome(nome, true)
```

Prefira enum ou método específico.

### Erro 6 — Achar que record resolve método sem coesão

Não resolve sozinho.

### Erro 7 — Record com campos demais

Pode virar novo cheiro.

### Erro 8 — Esconder validação dentro de qualquer lugar

Mantenha responsabilidade clara.

---

## Debug recomendado

Use debug em:

```text
PedidoComResumo.java
```

Coloque breakpoints em:

```java
pedidoValido(...)
gerarResumoPedido(...)
calcularTotalBruto(...)
calcularDesconto(...)
imprimirResumoPedido(...)
```

Observe:

```text
o objeto PedidoEntrada;
o objeto ResumoPedido;
os valores internos;
como a chamada fica mais clara;
como o risco de ordem errada diminui.
```

Depois compare com:

```text
ParametrosDemaisRuim.java
```

Observe a dificuldade de acompanhar os valores soltos.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m3\aula-093-parametros-demais-e-alternativas
cd labs\m3\aula-093-parametros-demais-e-alternativas
```

Crie arquivos:

```text
ParametrosDemaisRuim.java
PedidoComRecordEntrada.java
PedidoComResumo.java
ClienteParametros.java
ProdutoParametros.java
PagamentoParametros.java
OsParametros.java
MensageriaParametros.java
AuditoriaParametros.java
ErroOrdemParametros.java
ErroRecordGenerico.java
ErroAgrupamentoArtificial.java
ErroRecordComMetodoSemCoesao.java
ErroBooleanMisterioso.java
README.md
```

Compile:

```powershell
javac ParametrosDemaisRuim.java
javac PedidoComRecordEntrada.java
javac PedidoComResumo.java
javac ClienteParametros.java
javac ProdutoParametros.java
javac PagamentoParametros.java
javac OsParametros.java
javac MensageriaParametros.java
javac AuditoriaParametros.java
```

Execute:

```powershell
java ParametrosDemaisRuim
java PedidoComRecordEntrada
java PedidoComResumo
java ClienteParametros
java ProdutoParametros
java PagamentoParametros
java OsParametros
java MensageriaParametros
java AuditoriaParametros
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
git add labs/m3/aula-093-parametros-demais-e-alternativas docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 093: refatora parametros demais com records"
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
explicar parâmetros demais;
identificar cheiro de código;
avaliar quantidade de parâmetros;
identificar risco de ordem errada;
identificar parâmetros do mesmo tipo;
melhorar nomes;
criar variáveis intermediárias;
dividir método quando necessário;
criar record com conceito claro;
evitar record genérico;
evitar agrupamento artificial;
usar enum no lugar de boolean misterioso quando fizer sentido;
explicar objeto futuro;
aplicar em pedido;
aplicar em cliente;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar objetos agrupados;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar orientação a objetos completa.

Não precisa ainda criar classes ricas de domínio.

Não precisa ainda usar builders.

Não precisa ainda aplicar design patterns.

Não precisa ainda usar Lombok.

Esses assuntos virão depois.

O objetivo é:

```text
perceber quando dados relacionados estão soltos demais e começar a agrupá-los com clareza.
```

---

## Fechamento

Hoje estudamos parâmetros demais e alternativas.

A ideia central foi:

```text
muitos parâmetros podem indicar falta de um conceito no código.
```

Vimos que:

```text
parâmetros demais dificultam leitura;
ordem de parâmetros pode gerar erro silencioso;
dados relacionados podem ser agrupados;
record é uma boa ferramenta inicial;
record precisa ter nome de domínio;
boolean misterioso deve ser evitado;
dividir método pode ser melhor que agrupar;
record não corrige falta de coesão sozinho;
agrupamento prepara a transição para orientação a objetos.
```

O ponto mais importante é:

```text
reduzir parâmetros não é esconder dados; é dar nome para conceitos que já existem.
```

Na próxima aula, vamos estudar:

```text
Retorno boolean para validação.
```

A próxima aula vai aprofundar `isValido`, `podeProcessar`, regras simples, mensagens e quando `boolean` é suficiente ou insuficiente para validar uma regra.
