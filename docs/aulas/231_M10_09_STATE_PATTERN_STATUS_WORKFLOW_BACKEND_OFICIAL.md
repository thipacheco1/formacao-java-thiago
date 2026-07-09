# 231 — M10.09 — State Pattern: status e workflow no backend

## Objetivo da aula

Na aula anterior, você estudou:

```text
Chain of Responsibility
```

Você viu que Chain ajuda quando uma solicitação precisa passar por uma sequência de handlers, como:

```text
validações;
aprovações;
alçadas;
middlewares;
filtros;
pipelines;
regras encadeadas.
```

Agora vamos estudar outro padrão comportamental muito importante para backend corporativo:

```text
State Pattern
```

Em português:

```text
Padrão Estado
```

Esse padrão aparece quando o comportamento de um objeto muda conforme seu status.

Exemplos comuns:

```text
pedido;
ordem de serviço;
pagamento;
proposta;
cotação;
contrato;
chamado;
workflow de aprovação;
fila de atendimento;
jornada digital;
importação;
transação financeira;
atividade técnica.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que State resolve;
identificar if/switch por status;
modelar comportamento por estado;
criar interface de estado;
criar classes de estado concreto;
controlar transições;
evitar transições inválidas;
aplicar em pedido;
aplicar em ordem de serviço;
comparar State com Strategy;
comparar State com Chain;
comparar State com enum simples;
entender quando State ajuda e quando é exagero;
preparar base para workflows reais no backend.
```

---

## Ideia principal

State permite que um objeto altere seu comportamento quando seu estado interno muda.

Em vez de ter um método cheio de `if` por status, você delega o comportamento para uma classe de estado.

Exemplo ruim:

```java
public void pagar() {
    if (status == CRIADO) {
        status = PAGO;
        return;
    }

    if (status == PAGO) {
        throw new IllegalStateException("Pedido já pago.");
    }

    if (status == CANCELADO) {
        throw new IllegalStateException("Pedido cancelado não pode ser pago.");
    }
}
```

Exemplo com State:

```text
PedidoCriadoState:
permite pagar.

PedidoPagoState:
permite faturar.

PedidoFaturadoState:
permite concluir entrega.

PedidoCanceladoState:
bloqueia operações.
```

O pedido delega:

```java
estado.pagar(this);
```

---

## State em uma frase prática

```text
Use State quando o comportamento muda conforme o status do objeto.
```

Ou:

```text
Use State para evitar ifs gigantes baseados em status.
```

---

## Problema sem State

Imagine um pedido com status:

```text
CRIADO;
PAGO;
FATURADO;
ENVIADO;
ENTREGUE;
CANCELADO.
```

Operações:

```text
pagar;
faturar;
enviar;
entregar;
cancelar.
```

Cada operação pode ou não ser permitida conforme o status.

Sem organização, você cria vários blocos:

```text
if status CRIADO...
if status PAGO...
if status FATURADO...
if status CANCELADO...
```

Isso cresce rápido.

Com o tempo, fica difícil responder:

```text
o que pode acontecer quando o pedido está CRIADO?
o que pode acontecer quando está PAGO?
quais transições são permitidas?
onde está a regra de cancelamento?
qual status permite faturar?
```

State ajuda a organizar isso por estado.

---

## Relação com SOLID

## SRP

Cada classe de estado cuida das regras daquele estado.

Exemplo:

```text
PedidoCriadoState:
regras do pedido criado.

PedidoPagoState:
regras do pedido pago.

PedidoCanceladoState:
regras do pedido cancelado.
```

---

## OCP

Para adicionar um novo estado, você cria nova classe de estado.

Você reduz alteração em métodos centrais cheios de if.

---

## LSP

Todos os estados devem cumprir o contrato da interface.

Se o contrato tem:

```text
pagar;
faturar;
enviar;
entregar;
cancelar.
```

cada estado deve responder de forma válida:

```text
executando a transição permitida;
ou lançando erro claro quando não permitido.
```

---

## ISP

Cuidado com interfaces grandes demais.

Se seu workflow tem muitas operações diferentes, talvez seja melhor separar contratos ou rever o desenho.

Nesta aula, vamos manter um contrato simples para aprendizado.

---

## DIP

O objeto de domínio pode depender da abstração de estado.

Em fluxos mais avançados, services/use cases podem depender de políticas de transição ou motores de workflow.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com State:

```text
A entidade decide delegando ao estado atual.
O estado atual conhece as transições permitidas.
O use case coordena a operação.
O repository salva o novo estado.
O controller futuro apenas recebe request e chama o use case.
```

---

# Parte 1 — State vs Strategy

State e Strategy são parecidos porque ambos usam composição e polimorfismo.

Mas o motivo é diferente.

## Strategy

Strategy escolhe uma regra intercambiável.

Exemplo:

```text
calcular desconto;
calcular frete;
calcular prioridade.
```

