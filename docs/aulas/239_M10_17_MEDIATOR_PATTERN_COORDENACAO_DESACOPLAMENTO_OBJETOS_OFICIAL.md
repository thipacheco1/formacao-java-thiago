# 239 — M10.17 — Mediator Pattern: coordenação e desacoplamento entre objetos

## Objetivo da aula

Na aula anterior, você estudou:

```text
Bridge Pattern
```

Você viu que Bridge ajuda quando existem duas dimensões que variam de forma independente, como:

```text
relatório e formato;
notificação e canal;
pagamento e provedor;
documento e renderizador;
arquivo e storage.
```

Agora vamos estudar um padrão comportamental importante para reduzir acoplamento entre objetos que precisam conversar entre si:

```text
Mediator Pattern
```

Em português:

```text
Padrão Mediador
```

Mediator aparece quando vários objetos começam a conhecer uns aos outros e a comunicação direta vira uma teia difícil de manter.

Exemplos comuns em backend:

```text
central de atendimento;
fila de atendimento;
chat interno;
workflow entre módulos;
coordenação entre componentes;
orquestração de eventos internos;
tela com vários componentes interdependentes;
módulos de agenda, fila, histórico e mensageria;
validação cruzada entre componentes;
coordenação de importação;
coordenação de aprovação;
módulos que precisam reagir uns aos outros sem acoplamento direto.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Mediator resolve;
identificar comunicação direta excessiva;
criar uma interface de mediador;
criar objetos participantes;
centralizar comunicação no mediador;
aplicar Mediator em atendimento;
aplicar Mediator em ordem de serviço;
diferenciar Mediator de Facade;
diferenciar Mediator de Observer;
diferenciar Mediator de Use Case;
diferenciar Mediator de Chain;
evitar mediador virando classe Deus;
entender onde o padrão aparece em sistemas reais.
```

---

## Ideia principal

Mediator centraliza a comunicação entre objetos.

Em vez de vários objetos se chamarem diretamente:

```text
Cliente -> Analista
Cliente -> Histórico
Cliente -> Notificador
Analista -> Cliente
Analista -> Histórico
Analista -> Fila
Fila -> Notificador
```

Você cria um mediador:

```text
Cliente -> Mediador
Analista -> Mediador
Fila -> Mediador
Histórico -> Mediador
Notificador -> Mediador
```

O mediador decide quem deve ser avisado e o que deve acontecer.

---

## Mediator em uma frase prática

```text
Use Mediator quando muitos objetos precisam se comunicar e o acoplamento direto começou a ficar difícil de manter.
```

Ou:

```text
Mediator reduz a comunicação muitos-para-muitos transformando em comunicação via um coordenador central.
```

---

## Problema sem Mediator

Imagine uma central de atendimento.

Você tem:

```text
cliente;
analista;
fila;
histórico;
notificação;
auditoria;
mensageria.
```

Sem Mediator, cada objeto pode começar a conhecer vários outros.

Exemplo ruim:

```text
Cliente conhece Analista.
Cliente conhece Historico.
Cliente conhece Notificador.

Analista conhece Cliente.
Analista conhece Historico.
Analista conhece Fila.
Analista conhece Auditoria.

Fila conhece Analista.
Fila conhece Notificador.
```

Isso gera uma rede difícil.

Se mudar uma regra de comunicação, você altera várias classes.

Mediator centraliza essa comunicação.

---

## Relação com SOLID

## SRP

Cada participante continua com responsabilidade própria.

O mediador coordena a comunicação.

```text
Cliente:
envia e recebe mensagens.

Analista:
envia e recebe mensagens.

Historico:
registra mensagens.

Notificador:
notifica participantes.

Mediator:
coordena quem recebe o quê.
```

---

## OCP

Você pode adicionar novo tipo de participante ou reação com menor impacto, desde que o mediador esteja bem desenhado.

Mas cuidado: se toda mudança exige alterar o mediador, ele pode estar ficando grande demais.

---

## LSP

Participantes que implementam o mesmo contrato precisam ser substituíveis.

Exemplo:

```text
ClienteAtendimento;
AnalistaAtendimento;
SupervisorAtendimento.
```

Todos podem participar da comunicação.

---

## ISP

A interface do mediador deve ser focada.

Não crie um mediador com dezenas de métodos sem relação.

---

## DIP

Participantes dependem da abstração do mediador, não da implementação concreta.

Exemplo:

```java
private final AtendimentoMediator mediator;
```

E não:

