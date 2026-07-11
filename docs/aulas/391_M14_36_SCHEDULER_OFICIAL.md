# 391 - M14.36 - Scheduler

## Apresentação da aula

Na aula 390, você adicionou upload e download de arquivos.

O fluxo passou a funcionar assim:

```text
upload multipart;

validação de tamanho e tipo;

UUID gerado pelo servidor;

payload salvo em ./var/uploads;

metadados separados;

download por Resource;

Content-Type;

Content-Length;

Content-Disposition.
```

Aquela aula deixou uma responsabilidade propositalmente de fora:

```text
o que fazer com arquivos antigos
que não devem permanecer
para sempre no armazenamento?
```

Uma solução manual seria abrir o diretório de tempos em tempos e apagar arquivos antigos.

Esse processo depende de uma pessoa.

Outra solução ingênua seria criar uma thread manual:

```java
new Thread(
        () -> {
            while (true) {
                limpar();
                Thread.sleep(60000);
            }
        }
).start();
```

Esse desenho ignora:

- ciclo de vida do Spring;
- shutdown;
- configuração por ambiente;
- exception handling;
- nomes de thread;
- concorrência;
- sobreposição;
- logs;
- habilitação controlada;
- testes;
- comportamento quando existem várias instâncias.

A pergunta central desta aula será:

```text
como executar tarefas periódicas
dentro da aplicação Spring
com configuração, ciclo de vida,
logs e limites claros?
```

A solução utilizará:

```text
@EnableScheduling;

@Scheduled;

fixedDelay;

fixedRate;

cron;

zone;

ThreadPoolTaskScheduler;

TaskScheduler;

properties tipadas;

execução controlada;

logs de início e fim;

tratamento de falhas;

limpeza de arquivos expirados.
```

A baseline criará uma tarefa:

```text
ExpiredStoredFileCleanupJob
```

Responsabilidade:

```text
localizar arquivos armazenados
há mais tempo que a retenção configurada;

remover payload e metadados;

registrar o resultado.
```

A política do laboratório será:

```text
retenção:
24 horas.

execução local:
a cada 30 segundos após o término da execução anterior.

produção:
cron externalizado.

batch máximo:
100 arquivos por execução.
```

A tarefa não apagará indiscriminadamente tudo que estiver no diretório.

Ela só considerará pares válidos:

```text
<uuid>.data;
<uuid>.properties.
```

Os metadados informarão:

```text
uploadedAt.
```

A decisão de expiração será:

```text
uploadedAt < agora - retenção.
```

Arquivos recém-criados não serão removidos.

A execução usará `fixedDelay` na baseline local.

Isso significa:

```text
o próximo intervalo começa
depois que a execução anterior termina.
```

Se a tarefa levar 10 segundos e o delay for 30 segundos:

```text
próxima execução:
aproximadamente 40 segundos
depois do início anterior.
```

A aula também comparará `fixedRate` e cron, mas não criará várias tarefas concorrentes para a mesma responsabilidade.

A configuração será externalizada.

Exemplo:

```yaml
app:
  scheduler:
    stored-file-cleanup:
      enabled: true
      retention: 24h
      fixed-delay: 30s
      initial-delay: 10s
      batch-size: 100
```

A task não dependerá de valores hardcoded.

A baseline usará um scheduler nomeado com uma única thread:

```text
stored-file-scheduler-
```

Essa escolha evita que duas execuções da mesma tarefa se sobreponham dentro da mesma instância.

Ela não resolve múltiplas instâncias.

Se duas instâncias da API estiverem ativas:

```text
cada instância pode executar a mesma tarefa.
```

Esse limite será documentado.

Não será implementado:

- lock distribuído;
- leader election;
- Quartz cluster;
- banco de jobs;
- ShedLock;
- fila;
- broker;
- scheduler externo;
- Kubernetes CronJob.

Esses mecanismos são importantes em sistemas distribuídos, mas não pertencem ao objetivo desta aula.

A tarefa será síncrona dentro do thread do scheduler.

Ela não usará:

```text
@Async.
```

Misturar scheduling e async sem necessidade dificulta controle de execução e erros.

O projeto continua em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
392 - M14.37 - Email e notificação simples
```

Por isso, esta aula não enviará e-mail, não criará notificações e não transformará o scheduler em um mecanismo de mensageria.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
387:
Async no Spring.

388:
Cache com Spring Redis.

389:
Rate limiting.

390:
Upload download.

391:
Scheduler.

392:
Email e notificação simples.

```

A aula 390 respondeu:

```text
como receber, armazenar
e devolver arquivos
com segurança básica?
```

A aula 391 responderá:

```text
como executar uma tarefa periódica
sem thread manual
e sem perder controle
de ciclo de vida e configuração?
```

Nesta aula:

```text
@EnableScheduling:
sim.

@Scheduled:
sim.

fixedDelay:
sim.

fixedRate:
comparação.

cron:
sim.

zone:
sim.

TaskScheduler:
sim.

ThreadPoolTaskScheduler:
sim.

properties:
sim.

retention:
sim.

batch:
sim.

logs:
sim.

tratamento de falha:
sim.

lock distribuído:
não.

Quartz:
não.

email:
não.

mensageria:
não.

testes completos:
não.
```

A regra central será:

```text
uma tarefa agendada precisa declarar
quando executa,
quanto trabalho faz,
como falha,
como encerra
e qual é o limite da execução.
```

