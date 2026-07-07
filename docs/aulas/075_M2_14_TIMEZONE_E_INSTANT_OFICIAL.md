# 075 — M2.14 — Timezone e Instant

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
071 — M2.10 — Math, Random e números utilitários;
072 — M2.11 — BigDecimal desde a base;
073 — M2.12 — Locale, NumberFormat e formatação;
074 — M2.13 — java.time básico;
075 — M2.14 — Timezone e Instant.
```

Na aula anterior, estudamos `java.time` básico:

```text
LocalDate;
LocalTime;
LocalDateTime;
Period;
Duration;
DateTimeFormatter;
parse;
format;
plusDays;
isBefore;
isAfter.
```

Agora vamos estudar o problema que costuma causar bugs sérios em backend:

```text
timezone.
```

A aula anterior deixou uma frase importante:

```text
LocalDateTime não representa um instante global.
```

Agora vamos entender isso profundamente.

---

## A pergunta central da aula

Observe esta data e hora:

```text
07/07/2026 10:00
```

Pergunta:

```text
10:00 em qual lugar do mundo?
```

Pode ser:

```text
10:00 em São Paulo;
10:00 em Nova York;
10:00 em Londres;
10:00 em Tóquio.
```

Esses horários locais não representam o mesmo instante global.

Agora observe:

```text
2026-07-07T13:00:00Z
```

O `Z` indica UTC.

Esse valor representa um instante global.

Em São Paulo, dependendo da regra de fuso vigente, isso pode aparecer como:

```text
10:00 no horário local.
```

A ideia central da aula é:

```text
LocalDateTime é data/hora local;
Instant é um ponto na linha do tempo global;
ZoneId define a região/fuso para converter entre instante e horário local.
```

---

## O problema de usar LocalDateTime para tudo

`LocalDateTime` é útil, mas não serve para tudo.

Ele representa:

```text
data e hora sem timezone.
```

Exemplo:

```java
LocalDateTime dataHora = LocalDateTime.of(2026, 7, 7, 10, 0);
```

Isso significa:

```text
07/07/2026 10:00 em algum contexto local.
```

Mas não diz:

```text
qual fuso;
qual offset;
qual instante real no mundo;
se é São Paulo, UTC, Nova York ou outro lugar.
```

Para regras puramente locais, pode servir.

Para auditoria, APIs, logs, eventos distribuídos e integrações, normalmente precisamos de um ponto global.

Para isso usamos:

```java
Instant
```

---

## O que é UTC

UTC é uma referência global de tempo.

Em sistemas, usar UTC ajuda a evitar confusão entre fusos.

Exemplo:

```text
2026-07-07T13:00:00Z
```

O `Z` indica UTC.

UTC não é “horário do Brasil”.

UTC é referência global.

Quando exibimos para usuário, convertemos para o fuso local.

Regra comum em backend:

```text
armazenar eventos/auditoria em UTC;
exibir no fuso adequado do usuário ou da operação.
```

---

## O que é Instant

`Instant` representa um ponto na linha do tempo em UTC.

Import:

```java
import java.time.Instant;
```

Exemplo:

```java
Instant agora = Instant.now();
```

Saída típica:

```text
2026-07-07T18:22:51.123456Z
```

O `Instant` é excelente para:

```text
timestamp de criação;
timestamp de atualização;
logs;
auditoria;
eventos;
mensagens;
integrações;
ordenação temporal global;
armazenamento em banco;
comparação entre sistemas.
```

Ele não é bom para:

```text
data de nascimento;
data de vencimento sem hora;
horário comercial local;
turno de atendimento.
```

Para esses, use `LocalDate`, `LocalTime` ou `LocalDateTime`.

---

## O que é ZoneId

`ZoneId` representa uma região de timezone.

Exemplo:

```java
ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
ZoneId utc = ZoneId.of("UTC");
ZoneId novaYork = ZoneId.of("America/New_York");
```

`America/Sao_Paulo` não é só `-03:00`.

É uma região com regras históricas e futuras de fuso.

Isso é importante porque fusos podem ter:

```text
horário de verão;
mudanças legais;
histórico de offsets;
regras regionais.
```

Prefira `ZoneId` de região quando possível.

---

## O que é offset

Offset é a diferença em relação ao UTC.

Exemplo:

```text
-03:00
+00:00
+01:00
+09:00
```

São Paulo costuma usar `-03:00`.

Mas a região `America/Sao_Paulo` carrega mais informação histórica do que apenas `-03:00`.

Resumo:

```text
ZoneId -> região com regras;
ZoneOffset -> diferença fixa em relação ao UTC.
```

Nesta aula, vamos priorizar:

```java
ZoneId
```

---

## Vocabulário essencial

Termos desta aula:

```text
timezone;
UTC;
Instant;
ZoneId;
ZoneOffset;
ZonedDateTime;
OffsetDateTime;
LocalDateTime;
timestamp;
instante;
fuso horário;
offset;
região;
America/Sao_Paulo;
UTC;
Z;
armazenamento;
API;
integração;
auditoria;
log;
evento;
conversão;
horário local;
horário global;
now;
atZone;
toInstant;
parse;
format;
ISO;
DST;
horário de verão.
```

Termos mais importantes:

```text
Instant -> ponto global na linha do tempo em UTC;
UTC -> referência global de tempo;
ZoneId -> região/fuso usado para converter horários;
ZonedDateTime -> data/hora com timezone de região;
OffsetDateTime -> data/hora com offset fixo;
LocalDateTime -> data/hora sem timezone;
timestamp -> marca temporal de um evento;
atZone -> aplica uma zona a um Instant;
toInstant -> converte data/hora com zona para Instant.
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
import java.time.Instant;

