# 091 — M3.02 — Assinatura de método profissional

## A pergunta central da aula

Qual assinatura é melhor?

```java
public static BigDecimal calc(BigDecimal a, int b) {
    return a.multiply(BigDecimal.valueOf(b));
}
```

ou:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

As duas podem fazer a mesma coisa.

Mas a segunda comunica muito mais.

A pergunta central da aula é:

```text
como desenhar assinaturas de método que comuniquem intenção, entrada e saída com clareza?
```

Uma assinatura profissional ajuda o leitor antes mesmo de abrir o corpo do método.

---

## O que é assinatura de método

Assinatura de método é a forma como o método se apresenta.

Em Java, quando falamos informalmente de assinatura, olhamos para:

```text
visibilidade;
static ou não;
tipo de retorno;
nome do método;
parâmetros;
ordem dos parâmetros;
tipos dos parâmetros;
exceções declaradas, quando houver;
intenção comunicada.
```

Exemplo:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade)
```

Essa assinatura comunica:

```text
é público;
é estático;
retorna BigDecimal;
calcula total do pedido;
precisa de preço unitário;
precisa de quantidade.
```

Antes de ler o corpo, já sabemos muita coisa.

---

## Assinatura como contrato

Uma assinatura é um contrato.

Ela diz para quem chama:

```text
como chamar;
o que informar;
o que esperar de volta;
que tipo de dado será usado;
qual intenção do método;
qual responsabilidade provável.
```

Exemplo:

```java
public static boolean clienteValido(String nome, String email)
```

Quem chama entende:

```text
preciso passar nome e email;
recebo true ou false;
o método verifica validade do cliente.
```

Mas talvez seja limitado.

Se retornar `false`, não sabemos o motivo.

Para validação mais rica, outra assinatura pode ser melhor:

```java
public static ResultadoValidacao validarCliente(String nome, String email)
```

Agora a assinatura comunica:

```text
o método valida;
retorna um resultado;
o resultado pode conter mais informação.
```

---

## Nome do método

Nome é a parte mais importante da assinatura.

Nome ruim:

```java
fazer()
processar()
executar()
calcular()
validar()
tratar()
ajustar()
dados()
```

Esses nomes podem até ser usados em contextos específicos, mas frequentemente são genéricos demais.

Nome melhor:

```java
calcularTotalPedido()
calcularDescontoProgressivo()
validarQuantidadePositiva()
normalizarNomeCliente()
formatarValorMonetario()
montarMensagemEntrega()
registrarAuditoriaCriacao()
```

Nome bom responde:

```text
o que o método faz?
sobre qual conceito?
com qual intenção?
```

---

## Verbos e intenção

Método normalmente começa com verbo.

Exemplos:

```text
calcular;
validar;
normalizar;
formatar;
montar;
imprimir;
ler;
converter;
buscar;
registrar;
aplicar;
gerar;
criar.
```

Cada verbo sugere uma intenção.

### calcular

Deve retornar resultado.

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade)
```

### validar

Pode retornar boolean ou resultado de validação.

```java
public static boolean validarQuantidade(int quantidade)
```

ou:

```java
public static ResultadoValidacao validarQuantidade(int quantidade)
```

### imprimir

Normalmente pode ser `void`.

```java
public static void imprimirResumo(String texto)
```

### converter

Deve retornar outro tipo ou outro formato.

```java
public static BigDecimal converterTextoParaValor(String texto)
```

### montar

Geralmente constrói texto, objeto ou estrutura.

```java
public static String montarMensagem(String cliente, String certificado)
```

O verbo precisa combinar com o retorno.

---

## Nome e retorno precisam conversar

Assinatura estranha:

```java
public static void calcularTotal(BigDecimal preco, int quantidade)
```

Por que é estranha?

Porque `calcular` sugere retorno.

Se o método apenas imprime, talvez o nome deveria ser:

```java
public static void imprimirTotal(BigDecimal preco, int quantidade)
```

Ou melhor:

```java
BigDecimal total = calcularTotal(preco, quantidade);
imprimirTotal(total);
```

Regra:

