# 129 — M4.25 — Acoplamento entre classes

## Objetivo da aula

Nesta aula você vai aprender acoplamento entre classes.

Na aula anterior, você estudou coesão: manter uma classe focada em uma responsabilidade clara. Agora vamos estudar outro conceito fundamental de design orientado a objetos:

```text
como uma classe depende de outra.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é acoplamento;
identificar acoplamento saudável;
identificar acoplamento perigoso;
entender por que dependências escondidas atrapalham manutenção;
entender por que new dentro de regra de domínio pode acoplar demais;
entender por que static global aumenta acoplamento;
separar domínio de notificação, infraestrutura e aplicação;
modelar dependências explícitas;
evitar que entidades conheçam detalhes externos;
entender a relação entre coesão e acoplamento;
aplicar acoplamento com critério em Java backend.
```

Essa aula é essencial para backend porque sistemas reais são formados por muitas classes colaborando.

O problema não é uma classe depender de outra.

O problema é depender do jeito errado.

---

## A ideia central

Acoplamento é o grau de dependência entre classes.

Quando uma classe usa outra, existe acoplamento.

Exemplo:

```java
Pedido pedido = new Pedido(cliente, total);
```

`Pedido` depende de:

```text
Cliente;
Dinheiro.
```

Isso não é necessariamente ruim.

Um pedido realmente precisa de cliente e total.

Esse é um acoplamento natural do domínio.

O problema aparece quando uma classe passa a depender de detalhes que não deveriam ser responsabilidade dela.

Exemplo suspeito:

```java
Pedido confirma pagamento;
Pedido monta e-mail;
Pedido envia e-mail SMTP;
Pedido salva log;
Pedido chama API externa;
Pedido grava arquivo.
```

A entidade `Pedido` começa a conhecer coisas demais.

Isso aumenta acoplamento.

---

## Acoplamento não é sempre ruim

É importante entender:

```text
acoplamento é inevitável.
```

Se nenhuma classe pudesse depender de outra, não existiria sistema.

O objetivo não é eliminar todo acoplamento.

O objetivo é controlar o acoplamento.

Queremos dependências:

```text
claras;
necessárias;
estáveis;
coerentes com o domínio;
fáceis de substituir quando necessário;
sem detalhes escondidos.
```

Acoplamento ruim é aquele que prende uma classe a detalhes que não pertencem a ela.

---

## Coesão e acoplamento trabalham juntos

Na aula anterior:

```text
coesão = o quanto uma classe tem responsabilidade clara.
```

Agora:

```text
acoplamento = o quanto uma classe depende de outras.
```

Os dois conceitos se conectam.

Classe com baixa coesão geralmente cria acoplamento ruim.

Exemplo:

```text
Pedido que envia e-mail;
Pedido que salva no banco;
Pedido que gera PDF;
Pedido que chama API externa.
```

Além de pouco coesa, ela fica acoplada a:

```text
e-mail;
banco;
PDF;
API externa.
```

Melhorar coesão geralmente reduz acoplamento indevido.

---

## Tipos de dependência que aparecem no código

Uma classe pode depender de outra de várias formas.

### 1. Atributo

```java
private Cliente cliente;
```

### 2. Parâmetro de construtor

```java
Pedido(Cliente cliente) {
}
```

### 3. Parâmetro de método

```java
void confirmarPagamento(Dinheiro valorPago) {
}
```

### 4. Criação direta

```java
MensagemPedido mensagem = new MensagemPedido();
```

### 5. Chamada static

```java
EmailUtils.validar(email);
```

### 6. Herança

```java
class Cliente extends Pessoa {
}
```

Ainda vamos estudar herança depois.

Nesta aula, o foco será nas dependências mais comuns:

```text
atributos;
parâmetros;
new;
static;
pacotes.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-129-acoplamento-entre-classes
cd labs\m4\aula-129-acoplamento-entre-classes
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula129
mkdir src\br\com\curso\aula129\app
mkdir src\br\com\curso\aula129\exemplo
mkdir src\br\com\curso\aula129\exemplo\ruim
mkdir src\br\com\curso\aula129\dominio
mkdir src\br\com\curso\aula129\dominio\cliente
mkdir src\br\com\curso\aula129\dominio\pedido
mkdir src\br\com\curso\aula129\dominio\valor
mkdir src\br\com\curso\aula129\dominio\notificacao
mkdir src\br\com\curso\aula129\infra
mkdir src\br\com\curso\aula129\infra\email
```

Nesta aula, vamos comparar:

```text
um pedido acoplado a envio de e-mail;
um pedido mais desacoplado;
dependência escondida;
dependência explícita.
```

---

## Exemplo 1 — Acoplamento ruim dentro da entidade

Vamos criar um exemplo que funciona, mas tem um problema de design.

Crie:

```text
src\br\com\curso\aula129\exemplo\ruim\PedidoAcopladoApp.java
```

Código:

```java
package br.com.curso.aula129.exemplo.ruim;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoAcopladoApp {
    public static void main(String[] args) {
        PedidoAcoplado pedido = new PedidoAcoplado(
                1001,
                "Ana Silva",
                "ana@email.com",
                new BigDecimal("399.80")
        );

        pedido.confirmarPagamento(new BigDecimal("399.80"));

        System.out.println(pedido.resumo());
    }
}

class PedidoAcoplado {
    private final int numero;
    private final String nomeCliente;
    private final String emailCliente;
    private final BigDecimal total;
    private StatusPedidoAcoplado status;

    PedidoAcoplado(int numero, String nomeCliente, String emailCliente, BigDecimal total) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (nomeCliente == null || nomeCliente.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        if (emailCliente == null || emailCliente.isBlank() || !emailCliente.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        this.numero = numero;
        this.nomeCliente = nomeCliente;
        this.emailCliente = emailCliente.trim().toLowerCase();
        this.total = total.setScale(2, RoundingMode.HALF_UP);
        this.status = StatusPedidoAcoplado.CRIADO;
    }

    void confirmarPagamento(BigDecimal valorPago) {
        if (status != StatusPedidoAcoplado.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || valorPago.compareTo(total) < 0) {
            throw new IllegalArgumentException("Valor pago não cobre o total.");
        }

        status = StatusPedidoAcoplado.PAGO;

        EnviadorEmailAcoplado enviador = new EnviadorEmailAcoplado();
        enviador.enviar(
                emailCliente,
                "Pedido confirmado",
                "Olá " + nomeCliente + ", seu pedido " + numero + " foi confirmado."
        );
    }

    String resumo() {
        return "Pedido " + numero
                + " | Cliente: " + nomeCliente
                + " | Total: R$ " + total
                + " | Status: " + status;
    }
}

enum StatusPedidoAcoplado {
    CRIADO,
    PAGO,
    CANCELADO
}

class EnviadorEmailAcoplado {
    void enviar(String destino, String assunto, String corpo) {
        System.out.println("Simulando envio de e-mail");
        System.out.println("Destino: " + destino);
        System.out.println("Assunto: " + assunto);
        System.out.println("Corpo: " + corpo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula129.exemplo.ruim.PedidoAcopladoApp
```

---

## O problema do exemplo

O código funciona.

Mas a entidade `PedidoAcoplado` está acoplada a:

```text
formato de e-mail;
classe EnviadorEmailAcoplado;
momento de envio;
texto da mensagem;
detalhe de comunicação.
```

O método:

```java
confirmarPagamento(...)
```

deveria cuidar da regra do pedido.

Mas ele também cria:

```java
new EnviadorEmailAcoplado()
```

Isso é um acoplamento perigoso.

Se amanhã a notificação mudar de e-mail para WhatsApp, você mexe no pedido.

Se o texto mudar, você mexe no pedido.

Se o envio falhar, a confirmação do pagamento pode ser afetada.

A entidade passou a conhecer detalhes externos.

---

## Sintomas de acoplamento ruim

Alguns sinais:

```text
classe de domínio cria classe de infraestrutura com new;
entidade conhece e-mail, banco, arquivo, HTTP ou API externa;
método de domínio chama serviço externo diretamente;
classe depende de static global;
detalhes de apresentação aparecem no domínio;
mudança em canal externo obriga mexer no domínio;
testar regra simples exige configurar coisas externas.
```

No exemplo ruim:

```java
PedidoAcoplado
```

depende diretamente de:

```java
EnviadorEmailAcoplado
```

Essa dependência não deveria estar dentro da entidade.

---

## Dependência escondida

Outro problema é que a dependência está escondida.

Quem lê:

```java
pedido.confirmarPagamento(valor);
```

não percebe imediatamente que isso também envia e-mail.

O método parece apenas confirmar pagamento.

Mas por dentro ele faz mais.

Dependência escondida dificulta:

```text
debug;
teste;
manutenção;
evolução;
leitura do fluxo.
```

Uma boa modelagem tenta deixar dependências importantes explícitas.

---

## Separando domínio de notificação

Vamos refatorar.

A ideia será:

```text
Pedido confirma pagamento.
MensagemPedido monta a mensagem.
EnviadorEmailConsole simula envio.
App coordena o fluxo.
```

Isso não significa que o app sempre coordenará tudo em sistema real. Mais adiante, teremos camada de aplicação para isso.

Por enquanto, o objetivo é entender:

```text
domínio não deve depender diretamente de infraestrutura.
```

---

## Arquivo Email.java

Crie:

```text
src\br\com\curso\aula129\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula129.dominio.valor;

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

`Email` representa e valida e-mail.

A classe de pedido não precisa saber como validar string de e-mail.

---

## Arquivo Dinheiro.java

Crie:

```text
src\br\com\curso\aula129\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula129.dominio.valor;

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

`Dinheiro` representa valor monetário.

`Pedido` depender de `Dinheiro` é natural.

---

## Arquivo Cliente.java

Crie:

```text
src\br\com\curso\aula129\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula129.dominio.cliente;

import br.com.curso.aula129.dominio.valor.Email;

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

`Cliente` depende de `Email`.

Esse é um acoplamento saudável, porque e-mail faz parte do conceito de cliente neste exemplo.

---

## Arquivo StatusPedido.java

Crie:

```text
src\br\com\curso\aula129\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula129.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## Arquivo Pedido.java

Crie:

```text
src\br\com\curso\aula129\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula129.dominio.pedido;

import br.com.curso.aula129.dominio.cliente.Cliente;
import br.com.curso.aula129.dominio.valor.Dinheiro;

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

Observe o que saiu do pedido:

```text
envio de e-mail;
texto de e-mail;
classe de infraestrutura;
new de enviador.
```

Agora o pedido protege apenas a regra do pedido.

---

## Arquivo MensagemPedido.java

Crie:

```text
src\br\com\curso\aula129\dominio\notificacao\MensagemPedido.java
```

Código:

```java
package br.com.curso.aula129.dominio.notificacao;

import br.com.curso.aula129.dominio.pedido.Pedido;

public class MensagemPedido {
    public String confirmacaoPagamento(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!pedido.pago()) {
            throw new IllegalStateException("Somente pedido pago pode gerar mensagem de confirmação.");
        }

        return "Olá " + pedido.cliente().nome()
                + ", seu pedido " + pedido.numero()
                + " foi confirmado no valor de " + pedido.total() + ".";
    }

    public String cancelamento(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (!pedido.cancelado()) {
            throw new IllegalStateException("Somente pedido cancelado pode gerar mensagem de cancelamento.");
        }

        return "Olá " + pedido.cliente().nome()
                + ", seu pedido " + pedido.numero()
                + " foi cancelado.";
    }
}
```

Essa classe depende de `Pedido`.

Isso faz sentido porque ela monta mensagens a partir de dados do pedido.

Mas `Pedido` não depende dela.

Isso é uma direção de dependência mais saudável.

---

## Arquivo EnviadorEmailConsole.java

Crie:

```text
src\br\com\curso\aula129\infra\email\EnviadorEmailConsole.java
```

Código:

```java
package br.com.curso.aula129.infra.email;

