# 140 — M4.36 — Limites de responsabilidade do domínio

## Objetivo da aula

Nesta aula você vai aprender os limites de responsabilidade do domínio.

Na aula anterior, você estudou agregados em uma visão inicial e viu que uma raiz protege um conjunto de objetos relacionados. Agora precisamos responder uma pergunta essencial:

```text
o que deve ficar dentro do domínio e o que deve ficar fora dele?
```

Ao final da aula, você deve conseguir:

```text
explicar o papel do domínio;
identificar responsabilidades que pertencem ao domínio;
identificar responsabilidades que não pertencem ao domínio;
evitar colocar banco de dados dentro de entidade;
evitar colocar HTTP, e-mail, arquivo, tela ou console dentro de entidade;
separar regra de negócio de infraestrutura;
entender a diferença inicial entre domínio, aplicação e infraestrutura;
modelar entidades mais puras;
coordenar ações fora do domínio sem enfraquecer o domínio;
aplicar isso em Pedido, OrdemServico e Contrato.
```

Essa aula é uma das mais importantes para preparar você para arquitetura backend.

Um domínio forte não é apenas uma classe com regras.

Um domínio forte também sabe o que não deve fazer.

---

## A ideia central

Domínio deve representar regras de negócio.

Ele deve saber responder coisas como:

```text
pedido pode ser pago?
pedido pode ser cancelado?
contrato pode ser ativado?
OS pode ser reagendada?
produto tem estoque suficiente?
checklist pode ser finalizado?
pagamento pode ser estornado?
```

Mas domínio não deveria saber detalhes como:

```text
como salvar no banco;
como enviar e-mail;
como chamar uma API HTTP;
como montar JSON;
como imprimir no console;
como ler do teclado;
como acessar arquivo;
como montar tela;
como abrir conexão;
qual controller chamou a regra.
```

A regra prática é:

```text
domínio decide regra;
outras camadas executam detalhes externos.
```

---

## O que pertence ao domínio

Pertence ao domínio:

```text
entidades;
objetos de valor;
regras de negócio;
invariantes;
transições de estado;
cálculos de negócio;
validações essenciais;
métodos de domínio;
agregados;
políticas de domínio;
serviços de domínio puros.
```

Exemplos:

```java
pedido.confirmarPagamento(valorPago);
pedido.cancelar("motivo");
contrato.ativar();
os.reagendar(periodo);
produto.reservarEstoque(quantidade);
pagamento.estornar("motivo");
```

Essas ações são regras do negócio.

Elas pertencem ao domínio.

---

## O que não pertence ao domínio

Não deveria ficar dentro de entidade ou objeto de valor:

```text
System.out.println como regra principal;
Scanner;
SQL;
JDBC;
EntityManager;
Repository;
HTTP client;
controller;
request;
response;
JSON;
HTML;
e-mail SMTP;
WhatsApp;
arquivo;
planilha;
fila;
cache;
logs técnicos excessivos;
variáveis de ambiente;
framework Spring.
```

Exemplo ruim:

```java
public void confirmarPagamento(Dinheiro valorPago) {
    status = StatusPedido.PAGO;
    emailService.enviar(...);
    pedidoRepository.save(this);
}
```

A entidade misturou regra de pagamento com e-mail e persistência.

Isso cria acoplamento perigoso.

---

## Domínio puro não significa domínio inútil

Separar infraestrutura não significa deixar a entidade fraca.

A entidade ainda deve ter comportamento.

Ruim:

```java
pedidoService.confirmarPagamento(pedido, valorPago);
```

quando `Pedido` poderia fazer:

```java
pedido.confirmarPagamento(valorPago);
```

Melhor:

```java
pedido.confirmarPagamento(valorPago);
repositorio.salvar(pedido);
notificador.enviarConfirmacao(pedido);
```

O domínio decide e muda estado.

A aplicação coordena salvamento e notificação.

Essa diferença é fundamental.

---

## Exemplo ruim — Entidade misturada com infraestrutura

Crie a pasta da aula:

```powershell
mkdir labs\m4\aula-140-limites-de-responsabilidade-do-dominio
cd labs\m4\aula-140-limites-de-responsabilidade-do-dominio
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula140
mkdir src\br\com\curso\aula140\app
mkdir src\br\com\curso\aula140\exemplo
mkdir src\br\com\curso\aula140\exemplo\ruim
mkdir src\br\com\curso\aula140\dominio
mkdir src\br\com\curso\aula140\dominio\valor
mkdir src\br\com\curso\aula140\dominio\cliente
mkdir src\br\com\curso\aula140\dominio\pedido
mkdir src\br\com\curso\aula140\dominio\ordemservico
mkdir src\br\com\curso\aula140\dominio\contrato
mkdir src\br\com\curso\aula140\aplicacao
mkdir src\br\com\curso\aula140\infra
```

