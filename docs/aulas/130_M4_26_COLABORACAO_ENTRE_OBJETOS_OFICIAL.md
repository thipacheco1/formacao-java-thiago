# 130 — M4.26 — Colaboração entre objetos

## Objetivo da aula

Nesta aula você vai aprender colaboração entre objetos.

Nas aulas anteriores, você estudou coesão e acoplamento. Agora vamos juntar os dois conceitos para entender como objetos trabalham juntos em um fluxo de domínio.

Ao final da aula, você deve conseguir:

```text
explicar o que é colaboração entre objetos;
entender que objetos não vivem isolados;
diferenciar colaboração saudável de bagunça procedural;
criar fluxos onde cada objeto faz sua parte;
evitar objeto Deus;
evitar app fazendo regra de domínio;
evitar entidade expondo estado para outro objeto manipular;
entender passagem de mensagens entre objetos;
usar métodos de domínio para coordenar mudanças;
modelar Pedido, ItemPedido, Produto, Cliente, Dinheiro e OrdemServico colaborando.
```

Essa aula é importante porque backend real não é feito de uma classe só.

Um fluxo simples pode envolver:

```text
Cliente;
Pedido;
ItemPedido;
Produto;
Dinheiro;
Pagamento;
Notificação;
Auditoria;
OrdemServico;
Técnico;
Período.
```

O desafio é fazer esses objetos colaborarem sem virar bagunça.

---

## A ideia central

Colaboração entre objetos acontece quando um objeto usa outro para cumprir uma regra ou realizar um fluxo.

Exemplo:

```java
Pedido pedido = new Pedido(cliente);
pedido.adicionarItem(produto, 2);
pedido.confirmarPagamento(valorPago);
```

Nesse fluxo:

```text
Pedido conhece Cliente;
Pedido recebe Produto;
Pedido cria ou guarda itens;
ItemPedido calcula subtotal;
Dinheiro representa valores;
Pedido calcula total;
Pedido muda status.
```

Cada objeto faz uma parte.

Isso é Orientação a Objetos na prática.

Não é apenas criar classes com atributos.

É criar objetos que conversam de forma organizada.

---

## Objetos conversam por métodos

Em Java, objetos colaboram chamando métodos.

Exemplo:

```java
pedido.adicionarItem(produto, 2);
```

Aqui o objeto que está chamando diz:

```text
pedido, adicione este produto com esta quantidade.
```

O pedido decide o que fazer.

Isso é melhor do que o código externo fazer:

```java
pedido.itens.add(...);
pedido.total = ...;
pedido.status = ...;
```

Colaboração saudável passa por métodos com intenção.

---

## Colaboração não é invasão

Uma classe não deve invadir o estado interno de outra.

Ruim:

```java
pedido.status = StatusPedido.PAGO;
pedido.itens.add(item);
pedido.total = pedido.total.add(valor);
```

Melhor:

```java
pedido.adicionarItem(produto, quantidade);
pedido.confirmarPagamento(valorPago);
```

A diferença é grande.

No primeiro caso, quem está fora manipula os detalhes internos.

No segundo caso, o objeto recebe uma mensagem e protege sua própria regra.

---

## Tell, Don't Ask em visão inicial

Existe um princípio chamado:

```text
Tell, Don't Ask
```

Em português:

```text
diga ao objeto o que você quer que ele faça, não fique perguntando seus dados para fazer por ele.
```

Exemplo ruim:

```java
if (pedido.status() == StatusPedido.CRIADO) {
    pedido.setStatus(StatusPedido.PAGO);
}
```

Exemplo melhor:

```java
pedido.confirmarPagamento(valorPago);
```

A classe `Pedido` conhece sua própria regra.

Quem está fora não precisa controlar o status manualmente.

Vamos aprofundar esse princípio na próxima aula.

