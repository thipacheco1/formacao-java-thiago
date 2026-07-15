# 654 - M19.44 - Transacoes distribuidas e Saga revisitada

## Apresentação da aula

Na aula 653, você diagnosticou anti-patterns de microserviços. Você mapeou dependências, banco compartilhado, writes cruzados, releases em lockstep, cadeias síncronas, ciclos de eventos, bibliotecas comuns e ownership incompleto. Um dos sinais mais críticos foi a tentativa de executar uma única intenção de negócio atravessando vários serviços como se todos compartilhassem a mesma transação.

Agora esse problema será tratado de forma explícita.

Considere a confirmação de um `Appointment` em `Service Scheduling`. Para concluir a intenção, o sistema precisa reservar capacidade, preparar a execução de campo, confirmar o agendamento e comunicar o cliente. Cada responsabilidade pode estar em um boundary diferente, com banco, transação, disponibilidade e ciclo de deploy próprios.

A intenção é única:

```text
confirmar o Appointment
com capacidade reservada,
execução preparada
e comunicação solicitada.
```

A execução, porém, é distribuída.

Não existe um `BEGIN` que abra transações em todos os bancos e um `COMMIT` simples que torne tudo atomicamente verdadeiro. Mesmo quando uma tecnologia oferece coordenação distribuída, ela traz disponibilidade, latência, acoplamento operacional e recuperação complexa que precisam ser justificadas.

Na aula 490, você estudou Saga conceitualmente. Definiu participantes, passos, comandos, eventos, compensações, estados, timeout, retry, idempotência, orquestração e coreografia. Nesta aula, esses conceitos serão revisitados em nível arquitetural e executável.

Você construirá uma saga orquestrada com:

```text
máquina de estados persistente;

transações locais;

Outbox e Inbox;

comandos e respostas idempotentes;

leases e versionamento;

timeouts ambíguos;

consulta de estado remoto;

compensações em ordem inversa;

pivot transaction;

passos retriable;

reconciliation;

intervenção manual;

reports, evidence e gate.
```

O laboratório será:

```text
labs/m19/aula-654-transacoes-distribuidas-saga-revisitada/service-scheduling-saga
```

A próxima aula será:

```text
655 - M19.45 - Observabilidade como decisao arquitetural
```

A aula 655 aprofundará como telemetria, SLOs, cardinalidade, tracing, dashboards e alertas influenciam o desenho da arquitetura. Nesta aula, observabilidade aparecerá apenas no nível necessário para operar a saga.

Regra central:

```text
uma saga não torna
vários bancos atomicamente únicos;

ela torna explícita,
persistente, idempotente
e recuperável
a coordenação de uma intenção
de negócio distribuída.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
652:
Microservicos com criterio.

653:
Anti patterns de microservicos.

654:
Transacoes distribuidas e Saga revisitada.

655:
Observabilidade como decisao arquitetural.

656:
Seguranca como decisao arquitetural.
```

A progressão é:

```text
decidir quando distribuir;

identificar distribuição inadequada;

coordenar consistência entre fronteiras;

tornar a arquitetura observável;

incorporar segurança às decisões.
```

Esta aula não repete a introdução da aula 490. O foco agora é transformar a modelagem conceitual em um mecanismo executável, testável e operável para `Service Scheduling`.

Também não será instalado um workflow engine real. A implementação será Java 21 com componentes em memória e contratos explícitos, suficientes para demonstrar persistência, concorrência, mensagens at-least-once, recovery e compensação.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-654-transacoes-distribuidas-saga-revisitada/service-scheduling-saga
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/saga
│   ├── domain
│   ├── command
│   ├── event
│   ├── orchestration
│   ├── persistence
│   ├── participant
│   ├── recovery
│   └── observability
├── src/test/java/br/com/formacao/saga
│   ├── orchestration
│   ├── participant
│   ├── recovery
│   └── architecture
├── saga
├── contracts
└── reports
```

Os diretórios conterão state machine, comandos, replies, repositories, participantes, recovery, políticas, reports e gate.

Scripts:

```text
scripts/m19/service-scheduling-saga
├── validate-saga-contract.ps1
├── validate-state-machine.ps1
├── validate-step-classification.ps1
├── validate-timeout-policy.ps1
├── validate-compensation-policy.ps1
├── validate-recovery-policy.ps1
├── run-saga-tests.ps1
├── collect-saga-evidence.ps1
└── verify-saga-gate.ps1
```

---

## Conceito essencial

### Transação distribuída não é apenas uma transação longa

Uma transação local protege invariantes dentro de um boundary. Uma intenção distribuída atravessa boundaries e precisa lidar com confirmação parcial, falha de comunicação, respostas duplicadas, resultados tardios e participantes indisponíveis.

O problema não é apenas técnico. Durante a janela de execução, o negócio pode observar estados intermediários:

```text
capacidade reservada;

execução ainda não preparada;

Appointment ainda não confirmado.
```

Esses estados precisam ser legítimos, visíveis internamente e protegidos contra ações incompatíveis.

### 2PC e Saga resolvem problemas diferentes

Two-Phase Commit coordena participantes para votar antes de uma decisão global. Pode oferecer atomicidade forte, mas aumenta acoplamento, bloqueio, dependência do coordenador e sensibilidade a falhas. Não é proibido; precisa ser compatível com infraestrutura, latência, disponibilidade e operação.

Saga aceita que transações locais confirmem em momentos diferentes. Ela usa passos, compensações, retries e estados intermediários para alcançar consistência de negócio.

A escolha não deve ser religiosa. Pergunte:

```text
os participantes suportam o protocolo?

qual é o custo de bloqueio?

qual disponibilidade é necessária?

a compensação é semanticamente possível?

o fluxo precisa atravessar serviços autônomos?

como será feita a recuperação?
```

### Compensação não apaga o passado

`ReleaseCapacity` não desfaz tecnicamente a transação `ReserveCapacity`. Ele cria uma nova transação que altera o estado de `RESERVED` para `RELEASED`.

Entre esses momentos, a reserva existiu. Logs, eventos, auditoria e efeitos externos também existiram. A compensação precisa ser idempotente e pode falhar.

### Pivot muda a estratégia de falha

Antes do pivot, a saga pode abandonar a intenção e compensar passos confirmados. Depois do pivot, o negócio normalmente exige conclusão por retry ou intervenção.

No laboratório:

```text
ReserveCapacity:
compensable.

