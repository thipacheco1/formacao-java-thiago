# 637 - M19.27 - Idempotencia avancada

## Apresentação da aula

Na aula 636, você aprofundou PACELC.

Você aprendeu que, durante uma partição, cada operação precisa escolher entre disponibilidade e consistência e que, durante a operação normal, ainda existe uma troca entre latência e consistência. Confirmação, reagendamento, cancelamento, detalhes, busca, dashboard e auditoria receberam perfis diferentes, budgets, timeouts, fallbacks e evidências.

Essa discussão revelou um problema inevitável: quando uma chamada ultrapassa o timeout, o cliente não sabe apenas que “falhou”. Ele sabe que não recebeu uma resposta dentro do prazo. O servidor pode não ter recebido a requisição, pode estar processando, pode ter confirmado a transação ou pode ter confirmado e perdido a resposta no caminho.

O retry é necessário para recuperar falhas transitórias, mas repetir uma operação sem controle pode repetir o efeito de negócio.

Na aula 464, você já construiu a base de idempotência em APIs:

```text
Idempotency-Key;

fingerprint canônico;

unique constraint;

PROCESSING e COMPLETED;

response replay;

uma transação local;

retry com a mesma key.
```

Agora o problema será ampliado.

Sistemas reais acrescentam réplicas, workers concorrentes, reentregas, crashes, retenção limitada e efeitos externos fora da transação local.

Uma confirmação de `Appointment` pode atravessar:

```text
HTTP command;

transação do Appointment;

outbox;

broker;

consumer;

inbox;

provider de comunicação;

callback;

reconciliation.
```

Em cada fronteira, uma tentativa pode ser repetida.

A pergunta desta aula será:

```text
como garantir
que retries, reentregas,
concorrência e recuperação
não multipliquem
um efeito de negócio,
mesmo quando o fluxo
atravessa processos
e sistemas diferentes?
```

O laboratório será:

```text
labs/m19/aula-637-idempotencia-avancada/service-scheduling-idempotency
```

Você construirá lifecycle completo de registros idempotentes, lease com expiração, fencing token, deduplication window, semantic key, transactional inbox, effect ledger, external effect executor, recovery de processamento preso, reconciliation, observabilidade, reports, evidence e gate.

O domínio continua sendo `Service Scheduling`.

Os cenários serão:

```text
confirmar Appointment por HTTP;

processar AppointmentConfirmed por broker;

preparar notificação ao cliente;

enviar efeito externo com referência estável;

reprocessar após crash;

reconciliar estados ambíguos.
```

A próxima aula será:

```text
638 - M19.28 - Multi tenancy arquitetura
```

Isolamento por banco, schema, coluna, roteamento, onboarding de tenant, noisy neighbor e governança de multi-tenancy ficam reservados para a aula 638. Nesta aula, `tenantId` pode participar do escopo técnico de uma key, mas a arquitetura completa de multi-tenancy não será aprofundada.

Regra central:

```text
idempotência avançada
não é apenas guardar uma key;

é controlar a identidade da intenção,
o direito temporário de processá-la,
o estado de cada fronteira,
o efeito externo
e a recuperação de ambiguidades.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
635:
CAP.

636:
PACELC.

637:
Idempotencia avancada.

638:
Multi tenancy arquitetura.

639:
Escalabilidade horizontal vertical.
```

A progressão é:

```text
decidir durante partições;

decidir entre latência e consistência;

repetir operações sem repetir efeitos;

isolar clientes arquiteturalmente;

escalar capacidade com critério.
```

A base da aula 464 será considerada conhecida. O foco estará em lifecycle, concorrência distribuída, crash recovery, mensagens duplicadas, efeitos externos, retenção e idempotência semântica.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-637-idempotencia-avancada/service-scheduling-idempotency
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/idempotency
│   │           ├── core
│   │           │   ├── IdempotencyKey.java
│   │           │   ├── IdempotencyScope.java
│   │           │   ├── RequestFingerprint.java
│   │           │   ├── IdempotencyState.java
│   │           │   ├── IdempotencyRecord.java
│   │           │   ├── IdempotencyDecision.java
│   │           │   ├── IdempotencyResult.java
│   │           │   └── ProcessingAttempt.java
│   │           ├── lease
│   │           │   ├── ProcessingLease.java
│   │           │   ├── LeaseOwner.java
│   │           │   ├── FencingToken.java
│   │           │   ├── LeasePolicy.java
│   │           │   └── LeaseExpiredException.java
│   │           ├── store
│   │           │   ├── IdempotencyStore.java
│   │           │   ├── InMemoryIdempotencyStore.java
│   │           │   ├── IdempotencyClaim.java
│   │           │   └── CompareAndSetResult.java
│   │           ├── semantic
│   │           │   ├── SemanticIntent.java
│   │           │   ├── SemanticKey.java
│   │           │   ├── SemanticFingerprint.java
│   │           │   └── IntentConflictPolicy.java
│   │           ├── inbox
│   │           │   ├── InboxMessage.java
│   │           │   ├── InboxMessageId.java
│   │           │   ├── InboxState.java
│   │           │   ├── InboxStore.java
│   │           │   ├── TransactionalInbox.java
│   │           │   └── InboxProcessor.java
│   │           ├── effect
│   │           │   ├── EffectKey.java
│   │           │   ├── EffectLedger.java
│   │           │   ├── EffectRecord.java
│   │           │   ├── EffectState.java
│   │           │   ├── ExternalEffectExecutor.java
│   │           │   ├── ProviderReference.java
│   │           │   └── EffectOutcome.java
│   │           ├── recovery
│   │           │   ├── StuckProcessingDetector.java
│   │           │   ├── IdempotencyReconciler.java
│   │           │   ├── RecoveryDecision.java
│   │           │   └── RecoveryReport.java
│   │           ├── retention
│   │           │   ├── DeduplicationWindow.java
│   │           │   ├── RetentionPolicy.java
│   │           │   ├── Tombstone.java
│   │           │   └── IdempotencyCleanupJob.java
│   │           └── application
│   │               ├── ConfirmAppointmentIdempotentService.java
│   │               ├── AppointmentConfirmedConsumer.java
│   │               ├── CustomerNotificationDispatcher.java
│   │               └── IdempotencyScenarioRunner.java
│   └── test
│       └── java
│           └── br/com/formacao/idempotency
│               ├── core
│               │   ├── AdvancedLifecycleTest.java
│               │   ├── PayloadConflictTest.java
│               │   └── ReplayResultTest.java
│               ├── lease
│               │   ├── LeaseTakeoverTest.java
│               │   ├── FencingTokenTest.java
│               │   └── LateOwnerWriteRejectedTest.java
│               ├── inbox
│               │   ├── DuplicateMessageTest.java
│               │   ├── InboxCrashRecoveryTest.java
│               │   └── InboxPayloadConflictTest.java
│               ├── effect
│               │   ├── ExternalEffectDeduplicationTest.java
│               │   ├── ProviderTimeoutReconciliationTest.java
│               │   └── EffectReferenceReuseTest.java
│               ├── semantic
│               │   ├── EquivalentIntentTest.java
│               │   └── SemanticConflictTest.java
│               ├── retention
│               │   ├── DeduplicationWindowTest.java
│               │   └── TombstoneRetentionTest.java
│               └── architecture
│                   ├── IdempotencyBoundaryTest.java
│                   ├── ExternalEffectBoundaryTest.java
│                   ├── MultiTenancyNonAnticipationTest.java
│                   └── ExactlyOnceClaimTest.java
├── idempotency
│   ├── IDEMPOTENCY_CHARTER.md
│   ├── INTENT_IDENTITY.md
│   ├── LIFECYCLE.md
│   ├── LEASE_AND_FENCING.md
│   ├── DEDUPLICATION_WINDOWS.md
│   ├── TRANSACTIONAL_INBOX.md
│   ├── EXTERNAL_EFFECTS.md
│   ├── SEMANTIC_IDEMPOTENCY.md
│   ├── RETENTION_AND_TOMBSTONES.md
│   ├── RECONCILIATION.md
│   ├── OBSERVABILITY.md
│   ├── SECURITY_POLICY.md
│   ├── OPERATING_MODEL.md
│   ├── FAILURE_RECOVERY.md
│   ├── TRADE_OFFS.md
│   └── OPEN_IDEMPOTENCY_QUESTIONS.md
├── contracts
│   ├── advanced-idempotency-contract.yaml
│   ├── lifecycle-policy.yaml
│   ├── lease-policy.yaml
│   ├── inbox-policy.yaml
│   ├── effect-policy.yaml
│   ├── semantic-intent-policy.yaml
│   ├── retention-policy.yaml
│   ├── reconciliation-policy.yaml
│   ├── observability-policy.yaml
│   ├── security-policy.yaml
│   ├── data-quality-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── request-idempotency-report.yaml
    ├── inbox-deduplication-report.yaml
    ├── external-effect-report.yaml
    ├── stuck-processing-report.yaml
    ├── reconciliation-report.yaml
    ├── architecture-report.yaml
    └── advanced-idempotency-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-idempotency
