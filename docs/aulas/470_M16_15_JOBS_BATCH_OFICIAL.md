# 470 - M16.15 - Jobs batch

## Apresentação da aula

Nas aulas 468 e 469, o laboratório construiu duas partes importantes de uma integração por arquivos.

A primeira foi o contrato e o processamento local:

```text
CSV versionado;

UTF-8 estrito;

streaming;

checksum SHA-256;

idempotência de arquivo;

idempotência de registro;

rejection report;

archive;

quarantine.
```

A segunda foi o transporte remoto:

```text
SFTP;

known_hosts;

autenticação por chave;

remote claim;

download para .part;

atomic move;

remote archive;

acknowledgement.
```

O fluxo funciona quando uma application service chama cada operação na ordem correta.

Entretanto, uma integração recorrente precisa responder outras perguntas:

```text
qual execução está em andamento?

qual arquivo pertence à execução?

em qual etapa ocorreu a falha?

o download já terminou?

o CSV já foi parcialmente processado?

qual foi o último record confirmado?

a execução pode ser retomada?

duas instâncias podem executar o mesmo arquivo?

como distinguir falha técnica
de rejeição contratual?

como consultar histórico,
contadores
e duração?
```

A pergunta central será como orquestrar download, validação, processamento, finalização e acknowledgement como um job reiniciável, persistente e observável.

A resposta será:

```text
Spring Batch.
```

Spring Batch não substitui:

- o contrato CSV;
- o SFTP;
- o checksum;
- a idempotência;
- as transactions do domínio;
- o remote claim;
- a segurança SSH.

Ele adiciona uma linguagem e uma infraestrutura para organizar processamento batch:

```text
Job;

Step;

JobInstance;

JobExecution;

StepExecution;

JobParameters;

ExecutionContext;

JobRepository.
```

O projeto continuará sendo:

```text
catalog-file-importer.
```

O novo job será:

```text
inventorySftpImportJob.
```

Uma execução tratará um único `receiptId`.

A decisão:

```text
um arquivo
=
uma JobInstance identificável.
```

O job terá o fluxo:

```text
downloadRemoteFileStep
        |
        v
validateCsvContractStep
        |
        +------ REJECTED ------+
        |                      |
        v                      v
processInventoryCsvStep   finalizeRejectedFileStep
        |                      |
        v                      v
finalizeProcessedFileStep publishErrorAcknowledgementStep
        |
        v
publishAcknowledgementStep
```

Falhas técnicas como:

- banco indisponível;
- timeout SFTP;
- filesystem indisponível;
- deadlock esgotado;
- erro ao persistir metadata;

deixarão o job com status:

```text
FAILED.
```

Essas falhas poderão ser reiniciadas com a mesma `JobInstance`.

Resultados contratuais esperados, como:

- arquivo estruturalmente rejeitado;
- records parcialmente rejeitados;
- arquivo duplicado;

não serão confundidos automaticamente com falha da infraestrutura.

Eles terão `ExitStatus` e resultado de domínio próprios.

A metadata será persistida no PostgreSQL, nunca em memória.

A aplicação já possui estado persistente de:

- receipts;
- records importados;
- transport status;
- rejections.

A infraestrutura batch também precisará sobreviver a reinício.

As tabelas oficiais registrarão objetos como:

```text
BATCH_JOB_INSTANCE;

BATCH_JOB_EXECUTION;

BATCH_JOB_EXECUTION_PARAMS;

BATCH_STEP_EXECUTION;

BATCH_JOB_EXECUTION_CONTEXT;

BATCH_STEP_EXECUTION_CONTEXT.
```

O `JobRepository` persistirá essa metadata.

A identidade de uma `JobInstance` será formada por:

```text
job name
+
identifying JobParameters.
```

A baseline usará:

```text
receiptId:
identifying.

partner:
identifying.

remoteFileName:
identifying.

launchSource:
non-identifying.

requestedAt:
non-identifying.
```

O `receiptId` é estável.

Um timestamp aleatório não será usado como identificador apenas para “forçar” nova execução.

Esse erro produziria uma nova `JobInstance` e destruiria a restartability.

O restart correto reutiliza exatamente os mesmos parâmetros identificadores.

Na linha atual do Spring Batch, `JobOperator` concentra operações de iniciar, parar e reiniciar jobs; versões anteriores podem expor `JobLauncher` e `JobOperator` separadamente. O laboratório encapsulará essa diferença em:

```text
InventoryImportJobLauncher.
```

O application service não dependerá diretamente da versão do framework.

O processamento CSV será chunk-oriented. Chunk didático:

```text
100 records.
```

O ciclo será:

```text
read;

process;

write;

commit;

atualizar ExecutionContext.
```

Se a execução falhar depois de 2.300 records confirmados, o reader reiniciável reabre o mesmo arquivo e avança até o checkpoint persistido.

A retomada só é segura porque:

- o arquivo final é imutável;
- o checksum é conferido;
- o reader salva estado;
- o writer é idempotente por record ID;
- cada chunk possui transaction;
- rejections possuem chave estável.

A aula diferenciará `skip`, `retry` e `restart`.

Skip:

```text
um item inválido
é registrado
e o step continua.
```

Retry:

```text
o mesmo item
ou chunk
é tentado novamente
por uma falha transitória.
```

Restart:

```text
uma nova JobExecution
retoma a mesma JobInstance
depois de uma falha anterior.
```

Não configuraremos skip para qualquer exception.

Erros de validação de record poderão ser skipped.

Erros estruturais do arquivo falharão ou desviarão o fluxo antes do chunk.

Falhas de autenticação SFTP, schema de banco, checksum e configuração não serão skipped.

Retry no writer será restrito a falhas realmente transitórias, como deadlock ou lock timeout aprovado.

O rejection report não será escrito diretamente durante o chunk.

As rejeições serão persistidas em uma tabela com unique constraint.

O step final gerará o report em streaming.

