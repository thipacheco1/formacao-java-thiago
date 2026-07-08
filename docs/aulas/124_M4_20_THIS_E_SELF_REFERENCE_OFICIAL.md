# 124 — M4.20 — this e autorreferência

## Objetivo da aula

Nesta aula você vai aprender `this` com profundidade em Java.

Na aula anterior, você estudou sobrecarga de construtores e viu que um construtor pode chamar outro usando:

```java
this(...)
```

Agora vamos ampliar esse assunto.

`this` é uma referência para o próprio objeto que está executando o código.

Ao final da aula, você deve conseguir:

```text
explicar o que é this;
entender que this representa o próprio objeto atual;
usar this para diferenciar atributo de parâmetro;
usar this em construtores;
usar this(...) para encadear construtores;
usar this para chamar métodos do próprio objeto;
usar this como retorno para encadeamento controlado;
entender quando this é obrigatório;
entender quando this é opcional;
evitar uso exagerado ou confuso;
aplicar this em entidades, objetos de valor e métodos de domínio.
```

Essa aula é importante porque `this` aparece em praticamente todo código orientado a objetos.

Você já viu exemplos como:

```java
this.nome = nome;
this.email = email;
this.status = StatusPedido.CRIADO;
this(codigo, nome, preco, 0);
```

Agora vamos entender o que está acontecendo de verdade.

---

## A ideia central

`this` significa:

```text
este objeto aqui.
```

Quando um método ou construtor está executando dentro de um objeto, `this` aponta para o próprio objeto.

Exemplo:

```java
class Cliente {
    private String nome;

    Cliente(String nome) {
        this.nome = nome;
    }
}
```

Nesse trecho:

```java
this.nome
```

significa:

```text
o atributo nome deste objeto.
```

Já:

```java
nome
```

significa:

```text
o parâmetro nome recebido no construtor.
```

Por isso usamos:

```java
this.nome = nome;
```

A leitura é:

```text
o atributo nome deste objeto recebe o valor do parâmetro nome.
```

---

## this existe por causa do objeto atual

Quando você cria:

```java
Cliente cliente = new Cliente("Ana Silva");
```

o Java cria um objeto.

Dentro do construtor, `this` aponta para esse objeto que está nascendo.

Depois, quando você chama:

```java
cliente.alterarEmail("ana@email.com");
```

dentro do método `alterarEmail`, `this` aponta para o mesmo objeto referenciado por `cliente`.

Se você tiver outro objeto:

```java
Cliente outro = new Cliente("Carlos Lima");
```

e chamar:

```java
outro.alterarEmail("carlos@email.com");
```

dentro do método, `this` aponta para o objeto `outro`.

`this` sempre representa o objeto atual daquela execução.

---

## Exemplo 1 — this para diferenciar atributo de parâmetro

Crie a pasta:

```powershell
mkdir labs\m4\aula-124-this-e-self-reference
cd labs\m4\aula-124-this-e-self-reference
```

Crie o arquivo:

```text
ThisAtributoParametro.java
```

Código:

```java
public class ThisAtributoParametro {
    public static void main(String[] args) {
        ClienteThis cliente = new ClienteThis(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        System.out.println(cliente.resumo());

        cliente.alterarEmail("ana.novo@email.com");

        System.out.println(cliente.resumo());
    }
}

class ClienteThis {
    private final int id;
    private final String nome;
    private String email;

    ClienteThis(int id, String nome, String email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email.trim().toLowerCase();
    }

    void alterarEmail(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("Novo e-mail inválido.");
        }

        this.email = email.trim().toLowerCase();
    }

    String resumo() {
        return "Cliente " + this.id
                + " | Nome: " + this.nome
                + " | E-mail: " + this.email;
    }
}
```

Compile e execute:

```powershell
javac ThisAtributoParametro.java
java ThisAtributoParametro
```

---

## O que observar

No construtor:

```java
ClienteThis(int id, String nome, String email)
```

existem parâmetros chamados:

```text
id;
nome;
email.
```

E a classe também possui atributos com os mesmos nomes:

```java
private final int id;
private final String nome;
private String email;
```

Para diferenciar, usamos:

```java
this.id = id;
this.nome = nome;
this.email = email.trim().toLowerCase();
```

O lado esquerdo representa atributo do objeto.

O lado direito representa parâmetro recebido.

Sem `this`, o código ficaria errado ou ambíguo.

---

## O erro clássico sem this

Veja este exemplo conceitual:

```java
class Cliente {
    private String nome;

    Cliente(String nome) {
        nome = nome;
    }
}
```

Esse código compila, mas não faz o que você quer.

A linha:

```java
nome = nome;
```

atribui o parâmetro nele mesmo.

O atributo do objeto não recebe o valor.

O correto é:

```java
this.nome = nome;
```

Por isso, em construtores, `this` é muito comum.

---

## Quando this é obrigatório

`this` é obrigatório quando existe conflito de nomes entre atributo e variável local ou parâmetro.

Exemplo:

```java
private String nome;

Cliente(String nome) {
    this.nome = nome;
}
```

Sem `this`, o Java entende `nome` como o parâmetro mais próximo.

Então:

```java
this.nome
```

é necessário para acessar o atributo.

Outro caso obrigatório é quando você chama outro construtor da mesma classe:

```java
this(codigo, nome, preco, 0);
```

Esse `this(...)` precisa aparecer como primeira instrução do construtor.

---

## Quando this é opcional

Se não existe conflito de nomes, `this` pode ser opcional.

Exemplo:

```java
String resumo() {
    return "Cliente: " + nome;
}
```

Também poderia ser:

```java
String resumo() {
    return "Cliente: " + this.nome;
}
```

Os dois funcionam.

Nesta formação, vamos usar uma regra simples:

```text
use this quando melhorar clareza;
use this quando for necessário;
não use this em excesso se ele deixar o código poluído.
```

Em construtores e setters/métodos de alteração, é muito comum usar.

Em métodos simples, pode ser opcional.

---

## Exemplo 2 — this opcional em método

Crie:

```text
ThisOpcional.java
```

Código:

```java
public class ThisOpcional {
    public static void main(String[] args) {
        ProdutoThisOpcional produto = new ProdutoThisOpcional(
                "PROD-001",
                "Cadeira",
                10
        );

        System.out.println(produto.resumoComThis());
        System.out.println(produto.resumoSemThis());
    }
}

class ProdutoThisOpcional {
    private final String codigo;
    private final String nome;
    private int estoque;

    ProdutoThisOpcional(String codigo, String nome, int estoque) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("PROD-")) {
            throw new IllegalArgumentException("Código deve iniciar com PROD-.");
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

    String resumoComThis() {
        return "Produto: " + this.codigo
                + " | Nome: " + this.nome
                + " | Estoque: " + this.estoque;
    }

    String resumoSemThis() {
        return "Produto: " + codigo
                + " | Nome: " + nome
                + " | Estoque: " + estoque;
    }
}
```

Compile e execute:

```powershell
javac ThisOpcional.java
java ThisOpcional
```

Os dois métodos funcionam.

O importante é entender que `this` está implícito quando você acessa um atributo de instância sem conflito.

---

## this em construtores sobrecarregados

Você já viu isso na aula anterior, mas agora vamos reforçar.

`this(...)` chama outro construtor da mesma classe.

Crie:

```text
ThisConstrutorSobrecarregado.java
```

Código:

```java
public class ThisConstrutorSobrecarregado {
    public static void main(String[] args) {
        ClienteConstrutorThis clienteAtivo = new ClienteConstrutorThis(
                10,
                "Ana Silva"
        );

        ClienteConstrutorThis clienteInativo = new ClienteConstrutorThis(
                20,
                "Carlos Lima",
                StatusClienteThis.INATIVO
        );

        System.out.println(clienteAtivo.resumo());
        System.out.println(clienteInativo.resumo());
    }
}

enum StatusClienteThis {
    ATIVO,
    INATIVO,
    BLOQUEADO
}

class ClienteConstrutorThis {
    private final int id;
    private final String nome;
    private final StatusClienteThis status;

    ClienteConstrutorThis(int id, String nome) {
        this(id, nome, StatusClienteThis.ATIVO);
    }

    ClienteConstrutorThis(int id, String nome, StatusClienteThis status) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.id = id;
        this.nome = nome;
        this.status = status;
    }

    boolean ativo() {
        return this.status == StatusClienteThis.ATIVO;
    }

    String resumo() {
        return "Cliente " + this.id
                + " | Nome: " + this.nome
                + " | Status: " + this.status
                + " | Ativo: " + this.ativo();
    }
}
```

