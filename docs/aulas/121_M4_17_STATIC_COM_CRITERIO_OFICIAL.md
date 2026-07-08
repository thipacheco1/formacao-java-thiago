# 121 — M4.17 — static com critério

## Objetivo da aula

Nesta aula você vai aprender a usar `static` com critério em Java.

Nas aulas anteriores, você estudou objetos, composição, entidades, objetos de valor, identidade, `equals`, `hashCode` e `toString`. Agora vamos estudar um recurso que aparece muito em Java, mas que também causa bastante confusão:

```java
static
```

Ao final da aula, você deve conseguir:

```text
explicar o que significa static;
diferenciar membro da classe de membro do objeto;
criar atributo static;
criar método static;
entender quando static faz sentido;
entender quando static atrapalha;
usar static final para constantes;
usar métodos utilitários com critério;
evitar estado global mutável;
entender por que static demais prejudica testes e manutenção;
separar comportamento de objeto de comportamento de classe.
```

Essa aula é muito importante porque `static` parece simples, mas usado sem critério pode enfraquecer a Orientação a Objetos.

Em Java backend, você verá `static` em:

```text
método main;
constantes;
métodos utilitários;
Math;
LocalDate.now;
factories;
códigos gerados;
helpers;
configurações;
singletons;
testes;
frameworks.
```

O objetivo não é decorar regra.  
O objetivo é entender quando usar e quando evitar.

---

## A ideia central

Quando algo é `static`, ele pertence à classe, não a uma instância específica.

Compare:

```java
Cliente cliente1 = new Cliente("Ana");
Cliente cliente2 = new Cliente("Carlos");
```

Cada cliente é um objeto diferente.

Cada objeto tem seus próprios atributos de instância.

Mas um membro `static` é compartilhado pela classe.

Exemplo:

```java
class Cliente {
    static int totalCriado;
}
```

Esse `totalCriado` não pertence a um cliente específico.

Ele pertence à classe `Cliente`.

A ideia principal é:

```text
sem static: pertence ao objeto;
com static: pertence à classe.
```

---

## O método main é static

Você já usa `static` desde a primeira aula:

```java
public static void main(String[] args) {
}
```

O `main` é `static` porque o Java precisa iniciar o programa sem criar um objeto da sua classe principal.

Quando você executa:

```powershell
java MinhaClasse
```

a JVM chama:

```java
MinhaClasse.main(...)
```

Sem precisar fazer:

```java
new MinhaClasse()
```

Então, logo no começo do Java, já aparece a ideia:

```text
método static pode ser chamado pela classe.
```

---

## Exemplo 1 — atributo de instância

Crie a pasta:

```powershell
mkdir labs\m4\aula-121-static-com-criterio
cd labs\m4\aula-121-static-com-criterio
```

Crie o arquivo:

```text
AtributoDeInstancia.java
```

Código:

```java
public class AtributoDeInstancia {
    public static void main(String[] args) {
        ClienteInstancia cliente1 = new ClienteInstancia("Ana Silva");
        ClienteInstancia cliente2 = new ClienteInstancia("Carlos Lima");

        System.out.println(cliente1.resumo());
        System.out.println(cliente2.resumo());

        cliente1.alterarNome("Ana Souza");

        System.out.println("Depois da alteração:");
        System.out.println(cliente1.resumo());
        System.out.println(cliente2.resumo());
    }
}

class ClienteInstancia {
    private String nome;

    ClienteInstancia(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.nome = nome;
    }

    void alterarNome(String novoNome) {
        if (novoNome == null || novoNome.isBlank()) {
            throw new IllegalArgumentException("Novo nome é obrigatório.");
        }

        nome = novoNome;
    }

    String resumo() {
        return "Cliente: " + nome;
    }
}
```

Compile e execute:

```powershell
javac AtributoDeInstancia.java
java AtributoDeInstancia
```

---

## O que aconteceu

Cada objeto tem seu próprio atributo:

```java
private String nome;
```

Quando você altera:

```java
cliente1.alterarNome("Ana Souza");
```

somente `cliente1` muda.

`cliente2` continua igual.

Isso é atributo de instância.

Cada instância tem seu próprio estado.

---

