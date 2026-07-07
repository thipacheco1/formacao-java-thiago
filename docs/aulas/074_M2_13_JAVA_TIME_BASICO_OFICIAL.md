# 074 — M2.13 — java.time básico

## Onde estamos na formação

Estamos no Módulo 2.

A sequência recente foi:

```text
070 — M2.09 — Conversões e casting;
071 — M2.10 — Math, Random e números utilitários;
072 — M2.11 — BigDecimal desde a base;
073 — M2.12 — Locale, NumberFormat e formatação;
074 — M2.13 — java.time básico.
```

Na aula anterior, estudamos `Locale` e `NumberFormat`.

Agora vamos entrar em datas e horários modernos do Java.

Em sistemas backend, data e hora aparecem em quase tudo:

```text
data de nascimento;
data de cadastro;
data de vencimento;
data de agendamento;
data de entrega;
data de criação;
data de atualização;
data de aprovação;
data de auditoria;
janela de envio;
prazo;
SLA;
tempo de execução;
diferença entre horários;
relatórios por período.
```

Java moderno usa o pacote:

```java
java.time
```

Essa API substitui a maior parte dos usos antigos de `Date` e `Calendar`.

Nesta aula, vamos focar na base:

```text
LocalDate;
LocalTime;
LocalDateTime;
Duration;
Period;
DateTimeFormatter.
```

Timezone, UTC, `Instant`, `ZoneId` e `OffsetDateTime` virão na próxima aula.

---

## A pergunta central da aula

Observe esta regra:

```text
uma OS pode ser reagendada para daqui a 3 dias.
```

Como representar isso em Java?

Com texto?

```java
String data = "10/07/2026";
```

Funciona visualmente, mas é ruim para cálculo.

Com número?

```java
int data = 20260710;
```

Pode até ordenar, mas é ruim para regra.

Com a API moderna:

```java
LocalDate dataAgendada = LocalDate.now().plusDays(3);
```

Agora temos um tipo próprio de data.

Podemos fazer:

```java
dataAgendada.isAfter(LocalDate.now())
dataAgendada.plusDays(1)
dataAgendada.format(formatador)
```

Essa é a ideia da aula:

```text
usar tipos corretos para datas e horários, não Strings soltas.
```

---

## Cálculo, armazenamento e exibição

Assim como vimos em dinheiro:

```text
BigDecimal para cálculo;
NumberFormat para exibição.
```

Em datas também há separação:

```text
LocalDate, LocalTime e LocalDateTime para representar valores;
DateTimeFormatter para transformar em texto ou ler texto;
String apenas na entrada/saída.
```

Regra profissional:

```text
não use String como tipo principal de data dentro da regra de negócio.
```

Use `String` quando:

```text
recebeu texto de fora;
vai exibir texto para usuário;
vai montar log textual;
vai gerar arquivo.
```

Use `java.time` para:

```text
calcular;
comparar;
somar prazo;
validar vencimento;
representar data e horário no domínio.
```

---

## Vocabulário essencial

Termos desta aula:

```text
java.time;
LocalDate;
LocalTime;
LocalDateTime;
Duration;
Period;
DateTimeFormatter;
now;
of;
parse;
format;
plusDays;
minusDays;
plusHours;
minusHours;
isBefore;
isAfter;
isEqual;
getDayOfWeek;
getMonth;
getYear;
data;
hora;
data e hora;
prazo;
período;
duração;
formatação;
parsing;
imutabilidade;
DateTimeParseException.
```

Termos mais importantes:

```text
LocalDate -> representa uma data sem horário e sem timezone;
LocalTime -> representa um horário sem data e sem timezone;
LocalDateTime -> representa data e hora sem timezone;
Period -> diferença baseada em anos, meses e dias;
Duration -> diferença baseada em horas, minutos, segundos e nanos;
DateTimeFormatter -> formata e interpreta datas/horas;
now -> data/hora atual conforme relógio do sistema;
of -> cria valor específico;
parse -> transforma texto em data/hora;
format -> transforma data/hora em texto.
```

---

## LocalDate

`LocalDate` representa uma data.

Exemplos:

```text
2026-07-07;
2026-12-25;
2027-01-01.
```

Ela não tem horário.

Ela não tem timezone.

Uso:

```java
import java.time.LocalDate;

LocalDate hoje = LocalDate.now();
LocalDate natal = LocalDate.of(2026, 12, 25);
```

Use `LocalDate` para:

```text
data de nascimento;
data de vencimento;
data de agendamento sem hora;
data de entrega;
data de início;
data de fim;
data de cadastro quando hora não importa.
```

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.now();
        LocalDate dataFixa = LocalDate.of(2026, 7, 7);

        System.out.println("Hoje: " + hoje);
        System.out.println("Data fixa: " + dataFixa);
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
Hoje: 2026-07-07
Data fixa: 2026-07-07
```

A saída de `LocalDate` padrão usa ISO:

```text
yyyy-MM-dd
```

---

## LocalTime

`LocalTime` representa horário.

Exemplos:

```text
08:30;
14:45;
23:59:59.
```

Não tem data.

Não tem timezone.

Arquivo:

```text
LocalTimeBasico.java
```

Código:

```java
import java.time.LocalTime;