public class Main {
    public static void main(String[] args) {
        Instant agora = Instant.now();

        System.out.println("Agora em UTC: " + agora);
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

Saída aproximada:

```text
Agora em UTC: 2026-07-07T18:22:51.123456Z
```

O valor muda a cada execução.

O `Z` indica UTC.

---

## Instant fixo

Para teste, é melhor usar valor fixo.

Arquivo:

```text
InstantFixo.java
```

Código:

```java
import java.time.Instant;

public class InstantFixo {
    public static void main(String[] args) {
        Instant instante = Instant.parse("2026-07-07T13:00:00Z");

        System.out.println(instante);
    }
}
```

Saída:

```text
2026-07-07T13:00:00Z
```

Esse valor é previsível e bom para teste.

Regra:

```text
em teste, prefira instantes fixos;
em produção, use Instant.now() quando precisar do momento atual.
```

---

## Convertendo Instant para horário local

Arquivo:

```text
InstantParaSaoPaulo.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class InstantParaSaoPaulo {
    public static void main(String[] args) {
        Instant instante = Instant.parse("2026-07-07T13:00:00Z");

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

        ZonedDateTime horarioLocal = instante.atZone(saoPaulo);

        System.out.println("Instant UTC: " + instante);
        System.out.println("São Paulo: " + horarioLocal);
    }
}
```

Saída esperada aproximada:

```text
Instant UTC: 2026-07-07T13:00:00Z
São Paulo: 2026-07-07T10:00-03:00[America/Sao_Paulo]
```

O mesmo instante global foi exibido no horário de São Paulo.

---

## Convertendo para outros fusos

Arquivo:

```text
InstantVariosFusos.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;

public class InstantVariosFusos {
    public static void main(String[] args) {
        Instant instante = Instant.parse("2026-07-07T13:00:00Z");

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
        ZoneId novaYork = ZoneId.of("America/New_York");
        ZoneId londres = ZoneId.of("Europe/London");
        ZoneId toquio = ZoneId.of("Asia/Tokyo");

        System.out.println("UTC: " + instante);
        System.out.println("São Paulo: " + instante.atZone(saoPaulo));
        System.out.println("Nova York: " + instante.atZone(novaYork));
        System.out.println("Londres: " + instante.atZone(londres));
        System.out.println("Tóquio: " + instante.atZone(toquio));
    }
}
```

O instante é o mesmo.

A hora local muda.

Esse é o conceito mais importante da aula.

---

## ZonedDateTime

`ZonedDateTime` representa:

```text
data + hora + timezone de região.
```

Exemplo:

```java
ZonedDateTime dataHora = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
```

Arquivo:

```text
ZonedDateTimeBasico.java
```

Código:

```java
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class ZonedDateTimeBasico {
    public static void main(String[] args) {
        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

        ZonedDateTime agora = ZonedDateTime.now(saoPaulo);

        System.out.println(agora);
    }
}
```

Saída aproximada:

```text
2026-07-07T15:22:51-03:00[America/Sao_Paulo]
```

Use `ZonedDateTime` quando precisa manter a zona junto da data/hora.

---

## LocalDateTime para ZonedDateTime

Arquivo:

```text
LocalDateTimeComZona.java
```

Código:

```java
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class LocalDateTimeComZona {
    public static void main(String[] args) {
        LocalDateTime local = LocalDateTime.of(2026, 7, 7, 10, 0);

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

        ZonedDateTime comZona = local.atZone(saoPaulo);

        System.out.println("LocalDateTime: " + local);
        System.out.println("Com zona: " + comZona);
        System.out.println("Instant: " + comZona.toInstant());
    }
}
```

Interpretação:

```text
pega 07/07/2026 10:00;
assume que é horário de São Paulo;
converte para instante global.
```

---

## Cuidado: atribuir zona não é converter

Este ponto é crítico.

Se você tem:

```java
LocalDateTime local = LocalDateTime.of(2026, 7, 7, 10, 0);
```

e faz:

```java
local.atZone(ZoneId.of("America/Sao_Paulo"))
```

você está dizendo:

```text
esse 10:00 é em São Paulo.
```

Você não está convertendo de UTC para São Paulo.

Para converter de UTC para São Paulo, comece com `Instant`:

```java
Instant instant = Instant.parse("2026-07-07T13:00:00Z");
ZonedDateTime saoPaulo = instant.atZone(ZoneId.of("America/Sao_Paulo"));
```

Regra:

```text
Instant.atZone converte instante para horário local;
LocalDateTime.atZone atribui uma zona a uma data/hora local.
```

---

## OffsetDateTime

`OffsetDateTime` representa:

```text
data + hora + offset.
```

Exemplo:

```text
2026-07-07T10:00-03:00
```

Ele tem offset `-03:00`, mas não tem região `America/Sao_Paulo`.

Arquivo:

```text
OffsetDateTimeBasico.java
```

Código:

```java
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class OffsetDateTimeBasico {
    public static void main(String[] args) {
        OffsetDateTime dataHora = OffsetDateTime.of(2026, 7, 7, 10, 0, 0, 0, ZoneOffset.of("-03:00"));

        System.out.println(dataHora);
        System.out.println(dataHora.toInstant());
    }
}
```

Use `OffsetDateTime` quando a API trabalha com offset explícito.

Use `ZonedDateTime` quando a região é importante.

---

## OffsetDateTime em APIs

Muitas APIs usam ISO com offset:

```text
2026-07-07T10:00:00-03:00
```

Isso diz:

```text
10:00 com offset -03:00.
```

É melhor do que apenas:

```text
2026-07-07T10:00:00
```

porque inclui offset.

Mas ainda não carrega toda regra regional do `ZoneId`.

Para APIs, formatos comuns são:

```text
Instant:        2026-07-07T13:00:00Z
OffsetDateTime: 2026-07-07T10:00:00-03:00
LocalDateTime:  2026-07-07T10:00:00
```

Cada um comunica uma coisa diferente.

---

## Formatação com timezone

Arquivo:

```text
FormatacaoComZona.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class FormatacaoComZona {
    public static void main(String[] args) {
        Instant instante = Instant.parse("2026-07-07T13:00:00Z");

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss z")
                .withZone(saoPaulo);

        String texto = formatador.format(instante);

        System.out.println(texto);
    }
}
```

Saída aproximada:

```text
07/07/2026 10:00:00 BRT
```

O formatador recebeu uma zona.

Isso permite formatar `Instant` como horário local.

---

## Armazenamento recomendado

Regra comum:

```text
armazenar eventos em UTC;
exibir no fuso do usuário ou do negócio.
```

Exemplo de evento:

```java
class Evento {
    Instant criadoEm;
}
```

Quando exibir:

```java
evento.criadoEm.atZone(ZoneId.of("America/Sao_Paulo"))
```

Por quê?

Porque se cada sistema armazena horário local sem zona, fica difícil saber a ordem real dos eventos.

UTC ajuda a ordenar, comparar e integrar.

---

## Auditoria com Instant

Arquivo:

```text
AuditoriaComInstant.java
```

Código:

```java
import java.time.Instant;

public class AuditoriaComInstant {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "CRIACAO");

        System.out.println("Usuário: " + registro.usuario);
        System.out.println("Operação: " + registro.operacao);
        System.out.println("Criado em UTC: " + registro.criadoEm);
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.criadoEm = Instant.now();

        return registro;
    }

    static class RegistroAuditoria {
        String usuario;
        String operacao;
        Instant criadoEm;
    }
}
```

Para auditoria real, `Instant` é melhor que `LocalDateTime`.

---

## Exibindo auditoria no fuso local

Arquivo:

```text
AuditoriaExibicaoLocal.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class AuditoriaExibicaoLocal {
    public static void main(String[] args) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = "aline";
        registro.operacao = "CRIACAO";
        registro.criadoEm = Instant.parse("2026-07-07T13:00:00Z");

        System.out.println(montarLinha(registro, ZoneId.of("America/Sao_Paulo")));
    }

    public static String montarLinha(RegistroAuditoria registro, ZoneId zoneId) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withZone(zoneId);

        return registro.usuario
                + " | "
                + registro.operacao
                + " | "
                + formatador.format(registro.criadoEm);
    }

    static class RegistroAuditoria {
        String usuario;
        String operacao;
        Instant criadoEm;
    }
}
```

Saída:

```text
aline | CRIACAO | 07/07/2026 10:00:00
```

O registro continua em UTC.

Só a apresentação muda.

---

## Duração entre instantes

Para medir diferença entre eventos, use `Duration`.

Arquivo:

```text
DuracaoEntreInstants.java
```

Código:

```java
import java.time.Duration;
import java.time.Instant;

public class DuracaoEntreInstants {
    public static void main(String[] args) {
        Instant inicio = Instant.parse("2026-07-07T13:00:00Z");
        Instant fim = Instant.parse("2026-07-07T13:45:30Z");

        Duration duracao = Duration.between(inicio, fim);

        System.out.println("Segundos: " + duracao.toSeconds());
        System.out.println("Minutos: " + duracao.toMinutes());
    }
}
```

Use isso para:

```text
tempo de processamento;
tempo em fila;
tempo de atendimento;
tempo entre eventos;
SLA técnico.
```

---

## Validação de expiração

Arquivo:

```text
ValidacaoExpiracao.java
```

Código:

```java
import java.time.Duration;
import java.time.Instant;

public class ValidacaoExpiracao {
    public static void main(String[] args) {
        Instant criadoEm = Instant.parse("2026-07-07T13:00:00Z");
        Instant agora = Instant.parse("2026-07-07T13:31:00Z");

        boolean expirado = estaExpirado(criadoEm, agora, Duration.ofMinutes(30));

        System.out.println("Expirado? " + expirado);
    }

    public static boolean estaExpirado(Instant criadoEm, Instant agora, Duration validade) {
        if (criadoEm == null || agora == null || validade == null) {
            throw new IllegalArgumentException("Criado em, agora e validade são obrigatórios.");
        }

        Instant limite = criadoEm.plus(validade);

        return agora.isAfter(limite);
    }
}
```

Esse padrão aparece em:

```text
token;
link temporário;
janela de confirmação;
mensagem expirada;
sessão.
```

---

## Clock: preparando código testável

`Instant.now()` é útil, mas espalhar isso dificulta teste.

Uma forma melhor é receber o "agora" por parâmetro.

Exemplo:

```java
estaExpirado(criadoEm, agora, validade)
```

Outra forma profissional é usar `Clock`.

Arquivo:

```text
ClockBasico.java
```

Código:

```java
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;

public class ClockBasico {
    public static void main(String[] args) {
        Clock clock = Clock.systemUTC();

        Instant agora = Instant.now(clock);

        System.out.println(agora);
    }
}
```

Para teste, dá para usar clock fixo.

---

## Clock fixo para teste

Arquivo:

```text
ClockFixoTeste.java
```

Código:

```java
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

public class ClockFixoTeste {
    public static void main(String[] args) {
        Clock clock = Clock.fixed(
                Instant.parse("2026-07-07T13:00:00Z"),
                ZoneOffset.UTC
        );

        Instant agora = Instant.now(clock);

        System.out.println(agora);
    }
}
```

Saída:

```text
2026-07-07T13:00:00Z
```

Isso ajuda muito em testes automatizados.

Nesta fase, basta conhecer o conceito.

---

## Aplicação em cliente

Arquivo:

```text
ClienteUltimoAcesso.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class ClienteUltimoAcesso {
    public static void main(String[] args) {
        Cliente cliente = new Cliente();

        cliente.nome = "Ana";
        cliente.ultimoAcesso = Instant.parse("2026-07-07T13:00:00Z");

        System.out.println(formatarUltimoAcesso(cliente, ZoneId.of("America/Sao_Paulo")));
    }

    public static String formatarUltimoAcesso(Cliente cliente, ZoneId zoneId) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                .withZone(zoneId);

        return cliente.nome + " acessou em " + formatador.format(cliente.ultimoAcesso);
    }

    static class Cliente {
        String nome;
        Instant ultimoAcesso;
    }
}
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoAtualizacaoInstant.java
```

Código:

```java
import java.time.Instant;

public class ProdutoAtualizacaoInstant {
    public static void main(String[] args) {
        Produto produto = criarProduto("Cadeira");

        produto = marcarAtualizacao(produto, Instant.parse("2026-07-07T13:00:00Z"));

        System.out.println("Produto: " + produto.nome);
        System.out.println("Atualizado em: " + produto.atualizadoEm);
    }

    public static Produto criarProduto(String nome) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.criadoEm = Instant.now();

        return produto;
    }

    public static Produto marcarAtualizacao(Produto produto, Instant atualizadoEm) {
        if (produto == null || atualizadoEm == null) {
            throw new IllegalArgumentException("Produto e data de atualização são obrigatórios.");
        }

        produto.atualizadoEm = atualizadoEm;

        return produto;
    }

    static class Produto {
        String nome;
        Instant criadoEm;
        Instant atualizadoEm;
    }
}
```

Timestamp de criação/atualização costuma ser `Instant`.

---

## Aplicação em pedido

Arquivo:

```text
PedidoCriacaoUtc.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class PedidoCriacaoUtc {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("Ana", Instant.parse("2026-07-07T13:00:00Z"));

        System.out.println("Criado em UTC: " + pedido.criadoEm);
        System.out.println("Criado local: " + formatarLocal(pedido.criadoEm, ZoneId.of("America/Sao_Paulo")));
    }

    public static Pedido criarPedido(String cliente, Instant criadoEm) {
        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.criadoEm = criadoEm;

        return pedido;
    }

    public static String formatarLocal(Instant instant, ZoneId zoneId) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withZone(zoneId);

        return formatador.format(instant);
    }

    static class Pedido {
        String cliente;
        Instant criadoEm;
    }
}
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoExpiracao.java
```

Código:

```java
import java.time.Duration;
import java.time.Instant;

public class PagamentoExpiracao {
    public static void main(String[] args) {
        Pagamento pagamento = new Pagamento();

        pagamento.codigo = "PAG-001";
        pagamento.criadoEm = Instant.parse("2026-07-07T13:00:00Z");

        Instant agora = Instant.parse("2026-07-07T13:20:00Z");

        System.out.println("Expirado? " + pagamentoExpirado(pagamento, agora));
    }

    public static boolean pagamentoExpirado(Pagamento pagamento, Instant agora) {
        Duration validade = Duration.ofMinutes(15);

        return agora.isAfter(pagamento.criadoEm.plus(validade));
    }

    static class Pagamento {
        String codigo;
        Instant criadoEm;
    }
}
```

Esse padrão aparece em:

```text
PIX temporário;
link de pagamento;
sessão;
token.
```

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoAgendamentoZona.java
```

Código:

```java
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class OrdemServicoAgendamentoZona {
    public static void main(String[] args) {
        LocalDateTime dataHoraLocal = LocalDateTime.of(2026, 7, 7, 10, 0);
        ZoneId zona = ZoneId.of("America/Sao_Paulo");

        OrdemServico os = criarOs("OS-001", dataHoraLocal, zona);

        System.out.println("Agendamento local: " + dataHoraLocal);
        System.out.println("Agendamento UTC: " + os.agendamentoInstant);
    }

    public static OrdemServico criarOs(String certificado, LocalDateTime dataHoraLocal, ZoneId zona) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.zona = zona;
        os.agendamentoInstant = dataHoraLocal.atZone(zona).toInstant();

        return os;
    }

    static class OrdemServico {
        String certificado;
        ZoneId zona;
        Instant agendamentoInstant;
    }
}
```

Aqui a regra é:

```text
usuário escolheu 10:00 em São Paulo;
sistema guarda o instante UTC correspondente.
```

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaJanelaComZona.java
```

Código:

```java
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class MensageriaJanelaComZona {
    public static void main(String[] args) {
        Instant agoraUtc = Instant.parse("2026-07-07T13:00:00Z");

        boolean podeEnviar = podeEnviarNaZona(agoraUtc, ZoneId.of("America/Sao_Paulo"));

        System.out.println("Pode enviar? " + podeEnviar);
    }

    public static boolean podeEnviarNaZona(Instant agoraUtc, ZoneId zona) {
        ZonedDateTime local = agoraUtc.atZone(zona);

        LocalTime horaLocal = local.toLocalTime();

        LocalTime inicio = LocalTime.of(8, 0);
        LocalTime fim = LocalTime.of(20, 0);

        return !horaLocal.isBefore(inicio) && !horaLocal.isAfter(fim);
    }
}
```

Regra:

```text
a janela de envio depende da hora local da região.
```

Por isso começamos com `Instant` e convertemos para zona.

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaTimezone.java
```

Código:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class AuditoriaTimezone {
    public static void main(String[] args) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = "aline";
        registro.operacao = "APROVACAO";
        registro.criadoEm = Instant.parse("2026-07-07T13:00:00Z");

        System.out.println(formatarAuditoria(registro, ZoneId.of("America/Sao_Paulo")));
        System.out.println(formatarAuditoria(registro, ZoneId.of("UTC")));
    }

    public static String formatarAuditoria(RegistroAuditoria registro, ZoneId zona) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss z")
                .withZone(zona);

        return registro.usuario
                + " | "
                + registro.operacao
                + " | "
                + formatador.format(registro.criadoEm);
    }

    static class RegistroAuditoria {
        String usuario;
        String operacao;
        Instant criadoEm;
    }
}
```

O mesmo evento pode ser exibido em fusos diferentes.

O `Instant` continua igual.

---

## Refatoração: evitar LocalDateTime em auditoria

Código fraco:

```java
class RegistroAuditoria {
    LocalDateTime criadoEm;
}
```

Problema:

```text
não informa timezone;
pode ser interpretado errado;
dificulta integração;
dificulta comparação global.
```

Refatoração:

```java
class RegistroAuditoria {
    Instant criadoEm;
}
```

Na exibição:

```java
criadoEm.atZone(zoneId)
```

Regra:

```text
timestamp técnico global -> Instant;
exibição local -> ZoneId + DateTimeFormatter.
```

---

## Refatoração: receber Clock

Código difícil de testar:

```java
registro.criadoEm = Instant.now();
```

Refatoração:

```java
registro.criadoEm = Instant.now(clock);
```

Exemplo:

```java
public static RegistroAuditoria criarRegistro(String usuario, String operacao, Clock clock) {
    RegistroAuditoria registro = new RegistroAuditoria();

    registro.usuario = usuario;
    registro.operacao = operacao;
    registro.criadoEm = Instant.now(clock);

    return registro;
}
```

Em teste, você usa `Clock.fixed`.

Isso torna o resultado previsível.

---

## Erros comuns

### Erro 1 — Usar LocalDateTime como se fosse UTC

`LocalDateTime` não tem timezone.

---

### Erro 2 — Armazenar horário local sem fuso em auditoria

Pode gerar confusão em sistemas distribuídos.

---

### Erro 3 — Achar que atZone sempre converte

Em `LocalDateTime`, `atZone` atribui zona.

Em `Instant`, `atZone` converte para horário local da zona.

---

### Erro 4 — Usar offset fixo quando precisa de região

`-03:00` não é igual a `America/Sao_Paulo` em todos os contextos históricos.

---

### Erro 5 — Depender do timezone padrão da máquina

Ambiente pode mudar.

Use `ZoneId` explícito quando a regra exigir.

---

### Erro 6 — Espalhar Instant.now em regras testáveis

Prefira passar `agora` ou usar `Clock`.

---

### Erro 7 — Exibir UTC cru para usuário final sem necessidade

Usuário normalmente espera horário local.

---

### Erro 8 — Guardar String em vez de Instant

String é formato, não tipo de tempo.

---

### Erro 9 — Ignorar horário de verão/histórico

Use `ZoneId` de região para regras locais.

---

### Erro 10 — Misturar armazenamento e exibição

Armazene em UTC.

Exiba na zona adequada.

---

## Diagnóstico de timezone

Quando houver erro de horário, pergunte:

### 1. O valor é local ou global?

```text
LocalDateTime -> local;
Instant -> global.
```

### 2. O valor tem timezone?

Veja se é:

```text
ZonedDateTime;
OffsetDateTime;
Instant;
LocalDateTime.
```

### 3. O `Z` aparece?

`Z` indica UTC.

### 4. Qual ZoneId foi usado?

Exemplo:

```text
America/Sao_Paulo;
UTC;
America/New_York.
```

### 5. O sistema depende do timezone padrão?

Procure:

```java
ZoneId.systemDefault()
LocalDateTime.now()
ZonedDateTime.now()
```

sem zona explícita.

### 6. O banco/API espera UTC?

Verifique contrato.

### 7. A exibição deve ser local?

Converta com `atZone`.

### 8. O erro é de conversão ou atribuição?

`Instant.atZone` converte.

`LocalDateTime.atZone` atribui.

### 9. O teste depende do horário atual?

Use `Clock.fixed`.

### 10. Use debug

Veja `Instant`, `ZoneId` e valor convertido.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DebugTimezone {
    public static void main(String[] args) {
        Instant instante = Instant.parse("2026-07-07T13:00:00Z");

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

        ZonedDateTime local = instante.atZone(saoPaulo);

        System.out.println(instante);
        System.out.println(local);
    }
}
```

Coloque breakpoint em:

```java
ZonedDateTime local = instante.atZone(saoPaulo);
```

Observe:

```text
Instant = 2026-07-07T13:00:00Z;
ZoneId = America/Sao_Paulo;
ZonedDateTime = 2026-07-07T10:00-03:00[America/Sao_Paulo].
```

O instante é o mesmo.

A exibição local muda.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — LocalDateTime sem zona

```java
import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
        LocalDateTime dataHora = LocalDateTime.of(2026, 7, 7, 10, 0);

