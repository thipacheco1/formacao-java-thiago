# 233 — M10.11 — Observer Pattern: eventos, notificações e reações de domínio

## Objetivo da aula

Na aula anterior, você estudou:

```text
Command Pattern
```

Você viu que Command ajuda quando uma ação precisa ser encapsulada como objeto, permitindo:

```text
execução padronizada;
auditoria;
fila;
reprocessamento;
registro de sucesso;
registro de falha;
padronização de comandos de negócio.
```

Agora vamos estudar outro padrão comportamental muito importante para backend:

```text
Observer Pattern
```

Em português:

```text
Padrão Observador
```

Esse padrão aparece quando algo acontece no sistema e várias partes precisam reagir a esse acontecimento sem ficarem fortemente acopladas.

Exemplos comuns:

```text
pedido pago;
pedido cancelado;
ordem de serviço criada;
ordem de serviço concluída;
transação aprovada;
mensagem enviada;
importação finalizada;
cliente cadastrado;
contrato ativado;
cotação aprovada;
pagamento recusado;
arquivo processado;
evento de domínio publicado.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Observer resolve;
criar eventos;
criar listeners/observers;
criar um publicador de eventos;
registrar vários observers para o mesmo evento;
desacoplar ação principal de reações secundárias;
aplicar Observer em pedido pago;
aplicar Observer em OS criada;
diferenciar Observer de Command;
diferenciar Observer de Chain;
diferenciar Observer de Adapter;
entender eventos de domínio;
entender como isso prepara mensageria, eventos e arquitetura orientada a eventos.
```

---

## Ideia principal

Observer permite que objetos interessados sejam avisados quando algo acontece.

Exemplo:

```text
Pedido foi pago.
```

Várias reações podem acontecer:

```text
enviar mensagem para cliente;
registrar auditoria;
emitir evento financeiro;
baixar estoque;
gerar ocorrência;
notificar área interna;
publicar evento para outro sistema.
```

Sem Observer, o use case ou service pode ficar assim:

```java
pedido.pagar();
repository.salvar(pedido);
notificador.enviar(...);
auditoria.registrar(...);
estoque.baixar(...);
financeiro.integrar(...);
ocorrencia.gerar(...);
```

Com Observer:

```java
pedido.pagar();
repository.salvar(pedido);
eventPublisher.publicar(new PedidoPagoEvent(...));
```

E os listeners reagem:

```text
PedidoPagoNotificacaoListener;
PedidoPagoAuditoriaListener;
PedidoPagoEstoqueListener;
PedidoPagoFinanceiroListener.
```

---

## Observer em uma frase prática

```text
Use Observer quando várias partes precisam reagir a um evento sem acoplar tudo no fluxo principal.
```

Ou:

```text
Observer desacopla quem publica o evento de quem reage ao evento.
```

---

## Problema sem Observer

Imagine um fluxo de pagamento.

Quando o pedido é pago, você precisa:

```text
salvar pedido;
auditar;
notificar cliente;
baixar estoque;
gerar ocorrência;
publicar evento para integração.
```

Se colocar tudo no use case, ele cresce.

Se amanhã entrar nova reação:

```text
enviar cupom;
avisar BI;
avisar logística;
gerar mensagem WhatsApp;
registrar métrica;
```

o use case muda toda hora.

Isso viola OCP e aumenta acoplamento.

Observer ajuda a separar:

```text
o fluxo principal publica o fato;
cada interessado reage ao fato.
```

---

## Relação com SOLID

## SRP

Cada listener tem uma responsabilidade.

Exemplo:

```text
PedidoPagoNotificacaoListener:
notifica cliente.

PedidoPagoAuditoriaListener:
registra auditoria.

PedidoPagoEstoqueListener:
baixa estoque.
```

---

## OCP

Para adicionar nova reação, você cria novo listener.

Não precisa alterar o fluxo principal.

---

## LSP

Todo listener precisa cumprir o contrato.

Se o contrato é:

```text
void aoReceber(EventoDominio evento)
```

o listener deve tratar corretamente o evento que declara aceitar.

---

## ISP

A interface do listener deve ser pequena.

Exemplo bom:

```java
void aoReceber(T evento);
```

Exemplo ruim:

```java
void aoPedidoPago();
void aoPedidoCancelado();
void aoOsCriada();
void aoPagamentoRecusado();
void aoImportacaoFinalizada();
```

---

## DIP

O fluxo principal depende de uma abstração:

```text
PublicadorEventos
```

E não de listeners concretos.

Listeners podem depender de portas:

```text
AuditoriaGateway;
MensageriaGateway;
EstoqueGateway;
FinanceiroGateway.
```

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Observer:

```text
A entidade decide.
O use case coordena e publica evento.
O repository salva.
Os listeners reagem.
Os gateways integram.
O controller futuro recebe request.
```

---

# Parte 1 — Observer vs Command

## Command

Representa uma ação que alguém mandou executar.

Exemplo:

```text
PagarPedidoCommand;
CancelarPedidoCommand;
EnviarMensagemCommand.
```

Command responde:

```text
qual ação executar?
```

---

## Observer

Representa reações a algo que aconteceu.

Exemplo:

```text
PedidoPagoEvent;
PedidoPagoNotificacaoListener;
PedidoPagoAuditoriaListener.
```

Observer responde:

```text
quem precisa reagir quando isso acontece?
```

---

## Diferença prática

