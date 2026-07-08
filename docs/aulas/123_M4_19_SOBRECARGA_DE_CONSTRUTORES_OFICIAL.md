# 123 — M4.19 — Sobrecarga de construtores

## Objetivo da aula

Nesta aula você vai aprender sobrecarga de construtores em Java.

Nas aulas anteriores, você estudou objetos, construtores, encapsulamento, composição, entidades, objetos de valor, `static` e `final`. Agora vamos aprofundar um recurso que ajuda muito na criação de objetos:

```text
ter mais de uma forma de construir um objeto.
```

Isso é sobrecarga de construtores.

Ao final da aula, você deve conseguir:

```text
explicar o que é sobrecarga de construtores;
criar mais de um construtor na mesma classe;
entender diferença de assinatura;
usar this(...) para reaproveitar construtores;
centralizar validações no construtor principal;
evitar duplicação de regra;
oferecer valores padrão com critério;
entender quando sobrecarga melhora a leitura;
entender quando sobrecarga confunde;
diferenciar construtor sobrecarregado de método static factory;
aplicar sobrecarga em entidades e objetos de valor.
```

Essa aula é importante porque, em sistemas reais, nem sempre um objeto nasce com todos os dados possíveis.

Às vezes um pedido nasce apenas com dados mínimos.  
Às vezes um produto nasce com estoque zero.  
Às vezes uma OS nasce agendada.  
Às vezes um pagamento nasce pendente.  
Às vezes um objeto de valor pode ser criado por `String`, `BigDecimal` ou valor numérico.

Sobrecarga permite representar essas variações com clareza.

---

## A ideia central

Sobrecarga de construtores é quando uma classe tem mais de um construtor com assinaturas diferentes.

Exemplo:

```java
class Cliente {
    Cliente(String nome) {
    }

    Cliente(String nome, String email) {
    }
}
```

Os dois construtores têm o mesmo nome da classe:

```java
Cliente
```

Mas recebem parâmetros diferentes.

Isso permite criar objetos de formas diferentes:

```java
new Cliente("Ana Silva");
new Cliente("Ana Silva", "ana@email.com");
```

A ideia principal é:

```text
a mesma classe pode oferecer formas diferentes de nascimento.
```

Mas isso precisa ser feito com critério.

---

## O que é assinatura de construtor

A assinatura de um construtor é formada principalmente por:

```text
nome da classe;
quantidade de parâmetros;
tipos dos parâmetros;
ordem dos parâmetros.
```

Exemplo:

```java
Cliente(String nome)
Cliente(String nome, String email)
Cliente(int id, String nome)
```

Esses três construtores têm assinaturas diferentes.

Por isso podem existir na mesma classe.

Mas estes dois não podem coexistir:

```java
Cliente(String nome, String email)
Cliente(String email, String nome)
```

Apesar dos nomes dos parâmetros serem diferentes, a assinatura para o Java é a mesma:

```text
Cliente(String, String)
```

O compilador não considera o nome do parâmetro para diferenciar assinatura.

---

## Por que usar sobrecarga de construtores

Use sobrecarga quando existem formas legítimas de criar o mesmo objeto.

Exemplos:

```text
Produto com estoque inicial informado;
Produto sem estoque inicial, assumindo zero;
Pedido com status padrão CRIADO;
Pagamento com status padrão PENDENTE;
Dinheiro criado a partir de BigDecimal;
Dinheiro criado a partir de String;
OS criada com Periodo pronto;
OS criada com data e turno separados.
```

Sobrecarga pode melhorar a leitura:

```java
new Produto("PROD-001", "Cadeira", preco);
```

em vez de obrigar:

```java
new Produto("PROD-001", "Cadeira", preco, 0, StatusProduto.ATIVO);
```

Se os dois últimos valores sempre têm padrão, a sobrecarga pode deixar o uso mais limpo.

---

## O perigo da duplicação

O maior erro em sobrecarga de construtores é duplicar validação.

Exemplo ruim:

```java
Produto(String codigo, String nome) {
    if (codigo == null || codigo.isBlank()) {
        throw new IllegalArgumentException("Código é obrigatório.");
    }

    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome é obrigatório.");
    }

    this.codigo = codigo;
    this.nome = nome;
    this.estoque = 0;
}

Produto(String codigo, String nome, int estoque) {
    if (codigo == null || codigo.isBlank()) {
        throw new IllegalArgumentException("Código é obrigatório.");
    }

    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome é obrigatório.");
    }

    if (estoque < 0) {
        throw new IllegalArgumentException("Estoque não pode ser negativo.");
    }

    this.codigo = codigo;
    this.nome = nome;
    this.estoque = estoque;
}
```

