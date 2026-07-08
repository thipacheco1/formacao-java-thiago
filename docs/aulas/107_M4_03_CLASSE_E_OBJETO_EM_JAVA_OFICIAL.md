# 107 — M4.03 — Classe e objeto em Java

## Objetivo da aula

Nesta aula você vai aprender, na prática, como classe e objeto aparecem em Java.

Na aula anterior, você aprendeu a modelar no papel antes de codar. Agora vamos transformar essa modelagem em código usando:

```text
class;
new;
instância;
atributos;
métodos;
construtor;
this.
```

Ao final da aula, você deve conseguir explicar e codar:

```text
o que é uma classe;
o que é um objeto;
como criar um objeto com new;
o que são atributos;
o que são métodos;
para que serve o construtor;
para que serve o this;
como criar mais de um objeto da mesma classe;
como cada objeto mantém seu próprio estado.
```

Essa é uma das aulas mais importantes da base de Orientação a Objetos.

---

## A ideia central

Uma classe é um molde.

Um objeto é uma instância criada a partir desse molde.

Pense em uma classe chamada `Cliente`.

A classe define que todo cliente terá, por exemplo:

```text
nome;
email;
telefone;
status ativo/inativo;
comportamentos relacionados a cliente.
```

Mas a classe não é um cliente específico.

Quando você usa `new`, você cria um objeto real em memória:

```java
Cliente clienteAna = new Cliente("Ana", "ana@email.com", "11999999999", true);
Cliente clienteCarlos = new Cliente("Carlos", "carlos@email.com", "", false);
```

Agora existem dois objetos.

Ambos são do tipo `Cliente`, mas cada um possui seu próprio estado.

---

## Comparando com o que já sabemos

Antes de Orientação a Objetos, poderíamos escrever assim:

```java
String nome = "Ana";
String email = "ana@email.com";
String telefone = "11999999999";
boolean ativo = true;
```

Funciona, mas os dados ficam soltos.

Com uma classe, esses dados passam a ficar agrupados em um conceito:

```java
Cliente cliente = new Cliente("Ana", "ana@email.com", "11999999999", true);
```

Agora o código comunica melhor:

```text
esses dados representam um cliente.
```

Esse é o primeiro ganho da Orientação a Objetos: criar conceitos mais claros no código.

---

## Primeiro exemplo completo

Crie a pasta:

```powershell
mkdir labs\m4\aula-107-classe-e-objeto-em-java
cd labs\m4\aula-107-classe-e-objeto-em-java
```

Crie o arquivo:

```text
ClientePrimeiroObjeto.java
```

Código:

```java
public class ClientePrimeiroObjeto {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Ana Silva",
                "ana@email.com",
                "11999999999",
                true
        );

        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
        System.out.println("Ativo: " + cliente.ativo());
        System.out.println("Contato completo: " + cliente.contatoCompleto());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
    }
}

class Cliente {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    Cliente(String nome, String email, String telefone, boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    String nome() {
        return nome;
    }

    String email() {
        return email;
    }

    String telefone() {
        return telefone;
    }

    boolean ativo() {
        return ativo;
    }

    boolean contatoCompleto() {
        return textoInformado(email) && textoInformado(telefone);
    }

    boolean podeReceberMensagem() {
        return ativo && textoInformado(telefone);
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac ClientePrimeiroObjeto.java
java ClientePrimeiroObjeto
```

---

## Entendendo o código

Neste trecho:

```java
class Cliente {
```

criamos uma classe chamada `Cliente`.

Ela é o molde.

Neste trecho:

```java
Cliente cliente = new Cliente(
        "Ana Silva",
        "ana@email.com",
        "11999999999",
        true
);
```

criamos um objeto do tipo `Cliente`.

A palavra `new` significa:

```text
crie uma nova instância dessa classe.
```

A variável `cliente` guarda uma referência para esse objeto.

---

## Atributos

Atributos são dados internos do objeto.

Na classe `Cliente`, os atributos são:

```java
private final String nome;
private final String email;
private final String telefone;
private final boolean ativo;
```

Eles representam o estado do cliente.

O estado desse cliente específico é:

```text
nome = Ana Silva;
email = ana@email.com;
telefone = 11999999999;
ativo = true.
```

Se criarmos outro cliente, ele terá outro estado.

---

## Métodos

Métodos são comportamentos.

Na classe `Cliente`, estes métodos expõem dados:

```java
String nome()
String email()
String telefone()
boolean ativo()
```

