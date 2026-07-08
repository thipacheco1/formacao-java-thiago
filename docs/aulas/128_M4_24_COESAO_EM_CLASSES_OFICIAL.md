# 128 — M4.24 — Coesão em classes

## Objetivo da aula

Nesta aula você vai aprender coesão em classes.

Nas últimas aulas, você estudou organização de arquivos, pacotes e modificadores de acesso. Agora vamos avançar no desenho das classes: não basta uma classe compilar; ela precisa ter uma responsabilidade clara.

Ao final da aula, você deve conseguir:

```text
explicar o que é coesão;
identificar classe com baixa coesão;
identificar classe com alta coesão;
entender por que classes grandes demais ficam difíceis de manter;
separar responsabilidades sem criar bagunça;
evitar classes Deus;
evitar classes Utils genéricas;
modelar entidades e objetos de valor com foco;
entender a diferença entre dividir bem e dividir demais;
aplicar coesão em domínio Java backend.
```

Essa aula é essencial para Java backend porque sistemas reais crescem.

Uma classe pequena e clara hoje pode virar um monstro amanhã se você não souber proteger a responsabilidade dela.

---

## A ideia central

Coesão mede o quanto os elementos de uma classe pertencem ao mesmo assunto.

Uma classe com alta coesão tem:

```text
atributos relacionados;
métodos relacionados;
responsabilidade clara;
nome coerente com o que ela faz;
poucos motivos para mudar.
```

Uma classe com baixa coesão tem:

```text
muitos assuntos misturados;
atributos que não conversam entre si;
métodos sem relação;
regras de domínios diferentes;
nome genérico;
muitos motivos para mudar.
```

A pergunta principal é:

```text
tudo que está dentro desta classe realmente pertence a esta classe?
```

Se a resposta for não, a classe provavelmente tem baixa coesão.

---

## Exemplo mental simples

Imagine uma classe chamada:

```java
Pedido
```

Faz sentido ela saber:

```text
número do pedido;
cliente;
total;
status;
confirmar pagamento;
cancelar pedido;
verificar se está pago.
```

Mas começa a ficar estranho se ela também fizer:

```text
enviar e-mail;
gerar PDF;
salvar no banco;
chamar API externa;
formatar HTML;
validar CPF do cliente;
calcular imposto de todos os países;
gerar planilha.
```

Algumas dessas coisas podem ter relação com o pedido, mas talvez não pertençam à entidade `Pedido`.

Coesão é sobre colocar cada responsabilidade no lugar certo.

---

## Alta coesão não significa classe minúscula

Uma classe coesa pode ter vários métodos.

O problema não é quantidade por si só.

O problema é mistura de responsabilidades.

Uma classe pode ter 15 métodos e ser coesa se todos forem sobre o mesmo conceito.

Exemplo:

```text
Pedido
- confirmarPagamento
- cancelar
- adicionarItem
- removerItem
- total
- pago
- cancelado
- quantidadeItens
```

Tudo gira em torno do pedido.

Mas uma classe com 5 métodos pode ser pouco coesa se cada método for de um assunto diferente.

Exemplo:

```text
SistemaUtils
- validarEmail
- calcularFrete
- salvarPedido
- enviarSms
- gerarToken
```

O problema é a falta de foco.

---

## Por que coesão importa

Classe com baixa coesão causa problemas como:

```text
difícil entender;
difícil testar;
difícil reaproveitar;
difícil alterar sem quebrar outra coisa;
muitos conflitos de merge;
muitos motivos para mudar;
métodos públicos demais;
dependências demais;
código crescendo sem direção.
```

Classe coesa melhora:

```text
leitura;
manutenção;
testabilidade;
evolução;
reuso;
debug;
separação de responsabilidades;
arquitetura.
```

Em backend, coesão ajuda a evitar sistemas onde tudo fica em:

