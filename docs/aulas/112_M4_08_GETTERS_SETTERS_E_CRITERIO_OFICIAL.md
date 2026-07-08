# 112 — M4.08 — Getters, setters e critério

## Objetivo da aula

Nesta aula você vai aprender a usar getters e setters com critério.

Na aula anterior, vimos que encapsulamento de verdade não é apenas colocar atributos como `private`. O objeto precisa proteger seu estado e expor operações com intenção.

Agora vamos aprofundar um ponto que aparece muito em Java:

```text
getters;
setters;
métodos de leitura;
métodos de alteração;
operações de domínio.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é getter;
explicar o que é setter;
entender quando getter faz sentido;
entender quando setter é perigoso;
evitar setter automático para tudo;
substituir setters genéricos por métodos com intenção;
criar métodos de leitura sem quebrar encapsulamento;
proteger alteração de estado com regra;
diferenciar objeto de domínio de objeto de transporte de dados.
```

Essa aula é importante porque muito código Java ruim nasce de uma prática automática:

```text
criar atributo privado;
gerar getter;
gerar setter;
pronto.
```

Isso não é Orientação a Objetos de verdade.

---

## A ideia central

Getter é um método usado para consultar uma informação.

Exemplo:

```java
String nome() {
    return nome;
}
```

Setter é um método usado para alterar uma informação.

Exemplo:

```java
void setNome(String nome) {
    this.nome = nome;
}
```

O problema não está no getter ou no setter em si.

O problema está em usar setter sem pensar.

Se todo atributo tem setter livre, qualquer parte do sistema pode alterar o objeto de qualquer forma.

Isso enfraquece o encapsulamento.

A pergunta correta não é:

```text
quais getters e setters devo gerar?
```

A pergunta correta é:

```text
quais informações este objeto deve expor?
quais alterações este objeto deve permitir?
qual regra deve proteger cada alteração?
qual método expressa melhor a intenção do domínio?
```

---

## Getter não é sempre ruim

Getter pode ser útil.

Exemplo:

```java
String codigo() {
    return codigo;
}
```

Se outras partes do sistema precisam exibir, comparar ou registrar o código, faz sentido expor esse dado.

Outro exemplo:

```java
StatusPagamento status() {
    return status;
}
```

Saber o status pode ser necessário para exibição, relatório ou decisão externa.

Mas getter também precisa de critério.

Nem todo atributo interno precisa ser exposto.

Exemplo:

```java
private int tentativasInternas;
```

Se isso é detalhe interno da classe, talvez não precise de método público.

Encapsulamento também é esconder o que não precisa ser conhecido fora.

---

## Setter automático é o maior perigo

Veja este exemplo:

```java
class Pagamento {
    private String codigo;
    private BigDecimal valor;
    private StatusPagamento status;

    void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    void setStatus(StatusPagamento status) {
        this.status = status;
    }
}
```

Parece organizado porque os atributos são privados.

Mas o objeto está vulnerável.

Qualquer código pode fazer:

```java
pagamento.setCodigo("");
pagamento.setValor(new BigDecimal("-100.00"));
pagamento.setStatus(StatusPagamento.CONFIRMADO);
```

Isso pode quebrar regras como:

```text
código obrigatório;
valor maior que zero;
pagamento só confirma depois de aprovado.
```

Setter sem regra é quase atributo público com uma etapa extra.

---

## Exemplo ruim: setters livres

Crie a pasta:

```powershell
mkdir labs\m4\aula-112-getters-setters-e-criterio
cd labs\m4\aula-112-getters-setters-e-criterio
```

Crie o arquivo:

```text
PagamentoComSettersLivres.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoComSettersLivres {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento();

        pagamento.setCodigo("PAG-001");
        pagamento.setValor(new BigDecimal("150.00"));
        pagamento.setStatus(StatusPagamento.PENDENTE);

        System.out.println("Pagamento inicial:");
        System.out.println(pagamento.resumo());

        pagamento.setValor(new BigDecimal("-500.00"));
        pagamento.setStatus(StatusPagamento.CONFIRMADO);

        System.out.println("Pagamento depois de alterações indevidas:");
        System.out.println(pagamento.resumo());
    }
}

enum StatusPagamento {
    PENDENTE,
    APROVADO,
    CONFIRMADO,
    CANCELADO
}

class Pagamento {
    private String codigo;
    private BigDecimal valor;
    private StatusPagamento status;

    void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    void setStatus(StatusPagamento status) {
        this.status = status;
    }

    String resumo() {
        return "Código: " + codigo
                + " | Valor: " + valor
                + " | Status: " + status;
    }
}
```

