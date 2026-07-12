# 468 - M16.13 - CSV e arquivos de integracao

## Apresentação da aula

Na aula 467, o laboratório passou a tratar XML como contrato formal e entrada hostil.

O fluxo seguro ficou:

```text
body limitado;

parser hardened;

namespace;

XSD;

mapping;

modelo interno.
```

Agora estudaremos outro formato muito utilizado em integrações corporativas:

```text
CSV.
```

Arquivos delimitados aparecem em:

- importação de estoque;
- carga de clientes;
- integração com ERP;
- conciliação;
- relatórios financeiros;
- migração de dados;
- processamento de fornecedores;
- troca de informações com sistemas legados.

CSV parece simples. Um exemplo básico seria:

```text
record_id;warehouse_code;product_code;operation;quantity;occurred_at
ADJ-0001;SP-01;SKU-1001;ADD;10;2026-07-12T13:00:00Z
```

Uma integração real precisa declarar encoding, delimitador, aspas, escaping, BOM, header, ordem das colunas, timezone, formato numérico, identificação, idempotência, rejeições, limites de memória, archive e quarantine.

A pergunta central será:

```text
como transformar
um arquivo CSV
em um contrato de integração
seguro,
idempotente,
streaming
e observável?
```

O laboratório receberá um novo projeto:

```text
catalog-file-importer.
```

Ele continuará dentro de:

```text
labs/m16/aula-456-integracoes-http-entre-sistemas/
```

A estrutura ficará:

```text
catalog-provider;

order-consumer;

order-consumer-reactive;

catalog-file-importer.
```

O importador processará ajustes de estoque de um parceiro.

O arquivo será:

```text
inventory-adjustments-v1.
```

Schema lógico:

```text
record_id;

warehouse_code;

product_code;

operation;

quantity;

occurred_at.
```

Operações permitidas:

```text
ADD;

REMOVE;

SET.
```

Exemplo:

```csv
record_id;warehouse_code;product_code;operation;quantity;occurred_at
ADJ-0001;SP-01;SKU-1001;ADD;10;2026-07-12T13:00:00Z
ADJ-0002;SP-01;SKU-1002;REMOVE;2;2026-07-12T13:01:00Z
ADJ-0003;RJ-01;SKU-2001;SET;40;2026-07-12T13:02:00Z
```

A baseline do contrato será:

```text
encoding:
UTF-8.

BOM:
opcional somente no início.

delimiter:
ponto e vírgula.

quote:
aspas duplas.

record separator:
LF ou CRLF.

header:
obrigatório e exato.

empty lines:
proibidas.

multiline fields:
proibidos.

decimal locale:
não aplicável;
quantity é inteiro.

timestamp:
ISO-8601 com offset.

maximum file size:
50 MiB.

maximum records:
500.000.

maximum field length:
200 caracteres.
```

Usaremos ponto e vírgula porque o formato será explícito e evita conflito com vírgula decimal de algumas ferramentas regionais.

Isso não torna ponto e vírgula universal.

Outro parceiro poderia usar vírgula, tab ou pipe.

Cada contrato precisa declarar seu dialeto.

O processamento será streaming.

Não usaremos:

```java
Files.readAllLines(...)
```

porque esse método carrega o arquivo inteiro em memória.

Utilizaremos:

- `InputStream`;
- `BufferedReader`;
- parser CSV;
- processamento record a record;
- contadores;
- flush em lotes pequenos;
- relatório de rejeições.

O parser será Apache Commons CSV, encapsulado por um adapter fora do domínio.

A integração também será idempotente em dois níveis.

Nível de arquivo:

```text
partner
+
SHA-256 do conteúdo.
```

Nível de registro:

```text
partner
+
record_id.
```

Quando o mesmo conteúdo chegar novamente com outro nome:

```text
arquivo duplicado;

nenhum novo ajuste.
```

Quando o mesmo `record_id` chegar novamente com o mesmo fingerprint:

```text
registro duplicado;

nenhum novo efeito.
```

Quando o mesmo `record_id` chegar com conteúdo diferente:

```text
conflito;

linha rejeitada;

arquivo marcado
como parcialmente rejeitado
ou falha final,
conforme policy.
```

A aula utilizará processamento parcial controlado.

Linhas válidas serão aplicadas.

Linhas inválidas irão para um arquivo de rejeição.

O resultado poderá ser:

```text
COMPLETED;

COMPLETED_WITH_REJECTIONS;

REJECTED;

DUPLICATE;

QUARANTINED.
```

Erros estruturais de arquivo provocam rejeição total.

Exemplos:

- encoding inválido;
- header incorreto;
- arquivo acima do limite;
- delimitador incompatível;
- checksum conflitante;
- versão desconhecida;
- parser quebrado.

Erros de uma linha podem gerar rejeição individual:

- product code inválido;
- quantity negativa;
- timestamp inválido;
- operation desconhecida;
- record ID duplicado com payload diferente;
- campo obrigatório ausente.

O relatório de rejeições não incluirá a linha bruta inteira.

Ele terá apenas campos controlados:

```text
record_number;

record_id;

error_code;

field_name;

safe_message.
```

Isso reduz exposição, CSV injection, logs excessivos e vazamento de payload.

Também protegeremos arquivos destinados a operadores contra formula injection. Valores iniciados por:

```text
=;

+;

-;

@.
```

podem ser interpretados como fórmulas. O report neutralizará esses valores somente na saída humana, sem alterar o dado interno.

O ciclo de diretórios local será:

```text
inbox;

processing;

archive;

rejected;

quarantine;

reports.
```

O importador reivindica o arquivo com uma movimentação atômica:

```text
inbox
->
processing.
```

Ao concluir:

```text
processing
->
archive.
```

Falha estrutural:

```text
processing
->
quarantine.
```

Esse ciclo prepara a próxima aula:

```text
469 - M16.14 - SFTP
```

O SFTP será somente o transporte remoto; contrato, idempotência e processamento local já estarão prontos.

