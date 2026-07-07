# 082 — M2.21 — Sealed classes e interfaces

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.21.01` — Sealed classes e interfaces — Conceito profundo e quando usar.
- `M2.21.02` — Sealed classes e interfaces — Implementação guiada com código realista.
- `M2.21.03` — Sealed classes e interfaces — Refatoração, melhoria e leitura crítica.
- `M2.21.04` — Sealed classes e interfaces — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar modelagem fechada, hierarquias controladas e uso moderno com `sealed`, `permits`, `final`, `non-sealed`, `sealed interface`, leitura crítica, refatoração, riscos, limites e aplicação em cenários de cliente, produto, pedido, pagamento, OS, auditoria e mensageria.

---

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
078 — M2.17 — Var com critério;
079 — M2.18 — Varargs;
080 — M2.19 — Annotations básicas;
081 — M2.20 — Reflection conceitual;
082 — M2.21 — Sealed classes e interfaces.
```

Na aula anterior, estudamos reflection conceitual.

Agora vamos estudar uma funcionalidade moderna do Java para controlar hierarquias de tipos:

```text
sealed classes;
sealed interfaces.
```

A pergunta principal desta aula é:

```text
como permitir herança, mas somente para um conjunto conhecido de classes?
```

Herança totalmente aberta pode gerar risco.

Herança totalmente bloqueada pode limitar a modelagem.

`sealed` fica no meio:

```text
permite extensão, mas controla quem pode estender.
```

---

## Progresso geral do curso

Neste momento, estamos gerando a aula oficial:

```text
082 de 538
```

Após esta aula:

```text
Aulas oficiais concluídas: 82
Aulas oficiais restantes: 456
```

Contando o arquivo de abertura `000`, teremos:

```text
83 arquivos gerados no total.
```

Ainda estamos no Módulo 2, consolidando recursos modernos e fundamentos avançados de Java Core antes de avançar para classes, encapsulamento, interfaces, coleções, exceções, Maven, banco de dados, Spring Boot e arquitetura backend.

---

## A pergunta central da aula

Imagine um sistema de pagamento.

Existem três formas aceitas:

```text
PIX;
cartão;
boleto.
```

Você pode modelar assim:

```java
interface Pagamento {
}
```

E depois criar:

```java
class PagamentoPix implements Pagamento {
}

class PagamentoCartao implements Pagamento {
}

class PagamentoBoleto implements Pagamento {
}
```

Mas se a interface for pública e aberta, qualquer pessoa pode criar:

```java
class PagamentoCripto implements Pagamento {
}
```

Talvez isso não seja permitido pelo domínio.

Com sealed interface:

```java
sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
}
```

Agora o Java sabe:

```text
somente PagamentoPix, PagamentoCartao e PagamentoBoleto podem implementar Pagamento.
```

Essa é a ideia:

```text
hierarquia controlada.
```

---

## O que é sealed

`sealed` é um modificador usado para restringir quais classes ou interfaces podem estender ou implementar um tipo.

Exemplo:

```java
public sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
}
```

A palavra-chave principal:

```text
sealed
```

A lista de permitidos:

```text
permits
```

As classes permitidas:

```text
PagamentoPix;
PagamentoCartao;
PagamentoBoleto.
```

Cada classe permitida precisa declarar uma destas opções:

```text
final;
sealed;
non-sealed.
```

Isso é obrigatório.

---

## Por que sealed existe

Antes de sealed, você tinha basicamente duas opções:

### Herança aberta

```java
public interface Pagamento {
}
```

Qualquer classe pode implementar.

### Herança bloqueada

```java
public final class PagamentoPix {
}
```

Ninguém pode estender.

Mas faltava uma opção intermediária:

```text
permitir extensão apenas para tipos conhecidos.
```

`sealed` resolve isso.

Ele ajuda em modelagens como:

```text
resultado de operação;
tipo de pagamento;
evento de domínio;
comando;
resposta de integração;
estado de processo;
tipo de notificação;
status com dados;
erro controlado;
hierarquia de mensagens.
```

---

## Vocabulário essencial

Termos desta aula:

```text
sealed;
permits;
final;
non-sealed;
sealed class;
sealed interface;
hierarquia fechada;
hierarquia controlada;
subtipo permitido;
extensão;
implementação;
herança;
polimorfismo;
domínio;
modelagem;
exhaustividade;
switch;
instanceof;
classe abstrata;
interface;
record;
compilador;
contrato;
tipo fechado;
tipo aberto.
```

Termos mais importantes:

```text
sealed -> restringe quem pode estender ou implementar;
permits -> lista subtipos permitidos;
final -> subtipo permitido que encerra a hierarquia;
non-sealed -> subtipo permitido que reabre a hierarquia;
sealed interface -> interface com implementações controladas;
sealed class -> classe com subclasses controladas;
hierarquia fechada -> conjunto conhecido de subtipos;
modelagem fechada -> domínio no qual as possibilidades são controladas.
```

---

## Requisito importante de versão

`sealed classes` e `sealed interfaces` são recursos modernos do Java.

Na prática, use com Java 17 ou superior em projeto LTS moderno.

Se o ambiente estiver em Java antigo, pode não compilar.

Verifique:

```powershell
java -version
javac -version
```

Esperado em ambiente moderno:

```text
17 ou superior.
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
        Pagamento pagamento = new PagamentoPix("chave-pix");

        System.out.println(descrever(pagamento));
    }

    public static String descrever(Pagamento pagamento) {
        if (pagamento instanceof PagamentoPix pix) {
            return "Pagamento PIX: " + pix.chave();
        }

        if (pagamento instanceof PagamentoCartao cartao) {
            return "Pagamento cartão: " + cartao.finalCartao();
        }

        if (pagamento instanceof PagamentoBoleto boleto) {
            return "Pagamento boleto: " + boleto.codigoBarras();
        }

        return "Pagamento desconhecido.";
    }
}

sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
}

record PagamentoPix(String chave) implements Pagamento {
}

record PagamentoCartao(String finalCartao) implements Pagamento {
}

record PagamentoBoleto(String codigoBarras) implements Pagamento {
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
Pagamento PIX: chave-pix
```

Aqui:

```text
Pagamento é sealed;
apenas três records podem implementar;
cada record representa uma forma conhecida de pagamento.
```

---

## permits

A palavra `permits` lista quem pode herdar ou implementar.

Exemplo:

```java
sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
}
```

Significa:

```text
PagamentoPix pode implementar Pagamento;
PagamentoCartao pode implementar Pagamento;
PagamentoBoleto pode implementar Pagamento;
qualquer outro tipo não pode.
```

Se tentar:

```java
record PagamentoCripto(String carteira) implements Pagamento {
}
```

vai falhar na compilação.

---

## Erro de tipo não permitido

Arquivo:

```text
ErroTipoNaoPermitido.java
```

Código propositalmente problemático:

```java
public class ErroTipoNaoPermitido {
    public static void main(String[] args) {
        Pagamento pagamento = new PagamentoCripto("wallet");

        System.out.println(pagamento);
    }
}

sealed interface Pagamento permits PagamentoPix {
}

record PagamentoPix(String chave) implements Pagamento {
}

record PagamentoCripto(String carteira) implements Pagamento {
}
```

Esse código não compila.

Motivo:

```text
PagamentoCripto não está listado em permits.
```

Esse é o controle da hierarquia.

---

## Subtipo permitido precisa declarar final, sealed ou non-sealed

Quando uma classe estende uma sealed class, ela precisa escolher uma destas opções:

```text
final;
sealed;
non-sealed.
```

Exemplo com classes:

```java
sealed class Evento permits EventoPedidoCriado {
}

final class EventoPedidoCriado extends Evento {
}
```

Se não declarar, o compilador acusa erro.

Com record, o record já é final por natureza.

Por isso, records funcionam muito bem como subtipos de sealed interface.

---

## Exemplo com sealed class

Arquivo:

```text
SealedClassBasica.java
```

Código:

```java
public class SealedClassBasica {
    public static void main(String[] args) {
        Evento evento = new EventoPedidoCriado("PED-001");

        System.out.println(evento.descricao());
    }
}

sealed abstract class Evento permits EventoPedidoCriado, EventoPedidoCancelado {
    public abstract String descricao();
}

final class EventoPedidoCriado extends Evento {
    private final String codigoPedido;

    EventoPedidoCriado(String codigoPedido) {
        this.codigoPedido = codigoPedido;
    }

    @Override
    public String descricao() {
        return "Pedido criado: " + codigoPedido;
    }
}

final class EventoPedidoCancelado extends Evento {
    private final String codigoPedido;

    EventoPedidoCancelado(String codigoPedido) {
        this.codigoPedido = codigoPedido;
    }

    @Override
    public String descricao() {
        return "Pedido cancelado: " + codigoPedido;
    }
}
```

Saída:

```text
Pedido criado: PED-001
```

Aqui usamos sealed class abstrata.

---

## final

`final` encerra a hierarquia.

Exemplo:

```java
final class PagamentoPix implements Pagamento {
}
```

Significa:

```text
PagamentoPix pode implementar Pagamento;
ninguém pode estender PagamentoPix.
```

Use `final` quando aquele subtipo é terminal.

