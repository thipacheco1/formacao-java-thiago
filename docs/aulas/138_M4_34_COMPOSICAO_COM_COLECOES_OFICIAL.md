# 138 — M4.34 — Composição com coleções

## Objetivo da aula

Nesta aula você vai aprender composição com coleções.

Na aula anterior, você estudou coleções dentro de objetos e viu como proteger listas internas para evitar alteração externa indevida. Agora vamos avançar um nível:

```text
quando uma entidade é dona dos objetos que estão dentro de uma coleção?
```

Ao final da aula, você deve conseguir:

```text
explicar composição com coleções;
diferenciar associação simples de composição;
entender dono do ciclo de vida;
evitar objetos filhos soltos e compartilhados indevidamente;
criar itens internos controlados pela entidade dona;
proteger criação, remoção e consulta de filhos;
usar construtores package-private quando fizer sentido;
modelar Pedido com ItemPedido;
modelar Contrato com ServicoContrato;
modelar OrdemServico com OcorrenciaOs;
entender a base para agregados.
```

Essa aula é importante porque muitos objetos de domínio não vivem sozinhos.

Um `Pedido` quase sempre tem itens.

Uma `OrdemServico` quase sempre tem ocorrências.

Um `Contrato` pode ter vários serviços.

A pergunta é:

```text
esses objetos da lista pertencem ao objeto principal ou apenas se relacionam com ele?
```

Essa diferença muda a modelagem.

---

## A ideia central

Composição significa que um objeto é dono de outro.

Quando existe composição, o objeto filho normalmente não faz sentido sozinho fora do objeto pai.

Exemplo:

```text
Pedido compõe ItemPedido.
OrdemServico compõe OcorrenciaOs.
Contrato compõe ServicoContrato.
Checklist compõe PerguntaChecklist.
```

Um `ItemPedido` sem `Pedido` geralmente não tem sentido no domínio.

Uma `OcorrenciaOs` sem `OrdemServico` normalmente é apenas um registro solto.

Uma `PerguntaChecklist` pertence a um checklist específico.

Nesses casos, a entidade principal deve controlar:

```text
criação dos filhos;
remoção dos filhos;
regras de alteração;
exposição segura da coleção;
invariantes envolvendo a lista.
```

---

## Associação não é composição

Nem toda relação entre objetos é composição.

Exemplo:

```text
Pedido tem Cliente.
```

Mas o pedido não é dono do cliente.

Se o pedido for cancelado, o cliente não deixa de existir.

O cliente pode ter vários pedidos.

Essa relação é associação.

Agora:

```text
Pedido tem ItemPedido.
```

O item existe dentro daquele pedido.

Se o pedido não existir, aquele item não faz sentido sozinho.

Isso é composição.

Resumo:

```text
Associação:
um objeto conhece outro, mas não controla sua vida.

Composição:
um objeto é dono do outro e controla sua vida dentro do domínio.
```

---

## Pergunta prática

Para decidir se é composição, pergunte:

```text
o filho faz sentido sozinho?
o filho pode pertencer a vários pais?
o pai deve controlar criação do filho?
o pai deve controlar remoção do filho?
o filho deve ser alterado apenas por regras do pai?
se o pai sumir, o filho ainda faz sentido?
```

Exemplo `Cliente`:

```text
faz sentido sem Pedido? sim.
pode ter vários Pedidos? sim.
Pedido deve criar Cliente? não.
```

Então é associação.

Exemplo `ItemPedido`:

```text
faz sentido sem Pedido? geralmente não.
pode pertencer a vários Pedidos? não.
Pedido deve controlar criação? sim.
```

Então é composição.

---

## Composição e encapsulamento

Quando há composição, o objeto pai deve proteger os filhos.

Ruim:

```java
ItemPedido item = new ItemPedido(...);
pedido.itens().add(item);
```

Melhor:

```java
pedido.adicionarItem("PROD-001", "Cadeira", Dinheiro.de("199.90"), 2);
```

No primeiro caso, o app cria e injeta o filho.

No segundo, o pedido cria o item internamente.

Isso reforça a ideia:

```text
o pai é dono da coleção e controla como os filhos entram nela.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-138-composicao-com-colecoes
cd labs\m4\aula-138-composicao-com-colecoes
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula138
mkdir src\br\com\curso\aula138\app
mkdir src\br\com\curso\aula138\exemplo
mkdir src\br\com\curso\aula138\exemplo\ruim
mkdir src\br\com\curso\aula138\dominio
mkdir src\br\com\curso\aula138\dominio\valor
mkdir src\br\com\curso\aula138\dominio\cliente
mkdir src\br\com\curso\aula138\dominio\pedido
mkdir src\br\com\curso\aula138\dominio\contrato
mkdir src\br\com\curso\aula138\dominio\ordemservico
```

Nesta aula, vamos trabalhar com:

```text
um exemplo ruim de filho compartilhado;
Pedido compondo ItemPedido;
Contrato compondo ServicoContrato;
OrdemServico compondo OcorrenciaOs.
```

---

## Exemplo 1 — Filho compartilhado indevidamente

Crie:

```text
src\br\com\curso\aula138\exemplo\ruim\ItemCompartilhadoApp.java
```

Código:

```java
package br.com.curso.aula138.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class ItemCompartilhadoApp {
    public static void main(String[] args) {
        ItemCompartilhado item = new ItemCompartilhado(
                "PROD-001",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        PedidoComItemCompartilhado pedido1 = new PedidoComItemCompartilhado(1001);
        PedidoComItemCompartilhado pedido2 = new PedidoComItemCompartilhado(1002);

        pedido1.adicionarItem(item);
        pedido2.adicionarItem(item);

        System.out.println("Antes da alteração:");
        System.out.println(pedido1.resumo());
        System.out.println(pedido2.resumo());

        item.alterarQuantidade(10);

        System.out.println();
        System.out.println("Depois da alteração no item compartilhado:");
        System.out.println(pedido1.resumo());
        System.out.println(pedido2.resumo());
    }
}

class PedidoComItemCompartilhado {
    private final int numero;
    private final List<ItemCompartilhado> itens;

    PedidoComItemCompartilhado(int numero) {
        this.numero = numero;
        this.itens = new ArrayList<>();
    }

    void adicionarItem(ItemCompartilhado item) {
        itens.add(item);
    }

    BigDecimal total() {
        BigDecimal total = BigDecimal.ZERO;

        for (ItemCompartilhado item : itens) {
            total = total.add(item.subtotal());
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }

    String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("Pedido ").append(numero)
                .append(" | Total: R$ ").append(total())
                .append("\nItens:");

        for (ItemCompartilhado item : itens) {
            texto.append("\n- ").append(item.resumo());
        }

        return texto.toString();
    }
}

class ItemCompartilhado {
    private final String codigoProduto;
    private final String descricao;
    private final BigDecimal valorUnitario;
    private int quantidade;

    ItemCompartilhado(String codigoProduto, String descricao, BigDecimal valorUnitario, int quantidade) {
        this.codigoProduto = codigoProduto;
        this.descricao = descricao;
        this.valorUnitario = valorUnitario.setScale(2, RoundingMode.HALF_UP);
        this.quantidade = quantidade;
    }

    void alterarQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    BigDecimal subtotal() {
        return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    String resumo() {
        return codigoProduto
                + " - " + descricao
                + " | Quantidade: " + quantidade
                + " | Unitário: R$ " + valorUnitario
                + " | Subtotal: R$ " + subtotal();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula138.exemplo.ruim.ItemCompartilhadoApp
```

---

## O problema do exemplo

O mesmo objeto `ItemCompartilhado` foi colocado em dois pedidos.

Depois, quando alteramos a quantidade:

```java
item.alterarQuantidade(10);
```

os dois pedidos foram afetados.

Isso é perigoso porque `ItemPedido` deveria pertencer a um único pedido.

Quando o filho é parte da composição, ele não deveria ser compartilhado livremente entre vários pais.

O erro principal é:

```text
o app cria o filho;
o app compartilha o filho;
o filho é mutável;
o pedido não controla seu próprio conteúdo.
```

Com composição, o pai precisa controlar melhor a criação dos filhos.

---

## Criando Dinheiro

Crie:

```text
src\br\com\curso\aula138\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula138.dominio.valor;

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

---

## Cliente como associação

Crie:

```text
src\br\com\curso\aula138\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula138.dominio.cliente;

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

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome + " | Ativo: " + ativo;
    }
}
```

`Cliente` será associado ao `Pedido`.

O pedido não cria o cliente.

O cliente existe fora do pedido.

---

## StatusPedido

Crie:

```text
src\br\com\curso\aula138\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula138.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## ItemPedido como parte do Pedido

