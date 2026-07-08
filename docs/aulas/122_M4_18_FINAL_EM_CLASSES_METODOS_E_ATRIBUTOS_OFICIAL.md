# 122 — M4.18 — final em classes, métodos e atributos

## Objetivo da aula

Nesta aula você vai aprender a usar `final` com critério em Java.

Na aula anterior, você estudou `static`, entendendo a diferença entre algo que pertence à classe e algo que pertence ao objeto. Agora vamos estudar uma palavra-chave que aparece muito junto de boas práticas de modelagem:

```java
final
```

Ao final da aula, você deve conseguir:

```text
explicar o que significa final;
usar final em variáveis locais;
usar final em parâmetros;
usar final em atributos;
entender final em referência de objeto;
entender que final não significa imutabilidade profunda;
usar final em métodos;
usar final em classes;
entender quando final protege intenção;
entender quando final é exagero;
diferenciar final de static final;
aplicar final em entidades, objetos de valor e constantes.
```

Essa aula é importante porque `final` ajuda a comunicar intenção.

Quando você marca algo como `final`, está dizendo:

```text
isso não deve ser reatribuído;
isso não deve ser sobrescrito;
isso não deve ser herdado;
isso deve permanecer estável dentro do escopo definido.
```

Mas `final` também precisa de critério.

Usar em tudo sem pensar pode deixar o código pesado.  
Não usar onde faz sentido pode deixar o modelo frágil.

---

## A ideia central

`final` limita mudança.

Mas o tipo de mudança limitada depende de onde você usa.

### Em variável local

```java
final int quantidade = 10;
```

A variável não pode receber outro valor.

### Em parâmetro

```java
void processar(final String nome) {
}
```

O parâmetro não pode ser reatribuído dentro do método.

### Em atributo

```java
private final String codigo;
```

O atributo precisa ser inicializado e não pode ser reatribuído depois.

### Em método

```java
final void cancelar() {
}
```

O método não pode ser sobrescrito por uma subclasse.

### Em classe

```java
final class Dinheiro {
}
```

A classe não pode ser herdada.

A palavra é a mesma, mas o efeito depende do contexto.

---

## final não é static

Muita gente confunde:

```java
static
```

com:

```java
final
```

Eles são coisas diferentes.

`static` fala sobre pertencimento:

```text
pertence à classe, não ao objeto.
```

`final` fala sobre restrição de mudança:

```text
não pode reatribuir, sobrescrever ou herdar, dependendo do uso.
```

Você pode ter:

```java
private final String codigo;
```

Isso é atributo do objeto e não pode ser reatribuído.

Você também pode ter:

```java
private static final int LIMITE = 3;
```

Isso é uma constante da classe.

`static final` é muito usado para constantes, mas `final` sozinho também é muito importante.

---

## Exemplo 1 — variável local final

Crie a pasta:

```powershell
mkdir labs\m4\aula-122-final-em-classes-metodos-e-atributos
cd labs\m4\aula-122-final-em-classes-metodos-e-atributos
```

Crie o arquivo:

```text
FinalVariavelLocal.java
```

Código:

```java
public class FinalVariavelLocal {
    public static void main(String[] args) {
        final int quantidade = 2;
        final int valorUnitario = 150;

        int total = quantidade * valorUnitario;

        System.out.println("Quantidade: " + quantidade);
        System.out.println("Valor unitário: " + valorUnitario);
        System.out.println("Total: " + total);

        // Descomente a linha abaixo para ver o erro de compilação:
        // quantidade = 3;
    }
}
```

Compile e execute:

```powershell
javac FinalVariavelLocal.java
java FinalVariavelLocal
```

Depois descomente:

```java
quantidade = 3;
```

Compile novamente.

Você verá erro.

---

## O que aconteceu

Ao declarar:

```java
final int quantidade = 2;
```

você disse:

```text
a variável quantidade não pode ser reatribuída.
```

Isso não significa que o número 2 ficou mais seguro no universo.

Significa apenas que, naquele escopo, a variável `quantidade` não pode receber outro valor.

`final` ajuda a evitar reatribuições acidentais.

---

## final em variável local vale a pena?

Depende.

Algumas equipes usam bastante:

```java
final var total = calcularTotal();
```