```text
PedidoService gigante;
ClienteService gigante;
Utils gigante;
Controller cheio de regra;
classe de entidade sem comportamento;
classe Manager fazendo tudo.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-128-coesao-em-classes
cd labs\m4\aula-128-coesao-em-classes
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula128
mkdir src\br\com\curso\aula128\app
mkdir src\br\com\curso\aula128\exemplo\ruim
mkdir src\br\com\curso\aula128\dominio
mkdir src\br\com\curso\aula128\dominio\cliente
mkdir src\br\com\curso\aula128\dominio\pedido
mkdir src\br\com\curso\aula128\dominio\valor
mkdir src\br\com\curso\aula128\dominio\notificacao
mkdir src\br\com\curso\aula128\dominio\contrato
mkdir src\br\com\curso\aula128\dominio\servico
```

Nesta aula, vamos comparar:

```text
uma classe com baixa coesão;
um domínio reorganizado com classes mais coesas.
```

---

## Exemplo 1 — Classe com baixa coesão

Vamos começar com uma classe que funciona, mas mistura responsabilidades.

Crie:

```text
src\br\com\curso\aula128\exemplo\ruim\PedidoBaixaCoesaoApp.java
```

Código:

```java
package br.com.curso.aula128.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoBaixaCoesaoApp {
    public static void main(String[] args) {
        PedidoBaixaCoesao pedido = new PedidoBaixaCoesao(
                1001,
                "Ana Silva",
                "ana@email.com",
                new BigDecimal("399.80")
        );

        pedido.confirmarPagamento(new BigDecimal("399.80"));
        pedido.enviarEmailConfirmacao();
        pedido.gerarTextoParaTela();

        System.out.println(pedido.resumo());
    }
}

class PedidoBaixaCoesao {
    private final int numero;
    private final String nomeCliente;
    private final String emailCliente;
    private final BigDecimal total;
    private String status;
    private String ultimoEmailEnviado;
    private String textoTela;

    PedidoBaixaCoesao(int numero, String nomeCliente, String emailCliente, BigDecimal total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (nomeCliente == null || nomeCliente.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (emailCliente == null || emailCliente.isBlank() || !emailCliente.contains("@")) {
            throw new IllegalArgumentException("E-mail do cliente é inválido.");
        }

        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.nomeCliente = nomeCliente;
        this.emailCliente = emailCliente.trim().toLowerCase();
        this.total = total.setScale(2, RoundingMode.HALF_UP);
        this.status = "CRIADO";
        this.ultimoEmailEnviado = "";
        this.textoTela = "";
    }

    void confirmarPagamento(BigDecimal valorPago) {
        if (!"CRIADO".equals(status)) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || valorPago.compareTo(total) < 0) {
            throw new IllegalArgumentException("Valor pago não cobre o total.");
        }

        status = "PAGO";
    }

    void enviarEmailConfirmacao() {
        if (!"PAGO".equals(status)) {
            throw new IllegalStateException("Somente pedido pago pode gerar e-mail de confirmação.");
        }

        ultimoEmailEnviado = "Para: " + emailCliente
                + " | Olá " + nomeCliente
                + ", seu pedido " + numero
                + " foi confirmado no valor de R$ " + total;
    }

    void gerarTextoParaTela() {
        textoTela = "Pedido #" + numero
                + " - Cliente: " + nomeCliente
                + " - Total: R$ " + total
                + " - Status: " + status;
    }

    String resumo() {
        return "Resumo técnico:"
                + "\nNúmero: " + numero
                + "\nCliente: " + nomeCliente
                + "\nE-mail: " + emailCliente
                + "\nTotal: R$ " + total
                + "\nStatus: " + status
                + "\nÚltimo e-mail: " + ultimoEmailEnviado
                + "\nTexto tela: " + textoTela;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula128.exemplo.ruim.PedidoBaixaCoesaoApp
```

---

## O que há de errado nesse exemplo

A classe `PedidoBaixaCoesao` mistura muitos assuntos:

```text
dados do pedido;
dados do cliente;
validação de e-mail;
regra de pagamento;
formatação monetária;
montagem de e-mail;
texto para tela;
estado de notificação.
```

Ela funciona.

Mas não é coesa.

Ela tem muitos motivos para mudar:

```text
mudou regra de pedido;
mudou regra de cliente;
mudou texto do e-mail;
mudou layout da tela;
mudou regra de pagamento;
mudou formatação de dinheiro.
```

