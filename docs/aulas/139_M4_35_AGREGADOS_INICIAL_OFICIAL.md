# 139 — M4.35 — Agregados inicial

## Objetivo da aula

Nesta aula você vai aprender a ideia inicial de agregados.

Na aula anterior, você estudou composição com coleções e viu que uma entidade pode ser dona dos objetos filhos dentro de uma lista. Agora vamos dar o próximo passo:

```text
quando um conjunto de objetos precisa ser tratado como uma unidade de consistência?
```

Ao final da aula, você deve conseguir:

```text
explicar o que é um agregado em uma visão inicial;
entender o papel da raiz do agregado;
diferenciar entidade raiz de entidade filha;
proteger alterações passando pela raiz;
evitar alterar filhos diretamente;
modelar regras que envolvem vários objetos internos;
usar listas protegidas dentro do agregado;
registrar eventos ou ocorrências internas;
entender por que agregado é base para persistência futura;
modelar Pedido, OrdemServico e Contrato como agregados iniciais.
```

Essa aula é uma ponte entre Orientação a Objetos e arquitetura de domínio.

Ainda não vamos entrar profundamente em DDD.

Mas você já precisa começar a pensar assim:

```text
qual objeto é a porta de entrada para alterar este conjunto?
```

Esse objeto é a raiz do agregado.

---

## A ideia central

Agregado é um conjunto de objetos de domínio que precisa ser mantido consistente como uma unidade.

Exemplo:

```text
Pedido
- ItemPedido
- EventoPedido
```

O `Pedido` é a raiz.

Os itens e eventos pertencem ao pedido.

O código externo não deve alterar `ItemPedido` ou `EventoPedido` diretamente.

Ele deve falar com o `Pedido`.

Exemplo:

```java
pedido.adicionarItem(...);
pedido.removerItem(...);
pedido.confirmarPagamento(...);
pedido.cancelar(...);
```

O `Pedido` decide:

```text
se pode adicionar item;
se pode remover item;
se pode pagar;
se precisa registrar evento;
se o total está correto;
se o estado continua válido.
```

O agregado protege consistência.

---

## Raiz do agregado

A raiz do agregado é o objeto principal.

Ela controla o acesso aos objetos internos.

Exemplo:

```text
Pedido é raiz.
ItemPedido é filho.
EventoPedido é filho.
```

Em vez de:

```java
item.alterarQuantidade(10);
evento.setDescricao("...");
pedido.itens().add(item);
```

usamos:

```java
pedido.adicionarItem(...);
pedido.alterarQuantidadeItem(...);
pedido.confirmarPagamento(...);
```

A regra é:

```text
fora do agregado, fale com a raiz.
```

---

## Por que isso importa

Sem raiz clara, o sistema começa a alterar objetos internos por qualquer lugar.

Problemas comuns:

```text
item de pedido alterado depois do pagamento;
ocorrência de OS apagada por fora;
contrato ativo recebendo serviço indevidamente;
atividade de OS concluída sem atualizar o status da OS;
total do pedido incoerente com itens;
histórico não acompanha mudanças;
regras espalhadas em services.
```

Quando existe uma raiz, ela protege as regras que envolvem o conjunto.

---

## Agregado não é só composição

Composição diz:

```text
um objeto é dono de outro.
```

Agregado adiciona a ideia de:

```text
consistência do conjunto.
```

Exemplo:

```text
Pedido compõe ItemPedido.
```

Mas como agregado, o `Pedido` também garante:

```text
não pagar pedido sem item;
não alterar item depois de pago;
não duplicar produto;
registrar evento quando pagamento é confirmado;
calcular total a partir dos itens;
manter status coerente com os itens.
```

Ou seja:

```text
composição fala de posse;
agregado fala de posse + regra + consistência.
```

---

## Agregado e banco de dados

Mais adiante, quando estudarmos persistência, essa ideia vai ficar muito importante.

Em geral, um agregado costuma ser salvo e carregado como unidade.

Exemplo futuro:

```text
PedidoRepository salva Pedido com seus itens.
OrdemServicoRepository salva OS com atividades e ocorrências.
ContratoRepository salva Contrato com serviços.
```

Nesta aula, não vamos usar banco.

Mas já vamos modelar pensando:

```text
qual é o objeto principal que representa a unidade de alteração?
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-139-agregados-inicial
cd labs\m4\aula-139-agregados-inicial
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula139
mkdir src\br\com\curso\aula139\app
mkdir src\br\com\curso\aula139\exemplo
mkdir src\br\com\curso\aula139\exemplo\ruim
mkdir src\br\com\curso\aula139\dominio
mkdir src\br\com\curso\aula139\dominio\valor
mkdir src\br\com\curso\aula139\dominio\cliente
mkdir src\br\com\curso\aula139\dominio\pedido
mkdir src\br\com\curso\aula139\dominio\ordemservico
mkdir src\br\com\curso\aula139\dominio\contrato
```

Nesta aula, vamos trabalhar com:

```text
um exemplo ruim sem raiz protegendo regra;
Pedido como agregado;
OrdemServico como agregado;
Contrato como agregado.
```

---

## Exemplo 1 — Alterando filho sem passar pela raiz

Crie:

```text
src\br\com\curso\aula139\exemplo\ruim\AgregadoSemRaizApp.java
```

Código:

```java
package br.com.curso.aula139.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class AgregadoSemRaizApp {
    public static void main(String[] args) {
        PedidoSemRaiz pedido = new PedidoSemRaiz(1001);

        ItemSemRaiz cadeira = new ItemSemRaiz(
                "PROD-001",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        pedido.getItens().add(cadeira);

        pedido.setStatus("PAGO");

        cadeira.alterarQuantidade(10);

        System.out.println(pedido.resumo());
    }
}

class PedidoSemRaiz {
    private final int numero;
    private final List<ItemSemRaiz> itens;
    private String status;

    PedidoSemRaiz(int numero) {
        this.numero = numero;
        this.itens = new ArrayList<>();
        this.status = "CRIADO";
    }

    List<ItemSemRaiz> getItens() {
        return itens;
    }

    void setStatus(String status) {
        this.status = status;
    }

    BigDecimal total() {
        BigDecimal total = BigDecimal.ZERO;

        for (ItemSemRaiz item : itens) {
            total = total.add(item.subtotal());
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }

    String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("Pedido ").append(numero)
                .append(" | Status: ").append(status)
                .append(" | Total: R$ ").append(total())
                .append("\nItens:");

        for (ItemSemRaiz item : itens) {
            texto.append("\n- ").append(item.resumo());
        }

        return texto.toString();
    }
}

class ItemSemRaiz {
    private final String codigoProduto;
    private final String descricao;
    private final BigDecimal valorUnitario;
    private int quantidade;

    ItemSemRaiz(String codigoProduto, String descricao, BigDecimal valorUnitario, int quantidade) {
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
java -cp out br.com.curso.aula139.exemplo.ruim.AgregadoSemRaizApp
```

---

## O problema do exemplo

O pedido foi pago:

```java
pedido.setStatus("PAGO");
```

Depois o item foi alterado diretamente:

```java
cadeira.alterarQuantidade(10);
```

Isso mudou o total de um pedido já pago.

O problema não é apenas técnico.

É uma violação de regra de domínio.

O pedido deveria impedir alteração de item depois do pagamento.

Mas como o filho está exposto e mutável, a raiz não protege nada.

---

## Regras quebradas

Nesse exemplo, várias regras podem ser quebradas:

```text
status como String aceita qualquer valor;
pedido pago continua aceitando alteração indireta;
item pode ter quantidade alterada sem validação do pedido;
lista interna é exposta;
pedido não registra evento;
pedido não controla seu total;
não existe raiz protegendo o conjunto.
```

Esse é o tipo de problema que agregados ajudam a evitar.

---

## Criando Dinheiro

Vamos criar uma versão melhor.

Crie:

```text
src\br\com\curso\aula139\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula139.dominio.valor;

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

## Cliente como objeto associado

Crie:

```text
src\br\com\curso\aula139\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula139.dominio.cliente;

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

Aqui `Cliente` é associado ao pedido.

O pedido não é dono do cliente.

---

## Pedido como agregado

Agora vamos criar o agregado `Pedido`.

Ele será a raiz.

Ele controla:

```text
itens;
eventos;
status;
pagamento;
cancelamento;
total.
```

---

## StatusPedido

Crie:

```text
src\br\com\curso\aula139\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula139.dominio.pedido;

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
src\br\com\curso\aula139\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula139.dominio.pedido;

import br.com.curso.aula139.dominio.valor.Dinheiro;

public class ItemPedido {
    private final String codigoProduto;
    private final String descricao;
    private final Dinheiro valorUnitario;
    private int quantidade;

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

    boolean mesmoProduto(String codigoProduto) {
        if (codigoProduto == null || codigoProduto.isBlank()) {
            return false;
        }

        return this.codigoProduto.equals(codigoProduto);
    }

    void alterarQuantidade(int novaQuantidade) {
        if (novaQuantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.quantidade = novaQuantidade;
    }

    Dinheiro subtotal() {
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

Observe:

```text
o construtor não é public;
alterarQuantidade também não é public;
subtotal também não é public.
```

A raiz `Pedido`, no mesmo pacote, consegue usar.

O app não deve alterar item diretamente.

---

## EventoPedido

Crie:

```text
src\br\com\curso\aula139\dominio\pedido\EventoPedido.java
```

Código:

```java
package br.com.curso.aula139.dominio.pedido;

import java.time.LocalDateTime;

public class EventoPedido {
    private final LocalDateTime dataHora;
    private final String descricao;

    EventoPedido(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição do evento é obrigatória.");
        }

        this.dataHora = LocalDateTime.now();
        this.descricao = descricao;
    }

    public String resumo() {
        return dataHora + " | " + descricao;
    }
}
```

`EventoPedido` também é controlado pela raiz.

---

## Pedido raiz do agregado

Crie:

```text
src\br\com\curso\aula139\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula139.dominio.pedido;

import br.com.curso.aula139.dominio.cliente.Cliente;
import br.com.curso.aula139.dominio.valor.Dinheiro;

import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private final int numero;
    private final Cliente cliente;
    private final List<ItemPedido> itens;
    private final List<EventoPedido> eventos;
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
        this.eventos = new ArrayList<>();
        this.status = StatusPedido.CRIADO;
        this.motivoCancelamento = "";

        registrarEvento("Pedido criado para " + cliente.resumo());
    }

    public void adicionarItem(String codigoProduto, String descricao, Dinheiro valorUnitario, int quantidade) {
        exigirPedidoCriado("Somente pedido criado pode receber item.");

        if (existeItemDoProduto(codigoProduto)) {
            throw new IllegalArgumentException("Produto já existe no pedido: " + codigoProduto);
        }

        itens.add(new ItemPedido(codigoProduto, descricao, valorUnitario, quantidade));
        registrarEvento("Item adicionado: " + codigoProduto + " - quantidade " + quantidade);
    }

    public void alterarQuantidadeItem(String codigoProduto, int novaQuantidade) {
        exigirPedidoCriado("Somente pedido criado pode alterar item.");

        ItemPedido item = buscarItemObrigatorio(codigoProduto);
        item.alterarQuantidade(novaQuantidade);

        registrarEvento("Quantidade alterada do produto " + codigoProduto + " para " + novaQuantidade);
    }

    public void removerItem(String codigoProduto) {
        exigirPedidoCriado("Somente pedido criado pode remover item.");

        boolean removido = itens.removeIf(item -> item.mesmoProduto(codigoProduto));

        if (!removido) {
            throw new IllegalArgumentException("Produto não encontrado no pedido: " + codigoProduto);
        }

        registrarEvento("Item removido: " + codigoProduto);
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

    public List<EventoPedido> eventos() {
        return List.copyOf(eventos);
    }

    public void confirmarPagamento(Dinheiro valorPago) {
        exigirPedidoCriado("Somente pedido criado pode receber pagamento.");

        if (itens.isEmpty()) {
            throw new IllegalStateException("Pedido sem itens não pode ser pago.");
        }

        if (valorPago == null || !valorPago.maiorOuIgual(total())) {
            throw new IllegalArgumentException("Valor pago não cobre o total do pedido.");
        }

        status = StatusPedido.PAGO;
        registrarEvento("Pagamento confirmado no valor de " + valorPago);
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
        registrarEvento("Pedido cancelado. Motivo: " + motivo);
    }

    private ItemPedido buscarItemObrigatorio(String codigoProduto) {
        for (ItemPedido item : itens) {
            if (item.mesmoProduto(codigoProduto)) {
                return item;
            }
        }

        throw new IllegalArgumentException("Produto não encontrado no pedido: " + codigoProduto);
    }

    private void exigirPedidoCriado(String mensagem) {
        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException(mensagem);
        }
    }

    private void registrarEvento(String descricao) {
        eventos.add(new EventoPedido(descricao));
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

        texto.append("\nEventos:");

        for (EventoPedido evento : eventos) {
            texto.append("\n- ").append(evento.resumo());
        }

        return texto.toString();
    }
}
```

---

## App usando Pedido agregado

Crie:

```text
src\br\com\curso\aula139\app\PedidoAgregadoApp.java
```

Código:

```java
package br.com.curso.aula139.app;

