# 114 — M4.10 — Composição

## Objetivo da aula

Nesta aula você vai aprender composição em Orientação a Objetos com Java.

Nas aulas anteriores, você estudou:

```text
classe;
objeto;
atributos;
métodos de comportamento;
construtores;
encapsulamento;
getters e setters com critério;
imutabilidade aplicada.
```

Agora vamos avançar para uma das ideias mais importantes da modelagem orientada a objetos:

```text
um objeto pode ser formado por outros objetos.
```

Isso é composição.

Ao final da aula, você deve conseguir:

```text
explicar o que é composição;
entender a relação "tem um";
diferenciar atributo simples de atributo composto;
identificar quando uma classe está grande demais;
modelar objetos menores com responsabilidades melhores;
criar classes Java que usam outras classes;
validar objetos compostos obrigatórios;
evitar tudo como String, int, double e boolean;
usar BigDecimal, LocalDate e enum em modelos compostos;
aplicar composição em domínios de backend como pedido, cliente, pagamento e ordem de serviço.
```

Essa aula é essencial porque sistemas backend reais raramente são formados por objetos isolados.

Um pedido tem cliente.  
Um cliente tem endereço.  
Um pedido tem itens.  
Um item tem produto.  
Um pagamento tem forma, status e valor.  
Uma ordem de serviço tem cliente, endereço de atendimento e atividades.

Se você modelar tudo em uma classe só, o código cresce rápido e fica difícil de manter. Com composição, você divide o problema em objetos menores e mais claros.

---

## A ideia central

Composição é quando uma classe possui outra classe como parte do seu estado.

Exemplo:

```java
class Cliente {
    private final Endereco endereco;
}
```

Nesse caso:

```text
Cliente tem um Endereco.
```

`Endereco` não é uma `String`.  
`Endereco` é outro objeto, com seus próprios dados e suas próprias regras.

Isso muda a qualidade do modelo.

Sem composição:

```java
class Cliente {
    private final String rua;
    private final String numero;
    private final String cidade;
    private final String estado;
    private final String cep;
}
```

Com composição:

```java
class Cliente {
    private final Endereco endereco;
}
```

Agora `Cliente` não precisa carregar todos os detalhes do endereço diretamente.

O endereço vira um conceito próprio.

---

## Composição representa "tem um"

Uma forma simples de identificar composição é perguntar:

```text
esse objeto tem outro objeto?
```

Exemplos:

```text
Cliente tem Endereco.
Pedido tem Cliente.
Pedido tem Pagamento.
Pedido tem ItemPedido.
ItemPedido tem Produto.
OrdemServico tem Atividade.
Atividade tem PeriodoAtendimento.
Pagamento tem Dinheiro.
Contrato tem ClienteCorporativo.
```

Composição é uma relação de posse, formação ou dependência estrutural.

Nesta aula, pense assim:

```text
composição = tem um.
```

Mais adiante, quando estudarmos herança, veremos outro tipo de relação:

```text
é um.
```

Exemplo futuro:

```text
Gerente é um Funcionário.
PagamentoPix é um Pagamento.
ClientePessoaFisica é um Cliente.
```

Mas agora o foco é composição.

---

## Por que composição importa no backend

Em backend, você trabalha com modelos que representam conceitos reais do sistema.

Exemplos:

```text
pedido;
cliente;
produto;
pagamento;
ordem de serviço;
atividade;
contrato;
mensagem;
auditoria;
cotação;
remuneração.
```

Esses conceitos normalmente se relacionam.

Um erro comum é colocar tudo em uma classe só.

Exemplo ruim:

```java
class Pedido {
    private String nomeCliente;
    private String emailCliente;
    private String ruaCliente;
    private String numeroCliente;
    private String cidadeCliente;
    private String estadoCliente;
    private String nomeProduto;
    private int quantidadeProduto;
    private double valorProduto;
    private String formaPagamento;
    private String statusPagamento;
}
```

Essa classe mistura:

```text
pedido;
cliente;
endereço;
produto;
item do pedido;
pagamento.
```

Além disso, usa tipos fracos para conceitos importantes:

```text
double para dinheiro;
String para status;
String para forma de pagamento.
```

Depois do que já estudamos, queremos melhorar isso.

Um modelo mais forte seria:

```java
class Pedido {
    private final ClientePedido cliente;
    private final ItemPedido item;
    private final PagamentoPedido pagamento;
}
```

Agora cada parte tem um nome e uma responsabilidade.

---

## Sinais de que uma classe precisa de composição

Uma classe provavelmente precisa ser quebrada em objetos menores quando possui:

```text
muitos atributos;
muitos atributos com prefixos repetidos;
construtor com parâmetros demais;
dados de conceitos diferentes misturados;
validações de assuntos diferentes no mesmo lugar;
métodos grandes que montam resumo de tudo;
dificuldade para explicar a responsabilidade da classe;
dificuldade para testar uma regra isolada.
```

Exemplo de prefixos repetidos:

```java
private String clienteNome;
private String clienteEmail;
private String clienteTelefone;

private String enderecoRua;
private String enderecoNumero;
private String enderecoCidade;

private String pagamentoForma;
private String pagamentoStatus;
private BigDecimal pagamentoValor;
```

Esses prefixos estão praticamente gritando que existem objetos escondidos:

```text
Cliente;
Endereco;
Pagamento.
```

---

## Modelo ruim: tudo dentro de Pedido

Antes de escrever o modelo bom, veja o problema.

Um pedido grande demais poderia nascer assim:

```java
class PedidoRuim {
    private final int numero;

    private final String clienteNome;
    private final String clienteEmail;
    private final String clienteTelefone;

    private final String enderecoRua;
    private final String enderecoNumero;
    private final String enderecoCidade;
    private final String enderecoEstado;

    private final String produtoNome;
    private final int produtoQuantidade;
    private final BigDecimal produtoValorUnitario;

    private final String formaPagamento;
    private final String statusPagamento;
    private final BigDecimal valorPago;
}
```

Mesmo usando `BigDecimal`, ainda está ruim.

O problema não é apenas tipo.

O problema é responsabilidade misturada.

A classe `PedidoRuim` está carregando informações de cliente, endereço, produto e pagamento.

Composição resolve isso melhor.

---

## Modelo melhor: Pedido composto

Vamos criar um modelo de pedido com composição.

Crie a pasta:

```powershell
mkdir labs\m4\aula-114-composicao
cd labs\m4\aula-114-composicao
```

Crie o arquivo:

```text
ComposicaoPedidoCompleto.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ComposicaoPedidoCompleto {
    public static void main(String[] args) {
        EnderecoEntrega endereco = new EnderecoEntrega(
                "Rua das Flores",
                "123",
                "Barueri",
                "SP",
                "06400-000"
        );

        ClienteDoPedido cliente = new ClienteDoPedido(
                "Ana Silva",
                "ana@email.com",
                "11999999999",
                endereco
        );

        ProdutoDoPedido produto = new ProdutoDoPedido(
                "NOTE-001",
                "Notebook",
                new BigDecimal("3500.00")
        );

        ItemPedidoComposto item = new ItemPedidoComposto(
                produto,
                2
        );

        PagamentoDoPedido pagamento = new PagamentoDoPedido(
                FormaPagamento.PIX,
                StatusPagamento.APROVADO,
                item.subtotal()
        );

        PedidoComposto pedido = new PedidoComposto(
                1001,
                cliente,
                item,
                pagamento
        );

        System.out.println(pedido.resumo());
        System.out.println("Pedido pago: " + pedido.pago());
        System.out.println("Total do pedido: " + pedido.totalFormatado());
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

enum StatusPagamento {
    PENDENTE,
    APROVADO,
    CONFIRMADO,
    CANCELADO
}

class PedidoComposto {
    private final int numero;
    private final ClienteDoPedido cliente;
    private final ItemPedidoComposto item;
    private final PagamentoDoPedido pagamento;

    PedidoComposto(
            int numero,
            ClienteDoPedido cliente,
            ItemPedidoComposto item,
            PagamentoDoPedido pagamento
    ) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (item == null) {
            throw new IllegalArgumentException("Item do pedido é obrigatório.");
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

    String totalFormatado() {
        return "R$ " + total().setScale(2, RoundingMode.HALF_UP);
    }

    boolean pago() {
        return pagamento.aprovado() || pagamento.confirmado();
    }

    String resumo() {
        return "Pedido: " + numero
                + "\nCliente: " + cliente.resumo()
                + "\nItem: " + item.resumo()
                + "\nPagamento: " + pagamento.resumo()
                + "\nTotal: " + totalFormatado();
    }
}

class ClienteDoPedido {
    private final String nome;
    private final String email;
    private final String telefone;
    private final EnderecoEntrega endereco;

    ClienteDoPedido(String nome, String email, String telefone, EnderecoEntrega endereco) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (!textoInformado(email)) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }

        if (!email.contains("@")) {
            throw new IllegalArgumentException("E-mail do cliente deve conter @.");
        }

        if (!textoInformado(telefone)) {
            throw new IllegalArgumentException("Telefone do cliente é obrigatório.");
        }

        if (endereco == null) {
            throw new IllegalArgumentException("Endereço do cliente é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    String resumo() {
        return nome + " <" + email + "> | Telefone: " + telefone + " | Endereço: " + endereco.formatado();
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class EnderecoEntrega {
    private final String rua;
    private final String numero;
    private final String cidade;
    private final String estado;
    private final String cep;

    EnderecoEntrega(String rua, String numero, String cidade, String estado, String cep) {
        if (!textoInformado(rua)) {
            throw new IllegalArgumentException("Rua é obrigatória.");
        }

        if (!textoInformado(numero)) {
            throw new IllegalArgumentException("Número é obrigatório.");
        }

        if (!textoInformado(cidade)) {
            throw new IllegalArgumentException("Cidade é obrigatória.");
        }

        if (!textoInformado(estado)) {
            throw new IllegalArgumentException("Estado é obrigatório.");
        }

        if (estado.length() != 2) {
            throw new IllegalArgumentException("Estado deve ter 2 caracteres. Exemplo: SP.");
        }

        if (!textoInformado(cep)) {
            throw new IllegalArgumentException("CEP é obrigatório.");
        }

        this.rua = rua;
        this.numero = numero;
        this.cidade = cidade;
        this.estado = estado.toUpperCase();
        this.cep = cep;
    }

    String formatado() {
        return rua + ", " + numero + " - " + cidade + "/" + estado + " - CEP " + cep;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ProdutoDoPedido {
    private final String codigo;
    private final String nome;
    private final BigDecimal valorUnitario;

    ProdutoDoPedido(String codigo, String nome, BigDecimal valorUnitario) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código do produto é obrigatório.");
        }

        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
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
        return codigo + " - " + nome + " | Valor unitário: R$ " + valorUnitario;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ItemPedidoComposto {
    private final ProdutoDoPedido produto;
    private final int quantidade;

    ItemPedidoComposto(ProdutoDoPedido produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.produto = produto;
        this.quantidade = quantidade;
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

class PagamentoDoPedido {
    private final FormaPagamento forma;
    private final StatusPagamento status;
    private final BigDecimal valor;

    PagamentoDoPedido(FormaPagamento forma, StatusPagamento status, BigDecimal valor) {
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

    boolean aprovado() {
        return status == StatusPagamento.APROVADO;
    }

    boolean confirmado() {
        return status == StatusPagamento.CONFIRMADO;
    }

    String resumo() {
        return forma + " | Status: " + status + " | Valor: R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac ComposicaoPedidoCompleto.java
java ComposicaoPedidoCompleto
```

---

## O que esse código mostra

A classe principal ficou muito mais expressiva:

```java
class PedidoComposto {
    private final int numero;
    private final ClienteDoPedido cliente;
    private final ItemPedidoComposto item;
    private final PagamentoDoPedido pagamento;
}
```

Ela não carrega mais todos os dados soltos.

Ela é composta por objetos que representam partes reais do domínio:

```text
ClienteDoPedido;
EnderecoEntrega;
ProdutoDoPedido;
ItemPedidoComposto;
PagamentoDoPedido.
```

Cada objeto cuida do que faz sentido para ele.

`EnderecoEntrega` sabe formatar endereço.  
`ProdutoDoPedido` sabe seu valor unitário.  
`ItemPedidoComposto` sabe calcular subtotal.  
`PagamentoDoPedido` sabe se está aprovado ou confirmado.  
`PedidoComposto` coordena tudo e calcula o total.

Esse é o ponto central da composição:

```text
objetos menores colaborando para formar um objeto maior.
```

---

## Composição melhora o construtor

Compare um construtor ruim:

```java
Pedido(
        int numero,
        String nomeCliente,
        String emailCliente,
        String telefoneCliente,
        String rua,
        String numeroEndereco,
        String cidade,
        String estado,
        String cep,
        String codigoProduto,
        String nomeProduto,
        BigDecimal valorProduto,
        int quantidade,
        String formaPagamento,
        String statusPagamento
)
```

com:

```java
PedidoComposto(
        int numero,
        ClienteDoPedido cliente,
        ItemPedidoComposto item,
        PagamentoDoPedido pagamento
)
```

O segundo é muito mais claro.

Ele reduz o risco de inverter parâmetros do mesmo tipo.

Ele mostra os conceitos do domínio diretamente.

Quando um construtor começa a receber parâmetros demais, composição pode ser uma solução.

---

## Composição e validação

Com composição, a validação deve ficar o mais perto possível do objeto responsável.

Exemplo:

`EnderecoEntrega` valida:

```text
rua;
número;
cidade;
estado;
CEP.
```

`ProdutoDoPedido` valida:

```text
código;
nome;
valor unitário.
```

`ItemPedidoComposto` valida:

```text
produto;
quantidade.
```

`PagamentoDoPedido` valida:

```text
forma;
status;
valor.
```

`PedidoComposto` valida:

```text
número;
cliente obrigatório;
item obrigatório;
pagamento obrigatório.
```

Isso é melhor do que jogar todas as validações dentro de `PedidoComposto`.

Cada objeto protege sua própria consistência.

---

## Composição e null

Composição exige cuidado com `null`.

Quando uma classe tem um atributo composto:

```java
private final ClienteDoPedido cliente;
```

você precisa decidir:

```text
cliente é obrigatório?
```

Para um pedido, normalmente sim.

Então o construtor deve proteger:

```java
if (cliente == null) {
    throw new IllegalArgumentException("Cliente é obrigatório.");
}
```

O mesmo vale para:

```text
item;
pagamento;
endereco;
atividade;
periodo.
```

Um erro comum é aceitar objeto composto nulo e só descobrir o problema depois, quando o código quebra com `NullPointerException`.

Composição boa valida dependências obrigatórias no nascimento do objeto.

---

## Composição não significa criar classe para tudo

Composição é poderosa, mas não deve virar exagero.

Nem todo campo precisa virar uma classe própria imediatamente.

Pergunte:

```text
esse conceito tem regra própria?
esse conceito aparece em vários lugares?
esse conceito melhora a leitura?
esse conceito reduz repetição?
esse conceito tem comportamento?
esse conceito merece ser testado isoladamente?
```

Bons candidatos a objetos compostos:

```text
Endereco;
Cliente;
Pagamento;
ItemPedido;
Produto;
PeriodoAtendimento;
Dinheiro;
Email;
Telefone;
Atividade;
Auditoria.
```

Candidatos que podem esperar:

```text
uma descrição simples;
uma observação livre;
um texto sem regra;
um campo temporário sem comportamento.
```

Composição exige critério.

O objetivo não é criar classes demais.

O objetivo é separar conceitos que realmente merecem existir no modelo.

