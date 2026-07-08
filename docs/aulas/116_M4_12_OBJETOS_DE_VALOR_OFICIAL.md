# 116 — M4.12 — Objetos de valor

## Objetivo da aula

Nesta aula você vai aprender o que são objetos de valor em Orientação a Objetos com Java.

Nas aulas anteriores, você estudou composição e relacionamento entre objetos. Agora vamos aprofundar um tipo de objeto muito importante para modelagem profissional:

```text
objeto de valor.
```

Um objeto de valor representa um conceito do domínio que é definido pelo seu valor, e não por uma identidade própria.

Exemplos:

```text
Dinheiro;
Email;
Telefone;
CPF;
CEP;
Periodo;
Percentual;
Codigo;
Quantidade;
Endereco;
DataAgendamento.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é objeto de valor;
diferenciar objeto de valor de entidade;
criar objetos pequenos e imutáveis;
validar regras no construtor;
substituir String, BigDecimal e int soltos por tipos mais expressivos;
usar objetos de valor dentro de outros objetos;
entender por que objetos de valor melhoram clareza, segurança e manutenção;
identificar conceitos do domínio que merecem virar classe própria;
evitar exagero na criação de objetos pequenos.
```

Essa aula é muito importante porque objetos de valor aparecem bastante em sistemas backend bem modelados.

Eles ajudam a transformar dados soltos em conceitos claros.

---

## A ideia central

Um objeto de valor representa uma informação importante do domínio.

Ele não é identificado por um ID.

Ele é identificado pelo valor que carrega.

Exemplo:

```text
R$ 100,00
```

Esse valor não tem uma identidade própria.

Se duas partes do sistema possuem `R$ 100,00`, estamos falando do mesmo valor conceitual.

Outro exemplo:

```text
ana@email.com
```

Um e-mail representa um valor.

Se duas variáveis possuem `ana@email.com`, elas representam o mesmo e-mail.

Isso é diferente de uma entidade, como `Cliente`.

Dois clientes podem ter o mesmo nome, mas ainda serem pessoas diferentes.

---

## Objeto de valor versus entidade

Essa diferença é essencial.

### Entidade

Entidade possui identidade.

Exemplos:

```text
Cliente;
Pedido;
OrdemServico;
Produto;
Contrato;
Pagamento;
Usuario.
```

Mesmo que dois clientes tenham o mesmo nome, eles podem ser clientes diferentes.

Exemplo:

```text
Cliente 1: Ana Silva, id 10
Cliente 2: Ana Silva, id 25
```

O nome é igual, mas a identidade é diferente.

### Objeto de valor

Objeto de valor não tem identidade própria.

Ele é definido pelos seus dados.

Exemplos:

```text
Email;
Telefone;
Dinheiro;
Endereco;
Periodo;
Cpf;
Cep.
```

Se dois objetos `Email` possuem o mesmo valor, eles representam o mesmo e-mail.

A regra prática é:

```text
entidade tem identidade;
objeto de valor tem valor.
```

---

## Por que criar objeto de valor

Sem objeto de valor, usamos tipos genéricos demais:

```java
String email;
String telefone;
String cep;
BigDecimal valor;
int quantidade;
```

Isso funciona, mas perde significado.

O Java sabe que `email` é `String`.

Mas o domínio sabe que aquilo é um e-mail.

São coisas diferentes.

Com objeto de valor:

```java
EmailValor email;
TelefoneValor telefone;
CepValor cep;
DinheiroValor valor;
QuantidadeValor quantidade;
```

O código fica mais expressivo.

Além disso, cada objeto pode proteger sua própria regra.

Exemplo:

```java
new EmailValor("anaemail.com");
```

pode lançar erro, porque não contém `@`.

---

## Características comuns de objeto de valor

Um bom objeto de valor normalmente possui:

```text
atributos privados;
atributos final;
validação no construtor;
ausência de setters;
imutabilidade;
métodos de comportamento simples;
nome forte no domínio;
pouca responsabilidade;
baixo acoplamento.
```

Objeto de valor deve ser pequeno, claro e confiável.