public class LocalTimeBasico {
    public static void main(String[] args) {
        LocalTime agora = LocalTime.now();
        LocalTime horarioAgendado = LocalTime.of(14, 30);

        System.out.println("Agora: " + agora);
        System.out.println("Horário agendado: " + horarioAgendado);
    }
}
```

Use `LocalTime` para:

```text
horário de abertura;
horário de fechamento;
turno;
janela diária;
hora de envio;
hora limite.
```

---

## LocalDateTime

`LocalDateTime` representa data e hora.

Exemplo:

```text
2026-07-07T14:30
```

Arquivo:

```text
LocalDateTimeBasico.java
```

Código:

```java
import java.time.LocalDateTime;

public class LocalDateTimeBasico {
    public static void main(String[] args) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime agendamento = LocalDateTime.of(2026, 7, 7, 14, 30);

        System.out.println("Agora: " + agora);
        System.out.println("Agendamento: " + agendamento);
    }
}
```

Use `LocalDateTime` quando a regra precisa de:

```text
data e hora locais;
criação de registro;
atualização;
agendamento com horário local;
evento sem timezone explícito.
```

Atenção:

```text
LocalDateTime não representa um instante global.
```

Para instantes globais, UTC e timezone, estudaremos `Instant` e `ZoneId` na próxima aula.

---

## Imutabilidade em java.time

As classes principais de `java.time` são imutáveis.

Exemplo:

```java
LocalDate hoje = LocalDate.now();

hoje.plusDays(3);

System.out.println(hoje);
```

`hoje` não muda.

`plusDays` retorna outra data.

Correção:

```java
hoje = hoje.plusDays(3);
```

Ou melhor:

```java
LocalDate daquiTresDias = hoje.plusDays(3);
```

Esse comportamento é parecido com `String` e `BigDecimal`.

---

## Exemplo de imutabilidade

Arquivo:

```text
JavaTimeImutavel.java
```

Código:

```java
import java.time.LocalDate;

public class JavaTimeImutavel {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 7);

        data.plusDays(3);

        System.out.println("Sem capturar retorno: " + data);

        LocalDate novaData = data.plusDays(3);

        System.out.println("Capturando retorno: " + novaData);
    }
}
```

Saída:

```text
Sem capturar retorno: 2026-07-07
Capturando retorno: 2026-07-10
```

Regra:

```text
métodos de java.time retornam novo objeto.
```

---

## Somando e subtraindo datas

Arquivo:

```text
SomaSubtracaoDatas.java
```

Código:

```java
import java.time.LocalDate;

public class SomaSubtracaoDatas {
    public static void main(String[] args) {
        LocalDate dataBase = LocalDate.of(2026, 7, 7);

        LocalDate amanha = dataBase.plusDays(1);
        LocalDate semanaQueVem = dataBase.plusWeeks(1);
        LocalDate mesQueVem = dataBase.plusMonths(1);
        LocalDate ontem = dataBase.minusDays(1);

        System.out.println("Base: " + dataBase);
        System.out.println("Amanhã: " + amanha);
        System.out.println("Semana que vem: " + semanaQueVem);
        System.out.println("Mês que vem: " + mesQueVem);
        System.out.println("Ontem: " + ontem);
    }
}
```

Métodos comuns:

```text
plusDays;
plusWeeks;
plusMonths;
plusYears;
minusDays;
minusWeeks;
minusMonths;
minusYears.
```

---

## Somando e subtraindo horários

Arquivo:

```text
SomaSubtracaoHorarios.java
```

Código:

```java
import java.time.LocalTime;

public class SomaSubtracaoHorarios {
    public static void main(String[] args) {
        LocalTime horario = LocalTime.of(14, 30);

        LocalTime maisUmaHora = horario.plusHours(1);
        LocalTime menosQuinzeMinutos = horario.minusMinutes(15);

        System.out.println("Horário: " + horario);
        System.out.println("Mais uma hora: " + maisUmaHora);
        System.out.println("Menos quinze minutos: " + menosQuinzeMinutos);
    }
}
```

Métodos comuns:

```text
plusHours;
plusMinutes;
plusSeconds;
minusHours;
minusMinutes;
minusSeconds.
```

---

## Comparando datas

Arquivo:

```text
ComparacaoDatas.java
```

Código:

```java
import java.time.LocalDate;

public class ComparacaoDatas {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.of(2026, 7, 7);
        LocalDate vencimento = LocalDate.of(2026, 7, 10);

        System.out.println("Vencimento antes de hoje? " + vencimento.isBefore(hoje));
        System.out.println("Vencimento depois de hoje? " + vencimento.isAfter(hoje));
        System.out.println("Vencimento igual hoje? " + vencimento.isEqual(hoje));
    }
}
```

Use:

```text
isBefore;
isAfter;
isEqual.
```

Isso é mais legível que comparar texto.

---

## Validação de vencimento

Arquivo:

```text
ValidacaoVencimento.java
```

Código:

```java
import java.time.LocalDate;

public class ValidacaoVencimento {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.of(2026, 7, 7);
        LocalDate vencimento = LocalDate.of(2026, 7, 6);

        if (estaVencido(vencimento, hoje)) {
            System.out.println("Título vencido.");
        } else {
            System.out.println("Título em dia.");
        }
    }

    public static boolean estaVencido(LocalDate vencimento, LocalDate dataReferencia) {
        if (vencimento == null) {
            throw new IllegalArgumentException("Vencimento é obrigatório.");
        }

        if (dataReferencia == null) {
            throw new IllegalArgumentException("Data de referência é obrigatória.");
        }

        return vencimento.isBefore(dataReferencia);
    }
}
```

Regra:

```text
se vencimento é anterior à data de referência, está vencido.
```

---

## Period

`Period` representa uma diferença em anos, meses e dias.

Use para datas.

Exemplo:

```java
Period periodo = Period.between(dataInicio, dataFim);
```

Arquivo:

```text
PeriodBasico.java
```

Código:

```java
import java.time.LocalDate;
import java.time.Period;

