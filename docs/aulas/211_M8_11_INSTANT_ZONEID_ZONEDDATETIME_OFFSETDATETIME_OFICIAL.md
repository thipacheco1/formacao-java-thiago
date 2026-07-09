# 211 — M8.11 — Instant, ZoneId, ZonedDateTime e OffsetDateTime

## Objetivo da aula

Na aula anterior, você estudou:

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

Agora vamos aprofundar um ponto essencial para backend profissional:

```text
tempo com fuso horário.
```

Na aula anterior, você viu que:

```text
LocalDateTime não possui fuso horário.
```

Isso é suficiente para algumas regras internas, mas não é suficiente para todos os cenários.

Em sistemas reais, você precisa lidar com:

```text
UTC;
fuso horário;
logs;
auditoria;
integrações;
APIs;
banco de dados;
mensageria;
eventos;
expiração global;
usuários em regiões diferentes;
conversão de horário;
horário oficial de uma empresa;
horário local de um cliente;
horário de São Paulo;
horário de Nova York;
horário de Londres.
```

Nesta aula, você vai estudar:

```text
Instant;
ZoneId;
ZonedDateTime;
OffsetDateTime;
conversões entre tipos;
UTC;
fuso horário;
offset;
DateTimeFormatter com zona;
regras práticas de backend.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é Instant;
entender o que é UTC;
entender o que é ZoneId;
entender o que é ZonedDateTime;
entender o que é OffsetDateTime;
diferenciar zona de offset;
converter Instant para horário local;
converter LocalDateTime para ZonedDateTime;
converter ZonedDateTime para Instant;
usar ZoneId.of;
usar ZoneId.systemDefault com cuidado;
modelar auditoria com Instant;
modelar exibição com ZoneId;
modelar integração com OffsetDateTime;
evitar erros comuns com fuso horário;
preparar base para APIs, banco de dados e mensageria.
```

---

## Ideia principal

Use:

```text
Instant:
momento absoluto na linha do tempo, normalmente em UTC.

ZoneId:
identificador de fuso horário, como America/Sao_Paulo.

ZonedDateTime:
data e hora com uma zona de fuso.

OffsetDateTime:
data e hora com offset fixo, como -03:00.
```

Exemplo:

```java
Instant agoraUtc = Instant.now();

ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

ZonedDateTime agoraEmSaoPaulo = agoraUtc.atZone(saoPaulo);
```

Leitura:

```text
pegue o instante global atual;
aplique o fuso de São Paulo;
obtenha data e hora local daquele fuso.
```

---

## Por que isso importa

Imagine um sistema registrando:

```text
pedido criado às 10:00.
```

Pergunta:

```text
10:00 de onde?
```

Pode ser:

```text
10:00 em São Paulo;
10:00 em UTC;
10:00 em Nova York;
10:00 no servidor;
10:00 no navegador do usuário.
```

Sem fuso, você perde contexto.

Para auditoria e integração, isso pode ser grave.

---

## Regra prática inicial

```text
Para registrar momento real:
Instant.

Para mostrar ao usuário:
ZonedDateTime com ZoneId.

Para receber/enviar data-hora em API com offset:
OffsetDateTime.

Para regra local sem fuso:
LocalDate, LocalTime ou LocalDateTime.
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

No contexto de tempo:

```text
Entidade:
protege regra temporal.

Service/use case:
coordena conversões e decisões.

Repository futuro:
salva timestamps no banco.

Client/Gateway:
converte datas de integrações externas.

Controller futuro:
recebe e devolve datas em formato adequado.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-211-instant-zoneid-zoneddatetime-offsetdatetime
cd labs\m8\aula-211-instant-zoneid-zoneddatetime-offsetdatetime
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula211
mkdir src\br\com\curso\aula211\app
mkdir src\br\com\curso\aula211\dominio
mkdir src\br\com\curso\aula211\dominio\auditoria
mkdir src\br\com\curso\aula211\dominio\evento
mkdir src\br\com\curso\aula211\dominio\integracao
mkdir src\br\com\curso\aula211\dto
mkdir src\br\com\curso\aula211\service
```

---

# Parte 1 — Instant

## O que é Instant

`Instant` representa um momento absoluto na linha do tempo.

Ele não representa:

```text
data local;
hora local;
fuso específico;
calendário de uma cidade.
```

Ele representa um instante global.

Exemplo:

```java
Instant agora = Instant.now();
```

Normalmente aparece em UTC.

---

## InstantBasicoApp

Crie:

```text
src\br\com\curso\aula211\app\InstantBasicoApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.Instant;