Outras preferem usar com moderação.

Nesta formação, a regra prática é:

```text
use final em variável local quando isso melhorar a leitura ou impedir reatribuição acidental importante.
```

Não precisa sair colocando `final` em toda variável local agora.

Mas é importante entender o efeito.

---

## Exemplo 2 — parâmetro final

Crie:

```text
FinalParametro.java
```

Código:

```java
public class FinalParametro {
    public static void main(String[] args) {
        ClienteFinalParametro cliente = new ClienteFinalParametro("Ana Silva");

        System.out.println(cliente.nomeNormalizado("  Carlos Lima  "));
    }
}

class ClienteFinalParametro {
    private final String nome;

    ClienteFinalParametro(final String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.nome = nome;
    }

    String nomeNormalizado(final String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim().toUpperCase();

        // Descomente para ver erro:
        // valor = "OUTRO";
    }

    String nome() {
        return nome;
    }
}
```

Compile e execute:

```powershell
javac FinalParametro.java
java FinalParametro
```

---

## O que final no parâmetro faz

Quando você escreve:

```java
String nomeNormalizado(final String valor)
```

o parâmetro `valor` não pode ser reatribuído dentro do método.

Isso impede algo como:

```java
valor = valor.trim();
```

Algumas pessoas gostam disso porque evita confusão.

Outras acham verboso.

O ponto importante é entender:

```text
final no parâmetro não impede o objeto recebido de mudar;
impede apenas reatribuir a variável do parâmetro.
```

Exemplo conceitual:

```java
void processar(final Cliente cliente) {
    cliente.alterarEmail(...); // pode, se o método existir
    cliente = outroCliente;    // não pode
}
```

Isso é muito importante.

---

## Exemplo 3 — atributo final

Atributo final é muito usado em objetos bem modelados.

Crie:

```text
FinalAtributo.java
```

Código:

```java
public class FinalAtributo {
    public static void main(String[] args) {
        CodigoPedidoFinal codigo = new CodigoPedidoFinal("PED-1001");

        System.out.println(codigo.valor());
        System.out.println(codigo);
    }
}

final class CodigoPedidoFinal {
    private final String valor;

    CodigoPedidoFinal(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith("PED-")) {
            throw new IllegalArgumentException("Código deve iniciar com PED-.");
        }

        this.valor = valor;
    }

    String valor() {
        return valor;
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac FinalAtributo.java
java FinalAtributo
```

---

## O que o atributo final protege

Este atributo:

```java
private final String valor;
```

precisa ser inicializado no construtor.

Depois disso, ele não pode ser reatribuído.

Não é possível fazer:

```java
this.valor = "PED-9999";
```

em outro método.

Isso é ótimo para objetos de valor.

O código do pedido deve nascer válido e permanecer estável.

---

## Atributo final precisa ser inicializado

Se uma classe possui:

```java
private final String codigo;
```

você precisa inicializar esse atributo:

```text
diretamente na declaração;
no construtor;
ou em todos os caminhos possíveis de construtor.
```

Exemplo válido:

```java
private final String status = "ATIVO";
```

Exemplo válido:

```java
Cliente(String nome) {
    this.nome = nome;
}
```

Exemplo inválido:

```java
class Cliente {
    private final String nome;

    Cliente() {
    }
}
```

O compilador reclama, porque `nome` poderia ficar sem valor.

---

## Exemplo 4 — final em entidade

Nem todos os atributos de uma entidade devem ser `final`.

Em entidades, a identidade costuma ser estável.

O estado pode mudar.

Crie:

```text
FinalEmEntidade.java
```

Código:

```java
public class FinalEmEntidade {
    public static void main(String[] args) {
        ProdutoFinalEntidade produto = new ProdutoFinalEntidade(
                "PROD-001",
                "Cadeira",
                10
        );

        System.out.println(produto.resumo());

        produto.vender(2);
        System.out.println("Depois da venda:");
        System.out.println(produto.resumo());

        produto.inativar("Produto fora de linha");
        System.out.println("Depois da inativação:");
        System.out.println(produto.resumo());
    }
}

enum StatusProdutoFinal {
    ATIVO,
    INATIVO
}

class ProdutoFinalEntidade {
    private final String codigo;
    private final String nome;
    private int estoque;
    private StatusProdutoFinal status;
    private String motivoInativacao;

    ProdutoFinalEntidade(String codigo, String nome, int estoqueInicial) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("PROD-")) {
            throw new IllegalArgumentException("Código deve iniciar com PROD-.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (estoqueInicial < 0) {
            throw new IllegalArgumentException("Estoque inicial não pode ser negativo.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.estoque = estoqueInicial;
        this.status = StatusProdutoFinal.ATIVO;
        this.motivoInativacao = "";
    }

    boolean ativo() {
        return status == StatusProdutoFinal.ATIVO;
    }

    boolean disponivelParaVenda() {
        return ativo() && estoque > 0;
    }

    boolean vender(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (!disponivelParaVenda()) {
            return false;
        }

        if (quantidade > estoque) {
            return false;
        }

        estoque -= quantidade;
        return true;
    }

    void inativar(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        status = StatusProdutoFinal.INATIVO;
        motivoInativacao = motivo;
    }

    String resumo() {
        return "Produto: " + codigo
                + " | Nome: " + nome
                + " | Estoque: " + estoque
                + " | Status: " + status
                + " | Motivo: " + motivoInativacao;
    }
}
```

Compile e execute:

```powershell
javac FinalEmEntidade.java
java FinalEmEntidade
```

---

## Análise da entidade

Nesta entidade, usamos `final` em:

```java
private final String codigo;
private final String nome;
```

Esses dados não mudam depois que o produto nasce.

Mas não usamos `final` em:

```java
private int estoque;
private StatusProdutoFinal status;
private String motivoInativacao;
```

Porque esses dados fazem parte do ciclo de vida do produto.

A regra prática:

```text
atributo que não deve mudar depois do construtor pode ser final;
atributo que representa estado controlado do ciclo de vida não deve ser final.
```

---

## final em referência de objeto

Agora um ponto muito importante.

Quando você usa `final` em uma referência de objeto, a referência não pode mudar.

Mas o objeto apontado pode mudar, se ele for mutável.

Crie:

```text
FinalReferenciaObjeto.java
```

Código:

```java
public class FinalReferenciaObjeto {
    public static void main(String[] args) {
        final ContaFinalReferencia conta = new ContaFinalReferencia("Ana Silva", 100);

        System.out.println(conta.resumo());

        conta.depositar(50);
        System.out.println("Depois do depósito:");
        System.out.println(conta.resumo());

        // Descomente para ver erro:
        // conta = new ContaFinalReferencia("Carlos Lima", 200);
    }
}

class ContaFinalReferencia {
    private final String titular;
    private int saldo;

    ContaFinalReferencia(String titular, int saldoInicial) {
        if (titular == null || titular.isBlank()) {
            throw new IllegalArgumentException("Titular é obrigatório.");
        }

        if (saldoInicial < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo.");
        }

        this.titular = titular;
        this.saldo = saldoInicial;
    }

    void depositar(int valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        saldo += valor;
    }

    String resumo() {
        return "Titular: " + titular + " | Saldo: " + saldo;
    }
}
```

Compile e execute:

```powershell
javac FinalReferenciaObjeto.java
java FinalReferenciaObjeto
```

---

## final não significa imutabilidade profunda

Neste exemplo:

```java
final ContaFinalReferencia conta = new ContaFinalReferencia("Ana Silva", 100);
```

Você não pode fazer:

```java
conta = new ContaFinalReferencia("Carlos Lima", 200);
```

Mas pode fazer:

```java
conta.depositar(50);
```

Porque o objeto é mutável.

Então, guarde:

```text
final na referência impede trocar a referência;
não impede mudar o estado interno do objeto.
```

Para criar objeto realmente imutável, você precisa combinar:

```text
atributos final;
sem setters;
tipos internos imutáveis;
não expor objetos mutáveis internos;
métodos que retornam novos objetos;
validação no construtor.
```

---

## final e imutabilidade

Objetos de valor costumam usar muitos atributos `final`.

Exemplo:

```java
final class Email {
    private final String valor;
}
```

Isso ajuda a criar imutabilidade.

Mas não é a única peça.

Um objeto de valor imutável normalmente tem:

```text
classe final ou bem controlada;
atributos private final;
sem setters;
validação no construtor;
métodos que não alteram o estado;
uso de tipos imutáveis internamente.
```

`final` ajuda, mas não faz tudo sozinho.

---

## Exemplo 5 — objeto de valor com final

Crie:

```text
ObjetoValorComFinal.java
```

Código:

```java
import java.util.Objects;

public class ObjetoValorComFinal {
    public static void main(String[] args) {
        EmailFinal email1 = new EmailFinal("Ana@Email.com");
        EmailFinal email2 = new EmailFinal("ana@email.com");

        System.out.println(email1);
        System.out.println(email2);
        System.out.println("Mesmo valor: " + email1.equals(email2));
    }
}

final class EmailFinal {
    private final String valor;

    EmailFinal(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
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

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        EmailFinal email = (EmailFinal) outro;
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

Compile e execute:

```powershell
javac ObjetoValorComFinal.java
java ObjetoValorComFinal
```

---

## Por que a classe EmailFinal é final

Declaramos:

```java
final class EmailFinal
```

Isso impede herança.

Por que isso pode ser interessante?

Porque objeto de valor deve ser previsível.

Se alguém pudesse criar uma subclasse alterando comportamento, a igualdade, validação ou representação poderia ficar confusa.

`final class` comunica:

```text
esta classe foi feita para ser usada como está, não para ser herdada.
```

Esse é um uso comum de `final` em objetos de valor.

---

## final em método

Método final não pode ser sobrescrito por subclasses.

Ainda vamos estudar herança mais adiante, mas já dá para entender a ideia.

Crie:

```text
FinalEmMetodo.java
```

Código:

```java
public class FinalEmMetodo {
    public static void main(String[] args) {
        DocumentoBase documento = new DocumentoBase("DOC-001");

        System.out.println(documento.resumo());
    }
}

class DocumentoBase {
    private final String codigo;

    DocumentoBase(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        this.codigo = codigo;
    }

    final String codigo() {
        return codigo;
    }

    String resumo() {
        return "Documento: " + codigo();
    }
}
```

Compile e execute:

```powershell
javac FinalEmMetodo.java
java FinalEmMetodo
```

Neste exemplo, o método:

```java
final String codigo()
```

não poderia ser sobrescrito por uma subclasse.

Ainda vamos praticar isso melhor quando herança entrar no curso.

Por enquanto, entenda:

```text
final em método protege contra sobrescrita.
```

---

## final em classe

Classe final não pode ser herdada.

Exemplo:

```java
final class Dinheiro {
}
```

Isso significa que não pode existir:

```java
class DinheiroPromocional extends Dinheiro {
}
```

Por que usar?

```text
para proteger objetos de valor;
para impedir alteração de comportamento por herança;
para deixar intenção de design explícita;
para simplificar raciocínio sobre equals/hashCode;
para evitar extensões não planejadas.
```

Classes como `String` são finais em Java.

Isso ajuda a manter comportamento previsível.

---

## Exemplo 6 — classe final para dinheiro

Crie:

```text
ClasseFinalDinheiro.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class ClasseFinalDinheiro {
    public static void main(String[] args) {
        DinheiroFinal preco = DinheiroFinal.de("199.90");
        DinheiroFinal frete = DinheiroFinal.de("20.00");

        DinheiroFinal total = preco.somar(frete);

        System.out.println("Preço: " + preco);
        System.out.println("Frete: " + frete);
        System.out.println("Total: " + total);
    }
}

final class DinheiroFinal {
    private final BigDecimal valor;

    private DinheiroFinal(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroFinal zero() {
        return new DinheiroFinal(BigDecimal.ZERO);
    }

    static DinheiroFinal de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroFinal(new BigDecimal(valor));
    }