PrepareFieldExecution:
compensable.

ConfirmAppointment:
pivot local no Scheduling Service.

NotifyAppointmentConfirmed:
retriable.
```

A notificação ocorre depois do pivot porque não existe rollback real de uma mensagem já recebida pelo cliente.

### Timeout é ambíguo

Quando um comando expira, o orquestrador sabe apenas que não recebeu uma resposta dentro do prazo. O participante pode ter:

```text
não recebido;

recebido e falhado;

confirmado e perdido a resposta;

confirmado e atrasado a publicação;

publicado e a mensagem estar parada.
```

Por isso, timeout não inicia compensação automaticamente em todos os casos. Primeiro, a policy define retry, consulta de status, espera adicional, reconciliação ou compensação.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-654-transacoes-distribuidas-saga-revisitada/service-scheduling-saga

Set-Location `
  labs/m19/aula-654-transacoes-distribuidas-saga-revisitada/service-scheduling-saga
```

### 2. Criar Saga Charter

Arquivo:

```text
saga/SAGA_CHARTER.md
```

Conteúdo:

```markdown
# Confirmation Saga Charter

Intenção:

Confirmar um Appointment
com capacidade reservada,
execução preparada
e comunicação solicitada.

Coordenador:

Service Scheduling.

Participantes:

- Capacity;
- Field Execution;
- Customer Communication.

Modelo:

Saga orquestrada
com mensagens assíncronas.

Garantias:

- transações locais;
- Outbox;
- Inbox;
- idempotência;
- state machine persistente;
- timeout explícito;
- compensação;
- reconciliation;
- intervenção manual.

Não garantido:

- ACID global;
- exactly-once;
- rollback global;
- resposta instantânea.
```

### 3. Criar contrato principal

Arquivo:

```text
contracts/saga-contract.yaml
```

Conteúdo:

```yaml
saga:
  context:
    Service-Scheduling

  type:
    orchestrated

  required:
    - persistent-state
    - local-transactions
    - versioned-transitions
    - outbox-per-writer
    - inbox-per-consumer
    - stable-message-id
    - idempotent-participants
    - explicit-timeout
    - compensation-plan
    - reconciliation
    - manual-intervention
    - tests
    - evidence
    - gate

  forbidden:
    - global-transaction-assumption
    - memory-only-state
    - timeout-as-certain-failure
    - compensation-without-idempotency
    - mark-completed-before-pivot
    - blind-replay
    - silent-manual-fix
    - observability-architecture-deep-dive

  nextLesson:
    code:
      M19.45
```

### 4. Catalogar participantes

Arquivo:

```text
saga/PARTICIPANT_CATALOG.md
```

Registre:

| Participante | Autoridade | Comando principal | Compensação |
|---|---|---|---|
| Scheduling | Appointment e Saga | ConfirmAppointment | política pós-pivot |
| Capacity | CapacityReservation | ReserveCapacity | ReleaseCapacity |
| Field Execution | FieldPreparation | PrepareFieldExecution | CancelFieldPreparation |
| Communication | NotificationRequest | NotifyAppointmentConfirmed | correção semântica |

Cada participante confirma apenas sua transação local.

### 5. Criar identificadores fortes

```java
public record SagaId(UUID value) {

    public SagaId {
        Objects.requireNonNull(value);
    }

    public static SagaId newId() {
        return new SagaId(UUID.randomUUID());
    }
}
```

```java
public record AppointmentId(UUID value) {

    public AppointmentId {
        Objects.requireNonNull(value);
    }
}
```

Não use `appointmentId` como único identificador da saga. Um Appointment pode participar de confirmação, cancelamento, reagendamento ou recuperação distintas.

### 6. Criar status da saga

```java
public enum SagaStatus {
    STARTED,
    WAITING_CAPACITY,
    WAITING_FIELD_PREPARATION,
    READY_TO_CONFIRM,
    CONFIRMED,
    WAITING_NOTIFICATION,
    COMPENSATING_FIELD,
    COMPENSATING_CAPACITY,
    COMPENSATED,
    COMPLETED,
    FAILED_MANUAL
}
```

`CONFIRMED` representa que o pivot local foi confirmado. `COMPLETED` representa que o passo retriable posterior também terminou.

### 7. Criar passos e classificação

```java
public enum SagaStep {
    RESERVE_CAPACITY,
    PREPARE_FIELD_EXECUTION,
    CONFIRM_APPOINTMENT,
    NOTIFY_CUSTOMER,
    CANCEL_FIELD_PREPARATION,
    RELEASE_CAPACITY
}
```

Arquivo:

```text
saga/STEP_CLASSIFICATION.md
```

Registre:

```text
RESERVE_CAPACITY:
compensable.

PREPARE_FIELD_EXECUTION:
compensable.

CONFIRM_APPOINTMENT:
pivot.

NOTIFY_CUSTOMER:
retriable.

CANCEL_FIELD_PREPARATION:
compensation.

RELEASE_CAPACITY:
compensation.
```

### 8. Criar versão otimista

```java
public record SagaVersion(long value) {

    public SagaVersion {
        if (value < 0) {
            throw new IllegalArgumentException(
                    "Saga version must not be negative");
        }
    }

