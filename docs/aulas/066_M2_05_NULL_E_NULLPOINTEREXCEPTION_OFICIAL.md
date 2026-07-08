# 066 — M2.05 — Null e NullPointerException

## A pergunta central da aula

Observe:

```java
class Cliente {
    String nome;
}
```

Agora:

```java
Cliente cliente = new Cliente();

System.out.println(cliente.nome.length());
```

O objeto `cliente` existe.

Mas o campo `nome` está `null`.

Por quê?

Porque `String` é referência e campo de referência recebe default `null`.

Então:

```java
cliente.nome.length()
```

tenta chamar `length()` em `null`.

Resultado:

```text
NullPointerException.
```

A pergunta central é:

```text
como identificar, prevenir e tratar corretamente situações de null?
```

A resposta envolve:

```text
entender o que null significa;
validar antes de acessar;
inicializar objetos corretamente;
melhorar contratos de métodos;
evitar retornar null quando não for necessário;
usar mensagens claras;
ler stack trace;
usar Optional apenas no momento certo;
não esconder erro de regra com defaults falsos.
```

---

## O que é null

`null` é um valor especial que significa:

```text
esta referência não aponta para nenhum objeto.
```

Exemplo:

```java
String nome = null;
Cliente cliente = null;
int[] valores = null;
```

Nesses casos:

```text
nome não aponta para String;
cliente não aponta para Cliente;
valores não aponta para array.
```

A variável existe.

Mas não existe objeto acessível por ela.

Por isso, acessar campo, método ou posição por uma referência `null` causa problema.

---

## O que é NullPointerException

`NullPointerException`, ou NPE, é uma exceção lançada quando o código tenta usar `null` como se fosse objeto.

Exemplos:

```java
nome.length();
cliente.nome;
valores[0];
pedido.status.equals("APROVADO");
mensagem.tipo.toUpperCase();
```

Se a referência antes do acesso estiver `null`, ocorre NPE.

Exemplo:

```java
String nome = null;

System.out.println(nome.length());
```

Aqui:

```text
nome = null;
nome.length() tenta chamar método;
não existe objeto;
NullPointerException.
```

---

## Por que null existe

`null` existe para representar ausência de valor ou ausência de objeto.

Exemplos legítimos:

```text
cliente ainda não encontrado;
pedido não localizado;
campo opcional não informado;
resultado de busca vazio;
configuração ausente;
posição de array ainda não preenchida;
referência removida para permitir coleta;
valor ainda não carregado.
```

O problema não é o `null` existir.

O problema é usar `null` sem contrato claro e sem validação.

---

## Null não é texto vazio

Isto é texto vazio:

```java
String nome = "";
```

Isto é texto em branco:

```java
String nome = "   ";
```

Isto é ausência de referência:

```java
String nome = null;
```

São três coisas diferentes.

Exemplo:

```text
null -> não há objeto String;
"" -> há objeto String sem caracteres;
"   " -> há objeto String com espaços.
```

Por isso, validação robusta precisa considerar:

```java
nome != null && !nome.isBlank()
```

---

## Null não é zero

Para número primitivo:

```java
int quantidade = 0;
```

`0` é valor.

Para referência:

```java
Integer quantidade = null;
```

`null` é ausência de objeto.

Nesta aula, vamos focar principalmente em referências comuns:

```text
String;
arrays;
objetos próprios;
campos de objeto.
```

Wrappers como `Integer`, `Long`, `Boolean` serão aprofundados mais adiante.

---

## Causas comuns de NullPointerException

As causas mais comuns são:

```text
campo de objeto não inicializado;
variável de referência iniciada como null;
método retornou null;
array de objetos com posição null;
parâmetro recebido como null;
uso de equals no lado possivelmente null;
cadeia de acessos sem validação;
objeto criado incompleto;
busca sem resultado;
configuração ausente;
limpeza de referência com null e uso posterior.
```

Vamos ver cada uma com código.

---

## Vocabulário essencial

Termos desta aula:

```text
null;
NullPointerException;
NPE;
referência;
ausência de objeto;
campo null;
parâmetro null;
retorno null;
array de referências;
posição null;
validação;
pré-condição;
contrato de método;
mensagem de erro;
stack trace;
causa raiz;
objeto incompleto;
Optional;
Optional.empty;
Optional.ofNullable;
isPresent;
orElse;
orElseThrow;
fail fast;
valor obrigatório;
valor opcional;
equals seguro;
Objects.requireNonNull.
```

Termos mais importantes:

```text
null -> referência sem objeto;
NPE -> erro ao usar null como objeto;
contrato de método -> regra sobre o que o método aceita e devolve;
parâmetro obrigatório -> parâmetro que não deveria ser null;
retorno opcional -> resultado que pode não existir;
stack trace -> caminho do erro até a linha onde aconteceu;
validação defensiva -> checagem antes de acessar;
fail fast -> falhar cedo com mensagem clara;
Optional -> tipo para representar ausência/presença de resultado em retornos específicos.
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        String nome = null;

        System.out.println(nome.length());
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

Resultado esperado:

```text
Exception in thread "main" java.lang.NullPointerException
```

A linha do erro aponta para:

```java
System.out.println(nome.length());
```

Interpretação:

```text
nome está null;
não existe objeto String;
não é possível chamar length().
```

---

## Corrigindo com validação simples

Arquivo:

```text
ValidacaoNullSimples.java
```

Código:

```java
public class ValidacaoNullSimples {
    public static void main(String[] args) {
        String nome = null;

        if (nome != null) {
            System.out.println(nome.length());
        } else {
            System.out.println("Nome não informado.");
        }
    }
}
```

Saída:

```text
Nome não informado.
```

A regra é:

```text
antes de chamar método em referência que pode ser null, valide.
```

---

## Validando texto preenchido

Arquivo:

```text
TextoPreenchido.java
```

Código:

```java
public class TextoPreenchido {
    public static void main(String[] args) {
        exibirResultado(null);
        exibirResultado("");
        exibirResultado("   ");
        exibirResultado("Ana");
    }

    public static void exibirResultado(String texto) {
        if (textoPreenchido(texto)) {
            System.out.println("Texto válido: " + texto);
        } else {
            System.out.println("Texto inválido.");
        }
    }

    public static boolean textoPreenchido(String texto) {
        return texto != null && !texto.isBlank();
    }
}
```

Saída esperada:

```text
Texto inválido.
Texto inválido.
Texto inválido.
Texto válido: Ana
```

Esse método é um padrão inicial importante.

---

## Ordem da validação importa

Correto:

```java
texto != null && !texto.isBlank()
```

Errado:

```java
!texto.isBlank() && texto != null
```

Por quê?

Porque se `texto` for `null`, a primeira versão avalia:

```java
texto != null
```

como `false` e nem tenta executar `texto.isBlank()`.

Isso se chama curto-circuito do `&&`.

Na versão errada, Java tenta primeiro:

```java
texto.isBlank()
```

e quebra com NPE.

---

## Exemplo de ordem errada

Arquivo:

```text
ErroOrdemValidacao.java
```

Código propositalmente errado:

```java
public class ErroOrdemValidacao {
    public static void main(String[] args) {
        String nome = null;

        if (!nome.isBlank() && nome != null) {
            System.out.println("Nome válido.");
        } else {
            System.out.println("Nome inválido.");
        }
    }
}
```

Esse código compila.

Mas quebra em execução.

Correção:

```java
if (nome != null && !nome.isBlank()) {
```

---

## Campo não inicializado

Arquivo:

```text
CampoNull.java
```

Código:

```java
public class CampoNull {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        System.out.println(cliente.nome.length());
    }
}

class Cliente {
    String nome;
}
```

`cliente` não é null.

Mas:

```java
cliente.nome
```

é null.

Então:

```java
cliente.nome.length()
```

quebra.

Esse é um erro muito comum:

```text
o objeto existe, mas um campo interno não.
```

---

## Corrigindo campo null

Arquivo:

```text
CampoNullCorrigido.java
```

Código:

```java
public class CampoNullCorrigido {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";

        System.out.println(cliente.nome.length());
    }
}

class Cliente {
    String nome;
}
```

Agora funciona.

Mas, profissionalmente, é melhor criar objeto já inicializado.

Exemplo:

```java
Cliente cliente = criarCliente("Ana");
```

---

## Criando objeto com dados obrigatórios

Arquivo:

```text
CriarClienteSeguro.java
```

Código:

```java
public class CriarClienteSeguro {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana");

        System.out.println(cliente.nome.length());
    }

    public static Cliente criarCliente(String nome) {
        Cliente cliente = new Cliente();

        if (nome == null || nome.isBlank()) {
            cliente.nome = "NAO_INFORMADO";
        } else {
            cliente.nome = nome.trim();
        }

        return cliente;
    }
}

class Cliente {
    String nome;
}
```

Esse exemplo evita campo `nome` null.

Mas a decisão `"NAO_INFORMADO"` é regra de negócio didática.

Em sistema real, talvez seja melhor bloquear criação.

---

## Bloqueando criação inválida com mensagem clara

Arquivo:

```text
ClienteObrigatorio.java
```

Código:

```java
public class ClienteObrigatorio {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana");

        System.out.println(cliente.nome);
    }

    public static Cliente criarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        Cliente cliente = new Cliente();

        cliente.nome = nome.trim();

        return cliente;
    }
}

