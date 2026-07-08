# 135 — M4.31 — Factories simples

## Objetivo da aula

Nesta aula você vai aprender factories simples em Java.

Na aula anterior, você estudou serviços de domínio em uma visão inicial. Agora vamos estudar outro ponto importante da modelagem orientada a objetos:

```text
quando a criação de um objeto começa a ter regra suficiente para merecer um método ou classe de fábrica.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é uma factory;
diferenciar construtor comum de método de fábrica;
diferenciar static factory method de factory class;
entender quando usar factory;
entender quando não usar factory;
evitar construtores espalhados com regras repetidas;
centralizar criação com valores padrão;
criar objetos de domínio de forma mais expressiva;
modelar factories simples para Pedido, OrdemServico e Contrato;
não transformar factory em service gigante.
```

Essa aula é importante porque criar objetos parece simples no começo, mas em sistemas reais a criação pode envolver:

```text
valores padrão;
status inicial;
códigos;
períodos;
responsável inicial;
composição de objetos;
regras de criação;
objetos de valor obrigatórios.
```

Quando isso começa a se repetir, uma factory simples pode ajudar.

---

## A ideia central

Factory é uma forma de encapsular a criação de objetos.

Em vez de espalhar construções complexas pelo sistema, você cria um ponto mais claro para montar o objeto.

Exemplo sem factory:

```java
Pedido pedido = new Pedido(
        1001,
        cliente,
        Dinheiro.de("399.80"),
        StatusPedido.CRIADO,
        LocalDate.now()
);
```

Exemplo com factory:

```java
Pedido pedido = Pedido.novo(1001, cliente, Dinheiro.de("399.80"));
```

ou:

```java
Pedido pedido = pedidoFactory.criarNovoPedido(cliente, Dinheiro.de("399.80"));
```

A factory melhora quando:

```text
a criação tem regra;
a criação tem valores padrão;
a criação repete composição;
a criação precisa de nome mais expressivo que o construtor;
a criação precisa esconder detalhes que não interessam para quem chama.
```

---

## Factory não é obrigatória sempre

Não crie factory para tudo.

Se a criação é simples e clara, o construtor pode ser suficiente.

Exemplo aceitável:

```java
Cliente cliente = new Cliente(10, "Ana Silva");
```

Criar uma factory assim pode ser exagero:

```java
ClienteFactory factory = new ClienteFactory();
Cliente cliente = factory.criarCliente(10, "Ana Silva");
```

Se a factory não melhora clareza, não use.

A regra prática é:

```text
factory deve reduzir complexidade de criação, não aumentar.
```

---

## Tipos simples de factory

Nesta aula, vamos trabalhar com dois tipos:

```text
static factory method;
factory class.
```

### Static factory method

É um método estático dentro da própria classe.

Exemplo:

```java
Dinheiro.de("199.90")
Pedido.novo(...)
OrdemServico.agendada(...)
Contrato.rascunho(...)
```

Ele é útil quando a criação pertence claramente à própria classe.

### Factory class

É uma classe separada responsável por criar objetos.

Exemplo:

```java
PedidoFactory
OrdemServicoFactory
ContratoFactory
```

Ela é útil quando a criação envolve mais composição, sequência, geração simples ou variações.

---

## Factory não substitui domínio

Factory cria objetos.

Ela não deve virar o lugar onde todas as regras de negócio ficam.

Ruim:

```text
PedidoFactory.confirmarPagamento(...)
PedidoFactory.cancelarPedido(...)
PedidoFactory.reagendarOs(...)
PedidoFactory.enviarEmail(...)
```

Melhor:

```text
PedidoFactory cria Pedido.
Pedido confirma pagamento.
OrdemServico reagenda.
Contrato ativa.
```

