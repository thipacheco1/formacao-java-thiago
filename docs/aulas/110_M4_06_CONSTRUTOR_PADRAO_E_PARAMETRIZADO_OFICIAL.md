# 110 — M4.06 — Construtor padrão e parametrizado

## Objetivo da aula

Nesta aula você vai entender melhor como um objeto nasce em Java.

Nas aulas anteriores, você criou classes com atributos e métodos de comportamento. Agora vamos aprofundar o papel do **construtor**.

O construtor é o ponto de entrada para criar um objeto. Ele define quais dados são necessários no nascimento daquele objeto e como o estado inicial será montado.

Ao final da aula, você deve conseguir:

```text
explicar o que é construtor;
entender quando existe construtor padrão;
criar construtor parametrizado;
usar new com construtor;
entender a diferença entre atributo e parâmetro;
usar this corretamente;
criar sobrecarga de construtores simples;
definir dados obrigatórios no construtor;
evitar objeto nascendo sem sentido.
```

Essa aula é importante porque construtor ruim permite objeto ruim. E objeto ruim espalha problema pelo sistema.

---

## A ideia central

Construtor é o método especial chamado quando usamos `new`.

Exemplo:

```java
Cliente cliente = new Cliente("Ana", "ana@email.com");
```

Nesse momento, o Java chama o construtor da classe `Cliente`.

O construtor recebe os dados iniciais e preenche os atributos:

```java
Cliente(String nome, String email) {
    this.nome = nome;
    this.email = email;
}
```

Pense no construtor como a porta de entrada do objeto.

Se a porta deixa entrar qualquer coisa, o objeto pode nascer inválido.

---

## Primeiro exemplo: construtor parametrizado

Crie a pasta:

```powershell
mkdir labs\m4\aula-110-construtor-padrao-e-parametrizado
cd labs\m4\aula-110-construtor-padrao-e-parametrizado
```

Crie o arquivo:

```text
ClienteConstrutorParametrizado.java
```

Código:

```java
public class ClienteConstrutorParametrizado {
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
javac ClienteConstrutorParametrizado.java
java ClienteConstrutorParametrizado
```

---

## O que aconteceu aqui

Neste trecho:

```java
Cliente cliente = new Cliente(
        "Ana Silva",
        "ana@email.com",
        "11999999999",
        true
);
```

você pediu ao Java:

```text
crie um novo Cliente usando estes dados.
```

O construtor chamado foi:

```java
Cliente(String nome, String email, String telefone, boolean ativo)
```

Os valores entraram nos parâmetros:

```text
nome = Ana Silva;
email = ana@email.com;
telefone = 11999999999;
ativo = true.
```

Depois foram gravados nos atributos:

```java
this.nome = nome;
this.email = email;
this.telefone = telefone;
this.ativo = ativo;
```

---

## Atributo versus parâmetro

Observe esta linha:

```java
this.nome = nome;
```

O primeiro `nome` é o atributo:

```java
private final String nome;
```

O segundo `nome` é o parâmetro do construtor:

```java
Cliente(String nome, ...)
```

O `this` resolve a diferença.

```text
this.nome = atributo do objeto atual
nome = parâmetro recebido
```

Isso é muito comum em Java.

Sem `this`, o código ficaria confuso quando atributo e parâmetro têm o mesmo nome.

---

## Por que usar o mesmo nome no parâmetro

Você poderia escrever assim:

```java
Cliente(String nomeRecebido) {
    this.nome = nomeRecebido;
}
```

Funciona.

Mas em Java é muito comum usar o mesmo nome:

```java
Cliente(String nome) {
    this.nome = nome;
}
```

Isso deixa claro que o parâmetro representa exatamente o mesmo conceito do atributo.

A diferença fica explícita pelo `this`.

---

## Construtor padrão

Construtor padrão é o construtor sem parâmetros.

Exemplo:

```java
class Cliente {
    Cliente() {
    }
}
```

Ele permite criar objeto assim:

```java
Cliente cliente = new Cliente();
```

Mas existe um detalhe importante:

```text
se você não declarar nenhum construtor, o Java cria um construtor padrão automaticamente.
```

Exemplo:

```java
class Produto {
}
```

Você consegue fazer:

```java
Produto produto = new Produto();
```

porque o Java forneceu um construtor sem parâmetros.

---

## Quando o Java deixa de criar o construtor padrão

Se você cria qualquer construtor, o Java não gera mais o construtor padrão automaticamente.

Exemplo:

```java
class Cliente {
    private final String nome;

    Cliente(String nome) {
        this.nome = nome;
    }
}
```