class Cliente {
    String nome;
}
```

Aqui usamos:

```java
throw new IllegalArgumentException(...)
```

Esse é um jeito de falhar cedo com mensagem clara.

Ainda estudaremos exceções com mais profundidade.

Por enquanto, entenda:

```text
se o dado obrigatório não veio, é melhor falhar com mensagem clara do que criar objeto inválido.
```

---

## Objects.requireNonNull

Java possui uma classe utilitária:

```java
java.util.Objects
```

Ela tem o método:

```java
Objects.requireNonNull(valor, "mensagem");
```

Exemplo:

```java
import java.util.Objects;

public class RequireNonNullExemplo {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana");

        System.out.println(cliente.nome);
    }

    public static Cliente criarCliente(String nome) {
        Objects.requireNonNull(nome, "Nome do cliente é obrigatório.");

        Cliente cliente = new Cliente();

        cliente.nome = nome.trim();

        return cliente;
    }
}

class Cliente {
    String nome;
}
```

Se `nome` for null, a exceção terá mensagem clara.

Atenção:

```text
requireNonNull valida null, mas não valida texto em branco.
```

Para texto, ainda precisamos:

```java
nome.isBlank()
```

após validar que não é null.

---

## Validação completa com Objects.requireNonNull

Arquivo:

```text
RequireNonNullTexto.java
```

Código:

```java
import java.util.Objects;

public class RequireNonNullTexto {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana");

        System.out.println(cliente.nome);
    }

    public static Cliente criarCliente(String nome) {
        Objects.requireNonNull(nome, "Nome do cliente é obrigatório.");

        if (nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente não pode ficar em branco.");
        }

        Cliente cliente = new Cliente();

        cliente.nome = nome.trim();

        return cliente;
    }
}

class Cliente {
    String nome;
}
```

Esse padrão é melhor que deixar NPE aparecer em outro lugar do código.

Ele falha cedo e com mensagem de negócio.

---

## equals seguro com constante

Erro comum:

```java
status.equals("APROVADO")
```

Se `status` for null, quebra.

Mais seguro:

```java
"APROVADO".equals(status)
```

Se `status` for null, retorna `false`.

Arquivo:

```text
EqualsSeguro.java
```

Código:

```java
public class EqualsSeguro {
    public static void main(String[] args) {
        String status = null;

        if ("APROVADO".equals(status)) {
            System.out.println("Aprovado.");
        } else {
            System.out.println("Não aprovado.");
        }
    }
}
```

Saída:

```text
Não aprovado.
```

Esse é um padrão muito usado.

---

## Exemplo de equals inseguro

Arquivo:

```text
ErroEqualsInseguro.java
```

Código propositalmente errado:

```java
public class ErroEqualsInseguro {
    public static void main(String[] args) {
        String status = null;

        if (status.equals("APROVADO")) {
            System.out.println("Aprovado.");
        } else {
            System.out.println("Não aprovado.");
        }
    }
}
```

Esse código compila.

Mas quebra com NPE.

Correção:

```java
"APROVADO".equals(status)
```

---

## Array de objetos e null

Arquivo:

```text
ArrayObjetoNull.java
```

Código:

```java
public class ArrayObjetoNull {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[3];

        clientes[0] = new Cliente();
        clientes[0].nome = "Ana";

        for (int indice = 0; indice < clientes.length; indice++) {
            if (clientes[indice] != null) {
                System.out.println(clientes[indice].nome);
            } else {
                System.out.println("Posição " + indice + " vazia.");
            }
        }
    }
}

class Cliente {
    String nome;
}
```

Saída:

```text
Ana
Posição 1 vazia.
Posição 2 vazia.
```

Arrays de referência podem ter posições null.

Valide antes de acessar.

---

## Erro em array de objetos

Arquivo:

```text
ErroArrayObjetoNull.java
```

Código propositalmente errado:

```java
public class ErroArrayObjetoNull {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[3];

        clientes[0] = new Cliente();
        clientes[0].nome = "Ana";

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println(clientes[indice].nome);
        }
    }
}

class Cliente {
    String nome;
}
```

Quebra ao chegar em:

```text
clientes[1]
```

porque essa posição está null.

---

## Método retornando null

Arquivo:

```text
BuscaRetornaNull.java
```

Código:

```java
public class BuscaRetornaNull {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[2];

        clientes[0] = criarCliente("Ana");
        clientes[1] = criarCliente("Bruno");

        Cliente encontrado = buscarCliente(clientes, "Carla");

        if (encontrado != null) {
            System.out.println("Encontrado: " + encontrado.nome);
        } else {
            System.out.println("Cliente não encontrado.");
        }
    }

    public static Cliente criarCliente(String nome) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;

        return cliente;
    }

    public static Cliente buscarCliente(Cliente[] clientes, String nome) {
        for (int indice = 0; indice < clientes.length; indice++) {
            if (clientes[indice] != null && nome.equalsIgnoreCase(clientes[indice].nome)) {
                return clientes[indice];
            }
        }

        return null;
    }
}