Compile e execute:

```powershell
javac ThisConstrutorSobrecarregado.java
java ThisConstrutorSobrecarregado
```

---

## this(...) precisa ser a primeira instrução

Este construtor está correto:

```java
ClienteConstrutorThis(int id, String nome) {
    this(id, nome, StatusClienteThis.ATIVO);
}
```

Mas este não compila:

```java
ClienteConstrutorThis(int id, String nome) {
    System.out.println("Criando cliente");
    this(id, nome, StatusClienteThis.ATIVO);
}
```

Por quê?

Porque `this(...)` precisa ser a primeira instrução.

Antes de qualquer outra coisa, o Java precisa saber qual construtor será usado para inicializar o objeto.

---

## this para chamar método do próprio objeto

Dentro de uma classe, você pode chamar métodos do próprio objeto usando `this`.

Exemplo:

```java
this.ativo()
```

ou simplesmente:

```java
ativo()
```

Os dois funcionam, se não houver conflito.

Crie:

```text
ThisChamandoMetodo.java
```

Código:

```java
public class ThisChamandoMetodo {
    public static void main(String[] args) {
        PedidoMetodoThis pedido = new PedidoMetodoThis(
                1001,
                StatusPedidoMetodoThis.CRIADO
        );

        System.out.println(pedido.resumo());

        pedido.confirmarPagamento();

        System.out.println(pedido.resumo());
    }
}

enum StatusPedidoMetodoThis {
    CRIADO,
    PAGO,
    CANCELADO
}

class PedidoMetodoThis {
    private final int numero;
    private StatusPedidoMetodoThis status;

    PedidoMetodoThis(int numero, StatusPedidoMetodoThis status) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.numero = numero;
        this.status = status;
    }

    boolean criado() {
        return this.status == StatusPedidoMetodoThis.CRIADO;
    }

    boolean pago() {
        return this.status == StatusPedidoMetodoThis.PAGO;
    }

    void confirmarPagamento() {
        if (!this.criado()) {
            throw new IllegalStateException("Somente pedido criado pode ser pago.");
        }

        this.status = StatusPedidoMetodoThis.PAGO;
    }

    String resumo() {
        return "Pedido " + this.numero
                + " | Status: " + this.status
                + " | Pago: " + this.pago();
    }
}
```

Compile e execute:

```powershell
javac ThisChamandoMetodo.java
java ThisChamandoMetodo
```

---

## O que esse exemplo mostra

Dentro do método:

```java
void confirmarPagamento()
```

chamamos:

```java
this.criado()
```

Isso significa:

```text
chame o método criado deste próprio objeto.
```

Também atualizamos:

```java
this.status = StatusPedidoMetodoThis.PAGO;
```

Isso significa:

```text
altere o status deste próprio pedido.
```

O uso de `this` deixa explícito que estamos trabalhando com o estado e os comportamentos do objeto atual.

---

## this não existe em contexto static

Método `static` pertence à classe, não a uma instância.

Por isso, dentro de método `static`, você não pode usar `this`.

Exemplo que não compila:

```java
class Cliente {
    static void imprimir() {
        System.out.println(this);
    }
}
```

Não existe "este objeto" dentro de um método static.

O método static não está associado a um objeto específico.

Ele pertence à classe.

Por isso, `this` só existe em contexto de instância.

---

## Exemplo 5 — static sem this

Crie:

```text
StaticSemThis.java
```

Código:

```java
public class StaticSemThis {
    public static void main(String[] args) {
        CodigoStaticThis codigo = CodigoStaticThis.de("PED-1001");

        System.out.println(codigo);
    }
}

final class CodigoStaticThis {
    private static final String PREFIXO = "PED-";

    private final String valor;

    private CodigoStaticThis(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        if (!valor.startsWith(PREFIXO)) {
            throw new IllegalArgumentException("Código deve iniciar com " + PREFIXO);
        }

        this.valor = valor;
    }

    static CodigoStaticThis de(String valor) {
        return new CodigoStaticThis(valor);
    }

    @Override
    public String toString() {
        return this.valor;
    }
}
```

Compile e execute:

```powershell
javac StaticSemThis.java
java StaticSemThis
```

Observe:

```java
static CodigoStaticThis de(String valor)
```

não usa `this`.

Mas o construtor usa:

```java
this.valor = valor;
```

E o `toString` usa:

```java
return this.valor;
```

Porque construtor e `toString` estão em contexto de instância.

---

## this como retorno do próprio objeto

Em alguns casos, métodos retornam `this`.

Isso permite encadeamento de chamadas.

Exemplo:

```java
pedido.adicionarObservacao("A").adicionarObservacao("B");
```

Esse estilo precisa de muito critério.

Ele pode deixar o código fluente, mas também pode esconder mutações.

Vamos ver um exemplo simples.

Crie:

```text
ThisRetornandoObjeto.java
```

Código:

```java
public class ThisRetornandoObjeto {
    public static void main(String[] args) {
        OrdemServicoFluente os = new OrdemServicoFluente("OS-2026-0001");

        os.adicionarObservacao("Cliente solicitou contato antes da visita")
                .adicionarObservacao("Atendimento preferencial no período da manhã")
                .marcarComoCritica();

        System.out.println(os.resumo());
    }
}

class OrdemServicoFluente {
    private final String codigo;
    private String observacoes;
    private boolean critica;

    OrdemServicoFluente(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.codigo = codigo;
        this.observacoes = "";
        this.critica = false;
    }

    OrdemServicoFluente adicionarObservacao(String observacao) {
        if (observacao == null || observacao.isBlank()) {
            throw new IllegalArgumentException("Observação é obrigatória.");
        }

        if (this.observacoes.isBlank()) {
            this.observacoes = observacao;
        } else {
            this.observacoes = this.observacoes + " | " + observacao;
        }

        return this;
    }

    OrdemServicoFluente marcarComoCritica() {
        this.critica = true;
        return this;
    }

    String resumo() {
        return "OS: " + this.codigo
                + " | Crítica: " + this.critica
                + " | Observações: " + this.observacoes;
    }
}
```

Compile e execute:

```powershell
javac ThisRetornandoObjeto.java
java ThisRetornandoObjeto
```

---

## Cuidado com fluent interface

O exemplo funcionou.

Mas tenha cuidado.

Quando um método retorna `this`, ele geralmente está dizendo:

```text
eu alterei este objeto e estou devolvendo o próprio objeto para continuar a cadeia.
```

Isso pode ser útil em alguns contextos, mas pode esconder mudanças.

Exemplo:

```java
os.adicionarObservacao("A").marcarComoCritica();
```

O objeto `os` foi alterado.

Isso não é errado, mas precisa ser claro.

Em objetos de valor imutáveis, normalmente não retornamos `this` depois de alterar. Retornamos um novo objeto.

Exemplo:

```java
Dinheiro total = preco.somar(frete);
```

`preco` não muda.

`somar` retorna outro `Dinheiro`.

Regra prática:

```text
retornar this em objeto mutável exige critério;
em objeto de valor imutável, prefira retornar novo objeto.
```

---

## this e objeto de valor imutável

Agora veja um objeto de valor.

Crie:

```text
ThisObjetoValorImutavel.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class ThisObjetoValorImutavel {
    public static void main(String[] args) {
        DinheiroThis preco = DinheiroThis.de("199.90");
        DinheiroThis frete = DinheiroThis.de("20.00");

        DinheiroThis total = preco.somar(frete);

        System.out.println("Preço: " + preco);
        System.out.println("Frete: " + frete);
        System.out.println("Total: " + total);
    }
}

final class DinheiroThis {
    private final BigDecimal valor;

    private DinheiroThis(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroThis de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroThis(new BigDecimal(valor));
    }

    DinheiroThis somar(DinheiroThis outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroThis(this.valor.add(outro.valor));
    }

    boolean maiorQue(DinheiroThis outro) {
        if (outro == null) {
            return false;
        }

        return this.valor.compareTo(outro.valor) > 0;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        DinheiroThis dinheiro = (DinheiroThis) outro;
        return Objects.equals(this.valor, dinheiro.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.valor);
    }

    @Override
    public String toString() {
        return "R$ " + this.valor;
    }
}
```