---

## Objetivo prático

Ao final da aula, a aplicação deverá:

```text
iniciar um scheduler controlado;

executar a limpeza após initial delay;

esperar fixed delay após cada execução;

remover arquivos expirados;

preservar arquivos dentro da retenção;

limitar a quantidade removida por execução;

registrar início, fim, duração e quantidade;

continuar funcionando quando um arquivo isolado falhar.
```

Você irá:

1. habilitar scheduling em uma configuração própria;
2. criar properties tipadas;
3. configurar `ThreadPoolTaskScheduler`;
4. criar um componente de limpeza reutilizável;
5. criar um job com `@Scheduled`;
6. usar `fixedDelayString` e `initialDelayString`;
7. externalizar retenção e batch;
8. testar manualmente arquivos antigos e recentes;
9. comparar fixed delay, fixed rate e cron;
10. commitar.

Estrutura esperada:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── file
│       ├── FileStorageService.java
│       ├── StoredFileCleanupService.java
│       └── StoredFileCleanupResult.java
├── config
│   └── scheduler
│       ├── StoredFileCleanupProperties.java
│       └── StoredFileSchedulerConfiguration.java
└── scheduler
    └── file
        └── ExpiredStoredFileCleanupJob.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
├── application-hml.yaml
└── application-production.yaml
```

Resultado esperado no log:

```text
stored_file_cleanup.started;

stored_file_cleanup.completed;

scannedCount;

deletedCount;

failedCount;

durationMs.
```

---

## Conceito essencial

### O que é scheduling

Scheduling é a execução de uma tarefa conforme uma regra de tempo.

Exemplos:

- a cada 30 segundos;
- cinco minutos depois da execução anterior;
- todos os dias às 02:00;
- toda segunda-feira;
- depois de um atraso inicial.

O scheduler decide:

```text
quando submeter a tarefa.
```

A lógica da tarefa decide:

```text
o que fazer.
```

Essas duas responsabilidades precisam permanecer separadas.

---

### @EnableScheduling

`@EnableScheduling` ativa o processamento das annotations `@Scheduled`.

Exemplo:

```java
@Configuration(
        proxyBeanMethods = false
)
@EnableScheduling
public class StoredFileSchedulerConfiguration {
}
```

A annotation ficará em uma configuração específica.

Não coloque na classe principal da aplicação.

Isso facilita habilitar ou desabilitar jobs por ambiente.

---

### @Scheduled

Exemplo:

```java
@Scheduled(
        fixedDelayString =
                "${app.scheduler.stored-file-cleanup.fixed-delay}",
        initialDelayString =
                "${app.scheduler.stored-file-cleanup.initial-delay}"
)
public void execute() {
}
```

O Spring registra esse método como tarefa agendada.

Regras importantes:

- o método não recebe argumentos;
- o retorno não é usado como resultado do job;
- exceptions precisam ser tratadas conscientemente;
- a tarefa deve ser pequena o suficiente para ser compreendida;
- configuração de tempo não deve ficar espalhada.

---

### fixedDelay

`fixedDelay` mede o intervalo depois da conclusão.

Fluxo:

```text
execução termina;

delay começa;

delay termina;

nova execução começa.
```

É adequado quando:

- uma execução não deve se sobrepor à anterior;
- o trabalho pode variar de duração;
- o intervalo pode começar depois do término;
- a prioridade é estabilidade.

A baseline usará `fixedDelay`.

---

### fixedRate

`fixedRate` mede o intervalo entre horários planejados de início.

Exemplo conceitual:

```text
tarefa planejada a cada 30 segundos.
```

Se a execução demorar mais que o intervalo, o comportamento depende da capacidade do scheduler.

Com uma única thread:

```text
a próxima execução espera a thread liberar.
```

Com várias threads:

```text
pode existir sobreposição,
dependendo do desenho.
```

`fixedRate` é útil quando a frequência de início importa.

Ele não será usado na baseline de limpeza.

---

### initialDelay

`initialDelay` evita executar imediatamente no startup.

Baseline local:

```text
10 segundos.
```

Isso permite que:

- aplicação conclua startup;
- migrations terminem;
- filesystem seja validado;
- logs iniciais fiquem separados;
- desenvolvedor interrompa a aplicação se necessário.

O initial delay não se repete.

---

### Cron

Cron expressa horários de calendário.

Exemplo:

```text
todos os dias às 02:00.
```

No Spring:

```java
@Scheduled(
        cron =
                "${app.scheduler.stored-file-cleanup.cron}",
        zone =
                "${app.scheduler.stored-file-cleanup.zone}"
)
```

Expressão:

```text
0 0 2 * * *
```

Campos usados pelo Spring:

```text
segundo;
minuto;
hora;
dia do mês;
mês;
dia da semana.
```

A baseline local usa fixed delay para facilitar observação.

HML e production podem utilizar cron externalizado.

Não misture `fixedDelayString` e `cron` na mesma annotation.

---

### Time zone

Cron depende de fuso horário.

Exemplo:

```text
America/Sao_Paulo.
```

Sem zone explícita, a aplicação pode utilizar o fuso da JVM.

Containers e servidores podem estar em UTC.

A regra profissional é:

```text
cron de negócio precisa declarar zone.
```

Nesta aula, o cron será discutido e configurado por ambiente, mas o job local oficial permanece por fixed delay.

---

### Scheduler padrão

Sem configuração, o Spring pode utilizar um scheduler simples.

Isso é suficiente para demonstrações pequenas, mas deixa decisões importantes implícitas:

- nome de thread;
- quantidade de threads;
- shutdown;
- espera por tarefas;
- tratamento de errors.

A aula criará um `ThreadPoolTaskScheduler` nomeado.

---

### ThreadPoolTaskScheduler

Configuração:

```java
ThreadPoolTaskScheduler scheduler =
        new ThreadPoolTaskScheduler();