Agora crie:

```text
src\br\com\curso\aula140\exemplo\ruim\PedidoMisturadoApp.java
```

Código:

```java
package br.com.curso.aula140.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoMisturadoApp {
    public static void main(String[] args) {
        PedidoMisturado pedido = new PedidoMisturado(
                1001,
                "ana@email.com",
                new BigDecimal("399.80")
        );

        pedido.confirmarPagamento(new BigDecimal("399.80"));

        System.out.println();
        System.out.println(pedido.resumo());
    }
}

class PedidoMisturado {
    private final int numero;
    private final String emailCliente;
    private final BigDecimal total;
    private String status;

    PedidoMisturado(int numero, String emailCliente, BigDecimal total) {
        this.numero = numero;
        this.emailCliente = emailCliente;
        this.total = total.setScale(2, RoundingMode.HALF_UP);
        this.status = "CRIADO";
    }

    void confirmarPagamento(BigDecimal valorPago) {
        if (!"CRIADO".equals(status)) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || valorPago.compareTo(total) < 0) {
            throw new IllegalArgumentException("Valor pago não cobre o total.");
        }

        status = "PAGO";

        System.out.println("ENVIANDO E-MAIL para " + emailCliente);
        System.out.println("Assunto: pagamento confirmado do pedido " + numero);

        System.out.println("SALVANDO NO BANCO:");
        System.out.println("UPDATE pedido SET status = 'PAGO' WHERE numero = " + numero);

        System.out.println("CHAMANDO API EXTERNA:");
        System.out.println("POST /integracoes/pedidos/" + numero + "/pagamento-confirmado");
    }

    String resumo() {
        return "Pedido " + numero
                + " | E-mail: " + emailCliente
                + " | Total: R$ " + total
                + " | Status: " + status;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula140.exemplo.ruim.PedidoMisturadoApp
```

---

## O que há de errado

O método `confirmarPagamento` mistura:

```text
regra de pagamento;
envio de e-mail;
simulação de banco;
simulação de API externa;
impressão no console;
status como String.
```

A entidade ficou acoplada a detalhes externos.

Mesmo sendo uma simulação com `System.out.println`, o problema conceitual aparece.

O pedido deveria saber confirmar pagamento.

Mas não deveria saber como enviar e-mail, como salvar no banco ou como chamar API.

---

## Problemas práticos desse modelo

Esse tipo de mistura gera:

```text
código difícil de testar;
entidade dependente de infraestrutura;
regra de negócio presa ao modo de execução;
difícil trocar e-mail por WhatsApp;
difícil trocar banco;
difícil reaproveitar domínio em outro contexto;
dificuldade para rodar regra sem efeitos externos;
entidade grande demais;
quebra de responsabilidade.
```

Imagine que amanhã o pagamento precise ser confirmado por:

```text
API REST;
mensageria;
job noturno;
importação de arquivo;
teste automatizado;
tela administrativa.
```

Se a entidade conhece detalhes externos, ela fica pesada e difícil de reutilizar.

---

## Separando responsabilidades

Vamos separar em três ideias iniciais:

```text
Domínio:
contém regra de negócio.

Aplicação:
coordena o caso de uso.

Infraestrutura:
executa detalhes externos.
```

Exemplo:

```text
Domínio:
Pedido.confirmarPagamento(...)

Aplicação:
ConfirmarPagamentoPedidoUseCase.executar(...)

Infraestrutura:
NotificadorEmailConsole.enviar(...)
PedidoRepositorioMemoria.salvar(...)
```

Nesta aula vamos criar versões simples, sem Spring e sem banco real.

O objetivo é entender a separação.

---

## Criando Dinheiro

Crie:

```text
src\br\com\curso\aula140\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula140.dominio.valor;

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

## Cliente

Crie:

```text
src\br\com\curso\aula140\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula140.dominio.cliente;

public class Cliente {
    private final int id;
    private final String nome;
    private final String email;
    private final boolean ativo;

    public Cliente(int id, String nome, String email) {
        this(id, nome, email, true);
    }

    public Cliente(int id, String nome, String email, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.ativo = ativo;
    }

    public boolean ativo() {
        return ativo;
    }