import br.com.curso.aula129.dominio.valor.Email;

public class EnviadorEmailConsole {
    public void enviar(Email destino, String assunto, String corpo) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (assunto == null || assunto.isBlank()) {
            throw new IllegalArgumentException("Assunto é obrigatório.");
        }

        if (corpo == null || corpo.isBlank()) {
            throw new IllegalArgumentException("Corpo é obrigatório.");
        }

        System.out.println("Simulando envio de e-mail");
        System.out.println("Destino: " + destino);
        System.out.println("Assunto: " + assunto);
        System.out.println("Corpo: " + corpo);
    }
}
```

Aqui temos uma classe de infraestrutura simulada.

Ela cuida do envio.

O domínio não precisa conhecê-la.

---

## Arquivo PedidoDesacopladoApp.java

Crie:

```text
src\br\com\curso\aula129\app\PedidoDesacopladoApp.java
```

Código:

```java
package br.com.curso.aula129.app;

import br.com.curso.aula129.dominio.cliente.Cliente;
import br.com.curso.aula129.dominio.notificacao.MensagemPedido;
import br.com.curso.aula129.dominio.pedido.Pedido;
import br.com.curso.aula129.dominio.valor.Dinheiro;
import br.com.curso.aula129.dominio.valor.Email;
import br.com.curso.aula129.infra.email.EnviadorEmailConsole;

public class PedidoDesacopladoApp {
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
        String corpo = mensagemPedido.confirmacaoPagamento(pedido);

        EnviadorEmailConsole enviador = new EnviadorEmailConsole();
        enviador.enviar(
                cliente.email(),
                "Pedido confirmado",
                corpo
        );

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula129.app.PedidoDesacopladoApp
```

---

## O que melhorou

Agora:

```text
Pedido confirma pagamento.
MensagemPedido monta o texto.
EnviadorEmailConsole envia.
App coordena o exemplo.
```

A entidade `Pedido` não conhece:

```text
EnviadorEmailConsole;
assunto de e-mail;
simulação de envio;
console;
infraestrutura.
```

Se amanhã mudar o canal de notificação, a regra de pagamento do pedido não precisa mudar.

Isso reduz acoplamento indevido.

---

## Acoplamento saudável

Nem toda dependência é ruim.

No exemplo bom, `Pedido` depende de:

```text
Cliente;
Dinheiro;
StatusPedido.
```

Essas dependências são naturais.

Um pedido precisa conhecer seu cliente e total.

Um total monetário deve ser representado por `Dinheiro`.

O status deve ser um `enum`.

Esse é acoplamento de domínio.

Ele é esperado.

O problema seria `Pedido` depender de:

```text
EnviadorEmailConsole;
BancoDeDados;
ArquivoCsv;
HttpClient;
TelaHtml;
Controller.
```

Essas dependências são detalhes externos ao ciclo de vida do pedido.

---

## Direção da dependência

Uma pergunta importante é:

```text
quem deve depender de quem?
```

No exemplo bom:

```text
app depende de domínio;
app depende de infraestrutura;
notificação depende de pedido;
infraestrutura usa Email;
pedido não depende de app;
pedido não depende de infraestrutura.
```

Isso é melhor do que:

```text
domínio dependendo de infraestrutura.
```

Em backend, essa direção será cada vez mais importante.

Mais adiante, vamos estudar camadas e arquitetura.

Por enquanto, guarde:

```text
o domínio deve ser mais estável e menos dependente de detalhes externos.
```

---

## Exemplo 2 — Acoplamento por static global

Agora veja outro tipo de acoplamento perigoso.

Crie:

```text
src\br\com\curso\aula129\exemplo\ruim\AcoplamentoStaticGlobalApp.java
```

Código:

```java
package br.com.curso.aula129.exemplo.ruim;

public class AcoplamentoStaticGlobalApp {
    public static void main(String[] args) {
        SessaoGlobal.usuarioAtual = "ana";

        ContratoAcopladoStatic contrato = new ContratoAcopladoStatic("CONT-001");
        contrato.ativar();

        SessaoGlobal.usuarioAtual = "carlos";
        contrato.cancelar("Cliente solicitou cancelamento");

        System.out.println(contrato.resumo());
    }
}

class SessaoGlobal {
    static String usuarioAtual;
}

class ContratoAcopladoStatic {
    private final String codigo;
    private String status;
    private String ativadoPor;
    private String canceladoPor;
    private String motivoCancelamento;