---

## Composição em Ordem de Serviço

Agora vamos aplicar composição em um domínio muito comum em sistemas corporativos: Ordem de Serviço.

Uma OS pode ter:

```text
código;
cliente;
endereço de atendimento;
atividade;
período de atendimento;
status.
```

Em vez de colocar tudo como `String`, vamos criar objetos.

Crie o arquivo:

```text
ComposicaoOrdemServico.java
```

Código:

```java
import java.time.LocalDate;

public class ComposicaoOrdemServico {
    public static void main(String[] args) {
        ClienteAtendimento cliente = new ClienteAtendimento(
                "Carlos Lima",
                "carlos@email.com",
                "11988887777"
        );

        EnderecoAtendimento endereco = new EnderecoAtendimento(
                "Avenida Central",
                "500",
                "Osasco",
                "SP"
        );

        PeriodoAtendimento periodo = new PeriodoAtendimento(
                LocalDate.now().plusDays(2),
                TurnoAtendimento.MANHA
        );

        AtividadeOs atividade = new AtividadeOs(
                "Montagem de móvel",
                periodo
        );

        OrdemServicoComposta ordemServico = new OrdemServicoComposta(
                "OS-2026-0001",
                cliente,
                endereco,
                atividade,
                StatusOs.AGENDADA
        );

        System.out.println(ordemServico.resumo());
        System.out.println("Pode reagendar: " + ordemServico.podeReagendar());
    }
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum TurnoAtendimento {
    MANHA,
    TARDE
}

class OrdemServicoComposta {
    private final String codigo;
    private final ClienteAtendimento cliente;
    private final EnderecoAtendimento endereco;
    private final AtividadeOs atividade;
    private final StatusOs status;

    OrdemServicoComposta(
            String codigo,
            ClienteAtendimento cliente,
            EnderecoAtendimento endereco,
            AtividadeOs atividade,
            StatusOs status
    ) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (endereco == null) {
            throw new IllegalArgumentException("Endereço de atendimento é obrigatório.");
        }

        if (atividade == null) {
            throw new IllegalArgumentException("Atividade é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status da OS é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.endereco = endereco;
        this.atividade = atividade;
        this.status = status;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean podeReagendar() {
        return !encerrada();
    }

    String resumo() {
        return "OS: " + codigo
                + "\nCliente: " + cliente.resumo()
                + "\nEndereço: " + endereco.formatado()
                + "\nAtividade: " + atividade.resumo()
                + "\nStatus: " + status;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class ClienteAtendimento {
    private final String nome;
    private final String email;
    private final String telefone;

    ClienteAtendimento(String nome, String email, String telefone) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (!textoInformado(email)) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }

        if (!email.contains("@")) {
            throw new IllegalArgumentException("E-mail do cliente deve conter @.");
        }

        if (!textoInformado(telefone)) {
            throw new IllegalArgumentException("Telefone do cliente é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    String resumo() {
        return nome + " <" + email + "> | Telefone: " + telefone;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class EnderecoAtendimento {
    private final String rua;
    private final String numero;
    private final String cidade;
    private final String estado;

    EnderecoAtendimento(String rua, String numero, String cidade, String estado) {
        if (!textoInformado(rua)) {
            throw new IllegalArgumentException("Rua é obrigatória.");
        }

        if (!textoInformado(numero)) {
            throw new IllegalArgumentException("Número é obrigatório.");
        }

        if (!textoInformado(cidade)) {
            throw new IllegalArgumentException("Cidade é obrigatória.");
        }

        if (!textoInformado(estado)) {
            throw new IllegalArgumentException("Estado é obrigatório.");
        }

        if (estado.length() != 2) {
            throw new IllegalArgumentException("Estado deve ter 2 caracteres.");
        }

        this.rua = rua;
        this.numero = numero;
        this.cidade = cidade;
        this.estado = estado.toUpperCase();
    }

    String formatado() {
        return rua + ", " + numero + " - " + cidade + "/" + estado;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class AtividadeOs {
    private final String descricao;
    private final PeriodoAtendimento periodo;

    AtividadeOs(String descricao, PeriodoAtendimento periodo) {
        if (!textoInformado(descricao)) {
            throw new IllegalArgumentException("Descrição da atividade é obrigatória.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período de atendimento é obrigatório.");
        }

        this.descricao = descricao;
        this.periodo = periodo;
    }

    String resumo() {
        return descricao + " | Período: " + periodo.resumo();
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class PeriodoAtendimento {
    private final LocalDate data;
    private final TurnoAtendimento turno;

    PeriodoAtendimento(LocalDate data, TurnoAtendimento turno) {
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
javac ComposicaoOrdemServico.java
java ComposicaoOrdemServico
```

