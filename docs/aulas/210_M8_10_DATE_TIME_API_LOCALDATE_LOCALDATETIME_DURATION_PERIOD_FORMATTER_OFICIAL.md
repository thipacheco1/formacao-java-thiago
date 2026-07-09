# 210 — M8.10 — Date/Time API: LocalDate, LocalDateTime, Duration, Period e DateTimeFormatter

## Objetivo da aula

Na aula anterior, você estudou:

```text
CSV simples;
separador;
split com -1;
cabeçalho;
parser;
ResultadoImportacao;
erro por linha;
número de linha;
ProdutoCsvParser;
ClienteCsvParser;
importação;
exportação;
relatório de erros;
limitações do parsing manual.
```

Agora vamos estudar um dos blocos mais importantes para backend real:

```text
Date/Time API
```

Ou seja:

```text
datas;
horários;
prazos;
vencimentos;
agendamentos;
duração;
períodos;
formatação;
parsing;
auditoria;
logs;
regras de negócio com tempo.
```

Você vai trabalhar principalmente com:

```text
LocalDate;
LocalTime;
LocalDateTime;
Duration;
Period;
DateTimeFormatter.
```

Ao final desta aula, você deve conseguir:

```text
criar datas com LocalDate;
criar horários com LocalTime;
criar data e hora com LocalDateTime;
somar e subtrair dias, meses, anos, horas e minutos;
comparar datas;
validar vencimento;
validar agendamento;
calcular diferença em dias;
calcular duração em minutos e horas;
usar Period;
usar Duration;
formatar datas;
parsear textos para datas;
evitar Date antigo;
evitar Calendar antigo;
aplicar Date/Time em domínio e service;
criar regras reais de prazo e agendamento.
```

---

## Por que Date/Time é essencial no backend

Sistemas backend vivem de tempo.

Exemplos:

```text
pedido criado em;
pedido vencido em;
OS agendada para;
atividade concluída em;
contrato válido até;
token expira em;
link expira em;
mensagem enviada às;
prazo de SLA;
tempo em fila;
idade de uma solicitação;
janela de atendimento;
período de cobrança;
auditoria de criação e alteração;
relatórios por data;
filtros por intervalo.
```

Se você modela data errado, a regra de negócio quebra.

---

## API moderna vs API antiga

Antes do Java 8, era comum usar:

```java
java.util.Date
java.util.Calendar
```

Hoje, para código novo, prefira:

```java
java.time.LocalDate
java.time.LocalTime
java.time.LocalDateTime
java.time.Duration
java.time.Period
java.time.format.DateTimeFormatter
```

A API moderna é mais clara, segura e expressiva.

---

## Ideia principal

Use:

```text
LocalDate:
quando importa apenas a data.

LocalTime:
quando importa apenas o horário.

LocalDateTime:
quando importa data e horário, sem fuso.

Duration:
diferença baseada em tempo, como minutos, horas, segundos.

Period:
diferença baseada em calendário, como dias, meses e anos.

DateTimeFormatter:
formatar e interpretar texto.
```

Exemplos:

```java
LocalDate data = LocalDate.of(2026, 7, 9);
LocalTime hora = LocalTime.of(14, 30);
LocalDateTime dataHora = LocalDateTime.of(2026, 7, 9, 14, 30);
```

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

No contexto de datas:

```text
Entidade:
protege regra temporal do negócio.

Service/use case:
coordena cálculo, filtros e fluxo.

Repository futuro:
buscará por intervalos no banco.

Controller futuro:
receberá strings e converterá para datas.

Mapper/formatter:
formatará saída quando necessário.
```

Exemplo:

```text
OS concluída não pode ser reagendada.
Data de agendamento não pode estar no passado.
Contrato vencido não pode ser ativado.
Token expirado não pode ser usado.
```

Essas regras pertencem ao domínio ou ao caso de uso.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-210-date-time-api-localdate-localdatetime-duration-period-formatter
cd labs\m8\aula-210-date-time-api-localdate-localdatetime-duration-period-formatter
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula210
mkdir src\br\com\curso\aula210\app
mkdir src\br\com\curso\aula210\dominio
mkdir src\br\com\curso\aula210\dominio\contrato
mkdir src\br\com\curso\aula210\dominio\ordemservico
mkdir src\br\com\curso\aula210\dominio\token
mkdir src\br\com\curso\aula210\dto
mkdir src\br\com\curso\aula210\service
```

---

# Parte 1 — LocalDate

## O que é LocalDate

`LocalDate` representa uma data sem hora.

Exemplo:

```text
2026-07-09
```

Use para:

```text
data de nascimento;
data de vencimento;
data de agendamento;
data de contrato;
data de abertura;
data de validade.
```

---

## LocalDateBasicoApp

Crie:

```text
src\br\com\curso\aula210\app\LocalDateBasicoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;

public class LocalDateBasicoApp {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.now();
        LocalDate dataEspecifica = LocalDate.of(2026, 7, 9);

        System.out.println("Hoje: " + hoje);
        System.out.println("Data específica: " + dataEspecifica);
        System.out.println("Ano: " + dataEspecifica.getYear());
        System.out.println("Mês: " + dataEspecifica.getMonth());
        System.out.println("Número do mês: " + dataEspecifica.getMonthValue());
        System.out.println("Dia do mês: " + dataEspecifica.getDayOfMonth());
        System.out.println("Dia da semana: " + dataEspecifica.getDayOfWeek());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.LocalDateBasicoApp
```

---

## Observação

`LocalDate.now()` usa a data atual do ambiente onde o código está rodando.

Em regra de negócio, muitas vezes é melhor receber a data atual por parâmetro.

Exemplo:

```java
contrato.vencidoEm(LocalDate hoje)
```

Isso facilita teste.

---

# Parte 2 — Somando e subtraindo datas

## Métodos úteis

`LocalDate` é imutável.

Métodos como:

```java
plusDays
plusMonths
plusYears
minusDays
minusMonths
minusYears
```

retornam uma nova data.

---

## LocalDateOperacoesApp

Crie:

```text
src\br\com\curso\aula210\app\LocalDateOperacoesApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;

public class LocalDateOperacoesApp {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 9);