Ele deve nascer válido e permanecer válido.

---

## Exemplo ruim: dados soltos

Crie a pasta:

```powershell
mkdir labs\m4\aula-116-objetos-de-valor
cd labs\m4\aula-116-objetos-de-valor
```

Crie o arquivo:

```text
PedidoComDadosSoltos.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoComDadosSoltos {
    public static void main(String[] args) {
        PedidoSolto pedido = new PedidoSolto(
                "Ana Silva",
                "anaemail.com",
                "11999999999",
                new BigDecimal("-150.00")
        );

        System.out.println(pedido.resumo());
    }
}

class PedidoSolto {
    private final String cliente;
    private final String email;
    private final String telefone;
    private final BigDecimal total;

    PedidoSolto(String cliente, String email, String telefone, BigDecimal total) {
        this.cliente = cliente;
        this.email = email;
        this.telefone = telefone;
        this.total = total;
    }

    String resumo() {
        return "Cliente: " + cliente
                + " | E-mail: " + email
                + " | Telefone: " + telefone
                + " | Total: R$ " + total;
    }
}
```

Compile e execute:

```powershell
javac PedidoComDadosSoltos.java
java PedidoComDadosSoltos
```

O código compila, mas o modelo aceitou dados ruins:

```text
e-mail sem @;
valor negativo.
```

O problema é que `String` e `BigDecimal` soltos não carregam as regras do domínio.

---

## Primeiro objeto de valor: Email

Agora vamos criar um objeto específico para e-mail.

Crie:

```text
EmailObjetoValor.java
```

Código:

```java
public class EmailObjetoValor {
    public static void main(String[] args) {
        EmailValor email = new EmailValor("Ana.Silva@Email.com");

        System.out.println("E-mail normalizado: " + email.valor());
        System.out.println("Domínio: " + email.dominio());
        System.out.println("É corporativo: " + email.corporativo());
    }
}

class EmailValor {
    private final String valor;

    EmailValor(String valor) {
        if (!emailValido(valor)) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }

    String dominio() {
        return valor.substring(valor.indexOf("@") + 1);
    }

    boolean corporativo() {
        return !dominio().equals("gmail.com")
                && !dominio().equals("hotmail.com")
                && !dominio().equals("outlook.com");
    }

    boolean mesmoDominio(EmailValor outro) {
        if (outro == null) {
            return false;
        }

        return dominio().equals(outro.dominio());
    }

    String resumo() {
        return valor;
    }

    private boolean emailValido(String valor) {
        return valor != null
                && !valor.isBlank()
                && valor.contains("@")
                && valor.indexOf("@") > 0
                && valor.indexOf("@") < valor.length() - 1;
    }
}
```

Compile e execute:

```powershell
javac EmailObjetoValor.java
java EmailObjetoValor
```

Agora e-mail não é só uma `String`.

É um conceito com regra.

---

## O que melhorou com EmailValor

Antes:

```java
String email;
```

Agora:

```java
EmailValor email;
```

A diferença é grande.

`EmailValor` sabe:

```text
validar se o valor é aceitável;
normalizar para minúsculo;
extrair domínio;
verificar se é corporativo;
comparar domínio com outro e-mail.
```

Essas regras não ficam espalhadas pelo sistema.

Ficam dentro do objeto que representa o conceito.

---

## Segundo objeto de valor: Dinheiro

Você já estudou `BigDecimal`.

Agora vamos criar um objeto de valor para representar dinheiro.

Crie:

```text
DinheiroObjetoValor.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class DinheiroObjetoValor {
    public static void main(String[] args) {
        DinheiroValor preco = new DinheiroValor(new BigDecimal("199.90"));
        DinheiroValor frete = new DinheiroValor(new BigDecimal("20.00"));

        DinheiroValor total = preco.somar(frete);
        DinheiroValor comDesconto = total.aplicarDescontoPercentual(new BigDecimal("10"));

        System.out.println("Preço: " + preco.formatado());
        System.out.println("Frete: " + frete.formatado());
        System.out.println("Total: " + total.formatado());
        System.out.println("Com desconto: " + comDesconto.formatado());
        System.out.println("Preço original continua: " + preco.formatado());
    }
}

class DinheiroValor {
    private final BigDecimal valor;

    DinheiroValor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroValor zero() {
        return new DinheiroValor(BigDecimal.ZERO);
    }

    BigDecimal valor() {
        return valor;
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    boolean negativo() {
        return valor.compareTo(BigDecimal.ZERO) < 0;
    }

    boolean maiorOuIgual(DinheiroValor outro) {
        if (outro == null) {
            return false;
        }

        return valor.compareTo(outro.valor) >= 0;
    }

    DinheiroValor somar(DinheiroValor outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroValor(valor.add(outro.valor));
    }

    DinheiroValor subtrair(DinheiroValor outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroValor(valor.subtract(outro.valor));
    }

    DinheiroValor multiplicar(int quantidade) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        return new DinheiroValor(valor.multiply(BigDecimal.valueOf(quantidade)));
    }

    DinheiroValor aplicarDescontoPercentual(BigDecimal percentual) {
        if (percentual == null || percentual.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Percentual não pode ser negativo.");
        }

        if (percentual.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Percentual não pode ser maior que 100.");
        }

        BigDecimal fator = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal desconto = valor.multiply(fator);

        return new DinheiroValor(valor.subtract(desconto));
    }

    String formatado() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac DinheiroObjetoValor.java
java DinheiroObjetoValor
```

---

## Por que criar DinheiroValor

Poderíamos usar `BigDecimal` diretamente.

Mas `DinheiroValor` deixa o domínio mais claro.

Compare:

```java
BigDecimal total = preco.multiply(BigDecimal.valueOf(quantidade));
```

com:

```java
DinheiroValor total = preco.multiplicar(quantidade);
```

O segundo expressa uma operação do domínio.

Além disso, `DinheiroValor` centraliza:

```text
escala de 2 casas;
soma;
subtração;
multiplicação por quantidade;
desconto percentual;
formatação;
comparações.
```

Isso reduz repetição e evita regra espalhada.

---

## Objeto de valor deve ser imutável

Observe que `DinheiroValor` não altera o próprio valor.

Esse método:

```java
DinheiroValor somar(DinheiroValor outro) {
    return new DinheiroValor(valor.add(outro.valor));
}
```

retorna um novo objeto.

O objeto original continua igual.

Essa é uma característica muito comum de objetos de valor.

Eles são pequenos, confiáveis e imutáveis.

---

## Terceiro objeto de valor: Telefone

Crie:

```text
TelefoneObjetoValor.java
```

Código:

```java
public class TelefoneObjetoValor {
    public static void main(String[] args) {
        TelefoneValor telefone = new TelefoneValor("11", "999999999");

        System.out.println("DDD: " + telefone.ddd());
        System.out.println("Número: " + telefone.numero());
        System.out.println("Formatado: " + telefone.formatado());

        TelefoneValor outro = new TelefoneValor("11", "988887777");

        System.out.println("Mesmo DDD: " + telefone.mesmoDdd(outro));
    }
}

class TelefoneValor {
    private final String ddd;
    private final String numero;

    TelefoneValor(String ddd, String numero) {
        if (!textoInformado(ddd)) {
            throw new IllegalArgumentException("DDD é obrigatório.");
        }

        if (ddd.length() != 2) {
            throw new IllegalArgumentException("DDD deve ter 2 caracteres.");
        }

        if (!apenasDigitos(ddd)) {
            throw new IllegalArgumentException("DDD deve conter apenas números.");
        }

        if (!textoInformado(numero)) {
            throw new IllegalArgumentException("Número é obrigatório.");
        }

        if (numero.length() < 8 || numero.length() > 9) {
            throw new IllegalArgumentException("Número deve ter 8 ou 9 dígitos.");
        }

        if (!apenasDigitos(numero)) {
            throw new IllegalArgumentException("Número deve conter apenas dígitos.");
        }

        this.ddd = ddd;
        this.numero = numero;
    }

    String ddd() {
        return ddd;
    }

    String numero() {
        return numero;
    }

    String formatado() {
        return "(" + ddd + ") " + numero;
    }

    boolean mesmoDdd(TelefoneValor outro) {
        if (outro == null) {
            return false;
        }

        return ddd.equals(outro.ddd);
    }

    TelefoneValor comNumero(String novoNumero) {
        return new TelefoneValor(ddd, novoNumero);
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    private boolean apenasDigitos(String valor) {
        for (int i = 0; i < valor.length(); i++) {
            if (!Character.isDigit(valor.charAt(i))) {
                return false;
            }
        }

        return true;
    }
}
```