Não usaremos Spring Batch nesta aula.

A orquestração formal de jobs ficará para:

```text
470 - M16.15 - Jobs batch.
```

Ao final, você deverá explicar:

```text
por que CSV
não possui um dialeto universal;

por que encoding
faz parte do contrato;

por que parser CSV
é melhor que split;

por que arquivo
não deve ser carregado inteiro;

por que checksum
não substitui record ID;

por que CSV injection
é risco de saída;

por que rejeição parcial
precisa de policy;

por que transporte SFTP
não resolve contrato,
idempotência
ou validação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
466:
SOAP conceitual.

467:
XML.

468:
CSV e arquivos de integracao.

469:
SFTP.

470:
Jobs batch.
```

A aula 467 respondeu:

```text
como validar
e processar XML
com segurança?
```

A aula 468 responderá:

```text
como processar
arquivos tabulares
com contrato,
streaming,
idempotência
e rejeições?
```

Nesta aula:

```text
dialeto CSV:
sim.

encoding:
sim.

streaming:
sim.

checksum:
sim.

idempotência:
sim.

rejeições:
sim.

CSV injection:
sim.

diretórios locais:
sim.

SFTP:
próxima aula.

Spring Batch:
aula 470.
```

A regra central será:

```text
arquivo é uma mensagem;

nome,
conteúdo,
versão,
checksum
e resultado
fazem parte do contrato.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
catalog-file-importer/
├── src/main/java/
│   └── br/com/formacao/catalogfileimporter/
│       ├── application/
│       ├── domain/
│       └── infrastructure/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
└── docs/
```

Classes:

```text
InventoryAdjustmentFileImporter;

InventoryAdjustmentCsvReader;

InventoryAdjustmentRecordMapper;

InventoryAdjustmentValidator;

InventoryAdjustmentService;

IntegrationFileReceipt;

IntegrationFileReceiptRepository;

ImportedAdjustmentRecord;

ImportedAdjustmentRecordRepository;

FileFingerprintService;

FileClaimService;

RejectionReportWriter;

CsvCellNeutralizer;

IntegrationFileProperties;

InventoryAdjustmentContract.
```

Migrations:

```text
V1__create_integration_file_receipt.sql;

V2__create_imported_adjustment_record.sql.
```

Testes:

```text
InventoryAdjustmentContractTest;

CsvHeaderValidationTest;

CsvQuotedFieldTest;

CsvEncodingTest;

CsvBomTest;

CsvMultilineFieldRejectionTest;

CsvStreamingTest;

CsvFileSizeLimitTest;

CsvRecordLimitTest;

FileFingerprintTest;

FileIdempotencyTest;

RecordIdempotencyTest;

RecordConflictTest;

PartialRejectionTest;

StructuralRejectionTest;

CsvInjectionProtectionTest;

FileClaimConcurrencyTest;

RejectionReportContractTest;

FileLifecycleTest;

FileLoggingSecurityTest.
```

Documentação:

```text
docs/files/
├── INVENTORY_ADJUSTMENT_CSV_CONTRACT.md
├── FILE_LIFECYCLE.md
├── FILE_IDEMPOTENCY.md
├── FILE_REJECTION_POLICY.md
└── FILE_INTEGRATION_RUNBOOK.md
```

Você irá:

1. definir o dialeto;
2. definir o naming;
3. definir limites;
4. criar directories;
5. criar properties;
6. calcular checksum;
7. registrar receipt;
8. reivindicar arquivo;
9. validar encoding;
10. validar header;
11. ler em streaming;
12. mapear records;
13. validar fields;
14. aplicar ajustes;
15. proteger idempotência;
16. produzir rejeições;
17. neutralizar formulas;
18. arquivar arquivos;
19. criar métricas;
20. preparar SFTP.

---

## Conceito essencial

### CSV não é um único formato

CSV significa valores delimitados, mas implementações variam.

Possíveis diferenças:

- vírgula;
- ponto e vírgula;
- tab;
- pipe;
- aspas;
- escape;
- line ending;
- encoding;
- header;
- comentário;
- linhas vazias;
- trimming.

Por isso, o contrato precisa declarar um dialeto.

---

### Não use split

Código inseguro:

```java
line.split(";");
```

Falha com:

```csv
ADJ-1;SP-01;"SKU;SPECIAL";ADD;10;2026-07-12T13:00:00Z
```

Um parser CSV entende delimitador dentro de campo quoted.

Também trata:

```csv
"Product ""Special"""
```

como:

```text
Product "Special".
```

---

### Header como contrato

Header oficial:

```text
record_id;

warehouse_code;

product_code;

operation;

quantity;

occurred_at.
```

A baseline exige:

- todas as colunas;
- nenhuma coluna extra;
- mesma ordem;
- mesma caixa;
- sem espaços;
- sem duplicidade.

Mudança incompatível exige uma nova versão.

---

### Versão do contrato

A versão aparece em três lugares:

```text
tipo lógico:
inventory-adjustments-v1;

nome do arquivo;

registro do receipt.
```

Não dependa apenas do header para inferir versão.

---

### Naming

Formato:

```text
inventory-adjustments-v1_
<UTC timestamp>_
<sequence>.csv
```

Exemplo:

```text
inventory-adjustments-v1_20260712T140000Z_000001.csv
```

Regex:

```text
^inventory-adjustments-v1_[0-9]{8}T[0-9]{6}Z_[0-9]{6}\.csv$
```

Não inclua:

- espaços;
- path separators;
- tenant name livre;
- dados pessoais;
- caracteres de controle.

---

### Path traversal

O importador recebe um `Path` descoberto no inbox, normaliza e verifica:

```text
candidate.toRealPath()
começa com
inbox.toRealPath().
```

Não concatene filename vindo de endpoint público.

---

### Encoding

Baseline:

```text
UTF-8.
```

Bytes inválidos são rejeitados.

Use `CharsetDecoder` com:

```text
CodingErrorAction.REPORT.
```

