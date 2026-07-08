# 108 — M4.04 — Atributos com significado

## Objetivo da aula

Nesta aula você vai aprender a escolher atributos melhores para uma classe.

Na aula anterior, vimos que uma classe representa um conceito e que um objeto possui estado e comportamento. Agora vamos aprofundar a parte do **estado**.

Estado não é simplesmente “colocar variáveis dentro da classe”.

Um bom atributo precisa ter significado.

Ao final da aula, você deve conseguir:

```text
escolher atributos que representam o domínio;
evitar atributos genéricos;
evitar estado desnecessário;
diferenciar dado armazenado de dado calculado;
usar tipos adequados;
dar nomes claros;
identificar dados obrigatórios;
começar a pensar em invariantes.
```

Essa aula é importante porque atributos ruins deixam qualquer classe difícil de entender, mesmo quando os métodos parecem corretos.

---

## A ideia central

Um atributo representa uma informação que pertence ao objeto.

Exemplo:

```java
class Cliente {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;
}
```

Esses atributos fazem sentido porque ajudam a responder perguntas sobre o cliente:

```text
quem é o cliente?
como entrar em contato?
ele está ativo?
pode receber mensagem?
```

Agora veja este exemplo ruim:

```java
class Cliente {
    private final String texto1;
    private final String texto2;
    private final String texto3;
    private final boolean flag;
}
```

O código até compila, mas não comunica domínio.

Atributo bom não é só dado.  
Atributo bom ajuda o código a contar a história do problema.

---

## Atributo precisa responder: “isso pertence a esse objeto?”

Antes de colocar um atributo em uma classe, pergunte:

```text
essa informação pertence mesmo a esse objeto?
essa informação ajuda a representar o estado dele?
essa informação é necessária para alguma regra?
essa informação precisa ser armazenada ou pode ser calculada?
o nome deixa claro o significado?
```

Exemplo com Ordem de Serviço:

```java
class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;
}
```

Esses atributos fazem sentido porque descrevem a OS.

Agora veja um atributo suspeito:

```java
private final boolean atrasada;
```

Será que `atrasada` precisa ser atributo?

Talvez não.

Se a OS já tem `dataAbertura`, a informação “atrasada” pode ser calculada:

```java
boolean atrasada(LocalDate dataReferencia) {
    return diasEmAberto(dataReferencia) > 3;
}
```

Esse é um ponto importante da aula:

```text
nem toda informação precisa ser armazenada como atributo.
```

---

## Dado armazenado versus dado calculado

Um erro comum é armazenar tudo.

Exemplo ruim:

```java
class Pedido {
    private final BigDecimal precoUnitario;
    private final int quantidade;
    private final BigDecimal totalBruto;
}
```

Se `totalBruto` é sempre:

```text
precoUnitario * quantidade
```

então talvez ele não precise ser armazenado.

Ele pode ser calculado:

```java
BigDecimal totalBruto() {
    return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
}
```

Por que isso importa?

Porque armazenar dado calculado pode gerar inconsistência.

Imagine:

```text
precoUnitario = 100
quantidade = 2
totalBruto = 500
```

O objeto ficou incoerente.

Quando possível, prefira calcular dados derivados a partir do estado principal.

---

## Exemplo ruim: atributos sem significado

Crie a pasta:

```powershell
mkdir labs\m4\aula-108-atributos-com-significado
cd labs\m4\aula-108-atributos-com-significado
```

Crie o arquivo:

```text
ClienteAtributosRuins.java
```

Código:

```java
public class ClienteAtributosRuins {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Ana Silva",
                "ana@email.com",
                "11999999999",
                true
        );

        System.out.println(cliente.dado1());
        System.out.println(cliente.dado2());
        System.out.println(cliente.dado3());
        System.out.println(cliente.marcado());
    }
}

class Cliente {
    private final String dado1;
    private final String dado2;
    private final String dado3;
    private final boolean marcado;

    Cliente(String dado1, String dado2, String dado3, boolean marcado) {
        this.dado1 = dado1;
        this.dado2 = dado2;
        this.dado3 = dado3;
        this.marcado = marcado;
    }

    String dado1() {
        return dado1;
    }

    String dado2() {
        return dado2;
    }

    String dado3() {
        return dado3;
    }

    boolean marcado() {
        return marcado;
    }
}
```