    public SagaVersion next() {
        return new SagaVersion(value + 1);
    }
}
```

A versão impede que dois workers avancem a mesma saga com decisões concorrentes.

### 9. Criar estado persistente

```java
public record ConfirmationSaga(
        SagaId sagaId,
        AppointmentId appointmentId,
        SagaStatus status,
        SagaStep currentStep,
        SagaVersion version,
        Set<SagaStep> confirmedSteps,
        Instant deadline,
        String lastMessageId,
        SagaFailure failure,
        Instant updatedAt) {

    public ConfirmationSaga {
        Objects.requireNonNull(sagaId);
        Objects.requireNonNull(appointmentId);
        Objects.requireNonNull(status);
        Objects.requireNonNull(currentStep);
        Objects.requireNonNull(version);
        confirmedSteps = Set.copyOf(confirmedSteps);
        Objects.requireNonNull(deadline);
        Objects.requireNonNull(updatedAt);
    }
}
```

O estado registra apenas metadados necessários. Payloads sensíveis continuam nos boundaries proprietários.

### 10. Criar transições explícitas

```java
public record SagaTransition(
        SagaStatus from,
        SagaStatus to,
        SagaStep causedBy) {
}
```

A máquina de estados deve rejeitar qualquer transição não catalogada.

### 11. Criar State Machine

```java
public final class SagaStateMachine {

    private final Set<SagaTransition> allowed;

    public ConfirmationSaga move(
            ConfirmationSaga saga,
            SagaStatus target,
            SagaStep causedBy,
            Instant now) {

        SagaTransition transition =
                new SagaTransition(
                        saga.status(),
                        target,
                        causedBy);

        if (!allowed.contains(transition)) {
            throw new IllegalStateException(
                    "Invalid saga transition");
        }

        return new ConfirmationSaga(
                saga.sagaId(),
                saga.appointmentId(),
                target,
                causedBy,
                saga.version().next(),
                saga.confirmedSteps(),
                saga.deadline(),
                saga.lastMessageId(),
                saga.failure(),
                now);
    }
}
```

Não espalhe `if` de transição pelos consumers.

### 12. Criar repositório com compare-and-set

```java
public interface SagaRepository {

    Optional<ConfirmationSaga> find(
            SagaId sagaId);

    boolean replaceIfVersion(
            ConfirmationSaga next,
            SagaVersion expectedVersion);
}
```

O worker carrega versão 7, produz versão 8 e salva somente se a versão atual ainda for 7. Se outro worker venceu, ele recarrega e reavalia.

### 13. Criar envelope de comando

```java
public sealed interface SagaCommand
        permits ReserveCapacity,
                PrepareFieldExecution,
                ReleaseCapacity,
                CancelFieldPreparation,
                NotifyAppointmentConfirmed {

    UUID messageId();

    SagaId sagaId();

    AppointmentId appointmentId();

    UUID causationId();

    Instant occurredAt();
}
```

Cada retry técnico preserva `messageId`. Uma nova decisão produz novo ID.

### 14. Criar ReserveCapacity

```java
public record ReserveCapacity(
        UUID messageId,
        SagaId sagaId,
        AppointmentId appointmentId,
        UUID causationId,
        Instant occurredAt,
        UUID reservationId,
        Instant startsAt,
        Instant endsAt)
        implements SagaCommand {
}
```

`reservationId` é a chave idempotente de negócio do Capacity Service.

### 15. Criar reply comum

```java
public sealed interface SagaReply
        permits CapacityReserved,
                CapacityReservationFailed,
                FieldExecutionPrepared,
                FieldExecutionPreparationFailed,
                CapacityReleased,
                FieldPreparationCancelled,
                CustomerNotified {

    UUID messageId();

    UUID commandMessageId();

    SagaId sagaId();

    Instant occurredAt();
}
```

`commandMessageId` permite relacionar resposta e comando. `messageId` sustenta Inbox e deduplicação do reply.

### 16. Unir estado e Outbox na transação local

No Scheduling Service, iniciar a saga deve executar na mesma transação local:

```text
insert saga;

insert outbox ReserveCapacity;

commit.
```

Código conceitual:

```java
@Transactional
public SagaId start(
        StartConfirmation request) {

    ConfirmationSaga saga =
            factory.start(request);

    sagaRepository.insert(saga);

    outboxRepository.append(
            OutboxMessage.from(
                    commandFactory.reserveCapacity(saga)));

    return saga.sagaId();
}
```

Se o processo cair após o commit, o relay publica depois. Se cair antes, nem saga nem mensagem existem.

### 17. Participante com Inbox e transação local

O Capacity Service recebe `ReserveCapacity`:

```java
@Transactional
public void handle(
        ReserveCapacity command) {

    if (inboxRepository.exists(
            command.messageId())) {
        return;
    }

    capacityReservationService.reserve(
            command.reservationId(),
            command.appointmentId(),
            command.startsAt(),
            command.endsAt());

    inboxRepository.markProcessed(
            command.messageId());

    outboxRepository.append(
            CapacityReserved.from(command));
}
```

A reserva, Inbox e resposta Outbox precisam confirmar juntas.

### 18. Não confundir duplicação com concorrência

Inbox evita processar duas vezes a mesma mensagem. Ela não impede duas sagas diferentes de disputarem a mesma capacidade.

A invariante de capacidade precisa de constraint, lock otimista, lock pessimista ou serialização por chave. Idempotência não substitui concorrência de negócio.

### 19. Criar orquestrador

```java
public final class ConfirmationSagaOrchestrator {

    private final SagaRepository sagaRepository;
    private final SagaStateMachine stateMachine;
    private final OutboxRepository outboxRepository;

    public void on(
            CapacityReserved reply,
            Instant now) {

        ConfirmationSaga current =
                sagaRepository.find(
                                reply.sagaId())
                        .orElseThrow();

        SagaDecision decision =
                decideCapacityReserved(
                        current,
                        reply,
                        now);

        persistDecision(
                current,
                decision);
    }
}
```

O consumer deve carregar estado, decidir, salvar transição e criar próximo comando atomicamente no banco do orquestrador.

### 20. Criar Saga Decision

```java
public record SagaDecision(
        ConfirmationSaga nextState,
        List<SagaCommand> commands,
        List<SagaAuditEntry> auditEntries) {

    public SagaDecision {
        commands = List.copyOf(commands);
        auditEntries = List.copyOf(auditEntries);
    }
}
```

Separar decisão de persistência facilita testes determinísticos.

### 21. Tratar reply duplicado

Se `CapacityReserved` chegar novamente e a saga já estiver em `WAITING_FIELD_PREPARATION`, o reply deve ser reconhecido como duplicado ou tardio compatível.

Ele não pode emitir outro `PrepareFieldExecution`.

A proteção usa:

```text
Inbox do orquestrador;

