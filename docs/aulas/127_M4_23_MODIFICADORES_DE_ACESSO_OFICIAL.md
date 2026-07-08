# 127 — M4.23 — Modificadores de acesso

## Objetivo da aula

Nesta aula você vai aprender modificadores de acesso em Java.

Na aula anterior, você organizou classes em pacotes. Agora vamos dar o próximo passo: controlar o que cada classe, atributo, construtor e método pode expor para outras partes do sistema.

Ao final da aula, você deve conseguir:

```text
explicar public, private, protected e visibilidade de pacote;
entender por que atributos de domínio geralmente devem ser private;
entender por que nem todo método deve ser public;
usar construtor private em objetos de valor;
usar classe sem public para detalhes internos de pacote;
entender protected de forma inicial;
separar API pública de detalhe interno;
proteger regras de domínio com encapsulamento;
aplicar modificadores em entidades, objetos de valor e pacotes.
```

Essa aula é essencial para Java backend porque encapsulamento real depende de visibilidade correta.

Não basta criar classes.  
Você precisa decidir o que o resto do sistema pode acessar.

---

## A ideia central

Modificador de acesso responde à pergunta:

```text
quem pode acessar isso?
```

Em Java, os principais modificadores são:

```text
public;
private;
protected;
sem modificador explícito.
```

Resumo inicial:

```text
public
Pode ser acessado de qualquer pacote.

private
Só pode ser acessado dentro da própria classe.

sem modificador
Pode ser acessado apenas por classes do mesmo pacote.

protected
Pode ser acessado por classes do mesmo pacote e por subclasses.
```

Ainda vamos estudar herança mais à frente. Por isso, nesta aula, `protected` será apresentado de forma inicial. O foco principal será:

```text
public;
private;
visibilidade de pacote.
```

---

## Por que modificador de acesso importa

Imagine uma entidade `Pedido`.

Se os atributos forem públicos, qualquer classe poderia fazer:

```java
pedido.status = StatusPedido.PAGO;
pedido.total = Dinheiro.zero();
pedido.numero = 0;
```

Isso quebra regra de negócio.

Melhor:

```java
pedido.confirmarPagamento(valorPago);
pedido.cancelar("Cliente desistiu");
```

A entidade controla as mudanças.

Para isso, os atributos ficam privados:

```java
private StatusPedido status;
private Dinheiro total;
```

E a classe expõe métodos públicos com intenção:

```java
public void confirmarPagamento(Dinheiro valorPago)
public void cancelar(String motivo)
```

A regra principal é:

```text
exponha o mínimo necessário.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m4\aula-127-modificadores-de-acesso
cd labs\m4\aula-127-modificadores-de-acesso
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula127
mkdir src\br\com\curso\aula127\app
mkdir src\br\com\curso\aula127\dominio
mkdir src\br\com\curso\aula127\dominio\cliente
mkdir src\br\com\curso\aula127\dominio\pedido
mkdir src\br\com\curso\aula127\dominio\valor
mkdir src\br\com\curso\aula127\dominio\contrato
```

Estrutura esperada:

```text
aula-127-modificadores-de-acesso/
└── src/
    └── br/
        └── com/
            └── curso/
                └── aula127/
                    ├── app/
                    └── dominio/
                        ├── cliente/
                        ├── pedido/
                        ├── valor/
                        └── contrato/
```

---

## public

`public` expõe algo para qualquer pacote.

Exemplo:

```java
public class Cliente {
}
```

A classe pode ser usada por outros pacotes.

Exemplo:

```java
public String resumo() {
    return "...";
}
```

O método pode ser chamado por outras classes.

Use `public` para aquilo que faz parte da API da classe.

API, aqui, significa:

```text
aquilo que a classe permite que outras partes do sistema usem.
```

---

## private

`private` restringe o acesso à própria classe.

Exemplo:

```java
private final String nome;
```

Outra classe não pode acessar diretamente:

```java
cliente.nome
```

Isso é bom.

A própria classe decide como esse dado será usado.

Atributos de entidades e objetos de valor quase sempre devem ser `private`.