├── validate-advanced-idempotency-contract.ps1
├── validate-lifecycle.ps1
├── validate-lease-and-fencing.ps1
├── validate-inbox.ps1
├── validate-external-effects.ps1
├── validate-semantic-intent.ps1
├── validate-retention.ps1
├── validate-idempotency-reconciliation.ps1
├── validate-idempotency-observability.ps1
├── run-advanced-idempotency-tests.ps1
├── collect-advanced-idempotency-evidence.ps1
└── verify-advanced-idempotency-gate.ps1
```

---

## Conceito essencial

### Idempotência por fronteira

Uma proteção no endpoint HTTP não protege automaticamente o consumer, o banco do receiver ou o provider externo. Cada fronteira que pode receber repetição precisa de identidade, storage, regra de concorrência e evidência própria.

### Lifecycle, lease e fencing

`PROCESSING` não pode ficar preso para sempre. Um lease concede o direito temporário de processar; um fencing token crescente impede que um owner antigo conclua depois que outro assumiu.

### Inbox e efeitos externos

Transactional inbox deduplica mensagens antes do processamento. Effect ledger identifica efeitos externos e preserva a referência usada em retries e reconciliação.

### Idempotência semântica

Duas keys técnicas diferentes podem representar a mesma intenção de negócio. Uma semantic key protege regras como “uma confirmação por Appointment e revisão esperada”, sem substituir a key técnica.

### Retenção e janela de deduplicação

A proteção só existe enquanto a evidência é mantida. Retention, tombstone e replay horizon devem ser maiores que a janela real de retry, redelivery e recuperação.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-637-idempotencia-avancada/service-scheduling-idempotency

Set-Location `
  labs/m19/aula-637-idempotencia-avancada/service-scheduling-idempotency
```

---

### 2. Criar Idempotency Charter

Arquivo:

```text
idempotency/IDEMPOTENCY_CHARTER.md
```

Conteúdo:

```markdown
# Idempotency Charter

**Contexto**

Service Scheduling.

**Fronteiras protegidas**

- HTTP command;
- broker consumer;
- external notification effect.

**Identidades**

- technical idempotency key;
- message ID;
- semantic intent key;
- external effect key.

**Garantias**

- um efeito local por intenção;
- uma aplicação de mensagem por message ID;
- uma tentativa lógica por effect key;
- replay explícito;
- recovery de processamento preso;
- reconciliation de resultado ambíguo.

**Não prometemos**

Exactly-once universal.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/advanced-idempotency-contract.yaml
```

```yaml
advancedIdempotency:
  context:
    Service-Scheduling

  required:
    - technical-key
    - canonical-fingerprint
    - semantic-intent
    - lifecycle
    - processing-lease
    - fencing-token
    - compare-and-set
    - transactional-inbox
    - external-effect-ledger
    - deduplication-window
    - tombstone-policy
    - reconciliation
    - observability
    - tests
    - architecture-rules

  forbidden:
    - in-memory-only-deduplication
    - endless-processing-state
    - late-owner-completion
    - new-key-on-retry
    - blind-external-retry
    - payload-conflict-as-replay
    - exactly-once-universal-claim
    - multi-tenancy-deep-dive

  nextLesson:
    code:
      M19.28
```

---

### 4. Definir identidade da intenção

Uma requisição possui mais de uma identidade relevante:

```text
technical key:
identifica tentativas do mesmo client;

semantic key:
identifica a intenção de negócio;

message ID:
identifica uma entrega no broker;