estado atual;

commandMessageId esperado;

versionamento.
```

### 22. Tratar reply fora de ordem

Se `FieldExecutionPrepared` chegar antes de `CapacityReserved`, existe erro de contrato, replay incorreto ou mensagem pertencente a outra instância.

A policy deve:

```text
não avançar;

quarentenizar ou registrar finding;

preservar mensagem;

abrir investigação.
```

Não force uma transição apenas porque o payload parece válido.

### 23. Confirmar o pivot local

Quando capacidade e preparação estiverem confirmadas, o Scheduling Service executa localmente:

```text
update Appointment to CONFIRMED;

update saga to CONFIRMED;

insert AppointmentConfirmed event;

insert NotifyAppointmentConfirmed command;

commit.
```

Tudo acontece na mesma transação do Scheduling Service.

### 24. Criar política de pivot

Arquivo:

```text
contracts/transition-policy.yaml
```

Conteúdo:

```yaml
pivot:
  step:
    CONFIRM_APPOINTMENT

  prerequisites:
    - capacity-reserved
    - field-execution-prepared
    - appointment-version-valid
    - no-cancellation-in-progress

  localTransaction:
    requires:
      - appointment-update
      - saga-transition
      - domain-event-outbox
      - notification-command-outbox

  afterPivot:
    compensationToPrePivotState:
      forbidden

  remainingSteps:
    mode:
      RETRY_UNTIL_SUCCESS_OR_MANUAL
```

### 25. Modelar falhas antes do pivot

Se a reserva de capacidade falhar permanentemente, nenhum passo foi confirmado. A saga termina compensada sem comando adicional.

Se a preparação de campo falhar após a reserva, o plano é:

```text
CancelFieldPreparation:
não necessário,
pois preparação não confirmou.

ReleaseCapacity:
necessário.
```

O plano usa apenas passos presentes em `confirmedSteps`.

### 26. Criar Compensation Planner

```java
public final class CompensationPlanner {

    public List<SagaCommand> plan(
            ConfirmationSaga saga,
            UUID causationId,
            Instant now) {

        List<SagaCommand> commands =
                new ArrayList<>();

        if (saga.confirmedSteps()
                .contains(
                        SagaStep.PREPARE_FIELD_EXECUTION)) {
            commands.add(
                    cancelFieldPreparation(
                            saga,
                            causationId,
                            now));
        }

        if (saga.confirmedSteps()
                .contains(
                        SagaStep.RESERVE_CAPACITY)) {
            commands.add(
                    releaseCapacity(
                            saga,
                            causationId,
                            now));
        }

        return List.copyOf(commands);
    }
}
```

A execução deve respeitar ordem inversa e confirmação de cada compensação.

### 27. Compensar sequencialmente

Não envie todas as compensações em paralelo por padrão. `CancelFieldPreparation` pode depender de a preparação ainda possuir a reserva associada. A policy define ordem, timeout e efeito de falha.

Fluxo:

```text
COMPENSATING_FIELD;

FieldPreparationCancelled;

COMPENSATING_CAPACITY;

CapacityReleased;

COMPENSATED.
```

### 28. Tornar compensações idempotentes

`ReleaseCapacity` usa `reservationId` estável. Se a reserva já estiver `RELEASED`, o participante retorna sucesso idempotente.

Ele não deve criar nova capacidade, apagar histórico ou falhar apenas porque a primeira tentativa já concluiu.

### 29. Definir política de timeout

Arquivo:

```text
saga/TIMEOUT_POLICY.md
```

Registre por passo:

| Passo | Deadline | Primeira ação | Depois |
|---|---:|---|---|
| ReserveCapacity | 5 s | retry seguro | consultar estado |
| PrepareFieldExecution | 15 s | consultar estado | compensar |
| NotifyCustomer | 60 s | retry com backoff | manual após limite |
| ReleaseCapacity | 30 s | retry | alerta crítico |

Timeout de negócio e timeout de transporte devem ser separados.

### 30. Criar Timeout Decision Service

```java
public final class TimeoutDecisionService {

    public TimeoutAction decide(
            ConfirmationSaga saga,
            Instant now) {

        if (now.isBefore(saga.deadline())) {
            return TimeoutAction.none();
        }

        return switch (saga.currentStep()) {
            case RESERVE_CAPACITY ->
                    TimeoutAction.queryThenRetry();
            case PREPARE_FIELD_EXECUTION ->
                    TimeoutAction.queryThenCompensate();
            case NOTIFY_CUSTOMER ->
                    TimeoutAction.retryAfterPivot();
            case RELEASE_CAPACITY,
                 CANCEL_FIELD_PREPARATION ->
                    TimeoutAction.retryCompensation();
            default ->
                    TimeoutAction.manualReview();
        };
    }
}
```

### 31. Consultar estado antes de compensar

Após timeout em `ReserveCapacity`, o orquestrador consulta por `reservationId`.

Resultados:

```text
RESERVED:
tratar como sucesso.

REJECTED:
tratar como falha.

NOT_FOUND:
retry do comando.

UNKNOWN:
aguardar ou reconciliar.
```

A consulta também precisa de autorização, timeout e observabilidade.

### 32. Tratar resposta tardia

Se a saga já iniciou compensação e chega `FieldExecutionPrepared`, o orquestrador não volta ao fluxo de avanço.

Ele registra a resposta tardia e garante que `CancelFieldPreparation` faça parte do plano compensatório.

A máquina de estados preserva a decisão atual.

### 33. Criar leases para workers

```java
public record SagaLease(
        SagaId sagaId,
        String owner,
        Instant expiresAt,
        long fencingToken) {
}
```

O lease evita processamento simultâneo prolongado. O fencing token impede que um worker antigo, retomando após pausa, sobrescreva um worker mais novo.

### 34. Criar Saga Worker

```java
public final class SagaWorker {

