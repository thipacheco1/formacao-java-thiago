# 131 — M4.27 — Tell, Don't Ask

## Objetivo da aula

Nesta aula você vai aprender o princípio `Tell, Don't Ask`.

Na aula anterior, você estudou colaboração entre objetos. Agora vamos aprofundar uma das ideias mais importantes para melhorar essa colaboração:

```text
não fique perguntando dados de um objeto para tomar decisões por ele;
diga ao objeto o que você quer que ele faça.
```

Ao final da aula, você deve conseguir:

```text
explicar Tell, Don't Ask;
identificar código que pergunta demais;
substituir getters e setters por métodos de domínio;
entender quando perguntar é aceitável;
entender quando perguntar espalha regra;
evitar ifs externos baseados em estado interno;
criar métodos como pagar, cancelar, reagendar, ativar e reservar;
proteger invariantes dentro dos objetos;
melhorar coesão e reduzir acoplamento;
aplicar o princípio em Pedido, Produto, Contrato e OrdemServico.
```

Essa aula é fundamental para sair de um estilo procedural com classes e começar a escrever código mais orientado a objetos.

---

## A ideia central

`Tell, Don't Ask` significa:

```text
diga ao objeto para executar uma ação;
não pergunte seus dados para decidir a ação fora dele.
```

Exemplo ruim:

```java
if (pedido.status() == StatusPedido.CRIADO) {
    pedido.setStatus(StatusPedido.PAGO);
}
```

O código externo perguntou o status do pedido e decidiu alterar o status.

Exemplo melhor:

```java
pedido.confirmarPagamento(valorPago);
```

Agora o pedido recebe uma ordem de domínio:

```text
confirme o pagamento.
```

E ele mesmo decide se pode ou não.

---

## Tell, Don't Ask não significa nunca perguntar

O nome pode confundir.

O princípio não quer dizer que você nunca pode chamar um método de consulta.

Métodos como estes são normais:

```java
pedido.pago()
cliente.ativo()
produto.estoque()
contrato.resumo()
```

Perguntar é aceitável quando você precisa exibir informação, montar relatório, tomar decisão de fluxo externo simples ou apresentar dados.

O problema é perguntar dados internos para reproduzir fora da classe uma regra que deveria estar dentro dela.

Exemplo aceitável:

```java
if (pedido.pago()) {
    System.out.println("Pedido já pago.");
}
```

Exemplo suspeito:

```java
if (pedido.pago()) {
    pedido.setStatus(StatusPedido.CANCELADO);
    pedido.setMotivoCancelamento("Erro operacional");
}
```

A regra de cancelamento deveria estar em:

```java
pedido.cancelar("Erro operacional");
```

A diferença é:

```text
perguntar para apresentar: geralmente ok;
perguntar para alterar o objeto por fora: sinal de problema.
```

---

## Por que isso importa

Quando regras ficam fora dos objetos, o sistema começa a espalhar lógica.

Exemplo:

```text
Controller decide status;
App calcula total;
Service altera campos;
Tela valida regra;
Utils decide cancelamento;
Entidade só guarda dados.
```

Isso gera problemas:

```text
regra duplicada;
status alterado de forma inválida;
métodos públicos demais;
setters perigosos;
objetos anêmicos;
difícil saber onde a regra está;
difícil alterar comportamento sem quebrar.
```

`Tell, Don't Ask` ajuda a colocar a regra no objeto que deveria protegê-la.

---

## Relação com aulas anteriores

Este princípio conecta várias aulas:

```text
encapsulamento;
modificadores de acesso;
coesão;
acoplamento;
colaboração entre objetos.
```

Para aplicar bem:

```text
atributos precisam ser private;
setters devem ser usados com muito critério;
métodos públicos precisam representar ações reais;
objetos precisam ser coesos;
dependências precisam ser controladas;
objetos colaboram por mensagens.
```