public class PeriodBasico {
    public static void main(String[] args) {
        LocalDate nascimento = LocalDate.of(1990, 5, 20);
        LocalDate hoje = LocalDate.of(2026, 7, 7);

        Period idade = Period.between(nascimento, hoje);

        System.out.println("Anos: " + idade.getYears());
        System.out.println("Meses: " + idade.getMonths());
        System.out.println("Dias: " + idade.getDays());
    }
}
```

`Period` é bom para:

```text
idade;
tempo entre datas;
prazo em dias/meses/anos;
diferença calendário.
```

---

## Calculando idade

Arquivo:

```text
CalculoIdade.java
```

Código:

```java
import java.time.LocalDate;
import java.time.Period;

public class CalculoIdade {
    public static void main(String[] args) {
        LocalDate nascimento = LocalDate.of(1990, 5, 20);
        LocalDate referencia = LocalDate.of(2026, 7, 7);

        int idade = calcularIdade(nascimento, referencia);

        System.out.println("Idade: " + idade);
    }

    public static int calcularIdade(LocalDate nascimento, LocalDate referencia) {
        if (nascimento == null || referencia == null) {
            throw new IllegalArgumentException("Datas são obrigatórias.");
        }

        if (nascimento.isAfter(referencia)) {
            throw new IllegalArgumentException("Nascimento não pode ser futuro.");
        }

        return Period.between(nascimento, referencia).getYears();
    }
}
```

Esse exemplo é comum em cadastro de cliente.

---

## Duration

`Duration` representa uma duração baseada em tempo.

Use para horas, minutos, segundos e nanos.

Exemplo:

```java
Duration duracao = Duration.between(inicio, fim);
```

Arquivo:

```text
DurationBasico.java
```

Código:

```java
import java.time.Duration;
import java.time.LocalDateTime;

public class DurationBasico {
    public static void main(String[] args) {
        LocalDateTime inicio = LocalDateTime.of(2026, 7, 7, 10, 0);
        LocalDateTime fim = LocalDateTime.of(2026, 7, 7, 12, 30);

        Duration duracao = Duration.between(inicio, fim);

        System.out.println("Minutos: " + duracao.toMinutes());
        System.out.println("Horas: " + duracao.toHours());
    }
}
```

Use `Duration` para:

```text
tempo de execução;
tempo entre eventos com hora;
SLA em minutos;
duração de atendimento;
tempo em fila;
janela de processamento.
```

---

## Duration versus Period

Regra simples:

```text
Period -> datas em anos, meses e dias;
Duration -> tempo em horas, minutos, segundos.
```

Exemplo:

```text
idade de cliente -> Period;
tempo de atendimento -> Duration;
dias até vencimento -> pode usar Period ou ChronoUnit.DAYS;
tempo de execução de processo -> Duration.
```

Não confunda.

`Period` não é ideal para medir minutos.

`Duration` não é ideal para idade em anos.

---

## DateTimeFormatter

`DateTimeFormatter` formata e interpreta datas e horários.

Import:

```java
import java.time.format.DateTimeFormatter;
```

Exemplo:

```java
DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

String texto = data.format(formatador);
```

Arquivo:

```text
FormatacaoData.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class FormatacaoData {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 7);

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        String texto = data.format(formatador);

        System.out.println(texto);
    }
}
```

Saída:

```text
07/07/2026
```

---

## Parsing de data

Parsing é transformar texto em data.

Arquivo:

```text
ParseData.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ParseData {
    public static void main(String[] args) {
        String texto = "07/07/2026";

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate data = LocalDate.parse(texto, formatador);

        System.out.println(data);
    }
}
```

Saída:

```text
2026-07-07
```

Entrada:

```text
07/07/2026
```

Objeto:

```text
LocalDate 2026-07-07
```

---

## DateTimeParseException

Se o texto não bater com o formato, ocorre erro.

Arquivo:

```text
ErroParseData.java
```

Código propositalmente problemático:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ErroParseData {
    public static void main(String[] args) {
        String texto = "2026-07-07";

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate data = LocalDate.parse(texto, formatador);

        System.out.println(data);
    }
}
```

Esse código compila.

Mas quebra em execução, porque o texto está em:

```text
yyyy-MM-dd
```

e o formatador espera:

```text
dd/MM/yyyy
```

---

## Parsing com tratamento

Arquivo:

```text
ParseDataComTratamento.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class ParseDataComTratamento {
    public static void main(String[] args) {
        LocalDate data = tentarLerDataBrasil("07/07/2026");

        if (data == null) {
            System.out.println("Data inválida.");
        } else {
            System.out.println("Data lida: " + data);
        }
    }

    public static LocalDate tentarLerDataBrasil(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        try {
            DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            return LocalDate.parse(texto.trim(), formatador);
        } catch (DateTimeParseException erro) {
            return null;
        }
    }
}
```

Esse padrão didático mostra:

```text
texto inválido -> null.
```

Mas, para campo obrigatório, muitas vezes é melhor lançar erro com mensagem clara.

---

## Parsing obrigatório

Arquivo:

```text
ParseDataObrigatoria.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class ParseDataObrigatoria {
    public static void main(String[] args) {
        LocalDate data = lerDataObrigatoria("07/07/2026", "Data de agendamento");

        System.out.println(data);
    }

    public static LocalDate lerDataObrigatoria(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatória.");
        }

        try {
            DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            return LocalDate.parse(texto.trim(), formatador);
        } catch (DateTimeParseException erro) {
            throw new IllegalArgumentException(nomeCampo + " deve estar no formato dd/MM/yyyy.");
        }
    }
}
```

Esse formato é melhor quando a data é obrigatória.

---

## Formatando LocalDateTime

Arquivo:

```text
FormatacaoDataHora.java
```

Código:

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FormatacaoDataHora {
    public static void main(String[] args) {
        LocalDateTime dataHora = LocalDateTime.of(2026, 7, 7, 14, 30, 15);

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        System.out.println(dataHora.format(formatador));
    }
}
```

Saída:

```text
07/07/2026 14:30:15
```

Padrões comuns:

```text
dd/MM/yyyy
dd/MM/yyyy HH:mm
dd/MM/yyyy HH:mm:ss
HH:mm
HH:mm:ss
yyyy-MM-dd
```

---

## Extraindo partes da data

Arquivo:

```text
PartesDaData.java
```

Código:

```java
import java.time.LocalDate;

public class PartesDaData {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 7);

        System.out.println("Ano: " + data.getYear());
        System.out.println("Mês: " + data.getMonth());
        System.out.println("Número do mês: " + data.getMonthValue());
        System.out.println("Dia do mês: " + data.getDayOfMonth());
        System.out.println("Dia da semana: " + data.getDayOfWeek());
        System.out.println("Dia do ano: " + data.getDayOfYear());
    }
}
```

Esses métodos ajudam em relatórios e regras.

---

## Aplicação em cliente

Arquivo:

```text
ClienteDataNascimento.java
```

Código:

```java
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;

public class ClienteDataNascimento {
    public static void main(String[] args) {
        Cliente cliente = criarCliente("Ana", "20/05/1990");

        LocalDate referencia = LocalDate.of(2026, 7, 7);

        System.out.println("Cliente: " + cliente.nome);
        System.out.println("Nascimento: " + formatarData(cliente.dataNascimento));
        System.out.println("Idade: " + calcularIdade(cliente.dataNascimento, referencia));
    }

    public static Cliente criarCliente(String nome, String nascimentoTexto) {
        Cliente cliente = new Cliente();

        cliente.nome = nome;
        cliente.dataNascimento = lerDataObrigatoria(nascimentoTexto, "Data de nascimento");

        return cliente;
    }