        LocalDate daquiSeteDias = data.plusDays(7);
        LocalDate daquiUmMes = data.plusMonths(1);
        LocalDate anoPassado = data.minusYears(1);

        System.out.println("Data base: " + data);
        System.out.println("Daqui 7 dias: " + daquiSeteDias);
        System.out.println("Daqui 1 mês: " + daquiUmMes);
        System.out.println("Ano passado: " + anoPassado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.LocalDateOperacoesApp
```

---

## Imutabilidade

Este código:

```java
data.plusDays(7);
```

não altera `data`.

Você precisa guardar o retorno:

```java
LocalDate novaData = data.plusDays(7);
```

Esse padrão é comum na API `java.time`.

---

# Parte 3 — Comparando datas

## Métodos úteis

Para comparar datas:

```java
isBefore
isAfter
isEqual
```

Também existe:

```java
compareTo
```

---

## LocalDateComparacaoApp

Crie:

```text
src\br\com\curso\aula210\app\LocalDateComparacaoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;

public class LocalDateComparacaoApp {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.of(2026, 7, 9);
        LocalDate ontem = hoje.minusDays(1);
        LocalDate amanha = hoje.plusDays(1);

        System.out.println("Ontem antes de hoje? " + ontem.isBefore(hoje));
        System.out.println("Amanhã depois de hoje? " + amanha.isAfter(hoje));
        System.out.println("Hoje igual hoje? " + hoje.isEqual(LocalDate.of(2026, 7, 9)));
        System.out.println("Ontem antes de amanhã? " + ontem.isBefore(amanha));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.LocalDateComparacaoApp
```

---

## Uso em regra

Exemplo:

```java
if (dataAgendada.isBefore(hoje)) {
    throw new IllegalArgumentException("Data agendada não pode estar no passado.");
}
```

Essa é uma regra comum em sistemas de agendamento.

---

# Parte 4 — LocalTime

## O que é LocalTime

`LocalTime` representa hora sem data.

Exemplo:

```text
14:30
08:00
18:45:10
```

Use para:

```text
horário de início;
horário de fim;
janela de atendimento;
turno;
hora limite de corte;
horário comercial.
```

---

## LocalTimeBasicoApp

Crie:

```text
src\br\com\curso\aula210\app\LocalTimeBasicoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalTime;

public class LocalTimeBasicoApp {
    public static void main(String[] args) {
        LocalTime agora = LocalTime.now();
        LocalTime horarioAtendimento = LocalTime.of(8, 30);
        LocalTime encerramento = LocalTime.of(18, 0);

        System.out.println("Agora: " + agora);
        System.out.println("Atendimento: " + horarioAtendimento);
        System.out.println("Encerramento: " + encerramento);
        System.out.println("Hora: " + horarioAtendimento.getHour());
        System.out.println("Minuto: " + horarioAtendimento.getMinute());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.LocalTimeBasicoApp
```

---

# Parte 5 — LocalDateTime

## O que é LocalDateTime

`LocalDateTime` representa data e hora sem fuso horário.

Exemplo:

```text
2026-07-09T14:30
```

Use para:

```text
data/hora de criação;
data/hora de atualização;
data/hora de envio;
data/hora de conclusão;
timestamp de auditoria;
expiração simples em contexto local.
```

---

## LocalDateTimeBasicoApp

Crie:

```text
src\br\com\curso\aula210\app\LocalDateTimeBasicoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class LocalDateTimeBasicoApp {
    public static void main(String[] args) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDate data = LocalDate.of(2026, 7, 9);
        LocalTime hora = LocalTime.of(14, 30);

        LocalDateTime dataHora = LocalDateTime.of(data, hora);

        System.out.println("Agora: " + agora);
        System.out.println("Data e hora: " + dataHora);
        System.out.println("Data: " + dataHora.toLocalDate());
        System.out.println("Hora: " + dataHora.toLocalTime());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.LocalDateTimeBasicoApp
```

---

## Observação importante

`LocalDateTime` não tem fuso horário.

Para muitos sistemas internos, ele é suficiente.

Para sistemas distribuídos globalmente, integrações internacionais ou auditoria crítica, futuramente estudaremos:

```text
ZonedDateTime;
OffsetDateTime;
Instant.
```

---

# Parte 6 — Duration

## O que é Duration

`Duration` representa uma duração baseada em tempo.

Exemplos:

```text
30 minutos;
2 horas;
45 segundos;
1 dia em horas.
```

Use quando importa diferença em:

```text
segundos;
minutos;
horas;
tempo decorrido;
tempo de execução;
tempo em fila;
expiração em minutos;
timeout.
```

---

## DurationBasicoApp

Crie:

```text
src\br\com\curso\aula210\app\DurationBasicoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.Duration;
import java.time.LocalDateTime;

public class DurationBasicoApp {
    public static void main(String[] args) {
        LocalDateTime inicio = LocalDateTime.of(2026, 7, 9, 8, 0);
        LocalDateTime fim = LocalDateTime.of(2026, 7, 9, 10, 45);

        Duration duracao = Duration.between(inicio, fim);

        System.out.println("Duração em minutos: " + duracao.toMinutes());
        System.out.println("Duração em horas: " + duracao.toHours());
        System.out.println("Duração em segundos: " + duracao.toSeconds());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.DurationBasicoApp
```

---

## Observação

`toHours()` retorna horas completas.

Se a duração for:

```text
2h45
```

`toHours()` retorna:

```text
2
```

Para minutos totais:

```java
toMinutes()
```

---

# Parte 7 — Period

## O que é Period

`Period` representa período baseado em calendário.

Exemplos:

```text
2 anos;
3 meses;
10 dias.
```

Use quando importa diferença em:

```text
dias;
meses;
anos;
idade;
validade por meses;
contrato por anos;
calendário.
```

---

## PeriodBasicoApp

Crie:

```text
src\br\com\curso\aula210\app\PeriodBasicoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;
import java.time.Period;

public class PeriodBasicoApp {
    public static void main(String[] args) {
        LocalDate inicio = LocalDate.of(2025, 1, 15);
        LocalDate fim = LocalDate.of(2026, 7, 9);

        Period periodo = Period.between(inicio, fim);

        System.out.println("Anos: " + periodo.getYears());
        System.out.println("Meses: " + periodo.getMonths());
        System.out.println("Dias: " + periodo.getDays());
        System.out.println("Período: " + periodo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.PeriodBasicoApp
```

---

## Duration vs Period

Use:

```text
Duration:
tempo exato em horas, minutos, segundos.

Period:
tempo de calendário em anos, meses, dias.
```

Exemplo:

```text
tempo em fila:
Duration.

idade:
Period.

contrato de 12 meses:
Period.

token expira em 15 minutos:
Duration.
```

---

# Parte 8 — DateTimeFormatter

## O que é DateTimeFormatter

`DateTimeFormatter` serve para:

```text
formatar data/hora para texto;
parsear texto para data/hora.
```

Exemplo:

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
```

---

## FormatacaoDataApp

Crie:

```text
src\br\com\curso\aula210\app\FormatacaoDataApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class FormatacaoDataApp {
    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 9);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        String formatada = data.format(formatter);

        System.out.println("ISO: " + data);
        System.out.println("BR: " + formatada);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.FormatacaoDataApp
```

---

## ParsingDataApp

Crie:

```text
src\br\com\curso\aula210\app\ParsingDataApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ParsingDataApp {
    public static void main(String[] args) {
        String texto = "09/07/2026";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate data = LocalDate.parse(texto, formatter);

        System.out.println("Texto: " + texto);
        System.out.println("LocalDate: " + data);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.ParsingDataApp
```

---

## Padrões comuns

```text
dd/MM/yyyy:
09/07/2026

yyyy-MM-dd:
2026-07-09

dd/MM/yyyy HH:mm:
09/07/2026 14:30

yyyy-MM-dd HH:mm:ss:
2026-07-09 14:30:59
```

Cuidado:

```text
MM:
mês.

mm:
minuto.
```

Esse erro é comum.

---

# Parte 9 — Parsing com erro

## DateTimeParseException

Quando o texto não bate com o formato, ocorre:

```java
DateTimeParseException
```

Ela é unchecked.

---

## ParsingDataErroApp

Crie:

```text
src\br\com\curso\aula210\app\ParsingDataErroApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class ParsingDataErroApp {
    public static void main(String[] args) {
        String texto = "2026/07/09";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        try {
            LocalDate data = LocalDate.parse(texto, formatter);
            System.out.println(data);
        } catch (DateTimeParseException erro) {
            System.out.println("Data inválida para o formato esperado: " + texto);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.ParsingDataErroApp
```

---

## Regra profissional

Quando receber data como texto:

```text
valide formato;
trate erro;
retorne mensagem clara.
```

Não deixe vazar:

```text
DateTimeParseException
```

para usuário final.

---

# Parte 10 — Domínio Contrato

## Contrato

Crie:

```text
src\br\com\curso\aula210\dominio\contrato\Contrato.java
```

Código:

```java
package br.com.curso.aula210.dominio.contrato;

import java.time.LocalDate;

public class Contrato {
    private final String codigo;
    private final String cliente;
    private final LocalDate dataInicio;
    private final LocalDate dataFim;
    private boolean ativo;

    public Contrato(String codigo, String cliente, LocalDate dataInicio, LocalDate dataFim, boolean ativo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do contrato é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente do contrato é obrigatório.");
        }

        if (dataInicio == null) {
            throw new IllegalArgumentException("Data de início é obrigatória.");
        }

        if (dataFim == null) {
            throw new IllegalArgumentException("Data de fim é obrigatória.");
        }

        if (dataFim.isBefore(dataInicio)) {
            throw new IllegalArgumentException("Data de fim não pode ser anterior à data de início.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativo = ativo;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDate dataInicio() {
        return dataInicio;
    }

    public LocalDate dataFim() {
        return dataFim;
    }

    public boolean ativo() {
        return ativo;
    }

    public boolean vigenteEm(LocalDate dataReferencia) {
        if (dataReferencia == null) {
            throw new IllegalArgumentException("Data de referência é obrigatória.");
        }

        return ativo
                && !dataReferencia.isBefore(dataInicio)
                && !dataReferencia.isAfter(dataFim);
    }

    public boolean vencidoEm(LocalDate dataReferencia) {
        if (dataReferencia == null) {
            throw new IllegalArgumentException("Data de referência é obrigatória.");
        }

        return dataReferencia.isAfter(dataFim);
    }

    public void inativarSeVencido(LocalDate dataReferencia) {
        if (vencidoEm(dataReferencia)) {
            ativo = false;
        }
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Início: " + dataInicio
                + " | Fim: " + dataFim
                + " | Ativo: " + ativo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ContratoApp

Crie:

```text
src\br\com\curso\aula210\app\ContratoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import br.com.curso.aula210.dominio.contrato.Contrato;

import java.time.LocalDate;

public class ContratoApp {
    public static void main(String[] args) {
        Contrato contrato = new Contrato(
                "CTR-001",
                "Cliente A",
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31),
                true
        );

        LocalDate hoje = LocalDate.of(2026, 7, 9);

        System.out.println(contrato.resumo());
        System.out.println("Vigente hoje? " + contrato.vigenteEm(hoje));
        System.out.println("Vencido hoje? " + contrato.vencidoEm(hoje));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.ContratoApp
```

---

## O que este exemplo mostra

A entidade `Contrato` protege regras temporais:

```text
data fim não pode ser antes da data início;
vigência depende de data de referência;
contrato vencido pode ser inativado.
```

---

# Parte 11 — Domínio OrdemServico

## OrdemServico

Crie:

```text
src\br\com\curso\aula210\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula210.dominio.ordemservico;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

public class OrdemServico {
    private final String codigo;
    private final String cliente;
    private final LocalDateTime abertaEm;
    private LocalDate dataAgendada;
    private String status;

    public OrdemServico(
            String codigo,
            String cliente,
            LocalDateTime abertaEm,
            LocalDate dataAgendada,
            String status
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente da OS é obrigatório.");
        }

        if (abertaEm == null) {
            throw new IllegalArgumentException("Data/hora de abertura é obrigatória.");
        }

        if (dataAgendada == null) {
            throw new IllegalArgumentException("Data agendada é obrigatória.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.abertaEm = abertaEm;
        this.dataAgendada = dataAgendada;
        this.status = status.trim().toUpperCase();
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDateTime abertaEm() {
        return abertaEm;
    }

    public LocalDate dataAgendada() {
        return dataAgendada;
    }

    public String status() {
        return status;
    }

    public boolean aberta() {
        return "ABERTA".equals(status);
    }

    public boolean concluida() {
        return "CONCLUIDA".equals(status);
    }

    public boolean cancelada() {
        return "CANCELADA".equals(status);
    }

    public void reagendar(LocalDate novaData, LocalDate hoje) {
        if (novaData == null) {
            throw new IllegalArgumentException("Nova data é obrigatória.");
        }

        if (hoje == null) {
            throw new IllegalArgumentException("Data atual é obrigatória.");
        }

        if (novaData.isBefore(hoje)) {
            throw new IllegalArgumentException("Nova data não pode estar no passado.");
        }

        if (concluida()) {
            throw new IllegalStateException("OS concluída não pode ser reagendada: " + codigo);
        }

        if (cancelada()) {
            throw new IllegalStateException("OS cancelada não pode ser reagendada: " + codigo);
        }

        this.dataAgendada = novaData;
        this.status = "REAGENDADA";
    }

    public int diasDesdeAbertura(LocalDate hoje) {
        if (hoje == null) {
            throw new IllegalArgumentException("Data atual é obrigatória.");
        }

        return Period.between(abertaEm.toLocalDate(), hoje).getDays();
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Aberta em: " + abertaEm
                + " | Agendada: " + dataAgendada
                + " | Status: " + status;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Observação sobre diasDesdeAbertura

Este método usa:

```java
Period.between(...)
```

Ele mostra os dias dentro do período.

Para cálculo de total absoluto de dias entre datas, normalmente usamos:

```java
ChronoUnit.DAYS.between(inicio, fim)
```

Vamos mostrar isso agora.

---

# Parte 12 — ChronoUnit

## Por que usar ChronoUnit

Para calcular total de dias entre duas datas:

```java
ChronoUnit.DAYS.between(inicio, fim)
```

Para horas:

```java
ChronoUnit.HOURS.between(inicio, fim)
```

Para minutos:

```java
ChronoUnit.MINUTES.between(inicio, fim)
```

---

## ChronoUnitApp

Crie:

```text
src\br\com\curso\aula210\app\ChronoUnitApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class ChronoUnitApp {
    public static void main(String[] args) {
        LocalDate inicio = LocalDate.of(2026, 7, 1);
        LocalDate fim = LocalDate.of(2026, 7, 9);

        long dias = ChronoUnit.DAYS.between(inicio, fim);

        LocalDateTime entradaFila = LocalDateTime.of(2026, 7, 9, 8, 15);
        LocalDateTime agora = LocalDateTime.of(2026, 7, 9, 10, 45);

        long minutos = ChronoUnit.MINUTES.between(entradaFila, agora);

        System.out.println("Dias entre datas: " + dias);
        System.out.println("Minutos em fila: " + minutos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.ChronoUnitApp
```

---

## Regra prática

Use:

```text
Period:
quando quer decompor em anos, meses e dias.

ChronoUnit.DAYS.between:
quando quer total de dias.

Duration:
quando trabalha com tempo entre LocalDateTime/LocalTime.

ChronoUnit.MINUTES.between:
quando quer total direto de minutos.
```

---

# Parte 13 — Token com expiração

## TokenAcesso

Crie:

```text
src\br\com\curso\aula210\dominio\token\TokenAcesso.java
```

Código:

```java
package br.com.curso.aula210.dominio.token;

import java.time.Duration;
import java.time.LocalDateTime;

public class TokenAcesso {
    private final String valor;
    private final LocalDateTime criadoEm;
    private final Duration validade;

    public TokenAcesso(String valor, LocalDateTime criadoEm, Duration validade) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor do token é obrigatório.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data/hora de criação é obrigatória.");
        }

        if (validade == null || validade.isZero() || validade.isNegative()) {
            throw new IllegalArgumentException("Validade deve ser positiva.");
        }

        this.valor = valor;
        this.criadoEm = criadoEm;
        this.validade = validade;
    }

    public String valor() {
        return valor;
    }

    public LocalDateTime criadoEm() {
        return criadoEm;
    }

    public Duration validade() {
        return validade;
    }

    public LocalDateTime expiraEm() {
        return criadoEm.plus(validade);
    }

    public boolean expiradoEm(LocalDateTime dataHoraReferencia) {
        if (dataHoraReferencia == null) {
            throw new IllegalArgumentException("Data/hora de referência é obrigatória.");
        }

        return !dataHoraReferencia.isBefore(expiraEm());
    }

    public long minutosRestantes(LocalDateTime dataHoraReferencia) {
        if (dataHoraReferencia == null) {
            throw new IllegalArgumentException("Data/hora de referência é obrigatória.");
        }

        if (expiradoEm(dataHoraReferencia)) {
            return 0;
        }

        return Duration.between(dataHoraReferencia, expiraEm()).toMinutes();
    }

    public String resumo() {
        return "Token: " + valor
                + " | Criado em: " + criadoEm
                + " | Expira em: " + expiraEm();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## TokenAcessoApp

Crie:

```text
src\br\com\curso\aula210\app\TokenAcessoApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import br.com.curso.aula210.dominio.token.TokenAcesso;

import java.time.Duration;
import java.time.LocalDateTime;

public class TokenAcessoApp {
    public static void main(String[] args) {
        TokenAcesso token = new TokenAcesso(
                "abc-123",
                LocalDateTime.of(2026, 7, 9, 10, 0),
                Duration.ofMinutes(30)
        );

        LocalDateTime agora = LocalDateTime.of(2026, 7, 9, 10, 20);
        LocalDateTime depois = LocalDateTime.of(2026, 7, 9, 10, 31);

        System.out.println(token.resumo());
        System.out.println("Expirado às 10:20? " + token.expiradoEm(agora));
        System.out.println("Minutos restantes às 10:20: " + token.minutosRestantes(agora));
        System.out.println("Expirado às 10:31? " + token.expiradoEm(depois));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.TokenAcessoApp
```

---

## O que este exemplo mostra

Token é um bom caso para:

```text
LocalDateTime;
Duration;
expiração;
tempo restante.
```

Mais tarde, em segurança JWT, esse raciocínio será útil.

---

# Parte 14 — DTO e Formatter

## OrdemServicoResponse

Crie:

```text
src\br\com\curso\aula210\dto\OrdemServicoResponse.java
```

Código:

```java
package br.com.curso.aula210.dto;

public class OrdemServicoResponse {
    private final String codigo;
    private final String cliente;
    private final String abertaEm;
    private final String dataAgendada;
    private final String status;

    public OrdemServicoResponse(
            String codigo,
            String cliente,
            String abertaEm,
            String dataAgendada,
            String status
    ) {
        this.codigo = codigo;
        this.cliente = cliente;
        this.abertaEm = abertaEm;
        this.dataAgendada = dataAgendada;
        this.status = status;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String abertaEm() {
        return abertaEm;
    }

    public String dataAgendada() {
        return dataAgendada;
    }

    public String status() {
        return status;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Aberta em: " + abertaEm
                + " | Agendada: " + dataAgendada
                + " | Status: " + status;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServicoMapper

Crie:

```text
src\br\com\curso\aula210\dto\OrdemServicoMapper.java
```

Código:

```java
package br.com.curso.aula210.dto;

import br.com.curso.aula210.dominio.ordemservico.OrdemServico;

import java.time.format.DateTimeFormatter;

public final class OrdemServicoMapper {
    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private OrdemServicoMapper() {
    }

    public static OrdemServicoResponse toResponse(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        return new OrdemServicoResponse(
                os.codigo(),
                os.cliente(),
                os.abertaEm().format(DATA_HORA),
                os.dataAgendada().format(DATA),
                os.status()
        );
    }
}
```

---

## App mapper

Crie:

```text
src\br\com\curso\aula210\app\OrdemServicoMapperApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import br.com.curso.aula210.dominio.ordemservico.OrdemServico;
import br.com.curso.aula210.dto.OrdemServicoMapper;
import br.com.curso.aula210.dto.OrdemServicoResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class OrdemServicoMapperApp {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001",
                "Ana",
                LocalDateTime.of(2026, 7, 9, 8, 30),
                LocalDate.of(2026, 7, 15),
                "ABERTA"
        );

        OrdemServicoResponse response = OrdemServicoMapper.toResponse(os);

        System.out.println(response.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.OrdemServicoMapperApp
```

---

## Observação profissional

A entidade pode guardar `LocalDate` e `LocalDateTime`.

O mapper pode formatar para texto.

Não transforme tudo em `String` dentro do domínio.

Use tipos corretos.

---

# Parte 15 — Service com filtros por data

## OrdemServicoConsultaService

Crie:

```text
src\br\com\curso\aula210\service\OrdemServicoConsultaService.java
```

Código:

```java
package br.com.curso.aula210.service;

import br.com.curso.aula210.dominio.ordemservico.OrdemServico;
import br.com.curso.aula210.dto.OrdemServicoMapper;
import br.com.curso.aula210.dto.OrdemServicoResponse;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

public class OrdemServicoConsultaService {
    private final List<OrdemServico> ordens;

    public OrdemServicoConsultaService(List<OrdemServico> ordens) {
        if (ordens == null) {
            throw new IllegalArgumentException("Ordens são obrigatórias.");
        }

        this.ordens = List.copyOf(ordens);
    }

    public List<OrdemServicoResponse> listarAgendadasEntre(LocalDate inicio, LocalDate fim) {
        if (inicio == null) {
            throw new IllegalArgumentException("Data inicial é obrigatória.");
        }

        if (fim == null) {
            throw new IllegalArgumentException("Data final é obrigatória.");
        }

        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException("Data final não pode ser anterior à data inicial.");
        }

        return ordens.stream()
                .filter(os -> !os.dataAgendada().isBefore(inicio))
                .filter(os -> !os.dataAgendada().isAfter(fim))
                .sorted(Comparator.comparing(OrdemServico::dataAgendada))
                .map(OrdemServicoMapper::toResponse)
                .toList();
    }

    public List<OrdemServicoResponse> listarAbertasComMaisDe(int dias, LocalDate hoje) {
        if (dias < 0) {
            throw new IllegalArgumentException("Dias não pode ser negativo.");
        }

        if (hoje == null) {
            throw new IllegalArgumentException("Data atual é obrigatória.");
        }

        return ordens.stream()
                .filter(OrdemServico::aberta)
                .filter(os -> ChronoUnit.DAYS.between(os.abertaEm().toLocalDate(), hoje) > dias)
                .sorted(Comparator.comparing(OrdemServico::abertaEm))
                .map(OrdemServicoMapper::toResponse)
                .toList();
    }
}
```

---

## App consulta

Crie:

```text
src\br\com\curso\aula210\app\OrdemServicoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import br.com.curso.aula210.dominio.ordemservico.OrdemServico;
import br.com.curso.aula210.dto.OrdemServicoResponse;
import br.com.curso.aula210.service.OrdemServicoConsultaService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OrdemServicoConsultaServiceApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", LocalDateTime.of(2026, 7, 1, 8, 0), LocalDate.of(2026, 7, 10), "ABERTA"),
                new OrdemServico("OS-002", "Carlos", LocalDateTime.of(2026, 7, 8, 9, 0), LocalDate.of(2026, 7, 15), "ABERTA"),
                new OrdemServico("OS-003", "Maria", LocalDateTime.of(2026, 6, 20, 10, 0), LocalDate.of(2026, 7, 20), "CONCLUIDA")
        );

        OrdemServicoConsultaService service = new OrdemServicoConsultaService(ordens);

        System.out.println("Agendadas entre 09/07 e 16/07:");
        List<OrdemServicoResponse> agendadas = service.listarAgendadasEntre(
                LocalDate.of(2026, 7, 9),
                LocalDate.of(2026, 7, 16)
        );

        agendadas.forEach(System.out::println);

        System.out.println();
        System.out.println("Abertas com mais de 5 dias:");
        List<OrdemServicoResponse> antigas = service.listarAbertasComMaisDe(
                5,
                LocalDate.of(2026, 7, 9)
        );

        antigas.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.OrdemServicoConsultaServiceApp
```

---

# Parte 16 — Parsing de request

## ReagendarOsRequest

Crie:

```text
src\br\com\curso\aula210\dto\ReagendarOsRequest.java
```

Código:

```java
package br.com.curso.aula210.dto;

public class ReagendarOsRequest {
    private final String codigoOs;
    private final String novaData;

    public ReagendarOsRequest(String codigoOs, String novaData) {
        this.codigoOs = codigoOs;
        this.novaData = novaData;
    }

    public String codigoOs() {
        return codigoOs;
    }

    public String novaData() {
        return novaData;
    }
}
```

---

## ReagendamentoOsService

Crie:

```text
src\br\com\curso\aula210\service\ReagendamentoOsService.java
```

Código:

```java
package br.com.curso.aula210.service;

import br.com.curso.aula210.dominio.ordemservico.OrdemServico;
import br.com.curso.aula210.dto.ReagendarOsRequest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

public class ReagendamentoOsService {
    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final List<OrdemServico> ordens;

    public ReagendamentoOsService(List<OrdemServico> ordens) {
        if (ordens == null) {
            throw new IllegalArgumentException("Ordens são obrigatórias.");
        }

        this.ordens = ordens;
    }

    public OrdemServico reagendar(ReagendarOsRequest request, LocalDate hoje) {
        if (request == null) {
            throw new IllegalArgumentException("Dados de reagendamento são obrigatórios.");
        }

        if (request.codigoOs() == null || request.codigoOs().isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        LocalDate novaData = parseData(request.novaData());

        OrdemServico os = buscarObrigatoria(request.codigoOs());

        os.reagendar(novaData, hoje);

        return os;
    }

    private OrdemServico buscarObrigatoria(String codigo) {
        String normalizado = codigo.trim().toUpperCase();

        return ordens.stream()
                .filter(os -> os.codigo().equals(normalizado))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("OS não encontrada: " + codigo));
    }

    private LocalDate parseData(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Nova data é obrigatória.");
        }

        try {
            return LocalDate.parse(texto, FORMATO_DATA);
        } catch (DateTimeParseException erro) {
            throw new IllegalArgumentException("Nova data deve estar no formato dd/MM/yyyy: " + texto, erro);
        }
    }
}
```

---

## App Reagendamento

Crie:

```text
src\br\com\curso\aula210\app\ReagendamentoOsServiceApp.java
```

Código:

```java
package br.com.curso.aula210.app;

import br.com.curso.aula210.dominio.ordemservico.OrdemServico;
import br.com.curso.aula210.dto.ReagendarOsRequest;
import br.com.curso.aula210.service.ReagendamentoOsService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ReagendamentoOsServiceApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", LocalDateTime.of(2026, 7, 9, 8, 0), LocalDate.of(2026, 7, 10), "ABERTA"),
                new OrdemServico("OS-002", "Carlos", LocalDateTime.of(2026, 7, 8, 9, 0), LocalDate.of(2026, 7, 11), "CONCLUIDA")
        );

        ReagendamentoOsService service = new ReagendamentoOsService(ordens);

        executar("Reagendamento válido", () -> {
            OrdemServico os = service.reagendar(
                    new ReagendarOsRequest("OS-001", "15/07/2026"),
                    LocalDate.of(2026, 7, 9)
            );

            System.out.println(os.resumo());
        });

        executar("Data em formato inválido", () -> {
            OrdemServico os = service.reagendar(
                    new ReagendarOsRequest("OS-001", "2026-07-15"),
                    LocalDate.of(2026, 7, 9)
            );

            System.out.println(os.resumo());
        });

        executar("OS concluída", () -> {
            OrdemServico os = service.reagendar(
                    new ReagendarOsRequest("OS-002", "15/07/2026"),
                    LocalDate.of(2026, 7, 9)
            );

            System.out.println(os.resumo());
        });
    }

    private static void executar(String descricao, Runnable acao) {
        System.out.println();
        System.out.println("Cenário: " + descricao);

        try {
            acao.run();
        } catch (RuntimeException erro) {
            System.out.println("Falha: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula210.app.ReagendamentoOsServiceApp
```

---

# Parte 17 — Boas práticas

## 1. Use tipos corretos

Não guarde data como `String` no domínio.

Prefira:

```java
LocalDate
LocalDateTime
```

---

## 2. Receba hoje/agora por parâmetro em regras de domínio

Bom:

```java
contrato.vencidoEm(hoje)
token.expiradoEm(agora)
os.reagendar(novaData, hoje)
```

Isso facilita teste.

---

## 3. Formate no mapper ou borda

Domínio guarda data.

Mapper formata para exibição.

---

## 4. Cuidado com MM e mm

```text
MM:
mês.

mm:
minuto.
```

---

## 5. Use Duration para tempo

Exemplo:

```text
token expira em 30 minutos;
tempo em fila;
timeout.
```

---

## 6. Use Period para calendário

Exemplo:

```text
contrato de 12 meses;
idade;
validade por anos.
```

---

## 7. Use ChronoUnit para totais

Exemplo:

```java
ChronoUnit.DAYS.between(inicio, fim)
```

---

## 8. Não use Date/Calendar em código novo

Prefira `java.time`.

---

## 9. Trate parsing com mensagem clara

Não exponha `DateTimeParseException` para usuário.

---

## 10. Atenção ao fuso horário

`LocalDateTime` não tem fuso.

Fuso será estudado depois com:

```text
Instant;
OffsetDateTime;
ZonedDateTime.
```

---

# Parte 18 — Erros comuns

## 1. Guardar data como String no domínio

Ruim:

```java
private String dataAgendada;
```

Melhor:

```java
private LocalDate dataAgendada;
```

---

## 2. Usar LocalDateTime quando só data basta

Se regra só precisa da data, use `LocalDate`.

---

## 3. Usar LocalDate quando hora importa

Se expiração depende de minutos, use `LocalDateTime` com `Duration`.

---

## 4. Usar Period para minutos

`Period` é calendário.

Para minutos, use `Duration`.

---

## 5. Chamar LocalDate.now() dentro de toda regra

Isso dificulta teste.

Prefira passar `hoje`.

---

## 6. Não validar data fim antes da data início

Contrato com período inválido quebra regra.

---

## 7. Expor DateTimeParseException

Capture e converta para mensagem clara.

---

# Parte 19 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula210.app.LocalDateBasicoApp
java -cp out br.com.curso.aula210.app.LocalDateOperacoesApp
java -cp out br.com.curso.aula210.app.LocalDateComparacaoApp
java -cp out br.com.curso.aula210.app.LocalTimeBasicoApp
java -cp out br.com.curso.aula210.app.LocalDateTimeBasicoApp
java -cp out br.com.curso.aula210.app.DurationBasicoApp
java -cp out br.com.curso.aula210.app.PeriodBasicoApp
java -cp out br.com.curso.aula210.app.FormatacaoDataApp
java -cp out br.com.curso.aula210.app.ParsingDataApp
java -cp out br.com.curso.aula210.app.ParsingDataErroApp
java -cp out br.com.curso.aula210.app.ContratoApp
java -cp out br.com.curso.aula210.app.ChronoUnitApp
java -cp out br.com.curso.aula210.app.TokenAcessoApp
java -cp out br.com.curso.aula210.app.OrdemServicoMapperApp
java -cp out br.com.curso.aula210.app.OrdemServicoConsultaServiceApp
java -cp out br.com.curso.aula210.app.ReagendamentoOsServiceApp
```

Para cada execução, responda:

```text
usou LocalDate, LocalTime ou LocalDateTime?
houve formatação?
houve parsing?
houve comparação de datas?
Duration ou Period faria mais sentido?
a data atual foi passada por parâmetro?
a regra ficou no domínio ou no service?
```

---

# Parte 20 — Desafio prático

## Contexto

Você vai criar um fluxo de tarefas com prazo.

O objetivo é praticar:

```text
LocalDate;
LocalDateTime;
Duration;
ChronoUnit;
DateTimeFormatter;
regra de vencimento;
service de consulta;
mapper formatando data.
```

---

## Entidade Tarefa

Crie:

```text
src\br\com\curso\aula210\dominio\tarefa\Tarefa.java
```

Campos:

```text
String codigo;
String descricao;
LocalDateTime criadaEm;
LocalDate prazo;
String status;
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
criadaEm obrigatório;
prazo obrigatório;
status obrigatório;
prazo não pode ser anterior à data de criação.
```

Métodos:

```java
boolean pendente()
boolean concluida()
boolean vencidaEm(LocalDate hoje)
long diasAtePrazo(LocalDate hoje)
void concluir(LocalDateTime concluidaEm)
String resumo()
```

Regras:

```text
pendente:
status igual PENDENTE.

concluida:
status igual CONCLUIDA.

vencidaEm:
pendente e hoje depois do prazo.

diasAtePrazo:
ChronoUnit.DAYS.between(hoje, prazo).

concluir:
se já concluída, lançar erro;
se concluidaEm antes de criadaEm, lançar erro;
status vira CONCLUIDA.
```

---

## DTO TarefaResponse

Campos:

```text
codigo;
descricao;
criadaEmFormatada;
prazoFormatado;
status;
vencida;
diasAtePrazo;
```

---

## Mapper

Crie:

```text
TarefaMapper
```

Use formatos:

```text
criadaEm:
dd/MM/yyyy HH:mm

prazo:
dd/MM/yyyy
```

---

## Service

Crie:

```text
TarefaConsultaService
```

Métodos:

```java
List<TarefaResponse> listarPendentes(LocalDate hoje)

List<TarefaResponse> listarVencidas(LocalDate hoje)

List<TarefaResponse> listarComPrazoEntre(LocalDate inicio, LocalDate fim, LocalDate hoje)
```

Regras:

```text
validar datas obrigatórias;
validar fim não anterior ao início;
ordenar por prazo;
mapear para response.
```

---

## App

Crie:

```text
TarefaDateTimeApp
```

Cenários:

```text
tarefas pendentes;
tarefas vencidas;
tarefas com prazo no intervalo;
conclusão de tarefa;
tentativa de conclusão inválida.
```

Critérios:

```text
não guardar data como String no domínio;
usar formatter no mapper;
usar ChronoUnit para dias;
passar hoje por parâmetro;
service não imprime;
domínio protege regra.
```

---

# Parte 21 — Desafio extra

## Parser de data de request

Crie:

```text
CriarTarefaRequest
```

Campos String:

```text
codigo;
descricao;
criadaEm;
prazo;
```

Formatos esperados:

```text
criadaEm:
dd/MM/yyyy HH:mm

prazo:
dd/MM/yyyy
```

Crie:

```text
TarefaCadastroService
```

Método:

```java
Tarefa cadastrar(CriarTarefaRequest request)
```

Regras:

```text
validar request obrigatório;
parsear criadaEm;
parsear prazo;
se formato inválido, lançar IllegalArgumentException com mensagem clara;
criar Tarefa com status PENDENTE.
```

Objetivo:

```text
praticar parsing controlado de datas de entrada.
```

---

# Parte 22 — Debug recomendado

Coloque breakpoints em:

```text
LocalDateOperacoesApp
LocalDateComparacaoApp
DurationBasicoApp
PeriodBasicoApp
ParsingDataErroApp
Contrato.vigenteEm
OrdemServico.reagendar
TokenAcesso.expiradoEm
OrdemServicoConsultaService.listarAgendadasEntre
ReagendamentoOsService.parseData
```

Observe:

```text
datas imutáveis;
comparação isBefore/isAfter;
Duration em minutos;
Period em calendário;
DateTimeParseException;
formatter;
regra temporal no domínio;
hoje/agora como parâmetro.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar LocalDate?
2. Quando usar LocalTime?
3. Quando usar LocalDateTime?
4. Quando usar Duration?
5. Quando usar Period?
6. Quando usar ChronoUnit?
7. Para que serve DateTimeFormatter?
8. Por que não guardar data como String no domínio?
9. Por que passar hoje/agora por parâmetro?
10. Qual cuidado com MM e mm?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar LocalDate;
usar LocalTime;
usar LocalDateTime;
somar e subtrair datas;
comparar datas;
usar Duration;
usar Period;
usar ChronoUnit;
formatar datas;
parsear datas;
tratar DateTimeParseException;
modelar regra de vigência;
modelar regra de agendamento;
modelar expiração de token;
formatar DTO no mapper;
filtrar por intervalo de datas;
resolver TarefaDateTimeApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-210-date-time-api-localdate-localdatetime-duration-period-formatter
git commit -m "Aula 210: date time api localdate localdatetime duration period formatter"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
datas devem ser modeladas com tipos de data, não com String.
```

Você estudou:

```text
LocalDate;
LocalTime;
LocalDateTime;
Duration;
Period;
ChronoUnit;
DateTimeFormatter;
parse;
format;
comparação de datas;
regras de vigência;
regras de agendamento;
expiração;
filtros por período.
```

Também reforçou uma prática profissional:

```text
passe hoje/agora por parâmetro em regras importantes para facilitar teste e evitar comportamento escondido.
```

Na próxima aula, vamos aprofundar:

```text
Instant, ZoneId, ZonedDateTime e OffsetDateTime.
```

Esse tema é essencial para sistemas distribuídos, logs, auditoria, integrações, APIs e bancos de dados.
