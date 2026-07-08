# 120 — M4.16 — toString com critério

## Objetivo da aula

Nesta aula você vai aprender a usar `toString` com critério em Java.

Na aula anterior, você estudou `equals` e `hashCode`, entendendo como objetos podem ser comparados por valor ou por identidade. Agora vamos estudar outro método herdado de `Object`:

```java
toString()
```

O método `toString` transforma um objeto em uma representação textual.

Ao final da aula, você deve conseguir:

```text
explicar o que é toString;
entender o toString padrão do Java;
sobrescrever toString com @Override;
usar toString para debug e leitura;
evitar colocar regra de negócio dentro do toString;
evitar expor dados sensíveis;
diferenciar toString de resumo de domínio;
usar toString em objeto de valor;
usar toString em entidade;
entender como record gera toString automaticamente;
criar representações textuais úteis e seguras.
```

Essa aula é importante porque `toString` aparece em muitos lugares:

```text
System.out.println(objeto);
logs;
debug;
testes;
mensagens de erro;
coleções;
IDE;
análise de objetos em memória.
```

Um `toString` ruim atrapalha leitura e pode vazar informação sensível.  
Um `toString` bom ajuda muito no debug.

---

## A ideia central

Todo objeto em Java possui um método `toString`.

Quando você faz:

```java
System.out.println(cliente);
```

o Java chama automaticamente:

```java
cliente.toString()
```

Se você não sobrescrever `toString`, o Java usa a implementação padrão herdada de `Object`.

Essa implementação padrão normalmente mostra algo parecido com:

```text
Cliente@5f184fc6
```

Isso geralmente não ajuda muito.

Por isso, em muitas classes, sobrescrevemos `toString` para mostrar informações úteis.

---

## Exemplo com toString padrão

Crie a pasta:

```powershell
mkdir labs\m4\aula-120-to-string-com-criterio
cd labs\m4\aula-120-to-string-com-criterio
```

Crie o arquivo:

```text
ToStringPadrao.java
```

Código:

```java
public class ToStringPadrao {
    public static void main(String[] args) {
        ClienteToStringPadrao cliente = new ClienteToStringPadrao(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        System.out.println(cliente);
        System.out.println(cliente.toString());
    }
}

class ClienteToStringPadrao {
    private final int id;
    private final String nome;
    private final String email;

    ClienteToStringPadrao(int id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}
```

Compile e execute:

```powershell
javac ToStringPadrao.java
java ToStringPadrao
```

Você verá algo parecido com:

```text
ClienteToStringPadrao@5f184fc6
ClienteToStringPadrao@5f184fc6
```

O valor depois do `@` pode mudar na sua máquina.

---

## O que significa Cliente@algumaCoisa

O `toString` padrão geralmente segue a ideia:

```text
nomeDaClasse@hashEmHexadecimal
```

Exemplo:

```text
ClienteToStringPadrao@5f184fc6
```

Isso mostra que existe um objeto, mas não mostra os dados dele.

Para debug de sistema real, isso é pouco útil.

Quando você está investigando um pedido, cliente, pagamento ou OS, normalmente quer ver algo como:

```text
Cliente{id=10, nome='Ana Silva', email='ana@email.com'}
```

Por isso sobrescrevemos `toString`.

---

## Sobrescrevendo toString

Crie:

```text
ToStringSobrescrito.java
```

Código:

```java
public class ToStringSobrescrito {
    public static void main(String[] args) {
        ClienteToStringSobrescrito cliente = new ClienteToStringSobrescrito(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        System.out.println(cliente);
        System.out.println(cliente.toString());
    }
}

class ClienteToStringSobrescrito {
    private final int id;
    private final String nome;
    private final String email;

    ClienteToStringSobrescrito(int id, String nome, String email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email.trim().toLowerCase();
    }

    @Override
    public String toString() {
        return "ClienteToStringSobrescrito{"
                + "id=" + id
                + ", nome='" + nome + '\''
                + ", email='" + email + '\''
                + '}';
    }
}
```

Compile e execute:

```powershell
javac ToStringSobrescrito.java
java ToStringSobrescrito
```

Agora a saída fica útil:

```text
ClienteToStringSobrescrito{id=10, nome='Ana Silva', email='ana@email.com'}
```

---

## Por que usar @Override

Sempre que você sobrescrever `toString`, use:

```java
@Override
```

Assim:

```java
@Override
public String toString() {
    return "...";
}
```