        System.out.println(dataHora);
    }
}
```

Explique por que não sabemos o instante global.

---

### Teste 2 — Atribuir zona errada

```java
import java.time.LocalDateTime;
import java.time.ZoneId;

public class Main {
    public static void main(String[] args) {
        LocalDateTime local = LocalDateTime.of(2026, 7, 7, 10, 0);

        System.out.println(local.atZone(ZoneId.of("UTC")).toInstant());
        System.out.println(local.atZone(ZoneId.of("America/Sao_Paulo")).toInstant());
    }
}
```

Explique por que os instantes são diferentes.

---

### Teste 3 — Converter o mesmo Instant

```java
import java.time.Instant;
import java.time.ZoneId;

public class Main {
    public static void main(String[] args) {
        Instant instant = Instant.parse("2026-07-07T13:00:00Z");

        System.out.println(instant.atZone(ZoneId.of("UTC")));
        System.out.println(instant.atZone(ZoneId.of("America/Sao_Paulo")));
    }
}
```

Explique por que o instante é o mesmo, mas a hora local muda.

---

### Teste 4 — systemDefault

Use:

```java
ZoneId.systemDefault()
```

Explique por que depender disso pode ser perigoso em servidor.

---

### Teste 5 — Instant.now em teste

Crie código com `Instant.now()`.

Execute duas vezes.

Explique por que teste fica variável.

Depois use `Clock.fixed`.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-075-timezone-instant
cd labs\m2\aula-075-timezone-instant
```

