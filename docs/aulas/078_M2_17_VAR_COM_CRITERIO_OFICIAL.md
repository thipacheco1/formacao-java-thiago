# 078 — M2.17 — Var com critério

## A pergunta central da aula

Compare:

```java
ClienteResumo cliente = new ClienteResumo("Ana", "ana@email.com");
```

com:

```java
var cliente = new ClienteResumo("Ana", "ana@email.com");
```

Nos dois casos, o tipo é claro.

Agora compare:

```java
var resultado = buscar();
```

Pergunta:

```text
buscar retorna o quê?
```

Sem olhar o método, não sabemos.

Pode ser:

```text
Cliente;
Pedido;
String;
boolean;
List;
Map;
Optional;
BigDecimal;
algum DTO.
```

Nesse caso, `var` pode piorar a leitura.

Regra central:

```text
use var quando o tipo é evidente pelo lado direito ou quando o tipo explícito só gera ruído;
evite var quando ele esconde informação importante para quem lê.
```

---

## O que é var

`var` é inferência local de tipo.

Isso significa:

```text
o compilador infere o tipo da variável a partir do valor inicial.
```

Exemplo:

```java
var nome = "Ana";
```

O tipo real é:

```text
String.
```

Outro exemplo:

```java
var idade = 30;
```

O tipo real é:

```text
int.
```

Outro:

```java
var total = new BigDecimal("10.00");
```

O tipo real é:

```text
BigDecimal.
```

`var` não é um tipo.

`var` é uma palavra reservada contextual para deixar o compilador inferir o tipo.

---

## Var não é dinâmico

Este ponto é obrigatório.

Em Java, `var` não transforma a linguagem em dinâmica.

Exemplo:

```java
var valor = "Ana";

valor = 10;
```

Isso não compila.

Por quê?

Porque o compilador inferiu:

```text
valor é String.
```

Depois você tentou atribuir `int`.

`var` não significa:

```text
qualquer coisa.
```

Significa:

```text
descubra o tipo uma vez e mantenha esse tipo.
```

---

## Vocabulário essencial

Termos desta aula:

```text
var;
inferência;
tipo inferido;
variável local;
legibilidade;
tipo explícito;
tipo óbvio;
tipo escondido;
compilador;
inicialização;
null;
lambda;
array;
loop;
for-each;
try-with-resources;
generics;
diamond operator;
tipo anônimo;
primitivo;
wrapper;
BigDecimal;
DTO;
record;
refatoração;
leitura crítica.
```

Termos mais importantes:

```text
var -> inferência local de tipo;
tipo inferido -> tipo que o compilador deduz;
variável local -> variável dentro de método, bloco, for ou try;
legibilidade -> facilidade de entender o código;
tipo óbvio -> tipo claro pelo lado direito;
tipo escondido -> tipo que exige navegar para outro método;
inicializador -> expressão usada para dar valor inicial;
inferência não é dinâmica -> o tipo continua fixo em compilação.
```

---

## Onde var pode ser usado

`var` pode ser usado em variáveis locais.

Exemplos válidos:

```java
public static void main(String[] args) {
    var nome = "Ana";
    var idade = 30;
}
```

Em `for`:

```java
for (var indice = 0; indice < 10; indice++) {
}
```

Em for-each:

```java
for (var nome : nomes) {
}
```

Em try-with-resources:

```java
try (var scanner = new Scanner(System.in)) {
}
```

---

## Onde var não pode ser usado

`var` não pode ser usado em:

```text
campo de classe;
parâmetro de método comum;
tipo de retorno;
variável sem inicialização;
variável inicializada com null;
assinatura pública comum;
declaração de componente de record.
```

Exemplos inválidos:

```java
class Cliente {
    var nome = "Ana";
}
```

```java
public static var buscarNome() {
    return "Ana";
}
```

```java
public static void imprimir(var texto) {
}
```

```java
var nome;
```

```java
var valor = null;
```