`Tell, Don't Ask` é uma consequência natural de bom encapsulamento.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-131-tell-dont-ask
cd labs\m4\aula-131-tell-dont-ask
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula131
mkdir src\br\com\curso\aula131\app
mkdir src\br\com\curso\aula131\exemplo
mkdir src\br\com\curso\aula131\exemplo\ruim
mkdir src\br\com\curso\aula131\dominio
mkdir src\br\com\curso\aula131\dominio\pedido
mkdir src\br\com\curso\aula131\dominio\produto
mkdir src\br\com\curso\aula131\dominio\contrato
mkdir src\br\com\curso\aula131\dominio\ordemservico
mkdir src\br\com\curso\aula131\dominio\valor
```

Nesta aula, vamos ver:

```text
um pedido ruim perguntando status e alterando por setter;
um pedido melhor recebendo comandos de domínio;
um produto protegendo estoque;
uma OS protegendo reagendamento;
um contrato protegendo ativação e cancelamento.
```

---

## Exemplo 1 — Código perguntando demais

Crie:

```text
src\br\com\curso\aula131\exemplo\ruim\PedidoPerguntandoDemaisApp.java
```

Código:

```java
package br.com.curso.aula131.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoPerguntandoDemaisApp {
    public static void main(String[] args) {
        PedidoPerguntandoDemais pedido = new PedidoPerguntandoDemais(
                1001,
                new BigDecimal("399.80")
        );

        BigDecimal valorPago = new BigDecimal("399.80");

        if (pedido.getStatus() == StatusPedidoPerguntando.CRIADO
                && valorPago.compareTo(pedido.getTotal()) >= 0) {
            pedido.setStatus(StatusPedidoPerguntando.PAGO);
        }

        if (pedido.getStatus() == StatusPedidoPerguntando.PAGO) {
            System.out.println("Pedido pago com sucesso.");
        }

        System.out.println(pedido.resumo());
    }
}

enum StatusPedidoPerguntando {
    CRIADO,
    PAGO,
    CANCELADO
}

class PedidoPerguntandoDemais {
    private final int numero;
    private final BigDecimal total;
    private StatusPedidoPerguntando status;

    PedidoPerguntandoDemais(int numero, BigDecimal total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.total = total.setScale(2, RoundingMode.HALF_UP);
        this.status = StatusPedidoPerguntando.CRIADO;
    }

    int getNumero() {
        return numero;
    }

    BigDecimal getTotal() {
        return total;
    }

    StatusPedidoPerguntando getStatus() {
        return status;
    }

    void setStatus(StatusPedidoPerguntando status) {
        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.status = status;
    }

