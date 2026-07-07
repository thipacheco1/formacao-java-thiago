# 083 — M2.22 — Pattern matching

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.22.01` — Pattern matching — Conceito profundo e quando usar.
- `M2.22.02` — Pattern matching — Implementação guiada com código realista.
- `M2.22.03` — Pattern matching — Refatoração, melhoria e leitura crítica.
- `M2.22.04` — Pattern matching — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar `instanceof` moderno, redução de cast manual, legibilidade, escopo da variável de padrão, cuidado com `null`, uso com sealed classes, visão conceitual de switch patterns, trade-offs, armadilhas, refatoração e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
079 — M2.18 — Varargs;
080 — M2.19 — Annotations básicas;
081 — M2.20 — Reflection conceitual;
082 — M2.21 — Sealed classes e interfaces;
083 — M2.22 — Pattern matching.
```

Na aula anterior, estudamos `sealed classes` e `sealed interfaces`.

Vimos que `sealed` permite criar hierarquias controladas, como:

```text
Pagamento -> Pix, Cartão, Boleto;
Resultado -> Sucesso, Erro;
Mensagem -> Boas-vindas, Entrega, NPS.
```

Agora vamos estudar uma forma mais limpa de trabalhar com tipos em tempo de execução:

```text
pattern matching.
```

O primeiro contato será com:

```java
instanceof moderno
```

E também teremos uma visão conceitual de:

```text
switch patterns.
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
083 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 83
Aulas oficiais restantes: 455
```

Contando o arquivo de abertura `000`, teremos:

```text
84 arquivos gerados no total.
```

Ainda estamos no Módulo 2, consolidando recursos modernos e fundamentos avançados de Java Core antes de avançar para text blocks, classes, encapsulamento, interfaces, coleções, exceções, Maven, banco de dados, Spring Boot e arquitetura backend.

---

## A pergunta central da aula

Antes do pattern matching, era comum escrever:

```java
if (pagamento instanceof PagamentoPix) {
    PagamentoPix pix = (PagamentoPix) pagamento;

    System.out.println(pix.chave());
}
```

O código faz duas coisas repetidas:

```text
verifica se é PagamentoPix;
faz cast para PagamentoPix.
```

Com pattern matching para `instanceof`, fica assim:

```java
if (pagamento instanceof PagamentoPix pix) {
    System.out.println(pix.chave());
}
```

Agora o Java faz:

```text
verificação de tipo;
declaração da variável já convertida.
```

Isso reduz ruído, diminui chance de cast errado e melhora leitura.

---

## O que é pattern matching

Pattern matching é uma forma de testar se um valor combina com um padrão e, quando combina, extrair uma variável já tipada.

No caso do `instanceof` moderno:

```java
if (objeto instanceof Cliente cliente) {
    System.out.println(cliente.nome());
}
```

O padrão é:

```text
Cliente cliente
```

Isso significa:

```text
se objeto for Cliente, crie a variável cliente já com tipo Cliente.
```

Sem pattern matching:

```java
if (objeto instanceof Cliente) {
    Cliente cliente = (Cliente) objeto;
}
```

Com pattern matching:

```java
if (objeto instanceof Cliente cliente) {
}
```

---

## Por que isso importa

Pattern matching melhora:

```text
legibilidade;
segurança;
redução de cast manual;
redução de duplicação;
clareza em hierarquias sealed;
modelagem de resultados;
tratamento de tipos diferentes;
código de decisão por subtipo.
```

Ele aparece muito quando você tem um tipo base e subtipos específicos.

Exemplo:

```text
Pagamento pode ser Pix, Cartão ou Boleto.
```

Você recebe:

```java
Pagamento pagamento
```

E precisa tratar cada caso.

Pattern matching ajuda a acessar os dados específicos de cada subtipo.

---

## Vocabulário essencial

Termos desta aula:

```text
pattern matching;
pattern;
instanceof moderno;
cast;
tipo base;
subtipo;
variável de padrão;
escopo;
flow scoping;
sealed;
record;
switch pattern;
type pattern;
null;
legibilidade;
polimorfismo;
hierarquia;
exhaustividade;
domínio;
resultado;
evento;
mensagem;
pagamento;
refatoração.
```

Termos mais importantes:

```text
pattern matching -> combinação de teste de tipo com extração de variável;
instanceof moderno -> `obj instanceof Tipo variavel`;
cast -> conversão explícita de tipo;
variável de padrão -> variável criada quando o padrão combina;
escopo -> região onde a variável existe;
flow scoping -> variável só existe onde o compilador sabe que o tipo é válido;
switch pattern -> uso conceitual de patterns em switch moderno;
sealed -> hierarquia controlada que combina bem com pattern matching.
```

---

## Requisito de versão

O `instanceof` com pattern matching está disponível em Java moderno.

Em ambiente Java 17 LTS, o `instanceof` moderno funciona.

Já `switch patterns` dependem de versões mais novas do Java e/ou recursos específicos da versão.

