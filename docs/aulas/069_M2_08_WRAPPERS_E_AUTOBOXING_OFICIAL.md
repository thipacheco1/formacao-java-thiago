# 069 — M2.08 — Wrappers e Autoboxing

## A pergunta central da aula

Observe:

```java
int quantidadePrimitiva = 10;
Integer quantidadeWrapper = 10;
```

Os dois parecem iguais.

Mas não são.

`int` é primitivo.

`Integer` é objeto.

Isso muda coisas importantes:

```text
int não pode ser null;
Integer pode ser null;

int compara valor com ==;
Integer com == pode comparar referência em alguns cenários;

int tem menor overhead;
Integer pode ser necessário em APIs, coleções e ausência de valor;

int não tem métodos;
Integer tem métodos e constantes;

int vive como valor primitivo;
Integer é referência para objeto.
```

Essa aula serve para entender essas diferenças sem decorar de forma solta.

---

## O que são wrappers

Wrappers são classes que representam valores primitivos como objetos.

Principais pares:

| Primitivo | Wrapper |
|---|---|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `boolean` | `Boolean` |
| `char` | `Character` |

Os mais comuns em backend no começo são:

```text
Integer;
Long;
Double;
Boolean.
```

Exemplos:

```java
Integer idade = 30;
Long valorCentavos = 1000L;
Double media = 9.5;
Boolean ativo = true;
```

Eles são objetos.

Por isso, podem ser `null`.

---

## Por que wrappers existem

Wrappers existem porque algumas partes do Java trabalham com objetos.

Exemplos:

```text
coleções;
generics;
APIs;
serialização;
frameworks;
campos que podem estar ausentes;
conversões de texto para número;
utilitários de tipos.
```

Exemplo com coleção, que veremos mais profundamente depois:

```java
// A ideia é esta:
// List<Integer> numeros;
```

Coleções não trabalham com `int` diretamente em generics.

Usam `Integer`.

Também usamos wrappers quando precisamos representar ausência:

```java
Integer idade = null;
```

Isso pode significar:

```text
idade não informada.
```

Mas essa possibilidade também traz risco de `NullPointerException`.

---

## Primitivo versus wrapper

### Primitivo

```java
int quantidade = 10;
```

Características:

```text
não é objeto;
não pode ser null;
não tem métodos;
comparação com == compara valor;
mais simples e leve;
bom para cálculos obrigatórios.
```

### Wrapper

```java
Integer quantidade = 10;
```

Características:

```text
é objeto;
pode ser null;
tem métodos e constantes;
pode ser usado em APIs que exigem objeto;
pode representar ausência;
exige cuidado com unboxing e comparação.
```

Regra prática inicial:

```text
use primitivo quando o valor é obrigatório e sempre existe;
use wrapper quando precisa representar ausência ou integrar com API que exige objeto.
```

---

## O que é autoboxing

Autoboxing é a conversão automática de primitivo para wrapper.

Exemplo:

```java
Integer quantidade = 10;
```

O valor `10` é um `int`.

Mas a variável é `Integer`.

O Java converte automaticamente:

```text
int -> Integer
```

Conceitualmente:

```java
Integer quantidade = Integer.valueOf(10);
```

Essa conversão automática é chamada:

```text
autoboxing.
```

---

## O que é unboxing

Unboxing é a conversão automática de wrapper para primitivo.

Exemplo:

```java
Integer quantidadeWrapper = 10;

int quantidadePrimitiva = quantidadeWrapper;
```

O Java converte:

```text
Integer -> int
```

Conceitualmente:

```java
int quantidadePrimitiva = quantidadeWrapper.intValue();
```

Essa conversão automática é chamada:

```text
unboxing.
```

O risco é:

```java
Integer quantidadeWrapper = null;

int quantidadePrimitiva = quantidadeWrapper;
```

Isso quebra com `NullPointerException`.

Porque Java tenta fazer unboxing de `null`.

---

## Exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        int quantidadePrimitiva = 10;

        Integer quantidadeWrapper = quantidadePrimitiva;

        int quantidadeConvertida = quantidadeWrapper;

        System.out.println("Primitivo: " + quantidadePrimitiva);
        System.out.println("Wrapper: " + quantidadeWrapper);
        System.out.println("Convertida: " + quantidadeConvertida);
    }
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída esperada:

```text
Primitivo: 10
Wrapper: 10
Convertida: 10
```

O que aconteceu:

```text
int -> Integer por autoboxing;
Integer -> int por unboxing.
```

---

## Null em wrapper

Arquivo:

```text
WrapperNull.java
```

Código:

```java
public class WrapperNull {
    public static void main(String[] args) {
        Integer idade = null;

        if (idade == null) {
            System.out.println("Idade não informada.");
        } else {
            System.out.println("Idade: " + idade);
        }
    }
}
```

Saída:

```text
Idade não informada.
```

`Integer` pode ser `null`.

`int` não pode.

Este código não compila:

```java
int idade = null;
```

Então wrapper pode representar ausência.

Mas exige cuidado.

---

## Erro de unboxing com null

Arquivo:

```text
ErroUnboxingNull.java
```

Código propositalmente problemático:

```java
public class ErroUnboxingNull {
    public static void main(String[] args) {
        Integer quantidade = null;

        int valor = quantidade;

        System.out.println(valor);
    }
}
```

Esse código compila.

Mas quebra em execução.

Por quê?

Porque:

```text
Integer quantidade está null;
Java tenta converter para int;
não existe valor dentro do wrapper;
NullPointerException.
```

Correção:

```java
if (quantidade != null) {
    int valor = quantidade;
}
```

ou usar valor padrão intencional.

---

## Correção com validação

Arquivo:

```text
UnboxingComValidacao.java
```

Código:

```java
public class UnboxingComValidacao {
    public static void main(String[] args) {
        Integer quantidade = null;

        int valor;

        if (quantidade != null) {
            valor = quantidade;
        } else {
            valor = 0;
        }

        System.out.println("Valor: " + valor);
    }
}
```

Saída:

```text
Valor: 0
```

Atenção:

```text
usar 0 como padrão precisa ser regra consciente.
```

Não use só para esconder erro.

---

## Correção com método

Arquivo:

```text
ConverterWrapperSeguro.java
```

Código:

```java
public class ConverterWrapperSeguro {
    public static void main(String[] args) {
        Integer quantidade = null;

        int valor = converterParaInt(quantidade, 0);

        System.out.println("Valor: " + valor);
    }

    public static int converterParaInt(Integer valor, int valorPadrao) {
        if (valor == null) {
            return valorPadrao;
        }

        return valor;
    }
}
```

Esse método deixa explícito:

```text
se valor vier null, usar valorPadrao.
```

Mas a decisão do valor padrão continua sendo de negócio.

---

## Métodos úteis dos wrappers

Wrappers têm métodos úteis.

Exemplos:

```java
Integer.parseInt("10")
Long.parseLong("1000")
Double.parseDouble("9.5")
Boolean.parseBoolean("true")
Integer.valueOf("10")
Long.valueOf("1000")
Double.valueOf("9.5")
Boolean.valueOf("true")
```

Diferença inicial:

```text
parseInt retorna int;
valueOf retorna Integer.
```

Exemplo:

```java
int idade = Integer.parseInt("30");
Integer idadeWrapper = Integer.valueOf("30");
```

---

## parseInt

Arquivo:

```text
ParseIntExemplo.java
```

Código:

```java
public class ParseIntExemplo {
    public static void main(String[] args) {
        String texto = "30";

        int idade = Integer.parseInt(texto);

        System.out.println("Idade: " + idade);
    }
}
```

Saída:

```text
Idade: 30
```

Se texto não for número:

```java
Integer.parseInt("abc")
```

ocorre:

```text
NumberFormatException.
```

Esse assunto será aprofundado em conversões e exceções, mas já precisamos conhecer.

---

## valueOf

Arquivo:

```text
ValueOfExemplo.java
```

Código:

```java
public class ValueOfExemplo {
    public static void main(String[] args) {
        String texto = "30";

        Integer idade = Integer.valueOf(texto);

        System.out.println("Idade: " + idade);
    }
}
```

Saída:

```text
Idade: 30
```

`valueOf` retorna wrapper.

`parseInt` retorna primitivo.

---

## NumberFormatException

Arquivo:

```text
ErroNumberFormat.java
```