Em domínio, muitos subtipos de sealed interface serão finais.

---

## non-sealed

`non-sealed` reabre a hierarquia.

Exemplo:

```java
sealed interface Notificacao permits NotificacaoInterna, NotificacaoExterna {
}

final class NotificacaoInterna implements Notificacao {
}

non-sealed class NotificacaoExterna implements Notificacao {
}
```

Agora qualquer classe pode estender `NotificacaoExterna`.

Use com cuidado.

`non-sealed` diz:

```text
este subtipo é permitido pelo sealed original, mas a partir dele a hierarquia volta a ser aberta.
```

---

## Exemplo com non-sealed

Arquivo:

```text
NonSealedExemplo.java
```

Código:

```java
public class NonSealedExemplo {
    public static void main(String[] args) {
        Notificacao notificacao = new NotificacaoEmail();

        System.out.println(notificacao.getClass().getSimpleName());
    }
}

sealed interface Notificacao permits NotificacaoSistema, NotificacaoExterna {
}

final class NotificacaoSistema implements Notificacao {
}

non-sealed class NotificacaoExterna implements Notificacao {
}

class NotificacaoEmail extends NotificacaoExterna {
}
```

`NotificacaoEmail` não implementa `Notificacao` diretamente.

Ela herda de um subtipo `non-sealed`.

Isso reabre parte da hierarquia.

---

## sealed continuando a hierarquia

Um subtipo permitido também pode ser `sealed`.

Exemplo:

```java
sealed interface Evento permits EventoPedido {
}

sealed class EventoPedido implements Evento permits PedidoCriado, PedidoCancelado {
}

final class PedidoCriado extends EventoPedido {
}

final class PedidoCancelado extends EventoPedido {
}
```

Isso permite hierarquia controlada em níveis.

Use quando precisa agrupar subtipos.

---

## Exemplo com sealed em dois níveis

Arquivo:

```text
SealedDoisNiveis.java
```

Código:

```java
public class SealedDoisNiveis {
    public static void main(String[] args) {
        Evento evento = new PedidoCriado("PED-001");

        System.out.println(evento.getClass().getSimpleName());
    }
}

sealed interface Evento permits EventoPedido {
}

sealed abstract class EventoPedido implements Evento permits PedidoCriado, PedidoCancelado {
}

final class PedidoCriado extends EventoPedido {
    private final String codigo;

    PedidoCriado(String codigo) {
        this.codigo = codigo;
    }
}

final class PedidoCancelado extends EventoPedido {
    private final String codigo;

    PedidoCancelado(String codigo) {
        this.codigo = codigo;
    }
}
```

Esse modelo é mais complexo.

Só use quando a hierarquia realmente pedir.

---

## Sealed interface com records

Uma combinação moderna muito boa:

```text
sealed interface + records.
```

Exemplo:

```java
sealed interface Resultado permits Sucesso, Erro {
}

record Sucesso(String mensagem) implements Resultado {
}

record Erro(String codigo, String mensagem) implements Resultado {
}
```

Por que combina bem?

```text
records são finais;
records carregam dados;
sealed controla possibilidades;
compilador conhece os subtipos.
```

Isso é excelente para modelar resultados controlados.

---

## Resultado de operação

Arquivo:

```text
ResultadoOperacao.java
```

Código:

```java
public class ResultadoOperacao {
    public static void main(String[] args) {
        Resultado resultado = criarCliente("Ana");

        System.out.println(descrever(resultado));
    }

    public static Resultado criarCliente(String nome) {
        if (nome == null || nome.isBlank()) {
            return new Erro("CLIENTE_NOME_OBRIGATORIO", "Nome do cliente é obrigatório.");
        }

        return new Sucesso("Cliente criado com sucesso.");
    }

    public static String descrever(Resultado resultado) {
        if (resultado instanceof Sucesso sucesso) {
            return sucesso.mensagem();
        }

        if (resultado instanceof Erro erro) {
            return erro.codigo() + " - " + erro.mensagem();
        }

        return "Resultado desconhecido.";
    }
}

sealed interface Resultado permits Sucesso, Erro {
}

record Sucesso(String mensagem) implements Resultado {
}

record Erro(String codigo, String mensagem) implements Resultado {
}
```

Esse padrão evita retorno solto como:

```text
String;
null;
boolean sem contexto.
```

---

## Por que sealed ajuda com switch

Quando o compilador conhece todos os subtipos, ele pode ajudar em verificações de completude em alguns contextos modernos.

A próxima aula vai estudar pattern matching com mais profundidade.

Nesta aula, basta entender:

```text
sealed torna o conjunto de subtipos conhecido;
isso ajuda o compilador e melhora modelagem.
```

