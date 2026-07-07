# 076 — M2.15 — Enum profissional

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
072 — M2.11 — BigDecimal desde a base;
073 — M2.12 — Locale, NumberFormat e formatação;
074 — M2.13 — java.time básico;
075 — M2.14 — Timezone e Instant;
076 — M2.15 — Enum profissional.
```

Na aula anterior, estudamos `Instant`, `ZoneId`, timezone e auditoria temporal.

Agora vamos estudar um recurso essencial para modelar valores controlados:

```text
enum.
```

Enum aparece em praticamente todo backend corporativo:

```text
status de pedido;
status de pagamento;
status de OS;
tipo de cliente;
tipo de mensagem;
tipo de operação;
perfil de usuário;
origem de integração;
forma de pagamento;
prioridade;
categoria;
situação cadastral.
```

A aula é chamada de “Enum profissional” porque não vamos usar enum apenas como lista simples.

Vamos aprender a usar enum com:

```text
código;
descrição;
método;
validação;
fromCode;
substituição de strings mágicas;
switch;
leitura crítica.
```

---

## A pergunta central da aula

Observe este código:

```java
String status = "APROVADO";

if ("APROVADO".equals(status)) {
    System.out.println("Pedido aprovado.");
}
```

Parece ok.

Mas imagine isso espalhado em dezenas de classes:

```java
"APROVADO"
"Aprovado"
"aprovado"
"APROVADA"
"APPROVED"
"PENDENTE"
"Pendente"
"RECUSADO"
"CANCELADO"
```

Problemas:

```text
erro de digitação;
duplicação;
falta de padronização;
dificuldade de refatorar;
falta de autocomplete;
validação fraca;
strings mágicas;
regras espalhadas.
```

Com enum:

```java
StatusPedido status = StatusPedido.APROVADO;

if (status == StatusPedido.APROVADO) {
    System.out.println("Pedido aprovado.");
}
```

Agora temos:

```text
valor controlado;
autocomplete;
compilador ajudando;
menos erro de digitação;
mais clareza;
mais segurança.
```

---

## O que é enum

`enum` é um tipo especial do Java usado para representar um conjunto fixo de valores.

Exemplo:

```java
public enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Isso significa:

```text
StatusPedido só pode ser PENDENTE, APROVADO ou RECUSADO.
```

Não dá para criar qualquer status aleatório.

Você não faz:

```java
new StatusPedido()
```

Os valores possíveis já estão definidos no enum.

---

## Quando usar enum

Use enum quando há um conjunto limitado e conhecido de valores.

Exemplos:

```text
status de pedido;
status de pagamento;
tipo de mensagem;
prioridade;
perfil;
tipo de operação;
origem;
categoria controlada;
situação cadastral;
tipo de log;
tipo de auditoria;
turno;
dia da semana customizado;
fase de processo.
```

Evite enum quando:

```text
os valores vêm de cadastro dinâmico;
o usuário pode criar novos valores livremente;
a lista muda frequentemente sem deploy;
os valores são dados de banco configuráveis;
existe regra complexa que pertence a entidade externa.
```

Exemplo:

```text
status fixo de pedido -> enum pode ser bom;
lista de clientes corporativos -> não deve ser enum;
lista de produtos cadastráveis -> não deve ser enum.
```

---

## Strings mágicas

String mágica é uma string literal espalhada no código com significado de regra.

Exemplos:

```java
if ("APROVADO".equals(status)) {
}

if ("ENTREGA".equals(tipoMensagem)) {
}

if ("ADMIN".equals(perfil)) {
}
```

O problema não é usar String nunca.

O problema é usar String solta como regra controlada.

Enum resolve isso:

```java
if (status == StatusPedido.APROVADO) {
}
```

---

## Vocabulário essencial

Termos desta aula:

```text
enum;
constante;
valor controlado;
string mágica;
status;
código;
descrição;
atributo;
construtor;
método;
fromCode;
fromName;
valueOf;
values;
switch;
validação;
domínio;
legibilidade;
refatoração;
autocomplete;
compilador;
imutabilidade;
ordinal;
name;
toString.
```

Termos mais importantes:

```text
enum -> tipo com conjunto fixo de constantes;
constante -> valor definido dentro do enum;
string mágica -> texto literal usado como regra;
fromCode -> método para converter código externo em enum;
valueOf -> método nativo que converte nome exato em enum;
values -> método nativo que lista todas as constantes;
name -> nome da constante;
ordinal -> posição da constante, geralmente deve ser evitada em regra;
atributo -> dado associado à constante;
descrição -> texto legível para usuário;
código -> valor usado em integração, banco ou API.
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
        StatusPedido status = StatusPedido.APROVADO;

        if (status == StatusPedido.APROVADO) {
            System.out.println("Pedido aprovado.");
        }
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
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

Saída:

```text
Pedido aprovado.
```

Observação:

```text
para comparar enum, podemos usar ==.
```

Isso é seguro porque cada constante enum é única.

---

## Enum em arquivo separado

Em projeto real, o enum costuma ficar em arquivo separado.

Arquivo:

```text
StatusPedido.java
```

Código:

```java
public enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Arquivo:

