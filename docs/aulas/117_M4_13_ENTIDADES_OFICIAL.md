# 117 — M4.13 — Entidades

## Objetivo da aula

Nesta aula você vai aprender o que são entidades em Orientação a Objetos com Java.

Na aula anterior, você estudou objetos de valor: objetos pequenos, geralmente imutáveis, definidos pelo valor que carregam, como `Email`, `Telefone`, `Dinheiro`, `Periodo` e `Codigo`.

Agora vamos estudar outro tipo de objeto fundamental:

```text
entidade.
```

Entidade é um objeto que possui identidade e ciclo de vida.

Exemplos:

```text
Cliente;
Pedido;
Produto;
Pagamento;
OrdemServico;
Contrato;
Usuario;
Atividade;
Cotacao.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é entidade;
diferenciar entidade de objeto de valor;
entender identidade;
entender ciclo de vida;
modelar entidades com atributos e comportamentos;
usar objetos de valor dentro de entidades;
proteger mudanças de estado;
evitar entidade anêmica;
entender por que entidade costuma ter operações de domínio;
aplicar entidades em exemplos de backend.
```

Essa aula é muito importante porque a maior parte dos sistemas backend trabalha com entidades.

Você cadastra cliente.  
Você cria pedido.  
Você atualiza produto.  
Você conclui ordem de serviço.  
Você aprova pagamento.  
Você cancela contrato.  

Essas coisas normalmente são entidades.

---

## A ideia central

Entidade é um objeto identificado por uma identidade própria.

Mesmo que alguns dados mudem, a entidade continua sendo a mesma.

Exemplo:

```text
Cliente id 10 se chama Ana.
Depois o e-mail da Ana muda.
Mesmo assim, continua sendo o Cliente id 10.
```

Outro exemplo:

```text
Pedido 1001 começa como CRIADO.
Depois vira PAGO.
Depois vira ENVIADO.
Depois vira ENTREGUE.
Mesmo mudando de status, continua sendo o Pedido 1001.
```

Esse é o ponto central:

```text
entidade permanece a mesma ao longo do tempo, mesmo que seus dados mudem.
```

Objeto de valor não funciona assim.

Se um e-mail muda, é outro e-mail.  
Se um valor monetário muda, é outro valor.  
Se um período muda, é outro período.  

Mas uma entidade tem continuidade.

---

## Entidade versus objeto de valor

Compare:

```text
Email é objeto de valor.
Cliente é entidade.
```

O e-mail é identificado pelo valor:

```text
ana@email.com
```

O cliente é identificado por sua identidade:

```text
Cliente id 10
```

Dois clientes podem ter o mesmo nome:

```text
Cliente id 10: Ana Silva
Cliente id 25: Ana Silva
```

Eles não são o mesmo cliente.

Mas dois objetos `EmailValor` com o mesmo valor:

```text
ana@email.com
ana@email.com
```

representam o mesmo e-mail conceitualmente.

Regra prática:

```text
objeto de valor é definido pelo valor;
entidade é definida pela identidade.
```

---

## Características comuns de uma entidade

Uma entidade normalmente possui:

```text
identificador;
estado atual;
ciclo de vida;
operações de domínio;
regras de transição;
validação;
composição com objetos de valor;
composição com outras entidades ou objetos;
mudanças controladas ao longo do tempo.
```

Exemplos de identidade:

```text
id do banco;
código do pedido;
código da OS;
matrícula do usuário;
número do contrato;
SKU do produto.
```

Exemplos de ciclo de vida:

```text
Pedido: CRIADO -> PAGO -> ENVIADO -> ENTREGUE -> CANCELADO
Pagamento: PENDENTE -> APROVADO -> CONFIRMADO -> CANCELADO
OrdemServico: AGENDADA -> REAGENDADA -> CONCLUIDA -> CANCELADA
Cliente: ATIVO -> BLOQUEADO -> INATIVO
Produto: ATIVO -> INATIVO
```

Entidade tem história.

Objeto de valor representa uma informação.

---

## Entidade não é só tabela do banco

Um erro comum é achar que entidade é apenas uma tabela do banco transformada em classe.

Exemplo fraco:

```java
class Cliente {
    private Long id;
    private String nome;
    private String email;
    private boolean ativo;
}
```

Isso pode até representar dados de uma tabela, mas ainda não expressa comportamento.

Uma entidade melhor responde perguntas e protege mudanças:

```java
boolean ativo()
void alterarEmail(Email email)
void inativar(String motivo)
void reativar()
boolean podeComprar()
```

Entidade não é só estrutura de dados.

Entidade deve representar comportamento importante do domínio.

---

## Exemplo ruim: entidade anêmica

Crie a pasta:

```powershell
mkdir labs\m4\aula-117-entidades
cd labs\m4\aula-117-entidades
```

Crie o arquivo:

```text
ClienteAnemico.java
```

Código:

```java
public class ClienteAnemico {
    public static void main(String[] args) {
        ClienteAnemicoModelo cliente = new ClienteAnemicoModelo();

        cliente.setId(10);
        cliente.setNome("Ana Silva");
        cliente.setEmail("anaemail.com");
        cliente.setAtivo(true);

        System.out.println("Cliente criado:");
        System.out.println(cliente.resumo());

        cliente.setEmail("");
        cliente.setAtivo(false);

        System.out.println("Cliente alterado de forma perigosa:");
        System.out.println(cliente.resumo());
    }
}

class ClienteAnemicoModelo {
    private int id;
    private String nome;
    private String email;
    private boolean ativo;

    void setId(int id) {
        this.id = id;
    }

    void setNome(String nome) {
        this.nome = nome;
    }

    void setEmail(String email) {
        this.email = email;
    }

    void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    String resumo() {
        return "Id: " + id
                + " | Nome: " + nome
                + " | E-mail: " + email
                + " | Ativo: " + ativo;
    }
}
```

Compile e execute:

```powershell
javac ClienteAnemico.java
java ClienteAnemico
```

O código compila.

Mas permite:

```text
e-mail inválido;
nome vazio;
id inválido;
alteração livre de ativo;
nenhuma regra protegida.
```

Isso é uma entidade anêmica.

Ela tem dados, mas não protege comportamento.

---

## Melhorando com identidade e objetos de valor

Agora vamos modelar `Cliente` como entidade.

Ela terá identidade e usará objeto de valor para e-mail.

Crie o arquivo:

```text
ClienteEntidade.java
```

Código:

```java
public class ClienteEntidade {
    public static void main(String[] args) {
        EmailClienteEntidade email = new EmailClienteEntidade("ana@email.com");

        ClienteEntidadeModelo cliente = new ClienteEntidadeModelo(
                10,
                "Ana Silva",
                email
        );

        System.out.println("Cliente inicial:");
        System.out.println(cliente.resumo());
        System.out.println("Pode comprar: " + cliente.podeComprar());

        cliente.alterarEmail(new EmailClienteEntidade("ana.novo@email.com"));
        System.out.println("Depois de alterar e-mail:");
        System.out.println(cliente.resumo());

        cliente.inativar("Solicitação do cliente");
        System.out.println("Depois de inativar:");
        System.out.println(cliente.resumo());
        System.out.println("Pode comprar: " + cliente.podeComprar());

        cliente.reativar();
        System.out.println("Depois de reativar:");
        System.out.println(cliente.resumo());
    }
}

enum StatusClienteEntidade {
    ATIVO,
    INATIVO,
    BLOQUEADO
}

class ClienteEntidadeModelo {
    private final int id;
    private final String nome;
    private EmailClienteEntidade email;
    private StatusClienteEntidade status;
    private String motivoInativacao;

    ClienteEntidadeModelo(int id, String nome, EmailClienteEntidade email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (email == null) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.status = StatusClienteEntidade.ATIVO;
        this.motivoInativacao = "";
    }

    int id() {
        return id;
    }

    String nome() {
        return nome;
    }

    EmailClienteEntidade email() {
        return email;
    }

    StatusClienteEntidade status() {
        return status;
    }

    boolean ativo() {
        return status == StatusClienteEntidade.ATIVO;
    }

    boolean podeComprar() {
        return ativo();
    }

    void alterarEmail(EmailClienteEntidade novoEmail) {
        if (novoEmail == null) {
            throw new IllegalArgumentException("Novo e-mail é obrigatório.");
        }

        if (!ativo()) {
            throw new IllegalStateException("Cliente inativo não pode alterar e-mail.");
        }

        this.email = novoEmail;
    }

    void inativar(String motivo) {
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo da inativação é obrigatório.");
        }

        if (status == StatusClienteEntidade.BLOQUEADO) {
            throw new IllegalStateException("Cliente bloqueado não pode ser inativado por este fluxo.");
        }

        status = StatusClienteEntidade.INATIVO;
        motivoInativacao = motivo;
    }

    void bloquear(String motivo) {
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo do bloqueio é obrigatório.");
        }

        status = StatusClienteEntidade.BLOQUEADO;
        motivoInativacao = motivo;
    }

    void reativar() {
        if (status == StatusClienteEntidade.BLOQUEADO) {
            throw new IllegalStateException("Cliente bloqueado precisa de análise antes de reativar.");
        }

        status = StatusClienteEntidade.ATIVO;
        motivoInativacao = "";
    }

    String resumo() {
        return "Cliente id " + id
                + " | Nome: " + nome
                + " | E-mail: " + email.valor()
                + " | Status: " + status
                + " | Motivo: " + motivoInativacao;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}

class EmailClienteEntidade {
    private final String valor;

    EmailClienteEntidade(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac ClienteEntidade.java
java ClienteEntidade
```

