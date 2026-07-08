# 136 — M4.32 — Builder inicial

## Objetivo da aula

Nesta aula você vai aprender o padrão Builder em uma visão inicial.

Na aula anterior, você estudou factories simples e viu como centralizar a criação de objetos quando a construção começa a ter regra, valores padrão ou nomes de negócio. Agora vamos estudar outro problema comum:

```text
e quando um objeto precisa de muitos dados para ser criado?
```

Ao final da aula, você deve conseguir:

```text
explicar o que é Builder;
entender quando um construtor fica confuso;
entender quando Builder melhora a leitura;
diferenciar Builder de construtor;
diferenciar Builder de factory;
evitar setters públicos como substituto de Builder;
criar um Builder simples separado;
validar obrigatórios no build;
manter invariantes no objeto final;
usar Builder para Contrato, OrdemServico e Pedido;
evitar Builder desnecessário.
```

Essa aula é inicial.

Não vamos transformar o Builder em arquitetura complexa.

A ideia é aprender o padrão de forma prática e segura.

---

## A ideia central

Builder é uma forma de construir objetos passo a passo, com leitura mais clara.

Em vez de criar um objeto assim:

```java
Contrato contrato = new Contrato(
        "CONT-001",
        cliente,
        servico,
        periodo,
        "Observação comercial",
        true,
        false,
        "SISTEMA"
);
```

podemos criar assim:

```java
Contrato contrato = new ContratoBuilder()
        .codigo("CONT-001")
        .cliente(cliente)
        .servico(servico)
        .periodo(periodo)
        .observacao("Observação comercial")
        .notificacaoAtiva(true)
        .origem("SISTEMA")
        .build();
```

O Builder deixa claro o significado de cada valor.

Ele ajuda quando há:

```text
muitos parâmetros;
parâmetros opcionais;
parâmetros do mesmo tipo;
booleans confusos;
construtores muito longos;
combinações de criação difíceis de ler.
```

---

## Problema: construtor com muitos parâmetros

Construtor com muitos parâmetros pode ficar perigoso.

Exemplo:

```java
new Contrato("CONT-001", cliente, servico, periodo, true, false, "SISTEMA");
```

O que significa `true`?

O que significa `false`?

Qual String é código e qual String é origem?

A ordem está correta?

Esse tipo de construção é fácil de errar.

O Builder ajuda porque nomeia cada informação.

---

## Builder não é setter disfarçado

Builder tem métodos parecidos com setters, mas a intenção é diferente.

Setter público altera um objeto já criado:

```java
contrato.setStatus(StatusContrato.ATIVO);
contrato.setCodigo("CONT-001");
```

Builder monta um objeto antes dele existir:

```java
Contrato contrato = new ContratoBuilder()
        .codigo("CONT-001")
        .cliente(cliente)
        .build();
```

Depois que o objeto nasce, ele deve continuar protegendo suas regras.

Builder não é desculpa para criar objeto fraco.

A regra é:

```text
Builder ajuda na criação;
o objeto final ainda protege suas invariantes.
```

---

## Builder não substitui entidade

Builder não deve confirmar pagamento, cancelar contrato ou reagendar OS.

Ruim:

```java
builder.cancelarContrato("motivo");
builder.confirmarPagamento();
builder.reagendarOs(periodo);
```

Melhor:

```java
Contrato contrato = builder.build();
contrato.ativar();
contrato.cancelar("motivo");
```

O Builder cria.

A entidade executa comportamento de domínio.

---

## Builder versus Factory

Factory normalmente cria o objeto a partir de uma operação nomeada.

Exemplo:

```java
Pedido.novo(...)
Contrato.rascunho(...)
OrdemServico.agendada(...)
```

Builder é melhor quando a criação tem muitos dados configuráveis.

Exemplo:

```java
new ContratoBuilder()
        .codigo("CONT-001")
        .cliente(cliente)
        .servico(servico)
        .periodo(periodo)
        .observacao("Contrato anual")
        .origem("PORTAL")
        .build();
```

Pergunta útil:

```text
a criação é uma operação nomeada simples?
```

Talvez factory.

```text
a criação tem muitos campos e opcionais?
```

Talvez builder.

---

## Quando usar Builder

Use Builder quando:

```text
o construtor tem muitos parâmetros;
existem parâmetros opcionais;
há muitos parâmetros do mesmo tipo;
há booleanos difíceis de entender;
há combinações de criação;
a leitura do new ficou ruim;
o objeto precisa nascer consistente;
você quer deixar a montagem mais expressiva.
```