Factory não deve roubar comportamento da entidade.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-135-factories-simples
cd labs\m4\aula-135-factories-simples
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula135
mkdir src\br\com\curso\aula135\app
mkdir src\br\com\curso\aula135\exemplo
mkdir src\br\com\curso\aula135\exemplo\ruim
mkdir src\br\com\curso\aula135\dominio
mkdir src\br\com\curso\aula135\dominio\valor
mkdir src\br\com\curso\aula135\dominio\cliente
mkdir src\br\com\curso\aula135\dominio\pedido
mkdir src\br\com\curso\aula135\dominio\ordemservico
mkdir src\br\com\curso\aula135\dominio\contrato
mkdir src\br\com\curso\aula135\dominio\servico
```

Nesta aula, vamos criar:

```text
um exemplo ruim com criação espalhada;
um objeto de valor com static factory;
uma entidade Pedido com static factory;
uma classe PedidoFactory;
uma OrdemServicoFactory;
uma ContratoFactory.
```

---

## Exemplo 1 — Criação espalhada e repetida

Crie:

```text
src\br\com\curso\aula135\exemplo\ruim\CriacaoEspalhadaApp.java
```

Código:

```java
package br.com.curso.aula135.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public class CriacaoEspalhadaApp {
    public static void main(String[] args) {
        PedidoCriacaoEspalhada pedido1 = new PedidoCriacaoEspalhada(
                1001,
                "Ana Silva",
                new BigDecimal("399.80").setScale(2, RoundingMode.HALF_UP),
                "CRIADO",
                LocalDate.now()
        );

        PedidoCriacaoEspalhada pedido2 = new PedidoCriacaoEspalhada(
                1002,
                "Carlos Souza",
                new BigDecimal("150.00").setScale(2, RoundingMode.HALF_UP),
                "CRIADO",
                LocalDate.now()
        );

        System.out.println(pedido1.resumo());
        System.out.println(pedido2.resumo());
    }
}

class PedidoCriacaoEspalhada {
    private final int numero;
    private final String cliente;
    private final BigDecimal total;
    private final String status;
    private final LocalDate dataCriacao;

    PedidoCriacaoEspalhada(
            int numero,
            String cliente,
            BigDecimal total,
            String status,
            LocalDate dataCriacao
    ) {
        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = status;
        this.dataCriacao = dataCriacao;
    }