```text
se o nome promete calcular, normalmente retorne valor;
se o nome promete imprimir, pode ser void;
se o nome promete validar, retorne boolean ou ResultadoValidacao;
se o nome promete montar, retorne o que foi montado.
```

---

## Parâmetros

Parâmetros são os dados que o método precisa receber.

Exemplo:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade)
```

Parâmetros:

```text
precoUnitario;
quantidade.
```

Parâmetro bom tem:

```text
tipo correto;
nome claro;
ordem coerente;
necessidade real.
```

Parâmetro ruim:

```java
public static BigDecimal calcular(BigDecimal a, int b)
```

O problema não é só o tipo.

O problema é que `a` e `b` não dizem nada.

---

## Tipo de parâmetro

O tipo precisa representar a natureza do dado.

Exemplos:

```text
dinheiro -> BigDecimal;
data sem horário -> LocalDate;
instante absoluto -> Instant;
quantidade -> int ou Integer, dependendo do contexto;
identificador numérico grande -> Long;
texto -> String;
opção fixa -> enum;
resultado estruturado -> record.
```

Exemplo ruim:

```java
public static boolean validarPagamento(String valor)
```

Se o método valida valor monetário já convertido, melhor:

```java
public static boolean validarPagamento(BigDecimal valor)
```

Se o método também converte texto digitado, então o nome precisa dizer:

```java
public static BigDecimal converterTextoParaValorMonetario(String texto)
```

Não misture intenção.

---

## Ordem dos parâmetros

A ordem dos parâmetros precisa ser natural.

Exemplo bom:

```java
public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade)
```

Porque o total é:

```text
preço unitário x quantidade.
```

Exemplo com data:

```java
public static long calcularDiasEntre(LocalDate dataInicial, LocalDate dataFinal)
```

A ordem natural é:

```text
início;
fim.
```

Evite:

```java
calcularDiasEntre(dataFinal, dataInicial)
```

A menos que exista uma razão muito clara.

---

## Parâmetros demais

Muitos parâmetros deixam a assinatura difícil.

Exemplo:

```java
public static void imprimirResumo(
        String cliente,
        String produto,
        BigDecimal preco,
        int quantidade,
        BigDecimal total,
        BigDecimal desconto,
        BigDecimal totalFinal
)
```

Isso pode ser aceitável temporariamente.

Mas é um sinal de que talvez exista um conceito faltando:

```text
Pedido;
ResumoPedido;
ItemPedido;
Pagamento;
Cliente.
```

Nesta fase, ainda estamos em métodos.

Mas já precisamos perceber o cheiro.

Muitos parâmetros podem indicar:

```text
dados relacionados que deveriam estar agrupados;
responsabilidade grande demais;
método tentando fazer muita coisa;
ausência de record/classe.
```

---

## Boolean como parâmetro

Cuidado com boolean em parâmetro.

Exemplo ruim:

```java
public static String formatarNome(String nome, boolean maiusculo)
```

Quem chama vê:

```java
formatarNome("Ana", true)
```

O que é `true`?

É pouco claro.

Alternativas:

```java
formatarNomeMaiusculo("Ana")
formatarNomeMinusculo("Ana")
formatarNome("Ana", TipoNormalizacao.MAIUSCULA)
```

Enum pode comunicar melhor:

```java
public static String formatarNome(String nome, TipoNormalizacao tipo)
```

Chamada:

```java
formatarNome("Ana", TipoNormalizacao.MAIUSCULA)
```

Muito mais legível.

---

## Null em parâmetro

Assinatura não mostra claramente se aceita `null`.

Exemplo:

```java
public static String normalizarTexto(String valor)
```

Pergunta:

```text
aceita null?
lança erro?
retorna vazio?
```

O corpo do método precisa definir.

A documentação ou nome pode ajudar, mas o contrato precisa ser consistente.

Exemplo defensivo:

```java
public static String normalizarTexto(String valor) {
    if (valor == null) {
        return "";
    }

    return valor.trim().replaceAll("\\s+", " ");
}
```

Se a regra for não aceitar `null`, lance erro claro:

```java
public static String normalizarTextoObrigatorio(String valor) {
    if (valor == null || valor.isBlank()) {
        throw new IllegalArgumentException("Texto é obrigatório.");
    }

    return valor.trim().replaceAll("\\s+", " ");
}
```

O nome mudou porque a regra mudou.

---

## Retorno

Retorno deve representar o resultado do método.

Exemplos:

```java
public static String normalizarTexto(String valor)
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade)
public static boolean valorPositivo(BigDecimal valor)
public static ResultadoValidacao validarCliente(String nome, String email)
public static LocalDate converterTextoParaData(String texto)
```

Cada retorno comunica algo.

Retorno ruim:

```java
public static Object processar(Object entrada)
```

Isso esconde tudo.

Pode existir em casos avançados, mas não é boa assinatura para código comum.

---

## void

`void` indica que o método não devolve valor.

Use quando o método executa ação.

Exemplos:

```java
public static void imprimirResumoPedido(...)
public static void registrarLogSimples(...)
public static void exibirMenu()
```

Mas cuidado com `void` escondendo cálculo.

Ruim:

```java
public static void calcularTotal(BigDecimal preco, int quantidade) {
    System.out.println(preco.multiply(BigDecimal.valueOf(quantidade)));
}
```

Melhor:

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}
```