    DinheiroFinal somar(DinheiroFinal outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroFinal(valor.add(outro.valor));
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        DinheiroFinal dinheiro = (DinheiroFinal) outro;
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
javac ClasseFinalDinheiro.java
java ClasseFinalDinheiro
```

---

## O que esse exemplo reúne

Aqui temos:

```java
final class DinheiroFinal
```

A classe não pode ser herdada.

Temos:

```java
private final BigDecimal valor;
```

O atributo não pode ser reatribuído.

Temos:

```java
static DinheiroFinal de(String valor)
```

Método de fábrica.

Temos:

```java
DinheiroFinal somar(DinheiroFinal outro)
```

Retornando novo objeto, sem alterar o atual.

Esse é um objeto de valor bem protegido.

---

## final em constante

Agora vamos conectar `static` e `final`.

Constante de classe geralmente usa:

```java
private static final
```

Exemplo:

```java
private static final String PREFIXO_OS = "OS-";
```

Crie:

```text
ConstanteStaticFinalCodigo.java
```

Código:

```java
public class ConstanteStaticFinalCodigo {
    public static void main(String[] args) {
        CodigoOsFinal codigo = new CodigoOsFinal("OS-2026-0001");

        System.out.println(codigo);
    }
}

final class CodigoOsFinal {
    private static final String PREFIXO = "OS-";

    private final String valor;

    CodigoOsFinal(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    String valor() {
        return valor;
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

Compile e execute:

```powershell
javac ConstanteStaticFinalCodigo.java
java ConstanteStaticFinalCodigo
```

---

## O que static final comunica

Neste trecho:

```java
private static final String PREFIXO = "OS-";
```

temos:

```text
private: usado apenas dentro da classe;
static: pertence à classe;
final: não pode ser reatribuído;
String: tipo imutável;
PREFIXO: nome de constante.
```

Esse é um uso excelente de `static final`.

---

## final pode atrapalhar?

Sim, se usado sem critério.

Exemplos:

```text
marcar tudo como final sem padrão do time;
final em classes que poderiam ser estendidas por design;
final em métodos antes de entender herança;
final excessivo em variáveis locais deixando o código visualmente pesado;
confundir final com imutabilidade completa;
usar final para esconder problemas de modelagem.
```

`final` é uma ferramenta de intenção.

Não é enfeite.

Use quando ele comunica algo importante.

---

## Quando usar final com frequência

Bons candidatos:

```text
atributos de objeto de valor;
identidade de entidade;
dependências que não devem ser trocadas;
constantes;
classes de objeto de valor;
variáveis locais importantes que não devem ser reatribuídas;
parâmetros quando o padrão do time pedir;
métodos que realmente não devem ser sobrescritos.
```

Exemplos:

```java
private final CodigoOs codigo;
private final Email email;
private final Dinheiro total;
private static final String PREFIXO = "OS-";
final class Dinheiro { }
```

---

## Quando evitar final automático

Evite usar no automático quando:

```text
você ainda não sabe se o atributo muda no ciclo de vida;
a classe foi feita para ser estendida;
o método faz parte de um ponto de extensão;
o time não usa final em parâmetros e variáveis locais;
o código fica mais difícil de ler;
você está usando final para compensar modelagem confusa.
```

O melhor uso de `final` é aquele que deixa a intenção mais clara.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — variável local

Execute:

```text
FinalVariavelLocal.java
```

Depois tente reatribuir a variável `quantidade`.

Explique o erro.

### Parte 2 — parâmetro final

Execute:

```text
FinalParametro.java
```

Depois tente reatribuir o parâmetro `valor`.

Explique o erro.

### Parte 3 — atributo final

Execute:

```text
FinalAtributo.java
```

Explique:

```text
por que valor precisa ser inicializado no construtor;
por que não pode mudar depois.
```

### Parte 4 — entidade

Execute:

```text
FinalEmEntidade.java
```

Explique:

```text
quais atributos são final;
quais não são;
por que estoque e status podem mudar.
```

### Parte 5 — referência final

Execute:

```text
FinalReferenciaObjeto.java
```

Explique:

```text
por que conta não pode apontar para outro objeto;
por que saldo ainda pode mudar.
```

### Parte 6 — objetos de valor

Execute:

```text
ObjetoValorComFinal.java
ClasseFinalDinheiro.java
ConstanteStaticFinalCodigo.java
```

Explique:

```text
como final ajuda a proteger objetos de valor;
por que static final faz sentido para constantes.
```

---

## Desafio prático

Crie o arquivo:

```text
FinalOrdemServico.java
```

Modele:

```text
CodigoOsFinalDesafio;
PeriodoAtendimentoFinalDesafio;
OrdemServicoFinalDesafio.
```

Use:

```java
LocalDate;
enum StatusOsFinalDesafio;
enum TurnoFinalDesafio.
```

Regras:

```text
CodigoOsFinalDesafio deve ser final class.
CodigoOsFinalDesafio deve ter PREFIXO como private static final.
CodigoOsFinalDesafio deve ter valor private final.
Código deve iniciar com OS-.

PeriodoAtendimentoFinalDesafio deve ter data e turno como private final.
Data e turno são obrigatórios.

OrdemServicoFinalDesafio deve ter codigo e cliente como private final.
OrdemServicoFinalDesafio deve ter periodo, status e quantidadeReagendamentos como mutáveis controlados.
OS nasce AGENDADA.
OS pode reagendar se não estiver encerrada.
Reagendar troca período, incrementa quantidade e muda status para REAGENDADA.
OS pode concluir se não estiver cancelada.
OS pode cancelar com motivo se não estiver concluída.
```

No `main`, crie:

```text
uma OS válida;
reagende;
conclua;
tente reagendar depois de concluir;
mostre o erro esperado.
```

Explique no próprio código, por comentários curtos, quais atributos foram marcados como `final` e por quê.

---

## Erros comuns

### 1. Achar que final torna objeto imutável

`final` na referência não impede mudança interna do objeto.

### 2. Confundir static com final

`static` fala de classe. `final` fala de restrição de mudança.

### 3. Esquecer de inicializar atributo final

Todo atributo final precisa receber valor.

### 4. Colocar final em atributo que faz parte do ciclo de vida

Status, estoque e período podem mudar em entidades.

### 5. Não usar final em identidade estável

Código, id e identificadores geralmente são bons candidatos.

### 6. Usar final class em tudo

Nem toda classe deve ser fechada para herança.

### 7. Usar final para esconder modelagem ruim

Se o problema é responsabilidade confusa, `final` não resolve sozinho.

### 8. Achar que static final com objeto mutável é sempre seguro

`final` não impede mutação interna de objetos mutáveis.

---

## Debug recomendado

Use debug em:

```text
FinalEmEntidade.java
FinalReferenciaObjeto.java
ObjetoValorComFinal.java
ClasseFinalDinheiro.java
```

Observe:

```text
atributos final recebendo valor no construtor;
atributos mutáveis mudando por métodos de domínio;
referência final apontando para o mesmo objeto;
objeto interno mudando mesmo com referência final;
método somar retornando novo DinheiroFinal;
constante static final sendo usada na validação.
```

Breakpoints recomendados:

```java
this.codigo = codigo;
this.nome = nome;
estoque -= quantidade;
status = StatusProdutoFinal.INATIVO;

conta.depositar(50);

return new DinheiroFinal(valor.add(outro.valor));

if (!valor.startsWith(PREFIXO)) {
```

O objetivo do debug é enxergar a diferença entre:

```text
não reatribuir;
mudar estado;
criar novo objeto;
usar constante.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que final faz em um atributo?
2. Por que final em referência não torna o objeto imutável?
3. Qual atributo de uma entidade você marcaria como final?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar final;
usar final em variável local;
usar final em parâmetro;
usar final em atributo;
inicializar atributo final corretamente;
entender final em referência;
explicar por que final não garante imutabilidade profunda;
usar final em objeto de valor;
usar final em identidade de entidade;
usar final class com critério;
entender final em método;
usar static final para constante;
diferenciar static de final;
evitar final automático sem critério;
resolver o desafio FinalOrdemServico;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-122-final-em-classes-metodos-e-atributos
git commit -m "Aula 122: pratica final em Java"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
final comunica restrição de mudança.
```

Você viu que `final` pode aparecer em variáveis, parâmetros, atributos, métodos e classes.

Também viu que:

```text
final não é static;
final não significa imutabilidade profunda sozinho;
final é ótimo para identidade estável;
final ajuda muito em objetos de valor;
static final é excelente para constantes;
entidades podem ter atributos final e atributos mutáveis controlados.
```

Use `final` para deixar intenção clara.

Na próxima aula, vamos estudar sobrecarga de construtores com mais profundidade.

Vamos entender como oferecer formas diferentes de criar objetos sem duplicar regra, usando `this(...)`, construtores principais e valores padrão com critério.