Compile e execute:

```powershell
javac ThisObjetoValorImutavel.java
java ThisObjetoValorImutavel
```

---

## O que observar no objeto de valor

No método:

```java
DinheiroThis somar(DinheiroThis outro) {
    return new DinheiroThis(this.valor.add(outro.valor));
}
```

usamos:

```java
this.valor
```

para acessar o valor do próprio objeto.

E usamos:

```java
outro.valor
```

para acessar o valor do outro objeto da mesma classe.

O método retorna novo objeto.

Ele não altera `this`.

Isso combina bem com imutabilidade.

---

## this dentro de equals

Na aula de `equals`, você viu:

```java
if (this == outro) {
    return true;
}
```

Agora isso deve ficar mais claro.

Esse trecho pergunta:

```text
este objeto atual e o outro objeto são a mesma referência?
```

Se sim, são iguais.

Não precisa comparar mais nada.

Exemplo:

```java
Email email = new Email("ana@email.com");

email.equals(email);
```

Dentro do `equals`:

```java
this
```

e:

```java
outro
```

apontam para o mesmo objeto.

Por isso:

```java
this == outro
```

retorna `true`.

---

## this e sombra de nomes

Quando uma variável local ou parâmetro tem o mesmo nome de um atributo, dizemos que ela "sombreia" o atributo.

Exemplo:

```java
private String email;

void alterarEmail(String email) {
    this.email = email;
}
```

O parâmetro `email` sombreia o atributo `email`.

Dentro do método, se você escrever apenas:

```java
email
```

o Java entende o parâmetro.

Para acessar o atributo, você usa:

```java
this.email
```

Isso é muito comum e não é problema.

Na verdade, é um padrão usado em muitos códigos Java.

---

## this e nomes de parâmetros

Você poderia evitar `this` mudando o nome dos parâmetros:

```java
Cliente(String nomeRecebido) {
    nome = nomeRecebido;
}
```

Funciona.

Mas em Java é muito comum usar o mesmo nome:

```java
Cliente(String nome) {
    this.nome = nome;
}
```

Isso mantém o código mais direto.

Compare:

```java
this.nome = nome;
this.email = email;
this.status = status;
```

com:

```java
this.nome = nomeRecebido;
this.email = emailRecebido;
this.status = statusRecebido;
```

Os dois estilos existem.

Nesta formação, vamos preferir:

```java
this.atributo = parametro;
```

quando fizer sentido.

---

## this e leitura profissional

Um uso equilibrado de `this` melhora a leitura.

Exemplo bom:

```java
this.codigo = codigo;
this.status = StatusOs.AGENDADA;
this.quantidadeReagendamentos = 0;
```

Mostra claramente a inicialização do objeto.

Exemplo possivelmente exagerado:

```java
return this.codigo.toString()
        + this.cliente.resumo()
        + this.periodo.toString()
        + this.status.name();
```

Funciona, mas pode ficar visualmente carregado.

A regra é:

```text
em construtores, this costuma ajudar;
em métodos com conflito de nome, this é necessário;
em métodos simples, use se melhorar clareza.
```

---

## Exemplo 9 — entidade usando this com critério

Crie:

```text
ThisEntidadeOrdemServico.java
```

Código:

```java
import java.time.LocalDate;

public class ThisEntidadeOrdemServico {
    public static void main(String[] args) {
        PeriodoThisOs periodo = new PeriodoThisOs(
                LocalDate.now().plusDays(1),
                TurnoThisOs.MANHA
        );

        OrdemServicoThis os = new OrdemServicoThis(
                "OS-2026-0001",
                "Ana Silva",
                periodo
        );

        System.out.println(os.resumo());

        os.reagendar(new PeriodoThisOs(
                LocalDate.now().plusDays(3),
                TurnoThisOs.TARDE
        ));

        System.out.println(os.resumo());

        os.concluir();

        System.out.println(os.resumo());
    }
}

enum StatusThisOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum TurnoThisOs {
    MANHA,
    TARDE
}

class OrdemServicoThis {
    private final String codigo;
    private final String cliente;
    private PeriodoThisOs periodo;
    private StatusThisOs status;
    private int quantidadeReagendamentos;

    OrdemServicoThis(String codigo, String cliente, PeriodoThisOs periodo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!codigo.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Período é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.periodo = periodo;
        this.status = StatusThisOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
    }

    boolean encerrada() {
        return this.status == StatusThisOs.CONCLUIDA
                || this.status == StatusThisOs.CANCELADA;
    }

    void reagendar(PeriodoThisOs periodo) {
        if (this.encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (periodo == null) {
            throw new IllegalArgumentException("Novo período é obrigatório.");
        }

        this.periodo = periodo;
        this.status = StatusThisOs.REAGENDADA;
        this.quantidadeReagendamentos++;
    }

    void concluir() {
        if (this.status == StatusThisOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        this.status = StatusThisOs.CONCLUIDA;
    }

    String resumo() {
        return "OS: " + this.codigo
                + " | Cliente: " + this.cliente
                + " | Período: " + this.periodo
                + " | Status: " + this.status
                + " | Reagendamentos: " + this.quantidadeReagendamentos;
    }
}

final class PeriodoThisOs {
    private final LocalDate data;
    private final TurnoThisOs turno;

    PeriodoThisOs(LocalDate data, TurnoThisOs turno) {
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
        return this.data + " - " + this.turno;
    }
}
```

Compile e execute:

```powershell
javac ThisEntidadeOrdemServico.java
java ThisEntidadeOrdemServico
```

---

## O que esse exemplo mostra

A entidade `OrdemServicoThis` usa `this` em pontos importantes:

```java
this.codigo = codigo;
this.cliente = cliente;
this.periodo = periodo;
this.status = StatusThisOs.AGENDADA;
```

Na alteração de estado:

```java
this.periodo = periodo;
this.status = StatusThisOs.REAGENDADA;
this.quantidadeReagendamentos++;
```

Na chamada de método interno:

```java
if (this.encerrada()) {
```

Isso deixa claro que o método está trabalhando com o próprio objeto.

---

## this e passagem do próprio objeto como parâmetro

Às vezes um objeto passa `this` para outro método ou outro objeto.

Exemplo conceitual:

```java
auditoria.registrarAlteracao(this);
```

Isso significa:

```text
registrar alteração deste objeto.
```

Vamos fazer um exemplo simples.

Crie:

```text
ThisComoParametro.java
```

Código:

```java
public class ThisComoParametro {
    public static void main(String[] args) {
        AuditoriaThis auditoria = new AuditoriaThis();

        PedidoAuditavelThis pedido = new PedidoAuditavelThis(
                1001,
                "Ana Silva"
        );

        pedido.cancelar("Cliente desistiu", auditoria);
    }
}

class PedidoAuditavelThis {
    private final int numero;
    private final String cliente;
    private StatusPedidoAuditavelThis status;

    PedidoAuditavelThis(int numero, String cliente) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.status = StatusPedidoAuditavelThis.CRIADO;
    }

    void cancelar(String motivo, AuditoriaThis auditoria) {
        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        this.status = StatusPedidoAuditavelThis.CANCELADO;
        auditoria.registrarCancelamento(this, motivo);
    }

    int numero() {
        return this.numero;
    }

    String cliente() {
        return this.cliente;
    }

    StatusPedidoAuditavelThis status() {
        return this.status;
    }
}

enum StatusPedidoAuditavelThis {
    CRIADO,
    CANCELADO
}

class AuditoriaThis {
    void registrarCancelamento(PedidoAuditavelThis pedido, String motivo) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("Auditoria:");
        System.out.println("Pedido: " + pedido.numero());
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Status: " + pedido.status());
        System.out.println("Motivo: " + motivo);
    }
}
```

