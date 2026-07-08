# 115 — M4.11 — Relacionamento entre objetos

## Objetivo da aula

Nesta aula você vai aprender como objetos se relacionam em Java.

Na aula anterior, você estudou composição: um objeto pode ser formado por outros objetos. Agora vamos ampliar a visão e entender que objetos não vivem isolados.

Em um sistema real, objetos colaboram.

Um pedido se relaciona com cliente, itens e pagamento.  
Uma ordem de serviço se relaciona com cliente, atividade, período e técnico.  
Uma mensagem se relaciona com destinatário, conteúdo e canal.  
Um contrato se relaciona com cliente corporativo, serviço e vigência.

Ao final da aula, você deve conseguir:

```text
explicar relacionamento entre objetos;
entender que um objeto pode conhecer outro objeto;
diferenciar composição de dependência temporária;
entender colaboração entre objetos;
identificar acoplamento forte demais;
criar métodos que recebem objetos como parâmetro;
criar objetos que delegam responsabilidades;
evitar objeto principal fazendo tudo;
modelar relações simples de backend com clareza.
```

Essa aula é importante porque Orientação a Objetos não é só criar classes separadas. É fazer essas classes colaborarem sem virar bagunça.

---

## A ideia central

Relacionamento entre objetos acontece quando um objeto usa, possui, recebe, consulta ou colabora com outro objeto.

Exemplo:

```java
class Pedido {
    private final Cliente cliente;
}
```

Aqui, `Pedido` se relaciona com `Cliente`.

Outro exemplo:

```java
pedido.aplicarCupom(cupom);
```

Aqui, `Pedido` recebe um objeto `CupomDesconto` temporariamente para aplicar uma regra.

Outro exemplo:

```java
mensagem.podeSerEnviadaPara(destinatario);
```

Aqui, um objeto usa outro para tomar uma decisão.

A ideia principal é:

```text
objetos colaboram para resolver o problema.
```

O cuidado é fazer essa colaboração sem criar dependência exagerada e sem espalhar regra pelo lugar errado.

---

## Tipos simples de relacionamento nesta fase

Vamos trabalhar com três formas iniciais de relacionamento.

### 1. Composição

Um objeto tem outro objeto como parte do seu estado.

Exemplo:

```java
class Pedido {
    private final Cliente cliente;
    private final Pagamento pagamento;
}
```

Relação:

```text
Pedido tem Cliente.
Pedido tem Pagamento.
```

### 2. Dependência por parâmetro

Um objeto recebe outro objeto apenas para executar uma operação.

Exemplo:

```java
pedido.aplicarCupom(cupom);
```

Relação:

```text
Pedido usa CupomDesconto naquele método.
```

O cupom não precisa ser atributo fixo do pedido.

### 3. Colaboração

Um objeto chama comportamento de outro objeto para compor uma decisão.

Exemplo:

```java
boolean aprovado() {
    return pagamento.aprovado();
}
```

Relação:

```text
Pedido pergunta ao Pagamento se ele está aprovado.
```

Isso é colaboração.

---

## O perigo de objeto que faz tudo

Antes de modelar relacionamento, veja um problema comum.

Uma classe principal começa a fazer todas as regras:

```text
Pedido valida cliente;
Pedido valida endereço;
Pedido calcula subtotal;
Pedido valida pagamento;
Pedido verifica status;
Pedido monta tudo sozinho;
Pedido sabe detalhes internos de todos os objetos.
```

Isso cria uma classe centralizadora demais.

Exemplo ruim conceitual:

```java
class Pedido {
    boolean podeFinalizar() {
        return clienteEmail.contains("@")
                && enderecoCep.length() >= 8
                && pagamentoStatus.equals("APROVADO")
                && quantidade > 0
                && valorUnitario.compareTo(BigDecimal.ZERO) > 0;
    }
}
```

O pedido está validando regra de cliente, endereço, pagamento e item.

Melhor seria:

```java
boolean podeFinalizar() {
    return cliente.aptoParaPedido()
            && item.valido()
            && pagamento.aprovado();
}
```

Agora cada objeto responde pelo que sabe.

Esse é um dos pontos centrais desta aula:

```text
relacionamento bom permite delegar responsabilidades.
```

---

## Delegar não é abandonar responsabilidade

Delegar significa pedir para o objeto certo responder uma parte da regra.

