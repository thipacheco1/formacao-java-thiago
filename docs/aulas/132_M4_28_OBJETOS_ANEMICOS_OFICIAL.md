# 132 — M4.28 — Objetos anêmicos

## Objetivo da aula

Nesta aula você vai aprender o que são objetos anêmicos e por que eles enfraquecem o domínio.

Na aula anterior, você estudou `Tell, Don't Ask`, entendendo que é melhor mandar o objeto executar uma ação do que perguntar seus dados para aplicar regra por fora. Agora vamos estudar um problema muito comum em projetos Java:

```text
classes que só têm atributos, getters e setters, mas quase nenhum comportamento.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é um objeto anêmico;
identificar classes anêmicas;
entender por que getters e setters automáticos podem enfraquecer o domínio;
diferenciar DTO de objeto de domínio;
transformar objeto anêmico em objeto com comportamento;
mover regra para dentro da entidade correta;
proteger invariantes;
reduzir setters perigosos;
criar métodos de domínio com intenção;
aplicar isso em Pedido, Produto, Contrato e OrdemServico.
```

Essa aula é essencial para Java backend porque muitos sistemas parecem orientados a objetos, mas na prática usam objetos apenas como sacolas de dados.

O código compila.

O sistema funciona.

Mas a regra fica espalhada.

---

## A ideia central

Objeto anêmico é uma classe que representa um conceito importante do domínio, mas quase não tem comportamento.

Exemplo típico:

```java
public class Pedido {
    private int numero;
    private BigDecimal total;
    private StatusPedido status;

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }
}
```

Essa classe tem dados.

Mas não protege regras como:

```text
pedido nasce criado;
pedido só pode ser pago se estiver criado;
pedido pago não pode ser cancelado por qualquer fluxo;
total precisa ser positivo;
status não pode ser alterado livremente.
```

Essas regras acabam indo para fora.

Isso cria domínio anêmico.

---

## Objeto anêmico parece OO, mas não é OO de verdade

A classe existe.

O objeto é instanciado.

Os atributos são privados.

Há getters e setters.

Mesmo assim, pode estar ruim.

Por quê?

Porque o comportamento não está no objeto.

A regra fica em outro lugar:

```text
app;
service;
controller;
utils;
manager;
processador;
validador externo.
```

O objeto vira apenas um recipiente.

A lógica fica espalhada.

Orientação a Objetos não é apenas esconder atributos atrás de getters e setters.

Orientação a Objetos é colocar dados e comportamentos relacionados no mesmo objeto.

---

## Sintomas de objeto anêmico

Desconfie quando uma classe de domínio tem:

```text
muitos getters;
muitos setters;
poucos métodos de comportamento;
status alterado por setStatus;
listas alteradas por getLista().add(...);
validações todas fora da classe;
regras em services enormes;
classe de domínio sem verbo de negócio;
métodos chamados apenas get e set.
```

Exemplo de comportamento ausente:

```text
Pedido não tem confirmarPagamento();
Produto não tem reservarEstoque();
Contrato não tem ativar();
OrdemServico não tem reagendar();
Pagamento não tem estornar();
```

Se a ação existe no negócio, mas não existe como método no objeto, talvez o objeto esteja anêmico.

---

## DTO pode ser anêmico

Um ponto importante:

```text
nem toda classe com getters e setters é problema.
```

DTOs podem ser anêmicos.

DTO significa:

```text
Data Transfer Object;
objeto de transferência de dados.
```

DTO é usado para transportar dados entre camadas, como:

```text
requisição HTTP;
resposta de API;
integração externa;
entrada de formulário;
payload de mensageria.
```

Exemplo:

```java
public class CriarPedidoRequest {
    public int clienteId;
    public List<ItemRequest> itens;
}
```

DTO não precisa ter regra rica de domínio.

Mas entidade de domínio precisa.

A regra prática:

```text
DTO pode ser simples;
objeto de domínio não deve ser apenas saco de dados.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-132-objetos-anemicos
cd labs\m4\aula-132-objetos-anemicos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula132
mkdir src\br\com\curso\aula132\app
mkdir src\br\com\curso\aula132\exemplo
mkdir src\br\com\curso\aula132\exemplo\ruim
mkdir src\br\com\curso\aula132\dominio
mkdir src\br\com\curso\aula132\dominio\pedido
mkdir src\br\com\curso\aula132\dominio\produto
mkdir src\br\com\curso\aula132\dominio\contrato
mkdir src\br\com\curso\aula132\dominio\ordemservico
mkdir src\br\com\curso\aula132\dominio\valor
```

Nesta aula, vamos comparar:

```text
objetos anêmicos;
objetos com comportamento;
services/app fazendo regra demais;
domínio protegendo suas próprias regras.
```

---

## Exemplo 1 — Pedido anêmico

Crie:

```text
src\br\com\curso\aula132\exemplo\ruim\PedidoAnemicoApp.java
```

Código:

```java
package br.com.curso.aula132.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoAnemicoApp {
    public static void main(String[] args) {
        PedidoAnemico pedido = new PedidoAnemico();

        pedido.setNumero(1001);
        pedido.setTotal(new BigDecimal("399.80"));
        pedido.setStatus(StatusPedidoAnemico.CRIADO);

        BigDecimal valorPago = new BigDecimal("399.80");

        if (pedido.getStatus() == StatusPedidoAnemico.CRIADO
                && valorPago.compareTo(pedido.getTotal()) >= 0) {
            pedido.setStatus(StatusPedidoAnemico.PAGO);
        }

        System.out.println("Pedido " + pedido.getNumero());
        System.out.println("Total: R$ " + pedido.getTotal());
        System.out.println("Status: " + pedido.getStatus());
    }
}

enum StatusPedidoAnemico {
    CRIADO,
    PAGO,
    CANCELADO
}

class PedidoAnemico {
    private int numero;
    private BigDecimal total;
    private StatusPedidoAnemico status;

    int getNumero() {
        return numero;
    }

    void setNumero(int numero) {
        this.numero = numero;
    }

    BigDecimal getTotal() {
        return total;
    }

    void setTotal(BigDecimal total) {
        if (total == null) {
            throw new IllegalArgumentException("Total é obrigatório.");
        }

        this.total = total.setScale(2, RoundingMode.HALF_UP);
    }

    StatusPedidoAnemico getStatus() {
        return status;
    }

    void setStatus(StatusPedidoAnemico status) {
        this.status = status;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula132.exemplo.ruim.PedidoAnemicoApp
```

---

## O que há de errado

A classe `PedidoAnemico` tem:

```text
getNumero;
setNumero;
getTotal;
setTotal;
getStatus;
setStatus.
```

Mas não tem:

```text
confirmarPagamento;
cancelar;
criado;
pago;
resumo.
```

A regra ficou no app:

```java
if (pedido.getStatus() == StatusPedidoAnemico.CRIADO
        && valorPago.compareTo(pedido.getTotal()) >= 0) {
    pedido.setStatus(StatusPedidoAnemico.PAGO);
}
```

Isso é um sinal forte de objeto anêmico.

O app sabe demais sobre a regra do pedido.

O pedido sabe pouco sobre si mesmo.

---

## Problemas práticos do pedido anêmico

Com setters livres, alguém poderia fazer:

```java
pedido.setNumero(0);
pedido.setTotal(new BigDecimal("-100.00"));
pedido.setStatus(StatusPedidoAnemico.PAGO);
pedido.setStatus(StatusPedidoAnemico.CRIADO);
pedido.setStatus(null);
```

Mesmo que alguns setters validem parte do dado, o ciclo de vida continua fraco.

O principal problema é:

```text
o objeto não protege suas transições.
```

Um pedido não deveria virar pago por um simples `setStatus`.

Ele deveria confirmar pagamento por uma operação com regra.

---

## Service gigante nasce assim

Em muitos sistemas, o objeto anêmico vem acompanhado de um service gigante.

Exemplo conceitual:

```java
class PedidoService {
    void confirmarPagamento(Pedido pedido, BigDecimal valorPago) {
        if (pedido.getStatus() == CRIADO && valorPago.compareTo(pedido.getTotal()) >= 0) {
            pedido.setStatus(PAGO);
        }
    }

    void cancelar(Pedido pedido, String motivo) {
        if (pedido.getStatus() != PAGO) {
            pedido.setStatus(CANCELADO);
            pedido.setMotivo(motivo);
        }
    }
}
```

O service começa a concentrar toda regra.

A entidade vira apenas dados.

Mais tarde, o service cresce:

```text
300 linhas;
800 linhas;
1500 linhas;
muitos ifs;
muita regra duplicada;
difícil testar;
difícil entender.
```

Nem todo service é ruim.

Mas service que existe porque os objetos não têm comportamento é sinal de domínio anêmico.

---

## Criando Dinheiro

Vamos criar uma versão melhor.

Crie:

```text
src\br\com\curso\aula132\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula132.dominio.valor;

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

Agora dinheiro não é `BigDecimal` espalhado.

É um objeto de valor com comportamento.

---

## Pedido com comportamento

Crie:

```text
src\br\com\curso\aula132\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula132.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula132\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula132.dominio.pedido;

import br.com.curso.aula132.dominio.valor.Dinheiro;

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

Crie:

```text
src\br\com\curso\aula132\app\PedidoComComportamentoApp.java
```

Código:

```java
package br.com.curso.aula132.app;

import br.com.curso.aula132.dominio.pedido.Pedido;
import br.com.curso.aula132.dominio.valor.Dinheiro;

public class PedidoComComportamentoApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                1001,
                Dinheiro.de("399.80")
        );

        pedido.confirmarPagamento(Dinheiro.de("399.80"));

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula132.app.PedidoComComportamentoApp
```

---

## O que melhorou

Antes, o app fazia:

```text
perguntar status;
perguntar total;
comparar valor;
alterar status.
```

Agora, o app apenas diz:

```java
pedido.confirmarPagamento(Dinheiro.de("399.80"));
```

O pedido protege:

```text
status atual;
valor pago;
transição para PAGO.
```

O objeto deixou de ser anêmico.

Ele passou a ter comportamento de domínio.

---

## O que torna o objeto mais forte

A classe `Pedido` agora tem:

```text
estado privado;
construtor validando nascimento;
métodos de consulta com intenção;
métodos de ação com regra;
sem setStatus público;
sem setTotal público;
sem setNumero público.
```

Isso melhora:

```text
encapsulamento;
coesão;
Tell, Don't Ask;
segurança do ciclo de vida;
legibilidade;
manutenção.
```

---

## Exemplo 2 — Produto anêmico

Agora veja um produto anêmico.

Crie:

```text
src\br\com\curso\aula132\exemplo\ruim\ProdutoAnemicoApp.java
```

Código:

```java
package br.com.curso.aula132.exemplo.ruim;

public class ProdutoAnemicoApp {
    public static void main(String[] args) {
        ProdutoAnemico produto = new ProdutoAnemico();

        produto.setCodigo("PROD-001");
        produto.setNome("Cadeira");
        produto.setEstoque(10);

        int quantidade = 3;

        if (produto.getEstoque() >= quantidade) {
            produto.setEstoque(produto.getEstoque() - quantidade);
        }

        System.out.println(produto.resumo());
    }
}

class ProdutoAnemico {
    private String codigo;
    private String nome;
    private int estoque;

    String getCodigo() {
        return codigo;
    }

    void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    String getNome() {
        return nome;
    }

    void setNome(String nome) {
        this.nome = nome;
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
java -cp out br.com.curso.aula132.exemplo.ruim.ProdutoAnemicoApp
```

---

## Problemas do produto anêmico

O produto permite:

```java
produto.setEstoque(-10);
produto.setCodigo("");
produto.setNome(null);
```

E a regra de reserva está fora:

```java
if (produto.getEstoque() >= quantidade) {
    produto.setEstoque(produto.getEstoque() - quantidade);
}
```

O produto deveria proteger seu estoque.