Depois:

```java
public static void imprimirTotal(BigDecimal total) {
    System.out.println(total);
}
```

---

## Exceções na assinatura

Mais tarde estudaremos exceções com mais profundidade.

Mas assinatura pode declarar checked exceptions.

Exemplo conceitual:

```java
public static String lerArquivo(String caminho) throws IOException
```

Isso comunica:

```text
este método pode falhar por erro de entrada/saída;
quem chama precisa tratar ou propagar.
```

Nesta aula, ficaremos principalmente com `RuntimeException`, como:

```text
IllegalArgumentException;
NumberFormatException;
DateTimeParseException.
```

Mesmo quando não aparece na assinatura, o método precisa ter contrato claro.

---

## Assinatura ruim inicial

Arquivo:

```text
AssinaturaRuim.java
```

Código:

```java
import java.math.BigDecimal;

public class AssinaturaRuim {
    public static void main(String[] args) {
        BigDecimal r = p(new BigDecimal("100.00"), 2, true);

        System.out.println(r);
    }

    public static BigDecimal p(BigDecimal a, int b, boolean c) {
        BigDecimal t = a.multiply(BigDecimal.valueOf(b));

        if (c) {
            return t.multiply(new BigDecimal("0.90"));
        }

        return t;
    }
}
```

Problemas:

```text
p não comunica nada;
a, b, c não comunicam nada;
boolean c é misterioso;
t não comunica intenção;
não sabemos que há desconto;
não sabemos o significado do true;
assinatura obriga a abrir o método para entender.
```

---

## Assinatura melhor

Arquivo:

```text
AssinaturaBoa.java
```

Código:

```java
import java.math.BigDecimal;

public class AssinaturaBoa {
    public static void main(String[] args) {
        BigDecimal total = calcularTotalComDesconto(
                new BigDecimal("100.00"),
                2,
                TipoCliente.PREMIUM
        );

        System.out.println(total);
    }

    public static BigDecimal calcularTotalComDesconto(
            BigDecimal precoUnitario,
            int quantidade,
            TipoCliente tipoCliente
    ) {
        BigDecimal total = calcularTotal(precoUnitario, quantidade);

        if (tipoCliente == TipoCliente.PREMIUM) {
            return aplicarPercentualDesconto(total, new BigDecimal("0.10"));
        }

        return total;
    }

    public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal aplicarPercentualDesconto(BigDecimal total, BigDecimal percentual) {
        BigDecimal fatorDesconto = BigDecimal.ONE.subtract(percentual);

        return total.multiply(fatorDesconto);
    }
}

enum TipoCliente {
    COMUM,
    PREMIUM
}
```

Agora a assinatura comunica:

```text
calcular total com desconto;
preço unitário;
quantidade;
tipo do cliente;
retorna BigDecimal.
```

O `true` virou enum.

O método ficou mais expressivo.

---

## Assinatura e domínio

Métodos devem usar linguagem do domínio.

Em sistema de pedidos:

```text
calcularTotalPedido;
aplicarDescontoPromocional;
validarQuantidadeItens;
montarResumoPedido.
```

Em OS:

```text
validarDataAgendamento;
normalizarCertificado;
calcularDiasAteAgendamento;
montarMensagemAcompanhamento.
```

Em pagamento:

```text
validarValorPagamento;
arredondarValorMonetario;
calcularValorLiquido;
identificarFormaPagamento.
```

Domínio melhora nomes.

Nome técnico demais pode esconder regra.

---

## Exemplo aplicado em pedido

Arquivo:

```text
PedidoAssinaturaProfissional.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoAssinaturaProfissional {
    public static void main(String[] args) {
        BigDecimal precoUnitario = new BigDecimal("150.00");
        int quantidade = 3;

        BigDecimal total = calcularTotalPedido(precoUnitario, quantidade);
        BigDecimal desconto = calcularDescontoPorTotal(total);
        BigDecimal totalFinal = calcularTotalFinal(total, desconto);

        imprimirResumoPedido(total, desconto, totalFinal);
    }

    public static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public static BigDecimal calcularDescontoPorTotal(BigDecimal totalPedido) {
        BigDecimal limiteParaDesconto = new BigDecimal("300.00");

        if (totalPedido.compareTo(limiteParaDesconto) >= 0) {
            return totalPedido.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    public static BigDecimal calcularTotalFinal(BigDecimal totalPedido, BigDecimal desconto) {
        return totalPedido.subtract(desconto);
    }

    public static void imprimirResumoPedido(BigDecimal totalPedido, BigDecimal desconto, BigDecimal totalFinal) {
        System.out.println("Total: " + totalPedido);
        System.out.println("Desconto: " + desconto);
        System.out.println("Total final: " + totalFinal);
    }
}
```

Observe:

```text
nomes têm domínio;
retornos são coerentes;
parâmetros têm intenção;
ordem é natural.
```

---

## Exemplo aplicado em cliente

Arquivo:

```text
ClienteAssinaturaProfissional.java
```

Código:

```java
public class ClienteAssinaturaProfissional {
    public static void main(String[] args) {
        String nome = normalizarNomeCliente("  Ana Silva  ");
        String email = normalizarEmailCliente(" ANA@EMAIL.COM ");

        ResultadoValidacao validacao = validarCliente(nome, email);

        if (!validacao.valido()) {
            System.out.println(validacao.mensagem());
            return;
        }

        imprimirCliente(nome, email);
    }

    public static String normalizarNomeCliente(String nome) {
        if (nome == null) {
            return "";
        }

        return nome.trim().replaceAll("\\s+", " ");
    }

    public static String normalizarEmailCliente(String email) {
        if (email == null) {
            return "";
        }

        return email.trim().toLowerCase();
    }

    public static ResultadoValidacao validarCliente(String nome, String email) {
        if (nome == null || nome.isBlank()) {
            return ResultadoValidacao.erro("Nome do cliente é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            return ResultadoValidacao.erro("E-mail do cliente é obrigatório.");
        }

        if (!email.contains("@")) {
            return ResultadoValidacao.erro("E-mail do cliente deve conter @.");
        }

        return ResultadoValidacao.sucesso();
    }

    public static void imprimirCliente(String nome, String email) {
        System.out.println("Cliente: " + nome);
        System.out.println("E-mail: " + email);
    }
}

record ResultadoValidacao(boolean valido, String mensagem) {
    static ResultadoValidacao sucesso() {
        return new ResultadoValidacao(true, "OK");
    }

    static ResultadoValidacao erro(String mensagem) {
        return new ResultadoValidacao(false, mensagem);
    }
}
```

Observe:

```text
normalizarNomeCliente não normaliza qualquer coisa;
normalizarEmailCliente indica regra específica;
validarCliente retorna resultado expressivo;
imprimirCliente é void porque só imprime.
```

---

## Exemplo aplicado em produto

Arquivo:

```text
ProdutoAssinaturaProfissional.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoAssinaturaProfissional {
    public static void main(String[] args) {
        String nomeProduto = normalizarNomeProduto("  mesa de escritório  ");
        BigDecimal preco = new BigDecimal("450.00");
        int estoque = 4;

        if (!produtoDisponivelParaVenda(preco, estoque)) {
            System.out.println("Produto indisponível para venda.");
            return;
        }

        BigDecimal valorTotalEstoque = calcularValorTotalEmEstoque(preco, estoque);

        imprimirResumoProduto(nomeProduto, preco, estoque, valorTotalEstoque);
    }

    public static String normalizarNomeProduto(String nomeProduto) {
        if (nomeProduto == null) {
            return "";
        }

        return nomeProduto.trim().replaceAll("\\s+", " ");
    }

    public static boolean produtoDisponivelParaVenda(BigDecimal preco, int estoque) {
        return preco != null
                && preco.compareTo(BigDecimal.ZERO) > 0
                && estoque > 0;
    }

    public static BigDecimal calcularValorTotalEmEstoque(BigDecimal precoUnitario, int quantidadeEmEstoque) {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidadeEmEstoque));
    }

    public static void imprimirResumoProduto(
            String nomeProduto,
            BigDecimal precoUnitario,
            int quantidadeEmEstoque,
            BigDecimal valorTotalEstoque
    ) {
        System.out.println("Produto: " + nomeProduto);
        System.out.println("Preço unitário: " + precoUnitario);
        System.out.println("Estoque: " + quantidadeEmEstoque);
        System.out.println("Valor total em estoque: " + valorTotalEstoque);
    }
}
```

Nome importante:

```java
produtoDisponivelParaVenda
```

Ele é melhor do que:

```java
validar
```

porque comunica a intenção de negócio.

---

## Exemplo aplicado em pagamento

Arquivo:

```text
PagamentoAssinaturaProfissional.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PagamentoAssinaturaProfissional {
    public static void main(String[] args) {
        BigDecimal valorInformado = new BigDecimal("100.005");
        FormaPagamento formaPagamento = FormaPagamento.PIX;

        BigDecimal valorArredondado = arredondarValorMonetario(valorInformado);
        ResultadoPagamento resultado = processarPagamento(valorArredondado, formaPagamento);

        imprimirResultadoPagamento(resultado);
    }

    public static BigDecimal arredondarValorMonetario(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static ResultadoPagamento processarPagamento(BigDecimal valor, FormaPagamento formaPagamento) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            return new ResultadoPagamento(false, "Valor inválido.");
        }

        if (formaPagamento == null) {
            return new ResultadoPagamento(false, "Forma de pagamento obrigatória.");
        }

        return new ResultadoPagamento(true, "Pagamento processado via " + formaPagamento);
    }

    public static void imprimirResultadoPagamento(ResultadoPagamento resultado) {
        System.out.println(resultado.mensagem());
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

record ResultadoPagamento(boolean aprovado, String mensagem) {
}
```

Assinaturas boas:

```text
arredondarValorMonetario;
processarPagamento;
imprimirResultadoPagamento.
```

Cada uma comunica uma etapa.

---

## Exemplo aplicado em OS

Arquivo:

```text
OrdemServicoAssinaturaProfissional.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoAssinaturaProfissional {
    public static void main(String[] args) {
        String certificado = normalizarCertificadoOs(" os-001 ");
        LocalDate dataAgendamento = LocalDate.now().plusDays(3);

        if (!dataAgendamentoValida(dataAgendamento)) {
            System.out.println("Data de agendamento inválida.");
            return;
        }

        long diasAteAgendamento = calcularDiasAteAgendamento(dataAgendamento);

        imprimirResumoAgendamento(certificado, dataAgendamento, diasAteAgendamento);
    }

    public static String normalizarCertificadoOs(String certificado) {
        if (certificado == null) {
            return "";
        }

        return certificado.trim().toUpperCase();
    }

    public static boolean dataAgendamentoValida(LocalDate dataAgendamento) {
        return dataAgendamento != null && !dataAgendamento.isBefore(LocalDate.now());
    }

    public static long calcularDiasAteAgendamento(LocalDate dataAgendamento) {
        return ChronoUnit.DAYS.between(LocalDate.now(), dataAgendamento);
    }

    public static void imprimirResumoAgendamento(
            String certificado,
            LocalDate dataAgendamento,
            long diasAteAgendamento
    ) {
        System.out.println("Certificado: " + certificado);
        System.out.println("Data de agendamento: " + dataAgendamento);
        System.out.println("Dias até agendamento: " + diasAteAgendamento);
    }
}
```