class Cliente {
    String nome;
}
```

Aqui `null` representa:

```text
cliente não encontrado.
```

Isso é aceitável didaticamente, mas exige validação no chamador.

---

## Erro ao ignorar retorno null

Arquivo:

```text
ErroBuscaRetornaNull.java
```

Código propositalmente errado:

```java
public class ErroBuscaRetornaNull {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[1];

        clientes[0] = criarCliente("Ana");

        Cliente encontrado = buscarCliente(clientes, "Carla");

        System.out.println(encontrado.nome);
    }

    public static Cliente criarCliente(String nome) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;

        return cliente;
    }

    public static Cliente buscarCliente(Cliente[] clientes, String nome) {
        for (int indice = 0; indice < clientes.length; indice++) {
            if (clientes[indice] != null && nome.equalsIgnoreCase(clientes[indice].nome)) {
                return clientes[indice];
            }
        }

        return null;
    }
}

class Cliente {
    String nome;
}
```

O método pode retornar null.

O chamador ignorou.

Resultado:

```text
NullPointerException.
```

---

## Contrato de método

Contrato de método é a regra combinada sobre:

```text
o que o método espera receber;
o que o método devolve;
quando pode devolver null;
quando lança exceção;
quais entradas são obrigatórias;
quais entradas são opcionais.
```

Exemplo de contrato claro:

```java
public static Cliente buscarCliente(Cliente[] clientes, String nome)
```

Contrato possível:

```text
clientes não pode ser null;
nome não pode ser null nem blank;
retorna Cliente se encontrar;
retorna null se não encontrar.
```

Se esse contrato não está claro, bugs aparecem.

---

## Documentando contrato com comentários úteis

Exemplo:

```java
/**
 * Busca cliente pelo nome.
 * Retorna null quando não encontrar.
 */
public static Cliente buscarCliente(Cliente[] clientes, String nome) {
    ...
}
```

Comentários não substituem código bom.

Mas, quando um método pode retornar `null`, documentar ajuda.

Melhor ainda é usar um tipo que expresse ausência.

É aqui que entra `Optional`, no momento certo.

---

## Optional no momento certo

`Optional` é uma classe do Java usada para representar um resultado que pode existir ou não existir.

Exemplo conceitual:

```text
buscar cliente pode encontrar ou não;
buscar produto pode encontrar ou não;
buscar pedido pode encontrar ou não.
```

Em vez de retornar `null`, podemos retornar:

```java
Optional<Cliente>
```

Isso obriga o chamador a lidar com ausência.

Atenção:

```text
Optional deve ser usado principalmente como retorno de método.
```

Nesta fase, não use `Optional` para tudo.

Não use como campo de entidade agora.

Não use como parâmetro sem necessidade.

Vamos usar apenas para busca.

---

## Primeiro exemplo com Optional

Arquivo:

```text
BuscaComOptional.java
```

Código:

```java
import java.util.Optional;

public class BuscaComOptional {
    public static void main(String[] args) {
        Cliente[] clientes = new Cliente[2];

        clientes[0] = criarCliente("Ana");
        clientes[1] = criarCliente("Bruno");

        Optional<Cliente> encontrado = buscarCliente(clientes, "Carla");

        if (encontrado.isPresent()) {
            System.out.println("Encontrado: " + encontrado.get().nome);
        } else {
            System.out.println("Cliente não encontrado.");
        }
    }

    public static Cliente criarCliente(String nome) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;

        return cliente;
    }

    public static Optional<Cliente> buscarCliente(Cliente[] clientes, String nome) {
        for (int indice = 0; indice < clientes.length; indice++) {
            if (clientes[indice] != null && nome.equalsIgnoreCase(clientes[indice].nome)) {
                return Optional.of(clientes[indice]);
            }
        }

        return Optional.empty();
    }
}

class Cliente {
    String nome;
}
```

Aqui o retorno deixa claro:

```text
pode haver Cliente;
pode não haver Cliente.
```

---

## Optional.of, Optional.empty e Optional.ofNullable

Três formas importantes:

```java
Optional.of(valor)
```

Use quando `valor` não pode ser null.

Se for null, lança erro.

```java
Optional.empty()
```

Representa ausência.

```java
Optional.ofNullable(valor)
```

Aceita valor que pode ser null.

Se valor for null, retorna `Optional.empty()`.

Exemplo:

```java
return Optional.ofNullable(clienteEncontrado);
```

Nesta aula, usamos:

```java
Optional.of(...)
Optional.empty()
```

porque sabemos quando achou e quando não achou.

---

## Cuidado com Optional.get

Isto pode quebrar:

```java
Optional<Cliente> encontrado = buscarCliente(clientes, "Carla");