Isso melhora:

- restartability;
- consistência;
- deduplicação;
- concorrência;
- auditoria.

A busca periódica usará um poller desabilitável:

1. lista arquivos publicados;
2. reivindica remotamente;
3. cria ou recupera receipt;
4. inicia um job por receipt;
5. respeita limite de jobs concorrentes.

O scheduler será apenas um gatilho, nunca a identidade do job.

A próxima aula será `471 - M16.16 - Upload download em integracoes`.

Ela ampliará uploads e downloads por HTTP, streaming, ranges, headers, limits e segurança.

Ao final desta aula, você deverá explicar:

```text
por que Job
não é uma thread;

por que JobInstance
não é JobExecution;

por que parâmetros identificadores
precisam ser estáveis;

por que ExecutionContext
não é cache genérico;

por que completed Step
normalmente não roda no restart;

por que skip,
retry
e restart
não são sinônimos;

por que JobRepository
não substitui
a idempotência de negócio.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
468:
CSV e arquivos de integracao.

469:
SFTP.

470:
Jobs batch.

471:
Upload download em integracoes.

472:
Contratos de integracao.
```

A aula 469 respondeu:

```text
como transportar
arquivos com SSH,
claim,
integridade
e acknowledgement?
```

A aula 470 responderá:

```text
como orquestrar
o fluxo de arquivos
em steps persistentes
e reiniciáveis?
```

Nesta aula:

```text
Spring Batch:
sim.

JobRepository:
sim.

JobParameters:
sim.

ExecutionContext:
sim.

tasklet steps:
sim.

chunk step:
sim.

skip e retry:
sim.

restart:
sim.

poller:
sim, controlado.

upload HTTP:
próxima aula.
```

A regra central será:

```text
cada execução
precisa ser identificável,
persistida,
retomável
e observável.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
InventoryImportBatchConfiguration;

InventoryImportJobParameters;

InventoryImportJobLauncher;

InventoryImportPoller;

DownloadRemoteFileTasklet;

ValidateCsvContractTasklet;

InventoryAdjustmentItemStreamReader;

InventoryAdjustmentItemProcessor;

InventoryAdjustmentItemWriter;

InventoryAdjustmentSkipListener;

FinalizeProcessedFileTasklet;

FinalizeRejectedFileTasklet;

PublishAcknowledgementTasklet;

PublishErrorAcknowledgementTasklet;

InventoryImportJobListener;

InventoryImportStepListener;

InventoryImportBatchMetrics.
```

Migrations:

```text
V3__create_spring_batch_metadata.sql;

V4__create_inventory_adjustment_rejection.sql.
```

Testes:

```text
BatchMetadataSchemaTest;

InventoryJobParametersTest;

InventoryJobInstanceIdentityTest;

InventoryJobConcurrentLaunchTest;

DownloadStepRestartTest;

ValidateFileStepTest;

CsvReaderCheckpointTest;

CsvChunkTransactionTest;

CsvSkipPolicyTest;

CsvRetryPolicyTest;

CsvSkipLimitTest;

CsvRestartAfterFailureTest;

RejectionPersistenceTest;

RejectionReportRestartTest;

ExecutionContextPromotionTest;

CompletedStepRestartTest;

BatchFlowBranchingTest;

BatchPollerConcurrencyTest;

BatchObservabilityTest;

BatchLoggingSecurityTest;

InventoryImportJobEndToEndTest.
```

Documentação:

```text
docs/batch/
├── INVENTORY_IMPORT_JOB.md
├── BATCH_PARAMETERS.md
├── BATCH_RESTART_POLICY.md
├── BATCH_SKIP_RETRY_POLICY.md
├── BATCH_OPERATIONS_RUNBOOK.md
└── BATCH_PRODUCTION_READINESS.md
```

Você irá:

1. adicionar Spring Batch;
2. criar metadata schema;
3. configurar JobRepository;
4. desabilitar auto-run;
5. modelar JobParameters;
6. criar JobInstance estável;
7. criar steps;
8. promover contexto;
9. criar reader reiniciável;
10. processar em chunks;
11. configurar skip;
12. configurar retry;
13. persistir rejeições;
14. criar branching;
15. implementar restart;
16. impedir concorrência duplicada;
17. criar poller;
18. criar métricas;
19. criar testes end-to-end;
20. preparar upload/download.

---

## Conceito essencial

### Job

`Job` é a definição lógica do processo.

Exemplo:

```text
inventorySftpImportJob.
```

Ele descreve:

- steps;
- ordem;
- transições;
- listeners;
- restart policy.

O bean `Job` não é uma execução.

---

### JobInstance

Uma `JobInstance` representa uma execução lógica identificada por:

```text
job name
+
identifying parameters.
```

Exemplo:

```text
inventorySftpImportJob
+
receiptId=8f0...
+
partner=legacy-erp.
```

Reiniciar uma falha cria outra `JobExecution` da mesma `JobInstance`.

---

### JobExecution

`JobExecution` é uma tentativa concreta.

Uma mesma instance pode ter:

```text
execution 1:
FAILED.

execution 2:
COMPLETED.
```

Ela possui:

- start time;
- end time;
- status;
- exit status;
- failure exceptions;
- execution context.

---

### Step

`Step` é uma fase independente.

Pode ser:

```text
tasklet-oriented;

chunk-oriented;

partitioned;

flow;
```

Nesta aula, download, validação, finalização e ack serão tasklets.

O processamento de records será chunk-oriented.

---

### StepExecution

Cada execução de step possui:

- status;
- read count;
- write count;
- filter count;
- skip counts;
- commit count;
- rollback count;
- execution context;
- failures.

Esses contadores são fundamentais no runbook.

---

### JobParameters

Parâmetros podem ser:

```text
identifying;

non-identifying.
```

Identifying participa da identidade da instance.

Non-identifying descreve a execução sem criar uma nova instance.

