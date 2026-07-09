# 232 — M10.10 — Command Pattern: ações, comandos, auditoria e filas

## Objetivo da aula

Na aula anterior, você estudou:

```text
State Pattern
```

Você viu que State ajuda quando o comportamento muda conforme o status interno do objeto, principalmente em fluxos como:

```text
pedido;
ordem de serviço;
chamado;
workflow;
importação;
pagamento;
jornada;
aprovação.
```

Agora vamos estudar outro padrão comportamental muito importante em backend:

```text
Command Pattern
```

Em português:

```text
Padrão Comando
```

Command aparece quando você quer encapsular uma ação como objeto.

Isso é muito útil em sistemas backend porque várias operações precisam ser:

```text
executadas;
auditadas;
enfileiradas;
reprocessadas;
agendadas;
registradas;
desfeitas;
validadas;
logadas;
autorizadas;
padronizadas.
```

Exemplos comuns:

```text
criar pedido;
cancelar pedido;
pagar pedido;
reagendar ordem de serviço;
enviar mensagem;
processar importação;
aprovar transação;
recusar solicitação;
gerar relatório;
sincronizar dados com legado;
publicar evento;
executar tarefa em lote.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Command resolve;
criar uma interface de comando;
encapsular ações em classes;
criar comandos com dados próprios;
criar executor de comandos;
registrar auditoria antes/depois;
simular fila de comandos;
simular reprocessamento;
diferenciar Command de Strategy;
diferenciar Command de Use Case;
diferenciar Command de Chain;
aplicar Command em pedidos e ordens de serviço;
entender como isso prepara filas, mensageria e jobs.
```

---

## Ideia principal

Command transforma uma ação em objeto.

Em vez de chamar diretamente:

```java
pedido.cancelar();
auditoria.registrar(...);
notificador.enviar(...);
```

você pode encapsular a ação:

```java
Comando comando = new CancelarPedidoCommand(...);
executor.executar(comando);
```

O comando sabe o que deve executar.

O executor sabe como executar comandos de forma padronizada.

---

## Command em uma frase prática

```text
Use Command quando você precisa representar uma ação como objeto.
```

Ou:

```text
Command encapsula uma solicitação para que ela possa ser executada, auditada, enfileirada ou reprocessada.
```

---

## Problema sem Command

Imagine um sistema com várias ações:

```text
criar pedido;
pagar pedido;
cancelar pedido;
faturar pedido;
enviar notificação;
reagendar OS;
aprovar transação.
```

Cada ação espalha lógica de execução, log e auditoria:

```java
System.out.println("[INICIO] Cancelar pedido");
pedido.cancelar();
repository.salvar(pedido);
auditoria.registrar("PEDIDO_CANCELADO");
System.out.println("[FIM] Cancelar pedido");
```

Em outro lugar:

```java
System.out.println("[INICIO] Pagar pedido");
pedido.pagar();
repository.salvar(pedido);
auditoria.registrar("PEDIDO_PAGO");
System.out.println("[FIM] Pagar pedido");
```

A estrutura se repete.

O que muda é a ação.

Command ajuda a padronizar isso.

---

## Relação com SOLID

## SRP

Cada command representa uma ação.

Exemplo:

```text
CancelarPedidoCommand:
cancela pedido.

PagarPedidoCommand:
paga pedido.

EnviarMensagemCommand:
envia mensagem.
```

---

## OCP

Para criar nova ação, você cria novo command.

Não precisa alterar o executor.

---

## LSP

Todo command deve cumprir o contrato:

```text
executar;
nome;
descrição.
```

Se o command promete executar, não deve retornar `null` sem explicação ou engolir erro indevidamente.

---

## ISP

A interface Command deve ser pequena.

Exemplo:

```java
void executar();
String nome();
```

Não crie uma interface com métodos que nem todo comando usa.

---

## DIP

Commands podem depender de portas:

```text
PedidoRepository;
AuditoriaGateway;
Notificador;
PagamentoGateway.
```

O executor depende da interface:

```text
Comando.
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

Com Command:

```text
O command encapsula uma ação.
A entidade continua decidindo regra.
O use case ou executor coordena execução.
O repository salva.
O client integra.
O controller futuro dispara o comando.
```

Command não substitui entidade.

Command não deve virar classe Deus.

---

# Parte 1 — Command vs Use Case

Essa diferença é importante.

## Use Case

Representa um caso de uso da aplicação.

Exemplo:

```text
CancelarPedidoUseCase;
PagarPedidoUseCase;
ReagendarOrdemServicoUseCase.
```

---

## Command

Representa uma ação encapsulada como objeto.

Exemplo:

```text
CancelarPedidoCommand;
PagarPedidoCommand;
EnviarMensagemCommand.
```

---

## Quando se parecem

Em sistemas simples, um command pode parecer um use case.

Isso não é necessariamente errado.

A diferença fica mais clara quando você precisa:

```text
enfileirar ações;
executar comandos depois;
auditar comandos de forma padronizada;
reprocessar comandos;
armazenar comandos;
compor comandos;
executar comandos em lote.
```

Nesses casos, Command começa a fazer mais sentido.

---

# Parte 2 — Command vs Strategy

## Strategy

Escolhe uma regra intercambiável.

Exemplo:

```text
PoliticaDesconto;
PoliticaPrioridade;
PoliticaFrete.
```

---

## Command

Encapsula uma ação executável.

Exemplo:

```text
CancelarPedidoCommand;
AprovarTransacaoCommand;
EnviarMensagemCommand.
```

---

## Diferença prática

```text
Strategy:
qual regra usar?

Command:
qual ação executar?
```

---

# Parte 3 — Command vs Chain

## Chain

Executa uma sequência de handlers.

Exemplo:

```text
ValidadorCliente -> ValidadorProduto -> ValidadorPagamento.
```

---

## Command

Representa uma ação.

Exemplo:

```text
CancelarPedidoCommand.
```

---

## Podem trabalhar juntos

Um executor pode fazer:

```text
validar comando com chain;
executar command;
auditar resultado.
```

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-232-command-pattern-acoes-comandos-auditoria-filas
cd labs\m10\aula-232-command-pattern-acoes-comandos-auditoria-filas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula232

mkdir src\br\com\curso\aula232\app

mkdir src\br\com\curso\aula232\dominio
mkdir src\br\com\curso\aula232\dominio\pedido
mkdir src\br\com\curso\aula232\dominio\os
mkdir src\br\com\curso\aula232\dominio\mensageria

mkdir src\br\com\curso\aula232\command
mkdir src\br\com\curso\aula232\command\core
mkdir src\br\com\curso\aula232\command\pedido
mkdir src\br\com\curso\aula232\command\os
mkdir src\br\com\curso\aula232\command\mensageria

mkdir src\br\com\curso\aula232\aplicacao
mkdir src\br\com\curso\aula232\aplicacao\port
mkdir src\br\com\curso\aula232\aplicacao\executor

mkdir src\br\com\curso\aula232\infra
mkdir src\br\com\curso\aula232\infra\auditoria
mkdir src\br\com\curso\aula232\infra\mensageria
mkdir src\br\com\curso\aula232\infra\repository

mkdir src\br\com\curso\aula232\fila
```

---

# Parte 5 — Domínio de Pedido

## StatusPedido

Crie:

```text
src\br\com\curso\aula232\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula232.dominio.pedido;

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
src\br\com\curso\aula232\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula232.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private StatusPedido status;

    public Pedido(UUID id, String codigo, String cliente, BigDecimal valor, Instant criadoEm) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
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

    public void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo do cancelamento é obrigatório.");
        }

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
src\br\com\curso\aula232\aplicacao\port\PedidoRepository.java
```

Código:

```java
package br.com.curso.aula232.aplicacao.port;

import br.com.curso.aula232.dominio.pedido.Pedido;

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
src\br\com\curso\aula232\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula232.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, String detalhes, Instant ocorridoEm);
}
```

---

## MensageriaGateway

Crie:

```text
src\br\com\curso\aula232\aplicacao\port\MensageriaGateway.java
```

Código:

```java
package br.com.curso.aula232.aplicacao.port;

public interface MensageriaGateway {
    void enviar(String destino, String mensagem);
}
```

---

# Parte 7 — Infraestrutura simples

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula232\infra\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula232.infra.repository;

import br.com.curso.aula232.aplicacao.port.PedidoRepository;
import br.com.curso.aula232.dominio.pedido.Pedido;

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
src\br\com\curso\aula232\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula232.infra.auditoria;

import br.com.curso.aula232.aplicacao.port.AuditoriaGateway;

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
src\br\com\curso\aula232\infra\mensageria\MensageriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula232.infra.mensageria;

import br.com.curso.aula232.aplicacao.port.MensageriaGateway;

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

# Parte 8 — Interface Command

## Comando

Crie:

```text
src\br\com\curso\aula232\command\core\Comando.java
```

Código:

```java
package br.com.curso.aula232.command.core;

public interface Comando {
    String nome();

    String descricao();

    void executar();
}
```

---

## ResultadoExecucaoComando

Crie:

```text
src\br\com\curso\aula232\command\core\ResultadoExecucaoComando.java
```

Código:

```java
package br.com.curso.aula232.command.core;

import java.time.Instant;

public class ResultadoExecucaoComando {
    private final String nomeComando;
    private final boolean sucesso;
    private final String mensagem;
    private final Instant executadoEm;

    private ResultadoExecucaoComando(String nomeComando, boolean sucesso, String mensagem, Instant executadoEm) {
        if (nomeComando == null || nomeComando.isBlank()) {
            throw new IllegalArgumentException("Nome do comando é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        if (executadoEm == null) {
            throw new IllegalArgumentException("Data/hora é obrigatória.");
        }

        this.nomeComando = nomeComando;
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.executadoEm = executadoEm;
    }

    public static ResultadoExecucaoComando sucesso(String nomeComando, String mensagem, Instant executadoEm) {
        return new ResultadoExecucaoComando(nomeComando, true, mensagem, executadoEm);
    }

    public static ResultadoExecucaoComando falha(String nomeComando, String mensagem, Instant executadoEm) {
        return new ResultadoExecucaoComando(nomeComando, false, mensagem, executadoEm);
    }

    public String nomeComando() {
        return nomeComando;
    }

    public boolean sucesso() {
        return sucesso;
    }

    public String mensagem() {
        return mensagem;
    }

    public Instant executadoEm() {
        return executadoEm;
    }

    @Override
    public String toString() {
        return "ResultadoExecucaoComando{"
                + "nomeComando='" + nomeComando + '\''
                + ", sucesso=" + sucesso
                + ", mensagem='" + mensagem + '\''
                + ", executadoEm=" + executadoEm
                + '}';
    }
}
```

---

# Parte 9 — Executor de comandos

## ExecutorComando

Crie:

```text
src\br\com\curso\aula232\aplicacao\executor\ExecutorComando.java
```

Código:

```java
package br.com.curso.aula232.aplicacao.executor;

import br.com.curso.aula232.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula232.command.core.Comando;
import br.com.curso.aula232.command.core.ResultadoExecucaoComando;

import java.time.Instant;

public class ExecutorComando {
    private final AuditoriaGateway auditoriaGateway;

    public ExecutorComando(AuditoriaGateway auditoriaGateway) {
        if (auditoriaGateway == null) {
            throw new IllegalArgumentException("AuditoriaGateway é obrigatório.");
        }

        this.auditoriaGateway = auditoriaGateway;
    }

    public ResultadoExecucaoComando executar(Comando comando, Instant agora) {
        if (comando == null) {
            throw new IllegalArgumentException("Comando é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        auditoriaGateway.registrar(
                "COMANDO_INICIADO",
                comando.nome() + " | " + comando.descricao(),
                agora
        );

        try {
            comando.executar();

            auditoriaGateway.registrar(
                    "COMANDO_FINALIZADO",
                    comando.nome() + " executado com sucesso.",
                    Instant.now()
            );

            return ResultadoExecucaoComando.sucesso(
                    comando.nome(),
                    "Comando executado com sucesso.",
                    Instant.now()
            );
        } catch (RuntimeException erro) {
            auditoriaGateway.registrar(
                    "COMANDO_FALHOU",
                    comando.nome() + " | Erro: " + erro.getMessage(),
                    Instant.now()
            );

            return ResultadoExecucaoComando.falha(
                    comando.nome(),
                    erro.getMessage(),
                    Instant.now()
            );
        }
    }
}
```

---

## O que o executor faz

O executor padroniza:

```text
auditoria de início;
execução;
auditoria de sucesso;
auditoria de falha;
resultado da execução.
```

O command foca na ação.

O executor foca na execução padronizada.

---

# Parte 10 — Commands de Pedido

## PagarPedidoCommand

Crie:

```text
src\br\com\curso\aula232\command\pedido\PagarPedidoCommand.java
```

Código:

```java
package br.com.curso.aula232.command.pedido;

import br.com.curso.aula232.aplicacao.port.MensageriaGateway;
import br.com.curso.aula232.aplicacao.port.PedidoRepository;
import br.com.curso.aula232.command.core.Comando;
import br.com.curso.aula232.dominio.pedido.Pedido;

public class PagarPedidoCommand implements Comando {
    private final String codigoPedido;
    private final PedidoRepository repository;
    private final MensageriaGateway mensageriaGateway;

    public PagarPedidoCommand(
            String codigoPedido,
            PedidoRepository repository,
            MensageriaGateway mensageriaGateway
    ) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (mensageriaGateway == null) {
            throw new IllegalArgumentException("MensageriaGateway é obrigatório.");
        }

        this.codigoPedido = codigoPedido.trim().toUpperCase();
        this.repository = repository;
        this.mensageriaGateway = mensageriaGateway;
    }

    @Override
    public String nome() {
        return "PAGAR_PEDIDO";
    }

    @Override
    public String descricao() {
        return "Pagar pedido " + codigoPedido;
    }

    @Override
    public void executar() {
        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigoPedido));

        pedido.pagar();

        repository.salvar(pedido);

        mensageriaGateway.enviar(
                pedido.cliente(),
                "Seu pedido " + pedido.codigo() + " foi pago com sucesso."
        );
    }
}
```

---

## CancelarPedidoCommand

Crie:

```text
src\br\com\curso\aula232\command\pedido\CancelarPedidoCommand.java
```

Código:

```java
package br.com.curso.aula232.command.pedido;

import br.com.curso.aula232.aplicacao.port.MensageriaGateway;
import br.com.curso.aula232.aplicacao.port.PedidoRepository;
import br.com.curso.aula232.command.core.Comando;
import br.com.curso.aula232.dominio.pedido.Pedido;

public class CancelarPedidoCommand implements Comando {
    private final String codigoPedido;
    private final String motivo;
    private final PedidoRepository repository;
    private final MensageriaGateway mensageriaGateway;

    public CancelarPedidoCommand(
            String codigoPedido,
            String motivo,
            PedidoRepository repository,
            MensageriaGateway mensageriaGateway
    ) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (mensageriaGateway == null) {
            throw new IllegalArgumentException("MensageriaGateway é obrigatório.");
        }

        this.codigoPedido = codigoPedido.trim().toUpperCase();
        this.motivo = motivo.trim();
        this.repository = repository;
        this.mensageriaGateway = mensageriaGateway;
    }

    @Override
    public String nome() {
        return "CANCELAR_PEDIDO";
    }

    @Override
    public String descricao() {
        return "Cancelar pedido " + codigoPedido + " | Motivo: " + motivo;
    }

    @Override
    public void executar() {
        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigoPedido));

        pedido.cancelar(motivo);

        repository.salvar(pedido);

        mensageriaGateway.enviar(
                pedido.cliente(),
                "Seu pedido " + pedido.codigo() + " foi cancelado. Motivo: " + motivo
        );
    }
}
```

---

# Parte 11 — App executando commands

## CommandPedidoApp

Crie:

```text
src\br\com\curso\aula232\app\CommandPedidoApp.java
```

Código:

```java
package br.com.curso.aula232.app;

import br.com.curso.aula232.aplicacao.executor.ExecutorComando;
import br.com.curso.aula232.aplicacao.port.MensageriaGateway;
import br.com.curso.aula232.aplicacao.port.PedidoRepository;
import br.com.curso.aula232.command.core.ResultadoExecucaoComando;
import br.com.curso.aula232.command.pedido.PagarPedidoCommand;
import br.com.curso.aula232.dominio.pedido.Pedido;
import br.com.curso.aula232.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula232.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula232.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class CommandPedidoApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();
        MensageriaGateway mensageriaGateway = new MensageriaConsoleGateway();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                new BigDecimal("1500.00"),
                Instant.now()
        );

        repository.salvar(pedido);

        PagarPedidoCommand command = new PagarPedidoCommand(
                "PED-001",
                repository,
                mensageriaGateway
        );

        ExecutorComando executor = new ExecutorComando(
                new AuditoriaConsoleGateway()
        );

        ResultadoExecucaoComando resultado = executor.executar(command, Instant.now());

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula232.app.CommandPedidoApp
```

---

## CommandCancelamentoApp

Crie:

```text
src\br\com\curso\aula232\app\CommandCancelamentoApp.java
```

Código:

```java
package br.com.curso.aula232.app;

import br.com.curso.aula232.aplicacao.executor.ExecutorComando;
import br.com.curso.aula232.aplicacao.port.MensageriaGateway;
import br.com.curso.aula232.aplicacao.port.PedidoRepository;
import br.com.curso.aula232.command.core.ResultadoExecucaoComando;
import br.com.curso.aula232.command.pedido.CancelarPedidoCommand;
import br.com.curso.aula232.dominio.pedido.Pedido;
import br.com.curso.aula232.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula232.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula232.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class CommandCancelamentoApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();
        MensageriaGateway mensageriaGateway = new MensageriaConsoleGateway();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-002",
                "Carlos Souza",
                new BigDecimal("800.00"),
                Instant.now()
        );

        repository.salvar(pedido);

        CancelarPedidoCommand command = new CancelarPedidoCommand(
                "PED-002",
                "Cliente solicitou cancelamento.",
                repository,
                mensageriaGateway
        );

        ExecutorComando executor = new ExecutorComando(
                new AuditoriaConsoleGateway()
        );

        ResultadoExecucaoComando resultado = executor.executar(command, Instant.now());

        System.out.println(resultado);
    }
}
```

---

## CommandFalhaApp

Crie:

```text
src\br\com\curso\aula232\app\CommandFalhaApp.java
```

Código:

```java
package br.com.curso.aula232.app;

import br.com.curso.aula232.aplicacao.executor.ExecutorComando;
import br.com.curso.aula232.command.core.ResultadoExecucaoComando;
import br.com.curso.aula232.command.pedido.PagarPedidoCommand;
import br.com.curso.aula232.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula232.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula232.infra.repository.PedidoRepositoryMemoria;

import java.time.Instant;

public class CommandFalhaApp {
    public static void main(String[] args) {
        PagarPedidoCommand command = new PagarPedidoCommand(
                "PED-INEXISTENTE",
                new PedidoRepositoryMemoria(),
                new MensageriaConsoleGateway()
        );

        ExecutorComando executor = new ExecutorComando(
                new AuditoriaConsoleGateway()
        );

        ResultadoExecucaoComando resultado = executor.executar(command, Instant.now());

        System.out.println(resultado);
    }
}
```

---

# Parte 12 — Simulando fila de comandos

Uma das grandes utilidades de Command é que comandos podem ser guardados em uma fila.

Em sistemas reais, isso pode virar:

```text
fila em memória;
fila Kafka;
RabbitMQ;
SQS;
tabela de comandos pendentes;
job agendado;
worker assíncrono.
```

Aqui vamos simular em memória.

---

## FilaComandosMemoria

Crie:

```text
src\br\com\curso\aula232\fila\FilaComandosMemoria.java
```

Código:

```java
package br.com.curso.aula232.fila;

import br.com.curso.aula232.command.core.Comando;

import java.util.LinkedList;
import java.util.Queue;

public class FilaComandosMemoria {
    private final Queue<Comando> fila = new LinkedList<>();

    public void adicionar(Comando comando) {
        if (comando == null) {
            throw new IllegalArgumentException("Comando é obrigatório.");
        }

        fila.add(comando);

        System.out.println("[FILA] Comando adicionado: " + comando.nome());
    }

    public Comando proximo() {
        return fila.poll();
    }

    public boolean vazia() {
        return fila.isEmpty();
    }

    public int tamanho() {
        return fila.size();
    }
}
```

---

## ProcessadorFilaComandos

Crie:

```text
src\br\com\curso\aula232\fila\ProcessadorFilaComandos.java
```

Código:

```java
package br.com.curso.aula232.fila;

import br.com.curso.aula232.aplicacao.executor.ExecutorComando;
import br.com.curso.aula232.command.core.Comando;

import java.time.Instant;

public class ProcessadorFilaComandos {
    private final FilaComandosMemoria fila;
    private final ExecutorComando executor;

    public ProcessadorFilaComandos(FilaComandosMemoria fila, ExecutorComando executor) {
        if (fila == null) {
            throw new IllegalArgumentException("Fila é obrigatória.");
        }

        if (executor == null) {
            throw new IllegalArgumentException("Executor é obrigatório.");
        }

        this.fila = fila;
        this.executor = executor;
    }

    public void processarTudo() {
        while (!fila.vazia()) {
            Comando comando = fila.proximo();

            executor.executar(comando, Instant.now());
        }
    }
}
```

---

## CommandFilaApp

Crie:

```text
src\br\com\curso\aula232\app\CommandFilaApp.java
```

Código:

```java
package br.com.curso.aula232.app;

import br.com.curso.aula232.aplicacao.executor.ExecutorComando;
import br.com.curso.aula232.aplicacao.port.MensageriaGateway;
import br.com.curso.aula232.aplicacao.port.PedidoRepository;
import br.com.curso.aula232.command.pedido.CancelarPedidoCommand;
import br.com.curso.aula232.command.pedido.PagarPedidoCommand;
import br.com.curso.aula232.dominio.pedido.Pedido;
import br.com.curso.aula232.fila.FilaComandosMemoria;
import br.com.curso.aula232.fila.ProcessadorFilaComandos;
import br.com.curso.aula232.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula232.infra.mensageria.MensageriaConsoleGateway;
import br.com.curso.aula232.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class CommandFilaApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();
        MensageriaGateway mensageriaGateway = new MensageriaConsoleGateway();

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-010",
                "Ana Silva",
                new BigDecimal("1000.00"),
                Instant.now()
        ));

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-011",
                "Carlos Souza",
                new BigDecimal("700.00"),
                Instant.now()
        ));

        FilaComandosMemoria fila = new FilaComandosMemoria();

        fila.adicionar(new PagarPedidoCommand(
                "PED-010",
                repository,
                mensageriaGateway
        ));

        fila.adicionar(new CancelarPedidoCommand(
                "PED-011",
                "Cliente desistiu.",
                repository,
                mensageriaGateway
        ));

        ProcessadorFilaComandos processador = new ProcessadorFilaComandos(
                fila,
                new ExecutorComando(new AuditoriaConsoleGateway())
        );

        processador.processarTudo();
    }
}
```

---

# Parte 13 — Command para mensageria

Command também é muito útil para ações simples que podem ser enfileiradas.

## EnviarMensagemCommand

Crie:

```text
src\br\com\curso\aula232\command\mensageria\EnviarMensagemCommand.java
```

Código:

```java
package br.com.curso.aula232.command.mensageria;

import br.com.curso.aula232.aplicacao.port.MensageriaGateway;
import br.com.curso.aula232.command.core.Comando;

public class EnviarMensagemCommand implements Comando {
    private final String destino;
    private final String mensagem;
    private final MensageriaGateway mensageriaGateway;

    public EnviarMensagemCommand(String destino, String mensagem, MensageriaGateway mensageriaGateway) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        if (mensageriaGateway == null) {
            throw new IllegalArgumentException("MensageriaGateway é obrigatório.");
        }

        this.destino = destino.trim();
        this.mensagem = mensagem.trim();
        this.mensageriaGateway = mensageriaGateway;
    }

    @Override
    public String nome() {
        return "ENVIAR_MENSAGEM";
    }

    @Override
    public String descricao() {
        return "Enviar mensagem para " + destino;
    }

    @Override
    public void executar() {
        mensageriaGateway.enviar(destino, mensagem);
    }
}
```

---

## CommandMensageriaApp

Crie:

```text
src\br\com\curso\aula232\app\CommandMensageriaApp.java
```

Código:

```java
package br.com.curso.aula232.app;

import br.com.curso.aula232.aplicacao.executor.ExecutorComando;
import br.com.curso.aula232.command.core.ResultadoExecucaoComando;
import br.com.curso.aula232.command.mensageria.EnviarMensagemCommand;
import br.com.curso.aula232.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula232.infra.mensageria.MensageriaConsoleGateway;

import java.time.Instant;

public class CommandMensageriaApp {
    public static void main(String[] args) {
        EnviarMensagemCommand command = new EnviarMensagemCommand(
                "11999999999",
                "Sua OS foi aberta com sucesso.",
                new MensageriaConsoleGateway()
        );

        ExecutorComando executor = new ExecutorComando(
                new AuditoriaConsoleGateway()
        );

        ResultadoExecucaoComando resultado = executor.executar(command, Instant.now());

        System.out.println(resultado);
    }
}
```

---

# Parte 14 — Command e auditoria

Command combina muito bem com auditoria porque você consegue registrar:

```text
qual comando foi executado;
quando começou;
quando terminou;
quem solicitou;
quais parâmetros;
se falhou;
qual erro ocorreu.
```

Nesta aula, registramos:

```text
COMANDO_INICIADO;
COMANDO_FINALIZADO;
COMANDO_FALHOU.
```

Em sistema real, também poderia registrar:

```text
usuário;
correlationId;
requestId;
origem;
ip;
payload resumido;
tempo de execução;
tentativas;
status.
```

---

# Parte 15 — Command e reprocessamento

Quando uma ação é um objeto, fica mais fácil pensar em reprocessamento.

Exemplo:

```text
EnviarMensagemCommand falhou porque API externa ficou fora.
```

Você pode guardar o comando e tentar depois.

Em sistemas reais, isso pode envolver:

```text
fila;
dead letter queue;
tabela de pendências;
worker;
retry;
backoff;
idempotência.
```

Nesta aula não implementaremos tudo isso ainda.

