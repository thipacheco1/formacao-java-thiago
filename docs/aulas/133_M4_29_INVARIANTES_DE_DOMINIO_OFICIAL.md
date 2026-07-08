# 133 — M4.29 — Invariantes de domínio

## Objetivo da aula

Nesta aula você vai aprender invariantes de domínio.

Na aula anterior, você estudou objetos anêmicos e viu que objetos de domínio não devem ser apenas sacolas de dados. Agora vamos entender quais regras precisam permanecer sempre verdadeiras dentro de um objeto.

Ao final da aula, você deve conseguir:

```text
explicar o que é uma invariante de domínio;
diferenciar validação simples de invariante;
identificar invariantes em entidades e objetos de valor;
proteger invariantes no construtor;
proteger invariantes nos métodos de alteração;
evitar setters que quebram regra;
impedir estados impossíveis;
usar enum para estados controlados;
usar objetos de valor para fortalecer invariantes;
modelar invariantes em Pedido, Produto, Contrato e OrdemServico.
```

Essa aula é muito importante porque domínio robusto não é apenas ter métodos bonitos.

Domínio robusto precisa impedir que objetos fiquem em estado inválido.

---

## A ideia central

Invariante é uma regra que deve permanecer verdadeira durante toda a vida do objeto.

Exemplo:

```text
Pedido não pode ter número menor ou igual a zero.
Pedido não pode ter total negativo.
Pedido não pode ter status nulo.
Pedido pago não pode ser cancelado por qualquer fluxo.
Produto não pode ter estoque negativo.
Contrato não pode ter período com fim antes do início.
Ordem de Serviço concluída não pode ser reagendada.
Dinheiro não pode ter valor nulo.
```

Essas regras não podem valer só na criação.

Elas precisam continuar valendo depois de qualquer operação.

A pergunta principal é:

```text
quais condições nunca podem ser quebradas neste objeto?
```

Essas condições são invariantes.

---

## Validação comum versus invariante

Validação comum pode ser uma checagem de entrada.

Exemplo:

```text
campo obrigatório em formulário;
texto com tamanho máximo;
data digitada no formato correto;
número informado pelo usuário.
```

Invariante é mais forte.

Ela representa uma regra essencial para o objeto continuar válido.

Exemplo:

```text
Produto não pode ter estoque negativo.
Pagamento estornado não pode ser confirmado novamente.
Contrato cancelado não pode ser ativado.
OS concluída não pode ser reagendada.
```

Uma validação pode acontecer na entrada.

Uma invariante precisa estar protegida no domínio.

---

## Por que invariantes importam

Sem invariantes, o sistema permite estados impossíveis.

Exemplo:

```text
pedido pago com total zero;
produto com estoque -15;
contrato ativo sem período;
OS concluída e reagendada ao mesmo tempo;
pagamento confirmado e estornado sem regra;
dinheiro com valor nulo;
status escrito como "PAGOO" por erro de digitação.
```

Estados impossíveis geram bugs difíceis.

Muitas vezes, o erro aparece longe do ponto onde o objeto foi quebrado.

A regra é:

```text
quanto mais cedo o domínio impedir estado inválido, mais fácil será manter o sistema.
```

---

## Invariante nasce no construtor

O construtor deve garantir que o objeto não nasça inválido.

Exemplo ruim:

```java
Pedido pedido = new Pedido();
pedido.setNumero(0);
pedido.setTotal(null);
pedido.setStatus(null);
```

Exemplo melhor:

```java
Pedido pedido = new Pedido(1001, Dinheiro.de("399.80"));
```

O construtor valida:

```text
número válido;
total obrigatório;
total positivo;
status inicial correto.
```

O objeto já nasce válido.

---

## Invariante continua nos métodos

Não basta validar no construtor.

Se depois um método puder quebrar a regra, a invariante falhou.

Exemplo:

```java
produto.reservarEstoque(100);
```

Se só existem 10 unidades, o produto não pode ficar com estoque negativo.

O método precisa proteger:

```text
quantidade maior que zero;
estoque suficiente;
estoque final não negativo.
```