A estratégia geralmente é escolhida de fora.

---

## State

State representa o estado interno atual de um objeto.

Exemplo:

```text
Pedido está CRIADO.
Pedido está PAGO.
Pedido está CANCELADO.
```

O comportamento muda porque o estado interno mudou.

---

## Diferença prática

```text
Strategy:
qual regra usar?

State:
o que esse objeto pode fazer agora, considerando seu estado atual?
```

---

# Parte 2 — State vs Chain

## Chain

Executa uma sequência de handlers.

Exemplo:

```text
validar cliente;
validar produto;
validar pagamento.
```

---

## State

Define comportamento por status.

Exemplo:

```text
se pedido está PAGO, pode faturar;
se pedido está CANCELADO, não pode pagar.
```

---

## Diferença prática

```text
Chain:
pipeline de regras.

State:
comportamento por estado.
```

---

# Parte 3 — Quando enum simples basta

Nem todo status precisa de State.

Enum simples pode bastar quando:

```text
status só é exibido;
não há comportamento diferente;
não há muitas transições;
a regra é pequena;
não há workflow complexo.
```

Exemplo:

```java
enum StatusProduto {
    ATIVO,
    INATIVO
}
```

Se você só filtra produto ativo/inativo, State pode ser exagero.

Use State quando status carrega comportamento relevante.

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-231-state-pattern-status-workflow-backend
cd labs\m10\aula-231-state-pattern-status-workflow-backend
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula231

mkdir src\br\com\curso\aula231\app

mkdir src\br\com\curso\aula231\ruim

mkdir src\br\com\curso\aula231\dominio
mkdir src\br\com\curso\aula231\dominio\pedido
mkdir src\br\com\curso\aula231\dominio\os

mkdir src\br\com\curso\aula231\state
mkdir src\br\com\curso\aula231\state\pedido
mkdir src\br\com\curso\aula231\state\os

mkdir src\br\com\curso\aula231\aplicacao
mkdir src\br\com\curso\aula231\aplicacao\service
```

---

# Parte 5 — Exemplo ruim com if por status

## StatusPedidoRuim

Crie:

```text
src\br\com\curso\aula231\ruim\StatusPedidoRuim.java
```

Código:

```java
package br.com.curso.aula231.ruim;

public enum StatusPedidoRuim {
    CRIADO,
    PAGO,
    FATURADO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}