effect key:
identifica um efeito externo.
```

Para confirmar um `Appointment`, a semantic key poderá ser:

```text
confirm-appointment
+
appointmentId
+
expectedRevision.
```

Duas requisições com keys técnicas diferentes, mas a mesma semantic key, não devem confirmar duas vezes.

---

### 5. Criar Idempotency Scope

```java
public record IdempotencyScope(
        String boundedContext,
        String operation,
        String principalScope,
        IdempotencyKey key) {

    public IdempotencyScope {
        Objects.requireNonNull(boundedContext);
        Objects.requireNonNull(operation);
        Objects.requireNonNull(principalScope);
        Objects.requireNonNull(key);
    }
}
```

`principalScope` representa a fronteira de autorização usada no laboratório. A arquitetura completa de tenant continua fora do escopo.

---

### 6. Criar lifecycle avançado

```java
public enum IdempotencyState {
    ACQUIRED,
    PROCESSING,
    COMPLETED,
    FAILED_RETRYABLE,
    FAILED_FINAL,
    EXPIRED
}
```

Interpretação:

- `ACQUIRED`: key reivindicada, ainda sem execução;
- `PROCESSING`: owner iniciou o trabalho;
- `COMPLETED`: resultado final replayable;
- `FAILED_RETRYABLE`: falha classificada permite nova tentativa;
- `FAILED_FINAL`: resultado definitivo não deve ser executado novamente;
- `EXPIRED`: registro saiu da janela ativa, mas pode conservar tombstone.

Não transforme toda exception em `FAILED_RETRYABLE`.

---

### 7. Criar Processing Lease

```java
public record ProcessingLease(
        LeaseOwner owner,
        FencingToken fencingToken,
        Instant acquiredAt,
        Instant expiresAt) {

    public ProcessingLease {
        if (!expiresAt.isAfter(acquiredAt)) {
            throw new IllegalArgumentException(
                    "Lease expiration must be later");
        }
    }

    public boolean isExpiredAt(
            Instant now) {

        return !now.isBefore(expiresAt);
    }
}
```

O lease não declara sucesso. Ele declara quem pode tentar concluir durante uma janela.

---

### 8. Criar Fencing Token

```java
public record FencingToken(
        long value)
        implements Comparable<FencingToken> {

    public FencingToken {
        if (value < 1) {
            throw new IllegalArgumentException(
                    "Fencing token must be positive");
        }
    }

    @Override
    public int compareTo(
            FencingToken other) {

        return Long.compare(
                value,
                other.value);
    }
}
```

Cada takeover recebe token maior.

Se o owner A possui token 7, perde o lease e o owner B assume com token 8, qualquer conclusão tardia do owner A deve ser rejeitada.

---

### 9. Criar Idempotency Record

```java
public record IdempotencyRecord(
        UUID recordId,
        IdempotencyScope scope,
        RequestFingerprint fingerprint,
        SemanticKey semanticKey,
        IdempotencyState state,
        ProcessingLease lease,
        IdempotencyResult result,
        int attemptCount,
        Instant createdAt,
        Instant updatedAt,
        Instant expiresAt) {
}
```

A implementação persistente deverá usar optimistic locking ou compare-and-set para impedir updates perdidos.

---

### 10. Criar política de transição

Arquivo:

```text
contracts/lifecycle-policy.yaml
```

```yaml
lifecycle:
  transitions:
    ACQUIRED:
      - PROCESSING
      - FAILED_FINAL

    PROCESSING:
      - COMPLETED
      - FAILED_RETRYABLE
      - FAILED_FINAL

    FAILED_RETRYABLE:
      - PROCESSING
      - FAILED_FINAL

    COMPLETED:
      - EXPIRED

    FAILED_FINAL:
      - EXPIRED

  terminalReplayable:
    - COMPLETED
    - FAILED_FINAL

  arbitraryTransition:
    forbidden
```

`FAILED_FINAL` pode ser replayable quando representa uma rejeição determinística, como expected revision inválida. Isso evita reexecutar a mesma intenção e produzir um resultado diferente sem mudança explícita da intenção.

---

### 11. Criar claim atômico

```java
public interface IdempotencyStore {

    IdempotencyClaim claim(
            IdempotencyScope scope,
            RequestFingerprint fingerprint,
            SemanticKey semanticKey,
            LeaseOwner owner,
            Instant now);

    CompareAndSetResult complete(
            UUID recordId,
            FencingToken token,
            IdempotencyResult result,
            Instant now);

    CompareAndSetResult markRetryable(
            UUID recordId,
            FencingToken token,
            String safeFailureCode,
            Instant now);
}
```

A aquisição precisa ser atômica. Um `find` seguido de `insert` sem constraint continua incorreto.

---

### 12. Decisões possíveis no claim

```java
public sealed interface IdempotencyClaim {

    record Acquired(
            IdempotencyRecord record)
            implements IdempotencyClaim {
    }

    record Replay(
            IdempotencyResult result)
            implements IdempotencyClaim {
    }

    record InProgress(
            Instant retryAfter)
            implements IdempotencyClaim {
    }

    record PayloadConflict(
            String safeCode)
            implements IdempotencyClaim {
    }

    record SemanticConflict(
            String safeCode)
            implements IdempotencyClaim {
    }
}
```

O client não recebe owner, token, detalhes internos ou payload armazenado de outra intenção.

---

### 13. Lease takeover

Quando um registro está `PROCESSING` e o lease expirou, uma nova tentativa pode assumir somente após a policy verificar:

```text
não existe resultado final;

o efeito local é seguro para retry;

o efeito externo foi reconciliado;

a nova tentativa recebe fencing token maior;

o takeover é auditado.
```

Lease expirado não significa automaticamente que a execução anterior não concluiu um efeito externo.

---

### 14. Criar lease policy

Arquivo:

```text
contracts/lease-policy.yaml
```

```yaml
lease:
  durationSeconds:
    30

  heartbeat:
    allowed:
      true

  takeover:
    requires:
      - expired-lease
      - higher-fencing-token
      - safe-retry-classification
      - audit

  completion:
    requiresCurrentFencingToken:
      true

  lateOwnerCompletion:
    forbidden

  infiniteLease:
    forbidden
```

O valor é didático. Em produção, considere p99, timeout, GC pause e failover.

---

### 15. Heartbeat com limite

Operações longas podem renovar o lease. A renovação precisa usar compare-and-set e o token atual.

Não use heartbeat para esconder processamento ilimitado. Defina deadline total e máximo de renovações.

---

### 16. Idempotência semântica

Arquivo:

```text
idempotency/SEMANTIC_IDEMPOTENCY.md
```

Exemplo:

```text
Operation:
Confirm Appointment.

Technical key:
client generated.

Semantic key:
appointmentId + expectedRevision + CONFIRM.

Business effect:
one transition to CONFIRMED
for the expected revision.
```

Uma key nova com a mesma semantic key pode receber o resultado já conhecido ou conflito explícito, conforme a policy.

---

### 17. Criar Semantic Key

```java
public record SemanticKey(
        String operation,
        UUID aggregateId,
        long expectedRevision) {

    public String canonicalValue() {
        return operation
                + ":"
                + aggregateId
                + ":"
                + expectedRevision;
    }
}
```

Não use apenas `appointmentId`; uma nova intenção legítima em revisão posterior precisa ser distinguida.

---

### 18. Criar semantic intent policy

Arquivo:

```text
contracts/semantic-intent-policy.yaml
```

```yaml
semanticIntent:
  confirmAppointment:
    material:
      - operation
      - appointment-id
      - expected-revision

  sameSemanticKeyDifferentTechnicalKey:
    action:
      REPLAY_OR_REPORT_EXISTING_OUTCOME

  sameTechnicalKeyDifferentFingerprint:
    action:
      PAYLOAD_CONFLICT

  laterRevision:
    newIntent:
      true

  authorization:
    recheckOnReplay:
      required