    String resumo() {
        return "Pedido " + numero
                + " | Total: R$ " + total
                + " | Status: " + status;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula131.exemplo.ruim.PedidoPerguntandoDemaisApp
```

---

## O problema do exemplo

O app fez a regra do pedido:

```java
if (pedido.getStatus() == StatusPedidoPerguntando.CRIADO
        && valorPago.compareTo(pedido.getTotal()) >= 0) {
    pedido.setStatus(StatusPedidoPerguntando.PAGO);
}
```

Isso significa que a lógica de pagamento está fora do objeto `Pedido`.

O app perguntou:

```text
qual é seu status?
qual é seu total?
```

Depois decidiu:

```text
vou alterar seu status para pago.
```

Isso é o oposto de `Tell, Don't Ask`.

O objeto `Pedido` deveria receber a ação:

```java
pedido.confirmarPagamento(valorPago);
```

E proteger a regra internamente.

---

## Por que o setter é perigoso

Este método parece simples:

```java
void setStatus(StatusPedidoPerguntando status) {
    this.status = status;
}
```

Mas ele permite fluxos inválidos.

Exemplo:

```java
pedido.setStatus(StatusPedidoPerguntando.PAGO);
pedido.setStatus(StatusPedidoPerguntando.CRIADO);
pedido.setStatus(StatusPedidoPerguntando.CANCELADO);
```

Quem está fora consegue pular regra.

O pedido não controla seu ciclo de vida.

Em domínio, geralmente é melhor ter métodos como:

```java
confirmarPagamento(...)
cancelar(...)
reabrir(...)
concluir(...)
reagendar(...)
ativar(...)
```

Esses métodos comunicam intenção e protegem regra.

---

## Criando Dinheiro

Agora vamos criar a versão melhor.

Crie:

```text
src\br\com\curso\aula131\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula131.dominio.valor;

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

Agora dinheiro tem comportamento próprio.

O código externo não precisa manipular `BigDecimal` diretamente para regra simples de domínio.

---

## Pedido dizendo, não perguntando

Crie:

```text
src\br\com\curso\aula131\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula131.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Agora crie:

```text
src\br\com\curso\aula131\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula131.dominio.pedido;

import br.com.curso.aula131.dominio.valor.Dinheiro;

public class Pedido {
    private final int numero;
    private final Dinheiro total;
    private StatusPedido status;
    private String motivoCancelamento;

    public Pedido(int numero, Dinheiro total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (total == null || !total.positivo()) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.total = total;
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

    public void confirmarPagamento(Dinheiro valorPago) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || !valorPago.maiorOuIgual(total)) {
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
        return "Pedido " + numero
                + " | Total: " + total
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

---

## App usando o pedido melhor

Crie:

```text
src\br\com\curso\aula131\app\PedidoTellDontAskApp.java
```

Código:

```java
package br.com.curso.aula131.app;

import br.com.curso.aula131.dominio.pedido.Pedido;
import br.com.curso.aula131.dominio.valor.Dinheiro;

public class PedidoTellDontAskApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                1001,
                Dinheiro.de("399.80")
        );

        pedido.confirmarPagamento(Dinheiro.de("399.80"));