O compilador precisa de um valor inicial para inferir o tipo.

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
        var nome = "Ana";
        var idade = 30;
        var ativo = true;

        System.out.println(nome);
        System.out.println(idade);
        System.out.println(ativo);
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
Ana
30
true
```

Tipos inferidos:

```text
nome -> String;
idade -> int;
ativo -> boolean.
```

---

## Var com tipos primitivos

Arquivo:

```text
VarPrimitivos.java
```

Código:

```java
public class VarPrimitivos {
    public static void main(String[] args) {
        var quantidade = 10;
        var valorLong = 10L;
        var media = 10.5;
        var taxa = 10.5F;
        var ativo = true;
        var letra = 'A';

        System.out.println(quantidade);
        System.out.println(valorLong);
        System.out.println(media);
        System.out.println(taxa);
        System.out.println(ativo);
        System.out.println(letra);
    }
}
```

Tipos inferidos:

```text
10 -> int;
10L -> long;
10.5 -> double;
10.5F -> float;
true -> boolean;
'A' -> char.
```

Atenção:

```text
var não escolhe wrapper automaticamente.
```

`var quantidade = 10;` é `int`, não `Integer`.

---

## Var e BigDecimal

Arquivo:

```text
VarBigDecimal.java
```

Código:

```java
import java.math.BigDecimal;

public class VarBigDecimal {
    public static void main(String[] args) {
        var valor = new BigDecimal("10.00");
        var desconto = new BigDecimal("2.50");

        var total = valor.subtract(desconto);

        System.out.println(total);
    }
}
```

Tipos inferidos:

```text
valor -> BigDecimal;
desconto -> BigDecimal;
total -> BigDecimal.
```

Aqui o `var` é aceitável porque o lado direito mostra claramente `new BigDecimal`.

Mas também seria aceitável escrever explicitamente:

```java
BigDecimal valor = new BigDecimal("10.00");
```

A decisão depende da legibilidade.

---

## Var com record

Arquivo:

```text
VarRecord.java
```

Código:

```java
public class VarRecord {
    public static void main(String[] args) {
        var cliente = new ClienteResumo("Ana", "ana@email.com");

        System.out.println(cliente.nome());
        System.out.println(cliente.email());
    }
}