Exemplo conceitual:

```text
Pagamento pode ser PIX, cartão ou boleto;
não existe outro pagamento fora do permits.
```

Isso reduz casos esquecidos.

---

## Sealed não substitui enum

Enum e sealed resolvem problemas diferentes.

### Enum

Bom para valores simples e fixos:

```java
enum StatusPedido {
    PENDENTE,
    APROVADO,
    RECUSADO
}
```

### Sealed

Bom quando cada opção pode carregar dados diferentes:

```java
sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
}

record PagamentoPix(String chave) implements Pagamento {
}

record PagamentoCartao(String finalCartao, int parcelas) implements Pagamento {
}

record PagamentoBoleto(String codigoBarras) implements Pagamento {
}
```

Regra:

```text
se as opções são simples, enum pode bastar;
se cada opção tem estrutura própria, sealed pode ser melhor.
```

---

## Exemplo: enum versus sealed

Arquivo:

```text
EnumVersusSealed.java
```

Código:

```java
public class EnumVersusSealed {
    public static void main(String[] args) {
        StatusPagamento status = StatusPagamento.CONFIRMADO;

        Pagamento pagamento = new PagamentoCartao("1234", 3);

        System.out.println(status);
        System.out.println(descrever(pagamento));
    }

    public static String descrever(Pagamento pagamento) {
        if (pagamento instanceof PagamentoPix pix) {
            return "PIX: " + pix.chave();
        }

        if (pagamento instanceof PagamentoCartao cartao) {
            return "Cartão final " + cartao.finalCartao() + " em " + cartao.parcelas() + "x";
        }

        if (pagamento instanceof PagamentoBoleto boleto) {
            return "Boleto: " + boleto.codigoBarras();
        }

        return "Desconhecido";
    }
}

enum StatusPagamento {
    PENDENTE,
    CONFIRMADO,
    RECUSADO
}

sealed interface Pagamento permits PagamentoPix, PagamentoCartao, PagamentoBoleto {
}

record PagamentoPix(String chave) implements Pagamento {
}

record PagamentoCartao(String finalCartao, int parcelas) implements Pagamento {
}

record PagamentoBoleto(String codigoBarras) implements Pagamento {
}
```

Status é enum.

Forma de pagamento com dados diferentes é sealed.

---

## Aplicação em cliente

Arquivo:

```text
ClienteSealed.java
```

Código:

```java
public class ClienteSealed {
    public static void main(String[] args) {
        Cliente cliente = new ClientePessoaFisica("Ana", "12345678900");

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

Aqui cada tipo de cliente tem dados diferentes.

Isso pode ser melhor que uma classe cheia de campos opcionais.

---

## Aplicação em produto

Arquivo:

```text
ProdutoSealed.java
```

Código:

```java
import java.math.BigDecimal;

public class ProdutoSealed {
    public static void main(String[] args) {
        Produto produto = new ProdutoFisico("Cadeira", new BigDecimal("199.90"), new BigDecimal("12.5"));

        System.out.println(descrever(produto));
    }