import br.com.curso.aula139.dominio.cliente.Cliente;
import br.com.curso.aula139.dominio.pedido.Pedido;
import br.com.curso.aula139.dominio.valor.Dinheiro;

public class PedidoAgregadoApp {
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

        pedido.alterarQuantidadeItem("PROD-001", 3);

        pedido.confirmarPagamento(Dinheiro.de("999.60"));

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula139.app.PedidoAgregadoApp
```

---

## O que o Pedido agregado protege

O `Pedido` é a raiz.

Ele protege:

```text
criação de itens;
alteração de quantidade;
remoção de item;
bloqueio de alterações depois do pagamento;
pagamento somente com item;
pagamento cobrindo total;
registro de eventos;
lista de itens protegida;
lista de eventos protegida.
```

O app não fala com `ItemPedido` diretamente.

O app não cria `EventoPedido`.

Toda alteração passa por `Pedido`.

Esse é o ponto principal de agregado.

---

## Testando tentativa de alteração depois do pagamento

Crie:

```text
src\br\com\curso\aula139\app\PedidoAgregadoBloqueioApp.java
```

Código:

```java
package br.com.curso.aula139.app;

import br.com.curso.aula139.dominio.cliente.Cliente;
import br.com.curso.aula139.dominio.pedido.Pedido;
import br.com.curso.aula139.dominio.valor.Dinheiro;

public class PedidoAgregadoBloqueioApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                1001,
                new Cliente(10, "Ana Silva")
        );

        pedido.adicionarItem("PROD-001", "Cadeira", Dinheiro.de("199.90"), 2);
        pedido.confirmarPagamento(Dinheiro.de("399.80"));

        try {
            pedido.alterarQuantidadeItem("PROD-001", 10);
        } catch (IllegalStateException erro) {
            System.out.println("Alteração bloqueada: " + erro.getMessage());
        }

        System.out.println();
        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula139.app.PedidoAgregadoBloqueioApp
```

Esse teste mostra a raiz protegendo a consistência do agregado.

---

## Exemplo 2 — OrdemServico como agregado

Agora vamos modelar uma OS como agregado.

A OS será a raiz.

Ela controla:

```text
atividades;
ocorrências;
status;
reagendamento;
conclusão.
```

Uma regra interessante:

```text
OS só pode ser concluída se todas as atividades estiverem concluídas.
```

Essa regra envolve a coleção de atividades.

Logo, deve ser protegida pela raiz `OrdemServico`.

---

## Código da OS

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

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
src\br\com\curso\aula139\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\StatusAtividade.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

public enum StatusAtividade {
    PENDENTE,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

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

## AtividadeOs

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

public class AtividadeOs {
    private final String codigo;
    private final String descricao;
    private StatusAtividade status;

    AtividadeOs(String codigo, String descricao) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código da atividade é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição da atividade é obrigatória.");
        }

        this.codigo = codigo;
        this.descricao = descricao;
        this.status = StatusAtividade.PENDENTE;
    }

    boolean mesmoCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return false;
        }

        return this.codigo.equals(codigo);
    }

    boolean pendente() {
        return status == StatusAtividade.PENDENTE;
    }

    boolean concluida() {
        return status == StatusAtividade.CONCLUIDA;
    }

    void concluir() {
        if (status == StatusAtividade.CANCELADA) {
            throw new IllegalStateException("Atividade cancelada não pode ser concluída.");
        }

        if (status == StatusAtividade.CONCLUIDA) {
            throw new IllegalStateException("Atividade já está concluída.");
        }

        status = StatusAtividade.CONCLUIDA;
    }

    void cancelar() {
        if (status == StatusAtividade.CONCLUIDA) {
            throw new IllegalStateException("Atividade concluída não pode ser cancelada.");
        }

        if (status == StatusAtividade.CANCELADA) {
            throw new IllegalStateException("Atividade já está cancelada.");
        }

        status = StatusAtividade.CANCELADA;
    }

    public String resumo() {
        return codigo + " - " + descricao + " | Status: " + status;
    }
}
```

