# 113 — M4.09 — Imutabilidade aplicada

## Objetivo da aula

Nesta aula você vai aprender imutabilidade aplicada em Java.

Nas aulas anteriores, vimos encapsulamento, getters, setters e métodos de domínio. Agora vamos avançar para uma ideia que deixa muitos objetos mais seguros:

```text
criar objetos que não mudam depois de nascer.
```

Isso é imutabilidade.

Ao final da aula, você deve conseguir:

```text
explicar o que é objeto imutável;
usar final em atributos com intenção;
entender por que ausência de setter ajuda;
diferenciar objeto mutável de objeto imutável;
criar classes simples imutáveis;
entender que final ajuda, mas não resolve tudo sozinho;
usar métodos que retornam novo objeto em vez de alterar o atual;
identificar objetos de valor;
entender por que imutabilidade melhora segurança, leitura e debug.
```

Essa aula é importante porque muitos conceitos profissionais de Java, backend, arquitetura e domínio ficam mais claros quando você entende imutabilidade.

---

## A ideia central

Objeto imutável é um objeto cujo estado não muda depois da criação.

Exemplo conceitual:

```text
Cliente criado com nome e e-mail.
Depois de criado, aquele objeto não altera nome nem e-mail.
Se precisar representar outro e-mail, criamos outro objeto.
```

Isso parece estranho no começo, porque estamos acostumados a pensar em alteração direta:

```java
cliente.setEmail("novo@email.com");
```

Mas em um modelo imutável, a ideia seria:

```java
Cliente clienteAtualizado = cliente.comEmail("novo@email.com");
```

O objeto antigo continua igual.

O novo objeto representa o novo estado.

---

## Por que imutabilidade importa

Objetos mutáveis podem ser alterados em vários pontos do sistema.

Quando algo dá errado, você precisa descobrir:

```text
quem alterou?
quando alterou?
com qual valor?
a regra foi respeitada?
o objeto passou por estado inválido?
```

Com objetos imutáveis, isso fica mais simples:

```text
o objeto nasceu com um estado;
esse estado não muda;
se existe outro estado, existe outro objeto.
```

Isso ajuda em:

```text
debug;
legibilidade;
segurança;
concorrência;
testes;
previsibilidade;
evitar efeitos colaterais.
```

Nem todo objeto precisa ser imutável, mas muitos objetos ficam melhores assim.

---

## Mutabilidade versus imutabilidade

Objeto mutável:

```text
nasce com estado;
pode mudar depois;
operações alteram o próprio objeto.
```

Exemplo:

```java
produto.reporEstoque(10);
produto.vender(2);
```

Objeto imutável:

```text
nasce com estado;
não muda depois;
operações retornam novo objeto quando precisam representar mudança.
```

Exemplo:

```java
Dinheiro total = valor.somar(outroValor);
```

O objeto `valor` não muda.  
O método `somar` devolve outro objeto `Dinheiro`.

---

## Exemplo ruim: objeto mutável sem controle

Crie a pasta:

```powershell
mkdir labs\m4\aula-113-imutabilidade-aplicada
cd labs\m4\aula-113-imutabilidade-aplicada
```

Crie o arquivo:

```text
ClienteMutavelProblematico.java
```

Código:

```java
public class ClienteMutavelProblematico {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.setNome("Ana Silva");
        cliente.setEmail("ana@email.com");

        System.out.println("Cliente inicial:");
        System.out.println(cliente.resumo());

        cliente.setNome("");
        cliente.setEmail(null);

        System.out.println("Cliente depois de alterações ruins:");
        System.out.println(cliente.resumo());
    }
}

class Cliente {
    private String nome;
    private String email;

    void setNome(String nome) {
        this.nome = nome;
    }

    void setEmail(String email) {
        this.email = email;
    }

    String resumo() {
        return "Nome: " + nome + " | E-mail: " + email;
    }
}
```

Compile e execute:

```powershell
javac ClienteMutavelProblematico.java
java ClienteMutavelProblematico
```