Compile e execute:

```powershell
javac TelefoneObjetoValor.java
java TelefoneObjetoValor
```

Aqui, telefone não é só uma `String`.

Ele tem:

```text
DDD;
número;
validação;
formatação;
comparação de DDD;
criação de novo telefone com outro número.
```

---

## Quarto objeto de valor: Período

Período é outro excelente objeto de valor.

Ele pode representar:

```text
vigência de contrato;
período de atendimento;
intervalo de relatório;
janela de agendamento;
período de apuração.
```

Crie:

```text
PeriodoObjetoValor.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class PeriodoObjetoValor {
    public static void main(String[] args) {
        PeriodoValor vigencia = new PeriodoValor(
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        LocalDate dataConsulta = LocalDate.of(2026, 7, 10);

        System.out.println("Período: " + vigencia.resumo());
        System.out.println("Duração em dias: " + vigencia.duracaoEmDias());
        System.out.println("Contém " + dataConsulta + ": " + vigencia.contem(dataConsulta));
    }
}

class PeriodoValor {
    private final LocalDate inicio;
    private final LocalDate fim;

    PeriodoValor(LocalDate inicio, LocalDate fim) {
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

    LocalDate inicio() {
        return inicio;
    }

    LocalDate fim() {
        return fim;
    }

    long duracaoEmDias() {
        return ChronoUnit.DAYS.between(inicio, fim) + 1;
    }

    boolean contem(LocalDate data) {
        if (data == null) {
            return false;
        }

        return !data.isBefore(inicio) && !data.isAfter(fim);
    }

    boolean encerradoEm(LocalDate referencia) {
        if (referencia == null) {
            return false;
        }

        return fim.isBefore(referencia);
    }

    String resumo() {
        return inicio + " até " + fim;
    }
}
```

Compile e execute:

```powershell
javac PeriodoObjetoValor.java
java PeriodoObjetoValor
```

Esse objeto encapsula regras que seriam repetidas em várias partes do sistema.

---

## Usando objetos de valor em composição

Agora vamos juntar os conceitos.

Crie:

```text
PedidoComObjetosDeValor.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoComObjetosDeValor {
    public static void main(String[] args) {
        EmailPedidoValor email = new EmailPedidoValor("ana@email.com");
        TelefonePedidoValor telefone = new TelefonePedidoValor("11", "999999999");

        ClientePedidoValor cliente = new ClientePedidoValor(
                "Ana Silva",
                email,
                telefone
        );

        DinheiroPedidoValor preco = new DinheiroPedidoValor(new BigDecimal("199.90"));

        ProdutoPedidoValor produto = new ProdutoPedidoValor(
                "PROD-001",
                "Cadeira",
                preco
        );

        ItemPedidoValor item = new ItemPedidoValor(produto, 2);

        PedidoValor pedido = new PedidoValor(
                1001,
                cliente,
                item
        );

        System.out.println(pedido.resumo());
    }
}

class PedidoValor {
    private final int numero;
    private final ClientePedidoValor cliente;
    private final ItemPedidoValor item;

    PedidoValor(int numero, ClientePedidoValor cliente, ItemPedidoValor item) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.item = item;
    }

    DinheiroPedidoValor total() {
        return item.subtotal();
    }

    String resumo() {
        return "Pedido: " + numero
                + "\nCliente: " + cliente.resumo()
                + "\nItem: " + item.resumo()
                + "\nTotal: " + total().formatado();
    }
}

class ClientePedidoValor {
    private final String nome;
    private final EmailPedidoValor email;
    private final TelefonePedidoValor telefone;

    ClientePedidoValor(String nome, EmailPedidoValor email, TelefonePedidoValor telefone) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (telefone == null) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    String resumo() {
        return nome + " | " + email.valor() + " | " + telefone.formatado();
    }
}

class ProdutoPedidoValor {
    private final String codigo;
    private final String nome;
    private final DinheiroPedidoValor preco;

    ProdutoPedidoValor(String codigo, String nome, DinheiroPedidoValor preco) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do produto é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }

        if (preco == null || !preco.positivo()) {
            throw new IllegalArgumentException("Preço deve ser positivo.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
    }

    String codigo() {
        return codigo;
    }

    String nome() {
        return nome;
    }

    DinheiroPedidoValor preco() {
        return preco;
    }

    String resumo() {
        return codigo + " - " + nome + " | " + preco.formatado();
    }
}

class ItemPedidoValor {
    private final ProdutoPedidoValor produto;
    private final int quantidade;

    ItemPedidoValor(ProdutoPedidoValor produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.produto = produto;
        this.quantidade = quantidade;
    }

    DinheiroPedidoValor subtotal() {
        return produto.preco().multiplicar(quantidade);
    }

    String resumo() {
        return produto.resumo()
                + " | Quantidade: " + quantidade
                + " | Subtotal: " + subtotal().formatado();
    }
}

class EmailPedidoValor {
    private final String valor;

    EmailPedidoValor(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }
}

class TelefonePedidoValor {
    private final String ddd;
    private final String numero;

    TelefonePedidoValor(String ddd, String numero) {
        if (ddd == null || ddd.isBlank() || ddd.length() != 2) {
            throw new IllegalArgumentException("DDD inválido.");
        }

        if (numero == null || numero.isBlank() || numero.length() < 8) {
            throw new IllegalArgumentException("Número inválido.");
        }

        this.ddd = ddd;
        this.numero = numero;
    }

    String formatado() {
        return "(" + ddd + ") " + numero;
    }
}

class DinheiroPedidoValor {
    private final BigDecimal valor;

    DinheiroPedidoValor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    DinheiroPedidoValor multiplicar(int quantidade) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        return new DinheiroPedidoValor(valor.multiply(BigDecimal.valueOf(quantidade)));
    }

    String formatado() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac PedidoComObjetosDeValor.java
java PedidoComObjetosDeValor
```

---

## O que esse exemplo ensina

Agora o pedido não usa apenas dados primitivos e strings soltas.

Ele usa objetos com significado:

```text
EmailPedidoValor;
TelefonePedidoValor;
DinheiroPedidoValor;
ClientePedidoValor;
ProdutoPedidoValor;
ItemPedidoValor.
```

Isso deixa o modelo mais forte.

Se alguém tentar criar:

```java
new EmailPedidoValor("anaemail.com");
```

o erro acontece imediatamente.

Se tentar:

```java
new DinheiroPedidoValor(null);
```

o erro também acontece.

Objetos de valor ajudam a impedir que dados ruins caminhem pelo sistema.

---

## Objeto de valor com record

Java `record` pode ser uma boa opção para objetos de valor simples.

Exemplo:

```text
um código;
um intervalo;
um par de datas;
um resumo imutável.
```

Crie:

```text
CodigoOsRecordValor.java
```

Código:

```java
public class CodigoOsRecordValor {
    public static void main(String[] args) {
        CodigoOs codigo = new CodigoOs("OS-2026-0001");

        System.out.println("Código: " + codigo.valor());
        System.out.println("Ano: " + codigo.ano());
        System.out.println("Resumo: " + codigo.resumo());
    }
}

record CodigoOs(String valor) {
    CodigoOs {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (!valor.startsWith("OS-")) {
            throw new IllegalArgumentException("Código da OS deve iniciar com OS-.");
        }
    }

    String ano() {
        return valor.substring(3, 7);
    }

    String resumo() {
        return "Código da ordem de serviço: " + valor;
    }
}
```

