# 492 - M16.37 - Reprocessamento seguro

## Apresentação da aula

Na aula 491, você estudou CDC conceitualmente e diferenciou três posições importantes:

```text
posição na origem;

offset do record no Kafka;

offset confirmado pelo consumer group.
```

Também ficou claro que um sistema pode precisar reconstruir uma projeção, corrigir um processamento defeituoso ou aplicar uma nova regra sobre eventos históricos.

Essas situações exigem:

```text
replay;

reprocessamento.
```

Reprocessar não significa apenas:

```text
voltar o offset
e ligar o consumer novamente.
```

Essa ação pode repetir:

- cobrança;
- e-mail;
- criação de documento;
- chamada a parceiro;
- atualização de saldo;
- notificação;
- compensação;
- publicação de novos eventos;
- efeitos que já ocorreram corretamente.

A pergunta central desta aula será:

```text
como reler eventos históricos

com escopo conhecido,
efeitos controlados,
progresso persistente,
capacidade de interrupção

e evidência suficiente
para reconciliar o resultado?
```

A solução será construída como um processo operacional isolado do consumo normal.

O fluxo ficará:

```text
solicitação;

plano de replay;

captura de limites;

validação;

aprovação;

dry run;

shadow processing;

reconciliação;

decisão de encerramento.
```

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

A origem será o topic criado no laboratório de Outbox:

```text
m16.orders.outbox-lab.v1
```

O reprocessamento não alterará o group produtivo.

Ele utilizará:

```text
consumer isolado;

assign manual;

seek explícito;

start offset;

end offset exclusivo;

checkpoint no banco.
```

O reprocessamento terá dois modos:

```text
DRY_RUN:

lê, desserializa, valida
e contabiliza;

não altera projeções.

SHADOW:

lê, valida
e grava em uma projeção isolada;

não altera a projeção oficial.
```

O modo `LIVE` não será criado.

A promoção da projeção reconstruída precisa ser uma mudança operacional separada, com comparação, backup, janela e rollback.

Essa decisão evita transformar um endpoint de laboratório em uma ferramenta destrutiva.

Cada execução possuirá:

```text
runId;

reason;

requestedBy;

source topic;

mode;

status;

partition ranges;

rate limit;

counters;

timestamps;

audit trail.
```

O limite final de cada partition será capturado durante o planejamento.

Exemplo:

```text
partition 0:
start 120;
end exclusive 450.

partition 1:
start 98;
end exclusive 401.
```

Mesmo que novos records entrem no topic, a execução termina no limite planejado.

Isso impede que um replay histórico persiga indefinidamente o tráfego ao vivo.

O processo também será capaz de:

- pausar;
- retomar;
- cancelar;
- continuar após restart;
- registrar erro;
- limitar throughput;
- produzir relatório;
- reconciliar a shadow projection.

A aula reutilizará princípios anteriores:

```text
eventId estável;

idempotência;

Inbox;

Outbox;

poison handling;

offsets;

partitions;

consumer groups.
```

A próxima aula será:

```text
493 - M16.38 - Logs de correlacao em integracoes
```

Portanto, esta aula registrará `runId`, `eventId`, topic, partition e offset, mas não aprofundará ainda MDC, trace IDs ou propagação completa de correlação.

Ao final, você deverá explicar:

```text
a diferença entre retry,
redelivery e replay;

por que não resetar
o group produtivo;

por que o fim do replay
precisa ser imutável;

por que dry run vem antes;

por que shadow projection
é mais segura;

por que side effects
devem ser bloqueados;

por que checkpoint
não deve depender
do offset do group normal;

como pausar e retomar;

como reconciliar o resultado;

por que replay
continua at-least-once.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
489:
Inbox Pattern.

490:
Saga conceitual.

491:
CDC conceitual.

492:
Reprocessamento seguro.

493:
Logs de correlacao em integracoes.

494:
Monitoramento de integracoes.
```

A aula 491 respondeu:

```text
como capturar alterações
confirmadas no banco
por polling ou transaction log?
```

A aula 492 responderá:

```text
como usar dados históricos
para reconstruir ou corrigir
um processamento com segurança?
```

Nesta aula:

```text
retry:
diferenciado.

redelivery:
diferenciado.

replay:
sim.

plano persistente:
sim.

range por partition:
sim.

offset inicial:
sim.

offset final exclusivo:
sim.

dry run:
sim.

shadow projection:
sim.

checkpoint:
sim.

rate limit:
sim.

pause:
sim.

resume:
sim.

cancel:
sim.

reconciliation:
sim.

audit:
sim.

reset do group produtivo:
não.

efeitos externos:
não.

live projection:
não.

logs de correlação completos:
não.
```

A regra central será:

```text
reprocessamento é uma operação
planejada, limitada e auditável;

não uma alteração improvisada
de offsets em produção.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/kafka
└── replay
    ├── application
    │   ├── CreateReplayPlanCommand.java
    │   ├── ReplayPlanService.java
    │   ├── ReplayReconciliationService.java
    │   └── ReplayRunService.java
    ├── config
    │   └── ReplayConfiguration.java
    ├── domain
    │   ├── ReplayMode.java
    │   └── ReplayStatus.java
    ├── kafka
    │   ├── ReplayConsumerFactory.java
    │   ├── ReplayProcessor.java
    │   └── ReplayWorker.java
    ├── persistence
    │   ├── ReplayAuditEntity.java
    │   ├── ReplayAuditRepository.java
    │   ├── ReplayJobEntity.java
    │   ├── ReplayJobRepository.java
    │   ├── ReplayPartitionEntity.java
    │   ├── ReplayPartitionRepository.java
    │   ├── ReplayShadowOrderEntity.java
    │   └── ReplayShadowOrderRepository.java
    └── web
        ├── CreateReplayPlanRequest.java
        ├── ReplayController.java
        ├── ReplayPlanResponse.java
        └── ReplayStatusResponse.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/replay
├── ReplayPlanIntegrationTest.java
├── ReplayDryRunIntegrationTest.java
├── ReplayShadowIntegrationTest.java
├── ReplayPauseResumeTest.java
├── ReplayRateLimitTest.java
└── ReplayReconciliationTest.java
```

Você irá:

1. diferenciar retry, redelivery e replay;
2. definir motivos válidos de reprocessamento;
3. criar status da execução;
4. criar modos seguros;
5. criar plano persistente;
6. capturar partitions;
7. resolver offsets iniciais;
8. capturar offsets finais;
9. persistir ranges imutáveis;
10. criar consumer manual;
11. usar `assign`;
12. usar `seek`;
13. não alterar group produtivo;
14. persistir checkpoints;
15. implementar dry run;
16. implementar shadow projection;
17. bloquear efeitos externos;
18. limitar records por segundo;
19. pausar;
20. retomar;
21. cancelar;
22. sobreviver a restart;
23. registrar issues;
24. reconciliar;
25. produzir relatório;
26. executar testes;
27. commitar;
28. preparar logs de correlação.

---

## Conceito essencial

### Retry

Retry repete uma tentativa da mesma operação porque a falha pode ser transitória.

Exemplo:

```text
timeout de banco;

nova tentativa
alguns segundos depois.
```

O escopo normalmente é pequeno e próximo ao erro.

---

### Redelivery

Redelivery é a nova entrega de um record que não teve seu progresso confirmado.

Exemplo:

```text
efeito confirmou no banco;

consumer encerrou
antes do commit do offset;

Kafka entrega novamente.
```

Deduplicação protege o efeito.

---

### Replay

Replay é a leitura intencional de records históricos.

Motivos:

- corrigir bug de consumer;
- reconstruir projeção;
- criar nova projeção;
- recuperar dados apagados;
- aplicar regra corrigida;
- validar uma migração;
- preencher novo sistema;
- reconciliar divergência.

Replay é uma operação planejada.

---

### Reprocessamento

Reprocessamento é a aplicação de uma lógica sobre os records relidos.

É possível fazer replay sem aplicar efeito:

```text
DRY_RUN.
```

É possível aplicar em ambiente isolado:

```text
SHADOW.
```

A palavra replay descreve a releitura.

Reprocessamento descreve o trabalho executado.

---

### Motivo explícito

Uma execução precisa registrar:

```text
por que existe?
```

Exemplos válidos:

- `REBUILD_ORDER_PROJECTION`;
- `VALIDATE_CONSUMER_FIX`;
- `RECOVER_MISSING_RANGE`;
- `MIGRATE_READ_MODEL`.

Não use:

```text
teste;

corrigir coisa;

rodar de novo.
```

O motivo participa da auditoria.

---

### Group produtivo

O group produtivo representa o progresso normal da aplicação.

Resetá-lo pode:

- bloquear consumo ao vivo;
- repetir efeitos;
- misturar tráfego histórico e atual;
- alterar lag;
- provocar rebalance;
- dificultar rollback;
- perder referência operacional.

A baseline não altera esse group.

---

### Consumer isolado

O replay usa um consumer dedicado.

Ele não depende do committed offset produtivo.

A implementação utiliza:

```text
assign manual;

seek;
```

Com assign manual, o processo controla exatamente:

- partitions;
- início;
- fim;
- checkpoint.

---

### Start offset

O início pode ser resolvido por:

- offset explícito;
- timestamp;
- earliest;
- checkpoint anterior;
- evento conhecido.

A baseline da API aceitará:

```text
startTimestamp;
```

ou:

```text
startOffsets explícitos.
```

Quando um timestamp não encontra record em uma partition, o planner precisa aplicar uma policy explícita:

```text
usar end offset;

ou rejeitar.
```

Não invente offset.

---

### End offset exclusivo

O fim deve ser capturado durante o planejamento.

Exemplo:

```text
endOffsetExclusive = 450.
```

O último record elegível é:

```text
449.
```

Benefícios:

- execução finita;
- contagem previsível;
- reconciliação;
- repetibilidade;
- isolamento do tráfego novo.

---

### Range por partition

Não existe um único offset para o topic inteiro.

Cada partition possui:

```text
start;

endExclusive;

checkpoint.
```

O plano precisa armazenar todos.

---

### Checkpoint próprio

O replay persistirá:

```text
nextOffset.
```

Depois de processar o offset `120` com sucesso:

```text
nextOffset = 121.
```

No restart, o worker utiliza:

```text
seek(partition, nextOffset).
```

Ele não depende de commit no group produtivo.

---

### At-least-once no replay

Existe uma janela:

```text
efeito shadow confirmou;

checkpoint não confirmou.
```

O record pode ser processado novamente.

Por isso:

- `eventId` precisa ser preservado;
- shadow projection precisa ser idempotente;
- constraint única precisa existir;
- contadores precisam tolerar repetição.

---

### Dry run

Dry run deve:

- ler o range completo;
- desserializar;
- validar contrato;
- validar filtros;
- calcular contagens;
- registrar issues;
- medir throughput;
- não alterar projeção;
- não chamar serviço externo;
- não publicar novos eventos.

Um dry run verde não garante aplicação verde, mas reduz risco.

---

### Shadow projection

Shadow projection é uma estrutura separada.

Exemplo:

```text
replay_shadow_order.
```

A key pode ser:

```text
runId + orderId.
```

Isso permite comparar diferentes execuções.

Ela não substitui automaticamente a projeção oficial.

---

### Efeitos externos

Durante replay, são proibidos por padrão:

- envio de e-mail;
- SMS;
- cobrança;
- criação de entrega;
- chamada de parceiro;
- emissão fiscal;
- publicação em topic de negócio;
- compensação de saga.

O processor de replay deve usar uma porta específica que só admite efeitos seguros.

---

### Rate limit

Replay pode competir com:

- consumo ao vivo;
- banco;
- storage;
- rede;
- outros consumers;
- replicas;
- cache.

A baseline limitará:

```text
records por segundo.
```

O rate limit é por execução.

Ele não substitui monitoramento de infraestrutura.

---

### Pause

Pausa solicita que o worker:

1. conclua o record atual;
2. persista checkpoint;
3. libere recursos;
4. marque `PAUSED`.

Não interrompa uma transação no meio.

---

### Cancel

Cancelamento encerra a execução sem apagar histórico.

Ele não reverte efeitos shadow já aplicados.

Status:

```text
CANCELLED.
```

A limpeza da shadow projection é uma operação separada.

---

### Reconciliation

Reconciliation compara:

- total esperado;
- total lido;
- total válido;
- total inválido;
- total filtrado;
- total aplicado;
- total duplicado;
- partitions concluídas;
- checksum;
- contagem da projeção;
- amostras de divergência.

A execução só deve ser considerada validada depois da comparação.

---

### Reset de offsets

A ferramenta `kafka-consumer-groups` permite visualizar e alterar offsets de groups.

Ela pode ser útil em incidentes controlados.

Nesta baseline:

```text
preview:
permitido em runbook.

execute em group produtivo:
proibido sem manutenção,
aprovação e rollback.
```

O replay dedicado é a primeira opção.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Outbox, Inbox e deduplicação precisam continuar verdes.

---

### 2. Criar modos

Arquivo:

```text
ReplayMode.java
```

```java
package br.com.formacao.m16.kafka.replay.domain;

public enum ReplayMode {
    DRY_RUN,
    SHADOW
}
```

Não crie `LIVE`.

---

### 3. Criar status

Arquivo:

```text
ReplayStatus.java
```

```java
package br.com.formacao.m16.kafka.replay.domain;

public enum ReplayStatus {
    DRAFT,
    VALIDATED,
    APPROVED,
    RUNNING,
    PAUSE_REQUESTED,
    PAUSED,
    CANCEL_REQUESTED,
    CANCELLED,
    COMPLETED,
    FAILED
}
```

Transições precisam ser validadas.

---

### 4. Criar ReplayJobEntity

Campos mínimos:

```text
id;

reason;

requestedBy;

sourceTopic;

mode;

status;

maxRecordsPerSecond;

createdAt;

validatedAt;

approvedAt;

startedAt;

finishedAt;

lastError;

totalExpected;

totalRead;

totalValid;

totalInvalid;

totalApplied;

totalDuplicates.
```

Adicione:

```java
@Version
private long rowVersion;
```

O optimistic locking protege comandos concorrentes.

---

### 5. Criar ReplayPartitionEntity

Campos:

```text
id;

replayJobId;

partitionNumber;

startOffset;

endOffsetExclusive;

nextOffset;

recordsRead;

recordsValid;

recordsInvalid;

recordsApplied;

status;

updatedAt.
```

Constraint:

```text
unique (
    replay_job_id,
    partition_number
)
```

O range não deve mudar depois de `VALIDATED`.

---

### 6. Criar a shadow projection

```java
package br.com.formacao.m16.kafka.replay.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "replay_shadow_order",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_replay_shadow_run_event",
            columnNames = {
                "replay_job_id",
                "event_id"
            }
        )
    }
)
public class ReplayShadowOrderEntity {

    @Id
    private UUID id;

    @Column(name = "replay_job_id", nullable = false)
    private UUID replayJobId;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "order_id", nullable = false, length = 100)
    private String orderId;

    @Column(name = "customer_id", nullable = false, length = 100)
    private String customerId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal total;

    @Column(name = "source_partition", nullable = false)
    private int sourcePartition;

    @Column(name = "source_offset", nullable = false)
    private long sourceOffset;

    @Column(name = "applied_at", nullable = false)
    private Instant appliedAt;

    protected ReplayShadowOrderEntity() {
    }

    public ReplayShadowOrderEntity(
        UUID id,
        UUID replayJobId,
        UUID eventId,
        String orderId,
        String customerId,
        BigDecimal total,
        int sourcePartition,
        long sourceOffset,
        Instant appliedAt
    ) {
        this.id = id;
        this.replayJobId = replayJobId;
        this.eventId = eventId;
        this.orderId = orderId;
        this.customerId = customerId;
        this.total = total;
        this.sourcePartition = sourcePartition;
        this.sourceOffset = sourceOffset;
        this.appliedAt = appliedAt;
    }
}
```

