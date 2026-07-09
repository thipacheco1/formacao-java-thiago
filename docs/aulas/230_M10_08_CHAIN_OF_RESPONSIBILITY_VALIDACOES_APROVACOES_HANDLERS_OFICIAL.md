# 230 — M10.08 — Chain of Responsibility: validações, aprovações e handlers

## Objetivo da aula

Na aula anterior, você estudou:

```text
Template Method Pattern
```

Você viu que Template Method ajuda quando existe um fluxo com:

```text
sequência fixa;
etapas variáveis;
duplicação de algoritmo;
necessidade de proteger a ordem do processo;
hooks opcionais;
herança controlada.
```

Agora vamos estudar outro padrão comportamental muito usado em backend:

```text
Chain of Responsibility
```

Em português:

```text
Cadeia de Responsabilidade
```

Esse padrão aparece quando uma solicitação precisa passar por uma sequência de validadores, regras, aprovadores, filtros ou handlers.

Exemplos comuns em backend:

```text
validação de request;
validação de pedido;
aprovação de transação;
alçada;
pipeline de autorização;
filtros de segurança;
processamento de mensagens;
tratamento de erros;
regras de elegibilidade;
workflow de atendimento;
validações antes de salvar;
interceptadores;
middlewares.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Chain of Responsibility resolve;
identificar validações encadeadas;
criar handler base;
encadear handlers;
parar a cadeia quando houver erro;
continuar a cadeia quando estiver válido;
aplicar em validação de pedido;
aplicar em aprovação de transação;
comparar Chain com Strategy;
comparar Chain com Template Method;
evitar cadeia confusa;
entender como isso aparece em filtros, middlewares e Spring Security futuramente.
```

---

## Ideia principal

Chain of Responsibility permite que uma solicitação passe por uma sequência de objetos.

Cada objeto decide:

```text
processa e encerra;
processa e passa para o próximo;
rejeita e interrompe;
ignora e passa adiante.
```

Exemplo conceitual:

```text
Request
  -> ValidadorCliente
  -> ValidadorProduto
  -> ValidadorEstoque
  -> ValidadorPagamento
  -> Sucesso
```

Se algum validador falhar:

```text
Request
  -> ValidadorCliente
  -> ValidadorProduto
  -> ERRO
```

A cadeia para ali.

---

## Chain em uma frase prática

```text
Use Chain quando uma solicitação precisa passar por uma sequência de regras independentes.
```

Cada handler cuida de uma regra.

A cadeia define a ordem.

---

## Problema comum sem Chain

Você pode ter um método assim:

```java
public void validar(Pedido pedido) {
    if (pedido == null) {
        throw new IllegalArgumentException("Pedido obrigatório.");
    }

    if (pedido.cliente() == null || pedido.cliente().isBlank()) {
        throw new IllegalArgumentException("Cliente obrigatório.");
    }

    if (pedido.valor().compareTo(BigDecimal.ZERO) <= 0) {
        throw new IllegalArgumentException("Valor inválido.");
    }

    if (!estoqueDisponivel(pedido)) {
        throw new IllegalArgumentException("Estoque indisponível.");
    }

    if (!pagamentoPermitido(pedido)) {
        throw new IllegalArgumentException("Pagamento não permitido.");
    }
}
```

Funciona.

Mas começa a crescer.

Problemas:

```text
muitas regras em uma classe;
difícil reutilizar;
difícil testar cada validação isolada;
difícil mudar ordem;
difícil ativar/desativar regras;
método vira um bloco gigante.
```

Chain ajuda a separar.

---

## Relação com SOLID

## SRP

Cada handler tem uma responsabilidade.

Exemplo:

```text
ValidadorCliente:
valida cliente.

ValidadorValor:
valida valor.

ValidadorEstoque:
valida estoque.
```

---

## OCP

Para adicionar nova validação, você cria novo handler.

Não precisa alterar todos os validadores antigos.

---

## LSP

Todo handler precisa cumprir o contrato.

Se o handler base diz:

```text
validar e passar adiante quando estiver ok
```

a implementação não deve retornar `null`, engolir erro indevidamente ou quebrar a cadeia sem motivo.

---

## ISP

A interface do handler deve ser pequena.

Exemplo bom:

```java
void validar(ContextoValidacao contexto);
```

Exemplo ruim:

```java
void validarCliente();
void validarEstoque();
void validarPagamento();
void salvar();
void enviarEmail();
```

---

## DIP

Handlers podem depender de portas.

Exemplo:

```text
ValidadorEstoque depende de EstoqueGateway.
ValidadorClienteBloqueado depende de ClienteRepository.
```

Não devem depender diretamente de detalhes concretos.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Chain:

```text
A cadeia valida ou processa regras em sequência.
O use case chama a cadeia antes de coordenar o restante.
A entidade continua protegendo regra essencial.
O repository continua salvando.
O client continua integrando.
O controller futuro continua recebendo.
```

---

# Parte 1 — Chain vs Strategy

## Strategy

Strategy escolhe uma regra ou comportamento.

Exemplo:

```text
calcular desconto conforme tipo de cliente.
```

---

## Chain

Chain executa uma sequência de regras ou handlers.