Não use valores mutáveis como identifying quando a intenção é restart.

---

### ExecutionContext

É um mapa persistido associado ao job ou step.

Uso correto:

- posição do reader;
- local file path técnico;
- checksum validado;
- receipt ID;
- contadores necessários;
- nome remoto claimed;
- report name.

Uso incorreto:

- body completo;
- lista de todos os records;
- private key;
- passphrase;
- objeto não serializável;
- cache de domínio;
- payload sensível.

---

### JobRepository

O repository persiste metadata do framework.

Ele não substitui:

- transaction do estoque;
- receipt;
- record fingerprint;
- unique constraints de negócio;
- remote claim.

O repository sabe que um step foi concluído.

Ele não sabe se um `record_id` externo já alterou o estoque em outra execução.

---

### Metadata schema

As tabelas devem corresponder à versão do Spring Batch usada.

Use o script PostgreSQL oficial da versão gerenciada pelo Spring Boot.

Não copie um schema de blog.

No projeto, versionaremos o script por Flyway.

Em produção:

```text
spring.batch.jdbc.initialize-schema=never.
```

A migração é explícita.

---

### Auto-run no startup

Quando o Boot encontra um único `Job`, pode executá-lo no startup.

Para evitar importação acidental:

```yaml
spring:
  batch:
    job:
      enabled: false
```

A execução ocorrerá pelo launcher controlado.

---

### Restartability

No restart, steps já `COMPLETED` são normalmente pulados.

Um step que precisa rodar de novo pode usar uma configuração equivalente a:

```text
allowStartIfComplete=true.
```

A baseline não habilitará isso indiscriminadamente.

Download concluído não deve ser repetido se o arquivo local final e o checksum já foram registrados.

---

### Reader state

O reader implementa `ItemStream`.

Callbacks:

```text
open;

update;

close.
```

O `ExecutionContext` guarda:

```text
currentRecordIndex;

expectedChecksum;

fileSize;

headerValidated.
```

O checkpoint é atualizado no commit do chunk.

---

### Chunk

Com chunk size 100:

1. lê até 100 items;
2. processa;
3. escreve;
4. confirma transaction;
5. persiste estado.

Chunk muito pequeno aumenta overhead.

Chunk muito grande aumenta rollback, lock time e memória.

O valor produtivo exige benchmark.

---

### Skip

Skip é para item inválido previsto.

Baseline:

```text
RecordValidationException;

RecordPayloadConflictException.
```

Não skip:

```text
database unavailable;

schema mismatch;

checksum mismatch;

SFTP auth;

filesystem error;

unknown RuntimeException.
```

O skip limit vale para skips de leitura, processamento e escrita somados.

---

### Retry

Retry é para erro transitório.

Baseline no writer:

```text
deadlock;

lock timeout aprovado.
```

Não retry:

```text
constraint de record conflict;

validation;

invalid operation;

insufficient stock final;

contract error.
```

Retry e rollback precisam ser testados juntos.

---

### SkipListener

O listener recebe callbacks de skip.

A baseline grava uma rejeição segura em tabela.

A chave será:

```text
receiptId
+
recordNumber
+
errorCode.
```

A unique constraint impede duplicação no restart.

---

### Rejection table

Campos:

```text
receipt_id;

record_number;

record_id;

error_code;

field_name;

safe_message;

created_at.
```

Nenhuma raw line.

O report final consulta essa tabela e escreve em streaming.

---

### Flow branching

O step de validação pode produzir:

```text
VALID;

DUPLICATE;

REJECTED;

QUARANTINED.
```

Somente `VALID` entra no chunk.

Resultados esperados seguem para finalização e ack.

Falhas técnicas deixam o job `FAILED`.

---

### Concorrência

O mesmo `receiptId` não deve ter duas executions ativas.

O JobRepository ajuda a impedir a mesma `JobInstance` em execução simultânea.

Contudo, JobInstances diferentes podem rodar ao mesmo tempo.

Por isso, também usamos:

- remote claim;
- unique receipt;
- launcher guard;
- limite de jobs concorrentes;
- locks do domínio.

---

### Restart versus nova execução

Restart:

```text
mesmos identifying parameters.
```

Nova execução:

```text
novo receipt
ou novo arquivo.
```

Adicionar `run.id` ou timestamp aleatório como identifying cria nova instance.

Não use esse truque para contornar `JobInstanceAlreadyCompleteException`.

---

### Dados entre steps

O download step grava no `StepExecutionContext`.

Um listener promove chaves selecionadas ao `JobExecutionContext`.

Exemplo:

```text
localFilePath;

checksumSha256;

remoteClaimedName;

fileSize.
```

Promova apenas dados necessários.

---

### Poller

O poller é somente um gatilho:

```text
@Scheduled
ou chamada operacional.
```

Ele não contém lógica de CSV.

Ele:

- verifica capacidade;
- lista;
- claim;
- cria receipt;
- lança job.

A execução pode ser desabilitada por property.

---

## Mão na massa guiada

### 1. Adicionar dependências

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-batch</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.batch</groupId>
    <artifactId>spring-batch-test</artifactId>
    <scope>test</scope>
</dependency>
```

Use versões gerenciadas pelo Boot atual do projeto.

---

### 2. Desabilitar execução automática

```yaml
spring:
  batch:
    job:
      enabled: false
    jdbc:
      initialize-schema: never
```

---

### 3. Criar migration V3

Copie o schema PostgreSQL oficial correspondente à versão efetivamente resolvida.

Adicione comentário:

```text
source version;

checksum da origem;