Crie arquivos:

```text
Main.java
InstantFixo.java
InstantParaSaoPaulo.java
InstantVariosFusos.java
ZonedDateTimeBasico.java
LocalDateTimeComZona.java
OffsetDateTimeBasico.java
FormatacaoComZona.java
AuditoriaComInstant.java
AuditoriaExibicaoLocal.java
DuracaoEntreInstants.java
ValidacaoExpiracao.java
ClockBasico.java
ClockFixoTeste.java
ClienteUltimoAcesso.java
ProdutoAtualizacaoInstant.java
PedidoCriacaoUtc.java
PagamentoExpiracao.java
OrdemServicoAgendamentoZona.java
MensageriaJanelaComZona.java
AuditoriaTimezone.java
DebugTimezone.java
ErroLocalDateTimeSemZona.java
ErroAtribuirZonaErrada.java
ErroSystemDefault.java
ErroInstantNowTeste.java
README.md
```

Compile:

```powershell
javac Main.java
javac InstantFixo.java
javac InstantParaSaoPaulo.java
javac InstantVariosFusos.java
javac ZonedDateTimeBasico.java
javac LocalDateTimeComZona.java
javac OffsetDateTimeBasico.java
javac FormatacaoComZona.java
javac AuditoriaComInstant.java
javac AuditoriaExibicaoLocal.java
javac DuracaoEntreInstants.java
javac ValidacaoExpiracao.java
javac ClockBasico.java
javac ClockFixoTeste.java
javac ClienteUltimoAcesso.java
javac ProdutoAtualizacaoInstant.java
javac PedidoCriacaoUtc.java
javac PagamentoExpiracao.java
javac OrdemServicoAgendamentoZona.java
javac MensageriaJanelaComZona.java
javac AuditoriaTimezone.java
javac DebugTimezone.java
javac ErroLocalDateTimeSemZona.java
javac ErroAtribuirZonaErrada.java
javac ErroSystemDefault.java
javac ErroInstantNowTeste.java
```