Não substitua silenciosamente caracteres inválidos por `�`.

---

### BOM

Um BOM UTF-8 pode aparecer nos primeiros bytes:

```text
EF BB BF.
```

A baseline tolera somente esse BOM no início do arquivo.

Ele é removido antes da leitura do header.

BOM em outro local é conteúdo inválido.

Registre métrica para acompanhar parceiros que ainda o enviam.

---

### Delimitador

O delimitador é:

```text
;.
```

Não faça autodetecção.

Autodetecção pode interpretar incorretamente um arquivo defeituoso e produzir mapeamentos silenciosos.

Contrato incompatível deve falhar.

---

### Aspas e escaping

Quote:

```text
".
```

Uma aspas dentro do campo é duplicada:

```csv
"PRODUCT ""SPECIAL"""
```

A baseline não usa barra invertida como escape.

---

### Multiline fields

CSV permite line breaks dentro de campos quoted em alguns dialetos.

A integração desta aula proíbe multiline fields.

Motivos:

- facilita rastreabilidade;
- simplifica relatórios;
- reduz ambiguidade operacional;
- mantém um record por linha física.

O parser pode reconhecer o record, mas o validator rejeita qualquer field com `\r` ou `\n`.

---

### Trimming

Não aplique `trim()` em tudo.

Ele pode alterar identifiers.

A baseline:

- header não aceita espaços;
- fields obrigatórios não podem ser blank;
- valores são comparados exatamente;
- normalização é específica por field.

Product code pode ser convertido para uppercase somente se o contrato declarar.

Nesta aula, já deve vir uppercase.

---

### Números

`quantity` é inteiro decimal ASCII:

```text
0;

10;

999.
```

Não aceite:

```text
1.000;

1,5;

+10;

10 units.
```

Cada operação possui regra:

```text
ADD:
quantity > 0.

REMOVE:
quantity > 0.

SET:
quantity >= 0.
```

---

### Timestamp

Formato:

```text
ISO-8601 com offset.
```

Exemplo:

```text
2026-07-12T13:00:00Z.
```

Use:

```java
OffsetDateTime.parse(value).toInstant();
```

Não use timezone default da máquina.

---

### Tamanho de field

Maximum:

```text
200 caracteres.
```

Fields específicos têm limites menores:

```text
record ID:
80;

warehouse:
20;

product:
40;

operation:
10;

timestamp:
40.
```

O limite geral protege o parser e os reports.

---

### Streaming

O arquivo é processado record a record.

Memória deve crescer de forma aproximadamente constante, independentemente do número de linhas.

O teste não precisa medir bytes exatos de heap.

Ele comprova:

- ausência de `readAllLines`;
- ausência de lista com todos os records;
- consumer callback por record;
- máximo de records aplicado.

---

### File size e record count

Limites diferentes:

```text
file size:
50 MiB.

records:
500.000.
```

Um arquivo pequeno pode ter records demais.

Um arquivo grande pode ter poucas linhas com fields excessivos.

Ambos precisam ser controlados.

---

### Checksum

Use SHA-256 sobre os bytes originais do arquivo.

O checksum é calculado antes do parse sobre os bytes originais, preservando qualquer alteração recebida.

---

### Receipt de arquivo

Tabela:

```text
integration_file_receipt.
```

Campos:

- partner;
- original filename;
- checksum;
- contract version;
- size;
- status;
- rows read;
- rows accepted;
- rows rejected;
- timestamps;
- report path;
- safe error code.

Unique constraints:

```text
partner + checksum;

partner + filename.
```

---

### Mesmo nome e conteúdo diferente

Esse cenário é suspeito. Policy:

```text
QUARANTINED.
```

O arquivo não é processado.

Pode indicar substituição indevida, erro operacional ou fraude.

---

### Mesmo conteúdo e nome diferente

É duplicata de conteúdo.

Policy:

```text
DUPLICATE;

nenhum reprocessamento.
```

---

### Record idempotency

Tabela:

```text
imported_adjustment_record.
```

Unique:

```text
partner + record_id.
```

Também armazena fingerprint canônico do record.

Mesmo ID e mesmo fingerprint:

```text
duplicate record;

sem novo efeito.
```

Mesmo ID e fingerprint diferente:

```text
record conflict;

rejeição.
```

---

### Processamento parcial

A baseline aceita linhas válidas e rejeita inválidas porque os records são independentes. Arquivos que exigem atomicidade total precisam de outra policy.

---

### Erro estrutural

Um erro estrutural inviabiliza interpretar o arquivo inteiro.

Exemplos:

- header errado;
- encoding inválido;
- parser inconsistente;
- versão desconhecida;
- tamanho acima do limite;
- nome inválido.

Resultado:

```text
REJECTED
ou
QUARANTINED.
```

---

### Rejection report

Formato:

```csv
record_number;record_id;error_code;field_name;safe_message
2;ADJ-0002;INVALID_QUANTITY;quantity;Quantity must be positive
```

O report usa encoding e delimitador próprios do contrato de rejeição.

Não inclua:

- linha inteira;
- stack;
- SQL;
- exception message bruta;
- path absoluto;
- secrets.

---

### CSV injection

Planilhas podem interpretar cells iniciadas por:

```text
=;

+;

-;

@.
```

O writer de reports neutraliza campos textuais com prefixo seguro.

Exemplo:

```text
'=SUM(A1:A2)
```

Isso ocorre apenas na exportação humana.

O valor original permanece separado no processamento.

---

### Atomic move

A claim usa:

```java
Files.move(
    source,
    processingTarget,
    StandardCopyOption.ATOMIC_MOVE
);
```

Se o filesystem não suporta atomic move, a aplicação precisa falhar ou usar uma estratégia explicitamente aprovada.

Não faça copy e delete silencioso.

---

### Arquivo imutável

Depois do claim, o arquivo é imutável e o checksum é comparado novamente antes do archive.

Se mudou:

```text
QUARANTINED.
```

---