    ContratoAcopladoStatic(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        this.codigo = codigo;
        this.status = "RASCUNHO";
        this.ativadoPor = "";
        this.canceladoPor = "";
        this.motivoCancelamento = "";
    }

    void ativar() {
        if (!"RASCUNHO".equals(status)) {
            throw new IllegalStateException("Somente rascunho pode ser ativado.");
        }

        status = "ATIVO";
        ativadoPor = SessaoGlobal.usuarioAtual;
    }

    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        status = "CANCELADO";
        canceladoPor = SessaoGlobal.usuarioAtual;
        motivoCancelamento = motivo;
    }

    String resumo() {
        return "Contrato " + codigo
                + " | Status: " + status
                + " | Ativado por: " + ativadoPor
                + " | Cancelado por: " + canceladoPor
                + " | Motivo: " + motivoCancelamento;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula129.exemplo.ruim.AcoplamentoStaticGlobalApp
```

---

## Problema do static global

`ContratoAcopladoStatic` depende de:

```java
SessaoGlobal.usuarioAtual
```

Essa dependência está escondida.

Quem chama:

```java
contrato.ativar();
```

não vê que o método depende de um usuário global.

Isso cria problemas:

```text
testes frágeis;
ordem de execução interfere no resultado;
estado fica espalhado;
debug fica confuso;
um usuário pode afetar outro em sistema real;
a classe fica presa a uma variável global.
```

Esse é acoplamento ruim.

---

## Dependência explícita é melhor

Vamos criar uma versão melhor.

Crie:

```text
src\br\com\curso\aula129\dominio\contrato\StatusContrato.java
```

Código:

```java
package br.com.curso.aula129.dominio.contrato;

public enum StatusContrato {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Crie:

```text
src\br\com\curso\aula129\dominio\contrato\UsuarioOperador.java
```

Código:

```java
package br.com.curso.aula129.dominio.contrato;

public class UsuarioOperador {
    private final String login;

    public UsuarioOperador(String login) {
        if (login == null || login.isBlank()) {
            throw new IllegalArgumentException("Login é obrigatório.");
        }

        this.login = login;
    }

    public String login() {
        return login;
    }

    @Override
    public String toString() {
        return login;
    }
}
```

Crie:

```text
src\br\com\curso\aula129\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula129.dominio.contrato;

public class Contrato {
    private final String codigo;
    private StatusContrato status;
    private String ativadoPor;
    private String canceladoPor;
    private String motivoCancelamento;

    public Contrato(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("CONT-")) {
            throw new IllegalArgumentException("Código deve iniciar com CONT-.");
        }

        this.codigo = codigo;
        this.status = StatusContrato.RASCUNHO;
        this.ativadoPor = "";
        this.canceladoPor = "";
        this.motivoCancelamento = "";
    }

    public boolean rascunho() {
        return status == StatusContrato.RASCUNHO;
    }

    public boolean cancelado() {
        return status == StatusContrato.CANCELADO;
    }

    public void ativar(UsuarioOperador usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (!rascunho()) {
            throw new IllegalStateException("Somente contrato em rascunho pode ser ativado.");
        }

        status = StatusContrato.ATIVO;
        ativadoPor = usuario.login();
    }

    public void cancelar(String motivo, UsuarioOperador usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (cancelado()) {
            throw new IllegalStateException("Contrato já está cancelado.");
        }

        status = StatusContrato.CANCELADO;
        canceladoPor = usuario.login();
        motivoCancelamento = motivo;
    }

    public String resumo() {
        return "Contrato " + codigo
                + " | Status: " + status
                + " | Ativado por: " + ativadoPor
                + " | Cancelado por: " + canceladoPor
                + " | Motivo: " + motivoCancelamento;
    }
}
```

Crie:

```text
src\br\com\curso\aula129\app\ContratoDesacopladoApp.java
```

Código:

```java
package br.com.curso.aula129.app;

import br.com.curso.aula129.dominio.contrato.Contrato;
import br.com.curso.aula129.dominio.contrato.UsuarioOperador;

public class ContratoDesacopladoApp {
    public static void main(String[] args) {
        UsuarioOperador ana = new UsuarioOperador("ana");
        UsuarioOperador carlos = new UsuarioOperador("carlos");

        Contrato contrato = new Contrato("CONT-001");

        contrato.ativar(ana);
        contrato.cancelar("Cliente solicitou cancelamento", carlos);

        System.out.println(contrato.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula129.app.ContratoDesacopladoApp
```

---

## O que melhorou no contrato

Antes:

```java
contrato.ativar();
```

parecia simples, mas dependia de:

```java
SessaoGlobal.usuarioAtual
```

Agora:

```java
contrato.ativar(ana);
contrato.cancelar("Cliente solicitou cancelamento", carlos);
```

A dependência está explícita.

O método mostra que precisa de um usuário.

Isso melhora:

```text
leitura;
teste;
debug;
previsibilidade;
manutenção.
```

Acoplamento ainda existe.

`Contrato` depende de `UsuarioOperador`.

Mas é uma dependência explícita e de domínio, não um estado global escondido.

---

## Acoplamento por new

Usar `new` não é proibido.

Você usa `new` para criar objetos o tempo todo.

O problema é onde e para quê.

Exemplo natural:

```java
Cliente cliente = new Cliente(...);
Pedido pedido = new Pedido(...);
```

Isso geralmente acontece na aplicação, teste ou montagem do cenário.

Exemplo mais suspeito:

```java
public void confirmarPagamento(Dinheiro valorPago) {
    status = StatusPedido.PAGO;
    EnviadorEmailConsole enviador = new EnviadorEmailConsole();
    enviador.enviar(...);
}
```

O `new` dentro da entidade cria acoplamento com infraestrutura.

Regra prática:

```text
new de objeto de domínio dentro do domínio pode ser natural;
new de infraestrutura dentro do domínio é sinal de alerta.
```

---

## Acoplamento por static

Chamadas static podem ser úteis.

Exemplo bom:

```java
Dinheiro.de("199.90")
LocalDate.now()
Math.max(10, 20)
```

Mas static também pode esconder dependências globais.

Exemplo perigoso:

```java
SessaoGlobal.usuarioAtual
ConfiguracaoGlobal.ambiente
EmailGlobal.enviar(...)
BancoGlobal.salvar(...)
```

Cuidado com static que:

```text
guarda estado mutável;
faz operação externa;
esconde dependência;
dificulta teste;
vira atalho para qualquer lugar do sistema.
```

---

## Acoplamento por pacote

Pacotes também mostram acoplamento.

No exemplo bom, o pacote:

```text
dominio.pedido
```

não depende de:

```text
infra.email
```

Mas `app` depende dos dois:

```text
dominio;
infra.
```

Isso é aceitável no exemplo didático.

Em arquitetura real, teremos uma camada de aplicação coordenando casos de uso.

O ponto agora é:

```text
domínio não deve conhecer detalhes externos sem necessidade.
```

---

## Acoplamento aceitável em domínio

Dependências aceitáveis:

```text
Pedido depende de Cliente;
Pedido depende de Dinheiro;
Pedido depende de StatusPedido;
Contrato depende de UsuarioOperador;
Contrato depende de PeriodoContrato;
OrdemServico depende de PeriodoAtendimento;
ServicoContratado depende de Dinheiro.
```

Essas dependências representam conceitos do domínio.

Elas são esperadas.

---

## Acoplamento suspeito em domínio

Dependências suspeitas:

```text
Pedido depende de EnviadorEmailConsole;
Pedido depende de HttpClient;
Pedido depende de Connection;
Pedido depende de FileWriter;
Pedido depende de Controller;
Contrato depende de SessaoGlobal;
OrdemServico depende de tela HTML;
Cliente depende de repository;
Dinheiro depende de banco de dados.
```

Essas dependências misturam domínio com detalhes externos.

Não é que nunca possa existir integração.

Mas precisa estar no lugar certo.

---

## A regra do conhecimento necessário

Uma classe deve conhecer apenas o necessário para cumprir sua responsabilidade.

Pergunte:

```text
essa classe realmente precisa conhecer essa outra classe?
essa dependência faz parte do domínio?
essa dependência é detalhe externo?
essa dependência está escondida?
se eu trocar essa dependência, terei que mexer em regra de domínio?
```

Se a resposta indicar risco, talvez exista acoplamento ruim.

---

## Cuidado: desacoplar demais também atrapalha

Assim como coesão, acoplamento exige equilíbrio.

Exagero ruim:

```text
criar 10 classes para evitar uma dependência simples;
passar tudo por objetos intermediários sem necessidade;
evitar qualquer new;
nunca deixar uma entidade conhecer outra;
transformar código simples em arquitetura complexa.
```

Dependência natural não é problema.

O problema é dependência indevida.

No começo, foque em evitar os erros mais graves:

```text
domínio chamando infraestrutura;
estado static global;
classes gigantes conhecendo tudo;
dependências escondidas.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Pedido acoplado

Execute:

```text
PedidoAcopladoApp.java
```

Explique:

```text
qual classe o pedido cria internamente;
por que isso acopla pedido a e-mail;
qual mudança externa obrigaria mexer no pedido.
```

### Parte 2 — Pedido desacoplado

Execute:

```text
PedidoDesacopladoApp.java
```

Explique:

```text
qual classe confirma pagamento;
qual classe monta mensagem;
qual classe envia e-mail;
por que Pedido ficou mais focado.
```

### Parte 3 — Static global

Execute:

```text
AcoplamentoStaticGlobalApp.java
```

Explique:

```text
qual dependência está escondida;
por que SessaoGlobal é perigosa;
por que testes poderiam ficar frágeis.
```

### Parte 4 — Dependência explícita

Execute:

```text
ContratoDesacopladoApp.java
```

Explique:

```text
por que passar UsuarioOperador por parâmetro melhora leitura;
por que o contrato ainda tem dependência, mas mais saudável.
```

### Parte 5 — Compare os fluxos

Compare:

```text
PedidoAcopladoApp;
PedidoDesacopladoApp;
AcoplamentoStaticGlobalApp;
ContratoDesacopladoApp.
```

Responda:

```text
onde a dependência está escondida?
onde a dependência está explícita?
onde o domínio conhece infraestrutura?
onde o domínio conhece apenas domínio?
```

---

## Desafio prático

Crie um domínio de Ordem de Serviço com foco em reduzir acoplamento indevido.

Estrutura sugerida:

```text
src\br\com\curso\aula129\appos
src\br\com\curso\aula129\dominio\ordemservico
src\br\com\curso\aula129\dominio\tecnico
src\br\com\curso\aula129\dominio\notificacaoos
src\br\com\curso\aula129\infra\whatsapp
```

Arquivos sugeridos:

```text
appos\OrdemServicoDesacopladaApp.java

dominio\ordemservico\OrdemServico.java
dominio\ordemservico\CodigoOs.java
dominio\ordemservico\PeriodoAtendimento.java
dominio\ordemservico\StatusOs.java
dominio\ordemservico\TurnoAtendimento.java

dominio\tecnico\Tecnico.java

dominio\notificacaoos\MensagemOs.java

infra\whatsapp\EnviadorWhatsappConsole.java
```

Regras:

```text
OrdemServico não deve criar EnviadorWhatsappConsole.
OrdemServico não deve montar texto completo de WhatsApp.
MensagemOs monta mensagens com base na OS.
EnviadorWhatsappConsole apenas simula envio.
App coordena o fluxo.
OrdemServico pode reagendar, atribuir técnico, concluir e cancelar.
Tecnico tem id, nome e ativo.
PeriodoAtendimento tem data e turno.
CodigoOs valida código iniciado com OS-.
StatusOs usa enum.
```

Fluxo esperado no app:

```text
criar OS;
atribuir técnico ativo;
reagendar OS;
gerar mensagem de reagendamento;
enviar mensagem pelo EnviadorWhatsappConsole;
concluir OS;
imprimir resumo.
```

Critério principal:

```text
domínio pode depender de domínio;
domínio não deve depender de infraestrutura.
```

---

## Erros comuns

### 1. Achar que todo acoplamento é ruim

Dependência natural de domínio é esperada.

### 2. Entidade criando infraestrutura

`new EnviadorEmail` dentro de entidade é sinal de alerta.

### 3. Usar static global para facilitar

Estado global cria dependência escondida.

### 4. Esconder dependências importantes

Método parece simples, mas por dentro acessa sessão, banco ou API.

### 5. Misturar domínio com app

App coordena. Domínio protege regra.

### 6. Misturar domínio com infra

Infraestrutura deve ficar separada de regra de domínio.

### 7. Desacoplar demais

Evite arquitetura artificial para problemas simples.

### 8. Não observar direção da dependência

Pergunte sempre quem deveria depender de quem.

---

## Debug recomendado

Use debug em:

```text
PedidoAcopladoApp.java
PedidoDesacopladoApp.java
AcoplamentoStaticGlobalApp.java
ContratoDesacopladoApp.java
```

Breakpoints recomendados:

```java
pedido.confirmarPagamento(...)
new EnviadorEmailAcoplado()
enviador.enviar(...)

pedido.confirmarPagamento(...)
mensagemPedido.confirmacaoPagamento(pedido)
enviador.enviar(...)

SessaoGlobal.usuarioAtual = "ana"
contrato.ativar()
contrato.cancelar(...)

contrato.ativar(ana)
contrato.cancelar(..., carlos)
```

Observe:

```text
quando a dependência está escondida dentro da classe;
quando a dependência aparece no parâmetro;
quando o domínio chama infraestrutura;
quando o app coordena as dependências;
quando mudar uma classe exigiria mudar outra.
```

O objetivo é enxergar o caminho das dependências.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é acoplamento entre classes?
2. Qual diferença entre acoplamento saudável e acoplamento perigoso?
3. Por que domínio não deve depender diretamente de infraestrutura?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar acoplamento;
identificar dependência entre classes;
diferenciar acoplamento natural de domínio e acoplamento indevido;
identificar new perigoso dentro de entidade;
identificar static global perigoso;
tornar dependências importantes explícitas;
separar domínio de infraestrutura;
entender direção de dependência;
evitar dependência escondida;
evitar desacoplamento exagerado;
organizar pacotes com menos acoplamento indevido;
resolver o desafio de Ordem de Serviço;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-129-acoplamento-entre-classes
git commit -m "Aula 129: pratica acoplamento entre classes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
classes podem depender umas das outras, mas essa dependência precisa ser necessária, clara e bem direcionada.
```

Você viu que acoplamento saudável existe dentro do domínio, como `Pedido` depender de `Cliente` e `Dinheiro`.

Também viu acoplamentos perigosos:

```text
entidade chamando infraestrutura;
estado static global;
dependência escondida;
domínio conhecendo detalhes externos.
```

Na próxima aula, vamos estudar colaboração entre objetos.

Vamos entender como objetos bem coesos e com acoplamento controlado trabalham juntos para realizar um fluxo de domínio sem virar classe gigante.