Exemplo:

```java
pagamento.aprovado()
```

O pedido não precisa saber como o pagamento decide se está aprovado.

Ele só precisa da resposta.

Isso reduz acoplamento.

Compare:

```java
if (pagamento.status() == StatusPagamento.APROVADO
        || pagamento.status() == StatusPagamento.CONFIRMADO) {
}
```

com:

```java
if (pagamento.aprovadoOuConfirmado()) {
}
```

No segundo caso, a regra fica dentro de `Pagamento`.

O código externo fica mais limpo.

---

## Exemplo 1 — Pedido com objetos colaborando

Crie a pasta:

```powershell
mkdir labs\m4\aula-115-relacionamento-entre-objetos
cd labs\m4\aula-115-relacionamento-entre-objetos
```

Crie o arquivo:

```text
RelacionamentoPedido.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class RelacionamentoPedido {
    public static void main(String[] args) {
        ClienteRelacionamento cliente = new ClienteRelacionamento(
                "Ana Silva",
                "ana@email.com",
                true
        );

        ProdutoRelacionamento produto = new ProdutoRelacionamento(
                "PROD-001",
                "Cadeira",
                new BigDecimal("199.90")
        );

        ItemPedidoRelacionamento item = new ItemPedidoRelacionamento(
                produto,
                2
        );

        PagamentoRelacionamento pagamento = new PagamentoRelacionamento(
                FormaPagamentoRelacionamento.PIX,
                StatusPagamentoRelacionamento.APROVADO,
                item.subtotal()
        );

        PedidoRelacionamento pedido = new PedidoRelacionamento(
                1001,
                cliente,
                item,
                pagamento
        );

        System.out.println(pedido.resumo());
        System.out.println("Pode finalizar: " + pedido.podeFinalizar());

        CupomDescontoRelacionamento cupom = new CupomDescontoRelacionamento(
                "PROMO10",
                new BigDecimal("10")
        );

        BigDecimal totalComCupom = pedido.totalComDesconto(cupom);

        System.out.println("Total com cupom: R$ " + totalComCupom);
    }
}

enum FormaPagamentoRelacionamento {
    PIX,
    CARTAO,
    BOLETO
}

enum StatusPagamentoRelacionamento {
    PENDENTE,
    APROVADO,
    CONFIRMADO,
    CANCELADO
}

class PedidoRelacionamento {
    private final int numero;
    private final ClienteRelacionamento cliente;
    private final ItemPedidoRelacionamento item;
    private final PagamentoRelacionamento pagamento;

    PedidoRelacionamento(
            int numero,
            ClienteRelacionamento cliente,
            ItemPedidoRelacionamento item,
            PagamentoRelacionamento pagamento
    ) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        if (pagamento == null) {
            throw new IllegalArgumentException("Pagamento é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.item = item;
        this.pagamento = pagamento;
    }

    BigDecimal total() {
        return item.subtotal();
    }

    BigDecimal totalComDesconto(CupomDescontoRelacionamento cupom) {
        if (cupom == null) {
            return total();
        }

        return cupom.aplicarSobre(total());
    }

    boolean podeFinalizar() {
        return cliente.aptoParaComprar()
                && item.valido()
                && pagamento.aprovadoOuConfirmado()
                && pagamento.valorCobre(total());
    }

    String resumo() {
        return "Pedido: " + numero
                + "\nCliente: " + cliente.resumo()
                + "\nItem: " + item.resumo()
                + "\nPagamento: " + pagamento.resumo()
                + "\nTotal: R$ " + total();
    }
}

class ClienteRelacionamento {
    private final String nome;
    private final String email;
    private final boolean ativo;

    ClienteRelacionamento(String nome, String email, boolean ativo) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(email)) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (!email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.nome = nome;
        this.email = email;
        this.ativo = ativo;
    }

    boolean aptoParaComprar() {
        return ativo;
    }

    String resumo() {
        return nome + " <" + email + "> | Ativo: " + ativo;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ProdutoRelacionamento {
    private final String codigo;
    private final String nome;
    private final BigDecimal valorUnitario;

    ProdutoRelacionamento(String codigo, String nome, BigDecimal valorUnitario) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (valorUnitario == null || valorUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor unitário deve ser maior que zero.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.valorUnitario = valorUnitario.setScale(2, RoundingMode.HALF_UP);
    }

    String codigo() {
        return codigo;
    }

    String nome() {
        return nome;
    }

    BigDecimal valorUnitario() {
        return valorUnitario;
    }

    String resumo() {
        return codigo + " - " + nome + " | R$ " + valorUnitario;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ItemPedidoRelacionamento {
    private final ProdutoRelacionamento produto;
    private final int quantidade;

    ItemPedidoRelacionamento(ProdutoRelacionamento produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.produto = produto;
        this.quantidade = quantidade;
    }

    boolean valido() {
        return quantidade > 0 && produto.valorUnitario().compareTo(BigDecimal.ZERO) > 0;
    }

    BigDecimal subtotal() {
        return produto.valorUnitario().multiply(BigDecimal.valueOf(quantidade));
    }

    String resumo() {
        return produto.resumo()
                + " | Quantidade: " + quantidade
                + " | Subtotal: R$ " + subtotal();
    }
}

class PagamentoRelacionamento {
    private final FormaPagamentoRelacionamento forma;
    private final StatusPagamentoRelacionamento status;
    private final BigDecimal valor;

    PagamentoRelacionamento(
            FormaPagamentoRelacionamento forma,
            StatusPagamentoRelacionamento status,
            BigDecimal valor
    ) {
        if (forma == null) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status do pagamento é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor do pagamento deve ser maior que zero.");
        }

        this.forma = forma;
        this.status = status;
        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    boolean aprovadoOuConfirmado() {
        return status == StatusPagamentoRelacionamento.APROVADO
                || status == StatusPagamentoRelacionamento.CONFIRMADO;
    }

    boolean valorCobre(BigDecimal totalPedido) {
        if (totalPedido == null) {
            return false;
        }

        return valor.compareTo(totalPedido) >= 0;
    }

    String resumo() {
        return forma + " | Status: " + status + " | Valor: R$ " + valor;
    }
}

class CupomDescontoRelacionamento {
    private final String codigo;
    private final BigDecimal percentual;

    CupomDescontoRelacionamento(String codigo, BigDecimal percentual) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código do cupom é obrigatório.");
        }

        if (percentual == null || percentual.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Percentual não pode ser negativo.");
        }

        if (percentual.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Percentual não pode ser maior que 100.");
        }

        this.codigo = codigo;
        this.percentual = percentual;
    }

    BigDecimal aplicarSobre(BigDecimal valorOriginal) {
        if (valorOriginal == null || valorOriginal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor original deve ser maior que zero.");
        }

        BigDecimal fator = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal desconto = valorOriginal.multiply(fator);
        return valorOriginal.subtract(desconto).setScale(2, RoundingMode.HALF_UP);
    }

    String resumo() {
        return codigo + " | " + percentual + "%";
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac RelacionamentoPedido.java
java RelacionamentoPedido
```