System.out.println(encontrado.get().nome);
```

Se estiver vazio, `get()` lança erro.

Então não use `get()` sem verificar.

Padrão simples:

```java
if (encontrado.isPresent()) {
    Cliente cliente = encontrado.get();
    System.out.println(cliente.nome);
} else {
    System.out.println("Cliente não encontrado.");
}
```

Mais adiante veremos formas melhores, como:

```java
orElse
orElseThrow
map
ifPresent
```

Nesta fase, `isPresent()` é suficiente para entendimento.

---

## Optional com orElse

Arquivo:

```text
OptionalOrElse.java
```

Código:

```java
import java.util.Optional;

public class OptionalOrElse {
    public static void main(String[] args) {
        Optional<String> status = normalizarStatus(null);

        String statusFinal = status.orElse("NAO_INFORMADO");

        System.out.println(statusFinal);
    }

    public static Optional<String> normalizarStatus(String status) {
        if (status == null || status.isBlank()) {
            return Optional.empty();
        }

        return Optional.of(status.trim().toUpperCase());
    }
}
```

Saída:

```text
NAO_INFORMADO
```

`orElse` permite fornecer valor padrão quando o Optional está vazio.

---

## Optional com orElseThrow

Arquivo:

```text
OptionalOrElseThrow.java
```

Código:

```java
import java.util.Optional;

public class OptionalOrElseThrow {
    public static void main(String[] args) {
        Optional<String> status = normalizarStatus("aprovado");

        String statusFinal = status.orElseThrow();

        System.out.println(statusFinal);
    }

    public static Optional<String> normalizarStatus(String status) {
        if (status == null || status.isBlank()) {
            return Optional.empty();
        }

        return Optional.of(status.trim().toUpperCase());
    }
}
```

Se o Optional estiver vazio, `orElseThrow()` lança exceção.

Use quando ausência for erro naquele ponto.

---

## Quando usar null

`null` ainda aparece em Java.

Pode ser aceitável quando:

```text
campo ainda não preenchido tecnicamente;
integração externa retorna ausência;
biblioteca trabalha com null;
array de referências tem posições vazias;
objeto é criado em etapas didáticas;
limpeza de referência é intencional;
contrato antigo já usa null.
```

Mas, sempre que usar, pense:

```text
quem vai validar?
quem pode receber null?
isso está documentado?
existe alternativa melhor?
```

---

## Quando evitar null

Evite `null` quando:

```text
o valor é obrigatório;
o objeto não deveria existir incompleto;
o método pode falhar mais cedo com mensagem clara;
um retorno vazio pode ser representado por Optional;
um texto pode ser normalizado para valor controlado;
um array pode ter contador de posições válidas;
um status pode ter valor inicial explícito.
```

Exemplo melhor:

```java
pedido.status = "PENDENTE";
```

em vez de deixar:

```java
pedido.status = null;
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoNullSeguro.java
```

Código:

```java
public class PedidoNullSeguro {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("Ana", 1000L);