```java
private final CentralAtendimentoMediator mediator;
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

Com Mediator:

```text
O mediador coordena comunicação entre objetos participantes.
A entidade continua protegendo regra de negócio.
O use case continua coordenando o caso de uso.
O repository continua salvando.
O client continua integrando.
O controller futuro continua recebendo.
```

Mediator não substitui entidade.

Mediator não deve virar use case gigante.

---

# Parte 1 — Mediator vs Facade

## Facade

Facade simplifica o acesso externo a um subsistema.

Exemplo:

```java
checkoutFacade.finalizarCompra(request);
```

Quem chama a Facade não quer conhecer a complexidade interna.

---

## Mediator

Mediator coordena comunicação entre objetos internos.

Exemplo:

```text
cliente envia mensagem;
mediador registra histórico;
mediador notifica analistas;
mediador publica resposta.
```

---

## Diferença prática

```text
Facade:
simplifica acesso para quem está de fora.

Mediator:
organiza comunicação entre quem está dentro.
```

---

# Parte 2 — Mediator vs Observer

## Observer

Um evento acontece e vários listeners reagem.

Exemplo:

```text
PedidoPagoEvent
  -> AuditoriaListener
  -> NotificacaoListener
  -> EstoqueListener
```

O publicador não precisa conhecer os listeners.

---

## Mediator

Vários participantes se comunicam por um coordenador.

Exemplo:

```text
Cliente envia mensagem ao mediador.
Mediador entrega para analistas.
Analista responde via mediador.
Mediador entrega para cliente e registra histórico.
```

---

## Diferença prática

```text
Observer:
alguém publica um fato e interessados reagem.

Mediator:
objetos conversam entre si por meio de um coordenador.
```

---

# Parte 3 — Mediator vs Use Case

## Use Case

Representa uma operação de aplicação.

Exemplo:

```text
AbrirOrdemServicoUseCase;
PagarPedidoUseCase;
ReagendarAtividadeUseCase.
```

---

## Mediator

Coordena interação entre objetos participantes.

Exemplo:

```text
CentralAtendimentoMediator;
OrdemServicoModuloMediator;
ChatAtendimentoMediator.
```

---

## Cuidado

Em backend, às vezes o mediador pode parecer um use case.

A diferença é a intenção.

```text
Use Case:
executa uma operação de negócio.

Mediator:
reduz acoplamento entre objetos que precisam conversar.
```

Se seu mediador virou um lugar que faz tudo do sistema, provavelmente ele está errado.

---

# Parte 4 — Mediator vs Chain

## Chain

Executa uma sequência de handlers.

```text
ValidadorCliente -> ValidadorProduto -> ValidadorPagamento
```

## Mediator

Coordena comunicação entre participantes.

```text
Cliente -> Mediador -> Analista
Analista -> Mediador -> Histórico
```

Diferença prática:

```text
Chain:
pipeline.

Mediator:
coordenação de comunicação.
```

---

# Parte 5 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-239-mediator-pattern-coordenacao-desacoplamento-objetos
cd labs\m10\aula-239-mediator-pattern-coordenacao-desacoplamento-objetos
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula239

mkdir src\br\com\curso\aula239\app

mkdir src\br\com\curso\aula239\atendimento
mkdir src\br\com\curso\aula239\atendimento\core
mkdir src\br\com\curso\aula239\atendimento\participante
mkdir src\br\com\curso\aula239\atendimento\infra

mkdir src\br\com\curso\aula239\os
mkdir src\br\com\curso\aula239\os\core
mkdir src\br\com\curso\aula239\os\modulo
mkdir src\br\com\curso\aula239\os\infra
```

---

# Parte 6 — Exemplo 1: central de atendimento

Vamos criar uma central de atendimento com participantes.

Participantes:

```text
Cliente;
Analista;
Supervisor.
```

Componentes auxiliares:

```text
Histórico;
Notificador.
```

Mediador:

```text
CentralAtendimentoMediator.
```

Objetivo:

```text
participantes não devem conhecer diretamente uns aos outros;
participantes enviam mensagem para o mediador;
mediador registra histórico e encaminha mensagens.
```

---

## MensagemAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\core\MensagemAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.core;

import java.time.Instant;

public class MensagemAtendimento {
    private final String origem;
    private final String tipoOrigem;
    private final String conteudo;
    private final Instant enviadaEm;