## Exemplo 2 — atributo static compartilhado

Agora crie:

```text
AtributoStaticCompartilhado.java
```

Código:

```java
public class AtributoStaticCompartilhado {
    public static void main(String[] args) {
        ClienteStatic cliente1 = new ClienteStatic("Ana Silva");
        ClienteStatic cliente2 = new ClienteStatic("Carlos Lima");
        ClienteStatic cliente3 = new ClienteStatic("Maria Oliveira");

        System.out.println(cliente1.resumo());
        System.out.println(cliente2.resumo());
        System.out.println(cliente3.resumo());

        System.out.println("Total criado: " + ClienteStatic.totalCriado());
    }
}

class ClienteStatic {
    private static int totalCriado = 0;

    private final int numeroSequencial;
    private final String nome;

    ClienteStatic(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        totalCriado++;
        this.numeroSequencial = totalCriado;
        this.nome = nome;
    }

    static int totalCriado() {
        return totalCriado;
    }

    String resumo() {
        return "Cliente #" + numeroSequencial + " | Nome: " + nome;
    }
}
```

Compile e execute:

```powershell
javac AtributoStaticCompartilhado.java
java AtributoStaticCompartilhado
```

---

## O que esse exemplo mostra

O atributo:

```java
private static int totalCriado = 0;
```

pertence à classe `ClienteStatic`.

Ele é compartilhado por todas as instâncias.

Cada vez que o construtor roda:

```java
totalCriado++;
```

o contador da classe aumenta.

Por isso conseguimos chamar:

```java
ClienteStatic.totalCriado()
```

sem criar um objeto específico para isso.

Esse é um uso simples de `static`.

Mas cuidado: atributo `static` mutável pode ser perigoso em sistemas reais.

---

## static pertence à classe

Método estático deve ser chamado pela classe:

```java
ClienteStatic.totalCriado()
```

Evite chamar por instância:

```java
cliente1.totalCriado()
```

Mesmo que o Java permita em alguns casos, isso confunde a leitura.

Quando você lê:

```java
ClienteStatic.totalCriado()
```

fica claro:

```text
isso pertence à classe.
```

Quando você lê:

```java
cliente1.totalCriado()
```

parece que pertence ao objeto, mas não pertence.

Regra prática:

```text
membro static deve ser acessado pelo nome da classe.
```

---

## static final para constantes

Um dos usos mais saudáveis de `static` é constante.

Exemplo:

```java
private static final int DIAS_LIMITE_REAGENDAMENTO = 3;
```

Aqui temos:

```text
static: pertence à classe;
final: não pode ser reatribuído;
nome em maiúsculas: convenção de constante.
```

Constantes ajudam a evitar números mágicos espalhados.

Ruim:

```java
if (diasEmAberto > 3) {
}
```

Melhor:

```java
if (diasEmAberto > DIAS_LIMITE_REAGENDAMENTO) {
}
```

O número ganha nome.

---

## Exemplo 3 — constante com static final

Crie:

```text
ConstanteStaticFinal.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class ConstanteStaticFinal {
    public static void main(String[] args) {
        OrdemServicoConstante os = new OrdemServicoConstante(
                "OS-2026-0001",
                LocalDate.now().minusDays(5)
        );

        System.out.println(os.resumo(LocalDate.now()));
    }
}

class OrdemServicoConstante {
    private static final int DIAS_PARA_CASO_CRITICO = 3;

    private final String codigo;
    private final LocalDate dataAbertura;

    OrdemServicoConstante(String codigo, LocalDate dataAbertura) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (dataAbertura == null) {
            throw new IllegalArgumentException("Data de abertura é obrigatória.");
        }

        this.codigo = codigo;
        this.dataAbertura = dataAbertura;
    }

    long diasEmAberto(LocalDate referencia) {
        if (referencia == null) {
            throw new IllegalArgumentException("Referência é obrigatória.");
        }

        long dias = ChronoUnit.DAYS.between(dataAbertura, referencia);

        if (dias < 0) {
            return 0;
        }

        return dias;
    }

    boolean casoCritico(LocalDate referencia) {
        return diasEmAberto(referencia) > DIAS_PARA_CASO_CRITICO;
    }

    String resumo(LocalDate referencia) {
        return "OS: " + codigo
                + " | Dias em aberto: " + diasEmAberto(referencia)
                + " | Caso crítico: " + casoCritico(referencia);
    }
}
```