---

## Sem modificador explícito

Quando você não escreve `public`, `private` ou `protected`, o acesso fica restrito ao mesmo pacote.

Exemplo:

```java
class ValidadorPedido {
}
```

Essa classe não é pública.

Ela só pode ser usada por classes do mesmo pacote.

Esse nível é chamado de:

```text
package-private;
visibilidade de pacote.
```

É muito útil para esconder detalhes internos.

---

## protected

`protected` permite acesso:

```text
dentro do mesmo pacote;
e em subclasses.
```

Como herança será estudada com profundidade depois, por enquanto guarde:

```text
protected está ligado a pacote e herança.
```

Não use `protected` como padrão.

Na maioria dos exemplos atuais, você usará:

```text
public;
private;
sem modificador.
```

---

## Exemplo 1 — Cliente com atributos private

Crie o arquivo:

```text
src\br\com\curso\aula127\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula127.dominio.cliente;

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

    public int id() {
        return id;
    }

    public boolean ativo() {
        return ativo;
    }

    public String resumo() {
        return "Cliente " + id + " - " + nome + " | Ativo: " + ativo;
    }
}
```

Observe:

```java
public class Cliente
```

A classe pode ser usada fora do pacote.

```java
private final int id;
private final String nome;
private final boolean ativo;
```

Os atributos são protegidos.

```java
public int id()
public boolean ativo()
public String resumo()
```

Esses métodos formam a API pública da classe.

---

## App usando Cliente

Crie:

```text
src\br\com\curso\aula127\app\ClienteApp.java
```

Código:

```java
package br.com.curso.aula127.app;

import br.com.curso.aula127.dominio.cliente.Cliente;

public class ClienteApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(10, "Ana Silva");

        System.out.println(cliente.resumo());
        System.out.println("Id: " + cliente.id());
        System.out.println("Ativo: " + cliente.ativo());

        // As linhas abaixo não compilam:
        // System.out.println(cliente.nome);
        // cliente.ativo = false;
    }
}
```

