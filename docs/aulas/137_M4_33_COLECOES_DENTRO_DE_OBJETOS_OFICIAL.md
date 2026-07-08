# 137 — M4.33 — Coleções dentro de objetos

## Objetivo da aula

Nesta aula você vai aprender como trabalhar com coleções dentro de objetos.

Na aula anterior, você estudou Builder inicial e viu como construir objetos com muitos dados de forma mais legível. Agora vamos aprofundar um ponto que aparece o tempo todo em domínio Java:

```text
um objeto que possui uma lista de outros objetos.
```

Exemplos:

```text
Pedido possui itens;
Contrato possui serviços contratados;
OrdemServico possui ocorrências;
Cliente possui endereços;
Checklist possui perguntas;
Produto possui categorias;
Pagamento possui histórico de eventos.
```

Ao final da aula, você deve conseguir:

```text
criar coleções dentro de entidades;
entender o risco de expor uma lista interna;
proteger uma coleção contra alteração externa indevida;
usar métodos de domínio para adicionar e remover itens;
validar itens antes de adicionar;
calcular totais com base em uma lista;
retornar cópia segura ou lista não modificável;
entender diferença entre proteger referência e proteger objetos internos;
modelar Pedido com itens, Contrato com serviços e OrdemServico com ocorrências.
```

Essa aula é essencial porque listas são uma das maiores fontes de bug em objetos de domínio.

Uma entidade pode estar bem encapsulada, mas se ela expõe uma lista interna, qualquer código externo pode quebrar suas regras.

---

## A ideia central

Quando uma classe tem uma lista interna, essa lista faz parte do estado do objeto.

Exemplo:

```java
private final List<ItemPedido> itens;
```

Essa lista não deve ser manipulada livremente por qualquer código externo.

Ruim:

```java
pedido.getItens().add(item);
pedido.getItens().clear();
pedido.getItens().remove(0);
```

Melhor:

```java
pedido.adicionarItem(produto, quantidade);
pedido.removerItem(codigoProduto);
```

A diferença é que o objeto protege a própria regra.

Coleção interna precisa ser tratada como parte do encapsulamento.

---

## O problema de expor lista interna

Imagine:

```java
public List<ItemPedido> itens() {
    return itens;
}
```

Parece simples.

Mas quem recebe essa lista pode fazer:

```java
pedido.itens().clear();
```

ou:

```java
pedido.itens().add(itemInvalido);
```

ou:

```java
pedido.itens().remove(0);
```

Isso altera o estado interno do pedido sem passar pelas regras do pedido.

A entidade perde controle sobre sua própria invariante.

---

## Invariante com coleção

Uma coleção também pode ter invariantes.

Exemplos:

```text
Pedido precisa ter pelo menos um item para ser pago.
Item não pode ter quantidade menor ou igual a zero.
Pedido cancelado não pode receber item.
Pedido pago não pode remover item.
Contrato precisa ter pelo menos um serviço para ativar.
OS deve registrar ocorrência quando for reagendada.
Histórico não pode ser apagado por fora.
```

Se a lista é exposta diretamente, essas invariantes podem ser quebradas.

Por isso, a lista interna deve ser protegida.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-137-colecoes-dentro-de-objetos
cd labs\m4\aula-137-colecoes-dentro-de-objetos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula137
mkdir src\br\com\curso\aula137\app
mkdir src\br\com\curso\aula137\exemplo
mkdir src\br\com\curso\aula137\exemplo\ruim
mkdir src\br\com\curso\aula137\dominio
mkdir src\br\com\curso\aula137\dominio\valor
mkdir src\br\com\curso\aula137\dominio\cliente
mkdir src\br\com\curso\aula137\dominio\pedido
mkdir src\br\com\curso\aula137\dominio\contrato
mkdir src\br\com\curso\aula137\dominio\ordemservico
```

Nesta aula, vamos trabalhar com:

```text
Pedido e itens;
Contrato e serviços;
OrdemServico e ocorrências.
```

---

## Exemplo 1 — Lista interna exposta diretamente

Crie:

```text
src\br\com\curso\aula137\exemplo\ruim\PedidoListaExpostaApp.java
```

Código:

```java
package br.com.curso.aula137.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class PedidoListaExpostaApp {
    public static void main(String[] args) {
        PedidoListaExposta pedido = new PedidoListaExposta(1001);

        pedido.getItens().add(new ItemPedidoExposto(
                "Cadeira",
                new BigDecimal("199.90"),
                2
        ));

        pedido.getItens().add(new ItemPedidoExposto(
                "Mesa",
                new BigDecimal("399.90"),
                1
        ));

        System.out.println("Antes de quebrar:");
        System.out.println(pedido.resumo());

        pedido.getItens().clear();

        System.out.println();
        System.out.println("Depois de quebrar:");
        System.out.println(pedido.resumo());
    }
}