data da incorporação.
```

Não edite nomes ou tipos sem ADR.

---

### 4. Criar migration V4

```sql
CREATE TABLE inventory_adjustment_rejection (
    id UUID PRIMARY KEY,
    receipt_id UUID NOT NULL,
    record_number BIGINT NOT NULL,
    record_id VARCHAR(80),
    error_code VARCHAR(120) NOT NULL,
    field_name VARCHAR(80),
    safe_message VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_adjustment_rejection
        UNIQUE (
            receipt_id,
            record_number,
            error_code
        )
);
```

Crie foreign key para receipt.

---

### 5. Criar parâmetros

```java
public record InventoryImportJobParameters(
        UUID receiptId,
        String partner,
        String remoteFileName,
        String launchSource,
        Instant requestedAt
) {
}
```

Factory:

```java
JobParameters toJobParameters() {
    return new JobParametersBuilder()
            .addString(
                "receiptId",
                receiptId.toString(),
                true
            )
            .addString(
                "partner",
                partner,
                true
            )
            .addString(
                "remoteFileName",
                remoteFileName,
                true
            )
            .addString(
                "launchSource",
                launchSource,
                false
            )
            .addString(
                "requestedAt",
                requestedAt.toString(),
                false
            )
            .toJobParameters();
}
```

---

### 6. Criar launcher boundary

```java
public interface InventoryImportJobLauncher {

    InventoryJobLaunchResult launch(
            InventoryImportJobParameters parameters
    );

    InventoryJobLaunchResult restart(
            long failedExecutionId
    );
}
```

O adapter usa `JobOperator` ou a API equivalente da versão gerenciada.

---

### 7. Tratar launch conflicts

Mapeie:

```text
already running;

instance complete;

restart not allowed;

invalid parameters.
```

Não transforme tudo em `500`.

O poller considera `already running` um resultado idempotente.

---

### 8. Criar job

Baseline linear:

```java
@Bean
Job inventorySftpImportJob(
        JobRepository jobRepository,
        Step downloadRemoteFileStep,
        Step validateCsvContractStep,
        Step processInventoryCsvStep,
        Step finalizeProcessedFileStep,
        Step publishAcknowledgementStep
) {
    return new JobBuilder(
                "inventorySftpImportJob",
                jobRepository
            )
            .listener(
                inventoryImportJobListener()
            )
            .start(
                downloadRemoteFileStep
            )
            .next(
                validateCsvContractStep
            )
            .next(
                processInventoryCsvStep
            )
            .next(
                finalizeProcessedFileStep
            )
            .next(
                publishAcknowledgementStep
            )
            .build();
}
```

Depois, adicione branching para `REJECTED`, `DUPLICATE` e `QUARANTINED`.

---

### 9. Criar download tasklet

O tasklet:

1. lê `receiptId`;
2. consulta receipt;
3. se download já foi concluído, verifica local file e checksum;
4. caso contrário, chama `SftpDownloadService`;
5. atualiza receipt;
6. grava contexto.

Não baixa novamente se o estado confirmado já existe.

---

### 10. Gravar StepExecutionContext

```java
stepExecution
    .getExecutionContext()
    .putString(
        "localFilePath",
        localPath.toString()
    );

stepExecution
    .getExecutionContext()
    .putString(
        "checksumSha256",
        checksum
    );
```

Não grave `Path` como objeto arbitrário.

---

### 11. Promover contexto

```java
@Bean
ExecutionContextPromotionListener
downloadContextPromotionListener() {
    ExecutionContextPromotionListener listener =
            new ExecutionContextPromotionListener();

    listener.setKeys(
        new String[] {
            "localFilePath",
            "checksumSha256",
            "remoteClaimedName",
            "fileSize"
        }
    );

    return listener;
}
```

Registre o listener no download step.

---

### 12. Criar validate tasklet

Valide:

- receipt;
- path;
- final suffix;
- file exists;
- no symlink;
- size;
- checksum;
- filename contract;
- UTF-8;
- BOM;
- header.

Resultado válido:

```text
ExitStatus:
VALID.
```

Resultado estrutural:

```text
REJECTED
ou
QUARANTINED.
```

Não use skip para header inválido.

---

### 13. Criar reader step-scoped

```java
@Bean
@StepScope
InventoryAdjustmentItemStreamReader
inventoryAdjustmentReader(
        @Value(
            "#{jobExecutionContext['localFilePath']}"
        )
        String localFilePath,

        @Value(
            "#{jobExecutionContext['checksumSha256']}"
        )
        String checksum
) {
    return new InventoryAdjustmentItemStreamReader(
            Path.of(localFilePath),
            checksum,
            csvReaderFactory
    );
}
```

Late binding ocorre no início do step.

---

### 14. Implementar ItemStreamReader

```java
public final class InventoryAdjustmentItemStreamReader
        implements ItemStreamReader<CsvRecordView> {

    private static final String INDEX_KEY =
            "inventory.reader.currentRecordIndex";

    private long currentRecordIndex;

    @Override
    public void open(
            ExecutionContext context
    ) {
        currentRecordIndex =
                context.getLong(
                    INDEX_KEY,
                    0L
                );

        openAndValidateFile();

        skipCommittedRecords(
            currentRecordIndex
        );
    }

    @Override
    public CsvRecordView read() {
        CsvRecordView next =
                readNextOrNull();

        if (next != null) {
            currentRecordIndex++;
        }

        return next;
    }

    @Override
    public void update(
            ExecutionContext context
    ) {
        context.putLong(
            INDEX_KEY,
            currentRecordIndex
        );
    }

    @Override
    public void close() {
        closeParser();
    }
}
```

Reabrir e pular records é simples e seguro para o laboratório.

Para arquivos enormes, um offset confiável exigiria outra estratégia.

---

### 15. Criar processor

```java
public InventoryAdjustmentCommand process(
        CsvRecordView record
) {
    return mapper.mapAndValidate(
        record
    );
}
```

O processor não acessa banco.

Ele lança exceptions específicas de validação.

---

### 16. Criar writer

```java
public void write(
        Chunk<? extends InventoryAdjustmentCommand> chunk
) {
    for (
        InventoryAdjustmentCommand command
            : chunk.getItems()
    ) {
        adjustmentService.applyIdempotently(
            command
        );
    }
}
```

A transaction do chunk envolve o writer.

A idempotência de record permanece no domínio.

---

### 17. Criar chunk step

```java
@Bean
Step processInventoryCsvStep(
        JobRepository jobRepository,
        PlatformTransactionManager transactionManager,
        InventoryAdjustmentItemStreamReader reader,
        InventoryAdjustmentItemProcessor processor,
        InventoryAdjustmentItemWriter writer
) {
    return new StepBuilder(
                "processInventoryCsvStep",
                jobRepository
            )
            .<CsvRecordView, InventoryAdjustmentCommand>
                chunk(
                    100,
                    transactionManager
                )
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .faultTolerant()
            .skip(
                RecordValidationException.class
            )
            .skip(
                RecordPayloadConflictException.class
            )
            .skipLimit(
                1_000
            )
            .retry(
                TransientBatchDatabaseException.class
            )
            .retryLimit(
                3
            )
            .listener(
                inventoryAdjustmentSkipListener
            )
            .build();
}
```

Ajuste a DSL à versão gerenciada pelo Boot.

---

### 18. Criar skip listener

O listener converte a exception para:

```text
error code;