    public MensagemAtendimento(String origem, String tipoOrigem, String conteudo, Instant enviadaEm) {
        if (origem == null || origem.isBlank()) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        if (tipoOrigem == null || tipoOrigem.isBlank()) {
            throw new IllegalArgumentException("Tipo da origem é obrigatório.");
        }

        if (conteudo == null || conteudo.isBlank()) {
            throw new IllegalArgumentException("Conteúdo é obrigatório.");
        }

        if (enviadaEm == null) {
            throw new IllegalArgumentException("Data de envio é obrigatória.");
        }

        this.origem = origem.trim();
        this.tipoOrigem = tipoOrigem.trim().toUpperCase();
        this.conteudo = conteudo.trim();
        this.enviadaEm = enviadaEm;
    }

    public String origem() {
        return origem;
    }

    public String tipoOrigem() {
        return tipoOrigem;
    }

    public String conteudo() {
        return conteudo;
    }

    public Instant enviadaEm() {
        return enviadaEm;
    }

    public String resumo() {
        return "[" + enviadaEm + "] " + tipoOrigem + " " + origem + ": " + conteudo;
    }
}
```

---

## AtendimentoMediator

Crie:

```text
src\br\com\curso\aula239\atendimento\core\AtendimentoMediator.java
```

Código:

```java
package br.com.curso.aula239.atendimento.core;

import br.com.curso.aula239.atendimento.participante.ParticipanteAtendimento;

public interface AtendimentoMediator {
    void registrar(ParticipanteAtendimento participante);

    void enviar(ParticipanteAtendimento origem, String conteudo);
}
```

---

## ParticipanteAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\participante\ParticipanteAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.participante;

import br.com.curso.aula239.atendimento.core.AtendimentoMediator;
import br.com.curso.aula239.atendimento.core.MensagemAtendimento;

public abstract class ParticipanteAtendimento {
    private final String nome;
    private final AtendimentoMediator mediator;

    protected ParticipanteAtendimento(String nome, AtendimentoMediator mediator) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (mediator == null) {
            throw new IllegalArgumentException("Mediator é obrigatório.");
        }

        this.nome = nome.trim();
        this.mediator = mediator;
    }

    public String nome() {
        return nome;
    }

    public void enviar(String conteudo) {
        mediator.enviar(this, conteudo);
    }

    public void receber(MensagemAtendimento mensagem) {
        System.out.println("[" + tipo() + " " + nome + " recebeu] " + mensagem.resumo());
    }

    public abstract String tipo();
}
```

---

## ClienteAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\participante\ClienteAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.participante;

import br.com.curso.aula239.atendimento.core.AtendimentoMediator;

public class ClienteAtendimento extends ParticipanteAtendimento {
    public ClienteAtendimento(String nome, AtendimentoMediator mediator) {
        super(nome, mediator);
    }

    @Override
    public String tipo() {
        return "CLIENTE";
    }
}
```

---

## AnalistaAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\participante\AnalistaAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.participante;

import br.com.curso.aula239.atendimento.core.AtendimentoMediator;

public class AnalistaAtendimento extends ParticipanteAtendimento {
    public AnalistaAtendimento(String nome, AtendimentoMediator mediator) {
        super(nome, mediator);
    }

    @Override
    public String tipo() {
        return "ANALISTA";
    }
}
```

---

## SupervisorAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\participante\SupervisorAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.participante;

import br.com.curso.aula239.atendimento.core.AtendimentoMediator;

public class SupervisorAtendimento extends ParticipanteAtendimento {
    public SupervisorAtendimento(String nome, AtendimentoMediator mediator) {
        super(nome, mediator);
    }

    @Override
    public String tipo() {
        return "SUPERVISOR";
    }
}
```

---

# Parte 7 — Infra de atendimento

## HistoricoAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\infra\HistoricoAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.infra;

import br.com.curso.aula239.atendimento.core.MensagemAtendimento;

import java.util.ArrayList;
import java.util.List;

public class HistoricoAtendimento {
    private final List<MensagemAtendimento> mensagens = new ArrayList<>();

    public void registrar(MensagemAtendimento mensagem) {
        if (mensagem == null) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        mensagens.add(mensagem);

        System.out.println("[HISTORICO] " + mensagem.resumo());
    }

    public void imprimir() {
        System.out.println();
        System.out.println("Histórico completo:");

        for (MensagemAtendimento mensagem : mensagens) {
            System.out.println(" - " + mensagem.resumo());
        }
    }

    public int totalMensagens() {
        return mensagens.size();
    }
}
```

---

## NotificadorAtendimento

Crie:

```text
src\br\com\curso\aula239\atendimento\infra\NotificadorAtendimento.java
```

Código:

```java
package br.com.curso.aula239.atendimento.infra;

import br.com.curso.aula239.atendimento.core.MensagemAtendimento;
import br.com.curso.aula239.atendimento.participante.ParticipanteAtendimento;

public class NotificadorAtendimento {
    public void notificar(ParticipanteAtendimento destino, MensagemAtendimento mensagem) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (mensagem == null) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        destino.receber(mensagem);
    }
}
```