```

---

## PedidoRuim

Crie:

```text
src\br\com\curso\aula231\ruim\PedidoRuim.java
```

Código:

```java
package br.com.curso.aula231.ruim;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoRuim {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private StatusPedidoRuim status;

    public PedidoRuim(UUID id, String codigo, String cliente, BigDecimal valor, Instant criadoEm) {
        this.id = id;
        this.codigo = codigo;
        this.cliente = cliente;
        this.valor = valor;
        this.criadoEm = criadoEm;
        this.status = StatusPedidoRuim.CRIADO;
    }

    public void pagar() {
        if (status == StatusPedidoRuim.CRIADO) {
            status = StatusPedidoRuim.PAGO;
            return;
        }

        if (status == StatusPedidoRuim.PAGO) {
            throw new IllegalStateException("Pedido já está pago.");
        }

        if (status == StatusPedidoRuim.CANCELADO) {
            throw new IllegalStateException("Pedido cancelado não pode ser pago.");
        }

        throw new IllegalStateException("Pedido não pode ser pago no status: " + status);
    }

    public void faturar() {
        if (status == StatusPedidoRuim.PAGO) {
            status = StatusPedidoRuim.FATURADO;
            return;
        }

        if (status == StatusPedidoRuim.CRIADO) {
            throw new IllegalStateException("Pedido criado precisa ser pago antes de faturar.");
        }

        if (status == StatusPedidoRuim.CANCELADO) {
            throw new IllegalStateException("Pedido cancelado não pode ser faturado.");
        }

        throw new IllegalStateException("Pedido não pode ser faturado no status: " + status);
    }

    public void enviar() {
        if (status == StatusPedidoRuim.FATURADO) {
            status = StatusPedidoRuim.ENVIADO;
            return;
        }

        throw new IllegalStateException("Pedido não pode ser enviado no status: " + status);
    }

    public void entregar() {
        if (status == StatusPedidoRuim.ENVIADO) {
            status = StatusPedidoRuim.ENTREGUE;
            return;
        }

        throw new IllegalStateException("Pedido não pode ser entregue no status: " + status);
    }

    public void cancelar() {
        if (status == StatusPedidoRuim.CRIADO || status == StatusPedidoRuim.PAGO) {
            status = StatusPedidoRuim.CANCELADO;
            return;
        }

        if (status == StatusPedidoRuim.ENTREGUE) {
            throw new IllegalStateException("Pedido entregue não pode ser cancelado.");
        }

        throw new IllegalStateException("Pedido não pode ser cancelado no status: " + status);
    }

    public String codigo() {
        return codigo;
    }

    public StatusPedidoRuim status() {
        return status;
    }

    public String resumo() {
        return codigo + " | Cliente: " + cliente + " | Valor: " + valor + " | Status: " + status;
    }
}
```

---

## PedidoRuimApp

Crie:

```text
src\br\com\curso\aula231\app\PedidoRuimApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.ruim.PedidoRuim;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoRuimApp {
    public static void main(String[] args) {
        PedidoRuim pedido = new PedidoRuim(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                new BigDecimal("1500.00"),
                Instant.now()
        );

        pedido.pagar();
        pedido.faturar();
        pedido.enviar();
        pedido.entregar();

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula231.app.PedidoRuimApp
```

---

## Diagnóstico

A classe funciona.

Mas os métodos têm muitos ifs por status.

Se adicionar novo status:

```text
EM_SEPARACAO;
AGUARDANDO_NOTA;
EM_TRANSPORTE;
DEVOLVIDO;
EM_ANALISE_CANCELAMENTO.
```

você terá que revisar vários métodos.

Esse é o tipo de problema que State ajuda a organizar.

---

# Parte 6 — Criando State para Pedido

## EstadoPedido

Crie:

```text
src\br\com\curso\aula231\state\pedido\EstadoPedido.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

import br.com.curso.aula231.dominio.pedido.Pedido;

public interface EstadoPedido {
    String nome();

    void pagar(Pedido pedido);

    void faturar(Pedido pedido);

    void enviar(Pedido pedido);

    void entregar(Pedido pedido);

    void cancelar(Pedido pedido);
}
```

---

## EstadoPedidoBase

Crie:

```text
src\br\com\curso\aula231\state\pedido\EstadoPedidoBase.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

import br.com.curso.aula231.dominio.pedido.Pedido;

public abstract class EstadoPedidoBase implements EstadoPedido {
    @Override
    public void pagar(Pedido pedido) {
        operacaoNaoPermitida("pagar");
    }

    @Override
    public void faturar(Pedido pedido) {
        operacaoNaoPermitida("faturar");
    }

    @Override
    public void enviar(Pedido pedido) {
        operacaoNaoPermitida("enviar");
    }

    @Override
    public void entregar(Pedido pedido) {
        operacaoNaoPermitida("entregar");
    }

    @Override
    public void cancelar(Pedido pedido) {
        operacaoNaoPermitida("cancelar");
    }

    protected void operacaoNaoPermitida(String operacao) {
        throw new IllegalStateException("Operação " + operacao + " não permitida para status " + nome() + ".");
    }
}
```

---

## PedidoCriadoState

Crie:

```text
src\br\com\curso\aula231\state\pedido\PedidoCriadoState.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

import br.com.curso.aula231.dominio.pedido.Pedido;

public class PedidoCriadoState extends EstadoPedidoBase {
    @Override
    public String nome() {
        return "CRIADO";
    }

    @Override
    public void pagar(Pedido pedido) {
        pedido.alterarEstado(new PedidoPagoState());
    }

    @Override
    public void cancelar(Pedido pedido) {
        pedido.alterarEstado(new PedidoCanceladoState());
    }
}
```

---

## PedidoPagoState

Crie:

```text
src\br\com\curso\aula231\state\pedido\PedidoPagoState.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

import br.com.curso.aula231.dominio.pedido.Pedido;

public class PedidoPagoState extends EstadoPedidoBase {
    @Override
    public String nome() {
        return "PAGO";
    }

    @Override
    public void faturar(Pedido pedido) {
        pedido.alterarEstado(new PedidoFaturadoState());
    }

    @Override
    public void cancelar(Pedido pedido) {
        pedido.alterarEstado(new PedidoCanceladoState());
    }
}
```

---

## PedidoFaturadoState

Crie:

```text
src\br\com\curso\aula231\state\pedido\PedidoFaturadoState.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

import br.com.curso.aula231.dominio.pedido.Pedido;

public class PedidoFaturadoState extends EstadoPedidoBase {
    @Override
    public String nome() {
        return "FATURADO";
    }

    @Override
    public void enviar(Pedido pedido) {
        pedido.alterarEstado(new PedidoEnviadoState());
    }
}
```

---

## PedidoEnviadoState

Crie:

```text
src\br\com\curso\aula231\state\pedido\PedidoEnviadoState.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

import br.com.curso.aula231.dominio.pedido.Pedido;

public class PedidoEnviadoState extends EstadoPedidoBase {
    @Override
    public String nome() {
        return "ENVIADO";
    }

    @Override
    public void entregar(Pedido pedido) {
        pedido.alterarEstado(new PedidoEntregueState());
    }
}
```

---

## PedidoEntregueState

Crie:

```text
src\br\com\curso\aula231\state\pedido\PedidoEntregueState.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

public class PedidoEntregueState extends EstadoPedidoBase {
    @Override
    public String nome() {
        return "ENTREGUE";
    }
}
```

---

## PedidoCanceladoState

Crie:

```text
src\br\com\curso\aula231\state\pedido\PedidoCanceladoState.java
```

Código:

```java
package br.com.curso.aula231.state.pedido;

public class PedidoCanceladoState extends EstadoPedidoBase {
    @Override
    public String nome() {
        return "CANCELADO";
    }
}
```

---

# Parte 7 — Entidade Pedido usando State

## Pedido

Crie:

```text
src\br\com\curso\aula231\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula231.dominio.pedido;

import br.com.curso.aula231.state.pedido.EstadoPedido;
import br.com.curso.aula231.state.pedido.PedidoCriadoState;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private EstadoPedido estado;

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
        this.estado = new PedidoCriadoState();
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

    public String status() {
        return estado.nome();
    }

    public void pagar() {
        estado.pagar(this);
    }

    public void faturar() {
        estado.faturar(this);
    }

    public void enviar() {
        estado.enviar(this);
    }

    public void entregar() {
        estado.entregar(this);
    }

    public void cancelar() {
        estado.cancelar(this);
    }

    public void alterarEstado(EstadoPedido novoEstado) {
        if (novoEstado == null) {
            throw new IllegalArgumentException("Novo estado é obrigatório.");
        }

        this.estado = novoEstado;
    }

    public String resumo() {
        return codigo + " | Cliente: " + cliente + " | Valor: " + valor + " | Status: " + status();
    }
}
```

---

## PedidoStateApp

Crie:

```text
src\br\com\curso\aula231\app\PedidoStateApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoStateApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                new BigDecimal("1500.00"),
                Instant.now()
        );

        System.out.println(pedido.resumo());

        pedido.pagar();
        System.out.println(pedido.resumo());

        pedido.faturar();
        System.out.println(pedido.resumo());

        pedido.enviar();
        System.out.println(pedido.resumo());

        pedido.entregar();
        System.out.println(pedido.resumo());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula231.app.PedidoStateApp