Compile e execute:

```powershell
javac ConstanteStaticFinal.java
java ConstanteStaticFinal
```

---

## O que melhorou com a constante

Compare:

```java
return diasEmAberto(referencia) > 3;
```

com:

```java
return diasEmAberto(referencia) > DIAS_PARA_CASO_CRITICO;
```

O segundo é mais claro.

O nome explica a regra.

Essa constante pertence à classe, não a uma OS específica.

Então faz sentido ser:

```java
private static final
```

Regra prática:

```text
constantes de classe podem ser static final.
```

---

## Convenção de nome para constantes

Em Java, constantes costumam usar:

```text
MAIÚSCULAS_COM_UNDERSCORE
```

Exemplos:

```java
private static final int LIMITE_TENTATIVAS = 3;
private static final String PREFIXO_OS = "OS-";
private static final BigDecimal VALOR_MINIMO = new BigDecimal("0.01");
```

Atributos normais usam camelCase:

```java
private String nome;
private int quantidade;
private BigDecimal valorTotal;
```

Essa convenção ajuda muito na leitura.

Quando você vê:

```java
DIAS_PARA_CASO_CRITICO
```

já entende que é constante.

---

## static final com objeto mutável

Cuidado: `final` impede reatribuição da variável, mas não torna o objeto interno imutável.

Exemplo perigoso conceitual:

```java
private static final List<String> NOMES = new ArrayList<>();
```

Você não pode fazer:

```java
NOMES = outraLista;
```

Mas pode fazer:

```java
NOMES.add("Ana");
```

A lista mudou.

Ainda vamos estudar coleções em profundidade, mas guarde:

```text
static final não garante imutabilidade profunda.
```

Para constantes simples, como `int`, `String`, `BigDecimal` bem usado, enums e valores imutáveis, o risco é menor.

---

## Método static utilitário

Método `static` pode fazer sentido quando a operação:

```text
não depende do estado de um objeto específico;
é uma função utilitária;
opera apenas sobre parâmetros;
não precisa acessar atributos de instância.
```

Exemplo conhecido:

```java
Math.max(10, 20)
```

Você não faz:

```java
new Math()
```

Você chama:

```java
Math.max(...)
```

Porque `max` não depende de um objeto `Math`.

---

## Exemplo 4 — utilitário de texto

Crie:

```text
UtilitarioTextoStatic.java
```

Código:

```java
public class UtilitarioTextoStatic {
    public static void main(String[] args) {
        String nome1 = " Ana Silva ";
        String nome2 = "";
        String nome3 = null;

        System.out.println("Normalizado: " + TextoUtils.normalizar(nome1));
        System.out.println("nome1 informado: " + TextoUtils.informado(nome1));
        System.out.println("nome2 informado: " + TextoUtils.informado(nome2));
        System.out.println("nome3 informado: " + TextoUtils.informado(nome3));
    }
}

class TextoUtils {
    private TextoUtils() {
    }

    static boolean informado(String valor) {
        return valor != null && !valor.isBlank();
    }

    static String normalizar(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim();
    }
}
```

Compile e execute:

```powershell
javac UtilitarioTextoStatic.java
java UtilitarioTextoStatic
```

---

## Por que o construtor é privado

A classe `TextoUtils` tem:

```java
private TextoUtils() {
}
```

Isso impede criar instância:

```java
new TextoUtils()
```

Por quê?

Porque a classe existe apenas para métodos utilitários.

Não há estado de objeto.

Então não faz sentido criar um objeto `TextoUtils`.

Esse padrão é comum em classes utilitárias.

Mas cuidado: nem tudo deve virar utilitário static.

---

## O perigo das classes Utils

Classes utilitárias podem ajudar, mas também podem virar depósito de qualquer coisa.

Exemplos ruins:

```text
PedidoUtils;
ClienteUtils;
SistemaUtils;
GeralUtils;
RegraUtils;
DataUtils gigante;
ValidacaoUtils gigante.
```

Quando tudo vira `Utils`, você pode estar fugindo da modelagem orientada a objetos.

