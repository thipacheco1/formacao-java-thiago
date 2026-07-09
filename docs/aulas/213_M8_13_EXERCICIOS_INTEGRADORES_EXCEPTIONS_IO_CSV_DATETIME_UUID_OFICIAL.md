# 213 — M8.13 — Exercícios integradores: Exceptions, Resultado, I/O, CSV, Date/Time e UUID

## Objetivo da aula

Nas últimas aulas do Módulo 8, você estudou vários recursos que aparecem juntos em backend real:

```text
exceptions;
checked e unchecked;
exceptions próprias;
modelagem de erros por camada;
Resultado<T>;
ResultadoValidacao;
ResultadoImportacao;
try/catch/finally;
try-with-resources;
Path;
Files;
BufferedReader;
BufferedWriter;
CSV manual;
cabeçalho;
linhas inválidas;
LocalDate;
LocalDateTime;
Instant;
ZoneId;
OffsetDateTime;
UUID;
correlationId;
Objects;
StringJoiner;
SecureRandom.
```

Agora vamos integrar tudo em exercícios práticos.

A ideia desta aula não é apresentar teoria nova.

A ideia é consolidar.

Você vai praticar como esses recursos se conectam em fluxos reais:

```text
importação de arquivo;
validação de linha;
criação de domínio;
registro de auditoria;
geração de correlationId;
tratamento de erro técnico;
resultado de importação;
exportação de relatório;
datas de prazo;
conversão de data/hora;
separação por camadas.
```

Ao final desta aula, você deve conseguir:

```text
montar um fluxo completo de importação CSV;
separar gateway, parser, service, domínio e app;
usar ResultadoImportacao para erros de linha;
usar exception para erro técnico;
usar UUID para ID técnico;
usar correlationId para rastreabilidade;
usar Instant para auditoria;
usar LocalDate para prazo;
usar DateTimeFormatter para parsing;
usar BufferedReader e BufferedWriter;
gerar relatório de importação;
explicar onde cada responsabilidade fica.
```

---

## Ponto central

Backend profissional raramente usa um conceito isolado.

Um fluxo real mistura:

```text
entrada;
validação;
erro;
arquivo;
data;
identificador;
domínio;
serviço;
relatório;
auditoria.
```

Exemplo de fluxo real:

```text
1. Receber arquivo CSV.
2. Gerar correlationId.
3. Ler arquivo linha a linha.
4. Validar cabeçalho.
5. Parsear cada linha.
6. Criar entidade de domínio.
7. Acumular erros de linha.
8. Registrar auditoria.
9. Exportar relatório.
10. Retornar resumo.
```

Esse é o tipo de raciocínio que aproxima você de engenharia backend.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Nesta aula:

```text
Entidade:
protege regra.

Parser:
converte linha/texto em objeto.

Gateway:
lê e escreve arquivo.

Service:
coordena fluxo.

Resultado:
comunica sucesso parcial ou falhas de validação.

Exception:
interrompe falha técnica ou uso inválido.

Auditoria:
registra o que aconteceu.

App:
executa o cenário e imprime resultado.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m8\aula-213-exercicios-integradores-exceptions-io-csv-datetime-uuid
cd labs\m8\aula-213-exercicios-integradores-exceptions-io-csv-datetime-uuid
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula213
mkdir src\br\com\curso\aula213\app
mkdir src\br\com\curso\aula213\csv
mkdir src\br\com\curso\aula213\dominio
mkdir src\br\com\curso\aula213\dominio\atividade
mkdir src\br\com\curso\aula213\dominio\auditoria
mkdir src\br\com\curso\aula213\dto
mkdir src\br\com\curso\aula213\exception
mkdir src\br\com\curso\aula213\exception\infra
mkdir src\br\com\curso\aula213\infra
mkdir src\br\com\curso\aula213\service
mkdir src\br\com\curso\aula213\validacao
```

---

# Exercício 1 — Base de validação e importação

## ErroLinha

Crie:

```text
src\br\com\curso\aula213\validacao\ErroLinha.java
```

Código:

```java
package br.com.curso.aula213.validacao;

public class ErroLinha {
    private final int numeroLinha;
    private final String mensagem;

    public ErroLinha(int numeroLinha, String mensagem) {
        if (numeroLinha <= 0) {
            throw new IllegalArgumentException("Número da linha deve ser maior que zero.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.numeroLinha = numeroLinha;
        this.mensagem = mensagem;
    }

    public int numeroLinha() {
        return numeroLinha;
    }

    public String mensagem() {
        return mensagem;
    }

    public String resumo() {
        return "Linha " + numeroLinha + ": " + mensagem;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ResultadoImportacao

Crie:

```text
src\br\com\curso\aula213\validacao\ResultadoImportacao.java
```

Código:

```java
package br.com.curso.aula213.validacao;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ResultadoImportacao<T> {
    private final UUID idImportacao;
    private final String correlationId;
    private final Instant iniciadoEm;
    private Instant finalizadoEm;
    private final List<T> itensValidos = new ArrayList<>();
    private final List<ErroLinha> erros = new ArrayList<>();

    public ResultadoImportacao(UUID idImportacao, String correlationId, Instant iniciadoEm) {
        if (idImportacao == null) {
            throw new IllegalArgumentException("ID da importação é obrigatório.");
        }

        if (correlationId == null || correlationId.isBlank()) {
            throw new IllegalArgumentException("CorrelationId é obrigatório.");
        }

        if (iniciadoEm == null) {
            throw new IllegalArgumentException("Início da importação é obrigatório.");
        }

        this.idImportacao = idImportacao;
        this.correlationId = correlationId;
        this.iniciadoEm = iniciadoEm;
    }

    public void adicionarItemValido(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Item válido é obrigatório.");
        }

        itensValidos.add(item);
    }

    public void adicionarErro(int numeroLinha, String mensagem) {
        erros.add(new ErroLinha(numeroLinha, mensagem));
    }

    public void finalizar(Instant finalizadoEm) {
        if (finalizadoEm == null) {
            throw new IllegalArgumentException("Fim da importação é obrigatório.");
        }

        if (finalizadoEm.isBefore(iniciadoEm)) {
            throw new IllegalArgumentException("Fim da importação não pode ser anterior ao início.");
        }

        this.finalizadoEm = finalizadoEm;
    }

    public UUID idImportacao() {
        return idImportacao;
    }

    public String correlationId() {
        return correlationId;
    }

    public Instant iniciadoEm() {
        return iniciadoEm;
    }

    public Instant finalizadoEm() {
        return finalizadoEm;
    }

    public int quantidadeValidos() {
        return itensValidos.size();
    }

    public int quantidadeErros() {
        return erros.size();
    }

    public boolean possuiErros() {
        return !erros.isEmpty();
    }

    public boolean sucessoTotal() {
        return erros.isEmpty();
    }

    public boolean sucessoParcial() {
        return !itensValidos.isEmpty() && !erros.isEmpty();
    }

    public List<T> itensValidos() {
        return List.copyOf(itensValidos);
    }

    public List<ErroLinha> erros() {
        return List.copyOf(erros);
    }

    public String resumo() {
        return "Importação: " + idImportacao
                + " | correlationId: " + correlationId
                + " | Válidos: " + quantidadeValidos()
                + " | Erros: " + quantidadeErros()
                + " | Início: " + iniciadoEm
                + " | Fim: " + finalizadoEm;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## O que este ResultadoImportacao integra

Ele usa:

```text
UUID;
correlationId;
Instant;
lista de válidos;
lista de erros;
resumo.
```

Isso já representa um fluxo mais realista.

---

# Exercício 2 — Exception de infraestrutura

## FalhaArquivoException

Crie:

```text
src\br\com\curso\aula213\exception\infra\FalhaArquivoException.java
```

Código:

```java
package br.com.curso.aula213.exception.infra;

public class FalhaArquivoException extends RuntimeException {
    public FalhaArquivoException(String mensagem) {
        super(mensagem);
    }

    public FalhaArquivoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

---

## Regra

Use essa exception para falhas técnicas:

```text
arquivo inexistente;
falha ao abrir;
falha ao ler;
falha ao escrever;
permissão negada.
```

Não use para linha inválida.

Linha inválida entra no `ResultadoImportacao`.

---

# Exercício 3 — Gateway de arquivo

## ArquivoCsvGateway

Crie:

```text
src\br\com\curso\aula213\infra\ArquivoCsvGateway.java
```

Código:

```java
package br.com.curso.aula213.infra;

import br.com.curso.aula213.exception.infra.FalhaArquivoException;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class ArquivoCsvGateway {
    public void processarLinhas(String caminho, BiConsumer<Integer, String> consumidorLinha) {
        validarCaminho(caminho);

        if (consumidorLinha == null) {
            throw new IllegalArgumentException("Consumidor de linha é obrigatório.");
        }

        Path path = Path.of(caminho);

        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String linha;
            int numeroLinha = 0;

            while ((linha = reader.readLine()) != null) {
                numeroLinha++;
                consumidorLinha.accept(numeroLinha, linha);
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao processar arquivo CSV: " + caminho, erro);
        }
    }

    public void escrever(String caminho, Consumer<BufferedWriter> escrita) {
        validarCaminho(caminho);

        if (escrita == null) {
            throw new IllegalArgumentException("Ação de escrita é obrigatória.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path)) {
                escrita.accept(writer);
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao escrever arquivo CSV: " + caminho, erro);
        }
    }

    private void validarCaminho(String caminho) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }
    }
}
```

---

## Responsabilidade do gateway

O gateway conhece:

```text
Path;
Files;
BufferedReader;
BufferedWriter;
IOException;
try-with-resources.
```

Ele não conhece:

```text
Atividade;
regra de negócio;
status;
prazo;
auditoria.
```

---

# Exercício 4 — Utilitário CSV

## CsvSimples

Crie:

```text
src\br\com\curso\aula213\csv\CsvSimples.java
```

Código:

```java
package br.com.curso.aula213.csv;

import java.util.Arrays;
import java.util.List;

public final class CsvSimples {
    public static final String SEPARADOR = ";";

    private CsvSimples() {
    }

    public static List<String> separar(String linha) {
        if (linha == null) {
            throw new IllegalArgumentException("Linha é obrigatória.");
        }

        return Arrays.stream(linha.split(SEPARADOR, -1))
                .map(String::trim)
                .toList();
    }

    public static void validarQuantidadeColunas(List<String> colunas, int esperado) {
        if (colunas == null) {
            throw new IllegalArgumentException("Colunas são obrigatórias.");
        }

        if (colunas.size() != esperado) {
            throw new IllegalArgumentException(
                    "Quantidade de colunas inválida. Esperado: "
                            + esperado
                            + ", recebido: "
                            + colunas.size()
            );
        }
    }

    public static boolean linhaVazia(String linha) {
        return linha == null || linha.isBlank();
    }
}
```

---

## CabecalhoCsv

Crie:

```text
src\br\com\curso\aula213\csv\CabecalhoCsv.java
```

Código:

```java
package br.com.curso.aula213.csv;

import java.util.List;

public class CabecalhoCsv {
    private final List<String> esperado;

    public CabecalhoCsv(List<String> esperado) {
        if (esperado == null || esperado.isEmpty()) {
            throw new IllegalArgumentException("Cabeçalho esperado é obrigatório.");
        }

        this.esperado = esperado.stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .toList();
    }

    public void validar(String linhaCabecalho) {
        List<String> recebido = CsvSimples.separar(linhaCabecalho)
                .stream()
                .map(String::toUpperCase)
                .toList();

        if (!esperado.equals(recebido)) {
            throw new IllegalArgumentException(
                    "Cabeçalho inválido. Esperado: " + esperado + ", recebido: " + recebido
            );
        }
    }

    public String linhaCabecalho() {
        return String.join(CsvSimples.SEPARADOR, esperado);
    }
}
```

---

# Exercício 5 — Domínio Atividade

## Atividade

Crie:

```text
src\br\com\curso\aula213\dominio\atividade\Atividade.java
```

Código:

```java
package br.com.curso.aula213.dominio.atividade;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.StringJoiner;
import java.util.UUID;