Observe:

```text
dataAgendamentoValida é mais específico que validarData;
calcularDiasAteAgendamento deixa claro o sentido da conta.
```

---

## Exemplo aplicado em mensageria

Arquivo:

```text
MensageriaAssinaturaProfissional.java
```

Código:

```java
public class MensageriaAssinaturaProfissional {
    public static void main(String[] args) {
        String cliente = "Ana";
        String certificado = "OS-001";

        String mensagem = montarMensagemAcompanhamentoOs(cliente, certificado);

        imprimirMensagemWhatsApp(mensagem);
    }

    public static String montarMensagemAcompanhamentoOs(String nomeCliente, String certificadoOs) {
        String clienteNormalizado = normalizarNomeCliente(nomeCliente);
        String certificadoNormalizado = normalizarCertificadoOs(certificadoOs);

        return """
                Olá, %s.
                Sua OS %s está em acompanhamento.
                """.formatted(clienteNormalizado, certificadoNormalizado);
    }

    public static String normalizarNomeCliente(String nomeCliente) {
        if (nomeCliente == null) {
            return "";
        }

        return nomeCliente.trim();
    }

    public static String normalizarCertificadoOs(String certificadoOs) {
        if (certificadoOs == null) {
            return "";
        }

        return certificadoOs.trim().toUpperCase();
    }

    public static void imprimirMensagemWhatsApp(String mensagem) {
        System.out.println("Mensagem WhatsApp:");
        System.out.println(mensagem);
    }
}
```

Assinatura ruim seria:

```java
montar(String a, String b)
```

Assinatura boa:

```java
montarMensagemAcompanhamentoOs(String nomeCliente, String certificadoOs)
```

---

## Exemplo aplicado em auditoria

Arquivo:

```text
AuditoriaAssinaturaProfissional.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaAssinaturaProfissional {
    public static void main(String[] args) {
        String registro = montarRegistroAuditoria(
                "aline",
                "CRIACAO",
                "Produto",
                10L,
                Instant.now()
        );

        imprimirRegistroAuditoria(registro);
    }

    public static String montarRegistroAuditoria(
            String usuario,
            String operacao,
            String entidade,
            Long entidadeId,
            Instant criadoEm
    ) {
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (operacao == null || operacao.isBlank()) {
            throw new IllegalArgumentException("Operação é obrigatória.");
        }

        if (entidade == null || entidade.isBlank()) {
            throw new IllegalArgumentException("Entidade é obrigatória.");
        }

        if (entidadeId == null || entidadeId <= 0) {
            throw new IllegalArgumentException("ID da entidade é obrigatório.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        return "AUDITORIA | usuario=%s | operacao=%s | entidade=%s | entidadeId=%d | criadoEm=%s"
                .formatted(usuario, operacao, entidade, entidadeId, criadoEm);
    }

    public static void imprimirRegistroAuditoria(String registro) {
        System.out.println(registro);
    }
}
```

Leitura crítica:

```text
montarRegistroAuditoria tem muitos parâmetros;
isso pode indicar que um record RegistroAuditoria virá bem no futuro;
por enquanto, a assinatura ainda é legível porque os nomes estão claros.
```

---

## Refatoração de assinatura ruim

Antes:

```java
public static BigDecimal x(BigDecimal a, int b, boolean c)
```

Perguntas:

```text
x faz o quê?
a significa o quê?
b significa o quê?
c muda qual comportamento?
BigDecimal retornado representa quê?
```

Depois:

```java
public static BigDecimal calcularTotalComDesconto(
        BigDecimal precoUnitario,
        int quantidade,
        TipoCliente tipoCliente
)
```

Agora responde:

```text
calcula total com desconto;
preço unitário entra;
quantidade entra;
tipo do cliente influencia;
retorna total.
```

---

## Refatoração de boolean misterioso

Antes:

```java
formatarTexto("Ana", true)
```