scheduler.setPoolSize(1);
scheduler.setThreadNamePrefix(
        "stored-file-scheduler-"
);
scheduler.setWaitForTasksToCompleteOnShutdown(
        true
);
scheduler.setAwaitTerminationSeconds(
        15
);
```

Pool size 1 significa:

```text
uma tarefa de scheduling
por vez nesta baseline.
```

Isso reduz sobreposição local.

Não significa que o trabalho seja distribuído ou durável.

---

### SchedulingConfigurer

A configuração pode implementar:

```text
SchedulingConfigurer.
```

Exemplo:

```java
@Override
public void configureTasks(
        ScheduledTaskRegistrar registrar
) {
    registrar.setTaskScheduler(
            taskScheduler()
    );
}
```

Isso deixa explícito qual scheduler executa as annotations.

Não dependa de resolução implícita quando o projeto possui vários executors.

---

### Scheduler não é async

`@Scheduled` já executa no thread do scheduler.

Adicionar `@Async` ao mesmo método pode:

- esconder sobreposição;
- separar exception do scheduler;
- criar tasks em memória;
- remover o controle do pool único;
- iniciar novas execuções enquanto a anterior continua.

A baseline não usa `@Async`.

---

### Scheduler não é fila durável

Se a aplicação estiver desligada no horário:

```text
a execução não acontece.
```

Quando a aplicação voltar:

```text
o Spring não recupera automaticamente
todas as execuções perdidas.
```

Também não existe:

- histórico persistido;
- retry persistido;
- claim de job;
- reprocessamento;
- dead letter.

O job precisa ser desenhado sabendo desse limite.

---

### Idempotência operacional

Uma tarefa periódica pode executar novamente.

A limpeza precisa tolerar:

- arquivo já removido;
- metadado ausente;
- payload ausente;
- diretório vazio;
- execução sem candidatos.

Apagar algo que já não existe não deve derrubar a aplicação inteira.

A baseline retornará um resultado com:

```text
scanned;
deleted;
failed.
```

---

### Retenção

Retenção define por quanto tempo manter o arquivo.

Exemplo:

```text
24 horas.
```

Data limite:

```java
Instant cutoff =
        clock.instant()
                .minus(
                        retention
                );
```

Expirado:

```text
uploadedAt anterior ao cutoff.
```

Não use data de modificação do filesystem como fonte principal.

A aula 390 já armazenou `uploadedAt` nos metadados.

---

### Batch máximo

Um job não deve tentar remover milhões de arquivos em uma única execução sem limite.

Baseline:

```text
100 candidatos por execução.
```

Benefícios:

- duração limitada;
- menor impacto;
- logs compreensíveis;
- próxima execução continua o trabalho;
- menos risco de monopolizar o filesystem.

O batch não garante ordenação perfeita.

A baseline ordenará por `uploadedAt` para remover primeiro os mais antigos.

---

### Falha isolada

Se um arquivo falhar:

```text
registrar;
incrementar failed;
continuar os demais.
```

Não capture qualquer erro fora de contexto e finja sucesso.

A execução final informa:

```text
deletedCount;
failedCount.
```

Uma falha estrutural, como root inacessível, deve encerrar aquela execução e produzir log de erro.

---

### Logs do job

Logs permitidos:

- event;
- startedAt;
- cutoff;
- scannedCount;
- deletedCount;
- failedCount;
- durationMs;
- thread.

Não registrar:

- conteúdo do arquivo;
- path absoluto;
- dados sensíveis;
- stack trace repetida para cada arquivo quando um resumo é suficiente.

Falha inesperada da execução registra uma stack trace.

---

### Sobreposição local

Com uma thread e fixed delay:

```text
a mesma instância
não executa duas limpezas simultâneas.
```

Se o método levar dois minutos:

```text
a próxima execução espera o término
e depois aguarda o delay.
```

Esse comportamento é adequado para a baseline.

---

### Múltiplas instâncias

Considere:

```text
API A;
API B.
```

Cada uma possui seu próprio scheduler.

Resultado:

```text
A pode limpar;
B pode limpar ao mesmo tempo.
```

Com filesystem local, cada instância pode possuir diretório próprio.

Com volume compartilhado, as duas podem disputar os mesmos arquivos.

A aula não implementará lock distribuído.

A decisão operacional será:

```text
baseline local e de instância única;
produção distribuída exige coordenação externa
ou job dedicado.
```

---

### Desabilitar por ambiente

Properties:

```text
enabled.
```

Quando `false`, a task não executa trabalho.

A annotation continua registrada, mas o método retorna imediatamente.

Outra opção seria condicionar o bean inteiro.

A baseline usará:

```text
@ConditionalOnProperty.
```

Assim, o job nem será criado quando desabilitado.

Isso reduz logs e execução inútil.

---

### @ConditionalOnProperty

Exemplo:

```java
@Component
@ConditionalOnProperty(
        prefix =
                "app.scheduler.stored-file-cleanup",
        name = "enabled",
        havingValue = "true"
)
public class ExpiredStoredFileCleanupJob {
}
```

Sem a property ou com `false`:

```text
bean ausente;
job não registrado.
```

A configuração do scheduler pode continuar disponível para outros jobs futuros.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean compile
```