Invariante precisa ser preservada em toda mudança de estado.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-133-invariantes-de-dominio
cd labs\m4\aula-133-invariantes-de-dominio
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula133
mkdir src\br\com\curso\aula133\app
mkdir src\br\com\curso\aula133\exemplo
mkdir src\br\com\curso\aula133\exemplo\ruim
mkdir src\br\com\curso\aula133\dominio
mkdir src\br\com\curso\aula133\dominio\valor
mkdir src\br\com\curso\aula133\dominio\pedido
mkdir src\br\com\curso\aula133\dominio\produto
mkdir src\br\com\curso\aula133\dominio\contrato
mkdir src\br\com\curso\aula133\dominio\ordemservico
```

Nesta aula, vamos comparar:

```text
objetos que permitem estado inválido;
objetos que protegem invariantes.
```

---

## Exemplo 1 — Pedido quebrando invariantes

Crie:

```text
src\br\com\curso\aula133\exemplo\ruim\PedidoInvarianteQuebradaApp.java
```

Código:

```java
package br.com.curso.aula133.exemplo.ruim;

import java.math.BigDecimal;

public class PedidoInvarianteQuebradaApp {
    public static void main(String[] args) {
        PedidoQuebrado pedido = new PedidoQuebrado();

        pedido.setNumero(0);
        pedido.setTotal(new BigDecimal("-100.00"));
        pedido.setStatus(null);

        System.out.println(pedido.resumo());
    }
}

enum StatusPedidoQuebrado {
    CRIADO,
    PAGO,
    CANCELADO
}

class PedidoQuebrado {
    private int numero;
    private BigDecimal total;
    private StatusPedidoQuebrado status;

    void setNumero(int numero) {
        this.numero = numero;
    }

    void setTotal(BigDecimal total) {
        this.total = total;
    }

    void setStatus(StatusPedidoQuebrado status) {
        this.status = status;
    }