field;

safe message.
```

Persiste por:

```text
receiptId;

record number;

error code.
```

Não inclui raw line.

---

### 19. Tratar skip limit

Ao exceder 1.000:

```text
step FAILED.
```

O job não gera acknowledgement final de sucesso.

O runbook precisa decidir:

- corrigir arquivo;
- aumentar limite por change;
- rejeitar integralmente;
- retomar após intervenção.

Não aumente automaticamente.

---

### 20. Criar retry classifier

Permita apenas exceptions transitórias explicitamente mapeadas.

Uma `DataIntegrityViolationException` genérica não é retryable.

Deadlock e lock timeout precisam ser traduzidos na infraestrutura.

---

### 21. Criar finalization step

O tasklet consulta:

- read count;
- write count;
- process skip count;
- write skip count;
- rejection table.

Define:

```text
COMPLETED;

COMPLETED_WITH_REJECTIONS;

DUPLICATE.
```

Gera rejection report em streaming quando necessário.

Move o arquivo local para archive ou rejected.

---

### 22. Criar acknowledgement step

Publica ack somente depois de:

- receipt finalizado;
- report finalizado;
- local lifecycle concluído;
- JobExecutionContext consistente.

Se o upload do ack falhar:

```text
step FAILED.
```

No restart, steps anteriores `COMPLETED` são pulados e apenas o ack é repetido.

O upload idempotente da aula 469 impede conflito.

---

### 23. Criar error branch

Resultados contratuais `REJECTED` e `QUARANTINED` passam por:

```text
finalizeRejectedFileStep;

publishErrorAcknowledgementStep.
```

Falhas técnicas não são convertidas em resultado contratual.

---

### 24. Criar job listener

Registre:

```text
job name;

execution ID;

instance ID;

receipt ID;

status;

exit code;

duration;

step summary.
```

Não logue path completo, file body ou parameters secretos.

---

### 25. Criar step listener

No final de cada step, registre contadores.

O listener não executa regra de negócio.

---

### 26. Criar poller

```java
@Component
@ConditionalOnProperty(
    name = "batch.inventory.poller.enabled",
    havingValue = "true"
)
public class InventoryImportPoller {

    @Scheduled(
        fixedDelayString =
            "${batch.inventory.poller.fixed-delay:PT1M}"
    )
    public void poll() {
        launchAvailableFiles();
    }
}
```

O método delega para application service.

---

### 27. Limitar concorrência

Properties:

```yaml
batch:
  inventory:
    poller:
      enabled: false
      fixed-delay: 1m
      maximum-files-per-poll: 5
      maximum-running-jobs: 2
```

Antes de claimar, consulte executions ativas.

Depois do claim, unique receipt e JobRepository protegem a instance.

---

### 28. Não usar timestamp identificador

Crie policy test que falha se:

```text
run.id;

currentTimeMillis;

random UUID de launch;
```

forem identifying sem representar a intenção do arquivo.

---

### 29. Testar identidade

Mesmo receipt e mesmos parâmetros:

```text
mesma JobInstance.
```

Outro receipt:

```text
nova JobInstance.
```

Alterar apenas `launchSource`:

```text
mesma JobInstance.
```

---

### 30. Testar concorrência

Duas chamadas simultâneas com o mesmo receipt:

```text
uma execution;

outra already running.
```

Nenhum segundo download.

---

### 31. Testar download restart

Faça o download concluir e falhe antes do próximo step.

No restart:

```text
download step COMPLETED
é pulado;

validate inicia.
```

---

### 32. Testar falha durante download

Falhe antes do local final.

No restart:

```text
mesmo receipt;

.part reconciliado;

download reinicia;

um final.
```

---

### 33. Testar checkpoint do reader

Falhe no record 251 com chunk 100.

Esperado antes da falha:

```text
200 confirmados;

ExecutionContext:
200.
```

No restart, retome no record 201.

O writer idempotente protege qualquer repetição de fronteira.

---

### 34. Testar checksum no restart

Altere o arquivo depois da falha.

Esperado:

```text
restart bloqueado;

FILE_CHANGED_AFTER_CHECKPOINT;

quarantine.
```

---

### 35. Testar skip

Records inválidos:

```text
skip count;

rejection rows;

records válidos confirmados.
```

Cada rejeição aparece uma vez depois do restart.

---

### 36. Testar retry

Simule deadlock duas vezes e sucesso na terceira.

Esperado:

```text
retry count:
2;

um efeito final.
```

Simule validation error e confirme zero retries.

---

### 37. Testar rollback de chunk

Falhe no terceiro item do writer.

O chunk inteiro rollbacka.

No retry/restart, a idempotência e a transaction produzem um único efeito por record.

---

### 38. Testar report restart

Falhe durante geração do report temporário.

No restart:

- `.part` é reconciliado;
- rejeições vêm da tabela;
- report final é gerado uma vez;
- conteúdo é determinístico.

---

### 39. Testar acknowledgement restart

Falhe depois da finalização local.

No restart:

```text
download:
pulado.