Uma boa classe deve ter poucos motivos para mudar.

---

## Sintomas de baixa coesão

Observe alguns sintomas:

```text
a classe tem atributos de assuntos diferentes;
alguns métodos usam só uma parte dos atributos;
o nome da classe não representa tudo que ela faz;
a classe sabe detalhes de comunicação;
a classe sabe detalhes de apresentação;
a classe valida coisas que poderiam estar em objetos próprios;
a classe cresce sempre que aparece uma nova necessidade.
```

No exemplo, `PedidoBaixaCoesao` sabe demais.

O pedido deveria proteger regra de pedido.

Mas e-mail, texto de tela e validação de e-mail podem ser separados.

---

## Refatorando para classes mais coesas

Vamos criar uma versão melhor.

A ideia não é dividir por dividir.

A ideia é colocar responsabilidades em lugares melhores:

```text
Cliente: dados e regra básica de cliente;
Email: validação e normalização de e-mail;
Dinheiro: valor monetário;
Pedido: regra de pedido;
MensagemPedido: criação de mensagem de confirmação;
PedidoApp: montagem do cenário.
```

Cada classe passa a ter foco.

---

## Arquivo Email.java

Crie:

```text
src\br\com\curso\aula128\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula128.dominio.valor;

import java.util.Objects;

public final class Email {
    private final String valor;

    public Email(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    public String valor() {
        return valor;
    }

    public String dominio() {
        return valor.substring(valor.indexOf("@") + 1);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        Email email = (Email) outro;
        return Objects.equals(valor, email.valor);
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

Responsabilidade dessa classe:

```text
representar um e-mail válido.
```

Ela não confirma pedido, não envia mensagem e não calcula total.

Alta coesão.

---

## Arquivo Dinheiro.java

Crie:

```text
src\br\com\curso\aula128\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula128.dominio.valor;

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

Responsabilidade dessa classe:

```text
representar valor monetário.
```

Ela não sabe quem é o cliente.

Ela não sabe status do pedido.

Alta coesão.

---

## Arquivo Cliente.java

Crie:

```text
src\br\com\curso\aula128\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula128.dominio.cliente;

import br.com.curso.aula128.dominio.valor.Email;

public class Cliente {
    private final int id;
    private final String nome;
    private final Email email;
    private final boolean ativo;

    public Cliente(int id, String nome, Email email) {
        this(id, nome, email, true);
    }

    public Cliente(int id, String nome, Email email, boolean ativo) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id do cliente deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.ativo = ativo;
    }

    public int id() {
        return id;
    }

    public String nome() {
        return nome;
    }

    public Email email() {
        return email;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}
```

Responsabilidade da classe:

```text
representar o cliente no domínio.
```

Ela usa `Email`, mas não valida manualmente o formato do e-mail.

Essa responsabilidade ficou no objeto de valor `Email`.

---

## Arquivo StatusPedido.java

Crie:

```text
src\br\com\curso\aula128\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula128.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Responsabilidade:

```text
representar os status possíveis do pedido.
```

Simples e coeso.

---

## Arquivo Pedido.java

Crie:

```text
src\br\com\curso\aula128\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula128.dominio.pedido;

import br.com.curso.aula128.dominio.cliente.Cliente;
import br.com.curso.aula128.dominio.valor.Dinheiro;

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

Responsabilidade:

```text
proteger regra de pedido.
```

A classe sabe confirmar pagamento, cancelar e informar estado.

Ela não monta e-mail.

Ela não imprime tela.

Ela não salva no banco.

Ela ficou mais coesa.

---

## Arquivo MensagemPedido.java

Crie:

```text
src\br\com\curso\aula128\dominio\notificacao\MensagemPedido.java
```

Código:

```java
package br.com.curso.aula128.dominio.notificacao;

import br.com.curso.aula128.dominio.pedido.Pedido;

public class MensagemPedido {
    public String confirmacaoPagamento(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!pedido.pago()) {
            throw new IllegalStateException("Somente pedido pago pode gerar mensagem de confirmação.");
        }

        return "Para: " + pedido.cliente().email()
                + " | Olá " + pedido.cliente().nome()
                + ", seu pedido " + pedido.numero()
                + " foi confirmado no valor de " + pedido.total();
    }
}
```