Compile e execute:

```powershell
javac PagamentoComSettersLivres.java
java PagamentoComSettersLivres
```

O programa permite um estado absurdo:

```text
valor negativo;
status confirmado sem aprovação.
```

O Java compilou.  
Mas o domínio ficou errado.

---

## Melhor: construtor e métodos com intenção

Agora crie:

```text
PagamentoComCriterio.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoComCriterio {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento(
                "PAG-001",
                new BigDecimal("150.00")
        );

        System.out.println("Pagamento inicial:");
        System.out.println(pagamento.resumo());

        pagamento.aprovar();
        System.out.println("Após aprovação:");
        System.out.println(pagamento.resumo());

        pagamento.confirmar();
        System.out.println("Após confirmação:");
        System.out.println(pagamento.resumo());
    }
}

enum StatusPagamento {
    PENDENTE,
    APROVADO,
    CONFIRMADO,
    CANCELADO
}

class Pagamento {
    private final String codigo;
    private final BigDecimal valor;
    private StatusPagamento status;

    Pagamento(String codigo, BigDecimal valor) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.codigo = codigo;
        this.valor = valor;
        this.status = StatusPagamento.PENDENTE;
    }

    String codigo() {
        return codigo;
    }

    BigDecimal valor() {
        return valor;
    }

    StatusPagamento status() {
        return status;
    }

    boolean pendente() {
        return status == StatusPagamento.PENDENTE;
    }

    boolean aprovado() {
        return status == StatusPagamento.APROVADO;
    }

    boolean confirmado() {
        return status == StatusPagamento.CONFIRMADO;
    }

    void aprovar() {
        if (!pendente()) {
            throw new IllegalStateException("Somente pagamento pendente pode ser aprovado.");
        }

        status = StatusPagamento.APROVADO;
    }

    void confirmar() {
        if (!aprovado()) {
            throw new IllegalStateException("Somente pagamento aprovado pode ser confirmado.");
        }

        status = StatusPagamento.CONFIRMADO;
    }

    void cancelar(String motivo) {
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (confirmado()) {
            throw new IllegalStateException("Pagamento confirmado não pode ser cancelado.");
        }

        status = StatusPagamento.CANCELADO;
    }

    String resumo() {
        return "Código: " + codigo
                + " | Valor: " + valor
                + " | Status: " + status;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac PagamentoComCriterio.java
java PagamentoComCriterio
```

Agora não existe:

```java
setStatus(...)
setValor(...)
```

O objeto oferece operações com intenção:

```java
aprovar()
confirmar()
cancelar(motivo)
```

Isso protege as transições de estado.

---

## Getter com nome JavaBean versus método expressivo

Em muitos projetos Java, você verá o padrão JavaBean:

```java
getNome()
getValor()
getStatus()
isAtivo()
setNome(...)
setValor(...)
```

Esse padrão é comum, especialmente em frameworks, bibliotecas, DTOs, serialização e ferramentas.

Mas em código de domínio, podemos usar nomes mais diretos e expressivos:

```java
nome()
valor()
status()
ativo()
podeConfirmar()
cancelado()
```

Nesta formação, estamos priorizando clareza de domínio.

Você precisa conhecer os dois estilos.

### Estilo JavaBean

```java
String getNome() {
    return nome;
}

boolean isAtivo() {
    return ativo;
}
```

### Estilo mais direto

```java
String nome() {
    return nome;
}

boolean ativo() {
    return ativo;
}
```

Em projetos profissionais, o padrão da equipe pode exigir JavaBean.

O importante é entender o conceito:

```text
método de leitura expõe informação;
método de alteração precisa de critério.
```

---

## Setters podem validar, mas ainda assim podem ser fracos

Um setter pode ter validação:

```java
void setEmail(String email) {
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException("E-mail é obrigatório.");
    }

    this.email = email;
}
```

Isso é melhor do que setter sem regra.

Mas ainda pode ser menos expressivo do que um método de domínio.