```

Replay não substitui autorização atual. O sistema pode ocultar o body armazenado se o principal perdeu acesso.

---

### 19. Implementar serviço de confirmação

```java
public final class ConfirmAppointmentIdempotentService {

    private final IdempotencyStore idempotencyStore;
    private final AppointmentRepository appointments;
    private final Clock clock;

    public ConfirmResult confirm(
            ConfirmAppointmentCommand command) {

        IdempotencyClaim claim =
                idempotencyStore.claim(
                        command.scope(),
                        command.fingerprint(),
                        command.semanticKey(),
                        command.owner(),
                        clock.instant());

        return switch (claim) {
            case IdempotencyClaim.Replay replay ->
                    ConfirmResult.from(
                            replay.result());
            case IdempotencyClaim.InProgress inProgress ->
                    ConfirmResult.inProgress(
                            inProgress.retryAfter());
            case IdempotencyClaim.PayloadConflict ignored ->
                    ConfirmResult.payloadConflict();
            case IdempotencyClaim.SemanticConflict ignored ->
                    ConfirmResult.semanticConflict();
            case IdempotencyClaim.Acquired acquired ->
                    executeOwned(
                            acquired.record(),
                            command);
        };
    }
}
```

O método `executeOwned` valida fencing token antes de concluir.

---

### 20. Falha determinística e falha transitória

Classificação sugerida:

```text
expected revision mismatch:
FAILED_FINAL;

Appointment already cancelled:
FAILED_FINAL;

validation error:
FAILED_FINAL;

connection timeout before local transaction:
FAILED_RETRYABLE;

local database unavailable:
FAILED_RETRYABLE;

unknown external effect outcome:
RECONCILE_BEFORE_RETRY.
```

Não trate `unknown` como retryable comum.

---

### 21. Transactional Inbox

Mensageria costuma entregar pelo menos uma vez. O consumer precisa persistir a identidade da mensagem antes de aplicar o efeito.

Fluxo:

```text
broker entrega;

inbox tenta registrar message ID;

se COMPLETED:
ack duplicate;

se nova:
persist inbox + aplicar efeito local
na mesma transação;

commit;

ack.
```

Se o ack se perde, a mensagem volta e encontra inbox concluída.

---

### 22. Criar Inbox Message

```java
public record InboxMessage(
        InboxMessageId messageId,
        String messageType,
        String payloadFingerprint,
        InboxState state,
        FencingToken fencingToken,
        Instant receivedAt,
        Instant processedAt) {
}
```

Mesma `messageId` com fingerprint diferente é incidente de contrato ou segurança, não replay normal.

---

### 23. Criar inbox policy

Arquivo:

```text
contracts/inbox-policy.yaml
```

```yaml
inbox:
  identity:
    - message-id
    - message-type

  duplicateSamePayload:
    action:
      ACK_WITHOUT_REAPPLY

  duplicateDifferentPayload:
    action:
      QUARANTINE

  localEffect:
    sameTransactionAsInboxCompletion:
      required

  ackBeforeCommit:
    forbidden

  processingLease:
    required

  poisonMessage:
    action:
      QUARANTINE_WITH_EVIDENCE
```

---

### 24. Criar Transactional Inbox

```java
public final class TransactionalInbox {

    private final InboxStore inboxStore;

    public InboxDecision receive(
            InboxMessageId messageId,
            String messageType,
            String fingerprint,
            LeaseOwner owner,
            Instant now) {

        return inboxStore.claim(
                messageId,
                messageType,
                fingerprint,
                owner,
                now);
    }
}
```

O processor só executa quando recebe ownership válido.

---

### 25. Processar AppointmentConfirmed

O consumer atualiza uma preparação local e agenda uma notificação.

A transação local pode gravar:

```text
inbox COMPLETED;

FieldExecutionPreparation atualizada;

NotificationIntent PENDING;
```

A chamada HTTP ao provider de comunicação não ocorre dentro dessa transação.

---

### 26. External Effect Ledger

Um efeito externo não participa da transação local. Precisamos registrar a intenção antes do envio e reutilizar a mesma identidade em todas as tentativas.

Exemplo:

```text
effect type:
CUSTOMER_APPOINTMENT_CONFIRMED_NOTIFICATION;

effect key:
appointmentId + confirmationRevision + channel;

provider reference:
stable reference sent on every retry.
```

---

### 27. Criar Effect Key

```java
public record EffectKey(
        String effectType,
        UUID aggregateId,
        long aggregateRevision,
        String channel) {

    public String value() {
        return String.join(
                ":",
                effectType,
                aggregateId.toString(),
                Long.toString(aggregateRevision),
                channel);
    }
}
```

A key deve representar o efeito lógico, não uma tentativa de transporte.

---

### 28. Criar Effect Ledger

```java
public interface EffectLedger {

    EffectClaim claim(
            EffectKey key,
            String payloadFingerprint,
            LeaseOwner owner,
            Instant now);

    void recordProviderAccepted(
            EffectKey key,
            FencingToken token,
            ProviderReference reference,
            Instant now);

    void recordUnknownOutcome(
            EffectKey key,
            FencingToken token,
            String safeFailureCode,
            Instant now);
}
```

O ledger precisa persistir a referência do provider quando conhecida.

---

### 29. Criar external effect policy

Arquivo:

```text
contracts/effect-policy.yaml
```

```yaml
externalEffect:
  identity:
    stable-effect-key

  providerRequest:
    reuseReferenceOnRetry:
      required

  timeoutAfterSend:
    action:
      RECONCILE_BEFORE_BLIND_RETRY

  providerSupportsIdempotency:
    useProviderKey:
      required

  providerDoesNotSupportIdempotency:
    requires:
      - query-by-reference-or-reconciliation
      - bounded-retry
      - duplicate-risk-accepted

  markCompletedBeforeProviderEvidence:
    forbidden
```

---

### 30. Enviar efeito com referência estável

```java
public final class ExternalEffectExecutor {

    public EffectOutcome execute(
            EffectRecord effect) {

        ProviderReference reference =
                effect.providerReference()
                        .orElseGet(() ->
                                ProviderReference.from(
                                        effect.effectKey()));

        return provider.send(
                reference,
                effect.safePayload());
    }
}
```

A mesma referência precisa ser reutilizada no retry. Gerar nova referência por tentativa destrói a deduplicação do provider.

---

### 31. Timeout após envio

Cenário:

```text
provider recebe;