```text
PedidoComEnum.java
```

Código:

```java
public class PedidoComEnum {
    public static void main(String[] args) {
        Pedido pedido = new Pedido();

        pedido.cliente = "Ana";
        pedido.status = StatusPedido.PENDENTE;

        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Status: " + pedido.status);
    }
}

class Pedido {
    String cliente;
    StatusPedido status;
}
```

Compile:

```powershell
javac StatusPedido.java PedidoComEnum.java
```

Execute:

```powershell
java PedidoComEnum
```

Saída:

```text
Cliente: Ana
Status: PENDENTE
```

---

## Enum com switch

Arquivo:

```text
SwitchEnum.java
```

Código:

```java
public class SwitchEnum {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.PENDENTE;

        String mensagem = mensagemDoStatus(status);

        System.out.println(mensagem);
    }

    public static String mensagemDoStatus(StatusPedido status) {
        switch (status) {
            case PENDENTE:
                return "Pedido aguardando análise.";
            case APROVADO:
                return "Pedido aprovado.";
            case RECUSADO:
                return "Pedido recusado.";
            default:
                return "Status desconhecido.";
        }
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Esse estilo funciona em versões antigas e modernas.

Na prática, enum combina muito bem com `switch`.

---

## Switch moderno com enum

Arquivo:

```text
SwitchModernoEnum.java
```

Código:

```java
public class SwitchModernoEnum {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.APROVADO;

        String mensagem = mensagemDoStatus(status);

        System.out.println(mensagem);
    }

    public static String mensagemDoStatus(StatusPedido status) {
        return switch (status) {
            case PENDENTE -> "Pedido aguardando análise.";
            case APROVADO -> "Pedido aprovado.";
            case RECUSADO -> "Pedido recusado.";
        };
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Vantagem:

```text
mais direto;
menos risco de esquecer break;
compilador pode ajudar com casos.
```

---

## Enum com atributos

Um enum pode ter atributos.

Exemplo:

```java
enum StatusPedido {
    PENDENTE("P", "Pendente"),
    APROVADO("A", "Aprovado"),
    RECUSADO("R", "Recusado");

    private final String codigo;
    private final String descricao;

    StatusPedido(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

Agora cada constante tem:

```text
código;
descrição.
```

Isso é muito usado em sistemas reais.

---

## Exemplo completo com atributos

Arquivo:

```text
EnumComAtributos.java
```

Código:

```java
public class EnumComAtributos {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.APROVADO;

        System.out.println("Nome: " + status.name());
        System.out.println("Código: " + status.getCodigo());
        System.out.println("Descrição: " + status.getDescricao());
    }
}

enum StatusPedido {
    PENDENTE("P", "Pendente"),
    APROVADO("A", "Aprovado"),
    RECUSADO("R", "Recusado");

    private final String codigo;
    private final String descricao;