A validação de `codigo` e `nome` foi repetida.

Se a regra mudar, você precisa lembrar de alterar em todos os construtores.

Melhor:

```java
Produto(String codigo, String nome) {
    this(codigo, nome, 0);
}

Produto(String codigo, String nome, int estoque) {
    // valida tudo aqui
}
```

Esse é o papel do `this(...)`.

---

## this(...) em construtores

Dentro de um construtor, você pode chamar outro construtor da mesma classe usando:

```java
this(...)
```

Exemplo:

```java
Produto(String codigo, String nome) {
    this(codigo, nome, 0);
}

Produto(String codigo, String nome, int estoque) {
    // construtor principal
}
```

O primeiro construtor reaproveita o segundo.

Isso é chamado de encadeamento de construtores.

A regra importante:

```text
this(...) deve ser a primeira instrução do construtor.
```

Exemplo inválido:

```java
Produto(String codigo, String nome) {
    System.out.println("Criando produto");
    this(codigo, nome, 0);
}
```

Isso não compila.

---

## Exemplo 1 — sobrecarga simples

Crie a pasta:

```powershell
mkdir labs\m4\aula-123-sobrecarga-de-construtores
cd labs\m4\aula-123-sobrecarga-de-construtores
```

Crie o arquivo:

```text
SobrecargaSimples.java
```

Código:

```java
public class SobrecargaSimples {
    public static void main(String[] args) {
        ClienteSobrecargaSimples clienteSemEmail = new ClienteSobrecargaSimples(
                "Ana Silva"
        );

        ClienteSobrecargaSimples clienteComEmail = new ClienteSobrecargaSimples(
                "Carlos Lima",
                "carlos@email.com"
        );

        System.out.println(clienteSemEmail.resumo());
        System.out.println(clienteComEmail.resumo());
    }
}

class ClienteSobrecargaSimples {
    private final String nome;
    private final String email;

    ClienteSobrecargaSimples(String nome) {
        this(nome, "nao-informado@email.com");
    }

    ClienteSobrecargaSimples(String nome, String email) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.nome = nome;
        this.email = email.trim().toLowerCase();
    }

    String resumo() {
        return "Cliente: " + nome + " | E-mail: " + email;
    }
}
```

Compile e execute:

```powershell
javac SobrecargaSimples.java
java SobrecargaSimples
```

---

## Análise do exemplo simples

A classe possui dois construtores:

```java
ClienteSobrecargaSimples(String nome)
```

e:

```java
ClienteSobrecargaSimples(String nome, String email)
```

O construtor mais simples chama o mais completo:

```java
this(nome, "nao-informado@email.com");
```

A validação fica centralizada no construtor completo.

Isso evita repetição.

O objeto sempre passa pelo mesmo ponto principal de validação.

---

## Construtor principal

Em classes com vários construtores, é comum existir um construtor principal.

Ele é o construtor mais completo.

Os outros construtores apenas preenchem valores padrão e delegam para ele.

Exemplo:

```java
Produto(String codigo, String nome, Dinheiro preco) {
    this(codigo, nome, preco, 0, StatusProduto.ATIVO);
}

Produto(String codigo, String nome, Dinheiro preco, int estoqueInicial) {
    this(codigo, nome, preco, estoqueInicial, StatusProduto.ATIVO);
}

Produto(String codigo, String nome, Dinheiro preco, int estoqueInicial, StatusProduto status) {
    // validação principal
}
```

A regra prática é:

```text
construtores menores devem chamar construtores maiores;
a validação deve ficar no construtor principal.
```

Isso reduz erro.

---

## Exemplo 2 — Produto com construtor principal

Crie:

```text
ProdutoComConstrutores.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProdutoComConstrutores {
    public static void main(String[] args) {
        DinheiroProdutoConstrutor precoCadeira = DinheiroProdutoConstrutor.de("199.90");
        DinheiroProdutoConstrutor precoMesa = DinheiroProdutoConstrutor.de("499.90");

        ProdutoConstrutor produtoSemEstoque = new ProdutoConstrutor(
                "PROD-001",
                "Cadeira",
                precoCadeira
        );

        ProdutoConstrutor produtoComEstoque = new ProdutoConstrutor(
                "PROD-002",
                "Mesa",
                precoMesa,
                10
        );

        ProdutoConstrutor produtoInativo = new ProdutoConstrutor(
                "PROD-003",
                "Armário fora de linha",
                DinheiroProdutoConstrutor.de("899.90"),
                0,
                StatusProdutoConstrutor.INATIVO
        );

        System.out.println(produtoSemEstoque.resumo());
        System.out.println(produtoComEstoque.resumo());
        System.out.println(produtoInativo.resumo());
    }
}

enum StatusProdutoConstrutor {
    ATIVO,
    INATIVO
}

final class ProdutoConstrutor {
    private final String codigo;
    private final String nome;
    private final DinheiroProdutoConstrutor preco;
    private int estoque;
    private StatusProdutoConstrutor status;

    ProdutoConstrutor(String codigo, String nome, DinheiroProdutoConstrutor preco) {
        this(codigo, nome, preco, 0);
    }

    ProdutoConstrutor(String codigo, String nome, DinheiroProdutoConstrutor preco, int estoqueInicial) {
        this(codigo, nome, preco, estoqueInicial, StatusProdutoConstrutor.ATIVO);
    }

    ProdutoConstrutor(
            String codigo,
            String nome,
            DinheiroProdutoConstrutor preco,
            int estoqueInicial,
            StatusProdutoConstrutor status
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("PROD-")) {
            throw new IllegalArgumentException("Código deve iniciar com PROD-.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || !preco.positivo()) {
            throw new IllegalArgumentException("Preço deve ser positivo.");
        }

        if (estoqueInicial < 0) {
            throw new IllegalArgumentException("Estoque inicial não pode ser negativo.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoqueInicial;
        this.status = status;
    }

    boolean disponivelParaVenda() {
        return status == StatusProdutoConstrutor.ATIVO && estoque > 0;
    }

    String resumo() {
        return "Produto: " + codigo
                + " | Nome: " + nome
                + " | Preço: " + preco
                + " | Estoque: " + estoque
                + " | Status: " + status
                + " | Disponível: " + disponivelParaVenda();
    }
}

final class DinheiroProdutoConstrutor {
    private final BigDecimal valor;

    private DinheiroProdutoConstrutor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroProdutoConstrutor de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroProdutoConstrutor(new BigDecimal(valor));
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac ProdutoComConstrutores.java
java ProdutoComConstrutores
```

---

## O que esse exemplo ensina

O produto pode nascer de três formas:

```java
new ProdutoConstrutor(codigo, nome, preco)
```

Assume:

```text
estoque = 0;
status = ATIVO.
```

Outra forma:

```java
new ProdutoConstrutor(codigo, nome, preco, estoqueInicial)
```

Assume:

```text
status = ATIVO.
```

Forma completa:

```java
new ProdutoConstrutor(codigo, nome, preco, estoqueInicial, status)
```

Permite informar tudo.

Mas toda validação importante está no construtor principal:

```java
ProdutoConstrutor(
        String codigo,
        String nome,
        DinheiroProdutoConstrutor preco,
        int estoqueInicial,
        StatusProdutoConstrutor status
)
```

Esse é o padrão que queremos.

---

## Valores padrão devem fazer sentido

Sobrecarga geralmente aparece para oferecer valores padrão.

Mas esses valores precisam fazer sentido no domínio.

Exemplo bom:

```text
Produto sem estoque informado nasce com estoque 0.
Produto sem status informado nasce ATIVO.
Pedido sem status informado nasce CRIADO.
Pagamento sem status informado nasce PENDENTE.
```

Exemplo perigoso:

```text
Cliente sem e-mail recebe "nao-informado@email.com".
```

Isso pode ser aceitável em exemplo didático, mas em sistema real talvez não seja.

Talvez seja melhor exigir e-mail ou permitir `Email` opcional com outro modelo.

Regra prática:

```text
valor padrão não pode esconder dado obrigatório de verdade.
```

---

## Exemplo 3 — Pedido com status padrão

Crie:

```text
PedidoComConstrutores.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoComConstrutores {
    public static void main(String[] args) {
        ClientePedidoConstrutor cliente = new ClientePedidoConstrutor(
                10,
                "Ana Silva"
        );

        DinheiroPedidoConstrutor total = DinheiroPedidoConstrutor.de("399.80");

        PedidoConstrutor pedidoCriado = new PedidoConstrutor(
                1001,
                cliente,
                total
        );

        PedidoConstrutor pedidoPago = new PedidoConstrutor(
                1002,
                cliente,
                total,
                StatusPedidoConstrutor.PAGO
        );

        System.out.println(pedidoCriado.resumo());
        System.out.println(pedidoPago.resumo());
    }
}

enum StatusPedidoConstrutor {
    CRIADO,
    PAGO,
    CANCELADO
}

final class PedidoConstrutor {
    private final int numero;
    private final ClientePedidoConstrutor cliente;
    private final DinheiroPedidoConstrutor total;
    private StatusPedidoConstrutor status;

    PedidoConstrutor(int numero, ClientePedidoConstrutor cliente, DinheiroPedidoConstrutor total) {
        this(numero, cliente, total, StatusPedidoConstrutor.CRIADO);
    }

    PedidoConstrutor(
            int numero,
            ClientePedidoConstrutor cliente,
            DinheiroPedidoConstrutor total,
            StatusPedidoConstrutor status
    ) {
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

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = status;
    }

    boolean pago() {
        return status == StatusPedidoConstrutor.PAGO;
    }

    String resumo() {
        return "Pedido: " + numero
                + " | Cliente: " + cliente.resumo()
                + " | Total: " + total
                + " | Status: " + status
                + " | Pago: " + pago();
    }
}

final class ClientePedidoConstrutor {
    private final int id;
    private final String nome;
    private final boolean ativo;

    ClientePedidoConstrutor(int id, String nome) {
        this(id, nome, true);
    }

    ClientePedidoConstrutor(int id, String nome, boolean ativo) {
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

    boolean ativo() {
        return ativo;
    }

    String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}

final class DinheiroPedidoConstrutor {
    private final BigDecimal valor;

    private DinheiroPedidoConstrutor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroPedidoConstrutor de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroPedidoConstrutor(new BigDecimal(valor));
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac PedidoComConstrutores.java
java PedidoComConstrutores
```

---

## Sobrecarga em entidades

Entidades podem usar sobrecarga, mas com cuidado.

Exemplo bom:

```java
PedidoConstrutor(int numero, Cliente cliente, Dinheiro total) {
    this(numero, cliente, total, StatusPedido.CRIADO);
}
```

Faz sentido porque todo pedido novo nasce `CRIADO`.

Mas uma entidade não deve oferecer construtores que permitam estados inválidos ou confusos.

Exemplo perigoso:

```java
new Pedido(numero, cliente, total, StatusPedido.ENTREGUE);
```

Será que qualquer código deveria conseguir criar um pedido já entregue?

Depende do caso.

Pode ser necessário ao reconstruir dados vindos do banco no futuro, mas não para criação normal de domínio.

Esse assunto ficará mais forte quando estudarmos persistência.

Por enquanto, pense:

```text
construtor público deve representar uma forma válida de criar objeto.
```

---

## Sobrecarga em objeto de valor

Objetos de valor também podem ter sobrecarga.

Exemplo:

```text
Dinheiro criado por String;
Dinheiro criado por BigDecimal;
Dinheiro criado por int.
```

Crie:

```text
DinheiroComConstrutores.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class DinheiroComConstrutores {
    public static void main(String[] args) {
        DinheiroConstrutor dinheiro1 = new DinheiroConstrutor("199.90");
        DinheiroConstrutor dinheiro2 = new DinheiroConstrutor(new BigDecimal("199.90"));
        DinheiroConstrutor dinheiro3 = new DinheiroConstrutor(199);

        System.out.println(dinheiro1);
        System.out.println(dinheiro2);
        System.out.println(dinheiro3);
        System.out.println("dinheiro1 equals dinheiro2: " + dinheiro1.equals(dinheiro2));
    }
}

final class DinheiroConstrutor {
    private final BigDecimal valor;

    DinheiroConstrutor(String valor) {
        this(converterTexto(valor));
    }

    DinheiroConstrutor(int valor) {
        this(BigDecimal.valueOf(valor));
    }

    DinheiroConstrutor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    DinheiroConstrutor somar(DinheiroConstrutor outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroConstrutor(valor.add(outro.valor));
    }

    private static BigDecimal converterTexto(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new BigDecimal(valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        DinheiroConstrutor dinheiro = (DinheiroConstrutor) outro;
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

Compile e execute:

```powershell
javac DinheiroComConstrutores.java
java DinheiroComConstrutores
```

---

## Atenção com this(...) e métodos auxiliares

No exemplo, o construtor com `String` faz:

```java
DinheiroConstrutor(String valor) {
    this(converterTexto(valor));
}
```

Isso funciona porque `converterTexto` é `static`.

A chamada `this(...)` precisa ser a primeira instrução do construtor.

Você não poderia fazer:

```java
DinheiroConstrutor(String valor) {
    if (valor == null) {
        throw new IllegalArgumentException("Valor é obrigatório.");
    }

    this(new BigDecimal(valor));
}
```

Isso não compila, porque `this(...)` não veio primeiro.

A saída é colocar a lógica em um método `static` auxiliar:

```java
private static BigDecimal converterTexto(String valor)
```

Esse é um uso aceitável de `static`: função auxiliar pura, interna à classe.

---

## Sobrecarga versus static factory

Na aula de `static`, você viu métodos de fábrica:

```java
DinheiroFabrica.de("199.90")
DinheiroFabrica.zero()
```

Agora temos construtores sobrecarregados:

```java
new DinheiroConstrutor("199.90")
new DinheiroConstrutor(new BigDecimal("199.90"))
new DinheiroConstrutor(199)
```

Qual é melhor?

Depende.

### Construtor sobrecarregado

Bom quando a criação é simples e clara:

```java
new DinheiroConstrutor("199.90")
```

### Static factory

Bom quando você quer nomear melhor a intenção:

```java
Dinheiro.de("199.90")
Dinheiro.zero()
Dinheiro.reais("199.90")
Dinheiro.centavos(19990)
```

Factory pode ter nome mais expressivo.

Construtor sempre tem o nome da classe.

A regra prática:

```text
se os construtores ficaram ambíguos ou pouco expressivos, considere static factory.
```

---

## Sobrecarga confusa

Sobrecarga ruim confunde quem usa a classe.

Exemplo perigoso:

```java
Periodo(int dias)
Periodo(int meses)
```

Isso nem compila se ambos tiverem apenas um `int`, porque a assinatura seria igual.

Outro exemplo confuso:

```java
Relatorio(String inicio, String fim)
Relatorio(LocalDate inicio, LocalDate fim)
```

Pode ser aceitável, mas talvez fique mais claro:

```java
Relatorio.porTexto("2026-01-01", "2026-12-31")
Relatorio.porDatas(inicio, fim)
```

Outro exemplo perigoso:

```java
Cliente(String nome, String email)
Cliente(String email, String nome)
```

Não compila porque a assinatura é a mesma.

Mesmo quando compila, muitos construtores parecidos podem prejudicar a leitura.

---

## Sobrecarga com null pode gerar ambiguidade

Imagine uma classe com construtores:

```java
Notificacao(String texto)
Notificacao(Email email)
```

Se você chamar:

```java
new Notificacao(null)
```

o compilador pode não saber qual construtor usar.

Quando há sobrecarga com tipos de referência, `null` pode causar ambiguidade.

Exemplo conceitual:

```text
String é referência;
Email também é referência;
null poderia servir para os dois.
```

Como evitar?

```text
não aceite null como criação válida;
use nomes mais claros;
use static factories;
evite sobrecargas que disputam null;
valide no construtor principal.
```

---

## Exemplo 5 — OS com construtores de conveniência

Agora vamos aplicar em Ordem de Serviço.

Crie:

```text
OrdemServicoComConstrutores.java
```

Código:

```java
import java.time.LocalDate;

public class OrdemServicoComConstrutores {
    public static void main(String[] args) {
        ClienteOsConstrutor cliente = new ClienteOsConstrutor(
                10,
                "Carlos Lima"
        );

        PeriodoOsConstrutor periodo = new PeriodoOsConstrutor(
                LocalDate.now().plusDays(2),
                TurnoOsConstrutor.MANHA
        );

        OrdemServicoConstrutor osComPeriodo = new OrdemServicoConstrutor(
                new CodigoOsConstrutor("OS-2026-0001"),
                cliente,
                periodo
        );

        OrdemServicoConstrutor osComDataETurno = new OrdemServicoConstrutor(
                "OS-2026-0002",
                cliente,
                LocalDate.now().plusDays(3),
                TurnoOsConstrutor.TARDE
        );

        System.out.println(osComPeriodo.resumo());
        System.out.println();
        System.out.println(osComDataETurno.resumo());
    }
}