A unique constraint torna a shadow idempotente por `runId + eventId`.

---

### 7. Criar request de plano

```java
package br.com.formacao.m16.kafka.replay.web;

import br.com.formacao.m16.kafka.replay.domain.ReplayMode;
import java.time.Instant;
import java.util.Map;

public record CreateReplayPlanRequest(
    String reason,
    String requestedBy,
    String sourceTopic,
    ReplayMode mode,
    Instant startTimestamp,
    Instant endTimestamp,
    Map<Integer, Long> explicitStartOffsets,
    Map<Integer, Long> explicitEndOffsetsExclusive,
    int maxRecordsPerSecond
) {
}
```

Não aceite topic arbitrário sem allowlist.

---

### 8. Criar allowlist

No `application.yaml`:

```yaml
app:
  replay:
    allowed-topics:
      - "m16.orders.outbox-lab.v1"

    default-max-records-per-second: 50
    absolute-max-records-per-second: 500
    poll-timeout-ms: 500
    max-poll-records: 100
```

O planner rejeita topic fora da lista.

---

### 9. Criar ReplayConsumerFactory

Use as properties do Kafka, mas force:

```text
enable.auto.commit:
false.

auto.offset.reset:
none.

key deserializer:
StringDeserializer.

value deserializer:
StringDeserializer.

isolation.level:
read_committed.
```

O group id pode ser:

```text
m16-safe-replay-<runId>.
```

Mesmo com group isolado, o checkpoint oficial do replay permanece no banco.

Não reutilize o group produtivo.

---

### 10. Resolver metadata do topic

O planner cria um consumer temporário e executa:

```java
List<PartitionInfo> partitions =
    consumer.partitionsFor(topic);
```

Converta para:

```java
TopicPartition.
```

Rejeite:

- topic inexistente;
- nenhuma partition;
- quantidade acima da política;
- topic fora da allowlist.

---

### 11. Resolver start offsets por timestamp

Para cada partition:

```java
Map<TopicPartition, Long> query =
    partitions.stream()
        .collect(
            Collectors.toMap(
                partition -> partition,
                ignored ->
                    startTimestamp.toEpochMilli()
            )
        );

Map<TopicPartition, OffsetAndTimestamp> resolved =
    consumer.offsetsForTimes(query);
```

Se o retorno for `null`, use uma policy explícita.

Na baseline:

```text
start = end offset atual.
```

Isso representa:

```text
nenhum record naquela partition
a partir do timestamp.
```

Registre a decisão no plano.

---

### 12. Resolver end offsets

Quando `endTimestamp` for informado, use `offsetsForTimes`.

Quando não for informado, capture:

```java
consumer.endOffsets(partitions);
```

O valor é exclusivo.

Depois de `VALIDATED`, ele não muda.

---

### 13. Validar ranges

Para cada partition:

```text
start >= beginningOffset;

start <= endExclusive;

endExclusive <= currentEndOffset
durante a validação;

expected = endExclusive - start.
```

Some `expected`.

Bloqueie ranges negativos.

---

### 14. Persistir o plano

O planner grava:

```text
ReplayJob:
DRAFT.

ReplayPartition:
ranges.
```

Depois de todas as validações:

```text
ReplayJob:
VALIDATED.
```

A criação não inicia a execução.

---

### 15. Aprovar

Endpoint:

```text
POST /api/v1/lab/kafka/replays/{runId}/approve
```

Aprovação exige:

- status `VALIDATED`;
- reason não vazio;
- requestedBy não vazio;
- total esperado conhecido;
- rate limit válido;
- nenhuma issue bloqueante.

No laboratório, a aprovação será um comando explícito.

Em produção, ela pode exigir segregação de funções.

---

### 16. Iniciar

Endpoint:

```text
POST /api/v1/lab/kafka/replays/{runId}/start
```

Transição:

```text
APPROVED -> RUNNING.
```

Não permita iniciar `DRAFT`.

---

### 17. Criar o ReplayWorker

O worker procura uma execução `RUNNING`.

Para cada partition incompleta:

1. cria `TopicPartition`;
2. faz `assign`;
3. executa `seek(nextOffset)`;
4. chama `poll`;
5. ignora records fora do range;
6. processa;
7. persiste checkpoint;
8. aplica rate limit;
9. verifica pause ou cancel.

Não leia além de `endOffsetExclusive`.

---

### 18. Criar ReplayProcessor