```

---

# Parte 8 — Fluxo inválido

## PedidoStateFluxoInvalidoApp

Crie:

```text
src\br\com\curso\aula231\app\PedidoStateFluxoInvalidoApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoStateFluxoInvalidoApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-002",
                "Carlos Souza",
                new BigDecimal("900.00"),
                Instant.now()
        );

        try {
            pedido.faturar();
        } catch (RuntimeException erro) {
            System.out.println("Erro esperado: " + erro.getMessage());
        }

        System.out.println(pedido.resumo());
    }
}
```

---

## O que aconteceu

O pedido começou em:

```text
CRIADO
```

Tentamos:

```text
faturar
```

Mas `PedidoCriadoState` não permite faturar.

O erro veio da regra do estado atual.

---

# Parte 9 — Cancelamento por estado

## PedidoStateCancelamentoApp

Crie:

```text
src\br\com\curso\aula231\app\PedidoStateCancelamentoApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoStateCancelamentoApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-003",
                "Maria Oliveira",
                new BigDecimal("700.00"),
                Instant.now()
        );

        pedido.cancelar();

        System.out.println(pedido.resumo());

        try {
            pedido.pagar();
        } catch (RuntimeException erro) {
            System.out.println("Erro esperado: " + erro.getMessage());
        }
    }
}
```

---

## Análise

A regra de cancelamento está espalhada?

Não.

Ela está nos estados que permitem cancelar:

```text
PedidoCriadoState;
PedidoPagoState.
```

E ausente nos estados que não permitem.

A classe base gera erro padrão.

---

# Parte 10 — State em Ordem de Serviço

Agora vamos criar um exemplo mais próximo de backend corporativo.

Status da OS:

```text
ABERTA;
AGENDADA;
EM_ATENDIMENTO;
CONCLUIDA;
FRUSTRADA;
CANCELADA.
```

Operações:

```text
agendar;
iniciarAtendimento;
concluir;
frustrar;
cancelar.
```

---

## EstadoOrdemServico

Crie:

```text
src\br\com\curso\aula231\state\os\EstadoOrdemServico.java
```

Código:

```java
package br.com.curso.aula231.state.os;

import br.com.curso.aula231.dominio.os.OrdemServico;

public interface EstadoOrdemServico {
    String nome();

    void agendar(OrdemServico os);

    void iniciarAtendimento(OrdemServico os);

    void concluir(OrdemServico os);

    void frustrar(OrdemServico os);

    void cancelar(OrdemServico os);
}
```

---

## EstadoOrdemServicoBase

Crie:

```text
src\br\com\curso\aula231\state\os\EstadoOrdemServicoBase.java
```

Código:

```java
package br.com.curso.aula231.state.os;

import br.com.curso.aula231.dominio.os.OrdemServico;