Execute:

```powershell
java Main
java InstantFixo
java InstantParaSaoPaulo
java InstantVariosFusos
java ZonedDateTimeBasico
java LocalDateTimeComZona
java OffsetDateTimeBasico
java FormatacaoComZona
java AuditoriaComInstant
java AuditoriaExibicaoLocal
java DuracaoEntreInstants
java ValidacaoExpiracao
java ClockBasico
java ClockFixoTeste
java ClienteUltimoAcesso
java ProdutoAtualizacaoInstant
java PedidoCriacaoUtc
java PagamentoExpiracao
java OrdemServicoAgendamentoZona
java MensageriaJanelaComZona
java AuditoriaTimezone
java DebugTimezone
java ErroLocalDateTimeSemZona
java ErroAtribuirZonaErrada
java ErroSystemDefault
java ErroInstantNowTeste
```

Use os resultados para registrar as diferenças entre horário local e instante global.

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 075 — Timezone e Instant

## Objetivo

Entender UTC, Instant, ZoneId, ZonedDateTime, OffsetDateTime e os erros clássicos de timezone em sistemas backend.

## Conceitos

- `Instant` representa um ponto global na linha do tempo em UTC.
- `UTC` é uma referência global.
- `ZoneId` representa uma região/fuso, como `America/Sao_Paulo`.
- `ZonedDateTime` representa data/hora com timezone de região.
- `OffsetDateTime` representa data/hora com offset fixo.
- `LocalDateTime` não tem timezone.
- `Instant.atZone(zone)` converte instante para horário local da zona.
- `LocalDateTime.atZone(zone)` atribui uma zona a uma data/hora local.
- Armazenar eventos em UTC costuma ser melhor.
- Exibir deve considerar o fuso do usuário ou da regra.
- `Clock.fixed` ajuda em testes.
- Não depender do timezone padrão da máquina sem necessidade.