Isso ajuda o compilador a verificar se você realmente está sobrescrevendo um método herdado.

Se você errar a assinatura, o compilador avisa.

Assinatura correta:

```java
public String toString()
```

Assinaturas erradas:

```java
String toString()
public void toString()
public String tostring()
public String toString(String formato)
```

Essas não sobrescrevem corretamente o `toString` de `Object`.

---

## toString não deve ser regra de negócio

`toString` deve representar o objeto em texto para leitura técnica.

Ele não deve ser usado como regra central do sistema.

Exemplo ruim:

```java
if (pedido.toString().contains("APROVADO")) {
    enviarPedido();
}
```

Isso é perigoso.

Se o texto do `toString` mudar, a regra quebra.

Melhor:

```java
if (pedido.aprovado()) {
    enviarPedido();
}
```

`toString` é para representação textual.

Regra de negócio deve ficar em métodos próprios.

---

## toString não é resumo de domínio obrigatório

Às vezes você terá dois métodos:

```java
toString()
resumo()
```

Eles podem parecer parecidos, mas têm propósitos diferentes.

### toString

Uso técnico:

```text
debug;
log;
inspeção;
desenvolvimento.
```

### resumo

Uso de domínio ou apresentação simples:

```text
mensagem para usuário;
resumo de tela;
texto de relatório;
saída amigável.
```

Exemplo:

```java
@Override
public String toString() {
    return "Pedido{id=1001, status=PAGO, total=R$ 399.80}";
}

String resumo() {
    return "Pedido 1001 - PAGO - Total R$ 399.80";
}
```

Não existe regra absoluta, mas é bom separar intenção.

---

## toString em objeto de valor

Objetos de valor costumam ter `toString` simples.

Exemplo: e-mail.

Crie:

```text
ToStringObjetoValor.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class ToStringObjetoValor {
    public static void main(String[] args) {
        EmailToStringValor email = new EmailToStringValor("Ana@Email.com");
        DinheiroToStringValor dinheiro = new DinheiroToStringValor(new BigDecimal("199.9"));

        System.out.println(email);
        System.out.println(dinheiro);

        System.out.println("Texto do e-mail: " + email);
        System.out.println("Texto do dinheiro: " + dinheiro);
    }
}

class EmailToStringValor {
    private final String valor;

    EmailToStringValor(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = valor.trim().toLowerCase();
    }

    String valor() {
        return valor;
    }

    @Override
    public String toString() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        EmailToStringValor email = (EmailToStringValor) outro;
        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
}

class DinheiroToStringValor {
    private final BigDecimal valor;

    DinheiroToStringValor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    BigDecimal valor() {
        return valor;
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }

        DinheiroToStringValor dinheiro = (DinheiroToStringValor) outro;
        return Objects.equals(valor, dinheiro.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
}
```

Compile e execute:

```powershell
javac ToStringObjetoValor.java
java ToStringObjetoValor
```

---

## Análise do objeto de valor

Para `EmailToStringValor`, faz sentido o `toString` retornar:

```java
return valor;
```

Porque o e-mail é praticamente representado pelo seu valor textual.

Para `DinheiroToStringValor`, faz sentido retornar:

```java
return "R$ " + valor;
```

Porque isso representa o valor monetário de forma legível.

Em objetos de valor pequenos, `toString` pode ser bem direto.

Mas cuidado: se o valor for sensível, não exponha tudo.

---

## Cuidado com dados sensíveis

Nem todo dado deve aparecer no `toString`.

Evite expor:

```text
senha;
token;
chave secreta;
documento completo;
cartão completo;
dados bancários;
dados pessoais sensíveis;
conteúdo sigiloso;
payload completo de integração;
cookies;
authorization header.
```

Exemplo ruim:

```java
@Override
public String toString() {
    return "Usuario{email='" + email + "', senha='" + senha + "'}";
}
```

Isso pode vazar senha em log.

Melhor:

```java
@Override
public String toString() {
    return "Usuario{email='" + email + "', senha='***'}";
}
```

Ou nem incluir senha.

Em backend, `toString` muitas vezes aparece em log.  
Log pode ir para arquivo, ferramenta externa, monitoramento ou suporte.

Por isso, cuidado.

---

## Exemplo com dado sensível

Crie:

```text
ToStringDadoSensivel.java
```

Código:

```java
public class ToStringDadoSensivel {
    public static void main(String[] args) {
        UsuarioToString usuario = new UsuarioToString(
                10,
                "ana@email.com",
                "SenhaMuitoSecreta123"
        );

        System.out.println(usuario);
    }
}

class UsuarioToString {
    private final int id;
    private final String email;
    private final String senha;

    UsuarioToString(int id, String email, String senha) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        if (senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória.");
        }

        this.id = id;
        this.email = email.trim().toLowerCase();
        this.senha = senha;
    }

    @Override
    public String toString() {
        return "UsuarioToString{"
                + "id=" + id
                + ", email='" + email + '\''
                + ", senha='***'"
                + '}';
    }
}
```

Compile e execute:

```powershell
javac ToStringDadoSensivel.java
java ToStringDadoSensivel
```

A senha existe no objeto, mas não aparece no texto.

Isso é critério.

---

## Mascarando documento

Outro exemplo comum é documento.

Crie:

```text
ToStringDocumentoMascarado.java
```

Código:

```java
public class ToStringDocumentoMascarado {
    public static void main(String[] args) {
        ClienteDocumentoToString cliente = new ClienteDocumentoToString(
                10,
                "Ana Silva",
                "12345678901"
        );

        System.out.println(cliente);
    }
}

class ClienteDocumentoToString {
    private final int id;
    private final String nome;
    private final String cpf;

    ClienteDocumentoToString(int id, String nome, String cpf) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (cpf == null || cpf.isBlank() || cpf.length() != 11) {
            throw new IllegalArgumentException("CPF inválido para este exemplo.");
        }

        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
    }

    @Override
    public String toString() {
        return "ClienteDocumentoToString{"
                + "id=" + id
                + ", nome='" + nome + '\''
                + ", cpf='" + cpfMascarado() + '\''
                + '}';
    }

    private String cpfMascarado() {
        return "***.***.***-" + cpf.substring(9);
    }
}
```

Compile e execute:

```powershell
javac ToStringDocumentoMascarado.java
java ToStringDocumentoMascarado
```

Saída esperada:

```text
ClienteDocumentoToString{id=10, nome='Ana Silva', cpf='***.***.***-01'}
```

Isso é muito melhor do que expor o CPF completo.

---

## toString em entidade

Entidade costuma ter `toString` com identidade e estado principal.

Não precisa colocar tudo.

Exemplo:

```text
Pedido{id=1001, status=PAGO, total=R$ 399.80}
```

Não precisa mostrar todos os detalhes do cliente, itens, pagamento, endereço e histórico.

Quanto mais coisa você coloca, mais pesado e perigoso fica.

Crie:

```text
ToStringEntidadePedido.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ToStringEntidadePedido {
    public static void main(String[] args) {
        PedidoToString pedido = new PedidoToString(
                1001,
                "Ana Silva",
                new DinheiroPedidoToString(new BigDecimal("399.80")),
                StatusPedidoToString.CRIADO
        );

        System.out.println(pedido);

        pedido.confirmarPagamento();

        System.out.println(pedido);
        System.out.println(pedido.resumo());
    }
}

enum StatusPedidoToString {
    CRIADO,
    PAGO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}

class PedidoToString {
    private final int numero;
    private final String cliente;
    private final DinheiroPedidoToString total;
    private StatusPedidoToString status;

    PedidoToString(int numero, String cliente, DinheiroPedidoToString total, StatusPedidoToString status) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número do pedido deve ser maior que zero.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (total == null || !total.positivo()) {
            throw new IllegalArgumentException("Total deve ser positivo.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.total = total;
        this.status = status;
    }

    void confirmarPagamento() {
        if (status != StatusPedidoToString.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode ser pago.");
        }

        status = StatusPedidoToString.PAGO;
    }

    String resumo() {
        return "Pedido " + numero
                + " do cliente " + cliente
                + " está " + status
                + " com total " + total;
    }

    @Override
    public String toString() {
        return "PedidoToString{"
                + "numero=" + numero
                + ", status=" + status
                + ", total=" + total
                + '}';
    }
}

class DinheiroPedidoToString {
    private final BigDecimal valor;

    DinheiroPedidoToString(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac ToStringEntidadePedido.java
java ToStringEntidadePedido
```

---

## Por que o toString do pedido não mostrou tudo

O pedido possui cliente, total e status.

Mesmo assim, o `toString` mostrou apenas:

```text
numero;
status;
total.
```

Isso foi uma decisão.

Para debug técnico, geralmente a identidade e o estado principal já ajudam bastante.