Nesta aula, vamos praticar a colaboração.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-130-colaboracao-entre-objetos
cd labs\m4\aula-130-colaboracao-entre-objetos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula130
mkdir src\br\com\curso\aula130\app
mkdir src\br\com\curso\aula130\exemplo
mkdir src\br\com\curso\aula130\exemplo\ruim
mkdir src\br\com\curso\aula130\dominio
mkdir src\br\com\curso\aula130\dominio\cliente
mkdir src\br\com\curso\aula130\dominio\pedido
mkdir src\br\com\curso\aula130\dominio\produto
mkdir src\br\com\curso\aula130\dominio\valor
mkdir src\br\com\curso\aula130\dominio\ordemservico
mkdir src\br\com\curso\aula130\dominio\tecnico
```

Nesta aula, vamos usar dois domínios:

```text
Pedido;
Ordem de Serviço.
```

---

## Exemplo 1 — Fluxo procedural disfarçado de OO

Vamos começar com uma versão ruim.

Ela usa classe, objeto e método, mas a lógica está centralizada no app.

Crie:

```text
src\br\com\curso\aula130\exemplo\ruim\PedidoProceduralApp.java
```

Código:

```java
package br.com.curso.aula130.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class PedidoProceduralApp {
    public static void main(String[] args) {
        ClienteProcedural cliente = new ClienteProcedural(10, "Ana Silva", true);

        ProdutoProcedural cadeira = new ProdutoProcedural(
                "PROD-001",
                "Cadeira",
                new BigDecimal("199.90"),
                10
        );

        ProdutoProcedural mesa = new ProdutoProcedural(
                "PROD-002",
                "Mesa",
                new BigDecimal("399.90"),
                5
        );

        PedidoProcedural pedido = new PedidoProcedural(1001, cliente);

        if (!cliente.ativo) {
            throw new IllegalStateException("Cliente inativo não pode comprar.");
        }

        if (cadeira.estoque >= 2) {
            pedido.itens.add(new ItemPedidoProcedural(cadeira.codigo, cadeira.nome, cadeira.preco, 2));
            cadeira.estoque -= 2;
        }

        if (mesa.estoque >= 1) {
            pedido.itens.add(new ItemPedidoProcedural(mesa.codigo, mesa.nome, mesa.preco, 1));
            mesa.estoque -= 1;
        }

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoProcedural item : pedido.itens) {
            BigDecimal subtotal = item.precoUnitario.multiply(BigDecimal.valueOf(item.quantidade));
            total = total.add(subtotal);
        }

        pedido.total = total.setScale(2, RoundingMode.HALF_UP);

        BigDecimal valorPago = new BigDecimal("799.70");

        if ("CRIADO".equals(pedido.status) && valorPago.compareTo(pedido.total) >= 0) {
            pedido.status = "PAGO";
        }

        System.out.println("Pedido " + pedido.numero);
        System.out.println("Cliente: " + pedido.cliente.nome);
        System.out.println("Total: R$ " + pedido.total);
        System.out.println("Status: " + pedido.status);
        System.out.println("Estoque cadeira: " + cadeira.estoque);
        System.out.println("Estoque mesa: " + mesa.estoque);
    }
}

class ClienteProcedural {
    int id;
    String nome;
    boolean ativo;

    ClienteProcedural(int id, String nome, boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.ativo = ativo;
    }
}

class ProdutoProcedural {
    String codigo;
    String nome;
    BigDecimal preco;
    int estoque;

    ProdutoProcedural(String codigo, String nome, BigDecimal preco, int estoque) {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }
}

class ItemPedidoProcedural {
    String codigoProduto;
    String nomeProduto;
    BigDecimal precoUnitario;
    int quantidade;

    ItemPedidoProcedural(String codigoProduto, String nomeProduto, BigDecimal precoUnitario, int quantidade) {
        this.codigoProduto = codigoProduto;
        this.nomeProduto = nomeProduto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }
}

class PedidoProcedural {
    int numero;
    ClienteProcedural cliente;
    List<ItemPedidoProcedural> itens;
    BigDecimal total;
    String status;