    public RecoveryResult recover(
            ConfirmationSaga saga,
            SagaLease lease,
            Instant now) {

        requireCurrentFencingToken(lease);

        TimeoutAction action =
                timeoutDecisionService.decide(
                        saga,
                        now);

        return recoveryExecutor.execute(
                saga,
                action,
                lease);
    }
}
```

Lease não substitui compare-and-set. Use ambos.

### 35. Definir failure matrix

Arquivo:

```text
saga/FAILURE_MATRIX.md
```

Inclua:

```text
orchestrator crashes before commit:
no state change.

orchestrator crashes after commit:
Outbox publishes later.

participant receives duplicate:
Inbox returns prior outcome.

participant commits but reply is delayed:
query status before compensation.

compensation fails:
retry and alert.

late success after compensation started:
record and compensate if needed.

invalid reply:
quarantine.

concurrent saga update:
compare-and-set retry.

lease owner stalls:
lease expires, newer fencing token wins.
```

### 36. Criar política de recovery

Arquivo:

```text
contracts/recovery-policy.yaml
```

Conteúdo:

```yaml
recovery:
  scan:
    states:
      - WAITING_CAPACITY
      - WAITING_FIELD_PREPARATION
      - WAITING_NOTIFICATION
      - COMPENSATING_FIELD
      - COMPENSATING_CAPACITY

  claim:
    requires:
      - lease
      - expiration
      - fencing-token
      - compare-and-set

  ambiguousOutcome:
    action:
      QUERY_PARTICIPANT_STATE

  compensationFailure:
    action:
      RETRY_THEN_MANUAL

  staleWorkerWrite:
    action:
      REJECT

  completedSagaReplay:
    action:
      IDEMPOTENT_IGNORE
```

### 37. Criar Reconciler

```java
public final class SagaReconciler {

    public ReconciliationResult reconcile(
            ConfirmationSaga saga,
            ParticipantSnapshot snapshot) {

        return reconciliationPolicy.compare(
                saga,
                snapshot);
    }
}
```

O reconciler compara saga, Appointment, reserva, preparação e notificação. Ele não modifica estado automaticamente sem uma policy explícita.

### 38. Casos de divergência

Exemplos:

```text
saga espera capacidade,
mas reserva está RESERVED;

saga está compensada,
mas capacidade continua RESERVED;

Appointment está CONFIRMED,
mas saga está antes do pivot;

saga está COMPLETED,
mas notification request não existe;

preparação está ACTIVE
com saga COMPENSATED.
```

Cada finding possui severidade, owner e ação.

### 39. Criar política de reconciliação

Arquivo:

```text
saga/RECONCILIATION_POLICY.md
```

Defina:

```text
source of truth por entidade;

comparações permitidas;

correções automáticas seguras;

correções que exigem aprovação;

frequência;

janela histórica;

limite de lote;

auditoria;

pós-verificação.
```

A saga não é autoridade dos dados dos participantes. Ela é autoridade do progresso da coordenação.

### 40. Intervenção manual

Quando retries e reconciliação não resolvem, a saga vai para `FAILED_MANUAL`.

A ação manual precisa registrar:

```text
finding;

estado observado;

decisão;

ator;

justificativa;

comando executado;

resultado;

timestamp;

pós-verificação.
```

Nunca edite uma linha da saga diretamente no banco sem trilha.

### 41. Criar Manual Intervention

```java
public record ManualIntervention(
        UUID interventionId,
        SagaId sagaId,
        String findingId,
        String action,
        String actor,
        String justification,
        Instant requestedAt) {
}
```

A execução precisa de autorização e idempotency key própria.

### 42. Orquestração versus coreografia revisitada

O laboratório escolhe orquestração porque:

```text
o fluxo possui ordem explícita;

há compensações coordenadas;

existem deadlines;

o pivot precisa ser conhecido;

a operação precisa localizar
o estado completo rapidamente.
```

Coreografia poderia funcionar, mas aumentaria a dispersão das regras de progressão e compensação. A escolha deve ser registrada em ADR, não tratada como verdade universal.

### 43. Evitar orquestrador como domínio central de tudo

O orquestrador decide o workflow. Ele não decide se existe capacidade, como preparar execução ou como enviar comunicação.

Cada participante preserva regras e autoridade próprias.

O comando expressa intenção; o participante responde com resultado.

### 44. Evitar cadeia HTTP disfarçada de Saga

Uma classe que chama três APIs síncronas em sequência e executa `try/catch` não é uma saga confiável se não possui estado persistente, idempotência, recovery e compensação durável.

A saga pode usar HTTP em casos específicos, mas precisa sobreviver a restart, resposta perdida e timeout ambíguo.

### 45. Evitar evento genérico demais

Não publique:

```text
EntityUpdated.
```

Prefira resultados semânticos:

```text
CapacityReserved;

CapacityReservationRejected;

FieldExecutionPrepared;

FieldExecutionPreparationFailed.
```

O contrato deve comunicar o fato relevante para o workflow.

### 46. Criar observabilidade mínima

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - saga-id
    - saga-type
    - appointment-id-hash
    - status
    - current-step
    - transition
    - attempt
    - deadline
    - duration
    - outcome
    - failure-code

  metrics:
    - saga-started-total
    - saga-completed-total
    - saga-compensated-total
    - saga-failed-manual-total
    - saga-step-duration
    - saga-timeout-total
    - compensation-retry-total
    - late-reply-total
    - reconciliation-finding-total

  forbidden:
    - raw-customer-data
    - token
    - secret
    - full-message-payload
```

Tracing, cardinalidade e arquitetura completa de observabilidade ficam para a aula 655.

### 47. Criar auditoria de transição

```java
public record SagaAuditEntry(
        SagaId sagaId,
        SagaVersion version,
        SagaStatus from,
        SagaStatus to,
        SagaStep step,
        String reason,
        UUID messageId,
        Instant occurredAt) {
}
```

A auditoria deve ser append-only.

### 48. Testar fluxo de sucesso

Cenário:

```text
start;

ReserveCapacity;

CapacityReserved;

PrepareFieldExecution;

FieldExecutionPrepared;

ConfirmAppointment pivot;

NotifyAppointmentConfirmed;

CustomerNotified;

COMPLETED.
```

Valide uma transação local por boundary e nenhum write cruzado.

### 49. Testar falha na primeira etapa