    StatusPedido(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

Saída:

```text
Nome: APROVADO
Código: A
Descrição: Aprovado
```

---

## Construtor de enum

O construtor do enum não é chamado com `new` pelo código comum.

Ele é usado internamente quando as constantes são criadas.

Exemplo:

```java
PENDENTE("P", "Pendente")
```

chama:

```java
StatusPedido(String codigo, String descricao)
```

O construtor de enum não pode ser público.

Normalmente deixamos sem modificador ou `private`.

Exemplo:

```java
StatusPedido(String codigo, String descricao) {
}
```

ou:

```java
private StatusPedido(String codigo, String descricao) {
}
```

---

## Getters no enum

Como os atributos são privados, expomos getters:

```java
public String getCodigo() {
    return codigo;
}

public String getDescricao() {
    return descricao;
}
```

Atributos geralmente são `final`:

```java
private final String codigo;
private final String descricao;
```

Porque a constante do enum deve ser estável.

Regra:

```text
enum profissional costuma ter atributos finais e métodos de leitura.
```

---

## values

Todo enum tem um método automático:

```java
values()
```

Ele retorna todas as constantes.

Arquivo:

```text
EnumValues.java
```

Código:

```java
public class EnumValues {
    public static void main(String[] args) {
        for (StatusPedido status : StatusPedido.values()) {
            System.out.println(status);
        }
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Saída:

```text
PENDENTE
APROVADO
RECUSADO
```

Isso é útil para:

```text
listar opções;
validar código;
montar combo;
percorrer regras;
gerar documentação.
```

---

## valueOf

Todo enum tem:

```java
valueOf
```

Exemplo:

```java
StatusPedido status = StatusPedido.valueOf("APROVADO");
```

Arquivo:

```text
EnumValueOf.java
```

Código:

```java
public class EnumValueOf {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.valueOf("APROVADO");

        System.out.println(status);
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Funciona se o texto for exatamente o nome da constante.

Se passar:

```text
aprovado
Aprovado
APROVADA
```

vai lançar erro.

Por isso, em integração, muitas vezes criamos `fromCode`.

---

## Problema do valueOf direto

Arquivo:

```text
ErroValueOf.java
```

Código propositalmente problemático:

```java
public class ErroValueOf {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.valueOf("aprovado");

        System.out.println(status);
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Esse código compila.

Mas quebra em execução:

```text
IllegalArgumentException
```

Porque `valueOf` exige nome exato.

Em entrada externa, use validação.

---

## fromCode

`fromCode` é um método criado por nós para converter código externo em enum.

Exemplo:

```text
P -> PENDENTE
A -> APROVADO
R -> RECUSADO
```

Arquivo:

```text
EnumFromCode.java
```

Código:

```java
public class EnumFromCode {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.fromCode("A");

        System.out.println(status);
        System.out.println(status.getDescricao());
    }
}

enum StatusPedido {
    PENDENTE("P", "Pendente"),
    APROVADO("A", "Aprovado"),
    RECUSADO("R", "Recusado");

    private final String codigo;
    private final String descricao;

    StatusPedido(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusPedido fromCode(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do status é obrigatório.");
        }

        for (StatusPedido status : StatusPedido.values()) {
            if (status.codigo.equalsIgnoreCase(codigo.trim())) {
                return status;
            }
        }

        throw new IllegalArgumentException("Código de status inválido: " + codigo);
    }
}
```

Esse padrão é muito usado.

---

## fromCode retornando null

Também poderíamos fazer:

```java
return null;
```

quando não encontra.

Mas isso exige validação no chamador e pode gerar NPE depois.

Exemplo:

```java
StatusPedido status = StatusPedido.fromCode("X");
```

Se retornar null, alguém pode fazer:

```java
status.getDescricao()
```

e quebrar.

Para campo obrigatório, é melhor lançar erro claro.

Para busca opcional, veremos no futuro como usar `Optional` de forma mais madura.

Nesta aula, o padrão recomendado para obrigatório é:

```text
fromCode lança IllegalArgumentException quando inválido.
```

---

## fromCode tolerante com espaços

Entrada externa pode vir assim:

```text
" A "
"a"
"A"
```

Por isso usamos:

```java
codigo.trim()
equalsIgnoreCase
```

Mas cuidado:

```text
tolerância deve seguir regra.
```

Se o código externo é case-sensitive, não use `equalsIgnoreCase`.

---

## Enum com comportamento

Enum pode ter métodos de comportamento.

Exemplo:

```java
public boolean permiteCancelamento() {
    return this == PENDENTE || this == APROVADO;
}
```

Arquivo:

```text
EnumComComportamento.java
```

Código:

```java
public class EnumComComportamento {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.PENDENTE;

        System.out.println("Permite cancelar? " + status.permiteCancelamento());
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO,
    CANCELADO;

    public boolean permiteCancelamento() {
        return this == PENDENTE || this == APROVADO;
    }
}
```

Isso coloca regra perto do valor.

Mas não coloque regras enormes dentro de enum.

Use com equilíbrio.

---

## Enum com status final

Arquivo:

```text
EnumStatusFinal.java
```

Código:

```java
public class EnumStatusFinal {
    public static void main(String[] args) {
        System.out.println(StatusPedido.PENDENTE.isFinalizado());
        System.out.println(StatusPedido.APROVADO.isFinalizado());
        System.out.println(StatusPedido.RECUSADO.isFinalizado());
        System.out.println(StatusPedido.CANCELADO.isFinalizado());
    }
}

enum StatusPedido {
    PENDENTE(false),
    APROVADO(false),
    RECUSADO(true),
    CANCELADO(true);

    private final boolean finalizado;

    StatusPedido(boolean finalizado) {
        this.finalizado = finalizado;
    }

    public boolean isFinalizado() {
        return finalizado;
    }
}
```

Aqui o atributo `finalizado` evita switch repetido.

---

## name

Todo enum tem:

```java
name()
```

Exemplo:

```java
StatusPedido.APROVADO.name()
```

retorna:

```text
APROVADO
```

`name()` é o nome exato da constante.

Pode ser usado em logs e alguns contratos.

Mas cuidado:

```text
se persistir name no banco, renomear constante pode quebrar dados antigos.
```

Às vezes é melhor persistir `codigo`.

---

## ordinal

Todo enum tem:

```java
ordinal()
```

Ele retorna a posição da constante.

Exemplo:

```java
PENDENTE -> 0
APROVADO -> 1
RECUSADO -> 2
```

Evite usar `ordinal` como regra, banco ou contrato externo.

Por quê?

Se alguém mudar a ordem:

```java
PENDENTE,
RECUSADO,
APROVADO
```

os números mudam.

Regra profissional:

```text
não use ordinal para persistência ou regra de negócio.
```

Use código explícito.

---

## Exemplo de ordinal perigoso

Arquivo:

```text
ErroOrdinal.java
```

Código:

```java
public class ErroOrdinal {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.APROVADO;

        System.out.println(status.ordinal());
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Saída:

```text
1
```

O problema é depender desse `1`.

Se a ordem mudar, o valor muda.

---

## toString em enum

Podemos sobrescrever `toString`.

Exemplo:

```java
@Override
public String toString() {
    return descricao;
}
```

Mas tenha cuidado.

`toString` é usado em logs e concatenações.

Às vezes é melhor deixar `toString` padrão e usar:

```java
getDescricao()
```

para exibição.

Regra inicial:

```text
prefira getDescricao para texto amigável;
use toString customizado só quando fizer sentido claro.
```

---

## Aplicação em cliente

Arquivo:

```text
ClienteTipoEnum.java
```

Código:

```java
public class ClienteTipoEnum {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana", "PF");

        System.out.println("Cliente: " + cliente.nome);
        System.out.println("Tipo: " + cliente.tipo.getDescricao());
    }

    public static Cliente criarCliente(String nome, String codigoTipo) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;
        cliente.tipo = TipoCliente.fromCode(codigoTipo);

        return cliente;
    }

    static class Cliente {
        String nome;
        TipoCliente tipo;
    }
}

enum TipoCliente {
    PESSOA_FISICA("PF", "Pessoa física"),
    PESSOA_JURIDICA("PJ", "Pessoa jurídica");

    private final String codigo;
    private final String descricao;

    TipoCliente(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static TipoCliente fromCode(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Tipo de cliente é obrigatório.");
        }

        for (TipoCliente tipo : values()) {
            if (tipo.codigo.equalsIgnoreCase(codigo.trim())) {
                return tipo;
            }
        }

        throw new IllegalArgumentException("Tipo de cliente inválido: " + codigo);
    }
}
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoStatusEnum.java
```

Código:

```java
public class ProdutoStatusEnum {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira", "A");

        System.out.println("Produto: " + produto.nome);
        System.out.println("Status: " + produto.status.getDescricao());
        System.out.println("Pode vender? " + produto.status.podeVender());
    }

    public static Produto criarProduto(String nome, String codigoStatus) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.status = StatusProduto.fromCode(codigoStatus);

        return produto;
    }

    static class Produto {
        String nome;
        StatusProduto status;
    }
}

enum StatusProduto {
    ATIVO("A", "Ativo", true),
    INATIVO("I", "Inativo", false),
    BLOQUEADO("B", "Bloqueado", false);

    private final String codigo;
    private final String descricao;
    private final boolean podeVender;

    StatusProduto(String codigo, String descricao, boolean podeVender) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.podeVender = podeVender;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean podeVender() {
        return podeVender;
    }

    public static StatusProduto fromCode(String codigo) {
        for (StatusProduto status : values()) {
            if (status.codigo.equalsIgnoreCase(codigo)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Status de produto inválido.");
    }
}
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoStatusEnum.java
```

Código:

```java
public class PedidoStatusEnum {
    public static void main(String[] args) {
        Pedido pedido = new Pedido();

        pedido.cliente = "Ana";
        pedido.status = StatusPedido.PENDENTE;

        aprovar(pedido);

        System.out.println("Status: " + pedido.status.getDescricao());
    }

    public static void aprovar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.status != StatusPedido.PENDENTE) {
            throw new IllegalArgumentException("Somente pedido pendente pode ser aprovado.");
        }

        pedido.status = StatusPedido.APROVADO;
    }

    static class Pedido {
        String cliente;
        StatusPedido status;
    }
}

enum StatusPedido {
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    RECUSADO("Recusado"),
    CANCELADO("Cancelado");

    private final String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

Esse exemplo mostra transição simples de status.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoStatusEnum.java
```

Código:

```java
public class PagamentoStatusEnum {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento();

        pagamento.codigo = "PAG-001";
        pagamento.status = StatusPagamento.PENDENTE;

        System.out.println(mensagem(pagamento.status));
    }

    public static String mensagem(StatusPagamento status) {
        return switch (status) {
            case PENDENTE -> "Pagamento aguardando confirmação.";
            case CONFIRMADO -> "Pagamento confirmado.";
            case RECUSADO -> "Pagamento recusado.";
            case ESTORNADO -> "Pagamento estornado.";
        };
    }

    static class Pagamento {
        String codigo;
        StatusPagamento status;
    }
}

enum StatusPagamento {
    PENDENTE,
    CONFIRMADO,
    RECUSADO,
    ESTORNADO
}
```

Switch com enum deixa regra clara.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoStatusEnum.java
```

Código:

```java
public class OrdemServicoStatusEnum {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "ABE");

        System.out.println("OS: " + os.certificado);
        System.out.println("Status: " + os.status.getDescricao());
        System.out.println("Permite reagendar? " + os.status.permiteReagendamento());
    }

    public static OrdemServico criarOs(String certificado, String codigoStatus) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.status = StatusOs.fromCode(codigoStatus);

        return os;
    }