Compile e execute:

```powershell
javac CodigoOsRecordValor.java
java CodigoOsRecordValor
```

`record` já cria estrutura imutável simples.

Mas não use `record` no automático para tudo.

Se a regra crescer muito, uma classe normal pode ficar mais clara.

---

## Quando criar objeto de valor

Considere criar objeto de valor quando o conceito:

```text
tem regra própria;
tem formatação própria;
aparece em vários lugares;
não deve ser qualquer String ou número;
representa um valor importante do domínio;
precisa ser validado sempre;
tem operações simples relacionadas a ele;
fica mais claro com um nome específico.
```

Bons exemplos:

```text
Email;
Telefone;
Cpf;
Cep;
Dinheiro;
Percentual;
Periodo;
CodigoOs;
CodigoPedido;
Quantidade;
Endereco.
```

---

## Quando não criar objeto de valor

Não exagere.

Talvez não valha criar objeto de valor quando:

```text
o campo é apenas uma observação livre;
o texto não tem regra;
o conceito não se repete;
o objeto criado não adiciona clareza;
a classe nova só embrulha uma String sem motivo;
o curso ou projeto ainda está em fase muito simples.
```

Exemplo possivelmente exagerado:

```java
class NomeRua {
    private final String valor;
}
```

Pode fazer sentido em algum domínio muito rigoroso, mas geralmente `Endereco` já resolve melhor.

A pergunta principal é:

```text
isso deixa o modelo mais claro e seguro?
```

Se sim, considere criar.

Se não, talvez seja excesso.

---

## Cuidado: objeto de valor inválido continua inválido

Objeto de valor deve validar no construtor.

Se ele nascer inválido, o problema fica encapsulado dentro dele.

Exemplo ruim:

```java
class EmailFraco {
    private final String valor;

    EmailFraco(String valor) {
        this.valor = valor;
    }
}
```

Isso só troca `String` por classe, mas não protege nada.

Objeto de valor bom precisa ter regra.

---

## Cuidado: objeto de valor não deve depender de infraestrutura

Objeto de valor não deve fazer coisas como:

```text
salvar no banco;
chamar API externa;
consultar endpoint;
enviar mensagem;
ler arquivo;
fazer query SQL;
acessar framework web.
```

Ele deve representar valor e regra simples.

Exemplo:

```java
EmailValor
```

pode validar formato simples.

Mas não deveria enviar e-mail.

```java
DinheiroValor
```

pode somar, subtrair e aplicar desconto.

Mas não deveria consultar cotação externa.

Objeto de valor deve ser pequeno e focado.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar dados soltos

Execute:

```text
PedidoComDadosSoltos.java
```

Observe que ele aceita:

```text
e-mail inválido;
valor negativo.
```

Explique por que o compilador não consegue proteger isso.

### Parte 2 — Criar EmailValor

Execute:

```text
EmailObjetoValor.java
```

Teste:

```text
e-mail vazio;
e-mail sem @;
e-mail com @ no começo;
e-mail com @ no final.
```

Observe as exceções.

### Parte 3 — Criar DinheiroValor

Execute:

```text
DinheiroObjetoValor.java
```

Teste:

```text
soma;
subtração;
desconto;
multiplicação.
```

Observe que os objetos originais não mudam.

### Parte 4 — Criar TelefoneValor

Execute:

```text
TelefoneObjetoValor.java
```

Teste:

```text
DDD com 1 caractere;
DDD com letras;
número curto;
número com letra.
```

### Parte 5 — Usar objetos de valor no Pedido

Execute:

```text
PedidoComObjetosDeValor.java
```

Explique:

```text
quais campos deixaram de ser String;
qual campo deixou de ser BigDecimal solto;
qual validação ficou mais próxima do conceito correto.
```

---

## Desafio prático

Crie o arquivo:

```text
ObjetosValorOrdemServico.java
```

Modele uma ordem de serviço usando objetos de valor.

Objetos sugeridos:

```text
CodigoOrdemServicoValor;
TelefoneClienteValor;
PeriodoAtendimentoValor;
EnderecoAtendimentoValor;
OrdemServicoComValores.
```

Use:

```java
LocalDate;
enum TurnoAtendimentoValor;
enum StatusOsValor;
```

Regras:

```text
Código da OS deve iniciar com OS-.
Telefone deve ter DDD e número válidos.
Período deve ter data e turno.
Endereço deve ter rua, número, cidade e estado.
Estado deve ter 2 caracteres.
OS deve ter código, telefone, período, endereço e status.
OS pode reagendar se status não for CONCLUIDA nem CANCELADA.
```

Métodos sugeridos:

```text
codigo.resumo();
telefone.formatado();
periodo.resumo();
endereco.formatado();
os.podeReagendar();
os.resumo();
```

Aplique validações nos construtores.

Não use `String` solta para tudo.

---

## Erros comuns

### 1. Criar classe que só embrulha String sem regra

Objeto de valor precisa adicionar significado.

### 2. Criar setter em objeto de valor

Objeto de valor geralmente deve ser imutável.

### 3. Usar objeto de valor para fazer infraestrutura

Objeto de valor não envia e-mail, não salva banco e não chama API.

### 4. Exagerar e criar classe para qualquer coisa

Use critério. Nem todo campo simples precisa virar objeto.

### 5. Manter BigDecimal espalhado para todo lado

Para dinheiro importante no domínio, considere um objeto como `DinheiroValor`.

### 6. Não validar no construtor

Objeto de valor deve nascer válido.

### 7. Confundir objeto de valor com entidade

Objeto de valor não tem identidade própria.

### 8. Ignorar imutabilidade

Se o valor muda, geralmente você cria outro objeto de valor.

---

## Debug recomendado

Use debug em:

```text
EmailObjetoValor.java
DinheiroObjetoValor.java
TelefoneObjetoValor.java
PeriodoObjetoValor.java
PedidoComObjetosDeValor.java
```

Breakpoints recomendados:

```java
new EmailValor(...)
new DinheiroValor(...)
new TelefoneValor(...)
new PeriodoValor(...)
new PedidoValor(...)
```

Observe:

```text
validações no construtor;
normalização de dados;
atributos final recebendo valores;
métodos retornando novos objetos;
objetos de valor sendo usados dentro de objetos maiores.
```

No exemplo `PedidoComObjetosDeValor`, entre em:

```java
pedido.resumo()
pedido.total()
item.subtotal()
produto.preco().multiplicar(...)
```

Veja como o cálculo passa por objetos menores com significado.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é um objeto de valor?
2. Qual diferença entre objeto de valor e entidade?
3. Qual String solta você transformaria em objeto de valor?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar objeto de valor;
diferenciar objeto de valor de entidade;
criar objeto de valor imutável;
usar atributos private final;
validar no construtor;
evitar setters;
usar BigDecimal dentro de um objeto Dinheiro;
usar LocalDate dentro de um objeto Periodo;
substituir String solta por Email, Telefone ou Codigo;
usar objeto de valor em composição;
entender quando não criar objeto de valor;
usar record para objeto simples;
debugar objetos de valor;
resolver o desafio da OS com objetos de valor;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-116-objetos-de-valor
git commit -m "Aula 116: pratica objetos de valor"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
conceitos importantes do domínio merecem tipos importantes no código.
```

Em vez de deixar tudo como `String`, `int` e `BigDecimal` soltos, você pode criar objetos como:

```text
EmailValor;
TelefoneValor;
DinheiroValor;
PeriodoValor;
CodigoOs;
Endereco.
```

Isso deixa o código mais expressivo, mais seguro e mais fácil de manter.

Objetos de valor também reforçam a ideia de imutabilidade: eles nascem válidos e não mudam depois.

Na próxima aula, vamos estudar entidades.

Vamos entender melhor objetos que possuem identidade, ciclo de vida e continuidade dentro do sistema, como Cliente, Pedido, Produto, Pagamento e OrdemServico.