---

## O que esse exemplo mostra

A `OrdemServicoComposta` não carrega tudo em campos simples.

Ela é formada por:

```text
ClienteAtendimento;
EnderecoAtendimento;
AtividadeOs;
StatusOs.
```

E `AtividadeOs` também é formada por outro objeto:

```text
PeriodoAtendimento.
```

Visualmente:

```text
OrdemServicoComposta
 ├── ClienteAtendimento
 ├── EnderecoAtendimento
 ├── AtividadeOs
 │    └── PeriodoAtendimento
 └── StatusOs
```

Isso é comum em backend.

Objetos maiores são formados por objetos menores.

---

## Onde colocar os comportamentos

Uma dúvida comum é:

```text
em qual classe coloco esse método?
```

Resposta inicial:

```text
coloque o comportamento perto dos dados que ele usa.
```

Exemplos:

`ItemPedidoComposto` calcula subtotal porque possui:

```text
produto;
quantidade.
```

`PeriodoAtendimento` responde sobre período porque possui:

```text
data;
turno.
```

`PagamentoDoPedido` responde se está aprovado porque possui:

```text
status.
```

`OrdemServicoComposta` responde se pode reagendar porque possui:

```text
status da OS.
```

`PedidoComposto` calcula total porque possui:

```text
item.
```

O objeto principal não deve fazer tudo.

Ele deve coordenar os objetos que o compõem.

---

## Composição e encapsulamento

Composição fica muito melhor quando os objetos compostos também são encapsulados.

Exemplo:

```java
private final ClienteDoPedido cliente;
```

O atributo `cliente` é `private` e `final`.

Isso significa:

```text
o PedidoComposto não troca de cliente depois de criado;
o acesso direto ao atributo não é liberado;
o cliente foi validado no construtor.
```

Mas atenção: `final` impede trocar a referência, não necessariamente impede que o objeto interno mude.

Se `ClienteDoPedido` tivesse métodos mutáveis, ele ainda poderia mudar internamente.

Por isso, composição segura depende de objetos internos bem modelados.

---

## Composição e imutabilidade

Na aula anterior, você estudou imutabilidade.

Composição se conecta diretamente com isso.

Um objeto composto pode ser mais seguro se suas partes também forem imutáveis.

Exemplo:

```java
class EnderecoEntrega {
    private final String rua;
    private final String numero;
    private final String cidade;
    private final String estado;
    private final String cep;
}
```

Sem setters, esse endereço não muda depois de criado.

Isso é bom porque endereço de entrega de um pedido muitas vezes deve representar o endereço usado naquele momento.

Se o cliente mudar de endereço no cadastro depois, o pedido antigo talvez deva continuar com o endereço original.

Esse tipo de decisão aparece muito em sistemas reais.

---

## Cuidado com acoplamento

Composição cria dependência entre classes.

Exemplo:

```java
class PedidoComposto {
    private final ClienteDoPedido cliente;
}
```

Agora `PedidoComposto` conhece `ClienteDoPedido`.

Isso é normal.

Mas se uma classe começa a conhecer detalhes demais de outra, pode ficar acoplada demais.

Exemplo ruim:

```java
class Pedido {
    String resumo() {
        return cliente.endereco().cidade().toUpperCase()
                + cliente.endereco().estado().toLowerCase()
                + cliente.email().trim()
                + cliente.telefone().replace("-", "");
    }
}
```

O pedido está entrando demais nos detalhes do cliente.

Melhor:

```java
cliente.resumo()
```

ou métodos mais específicos:

```java
cliente.contatoFormatado()
cliente.enderecoFormatado()
```

Regra prática:

```text
use o objeto composto pelo comportamento que ele oferece;
evite manipular detalhes internos demais.
```

---

## Composição com um item versus vários itens

Nesta aula usamos um pedido com um único `ItemPedidoComposto` para manter o foco.

Em um sistema real, pedido normalmente tem vários itens:

```text
Pedido tem uma lista de ItemPedido.
```

Mais adiante, quando avançarmos em coleções, vamos modelar:

```java
private final List<ItemPedido> itens;
```

Por enquanto, um item já é suficiente para entender a ideia.

O conceito é o mesmo:

```text
Pedido tem ItemPedido.
Pedido pode ter vários ItemPedido.
```

A composição continua sendo a base.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Ler o modelo ruim

Antes de executar qualquer código, responda:

```text
quais conceitos estão misturados em PedidoRuim?
quais atributos poderiam virar objetos?
qual risco existe em construtores com muitos parâmetros?
```

### Parte 2 — Executar pedido composto

Digite e execute:

```text
ComposicaoPedidoCompleto.java
```

Depois altere:

```text
valor do produto;
quantidade;
status do pagamento;
forma de pagamento.
```

Observe como isso afeta:

```text
subtotal;
total;
pago.
```

### Parte 3 — Testar validações

No pedido composto, teste:

```text
cliente nulo;
item nulo;
pagamento nulo;
quantidade zero;
valor unitário zero;
e-mail sem @;
estado com mais de 2 caracteres.
```

Observe onde cada erro acontece.

A ideia é perceber que cada objeto valida sua parte.

### Parte 4 — Executar OS composta

Digite e execute:

```text
ComposicaoOrdemServico.java
```

Depois altere:

```text
status para CONCLUIDA;
status para CANCELADA;
turno;
data do período.
```

Observe como muda:

```text
podeReagendar.
```

### Parte 5 — Debug da composição

Use debug em:

```text
ComposicaoPedidoCompleto.java
```

Coloque breakpoint em:

```java
PedidoComposto pedido = new PedidoComposto(
```

Depois entre em:

```java
pedido.resumo()
```

Observe a chamada passando por:

```text
PedidoComposto.resumo;
ClienteDoPedido.resumo;
EnderecoEntrega.formatado;
ItemPedidoComposto.resumo;
ItemPedidoComposto.subtotal;
PagamentoDoPedido.resumo.
```

Esse é o objeto composto funcionando.

---

## Desafio prático

Crie o arquivo:

```text
ComposicaoMensageria.java
```

Modele um envio de mensagem usando composição.

Objetos sugeridos:

```text
Mensagem;
Destinatario;
ConteudoMensagem;
CanalEnvio.
```

Use enums:

```java
enum TipoCanal {
    WHATSAPP,
    EMAIL,
    SMS
}

enum StatusMensagem {
    PENDENTE,
    ENVIADA,
    ERRO,
    CANCELADA
}
```

Regras:

```text
Mensagem tem Destinatario.
Mensagem tem ConteudoMensagem.
Mensagem tem TipoCanal.
Mensagem tem StatusMensagem.
Destinatario deve ter nome e contato.
ConteudoMensagem deve ter modelo e texto.
Mensagem só pode enviar se status for PENDENTE.
Mensagem cancelada não pode ser enviada.
Mensagem enviada não pode ser cancelada.
```

Métodos sugeridos:

```text
Mensagem.podeEnviar()
Mensagem.enviar()
Mensagem.cancelar(String motivo)
Mensagem.resumo()

Destinatario.resumo()
ConteudoMensagem.resumo()
```

Exemplo esperado de uso:

```java
Destinatario destinatario = new Destinatario("Ana Silva", "11999999999");
ConteudoMensagem conteudo = new ConteudoMensagem("boas_vindas", "Olá, Ana! Seja bem-vinda.");

Mensagem mensagem = new Mensagem(
        destinatario,
        conteudo,
        TipoCanal.WHATSAPP,
        StatusMensagem.PENDENTE
);

System.out.println(mensagem.resumo());
System.out.println("Pode enviar: " + mensagem.podeEnviar());

mensagem.enviar();

System.out.println(mensagem.resumo());
```

Aplique validações nos construtores.

Não aceite objetos compostos nulos.

---

## Erros comuns

### 1. Criar classe gigante

Se uma classe tem dados de muitos conceitos, procure objetos escondidos.

### 2. Usar String para tudo

Status, forma de pagamento, turno e data podem ter tipos melhores.

Prefira:

```text
enum;
LocalDate;
BigDecimal;
objetos próprios.
```

### 3. Jogar todas as validações na classe principal

Cada objeto deve proteger sua própria regra.

### 4. Aceitar null sem pensar

Se um objeto composto é obrigatório, valide no construtor.

### 5. Criar classe para qualquer campo simples

Composição deve ter critério. Nem todo texto precisa virar classe imediatamente.

### 6. Fazer o objeto principal conhecer detalhes demais

Prefira chamar comportamentos dos objetos compostos.

### 7. Confundir composição com herança

Composição é "tem um".  
Herança será estudada depois e representa outro tipo de relação.

---

## Debug recomendado

Use debug em:

```text
ComposicaoPedidoCompleto.java
ComposicaoOrdemServico.java
```

Observe:

```text
criação dos objetos menores;
validações nos construtores;
passagem dos objetos para o objeto maior;
objeto principal guardando referências;
métodos do objeto principal chamando métodos dos objetos compostos.
```

Breakpoints recomendados:

```java
new EnderecoEntrega(...)
new ClienteDoPedido(...)
new ItemPedidoComposto(...)
new PagamentoDoPedido(...)
new PedidoComposto(...)

pedido.resumo()
pedido.total()
pedido.pago()
```

No exemplo da OS:

```java
new PeriodoAtendimento(...)
new AtividadeOs(...)
new OrdemServicoComposta(...)

ordemServico.resumo()
ordemServico.podeReagendar()
```

O objetivo do debug é enxergar que o objeto maior é formado por objetos menores.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa composição?
2. Qual exemplo da aula representa melhor a relação "tem um"?
3. Qual classe ficou mais simples depois que extraímos objetos menores?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar composição;
identificar relação "tem um";
criar uma classe com atributo de outro tipo;
separar dados de cliente, endereço, produto, item e pagamento;
usar BigDecimal para dinheiro;
usar enum para status, forma de pagamento e turno;
usar LocalDate para data;
validar objetos compostos obrigatórios;
evitar classes gigantes;
colocar validação no objeto correto;
entender acoplamento básico entre objetos;
debugar objetos compostos;
resolver o desafio de mensageria com composição;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-114-composicao
git commit -m "Aula 114: pratica composicao em orientacao a objetos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
objetos grandes podem ser formados por objetos menores.
```

Composição ajuda a transformar dados soltos em conceitos do domínio.

Em vez de um `Pedido` com muitos campos de cliente, endereço, produto e pagamento, criamos objetos como:

```text
ClienteDoPedido;
EnderecoEntrega;
ItemPedidoComposto;
PagamentoDoPedido.
```

Em vez de uma `OrdemServico` cheia de campos soltos, criamos:

```text
ClienteAtendimento;
EnderecoAtendimento;
AtividadeOs;
PeriodoAtendimento.
```

Isso melhora leitura, manutenção, debug e evolução.

Na próxima aula, vamos estudar relacionamento entre objetos com mais cuidado.

Vamos entender melhor como objetos colaboram, quando um objeto depende de outro, como evitar acoplamento exagerado e como modelar relações de forma mais profissional.