public abstract class EstadoOrdemServicoBase implements EstadoOrdemServico {
    @Override
    public void agendar(OrdemServico os) {
        operacaoNaoPermitida("agendar");
    }

    @Override
    public void iniciarAtendimento(OrdemServico os) {
        operacaoNaoPermitida("iniciar atendimento");
    }

    @Override
    public void concluir(OrdemServico os) {
        operacaoNaoPermitida("concluir");
    }

    @Override
    public void frustrar(OrdemServico os) {
        operacaoNaoPermitida("frustrar");
    }

    @Override
    public void cancelar(OrdemServico os) {
        operacaoNaoPermitida("cancelar");
    }

    protected void operacaoNaoPermitida(String operacao) {
        throw new IllegalStateException("Operação " + operacao + " não permitida para status " + nome() + ".");
    }
}
```

---

## OsAbertaState

Crie:

```text
src\br\com\curso\aula231\state\os\OsAbertaState.java
```

Código:

```java
package br.com.curso.aula231.state.os;

import br.com.curso.aula231.dominio.os.OrdemServico;

public class OsAbertaState extends EstadoOrdemServicoBase {
    @Override
    public String nome() {
        return "ABERTA";
    }

    @Override
    public void agendar(OrdemServico os) {
        os.alterarEstado(new OsAgendadaState());
    }

    @Override
    public void cancelar(OrdemServico os) {
        os.alterarEstado(new OsCanceladaState());
    }
}
```

---

## OsAgendadaState

Crie:

```text
src\br\com\curso\aula231\state\os\OsAgendadaState.java
```

Código:

```java
package br.com.curso.aula231.state.os;

import br.com.curso.aula231.dominio.os.OrdemServico;

public class OsAgendadaState extends EstadoOrdemServicoBase {
    @Override
    public String nome() {
        return "AGENDADA";
    }

    @Override
    public void iniciarAtendimento(OrdemServico os) {
        os.alterarEstado(new OsEmAtendimentoState());
    }

    @Override
    public void cancelar(OrdemServico os) {
        os.alterarEstado(new OsCanceladaState());
    }
}
```

---

## OsEmAtendimentoState

Crie:

```text
src\br\com\curso\aula231\state\os\OsEmAtendimentoState.java
```

Código:

```java
package br.com.curso.aula231.state.os;

import br.com.curso.aula231.dominio.os.OrdemServico;

public class OsEmAtendimentoState extends EstadoOrdemServicoBase {
    @Override
    public String nome() {
        return "EM_ATENDIMENTO";
    }

    @Override
    public void concluir(OrdemServico os) {
        os.alterarEstado(new OsConcluidaState());
    }

    @Override
    public void frustrar(OrdemServico os) {
        os.alterarEstado(new OsFrustradaState());
    }
}
```

---

## OsConcluidaState

Crie:

```text
src\br\com\curso\aula231\state\os\OsConcluidaState.java
```

Código:

```java
package br.com.curso.aula231.state.os;

public class OsConcluidaState extends EstadoOrdemServicoBase {
    @Override
    public String nome() {
        return "CONCLUIDA";
    }
}
```

---

## OsFrustradaState

Crie:

```text
src\br\com\curso\aula231\state\os\OsFrustradaState.java
```

Código:

```java
package br.com.curso.aula231.state.os;

public class OsFrustradaState extends EstadoOrdemServicoBase {
    @Override
    public String nome() {
        return "FRUSTRADA";
    }
}
```

---

## OsCanceladaState

Crie:

```text
src\br\com\curso\aula231\state\os\OsCanceladaState.java
```

Código:

```java
package br.com.curso.aula231.state.os;

public class OsCanceladaState extends EstadoOrdemServicoBase {
    @Override
    public String nome() {
        return "CANCELADA";
    }
}
```

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula231\dominio\os\OrdemServico.java
```

Código:

```java
package br.com.curso.aula231.dominio.os;

import br.com.curso.aula231.state.os.EstadoOrdemServico;
import br.com.curso.aula231.state.os.OsAbertaState;

import java.time.Instant;
import java.util.UUID;

public class OrdemServico {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String descricao;
    private final Instant criadaEm;
    private EstadoOrdemServico estado;

    public OrdemServico(UUID id, String codigo, String cliente, String descricao, Instant criadaEm) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
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
        this.descricao = descricao.trim();
        this.criadaEm = criadaEm;
        this.estado = new OsAbertaState();
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

    public String descricao() {
        return descricao;
    }

    public Instant criadaEm() {
        return criadaEm;
    }

    public String status() {
        return estado.nome();
    }

    public void agendar() {
        estado.agendar(this);
    }

    public void iniciarAtendimento() {
        estado.iniciarAtendimento(this);
    }

    public void concluir() {
        estado.concluir(this);
    }

    public void frustrar() {
        estado.frustrar(this);
    }

    public void cancelar() {
        estado.cancelar(this);
    }

    public void alterarEstado(EstadoOrdemServico novoEstado) {
        if (novoEstado == null) {
            throw new IllegalArgumentException("Novo estado é obrigatório.");
        }

        this.estado = novoEstado;
    }

    public String resumo() {
        return codigo + " | Cliente: " + cliente + " | Status: " + status();
    }
}
```