record ClienteResumo(String nome, String email) {
}
```

Aqui `var` funciona bem.

O tipo aparece no construtor:

```java
new ClienteResumo(...)
```

Então a leitura continua clara.

---

## Var com enum

Arquivo:

```text
VarEnum.java
```

Código:

```java
public class VarEnum {
    public static void main(String[] args) {
        var status = StatusPedido.APROVADO;

        if (status == StatusPedido.APROVADO) {
            System.out.println("Aprovado.");
        }
    }
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Tipo inferido:

```text
StatusPedido.
```

Também é claro pelo lado direito.

---

## Var com LocalDate e Instant

Arquivo:

```text
VarDatas.java
```

Código:

```java
import java.time.Instant;
import java.time.LocalDate;

public class VarDatas {
    public static void main(String[] args) {
        var hoje = LocalDate.of(2026, 7, 7);
        var agora = Instant.parse("2026-07-07T13:00:00Z");

        System.out.println(hoje);
        System.out.println(agora);
    }
}
```

Tipos:

```text
hoje -> LocalDate;
agora -> Instant.
```

O lado direito deixa claro.

---

## Var com for clássico

Arquivo:

```text
VarForClassico.java
```

Código:

```java
public class VarForClassico {
    public static void main(String[] args) {
        for (var indice = 0; indice < 5; indice++) {
            System.out.println(indice);
        }
    }
}
```

`indice` é inferido como:

```text
int.
```

Uso comum e aceitável.

---

## Var com for-each

Arquivo:

```text
VarForEach.java
```

Código:

```java
public class VarForEach {
    public static void main(String[] args) {
        var nomes = new String[]{"Ana", "Bruno", "Carla"};

        for (var nome : nomes) {
            System.out.println(nome.toUpperCase());
        }
    }
}
```

Tipos:

```text
nomes -> String[];
nome -> String.
```

Aqui o uso é legível.

---

## Var com try-with-resources

Arquivo:

```text
VarTryWithResources.java
```

Código:

```java
import java.util.Scanner;

public class VarTryWithResources {
    public static void main(String[] args) {
        try (var scanner = new Scanner("Ana\n")) {
            var nome = scanner.nextLine();

            System.out.println(nome);
        }
    }
}
```

Tipos:

```text
scanner -> Scanner;
nome -> String.
```

Esse é um uso bom de `var`.

O lado direito mostra `new Scanner`.

---

## Var com generics

Um dos usos úteis do `var` é reduzir repetição em tipos genéricos.

Exemplo explícito:

```java
java.util.Map<String, java.util.List<String>> nomesPorGrupo = new java.util.HashMap<>();
```

Com imports e var:

```java
var nomesPorGrupo = new HashMap<String, List<String>>();
```

Mas cuidado com inferência ruim.

Arquivo:

```text
VarGenerics.java
```

Código:

```java
import java.util.ArrayList;
import java.util.List;

public class VarGenerics {
    public static void main(String[] args) {
        var nomes = new ArrayList<String>();

        nomes.add("Ana");
        nomes.add("Bruno");

        for (var nome : nomes) {
            System.out.println(nome.toUpperCase());
        }
    }
}
```

Tipo inferido:

```text
ArrayList<String>.
```

Não é apenas `List<String>`.

Isso pode importar.

Se você quer programar para interface, talvez prefira:

```java
List<String> nomes = new ArrayList<>();
```

---

## Var e tipo de interface

Compare:

```java
List<String> nomes = new ArrayList<>();
```

com:

```java
var nomes = new ArrayList<String>();
```

No primeiro:

```text
tipo da variável é List<String>.
```

No segundo:

```text
tipo da variável é ArrayList<String>.
```

Isso pode afetar design.

Regra:

```text
se a abstração da interface importa, escreva o tipo explícito.
```

Exemplo recomendado:

```java
List<String> nomes = new ArrayList<>();
```

quando você quer deixar claro que usa a interface `List`.

---

## Var e diamond operator

Cuidado com:

```java
var nomes = new ArrayList<>();
```

O compilador pode inferir algo menos específico do que você imagina.

Em muitos casos:

```text
ArrayList<Object>
```

pode aparecer se não houver contexto suficiente.

Melhor:

```java
var nomes = new ArrayList<String>();
```

ou:

```java
List<String> nomes = new ArrayList<>();
```

Regra:

```text
com generics, não use var + diamond sem pensar.
```

---

## Var e null

Isto não compila:

```java
var valor = null;
```

Por quê?

Porque o compilador não sabe o tipo.

Se precisa iniciar com null, escreva o tipo:

```java
String valor = null;
```

Mas também pergunte:

```text
por que estou iniciando com null?
```

Talvez exista forma melhor de modelar a regra.

---

## Var e mudança de tipo

Arquivo de erro proposital:

```text
ErroVarNaoDinamico.java
```

Código:

```java
public class ErroVarNaoDinamico {
    public static void main(String[] args) {
        var valor = "Ana";

        valor = 10;

        System.out.println(valor);
    }
}
```

Esse código não compila.

Motivo:

```text
valor foi inferido como String;
não pode receber int depois.
```

---

## Var sem inicialização

Arquivo de erro proposital:

```text
ErroVarSemInicializacao.java
```

Código:

```java
public class ErroVarSemInicializacao {
    public static void main(String[] args) {
        var nome;

        nome = "Ana";

        System.out.println(nome);
    }
}
```

Não compila.

O `var` exige inicialização na declaração.

Correção:

```java
String nome;
nome = "Ana";
```

ou:

```java
var nome = "Ana";
```

---

## Var com retorno de método

Este é um dos pontos mais importantes.

Compare:

```java
var resultado = buscarCliente();
```

O tipo é claro?

Depende.

Se o método é muito claro e perto do código, talvez sim.

Mas em leitura isolada, o tipo fica escondido.

Exemplo melhor:

```java
ClienteResumo cliente = buscarCliente();
```

Quando o retorno do método não é óbvio, tipo explícito ajuda.

Regra:

```text
evite var quando o lado direito é chamada de método com tipo não evidente.
```

---

## Exemplo ruim com método genérico

Arquivo:

```text
VarMetodoPoucoClaro.java
```

Código:

```java
public class VarMetodoPoucoClaro {
    public static void main(String[] args) {
        var resultado = buscar();

        System.out.println(resultado);
    }

    public static String buscar() {
        return "Ana";
    }
}
```

O código compila.

Mas a leitura do `main` não mostra o tipo.

Melhor:

```java
String resultado = buscar();
```

ou renomear o método:

```java
String nomeCliente = buscarNomeCliente();
```

Ainda assim, tipo explícito pode ser melhor.

---

## Exemplo aceitável com método claro

Arquivo:

```text
VarMetodoClaro.java
```

Código:

```java
public class VarMetodoClaro {
    public static void main(String[] args) {
        var cliente = criarClienteResumo();

        System.out.println(cliente.nome());
    }

    public static ClienteResumo criarClienteResumo() {
        return new ClienteResumo("Ana", "ana@email.com");
    }
}

record ClienteResumo(String nome, String email) {
}
```

Aqui o método ajuda:

```java
criarClienteResumo()
```

Mas ainda assim, em código profissional, pode ser discutível.

Critério:

```text
se a leitura continua clara, var pode ser aceito;
se esconde algo relevante, use tipo explícito.
```

---

## Var com nomes ruins é pior

Código ruim:

```java
var x = buscar();
```

Problemas:

```text
tipo escondido;
nome ruim;
intenção escondida.
```

Melhor:

```java
ClienteResumo clienteResumo = buscarClienteResumo();
```

ou:

```java
var clienteResumo = buscarClienteResumo();
```

O nome da variável e do método precisa compensar o uso de `var`.

Regra:

```text
quanto mais você usa var, melhor precisam ser os nomes.
```

---

## Var e legibilidade

`var` pode melhorar legibilidade quando remove ruído.

Exemplo:

```java
var formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");
```

O lado direito já mostra o tipo.

Exemplo:

```java
var total = subtotal.add(frete).subtract(desconto);
```

Aqui o tipo pode não estar explícito, mas se `subtotal`, `frete` e `desconto` são `BigDecimal`, talvez seja aceitável.

Mas se a leitura depende do tipo, escreva:

```java
BigDecimal total = subtotal.add(frete).subtract(desconto);
```

Regra:

```text
legibilidade vem antes de economia de caracteres.
```

---

## Aplicação em cliente

Arquivo:

```text
ClienteVar.java
```

Código:

```java
public class ClienteVar {
    public static void main(String[] args) {
        var request = new CriarClienteRequest(" Ana ", " ANA@EMAIL.COM ");

        var response = criarCliente(request);

        System.out.println(response);
    }

    public static ClienteResponse criarCliente(CriarClienteRequest request) {
        var nome = request.nome().trim();
        var email = request.email().trim().toLowerCase();

        return new ClienteResponse(1L, nome, email);
    }
}

record CriarClienteRequest(String nome, String email) {
}

record ClienteResponse(Long id, String nome, String email) {
}
```

Uso aceitável:

```text
request e response são claros pelo construtor/método;
nome e email são claros por origem e nomes.
```

Mas se preferir explicitar `ClienteResponse`, também está correto.

---

## Aplicação em produto

Arquivo:

```text
ProdutoVar.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProdutoVar {
    public static void main(String[] args) {
        var produto = new ProdutoResumo("Cadeira", new BigDecimal("199.905"), StatusProduto.ATIVO);

        var precoAjustado = produto.preco().setScale(2, RoundingMode.HALF_UP);

        System.out.println(produto.nome());
        System.out.println(precoAjustado);
    }
}

record ProdutoResumo(String nome, BigDecimal preco, StatusProduto status) {
}

enum StatusProduto {
    ATIVO,
    INATIVO
}
```

Tipos inferidos:

```text
produto -> ProdutoResumo;
precoAjustado -> BigDecimal.
```

O código é legível porque os nomes ajudam.

---

## Aplicação em pedido

Arquivo:

```text
PedidoVar.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class PedidoVar {
    public static void main(String[] args) {
        var pedido = new PedidoResumo(
                "Ana",
                new BigDecimal("100.00"),
                new BigDecimal("10.00"),
                new BigDecimal("9.90")
        );

        var total = calcularTotal(pedido);

        System.out.println("Total: " + total);
    }

    public static BigDecimal calcularTotal(PedidoResumo pedido) {
        var subtotal = pedido.subtotal();
        var desconto = pedido.desconto();
        var frete = pedido.frete();

        return subtotal.subtract(desconto)
                .add(frete)
                .setScale(2, RoundingMode.HALF_UP);
    }
}

record PedidoResumo(
        String cliente,
        BigDecimal subtotal,
        BigDecimal desconto,
        BigDecimal frete
) {
}
```

Neste exemplo, `var` reduz repetição, mas os nomes mantêm clareza.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoVar.java
```

Código:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

public class PagamentoVar {
    public static void main(String[] args) {
        var pagamento = new PagamentoResumo(
                "PAG-001",
                new BigDecimal("100.00"),
                3,
                Instant.parse("2026-07-07T13:00:00Z")
        );

        var parcela = calcularParcela(pagamento);

        System.out.println(parcela);
    }

    public static BigDecimal calcularParcela(PagamentoResumo pagamento) {
        var divisor = BigDecimal.valueOf(pagamento.parcelas());

        return pagamento.valor().divide(divisor, 2, RoundingMode.HALF_UP);
    }
}

record PagamentoResumo(String codigo, BigDecimal valor, int parcelas, Instant criadoEm) {
}
```

Uso bom:

```text
divisor mostra claramente BigDecimal.valueOf;
parcela vem de método com nome claro.
```

Se o time preferir tipo explícito no retorno de `calcularParcela`, tudo bem.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoVar.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalTime;

public class OrdemServicoVar {
    public static void main(String[] args) {
        var os = new OrdemServicoResumo(
                "OS-001",
                StatusOs.AGENDADA,
                LocalDate.of(2026, 7, 10),
                LocalTime.of(14, 30)
        );

        var permiteReagendar = os.status() == StatusOs.AGENDADA || os.status() == StatusOs.REAGENDADA;

        System.out.println(os);
        System.out.println("Permite reagendar? " + permiteReagendar);
    }
}

record OrdemServicoResumo(
        String certificado,
        StatusOs status,
        LocalDate dataAgendada,
        LocalTime horaAgendada
) {
}

enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Tipos inferidos:

```text
os -> OrdemServicoResumo;
permiteReagendar -> boolean.
```

Aqui o `var` em boolean é aceitável porque o nome da variável é claro.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaVar.java
```

Código:

```java
import java.time.Instant;

public class MensageriaVar {
    public static void main(String[] args) {
        var mensagem = new MensagemResumo(
                "Ana",
                TipoMensagem.ENTREGA,
                "OS-001",
                Instant.parse("2026-07-07T13:00:00Z")
        );

        var texto = montarTexto(mensagem);

        System.out.println(texto);
    }