```text
Command:
uma ordem para executar algo.

Observer:
uma notificação de que algo aconteceu.
```

---

# Parte 2 — Observer vs Chain

## Chain

Executa sequência de handlers.

Exemplo:

```text
ValidadorCliente -> ValidadorProduto -> ValidadorPagamento.
```

A ordem geralmente importa.

---

## Observer

Publica evento para vários listeners.

Exemplo:

```text
PedidoPagoEvent
  -> NotificacaoListener
  -> AuditoriaListener
  -> EstoqueListener
```

A ordem pode não importar, dependendo do caso.

---

## Diferença prática

```text
Chain:
pipeline de responsabilidade.

Observer:
vários interessados reagem a um fato.
```

---

# Parte 3 — Observer vs Adapter

## Adapter

Adapta contrato externo para contrato interno.

Exemplo:

```text
ExternalPaymentAdapter implementa PagamentoGateway.
```

---

## Observer

Distribui eventos para interessados.

Exemplo:

```text
PublicadorEventos publica PedidoPagoEvent.
```

---

## Podem trabalhar juntos

Um listener pode usar um adapter.

Exemplo:

```text
PedidoPagoFinanceiroListener usa FinanceiroGateway.
FinanceiroGateway pode ser implementado por SapFinanceiroAdapter.
```

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-233-observer-pattern-eventos-notificacoes-dominio
cd labs\m10\aula-233-observer-pattern-eventos-notificacoes-dominio
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula233

mkdir src\br\com\curso\aula233\app

mkdir src\br\com\curso\aula233\dominio
mkdir src\br\com\curso\aula233\dominio\pedido
mkdir src\br\com\curso\aula233\dominio\os

mkdir src\br\com\curso\aula233\evento
mkdir src\br\com\curso\aula233\evento\core
mkdir src\br\com\curso\aula233\evento\pedido
mkdir src\br\com\curso\aula233\evento\os

mkdir src\br\com\curso\aula233\aplicacao
mkdir src\br\com\curso\aula233\aplicacao\port
mkdir src\br\com\curso\aula233\aplicacao\usecase

mkdir src\br\com\curso\aula233\listener
mkdir src\br\com\curso\aula233\listener\pedido
mkdir src\br\com\curso\aula233\listener\os

mkdir src\br\com\curso\aula233\infra
mkdir src\br\com\curso\aula233\infra\auditoria
mkdir src\br\com\curso\aula233\infra\estoque
mkdir src\br\com\curso\aula233\infra\mensageria
mkdir src\br\com\curso\aula233\infra\repository
```

---

# Parte 5 — Domínio de Pedido

## StatusPedido

Crie:

```text
src\br\com\curso\aula233\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula233.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula233\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula233.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String produto;
    private final int quantidade;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private StatusPedido status;

    public Pedido(
            UUID id,
            String codigo,
            String cliente,
            String telefone,
            String produto,
            int quantidade,
            BigDecimal valor,
            Instant criadoEm
    ) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (produto == null || produto.isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.produto = produto.trim();
        this.quantidade = quantidade;
        this.valor = valor;
        this.criadoEm = criadoEm;
        this.status = StatusPedido.CRIADO;
    }

    public UUID id() {
        return id;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String telefone() {
        return telefone;
    }

    public String produto() {
        return produto;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal valor() {
        return valor;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public StatusPedido status() {
        return status;
    }

    public void pagar() {
        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode ser pago.");
        }

        status = StatusPedido.PAGO;
    }

    public void cancelar() {
        if (status == StatusPedido.PAGO) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado diretamente.");
        }

        if (status == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        status = StatusPedido.CANCELADO;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Produto: " + produto
                + " | Quantidade: " + quantidade
                + " | Valor: " + valor
                + " | Status: " + status;
    }
}
```

---

# Parte 6 — Ports

## PedidoRepository

Crie:

```text
src\br\com\curso\aula233\aplicacao\port\PedidoRepository.java
```

Código:

```java
package br.com.curso.aula233.aplicacao.port;

import br.com.curso.aula233.dominio.pedido.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);
}
```

---

## AuditoriaGateway

Crie:

```text
src\br\com\curso\aula233\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula233.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, String detalhes, Instant ocorridoEm);
}
```

---

## MensageriaGateway

Crie:

```text
src\br\com\curso\aula233\aplicacao\port\MensageriaGateway.java
```

Código:

```java
package br.com.curso.aula233.aplicacao.port;

public interface MensageriaGateway {
    void enviar(String destino, String mensagem);
}
```

---

## EstoqueGateway

Crie:

```text
src\br\com\curso\aula233\aplicacao\port\EstoqueGateway.java
```

Código:

```java
package br.com.curso.aula233.aplicacao.port;

public interface EstoqueGateway {
    void baixarEstoque(String produto, int quantidade);
}
```

---

# Parte 7 — Infraestrutura simples

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula233\infra\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula233.infra.repository;

import br.com.curso.aula233.aplicacao.port.PedidoRepository;
import br.com.curso.aula233.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria implements PedidoRepository {
    private final List<Pedido> pedidos = new ArrayList<>();

    @Override
    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.codigo().equals(pedido.codigo()));
        pedidos.add(pedido);

        System.out.println("[REPOSITORY] Pedido salvo: " + pedido.resumo());
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }
}
```

---

## AuditoriaConsoleGateway

Crie:

```text
src\br\com\curso\aula233\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula233.infra.auditoria;

import br.com.curso.aula233.aplicacao.port.AuditoriaGateway;

import java.time.Instant;

public class AuditoriaConsoleGateway implements AuditoriaGateway {
    @Override
    public void registrar(String evento, String detalhes, Instant ocorridoEm) {
        if (evento == null || evento.isBlank()) {
            throw new IllegalArgumentException("Evento é obrigatório.");
        }

        if (detalhes == null || detalhes.isBlank()) {
            throw new IllegalArgumentException("Detalhes são obrigatórios.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Data/hora é obrigatória.");
        }

        System.out.println("[AUDITORIA] " + evento + " | " + detalhes + " | " + ocorridoEm);
    }
}
```

---

## MensageriaConsoleGateway

Crie:

```text
src\br\com\curso\aula233\infra\mensageria\MensageriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula233.infra.mensageria;

import br.com.curso.aula233.aplicacao.port.MensageriaGateway;

public class MensageriaConsoleGateway implements MensageriaGateway {
    @Override
    public void enviar(String destino, String mensagem) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        System.out.println("[MENSAGERIA] Para: " + destino + " | " + mensagem);
    }
}
```

---

## EstoqueMemoriaGateway

Crie:

```text
src\br\com\curso\aula233\infra\estoque\EstoqueMemoriaGateway.java
```

Código:

```java
package br.com.curso.aula233.infra.estoque;

import br.com.curso.aula233.aplicacao.port.EstoqueGateway;

public class EstoqueMemoriaGateway implements EstoqueGateway {
    @Override
    public void baixarEstoque(String produto, int quantidade) {
        if (produto == null || produto.isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        System.out.println("[ESTOQUE] Baixando estoque de " + produto + " | Quantidade: " + quantidade);
    }
}
```

---

# Parte 8 — Núcleo de eventos

## EventoDominio

Crie:

```text
src\br\com\curso\aula233\evento\core\EventoDominio.java
```

Código:

```java
package br.com.curso.aula233.evento.core;

import java.time.Instant;

public interface EventoDominio {
    String nome();

    Instant ocorridoEm();
}
```

---

## ObservadorEvento

Crie:

```text
src\br\com\curso\aula233\evento\core\ObservadorEvento.java
```

Código:

```java
package br.com.curso.aula233.evento.core;

public interface ObservadorEvento<T extends EventoDominio> {
    Class<T> tipoEvento();

    void aoReceber(T evento);
}
```

---

## PublicadorEventos

Crie:

```text
src\br\com\curso\aula233\evento\core\PublicadorEventos.java
```

Código:

```java
package br.com.curso.aula233.evento.core;

import java.util.ArrayList;
import java.util.List;

public class PublicadorEventos {
    private final List<ObservadorEvento<? extends EventoDominio>> observadores = new ArrayList<>();

    public void registrar(ObservadorEvento<? extends EventoDominio> observador) {
        if (observador == null) {
            throw new IllegalArgumentException("Observador é obrigatório.");
        }

        observadores.add(observador);
    }

    public void publicar(EventoDominio evento) {
        if (evento == null) {
            throw new IllegalArgumentException("Evento é obrigatório.");
        }

        System.out.println("[EVENTO] Publicando: " + evento.nome());

        for (ObservadorEvento<? extends EventoDominio> observador : observadores) {
            if (observador.tipoEvento().isAssignableFrom(evento.getClass())) {
                notificar(observador, evento);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private <T extends EventoDominio> void notificar(
            ObservadorEvento<? extends EventoDominio> observador,
            EventoDominio evento
    ) {
        ObservadorEvento<T> convertido = (ObservadorEvento<T>) observador;
        convertido.aoReceber((T) evento);
    }
}
```

---

## Análise

O publicador mantém uma lista de observadores.

Quando um evento é publicado, ele procura observadores compatíveis e notifica.

Esse é o centro do Observer.

---

# Parte 9 — Evento de pedido pago

## PedidoPagoEvent

Crie:

```text
src\br\com\curso\aula233\evento\pedido\PedidoPagoEvent.java
```

Código:

```java
package br.com.curso.aula233.evento.pedido;

import br.com.curso.aula233.evento.core.EventoDominio;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoPagoEvent implements EventoDominio {
    private final String codigoPedido;
    private final String cliente;
    private final String telefone;
    private final String produto;
    private final int quantidade;
    private final BigDecimal valor;
    private final Instant ocorridoEm;

    public PedidoPagoEvent(
            String codigoPedido,
            String cliente,
            String telefone,
            String produto,
            int quantidade,
            BigDecimal valor,
            Instant ocorridoEm
    ) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (produto == null || produto.isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (valor == null || valor.signum() <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Data do evento é obrigatória.");
        }

        this.codigoPedido = codigoPedido.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.produto = produto.trim();
        this.quantidade = quantidade;
        this.valor = valor;
        this.ocorridoEm = ocorridoEm;
    }

    @Override
    public String nome() {
        return "PEDIDO_PAGO";
    }

    @Override
    public Instant ocorridoEm() {
        return ocorridoEm;
    }

    public String codigoPedido() {
        return codigoPedido;
    }

    public String cliente() {
        return cliente;
    }

    public String telefone() {
        return telefone;
    }

    public String produto() {
        return produto;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal valor() {
        return valor;
    }
}
```

---

# Parte 10 — Listeners de pedido pago

## PedidoPagoAuditoriaListener

Crie:

```text
src\br\com\curso\aula233\listener\pedido\PedidoPagoAuditoriaListener.java
```