Responsabilidade:

```text
montar mensagem relacionada ao pedido.
```

Ela não altera status do pedido.

Ela não valida pagamento.

Ela apenas cria o texto de notificação.

---

## Arquivo PedidoCoesoApp.java

Crie:

```text
src\br\com\curso\aula128\app\PedidoCoesoApp.java
```

Código:

```java
package br.com.curso.aula128.app;

import br.com.curso.aula128.dominio.cliente.Cliente;
import br.com.curso.aula128.dominio.notificacao.MensagemPedido;
import br.com.curso.aula128.dominio.pedido.Pedido;
import br.com.curso.aula128.dominio.valor.Dinheiro;
import br.com.curso.aula128.dominio.valor.Email;

public class PedidoCoesoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                10,
                "Ana Silva",
                new Email("ana@email.com")
        );

        Pedido pedido = new Pedido(
                1001,
                cliente,
                Dinheiro.de("399.80")
        );

        pedido.confirmarPagamento(Dinheiro.de("399.80"));

        MensagemPedido mensagemPedido = new MensagemPedido();

        System.out.println(pedido.resumo());
        System.out.println(mensagemPedido.confirmacaoPagamento(pedido));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula128.app.PedidoCoesoApp
```

---

## O que melhorou

Agora temos classes mais focadas:

```text
Email valida e representa e-mail.
Dinheiro representa valor monetário.
Cliente representa cliente.
Pedido protege regra de pedido.
StatusPedido representa estados possíveis.
MensagemPedido monta mensagem de confirmação.
PedidoCoesoApp monta o cenário.
```

Cada classe tem um motivo mais claro para existir.

Se o texto do e-mail mudar, alteramos:

```text
MensagemPedido
```

Se a regra de pagamento mudar, alteramos:

```text
Pedido
```

Se a regra de e-mail mudar, alteramos:

```text
Email
```

Se a regra monetária mudar, alteramos:

```text
Dinheiro
```

Isso é coesão melhor.

---

## Coesão e responsabilidade

Uma forma simples de avaliar coesão é tentar completar esta frase:

```text
Esta classe é responsável por...
```

Se você precisa usar "e" muitas vezes, suspeite.

Exemplo ruim:

```text
PedidoBaixaCoesao é responsável por representar pedido,
validar cliente,
calcular dinheiro,
montar e-mail
e montar texto de tela.
```

Exemplo melhor:

```text
Pedido é responsável por proteger o ciclo de vida do pedido.
```

```text
Email é responsável por representar um e-mail válido.
```

```text
Dinheiro é responsável por representar valor monetário.
```

Quanto mais clara a frase, maior a chance de boa coesão.

---

## Coesão e nome da classe

Nome genérico costuma esconder baixa coesão.

Cuidado com nomes como:

```text
SistemaUtils;
PedidoManager;
GeralService;
Helper;
Processador;
Manipulador;
Controle;
Operacoes;
Funcoes.
```

Esses nomes podem aparecer em sistemas reais, mas exigem atenção.

Pergunte:

```text
processador de quê?
helper de quê?
manager de qual responsabilidade?
utils por que não pertence a um objeto?
```

Prefira nomes de domínio:

```text
Pedido;
Cliente;
Dinheiro;
Email;
PeriodoAtendimento;
Contrato;
ServicoContratado;
MensagemPedido;
PoliticaCancelamento.
```

Nomes bons ajudam a manter coesão.

---

## Coesão e atributos

Uma classe coesa geralmente tem atributos que se relacionam.

Exemplo coeso:

```text
PeriodoAtendimento
- data
- turno
```

Esses dois campos pertencem ao mesmo conceito.

Exemplo menos coeso:

```text
Pedido
- numero
- total
- status
- htmlDaTela
- tokenDeApi
- smtpServidor
```

Os últimos campos não parecem pertencer à entidade Pedido.

Quando uma classe tem atributos de mundos diferentes, ela provavelmente está acumulando responsabilidades.