`CapacityReservationFailed` move a saga para `COMPENSATED`, pois nenhum passo anterior precisa ser neutralizado.

Confirme que nenhum comando de compensação foi criado.

### 50. Testar compensação completa

Cenário:

```text
CapacityReserved;

FieldExecutionPreparationFailed;

ReleaseCapacity;

CapacityReleased;

COMPENSATED.
```

Valide que o Appointment não foi confirmado.

### 51. Testar falha de compensação

`ReleaseCapacity` falha transitoriamente três vezes.

A saga permanece `COMPENSATING_CAPACITY`, incrementa tentativas e alerta. Ela não pode ser marcada como `COMPENSATED` antes do resultado confirmado.

### 52. Testar timeout ambíguo

O Capacity Participant confirma a reserva, mas a resposta não chega.

O orquestrador consulta o status, encontra `RESERVED` e avança sem criar uma segunda reserva.

### 53. Testar resposta tardia

A saga inicia compensação após falha de preparação. Depois chega uma resposta antiga de sucesso.

Valide que a saga não retorna ao caminho principal e que a preparação é cancelada.

### 54. Testar mensagem duplicada

Entregue o mesmo `CapacityReserved.messageId` duas vezes.

A Inbox do orquestrador processa uma vez; apenas um `PrepareFieldExecution` é criado.

### 55. Testar concorrência

Dois workers carregam versão 4. O primeiro salva versão 5. O segundo falha no compare-and-set, recarrega e não repete a transição.

### 56. Testar stale worker

Worker A recebe fencing token 18 e pausa. O lease expira. Worker B recebe token 19 e avança. Quando A retorna, sua gravação é rejeitada.

### 57. Testar pivot

Após `CONFIRMED`, uma falha de notificação não pode liberar capacidade ou cancelar preparação automaticamente. O sistema repete a notificação ou encaminha para intervenção manual.

### 58. Testar reconciliation

Crie divergências controladas:

```text
reserva ativa com saga compensada;

Appointment confirmado com saga pré-pivot;

notificação ausente com saga completed.
```

Valide finding, severidade, owner e ação permitida.

### 59. Testar arquitetura

Exemplo:

```java
@ArchTest
static final ArchRule participantsMustNotDependOnOrchestrator =
        noClasses()
                .that()
                .resideInAPackage(
                        "..participant..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..orchestration..");
```

Os participantes conhecem contratos, não o fluxo interno do coordenador.

### 60. Criar report de execução

Arquivo:

```text
reports/saga-execution-report.yaml
```

Exemplo:

```yaml
sagaExecution:
  started:
    40
  completed:
    31
  compensated:
    6
  active:
    2
  failedManual:
    1
  timeouts:
    4
  lateReplies:
    1
  duplicateRepliesIgnored:
    7
  reconciliationFindings:
    2
  result:
    PASS_WITH_ACTIVE_RECOVERY
```

### 61. Criar Gate

O gate valida:

```text
charter;

participantes;

autoridades;

state machine;

classificação de passos;

transações locais;

Outbox e Inbox;

idempotência;

versionamento;

leases e fencing;

timeouts;

compensações;

pivot;

recovery;

reconciliation;

intervenção manual;

testes;

arquitetura;

evidence.
```

Status:

```text
PASS;

PASS_WITH_ACTIVE_RECOVERY;

FAIL_STATE_MACHINE;

FAIL_LOCAL_TRANSACTION;

FAIL_IDEMPOTENCY;

FAIL_TIMEOUT_POLICY;

FAIL_COMPENSATION;

FAIL_PIVOT_POLICY;

FAIL_RECOVERY;

FAIL_RECONCILIATION;

FAIL_MANUAL_INTERVENTION;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

### 62. Coletar Evidence

Arquivo:

```text
contracts/saga-evidence.yaml
```

Campos permitidos:

```text
lesson;

project;

saga type;

participant count;

started count;

completed count;

compensated count;

active count;

failed manual count;

timeout count;

late reply count;

duplicate ignored count;

compensation retry count;

reconciliation finding count;

test status;

architecture status;

documentation status;

gate status;

timestamp.
```

Não inclua payload real, dados de cliente, tokens, credenciais ou endpoints internos.

### 63. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-saga\validate-saga-contract.ps1

.\scripts\m19\service-scheduling-saga\validate-state-machine.ps1

.\scripts\m19\service-scheduling-saga\validate-step-classification.ps1

.\scripts\m19\service-scheduling-saga\validate-timeout-policy.ps1

.\scripts\m19\service-scheduling-saga\validate-compensation-policy.ps1

.\scripts\m19\service-scheduling-saga\validate-recovery-policy.ps1

.\scripts\m19\service-scheduling-saga\run-saga-tests.ps1

.\scripts\m19\service-scheduling-saga\collect-saga-evidence.ps1

.\scripts\m19\service-scheduling-saga\verify-saga-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 64. Encerrar o laboratório

Confirme:

```text
uma única intenção distribuída;

autoridade por boundary;

state machine persistente;

transição versionada;

Outbox e Inbox;

mensagens idempotentes;

pivot explícito;

compensações ordenadas;

timeout ambíguo tratado;

status remoto consultado;

late replies tratados;

workers com lease e fencing;

reconciliation;

manual intervention;