```java
package br.com.formacao.m16.kafka.replay.kafka;

import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import br.com.formacao.m16.kafka.replay.domain.ReplayMode;
import br.com.formacao.m16.kafka.replay.persistence.ReplayShadowOrderEntity;
import br.com.formacao.m16.kafka.replay.persistence.ReplayShadowOrderRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.UUID;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ReplayProcessor {

    private final ObjectMapper objectMapper;
    private final ReplayShadowOrderRepository repository;

    public ReplayProcessor(
        ObjectMapper objectMapper,
        ReplayShadowOrderRepository repository
    ) {
        this.objectMapper = objectMapper;
        this.repository = repository;
    }

    @Transactional
    public ProcessingResult process(
        UUID replayJobId,
        ReplayMode mode,
        ConsumerRecord<String, String> record
    ) {
        OrderCreatedIntegrationEventV1 event =
            deserialize(record.value());

        validate(event);

        if (mode == ReplayMode.DRY_RUN) {
            return ProcessingResult.valid();
        }

        try {
            repository.saveAndFlush(
                new ReplayShadowOrderEntity(
                    UUID.randomUUID(),
                    replayJobId,
                    event.eventId(),
                    event.orderId(),
                    event.customerId(),
                    event.total(),
                    record.partition(),
                    record.offset(),
                    Instant.now()
                )
            );

            return ProcessingResult.applied();
        } catch (
            DataIntegrityViolationException duplicate
        ) {
            return ProcessingResult.duplicate();
        }
    }

    private OrderCreatedIntegrationEventV1 deserialize(
        String payload
    ) {
        try {
            return objectMapper.readValue(
                payload,
                OrderCreatedIntegrationEventV1.class
            );
        } catch (JsonProcessingException exception) {
            throw new ReplayRecordException(
                "Replay payload is invalid",
                exception
            );
        }
    }

    private void validate(
        OrderCreatedIntegrationEventV1 event
    ) {
        if (!"orders.created.v1".equals(event.eventType())) {
            throw new ReplayRecordException(
                "Unsupported event type"
            );
        }

        if (event.eventVersion() != 1) {
            throw new ReplayRecordException(
                "Unsupported event version"
            );
        }
    }
}
```

`ProcessingResult` possui:

```text
VALID;

APPLIED;

DUPLICATE.
```

---

### 19. Tratar record inválido

A policy padrão será:

```text
STOP_ON_ERROR.
```

Quando um record inválido aparecer:

- registre runId;
- topic;
- partition;
- offset;
- exception class;
- mensagem limitada;
- hash do payload;
- status `FAILED`;
- checkpoint permanece no offset problemático.

Não grave payload completo sem avaliar dados sensíveis.

A retomada exige decisão explícita:

- corrigir o processor;
- criar nova execução;
- excluir offset por waiver documentado;
- tratar pela quarentena apropriada.

---

### 20. Persistir checkpoint

Depois de processar um record com sucesso:

```text
nextOffset = record.offset + 1.
```

Atualize na mesma transação do efeito shadow quando possível.

Se a shadow confirmar e o checkpoint falhar, a unique constraint reconhece a repetição.

---

### 21. Implementar rate limit

Use uma estratégia simples baseada em intervalo:

```text
intervalNanos =
1_000_000_000 / maxRecordsPerSecond.
```

Depois de cada record, aguarde apenas o necessário.

Não use `Thread.sleep` dentro de uma transação aberta.

O rate limit ocorre depois do commit do record.

---

### 22. Implementar pause

Endpoint:

```text
POST /api/v1/lab/kafka/replays/{runId}/pause
```

Transição:

```text
RUNNING -> PAUSE_REQUESTED.
```

O worker conclui o record atual e marca:

```text
PAUSED.
```

---

### 23. Implementar resume

Endpoint:

```text
POST /api/v1/lab/kafka/replays/{runId}/resume
```

Transição:

```text
PAUSED -> RUNNING.
```

O worker utiliza os `nextOffset` persistidos.

---

### 24. Implementar cancel

Endpoint:

```text
POST /api/v1/lab/kafka/replays/{runId}/cancel
```

Transição:

```text
RUNNING -> CANCEL_REQUESTED -> CANCELLED.
```

Não apague ranges, checkpoints, auditoria ou shadow projection.

---

### 25. Finalizar partitions

Uma partition termina quando:

```text
nextOffset >= endOffsetExclusive.
```

A execução termina quando todas terminarem.

Status:

```text
COMPLETED.
```

`COMPLETED` significa:

```text
range percorrido.
```

Não significa:

```text
resultado reconciliado e promovido.
```

---

### 26. Criar audit trail

Registre eventos:

- PLAN_CREATED;
- PLAN_VALIDATED;
- APPROVED;
- STARTED;
- PAUSE_REQUESTED;
- PAUSED;
- RESUMED;
- CANCEL_REQUESTED;
- CANCELLED;
- RECORD_ERROR;
- PARTITION_COMPLETED;
- COMPLETED;
- RECONCILIATION_CREATED.

Campos:

```text
runId;

action;

actor;

timestamp;

details resumidos.
```

---

### 27. Criar endpoint de status

```text
GET /api/v1/lab/kafka/replays/{runId}
```

Retorne:

- status;
- mode;
- topic;
- reason;
- expected;
- read;
- valid;
- invalid;
- applied;
- duplicates;
- records per second;
- partitions;
- next offsets;
- elapsed time;
- estimated remaining time quando calculável;
- last error.

Não retorne payloads.

---

### 28. Executar dry run

Crie um plano:

```json
{
  "reason": "VALIDATE_CONSUMER_FIX",
  "requestedBy": "backend-lab",
  "sourceTopic": "m16.orders.outbox-lab.v1",
  "mode": "DRY_RUN",
  "startTimestamp": "2026-07-12T00:00:00Z",
  "endTimestamp": "2026-07-13T00:00:00Z",
  "maxRecordsPerSecond": 25
}
```

Aprove e inicie.

Resultado esperado:

```text
shadow rows:
0.

valid:
igual ao número de eventos válidos.
```

---

### 29. Executar shadow replay

Crie outra execução com o mesmo range:

```text
mode:
SHADOW.
```

Resultado:

```text
replay_shadow_order:
uma linha por eventId.
```

Repita o mesmo run após um restart simulado.

A constraint impede duplicidade.

---

### 30. Reconciliar

O serviço de reconciliação calcula:

```text
expected records;

read records;

valid records;

invalid records;

shadow rows;

distinct eventIds;

duplicate count;

missing count;

checksum por campos estáveis.
```

Exemplo de checksum lógico:

```text
SHA-256(
    orderId
    + customerId
    + total normalizado
).
```

Não use hash como única evidência.

---

### 31. Comparar com projeção oficial

Quando existir uma projeção oficial comparável, gere:

- chaves apenas na live;
- chaves apenas na shadow;
- valores divergentes;
- total por status;
- total por dia;
- amostra limitada.

Não atualize a live automaticamente.

---

### 32. Inspecionar offsets sem alterar

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-dedup-v1"
```

Esse comando é somente observacional.

---

### 33. Criar preview de reset em runbook

Documente um exemplo de preview para um group não produtivo.

A execução real exige:

- consumer parado;
- range aprovado;
- backup dos offsets;
- `--execute` explícito;
- validação posterior.

O laboratório principal não usa reset.

---

### 34. Testar pause e resume

No teste:

1. crie 100 records;
2. limite para 10 records/s;
3. inicie;
4. solicite pause;
5. aguarde `PAUSED`;
6. capture checkpoints;
7. retome;
8. confirme continuidade;
9. confirme nenhuma linha duplicada na shadow.

---

### 35. Testar restart

1. execute parte do range;
2. encerre o worker;
3. recrie o contexto;
4. carregue `nextOffset`;
5. continue;
6. conclua;
7. reconcilie.

O estado não pode depender da memória.

---

### 36. Testar limite final

Publique novos records depois de o plano ser validado.

A execução não deve processá-los.

Ela termina nos `endOffsetExclusive` capturados.

---

### 37. Testar falha e correção

Inclua um record inválido no range.

Resultado:

```text
FAILED;

checkpoint no offset inválido;

issue persistida.
```

Depois de corrigir a fixture ou a regra, crie nova execução ou retome por procedimento aprovado.

Não pule silenciosamente.

---

### 38. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=ReplayPlanIntegrationTest,ReplayDryRunIntegrationTest,ReplayShadowIntegrationTest,ReplayPauseResumeTest,ReplayRateLimitTest,ReplayReconciliationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### Retry, redelivery e replay ficaram separados

Cada mecanismo ganhou causa e escopo próprios.

### O group produtivo foi preservado

O consumo normal não foi reposicionado.

### O range ficou imutável

A execução possui início e fim por partition.

### O fim exclusivo tornou o replay finito

Records novos não entram no plano antigo.

### O checkpoint ficou no banco

Restart não perde progresso.

### Dry run reduziu risco

Contratos e volume foram avaliados antes do efeito.

### Shadow projection isolou a aplicação

A reconstrução não alterou a visão oficial.

### Efeitos externos foram proibidos

Replay não envia mensagens reais ao cliente ou parceiro.

### Rate limit protegeu a plataforma

O replay não utiliza toda a capacidade disponível.

### Reconciliation fechou o processo

Completar offsets não basta; o resultado precisa ser comparado.

---

## Erros comuns importantes

### Resetar o group produtivo por conveniência

Mistura consumo histórico e atual.

### Não capturar o end offset

A execução pode nunca terminar.

### Usar um offset para o topic inteiro

Offsets pertencem às partitions.

### Processar live sem dry run

A primeira execução já produz efeitos.

### Reutilizar o consumer normal

Ele pode chamar integrações externas.

### Regenerar eventId

A deduplicação deixa de funcionar.

### Manter checkpoint só em memória

Restart reinicia do lugar errado.

### Atualizar checkpoint antes do efeito

Falha posterior perde o record.

### Fazer sleep dentro da transação

Conexões e locks ficam ocupados.

### Ignorar record inválido

A reconciliação fica incompleta.

### Considerar COMPLETED como promovido

Significa apenas que o range terminou.

### Apagar auditoria depois do cancel

A operação perde rastreabilidade.

---

## Comandos úteis

### Ver topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.outbox-lab.v1"
```

### Ver group produtivo

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-dedup-v1"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Ver artefatos de replay

```powershell
git grep `
  -n `
  -E `
  "ReplayStatus|ReplayMode|endOffsetExclusive|nextOffset|DRY_RUN|SHADOW"
