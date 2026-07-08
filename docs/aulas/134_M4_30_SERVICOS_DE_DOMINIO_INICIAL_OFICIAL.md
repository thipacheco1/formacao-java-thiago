# 134 — M4.30 — Serviços de domínio inicial

## Objetivo da aula

Nesta aula você vai aprender a ideia inicial de serviços de domínio.

Na aula anterior, você estudou invariantes de domínio e viu que entidades e objetos de valor devem proteger regras que pertencem a eles. Agora vamos estudar um caso importante:

```text
e quando uma regra de domínio não pertence naturalmente a uma única entidade ou objeto de valor?
```

Ao final da aula, você deve conseguir:

```text
explicar o que é um serviço de domínio;
entender quando uma regra deve ficar na entidade;
entender quando uma regra pode virar serviço de domínio;
diferenciar serviço de domínio de service gigante;
diferenciar serviço de domínio de serviço de aplicação;
evitar transformar tudo em PedidoService, ContratoService ou OrdemServicoService;
criar serviços de domínio pequenos e focados;
manter domínio sem depender de infraestrutura;
aplicar serviços de domínio em desconto, elegibilidade e alocação.
```

Essa aula é inicial.

Mais adiante, em arquitetura e Spring, vamos separar melhor:

```text
serviço de domínio;
serviço de aplicação;
repository;
controller;
use case;
infraestrutura.
```

Por enquanto, o foco é entender o conceito sem bagunçar o domínio.

---

## A ideia central

Serviço de domínio é uma classe que representa uma operação ou regra de negócio que pertence ao domínio, mas não se encaixa bem dentro de uma única entidade ou objeto de valor.

Exemplo:

```text
calcular desconto usando Cliente + Pedido;
verificar elegibilidade de reagendamento usando OS + política de datas;
alocar técnico usando OS + Técnico + regra de disponibilidade;
calcular remuneração usando Serviço + Região + Valor + Status;
```

A regra é de domínio.

Mas ela envolve mais de um objeto.

Nesse caso, pode fazer sentido criar uma classe específica para essa operação.

---

## Serviço de domínio não é service gigante

Cuidado.

Quando falamos "serviço de domínio", não estamos dizendo para jogar todas as regras em:

```text
PedidoService;
ContratoService;
OrdemServicoService;
SistemaService;
ProcessadorService.
```

Isso seria voltar para domínio anêmico.

Serviço de domínio deve ser:

```text
pequeno;
focado;
com nome de negócio;
sem estado desnecessário;
sem infraestrutura;
sem HTTP;
sem banco;
sem tela;
sem virar depósito de regra.
```

Exemplo ruim:

```text
PedidoService
- criar pedido
- alterar cliente
- calcular desconto
- confirmar pagamento
- cancelar pedido
- salvar banco
- enviar e-mail
- gerar relatório
```

Exemplo melhor:

```text
PoliticaDescontoPedido
- calcular desconto de acordo com cliente e pedido.
```

A diferença é foco.

---

## Primeiro critério: a regra pertence a uma entidade?

Antes de criar serviço de domínio, pergunte:

```text
essa regra pertence claramente a uma entidade?
```

Exemplo:

```java
pedido.confirmarPagamento(valorPago);
pedido.cancelar("motivo");
produto.reservarEstoque(3);
contrato.ativar();
os.reagendar(periodo);
```

Essas regras pertencem naturalmente aos objetos.

Não crie serviço só por costume.

Ruim:

```java
pedidoService.confirmarPagamento(pedido, valorPago);
```

se o próprio pedido poderia proteger essa regra.

Melhor:

```java
pedido.confirmarPagamento(valorPago);
```

Serviço de domínio não deve roubar comportamento natural da entidade.

---

## Segundo critério: a regra envolve vários objetos?

Agora pergunte:

```text
a regra depende de mais de um objeto e não pertence claramente a apenas um deles?
```

Exemplo:

```text
desconto depende do tipo do cliente e do total do pedido;
alocação depende da OS e do técnico;
elegibilidade depende da OS e de uma política de antecedência;
remuneração depende do serviço, região e status.
```

Nesse caso, um serviço de domínio pode fazer sentido.

---

## Terceiro critério: a regra é de domínio ou infraestrutura?

Serviço de domínio não deve saber detalhes externos.

Não deve fazer:

```text
salvar no banco;
chamar API HTTP;
enviar e-mail SMTP;
ler arquivo;
escrever planilha;
acessar controller;
montar response JSON.
```

Essas coisas pertencem a outras camadas.

Serviço de domínio deve trabalhar com objetos e regras do domínio.

Exemplo bom:

```text
PoliticaDescontoPedido calcula desconto.
```

Exemplo ruim:

```text
PoliticaDescontoPedido busca desconto no banco via JDBC.
```

Nesta fase, mantenha serviço de domínio puro.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-134-servicos-de-dominio-inicial
cd labs\m4\aula-134-servicos-de-dominio-inicial
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula134
mkdir src\br\com\curso\aula134\app
mkdir src\br\com\curso\aula134\exemplo
mkdir src\br\com\curso\aula134\exemplo\ruim
mkdir src\br\com\curso\aula134\dominio
mkdir src\br\com\curso\aula134\dominio\cliente
mkdir src\br\com\curso\aula134\dominio\pedido
mkdir src\br\com\curso\aula134\dominio\produto
mkdir src\br\com\curso\aula134\dominio\valor
mkdir src\br\com\curso\aula134\dominio\desconto
mkdir src\br\com\curso\aula134\dominio\ordemservico
mkdir src\br\com\curso\aula134\dominio\tecnico
mkdir src\br\com\curso\aula134\dominio\alocacao
```

Nesta aula, vamos criar:

```text
um exemplo ruim de service roubando regra;
um exemplo bom com regra dentro da entidade;
um serviço de domínio para desconto;
um serviço de domínio para alocação de técnico em OS.
```

---

## Exemplo 1 — Service ruim roubando regra da entidade

Crie:

```text
src\br\com\curso\aula134\exemplo\ruim\PedidoServiceRuimApp.java
```

Código:

```java
package br.com.curso.aula134.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoServiceRuimApp {
    public static void main(String[] args) {
        PedidoAnemicoService pedido = new PedidoAnemicoService(
                1001,
                new BigDecimal("399.80")
        );

        PedidoServiceRuim service = new PedidoServiceRuim();

        service.confirmarPagamento(pedido, new BigDecimal("399.80"));

        System.out.println(pedido.resumo());
    }
}

enum StatusPedidoServiceRuim {
    CRIADO,
    PAGO,
    CANCELADO
}

class PedidoAnemicoService {
    private final int numero;
    private final BigDecimal total;
    private StatusPedidoServiceRuim status;

    PedidoAnemicoService(int numero, BigDecimal total) {
        this.numero = numero;
        this.total = total.setScale(2, RoundingMode.HALF_UP);
        this.status = StatusPedidoServiceRuim.CRIADO;
    }

    BigDecimal getTotal() {
        return total;
    }

    StatusPedidoServiceRuim getStatus() {
        return status;
    }

    void setStatus(StatusPedidoServiceRuim status) {
        this.status = status;
    }

    String resumo() {
        return "Pedido " + numero
                + " | Total: R$ " + total
                + " | Status: " + status;
    }
}

class PedidoServiceRuim {
    void confirmarPagamento(PedidoAnemicoService pedido, BigDecimal valorPago) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.getStatus() != StatusPedidoServiceRuim.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || valorPago.compareTo(pedido.getTotal()) < 0) {
            throw new IllegalArgumentException("Valor pago não cobre o total.");
        }

        pedido.setStatus(StatusPedidoServiceRuim.PAGO);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula134.exemplo.ruim.PedidoServiceRuimApp