---

## O que observar nesse exemplo

A classe `PedidoRelacionamento` não faz tudo sozinha.

Ela delega:

```java
cliente.aptoParaComprar()
item.valido()
pagamento.aprovadoOuConfirmado()
pagamento.valorCobre(total())
```

Isso é relacionamento entre objetos.

O pedido coordena a regra geral:

```text
pode finalizar?
```

Mas cada objeto responde sua parte.

O cliente sabe se está apto.  
O item sabe se é válido.  
O pagamento sabe se foi aprovado e se cobre o total.  
O cupom sabe aplicar desconto.

Esse desenho é muito melhor do que uma classe pedido com vários `if` acessando dados internos de todos os outros objetos.

---

## Composição versus dependência por parâmetro

No exemplo, `PedidoRelacionamento` tem estes atributos:

```java
private final ClienteRelacionamento cliente;
private final ItemPedidoRelacionamento item;
private final PagamentoRelacionamento pagamento;
```

Esses objetos fazem parte do pedido.

Isso é composição.

Mas o cupom aparece assim:

```java
BigDecimal totalComDesconto(CupomDescontoRelacionamento cupom)
```

O cupom é recebido como parâmetro.

Ele é usado naquela operação, mas não faz parte permanente do estado do pedido.

Isso é dependência por parâmetro.

Relações diferentes:

```text
Pedido tem Cliente.
Pedido tem Item.
Pedido tem Pagamento.
Pedido usa CupomDesconto para calcular total com desconto.
```

Essa diferença é importante.