Depois:

```java
formatarTexto("Ana", TipoNormalizacao.MAIUSCULA)
```

Ou:

```java
formatarTextoMaiusculo("Ana")
```

Regra:

```text
se o boolean na chamada não se explica sozinho, considere enum ou método específico.
```

---

## Refatoração de método void errado

Antes:

```java
public static void calcularTotal(BigDecimal preco, int quantidade) {
    System.out.println(preco.multiply(BigDecimal.valueOf(quantidade)));
}
```

Depois:

```java
public static BigDecimal calcularTotal(BigDecimal preco, int quantidade) {
    return preco.multiply(BigDecimal.valueOf(quantidade));
}

public static void imprimirTotal(BigDecimal total) {
    System.out.println(total);
}
```

Ganho:

```text
cálculo pode ser reutilizado;
cálculo pode ser testado;
impressão fica separada;
assinatura comunica melhor.
```

---

## Refatoração de parâmetros demais

Antes:

```java
imprimirResumo(cliente, produto, preco, quantidade, total, desconto, totalFinal)
```

Depois, futuramente, poderíamos ter:

```java
imprimirResumo(ResumoPedido resumo)
```

Com record:

```java
record ResumoPedido(
        String cliente,
        String produto,
        BigDecimal preco,
        int quantidade,
        BigDecimal total,
        BigDecimal desconto,
        BigDecimal totalFinal
) {
}
```

Nesta aula, o foco é reconhecer o sinal.

Agrupamento com record será explorado em momentos adequados.

---

## Regras práticas para assinatura profissional

Use este checklist mental:

```text
1. O nome tem verbo?
2. O nome comunica intenção?
3. O retorno combina com o verbo?
4. Os parâmetros são necessários?
5. Os nomes dos parâmetros são claros?
6. A ordem dos parâmetros é natural?
7. O tipo representa bem o dado?
8. Há boolean misterioso?
9. Há parâmetros demais?
10. A assinatura permite entender sem abrir o corpo?
```

Se a resposta for ruim, melhore.

---

## Erros comuns

### Erro 1 — Nome genérico

```java
processar()
```

Processar o quê?

---

### Erro 2 — Abreviação sem necessidade

```java
calcTot()
vlr()
qtd()
```

Prefira clareza.

---

### Erro 3 — Parâmetro sem significado

```java
a
b
c
```

Use nomes de domínio.

---

### Erro 4 — Boolean misterioso

```java
gerarRelatorio(true)
```

O que significa `true`?

---

### Erro 5 — void para cálculo

Cálculo deve retornar valor.

---

### Erro 6 — retorno genérico

```java
Object
```

Evite quando o tipo real é conhecido.

---

### Erro 7 — método promete uma coisa e faz outra

Nome diz `validar`, mas método imprime, salva e calcula.

---

### Erro 8 — parâmetros em ordem confusa

```java
calcularPeriodo(dataFinal, dataInicial)
```

Ordem natural costuma ser início e fim.

---

### Erro 9 — parâmetros demais

Pode indicar conceito faltando.

---

### Erro 10 — assinatura boa com corpo ruim

Assinatura boa ajuda, mas corpo também precisa cumprir a promessa.

---

## Debug recomendado

Use debug no arquivo:

```text
AssinaturaBoa.java
```

Coloque breakpoints em:

```java
calcularTotalComDesconto(...)
calcularTotal(...)
aplicarPercentualDesconto(...)
```

Observe:

```text
parâmetros recebidos;
retorno de cada método;
como tipoCliente influencia;
como assinatura ajuda a acompanhar o fluxo.
```

Depois compare com:

```text
AssinaturaRuim.java
```