---

# Parte 8 — Mediador de atendimento

## CentralAtendimentoMediator

Crie:

```text
src\br\com\curso\aula239\atendimento\core\CentralAtendimentoMediator.java
```

Código:

```java
package br.com.curso.aula239.atendimento.core;

import br.com.curso.aula239.atendimento.infra.HistoricoAtendimento;
import br.com.curso.aula239.atendimento.infra.NotificadorAtendimento;
import br.com.curso.aula239.atendimento.participante.ParticipanteAtendimento;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class CentralAtendimentoMediator implements AtendimentoMediator {
    private final List<ParticipanteAtendimento> participantes = new ArrayList<>();
    private final HistoricoAtendimento historico;
    private final NotificadorAtendimento notificador;

    public CentralAtendimentoMediator(HistoricoAtendimento historico, NotificadorAtendimento notificador) {
        if (historico == null) {
            throw new IllegalArgumentException("Histórico é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        this.historico = historico;
        this.notificador = notificador;
    }

    @Override
    public void registrar(ParticipanteAtendimento participante) {
        if (participante == null) {
            throw new IllegalArgumentException("Participante é obrigatório.");
        }

        participantes.add(participante);

        System.out.println("[MEDIATOR] Participante registrado: "
                + participante.tipo() + " " + participante.nome());
    }

    @Override
    public void enviar(ParticipanteAtendimento origem, String conteudo) {
        if (origem == null) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        MensagemAtendimento mensagem = new MensagemAtendimento(
                origem.nome(),
                origem.tipo(),
                conteudo,
                Instant.now()
        );

        historico.registrar(mensagem);

        for (ParticipanteAtendimento participante : participantes) {
            if (!participante.equals(origem)) {
                notificador.notificar(participante, mensagem);
            }
        }
    }

    public void imprimirHistorico() {
        historico.imprimir();
    }
}
```

---

## AtendimentoMediatorApp

Crie:

```text
src\br\com\curso\aula239\app\AtendimentoMediatorApp.java
```

Código:

```java
package br.com.curso.aula239.app;

import br.com.curso.aula239.atendimento.core.CentralAtendimentoMediator;
import br.com.curso.aula239.atendimento.infra.HistoricoAtendimento;
import br.com.curso.aula239.atendimento.infra.NotificadorAtendimento;
import br.com.curso.aula239.atendimento.participante.AnalistaAtendimento;
import br.com.curso.aula239.atendimento.participante.ClienteAtendimento;
import br.com.curso.aula239.atendimento.participante.SupervisorAtendimento;

public class AtendimentoMediatorApp {
    public static void main(String[] args) {
        CentralAtendimentoMediator mediator = new CentralAtendimentoMediator(
                new HistoricoAtendimento(),
                new NotificadorAtendimento()
        );

        ClienteAtendimento cliente = new ClienteAtendimento("Ana", mediator);
        AnalistaAtendimento analista = new AnalistaAtendimento("Carlos", mediator);
        SupervisorAtendimento supervisor = new SupervisorAtendimento("Maria", mediator);

        mediator.registrar(cliente);
        mediator.registrar(analista);
        mediator.registrar(supervisor);

        System.out.println();

        cliente.enviar("Preciso reagendar minha entrega.");
        analista.enviar("Vou verificar a disponibilidade.");
        supervisor.enviar("Priorizem esse atendimento.");

        mediator.imprimirHistorico();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula239.app.AtendimentoMediatorApp
```

---

## O que melhorou

O cliente não conhece o analista.

O analista não conhece o supervisor.

O supervisor não conhece o cliente diretamente.

Todos conversam pelo mediador.

```text
Participante -> Mediator -> Participantes interessados
```

---

# Parte 9 — Cuidado com Mediator gigante

O Mediator pode virar problema se começar a concentrar tudo.

Ruim:

```text
CentralAtendimentoMediator:
registra histórico;
envia WhatsApp;
consulta banco;
valida permissão;
calcula prioridade;
reagenda atividade;
cria OS;
faz pagamento;
gera relatório.
```

Melhor:

```text
Mediator coordena comunicação.

HistoricoAtendimento registra.
NotificadorAtendimento notifica.
FilaAtendimento organiza fila.
AuditoriaGateway audita.
UseCase executa operação de negócio.
```

O mediador não deve engolir o sistema.

---

# Parte 10 — Exemplo 2: módulos de Ordem de Serviço