Exemplos bons:

```text
Contrato com cliente, serviço, período, observação, origem e flags;
OrdemServico com cliente, período, prioridade, observação e canal;
Pedido com vários itens iniciais, cupom, origem e observação.
```

---

## Quando não usar Builder

Evite Builder quando:

```text
o objeto tem poucos campos;
o construtor já é claro;
a factory simples resolve melhor;
o Builder só repete o construtor;
a classe fica mais complexa sem necessidade.
```

Exemplo onde Builder pode ser exagero:

```java
Cliente cliente = new Cliente(10, "Ana Silva");
```

Criar:

```java
new ClienteBuilder().id(10).nome("Ana Silva").build();
```

pode ser desnecessário.

Builder deve melhorar o código, não enfeitar.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-136-builder-inicial
cd labs\m4\aula-136-builder-inicial
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula136
mkdir src\br\com\curso\aula136\app
mkdir src\br\com\curso\aula136\exemplo
mkdir src\br\com\curso\aula136\exemplo\ruim
mkdir src\br\com\curso\aula136\dominio
mkdir src\br\com\curso\aula136\dominio\valor
mkdir src\br\com\curso\aula136\dominio\cliente
mkdir src\br\com\curso\aula136\dominio\servico
mkdir src\br\com\curso\aula136\dominio\contrato
mkdir src\br\com\curso\aula136\dominio\ordemservico
mkdir src\br\com\curso\aula136\dominio\pedido
```

Nesta aula, vamos criar:

```text
um exemplo ruim com construtor confuso;
um Builder para Contrato;
um Builder para OrdemServico;
um Builder para Pedido com itens iniciais simples.
```

---

## Exemplo 1 — Construtor confuso

Crie:

```text
src\br\com\curso\aula136\exemplo\ruim\ContratoConstrutorConfusoApp.java
```

Código:

```java
package br.com.curso.aula136.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public class ContratoConstrutorConfusoApp {
    public static void main(String[] args) {
        ContratoConstrutorConfuso contrato = new ContratoConstrutorConfuso(
                "CONT-001",
                "Cliente Corporativo A",
                "Instalação",
                new BigDecimal("150.00"),
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31),
                true,
                false,
                "PORTAL",
                "Contrato anual com atendimento prioritário"
        );

        System.out.println(contrato.resumo());
    }
}

class ContratoConstrutorConfuso {
    private final String codigo;
    private final String cliente;
    private final String servico;
    private final BigDecimal valorMensal;
    private final LocalDate inicio;
    private final LocalDate fim;
    private final boolean notificacaoAtiva;
    private final boolean renovacaoAutomatica;
    private final String origem;
    private final String observacao;

    ContratoConstrutorConfuso(
            String codigo,
            String cliente,
            String servico,
            BigDecimal valorMensal,
            LocalDate inicio,
            LocalDate fim,
            boolean notificacaoAtiva,
            boolean renovacaoAutomatica,
            String origem,
            String observacao
    ) {
        this.codigo = codigo;
        this.cliente = cliente;
        this.servico = servico;
        this.valorMensal = valorMensal.setScale(2, RoundingMode.HALF_UP);
        this.inicio = inicio;
        this.fim = fim;
        this.notificacaoAtiva = notificacaoAtiva;
        this.renovacaoAutomatica = renovacaoAutomatica;
        this.origem = origem;
        this.observacao = observacao;
    }