Confirme também que o diretório:

```text
./var/uploads
```

continua ignorado pelo Git.

---

### 2. Criar properties

Arquivo:

```text
StoredFileCleanupProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.scheduler;

import java.time.Duration;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(
        "app.scheduler.stored-file-cleanup"
)
@Validated
public record StoredFileCleanupProperties(
        boolean enabled,

        @NotNull
        Duration retention,

        @NotNull
        Duration fixedDelay,

        @NotNull
        Duration initialDelay,

        @Positive
        int batchSize
) {
}
```

O projeto já utiliza `@ConfigurationPropertiesScan`.

---

### 3. Configurar local

Em `application-local.yaml`:

```yaml
app:
  scheduler:
    stored-file-cleanup:
      enabled: "${STORED_FILE_CLEANUP_ENABLED:true}"
      retention: "${STORED_FILE_RETENTION:24h}"
      fixed-delay: "${STORED_FILE_CLEANUP_DELAY:30s}"
      initial-delay: "${STORED_FILE_CLEANUP_INITIAL_DELAY:10s}"
      batch-size: "${STORED_FILE_CLEANUP_BATCH_SIZE:100}"
```

Para HML e production, mantenha `enabled` externalizado.

Não copie o delay de 30 segundos para produção sem necessidade.

---

### 4. Criar configuração do scheduler

Arquivo:

```text
StoredFileSchedulerConfiguration.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.scheduler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.scheduling.annotation
        .EnableScheduling;
import org.springframework.scheduling.annotation
        .SchedulingConfigurer;
import org.springframework.scheduling.concurrent
        .ThreadPoolTaskScheduler;
import org.springframework.scheduling.config
        .ScheduledTaskRegistrar;

@Configuration(
        proxyBeanMethods = false
)
@EnableScheduling
public class StoredFileSchedulerConfiguration
        implements SchedulingConfigurer {

    @Bean
    ThreadPoolTaskScheduler
            storedFileTaskScheduler() {

        ThreadPoolTaskScheduler scheduler =
                new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(
                1
        );

        scheduler.setThreadNamePrefix(
                "stored-file-scheduler-"
        );

        scheduler.setWaitForTasksToCompleteOnShutdown(
                true
        );

        scheduler.setAwaitTerminationSeconds(
                15
        );

        scheduler.setErrorHandler(
                throwable -> {
                    // O job também registra suas falhas.
                    // Este handler protege erros não tratados.
                }
        );

        return scheduler;
    }

    @Override
    public void configureTasks(
            ScheduledTaskRegistrar
                    taskRegistrar
    ) {
        taskRegistrar.setTaskScheduler(
                storedFileTaskScheduler()
        );
    }
}
```

Não deixe o error handler vazio na implementação final.

Adicione log com um event name estável:

```text
scheduler.task.failed.
```

Não inclua dados do arquivo.

---

### 5. Criar resultado da limpeza

Arquivo:

```text
StoredFileCleanupResult.java
```

Conteúdo:

```java
package br.com.formacao.backend.application.file;

public record StoredFileCleanupResult(
        int scannedCount,
        int deletedCount,
        int failedCount
) {
}
```

O resultado facilita logging e execução manual.

---

### 6. Expor leitura de metadados

Na aula 390, `FileStorageService` já sabe ler:

```text
<uuid>.properties.
```

Extraia ou exponha um método package-private ou público controlado:

```java
public List<StoredFileMetadata>
        listStoredFiles() {
}
```

Ele deve:

1. listar somente arquivos `*.properties`;
2. tentar converter o nome base para UUID;
3. ler os metadados;
4. ignorar arquivos que não pertencem ao padrão;
5. não percorrer subdiretórios;
6. não seguir links simbólicos.

Exemplo de filtro:

```java
try (
    Stream<Path> paths =
            Files.list(
                    root
            )
) {
    return paths
            .filter(
                    Files::isRegularFile
            )
            .filter(
                    path ->
                            path
                                .getFileName()
                                .toString()
                                .endsWith(
                                        ".properties"
                                )
            )
            .map(
                    this::readMetadataSafely
            )
            .flatMap(
                    Optional::stream
            )
            .toList();
}
```

Não use `Files.walk` para essa baseline.

O diretório possui uma única camada.

---

### 7. Criar remoção controlada

No `FileStorageService`, adicione:

```java
public void deleteStoredFile(
        UUID id
) {

    Path payload =
            resolveInsideRoot(
                    id + ".data"
            );

    Path metadata =
            resolveInsideRoot(
                    id + ".properties"
            );

    try {
        Files.deleteIfExists(
                payload
        );

        Files.deleteIfExists(
                metadata
        );
    } catch (
            IOException exception
    ) {
        throw new FileStorageException(
                "Could not delete stored file",
                exception
        );
    }
}
```

A ordem remove payload primeiro.

Se a exclusão dos metadados falhar:

```text
a próxima execução encontra o metadado;
tenta remover novamente;
deleteIfExists tolera payload ausente.
```

Esse comportamento favorece repetição segura.

---

### 8. Criar o serviço de limpeza

Arquivo:

```text
StoredFileCleanupService.java
```

Conteúdo:

```java
package br.com.formacao.backend.application.file;

import java.time.Clock;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import br.com.formacao.backend.config.scheduler
        .StoredFileCleanupProperties;

@Service
public class StoredFileCleanupService {

    private static final Logger log =
            LoggerFactory.getLogger(
                    StoredFileCleanupService.class
            );

    private final FileStorageService
            storageService;

    private final StoredFileCleanupProperties
            properties;

    private final Clock clock;

    public StoredFileCleanupService(
            FileStorageService storageService,
            StoredFileCleanupProperties
                    properties,
            Clock clock
    ) {
        this.storageService =
                storageService;
        this.properties =
                properties;
        this.clock = clock;
    }

    public StoredFileCleanupResult
            cleanupExpiredFiles() {

        Instant cutoff =
                clock.instant()
                        .minus(
                                properties.retention()
                        );

        List<StoredFileMetadata> candidates =
                storageService
                        .listStoredFiles()
                        .stream()
                        .filter(
                                metadata ->
                                        metadata
                                            .uploadedAt()
                                            .isBefore(
                                                    cutoff
                                            )
                        )
                        .sorted(
                                Comparator.comparing(
                                        StoredFileMetadata
                                                ::uploadedAt
                                )
                        )
                        .limit(
                                properties.batchSize()
                        )
                        .toList();

        int deleted = 0;
        int failed = 0;

        for (
            StoredFileMetadata metadata
            : candidates
        ) {
            try {
                storageService
                        .deleteStoredFile(
                                metadata.id()
                        );

                deleted++;
            } catch (
                RuntimeException exception
            ) {
                failed++;

                log.atWarn()
                        .setCause(
                                exception
                        )
                        .addKeyValue(
                                "event",
                                "stored_file_cleanup.item_failed"
                        )
                        .addKeyValue(
                                "storedFileId",
                                metadata.id()
                        )
                        .log(
                                "Could not delete "
                                + "expired stored file"
                        );
            }
        }

        return new StoredFileCleanupResult(
                candidates.size(),
                deleted,
                failed
        );
    }
}
```

O service não possui `@Scheduled`.

Ele contém apenas a regra de negócio operacional.

---

### 9. Criar o job

Arquivo:

```text
ExpiredStoredFileCleanupJob.java
```

Conteúdo:

```java
package br.com.formacao.backend.scheduler.file;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.scheduling.annotation
        .Scheduled;
import org.springframework.stereotype.Component;

import br.com.formacao.backend.application.file
        .StoredFileCleanupResult;
import br.com.formacao.backend.application.file
        .StoredFileCleanupService;

@Component
@ConditionalOnProperty(
        prefix =
                "app.scheduler.stored-file-cleanup",
        name = "enabled",
        havingValue = "true"
)
public class ExpiredStoredFileCleanupJob {

    private static final Logger log =
            LoggerFactory.getLogger(
                    ExpiredStoredFileCleanupJob.class
            );

    private final StoredFileCleanupService
            cleanupService;

    public ExpiredStoredFileCleanupJob(
            StoredFileCleanupService cleanupService
    ) {
        this.cleanupService =
                cleanupService;
    }

    @Scheduled(
        fixedDelayString =
                "${app.scheduler.stored-file-cleanup.fixed-delay}",
        initialDelayString =
                "${app.scheduler.stored-file-cleanup.initial-delay}"
    )
    public void execute() {

        long startedAt =
                System.nanoTime();

        log.atInfo()
                .addKeyValue(
                        "event",
                        "stored_file_cleanup.started"
                )
                .log(
                        "Stored file cleanup started"
                );

        try {
            StoredFileCleanupResult result =
                    cleanupService
                            .cleanupExpiredFiles();

            long durationMs =
                    Duration
                            .ofNanos(
                                System.nanoTime()
                                    - startedAt
                            )
                            .toMillis();

            log.atInfo()
                    .addKeyValue(
                            "event",
                            "stored_file_cleanup.completed"
                    )
                    .addKeyValue(
                            "scannedCount",
                            result.scannedCount()
                    )
                    .addKeyValue(
                            "deletedCount",
                            result.deletedCount()
                    )
                    .addKeyValue(
                            "failedCount",
                            result.failedCount()
                    )
                    .addKeyValue(
                            "durationMs",
                            durationMs
                    )
                    .log(
                            "Stored file cleanup completed"
                    );
        } catch (
            RuntimeException exception
        ) {
            log.atError()
                    .setCause(
                            exception
                    )
                    .addKeyValue(
                            "event",
                            "stored_file_cleanup.failed"
                    )
                    .log(
                            "Stored file cleanup failed"
                    );
        }
    }
}
```

A exception não escapa do método.

A próxima execução continua sendo agendada.

---

### 10. Validar a thread

Inicie a aplicação:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Depois de 10 segundos, procure:

```text
stored-file-scheduler-
```

O log de início e fim precisa aparecer nesse thread.

---

### 11. Criar arquivo recente

Use a API da aula 390 para enviar um arquivo.

Exemplo:

```powershell
$recent = curl.exe `
  --silent `
  --request POST `
  --form `
    "file=@.\samples\aula-390.txt;type=text/plain" `
  "http://localhost:8081/api/v2/runtime/files" |
  ConvertFrom-Json
```

Com retenção de 24 horas:

```text
o arquivo não deve ser removido.
```

Aguarde duas execuções.

Confirme:

```powershell
Get-ChildItem `
  ".\var\uploads"
```

Os dois arquivos continuam presentes.

---

### 12. Criar candidato expirado

Para o laboratório, pare a aplicação.

Abra o arquivo:

```text
<id>.properties
```

Altere somente:

```text
uploadedAt
```

para uma data anterior à retenção.

Exemplo:

```text
2026-07-09T10:00:00Z
```

Não altere:

- ID;
- tamanho;
- content type;
- nome.

Reinicie a aplicação.

Depois da execução:

```text
<id>.data:
removido.

<id>.properties:
removido.
```

O log informa:

```text
deletedCount=1.
```

---

### 13. Testar batch

Pare a aplicação.

Crie ou adapte três arquivos expirados.

Configure:

```powershell
$env:STORED_FILE_CLEANUP_BATCH_SIZE = "2"
```

Inicie.

Primeira execução:

```text
remove no máximo 2.
```

Segunda execução:

```text
remove o restante.
```

Restaure:

```powershell
Remove-Item `
  Env:STORED_FILE_CLEANUP_BATCH_SIZE
```

---

### 14. Testar desabilitado

Pare a aplicação.

Defina:

```powershell
$env:STORED_FILE_CLEANUP_ENABLED = "false"
```

Inicie.

Resultado:

```text
bean do job não é criado;
logs da limpeza não aparecem;
arquivos não são removidos.
```

Restaure:

```powershell
Remove-Item `
  Env:STORED_FILE_CLEANUP_ENABLED
```

---

### 15. Testar falha isolada

Crie dois candidatos expirados.

Em um deles, provoque uma falha controlada de permissão ou substitua temporariamente o payload por um diretório com o mesmo nome, conforme permitido pelo seu ambiente local.

Resultado esperado:

```text
um item falha;
outro pode ser removido;
failedCount aumenta;
job termina com completed.
```

Restaure o diretório depois do teste.

Não altere permissões de arquivos do sistema.

---

### 16. Comparar fixed delay e fixed rate

Altere temporariamente a annotation para:

```java
@Scheduled(
        fixedRateString =
                "${app.scheduler.stored-file-cleanup.fixed-delay}",
        initialDelayString =
                "${app.scheduler.stored-file-cleanup.initial-delay}"
)
```

Adicione uma espera controlada de laboratório no service.

Observe os horários de início.

Com uma thread, execuções não rodam simultaneamente, mas o agendamento tenta respeitar a frequência de início.

Restaure `fixedDelayString`.

A baseline oficial permanece fixed delay.

---

### 17. Experimentar cron em fixture local

Não substitua a baseline definitivamente.

Crie temporariamente:

```java
@Scheduled(
        cron = "0 */1 * * * *",
        zone = "America/Sao_Paulo"
)
```

Isso executa a cada minuto.

Observe os horários.

Depois restaure fixed delay.

Registre:

```text
fixed delay:
intervalo após conclusão.

cron:
horário de calendário.
```

---

### 18. Revisar shutdown

Com o job executando uma limpeza curta, encerre a aplicação normalmente.

O scheduler deve:

```text
aguardar a task
até o limite de 15 segundos.
```

Ele não protege contra:

- kill forçado;
- queda de energia;
- crash;
- remoção abrupta do processo.

A limpeza é repetível.

A próxima inicialização pode continuar.

---

## Entendendo o que foi feito

### A thread manual desapareceu

O Spring controla criação, execução e encerramento.

### A regra de tempo ficou externa

Delay, retenção e batch podem variar por ambiente.

### A regra de limpeza ficou separada do scheduler

O service pode ser chamado manualmente sem depender de annotation.

### A execução local não se sobrepõe

Pool de uma thread e fixed delay mantêm uma tarefa por vez.

### O trabalho ficou limitado

Cada execução remove no máximo o batch configurado.

### Falha isolada não interrompe todos os candidatos

O resultado informa sucesso e falha.

### O limite distribuído foi declarado

Mais de uma instância exige coordenação que não foi implementada.

---

## Erros comuns importantes

### Criar while(true) com sleep

Ignora ciclo de vida e shutdown do Spring.

### Colocar toda a regra dentro do método @Scheduled

Dificulta reutilização, teste e leitura.

### Usar fixedRate sem entender sobreposição

Várias threads podem executar a mesma tarefa simultaneamente.

### Usar cron sem zone

O horário depende do fuso da JVM.

### Apagar todos os arquivos em uma execução

O job pode monopolizar o filesystem e durar demais.

### Usar data de modificação como regra oficial

O arquivo pode ter sido copiado ou alterado operacionalmente.

Use o `uploadedAt` armazenado.

### Misturar @Scheduled e @Async

A execução deixa de estar limitada pelo scheduler oficial.

### Não capturar falha no job

Uma exception pode produzir comportamento de agendamento difícil de diagnosticar.

### Presumir que o job é distribuído

Cada instância registra sua própria tarefa.

### Tratar scheduler como mensageria durável

Execuções perdidas durante downtime não são recuperadas automaticamente.