## Mão na massa guiada

### 1. Criar o projeto

```powershell
New-Item `
  -ItemType Directory `
  -Path labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer `
  -Force
```

Use Java 21 e Spring Boot conforme a baseline da formação.

---

### 2. Criar directories locais

```text
data/file-integration/
├── inbox
├── processing
├── archive
├── rejected
├── quarantine
└── reports
```

Adicione apenas `.gitkeep`.

Não versione arquivos processados.

---

### 3. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.inventory-adjustment-files"
)
public record IntegrationFileProperties(
        Path inbox,
        Path processing,
        Path archive,
        Path rejected,
        Path quarantine,
        Path reports,
        DataSize maximumFileSize,
        long maximumRecords,
        int maximumFieldLength,
        String partner
) {
}
```

Valide paths distintos e limites positivos.

---

### 4. Criar contract descriptor

```java
public record InventoryAdjustmentContract(
        String version,
        char delimiter,
        char quote,
        List<String> header,
        Charset charset,
        boolean optionalUtf8Bom,
        boolean multilineAllowed
) {
}
```

Bean:

```java
new InventoryAdjustmentContract(
    "v1",
    ';',
    '"',
    List.of(
        "record_id",
        "warehouse_code",
        "product_code",
        "operation",
        "quantity",
        "occurred_at"
    ),
    StandardCharsets.UTF_8,
    true,
    false
);
```

---

### 5. Adicionar Apache Commons CSV

Use uma versão gerenciada e fixa.

A biblioteca fica em `infrastructure.csv`.

O domínio não importa packages do parser.

---

### 6. Criar migration do receipt

```sql
CREATE TABLE integration_file_receipt (
    id UUID PRIMARY KEY,
    partner VARCHAR(80) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    checksum_sha256 CHAR(64) NOT NULL,
    contract_version VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    rows_read BIGINT NOT NULL,
    rows_accepted BIGINT NOT NULL,
    rows_rejected BIGINT NOT NULL,
    received_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    rejection_report_name VARCHAR(255),
    safe_error_code VARCHAR(120),
    CONSTRAINT uq_file_partner_checksum
        UNIQUE (
            partner,
            checksum_sha256
        ),
    CONSTRAINT uq_file_partner_name
        UNIQUE (
            partner,
            original_filename
        )
);
```

---

### 7. Criar migration dos records

```sql
CREATE TABLE imported_adjustment_record (
    id UUID PRIMARY KEY,
    partner VARCHAR(80) NOT NULL,
    record_id VARCHAR(80) NOT NULL,
    record_fingerprint CHAR(64) NOT NULL,
    file_receipt_id UUID NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_adjustment_file
        FOREIGN KEY (
            file_receipt_id
        )
        REFERENCES integration_file_receipt(id),
    CONSTRAINT uq_adjustment_partner_record
        UNIQUE (
            partner,
            record_id
        )
);
```

---

### 8. Criar naming validator

```java
private static final Pattern FILE_NAME =
        Pattern.compile(
            "^inventory-adjustments-v1_"
            + "[0-9]{8}T[0-9]{6}Z_"
            + "[0-9]{6}\\.csv$"
        );
```

Rejeite qualquer path separator.

---

### 9. Criar FileFingerprintService

```java
public String sha256(
        Path file
) {
    MessageDigest digest =
            MessageDigest.getInstance(
                "SHA-256"
            );

    try (
        InputStream input =
            Files.newInputStream(file)
    ) {
        byte[] buffer =
                new byte[8192];

        int read;

        while (
            (read = input.read(buffer)) != -1
        ) {
            digest.update(
                buffer,
                0,
                read
            );
        }
    }

    return HexFormat.of()
            .formatHex(
                digest.digest()
            );
}
```

---

### 10. Criar preflight

Antes do claim:

- filename;
- regular file;
- no symbolic link;
- path dentro do inbox;
- size;
- checksum;
- receipt duplicate checks.

Symbolic links são proibidos na baseline.

---

### 11. Criar FileClaimService

```java
public Path claim(
        Path source
) {
    Path target =
            processing.resolve(
                source.getFileName()
                      .toString()
            );

    return Files.move(
        source,
        target,
        StandardCopyOption.ATOMIC_MOVE
    );
}
```

Falha de claim indica que outro worker pode ter vencido.

---

### 12. Criar UTF-8 decoder

```java
CharsetDecoder decoder =
        StandardCharsets.UTF_8
            .newDecoder()
            .onMalformedInput(
                CodingErrorAction.REPORT
            )
            .onUnmappableCharacter(
                CodingErrorAction.REPORT
            );
```

Remova BOM somente na primeira posição.

---

### 13. Configurar CSVFormat

```java
CSVFormat format =
        CSVFormat.DEFAULT
            .builder()
            .setDelimiter(';')
            .setQuote('"')
            .setHeader(
                contract.header()
                        .toArray(String[]::new)
            )
            .setSkipHeaderRecord(true)
            .setIgnoreEmptyLines(false)
            .setTrim(false)
            .get();
```

A API deve acompanhar a versão aprovada.

---

### 14. Validar header antes dos records

Leia a primeira record/header de forma controlada.

Compare:

```text
quantidade;

nomes;

ordem;

duplicidade.
```

Não aceite coluna extra.

---

### 15. Criar reader streaming

```java
public void read(
        Path file,
        Consumer<CsvRecordView> consumer
) {
    try (
        InputStream input =
            openUtf8WithoutBom(file);

        Reader reader =
            new BufferedReader(
                new InputStreamReader(
                    input,
                    strictDecoder()
                )
            );

        CSVParser parser =
            format.parse(reader)
    ) {
        for (
            CSVRecord record : parser
        ) {
            consumer.accept(
                CsvRecordView.from(record)
            );
        }
    }
}
```

Não retorne `List` de todos os records.

---

### 16. Criar record mapper