        exibirPedido(pedido);
    }

    public static Pedido criarPedido(String cliente, long valorCentavos) {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente do pedido é obrigatório.");
        }

        if (valorCentavos <= 0) {
            throw new IllegalArgumentException("Valor do pedido deve ser maior que zero.");
        }

        Pedido pedido = new Pedido();

        pedido.cliente = cliente.trim();
        pedido.valorCentavos = valorCentavos;
        pedido.status = "PENDENTE";

        return pedido;
    }

    public static void exibirPedido(Pedido pedido) {
        if (pedido == null) {
            System.out.println("Pedido não informado.");
            return;
        }

        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Valor: " + pedido.valorCentavos);
        System.out.println("Status: " + pedido.status);
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Esse exemplo combina:

```text
validação de criação;
mensagem clara;
objeto inicializado;
defesa no método de exibição.
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoNullSeguro.java
```

Código:

```java
public class ProdutoNullSeguro {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", 10);

        baixarEstoque(produto, 3);

        System.out.println("Estoque: " + produto.estoque);
    }

    public static Produto criarProduto(String nome, int estoque) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        Produto produto = new Produto();

        produto.nome = nome.trim();
        produto.estoque = estoque;
        produto.ativo = true;

        return produto;
    }

    public static void baixarEstoque(Produto produto, int quantidade) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade de baixa deve ser maior que zero.");
        }

        if (quantidade > produto.estoque) {
            throw new IllegalArgumentException("Quantidade de baixa maior que estoque.");
        }

        produto.estoque -= quantidade;
    }
}

class Produto {
    String nome;
    int estoque;
    boolean ativo;
}
```

O método `baixarEstoque` não deixa o erro aparecer como NPE genérica.

Ele falha com mensagem clara.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoNullSeguro.java
```

Código:

```java
public class PagamentoNullSeguro {
    public static void main(String[] args) {
        Pagamento pagamento = criarPagamento(10000L, 4);

        long parcela = calcularParcela(pagamento);

        System.out.println("Parcela: " + parcela);
    }

    public static Pagamento criarPagamento(long valorCentavos, int parcelas) {
        if (valorCentavos <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (parcelas <= 0) {
            throw new IllegalArgumentException("Parcelas deve ser maior que zero.");
        }

        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = valorCentavos;
        pagamento.parcelas = parcelas;

        return pagamento;
    }

    public static long calcularParcela(Pagamento pagamento) {
        if (pagamento == null) {
            throw new IllegalArgumentException("Pagamento é obrigatório.");
        }

        return pagamento.valorCentavos / pagamento.parcelas;
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
}
```

Aqui evitamos:

```text
pagamento null;
parcelas 0;
objeto incompleto.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoNullSeguro.java
```

Código:

```java
public class OrdemServicoNullSeguro {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001");

        concluirSePossivel(os);

        System.out.println("Status: " + os.status);
    }

    public static OrdemServico criarOs(String certificado) {
        if (certificado == null || certificado.isBlank()) {
            throw new IllegalArgumentException("Certificado da OS é obrigatório.");
        }

        OrdemServico os = new OrdemServico();

        os.certificado = certificado.trim();
        os.status = "ABERTA";
        os.atividadesPendentes = 0;

        return os;
    }

    public static void concluirSePossivel(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if ("ABERTA".equals(os.status) && os.atividadesPendentes == 0) {
            os.status = "CONCLUIDA";
        }
    }
}

class OrdemServico {
    String certificado;
    String status;
    int atividadesPendentes;
}
```

Uso importante:

```java
"ABERTA".equals(os.status)
```

evita NPE se `status` estiver null.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaNullSeguro.java
```

Código:

```java
public class MensageriaNullSeguro {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "ENTREGA");

        registrarTentativa(mensagem);

        System.out.println("Tentativas: " + mensagem.tentativas);
    }

    public static Mensagem criarMensagem(String cliente, String tipo) {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo de mensagem é obrigatório.");
        }

        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente.trim();
        mensagem.tipo = tipo.trim().toUpperCase();
        mensagem.tentativas = 0;
        mensagem.enviada = false;

        return mensagem;
    }

    public static void registrarTentativa(Mensagem mensagem) {
        if (mensagem == null) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        mensagem.tentativas++;
    }
}

class Mensagem {
    String cliente;
    String tipo;
    int tentativas;
    boolean enviada;
}
```

Esse exemplo evita mensagem incompleta.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaNullSeguro.java
```

Código:

```java
public class AuditoriaNullSeguro {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "CRIACAO");

        marcarSucesso(registro);

        System.out.println(registro.usuario + " | " + registro.operacao + " | " + registro.status);
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao) {
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (operacao == null || operacao.isBlank()) {
            throw new IllegalArgumentException("Operação é obrigatória.");
        }

        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario.trim();
        registro.operacao = operacao.trim().toUpperCase();
        registro.status = "PENDENTE";

        return registro;
    }

    public static void marcarSucesso(RegistroAuditoria registro) {
        if (registro == null) {
            throw new IllegalArgumentException("Registro de auditoria é obrigatório.");
        }

        registro.status = "SUCESSO";
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
}
```

Auditoria sem usuário ou operação deve falhar cedo.

---

## Lendo stack trace de NullPointerException

Quando ocorre NPE, Java mostra um stack trace.

Exemplo aproximado:

```text
Exception in thread "main" java.lang.NullPointerException
    at Main.exibirCliente(Main.java:12)
    at Main.main(Main.java:5)
```

Leia de cima para baixo.

A primeira linha relevante do seu código geralmente indica onde o erro aconteceu:

```text
Main.exibirCliente(Main.java:12)
```

Significa:

```text
classe Main;
método exibirCliente;
arquivo Main.java;
linha 12.
```

Depois aparece quem chamou:

```text
Main.main(Main.java:5)
```

Stack trace responde:

```text
onde quebrou?
como chegou lá?
```

---

## Exemplo para ler stack trace

Arquivo:

```text
StackTraceNpe.java
```

Código:

```java
public class StackTraceNpe {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        exibirCliente(cliente);
    }

    public static void exibirCliente(Cliente cliente) {
        exibirNome(cliente.nome);
    }

    public static void exibirNome(String nome) {
        System.out.println(nome.length());
    }
}