O app não deveria calcular e alterar estoque manualmente.

---

## Produto com comportamento

Crie:

```text
src\br\com\curso\aula132\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula132.dominio.produto;

import br.com.curso.aula132.dominio.valor.Dinheiro;

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

    public void reporEstoque(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        estoque += quantidade;
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
src\br\com\curso\aula132\app\ProdutoComComportamentoApp.java
```

Código:

```java
package br.com.curso.aula132.app;

import br.com.curso.aula132.dominio.produto.Produto;
import br.com.curso.aula132.dominio.valor.Dinheiro;

public class ProdutoComComportamentoApp {
    public static void main(String[] args) {
        Produto produto = new Produto(
                "PROD-001",
                "Cadeira",
                Dinheiro.de("199.90"),
                10
        );

        produto.reservarEstoque(3);
        produto.reporEstoque(2);

        System.out.println(produto.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula132.app.ProdutoComComportamentoApp
```

---

## Produto mais forte

Agora o produto tem métodos de domínio:

```java
reservarEstoque(...)
reporEstoque(...)
disponivel(...)
```

Ele não expõe `setEstoque`.

O estoque não vira valor negativo por acidente.

O produto deixou de ser apenas dados.

Ele protege comportamento.

---

## Exemplo 3 — Contrato anêmico

Agora vamos ver contrato.

Crie:

```text
src\br\com\curso\aula132\exemplo\ruim\ContratoAnemicoApp.java
```

Código:

```java
package br.com.curso.aula132.exemplo.ruim;

public class ContratoAnemicoApp {
    public static void main(String[] args) {
        ContratoAnemico contrato = new ContratoAnemico();

        contrato.setCodigo("CONT-001");
        contrato.setStatus(StatusContratoAnemico.RASCUNHO);

        if (contrato.getStatus() == StatusContratoAnemico.RASCUNHO) {
            contrato.setStatus(StatusContratoAnemico.ATIVO);
        }

        if (contrato.getStatus() != StatusContratoAnemico.CANCELADO) {
            contrato.setStatus(StatusContratoAnemico.CANCELADO);
            contrato.setMotivoCancelamento("Cliente solicitou encerramento.");
        }

        System.out.println(contrato.resumo());
    }
}

enum StatusContratoAnemico {
    RASCUNHO,
    ATIVO,
    CANCELADO
}

class ContratoAnemico {
    private String codigo;
    private StatusContratoAnemico status;
    private String motivoCancelamento;

    String getCodigo() {
        return codigo;
    }

    void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    StatusContratoAnemico getStatus() {
        return status;
    }

    void setStatus(StatusContratoAnemico status) {
        this.status = status;
    }

    String getMotivoCancelamento() {
        return motivoCancelamento;
    }

    void setMotivoCancelamento(String motivoCancelamento) {
        this.motivoCancelamento = motivoCancelamento;
    }

    String resumo() {
        return "Contrato " + codigo
                + " | Status: " + status
                + " | Motivo: " + motivoCancelamento;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula132.exemplo.ruim.ContratoAnemicoApp
```

---

## Problemas do contrato anêmico

O app decide:

```text
quando ativar;
quando cancelar;
como alterar status;
quando preencher motivo.
```

O contrato não protege o próprio ciclo de vida.

Qualquer parte poderia fazer:

```java
contrato.setStatus(StatusContratoAnemico.CANCELADO);
contrato.setMotivoCancelamento(null);
contrato.setStatus(StatusContratoAnemico.RASCUNHO);
```

Isso enfraquece o domínio.

---

## Contrato com comportamento

Crie:

```text
src\br\com\curso\aula132\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula132.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula132\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula132.dominio.contrato;

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
                + " | Motivo: " + motivoCancelamento;
    }
}
```

Crie:

```text
src\br\com\curso\aula132\app\ContratoComComportamentoApp.java
```

Código:

```java
package br.com.curso.aula132.app;

import br.com.curso.aula132.dominio.contrato.Contrato;

public class ContratoComComportamentoApp {
    public static void main(String[] args) {
        Contrato contrato = new Contrato("CONT-001");

        contrato.ativar();
        contrato.cancelar("Cliente solicitou encerramento.");

        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula132.app.ContratoComComportamentoApp
```