---

## Comandos úteis

### Iniciar com job ativo

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

### Desabilitar

```powershell
$env:STORED_FILE_CLEANUP_ENABLED = "false"
```

### Alterar retenção

```powershell
$env:STORED_FILE_RETENTION = "10m"
```

### Alterar delay

```powershell
$env:STORED_FILE_CLEANUP_DELAY = "10s"
```

### Alterar batch

```powershell
$env:STORED_FILE_CLEANUP_BATCH_SIZE = "2"
```

### Inspecionar uploads

```powershell
Get-ChildItem `
  ".\var\uploads"
```

### Limpar variáveis

```powershell
Remove-Item Env:STORED_FILE_CLEANUP_ENABLED
Remove-Item Env:STORED_FILE_RETENTION
Remove-Item Env:STORED_FILE_CLEANUP_DELAY
Remove-Item Env:STORED_FILE_CLEANUP_BATCH_SIZE
```

---

## Exercício guiado

### Parte 1 — Arquivo recente

Faça upload e confirme que ele permanece.

### Parte 2 — Arquivo expirado

Altere `uploadedAt` no metadata e confirme remoção.

### Parte 3 — Batch

Crie três expirados com batch 2.

Confirme duas execuções.

### Parte 4 — Job desabilitado

Defina `enabled=false`.

Confirme ausência de execução.

### Parte 5 — fixedRate

Troque temporariamente o modo e observe os horários.

Restaure fixed delay.

### Parte 6 — cron

Use uma expressão por minuto com zone explícita.

Restaure a baseline.

### Parte 7 — registrar decisão

Anote:

```text
@EnableScheduling em configuração própria;

ThreadPoolTaskScheduler;

pool size 1;

thread prefix controlado;

graceful shutdown de 15 segundos;

job condicional;

fixed delay local;

initial delay;

retention externalizada;

batch máximo;

service separado;

sem @Async;

sem lock distribuído;

sem Quartz;

sem e-mail.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 390 foi preservada;
- `@EnableScheduling` foi usado;
- scheduling ficou em configuração própria;
- `ThreadPoolTaskScheduler` foi criado;
- pool size 1 foi configurado;
- thread prefix foi configurado;
- shutdown controlado foi configurado;
- `SchedulingConfigurer` foi usado;
- task scheduler explícito foi registrado;
- properties tipadas foram criadas;
- `enabled` foi externalizado;
- retenção foi externalizada;
- fixed delay foi externalizado;
- initial delay foi externalizado;
- batch foi externalizado;
- job foi condicionado por property;
- `@Scheduled` foi usado;
- baseline utiliza `fixedDelayString`;
- `initialDelayString` foi usado;
- fixed rate foi comparado;
- cron foi comparado;
- zone foi explicada;
- job não recebe argumentos;
- job não usa retorno como contrato;
- job não usa `@Async`;
- regra de limpeza ficou em service separado;
- metadata `uploadedAt` foi usada;
- data de modificação não virou fonte;
- listagem considera somente `.properties`;
- subdiretórios não são percorridos;
- links simbólicos não foram seguidos;
- expiração usa cutoff;
- candidatos foram ordenados;
- batch limitou o trabalho;
- payload foi removido;
- metadata foi removido;
- `deleteIfExists` permitiu repetição;
- falha isolada foi registrada;
- execução produziu resumo;
- logs de início e conclusão foram criados;
- duração foi medida com `nanoTime`;
- conteúdo do arquivo não foi logado;
- path absoluto não foi logado;
- arquivo recente foi preservado;
- arquivo expirado foi removido;
- batch foi testado manualmente;
- job desabilitado foi testado;
- fixed delay foi observado;
- cron foi experimentado somente como fixture;
- shutdown normal foi observado;
- múltiplas instâncias foram discutidas;
- lock distribuído não foi antecipado;
- Quartz não foi antecipado;
- mensageria não foi antecipada;
- e-mail não foi antecipado;
- testes completos não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 392 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m14): agendar limpeza de arquivos expirados"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `var/uploads`;
- arquivos de laboratório;
- logs;
- `target`;
- dados reais;
- dumps;
- credentials;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação ganhou execução periódica controlada.

O fluxo ficou:

```text
Spring startup;

@EnableScheduling;

ThreadPoolTaskScheduler;

initial delay;

@Scheduled;

StoredFileCleanupService;

seleção por retenção;

batch;

remoção;

log de conclusão;

fixed delay.
```

Você comprovou:

```text
job habilitado por property;

thread nomeado;

fixed delay;

initial delay;

arquivo recente preservado;

arquivo expirado removido;

batch limitado;

falha isolada;

shutdown normal.
```

A decisão central foi:

```text
scheduler não é uma thread manual
nem uma fila durável;

ele executa uma tarefa
conforme uma regra de tempo
enquanto a aplicação está ativa;

a tarefa precisa ser pequena,
repetível, configurável
e honesta sobre seus limites.
```

A próxima aula será:

```text
392 - M14.37 - Email e notificação simples
```

Nela, você aprenderá a configurar envio de mensagens por e-mail e separar template, destinatário, conteúdo e falhas de entrega.

Esta aula não enviou e-mail nem usou o scheduler para notificações.

---

# Material complementar

## Checkpoint final