Exemplo ruim:

```java
PedidoUtils.podeFinalizar(pedido, cliente, pagamento, item)
```

Talvez essa regra pertença ao próprio `Pedido`.

Melhor:

```java
pedido.podeFinalizar()
```

Use utilitários para funções realmente genéricas.

Não use `static` para roubar comportamento dos objetos.

---

## static não acessa atributo de instância diretamente

Um método `static` pertence à classe.

Por isso, ele não pode acessar diretamente atributos de instância.

Exemplo conceitual que não compila:

```java
class Cliente {
    private String nome;

    static String resumo() {
        return nome;
    }
}
```

Por que não compila?

Porque `nome` pertence a cada objeto.

Mas o método `static` não está executando em um objeto específico.

Ele não sabe de qual cliente pegar o nome.

Para acessar `nome`, você precisa de uma instância:

```java
static String resumoDe(Cliente cliente) {
    return cliente.nome;
}
```

Mas mesmo isso precisa ser usado com critério.

---

## Exemplo 5 — static e instância

Crie:

```text
StaticNaoAcessaInstancia.java
```

Código:

```java
public class StaticNaoAcessaInstancia {
    public static void main(String[] args) {
        ClienteStaticInstancia cliente = new ClienteStaticInstancia("Ana Silva");

        System.out.println(cliente.resumo());
        System.out.println(ClienteStaticInstancia.tipo());
    }
}

class ClienteStaticInstancia {
    private final String nome;

    ClienteStaticInstancia(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.nome = nome;
    }

    String resumo() {
        return "Cliente: " + nome;
    }

    static String tipo() {
        return "CLIENTE";
    }
}
```

Compile e execute:

```powershell
javac StaticNaoAcessaInstancia.java
java StaticNaoAcessaInstancia
```

Observe:

```java
cliente.resumo()
```

é método de instância.

```java
ClienteStaticInstancia.tipo()
```

é método da classe.

---

## Quando um método deve ser de instância

Um método deve ser de instância quando depende do estado do objeto.

Exemplos:

```java
pedido.total()
pedido.podeFinalizar()
cliente.ativo()
pagamento.aprovado()
produto.vender(2)
os.reagendar(periodo)
```

Esses métodos dependem dos dados daquele objeto específico.

Não deveriam ser `static`.

Ruim:

```java
PedidoUtils.total(pedido)
```

Melhor:

```java
pedido.total()
```

Se o comportamento pertence ao objeto, coloque no objeto.

---

## Quando um método pode ser static

Um método pode ser `static` quando:

```text
não depende de estado de instância;
é uma operação pura sobre parâmetros;
representa um utilitário geral;
é uma factory simples;
é um método de criação nomeado;
é uma constante de comportamento da classe.
```

Exemplos razoáveis:

```java
Math.max(a, b)
TextoUtils.informado(valor)
Email.criarNormalizado(valor)
Dinheiro.zero()
Periodo.entre(inicio, fim)
```

Mesmo nesses casos, use com critério.

---

## Método static de fábrica

Às vezes usamos `static` para criar objetos com nomes mais expressivos.

Exemplo:

```java
Dinheiro.zero()
```

ou:

```java
Periodo.entre(inicio, fim)
```

Isso é chamado de método de fábrica.

Crie:

```text
MetodoFabricaStatic.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class MetodoFabricaStatic {
    public static void main(String[] args) {
        DinheiroFabrica zero = DinheiroFabrica.zero();
        DinheiroFabrica valor = DinheiroFabrica.de("199.90");

        System.out.println("Zero: " + zero);
        System.out.println("Valor: " + valor);
        System.out.println("Total: " + zero.somar(valor));
    }
}

class DinheiroFabrica {
    private final BigDecimal valor;

    private DinheiroFabrica(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    static DinheiroFabrica zero() {
        return new DinheiroFabrica(BigDecimal.ZERO);
    }

    static DinheiroFabrica de(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor em texto é obrigatório.");
        }

        return new DinheiroFabrica(new BigDecimal(valor));
    }

    static DinheiroFabrica de(BigDecimal valor) {
        return new DinheiroFabrica(valor);
    }

    DinheiroFabrica somar(DinheiroFabrica outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new DinheiroFabrica(valor.add(outro.valor));
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac MetodoFabricaStatic.java
java MetodoFabricaStatic
```