Exemplo:

```text
validar cliente;
validar valor;
validar estoque;
validar pagamento.
```

---

## Diferença prática

```text
Strategy:
qual regra usar?

Chain:
por quais regras passar e em qual ordem?
```

---

# Parte 2 — Chain vs Template Method

## Template Method

Define uma sequência fixa em uma classe base, com etapas variáveis nas subclasses.

```text
validar arquivo;
parsear;
validar registros;
salvar.
```

---

## Chain

Define uma sequência de handlers independentes, normalmente composta dinamicamente.

```text
ValidadorA -> ValidadorB -> ValidadorC.
```

---

## Diferença prática

```text
Template Method:
sequência fixa desenhada por herança.

Chain:
sequência composta por objetos encadeados.
```

---

# Parte 3 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-230-chain-of-responsibility-validacoes-aprovacoes-handlers
cd labs\m10\aula-230-chain-of-responsibility-validacoes-aprovacoes-handlers
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula230

mkdir src\br\com\curso\aula230\app

mkdir src\br\com\curso\aula230\ruim

mkdir src\br\com\curso\aula230\dominio
mkdir src\br\com\curso\aula230\dominio\pedido
mkdir src\br\com\curso\aula230\dominio\transacao

mkdir src\br\com\curso\aula230\chain
mkdir src\br\com\curso\aula230\chain\pedido
mkdir src\br\com\curso\aula230\chain\transacao

mkdir src\br\com\curso\aula230\aplicacao
mkdir src\br\com\curso\aula230\aplicacao\service

