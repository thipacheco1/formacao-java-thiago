# 063 — M2.02 — Stack, Heap e Referências

## A pergunta central da aula

Quando escrevemos:

```java
public class Main {
    public static void main(String[] args) {
        int quantidade = 10;
        int[] valores = {10, 20, 30};

        alterarPrimeiro(valores);

        System.out.println(quantidade);
        System.out.println(valores[0]);
    }

    public static void alterarPrimeiro(int[] valores) {
        valores[0] = 99;
    }
}
```

o que acontece na memória?

Resposta conceitual:

```text
a chamada do main cria um frame na stack;
a variável quantidade fica como valor local nesse frame;
a variável valores guarda uma referência;
o array em si fica no heap;
ao chamar alterarPrimeiro, outro frame entra na stack;
o parâmetro valores recebe uma cópia da referência;
as duas referências apontam para o mesmo array no heap;
alterar valores[0] muda o objeto array;
ao terminar o método, o frame de alterarPrimeiro sai da stack;
o array continua no heap enquanto ainda for alcançável pelo main.
```

Essa explicação parece longa no início.

Depois ela vira natural.

---

## O que é stack

Stack, em português, pode ser entendida como pilha.

A stack guarda informações ligadas à execução dos métodos.

Quando um método é chamado, a JVM cria um espaço para aquela chamada.

Esse espaço é chamado de:

```text
stack frame.
```

Dentro desse frame ficam coisas como:

```text
variáveis locais;
parâmetros;
informações temporárias da execução;
ponto para onde voltar quando o método terminar.
```

Exemplo:

```java
public static void main(String[] args) {
    int quantidade = 10;
}
```

A variável local `quantidade` pertence ao frame do `main`.

Quando o `main` termina, esse frame sai da stack.

As variáveis locais dele deixam de existir.

---

## O que é stack frame

Stack frame é o bloco de execução de uma chamada de método.

Exemplo:

```java
public static void main(String[] args) {
    int resultado = somar(10, 20);
}

public static int somar(int a, int b) {
    return a + b;
}
```

Fluxo:

```text
1. JVM chama main.
2. Entra frame do main na stack.
3. main chama somar.
4. Entra frame de somar na stack.
5. somar recebe parâmetros a e b.
6. somar retorna 30.
7. frame de somar sai da stack.
8. main recebe resultado.
9. main termina.
10. frame de main sai da stack.
```

Visual:

```text
durante somar:

TOPO DA STACK
+----------------+
| somar          |
| a = 10         |
| b = 20         |
+----------------+
| main           |
| resultado ?    |
+----------------+
BASE DA STACK
```

Depois que `somar` termina:

```text
TOPO DA STACK
+----------------+
| main           |
| resultado = 30 |
+----------------+
BASE DA STACK
```

---

## O que é heap

Heap é uma área de memória usada para objetos.

Em Java, arrays são objetos.

`String` é objeto.

Objetos criados com `new` ficam no heap.

Exemplos:

```java
int[] valores = new int[]{10, 20, 30};
StringBuilder texto = new StringBuilder("Pedido");
```

O objeto em si fica no heap.

A variável local que aponta para ele fica no frame da stack.

Exemplo mental:

```text
stack:
valores -> referência 0xABC

heap:
0xABC -> array [10, 20, 30]
```

O endereço `0xABC` é apenas representação didática.

Em Java, você não manipula endereço real diretamente.

---

## O que é referência

Referência é um valor que permite acessar um objeto.

Exemplo:

```java
int[] valores = {10, 20, 30};
```

A variável `valores` não guarda os três números diretamente dentro da stack.

Ela guarda uma referência para o array.

O array está no heap.

A referência está na variável local.

Pense assim:

```text
valores não é o array;
valores aponta para o array.
```

Esse raciocínio é fundamental.

---

## Mapa mental inicial

### Primitivo

```java
int quantidade = 10;
```

Mapa:

```text
stack:
quantidade = 10

heap:
nada novo
```

### Array

```java
int[] valores = {10, 20, 30};
```

Mapa:

```text
stack:
valores -> referência para array

heap:
array [10, 20, 30]
```

### Objeto mutável

```java
StringBuilder texto = new StringBuilder("Pedido");
```

Mapa:

```text
stack:
texto -> referência para StringBuilder

heap:
StringBuilder com conteúdo "Pedido"
```