---

## O que esse exemplo mostra

Aqui o construtor é privado:

```java
private DinheiroFabrica(BigDecimal valor)
```

E a criação acontece por métodos estáticos:

```java
DinheiroFabrica.zero()
DinheiroFabrica.de("199.90")
DinheiroFabrica.de(new BigDecimal("199.90"))
```

Isso pode deixar a criação mais expressiva.

Compare:

```java
new DinheiroFabrica(new BigDecimal("199.90"))
```

com:

```java
DinheiroFabrica.de("199.90")
```

O segundo é mais legível.

Esse é um uso bom de `static`.

---

## Estado global mutável

Agora vamos ao principal perigo.

Atributo `static` mutável pode virar estado global.

Exemplo:

```java
class SessaoGlobal {
    static String usuarioLogado;
}
```

Qualquer parte do sistema pode alterar:

```java
SessaoGlobal.usuarioLogado = "ana";
SessaoGlobal.usuarioLogado = "carlos";
```

Isso cria risco:

```text
um teste interfere no outro;
um usuário interfere no outro;
ordem de execução muda resultado;
debug fica mais difícil;
concorrência fica perigosa;
estado escondido aparece do nada.
```

Em backend, estado global mutável é especialmente perigoso.

---

## Exemplo 6 — problema com static mutável

Crie:

```text
EstadoGlobalStaticRuim.java
```

Código:

```java
public class EstadoGlobalStaticRuim {
    public static void main(String[] args) {
        SessaoGlobalRuim.usuarioAtual = "ana";

        PedidoSessaoRuim pedido1 = new PedidoSessaoRuim(1001);
        pedido1.aprovar();

        SessaoGlobalRuim.usuarioAtual = "carlos";

        PedidoSessaoRuim pedido2 = new PedidoSessaoRuim(1002);
        pedido2.aprovar();

        System.out.println(pedido1.resumo());
        System.out.println(pedido2.resumo());
    }
}

class SessaoGlobalRuim {
    static String usuarioAtual;
}

class PedidoSessaoRuim {
    private final int numero;
    private String aprovadoPor;

    PedidoSessaoRuim(int numero) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        this.numero = numero;
        this.aprovadoPor = "";
    }

    void aprovar() {
        aprovadoPor = SessaoGlobalRuim.usuarioAtual;
    }

    String resumo() {
        return "Pedido " + numero + " | Aprovado por: " + aprovadoPor;
    }
}
```

Compile e execute:

```powershell
javac EstadoGlobalStaticRuim.java
java EstadoGlobalStaticRuim
```

---

## Por que esse modelo é ruim

`PedidoSessaoRuim` depende de:

```java
SessaoGlobalRuim.usuarioAtual
```

Isso é escondido.

Quem chama:

```java
pedido.aprovar()
```

não enxerga que o método depende de um estado global.

Melhor seria deixar a dependência explícita:

```java
pedido.aprovar(usuario)
```

Assim o método recebe o usuário que executou a ação.

Vamos melhorar.

---

## Exemplo 7 — dependência explícita

Crie:

```text
DependenciaExplicitaMelhor.java
```

Código:

```java
public class DependenciaExplicitaMelhor {
    public static void main(String[] args) {
        UsuarioAprovador usuarioAna = new UsuarioAprovador("ana");
        UsuarioAprovador usuarioCarlos = new UsuarioAprovador("carlos");

        PedidoAprovacao pedido1 = new PedidoAprovacao(1001);
        pedido1.aprovar(usuarioAna);

        PedidoAprovacao pedido2 = new PedidoAprovacao(1002);
        pedido2.aprovar(usuarioCarlos);

        System.out.println(pedido1.resumo());
        System.out.println(pedido2.resumo());
    }
}

class UsuarioAprovador {
    private final String login;

    UsuarioAprovador(String login) {
        if (login == null || login.isBlank()) {
            throw new IllegalArgumentException("Login é obrigatório.");
        }

        this.login = login;
    }

    String login() {
        return login;
    }
}

class PedidoAprovacao {
    private final int numero;
    private String aprovadoPor;

    PedidoAprovacao(int numero) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        this.numero = numero;
        this.aprovadoPor = "";
    }

    void aprovar(UsuarioAprovador usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário aprovador é obrigatório.");
        }

        aprovadoPor = usuario.login();
    }

    String resumo() {
        return "Pedido " + numero + " | Aprovado por: " + aprovadoPor;
    }
}
```