Agora isto funciona:

```java
Cliente cliente = new Cliente("Ana");
```

Mas isto não funciona:

```java
Cliente cliente = new Cliente();
```

Porque não existe construtor sem parâmetros.

Se quiser os dois, você precisa declarar os dois.

---

## Exemplo com construtor padrão

Crie:

```text
ProdutoConstrutorPadrao.java
```

Código:

```java
public class ProdutoConstrutorPadrao {
    public static void main(String[] args) {
        Produto produto = new Produto();

        System.out.println("Produto criado.");
        System.out.println("Nome: " + produto.nome());
        System.out.println("Ativo: " + produto.ativo());
    }
}

class Produto {
    private String nome;
    private boolean ativo;

    Produto() {
        this.nome = "Produto sem nome";
        this.ativo = true;
    }

    String nome() {
        return nome;
    }

    boolean ativo() {
        return ativo;
    }
}
```

Compile e execute:

```powershell
javac ProdutoConstrutorPadrao.java
java ProdutoConstrutorPadrao
```

Aqui o construtor sem parâmetros define valores iniciais.

Isso é diferente de deixar tudo vazio sem pensar.

---

## Cuidado com construtor padrão

Construtor padrão pode ser útil, mas também pode ser perigoso.

Exemplo ruim:

```java
class Pedido {
    private String cliente;
    private BigDecimal valor;

    Pedido() {
    }
}
```

Agora é possível criar:

```java
Pedido pedido = new Pedido();
```

Mas esse pedido não tem cliente nem valor.

Ele nasceu sem sentido.

Em objetos de domínio, muitas vezes é melhor exigir dados obrigatórios no construtor.

---

## Construtor parametrizado protege melhor o objeto

Compare:

```java
Pedido pedido = new Pedido();
```

com:

```java
Pedido pedido = new Pedido("Ana", "Cadeira", new BigDecimal("199.90"), 2);
```

No segundo caso, fica claro que um pedido precisa nascer com:

```text
cliente;
produto;
preço;
quantidade.
```

Isso reduz objeto incompleto.

Crie:

```text
PedidoConstrutorParametrizado.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoConstrutorParametrizado {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Total bruto: " + pedido.totalBruto());
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

    BigDecimal totalBruto() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }

    BigDecimal desconto() {
        if (totalBruto().compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto().multiply(new BigDecimal("0.10"));
        }

        return BigDecimal.ZERO;
    }
}
```

Esse construtor deixa o objeto mais completo desde o início.

---

## Validação simples no construtor

Agora vamos começar a proteger o nascimento do objeto.

Crie:

```text
PedidoConstrutorComValidacao.java
```

Código:

```java
import java.math.BigDecimal;

public class PedidoConstrutorComValidacao {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva",
                "Cadeira",
                new BigDecimal("199.90"),
                2
        );

        System.out.println("Pedido criado.");
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        if (!textoInformado(cliente)) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (!textoInformado(produto)) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (precoUnitario == null || precoUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço unitário deve ser maior que zero.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

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

    BigDecimal totalBruto() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        if (totalBruto().compareTo(new BigDecimal("300.00")) >= 0) {
            return totalBruto().multiply(new BigDecimal("0.10"));
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

Agora o pedido não nasce inválido.

Se tentar:

```java
new Pedido("", "Cadeira", new BigDecimal("199.90"), 2);
```

o programa lança erro:

```text
Cliente é obrigatório.
```

Isso começa a proteger o objeto.

---

## O que é IllegalArgumentException

`IllegalArgumentException` indica que alguém chamou um método ou construtor passando argumento inválido.

No construtor, faz sentido usar quando os dados iniciais não respeitam regras básicas.

Exemplo:

```java
throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
```

Esse código interrompe a criação do objeto.

A mensagem explica o problema.

Mais adiante, vamos estudar exceções com mais profundidade. Aqui o objetivo é entender a ideia:

```text
não permita que o objeto nasça em estado inválido.
```

---

## Construtor e invariantes

Na aula anterior, começamos a falar de invariantes.

Invariante é uma regra que deve ser sempre verdadeira para o objeto fazer sentido.

Exemplo de `Pedido`:

```text
cliente informado;
produto informado;
preço maior que zero;
quantidade maior que zero.
```

Se essas regras são obrigatórias, o construtor é um ótimo lugar para protegê-las.

Assim, depois que o objeto nasce, você pode confiar mais nele.

---

## Sobrecarga de construtores

Sobrecarga significa ter mais de um construtor com parâmetros diferentes.

Exemplo:

```java
Cliente(String nome, String email) {
    this(nome, email, "", true);
}

