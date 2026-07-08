# 085 — M2.24 — Exceptions por baixo

## A pergunta central da aula

Imagine que seu sistema mostra este erro:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Calculadora.dividir(Calculadora.java:10)
    at Main.main(Main.java:4)
```

Muita gente iniciante só lê:

```text
deu erro.
```

Um desenvolvedor backend precisa ler:

```text
tipo da exceção: ArithmeticException;
mensagem: / by zero;
linha exata: Calculadora.java:10;
caminho da chamada: Main.main chamou Calculadora.dividir;
causa provável: divisão por zero;
local para começar investigação: método dividir.
```

Essa é a ideia da aula:

```text
aprender a ler exceções como mapa de investigação.
```

Exception não é só erro.

Exception é informação.

---

## O que é exception

Exception é um objeto que representa uma condição excepcional durante a execução do programa.

Exemplos:

```text
divisão por zero;
índice inválido de array;
valor null usado indevidamente;
arquivo não encontrado;
número inválido;
falha de conexão;
erro de validação;
estado inválido;
falha de integração;
regra de negócio violada.
```

Em Java, exceções fazem parte de uma hierarquia de classes.

A base principal é:

```java
Throwable
```

Abaixo dela, temos dois grandes grupos:

```text
Error;
Exception.
```

De forma simplificada:

```text
Error -> problemas graves da JVM/ambiente, normalmente não tratados pela aplicação;
Exception -> condições que a aplicação pode tratar ou propagar.
```

---

## Hierarquia simplificada

Mapa inicial:

```text
Throwable
├── Error
└── Exception
    ├── RuntimeException
    │   ├── NullPointerException
    │   ├── IllegalArgumentException
    │   ├── IllegalStateException
    │   ├── IndexOutOfBoundsException
    │   └── ArithmeticException
    └── checked exceptions
        ├── IOException
        ├── SQLException
        └── ClassNotFoundException