O objeto começou válido e depois ficou inválido.

Esse é um problema comum de objetos mutáveis sem regra.

---

## Primeiro modelo imutável

Agora crie:

```text
ClienteImutavel.java
```

Código:

```java
public class ClienteImutavel {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Ana Silva",
                "ana@email.com"
        );

        System.out.println("Cliente original:");
        System.out.println(cliente.resumo());

        Cliente clienteAtualizado = cliente.comEmail("ana.novo@email.com");

        System.out.println("Cliente original depois da atualização:");
        System.out.println(cliente.resumo());

        System.out.println("Novo cliente atualizado:");
        System.out.println(clienteAtualizado.resumo());
    }
}

class Cliente {
    private final String nome;
    private final String email;

    Cliente(String nome, String email) {
        if (!textoInformado(nome)) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (!textoInformado(email)) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
    }

    String nome() {
        return nome;
    }

    String email() {
        return email;
    }

    Cliente comEmail(String novoEmail) {
        if (!textoInformado(novoEmail)) {
            throw new IllegalArgumentException("Novo e-mail é obrigatório.");
        }

        return new Cliente(nome, novoEmail);
    }

    String resumo() {
        return "Nome: " + nome + " | E-mail: " + email;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac ClienteImutavel.java
java ClienteImutavel
```

Observe:

```text
cliente original não mudou;
clienteAtualizado é um novo objeto;
não existe setEmail;
o construtor protege os dados obrigatórios.
```

---

## O que torna essa classe imutável

A classe `Cliente` tem algumas características importantes:

```java
private final String nome;
private final String email;
```

Os atributos são privados e finais.

Não existem setters:

```text
não há setNome;
não há setEmail.
```

O construtor valida e inicializa tudo:

```java
Cliente(String nome, String email) {
    ...
    this.nome = nome;
    this.email = email;
}
```

Quando precisa trocar e-mail, o método retorna novo objeto:

```java
Cliente comEmail(String novoEmail) {
    return new Cliente(nome, novoEmail);
}
```

Esse padrão é muito usado em objetos de valor.

---

## final ajuda, mas não é tudo

`final` impede que o atributo seja reatribuído.

Exemplo:

```java
private final String nome;
```

Depois do construtor, não dá para fazer:

```java
this.nome = "Outro nome";
```

Mas cuidado: `final` não torna qualquer coisa profundamente imutável.

Exemplo conceitual:

```java
private final List<String> itens;
```

A referência da lista não pode ser trocada, mas o conteúdo da lista pode ser alterado se alguém tiver acesso a ela.

Ainda vamos estudar coleções e imutabilidade defensiva mais adiante.

Por enquanto, guarde:

```text
final ajuda muito;
ausência de setter ajuda;
usar tipos imutáveis ajuda;
não expor objetos mutáveis internos também é necessário.
```

---

## Tipos imutáveis comuns em Java

Você já usou alguns tipos imutáveis:

```text
String;
BigDecimal;
LocalDate;
LocalDateTime;
Instant;
Integer;
Long;
Boolean.
```

Exemplo com `String`:

```java
String nome = "ana";
String maiusculo = nome.toUpperCase();
```

O valor original não muda.

`toUpperCase` retorna outra `String`.

Exemplo com `LocalDate`:

```java
LocalDate hoje = LocalDate.now();
LocalDate amanha = hoje.plusDays(1);
```

`hoje` não muda.

`plusDays` retorna uma nova data.

Essa ideia é central na imutabilidade.

---

## Exemplo com LocalDate

Crie:

```text
LocalDateImutavel.java
```

Código:

```java
import java.time.LocalDate;

public class LocalDateImutavel {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);

        System.out.println("Hoje: " + hoje);
        System.out.println("Amanhã: " + amanha);
        System.out.println("Hoje continua igual: " + hoje);
    }
}
```

Compile e execute:

```powershell
javac LocalDateImutavel.java
java LocalDateImutavel
```

Esse comportamento é o mesmo que queremos em muitos objetos:

```text
operação não altera o objeto atual;
operação retorna novo valor.
```

---

## Objetos de valor

Objeto de valor representa uma informação do domínio sem identidade própria.

Exemplos:

```text
Dinheiro;
Email;
Telefone;
Endereco;
PeriodoAgendamento;
Cpf;
Quantidade;
Percentual.
```

Um objeto de valor geralmente é imutável.

Por quê?

Porque ele representa um valor.

Se um e-mail muda, normalmente você não “altera o e-mail antigo”.  
Você passa a ter outro e-mail.

Se um valor monetário muda, você cria outro valor monetário.

Exemplo:

```text
R$ 100,00 não vira R$ 150,00.
Você cria um novo valor de R$ 150,00.
```

---

## Exemplo: objeto de valor Dinheiro

Crie:

```text
DinheiroImutavel.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class DinheiroImutavel {
    public static void main(String[] args) {
        Dinheiro valorProduto = new Dinheiro(new BigDecimal("199.90"));
        Dinheiro frete = new Dinheiro(new BigDecimal("20.00"));

        Dinheiro total = valorProduto.somar(frete);
        Dinheiro comDesconto = total.aplicarDescontoPercentual(new BigDecimal("10"));

        System.out.println("Produto: " + valorProduto.formatado());
        System.out.println("Frete: " + frete.formatado());
        System.out.println("Total: " + total.formatado());
        System.out.println("Com desconto: " + comDesconto.formatado());

        System.out.println("Produto continua igual: " + valorProduto.formatado());
        System.out.println("Total continua igual: " + total.formatado());
    }
}

class Dinheiro {
    private final BigDecimal valor;

    Dinheiro(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    BigDecimal valor() {
        return valor;
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    boolean zero() {
        return valor.compareTo(BigDecimal.ZERO) == 0;
    }

    Dinheiro somar(Dinheiro outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new Dinheiro(valor.add(outro.valor));
    }

    Dinheiro subtrair(Dinheiro outro) {
        if (outro == null) {
            throw new IllegalArgumentException("Outro valor é obrigatório.");
        }

        return new Dinheiro(valor.subtract(outro.valor));
    }

    Dinheiro aplicarDescontoPercentual(BigDecimal percentual) {
        if (percentual == null || percentual.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Percentual não pode ser negativo.");
        }

        BigDecimal fator = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal desconto = valor.multiply(fator);

        return new Dinheiro(valor.subtract(desconto));
    }

    String formatado() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac DinheiroImutavel.java
java DinheiroImutavel
```

Observe:

```text
somar retorna novo Dinheiro;
aplicarDescontoPercentual retorna novo Dinheiro;
valorProduto continua igual;
total continua igual;
não existe setValor.
```

Esse é um ótimo exemplo de objeto de valor imutável.

---

## Por que Dinheiro é melhor que BigDecimal solto

Poderíamos usar `BigDecimal` diretamente em todo lugar.

Mas um objeto `Dinheiro` permite centralizar regras:

```text
valor obrigatório;
escala de 2 casas;
soma;
subtração;
desconto;
formatação.
```

Isso dá mais significado ao domínio.

Em sistemas profissionais, é comum criar objetos de valor para proteger conceitos importantes.

Exemplos:

```text
Email;
Telefone;
Cpf;
Dinheiro;
Percentual;
Periodo.
```

---

## Exemplo: Email como objeto de valor

Crie:

```text
EmailImutavel.java
```

Código:

```java
public class EmailImutavel {
    public static void main(String[] args) {
        Email email = new Email("ana@email.com");

        System.out.println("Valor: " + email.valor());
        System.out.println("Domínio: " + email.dominio());

        Email outroEmail = new Email("carlos@empresa.com");

        System.out.println("Outro valor: " + outroEmail.valor());
        System.out.println("Outro domínio: " + outroEmail.dominio());
    }
}

class Email {
    private final String valor;

    Email(String valor) {
        if (!emailValido(valor)) {
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

    boolean mesmoDominio(Email outro) {
        if (outro == null) {
            return false;
        }

        return dominio().equals(outro.dominio());
    }

    private boolean emailValido(String valor) {
        return valor != null
                && !valor.isBlank()
                && valor.contains("@")
                && valor.indexOf("@") > 0
                && valor.indexOf("@") < valor.length() - 1;
    }
}
```