Código:

```java
package br.com.curso.aula233.listener.pedido;

import br.com.curso.aula233.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula233.evento.core.ObservadorEvento;
import br.com.curso.aula233.evento.pedido.PedidoPagoEvent;

public class PedidoPagoAuditoriaListener implements ObservadorEvento<PedidoPagoEvent> {
    private final AuditoriaGateway auditoriaGateway;

    public PedidoPagoAuditoriaListener(AuditoriaGateway auditoriaGateway) {
        if (auditoriaGateway == null) {
            throw new IllegalArgumentException("AuditoriaGateway é obrigatório.");
        }

        this.auditoriaGateway = auditoriaGateway;
    }

    @Override
    public Class<PedidoPagoEvent> tipoEvento() {
        return PedidoPagoEvent.class;
    }

    @Override
    public void aoReceber(PedidoPagoEvent evento) {
        auditoriaGateway.registrar(
                evento.nome(),
                "Pedido pago: " + evento.codigoPedido() + " | Valor: " + evento.valor(),
                evento.ocorridoEm()
        );
    }
}
```

---

## PedidoPagoNotificacaoListener

Crie:

```text
src\br\com\curso\aula233\listener\pedido\PedidoPagoNotificacaoListener.java
```

Código:

```java
package br.com.curso.aula233.listener.pedido;

import br.com.curso.aula233.aplicacao.port.MensageriaGateway;
import br.com.curso.aula233.evento.core.ObservadorEvento;
import br.com.curso.aula233.evento.pedido.PedidoPagoEvent;

public class PedidoPagoNotificacaoListener implements ObservadorEvento<PedidoPagoEvent> {
    private final MensageriaGateway mensageriaGateway;

    public PedidoPagoNotificacaoListener(MensageriaGateway mensageriaGateway) {
        if (mensageriaGateway == null) {
            throw new IllegalArgumentException("MensageriaGateway é obrigatório.");
        }

        this.mensageriaGateway = mensageriaGateway;
    }

    @Override
    public Class<PedidoPagoEvent> tipoEvento() {
        return PedidoPagoEvent.class;
    }

    @Override
    public void aoReceber(PedidoPagoEvent evento) {
        mensageriaGateway.enviar(
                evento.telefone(),
                "Olá, " + evento.cliente() + ". Seu pedido " + evento.codigoPedido() + " foi pago com sucesso."
        );
    }
}
```

---

## PedidoPagoEstoqueListener

Crie:

```text
src\br\com\curso\aula233\listener\pedido\PedidoPagoEstoqueListener.java
```

Código:

```java
package br.com.curso.aula233.listener.pedido;

import br.com.curso.aula233.aplicacao.port.EstoqueGateway;
import br.com.curso.aula233.evento.core.ObservadorEvento;
import br.com.curso.aula233.evento.pedido.PedidoPagoEvent;

public class PedidoPagoEstoqueListener implements ObservadorEvento<PedidoPagoEvent> {
    private final EstoqueGateway estoqueGateway;

    public PedidoPagoEstoqueListener(EstoqueGateway estoqueGateway) {
        if (estoqueGateway == null) {
            throw new IllegalArgumentException("EstoqueGateway é obrigatório.");
        }

        this.estoqueGateway = estoqueGateway;
    }

    @Override
    public Class<PedidoPagoEvent> tipoEvento() {
        return PedidoPagoEvent.class;
    }

    @Override
    public void aoReceber(PedidoPagoEvent evento) {
        estoqueGateway.baixarEstoque(evento.produto(), evento.quantidade());
    }
}
```

---

# Parte 11 — Use case publicando evento

## PagarPedidoUseCase

Crie:

```text
src\br\com\curso\aula233\aplicacao\usecase\PagarPedidoUseCase.java
```

Código:

```java
package br.com.curso.aula233.aplicacao.usecase;

import br.com.curso.aula233.aplicacao.port.PedidoRepository;
import br.com.curso.aula233.dominio.pedido.Pedido;
import br.com.curso.aula233.evento.core.PublicadorEventos;
import br.com.curso.aula233.evento.pedido.PedidoPagoEvent;

import java.time.Instant;

public class PagarPedidoUseCase {
    private final PedidoRepository repository;
    private final PublicadorEventos publicadorEventos;

    public PagarPedidoUseCase(PedidoRepository repository, PublicadorEventos publicadorEventos) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (publicadorEventos == null) {
            throw new IllegalArgumentException("PublicadorEventos é obrigatório.");
        }

        this.repository = repository;
        this.publicadorEventos = publicadorEventos;
    }

    public void executar(String codigoPedido, Instant agora) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigoPedido));

        pedido.pagar();

        repository.salvar(pedido);

        publicadorEventos.publicar(new PedidoPagoEvent(
                pedido.codigo(),
                pedido.cliente(),
                pedido.telefone(),
                pedido.produto(),
                pedido.quantidade(),
                pedido.valor(),
                agora
        ));
    }
}
```

---

## ObserverPedidoPagoApp

Crie:

```text
src\br\com\curso\aula233\app\ObserverPedidoPagoApp.java
```

Código:

```java
package br.com.curso.aula233.app;

import br.com.curso.aula233.aplicacao.port.PedidoRepository;
import br.com.curso.aula233.aplicacao.usecase.PagarPedidoUseCase;
import br.com.curso.aula233.dominio.pedido.Pedido;
import br.com.curso.aula233.evento.core.PublicadorEventos;
import br.com.curso.aula233.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula233.infra.estoque.EstoqueMemoriaGateway;
import br.com.curso.aula233.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula233.infra.repository.PedidoRepositoryMemoria;
import br.com.curso.aula233.listener.pedido.PedidoPagoAuditoriaListener;
import br.com.curso.aula233.listener.pedido.PedidoPagoEstoqueListener;
import br.com.curso.aula233.listener.pedido.PedidoPagoNotificacaoListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ObserverPedidoPagoApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                "11999999999",
                "Notebook",
                1,
                new BigDecimal("3500.00"),
                Instant.now()
        );

        repository.salvar(pedido);

        PublicadorEventos publicador = new PublicadorEventos();

        publicador.registrar(new PedidoPagoAuditoriaListener(new AuditoriaConsoleGateway()));
        publicador.registrar(new PedidoPagoNotificacaoListener(new MensageriaConsoleGateway()));
        publicador.registrar(new PedidoPagoEstoqueListener(new EstoqueMemoriaGateway()));

        PagarPedidoUseCase useCase = new PagarPedidoUseCase(repository, publicador);

        useCase.executar("PED-001", Instant.now());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula233.app.ObserverPedidoPagoApp
```

---

## O que melhorou

O use case não sabe mais quantas reações existem.

Ele apenas publica:

```text
PedidoPagoEvent
```

Os listeners cuidam das reações:

```text
auditoria;
notificação;
estoque.
```

Se amanhã entrar:

```text
PedidoPagoFinanceiroListener
```

o use case não muda.

---

# Parte 12 — Novo listener sem mexer no use case

## PedidoPagoMetricasListener

Crie:

```text
src\br\com\curso\aula233\listener\pedido\PedidoPagoMetricasListener.java
```

Código:

```java
package br.com.curso.aula233.listener.pedido;

import br.com.curso.aula233.evento.core.ObservadorEvento;
import br.com.curso.aula233.evento.pedido.PedidoPagoEvent;

public class PedidoPagoMetricasListener implements ObservadorEvento<PedidoPagoEvent> {
    @Override
    public Class<PedidoPagoEvent> tipoEvento() {
        return PedidoPagoEvent.class;
    }

    @Override
    public void aoReceber(PedidoPagoEvent evento) {
        System.out.println("[METRICA] pedido_pago_total +1 | Valor: " + evento.valor());
    }
}
```

---

## ObserverPedidoPagoComMetricasApp

Crie:

```text
src\br\com\curso\aula233\app\ObserverPedidoPagoComMetricasApp.java
```

Código:

```java
package br.com.curso.aula233.app;

import br.com.curso.aula233.aplicacao.port.PedidoRepository;
import br.com.curso.aula233.aplicacao.usecase.PagarPedidoUseCase;
import br.com.curso.aula233.dominio.pedido.Pedido;
import br.com.curso.aula233.evento.core.PublicadorEventos;
import br.com.curso.aula233.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula233.infra.estoque.EstoqueMemoriaGateway;
import br.com.curso.aula233.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula233.infra.repository.PedidoRepositoryMemoria;
import br.com.curso.aula233.listener.pedido.PedidoPagoAuditoriaListener;
import br.com.curso.aula233.listener.pedido.PedidoPagoEstoqueListener;
import br.com.curso.aula233.listener.pedido.PedidoPagoMetricasListener;
import br.com.curso.aula233.listener.pedido.PedidoPagoNotificacaoListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ObserverPedidoPagoComMetricasApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-002",
                "Carlos Souza",
                "11888888888",
                "Mouse",
                2,
                new BigDecimal("160.00"),
                Instant.now()
        ));

        PublicadorEventos publicador = new PublicadorEventos();

        publicador.registrar(new PedidoPagoAuditoriaListener(new AuditoriaConsoleGateway()));
        publicador.registrar(new PedidoPagoNotificacaoListener(new MensageriaConsoleGateway()));
        publicador.registrar(new PedidoPagoEstoqueListener(new EstoqueMemoriaGateway()));
        publicador.registrar(new PedidoPagoMetricasListener());

        new PagarPedidoUseCase(repository, publicador).executar("PED-002", Instant.now());
    }
}
```

---

## Análise OCP

Você adicionou nova reação criando:

```text
PedidoPagoMetricasListener
```

E registrou no publicador.

Você não alterou:

```text
PagarPedidoUseCase;
Pedido;
PedidoRepository;
PedidoPagoEvent.
```

---

# Parte 13 — Evento de Ordem de Serviço criada

Agora vamos aplicar Observer em Ordem de Serviço.

## OrdemServico

Crie:

```text
src\br\com\curso\aula233\dominio\os\OrdemServico.java
```

Código:

```java
package br.com.curso.aula233.dominio.os;

import java.time.Instant;
import java.util.UUID;

public class OrdemServico {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String descricao;
    private final Instant criadaEm;

    public OrdemServico(UUID id, String codigo, String cliente, String telefone, String descricao, Instant criadaEm) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (criadaEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.descricao = descricao.trim();
        this.criadaEm = criadaEm;
    }

    public UUID id() {
        return id;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String telefone() {
        return telefone;
    }

    public String descricao() {
        return descricao;
    }

    public Instant criadaEm() {
        return criadaEm;
    }
}
```

---

## OrdemServicoCriadaEvent

Crie:

```text
src\br\com\curso\aula233\evento\os\OrdemServicoCriadaEvent.java
```

Código:

```java
package br.com.curso.aula233.evento.os;

import br.com.curso.aula233.evento.core.EventoDominio;

import java.time.Instant;

public class OrdemServicoCriadaEvent implements EventoDominio {
    private final String codigoOs;
    private final String cliente;
    private final String telefone;
    private final String descricao;
    private final Instant ocorridoEm;

    public OrdemServicoCriadaEvent(
            String codigoOs,
            String cliente,
            String telefone,
            String descricao,
            Instant ocorridoEm
    ) {
        if (codigoOs == null || codigoOs.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Data do evento é obrigatória.");
        }

        this.codigoOs = codigoOs.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.descricao = descricao.trim();
        this.ocorridoEm = ocorridoEm;
    }

    @Override
    public String nome() {
        return "ORDEM_SERVICO_CRIADA";
    }

    @Override
    public Instant ocorridoEm() {
        return ocorridoEm;
    }

    public String codigoOs() {
        return codigoOs;
    }

    public String cliente() {
        return cliente;
    }

    public String telefone() {
        return telefone;
    }

    public String descricao() {
        return descricao;
    }
}
```

---

## OrdemServicoCriadaAuditoriaListener

Crie:

```text
src\br\com\curso\aula233\listener\os\OrdemServicoCriadaAuditoriaListener.java
```

Código:

```java
package br.com.curso.aula233.listener.os;

import br.com.curso.aula233.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula233.evento.core.ObservadorEvento;
import br.com.curso.aula233.evento.os.OrdemServicoCriadaEvent;

public class OrdemServicoCriadaAuditoriaListener implements ObservadorEvento<OrdemServicoCriadaEvent> {
    private final AuditoriaGateway auditoriaGateway;

    public OrdemServicoCriadaAuditoriaListener(AuditoriaGateway auditoriaGateway) {
        if (auditoriaGateway == null) {
            throw new IllegalArgumentException("AuditoriaGateway é obrigatório.");
        }

        this.auditoriaGateway = auditoriaGateway;
    }

    @Override
    public Class<OrdemServicoCriadaEvent> tipoEvento() {
        return OrdemServicoCriadaEvent.class;
    }

    @Override
    public void aoReceber(OrdemServicoCriadaEvent evento) {
        auditoriaGateway.registrar(
                evento.nome(),
                "OS criada: " + evento.codigoOs() + " | Cliente: " + evento.cliente(),
                evento.ocorridoEm()
        );
    }
}
```

---

## OrdemServicoCriadaNotificacaoListener

Crie:

```text
src\br\com\curso\aula233\listener\os\OrdemServicoCriadaNotificacaoListener.java
```

Código:

```java
package br.com.curso.aula233.listener.os;

import br.com.curso.aula233.aplicacao.port.MensageriaGateway;
import br.com.curso.aula233.evento.core.ObservadorEvento;
import br.com.curso.aula233.evento.os.OrdemServicoCriadaEvent;

public class OrdemServicoCriadaNotificacaoListener implements ObservadorEvento<OrdemServicoCriadaEvent> {
    private final MensageriaGateway mensageriaGateway;

    public OrdemServicoCriadaNotificacaoListener(MensageriaGateway mensageriaGateway) {
        if (mensageriaGateway == null) {
            throw new IllegalArgumentException("MensageriaGateway é obrigatório.");
        }

        this.mensageriaGateway = mensageriaGateway;
    }

    @Override
    public Class<OrdemServicoCriadaEvent> tipoEvento() {
        return OrdemServicoCriadaEvent.class;
    }

    @Override
    public void aoReceber(OrdemServicoCriadaEvent evento) {
        mensageriaGateway.enviar(
                evento.telefone(),
                "Olá, " + evento.cliente() + ". Sua OS " + evento.codigoOs() + " foi criada."
        );
    }
}
```

---

## ObserverOrdemServicoApp

Crie:

```text
src\br\com\curso\aula233\app\ObserverOrdemServicoApp.java
```

Código:

```java
package br.com.curso.aula233.app;

import br.com.curso.aula233.dominio.os.OrdemServico;
import br.com.curso.aula233.evento.core.PublicadorEventos;
import br.com.curso.aula233.evento.os.OrdemServicoCriadaEvent;
import br.com.curso.aula233.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula233.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula233.listener.os.OrdemServicoCriadaAuditoriaListener;
import br.com.curso.aula233.listener.os.OrdemServicoCriadaNotificacaoListener;

import java.time.Instant;
import java.util.UUID;

public class ObserverOrdemServicoApp {
    public static void main(String[] args) {
        PublicadorEventos publicador = new PublicadorEventos();

        publicador.registrar(new OrdemServicoCriadaAuditoriaListener(new AuditoriaConsoleGateway()));
        publicador.registrar(new OrdemServicoCriadaNotificacaoListener(new MensageriaConsoleGateway()));

        OrdemServico os = new OrdemServico(
                UUID.randomUUID(),
                "OS-001",
                "Maria Oliveira",
                "11777777777",
                "Produto com avaria",
                Instant.now()
        );

        publicador.publicar(new OrdemServicoCriadaEvent(
                os.codigo(),
                os.cliente(),
                os.telefone(),
                os.descricao(),
                Instant.now()
        ));
    }
}
```

---

# Parte 14 — Falha em listener

Uma decisão importante:

```text
se um listener falhar, os outros devem continuar?
```