Crie:

```text
src\br\com\curso\aula138\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula138.dominio.pedido;

import br.com.curso.aula138.dominio.valor.Dinheiro;

public class ItemPedido {
    private final String codigoProduto;
    private final String descricao;
    private final Dinheiro valorUnitario;
    private final int quantidade;

    ItemPedido(String codigoProduto, String descricao, Dinheiro valorUnitario, int quantidade) {
        if (codigoProduto == null || codigoProduto.isBlank()) {
            throw new IllegalArgumentException("Código do produto é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (valorUnitario == null || !valorUnitario.positivo()) {
            throw new IllegalArgumentException("Valor unitário deve ser positivo.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.codigoProduto = codigoProduto;
        this.descricao = descricao;
        this.valorUnitario = valorUnitario;
        this.quantidade = quantidade;
    }

    public boolean mesmoProduto(String codigoProduto) {
        if (codigoProduto == null || codigoProduto.isBlank()) {
            return false;
        }

        return this.codigoProduto.equals(codigoProduto);
    }

    public Dinheiro subtotal() {
        return valorUnitario.multiplicar(quantidade);
    }

    public String resumo() {
        return codigoProduto
                + " - " + descricao
                + " | Quantidade: " + quantidade
                + " | Unitário: " + valorUnitario
                + " | Subtotal: " + subtotal();
    }
}
```

Observe o construtor:

```java
ItemPedido(...)
```

Ele não é `public`.

Isso significa que classes fora do pacote `pedido` não conseguem criar `ItemPedido` diretamente.

O app deve passar pelo `Pedido`.

---

## Pedido controlando seus itens

Crie:

```text
src\br\com\curso\aula138\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula138.dominio.pedido;

import br.com.curso.aula138.dominio.cliente.Cliente;
import br.com.curso.aula138.dominio.valor.Dinheiro;

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

    public void adicionarItem(String codigoProduto, String descricao, Dinheiro valorUnitario, int quantidade) {
        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode receber itens.");
        }

        if (existeItemDoProduto(codigoProduto)) {
            throw new IllegalArgumentException("Produto já existe no pedido: " + codigoProduto);
        }

        itens.add(new ItemPedido(
                codigoProduto,
                descricao,
                valorUnitario,
                quantidade
        ));
    }

    public void removerItem(String codigoProduto) {
        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode remover itens.");
        }

        boolean removido = itens.removeIf(item -> item.mesmoProduto(codigoProduto));

        if (!removido) {
            throw new IllegalArgumentException("Produto não encontrado no pedido: " + codigoProduto);
        }
    }

    public boolean existeItemDoProduto(String codigoProduto) {
        for (ItemPedido item : itens) {
            if (item.mesmoProduto(codigoProduto)) {
                return true;
            }
        }

        return false;
    }

    public int quantidadeItens() {
        return itens.size();
    }

    public Dinheiro total() {
        Dinheiro total = Dinheiro.zero();

        for (ItemPedido item : itens) {
            total = total.somar(item.subtotal());
        }

        return total;
    }

    public List<ItemPedido> itens() {
        return List.copyOf(itens);
    }

    public void confirmarPagamento(Dinheiro valorPago) {
        if (status != StatusPedido.CRIADO) {
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

        if (status == StatusPedido.PAGO) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado por este fluxo.");
        }

        if (status == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        status = StatusPedido.CANCELADO;
        motivoCancelamento = motivo;
    }

    public String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("Pedido ").append(numero)
                .append(" | Cliente: ").append(cliente.resumo())
                .append(" | Itens: ").append(itens.size())
                .append(" | Total: ").append(total())
                .append(" | Status: ").append(status)
                .append(" | Motivo cancelamento: ").append(motivoCancelamento)
                .append("\nItens:");

        for (ItemPedido item : itens) {
            texto.append("\n- ").append(item.resumo());
        }

        return texto.toString();
    }
}
```

---

## App usando composição em Pedido

Crie:

```text
src\br\com\curso\aula138\app\PedidoComposicaoApp.java
```

Código:

```java
package br.com.curso.aula138.app;

import br.com.curso.aula138.dominio.cliente.Cliente;
import br.com.curso.aula138.dominio.pedido.Pedido;
import br.com.curso.aula138.dominio.valor.Dinheiro;

public class PedidoComposicaoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva"
        );

        Pedido pedido = new Pedido(
                1001,
                cliente
        );

        pedido.adicionarItem("PROD-001", "Cadeira", Dinheiro.de("199.90"), 2);
        pedido.adicionarItem("PROD-002", "Mesa", Dinheiro.de("399.90"), 1);

        pedido.confirmarPagamento(Dinheiro.de("799.70"));

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula138.app.PedidoComposicaoApp
```

---

## O que esse modelo melhora

O `Pedido` controla `ItemPedido`.

O app não faz:

```java
new ItemPedido(...)
```

O app não compartilha item entre pedidos.

O app não altera item diretamente.

O pedido controla:

```text
quando item pode ser adicionado;
quando item pode ser removido;
se produto duplicado é permitido;
se pedido sem item pode ser pago;
como total é calculado.
```

Isso é composição com coleção.

---

## Por que o construtor do ItemPedido não é public

O construtor do `ItemPedido` está assim:

```java
ItemPedido(...)
```

Sem `public`.

Isso limita a criação ao pacote `br.com.curso.aula138.dominio.pedido`.

Como `Pedido` está no mesmo pacote, ele consegue criar.

Como o app está em outro pacote, ele não consegue criar diretamente.

Esse é um recurso simples para reforçar o dono da composição.

Não é obrigatório em todo caso, mas é útil para aprender a proteger o modelo.

---

## Exemplo 2 — Contrato compondo serviços

Agora vamos modelar `Contrato` como dono dos serviços contratados.

Neste exemplo:

```text
Cliente é associação;
ServicoContrato é composição.
```

O cliente existe fora do contrato.

O serviço contratado existe dentro daquele contrato específico.

---

## StatusContrato

Crie:

```text
src\br\com\curso\aula138\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula138.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

---

## ServicoContrato

Crie:

```text
src\br\com\curso\aula138\dominio\contrato\ServicoContrato.java
```

Código:

```java
package br.com.curso.aula138.dominio.contrato;

import br.com.curso.aula138.dominio.valor.Dinheiro;

public class ServicoContrato {
    private final String codigo;
    private final String nome;
    private final Dinheiro valorMensal;

    ServicoContrato(String codigo, String nome, Dinheiro valorMensal) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do serviço é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do serviço é obrigatório.");
        }

        if (valorMensal == null || !valorMensal.positivo()) {
            throw new IllegalArgumentException("Valor mensal deve ser positivo.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.valorMensal = valorMensal;
    }

    public boolean mesmoCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return false;
        }

        return this.codigo.equals(codigo);
    }

    public Dinheiro valorMensal() {
        return valorMensal;
    }

    public String resumo() {
        return codigo + " - " + nome + " | Mensal: " + valorMensal;
    }
}
```

Construtor package-private novamente.

O contrato será o dono da criação.

---

## Contrato

Crie:

```text
src\br\com\curso\aula138\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula138.dominio.contrato;

import br.com.curso.aula138.dominio.cliente.Cliente;
import br.com.curso.aula138.dominio.valor.Dinheiro;

import java.util.ArrayList;
import java.util.List;

public class Contrato {
    private final String codigo;
    private final Cliente cliente;
    private final List<ServicoContrato> servicos;
    private StatusContrato status;
    private String motivoCancelamento;