Nem todo objeto usado por outro precisa virar atributo.

---

## Quando usar atributo e quando usar parâmetro

Use atributo quando o objeto faz parte do estado principal.

Exemplo:

```text
Pedido tem Cliente.
Pedido tem Item.
Pedido tem Pagamento.
OrdemServico tem Atividade.
Cliente tem Endereco.
```

Use parâmetro quando o objeto é necessário apenas para uma operação específica.

Exemplo:

```text
Pedido usa CupomDesconto para calcular desconto.
OrdemServico usa NovaData para reagendar.
Mensagem usa UsuarioAprovador para aprovar envio.
Pagamento usa MotivoCancelamento para cancelar.
```

Pergunta prática:

```text
esse objeto precisa ficar guardado aqui depois da operação?
```

Se sim, pode ser atributo.  
Se não, talvez seja parâmetro.

---

## Acoplamento entre objetos

Quando uma classe conhece outra, existe acoplamento.

Acoplamento não é sempre ruim.

É impossível criar sistema orientado a objetos sem nenhum acoplamento.

O problema é o acoplamento exagerado.

Exemplo aceitável:

```java
pagamento.aprovadoOuConfirmado()
```

O pedido conhece o pagamento e chama um comportamento de alto nível.

Exemplo ruim:

```java
pagamento.status().name().toLowerCase().contains("aprov")
```

O pedido conhece detalhe demais sobre como o pagamento representa seu status.

Regra prática:

```text
quanto mais uma classe depende dos detalhes internos da outra, maior o acoplamento.
```

Comportamentos bem nomeados reduzem acoplamento.

---

## Lei de Demeter em linguagem simples

Existe um princípio conhecido como Lei de Demeter.

Não precisamos decorar o nome agora, mas a ideia é útil:

```text
converse com seus objetos próximos;
evite atravessar cadeias longas de objetos.
```

Exemplo fraco:

```java
pedido.cliente().endereco().cidade().toUpperCase();
```

O pedido ou outro código externo está navegando por detalhes demais.

Melhor:

```java
pedido.cidadeDeEntrega()
```

ou:

```java
cliente.enderecoFormatado()
```

ou:

```java
pedido.resumoEntrega()
```

Não é proibido acessar objetos relacionados, mas cadeias longas costumam indicar acoplamento alto.

---

## Exemplo 2 — Ordem de Serviço com relacionamento

Agora vamos modelar uma OS com objetos colaborando.

Crie o arquivo:

```text
RelacionamentoOrdemServico.java
```

Código:

```java
import java.time.LocalDate;

public class RelacionamentoOrdemServico {
    public static void main(String[] args) {
        ClienteOsRelacionamento cliente = new ClienteOsRelacionamento(
                "Carlos Lima",
                "11988887777"
        );

        TecnicoRelacionamento tecnico = new TecnicoRelacionamento(
                "Marcos Técnico",
                true
        );

        PeriodoOsRelacionamento periodo = new PeriodoOsRelacionamento(
                LocalDate.now().plusDays(1),
                TurnoOsRelacionamento.MANHA
        );

        AtividadeOsRelacionamento atividade = new AtividadeOsRelacionamento(
                "Montagem de móvel",
                tecnico,
                periodo,
                StatusAtividadeRelacionamento.AGENDADA
        );

        OrdemServicoRelacionamento os = new OrdemServicoRelacionamento(
                "OS-2026-0001",
                cliente,
                atividade,
                StatusOsRelacionamento.AGENDADA
        );

        System.out.println(os.resumo());
        System.out.println("Pode executar: " + os.podeExecutar(LocalDate.now()));
        System.out.println("Pode reagendar: " + os.podeReagendar());

        PeriodoOsRelacionamento novoPeriodo = new PeriodoOsRelacionamento(
                LocalDate.now().plusDays(3),
                TurnoOsRelacionamento.TARDE
        );

        OrdemServicoRelacionamento osReagendada = os.reagendar(novoPeriodo);

        System.out.println("OS reagendada:");
        System.out.println(osReagendada.resumo());
    }
}

enum StatusOsRelacionamento {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum StatusAtividadeRelacionamento {
    AGENDADA,
    EM_EXECUCAO,
    CONCLUIDA,
    CANCELADA
}

enum TurnoOsRelacionamento {
    MANHA,
    TARDE
}

class OrdemServicoRelacionamento {
    private final String codigo;
    private final ClienteOsRelacionamento cliente;
    private final AtividadeOsRelacionamento atividade;
    private final StatusOsRelacionamento status;

    OrdemServicoRelacionamento(
            String codigo,
            ClienteOsRelacionamento cliente,
            AtividadeOsRelacionamento atividade,
            StatusOsRelacionamento status
    ) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (atividade == null) {
            throw new IllegalArgumentException("Atividade é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status da OS é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.atividade = atividade;
        this.status = status;
    }

    boolean encerrada() {
        return status == StatusOsRelacionamento.CONCLUIDA
                || status == StatusOsRelacionamento.CANCELADA;
    }

    boolean podeReagendar() {
        return !encerrada()
                && atividade.podeReagendar();
    }

    boolean podeExecutar(LocalDate dataReferencia) {
        return !encerrada()
                && cliente.contatoValido()
                && atividade.podeExecutar(dataReferencia);
    }

    OrdemServicoRelacionamento reagendar(PeriodoOsRelacionamento novoPeriodo) {
        if (!podeReagendar()) {
            throw new IllegalStateException("OS não pode ser reagendada.");
        }

        AtividadeOsRelacionamento atividadeReagendada = atividade.reagendar(novoPeriodo);

        return new OrdemServicoRelacionamento(
                codigo,
                cliente,
                atividadeReagendada,
                StatusOsRelacionamento.REAGENDADA
        );
    }

    String resumo() {
        return "OS: " + codigo
                + "\nCliente: " + cliente.resumo()
                + "\nAtividade: " + atividade.resumo()
                + "\nStatus OS: " + status;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ClienteOsRelacionamento {
    private final String nome;
    private final String telefone;

    ClienteOsRelacionamento(String nome, String telefone) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (!textoInformado(telefone)) {
            throw new IllegalArgumentException("Telefone do cliente é obrigatório.");
        }

        this.nome = nome;
        this.telefone = telefone;
    }

    boolean contatoValido() {
        return telefone.length() >= 8;
    }

    String resumo() {
        return nome + " | Telefone: " + telefone;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class TecnicoRelacionamento {
    private final String nome;
    private final boolean ativo;

    TecnicoRelacionamento(String nome, boolean ativo) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome do técnico é obrigatório.");
        }

        this.nome = nome;
        this.ativo = ativo;
    }

    boolean disponivelParaAtendimento() {
        return ativo;
    }

    String resumo() {
        return nome + " | Ativo: " + ativo;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class AtividadeOsRelacionamento {
    private final String descricao;
    private final TecnicoRelacionamento tecnico;
    private final PeriodoOsRelacionamento periodo;
    private final StatusAtividadeRelacionamento status;

    AtividadeOsRelacionamento(
            String descricao,
            TecnicoRelacionamento tecnico,
            PeriodoOsRelacionamento periodo,
            StatusAtividadeRelacionamento status
    ) {
        if (!textoInformado(descricao)) {
            throw new IllegalArgumentException("Descrição da atividade é obrigatória.");
        }

        if (tecnico == null) {
            throw new IllegalArgumentException("Técnico é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status da atividade é obrigatório.");
        }

        this.descricao = descricao;
        this.tecnico = tecnico;
        this.periodo = periodo;
        this.status = status;
    }

    boolean encerrada() {
        return status == StatusAtividadeRelacionamento.CONCLUIDA
                || status == StatusAtividadeRelacionamento.CANCELADA;
    }

    boolean podeExecutar(LocalDate dataReferencia) {
        return !encerrada()
                && tecnico.disponivelParaAtendimento()
                && periodo.futuroOuHoje(dataReferencia);
    }

    boolean podeReagendar() {
        return !encerrada();
    }

    AtividadeOsRelacionamento reagendar(PeriodoOsRelacionamento novoPeriodo) {
        if (!podeReagendar()) {
            throw new IllegalStateException("Atividade não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        return new AtividadeOsRelacionamento(
                descricao,
                tecnico,
                novoPeriodo,
                StatusAtividadeRelacionamento.AGENDADA
        );
    }

    String resumo() {
        return descricao
                + "\nTécnico: " + tecnico.resumo()
                + "\nPeríodo: " + periodo.resumo()
                + "\nStatus atividade: " + status;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class PeriodoOsRelacionamento {
    private final LocalDate data;
    private final TurnoOsRelacionamento turno;

    PeriodoOsRelacionamento(LocalDate data, TurnoOsRelacionamento turno) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (turno == null) {
            throw new IllegalArgumentException("Turno é obrigatório.");
        }

        this.data = data;
        this.turno = turno;
    }

    boolean futuroOuHoje(LocalDate referencia) {
        return !data.isBefore(referencia);
    }

    String resumo() {
        return data + " - " + turno;
    }
}
```