gate aprovado.
```

---

## Entendendo o que foi feito

### A intenção distribuída ganhou estado durável

A saga deixou de ser uma sequência implícita de chamadas. Ela possui ID, status, passo, versão, deadline, confirmed steps, falha e auditoria.

### Cada boundary manteve sua autoridade

Capacity decide reservas. Field Execution decide preparação. Scheduling decide Appointment e progresso da saga. Communication decide o request de notificação.

### Entrega at-least-once virou comportamento esperado

Outbox evita perder comandos e replies. Inbox evita repetir efeitos. Idempotency keys, estado atual e versionamento protegem retries, duplicação e concorrência.

### Falhas ambíguas ganharam diagnóstico

Timeout não virou falha definitiva. O sistema consulta estado, reconcilia e só compensa quando a policy possui evidência suficiente.

### Compensação ganhou qualidade operacional

Compensações são transações locais novas, idempotentes, ordenadas e observadas. Falhas permanecem ativas até retry ou intervenção manual.

### O pivot mudou a política de recuperação

Antes do pivot, a saga pode compensar. Depois do pivot, os passos restantes são retriable e a operação busca conclusão, não retorno silencioso ao estado anterior.

---

## Erros comuns importantes

### Usar Saga para esconder fronteiras ruins

Se serviços precisam participar de uma saga em quase toda alteração, o problema pode ser decomposição inadequada. Revise a aula 653 antes de adicionar mais coordenação.

### Tratar compensação como rollback

Compensação cria uma nova transação e pode não restaurar o estado exato. Ela precisa de regra de negócio, idempotência e auditoria.

### Compensar após qualquer timeout

O participante pode ter confirmado. Consulte estado ou reconcilie antes de produzir efeitos contraditórios.

### Persistir somente em memória

Restart perde progresso, deadlines e compensações. Estado e Outbox precisam de persistência transacional.

### Marcar compensada cedo demais

A saga só está `COMPENSATED` quando todas as compensações necessárias foram confirmadas.

### Usar Inbox como proteção de invariante

Inbox deduplica mensagem. Constraints e concorrência protegem o recurso de negócio.

### Deixar o orquestrador decidir regras dos participantes

O coordenador controla sequência; cada boundary mantém autoridade e invariantes.

### Reexecutar mensagens com novo ID

Retry técnico deve preservar `messageId`. Novo ID pode produzir novo efeito.

### Ignorar late reply

Respostas tardias precisam ser comparadas com o estado atual e podem exigir compensação adicional.

### Antecipar observabilidade arquitetural

Métricas essenciais foram criadas, mas o desenho completo de telemetria pertence à aula 655.

---

---

## Exercício guiado

Implemente a `ConfirmationSaga` completa.

Comece pelo caminho de sucesso. Depois adicione falha de capacidade, falha de preparação, compensação de capacidade, timeout ambíguo, resposta tardia, mensagem duplicada, compare-and-set, lease, fencing token, reconciliation e intervenção manual.

Ao terminar, execute todos os testes e gere os reports.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 653 foi preservada;
- ponte para a aula 655 foi preservada;
- a aula 490 foi usada como base sem ser repetida integralmente;
- o laboratório `service-scheduling-saga` foi criado;
- Saga Charter foi criado;
- intenção, coordenador e participantes foram definidos;
- cada participante possui autoridade de dados própria;
- transações locais foram preservadas;
- 2PC foi comparado sem ser adotado automaticamente;
- Saga foi diferenciada de ACID global;
- state machine persistente foi criada;
- estados intermediários foram modelados;
- passos compensable, pivot e retriable foram classificados;
- sagaId, appointmentId, messageId, commandMessageId e causationId foram definidos;
- versão otimista foi criada;
- compare-and-set foi implementado;
- Outbox foi usada em cada writer;
- Inbox foi usada em cada consumer;
- retries preservam messageId;
- idempotência foi separada de concorrência;
- reply duplicado não repete o próximo comando;
- reply fora de ordem é rejeitado;
- confirmação do Appointment é o pivot;
- passos anteriores possuem compensação;
- compensações usam ordem inversa;
- compensações são idempotentes;
- timeout técnico foi separado de deadline de negócio;
- timeout ambíguo consulta estado remoto;
- respostas tardias respeitam estado atual;
- compensação falha permanece pendente;
- workers usam lease e fencing token;
- stale workers são rejeitados;
- reconciliation compara saga e participantes;
- divergências geram findings;
- intervenção manual possui autorização, justificativa e auditoria;
- orquestração foi escolhida com critério;
- participantes não dependem do orquestrador;
- cadeia HTTP com `try/catch` não foi tratada como Saga;
- observabilidade mínima foi criada;
- reports, evidence e gate foram criados;
- testes de sucesso, compensação, timeout, duplicação, concorrência, pivot e reconciliation foram definidos;
- observabilidade arquitetural completa não foi antecipada;
- commit recomendado e diário de bordo estão presentes.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

git diff --stat
```

Adicione:

```powershell
git add `
  labs/m19/aula-654-transacoes-distribuidas-saga-revisitada/service-scheduling-saga `
  scripts/m19/service-scheduling-saga `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|realCustomer|productionTopology|rawPayload|globalTransaction|exactlyOnce"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar saga distribuida"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- endpoints privados;
- topologia real;
- payloads de clientes;
- dados pessoais;
- segredos;
- promessa de exactly-once;
- edição manual sem auditoria.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você revisitou transações distribuídas e Saga em nível arquitetural e executável.

Você criou:

```text
Confirmation Saga Charter;

Participant Catalog;

state machine persistente;

passos compensable, pivot e retriable;

Saga Repository versionado;

Outbox e Inbox;

comandos e replies;

orquestrador;

Saga Decision;

Compensation Planner;

Timeout Decision Service;

leases e fencing tokens;

Saga Worker;

Reconciler;

Manual Intervention;

audit entries;

reports, evidence e gate.
```

Você comprovou que uma intenção distribuída não precisa fingir atomicidade global; que cada boundary confirma suas próprias transações; que Outbox e Inbox sustentam entrega at-least-once; que idempotência não substitui concorrência; que timeout é ambíguo; que respostas tardias precisam respeitar a máquina de estados; que compensações são novas operações e podem falhar; que o pivot altera a estratégia de recuperação; que workers precisam de versionamento, leases e fencing; e que reconciliation e intervenção manual fazem parte do desenho, não de improvisos posteriores.

A próxima aula será:

```text
655 - M19.45 - Observabilidade como decisao arquitetural
```

Nela, você irá aprofundar como logs, métricas, traces, SLOs, cardinalidade, correlação, sampling, dashboards e alertas influenciam fronteiras, protocolos, custos e decisões arquiteturais.