class Cliente {
    String nome;
}
```

O erro acontece em:

```java
System.out.println(nome.length());
```

Mas a causa começou antes:

```text
cliente.nome estava null.
```

Stack trace ajuda a encontrar o caminho.

---

## Refatoração: validar na borda do método

Código fraco:

```java
public static void exibirNome(String nome) {
    System.out.println(nome.length());
}
```

Refatorado:

```java
public static void exibirNome(String nome) {
    if (nome == null || nome.isBlank()) {
        System.out.println("Nome não informado.");
        return;
    }

    System.out.println(nome.length());
}
```

Ou, se nome é obrigatório:

```java
public static void exibirNome(String nome) {
    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome é obrigatório.");
    }

    System.out.println(nome.length());
}
```

A decisão depende da regra:

```text
ausência é aceitável?
ou ausência é erro?
```

---

## Refatoração: melhorar contrato de busca

Versão com null:

```java
public static Cliente buscarCliente(Cliente[] clientes, String nome) {
    ...
    return null;
}
```

Contrato precisa ser lembrado.

Versão com Optional:

```java
public static Optional<Cliente> buscarCliente(Cliente[] clientes, String nome) {
    ...
    return Optional.empty();
}
```

O retorno comunica ausência.

Mas não use Optional por moda.

Use quando o método representa busca ou resultado opcional.

---

## Quando Optional é adequado

Use `Optional` principalmente para retorno de métodos como:

```text
buscarCliente;
buscarProduto;
buscarPedido;
localizarMensagem;
obterConfiguracaoOpcional;
normalizarStatus opcional.
```

Exemplo:

```java
Optional<Cliente> cliente = buscarCliente(clientes, "Ana");
```

Isso comunica:

```text
pode encontrar;
pode não encontrar.
```

---

## Quando Optional não é adequado nesta fase

Evite usar Optional em:

```text
campos de classe;
parâmetros de método;
todos os getters;
todo lugar onde null aparece;
coleções e arrays nesta fase;
substituição automática de validação.
```

Também evite:

```java
Optional<Cliente> cliente = null;
```

Isso é pior, porque agora o próprio Optional pode ser null.

Regra:

```text
Optional deve evitar ausência ambígua, não criar outra camada de confusão.
```

---

## Erros comuns

### Erro 1 — Chamar método em referência null

```java
nome.length()
```

quando `nome == null`.

---

### Erro 2 — Acessar campo de objeto null

```java
cliente.nome
```

quando `cliente == null`.

---

### Erro 3 — Acessar campo null dentro de objeto existente

```java
cliente.nome.length()
```

quando `cliente != null`, mas `cliente.nome == null`.

---

### Erro 4 — Array de objetos sem validar posição

```java
clientes[indice].nome
```

quando `clientes[indice] == null`.

---

### Erro 5 — Usar equals do lado possivelmente null

```java
status.equals("APROVADO")
```

Prefira:

```java
"APROVADO".equals(status)
```

---

### Erro 6 — Método retorna null e chamador ignora

Se pode retornar null, valide.

---

### Erro 7 — Optional.get sem verificar presença

```java
optional.get()
```

sem `isPresent()` ou alternativa segura.

---

### Erro 8 — Usar Optional em campo sem necessidade

Nesta fase, use Optional em retorno de busca.

---

### Erro 9 — Trocar NPE por valor falso sem regra

Exemplo:

```java
if (nome == null) nome = "";
```

Isso pode esconder erro de dado obrigatório.

---

### Erro 10 — Não ler stack trace

Stack trace mostra a linha do erro.

Leia antes de chutar.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugNullPointer {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        exibirCliente(cliente);
    }

    public static void exibirCliente(Cliente cliente) {
        System.out.println(cliente.nome.length());
    }
}

class Cliente {
    String nome;
}
```

Coloque breakpoint em:

```java
System.out.println(cliente.nome.length());
```

Observe:

```text
cliente não é null;
cliente.nome é null.
```

Esse debug ensina:

```text
nem sempre a primeira referência é null;
às vezes o campo interno é null.
```

Depois corrija:

```java
if (cliente != null && cliente.nome != null) {
```