### Null

```java
String cliente = null;
```

Mapa:

```text
stack:
cliente = null

heap:
nenhum objeto apontado por cliente
```

---

## Stack não é melhor que heap

Stack e heap têm papéis diferentes.

Não pense assim:

```text
stack é bom;
heap é ruim.
```

Pense assim:

```text
stack organiza chamadas de métodos e variáveis locais;
heap guarda objetos que podem viver além de uma chamada específica.
```

Exemplo:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Esse método pode usar apenas stack.

Exemplo:

```java
public static int[] criarValores() {
    return new int[]{10, 20, 30};
}
```

Aqui o array precisa sobreviver ao método para ser retornado.

Então o objeto array fica no heap.

---

## Por que objetos ficam no heap

Objetos podem precisar sobreviver ao método que os criou.

Exemplo:

```java
public static int[] criarValores() {
    int[] valores = {10, 20, 30};

    return valores;
}
```

Quando `criarValores` termina, o frame do método sai da stack.

Mas o array retornado ainda precisa existir para quem chamou.

Por isso o array fica no heap.

Código:

```java
public class ObjetoSobreviveMetodo {
    public static void main(String[] args) {
        int[] valores = criarValores();

        System.out.println(valores[0]);
    }

    public static int[] criarValores() {
        int[] valores = {10, 20, 30};

        return valores;
    }
}
```

Saída:

```text
10
```

O frame de `criarValores` acabou.

Mas o array continua acessível pelo `main`.

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
        int quantidade = 10;

        exibirQuantidade(quantidade);

        System.out.println("Quantidade no main: " + quantidade);
    }

    public static void exibirQuantidade(int quantidade) {
        System.out.println("Quantidade no método: " + quantidade);
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
Quantidade no método: 10
Quantidade no main: 10
```

Mapa mental:

```text
main tem uma variável local quantidade;
exibirQuantidade tem outro parâmetro chamado quantidade;
são frames diferentes;
cada método tem seu próprio escopo na stack.
```

---

## Exemplo com alteração de primitivo

Arquivo:

```text
StackPrimitivo.java
```

Código:

```java
public class StackPrimitivo {
    public static void main(String[] args) {
        int quantidade = 10;

        alterarQuantidade(quantidade);

        System.out.println("Quantidade no main: " + quantidade);
    }

    public static void alterarQuantidade(int quantidade) {
        quantidade = 99;

        System.out.println("Quantidade no método: " + quantidade);
    }
}
```

Saída:

```text
Quantidade no método: 99
Quantidade no main: 10
```

Mapa:

```text
frame main:
quantidade = 10

frame alterarQuantidade:
quantidade = 10
depois quantidade = 99
```

O parâmetro é cópia do valor.

O `main` não muda.

---

## Exemplo com array no heap

Arquivo:

```text
HeapArray.java
```

Código:

```java
public class HeapArray {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        alterarPrimeiroValor(valores);

        System.out.println("Primeiro valor no main: " + valores[0]);
    }

    public static void alterarPrimeiroValor(int[] valores) {
        valores[0] = 99;

        System.out.println("Primeiro valor no método: " + valores[0]);
    }
}
```

Saída:

```text
Primeiro valor no método: 99
Primeiro valor no main: 99
```

Mapa mental:

```text
frame main:
valores -> referência para array A

heap:
array A [10, 20, 30]

frame alterarPrimeiroValor:
valores -> cópia da referência para array A

alteração:
array A [99, 20, 30]
```

As duas variáveis são diferentes.

Mas apontam para o mesmo array.

---

## Reatribuição de referência

Agora veja:

Arquivo:

```text
ReatribuicaoReferencia.java
```

Código:

```java
public class ReatribuicaoReferencia {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        trocarArray(valores);

        System.out.println("Primeiro valor no main: " + valores[0]);
    }

    public static void trocarArray(int[] valores) {
        valores = new int[]{99, 88, 77};

        System.out.println("Primeiro valor no método: " + valores[0]);
    }
}
```

Saída:

```text
Primeiro valor no método: 99
Primeiro valor no main: 10
```

Mapa mental:

```text
antes:
main.valores -> array A [10, 20, 30]
metodo.valores -> array A [10, 20, 30]

dentro do método:
metodo.valores -> array B [99, 88, 77]