    public static String montarTexto(MensagemResumo mensagem) {
        var builder = new StringBuilder();

        builder.append("Cliente: ").append(mensagem.cliente()).append("\n");
        builder.append("Tipo: ").append(mensagem.tipo()).append("\n");
        builder.append("Certificado: ").append(mensagem.certificado()).append("\n");

        return builder.toString();
    }
}

record MensagemResumo(
        String cliente,
        TipoMensagem tipo,
        String certificado,
        Instant criadoEm
) {
}

enum TipoMensagem {
    BOAS_VINDAS,
    ENTREGA,
    NPS
}
```

`var builder = new StringBuilder();` é um uso clássico bom.

O lado direito mostra o tipo.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaVar.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class AuditoriaVar {
    public static void main(String[] args) {
        var auditoria = new AuditoriaResumo(
                "aline",
                OperacaoAuditoria.CRIACAO,
                Instant.parse("2026-07-07T13:00:00Z")
        );

        var linha = montarLinha(auditoria, ZoneId.of("America/Sao_Paulo"));

        System.out.println(linha);
    }

    public static String montarLinha(AuditoriaResumo auditoria, ZoneId zoneId) {
        var formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withZone(zoneId);

        return auditoria.usuario()
                + " | "
                + auditoria.operacao()
                + " | "
                + formatador.format(auditoria.criadoEm());
    }
}

record AuditoriaResumo(String usuario, OperacaoAuditoria operacao, Instant criadoEm) {
}

enum OperacaoAuditoria {
    CRIACAO,
    EDICAO,
    EXCLUSAO
}
```

Uso bom:

```text
formatador é claro pelo DateTimeFormatter;
linha é clara pelo método montarLinha.
```

---

## Refatoração: tipo explícito para var

Antes:

```java
BigDecimal total = pedido.subtotal()
        .subtract(pedido.desconto())
        .add(pedido.frete());
```

Depois:

```java
var total = pedido.subtotal()
        .subtract(pedido.desconto())
        .add(pedido.frete());
```

Aceitável se:

```text
pedido.subtotal, desconto e frete são claramente BigDecimal;
o contexto deixa isso evidente;
o método é pequeno.
```

Se o método for grande, talvez melhor manter:

```java
BigDecimal total = ...
```

---

## Refatoração: var para tipo explícito

Antes:

```java
var resultado = buscar();
```

Depois:

```java
ClienteResumo clienteResumo = buscarClienteResumo();
```

Ou:

```java
var clienteResumo = buscarClienteResumo();
```

Melhoria real:

```text
nome do método;
nome da variável;
tipo explícito quando necessário.
```

Não basta trocar `var` por tipo.

O objetivo é melhorar leitura.

---

## Refatoração: var com generics

Antes:

```java
var nomes = new ArrayList<>();
```

Problema:

```text
tipo genérico pode não ficar claro.
```

Depois:

```java
List<String> nomes = new ArrayList<>();
```

ou:

```java
var nomes = new ArrayList<String>();
```

Se a abstração `List` importa, prefira:

```java
List<String> nomes = new ArrayList<>();
```

---

## Quando usar var

Use `var` quando:

```text
o tipo é óbvio pelo lado direito;
o construtor já mostra o tipo;
o método estático já mostra o tipo;
o tipo explícito é muito verboso;
o escopo é curto;
o nome da variável é claro;
o código fica mais limpo sem perder informação;
é loop local simples;
é try-with-resources claro;
é builder ou formatador criado na hora.
```

Exemplos bons:

```java
var builder = new StringBuilder();
var cliente = new ClienteResumo("Ana", "ana@email.com");
var hoje = LocalDate.now();
var total = new BigDecimal("10.00");
```

---

## Quando evitar var

Evite `var` quando:

```text
o tipo não é óbvio;
o lado direito é método genérico ou ambíguo;
a variável tem escopo longo;
o tipo é importante para entender regra;
há risco de inferência primitiva indesejada;
há generics com diamond pouco claro;
a abstração da interface importa;
o código é público/contratual;
o nome da variável é ruim;
o time perderia clareza.
```

Exemplos ruins:

```java
var x = buscar();
var resultado = processar();
var dados = carregar();
var valor = calcular();
var lista = new ArrayList<>();
```

Esses exemplos podem ser melhorados com nomes e tipos explícitos.

---

## Erros comuns

### Erro 1 — Achar que var é dynamic

Não é.

O tipo é fixo em compilação.

---

### Erro 2 — Usar var com nome ruim

```java
var x = buscar();
```

Ruim.

---

### Erro 3 — Usar var para esconder tipo importante

Se o tipo é relevante, escreva.

---

### Erro 4 — Usar var com null

Não compila:

```java
var valor = null;
```

---

### Erro 5 — Usar var sem inicializar

Não compila.

---

### Erro 6 — Usar var em campo

Não compila.

---

### Erro 7 — Usar var em parâmetro comum

Não compila.

---

### Erro 8 — Usar var com generics sem pensar

Pode inferir tipo concreto ou `Object`.

---

### Erro 9 — Achar que var melhora todo código

Às vezes piora.

---

### Erro 10 — Usar var para economizar caracteres e não para melhorar leitura

Economia de caracteres não é objetivo principal.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.math.BigDecimal;

public class DebugVar {
    public static void main(String[] args) {
        var valor = new BigDecimal("10.00");
        var desconto = new BigDecimal("2.50");
        var total = valor.subtract(desconto);

        System.out.println(total);
    }
}
```

Coloque breakpoint em:

```java
var total = valor.subtract(desconto);
```

No painel de variáveis, observe:

```text
valor -> BigDecimal;
desconto -> BigDecimal;
total -> BigDecimal.
```

O `var` some na compilação.

O tipo real existe.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m2\aula-078-var-com-criterio
cd labs\m2\aula-078-var-com-criterio
```

Crie arquivos:

```text
Main.java
VarPrimitivos.java
VarBigDecimal.java
VarRecord.java
VarEnum.java
VarDatas.java
VarForClassico.java
VarForEach.java
VarTryWithResources.java
VarGenerics.java
ErroVarNaoDinamico.java
ErroVarSemInicializacao.java
ErroVarNull.java
VarMetodoPoucoClaro.java
VarMetodoClaro.java
ClienteVar.java
ProdutoVar.java
PedidoVar.java
PagamentoVar.java
OrdemServicoVar.java
MensageriaVar.java
AuditoriaVar.java
DebugVar.java
ErroVarCampo.java
ErroVarParametro.java
ErroVarArrayListObject.java
README.md
```

Compile:

```powershell
javac Main.java
javac VarPrimitivos.java
javac VarBigDecimal.java
javac VarRecord.java
javac VarEnum.java
javac VarDatas.java
javac VarForClassico.java
javac VarForEach.java
javac VarTryWithResources.java
javac VarGenerics.java
javac ErroVarNaoDinamico.java
javac ErroVarSemInicializacao.java
javac ErroVarNull.java
javac VarMetodoPoucoClaro.java
javac VarMetodoClaro.java
javac ClienteVar.java
javac ProdutoVar.java
javac PedidoVar.java
javac PagamentoVar.java
javac OrdemServicoVar.java
javac MensageriaVar.java
javac AuditoriaVar.java
javac DebugVar.java
javac ErroVarCampo.java
javac ErroVarParametro.java
javac ErroVarArrayListObject.java
```

Execute os exemplos válidos:

```powershell
java Main
java VarPrimitivos
java VarBigDecimal
java VarRecord
java VarEnum
java VarDatas
java VarForClassico
java VarForEach
java VarTryWithResources
java VarGenerics
java VarMetodoPoucoClaro
java VarMetodoClaro
java ClienteVar
java ProdutoVar
java PedidoVar
java PagamentoVar
java OrdemServicoVar
java MensageriaVar
java AuditoriaVar
java DebugVar
java ErroVarArrayListObject
```

Os arquivos abaixo devem falhar na compilação:

```text
ErroVarNaoDinamico.java
ErroVarSemInicializacao.java
ErroVarNull.java
ErroVarCampo.java
ErroVarParametro.java
```

Use esses erros para entender os limites do `var`.

---

## Observações

- Não usar `var` por moda.
- Não esconder tipo importante.
- Melhorar nomes quando usar `var`.
- Usar tipo explícito quando a leitura ficar melhor.
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
git add labs/m2/aula-078-var-com-criterio docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 078: pratica var com criterio em Java"
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
explicar var;
explicar inferência local;
explicar que var não é dynamic;
usar var com String;
usar var com int;
usar var com long;
usar var com double;
usar var com BigDecimal;
usar var com record;
usar var com enum;
usar var com LocalDate;
usar var em for;
usar var em for-each;
usar var em try-with-resources;
explicar onde var não pode ser usado;
provocar erro de var sem inicialização;
provocar erro de var com null;
provocar erro de var não dinâmico;
explicar cuidado com generics;
explicar cuidado com diamond operator;
decidir quando usar var;
decidir quando evitar var;
refatorar var para tipo explícito quando melhorar leitura;
refatorar tipo explícito para var quando reduzir ruído;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
debugar tipo inferido;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar inferência avançada com lambdas.

Não precisa ainda dominar tipos anônimos profundamente.

Não precisa ainda dominar APIs complexas de Collections.

Não precisa ainda dominar stream.

Não precisa ainda dominar pattern matching.

Esses assuntos virão depois.

O objetivo é usar `var` com maturidade: quando melhora a leitura e sem esconder informação importante.

---

## Fechamento da aula

Hoje estudamos `var` com critério.

A ideia central foi:

```text
var não é para escrever menos; é para escrever melhor quando o tipo já está claro.
```

Vimos que:

```text
var faz inferência local;
var não é tipo dinâmico;
o tipo continua fixo;
var exige inicialização;
var não aceita null como inicializador;
var pode ser usado em variáveis locais, loops e try-with-resources;
var não pode ser usado em campo, retorno ou parâmetro comum;
com generics é preciso cuidado;
com nomes ruins var piora o código;
com tipo óbvio var pode reduzir ruído.
```

O ponto mais importante é:

```text
se o leitor perde informação importante, não use var.
```

Na próxima aula, vamos estudar:

```text
Varargs.
```

A próxima aula vai explicar métodos com quantidade variável de argumentos, arrays internos, ambiguidade, boas práticas e quando evitar.