---

## OcorrenciaOs

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

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

---

## OrdemServico raiz do agregado

Crie:

```text
src\br\com\curso\aula139\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula139.dominio.ordemservico;

import java.util.ArrayList;
import java.util.List;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private PeriodoAtendimento periodo;
    private StatusOs status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;
    private final List<AtividadeOs> atividades;
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
        this.atividades = new ArrayList<>();
        this.ocorrencias = new ArrayList<>();

        registrarOcorrencia("OS criada com período " + periodo);
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public void adicionarAtividade(String codigo, String descricao) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode receber atividade.");
        }

        if (existeAtividade(codigo)) {
            throw new IllegalArgumentException("Atividade já existe na OS: " + codigo);
        }

        atividades.add(new AtividadeOs(codigo, descricao));
        registrarOcorrencia("Atividade adicionada: " + codigo);
    }

    public void concluirAtividade(String codigo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode alterar atividade.");
        }

        AtividadeOs atividade = buscarAtividadeObrigatoria(codigo);
        atividade.concluir();

        registrarOcorrencia("Atividade concluída: " + codigo);
    }

    public void cancelarAtividade(String codigo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode alterar atividade.");
        }

        AtividadeOs atividade = buscarAtividadeObrigatoria(codigo);
        atividade.cancelar();

        registrarOcorrencia("Atividade cancelada: " + codigo);
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

        if (atividades.isEmpty()) {
            throw new IllegalStateException("OS sem atividades não pode ser concluída.");
        }

        if (!todasAtividadesConcluidas()) {
            throw new IllegalStateException("Todas as atividades precisam estar concluídas.");
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

    public boolean existeAtividade(String codigo) {
        for (AtividadeOs atividade : atividades) {
            if (atividade.mesmoCodigo(codigo)) {
                return true;
            }
        }

        return false;
    }

    public boolean todasAtividadesConcluidas() {
        if (atividades.isEmpty()) {
            return false;
        }

        for (AtividadeOs atividade : atividades) {
            if (!atividade.concluida()) {
                return false;
            }
        }

        return true;
    }

    public List<AtividadeOs> atividades() {
        return List.copyOf(atividades);
    }

    public List<OcorrenciaOs> ocorrencias() {
        return List.copyOf(ocorrencias);
    }

    private AtividadeOs buscarAtividadeObrigatoria(String codigo) {
        for (AtividadeOs atividade : atividades) {
            if (atividade.mesmoCodigo(codigo)) {
                return atividade;
            }
        }

        throw new IllegalArgumentException("Atividade não encontrada: " + codigo);
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
                .append("\nAtividades:");

        for (AtividadeOs atividade : atividades) {
            texto.append("\n- ").append(atividade.resumo());
        }

        texto.append("\nOcorrências:");

        for (OcorrenciaOs ocorrencia : ocorrencias) {
            texto.append("\n- ").append(ocorrencia.resumo());
        }

        return texto.toString();
    }
}
```

---

## App usando OrdemServico agregado

Crie:

```text
src\br\com\curso\aula139\app\OrdemServicoAgregadoApp.java
```

Código:

```java
package br.com.curso.aula139.app;

import br.com.curso.aula139.dominio.ordemservico.CodigoOs;
import br.com.curso.aula139.dominio.ordemservico.OrdemServico;
import br.com.curso.aula139.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula139.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoAgregadoApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        os.adicionarAtividade("ATV-001", "Instalar produto");
        os.adicionarAtividade("ATV-002", "Validar funcionamento");

        os.reagendar(new PeriodoAtendimento(
                LocalDate.now().plusDays(3),
                TurnoAtendimento.TARDE
        ));

        os.concluirAtividade("ATV-001");
        os.concluirAtividade("ATV-002");

        os.concluir();

        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula139.app.OrdemServicoAgregadoApp
```

---

## O que a OS agregado protege

A raiz `OrdemServico` protege:

```text
criação de atividades;
conclusão de atividades;
cancelamento de atividades;
bloqueio de alteração se OS encerrada;
conclusão da OS apenas com todas as atividades concluídas;
registro de ocorrências;
histórico protegido;
status controlado.
```

O app não chama:

```java
atividade.concluir();
```

diretamente.

Ele chama:

```java
os.concluirAtividade("ATV-001");
```

A raiz coordena a mudança e registra ocorrência.

---

## Testando bloqueio de conclusão

Crie:

```text
src\br\com\curso\aula139\app\OrdemServicoAgregadoBloqueioApp.java
```

Código:

```java
package br.com.curso.aula139.app;

import br.com.curso.aula139.dominio.ordemservico.CodigoOs;
import br.com.curso.aula139.dominio.ordemservico.OrdemServico;
import br.com.curso.aula139.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula139.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoAgregadoBloqueioApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        os.adicionarAtividade("ATV-001", "Instalar produto");
        os.adicionarAtividade("ATV-002", "Validar funcionamento");

        os.concluirAtividade("ATV-001");

        try {
            os.concluir();
        } catch (IllegalStateException erro) {
            System.out.println("Conclusão bloqueada: " + erro.getMessage());
        }

        System.out.println();
        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula139.app.OrdemServicoAgregadoBloqueioApp
```

Esse teste mostra a raiz protegendo uma regra que envolve a coleção de atividades.

---

## Exemplo 3 — Contrato como agregado

Agora vamos modelar `Contrato` como agregado.

A raiz `Contrato` controla:

```text
serviços contratados;
status;
valor mensal total;
ativação;
cancelamento.
```

Regra:

```text
contrato só pode ser ativado se tiver pelo menos um serviço.
contrato ativo não pode receber ou remover serviço.
```

---

## StatusContrato

Crie:

```text
src\br\com\curso\aula139\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula139.dominio.contrato;

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
src\br\com\curso\aula139\dominio\contrato\ServicoContrato.java
```

Código:

```java
package br.com.curso.aula139.dominio.contrato;

import br.com.curso.aula139.dominio.valor.Dinheiro;

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

    boolean mesmoCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return false;
        }

        return this.codigo.equals(codigo);
    }

    Dinheiro valorMensal() {
        return valorMensal;
    }

    public String resumo() {
        return codigo + " - " + nome + " | Mensal: " + valorMensal;
    }
}
```

---

## Contrato raiz do agregado

Crie:

```text
src\br\com\curso\aula139\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula139.dominio.contrato;

import br.com.curso.aula139.dominio.cliente.Cliente;
import br.com.curso.aula139.dominio.valor.Dinheiro;

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
        exigirRascunho("Somente contrato em rascunho pode receber serviço.");

        if (existeServico(codigo)) {
            throw new IllegalArgumentException("Serviço já existe no contrato: " + codigo);
        }

        servicos.add(new ServicoContrato(codigo, nome, valorMensal));
    }

    public void removerServico(String codigo) {
        exigirRascunho("Somente contrato em rascunho pode remover serviço.");

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
        exigirRascunho("Somente contrato em rascunho pode ser ativado.");

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

    private void exigirRascunho(String mensagem) {
        if (status != StatusContrato.RASCUNHO) {
            throw new IllegalStateException(mensagem);
        }
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

## App usando Contrato agregado

Crie:

```text
src\br\com\curso\aula139\app\ContratoAgregadoApp.java
```

Código:

```java
package br.com.curso.aula139.app;

import br.com.curso.aula139.dominio.cliente.Cliente;
import br.com.curso.aula139.dominio.contrato.Contrato;
import br.com.curso.aula139.dominio.valor.Dinheiro;