        if (pedido.pago()) {
            System.out.println("Pedido pago com sucesso.");
        }

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula131.app.PedidoTellDontAskApp
```

---

## O que melhorou

Antes:

```java
if (pedido.getStatus() == StatusPedidoPerguntando.CRIADO
        && valorPago.compareTo(pedido.getTotal()) >= 0) {
    pedido.setStatus(StatusPedidoPerguntando.PAGO);
}
```

Agora:

```java
pedido.confirmarPagamento(Dinheiro.de("399.80"));
```

O app não reproduz a regra.

O pedido protege:

```text
se está criado;
se o valor pago cobre o total;
como o status muda.
```

O app apenas pede a ação.

Isso é `Tell, Don't Ask`.

---

## Perguntar para exibir continua válido

No app, usamos:

```java
if (pedido.pago()) {
    System.out.println("Pedido pago com sucesso.");
}
```

Isso não é necessariamente problema.

Aqui estamos perguntando para exibir uma mensagem simples.

O problema seria fazer:

```java
if (pedido.pago()) {
    pedido.setStatus(StatusPedido.CANCELADO);
}
```

A regra prática:

```text
perguntar para apresentação ou fluxo externo simples é aceitável;
perguntar para alterar regra interna do objeto é suspeito.
```

---

## Exemplo 2 — Produto e estoque

Agora vamos ver um caso clássico.

Código ruim:

```java
if (produto.estoque() >= quantidade) {
    produto.setEstoque(produto.estoque() - quantidade);
}
```

Isso pergunta e depois manipula.

Melhor:

```java
produto.reservarEstoque(quantidade);
```

O produto protege seu próprio estoque.

---

## Produto ruim perguntando estoque

Crie:

```text
src\br\com\curso\aula131\exemplo\ruim\ProdutoPerguntandoEstoqueApp.java
```

Código:

```java
package br.com.curso.aula131.exemplo.ruim;

public class ProdutoPerguntandoEstoqueApp {
    public static void main(String[] args) {
        ProdutoPerguntandoEstoque produto = new ProdutoPerguntandoEstoque(
                "PROD-001",
                "Cadeira",
                10
        );

        int quantidade = 3;

        if (produto.getEstoque() >= quantidade) {
            produto.setEstoque(produto.getEstoque() - quantidade);
        }

        System.out.println(produto.resumo());
    }
}

class ProdutoPerguntandoEstoque {
    private final String codigo;
    private final String nome;
    private int estoque;

    ProdutoPerguntandoEstoque(String codigo, String nome, int estoque) {
        this.codigo = codigo;
        this.nome = nome;
        this.estoque = estoque;
    }

    int getEstoque() {
        return estoque;
    }

    void setEstoque(int estoque) {
        this.estoque = estoque;
    }

    String resumo() {
        return codigo + " - " + nome + " | Estoque: " + estoque;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula131.exemplo.ruim.ProdutoPerguntandoEstoqueApp
```

---

## Problema do estoque ruim

O app controla a regra de estoque.

Isso permite erros:

```java
produto.setEstoque(-100);
```

ou:

```java
produto.setEstoque(produto.getEstoque() - 999);
```

O produto perdeu controle do próprio estado.

A regra deveria estar dentro do produto.

---

## Produto dizendo para reservar

Crie:

```text
src\br\com\curso\aula131\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula131.dominio.produto;

import br.com.curso.aula131.dominio.valor.Dinheiro;

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

    public boolean disponivel(int quantidade) {
        if (quantidade <= 0) {
            return false;
        }

        return estoque >= quantidade;
    }

    public void reservarEstoque(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (!disponivel(quantidade)) {
            throw new IllegalStateException("Estoque insuficiente para " + codigo);
        }

        estoque -= quantidade;
    }

    public String resumo() {
        return codigo
                + " - " + nome
                + " | Preço: " + preco
                + " | Estoque: " + estoque;
    }
}
```

Crie:

```text
src\br\com\curso\aula131\app\ProdutoTellDontAskApp.java
```

Código:

```java
package br.com.curso.aula131.app;

import br.com.curso.aula131.dominio.produto.Produto;
import br.com.curso.aula131.dominio.valor.Dinheiro;

public class ProdutoTellDontAskApp {
    public static void main(String[] args) {
        Produto produto = new Produto(
                "PROD-001",
                "Cadeira",
                Dinheiro.de("199.90"),
                10
        );

        produto.reservarEstoque(3);

        System.out.println(produto.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula131.app.ProdutoTellDontAskApp
```

---

## O que melhorou no produto

Antes:

```java
if (produto.getEstoque() >= quantidade) {
    produto.setEstoque(produto.getEstoque() - quantidade);
}
```

Agora:

```java
produto.reservarEstoque(3);
```

A regra ficou no produto.

O app não sabe como o estoque é alterado.

Ele apenas solicita a ação.

O produto protege:

```text
quantidade maior que zero;
estoque suficiente;
estoque não negativo.
```

---

## Exemplo 3 — Ordem de Serviço

Agora vamos aplicar o mesmo princípio em OS.

Código ruim:

```java
if (os.status() != CONCLUIDA && os.status() != CANCELADA) {
    os.setPeriodo(novoPeriodo);
    os.setStatus(REAGENDADA);
    os.setQuantidadeReagendamentos(os.quantidadeReagendamentos() + 1);
}
```

Isso espalha a regra de reagendamento.

Melhor:

```java
os.reagendar(novoPeriodo);
```

---

## Código da OS

Crie:

```text
src\br\com\curso\aula131\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula131.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula131\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula131.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula131\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula131.dominio.ordemservico;

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

Crie:

```text
src\br\com\curso\aula131\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula131.dominio.ordemservico;

public class OrdemServico {
    private final String codigo;
    private PeriodoAtendimento periodo;
    private StatusOs status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;

    public OrdemServico(String codigo, PeriodoAtendimento periodo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.periodo = periodo;
        this.status = StatusOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
        this.motivoCancelamento = "";
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

        periodo = novoPeriodo;
        status = StatusOs.REAGENDADA;
        quantidadeReagendamentos++;
    }