---

## Coesão e métodos

Observe os métodos.

Se cada método usa um grupo completamente diferente de atributos, talvez a classe tenha mais de uma responsabilidade.

Exemplo suspeito:

```text
gerarEmail() usa emailCliente e nomeCliente.
confirmarPagamento() usa status e total.
gerarHtml() usa textoTela.
salvarBanco() usa conexão.
```

Isso indica mistura de responsabilidades.

Em uma classe coesa, os métodos tendem a girar em torno do mesmo estado e do mesmo conceito.

---

## Exemplo 2 — Contrato com baixa coesão

Agora vamos aplicar em contrato.

Crie:

```text
src\br\com\curso\aula128\exemplo\ruim\ContratoBaixaCoesaoApp.java
```

Código:

```java
package br.com.curso.aula128.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class ContratoBaixaCoesaoApp {
    public static void main(String[] args) {
        ContratoBaixaCoesao contrato = new ContratoBaixaCoesao(
                "CONT-001",
                "Cliente Corporativo A",
                "Instalação",
                new BigDecimal("150.00"),
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        contrato.ativar();
        contrato.gerarMensagemComercial();
        contrato.calcularValorTotal();

        System.out.println(contrato.resumo());
    }
}

class ContratoBaixaCoesao {
    private final String codigo;
    private final String cliente;
    private final String servico;
    private final BigDecimal valorMensal;
    private final LocalDate inicio;
    private final LocalDate fim;
    private String status;
    private BigDecimal valorTotal;
    private String mensagemComercial;

    ContratoBaixaCoesao(
            String codigo,
            String cliente,
            String servico,
            BigDecimal valorMensal,
            LocalDate inicio,
            LocalDate fim
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (servico == null || servico.isBlank()) {
            throw new IllegalArgumentException("Serviço é obrigatório.");
        }

        if (valorMensal == null || valorMensal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor mensal deve ser positivo.");
        }

        if (inicio == null || fim == null || fim.isBefore(inicio)) {
            throw new IllegalArgumentException("Período inválido.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.servico = servico;
        this.valorMensal = valorMensal.setScale(2, RoundingMode.HALF_UP);
        this.inicio = inicio;
        this.fim = fim;
        this.status = "RASCUNHO";
        this.valorTotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        this.mensagemComercial = "";
    }

    void ativar() {
        status = "ATIVO";
    }

    void calcularValorTotal() {
        long meses = ChronoUnit.MONTHS.between(inicio, fim.plusDays(1));

        if (meses <= 0) {
            meses = 1;
        }

        valorTotal = valorMensal.multiply(BigDecimal.valueOf(meses));
    }

    void gerarMensagemComercial() {
        mensagemComercial = "Contrato " + codigo
                + " do cliente " + cliente
                + " para o serviço " + servico
                + " está com status " + status;
    }

    String resumo() {
        return "Contrato: " + codigo
                + " | Cliente: " + cliente
                + " | Serviço: " + servico
                + " | Mensal: R$ " + valorMensal
                + " | Total: R$ " + valorTotal
                + " | Status: " + status
                + " | Mensagem: " + mensagemComercial;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula128.exemplo.ruim.ContratoBaixaCoesaoApp
```

---

## Problemas do contrato ruim

`ContratoBaixaCoesao` mistura:

```text
contrato;
cliente;
serviço;
dinheiro;
período;
cálculo de meses;
mensagem comercial;
status em String.
```

A classe funciona, mas está fazendo coisa demais.

Vamos separar.

---

## Arquivo StatusContrato.java

Crie:

```text
src\br\com\curso\aula128\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula128.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

---

## Arquivo PeriodoContrato.java

Crie:

```text
src\br\com\curso\aula128\dominio\contrato\PeriodoContrato.java
```

Código:

```java
package br.com.curso.aula128.dominio.contrato;

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

Responsabilidade:

```text
representar e validar período do contrato.
```

O cálculo de meses faz sentido aqui porque depende diretamente do período.

---

## Arquivo ServicoContratado.java

Crie:

```text
src\br\com\curso\aula128\dominio\servico\ServicoContratado.java
```