- [ ] Habilitei scheduling em configuração própria.
- [ ] Configurei um `ThreadPoolTaskScheduler`.
- [ ] Criei job com fixed delay e initial delay.
- [ ] Removi somente arquivos expirados.
- [ ] Testei batch, desabilitação e shutdown.

---

## Troubleshooting adicional

### O job não executa

Confirme:

- `@EnableScheduling`;
- bean do job criado;
- property `enabled=true`;
- nome correto da property;
- initial delay ainda não terminou;
- aplicação não foi encerrada.

### O job executa duas vezes

Pode existir:

- configuração duplicada;
- bean duplicado;
- duas instâncias da aplicação;
- aplicação iniciada duas vezes.

### A thread possui nome genérico

Confirme que o `ScheduledTaskRegistrar` usa o scheduler customizado.

### O arquivo recente foi apagado

Revise:

- `uploadedAt`;
- retenção;
- fuso não deve alterar `Instant`;
- cutoff;
- comparação `isBefore`.

### Arquivo expirado não é removido

Confirme:

- metadata `.properties`;
- UUID válido;
- `uploadedAt` antigo;
- batch não esgotado;
- permissões;
- root correto.

### Cron executa em horário inesperado

Declare `zone`.

Confirme o fuso da regra e o da JVM.

### Shutdown demora demais

Revise duração da tarefa e `awaitTerminationSeconds`.

Não aumente indefinidamente para esconder jobs longos.

---

## Observações para aulas futuras

Sistemas distribuídos podem precisar de:

- lock distribuído;
- leader election;
- scheduler externo;
- Quartz persistente;
- Kubernetes CronJob;
- histórico de execução;
- retry persistido;
- misfire policy;
- dashboards.

Esses recursos não foram implementados agora.

Testes automatizados completos de scheduling serão aprofundados nas aulas específicas de testes.

O scheduler também pode iniciar envio de notificações, mas essa combinação só deve existir depois que a responsabilidade de e-mail estiver corretamente implementada.

---

## Perguntas de revisão

1. O que scheduling resolve?
2. Qual annotation habilita?
3. Qual annotation marca o método?
4. O que fixed delay mede?
5. O que fixed rate mede?
6. Para que serve initial delay?
7. Quando usar cron?
8. Por que declarar zone?
9. Qual scheduler foi usado?
10. Qual pool size?
11. Por que uma thread?
12. O job usa `@Async`?
13. Qual é a retenção?
14. Qual é o batch?
15. Qual timestamp define expiração?
16. O job segue links simbólicos?
17. O que acontece em falha isolada?
18. O job é distribuído?
19. Execuções perdidas são recuperadas?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Execução periódica por regra de tempo.
2. `@EnableScheduling`.
3. `@Scheduled`.
4. Intervalo depois da conclusão.
5. Frequência planejada de início.
6. Atrasar a primeira execução.
7. Horários de calendário.
8. Para evitar dependência do fuso da JVM.
9. `ThreadPoolTaskScheduler`.
10. Um.
11. Evitar sobreposição local.
12. Não.
13. 24 horas.
14. 100.
15. `uploadedAt`.
16. Não.
17. Registra, conta e continua.
18. Não.
19. Não.
20. Email e notificação simples.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 391 - M14.36 - Scheduler

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei scheduling de thread manual.
- Habilitei `@EnableScheduling`.
- Criei uma configuração própria para scheduling.
- Configurei `ThreadPoolTaskScheduler`.
- Usei pool size 1.
- Configurei prefixo de thread.
- Configurei shutdown controlado.
- Registrei o scheduler com `SchedulingConfigurer`.
- Criei properties tipadas para o job.
- Externalizei enabled, retenção, delay, initial delay e batch.
- Criei job condicional por property.
- Usei `@Scheduled`.
- Adotei `fixedDelayString` na baseline.
- Usei `initialDelayString`.
- Comparei fixed delay, fixed rate e cron.
- Entendi a importância de zone em cron.
- Mantive a regra de limpeza em service separado.
- Listei somente metadados válidos.
- Usei `uploadedAt` como fonte de retenção.
- Calculei cutoff com `Instant`.
- Ordenei candidatos por data.
- Limitei o batch.
- Removi payload e metadados.
- Usei `deleteIfExists` para repetição segura.
- Tratei falha isolada sem interromper todo o job.
- Registrei início, conclusão, contagens e duração.
- Preservei arquivos recentes.
- Removi arquivos expirados.
- Testei job desabilitado.
- Não usei `@Async`.
- Não antecipei lock distribuído, Quartz ou e-mail.
- Próxima aula: Email e notificação simples.
```

---

## Referência técnica curta

- [Spring Framework — Task Execution and Scheduling](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [Spring Framework — @Scheduled](https://docs.spring.io/spring-framework/reference/integration/scheduling.html#scheduling-annotation-support-scheduled)
- [Spring Boot — Task Execution and Scheduling](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html)

Regra final:

```text
uma tarefa agendada precisa separar regra de tempo e regra de trabalho, usar um scheduler controlado, externalizar delay, retenção e batch, evitar sobreposição não planejada, registrar início e resultado, tolerar repetição e declarar que execuções em memória só acontecem enquanto a aplicação está ativa; nesta baseline, um ThreadPoolTaskScheduler de uma thread executa uma limpeza por fixed delay e remove somente arquivos cujo uploadedAt ultrapassou a retenção.
```