Compile tudo:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.curso.aula127.app.ClienteApp
```

---

## O que esse exemplo mostra

`ClienteApp` consegue chamar:

```java
cliente.resumo()
cliente.id()
cliente.ativo()
```

Porque esses métodos são públicos.

Mas não consegue acessar:

```java
cliente.nome
cliente.ativo
```

Porque os atributos são privados.

Isso força o uso correto da classe.

---

## Exemplo 2 — Objeto de valor com construtor private

Agora crie um objeto de valor `Dinheiro`.

Crie:

```text
src\br\com\curso\aula127\dominio\valor\Dinheiro.java
```

Código:

```java
package br.com.curso.aula127.dominio.valor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class Dinheiro {
    private final BigDecimal valor;

    private Dinheiro(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = normalizar(valor);
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

    private BigDecimal normalizar(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
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

## Análise do Dinheiro

A classe é pública:

```java
public final class Dinheiro
```

O construtor é privado:

```java
private Dinheiro(BigDecimal valor)
```

Isso impede criação direta fora da classe.

Ninguém consegue fazer:

```java
new Dinheiro(new BigDecimal("10.00"));
```

A criação acontece por métodos públicos:

```java
public static Dinheiro de(String valor)
public static Dinheiro zero()
```

O método auxiliar é privado:

```java
private BigDecimal normalizar(BigDecimal valor)
```

Ele é detalhe interno. O mundo externo não precisa saber como a normalização acontece.

Essa é uma API pequena e controlada.

---

## App usando Dinheiro

Crie:

```text
src\br\com\curso\aula127\app\DinheiroApp.java
```

Código:

```java
package br.com.curso.aula127.app;

import br.com.curso.aula127.dominio.valor.Dinheiro;

public class DinheiroApp {
    public static void main(String[] args) {
        Dinheiro preco = Dinheiro.de("199.90");
        Dinheiro frete = Dinheiro.de("20.00");

        Dinheiro total = preco.somar(frete);

        System.out.println("Preço: " + preco);
        System.out.println("Frete: " + frete);
        System.out.println("Total: " + total);

        // As linhas abaixo não compilam:
        // Dinheiro direto = new Dinheiro(new BigDecimal("10.00"));
        // preco.normalizar(new BigDecimal("10.00"));
    }
}
```

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.curso.aula127.app.DinheiroApp
```

---

## Construtor private na prática

Construtor privado é útil quando você quer controlar o nascimento do objeto.

No `Dinheiro`, isso ajuda a garantir:

```text
valor obrigatório;
escala de 2 casas;
criação por factory;
normalização centralizada;
API mais expressiva.
```

Em vez de expor vários detalhes de criação, você oferece:

```java
Dinheiro.de("199.90")
Dinheiro.zero()
```

Isso deixa o uso mais limpo.

---

## Exemplo 3 — Entidade Pedido com API pública pequena

Crie:

```text
src\br\com\curso\aula127\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula127.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Agora crie:

```text
src\br\com\curso\aula127\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula127.dominio.pedido;

import br.com.curso.aula127.dominio.cliente.Cliente;
import br.com.curso.aula127.dominio.valor.Dinheiro;

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
        validarPodeConfirmarPagamento(valorPago);
        status = StatusPedido.PAGO;
    }

    public void cancelar(String motivo) {
        validarPodeCancelar(motivo);
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

    private void validarPodeConfirmarPagamento(Dinheiro valorPago) {
        if (!criado()) {
            throw new IllegalStateException("Somente pedido criado pode receber pagamento.");
        }

        if (valorPago == null || !valorPago.maiorOuIgual(total)) {
            throw new IllegalArgumentException("Valor pago não cobre o total do pedido.");
        }
    }

    private void validarPodeCancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (cancelado()) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        if (pago()) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado por este fluxo.");
        }
    }
}
```

---

## Análise do Pedido

A API pública do pedido é:

```java
public Pedido(...)
public boolean criado()
public boolean pago()
public boolean cancelado()
public void confirmarPagamento(Dinheiro valorPago)
public void cancelar(String motivo)
public String resumo()
```

Esses são os comportamentos que outras classes podem usar.

Os detalhes internos ficam privados:

```java
private void validarPodeConfirmarPagamento(...)
private void validarPodeCancelar(...)
```

Outra classe não deve chamar validações internas.

Ela deve chamar a ação de domínio:

```java
pedido.confirmarPagamento(valorPago);
pedido.cancelar("motivo");
```

A validação faz parte da própria operação.

---

## App usando Pedido

Crie:

```text
src\br\com\curso\aula127\app\PedidoApp.java
```

Código:

```java
package br.com.curso.aula127.app;

import br.com.curso.aula127.dominio.cliente.Cliente;
import br.com.curso.aula127.dominio.pedido.Pedido;
import br.com.curso.aula127.dominio.valor.Dinheiro;

public class PedidoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(10, "Ana Silva");

        Pedido pedido = new Pedido(
                1001,
                cliente,
                Dinheiro.de("399.80")
        );

        System.out.println(pedido.resumo());

        pedido.confirmarPagamento(Dinheiro.de("399.80"));

        System.out.println(pedido.resumo());

        // As linhas abaixo não compilam:
        // pedido.status = StatusPedido.CANCELADO;
        // pedido.validarPodeCancelar("Teste");
    }
}
```

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.curso.aula127.app.PedidoApp
```

---

## Métodos privados melhoram a leitura interna

Veja:

```java
public void cancelar(String motivo) {
    validarPodeCancelar(motivo);
    status = StatusPedido.CANCELADO;
    motivoCancelamento = motivo;
}
```

O método público mostra o fluxo principal:

```text
validar;
alterar status;
guardar motivo.
```

O detalhe fica no método privado:

```java
private void validarPodeCancelar(String motivo)
```

Isso melhora leitura sem expor detalhes.

---

## Exemplo 4 — Visibilidade de pacote

Agora vamos criar uma classe interna do pacote de pedido.

Crie:

```text
src\br\com\curso\aula127\dominio\pedido\CalculadoraResumoPedido.java
```

Código:

```java
package br.com.curso.aula127.dominio.pedido;

class CalculadoraResumoPedido {
    String linha(String titulo, String valor) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }

        if (valor == null) {
            valor = "";
        }

        return titulo + ": " + valor;
    }
}
```

Observe:

```java
class CalculadoraResumoPedido
```

Não tem `public`.

O método também não tem `public`:

```java
String linha(...)
```

Isso significa:

```text
somente classes do pacote br.com.curso.aula127.dominio.pedido podem acessar.
```

Agora crie:

```text
src\br\com\curso\aula127\dominio\pedido\PedidoComResumoInterno.java
```

Código:

```java
package br.com.curso.aula127.dominio.pedido;

public class PedidoComResumoInterno {
    private final int numero;
    private final StatusPedido status;

    public PedidoComResumoInterno(int numero, StatusPedido status) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.numero = numero;
        this.status = status;
    }

    public String resumo() {
        CalculadoraResumoPedido calculadora = new CalculadoraResumoPedido();

        return calculadora.linha("Pedido", String.valueOf(numero))
                + " | "
                + calculadora.linha("Status", status.name());
    }
}
```

Como `PedidoComResumoInterno` está no mesmo pacote, ele consegue usar `CalculadoraResumoPedido`.

---

## App usando apenas a API pública

Crie:

```text
src\br\com\curso\aula127\app\ResumoInternoApp.java
```

Código:

```java
package br.com.curso.aula127.app;

