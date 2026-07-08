# 111 — M4.07 — Encapsulamento de verdade

## Objetivo da aula

Nesta aula você vai entender encapsulamento de verdade.

Até agora, você aprendeu:

```text
classe;
objeto;
atributos;
métodos;
construtor;
this;
comportamentos;
validação inicial.
```

Agora vamos dar um passo muito importante: proteger o estado do objeto.

Muita gente acha que encapsulamento é apenas colocar atributos como `private` e criar getters e setters. Isso é só o começo.

Encapsulamento de verdade significa:

```text
não deixar qualquer parte do sistema alterar o objeto de qualquer jeito;
expor operações com intenção;
proteger regras importantes;
impedir estados inválidos;
esconder detalhes internos;
fazer o objeto controlar sua própria consistência.
```

Ao final da aula, você deve conseguir:

```text
explicar encapsulamento;
entender por que atributo público é perigoso;
entender por que setter para tudo é perigoso;
criar métodos com intenção;
proteger alterações de estado;
validar mudanças dentro do objeto;
evitar objeto inconsistente;
modelar operações como depositar, sacar, reagendar, concluir e cancelar.
```

Essa aula é essencial para começar a escrever código orientado a objetos com segurança.

---

## A ideia central

Encapsular é proteger.

Um objeto possui estado interno.

Esse estado não deve ser alterado livremente por qualquer código externo.

Exemplo ruim:

```java
conta.saldo = new BigDecimal("-500.00");
```

Se o saldo não deveria ficar negativo, esse código quebrou a regra do objeto.

Com encapsulamento melhor, o código externo não altera o saldo diretamente.

Ele pede uma operação:

```java
conta.sacar(new BigDecimal("50.00"));
```

E o próprio objeto decide se pode ou não.

Essa é a diferença:

```text
sem encapsulamento: qualquer um muda o estado;
com encapsulamento: o objeto controla como seu estado muda.
```

---

## Encapsulamento não é só private

Veja esta classe:

```java
class Cliente {
    private String nome;
    private String email;

    String getNome() {
        return nome;
    }

    void setNome(String nome) {
        this.nome = nome;
    }

    String getEmail() {
        return email;
    }

    void setEmail(String email) {
        this.email = email;
    }
}
```

Os atributos estão `private`.

Mas qualquer código pode fazer:

```java
cliente.setNome("");
cliente.setEmail(null);
```

Então o objeto ainda pode ficar inválido.

Isso é melhor do que atributo público, mas ainda não é encapsulamento forte.

Encapsulamento de verdade pergunta:

```text
essa alteração deve ser permitida?
quais regras precisam ser respeitadas?
o nome do método representa uma ação real?
faz sentido existir set para esse atributo?
```

Nem todo atributo precisa de setter.

---

## Exemplo ruim: atributos públicos

Crie a pasta:

```powershell
mkdir labs\m4\aula-111-encapsulamento-de-verdade
cd labs\m4\aula-111-encapsulamento-de-verdade
```

Crie o arquivo:

```text
ContaSemEncapsulamento.java
```

Código:

```java
import java.math.BigDecimal;

public class ContaSemEncapsulamento {
    public static void main(String[] args) {
        ContaBancaria conta = new ContaBancaria();

        conta.numero = "0001";
        conta.titular = "Ana Silva";
        conta.saldo = new BigDecimal("100.00");

        System.out.println("Saldo inicial: " + conta.saldo);

        conta.saldo = new BigDecimal("-500.00");

        System.out.println("Saldo depois da alteração indevida: " + conta.saldo);
    }
}

class ContaBancaria {
    public String numero;
    public String titular;
    public BigDecimal saldo;
}
```

Compile e execute:

```powershell
javac ContaSemEncapsulamento.java
java ContaSemEncapsulamento
```

O problema é claro:

```text
qualquer parte do código pode colocar saldo negativo;
qualquer parte do código pode apagar titular;
qualquer parte do código pode mudar número da conta;
não existe regra protegendo o estado.
```

Essa classe não protege nada.

---

## Primeiro passo: atributos privados

Agora crie:

```text
ContaComAtributosPrivados.java
```

Código:

```java
import java.math.BigDecimal;

public class ContaComAtributosPrivados {
    public static void main(String[] args) {
        ContaBancaria conta = new ContaBancaria(
                "0001",
                "Ana Silva",
                new BigDecimal("100.00")
        );

        System.out.println("Número: " + conta.numero());
        System.out.println("Titular: " + conta.titular());
        System.out.println("Saldo: " + conta.saldo());
    }
}

class ContaBancaria {
    private final String numero;
    private final String titular;
    private final BigDecimal saldo;

    ContaBancaria(String numero, String titular, BigDecimal saldo) {
        this.numero = numero;
        this.titular = titular;
        this.saldo = saldo;
    }

    String numero() {
        return numero;
    }

    String titular() {
        return titular;
    }

    BigDecimal saldo() {
        return saldo;
    }
}
```

Agora o código externo não consegue fazer:

```java
conta.saldo = new BigDecimal("-500.00");
```

Isso já é melhor.

Mas ainda falta uma coisa importante: como alterar saldo corretamente?

Se saldo é algo que muda, precisamos criar operações com regra.

---

## Encapsulando alteração de estado

Crie:

```text
ContaEncapsulada.java
```

Código:

```java
import java.math.BigDecimal;

public class ContaEncapsulada {
    public static void main(String[] args) {
        ContaBancaria conta = new ContaBancaria(
                "0001",
                "Ana Silva",
                new BigDecimal("100.00")
        );

        System.out.println(conta.resumo());

        conta.depositar(new BigDecimal("50.00"));
        System.out.println("Depois do depósito: " + conta.resumo());

        boolean saqueRealizado = conta.sacar(new BigDecimal("30.00"));
        System.out.println("Saque realizado: " + saqueRealizado);
        System.out.println("Depois do saque: " + conta.resumo());

        boolean saqueGrande = conta.sacar(new BigDecimal("1000.00"));
        System.out.println("Saque grande realizado: " + saqueGrande);
        System.out.println("Saldo final: " + conta.saldo());
    }
}

class ContaBancaria {
    private final String numero;
    private final String titular;
    private BigDecimal saldo;

    ContaBancaria(String numero, String titular, BigDecimal saldoInicial) {
        if (!textoInformado(numero)) {
            throw new IllegalArgumentException("Número da conta é obrigatório.");
        }

        if (!textoInformado(titular)) {
            throw new IllegalArgumentException("Titular é obrigatório.");
        }

        if (saldoInicial == null || saldoInicial.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo.");
        }

        this.numero = numero;
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    String numero() {
        return numero;
    }

    String titular() {
        return titular;
    }

    BigDecimal saldo() {
        return saldo;
    }

    void depositar(BigDecimal valor) {
        if (valorInvalido(valor)) {
            throw new IllegalArgumentException("Valor de depósito deve ser maior que zero.");
        }

        saldo = saldo.add(valor);
    }

    boolean sacar(BigDecimal valor) {
        if (valorInvalido(valor)) {
            throw new IllegalArgumentException("Valor de saque deve ser maior que zero.");
        }

        if (!saldoSuficiente(valor)) {
            return false;
        }

        saldo = saldo.subtract(valor);
        return true;
    }

    boolean saldoSuficiente(BigDecimal valor) {
        return saldo.compareTo(valor) >= 0;
    }

    String resumo() {
        return "Conta " + numero + " | Titular: " + titular + " | Saldo: " + saldo;
    }

    private boolean valorInvalido(BigDecimal valor) {
        return valor == null || valor.compareTo(BigDecimal.ZERO) <= 0;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac ContaEncapsulada.java
java ContaEncapsulada
```

---

## O que melhorou

Agora o saldo não é alterado diretamente.

Não existe:

```java
conta.setSaldo(...)
```

Nem:

```java
conta.saldo = ...
```

Existe:

```java
conta.depositar(...)
conta.sacar(...)
```

Esses métodos têm intenção de domínio.

Eles protegem as regras:

```text
depósito precisa ser maior que zero;
saque precisa ser maior que zero;
saque só acontece se houver saldo suficiente;
saldo não fica negativo.
```