```java
public InventoryAdjustmentCommand map(
        CsvRecordView record
) {
    return new InventoryAdjustmentCommand(
            new AdjustmentRecordId(
                record.required(
                    "record_id"
                )
            ),
            new WarehouseCode(
                record.required(
                    "warehouse_code"
                )
            ),
            new ProductCode(
                record.required(
                    "product_code"
                )
            ),
            AdjustmentOperation.valueOf(
                record.required(
                    "operation"
                )
            ),
            parseQuantity(
                record.required(
                    "quantity"
                )
            ),
            OffsetDateTime
                .parse(
                    record.required(
                        "occurred_at"
                    )
                )
                .toInstant()
    );
}
```

Traduza erros por field.

---

### 17. Validar multiline e field length

Antes do mapping:

```text
qualquer field
com CR ou LF:
MULTILINE_FIELD_NOT_ALLOWED.

field > limit:
FIELD_TOO_LONG.
```

---

### 18. Criar record fingerprint

Material:

```text
partner;

record ID;

warehouse;

product;

operation;

quantity;

occurredAt normalizado;

schema version.
```

Use SHA-256.

---

### 19. Aplicar idempotência do record

Fluxo:

1. procurar por partner + record ID;
2. se ausente, aplicar adjustment e salvar fingerprint;
3. se mesmo fingerprint, marcar duplicate;
4. se diferente, rejeitar conflict.

A unique constraint protege concorrência.

---

### 20. Aplicar adjustment

Regras:

```text
ADD:
soma.

REMOVE:
subtrai sem ficar negativo.

SET:
define quantidade.
```

Use lock ou update condicional para estoque.

Cada record válido usa uma transação curta.

---

### 21. Processar arquivo

```java
ImportSummary importFile(
        Path claimedFile,
        IntegrationFileReceipt receipt
) {
    RejectionCollector rejections =
            new RejectionCollector();

    reader.read(
        claimedFile,
        record -> {
            enforceRecordLimit();

            try {
                processRecord(
                    receipt,
                    record
                );
            }
            catch (
                RecordValidationException error
            ) {
                rejections.add(
                    toSafeRejection(
                        record,
                        error
                    )
                );
            }
        }
    );

    return summary(
        rejections
    );
}
```

O collector guarda dados mínimos; em volumes altos, escreva rejeições em streaming.

---

### 22. Criar report writer

Header:

```text
record_number;

record_id;

error_code;

field_name;

safe_message.
```

Escreva em:

```text
reports/<base-name>.rejections.csv.part
```

Depois faça move atômico para:

```text
reports/<base-name>.rejections.csv.
```

---

### 23. Neutralizar formula injection

```java
String neutralize(
        String value
) {
    if (
        value != null
        && !value.isEmpty()
        && "=+-@".indexOf(
            value.charAt(0)
        ) >= 0
    ) {
        return "'" + value;
    }

    return value;
}
```

Aplique somente aos campos textuais do report humano.

---

### 24. Definir status final

Sem rejeições:

```text
COMPLETED.
```

Com aceitos e rejeitados:

```text
COMPLETED_WITH_REJECTIONS.
```

Nenhum aceito por erros de record:

```text
REJECTED.
```

Erro estrutural ou conflito de filename:

```text
QUARANTINED.
```

Checksum duplicado:

```text
DUPLICATE.
```

---

### 25. Arquivar

Arquivo processado vai para:

```text
archive/YYYY/MM/DD/.
```

Arquivo rejeitado estruturalmente:

```text
rejected/YYYY/MM/DD/.
```

Suspeita ou conflito:

```text
quarantine/YYYY/MM/DD/.
```

Mantenha filename original.

---

### 26. Criar sidecar de resultado

Gere:

```text
<filename>.result.json
```

Campos:

```json
{
  "fileName": "inventory-adjustments-v1_20260712T140000Z_000001.csv",
  "checksum": "sha256...",
  "status": "COMPLETED_WITH_REJECTIONS",
  "rowsRead": 100,
  "rowsAccepted": 97,
  "rowsRejected": 3,
  "completedAt": "2026-07-12T14:03:00Z",
  "rejectionReport": "inventory-adjustments-v1_...rejections.csv"
}
```

Não inclua stack ou payloads.

---

### 27. Testar quoted delimiter

Input:

```csv
ADJ-1;SP-01;"SKU;SPECIAL";ADD;10;2026-07-12T13:00:00Z
```

O parser mantém o delimitador dentro do field.

O value object pode rejeitar o product code por contrato.

O erro não pode ser “coluna extra”.

---

### 28. Testar aspas escapadas

Valide comportamento do parser e rejeição do value object quando aplicável.

---

### 29. Testar header errado

Cenários:

- coluna ausente;
- coluna extra;
- ordem diferente;
- espaço no nome;
- duplicidade;
- caixa diferente.

Todos são erros estruturais.

---

### 30. Testar encoding inválido

Bytes inválidos UTF-8:

```text
REJECTED;

INVALID_ENCODING.
```

Nenhuma substituição silenciosa.

---

### 31. Testar BOM

BOM no início:

```text
aceito;

métrica bom_detected.
```

BOM no meio de field:

```text
valor inválido.
```

---

### 32. Testar multiline

Campo quoted com newline:

```text
record rejeitado;

MULTILINE_FIELD_NOT_ALLOWED.
```

---

### 33. Testar file size

Crie sparse ou fixture controlada acima de 50 MiB.

O parser não é aberto.

---

### 34. Testar record count

Com `maximumRecords + 1`:

```text
erro estrutural;

processamento interrompido;

status REJECTED.
```

Documente se records já aplicados devem ser mantidos.

A baseline mantém os records previamente confirmados e registra o arquivo como `COMPLETED_WITH_REJECTIONS_LIMIT_ABORTED`.

Para contratos que exigem atomicidade, use outra policy.

---

### 35. Testar streaming

Use arquivo grande gerado durante o teste.

Confirme:

- callback record a record;
- ausência de lista total;
- counters corretos;
- report streaming.

---

### 36. Testar file duplicate