---

## O que melhorou

Agora `ClienteEntidadeModelo` possui identidade:

```java
private final int id;
```

Possui estado:

```java
private StatusClienteEntidade status;
```

Possui operações de domínio:

```java
alterarEmail(...)
inativar(...)
bloquear(...)
reativar()
podeComprar()
```

E usa objeto de valor:

```java
private EmailClienteEntidade email;
```

Isso é muito melhor do que a entidade anêmica com setters livres.

A entidade controla sua própria mudança.

---

## Entidade pode mudar, mas com regra

Diferente de muitos objetos de valor, entidades frequentemente mudam ao longo do tempo.

Exemplo:

```text
cliente altera e-mail;
pedido muda status;
pagamento é aprovado;
produto tem estoque alterado;
OS é reagendada;
contrato é cancelado.
```

Isso não é problema.

O problema é mudar sem regra.

Ruim:

```java
cliente.setStatus(StatusClienteEntidade.INATIVO);
```

Melhor:

```java
cliente.inativar("Solicitação do cliente");
```

Ruim:

```java
pedido.setStatus(StatusPedido.PAGO);
```

Melhor:

```java
pedido.confirmarPagamento(pagamento);
```

Entidade mutável precisa ser encapsulada.

---

## Entidade tem ciclo de vida

Ciclo de vida é o caminho que uma entidade percorre.

Exemplo de pedido:

```text
CRIADO;
PAGO;
ENVIADO;
ENTREGUE;
CANCELADO.
```

Nem toda mudança é permitida.

Exemplo:

```text
pedido entregue não deveria voltar para criado;
pedido cancelado não deveria ser enviado;
pedido criado não deveria ser entregue sem pagamento.
```

As regras de transição pertencem à entidade.

Vamos modelar isso.

---

## Exemplo: Pedido como entidade

Crie:

```text
PedidoEntidade.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoEntidade {
    public static void main(String[] args) {
        ClientePedidoEntidade cliente = new ClientePedidoEntidade(
                10,
                "Ana Silva",
                new EmailPedidoEntidade("ana@email.com")
        );

        ProdutoPedidoEntidade produto = new ProdutoPedidoEntidade(
                "PROD-001",
                "Cadeira",
                new DinheiroPedidoEntidade(new BigDecimal("199.90"))
        );

        ItemPedidoEntidade item = new ItemPedidoEntidade(produto, 2);

        PedidoEntidadeModelo pedido = new PedidoEntidadeModelo(
                1001,
                cliente,
                item
        );

        System.out.println("Pedido criado:");
        System.out.println(pedido.resumo());

        PagamentoPedidoEntidade pagamento = new PagamentoPedidoEntidade(
                "PAG-001",
                pedido.total(),
                StatusPagamentoPedidoEntidade.APROVADO
        );

        pedido.confirmarPagamento(pagamento);

        System.out.println("Depois do pagamento:");
        System.out.println(pedido.resumo());

        pedido.enviar();
        System.out.println("Depois do envio:");
        System.out.println(pedido.resumo());

        pedido.entregar();
        System.out.println("Depois da entrega:");
        System.out.println(pedido.resumo());
    }
}

enum StatusPedidoEntidade {
    CRIADO,
    PAGO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}

enum StatusPagamentoPedidoEntidade {
    PENDENTE,
    APROVADO,
    CONFIRMADO,
    CANCELADO
}

class PedidoEntidadeModelo {
    private final int numero;
    private final ClientePedidoEntidade cliente;
    private final ItemPedidoEntidade item;
    private StatusPedidoEntidade status;

    PedidoEntidadeModelo(int numero, ClientePedidoEntidade cliente, ItemPedidoEntidade item) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Pedido não pode ser criado para cliente inativo.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.item = item;
        this.status = StatusPedidoEntidade.CRIADO;
    }

    int numero() {
        return numero;
    }

    StatusPedidoEntidade status() {
        return status;
    }

    DinheiroPedidoEntidade total() {
        return item.subtotal();
    }

    boolean criado() {
        return status == StatusPedidoEntidade.CRIADO;
    }

    boolean pago() {
        return status == StatusPedidoEntidade.PAGO;
    }

    boolean enviado() {
        return status == StatusPedidoEntidade.ENVIADO;
    }

    boolean encerrado() {
        return status == StatusPedidoEntidade.ENTREGUE
                || status == StatusPedidoEntidade.CANCELADO;
    }

    void confirmarPagamento(PagamentoPedidoEntidade pagamento) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (pagamento == null) {
            throw new IllegalArgumentException("Pagamento é obrigatório.");
        }

        if (!pagamento.aprovadoOuConfirmado()) {
            throw new IllegalStateException("Pagamento precisa estar aprovado ou confirmado.");
        }

        if (!pagamento.cobre(total())) {
            throw new IllegalStateException("Pagamento não cobre o total do pedido.");
        }

        status = StatusPedidoEntidade.PAGO;
    }

    void enviar() {
        if (!pago()) {
            throw new IllegalStateException("Somente pedido pago pode ser enviado.");
        }

        status = StatusPedidoEntidade.ENVIADO;
    }

    void entregar() {
        if (!enviado()) {
            throw new IllegalStateException("Somente pedido enviado pode ser entregue.");
        }

        status = StatusPedidoEntidade.ENTREGUE;
    }

    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo do cancelamento é obrigatório.");
        }

        if (encerrado()) {
            throw new IllegalStateException("Pedido encerrado não pode ser cancelado.");
        }

        status = StatusPedidoEntidade.CANCELADO;
    }

    String resumo() {
        return "Pedido: " + numero
                + "\nCliente: " + cliente.resumo()
                + "\nItem: " + item.resumo()
                + "\nTotal: " + total().formatado()
                + "\nStatus: " + status;
    }
}

class ClientePedidoEntidade {
    private final int id;
    private final String nome;
    private final EmailPedidoEntidade email;
    private final boolean ativo;

    ClientePedidoEntidade(int id, String nome, EmailPedidoEntidade email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.ativo = true;
    }

    boolean ativo() {
        return ativo;
    }

    String resumo() {
        return "Cliente " + id + " - " + nome + " <" + email.valor() + ">";
    }
}

class EmailPedidoEntidade {
    private final String valor;

    EmailPedidoEntidade(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }
}

class ProdutoPedidoEntidade {
    private final String codigo;
    private final String nome;
    private final DinheiroPedidoEntidade preco;

    ProdutoPedidoEntidade(String codigo, String nome, DinheiroPedidoEntidade preco) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do produto é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }

        if (preco == null || !preco.positivo()) {
            throw new IllegalArgumentException("Preço deve ser positivo.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
    }

    DinheiroPedidoEntidade preco() {
        return preco;
    }

    String resumo() {
        return codigo + " - " + nome + " | " + preco.formatado();
    }
}

class ItemPedidoEntidade {
    private final ProdutoPedidoEntidade produto;
    private final int quantidade;

    ItemPedidoEntidade(ProdutoPedidoEntidade produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.produto = produto;
        this.quantidade = quantidade;
    }

    DinheiroPedidoEntidade subtotal() {
        return produto.preco().multiplicar(quantidade);
    }

    String resumo() {
        return produto.resumo()
                + " | Quantidade: " + quantidade
                + " | Subtotal: " + subtotal().formatado();
    }
}

class PagamentoPedidoEntidade {
    private final String codigo;
    private final DinheiroPedidoEntidade valor;
    private final StatusPagamentoPedidoEntidade status;

    PagamentoPedidoEntidade(String codigo, DinheiroPedidoEntidade valor, StatusPagamentoPedidoEntidade status) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do pagamento é obrigatório.");
        }

        if (valor == null || !valor.positivo()) {
            throw new IllegalArgumentException("Valor do pagamento deve ser positivo.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status do pagamento é obrigatório.");
        }

        this.codigo = codigo;
        this.valor = valor;
        this.status = status;
    }

    boolean aprovadoOuConfirmado() {
        return status == StatusPagamentoPedidoEntidade.APROVADO
                || status == StatusPagamentoPedidoEntidade.CONFIRMADO;
    }

    boolean cobre(DinheiroPedidoEntidade total) {
        if (total == null) {
            return false;
        }

        return valor.maiorOuIgual(total);
    }
}

class DinheiroPedidoEntidade {
    private final BigDecimal valor;

    DinheiroPedidoEntidade(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    boolean maiorOuIgual(DinheiroPedidoEntidade outro) {
        if (outro == null) {
            return false;
        }

        return valor.compareTo(outro.valor) >= 0;
    }

    DinheiroPedidoEntidade multiplicar(int quantidade) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        return new DinheiroPedidoEntidade(valor.multiply(BigDecimal.valueOf(quantidade)));
    }

    String formatado() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac PedidoEntidade.java
java PedidoEntidade
```