    static class OrdemServico {
        String certificado;
        StatusOs status;
    }
}

enum StatusOs {
    ABERTA("ABE", "Aberta", true),
    CONCLUIDA("CON", "Concluída", false),
    CANCELADA("CAN", "Cancelada", false),
    REAGENDADA("REA", "Reagendada", true);

    private final String codigo;
    private final String descricao;
    private final boolean permiteReagendamento;

    StatusOs(String codigo, String descricao, boolean permiteReagendamento) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.permiteReagendamento = permiteReagendamento;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean permiteReagendamento() {
        return permiteReagendamento;
    }

    public static StatusOs fromCode(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Status da OS é obrigatório.");
        }

        for (StatusOs status : values()) {
            if (status.codigo.equalsIgnoreCase(codigo.trim())) {
                return status;
            }
        }

        throw new IllegalArgumentException("Status da OS inválido: " + codigo);
    }
}
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaTipoEnum.java
```

Código:

```java
public class MensageriaTipoEnum {
    public static void main(String[] args) {
        Mensagem mensagem = criarMensagem("Ana", "ENTREGA");

        System.out.println("Cliente: " + mensagem.cliente);
        System.out.println("Tipo: " + mensagem.tipo.getDescricao());
        System.out.println("Gera ocorrência? " + mensagem.tipo.geraOcorrencia());
    }