public class InstantBasicoApp {
    public static void main(String[] args) {
        Instant agora = Instant.now();

        System.out.println("Instant agora: " + agora);
        System.out.println("Epoch milli: " + agora.toEpochMilli());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.InstantBasicoApp
```

---

## O que observar

A saída terá formato parecido com:

```text
2026-07-09T01:00:00.000Z
```

O `Z` indica:

```text
UTC
```

UTC é uma referência global de tempo.

---

## Quando usar Instant

Use `Instant` para:

```text
auditoria;
createdAt;
updatedAt;
eventos técnicos;
logs;
mensageria;
integração;
registro de momento real;
ordenação global;
expiração independente de fuso local.
```

Exemplo de backend:

```java
private final Instant criadoEm;
private Instant atualizadoEm;
```

---

# Parte 2 — Somando e subtraindo Instant

## InstantOperacoesApp

Crie:

```text
src\br\com\curso\aula211\app\InstantOperacoesApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.Duration;
import java.time.Instant;

public class InstantOperacoesApp {
    public static void main(String[] args) {
        Instant agora = Instant.now();

        Instant daquiTrintaMinutos = agora.plus(Duration.ofMinutes(30));
        Instant umaHoraAtras = agora.minus(Duration.ofHours(1));

        System.out.println("Agora: " + agora);
        System.out.println("Daqui 30 minutos: " + daquiTrintaMinutos);
        System.out.println("Uma hora atrás: " + umaHoraAtras);
        System.out.println("Expirou? " + agora.isAfter(daquiTrintaMinutos));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.InstantOperacoesApp
```

---

## Observação

`Instant` combina bem com:

```java
Duration
```

Exemplo:

```text
token expira em 15 minutos;
evento expira em 2 horas;
mensagem tem timeout de 30 segundos.
```

---

# Parte 3 — ZoneId

## O que é ZoneId

`ZoneId` representa uma zona de fuso horário.

Exemplos:

```text
America/Sao_Paulo
America/New_York
Europe/London
UTC
```

Use:

```java
ZoneId.of("America/Sao_Paulo")
```

---

## ZoneIdBasicoApp

Crie:

```text
src\br\com\curso\aula211\app\ZoneIdBasicoApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.ZoneId;

public class ZoneIdBasicoApp {
    public static void main(String[] args) {
        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
        ZoneId utc = ZoneId.of("UTC");
        ZoneId sistema = ZoneId.systemDefault();

        System.out.println("São Paulo: " + saoPaulo);
        System.out.println("UTC: " + utc);
        System.out.println("Sistema: " + sistema);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.ZoneIdBasicoApp
```

---

## Cuidado com systemDefault

`ZoneId.systemDefault()` depende do ambiente.

Em desenvolvimento pode ser um fuso.

Em produção pode ser outro.

Em container Docker pode ser UTC.

Regra profissional:

```text
não dependa de systemDefault em regra crítica.
```

Prefira explicitar:

```java
ZoneId.of("America/Sao_Paulo")
```

ou configurar o fuso da aplicação.

---

# Parte 4 — Convertendo Instant para ZonedDateTime

## ZonedDateTime

`ZonedDateTime` representa:

```text
data;
hora;
zona de fuso.
```

Exemplo:

```text
2026-07-08T22:00-03:00[America/Sao_Paulo]
```

---

## InstantParaZonedDateTimeApp

Crie:

```text
src\br\com\curso\aula211\app\InstantParaZonedDateTimeApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class InstantParaZonedDateTimeApp {
    public static void main(String[] args) {
        Instant instant = Instant.now();

        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");
        ZoneId novaYork = ZoneId.of("America/New_York");
        ZoneId utc = ZoneId.of("UTC");

        ZonedDateTime emSaoPaulo = instant.atZone(saoPaulo);
        ZonedDateTime emNovaYork = instant.atZone(novaYork);
        ZonedDateTime emUtc = instant.atZone(utc);

        System.out.println("Instant: " + instant);
        System.out.println("São Paulo: " + emSaoPaulo);
        System.out.println("Nova York: " + emNovaYork);
        System.out.println("UTC: " + emUtc);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.InstantParaZonedDateTimeApp
```

---

## O que observar

O `Instant` é o mesmo.

Mas a representação local muda conforme o fuso.

Isso é fundamental:

```text
mesmo momento global;
horários locais diferentes.
```

---

# Parte 5 — ZonedDateTime.now

## ZonedDateTimeNowApp

Crie:

```text
src\br\com\curso\aula211\app\ZonedDateTimeNowApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class ZonedDateTimeNowApp {
    public static void main(String[] args) {
        ZonedDateTime agoraSaoPaulo = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
        ZonedDateTime agoraUtc = ZonedDateTime.now(ZoneId.of("UTC"));
        ZonedDateTime agoraLondon = ZonedDateTime.now(ZoneId.of("Europe/London"));

        System.out.println("São Paulo: " + agoraSaoPaulo);
        System.out.println("UTC: " + agoraUtc);
        System.out.println("Londres: " + agoraLondon);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.ZonedDateTimeNowApp
```

---

## Boa prática

Se a regra depende de uma zona específica, deixe explícito:

```java
ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
```

Evite esconder isso no ambiente.

---

# Parte 6 — Convertendo ZonedDateTime para Instant

## ZonedDateTimeParaInstantApp

Crie:

```text
src\br\com\curso\aula211\app\ZonedDateTimeParaInstantApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.Instant;

public class ZonedDateTimeParaInstantApp {
    public static void main(String[] args) {
        ZonedDateTime dataHoraSaoPaulo = ZonedDateTime.of(
                2026,
                7,
                9,
                10,
                30,
                0,
                0,
                ZoneId.of("America/Sao_Paulo")
        );

        Instant instant = dataHoraSaoPaulo.toInstant();

        System.out.println("ZonedDateTime: " + dataHoraSaoPaulo);
        System.out.println("Instant: " + instant);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.ZonedDateTimeParaInstantApp
```

---

## Leitura profissional

Isso significa:

```text
um horário local em São Paulo foi convertido para um momento global.
```

Essa conversão é útil para persistência e auditoria.

---

# Parte 7 — LocalDateTime com ZoneId

## Problema

`LocalDateTime` sozinho não sabe o fuso.

Exemplo:

```java
LocalDateTime.of(2026, 7, 9, 10, 30)
```

Isso significa:

```text
10:30 em qual lugar?
```

Para transformar em momento real, você precisa aplicar uma zona:

```java
localDateTime.atZone(ZoneId.of("America/Sao_Paulo"))
```

---

## LocalDateTimeComZoneApp

Crie:

```text
src\br\com\curso\aula211\app\LocalDateTimeComZoneApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.Instant;

public class LocalDateTimeComZoneApp {
    public static void main(String[] args) {
        LocalDateTime local = LocalDateTime.of(2026, 7, 9, 10, 30);

        ZonedDateTime emSaoPaulo = local.atZone(ZoneId.of("America/Sao_Paulo"));
        ZonedDateTime emNovaYork = local.atZone(ZoneId.of("America/New_York"));

        Instant instantSaoPaulo = emSaoPaulo.toInstant();
        Instant instantNovaYork = emNovaYork.toInstant();

        System.out.println("LocalDateTime: " + local);
        System.out.println("Como São Paulo: " + emSaoPaulo + " -> " + instantSaoPaulo);
        System.out.println("Como Nova York: " + emNovaYork + " -> " + instantNovaYork);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.LocalDateTimeComZoneApp
```

---

## O que observar

O mesmo `LocalDateTime` pode virar instantes diferentes dependendo da zona.

Regra profissional:

```text
LocalDateTime só vira momento real quando você informa a zona.
```

---

# Parte 8 — OffsetDateTime

## O que é OffsetDateTime

`OffsetDateTime` representa:

```text
data;
hora;
offset.
```

Exemplo:

```text
2026-07-09T10:30-03:00
```

Offset é a diferença em relação ao UTC.

Exemplos:

```text
-03:00
+00:00
+01:00
```

---

## OffsetDateTimeBasicoApp

Crie:

```text
src\br\com\curso\aula211\app\OffsetDateTimeBasicoApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class OffsetDateTimeBasicoApp {
    public static void main(String[] args) {
        OffsetDateTime agora = OffsetDateTime.now();
        OffsetDateTime horarioComOffset = OffsetDateTime.of(
                2026,
                7,
                9,
                10,
                30,
                0,
                0,
                ZoneOffset.of("-03:00")
        );

        System.out.println("Agora: " + agora);
        System.out.println("Com offset -03:00: " + horarioComOffset);
        System.out.println("Instant: " + horarioComOffset.toInstant());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.OffsetDateTimeBasicoApp
```

---

## ZoneId vs Offset

## ZoneId

Exemplo:

```text
America/Sao_Paulo
```

Representa uma região com regras históricas e políticas de horário.

## Offset

Exemplo:

```text
-03:00
```

Representa apenas diferença fixa para UTC.

Regra prática:

```text
ZoneId:
melhor para horário local de uma região.

OffsetDateTime:
muito comum em APIs e integrações.

Instant:
melhor para momento absoluto.
```

---

# Parte 9 — DateTimeFormatter com zona

## Formatando ZonedDateTime

Crie:

```text
src\br\com\curso\aula211\app\FormatacaoComZonaApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class FormatacaoComZonaApp {
    public static void main(String[] args) {
        ZonedDateTime dataHora = ZonedDateTime.of(
                2026,
                7,
                9,
                10,
                30,
                0,
                0,
                ZoneId.of("America/Sao_Paulo")
        );

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm z");

        System.out.println("Original: " + dataHora);
        System.out.println("Formatado: " + dataHora.format(formatter));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.FormatacaoComZonaApp
```

---

## Padrões úteis

```text
dd/MM/yyyy HH:mm:
09/07/2026 10:30

dd/MM/yyyy HH:mm z:
09/07/2026 10:30 BRT

yyyy-MM-dd'T'HH:mm:ssXXX:
2026-07-09T10:30:00-03:00
```

Observação:

```text
XXX:
offset como -03:00.

z:
nome abreviado da zona.
```

---

# Parte 10 — Auditoria com Instant

## RegistroAuditoria

Crie:

```text
src\br\com\curso\aula211\dominio\auditoria\RegistroAuditoria.java
```

Código:

```java
package br.com.curso.aula211.dominio.auditoria;

import java.time.Instant;

public class RegistroAuditoria {
    private final String usuario;
    private final String acao;
    private final Instant ocorridoEm;

    public RegistroAuditoria(String usuario, String acao, Instant ocorridoEm) {
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        if (acao == null || acao.isBlank()) {
            throw new IllegalArgumentException("Ação é obrigatória.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Data/hora da ocorrência é obrigatória.");
        }

        this.usuario = usuario.trim();
        this.acao = acao.trim();
        this.ocorridoEm = ocorridoEm;
    }

    public String usuario() {
        return usuario;
    }

    public String acao() {
        return acao;
    }

    public Instant ocorridoEm() {
        return ocorridoEm;
    }

    public String resumo() {
        return usuario + " | " + acao + " | " + ocorridoEm;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## AuditoriaService

Crie:

```text
src\br\com\curso\aula211\service\AuditoriaService.java
```

Código:

```java
package br.com.curso.aula211.service;

import br.com.curso.aula211.dominio.auditoria.RegistroAuditoria;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AuditoriaService {
    private final List<RegistroAuditoria> registros = new ArrayList<>();

    public RegistroAuditoria registrar(String usuario, String acao, Instant agora) {
        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        RegistroAuditoria registro = new RegistroAuditoria(usuario, acao, agora);
        registros.add(registro);

        return registro;
    }

    public List<RegistroAuditoria> listar() {
        return List.copyOf(registros);
    }
}
```

---

## AuditoriaApp

Crie:

```text
src\br\com\curso\aula211\app\AuditoriaApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import br.com.curso.aula211.dominio.auditoria.RegistroAuditoria;
import br.com.curso.aula211.service.AuditoriaService;

import java.time.Instant;

public class AuditoriaApp {
    public static void main(String[] args) {
        AuditoriaService service = new AuditoriaService();

        RegistroAuditoria registro = service.registrar(
                "thiago",
                "FATURAR_PEDIDO",
                Instant.now()
        );

        System.out.println(registro.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.AuditoriaApp
```

---

## Por que Instant em auditoria

Auditoria registra momento real.

Não deve depender do fuso local de quem visualiza.

Para exibir, convertemos depois.

---

# Parte 11 — DTO de auditoria com fuso de exibição

## RegistroAuditoriaResponse

Crie:

```text
src\br\com\curso\aula211\dto\RegistroAuditoriaResponse.java
```

Código:

```java
package br.com.curso.aula211.dto;

public class RegistroAuditoriaResponse {
    private final String usuario;
    private final String acao;
    private final String ocorridoEm;

    public RegistroAuditoriaResponse(String usuario, String acao, String ocorridoEm) {
        this.usuario = usuario;
        this.acao = acao;
        this.ocorridoEm = ocorridoEm;
    }

    public String usuario() {
        return usuario;
    }

    public String acao() {
        return acao;
    }

    public String ocorridoEm() {
        return ocorridoEm;
    }

    public String resumo() {
        return usuario + " | " + acao + " | " + ocorridoEm;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## RegistroAuditoriaMapper

Crie:

```text
src\br\com\curso\aula211\dto\RegistroAuditoriaMapper.java
```

Código:

```java
package br.com.curso.aula211.dto;

import br.com.curso.aula211.dominio.auditoria.RegistroAuditoria;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class RegistroAuditoriaMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss z");

    private RegistroAuditoriaMapper() {
    }

    public static RegistroAuditoriaResponse toResponse(RegistroAuditoria registro, ZoneId zona) {
        if (registro == null) {
            throw new IllegalArgumentException("Registro é obrigatório.");
        }

        if (zona == null) {
            throw new IllegalArgumentException("Zona é obrigatória.");
        }

        String dataHora = registro.ocorridoEm()
                .atZone(zona)
                .format(FORMATTER);

        return new RegistroAuditoriaResponse(
                registro.usuario(),
                registro.acao(),
                dataHora
        );
    }
}
```

---

## AuditoriaMapperApp

Crie:

```text
src\br\com\curso\aula211\app\AuditoriaMapperApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import br.com.curso.aula211.dominio.auditoria.RegistroAuditoria;
import br.com.curso.aula211.dto.RegistroAuditoriaMapper;
import br.com.curso.aula211.dto.RegistroAuditoriaResponse;

import java.time.Instant;
import java.time.ZoneId;

public class AuditoriaMapperApp {
    public static void main(String[] args) {
        RegistroAuditoria registro = new RegistroAuditoria(
                "thiago",
                "CRIAR_OS",
                Instant.parse("2026-07-09T13:30:00Z")
        );

        RegistroAuditoriaResponse saoPaulo = RegistroAuditoriaMapper.toResponse(
                registro,
                ZoneId.of("America/Sao_Paulo")
        );

        RegistroAuditoriaResponse utc = RegistroAuditoriaMapper.toResponse(
                registro,
                ZoneId.of("UTC")
        );

        System.out.println("São Paulo: " + saoPaulo.resumo());
        System.out.println("UTC: " + utc.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.AuditoriaMapperApp
```

---

## O que este exemplo mostra

O domínio guarda:

```text
Instant
```

O mapper exibe conforme:

```text
ZoneId escolhido.
```

Essa é uma separação profissional.

---

# Parte 12 — Evento com horário local e zona

## EventoAgenda

Crie:

```text
src\br\com\curso\aula211\dominio\evento\EventoAgenda.java
```

Código:

```java
package br.com.curso.aula211.dominio.evento;

import java.time.Duration;
import java.time.ZonedDateTime;

public class EventoAgenda {
    private final String codigo;
    private final String titulo;
    private final ZonedDateTime inicio;
    private final ZonedDateTime fim;

    public EventoAgenda(String codigo, String titulo, ZonedDateTime inicio, ZonedDateTime fim) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do evento é obrigatório.");
        }

        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título do evento é obrigatório.");
        }

        if (inicio == null) {
            throw new IllegalArgumentException("Início do evento é obrigatório.");
        }

        if (fim == null) {
            throw new IllegalArgumentException("Fim do evento é obrigatório.");
        }

        if (!fim.isAfter(inicio)) {
            throw new IllegalArgumentException("Fim do evento deve ser posterior ao início.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.titulo = titulo.trim();
        this.inicio = inicio;
        this.fim = fim;
    }

    public String codigo() {
        return codigo;
    }

    public String titulo() {
        return titulo;
    }

    public ZonedDateTime inicio() {
        return inicio;
    }

    public ZonedDateTime fim() {
        return fim;
    }

    public Duration duracao() {
        return Duration.between(inicio, fim);
    }

    public boolean ocorreDepoisDe(ZonedDateTime referencia) {
        if (referencia == null) {
            throw new IllegalArgumentException("Referência é obrigatória.");
        }

        return inicio.isAfter(referencia);
    }

    public String resumo() {
        return codigo
                + " | " + titulo
                + " | Início: " + inicio
                + " | Fim: " + fim
                + " | Minutos: " + duracao().toMinutes();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## EventoAgendaApp

Crie:

```text
src\br\com\curso\aula211\app\EventoAgendaApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import br.com.curso.aula211.dominio.evento.EventoAgenda;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class EventoAgendaApp {
    public static void main(String[] args) {
        ZoneId saoPaulo = ZoneId.of("America/Sao_Paulo");

        EventoAgenda evento = new EventoAgenda(
                "EVT-001",
                "Reunião de planejamento",
                ZonedDateTime.of(2026, 7, 9, 9, 0, 0, 0, saoPaulo),
                ZonedDateTime.of(2026, 7, 9, 10, 30, 0, 0, saoPaulo)
        );

        System.out.println(evento.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.EventoAgendaApp
```

---

# Parte 13 — Integração com OffsetDateTime

## EventoIntegracao

Crie:

```text
src\br\com\curso\aula211\dominio\integracao\EventoIntegracao.java
```

Código:

```java
package br.com.curso.aula211.dominio.integracao;

import java.time.OffsetDateTime;
import java.time.Instant;

public class EventoIntegracao {
    private final String idExterno;
    private final String tipo;
    private final OffsetDateTime recebidoEm;

    public EventoIntegracao(String idExterno, String tipo, OffsetDateTime recebidoEm) {
        if (idExterno == null || idExterno.isBlank()) {
            throw new IllegalArgumentException("ID externo é obrigatório.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (recebidoEm == null) {
            throw new IllegalArgumentException("Data/hora de recebimento é obrigatória.");
        }

        this.idExterno = idExterno.trim();
        this.tipo = tipo.trim().toUpperCase();
        this.recebidoEm = recebidoEm;
    }

    public String idExterno() {
        return idExterno;
    }

    public String tipo() {
        return tipo;
    }

    public OffsetDateTime recebidoEm() {
        return recebidoEm;
    }

    public Instant recebidoComoInstant() {
        return recebidoEm.toInstant();
    }

    public String resumo() {
        return idExterno
                + " | Tipo: " + tipo
                + " | Recebido em: " + recebidoEm
                + " | Instant: " + recebidoComoInstant();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## EventoIntegracaoApp

Crie:

```text
src\br\com\curso\aula211\app\EventoIntegracaoApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import br.com.curso.aula211.dominio.integracao.EventoIntegracao;

import java.time.OffsetDateTime;

public class EventoIntegracaoApp {
    public static void main(String[] args) {
        OffsetDateTime recebidoEm = OffsetDateTime.parse("2026-07-09T10:30:00-03:00");

        EventoIntegracao evento = new EventoIntegracao(
                "EXT-001",
                "pedido_criado",
                recebidoEm
        );

        System.out.println(evento.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.EventoIntegracaoApp
```

---

## Por que OffsetDateTime em integração

Muitas APIs enviam datas assim:

```text
2026-07-09T10:30:00-03:00
```

Isso tem offset.

`OffsetDateTime` é adequado para parsear esse formato.

Depois você pode converter para:

```java
Instant
```

para persistir ou comparar globalmente.

---

# Parte 14 — Service de conversão de horários

## ConversorHorarioService

Crie:

```text
src\br\com\curso\aula211\service\ConversorHorarioService.java
```

Código:

```java
package br.com.curso.aula211.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class ConversorHorarioService {
    public ZonedDateTime converterInstantParaZona(Instant instant, ZoneId zona) {
        if (instant == null) {
            throw new IllegalArgumentException("Instant é obrigatório.");
        }

        if (zona == null) {
            throw new IllegalArgumentException("Zona é obrigatória.");
        }

        return instant.atZone(zona);
    }

    public Instant converterZonaParaInstant(ZonedDateTime dataHora) {
        if (dataHora == null) {
            throw new IllegalArgumentException("Data/hora é obrigatória.");
        }

        return dataHora.toInstant();
    }

    public ZonedDateTime converterEntreZonas(ZonedDateTime origem, ZoneId destino) {
        if (origem == null) {
            throw new IllegalArgumentException("Data/hora de origem é obrigatória.");
        }

        if (destino == null) {
            throw new IllegalArgumentException("Zona de destino é obrigatória.");
        }

        return origem.withZoneSameInstant(destino);
    }
}
```

---

## ConversorHorarioServiceApp

Crie:

```text
src\br\com\curso\aula211\app\ConversorHorarioServiceApp.java
```

Código:

```java
package br.com.curso.aula211.app;

import br.com.curso.aula211.service.ConversorHorarioService;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class ConversorHorarioServiceApp {
    public static void main(String[] args) {
        ConversorHorarioService service = new ConversorHorarioService();

        Instant instant = Instant.parse("2026-07-09T13:30:00Z");

        ZonedDateTime saoPaulo = service.converterInstantParaZona(
                instant,
                ZoneId.of("America/Sao_Paulo")
        );

        ZonedDateTime novaYork = service.converterEntreZonas(
                saoPaulo,
                ZoneId.of("America/New_York")
        );

        System.out.println("Instant: " + instant);
        System.out.println("São Paulo: " + saoPaulo);
        System.out.println("Nova York: " + novaYork);
        System.out.println("Volta para Instant: " + service.converterZonaParaInstant(novaYork));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula211.app.ConversorHorarioServiceApp
```

---

## withZoneSameInstant

Este método:

```java
withZoneSameInstant
```

mantém o mesmo momento real e muda a representação na zona de destino.

Isso é diferente de simplesmente trocar campos.

Regra profissional:

```text
para converter horário entre zonas mantendo o mesmo instante, use withZoneSameInstant.
```

---

# Parte 15 — Boas práticas

## 1. Use Instant para auditoria

Exemplo:

```java
Instant criadoEm;
Instant atualizadoEm;
```

---

## 2. Use ZoneId para exibição

Exemplo:

```java
registro.ocorridoEm().atZone(ZoneId.of("America/Sao_Paulo"))
```

---

## 3. Use OffsetDateTime para APIs

Quando receber:

```text
2026-07-09T10:30:00-03:00
```

use:

```java
OffsetDateTime.parse(...)
```

---

## 4. Evite depender de systemDefault

Em backend, o ambiente pode mudar.

Prefira zona explícita.

---

## 5. Não confunda LocalDateTime com momento real

`LocalDateTime` sem zona é apenas data e hora local.

---

## 6. Converta para Instant quando precisar comparar globalmente

Exemplo:

```java
zonedDateTime.toInstant()
offsetDateTime.toInstant()
```

---

## 7. Guarde zona quando ela fizer parte da regra

Evento local em agenda pode precisar de `ZonedDateTime`.

Auditoria técnica pode usar `Instant`.

---

## 8. Cuidado ao formatar

Escolha formato claro.

Para APIs, prefira formatos ISO quando possível.

---

# Parte 16 — Erros comuns

## 1. Salvar tudo como String

Ruim:

```java
private String criadoEm;
```

Melhor:

```java
private Instant criadoEm;
```

---

## 2. Usar LocalDateTime para auditoria global

Auditoria global precisa de momento absoluto.

Prefira `Instant`.

---

## 3. Ignorar zona na conversão

```java
LocalDateTime
```

sem zona pode gerar instantes errados.

---

## 4. Usar systemDefault em regra crítica

Pode mudar entre ambientes.

---

## 5. Confundir offset com zona

```text
-03:00 não é a mesma coisa que America/Sao_Paulo.
```

Offset é diferença fixa.

ZoneId representa região e regras.

---

## 6. Comparar horários locais de zonas diferentes sem converter

Converta para `Instant` quando precisar comparar momento real.

---

# Parte 17 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula211.app.InstantBasicoApp
java -cp out br.com.curso.aula211.app.InstantOperacoesApp
java -cp out br.com.curso.aula211.app.ZoneIdBasicoApp
java -cp out br.com.curso.aula211.app.InstantParaZonedDateTimeApp
java -cp out br.com.curso.aula211.app.ZonedDateTimeNowApp
java -cp out br.com.curso.aula211.app.ZonedDateTimeParaInstantApp
java -cp out br.com.curso.aula211.app.LocalDateTimeComZoneApp
java -cp out br.com.curso.aula211.app.OffsetDateTimeBasicoApp
java -cp out br.com.curso.aula211.app.FormatacaoComZonaApp
java -cp out br.com.curso.aula211.app.AuditoriaApp
java -cp out br.com.curso.aula211.app.AuditoriaMapperApp
java -cp out br.com.curso.aula211.app.EventoAgendaApp
java -cp out br.com.curso.aula211.app.EventoIntegracaoApp
java -cp out br.com.curso.aula211.app.ConversorHorarioServiceApp
```

Para cada execução, responda:

```text
o tipo usado foi Instant, ZonedDateTime ou OffsetDateTime?
havia ZoneId?
havia offset?
houve conversão para Instant?
o mesmo instante apareceu diferente em outra zona?
a regra era auditoria, agenda ou integração?
```

---

# Parte 18 — Desafio prático

## Contexto

Você vai criar um fluxo de auditoria e exibição por fuso.

O objetivo é praticar:

```text
Instant;
ZoneId;
ZonedDateTime;
DateTimeFormatter;
mapper;
service;
exibição conforme zona.
```

---

## Entidade EventoAuditoria

Crie:

```text
src\br\com\curso\aula211\dominio\auditoria\EventoAuditoria.java
```

Campos:

```text
String codigo;
String usuario;
String acao;
Instant ocorridoEm;
```

Regras:

```text
codigo obrigatório;
usuario obrigatório;
acao obrigatória;
ocorridoEm obrigatório.
```

Métodos:

```java
String resumo()
```

---

## DTO EventoAuditoriaResponse

Campos:

```text
codigo;
usuario;
acao;
ocorridoEmFormatado;
zona;
```

---

## Mapper

Crie:

```text
EventoAuditoriaMapper
```

Método:

```java
EventoAuditoriaResponse toResponse(EventoAuditoria evento, ZoneId zona)
```

Formato:

```text
dd/MM/yyyy HH:mm:ss z
```

---

## Service

Crie:

```text
EventoAuditoriaConsultaService
```

Campos:

```text
List<EventoAuditoria> eventos
```

Métodos:

```java
List<EventoAuditoriaResponse> listarNaZona(ZoneId zona)

List<EventoAuditoriaResponse> listarEntre(Instant inicio, Instant fim, ZoneId zona)
```

Regras:

```text
validar zona obrigatória;
validar início e fim obrigatórios;
fim não pode ser anterior ao início;
filtrar por Instant;
ordenar por ocorridoEm;
mapear para response.
```

---

## App

Crie:

```text
EventoAuditoriaFusoApp
```

Cenários:

```text
listar eventos em America/Sao_Paulo;
listar eventos em UTC;
listar eventos em America/New_York;
listar eventos entre dois Instants.
```

Critérios:

```text
domínio usa Instant;
mapper converte para ZoneId;
service filtra por Instant;
não usar String para guardar data;
não depender de systemDefault.
```

---

# Parte 19 — Desafio extra

## Integração externa

Crie entidade:

```text
NotificacaoExterna
```

Campos:

```text
String id;
String tipo;
OffsetDateTime enviadaEm;
```

Métodos:

```java
Instant enviadaComoInstant()
String resumo()
```

Crie parser/service que receba strings no formato:

```text
2026-07-09T10:30:00-03:00
```

e crie `OffsetDateTime`.

Depois converta para `Instant` e compare ordenação entre notificações de offsets diferentes.

Objetivo:

```text
entender que offsets diferentes podem representar o mesmo instante.
```

---

# Parte 20 — Debug recomendado

Coloque breakpoints em:

```text
InstantParaZonedDateTimeApp
ZonedDateTimeParaInstantApp
LocalDateTimeComZoneApp
OffsetDateTimeBasicoApp
RegistroAuditoriaMapper.toResponse
EventoAgenda.duracao
EventoIntegracao.recebidoComoInstant
ConversorHorarioService.converterEntreZonas
```

Observe:

```text
Instant não muda;
representação local muda;
ZoneId altera exibição;
OffsetDateTime vira Instant;
LocalDateTime depende da zona aplicada;
withZoneSameInstant mantém o mesmo momento real.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar Instant?
2. Quando usar ZoneId?
3. Quando usar ZonedDateTime?
4. Quando usar OffsetDateTime?
5. Qual diferença entre ZoneId e offset?
6. Por que LocalDateTime não representa momento global?
7. Por que auditoria combina com Instant?
8. Como exibir um Instant em São Paulo?
9. Como converter OffsetDateTime para Instant?
10. Por que evitar systemDefault em regra crítica?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Instant;
usar ZoneId;
usar ZonedDateTime;
usar OffsetDateTime;
converter Instant para ZonedDateTime;
converter ZonedDateTime para Instant;
converter OffsetDateTime para Instant;
formatar data/hora com zona;
modelar auditoria com Instant;
modelar agenda com ZonedDateTime;
modelar integração com OffsetDateTime;
diferenciar zona de offset;
evitar systemDefault em regra crítica;
resolver EventoAuditoriaFusoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-211-instant-zoneid-zoneddatetime-offsetdatetime
git commit -m "Aula 211: instant zoneid zoneddatetime offsetdatetime"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Instant registra o momento global; ZoneId define como esse momento aparece localmente.
```

Você estudou:

```text
Instant;
UTC;
ZoneId;
ZonedDateTime;
OffsetDateTime;
ZoneOffset;
conversão entre zonas;
conversão para Instant;
DateTimeFormatter com zona;
auditoria;
agenda;
integração externa;
boas práticas de fuso horário.
```

Também reforçou uma regra profissional:

```text
não confunda data/hora local com momento global.
```

Na próxima aula, vamos fechar o bloco de utilitários modernos do Módulo 8 com:

```text
Objects;
StringJoiner;
UUID;
Random;
SecureRandom;
record de apoio;
boas práticas de utilitários em backend.
```