```

---

## Exercício guiado

### Parte 1 — Plano

Crie motivo, topic e modo.

### Parte 2 — Ranges

Capture início e fim por partition.

### Parte 3 — Aprovação

Separe planejamento de execução.

### Parte 4 — Consumer

Use assign e seek.

### Parte 5 — Checkpoint

Persista nextOffset.

### Parte 6 — Dry run

Valide sem efeito.

### Parte 7 — Shadow

Reconstrua isoladamente.

### Parte 8 — Controle

Pause, retome e cancele.

### Parte 9 — Reconciliação

Compare contagens e valores.

### Parte 10 — Auditoria

Registre todo o lifecycle.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 491 foi preservada;
- retry foi definido;
- redelivery foi definido;
- replay foi definido;
- reprocessamento foi definido;
- retry foi diferenciado de replay;
- redelivery foi diferenciado de replay;
- motivo do replay foi registrado;
- group produtivo não foi resetado;
- consumer isolado foi criado;
- assign manual foi utilizado;
- seek explícito foi utilizado;
- topic allowlist foi criada;
- partitions foram descobertas;
- início foi resolvido por timestamp ou offset;
- fim foi resolvido por timestamp ou end offset;
- end offset foi tratado como exclusivo;
- ranges foram persistidos;
- ranges foram validados;
- ranges ficaram imutáveis após validação;
- expected count foi calculado;
- plan foi separado de start;
- aprovação explícita foi criada;
- modo DRY_RUN foi criado;
- modo SHADOW foi criado;
- modo LIVE não foi criado;
- shadow projection foi criada;
- constraint por runId e eventId foi criada;
- checkpoint nextOffset foi persistido;
- checkpoint foi atualizado depois do efeito;
- restart foi testado;
- execução continuou do checkpoint;
- rate limit foi criado;
- limite absoluto foi criado;
- pausa foi criada;
- pausa conclui o record atual;
- resume foi criado;
- cancel foi criado;
- cancel não apaga evidência;
- tráfego novo foi excluído pelo fim capturado;
- efeitos externos foram bloqueados;
- publicação de novos eventos foi bloqueada;
- erro de record foi persistido;
- payload completo não foi gravado automaticamente;
- policy STOP_ON_ERROR foi definida;
- invalid record não foi pulado silenciosamente;
- status lifecycle foi criado;
- optimistic locking foi considerado;
- audit trail foi criado;
- status endpoint foi criado;
- counters foram criados;
- partition progress foi exposto;
- COMPLETED foi diferenciado de reconciliado;
- reconciliação foi criada;
- contagens foram comparadas;
- distinct eventIds foram comparados;
- divergências foram amostradas;
- checksum foi contextualizado;
- live projection não foi alterada;
- reset de offsets foi tratado como exceção operacional;
- preview foi diferenciado de execute;
- consumer parado foi exigido para reset;
- dry run foi testado;
- shadow replay foi testado;
- pause e resume foram testados;
- rate limit foi testado;
- limite final foi testado;
- falha e restart foram testados;
- gate foi executado;
- logs de correlação não foram antecipados;
- monitoramento não foi aprofundado;
- commit recomendado está pronto;
- ponte para a aula 493 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure pontos críticos:

```powershell
git grep `
  -n `
  -E `
  "Replay|DRY_RUN|SHADOW|assign|seek|endOffsetExclusive|nextOffset|rate"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
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
git commit -m "feat(m16): implementar reprocessamento seguro"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- banco H2;
- diretório data;
- logs;
- target;
- payload real;
- credencial;
- reset de group produtivo;
- endpoint LIVE;
- side effect externo;
- promoção automática;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, replay deixou de ser uma alteração manual de offsets e virou um processo controlado.

O fluxo ficou:

```text
plan;

ranges por partition;

validation;

approval;

dry run;

shadow replay;

checkpoints;

pause/resume;

reconciliation;