## Comandos

```powershell
javac Main.java
java Main
javac InstantParaSaoPaulo.java
java InstantParaSaoPaulo
javac AuditoriaTimezone.java
java AuditoriaTimezone
```

## Observações

- Não usar `LocalDateTime` como timestamp global.
- Não misturar armazenamento com exibição.
- Não usar `Instant.now()` espalhado em regra difícil de testar.
- Não usar offset fixo quando a regra precisa de região.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver Instant e zona |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar conversão |
| Variables | janela Debug | Ver Instant, ZoneId e ZonedDateTime |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `atZone`, `toInstant`, `format` |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Centralizar formatação |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 075 — Timezone e Instant

### O que aprendi
Aprendi que `Instant` representa um ponto global em UTC, que `LocalDateTime` não tem timezone e que `ZoneId` é usado para converter um instante para horário local. Também aprendi a diferença entre `ZonedDateTime`, `OffsetDateTime` e `LocalDateTime`.

### O que pratiquei
Criei exemplos com `Instant.now`, `Instant.parse`, conversão para São Paulo, múltiplos fusos, `ZonedDateTime`, `OffsetDateTime`, formatação com zona, auditoria com UTC, duração entre instantes, expiração, `Clock`, `Clock.fixed` e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- UTC
- Instant
- ZoneId
- ZoneOffset
- ZonedDateTime
- OffsetDateTime
- LocalDateTime
- timestamp
- timezone
- offset
- America/Sao_Paulo
- atZone
- toInstant
- DateTimeFormatter.withZone
- Duration
- Clock
- Clock.fixed
- armazenamento em UTC
- exibição local
- API
- auditoria
- integração