    String resumo() {
        return "Contrato " + codigo
                + " | Cliente: " + cliente
                + " | Serviço: " + servico
                + " | Valor mensal: R$ " + valorMensal
                + " | Início: " + inicio
                + " | Fim: " + fim
                + " | Notificação ativa: " + notificacaoAtiva
                + " | Renovação automática: " + renovacaoAutomatica
                + " | Origem: " + origem
                + " | Observação: " + observacao;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula136.exemplo.ruim.ContratoConstrutorConfusoApp
```

---

## O problema do exemplo

O código funciona.

Mas a criação é difícil de ler:

```java
true,
false,
"PORTAL",
"Contrato anual..."
```

Quem lê precisa adivinhar:

```text
true significa o quê?
false significa o quê?
PORTAL é origem ou observação?
a ordem dos parâmetros está correta?
```

Além disso, o construtor aceita muitos detalhes ao mesmo tempo.

Um Builder deixaria isso mais claro.

---

## Criando objetos de apoio

Vamos criar uma versão melhor.

Crie:

```text
src\br\com\curso\aula136\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula136.dominio.valor;

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

Crie:

```text
src\br\com\curso\aula136\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula136.dominio.cliente;

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
src\br\com\curso\aula136\dominio\servico\ServicoContratado.java
```

Código:

```java
package br.com.curso.aula136.dominio.servico;

import br.com.curso.aula136.dominio.valor.Dinheiro;

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

## Período e status do contrato

Crie:

```text
src\br\com\curso\aula136\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula136.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula136\dominio\contrato\PeriodoContrato.java
```

Código:

```java
package br.com.curso.aula136.dominio.contrato;

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

---

## Contrato com construtor controlado

Crie:

```text
src\br\com\curso\aula136\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula136.dominio.contrato;

import br.com.curso.aula136.dominio.cliente.Cliente;
import br.com.curso.aula136.dominio.servico.ServicoContratado;
import br.com.curso.aula136.dominio.valor.Dinheiro;

public class Contrato {
    private final String codigo;
    private final Cliente cliente;
    private final ServicoContratado servico;
    private final PeriodoContrato periodo;
    private final boolean notificacaoAtiva;
    private final boolean renovacaoAutomatica;
    private final String origem;
    private final String observacao;
    private StatusContrato status;
    private String motivoCancelamento;

    Contrato(
            String codigo,
            Cliente cliente,
            ServicoContratado servico,
            PeriodoContrato periodo,
            boolean notificacaoAtiva,
            boolean renovacaoAutomatica,
            String origem,
            String observacao
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

        if (origem == null || origem.isBlank()) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        if (observacao == null) {
            observacao = "";
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.servico = servico;
        this.periodo = periodo;
        this.notificacaoAtiva = notificacaoAtiva;
        this.renovacaoAutomatica = renovacaoAutomatica;
        this.origem = origem;
        this.observacao = observacao;
        this.status = StatusContrato.RASCUNHO;
        this.motivoCancelamento = "";
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
                + " | Notificação ativa: " + notificacaoAtiva
                + " | Renovação automática: " + renovacaoAutomatica
                + " | Origem: " + origem
                + " | Observação: " + observacao
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Observe que o construtor não é `public`.

Ele tem visibilidade de pacote.

Assim, o Builder no mesmo pacote consegue usar, mas o app usará o Builder.

---

## ContratoBuilder

Crie:

```text
src\br\com\curso\aula136\dominio\contrato\ContratoBuilder.java
```

Código:

```java
package br.com.curso.aula136.dominio.contrato;

import br.com.curso.aula136.dominio.cliente.Cliente;
import br.com.curso.aula136.dominio.servico.ServicoContratado;

public class ContratoBuilder {
    private String codigo;
    private Cliente cliente;
    private ServicoContratado servico;
    private PeriodoContrato periodo;
    private boolean notificacaoAtiva;
    private boolean renovacaoAutomatica;
    private String origem;
    private String observacao;

    public ContratoBuilder() {
        this.notificacaoAtiva = true;
        this.renovacaoAutomatica = false;
        this.origem = "SISTEMA";
        this.observacao = "";
    }

    public ContratoBuilder codigo(String codigo) {
        this.codigo = codigo;
        return this;
    }

    public ContratoBuilder cliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public ContratoBuilder servico(ServicoContratado servico) {
        this.servico = servico;
        return this;
    }

    public ContratoBuilder periodo(PeriodoContrato periodo) {
        this.periodo = periodo;
        return this;
    }

    public ContratoBuilder notificacaoAtiva(boolean notificacaoAtiva) {
        this.notificacaoAtiva = notificacaoAtiva;
        return this;
    }

    public ContratoBuilder renovacaoAutomatica(boolean renovacaoAutomatica) {
        this.renovacaoAutomatica = renovacaoAutomatica;
        return this;
    }

    public ContratoBuilder origem(String origem) {
        this.origem = origem;
        return this;
    }

    public ContratoBuilder observacao(String observacao) {
        this.observacao = observacao;
        return this;
    }

    public Contrato build() {
        return new Contrato(
                codigo,
                cliente,
                servico,
                periodo,
                notificacaoAtiva,
                renovacaoAutomatica,
                origem,
                observacao
        );
    }
}
```

Cada método retorna:

```java
return this;
```

Isso permite encadear chamadas.

---

## App usando ContratoBuilder

Crie:

```text
src\br\com\curso\aula136\app\ContratoBuilderApp.java
```

Código:

```java
package br.com.curso.aula136.app;

import br.com.curso.aula136.dominio.cliente.Cliente;
import br.com.curso.aula136.dominio.contrato.Contrato;
import br.com.curso.aula136.dominio.contrato.ContratoBuilder;
import br.com.curso.aula136.dominio.contrato.PeriodoContrato;
import br.com.curso.aula136.dominio.servico.ServicoContratado;
import br.com.curso.aula136.dominio.valor.Dinheiro;

import java.time.LocalDate;

public class ContratoBuilderApp {
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

        Contrato contrato = new ContratoBuilder()
                .codigo("CONT-001")
                .cliente(cliente)
                .servico(servico)
                .periodo(periodo)
                .origem("PORTAL")
                .observacao("Contrato anual com atendimento prioritário")
                .renovacaoAutomatica(true)
                .build();

        contrato.ativar();

        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula136.app.ContratoBuilderApp
```

---

## O que melhorou

Antes:

```java
new ContratoConstrutorConfuso(
        "CONT-001",
        "Cliente Corporativo A",
        "Instalação",
        valor,
        inicio,
        fim,
        true,
        false,
        "PORTAL",
        "Observação"
);
```

Agora:

```java
new ContratoBuilder()
        .codigo("CONT-001")
        .cliente(cliente)
        .servico(servico)
        .periodo(periodo)
        .origem("PORTAL")
        .observacao("Contrato anual com atendimento prioritário")
        .renovacaoAutomatica(true)
        .build();
```

A leitura fica melhor.

Cada valor tem nome.

Os valores padrão ficam no Builder:

```text
notificação ativa por padrão;
renovação automática false por padrão;
origem SISTEMA por padrão;
observação vazia por padrão.
```

---

## Builder com validação no build

No nosso exemplo, o método `build()` chama o construtor de `Contrato`.

O construtor valida as invariantes.

Isso é bom.

Também poderíamos validar antes no próprio Builder.

Exemplo:

```java
if (codigo == null || codigo.isBlank()) {
    throw new IllegalArgumentException("Código é obrigatório.");
}
```

Mas mesmo que o Builder valide, o objeto final também deve proteger sua validade.

A regra continua:

```text
Builder ajuda na montagem;
objeto final protege invariantes.
```

---

## Builder e métodos encadeados

Este estilo:

```java
new ContratoBuilder()
        .codigo("CONT-001")
        .cliente(cliente)
        .build();
```

funciona porque cada método retorna o próprio builder:

```java
return this;
```

Isso é chamado de API fluente.

A ideia é deixar a criação parecida com uma leitura em etapas.

Use com moderação.

Fluência deve melhorar clareza, não esconder regra.

---

## Builder para OrdemServico

Agora vamos aplicar em Ordem de Serviço.

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

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

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

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

## OrdemServico com dados opcionais

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private final PeriodoAtendimento periodo;
    private final PrioridadeOs prioridade;
    private final String canalOrigem;
    private final String observacao;
    private StatusOs status;

    OrdemServico(
            CodigoOs codigo,
            String cliente,
            PeriodoAtendimento periodo,
            PrioridadeOs prioridade,
            String canalOrigem,
            String observacao
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        if (canalOrigem == null || canalOrigem.isBlank()) {
            throw new IllegalArgumentException("Canal de origem é obrigatório.");
        }

        if (observacao == null) {
            observacao = "";
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.prioridade = prioridade;
        this.canalOrigem = canalOrigem;
        this.observacao = observacao;
        this.status = StatusOs.AGENDADA;
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

        status = StatusOs.CANCELADA;
    }

    public String resumo() {
        return "OS " + codigo
                + " | Cliente: " + cliente
                + " | Período: " + periodo
                + " | Prioridade: " + prioridade
                + " | Canal origem: " + canalOrigem
                + " | Observação: " + observacao
                + " | Status: " + status;
    }
}
```

---

## OrdemServicoBuilder

Crie:

```text
src\br\com\curso\aula136\dominio\ordemservico\OrdemServicoBuilder.java
```

Código:

```java
package br.com.curso.aula136.dominio.ordemservico;

public class OrdemServicoBuilder {
    private CodigoOs codigo;
    private String cliente;
    private PeriodoAtendimento periodo;
    private PrioridadeOs prioridade;
    private String canalOrigem;
    private String observacao;

    public OrdemServicoBuilder() {
        this.prioridade = PrioridadeOs.NORMAL;
        this.canalOrigem = "SISTEMA";
        this.observacao = "";
    }

    public OrdemServicoBuilder codigo(CodigoOs codigo) {
        this.codigo = codigo;
        return this;
    }

    public OrdemServicoBuilder cliente(String cliente) {
        this.cliente = cliente;
        return this;
    }

    public OrdemServicoBuilder periodo(PeriodoAtendimento periodo) {
        this.periodo = periodo;
        return this;
    }

    public OrdemServicoBuilder prioridade(PrioridadeOs prioridade) {
        this.prioridade = prioridade;
        return this;
    }

    public OrdemServicoBuilder canalOrigem(String canalOrigem) {
        this.canalOrigem = canalOrigem;
        return this;
    }

    public OrdemServicoBuilder observacao(String observacao) {
        this.observacao = observacao;
        return this;
    }

    public OrdemServico build() {
        return new OrdemServico(
                codigo,
                cliente,
                periodo,
                prioridade,
                canalOrigem,
                observacao
        );
    }
}
```

---

## App usando OrdemServicoBuilder

Crie:

```text
src\br\com\curso\aula136\app\OrdemServicoBuilderApp.java
```

Código:

```java
package br.com.curso.aula136.app;

import br.com.curso.aula136.dominio.ordemservico.CodigoOs;
import br.com.curso.aula136.dominio.ordemservico.OrdemServico;
import br.com.curso.aula136.dominio.ordemservico.OrdemServicoBuilder;
import br.com.curso.aula136.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula136.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula136.dominio.ordemservico.TurnoAtendimento;

import java.time.LocalDate;

public class OrdemServicoBuilderApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServicoBuilder()
                .codigo(CodigoOs.deNumero(1))
                .cliente("Ana Silva")
                .periodo(new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                ))
                .prioridade(PrioridadeOs.ALTA)
                .canalOrigem("PORTAL_CLIENTE")
                .observacao("Cliente solicitou prioridade no atendimento.")
                .build();

        System.out.println(os.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula136.app.OrdemServicoBuilderApp
```

---

## Builder com valores padrão

No Builder de OS, definimos:

```java
this.prioridade = PrioridadeOs.NORMAL;
this.canalOrigem = "SISTEMA";
this.observacao = "";
```

Então podemos criar uma OS mais simples:

```java
OrdemServico os = new OrdemServicoBuilder()
        .codigo(CodigoOs.deNumero(2))
        .cliente("Carlos Souza")
        .periodo(periodo)
        .build();
```

Os opcionais usam padrão.

Isso é um bom uso de Builder.

---

## Builder para Pedido com itens iniciais

Agora vamos criar um exemplo com pedido.

Neste caso, o Builder vai montar um pedido com itens iniciais.

Crie:

```text
src\br\com\curso\aula136\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula136.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula136\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula136.dominio.pedido;

import br.com.curso.aula136.dominio.valor.Dinheiro;

public class ItemPedido {
    private final String descricao;
    private final Dinheiro valorUnitario;
    private final int quantidade;

    public ItemPedido(String descricao, Dinheiro valorUnitario, int quantidade) {
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (valorUnitario == null || !valorUnitario.positivo()) {
            throw new IllegalArgumentException("Valor unitário deve ser positivo.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.descricao = descricao;
        this.valorUnitario = valorUnitario;
        this.quantidade = quantidade;
    }

    public Dinheiro subtotal() {
        return valorUnitario.multiplicar(quantidade);
    }

    public String resumo() {
        return descricao
                + " | Quantidade: " + quantidade
                + " | Unitário: " + valorUnitario
                + " | Subtotal: " + subtotal();
    }
}
```

Crie:

```text
src\br\com\curso\aula136\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula136.dominio.pedido;

import br.com.curso.aula136.dominio.cliente.Cliente;
import br.com.curso.aula136.dominio.valor.Dinheiro;

import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private final int numero;
    private final Cliente cliente;
    private final String origem;
    private final String observacao;
    private final List<ItemPedido> itens;
    private StatusPedido status;

    Pedido(int numero, Cliente cliente, String origem, String observacao, List<ItemPedido> itensIniciais) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Pedido não pode ser criado para cliente inativo.");
        }

        if (origem == null || origem.isBlank()) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        if (observacao == null) {
            observacao = "";
        }

        if (itensIniciais == null || itensIniciais.isEmpty()) {
            throw new IllegalArgumentException("Pedido precisa ter ao menos um item inicial.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.origem = origem;
        this.observacao = observacao;
        this.itens = new ArrayList<>(itensIniciais);
        this.status = StatusPedido.CRIADO;
    }

    public Dinheiro total() {
        Dinheiro total = Dinheiro.zero();

        for (ItemPedido item : itens) {
            total = total.somar(item.subtotal());
        }

        return total;
    }

    public void confirmarPagamento(Dinheiro valorPago) {
        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || !valorPago.somar(Dinheiro.zero()).equals(valorPago)) {
            throw new IllegalArgumentException("Valor pago é obrigatório.");
        }

        status = StatusPedido.PAGO;
    }

    public String resumo() {
        StringBuilder texto = new StringBuilder();

        texto.append("Pedido ").append(numero)
                .append(" | Cliente: ").append(cliente.resumo())
                .append(" | Origem: ").append(origem)
                .append(" | Observação: ").append(observacao)
                .append(" | Total: ").append(total())
                .append(" | Status: ").append(status)
                .append("\nItens:");

        for (ItemPedido item : itens) {
            texto.append("\n- ").append(item.resumo());
        }

        return texto.toString();
    }
}
```

Neste exemplo, o `Pedido` exige ao menos um item inicial.

Mais adiante, quando estudarmos coleções dentro de objetos, vamos refinar exposição e proteção de listas.

---

## Ajuste importante no pagamento do Pedido

O método `confirmarPagamento` acima está propositalmente simples, mas aquela validação de valor pode ficar melhor se `Dinheiro` expuser `maiorOuIgual`.

Como nosso `Dinheiro` desta aula ainda não expôs esse método, vamos ajustar agora.

Abra `Dinheiro.java` e adicione este método antes de `somar`:

```java
public boolean maiorOuIgual(Dinheiro outro) {
    if (outro == null) {
        return false;
    }

    return valor.compareTo(outro.valor) >= 0;
}
```

Agora substitua o método `confirmarPagamento` de `Pedido` por:

```java
public void confirmarPagamento(Dinheiro valorPago) {
    if (status != StatusPedido.CRIADO) {
        throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
    }

    if (valorPago == null || !valorPago.maiorOuIgual(total())) {
        throw new IllegalArgumentException("Valor pago não cobre o total do pedido.");
    }

    status = StatusPedido.PAGO;
}
```

Esse ajuste reforça uma regra importante:

```text
quando um objeto precisa de comportamento, coloque o comportamento no objeto certo.
```

---

## PedidoBuilder

Crie:

```text
src\br\com\curso\aula136\dominio\pedido\PedidoBuilder.java
```

Código:

```java
package br.com.curso.aula136.dominio.pedido;

import br.com.curso.aula136.dominio.cliente.Cliente;
import br.com.curso.aula136.dominio.valor.Dinheiro;

import java.util.ArrayList;
import java.util.List;

public class PedidoBuilder {
    private int numero;
    private Cliente cliente;
    private String origem;
    private String observacao;
    private final List<ItemPedido> itens;

    public PedidoBuilder() {
        this.origem = "SISTEMA";
        this.observacao = "";
        this.itens = new ArrayList<>();
    }

    public PedidoBuilder numero(int numero) {
        this.numero = numero;
        return this;
    }

    public PedidoBuilder cliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public PedidoBuilder origem(String origem) {
        this.origem = origem;
        return this;
    }

    public PedidoBuilder observacao(String observacao) {
        this.observacao = observacao;
        return this;
    }

    public PedidoBuilder adicionarItem(String descricao, Dinheiro valorUnitario, int quantidade) {
        itens.add(new ItemPedido(descricao, valorUnitario, quantidade));
        return this;
    }

    public Pedido build() {
        return new Pedido(
                numero,
                cliente,
                origem,
                observacao,
                itens
        );
    }
}
```

Esse Builder permite:

```text
configurar número;
configurar cliente;
configurar origem;
configurar observação;
adicionar itens;
criar pedido.
```

---

## App usando PedidoBuilder

Crie:

```text
src\br\com\curso\aula136\app\PedidoBuilderApp.java
```

Código:

```java
package br.com.curso.aula136.app;

import br.com.curso.aula136.dominio.cliente.Cliente;
import br.com.curso.aula136.dominio.pedido.Pedido;
import br.com.curso.aula136.dominio.pedido.PedidoBuilder;
import br.com.curso.aula136.dominio.valor.Dinheiro;

public class PedidoBuilderApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva"
        );

        Pedido pedido = new PedidoBuilder()
                .numero(1001)
                .cliente(cliente)
                .origem("PORTAL")
                .observacao("Pedido criado pelo portal do cliente.")
                .adicionarItem("Cadeira", Dinheiro.de("199.90"), 2)
                .adicionarItem("Mesa", Dinheiro.de("399.90"), 1)
                .build();

        pedido.confirmarPagamento(Dinheiro.de("799.70"));

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula136.app.PedidoBuilderApp
```

---

## Observação sobre o exemplo de Pedido

Esse exemplo introduz lista de itens.

Ainda vamos estudar coleções dentro de objetos com mais profundidade.

Por enquanto, foque no Builder:

```text
ele tornou a criação do Pedido mais legível;
permitiu adicionar itens de forma encadeada;
escondeu a montagem da lista;
manteve o Pedido validando que há pelo menos um item.
```

Esse é um uso inicial de Builder.

---

## Builder e obrigatórios

Builder deixa a criação flexível, mas isso pode esconder campos obrigatórios.

Exemplo:

```java
Contrato contrato = new ContratoBuilder()
        .codigo("CONT-001")
        .build();
```

Faltam:

```text
cliente;
serviço;
período.
```

O `build()` precisa impedir objeto inválido.

No nosso exemplo, o construtor de `Contrato` lança erro se faltar algo.

Isso é aceitável.

Mais adiante, podemos refinar Builders para deixar obrigatórios mais explícitos.

Nesta fase, o importante é:

```text
build nunca deve devolver objeto inválido.
```

---

## Builder e reuso

Cuidado ao reutilizar o mesmo Builder.

Exemplo:

```java
PedidoBuilder builder = new PedidoBuilder();

Pedido p1 = builder.numero(1001).cliente(cliente).adicionarItem(...).build();
Pedido p2 = builder.numero(1002).build();
```

O segundo pedido pode herdar dados do primeiro.

Para evitar confusão, prefira criar um builder novo para cada objeto:

```java
Pedido pedido = new PedidoBuilder()
        .numero(1001)
        .cliente(cliente)
        .build();
```

Regra prática:

```text
use Builder como objeto temporário de criação.
```

---

## Builder e mutabilidade

O Builder normalmente é mutável.

Ele vai recebendo dados:

```java
.codigo(...)
.cliente(...)
.periodo(...)
```

Isso é aceitável porque o Builder é temporário.

O objeto final pode ser mais controlado e seguro.

A mutabilidade do Builder não significa que a entidade deve ser mutável sem regra.

Builder mutável.

Domínio protegido.

---

## Builder externo versus Builder interno

Nesta aula usamos classes separadas:

```text
ContratoBuilder;
OrdemServicoBuilder;
PedidoBuilder.
```

Existe também o modelo de Builder interno estático:

```java
Contrato.builder()
        .codigo(...)
        .build();
```

Isso usa classe aninhada estática.

Como ainda não aprofundamos classes internas e padrões avançados, ficamos com Builder externo para manter a aula clara.

Mais adiante, podemos estudar variações.

---

## Builder com nome claro

Evite métodos vagos.

Melhor:

```java
.codigo(...)
.cliente(...)
.periodo(...)
.observacao(...)
.adicionarItem(...)
```

Pior:

```java
.com(...)
.set(...)
.valor(...)
.dado(...)
.info(...)
```

O Builder deve melhorar leitura.

Métodos com nomes ruins perdem o benefício.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Construtor confuso

Execute:

```text
ContratoConstrutorConfusoApp.java
```

Explique:

```text
quais parâmetros são difíceis de entender;
por que booleanos soltos são perigosos;
qual erro de ordem poderia acontecer.
```

### Parte 2 — ContratoBuilder

Execute:

```text
ContratoBuilderApp.java
```

Explique:

```text
quais valores ficaram nomeados;
quais valores têm padrão;
onde as invariantes são protegidas.
```

### Parte 3 — OrdemServicoBuilder

Execute:

```text
OrdemServicoBuilderApp.java
```

Explique:

```text
por que prioridade e canalOrigem combinam com Builder;
quais campos são obrigatórios;
quais campos são opcionais.
```

### Parte 4 — PedidoBuilder

Execute:

```text
PedidoBuilderApp.java
```

Explique:

```text
como os itens foram adicionados;
por que build precisa validar que há itens;
por que o pedido ainda confirma pagamento por método próprio.
```

### Parte 5 — Factory ou Builder

Classifique:

```text
Dinheiro.de("10.00");
Pedido.novo(...);
new ContratoBuilder().codigo(...).cliente(...).build();
OrdemServicoFactory.criarAgendada(...);
new Cliente(10, "Ana");
```

Responda se é:

```text
construtor;
static factory;
factory class;
builder.
```

---

## Desafio prático

Crie um Builder para `Pagamento`.

Estrutura sugerida:

```text
src\br\com\curso\aula136\apppagamento
src\br\com\curso\aula136\dominio\pagamento
```

Arquivos sugeridos:

```text
apppagamento\PagamentoBuilderApp.java

dominio\pagamento\CodigoPagamento.java
dominio\pagamento\StatusPagamento.java
dominio\pagamento\Pagamento.java
dominio\pagamento\PagamentoBuilder.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras:

```text
CodigoPagamento deve iniciar com PAG-.
Pagamento tem código, valor, origem, observação, status e motivoEstorno.
Pagamento nasce PENDENTE.
Valor precisa ser positivo.
Origem padrão deve ser SISTEMA.
Observação padrão deve ser vazia.
Pagamento pode confirmar.
Pagamento pode estornar se estiver confirmado.
Estorno exige motivo.
PagamentoBuilder deve montar pagamento pendente.
PagamentoBuilder deve permitir codigo, valor, origem e observacao.
```

Uso esperado:

```java
Pagamento pagamento = new PagamentoBuilder()
        .codigo(new CodigoPagamento("PAG-0001"))
        .valor(Dinheiro.de("250.00"))
        .origem("PORTAL")
        .observacao("Pagamento feito pelo cliente.")
        .build();

pagamento.confirmar();
pagamento.estornar("Solicitação do cliente.");

System.out.println(pagamento.resumo());
```

Critério principal:

```text
Builder cria o pagamento;
Pagamento protege o ciclo de vida.
```

---

## Erros comuns

### 1. Usar Builder para tudo

Se o construtor é simples, não precisa.

### 2. Builder virar service

Builder cria. Não confirma, cancela, reage ou executa regra de ciclo de vida.

### 3. build devolver objeto inválido

O método `build()` precisa garantir objeto válido.

### 4. Remover validação da entidade

Mesmo com Builder, a entidade continua protegendo invariantes.

### 5. Reutilizar Builder sem cuidado

Builder é temporário. Prefira um novo por objeto.

### 6. Criar métodos com nomes ruins

A leitura do Builder depende dos nomes.

### 7. Usar Builder para esconder design ruim

Se o objeto tem dados demais sem coesão, Builder não resolve o problema de modelagem.

### 8. Confundir Builder com setters

Builder monta antes do objeto final existir. Setter altera objeto já existente.

---

## Debug recomendado

Use debug em:

```text
ContratoConstrutorConfusoApp.java
ContratoBuilderApp.java
OrdemServicoBuilderApp.java
PedidoBuilderApp.java
```

Breakpoints recomendados:

```java
new ContratoBuilder()
.codigo(...)
.cliente(...)
.periodo(...)
.build()
new Contrato(...)

new OrdemServicoBuilder()
.prioridade(...)
.build()
new OrdemServico(...)

new PedidoBuilder()
.adicionarItem(...)
.build()
new Pedido(...)
pedido.confirmarPagamento(...)
```

Observe:

```text
quais dados entram no Builder;
quais padrões são definidos no construtor do Builder;
quando o objeto final é criado;
onde a validação acontece;
quando o comportamento deixa de ser responsabilidade do Builder e passa para a entidade.
```

O objetivo é entender o Builder como etapa de montagem.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é Builder?
2. Quando Builder é melhor que construtor com muitos parâmetros?
3. Qual regra não deve ficar no Builder?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar Builder;
identificar construtor confuso;
criar Builder simples separado;
usar métodos encadeados com return this;
definir valores padrão no Builder;
validar criação no build;
manter invariantes no objeto final;
diferenciar Builder de factory;
diferenciar Builder de setter;
evitar Builder desnecessário;
criar Builder para Contrato, OrdemServico e Pedido;
resolver o desafio de PagamentoBuilder;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-136-builder-inicial
git commit -m "Aula 136: pratica builder inicial"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Builder melhora a criação de objetos quando o construtor começa a ficar longo, confuso ou cheio de parâmetros opcionais.
```

Você viu que Builder não substitui entidade, não substitui regra de domínio e não deve virar service.

Ele apenas organiza a montagem do objeto.

Na próxima aula, vamos estudar coleções dentro de objetos.

Vamos entender como trabalhar com listas em entidades, como proteger coleções internas e como evitar que outros códigos modifiquem o estado do objeto por fora.