Código propositalmente problemático:

```java
public class ErroNumberFormat {
    public static void main(String[] args) {
        String texto = "abc";

        int valor = Integer.parseInt(texto);

        System.out.println(valor);
    }
}
```

Compila.

Mas quebra em execução:

```text
NumberFormatException.
```

Motivo:

```text
abc não pode virar int.
```

Correção inicial:

```text
validar entrada;
tratar exceção;
garantir formato numérico.
```

Veremos isso mais profundamente nas próximas aulas.

---

## Boolean.parseBoolean

Arquivo:

```text
BooleanParseExemplo.java
```

Código:

```java
public class BooleanParseExemplo {
    public static void main(String[] args) {
        boolean primeiro = Boolean.parseBoolean("true");
        boolean segundo = Boolean.parseBoolean("false");
        boolean terceiro = Boolean.parseBoolean("abc");

        System.out.println(primeiro);
        System.out.println(segundo);
        System.out.println(terceiro);
    }
}
```

Saída:

```text
true
false
false
```

Atenção:

```text
Boolean.parseBoolean("abc") não lança erro;
retorna false.
```

Isso pode ser perigoso se você esperava validar entrada.

Para regra de negócio, talvez seja melhor aceitar apenas:

```text
true;
false;
sim;
não;
ativo;
inativo.
```

e validar manualmente.

---

## Comparação de wrappers com ==

Esse é um dos pontos mais perigosos.

Observe:

```java
Integer a = 100;
Integer b = 100;

System.out.println(a == b);
```

Pode imprimir:

```text
true
```

Agora:

```java
Integer a = 1000;
Integer b = 1000;

System.out.println(a == b);
```

Pode imprimir:

```text
false
```

Por quê?

Porque Java pode cachear alguns valores de wrappers, especialmente `Integer` em uma faixa comum.

Então `==` em wrappers pode dar resultado confuso.

Regra profissional:

```text
para comparar valor de wrappers, use equals ou compare como primitivo com cuidado.
```

---

## Exemplo de comparação perigosa

Arquivo:

```text
ComparacaoWrapperIgualIgual.java
```

Código:

```java
public class ComparacaoWrapperIgualIgual {
    public static void main(String[] args) {
        Integer pequenoA = 100;
        Integer pequenoB = 100;

        Integer grandeA = 1000;
        Integer grandeB = 1000;

        System.out.println("100 == 100: " + (pequenoA == pequenoB));
        System.out.println("1000 == 1000: " + (grandeA == grandeB));

        System.out.println("100 equals 100: " + pequenoA.equals(pequenoB));
        System.out.println("1000 equals 1000: " + grandeA.equals(grandeB));
    }
}
```

Saída típica:

```text
100 == 100: true
1000 == 1000: false
100 equals 100: true
1000 equals 1000: true
```

Conclusão:

```text
não use == para comparar wrappers em regra de negócio.
```

---

## Comparação segura de wrappers

Opção 1: `equals`, quando a variável da esquerda não é null.

```java
Integer a = 1000;
Integer b = 1000;

System.out.println(a.equals(b));
```

Mas se `a` for null, quebra.

Opção 2: `Objects.equals`.

```java
import java.util.Objects;

System.out.println(Objects.equals(a, b));
```

`Objects.equals` trata null com segurança.

Exemplo:

```java
Objects.equals(null, 10) -> false
Objects.equals(null, null) -> true
Objects.equals(10, 10) -> true
```

---

## Objects.equals

Arquivo:

```text
ObjectsEqualsWrapper.java
```

Código:

```java
import java.util.Objects;

public class ObjectsEqualsWrapper {
    public static void main(String[] args) {
        Integer primeiro = null;
        Integer segundo = 10;
        Integer terceiro = 10;

        System.out.println(Objects.equals(primeiro, segundo));
        System.out.println(Objects.equals(segundo, terceiro));
        System.out.println(Objects.equals(primeiro, null));
    }
}
```

Saída:

```text
false
true
true
```

Esse é um bom padrão quando wrappers podem ser null.

---

## Comparando Boolean wrapper

`Boolean` wrapper pode ser:

```text
true;
false;
null.
```

Isso cria três estados.

Exemplo:

```java
Boolean ativo = null;
```

Pode significar:

```text
não informado.
```

Cuidado com:

```java
if (ativo) {
```

Se `ativo` for null, ocorre unboxing e NPE.

Arquivo:

```text
ErroBooleanUnboxing.java
```

Código propositalmente problemático:

```java
public class ErroBooleanUnboxing {
    public static void main(String[] args) {
        Boolean ativo = null;

        if (ativo) {
            System.out.println("Ativo.");
        } else {
            System.out.println("Inativo.");
        }
    }
}
```

Esse código compila.

Mas quebra em execução.

---

## Comparação segura de Boolean

Use:

```java
Boolean.TRUE.equals(ativo)
```

Arquivo:

```text
BooleanSeguro.java
```

Código:

```java
public class BooleanSeguro {
    public static void main(String[] args) {
        Boolean ativo = null;

        if (Boolean.TRUE.equals(ativo)) {
            System.out.println("Ativo.");
        } else {
            System.out.println("Não ativo ou não informado.");
        }
    }
}
```

Saída:

```text
Não ativo ou não informado.
```

Também existe:

```java
Boolean.FALSE.equals(ativo)
```

para verificar explicitamente falso.

---

## Wrapper em campos de domínio

Quando usar `Integer` em campo?

Exemplo:

```java
class Cliente {
    Integer idade;
}
```

Pode fazer sentido se:

```text
idade é opcional;
idade pode não ter sido informada;
preciso diferenciar 0 de não informado.
```

Quando usar `int`?

```java
class Produto {
    int estoque;
}
```

Pode fazer sentido se:

```text
estoque sempre existe;
0 é valor válido;
não existe estado não informado.
```

A decisão depende da regra.

---

## Exemplo: idade opcional

Arquivo:

```text
IdadeOpcionalWrapper.java
```

Código:

```java
public class IdadeOpcionalWrapper {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente.idade = null;

        exibirCliente(cliente);
    }

    public static void exibirCliente(Cliente cliente) {
        System.out.println("Nome: " + cliente.nome);

        if (cliente.idade == null) {
            System.out.println("Idade não informada.");
        } else {
            System.out.println("Idade: " + cliente.idade);
        }
    }
}

class Cliente {
    String nome;
    Integer idade;
}
```

Aqui `Integer` expressa ausência.

Com `int`, não conseguiríamos usar `null`.

---

## Exemplo: estoque obrigatório

Arquivo:

```text
EstoquePrimitivo.java
```

Código:

```java
public class EstoquePrimitivo {
    public static void main(String[] args) {
        Produto produto = new Produto();

        produto.nome = "Cadeira";
        produto.estoque = 0;

        System.out.println("Estoque: " + produto.estoque);
    }
}

class Produto {
    String nome;
    int estoque;
}
```

Aqui `0` pode ser valor real:

```text
produto sem estoque.
```

Se a regra diz que estoque sempre existe, `int` é adequado.

---

## Performance e overhead

Primitivos são mais simples.

Wrappers são objetos.

Isso significa que wrappers podem ter overhead de:

```text
memória;
alocação;
autoboxing;
unboxing;
risco de null;
comparação por referência;
uso indevido em loops intensivos.
```

Na maioria dos códigos de negócio, não precisamos micro-otimizar.

Mas devemos evitar wrappers sem necessidade.

Exemplo ruim em cálculo intensivo:

```java
Integer total = 0;

for (int indice = 0; indice < 1000000; indice++) {
    total = total + indice;
}
```

Há autoboxing/unboxing repetido.

Melhor para cálculo obrigatório:

```java
int total = 0;
```

---

## Exemplo de autoboxing em loop

Arquivo:

```text
AutoboxingLoop.java
```

Código:

```java
public class AutoboxingLoop {
    public static void main(String[] args) {
        Integer totalWrapper = 0;

        for (int indice = 0; indice < 5; indice++) {
            totalWrapper = totalWrapper + indice;
        }

        System.out.println("Total: " + totalWrapper);
    }
}
```

Funciona.

Mas conceitualmente acontece:

```text
unboxing de totalWrapper;
soma com indice;
autoboxing do resultado para Integer.
```

Para cálculo simples, prefira:

```java
int total = 0;
```