import br.com.curso.aula127.dominio.pedido.PedidoComResumoInterno;
import br.com.curso.aula127.dominio.pedido.StatusPedido;

public class ResumoInternoApp {
    public static void main(String[] args) {
        PedidoComResumoInterno pedido = new PedidoComResumoInterno(
                1001,
                StatusPedido.CRIADO
        );

        System.out.println(pedido.resumo());

        // A linha abaixo não compila, porque CalculadoraResumoPedido não é public:
        // CalculadoraResumoPedido calculadora = new CalculadoraResumoPedido();
    }
}
```

Compile:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Execute:

```powershell
java -cp out br.com.curso.aula127.app.ResumoInternoApp
```

---

## Para que serve package-private

Visibilidade de pacote é excelente para detalhes internos.

Exemplo:

```text
Pedido;
StatusPedido;
CalculadoraResumoPedido;
ValidadorPedido;
PoliticaCancelamentoPedido.
```

Talvez apenas `Pedido` e `StatusPedido` devam ser públicos.

Classes auxiliares podem ficar sem `public`.

Isso evita que outros pacotes dependam de detalhes internos.

Regra prática:

```text
se só o pacote precisa usar, não torne public.
```

---

## private em classes

Uma classe de topo não pode ser `private`.

Exemplo inválido:

```java
private class Cliente {
}
```

Classes de topo podem ser:

```text
public;
sem modificador.
```

Mais tarde, quando estudarmos classes internas, veremos classes privadas dentro de outras classes.

Por enquanto:

```text
classe de topo pública ou package-private.
```

---

## Exemplo 5 — protected em visão inicial

`protected` será aprofundado em herança, mas vamos ver um exemplo inicial.

Crie:

```text
src\br\com\curso\aula127\dominio\cliente\BaseCadastro.java
```

Código:

```java
package br.com.curso.aula127.dominio.cliente;

public class BaseCadastro {
    protected String origemCadastro() {
        return "SISTEMA_INTERNO";
    }
}
```

Agora crie:

```text
src\br\com\curso\aula127\dominio\cliente\ClienteComOrigem.java
```

Código:

```java
package br.com.curso.aula127.dominio.cliente;

public class ClienteComOrigem extends BaseCadastro {
    private final int id;
    private final String nome;

    public ClienteComOrigem(int id, String nome) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
    }

    public String resumo() {
        return "Cliente " + id
                + " - " + nome
                + " | Origem: " + origemCadastro();
    }
}
```

Crie:

```text
src\br\com\curso\aula127\app\ClienteComOrigemApp.java
```

Código:

```java
package br.com.curso.aula127.app;