    public static Mensagem criarMensagem(String cliente, String codigoTipo) {
        Mensagem mensagem = new Mensagem();

        mensagem.cliente = cliente;
        mensagem.tipo = TipoMensagem.fromCode(codigoTipo);

        return mensagem;
    }

    static class Mensagem {
        String cliente;
        TipoMensagem tipo;
    }
}

enum TipoMensagem {
    BOAS_VINDAS("BOAS_VINDAS", "Boas-vindas", false),
    ENTREGA("ENTREGA", "Confirmação de entrega", true),
    NPS("NPS", "Pesquisa NPS", true);

    private final String codigo;
    private final String descricao;
    private final boolean geraOcorrencia;

    TipoMensagem(String codigo, String descricao, boolean geraOcorrencia) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.geraOcorrencia = geraOcorrencia;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean geraOcorrencia() {
        return geraOcorrencia;
    }

    public static TipoMensagem fromCode(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Tipo de mensagem é obrigatório.");
        }

        for (TipoMensagem tipo : values()) {
            if (tipo.codigo.equalsIgnoreCase(codigo.trim())) {
                return tipo;
            }
        }

        throw new IllegalArgumentException("Tipo de mensagem inválido: " + codigo);
    }
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaOperacaoEnum.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaOperacaoEnum {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", OperacaoAuditoria.CRIACAO);

        System.out.println(registro.usuario);
        System.out.println(registro.operacao.getDescricao());
        System.out.println(registro.criadoEm);
    }

    public static RegistroAuditoria criarRegistro(String usuario, OperacaoAuditoria operacao) {
        if (operacao == null) {
            throw new IllegalArgumentException("Operação é obrigatória.");
        }

        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.criadoEm = Instant.now();

        return registro;
    }

    static class RegistroAuditoria {
        String usuario;
        OperacaoAuditoria operacao;
        Instant criadoEm;
    }
}

enum OperacaoAuditoria {
    CRIACAO("Criação"),
    EDICAO("Edição"),
    EXCLUSAO("Exclusão"),
    APROVACAO("Aprovação"),
    RECUSA("Recusa");

    private final String descricao;