provider aceita;

response se perde;

ledger registra UNKNOWN_OUTCOME.
```

A próxima ação não é necessariamente reenviar. Primeiro consulte o provider pela referência, aguarde callback ou execute reconciliation prevista.

---

### 32. Exactly-once é uma composição limitada

Você pode obter:

```text
uma aplicação local
por message ID;

um command local
por semantic intent;

um envio lógico
por effect key;
```

Mas não deve declarar exactly-once universal entre rede, banco, broker e provider apenas porque cada componente possui deduplicação.

A garantia real é limitada por escopo, janela, storage e recovery.

---

### 33. Deduplication Window

```java
public record DeduplicationWindow(
        Duration activeRetention,
        Duration tombstoneRetention,
        Duration maximumReplayHorizon) {

    public DeduplicationWindow {
        if (activeRetention.compareTo(
                maximumReplayHorizon) < 0) {
            throw new IllegalArgumentException(
                    "Active retention is shorter than replay horizon");
        }
    }
}
```

A janela precisa considerar retries do client, redelivery do broker, restore de backup, replays operacionais, callbacks e atrasos do provider.

---

### 34. Tombstones

Apagar o registro completo logo após a janela ativa pode permitir duplicidade tardia.

Um tombstone conserva:

```text
scope hash;

semantic key hash;

resultado terminal mínimo;

completedAt;

expiresAt;
```

Ele não precisa manter o body inteiro da response.

---

### 35. Criar retention policy

Arquivo:

```text
contracts/retention-policy.yaml
```

```yaml
retention:
  activeRecord:
    hours:
      72

  tombstone:
    days:
      30

  maximumReplayHorizon:
    hours:
      48

  cleanup:
    batchSize:
      500
    observable:
      true

  deleteBeforeReplayHorizon:
    forbidden

  retainSensitiveResponseIndefinitely:
    forbidden
```

Os valores são didáticos e dependem de risco, volume e privacidade.

---

### 36. Recovery de PROCESSING preso

`StuckProcessingDetector` procura registros com lease expirado e estado não terminal.

Classificações:

```text
safe-local-retry;

external-outcome-unknown;

completed-but-result-not-recorded;

payload-conflict;

manual-investigation-required.
```

Não faça takeover em massa sem rate limit e observabilidade.

---

### 37. Criar Reconciler

```java
public final class IdempotencyReconciler {

    public RecoveryDecision reconcile(
            IdempotencyRecord record) {

        if (record.result() != null) {
            return RecoveryDecision.completeFromEvidence(
                    record.result());
        }

        if (effectLedger.hasUnknownOutcome(
                record.semanticKey())) {
            return RecoveryDecision.queryExternalProvider();
        }

        if (isSafeLocalRetry(record)) {
            return RecoveryDecision.allowTakeover();
        }

        return RecoveryDecision.manualReview();
    }
}
```

Reconciliation transforma ambiguidade em decisão comprovável.

---

### 38. Criar reconciliation policy

Arquivo:

```text
contracts/reconciliation-policy.yaml
```

```yaml
reconciliation:
  stuckProcessing:
    scanEveryMinutes:
      5

  classify:
    - safe-local-retry
    - external-outcome-unknown
    - completed-with-missing-result
    - payload-conflict
    - manual-review

  externalUnknown:
    blindRetry:
      forbidden

  takeover:
    requires:
      - decision
      - higher-fencing-token
      - audit

  manualDecision:
    requires:
      - owner
      - justification
      - evidence
```

---

### 39. Observabilidade

Meça por fronteira:

```text
first execution;

technical replay;

semantic replay;

payload conflict;

semantic conflict;

in progress;

lease takeover;

late owner rejected;

inbox duplicate;

inbox quarantine;

external effect retry;

unknown outcome;

reconciliation result;

cleanup and tombstone count.
```

Não use key completa, Appointment ID real ou payload como tag de alta cardinalidade.

---

### 40. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

```yaml
observability:
  request:
    required:
      - first-execution-count
      - replay-count
      - payload-conflict-count
      - semantic-conflict-count
      - in-progress-count

  lease:
    required:
      - takeover-count
      - expired-count
      - late-owner-rejected-count

  inbox:
    required:
      - received-count
      - duplicate-count
      - quarantine-count
      - processing-age

  effect:
    required:
      - attempt-count
      - accepted-count
      - unknown-outcome-count
      - reconciliation-count

  forbiddenTags:
    - full-idempotency-key
    - raw-payload
    - personal-data
    - provider-secret
```

---

### 41. Segurança

Uma key não concede acesso ao resultado. Em todo replay:

```text
autenticar novamente;

autorizar novamente;

validar scope;

aplicar campos permitidos;

não devolver resultado de outro principal.
```

Fingerprints e tombstones também podem revelar padrões. Proteja storage, acesso operacional e logs.

---

### 42. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

```yaml
security:
  replay:
    authentication:
      required
    authorization:
      recheck:
        required

  key:
    treatedAsCredential:
      false
    logFullValue:
      forbidden

  storedResult:
    allowlist:
      required

  operatorAccess:
    audited:
      true

  crossScopeReplay:
    forbidden

  externalProviderSecret:
    persistInLedger:
      forbidden
```

---

### 43. Testar lifecycle

`AdvancedLifecycleTest` valida:

1. primeira tentativa adquire;
2. owner inicia processamento;
3. resultado conclui;
4. replay devolve o mesmo outcome;
5. transição arbitrária falha;
6. falha final é replayada sem nova execução;
7. falha retryable exige novo claim válido.

---

### 44. Testar lease takeover

Cenário:

1. owner A adquire token 11;
2. lease expira;
3. reconciliation permite takeover;
4. owner B recebe token 12;
5. owner A tenta concluir;
6. compare-and-set rejeita token 11;
7. owner B conclui uma única vez.

---

### 45. Testar mensagem duplicada

Entregue `AppointmentConfirmed` duas vezes com o mesmo message ID e payload.

Esperado:

```text
uma atualização local;

uma NotificationIntent;

duplicate ack;

nenhum novo efeito.
```

---

### 46. Testar message ID com payload diferente

Mesma identity e fingerprint diferente:

```text
quarantine;

alerta;

nenhum ack de sucesso silencioso;

nenhuma mutação adicional.
```

---

### 47. Testar crash antes do commit

O processor aplica alterações em memória, mas a transação falha antes do commit.

Na redelivery:

```text
inbox não está COMPLETED;

novo owner processa;