---

## Refatoração de cálculo com primitivo

Arquivo:

```text
CalculoComPrimitivo.java
```

Código:

```java
public class CalculoComPrimitivo {
    public static void main(String[] args) {
        int total = 0;

        for (int indice = 0; indice < 5; indice++) {
            total = total + indice;
        }

        System.out.println("Total: " + total);
    }
}
```

Mais simples.

Sem risco de `null`.

Sem autoboxing desnecessário.

---

## Constantes úteis dos wrappers

Wrappers têm constantes.

Exemplos:

```java
Integer.MAX_VALUE
Integer.MIN_VALUE
Long.MAX_VALUE
Long.MIN_VALUE
Double.MAX_VALUE
Double.MIN_VALUE
Boolean.TRUE
Boolean.FALSE
```

Arquivo:

```text
ConstantesWrappers.java
```

Código:

```java
public class ConstantesWrappers {
    public static void main(String[] args) {
        System.out.println("Integer MAX: " + Integer.MAX_VALUE);
        System.out.println("Integer MIN: " + Integer.MIN_VALUE);
        System.out.println("Long MAX: " + Long.MAX_VALUE);
        System.out.println("Long MIN: " + Long.MIN_VALUE);
        System.out.println("Boolean TRUE: " + Boolean.TRUE);
        System.out.println("Boolean FALSE: " + Boolean.FALSE);
    }
}
```

Essas constantes são úteis para limites e validações.

---

## Aplicação em cliente

Arquivo:

```text
ClienteWrapper.java
```

Código:

```java
public class ClienteWrapper {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana", null);

        exibirCliente(cliente);
    }

    public static Cliente criarCliente(String nome, Integer idade) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;
        cliente.idade = idade;

        return cliente;
    }

    public static void exibirCliente(Cliente cliente) {
        System.out.println("Cliente: " + cliente.nome);

        if (cliente.idade == null) {
            System.out.println("Idade não informada.");
        } else {
            System.out.println("Idade: " + cliente.idade);
        }
    }
}

class Cliente {
    String nome;
    Integer idade;
}
```

Aqui `Integer idade` expressa valor opcional.

---

## Aplicação em produto

Arquivo:

```text
ProdutoWrapper.java
```

Código:

```java
public class ProdutoWrapper {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", 10, Boolean.TRUE);

        exibirProduto(produto);
    }

    public static Produto criarProduto(String nome, int estoque, Boolean ativo) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.estoque = estoque;
        produto.ativo = ativo;

        return produto;
    }

    public static void exibirProduto(Produto produto) {
        System.out.println("Produto: " + produto.nome);
        System.out.println("Estoque: " + produto.estoque);

        if (Boolean.TRUE.equals(produto.ativo)) {
            System.out.println("Produto ativo.");
        } else {
            System.out.println("Produto inativo ou não informado.");
        }
    }
}

class Produto {
    String nome;
    int estoque;
    Boolean ativo;
}
```

Aqui `Boolean ativo` pode ter três estados:

```text
true;
false;
null.
```

Isso só deve ser usado se `null` fizer sentido.

Se ativo sempre deve existir, prefira:

```java
boolean ativo;
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoWrapper.java
```

Código:

```java
import java.util.Objects;

public class PedidoWrapper {
    public static void main(String[] args) {
        Pedido primeiro = criarPedido(1L, 1000L);
        Pedido segundo = criarPedido(1L, 1000L);

        System.out.println("Mesmo id: " + Objects.equals(primeiro.id, segundo.id));
    }

    public static Pedido criarPedido(Long id, long valorCentavos) {
        Pedido pedido = new Pedido();

        pedido.id = id;
        pedido.valorCentavos = valorCentavos;

        return pedido;
    }
}

class Pedido {
    Long id;
    long valorCentavos;
}
```

`Long id` pode ser `null` antes de persistir.

Exemplo comum em backend:

```text
objeto novo ainda não tem id;
após salvar no banco, recebe id.
```

Já `valorCentavos` pode ser primitivo se sempre obrigatório.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoWrapper.java
```

Código:

```java
public class PagamentoWrapper {
    public static void main(String[] args) {
        Pagamento pagamento = criarPagamento(10000L, null);

        exibirPagamento(pagamento);
    }