    public static LocalDate lerDataObrigatoria(String texto, String nomeCampo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(nomeCampo + " é obrigatória.");
        }

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return LocalDate.parse(texto.trim(), formatador);
    }

    public static int calcularIdade(LocalDate nascimento, LocalDate referencia) {
        return Period.between(nascimento, referencia).getYears();
    }

    public static String formatarData(LocalDate data) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return data.format(formatador);
    }

    static class Cliente {
        String nome;
        LocalDate dataNascimento;
    }
}
```

---

## Aplicação em produto

Arquivo:

```text
ProdutoValidade.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ProdutoValidade {
    public static void main(String[] args) {
        Produto produto = criarProduto("Produto A", "10/07/2026");

        LocalDate hoje = LocalDate.of(2026, 7, 7);

        System.out.println("Produto: " + produto.nome);
        System.out.println("Validade: " + formatarData(produto.validade));
        System.out.println("Vencido? " + estaVencido(produto.validade, hoje));
    }

    public static Produto criarProduto(String nome, String validadeTexto) {
        Produto produto = new Produto();

        produto.nome = nome;
        produto.validade = lerData(validadeTexto);

        return produto;
    }

    public static LocalDate lerData(String texto) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return LocalDate.parse(texto, formatador);
    }

    public static boolean estaVencido(LocalDate validade, LocalDate referencia) {
        return validade.isBefore(referencia);
    }

    public static String formatarData(LocalDate data) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return data.format(formatador);
    }

    static class Produto {
        String nome;
        LocalDate validade;
    }
}
```

---

## Aplicação em pedido

Arquivo:

```text
PedidoPrazoEntrega.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class PedidoPrazoEntrega {
    public static void main(String[] args) {
        Pedido pedido = criarPedido("Ana", LocalDate.of(2026, 7, 7), 5);

        System.out.println("Cliente: " + pedido.cliente);
        System.out.println("Data pedido: " + formatar(pedido.dataPedido));
        System.out.println("Previsão entrega: " + formatar(pedido.previsaoEntrega));
    }

    public static Pedido criarPedido(String cliente, LocalDate dataPedido, int prazoDias) {
        if (prazoDias < 0) {
            throw new IllegalArgumentException("Prazo não pode ser negativo.");
        }

        Pedido pedido = new Pedido();

        pedido.cliente = cliente;
        pedido.dataPedido = dataPedido;
        pedido.previsaoEntrega = dataPedido.plusDays(prazoDias);

        return pedido;
    }

    public static String formatar(LocalDate data) {
        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    static class Pedido {
        String cliente;
        LocalDate dataPedido;
        LocalDate previsaoEntrega;
    }
}
```

---

## Aplicação em pagamento

Arquivo:

```text
PagamentoVencimento.java
```

Código:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class PagamentoVencimento {
    public static void main(String[] args) {
        Pagamento pagamento = criarPagamento("100.00", LocalDate.of(2026, 7, 7), 30);

        System.out.println("Valor: " + pagamento.valor);
        System.out.println("Vencimento: " + formatar(pagamento.vencimento));
    }

    public static Pagamento criarPagamento(String valor, LocalDate dataBase, int diasParaVencer) {
        Pagamento pagamento = new Pagamento();

        pagamento.valor = valor;
        pagamento.vencimento = dataBase.plusDays(diasParaVencer);

        return pagamento;
    }

    public static String formatar(LocalDate data) {
        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    static class Pagamento {
        String valor;
        LocalDate vencimento;
    }
}
```

Nesta aula o foco é data.

O valor monetário pode ser `BigDecimal` em evolução futura.

---

## Aplicação em OS

Arquivo:

```text
OrdemServicoAgendamento.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class OrdemServicoAgendamento {
    public static void main(String[] args) {
        OrdemServico os = criarOs("OS-001", "10/07/2026", "14:30");

        System.out.println("Certificado: " + os.certificado);
        System.out.println("Data: " + os.dataAgendada.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        System.out.println("Hora: " + os.horaAgendada.format(DateTimeFormatter.ofPattern("HH:mm")));
    }

    public static OrdemServico criarOs(String certificado, String dataTexto, String horaTexto) {
        OrdemServico os = new OrdemServico();

        os.certificado = certificado;
        os.dataAgendada = LocalDate.parse(dataTexto, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        os.horaAgendada = LocalTime.parse(horaTexto, DateTimeFormatter.ofPattern("HH:mm"));

        return os;
    }

    static class OrdemServico {
        String certificado;
        LocalDate dataAgendada;
        LocalTime horaAgendada;
    }
}
```

Use `LocalDate` e `LocalTime` separados quando a regra separa data e turno/horário.

Use `LocalDateTime` quando precisa de data e hora juntas.

---

## Aplicação em mensageria

Arquivo:

```text
MensageriaJanelaEnvio.java
```

Código:

```java
import java.time.LocalTime;

public class MensageriaJanelaEnvio {
    public static void main(String[] args) {
        LocalTime agora = LocalTime.of(10, 30);

        if (podeEnviarAgora(agora)) {
            System.out.println("Pode enviar mensagem.");
        } else {
            System.out.println("Fora da janela de envio.");
        }
    }

    public static boolean podeEnviarAgora(LocalTime horario) {
        LocalTime inicio = LocalTime.of(8, 0);
        LocalTime fim = LocalTime.of(20, 0);

        return !horario.isBefore(inicio) && !horario.isAfter(fim);
    }
}
```

Regra:

```text
pode enviar entre 08:00 e 20:00.
```

Atenção:

```text
janela que cruza meia-noite exige regra diferente.
```

---

## Aplicação em auditoria

Arquivo:

```text
AuditoriaDataHora.java
```

Código:

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AuditoriaDataHora {
    public static void main(String[] args) {
        RegistroAuditoria registro = criarRegistro("aline", "CRIACAO");

        System.out.println(montarLinha(registro));
    }

    public static RegistroAuditoria criarRegistro(String usuario, String operacao) {
        RegistroAuditoria registro = new RegistroAuditoria();

        registro.usuario = usuario;
        registro.operacao = operacao;
        registro.dataHora = LocalDateTime.now();

        return registro;
    }

    public static String montarLinha(RegistroAuditoria registro) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        return registro.usuario
                + " | "
                + registro.operacao
                + " | "
                + registro.dataHora.format(formatador);
    }

    static class RegistroAuditoria {
        String usuario;
        String operacao;
        LocalDateTime dataHora;
    }
}
```

Atenção:

```text
para auditoria real em sistemas distribuídos, normalmente entra UTC/Instant.
```

Isso é assunto da próxima aula.

---

## Refatoração: centralizar formatadores

Código repetido:

```java
DateTimeFormatter.ofPattern("dd/MM/yyyy")
```

Refatoração didática:

```java
static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
static final DateTimeFormatter DATA_HORA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
```

`DateTimeFormatter` é imutável e seguro para reuso.

Isso é diferente de `NumberFormat`, que é mutável.

Arquivo:

```text
FormatadorDataUtil.java
```

Código:

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FormatadorDataUtil {
    static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    static final DateTimeFormatter DATA_HORA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 7);
        LocalDateTime dataHora = LocalDateTime.of(2026, 7, 7, 14, 30, 15);

        System.out.println(formatarData(data));
        System.out.println(formatarDataHora(dataHora));
    }

    public static String formatarData(LocalDate data) {
        if (data == null) {
            return "";
        }

        return data.format(DATA_BR);
    }

    public static String formatarDataHora(LocalDateTime dataHora) {
        if (dataHora == null) {
            return "";
        }

        return dataHora.format(DATA_HORA_BR);
    }
}
```

---

## Refatoração: não usar String para data no domínio

Código fraco:

```java
class Pedido {
    String dataPedido;
}
```

Problemas:

```text
não compara bem;
não soma dias;
não valida formato;
pode ter "07/07/2026" ou "2026-07-07";
pode ter texto inválido;
regra fica espalhada.
```

Refatoração:

```java
class Pedido {
    LocalDate dataPedido;
}
```

A formatação fica na entrada/saída.

A regra fica com tipo correto.

---

## Erros comuns

### Erro 1 — Usar String como data principal

Use `LocalDate`, `LocalTime` ou `LocalDateTime`.

---

### Erro 2 — Ignorar retorno de plusDays