### Arquivos criados
- `labs/m2/aula-075-timezone-instant/Main.java`
- `labs/m2/aula-075-timezone-instant/InstantFixo.java`
- `labs/m2/aula-075-timezone-instant/InstantParaSaoPaulo.java`
- `labs/m2/aula-075-timezone-instant/InstantVariosFusos.java`
- `labs/m2/aula-075-timezone-instant/ZonedDateTimeBasico.java`
- `labs/m2/aula-075-timezone-instant/LocalDateTimeComZona.java`
- `labs/m2/aula-075-timezone-instant/OffsetDateTimeBasico.java`
- `labs/m2/aula-075-timezone-instant/FormatacaoComZona.java`
- `labs/m2/aula-075-timezone-instant/AuditoriaComInstant.java`
- `labs/m2/aula-075-timezone-instant/AuditoriaExibicaoLocal.java`
- `labs/m2/aula-075-timezone-instant/DuracaoEntreInstants.java`
- `labs/m2/aula-075-timezone-instant/ValidacaoExpiracao.java`
- `labs/m2/aula-075-timezone-instant/ClockBasico.java`
- `labs/m2/aula-075-timezone-instant/ClockFixoTeste.java`
- `labs/m2/aula-075-timezone-instant/ClienteUltimoAcesso.java`
- `labs/m2/aula-075-timezone-instant/ProdutoAtualizacaoInstant.java`
- `labs/m2/aula-075-timezone-instant/PedidoCriacaoUtc.java`
- `labs/m2/aula-075-timezone-instant/PagamentoExpiracao.java`
- `labs/m2/aula-075-timezone-instant/OrdemServicoAgendamentoZona.java`
- `labs/m2/aula-075-timezone-instant/MensageriaJanelaComZona.java`
- `labs/m2/aula-075-timezone-instant/AuditoriaTimezone.java`
- `labs/m2/aula-075-timezone-instant/DebugTimezone.java`
- `labs/m2/aula-075-timezone-instant/ErroLocalDateTimeSemZona.java`
- `labs/m2/aula-075-timezone-instant/ErroAtribuirZonaErrada.java`
- `labs/m2/aula-075-timezone-instant/ErroSystemDefault.java`
- `labs/m2/aula-075-timezone-instant/ErroInstantNowTeste.java`
- `labs/m2/aula-075-timezone-instant/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac InstantParaSaoPaulo.java
java InstantParaSaoPaulo
javac ValidacaoExpiracao.java
java ValidacaoExpiracao
javac AuditoriaTimezone.java
java AuditoriaTimezone
```