---

## OrdemServicoStateApp

Crie:

```text
src\br\com\curso\aula231\app\OrdemServicoStateApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.dominio.os.OrdemServico;

import java.time.Instant;
import java.util.UUID;

public class OrdemServicoStateApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                UUID.randomUUID(),
                "OS-001",
                "Ana Silva",
                "Produto com avaria",
                Instant.now()
        );

        System.out.println(os.resumo());

        os.agendar();
        System.out.println(os.resumo());

        os.iniciarAtendimento();
        System.out.println(os.resumo());

        os.concluir();
        System.out.println(os.resumo());
    }
}
```

---

## OrdemServicoFrustradaStateApp

Crie:

```text
src\br\com\curso\aula231\app\OrdemServicoFrustradaStateApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.dominio.os.OrdemServico;

import java.time.Instant;
import java.util.UUID;

public class OrdemServicoFrustradaStateApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                UUID.randomUUID(),
                "OS-002",
                "Carlos Souza",
                "Cliente ausente",
                Instant.now()
        );

        os.agendar();
        os.iniciarAtendimento();
        os.frustrar();

        System.out.println(os.resumo());

        try {
            os.concluir();
        } catch (RuntimeException erro) {
            System.out.println("Erro esperado: " + erro.getMessage());
        }
    }
}
```

---

# Parte 11 — State no service

Em backend real, o use case ou service coordena a operação e depois salva.

A entidade decide a transição.

---

## PedidoWorkflowService

Crie:

```text
src\br\com\curso\aula231\aplicacao\service\PedidoWorkflowService.java
```

Código:

```java
package br.com.curso.aula231.aplicacao.service;

import br.com.curso.aula231.dominio.pedido.Pedido;

public class PedidoWorkflowService {
    public void pagar(Pedido pedido) {
        exigirPedido(pedido);
        pedido.pagar();
        System.out.println("[SERVICE] Pedido pago: " + pedido.codigo());
    }

    public void faturar(Pedido pedido) {
        exigirPedido(pedido);
        pedido.faturar();
        System.out.println("[SERVICE] Pedido faturado: " + pedido.codigo());
    }

    public void enviar(Pedido pedido) {
        exigirPedido(pedido);
        pedido.enviar();
        System.out.println("[SERVICE] Pedido enviado: " + pedido.codigo());
    }

    public void entregar(Pedido pedido) {
        exigirPedido(pedido);
        pedido.entregar();
        System.out.println("[SERVICE] Pedido entregue: " + pedido.codigo());
    }

    public void cancelar(Pedido pedido) {
        exigirPedido(pedido);
        pedido.cancelar();
        System.out.println("[SERVICE] Pedido cancelado: " + pedido.codigo());
    }

    private void exigirPedido(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }
    }
}
```

---

## PedidoWorkflowServiceApp

Crie:

```text
src\br\com\curso\aula231\app\PedidoWorkflowServiceApp.java
```

Código:

```java
package br.com.curso.aula231.app;

import br.com.curso.aula231.aplicacao.service.PedidoWorkflowService;
import br.com.curso.aula231.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoWorkflowServiceApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-100",
                "Bruna Lima",
                new BigDecimal("2200.00"),
                Instant.now()
        );

        PedidoWorkflowService service = new PedidoWorkflowService();

        service.pagar(pedido);
        service.faturar(pedido);
        service.enviar(pedido);
        service.entregar(pedido);

        System.out.println(pedido.resumo());
    }
}
```

---

## Onde o repository entraria

Em um backend real:

```text
use case busca pedido no repository;
chama pedido.pagar();
repository salva pedido;
auditoria registra;
controller retorna response.
```

Exemplo conceitual:

```java
public void pagar(String codigoPedido) {
    Pedido pedido = repository.buscarPorCodigo(codigoPedido)
            .orElseThrow();

    pedido.pagar();

    repository.salvar(pedido);
    auditoria.registrar("PEDIDO_PAGO", codigoPedido);
}
```

A entidade decide se pode pagar.

O use case coordena.

O repository salva.

---

# Parte 12 — Como persistir State

Na prática, banco geralmente salva status como texto:

```text
CRIADO;
PAGO;
FATURADO;
ENVIADO;
ENTREGUE;
CANCELADO.
```

Quando carrega do banco, você precisa reconstruir o estado correspondente.

Exemplo conceitual:

```java
EstadoPedido estado = EstadoPedidoFactory.fromStatus(statusBanco);
Pedido pedido = new Pedido(..., estado);
```

Nesta aula, mantivemos criação inicial simples.

Mas em sistemas reais, você vai precisar de uma factory de estado.