Classes java.time são imutáveis.

---

### Erro 3 — Confundir LocalDateTime com instante global

`LocalDateTime` não tem timezone.

`Instant` virá na próxima aula.

---

### Erro 4 — Usar Period para medir horas

Use `Duration`.

---

### Erro 5 — Usar Duration para idade

Use `Period`.

---

### Erro 6 — Usar formato errado no parse

Texto e formatter precisam combinar.

---

### Erro 7 — Não tratar DateTimeParseException

Entrada externa pode vir inválida.

---

### Erro 8 — Usar now espalhado em regra de negócio

Para testes, é melhor receber data de referência por parâmetro.

Exemplo:

```java
estaVencido(vencimento, hoje)
```

em vez de chamar `LocalDate.now()` dentro de tudo.

---

### Erro 9 — Não validar data futura/passada

Data tecnicamente válida pode ser inválida para a regra.

---

### Erro 10 — Achar que LocalDate tem hora

`LocalDate` é só data.

---

## Diagnóstico de datas

Quando uma regra de data falhar, pergunte:

### 1. O tipo escolhido está correto?

```text
data -> LocalDate;
hora -> LocalTime;
data e hora -> LocalDateTime;
duração -> Duration;
período calendário -> Period.
```

### 2. O texto bate com o formatter?

```text
dd/MM/yyyy;
yyyy-MM-dd;
HH:mm.
```

### 3. O método retorna novo objeto?

Se usou `plusDays`, capturou o retorno?

### 4. A regra precisa de timezone?

Se sim, espere a próxima aula e use `Instant`, `ZoneId` ou tipos adequados.

### 5. A data de referência é fixa em teste?

Evite depender de `now()` em teste.

### 6. A data pode ser null?

Valide.

### 7. A data pode ser futura ou passada?

Valide conforme regra.

### 8. Está comparando String?

Converta para tipo de data.

### 9. Está usando Period ou Duration corretamente?

Period para data.

Duration para tempo.

### 10. Use debug

Veja o valor real do objeto de data, não só o texto formatado.

---

## Debug recomendado

Use debug neste exemplo:

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DebugJavaTime {
    public static void main(String[] args) {
        String texto = "07/07/2026";

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate data = LocalDate.parse(texto, formatador);

        LocalDate novaData = data.plusDays(3);

        System.out.println(data);
        System.out.println(novaData);
    }
}
```

Coloque breakpoint em:

```java
LocalDate data = LocalDate.parse(texto, formatador);
```

Observe:

```text
texto = 07/07/2026;
data = 2026-07-07;
novaData = 2026-07-10.
```

Veja que `data` não muda.

`novaData` recebe outro objeto.

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Ignorar retorno de plusDays

```java
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 7);

        data.plusDays(3);

        System.out.println(data);
    }
}
```

Explique por que continua `2026-07-07`.

---

### Teste 2 — Parse com formato errado

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        LocalDate data = LocalDate.parse("2026-07-07", DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        System.out.println(data);
    }
}
```

Explique `DateTimeParseException`.

---

### Teste 3 — Data inválida

```java
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 2, 30);

        System.out.println(data);
    }
}
```

Explique por que fevereiro não tem dia 30.

---

### Teste 4 — Comparar data como String

Compare:

```text
"10/07/2026"
"09/08/2026"
```

como String e depois como `LocalDate`.

Explique por que String não é o tipo certo para regra.

---

### Teste 5 — LocalDateTime sem timezone

Crie:

```java
LocalDateTime.of(2026, 7, 7, 10, 0)
```

Explique que isso representa data/hora local, mas não diz em qual timezone do mundo.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-074-java-time-basico
cd labs\m2\aula-074-java-time-basico
```

Crie arquivos:

```text
Main.java
LocalTimeBasico.java
LocalDateTimeBasico.java
JavaTimeImutavel.java
SomaSubtracaoDatas.java
SomaSubtracaoHorarios.java
ComparacaoDatas.java
ValidacaoVencimento.java
PeriodBasico.java
CalculoIdade.java
DurationBasico.java
FormatacaoData.java
ParseData.java
ErroParseData.java
ParseDataComTratamento.java
ParseDataObrigatoria.java
FormatacaoDataHora.java
PartesDaData.java
ClienteDataNascimento.java
ProdutoValidade.java
PedidoPrazoEntrega.java
PagamentoVencimento.java
OrdemServicoAgendamento.java
MensageriaJanelaEnvio.java
AuditoriaDataHora.java
FormatadorDataUtil.java
DebugJavaTime.java
ErroIgnorarRetornoData.java
ErroFormatoParse.java
ErroDataInvalida.java
ErroStringComoData.java
README.md
```

Compile:

```powershell
javac Main.java
javac LocalTimeBasico.java
javac LocalDateTimeBasico.java
javac JavaTimeImutavel.java
javac SomaSubtracaoDatas.java
javac SomaSubtracaoHorarios.java
javac ComparacaoDatas.java
javac ValidacaoVencimento.java
javac PeriodBasico.java
javac CalculoIdade.java
javac DurationBasico.java
javac FormatacaoData.java
javac ParseData.java
javac ErroParseData.java
javac ParseDataComTratamento.java
javac ParseDataObrigatoria.java
javac FormatacaoDataHora.java
javac PartesDaData.java
javac ClienteDataNascimento.java
javac ProdutoValidade.java
javac PedidoPrazoEntrega.java
javac PagamentoVencimento.java
javac OrdemServicoAgendamento.java
javac MensageriaJanelaEnvio.java
javac AuditoriaDataHora.java
javac FormatadorDataUtil.java
javac DebugJavaTime.java
javac ErroIgnorarRetornoData.java
javac ErroFormatoParse.java
javac ErroDataInvalida.java
javac ErroStringComoData.java
```

Execute os exemplos válidos:

```powershell
java Main
java LocalTimeBasico
java LocalDateTimeBasico
java JavaTimeImutavel
java SomaSubtracaoDatas
java SomaSubtracaoHorarios
java ComparacaoDatas
java ValidacaoVencimento
java PeriodBasico
java CalculoIdade
java DurationBasico
java FormatacaoData
java ParseData
java ParseDataComTratamento
java ParseDataObrigatoria
java FormatacaoDataHora
java PartesDaData
java ClienteDataNascimento
java ProdutoValidade
java PedidoPrazoEntrega
java PagamentoVencimento
java OrdemServicoAgendamento
java MensageriaJanelaEnvio
java AuditoriaDataHora
java FormatadorDataUtil
java DebugJavaTime
```

Execute os de erro ou comportamento perigoso separadamente:

```powershell
java ErroParseData
java ErroIgnorarRetornoData
java ErroFormatoParse
java ErroDataInvalida
java ErroStringComoData
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
# Aula 074 — java.time básico