um único commit final.
```

---

### 48. Testar crash depois do commit e antes do ack

Na redelivery, a inbox está `COMPLETED`.

O consumer responde duplicate sem reaplicar o efeito local.

Esse é o cenário clássico de at-least-once protegido por inbox.

---

### 49. Testar efeito externo

Envie a notificação com `EffectKey` estável.

Simule timeout depois que o provider aceitou.

Esperado:

```text
UNKNOWN_OUTCOME;

mesma ProviderReference;

reconciliation;

zero nova referência;

zero sucesso inventado.
```

---

### 50. Testar idempotência semântica

Envie duas technical keys diferentes para:

```text
CONFIRM;

mesmo Appointment;

mesma expectedRevision.
```

A segunda não executa nova transição. Ela recupera o resultado existente ou informa conflito semântico conforme o contrato.

Depois aumente a revisão e crie uma intenção legítima diferente. A nova semantic key deve ser aceita.

---

### 51. Testar retenção

Com `Clock` controlado:

```text
antes do replay horizon:
registro ativo ou tombstone protege;

depois da active retention:
body pode ser removido;

antes da tombstone expiration:
semantic duplicate ainda é detectado;

depois do limite final:
risco residual é explicitamente documentado.
```

---

### 52. Testar arquitetura

```java
@ArchTest
static final ArchRule externalProvidersMustBeCalledThroughEffectBoundary =
        noClasses()
                .that()
                .resideOutsideOfPackage(
                        "..effect..")
                .should()
                .dependOnClassesThat()
                .haveSimpleNameEndingWith(
                        "ProviderClient");
```

Também valide que consumers não atualizam domínio antes de adquirir inbox ownership.

---

### 53. Criar Data Quality Policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

```yaml
quality:
  duplicateLocalEffect:
    action:
      FAIL

  duplicateExternalReference:
    action:
      FAIL

  payloadConflictAsReplay:
    action:
      FAIL

  lateOwnerCompletionAccepted:
    action:
      FAIL

  inboxAckBeforeCommit:
    action:
      FAIL

  blindRetryAfterUnknownOutcome:
    action:
      FAIL

  retentionShorterThanReplayHorizon:
    action:
      FAIL

  exactlyOnceUniversalClaim:
    action:
      FAIL
```

---

### 54. Criar Non-Anticipation Policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

```yaml
nonAnticipation:
  lesson638:
    forbidden:
      - database-per-tenant-design
      - schema-per-tenant-design
      - tenant-routing
      - tenant-onboarding
      - noisy-neighbor-governance
      - tenant-data-migration

  allowed:
    - principal-scope-in-key
    - scope-isolation-check
    - cross-scope-replay-forbidden
```

---

### 55. Criar Reports

Exemplo:

```yaml
advancedIdempotency:
  requestExecutions:
    120

  technicalReplays:
    18

  semanticReplays:
    4

  payloadConflicts:
    2

  leaseTakeovers:
    3

  lateOwnerRejected:
    3

  inboxDeliveries:
    200

  inboxDuplicates:
    31

  externalEffects:
    80

  unknownOutcomes:
    2

  reconciledOutcomes:
    2

  duplicateBusinessEffects:
    0

  result:
    PASS
```

---

### 56. Criar Gate

O gate valida charter, identidades, fingerprint, lifecycle, lease, fencing, semantic key, inbox, effect ledger, retenção, tombstones, reconciliation, segurança, observabilidade, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_INTENT_IDENTITY;

FAIL_LIFECYCLE;

FAIL_LEASE;

FAIL_FENCING;

FAIL_SEMANTIC_KEY;

FAIL_INBOX;

FAIL_EXTERNAL_EFFECT;

FAIL_RETENTION;

FAIL_RECONCILIATION;

FAIL_SECURITY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 57. Coletar Evidence

Arquivo:

```text
contracts/advanced-idempotency-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- request execution count;
- technical replay count;
- semantic replay count;
- payload conflict count;
- in-progress count;
- lease takeover count;
- late owner rejection count;
- inbox delivery count;
- inbox duplicate count;
- inbox quarantine count;
- external effect count;
- unknown outcome count;
- reconciled outcome count;
- duplicate business effect count;
- retention status;
- security status;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua key completa, payload real, dados pessoais, secrets, URLs privadas ou desenho aprofundado de multi-tenancy.

---

### 58. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-idempotency\validate-advanced-idempotency-contract.ps1

.\scripts\m19\service-scheduling-idempotency\validate-lifecycle.ps1

.\scripts\m19\service-scheduling-idempotency\validate-lease-and-fencing.ps1

.\scripts\m19\service-scheduling-idempotency\validate-inbox.ps1

.\scripts\m19\service-scheduling-idempotency\validate-external-effects.ps1

.\scripts\m19\service-scheduling-idempotency\validate-semantic-intent.ps1

.\scripts\m19\service-scheduling-idempotency\validate-retention.ps1

.\scripts\m19\service-scheduling-idempotency\validate-idempotency-reconciliation.ps1

.\scripts\m19\service-scheduling-idempotency\validate-idempotency-observability.ps1

.\scripts\m19\service-scheduling-idempotency\run-advanced-idempotency-tests.ps1

.\scripts\m19\service-scheduling-idempotency\collect-advanced-idempotency-evidence.ps1

.\scripts\m19\service-scheduling-idempotency\verify-advanced-idempotency-gate.ps1
```

Ou execute:

```powershell
mvn test
```

Finalize:

```powershell
git diff --check