Nesta aula:

```text
os exemplos principais usam instanceof moderno;
switch patterns será apresentado de forma conceitual;
não dependa de switch pattern se o seu JDK não suportar.
```

Valide o ambiente:

```powershell
java -version
javac -version
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
        Object valor = "Java Backend";

        if (valor instanceof String texto) {
            System.out.println(texto.toUpperCase());
        }
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

Saída:

```text
JAVA BACKEND
```

O Java verificou:

```text
valor é String?
```

Como era, criou:

```java
String texto
```

dentro do `if`.

---

## Antes e depois

Arquivo:

```text
AntesDepoisInstanceOf.java
```

Código:

```java
public class AntesDepoisInstanceOf {
    public static void main(String[] args) {
        Object valor = "Ana";

        semPatternMatching(valor);
        comPatternMatching(valor);
    }

    public static void semPatternMatching(Object valor) {
        if (valor instanceof String) {
            String texto = (String) valor;

            System.out.println("Sem pattern: " + texto.toUpperCase());
        }
    }

    public static void comPatternMatching(Object valor) {
        if (valor instanceof String texto) {
            System.out.println("Com pattern: " + texto.toUpperCase());
        }
    }
}
```

A segunda versão é menor e mais segura.

---

## Pattern matching não muda o objeto

Pattern matching não transforma o objeto.

Ele apenas cria uma variável mais específica quando o tipo combina.

Exemplo:

```java
Object valor = "Ana";

if (valor instanceof String texto) {
    System.out.println(texto.length());
}
```

`valor` continua sendo uma referência declarada como `Object`.

`texto` é uma variável local com tipo `String`.

---

## Escopo da variável de padrão

A variável criada pelo pattern matching só existe onde o compilador sabe que o teste deu certo.

Arquivo:

```text
EscopoPattern.java
```

Código:

```java
public class EscopoPattern {
    public static void main(String[] args) {
        Object valor = "Java";

        if (valor instanceof String texto) {
            System.out.println(texto.toUpperCase());
        }

        // Aqui fora, a variável texto não existe.
        // System.out.println(texto);
    }
}
```

Fora do `if`, `texto` não existe.

Isso evita uso indevido.

---

## Escopo com retorno antecipado

Arquivo:

```text
EscopoComRetorno.java
```

Código:

```java
public class EscopoComRetorno {
    public static void main(String[] args) {
        imprimirTamanho("Java");
        imprimirTamanho(10);
    }

    public static void imprimirTamanho(Object valor) {
        if (!(valor instanceof String texto)) {
            System.out.println("Não é texto.");
            return;
        }

        System.out.println("Tamanho: " + texto.length());
    }
}
```

Depois do `return`, o compilador sabe:

```text
se chegou aqui, valor era String.
```

Então `texto` pode ser usado.

Esse comportamento é chamado de escopo baseado no fluxo.

---

## Cuidado com null

Se o valor for `null`, o pattern não combina.

Arquivo:

```text
PatternNull.java
```

Código:

```java
public class PatternNull {
    public static void main(String[] args) {
        Object valor = null;

        if (valor instanceof String texto) {
            System.out.println(texto);
        } else {
            System.out.println("Não é String ou é null.");
        }
    }
}
```

Saída:

```text
Não é String ou é null.
```

`null instanceof String` é falso.

---

## Pattern matching com record

Arquivo:

```text
PatternRecord.java
```

Código:

```java
public class PatternRecord {
    public static void main(String[] args) {
        Object valor = new ClienteResumo("Ana", "ana@email.com");

        if (valor instanceof ClienteResumo cliente) {
            System.out.println(cliente.nome());
            System.out.println(cliente.email());
        }
    }
}

record ClienteResumo(String nome, String email) {
}
```

Pattern matching funciona com records porque record também é tipo Java.

---

## Pattern matching com enum dentro do subtipo

Arquivo:

```text
PatternComEnum.java
```

Código:

```java
public class PatternComEnum {
    public static void main(String[] args) {
        Object valor = new PedidoResumo("PED-001", StatusPedido.APROVADO);

        if (valor instanceof PedidoResumo pedido && pedido.status() == StatusPedido.APROVADO) {
            System.out.println("Pedido aprovado: " + pedido.codigo());
        }
    }
}

record PedidoResumo(String codigo, StatusPedido status) {
}

enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

Aqui combinamos:

```text
pattern matching;
record;
enum;
operador lógico &&.
```

A variável `pedido` pode ser usada depois do `&&` porque o compilador sabe que o primeiro teste deu certo.

---

## Pattern matching com &&

Arquivo:

```text
PatternComAnd.java
```

Código:

```java
public class PatternComAnd {
    public static void main(String[] args) {
        Object valor = "Java";

        if (valor instanceof String texto && texto.length() > 3) {
            System.out.println("Texto com mais de 3 caracteres: " + texto);
        }
    }
}
```

Isso funciona porque:

```text
texto só é avaliado se valor for String.
```