```

Para esta aula, o foco será:

```text
Exception;
RuntimeException;
checked exceptions;
unchecked exceptions;
stack trace;
causa raiz.
```

---

## Checked versus unchecked

Em Java, existem exceções verificadas e não verificadas.

### Checked exception

O compilador obriga você a tratar ou declarar.

Exemplo:

```java
throws IOException
```

Você precisa:

```text
capturar com try/catch;
ou propagar com throws.
```

### Unchecked exception

O compilador não obriga tratamento.

Geralmente herda de:

```java
RuntimeException
```

Exemplos:

```text
NullPointerException;
IllegalArgumentException;
IllegalStateException;
ArithmeticException;
IndexOutOfBoundsException.
```

Você pode tratar, mas não é obrigado pelo compilador.

---

## Quando usar unchecked

Unchecked é comum para:

```text
erro de programação;
argumento inválido;
estado inválido;
regra de negócio violada;
pré-condição quebrada;
falha que não faz sentido obrigar todo chamador a capturar.
```

Exemplos:

```java
throw new IllegalArgumentException("Nome é obrigatório.");
```

```java
throw new IllegalStateException("Pedido não pode ser aprovado neste status.");
```

Em backend, muitas exceções de domínio são unchecked.

---

## Quando usar checked

Checked é comum quando:

```text
o chamador tem chance real de recuperar;
a falha é esperada pelo ambiente externo;
a API quer forçar decisão explícita;
a operação depende de recurso externo.
```

Exemplos clássicos:

```text
arquivo não encontrado;
erro de leitura;
classe não encontrada;
falha de I/O.
```

Mas em aplicações modernas, muitos frameworks encapsulam checked exceptions em unchecked para simplificar camadas.

O importante agora é entender a diferença.

---

## Vocabulário essencial

Termos desta aula:

```text
exception;
Throwable;
Error;
Exception;
RuntimeException;
checked exception;
unchecked exception;
stack trace;
causa raiz;
root cause;
throw;
throws;
try;
catch;
finally;
propagar;
capturar;
relançar;
wrap;
cause;
message;
NullPointerException;
IllegalArgumentException;
IllegalStateException;
IOException;
ArithmeticException;
NumberFormatException;
log;
diagnóstico;
falha;
erro recuperável;
erro não recuperável.
```

Termos mais importantes:

```text
throw -> lança uma exceção;
throws -> declara que um método pode lançar exceção;
try -> bloco monitorado;
catch -> bloco que captura exceção;
finally -> bloco que executa ao final, com ou sem erro;
stack trace -> pilha de chamadas até o erro;
causa raiz -> erro original que explica o problema;
checked -> compilador exige tratamento ou declaração;
unchecked -> compilador não exige tratamento;
message -> mensagem da exceção;
cause -> exceção original encapsulada.
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
        int resultado = dividir(10, 0);

        System.out.println(resultado);
    }

    public static int dividir(int primeiro, int segundo) {
        return primeiro / segundo;
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
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.dividir(Main.java:9)
    at Main.main(Main.java:3)
```

A linha exata pode variar.

Ponto principal:

```text
o stack trace mostra onde o erro aconteceu e quem chamou.
```

---

## Como ler stack trace

Exemplo:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.dividir(Main.java:9)
    at Main.main(Main.java:3)
```

Leia assim:

### 1. Tipo da exceção

```text
java.lang.ArithmeticException
```

### 2. Mensagem

```text
/ by zero
```

### 3. Primeiro ponto da pilha

```text
at Main.dividir(Main.java:9)
```

Geralmente é o ponto onde a exceção foi lançada.

### 4. Chamador

```text
at Main.main(Main.java:3)
```

Mostra quem chamou o método que falhou.

Regra:

```text
comece a investigação pelo primeiro "at" do seu código.
```

---

## Stack trace com várias camadas

Arquivo:

```text
StackTraceCamadas.java
```

Código:

```java
public class StackTraceCamadas {
    public static void main(String[] args) {
        Controller controller = new Controller();

        controller.executar();
    }
}

class Controller {
    public void executar() {
        Service service = new Service();

        service.processar();
    }
}

class Service {
    public void processar() {
        Repository repository = new Repository();

        repository.buscar();
    }
}

class Repository {
    public void buscar() {
        String valor = null;

        System.out.println(valor.length());
    }
}
```

Execute e observe algo parecido com:

```text
java.lang.NullPointerException
    at Repository.buscar(StackTraceCamadas.java:...)
    at Service.processar(StackTraceCamadas.java:...)
    at Controller.executar(StackTraceCamadas.java:...)
    at StackTraceCamadas.main(StackTraceCamadas.java:...)
```

Leitura:

```text
Repository.buscar falhou;
foi chamado por Service.processar;
foi chamado por Controller.executar;
foi chamado por main.
```

Isso parece muito com backend real.

---

## NullPointerException

`NullPointerException` acontece quando você tenta usar algo que está `null`.

Exemplo:

```java
String nome = null;
nome.length();
```

Arquivo:

```text
NullPointerBasico.java
```

Código:

```java
public class NullPointerBasico {
    public static void main(String[] args) {
        String nome = null;

        System.out.println(nome.toUpperCase());
    }
}
```

Erro:

```text
NullPointerException
```

Diagnóstico:

```text
qual variável está null?
por que veio null?
faltou validação?
faltou inicialização?
o dado veio de entrada externa?
o método deveria aceitar null?
```

---

## IllegalArgumentException

Use quando o argumento recebido pelo método é inválido.

Arquivo:

```text
IllegalArgumentBasico.java
```

Código:

```java
public class IllegalArgumentBasico {
    public static void main(String[] args) {
        criarCliente("");
    }

    public static void criarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        System.out.println("Cliente criado: " + nome);
    }
}
```

Erro:

```text
java.lang.IllegalArgumentException: Nome do cliente é obrigatório.
```

Aqui a mensagem é clara.

Isso ajuda muito no diagnóstico.

---

## IllegalStateException

Use quando o estado do objeto ou processo não permite a operação.

Arquivo:

```text
IllegalStateBasico.java
```

Código:

```java
public class IllegalStateBasico {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(StatusPedido.CANCELADO);

        pedido.aprovar();
    }
}

class Pedido {
    private StatusPedido status;

    Pedido(StatusPedido status) {
        this.status = status;
    }

    public void aprovar() {
        if (status != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Pedido só pode ser aprovado quando estiver PENDENTE. Status atual: " + status);
        }

        status = StatusPedido.APROVADO;
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    CANCELADO
}
```

Diferença:

```text
IllegalArgumentException -> argumento inválido;
IllegalStateException -> estado atual não permite.
```

---

## NumberFormatException

Ocorre ao converter texto inválido para número.

Arquivo:

```text
NumberFormatBasico.java
```

Código:

```java
public class NumberFormatBasico {
    public static void main(String[] args) {
        String texto = "abc";

        int numero = Integer.parseInt(texto);

        System.out.println(numero);
    }
}
```

Erro:

```text
NumberFormatException
```

Diagnóstico:

```text
texto veio de usuário?
texto veio de API?
faltou validação?
a mensagem mostra o valor inválido?
```

---

## try/catch básico

`try/catch` captura exceção.

Arquivo:

```text
TryCatchBasico.java
```

Código:

```java
public class TryCatchBasico {
    public static void main(String[] args) {
        try {
            int resultado = dividir(10, 0);

            System.out.println(resultado);
        } catch (ArithmeticException erro) {
            System.out.println("Não foi possível dividir: " + erro.getMessage());
        }
    }

    public static int dividir(int primeiro, int segundo) {
        return primeiro / segundo;
    }
}
```

Saída:

```text
Não foi possível dividir: / by zero
```

O programa não quebra abruptamente porque a exceção foi capturada.

---

## Cuidado: catch não deve esconder erro

Código ruim:

```java
try {
    executar();
} catch (Exception erro) {
}
```

Problema:

```text
engole o erro;
não loga;
não informa usuário;
não corrige;
não propaga;
dificulta diagnóstico.
```

Regra:

```text
nunca capture exceção só para ignorar.
```

Se capturar, faça uma destas coisas:

```text
tratar de verdade;
adicionar contexto e relançar;
registrar log;
converter para resposta adequada;
executar fallback real;
propagar corretamente.
```

---

## getMessage

Toda exceção tem uma mensagem.

Exemplo:

```java
erro.getMessage()
```

Arquivo:

```text
GetMessageExemplo.java
```

Código:

```java
public class GetMessageExemplo {
    public static void main(String[] args) {
        try {
            validarNome("");
        } catch (IllegalArgumentException erro) {
            System.out.println("Mensagem: " + erro.getMessage());
        }
    }

    public static void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
    }
}
```

Saída:

```text
Mensagem: Nome é obrigatório.
```

Mensagem boa reduz tempo de investigação.

---

## Mensagens ruins versus boas

Mensagem ruim:

```java
throw new IllegalArgumentException("Erro.");
```

Mensagem melhor:

```java
throw new IllegalArgumentException("Nome do cliente é obrigatório.");
```

Mensagem ainda melhor, quando fizer sentido:

```java
throw new IllegalArgumentException("Nome do cliente é obrigatório para criar cadastro.");
```

Mensagem ruim:

```java
throw new IllegalStateException("Status inválido.");
```

Mensagem melhor:

```java
throw new IllegalStateException("Pedido só pode ser aprovado quando estiver PENDENTE. Status atual: CANCELADO.");
```

Regra:

```text
mensagem deve ajudar a corrigir o problema.
```

---

## printStackTrace

Você verá muito:

```java
erro.printStackTrace();
```

Arquivo:

```text
PrintStackTraceExemplo.java
```

Código:

```java
public class PrintStackTraceExemplo {
    public static void main(String[] args) {
        try {
            dividir(10, 0);
        } catch (ArithmeticException erro) {
            erro.printStackTrace();
        }
    }

    public static int dividir(int primeiro, int segundo) {
        return primeiro / segundo;
    }
}
```

Isso imprime a pilha.

Em aplicação real, normalmente usamos logs estruturados com framework de logging.

Mas nesta fase, `printStackTrace` ajuda a entender.

Cuidado:

```text
não use printStackTrace como solução final em backend profissional.
```

---

## finally

`finally` executa depois do `try/catch`, com erro ou sem erro.

Arquivo:

```text
FinallyBasico.java
```

Código:

```java
public class FinallyBasico {
    public static void main(String[] args) {
        try {
            System.out.println("Abrindo recurso.");
            dividir(10, 0);
        } catch (ArithmeticException erro) {
            System.out.println("Erro: " + erro.getMessage());
        } finally {
            System.out.println("Fechando recurso.");
        }
    }

    public static int dividir(int primeiro, int segundo) {
        return primeiro / segundo;
    }
}
```

Saída:

```text
Abrindo recurso.
Erro: / by zero
Fechando recurso.
```

`finally` é comum para limpeza de recursos.

No futuro, veremos `try-with-resources`, que é mais seguro para recursos fecháveis.

---

## throws

`throws` declara que o método pode lançar uma exceção.

Arquivo:

```text
ThrowsBasico.java
```

Código:

```java
import java.io.IOException;

public class ThrowsBasico {
    public static void main(String[] args) {
        try {
            lerArquivo();
        } catch (IOException erro) {
            System.out.println("Erro de leitura: " + erro.getMessage());
        }
    }

    public static void lerArquivo() throws IOException {
        throw new IOException("Arquivo não encontrado.");
    }
}
```

Aqui `IOException` é checked.

O compilador exige:

```text
capturar;
ou declarar throws.
```

---

## Propagação de exceção

Quando uma exceção não é capturada no método atual, ela sobe para quem chamou.

Arquivo:

```text
PropagacaoException.java
```

Código:

```java
public class PropagacaoException {
    public static void main(String[] args) {
        try {
            camadaController();
        } catch (IllegalArgumentException erro) {
            System.out.println("Capturado no main: " + erro.getMessage());
        }
    }

    public static void camadaController() {
        camadaService();
    }

    public static void camadaService() {
        camadaRepository();
    }

    public static void camadaRepository() {
        throw new IllegalArgumentException("ID inválido para consulta.");
    }
}
```

A exceção nasceu em `camadaRepository`, mas foi capturada no `main`.

Esse fluxo é comum em backend.

---

## Causa raiz

Causa raiz é a primeira falha real que explica o problema.

Exemplo:

```text
Erro ao processar pedido.
Causado por: Arquivo de configuração não encontrado.
```

O erro visível pode ser genérico.

A causa raiz é mais profunda.

Em Java, uma exceção pode carregar outra exceção como causa.

Exemplo:

```java
throw new RuntimeException("Erro ao processar pedido.", erroOriginal);
```

O segundo argumento é a causa.

---

## Encapsulando causa

Arquivo:

```text
CausaException.java
```

Código:

```java
import java.io.IOException;

public class CausaException {
    public static void main(String[] args) {
        try {
            processarPedido();
        } catch (RuntimeException erro) {
            erro.printStackTrace();
        }
    }

    public static void processarPedido() {
        try {
            lerArquivoConfiguracao();
        } catch (IOException erro) {
            throw new RuntimeException("Erro ao processar pedido por falha de configuração.", erro);
        }
    }

    public static void lerArquivoConfiguracao() throws IOException {
        throw new IOException("Arquivo configuracao.properties não encontrado.");
    }
}
```

Observe no stack trace:

```text
RuntimeException: Erro ao processar pedido...
Caused by: IOException: Arquivo configuracao.properties não encontrado.
```

O `Caused by` é fundamental.

---

## Perder causa raiz é erro grave

Código ruim:

```java
try {
    lerArquivo();
} catch (IOException erro) {
    throw new RuntimeException("Erro ao ler arquivo.");
}
```

Problema:

```text
a exceção original foi perdida;
stack trace original ficou menos claro;
diagnóstico ficou pior.
```

Melhor:

```java
throw new RuntimeException("Erro ao ler arquivo.", erro);
```

Regra:

```text
ao relançar com nova exceção, preserve a causa.
```

---

## Criando exception própria

Você pode criar exceções específicas.

Arquivo:

```text
ExceptionPropria.java
```

Código:

```java
public class ExceptionPropria {
    public static void main(String[] args) {
        try {
            criarCliente("");
        } catch (RegraNegocioException erro) {
            System.out.println("Erro de negócio: " + erro.getMessage());
        }
    }

    public static void criarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome do cliente é obrigatório.");
        }

        System.out.println("Cliente criado.");
    }
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }

    public RegraNegocioException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

Exceção própria ajuda quando você quer diferenciar erros de domínio.

---

## Checked exception própria

Também dá para criar checked exception:

```java
class IntegracaoException extends Exception {
}
```

Mas, em sistemas backend modernos, muitas equipes preferem unchecked para exceções de aplicação.

Nesta fase, entenda:

```text
extends Exception -> checked;
extends RuntimeException -> unchecked.
```

Exemplo:

```java
class MinhaCheckedException extends Exception {
}

class MinhaUncheckedException extends RuntimeException {
}
```

---

## Ordem dos catches

Quando há múltiplos `catch`, coloque do mais específico para o mais genérico.

Errado:

```java
try {
} catch (Exception erro) {
} catch (IllegalArgumentException erro) {
}
```

O segundo nunca seria alcançado.

Correto:

```java
try {
} catch (IllegalArgumentException erro) {
} catch (Exception erro) {
}
```

Arquivo:

```text
OrdemCatch.java
```

Código:

```java
public class OrdemCatch {
    public static void main(String[] args) {
        try {
            validar("");
        } catch (IllegalArgumentException erro) {
            System.out.println("Argumento inválido: " + erro.getMessage());
        } catch (Exception erro) {
            System.out.println("Erro genérico: " + erro.getMessage());
        }
    }

    public static void validar(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
    }
}
```

---

## Multi-catch

Quando tratamentos são iguais:

```java
catch (NumberFormatException | ArithmeticException erro)
```

Arquivo:

```text
MultiCatchExemplo.java
```

Código:

```java
public class MultiCatchExemplo {
    public static void main(String[] args) {
        try {
            int numero = Integer.parseInt("abc");

            System.out.println(10 / numero);
        } catch (NumberFormatException | ArithmeticException erro) {
            System.out.println("Erro numérico: " + erro.getMessage());
        }
    }
}
```

Use quando faz sentido tratar da mesma forma.

---

## Aplicação em cliente

Arquivo:

```text
ClienteException.java
```

Código:

```java
public class ClienteException {
    public static void main(String[] args) {
        try {
            Cliente cliente = criarCliente("", "ana@email.com");

            System.out.println(cliente);
        } catch (RegraNegocioException erro) {
            System.out.println("Falha ao criar cliente: " + erro.getMessage());
        }
    }

    public static Cliente criarCliente(String nome, String email) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome do cliente é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new RegraNegocioException("E-mail do cliente é obrigatório.");
        }

        return new Cliente(nome.trim(), email.trim().toLowerCase());
    }
}