main continua:
main.valores -> array A [10, 20, 30]
```

Reatribuir o parâmetro não muda a referência do chamador.

---

## Mutação versus reatribuição

Essa diferença precisa estar dominada.

### Mutação

```java
valores[0] = 99;
```

Significa:

```text
mudar o conteúdo do objeto apontado.
```

Se outro lugar aponta para o mesmo objeto, verá a mudança.

### Reatribuição

```java
valores = new int[]{99, 88, 77};
```

Significa:

```text
fazer a variável local apontar para outro objeto.
```

Isso não muda a variável original do chamador.

Resumo:

```text
mutação muda o objeto;
reatribuição muda a variável local.
```

---

## Null

`null` significa ausência de referência para objeto.

Exemplo:

```java
String cliente = null;
```

A variável existe.

Mas ela não aponta para nenhum objeto.

Mapa:

```text
stack:
cliente = null

heap:
nenhum objeto acessado por cliente
```

Se tentar usar:

```java
cliente.length()
```

ocorre:

```text
NullPointerException.
```

Porque você está tentando acessar método em algo que não aponta para objeto.

---

## Exemplo com null

Arquivo:

```text
ReferenciaNull.java
```

Código:

```java
public class ReferenciaNull {
    public static void main(String[] args) {
        String cliente = null;

        if (cliente == null) {
            System.out.println("Cliente não informado.");
        } else {
            System.out.println("Cliente: " + cliente);
        }
    }
}
```

Saída:

```text
Cliente não informado.
```

Esse é o padrão seguro:

```text
verificar null antes de usar.
```

---

## Exemplo de NullPointerException

Arquivo:

```text
ErroNullPointer.java
```

Código propositalmente errado:

```java
public class ErroNullPointer {
    public static void main(String[] args) {
        String cliente = null;

        System.out.println(cliente.length());
    }
}
```

Compile:

```powershell
javac ErroNullPointer.java
```

Execute:

```powershell
java ErroNullPointer
```

O código compila.

Mas quebra em execução.

Motivo:

```text
cliente não aponta para objeto;
não é possível chamar length.
```

Esse erro é um dos mais comuns em Java.

---

## Validando null com método

Arquivo:

```text
ValidacaoNull.java
```

Código:

```java
public class ValidacaoNull {
    public static void main(String[] args) {
        String cliente = null;

        if (textoPreenchido(cliente)) {
            System.out.println("Cliente: " + cliente);
        } else {
            System.out.println("Cliente inválido.");
        }
    }

    public static boolean textoPreenchido(String texto) {
        return texto != null && !texto.isBlank();
    }
}
```

Esse método evita:

```text
NullPointerException;
texto vazio;
texto em branco.
```

A ordem importa:

```java
texto != null && !texto.isBlank()
```

Se `texto` for `null`, a segunda parte não é avaliada por causa do `&&`.

---

## Curto-circuito com &&

Em Java, o operador `&&` tem curto-circuito.

Exemplo:

```java
texto != null && !texto.isBlank()
```

Se:

```java
texto != null
```

for `false`, Java não avalia:

```java
!texto.isBlank()
```

Isso evita `NullPointerException`.

Errado:

```java
!texto.isBlank() && texto != null
```

Se `texto` for `null`, a primeira parte já quebra.

Regra:

```text
verifique null antes de chamar método no objeto.
```

---

## String e heap

`String` é objeto.

Exemplo:

```java
String status = "APROVADO";
```

Conceitualmente, `status` guarda uma referência para um objeto `String`.

Mas `String` é imutável.

Isso significa:

```text
o conteúdo da String não muda.
```

Quando fazemos:

```java
status = status.toLowerCase();
```

não alteramos a String original.

Criamos/obtemos outra String e reatribuímos a variável.

Exemplo:

```java
public class StringImutavel {
    public static void main(String[] args) {
        String status = "APROVADO";

        String novoStatus = status.toLowerCase();

        System.out.println(status);
        System.out.println(novoStatus);
    }
}
```

Saída:

```text
APROVADO
aprovado
```

---

## String passada para método

Arquivo:

```text
StringParametro.java
```

Código:

```java
public class StringParametro {
    public static void main(String[] args) {
        String status = " aprovado ";

        normalizar(status);

        System.out.println("Status no main: " + status);
    }