O nome do cliente foi deixado para o método:

```java
resumo()
```

Essa separação evita que `toString` vire um relatório completo.

Regra prática:

```text
toString deve ser útil, mas não precisa ser enorme.
```

---

## toString em composição

Quando um objeto composto chama `toString` de objetos internos, é preciso cuidado.

Exemplo:

```java
return "Pedido{cliente=" + cliente + ", pagamento=" + pagamento + "}";
```

Isso chama:

```java
cliente.toString()
pagamento.toString()
```

Se esses métodos forem grandes ou vazarem dados, o `Pedido.toString` também fica problemático.

Por isso, antes de incluir objetos compostos no `toString`, pense:

```text
o objeto interno tem toString seguro?
o texto ficará grande demais?
existe risco de expor dado sensível?
há referência circular?
```

Referência circular acontece quando um objeto aponta para outro e o outro aponta de volta.

Exemplo conceitual:

```text
Pedido tem Cliente.
Cliente tem lista de Pedidos.
```

Se ambos chamarem `toString` um do outro, pode virar recursão infinita.

Esse ponto será aprofundado quando estudarmos coleções e relacionamentos mais complexos.

---

## Exemplo com composição controlada

Crie:

```text
ToStringComposicaoControlada.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ToStringComposicaoControlada {
    public static void main(String[] args) {
        ClienteComposicaoToString cliente = new ClienteComposicaoToString(
                10,
                "Ana Silva",
                "ana@email.com"
        );

        PagamentoComposicaoToString pagamento = new PagamentoComposicaoToString(
                "PAG-001",
                new DinheiroComposicaoToString(new BigDecimal("399.80")),
                StatusPagamentoComposicaoToString.APROVADO
        );

        PedidoComposicaoToString pedido = new PedidoComposicaoToString(
                1001,
                cliente,
                pagamento
        );

        System.out.println(pedido);
    }
}

enum StatusPagamentoComposicaoToString {
    PENDENTE,
    APROVADO,
    CONFIRMADO,
    CANCELADO
}

class PedidoComposicaoToString {
    private final int numero;
    private final ClienteComposicaoToString cliente;
    private final PagamentoComposicaoToString pagamento;

    PedidoComposicaoToString(
            int numero,
            ClienteComposicaoToString cliente,
            PagamentoComposicaoToString pagamento
    ) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número deve ser maior que zero.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (pagamento == null) {
            throw new IllegalArgumentException("Pagamento é obrigatório.");
        }

        this.numero = numero;
        this.cliente = cliente;
        this.pagamento = pagamento;
    }

    @Override
    public String toString() {
        return "PedidoComposicaoToString{"
                + "numero=" + numero
                + ", clienteId=" + cliente.id()
                + ", pagamento=" + pagamento
                + '}';
    }
}

class ClienteComposicaoToString {
    private final int id;
    private final String nome;
    private final String email;

    ClienteComposicaoToString(int id, String nome, String email) {
        if (id <= 0) {
            throw new IllegalArgumentException("Id deve ser maior que zero.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.id = id;
        this.nome = nome;
        this.email = email.trim().toLowerCase();
    }

    int id() {
        return id;
    }

    @Override
    public String toString() {
        return "ClienteComposicaoToString{"
                + "id=" + id
                + ", nome='" + nome + '\''
                + '}';
    }
}

class PagamentoComposicaoToString {
    private final String codigo;
    private final DinheiroComposicaoToString valor;
    private final StatusPagamentoComposicaoToString status;

    PagamentoComposicaoToString(
            String codigo,
            DinheiroComposicaoToString valor,
            StatusPagamentoComposicaoToString status
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || !valor.positivo()) {
            throw new IllegalArgumentException("Valor deve ser positivo.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.valor = valor;
        this.status = status;
    }

    @Override
    public String toString() {
        return "Pagamento{"
                + "codigo='" + codigo + '\''
                + ", valor=" + valor
                + ", status=" + status
                + '}';
    }
}

class DinheiroComposicaoToString {
    private final BigDecimal valor;

    DinheiroComposicaoToString(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    boolean positivo() {
        return valor.compareTo(BigDecimal.ZERO) > 0;
    }

    @Override
    public String toString() {
        return "R$ " + valor;
    }
}
```

Compile e execute:

```powershell
javac ToStringComposicaoControlada.java
java ToStringComposicaoControlada
```

---

## O que esse exemplo ensina