O `&&` usa avaliação curta.

---

## Cuidado com ||

Este código não funciona como muita gente espera:

```java
if (valor instanceof String texto || texto.length() > 3) {
}
```

Problema:

```text
se o primeiro lado for falso, texto nem existe;
o segundo lado tentaria usar uma variável que não foi criada.
```

Regra:

```text
pattern variable funciona bem com && quando o lado esquerdo garante o tipo;
cuidado com ||.
```

---

## Pattern matching com sealed

Agora entra a conexão com a aula anterior.

Arquivo:

```text
PatternSealedPagamento.java
```

Código:

```java
import java.math.BigDecimal;

public class PatternSealedPagamento {
    public static void main(String[] args) {
        Pagamento pagamento = new PagamentoPix(new BigDecimal("100.00"), "chave-pix");

        System.out.println(descrever(pagamento));
    }

    public static String descrever(Pagamento pagamento) {
        if (pagamento instanceof PagamentoPix pix) {
            return "PIX de " + pix.valor() + " para " + pix.chave();
        }

        if (pagamento instanceof PagamentoCartao cartao) {
            return "Cartão final " + cartao.finalCartao() + " em " + cartao.parcelas() + "x";
        }

        if (pagamento instanceof PagamentoBoleto boleto) {
            return "Boleto " + boleto.codigoBarras() + " no valor de " + boleto.valor();
        }

        return "Pagamento desconhecido.";
    }
}

sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
    BigDecimal valor();
}

record PagamentoPix(BigDecimal valor, String chave) implements Pagamento {
}

record PagamentoCartao(BigDecimal valor, String finalCartao, int parcelas) implements Pagamento {
}

record PagamentoBoleto(BigDecimal valor, String codigoBarras) implements Pagamento {
}
```

Aqui `sealed` controla as possibilidades.

Pattern matching acessa dados específicos de cada subtipo.

---

## Polimorfismo versus pattern matching

Antes de usar pattern matching, pergunte:

```text
isso deveria ser polimorfismo?
```

Exemplo com polimorfismo:

```java
interface Pagamento {
    String descrever();
}
```

Cada classe implementa seu próprio `descrever`.

Exemplo com pattern matching:

```java
descrever(Pagamento pagamento) {
    if (pagamento instanceof PagamentoPix pix) {
    }
}
```

Qual é melhor?

Depende.

Use polimorfismo quando:

```text
o comportamento pertence naturalmente ao subtipo;
cada subtipo sabe executar sua regra;
você quer evitar ifs por tipo.
```

Use pattern matching quando:

```text
você está criando uma transformação externa;
não quer colocar aquele comportamento no domínio;
está montando DTO, log, relatório ou integração;
quer tratar uma sealed hierarchy em uma borda do sistema.
```

---

## Exemplo com polimorfismo

Arquivo:

```text
PolimorfismoVersusPattern.java
```

Código:

```java
import java.math.BigDecimal;

public class PolimorfismoVersusPattern {
    public static void main(String[] args) {
        Pagamento pagamento = new PagamentoPix(new BigDecimal("100.00"), "chave-pix");

        System.out.println(pagamento.descrever());
    }
}

sealed interface Pagamento permits PagamentoPix, PagamentoCartao {
    BigDecimal valor();

    String descrever();
}

record PagamentoPix(BigDecimal valor, String chave) implements Pagamento {
    @Override
    public String descrever() {
        return "PIX de " + valor + " para " + chave;
    }
}

record PagamentoCartao(BigDecimal valor, String finalCartao) implements Pagamento {
    @Override
    public String descrever() {
        return "Cartão final " + finalCartao + " no valor de " + valor;
    }
}
```

Esse código evita `instanceof`.

Mas nem todo comportamento deve ficar dentro do subtipo.

---

## Switch patterns conceitual

Em Java moderno, também existe a ideia de usar patterns em `switch`.

Conceitualmente:

```java
return switch (pagamento) {
    case PagamentoPix pix -> "PIX: " + pix.chave();
    case PagamentoCartao cartao -> "Cartão: " + cartao.finalCartao();
    case PagamentoBoleto boleto -> "Boleto: " + boleto.codigoBarras();
};
```

Isso é muito expressivo com sealed interfaces.

Mas atenção:

```text
suporte exato depende da versão do Java;
se seu JDK não suporta, use instanceof moderno;
no curso, trate switch patterns aqui como conceito.
```

O importante por enquanto é entender:

```text
sealed torna os subtipos conhecidos;
switch pattern pode tratar esses subtipos de forma mais declarativa.
```

---

## Aplicação em cliente

Arquivo:

```text
ClientePattern.java
```

Código:

```java
public class ClientePattern {
    public static void main(String[] args) {
        Cliente cliente = new ClientePessoaJuridica("Empresa ABC", "12345678000199");

        System.out.println(descrever(cliente));
    }

    public static String descrever(Cliente cliente) {
        if (cliente instanceof ClientePessoaFisica pf) {
            return "Pessoa física: " + pf.nome() + " | CPF: " + pf.cpf();
        }

        if (cliente instanceof ClientePessoaJuridica pj) {
            return "Pessoa jurídica: " + pj.razaoSocial() + " | CNPJ: " + pj.cnpj();
        }

        return "Cliente desconhecido.";
    }
}

sealed interface Cliente permits ClientePessoaFisica, ClientePessoaJuridica {
}

record ClientePessoaFisica(String nome, String cpf) implements Cliente {
}

record ClientePessoaJuridica(String razaoSocial, String cnpj) implements Cliente {
}
```

Pattern matching evita cast manual.

---

## Aplicação em produto

Arquivo:

```text
ProdutoPattern.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoPattern {
    public static void main(String[] args) {
        Produto produto = new ProdutoDigital("Curso Java", new BigDecimal("199.90"), 850);

        System.out.println(descrever(produto));
    }

    public static String descrever(Produto produto) {
        if (produto instanceof ProdutoFisico fisico) {
            return fisico.nome() + " | Peso: " + fisico.pesoKg() + "kg";
        }

        if (produto instanceof ProdutoDigital digital) {
            return digital.nome() + " | Tamanho: " + digital.tamanhoMb() + "MB";
        }

        return "Produto desconhecido.";
    }
}

sealed interface Produto permits ProdutoFisico, ProdutoDigital {
    String nome();

    BigDecimal preco();
}

record ProdutoFisico(String nome, BigDecimal preco, BigDecimal pesoKg) implements Produto {
}

record ProdutoDigital(String nome, BigDecimal preco, int tamanhoMb) implements Produto {
}
```

Cada subtipo tem dados próprios.

Pattern matching acessa esses dados sem cast manual.

---

## Aplicação em pedido

Arquivo:

```text
PedidoPattern.java
```

Código:

```java
import java.time.Instant;

public class PedidoPattern {
    public static void main(String[] args) {
        EventoPedido evento = new PedidoCancelado("PED-001", Instant.parse("2026-07-07T13:00:00Z"), "Cliente solicitou");

        System.out.println(descrever(evento));
    }

    public static String descrever(EventoPedido evento) {
        if (evento instanceof PedidoCriado criado) {
            return "Criado: " + criado.codigoPedido();
        }

        if (evento instanceof PedidoAprovado aprovado) {
            return "Aprovado: " + aprovado.codigoPedido() + " por " + aprovado.usuarioAprovador();
        }

        if (evento instanceof PedidoCancelado cancelado) {
            return "Cancelado: " + cancelado.codigoPedido() + " | Motivo: " + cancelado.motivo();
        }

        return "Evento desconhecido.";
    }
}

sealed interface EventoPedido permits PedidoCriado, PedidoAprovado, PedidoCancelado {
    String codigoPedido();

    Instant criadoEm();
}

record PedidoCriado(String codigoPedido, Instant criadoEm) implements EventoPedido {
}

record PedidoAprovado(String codigoPedido, Instant criadoEm, String usuarioAprovador) implements EventoPedido {
}

record PedidoCancelado(String codigoPedido, Instant criadoEm, String motivo) implements EventoPedido {
}
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoPattern.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoPattern {
    public static void main(String[] args) {
        Pagamento pagamento = new PagamentoCartao(new BigDecimal("100.00"), "1234", 3);

        System.out.println(resumo(pagamento));
    }

    public static String resumo(Pagamento pagamento) {
        if (pagamento instanceof PagamentoPix pix) {
            return "PIX: " + pix.chave() + " | " + pix.valor();
        }

        if (pagamento instanceof PagamentoCartao cartao) {
            return "Cartão: " + cartao.finalCartao() + " | Parcelas: " + cartao.parcelas();
        }

        if (pagamento instanceof PagamentoBoleto boleto) {
            return "Boleto: " + boleto.codigoBarras();
        }

        return "Pagamento desconhecido.";
    }
}

sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
    BigDecimal valor();
}

record PagamentoPix(BigDecimal valor, String chave) implements Pagamento {
}

record PagamentoCartao(BigDecimal valor, String finalCartao, int parcelas) implements Pagamento {
}

record PagamentoBoleto(BigDecimal valor, String codigoBarras) implements Pagamento {
}
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoPattern.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalTime;

public class OrdemServicoPattern {
    public static void main(String[] args) {
        AcaoOs acao = new ReagendarOs("OS-001", LocalDate.of(2026, 7, 10), LocalTime.of(14, 30));

        System.out.println(descrever(acao));
    }

    public static String descrever(AcaoOs acao) {
        if (acao instanceof ReagendarOs reagendar) {
            return "Reagendar " + reagendar.certificado()
                    + " para " + reagendar.novaData()
                    + " às " + reagendar.novaHora();
        }

        if (acao instanceof ConcluirOs concluir) {
            return "Concluir " + concluir.certificado();
        }

        if (acao instanceof CancelarOs cancelar) {
            return "Cancelar " + cancelar.certificado() + " | Motivo: " + cancelar.motivo();
        }

        return "Ação desconhecida.";
    }
}

sealed interface AcaoOs permits ReagendarOs, ConcluirOs, CancelarOs {
    String certificado();
}

record ReagendarOs(String certificado, LocalDate novaData, LocalTime novaHora) implements AcaoOs {
}

record ConcluirOs(String certificado) implements AcaoOs {
}

record CancelarOs(String certificado, String motivo) implements AcaoOs {
}
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaPattern.java
```