Isso é encapsulamento de verdade.

O objeto não expõe seu estado para qualquer alteração.  
Ele oferece operações válidas.

---

## Setter nem sempre é boa ideia

Muita gente aprende OO assim:

```java
private String nome;

public String getNome() {
    return nome;
}

public void setNome(String nome) {
    this.nome = nome;
}
```

Isso não é sempre errado, mas pode ser perigoso se usado automaticamente.

Exemplo ruim:

```java
conta.setSaldo(new BigDecimal("-500.00"));
```

Esse setter permite quebrar a regra do saldo.

Melhor:

```java
conta.depositar(new BigDecimal("50.00"));
conta.sacar(new BigDecimal("30.00"));
```

A pergunta não é:

```text
como criar getter e setter?
```

A pergunta correta é:

```text
qual operação real esse objeto deve permitir?
```

---

## Getters também devem ser pensados

Métodos de leitura são úteis.

Exemplo:

```java
BigDecimal saldo() {
    return saldo;
}
```

Mas nem todo atributo precisa ser exposto.

Se um dado interno não precisa ser conhecido fora da classe, não crie método de acesso.

Exemplo:

```java
private int quantidadeTentativas;
```

Talvez essa informação seja interna e não precise aparecer.

Encapsulamento também significa esconder detalhes que não interessam para o uso externo.

---

## Exemplo com Ordem de Serviço

Agora vamos aplicar encapsulamento em um exemplo de domínio.

A OS tem status.  
Status não deveria ser alterado livremente.

Exemplo ruim:

```java
os.setStatus(StatusOs.CONCLUIDA);
os.setStatus(StatusOs.CANCELADA);
os.setStatus(StatusOs.REAGENDADA);
```

Qualquer parte do código muda para qualquer status.

Melhor:

```java
os.reagendar(novaData);
os.concluir();
os.cancelar("Cliente solicitou cancelamento");
```

Esses métodos têm intenção e podem validar regras.

---

## Ordem de Serviço encapsulada

Crie:

```text
OrdemServicoEncapsulada.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoEncapsulada {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana Silva",
                LocalDate.now().plusDays(1)
        );

        LocalDate hoje = LocalDate.now();

        System.out.println(os.resumo(hoje));

        os.reagendar(LocalDate.now().plusDays(3));
        System.out.println("Após reagendamento:");
        System.out.println(os.resumo(hoje));

        os.concluir();
        System.out.println("Após conclusão:");
        System.out.println(os.resumo(hoje));

        try {
            os.reagendar(LocalDate.now().plusDays(5));
        } catch (IllegalStateException erro) {
            System.out.println("Erro ao reagendar: " + erro.getMessage());
        }
    }
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private StatusOs status;
    private LocalDate dataAgendamento;
    private int quantidadeReagendamentos;

    OrdemServico(String certificado, String cliente, LocalDate dataAgendamento) {
        if (!textoInformado(certificado)) {
            throw new IllegalArgumentException("Certificado é obrigatório.");
        }

        if (!textoInformado(cliente)) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataAgendamento == null) {
            throw new IllegalArgumentException("Data de agendamento é obrigatória.");
        }

        this.certificado = certificado;
        this.cliente = cliente;
        this.dataAgendamento = dataAgendamento;
        this.status = StatusOs.AGENDADA;
        this.quantidadeReagendamentos = 0;
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

    LocalDate dataAgendamento() {
        return dataAgendamento;
    }

    int quantidadeReagendamentos() {
        return quantidadeReagendamentos;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean atrasada(LocalDate dataReferencia) {
        return !encerrada() && dataAgendamento.isBefore(dataReferencia);
    }

    long diasDeAtraso(LocalDate dataReferencia) {
        if (!atrasada(dataReferencia)) {
            return 0;
        }

        return ChronoUnit.DAYS.between(dataAgendamento, dataReferencia);
    }

    void reagendar(LocalDate novaData) {
        if (encerrada()) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        if (novaData == null) {
            throw new IllegalArgumentException("Nova data é obrigatória.");
        }

        if (novaData.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Nova data não pode ser anterior à data atual.");
        }

        dataAgendamento = novaData;
        quantidadeReagendamentos++;
        status = StatusOs.REAGENDADA;
    }

    void concluir() {
        if (status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS cancelada não pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    void cancelar(String motivo) {
        if (!textoInformado(motivo)) {
            throw new IllegalArgumentException("Motivo do cancelamento é obrigatório.");
        }

        if (status == StatusOs.CONCLUIDA) {
            throw new IllegalStateException("OS concluída não pode ser cancelada.");
        }

        status = StatusOs.CANCELADA;
    }

    String resumo(LocalDate dataReferencia) {
        return "OS " + certificado
                + " | Cliente: " + cliente
                + " | Status: " + status
                + " | Data: " + dataAgendamento
                + " | Reagendamentos: " + quantidadeReagendamentos
                + " | Dias de atraso: " + diasDeAtraso(dataReferencia);
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Compile e execute:

```powershell
javac OrdemServicoEncapsulada.java
java OrdemServicoEncapsulada
```

---

## O que esse exemplo ensina

A OS não tem:

```java
setStatus(...)
setDataAgendamento(...)
setQuantidadeReagendamentos(...)
```

Ela tem operações de domínio:

```java
reagendar(...)
concluir()
cancelar(...)
```

Isso é muito melhor.

O código externo não decide manualmente como alterar cada atributo.

Ele pede uma ação.

A própria OS altera os atributos necessários de forma consistente.

No método `reagendar`, três coisas acontecem juntas:

```text
dataAgendamento muda;
quantidadeReagendamentos aumenta;
status vira REAGENDADA.
```

Se isso fosse feito por setters separados, alguém poderia esquecer uma parte.

Exemplo de erro com setters:

```java
os.setDataAgendamento(novaData);
os.setStatus(StatusOs.REAGENDADA);
// esqueceu de incrementar quantidadeReagendamentos
```

Com método encapsulado:

```java
os.reagendar(novaData);
```

a regra fica centralizada.

---

## Encapsulamento protege transições

Em sistemas reais, muitos objetos possuem transições de estado.

Exemplos:

```text
pedido: criado -> pago -> enviado -> entregue -> cancelado;
OS: agendada -> reagendada -> concluída;
pagamento: pendente -> aprovado -> confirmado;
cotação: aberta -> enviada -> aprovada -> recusada;
usuário: ativo -> bloqueado -> inativo.
```

Sem encapsulamento, qualquer código pode pular etapas.

Exemplo ruim:

```java
pagamento.setStatus(CONFIRMADO);
```

Mas talvez só possa confirmar se estiver aprovado.

Melhor:

```java
pagamento.aprovar();
pagamento.confirmar();
```

Cada método protege uma transição.

---

## Exemplo com pagamento encapsulado

Crie:

```text
PagamentoEncapsulado.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoEncapsulado {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento(
                "PAG-001",
                new BigDecimal("250.00"),
                FormaPagamento.PIX
        );

        System.out.println(pagamento.resumo());

        pagamento.aprovar();
        System.out.println("Após aprovação:");
        System.out.println(pagamento.resumo());

        pagamento.confirmar();
        System.out.println("Após confirmação:");
        System.out.println(pagamento.resumo());
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
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
    private final FormaPagamento formaPagamento;
    private StatusPagamento status;

    Pagamento(String codigo, BigDecimal valor, FormaPagamento formaPagamento) {
        if (!textoInformado(codigo)) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (formaPagamento == null) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }

        this.codigo = codigo;
        this.valor = valor;
        this.formaPagamento = formaPagamento;
        this.status = StatusPagamento.PENDENTE;
    }

    String codigo() {
        return codigo;
    }

    BigDecimal valor() {
        return valor;
    }

    FormaPagamento formaPagamento() {
        return formaPagamento;
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

    boolean cancelado() {
        return status == StatusPagamento.CANCELADO;
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
        return "Pagamento " + codigo
                + " | Valor: " + valor
                + " | Forma: " + formaPagamento
                + " | Status: " + status;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Esse exemplo mostra uma ideia importante:

```text
o status muda, mas não por setter livre;
o status muda por operações válidas.
```

---

## Atributo final e atributo mutável

Nos exemplos, alguns atributos são `final`:

```java
private final String codigo;
private final BigDecimal valor;
```

Eles não devem mudar depois da criação.

Outros não são `final`:

```java
private StatusPagamento status;
```

porque representam estado que muda ao longo do ciclo de vida.

Isso é normal.

A regra é:

```text
se o atributo não deve mudar depois do construtor, use final;
se o atributo representa estado mutável do domínio, não use final, mas proteja a alteração.
```

O problema não é ter estado mutável.

O problema é permitir alteração sem regra.

---

## Encapsulamento e método privado

Métodos privados ajudam a esconder detalhes internos.

Exemplo:

```java
private boolean textoInformado(String valor) {
    return valor != null && !valor.isBlank();
}
```

O código externo não precisa chamar isso.

Esse método existe para ajudar a própria classe.

Outro exemplo:

```java
private boolean valorInvalido(BigDecimal valor) {
    return valor == null || valor.compareTo(BigDecimal.ZERO) <= 0;
}
```

Encapsulamento também é isso:

```text
expor o que importa;
esconder o detalhe interno.
```

---

## API pública da classe

API pública é o conjunto de métodos que outros códigos podem usar.

Mesmo quando os métodos não estão marcados como `public` nos nossos exemplos por estarem no mesmo arquivo e pacote, pense neles como a “interface de uso” da classe.

Exemplo de boa API de `ContaBancaria`:

```text
numero();
titular();
saldo();
depositar(valor);
sacar(valor);
saldoSuficiente(valor);
resumo();
```

Exemplo de API ruim:

```text
setNumero();
setTitular();
setSaldo();
setTudo();
alterarCampo();
processar();
```

Uma boa API pública deve expressar intenção.

---

## Encapsulamento reduz duplicação de regra

Sem encapsulamento, a regra se espalha:

```java
if (saldo.compareTo(valor) >= 0) {
    saldo = saldo.subtract(valor);
}
```

em vários lugares.

Com encapsulamento:

```java
conta.sacar(valor);
```

A regra fica em um lugar.

Se amanhã a regra mudar, você altera o método `sacar`.

Esse é um ganho enorme para manutenção.

---

## Encapsulamento facilita testes

Ainda vamos estudar testes automatizados mais adiante, mas já dá para perceber.

É mais fácil testar:

```java
conta.depositar(new BigDecimal("50.00"));
conta.sacar(new BigDecimal("30.00"));
```

do que testar vários lugares diferentes alterando saldo manualmente.

Objeto bem encapsulado tem comportamento claro para testar.

---

## Quando usar setter

Setter pode fazer sentido em alguns cenários, principalmente em objetos simples de transporte, frameworks ou telas.

Mas, no domínio, use com cuidado.

Antes de criar um setter, pergunte:

```text
essa alteração é realmente livre?
existe regra para essa mudança?
o nome setX expressa a intenção do domínio?
seria melhor um método como ativar, bloquear, cancelar, reagendar, aprovar?
```

Compare:

```java
cliente.setAtivo(false);
```

com:

```java
cliente.inativar("Solicitação do cliente");
```

O segundo diz muito mais.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar conta ruim e conta boa

Execute:

```text
ContaSemEncapsulamento.java
ContaEncapsulada.java
```

Explique:

```text
qual permite saldo inválido;
qual protege melhor o saldo;
qual tem métodos com intenção.
```

### Parte 2 — Testar saque inválido

Na conta encapsulada, teste:

```text
sacar valor negativo;
sacar valor maior que saldo;
depositar zero.
```

Observe quais operações lançam erro e quais retornam `false`.

### Parte 3 — Testar OS

Execute:

```text
OrdemServicoEncapsulada.java
```

Teste:

```text
reagendar OS concluída;
cancelar OS concluída;
concluir OS cancelada.
```

Observe as exceções.

### Parte 4 — Testar pagamento

Execute:

```text
PagamentoEncapsulado.java
```

Teste:

```text
confirmar antes de aprovar;
cancelar depois de confirmar;
aprovar duas vezes.
```

### Parte 5 — Remover setters mentais

Pegue uma classe sua anterior e responda:

```text
quais setters eu criaria automaticamente?
quais deles deveriam virar métodos de domínio?
```

---

## Desafio prático

Crie o arquivo:

```text
ProdutoEncapsulado.java
```

Modele uma classe `Produto`.

Atributos:

```text
codigo;
nome;
preco;
estoque;
ativo.
```

Use:

```java
import java.math.BigDecimal;
```

Regras:

```text
codigo obrigatório;
nome obrigatório;
preço maior que zero;
estoque inicial não pode ser negativo;
produto começa ativo;
produto inativo não pode receber venda;
venda reduz estoque;
venda só acontece se houver estoque suficiente;
reposição aumenta estoque;
quantidade de venda e reposição precisa ser maior que zero.
```

Métodos sugeridos:

```text
vender(int quantidade);
reporEstoque(int quantidade);
inativar(String motivo);
ativar();
disponivelParaVenda();
valorTotalEmEstoque();
resumo();
```

Não crie:

```text
setEstoque;
setAtivo;
setPreco sem regra;
```

Faça o objeto controlar as mudanças.

---

## Erros comuns

### 1. Achar que private + getter/setter resolve tudo

Isso é só o começo. Encapsulamento de verdade protege regra.

### 2. Criar setter para todos os atributos

Setter automático pode quebrar o domínio.

### 3. Expor atributo mutável sem controle

Estado que muda precisa de método com intenção.

### 4. Colocar regra fora do objeto quando ela pertence ao objeto

Isso espalha lógica e dificulta manutenção.

### 5. Colocar infraestrutura dentro do objeto

Encapsulamento não significa que o objeto deve salvar banco ou chamar API.

### 6. Usar método genérico demais

`alterarStatus` pode ser menos claro que `concluir`, `cancelar`, `reagendar`.

### 7. Permitir transição inválida

Status não deve mudar para qualquer valor em qualquer momento.

### 8. Esconder erro silenciosamente

Se uma operação é inválida, retorne algo claro ou lance exceção quando fizer sentido.

---

## Debug recomendado

Use debug em:

```text
ContaEncapsulada.java
OrdemServicoEncapsulada.java
PagamentoEncapsulado.java
```

Coloque breakpoint em:

```java
conta.depositar(...)
conta.sacar(...)
os.reagendar(...)
os.concluir()
pagamento.aprovar()
pagamento.confirmar()
```

Entre nos métodos e observe:

```text
estado antes da operação;
validações;
mudança controlada dos atributos;
estado depois da operação;
exceções quando a regra é violada.
```

No exemplo da OS, observe que `reagendar` muda três atributos relacionados:

```text
dataAgendamento;
quantidadeReagendamentos;
status.
```

Esse é um ótimo exemplo de encapsulamento evitando inconsistência.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que setter para tudo é perigoso?
2. Qual método de domínio substitui um setStatus?
3. Qual regra você protegeu dentro de um objeto?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar encapsulamento;
identificar atributo público perigoso;
explicar por que private não basta sozinho;
evitar setter automático;
criar operações com intenção;
proteger alteração de estado;
validar transições;
usar atributos final quando não devem mudar;
usar atributos mutáveis com controle;
usar métodos privados para detalhes internos;
centralizar regras no objeto;
evitar objeto inconsistente;
debugar mudanças de estado;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-111-encapsulamento-de-verdade
git commit -m "Aula 111: pratica encapsulamento de verdade"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
encapsulamento de verdade não é esconder atributo por esconder; é proteger o estado e expor operações corretas.
```

Objeto bem encapsulado não deixa o sistema alterar tudo de qualquer jeito.

Ele oferece métodos com intenção:

```text
depositar;
sacar;
reagendar;
concluir;
cancelar;
aprovar;
confirmar.
```

Na próxima aula, vamos aprofundar getters e setters com critério.

Vamos entender quando eles fazem sentido, quando prejudicam o modelo e como evitar transformar objetos em simples estruturas de dados.