Cliente(String nome, String email, String telefone, boolean ativo) {
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.ativo = ativo;
}
```

O primeiro construtor chama o segundo.

Essa linha:

```java
this(nome, email, "", true);
```

significa:

```text
chame outro construtor desta mesma classe.
```

Crie:

```text
ClienteConstrutoresSobrecarregados.java
```

Código:

```java
public class ClienteConstrutoresSobrecarregados {
    public static void main(String[] args) {
        Cliente clienteSemTelefone = new Cliente(
                "Ana Silva",
                "ana@email.com"
        );

        Cliente clienteCompleto = new Cliente(
                "Carlos Souza",
                "carlos@email.com",
                "11999999999",
                true
        );

        imprimirCliente(clienteSemTelefone);
        imprimirCliente(clienteCompleto);
    }

    public static void imprimirCliente(Cliente cliente) {
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
        System.out.println("Ativo: " + cliente.ativo());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
        System.out.println("------------------------------------");
    }
}

class Cliente {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    Cliente(String nome, String email) {
        this(nome, email, "", true);
    }

    Cliente(String nome, String email, String telefone, boolean ativo) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(email)) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

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
javac ClienteConstrutoresSobrecarregados.java
java ClienteConstrutoresSobrecarregados
```

---

## Quando usar sobrecarga

Use sobrecarga quando existem formas legítimas diferentes de criar o objeto.

Exemplo:

```text
cliente com nome e email;
cliente com nome, email, telefone e status.
```

Mas cuidado.

Sobrecarga demais pode confundir.

Se a classe tem cinco construtores diferentes, talvez o objeto esteja complexo ou a criação precise de outro padrão no futuro.

Por enquanto, use com moderação.

---

## Construtor com valor padrão

Sobrecarga também pode definir valores padrão.

No exemplo:

```java
Cliente(String nome, String email) {
    this(nome, email, "", true);
}
```

Quando o telefone não é informado:

```text
telefone = "";
ativo = true.
```

Isso é uma decisão de negócio.

Antes de criar valor padrão, pergunte:

```text
esse padrão faz sentido?
não estou escondendo uma informação obrigatória?
o aluno que ler o código vai entender?
```

Valor padrão precisa ser claro.

---

## Exemplo com OS e construtor protegido

Crie:

```text
OrdemServicoConstrutor.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoConstrutor {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana Silva",
                StatusOs.ABERTA,
                LocalDate.now().minusDays(4),
                1
        );

        LocalDate hoje = LocalDate.now();

        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
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
        if (!textoInformado(certificado)) {
            throw new IllegalArgumentException("Certificado é obrigatório.");
        }

        if (!textoInformado(cliente)) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (dataAbertura == null) {
            throw new IllegalArgumentException("Data de abertura é obrigatória.");
        }

        if (quantidadeReagendamentos < 0) {
            throw new IllegalArgumentException("Quantidade de reagendamentos não pode ser negativa.");
        }

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

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean atrasada(LocalDate dataReferencia) {
        return diasEmAberto(dataReferencia) > 3;
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

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Esse exemplo mostra o construtor protegendo o estado inicial da OS.

A OS não nasce sem certificado, cliente, status ou data.

---

## Construtor não deve fazer trabalho demais

Construtor deve preparar o objeto.

Evite colocar no construtor coisas como:

```text
salvar no banco;
chamar API;
enviar mensagem;
ler Scanner;
imprimir relatório;
executar regra longa demais;
abrir arquivo;
conectar em serviço externo.
```

Exemplo ruim:

```java
Pedido(String cliente, BigDecimal valor) {
    this.cliente = cliente;
    this.valor = valor;

    salvarNoBanco();
    enviarEmail();
    imprimirResumo();
}
```

Isso é perigoso.

Criar objeto deve ser previsível.

Construtor bom valida e inicializa estado.

Ele não deve disparar efeitos colaterais pesados.

---

## Ordem das validações no construtor

Uma ordem simples:

```text
validar parâmetros obrigatórios;
validar faixas numéricas;
validar combinações simples;
atribuir valores aos atributos.
```

Exemplo:

```java
if (!textoInformado(cliente)) {
    throw new IllegalArgumentException("Cliente é obrigatório.");
}

if (precoUnitario == null || precoUnitario.compareTo(BigDecimal.ZERO) <= 0) {
    throw new IllegalArgumentException("Preço unitário deve ser maior que zero.");
}

this.cliente = cliente;
this.precoUnitario = precoUnitario;
```

Evite atribuir primeiro e validar depois.

O ideal é o objeto só receber estado quando os dados já foram aceitos.

---

## Erros comuns

### 1. Achar que construtor é método comum

Construtor não tem tipo de retorno e tem o mesmo nome da classe.

### 2. Esquecer que new chama o construtor

Sempre que você usa `new`, algum construtor é chamado.

### 3. Criar construtor padrão sem pensar

Objeto pode nascer incompleto.

### 4. Não validar dados obrigatórios

O objeto nasce inválido e o problema aparece depois.

### 5. Fazer trabalho demais no construtor

Construtor deve inicializar objeto, não executar o sistema inteiro.

### 6. Esquecer this

Pode confundir parâmetro e atributo.

### 7. Criar muitas sobrecargas

Construtores demais confundem a criação do objeto.

### 8. Usar valores padrão sem clareza

Valor padrão precisa fazer sentido no domínio.

---

## Debug recomendado

Use debug em:

```text
ClienteConstrutorParametrizado.java
PedidoConstrutorComValidacao.java
ClienteConstrutoresSobrecarregados.java
OrdemServicoConstrutor.java
```

Coloque breakpoint na linha do `new`.

Exemplo:

```java
Pedido pedido = new Pedido(
```

Entre no construtor.

Observe:

```text
parâmetros recebidos;
validações executadas;
this recebendo valores;
exceção quando parâmetro é inválido;
chamada de construtor para outro construtor com this(...).
```

Faça um teste intencional:

```java
new Pedido("", "Cadeira", new BigDecimal("199.90"), 2);
```

Veja a exceção acontecer no construtor.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Cliente parametrizado

Digite e execute:

```text
ClienteConstrutorParametrizado.java
```

Explique:

```text
quais parâmetros entram no construtor;
quais atributos são preenchidos;
onde o this aparece.
```

### Parte 2 — Produto com construtor padrão

Digite e execute:

```text
ProdutoConstrutorPadrao.java
```

Explique:

```text
quais valores padrão foram definidos;
se esses padrões fazem sentido.
```

### Parte 3 — Pedido com validação

Digite e execute:

```text
PedidoConstrutorComValidacao.java
```

Depois teste valores inválidos:

```text
cliente vazio;
produto vazio;
preço zero;
quantidade zero.
```

### Parte 4 — Cliente com sobrecarga

Digite e execute:

```text
ClienteConstrutoresSobrecarregados.java
```

Explique:

```text
qual construtor chama qual;
qual valor padrão foi aplicado.
```

### Parte 5 — OS protegida

Digite e execute:

```text
OrdemServicoConstrutor.java
```

Teste:

```text
certificado vazio;
status null;
dataAbertura null;
reagendamentos negativos.
```

---

## Desafio prático

Crie o arquivo:

```text
PagamentoConstrutor.java
```

Modele uma classe `Pagamento`.

Atributos:

```text
codigo;
valor;
formaPagamento;
aprovado.
```

Use:

```java
enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}
```

Crie um construtor parametrizado que valide:

```text
codigo obrigatório;
valor maior que zero;
formaPagamento obrigatória.
```

O atributo `aprovado` pode ser recebido no construtor.

Comportamentos:

```text
podeConfirmar();
descricao();
```

Depois crie dois testes no `main`:

```text
pagamento válido;
pagamento inválido para ver a exceção.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre construtor padrão e parametrizado?
2. Qual regra você colocou dentro de um construtor?
3. Por que não é bom deixar objeto nascer inválido?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o que é construtor;
criar construtor sem parâmetros;
criar construtor parametrizado;
entender quando o Java cria construtor padrão automaticamente;
entender quando o Java deixa de criar construtor padrão;
usar this para diferenciar atributo e parâmetro;
validar dados obrigatórios no construtor;
lançar IllegalArgumentException para argumento inválido;
criar sobrecarga simples de construtores;
usar this(...) para chamar outro construtor;
evitar trabalho pesado no construtor;
debugar criação de objeto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-110-construtor-padrao-e-parametrizado
git commit -m "Aula 110: pratica construtores em Java"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
construtor define como um objeto nasce.
```

Se o construtor permite dados ruins, o objeto nasce frágil.

Se o construtor exige dados essenciais e valida regras básicas, o objeto nasce mais confiável.

Na próxima aula, vamos aprofundar encapsulamento.

Vamos entender por que atributos privados, métodos públicos e controle de acesso são fundamentais para proteger o estado do objeto.