    PedidoProcedural(int numero, ClienteProcedural cliente) {
        this.numero = numero;
        this.cliente = cliente;
        this.itens = new ArrayList<>();
        this.total = BigDecimal.ZERO;
        this.status = "CRIADO";
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula130.exemplo.ruim.PedidoProceduralApp
```

---

## O que há de errado

Esse exemplo tem classes, mas a lógica está quase toda no `main`.

O app faz:

```text
verificação de cliente ativo;
controle de estoque;
adição de item;
cálculo de total;
mudança de status;
regra de pagamento;
montagem de resumo.
```

Os objetos estão anêmicos.

Eles guardam dados, mas não protegem comportamento.

Isso não é boa colaboração entre objetos.

É código procedural usando classes como sacolas de dados.

---

## Sintomas do fluxo ruim

Sinais de problema:

```text
atributos públicos ou acessíveis diretamente;
app alterando estoque;
app alterando status;
app calculando total;
app conhecendo detalhes internos do pedido;
status como String;
dinheiro como BigDecimal espalhado;
itens manipulados diretamente;
muita regra fora dos objetos.
```

A colaboração está errada porque os objetos não estão fazendo sua parte.

Vamos melhorar.

---

## Criando objetos de valor

Primeiro, vamos criar os objetos de valor.

Crie:

```text
src\br\com\curso\aula130\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula130.dominio.valor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class Dinheiro {
    private final BigDecimal valor;

    private Dinheiro(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static Dinheiro de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new Dinheiro(new BigDecimal(valor));
    }

    public static Dinheiro zero() {
        return new Dinheiro(BigDecimal.ZERO);
    }

    public boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean maiorOuIgual(Dinheiro outro) {
        if (outro == null) {
            return false;
        }

        return valor.compareTo(outro.valor) >= 0;
    }

    public Dinheiro somar(Dinheiro outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new Dinheiro(valor.add(outro.valor));
    }

    public Dinheiro multiplicar(int quantidade) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        return new Dinheiro(valor.multiply(BigDecimal.valueOf(quantidade)));
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        Dinheiro dinheiro = (Dinheiro) outro;
        return Objects.equals(valor, dinheiro.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

`Dinheiro` sabe somar, comparar e multiplicar.

Assim, essas regras não ficam espalhadas.

---

## Classe Cliente

Crie:

```text
src\br\com\curso\aula130\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula130.dominio.cliente;

public class Cliente {
    private final int id;
    private final String nome;
    private final boolean ativo;

    public Cliente(int id, String nome) {
        this(id, nome, true);
    }

    public Cliente(int id, String nome, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.ativo = ativo;
    }

    public int id() {
        return id;
    }

    public String nome() {
        return nome;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}
```

`Cliente` sabe se está ativo.

`Pedido` pode perguntar isso ao criar um pedido.

---

## Classe Produto

Crie:

```text
src\br\com\curso\aula130\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula130.dominio.produto;

import br.com.curso.aula130.dominio.valor.Dinheiro;

public class Produto {
    private final String codigo;
    private final String nome;
    private final Dinheiro preco;
    private int estoque;

    public Produto(String codigo, String nome, Dinheiro preco, int estoqueInicial) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("PROD-")) {
            throw new IllegalArgumentException("Código deve iniciar com PROD-.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || !preco.positivo()) {
            throw new IllegalArgumentException("Preço deve ser positivo.");
        }

        if (estoqueInicial < 0) {
            throw new IllegalArgumentException("Estoque inicial não pode ser negativo.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoqueInicial;
    }

    public String codigo() {
        return codigo;
    }

    public String nome() {
        return nome;
    }

    public Dinheiro preco() {
        return preco;
    }

    public int estoque() {
        return estoque;
    }

    public boolean possuiEstoque(int quantidade) {
        if (quantidade <= 0) {
            return false;
        }

        return estoque >= quantidade;
    }

    public void reservarEstoque(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (!possuiEstoque(quantidade)) {
            throw new IllegalStateException("Estoque insuficiente para o produto " + codigo);
        }

        estoque -= quantidade;
    }

    public String resumo() {
        return codigo + " - " + nome + " | Preço: " + preco + " | Estoque: " + estoque;
    }
}
```

Agora quem controla o estoque é o próprio produto.

O app não faz:

```java
produto.estoque -= quantidade;
```

Ele pede:

```java
produto.reservarEstoque(quantidade);
```

---

## StatusPedido

Crie:

```text
src\br\com\curso\aula130\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula130.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Status controlado por `enum`, não por `String`.

---

## ItemPedido

Crie:

```text
src\br\com\curso\aula130\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula130.dominio.pedido;

import br.com.curso.aula130.dominio.produto.Produto;
import br.com.curso.aula130.dominio.valor.Dinheiro;

public class ItemPedido {
    private final String codigoProduto;
    private final String nomeProduto;
    private final Dinheiro precoUnitario;
    private final int quantidade;

    public ItemPedido(Produto produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.codigoProduto = produto.codigo();
        this.nomeProduto = produto.nome();
        this.precoUnitario = produto.preco();
        this.quantidade = quantidade;
    }

    public Dinheiro subtotal() {
        return precoUnitario.multiplicar(quantidade);
    }

    public String resumo() {
        return codigoProduto
                + " - " + nomeProduto
                + " | Quantidade: " + quantidade
                + " | Unitário: " + precoUnitario
                + " | Subtotal: " + subtotal();
    }
}
```

`ItemPedido` sabe calcular seu subtotal.

O pedido não precisa repetir essa conta em detalhes.

---

## Pedido colaborando com Cliente, Produto, Item e Dinheiro

Crie:

```text
src\br\com\curso\aula130\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula130.dominio.pedido;

import br.com.curso.aula130.dominio.cliente.Cliente;
import br.com.curso.aula130.dominio.produto.Produto;
import br.com.curso.aula130.dominio.valor.Dinheiro;

import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private final int numero;
    private final Cliente cliente;
    private final List<ItemPedido> itens;
    private StatusPedido status;
    private String motivoCancelamento;

    public Pedido(int numero, Cliente cliente) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Pedido não pode ser criado para cliente inativo.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.itens = new ArrayList<>();
        this.status = StatusPedido.CRIADO;
        this.motivoCancelamento = "";
    }

    public boolean criado() {
        return status == StatusPedido.CRIADO;
    }

    public boolean pago() {
        return status == StatusPedido.PAGO;
    }

    public boolean cancelado() {
        return status == StatusPedido.CANCELADO;
    }

    public void adicionarItem(Produto produto, int quantidade) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber itens.");
        }

        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        produto.reservarEstoque(quantidade);

        ItemPedido item = new ItemPedido(produto, quantidade);
        itens.add(item);
    }