    String resumo() {
        return "Pedido " + numero
                + " | Total: " + total
                + " | Status: " + status;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula133.exemplo.ruim.PedidoInvarianteQuebradaApp
```

---

## O que foi quebrado

O objeto permitiu:

```text
número zero;
total negativo;
status nulo.
```

Essas condições não deveriam existir em um pedido válido.

O problema não é apenas falta de validação no app.

O problema é que o objeto permite nascer ou ficar inválido.

Invariantes violadas:

```text
número do pedido deve ser maior que zero;
total do pedido deve ser positivo;
status do pedido deve sempre existir.
```

O objeto `PedidoQuebrado` não protege nada.

---

## Criando Dinheiro como objeto de valor

Vamos começar corrigindo o valor monetário.

Crie:

```text
src\br\com\curso\aula133\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula133.dominio.valor;

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

`Dinheiro` protege:

```text
valor não nulo;
escala monetária;
operações controladas.
```

A positividade pode ser exigida por quem usa o dinheiro.

Por exemplo, `Pedido` exige total positivo.

---

## Pedido protegendo invariantes

Crie:

```text
src\br\com\curso\aula133\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula133.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Agora crie:

```text
src\br\com\curso\aula133\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula133.dominio.pedido;

import br.com.curso.aula133.dominio.valor.Dinheiro;

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
            throw new IllegalArgumentException("Total do pedido deve ser positivo.");
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
src\br\com\curso\aula133\app\PedidoInvarianteApp.java
```

Código:

```java
package br.com.curso.aula133.app;

import br.com.curso.aula133.dominio.pedido.Pedido;
import br.com.curso.aula133.dominio.valor.Dinheiro;

public class PedidoInvarianteApp {
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
java -cp out br.com.curso.aula133.app.PedidoInvarianteApp
```

---

## Invariantes protegidas no Pedido

O construtor protege:

```text
número maior que zero;
total obrigatório;
total positivo;
status inicial CRIADO.
```

Os métodos protegem:

```text
só pedido criado pode confirmar pagamento;
valor pago precisa cobrir total;
pedido pago não pode ser cancelado por este fluxo;
pedido cancelado não pode ser cancelado novamente;
cancelamento exige motivo.
```

O objeto impede estados inválidos.

Isso é domínio mais forte.

---

## Exemplo 2 — Produto com estoque negativo

Agora veja uma invariante comum:

```text
estoque não pode ser negativo.
```

Crie:

```text
src\br\com\curso\aula133\exemplo\ruim\ProdutoEstoqueNegativoApp.java
```

Código:

```java
package br.com.curso.aula133.exemplo.ruim;

public class ProdutoEstoqueNegativoApp {
    public static void main(String[] args) {
        ProdutoEstoqueQuebrado produto = new ProdutoEstoqueQuebrado(
                "PROD-001",
                "Cadeira",
                10
        );

        produto.setEstoque(-50);

        System.out.println(produto.resumo());
    }
}

class ProdutoEstoqueQuebrado {
    private final String codigo;
    private final String nome;
    private int estoque;

    ProdutoEstoqueQuebrado(String codigo, String nome, int estoque) {
        this.codigo = codigo;
        this.nome = nome;
        this.estoque = estoque;
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
java -cp out br.com.curso.aula133.exemplo.ruim.ProdutoEstoqueNegativoApp
```

---

## Problema

O produto aceitou:

```text
estoque -50.
```

Isso não deveria acontecer.

A invariante é:

```text
estoque nunca pode ser negativo.
```

Isso precisa ser protegido:

```text
no construtor;
na reserva;
na reposição;
em qualquer alteração de estoque.
```

---

## Produto protegendo estoque

Crie:

```text
src\br\com\curso\aula133\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula133.dominio.produto;

import br.com.curso.aula133.dominio.valor.Dinheiro;

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
src\br\com\curso\aula133\app\ProdutoInvarianteApp.java
```

Código:

```java
package br.com.curso.aula133.app;

import br.com.curso.aula133.dominio.produto.Produto;
import br.com.curso.aula133.dominio.valor.Dinheiro;

public class ProdutoInvarianteApp {
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
java -cp out br.com.curso.aula133.app.ProdutoInvarianteApp
```

---

## Invariantes protegidas no Produto

O produto protege:

```text
código obrigatório;
código com prefixo PROD-;
nome obrigatório;
preço positivo;
estoque inicial não negativo;
reserva com quantidade positiva;
reserva somente com estoque suficiente;
reposição com quantidade positiva.
```

Não existe `setEstoque`.

Isso impede alguém de forçar um estoque inválido por fora.

---

## Exemplo 3 — Contrato com período inválido

Agora vamos proteger invariantes de contrato.

Crie:

```text
src\br\com\curso\aula133\exemplo\ruim\ContratoPeriodoInvalidoApp.java
```

Código:

```java
package br.com.curso.aula133.exemplo.ruim;

import java.time.LocalDate;

public class ContratoPeriodoInvalidoApp {
    public static void main(String[] args) {
        ContratoPeriodoQuebrado contrato = new ContratoPeriodoQuebrado();

        contrato.setCodigo("CONT-001");
        contrato.setInicio(LocalDate.of(2026, 12, 31));
        contrato.setFim(LocalDate.of(2026, 1, 1));

        System.out.println(contrato.resumo());
    }
}

class ContratoPeriodoQuebrado {
    private String codigo;
    private LocalDate inicio;
    private LocalDate fim;

    void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    void setInicio(LocalDate inicio) {
        this.inicio = inicio;
    }

    void setFim(LocalDate fim) {
        this.fim = fim;
    }

    String resumo() {
        return "Contrato " + codigo
                + " | Início: " + inicio
                + " | Fim: " + fim;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula133.exemplo.ruim.ContratoPeriodoInvalidoApp
```

---

## Problema

O contrato permitiu:

```text
fim antes do início.
```

A invariante é:

```text
período do contrato deve ter início e fim válidos;
fim não pode ser anterior ao início.
```

Essa regra não deveria ficar espalhada em vários apps.

Ela pertence ao conceito de período.

---

## PeriodoContrato

Crie:

```text
src\br\com\curso\aula133\dominio\contrato\PeriodoContrato.java
```

Código:

```java
package br.com.curso.aula133.dominio.contrato;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

public final class PeriodoContrato {
    private final LocalDate inicio;
    private final LocalDate fim;

    public PeriodoContrato(LocalDate inicio, LocalDate fim) {
        if (inicio == null) {
            throw new IllegalArgumentException("Início é obrigatório.");
        }

        if (fim == null) {
            throw new IllegalArgumentException("Fim é obrigatório.");
        }

        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException("Fim não pode ser anterior ao início.");
        }

        this.inicio = inicio;
        this.fim = fim;
    }

    public long quantidadeMeses() {
        long meses = ChronoUnit.MONTHS.between(inicio, fim.plusDays(1));

        if (meses <= 0) {
            return 1;
        }

        return meses;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        PeriodoContrato periodo = (PeriodoContrato) outro;
        return Objects.equals(inicio, periodo.inicio)
                && Objects.equals(fim, periodo.fim);
    }

    @Override
    public int hashCode() {
        return Objects.hash(inicio, fim);
    }

    @Override
    public String toString() {
        return inicio + " até " + fim;
    }
}
```

Agora a invariante do período está protegida em um objeto de valor.

---

## Contrato protegendo ciclo de vida

Crie:

```text
src\br\com\curso\aula133\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula133.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula133\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula133.dominio.contrato;

public class Contrato {
    private final String codigo;
    private final PeriodoContrato periodo;
    private StatusContrato status;
    private String motivoCancelamento;

    public Contrato(String codigo, PeriodoContrato periodo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("CONT-")) {
            throw new IllegalArgumentException("Código deve iniciar com CONT-.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.periodo = periodo;
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
                + " | Período: " + periodo
                + " | Meses: " + periodo.quantidadeMeses()
                + " | Status: " + status
                + " | Motivo: " + motivoCancelamento;
    }
}
```

Crie:

```text
src\br\com\curso\aula133\app\ContratoInvarianteApp.java
```

Código:

```java
package br.com.curso.aula133.app;

import br.com.curso.aula133.dominio.contrato.Contrato;
import br.com.curso.aula133.dominio.contrato.PeriodoContrato;

import java.time.LocalDate;

public class ContratoInvarianteApp {
    public static void main(String[] args) {
        PeriodoContrato periodo = new PeriodoContrato(
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        Contrato contrato = new Contrato(
                "CONT-001",
                periodo
        );

        contrato.ativar();

        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula133.app.ContratoInvarianteApp
```

---

## Invariantes protegidas no Contrato

`PeriodoContrato` protege:

```text
início obrigatório;
fim obrigatório;
fim não anterior ao início.
```

`Contrato` protege:

```text
código obrigatório;
código com prefixo CONT-;
período obrigatório;
status inicial RASCUNHO;
somente rascunho pode ativar;
cancelamento exige motivo;
contrato cancelado não cancela novamente.
```

As regras estão nos objetos certos.

---

## Exemplo 4 — Ordem de Serviço

Agora vamos aplicar invariantes em OS.

Invariantes típicas:

```text
código da OS deve ser válido;
período deve existir;
status deve ser controlado por enum;
quantidade de reagendamentos não pode ser negativa;
OS encerrada não pode ser reagendada;
novo período precisa ser diferente do atual;
cancelamento exige motivo;
OS concluída não pode ser cancelada.
```

---

## Código da OS

Crie:

```text
src\br\com\curso\aula133\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula133.dominio.ordemservico;

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
src\br\com\curso\aula133\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula133.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula133\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula133.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula133\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula133.dominio.ordemservico;

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
src\br\com\curso\aula133\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula133.dominio.ordemservico;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private PeriodoAtendimento periodo;
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
                + " | Cliente: " + cliente
                + " | Período: " + periodo
                + " | Status: " + status
                + " | Reagendamentos: " + quantidadeReagendamentos
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Crie:

```text
src\br\com\curso\aula133\app\OrdemServicoInvarianteApp.java
```

Código:

```java
package br.com.curso.aula133.app;

import br.com.curso.aula133.dominio.ordemservico.CodigoOs;
import br.com.curso.aula133.dominio.ordemservico.OrdemServico;
import br.com.curso.aula133.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula133.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoInvarianteApp {
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
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula133.app.OrdemServicoInvarianteApp
```

---

## Invariantes protegidas na OS

A OS protege:

```text
código obrigatório e válido;
cliente obrigatório;
período obrigatório;
status inicial AGENDADA;
reagendamento só se não estiver encerrada;
novo período obrigatório;
novo período diferente;
contador de reagendamentos controlado internamente;
cancelamento exige motivo;
OS concluída não cancela;
OS cancelada não conclui.
```

Não existe setter para:

```text
status;
quantidadeReagendamentos;
período;
motivoCancelamento.
```

O estado muda por operações de domínio.

---

## Invariante não deve depender só do app

Um erro comum é pensar:

```text
eu valido antes de chamar, então está tudo bem.
```

Exemplo:

```java
if (quantidade > 0 && produto.disponivel(quantidade)) {
    produto.reservarEstoque(quantidade);
}
```

Essa validação no app pode ser útil para melhorar mensagem ou fluxo.

Mas `reservarEstoque` ainda precisa validar internamente.

Por quê?

Porque outro código pode chamar:

```java
produto.reservarEstoque(-5);
```

ou:

```java
produto.reservarEstoque(999);
```

A invariante pertence ao objeto, não ao app.

---

## Invariante e exceções

Quando uma regra essencial é quebrada, lançar exceção é aceitável.

Exemplo:

```java
throw new IllegalArgumentException("Total do pedido deve ser positivo.");
```

ou:

```java
throw new IllegalStateException("OS encerrada não pode ser reagendada.");
```

Uma distinção prática:

```text
IllegalArgumentException
Quando o argumento recebido é inválido.

IllegalStateException
Quando o estado atual do objeto não permite a operação.
```

Exemplo:

```java
if (novoPeriodo == null) {
    throw new IllegalArgumentException("Novo período é obrigatório.");
}

if (encerrada()) {
    throw new IllegalStateException("OS encerrada não pode ser reagendada.");
}
```

Essa diferença melhora a leitura.

---

## Invariante e estados controlados

Use `enum` para estados controlados.

Ruim:

```java
private String status;
```

Permite:

```text
"PAGO";
"Pago";
"PAGOO";
"pago";
"qualquer coisa".
```

Melhor:

```java
private StatusPedido status;
```

Com:

```java
public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Isso protege parte da invariante:

```text
status só pode ser um dos valores previstos.
```

---

## Invariante e objetos de valor

Objetos de valor ajudam muito.

Exemplos:

```text
Dinheiro;
Email;
CodigoOs;
PeriodoAtendimento;
PeriodoContrato.
```

Eles evitam espalhar validações.

Sem objeto de valor:

```text
validar código da OS em vários lugares;
validar dinheiro em vários lugares;
validar período em vários lugares.
```

Com objeto de valor:

```text
CodigoOs protege código;
Dinheiro protege valor monetário;
PeriodoContrato protege datas;
PeriodoAtendimento protege data e turno.
```

Isso reduz duplicação e fortalece o domínio.

---

## Invariante e setters

Setters genéricos costumam quebrar invariantes.

Exemplo perigoso:

```java
setStatus(...)
setEstoque(...)
setQuantidadeReagendamentos(...)
setPeriodo(...)
setTotal(...)
```

Eles permitem alterar partes do estado sem respeitar a operação completa.

Prefira métodos com intenção:

```java
confirmarPagamento(...)
cancelar(...)
reservarEstoque(...)
reporEstoque(...)
reagendar(...)
ativar(...)
concluir(...)
```

Esses métodos protegem a operação inteira.

---

## Como descobrir invariantes

Pergunte:

```text
este objeto pode existir sem este dado?
este valor pode ser negativo?
este texto pode ser vazio?
este status pode ser qualquer coisa?
qual é o estado inicial correto?
quais transições são proibidas?
o que nunca pode acontecer?
qual combinação de campos é inválida?
qual regra precisa continuar verdadeira depois de qualquer método?
```

Exemplo para `Produto`:

```text
código obrigatório;
preço positivo;
estoque nunca negativo.
```

Exemplo para `Contrato`:

```text
período válido;
status inicial RASCUNHO;
cancelamento com motivo.
```

Exemplo para `OrdemServico`:

```text
código válido;
período obrigatório;
encerrada não reagenda.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido quebrado

Execute:

```text
PedidoInvarianteQuebradaApp.java
```

Liste as invariantes violadas.

### Parte 2 — Pedido protegido

Execute:

```text
PedidoInvarianteApp.java
```

Explique:

```text
quais invariantes o construtor protege;
quais invariantes confirmarPagamento protege;
quais invariantes cancelar protege.
```

### Parte 3 — Produto

Execute:

```text
ProdutoEstoqueNegativoApp.java
ProdutoInvarianteApp.java
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
ContratoPeriodoInvalidoApp.java
ContratoInvarianteApp.java
```

Explique:

```text
por que PeriodoContrato é melhor que inicio e fim soltos.
```

### Parte 5 — OS

Execute:

```text
OrdemServicoInvarianteApp.java
```

Explique:

```text
por que reagendar protege mais regras que setPeriodo.
```

---

## Desafio prático

Crie um domínio de `Pagamento` protegendo invariantes.

Estrutura sugerida:

```text
src\br\com\curso\aula133\apppagamento
src\br\com\curso\aula133\dominio\pagamento
```

Arquivos sugeridos:

```text
apppagamento\PagamentoInvarianteApp.java

dominio\pagamento\Pagamento.java
dominio\pagamento\CodigoPagamento.java
dominio\pagamento\StatusPagamento.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras:

```text
CodigoPagamento deve iniciar com PAG-.
Pagamento tem código, valor, status e motivoEstorno.
Valor precisa ser positivo.
StatusPagamento tem PENDENTE, CONFIRMADO, ESTORNADO.
Pagamento nasce PENDENTE.
Pagamento PENDENTE pode confirmar.
Pagamento CONFIRMADO pode estornar.
Pagamento ESTORNADO não pode confirmar novamente.
Pagamento PENDENTE não pode estornar.
Estorno exige motivo.
Motivo não pode ser vazio.
```

Evite:

```text
setStatus;
setValor;
setMotivoEstorno;
status como String;
código solto sem validação.
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
o objeto Pagamento nunca deve ficar em estado inválido.
```

---

## Erros comuns

### 1. Validar só no app

A validação externa pode existir, mas a invariante precisa estar no objeto.

### 2. Validar só no construtor

Métodos de alteração também precisam preservar invariantes.

### 3. Usar setters genéricos

Setters podem quebrar transições e combinações de estado.

### 4. Usar String para status

Use `enum`.

### 5. Espalhar validação de valor

Use objeto de valor quando a regra tiver significado próprio.

### 6. Confundir regra de tela com regra de domínio

Campo obrigatório na tela pode ser validação de entrada. Regra essencial do objeto é invariante.

### 7. Deixar contador ser alterado por fora

Contadores como reagendamentos devem ser controlados pelo método de domínio.

### 8. Permitir combinações impossíveis

Exemplo: contrato cancelado sem motivo, OS concluída e reagendada, estoque negativo.

---

## Debug recomendado

Use debug em:

```text
PedidoInvarianteQuebradaApp.java
PedidoInvarianteApp.java
ProdutoEstoqueNegativoApp.java
ProdutoInvarianteApp.java
ContratoPeriodoInvalidoApp.java
ContratoInvarianteApp.java
OrdemServicoInvarianteApp.java
```

Breakpoints recomendados:

```java
pedido.setNumero(0)
pedido.setTotal(...)
pedido.setStatus(null)

new Pedido(...)
pedido.confirmarPagamento(...)
pedido.cancelar(...)

produto.setEstoque(-50)
produto.reservarEstoque(...)
produto.reporEstoque(...)

new PeriodoContrato(...)
contrato.ativar()
contrato.cancelar(...)

new CodigoOs(...)
os.reagendar(...)
os.concluir()
```

Observe:

```text
onde o objeto ruim aceita estado inválido;
onde o objeto bom bloqueia estado inválido;
qual exceção é lançada;
qual regra fica no construtor;
qual regra fica no método;
como o estado continua consistente.
```

O objetivo é enxergar invariantes sendo protegidas.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é uma invariante de domínio?
2. Por que validar apenas no app não basta?
3. Qual invariante você protegeria em Pagamento?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar invariante de domínio;
diferenciar validação simples de invariante;
identificar estados impossíveis;
proteger invariantes no construtor;
proteger invariantes nos métodos;
usar IllegalArgumentException para argumento inválido;
usar IllegalStateException para estado incompatível;
evitar setters que quebram regra;
usar enum para status;
usar objetos de valor para código, dinheiro e período;
fortalecer Pedido, Produto, Contrato e OrdemServico;
resolver o desafio de Pagamento;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-133-invariantes-de-dominio
git commit -m "Aula 133: pratica invariantes de dominio"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
invariantes são regras que precisam permanecer verdadeiras durante toda a vida do objeto.
```

Você viu que um objeto forte não permite nascer inválido e também não permite ficar inválido depois de uma operação.

Também viu que construtores, métodos de domínio, enums e objetos de valor são ferramentas importantes para proteger invariantes.

Na próxima aula, vamos estudar serviços de domínio em uma visão inicial.

Vamos entender quando uma regra não cabe bem dentro de uma entidade ou objeto de valor e como criar uma classe de domínio para representar essa operação sem voltar para um service gigante e anêmico.