    OperacaoAuditoria(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

Enum evita operação escrita como string solta:

```text
"CRIACAO"
"CRIAÇÃO"
"criacao"
"CREATE"
```

---

## Refatoração: string mágica para enum

Antes:

```java
class Pedido {
    String status;
}
```

Uso:

```java
if ("APROVADO".equals(pedido.status)) {
}
```

Depois:

```java
class Pedido {
    StatusPedido status;
}
```

Uso:

```java
if (pedido.status == StatusPedido.APROVADO) {
}
```

Benefícios:

```text
mais seguro;
mais legível;
menos duplicação;
menos erro de digitação;
melhor autocomplete;
melhor refatoração.
```

---

## Refatoração: código externo para enum

Entrada externa:

```text
"A"
```

Não use espalhado:

```java
if ("A".equals(codigo)) {
    status = StatusPedido.APROVADO;
}
```

Centralize:

```java
StatusPedido status = StatusPedido.fromCode(codigo);
```

Assim a regra fica em um lugar.

---

## Refatoração: descrição fora do switch

Antes:

```java
switch (status) {
    case PENDENTE:
        return "Pendente";
    case APROVADO:
        return "Aprovado";
}
```

Depois:

```java
status.getDescricao()
```

Com enum:

```java
PENDENTE("Pendente"),
APROVADO("Aprovado");
```

Isso evita duplicar descrição em vários lugares.

---

## Quando não colocar regra no enum

Enum pode ter comportamento, mas não deve virar classe gigante.

Evite colocar no enum:

```text
acesso a banco;
chamada HTTP;
regra de negócio complexa demais;
dependência de serviço;
código que muda com frequência;
cálculo enorme;
regra que pertence a outra camada.
```

Bom para enum:

```text
código;
descrição;
flags simples;
validações simples;
conversão fromCode;
métodos pequenos ligados ao próprio valor.
```

Se a regra crescer demais, talvez pertença a uma classe de serviço.

---

## Erros comuns

### Erro 1 — Continuar usando String para status fixo

Use enum quando os valores são controlados.

---

### Erro 2 — Usar ordinal como código

Não use `ordinal` para banco, API ou regra.

---

### Erro 3 — Usar valueOf direto com entrada externa

`valueOf` exige nome exato e pode lançar erro.

Prefira `fromCode`.

---

### Erro 4 — Não validar null

Enum é referência.

Pode ser null.

---

### Erro 5 — Colocar regra enorme dentro do enum

Enum deve continuar coeso.

---

### Erro 6 — Persistir name sem pensar

Renomear constante pode quebrar dados.

---

### Erro 7 — Usar toString como contrato externo sem cuidado

`toString` pode mudar.

Prefira código explícito.

---

### Erro 8 — Duplicar descrição em vários switches

Use atributo `descricao`.

---

### Erro 9 — Não centralizar conversão de código

Crie `fromCode`.

---

### Erro 10 — Transformar dados dinâmicos em enum

Se o usuário cadastra valores novos, provavelmente não é enum.

---

## Diagnóstico de enum

Quando analisar código com status ou tipo, pergunte:

### 1. Os valores são fixos?

Se sim, enum pode fazer sentido.

### 2. Há strings mágicas espalhadas?

Refatore para enum.

### 3. Existe código externo?

Crie atributo `codigo` e método `fromCode`.

### 4. Existe descrição para usuário?

Crie atributo `descricao`.

### 5. Está usando ordinal?

Remova da regra.

### 6. Está usando valueOf em entrada externa?

Troque por conversão validada.

### 7. O enum pode ser null?

Valide.

### 8. A regra no enum está pequena?

Se ficou grande, avalie serviço.

### 9. A lista muda por cadastro?

Talvez deva ser tabela, não enum.

### 10. O nome da constante pode mudar?

Se persistir `name`, cuidado.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugEnum {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.fromCode("A");

        System.out.println(status);
        System.out.println(status.getCodigo());
        System.out.println(status.getDescricao());
    }
}

enum StatusPedido {
    PENDENTE("P", "Pendente"),
    APROVADO("A", "Aprovado"),
    RECUSADO("R", "Recusado");

    private final String codigo;
    private final String descricao;