    public Contrato(String codigo, Cliente cliente) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("CONT-")) {
            throw new IllegalArgumentException("Código deve iniciar com CONT-.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Contrato não pode ser criado para cliente inativo.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.servicos = new ArrayList<>();
        this.status = StatusContrato.RASCUNHO;
        this.motivoCancelamento = "";
    }

    public void adicionarServico(String codigo, String nome, Dinheiro valorMensal) {
        if (status != StatusContrato.RASCUNHO) {
            throw new IllegalStateException("Somente contrato em rascunho pode receber serviço.");
        }

        if (existeServico(codigo)) {
            throw new IllegalArgumentException("Serviço já existe no contrato: " + codigo);
        }

        servicos.add(new ServicoContrato(codigo, nome, valorMensal));
    }

    public void removerServico(String codigo) {
        if (status != StatusContrato.RASCUNHO) {
            throw new IllegalStateException("Somente contrato em rascunho pode remover serviço.");
        }

        boolean removido = servicos.removeIf(servico -> servico.mesmoCodigo(codigo));

        if (!removido) {
            throw new IllegalArgumentException("Serviço não encontrado no contrato: " + codigo);
        }
    }

    public boolean existeServico(String codigo) {
        for (ServicoContrato servico : servicos) {
            if (servico.mesmoCodigo(codigo)) {
                return true;
            }
        }

        return false;
    }

    public Dinheiro valorMensalTotal() {
        Dinheiro total = Dinheiro.zero();

        for (ServicoContrato servico : servicos) {
            total = total.somar(servico.valorMensal());
        }

        return total;
    }

    public List<ServicoContrato> servicos() {
        return List.copyOf(servicos);
    }

    public void ativar() {
        if (status != StatusContrato.RASCUNHO) {
            throw new IllegalStateException("Somente contrato em rascunho pode ser ativado.");
        }

        if (servicos.isEmpty()) {
            throw new IllegalStateException("Contrato precisa ter pelo menos um serviço para ativar.");
        }

        status = StatusContrato.ATIVO;
    }

    public void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (status == StatusContrato.CANCELADO) {
            throw new IllegalStateException("Contrato já está cancelado.");
        }

        status = StatusContrato.CANCELADO;
        motivoCancelamento = motivo;
    }

    public String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("Contrato ").append(codigo)
                .append(" | Cliente: ").append(cliente.resumo())
                .append(" | Serviços: ").append(servicos.size())
                .append(" | Mensal total: ").append(valorMensalTotal())
                .append(" | Status: ").append(status)
                .append(" | Motivo cancelamento: ").append(motivoCancelamento)
                .append("\nServiços:");

        for (ServicoContrato servico : servicos) {
            texto.append("\n- ").append(servico.resumo());
        }

        return texto.toString();
    }
}
```

---

## App usando composição em Contrato

Crie:

```text
src\br\com\curso\aula138\app\ContratoComposicaoApp.java
```

Código:

```java
package br.com.curso.aula138.app;

import br.com.curso.aula138.dominio.cliente.Cliente;
import br.com.curso.aula138.dominio.contrato.Contrato;
import br.com.curso.aula138.dominio.valor.Dinheiro;

public class ContratoComposicaoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                20,
                "Cliente Corporativo A"
        );

        Contrato contrato = new Contrato(
                "CONT-001",
                cliente
        );

        contrato.adicionarServico("SERV-001", "Instalação", Dinheiro.de("150.00"));
        contrato.adicionarServico("SERV-002", "Manutenção", Dinheiro.de("80.00"));

        contrato.ativar();

        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula138.app.ContratoComposicaoApp
```

---

## O que o contrato ensina

O `Contrato` é dono da coleção de `ServicoContrato`.

Ele controla:

```text
criação do serviço contratado;
serviço duplicado;
remoção;
ativação apenas com serviços;
bloqueio de alteração após ativação;
cálculo do valor mensal total.
```

Isso é diferente de `Cliente`.

O contrato conhece o cliente, mas não cria nem controla a vida do cliente.

Logo:

```text
Cliente é associação.
ServicoContrato é composição.
```

---

## Exemplo 3 — OrdemServico compondo ocorrências

Agora vamos modelar uma composição muito comum em backend:

```text
OrdemServico possui OcorrenciaOs.
```

A ocorrência representa algo que aconteceu com a OS.

Ela não deve ser criada livremente pelo app.

Ela deve nascer como consequência de ações da OS:

```text
criação;
reagendamento;
conclusão;
cancelamento.
```

---

## Código da OS

Crie:

```text
src\br\com\curso\aula138\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula138.dominio.ordemservico;

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

Crie:

```text
src\br\com\curso\aula138\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula138.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula138\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula138.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula138\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula138.dominio.ordemservico;

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

## OcorrenciaOs

Crie:

```text
src\br\com\curso\aula138\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula138.dominio.ordemservico;

import java.time.LocalDateTime;

public class OcorrenciaOs {
    private final LocalDateTime dataHora;
    private final String descricao;