Agora vamos usar Mediator em um cenário de backend corporativo.

Imagine módulos:

```text
Agenda;
Fila;
Histórico;
Mensageria;
Auditoria.
```

Quando uma OS é agendada:

```text
agenda registra agendamento;
fila move item;
histórico registra;
mensageria notifica cliente;
auditoria registra evento.
```

Sem Mediator, o módulo Agenda teria que conhecer todos esses módulos.

Com Mediator, Agenda avisa o mediador:

```text
atividadeAgendada(...)
```

E o mediador coordena as reações.

---

## OrdemServicoMediator

Crie:

```text
src\br\com\curso\aula239\os\core\OrdemServicoMediator.java
```

Código:

```java
package br.com.curso.aula239.os.core;

import java.time.LocalDate;

public interface OrdemServicoMediator {
    void atividadeAgendada(String codigoOs, String cliente, LocalDate data);

    void atividadeConcluida(String codigoOs, String cliente);
}
```

---

## AgendaModulo

Crie:

```text
src\br\com\curso\aula239\os\modulo\AgendaModulo.java
```

Código:

```java
package br.com.curso.aula239.os.modulo;

import br.com.curso.aula239.os.core.OrdemServicoMediator;

import java.time.LocalDate;

public class AgendaModulo {
    private final OrdemServicoMediator mediator;

    public AgendaModulo(OrdemServicoMediator mediator) {
        if (mediator == null) {
            throw new IllegalArgumentException("Mediator é obrigatório.");
        }

        this.mediator = mediator;
    }

    public void agendar(String codigoOs, String cliente, LocalDate data) {
        if (codigoOs == null || codigoOs.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        System.out.println("[AGENDA] OS " + codigoOs + " agendada para " + data);

        mediator.atividadeAgendada(codigoOs, cliente, data);
    }
}
```

---

## ExecucaoModulo

Crie:

```text
src\br\com\curso\aula239\os\modulo\ExecucaoModulo.java
```

Código:

```java
package br.com.curso.aula239.os.modulo;

import br.com.curso.aula239.os.core.OrdemServicoMediator;

public class ExecucaoModulo {
    private final OrdemServicoMediator mediator;

    public ExecucaoModulo(OrdemServicoMediator mediator) {
        if (mediator == null) {
            throw new IllegalArgumentException("Mediator é obrigatório.");
        }

        this.mediator = mediator;
    }

    public void concluir(String codigoOs, String cliente) {
        if (codigoOs == null || codigoOs.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        System.out.println("[EXECUCAO] OS " + codigoOs + " concluída.");

        mediator.atividadeConcluida(codigoOs, cliente);
    }
}
```

---

## FilaModulo

Crie:

```text
src\br\com\curso\aula239\os\modulo\FilaModulo.java
```

Código:

```java
package br.com.curso.aula239.os.modulo;

public class FilaModulo {
    public void moverParaFila(String codigoOs, String fila) {
        System.out.println("[FILA] OS " + codigoOs + " movida para fila: " + fila);
    }
}
```

---

## HistoricoOsModulo

Crie:

```text
src\br\com\curso\aula239\os\modulo\HistoricoOsModulo.java
```

Código:

```java
package br.com.curso.aula239.os.modulo;

public class HistoricoOsModulo {
    public void registrar(String codigoOs, String descricao) {
        System.out.println("[HISTORICO OS] " + codigoOs + " | " + descricao);
    }
}
```

---

## MensageriaOsModulo

Crie:

```text
src\br\com\curso\aula239\os\modulo\MensageriaOsModulo.java
```

Código:

```java
package br.com.curso.aula239.os.modulo;

public class MensageriaOsModulo {
    public void enviar(String cliente, String mensagem) {
        System.out.println("[MENSAGERIA OS] Cliente: " + cliente + " | " + mensagem);
    }
}
```

---

## AuditoriaOsModulo

Crie:

```text
src\br\com\curso\aula239\os\modulo\AuditoriaOsModulo.java
```

Código:

```java
package br.com.curso.aula239.os.modulo;

public class AuditoriaOsModulo {
    public void auditar(String evento, String detalhes) {
        System.out.println("[AUDITORIA OS] " + evento + " | " + detalhes);
    }
}
```

---

# Parte 11 — Mediador de OS

## CentralOrdemServicoMediator

Crie:

```text
src\br\com\curso\aula239\os\core\CentralOrdemServicoMediator.java
```

Código:

```java
package br.com.curso.aula239.os.core;

import br.com.curso.aula239.os.modulo.AuditoriaOsModulo;
import br.com.curso.aula239.os.modulo.FilaModulo;
import br.com.curso.aula239.os.modulo.HistoricoOsModulo;
import br.com.curso.aula239.os.modulo.MensageriaOsModulo;

import java.time.LocalDate;

public class CentralOrdemServicoMediator implements OrdemServicoMediator {
    private final FilaModulo filaModulo;
    private final HistoricoOsModulo historicoModulo;
    private final MensageriaOsModulo mensageriaModulo;
    private final AuditoriaOsModulo auditoriaModulo;

    public CentralOrdemServicoMediator(
            FilaModulo filaModulo,
            HistoricoOsModulo historicoModulo,
            MensageriaOsModulo mensageriaModulo,
            AuditoriaOsModulo auditoriaModulo
    ) {
        if (filaModulo == null) {
            throw new IllegalArgumentException("FilaModulo é obrigatório.");
        }

        if (historicoModulo == null) {
            throw new IllegalArgumentException("HistoricoModulo é obrigatório.");
        }

        if (mensageriaModulo == null) {
            throw new IllegalArgumentException("MensageriaModulo é obrigatório.");
        }

        if (auditoriaModulo == null) {
            throw new IllegalArgumentException("AuditoriaModulo é obrigatório.");
        }

        this.filaModulo = filaModulo;
        this.historicoModulo = historicoModulo;
        this.mensageriaModulo = mensageriaModulo;
        this.auditoriaModulo = auditoriaModulo;
    }

    @Override
    public void atividadeAgendada(String codigoOs, String cliente, LocalDate data) {
        historicoModulo.registrar(codigoOs, "Atividade agendada para " + data);
        filaModulo.moverParaFila(codigoOs, "AGENDADAS");
        mensageriaModulo.enviar(cliente, "Sua OS " + codigoOs + " foi agendada para " + data + ".");
        auditoriaModulo.auditar("OS_AGENDADA", "OS " + codigoOs + " agendada para " + data);
    }

    @Override
    public void atividadeConcluida(String codigoOs, String cliente) {
        historicoModulo.registrar(codigoOs, "Atividade concluída.");
        filaModulo.moverParaFila(codigoOs, "CONCLUIDAS");
        mensageriaModulo.enviar(cliente, "Sua OS " + codigoOs + " foi concluída.");
        auditoriaModulo.auditar("OS_CONCLUIDA", "OS " + codigoOs + " concluída.");
    }
}
```

---

## OrdemServicoMediatorApp

Crie:

```text
src\br\com\curso\aula239\app\OrdemServicoMediatorApp.java
```

Código:

```java
package br.com.curso.aula239.app;

import br.com.curso.aula239.os.core.CentralOrdemServicoMediator;
import br.com.curso.aula239.os.core.OrdemServicoMediator;
import br.com.curso.aula239.os.modulo.AgendaModulo;
import br.com.curso.aula239.os.modulo.AuditoriaOsModulo;
import br.com.curso.aula239.os.modulo.ExecucaoModulo;
import br.com.curso.aula239.os.modulo.FilaModulo;
import br.com.curso.aula239.os.modulo.HistoricoOsModulo;
import br.com.curso.aula239.os.modulo.MensageriaOsModulo;

import java.time.LocalDate;

public class OrdemServicoMediatorApp {
    public static void main(String[] args) {
        OrdemServicoMediator mediator = new CentralOrdemServicoMediator(
                new FilaModulo(),
                new HistoricoOsModulo(),
                new MensageriaOsModulo(),
                new AuditoriaOsModulo()
        );

        AgendaModulo agendaModulo = new AgendaModulo(mediator);
        ExecucaoModulo execucaoModulo = new ExecucaoModulo(mediator);

        agendaModulo.agendar("OS-001", "Ana Silva", LocalDate.now().plusDays(1));

        System.out.println();

        execucaoModulo.concluir("OS-001", "Ana Silva");
    }
}
```

---

## O que melhorou

`AgendaModulo` não conhece:

```text
FilaModulo;
HistoricoOsModulo;
MensageriaOsModulo;
AuditoriaOsModulo.
```

Ele só avisa:

```text
mediator.atividadeAgendada(...)
```

O mediador coordena as reações.

---

# Parte 12 — Mediator e backend real

Mediator pode aparecer em:

```text
coordenação de módulos;
eventos internos síncronos;
telas complexas com componentes;
central de comunicação;
chat;
workflow de componentes;
processos com múltiplas partes interessadas;
orquestração leve entre objetos.
```

Mas em backend real, cuidado para não substituir tudo por Mediator.