Esse código funciona, mas é ruim.

Quem lê não sabe:

```text
dado1 é nome?
dado2 é email?
dado3 é telefone?
marcado significa ativo, bloqueado, selecionado ou verificado?
```

O problema não é técnico.  
O problema é semântico.

O código não comunica intenção.

---

## Exemplo melhor: atributos com nome de domínio

Agora crie:

```text
ClienteAtributosBons.java
```

Código:

```java
public class ClienteAtributosBons {
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

Agora os atributos contam uma história:

```text
nome identifica o cliente;
email e telefone representam contato;
ativo representa situação cadastral;
contatoCompleto e podeReceberMensagem são comportamentos baseados nesses atributos.
```

Esse é o tipo de clareza que queremos.

---

## Tipos também comunicam significado

Nome bom ajuda.  
Tipo bom também ajuda.

Exemplo fraco:

```java
private final String status;
```

Com `String`, qualquer coisa pode entrar:

```text
aberta;
Aberta;
ABERTO;
finalizada;
x;
123.
```

Melhor:

```java
private final StatusOs status;
```

Com enum:

```java
enum StatusOs {
    ABERTA,
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Agora o código limita os valores possíveis.

Isso é muito mais seguro.

Outro exemplo:

```java
private final String dataAbertura;
```

Melhor:

```java
private final LocalDate dataAbertura;
```

Se é data, use tipo de data.

Outro exemplo:

```java
private final double valor;
```

Para dinheiro, é melhor:

```java
private final BigDecimal valor;
```

Tipo adequado reduz erro e melhora leitura.

---

## Exemplo com OS usando tipos melhores

Crie:

```text
OrdemServicoAtributos.java
```

Código:

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoAtributos {
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
        System.out.println("Atrasada: " + os.atrasada(hoje));
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

Observe os atributos:

```java
private final StatusOs status;
private final LocalDate dataAbertura;
```

Eles dizem mais do que `String`.

O código fica mais expressivo e menos sujeito a valores inválidos.

---

## Estado mínimo

Uma classe deve guardar o que precisa para representar o objeto.

Não precisa guardar tudo que ela consegue calcular.

Exemplo ruim:

```java
class OrdemServico {
    private final LocalDate dataAbertura;
    private final long diasEmAberto;
    private final boolean atrasada;
}
```

Se `diasEmAberto` depende de `dataAbertura` e da data de hoje, guardar isso pode ser perigoso.

Amanhã, os dias em aberto mudam.

Então faz mais sentido calcular:

```java
long diasEmAberto(LocalDate dataReferencia)
```

e:

```java
boolean atrasada(LocalDate dataReferencia)
```

Estado mínimo ajuda o objeto a ficar coerente.

Regra prática:

```text
guarde o dado principal;
calcule o que for derivado.
```

---

## Atributos obrigatórios

Alguns atributos não fazem sentido vazios.

Exemplo:

```text
Cliente sem nome;
Pedido sem produto;
OS sem certificado;
Pagamento sem valor.
```

Nesta fase, ainda estamos aprendendo validação dentro de objetos. Mas já podemos pensar:

```text
quais atributos são obrigatórios para o objeto existir com sentido?
```

Exemplo:

```java
class Pagamento {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
}
```

Um pagamento sem valor não faz sentido.

Um pagamento sem forma talvez também não.

Essa ideia leva ao conceito de **invariante**.

---

## Primeira ideia de invariante

Invariante é uma regra que deve ser verdadeira para o objeto ser considerado válido.

Exemplo:

```text
Pagamento deve ter valor maior que zero.
OS deve ter certificado informado.
Pedido deve ter quantidade maior que zero.
Cliente deve ter nome informado.
```

Ainda vamos aprofundar esse tema.

Por enquanto, pense assim:

```text
invariante é uma regra básica que protege o significado do objeto.
```

Podemos começar com métodos:

```java
boolean valido()
```

ou, em aulas futuras, impedir a criação de objeto inválido diretamente no construtor.

---

## Exemplo com pagamento

Crie:

```text
PagamentoAtributos.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoAtributos {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento(
                "PAG-001",
                new BigDecimal("150.00"),
                FormaPagamento.PIX,
                true
        );

        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor: " + pagamento.valor());
        System.out.println("Forma: " + pagamento.formaPagamento());
        System.out.println("Aprovado: " + pagamento.aprovado());
        System.out.println("Valor válido: " + pagamento.valorValido());
        System.out.println("Pode confirmar: " + pagamento.podeConfirmar());
    }
}

enum FormaPagamento {
    PIX,
    CARTAO,
    BOLETO
}

class Pagamento {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private final boolean aprovado;

    Pagamento(
            String codigo,
            BigDecimal valor,
            FormaPagamento formaPagamento,
            boolean aprovado
    ) {
        this.codigo = codigo;
        this.valor = valor;
        this.formaPagamento = formaPagamento;
        this.aprovado = aprovado;
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

    boolean aprovado() {
        return aprovado;
    }

    boolean valorValido() {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    boolean podeConfirmar() {
        return textoInformado(codigo)
                && valorValido()
                && formaPagamento != null
                && aprovado;
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}
```

Aqui os atributos têm significado:

```text
codigo identifica o pagamento;
valor representa dinheiro;
formaPagamento limita as opções;
aprovado indica estado operacional.
```

O método `podeConfirmar` usa esses atributos para responder uma regra.

---

## Evite atributos booleanos sem clareza

Boolean é útil, mas pode gerar nomes ruins.

Exemplo ruim:

```java
private final boolean flag;
private final boolean ok;
private final boolean marcado;
private final boolean controle;
```

Melhor:

```java
private final boolean ativo;
private final boolean aprovado;
private final boolean bloqueado;
private final boolean cancelado;
private final boolean permiteMensagem;
```

O nome do boolean deve permitir leitura natural.

Exemplo bom:

```java
if (cliente.ativo()) {
}
```

```java
if (pagamento.aprovado()) {
}
```

```java
if (usuario.bloqueado()) {
}
```

Se o nome não deixa claro o que significa `true`, renomeie.

---

## Evite atributos genéricos

Evite:

```text
dados;
info;
valor1;
valor2;
tipo;
codigo;
descricao;
status;
flag.
```

Alguns desses nomes podem ser bons dependendo do contexto, mas muitas vezes são genéricos demais.

Exemplo:

```java
private final String codigo;
```

Código de quê?

Em uma classe `Pagamento`, `codigo` pode fazer sentido porque o contexto é claro.

Mas em uma classe muito genérica, talvez precise ser:

```java
codigoPagamento
codigoContrato
codigoProduto
codigoCliente
```

Nomes devem ser claros dentro do contexto da classe.

---

## Cuidado com classe inchada

Atributos demais podem indicar que a classe está fazendo coisa demais.

Exemplo suspeito:

```java
class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final String emailCliente;
    private final String telefoneCliente;
    private final String produto;
    private final BigDecimal valorProduto;
    private final String tecnico;
    private final String telefoneTecnico;
    private final String enderecoRua;
    private final String enderecoNumero;
    private final String enderecoCidade;
    private final String status;
    private final String pagamento;
}
```

Talvez existam conceitos escondidos:

```text
Cliente;
Produto;
Tecnico;
Endereco;
Pagamento;
OrdemServico.
```

Nesta fase, não precisa separar tudo ainda.

Mas comece a perceber quando uma classe está recebendo dados demais.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Comparar nomes ruins e bons

Execute:

```text
ClienteAtributosRuins.java
ClienteAtributosBons.java
```

Explique qual deles é mais fácil de entender e por quê.

### Parte 2 — Melhorar tipos

No exemplo de OS, imagine que `status` fosse `String`.

Responda:

```text
quais erros poderiam acontecer?
por que enum melhora?
```

### Parte 3 — Remover dado derivado

Crie uma versão ruim de `Pedido` com atributo `totalBruto`.

Depois refatore para calcular:

```java
totalBruto()
```

a partir de:

```text
precoUnitario;
quantidade.
```

### Parte 4 — Pensar em obrigatórios

Para cada classe, marque atributos obrigatórios:

```text
Cliente;
OrdemServico;
Pedido;
Pagamento.
```

### Parte 5 — Debug

Use debug no construtor de `Pagamento`.

Observe cada parâmetro sendo gravado em cada atributo com `this`.

---

## Desafio prático

Crie o arquivo:

```text
ProdutoAtributos.java
```

Modele uma classe `Produto`.

Atributos:

```text
codigo;
nome;
categoria;
preco;
ativo;
estoque;
```

Use enum:

```java
enum CategoriaProduto {
    MOVEL,
    ELETRODOMESTICO,
    DECORACAO,
    OUTRO
}
```

Comportamentos:

```text
precoValido();
temEstoque();
disponivelParaVenda();
```

Regras:

```text
preço precisa ser maior que zero;
estoque precisa ser maior que zero;
produto precisa estar ativo;
produto disponível para venda precisa estar ativo, ter preço válido e ter estoque.
```

Depois crie dois produtos:

```text
um produto disponível;
um produto sem estoque ou inativo.
```

Imprima os comportamentos dos dois.

---

## Erros comuns

### 1. Usar nomes genéricos

`valor1`, `texto2`, `flag` e `dados` não explicam domínio.

### 2. Guardar dado calculado sem necessidade

Se o valor pode ser derivado de outros atributos, talvez deva ser método.

### 3. Usar String para tudo

Status, data, dinheiro e categoria podem ter tipos melhores.

### 4. Criar atributo que não pertence ao objeto

Nem toda informação relacionada ao processo pertence à classe.

### 5. Esquecer dados obrigatórios

Objeto com atributos essenciais vazios perde significado.

### 6. Criar classe com atributos demais

Pode indicar responsabilidades misturadas.

### 7. Boolean mal nomeado

O nome deve deixar claro o significado de `true`.

---

## Debug recomendado

Use debug em:

```text
ClienteAtributosBons.java
OrdemServicoAtributos.java
PagamentoAtributos.java
```

Coloque breakpoint dentro do construtor.

Observe:

```text
parâmetros recebidos;
atributos sendo preenchidos;
this apontando para o objeto atual.
```

Depois entre nos métodos:

```text
contatoCompleto;
podeReceberMensagem;
atrasada;
filaSugerida;
valorValido;
podeConfirmar.
```

Observe como os métodos usam os atributos.

Esse debug ajuda a fixar a relação entre estado e comportamento.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual atributo você renomearia em um código ruim?
2. Qual dado você não armazenaria porque pode ser calculado?
3. Qual tipo melhora a segurança de um atributo?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o que é atributo;
escolher nomes com significado;
evitar atributos genéricos;
diferenciar dado armazenado de dado calculado;
usar enum para valores controlados;
usar LocalDate para data;
usar BigDecimal para dinheiro;
identificar atributos obrigatórios;
explicar a primeira ideia de invariante;
evitar boolean com nome ruim;
identificar classe com atributos demais;
criar uma classe com estado claro;
criar métodos que usam esse estado;
debugar construtor e métodos do objeto;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-108-atributos-com-significado
git commit -m "Aula 108: escolhe atributos com significado"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
atributo bom representa estado real do objeto e comunica significado do domínio.
```

Não coloque dados na classe apenas porque você pode.

Escolha atributos com intenção:

```text
nome claro;
tipo adequado;
pertencimento ao objeto;
necessidade real;
regra associada.
```

Na próxima aula, vamos aprofundar métodos com comportamento.

Vamos sair de métodos que apenas devolvem atributos e avançar para métodos que representam ações e perguntas importantes do domínio.