mkdir src\br\com\curso\aula230\infra
mkdir src\br\com\curso\aula230\infra\estoque
```

---

# Parte 4 — Exemplo ruim: validação gigante

## Pedido

Crie:

```text
src\br\com\curso\aula230\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula230.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String produto;
    private final int quantidade;
    private final BigDecimal valorTotal;
    private final String formaPagamento;
    private final Instant criadoEm;

    public Pedido(
            UUID id,
            String codigo,
            String cliente,
            String produto,
            int quantidade,
            BigDecimal valorTotal,
            String formaPagamento,
            Instant criadoEm
    ) {
        this.id = id;
        this.codigo = codigo;
        this.cliente = cliente;
        this.produto = produto;
        this.quantidade = quantidade;
        this.valorTotal = valorTotal;
        this.formaPagamento = formaPagamento;
        this.criadoEm = criadoEm;
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

    public String produto() {
        return produto;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal valorTotal() {
        return valorTotal;
    }

    public String formaPagamento() {
        return formaPagamento;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Produto: " + produto
                + " | Quantidade: " + quantidade
                + " | Valor: " + valorTotal
                + " | Pagamento: " + formaPagamento;
    }
}
```

---

## PedidoValidadorRuim

Crie:

```text
src\br\com\curso\aula230\ruim\PedidoValidadorRuim.java
```

Código:

```java
package br.com.curso.aula230.ruim;

import br.com.curso.aula230.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class PedidoValidadorRuim {
    public void validar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.id() == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (pedido.codigo() == null || pedido.codigo().isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (pedido.cliente() == null || pedido.cliente().isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (pedido.produto() == null || pedido.produto().isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (pedido.quantidade() <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (pedido.valorTotal() == null || pedido.valorTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor total deve ser maior que zero.");
        }

        if (pedido.formaPagamento() == null || pedido.formaPagamento().isBlank()) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }

        if ("BOLETO".equalsIgnoreCase(pedido.formaPagamento())
                && pedido.valorTotal().compareTo(new BigDecimal("5000.00")) > 0) {
            throw new IllegalArgumentException("Boleto não permitido acima de 5000.00.");
        }

        if ("PRODUTO_BLOQUEADO".equalsIgnoreCase(pedido.produto())) {
            throw new IllegalArgumentException("Produto bloqueado para venda.");
        }
    }
}
```

---

## PedidoValidadorRuimApp

Crie:

```text
src\br\com\curso\aula230\app\PedidoValidadorRuimApp.java
```

Código:

```java
package br.com.curso.aula230.app;

import br.com.curso.aula230.dominio.pedido.Pedido;
import br.com.curso.aula230.ruim.PedidoValidadorRuim;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoValidadorRuimApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                "Notebook",
                1,
                new BigDecimal("3500.00"),
                "CARTAO",
                Instant.now()
        );

        PedidoValidadorRuim validador = new PedidoValidadorRuim();

        validador.validar(pedido);

        System.out.println("Pedido válido: " + pedido.resumo());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula230.app.PedidoValidadorRuimApp
```

---

## Diagnóstico

A classe funciona.

Mas concentra muitas regras.

Se adicionar:

```text
validar cupom;
validar cliente bloqueado;
validar estoque;
validar limite;
validar antifraude;
validar política comercial;
validar endereço;
```

o método cresce sem parar.

Vamos refatorar usando Chain.

---

# Parte 5 — Criando a base da Chain

## ContextoValidacaoPedido

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ContextoValidacaoPedido.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

import br.com.curso.aula230.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;

public class ContextoValidacaoPedido {
    private final Pedido pedido;
    private final List<String> erros = new ArrayList<>();

    public ContextoValidacaoPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Pedido pedido() {
        return pedido;
    }

    public void adicionarErro(String erro) {
        if (erro == null || erro.isBlank()) {
            throw new IllegalArgumentException("Erro é obrigatório.");
        }

        erros.add(erro);
    }

    public boolean valido() {
        return erros.isEmpty();
    }

    public boolean invalido() {
        return !valido();
    }

    public List<String> erros() {
        return List.copyOf(erros);
    }
}
```

---

## ValidadorPedidoHandler

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoHandler.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

public abstract class ValidadorPedidoHandler {
    private ValidadorPedidoHandler proximo;

    public ValidadorPedidoHandler ligarCom(ValidadorPedidoHandler proximo) {
        if (proximo == null) {
            throw new IllegalArgumentException("Próximo handler é obrigatório.");
        }

        this.proximo = proximo;
        return proximo;
    }

    public final void validar(ContextoValidacaoPedido contexto) {
        if (contexto == null) {
            throw new IllegalArgumentException("Contexto é obrigatório.");
        }

        executarValidacao(contexto);

        if (contexto.invalido()) {
            return;
        }

        if (proximo != null) {
            proximo.validar(contexto);
        }
    }

    protected abstract void executarValidacao(ContextoValidacaoPedido contexto);
}
```

---

## Como a base funciona

Cada handler implementa:

```java
protected abstract void executarValidacao(ContextoValidacaoPedido contexto);
```

O método final:

```java
validar(...)
```

controla a cadeia:

```text
executa validação atual;
se houver erro, para;
se não houver erro, chama o próximo.
```

Essa versão é uma Chain que interrompe no primeiro erro.

Mais adiante veremos variação acumulando erros.

---

# Parte 6 — Handlers de pedido

## ValidadorPedidoObrigatorio

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoObrigatorio.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

public class ValidadorPedidoObrigatorio extends ValidadorPedidoHandler {
    @Override
    protected void executarValidacao(ContextoValidacaoPedido contexto) {
        if (contexto.pedido() == null) {
            contexto.adicionarErro("Pedido é obrigatório.");
        }
    }
}
```

---

## ValidadorPedidoIdentificacao

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoIdentificacao.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

import br.com.curso.aula230.dominio.pedido.Pedido;

public class ValidadorPedidoIdentificacao extends ValidadorPedidoHandler {
    @Override
    protected void executarValidacao(ContextoValidacaoPedido contexto) {
        Pedido pedido = contexto.pedido();

        if (pedido.id() == null) {
            contexto.adicionarErro("ID é obrigatório.");
            return;
        }

        if (pedido.codigo() == null || pedido.codigo().isBlank()) {
            contexto.adicionarErro("Código é obrigatório.");
        }
    }
}
```

---

## ValidadorPedidoCliente

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoCliente.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

import br.com.curso.aula230.dominio.pedido.Pedido;

public class ValidadorPedidoCliente extends ValidadorPedidoHandler {
    @Override
    protected void executarValidacao(ContextoValidacaoPedido contexto) {
        Pedido pedido = contexto.pedido();

        if (pedido.cliente() == null || pedido.cliente().isBlank()) {
            contexto.adicionarErro("Cliente é obrigatório.");
        }
    }
}
```

---

## ValidadorPedidoProduto

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoProduto.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

import br.com.curso.aula230.dominio.pedido.Pedido;

public class ValidadorPedidoProduto extends ValidadorPedidoHandler {
    @Override
    protected void executarValidacao(ContextoValidacaoPedido contexto) {
        Pedido pedido = contexto.pedido();

        if (pedido.produto() == null || pedido.produto().isBlank()) {
            contexto.adicionarErro("Produto é obrigatório.");
            return;
        }

        if ("PRODUTO_BLOQUEADO".equalsIgnoreCase(pedido.produto())) {
            contexto.adicionarErro("Produto bloqueado para venda.");
        }
    }
}
```

---

## ValidadorPedidoValor

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoValor.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

import br.com.curso.aula230.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class ValidadorPedidoValor extends ValidadorPedidoHandler {
    @Override
    protected void executarValidacao(ContextoValidacaoPedido contexto) {
        Pedido pedido = contexto.pedido();

        if (pedido.quantidade() <= 0) {
            contexto.adicionarErro("Quantidade deve ser maior que zero.");
            return;
        }

        if (pedido.valorTotal() == null || pedido.valorTotal().compareTo(BigDecimal.ZERO) <= 0) {
            contexto.adicionarErro("Valor total deve ser maior que zero.");
        }
    }
}
```

---

## ValidadorPedidoPagamento

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoPagamento.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

import br.com.curso.aula230.dominio.pedido.Pedido;

import java.math.BigDecimal;

public class ValidadorPedidoPagamento extends ValidadorPedidoHandler {
    @Override
    protected void executarValidacao(ContextoValidacaoPedido contexto) {
        Pedido pedido = contexto.pedido();

        if (pedido.formaPagamento() == null || pedido.formaPagamento().isBlank()) {
            contexto.adicionarErro("Forma de pagamento é obrigatória.");
            return;
        }

        if ("BOLETO".equalsIgnoreCase(pedido.formaPagamento())
                && pedido.valorTotal().compareTo(new BigDecimal("5000.00")) > 0) {
            contexto.adicionarErro("Boleto não permitido acima de 5000.00.");
        }
    }
}
```

---

# Parte 7 — Montando a cadeia

## PedidoValidadorChainFactory

Crie:

```text
src\br\com\curso\aula230\chain\pedido\PedidoValidadorChainFactory.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

public final class PedidoValidadorChainFactory {
    private PedidoValidadorChainFactory() {
    }

    public static ValidadorPedidoHandler criarPadrao() {
        ValidadorPedidoHandler inicio = new ValidadorPedidoObrigatorio();

        inicio
                .ligarCom(new ValidadorPedidoIdentificacao())
                .ligarCom(new ValidadorPedidoCliente())
                .ligarCom(new ValidadorPedidoProduto())
                .ligarCom(new ValidadorPedidoValor())
                .ligarCom(new ValidadorPedidoPagamento());

        return inicio;
    }
}
```

---

## ValidadorPedidoChainApp

Crie:

```text
src\br\com\curso\aula230\app\ValidadorPedidoChainApp.java
```

Código:

```java
package br.com.curso.aula230.app;

import br.com.curso.aula230.chain.pedido.ContextoValidacaoPedido;
import br.com.curso.aula230.chain.pedido.PedidoValidadorChainFactory;
import br.com.curso.aula230.chain.pedido.ValidadorPedidoHandler;
import br.com.curso.aula230.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ValidadorPedidoChainApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                "Notebook",
                1,
                new BigDecimal("3500.00"),
                "CARTAO",
                Instant.now()
        );

        ContextoValidacaoPedido contexto = new ContextoValidacaoPedido(pedido);

        ValidadorPedidoHandler chain = PedidoValidadorChainFactory.criarPadrao();

        chain.validar(contexto);

        if (contexto.valido()) {
            System.out.println("Pedido válido: " + pedido.resumo());
        } else {
            System.out.println("Pedido inválido:");
            contexto.erros().forEach(erro -> System.out.println(" - " + erro));
        }
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula230.app.ValidadorPedidoChainApp
```

---

## Pedido inválido

Crie:

```text
src\br\com\curso\aula230\app\ValidadorPedidoInvalidoChainApp.java
```

Código:

```java
package br.com.curso.aula230.app;

import br.com.curso.aula230.chain.pedido.ContextoValidacaoPedido;
import br.com.curso.aula230.chain.pedido.PedidoValidadorChainFactory;
import br.com.curso.aula230.chain.pedido.ValidadorPedidoHandler;
import br.com.curso.aula230.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ValidadorPedidoInvalidoChainApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-002",
                "Carlos Souza",
                "Notebook",
                1,
                new BigDecimal("6000.00"),
                "BOLETO",
                Instant.now()
        );

        ContextoValidacaoPedido contexto = new ContextoValidacaoPedido(pedido);

        ValidadorPedidoHandler chain = PedidoValidadorChainFactory.criarPadrao();

        chain.validar(contexto);

        if (contexto.valido()) {
            System.out.println("Pedido válido.");
        } else {
            System.out.println("Pedido inválido:");
            contexto.erros().forEach(erro -> System.out.println(" - " + erro));
        }
    }
}
```

---

# Parte 8 — Chain que acumula erros

A versão anterior para no primeiro erro.

Em alguns cenários, você quer acumular todos os erros para devolver ao front.

Exemplo:

```json
{
  "codigo": "VALIDACAO_ERRO",
  "mensagem": "Existem campos inválidos.",
  "campos": [
    {
      "campo": "cliente",
      "mensagem": "Cliente é obrigatório."
    },
    {
      "campo": "produto",
      "mensagem": "Produto é obrigatório."
    }
  ]
}
```

Para isso, a cadeia não deve parar ao primeiro erro.

---

## ValidadorPedidoAcumulativoHandler

Crie:

```text
src\br\com\curso\aula230\chain\pedido\ValidadorPedidoAcumulativoHandler.java
```

Código:

```java
package br.com.curso.aula230.chain.pedido;