    String resumo() {
        return "Pedido " + numero
                + " | Cliente: " + cliente
                + " | Total: R$ " + total
                + " | Status: " + status
                + " | Criado em: " + dataCriacao;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula135.exemplo.ruim.CriacaoEspalhadaApp
```

---

## O problema do exemplo

O app precisa saber detalhes demais da criação:

```text
status inicial é CRIADO;
data de criação é hoje;
BigDecimal precisa de escala;
status é String;
todos os campos precisam ser passados manualmente.
```

Se em outro lugar alguém criar com:

```java
"criado"
```

ou:

```java
"PENDENTE"
```

ou esquecer a escala do dinheiro, o objeto pode nascer inconsistente.

A criação está espalhada.

Factory pode ajudar a centralizar isso.

---

## Static factory em objeto de valor

Vamos começar por um objeto de valor.

Crie:

```text
src\br\com\curso\aula135\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula135.dominio.valor;

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

Aqui temos static factories:

```java
Dinheiro.de("399.80")
Dinheiro.zero()
```

O construtor é privado.

Isso força a criação pelo método de fábrica.

---

## Por que Dinheiro.de é melhor que new Dinheiro

Com static factory:

```java
Dinheiro total = Dinheiro.de("399.80");
```

A criação fica expressiva.

O objeto controla:

```text
conversão de texto;
validação de nulo;
BigDecimal;
escala monetária.
```

Quem usa não precisa saber desses detalhes.

Isso é uma factory simples e útil.

---

## Static factory em Pedido

Agora vamos criar `Pedido` com um método estático de criação.

Crie:

```text
src\br\com\curso\aula135\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula135.dominio.cliente;

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

Crie:

```text
src\br\com\curso\aula135\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula135.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula135\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula135.dominio.pedido;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.valor.Dinheiro;

import java.time.LocalDate;

public class Pedido {
    private final int numero;
    private final Cliente cliente;
    private final Dinheiro total;
    private final LocalDate dataCriacao;
    private StatusPedido status;
    private String motivoCancelamento;

    private Pedido(int numero, Cliente cliente, Dinheiro total, LocalDate dataCriacao) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Pedido não pode ser criado para cliente inativo.");
        }

        if (total == null || !total.positivo()) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        if (dataCriacao == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.dataCriacao = dataCriacao;
        this.status = StatusPedido.CRIADO;
        this.motivoCancelamento = "";
    }

    public static Pedido novo(int numero, Cliente cliente, Dinheiro total) {
        return new Pedido(
                numero,
                cliente,
                total,
                LocalDate.now()
        );
    }

    public static Pedido importado(int numero, Cliente cliente, Dinheiro total, LocalDate dataCriacao) {
        return new Pedido(
                numero,
                cliente,
                total,
                dataCriacao
        );
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
                + " | Cliente: " + cliente.resumo()
                + " | Total: " + total
                + " | Criado em: " + dataCriacao
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

---

## Análise do Pedido

O construtor é privado:

```java
private Pedido(...)
```

A criação pública acontece por:

```java
public static Pedido novo(...)
public static Pedido importado(...)
```

Agora temos nomes claros:

```text
novo: pedido criado agora;
importado: pedido vindo de uma origem com data própria.
```

A factory method deixa a intenção mais expressiva que um construtor cheio de parâmetros.

---

## App usando Pedido.novo

Crie:

```text
src\br\com\curso\aula135\app\PedidoStaticFactoryApp.java
```

Código:

```java
package br.com.curso.aula135.app;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.pedido.Pedido;
import br.com.curso.aula135.dominio.valor.Dinheiro;

public class PedidoStaticFactoryApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva"
        );

        Pedido pedido = Pedido.novo(
                1001,
                cliente,
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
java -cp out br.com.curso.aula135.app.PedidoStaticFactoryApp
```

---

## O que melhorou

Antes, quem criava precisava saber:

```text
status inicial;
data de criação;
construtor completo;
ordem de parâmetros.
```

Agora:

```java
Pedido.novo(...)
```

já comunica a intenção.

O pedido continua protegendo seu ciclo de vida.

A factory method apenas melhora a criação.

---

## Quando usar static factory method

Use quando:

```text
o nome da criação melhora a leitura;
existem formas diferentes de criar o mesmo objeto;
há valores padrão;
o construtor ficaria confuso;
você quer controlar a criação;
o objeto de valor precisa validar e normalizar entrada.
```

Exemplos bons:

```java
Dinheiro.de("199.90");
Dinheiro.zero();
Pedido.novo(...);
Pedido.importado(...);
Contrato.rascunho(...);
OrdemServico.agendada(...);
```

---

## Quando não usar static factory

Evite quando:

```text
a criação é simples;
o nome não agrega nada;
a factory só repete o construtor;
a classe fica cheia de métodos estáticos sem critério.
```

Exemplo exagerado:

```java
Cliente.criarClienteComIdENome(10, "Ana");
```

Se o construtor já é claro:

```java
new Cliente(10, "Ana");
```

pode ser suficiente.

---

## Factory class

Agora vamos criar uma classe separada de fábrica.

Quando pode fazer sentido?

```text
quando a criação envolve sequência;
quando precisa gerar número simples;
quando cria variações;
quando monta objetos compostos;
quando queremos não deixar o app saber detalhes de montagem.
```

Nesta aula, faremos uma factory simples com contador em memória apenas para estudo.

Em sistemas reais, geração de número pode vir de banco, sequence, UUID ou outro mecanismo. Isso será tratado em módulos futuros.

---

## PedidoFactory

Crie:

```text
src\br\com\curso\aula135\dominio\pedido\PedidoFactory.java
```

Código:

```java
package br.com.curso.aula135.dominio.pedido;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.valor.Dinheiro;

public class PedidoFactory {
    private int proximoNumero;

    public PedidoFactory(int numeroInicial) {
        if (numeroInicial <= 0) {
            throw new IllegalArgumentException("Número inicial deve ser maior que zero.");
        }

        this.proximoNumero = numeroInicial;
    }

    public Pedido criarNovoPedido(Cliente cliente, Dinheiro total) {
        Pedido pedido = Pedido.novo(
                proximoNumero,
                cliente,
                total
        );

        proximoNumero++;

        return pedido;
    }
}
```

Essa factory cuida de:

```text
gerar número simples;
chamar Pedido.novo;
incrementar o próximo número.
```

Ela não confirma pagamento.

Ela não cancela pedido.

Ela só cria.

---

## App usando PedidoFactory

Crie:

```text
src\br\com\curso\aula135\app\PedidoFactoryApp.java
```

Código:

```java
package br.com.curso.aula135.app;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.pedido.Pedido;
import br.com.curso.aula135.dominio.pedido.PedidoFactory;
import br.com.curso.aula135.dominio.valor.Dinheiro;

public class PedidoFactoryApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva"
        );

        PedidoFactory factory = new PedidoFactory(1001);

        Pedido pedido1 = factory.criarNovoPedido(
                cliente,
                Dinheiro.de("399.80")
        );

        Pedido pedido2 = factory.criarNovoPedido(
                cliente,
                Dinheiro.de("150.00")
        );

        System.out.println(pedido1.resumo());
        System.out.println(pedido2.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula135.app.PedidoFactoryApp
```

---

## Cuidado com factory com estado

`PedidoFactory` tem estado:

```java
private int proximoNumero;
```

Para estudo, isso é aceitável.

Mas em backend real, gerar número assim em memória pode dar problema com:

```text
concorrência;
múltiplas instâncias;
reinício da aplicação;
banco de dados;
ambiente distribuído.
```

Por enquanto, entenda o conceito.

Mais adiante, geração de identidade será discutida junto com persistência e arquitetura.

---

## Factory simples para OrdemServico

Agora vamos criar uma factory para OS.

A criação de OS pode ter valores padrão:

```text
status inicial AGENDADA;
contador de reagendamento zero;
código padronizado;
período obrigatório;
cliente obrigatório.
```

Vamos modelar.

Crie:

```text
src\br\com\curso\aula135\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula135.dominio.ordemservico;

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

    public static CodigoOs deNumero(int numero) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número da OS deve ser maior que zero.");
        }

        return new CodigoOs(PREFIXO + "2026-" + String.format("%04d", numero));
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

Aqui `CodigoOs.deNumero(...)` é uma static factory.

---

## Turno, Status e Período

Crie:

```text
src\br\com\curso\aula135\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula135.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula135\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula135.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula135\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula135.dominio.ordemservico;

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

## OrdemServico

Crie:

```text
src\br\com\curso\aula135\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula135.dominio.ordemservico;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private PeriodoAtendimento periodo;
    private StatusOs status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;

    private OrdemServico(CodigoOs codigo, String cliente, PeriodoAtendimento periodo) {
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

    public static OrdemServico agendada(CodigoOs codigo, String cliente, PeriodoAtendimento periodo) {
        return new OrdemServico(codigo, cliente, periodo);
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

---

## OrdemServicoFactory

Crie:

```text
src\br\com\curso\aula135\dominio\ordemservico\OrdemServicoFactory.java
```

Código:

```java
package br.com.curso.aula135.dominio.ordemservico;

public class OrdemServicoFactory {
    private int proximoNumero;

    public OrdemServicoFactory(int numeroInicial) {
        if (numeroInicial <= 0) {
            throw new IllegalArgumentException("Número inicial deve ser maior que zero.");
        }

        this.proximoNumero = numeroInicial;
    }

    public OrdemServico criarAgendada(String cliente, PeriodoAtendimento periodo) {
        CodigoOs codigo = CodigoOs.deNumero(proximoNumero);
        proximoNumero++;

        return OrdemServico.agendada(
                codigo,
                cliente,
                periodo
        );
    }
}
```

A factory cria:

```text
código da OS;
OS agendada;
incrementa próximo número.
```

Ela não reagenda, não conclui e não cancela.

---

## App usando OrdemServicoFactory

Crie:

```text
src\br\com\curso\aula135\app\OrdemServicoFactoryApp.java
```

Código:

```java
package br.com.curso.aula135.app;

import br.com.curso.aula135.dominio.ordemservico.OrdemServico;
import br.com.curso.aula135.dominio.ordemservico.OrdemServicoFactory;
import br.com.curso.aula135.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula135.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoFactoryApp {
    public static void main(String[] args) {
        OrdemServicoFactory factory = new OrdemServicoFactory(1);

        OrdemServico os1 = factory.criarAgendada(
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        OrdemServico os2 = factory.criarAgendada(
                "Carlos Souza",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(2),
                        TurnoAtendimento.TARDE
                )
        );

        System.out.println(os1.resumo());
        System.out.println(os2.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula135.app.OrdemServicoFactoryApp
```

---

## Factory para Contrato

Agora vamos criar um exemplo de contrato.

Crie:

```text
src\br\com\curso\aula135\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula135.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula135\dominio\contrato\PeriodoContrato.java
```

Código:

```java
package br.com.curso.aula135.dominio.contrato;

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

Crie:

```text
src\br\com\curso\aula135\dominio\servico\ServicoContratado.java
```

Código:

```java
package br.com.curso.aula135.dominio.servico;

import br.com.curso.aula135.dominio.valor.Dinheiro;

public class ServicoContratado {
    private final String nome;
    private final Dinheiro valorMensal;

    public ServicoContratado(String nome, Dinheiro valorMensal) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do serviço é obrigatório.");
        }

        if (valorMensal == null || !valorMensal.positivo()) {
            throw new IllegalArgumentException("Valor mensal deve ser positivo.");
        }

        this.nome = nome;
        this.valorMensal = valorMensal;
    }

    public Dinheiro valorMensal() {
        return valorMensal;
    }

    public String resumo() {
        return nome + " | Valor mensal: " + valorMensal;
    }
}
```

---

## Contrato

Crie:

```text
src\br\com\curso\aula135\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula135.dominio.contrato;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.servico.ServicoContratado;
import br.com.curso.aula135.dominio.valor.Dinheiro;

public class Contrato {
    private final String codigo;
    private final Cliente cliente;
    private final ServicoContratado servico;
    private final PeriodoContrato periodo;
    private StatusContrato status;
    private String motivoCancelamento;

    private Contrato(
            String codigo,
            Cliente cliente,
            ServicoContratado servico,
            PeriodoContrato periodo
    ) {
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

        if (servico == null) {
            throw new IllegalArgumentException("Serviço é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.servico = servico;
        this.periodo = periodo;
        this.status = StatusContrato.RASCUNHO;
        this.motivoCancelamento = "";
    }

    public static Contrato rascunho(
            String codigo,
            Cliente cliente,
            ServicoContratado servico,
            PeriodoContrato periodo
    ) {
        return new Contrato(
                codigo,
                cliente,
                servico,
                periodo
        );
    }

    public void ativar() {
        if (status != StatusContrato.RASCUNHO) {
            throw new IllegalStateException("Somente contrato em rascunho pode ser ativado.");
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

    public Dinheiro valorTotal() {
        Dinheiro total = Dinheiro.zero();

        for (int mes = 0; mes < periodo.quantidadeMeses(); mes++) {
            total = total.somar(servico.valorMensal());
        }

        return total;
    }

    public String resumo() {
        return "Contrato " + codigo
                + " | Cliente: " + cliente.resumo()
                + " | Serviço: " + servico.resumo()
                + " | Período: " + periodo
                + " | Valor total: " + valorTotal()
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

---

## ContratoFactory

Crie:

```text
src\br\com\curso\aula135\dominio\contrato\ContratoFactory.java
```

Código:

```java
package br.com.curso.aula135.dominio.contrato;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.servico.ServicoContratado;

public class ContratoFactory {
    private int proximoNumero;

    public ContratoFactory(int numeroInicial) {
        if (numeroInicial <= 0) {
            throw new IllegalArgumentException("Número inicial deve ser maior que zero.");
        }

        this.proximoNumero = numeroInicial;
    }

    public Contrato criarRascunho(
            Cliente cliente,
            ServicoContratado servico,
            PeriodoContrato periodo
    ) {
        String codigo = "CONT-" + String.format("%04d", proximoNumero);
        proximoNumero++;

        return Contrato.rascunho(
                codigo,
                cliente,
                servico,
                periodo
        );
    }
}
```

---

## App usando ContratoFactory

Crie:

```text
src\br\com\curso\aula135\app\ContratoFactoryApp.java
```

Código:

```java
package br.com.curso.aula135.app;

import br.com.curso.aula135.dominio.cliente.Cliente;
import br.com.curso.aula135.dominio.contrato.Contrato;
import br.com.curso.aula135.dominio.contrato.ContratoFactory;
import br.com.curso.aula135.dominio.contrato.PeriodoContrato;
import br.com.curso.aula135.dominio.servico.ServicoContratado;
import br.com.curso.aula135.dominio.valor.Dinheiro;

import java.time.LocalDate;

public class ContratoFactoryApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                20,
                "Cliente Corporativo A"
        );

        ServicoContratado servico = new ServicoContratado(
                "Instalação",
                Dinheiro.de("150.00")
        );

        PeriodoContrato periodo = new PeriodoContrato(
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        ContratoFactory factory = new ContratoFactory(1);

        Contrato contrato = factory.criarRascunho(
                cliente,
                servico,
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
java -cp out br.com.curso.aula135.app.ContratoFactoryApp
```

---

## O que a factory melhorou

O app não precisou montar o código manualmente:

```java
"CONT-0001"
```

Ele chamou:

```java
factory.criarRascunho(...)
```

O nome comunica:

```text
estou criando um contrato em rascunho.
```

A entidade ainda protege:

```text
cliente ativo;
serviço obrigatório;
período obrigatório;
status inicial;
ativação.
```

A factory cria.

A entidade protege regra.

---

## Factory e construtor privado

Quando você usa factory method, pode deixar construtor privado.

Exemplo:

```java
private Pedido(...)
public static Pedido novo(...)
```

Isso força todo mundo a usar a criação nomeada.

Mas nem sempre é obrigatório.

Você pode ter:

```java
public Contrato(...)
```

e também uma factory separada.

A decisão depende do quanto você quer controlar a criação.

Nesta fase, pratique ambos:

```text
static factory com construtor privado;
factory class usando static factory;
construtor público quando criação é simples.
```

---

## Factory e validação

Factory pode validar argumentos de criação.

Mas as invariantes principais ainda devem ficar dentro do objeto.

Exemplo:

```java
public Pedido criarNovoPedido(Cliente cliente, Dinheiro total) {
    return Pedido.novo(proximoNumero, cliente, total);
}
```

Mesmo que a factory valide algo, `Pedido` ainda deve validar:

```text
cliente obrigatório;
cliente ativo;
total positivo.
```

Por quê?

Porque alguém pode criar `Pedido` por outro caminho permitido.

Regra prática:

```text
factory ajuda a criar;
objeto protege sua validade.
```

---

## Factory e infraestrutura

Nesta aula, as factories são puras.

Elas não acessam banco, HTTP, arquivo ou framework.

Mais adiante, no backend real, criação pode envolver persistência, repositories ou casos de uso.

Por enquanto, mantenha a factory simples:

```text
montar objeto;
aplicar padrão de criação;
gerar valor simples de estudo;
esconder detalhes de construção.
```

Não coloque:

```text
salvar no banco;
enviar e-mail;
consultar API;
abrir conexão;
montar JSON.
```

em factory de domínio.

---

## Factory versus serviço de domínio

Factory cria objetos.

Serviço de domínio calcula ou executa regra de domínio que não pertence a uma única entidade.

Exemplo de factory:

```java
PedidoFactory.criarNovoPedido(...)
```

Exemplo de serviço de domínio:

```java
PoliticaDescontoPedido.calcularDesconto(...)
```

Pergunta útil:

```text
essa classe está criando objeto ou aplicando uma regra entre objetos?
```

Se cria, pode ser factory.

Se calcula política de negócio entre objetos, pode ser serviço de domínio.

---

## Factory versus builder

Builder é outro padrão de criação.

Ele ajuda quando um objeto tem muitos parâmetros opcionais ou uma construção passo a passo.

Exemplo futuro:

```java
ContratoBuilder
        .paraCliente(cliente)
        .comServico(servico)
        .noPeriodo(periodo)
        .criar();
```

Nesta aula, não vamos usar builder ainda.

Por enquanto, factories simples são suficientes.

Na próxima aula, vamos estudar builder inicial.

---

## Quando usar factory

Use factory quando:

```text
a criação tem nome de negócio;
existem valores padrão;
existem formas diferentes de criar;
a construção está se repetindo;
há composição de objetos;
o construtor está ficando confuso;
o app está sabendo detalhes demais;
a criação precisa ser centralizada.
```

Exemplos:

```text
Pedido.novo;
Pedido.importado;
OrdemServico.agendada;
Contrato.rascunho;
Dinheiro.de;
CodigoOs.deNumero;
PedidoFactory.criarNovoPedido;
ContratoFactory.criarRascunho.
```

---

## Quando evitar factory

Evite factory quando:

```text
a criação é simples;
a factory só chama new sem acrescentar clareza;
o nome é genérico;
a factory vira service;
a factory começa a ter regra de ciclo de vida;
a factory acessa infraestrutura sem necessidade;
a factory deixa o código mais difícil de entender.
```

Exemplo exagerado:

```java
ClienteFactory factory = new ClienteFactory();
Cliente cliente = factory.criar(10, "Ana");
```

Se `new Cliente(10, "Ana")` já é claro, não precisa complicar.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criação espalhada

Execute:

```text
CriacaoEspalhadaApp.java
```

Explique:

```text
quais detalhes de criação estão espalhados;
qual risco existe com status como String;
por que BigDecimal direto aumenta repetição.
```

### Parte 2 — Dinheiro

Analise:

```text
Dinheiro.de(...);
Dinheiro.zero();
```

Explique:

```text
por que são static factories úteis.
```

### Parte 3 — Pedido.novo

Execute:

```text
PedidoStaticFactoryApp.java
```

Explique:

```text
por que Pedido.novo melhora a leitura;
por que Pedido.importado teria outro significado.
```

### Parte 4 — PedidoFactory

Execute:

```text
PedidoFactoryApp.java
```

Explique:

```text
o que a factory faz;
o que a factory não deve fazer;
qual cuidado existe com contador em memória.
```

### Parte 5 — OS e Contrato

Execute:

```text
OrdemServicoFactoryApp.java
ContratoFactoryApp.java
```

Explique:

```text
quais detalhes de criação foram centralizados;
quais regras continuam nas entidades.
```

---

## Desafio prático

Crie uma factory simples para `Pagamento`.

Estrutura sugerida:

```text
src\br\com\curso\aula135\apppagamento
src\br\com\curso\aula135\dominio\pagamento
```

Arquivos sugeridos:

```text
apppagamento\PagamentoFactoryApp.java

dominio\pagamento\CodigoPagamento.java
dominio\pagamento\StatusPagamento.java
dominio\pagamento\Pagamento.java
dominio\pagamento\PagamentoFactory.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras:

```text
CodigoPagamento deve iniciar com PAG-.
CodigoPagamento deve ter static factory deNumero(int numero).
Pagamento nasce PENDENTE.
Pagamento tem código, valor, status e motivoEstorno.
Valor precisa ser positivo.
Pagamento pode confirmar.
Pagamento pode estornar se estiver confirmado.
Estorno exige motivo.
PagamentoFactory recebe número inicial.
PagamentoFactory cria pagamentos pendentes com código sequencial.
```

Evite:

```text
setStatus;
status como String;
factory confirmando pagamento;
factory estornando pagamento;
factory salvando no banco.
```

Uso esperado:

```java
PagamentoFactory factory = new PagamentoFactory(1);

Pagamento pagamento = factory.criarPendente(Dinheiro.de("250.00"));

pagamento.confirmar();
pagamento.estornar("Solicitação do cliente");

System.out.println(pagamento.resumo());
```

Critério principal:

```text
factory cria;
pagamento protege o ciclo de vida.
```

---

## Erros comuns

### 1. Criar factory sem necessidade

Se o construtor já é claro, não complique.

### 2. Factory virar service gigante

Factory cria objetos. Não deve concentrar todas as regras.

### 3. Factory roubar comportamento da entidade

Confirmação, cancelamento, reagendamento e ativação pertencem às entidades.

### 4. Esquecer validação no objeto

Mesmo com factory, o objeto deve proteger suas invariantes.

### 5. Usar status como String na criação

Use `enum`.

### 6. Gerar identidade em memória sem entender risco

Nesta aula é didático. Em backend real, identidade precisa de estratégia adequada.

### 7. Criar nomes genéricos

Prefira `criarRascunho`, `criarAgendada`, `criarNovoPedido`.

Evite `criar`, `montar`, `processar` quando o contexto não estiver claro.

### 8. Misturar factory com infraestrutura

Não coloque banco, HTTP, e-mail ou arquivo na factory de domínio desta fase.

---

## Debug recomendado

Use debug em:

```text
CriacaoEspalhadaApp.java
PedidoStaticFactoryApp.java
PedidoFactoryApp.java
OrdemServicoFactoryApp.java
ContratoFactoryApp.java
```

Breakpoints recomendados:

```java
Dinheiro.de(...)
Pedido.novo(...)
Pedido.importado(...)
new Pedido(...)
factory.criarNovoPedido(...)
CodigoOs.deNumero(...)
OrdemServico.agendada(...)
factory.criarAgendada(...)
Contrato.rascunho(...)
factory.criarRascunho(...)
```

Observe:

```text
onde a criação acontece;
quais valores padrão são definidos;
qual método tem nome de negócio;
o que a factory esconde;
o que continua sendo validado dentro da entidade;
quando o app fica mais simples.
```

O objetivo é enxergar factory como ferramenta de criação, não como depósito de regra.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é uma factory?
2. Qual diferença entre static factory method e factory class?
3. Quando você usaria uma factory para Ordem de Serviço?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar factory simples;
usar static factory method;
usar factory class;
decidir quando usar construtor direto;
decidir quando usar factory;
centralizar criação com valores padrão;
evitar criação espalhada;
não transformar factory em service gigante;
manter comportamento nas entidades;
manter invariantes dentro dos objetos;
criar PedidoFactory, OrdemServicoFactory e ContratoFactory;
resolver o desafio de PagamentoFactory;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-135-factories-simples
git commit -m "Aula 135: pratica factories simples"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
factory encapsula criação de objetos quando a construção começa a ter regra, nome de negócio, valores padrão ou repetição.
```

Você viu que factories podem melhorar a clareza, mas também podem ser exagero se usadas sem necessidade.

Também viu que factory cria, mas entidade continua protegendo comportamento e invariantes.

Na próxima aula, vamos estudar builder inicial.

Vamos entender quando um objeto tem muitos dados de criação e como montar esse objeto de forma legível sem criar construtores enormes e confusos.