No `PedidoComposicaoToString`, não imprimimos o cliente inteiro.

Usamos:

```java
clienteId=" + cliente.id()
```

Isso evita mostrar dados demais.

Já o pagamento foi incluído porque seu `toString` é curto e seguro.

Essa decisão depende do contexto.

O importante é não fazer no automático.

---

## toString em listas e coleções

Quando você imprime uma coleção, o Java chama `toString` dos elementos.

Exemplo:

```java
System.out.println(listaDeClientes);
```

Se os elementos tiverem `toString` ruim, a coleção também ficará ruim.

Crie:

```text
ToStringColecao.java
```

Código:

```java
import java.util.ArrayList;
import java.util.List;

public class ToStringColecao {
    public static void main(String[] args) {
        List<ProdutoColecaoToString> produtos = new ArrayList<>();

        produtos.add(new ProdutoColecaoToString("PROD-001", "Cadeira"));
        produtos.add(new ProdutoColecaoToString("PROD-002", "Mesa"));
        produtos.add(new ProdutoColecaoToString("PROD-003", "Armário"));

        System.out.println(produtos);
    }
}

class ProdutoColecaoToString {
    private final String codigo;
    private final String nome;

    ProdutoColecaoToString(String codigo, String nome) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.codigo = codigo;
        this.nome = nome;
    }

    @Override
    public String toString() {
        return "Produto{codigo='" + codigo + "', nome='" + nome + "'}";
    }
}
```

Compile e execute:

```powershell
javac ToStringColecao.java
java ToStringColecao
```

A saída da lista usa o `toString` de cada produto.

Isso será ainda mais importante quando estudarmos coleções em profundidade.

---

## record e toString

`record` gera `toString` automaticamente.

Crie:

```text
RecordToString.java
```

Código:

```java
import java.time.LocalDate;

public class RecordToString {
    public static void main(String[] args) {
        PeriodoRecordToString periodo = new PeriodoRecordToString(
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        System.out.println(periodo);
    }
}

record PeriodoRecordToString(LocalDate inicio, LocalDate fim) {
    PeriodoRecordToString {
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
}
```

Compile e execute:

```powershell
javac RecordToString.java
java RecordToString
```

Saída parecida com:

```text
PeriodoRecordToString[inicio=2026-01-01, fim=2026-12-31]
```

Para objetos de valor simples, isso pode ser excelente.

Mas lembre:

```text
record inclui todos os componentes no toString.
```

Se algum componente for sensível, pense antes de usar record diretamente ou sobrescreva `toString`.

---

## Gerando toString na IDE

O IntelliJ consegue gerar `toString`.

Caminho comum:

```text
Botão direito dentro da classe
Generate
toString
selecionar campos
confirmar
```

Ou atalho:

```text
Alt + Insert no Windows/Linux
```

Isso ajuda bastante.

Mas você não deve aceitar tudo no automático.

Antes de gerar, pergunte:

```text
quais campos são úteis?
quais campos são sensíveis?
o texto ficará grande demais?
algum campo pode gerar recursão?
algum campo é detalhe interno?
```

Ferramenta gera código.

Critério é seu.

---

## Formato do toString

Não existe um único formato obrigatório.

Você verá formatos como:

```text
Cliente{id=10, nome='Ana'}
Cliente(id=10, nome=Ana)
Cliente[ id=10, nome=Ana ]
Cliente: 10 - Ana
```

O importante é que seja:

```text
legível;
consistente;
útil;
seguro;
curto o suficiente.
```

Nesta formação, vamos usar bastante o formato:

```java
Classe{
    campo=valor
}
```

Em uma linha:

```text
Cliente{id=10, nome='Ana'}
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — toString padrão

Execute:

```text
ToStringPadrao.java
```

Explique:

```text
por que a saída não mostra os dados do cliente;
o que significa o formato Classe@hash.
```

### Parte 2 — toString sobrescrito

Execute:

```text
ToStringSobrescrito.java
```

Explique:

```text
por que System.out.println(cliente) chama toString;
por que @Override é importante.
```

### Parte 3 — Objetos de valor

Execute:

```text
ToStringObjetoValor.java
```

Observe:

```text
EmailToStringValor;
DinheiroToStringValor.
```

Explique por que o `toString` deles pode ser mais direto.

### Parte 4 — Dados sensíveis

Execute:

```text
ToStringDadoSensivel.java
ToStringDocumentoMascarado.java
```

Explique:

```text
por que senha não deve aparecer;
por que CPF foi mascarado.
```

### Parte 5 — Entidade e composição

Execute:

```text
ToStringEntidadePedido.java
ToStringComposicaoControlada.java
```

Explique:

```text
por que o pedido não precisa mostrar tudo;
por que o cliente foi representado pelo id no objeto composto.
```

### Parte 6 — Coleção e record

Execute:

```text
ToStringColecao.java
RecordToString.java
```

Observe como coleções e records usam `toString`.

---

## Desafio prático

Crie o arquivo:

```text
ToStringOrdemServico.java
```

Modele:

```text
CodigoOsToString;
ClienteOsToString;
PeriodoOsToString;
OrdemServicoToString;
```

Use:

```java
LocalDate;
enum StatusOsToString;
enum TurnoOsToString.
```

Regras:

```text
Código da OS deve iniciar com OS-.
Cliente deve ter id, nome e telefone.
Telefone deve ser mascarado parcialmente no toString.
Período deve ter data e turno.
OS deve ter código, cliente, período e status.
```

Implemente `toString` com critério:

```text
CodigoOsToString pode mostrar o código.
ClienteOsToString deve mostrar id e nome, mas mascarar telefone.
PeriodoOsToString pode mostrar data e turno.
OrdemServicoToString deve mostrar código, cliente id, período e status.
```

Também crie um método:

```text
resumo()
```

em `OrdemServicoToString`, com uma mensagem mais amigável.

No `main`, imprima:

```java
System.out.println(os);
System.out.println(os.resumo());
```

Compare a diferença entre `toString` e `resumo`.

---

## Erros comuns

### 1. Não sobrescrever toString

A saída padrão geralmente não ajuda no debug.

### 2. Colocar senha no toString

Isso pode vazar dado sensível em log.

### 3. Colocar regra de negócio no toString

Regra deve ficar em método próprio.

### 4. Fazer toString enorme

Se o texto vira relatório completo, provavelmente está exagerado.

### 5. Incluir objetos compostos sem critério

Pode vazar dados, ficar grande demais ou causar recursão.

### 6. Confundir toString com resumo para usuário

Às vezes vale ter os dois métodos.

### 7. Não usar @Override

Você pode errar a assinatura sem perceber.

### 8. Usar record sem lembrar do toString automático

Record mostra todos os componentes por padrão.

---

## Debug recomendado

Use debug em:

```text
ToStringSobrescrito.java
ToStringEntidadePedido.java
ToStringComposicaoControlada.java
ToStringColecao.java
```

Coloque breakpoints em:

```java
System.out.println(cliente);
System.out.println(pedido);
System.out.println(produtos);
```

Entre nos métodos:

```text
toString;
resumo.
```

Observe:

```text
quando o Java chama toString automaticamente;
quais campos são usados;
quais campos foram omitidos;
como objetos compostos aparecem no texto;
como coleções usam toString dos elementos.
```

No exemplo de composição, observe que:

```java
pedido.toString()
```

chama:

```text
pagamento.toString()
dinheiro.toString()
```

mas não expõe o cliente completo.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve toString?
2. Por que não devemos colocar senha no toString?
3. Qual diferença entre toString e resumo?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar toString;
entender o toString padrão;
sobrescrever toString com @Override;
usar toString para debug;
evitar regra de negócio no toString;
evitar dados sensíveis;
mascarar dados quando necessário;
criar toString em objeto de valor;
criar toString em entidade;
usar toString com composição sem exagero;
entender toString automático de record;
entender toString em coleções;
resolver o desafio ToStringOrdemServico;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m4/aula-120-to-string-com-criterio
git commit -m "Aula 120: pratica toString com criterio"
git status
```

Se aparecer arquivo `.class`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
toString deve ajudar a entender o objeto sem vazar informação e sem virar regra de negócio.
```

Você viu que `toString` é chamado automaticamente em muitos contextos, inclusive no `System.out.println`.

Também viu que objetos de valor, entidades, objetos compostos, coleções e records podem se beneficiar de uma boa representação textual.

Mas sempre com critério:

```text
mostrar o que ajuda;
omitir o que é sensível;
evitar textos enormes;
não usar toString como regra.
```

Na próxima aula, vamos estudar `static` com critério.

Vamos entender o que pertence ao objeto, o que pertence à classe, quando usar membros estáticos e por que `static` usado sem cuidado pode deixar o código acoplado e difícil de testar.