validate:
pulado.

process:
pulado.

finalize:
pulado.

ack:
reexecutado.
```

---

### 40. Testar branching

Cenários:

```text
VALID;

DUPLICATE;

REJECTED;

QUARANTINED;

FAILED técnico.
```

Cada um segue o path documentado.

---

### 41. Testar metadata

Confirme relações entre:

- job instance;
- executions;
- parameters;
- steps;
- contexts.

Não faça asserts em IDs fixos.

---

### 42. Testar poller

Com três arquivos e limite dois:

```text
2 jobs lançados;

1 permanece remoto.
```

Na próxima execução, o terceiro é lançado.

---

### 43. Criar métricas

```text
batch.inventory.job.started;

batch.inventory.job.completed;

batch.inventory.job.failed;

batch.inventory.step.duration;

batch.inventory.items.read;

batch.inventory.items.written;

batch.inventory.items.skipped;

batch.inventory.restarts;

batch.inventory.running.
```

Tags:

```text
job.name;

step.name;

status;

exit.code.
```

Não use filename, receipt ID ou execution ID como tag.

---

### 44. Criar runbook

Perguntas:

- job name;
- instance ID;
- execution ID;
- identifying parameters;
- status;
- exit status;
- step atual;
- read/write/skip;
- commit/rollback;
- ExecutionContext;
- receipt;
- local file;
- checksum;
- remote archive;
- ack;
- falha é técnica ou contratual;
- restart é permitido;
- outra execution está ativa.

---

### 45. Criar production readiness

Checklist:

```text
metadata migration;

backup;

retention;

JobRepository;

transaction manager;

stable parameters;

restart tests;

skip policy;

retry policy;

concurrency limit;

scheduler;

metrics;

alerts;

runbook;

SFTP production;

load test.
```

Status:

```text
NO-GO.
```

---

### 46. Executar testes focados

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer

.\mvnw.cmd `
  -Dtest=BatchMetadataSchemaTest,InventoryJobParametersTest,InventoryJobInstanceIdentityTest,InventoryJobConcurrentLaunchTest,DownloadStepRestartTest,ValidateFileStepTest,CsvReaderCheckpointTest,CsvChunkTransactionTest,CsvSkipPolicyTest,CsvRetryPolicyTest,CsvSkipLimitTest,CsvRestartAfterFailureTest,RejectionPersistenceTest,RejectionReportRestartTest,ExecutionContextPromotionTest,CompletedStepRestartTest,BatchFlowBranchingTest,BatchPollerConcurrencyTest,BatchObservabilityTest,BatchLoggingSecurityTest,InventoryImportJobEndToEndTest `
  test
```

---

### 47. Executar cenário manual

1. publique arquivo no SFTP;
2. execute poll manual;
3. acompanhe metadata;
4. interrompa no record 251;
5. confirme job `FAILED`;
6. restaure a falha técnica;
7. reinicie a mesma execution/instance;
8. confirme retomada;
9. confirme archive;
10. confirme ack.

---

### 48. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- metadata;
- identity;
- flow;
- transaction;
- checkpoint;
- skip;
- retry;
- restart;
- concurrency;
- poller;
- metrics;
- logs;
- SFTP regression;
- CSV regression.

---

### 49. Registrar limitações

Ainda faltam:

```text
upload/download HTTP;

distributed scheduler lock dedicado;

partitioning;

remote chunking;

multi-node load test;

metadata retention;

operator UI;

alertas reais;

disaster recovery;

produção SFTP.
```

---

## Entendendo o que foi feito

### O fluxo virou um Job

Download, validação, processamento, finalização e ack possuem steps próprios.

### A execução ganhou identidade

`receiptId` e parâmetros estáveis definem a `JobInstance`.

### O histórico ficou persistente

`JobRepository` registra executions, steps, contadores e contextos.

### O reader ganhou checkpoint

Restart retoma o arquivo após o último commit.

### O writer manteve idempotência

Metadata batch e idempotência de negócio atuam juntas.

### Skip e retry ficaram restritos

Erros previstos de item não são confundidos com falhas técnicas.

### Rejections ficaram reiniciáveis

A tabela persistente evita report duplicado ou perdido.

### Ack virou step independente

Falha de publicação não repete o processamento concluído.

### O poller virou apenas gatilho

Ele não define identidade nem contém regra de negócio.

---

## Erros comuns importantes

### Usar timestamp para forçar execução

Cria nova `JobInstance` e perde restart.

### Usar repository em memória

Metadata desaparece no restart do processo.

### Colocar todos os passos em um tasklet

Não existe checkpoint ou restart granular.

### Não implementar ItemStream

O reader recomeça sem estado conhecido.

### Colocar todos os records no ExecutionContext

Metadata cresce e pode falhar.

### Skipar qualquer exception

Falhas de infraestrutura viram perda silenciosa.

### Retryar validation error

O mesmo dado inválido é repetido inutilmente.

### Escrever rejection report direto no skip

Restart e rollback podem duplicar linhas.

### Rodar job automaticamente no startup

Um deploy pode iniciar importação sem decisão operacional.

### Achar que JobRepository resolve duplicidade de negócio

Record ID e unique constraints continuam necessários.

---

## Comandos úteis

### Testes de identidade e restart

```powershell
.\mvnw.cmd `
  -Dtest=InventoryJobInstanceIdentityTest,DownloadStepRestartTest,CsvReaderCheckpointTest,CsvRestartAfterFailureTest,CompletedStepRestartTest `
  test
```

### Skip e retry

```powershell
.\mvnw.cmd `
  -Dtest=CsvSkipPolicyTest,CsvRetryPolicyTest,CsvSkipLimitTest,CsvChunkTransactionTest `
  test
```