Mas o padrão abre esse caminho.

---

## Cuidado com idempotência

Se um comando pode ser reexecutado, pense:

```text
executar duas vezes causa problema?
pagar duas vezes cobra duas vezes?
enviar duas mensagens é aceitável?
cancelar duas vezes gera erro?
salvar duas vezes duplica?
```

Command ajuda a organizar, mas você ainda precisa desenhar a regra.

---

# Parte 16 — Command e undo

Alguns exemplos clássicos de Command mostram `undo`.

Em backend, desfazer nem sempre é simples.

Exemplo:

```text
cancelar envio de e-mail já enviado não é possível;
desfazer pagamento exige estorno;
desfazer baixa de estoque exige ajuste;
desfazer importação exige rastrear alterações.
```

Então, em backend corporativo, muitas vezes o "undo" é uma nova operação de compensação.

Exemplo:

```text
PagarPedidoCommand
EstornarPagamentoCommand
```

Não tente simplificar demais.

---

# Parte 17 — Como isso conversa com front-end

No futuro, o front pode acionar operações assim:

```text
POST /pedidos/PED-001/pagar
POST /pedidos/PED-001/cancelar
POST /mensagens/enviar
POST /ordens-servico/OS-001/reagendar
```

O controller cria ou chama um command:

```java
Comando comando = new PagarPedidoCommand(...);
ResultadoExecucaoComando resultado = executor.executar(comando, Instant.now());
```

O response pode ser:

```json
{
  "comando": "PAGAR_PEDIDO",
  "sucesso": true,
  "mensagem": "Comando executado com sucesso.",
  "executadoEm": "2026-07-09T10:00:00Z"
}
```

Isso padroniza respostas de ações.

---

# Parte 18 — Erros comuns com Command

## 1. Command gigante

Um command deve representar uma ação clara.

Se ele faz tudo do sistema, está errado.

---

## 2. Command sem necessidade

Se a operação é simples e não precisa de auditoria, fila, reprocessamento ou padronização, talvez um use case simples baste.

---

## 3. Command escondendo regra de domínio

A entidade ainda deve proteger regra.

Exemplo:

```text
Pedido.cancelar() decide se pode cancelar.
Command chama pedido.cancelar().
```

---

## 4. Executor com regra de negócio

Executor deve padronizar execução.

Não deve conhecer regra específica de pedido, OS, pagamento etc.

---

## 5. Comando não idempotente em fila

Se pode reprocessar, precisa pensar em duplicidade.

---

# Parte 19 — Checklist para usar Command

Pergunte:

```text
1. A ação precisa ser encapsulada?
2. Preciso auditar execução?
3. Preciso enfileirar?
4. Preciso reprocessar?
5. Preciso padronizar execução?
6. Preciso executar em lote?
7. Preciso registrar sucesso/falha?
8. A entidade continua protegendo regra?
9. O command está pequeno e específico?
10. Um use case simples não resolveria melhor?
```

---