enum StatusOsConstrutor {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum TurnoOsConstrutor {
    MANHA,
    TARDE
}

final class OrdemServicoConstrutor {
    private final CodigoOsConstrutor codigo;
    private final ClienteOsConstrutor cliente;
    private PeriodoOsConstrutor periodo;
    private StatusOsConstrutor status;
    private int quantidadeReagendamentos;

    OrdemServicoConstrutor(CodigoOsConstrutor codigo, ClienteOsConstrutor cliente, PeriodoOsConstrutor periodo) {
        this(codigo, cliente, periodo, StatusOsConstrutor.AGENDADA);
    }

    OrdemServicoConstrutor(
            String codigo,
            ClienteOsConstrutor cliente,
            LocalDate data,
            TurnoOsConstrutor turno
    ) {
        this(new CodigoOsConstrutor(codigo), cliente, new PeriodoOsConstrutor(data, turno));
    }

    OrdemServicoConstrutor(
            CodigoOsConstrutor codigo,
            ClienteOsConstrutor cliente,
            PeriodoOsConstrutor periodo,
            StatusOsConstrutor status
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!cliente.ativo()) {
            throw new IllegalStateException("Cliente precisa estar ativo.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.status = status;
        this.quantidadeReagendamentos = 0;
    }

    boolean encerrada() {
        return status == StatusOsConstrutor.CONCLUIDA
                || status == StatusOsConstrutor.CANCELADA;
    }

    void reagendar(PeriodoOsConstrutor novoPeriodo) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novoPeriodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        periodo = novoPeriodo;
        status = StatusOsConstrutor.REAGENDADA;
        quantidadeReagendamentos++;
    }

    String resumo() {
        return "OS: " + codigo
                + "\nCliente: " + cliente.resumo()
                + "\nPeríodo: " + periodo
                + "\nStatus: " + status
                + "\nReagendamentos: " + quantidadeReagendamentos;
    }
}

final class CodigoOsConstrutor {
    private static final String PREFIXO = "OS-";

    private final String valor;

    CodigoOsConstrutor(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    @Override
    public String toString() {
        return valor;
    }
}

final class ClienteOsConstrutor {
    private final int id;
    private final String nome;
    private final boolean ativo;

    ClienteOsConstrutor(int id, String nome) {
        this(id, nome, true);
    }

    ClienteOsConstrutor(int id, String nome, boolean ativo) {
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

    boolean ativo() {
        return ativo;
    }

    String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}

final class PeriodoOsConstrutor {
    private final LocalDate data;
    private final TurnoOsConstrutor turno;

    PeriodoOsConstrutor(LocalDate data, TurnoOsConstrutor turno) {
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
    public String toString() {
        return data + " - " + turno;
    }
}
```

Compile e execute:

```powershell
javac OrdemServicoComConstrutores.java
java OrdemServicoComConstrutores
```

---

## O que a OS mostra

A OS pode ser criada assim:

```java
new OrdemServicoConstrutor(codigo, cliente, periodo)
```

ou assim:

```java
new OrdemServicoConstrutor("OS-2026-0002", cliente, data, turno)
```

A segunda forma é um construtor de conveniência.

Ele cria internamente:

```java
new CodigoOsConstrutor(codigo)
new PeriodoOsConstrutor(data, turno)
```

e delega para o construtor principal.

Isso pode ser útil quando você quer facilitar o uso da classe sem quebrar a modelagem.

Mas use com cuidado.

Se houver construtores demais, a classe fica confusa.

---

## Construtor privado e static factory

Às vezes você pode esconder o construtor principal e expor métodos de fábrica.

Exemplo:

```java
Pedido.novo(...)
Pedido.reconstituido(...)
```

Isso deixa claro se você está criando um pedido novo ou reconstruindo um pedido existente.

Crie:

```text
PedidoComFactoryNomeada.java
```

Código:

```java
public class PedidoComFactoryNomeada {
    public static void main(String[] args) {
        ClienteFactoryPedido cliente = new ClienteFactoryPedido(10, "Ana Silva");

        PedidoFactoryNomeada pedidoNovo = PedidoFactoryNomeada.novo(
                1001,
                cliente
        );

        PedidoFactoryNomeada pedidoReconstituido = PedidoFactoryNomeada.reconstituido(
                1002,
                cliente,
                StatusPedidoFactory.PAGO
        );

        System.out.println(pedidoNovo.resumo());
        System.out.println(pedidoReconstituido.resumo());
    }
}

enum StatusPedidoFactory {
    CRIADO,
    PAGO,
    CANCELADO
}

final class PedidoFactoryNomeada {
    private final int numero;
    private final ClienteFactoryPedido cliente;
    private final StatusPedidoFactory status;