Código:

```java
public class MensageriaPattern {
    public static void main(String[] args) {
        Mensagem mensagem = new MensagemEntrega("Ana", "OS-001", true);

        System.out.println(descrever(mensagem));
    }

    public static String descrever(Mensagem mensagem) {
        if (mensagem instanceof MensagemBoasVindas boasVindas) {
            return "Boas-vindas para " + boasVindas.cliente();
        }

        if (mensagem instanceof MensagemEntrega entrega) {
            return "Entrega para " + entrega.cliente()
                    + " | OS: " + entrega.certificado()
                    + " | Ocorrência: " + entrega.geraOcorrencia();
        }

        if (mensagem instanceof MensagemNps nps) {
            return "NPS para " + nps.cliente() + " | Nota mínima: " + nps.notaMinima();
        }

        return "Mensagem desconhecida.";
    }
}

sealed interface Mensagem permits MensagemBoasVindas, MensagemEntrega, MensagemNps {
    String cliente();
}

record MensagemBoasVindas(String cliente) implements Mensagem {
}

record MensagemEntrega(String cliente, String certificado, boolean geraOcorrencia) implements Mensagem {
}

record MensagemNps(String cliente, int notaMinima) implements Mensagem {
}
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaPattern.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaPattern {
    public static void main(String[] args) {
        EventoAuditoria evento = new AuditoriaEdicao(
                "aline",
                "Produto",
                10L,
                Instant.parse("2026-07-07T13:00:00Z"),
                "preco"
        );

        System.out.println(descrever(evento));
    }

    public static String descrever(EventoAuditoria evento) {
        if (evento instanceof AuditoriaCriacao criacao) {
            return criacao.usuario() + " criou " + criacao.entidade() + " #" + criacao.entidadeId();
        }

        if (evento instanceof AuditoriaEdicao edicao) {
            return edicao.usuario() + " editou " + edicao.entidade()
                    + " #" + edicao.entidadeId()
                    + " | Campo: " + edicao.campoAlterado();
        }

        if (evento instanceof AuditoriaExclusao exclusao) {
            return exclusao.usuario() + " excluiu " + exclusao.entidade()
                    + " #" + exclusao.entidadeId()
                    + " | Motivo: " + exclusao.motivo();
        }

        return "Evento desconhecido.";
    }
}

sealed interface EventoAuditoria permits AuditoriaCriacao, AuditoriaEdicao, AuditoriaExclusao {
    String usuario();

    String entidade();

    Long entidadeId();

    Instant criadoEm();
}

record AuditoriaCriacao(String usuario, String entidade, Long entidadeId, Instant criadoEm) implements EventoAuditoria {
}

record AuditoriaEdicao(String usuario, String entidade, Long entidadeId, Instant criadoEm, String campoAlterado) implements EventoAuditoria {
}

record AuditoriaExclusao(String usuario, String entidade, Long entidadeId, Instant criadoEm, String motivo) implements EventoAuditoria {
}
```

---

## Refatoração: cast manual para pattern matching

Antes:

```java
if (valor instanceof String) {
    String texto = (String) valor;

    System.out.println(texto.toUpperCase());
}
```

Depois:

```java
if (valor instanceof String texto) {
    System.out.println(texto.toUpperCase());
}
```

Ganho:

```text
menos código;
menos repetição;
menos risco de cast errado;
mais legibilidade.
```

---

## Refatoração: Object genérico para sealed + pattern

Antes:

```java
public static String descrever(Object valor) {
    if (valor instanceof String texto) {
        return texto;
    }

    if (valor instanceof Integer numero) {
        return String.valueOf(numero);
    }

    return "desconhecido";
}
```

Isso pode ser genérico demais.

Depois, se o domínio é fechado:

```java
sealed interface Pagamento permits PagamentoPix, PagamentoCartao {
}
```

E o método recebe:

```java
public static String descrever(Pagamento pagamento) {
}
```

Melhoria:

```text
o tipo base expressa o domínio;
não aceita qualquer Object;
o compilador ajuda mais.
```

---

## Refatoração: pattern matching versus método no subtipo

Antes:

```java
if (pagamento instanceof PagamentoPix pix) {
    return "PIX: " + pix.chave();
}
```

Alternativa:

```java
pagamento.descrever()
```

Se a descrição é regra do próprio pagamento, polimorfismo pode ser melhor.

Se a descrição é uma representação externa específica, pattern matching pode ser melhor.

Critério:

```text
comportamento essencial do subtipo -> polimorfismo;
transformação externa ou borda -> pattern matching pode fazer sentido.
```

---

## Quando usar pattern matching

Use pattern matching quando:

```text
precisa verificar subtipo e acessar dados específicos;
o tipo base é mais genérico que o tipo real;
há hierarquia sealed;
quer remover cast manual;
a transformação está fora do subtipo;
está montando relatório, resposta, log ou integração;
o método continua pequeno e legível;
o conjunto de casos é claro.
```

Exemplos bons:

```text
descrever pagamento;
montar resposta por tipo de evento;
transformar mensagem por subtipo;
validar ação específica;
gerar linha de auditoria.
```

---

## Quando evitar pattern matching

Evite pattern matching quando:

```text
polimorfismo resolver melhor;
o método vira uma sequência enorme de ifs;
o tipo base é Object sem motivo;
a lógica deveria estar dentro do subtipo;
a hierarquia é aberta e cresce demais;
a decisão por tipo vira regra espalhada;
o código fica difícil de manter;
o uso de instanceof está mascarando modelagem fraca.
```

Regra prática:

```text
pattern matching melhora casts necessários; não deve virar desculpa para abandonar boa modelagem.
```

---

## Erros comuns

### Erro 1 — Achar que pattern matching muda o objeto

Não muda.

Apenas cria variável mais específica quando combina.

---

### Erro 2 — Usar variável fora do escopo

A variável do pattern existe só onde o compilador garante que ela é válida.

---

### Erro 3 — Usar || de forma incorreta

Com `||`, a variável pode não existir no segundo lado.

---

### Erro 4 — Usar pattern matching onde polimorfismo seria melhor

Nem todo `instanceof` é bom.

---

### Erro 5 — Receber Object sem necessidade

Prefira tipo base do domínio.

---

### Erro 6 — Criar if gigante por subtipo

Se o método cresceu demais, revise design.

---

### Erro 7 — Esquecer null

`null instanceof Tipo` é falso.

---

### Erro 8 — Confundir switch pattern com switch tradicional

Switch patterns dependem de suporte da versão do Java.

---

### Erro 9 — Ignorar sealed

Pattern matching fica mais forte quando combinado com sealed.

---

### Erro 10 — Repetir lógica por tipo em vários lugares

Se a mesma decisão por subtipo aparece em muitos lugares, talvez precise refatorar para polimorfismo ou serviço específico.

---

## Diagnóstico de pattern matching

Quando revisar código com pattern matching, pergunte:

### 1. O cast manual foi removido?

Bom sinal.

### 2. O tipo base é adequado?

Evite `Object` sem necessidade.

### 3. O método está pequeno?

Se ficou grande, revise.

### 4. A hierarquia é sealed?

Se sim, pattern combina bem.

### 5. O comportamento pertence ao subtipo?

Se sim, talvez polimorfismo seja melhor.

### 6. Há repetição de if por tipo em vários lugares?

Talvez precise de método no subtipo.

### 7. Há `null` possível?

Trate quando necessário.

### 8. O escopo da variável está claro?

Não tente usar fora do fluxo válido.

### 9. O uso de `&&` está correto?

A variável só existe depois do teste verdadeiro.

### 10. O código ficou mais legível?

Esse é o objetivo.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugPattern {
    public static void main(String[] args) {
        Object valor = new ClienteResumo("Ana", "ana@email.com");

        if (valor instanceof ClienteResumo cliente) {
            System.out.println(cliente.nome());
            System.out.println(cliente.email());
        }
    }
}