Muitas vezes, o que você precisa é:

```text
Use Case;
Domain Service;
Application Service;
Observer;
Facade;
Chain.
```

Mediator é útil quando o problema é comunicação entre objetos participantes.

---

# Parte 13 — Quando Mediator ajuda

Use Mediator quando:

```text
vários objetos precisam conversar;
os objetos estão ficando muito acoplados;
cada objeto conhece muitos outros;
mudar uma comunicação exige alterar várias classes;
a comunicação é muitos-para-muitos;
você quer centralizar regras de interação;
participantes devem depender de uma abstração comum.
```

---

## Quando evitar

Evite Mediator quando:

```text
há apenas um fluxo simples;
um use case resolve melhor;
Observer resolveria melhor;
Facade resolveria melhor;
o mediador ficaria gigante;
o problema não é acoplamento de comunicação;
você está usando o padrão por moda.
```

---

# Parte 14 — Checklist para aplicar Mediator

Pergunte:

```text
1. Existem vários objetos participantes?
2. Eles precisam se comunicar?
3. Hoje eles se conhecem diretamente?
4. Existe acoplamento muitos-para-muitos?
5. Um mediador reduziria dependências?
6. O mediador teria responsabilidade clara?
7. Os participantes dependeriam de interface?
8. O mediador não viraria classe Deus?
9. Observer não resolveria melhor?
10. Use Case não resolveria melhor?
```

---

# Parte 15 — Erros comuns com Mediator

## 1. Mediator virando classe Deus

Se tudo vai para o mediador, ele vira problema.

---

## 2. Usar Mediator como substituto de Use Case

Use Case continua sendo importante.

Mediator não é desculpa para não modelar a aplicação.

---

## 3. Nomes genéricos

Ruim:

```text
SistemaMediator
GeralMediator
OperacaoMediator
```

Melhor:

```text
CentralAtendimentoMediator
CentralOrdemServicoMediator
ChatAtendimentoMediator
```

---

## 4. Mediator conhecendo detalhes demais de infraestrutura

Se o mediador começa a montar SQL, chamar HTTP diretamente e formatar payload externo, revise.

---

## 5. Participantes ainda se chamam diretamente

Se você criou mediador, mas os participantes continuam se chamando diretamente, o padrão perdeu força.

---

# Parte 16 — Como isso conversa com front-end

O front não precisa saber se o backend usa Mediator.

Exemplo:

```text
POST /atendimentos/123/mensagens
```

O backend pode internamente:

```text
Cliente envia mensagem;
Mediator registra histórico;
Mediator notifica analistas;
Mediator audita.
```

Response para o front:

```json
{
  "mensagem": "Mensagem enviada com sucesso."
}
```

A coordenação fica interna.

---

# Parte 17 — Mediator em frameworks

Você verá ideias parecidas em:

```text
event bus interno;
message bus;
mediadores de comandos;
coordenação de componentes;
bibliotecas como MediatR no ecossistema .NET;
ApplicationEventPublisher no Spring em alguns usos;
handlers centralizados;
dispatchers.
```

Mas cuidado:

```text
Event bus muitas vezes é mais Observer.
Command bus muitas vezes é mais Command.
Mediator clássico coordena interação entre participantes.
```

Os nomes se misturam em frameworks.

Por isso é importante entender a intenção.

---