Compile e execute:

```powershell
javac DependenciaExplicitaMelhor.java
java DependenciaExplicitaMelhor
```

---

## O que melhorou

Agora a dependência está clara:

```java
pedido.aprovar(usuarioAna);
```

O método não busca o usuário em estado global.

Ele recebe o usuário como parâmetro.

Isso melhora:

```text
leitura;
teste;
debug;
previsibilidade;
manutenção.
```

Regra prática:

```text
prefira dependência explícita a estado static global.
```

---

## static em testes

Quando uma classe usa estado `static` mutável, testes podem interferir uns nos outros.

Exemplo:

```java
ContadorGlobal.total = 10;
```

Um teste altera para 10.

Outro teste esperava começar com 0.

O resultado depende da ordem dos testes.

Isso é ruim.

Por isso, em código profissional, estado global mutável deve ser evitado ou muito bem controlado.

Constantes `static final` são tranquilas.

Métodos utilitários puros podem ser tranquilos.

Estado global mutável é que exige muito cuidado.

---

## static e Orientação a Objetos

Se você usa `static` para tudo, começa a voltar para programação procedural.

Exemplo ruim:

```java
PedidoServiceStatic.calcularTotal(pedido)
PedidoServiceStatic.aprovar(pedido)
PedidoServiceStatic.cancelar(pedido)
PedidoServiceStatic.enviar(pedido)
```

Talvez algumas dessas ações pertençam ao próprio objeto:

```java
pedido.total()
pedido.aprovar()
pedido.cancelar()
pedido.enviar()
```

Nem tudo deve ser método de objeto.  
Mas também nem tudo deve ser `static`.

A pergunta é:

```text
essa regra pertence a um objeto específico?
```

Se sim, evite `static`.

---

## Resumo mental de decisão

Antes de usar `static`, pergunte:

```text
isso pertence à classe ou ao objeto?
depende do estado de uma instância?
é uma constante?
é um utilitário puro?
é uma factory?
vai criar estado global?
vai atrapalhar teste?
vai esconder dependência?
estou usando static porque é certo ou porque parece mais fácil?
```

Se depende do estado do objeto, não use `static`.

Se é constante ou método utilitário puro, `static` pode fazer sentido.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Instância

Execute:

```text
AtributoDeInstancia.java
```

Explique:

```text
por que alterar cliente1 não alterou cliente2;
qual atributo pertence a cada objeto.
```

### Parte 2 — Static compartilhado

Execute:

```text
AtributoStaticCompartilhado.java
```

Explique:

```text
por que totalCriado aumentou para todos;
por que totalCriado pertence à classe.
```

### Parte 3 — Constante

Execute:

```text
ConstanteStaticFinal.java
```

Explique:

```text
por que DIAS_PARA_CASO_CRITICO é static final;
por que o nome da constante ajuda.
```

### Parte 4 — Utils

Execute:

```text
UtilitarioTextoStatic.java
```

Explique:

```text
por que TextoUtils não precisa de objeto;
por que o construtor é privado.
```

### Parte 5 — Factory

Execute:

```text
MetodoFabricaStatic.java
```

Compare:

```text
DinheiroFabrica.zero();
DinheiroFabrica.de("199.90");
```

com um construtor comum.

### Parte 6 — Estado global ruim

Execute:

```text
EstadoGlobalStaticRuim.java
DependenciaExplicitaMelhor.java
```

Explique:

```text
qual dependência ficou escondida no exemplo ruim;
por que passar usuário por parâmetro ficou melhor.
```

---

## Desafio prático

Crie o arquivo:

```text
StaticComCriterioPedido.java
```

Modele um pequeno domínio de pedido.

Classes sugeridas:

```text
CodigoPedidoStatic;
DinheiroStatic;
PedidoStaticCriterio;
UsuarioOperadorStatic.
```