Depende do negócio.

Exemplo:

```text
auditoria falhou;
notificação deve continuar?
estoque falhou;
pagamento deve ser revertido?
mensageria caiu;
pedido continua pago?
```

Na nossa implementação simples, se um listener lançar exception, a publicação para.

Em sistemas reais, você pode querer:

```text
isolar falhas por listener;
registrar erro e continuar;
enfileirar evento para retry;
usar transação;
usar outbox pattern;
separar evento síncrono e assíncrono.
```

Ainda vamos estudar esses temas mais para frente.

---

## Publicador tolerante a falhas

Exemplo conceitual:

```java
try {
    listener.aoReceber(evento);
} catch (Exception erro) {
    logar erro;
    continuar;
}
```

Mas cuidado:

```text
nem toda falha pode ser ignorada.
```

Se baixar estoque é obrigatório, talvez não possa continuar como se nada aconteceu.

---

# Parte 15 — Eventos de domínio vs eventos de integração

## Evento de domínio

Representa algo que aconteceu dentro do domínio.

Exemplos:

```text
PedidoPagoEvent;
PedidoCanceladoEvent;
OrdemServicoCriadaEvent;
TransacaoAprovadaEvent.
```

Uso:

```text
desacoplar reações internas;
registrar auditoria;
disparar notificação;
atualizar projeção;
gerar ocorrência.
```

---

## Evento de integração

Representa algo que será enviado para fora do sistema.

Exemplos:

```text
PedidoPagoIntegrationEvent;
OsCriadaIntegrationEvent;
PagamentoConfirmadoMessage.
```

Uso:

```text
Kafka;
RabbitMQ;
SQS;
webhook;
integração com outro microsserviço.
```

Nesta aula, estamos trabalhando com eventos internos simples.

Mais para frente, vamos separar melhor esses conceitos.

---

# Parte 16 — Como isso conversa com front-end

O front geralmente chama uma ação:

```text
POST /pedidos/PED-001/pagar
```

O backend:

```text
paga pedido;
salva pedido;
publica PedidoPagoEvent;
listeners reagem;
retorna response.
```

O front não precisa saber quais listeners existem.

Ele recebe:

```json
{
  "codigoPedido": "PED-001",
  "status": "PAGO",
  "mensagem": "Pedido pago com sucesso."
}
```

Se amanhã o backend adicionar:

```text
listener de métricas;
listener de logística;
listener de BI;
listener de cupom;
```

o contrato com o front pode continuar igual.

Isso é uma grande vantagem.

---

# Parte 17 — Observer em Spring futuramente

Com Spring, você verá algo conceitualmente parecido com:

```java
applicationEventPublisher.publishEvent(new PedidoPagoEvent(...));
```

E listeners:

```java
@EventListener
public void aoPedidoPago(PedidoPagoEvent evento) {
}
```

Mas a ideia é a mesma que fizemos em Java puro:

```text
publicar evento;
listeners recebem;
ações ficam desacopladas.
```

Entender Java puro primeiro evita usar anotação sem entender arquitetura.

---

# Parte 18 — Erros comuns com Observer

## 1. Evento sem significado de negócio

Ruim:

```text
ObjetoAlteradoEvent
OperacaoRealizadaEvent
CoisaEvent
```

Melhor:

```text
PedidoPagoEvent
OrdemServicoCriadaEvent
TransacaoAprovadaEvent
```

---

## 2. Listener fazendo regra central demais

Listener deve reagir.

Não deve virar o lugar principal da regra de negócio.

---

## 3. Evento carregando objeto gigante

Cuidado ao colocar entidade inteira no evento.

Pode gerar acoplamento.

Prefira dados necessários.

---

## 4. Publicar evento antes de salvar

Se o listener reage a algo que ainda não foi persistido, pode gerar inconsistência.

Regra comum:

```text
altera domínio;
salva;
publica evento.
```

---

## 5. Falha de listener sem estratégia

Pense:

```text
se falhar, para tudo?
continua?
reprocessa?
registra erro?
```

---

## 6. Ordem dos listeners escondida

Observer não deve depender fortemente de ordem.

Se ordem importa muito, talvez seja Chain ou workflow explícito.

---

# Parte 19 — Checklist para usar Observer

Pergunte:

```text
1. Algo relevante aconteceu no domínio?
2. Mais de uma parte precisa reagir?
3. Quero evitar acoplamento no use case?
4. O evento tem nome de negócio?
5. O evento tem dados suficientes?
6. Os listeners têm responsabilidade clara?
7. A ordem dos listeners importa?
8. O que acontece se um listener falhar?
9. O evento deve ser interno ou de integração?
10. O contrato com o front fica protegido?
```

---