Compile e execute:

```powershell
javac ThisComoParametro.java
java ThisComoParametro
```

---

## Cuidado ao passar this

Passar `this` pode ser útil, mas exige cuidado.

Quando você passa o próprio objeto para outro objeto, está permitindo que o outro conheça aquele objeto.

Isso pode aumentar acoplamento.

Exemplo aceitável em alguns contextos:

```java
auditoria.registrarCancelamento(this, motivo);
```

Exemplo perigoso:

```java
objetoExterno.alterarTudo(this);
```

A regra prática:

```text
passar this deve ter uma intenção clara;
evite entregar o objeto inteiro quando só alguns dados bastam.
```

Às vezes é melhor passar dados específicos:

```java
auditoria.registrarCancelamento(numero, status, motivo);
```

Isso depende do desenho do sistema.

---

## this e null

`this` nunca é `null` dentro de um método de instância.

Se um método está executando, existe um objeto atual.

Você não precisa fazer:

```java
if (this == null) {
}
```

Isso não faz sentido.

Se `this` fosse `null`, o método nem teria sido chamado.

O que pode ser `null` são parâmetros, atributos ou retornos.

---

## this e construtor antes do objeto pronto

Dentro do construtor, `this` já existe, mas o objeto ainda está em construção.

Por isso, evite passar `this` para outros objetos ou chamar métodos complexos antes de terminar a construção.

Exemplo perigoso conceitual:

```java
Cliente() {
    servico.registrar(this);
}
```

O objeto pode ainda não estar completamente inicializado.

Nesta fase, regra simples:

```text
no construtor, use this para inicializar atributos;
evite expor this para fora antes do objeto estar pronto.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — atributo e parâmetro

Execute:

```text
ThisAtributoParametro.java
```

Explique:

```text
qual nome representa o atributo;
qual nome representa o parâmetro;
por que this.email = email é necessário.
```

### Parte 2 — this opcional

Execute:

```text
ThisOpcional.java
```

Compare:

```text
resumoComThis;
resumoSemThis.
```

Explique por que os dois funcionam.

### Parte 3 — construtores

Execute:

```text
ThisConstrutorSobrecarregado.java
```

Explique:

```text
qual construtor chama outro;
por que this(...) precisa ser a primeira instrução.
```

### Parte 4 — método do próprio objeto

Execute:

```text
ThisChamandoMetodo.java
```

Explique:

```text
o que this.criado() significa;
o que this.status significa.
```

### Parte 5 — static

Execute:

```text
StaticSemThis.java
```

Explique:

```text
por que o método static de(...) não usa this;
por que o construtor e toString podem usar.
```

### Parte 6 — retorno this

Execute:

```text
ThisRetornandoObjeto.java
```

Explique:

```text
qual método retorna this;
qual objeto foi alterado;
por que isso exige critério.
```

### Parte 7 — objeto de valor

Execute:

```text
ThisObjetoValorImutavel.java
```

Explique:

```text
por que somar retorna novo objeto;
por que this.valor não muda.
```

### Parte 8 — entidade e auditoria

Execute:

```text
ThisEntidadeOrdemServico.java
ThisComoParametro.java
```

Explique:

```text
quando this ajudou na leitura;
quando this foi passado como parâmetro;
qual cuidado isso exige.
```

---

## Desafio prático

Crie o arquivo:

```text
ThisPedidoDominio.java
```

Modele um pedido usando `this` com critério.

Classes sugeridas:

```text
PedidoThisDominio;
ClienteThisDominio;
DinheiroThisDominio;
AuditoriaPedidoThisDominio.
```

Enums:

```java
enum StatusPedidoThisDominio {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Regras:

```text
Pedido tem número, cliente, total, status e motivoCancelamento.
Pedido nasce CRIADO.
Cliente tem id e nome.
Dinheiro deve ser objeto de valor imutável.
Pedido pode confirmar pagamento se estiver CRIADO.
Pedido pode cancelar se não estiver CANCELADO.
Cancelar exige motivo.
Ao cancelar, registrar auditoria.
Use this para diferenciar atributos de parâmetros.
Use this(...) em pelo menos um construtor sobrecarregado.
Use this para chamar método interno, por exemplo this.criado().
Use this com critério em toString ou resumo.
```

Exemplo esperado no `main`:

```java
ClienteThisDominio cliente = new ClienteThisDominio(10, "Ana Silva");
DinheiroThisDominio total = DinheiroThisDominio.de("399.80");

PedidoThisDominio pedido = new PedidoThisDominio(1001, cliente, total);

pedido.confirmarPagamento();

AuditoriaPedidoThisDominio auditoria = new AuditoriaPedidoThisDominio();
pedido.cancelar("Cliente desistiu", auditoria);

System.out.println(pedido.resumo());
```

Depois teste:

```text
pedido com número zero;
cliente nulo;
total nulo;
cancelamento sem motivo;
cancelar duas vezes;
confirmar pagamento depois de cancelar.
```

---

## Erros comuns

### 1. Esquecer this quando atributo e parâmetro têm o mesmo nome

Sem `this`, você pode atribuir o parâmetro nele mesmo.

### 2. Achar que this é sempre obrigatório

Em muitos métodos, ele é opcional.

### 3. Usar this em método static

Não existe `this` em contexto static.

### 4. Colocar código antes de this(...) no construtor

`this(...)` precisa ser a primeira instrução.

### 5. Retornar this sem critério

Encadeamento fluente pode esconder mutações.

### 6. Passar this para qualquer objeto

Isso pode aumentar acoplamento.

### 7. Confundir this com classe

`this` é o objeto atual, não a classe.

### 8. Usar this para compensar nomes ruins

`this` ajuda, mas nomes de métodos e atributos ainda precisam ser bons.

---

## Debug recomendado

Use debug em:

```text
ThisAtributoParametro.java
ThisConstrutorSobrecarregado.java
ThisChamandoMetodo.java
ThisRetornandoObjeto.java
ThisObjetoValorImutavel.java
ThisComoParametro.java
```

Breakpoints recomendados:

```java
this.id = id;
this.nome = nome;
this.email = email.trim().toLowerCase();

this(id, nome, StatusClienteThis.ATIVO);

if (!this.criado()) {
this.status = StatusPedidoMetodoThis.PAGO;

return this;

return new DinheiroThis(this.valor.add(outro.valor));

auditoria.registrarCancelamento(this, motivo);
```

Durante o debug, observe:

```text
qual objeto está sendo representado por this;
quando this aponta para cliente;
quando this aponta para pedido;
quando this aponta para dinheiro;
quando this é retornado;
quando this é passado como parâmetro;
quando o objeto é alterado;
quando um novo objeto é criado.
```

O objetivo é enxergar `this` como o próprio objeto em execução.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que this representa?
2. Quando this é obrigatório?
3. Qual cuidado existe ao retornar ou passar this?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar this;
usar this para diferenciar atributo e parâmetro;
usar this em construtores;
usar this(...) para chamar outro construtor;
respeitar this(...) como primeira instrução;
entender this implícito;
entender this opcional;
saber que static não tem this;
usar this para chamar método do próprio objeto;
usar this em equals;
entender retorno de this;
entender this em objeto imutável;
entender this em entidade mutável;
entender risco de passar this;
debugar this;
resolver o desafio ThisPedidoDominio;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-124-this-e-self-reference
git commit -m "Aula 124: pratica this e autorreferencia"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
this representa o próprio objeto atual.
```

Você viu que `this` ajuda em construtores, métodos, chamadas internas, encadeamento de construtores, comparação, objetos imutáveis e entidades mutáveis.

Também viu que `this` precisa de critério:

```text
é necessário quando atributo e parâmetro têm o mesmo nome;
é obrigatório em this(...);
não existe em static;
pode ser opcional em métodos simples;
retornar this pode esconder mutação;
passar this pode aumentar acoplamento.
```

Dominar `this` melhora muito sua leitura de código Java orientado a objetos.

Na próxima aula, vamos estudar organização de classes em arquivos.

Vamos entender melhor a regra de uma classe pública por arquivo, nomes de arquivos, classes auxiliares, quando separar arquivos e como começar a organizar um domínio Java de forma mais profissional.