record ClienteResumo(String nome, String email) {
}
```

Coloque breakpoint em:

```java
if (valor instanceof ClienteResumo cliente) {
```

Observe:

```text
valor está declarado como Object;
o objeto real é ClienteResumo;
quando o pattern combina, cliente fica disponível;
cliente já tem tipo ClienteResumo.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — usar variável fora do escopo

```java
public class Main {
    public static void main(String[] args) {
        Object valor = "Java";

        if (valor instanceof String texto) {
            System.out.println(texto);
        }

        System.out.println(texto);
    }
}
```

Explique por que não compila.

---

### Teste 2 — usar || incorretamente

```java
public class Main {
    public static void main(String[] args) {
        Object valor = "Java";

        if (valor instanceof String texto || texto.length() > 3) {
            System.out.println("ok");
        }
    }
}
```

Explique por que a variável não é garantida.

---

### Teste 3 — null

```java
public class Main {
    public static void main(String[] args) {
        Object valor = null;

        if (valor instanceof String texto) {
            System.out.println(texto);
        } else {
            System.out.println("Não combinou.");
        }
    }
}
```

Explique por que não combinou.

---

### Teste 4 — pattern onde polimorfismo seria melhor

Crie uma interface com método `descrever`.

Depois escreva também uma versão com `instanceof`.

Compare qual ficou mais clara.

---

### Teste 5 — Object genérico demais

Crie método:

```java
descrever(Object valor)
```

Depois refatore para:

```java
descrever(Pagamento pagamento)
```

Explique a melhoria de domínio.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-083-pattern-matching
cd labs\m2\aula-083-pattern-matching
```

Crie arquivos:

```text
Main.java
AntesDepoisInstanceOf.java
EscopoPattern.java
EscopoComRetorno.java
PatternNull.java
PatternRecord.java
PatternComEnum.java
PatternComAnd.java
PatternSealedPagamento.java
PolimorfismoVersusPattern.java
ClientePattern.java
ProdutoPattern.java
PedidoPattern.java
PagamentoPattern.java
OrdemServicoPattern.java
MensageriaPattern.java
AuditoriaPattern.java
DebugPattern.java
ErroVariavelForaEscopo.java
ErroPatternComOr.java
ErroObjectGenericoDemais.java
ErroPolimorfismoMelhor.java
README.md
```

Compile exemplos válidos:

```powershell
javac Main.java
javac AntesDepoisInstanceOf.java
javac EscopoPattern.java
javac EscopoComRetorno.java
javac PatternNull.java
javac PatternRecord.java
javac PatternComEnum.java
javac PatternComAnd.java
javac PatternSealedPagamento.java
javac PolimorfismoVersusPattern.java
javac ClientePattern.java
javac ProdutoPattern.java
javac PedidoPattern.java
javac PagamentoPattern.java
javac OrdemServicoPattern.java
javac MensageriaPattern.java
javac AuditoriaPattern.java
javac DebugPattern.java
```

Execute exemplos válidos:

```powershell
java Main
java AntesDepoisInstanceOf
java EscopoPattern
java EscopoComRetorno
java PatternNull
java PatternRecord
java PatternComEnum
java PatternComAnd
java PatternSealedPagamento
java PolimorfismoVersusPattern
java ClientePattern
java ProdutoPattern
java PedidoPattern
java PagamentoPattern
java OrdemServicoPattern
java MensageriaPattern
java AuditoriaPattern
java DebugPattern
```

Arquivos de erro ou leitura crítica:

```text
ErroVariavelForaEscopo.java
ErroPatternComOr.java
ErroObjectGenericoDemais.java
ErroPolimorfismoMelhor.java
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
# Aula 083 — Pattern matching

## Objetivo

Entender pattern matching em Java, começando por `instanceof` moderno, redução de cast manual, legibilidade, escopo da variável de padrão, uso com sealed classes e visão conceitual de switch patterns.

## Conceitos

- Pattern matching combina teste de tipo com extração de variável.
- `instanceof` moderno evita cast manual.
- A variável do pattern só existe onde o teste é verdadeiro.
- `null instanceof Tipo` é falso.
- Pattern matching funciona bem com records.
- Pattern matching combina muito bem com sealed interfaces.
- `&&` pode usar a variável depois do teste.
- `||` exige cuidado porque a variável pode não existir.
- Pattern matching não substitui polimorfismo em todos os casos.
- Se o comportamento pertence ao subtipo, polimorfismo pode ser melhor.
- Se a transformação é externa, pattern matching pode fazer sentido.
- Switch patterns são uma evolução conceitual, mas dependem da versão do Java.

## Comandos

```powershell
javac Main.java
java Main
javac PatternSealedPagamento.java
java PatternSealedPagamento
javac AuditoriaPattern.java
java AuditoriaPattern
```

## Observações

- Não usar `Object` quando existe tipo de domínio melhor.
- Não criar métodos gigantes com vários `instanceof`.
- Não tentar usar variável de pattern fora do escopo.
- Sempre comparar pattern matching com alternativa polimórfica.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver tipo real e variável de pattern |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar testes de tipo |
| Variables | janela Debug | Ver Object e subtipo real |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `instanceof` e acessores |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes dos patterns |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Separar descrição por subtipo |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 083 — Pattern matching

### O que aprendi
Aprendi que pattern matching permite testar tipo e criar uma variável já convertida, reduzindo cast manual. Também aprendi que a variável do pattern tem escopo controlado pelo fluxo e que pattern matching combina muito bem com sealed interfaces e records.

### O que pratiquei
Criei exemplos com `instanceof` moderno, comparação antes/depois, escopo da variável, retorno antecipado, null, records, enums, `&&`, sealed interfaces, polimorfismo versus pattern matching e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- pattern matching
- instanceof moderno
- type pattern
- variável de padrão
- cast manual
- escopo
- flow scoping
- null
- &&
- ||
- record
- enum
- sealed interface
- subtipo
- tipo base
- polimorfismo
- switch patterns conceitual
- legibilidade
- refatoração

### Arquivos criados
- `labs/m2/aula-083-pattern-matching/Main.java`
- `labs/m2/aula-083-pattern-matching/AntesDepoisInstanceOf.java`
- `labs/m2/aula-083-pattern-matching/EscopoPattern.java`
- `labs/m2/aula-083-pattern-matching/EscopoComRetorno.java`
- `labs/m2/aula-083-pattern-matching/PatternNull.java`
- `labs/m2/aula-083-pattern-matching/PatternRecord.java`
- `labs/m2/aula-083-pattern-matching/PatternComEnum.java`
- `labs/m2/aula-083-pattern-matching/PatternComAnd.java`
- `labs/m2/aula-083-pattern-matching/PatternSealedPagamento.java`
- `labs/m2/aula-083-pattern-matching/PolimorfismoVersusPattern.java`
- `labs/m2/aula-083-pattern-matching/ClientePattern.java`
- `labs/m2/aula-083-pattern-matching/ProdutoPattern.java`
- `labs/m2/aula-083-pattern-matching/PedidoPattern.java`
- `labs/m2/aula-083-pattern-matching/PagamentoPattern.java`
- `labs/m2/aula-083-pattern-matching/OrdemServicoPattern.java`
- `labs/m2/aula-083-pattern-matching/MensageriaPattern.java`
- `labs/m2/aula-083-pattern-matching/AuditoriaPattern.java`
- `labs/m2/aula-083-pattern-matching/DebugPattern.java`
- `labs/m2/aula-083-pattern-matching/ErroVariavelForaEscopo.java`
- `labs/m2/aula-083-pattern-matching/ErroPatternComOr.java`
- `labs/m2/aula-083-pattern-matching/ErroObjectGenericoDemais.java`
- `labs/m2/aula-083-pattern-matching/ErroPolimorfismoMelhor.java`
- `labs/m2/aula-083-pattern-matching/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac AntesDepoisInstanceOf.java
java AntesDepoisInstanceOf
javac PatternSealedPagamento.java
java PatternSealedPagamento
javac AuditoriaPattern.java
java AuditoriaPattern
```

### Erros que quero evitar
- achar que pattern matching muda o objeto;
- usar variável fora do escopo;
- usar `||` de forma incorreta;
- usar pattern matching onde polimorfismo seria melhor;
- receber `Object` sem necessidade;
- criar if gigante por subtipo;
- esquecer null;
- confundir switch pattern com switch tradicional;
- ignorar sealed;
- repetir lógica por tipo em vários lugares.

### Próximo passo
Estudar text blocks.
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
git add labs/m2/aula-083-pattern-matching docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 083: pratica pattern matching em Java"
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
1. O que é pattern matching?
2. O que é instanceof moderno?
3. Qual problema do cast manual?
4. Como pattern matching reduz cast?
5. O que é variável de padrão?
6. Onde a variável de pattern existe?
7. O que acontece com null em instanceof?
8. Como usar pattern matching com &&?
9. Por que || exige cuidado?
10. Pattern matching muda o objeto original?
11. Como pattern matching combina com record?
12. Como pattern matching combina com enum?
13. Como pattern matching combina com sealed?
14. Quando usar pattern matching?
15. Quando evitar pattern matching?
16. Quando polimorfismo é melhor?
17. Por que evitar Object genérico demais?
18. O que é switch pattern conceitualmente?
19. Por que switch patterns dependem da versão do Java?
20. Como diagnosticar ifs por tipo repetidos?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar pattern matching;
usar instanceof moderno;
remover cast manual;
explicar variável de padrão;
explicar escopo da variável;
usar pattern matching com retorno antecipado;
tratar null;
usar pattern matching com record;
usar pattern matching com enum;
usar pattern matching com &&;
explicar problema com ||;
usar pattern matching com sealed interface;
comparar pattern matching com polimorfismo;
explicar switch patterns conceitualmente;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
diagnosticar Object genérico demais;
diagnosticar método com if gigante;
refatorar cast manual;
debugar pattern matching;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar switch patterns avançado.

Não precisa ainda dominar record patterns.

Não precisa ainda dominar guards avançados em switch.

Não precisa ainda dominar exaustividade completa com sealed.

Não precisa ainda dominar pattern matching em versões preview.

Esses assuntos virão depois.

O objetivo é dominar o `instanceof` moderno e entender como pattern matching melhora legibilidade quando usado com critério.

---

## Fechamento da aula

Hoje estudamos pattern matching.

A ideia central foi:

```text
pattern matching combina verificação de tipo com criação de variável já tipada.
```

Vimos que:

```text
instanceof moderno reduz cast manual;
a variável do pattern tem escopo controlado;
null não combina com instanceof;
&& funciona bem quando o teste vem primeiro;
|| exige cuidado;
records funcionam bem com pattern matching;
sealed interfaces combinam muito bem com pattern matching;
pattern matching não substitui polimorfismo em todos os casos;
switch patterns são uma evolução conceitual dependente da versão do Java.
```

O ponto mais importante é:

```text
use pattern matching para melhorar legibilidade, não para espalhar decisões por tipo sem critério.
```

Na próxima aula, vamos estudar:

```text
Text blocks.
```

A próxima aula vai explicar strings multilinha, JSON/SQL em testes, indentação, formatação, armadilhas e uso profissional em backend.