    StatusPedido(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusPedido fromCode(String codigo) {
        for (StatusPedido status : values()) {
            if (status.codigo.equalsIgnoreCase(codigo)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Código inválido.");
    }
}
```

Coloque breakpoint em:

```java
for (StatusPedido status : values()) {
```

Observe:

```text
values percorre PENDENTE, APROVADO, RECUSADO;
cada enum tem codigo e descricao;
fromCode retorna a constante correta.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — valueOf com texto errado

```java
public class Main {
    public static void main(String[] args) {
        StatusPedido status = StatusPedido.valueOf("aprovado");

        System.out.println(status);
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Explique por que quebra.

---

### Teste 2 — ordinal como regra

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(StatusPedido.APROVADO.ordinal());
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Depois mude a ordem e veja o número mudar.

Explique por que é perigoso.

---

### Teste 3 — enum null

```java
public class Main {
    public static void main(String[] args) {
        StatusPedido status = null;

        System.out.println(status.getDescricao());
    }
}

enum StatusPedido {
    APROVADO;

    public String getDescricao() {
        return "Aprovado";
    }
}
```

Explique o `NullPointerException`.

---

### Teste 4 — string mágica com erro de digitação

```java
public class Main {
    public static void main(String[] args) {
        String status = "APROVDA";

        if ("APROVADA".equals(status)) {
            System.out.println("Aprovado");
        } else {
            System.out.println("Não aprovado");
        }
    }
}
```

Explique por que enum evitaria esse erro.

---

### Teste 5 — fromCode inválido

Chame:

```java
StatusPedido.fromCode("X")
```

Explique por que deve lançar mensagem clara.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-076-enum-profissional
cd labs\m2\aula-076-enum-profissional
```

Crie arquivos:

```text
Main.java
StatusPedido.java
PedidoComEnum.java
SwitchEnum.java
SwitchModernoEnum.java
EnumComAtributos.java
EnumValues.java
EnumValueOf.java
ErroValueOf.java
EnumFromCode.java
EnumComComportamento.java
EnumStatusFinal.java
ErroOrdinal.java
ClienteTipoEnum.java
ProdutoStatusEnum.java
PedidoStatusEnum.java
PagamentoStatusEnum.java
OrdemServicoStatusEnum.java
MensageriaTipoEnum.java
AuditoriaOperacaoEnum.java
DebugEnum.java
ErroEnumNull.java
ErroStringMagica.java
ErroFromCodeInvalido.java
README.md
```

Compile:

```powershell
javac Main.java
javac StatusPedido.java PedidoComEnum.java
javac SwitchEnum.java
javac SwitchModernoEnum.java
javac EnumComAtributos.java
javac EnumValues.java
javac EnumValueOf.java
javac ErroValueOf.java
javac EnumFromCode.java
javac EnumComComportamento.java
javac EnumStatusFinal.java
javac ErroOrdinal.java
javac ClienteTipoEnum.java
javac ProdutoStatusEnum.java
javac PedidoStatusEnum.java
javac PagamentoStatusEnum.java
javac OrdemServicoStatusEnum.java
javac MensageriaTipoEnum.java
javac AuditoriaOperacaoEnum.java
javac DebugEnum.java
javac ErroEnumNull.java
javac ErroStringMagica.java
javac ErroFromCodeInvalido.java
```

Execute os exemplos válidos:

```powershell
java Main
java PedidoComEnum
java SwitchEnum
java SwitchModernoEnum
java EnumComAtributos
java EnumValues
java EnumValueOf
java EnumFromCode
java EnumComComportamento
java EnumStatusFinal
java ClienteTipoEnum
java ProdutoStatusEnum
java PedidoStatusEnum
java PagamentoStatusEnum
java OrdemServicoStatusEnum
java MensageriaTipoEnum
java AuditoriaOperacaoEnum
java DebugEnum
```

Execute os de erro ou comportamento perigoso separadamente:

```powershell
java ErroValueOf
java ErroOrdinal
java ErroEnumNull
java ErroStringMagica
java ErroFromCodeInvalido
```

Use os resultados para registrar os erros comuns no diário.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 076 — Enum profissional

## Objetivo

Entender como usar enum de forma profissional para substituir strings mágicas, representar status e tipos controlados, adicionar código, descrição, métodos e conversões seguras com `fromCode`.

## Conceitos

- Enum representa conjunto fixo de valores.
- Enum evita strings mágicas.
- Enum melhora autocomplete e segurança de compilação.
- Constantes enum podem ter atributos.
- Enum pode ter construtor, getters e métodos.
- `values()` lista todas as constantes.
- `valueOf()` converte nome exato da constante.
- `valueOf()` não é ideal para entrada externa sem validação.
- `fromCode()` centraliza conversão de código externo.
- `ordinal()` não deve ser usado como regra ou persistência.
- `name()` retorna nome da constante.
- Enum pode ser usado em `switch`.
- Enum pode conter comportamento simples.
- Enum não deve virar classe gigante.
- Dados dinâmicos de cadastro geralmente não devem ser enum.

## Comandos

```powershell
javac Main.java
java Main
javac EnumFromCode.java
java EnumFromCode
javac OrdemServicoStatusEnum.java
java OrdemServicoStatusEnum
```

## Observações

- Não usar String para status fixo.
- Não usar ordinal como código.
- Não usar valueOf com entrada externa sem tratamento.
- Criar fromCode quando existe código de integração.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver fromCode percorrendo values |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar validação |
| Variables | janela Debug | Ver constante, código e descrição |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `name`, `ordinal`, `fromCode` |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Renomear constante com segurança |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Criar conversões e validações |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 076 — Enum profissional

### O que aprendi
Aprendi que enum representa um conjunto fixo de valores e ajuda a substituir strings mágicas. Também aprendi a criar enum com código, descrição, método, `fromCode`, `values`, `valueOf` e regras simples de domínio.

### O que pratiquei
Criei exemplos com status de pedido, status de produto, tipo de cliente, status de pagamento, status de OS, tipo de mensagem e operação de auditoria. Também pratiquei atributos, construtor, getters, switch, fromCode, values, valueOf, ordinal e erros comuns.

### Conceitos principais
- enum
- constante
- status
- string mágica
- código
- descrição
- atributo
- construtor
- getter
- método
- fromCode
- values
- valueOf
- name
- ordinal
- switch
- validação
- domínio
- autocomplete
- refatoração
- IllegalArgumentException

### Arquivos criados
- `labs/m2/aula-076-enum-profissional/Main.java`
- `labs/m2/aula-076-enum-profissional/StatusPedido.java`
- `labs/m2/aula-076-enum-profissional/PedidoComEnum.java`
- `labs/m2/aula-076-enum-profissional/SwitchEnum.java`
- `labs/m2/aula-076-enum-profissional/SwitchModernoEnum.java`
- `labs/m2/aula-076-enum-profissional/EnumComAtributos.java`
- `labs/m2/aula-076-enum-profissional/EnumValues.java`
- `labs/m2/aula-076-enum-profissional/EnumValueOf.java`
- `labs/m2/aula-076-enum-profissional/ErroValueOf.java`
- `labs/m2/aula-076-enum-profissional/EnumFromCode.java`
- `labs/m2/aula-076-enum-profissional/EnumComComportamento.java`
- `labs/m2/aula-076-enum-profissional/EnumStatusFinal.java`
- `labs/m2/aula-076-enum-profissional/ErroOrdinal.java`
- `labs/m2/aula-076-enum-profissional/ClienteTipoEnum.java`
- `labs/m2/aula-076-enum-profissional/ProdutoStatusEnum.java`
- `labs/m2/aula-076-enum-profissional/PedidoStatusEnum.java`
- `labs/m2/aula-076-enum-profissional/PagamentoStatusEnum.java`
- `labs/m2/aula-076-enum-profissional/OrdemServicoStatusEnum.java`
- `labs/m2/aula-076-enum-profissional/MensageriaTipoEnum.java`
- `labs/m2/aula-076-enum-profissional/AuditoriaOperacaoEnum.java`
- `labs/m2/aula-076-enum-profissional/DebugEnum.java`
- `labs/m2/aula-076-enum-profissional/ErroEnumNull.java`
- `labs/m2/aula-076-enum-profissional/ErroStringMagica.java`
- `labs/m2/aula-076-enum-profissional/ErroFromCodeInvalido.java`
- `labs/m2/aula-076-enum-profissional/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac EnumFromCode.java
java EnumFromCode
javac OrdemServicoStatusEnum.java
java OrdemServicoStatusEnum
javac AuditoriaOperacaoEnum.java
java AuditoriaOperacaoEnum
```

### Erros que quero evitar
- continuar usando String para status fixo;
- usar ordinal como código;
- usar valueOf direto com entrada externa;
- não validar null;
- colocar regra enorme dentro do enum;
- persistir name sem pensar;
- usar toString como contrato externo sem cuidado;
- duplicar descrição em vários switches;
- não centralizar conversão de código;
- transformar dados dinâmicos em enum.

### Próximo passo
Estudar records.
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
git add labs/m2/aula-076-enum-profissional docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 076: pratica enum profissional em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é enum?
2. Quando usar enum?
3. Quando não usar enum?
4. O que é string mágica?
5. Como enum ajuda a evitar erro de digitação?
6. Como comparar enum?
7. O que values faz?
8. O que valueOf faz?
9. Por que valueOf pode ser perigoso com entrada externa?
10. Para que serve fromCode?
11. Como criar enum com código e descrição?
12. Por que atributos do enum costumam ser final?
13. Por que evitar ordinal como código?
14. Qual a diferença entre name e descrição?
15. Quando colocar método dentro do enum?
16. Quando não colocar regra dentro do enum?
17. Como usar enum em switch?
18. Como validar código inválido?
19. Como enum se aplica a status de OS?
20. Como enum se aplica a auditoria?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar enum;
criar enum simples;
usar enum em classe;
comparar enum com ==;
usar enum em switch tradicional;
usar enum em switch moderno;
criar enum com atributos;
criar construtor de enum;
criar getters no enum;
usar values;
usar valueOf;
explicar risco de valueOf;
criar fromCode;
validar código inválido;
explicar string mágica;
refatorar String status para enum;
explicar name;
explicar ordinal;
explicar por que não usar ordinal;
criar enum com comportamento simples;
usar enum para tipo de cliente;
usar enum para status de produto;
usar enum para status de pedido;
usar enum para status de pagamento;
usar enum para status de OS;
usar enum para tipo de mensagem;
usar enum para operação de auditoria;
debugar fromCode;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar enum com interface.

Não precisa ainda dominar enum strategy avançado.

Não precisa ainda dominar persistência JPA com enum.

Não precisa ainda dominar JSON com enum.

Não precisa ainda dominar internacionalização de descrição.

Não precisa ainda dominar mapeamento com banco.

Esses assuntos virão depois.

O objetivo é dominar enum profissional básico: status, atributos, métodos, `fromCode`, validação e substituição de strings mágicas.

---

## Fechamento da aula

Hoje estudamos enum profissional.

A ideia central foi:

```text
quando uma regra tem valores fixos e controlados, enum é mais seguro que String solta.
```

Vimos que:

```text
enum representa conjunto fixo de constantes;
enum evita strings mágicas;
enum pode ter código e descrição;
enum pode ter método;
values lista constantes;
valueOf exige nome exato;
fromCode é melhor para código externo;
ordinal não deve ser usado como regra;
switch combina bem com enum;
enum pode representar status, tipo, operação e prioridade.
```

O ponto mais importante é:

```text
use enum para dar nome, segurança e regra explícita aos valores controlados do domínio.
```

Na próxima aula, vamos estudar:

```text
Records.
```

A próxima aula vai explicar classes de dados imutáveis, construtor compacto, validação, DTOs simples, leitura crítica e quando usar ou não usar record.