    public Dinheiro total() {
        Dinheiro total = Dinheiro.zero();

        for (ItemPedido item : itens) {
            total = total.somar(item.subtotal());
        }

        return total;
    }

    public void confirmarPagamento(Dinheiro valorPago) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (itens.isEmpty()) {
            throw new IllegalStateException("Pedido sem itens não pode ser pago.");
        }

        if (valorPago == null || !valorPago.maiorOuIgual(total())) {
            throw new IllegalArgumentException("Valor pago não cobre o total do pedido.");
        }

        status = StatusPedido.PAGO;
    }

    public void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (pago()) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado por este fluxo.");
        }

        if (cancelado()) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        status = StatusPedido.CANCELADO;
        motivoCancelamento = motivo;
    }

    public String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("Pedido ").append(numero)
                .append(" | Cliente: ").append(cliente.resumo())
                .append(" | Status: ").append(status)
                .append(" | Total: ").append(total())
                .append(" | Motivo cancelamento: ").append(motivoCancelamento)
                .append("\nItens:");

        for (ItemPedido item : itens) {
            texto.append("\n- ").append(item.resumo());
        }

        return texto.toString();
    }
}
```

Observe a colaboração:

```text
Pedido pergunta se Cliente está ativo no nascimento.
Pedido recebe Produto ao adicionar item.
Produto reserva estoque.
ItemPedido guarda dados do produto e calcula subtotal.
Pedido soma subtotais usando Dinheiro.
Pedido confirma pagamento usando Dinheiro.
```

Cada objeto faz sua parte.

---

## App com fluxo limpo

Crie:

```text
src\br\com\curso\aula130\app\PedidoColaboracaoApp.java
```

Código:

```java
package br.com.curso.aula130.app;

import br.com.curso.aula130.dominio.cliente.Cliente;
import br.com.curso.aula130.dominio.pedido.Pedido;
import br.com.curso.aula130.dominio.produto.Produto;
import br.com.curso.aula130.dominio.valor.Dinheiro;