    public void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
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
                + " | Período: " + periodo
                + " | Status: " + status
                + " | Reagendamentos: " + quantidadeReagendamentos
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Crie:

```text
src\br\com\curso\aula131\app\OrdemServicoTellDontAskApp.java
```

Código:

```java
package br.com.curso.aula131.app;

import br.com.curso.aula131.dominio.ordemservico.OrdemServico;
import br.com.curso.aula131.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula131.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoTellDontAskApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-2026-0001",
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
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula131.app.OrdemServicoTellDontAskApp
```

---

## O que a OS ensina

O app não faz:

```java
os.setPeriodo(novoPeriodo);
os.setStatus(StatusOs.REAGENDADA);
os.setQuantidadeReagendamentos(...);
```

Ele faz:

```java
os.reagendar(novoPeriodo);
```

A OS protege a regra:

```text
não reagendar encerrada;
novo período obrigatório;
novo período diferente;
incrementar contador;
alterar status.
```

Esse é o princípio aplicado em domínio real.

---

## Exemplo 4 — Contrato

Agora vamos aplicar em contrato.

Uma versão ruim perguntaria:

```java
if (contrato.status() == RASCUNHO) {
    contrato.setStatus(ATIVO);
}
```

Melhor:

```java
contrato.ativar();
```

Vamos criar a versão correta.

Crie:

```text
src\br\com\curso\aula131\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula131.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula131\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula131.dominio.contrato;

public class Contrato {
    private final String codigo;
    private StatusContrato status;
    private String motivoCancelamento;

    public Contrato(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("CONT-")) {
            throw new IllegalArgumentException("Código deve iniciar com CONT-.");
        }

        this.codigo = codigo;
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

    public void ativar() {
        if (!rascunho()) {
            throw new IllegalStateException("Somente contrato em rascunho pode ser ativado.");
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
        return "Contrato " + codigo
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Crie:

```text
src\br\com\curso\aula131\app\ContratoTellDontAskApp.java
```

Código:

```java
package br.com.curso.aula131.app;

import br.com.curso.aula131.dominio.contrato.Contrato;

public class ContratoTellDontAskApp {
    public static void main(String[] args) {
        Contrato contrato = new Contrato("CONT-001");

        contrato.ativar();

        if (contrato.ativo()) {
            System.out.println("Contrato ativo para operação.");
        }

        contrato.cancelar("Cliente solicitou encerramento.");

        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula131.app.ContratoTellDontAskApp
```

---

## Consultas úteis versus decisões invasivas

Veja:

```java
if (contrato.ativo()) {
    System.out.println("Contrato ativo para operação.");
}
```

Isso é uma consulta aceitável.

Agora veja:

```java
if (contrato.rascunho()) {
    contrato.setStatus(StatusContrato.ATIVO);
}
```

Isso seria ruim.

A diferença:

```text
consultar para informar ou seguir fluxo externo simples: ok;
consultar para alterar estado interno por fora: ruim.
```

Se a ação é do contrato, mande o contrato agir:

```java
contrato.ativar();
```

---

## Como identificar violação de Tell, Don't Ask

Procure padrões como:

```text
getStatus + setStatus;
getTotal + setTotal;
getEstoque + setEstoque;
getPeriodo + setPeriodo;
getQuantidade + setQuantidade;
if fora da entidade mudando estado da entidade;
app ou service montando regra que deveria estar no objeto.
```

Exemplo suspeito:

```java
if (os.getStatus() != StatusOs.CONCLUIDA) {
    os.setStatus(StatusOs.CANCELADA);
}
```

Melhor:

```java
os.cancelar("motivo");
```

---

## Nem todo if externo é errado

Cuidado para não exagerar.

Este if pode ser ok:

```java
if (pedido.pago()) {
    enviarComprovante(pedido);
}
```

Aqui o código externo está coordenando um fluxo.

Mas este if é suspeito:

```java
if (pedido.pago()) {
    pedido.setDataConfirmacao(LocalDate.now());
    pedido.setStatus(StatusPedido.CONCLUIDO);
}
```

Agora o código externo está mudando regras internas.

A pergunta é:

```text
esse if está apenas escolhendo um fluxo ou está aplicando regra interna de outro objeto?
```

---

## Commands e Queries

Uma forma útil de pensar:

```text
Command: método que manda o objeto fazer algo.
Query: método que pergunta algo ao objeto.
```

Exemplos de command:

```java
pedido.confirmarPagamento(valor);
pedido.cancelar("motivo");
produto.reservarEstoque(3);
os.reagendar(periodo);
contrato.ativar();
```

Exemplos de query:

```java
pedido.pago();
produto.disponivel(3);
contrato.ativo();
os.encerrada();
pedido.resumo();
```

Commands alteram ou executam uma ação.

Queries consultam.

`Tell, Don't Ask` não proíbe queries.

Ele diz para não usar queries para roubar a responsabilidade do objeto.

---

## Como transformar Ask em Tell

Processo prático:

### Antes

```java
if (pedido.getStatus() == StatusPedido.CRIADO
        && valorPago.compareTo(pedido.getTotal()) >= 0) {
    pedido.setStatus(StatusPedido.PAGO);
}
```

### Passo 1 — nomeie a intenção

A intenção é:

```text
confirmar pagamento.
```

### Passo 2 — crie método no objeto certo

```java
pedido.confirmarPagamento(valorPago);
```

### Passo 3 — mova a regra para dentro

```java
public void confirmarPagamento(Dinheiro valorPago) {
    if (!criado()) {
        throw new IllegalStateException(...);
    }

    if (valorPago == null || !valorPago.maiorOuIgual(total)) {
        throw new IllegalArgumentException(...);
    }

    status = StatusPedido.PAGO;
}
```

### Passo 4 — remova setter perigoso

Se ninguém precisa setar status livremente, remova:

```java
setStatus(...)
```

Esse é o caminho.

---

## Benefícios

Aplicar `Tell, Don't Ask` melhora:

```text
encapsulamento;
coesão;
legibilidade;
segurança das regras;
debug;
testes;
manutenção;
clareza do domínio;
redução de setters;
redução de duplicação.
```

O código passa de:

```text
pegue dados, faça if, altere campos
```

para:

```text
chame uma ação de domínio.
```

Isso é muito mais expressivo.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido ruim

Execute:

```text
PedidoPerguntandoDemaisApp.java
```

Explique:

```text
quais dados o app pergunta;
qual regra ele aplica fora do pedido;
qual setter permite pular regra.
```

### Parte 2 — Pedido melhor

Execute:

```text
PedidoTellDontAskApp.java
```

Explique:

```text
por que confirmarPagamento é melhor que getStatus + setStatus;
qual regra ficou dentro de Pedido.
```

### Parte 3 — Produto

Execute:

```text
ProdutoPerguntandoEstoqueApp.java
ProdutoTellDontAskApp.java
```

Compare:

```text
getEstoque + setEstoque;
reservarEstoque.
```

### Parte 4 — OS

Execute:

```text
OrdemServicoTellDontAskApp.java
```

Explique:

```text
por que reagendar é melhor que setPeriodo + setStatus.
```

### Parte 5 — Contrato

Execute:

```text
ContratoTellDontAskApp.java
```

Explique:

```text
quando ativo() é uma consulta aceitável;
por que ativar() é melhor que setStatus(ATIVO).
```

---

## Desafio prático

Crie um fluxo de pagamento de contrato aplicando `Tell, Don't Ask`.

Estrutura sugerida:

```text
src\br\com\curso\aula131\apppagamento
src\br\com\curso\aula131\dominio\pagamento
```

Arquivos sugeridos:

```text
apppagamento\PagamentoContratoApp.java

dominio\pagamento\PagamentoContrato.java
dominio\pagamento\StatusPagamento.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
dominio\contrato\Contrato.java
```

Regras:

```text
PagamentoContrato tem código, contrato, valor e status.
StatusPagamento tem PENDENTE, CONFIRMADO, ESTORNADO.
Pagamento nasce PENDENTE.
Pagamento pode confirmar se estiver PENDENTE.
Confirmar exige valor positivo.
Pagamento pode estornar se estiver CONFIRMADO.
Estornar exige motivo.
Pagamento estornado não pode confirmar novamente.
```

Evite:

```text
getStatus + setStatus;
getValor + setValor;
app alterando status diretamente;
status como String.
```

Use métodos:

```text
confirmar();
estornar(String motivo);
confirmado();
estornado();
resumo();
```

Critério principal:

```text
o app deve mandar o pagamento agir, não manipular o estado por fora.
```

---

## Erros comuns

### 1. Achar que getter sempre é ruim

Getter pode ser útil. O problema é usar getter para roubar regra do objeto.

### 2. Achar que todo if externo é errado

If externo pode coordenar fluxo. O problema é aplicar regra interna de outro objeto.

### 3. Manter setters perigosos

Setters genéricos permitem pular métodos de domínio.

### 4. Usar status como String

Use `enum` para estados controlados.

### 5. Colocar regra no app

App deve coordenar exemplo, não substituir o objeto de domínio.

### 6. Criar método de domínio com nome genérico

Prefira `confirmarPagamento`, `cancelar`, `reagendar`, `ativar`.

Evite nomes vagos como `processar`, `alterar`, `executar`.

### 7. Perguntar vários dados para fazer uma ação

Isso costuma indicar que a ação pertence ao objeto consultado.

### 8. Usar objeto como saco de dados

Objeto de domínio precisa proteger comportamento, não apenas armazenar campos.

---

## Debug recomendado

Use debug em:

```text
PedidoPerguntandoDemaisApp.java
PedidoTellDontAskApp.java
ProdutoPerguntandoEstoqueApp.java
ProdutoTellDontAskApp.java
OrdemServicoTellDontAskApp.java
ContratoTellDontAskApp.java
```

Breakpoints recomendados:

```java
pedido.getStatus()
pedido.setStatus(...)

pedido.confirmarPagamento(...)

produto.getEstoque()
produto.setEstoque(...)

produto.reservarEstoque(...)

os.reagendar(...)

contrato.ativar()
contrato.cancelar(...)
```

Observe:

```text
na versão ruim, o app pergunta e muda;
na versão melhor, o app manda o objeto agir;
a regra entra no objeto correto;
os setters perigosos desaparecem;
o estado muda dentro do próprio objeto.
```

O objetivo é enxergar a mudança de mentalidade.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa Tell, Don't Ask?
2. Quando perguntar um dado é aceitável?
3. Qual setter você removeria e por qual método de domínio substituiria?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar Tell, Don't Ask;
identificar código que pergunta demais;
diferenciar consulta aceitável de regra espalhada;
substituir getStatus + setStatus por método de domínio;
substituir getEstoque + setEstoque por reservarEstoque;
aplicar métodos como confirmarPagamento, cancelar, reagendar e ativar;
evitar status como String;
usar enum para estados;
manter atributos privados;
reduzir setters perigosos;
proteger invariantes dentro do objeto;
resolver o desafio de pagamento;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-131-tell-dont-ask
git commit -m "Aula 131: pratica tell dont ask"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
diga ao objeto para executar uma ação em vez de perguntar seus dados para executar a regra por fora.
```

Você viu que `Tell, Don't Ask` não proíbe consultas.

Ele orienta a não espalhar regras internas fora do objeto.

Na próxima aula, vamos estudar objetos anêmicos.

Vamos entender por que classes que só têm dados, getters e setters podem enfraquecer o domínio e como transformá-las em objetos com comportamento real.