---

## Contrato mais forte

Antes:

```java
contrato.setStatus(StatusContratoAnemico.ATIVO);
contrato.setStatus(StatusContratoAnemico.CANCELADO);
```

Agora:

```java
contrato.ativar();
contrato.cancelar("Cliente solicitou encerramento.");
```

A intenção ficou clara.

As regras ficaram dentro do contrato.

---

## Exemplo 4 — Ordem de Serviço anêmica

Crie:

```text
src\br\com\curso\aula132\exemplo\ruim\OrdemServicoAnemicaApp.java
```

Código:

```java
package br.com.curso.aula132.exemplo.ruim;

import java.time.LocalDate;

public class OrdemServicoAnemicaApp {
    public static void main(String[] args) {
        OrdemServicoAnemica os = new OrdemServicoAnemica();

        os.setCodigo("OS-2026-0001");
        os.setData(LocalDate.now().plusDays(1));
        os.setTurno("MANHA");
        os.setStatus("AGENDADA");
        os.setQuantidadeReagendamentos(0);

        if (!"CONCLUIDA".equals(os.getStatus())
                && !"CANCELADA".equals(os.getStatus())) {
            os.setData(LocalDate.now().plusDays(3));
            os.setTurno("TARDE");
            os.setStatus("REAGENDADA");
            os.setQuantidadeReagendamentos(os.getQuantidadeReagendamentos() + 1);
        }

        System.out.println(os.resumo());
    }
}

class OrdemServicoAnemica {
    private String codigo;
    private LocalDate data;
    private String turno;
    private String status;
    private int quantidadeReagendamentos;

    String getCodigo() {
        return codigo;
    }

    void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    LocalDate getData() {
        return data;
    }

    void setData(LocalDate data) {
        this.data = data;
    }

    String getTurno() {
        return turno;
    }

    void setTurno(String turno) {
        this.turno = turno;
    }

    String getStatus() {
        return status;
    }

    void setStatus(String status) {
        this.status = status;
    }

    int getQuantidadeReagendamentos() {
        return quantidadeReagendamentos;
    }

    void setQuantidadeReagendamentos(int quantidadeReagendamentos) {
        this.quantidadeReagendamentos = quantidadeReagendamentos;
    }

    String resumo() {
        return "OS " + codigo
                + " | Data: " + data
                + " | Turno: " + turno
                + " | Status: " + status
                + " | Reagendamentos: " + quantidadeReagendamentos;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula132.exemplo.ruim.OrdemServicoAnemicaApp
```

---

## Problemas da OS anêmica

A OS usa:

```text
status como String;
turno como String;
setData;
setTurno;
setStatus;
setQuantidadeReagendamentos.
```

A regra de reagendamento está no app.

Qualquer parte poderia fazer:

```java
os.setStatus("QUALQUER_COISA");
os.setQuantidadeReagendamentos(-10);
os.setTurno("NOITE_INEXISTENTE");
```

Isso é frágil.

---

## Ordem de Serviço com comportamento

Crie:

```text
src\br\com\curso\aula132\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula132.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula132\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula132.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula132\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula132.dominio.ordemservico;

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
src\br\com\curso\aula132\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula132.dominio.ordemservico;

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
src\br\com\curso\aula132\app\OrdemServicoComComportamentoApp.java
```

Código:

```java
package br.com.curso.aula132.app;

import br.com.curso.aula132.dominio.ordemservico.OrdemServico;
import br.com.curso.aula132.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula132.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoComComportamentoApp {
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
java -cp out br.com.curso.aula132.app.OrdemServicoComComportamentoApp
```

---

## A OS deixou de ser anêmica

Antes:

```java
os.setData(...);
os.setTurno(...);
os.setStatus("REAGENDADA");
os.setQuantidadeReagendamentos(...);
```

Agora:

```java
os.reagendar(novoPeriodo);
```