class PedidoListaExposta {
    private final int numero;
    private final List<ItemPedidoExposto> itens;

    PedidoListaExposta(int numero) {
        this.numero = numero;
        this.itens = new ArrayList<>();
    }

    List<ItemPedidoExposto> getItens() {
        return itens;
    }

    BigDecimal total() {
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoExposto item : itens) {
            total = total.add(item.subtotal());
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }

    String resumo() {
        return "Pedido " + numero
                + " | Quantidade de itens: " + itens.size()
                + " | Total: R$ " + total();
    }
}

class ItemPedidoExposto {
    private final String descricao;
    private final BigDecimal valorUnitario;
    private final int quantidade;

    ItemPedidoExposto(String descricao, BigDecimal valorUnitario, int quantidade) {
        this.descricao = descricao;
        this.valorUnitario = valorUnitario.setScale(2, RoundingMode.HALF_UP);
        this.quantidade = quantidade;
    }

    BigDecimal subtotal() {
        return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    String resumo() {
        return descricao
                + " | Quantidade: " + quantidade
                + " | Unitário: R$ " + valorUnitario
                + " | Subtotal: R$ " + subtotal();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula137.exemplo.ruim.PedidoListaExpostaApp
```

---

## O que há de errado

O pedido expôs sua lista interna:

```java
List<ItemPedidoExposto> getItens() {
    return itens;
}
```

Por isso, o app conseguiu fazer:

```java
pedido.getItens().clear();
```

Isso apagou os itens sem passar por nenhuma regra do pedido.

O problema não é apenas o método se chamar `getItens`.

O problema é devolver a própria lista interna.

Essa lista é parte do estado do objeto.

Ela não deve ser entregue para qualquer código modificar.

---

## Criando Dinheiro

Vamos criar uma versão melhor.

Crie:

```text
src\br\com\curso\aula137\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula137.dominio.valor;

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

    public Dinheiro subtrair(Dinheiro outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        BigDecimal resultado = valor.subtract(outro.valor);

        if (resultado.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Resultado monetário não pode ser negativo.");
        }

        return new Dinheiro(resultado);
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

Esse objeto será usado para cálculos monetários.

---

## Cliente

Crie:

```text
src\br\com\curso\aula137\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula137.dominio.cliente;

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

---

## StatusPedido

Crie:

```text
src\br\com\curso\aula137\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula137.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## ItemPedido

Crie:

```text
src\br\com\curso\aula137\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula137.dominio.pedido;

import br.com.curso.aula137.dominio.valor.Dinheiro;

public class ItemPedido {
    private final String codigoProduto;
    private final String descricao;
    private final Dinheiro valorUnitario;
    private final int quantidade;

    public ItemPedido(String codigoProduto, String descricao, Dinheiro valorUnitario, int quantidade) {
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

`ItemPedido` protege:

```text
produto obrigatório;
descrição obrigatória;
valor positivo;
quantidade positiva;
subtotal.
```

---

## Pedido protegendo a lista

Crie:

```text
src\br\com\curso\aula137\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula137.dominio.pedido;

import br.com.curso.aula137.dominio.cliente.Cliente;
import br.com.curso.aula137.dominio.valor.Dinheiro;

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

    public void adicionarItem(String codigoProduto, String descricao, Dinheiro valorUnitario, int quantidade) {
        if (!criado()) {
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
        if (!criado()) {
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

## O que foi protegido

A lista interna é:

```java
private final List<ItemPedido> itens;
```

Ela só muda por métodos do próprio pedido:

```java
adicionarItem(...)
removerItem(...)
```

E quando o pedido expõe itens, ele retorna:

```java
return List.copyOf(itens);
```

Isso devolve uma lista não modificável.

Se alguém tentar:

```java
pedido.itens().clear();
```

vai receber erro em tempo de execução.

Mais importante: não altera a lista interna.

---

## App usando Pedido protegido

Crie:

```text
src\br\com\curso\aula137\app\PedidoColecaoProtegidaApp.java
```

Código:

```java
package br.com.curso.aula137.app;

import br.com.curso.aula137.dominio.cliente.Cliente;
import br.com.curso.aula137.dominio.pedido.Pedido;
import br.com.curso.aula137.dominio.valor.Dinheiro;

public class PedidoColecaoProtegidaApp {
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

        System.out.println(pedido.resumo());

        System.out.println();
        System.out.println("Quantidade de itens pela consulta segura: " + pedido.itens().size());

        pedido.confirmarPagamento(Dinheiro.de("799.70"));

        System.out.println();
        System.out.println("Depois do pagamento:");
        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula137.app.PedidoColecaoProtegidaApp
```

---

## Tentando modificar a lista de fora

Crie:

```text
src\br\com\curso\aula137\app\PedidoTentativaAlteracaoExternaApp.java
```

Código:

```java
package br.com.curso.aula137.app;

import br.com.curso.aula137.dominio.cliente.Cliente;
import br.com.curso.aula137.dominio.pedido.Pedido;
import br.com.curso.aula137.dominio.valor.Dinheiro;

public class PedidoTentativaAlteracaoExternaApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                1001,
                new Cliente(10, "Ana Silva")
        );

        pedido.adicionarItem("PROD-001", "Cadeira", Dinheiro.de("199.90"), 2);

        System.out.println("Antes da tentativa:");
        System.out.println(pedido.resumo());

        try {
            pedido.itens().clear();
        } catch (UnsupportedOperationException erro) {
            System.out.println();
            System.out.println("A lista retornada não pode ser alterada por fora.");
        }

        System.out.println();
        System.out.println("Depois da tentativa:");
        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula137.app.PedidoTentativaAlteracaoExternaApp
```

---

## O que esse teste mostra

Mesmo chamando:

```java
pedido.itens().clear();
```

a lista interna do pedido não foi apagada.

Isso acontece porque `itens()` devolve uma cópia não modificável.

O estado real do pedido continua protegido.

Essa é uma prática importante quando uma entidade possui coleções.

---

## List.copyOf

O método:

```java
List.copyOf(itens)
```

cria uma nova lista não modificável com os elementos atuais.

Isso ajuda a proteger a coleção interna.

Outra forma comum seria:

```java
Collections.unmodifiableList(itens)
```

Diferença prática inicial:

```text
List.copyOf cria uma cópia não modificável;
Collections.unmodifiableList cria uma visão não modificável da lista original.
```

Para esta fase, `List.copyOf` é uma opção simples e segura.

---

## Cuidado: cópia da lista não congela os objetos internos

Importante:

```text
proteger a lista não significa tornar os objetos dentro dela imutáveis.
```

Se `ItemPedido` fosse mutável e tivesse setters, alguém poderia pegar um item e alterar o item.

Exemplo conceitual perigoso:

```java
pedido.itens().get(0).setQuantidade(-10);
```

No nosso exemplo, `ItemPedido` tem campos `final` e não tem setters.

Isso ajuda.

Regra prática:

```text
proteja a lista;
proteja também os objetos que ficam dentro da lista.
```

---

## Remover item com regra

No pedido, a remoção passa pelo método:

```java
removerItem(String codigoProduto)
```

Ele valida:

```text
pedido precisa estar criado;
produto precisa existir.
```

Não deixamos o app fazer:

```java
pedido.itens().remove(0);
```

Porque remover item pode afetar total, pagamento e regras futuras.

Alteração de coleção deve passar por método de domínio.

---

## Exemplo 2 — Contrato com lista de serviços

Agora vamos criar um contrato que possui vários serviços contratados.

Regras:

```text
contrato nasce em rascunho;
contrato pode receber serviços enquanto estiver em rascunho;
não pode ativar contrato sem serviço;
não pode remover serviço de contrato ativo;
serviço precisa ter nome e valor mensal;
valor total mensal é a soma dos serviços.
```

---

## StatusContrato

Crie:

```text
src\br\com\curso\aula137\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula137.dominio.contrato;

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
src\br\com\curso\aula137\dominio\contrato\ServicoContrato.java
```

Código:

```java
package br.com.curso.aula137.dominio.contrato;

import br.com.curso.aula137.dominio.valor.Dinheiro;

public class ServicoContrato {
    private final String codigo;
    private final String nome;
    private final Dinheiro valorMensal;

    public ServicoContrato(String codigo, String nome, Dinheiro valorMensal) {
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

---

## Contrato com coleção protegida

Crie:

```text
src\br\com\curso\aula137\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula137.dominio.contrato;

import br.com.curso.aula137.dominio.cliente.Cliente;
import br.com.curso.aula137.dominio.valor.Dinheiro;

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

    public boolean rascunho() {
        return status == StatusContrato.RASCUNHO;
    }

    public boolean ativo() {
        return status == StatusContrato.ATIVO;
    }

    public boolean cancelado() {
        return status == StatusContrato.CANCELADO;
    }

    public void adicionarServico(String codigo, String nome, Dinheiro valorMensal) {
        if (!rascunho()) {
            throw new IllegalStateException("Somente contrato em rascunho pode receber serviço.");
        }

        if (existeServico(codigo)) {
            throw new IllegalArgumentException("Serviço já existe no contrato: " + codigo);
        }

        servicos.add(new ServicoContrato(codigo, nome, valorMensal));
    }

    public void removerServico(String codigo) {
        if (!rascunho()) {
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
        if (!rascunho()) {
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

        if (cancelado()) {
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

## App de contrato com serviços

Crie:

```text
src\br\com\curso\aula137\app\ContratoColecaoApp.java
```

Código:

```java
package br.com.curso.aula137.app;

import br.com.curso.aula137.dominio.cliente.Cliente;
import br.com.curso.aula137.dominio.contrato.Contrato;
import br.com.curso.aula137.dominio.valor.Dinheiro;

public class ContratoColecaoApp {
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

        System.out.println("Antes da ativação:");
        System.out.println(contrato.resumo());

        contrato.ativar();

        System.out.println();
        System.out.println("Depois da ativação:");
        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula137.app.ContratoColecaoApp
```

---

## O que o contrato ensina

O contrato protege a coleção de serviços.

Ele impede:

```text
adicionar serviço com contrato ativo;
remover serviço com contrato ativo;
ativar contrato sem serviço;
serviço duplicado;
alterar lista por fora.
```

A coleção não é só detalhe técnico.

Ela faz parte das regras do contrato.

---

## Exemplo 3 — OrdemServico com ocorrências

Agora vamos criar uma OS com histórico de ocorrências.

Regras:

```text
OS nasce AGENDADA;
ao criar, registra ocorrência de criação;
ao reagendar, registra ocorrência;
ao concluir, registra ocorrência;
ao cancelar, registra ocorrência;
histórico não pode ser apagado por fora.
```

---

## Código da OS

Crie:

```text
src\br\com\curso\aula137\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula137.dominio.ordemservico;

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
src\br\com\curso\aula137\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula137.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula137\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula137.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula137\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula137.dominio.ordemservico;

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
src\br\com\curso\aula137\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula137.dominio.ordemservico;

import java.time.LocalDateTime;

public class OcorrenciaOs {
    private final LocalDateTime dataHora;
    private final String descricao;

    public OcorrenciaOs(String descricao) {
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

A ocorrência é simples, mas protegida.

Ela não tem setter.

---

## OrdemServico com histórico protegido

Crie:

```text
src\br\com\curso\aula137\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula137.dominio.ordemservico;

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

## App de OS com ocorrências

Crie:

```text
src\br\com\curso\aula137\app\OrdemServicoOcorrenciasApp.java
```

Código:

```java
package br.com.curso.aula137.app;

import br.com.curso.aula137.dominio.ordemservico.CodigoOs;
import br.com.curso.aula137.dominio.ordemservico.OrdemServico;
import br.com.curso.aula137.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula137.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoOcorrenciasApp {
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
        System.out.println("Total de ocorrências: " + os.ocorrencias().size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula137.app.OrdemServicoOcorrenciasApp
```

---

## O que a OS ensina

A lista de ocorrências é controlada internamente.

O app não faz:

```java
os.ocorrencias().add(...)
```

Nem:

```java
os.ocorrencias().clear()
```

A OS registra ocorrências quando algo relevante acontece:

```text
criação;
reagendamento;
conclusão;
cancelamento.
```

Isso mantém o histórico coerente com o ciclo de vida da OS.

---

## Métodos de domínio para coleções

Quando uma entidade tem coleção, crie métodos com intenção.

Exemplos:

```java
pedido.adicionarItem(...)
pedido.removerItem(...)

contrato.adicionarServico(...)
contrato.removerServico(...)

os.reagendar(...)
os.concluir(...)
os.cancelar(...)
```

Observe que na OS não criamos:

```java
adicionarOcorrencia(...)
```

como método público.

Por quê?

Porque ocorrência é consequência de uma ação de domínio.

Se o app pudesse adicionar ocorrência livremente, poderia registrar histórico falso.

A coleção deve ser alterada pelos métodos certos.

---

## Quando expor a coleção

Às vezes, você precisa mostrar os itens.

Exemplo:

```text
exibir resumo;
montar relatório;
enviar resposta;
calcular quantidade;
debug.
```

Tudo bem ter um método de consulta:

```java
public List<ItemPedido> itens() {
    return List.copyOf(itens);
}
```

O problema é expor a lista mutável original.

Consulta é permitida.

Alteração indevida não.

---

## Métodos úteis sem expor lista

Muitas vezes você nem precisa expor a lista.

Pode criar métodos como:

```java
quantidadeItens()
total()
existeItemDoProduto(codigo)
valorMensalTotal()
quantidadeOcorrencias()
```

Esses métodos respondem perguntas importantes sem entregar a coleção.

Exemplo:

```java
pedido.quantidadeItens()
pedido.total()
contrato.valorMensalTotal()
```

Quanto menos você expõe, menor o risco de uso indevido.

---

## Coleção final não significa conteúdo imutável

Este campo:

```java
private final List<ItemPedido> itens;
```

significa que a variável `itens` não poderá apontar para outra lista depois de inicializada.

Mas o conteúdo da lista ainda pode mudar:

```java
itens.add(...)
itens.remove(...)
```

Portanto:

```text
final protege a referência;
não congela o conteúdo da coleção.
```

Esse ponto é muito importante.

Para controlar conteúdo, você precisa controlar os métodos que alteram a lista.

---

## Cópia defensiva no construtor

Quando uma entidade recebe uma lista no construtor, não guarde a lista externa diretamente.

Ruim:

```java
this.itens = itensRecebidos;
```

Quem chamou ainda tem a referência da lista e pode alterá-la depois.

Melhor:

```java
this.itens = new ArrayList<>(itensRecebidos);
```

No nosso `PedidoBuilder` da aula anterior, o `Pedido` fez isso:

```java
this.itens = new ArrayList<>(itensIniciais);
```

Isso é cópia defensiva.

A ideia é:

```text
não confiar em lista mutável recebida de fora.
```

---

## Cuidado com null na lista

Nunca deixe uma lista interna ser `null`.

Prefira iniciar no construtor:

```java
this.itens = new ArrayList<>();
```

ou, se receber uma lista:

```java
if (itensRecebidos == null) {
    throw new IllegalArgumentException("Itens são obrigatórios.");
}

this.itens = new ArrayList<>(itensRecebidos);
```

Lista nula gera erros e condicionais desnecessários.

Lista vazia é mais segura do que lista nula quando a ausência de itens é permitida.

---

## Cuidado com item nulo

Também valide item nulo.

Exemplo:

```java
public void adicionarItem(ItemPedido item) {
    if (item == null) {
        throw new IllegalArgumentException("Item é obrigatório.");
    }

    itens.add(item);
}
```

No nosso exemplo, o pedido cria o item internamente.

Assim, a validação fica no construtor de `ItemPedido`.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Lista exposta

Execute:

```text
PedidoListaExpostaApp.java
```

Explique:

```text
como o app apagou a lista;
por que isso quebra encapsulamento;
qual invariante poderia ser quebrada.
```

### Parte 2 — Pedido protegido

Execute:

```text
PedidoColecaoProtegidaApp.java
PedidoTentativaAlteracaoExternaApp.java
```

Explique:

```text
como adicionarItem protege a coleção;
por que itens() retorna List.copyOf;
por que pedido pago não aceita alteração de itens.
```

### Parte 3 — Contrato

Execute:

```text
ContratoColecaoApp.java
```

Explique:

```text
por que contrato ativo não deve remover serviço;
por que ativar exige pelo menos um serviço;
como valorMensalTotal usa a coleção.
```

### Parte 4 — OrdemServico

Execute:

```text
OrdemServicoOcorrenciasApp.java
```

Explique:

```text
como ocorrências são registradas;
por que não existe adicionarOcorrencia público;
por que o histórico não deve ser apagado por fora.
```

### Parte 5 — Revisão

Responda:

```text
quando retornar uma lista?
quando retornar quantidade ou total?
quando criar método adicionar/remover?
quando não expor a coleção?
```

---

## Desafio prático

Crie um domínio de `Checklist` com coleção de perguntas.

Estrutura sugerida:

```text
src\br\com\curso\aula137\appchecklist
src\br\com\curso\aula137\dominio\checklist
```

Arquivos sugeridos:

```text
appchecklist\ChecklistColecaoApp.java

dominio\checklist\Checklist.java
dominio\checklist\PerguntaChecklist.java
dominio\checklist\StatusChecklist.java
```

Regras:

```text
Checklist tem código, título, status e lista de perguntas.
StatusChecklist tem EM_EDICAO, FINALIZADO, CANCELADO.
Checklist nasce EM_EDICAO.
Pergunta tem código, texto, obrigatória e resposta.
Pergunta obrigatória não pode ser finalizada sem resposta.
Checklist pode adicionar pergunta enquanto EM_EDICAO.
Checklist pode responder pergunta enquanto EM_EDICAO.
Checklist pode remover pergunta enquanto EM_EDICAO.
Checklist não pode finalizar sem perguntas.
Checklist não pode finalizar se houver pergunta obrigatória sem resposta.
Checklist finalizado não pode receber alteração.
Checklist deve expor perguntas com List.copyOf.
```

Métodos esperados:

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

Evite:

```text
getPerguntas retornando lista interna;
setStatus;
setPerguntas;
pergunta com setters livres;
status como String.
```

Critério principal:

```text
a coleção de perguntas deve ser protegida pelo Checklist.
```

---

## Erros comuns

### 1. Retornar lista interna diretamente

Isso permite alteração externa indevida.

### 2. Achar que final torna a lista imutável

`final` protege a referência, não o conteúdo.

### 3. Usar getter para lista e alterar fora

Prefira métodos de domínio.

### 4. Esquecer regra ao remover item

Remover item pode afetar total, status e invariantes.

### 5. Expor histórico para alteração

Históricos e ocorrências geralmente devem ser gerados por ações de domínio.

### 6. Guardar lista recebida de fora sem copiar

Use cópia defensiva.

### 7. Permitir item nulo

Valide entradas.

### 8. Retornar coleção quando bastava total ou quantidade

Exponha o mínimo necessário.

---

## Debug recomendado

Use debug em:

```text
PedidoListaExpostaApp.java
PedidoColecaoProtegidaApp.java
PedidoTentativaAlteracaoExternaApp.java
ContratoColecaoApp.java
OrdemServicoOcorrenciasApp.java
```

Breakpoints recomendados:

```java
pedido.getItens().clear()

pedido.adicionarItem(...)
pedido.removerItem(...)
pedido.itens()
pedido.confirmarPagamento(...)

contrato.adicionarServico(...)
contrato.removerServico(...)
contrato.ativar()
contrato.servicos()

os.reagendar(...)
os.concluir()
registrarOcorrencia(...)
os.ocorrencias()
```

Observe:

```text
quando a lista interna é alterada;
quando uma cópia é retornada;
quando uma regra impede alteração;
quando uma ocorrência é criada automaticamente;
quando o objeto mantém sua coleção consistente.
```

O objetivo é enxergar a coleção como parte do estado protegido do objeto.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que retornar a lista interna diretamente é perigoso?
2. Qual diferença entre final na lista e lista imutável?
3. Qual método de domínio você criaria para proteger uma coleção?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar coleções dentro de entidades;
inicializar listas corretamente;
evitar lista interna exposta;
usar List.copyOf;
criar métodos de domínio para adicionar e remover;
validar itens antes de adicionar;
impedir alterações conforme status;
calcular total com base em itens;
controlar histórico de ocorrências;
entender final em coleções;
usar cópia defensiva;
evitar item nulo;
resolver o desafio de Checklist;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-137-colecoes-dentro-de-objetos
git commit -m "Aula 137: pratica colecoes dentro de objetos"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
coleções internas fazem parte do estado do objeto e precisam ser protegidas como qualquer outro atributo importante.
```

Você viu que retornar a lista interna diretamente quebra encapsulamento.

Também viu que métodos de domínio, cópia defensiva e `List.copyOf` ajudam a manter o objeto consistente.

Na próxima aula, vamos estudar composição com coleções.

Vamos entender quando uma entidade realmente é dona dos objetos dentro da lista e como isso muda a forma de adicionar, remover e proteger esses elementos.