public abstract class ValidadorPedidoAcumulativoHandler {
    private ValidadorPedidoAcumulativoHandler proximo;

    public ValidadorPedidoAcumulativoHandler ligarCom(ValidadorPedidoAcumulativoHandler proximo) {
        if (proximo == null) {
            throw new IllegalArgumentException("Próximo handler é obrigatório.");
        }

        this.proximo = proximo;
        return proximo;
    }

    public final void validar(ContextoValidacaoPedido contexto) {
        if (contexto == null) {
            throw new IllegalArgumentException("Contexto é obrigatório.");
        }

        executarValidacao(contexto);

        if (proximo != null) {
            proximo.validar(contexto);
        }
    }

    protected abstract void executarValidacao(ContextoValidacaoPedido contexto);
}
```

---

## Observação

A diferença é que ela continua mesmo com erro.

Use isso quando quiser listar vários erros.

Use a chain que para quando:

```text
o erro torna inútil continuar;
seguir pode gerar NullPointerException;
há validações dependentes;
performance importa;
regra de negócio exige parar.
```

Use a chain acumulativa quando:

```text
quer devolver todos os erros de formulário;
as regras são independentes;
a experiência do front melhora com lista completa.
```

---

# Parte 9 — Chain de aprovação de transação

Agora vamos aplicar Chain em aprovação.

Cenário:

```text
transação até 1000 -> aprovação automática nível 1;
até 5000 -> aprovação nível 2;
até 20000 -> aprovação gerencial;
acima disso -> diretoria.
```

Cada aprovador decide se pode aprovar.

Se não puder, passa para o próximo.

---

## Transacao

Crie:

```text
src\br\com\curso\aula230\dominio\transacao\Transacao.java
```

Código:

```java
package br.com.curso.aula230.dominio.transacao;