public class PedidoColaboracaoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva"
        );

        Produto cadeira = new Produto(
                "PROD-001",
                "Cadeira",
                Dinheiro.de("199.90"),
                10
        );

        Produto mesa = new Produto(
                "PROD-002",
                "Mesa",
                Dinheiro.de("399.90"),
                5
        );

        Pedido pedido = new Pedido(
                1001,
                cliente
        );

        pedido.adicionarItem(cadeira, 2);
        pedido.adicionarItem(mesa, 1);

        pedido.confirmarPagamento(Dinheiro.de("799.70"));

        System.out.println(pedido.resumo());
        System.out.println();
        System.out.println("Estoque atualizado:");
        System.out.println(cadeira.resumo());
        System.out.println(mesa.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula130.app.PedidoColaboracaoApp
```

---

## O que melhorou no fluxo

Agora o app não calcula total.

Não altera status diretamente.

Não mexe no estoque diretamente.

Não cria item manualmente com dados soltos.

Ele apenas coordena:

```java
pedido.adicionarItem(cadeira, 2);
pedido.adicionarItem(mesa, 1);
pedido.confirmarPagamento(Dinheiro.de("799.70"));
```

Isso é colaboração entre objetos.

A regra fica nos objetos certos.

---

## Colaboração saudável

No fluxo melhor:

```text
App monta o cenário.
Pedido protege regra do pedido.
Produto protege estoque.
ItemPedido calcula subtotal.
Dinheiro protege cálculo monetário.
Cliente informa se está ativo.
```

Nenhum objeto faz tudo.

Nenhum objeto fica inútil.

Nenhum objeto invade o estado interno do outro.

Essa é uma boa direção para OO.

---

## Cuidado: Pedido reservando estoque

Uma observação importante: neste exemplo, `Pedido` chama:

```java
produto.reservarEstoque(quantidade);
```

Isso cria acoplamento entre `Pedido` e `Produto`.

É aceitável para esta fase porque queremos demonstrar colaboração direta.

Em sistemas reais, reserva de estoque pode ser mais complexa e envolver outro componente, como um serviço de domínio ou caso de uso.

Mas o ponto didático permanece:

```text
Pedido não altera o campo estoque diretamente.
Produto controla sua própria regra.
```

Mais adiante, vamos refinar onde regras transversais devem ficar.

---

## Exemplo 2 — Colaboração em Ordem de Serviço

Agora vamos praticar outro domínio.

A ideia:

```text
OrdemServico recebe um período;
pode atribuir técnico;
pode reagendar;
pode concluir;
técnico controla se está ativo;
período representa data e turno;
código representa identidade da OS.
```

---

## CodigoOs

Crie:

```text
src\br\com\curso\aula130\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula130.dominio.ordemservico;

import java.util.Objects;

public final class CodigoOs {
    private static final String PREFIXO = "OS-";

    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código da OS deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        CodigoOs codigoOs = (CodigoOs) outro;
        return Objects.equals(valor, codigoOs.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## TurnoAtendimento

Crie:

```text
src\br\com\curso\aula130\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula130.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

---

## StatusOs

Crie:

```text
src\br\com\curso\aula130\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula130.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

---

## PeriodoAtendimento

Crie:

```text
src\br\com\curso\aula130\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula130.dominio.ordemservico;

import java.time.LocalDate;
import java.util.Objects;

public final class PeriodoAtendimento {
    private final LocalDate data;
    private final TurnoAtendimento turno;

    public PeriodoAtendimento(LocalDate data, TurnoAtendimento turno) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (turno == null) {
            throw new IllegalArgumentException("Turno é obrigatório.");
        }

        this.data = data;
        this.turno = turno;
    }

    public boolean mesmaData(PeriodoAtendimento outro) {
        if (outro == null) {
            return false;
        }

        return Objects.equals(data, outro.data);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        PeriodoAtendimento periodo = (PeriodoAtendimento) outro;
        return Objects.equals(data, periodo.data)
                && turno == periodo.turno;
    }

    @Override
    public int hashCode() {
        return Objects.hash(data, turno);
    }

    @Override
    public String toString() {
        return data + " - " + turno;
    }
}
```

---

## Tecnico

Crie:

```text
src\br\com\curso\aula130\dominio\tecnico\Tecnico.java
```

Código:

```java
package br.com.curso.aula130.dominio.tecnico;

public class Tecnico {
    private final int id;
    private final String nome;
    private final boolean ativo;

    public Tecnico(int id, String nome) {
        this(id, nome, true);
    }

    public Tecnico(int id, String nome, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do técnico deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.ativo = ativo;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return "Técnico " + id + " - " + nome + " | Ativo: " + ativo;
    }
}
```

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula130\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula130.dominio.ordemservico;

import br.com.curso.aula130.dominio.tecnico.Tecnico;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private PeriodoAtendimento periodo;
    private Tecnico tecnico;
    private StatusOs status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;

    public OrdemServico(CodigoOs codigo, String cliente, PeriodoAtendimento periodo) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.tecnico = null;
        this.status = StatusOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
        this.motivoCancelamento = "";
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public void atribuirTecnico(Tecnico tecnico) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode receber técnico.");
        }

        if (tecnico == null) {
            throw new IllegalArgumentException("Técnico é obrigatório.");
        }

        if (!tecnico.ativo()) {
            throw new IllegalStateException("Técnico inativo não pode ser atribuído.");
        }

        this.tecnico = tecnico;
    }

    public void iniciarAtendimento() {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode iniciar atendimento.");
        }

        if (tecnico == null) {
            throw new IllegalStateException("OS precisa ter técnico para iniciar atendimento.");
        }

        status = StatusOs.EM_ATENDIMENTO;
    }

    public void reagendar(PeriodoAtendimento novoPeriodo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        if (periodo.equals(novoPeriodo)) {
            throw new IllegalArgumentException("Novo período deve ser diferente do período atual.");
        }

        periodo = novoPeriodo;
        status = StatusOs.REAGENDADA;
        quantidadeReagendamentos++;
    }

    public void concluir() {
        if (status != StatusOs.EM_ATENDIMENTO) {
            throw new IllegalStateException("Somente OS em atendimento pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS já está cancelada.");
        }

        status = StatusOs.CANCELADA;
        motivoCancelamento = motivo;
    }

    public String resumo() {
        return "OS " + codigo
                + " | Cliente: " + cliente
                + " | Período: " + periodo
                + " | Técnico: " + (tecnico == null ? "não atribuído" : tecnico.resumo())
                + " | Status: " + status
                + " | Reagendamentos: " + quantidadeReagendamentos
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Observe a colaboração:

```text
OrdemServico usa CodigoOs;
OrdemServico usa PeriodoAtendimento;
OrdemServico usa Tecnico;
OrdemServico usa StatusOs;
Tecnico informa se está ativo;
PeriodoAtendimento protege data e turno.
```

---

## App de OS

Crie:

```text
src\br\com\curso\aula130\app\OrdemServicoColaboracaoApp.java
```

Código:

```java
package br.com.curso.aula130.app;

import br.com.curso.aula130.dominio.ordemservico.CodigoOs;
import br.com.curso.aula130.dominio.ordemservico.OrdemServico;
import br.com.curso.aula130.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula130.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula130.dominio.tecnico.Tecnico;

import java.time.LocalDate;

public class OrdemServicoColaboracaoApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        Tecnico tecnico = new Tecnico(
                50,
                "Carlos Técnico"
        );

        os.atribuirTecnico(tecnico);

        os.reagendar(new PeriodoAtendimento(
                LocalDate.now().plusDays(3),
                TurnoAtendimento.TARDE
        ));

        os.iniciarAtendimento();
        os.concluir();

        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula130.app.OrdemServicoColaboracaoApp
```

---

## O que a OS ensina

O app não faz:

```text
status = CONCLUIDA;
tecnico = tecnico;
periodo = novoPeriodo;
quantidadeReagendamentos++;
```

Ele chama métodos:

```java
os.atribuirTecnico(tecnico);
os.reagendar(novoPeriodo);
os.iniciarAtendimento();
os.concluir();
```

A OS protege seu ciclo de vida.

O técnico protege seu próprio estado.

O período protege sua validade.

O código da OS protege seu formato.

Isso é colaboração entre objetos.

---

## Quem coordena o fluxo?

Nesta fase, o `App` está coordenando o fluxo porque estamos em exemplos de console.

Em backend real, essa coordenação geralmente ficará em uma camada de aplicação, caso de uso ou serviço de aplicação.

Exemplo futuro:

```text
ReagendarOrdemServicoUseCase;
ConfirmarPagamentoPedidoUseCase;
AtivarContratoUseCase.
```

Mas a regra de domínio ainda deve ficar nos objetos de domínio.

A coordenação chama os objetos.

Os objetos protegem suas regras.

---

## Colaboração boa versus colaboração ruim

Colaboração ruim:

```text
um objeto pega dados de outro e muda tudo por fora;
uma classe central faz toda regra;
objetos são apenas estruturas de dados;
status é alterado diretamente;
coleções internas são expostas;
regras ficam espalhadas.
```

Colaboração boa:

```text
objetos oferecem métodos com intenção;
estado interno fica protegido;
cada objeto valida o que pertence a ele;
um objeto pede ao outro uma ação;
dependências são explícitas;
o fluxo fica legível.
```

---

## Cuidado com getters demais

Para colaborar, às vezes precisamos de dados.

Mas cuidado com excesso de getters.

Exemplo suspeito:

```java
if (pedido.status() == StatusPedido.CRIADO
        && pedido.total().maiorOuIgual(valor)
        && pedido.itens().size() > 0) {
    pedido.setStatus(StatusPedido.PAGO);
}
```

Isso joga regra para fora do pedido.

Melhor:

```java
pedido.confirmarPagamento(valor);
```

Getters não são proibidos.

Mas quando o código externo usa muitos getters para tomar decisão sobre o objeto, talvez a regra devesse estar dentro do próprio objeto.

---

## Cuidado com setters

Setters demais prejudicam colaboração.

Exemplo ruim:

```java
os.setPeriodo(novoPeriodo);
os.setStatus(StatusOs.REAGENDADA);
os.setQuantidadeReagendamentos(os.getQuantidadeReagendamentos() + 1);
```

Melhor:

```java
os.reagendar(novoPeriodo);
```

A diferença é intenção.

`reagendar` representa uma ação de domínio.

Setters apenas alteram campos.

---

## Objetos devem proteger invariantes

Invariante é uma regra que deve permanecer verdadeira.

Exemplos:

```text
Pedido pago não deve voltar para criado.
Produto não deve ficar com estoque negativo.
OS concluída não deve ser reagendada.
Dinheiro não deve ter escala inesperada.
Código de OS deve iniciar com OS-.
Período deve ter data e turno.
```

Boa colaboração respeita invariantes.

Se qualquer classe puder alterar tudo diretamente, invariantes quebram.

---

## Colaboração e encapsulamento

Encapsulamento permite colaboração saudável.

Com atributos privados, outros objetos não invadem.

Com métodos públicos bem nomeados, outros objetos sabem como pedir ações.

Exemplo:

```java
produto.reservarEstoque(quantidade);
pedido.adicionarItem(produto, quantidade);
pedido.confirmarPagamento(valorPago);
```

Esses métodos são contratos de colaboração.

Eles dizem:

```text
é assim que você interage comigo.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Fluxo ruim

Execute:

```text
PedidoProceduralApp.java
```

Liste todas as regras que estão no `main`.

### Parte 2 — Objetos de pedido

Crie e execute:

```text
PedidoColaboracaoApp.java
```

Explique a responsabilidade de:

```text
Cliente;
Produto;
ItemPedido;
Pedido;
Dinheiro.
```

### Parte 3 — Fluxo de pagamento

No debug, acompanhe:

```text
pedido.adicionarItem(cadeira, 2);
produto.reservarEstoque(2);
item.subtotal();
pedido.total();
pedido.confirmarPagamento(...).
```

Explique quem faz cada parte.

### Parte 4 — Ordem de Serviço

Execute:

```text
OrdemServicoColaboracaoApp.java
```

Explique a colaboração entre:

```text
CodigoOs;
PeriodoAtendimento;
Tecnico;
OrdemServico.
```

### Parte 5 — Compare os estilos

Compare:

```text
atributo público + main fazendo tudo;
métodos de domínio + objetos colaborando.
```

Responda:

```text
qual é mais seguro?
qual é mais legível?
qual protege melhor as regras?
qual facilita manutenção?
```

---

## Desafio prático

Crie um fluxo de contrato com colaboração entre objetos.

Estrutura sugerida:

```text
src\br\com\curso\aula130\appcontrato
src\br\com\curso\aula130\dominio\contrato
src\br\com\curso\aula130\dominio\servico
src\br\com\curso\aula130\dominio\clientecontrato
```

Arquivos sugeridos:

```text
appcontrato\ContratoColaboracaoApp.java

dominio\contrato\Contrato.java
dominio\contrato\PeriodoContrato.java
dominio\contrato\StatusContrato.java

dominio\servico\ServicoContratado.java

dominio\clientecontrato\ClienteCorporativo.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras:

```text
ClienteCorporativo tem id, razão social e ativo.
ServicoContratado tem nome e valor mensal.
PeriodoContrato tem início e fim.
Contrato tem código, cliente, serviço, período e status.
Contrato nasce RASCUNHO.
Contrato pode ativar se cliente estiver ativo.
Contrato calcula valor total usando serviço.valorMensal e período.quantidadeMeses.
Contrato pode cancelar com motivo.
Contrato ativo não pode ser ativado novamente.
Contrato cancelado não pode ser ativado.
```

Fluxo esperado no app:

```text
criar cliente;
criar serviço;
criar período;
criar contrato;
ativar contrato;
calcular valor total;
cancelar contrato;
imprimir resumo.
```

Cuidados:

```text
App não deve alterar status diretamente.
Contrato deve pedir informações ao cliente, serviço e período.
PeriodoContrato deve calcular quantidade de meses.
ServicoContratado deve proteger valor mensal.
Dinheiro deve somar e multiplicar.
```

Critério principal:

```text
objetos colaboram por métodos, não por invasão de estado.
```

---

## Erros comuns

### 1. Achar que criar classes já é OO

Classe com atributo público e sem comportamento pode ser só estrutura de dados.

### 2. Colocar toda regra no app

App deve coordenar exemplo, não substituir o domínio.

### 3. Usar setters para tudo

Prefira métodos de domínio com intenção.

### 4. Expor lista interna diretamente

Coleções internas devem ser protegidas. Vamos aprofundar isso em aulas de coleções.

### 5. Calcular total fora do pedido

O pedido deve saber calcular seu total a partir dos itens.

### 6. Alterar estoque fora do produto

Produto deve proteger seu estoque.

### 7. Fazer um objeto conhecer detalhes demais

Colaboração não significa um objeto fazer tudo.

### 8. Confundir colaboração com acoplamento descontrolado

Objetos colaboram, mas as dependências precisam fazer sentido.

---

## Debug recomendado

Use debug em:

```text
PedidoProceduralApp.java
PedidoColaboracaoApp.java
OrdemServicoColaboracaoApp.java
```

Breakpoints recomendados:

```java
pedido.adicionarItem(cadeira, 2);
produto.reservarEstoque(quantidade);
new ItemPedido(produto, quantidade);
item.subtotal();
pedido.total();
pedido.confirmarPagamento(...);

os.atribuirTecnico(tecnico);
os.reagendar(...);
os.iniciarAtendimento();
os.concluir();
```

Observe:

```text
qual objeto recebe a chamada;
qual objeto valida a regra;
qual objeto altera o próprio estado;
qual objeto retorna informação;
qual objeto não deve ser invadido.
```

O objetivo é enxergar a conversa entre objetos.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é colaboração entre objetos?
2. Por que app não deve manipular status e estoque diretamente?
3. Qual método de domínio você criaria para evitar um setter?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar colaboração entre objetos;
diferenciar fluxo procedural de fluxo orientado a objetos;
criar objetos que protegem o próprio estado;
usar métodos de domínio com intenção;
evitar atributos públicos;
evitar setters desnecessários;
fazer Pedido colaborar com Produto, ItemPedido e Dinheiro;
fazer OrdemServico colaborar com Tecnico e PeriodoAtendimento;
entender o papel do app como coordenador do exemplo;
proteger invariantes;
resolver o desafio de contrato;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-130-colaboracao-entre-objetos
git commit -m "Aula 130: pratica colaboracao entre objetos"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
objetos colaboram enviando mensagens uns aos outros por métodos com intenção.
```

Você viu que OO não é apenas criar classes.

OO de verdade aparece quando objetos protegem suas regras e trabalham juntos sem expor seus detalhes internos.

Na próxima aula, vamos aprofundar o princípio `Tell, Don't Ask`.

Vamos aprender a evitar código que pergunta dados demais para tomar decisões fora do objeto e substituir isso por métodos de domínio mais expressivos.