Mesmo bytes, outro nome:

```text
DUPLICATE;

zero records aplicados.
```

---

### 37. Testar filename conflict

Mesmo nome, bytes diferentes:

```text
QUARANTINED;

zero records aplicados.
```

---

### 38. Testar record duplicate

Mesmo record ID e fingerprint:

```text
duplicate;

sem novo ajuste.
```

---

### 39. Testar record conflict

Mesmo record ID e conteúdo diferente:

```text
rejection:

RECORD_ID_PAYLOAD_CONFLICT.
```

---

### 40. Testar partial rejection

Arquivo com:

- duas linhas válidas;
- uma quantity inválida;
- uma operation inválida.

Esperado:

```text
2 aplicadas;

2 rejeitadas;

COMPLETED_WITH_REJECTIONS;

report com 2 rows.
```

---

### 41. Testar structural rejection

Header inválido:

```text
0 linhas aplicadas;

REJECTED;

arquivo em rejected.
```

---

### 42. Testar CSV injection

Record ID:

```text
=HYPERLINK(...)
```

O domínio rejeita pelo formato.

No report, o valor é neutralizado.

Nenhuma formula fica ativa.

---

### 43. Testar claim concorrente

Dois workers tentam mover o mesmo arquivo.

Esperado:

```text
um vence;

um recebe claim unavailable;

um receipt efetivo.
```

---

### 44. Testar alteração após claim

Modifique a fixture entre checksum inicial e checksum final.

Esperado:

```text
QUARANTINED;

FILE_CHANGED_DURING_PROCESSING.
```

---

### 45. Criar métricas

```text
file.integration.received;

file.integration.completed;

file.integration.duplicate;

file.integration.quarantined;

file.integration.rows;

file.integration.rejections;

file.integration.duration;

file.integration.bytes.
```

Tags:

```text
partner;

contract.version;

status;

error.code.
```

Não use filename, record ID ou checksum como tag.

---

### 46. Criar logs seguros

Permitido:

```text
receipt ID;

partner;

contract version;

status;

counts;

checksum prefix;

duration;

correlation de execução.
```

Proibido:

- linha bruta;
- arquivo inteiro;
- path absoluto;
- stack em response;
- dados pessoais;
- conteúdo de field.

---

### 47. Criar contract doc

Arquivo:

```text
INVENTORY_ADJUSTMENT_CSV_CONTRACT.md
```

Inclua:

- filename;
- encoding;
- BOM;
- delimiter;
- quote;
- header;
- field definitions;
- examples;
- limits;
- line policy;
- status;
- rejection codes;
- versioning.

---

### 48. Criar lifecycle doc

Diagrama:

```text
INBOX
  |
  | atomic claim
  v
PROCESSING
  |          \
  | success   \ structural/suspicious
  v             v
ARCHIVE      REJECTED/QUARANTINE
```

---

### 49. Criar idempotency doc

Explique:

```text
file checksum;

filename uniqueness;

record ID;

record fingerprint;

unique constraints;

replay behavior.
```

---

### 50. Criar runbook

Perguntas:

- filename é válido;
- checksum já existe;
- nome já existe com outro checksum;
- encoding é UTF-8;
- BOM existe;
- header coincide;
- delimiter coincide;
- file size;
- record count;
- accepted/rejected;
- report existe;
- arquivo foi arquivado;
- record conflict aumentou;
- partner mudou versão;
- processamento foi interrompido.

---

### 51. Executar testes

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer

.\mvnw.cmd `
  -Dtest=InventoryAdjustmentContractTest,CsvHeaderValidationTest,CsvQuotedFieldTest,CsvEncodingTest,CsvBomTest,CsvMultilineFieldRejectionTest,CsvStreamingTest,CsvFileSizeLimitTest,CsvRecordLimitTest,FileFingerprintTest,FileIdempotencyTest,RecordIdempotencyTest,RecordConflictTest,PartialRejectionTest,StructuralRejectionTest,CsvInjectionProtectionTest,FileClaimConcurrencyTest,RejectionReportContractTest,FileLifecycleTest,FileLoggingSecurityTest `
  test
```

---

### 52. Executar cenário manual

1. coloque arquivo válido no inbox;
2. execute import explícito;
3. confirme claim;
4. confirme receipt;
5. confirme adjustments;
6. confirme archive;
7. repita os mesmos bytes;
8. confirme duplicate;
9. envie arquivo parcialmente inválido;
10. confirme report.

---

### 53. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- contract;
- encoding;
- streaming;
- limits;
- idempotency;
- rejection;
- lifecycle;
- security;
- metrics;
- logs.

---

### 54. Registrar limitações

Ainda faltam:

```text
SFTP;

download atômico remoto;

host key verification;

scheduler;

Spring Batch;

restartability formal;

partitioning;

grandes volumes produtivos;

retenção operacional;

antivirus;

PGP.
```

---

## Entendendo o que foi feito

### CSV ganhou um dialeto explícito

Delimitador, aspas, encoding, header e line endings deixaram de ser suposições.

### Arquivo virou uma mensagem identificável

Nome, versão, checksum e receipt fazem parte do contrato.

### Processamento ficou streaming

O volume não precisa caber inteiro em memória.

### Idempotência ganhou dois níveis

Checksum protege o arquivo; record ID e fingerprint protegem cada ajuste.

### Rejeições ficaram operáveis

Erros de linha produzem report seguro; erros estruturais rejeitam o arquivo.

### CSV injection foi tratada na saída

Reports humanos não executam formulas.

### Lifecycle ficou explícito

Claim, processing, archive, rejected e quarantine possuem significado.

### Concorrência ficou protegida

Atomic move e unique constraints definem um único owner.

### SFTP foi preparado

A próxima aula adicionará transporte sem alterar o contrato.

---

## Erros comuns importantes

### Usar split

Quoted delimiters quebram a leitura.

### Autodetectar delimitador

Arquivo defeituoso pode ser interpretado silenciosamente.

### Usar charset default

O resultado varia por máquina.

### Substituir UTF-8 inválido

Corrupção deixa de ser visível.

### Carregar o arquivo inteiro

Memória cresce com o volume.

### Confiar apenas no filename

Conteúdo repetido pode vir com outro nome.

### Confiar apenas no checksum

Records duplicados podem existir em arquivos diferentes.

### Logar linha rejeitada inteira

Dados sensíveis e formula injection podem vazar.

### Processar antes do claim

Dois workers podem aplicar o mesmo arquivo.

### Achar que SFTP resolverá tudo

SFTP transporta; não valida contrato nem idempotência.

---

## Comandos úteis

### Executar testes de contrato

```powershell
.\mvnw.cmd `
  -Dtest=InventoryAdjustmentContractTest,CsvHeaderValidationTest,CsvEncodingTest,CsvBomTest `
  test