Esse exemplo é simples, mas poderoso.

Agora e-mail não é só uma `String`.

Ele é um conceito com regra própria.

---

## Imutabilidade em entidades com ciclo de vida

Nem tudo deve ser imutável.

Uma Ordem de Serviço geralmente muda de status:

```text
AGENDADA;
REAGENDADA;
CONCLUIDA;
CANCELADA.
```

Um pagamento muda:

```text
PENDENTE;
APROVADO;
CONFIRMADO;
CANCELADO.
```

Um produto muda estoque.

Esses objetos têm ciclo de vida.

Eles podem ser mutáveis, desde que encapsulados.

Mas também existe um estilo em que a transição retorna um novo objeto.

Exemplo:

```java
Pagamento aprovado = pagamento.aprovar();
```

Vamos ver isso.

---

## Pagamento imutável com transição

Crie:

```text
PagamentoImutavel.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoImutavel {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento(
                "PAG-001",
                new BigDecimal("150.00"),
                StatusPagamento.PENDENTE
        );

        System.out.println("Original:");
        System.out.println(pagamento.resumo());

        Pagamento aprovado = pagamento.aprovar();

        System.out.println("Original depois de aprovar:");
        System.out.println(pagamento.resumo());

        System.out.println("Novo pagamento aprovado:");
        System.out.println(aprovado.resumo());

        Pagamento confirmado = aprovado.confirmar();

        System.out.println("Confirmado:");
        System.out.println(confirmado.resumo());
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
    private final StatusPagamento status;

    Pagamento(String codigo, BigDecimal valor, StatusPagamento status) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.valor = valor;
        this.status = status;
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

    Pagamento aprovar() {
        if (!pendente()) {
            throw new IllegalStateException("Somente pagamento pendente pode ser aprovado.");
        }

        return new Pagamento(codigo, valor, StatusPagamento.APROVADO);
    }

    Pagamento confirmar() {
        if (!aprovado()) {
            throw new IllegalStateException("Somente pagamento aprovado pode ser confirmado.");
        }

        return new Pagamento(codigo, valor, StatusPagamento.CONFIRMADO);
    }

    Pagamento cancelar(String motivo) {
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo é obrigatório.");
        }

        if (confirmado()) {
            throw new IllegalStateException("Pagamento confirmado não pode ser cancelado.");
        }

        return new Pagamento(codigo, valor, StatusPagamento.CANCELADO);
    }

    String resumo() {
        return "Pagamento " + codigo
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
javac PagamentoImutavel.java
java PagamentoImutavel
```

Observe:

```text
pagamento original continua pendente;
aprovar retorna novo objeto aprovado;
confirmar retorna novo objeto confirmado.
```

Esse modelo é muito seguro, mas tem trade-offs.

---

## Trade-offs da imutabilidade

Imutabilidade traz benefícios:

```text
menos efeitos colaterais;
mais previsibilidade;
debug mais simples;
objetos mais seguros;
facilita raciocínio;
ótima para objetos de valor.
```

Mas também tem custos:

```text
pode criar mais objetos;
pode exigir mais atenção em fluxos com ciclo de vida;
pode parecer mais verboso no começo;
nem sempre combina com entidades persistidas por frameworks;
precisa de clareza para não perder o novo objeto retornado.
```

Exemplo de erro:

```java
pagamento.aprovar();
System.out.println(pagamento.status());
```

Se `aprovar` retorna novo objeto, mas você ignora o retorno, o objeto original continua igual.

O correto seria:

```java
pagamento = pagamento.aprovar();
```

ou:

```java
Pagamento aprovado = pagamento.aprovar();
```

---

## Quando preferir imutabilidade

Imutabilidade costuma ser ótima para:

```text
objetos de valor;
configurações;
dados calculados;
resumos;
períodos;
valores monetários;
datas;
identificadores;
DTOs de saída;
comandos simples;
eventos.
```

Exemplos:

```text
Email;
Telefone;
Dinheiro;
PeriodoAgendamento;
ResumoPedido;
ResultadoCalculo;
Endereco;
Cpf.
```

---

## Quando aceitar mutabilidade

Mutabilidade pode fazer sentido para entidades com ciclo de vida claro:

```text
Pedido;
Pagamento;
OrdemServico;
Produto com estoque;
ContaBancaria;
Contrato.
```

Mas mesmo nesses casos, a mutabilidade precisa ser encapsulada.

Não é:

```text
mutável = setter para tudo.
```

É:

```text
mutável = métodos de domínio controlando mudanças.
```

Exemplos:

```text
pedido.cancelar(motivo);
pagamento.aprovar();
produto.vender(quantidade);
os.reagendar(data);
conta.sacar(valor).
```

---

## Record e imutabilidade

`record` em Java ajuda a criar objetos de dados imutáveis de forma simples.

Exemplo:

```java
record ResumoPedido(String cliente, BigDecimal totalFinal) {
}
```

Os componentes do record são finais.

Não existe setter.

Mas cuidado: se um componente for uma coleção mutável, ainda pode existir vazamento de mutabilidade.

Para objetos simples e valores, record pode ser excelente.

Exemplo:

```java
record PeriodoAgendamento(LocalDate inicio, LocalDate fim) {
}
```

Ainda assim, se houver regras no construtor compacto, você precisa validá-las.

---

## Exemplo com record imutável

Crie:

```text
PeriodoAgendamentoRecord.java
```

Código:

```java
import java.time.LocalDate;

public class PeriodoAgendamentoRecord {
    public static void main(String[] args) {
        PeriodoAgendamento periodo = new PeriodoAgendamento(
                LocalDate.now(),
                LocalDate.now().plusDays(5)
        );

        System.out.println("Início: " + periodo.inicio());
        System.out.println("Fim: " + periodo.fim());
        System.out.println("Duração em dias: " + periodo.duracaoEmDias());
    }
}

record PeriodoAgendamento(LocalDate inicio, LocalDate fim) {
    PeriodoAgendamento {
        if (inicio == null) {
            throw new IllegalArgumentException("Início é obrigatório.");
        }

        if (fim == null) {
            throw new IllegalArgumentException("Fim é obrigatório.");
        }

        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException("Fim não pode ser anterior ao início.");
        }
    }

    long duracaoEmDias() {
        return java.time.temporal.ChronoUnit.DAYS.between(inicio, fim);
    }
}
```

Esse exemplo mostra:

```text
record;
validação;
ausência de setters;
método de comportamento;
objeto pequeno e seguro.
```

---

## Imutabilidade não substitui modelagem

Não transforme tudo em imutável automaticamente.

Antes, pense:

```text
esse objeto representa valor ou entidade?
ele tem identidade?
ele tem ciclo de vida?
ele precisa mudar?
a mudança deve alterar o mesmo objeto ou produzir outro?
a imutabilidade deixa o código mais claro?
```

Imutabilidade é ferramenta de design.

Não é religião.

O objetivo é criar objetos mais seguros e mais fáceis de entender.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar cliente mutável e imutável

Execute:

```text
ClienteMutavelProblematico.java
ClienteImutavel.java
```

Explique:

```text
qual objeto pode ficar inválido depois de criado;
qual objeto protege melhor seus dados;
qual método retorna novo objeto.
```

### Parte 2 — Testar LocalDate

Execute:

```text
LocalDateImutavel.java
```

Explique por que:

```text
hoje.plusDays(1)
```

não altera o objeto `hoje`.

### Parte 3 — Usar Dinheiro

Execute:

```text
DinheiroImutavel.java
```

Teste:

```text
somar valores;
subtrair valores;
aplicar desconto.
```

Observe que os objetos originais não mudam.