Código:

```java
package br.com.curso.aula128.dominio.servico;

import br.com.curso.aula128.dominio.valor.Dinheiro;

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

    public String nome() {
        return nome;
    }

    public Dinheiro valorMensal() {
        return valorMensal;
    }

    public String resumo() {
        return nome + " | Valor mensal: " + valorMensal;
    }
}
```

Responsabilidade:

```text
representar o serviço contratado.
```

---

## Arquivo Contrato.java

Crie:

```text
src\br\com\curso\aula128\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula128.dominio.contrato;

import br.com.curso.aula128.dominio.cliente.Cliente;
import br.com.curso.aula128.dominio.servico.ServicoContratado;
import br.com.curso.aula128.dominio.valor.Dinheiro;

public class Contrato {
    private final String codigo;
    private final Cliente cliente;
    private final ServicoContratado servico;
    private final PeriodoContrato periodo;
    private StatusContrato status;
    private String motivoCancelamento;

    public Contrato(
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
                + " | Total: " + valorTotal()
                + " | Status: " + status
                + " | Motivo cancelamento: " + motivoCancelamento;
    }
}
```

Responsabilidade:

```text
proteger o ciclo de vida do contrato.
```

Ele não valida formato de dinheiro.

Ele não calcula meses internamente.

Ele não monta mensagem comercial.

Ele coordena objetos coesos do domínio.

---

## Arquivo ContratoCoesoApp.java

Crie:

```text
src\br\com\curso\aula128\app\ContratoCoesoApp.java
```

Código:

```java
package br.com.curso.aula128.app;

import br.com.curso.aula128.dominio.cliente.Cliente;
import br.com.curso.aula128.dominio.contrato.Contrato;
import br.com.curso.aula128.dominio.contrato.PeriodoContrato;
import br.com.curso.aula128.dominio.servico.ServicoContratado;
import br.com.curso.aula128.dominio.valor.Dinheiro;
import br.com.curso.aula128.dominio.valor.Email;

import java.time.LocalDate;

public class ContratoCoesoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                20,
                "Cliente Corporativo A",
                new Email("contratos@cliente.com")
        );

        ServicoContratado servico = new ServicoContratado(
                "Instalação",
                Dinheiro.de("150.00")
        );

        PeriodoContrato periodo = new PeriodoContrato(
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        Contrato contrato = new Contrato(
                "CONT-001",
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
java -cp out br.com.curso.aula128.app.ContratoCoesoApp
```

---

## O que melhorou no contrato

Agora cada parte tem foco:

```text
PeriodoContrato valida período e calcula meses.
ServicoContratado representa serviço e valor mensal.
Dinheiro representa dinheiro.
Cliente representa cliente.
Contrato protege ativação, cancelamento e valor total.
```

Se a regra de período mudar, mexemos em `PeriodoContrato`.

Se a regra de serviço mudar, mexemos em `ServicoContratado`.

Se a regra de contrato mudar, mexemos em `Contrato`.

Isso é mais fácil de manter.

---

## Coesão e divisão exagerada

Cuidado: coesão não significa criar uma classe para cada linha de código.

Exagero ruim:

```text
ValidadorNomeCliente;
ValidadorIdCliente;
FormatadorNomeCliente;
CriadorTextoCliente;
LeitorStatusCliente;
RegraBooleanAtivoCliente.
```

Isso pode virar fragmentação.

Fragmentação acontece quando o código é dividido demais e o entendimento fica pior.

A pergunta não é:

```text
posso separar?
```

A pergunta é:

```text
separar melhora clareza, reuso, teste ou manutenção?
```

Se não melhora, talvez não precise separar.

---

## Coesão e domínio

Em domínio, classes coesas costumam representar conceitos reais.

Exemplos:

```text
Email;
Dinheiro;
PeriodoContrato;
ServicoContratado;
Pedido;
Contrato;
OrdemServico;
Cliente;
Pagamento.
```

Essas classes têm significado.

Já classes como:

```text
Coisas;
Dados;
Info;
Helper;
Manager;
Utils;
OperacoesGerais.
```