E estes métodos respondem perguntas sobre o cliente:

```java
boolean contatoCompleto()
boolean podeReceberMensagem()
```

Isso é importante.

Um objeto não precisa ser apenas um pacote de dados. Ele pode ter comportamento relacionado aos próprios dados.

Exemplo:

```java
boolean podeReceberMensagem() {
    return ativo && textoInformado(telefone);
}
```

Esse comportamento pertence naturalmente ao cliente.

---

## Construtor

O construtor é usado para criar o objeto com seus dados iniciais.

Neste exemplo:

```java
Cliente(String nome, String email, String telefone, boolean ativo) {
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.ativo = ativo;
}
```

Quando você faz:

```java
new Cliente("Ana Silva", "ana@email.com", "11999999999", true);
```

o Java chama o construtor.

Os valores enviados entram nos parâmetros:

```text
nome;
email;
telefone;
ativo.
```

Depois são guardados nos atributos do objeto.

---

## Para que serve o this

Dentro do construtor, temos:

```java
this.nome = nome;
```

O lado esquerdo:

```java
this.nome
```

significa:

```text
o atributo nome deste objeto.
```

O lado direito:

```java
nome
```

significa:

```text
o parâmetro nome recebido pelo construtor.
```

Sem o `this`, ficaria ambíguo.

O `this` aponta para o objeto atual.

Pense assim:

```text
this = este objeto aqui.
```

Quando criamos `clienteAna`, o `this` dentro do objeto Ana aponta para Ana.

Quando criamos `clienteCarlos`, o `this` dentro do objeto Carlos aponta para Carlos.

---

## Dois objetos da mesma classe

Crie o arquivo:

```text
DoisClientes.java
```

Código:

```java
public class DoisClientes {
    public static void main(String[] args) {
        Cliente clienteAna = new Cliente(
                "Ana Silva",
                "ana@email.com",
                "11999999999",
                true
        );

        Cliente clienteCarlos = new Cliente(
                "Carlos Souza",
                "carlos@email.com",
                "",
                true
        );

        imprimirCliente(clienteAna);
        imprimirCliente(clienteCarlos);
    }

    public static void imprimirCliente(Cliente cliente) {
        System.out.println("Nome: " + cliente.nome());
        System.out.println("Contato completo: " + cliente.contatoCompleto());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
        System.out.println("------------------------------------");
    }
}

class Cliente {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    Cliente(String nome, String email, String telefone, boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    String nome() {
        return nome;
    }

    boolean contatoCompleto() {
        return textoInformado(email) && textoInformado(telefone);
    }

    boolean podeReceberMensagem() {
        return ativo && textoInformado(telefone);
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac DoisClientes.java
java DoisClientes
```

Observe:

```text
clienteAna e clienteCarlos foram criados pela mesma classe;
cada objeto tem seu próprio estado;
o método contatoCompleto usa os dados do objeto atual;
o método podeReceberMensagem também usa os dados do objeto atual.
```

Essa é uma das ideias mais importantes de OO.

---

## Objeto com regra de negócio

Agora vamos voltar para o exemplo de OS.

Crie:

```text
OrdemServicoObjeto.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoObjeto {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana Silva",
                StatusOs.ABERTA,
                LocalDate.now().minusDays(6),
                1
        );

        LocalDate hoje = LocalDate.now();

        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Fila: " + os.filaSugerida(hoje));
    }
}

enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

enum FilaAtendimento {
    ENTRADA,
    REAGENDAMENTO,
    CASOS_CRITICOS,
    SEM_FILA
}

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServico(
            String certificado,
            String cliente,
            StatusOs status,
            LocalDate dataAbertura,
            int quantidadeReagendamentos
    ) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.quantidadeReagendamentos = quantidadeReagendamentos;
    }

    String certificado() {
        return certificado;
    }

    String cliente() {
        return cliente;
    }

    StatusOs status() {
        return status;
    }

    long diasEmAberto(LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);

        if (dias < 0) {
            return 0;
        }

        return dias;
    }

    boolean atrasada(LocalDate dataReferencia) {
        return diasEmAberto(dataReferencia) > 3;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean precisaReagendamento() {
        return quantidadeReagendamentos >= 2;
    }

    FilaAtendimento filaSugerida(LocalDate dataReferencia) {
        if (encerrada()) {
            return FilaAtendimento.SEM_FILA;
        }

        if (atrasada(dataReferencia)) {
            return FilaAtendimento.CASOS_CRITICOS;
        }

        if (precisaReagendamento()) {
            return FilaAtendimento.REAGENDAMENTO;
        }

        return FilaAtendimento.ENTRADA;
    }
}
```