    OcorrenciaOs(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição da ocorrência é obrigatória.");
        }

        this.dataHora = LocalDateTime.now();
        this.descricao = descricao;
    }

    public String resumo() {
        return dataHora + " | " + descricao;
    }
}
```

O construtor também não é `public`.

Quem cria ocorrência é a OS.

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula138\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula138.dominio.ordemservico;

import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private PeriodoAtendimento periodo;
    private StatusOs status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;
    private final List<OcorrenciaOs> ocorrencias;

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
        this.status = StatusOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
        this.motivoCancelamento = "";
        this.ocorrencias = new ArrayList<>();

        registrarOcorrencia("OS criada com período " + periodo);
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public void reagendar(PeriodoAtendimento novoPeriodo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        if (periodo.equals(novoPeriodo)) {
            throw new IllegalArgumentException("Novo período deve ser diferente do atual.");
        }

        PeriodoAtendimento periodoAnterior = periodo;

        periodo = novoPeriodo;
        status = StatusOs.REAGENDADA;
        quantidadeReagendamentos++;

        registrarOcorrencia("OS reagendada de " + periodoAnterior + " para " + novoPeriodo);
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
        registrarOcorrencia("OS concluída");
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

        registrarOcorrencia("OS cancelada. Motivo: " + motivo);
    }

    public List<OcorrenciaOs> ocorrencias() {
        return List.copyOf(ocorrencias);
    }

    private void registrarOcorrencia(String descricao) {
        ocorrencias.add(new OcorrenciaOs(descricao));
    }

    public String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("OS ").append(codigo)
                .append(" | Cliente: ").append(cliente)
                .append(" | Período: ").append(periodo)
                .append(" | Status: ").append(status)
                .append(" | Reagendamentos: ").append(quantidadeReagendamentos)
                .append(" | Motivo cancelamento: ").append(motivoCancelamento)
                .append("\nOcorrências:");

        for (OcorrenciaOs ocorrencia : ocorrencias) {
            texto.append("\n- ").append(ocorrencia.resumo());
        }

        return texto.toString();
    }
}
```

---

## App usando composição em OS

Crie:

```text
src\br\com\curso\aula138\app\OrdemServicoComposicaoApp.java
```

Código:

```java
package br.com.curso.aula138.app;

import br.com.curso.aula138.dominio.ordemservico.CodigoOs;
import br.com.curso.aula138.dominio.ordemservico.OrdemServico;
import br.com.curso.aula138.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula138.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoComposicaoApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        os.reagendar(new PeriodoAtendimento(
                LocalDate.now().plusDays(3),
                TurnoAtendimento.TARDE
        ));

        os.concluir();

        System.out.println(os.resumo());
        System.out.println();
        System.out.println("Quantidade de ocorrências: " + os.ocorrencias().size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula138.app.OrdemServicoComposicaoApp
```

---

## O que a OS ensina

A `OrdemServico` controla `OcorrenciaOs`.

O app não cria ocorrência.

O app não adiciona ocorrência.

O app não limpa histórico.

Ocorrências são consequências de ações da OS:

```text
construtor registra criação;
reagendar registra reagendamento;
concluir registra conclusão;
cancelar registra cancelamento.
```

Esse é um exemplo forte de composição com coleção.

---

## Sinais de composição com coleção

Alguns sinais de que você tem composição:

```text
o filho não deveria ser compartilhado entre pais;
o filho não tem vida útil relevante fora do pai;
a criação do filho depende de uma ação do pai;
a remoção do filho depende de regra do pai;
o pai calcula algo usando os filhos;
o pai não deve permitir alteração livre dos filhos;
o filho é parte do estado do pai.
```

Exemplos:

```text
Pedido -> ItemPedido;
Contrato -> ServicoContrato;
OrdemServico -> OcorrenciaOs;
Checklist -> PerguntaChecklist;
Pagamento -> EventoPagamento.
```

---

## Sinais de associação

Alguns sinais de associação:

```text
o objeto relacionado existe sozinho;
pode ser usado por vários objetos;
não é criado pelo objeto atual;
não deve ser apagado junto com o objeto atual;
tem identidade própria no domínio.
```

Exemplos:

```text
Pedido -> Cliente;
OrdemServico -> Técnico;
Contrato -> Cliente;
Pagamento -> Contrato.
```