    public static void normalizar(String status) {
        status = status.trim().toUpperCase();

        System.out.println("Status no método: " + status);
    }
}
```

Saída:

```text
Status no método: APROVADO
Status no main:  aprovado 
```

Motivo:

```text
o parâmetro recebeu cópia da referência;
a normalização gerou outra String;
o parâmetro passou a apontar para essa outra String;
a variável do main continuou apontando para a String original.
```

Correção:

```java
status = normalizar(status);
```

com retorno.

---

## String com retorno

Arquivo:

```text
StringComRetorno.java
```

Código:

```java
public class StringComRetorno {
    public static void main(String[] args) {
        String status = " aprovado ";

        status = normalizar(status);

        System.out.println("Status no main: " + status);
    }

    public static String normalizar(String status) {
        if (status == null) {
            return "";
        }

        return status.trim().toUpperCase();
    }
}
```

Saída:

```text
Status no main: APROVADO
```

Esse padrão será usado muitas vezes em backend:

```text
receber texto;
validar null;
normalizar;
retornar texto tratado.
```

---

## Objeto mutável com StringBuilder

Ainda não estamos estudando orientação a objetos profundamente.

Mas `StringBuilder` ajuda a demonstrar objeto mutável.

Arquivo:

```text
ObjetoMutavel.java
```

Código:

```java
public class ObjetoMutavel {
    public static void main(String[] args) {
        StringBuilder mensagem = new StringBuilder("Pedido");

        alterarMensagem(mensagem);

        System.out.println("Mensagem no main: " + mensagem);
    }

    public static void alterarMensagem(StringBuilder mensagem) {
        mensagem.append(" aprovado");

        System.out.println("Mensagem no método: " + mensagem);
    }
}
```

Saída:

```text
Mensagem no método: Pedido aprovado
Mensagem no main: Pedido aprovado
```

Aqui o conteúdo do objeto foi alterado.

O `main` vê a alteração porque aponta para o mesmo objeto.

---

## Reatribuição de objeto mutável

Arquivo:

```text
ReatribuirObjetoMutavel.java
```

Código:

```java
public class ReatribuirObjetoMutavel {
    public static void main(String[] args) {
        StringBuilder mensagem = new StringBuilder("Pedido");

        trocarMensagem(mensagem);

        System.out.println("Mensagem no main: " + mensagem);
    }

    public static void trocarMensagem(StringBuilder mensagem) {
        mensagem = new StringBuilder("Outro pedido");

        System.out.println("Mensagem no método: " + mensagem);
    }
}
```

Saída:

```text
Mensagem no método: Outro pedido
Mensagem no main: Pedido
```

De novo:

```text
reatribuir parâmetro não muda variável do chamador.
```

---

## Criando uma classe simples para visualizar objeto no heap

Agora vamos criar uma classe simples.

Não é uma aula completa de orientação a objetos ainda.

Use apenas para visualizar referência e objeto.

Arquivo:

```text
ClienteMemoria.java
```

Código:

```java
public class ClienteMemoria {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente.status = "ATIVO";

        exibirCliente(cliente);
        alterarStatus(cliente);

        exibirCliente(cliente);
    }

    public static void exibirCliente(Cliente cliente) {
        System.out.println("Cliente: " + cliente.nome);
        System.out.println("Status: " + cliente.status);
        System.out.println("--------------------");
    }

    public static void alterarStatus(Cliente cliente) {
        cliente.status = "INATIVO";
    }
}

class Cliente {
    String nome;
    String status;
}
```

Saída:

```text
Cliente: Ana
Status: ATIVO
--------------------
Cliente: Ana
Status: INATIVO
--------------------
```

Mapa mental:

```text
main.cliente -> objeto Cliente no heap
alterarStatus.cliente -> mesma referência copiada
cliente.status = "INATIVO" altera o objeto
```

Esse é o comportamento básico de objeto mutável.

---

## Reatribuir objeto Cliente

Arquivo:

```text
ClienteReatribuicao.java
```

Código:

```java
public class ClienteReatribuicao {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente.status = "ATIVO";

        trocarCliente(cliente);

        System.out.println("Cliente no main: " + cliente.nome + " - " + cliente.status);
    }

    public static void trocarCliente(Cliente cliente) {
        cliente = new Cliente();

        cliente.nome = "Bruno";
        cliente.status = "INATIVO";

        System.out.println("Cliente no método: " + cliente.nome + " - " + cliente.status);
    }
}