### Parte 4 — Usar Email

Execute:

```text
EmailImutavel.java
```

Teste e-mails inválidos:

```text
texto vazio;
sem @;
@ no começo;
@ no final.
```

### Parte 5 — Pagamento imutável

Execute:

```text
PagamentoImutavel.java
```

Teste o erro de ignorar retorno:

```java
pagamento.aprovar();
System.out.println(pagamento.status());
```

Depois corrija:

```java
pagamento = pagamento.aprovar();
```

---

## Desafio prático

Crie o arquivo:

```text
TelefoneImutavel.java
```

Modele uma classe `Telefone`.

Atributos:

```text
ddd;
numero.
```

Regras:

```text
ddd obrigatório;
ddd deve ter 2 caracteres;
número obrigatório;
número deve ter pelo menos 8 caracteres.
```

Comportamentos:

```text
formatado();
mesmoDdd(Telefone outro);
comNumero(String novoNumero);
```

Regras do método `comNumero`:

```text
não altera o telefone atual;
retorna um novo Telefone com o mesmo ddd e novo número;
valida o novo número.
```

No `main`, crie:

```text
telefone original;
telefone alterado;
```

Imprima os dois e comprove que o original não mudou.

---

## Erros comuns

### 1. Achar que final resolve tudo

`final` impede reatribuição, mas não garante imutabilidade profunda para objetos mutáveis internos.

### 2. Criar setter em objeto que deveria ser imutável

Setter quebra a ideia de imutabilidade.

### 3. Ignorar retorno de método que cria novo objeto

Se o método retorna novo objeto, você precisa guardar o retorno.

### 4. Usar imutabilidade em tudo sem pensar

Entidades com ciclo de vida podem ser mutáveis, desde que encapsuladas.

### 5. Confundir objeto de valor com entidade

Objeto de valor não é identificado por id; ele representa uma informação.

### 6. Expor objeto mutável interno

Mesmo com atributos final, expor coleção ou objeto mutável pode quebrar encapsulamento.

### 7. Criar objeto imutável sem validação

Imutável inválido continua inválido para sempre.

---

## Debug recomendado

Use debug em:

```text
ClienteImutavel.java
DinheiroImutavel.java
PagamentoImutavel.java
PeriodoAgendamentoRecord.java
```

Coloque breakpoint em:

```java
Cliente clienteAtualizado = cliente.comEmail(...)
Dinheiro total = valorProduto.somar(frete)
Pagamento aprovado = pagamento.aprovar()
```

Observe:

```text
objeto original antes da operação;
criação do novo objeto;
retorno do método;
objeto original permanecendo igual;
novo objeto com outro estado.
```

No `PagamentoImutavel`, observe bem:

```text
pagamento original;
aprovado;
confirmado.
```

São objetos diferentes representando estados diferentes.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa um objeto ser imutável?
2. Por que ausência de setter ajuda?
3. Qual objeto você modelaria como valor imutável?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar imutabilidade;
criar classe com atributos final;
evitar setters;
validar estado no construtor;
criar método que retorna novo objeto;
usar String, BigDecimal e LocalDate entendendo que são imutáveis;
criar objeto de valor simples;
explicar diferença entre objeto de valor e entidade;
entender trade-offs da imutabilidade;
usar record para objeto simples imutável;
debugar criação de novos objetos;
evitar ignorar retorno de método imutável;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-113-imutabilidade-aplicada
git commit -m "Aula 113: aplica imutabilidade em objetos"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
imutabilidade reduz surpresa.
```

Quando um objeto não muda depois de criado, fica mais fácil confiar nele, testar, debugar e reutilizar.

Objetos de valor são grandes candidatos à imutabilidade.

Entidades com ciclo de vida podem continuar mutáveis, mas precisam ser bem encapsuladas.

Na próxima aula, vamos estudar composição.

Vamos aprender a criar objetos dentro de objetos, como `Pedido` com `ItemPedido` e `OrdemServico` com `Atividade`, evoluindo a modelagem orientada a objetos.