O pedido conhece o cliente, mas não é dono dele.

A OS conhece o técnico, mas não cria nem destrói o técnico.

---

## Composição e identidade dos filhos

Nem todo filho de composição precisa de identidade pública.

`ItemPedido` pode ser identificado internamente pelo código do produto.

`OcorrenciaOs` pode ser apenas uma entrada no histórico.

`ServicoContrato` pode ser identificado dentro do contrato pelo código do serviço.

Mais adiante, quando estudarmos agregados e persistência, veremos casos onde filhos podem ter IDs internos.

Por enquanto, entenda:

```text
filho de composição não precisa necessariamente ser buscado e alterado diretamente pelo sistema inteiro.
```

O acesso passa pelo pai.

---

## Composição e regras de remoção

Remover filho também é regra.

Exemplo:

```java
pedido.removerItem("PROD-001");
```

Pode ser permitido enquanto o pedido está criado.

Mas não depois de pago.

Exemplo:

```java
contrato.removerServico("SERV-001");
```

Pode ser permitido enquanto o contrato está em rascunho.

Mas não depois de ativo.

Remover não é só `list.remove`.

É ação de domínio.

---

## Composição e histórico

Histórico é um caso especial.

Em muitos domínios, histórico não deve ser removido.

Exemplo:

```text
ocorrências de OS;
eventos de pagamento;
histórico de alteração de contrato;
auditoria de pedido.
```

Nesses casos, talvez nem exista método público de remover.

A coleção cresce por eventos de domínio.

Isso protege rastreabilidade do objeto.

---

## Package-private como ferramenta

Usamos construtores sem `public` em:

```text
ItemPedido;
ServicoContrato;
OcorrenciaOs.
```

Isso permite que apenas classes do mesmo pacote criem esses objetos.

É uma forma simples de reforçar:

```text
esses objetos são controlados pelo pacote de domínio do pai.
```

Não é a única técnica.

Mas ajuda a evitar que o app crie filhos indevidamente.

---

## Cuidado com retorno de filhos mutáveis

Mesmo retornando:

```java
List.copyOf(itens)
```

se os objetos dentro da lista forem mutáveis, alguém pode alterar o filho.

Por isso, em composição, filhos costumam ser:

```text
imutáveis;
ou alterados apenas por métodos do pai;
ou com métodos bem controlados.
```

Nos exemplos:

```text
ItemPedido não tem setter;
ServicoContrato não tem setter;
OcorrenciaOs não tem setter.
```

Isso facilita proteger a composição.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Filho compartilhado

Execute:

```text
ItemCompartilhadoApp.java
```

Explique:

```text
por que o mesmo item em dois pedidos é perigoso;
como a alteração afetou os dois pedidos;
por que isso viola a ideia de composição.
```

### Parte 2 — Pedido

Execute:

```text
PedidoComposicaoApp.java
```

Explique:

```text
por que Cliente é associação;
por que ItemPedido é composição;
por que o app não cria ItemPedido diretamente;
por que o pedido controla adicionarItem.
```

### Parte 3 — Contrato

Execute:

```text
ContratoComposicaoApp.java
```

Explique:

```text
por que ServicoContrato pertence ao Contrato;
por que o contrato controla adicionarServico;
por que contrato ativo não deve aceitar remoção.
```

### Parte 4 — OrdemServico

Execute:

```text
OrdemServicoComposicaoApp.java
```

Explique:

```text
por que OcorrenciaOs pertence à OS;
por que registrarOcorrencia é privado;
por que o app não deve criar histórico manualmente.
```

### Parte 5 — Classificação

Classifique as relações:

```text
Pedido -> Cliente
Pedido -> ItemPedido
Contrato -> Cliente
Contrato -> ServicoContrato
OrdemServico -> Técnico
OrdemServico -> OcorrenciaOs
Checklist -> PerguntaChecklist
Pagamento -> EventoPagamento
```

Responda:

```text
associação ou composição?
```

---

## Desafio prático

Crie um domínio de `Checklist` usando composição com coleção.

Estrutura sugerida:

```text
src\br\com\curso\aula138\appchecklist
src\br\com\curso\aula138\dominio\checklist
```

Arquivos sugeridos:

```text
appchecklist\ChecklistComposicaoApp.java

dominio\checklist\Checklist.java
dominio\checklist\PerguntaChecklist.java
dominio\checklist\StatusChecklist.java
```

Regras:

```text
Checklist é dono das perguntas.
PerguntaChecklist não deve ter construtor public.
Checklist nasce EM_EDICAO.
Checklist pode adicionar pergunta enquanto EM_EDICAO.
Checklist cria PerguntaChecklist internamente.
Checklist pode responder pergunta pelo código.
Checklist pode remover pergunta enquanto EM_EDICAO.
Checklist finalizado não pode alterar perguntas.
Checklist cancelado não pode alterar perguntas.
Checklist não pode finalizar sem perguntas.
Checklist não pode finalizar com pergunta obrigatória sem resposta.
Perguntas devem ser expostas com List.copyOf.
```

Métodos esperados em `Checklist`:

```text
adicionarPergunta(String codigo, String texto, boolean obrigatoria);
responderPergunta(String codigo, String resposta);
removerPergunta(String codigo);
finalizar();
cancelar(String motivo);
perguntas();
quantidadePerguntas();
resumo();
```

Métodos esperados em `PerguntaChecklist`:

```text
mesmoCodigo(String codigo);
responder(String resposta);
obrigatoriaSemResposta();
resumo();
```

Critério principal:

```text
Checklist controla o ciclo de vida das PerguntaChecklist.
```

---

## Erros comuns

### 1. Confundir associação com composição

Nem todo objeto dentro de outro é filho composto.

### 2. Criar filho fora do pai sem necessidade

Se o pai é dono, deixe o pai criar.

### 3. Compartilhar filho entre vários pais

Isso quebra a ideia de composição.

### 4. Expor coleção mutável

Mesmo com composição, a lista precisa ser protegida.

### 5. Deixar filho mutável demais

Filho com setters livres pode quebrar o estado do pai.

### 6. Criar método público para histórico livre

Histórico deve ser consequência de ações importantes.

### 7. Colocar toda regra no filho

O pai também precisa proteger regras envolvendo a coleção.

### 8. Usar composição para tudo

Se o objeto tem vida própria, pode ser associação.

---

## Debug recomendado

Use debug em:

```text
ItemCompartilhadoApp.java
PedidoComposicaoApp.java
ContratoComposicaoApp.java
OrdemServicoComposicaoApp.java
```

Breakpoints recomendados:

```java
pedido1.adicionarItem(item)
pedido2.adicionarItem(item)
item.alterarQuantidade(10)

pedido.adicionarItem(...)
new ItemPedido(...)
pedido.confirmarPagamento(...)

contrato.adicionarServico(...)
new ServicoContrato(...)
contrato.ativar()

os.reagendar(...)
registrarOcorrencia(...)
new OcorrenciaOs(...)
os.ocorrencias()
```

Observe:

```text
quem cria o filho;
quem guarda o filho;
se o filho é compartilhado;
quando a coleção muda;
quando o pai valida regra;
quando o histórico é criado automaticamente.
```

O objetivo é enxergar o dono da coleção.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual diferença entre associação e composição?
2. Por que ItemPedido deve ser controlado pelo Pedido?
3. Quando faz sentido deixar o construtor do filho sem public?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar composição com coleção;
diferenciar associação de composição;
identificar dono do ciclo de vida;
evitar filho compartilhado indevidamente;
proteger criação de filhos pelo pai;
usar construtor package-private para filhos;
usar List.copyOf para consulta segura;
impedir alteração externa da coleção;
modelar Pedido com ItemPedido;
modelar Contrato com ServicoContrato;
modelar OrdemServico com OcorrenciaOs;
resolver o desafio de Checklist;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-138-composicao-com-colecoes
git commit -m "Aula 138: pratica composicao com colecoes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
em composição com coleções, a entidade principal é dona dos objetos filhos e controla como eles são criados, removidos e consultados.
```

Você viu que `Pedido` não deve receber um `ItemPedido` compartilhado de fora, que `Contrato` controla seus serviços e que `OrdemServico` cria suas próprias ocorrências.

Essa aula prepara o terreno para um conceito muito importante.

Na próxima aula, vamos estudar agregados em uma visão inicial.

Vamos entender como uma entidade principal protege um conjunto de objetos relacionados e funciona como ponto de entrada para alterações consistentes no domínio.