Esse exemplo reforça o que começamos na aula anterior.

A OS tem estado:

```text
certificado;
cliente;
status;
dataAbertura;
quantidadeReagendamentos.
```

E tem comportamento:

```text
diasEmAberto;
atrasada;
encerrada;
precisaReagendamento;
filaSugerida.
```

A regra ficou perto do conceito que ela representa.

---

## Classe não precisa ser pública sempre

Nos exemplos, temos um arquivo com uma classe pública principal:

```java
public class OrdemServicoObjeto
```

E outras classes no mesmo arquivo:

```java
class OrdemServico
```

Neste momento, estamos usando isso para simplificar os exercícios.

Em Java, normalmente cada classe pública fica em seu próprio arquivo com o mesmo nome.

Mais adiante vamos organizar melhor:

```text
OrdemServico.java
StatusOs.java
FilaAtendimento.java
```

Por enquanto, manter tudo em um arquivo facilita o estudo e a execução.

---

## Diferença entre atributo e variável local

Atributo pertence ao objeto:

```java
private final String nome;
```

Ele existe enquanto o objeto existir.

Variável local pertence a um método:

```java
LocalDate hoje = LocalDate.now();
```

Ela existe enquanto aquele método está executando.

Exemplo:

```java
class Cliente {
    private final String nome;

    Cliente(String nome) {
        this.nome = nome;
    }

    String nomeMaiusculo() {
        String convertido = nome.toUpperCase();
        return convertido;
    }
}
```

Aqui:

```text
nome é atributo;
convertido é variável local.
```

O atributo representa estado do objeto.

A variável local ajuda em um cálculo temporário.

---

## Diferença entre método do objeto e método estático

Até agora usamos muitos métodos assim:

```java
public static void imprimirMenu()
```

Método `static` pertence à classe e pode ser chamado sem criar objeto.

Em OO, começamos a usar métodos de objeto:

```java
cliente.podeReceberMensagem()
os.filaSugerida(hoje)
pedido.totalFinal()
```

Esses métodos dependem do estado daquele objeto.

Regra simples para esta fase:

```text
se o método usa dados de um objeto específico, provavelmente não deve ser static.
```

Exemplo:

```java
boolean podeReceberMensagem() {
    return ativo && textoInformado(telefone);
}
```

Esse método usa `ativo` e `telefone` daquele cliente.

Faz sentido ser método do objeto.

---

## Exemplo com Pedido

Crie:

```text
PedidoObjeto.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoObjeto {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Válido: " + pedido.valido());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() {
        return cliente;
    }

    String produto() {
        return produto;
    }

    boolean valido() {
        return textoInformado(cliente)
                && textoInformado(produto)
                && precoUnitario != null
                && precoUnitario.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0;
    }

    BigDecimal totalBruto() {
        if (!valido()) {
            return BigDecimal.ZERO;
        }

        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        BigDecimal totalBruto = totalBruto();

        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto.multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Esse exemplo mostra o mesmo padrão:

```text
Pedido tem estado;
Pedido tem comportamento;
Pedido calcula informações com base no próprio estado.
```

---

## O papel do encapsulamento

Observe que os atributos estão privados:

```java
private final String cliente;
```

Isso significa que outras partes do código não acessam diretamente o atributo.

Elas usam métodos:

```java
pedido.cliente()
pedido.totalFinal()
```

Essa ideia é chamada de encapsulamento.

Por enquanto, entenda encapsulamento como:

```text
proteger o estado interno do objeto e controlar como ele é acessado.
```

Ainda vamos aprofundar muito isso.

Mas já estamos começando certo ao não deixar os atributos abertos.

---

## Por que usamos final nos atributos

Nos exemplos, usamos:

```java
private final String nome;
```

`final` significa que aquele atributo precisa receber valor no construtor e depois não pode ser reatribuído.

Isso ajuda a criar objetos mais previsíveis.

Exemplo:

```java
private final String certificado;
```

Depois que a OS foi criada com um certificado, esse certificado não muda.

Nem todo atributo do mundo real será final, mas para esta fase isso ajuda a aprender objetos mais seguros.

Mais adiante vamos falar de alteração de estado.

---

## O que não fazer ainda

Não tente avançar para tudo de uma vez.

Ainda não é hora de se preocupar com:

```text
herança;
interface;
polimorfismo;
injeção de dependência;
Spring;
JPA;
repository;
controller;
service;
anotações;
lombok.
```

Esses assuntos virão.

Agora o foco é simples e profundo:

```text
classe;
objeto;
new;
atributo;
método;
construtor;
this.
```

Se essa base ficar fraca, todo o resto fica confuso.

---

## Erros comuns

### 1. Confundir classe com objeto

Classe é o molde.

Objeto é a instância criada com `new`.

### 2. Achar que new é só detalhe de sintaxe

`new` cria um objeto em memória.

### 3. Criar classe sem comportamento

Uma classe que só carrega dados pode ser útil em alguns casos, mas OO fica mais forte quando comportamento relacionado ao estado também aparece.

### 4. Colocar comportamento que não pertence ao objeto

`Cliente` não deveria salvar banco de dados ou ler Scanner.

### 5. Esquecer o this

No construtor, `this` ajuda a diferenciar atributo de parâmetro.

### 6. Deixar atributos públicos

Evite:

```java
public String nome;
```

Prefira atributos privados e métodos de acesso/comportamento.

### 7. Usar static para tudo

Se o método depende do estado do objeto, ele provavelmente deve ser método de instância.

---

## Debug recomendado

Use debug em:

```text
ClientePrimeiroObjeto.java
```

Coloque breakpoint nesta linha:

```java
Cliente cliente = new Cliente(
```

Entre no construtor e observe:

```text
parâmetros chegando;
this.nome recebendo valor;
this.email recebendo valor;
this.telefone recebendo valor;
this.ativo recebendo valor.
```

Depois coloque breakpoint em:

```java
System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
```

Entre em:

```text
podeReceberMensagem;
textoInformado.
```

Observe que o método usa o estado do objeto.

Depois faça o mesmo em:

```text
OrdemServicoObjeto.java
PedidoObjeto.java
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar cliente

Digite e execute:

```text
ClientePrimeiroObjeto.java
```

Explique:

```text
onde está a classe;
onde o objeto é criado;
quais são os atributos;
quais são os métodos;
onde o this aparece.
```

### Parte 2 — Criar dois clientes

Digite e execute:

```text
DoisClientes.java
```

Compare os resultados.

Explique por que os dois objetos têm comportamentos diferentes mesmo sendo da mesma classe.

### Parte 3 — Criar OS

Digite e execute:

```text
OrdemServicoObjeto.java
```

Altere:

```text
status;
dataAbertura;
quantidadeReagendamentos.
```

Observe como muda a fila sugerida.

### Parte 4 — Criar pedido

Digite e execute:

```text
PedidoObjeto.java
```

Altere:

```text
precoUnitario;
quantidade.
```

Observe como mudam total bruto, desconto e total final.

---

## Desafio prático

Crie o arquivo:

```text
PagamentoObjeto.java
```

Modele uma classe `Pagamento` com:

Atributos:

```text
codigo;
valor;
formaPagamento;
aprovado.
```

Use um enum:

```java
enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}
```

Comportamentos:

```text
valorValido();
podeSerConfirmado();
descricao();
```

Regras:

```text
valor precisa ser maior que zero;
pagamento aprovado pode ser confirmado;
pagamento com valor inválido não pode ser confirmado;
descrição deve mostrar código, forma e valor.
```

Crie dois pagamentos no `main`:

```text
um pagamento válido e aprovado;
um pagamento inválido ou não aprovado.
```

Imprima os comportamentos dos dois.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre classe e objeto em Java?
2. Para que serve o new?
3. Para que serve o this dentro do construtor?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar uma classe simples;
criar objeto com new;
explicar instância;
criar atributos privados;
inicializar atributos no construtor;
usar this corretamente;
criar métodos que usam estado do objeto;
criar mais de um objeto da mesma classe;
explicar por que cada objeto tem seu próprio estado;
diferenciar atributo de variável local;
diferenciar método static de método de objeto;
debugar a criação de um objeto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-107-classe-e-objeto-em-java
git commit -m "Aula 107: pratica classe e objeto em Java"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
classe é o molde; objeto é uma instância criada com new.
```

Atributos representam estado.

Métodos representam comportamento.

O `this` aponta para o objeto atual.

A partir daqui, vamos aprofundar a qualidade desses atributos.

Na próxima aula, vamos estudar:

```text
atributos com significado.
```

Vamos aprender a escolher estado mínimo, bons nomes, tipos adequados, dados obrigatórios e primeiras ideias de invariantes.