Nenhum aprofundamento completo de observabilidade arquitetural foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Modelei a intenção distribuída.
- [ ] Preservei autoridade por boundary.
- [ ] Criei state machine persistente.
- [ ] Classifiquei passos e pivot.
- [ ] Uni estado e Outbox.
- [ ] Usei Inbox e idempotência.
- [ ] Modelei timeout ambíguo.
- [ ] Criei compensações ordenadas.
- [ ] Implementei lease, fencing e CAS.
- [ ] Criei reconciliation.
- [ ] Modelei intervenção manual.
- [ ] Executei testes e gate.

## Troubleshooting adicional

### A saga fica presa em WAITING_CAPACITY

Verifique Outbox pendente, relay, Inbox do Capacity, status da reserva, deadline e worker de recovery.

### A capacidade foi reservada duas vezes

Confirme `reservationId` estável, constraint idempotente e proteção de concorrência.

### O reply chegou, mas não avançou

Verifique `sagaId`, `commandMessageId`, Inbox, estado atual e transition policy.

### A compensação foi enviada duas vezes

O participante deve retornar o mesmo resultado para a mesma chave e manter histórico.

### A saga foi marcada como compensada com reserva ativa

O gate de compensação falhou. Execute reconciliation e bloqueie encerramento prematuro.

### Um worker antigo sobrescreveu o novo

Valide lease, fencing token e compare-and-set.

### A notificação falhou após confirmação

Não volte ao estado anterior. Retry o passo retriable e abra intervenção se o limite for atingido.

### A equipe quer alterar o banco manualmente

Use Manual Intervention com autorização, justificativa, comando idempotente, auditoria e pós-verificação.

### O orquestrador virou um serviço enorme

Mantenha nele apenas estado e decisões do workflow. Regras de capacidade, execução e comunicação pertencem aos participantes.

### O fluxo exige Saga em toda operação

Reavalie boundaries e anti-patterns da aula 653.

## Perguntas de revisão

1. Por que Saga não cria ACID global?
2. O que diferencia compensação de rollback?
3. O que muda depois do pivot?
4. Como Outbox e Inbox sustentam o fluxo?
5. Por que timeout é ambíguo?
6. Como tratar uma resposta tardia?
7. Quando uma saga está realmente compensada?
8. Para que servem compare-and-set e fencing token?
9. O que o reconciler compara?
10. Qual é a próxima aula?

## Roteiro de resposta

1. Porque cada boundary confirma sua própria transação.
2. Compensação é uma nova operação de negócio.
3. O fluxo busca conclusão por retry ou intervenção.
4. Evitam perda de intenção e repetição de efeito.
5. O participante pode ter confirmado sem entregar a resposta.
6. Comparar com o estado atual e compensar quando necessário.
7. Depois que todas as compensações exigidas confirmarem.
8. Impedir transições concorrentes e workers antigos.
9. O progresso da saga e os estados autoritativos dos participantes.
10. Observabilidade como decisão arquitetural.


## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 654 - M19.44 - Transacoes distribuidas e Saga revisitada**

- Continuei após o diagnóstico de anti-patterns de microserviços.
- Revisitei Saga sem repetir a aula conceitual 490.
- Criei o laboratório `service-scheduling-saga`.
- Modelei a Confirmation Saga de Service Scheduling.
- Defini Scheduling, Capacity, Field Execution e Communication como participantes.
- Preservei autoridade e transação local por boundary.
- Comparei 2PC e Saga por trade-offs.
- Criei Saga Charter, Participant Catalog e State Machine.
- Classifiquei passos compensable, pivot e retriable.
- Criei SagaId, AppointmentId, SagaVersion e ConfirmationSaga.
- Implementei transições explícitas.
- Criei Saga Repository com compare-and-set.
- Modelei comandos e replies com IDs estáveis.
- Uni saga state e Outbox na mesma transação.
- Usei Inbox nos participantes e no orquestrador.
- Diferenciei idempotência de concorrência.
- Criei Confirmation Saga Orchestrator e Saga Decision.
- Tratei replies duplicados e fora de ordem.
- Confirmei Appointment como pivot local.
- Criei Compensation Planner.
- Modelei compensações em ordem inversa.
- Tornei compensações idempotentes.
- Diferenciei timeout técnico de deadline de negócio.
- Consultei estado remoto em resultados ambíguos.
- Tratei respostas tardias.
- Criei Saga Lease, fencing token e Saga Worker.
- Criei failure matrix e recovery policy.
- Criei Saga Reconciler e findings.
- Modelei Manual Intervention auditada.
- Escolhi orquestração com critério.
- Criei observabilidade mínima, reports, evidence e gate.
- Testei sucesso, compensação, timeout, duplicação, concorrência, pivot e reconciliation.
- Não antecipei observabilidade arquitetural completa.
- Próxima aula: Observabilidade como decisao arquitetural.
```

## Referência técnica curta

- Distributed Transaction.
- Local Transaction.
- Saga Pattern.
- Orchestration.
- Choreography.
- Compensating Transaction.
- Pivot Transaction.
- Transactional Outbox.
- Transactional Inbox.
- Idempotent Consumer.
- Optimistic Concurrency.
- Lease.
- Fencing Token.
- Reconciliation.

Regra final:

```text
Transações distribuídas devem ser modeladas como coordenação explícita entre autoridades locais, não como um COMMIT imaginário entre bancos independentes. A Confirmation Saga persiste estado, passo, versão, deadline e auditoria; cada transição salva state e Outbox na mesma transação; cada participante usa Inbox, idempotency key e transação local para confirmar efeito e reply; replies duplicados, fora de ordem ou tardios são avaliados contra a máquina de estados; passos compensable são neutralizados em ordem inversa, o pivot CONFIRM_APPOINTMENT altera o fluxo para retry até conclusão, e compensações nunca são tratadas como rollback técnico; timeouts são ambíguos e exigem consulta de estado ou reconciliação antes de efeitos contraditórios; compare-and-set, lease e fencing token impedem workers concorrentes ou antigos; divergências geram findings, retries e intervenção manual auditada; o gate termina com autoridades, transações locais, state machine, Outbox, Inbox, idempotência, pivot, compensações, timeouts, recovery, reconciliation, testes, arquitetura, reports e evidence aprovados, enquanto observabilidade como decisão arquitetural permanece reservada para a aula 655.
```