import br.com.curso.aula127.dominio.cliente.ClienteComOrigem;

public class ClienteComOrigemApp {
    public static void main(String[] args) {
        ClienteComOrigem cliente = new ClienteComOrigem(
                10,
                "Ana Silva"
        );

        System.out.println(cliente.resumo());

        // A linha abaixo não compila:
        // System.out.println(cliente.origemCadastro());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula127.app.ClienteComOrigemApp
```

---

## Como pensar sobre protected agora

Nesta fase, não use `protected` como padrão.

Guarde apenas:

```text
protected aparece quando existe relação com herança;
também permite acesso no mesmo pacote;
será aprofundado depois.
```

Em domínio simples, prefira:

```text
private para detalhes internos;
public para API real;
package-private para detalhes do pacote.
```

---

## Tabela mental de acesso

Use esta tabela:

```text
private
Apenas dentro da própria classe.

sem modificador
Dentro do mesmo pacote.

protected
Dentro do mesmo pacote e em subclasses.

public
De qualquer lugar.
```

Outra forma de pensar:

```text
private: detalhe máximo;
package-private: detalhe interno do pacote;
protected: pacote + herança;
public: API externa.
```

Regra prática:

```text
comece mais restrito e abra somente quando necessário.
```

---

## Getters públicos com critério

Atributo privado não significa que você precisa criar getter para tudo.

Exemplo:

```java
private String motivoCancelamento;
```

Você precisa expor?

Depende.

Talvez `resumo()` já resolva.

Getter também é API pública.

Se você cria:

```java
public String motivoCancelamento()
```

outra classe pode começar a depender desse dado.

Use critério.

---

## Setters públicos com muito critério

Setter público abre alteração direta.

Exemplo perigoso:

```java
public void setStatus(StatusPedido status) {
    this.status = status;
}
```

Isso permite pular regra de negócio.

Melhor:

```java
public void confirmarPagamento(Dinheiro valorPago)
public void cancelar(String motivo)
```

Em classes de domínio, prefira métodos de comportamento.

Setters fazem mais sentido em DTOs ou objetos simples de transporte, assunto que será aprofundado mais adiante.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Cliente

Execute:

```text
ClienteApp.java
```

Explique:

```text
por que Cliente é public;
por que os atributos são private;
por que id(), ativo() e resumo() são public.
```

### Parte 2 — Dinheiro

Execute:

```text
DinheiroApp.java
```

Explique:

```text
por que o construtor é private;
por que de(...) e zero() são public static;
por que normalizar(...) é private.
```

### Parte 3 — Pedido

Execute:

```text
PedidoApp.java
```

Explique:

```text
quais métodos formam a API pública;
quais métodos são detalhes privados;
por que status não pode ser alterado diretamente.
```

### Parte 4 — Package-private

Execute:

```text
ResumoInternoApp.java
```

Explique:

```text
por que PedidoComResumoInterno usa CalculadoraResumoPedido;
por que o app não acessa CalculadoraResumoPedido diretamente.
```

### Parte 5 — Protected

Execute:

```text
ClienteComOrigemApp.java
```

Explique:

```text
por que ClienteComOrigem consegue usar origemCadastro();
por que o app não chama origemCadastro() diretamente.
```

### Parte 6 — Erros controlados

Descomente linhas marcadas como:

```text
não compila
```

Tente compilar.

Leia o erro.

Depois comente novamente.

O objetivo é ver o modificador de acesso protegendo o código.

---

## Desafio prático

Crie um domínio de contrato com modificadores corretos.

Use a estrutura:

```text
src\br\com\curso\aula127\appcontrato
src\br\com\curso\aula127\dominio\contrato
src\br\com\curso\aula127\dominio\servico
```

Arquivos sugeridos:

```text
appcontrato\ContratoApp.java

dominio\contrato\Contrato.java
dominio\contrato\StatusContrato.java
dominio\contrato\PeriodoContrato.java
dominio\contrato\ValidadorContrato.java

dominio\servico\ServicoContratado.java
```

Pode reutilizar:

```text
dominio\valor\Dinheiro.java
```

Regras de acesso:

```text
Contrato deve ser public.
StatusContrato deve ser public.
PeriodoContrato deve ser public final.
ValidadorContrato deve ficar sem public.
ServicoContratado deve ser public.
Atributos devem ser private.
Métodos auxiliares internos devem ser private.
ContratoApp deve usar apenas métodos públicos.
```

Regras de domínio:

```text
Contrato nasce RASCUNHO.
Contrato pode ativar.
Contrato pode cancelar com motivo.
Serviço tem nome e valor mensal positivo.
Período tem início e fim.
Fim não pode ser anterior ao início.
```

Métodos públicos esperados em `Contrato`:

```text
ativar();
cancelar(String motivo);
ativo();
resumo();
```

Métodos privados sugeridos em `Contrato`:

```text
validarPodeAtivar();
validarPodeCancelar(String motivo);
```

Teste:

```text
ativar contrato válido;
cancelar contrato;
cancelar sem motivo;
tentar acessar ValidadorContrato pelo app;
tentar acessar atributos diretamente.
```

Critério principal:

```text
o app deve enxergar a API pública;
detalhes internos ficam private ou package-private.
```

---

## Erros comuns

### 1. Colocar public em tudo

Isso aumenta acoplamento e expõe detalhes desnecessários.

### 2. Colocar atributos public

Isso quebra encapsulamento.

### 3. Criar getter e setter automático

Getter e setter também expõem API. Use critério.

### 4. Deixar validação pública sem necessidade

Validação geralmente deve estar dentro da operação.

### 5. Tornar classe interna do pacote pública sem motivo

Se só o pacote usa, deixe package-private.

### 6. Usar protected antes de entender herança

Por enquanto, não use como padrão.

### 7. Achar que private resolve modelagem ruim

`private` ajuda, mas você ainda precisa criar bons métodos públicos.

### 8. Colocar regra no app

O app deve chamar o domínio, não substituir o domínio.

---

## Debug recomendado

Use debug em:

```text
ClienteApp.java
DinheiroApp.java
PedidoApp.java
ResumoInternoApp.java
ClienteComOrigemApp.java
```

Breakpoints recomendados:

```java
new Cliente(...)
Dinheiro.de("199.90")
private Dinheiro(BigDecimal valor)
normalizar(valor)
pedido.confirmarPagamento(...)
validarPodeConfirmarPagamento(...)
pedido.cancelar(...)
validarPodeCancelar(...)
new CalculadoraResumoPedido()
origemCadastro()
```

Observe:

```text
quais métodos o app consegue chamar;
quais métodos só a própria classe chama;
quais classes só o pacote enxerga;
como private organiza o fluxo interno;
como public define a API externa.
```

O objetivo é enxergar modificador de acesso como ferramenta de design, não apenas como palavra-chave.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual diferença entre public, private e sem modificador?
2. Por que atributos de domínio geralmente devem ser private?
3. Quando faz sentido deixar uma classe sem public?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar modificadores de acesso;
usar public com critério;
usar private em atributos;
usar private em métodos auxiliares;
usar construtor private em objeto de valor;
entender visibilidade de pacote;
criar classe package-private;
entender protected de forma inicial;
evitar public automático;
evitar getters e setters automáticos;
separar API pública de detalhe interno;
proteger regras de domínio;
compilar exemplos com pacotes;
resolver o desafio de contrato;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-127-modificadores-de-acesso
git commit -m "Aula 127: pratica modificadores de acesso"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
modificador de acesso define quem pode enxergar e usar cada parte do código.
```

Você viu que:

```text
public expõe API;
private protege detalhes internos;
sem modificador restringe ao pacote;
protected envolve pacote e herança;
atributos de domínio devem ser privados;
métodos públicos devem representar ações permitidas;
classes auxiliares podem ser package-private.
```

Essa aula reforça encapsulamento de verdade.

Na próxima aula, vamos estudar coesão em classes.

Vamos entender como manter uma classe focada em uma responsabilidade, como perceber quando ela começou a fazer coisas demais e como dividir responsabilidades sem criar bagunça.