```

---

## O problema do exemplo

O método:

```java
confirmarPagamento(...)
```

é uma regra natural de `Pedido`.

Mas ela foi colocada em:

```java
PedidoServiceRuim
```

O pedido ficou anêmico.

Ele expõe:

```java
getStatus()
getTotal()
setStatus(...)
```

E o service faz a regra.

Isso é ruim porque:

```text
a entidade não protege seu ciclo de vida;
o setter permite pular regra;
a regra fica fora do objeto;
o service tende a crescer demais;
o domínio fica fraco.
```

Esse não é um bom serviço de domínio.

É apenas um service compensando uma entidade fraca.

---

## Melhor: regra dentro do Pedido

Vamos criar uma versão melhor com comportamento dentro da entidade.

Crie:

```text
src\br\com\curso\aula134\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula134.dominio.valor;

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

    public Dinheiro percentual(String percentual) {
        if (percentual == null || percentual.isBlank()) {
            throw new IllegalArgumentException("Percentual é obrigatório.");
        }

        BigDecimal taxa = new BigDecimal(percentual).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        return new Dinheiro(valor.multiply(taxa));
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

## Pedido com comportamento

Crie:

```text
src\br\com\curso\aula134\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula134.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula134\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula134.dominio.pedido;

import br.com.curso.aula134.dominio.valor.Dinheiro;

public class Pedido {
    private final int numero;
    private final Dinheiro totalBruto;
    private Dinheiro desconto;
    private StatusPedido status;
    private String motivoCancelamento;

    public Pedido(int numero, Dinheiro totalBruto) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (totalBruto == null || !totalBruto.positivo()) {
            throw new IllegalArgumentException("Total bruto deve ser positivo.");
        }

        this.numero = numero;
        this.totalBruto = totalBruto;
        this.desconto = Dinheiro.zero();
        this.status = StatusPedido.CRIADO;
        this.motivoCancelamento = "";
    }

    public Dinheiro totalBruto() {
        return totalBruto;
    }

    public Dinheiro totalLiquido() {
        return totalBruto.subtrair(desconto);
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

    public void aplicarDesconto(Dinheiro desconto) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber desconto.");
        }

        if (desconto == null) {
            throw new IllegalArgumentException("Desconto é obrigatório.");
        }

        if (!totalBruto.maiorOuIgual(desconto)) {
            throw new IllegalArgumentException("Desconto não pode ser maior que o total bruto.");
        }

        this.desconto = desconto;
    }

    public void confirmarPagamento(Dinheiro valorPago) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || !valorPago.maiorOuIgual(totalLiquido())) {
            throw new IllegalArgumentException("Valor pago não cobre o total líquido do pedido.");
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
                + " | Total bruto: " + totalBruto
                + " | Desconto: " + desconto
                + " | Total líquido: " + totalLiquido()
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Aqui `confirmarPagamento` ficou no pedido.

Essa regra pertence ao pedido.

---

## App com pedido forte

Crie:

```text
src\br\com\curso\aula134\app\PedidoComportamentoApp.java
```

Código:

```java
package br.com.curso.aula134.app;

import br.com.curso.aula134.dominio.pedido.Pedido;
import br.com.curso.aula134.dominio.valor.Dinheiro;

public class PedidoComportamentoApp {
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
java -cp out br.com.curso.aula134.app.PedidoComportamentoApp
```

---

## Então quando usar serviço de domínio?

Agora que a regra natural ficou na entidade, vamos ver um caso adequado.

Imagine uma política de desconto.

Ela depende de:

```text
tipo do cliente;
total bruto do pedido;
regra comercial de percentual.
```

Não é apenas uma regra interna do pedido.

O pedido não precisa saber todos os critérios comerciais de cliente.

O cliente também não deve calcular desconto do pedido.

Essa regra envolve os dois.

Aqui um serviço de domínio pequeno pode fazer sentido:

```text
PoliticaDescontoPedido
```

---

## Cliente com tipo

Crie:

```text
src\br\com\curso\aula134\dominio\cliente\TipoCliente.java
```

Código:

```java
package br.com.curso.aula134.dominio.cliente;

public enum TipoCliente {
    COMUM,
    CORPORATIVO,
    VIP
}
```

Crie:

```text
src\br\com\curso\aula134\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula134.dominio.cliente;

public class Cliente {
    private final int id;
    private final String nome;
    private final TipoCliente tipo;
    private final boolean ativo;

    public Cliente(int id, String nome, TipoCliente tipo) {
        this(id, nome, tipo, true);
    }

    public Cliente(int id, String nome, TipoCliente tipo, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (tipo == null) {
            throw new IllegalArgumentException("Tipo do cliente é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.ativo = ativo;
    }

    public boolean ativo() {
        return ativo;
    }

    public boolean vip() {
        return tipo == TipoCliente.VIP;
    }

    public boolean corporativo() {
        return tipo == TipoCliente.CORPORATIVO;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome + " | Tipo: " + tipo + " | Ativo: " + ativo;
    }
}
```

---

## Serviço de domínio: PoliticaDescontoPedido

Crie:

```text
src\br\com\curso\aula134\dominio\desconto\PoliticaDescontoPedido.java
```

Código:

```java
package br.com.curso.aula134.dominio.desconto;

import br.com.curso.aula134.dominio.cliente.Cliente;
import br.com.curso.aula134.dominio.pedido.Pedido;
import br.com.curso.aula134.dominio.valor.Dinheiro;

public class PoliticaDescontoPedido {
    public Dinheiro calcularDesconto(Cliente cliente, Pedido pedido) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Cliente inativo não recebe desconto.");
        }

        if (cliente.vip()) {
            return pedido.totalBruto().percentual("15");
        }

        if (cliente.corporativo()) {
            return pedido.totalBruto().percentual("10");
        }

        return Dinheiro.zero();
    }
}
```

Essa classe é um serviço de domínio porque:

```text
representa uma regra de negócio;
envolve Cliente e Pedido;
não pertence claramente só a Cliente;
não pertence claramente só a Pedido;
não acessa banco;
não envia e-mail;
não conhece HTTP;
tem foco específico.
```

---

## App usando serviço de domínio

Crie:

```text
src\br\com\curso\aula134\app\DescontoDominioApp.java
```

Código:

```java
package br.com.curso.aula134.app;

import br.com.curso.aula134.dominio.cliente.Cliente;
import br.com.curso.aula134.dominio.cliente.TipoCliente;
import br.com.curso.aula134.dominio.desconto.PoliticaDescontoPedido;
import br.com.curso.aula134.dominio.pedido.Pedido;
import br.com.curso.aula134.dominio.valor.Dinheiro;

public class DescontoDominioApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva",
                TipoCliente.VIP
        );

        Pedido pedido = new Pedido(
                1001,
                Dinheiro.de("399.80")
        );

        PoliticaDescontoPedido politicaDesconto = new PoliticaDescontoPedido();

        Dinheiro desconto = politicaDesconto.calcularDesconto(cliente, pedido);

        pedido.aplicarDesconto(desconto);
        pedido.confirmarPagamento(Dinheiro.de("339.83"));

        System.out.println(cliente.resumo());
        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula134.app.DescontoDominioApp
```

---

## O que esse exemplo mostra

A política calcula o desconto.

O pedido aplica o desconto.

O pedido confirma pagamento.

Cada parte mantém sua responsabilidade:

```text
Cliente sabe seu tipo e se está ativo.
PoliticaDescontoPedido calcula desconto.
Pedido protege aplicação do desconto e pagamento.
Dinheiro representa valores monetários.
App monta o fluxo.
```

O serviço de domínio não substitui a entidade.

Ele complementa o domínio.

---

## Serviço de domínio deve ter nome de negócio

Compare:

```text
PedidoService
```

com:

```text
PoliticaDescontoPedido
```

O segundo nome é mais específico.

Ele comunica melhor a responsabilidade.

Outros exemplos bons:

```text
PoliticaAlocacaoTecnico;
ElegibilidadeReagendamentoOs;
CalculadoraRemuneracaoServico;
PoliticaCancelamentoContrato;
CalculadoraFretePedido.
```

Nomes ruins ou vagos:

```text
GerenciadorPedido;
PedidoServiceGeral;
ProcessadorDominio;
HelperPedido;
UtilsRegra.
```

Nome específico ajuda a evitar classe gigante.

---

## Exemplo 2 — Alocação de técnico em OS

Agora vamos criar outro serviço de domínio.

Regra:

```text
uma OS só pode receber técnico ativo;
OS encerrada não pode receber técnico;
técnico já alocado na mesma data não deve ser alocado em outra OS.
```

Essa regra envolve:

```text
OrdemServico;
Tecnico;
PeriodoAtendimento;
lista de alocações já existentes.
```

Ela não pertence completamente só à OS nem só ao Técnico.

Vamos modelar de forma inicial.

---

## Código da OS

Crie:

```text
src\br\com\curso\aula134\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula134.dominio.ordemservico;

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
src\br\com\curso\aula134\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula134.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula134\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula134.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula134\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula134.dominio.ordemservico;

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

## Técnico

Crie:

```text
src\br\com\curso\aula134\dominio\tecnico\Tecnico.java
```

Código:

```java
package br.com.curso.aula134.dominio.tecnico;

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

    public int id() {
        return id;
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
src\br\com\curso\aula134\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula134.dominio.ordemservico;

import br.com.curso.aula134.dominio.tecnico.Tecnico;

public class OrdemServico {
    private final CodigoOs codigo;
    private final String cliente;
    private final PeriodoAtendimento periodo;
    private Tecnico tecnico;
    private StatusOs status;

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
    }

    public PeriodoAtendimento periodo() {
        return periodo;
    }

    public boolean encerrada() {
        return status == StatusOs.CONCLUIDA
                || status == StatusOs.CANCELADA;
    }

    public boolean possuiTecnico() {
        return tecnico != null;
    }

    public boolean mesmoTecnico(Tecnico tecnico) {
        if (this.tecnico == null || tecnico == null) {
            return false;
        }

        return this.tecnico.id() == tecnico.id();
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

    public String resumo() {
        return "OS " + codigo
                + " | Cliente: " + cliente
                + " | Período: " + periodo
                + " | Técnico: " + (tecnico == null ? "não atribuído" : tecnico.resumo())
                + " | Status: " + status;
    }
}
```

A OS sabe atribuir técnico e proteger sua regra interna.

Mas a regra de conflito de agenda pode envolver várias OS.

---

## Serviço de domínio: PoliticaAlocacaoTecnico

Crie:

```text
src\br\com\curso\aula134\dominio\alocacao\PoliticaAlocacaoTecnico.java
```

Código:

```java
package br.com.curso.aula134.dominio.alocacao;

import br.com.curso.aula134.dominio.ordemservico.OrdemServico;
import br.com.curso.aula134.dominio.tecnico.Tecnico;

import java.util.List;

public class PoliticaAlocacaoTecnico {
    public void alocar(Tecnico tecnico, OrdemServico os, List<OrdemServico> ordensJaAlocadas) {
        if (tecnico == null) {
            throw new IllegalArgumentException("Técnico é obrigatório.");
        }

        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensJaAlocadas == null) {
            throw new IllegalArgumentException("Lista de OS já alocadas é obrigatória.");
        }

        if (!tecnico.ativo()) {
            throw new IllegalStateException("Técnico inativo não pode ser alocado.");
        }

        if (os.encerrada()) {
            throw new IllegalStateException("OS encerrada não pode receber técnico.");
        }

        for (OrdemServico ordem : ordensJaAlocadas) {
            if (ordem.mesmoTecnico(tecnico)
                    && ordem.periodo().mesmaData(os.periodo())) {
                throw new IllegalStateException("Técnico já possui OS na mesma data.");
            }
        }

        os.atribuirTecnico(tecnico);
    }
}
```

Essa classe representa uma política de domínio:

```text
alocar técnico considerando OS atual e outras OS já alocadas.
```

Ela não salva no banco.

Ela não busca a lista sozinha.

Ela recebe os objetos necessários.

---

## App usando política de alocação

Crie:

```text
src\br\com\curso\aula134\app\AlocacaoTecnicoDominioApp.java
```

Código:

```java
package br.com.curso.aula134.app;

import br.com.curso.aula134.dominio.alocacao.PoliticaAlocacaoTecnico;
import br.com.curso.aula134.dominio.ordemservico.CodigoOs;
import br.com.curso.aula134.dominio.ordemservico.OrdemServico;
import br.com.curso.aula134.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula134.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula134.dominio.tecnico.Tecnico;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AlocacaoTecnicoDominioApp {
    public static void main(String[] args) {
        Tecnico tecnico = new Tecnico(
                50,
                "Carlos Técnico"
        );

        OrdemServico osExistente = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        osExistente.atribuirTecnico(tecnico);

        OrdemServico novaOs = new OrdemServico(
                new CodigoOs("OS-2026-0002"),
                "Maria Souza",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(2),
                        TurnoAtendimento.TARDE
                )
        );

        List<OrdemServico> ordensJaAlocadas = new ArrayList<>();
        ordensJaAlocadas.add(osExistente);

        PoliticaAlocacaoTecnico politica = new PoliticaAlocacaoTecnico();
        politica.alocar(tecnico, novaOs, ordensJaAlocadas);

        System.out.println(osExistente.resumo());
        System.out.println(novaOs.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula134.app.AlocacaoTecnicoDominioApp
```

---

## O que esse exemplo mostra

A regra de alocação envolve:

```text
técnico;
OS atual;
ordens já alocadas;
período.
```

Ela não pertence naturalmente apenas à OS.

Também não pertence apenas ao técnico.

Por isso, `PoliticaAlocacaoTecnico` faz sentido como serviço de domínio inicial.

Mas repare:

```text
a OS ainda protege atribuição básica;
o técnico ainda protege se está ativo;
o período ainda protege data e turno;
a política só coordena uma regra mais ampla.
```

Serviço de domínio não vira dono de tudo.

Ele trabalha com objetos fortes.

---

## Serviço de domínio deve evitar estado desnecessário

Nossos serviços:

```text
PoliticaDescontoPedido;
PoliticaAlocacaoTecnico.
```

não guardam estado interno.

Eles recebem dados por parâmetro e retornam resultado ou aplicam uma regra.

Isso é comum.

Serviço de domínio geralmente pode ser stateless.

Ou seja:

```text
não depende de atributos mutáveis para funcionar.
```

Isso facilita teste e manutenção.

---

## Serviço de domínio versus objeto de valor

Se a regra representa um valor, talvez seja objeto de valor.

Exemplo:

```text
Dinheiro;
Email;
CodigoOs;
PeriodoContrato.
```

Não crie serviço para tudo.

Ruim:

```java
EmailService.validar(email);
```

Melhor:

```java
new Email("ana@email.com");
```

Se a regra pertence ao próprio valor, coloque no objeto de valor.

---

## Serviço de domínio versus entidade

Se a regra altera o ciclo de vida de uma entidade, talvez pertença à entidade.

Ruim:

```java
ContratoService.ativar(contrato);
```

Melhor:

```java
contrato.ativar();
```

Ruim:

```java
OrdemServicoService.reagendar(os, periodo);
```

Melhor:

```java
os.reagendar(periodo);
```

Se a ação é natural daquele objeto, deixe no objeto.

---

## Serviço de domínio versus serviço de aplicação

Serviço de aplicação coordena caso de uso.

Exemplo futuro:

```text
ConfirmarPagamentoPedidoUseCase
```

Ele pode:

```text
buscar pedido no repositório;
chamar pedido.confirmarPagamento;
salvar pedido;
publicar evento;
enviar notificação.
```

Isso é aplicação.

Serviço de domínio é diferente.

Ele representa regra de domínio pura.

Exemplo:

```text
PoliticaDescontoPedido
```

calcula desconto.

Não busca pedido no banco.

Não salva pedido.

Não envia notificação.

Essa separação será aprofundada mais adiante.

---

## Perguntas para decidir

Antes de criar serviço de domínio, pergunte:

```text
a regra pertence claramente a uma entidade?
a regra pertence claramente a um objeto de valor?
a regra envolve múltiplos objetos de domínio?
o nome da operação é um conceito de negócio?
a classe ficaria pequena e focada?
ela consegue funcionar sem banco, HTTP ou framework?
ela evita deixar a entidade anêmica?
ela não está virando Service gigante?
```

Se a resposta for boa, serviço de domínio pode fazer sentido.

---

## Bons nomes para serviço de domínio

Prefira nomes específicos:

```text
PoliticaDescontoPedido;
PoliticaAlocacaoTecnico;
ElegibilidadeReagendamentoOs;
CalculadoraRemuneracaoTecnico;
PoliticaCancelamentoContrato;
CalculadoraPrazoAtendimento;
ValidadorJanelaAgendamento.
```

Evite nomes genéricos:

```text
PedidoService;
ContratoService;
OrdemServicoService;
DominioService;
RegraService;
SistemaService;
HelperService.
```

Nomes específicos reduzem chance de virar classe gigante.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Service ruim

Execute:

```text
PedidoServiceRuimApp.java
```

Explique:

```text
qual regra o service roubou do pedido;
por que setStatus é perigoso;
por que isso deixa o pedido anêmico.
```

### Parte 2 — Pedido com comportamento

Execute:

```text
PedidoComportamentoApp.java
```

Explique:

```text
por que confirmarPagamento pertence ao Pedido;
por que não precisa de PedidoService para isso.
```

### Parte 3 — Desconto

Execute:

```text
DescontoDominioApp.java
```

Explique:

```text
por que PoliticaDescontoPedido faz sentido;
quais objetos ela usa;
por que ela não salva nada no banco.
```

### Parte 4 — Alocação

Execute:

```text
AlocacaoTecnicoDominioApp.java
```

Explique:

```text
por que a regra envolve mais de uma OS;
por que a política não substitui OrdemServico;
por que a OS ainda tem atribuirTecnico.
```

### Parte 5 — Classificação

Classifique cada regra:

```text
confirmar pagamento de pedido;
validar formato de e-mail;
calcular desconto por tipo de cliente;
reagendar OS;
alocar técnico considerando agenda;
ativar contrato;
calcular meses de período.
```

Responda se ela parece:

```text
entidade;
objeto de valor;
serviço de domínio.
```

---

## Desafio prático

Crie um serviço de domínio para elegibilidade de reagendamento de OS.

Estrutura sugerida:

```text
src\br\com\curso\aula134\appreagendamento
src\br\com\curso\aula134\dominio\reagendamento
```

Arquivos sugeridos:

```text
appreagendamento\ReagendamentoDominioApp.java

dominio\reagendamento\ElegibilidadeReagendamentoOs.java
dominio\reagendamento\ResultadoElegibilidade.java
```

Pode reutilizar:

```text
dominio\ordemservico\OrdemServico.java
dominio\ordemservico\PeriodoAtendimento.java
dominio\ordemservico\TurnoAtendimento.java
dominio\ordemservico\CodigoOs.java
```

Regras sugeridas:

```text
OS encerrada não é elegível.
Novo período não pode ser nulo.
Novo período deve ser diferente do atual.
Reagendamento para mesma data pode exigir justificativa.
ResultadoElegibilidade deve informar se é elegível e o motivo.
```

Critérios:

```text
ElegibilidadeReagendamentoOs não deve salvar no banco.
ElegibilidadeReagendamentoOs não deve enviar mensagem.
ElegibilidadeReagendamentoOs deve representar regra de domínio.
OrdemServico ainda deve proteger reagendar(...).
O app deve consultar elegibilidade e, se elegível, chamar os.reagendar(...).
```

Exemplo de uso esperado:

```java
ResultadoElegibilidade resultado = elegibilidade.verificar(os, novoPeriodo, "Cliente solicitou ajuste");

if (resultado.elegivel()) {
    os.reagendar(novoPeriodo);
}
```

---

## Erros comuns

### 1. Criar service para toda entidade

Nem toda entidade precisa de `EntidadeService`.

### 2. Tirar comportamento natural da entidade

`pedido.confirmarPagamento` é melhor que `pedidoService.confirmarPagamento`.

### 3. Criar serviço de domínio com infraestrutura

Serviço de domínio não deve acessar banco, HTTP ou e-mail.

### 4. Criar nome genérico

Nome genérico vira classe gigante.

### 5. Confundir serviço de domínio com serviço de aplicação

Domínio representa regra pura. Aplicação coordena caso de uso.

### 6. Criar serviço para objeto de valor

Se a regra é do valor, coloque no valor.

### 7. Deixar entidades anêmicas

Serviço de domínio deve complementar, não enfraquecer entidades.

### 8. Guardar estado desnecessário no serviço

Prefira serviços simples, focados e sem estado mutável.

---

## Debug recomendado

Use debug em:

```text
PedidoServiceRuimApp.java
PedidoComportamentoApp.java
DescontoDominioApp.java
AlocacaoTecnicoDominioApp.java
```

Breakpoints recomendados:

```java
service.confirmarPagamento(...)
pedido.setStatus(...)

pedido.confirmarPagamento(...)

politicaDesconto.calcularDesconto(...)
pedido.aplicarDesconto(...)
pedido.confirmarPagamento(...)

politica.alocar(...)
os.atribuirTecnico(...)
ordem.mesmoTecnico(...)
ordem.periodo().mesmaData(...)
```

Observe:

```text
quando o service ruim rouba regra;
quando a entidade forte protege sua regra;
quando a política de desconto usa Cliente e Pedido;
quando a política de alocação coordena múltiplos objetos;
quando o serviço de domínio não acessa infraestrutura.
```

O objetivo é enxergar onde cada regra deve morar.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é um serviço de domínio?
2. Quando uma regra deve ficar na entidade em vez de virar serviço?
3. Qual exemplo de regra envolvendo múltiplos objetos poderia virar serviço de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar serviço de domínio;
diferenciar serviço de domínio de service gigante;
diferenciar serviço de domínio de serviço de aplicação;
manter regras naturais dentro da entidade;
evitar domínio anêmico;
criar política de domínio pequena e focada;
nomear serviço de domínio com conceito de negócio;
evitar infraestrutura dentro do domínio;
usar serviço de domínio para regra envolvendo múltiplos objetos;
resolver o desafio de elegibilidade de reagendamento;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-134-servicos-de-dominio-inicial
git commit -m "Aula 134: pratica servicos de dominio inicial"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
serviço de domínio representa uma regra de negócio que não pertence naturalmente a uma única entidade ou objeto de valor.
```

Você viu que serviço de domínio não é desculpa para criar classe gigante nem para tirar comportamento das entidades.

Também viu que bons serviços de domínio são pequenos, focados, puros e nomeados com linguagem de negócio.

Na próxima aula, vamos estudar factories simples.

Vamos entender quando a criação de um objeto começa a ter regra suficiente para merecer uma classe ou método de fábrica, sem espalhar construção complexa pelo sistema.