git status
```

---

### 59. Encerrar o laboratório

Confirme:

- technical key preservada entre retries;
- fingerprint canônico;
- semantic key por intenção;
- lifecycle explícito;
- lease limitado;
- fencing token crescente;
- late owner rejeitado;
- compare-and-set;
- falha final separada de retryable;
- inbox antes do processamento;
- ack somente depois do commit;
- duplicate message não reaplica efeito;
- payload conflict vai para quarantine;
- effect key estável;
- provider reference reutilizada;
- timeout externo gera reconciliation;
- blind retry proibido;
- deduplication window definida;
- tombstone preserva proteção mínima;
- replay revalida autorização;
- métricas sem alta cardinalidade;
- zero promessa universal de exactly-once;
- multi-tenancy não foi aprofundado;
- reports sanitizados.

---

## Entendendo o que foi feito

### A intenção ganhou identidades complementares

Technical key protege retries, semantic key protege a intenção, message ID protege a entrega e effect key protege o efeito externo.

### O processamento ganhou ownership temporário

Lease define quem pode processar agora; fencing token impede conclusão de owner antigo depois de takeover.

### A mensageria ganhou inbox transacional

Uma mensagem duplicada pode ser reconhecida sem reaplicar o estado local. Commit acontece antes do ack.

### O efeito externo ganhou ledger e reconciliação

A aplicação registra a intenção, reutiliza referência estável e investiga outcomes ambíguos antes de reenviar.

### A retenção ganhou ligação com o replay horizon

Active records, tombstones e janela de deduplicação preservam a garantia pelo período declarado.

### Exactly-once ganhou limites honestos

A arquitetura passou a declarar garantias por fronteira, escopo e janela, sem prometer uma propriedade universal que não consegue provar.

---

## Erros comuns importantes

### Repetir a aula básica de API

Header, fingerprint e unique constraint são apenas a base. O problema avançado começa em lifecycle, crash, mensagens e efeitos externos.

### Usar PROCESSING sem lease

Um crash pode bloquear a key indefinidamente.

### Fazer takeover sem fencing

O owner antigo pode concluir depois e sobrescrever o resultado do novo owner.

### Considerar lease expirado como prova de falha

A execução anterior pode ter concluído um efeito externo.

### Deduplicar somente em memória

Restart, múltiplas réplicas e failover removem a proteção.

### Ack do broker antes do commit

Uma falha posterior perde a mensagem.

### Chamar provider antes de registrar effect

Um crash deixa o efeito sem identidade para reconciliation.

### Gerar nova referência externa no retry

O provider pode executar o efeito novamente.

### Reenviar depois de outcome desconhecido

O primeiro envio pode ter sido aceito.

### Usar key técnica como única regra

Clients diferentes podem representar a mesma intenção com keys diferentes.

### Apagar registros cedo

Retries tardios e redelivery podem atravessar a retenção.

### Reaproveitar response sem reautorizar

Um usuário pode ter perdido acesso ao recurso.

### Prometer exactly-once

A evidência geralmente cobre apenas uma fronteira e uma janela.

### Antecipar multi-tenancy

A próxima aula tratará isolamento e roteamento arquiteturalmente.

---

## Comandos úteis

### Validar lifecycle e fencing

```powershell
.\scripts\m19\service-scheduling-idempotency\validate-lifecycle.ps1

.\scripts\m19\service-scheduling-idempotency\validate-lease-and-fencing.ps1
```

### Validar inbox e efeitos externos

```powershell
.\scripts\m19\service-scheduling-idempotency\validate-inbox.ps1

.\scripts\m19\service-scheduling-idempotency\validate-external-effects.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-idempotency\run-advanced-idempotency-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-idempotency\verify-advanced-idempotency-gate.ps1
```

---

## Exercício guiado

Implemente o lifecycle avançado, adicione lease e fencing, proteja a confirmação com technical e semantic keys, processe `AppointmentConfirmed` por inbox, registre a intenção de notificação no effect ledger, simule timeout após envio, reconcilie o provider, teste retenção e gere evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com PACELC foi preservada;
- a aula 464 foi usada como base sem repetição integral;
- o laboratório `service-scheduling-idempotency` foi criado;
- Idempotency Charter foi criado;
- technical key foi preservada entre retries;
- fingerprint canônico foi mantido;
- semantic key foi criada;
- technical key e semantic key foram diferenciadas;
- lifecycle avançado foi modelado;
- falha retryable e falha final foram separadas;
- lease possui expiração;
- takeover exige decisão de recovery;
- fencing token cresce a cada takeover;
- owner antigo não consegue concluir;
- compare-and-set foi aplicado;
- heartbeat possui limite;
- PROCESSING infinito foi proibido;
- semantic replay foi testado;
- revisão posterior cria nova intenção;
- autorização é revalidada no replay;
- transactional inbox foi criada;
- message ID identifica entrega;
- duplicate com mesmo payload não reaplica efeito;
- duplicate com payload diferente vai para quarantine;
- ack antes do commit foi proibido;
- crash antes do commit foi testado;
- crash depois do commit e antes do ack foi testado;
- NotificationIntent foi persistida localmente;
- effect ledger foi criado;
- effect key representa efeito lógico;
- provider reference é estável;
- retry externo reutiliza referência;
- timeout após envio gera outcome desconhecido;
- outcome desconhecido exige reconciliation;
- blind retry foi proibido;
- deduplication window foi criada;
- active retention cobre replay horizon;
- tombstone foi criado;
- body sensível não é mantido indefinidamente;
- stuck processing detector foi criado;
- reconciler classifica ambiguidades;
- takeovers são auditados;
- métricas por fronteira foram criadas;
- key completa e payload não são tags;
- replay cross-scope foi proibido;
- exactly-once universal não foi prometido;
- arquitetura protege fronteiras;
- multi-tenancy não foi aprofundado;
- reports, gate e evidence foram criados;
- commit recomendado, diário de bordo e ponte estão presentes.

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
  labs/m19/aula-637-idempotencia-avancada/service-scheduling-idempotency `
  scripts/m19/service-scheduling-idempotency `
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
      "Authorization: Bearer|access_token|client_secret|rawPayload|fullIdempotencyKey|providerSecret|databasePerTenant|schemaPerTenant"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): aprofundar idempotencia distribuida"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- keys completas;
- payloads reais;
- tokens;
- secrets de provider;
- URLs privadas;
- responses com dados pessoais;
- dumps de inbox;
- reports temporários;
- arquitetura de multi-tenancy antecipada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou idempotência distribuída.

Você criou:

```text
Idempotency Charter;

technical key;

semantic key;

advanced lifecycle;

processing lease;

fencing token;

compare-and-set;

transactional inbox;

Effect Ledger;

stable Provider Reference;

deduplication window;

tombstones;

Stuck Processing Detector;

Idempotency Reconciler;

observabilidade;

architecture tests;