ou inicialize o cliente corretamente.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-066-null-nullpointerexception
cd labs\m2\aula-066-null-nullpointerexception
```

Crie arquivos:

```text
Main.java
ValidacaoNullSimples.java
TextoPreenchido.java
ErroOrdemValidacao.java
CampoNull.java
CampoNullCorrigido.java
CriarClienteSeguro.java
ClienteObrigatorio.java
RequireNonNullExemplo.java
RequireNonNullTexto.java
EqualsSeguro.java
ErroEqualsInseguro.java
ArrayObjetoNull.java
ErroArrayObjetoNull.java
BuscaRetornaNull.java
ErroBuscaRetornaNull.java
BuscaComOptional.java
OptionalOrElse.java
OptionalOrElseThrow.java
PedidoNullSeguro.java
ProdutoNullSeguro.java
PagamentoNullSeguro.java
OrdemServicoNullSeguro.java
MensageriaNullSeguro.java
AuditoriaNullSeguro.java
StackTraceNpe.java
DebugNullPointer.java
ErroStringNull.java
ErroCampoInternoNull.java
ErroOptionalGet.java
README.md
```

Compile os válidos:

```powershell
javac Main.java
javac ValidacaoNullSimples.java
javac TextoPreenchido.java
javac CampoNullCorrigido.java
javac CriarClienteSeguro.java
javac ClienteObrigatorio.java
javac RequireNonNullExemplo.java
javac RequireNonNullTexto.java
javac EqualsSeguro.java
javac ArrayObjetoNull.java
javac BuscaRetornaNull.java
javac BuscaComOptional.java
javac OptionalOrElse.java
javac OptionalOrElseThrow.java
javac PedidoNullSeguro.java
javac ProdutoNullSeguro.java
javac PagamentoNullSeguro.java
javac OrdemServicoNullSeguro.java
javac MensageriaNullSeguro.java
javac AuditoriaNullSeguro.java
```

Compile e execute os de erro proposital separadamente:

```powershell
javac ErroOrdemValidacao.java
java ErroOrdemValidacao

javac CampoNull.java
java CampoNull

javac ErroEqualsInseguro.java
java ErroEqualsInseguro

javac ErroArrayObjetoNull.java
java ErroArrayObjetoNull

javac ErroBuscaRetornaNull.java
java ErroBuscaRetornaNull

javac StackTraceNpe.java
java StackTraceNpe

javac DebugNullPointer.java
java DebugNullPointer

javac ErroOptionalGet.java
java ErroOptionalGet
```

Execute os exemplos válidos:

```powershell
java Main
java ValidacaoNullSimples
java TextoPreenchido
java CampoNullCorrigido
java CriarClienteSeguro
java ClienteObrigatorio
java RequireNonNullExemplo
java RequireNonNullTexto
java EqualsSeguro
java ArrayObjetoNull
java BuscaRetornaNull
java BuscaComOptional
java OptionalOrElse
java OptionalOrElseThrow
java PedidoNullSeguro
java ProdutoNullSeguro
java PagamentoNullSeguro
java OrdemServicoNullSeguro
java MensageriaNullSeguro
java AuditoriaNullSeguro
```

---

## Observações

- Não esconder dado obrigatório com default falso.
- Não usar Optional em tudo.
- Ler stack trace antes de chutar.
- Validar null na borda do método quando necessário.
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
git add labs/m2/aula-066-null-nullpointerexception docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 066: pratica null e NullPointerException em Java"
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
explicar null;
explicar NullPointerException;
provocar NPE com String null;
provocar NPE com campo interno null;
provocar NPE com array de objetos;
corrigir validação de String null;
explicar curto-circuito com &&;
usar textoPreenchido;
usar equals seguro;
explicar campo null;
explicar parâmetro null;
explicar retorno null;
validar retorno null;
ler stack trace;
identificar linha do erro;
explicar contrato de método;
usar Objects.requireNonNull;
usar IllegalArgumentException com mensagem clara;
usar Optional em retorno de busca;
usar Optional.empty;
usar Optional.of;
usar Optional.ofNullable conceitualmente;
usar isPresent com get;
usar orElse;
usar orElseThrow;
evitar Optional.get inseguro;
evitar Optional em campo nesta fase;
aplicar em pedido;
aplicar em produto;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar referência null;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar Optional avançado.

Não precisa ainda dominar `map`, `flatMap`, `filter` de Optional.

Não precisa ainda dominar Bean Validation.

Não precisa ainda dominar exceções customizadas.

Não precisa ainda dominar annotations de nullability.

Não precisa ainda dominar validação em Spring.

Esses assuntos virão depois.

O objetivo é dominar causas, prevenção e diagnóstico inicial de `NullPointerException`.

---

## Fechamento da aula

Hoje estudamos `null` e `NullPointerException`.

A ideia central foi:

```text
null significa ausência de referência; NPE acontece quando usamos null como se fosse objeto.
```

Vimos que NPE pode acontecer com:

```text
String null;
objeto null;
campo interno null;
posição null de array;
retorno null ignorado;
parâmetro null;
equals inseguro;
Optional.get sem presença.
```

Também vimos formas de prevenção:

```text
inicializar objetos corretamente;
validar null antes de acessar;
usar ordem correta no &&;
usar equals seguro;
falhar cedo com mensagem clara;
documentar contrato de método;
usar Optional no retorno de busca quando fizer sentido;
ler stack trace;
debugar a referência suspeita.
```

O ponto mais importante é:

```text
não basta evitar NPE; é preciso deixar claro se a ausência é permitida ou se é erro de regra.
```

Na próxima aula, vamos estudar:

```text
String pool e imutabilidade de String.
```

A próxima aula vai explicar literais, `new String`, `equals`, `==`, concatenação e impactos de performance e legibilidade.