class Cliente {
    String nome;
    String status;
}
```

Saída:

```text
Cliente no método: Bruno - INATIVO
Cliente no main: Ana - ATIVO
```

A reatribuição do parâmetro não trocou o objeto apontado pela variável do `main`.

---

## Ciclo de vida de variáveis locais

Variáveis locais vivem enquanto o método ou bloco está em execução.

Exemplo:

```java
public static void processar() {
    int quantidade = 10;
}
```

Quando `processar` termina, o frame sai da stack.

A variável `quantidade` deixa de existir.

Se houver uma referência local para objeto:

```java
public static void processar() {
    Cliente cliente = new Cliente();
}
```

Quando o método termina:

```text
a variável local cliente deixa de existir;
se ninguém mais aponta para o objeto Cliente, ele se torna elegível para coleta de lixo.
```

A coleta de lixo será a próxima aula.

Nesta aula, guarde:

```text
variável local acaba com o frame;
objeto no heap pode continuar se ainda houver referência alcançável.
```

---

## Objeto retornado por método continua acessível

Arquivo:

```text
ObjetoRetornado.java
```

Código:

```java
public class ObjetoRetornado {
    public static void main(String[] args) {
        Cliente cliente = criarCliente();

        System.out.println(cliente.nome);
    }

    public static Cliente criarCliente() {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";

        return cliente;
    }
}

class Cliente {
    String nome;
}
```

O frame de `criarCliente` termina.

Mas o objeto criado continua acessível porque foi retornado e guardado no `main`.

Mapa:

```text
criarCliente cria objeto no heap;
retorna referência;
main guarda referência;
objeto continua alcançável.
```

---

## Objeto perdido

Arquivo:

```text
ObjetoPerdido.java
```

Código:

```java
public class ObjetoPerdido {
    public static void main(String[] args) {
        criarCliente();

        System.out.println("Cliente criado, mas referência não foi guardada.");
    }

    public static void criarCliente() {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
    }
}

class Cliente {
    String nome;
}
```

Aqui o objeto `Cliente` é criado.

Mas, quando o método termina, ninguém mais tem referência para ele.

Ele se torna elegível para coleta de lixo.

Não significa que será removido imediatamente.

Significa que a JVM pode removê-lo futuramente.

A próxima aula vai aprofundar isso.

---

## Referências compartilhadas

Duas variáveis podem apontar para o mesmo objeto.

Arquivo:

```text
ReferenciasCompartilhadas.java
```

Código:

```java
public class ReferenciasCompartilhadas {
    public static void main(String[] args) {
        Cliente primeiro = new Cliente();

        primeiro.nome = "Ana";

        Cliente segundo = primeiro;

        segundo.nome = "Bruno";

        System.out.println("Primeiro: " + primeiro.nome);
        System.out.println("Segundo: " + segundo.nome);
    }
}

class Cliente {
    String nome;
}
```

Saída:

```text
Primeiro: Bruno
Segundo: Bruno
```

Por quê?

Porque `primeiro` e `segundo` apontam para o mesmo objeto.

Não existem dois clientes.

Existe um objeto `Cliente` no heap e duas referências para ele.

---

## Cópia real versus cópia de referência

Este código não cria um novo objeto:

```java
Cliente segundo = primeiro;
```

Ele copia a referência.

Agora há duas variáveis apontando para o mesmo objeto.

Para criar outro objeto, seria necessário:

```java
Cliente segundo = new Cliente();
segundo.nome = primeiro.nome;
```

Mesmo assim, isso é uma cópia manual simples.

Mais à frente estudaremos cópia de objetos com mais profundidade.

Por enquanto:

```text
atribuir uma referência em outra variável não clona o objeto.
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoMemoria.java
```

Código:

```java
public class PedidoMemoria {
    public static void main(String[] args) {
        Pedido pedido = new Pedido();

        pedido.cliente = "Ana";
        pedido.valorCentavos = 1000L;
        pedido.status = "PENDENTE";

        aprovarPedido(pedido);

        System.out.println("Status no main: " + pedido.status);
    }