record Cliente(String nome, String email) {
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

Aqui a exceção informa exatamente o campo inválido.

---

## Aplicação em produto

Arquivo:

```text
ProdutoException.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoException {
    public static void main(String[] args) {
        try {
            Produto produto = criarProduto("Cadeira", new BigDecimal("-10.00"));

            System.out.println(produto);
        } catch (RegraNegocioException erro) {
            System.out.println("Produto inválido: " + erro.getMessage());
        }
    }

    public static Produto criarProduto(String nome, BigDecimal preco) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome do produto é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RegraNegocioException("Preço do produto deve ser maior que zero.");
        }

        return new Produto(nome.trim(), preco);
    }
}

record Produto(String nome, BigDecimal preco) {
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoException.java
```

Código:

```java
public class PedidoException {
    public static void main(String[] args) {
        try {
            Pedido pedido = new Pedido("PED-001", StatusPedido.CANCELADO);

            pedido.aprovar();
        } catch (RegraNegocioException erro) {
            System.out.println("Pedido não aprovado: " + erro.getMessage());
        }
    }
}

class Pedido {
    private final String codigo;
    private StatusPedido status;

    Pedido(String codigo, StatusPedido status) {
        this.codigo = codigo;
        this.status = status;
    }

    public void aprovar() {
        if (status != StatusPedido.PENDENTE) {
            throw new RegraNegocioException(
                    "Pedido " + codigo + " só pode ser aprovado quando estiver PENDENTE. Status atual: " + status
            );
        }

        status = StatusPedido.APROVADO;
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    CANCELADO
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

Mensagem boa tem:

```text
código do pedido;
operação;
status esperado;
status atual.
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoException.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoException {
    public static void main(String[] args) {
        try {
            Pagamento pagamento = criarPagamento("PAG-001", BigDecimal.ZERO);

            System.out.println(pagamento);
        } catch (RegraNegocioException erro) {
            System.out.println("Pagamento inválido: " + erro.getMessage());
        }
    }

    public static Pagamento criarPagamento(String codigo, BigDecimal valor) {
        if (codigo == null || codigo.isBlank()) {
            throw new RegraNegocioException("Código do pagamento é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RegraNegocioException("Valor do pagamento deve ser maior que zero. Código: " + codigo);
        }

        return new Pagamento(codigo, valor);
    }
}

record Pagamento(String codigo, BigDecimal valor) {
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoException.java
```

Código:

```java
import java.time.LocalDate;

public class OrdemServicoException {
    public static void main(String[] args) {
        try {
            OrdemServico os = new OrdemServico("OS-001", StatusOs.CONCLUIDA);

            os.reagendar(LocalDate.of(2026, 7, 10));
        } catch (RegraNegocioException erro) {
            System.out.println("Falha no reagendamento: " + erro.getMessage());
        }
    }
}

class OrdemServico {
    private final String certificado;
    private StatusOs status;

    OrdemServico(String certificado, StatusOs status) {
        this.certificado = certificado;
        this.status = status;
    }

    public void reagendar(LocalDate novaData) {
        if (novaData == null) {
            throw new RegraNegocioException("Nova data é obrigatória para reagendar OS " + certificado + ".");
        }

        if (status != StatusOs.AGENDADA && status != StatusOs.REAGENDADA) {
            throw new RegraNegocioException(
                    "OS " + certificado + " não pode ser reagendada no status " + status + "."
            );
        }

        status = StatusOs.REAGENDADA;
    }
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

A mensagem permite entender a falha sem abrir o código.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaException.java
```

Código:

```java
public class MensageriaException {
    public static void main(String[] args) {
        try {
            Mensagem mensagem = criarMensagem("", "OS-001", TipoMensagem.ENTREGA);

            System.out.println(mensagem);
        } catch (RegraNegocioException erro) {
            System.out.println("Mensagem inválida: " + erro.getMessage());
        }
    }

    public static Mensagem criarMensagem(String cliente, String certificado, TipoMensagem tipo) {
        if (cliente == null || cliente.isBlank()) {
            throw new RegraNegocioException("Cliente é obrigatório para criar mensagem.");
        }

        if (certificado == null || certificado.isBlank()) {
            throw new RegraNegocioException("Certificado é obrigatório para criar mensagem do cliente " + cliente + ".");
        }

        if (tipo == null) {
            throw new RegraNegocioException("Tipo da mensagem é obrigatório.");
        }

        return new Mensagem(cliente.trim(), certificado.trim().toUpperCase(), tipo);
    }
}

record Mensagem(String cliente, String certificado, TipoMensagem tipo) {
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaException.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaException {
    public static void main(String[] args) {
        try {
            RegistroAuditoria registro = registrar("", "CRIACAO", "Produto", 10L);

            System.out.println(registro);
        } catch (RegraNegocioException erro) {
            System.out.println("Auditoria inválida: " + erro.getMessage());
        }
    }

    public static RegistroAuditoria registrar(String usuario, String operacao, String entidade, Long entidadeId) {
        if (usuario == null || usuario.isBlank()) {
            throw new RegraNegocioException("Usuário é obrigatório para auditoria.");
        }

        if (operacao == null || operacao.isBlank()) {
            throw new RegraNegocioException("Operação é obrigatória para auditoria.");
        }

        if (entidade == null || entidade.isBlank()) {
            throw new RegraNegocioException("Entidade é obrigatória para auditoria.");
        }

        if (entidadeId == null) {
            throw new RegraNegocioException("ID da entidade é obrigatório para auditoria de " + entidade + ".");
        }

        return new RegistroAuditoria(usuario, operacao, entidade, entidadeId, Instant.now());
    }
}

record RegistroAuditoria(String usuario, String operacao, String entidade, Long entidadeId, Instant criadoEm) {
}

class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
```

---

## Refatoração: if silencioso para exceção clara

Antes:

```java
if (nome == null || nome.isBlank()) {
    return null;
}
```

Problema:

```text
quem chamou pode não saber por que veio null;
erro aparece depois;
causa raiz fica escondida.
```

Depois:

```java
if (nome == null || nome.isBlank()) {
    throw new RegraNegocioException("Nome do cliente é obrigatório.");
}
```

Ganho:

```text
falha cedo;
mensagem clara;
diagnóstico melhor;
contrato explícito.
```

---

## Refatoração: catch genérico para catch específico

Antes:

```java
try {
    criarProduto(nome, preco);
} catch (Exception erro) {
    System.out.println("Erro.");
}
```

Depois:

```java
try {
    criarProduto(nome, preco);
} catch (RegraNegocioException erro) {
    System.out.println("Produto inválido: " + erro.getMessage());
}
```

Ganho:

```text
tratamento específico;
mensagem útil;
menos risco de esconder erro técnico.
```

---

## Refatoração: relançar preservando causa

Antes:

```java
try {
    integrar();
} catch (IOException erro) {
    throw new RuntimeException("Falha na integração.");
}
```

Depois:

```java
try {
    integrar();
} catch (IOException erro) {
    throw new RuntimeException("Falha na integração com serviço externo.", erro);
}
```

Ganho:

```text
mensagem de contexto;
causa original preservada;
stack trace útil.
```

---

## Quando lançar exception

Lance exception quando:

```text
o método não pode cumprir o contrato;
o argumento é inválido;
o estado não permite a operação;
a regra de negócio foi violada;
uma dependência externa falhou;
não há valor seguro para retornar;
continuar esconderia um problema;
falhar cedo ajuda o diagnóstico.
```

Exemplos:

```text
nome obrigatório ausente;
preço negativo;
pedido cancelado tentando aprovar;
OS concluída tentando reagendar;
pagamento com valor zero;
arquivo obrigatório inexistente.
```

---

## Quando capturar exception

Capture exception quando você pode:

```text
tratar de verdade;
converter para mensagem de usuário;
converter para resposta de API;
adicionar contexto;
registrar log adequado;
executar fallback real;
liberar recurso;
converter exception técnica em exception de domínio/aplicação.
```

Não capture quando:

```text
não sabe o que fazer;
só vai esconder;
vai retornar valor falso;
vai apagar a causa;
vai continuar em estado inconsistente.
```

---

## Quando propagar exception

Propague exception quando:

```text
a camada atual não sabe tratar;
uma camada superior deve decidir;
você quer manter stack trace;
não há fallback local;
o erro precisa abortar fluxo.
```

Em backend, é comum:

```text
repository lança erro técnico;
service adiciona contexto ou propaga;
controller/global handler converte para resposta HTTP.
```

Veremos isso com Spring Boot depois.

---

## Erros comuns

### Erro 1 — Engolir exceção

```java
catch (Exception erro) {
}
```

Muito ruim.

---

### Erro 2 — Mensagem genérica demais

```text
Erro.
```

Não ajuda.

---

### Erro 3 — Perder causa raiz

Relançar sem passar `erro` como causa.

---

### Erro 4 — Capturar Exception genérico sem necessidade

Pode esconder problemas diferentes.

---

### Erro 5 — Usar exception para fluxo normal simples

Exception não deve substituir `if` comum quando o fluxo esperado é normal.

---

### Erro 6 — Mostrar stack trace cru para usuário final

Usuário não precisa ver detalhe interno.

---

### Erro 7 — Não validar entrada cedo

Erro aparece longe da causa.

---

### Erro 8 — Criar exception própria para tudo

Nem toda situação precisa de classe nova.

---

### Erro 9 — Misturar regra de negócio com erro técnico sem contexto

Exemplo:

```text
SQLException aparecendo direto para regra de domínio.
```

---

### Erro 10 — Ignorar stack trace

Stack trace é mapa, não ruído.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugException {
    public static void main(String[] args) {
        criarCliente("");
    }

    public static void criarCliente(String nome) {
        validarNome(nome);

        System.out.println("Cliente criado.");
    }

    public static void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
    }
}
```

Coloque breakpoint em:

```java
throw new IllegalArgumentException("Nome é obrigatório.");
```

Observe:

```text
valor de nome;
pilha de chamadas;
linha que lança;
método que chamou;
mensagem da exception.
```

Depois execute sem breakpoint e leia o stack trace.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-085-exceptions-por-baixo
cd labs\m2\aula-085-exceptions-por-baixo
```

Crie arquivos:

```text
Main.java
StackTraceCamadas.java
NullPointerBasico.java
IllegalArgumentBasico.java
IllegalStateBasico.java
NumberFormatBasico.java
TryCatchBasico.java
GetMessageExemplo.java
PrintStackTraceExemplo.java
FinallyBasico.java
ThrowsBasico.java
PropagacaoException.java
CausaException.java
ExceptionPropria.java
OrdemCatch.java
MultiCatchExemplo.java
ClienteException.java
ProdutoException.java
PedidoException.java
PagamentoException.java
OrdemServicoException.java
MensageriaException.java
AuditoriaException.java
DebugException.java
ErroCatchVazio.java
ErroMensagemGenerica.java
ErroPerderCausaRaiz.java
ErroCatchGenerico.java
README.md
```

Compile:

```powershell
javac Main.java
javac StackTraceCamadas.java
javac NullPointerBasico.java
javac IllegalArgumentBasico.java
javac IllegalStateBasico.java
javac NumberFormatBasico.java
javac TryCatchBasico.java
javac GetMessageExemplo.java
javac PrintStackTraceExemplo.java
javac FinallyBasico.java
javac ThrowsBasico.java
javac PropagacaoException.java
javac CausaException.java
javac ExceptionPropria.java
javac OrdemCatch.java
javac MultiCatchExemplo.java
javac ClienteException.java
javac ProdutoException.java
javac PedidoException.java
javac PagamentoException.java
javac OrdemServicoException.java
javac MensageriaException.java
javac AuditoriaException.java
javac DebugException.java
javac ErroCatchVazio.java
javac ErroMensagemGenerica.java
javac ErroPerderCausaRaiz.java
javac ErroCatchGenerico.java
```

Execute exemplos:

```powershell
java Main
java StackTraceCamadas
java NullPointerBasico
java IllegalArgumentBasico
java IllegalStateBasico
java NumberFormatBasico
java TryCatchBasico
java GetMessageExemplo
java PrintStackTraceExemplo
java FinallyBasico
java ThrowsBasico
java PropagacaoException
java CausaException
java ExceptionPropria
java OrdemCatch
java MultiCatchExemplo
java ClienteException
java ProdutoException
java PedidoException
java PagamentoException
java OrdemServicoException
java MensageriaException
java AuditoriaException
java DebugException
```

Alguns exemplos devem quebrar de propósito.

O objetivo é ler o stack trace e explicar.

---

## Observações

- Não engolir exceções.
- Não perder causa raiz.
- Não usar mensagem genérica.
- Não capturar Exception sem necessidade.
- Ler stack trace como mapa de investigação.
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
git add labs/m2/aula-085-exceptions-por-baixo docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 085: pratica exceptions por baixo em Java"
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
explicar exception;
explicar Throwable;
diferenciar Error e Exception;
diferenciar checked e unchecked;
ler stack trace;
identificar tipo da exceção;
identificar mensagem da exceção;
identificar linha de origem;
identificar cadeia de chamadas;
identificar causa raiz;
usar throw;
usar throws;
usar try/catch;
usar finally;
usar getMessage;
usar printStackTrace em exemplo didático;
criar IllegalArgumentException;
criar IllegalStateException;
criar exception própria;
preservar causa ao relançar;
explicar catch vazio;
explicar catch genérico;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar exception;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar try-with-resources profundamente.

Não precisa ainda dominar logging profissional.

Não precisa ainda dominar ControllerAdvice.

Não precisa ainda dominar tratamento global em Spring.

Não precisa ainda dominar rollback transacional.

Não precisa ainda dominar hierarquia complexa de exceções.

Esses assuntos virão depois.

O objetivo é dominar a leitura, a causa raiz e o uso consciente de exceções.

---

## Fechamento da aula

Hoje estudamos exceptions por baixo.

A ideia central foi:

```text
exceção não é só erro; é informação estruturada para diagnóstico.
```

Vimos que:

```text
stack trace mostra a cadeia de chamadas;
checked exceptions são exigidas pelo compilador;
unchecked exceptions não são exigidas pelo compilador;
throw lança exceção;
throws declara exceção;
try/catch captura exceção;
finally executa limpeza;
mensagem boa ajuda a corrigir;
Caused by mostra causa raiz;
relançar sem causa atrapalha diagnóstico;
catch vazio é perigoso.
```

O ponto mais importante é:

```text
um backend profissional não apenas “trata erro”; ele preserva contexto, identifica causa raiz e falha de forma clara.
```

Na próxima aula, vamos estudar:

```text
Entrada/saída básica com console robusto.
```

A próxima aula vai explicar leitura segura, prompts claros, validação, repetição e como montar pequenos fluxos de console sem quebrar com qualquer entrada inválida.