public class ContratoAgregadoApp {
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
java -cp out br.com.curso.aula139.app.ContratoAgregadoApp
```

---

## O que o Contrato agregado protege

A raiz `Contrato` protege:

```text
serviços duplicados;
serviço obrigatório para ativação;
bloqueio de alteração após ativação;
valor mensal total calculado pelos serviços;
cliente ativo;
status controlado.
```

O app não cria `ServicoContrato`.

O app não altera lista diretamente.

O app não muda status diretamente.

Toda alteração passa pela raiz.

---

## Regras para pensar em agregado

Use estas perguntas:

```text
qual é a entidade principal?
quais objetos pertencem a ela?
quais objetos são apenas associados?
quais alterações precisam passar por ela?
quais regras envolvem vários filhos?
quais filhos não devem ser alterados diretamente?
quais coleções precisam ser protegidas?
qual objeto será salvo/carregado como unidade no futuro?
```

Exemplo:

```text
Pedido é raiz.
ItemPedido e EventoPedido são internos.
Cliente é associado.
```

Exemplo:

```text
OrdemServico é raiz.
AtividadeOs e OcorrenciaOs são internas.
Técnico seria associado.
```

Exemplo:

```text
Contrato é raiz.
ServicoContrato é interno.
Cliente é associado.
```

---

## Agregado e tamanho

Agregado não deve virar um mundo inteiro.

Erro comum:

```text
Cliente agregado contendo todos os pedidos, todos os contratos, todos os pagamentos, todas as OS.
```

Isso cria um agregado gigante.

Agregado deve proteger uma unidade de consistência.

Não precisa colocar tudo dentro dele.

Exemplo melhor:

```text
Pedido é um agregado.
Contrato é outro agregado.
OrdemServico é outro agregado.
Cliente pode ser outro agregado separado.
```

Essa separação será aprofundada em arquitetura.

Por enquanto, evite agregados gigantes.

---

## Agregado e acesso direto a filhos

Regra prática inicial:

```text
altere filhos pela raiz.
```

Consulta pode existir:

```java
pedido.itens()
os.atividades()
contrato.servicos()
```

Mas alteração deve ser feita por métodos da raiz:

```java
pedido.alterarQuantidadeItem(...)
os.concluirAtividade(...)
contrato.adicionarServico(...)
```

Isso protege consistência.

---

## Agregado e serviços de domínio

Serviço de domínio pode trabalhar com agregados.

Exemplo futuro:

```text
PoliticaDescontoPedido usa Pedido e Cliente.
PoliticaAlocacaoTecnico usa OS e Técnico.
ElegibilidadeReagendamentoOs usa OrdemServico.
```

Mas mesmo quando um serviço de domínio participa, a raiz ainda deve proteger suas invariantes.

Exemplo:

```java
if (elegibilidade.podeReagendar(os, novoPeriodo)) {
    os.reagendar(novoPeriodo);
}
```

A política ajuda a decidir.

A OS ainda valida e executa.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Exemplo ruim

Execute:

```text
AgregadoSemRaizApp.java
```

Explique:

```text
como o item foi alterado após pagamento;
por que isso quebra consistência;
qual objeto deveria ser a raiz.
```

### Parte 2 — Pedido agregado

Execute:

```text
PedidoAgregadoApp.java
PedidoAgregadoBloqueioApp.java
```

Explique:

```text
por que Pedido é raiz;
por que ItemPedido é filho;
por que EventoPedido é filho;
por que Cliente é associação;
qual regra foi protegida após pagamento.
```

### Parte 3 — OrdemServico agregado

Execute:

```text
OrdemServicoAgregadoApp.java
OrdemServicoAgregadoBloqueioApp.java
```

Explique:

```text
por que OS é raiz;
por que AtividadeOs é filha;
por que OcorrenciaOs é filha;
por que concluir OS depende da coleção de atividades.
```

### Parte 4 — Contrato agregado

Execute:

```text
ContratoAgregadoApp.java
```

Explique:

```text
por que Contrato é raiz;
por que ServicoContrato é filho;
por que Cliente é associação;
por que contrato ativo bloqueia alteração de serviço.
```

### Parte 5 — Desenho mental

Desenhe em texto:

```text
Pedido
  - ItemPedido
  - EventoPedido
  -> Cliente
```

Use `-` para composição e `->` para associação.

Faça o mesmo para:

```text
OrdemServico;
Contrato.
```

---

## Desafio prático

Crie um agregado de `Checklist`.

Estrutura sugerida:

```text
src\br\com\curso\aula139\appchecklist
src\br\com\curso\aula139\dominio\checklist
```

Arquivos sugeridos:

```text
appchecklist\ChecklistAgregadoApp.java
appchecklist\ChecklistAgregadoBloqueioApp.java

dominio\checklist\Checklist.java
dominio\checklist\PerguntaChecklist.java
dominio\checklist\EventoChecklist.java
dominio\checklist\StatusChecklist.java
```

Regras:

```text
Checklist é a raiz.
PerguntaChecklist é filha.
EventoChecklist é filho.
Checklist nasce EM_EDICAO.
Checklist registra evento ao ser criado.
Checklist adiciona pergunta internamente.
Checklist responde pergunta pelo código.
Checklist remove pergunta pelo código.
Checklist finaliza somente se houver pergunta.
Checklist finaliza somente se obrigatórias estiverem respondidas.
Checklist finalizado não permite alteração de perguntas.
Checklist cancelado não permite alteração de perguntas.
Checklist registra evento ao adicionar pergunta.
Checklist registra evento ao responder pergunta.
Checklist registra evento ao finalizar.
Checklist registra evento ao cancelar.
PerguntaChecklist não deve ter construtor public.
EventoChecklist não deve ter construtor public.
```

Métodos esperados na raiz:

```text
adicionarPergunta(String codigo, String texto, boolean obrigatoria);
responderPergunta(String codigo, String resposta);
removerPergunta(String codigo);
finalizar();
cancelar(String motivo);
perguntas();
eventos();
resumo();
```

Critério principal:

```text
toda alteração deve passar pela raiz Checklist.
```

---

## Erros comuns

### 1. Chamar qualquer composição de agregado

Agregado é composição com fronteira de consistência.

### 2. Deixar filhos alteráveis diretamente

Filho deve ser alterado pela raiz quando a regra envolve o conjunto.

### 3. Colocar objetos associados dentro do agregado como filhos

Cliente de um pedido normalmente é associação, não filho.

### 4. Criar agregado gigante

Agregado deve ser uma unidade de consistência, não o sistema inteiro.

### 5. Expor lista mutável

Mesmo em agregado, listas devem ser protegidas.

### 6. Colocar toda regra em service externo

A raiz deve proteger invariantes internas.

### 7. Criar evento ou ocorrência por fora

Históricos internos devem nascer de ações da raiz.

### 8. Deixar status dos filhos mudar sem a raiz saber

Isso quebra consistência e histórico.

---

## Debug recomendado

Use debug em:

```text
AgregadoSemRaizApp.java
PedidoAgregadoApp.java
PedidoAgregadoBloqueioApp.java
OrdemServicoAgregadoApp.java
OrdemServicoAgregadoBloqueioApp.java
ContratoAgregadoApp.java
```

Breakpoints recomendados:

```java
pedido.getItens().add(...)
pedido.setStatus(...)
cadeira.alterarQuantidade(...)

pedido.adicionarItem(...)
pedido.alterarQuantidadeItem(...)
item.alterarQuantidade(...)
pedido.confirmarPagamento(...)
registrarEvento(...)

os.adicionarAtividade(...)
os.concluirAtividade(...)
atividade.concluir()
os.concluir()
registrarOcorrencia(...)

contrato.adicionarServico(...)
contrato.ativar()
contrato.removerServico(...)
```

Observe:

```text
quem é a raiz;
quem cria os filhos;
quando a raiz bloqueia alteração;
quando evento ou ocorrência é registrado;
quando a regra depende de uma coleção;
quando a consistência é protegida.
```

O objetivo é enxergar a fronteira do agregado.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é um agregado?
2. Qual é o papel da raiz do agregado?
3. Por que Cliente é associação em Pedido, mas ItemPedido é filho?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar agregado em visão inicial;
identificar raiz do agregado;
identificar entidades filhas;
diferenciar composição de associação;
proteger alterações pela raiz;
evitar alteração direta de filhos;
usar coleções protegidas;
registrar eventos internos;
modelar Pedido como agregado;
modelar OrdemServico como agregado;
modelar Contrato como agregado;
evitar agregados gigantes;
resolver o desafio de Checklist;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-139-agregados-inicial
git commit -m "Aula 139: pratica agregados inicial"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
agregado é um conjunto de objetos de domínio protegido por uma raiz, que controla alterações para manter a consistência do conjunto.
```

Você viu que `Pedido`, `OrdemServico` e `Contrato` podem funcionar como raízes de agregados.

Também viu que objetos internos devem ser alterados pela raiz, não diretamente por qualquer parte do sistema.

Na próxima aula, vamos estudar limites de responsabilidade do domínio.

Vamos entender o que deve ficar dentro das entidades e agregados, e o que deve ficar fora, preparando o caminho para separar domínio, aplicação e infraestrutura com mais clareza.