---

## O que esse exemplo ensina

`PedidoEntidadeModelo` tem identidade:

```java
private final int numero;
```

Tem ciclo de vida:

```java
private StatusPedidoEntidade status;
```

Tem composição:

```java
private final ClientePedidoEntidade cliente;
private final ItemPedidoEntidade item;
```

Tem operações de domínio:

```java
confirmarPagamento(...)
enviar()
entregar()
cancelar(...)
```

E protege transições.

Você não faz:

```java
pedido.setStatus(StatusPedidoEntidade.ENTREGUE);
```

Você faz:

```java
pedido.entregar();
```

A entidade decide se essa mudança é permitida.

---

## Identidade não é sempre gerada no construtor

Em muitos sistemas backend, o `id` da entidade pode ser gerado pelo banco.

Exemplo:

```text
Cliente ainda não salvo: id nulo.
Cliente salvo: id 10.
```

Mais adiante, quando estudarmos banco, JPA e persistência, vamos aprofundar isso.

Por enquanto, para simplificar, estamos usando ids e códigos já informados no construtor.

Mas guarde a ideia:

```text
identidade pode vir do sistema, do banco, de uma regra de negócio ou de um código externo.
```

Exemplos:

```text
id numérico gerado pelo banco;
UUID;
código do pedido;
código da OS;
CPF em alguns domínios;
matrícula;
número de contrato.
```

O importante é entender o papel da identidade.

---

## Entidade e igualdade

Duas entidades podem ter os mesmos dados e ainda assim serem diferentes.

Exemplo:

```text
Cliente id 10: Ana Silva
Cliente id 25: Ana Silva
```

Mesmo nome, entidades diferentes.

Também pode acontecer o contrário:

```text
Cliente id 10: Ana Silva
Cliente id 10: Ana Souza
```

Se representam o mesmo id, conceitualmente estamos falando da mesma entidade em momentos diferentes.

Ainda vamos estudar `equals` e `hashCode` com calma.

Por enquanto, guarde:

```text
objeto de valor compara valor;
entidade compara identidade.
```

---

## Exemplo: Ordem de Serviço como entidade

Agora vamos criar uma entidade de OS.

Ela terá:

```text
código;
cliente;
período;
status;
quantidade de reagendamentos;
motivo de cancelamento.
```

Crie:

```text
OrdemServicoEntidade.java
```

Código:

```java
import java.time.LocalDate;

public class OrdemServicoEntidade {
    public static void main(String[] args) {
        CodigoOsEntidade codigo = new CodigoOsEntidade("OS-2026-0001");

        ClienteOsEntidade cliente = new ClienteOsEntidade(
                10,
                "Carlos Lima",
                new TelefoneOsEntidade("11", "988887777")
        );

        PeriodoAtendimentoOsEntidade periodo = new PeriodoAtendimentoOsEntidade(
                LocalDate.now().plusDays(1),
                TurnoOsEntidade.MANHA
        );

        OrdemServicoEntidadeModelo os = new OrdemServicoEntidadeModelo(
                codigo,
                cliente,
                periodo
        );

        System.out.println("OS criada:");
        System.out.println(os.resumo());

        os.reagendar(new PeriodoAtendimentoOsEntidade(
                LocalDate.now().plusDays(3),
                TurnoOsEntidade.TARDE
        ));

        System.out.println("OS reagendada:");
        System.out.println(os.resumo());

        os.concluir();
        System.out.println("OS concluída:");
        System.out.println(os.resumo());

        try {
            os.reagendar(new PeriodoAtendimentoOsEntidade(
                    LocalDate.now().plusDays(5),
                    TurnoOsEntidade.MANHA
            ));
        } catch (IllegalStateException erro) {
            System.out.println("Erro esperado: " + erro.getMessage());
        }
    }
}

enum StatusOsEntidade {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum TurnoOsEntidade {
    MANHA,
    TARDE
}

class OrdemServicoEntidadeModelo {
    private final CodigoOsEntidade codigo;
    private final ClienteOsEntidade cliente;
    private PeriodoAtendimentoOsEntidade periodo;
    private StatusOsEntidade status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;

    OrdemServicoEntidadeModelo(
            CodigoOsEntidade codigo,
            ClienteOsEntidade cliente,
            PeriodoAtendimentoOsEntidade periodo
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        if (!cliente.aptoParaAtendimento()) {
            throw new IllegalStateException("Cliente não está apto para atendimento.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.status = StatusOsEntidade.AGENDADA;
        this.quantidadeReagendamentos = 0;
        this.motivoCancelamento = "";
    }

    boolean encerrada() {
        return status == StatusOsEntidade.CONCLUIDA
                || status == StatusOsEntidade.CANCELADA;
    }

    boolean podeReagendar() {
        return !encerrada();
    }

    void reagendar(PeriodoAtendimentoOsEntidade novoPeriodo) {
        if (!podeReagendar()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        periodo = novoPeriodo;
        quantidadeReagendamentos++;
        status = StatusOsEntidade.REAGENDADA;
    }

    void concluir() {
        if (status == StatusOsEntidade.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        status = StatusOsEntidade.CONCLUIDA;
    }

    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo de cancelamento é obrigatório.");
        }

        if (status == StatusOsEntidade.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        status = StatusOsEntidade.CANCELADA;
        motivoCancelamento = motivo;
    }

    String resumo() {
        return "OS: " + codigo.valor()
                + "\nCliente: " + cliente.resumo()
                + "\nPeríodo: " + periodo.resumo()
                + "\nStatus: " + status
                + "\nReagendamentos: " + quantidadeReagendamentos
                + "\nMotivo cancelamento: " + motivoCancelamento;
    }
}

class CodigoOsEntidade {
    private final String valor;

    CodigoOsEntidade(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (!valor.startsWith("OS-")) {
            throw new IllegalArgumentException("Código da OS deve iniciar com OS-.");
        }

        this.valor = valor;
    }

    String valor() {
        return valor;
    }
}

class ClienteOsEntidade {
    private final int id;
    private final String nome;
    private final TelefoneOsEntidade telefone;
    private final boolean ativo;

    ClienteOsEntidade(int id, String nome, TelefoneOsEntidade telefone) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (telefone == null) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.ativo = true;
    }

    boolean aptoParaAtendimento() {
        return ativo && telefone.valido();
    }

    String resumo() {
        return "Cliente " + id + " - " + nome + " | Telefone: " + telefone.formatado();
    }
}

class TelefoneOsEntidade {
    private final String ddd;
    private final String numero;

    TelefoneOsEntidade(String ddd, String numero) {
        if (ddd == null || ddd.isBlank() || ddd.length() != 2) {
            throw new IllegalArgumentException("DDD inválido.");
        }

        if (numero == null || numero.isBlank() || numero.length() < 8) {
            throw new IllegalArgumentException("Número inválido.");
        }

        this.ddd = ddd;
        this.numero = numero;
    }

    boolean valido() {
        return ddd.length() == 2 && numero.length() >= 8;
    }

    String formatado() {
        return "(" + ddd + ") " + numero;
    }
}

class PeriodoAtendimentoOsEntidade {
    private final LocalDate data;
    private final TurnoOsEntidade turno;

    PeriodoAtendimentoOsEntidade(LocalDate data, TurnoOsEntidade turno) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (turno == null) {
            throw new IllegalArgumentException("Turno é obrigatório.");
        }

        this.data = data;
        this.turno = turno;
    }

    String resumo() {
        return data + " - " + turno;
    }
}
```

Compile e execute:

```powershell
javac OrdemServicoEntidade.java
java OrdemServicoEntidade
```

---

## O que a OS mostra sobre entidades

A OS possui identidade:

```java
private final CodigoOsEntidade codigo;
```

Possui estado mutável controlado:

```java
private PeriodoAtendimentoOsEntidade periodo;
private StatusOsEntidade status;
private int quantidadeReagendamentos;
private String motivoCancelamento;
```

Possui ciclo de vida:

```text
AGENDADA;
REAGENDADA;
CONCLUIDA;
CANCELADA.
```

Possui operações de domínio:

```java
reagendar(...)
concluir()
cancelar(...)
```

Esse é um exemplo forte de entidade.

Ela muda com o tempo, mas não de qualquer jeito.

---

## Entidade usando objeto de valor

Nos exemplos, as entidades usam objetos de valor.

Exemplo:

```java
private EmailClienteEntidade email;
```

```java
private CodigoOsEntidade codigo;
```

```java
private PeriodoAtendimentoOsEntidade periodo;
```

Isso é muito comum.

A entidade representa algo com identidade e ciclo de vida.

Os objetos de valor representam informações importantes dentro dela.

Exemplo conceitual:

```text
Cliente é entidade.
Email é objeto de valor.

OrdemServico é entidade.
CodigoOs pode ser objeto de valor.
PeriodoAtendimento pode ser objeto de valor.
Telefone pode ser objeto de valor.
```

Essa combinação é uma das bases de modelagem orientada a objetos.

---

## Entidade não precisa ter setter para tudo

Entidade muda, mas isso não significa criar setter para tudo.

Evite:

```java
setStatus(...)
setPeriodo(...)
setQuantidadeReagendamentos(...)
setMotivoCancelamento(...)
```

Prefira:

```java
reagendar(...)
concluir()
cancelar(...)
```

A diferença é enorme.

Setter altera dado.

Método de domínio representa ação.

Entidade deve oferecer ações que fazem sentido para o negócio.

---

## Entidade e responsabilidade

Uma entidade não deve fazer tudo no sistema.

Exemplo ruim:

```text
Pedido salva no banco;
Pedido envia e-mail;
Pedido chama API de pagamento;
Pedido escreve arquivo;
Pedido calcula frete usando serviço externo;
Pedido imprime relatório.
```

Isso mistura domínio com infraestrutura.

Entidade deve cuidar das regras centrais dela.

Exemplo bom:

```text
Pedido confirma pagamento;
Pedido envia;
Pedido cancela;
Pedido calcula total;
Pedido valida transições.
```

Salvar no banco, chamar APIs e enviar mensagens serão responsabilidades de outras camadas no futuro.

Por enquanto, mantenha esta regra:

```text
entidade cuida do comportamento do domínio, não da infraestrutura.
```

---

## Entidade pode ser grande demais

Assim como qualquer classe, entidade pode crescer demais.

Se uma entidade começa a ter muitas responsabilidades, procure objetos escondidos.

Exemplo:

```text
Cliente tem muitos dados de endereço.
Cliente tem muitos dados de contato.
Cliente tem muitas regras de crédito.
Cliente tem histórico de alterações.
```

Possíveis extrações:

```text
Endereco;
Telefone;
Email;
CreditoCliente;
HistoricoCliente.
```

Entidade pode compor outros objetos para continuar clara.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar entidade anêmica

Execute:

```text
ClienteAnemico.java
```

Explique:

```text
por que ele aceita dados inválidos;
quais setters são perigosos;
qual regra está faltando.
```

### Parte 2 — Executar cliente entidade

Execute:

```text
ClienteEntidade.java
```

Teste:

```text
e-mail inválido;
id zero;
nome vazio;
alterar e-mail depois de inativar;
bloquear e depois tentar reativar.
```

Observe as exceções.

### Parte 3 — Executar pedido entidade

Execute:

```text
PedidoEntidade.java
```

Teste:

```text
enviar pedido antes de pagar;
entregar antes de enviar;
cancelar pedido entregue;
pagamento pendente;
pagamento com valor menor que total.
```

Observe onde cada regra é protegida.

### Parte 4 — Executar OS entidade

Execute:

```text
OrdemServicoEntidade.java
```

Teste:

```text
reagendar OS concluída;
cancelar OS concluída;
criar código sem OS-;
criar telefone inválido;
criar período sem data.
```

### Parte 5 — Identificar entidade e valor

Para cada item, diga se é entidade ou objeto de valor:

```text
Cliente;
Email;
Pedido;
Dinheiro;
OrdemServico;
CodigoOs;
PeriodoAtendimento;
Produto;
Telefone;
Contrato.
```

Justifique com:

```text
tem identidade?
ou é definido pelo valor?
```

---

## Desafio prático

Crie o arquivo:

```text
ProdutoEntidade.java
```

Modele uma entidade `Produto`.

Objetos sugeridos:

```text
ProdutoEntidadeModelo;
CodigoProdutoValor;
DinheiroProdutoValor.
```

Enums:

```java
enum StatusProduto {
    ATIVO,
    INATIVO
}
```

Regras:

```text
Produto tem código.
Produto tem nome.
Produto tem preço.
Produto tem estoque.
Produto tem status.
Código é obrigatório.
Nome é obrigatório.
Preço precisa ser positivo.
Estoque inicial não pode ser negativo.
Produto nasce ativo.
Produto ativo pode vender.
Produto inativo não pode vender.
Venda reduz estoque.
Venda exige quantidade maior que zero.
Venda só ocorre se houver estoque suficiente.
Reposição aumenta estoque.
Reposição exige quantidade maior que zero.
Produto pode ser inativado com motivo.
Produto pode ser reativado.
```

Métodos esperados:

```text
vender(int quantidade);
reporEstoque(int quantidade);
inativar(String motivo);
reativar();
disponivelParaVenda();
valorTotalEmEstoque();
resumo();
```

Não crie setters livres para:

```text
estoque;
status;
preço;
motivoInativacao.
```

Use métodos de domínio.

---

## Erros comuns

### 1. Confundir entidade com objeto de valor

Entidade tem identidade. Objeto de valor é definido pelo valor.

### 2. Criar entidade anêmica

Classe só com atributos, getters e setters não representa bem comportamento.

### 3. Criar setter para status

Status deve mudar por ações de domínio.

### 4. Colocar infraestrutura dentro da entidade

Entidade não deve salvar banco nem chamar API.

### 5. Não proteger transições

Pedido cancelado não deveria ser enviado. OS concluída não deveria ser reagendada.

### 6. Ignorar objetos de valor

Entidade pode ficar mais clara usando `Email`, `Telefone`, `Dinheiro`, `Periodo` e `Codigo`.

### 7. Usar identidade de forma confusa

Entenda o que identifica a entidade antes de modelar.

### 8. Centralizar regras demais em uma entidade

Se a entidade cresceu demais, procure objetos internos.

---

## Debug recomendado

Use debug em:

```text
ClienteEntidade.java
PedidoEntidade.java
OrdemServicoEntidade.java
```

No cliente, coloque breakpoint em:

```java
cliente.alterarEmail(...)
cliente.inativar(...)
cliente.reativar()
```

No pedido:

```java
pedido.confirmarPagamento(...)
pedido.enviar()
pedido.entregar()
pedido.cancelar(...)
```

Na OS:

```java
os.reagendar(...)
os.concluir()
os.cancelar(...)
```

Observe:

```text
estado inicial da entidade;
validações antes da mudança;
alteração controlada do estado;
exceções quando transição é inválida;
objetos de valor sendo usados dentro da entidade.
```

O objetivo é enxergar ciclo de vida.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é uma entidade?
2. Qual diferença entre entidade e objeto de valor?
3. Qual método de domínio você criou para evitar setter livre?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar entidade;
diferenciar entidade de objeto de valor;
identificar identidade;
identificar ciclo de vida;
modelar entidade com estado;
proteger mudanças com métodos de domínio;
evitar entidade anêmica;
usar objetos de valor dentro de entidades;
modelar Cliente, Pedido e OrdemServico como entidades;
validar transições de status;
evitar setters livres;
evitar infraestrutura dentro da entidade;
debugar ciclo de vida;
resolver o desafio de ProdutoEntidade;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-117-entidades
git commit -m "Aula 117: pratica entidades em orientacao a objetos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
entidade é um objeto com identidade e ciclo de vida.
```

Diferente de objeto de valor, a entidade permanece a mesma ao longo do tempo, mesmo quando seus dados mudam.

Um cliente pode alterar e-mail e continuar sendo o mesmo cliente.  
Um pedido pode mudar de status e continuar sendo o mesmo pedido.  
Uma OS pode ser reagendada e continuar sendo a mesma OS.

Entidades devem proteger suas mudanças por métodos de domínio, não por setters livres.

Na próxima aula, vamos aprofundar identidade de objetos.

Vamos entender melhor como pensar em identidade, diferença entre igualdade de referência, igualdade de valor e igualdade de entidade.