### Erros que quero evitar
- usar `LocalDateTime` como se fosse UTC;
- armazenar horário local sem fuso em auditoria;
- achar que `atZone` sempre converte;
- usar offset fixo quando preciso de região;
- depender do timezone padrão da máquina;
- espalhar `Instant.now` em regras testáveis;
- exibir UTC cru para usuário final sem necessidade;
- guardar String em vez de Instant;
- ignorar regras de fuso;
- misturar armazenamento e exibição.

### Próximo passo
Estudar enum profissional.
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
git add labs/m2/aula-075-timezone-instant docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 075: pratica timezone e Instant em Java"
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
1. O que é UTC?
2. O que é Instant?
3. O que significa o Z no final de um timestamp?
4. O que é ZoneId?
5. O que representa America/Sao_Paulo?
6. O que é ZoneOffset?
7. Qual a diferença entre ZoneId e ZoneOffset?
8. O que é ZonedDateTime?
9. O que é OffsetDateTime?
10. LocalDateTime tem timezone?
11. Por que LocalDateTime não é bom para timestamp global?
12. O que Instant.atZone faz?
13. O que LocalDateTime.atZone faz?
14. Por que armazenar eventos em UTC?
15. Por que exibir no fuso do usuário?
16. Para que serve Clock?
17. Para que serve Clock.fixed?
18. Por que não depender de ZoneId.systemDefault?
19. Como medir duração entre dois Instants?
20. Quando usar Instant em auditoria?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar UTC;
explicar Instant;
criar Instant com now;
criar Instant fixo com parse;
explicar ZoneId;
usar America/Sao_Paulo;
converter Instant para ZonedDateTime;
converter Instant para múltiplos fusos;
explicar ZonedDateTime;
explicar OffsetDateTime;
explicar LocalDateTime sem zona;
diferenciar atribuir zona de converter instante;
formatar Instant com zona;
armazenar auditoria com Instant;
exibir auditoria em fuso local;
calcular Duration entre Instants;
validar expiração;
usar Clock básico;
usar Clock.fixed;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
diagnosticar erro de timezone;
debugar conversão de timezone;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar todos os detalhes de horário de verão.

Não precisa ainda dominar banco de dados com timestamp.

Não precisa ainda dominar serialização JSON avançada.

Não precisa ainda dominar configuração de timezone em Spring.

Não precisa ainda dominar calendário de países.

Não precisa ainda dominar cron.

Esses assuntos virão depois.

O objetivo é dominar a diferença entre horário local e instante global, usando `Instant`, `ZoneId`, `ZonedDateTime` e `OffsetDateTime`.

---

## Fechamento da aula

Hoje estudamos timezone e `Instant`.

A ideia central foi:

```text
Instant representa um ponto global em UTC; horário local depende de ZoneId.
```

Vimos que:

```text
UTC é referência global;
Instant usa UTC;
ZoneId representa região/fuso;
ZonedDateTime carrega data, hora e região;
OffsetDateTime carrega data, hora e offset;
LocalDateTime não tem timezone;
Instant.atZone converte para horário local;
LocalDateTime.atZone atribui zona a um horário local;
eventos e auditoria normalmente devem ser armazenados como Instant;
exibição deve usar o fuso adequado;
Clock ajuda em testes.
```

O ponto mais importante é:

```text
não confunda data/hora local com instante global.
```

Na próxima aula, vamos estudar:

```text
Enum profissional.
```

A próxima aula vai explicar status, atributos, métodos, `fromCode`, validação e substituição de strings mágicas.