Regras:

```text
CodigoPedidoStatic deve ter PREFIXO como static final.
Código deve iniciar com PED-.
DinheiroStatic deve ter zero() como método static factory.
DinheiroStatic deve ter de(String valor) como método static factory.
PedidoStaticCriterio deve ter número, total e status.
Pedido deve nascer CRIADO.
Pedido pode aprovar recebendo UsuarioOperadorStatic como parâmetro.
Não use estado global static para usuário atual.
Use static final para constantes.
Use método de instância para aprovar pedido.
```

Enums:

```java
enum StatusPedidoStatic {
    CRIADO,
    APROVADO,
    CANCELADO
}
```

No `main`, crie:

```text
um código válido;
um dinheiro com factory;
um usuário operador;
um pedido;
aprove o pedido passando o usuário por parâmetro;
imprima o resumo.
```

Depois teste:

```text
código sem PED-;
valor nulo;
aprovar com usuário nulo;
aprovar pedido já aprovado.
```

---

## Erros comuns

### 1. Achar que static é obrigatório para chamar método

Método de objeto deve ser chamado por instância.

### 2. Usar static porque parece mais fácil

Facilidade imediata pode virar acoplamento depois.

### 3. Criar estado global mutável

Atributo static alterável pode causar bugs difíceis.

### 4. Colocar regra de domínio em Utils

Se a regra pertence ao objeto, coloque no objeto.

### 5. Chamar static por instância

Prefira:

```java
Classe.metodoStatic()
```

não:

```java
objeto.metodoStatic()
```

### 6. Achar que static final sempre é imutável

`final` impede reatribuição, mas objetos internos ainda podem ser mutáveis.

### 7. Criar classe Utils gigante

Classes utilitárias devem ser pequenas e específicas.

### 8. Usar static para esconder dependência

Prefira passar dependências importantes por parâmetro ou modelar corretamente.

---

## Debug recomendado

Use debug em:

```text
AtributoStaticCompartilhado.java
ConstanteStaticFinal.java
MetodoFabricaStatic.java
EstadoGlobalStaticRuim.java
DependenciaExplicitaMelhor.java
```

Observe:

```text
quando atributo de instância pertence a cada objeto;
quando atributo static é compartilhado;
quando método static é chamado pela classe;
quando factory cria novo objeto;
quando estado global é lido sem aparecer no parâmetro;
quando dependência explícita fica mais fácil de entender.
```

Breakpoints recomendados:

```java
totalCriado++;
ClienteStatic.totalCriado();

OrdemServicoConstante.casoCritico(...);

DinheiroFabrica.zero();
DinheiroFabrica.de("199.90");

pedido1.aprovar();
pedido2.aprovar();

pedido.aprovar(usuario);
```

No exemplo ruim, observe que `aprovar()` depende de `SessaoGlobalRuim.usuarioAtual`.

No exemplo melhor, observe que `aprovar(usuario)` recebe a dependência claramente.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre atributo de instância e atributo static?
2. Quando static final faz sentido?
3. Por que estado global static mutável é perigoso?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar static;
diferenciar classe e instância;
criar atributo static;
criar método static;
usar static final para constante;
nomear constantes corretamente;
criar método utilitário simples;
criar factory static;
evitar estado global mutável;
explicar por que static não acessa atributo de instância diretamente;
decidir quando método deve ser de instância;
decidir quando método pode ser static;
evitar classes Utils gigantes;
debugar comportamento static;
resolver o desafio StaticComCriterioPedido;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-121-static-com-criterio
git commit -m "Aula 121: pratica static com criterio"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
static pertence à classe; membros de instância pertencem ao objeto.
```

Você viu que `static` pode ser útil para:

```text
main;
constantes;
métodos utilitários puros;
factories;
contadores simples em exemplos didáticos.
```

Mas também viu que `static` pode ser perigoso quando cria estado global mutável ou quando rouba comportamento que deveria pertencer aos objetos.

Use `static` com critério.

Na próxima aula, vamos estudar `final` em classes, métodos e atributos.

Vamos entender como `final` ajuda a proteger reatribuição, herança, sobrescrita e intenção de design.