public class Atividade {
    private final UUID id;
    private final String codigo;
    private final String descricao;
    private final String status;
    private final boolean obrigatoria;
    private final int minutosEstimados;
    private final LocalDate prazo;

    public Atividade(
            UUID id,
            String codigo,
            String descricao,
            String status,
            boolean obrigatoria,
            int minutosEstimados,
            LocalDate prazo
    ) {
        if (id == null) {
            throw new IllegalArgumentException("ID técnico é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        String statusNormalizado = status.trim().toUpperCase();

        if (!"PENDENTE".equals(statusNormalizado) && !"CONCLUIDA".equals(statusNormalizado)) {
            throw new IllegalArgumentException("Status deve ser PENDENTE ou CONCLUIDA: " + status);
        }

        if (minutosEstimados <= 0) {
            throw new IllegalArgumentException("Minutos estimados deve ser maior que zero.");
        }

        if (prazo == null) {
            throw new IllegalArgumentException("Prazo é obrigatório.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.descricao = descricao.trim();
        this.status = statusNormalizado;
        this.obrigatoria = obrigatoria;
        this.minutosEstimados = minutosEstimados;
        this.prazo = prazo;
    }

    public UUID id() {
        return id;
    }

    public String codigo() {
        return codigo;
    }

    public String descricao() {
        return descricao;
    }

    public String status() {
        return status;
    }

    public boolean obrigatoria() {
        return obrigatoria;
    }

    public int minutosEstimados() {
        return minutosEstimados;
    }

    public LocalDate prazo() {
        return prazo;
    }

    public boolean pendente() {
        return "PENDENTE".equals(status);
    }

    public boolean concluida() {
        return "CONCLUIDA".equals(status);
    }

    public boolean vencidaEm(LocalDate hoje) {
        if (hoje == null) {
            throw new IllegalArgumentException("Data atual é obrigatória.");
        }

        return pendente() && hoje.isAfter(prazo);
    }

    public long diasAtePrazo(LocalDate hoje) {
        if (hoje == null) {
            throw new IllegalArgumentException("Data atual é obrigatória.");
        }

        return ChronoUnit.DAYS.between(hoje, prazo);
    }

    public String resumo() {
        return new StringJoiner(" | ")
                .add(codigo)
                .add(descricao)
                .add("Status: " + status)
                .add("Obrigatória: " + obrigatoria)
                .add("Minutos: " + minutosEstimados)
                .add("Prazo: " + prazo)
                .toString();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## O que esta entidade integra

Ela usa:

```text
UUID;
LocalDate;
ChronoUnit;
StringJoiner;
validação de domínio;
regras de prazo.
```

---

# Exercício 6 — Parser CSV de Atividade

## AtividadeCsvParser

Crie:

```text
src\br\com\curso\aula213\csv\AtividadeCsvParser.java
```

Código:

```java
package br.com.curso.aula213.csv;

import br.com.curso.aula213.dominio.atividade.Atividade;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

public class AtividadeCsvParser {
    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public Atividade parse(String linha) {
        List<String> colunas = CsvSimples.separar(linha);
        CsvSimples.validarQuantidadeColunas(colunas, 6);

        String codigo = colunas.get(0);
        String descricao = colunas.get(1);
        String status = colunas.get(2);
        boolean obrigatoria = converterBoolean(colunas.get(3));
        int minutos = converterMinutos(colunas.get(4));
        LocalDate prazo = converterPrazo(colunas.get(5));

        return new Atividade(
                UUID.randomUUID(),
                codigo,
                descricao,
                status,
                obrigatoria,
                minutos,
                prazo
        );
    }

    public String paraLinha(Atividade atividade) {
        if (atividade == null) {
            throw new IllegalArgumentException("Atividade é obrigatória.");
        }

        return String.join(
                CsvSimples.SEPARADOR,
                atividade.codigo(),
                atividade.descricao(),
                atividade.status(),
                String.valueOf(atividade.obrigatoria()),
                String.valueOf(atividade.minutosEstimados()),
                atividade.prazo().format(DATA)
        );
    }

    private boolean converterBoolean(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Obrigatória é obrigatório.");
        }

        String normalizado = valor.trim().toLowerCase();

        if ("true".equals(normalizado)) {
            return true;
        }

        if ("false".equals(normalizado)) {
            return false;
        }

        throw new IllegalArgumentException("Obrigatória deve ser true ou false: " + valor);
    }

    private int converterMinutos(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Minutos estimados é obrigatório.");
        }

        try {
            return Integer.parseInt(valor);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Minutos estimados inválido: " + valor, erro);
        }
    }

    private LocalDate converterPrazo(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Prazo é obrigatório.");
        }

        try {
            return LocalDate.parse(valor, DATA);
        } catch (DateTimeParseException erro) {
            throw new IllegalArgumentException("Prazo deve estar no formato dd/MM/yyyy: " + valor, erro);
        }
    }
}
```

---

## Responsabilidade do parser

O parser:

```text
não lê arquivo;
não escreve arquivo;
não imprime;
não coordena importação.
```

Ele apenas converte:

```text
linha CSV -> Atividade
Atividade -> linha CSV
```

---

# Exercício 7 — Auditoria

## EventoAuditoria

Crie:

```text
src\br\com\curso\aula213\dominio\auditoria\EventoAuditoria.java
```

Código:

```java
package br.com.curso.aula213.dominio.auditoria;

import java.time.Instant;
import java.util.StringJoiner;
import java.util.UUID;

public class EventoAuditoria {
    private final UUID id;
    private final String correlationId;
    private final String tipo;
    private final String descricao;
    private final Instant ocorridoEm;

    public EventoAuditoria(UUID id, String correlationId, String tipo, String descricao, Instant ocorridoEm) {
        if (id == null) {
            throw new IllegalArgumentException("ID de auditoria é obrigatório.");
        }

        if (correlationId == null || correlationId.isBlank()) {
            throw new IllegalArgumentException("CorrelationId é obrigatório.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Data/hora da auditoria é obrigatória.");
        }

        this.id = id;
        this.correlationId = correlationId;
        this.tipo = tipo.trim().toUpperCase();
        this.descricao = descricao.trim();
        this.ocorridoEm = ocorridoEm;
    }

    public UUID id() {
        return id;
    }

    public String correlationId() {
        return correlationId;
    }

    public String tipo() {
        return tipo;
    }

    public String descricao() {
        return descricao;
    }

    public Instant ocorridoEm() {
        return ocorridoEm;
    }

    public String resumo() {
        return new StringJoiner(" | ")
                .add(id.toString())
                .add("correlationId=" + correlationId)
                .add(tipo)
                .add(descricao)
                .add(ocorridoEm.toString())
                .toString();
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
src\br\com\curso\aula213\service\AuditoriaService.java
```

Código:

```java
package br.com.curso.aula213.service;

import br.com.curso.aula213.dominio.auditoria.EventoAuditoria;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AuditoriaService {
    private final List<EventoAuditoria> eventos = new ArrayList<>();

    public void registrar(String correlationId, String tipo, String descricao, Instant agora) {
        EventoAuditoria evento = new EventoAuditoria(
                UUID.randomUUID(),
                correlationId,
                tipo,
                descricao,
                agora
        );

        eventos.add(evento);
    }

    public List<EventoAuditoria> listar() {
        return List.copyOf(eventos);
    }
}
```

---

# Exercício 8 — Service de importação

## AtividadeImportacaoService

Crie:

```text
src\br\com\curso\aula213\service\AtividadeImportacaoService.java
```

Código:

```java
package br.com.curso.aula213.service;

import br.com.curso.aula213.csv.AtividadeCsvParser;
import br.com.curso.aula213.csv.CabecalhoCsv;
import br.com.curso.aula213.csv.CsvSimples;
import br.com.curso.aula213.dominio.atividade.Atividade;
import br.com.curso.aula213.infra.ArquivoCsvGateway;
import br.com.curso.aula213.validacao.ResultadoImportacao;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class AtividadeImportacaoService {
    private final ArquivoCsvGateway arquivoGateway;
    private final AtividadeCsvParser parser;
    private final AuditoriaService auditoriaService;
    private final CabecalhoCsv cabecalho;

    public AtividadeImportacaoService(
            ArquivoCsvGateway arquivoGateway,
            AtividadeCsvParser parser,
            AuditoriaService auditoriaService
    ) {
        if (arquivoGateway == null) {
            throw new IllegalArgumentException("Gateway de arquivo é obrigatório.");
        }

        if (parser == null) {
            throw new IllegalArgumentException("Parser é obrigatório.");
        }

        if (auditoriaService == null) {
            throw new IllegalArgumentException("AuditoriaService é obrigatório.");
        }

        this.arquivoGateway = arquivoGateway;
        this.parser = parser;
        this.auditoriaService = auditoriaService;
        this.cabecalho = new CabecalhoCsv(List.of(
                "CODIGO",
                "DESCRICAO",
                "STATUS",
                "OBRIGATORIA",
                "MINUTOS",
                "PRAZO"
        ));
    }

    public ResultadoImportacao<Atividade> importar(String caminho, Instant agora) {
        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        String correlationId = UUID.randomUUID().toString();

        ResultadoImportacao<Atividade> resultado = new ResultadoImportacao<>(
                UUID.randomUUID(),
                correlationId,
                agora
        );

        auditoriaService.registrar(
                correlationId,
                "IMPORTACAO_INICIADA",
                "Importação de atividades iniciada: " + caminho,
                agora
        );

        EstadoImportacao estado = new EstadoImportacao();

        arquivoGateway.processarLinhas(caminho, (numeroLinha, linha) -> {
            if (CsvSimples.linhaVazia(linha)) {
                return;
            }

            if (!estado.cabecalhoProcessado()) {
                processarCabecalho(numeroLinha, linha, resultado, estado);
                return;
            }

            processarAtividade(numeroLinha, linha, resultado);
        });

        if (!estado.cabecalhoProcessado()) {
            resultado.adicionarErro(1, "Arquivo não possui cabeçalho.");
        }

        resultado.finalizar(Instant.now());

        auditoriaService.registrar(
                correlationId,
                "IMPORTACAO_FINALIZADA",
                resultado.resumo(),
                resultado.finalizadoEm()
        );

        return resultado;
    }

    private void processarCabecalho(
            int numeroLinha,
            String linha,
            ResultadoImportacao<Atividade> resultado,
            EstadoImportacao estado
    ) {
        try {
            cabecalho.validar(linha);
        } catch (IllegalArgumentException erro) {
            resultado.adicionarErro(numeroLinha, erro.getMessage());
        } finally {
            estado.marcarCabecalhoProcessado();
        }
    }

    private void processarAtividade(
            int numeroLinha,
            String linha,
            ResultadoImportacao<Atividade> resultado
    ) {
        try {
            Atividade atividade = parser.parse(linha);
            resultado.adicionarItemValido(atividade);
        } catch (IllegalArgumentException erro) {
            resultado.adicionarErro(numeroLinha, erro.getMessage());
        }
    }

    private static class EstadoImportacao {
        private boolean cabecalhoProcessado;

        boolean cabecalhoProcessado() {
            return cabecalhoProcessado;
        }

        void marcarCabecalhoProcessado() {
            this.cabecalhoProcessado = true;
        }
    }
}
```

---

## Observação importante sobre Instant.now

O método recebe:

```java
Instant agora
```

no início para facilitar teste.

Mas usa:

```java
Instant.now()
```

no fechamento.

Em uma versão mais testável, você poderia passar um `Clock` ou receber também o fim.

Mais adiante, quando estudarmos testes, vamos melhorar isso.

---

# Exercício 9 — Exportação de válidas

## AtividadeExportacaoService

Crie:

```text
src\br\com\curso\aula213\service\AtividadeExportacaoService.java
```

Código:

```java
package br.com.curso.aula213.service;

import br.com.curso.aula213.csv.AtividadeCsvParser;
import br.com.curso.aula213.dominio.atividade.Atividade;
import br.com.curso.aula213.exception.infra.FalhaArquivoException;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class AtividadeExportacaoService {
    private final AtividadeCsvParser parser;

    public AtividadeExportacaoService(AtividadeCsvParser parser) {
        if (parser == null) {
            throw new IllegalArgumentException("Parser é obrigatório.");
        }

        this.parser = parser;
    }

    public void exportarValidas(String caminho, List<Atividade> atividades) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }

        if (atividades == null) {
            throw new IllegalArgumentException("Atividades são obrigatórias.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path)) {
                writer.write("CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS;PRAZO");
                writer.newLine();

                for (Atividade atividade : atividades) {
                    writer.write(parser.paraLinha(atividade));
                    writer.newLine();
                }
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao exportar atividades válidas: " + caminho, erro);
        }
    }
}
```

---

# Exercício 10 — Relatório de importação

## RelatorioImportacaoService

Crie:

```text
src\br\com\curso\aula213\service\RelatorioImportacaoService.java
```

Código:

```java
package br.com.curso.aula213.service;

import br.com.curso.aula213.dominio.atividade.Atividade;
import br.com.curso.aula213.exception.infra.FalhaArquivoException;
import br.com.curso.aula213.validacao.ResultadoImportacao;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class RelatorioImportacaoService {
    public void exportar(String caminho, ResultadoImportacao<Atividade> resultado) {
        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho é obrigatório.");
        }

        if (resultado == null) {
            throw new IllegalArgumentException("Resultado é obrigatório.");
        }

        Path path = Path.of(caminho);
        Path parent = path.getParent();

        try {
            if (parent != null) {
                Files.createDirectories(parent);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path)) {
                writer.write("RESUMO");
                writer.newLine();
                writer.write("ID_IMPORTACAO;" + resultado.idImportacao());
                writer.newLine();
                writer.write("CORRELATION_ID;" + resultado.correlationId());
                writer.newLine();
                writer.write("VALIDOS;" + resultado.quantidadeValidos());
                writer.newLine();
                writer.write("ERROS;" + resultado.quantidadeErros());
                writer.newLine();
                writer.write("INICIADO_EM;" + resultado.iniciadoEm());
                writer.newLine();
                writer.write("FINALIZADO_EM;" + resultado.finalizadoEm());
                writer.newLine();
                writer.newLine();

                writer.write("ERROS");
                writer.newLine();
                writer.write("LINHA;MENSAGEM");
                writer.newLine();

                resultado.erros().forEach(erro -> {
                    try {
                        writer.write(erro.numeroLinha() + ";" + erro.mensagem());
                        writer.newLine();
                    } catch (IOException excecao) {
                        throw new FalhaArquivoException("Falha ao escrever erro no relatório.", excecao);
                    }
                });
            }
        } catch (IOException erro) {
            throw new FalhaArquivoException("Falha ao exportar relatório de importação: " + caminho, erro);
        }
    }
}
```

---

## Observação sobre IOException dentro do forEach

Como `forEach` recebe uma lambda que não declara `IOException`, foi necessário tratar internamente.

Em muitos casos, um `for` tradicional fica mais limpo.

Versão mais limpa:

```java
for (ErroLinha erro : resultado.erros()) {
    writer.write(erro.numeroLinha() + ";" + erro.mensagem());
    writer.newLine();
}
```

Esse é um bom ponto de revisão:

```text
nem sempre Stream/lambda melhora código com I/O.
```

Você pode refatorar esse método para `for` como exercício.

---

# Exercício 11 — Criar arquivo de entrada

## CriarArquivoAtividadesApp

Crie:

```text
src\br\com\curso\aula213\app\CriarArquivoAtividadesApp.java
```

Código:

```java
package br.com.curso.aula213.app;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class CriarArquivoAtividadesApp {
    public static void main(String[] args) {
        Path diretorio = Path.of("dados", "atividades");
        Path arquivo = diretorio.resolve("atividades.csv");

        List<String> linhas = List.of(
                "CODIGO;DESCRICAO;STATUS;OBRIGATORIA;MINUTOS;PRAZO",
                "ATV-001;Confirmar entrega;PENDENTE;true;30;20/07/2026",
                "ATV-002;Gerar checklist;CONCLUIDA;false;20;18/07/2026",
                "ATV-003;Validar contato;PENDENTE;true;15;17/07/2026",
                "ATV-004;Linha ruim",
                "ATV-005;Minuto inválido;PENDENTE;true;abc;20/07/2026",
                "ATV-006;Status errado;ABERTA;true;10;20/07/2026",
                "ATV-007;Prazo inválido;PENDENTE;true;10;2026-07-20",
                " ;Sem código;PENDENTE;true;10;20/07/2026"
        );

        try {
            Files.createDirectories(diretorio);
            Files.write(arquivo, linhas);

            System.out.println("Arquivo criado: " + arquivo.toAbsolutePath());
        } catch (IOException erro) {
            System.out.println("Falha ao criar arquivo: " + erro.getMessage());
        }
    }
}
```

---

# Exercício 12 — App principal integrado

## AtividadeImportacaoIntegradaApp

Crie:

```text
src\br\com\curso\aula213\app\AtividadeImportacaoIntegradaApp.java
```

Código:

```java
package br.com.curso.aula213.app;

import br.com.curso.aula213.csv.AtividadeCsvParser;
import br.com.curso.aula213.dominio.atividade.Atividade;
import br.com.curso.aula213.exception.infra.FalhaArquivoException;
import br.com.curso.aula213.infra.ArquivoCsvGateway;
import br.com.curso.aula213.service.AtividadeExportacaoService;
import br.com.curso.aula213.service.AtividadeImportacaoService;
import br.com.curso.aula213.service.AuditoriaService;
import br.com.curso.aula213.service.RelatorioImportacaoService;
import br.com.curso.aula213.validacao.ResultadoImportacao;

import java.time.Instant;

public class AtividadeImportacaoIntegradaApp {
    public static void main(String[] args) {
        String entrada = "dados/atividades/atividades.csv";
        String saidaValidas = "dados/atividades/atividades-validas.csv";
        String saidaRelatorio = "dados/atividades/relatorio-importacao.csv";

        AtividadeCsvParser parser = new AtividadeCsvParser();
        AuditoriaService auditoriaService = new AuditoriaService();

        AtividadeImportacaoService importacaoService = new AtividadeImportacaoService(
                new ArquivoCsvGateway(),
                parser,
                auditoriaService
        );

        AtividadeExportacaoService exportacaoService = new AtividadeExportacaoService(parser);
        RelatorioImportacaoService relatorioService = new RelatorioImportacaoService();

        try {
            ResultadoImportacao<Atividade> resultado = importacaoService.importar(
                    entrada,
                    Instant.now()
            );

            System.out.println(resultado.resumo());

            System.out.println();
            System.out.println("Atividades válidas:");
            resultado.itensValidos()
                    .forEach(atividade -> System.out.println(" - " + atividade.resumo()));

            System.out.println();
            System.out.println("Erros:");
            resultado.erros()
                    .forEach(erro -> System.out.println(" - " + erro.resumo()));

            exportacaoService.exportarValidas(saidaValidas, resultado.itensValidos());
            relatorioService.exportar(saidaRelatorio, resultado);

            System.out.println();
            System.out.println("Arquivos gerados:");
            System.out.println(" - " + saidaValidas);
            System.out.println(" - " + saidaRelatorio);

            System.out.println();
            System.out.println("Auditoria:");
            auditoriaService.listar()
                    .forEach(evento -> System.out.println(" - " + evento.resumo()));
        } catch (FalhaArquivoException erro) {
            System.out.println("Falha técnica: " + erro.getMessage());

            if (erro.getCause() != null) {
                System.out.println("Causa: " + erro.getCause().getClass().getSimpleName());
            }
        } catch (RuntimeException erro) {
            System.out.println("Falha inesperada: " + erro.getMessage());
        }
    }
}
```

---

## Execução

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula213.app.CriarArquivoAtividadesApp
java -cp out br.com.curso.aula213.app.AtividadeImportacaoIntegradaApp
```

---

## O que observar

Você deve ver:

```text
válidos;
erros;
arquivos gerados;
eventos de auditoria;
correlationId;
id de importação;
datas com Instant.
```

Esse fluxo integra praticamente tudo do Módulo 8.

---

# Exercício 13 — Refatoração obrigatória

## Problema

No `RelatorioImportacaoService`, refatore este trecho:

```java
resultado.erros().forEach(erro -> {
    try {
        writer.write(erro.numeroLinha() + ";" + erro.mensagem());
        writer.newLine();
    } catch (IOException excecao) {
        throw new FalhaArquivoException("Falha ao escrever erro no relatório.", excecao);
    }
});
```

Para:

```java
for (ErroLinha erro : resultado.erros()) {
    writer.write(erro.numeroLinha() + ";" + erro.mensagem());
    writer.newLine();
}
```

Importe:

```java
br.com.curso.aula213.validacao.ErroLinha;
```

---

## Por que essa refatoração é importante

Porque este é um caso onde `for` é melhor que lambda.

Motivos:

```text
I/O lança IOException;
o writer está no escopo;
o fluxo é sequencial;
a leitura fica mais clara;
evita RuntimeException dentro de lambda;
facilita debug.
```

Regra:

```text
não force programação funcional onde ela piora o código.
```

---

# Exercício 14 — Consulta de atividades por prazo

## AtividadeConsultaService

Crie:

```text
src\br\com\curso\aula213\service\AtividadeConsultaService.java
```

Código:

```java
package br.com.curso.aula213.service;

import br.com.curso.aula213.dominio.atividade.Atividade;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

public class AtividadeConsultaService {
    private final List<Atividade> atividades;

    public AtividadeConsultaService(List<Atividade> atividades) {
        if (atividades == null) {
            throw new IllegalArgumentException("Atividades são obrigatórias.");
        }

        this.atividades = List.copyOf(atividades);
    }

    public List<Atividade> listarPendentesVencidas(LocalDate hoje) {
        if (hoje == null) {
            throw new IllegalArgumentException("Data atual é obrigatória.");
        }

        return atividades.stream()
                .filter(Atividade::pendente)
                .filter(atividade -> atividade.vencidaEm(hoje))
                .sorted(Comparator.comparing(Atividade::prazo))
                .toList();
    }

    public List<Atividade> listarPrazoEntre(LocalDate inicio, LocalDate fim) {
        if (inicio == null) {
            throw new IllegalArgumentException("Data inicial é obrigatória.");
        }

        if (fim == null) {
            throw new IllegalArgumentException("Data final é obrigatória.");
        }

        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException("Data final não pode ser anterior à inicial.");
        }

        return atividades.stream()
                .filter(atividade -> !atividade.prazo().isBefore(inicio))
                .filter(atividade -> !atividade.prazo().isAfter(fim))
                .sorted(Comparator.comparing(Atividade::prazo))
                .toList();
    }
}
```

---

## AtividadeConsultaServiceApp

Crie:

```text
src\br\com\curso\aula213\app\AtividadeConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula213.app;

import br.com.curso.aula213.csv.AtividadeCsvParser;
import br.com.curso.aula213.dominio.atividade.Atividade;
import br.com.curso.aula213.infra.ArquivoCsvGateway;
import br.com.curso.aula213.service.AtividadeConsultaService;
import br.com.curso.aula213.service.AtividadeImportacaoService;
import br.com.curso.aula213.service.AuditoriaService;
import br.com.curso.aula213.validacao.ResultadoImportacao;

import java.time.Instant;
import java.time.LocalDate;

public class AtividadeConsultaServiceApp {
    public static void main(String[] args) {
        AtividadeCsvParser parser = new AtividadeCsvParser();

        AtividadeImportacaoService importacaoService = new AtividadeImportacaoService(
                new ArquivoCsvGateway(),
                parser,
                new AuditoriaService()
        );

        ResultadoImportacao<Atividade> resultado = importacaoService.importar(
                "dados/atividades/atividades.csv",
                Instant.now()
        );

        AtividadeConsultaService consultaService = new AtividadeConsultaService(resultado.itensValidos());

        System.out.println("Pendentes vencidas em 21/07/2026:");
        consultaService.listarPendentesVencidas(LocalDate.of(2026, 7, 21))
                .forEach(atividade -> System.out.println(" - " + atividade.resumo()));

        System.out.println();
        System.out.println("Prazo entre 17/07 e 18/07:");
        consultaService.listarPrazoEntre(
                        LocalDate.of(2026, 7, 17),
                        LocalDate.of(2026, 7, 18)
                )
                .forEach(atividade -> System.out.println(" - " + atividade.resumo()));
    }
}
```

---

# Exercício 15 — Simulação de arquivo inexistente

## ArquivoInexistenteApp

Crie:

```text
src\br\com\curso\aula213\app\ArquivoInexistenteApp.java
```

Código:

```java
package br.com.curso.aula213.app;

import br.com.curso.aula213.csv.AtividadeCsvParser;
import br.com.curso.aula213.exception.infra.FalhaArquivoException;
import br.com.curso.aula213.infra.ArquivoCsvGateway;
import br.com.curso.aula213.service.AtividadeImportacaoService;
import br.com.curso.aula213.service.AuditoriaService;

import java.time.Instant;

public class ArquivoInexistenteApp {
    public static void main(String[] args) {
        AtividadeImportacaoService service = new AtividadeImportacaoService(
                new ArquivoCsvGateway(),
                new AtividadeCsvParser(),
                new AuditoriaService()
        );

        try {
            service.importar("dados/atividades/nao-existe.csv", Instant.now());
        } catch (FalhaArquivoException erro) {
            System.out.println("Exception técnica capturada: " + erro.getMessage());

            if (erro.getCause() != null) {
                System.out.println("Causa original: " + erro.getCause().getClass().getName());
            }
        }
    }
}
```

---

## O que observar

Arquivo inexistente é falha técnica.

Ele não entra em `ResultadoImportacao`.

Ele interrompe o fluxo com exception.

Isso está correto.

---

# Exercício 16 — Checklist de responsabilidades

Preencha mentalmente:

```text
Atividade:
regra de status, prazo, obrigatoriedade, minutos.

AtividadeCsvParser:
conversão CSV <-> Atividade.

ArquivoCsvGateway:
leitura/escrita técnica.

AtividadeImportacaoService:
coordenação da importação.

ResultadoImportacao:
resumo, válidos e erros.

AuditoriaService:
eventos técnicos da operação.

AtividadeExportacaoService:
arquivo com válidos.

RelatorioImportacaoService:
arquivo de retorno.

App:
execução e apresentação no console.
```

Se qualquer classe estiver fazendo coisa demais, refatore.

---

# Exercício 17 — Perguntas de revisão

Responda sem olhar o código:

```text
1. Por que linha inválida não deve virar FalhaArquivoException?
2. Por que arquivo inexistente não deve virar ResultadoImportacao?
3. Por que Atividade usa UUID?
4. Por que correlationId fica no ResultadoImportacao?
5. Por que Instant é melhor para auditoria?
6. Por que LocalDate é melhor para prazo?
7. Por que parser não deve imprimir?
8. Por que gateway não deve conhecer Atividade?
9. Por que service coordena e não valida sozinho todas as invariantes?
10. Quando for é melhor que Stream neste exercício?
```

---

# Exercício 18 — Desafio prático principal

## Contexto

Crie um novo fluxo completo para importação de clientes.

Você deve reutilizar o mesmo padrão da importação de atividades.

---

## Entidade Cliente

Crie:

```text
dominio/cliente/Cliente.java
```

Campos:

```text
UUID id;
String nome;
String email;
boolean ativo;
LocalDate dataCadastro;
```

Regras:

```text
id obrigatório;
nome obrigatório;
email obrigatório e contendo @;
dataCadastro obrigatória;
```

Métodos:

```java
boolean ativo()
String resumo()
```

---

## CSV esperado

Formato:

```text
NOME;EMAIL;ATIVO;DATA_CADASTRO
```

Exemplo:

```text
NOME;EMAIL;ATIVO;DATA_CADASTRO
Ana Silva;ana@empresa.com;true;10/07/2026
Carlos Souza;carlos@empresa.com;true;11/07/2026
Email Ruim;email-invalido;true;12/07/2026
Data Ruim;maria@empresa.com;true;2026-07-12
Ativo Ruim;bruna@empresa.com;sim;12/07/2026
```

---

## Classes obrigatórias

Crie:

```text
ClienteCsvParser
ClienteImportacaoService
ClienteExportacaoService
ClienteConsultaService
ClienteImportacaoIntegradaApp
```

---

## Regras

```text
usar BufferedReader por gateway;
validar cabeçalho;
validar 4 colunas;
converter boolean;
converter LocalDate com dd/MM/yyyy;
criar UUID para cliente;
acumular erros por linha;
exportar clientes válidos;
gerar relatório de erros;
registrar auditoria com correlationId;
usar ResultadoImportacao<Cliente>.
```

---

## Consulta

No `ClienteConsultaService`, implemente:

```java
List<Cliente> listarAtivos()

List<Cliente> listarCadastradosEntre(LocalDate inicio, LocalDate fim)
```

Use Streams.

---

## Critérios

```text
Cliente não conhece CSV.
Parser não conhece arquivo.
Gateway não conhece Cliente.
Service não imprime.
App imprime.
Falha técnica preserva causa.
Linha inválida vira erro controlado.
Data usa LocalDate.
Auditoria usa Instant.
ID técnico usa UUID.
```

---

# Exercício 19 — Desafio extra de arquitetura

## Separar use case

Crie uma classe:

```text
ExecutarImportacaoAtividadesUseCase
```

Ela deve coordenar:

```text
AtividadeImportacaoService;
AtividadeExportacaoService;
RelatorioImportacaoService;
AuditoriaService.
```

Método:

```java
ResultadoImportacao<Atividade> executar(String entrada, String saidaValidas, String saidaRelatorio, Instant agora)
```

Objetivo:

```text
aproximar a estrutura de Clean Architecture.
```

Regra:

```text
App chama use case.
Use case coordena.
Services especializados executam partes.
Domínio continua limpo.
```

---

# Exercício 20 — Debug recomendado

Coloque breakpoints em:

```text
ArquivoCsvGateway.processarLinhas
CsvSimples.separar
CabecalhoCsv.validar
AtividadeCsvParser.parse
AtividadeImportacaoService.importar
AtividadeImportacaoService.processarCabecalho
AtividadeImportacaoService.processarAtividade
ResultadoImportacao.adicionarItemValido
ResultadoImportacao.adicionarErro
ResultadoImportacao.finalizar
AuditoriaService.registrar
AtividadeExportacaoService.exportarValidas
RelatorioImportacaoService.exportar
```

Observe:

```text
quando o arquivo abre;
quando o cabeçalho é processado;
quando a linha vira Atividade;
quando erro de linha é acumulado;
quando erro técnico interrompe;
quando correlationId é criado;
quando auditoria registra evento;
quando relatório é exportado.
```

---

## Diagnóstico técnico da aula

Marque como concluído somente se você consegue explicar:

```text
[ ] Diferença entre erro técnico e erro de linha.
[ ] Diferença entre exception e ResultadoImportacao.
[ ] Por que usar UUID na importação.
[ ] Por que usar correlationId.
[ ] Por que usar Instant na auditoria.
[ ] Por que usar LocalDate no prazo.
[ ] Por que usar BufferedReader em importação.
[ ] Por que usar BufferedWriter em relatório.
[ ] Por que parser não lê arquivo.
[ ] Por que gateway não conhece domínio.
[ ] Por que entidade ainda valida regra.
[ ] Por que service não imprime.
[ ] Por que app trata exception técnica.
[ ] Por que linha inválida não para o lote.
```

---

## Simulado rápido

Responda:

```text
1. Qual classe deve conhecer BufferedReader?
2. Qual classe deve conhecer Atividade?
3. Qual classe deve converter linha CSV?
4. Qual classe deve acumular erros por linha?
5. Qual classe deve registrar auditoria?
6. Qual tipo representa o momento de auditoria?
7. Qual tipo representa o prazo da atividade?
8. Qual tipo representa ID técnico?
9. Qual campo rastreia uma operação entre logs?
10. Qual erro deve preservar causa original?
```

---

## Gabarito esperado

```text
1. Gateway/infraestrutura.
2. Domínio, parser e services que trabalham com Atividade.
3. Parser.
4. ResultadoImportacao.
5. AuditoriaService.
6. Instant.
7. LocalDate.
8. UUID.
9. correlationId.
10. Erro técnico convertido, como FalhaArquivoException.
```

---

## Boas práticas reforçadas

```text
Exception interrompe falha técnica.
ResultadoImportacao comunica falha de linha.
UUID identifica tecnicamente.
CorrelationId rastreia fluxo.
Instant registra momento global.
LocalDate representa prazo.
BufferedReader processa arquivo linha a linha.
BufferedWriter escreve relatório.
Parser converte.
Gateway lê/escreve.
Service coordena.
Domínio decide.
```

---

## Erros comuns

## 1. Colocar CSV dentro da entidade

Ruim:

```java
Atividade.fromCsv(linha)
```

Melhor:

```java
AtividadeCsvParser.parse(linha)
```

---

## 2. Usar exception para toda linha inválida

Isso pode parar o lote.

Use `ResultadoImportacao` quando quiser relatório.

---

## 3. Engolir IOException

Nunca faça catch vazio.

---

## 4. Perder causa original

Erro técnico deve preservar causa.

---

## 5. Usar LocalDateTime para prazo que só tem data

Prazo do exercício usa `LocalDate`.

---

## 6. Não registrar correlationId

Sem correlationId, rastreabilidade fica pior.

---

## 7. Service imprimir no console

Console é responsabilidade do app nesta fase.

---

## 8. Misturar tudo em uma classe só

Evite classe gigante fazendo:

```text
ler;
parsear;
validar;
exportar;
auditar;
imprimir.
```

---

## Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula213.app.CriarArquivoAtividadesApp
java -cp out br.com.curso.aula213.app.AtividadeImportacaoIntegradaApp
java -cp out br.com.curso.aula213.app.AtividadeConsultaServiceApp
java -cp out br.com.curso.aula213.app.ArquivoInexistenteApp
```

Para cada execução, responda:

```text
houve sucesso total, parcial ou falha técnica?
qual correlationId foi gerado?
quantas linhas válidas?
quantos erros?
quais arquivos foram gerados?
a causa técnica foi preservada?
a auditoria foi registrada?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
montar fluxo integrado de importação;
usar ResultadoImportacao com metadados;
usar UUID;
usar correlationId;
usar Instant;
usar LocalDate;
usar DateTimeFormatter;
usar BufferedReader;
usar BufferedWriter;
validar cabeçalho;
parsear CSV;
acumular erros por linha;
exportar válidos;
exportar relatório;
registrar auditoria;
tratar exception técnica;
preservar causa;
separar responsabilidades;
resolver ClienteImportacaoIntegradaApp;
explicar a arquitetura do fluxo.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m8/aula-213-exercicios-integradores-exceptions-io-csv-datetime-uuid
git commit -m "Aula 213: exercicios integradores exceptions io csv datetime uuid"
git status
```

Se aparecer arquivo `.class`, pasta `out` ou arquivos grandes de teste, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
um fluxo backend real combina erro, arquivo, data, identificador, validação e arquitetura.
```

Você integrou:

```text
exceptions;
ResultadoImportacao;
I/O;
BufferedReader;
BufferedWriter;
CSV;
DateTimeFormatter;
LocalDate;
Instant;
UUID;
correlationId;
auditoria;
relatório;
service;
parser;
gateway;
domínio.
```

Também reforçou a frase central do curso:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Na próxima aula, vamos fazer uma revisão técnica com simulado e fechamento do Módulo 8.

Depois disso, entramos em um dos módulos mais importantes da formação:

```text
SOLID.
```

A partir dali, você vai começar a organizar código não apenas para funcionar, mas para evoluir.