Compile e execute:

```powershell
javac RelacionamentoOrdemServico.java
java RelacionamentoOrdemServico
```

---

## O que esse exemplo ensina

A OS se relaciona com cliente e atividade:

```java
private final ClienteOsRelacionamento cliente;
private final AtividadeOsRelacionamento atividade;
```

A atividade se relaciona com técnico e período:

```java
private final TecnicoRelacionamento tecnico;
private final PeriodoOsRelacionamento periodo;
```

A regra `podeExecutar` é distribuída:

```java
return !encerrada()
        && cliente.contatoValido()
        && atividade.podeExecutar(dataReferencia);
```

E dentro da atividade:

```java
return !encerrada()
        && tecnico.disponivelParaAtendimento()
        && periodo.futuroOuHoje(dataReferencia);
```

Cada objeto responde sua parte.

A OS não precisa saber como o técnico decide se está disponível.  
A OS não precisa saber como o período decide se é futuro ou hoje.  
A OS não precisa saber detalhes internos demais.

Isso é colaboração entre objetos.

---

## Relacionamento e imutabilidade

No exemplo da OS, o método `reagendar` não altera a OS atual.

Ele retorna uma nova OS:

```java
OrdemServicoRelacionamento osReagendada = os.reagendar(novoPeriodo);
```

Isso aproveita a ideia da aula anterior sobre imutabilidade.

A OS original continua igual.

A nova OS representa o novo estado.

Essa abordagem é segura e didática para entender transformação de estado.

Em sistemas reais, algumas entidades serão mutáveis. Outras serão imutáveis. O importante é entender o modelo escolhido.

---

## Não confundir relacionamento com bagunça

Relacionar objetos não significa deixar qualquer objeto chamar qualquer coisa.

Exemplo ruim:

```java
os.atividade().tecnico().nome().toUpperCase();
```

Esse tipo de cadeia cria dependência demais.

Melhor:

```java
os.resumo()
```

ou:

```java
atividade.tecnicoDisponivel()
```

A ideia é:

```text
um objeto deve oferecer comportamentos úteis;
outros objetos não devem precisar vasculhar seus detalhes internos.
```

Esse cuidado fica cada vez mais importante conforme o sistema cresce.

---

## Exemplo 3 — Mensagem com objetos colaborando

Agora vamos usar um exemplo menor de mensageria.

Crie o arquivo:

```text
RelacionamentoMensagem.java
```

Código:

```java
public class RelacionamentoMensagem {
    public static void main(String[] args) {
        DestinatarioRelacionamento destinatario = new DestinatarioRelacionamento(
                "Ana Silva",
                "11999999999"
        );

        ConteudoMensagemRelacionamento conteudo = new ConteudoMensagemRelacionamento(
                "boas_vindas",
                "Olá, Ana! Seja bem-vinda."
        );

        MensagemRelacionamento mensagem = new MensagemRelacionamento(
                destinatario,
                conteudo,
                CanalRelacionamento.WHATSAPP,
                StatusMensagemRelacionamento.PENDENTE
        );

        System.out.println(mensagem.resumo());
        System.out.println("Pode enviar: " + mensagem.podeEnviar());

        MensagemRelacionamento enviada = mensagem.enviar();

        System.out.println("Depois do envio:");
        System.out.println(enviada.resumo());
    }
}

enum CanalRelacionamento {
    WHATSAPP,
    EMAIL,
    SMS
}

enum StatusMensagemRelacionamento {
    PENDENTE,
    ENVIADA,
    ERRO,
    CANCELADA
}

class MensagemRelacionamento {
    private final DestinatarioRelacionamento destinatario;
    private final ConteudoMensagemRelacionamento conteudo;
    private final CanalRelacionamento canal;
    private final StatusMensagemRelacionamento status;

    MensagemRelacionamento(
            DestinatarioRelacionamento destinatario,
            ConteudoMensagemRelacionamento conteudo,
            CanalRelacionamento canal,
            StatusMensagemRelacionamento status
    ) {
        if (destinatario == null) {
            throw new IllegalArgumentException("Destinatário é obrigatório.");
        }

        if (conteudo == null) {
            throw new IllegalArgumentException("Conteúdo é obrigatório.");
        }

        if (canal == null) {
            throw new IllegalArgumentException("Canal é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.destinatario = destinatario;
        this.conteudo = conteudo;
        this.canal = canal;
        this.status = status;
    }

    boolean podeEnviar() {
        return status == StatusMensagemRelacionamento.PENDENTE
                && destinatario.contatoValido()
                && conteudo.prontoParaEnvio();
    }

    MensagemRelacionamento enviar() {
        if (!podeEnviar()) {
            throw new IllegalStateException("Mensagem não pode ser enviada.");
        }

        return new MensagemRelacionamento(
                destinatario,
                conteudo,
                canal,
                StatusMensagemRelacionamento.ENVIADA
        );
    }

    String resumo() {
        return "Destinatário: " + destinatario.resumo()
                + "\nConteúdo: " + conteudo.resumo()
                + "\nCanal: " + canal
                + "\nStatus: " + status;
    }
}

class DestinatarioRelacionamento {
    private final String nome;
    private final String contato;

    DestinatarioRelacionamento(String nome, String contato) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(contato)) {
            throw new IllegalArgumentException("Contato é obrigatório.");
        }

        this.nome = nome;
        this.contato = contato;
    }

    boolean contatoValido() {
        return contato.length() >= 8;
    }

    String resumo() {
        return nome + " | Contato: " + contato;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ConteudoMensagemRelacionamento {
    private final String modelo;
    private final String texto;

    ConteudoMensagemRelacionamento(String modelo, String texto) {
        if (!textoInformado(modelo)) {
            throw new IllegalArgumentException("Modelo é obrigatório.");
        }

        if (!textoInformado(texto)) {
            throw new IllegalArgumentException("Texto é obrigatório.");
        }

        this.modelo = modelo;
        this.texto = texto;
    }

    boolean prontoParaEnvio() {
        return texto.length() <= 500;
    }

    String resumo() {
        return "Modelo: " + modelo + " | Texto: " + texto;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Esse exemplo reforça a mesma ideia:

```text
Mensagem depende de Destinatario e ConteudoMensagem.
Destinatario sabe validar contato.
ConteudoMensagem sabe se está pronto para envio.
Mensagem coordena a regra podeEnviar.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido

Digite e execute:

```text
RelacionamentoPedido.java
```

Depois altere:

```text
cliente ativo para false;
status do pagamento para PENDENTE;
valor do pagamento para menor que o total;
percentual do cupom para 20.
```

Observe como muda:

```text
podeFinalizar;
totalComDesconto.
```

### Parte 2 — OS

Digite e execute:

```text
RelacionamentoOrdemServico.java
```

Depois altere:

```text
técnico ativo para false;
status da OS para CONCLUIDA;
status da atividade para CANCELADA;
data do período para ontem.
```

Observe como muda:

```text
podeExecutar;
podeReagendar.
```

### Parte 3 — Mensagem

Digite e execute:

```text
RelacionamentoMensagem.java
```

Depois teste:

```text
destinatário com contato curto;
conteúdo vazio;
status ENVIADA;
status CANCELADA.
```

Observe quando `podeEnviar` retorna `false`.

### Parte 4 — Identificar relações

Para cada exemplo, escreva:

```text
quais objetos são atributos;
quais objetos são recebidos como parâmetro;
quais objetos colaboram em uma regra;
qual objeto coordena a regra principal.
```

---

## Desafio prático

Crie o arquivo:

```text
RelacionamentoContrato.java
```

Modele um contrato com relacionamento entre objetos.

Objetos sugeridos:

```text
ContratoRelacionamento;
ClienteCorporativoRelacionamento;
ServicoContratadoRelacionamento;
VigenciaContratoRelacionamento;
PagamentoContratoRelacionamento.
```

Use:

```java
BigDecimal para valor;
LocalDate para datas;
enum StatusContrato;
enum StatusPagamentoContrato.
```

Regras:

```text
Contrato tem cliente corporativo.
Contrato tem serviço contratado.
Contrato tem vigência.
Contrato tem pagamento.
Cliente corporativo precisa estar ativo.
Serviço contratado precisa ter valor mensal maior que zero.
Vigência precisa ter data final depois da inicial.
Pagamento precisa estar aprovado ou confirmado.
Contrato pode ativar se cliente estiver ativo, vigência for válida e pagamento estiver aprovado ou confirmado.
```

Métodos esperados:

```text
contrato.podeAtivar()
contrato.valorTotal()
contrato.resumo()

cliente.ativo()
servico.valorMensal()
vigencia.quantidadeMeses()
vigencia.valida()
pagamento.aprovadoOuConfirmado()
```

Aplique validações nos construtores.

Depois teste cenários:

```text
cliente inativo;
pagamento pendente;
vigência inválida;
serviço com valor zero;
contrato válido.
```

---

## Erros comuns

### 1. Objeto principal fazendo tudo

Se o pedido valida cliente, item, pagamento e cupom sozinho, ele está centralizando demais.

### 2. Objeto conhecendo detalhe interno demais

Evite cadeias longas como:

```java
pedido.cliente().endereco().cidade().trim().toUpperCase()
```

### 3. Transformar tudo em atributo

Nem todo objeto usado precisa ser guardado como estado.

Cupom pode ser parâmetro de uma operação.

### 4. Transformar tudo em parâmetro

Se o objeto faz parte do estado principal, ele deve ser atributo.

### 5. Ignorar null em objetos relacionados

Objetos obrigatórios devem ser validados no construtor.

### 6. Usar String para relacionamento importante

Status, canal, turno e forma de pagamento merecem enum quando os valores são controlados.

### 7. Não delegar comportamento

Se o pagamento sabe se está aprovado, deixe o pagamento responder.

### 8. Criar acoplamento exagerado

Relacionamento bom usa comportamento. Relacionamento ruim vasculha detalhe interno.

---

## Debug recomendado

Use debug em:

```text
RelacionamentoPedido.java
RelacionamentoOrdemServico.java
RelacionamentoMensagem.java
```

No pedido, coloque breakpoint em:

```java
pedido.podeFinalizar()
pedido.totalComDesconto(cupom)
```

Entre nos métodos:

```text
cliente.aptoParaComprar;
item.valido;
pagamento.aprovadoOuConfirmado;
pagamento.valorCobre;
cupom.aplicarSobre.
```

Na OS, entre em:

```text
os.podeExecutar;
atividade.podeExecutar;
tecnico.disponivelParaAtendimento;
periodo.futuroOuHoje;
os.reagendar;
atividade.reagendar.
```

Na mensagem, entre em:

```text
mensagem.podeEnviar;
destinatario.contatoValido;
conteudo.prontoParaEnvio;
mensagem.enviar.
```

Observe objetos chamando outros objetos para compor uma decisão.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre composição e dependência por parâmetro?
2. Qual objeto delegou uma regra para outro objeto?
3. Qual exemplo mostrou acoplamento que deve ser evitado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar relacionamento entre objetos;
identificar composição;
identificar dependência por parâmetro;
entender colaboração entre objetos;
criar métodos que recebem objetos;
delegar regra para o objeto correto;
evitar classe centralizadora demais;
evitar cadeias longas de acesso;
usar BigDecimal, LocalDate e enum nos modelos;
validar objetos obrigatórios;
debugar chamadas entre objetos;
resolver o desafio de contrato;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-115-relacionamento-entre-objetos
git commit -m "Aula 115: pratica relacionamento entre objetos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
objetos não apenas existem; eles colaboram.
```

Um bom modelo orientado a objetos não coloca tudo em uma classe central.

Ele distribui responsabilidades:

```text
Cliente responde sobre cliente.
Item responde sobre item.
Pagamento responde sobre pagamento.
Atividade responde sobre atividade.
Período responde sobre período.
Mensagem coordena destinatário e conteúdo.
Pedido coordena cliente, item e pagamento.
```

Relacionamento entre objetos é o começo de uma modelagem mais profissional.

Na próxima aula, vamos estudar objetos de valor com mais profundidade.

Vamos entender melhor quando criar objetos pequenos e imutáveis para representar conceitos importantes como dinheiro, e-mail, telefone, período, código e identificadores.