    private PedidoFactoryNomeada(int numero, ClienteFactoryPedido cliente, StatusPedidoFactory status) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.status = status;
    }

    static PedidoFactoryNomeada novo(int numero, ClienteFactoryPedido cliente) {
        return new PedidoFactoryNomeada(numero, cliente, StatusPedidoFactory.CRIADO);
    }

    static PedidoFactoryNomeada reconstituido(
            int numero,
            ClienteFactoryPedido cliente,
            StatusPedidoFactory status
    ) {
        return new PedidoFactoryNomeada(numero, cliente, status);
    }

    String resumo() {
        return "Pedido: " + numero
                + " | Cliente: " + cliente.resumo()
                + " | Status: " + status;
    }
}

final class ClienteFactoryPedido {
    private final int id;
    private final String nome;

    ClienteFactoryPedido(int id, String nome) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
    }

    String resumo() {
        return "Cliente " + id + " - " + nome;
    }
}
```

Compile e execute:

```powershell
javac PedidoComFactoryNomeada.java
java PedidoComFactoryNomeada
```

---

## Quando factory pode ser melhor que sobrecarga

Compare:

```java
new PedidoFactoryNomeada(1001, cliente)
new PedidoFactoryNomeada(1002, cliente, StatusPedidoFactory.PAGO)
```

com:

```java
PedidoFactoryNomeada.novo(1001, cliente)
PedidoFactoryNomeada.reconstituido(1002, cliente, StatusPedidoFactory.PAGO)
```

A segunda opção comunica mais intenção.

Ela mostra que existem dois cenários diferentes:

```text
criar novo pedido;
reconstituir pedido existente.
```

Construtores sobrecarregados são bons, mas nem sempre são a melhor opção.

Às vezes o nome do método de fábrica explica melhor a intenção.

---

## Regras práticas para sobrecarga

Use sobrecarga quando:

```text
existem poucos caminhos de criação;
os parâmetros são claramente diferentes;
os valores padrão são seguros;
a leitura fica melhor;
a validação pode ser centralizada;
os construtores não ficam ambíguos.
```

Evite sobrecarga quando:

```text
há muitos construtores parecidos;
há vários parâmetros do mesmo tipo;
null pode gerar ambiguidade;
os construtores escondem regras importantes;
factory com nome deixaria mais claro;
a classe começa a parecer um labirinto.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Simples

Execute:

```text
SobrecargaSimples.java
```

Explique:

```text
quais são os dois construtores;
qual construtor chama o outro;
onde a validação acontece.
```

### Parte 2 — Produto

Execute:

```text
ProdutoComConstrutores.java
```

Explique:

```text
qual construtor é o principal;
quais valores padrão foram usados;
por que isso evita duplicação.
```

### Parte 3 — Pedido

Execute:

```text
PedidoComConstrutores.java
```

Teste:

```text
cliente inativo;
total nulo;
status nulo;
número zero.
```

Observe que a validação fica centralizada.

### Parte 4 — Dinheiro

Execute:

```text
DinheiroComConstrutores.java
```

Explique:

```text
como String vira BigDecimal;
por que converterTexto é static;
por que this(...) precisa vir primeiro.
```

### Parte 5 — OS

Execute:

```text
OrdemServicoComConstrutores.java
```

Compare:

```text
criação com CodigoOs e Periodo prontos;
criação com String, LocalDate e Turno.
```

### Parte 6 — Factory nomeada

Execute:

```text
PedidoComFactoryNomeada.java
```

Explique:

```text
por que novo(...) e reconstituido(...) comunicam intenção melhor que alguns construtores.
```

---

## Desafio prático

Crie o arquivo:

```text
SobrecargaConstrutoresContrato.java
```

Modele um contrato com sobrecarga de construtores.

Classes sugeridas:

```text
ContratoSobrecarga;
ClienteContratoSobrecarga;
ServicoContratoSobrecarga;
DinheiroContratoSobrecarga;
PeriodoContratoSobrecarga.
```

Enums:

```java
enum StatusContratoSobrecarga {
    RASCUNHO,
    ATIVO,
    CANCELADO
}
```

Regras:

```text
Contrato tem código.
Contrato tem cliente.
Contrato tem serviço.
Contrato tem período.
Contrato tem status.
Contrato novo nasce como RASCUNHO.
Contrato pode ser criado com período pronto.
Contrato pode ser criado com data início e data fim.
Contrato pode ser reconstituído com status informado.
Cliente precisa estar ativo.
Serviço precisa ter valor mensal positivo.
Período precisa ter fim igual ou posterior ao início.
```

Crie pelo menos três formas de criação:

```java
new ContratoSobrecarga(codigo, cliente, servico, periodo);
new ContratoSobrecarga(codigo, cliente, servico, inicio, fim);
ContratoSobrecarga.reconstituido(codigo, cliente, servico, periodo, status);
```

Use `this(...)` para reaproveitar construtores.

Use factory nomeada para o caso de reconstituição.

Métodos esperados:

```text
valorTotal();
ativo();
resumo();
```

Teste:

```text
contrato novo;
contrato com período por datas;
contrato reconstituído como ATIVO;
cliente inativo;
período inválido;
serviço com valor zero.
```

---

## Erros comuns

### 1. Duplicar validação em todos os construtores

Centralize no construtor principal.

### 2. Esquecer que this(...) deve ser a primeira instrução

Não coloque código antes dele.

### 3. Criar construtores demais

Muitos caminhos de criação confundem.

### 4. Usar valores padrão perigosos

Valor padrão não deve esconder dado obrigatório.

### 5. Criar sobrecargas com muitos parâmetros do mesmo tipo

Fica fácil inverter ordem.

### 6. Ignorar static factory

Às vezes um método nomeado é mais claro que outro construtor.

### 7. Permitir estado inválido por um construtor alternativo

Todo construtor público deve criar objeto válido.

### 8. Confundir sobrecarga com sobrescrita

Sobrecarga é ter mesmo nome com parâmetros diferentes.  
Sobrescrita será aprofundada quando estudarmos herança.

---

## Debug recomendado

Use debug em:

```text
ProdutoComConstrutores.java
PedidoComConstrutores.java
DinheiroComConstrutores.java
OrdemServicoComConstrutores.java
PedidoComFactoryNomeada.java
```

Breakpoints recomendados:

```java
this(codigo, nome, preco, 0);
this(codigo, nome, preco, estoqueInicial, StatusProdutoConstrutor.ATIVO);

this(numero, cliente, total, StatusPedidoConstrutor.CRIADO);

this(converterTexto(valor));

this(new CodigoOsConstrutor(codigo), cliente, new PeriodoOsConstrutor(data, turno));

PedidoFactoryNomeada.novo(...)
PedidoFactoryNomeada.reconstituido(...)
```

Observe:

```text
qual construtor é chamado primeiro;
para qual construtor ele delega;
onde a validação principal acontece;
quais valores padrão são aplicados;
quando factory nomeada cria o objeto.
```

O objetivo do debug é enxergar o fluxo de nascimento do objeto.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é sobrecarga de construtores?
2. Por que this(...) ajuda a evitar duplicação?
3. Quando uma static factory pode ser melhor que outro construtor?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar sobrecarga de construtores;
identificar assinatura de construtor;
criar múltiplos construtores;
usar this(...);
respeitar a regra de this(...) ser a primeira instrução;
centralizar validações;
criar construtor principal;
definir valores padrão seguros;
evitar construtores ambíguos;
diferenciar sobrecarga de factory;
usar factory nomeada quando melhorar intenção;
aplicar sobrecarga em entidade;
aplicar sobrecarga em objeto de valor;
debugar encadeamento de construtores;
resolver o desafio de contrato;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-123-sobrecarga-de-construtores
git commit -m "Aula 123: pratica sobrecarga de construtores"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
sobrecarga de construtores permite oferecer formas diferentes e válidas de criar um objeto.
```

Você viu que o ponto mais importante não é apenas ter vários construtores.

O ponto é criar caminhos de nascimento claros, seguros e sem duplicação.

Use:

```text
this(...) para reaproveitar construtores;
construtor principal para centralizar validação;
valores padrão com critério;
static factory quando o nome comunica melhor a intenção.
```

Na próxima aula, vamos estudar `this` e autorreferência com mais profundidade.

Vamos entender como o objeto se refere a si mesmo, quando `this` é obrigatório, quando é opcional e como ele ajuda em construtores, métodos e encadeamento de chamadas.