Compare:

```java
cliente.setEmail("novo@email.com");
```

com:

```java
cliente.alterarEmail("novo@email.com");
```

O segundo comunica uma ação real.

Se a alteração exige regra, auditoria, confirmação, notificação ou validação específica, um método com nome de domínio costuma ser melhor.

---

## Exemplo com cliente

Crie:

```text
ClienteGetSetComCriterio.java
```

Código:

```java
public class ClienteGetSetComCriterio {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Ana Silva",
                "ana@email.com",
                "11999999999"
        );

        System.out.println(cliente.resumo());

        cliente.alterarEmail("ana.novo@email.com");
        cliente.alterarTelefone("11888888888");

        System.out.println("Após alteração de contato:");
        System.out.println(cliente.resumo());

        cliente.inativar("Solicitação do cliente");

        System.out.println("Após inativação:");
        System.out.println(cliente.resumo());
    }
}

class Cliente {
    private final String nome;
    private String email;
    private String telefone;
    private boolean ativo;
    private String motivoInativacao;

    Cliente(String nome, String email, String telefone) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(email)) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ativo = true;
        this.motivoInativacao = "";
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

    void alterarEmail(String novoEmail) {
        if (!textoInformado(novoEmail)) {
            throw new IllegalArgumentException("Novo e-mail é obrigatório.");
        }

        email = novoEmail;
    }

    void alterarTelefone(String novoTelefone) {
        if (!textoInformado(novoTelefone)) {
            throw new IllegalArgumentException("Novo telefone é obrigatório.");
        }

        telefone = novoTelefone;
    }

    void inativar(String motivo) {
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo da inativação é obrigatório.");
        }

        ativo = false;
        motivoInativacao = motivo;
    }

    void reativar() {
        ativo = true;
        motivoInativacao = "";
    }

    String resumo() {
        return "Cliente: " + nome
                + " | E-mail: " + email
                + " | Telefone: " + telefone
                + " | Ativo: " + ativo
                + " | Motivo inativação: " + motivoInativacao;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Observe os métodos:

```java
alterarEmail(...)
alterarTelefone(...)
inativar(...)
reativar()
```

Eles são mais expressivos do que:

```java
setEmail(...)
setTelefone(...)
setAtivo(...)
```

---

## Por que setAtivo é fraco

Compare:

```java
cliente.setAtivo(false);
```

com:

```java
cliente.inativar("Solicitação do cliente");
```

O primeiro apenas muda um boolean.

O segundo representa uma ação de negócio.

Ele permite exigir motivo.

Ele pode limpar ou atualizar outros campos.

Ele deixa claro o que aconteceu.

Outro exemplo:

```java
cliente.setAtivo(true);
```

Melhor:

```java
cliente.reativar();
```

Esse tipo de nome transforma alteração de estado em comportamento do domínio.

---

## Getters que devolvem coleção ou objeto mutável

Ainda vamos estudar coleções mais adiante, mas vale entender a ideia.

Um getter pode parecer inofensivo, mas pode expor dados internos de forma perigosa.

Exemplo conceitual:

```java
List<ItemPedido> itens() {
    return itens;
}
```

Se o código externo recebe a lista original, ele pode alterar diretamente:

```java
pedido.itens().clear();
```

Isso quebra o encapsulamento.

Mais adiante, vamos aprender formas melhores:

```text
devolver cópia;
devolver lista imutável;
oferecer métodos como adicionarItem e removerItem;
controlar alterações por comportamento.
```

Por enquanto, guarde a ideia:

```text
getter também pode vazar controle interno quando retorna algo mutável.
```

---

## Exemplo com Produto

Crie:

```text
ProdutoSemSettersLivres.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoSemSettersLivres {
    public static void main(String[] args) {
        Produto produto = new Produto(
                "PROD-001",
                "Cadeira",
                new BigDecimal("199.90"),
                10
        );

        System.out.println(produto.resumo());

        produto.reporEstoque(5);
        System.out.println("Após reposição:");
        System.out.println(produto.resumo());

        boolean vendaRealizada = produto.vender(3);
        System.out.println("Venda realizada: " + vendaRealizada);
        System.out.println(produto.resumo());

        produto.inativar("Produto fora de linha");
        System.out.println("Após inativação:");
        System.out.println(produto.resumo());
    }
}