    public static void aprovarPedido(Pedido pedido) {
        pedido.status = "APROVADO";
    }
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}
```

Saída:

```text
Status no main: APROVADO
```

O objeto `Pedido` foi alterado por referência compartilhada.

---

## Aplicação em produto

Arquivo:

```text
ProdutoMemoria.java
```

Código:

```java
public class ProdutoMemoria {
    public static void main(String[] args) {
        Produto produto = new Produto();

        produto.nome = "Cadeira";
        produto.estoque = 10;

        baixarEstoque(produto, 3);

        System.out.println("Estoque no main: " + produto.estoque);
    }

    public static void baixarEstoque(Produto produto, int quantidade) {
        produto.estoque = produto.estoque - quantidade;
    }
}

class Produto {
    String nome;
    int estoque;
}
```

Saída:

```text
Estoque no main: 7
```

Aqui o método alterou estado do objeto.

Isso pode ser correto se a responsabilidade estiver clara.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoMemoria.java
```

Código:

```java
public class PagamentoMemoria {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento();

        pagamento.valorCentavos = 10000L;
        pagamento.parcelas = 4;

        calcularParcela(pagamento);

        System.out.println("Valor da parcela: " + pagamento.valorParcelaCentavos);
    }

    public static void calcularParcela(Pagamento pagamento) {
        if (pagamento.parcelas <= 0) {
            pagamento.valorParcelaCentavos = 0L;
            return;
        }

        pagamento.valorParcelaCentavos = pagamento.valorCentavos / pagamento.parcelas;
    }
}

class Pagamento {
    long valorCentavos;
    int parcelas;
    long valorParcelaCentavos;
}
```

Esse exemplo mostra mutação do objeto `Pagamento`.

No futuro, veremos formas mais limpas com encapsulamento.

Nesta fase, é apenas para entender memória e referência.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoMemoria.java
```

Código:

```java
public class OrdemServicoMemoria {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico();

        os.certificado = "OS-001";
        os.status = "ABERTA";
        os.atividadesPendentes = 0;

        concluirSePossivel(os);

        System.out.println("Status da OS: " + os.status);
    }

    public static void concluirSePossivel(OrdemServico os) {
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

Saída:

```text
Status da OS: CONCLUIDA
```

O método alterou o objeto recebido.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaMemoria.java
```

Código:

```java
public class MensageriaMemoria {
    public static void main(String[] args) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = "Ana";
        mensagem.tipo = "ENTREGA";
        mensagem.tentativas = 0;

        incrementarTentativa(mensagem);
        incrementarTentativa(mensagem);

        System.out.println("Tentativas: " + mensagem.tentativas);
    }

    public static void incrementarTentativa(Mensagem mensagem) {
        mensagem.tentativas++;
    }
}

class Mensagem {
    String cliente;
    String tipo;
    int tentativas;
}
```

Saída:

```text
Tentativas: 2
```

Esse exemplo mostra objeto de mensageria mutável.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaMemoria.java
```

Código:

```java
public class AuditoriaMemoria {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "CRIACAO");

        marcarSucesso(registro);

        System.out.println(registro.usuario + " | " + registro.operacao + " | " + registro.status);
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.status = "PENDENTE";

        return registro;
    }

    public static void marcarSucesso(RegistroAuditoria registro) {
        registro.status = "SUCESSO";
    }
}

class RegistroAuditoria {
    String usuario;
    String operacao;
    String status;
}
```

Esse exemplo mostra:

```text
objeto criado em método;
referência retornada;
objeto alterado depois;
dados disponíveis no main.
```

---

## Refatoração e leitura crítica

Veja este código:

```java
public static void processar(Pedido pedido) {
    pedido.status = "APROVADO";
    System.out.println(pedido.status);
}
```

Ele altera e exibe.

Pode ser aceitável em exemplo pequeno.

Mas profissionalmente podemos separar:

```java
public static void aprovarPedido(Pedido pedido) {
    pedido.status = "APROVADO";
}

public static void exibirPedido(Pedido pedido) {
    System.out.println(pedido.status);
}
```

Por quê?

```text
um método altera;
outro exibe.
```

Isso melhora debug, teste e leitura.

Mesmo nesta fase, o raciocínio de responsabilidade continua valendo.

---

## Quando usar mutação

Mutação é alterar o estado de um objeto existente.

Pode fazer sentido quando:

```text
a regra é realmente alterar aquele objeto;
o nome do método comunica alteração;
o chamador espera a mudança;
o objeto representa um estado que evolui;
a alteração é validada.
```

Exemplos:

```java
aprovarPedido(pedido)
baixarEstoque(produto, quantidade)
incrementarTentativa(mensagem)
concluirSePossivel(os)
marcarSucesso(registro)
```

Nomes indicam ação.

---

## Quando preferir retorno

Prefira retorno quando:

```text
quer transformar um valor sem alterar o original;
quer calcular algo;
quer validar algo;
quer criar um novo objeto;
quer evitar efeito colateral.
```

Exemplos:

```java
String normalizado = normalizarStatus(status);
long parcela = calcularParcela(valor, parcelas);
boolean valido = statusValido(status);
Cliente cliente = criarCliente();
```

A decisão entre mutação e retorno é um começo de design.

No futuro, isso aparecerá em serviços, entidades, DTOs, mappers e validações.

---

## Erros comuns

### Erro 1 — Achar que variável de referência é o objeto

A variável guarda uma referência.

O objeto está no heap.

---

### Erro 2 — Achar que `Cliente segundo = primeiro` clona o objeto

Isso copia a referência.

Os dois apontam para o mesmo objeto.

---

### Erro 3 — Achar que reatribuir parâmetro troca objeto do chamador

Não troca.

Reatribuição muda apenas o parâmetro local.

---

### Erro 4 — Alterar objeto sem perceber efeito colateral

Se método altera objeto recebido, isso aparece para quem também aponta para ele.

---

### Erro 5 — Chamar método em referência null

Exemplo:

```java
cliente.length()
```

quando `cliente == null`.

---

### Erro 6 — Verificar null depois de chamar método

Errado:

```java
!texto.isBlank() && texto != null
```

Certo:

```java
texto != null && !texto.isBlank()
```

---

### Erro 7 — Criar objeto e perder referência

Se ninguém guarda a referência, o objeto fica inacessível após o método terminar.

---

### Erro 8 — Usar mutação quando retorno seria mais claro

Exemplo:

```java
normalizar(status)
```

tentando alterar String.

Para String, use retorno.

---

### Erro 9 — Não saber se método altera ou calcula

Nome do método deve ajudar.

```java
calcularTotal
```

não deveria alterar objeto.

```java
baixarEstoque
```

pode alterar.

---

### Erro 10 — Confundir ciclo de vida da variável local com ciclo de vida do objeto

Variável local acaba com o frame.

Objeto no heap pode continuar se ainda houver referência alcançável.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugStackHeap {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente.status = "ATIVO";

        alterarStatus(cliente);

        System.out.println(cliente.status);
    }

    public static void alterarStatus(Cliente cliente) {
        cliente.status = "INATIVO";
    }
}

class Cliente {
    String nome;
    String status;
}
```

Coloque breakpoint em:

```java
alterarStatus(cliente);
```

Use Step Into.

Observe:

```text
no main, cliente aponta para um objeto;
no método, parâmetro cliente aponta para o mesmo objeto;
alterar cliente.status muda o objeto;
ao voltar, main vê status INATIVO.
```

Depois teste reatribuição:

```java
cliente = new Cliente();
cliente.status = "OUTRO";
```

dentro do método.

Observe que o `main` não troca de objeto.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-063-stack-heap-referencias
cd labs\m2\aula-063-stack-heap-referencias
```

Crie arquivos:

```text
Main.java
StackPrimitivo.java
HeapArray.java
ReatribuicaoReferencia.java
ReferenciaNull.java
ErroNullPointer.java
ValidacaoNull.java
StringImutavel.java
StringParametro.java
StringComRetorno.java
ObjetoMutavel.java
ReatribuirObjetoMutavel.java
ClienteMemoria.java
ClienteReatribuicao.java
ObjetoRetornado.java
ObjetoPerdido.java
ReferenciasCompartilhadas.java
PedidoMemoria.java
ProdutoMemoria.java
PagamentoMemoria.java
OrdemServicoMemoria.java
MensageriaMemoria.java
AuditoriaMemoria.java
DebugStackHeap.java
ErroReferenciaNaoClona.java
ErroReatribuirParametro.java
ErroNullSemValidacao.java
ErroStringSemRetorno.java
README.md
```

Compile:

```powershell
javac Main.java
javac StackPrimitivo.java
javac HeapArray.java
javac ReatribuicaoReferencia.java
javac ReferenciaNull.java
javac ErroNullPointer.java
javac ValidacaoNull.java
javac StringImutavel.java
javac StringParametro.java
javac StringComRetorno.java
javac ObjetoMutavel.java
javac ReatribuirObjetoMutavel.java
javac ClienteMemoria.java
javac ClienteReatribuicao.java
javac ObjetoRetornado.java
javac ObjetoPerdido.java
javac ReferenciasCompartilhadas.java
javac PedidoMemoria.java
javac ProdutoMemoria.java
javac PagamentoMemoria.java
javac OrdemServicoMemoria.java
javac MensageriaMemoria.java
javac AuditoriaMemoria.java
javac DebugStackHeap.java
javac ErroReferenciaNaoClona.java
javac ErroReatribuirParametro.java
javac ErroNullSemValidacao.java
javac ErroStringSemRetorno.java
```

Execute:

```powershell
java Main
java StackPrimitivo
java HeapArray
java ReatribuicaoReferencia
java ReferenciaNull
java ErroNullPointer
java ValidacaoNull
java StringImutavel
java StringParametro
java StringComRetorno
java ObjetoMutavel
java ReatribuirObjetoMutavel
java ClienteMemoria
java ClienteReatribuicao
java ObjetoRetornado
java ObjetoPerdido
java ReferenciasCompartilhadas
java PedidoMemoria
java ProdutoMemoria
java PagamentoMemoria
java OrdemServicoMemoria
java MensageriaMemoria
java AuditoriaMemoria
java DebugStackHeap
java ErroReferenciaNaoClona
java ErroReatribuirParametro
java ErroNullSemValidacao
java ErroStringSemRetorno
```

Alguns arquivos de erro proposital devem quebrar em execução ou demonstrar comportamento inesperado.

Use para diagnóstico.

---

## Observações

- Mutação altera o objeto.
- Reatribuição altera a variável local.
- Retorno deve ser usado quando queremos devolver novo valor.
- Nome do método deve deixar claro se ele altera estado.
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
git add labs/m2/aula-063-stack-heap-referencias docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 063: pratica stack heap e referencias em Java"
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
explicar stack;
explicar heap;
explicar stack frame;
explicar variável local;
explicar parâmetro;
explicar primitivo;
explicar referência;
explicar objeto no heap;
explicar array como objeto;
explicar String como objeto imutável;
explicar StringBuilder como objeto mutável;
explicar null;
provocar NullPointerException;
corrigir NullPointerException com validação;
explicar curto-circuito com &&;
diferenciar mutação de reatribuição;
explicar referência compartilhada;
explicar por que atribuição não clona objeto;
explicar por que reatribuir parâmetro não altera chamador;
explicar por que alterar campo do objeto aparece fora;
criar exemplo com Cliente;
criar exemplo com Pedido;
criar exemplo com Produto;
criar exemplo com Pagamento;
criar exemplo com OS;
criar exemplo com Mensagem;
criar exemplo com Auditoria;
usar debug para observar referência e campo;
identificar efeito colateral;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar Garbage Collector profundamente.

Não precisa ainda dominar gerações de heap.

Não precisa ainda dominar stack overflow.

Não precisa ainda dominar escape analysis.

Não precisa ainda dominar weak references.

Não precisa ainda dominar objetos imutáveis profissionais.

Esses assuntos virão depois.

O objetivo é dominar o modelo mental inicial de stack, heap e referências.

---

## Fechamento da aula

Hoje estudamos stack, heap e referências.

A ideia central foi:

```text
variáveis locais e parâmetros vivem nos frames da stack;
objetos e arrays vivem no heap;
variáveis de referência apontam para objetos no heap.
```

Vimos que:

```text
primitivos carregam valores;
referências apontam para objetos;
arrays são objetos;
String é objeto imutável;
StringBuilder é objeto mutável;
null é ausência de referência;
chamar método em null causa NullPointerException;
mutação altera o objeto;
reatribuição altera apenas a variável local;
duas referências podem apontar para o mesmo objeto.
```

O ponto mais importante é:

```text
referência não é objeto; referência aponta para objeto.
```

Na próxima aula, vamos estudar:

```text
Garbage Collector conceitual.
```

A próxima aula vai explicar o que acontece com objetos que não são mais alcançáveis, por que Java tem coleta de lixo, quais problemas ela resolve e quais cuidados ainda continuam sendo responsabilidade do desenvolvedor.