# Parte 18 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula239.app.AtendimentoMediatorApp
java -cp out br.com.curso.aula239.app.OrdemServicoMediatorApp
```

Depois responda:

```text
1. Qual interface representa o mediator no atendimento?
2. Quais classes são participantes?
3. Quem registra histórico?
4. Quem notifica participantes?
5. Os participantes conhecem uns aos outros diretamente?
6. Qual interface representa o mediator de OS?
7. Quais módulos foram coordenados no exemplo de OS?
8. Qual diferença entre Mediator e Facade?
9. Qual diferença entre Mediator e Observer?
10. Quando Mediator seria exagerado?
```

---

# Parte 19 — Exercício prático principal

## Contexto

Crie um Mediator para uma sala de aprovação.

Participantes:

```text
Solicitante;
Aprovador;
ObservadorAuditoria.
```

Mediador:

```text
SalaAprovacaoMediator
```

Fluxo:

```text
solicitante envia solicitação;
mediador notifica aprovadores;
aprovador aprova ou recusa;
mediador notifica solicitante;
mediador registra auditoria.
```

---

## Classes sugeridas

```text
MensagemAprovacao;
AprovacaoMediator;
ParticipanteAprovacao;
Solicitante;
Aprovador;
ObservadorAuditoria;
SalaAprovacaoMediator;
HistoricoAprovacao;
AprovacaoMediatorApp.
```

---

## Critérios

```text
participantes não devem conhecer uns aos outros diretamente;
toda comunicação passa pelo mediador;
mediador registra histórico;
mediador notifica interessados;
nomes devem revelar intenção;
mediador não deve salvar em banco real;
use Java puro.
```

---

# Parte 20 — Desafio extra

## Mediator para importação

Crie um mediador para coordenar módulos de importação:

Participantes/módulos:

```text
LeitorArquivoModulo;
ValidadorArquivoModulo;
ProcessadorRegistrosModulo;
RelatorioImportacaoModulo;
NotificadorImportacaoModulo.
```

Mediador:

```text
ImportacaoMediator
```

Fluxo:

```text
arquivo recebido;
mediador solicita validação;
se válido, mediador solicita processamento;
mediador solicita relatório;
mediador notifica resultado.
```

Critério:

```text
módulos não devem chamar uns aos outros diretamente;
módulos avisam o mediador;
mediador coordena o próximo passo;
não transformar mediador em classe Deus.
```

---

# Parte 21 — Simulado rápido

## Questão 1

Mediator Pattern é usado principalmente para:

```text
A) reduzir acoplamento centralizando comunicação entre objetos.
B) compartilhar objetos repetidos.
C) adaptar API externa.
D) criar objeto com muitos campos.
```

---

## Questão 2

No Mediator, os participantes devem:

```text
A) comunicar-se pelo mediador.
B) conhecer todos os outros participantes diretamente.
C) substituir o banco de dados.
D) sempre herdar de Exception.
```

---

## Questão 3

Mediator se diferencia de Facade porque:

```text
A) Facade simplifica acesso externo; Mediator coordena comunicação interna.
B) Facade sempre usa cache.
C) Mediator sempre adapta contrato externo.
D) Não existe diferença.
```

---

## Questão 4

Mediator se diferencia de Observer porque:

```text
A) Observer notifica interessados sobre eventos; Mediator coordena comunicação entre participantes.
B) Observer sempre usa SQL.
C) Mediator é sempre DTO.
D) Não existe diferença.
```

---

## Questão 5

Um risco do Mediator é:

```text
A) virar classe Deus.
B) não permitir interface.
C) impedir uso de Java.
D) substituir String.
```

---

## Questão 6

Use Mediator quando:

```text
A) existe comunicação muitos-para-muitos difícil de manter.
B) há apenas uma lista simples.
C) há só uma regra isolada.
D) há somente uma classe sem dependência.
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

# Parte 22 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Mediator Pattern.
[ ] Sei identificar comunicação direta excessiva.
[ ] Sei criar interface de mediator.
[ ] Sei criar participantes.
[ ] Sei fazer participantes dependerem do mediator.
[ ] Sei centralizar comunicação.
[ ] Sei aplicar em atendimento.
[ ] Sei aplicar em ordem de serviço.
[ ] Sei diferenciar Mediator de Facade.
[ ] Sei diferenciar Mediator de Observer.
[ ] Sei diferenciar Mediator de Use Case.
[ ] Sei evitar mediador gigante.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Mediator Pattern?
2. Qual problema ele resolve?
3. O que é participante?
4. O que é mediador?
5. Por que objetos não devem se conhecer diretamente nesse padrão?
6. Qual diferença entre Mediator e Facade?
7. Qual diferença entre Mediator e Observer?
8. Qual diferença entre Mediator e Use Case?
9. Qual risco de um mediador mal desenhado?
10. Quando Mediator seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar um mediador;
criar participantes;
centralizar comunicação;
registrar histórico via mediador;
notificar participantes via mediador;
aplicar em atendimento;
aplicar em OS;
resolver exercício de aprovação;
resolver desafio de importação;
explicar riscos do padrão.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-239-mediator-pattern-coordenacao-desacoplamento-objetos
git commit -m "Aula 239: mediator pattern coordenacao desacoplamento objetos"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Mediator Pattern reduz acoplamento centralizando a comunicação entre objetos participantes.
```

Você estudou:

```text
Mediator Pattern;
participantes;
mediador;
central de atendimento;
histórico;
notificador;
módulos de OS;
coordenação de comunicação;
diferença para Facade;
diferença para Observer;
diferença para Use Case;
risco de classe Deus.
```

Na próxima aula, vamos estudar:

```text
Memento Pattern.
```

A ideia será salvar e restaurar estados anteriores de objetos, útil para histórico, snapshots, desfazer alterações, auditoria de mudanças e fluxos de edição.