Observe como nomes ruins dificultam o debug.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m3\aula-091-assinatura-de-metodo-profissional
cd labs\m3\aula-091-assinatura-de-metodo-profissional
```

Crie arquivos:

```text
AssinaturaRuim.java
AssinaturaBoa.java
PedidoAssinaturaProfissional.java
ClienteAssinaturaProfissional.java
ProdutoAssinaturaProfissional.java
PagamentoAssinaturaProfissional.java
OrdemServicoAssinaturaProfissional.java
MensageriaAssinaturaProfissional.java
AuditoriaAssinaturaProfissional.java
DebugAssinaturaMetodo.java
ErroNomeGenerico.java
ErroBooleanMisterioso.java
ErroVoidParaCalculo.java
ErroParametrosABC.java
ErroParametrosDemais.java
README.md
```

Compile:

```powershell
javac AssinaturaRuim.java
javac AssinaturaBoa.java
javac PedidoAssinaturaProfissional.java
javac ClienteAssinaturaProfissional.java
javac ProdutoAssinaturaProfissional.java
javac PagamentoAssinaturaProfissional.java
javac OrdemServicoAssinaturaProfissional.java
javac MensageriaAssinaturaProfissional.java
javac AuditoriaAssinaturaProfissional.java
```

Execute:

```powershell
java AssinaturaRuim
java AssinaturaBoa
java PedidoAssinaturaProfissional
java ClienteAssinaturaProfissional
java ProdutoAssinaturaProfissional
java PagamentoAssinaturaProfissional
java OrdemServicoAssinaturaProfissional
java MensageriaAssinaturaProfissional
java AuditoriaAssinaturaProfissional
```

Arquivos de erro ou leitura crítica:

```text
ErroNomeGenerico.java
ErroBooleanMisterioso.java
ErroVoidParaCalculo.java
ErroParametrosABC.java
ErroParametrosDemais.java
```

---

## Arquivos

- `AssinaturaRuim.java`
- `AssinaturaBoa.java`
- `PedidoAssinaturaProfissional.java`
- `ClienteAssinaturaProfissional.java`
- `ProdutoAssinaturaProfissional.java`
- `PagamentoAssinaturaProfissional.java`
- `OrdemServicoAssinaturaProfissional.java`
- `MensageriaAssinaturaProfissional.java`
- `AuditoriaAssinaturaProfissional.java`

## Observações

- Evitar nomes genéricos.
- Evitar parâmetros `a`, `b`, `c`.
- Evitar boolean misterioso.
- Evitar `void` para cálculo.
- Evitar retorno genérico.
- Evitar assinatura que obriga abrir o corpo para entender.
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
git add labs/m3/aula-091-assinatura-de-metodo-profissional docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 091: pratica assinatura profissional de metodos"
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
explicar assinatura de método;
explicar assinatura como contrato;
criar nomes claros;
usar verbos coerentes;
combinar nome com retorno;
definir parâmetros necessários;
nomear parâmetros com clareza;
escolher tipos adequados;
ordenar parâmetros de forma natural;
identificar boolean misterioso;
substituir boolean por enum quando fizer sentido;
identificar parâmetros demais;
identificar void usado errado;
separar cálculo de impressão;
refatorar assinatura ruim;
aplicar em pedido;
aplicar em cliente;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar parâmetros e retornos;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar todos os recursos de refatoração da IDE.

Não precisa ainda usar orientação a objetos avançada.

Não precisa ainda criar testes automatizados.

Não precisa ainda usar Maven.

Não precisa ainda criar arquitetura em camadas.

Esses assuntos virão depois.

O objetivo é:

```text
desenhar métodos que comuniquem melhor antes mesmo de ler o corpo.
```

---

## Fechamento da aula

Hoje estudamos assinatura de método profissional.

A ideia central foi:

```text
assinatura boa reduz esforço de leitura e deixa o contrato do método mais claro.
```

Vimos que:

```text
nome precisa comunicar intenção;
verbo precisa combinar com retorno;
parâmetros precisam ter nomes claros;
tipos precisam representar o domínio;
ordem dos parâmetros importa;
boolean misterioso deve ser evitado;
enum pode melhorar chamada;
void faz sentido para ação;
cálculo deve retornar valor;
muitos parâmetros podem indicar conceito faltando;
assinatura ruim obriga abrir o método para entender.
```

O ponto mais importante é:

```text
um método profissional começa a ser entendido pela assinatura.
```

Na próxima aula, vamos estudar:

```text
Coesão em métodos.
```

A próxima aula vai aprofundar a ideia de que um método deve fazer uma coisa principal, com tamanho, nomes e separação adequados.