# Parte 20 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula232.app.CommandPedidoApp
java -cp out br.com.curso.aula232.app.CommandCancelamentoApp
java -cp out br.com.curso.aula232.app.CommandFalhaApp
java -cp out br.com.curso.aula232.app.CommandFilaApp
java -cp out br.com.curso.aula232.app.CommandMensageriaApp
```

Depois responda:

```text
1. Qual interface representa um command?
2. Qual classe padroniza a execução?
3. O que PagarPedidoCommand encapsula?
4. O que CancelarPedidoCommand encapsula?
5. Como o executor audita sucesso?
6. Como o executor audita falha?
7. Como a fila usa commands?
8. Como Command ajuda mensageria?
9. Qual diferença entre Command e Strategy?
10. Quando Command seria exagerado?
```

---

# Parte 21 — Exercício prático principal

## Contexto

Crie Commands para Ordem de Serviço.

Ações:

```text
AgendarOrdemServicoCommand;
IniciarAtendimentoCommand;
ConcluirOrdemServicoCommand;
CancelarOrdemServicoCommand.
```

---

## Domínio

Crie:

```text
OrdemServico
```

Campos:

```text
String codigo;
String cliente;
String status;
```

Métodos:

```text
agendar();
iniciarAtendimento();
concluir();
cancelar(String motivo);
```

Regras:

```text
ABERTA -> pode agendar ou cancelar.
AGENDADA -> pode iniciar atendimento ou cancelar.
EM_ATENDIMENTO -> pode concluir.
CONCLUIDA -> não permite alterações.
CANCELADA -> não permite alterações.
```

---

## Ports

Crie:

```text
OrdemServicoRepository;
AuditoriaGateway;
MensageriaGateway.
```

---

## Commands

Cada command deve:

```text
buscar OS no repository;
chamar método da entidade;
salvar;
enviar mensagem se necessário;
deixar auditoria para o executor.
```

---

## Executor

Reutilize ideia:

```text
ExecutorComando
```

---

## App

Crie:

```text
CommandOrdemServicoApp
CommandOrdemServicoFilaApp
CommandOrdemServicoFalhaApp
```

---

## Critérios

```text
command representa ação clara;
executor não conhece regra de OS;
entidade decide transição;
repository salva;
mensageria notifica;
auditoria padronizada no executor.
```

---

# Parte 22 — Desafio extra

## Command com retry simples

Crie:

```text
ExecutorComandoComRetry
```

Regras:

```text
recebe número máximo de tentativas;
executa comando;
se falhar, tenta novamente;
registra tentativa;
se acabar tentativas, retorna falha.
```

Crie um command que falha propositalmente nas duas primeiras vezes e funciona na terceira.

Exemplo:

```text
EnviarMensagemInstavelCommand
```

Objetivo:

```text
entender reprocessamento básico.
```

Cuidado:

```text
nem todo comando pode ser reexecutado sem risco.
```

Explique isso nos comentários.

---

# Parte 23 — Simulado rápido

## Questão 1

Command Pattern é usado para:

```text
A) encapsular uma ação como objeto.
B) adaptar API externa.
C) montar objeto com muitos campos.
D) representar status interno.
```

---

## Questão 2

Um executor de comandos pode padronizar:

```text
A) auditoria, sucesso e falha.
B) apenas enums.
C) apenas construtores.
D) apenas arquivos CSS.
```

---

## Questão 3

Command é útil para:

```text
A) fila, auditoria e reprocessamento.
B) apenas cálculo matemático simples.
C) apenas exibir status.
D) apenas criar DTO.
```

---

## Questão 4

A regra de negócio principal deve ficar:

```text
A) na entidade/use case apropriado, não escondida de forma indevida no executor.
B) toda no executor.
C) toda no controller.
D) toda no System.out.println.
```

---

## Questão 5

Command se diferencia de Strategy porque:

```text
A) Command representa uma ação; Strategy representa uma regra intercambiável.
B) Command é sempre banco de dados.
C) Strategy é sempre fila.
D) Não existe diferença.
```

---

## Questão 6

Ao reprocessar commands, é importante pensar em:

```text
A) idempotência.
B) apenas nome de pacote.
C) apenas cor do terminal.
D) apenas comentários.
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
[ ] Sei explicar Command Pattern.
[ ] Sei criar interface Comando.
[ ] Sei criar command concreto.
[ ] Sei criar executor de comandos.
[ ] Sei auditar início, sucesso e falha.
[ ] Sei simular fila de comandos.
[ ] Sei diferenciar Command de Strategy.
[ ] Sei diferenciar Command de Use Case.
[ ] Sei diferenciar Command de Chain.
[ ] Sei aplicar Command em pedido.
[ ] Sei aplicar Command em mensageria.
[ ] Sei pensar em reprocessamento.
[ ] Sei explicar idempotência.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Command Pattern?
2. Qual problema ele resolve?
3. O que é um command?
4. O que é um executor de comandos?
5. Como Command ajuda auditoria?
6. Como Command ajuda filas?
7. Como Command ajuda reprocessamento?
8. Qual diferença entre Command e Strategy?
9. Qual diferença entre Command e Use Case?
10. Por que idempotência é importante?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
encapsular ações como comandos;
executar comandos com auditoria;
simular fila de comandos;
tratar sucesso e falha;
aplicar Command em pedido;
aplicar Command em mensageria;
projetar commands para OS;
entender cuidado com retry e idempotência.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-232-command-pattern-acoes-comandos-auditoria-filas
git commit -m "Aula 232: command pattern acoes comandos auditoria filas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Command Pattern transforma ações em objetos, permitindo execução padronizada, auditoria, filas e reprocessamento.
```

Você estudou:

```text
Command Pattern;
interface Comando;
commands de pedido;
command de mensageria;
executor de comandos;
auditoria;
falhas;
fila em memória;
reprocessamento;
idempotência;
diferença para Strategy, Chain e Use Case.
```

Na próxima aula, vamos estudar:

```text
Observer Pattern.
```

A ideia será entender eventos, notificações e reações desacopladas quando algo acontece no domínio ou na aplicação.