class Produto {
    private final String codigo;
    private final String nome;
    private final BigDecimal preco;
    private int estoque;
    private boolean ativo;
    private String motivoInativacao;

    Produto(String codigo, String nome, BigDecimal preco, int estoqueInicial) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoqueInicial < 0) {
            throw new IllegalArgumentException("Estoque inicial não pode ser negativo.");
        }

        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoqueInicial;
        this.ativo = true;
        this.motivoInativacao = "";
    }

    String codigo() {
        return codigo;
    }

    String nome() {
        return nome;
    }

    BigDecimal preco() {
        return preco;
    }

    int estoque() {
        return estoque;
    }

    boolean ativo() {
        return ativo;
    }

    boolean temEstoque() {
        return estoque > 0;
    }

    boolean disponivelParaVenda() {
        return ativo && temEstoque();
    }

    void reporEstoque(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade de reposição deve ser maior que zero.");
        }

        estoque += quantidade;
    }

    boolean vender(int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade de venda deve ser maior que zero.");
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
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        ativo = false;
        motivoInativacao = motivo;
    }

    void reativar() {
        ativo = true;
        motivoInativacao = "";
    }

    String resumo() {
        return "Produto: " + codigo
                + " | Nome: " + nome
                + " | Preço: " + preco
                + " | Estoque: " + estoque
                + " | Ativo: " + ativo
                + " | Motivo inativação: " + motivoInativacao;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Aqui não existem setters livres para:

```text
estoque;
ativo;
motivoInativacao.
```

Existem operações:

```text
reporEstoque;
vender;
inativar;
reativar.
```

O objeto controla sua própria mudança.

---

## Quando setter pode ser aceitável

Setter pode ser aceitável quando:

```text
o objeto é simples e não tem regra importante;
o objeto é DTO;
o objeto é usado por framework;
a alteração é realmente livre;
o padrão do projeto exige JavaBean;
a validação está em outra camada por decisão arquitetural.
```

Exemplo de DTO simples:

```java
class ClienteRequest {
    private String nome;
    private String email;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

DTO não é o mesmo que entidade de domínio.

Em APIs, frameworks muitas vezes precisam de construtor vazio e setters para converter JSON em objeto.

Mas isso não significa que a entidade de domínio também deva ser fraca.

---

## DTO versus domínio

Essa diferença será aprofundada mais tarde, mas já precisamos começar a separar.

### DTO

DTO é objeto de transporte de dados.

Exemplo:

```text
ClienteRequest;
PedidoResponse;
PagamentoPayload.
```

Ele costuma ser usado para carregar dados entre camadas ou na entrada/saída da API.

Pode ter getters e setters simples, dependendo do framework.

### Domínio

Objeto de domínio representa regra importante do sistema.

Exemplo:

```text
Cliente;
Pedido;
Pagamento;
OrdemServico;
Produto.
```

Ele deve proteger estado e comportamento.

No domínio, setters livres são mais perigosos.

Regra prática:

```text
DTO pode ser mais simples;
domínio precisa ser mais protegido.
```

---

## Como revisar uma classe cheia de setters

Quando encontrar uma classe assim:

```java
setStatus(...)
setSaldo(...)
setEstoque(...)
setAtivo(...)
setDataAgendamento(...)
```

pergunte:

```text
qual ação real muda esse status?
qual operação muda esse saldo?
qual evento muda esse estoque?
qual motivo muda esse ativo?
qual regra existe nessa alteração?
```

Possíveis substituições:

```text
setStatus(CONCLUIDA) -> concluir()
setStatus(CANCELADA) -> cancelar(motivo)
setSaldo(...) -> depositar() / sacar()
setEstoque(...) -> reporEstoque() / vender()
setAtivo(false) -> inativar(motivo)
setDataAgendamento(...) -> reagendar(novaData)
```

Isso deixa o código mais expressivo e mais protegido.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Executar pagamento ruim

Execute:

```text
PagamentoComSettersLivres.java
```

Observe que ele permite:

```text
valor negativo;
status confirmado direto.
```

Explique por que isso é perigoso.

### Parte 2 — Executar pagamento melhor

Execute:

```text
PagamentoComCriterio.java
```

Tente confirmar antes de aprovar.

Observe a exceção.

### Parte 3 — Cliente com ações

Execute:

```text
ClienteGetSetComCriterio.java
```

Teste:

```text
alterar email para vazio;
inativar sem motivo;
reativar cliente.
```

### Parte 4 — Produto sem setter livre

Execute:

```text
ProdutoSemSettersLivres.java
```

Teste:

```text
vender quantidade maior que estoque;
vender com produto inativo;
repor estoque com zero.
```

### Parte 5 — Refatorar mentalmente

Pegue estes setters:

```text
setStatus;
setAtivo;
setEstoque;
setSaldo;
setDataAgendamento.
```

Escreva nomes melhores de métodos para cada caso.

---

## Desafio prático

Crie o arquivo:

```text
OrdemServicoSemSettersLivres.java
```

Modele uma classe `OrdemServico`.

Atributos:

```text
certificado;
cliente;
status;
dataAgendamento;
quantidadeReagendamentos;
motivoCancelamento;
```

Use enum:

```java
enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Não crie:

```text
setStatus;
setDataAgendamento;
setQuantidadeReagendamentos;
setMotivoCancelamento.
```

Crie métodos de domínio:

```text
reagendar(LocalDate novaData);
concluir();
cancelar(String motivo);
encerrada();
resumo();
```

Regras:

```text
OS cancelada não pode ser concluída;
OS concluída não pode ser cancelada;
OS encerrada não pode ser reagendada;
reagendamento incrementa quantidadeReagendamentos;
cancelamento exige motivo;
nova data de agendamento é obrigatória.
```

Depois teste no `main`:

```text
fluxo normal de reagendamento;
fluxo de conclusão;
tentativa inválida de reagendar OS concluída;
tentativa inválida de cancelar sem motivo.
```

---

## Erros comuns

### 1. Criar getter e setter automaticamente

Ferramenta gera código, mas quem decide o modelo é você.

### 2. Achar que private com setter é sempre encapsulado

Setter livre pode quebrar regra do mesmo jeito.

### 3. Usar setStatus para transições importantes

Status geralmente muda por ação de domínio.

### 4. Usar setAtivo em vez de ativar/inativar

Ativar e inativar comunicam intenção melhor.

### 5. Usar setEstoque em vez de vender/repor

Estoque muda por operação, não por alteração direta.

### 6. Confundir DTO com domínio

DTO pode carregar dados. Domínio deve proteger regra.

### 7. Expor dado interno desnecessário

Nem todo atributo precisa ter método de leitura.

### 8. Retornar objeto mutável interno sem cuidado

Getters também podem vazar controle interno.

---

## Debug recomendado

Use debug em:

```text
PagamentoComCriterio.java
ClienteGetSetComCriterio.java
ProdutoSemSettersLivres.java
```

Coloque breakpoint em:

```java
pagamento.aprovar()
pagamento.confirmar()
cliente.inativar(...)
produto.vender(...)
produto.reporEstoque(...)
```

Observe:

```text
estado antes da operação;
validações;
alterações internas;
estado depois da operação;
exceções quando a regra é violada.
```

Compare com o exemplo de setters livres e veja como não existe proteção real.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando um setter é perigoso?
2. Qual setter você substituiria por um método de domínio?
3. Qual diferença entre DTO e objeto de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar getter;
explicar setter;
usar getter com critério;
evitar setter automático;
identificar setter perigoso;
substituir setter por método de domínio;
criar alteração de estado com regra;
diferenciar DTO de objeto de domínio;
proteger transições de status;
evitar expor detalhes internos sem necessidade;
explicar por que setStatus costuma ser fraco;
debugar alterações protegidas;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-112-getters-setters-e-criterio
git commit -m "Aula 112: usa getters e setters com criterio"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
getter e setter são ferramentas, não obrigação.
```

Getter pode fazer sentido para leitura.

Setter precisa de muito mais cuidado.

Em objetos de domínio, prefira métodos que expressem ações reais:

```text
aprovar;
confirmar;
cancelar;
reagendar;
concluir;
vender;
reporEstoque;
inativar.
```

Na próxima aula, vamos estudar imutabilidade inicial.

Vamos entender quando um objeto não deve mudar depois de criado, como `final` ajuda, quais benefícios isso traz e como pensar em objetos mais seguros.