reports e gate.
```

Você comprovou que uma key técnica sozinha não protege um fluxo distribuído inteiro; que cada fronteira repetível precisa de identidade e storage; que `PROCESSING` exige lease e recovery; que fencing token impede conclusão tardia; que semantic key identifica a intenção mesmo quando o client muda a key; que inbox protege redelivery do broker; que effects externos precisam de ledger, referência estável e reconciliation; que timeout depois do envio não autoriza retry cego; que retention precisa cobrir o replay horizon; e que exactly-once deve ser declarado apenas dentro do escopo que pode ser provado.

A próxima aula será:

```text
638 - M19.28 - Multi tenancy arquitetura
```

Nela, você irá aprofundar como uma plataforma atende múltiplos clientes preservando isolamento, identidade, roteamento, dados, configuração, performance, segurança, observabilidade, onboarding e evolução.

Nenhum aprofundamento de database-per-tenant, schema-per-tenant, tenant routing ou noisy neighbor foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei technical, semantic, message e effect keys.
- [ ] Modelei lifecycle, lease e fencing.
- [ ] Protegi redelivery com inbox.
- [ ] Protegi efeito externo com ledger e reconciliation.
- [ ] Alinhei retenção ao replay horizon.
- [ ] Rejeitei promessa universal de exactly-once.
- [ ] Executei testes de crash e concorrência.
- [ ] Gerei reports, evidence e gate.

---

## Troubleshooting adicional

### A key fica eternamente em PROCESSING

Verifique lease, detector de stuck records, classificação de recovery e takeover auditado.

### Dois owners concluem o mesmo registro

O storage não valida fencing token ou compare-and-set.

### O owner antigo conclui depois do takeover

A completion não está exigindo o token atual.

### Mensagem duplicada atualiza o domínio novamente

O processamento ocorreu antes do claim da inbox ou fora da mesma transação.

### O broker não redelivery após crash

Confirme que o ack não ocorreu antes do commit.

### Mesma message ID chegou com outro body

Quarantenize. Não trate como duplicate normal.

### A notificação foi enviada duas vezes

Confirme EffectKey, ProviderReference e suporte de idempotência do provider.

### Timeout externo provoca envio imediato

Classifique como outcome desconhecido e reconcilie antes do retry.

### Keys diferentes confirmam o mesmo Appointment

A semantic key não inclui operação, aggregate ID e expected revision corretamente.

### Nova revisão é bloqueada como duplicada

A semantic key está ampla demais e não diferencia intenção posterior legítima.

### Cleanup removeu a proteção cedo

Compare active retention, tombstone retention e maximum replay horizon.

### Replay devolve dados para usuário sem acesso

Revalide autenticação, autorização e campos allowlisted.

### Métricas explodiram em cardinalidade

Remova key, aggregate ID e payload das tags.

### A equipe afirma exactly-once end-to-end

Peça o escopo, a janela, o storage e a evidência de cada fronteira.

### A discussão virou banco por cliente

Preserve multi-tenancy para a aula 638.

---

## Perguntas de revisão

1. Qual diferença entre technical key e semantic key?
2. Por que PROCESSING precisa de lease?
3. Para que serve fencing token?
4. Lease expirado prova que o efeito não ocorreu?
5. O que transactional inbox protege?
6. Quando o broker deve receber ack?
7. O que ocorre com duplicate de payload diferente?
8. Para que serve Effect Ledger?
9. Por que ProviderReference precisa ser estável?
10. O que fazer após timeout externo ambíguo?
11. O que é deduplication window?
12. Qual é a próxima aula?

## Roteiro de resposta

1. A primeira identifica tentativas do client; a segunda identifica intenção de negócio.
2. Para permitir recovery sem bloqueio infinito.
3. Para rejeitar conclusão de owner antigo.
4. Não.
5. Reentrega de mensagem e reaplicação local.
6. Depois do commit.
7. Quarantine e alerta.
8. Registrar e deduplicar efeitos externos.
9. Para o provider reconhecer retries da mesma intenção.
10. Reconciliation antes de blind retry.
11. Período em que a evidência de duplicidade é mantida.
12. Multi tenancy arquitetura.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 637 - M19.27 - Idempotencia avancada**

- Aprofundei idempotência além da Idempotency-Key básica.
- Criei o laboratório `service-scheduling-idempotency`.
- Diferenciei technical key, semantic key, message ID e effect key.
- Criei Idempotency Charter.
- Modelei lifecycle ACQUIRED, PROCESSING, COMPLETED, FAILED_RETRYABLE, FAILED_FINAL e EXPIRED.
- Criei Processing Lease com expiração.
- Criei Fencing Token crescente.
- Impedi conclusão tardia de owner antigo.
- Apliquei compare-and-set.
- Modelei takeover somente após recovery decision.
- Criei Semantic Key por operação, Appointment e expected revision.
- Testei duas technical keys para a mesma intenção.
- Revalidei autorização no replay.
- Criei Transactional Inbox.
- Deduplicei mensagens por message ID e fingerprint.
- Proibi ack antes do commit.
- Testei crash antes do commit e depois do commit antes do ack.
- Criei NotificationIntent local.
- Criei Effect Ledger para efeitos externos.
- Criei EffectKey e ProviderReference estáveis.
- Modelei UNKNOWN_OUTCOME após timeout externo.
- Proibi blind retry antes de reconciliation.
- Criei Deduplication Window.
- Alinhei active retention ao replay horizon.
- Criei Tombstones para proteção tardia.
- Criei Stuck Processing Detector.
- Criei Idempotency Reconciler.
- Criei métricas por request, lease, inbox e effect.
- Protegi keys, payloads e resultados armazenados.
- Evitei promessa universal de exactly-once.
- Criei testes de lifecycle, takeover, fencing, inbox, external effect, semantic intent e retention.
- Criei reports, evidence e gate.
- Não antecipei arquitetura de multi-tenancy.
- Próxima aula: Multi tenancy arquitetura.
```

---

## Referência técnica curta

- Idempotency Key.
- Semantic Idempotency.
- Processing Lease.
- Fencing Token.
- Compare-and-Set.
- Transactional Inbox.
- Effect Ledger.
- Deduplication Window.
- Tombstone.
- Reconciliation.
- At-least-once Delivery.
- Exactly-once Scope.

Regra final:

```text
Idempotência avançada deve ser projetada por fronteira, identidade, estado e janela: a technical key preserva as tentativas do client, a semantic key identifica a intenção de negócio, message ID e fingerprint protegem a inbox e a effect key identifica o efeito externo; registros idempotentes possuem lifecycle explícito, lease limitado, compare-and-set e fencing token crescente, portanto um owner antigo não pode concluir depois de takeover, falhas finais são separadas de falhas retryable e estado PROCESSING nunca fica abandonado sem detector e reconciliation; consumers persistem inbox e efeito local na mesma transação, fazem ack somente após commit, duplicates iguais não reaplicam estado e payload divergente vai para quarantine; efeitos externos são registrados antes do envio, reutilizam ProviderReference estável, outcomes desconhecidos após timeout são reconciliados antes de qualquer retry e nenhum sucesso é inventado; active retention, tombstones e replay horizon definem por quanto tempo a garantia existe, replay revalida autenticação e autorização, observabilidade mede execução, replay, conflito, takeover, duplicate, unknown outcome e recovery sem expor keys ou payloads, e o gate termina com identidades, lifecycle, lease, fencing, semantic intent, inbox, effect ledger, retenção, reconciliation, segurança, testes, arquitetura, documentação e evidence aprovados, enquanto a arquitetura completa de multi-tenancy permanece reservada exclusivamente à aula 638.
```