podem indicar falta de modelagem.

Não é proibido usar nomes técnicos, mas cuidado para não esconder regra de domínio em classes genéricas.

---

## Coesão e métodos privados

Métodos privados também precisam ser coesos.

Exemplo bom em `Pedido`:

```java
private void validarPodeCancelar(String motivo)
```

Esse método ajuda a operação de cancelamento do próprio pedido.

Exemplo suspeito em `Pedido`:

```java
private void conectarNoBanco()
```

Conexão com banco não parece ser responsabilidade da entidade `Pedido`.

Mesmo método privado pode denunciar baixa coesão.

---

## Coesão e pacotes

Pacotes também podem ter coesão.

Um pacote chamado:

```text
dominio.pedido
```

deveria conter classes relacionadas a pedido.

Se ele contém:

```text
Pedido;
StatusPedido;
ItemPedido;
CodigoPedido;
CalculadoraTotalPedido.
```

faz sentido.

Mas se contém:

```text
Pedido;
EmailSmtp;
ConexaoOracle;
TelaLogin;
RelatorioExcel;
```

o pacote tem baixa coesão.

A organização em pacotes deve reforçar a organização conceitual.

---

## Sinais de que uma classe precisa ser dividida

Desconfie quando:

```text
a classe passa de um assunto para outro;
o nome não explica tudo que ela faz;
há muitos atributos sem relação;
há muitos imports de camadas diferentes;
cada método mexe em um grupo diferente de campos;
uma alteração pequena exige mexer em várias áreas da classe;
a classe tem muitos comentários separando blocos de assuntos;
a classe vira lugar padrão para qualquer nova regra.
```

Comentários como estes podem indicar baixa coesão:

```java
// regras de pagamento
// regras de e-mail
// regras de banco
// regras de tela
// regras de contrato
```

Às vezes o comentário está dizendo:

```text
isso talvez mereça outra classe.
```

---

## Sinais de que você dividiu demais

Também desconfie quando:

```text
existem muitas classes com uma linha útil;
é difícil descobrir onde está a regra;
toda alteração exige abrir 10 arquivos;
as classes não têm significado de domínio;
os nomes ficam artificiais;
a separação não melhora teste nem leitura;
há repasse excessivo de chamada entre classes.
```

Boa coesão está no equilíbrio.

Não é classe gigante.

Não é microclasse sem sentido.

É responsabilidade clara.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido ruim

Execute:

```text
PedidoBaixaCoesaoApp.java
```

Liste as responsabilidades misturadas em `PedidoBaixaCoesao`.

### Parte 2 — Pedido coeso

Execute:

```text
PedidoCoesoApp.java
```

Explique a responsabilidade de cada classe:

```text
Email;
Dinheiro;
Cliente;
Pedido;
MensagemPedido.
```

### Parte 3 — Contrato ruim

Execute:

```text
ContratoBaixaCoesaoApp.java
```

Liste os assuntos misturados em `ContratoBaixaCoesao`.

### Parte 4 — Contrato coeso

Execute:

```text
ContratoCoesoApp.java
```

Explique a responsabilidade de cada classe:

```text
PeriodoContrato;
ServicoContratado;
Contrato;
Dinheiro;
Cliente.
```

### Parte 5 — Comparação

Compare:

```text
classe ruim;
classe coesa.
```

Responda:

```text
qual é mais fácil de alterar?
qual é mais fácil de testar?
qual é mais fácil de explicar?
qual tem menos motivos para mudar?
```

---

## Desafio prático

Crie um domínio de Ordem de Serviço com foco em coesão.

Estrutura sugerida:

```text
src\br\com\curso\aula128\appos
src\br\com\curso\aula128\dominio\ordemservico
src\br\com\curso\aula128\dominio\tecnico
```

Arquivos sugeridos:

```text
appos\OrdemServicoCoesaoApp.java

dominio\ordemservico\OrdemServico.java
dominio\ordemservico\CodigoOs.java
dominio\ordemservico\PeriodoAtendimento.java
dominio\ordemservico\StatusOs.java
dominio\ordemservico\TurnoAtendimento.java
dominio\ordemservico\MensagemOs.java

dominio\tecnico\Tecnico.java
```