    public static String descrever(Produto produto) {
        if (produto instanceof ProdutoFisico fisico) {
            return fisico.nome() + " | Peso: " + fisico.pesoKg();
        }

        if (produto instanceof ProdutoDigital digital) {
            return digital.nome() + " | Arquivo: " + digital.tamanhoMb() + "MB";
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

Produto físico e digital têm atributos diferentes.

Sealed interface controla as opções.

---

## Aplicação em pedido

Arquivo:

```text
PedidoSealed.java
```

Código:

```java
import java.time.Instant;

public class PedidoSealed {
    public static void main(String[] args) {
        EventoPedido evento = new PedidoCriado("PED-001", Instant.parse("2026-07-07T13:00:00Z"));

        System.out.println(descrever(evento));
    }

    public static String descrever(EventoPedido evento) {
        if (evento instanceof PedidoCriado criado) {
            return "Pedido criado: " + criado.codigoPedido();
        }

        if (evento instanceof PedidoAprovado aprovado) {
            return "Pedido aprovado: " + aprovado.codigoPedido();
        }

        if (evento instanceof PedidoCancelado cancelado) {
            return "Pedido cancelado: " + cancelado.codigoPedido() + " | Motivo: " + cancelado.motivo();
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

Eventos diferentes carregam dados diferentes.

Sealed modela isso muito bem.

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoSealed.java
```

Código:

```java
import java.math.BigDecimal;

public class PagamentoSealed {
    public static void main(String[] args) {
        Pagamento pagamento = new PagamentoCartao(new BigDecimal("100.00"), "1234", 3);

        System.out.println(descrever(pagamento));
    }

    public static String descrever(Pagamento pagamento) {
        if (pagamento instanceof PagamentoPix pix) {
            return "PIX no valor de " + pix.valor() + " para chave " + pix.chave();
        }

        if (pagamento instanceof PagamentoCartao cartao) {
            return "Cartão final " + cartao.finalCartao() + " em " + cartao.parcelas() + "x";
        }

        if (pagamento instanceof PagamentoBoleto boleto) {
            return "Boleto " + boleto.codigoBarras();
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

Cada forma de pagamento tem dados próprios.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoSealed.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalTime;

public class OrdemServicoSealed {
    public static void main(String[] args) {
        AcaoOs acao = new ReagendarOs("OS-001", LocalDate.of(2026, 7, 10), LocalTime.of(14, 30));

        System.out.println(descrever(acao));
    }

    public static String descrever(AcaoOs acao) {
        if (acao instanceof ReagendarOs reagendar) {
            return "Reagendar " + reagendar.certificado() + " para " + reagendar.novaData() + " " + reagendar.novaHora();
        }

        if (acao instanceof ConcluirOs concluir) {
            return "Concluir " + concluir.certificado();
        }

        if (acao instanceof CancelarOs cancelar) {
            return "Cancelar " + cancelar.certificado() + " por " + cancelar.motivo();
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

Ações de OS têm dados diferentes.

Sealed ajuda a evitar ação não prevista.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaSealed.java
```

Código:

```java
public class MensageriaSealed {
    public static void main(String[] args) {
        Mensagem mensagem = new MensagemEntrega("Ana", "OS-001", true);

        System.out.println(descrever(mensagem));
    }

    public static String descrever(Mensagem mensagem) {
        if (mensagem instanceof MensagemBoasVindas boasVindas) {
            return "Boas-vindas para " + boasVindas.cliente();
        }

        if (mensagem instanceof MensagemEntrega entrega) {
            return "Entrega para " + entrega.cliente() + " | OS: " + entrega.certificado();
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

Cada mensagem tem dados diferentes.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaSealed.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaSealed {
    public static void main(String[] args) {
        EventoAuditoria evento = new AuditoriaCriacao("aline", "Produto", 10L, Instant.parse("2026-07-07T13:00:00Z"));

        System.out.println(descrever(evento));
    }

    public static String descrever(EventoAuditoria evento) {
        if (evento instanceof AuditoriaCriacao criacao) {
            return criacao.usuario() + " criou " + criacao.entidade() + " #" + criacao.entidadeId();
        }

        if (evento instanceof AuditoriaEdicao edicao) {
            return edicao.usuario() + " editou " + edicao.entidade() + " #" + edicao.entidadeId();
        }

        if (evento instanceof AuditoriaExclusao exclusao) {
            return exclusao.usuario() + " excluiu " + exclusao.entidade() + " #" + exclusao.entidadeId();
        }

        return "Evento de auditoria desconhecido.";
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

Sealed ajuda quando os eventos permitidos são conhecidos e controlados.

---

## Refatoração: campo tipo + vários opcionais para sealed

Antes:

```java
class Pagamento {
    String tipo;
    BigDecimal valor;
    String chavePix;
    String finalCartao;
    Integer parcelas;
    String codigoBarras;
}
```

Problemas:

```text
muitos campos null;
combinações inválidas;
regra espalhada;
tipo como string mágica;
difícil validar;
difícil saber quais campos pertencem a cada tipo.
```

Depois:

```java
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

Ganho:

```text
cada tipo tem apenas seus dados;
menos null;
mais segurança;
hierarquia controlada.
```

---

## Refatoração: interface aberta para sealed

Antes:

```java
interface EventoPedido {
}
```

Qualquer tipo pode implementar.

Depois:

```java
sealed interface EventoPedido permits PedidoCriado, PedidoAprovado, PedidoCancelado {
}
```

Ganho:

```text
somente eventos conhecidos são permitidos;
o domínio fica explícito;
o compilador ajuda.
```

Use quando o domínio é realmente fechado.

---

## Quando usar sealed

Use sealed quando:

```text
o conjunto de subtipos é conhecido;
você quer controlar a hierarquia;
cada subtipo pode ter dados diferentes;
a modelagem com enum ficou limitada;
a interface aberta permite tipos indesejados;
o domínio é fechado por regra;
quer melhorar leitura de possibilidades;
quer ajudar validação do compilador;
está modelando eventos, comandos, resultados ou respostas.
```

Exemplos bons:

```text
Resultado -> Sucesso ou Erro;
Pagamento -> Pix, Cartao, Boleto;
EventoPedido -> Criado, Aprovado, Cancelado;
Mensagem -> BoasVindas, Entrega, Nps;
AcaoOs -> Reagendar, Concluir, Cancelar.
```

---

## Quando evitar sealed

Evite sealed quando:

```text
o conjunto de implementações é aberto por design;
terceiros precisam criar implementações;
o domínio muda frequentemente por configuração;
os tipos são cadastrados em banco;
uma interface simples já resolve;
a equipe ainda não domina o recurso;
o recurso piora a simplicidade;
um enum seria suficiente;
uma classe comum seria suficiente.
```

Exemplo:

```text
plugins externos;
adapters criados por outros módulos;
estratégias adicionadas por terceiros;
cadastros dinâmicos.
```

Nesses casos, interface aberta pode ser melhor.

---

## Erros comuns

### Erro 1 — Usar sealed sem necessidade

Se enum resolve, use enum.

---

### Erro 2 — Esquecer permits

Uma sealed class/interface precisa declarar ou inferir permitidos em condições específicas.

Para clareza no curso, use `permits`.

---

### Erro 3 — Subtipo permitido sem final/sealed/non-sealed

O compilador exige um desses.

---

### Erro 4 — Tentar implementar sealed sem estar em permits

Não compila.

---

### Erro 5 — Usar non-sealed sem perceber que reabre a hierarquia

`non-sealed` remove o controle a partir daquele subtipo.

---

### Erro 6 — Criar hierarquia profunda demais

Sealed ajuda, mas hierarquia excessiva atrapalha.

---

### Erro 7 — Confundir sealed com segurança de negócio absoluta

Sealed controla tipos em compilação.

Não substitui validação de dados.

---

### Erro 8 — Colocar dados demais em interface

Interface deve ter contrato comum.

Dados específicos ficam nos subtipos.

---

### Erro 9 — Usar sealed onde o domínio é dinâmico

Se valores vêm de cadastro, sealed provavelmente não é ideal.

---

### Erro 10 — Ignorar compatibilidade de versão Java

Precisa Java moderno.

---

## Diagnóstico de sealed

Quando revisar uma modelagem sealed, pergunte:

### 1. O conjunto de subtipos é realmente fechado?

Se não, evite sealed.

### 2. Cada subtipo tem dados diferentes?

Se sim, sealed pode ajudar.

### 3. Enum seria suficiente?

Se sim, enum é mais simples.

### 4. Interface aberta é necessária?

Se terceiros implementam, sealed pode atrapalhar.

### 5. Cada subtipo declarou final, sealed ou non-sealed?

Precisa.

### 6. non-sealed foi usado com intenção?

Se não, revise.

### 7. Os nomes representam o domínio?

Subtipos precisam ser claros.

### 8. Há muitos campos null no modelo antigo?

Sealed pode melhorar.

### 9. A hierarquia ficou complexa demais?

Talvez simplificar.

### 10. O Java do projeto suporta?

Verifique versão.

---

## Debug recomendado

Use debug neste exemplo:

```java
public class DebugSealed {
    public static void main(String[] args) {
        Pagamento pagamento = new PagamentoPix("chave-pix");

        System.out.println(pagamento.getClass().getSimpleName());

        if (pagamento instanceof PagamentoPix pix) {
            System.out.println(pix.chave());
        }
    }
}

sealed interface Pagamento permits PagamentoPix, PagamentoCartao {
}

record PagamentoPix(String chave) implements Pagamento {
}

record PagamentoCartao(String finalCartao) implements Pagamento {
}
```

Coloque breakpoint em:

```java
if (pagamento instanceof PagamentoPix pix) {
```

Observe:

```text
pagamento é do tipo declarado Pagamento;
objeto real é PagamentoPix;
instanceof identifica o subtipo;
pix permite acessar dados específicos.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — subtipo não permitido

```java
sealed interface Pagamento permits PagamentoPix {
}

record PagamentoPix(String chave) implements Pagamento {
}

record PagamentoCripto(String carteira) implements Pagamento {
}
```

Explique por que não compila.

---

### Teste 2 — classe permitida sem final/sealed/non-sealed

```java
sealed class Evento permits EventoCriado {
}

class EventoCriado extends Evento {
}
```

Explique por que precisa declarar:

```text
final;
sealed;
non-sealed.
```

---

### Teste 3 — non-sealed reabrindo hierarquia

Crie subtipo `non-sealed`.

Depois crie uma classe que estende esse subtipo.

Explique como a hierarquia foi reaberta.

---

### Teste 4 — enum seria suficiente

Modele status simples com sealed.

Depois modele com enum.

Explique qual ficou mais simples.

---

### Teste 5 — sealed com campo tipo duplicado

Crie records sealed, mas mantenha um campo `tipo`.

Explique quando isso é redundante e quando pode ser necessário para integração externa.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-082-sealed-classes-interfaces
cd labs\m2\aula-082-sealed-classes-interfaces
```

Crie arquivos:

```text
Main.java
ErroTipoNaoPermitido.java
SealedClassBasica.java
NonSealedExemplo.java
SealedDoisNiveis.java
ResultadoOperacao.java
EnumVersusSealed.java
ClienteSealed.java
ProdutoSealed.java
PedidoSealed.java
PagamentoSealed.java
OrdemServicoSealed.java
MensageriaSealed.java
AuditoriaSealed.java
DebugSealed.java
ErroSubtipoNaoPermitido.java
ErroSubtipoSemFinal.java
ErroNonSealedSemIntencao.java
ErroEnumSeriaSuficiente.java
ErroSealedComTipoDuplicado.java
README.md
```

Compile exemplos válidos:

```powershell
javac Main.java
javac SealedClassBasica.java
javac NonSealedExemplo.java
javac SealedDoisNiveis.java
javac ResultadoOperacao.java
javac EnumVersusSealed.java
javac ClienteSealed.java
javac ProdutoSealed.java
javac PedidoSealed.java
javac PagamentoSealed.java
javac OrdemServicoSealed.java
javac MensageriaSealed.java
javac AuditoriaSealed.java
javac DebugSealed.java
```

Execute exemplos válidos:

```powershell
java Main
java SealedClassBasica
java NonSealedExemplo
java SealedDoisNiveis
java ResultadoOperacao
java EnumVersusSealed
java ClienteSealed
java ProdutoSealed
java PedidoSealed
java PagamentoSealed
java OrdemServicoSealed
java MensageriaSealed
java AuditoriaSealed
java DebugSealed
```

Os arquivos abaixo devem falhar na compilação ou representar modelagem problemática:

```text
ErroTipoNaoPermitido.java
ErroSubtipoNaoPermitido.java
ErroSubtipoSemFinal.java
ErroNonSealedSemIntencao.java
ErroEnumSeriaSuficiente.java
ErroSealedComTipoDuplicado.java
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
# Aula 082 — Sealed classes e interfaces

## Objetivo

Entender sealed classes e sealed interfaces em Java, aprendendo a modelar hierarquias controladas com `sealed`, `permits`, `final`, `sealed` e `non-sealed`.

## Conceitos

- `sealed` controla quem pode estender ou implementar.
- `permits` lista os subtipos permitidos.
- Subtipo permitido precisa declarar `final`, `sealed` ou `non-sealed`.
- `final` encerra a hierarquia.
- `sealed` continua a hierarquia controlada.
- `non-sealed` reabre a hierarquia.
- Sealed interface combina bem com records.
- Sealed ajuda quando o conjunto de subtipos é conhecido.
- Enum é melhor para valores simples.
- Sealed é melhor quando cada subtipo tem dados diferentes.
- Sealed não substitui validação de dados.
- Sealed não deve ser usado quando o domínio é aberto ou dinâmico.

## Comandos

```powershell
javac Main.java
java Main
javac ResultadoOperacao.java
java ResultadoOperacao
javac PagamentoSealed.java
java PagamentoSealed
```

## Observações

- Verificar Java 17 ou superior.
- Não usar sealed por moda.
- Não usar non-sealed sem intenção clara.
- Não criar hierarquia complexa sem necessidade.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver subtipo real |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar instanceof |
| Variables | janela Debug | Ver tipo declarado e tipo real |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `getClass` e `instanceof` |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes de subtipos |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Separar descrição/validação |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 082 — Sealed classes e interfaces

### O que aprendi
Aprendi que `sealed` permite criar hierarquias controladas em Java, definindo exatamente quais classes ou interfaces podem estender ou implementar um tipo. Também aprendi a diferença entre `final`, `sealed` e `non-sealed`.

### O que pratiquei
Criei exemplos com sealed interface, sealed class, permits, records como subtipos, non-sealed, sealed em dois níveis, resultado de operação, enum versus sealed e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- sealed
- permits
- final
- non-sealed
- sealed class
- sealed interface
- hierarquia controlada
- hierarquia fechada
- subtipo permitido
- record
- enum versus sealed
- modelagem de domínio
- polimorfismo
- instanceof
- domínio fechado
- domínio aberto

### Arquivos criados
- `labs/m2/aula-082-sealed-classes-interfaces/Main.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ErroTipoNaoPermitido.java`
- `labs/m2/aula-082-sealed-classes-interfaces/SealedClassBasica.java`
- `labs/m2/aula-082-sealed-classes-interfaces/NonSealedExemplo.java`
- `labs/m2/aula-082-sealed-classes-interfaces/SealedDoisNiveis.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ResultadoOperacao.java`
- `labs/m2/aula-082-sealed-classes-interfaces/EnumVersusSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ClienteSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ProdutoSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/PedidoSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/PagamentoSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/OrdemServicoSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/MensageriaSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/AuditoriaSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/DebugSealed.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ErroSubtipoNaoPermitido.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ErroSubtipoSemFinal.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ErroNonSealedSemIntencao.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ErroEnumSeriaSuficiente.java`
- `labs/m2/aula-082-sealed-classes-interfaces/ErroSealedComTipoDuplicado.java`
- `labs/m2/aula-082-sealed-classes-interfaces/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac ResultadoOperacao.java
java ResultadoOperacao
javac PagamentoSealed.java
java PagamentoSealed
javac AuditoriaSealed.java
java AuditoriaSealed
```

### Erros que quero evitar
- usar sealed sem necessidade;
- esquecer permits;
- criar subtipo permitido sem `final`, `sealed` ou `non-sealed`;
- tentar implementar sealed sem estar em permits;
- usar `non-sealed` sem perceber que reabre a hierarquia;
- criar hierarquia profunda demais;
- confundir sealed com validação de negócio absoluta;
- colocar dados demais na interface;
- usar sealed onde o domínio é dinâmico;
- ignorar compatibilidade de versão Java.

### Próximo passo
Estudar pattern matching.
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
git add labs/m2/aula-082-sealed-classes-interfaces docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 082: pratica sealed classes e interfaces em Java"
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
1. O que é sealed?
2. Para que serve permits?
3. O que é sealed class?
4. O que é sealed interface?
5. O que significa final em um subtipo permitido?
6. O que significa non-sealed?
7. O que significa sealed em um subtipo permitido?
8. Por que o subtipo precisa declarar final, sealed ou non-sealed?
9. Quando usar sealed?
10. Quando evitar sealed?
11. Qual a diferença entre enum e sealed?
12. Quando enum é mais simples?
13. Quando sealed é melhor que enum?
14. Por que sealed interface combina com record?
15. O que acontece se um tipo não listado tentar implementar sealed?
16. Por que non-sealed exige cuidado?
17. Sealed substitui validação de dados?
18. O que é hierarquia controlada?
19. Como sealed ajuda na modelagem de domínio?
20. Qual cuidado com versão do Java?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar sealed;
explicar permits;
criar sealed interface;
criar sealed class;
criar subtipo final;
criar subtipo non-sealed;
criar subtipo sealed;
explicar hierarquia controlada;
usar records com sealed interface;
explicar erro de subtipo não permitido;
explicar erro de subtipo sem final/sealed/non-sealed;
diferenciar enum e sealed;
modelar resultado com Sucesso e Erro;
modelar pagamento com Pix, Cartao e Boleto;
modelar cliente PF/PJ;
modelar produto físico/digital;
modelar evento de pedido;
modelar ação de OS;
modelar mensagem;
modelar evento de auditoria;
diagnosticar uso indevido de non-sealed;
diagnosticar quando enum seria suficiente;
diagnosticar domínio dinâmico;
debugar subtipo real;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar pattern matching em switch.

Não precisa ainda dominar exaustividade avançada.

Não precisa ainda dominar sealed com módulos Java.

Não precisa ainda dominar hierarquias complexas de frameworks.

Não precisa ainda dominar design patterns avançados.

Esses assuntos virão depois.

O objetivo é dominar a base de hierarquias controladas com `sealed`, `permits`, `final`, `sealed` e `non-sealed`.

---

## Fechamento da aula

Hoje estudamos sealed classes e interfaces.

A ideia central foi:

```text
sealed permite controlar quem pode estender ou implementar um tipo.
```

Vimos que:

```text
sealed cria hierarquia controlada;
permits lista subtipos permitidos;
subtipo permitido precisa ser final, sealed ou non-sealed;
final encerra a hierarquia;
non-sealed reabre a hierarquia;
sealed pode continuar a hierarquia controlada;
sealed interface combina muito bem com records;
enum é melhor para valores simples;
sealed é melhor quando cada opção tem dados diferentes.
```

O ponto mais importante é:

```text
use sealed quando o domínio tem um conjunto fechado de possibilidades e você quer que o compilador ajude a proteger essa modelagem.
```

Na próxima aula, vamos estudar:

```text
Pattern matching.
```

A próxima aula vai explicar `instanceof` moderno, legibilidade, redução de cast manual, introdução conceitual a switch patterns e como isso combina com sealed.