## Objetivo

Entender a base da API moderna de datas e horários em Java, usando `LocalDate`, `LocalTime`, `LocalDateTime`, `Period`, `Duration` e `DateTimeFormatter`.

## Conceitos

- `LocalDate` representa data sem horário e sem timezone.
- `LocalTime` representa horário sem data e sem timezone.
- `LocalDateTime` representa data e hora sem timezone.
- `Period` representa diferença em anos, meses e dias.
- `Duration` representa diferença em horas, minutos, segundos e nanos.
- `DateTimeFormatter` formata e interpreta datas/horas.
- Classes de java.time são imutáveis.
- Métodos como `plusDays` retornam novo objeto.
- `parse` transforma texto em data/hora.
- `format` transforma data/hora em texto.
- `isBefore`, `isAfter` e `isEqual` comparam datas.
- Texto e formatador precisam combinar.
- Entrada externa pode gerar `DateTimeParseException`.
- String não deve ser o tipo principal de data na regra de negócio.

## Comandos

```powershell
javac Main.java
java Main
javac CalculoIdade.java
java CalculoIdade
javac OrdemServicoAgendamento.java
java OrdemServicoAgendamento
```

## Observações

- Não usar String como data de domínio.
- Não ignorar retorno de métodos de java.time.
- Não usar LocalDateTime como instante global.
- Timezone e Instant serão estudados na próxima aula.
```

---

## Atalhos úteis nesta aula

| Ação | Atalho / comando | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Compilar e executar |
| Debug | `Shift + F9` | Ver objeto de data |
| Run | `Shift + F10` | Executar normal |
| Step Over | `F8` em muitos keymaps | Avançar parse e plusDays |
| Variables | janela Debug | Ver LocalDate, LocalTime e LocalDateTime |
| Evaluate Expression | `Alt + F8` em muitos keymaps | Testar `format`, `plusDays`, `isBefore` |
| Reformatar código | `Ctrl + Alt + L` | Organizar |
| Renomear | `Shift + F6` | Melhorar nomes |
| Extrair método | `Ctrl + Alt + M` em muitos keymaps | Centralizar parse/format |
| Compilar | `javac Arquivo.java` | Gerar `.class` |
| Executar | `java Classe` | Rodar na JVM |

Se algum atalho variar, procure a ação pelo nome no IntelliJ.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 074 — java.time básico

### O que aprendi
Aprendi a usar os tipos básicos da API moderna de datas e horários do Java: `LocalDate`, `LocalTime`, `LocalDateTime`, `Period`, `Duration` e `DateTimeFormatter`. Também aprendi que essas classes são imutáveis e que data deve ser representada por tipo próprio, não por String solta.

### O que pratiquei
Criei exemplos com data atual, data fixa, horário, data e hora, soma e subtração de datas, comparação, vencimento, idade com Period, duração com Duration, formatação, parsing, tratamento de parse e aplicações em cliente, produto, pedido, pagamento, OS, mensageria e auditoria.

### Conceitos principais
- java.time
- LocalDate
- LocalTime
- LocalDateTime
- Period
- Duration
- DateTimeFormatter
- now
- of
- parse
- format
- plusDays
- minusDays
- plusHours
- isBefore
- isAfter
- isEqual
- DateTimeParseException
- data de nascimento
- vencimento
- agendamento
- janela de envio
- data de auditoria
- imutabilidade

### Arquivos criados
- `labs/m2/aula-074-java-time-basico/Main.java`
- `labs/m2/aula-074-java-time-basico/LocalTimeBasico.java`
- `labs/m2/aula-074-java-time-basico/LocalDateTimeBasico.java`
- `labs/m2/aula-074-java-time-basico/JavaTimeImutavel.java`
- `labs/m2/aula-074-java-time-basico/SomaSubtracaoDatas.java`
- `labs/m2/aula-074-java-time-basico/SomaSubtracaoHorarios.java`
- `labs/m2/aula-074-java-time-basico/ComparacaoDatas.java`
- `labs/m2/aula-074-java-time-basico/ValidacaoVencimento.java`
- `labs/m2/aula-074-java-time-basico/PeriodBasico.java`
- `labs/m2/aula-074-java-time-basico/CalculoIdade.java`
- `labs/m2/aula-074-java-time-basico/DurationBasico.java`
- `labs/m2/aula-074-java-time-basico/FormatacaoData.java`
- `labs/m2/aula-074-java-time-basico/ParseData.java`
- `labs/m2/aula-074-java-time-basico/ErroParseData.java`
- `labs/m2/aula-074-java-time-basico/ParseDataComTratamento.java`
- `labs/m2/aula-074-java-time-basico/ParseDataObrigatoria.java`
- `labs/m2/aula-074-java-time-basico/FormatacaoDataHora.java`
- `labs/m2/aula-074-java-time-basico/PartesDaData.java`
- `labs/m2/aula-074-java-time-basico/ClienteDataNascimento.java`
- `labs/m2/aula-074-java-time-basico/ProdutoValidade.java`
- `labs/m2/aula-074-java-time-basico/PedidoPrazoEntrega.java`
- `labs/m2/aula-074-java-time-basico/PagamentoVencimento.java`
- `labs/m2/aula-074-java-time-basico/OrdemServicoAgendamento.java`
- `labs/m2/aula-074-java-time-basico/MensageriaJanelaEnvio.java`
- `labs/m2/aula-074-java-time-basico/AuditoriaDataHora.java`
- `labs/m2/aula-074-java-time-basico/FormatadorDataUtil.java`
- `labs/m2/aula-074-java-time-basico/DebugJavaTime.java`
- `labs/m2/aula-074-java-time-basico/ErroIgnorarRetornoData.java`
- `labs/m2/aula-074-java-time-basico/ErroFormatoParse.java`
- `labs/m2/aula-074-java-time-basico/ErroDataInvalida.java`
- `labs/m2/aula-074-java-time-basico/ErroStringComoData.java`
- `labs/m2/aula-074-java-time-basico/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javac CalculoIdade.java
java CalculoIdade
javac FormatacaoData.java
java FormatacaoData
javac OrdemServicoAgendamento.java
java OrdemServicoAgendamento
```

### Erros que quero evitar
- usar String como data principal;
- ignorar retorno de `plusDays`;
- confundir `LocalDateTime` com instante global;
- usar `Period` para medir horas;
- usar `Duration` para idade;
- usar formato errado no parse;
- não tratar `DateTimeParseException`;
- usar `now` espalhado em regra de negócio;
- não validar data futura/passada;
- achar que `LocalDate` tem hora.

### Próximo passo
Estudar Timezone e Instant.
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
git add labs/m2/aula-074-java-time-basico docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 074: pratica java time basico em Java"
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
1. Para que serve o pacote java.time?
2. O que é LocalDate?
3. O que é LocalTime?
4. O que é LocalDateTime?
5. LocalDate tem horário?
6. LocalDateTime tem timezone?
7. Para que serve Period?
8. Para que serve Duration?
9. Qual a diferença entre Period e Duration?
10. Para que serve DateTimeFormatter?
11. O que parse faz?
12. O que format faz?
13. Por que java.time é imutável?
14. O que acontece se eu chamar plusDays e ignorar o retorno?
15. Como comparar duas datas?
16. Como calcular idade?
17. Como validar vencimento?
18. Por que não usar String como data de domínio?
19. O que é DateTimeParseException?
20. Por que timezone será estudado separadamente?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar java.time;
usar LocalDate;
usar LocalTime;
usar LocalDateTime;
criar data com now;
criar data com of;
somar dias;
subtrair dias;
somar horas;
comparar datas;
validar vencimento;
usar Period;
calcular idade;
usar Duration;
calcular duração em minutos;
formatar LocalDate;
fazer parse de LocalDate;
tratar DateTimeParseException;
formatar LocalDateTime;
extrair partes da data;
explicar imutabilidade;
evitar String como data de domínio;
aplicar em cliente;
aplicar em produto;
aplicar em pedido;
aplicar em pagamento;
aplicar em OS;
aplicar em mensageria;
aplicar em auditoria;
centralizar formatador;
debugar data;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar `Instant`.

Não precisa ainda dominar `ZoneId`.

Não precisa ainda dominar timezone.

Não precisa ainda dominar `OffsetDateTime`.

Não precisa ainda dominar `ZonedDateTime`.

Não precisa ainda dominar banco de dados com datas.

Não precisa ainda dominar serialização JSON de datas.

Esses assuntos virão depois.

O objetivo é dominar a base local de datas e horários com `java.time`.

---

## Fechamento da aula

Hoje estudamos `java.time` básico.

A ideia central foi:

```text
datas e horários devem ser representados por tipos próprios, não por String solta.
```

Vimos que:

```text
LocalDate representa data;
LocalTime representa hora;
LocalDateTime representa data e hora;
Period calcula diferença em anos, meses e dias;
Duration calcula diferença em tempo;
DateTimeFormatter formata e interpreta texto;
classes java.time são imutáveis;
plusDays retorna novo objeto;
parse exige formato compatível;
String deve ficar na entrada e saída, não no coração da regra.
```

O ponto mais importante é:

```text
escolha o tipo temporal correto para a regra: data, hora, data/hora, período ou duração.
```

Na próxima aula, vamos estudar:

```text
Timezone e Instant.
```

A próxima aula vai explicar UTC, `Instant`, `ZoneId`, `OffsetDateTime`, armazenamento, APIs e os erros clássicos de timezone em sistemas backend.