# Parte 20 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula233.app.ObserverPedidoPagoApp
java -cp out br.com.curso.aula233.app.ObserverPedidoPagoComMetricasApp
java -cp out br.com.curso.aula233.app.ObserverOrdemServicoApp
```

Depois responda:

```text
1. Qual interface representa o evento?
2. Qual interface representa o observer?
3. Qual classe publica eventos?
4. Qual evento representa pedido pago?
5. Quais listeners reagem ao pedido pago?
6. O use case conhece os listeners?
7. Como adicionar métrica sem alterar use case?
8. Qual evento representa OS criada?
9. Qual diferença entre Command e Observer?
10. O que deve ser pensado sobre falha em listener?
```

---

# Parte 21 — Exercício prático principal

## Contexto

Crie Observer para:

```text
PedidoCanceladoEvent
```

Quando um pedido for cancelado, devem reagir:

```text
PedidoCanceladoAuditoriaListener;
PedidoCanceladoNotificacaoListener;
PedidoCanceladoEstoqueListener.
```

---

## Evento

Campos:

```text
String codigoPedido;
String cliente;
String telefone;
String produto;
int quantidade;
String motivo;
Instant ocorridoEm;
```

---

## Listeners

## Auditoria

Registra:

```text
PEDIDO_CANCELADO
```

com:

```text
pedido;
motivo;
data.
```

## Notificação

Envia mensagem:

```text
Seu pedido X foi cancelado. Motivo: Y.
```

## Estoque

Simula devolução ao estoque:

```text
devolverEstoque(produto, quantidade)
```

---

## Use case

Crie:

```text
CancelarPedidoUseCase
```

Fluxo:

```text
buscar pedido;
cancelar;
salvar;
publicar PedidoCanceladoEvent.
```

---

## Critérios

```text
use case não deve conhecer listeners concretos;
evento deve ter nome de negócio;
listeners devem ter responsabilidade única;
publicador deve entregar evento para todos os listeners compatíveis.
```

---

# Parte 22 — Desafio extra

## Observer para importação finalizada

Crie:

```text
ImportacaoFinalizadaEvent
```

Campos:

```text
String tipoImportacao;
String arquivo;
int totalProcessado;
int totalErro;
Instant ocorridoEm;
```

Listeners:

```text
ImportacaoAuditoriaListener;
ImportacaoRelatorioListener;
ImportacaoNotificacaoInternaListener.
```

Objetivo:

```text
simular reações depois de uma importação.
```

Critérios:

```text
evento não deve saber como gerar relatório;
listener de relatório cuida disso;
listener de auditoria só audita;
listener de notificação só notifica.
```

---

# Parte 23 — Simulado rápido

## Questão 1

Observer Pattern é usado quando:

```text
A) várias partes precisam reagir a um evento.
B) um objeto tem muitos campos opcionais.
C) uma ação precisa virar objeto obrigatoriamente.
D) uma API externa precisa ser adaptada.
```

---

## Questão 2

No Observer, quem publica o evento deve:

```text
A) não precisar conhecer todos os listeners concretos.
B) conhecer obrigatoriamente todos os detalhes de cada listener.
C) salvar no banco dentro de cada listener sempre.
D) retornar HTML.
```

---

## Questão 3

Um listener deve:

```text
A) ter uma responsabilidade clara ao reagir ao evento.
B) fazer todas as regras do sistema.
C) substituir a entidade.
D) substituir o controller.
```

---

## Questão 4

Adicionar novo listener sem alterar o use case reforça:

```text
A) OCP.
B) acoplamento forte.
C) ausência de polimorfismo.
D) erro de compilação.
```

---

## Questão 5

Observer se diferencia de Command porque:

```text
A) Command é uma ordem de execução; Observer é reação a algo que aconteceu.
B) Observer é sempre banco de dados.
C) Command é sempre evento.
D) Não existe diferença.
```

---

## Questão 6

Um bom evento de domínio deve ter:

```text
A) nome claro de negócio.
B) nome genérico como CoisaEvent.
C) todos os objetos do sistema.
D) dependência direta do front.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
```

---

# Parte 24 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Observer Pattern.
[ ] Sei criar evento de domínio.
[ ] Sei criar observer/listener.
[ ] Sei criar publicador de eventos.
[ ] Sei registrar vários listeners.
[ ] Sei publicar evento no use case.
[ ] Sei desacoplar reações secundárias.
[ ] Sei aplicar em PedidoPagoEvent.
[ ] Sei aplicar em OrdemServicoCriadaEvent.
[ ] Sei diferenciar Observer de Command.
[ ] Sei diferenciar Observer de Chain.
[ ] Sei diferenciar evento interno de evento de integração.
[ ] Sei pensar em falha de listener.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Observer Pattern?
2. Qual problema ele resolve?
3. O que é evento de domínio?
4. O que é listener?
5. O que é publicador de eventos?
6. Por que o use case não deve conhecer todos os listeners?
7. Qual diferença entre Observer e Command?
8. Qual diferença entre Observer e Chain?
9. O que acontece se um listener falhar?
10. Como isso aparecerá no Spring futuramente?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar eventos de domínio;
criar listeners;
criar publicador de eventos;
publicar evento após salvar entidade;
adicionar nova reação sem alterar use case;
aplicar Observer em pedido;
aplicar Observer em OS;
resolver exercício de pedido cancelado;
resolver desafio de importação finalizada.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-233-observer-pattern-eventos-notificacoes-dominio
git commit -m "Aula 233: observer pattern eventos notificacoes dominio"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Observer Pattern desacopla quem publica um evento de quem reage a esse evento.
```

Você estudou:

```text
Observer Pattern;
eventos de domínio;
listeners;
publicador de eventos;
PedidoPagoEvent;
OrdemServicoCriadaEvent;
auditoria;
notificação;
estoque;
métricas;
eventos internos;
eventos de integração;
cuidados com falha de listener;
relação com front-end;
uso futuro no Spring.
```

Na próxima aula, vamos estudar:

```text
Decorator Pattern.
```

A ideia será adicionar comportamentos extras a objetos sem alterar a classe principal, muito útil para logs, métricas, cache, validação, autorização e enriquecimento de respostas.