### Flow e concorrência

```powershell
.\mvnw.cmd `
  -Dtest=InventoryJobConcurrentLaunchTest,BatchFlowBranchingTest,BatchPollerConcurrencyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar parâmetros instáveis

```powershell
git grep `
  -n `
  -E `
  "run\\.id|currentTimeMillis|nanoTime|randomUUID|JobParametersBuilder|saveState\\(false\\)"
```

---

## Exercício guiado

### Parte 1 — Infraestrutura

Adicione Batch e metadata.

### Parte 2 — Identidade

Defina JobParameters estáveis.

### Parte 3 — Steps

Separe download, validate, process, finalize e ack.

### Parte 4 — Contexto

Promova path e checksum.

### Parte 5 — Reader

Implemente ItemStream e checkpoint.

### Parte 6 — Chunk

Configure reader, processor e writer.

### Parte 7 — Tolerância

Defina skip e retry.

### Parte 8 — Restart

Falhe e retome a mesma instance.

### Parte 9 — Poller

Lance jobs com limite de concorrência.

### Parte 10 — Gate

Comprove um único efeito e steps pulados.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 469 foi preservada;
- Spring Batch foi adicionado;
- versões são gerenciadas pelo Boot;
- metadata schema corresponde à versão;
- schema foi versionado por migration;
- repository em memória não foi usado;
- auto-run no startup foi desabilitado;
- `Job` foi explicado;
- `JobInstance` foi explicado;
- `JobExecution` foi explicado;
- `Step` foi explicado;
- `StepExecution` foi explicado;
- identifying parameters foram definidos;
- non-identifying parameters foram definidos;
- `receiptId` é identificador estável;
- timestamp aleatório não identifica a instance;
- JobRepository foi configurado;
- ExecutionContext foi limitado a metadata;
- download step foi criado;
- validate step foi criado;
- chunk step foi criado;
- finalize steps foram criados;
- acknowledgement steps foram criados;
- branching foi criado;
- falha técnica mantém job `FAILED`;
- rejeição contratual possui exit status próprio;
- contexto foi promovido;
- reader é step-scoped;
- reader implementa ItemStream;
- reader persiste record index;
- checksum é revalidado no restart;
- chunk size foi configurado;
- writer usa transaction do chunk;
- idempotência de record foi preservada;
- skip foi limitado a exceptions previstas;
- skip limit foi configurado;
- retry foi limitado a falhas transitórias;
- validation não recebe retry;
- rejection table foi criada;
- raw line não foi persistida;
- skip listener é idempotente;
- report é gerado da tabela;
- report restart foi testado;
- completed steps são pulados no restart;
- acknowledgement pode reiniciar isoladamente;
- mesma instance não executa em paralelo;
- JobInstances diferentes têm limite;
- remote claim continua ativo;
- poller é desabilitável;
- poller não contém regra de CSV;
- scheduler não cria identidade;
- métricas possuem baixa cardinalidade;
- logs não contêm path ou payload;
- metadata tests foram criados;
- checkpoint foi testado;
- rollback de chunk foi testado;
- skip foi testado;
- retry foi testado;
- restart foi testado;
- branching foi testado;
- concorrência foi testada;
- SFTP regression foi executada;
- CSV regression foi executada;
- upload/download HTTP não foi antecipado;
- limitações foram registradas;
- produção permaneceu NO-GO;
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
  "run\\.id|currentTimeMillis|randomUUID|spring\\.batch\\.job\\.enabled|ExecutionContext|skipLimit|retryLimit|saveState"
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
git commit -m "feat(m16): orquestrar importacao com Spring Batch"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- metadata de execução local;
- database dump;
- arquivos importados;
- private key;
- SFTP secret;
- paths absolutos;
- raw rejection;
- launcher público sem proteção;
- upload/download antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o fluxo SFTP e CSV ganhou orquestração batch persistente.

A execução ficou organizada como:

```text
JobInstance
por receipt;

download step;

validation step;

chunk processing;

finalization;