    public String email() {
        return email;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome + " | E-mail: " + email + " | Ativo: " + ativo;
    }
}
```

---

## Pedido de domínio puro

Crie:

```text
src\br\com\curso\aula140\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula140.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula140\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula140.dominio.pedido;

import br.com.curso.aula140.dominio.cliente.Cliente;
import br.com.curso.aula140.dominio.valor.Dinheiro;

public class Pedido {
    private final int numero;
    private final Cliente cliente;
    private final Dinheiro total;
    private StatusPedido status;
    private String motivoCancelamento;

    public Pedido(int numero, Cliente cliente, Dinheiro total) {
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

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = StatusPedido.CRIADO;
        this.motivoCancelamento = "";
    }

    public int numero() {
        return numero;
    }

    public Cliente cliente() {
        return cliente;
    }

    public Dinheiro total() {
        return total;
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
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

---

## O que esse Pedido não faz

O pedido agora não faz:

```text
não salva no banco;
não envia e-mail;
não chama API;
não imprime no console;
não sabe SQL;
não sabe JSON;
não sabe controller;
não sabe framework.
```

Ele faz o que é do domínio:

```text
nasce válido;
valida cliente ativo;
valida total positivo;
confirma pagamento;
cancela;
protege transições de estado.
```

Isso é limite de responsabilidade.

---

## Infraestrutura simples: repositório em memória

Agora vamos criar uma simulação de infraestrutura.

Crie:

```text
src\br\com\curso\aula140\infra\PedidoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula140.infra;

import br.com.curso.aula140.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;

public class PedidoRepositorioMemoria {
    private final List<Pedido> pedidos;

    public PedidoRepositorioMemoria() {
        this.pedidos = new ArrayList<>();
    }

    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.add(pedido);
        System.out.println("[INFRA] Pedido salvo em memória: " + pedido.numero());
    }

    public int quantidadePedidos() {
        return pedidos.size();
    }
}
```

Esse repositório é didático.

Ele simula persistência em memória.

Ele fica em `infra`, não no domínio.

---

## Infraestrutura simples: notificador

Crie:

```text
src\br\com\curso\aula140\infra\NotificadorPedidoConsole.java
```

Código:

```java
package br.com.curso.aula140.infra;

import br.com.curso.aula140.dominio.pedido.Pedido;

public class NotificadorPedidoConsole {
    public void enviarPagamentoConfirmado(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("[INFRA] Enviando notificação para " + pedido.cliente().email());
        System.out.println("[INFRA] Pagamento confirmado do pedido " + pedido.numero());
    }
}
```

Esse notificador imprime no console para estudo.

Em sistema real, poderia enviar e-mail, WhatsApp ou mensagem.

Mas isso fica fora do domínio.

---

## Aplicação coordenando o caso de uso

Agora crie:

```text
src\br\com\curso\aula140\aplicacao\ConfirmarPagamentoPedidoUseCase.java
```

Código:

```java
package br.com.curso.aula140.aplicacao;

import br.com.curso.aula140.dominio.pedido.Pedido;
import br.com.curso.aula140.dominio.valor.Dinheiro;
import br.com.curso.aula140.infra.NotificadorPedidoConsole;
import br.com.curso.aula140.infra.PedidoRepositorioMemoria;

public class ConfirmarPagamentoPedidoUseCase {
    private final PedidoRepositorioMemoria repositorio;
    private final NotificadorPedidoConsole notificador;

    public ConfirmarPagamentoPedidoUseCase(
            PedidoRepositorioMemoria repositorio,
            NotificadorPedidoConsole notificador
    ) {
        if (repositorio == null) {
            throw new IllegalArgumentException("Repositório é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        this.repositorio = repositorio;
        this.notificador = notificador;
    }

    public void executar(Pedido pedido, Dinheiro valorPago) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedido.confirmarPagamento(valorPago);

        repositorio.salvar(pedido);
        notificador.enviarPagamentoConfirmado(pedido);
    }
}
```

Este use case coordena:

```text
chamar regra de domínio;
salvar;
notificar.
```

Ele não substitui a regra do pedido.

Ele apenas organiza o fluxo.

---

## App usando a separação

Crie:

```text
src\br\com\curso\aula140\app\PedidoSeparadoApp.java
```

Código:

```java
package br.com.curso.aula140.app;

import br.com.curso.aula140.aplicacao.ConfirmarPagamentoPedidoUseCase;
import br.com.curso.aula140.dominio.cliente.Cliente;
import br.com.curso.aula140.dominio.pedido.Pedido;
import br.com.curso.aula140.dominio.valor.Dinheiro;
import br.com.curso.aula140.infra.NotificadorPedidoConsole;
import br.com.curso.aula140.infra.PedidoRepositorioMemoria;

public class PedidoSeparadoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        Pedido pedido = new Pedido(
                1001,
                cliente,
                Dinheiro.de("399.80")
        );

        PedidoRepositorioMemoria repositorio = new PedidoRepositorioMemoria();
        NotificadorPedidoConsole notificador = new NotificadorPedidoConsole();

        ConfirmarPagamentoPedidoUseCase useCase = new ConfirmarPagamentoPedidoUseCase(
                repositorio,
                notificador
        );

        useCase.executar(
                pedido,
                Dinheiro.de("399.80")
        );

        System.out.println();
        System.out.println(pedido.resumo());
        System.out.println("Pedidos salvos: " + repositorio.quantidadePedidos());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula140.app.PedidoSeparadoApp
```

---

## O que melhorou

Agora cada parte tem um papel.

Domínio:

```java
pedido.confirmarPagamento(valorPago);
```

Aplicação:

```java
useCase.executar(pedido, valorPago);
```

Infraestrutura:

```java
repositorio.salvar(pedido);
notificador.enviarPagamentoConfirmado(pedido);
```

O pedido não sabe como será salvo.

O pedido não sabe como será notificado.

Mesmo assim, ele protege a regra de pagamento.

Esse é o equilíbrio correto.

---

## Mas o domínio pode retornar dados?

Sim.

O domínio pode expor informações necessárias por métodos de consulta.

Exemplo:

```java
pedido.numero()
pedido.cliente()
pedido.total()
pedido.pago()
pedido.resumo()
```

O problema não é consultar.

O problema é o domínio depender de detalhes externos.

Também é preciso cuidado para não transformar consulta em quebra de encapsulamento.

Exemplo perigoso:

```java
pedido.itens().clear();
```

Por isso, coleções devem ser protegidas.

---

## Sobre o método resumo

Nas aulas usamos muito:

```java
resumo()
```

Ele é útil para estudo, console e debug.

Em um sistema real, você deve tomar cuidado para não colocar regra de apresentação complexa dentro do domínio.

Exemplo aceitável para estudo:

```java
pedido.resumo()
```

Exemplo suspeito:

```java
pedido.toJson()
pedido.gerarHtml()
pedido.montarResponseHttp()
```

Esses últimos pertencem a camadas externas.

---

## Exemplo 2 — OrdemServico com limite de responsabilidade

Agora vamos aplicar a ideia em OS.

A OS deve saber:

```text
reagendar;
concluir;
cancelar;
registrar ocorrência interna;
validar estado.
```

Mas não deve saber:

```text
enviar WhatsApp;
salvar no banco;
chamar API de agenda;
imprimir etiqueta;
montar JSON para integração.
```

---

## Código da OS

Crie:

```text
src\br\com\curso\aula140\dominio\ordemservico\CodigoOs.java
```

Código:

```java
package br.com.curso.aula140.dominio.ordemservico;

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
src\br\com\curso\aula140\dominio\ordemservico\TurnoAtendimento.java
```

Código:

```java
package br.com.curso.aula140.dominio.ordemservico;

public enum TurnoAtendimento {
    MANHA,
    TARDE
}
```

Crie:

```text
src\br\com\curso\aula140\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula140.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula140\dominio\ordemservico\PeriodoAtendimento.java
```

Código:

```java
package br.com.curso.aula140.dominio.ordemservico;

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
src\br\com\curso\aula140\dominio\ordemservico\OcorrenciaOs.java
```

Código:

```java
package br.com.curso.aula140.dominio.ordemservico;

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

## OrdemServico domínio

Crie:

```text
src\br\com\curso\aula140\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula140.dominio.ordemservico;

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

    public CodigoOs codigo() {
        return codigo;
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

A OS registra ocorrências internas.

Mas não envia mensagem.

Não salva banco.

Não chama API externa.

---

## Infraestrutura de OS

Crie:

```text
src\br\com\curso\aula140\infra\OrdemServicoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula140.infra;

import br.com.curso.aula140.dominio.ordemservico.OrdemServico;

import java.util.ArrayList;
import java.util.List;

public class OrdemServicoRepositorioMemoria {
    private final List<OrdemServico> ordens;

    public OrdemServicoRepositorioMemoria() {
        this.ordens = new ArrayList<>();
    }

    public void salvar(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        ordens.add(os);
        System.out.println("[INFRA] OS salva em memória: " + os.codigo());
    }

    public int quantidade() {
        return ordens.size();
    }
}
```

Crie:

```text
src\br\com\curso\aula140\infra\NotificadorOsConsole.java
```

Código:

```java
package br.com.curso.aula140.infra;

import br.com.curso.aula140.dominio.ordemservico.OrdemServico;

public class NotificadorOsConsole {
    public void enviarReagendamento(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        System.out.println("[INFRA] Enviando notificação de reagendamento da OS " + os.codigo());
    }
}
```

---

## Aplicação coordenando reagendamento

Crie:

```text
src\br\com\curso\aula140\aplicacao\ReagendarOrdemServicoUseCase.java
```

Código:

```java
package br.com.curso.aula140.aplicacao;

import br.com.curso.aula140.dominio.ordemservico.OrdemServico;
import br.com.curso.aula140.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula140.infra.NotificadorOsConsole;
import br.com.curso.aula140.infra.OrdemServicoRepositorioMemoria;

public class ReagendarOrdemServicoUseCase {
    private final OrdemServicoRepositorioMemoria repositorio;
    private final NotificadorOsConsole notificador;

    public ReagendarOrdemServicoUseCase(
            OrdemServicoRepositorioMemoria repositorio,
            NotificadorOsConsole notificador
    ) {
        if (repositorio == null) {
            throw new IllegalArgumentException("Repositório é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        this.repositorio = repositorio;
        this.notificador = notificador;
    }

    public void executar(OrdemServico os, PeriodoAtendimento novoPeriodo) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        os.reagendar(novoPeriodo);

        repositorio.salvar(os);
        notificador.enviarReagendamento(os);
    }
}
```

---

## App de OS separado

Crie:

```text
src\br\com\curso\aula140\app\OrdemServicoSeparadaApp.java
```

Código:

```java
package br.com.curso.aula140.app;

import br.com.curso.aula140.aplicacao.ReagendarOrdemServicoUseCase;
import br.com.curso.aula140.dominio.ordemservico.CodigoOs;
import br.com.curso.aula140.dominio.ordemservico.OrdemServico;
import br.com.curso.aula140.dominio.ordemservico.PeriodoAtendimento;
import br.com.curso.aula140.dominio.ordemservico.TurnoAtendimento;
import br.com.curso.aula140.infra.NotificadorOsConsole;
import br.com.curso.aula140.infra.OrdemServicoRepositorioMemoria;

import java.time.LocalDate;

public class OrdemServicoSeparadaApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(1),
                        TurnoAtendimento.MANHA
                )
        );

        OrdemServicoRepositorioMemoria repositorio = new OrdemServicoRepositorioMemoria();
        NotificadorOsConsole notificador = new NotificadorOsConsole();

        ReagendarOrdemServicoUseCase useCase = new ReagendarOrdemServicoUseCase(
                repositorio,
                notificador
        );

        useCase.executar(
                os,
                new PeriodoAtendimento(
                        LocalDate.now().plusDays(3),
                        TurnoAtendimento.TARDE
                )
        );

        System.out.println();
        System.out.println(os.resumo());
        System.out.println("Ordens salvas: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula140.app.OrdemServicoSeparadaApp
```

---

## Exemplo 3 — Contrato e limites

Contrato deve saber:

```text
ativar;
cancelar;
adicionar serviço;
remover serviço;
calcular valor total;
bloquear alteração depois de ativo.
```

Contrato não deve saber:

```text
salvar contrato;
exportar planilha;
enviar assinatura digital;
chamar API de faturamento;
montar PDF;
montar resposta HTTP.
```

Vamos criar uma versão curta reforçando essa separação.

---

## StatusContrato e Serviço

Crie:

```text
src\br\com\curso\aula140\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula140.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula140\dominio\contrato\ServicoContrato.java
```

Código:

```java
package br.com.curso.aula140.dominio.contrato;

import br.com.curso.aula140.dominio.valor.Dinheiro;

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

## Contrato domínio

Crie:

```text
src\br\com\curso\aula140\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula140.dominio.contrato;

import br.com.curso.aula140.dominio.cliente.Cliente;
import br.com.curso.aula140.dominio.valor.Dinheiro;

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

    public String codigo() {
        return codigo;
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

## Infra e aplicação de contrato

Crie:

```text
src\br\com\curso\aula140\infra\ContratoRepositorioMemoria.java
```

Código:

```java
package br.com.curso.aula140.infra;

import br.com.curso.aula140.dominio.contrato.Contrato;

import java.util.ArrayList;
import java.util.List;

public class ContratoRepositorioMemoria {
    private final List<Contrato> contratos;

    public ContratoRepositorioMemoria() {
        this.contratos = new ArrayList<>();
    }

    public void salvar(Contrato contrato) {
        if (contrato == null) {
            throw new IllegalArgumentException("Contrato é obrigatório.");
        }

        contratos.add(contrato);
        System.out.println("[INFRA] Contrato salvo em memória: " + contrato.codigo());
    }

    public int quantidade() {
        return contratos.size();
    }
}
```

Crie:

```text
src\br\com\curso\aula140\infra\NotificadorContratoConsole.java
```

Código:

```java
package br.com.curso.aula140.infra;

import br.com.curso.aula140.dominio.contrato.Contrato;

public class NotificadorContratoConsole {
    public void enviarContratoAtivado(Contrato contrato) {
        if (contrato == null) {
            throw new IllegalArgumentException("Contrato é obrigatório.");
        }

        System.out.println("[INFRA] Enviando notificação de contrato ativado: " + contrato.codigo());
    }
}
```

Crie:

```text
src\br\com\curso\aula140\aplicacao\AtivarContratoUseCase.java
```

Código:

```java
package br.com.curso.aula140.aplicacao;

import br.com.curso.aula140.dominio.contrato.Contrato;
import br.com.curso.aula140.infra.ContratoRepositorioMemoria;
import br.com.curso.aula140.infra.NotificadorContratoConsole;

public class AtivarContratoUseCase {
    private final ContratoRepositorioMemoria repositorio;
    private final NotificadorContratoConsole notificador;

    public AtivarContratoUseCase(
            ContratoRepositorioMemoria repositorio,
            NotificadorContratoConsole notificador
    ) {
        if (repositorio == null) {
            throw new IllegalArgumentException("Repositório é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        this.repositorio = repositorio;
        this.notificador = notificador;
    }

    public void executar(Contrato contrato) {
        if (contrato == null) {
            throw new IllegalArgumentException("Contrato é obrigatório.");
        }

        contrato.ativar();

        repositorio.salvar(contrato);
        notificador.enviarContratoAtivado(contrato);
    }
}
```

---

## App de contrato separado

Crie:

```text
src\br\com\curso\aula140\app\ContratoSeparadoApp.java
```

Código:

```java
package br.com.curso.aula140.app;

import br.com.curso.aula140.aplicacao.AtivarContratoUseCase;
import br.com.curso.aula140.dominio.cliente.Cliente;
import br.com.curso.aula140.dominio.contrato.Contrato;
import br.com.curso.aula140.dominio.valor.Dinheiro;
import br.com.curso.aula140.infra.ContratoRepositorioMemoria;
import br.com.curso.aula140.infra.NotificadorContratoConsole;

public class ContratoSeparadoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                20,
                "Cliente Corporativo A",
                "contratos@cliente.com"
        );

        Contrato contrato = new Contrato(
                "CONT-001",
                cliente
        );

        contrato.adicionarServico("SERV-001", "Instalação", Dinheiro.de("150.00"));
        contrato.adicionarServico("SERV-002", "Manutenção", Dinheiro.de("80.00"));

        ContratoRepositorioMemoria repositorio = new ContratoRepositorioMemoria();
        NotificadorContratoConsole notificador = new NotificadorContratoConsole();

        AtivarContratoUseCase useCase = new AtivarContratoUseCase(
                repositorio,
                notificador
        );

        useCase.executar(contrato);

        System.out.println();
        System.out.println(contrato.resumo());
        System.out.println("Contratos salvos: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula140.app.ContratoSeparadoApp
```

---

## O que este modelo prepara

Esse modelo prepara você para arquitetura real.

Mais adiante, com Spring, teremos nomes como:

```text
Controller;
UseCase;
Service de aplicação;
Repository;
Entity;
DTO;
Mapper;
Gateway;
Client HTTP.
```

Mas a ideia central será a mesma:

```text
domínio não deve depender dos detalhes externos.
```

O domínio deve ficar mais perto da regra.

Infraestrutura deve ficar mais perto da tecnologia.

Aplicação coordena o fluxo.

---

## Atenção: não exagere cedo demais

Esta aula mostra uma separação inicial.

Não significa que todo programinha precisa ter vinte pacotes.

Em projetos pequenos, você pode ser mais simples.

Mas precisa entender o princípio.

O erro que queremos evitar é:

```text
entidade que salva a si mesma no banco;
entidade que envia e-mail;
entidade que lê Scanner;
entidade que monta JSON;
entidade que chama API externa.
```

Esses acoplamentos cobram preço em sistemas reais.

---

## O que fica no domínio

Use esta lista como referência.

Domínio deve conter:

```text
regras de negócio;
invariantes;
cálculos de negócio;
transições de estado;
validações essenciais;
objetos de valor;
entidades;
agregados;
serviços de domínio puros;
eventos internos simples;
políticas de domínio.
```

Exemplos:

```text
calcular total do pedido;
validar período de contrato;
bloquear cancelamento de pedido pago;
bloquear reagendamento de OS concluída;
exigir serviço antes de ativar contrato;
validar dinheiro positivo;
validar código de OS.
```

---

## O que fica fora do domínio

Fica fora:

```text
banco de dados;
SQL;
JPA;
HTTP;
controller;
DTO;
JSON;
HTML;
arquivo;
e-mail;
WhatsApp;
fila;
cache;
mensageria;
logs técnicos;
autenticação técnica;
framework;
configuração;
variáveis de ambiente.
```

Esses itens aparecem em outras camadas.

O domínio pode gerar uma intenção.

Exemplo:

```text
pagamento confirmado.
```

Mas quem envia a mensagem é outro componente.

---

## Caso especial: data e hora

Nas aulas anteriores, alguns objetos registraram `LocalDateTime.now()` em eventos e ocorrências.

Para estudo, isso é aceitável.

Mas em sistemas reais, quando o tempo influencia regra importante, pode ser melhor receber a data/hora por parâmetro.

Exemplo:

```java
pedido.confirmarPagamento(valorPago, dataHoraConfirmacao);
```

ou usar um componente de relógio em uma camada apropriada.

Por enquanto, entenda a ideia:

```text
se o tempo é só registro simples, pode ser tolerável no início;
se o tempo é regra crítica, controle melhor essa dependência.
```

---

## Caso especial: exceções

Exceções de regra de domínio podem ficar no domínio.

Exemplo:

```java
throw new IllegalStateException("Pedido pago não pode ser cancelado.");
```

Isso não é infraestrutura.

É regra.

Mais adiante, podemos criar exceções específicas:

```text
RegraDeNegocioException;
PedidoInvalidoException;
ContratoInvalidoException.
```

Por enquanto, usar `IllegalArgumentException` e `IllegalStateException` é suficiente para o nível atual.

---

## Caso especial: logs

Log técnico normalmente fica fora da entidade.

Evite:

```java
logger.info("Salvando pedido...");
```

dentro do domínio.

Mas mensagens de domínio podem existir como eventos internos ou histórico:

```text
"Pedido criado";
"Pagamento confirmado";
"OS reagendada";
```

A diferença:

```text
log técnico é para observabilidade da aplicação;
evento/histórico de domínio representa algo que aconteceu no negócio.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Entidade misturada

Execute:

```text
PedidoMisturadoApp.java
```

Explique:

```text
quais responsabilidades estão misturadas;
por que isso dificulta teste;
o que deveria sair do Pedido.
```

### Parte 2 — Pedido separado

Execute:

```text
PedidoSeparadoApp.java
```

Explique:

```text
o que ficou no domínio;
o que ficou na aplicação;
o que ficou na infraestrutura.
```

### Parte 3 — OS separada

Execute:

```text
OrdemServicoSeparadaApp.java
```

Explique:

```text
por que reagendar pertence à OS;
por que salvar e notificar ficaram fora.
```

### Parte 4 — Contrato separado

Execute:

```text
ContratoSeparadoApp.java
```

Explique:

```text
por que ativar pertence ao contrato;
por que repositório e notificador ficaram fora.
```

### Parte 5 — Classificação

Classifique cada item como:

```text
domínio;
aplicação;
infraestrutura.
```

Itens:

```text
Pedido.confirmarPagamento;
NotificadorPedidoConsole.enviarPagamentoConfirmado;
ConfirmarPagamentoPedidoUseCase.executar;
Contrato.ativar;
ContratoRepositorioMemoria.salvar;
OrdemServico.reagendar;
ReagendarOrdemServicoUseCase.executar;
PeriodoAtendimento;
Dinheiro;
Controller HTTP;
DTO de resposta;
SQL INSERT.
```

---

## Desafio prático

Crie um fluxo separado para `Pagamento`.

Estrutura sugerida:

```text
src\br\com\curso\aula140\apppagamento
src\br\com\curso\aula140\dominio\pagamento
```

Arquivos sugeridos:

```text
apppagamento\PagamentoSeparadoApp.java

dominio\pagamento\CodigoPagamento.java
dominio\pagamento\StatusPagamento.java
dominio\pagamento\Pagamento.java

aplicacao\ConfirmarPagamentoUseCase.java
aplicacao\EstornarPagamentoUseCase.java

infra\PagamentoRepositorioMemoria.java
infra\NotificadorPagamentoConsole.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras de domínio:

```text
Pagamento tem código, valor, status e motivoEstorno.
Pagamento nasce PENDENTE.
Pagamento PENDENTE pode confirmar.
Pagamento CONFIRMADO pode estornar.
Pagamento ESTORNADO não pode confirmar novamente.
Pagamento PENDENTE não pode estornar.
Estorno exige motivo.
Valor precisa ser positivo.
```

Responsabilidades:

```text
Pagamento confirma e estorna.
UseCase coordena confirmar/estornar.
Repositorio salva.
Notificador avisa.
App monta cenário.
```

Evite no domínio:

```text
System.out.println de envio;
SQL;
repository;
notificador;
JSON;
controller;
arquivo.
```

Critério principal:

```text
Pagamento deve proteger regra, mas não deve executar infraestrutura.
```

---

## Erros comuns

### 1. Entidade salvando no banco

A entidade não deve conhecer repositório, SQL ou banco.

### 2. Entidade enviando e-mail

Notificação é detalhe externo.

### 3. Entidade chamando API

HTTP não pertence ao domínio.

### 4. Service de aplicação roubando regra

O use case coordena, mas a regra natural continua na entidade.

### 5. Domínio anêmico por medo de acoplamento

Separar infraestrutura não significa tirar comportamento do domínio.

### 6. Misturar DTO com domínio

DTO transporta dados. Domínio protege regra.

### 7. Colocar JSON no domínio

JSON é formato externo.

### 8. Exagerar na separação em exemplo pequeno

Entenda o princípio, mas aplique com equilíbrio.

---

## Debug recomendado

Use debug em:

```text
PedidoMisturadoApp.java
PedidoSeparadoApp.java
OrdemServicoSeparadaApp.java
ContratoSeparadoApp.java
```

Breakpoints recomendados:

```java
PedidoMisturado.confirmarPagamento(...)

Pedido.confirmarPagamento(...)
ConfirmarPagamentoPedidoUseCase.executar(...)
PedidoRepositorioMemoria.salvar(...)
NotificadorPedidoConsole.enviarPagamentoConfirmado(...)

OrdemServico.reagendar(...)
ReagendarOrdemServicoUseCase.executar(...)
OrdemServicoRepositorioMemoria.salvar(...)
NotificadorOsConsole.enviarReagendamento(...)

Contrato.ativar()
AtivarContratoUseCase.executar(...)
ContratoRepositorioMemoria.salvar(...)
NotificadorContratoConsole.enviarContratoAtivado(...)
```

Observe:

```text
onde a regra é aplicada;
onde a infraestrutura é executada;
quem coordena o fluxo;
quem não deveria conhecer quem;
como o domínio continua funcionando sem banco real.
```

O objetivo é enxergar os limites.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que deve ficar dentro do domínio?
2. O que não deve ficar dentro de uma entidade?
3. Qual é a diferença inicial entre domínio, aplicação e infraestrutura?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar limites do domínio;
identificar responsabilidades de domínio;
identificar responsabilidades de infraestrutura;
entender papel inicial da aplicação;
evitar banco dentro da entidade;
evitar e-mail dentro da entidade;
evitar HTTP dentro da entidade;
manter regra dentro do domínio;
coordenar fluxo em use case simples;
separar Pedido, OrdemServico e Contrato em domínio/aplicação/infra;
resolver o desafio de Pagamento;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-140-limites-de-responsabilidade-do-dominio
git commit -m "Aula 140: pratica limites de responsabilidade do dominio"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
domínio deve proteger regras de negócio, mas não deve depender de detalhes externos como banco, HTTP, e-mail, console ou framework.
```

Você viu que a entidade continua forte, mas a aplicação coordena o fluxo e a infraestrutura executa detalhes externos.

Essa separação é uma das bases para backend profissional.

Na próxima aula, vamos fazer uma revisão prática do módulo de Orientação a Objetos até aqui.

Vamos juntar encapsulamento, composição, coleções, agregados, factories, builder e limites de domínio em um exercício maior e mais integrado.