    public static Pagamento criarPagamento(long valorCentavos, Integer parcelas) {
        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = valorCentavos;
        pagamento.parcelas = parcelas;

        return pagamento;
    }

    public static void exibirPagamento(Pagamento pagamento) {
        System.out.println("Valor: " + pagamento.valorCentavos);

        if (pagamento.parcelas == null) {
            System.out.println("Parcelas não informadas.");
            return;
        }

        System.out.println("Parcelas: " + pagamento.parcelas);
        System.out.println("Valor da parcela: " + (pagamento.valorCentavos / pagamento.parcelas));
    }
}

class Pagamento {
    long valorCentavos;
    Integer parcelas;
}
```

Aqui `parcelas` opcional exige validação antes do cálculo.

Se fizer:

```java
pagamento.valorCentavos / pagamento.parcelas
```

com `parcelas == null`, ocorre unboxing de null e NPE.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoWrapper.java
```

Código:

```java
public class OrdemServicoWrapper {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", null);

        exibirOs(os);
    }

    public static OrdemServico criarOs(String certificado, Integer tentativasReagendamento) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.tentativasReagendamento = tentativasReagendamento;

        return os;
    }

    public static void exibirOs(OrdemServico os) {
        System.out.println("Certificado: " + os.certificado);

        int tentativas = valorOuZero(os.tentativasReagendamento);

        System.out.println("Tentativas de reagendamento: " + tentativas);
    }

    public static int valorOuZero(Integer valor) {
        if (valor == null) {
            return 0;
        }

        return valor;
    }
}

class OrdemServico {
    String certificado;
    Integer tentativasReagendamento;
}
```

Aqui `Integer` pode representar ausência vindo de integração.

O método `valorOuZero` transforma ausência em regra explícita.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaWrapper.java
```

Código:

```java
public class MensageriaWrapper {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", null, Boolean.FALSE);

        exibirMensagem(mensagem);
    }

    public static Mensagem criarMensagem(String cliente, Integer tentativas, Boolean enviada) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.tentativas = tentativas;
        mensagem.enviada = enviada;

        return mensagem;
    }

    public static void exibirMensagem(Mensagem mensagem) {
        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Tentativas: " + valorOuZero(mensagem.tentativas));

        if (Boolean.TRUE.equals(mensagem.enviada)) {
            System.out.println("Mensagem enviada.");
        } else {
            System.out.println("Mensagem não enviada ou não informada.");
        }
    }

    public static int valorOuZero(Integer valor) {
        if (valor == null) {
            return 0;
        }

        return valor;
    }
}

class Mensagem {
    String cliente;
    Integer tentativas;
    Boolean enviada;
}
```

`Boolean.TRUE.equals` evita NPE.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaWrapper.java
```

Código:

```java
import java.util.Objects;

public class AuditoriaWrapper {
    public static void main(String[] args) {
        RegistroAuditoria primeiro = criarRegistro(100L, "aline");
        RegistroAuditoria segundo = criarRegistro(100L, "aline");

        if (Objects.equals(primeiro.id, segundo.id)) {
            System.out.println("Mesmo registro lógico.");
        }
    }

    public static RegistroAuditoria criarRegistro(Long id, String usuario) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.id = id;
        registro.usuario = usuario;

        return registro;
    }
}

class RegistroAuditoria {
    Long id;
    String usuario;
}
```

IDs em backend frequentemente usam wrappers:

```text
Long id;
```

porque antes de persistir pode ser `null`.

Mas ao comparar, use:

```java
Objects.equals(primeiro.id, segundo.id)
```

---

## Refatoração: wrapper para primitivo

Código com wrapper sem necessidade:

```java
Integer total = 0;

for (int indice = 0; indice < valores.length; indice++) {
    total = total + valores[indice];
}
```

Refatoração:

```java
int total = 0;

for (int indice = 0; indice < valores.length; indice++) {
    total = total + valores[indice];
}
```

Use wrapper apenas se houver motivo.

---

## Refatoração: Boolean seguro

Código perigoso:

```java
if (produto.ativo) {
    System.out.println("Ativo");
}
```

Se `ativo` for `Boolean` e estiver `null`, quebra.

Refatoração:

```java
if (Boolean.TRUE.equals(produto.ativo)) {
    System.out.println("Ativo");
}
```

Ou, se `ativo` é obrigatório, refatore o campo para:

```java
boolean ativo;
```

e garanta inicialização.

---

## Refatoração: comparação de ID

Código perigoso:

```java
if (pedido.id == outro.id) {
    System.out.println("Mesmo pedido");
}
```

Se `id` é `Long`, use:

```java
Objects.equals(pedido.id, outro.id)
```

Ou, se ambos já foram validados não null:

```java
pedido.id.equals(outro.id)
```

Mas `Objects.equals` é mais seguro quando há possibilidade de null.

---

## Erros comuns

### Erro 1 — Usar wrapper sem necessidade

Se o valor é obrigatório e sempre existe, primitivo pode ser melhor.

---

### Erro 2 — Fazer unboxing de null

```java
Integer valor = null;
int x = valor;
```

Gera NPE.

---

### Erro 3 — Usar Boolean em if direto

```java
Boolean ativo = null;

if (ativo) {
}
```

Gera NPE.

---

### Erro 4 — Comparar wrappers com ==

Pode dar comportamento confuso por cache e referência.

---

### Erro 5 — Esquecer que parseInt pode lançar NumberFormatException

Texto inválido não vira número.

---

### Erro 6 — Achar que Boolean.parseBoolean valida texto

`Boolean.parseBoolean("abc")` retorna `false`.

---

### Erro 7 — Usar null como ausência sem contrato

Se campo pode ser null, o código precisa deixar isso claro.

---

### Erro 8 — Usar equals em wrapper possivelmente null

```java
id.equals(outroId)
```

quebra se `id == null`.

Use `Objects.equals`.

---

### Erro 9 — Misturar wrapper e primitivo sem perceber autoboxing

Em loops e cálculos, isso pode ser desnecessário.

---

### Erro 10 — Usar valor padrão sem regra

Converter null para 0 pode esconder erro se 0 não for regra válida.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugWrapper {
    public static void main(String[] args) {
        Integer quantidade = null;

        int valor = quantidade;

        System.out.println(valor);
    }
}
```

Coloque breakpoint em:

```java
int valor = quantidade;
```

Observe:

```text
quantidade = null.
```

Ao avançar, ocorre NPE por unboxing.

Depois debugue:

```java
Integer a = 1000;
Integer b = 1000;

System.out.println(a == b);
System.out.println(a.equals(b));
```

Observe:

```text
conteúdo igual;
referências podem ser diferentes;
equals compara valor.
```

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-069-wrappers-autoboxing
cd labs\m2\aula-069-wrappers-autoboxing
```

Crie arquivos:

```text
Main.java
WrapperNull.java
ErroUnboxingNull.java
UnboxingComValidacao.java
ConverterWrapperSeguro.java
ParseIntExemplo.java
ValueOfExemplo.java
ErroNumberFormat.java
BooleanParseExemplo.java
ComparacaoWrapperIgualIgual.java
ObjectsEqualsWrapper.java
ErroBooleanUnboxing.java
BooleanSeguro.java
IdadeOpcionalWrapper.java
EstoquePrimitivo.java
AutoboxingLoop.java
CalculoComPrimitivo.java
ConstantesWrappers.java
ClienteWrapper.java
ProdutoWrapper.java
PedidoWrapper.java
PagamentoWrapper.java
OrdemServicoWrapper.java
MensageriaWrapper.java
AuditoriaWrapper.java
DebugWrapper.java
ErroCompararWrapperComIgual.java
ErroBooleanWrapperNull.java
ErroNullParaZeroSemRegra.java
README.md
```

Compile:

```powershell
javac Main.java
javac WrapperNull.java
javac ErroUnboxingNull.java
javac UnboxingComValidacao.java
javac ConverterWrapperSeguro.java
javac ParseIntExemplo.java
javac ValueOfExemplo.java
javac ErroNumberFormat.java
javac BooleanParseExemplo.java
javac ComparacaoWrapperIgualIgual.java
javac ObjectsEqualsWrapper.java
javac ErroBooleanUnboxing.java
javac BooleanSeguro.java
javac IdadeOpcionalWrapper.java
javac EstoquePrimitivo.java
javac AutoboxingLoop.java
javac CalculoComPrimitivo.java
javac ConstantesWrappers.java
javac ClienteWrapper.java
javac ProdutoWrapper.java
javac PedidoWrapper.java
javac PagamentoWrapper.java
javac OrdemServicoWrapper.java
javac MensageriaWrapper.java
javac AuditoriaWrapper.java
javac DebugWrapper.java
javac ErroCompararWrapperComIgual.java
javac ErroBooleanWrapperNull.java
javac ErroNullParaZeroSemRegra.java
```

Execute os exemplos válidos:

```powershell
java Main
java WrapperNull
java UnboxingComValidacao
java ConverterWrapperSeguro
java ParseIntExemplo
java ValueOfExemplo
java BooleanParseExemplo
java ComparacaoWrapperIgualIgual
java ObjectsEqualsWrapper
java BooleanSeguro
java IdadeOpcionalWrapper
java EstoquePrimitivo
java AutoboxingLoop
java CalculoComPrimitivo
java ConstantesWrappers
java ClienteWrapper
java ProdutoWrapper
java PedidoWrapper
java PagamentoWrapper
java OrdemServicoWrapper
java MensageriaWrapper
java AuditoriaWrapper
```

Execute os de erro proposital separadamente:

```powershell
java ErroUnboxingNull
java ErroNumberFormat
java ErroBooleanUnboxing
java DebugWrapper
java ErroCompararWrapperComIgual
java ErroBooleanWrapperNull
java ErroNullParaZeroSemRegra
```

Alguns devem quebrar ou demonstrar comportamento perigoso.

Use para diagnóstico.

---

## Observações

- Não usar wrapper sem motivo.
- Não fazer unboxing sem validar possibilidade de null.
- Não comparar wrappers com `==` em regra de negócio.
- Não converter null para 0 sem regra clara.
```

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m2/aula-069-wrappers-autoboxing docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 069: pratica wrappers e autoboxing em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar wrapper;
explicar primitivo;
listar wrappers principais;
explicar Integer;
explicar Long;
explicar Double;
explicar Boolean;
explicar autoboxing;
explicar unboxing;
provocar unboxing de null;
corrigir unboxing de null;
usar parseInt;
usar valueOf;
explicar NumberFormatException conceitualmente;
comparar wrappers com equals;
comparar wrappers com Objects.equals;
explicar por que == é perigoso em wrappers;
explicar cache de Integer conceitualmente;
usar Boolean.TRUE.equals;
explicar Boolean null;
decidir entre int e Integer;
decidir entre long e Long;
aplicar wrapper em id;
aplicar wrapper em campo opcional;
aplicar primitivo em campo obrigatório;
refatorar wrapper desnecessário para primitivo;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar wrapper null;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar generics.

Não precisa ainda dominar Collections.

Não precisa ainda dominar boxing cache em detalhes profundos.

Não precisa ainda dominar BigDecimal.

Não precisa ainda dominar Optional com wrappers.

Não precisa ainda dominar performance avançada de JVM.

Esses assuntos virão depois.

O objetivo é dominar wrappers, autoboxing, unboxing, `null`, comparação e decisões iniciais de uso.

---

## Fechamento da aula

Hoje estudamos wrappers e autoboxing.

A ideia central foi:

```text
wrappers são objetos que representam primitivos, e por isso podem ser null.
```

Vimos que:

```text
int é primitivo;
Integer é wrapper;
Long, Double e Boolean também são wrappers;
autoboxing converte primitivo para wrapper;
unboxing converte wrapper para primitivo;
unboxing de null causa NullPointerException;
wrappers com == podem comparar referência;
Objects.equals ajuda a comparar com null;
Boolean.TRUE.equals evita NPE;
parseInt retorna primitivo;
valueOf retorna wrapper.
```

O ponto mais importante é:

```text
use wrapper quando houver motivo; se o valor é obrigatório e simples, primitivo geralmente é melhor.
```

Na próxima aula, vamos estudar:

```text
Conversões e casting.
```

A próxima aula vai explicar conversão implícita, conversão explícita, perda de precisão, cast entre tipos numéricos, parsing e cuidados em regras de negócio.