Regras:

```text
CodigoOs representa e valida código iniciado com OS-.
PeriodoAtendimento representa data e turno.
Tecnico representa técnico com id, nome e ativo.
OrdemServico representa ciclo de vida da OS.
MensagemOs monta mensagens relacionadas à OS.
StatusOs controla AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA.
```

Métodos esperados em `OrdemServico`:

```text
reagendar(PeriodoAtendimento novoPeriodo);
atribuirTecnico(Tecnico tecnico);
concluir();
cancelar(String motivo);
resumo();
```

Cuidados:

```text
OrdemServico não deve validar manualmente formato do código.
OrdemServico não deve montar mensagem completa de notificação.
OrdemServico não deve fazer regra do técnico além de verificar se está ativo.
MensagemOs não deve alterar status da OS.
Tecnico não deve saber reagendar OS.
PeriodoAtendimento não deve saber concluir OS.
```

Critério principal:

```text
cada classe deve ter uma responsabilidade clara.
```

---

## Erros comuns

### 1. Criar classe que faz tudo

Classe grande e cheia de assuntos diferentes perde coesão.

### 2. Criar Utils para fugir da modelagem

Nem toda função precisa ir para `Utils`.

### 3. Colocar regra de apresentação na entidade

Entidade não deve montar HTML, PDF ou texto de tela complexo.

### 4. Colocar infraestrutura no domínio

Entidade não deve abrir conexão, salvar banco ou chamar API externa.

### 5. Dividir demais sem necessidade

Separar só por separar também prejudica leitura.

### 6. Usar nomes genéricos

Nomes como `Manager`, `Helper` e `Geral` exigem atenção.

### 7. Deixar status como String

Use `enum` para estados controlados.

### 8. Usar double para dinheiro

Use `BigDecimal` ou objeto de valor como `Dinheiro`.

---

## Debug recomendado

Use debug em:

```text
PedidoBaixaCoesaoApp.java
PedidoCoesoApp.java
ContratoBaixaCoesaoApp.java
ContratoCoesoApp.java
```

Breakpoints recomendados:

```java
pedido.confirmarPagamento(...)
pedido.enviarEmailConfirmacao()
pedido.gerarTextoParaTela()

new Email(...)
new Dinheiro(...)
pedido.confirmarPagamento(...)
mensagemPedido.confirmacaoPagamento(...)

contrato.calcularValorTotal()
contrato.gerarMensagemComercial()

new PeriodoContrato(...)
contrato.valorTotal()
contrato.ativar()
```

Observe:

```text
na versão ruim, uma classe concentra muitos assuntos;
na versão coesa, o fluxo passa por objetos com responsabilidades claras;
cada objeto valida aquilo que pertence a ele;
a entidade coordena o ciclo de vida dela;
objetos de valor protegem valores específicos.
```

O objetivo do debug é perceber onde cada regra vive.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é coesão em uma classe?
2. Qual sinal mostra que uma classe está fazendo coisa demais?
3. Qual classe você criaria para melhorar a coesão de uma OS?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar coesão;
identificar baixa coesão;
identificar alta coesão;
separar responsabilidades com critério;
evitar classe Deus;
evitar Utils genérica;
manter entidade focada no ciclo de vida;
manter objeto de valor focado no valor;
usar enum para estado controlado;
usar BigDecimal para dinheiro;
organizar classes coesas em pacotes;
evitar divisão exagerada;
resolver o desafio de Ordem de Serviço;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-128-coesao-em-classes
git commit -m "Aula 128: pratica coesao em classes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
uma classe coesa tem uma responsabilidade clara e mantém juntos dados e comportamentos que pertencem ao mesmo conceito.
```

Você viu que uma classe pode funcionar e ainda assim estar mal desenhada.

Também viu que melhorar coesão não significa dividir tudo sem critério. Significa colocar cada responsabilidade no lugar certo.

Na próxima aula, vamos estudar acoplamento entre classes.

Vamos entender como classes dependem umas das outras, quando essa dependência é saudável e quando ela começa a travar a evolução do sistema.