---

## EstadoPedidoFactory conceitual

Exemplo:

```java
public final class EstadoPedidoFactory {
    public static EstadoPedido porNome(String status) {
        return switch (status) {
            case "CRIADO" -> new PedidoCriadoState();
            case "PAGO" -> new PedidoPagoState();
            case "FATURADO" -> new PedidoFaturadoState();
            case "ENVIADO" -> new PedidoEnviadoState();
            case "ENTREGUE" -> new PedidoEntregueState();
            case "CANCELADO" -> new PedidoCanceladoState();
            default -> throw new IllegalArgumentException("Status inválido: " + status);
        };
    }
}
```

Esse ponto é importante quando avançarmos para banco de dados.

---

# Parte 13 — Como isso conversa com o front

O front geralmente envia uma ação:

```json
{
  "acao": "PAGAR"
}
```

Ou chama endpoint específico:

```text
POST /pedidos/PED-001/pagar
POST /pedidos/PED-001/faturar
POST /pedidos/PED-001/enviar
POST /pedidos/PED-001/entregar
POST /pedidos/PED-001/cancelar
```

O backend:

```text
busca pedido;
executa ação;
entidade/state valida transição;
salva novo status;
retorna response.
```

Se a ação for inválida, o backend retorna erro claro:

```json
{
  "codigo": "TRANSICAO_INVALIDA",
  "mensagem": "Operação faturar não permitida para status CRIADO."
}
```

Isso deixa o front previsível.

---

# Parte 14 — Erros comuns com State

## 1. Usar State sem workflow real

Se só tem dois status simples e nenhuma regra diferente, enum basta.

---

## 2. Estado com regra demais fora do domínio

Se o estado começa a salvar banco, enviar e-mail e chamar API, ele está fazendo demais.

---

## 3. Esquecer persistência

No banco você salva status simples.

Precisa pensar como reconstruir a classe de estado.

---

## 4. Interface de estado gigante

Se existem muitas operações, talvez seu agregado esteja grande demais ou precise separar workflows.

---

## 5. Estado alterando campos sem regra clara

Transição precisa ser explícita.

---

## 6. Misturar State com if gigante

Se você cria states mas continua com if por status no service, talvez o padrão não esteja sendo aproveitado.

---

# Parte 15 — Quando usar State

Use State quando:

```text
o objeto tem vários status;
as operações permitidas mudam por status;
há muitas transições;
ifs por status estão crescendo;
você quer centralizar comportamento por estado;
workflow precisa ser claro;
erros de transição precisam ser bem definidos.
```

---

## Quando evitar

Evite State quando:

```text
status é apenas informativo;
há poucos status sem comportamento;
regra é simples;
classes de estado ficariam artificiais;
o custo de complexidade não compensa.
```

---

# Parte 16 — Checklist para aplicar State

Pergunte:

```text
1. O comportamento muda conforme status?
2. Existem várias operações por status?
3. Há transições inválidas?
4. Os ifs por status estão crescendo?
5. Cada estado tem responsabilidade clara?
6. O estado não está fazendo infraestrutura?
7. Existe forma de persistir/reconstruir status?
8. Enum simples não seria suficiente?
9. O use case continua coordenando?
10. O repository continua salvando?
```

---

# Parte 17 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula231.app.PedidoRuimApp
java -cp out br.com.curso.aula231.app.PedidoStateApp
java -cp out br.com.curso.aula231.app.PedidoStateFluxoInvalidoApp
java -cp out br.com.curso.aula231.app.PedidoStateCancelamentoApp
java -cp out br.com.curso.aula231.app.OrdemServicoStateApp
java -cp out br.com.curso.aula231.app.OrdemServicoFrustradaStateApp
java -cp out br.com.curso.aula231.app.PedidoWorkflowServiceApp
```

Depois responda:

```text
1. Qual era o problema do PedidoRuim?
2. Qual interface representa o estado do pedido?
3. Quais estados concretos foram criados?
4. Quem decide se pode pagar?
5. Quem decide se pode faturar?
6. O que acontece em transição inválida?
7. Como State apareceu em OrdemServico?
8. Qual diferença entre State e Strategy?
9. Qual diferença entre State e Chain?
10. Quando enum simples bastaria?
```

---

# Parte 18 — Exercício prático principal

## Contexto

Crie State Pattern para um chamado de atendimento.

Status:

```text
ABERTO;
EM_ANALISE;
AGUARDANDO_CLIENTE;
RESOLVIDO;
FECHADO;
CANCELADO.
```

Operações:

```text
iniciarAnalise;
solicitarCliente;
resolver;
fechar;
cancelar.
```

---

## Regras

```text
ABERTO:
pode iniciarAnalise;
pode cancelar.

EM_ANALISE:
pode solicitarCliente;
pode resolver;
pode cancelar.

AGUARDANDO_CLIENTE:
pode iniciarAnalise;
pode cancelar.