audit.
```

Você comprovou que:

- retry, redelivery e replay são mecanismos diferentes;
- o group produtivo não precisa ser alterado;
- assign e seek permitem controle por partition;
- start e end precisam ser persistidos;
- end exclusivo impede perseguição do tráfego novo;
- checkpoint próprio permite restart;
- replay continua at-least-once;
- eventId e constraint protegem a shadow;
- dry run vem antes do efeito;
- shadow projection evita mutação direta da live;
- efeitos externos devem permanecer desabilitados;
- rate limit protege banco e broker;
- cancelamento não apaga auditoria;
- completar o range não substitui reconciliação;
- reset de offset produtivo é uma operação excepcional.

A próxima aula será:

```text
493 - M16.38 - Logs de correlacao em integracoes
```

Nela, você irá:

- definir correlation ID;
- definir causation ID;
- propagar IDs em HTTP e mensageria;
- utilizar MDC;
- criar logs estruturados;
- relacionar request, outbox, Kafka, inbox e replay;
- evitar dados sensíveis;
- padronizar nomes;
- limpar contexto entre threads;
- testar propagação;
- preparar monitoramento de integrações.

A aula atual registrou IDs mínimos, mas não antecipou a implementação completa de correlação.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei retry, redelivery e replay.
- [ ] Preservei o group produtivo.
- [ ] Criei ranges por partition.
- [ ] Criei dry run e shadow replay.
- [ ] Persistei checkpoints.
- [ ] Implementei pause, resume e cancel.
- [ ] Reconciliei resultados.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Replay começa no offset errado

Revise timestamp, timezone, beginning offset e policy para `null` em `offsetsForTimes`.

### Replay não termina

Confirme `endOffsetExclusive` capturado no planejamento.

### Records novos aparecem na execução

O worker está usando o end offset atual em vez do valor persistido.

### Restart relê tudo

`nextOffset` não foi persistido ou o worker executou `seek(startOffset)`.

### Shadow possui duplicatas

Confirme constraint por replayJobId e eventId.

### Group produtivo mudou

Algum código reutilizou o group normal ou executou reset.

### Dry run alterou banco de negócio

O processor não separou modo e porta de efeito.

### Rate limit não funciona

O controle pode estar dentro da transação ou usando unidade incorreta.

### Pause fica pendente

O worker pode estar em poll longo ou processamento bloqueante.

### COMPLETED possui divergência

Finalize como range concluído, mas mantenha a reconciliação reprovada e não promova dados.

---

## Perguntas de revisão

1. O que é retry?
2. O que é redelivery?
3. O que é replay?
4. O que é reprocessamento?
5. Por que não resetar o group produtivo?
6. O que é consumer isolado?
7. Para que servem assign e seek?
8. O start offset pertence a quê?
9. O end offset pertence a quê?
10. Por que o fim é exclusivo?
11. O que é dry run?
12. O que é shadow projection?
13. Por que não criar modo LIVE?
14. O que é checkpoint?
15. Por que replay é at-least-once?
16. Para que serve rate limit?
17. O que pause deve garantir?
18. O que reconciliation verifica?
19. Logs de correlação foram implementados?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Nova tentativa de falha transitória.
2. Nova entrega sem progresso confirmado.
3. Leitura histórica intencional.
4. Aplicação de lógica sobre o replay.
5. Evitar efeitos e impacto no consumo normal.
6. Consumer dedicado ao replay.
7. Controlar partitions e posições.
8. A cada partition.
9. A cada partition.
10. Tornar a execução finita.
11. Validação sem efeito.
12. Projeção isolada.
13. Evitar mutação destrutiva.
14. Próximo offset persistido.
15. Efeito pode confirmar antes do checkpoint.
16. Proteger a plataforma.
17. Terminar record e salvar progresso.
18. Contagens, chaves e divergências.
19. Não.
20. Logs de correlacao em integracoes.

---

## Desafio opcional

Crie um replay para:

```text
m16.orders.inbox-lab.v1
```

Objetivo:

```text
reconstruir uma projeção
de pedidos recebidos.
```

Requisitos:

- topic allowlisted;
- range por timestamp;
- end offset capturado;
- dry run;
- shadow table própria;
- eventId preservado;
- rate limit;
- pause e resume;
- record inválido para a execução;
- reconciliação;
- nenhuma chamada externa;
- nenhum reset do group produtivo.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 492 - M16.37 - Reprocessamento seguro

- Continuei após CDC conceitual.
- Diferenciei retry, redelivery e replay.
- Diferenciei replay e reprocessamento.
- Registrei motivo explícito da execução.
- Preservei o consumer group produtivo.
- Criei consumer isolado.
- Utilizei assign manual.
- Utilizei seek explícito.
- Criei allowlist de topics.
- Descobri partitions do topic.
- Resolvi start offsets por timestamp ou valor explícito.
- Capturei end offsets exclusivos.
- Persistei ranges por partition.
- Tornei os ranges imutáveis após validação.
- Calculei quantidade esperada.
- Separei planejamento, validação, aprovação e execução.
- Criei modo DRY_RUN.
- Criei modo SHADOW.
- Não criei modo LIVE.
- Criei shadow projection isolada.
- Adicionei unique constraint por runId e eventId.
- Persistei nextOffset como checkpoint.
- Atualizei checkpoint depois do processamento.
- Mantive o replay at-least-once.
- Testei restart e retomada.
- Implementei rate limit.
- Implementei pause.
- Implementei resume.
- Implementei cancel.
- Mantive auditoria após cancelamento.
- Bloqueei efeitos externos.
- Bloqueei publicação de novos eventos.
- Defini STOP_ON_ERROR.
- Registrei record inválido sem pular silenciosamente.
- Criei counters e progresso por partition.
- Diferenciei COMPLETED de reconciliado.
- Comparei expected, read, valid e applied.
- Comparei eventIds e divergências.
- Mantive a live projection inalterada.
- Tratei reset de offset produtivo como exceção operacional.
- Testei dry run, shadow, rate limit, pause, resume e limite final.
- Não antecipei logs de correlação completos.
- Próxima aula: Logs de correlacao em integracoes.
```

---

## Referência técnica curta

- Apache Kafka — Consumer Groups.
- Apache Kafka — Consumer Position.
- Apache Kafka — `assign` and `seek`.
- Apache Kafka — `offsetsForTimes`.
- Apache Kafka — Beginning and End Offsets.
- Apache Kafka — Consumer Group Offset Reset.
- Spring Kafka — Consumer Configuration.
- Spring Kafka — Pausing and Resuming Listener Containers.
- Enterprise Integration Patterns — Idempotent Receiver.
- Operational patterns for replay and backfill.

Regra final:

```text
reprocessamento seguro transforma replay em uma operação planejada e auditável: retry repete uma falha transitória, redelivery repete uma entrega sem progresso confirmado e replay relê intencionalmente um histórico; o group produtivo permanece intacto, enquanto um consumer isolado usa assign e seek sobre ranges persistidos por partition; start e endOffsetExclusive tornam o escopo determinístico e finito, e nextOffset funciona como checkpoint para pause, resume e restart; DRY_RUN valida sem efeitos, SHADOW reconstrói uma projeção isolada e o modo LIVE permanece proibido; eventId, constraints e idempotência protegem a semântica at-least-once; rate limit protege a plataforma, records inválidos interrompem a execução por padrão e a conclusão do range só é aceita depois de reconciliação, auditoria e decisão operacional.
```