import java.math.BigDecimal;
import java.time.Instant;

public class Transacao {
    private final String codigo;
    private final String solicitante;
    private final BigDecimal valor;
    private final Instant solicitadaEm;

    public Transacao(String codigo, String solicitante, BigDecimal valor, Instant solicitadaEm) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (solicitante == null || solicitante.isBlank()) {
            throw new IllegalArgumentException("Solicitante é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (solicitadaEm == null) {
            throw new IllegalArgumentException("Data de solicitação é obrigatória.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.solicitante = solicitante.trim();
        this.valor = valor;
        this.solicitadaEm = solicitadaEm;
    }

    public String codigo() {
        return codigo;
    }

    public String solicitante() {
        return solicitante;
    }

    public BigDecimal valor() {
        return valor;
    }

    public Instant solicitadaEm() {
        return solicitadaEm;
    }
}
```

---

## ResultadoAprovacao

Crie:

```text
src\br\com\curso\aula230\dominio\transacao\ResultadoAprovacao.java
```

Código:

```java
package br.com.curso.aula230.dominio.transacao;

public class ResultadoAprovacao {
    private final boolean aprovada;
    private final String nivel;
    private final String mensagem;

    private ResultadoAprovacao(boolean aprovada, String nivel, String mensagem) {
        if (nivel == null || nivel.isBlank()) {
            throw new IllegalArgumentException("Nível é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.aprovada = aprovada;
        this.nivel = nivel;
        this.mensagem = mensagem;
    }

    public static ResultadoAprovacao aprovada(String nivel, String mensagem) {
        return new ResultadoAprovacao(true, nivel, mensagem);
    }

    public static ResultadoAprovacao pendente(String nivel, String mensagem) {
        return new ResultadoAprovacao(false, nivel, mensagem);
    }

    public boolean aprovada() {
        return aprovada;
    }

    public String nivel() {
        return nivel;
    }

    public String mensagem() {
        return mensagem;
    }

    @Override
    public String toString() {
        return "ResultadoAprovacao{"
                + "aprovada=" + aprovada
                + ", nivel='" + nivel + '\''
                + ", mensagem='" + mensagem + '\''
                + '}';
    }
}
```

---

## AprovadorTransacaoHandler

Crie:

```text
src\br\com\curso\aula230\chain\transacao\AprovadorTransacaoHandler.java
```

Código:

```java
package br.com.curso.aula230.chain.transacao;

import br.com.curso.aula230.dominio.transacao.ResultadoAprovacao;
import br.com.curso.aula230.dominio.transacao.Transacao;

public abstract class AprovadorTransacaoHandler {
    private AprovadorTransacaoHandler proximo;

    public AprovadorTransacaoHandler ligarCom(AprovadorTransacaoHandler proximo) {
        if (proximo == null) {
            throw new IllegalArgumentException("Próximo aprovador é obrigatório.");
        }

        this.proximo = proximo;
        return proximo;
    }

    public final ResultadoAprovacao aprovar(Transacao transacao) {
        if (transacao == null) {
            throw new IllegalArgumentException("Transação é obrigatória.");
        }

        if (podeAprovar(transacao)) {
            return aprovarInternamente(transacao);
        }

        if (proximo != null) {
            return proximo.aprovar(transacao);
        }

        return ResultadoAprovacao.pendente(
                "SEM_ALCADA",
                "Nenhum aprovador disponível para o valor: " + transacao.valor()
        );
    }

    protected abstract boolean podeAprovar(Transacao transacao);

    protected abstract ResultadoAprovacao aprovarInternamente(Transacao transacao);
}
```

---

## AprovadorNivel1

Crie:

```text
src\br\com\curso\aula230\chain\transacao\AprovadorNivel1.java
```

Código:

```java
package br.com.curso.aula230.chain.transacao;

import br.com.curso.aula230.dominio.transacao.ResultadoAprovacao;
import br.com.curso.aula230.dominio.transacao.Transacao;

import java.math.BigDecimal;

public class AprovadorNivel1 extends AprovadorTransacaoHandler {
    @Override
    protected boolean podeAprovar(Transacao transacao) {
        return transacao.valor().compareTo(new BigDecimal("1000.00")) <= 0;
    }

    @Override
    protected ResultadoAprovacao aprovarInternamente(Transacao transacao) {
        return ResultadoAprovacao.aprovada(
                "NIVEL_1",
                "Transação aprovada automaticamente no nível 1."
        );
    }
}
```

---

## AprovadorNivel2

Crie:

```text
src\br\com\curso\aula230\chain\transacao\AprovadorNivel2.java
```

Código:

```java
package br.com.curso.aula230.chain.transacao;

import br.com.curso.aula230.dominio.transacao.ResultadoAprovacao;
import br.com.curso.aula230.dominio.transacao.Transacao;

import java.math.BigDecimal;

public class AprovadorNivel2 extends AprovadorTransacaoHandler {
    @Override
    protected boolean podeAprovar(Transacao transacao) {
        return transacao.valor().compareTo(new BigDecimal("5000.00")) <= 0;
    }

    @Override
    protected ResultadoAprovacao aprovarInternamente(Transacao transacao) {
        return ResultadoAprovacao.aprovada(
                "NIVEL_2",
                "Transação aprovada no nível 2."
        );
    }
}
```

---

## AprovadorGerencial

Crie:

```text
src\br\com\curso\aula230\chain\transacao\AprovadorGerencial.java
```

Código:

```java
package br.com.curso.aula230.chain.transacao;

import br.com.curso.aula230.dominio.transacao.ResultadoAprovacao;
import br.com.curso.aula230.dominio.transacao.Transacao;

import java.math.BigDecimal;

public class AprovadorGerencial extends AprovadorTransacaoHandler {
    @Override
    protected boolean podeAprovar(Transacao transacao) {
        return transacao.valor().compareTo(new BigDecimal("20000.00")) <= 0;
    }

    @Override
    protected ResultadoAprovacao aprovarInternamente(Transacao transacao) {
        return ResultadoAprovacao.aprovada(
                "GERENCIAL",
                "Transação aprovada por alçada gerencial."
        );
    }
}
```

---

## AprovadorDiretoria

Crie:

```text
src\br\com\curso\aula230\chain\transacao\AprovadorDiretoria.java
```

Código:

```java
package br.com.curso.aula230.chain.transacao;

import br.com.curso.aula230.dominio.transacao.ResultadoAprovacao;
import br.com.curso.aula230.dominio.transacao.Transacao;

import java.math.BigDecimal;

public class AprovadorDiretoria extends AprovadorTransacaoHandler {
    @Override
    protected boolean podeAprovar(Transacao transacao) {
        return transacao.valor().compareTo(new BigDecimal("100000.00")) <= 0;
    }

    @Override
    protected ResultadoAprovacao aprovarInternamente(Transacao transacao) {
        return ResultadoAprovacao.aprovada(
                "DIRETORIA",
                "Transação aprovada pela diretoria."
        );
    }
}
```

---

## AprovadorTransacaoChainFactory

Crie:

```text
src\br\com\curso\aula230\chain\transacao\AprovadorTransacaoChainFactory.java
```

Código:

```java
package br.com.curso.aula230.chain.transacao;

public final class AprovadorTransacaoChainFactory {
    private AprovadorTransacaoChainFactory() {
    }

    public static AprovadorTransacaoHandler criarPadrao() {
        AprovadorTransacaoHandler inicio = new AprovadorNivel1();

        inicio
                .ligarCom(new AprovadorNivel2())
                .ligarCom(new AprovadorGerencial())
                .ligarCom(new AprovadorDiretoria());

        return inicio;
    }
}
```

---

## AprovacaoTransacaoChainApp

Crie:

```text
src\br\com\curso\aula230\app\AprovacaoTransacaoChainApp.java
```

Código:

```java
package br.com.curso.aula230.app;

import br.com.curso.aula230.chain.transacao.AprovadorTransacaoChainFactory;
import br.com.curso.aula230.chain.transacao.AprovadorTransacaoHandler;
import br.com.curso.aula230.dominio.transacao.ResultadoAprovacao;
import br.com.curso.aula230.dominio.transacao.Transacao;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class AprovacaoTransacaoChainApp {
    public static void main(String[] args) {
        AprovadorTransacaoHandler chain = AprovadorTransacaoChainFactory.criarPadrao();

        List<Transacao> transacoes = List.of(
                new Transacao("TR-001", "Ana", new BigDecimal("500.00"), Instant.now()),
                new Transacao("TR-002", "Carlos", new BigDecimal("3000.00"), Instant.now()),
                new Transacao("TR-003", "Maria", new BigDecimal("15000.00"), Instant.now()),
                new Transacao("TR-004", "Bruna", new BigDecimal("80000.00"), Instant.now()),
                new Transacao("TR-005", "Joao", new BigDecimal("150000.00"), Instant.now())
        );

        for (Transacao transacao : transacoes) {
            ResultadoAprovacao resultado = chain.aprovar(transacao);
            System.out.println(transacao.codigo() + " | Valor: " + transacao.valor() + " | " + resultado);
        }
    }
}
```

---

# Parte 10 — Chain no service

## PedidoValidacaoService

Crie:

```text
src\br\com\curso\aula230\aplicacao\service\PedidoValidacaoService.java
```

Código:

```java
package br.com.curso.aula230.aplicacao.service;

import br.com.curso.aula230.chain.pedido.ContextoValidacaoPedido;
import br.com.curso.aula230.chain.pedido.ValidadorPedidoHandler;
import br.com.curso.aula230.dominio.pedido.Pedido;

public class PedidoValidacaoService {
    private final ValidadorPedidoHandler chain;

    public PedidoValidacaoService(ValidadorPedidoHandler chain) {
        if (chain == null) {
            throw new IllegalArgumentException("Chain de validação é obrigatória.");
        }

        this.chain = chain;
    }

    public void validarOuFalhar(Pedido pedido) {
        ContextoValidacaoPedido contexto = new ContextoValidacaoPedido(pedido);

        chain.validar(contexto);

        if (contexto.invalido()) {
            throw new IllegalArgumentException("Pedido inválido: " + String.join(", ", contexto.erros()));
        }
    }
}
```

---

## PedidoValidacaoServiceApp

Crie:

```text
src\br\com\curso\aula230\app\PedidoValidacaoServiceApp.java
```

Código:

```java
package br.com.curso.aula230.app;

import br.com.curso.aula230.aplicacao.service.PedidoValidacaoService;
import br.com.curso.aula230.chain.pedido.PedidoValidadorChainFactory;
import br.com.curso.aula230.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoValidacaoServiceApp {
    public static void main(String[] args) {
        PedidoValidacaoService service = new PedidoValidacaoService(
                PedidoValidadorChainFactory.criarPadrao()
        );

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-010",
                "Maria Oliveira",
                "Cadeira",
                2,
                new BigDecimal("900.00"),
                "PIX",
                Instant.now()
        );

        service.validarOuFalhar(pedido);

        System.out.println("Pedido aprovado na validação.");
    }
}
```

---

# Parte 11 — Como isso aparece no front-end

Quando você usa Chain acumulativa em validação, consegue devolver vários erros para o front.

Exemplo futuro:

```json
{
  "codigo": "VALIDACAO_ERRO",
  "mensagem": "Existem campos inválidos.",
  "campos": [
    {
      "campo": "cliente",
      "mensagem": "Cliente é obrigatório."
    },
    {
      "campo": "valorTotal",
      "mensagem": "Valor total deve ser maior que zero."
    },
    {
      "campo": "formaPagamento",
      "mensagem": "Forma de pagamento é obrigatória."
    }
  ]
}
```

Isso é melhor do que devolver um erro por vez quando o usuário preenche um formulário.

---

# Parte 12 — Chain em frameworks

Você verá Chain em vários lugares.

## Middleware

```text
Request -> Middleware de Log -> Middleware de Auth -> Middleware de Permissão -> Controller
```

---

## Filtros

```text
Request -> Filtro CORS -> Filtro JWT -> Filtro Autorização -> Endpoint
```

---

## Spring Security

Conceitualmente, existe uma cadeia de filtros.

Cada filtro processa ou passa adiante.

---

## Validações

```text
Request -> ValidadorCampos -> ValidadorNegocio -> ValidadorPermissao -> UseCase
```

---

# Parte 13 — Erros comuns com Chain

## 1. Ordem confusa

A ordem importa.

Exemplo:

```text
não valide campo de objeto nulo antes de validar se objeto existe.
```

---

## 2. Handler fazendo coisa demais

Cada handler deve ter uma regra clara.

---

## 3. Chain escondida demais

Se ninguém sabe quais handlers rodam, debug fica difícil.

Use factories e nomes claros.

---

## 4. Chain para um problema simples

Se só existe uma validação simples, não precisa Chain.

---

## 5. Misturar validação com efeito colateral indevido

Validador não deveria salvar, notificar ou pagar.

---

# Parte 14 — Checklist para usar Chain

Pergunte:

```text
1. Existe sequência de regras?
2. As regras são independentes?
3. A ordem importa?
4. Preciso parar no primeiro erro?
5. Preciso acumular erros?
6. Cada regra pode ser uma classe?
7. Posso testar cada regra isoladamente?
8. Existe uma factory para montar a ordem?
9. A chain está clara para debug?
10. Strategy ou Template Method resolveriam melhor?
```

---

# Parte 15 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula230.app.PedidoValidadorRuimApp
java -cp out br.com.curso.aula230.app.ValidadorPedidoChainApp
java -cp out br.com.curso.aula230.app.ValidadorPedidoInvalidoChainApp
java -cp out br.com.curso.aula230.app.AprovacaoTransacaoChainApp
java -cp out br.com.curso.aula230.app.PedidoValidacaoServiceApp
```

Depois responda:

```text
1. Qual era o problema do validador ruim?
2. Qual classe representa o handler base?
3. Como a cadeia é montada?
4. O que acontece quando um erro é adicionado?
5. Qual diferença entre chain interrompida e acumulativa?
6. Onde Chain apareceu na aprovação de transação?
7. Qual relação com OCP?
8. Qual relação com SRP?
9. Como isso ajuda o front?
10. Quando Chain seria exagero?
```

---

# Parte 16 — Exercício prático principal

## Contexto

Crie uma Chain para validação de abertura de Ordem de Serviço.

Campos:

```text
cliente;
telefone;
descricao;
tipo;
cep;
dataAgendamento;
periodo;
```

---

## Contexto

Crie:

```text
ContextoValidacaoAberturaOs
```

Com:

```text
AberturaOsRequest request;
List<String> erros;
```

---

## Handlers

Crie:

```text
ValidadorClienteOs;
ValidadorTelefoneOs;
ValidadorDescricaoOs;
ValidadorTipoOs;
ValidadorCepOs;
ValidadorAgendamentoOs;
ValidadorPeriodoOs.
```

---

## Regras

```text
cliente obrigatório;
telefone obrigatório;
descricao obrigatória e mínimo 10 caracteres;
tipo deve ser NORMAL, CRITICA, REAGENDAMENTO ou SEM_CAPACITY;
cep obrigatório com 8 dígitos;
dataAgendamento não pode ser no passado;
periodo deve ser MANHA, TARDE ou NOITE.
```

---

## Duas versões

Crie:

```text
Chain que para no primeiro erro;
Chain acumulativa.
```

---

## Critérios

```text
cada handler valida uma regra;
ordem clara;
sem handler salvando dados;
sem handler chamando notificação;
factory monta a cadeia;
service usa a cadeia.
```

---

# Parte 17 — Desafio extra

## Chain de alçada

Crie uma cadeia de aprovação parecida com sistemas de alçada.

Níveis:

```text
ANALISTA:
até 1000.

SUPERVISOR:
até 5000.

GERENTE:
até 20000.

DIRETOR:
até 100000.

COMITE:
acima de 100000.
```

Crie:

```text
SolicitacaoAlcada;
ResultadoAlcada;
AprovadorAlcadaHandler;
AprovadorAnalista;
AprovadorSupervisor;
AprovadorGerente;
AprovadorDiretor;
AprovadorComite.
```

Critério:

```text
cada aprovador decide se pode aprovar;
se não puder, passa adiante;
se ninguém aprovar, retorna pendente;
não usar if gigante central.
```

---

# Parte 18 — Simulado rápido

## Questão 1

Chain of Responsibility é útil quando:

```text
A) uma solicitação precisa passar por uma sequência de handlers.
B) um objeto tem muitos campos opcionais.
C) preciso adaptar API externa.
D) preciso criar entidade com factory.
```

---

## Questão 2

Cada handler deve:

```text
A) ter uma responsabilidade clara.
B) salvar tudo no banco.
C) enviar e-mail sempre.
D) conhecer todos os módulos.
```

---

## Questão 3

Chain pode ser usada para:

```text
A) validações e aprovações.
B) apenas construtores.
C) apenas DTOs.
D) apenas enums.
```

---

## Questão 4

Uma chain acumulativa é útil quando:

```text
A) queremos coletar vários erros de validação.
B) queremos parar no primeiro erro sempre.
C) queremos remover todos os handlers.
D) queremos substituir o domínio.
```

---

## Questão 5

A ordem dos handlers:

```text
A) pode ser importante.
B) nunca importa.
C) é definida pelo banco.
D) é sempre alfabética.
```

---

## Questão 6

Chain se diferencia de Strategy porque:

```text
A) Chain executa uma sequência; Strategy escolhe/usa uma regra intercambiável.
B) Chain é apenas para criar objetos.
C) Strategy é apenas para arquivos.
D) Não existe diferença.
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

# Parte 19 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Chain of Responsibility.
[ ] Sei identificar validação gigante.
[ ] Sei criar handler base.
[ ] Sei encadear handlers.
[ ] Sei parar no primeiro erro.
[ ] Sei criar chain acumulativa.
[ ] Sei aplicar em validação de pedido.
[ ] Sei aplicar em aprovação de transação.
[ ] Sei diferenciar Chain de Strategy.
[ ] Sei diferenciar Chain de Template Method.
[ ] Sei explicar relação com front.
[ ] Sei evitar chain desnecessária.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Chain of Responsibility?
2. Qual problema ela resolve?
3. O que é handler?
4. Como a cadeia passa para o próximo?
5. Quando parar no primeiro erro?
6. Quando acumular erros?
7. Qual diferença entre Chain e Strategy?
8. Qual diferença entre Chain e Template Method?
9. Como Chain aparece em filtros/middlewares?
10. Como Chain ajuda em validação para front?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
refatorar validador gigante;
criar cadeia de validadores;
criar cadeia de aprovadores;
montar chain por factory;
usar chain dentro de service;
decidir entre parar ou acumular erros;
explicar relação com SOLID;
resolver exercício de OS;
resolver desafio de alçada.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-230-chain-of-responsibility-validacoes-aprovacoes-handlers
git commit -m "Aula 230: chain of responsibility validacoes aprovacoes handlers"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Chain of Responsibility organiza uma sequência de handlers independentes, evitando validadores e aprovadores gigantes.
```

Você estudou:

```text
Chain of Responsibility;
handlers;
validação de pedido;
cadeia interrompida;
cadeia acumulativa;
aprovação de transação;
factory de chain;
service usando chain;
relação com Strategy;
relação com Template Method;
uso futuro em filtros e Spring Security.
```

Na próxima aula, vamos estudar:

```text
State Pattern.
```

A ideia será organizar comportamento por status, evitando ifs gigantes baseados em estado, muito comum em pedidos, ordens de serviço, workflows e jornadas.