acknowledgement.
```

A principal decisão foi:

```text
restart
reutiliza
a mesma identidade
e continua
a partir do estado
confirmado.
```

O `JobRepository` passou a registrar:

- instances;
- executions;
- step executions;
- parameters;
- status;
- contadores;
- contexts.

O `ExecutionContext` passou a guardar apenas metadata necessária para retomada.

O reader passou a registrar seu índice no commit do chunk.

Skip, retry e restart receberam responsabilidades distintas.

Também ficou comprovado que:

- timestamp aleatório não deve criar uma nova instance;
- completed steps normalmente são pulados;
- rejection report precisa sobreviver ao restart;
- acknowledgement isolado pode ser repetido;
- concorrência exige JobRepository, receipt e remote claim;
- Batch não substitui idempotência do record;
- o poller é apenas um gatilho.

A próxima aula será:

```text
471 - M16.16 - Upload download em integracoes
```

Nela, você irá:

- criar upload HTTP streaming;
- aplicar limites antes de persistir;
- validar filename e media type;
- calcular checksum durante o upload;
- publicar arquivos atomically;
- criar download seguro;
- trabalhar com `Content-Disposition`;
- suportar conditional requests;
- analisar range requests;
- impedir path traversal;
- testar cancelamento e arquivos grandes.

---

# Material complementar

## Checkpoint final

- [ ] Criei metadata persistente do Batch.
- [ ] Modelei uma JobInstance por receipt.
- [ ] Separei o fluxo em steps.
- [ ] Testei checkpoint, skip, retry e restart.
- [ ] Mantive idempotência e SFTP independentes.

---

## Troubleshooting adicional

### O job inicia em todo deploy

Confirme `spring.batch.job.enabled=false`.

### O restart cria outra instance

Algum identifying parameter mudou.

### O reader começa do zero

Ele pode não implementar `ItemStream` ou não atualizar o contexto.

### O step concluído roda novamente

`allowStartIfComplete` pode ter sido habilitado indevidamente.

### Rejections duplicam no restart

Falta unique constraint ou o listener usa chave instável.

### Validation error recebe retry

O classifier está amplo demais.

### Deadlock encerra imediatamente

A exception pode não estar traduzida para a categoria retryable.

### Ack falhou e o CSV foi processado novamente

Os steps anteriores não foram marcados `COMPLETED` ou os parâmetros mudaram.

### Duas execuções usam o mesmo receipt

Revise launcher guard, parâmetros e JobRepository.

### Metadata cresce sem controle

Defina retenção operacional, nunca delete executions ativas.

---

## Perguntas de revisão

1. O que é Job?
2. O que é JobInstance?
3. O que é JobExecution?
4. O que é StepExecution?
5. Como uma instance é identificada?
6. O que é identifying parameter?
7. Timestamp aleatório ajuda o restart?
8. Para que serve JobRepository?
9. O que é ExecutionContext?
10. O que é chunk?
11. O que é skip?
12. O que é retry?
13. O que é restart?
14. O reader precisa salvar estado?
15. Completed step roda no restart?
16. Batch substitui idempotência?
17. O que o poller faz?
18. O poller define a identidade?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Definição lógica do processo.
2. Execução lógica identificada.
3. Tentativa concreta.
4. Execução de uma etapa.
5. Job name e identifying parameters.
6. Parâmetro que participa da identidade.
7. Não.
8. Persistir metadata.
9. Estado necessário para retomada.
10. Unidade transacional de items.
11. Continuar após item previsto inválido.
12. Repetir falha transitória.
13. Retomar a mesma instance.
14. Sim.
15. Normalmente não.
16. Não.
17. Descobre, claim e lança.
18. Não.
19. Upload download em integracoes.
20. Streaming HTTP, limites e segurança.

---

## Desafio opcional

Crie um segundo job:

```text
inventoryRejectionReportJob.
```

Ele recebe `receiptId` identificador e regenera somente o report.

Requisitos:

- não reaplica adjustments;
- lê rejection table;
- escreve para `.part`;
- usa atomic move;
- checksum do report;
- não sobrescreve conteúdo diferente;
- possui JobInstance própria;
- acesso operacional protegido;
- métricas e audit;
- teste de restart.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 470 - M16.15 - Jobs batch

- Adicionei Spring Batch ao `catalog-file-importer`.
- Mantive versões gerenciadas pelo Spring Boot.
- Versionei o metadata schema PostgreSQL.
- Configurei `JobRepository` persistente.
- Desabilitei job automático no startup.
- Diferenciei Job, JobInstance, JobExecution, Step e StepExecution.
- Modelei identifying e non-identifying JobParameters.
- Usei `receiptId` como identidade estável.
- Proibi timestamp aleatório para forçar nova instance.
- Criei `InventoryImportJobLauncher`.
- Criei `inventorySftpImportJob`.
- Separei download, validação, processamento, finalização e ack.
- Criei branching para valid, rejected, duplicate e quarantine.
- Mantive falhas técnicas como `FAILED`.
- Gravei path, checksum e claim no ExecutionContext.
- Promovi chaves para o JobExecutionContext.
- Criei reader `@StepScope`.
- Implementei `ItemStreamReader`.
- Persisti índice do record por checkpoint.
- Revalidei checksum no restart.
- Configurei chunk de 100 records.
- Mantive writer transacional e idempotente.
- Diferenciei skip, retry e restart.
- Limitei skip a validações previstas.
- Limitei retry a falhas transitórias.
- Criei tabela persistente de rejections.
- Impedi raw line na rejection.
- Gerei report em step reiniciável.
- Mantive completed steps pulados no restart.
- Testei falha e retomada do download.
- Testei checkpoint no record 200.
- Testei rollback de chunk.
- Testei skip e retry.
- Testei report restart.
- Testei ack restart isolado.
- Impedi duas executions da mesma instance.
- Limitei jobs concorrentes.
- Criei poller desabilitável.
- Mantive scheduler como gatilho.
- Criei métricas e logs seguros.
- Criei documentação de parâmetros, restart, skip, retry e operação.
- Executei regressão de SFTP e CSV.
- Não antecipei upload/download HTTP.
- Mantive produção como NO-GO.
- Próxima aula: Upload download em integracoes.
```

---

## Referência técnica curta

- [Spring Batch — Overview](https://docs.spring.io/spring-batch/reference/index.html)
- [Spring Batch — Domain Language](https://docs.spring.io/spring-batch/reference/domain.html)
- [Spring Batch — JobRepository](https://docs.spring.io/spring-batch/reference/job/configuring-repository.html)
- [Spring Batch — Chunk Processing](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing.html)
- [Spring Batch — Restart](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/restart.html)
- [Spring Batch — Skip](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/configuring-skip.html)
- [Spring Batch — Retry](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/retry-logic.html)
- [Spring Batch — Testing](https://docs.spring.io/spring-batch/reference/testing.html)
- [Spring Boot — Spring Batch](https://docs.spring.io/spring-boot/reference/io/spring-batch.html)

Regra final:

```text
um job batch robusto deve possuir identidade estável, metadata persistente e steps reiniciáveis: JobInstance é definida pelo job name e parâmetros identificadores do receipt, cada tentativa cria uma JobExecution, cada etapa possui StepExecution e ExecutionContext limitado, o download, a validação, o processamento chunk-oriented, a finalização e o acknowledgement são separados, o reader salva checkpoint no commit, o writer mantém idempotência de negócio, skip cobre somente items inválidos previstos, retry cobre somente falhas transitórias, falhas técnicas mantêm o job FAILED, completed steps são pulados no restart, rejeições são persistidas antes do report e poller, JobRepository, receipt e remote claim trabalham juntos para impedir concorrência e duplicidade.
```