RESOLVIDO:
pode fechar.

FECHADO:
não permite novas operações.

CANCELADO:
não permite novas operações.
```

---

## Criar

```text
Chamado;
EstadoChamado;
EstadoChamadoBase;
ChamadoAbertoState;
ChamadoEmAnaliseState;
ChamadoAguardandoClienteState;
ChamadoResolvidoState;
ChamadoFechadoState;
ChamadoCanceladoState;
ChamadoStateApp;
ChamadoFluxoInvalidoApp.
```

---

## Critérios

```text
sem if gigante por status;
cada estado controla suas transições;
entidade delega para estado atual;
erro claro para operação inválida;
service opcional coordena chamadas.
```

---

# Parte 19 — Desafio extra

## Workflow de importação

Modele State para importação de arquivo.

Status:

```text
CRIADA;
VALIDADA;
PROCESSANDO;
PROCESSADA;
PROCESSADA_COM_ERRO;
CANCELADA.
```

Operações:

```text
validar;
iniciarProcessamento;
finalizarComSucesso;
finalizarComErro;
cancelar.
```

Regras:

```text
CRIADA -> validar ou cancelar.
VALIDADA -> iniciarProcessamento ou cancelar.
PROCESSANDO -> finalizarComSucesso ou finalizarComErro.
PROCESSADA -> sem novas operações.
PROCESSADA_COM_ERRO -> sem novas operações.
CANCELADA -> sem novas operações.
```

Critério:

```text
não usar if central;
cada estado controla transições;
mostrar app com fluxo feliz e fluxo com erro.
```

---

# Parte 20 — Simulado rápido

## Questão 1

State Pattern é útil quando:

```text
A) o comportamento muda conforme o status interno do objeto.
B) uma API externa tem contrato diferente.
C) um objeto tem muitos campos opcionais.
D) uma solicitação passa por vários validadores.
```

---

## Questão 2

No State Pattern, cada estado concreto deve:

```text
A) controlar o comportamento permitido naquele status.
B) salvar no banco obrigatoriamente.
C) enviar e-mail sempre.
D) substituir todos os services.
```

---

## Questão 3

State se diferencia de Strategy porque:

```text
A) State representa comportamento conforme estado interno; Strategy representa comportamento intercambiável.
B) State é apenas Factory.
C) Strategy é apenas status.
D) Não existe diferença.
```

---

## Questão 4

Se o status é apenas informativo e sem comportamento, normalmente basta:

```text
A) enum simples.
B) State obrigatório.
C) Chain obrigatória.
D) Adapter obrigatório.
```

---

## Questão 5

O use case em backend real deve:

```text
A) buscar entidade, chamar operação, salvar resultado.
B) colocar todos os ifs de status nele.
C) ignorar entidade.
D) retornar classe de estado para o front.
```

---

## Questão 6

Ao persistir State, normalmente o banco armazena:

```text
A) o nome/status simples, como CRIADO ou PAGO.
B) o objeto Java inteiro.
C) o arquivo .class.
D) o pacote da aplicação.
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

# Parte 21 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar State Pattern.
[ ] Sei identificar if/switch por status.
[ ] Sei criar interface de estado.
[ ] Sei criar estado base.
[ ] Sei criar estados concretos.
[ ] Sei delegar operação para estado atual.
[ ] Sei controlar transições válidas.
[ ] Sei lançar erro para transição inválida.
[ ] Sei aplicar State em Pedido.
[ ] Sei aplicar State em OrdemServico.
[ ] Sei diferenciar State de Strategy.
[ ] Sei diferenciar State de Chain.
[ ] Sei saber quando enum simples basta.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é State Pattern?
2. Qual problema ele resolve?
3. Por que if por status pode virar problema?
4. Quem controla as transições no State?
5. Qual diferença entre State e Strategy?
6. Qual diferença entre State e Chain?
7. Quando enum simples basta?
8. Como persistir status no banco?
9. Como isso ajuda o front?
10. Como o use case deve usar a entidade com State?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
refatorar workflow por status usando State;
criar estados de pedido;
criar estados de ordem de serviço;
tratar transição inválida;
explicar persistência de status;
explicar integração com use case;
resolver exercício de chamado;
resolver desafio de importação.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-231-state-pattern-status-workflow-backend
git commit -m "Aula 231: state pattern status workflow backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
State Pattern organiza comportamento por status, evitando ifs gigantes e tornando workflows mais claros.
```

Você estudou:

```text
State Pattern;
workflow por status;
pedido;
ordem de serviço;
transições válidas;
transições inválidas;
estado base;
estados concretos;
diferença para Strategy;
diferença para Chain;
persistência de status;
conversa com front-end.
```

Na próxima aula, vamos estudar:

```text
Command Pattern.
```

A ideia será encapsular ações como objetos, útil para filas, auditoria, execução assíncrona, desfazer operações e padronizar comandos de negócio.