A OS protege:

```text
status encerrado;
período obrigatório;
período diferente;
contador de reagendamento;
mudança de status.
```

Esse é o objetivo.

---

## Como transformar objeto anêmico

Use este processo:

### 1. Identifique setters perigosos

Exemplo:

```java
setStatus(...)
setEstoque(...)
setPeriodo(...)
setTotal(...)
setQuantidadeReagendamentos(...)
```

### 2. Descubra a intenção de negócio

Pergunte:

```text
por que alguém está chamando esse setter?
```

Exemplo:

```text
setStatus(PAGO) representa confirmar pagamento.
setEstoque(novoValor) representa reservar ou repor estoque.
setPeriodo(novoPeriodo) representa reagendar.
setStatus(ATIVO) representa ativar contrato.
```

### 3. Crie método com verbo de domínio

Exemplos:

```java
confirmarPagamento(...)
reservarEstoque(...)
reporEstoque(...)
reagendar(...)
ativar(...)
cancelar(...)
estornar(...)
```

### 4. Mova a regra para dentro

A validação deve ficar no objeto.

### 5. Remova ou restrinja setters

Se o setter permite pular regra, ele provavelmente não deve existir no domínio.

---

## Cuidado com extremos

Nem todo getter é ruim.

Nem todo setter é proibido.

Nem toda classe precisa ter lógica complexa.

O problema é quando um objeto importante do domínio não protege suas próprias regras.

Exemplo:

```text
Pedido sem confirmarPagamento;
Produto sem reservarEstoque;
Contrato sem ativar;
OS sem reagendar.
```

Se a classe representa um conceito de negócio com ciclo de vida, ela provavelmente precisa de comportamento.

---

## Objeto anêmico e banco de dados

Muita gente cria domínio anêmico porque pensa primeiro no banco.

Exemplo:

```text
tabela pedido;
coluna id;
coluna total;
coluna status;
gerar classe com campos;
gerar getters e setters.
```

Isso cria uma classe parecida com a tabela.

Mas domínio não é apenas tabela.

Domínio tem regra.

A tabela armazena estado.

O objeto protege comportamento.

Mais adiante, quando entrarmos em persistência, esse cuidado será ainda mais importante.

---

## Objeto anêmico e frameworks

Frameworks podem incentivar classes com construtor vazio, getters e setters.

Isso aparece em:

```text
JPA;
Jackson;
DTOs;
serialização;
formulários;
mapeamentos.
```

Mas você precisa separar mentalmente:

```text
classe de transporte;
classe de persistência;
classe de domínio.
```

Nem tudo precisa ser domínio rico.

Mas regra de negócio importante não deve ficar perdida em classes externas sem necessidade.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido anêmico

Execute:

```text
PedidoAnemicoApp.java
```

Explique:

```text
quais setters existem;
qual regra está fora do pedido;
qual método de domínio deveria existir.
```

### Parte 2 — Pedido com comportamento

Execute:

```text
PedidoComComportamentoApp.java
```

Explique:

```text
por que confirmarPagamento fortalece o objeto;
por que setStatus foi removido.
```

### Parte 3 — Produto

Execute:

```text
ProdutoAnemicoApp.java
ProdutoComComportamentoApp.java
```

Compare:

```text
setEstoque;
reservarEstoque;
reporEstoque.
```

### Parte 4 — Contrato

Execute:

```text
ContratoAnemicoApp.java
ContratoComComportamentoApp.java
```

Explique:

```text
por que ativar e cancelar são melhores que setStatus.
```

### Parte 5 — OS

Execute:

```text
OrdemServicoAnemicaApp.java
OrdemServicoComComportamentoApp.java
```

Explique:

```text
por que reagendar substitui vários setters.
```

---

## Desafio prático

Crie um domínio de `Pagamento` evitando objeto anêmico.

Estrutura sugerida:

```text
src\br\com\curso\aula132\apppagamento
src\br\com\curso\aula132\dominio\pagamento
```

Arquivos sugeridos:

```text
apppagamento\PagamentoComportamentoApp.java

dominio\pagamento\Pagamento.java
dominio\pagamento\StatusPagamento.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras:

```text
Pagamento tem código, valor, status e motivoEstorno.
StatusPagamento tem PENDENTE, CONFIRMADO, ESTORNADO.
Pagamento nasce PENDENTE.
Valor precisa ser positivo.
Pagamento pode confirmar se estiver PENDENTE.
Pagamento pode estornar se estiver CONFIRMADO.
Estorno exige motivo.
Pagamento estornado não pode confirmar novamente.
Pagamento pendente não pode estornar.
```

Evite:

```text
setStatus;
setValor;
setMotivoEstorno;
status como String;
regra no app.
```

Use:

```text
confirmar();
estornar(String motivo);
pendente();
confirmado();
estornado();
resumo();
```

Critério principal:

```text
Pagamento deve proteger seu próprio ciclo de vida.
```

---

## Erros comuns

### 1. Achar que private + getter + setter resolve encapsulamento

Isso é apenas o começo. Encapsulamento real exige comportamento.

### 2. Criar setter para todo atributo

Setter automático pode permitir estado inválido.

### 3. Deixar regra no app

App deve coordenar exemplo, não substituir o domínio.

### 4. Criar service gigante para compensar entidade fraca

Service pode existir, mas não deve virar depósito de toda regra que deveria estar no domínio.

### 5. Usar status como String

Use `enum` para estados controlados.

### 6. Ignorar objetos de valor

Dinheiro, Email, Período e Código ajudam a fortalecer o domínio.

### 7. Transformar DTO em domínio

DTO transporta dados. Domínio protege regra.

### 8. Achar que todo objeto precisa ser rico

Objetos de transporte podem ser simples. Entidades de domínio importantes não deveriam ser anêmicas.

---

## Debug recomendado

Use debug em:

```text
PedidoAnemicoApp.java
PedidoComComportamentoApp.java
ProdutoAnemicoApp.java
ProdutoComComportamentoApp.java
ContratoAnemicoApp.java
ContratoComComportamentoApp.java
OrdemServicoAnemicaApp.java
OrdemServicoComComportamentoApp.java
```

Breakpoints recomendados:

```java
pedido.setStatus(...)
pedido.confirmarPagamento(...)

produto.setEstoque(...)
produto.reservarEstoque(...)
produto.reporEstoque(...)

contrato.setStatus(...)
contrato.ativar()
contrato.cancelar(...)

os.setStatus(...)
os.setQuantidadeReagendamentos(...)
os.reagendar(...)
```

Observe:

```text
na versão anêmica, estado muda por setters;
na versão rica, estado muda por métodos de domínio;
a regra fica mais próxima dos dados;
o objeto protege seu ciclo de vida;
o app fica mais simples.
```

O objetivo é enxergar a diferença entre objeto como saco de dados e objeto com comportamento.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é um objeto anêmico?
2. Quando um DTO anêmico pode ser aceitável?
3. Qual setter você substituiria por um método de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar objeto anêmico;
identificar classe com getters e setters excessivos;
diferenciar DTO de domínio;
mover regra para dentro do objeto;
substituir setStatus por método de domínio;
substituir setEstoque por reservarEstoque ou reporEstoque;
usar enum para estados;
usar objeto de valor para dinheiro;
fortalecer Pedido, Produto, Contrato e OrdemServico;
evitar service gigante por domínio fraco;
resolver o desafio de Pagamento;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-132-objetos-anemicos
git commit -m "Aula 132: pratica objetos anemicos"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
objeto de domínio não deve ser apenas uma sacola de dados; ele deve proteger comportamento e regras que pertencem a ele.
```

Você viu que getters e setters automáticos podem enfraquecer o domínio quando substituem métodos de negócio.

Também viu que DTO pode ser simples, mas entidade importante precisa proteger seu ciclo de vida.

Na próxima aula, vamos estudar invariantes de domínio.

Vamos entender quais regras precisam permanecer sempre verdadeiras dentro de um objeto e como protegê-las desde o construtor até os métodos de alteração.