```

### Executar idempotência

```powershell
.\mvnw.cmd `
  -Dtest=FileIdempotencyTest,RecordIdempotencyTest,RecordConflictTest,FileClaimConcurrencyTest `
  test
```

### Executar rejeições

```powershell
.\mvnw.cmd `
  -Dtest=PartialRejectionTest,StructuralRejectionTest,CsvInjectionProtectionTest,RejectionReportContractTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar leitura integral

```powershell
git grep `
  -n `
  -E `
  "readAllLines|Files\\.readString|collect\\(.*toList|split\\(\";\""
```

---

## Exercício guiado

### Parte 1 — Dialeto

Defina encoding, delimiter, quote e header.

### Parte 2 — Naming

Crie regex e versionamento.

### Parte 3 — Preflight

Valide path, size e checksum.

### Parte 4 — Claim

Mova atomically para processing.

### Parte 5 — Streaming

Leia record a record.

### Parte 6 — Mapping

Converta fields em value objects.

### Parte 7 — Idempotência

Proteja file e record.

### Parte 8 — Rejeições

Gere report seguro.

### Parte 9 — Lifecycle

Archive, reject e quarantine.

### Parte 10 — Gate

Comprove ausência de duplicidade e memória total.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 467 foi preservada;
- CSV foi tratado como dialeto;
- encoding UTF-8 foi definido;
- decoder rejeita bytes inválidos;
- BOM opcional foi tratado somente no início;
- delimitador foi definido;
- quote foi definido;
- escaping foi explicado;
- header obrigatório foi definido;
- ordem das colunas foi validada;
- colunas extras foram rejeitadas;
- linhas vazias foram proibidas;
- multiline fields foram proibidos;
- line endings LF e CRLF foram aceitos;
- números localizados foram proibidos;
- timestamp ISO-8601 com offset foi exigido;
- field limits foram definidos;
- file size foi limitado;
- record count foi limitado;
- parser CSV foi usado;
- `split` não foi usado;
- processamento é streaming;
- arquivo inteiro não é mantido em memória;
- naming regex foi criado;
- path traversal foi bloqueado;
- symbolic links foram proibidos;
- checksum SHA-256 foi criado;
- receipt foi persistido;
- unique constraint por checksum foi criada;
- unique constraint por filename foi criada;
- mesmo conteúdo com outro nome vira duplicate;
- mesmo nome com outro conteúdo vira quarantine;
- claim usa atomic move;
- arquivo é imutável após claim;
- checksum final é verificado;
- idempotência por record ID foi criada;
- fingerprint de record foi criado;
- duplicate record não reaplica efeito;
- record conflict é rejeitado;
- processamento parcial foi documentado;
- erro estrutural rejeita o arquivo;
- report possui contrato próprio;
- report não contém linha bruta;
- CSV injection foi neutralizada;
- neutralização não altera o dado interno;
- sidecar de resultado foi criado;
- lifecycle de diretórios foi implementado;
- concorrência de claim foi testada;
- encoding inválido foi testado;
- BOM foi testado;
- quoted delimiter foi testado;
- multiline foi testado;
- size e record limits foram testados;
- streaming foi testado;
- duplicates foram testados;
- partial rejection foi testada;
- structural rejection foi testada;
- logs não contêm payload ou path absoluto;
- métricas usam baixa cardinalidade;
- SFTP não foi antecipado;
- Spring Batch não foi antecipado;
- limitações foram registradas;
- produção pública permaneceu NO-GO;
- gate foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat

git grep `
  -n `
  -E `
  "readAllLines|Files\\.readString|split\\(\";\"|rawLine|originalLine|HYPERLINK|ATOMIC_MOVE"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/docs `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m16): importar ajustes de estoque por CSV"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- arquivo real de parceiro;
- dados pessoais;
- dump de rejeições;
- path local absoluto;
- secret;
- arquivo processado;
- configuração SFTP;
- scheduler;
- Spring Batch antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

O laboratório transformou CSV em contrato formal.

O fluxo ficou:

```text
inbox;

preflight;

checksum;

receipt;

atomic claim;

streaming parse;

validation;

idempotency;

adjustment;

rejection report;

archive
ou quarantine.
```

A principal decisão foi:

```text
arquivo não é
apenas um conjunto de linhas;

é uma mensagem
com identidade,
versão,
limites,
resultado
e lifecycle.
```

Também ficou comprovado que:

- CSV não possui dialeto universal;
- `split` não entende quoting;
- encoding faz parte do contrato;
- bytes inválidos não devem ser corrigidos silenciosamente;
- checksum protege conteúdo;
- record ID protege o efeito;
- streaming evita carregar o arquivo inteiro;
- erro de linha e erro estrutural precisam de policies diferentes;
- reports humanos precisam de proteção contra formulas;
- atomic move ajuda a definir ownership;
- transporte não substitui validação.

O importador funciona com diretórios locais.

A próxima aula será:

```text
469 - M16.14 - SFTP
```

Nela, você irá:

- compreender SSH e SFTP;
- diferenciar SFTP, FTP e FTPS;
- configurar autenticação por chave;
- validar host key;
- bloquear `StrictHostKeyChecking=no`;
- baixar arquivos com nome temporário;
- verificar estabilidade e checksum;
- publicar acknowledgements;
- integrar diretório remoto ao lifecycle local;
- proteger secrets e known hosts;
- testar com servidor SFTP em container.

---

# Material complementar

## Checkpoint final

- [ ] Defini o dialeto CSV.
- [ ] Processei records em streaming.
- [ ] Implementei idempotência de file e record.
- [ ] Gerei rejeições seguras.
- [ ] Preparei o lifecycle para SFTP.

---

## Troubleshooting adicional

### Header aparece com caractere invisível

Pode existir BOM não removido no início.

### Quoted delimiter cria coluna extra

O código provavelmente usa `split`.

### Acentos viram `�`

O decoder está substituindo bytes inválidos ou usando charset errado.

### Arquivo grande esgota memória

Procure `readAllLines`, listas acumuladas ou rejection collector ilimitado.

### Mesmo arquivo reaplica ajustes

Confirme unique constraint por checksum e consulta antes do processamento.

### Mesmo record aplica duas vezes

Confirme partner + record ID e fingerprint.

### Report abre formulas

A neutralização não foi aplicada aos fields textuais.

### Dois workers processam

O claim pode não estar usando atomic move no mesmo filesystem.

### Arquivo some sem archive

Revise transições e falhas entre processamento e move final.

### A equipe quer conectar SFTP agora

O transporte será adicionado na aula 469 sem alterar o contrato local.

---

## Perguntas de revisão

1. CSV possui um único dialeto?
2. Por que não usar split?
3. Qual encoding usamos?
4. Bytes inválidos são substituídos?
5. Qual delimitador usamos?
6. O header é obrigatório?
7. Multiline é permitido?
8. Quando validar file size?
9. Por que usar streaming?
10. Para que serve checksum?
11. Checksum substitui record ID?
12. O que ocorre com mesmo nome e hash diferente?
13. O que ocorre com mesmo hash e nome diferente?
14. Como claimar o arquivo?
15. O que é CSV injection?
16. Linha inválida rejeita sempre todo arquivo?
17. O que vai no rejection report?
18. SFTP valida o contrato?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Não.
2. Não entende quoting e escaping.
3. UTF-8.
4. Não.
5. Ponto e vírgula.
6. Sim.
7. Não.
8. Antes do parse.
9. Memória constante.
10. Identificar conteúdo.
11. Não.
12. Quarantine.
13. Duplicate.
14. Atomic move.
15. Formula executada por planilha.
16. Não na policy parcial.
17. Campos mínimos e seguros.
18. Não.
19. SFTP.
20. Transporte SSH seguro.

---

## Desafio opcional

Crie uma segunda versão:

```text
inventory-adjustments-v2.
```

Adicione:

```text
reason_code.
```

Requisitos:

- novo filename;
- novo header;
- novo descriptor;
- novo contract test;
- reader v1 continua funcionando;
- nenhum auto-upgrade silencioso;
- receipt registra a versão;
- report indica versão;
- migration somente se o modelo persistido mudar.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 468 - M16.13 - CSV e arquivos de integracao

- Tratei CSV como um dialeto explícito.
- Defini UTF-8 com decoder estrito.
- Tratei BOM opcional somente no início.
- Defini ponto e vírgula como delimitador.
- Defini aspas duplas e escaping.
- Criei header obrigatório e ordenado.
- Proibi linhas vazias e multiline fields.
- Aceitei LF e CRLF.
- Defini quantity inteira e timestamp ISO-8601.
- Criei limites de arquivo, records e fields.
- Usei Apache Commons CSV.
- Removi uso de `split`.
- Implementei processamento streaming.
- Criei naming versionado.
- Bloqueei path traversal e symbolic links.
- Criei SHA-256 do arquivo.
- Criei `integration_file_receipt`.
- Protegi filename e checksum com unique constraints.
- Tratei duplicate content e filename conflict.
- Criei claim com atomic move.
- Mantive arquivo imutável durante processamento.
- Criei idempotência por record ID e fingerprint.
- Tratei duplicate record e record conflict.
- Adotei processamento parcial controlado.
- Diferenciei erros estruturais e de linha.
- Criei rejection report seguro.
- Impedi inclusão de raw line.
- Neutralizei CSV injection na saída humana.
- Criei sidecar de resultado.
- Modelei inbox, processing, archive, rejected, quarantine e reports.
- Testei quoted delimiter, encoding, BOM e multiline.
- Testei file size, record count e streaming.
- Testei idempotência de file e record.
- Testei partial e structural rejection.
- Testei concorrência de claim.
- Criei métricas e logs de baixa exposição.
- Criei contract, lifecycle, idempotency, rejection policy e runbook.
- Não antecipei SFTP ou Spring Batch.
- Mantive produção pública como NO-GO.
- Próxima aula: SFTP.
```

---

## Referência técnica curta

- [RFC 4180 — Common Format and MIME Type for CSV Files](https://www.rfc-editor.org/rfc/rfc4180)
- [Apache Commons CSV — User Guide](https://commons.apache.org/proper/commons-csv/user-guide.html)
- [Java — CharsetDecoder](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/charset/CharsetDecoder.html)
- [Java — Files](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)
- [OWASP — CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection)

Regra final:

```text
arquivos CSV de integração devem possuir um dialeto e lifecycle explícitos: encoding, BOM, delimitador, quoting, header, line endings, tipos, limites e filename são contrato; o arquivo é validado, identificado por SHA-256, registrado e reivindicado por atomic move antes do parse; records são lidos em streaming com parser real, mapeados por field e protegidos por record ID e fingerprint; erros estruturais rejeitam ou colocam o arquivo em quarentena, erros independentes podem gerar rejection report seguro, saídas humanas neutralizam formula injection, métricas não usam filename ou record ID como tags e SFTP e jobs permanecem camadas posteriores de transporte e orquestração.
```
