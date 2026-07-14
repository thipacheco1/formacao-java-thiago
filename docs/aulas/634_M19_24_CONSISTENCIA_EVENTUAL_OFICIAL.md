# 634 - M19.24 - Consistencia eventual

## Apresentação da aula

Na aula 633, você aprofundou arquitetura orientada a eventos.

Você criou Integration Events, envelope, producer, outbox, relay, broker em memória, consumers, at-least-once, idempotência, ordering, retry, dead letter, checkpoints, lag e tracing. Os consumidores passaram a reagir aos fatos de `Service Scheduling`.

`ServiceAppointmentScheduledV1` pode atualizar comunicação, execução de campo, dashboard e auditoria.

Essas atualizações não acontecem necessariamente no mesmo instante.

Após confirmar o `Appointment`, a aplicação grava estado e outbox, confirma a transação, publica e cada consumer atualiza sua réplica.

Durante esse intervalo, write model, busca, portal e execução podem apresentar versões diferentes.

Isso não significa automaticamente que o sistema está incorreto.

Significa que existe uma janela de inconsistência.

Consistência eventual é uma propriedade em que réplicas, read models ou estados derivados podem divergir temporariamente, mas devem convergir quando novas atualizações cessam e o processamento pendente termina.

A palavra mais importante é:

```text
convergir.
```

Não basta dizer que “uma hora atualiza”. É necessário definir autoridade, duração do atraso, leitura forte, read-your-writes, regressão, reconciliation, UX e prova de convergência.

Consistência eventual não autoriza atraso ilimitado, perda, conflito silencioso, ausência de observabilidade ou uso de read model stale para invariantes.

A pergunta desta aula será:

```text
como projetar
e operar
estados que divergem temporariamente

mas convergem
com regras explícitas,
limites,
evidências
e recuperação?
```

O laboratório será:

```text
labs/m19/aula-634-consistencia-eventual/service-scheduling-convergence
```

Você construirá write model autoritativo, event log, três réplicas, fila de replicação, estado versionado, garantias de leitura, lag, reconciliation, repair, verifier, UX, testes e gate.

As réplicas serão `OperationalSchedulingView`, `CustomerAppointmentView` e `FieldExecutionPreparationView`; a autoridade será `AppointmentWriteState`.

Serão usados eventos de agendamento, confirmação, reagendamento e cancelamento.

A próxima aula oficial será:

```text
635 - M19.25 - CAP
```

CAP formal, CP versus AP, quorums, split brain, linearizability e consenso ficam fora do escopo.

A aula 636 será:

```text
636 - M19.26 - PACELC
```

PACELC, classificações e trade-offs formais de latência ficam para a aula 636.

Regra central:

```text
consistência eventual
não é ausência de consistência;

é um modelo
com convergência,
janela de atraso,
fonte autoritativa,
observabilidade
e recuperação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
632:
Event Sourcing conceitual.

633:
Arquitetura orientada a eventos.

634:
Consistencia eventual.

635:
CAP.

636:
PACELC.
```

A progressão é:

```text
persistir fatos;

distribuir reações;

entender divergência temporária;

avaliar partições;

avaliar latência e consistência.
```

Nesta aula serão praticados autoridade, réplicas versionadas, convergência, stale reads, bounded staleness, read-your-writes, monotonic reads, reconciliation, repair, lag e UX. CAP e PACELC não serão aprofundados.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-634-consistencia-eventual/service-scheduling-convergence
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/consistency
│   │           ├── write
│   │           │   ├── AppointmentWriteState.java
│   │           │   ├── AppointmentWriteStore.java
│   │           │   ├── InMemoryAppointmentWriteStore.java
│   │           │   ├── WriteVersion.java
│   │           │   └── WriteResult.java
│   │           ├── event
│   │           │   ├── ReplicationEvent.java
│   │           │   ├── ReplicationEnvelope.java
│   │           │   ├── ReplicationPosition.java
│   │           │   └── InMemoryReplicationLog.java
│   │           ├── replica
│   │           │   ├── ReplicaName.java
│   │           │   ├── ReplicaState.java
│   │           │   ├── ReplicaStore.java
│   │           │   ├── InMemoryReplicaStore.java
│   │           │   ├── ReplicaProjector.java
│   │           │   ├── ReplicaCheckpoint.java
│   │           │   ├── ReplicaLag.java
│   │           │   └── ReplicaHealth.java
│   │           ├── read
│   │           │   ├── AppointmentReadService.java
│   │           │   ├── ReadConsistency.java
│   │           │   ├── ReadRequest.java
│   │           │   ├── ReadResult.java
│   │           │   ├── Staleness.java
│   │           │   ├── ConsistencyToken.java
│   │           │   ├── SessionConsistency.java
│   │           │   └── ReadTimeout.java
│   │           ├── convergence
│   │           │   ├── ConvergenceVerifier.java
│   │           │   ├── ConvergenceResult.java
│   │           │   ├── ReconciliationJob.java
│   │           │   ├── ReconciliationFinding.java
│   │           │   ├── RepairCommand.java
│   │           │   ├── RepairService.java
│   │           │   └── DivergenceClassifier.java
│   │           ├── ux
│   │           │   ├── ConsistencyIndicator.java
│   │           │   ├── AppointmentViewResponse.java
│   │           │   └── StaleDataMessage.java
│   │           └── application
│   │               ├── ConfirmAppointmentService.java
│   │               ├── RescheduleAppointmentService.java
│   │               ├── ReplicationWorker.java
│   │               └── ConvergenceScenarioRunner.java
│   └── test
│       └── java
│           └── br/com/formacao/consistency
│               ├── write
│               │   └── AuthoritativeWriteStateTest.java
│               ├── replica
│               │   ├── ReplicaProjectionTest.java
│               │   ├── ReplicaOrderingTest.java
│               │   └── ReplicaLagTest.java
│               ├── read
│               │   ├── EventualReadTest.java
│               │   ├── ReadYourWritesTest.java
│               │   ├── MonotonicReadsTest.java
│               │   ├── BoundedStalenessTest.java
│               │   └── StrongReadFallbackTest.java
│               ├── convergence
│               │   ├── ConvergenceVerifierTest.java
│               │   ├── ReconciliationJobTest.java
│               │   ├── RepairServiceTest.java
│               │   └── PermanentDivergenceTest.java
│               └── architecture
│                   ├── AuthoritativeSourceBoundaryTest.java
│                   ├── ReadModelAuthorityTest.java
│                   ├── ConsistencyPolicyTest.java
│                   └── CapNonAnticipationTest.java
├── consistency
│   ├── CONSISTENCY_CHARTER.md
│   ├── AUTHORITATIVE_SOURCE.md
│   ├── REPLICA_CATALOG.md
│   ├── CONVERGENCE_MODEL.md
│   ├── STALENESS_BUDGET.md
│   ├── READ_CONSISTENCY_OPTIONS.md
│   ├── READ_YOUR_WRITES.md
│   ├── MONOTONIC_READS.md
│   ├── SESSION_GUARANTEES.md
│   ├── RECONCILIATION_POLICY.md
│   ├── REPAIR_POLICY.md
│   ├── UX_POLICY.md
│   ├── OBSERVABILITY.md
│   ├── SECURITY_POLICY.md
│   ├── OPERATING_MODEL.md
│   ├── FAILURE_RECOVERY.md
│   ├── TRADE_OFFS.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_CONSISTENCY_QUESTIONS.md
├── contracts
│   ├── eventual-consistency-contract.yaml
│   ├── authoritative-source-policy.yaml
│   ├── replica-policy.yaml
│   ├── convergence-policy.yaml
│   ├── staleness-budget-policy.yaml
│   ├── read-consistency-policy.yaml
│   ├── read-your-writes-policy.yaml
│   ├── monotonic-reads-policy.yaml
│   ├── reconciliation-policy.yaml
│   ├── repair-policy.yaml
│   ├── ux-policy.yaml
│   ├── observability-policy.yaml
│   ├── security-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── authoritative-state-report.yaml
    ├── replica-lag-report.yaml
    ├── stale-read-report.yaml
    ├── session-guarantee-report.yaml
    ├── reconciliation-report.yaml
    ├── convergence-report.yaml
    ├── architecture-report.yaml
    └── eventual-consistency-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-convergence
├── validate-eventual-consistency-contract.ps1
├── validate-authoritative-source.ps1
├── validate-replica-catalog.ps1
├── validate-convergence-model.ps1
├── validate-staleness-budget.ps1
├── validate-read-consistency-options.ps1
├── validate-read-your-writes.ps1
├── validate-monotonic-reads.ps1
├── validate-reconciliation-policy.ps1
├── validate-repair-policy.ps1
├── validate-consistency-observability.ps1
├── run-eventual-consistency-tests.ps1
├── collect-eventual-consistency-evidence.ps1
└── verify-eventual-consistency-gate.ps1
```

---

## Conceito essencial

### Consistência eventual, autoridade e réplica

Estados derivados podem divergir temporariamente e convergir depois; a fonte autoritativa decide invariantes, enquanto réplicas atendem leituras.

### Staleness e garantias de sessão

Stale read usa versão antiga; budget limita atraso; read-your-writes e monotonic reads protegem a experiência da sessão.

### Token, reconciliation e repair

Consistency Token define versão mínima, reconciliation detecta diferenças e repair corrige réplicas na direção da autoridade.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-634-consistencia-eventual/service-scheduling-convergence

Set-Location `
  labs/m19/aula-634-consistencia-eventual/service-scheduling-convergence
```

---

### 2. Criar Consistency Charter

Arquivo:

```text
consistency/CONSISTENCY_CHARTER.md
```

Conteúdo:

```markdown
# Consistency Charter

## Fonte autoritativa

Appointment Write Store.

## Réplicas

- Operational Scheduling View;
- Customer Appointment View;
- Field Execution Preparation View.

## Modelo

Eventual consistency
para réplicas.

## Leitura forte

Obrigatória para:

- invariantes;
- autorização crítica;
- expected revision;
- decisão de reagendamento;
- decisão de cancelamento.

## Garantias de sessão

- read-your-writes;
- monotonic reads.

## Operação

- lag observável;
- staleness budget;
- reconciliation;
- repair;
- runbook.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/eventual-consistency-contract.yaml
```

Conteúdo:

```yaml
eventualConsistency:
  context:
    Service-Scheduling

  required:
    - authoritative-source
    - replica-catalog
    - versioned-state
    - convergence-model
    - staleness-budget
    - read-consistency-options
    - read-your-writes
    - monotonic-reads
    - lag-observability
    - reconciliation
    - repair
    - UX-policy
    - tests
    - architecture-rules

  forbidden:
    - replica-as-domain-authority
    - hidden-staleness
    - infinite-wait-for-convergence
    - version-regression
    - silent-repair
    - unauthorized-strong-read
    - CAP-deep-dive
    - PACELC-deep-dive

  nextLesson:
    code:
      M19.25
```

---

### 4. Definir fonte autoritativa

Arquivo:

```text
consistency/AUTHORITATIVE_SOURCE.md
```

Decisão:

```text
AppointmentWriteState
é a fonte autoritativa
do ciclo de vida
do Appointment.
```

Somente ela decide transições, janela, reserva, revisão, invariantes, autorização baseada no estado e expected revision. Réplicas servem à leitura e integração.

---

### 5. Criar Authoritative State

```java
public record AppointmentWriteState(
        UUID appointmentId,
        AppointmentStatus status,
        Instant startsAt,
        Instant endsAt,
        UUID capacityReservationId,
        WriteVersion version,
        Instant committedAt) {

    public AppointmentWriteState {
        Objects.requireNonNull(appointmentId);
        Objects.requireNonNull(status);
        Objects.requireNonNull(startsAt);
        Objects.requireNonNull(endsAt);
        Objects.requireNonNull(capacityReservationId);
        Objects.requireNonNull(version);
        Objects.requireNonNull(committedAt);
    }
}
```

A versão aumenta a cada mudança confirmada.

---

### 6. Criar Write Version

```java
public record WriteVersion(
        long value)
        implements Comparable<WriteVersion> {

    public WriteVersion {
        if (value < 1) {
            throw new IllegalArgumentException(
                    "Write version must be positive");
        }
    }

    public WriteVersion next() {
        return new WriteVersion(
                value + 1);
    }

    @Override
    public int compareTo(
            WriteVersion other) {

        return Long.compare(
                value,
                other.value);
    }
}
```

---

### 7. Criar Replica Catalog

Arquivo:

```text
consistency/REPLICA_CATALOG.md
```

Exemplo:

```text
Replica:
Operational Scheduling View.

Owner:
Scheduling Operations.

Purpose:
search and operational list.

Source:
Service Scheduling events.

Target lag:
5 seconds.

Maximum tolerated lag:
30 seconds.

Read-your-writes:
not guaranteed for global search.

Repair:
rebuild by Appointment ID.
```


---

### 8. Criar replica policy

Arquivo:

```text
contracts/replica-policy.yaml
```

Conteúdo:

```yaml
replica:
  requires:
    - name
    - owner
    - purpose
    - source
    - version
    - checkpoint
    - lag-target
    - repair-strategy

  mayServe:
    - list
    - dashboard
    - search
    - customer-view

  forbiddenAsAuthorityFor:
    - invariant
    - expected-revision
    - critical-authorization
    - state-transition
```

---

### 9. Criar Replica State

```java
public record ReplicaState(
        ReplicaName replica,
        UUID appointmentId,
        String status,
        Instant startsAt,
        Instant endsAt,
        WriteVersion sourceVersion,
        ReplicationPosition position,
        Instant projectedAt) {
}
```

`sourceVersion` indica qual versão autoritativa foi projetada.

`position` indica até onde o fluxo foi processado.

---

### 10. Criar Replication Event

```java
public record ReplicationEnvelope(
        UUID eventId,
        UUID appointmentId,
        WriteVersion sourceVersion,
        Instant committedAt,
        ReplicationPosition position,
        ReplicationEvent event) {
}
```

O evento contém versão da fonte.

Isso permite detectar duplicação, regressão, lacuna, atraso e convergência.

---

### 11. Criar Projector

```java
public final class ReplicaProjector {

    private final ReplicaStore store;

    public ProjectionResult project(
            ReplicaName replica,
            ReplicationEnvelope envelope) {

        Optional<ReplicaState> current =
                store.find(
                        replica,
                        envelope.appointmentId());

        if (current.isPresent()
                && current.get()
                        .sourceVersion()
                        .compareTo(
                                envelope.sourceVersion())
                        >= 0) {

            return ProjectionResult
                    .ignoredOlderOrDuplicate(
                            envelope.eventId());
        }

        ReplicaState next =
                apply(
                        replica,
                        current,
                        envelope);

        store.upsert(next);

        return ProjectionResult.applied(
                envelope.eventId(),
                envelope.sourceVersion());
    }
}
```

A réplica nunca pode regredir de versão.

---

### 12. Criar convergence policy

Arquivo:

```text
contracts/convergence-policy.yaml
```

Conteúdo:

```yaml
convergence:
  source:
    authoritative-write-state

  replica:
    mustReach:
      source-version

  whenUpdatesStop:
    expected:
      all-healthy-replicas-converge

  versionRegression:
    forbidden

  duplicateEvent:
    idempotentIgnore:
      required

  missingVersion:
    action:
      RETRY_THEN_RECONCILE

  permanentDifference:
    action:
      FINDING_AND_REPAIR
```

---

### 13. O que significa convergir

Convergência exige que todas as réplicas alcancem a versão autoritativa, mas versões iguais podem esconder conteúdo incorreto.

Compare também status, janela, reserva e checksum.

Uma projection com bug pode gravar versão 8 com dados errados.

---

### 14. Criar Convergence Verifier

```java
public final class ConvergenceVerifier {

    private final AppointmentWriteStore writeStore;
    private final ReplicaStore replicaStore;

    public ConvergenceResult verify(
            UUID appointmentId) {

        AppointmentWriteState source =
                writeStore.findById(
                                appointmentId)
                        .orElseThrow();

        List<ReplicaComparison> comparisons =
                replicaStore.findAll(
                                appointmentId)
                        .stream()
                        .map(replica ->
                                compare(
                                        source,
                                        replica))
                        .toList();

        return ConvergenceResult.from(
                source,
                comparisons);
    }
}
```

---

### 15. Comparar versão e conteúdo

```java
private ReplicaComparison compare(
        AppointmentWriteState source,
        ReplicaState replica) {

    boolean versionMatches =
            source.version()
                    .equals(
                            replica.sourceVersion());

    boolean valuesMatch =
            source.status()
                            .name()
                            .equals(replica.status())
                    && source.startsAt()
                            .equals(replica.startsAt())
                    && source.endsAt()
                            .equals(replica.endsAt());

    return new ReplicaComparison(
            replica.replica(),
            versionMatches,
            valuesMatch,
            source.version(),
            replica.sourceVersion());
}
```

---

### 16. Stale Read

Um read model está stale quando apresenta versão anterior à autoridade.

Exemplo:

```text
source version:
12.

replica version:
10.
```

Staleness pode usar version lag, time lag e idade desde o commit.

---

### 17. Criar Staleness

```java
public record Staleness(
        long versionLag,
        Duration projectionAge,
        Duration sourceCommitAge,
        boolean withinBudget) {
}
```


---

### 18. Criar Staleness Budget

Arquivo:

```text
consistency/STALENESS_BUDGET.md
```

Exemplo:

```text
Operational Search:
target 5 seconds;
maximum 30 seconds.

Customer Details:
target immediate;
maximum 3 seconds.

Field Preparation:
target 10 seconds;
maximum 60 seconds.

Audit:
target 30 seconds;
maximum 5 minutes.
```


---

### 19. Criar budget policy

Arquivo:

```text
contracts/staleness-budget-policy.yaml
```

Conteúdo:

```yaml
stalenessBudget:
  operationalSearch:
    targetSeconds:
      5
    maximumSeconds:
      30

  customerDetails:
    targetSeconds:
      0
    maximumSeconds:
      3

  fieldPreparation:
    targetSeconds:
      10
    maximumSeconds:
      60

  exceeded:
    requires:
      - indicator
      - metric
      - alert
      - fallback-or-error
```

---

### 20. Opções de leitura

```java
public enum ReadConsistency {
    EVENTUAL,
    BOUNDED_STALENESS,
    READ_YOUR_WRITES,
    MONOTONIC_SESSION,
    AUTHORITATIVE
}
```


Não exponha todas as opções indiscriminadamente ao cliente.

---

### 21. Eventual Read

```java
public ReadResult readEventual(
        ReplicaName replica,
        UUID appointmentId) {

    return replicaStore.find(
                    replica,
                    appointmentId)
            .map(ReadResult::fromReplica)
            .orElseGet(
                    ReadResult::notAvailableYet);
}
```

É rápida, mas pode retornar versão antiga ou ausência temporária.

---

### 22. Bounded Staleness

```java
public ReadResult readWithinBudget(
        ReplicaName replica,
        UUID appointmentId,
        Duration maximumStaleness) {

    ReplicaState state =
            replicaStore.find(
                            replica,
                            appointmentId)
                    .orElseThrow(
                            ReplicaStateUnavailable::new);

    Staleness staleness =
            calculateStaleness(
                    state);

    if (!staleness.withinBudget()) {
        return ReadResult.staleBeyondBudget(
                state,
                staleness);
    }

    return ReadResult.available(
            state,
            staleness);
}
```

A policy decide entre erro, fallback autoritativo, espera limitada ou resposta stale com aviso.

---

### 23. Criar read consistency policy

Arquivo:

```text
contracts/read-consistency-policy.yaml
```

Conteúdo:

```yaml
readConsistency:
  operationalList:
    mode:
      EVENTUAL

  customerDetails:
    mode:
      READ_YOUR_WRITES

  reschedulingDecision:
    mode:
      AUTHORITATIVE

  fieldPreparation:
    mode:
      BOUNDED_STALENESS

  auditTimeline:
    mode:
      EVENTUAL

  indefiniteWait:
    forbidden

  undocumentedFallback:
    forbidden
```

---

### 24. Read Your Writes

Após confirmar o Appointment, a resposta pode devolver:

```text
Consistency Token:
Appointment ID = 42;
minimum version = 9.
```

A próxima leitura usa esse token.

---

### 25. Criar Consistency Token

```java
public record ConsistencyToken(
        UUID appointmentId,
        WriteVersion minimumVersion,
        Instant issuedAt,
        Instant expiresAt) {

    public ConsistencyToken {
        if (!expiresAt.isAfter(issuedAt)) {
            throw new IllegalArgumentException(
                    "Token expiration must be later");
        }
    }
}
```

O token não contém dado sensível nem substitui autorização.

---

### 26. Leitura com token

```java
public ReadResult readYourWrites(
        ReplicaName replica,
        ConsistencyToken token,
        ReadTimeout timeout) {

    Instant deadline =
            clock.now()
                    .plus(timeout.duration());

    while (clock.now().isBefore(deadline)) {

        Optional<ReplicaState> state =
                replicaStore.find(
                        replica,
                        token.appointmentId());

        if (state.isPresent()
                && state.get()
                        .sourceVersion()
                        .compareTo(
                                token.minimumVersion())
                        >= 0) {

            return ReadResult.available(
                    state.get(),
                    calculateStaleness(
                            state.get()));
        }

        waiter.pause(
                Duration.ofMillis(50));
    }

    return fallbackAfterTimeout(
            token);
}
```

Em produção, use espera eficiente; o loop apenas demonstra a semântica.

---

### 27. Estratégias de Read Your Writes

Opções incluem projection síncrona, wait-until-version, fallback autoritativo, sticky session, polling ou resposta mínima. Sempre defina timeout.

---

### 28. Criar read-your-writes policy

Arquivo:

```text
contracts/read-your-writes-policy.yaml
```

Conteúdo:

```yaml
readYourWrites:
  token:
    minimum-version:
      required

  wait:
    timeoutMilliseconds:
      1500

  afterTimeout:
    fallback:
      AUTHORITATIVE_READ

  token:
    expirationMinutes:
      5

  authorization:
    recheck:
      required

  infiniteWait:
    forbidden
```

---

### 29. Monotonic Reads

Uma sessão leu versão 10.

A próxima leitura não deve retornar versão 9.

Isso ocorre quando requests atingem réplicas ou caches com versões diferentes.

---

### 30. Criar Session Consistency

```java
public final class SessionConsistency {

    private final Map<UUID, WriteVersion>
            highestSeen =
            new ConcurrentHashMap<>();

    public void observe(
            UUID appointmentId,
            WriteVersion version) {

        highestSeen.merge(
                appointmentId,
                version,
                (current, candidate) ->
                        current.compareTo(candidate) >= 0
                                ? current
                                : candidate);
    }

    public Optional<WriteVersion> minimumFor(
            UUID appointmentId) {

        return Optional.ofNullable(
                highestSeen.get(
                        appointmentId));
    }
}
```

---

### 31. Monotonic Read Service

Ao receber versão inferior, tente outra réplica, aguarde, use autoridade ou falhe explicitamente.

---

### 32. Criar monotonic policy

Arquivo:

```text
contracts/monotonic-reads-policy.yaml
```

Conteúdo:

```yaml
monotonicReads:
  session:
    trackHighestVersion:
      required

  lowerVersion:
    forbidden

  fallbackOrder:
    - alternate-replica
    - bounded-wait
    - authoritative-read
    - explicit-failure

  silentRegression:
    forbidden
```

---

### 33. Session Guarantees

O laboratório implementa read-your-writes e monotonic reads; outras garantias de sessão serão apenas documentadas.

---

### 34. Réplica ausente

Após criação:

```text
write state existe;
replica ainda não.
```

A API precisa diferenciar:

```text
NOT_FOUND:
não existe na autoridade.

NOT_AVAILABLE_YET:
existe,
mas a réplica ainda não convergiu.
```


---

### 35. Criar Read Result

```java
public sealed interface ReadResult {

    record Available(
            ReplicaState state,
            Staleness staleness)
            implements ReadResult {
    }

    record NotAvailableYet(
            UUID appointmentId)
            implements ReadResult {
    }

    record StaleBeyondBudget(
            ReplicaState state,
            Staleness staleness)
            implements ReadResult {
    }

    record AuthoritativeFallback(
            AppointmentWriteState state)
            implements ReadResult {
    }

    record Failed(
            String safeCode)
            implements ReadResult {
    }
}
```

---

### 36. UX para stale data

A interface pode apresentar:

```text
Atualização em processamento.

Dados atualizados há 8 segundos.

A confirmação foi concluída,
mas esta lista ainda está sincronizando.

Tente novamente
ou abra os detalhes atualizados.
```

Evite expor termos técnicos de broker e checkpoint ao usuário.

---

### 37. Criar UX Policy

Arquivo:

```text
contracts/ux-policy.yaml
```

Conteúdo:

```yaml
ux:
  staleData:
    visible:
      required

  technicalTerms:
    forbidden:
      - consumer-lag
      - offset
      - broker-partition
      - projection-checkpoint

  commandSuccess:
    mustNotBePresentedAsFailureBecauseListIsStale:
      true

  temporaryAbsence:
    distinguishFromNotFound:
      required

  retry:
    actionable:
      required
```

---

### 38. Reconciliation

Replication Worker processa eventos.

Mesmo com retry, bugs, eventos perdidos, schemas incompatíveis, corrupção ou checkpoints incorretos podem gerar divergência permanente.

Reconciliation compara autoridade e réplicas.

---

### 39. Criar Reconciliation Job

```java
public final class ReconciliationJob {

    private final AppointmentWriteStore source;
    private final ReplicaStore replicas;
    private final DivergenceClassifier classifier;

    public ReconciliationReport run(
            Collection<UUID> appointmentIds) {

        List<ReconciliationFinding> findings =
                new ArrayList<>();

        for (UUID appointmentId : appointmentIds) {

            AppointmentWriteState authoritative =
                    source.findById(
                                    appointmentId)
                            .orElseThrow();

            for (ReplicaState replica :
                    replicas.findAll(
                            appointmentId)) {

                classifier.classify(
                                authoritative,
                                replica)
                        .ifPresent(
                                findings::add);
            }
        }

        return ReconciliationReport.from(
                findings);
    }
}
```

---

### 40. Classificar divergência

Classifique lag temporário, réplica ausente, versão antiga ou nova demais, mismatch, checkpoint incorreto, schema desconhecido e corrupção.

Lag dentro do budget pode apenas ser observado.

---

### 41. Criar reconciliation policy

Arquivo:

```text
contracts/reconciliation-policy.yaml
```

Conteúdo:

```yaml
reconciliation:
  schedule:
    everyMinutes:
      15

  compare:
    - source-version
    - status
    - window
    - reservation
    - checksum

  temporaryLagWithinBudget:
    action:
      OBSERVE

  olderBeyondBudget:
    action:
      REPROCESS_OR_REPAIR

  valueMismatchSameVersion:
    action:
      QUARANTINE_AND_REPAIR

  replicaNewerThanSource:
    action:
      CRITICAL_ALERT

  finding:
    owner:
      required
```

---

### 42. Repair

Repair não deve alterar a fonte autoritativa para combinar com a réplica.

O fluxo normal é:

```text
autoridade
-> réplica.
```

Repair pode usar replay, rebuild, replace com expected version ou migração auditada.

---

### 43. Criar Repair Command

```java
public record RepairCommand(
        ReplicaName replica,
        UUID appointmentId,
        WriteVersion expectedReplicaVersion,
        String findingId,
        ActorContext actor,
        String justification) {
}
```

O comando exige autorização, expected version, finding, justificativa e auditoria.

---

### 44. Criar Repair Service

```java
public final class RepairService {

    private final AppointmentWriteStore source;
    private final ReplicaStore replicas;
    private final RepairAuthorization authorization;

    public RepairResult repair(
            RepairCommand command) {

        authorization.requireAllowed(
                command.actor(),
                "REPAIR_REPLICA");

        AppointmentWriteState authoritative =
                source.findById(
                                command.appointmentId())
                        .orElseThrow();

        replicas.replaceIfVersion(
                command.replica(),
                map(
                        command.replica(),
                        authoritative),
                command.expectedReplicaVersion());

        return RepairResult.completed(
                command.findingId(),
                authoritative.version());
    }
}
```

---

### 45. Criar repair policy

Arquivo:

```text
contracts/repair-policy.yaml
```

Conteúdo:

```yaml
repair:
  direction:
    authoritative-to-replica

  requires:
    - finding-id
    - authorization
    - expected-replica-version
    - justification
    - audit
    - post-repair-verification

  sourceMutationToMatchReplica:
    forbidden

  blindOverwrite:
    forbidden

  bulkRepair:
    rateLimited:
      required
```

---

### 46. Convergência automática versus reparo

Convergência normal ocorre pelo fluxo de eventos.

Repair é exceção operacional.

Repairs frequentes indicam bug de projection, entrega, contrato, ordering ou checkpoint.


---

### 47. Conflitos

Neste laboratório, existe uma única fonte autoritativa por Appointment.

Réplicas não aceitam writes de negócio.

Isso reduz conflitos.

Múltiplos writers exigem políticas adicionais de ownership e merge, não aprofundadas nesta aula.

---

### 48. Last Write Wins

LWW escolhe a escrita de maior timestamp.

LWW pode perder intenção por relógios divergentes ou sobrescrita.

Não use LWW por padrão para invariantes de negócio.

---

### 49. Observabilidade

Observe version lag, time lag, idade pendente, throughput, retries, dead letters, findings, repairs, fallbacks, stale responses e timeouts.

---

### 50. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  perReplica:
    required:
      - source-version
      - replica-version
      - version-lag
      - time-lag
      - oldest-pending-age
      - processing-rate
      - failure-rate

  reads:
    required:
      - consistency-mode
      - stale-response-count
      - authoritative-fallback-count
      - read-your-writes-timeout
      - monotonic-regression-prevented

  repair:
    required:
      - finding-id
      - actor
      - outcome

  forbidden:
    - raw-personal-data
    - token
    - secret
```

---

### 51. Alertas

Exemplos:

```text
Operational View lag > 30s:
warning.

Customer View lag > 3s:
critical.

Field View missing > 60s:
critical.

Replica newer than source:
critical.

Same version, different checksum:
critical.

Read-your-writes timeout rate > 1%:
warning.
```

Alertas seguem risco de negócio.

---

### 52. Segurança

Leitura autoritativa é mais cara e sensível; não permita que qualquer cliente a force.

Defina autorização, rate limit, tenant, purpose, timeout, auditoria e campos permitidos.

---

### 53. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

Conteúdo:

```yaml
security:
  authoritativeRead:
    authorization:
      required
    rateLimit:
      required
    audit:
      required

  consistencyToken:
    signed:
      recommended
    containsSensitiveData:
      forbidden
    authorizationReplacement:
      false

  repair:
    privileged:
      true

  crossTenantReplicaRead:
    forbidden
```

---

### 54. Falhas do worker

Workers podem falhar por indisponibilidade, evento malformado, lacuna, timeout, checkpoint ou lote parcial.


---

### 55. Falha depois da escrita da réplica

Fluxo:

```text
replica atualizada;

checkpoint não confirmado;

evento entregue novamente.
```

Event ID e source version tornam a repetição segura.

---

### 56. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  replicaStoreUnavailable:
    action:
      RETRY

  malformedEvent:
    action:
      QUARANTINE

  duplicateEvent:
    action:
      IDEMPOTENT_ACK

  olderVersion:
    action:
      IGNORE_AND_REPORT

  missingVersion:
    action:
      RETRY_THEN_RECONCILE

  sameVersionDifferentValue:
    action:
      QUARANTINE_AND_REPAIR

  readYourWritesTimeout:
    action:
      AUTHORITATIVE_FALLBACK

  authoritativeFallbackUnavailable:
    action:
      EXPLICIT_FAILURE

  CAPDeepDive:
    deferredToLesson635

  PACELCDeepDive:
    deferredToLesson636
```

---

### 57. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  replicaAsAuthority:
    action:
      FAIL

  versionRegression:
    action:
      FAIL

  hiddenStaleRead:
    action:
      FAIL

  sameVersionDifferentValue:
    action:
      FAIL

  repairWithoutFinding:
    action:
      FAIL

  repairWithoutAuthorization:
    action:
      FAIL

  unboundedWait:
    action:
      FAIL

  missingStalenessBudget:
    action:
      FAIL
```

---

### 58. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson635:
    forbidden:
      - CAP-formal-proof
      - CP-AP-classification
      - quorum-read-write
      - network-partition-simulation
      - linearizability-analysis

  lesson636:
    forbidden:
      - PACELC-formalization
      - latency-consistency-classification
      - database-PACELC-matrix

  allowed:
    - replica-lag
    - bounded-staleness
    - session-guarantee
    - reconciliation
    - repair
```

---

### 59. Testar Eventual Read

Cenário:

1. write version 4;
2. replica version 3;
3. eventual read retorna versão 3;
4. resultado contém staleness;
5. nenhuma falsa promessa de freshness.

---

### 60. Testar convergência

Cenário:

1. três replicas na versão 5;
2. write muda para 6;
3. filas recebem evento;
4. replicas processam em ritmos diferentes;
5. verifier mostra divergência temporária;
6. workers terminam;
7. todas chegam à versão 6;
8. conteúdo e checksum coincidem.

---

### 61. Testar Read Your Writes

Cenário:

1. command confirma Appointment;
2. write retorna token versão 7;
3. customer replica ainda está em 6;
4. read aguarda;
5. replica chega a 7;
6. resposta retorna versão 7.

Teste também timeout e fallback autoritativo.

---

### 62. Testar Monotonic Reads

Cenário:

1. sessão lê versão 9;
2. request seguinte chega a replica versão 8;
3. serviço rejeita regressão;
4. tenta outra réplica;
5. retorna versão 9 ou superior.

---

### 63. Testar Bounded Staleness

Cenário:

```text
budget:
3 segundos.

replica:
8 segundos atrasada.
```

A resposta deve:

- usar fallback;
- mostrar aviso;
- ou falhar explicitamente;

conforme policy.

---

### 64. Testar ausência temporária

Confirme:

- autoridade contém Appointment;
- réplica ainda não contém;
- resultado é `NotAvailableYet`;
- não é `NotFound`;
- UX apresenta sincronização.

---

### 65. Testar ordering

Entregue versões:

```text
10;
12;
11.
```

A projection:

- aplica 10;
- detecta lacuna em 12;
- aguarda 11;
- aplica 11;
- aplica 12;
- nunca regrede.

---

### 66. Testar Reconciliation

Introduza:

- réplica antiga;
- mesma versão com status incorreto;
- réplica ausente;
- réplica mais nova que fonte.

Valide categorias e severidade.

---

### 67. Testar Repair

Confirme:

- autorização;
- finding obrigatório;
- expected replica version;
- replacement pela autoridade;
- auditoria;
- verificação posterior;
- falha em concorrência.

---

### 68. Testar divergência permanente

Pause um worker.

Confirme:

- lag ultrapassa budget;
- alerta;
- reconciliation finding;
- repair ou reprocessamento;
- convergence verifier retorna sucesso após recuperação.

---

### 69. Testar arquitetura

```java
@ArchTest
static final ArchRule readModelsMustNotOwnDomainTransitions =
        noClasses()
                .that()
                .resideInAPackage(
                        "..replica..")
                .should()
                .dependOnClassesThat()
                .haveSimpleNameMatching(
                        ".*TransitionPolicy");
```

---

### 70. Validar fonte autoritativa

```powershell
.\scripts\m19\service-scheduling-convergence\validate-authoritative-source.ps1
```

Valide owner, invariantes, revisão, decisões críticas e ausência de autoridade nas réplicas.

---

### 71. Validar replicas

```powershell
.\scripts\m19\service-scheduling-convergence\validate-replica-catalog.ps1
```

Valide propósito, owner, versão, checkpoint, budget, repair e segurança.

---

### 72. Validar convergência

```powershell
.\scripts\m19\service-scheduling-convergence\validate-convergence-model.ps1
```

Valide fonte, versão, conteúdo, duplicate, regressão, lacunas e convergence verifier.

---

### 73. Validar budgets

```powershell
.\scripts\m19\service-scheduling-convergence\validate-staleness-budget.ps1
```

Valide target, máximo, owner, fallback, alertas e UX.

---

### 74. Validar opções de leitura

```powershell
.\scripts\m19\service-scheduling-convergence\validate-read-consistency-options.ps1
```

Valide modo por use case, timeout, fallback, autorização e ausência de espera infinita.

---

### 75. Validar Read Your Writes

```powershell
.\scripts\m19\service-scheduling-convergence\validate-read-your-writes.ps1
```

Valide token, versão mínima, expiração, timeout, fallback e reautorização.

---

### 76. Validar Monotonic Reads

```powershell
.\scripts\m19\service-scheduling-convergence\validate-monotonic-reads.ps1
```

Valide highest seen, regressão, alternate replica, fallback e falha explícita.

---

### 77. Validar reconciliation

```powershell
.\scripts\m19\service-scheduling-convergence\validate-reconciliation-policy.ps1
```

Valide schedule, comparação, classificação, owner e ação.

---

### 78. Validar repair

```powershell
.\scripts\m19\service-scheduling-convergence\validate-repair-policy.ps1
```

Valide direção, autorização, expected version, finding, justificativa, auditoria e pós-verificação.

---

### 79. Validar observabilidade

```powershell
.\scripts\m19\service-scheduling-convergence\validate-consistency-observability.ps1
```

Valide version lag, time lag, idade pendente, fallback, timeout, findings e repairs.

---

### 80. Executar testes

```powershell
.\scripts\m19\service-scheduling-convergence\run-eventual-consistency-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide autoridade, projections, ordering, lag, stale reads, garantias de sessão, reconciliation, repair, convergência e arquitetura.

---

### 81. Criar Reports

Exemplo:

```yaml
eventualConsistency:
  authoritativeAppointments:
    50

  replicas:
    3

  convergedAppointments:
    47

  withinBudget:
    2

  beyondBudget:
    1

  sameVersionValueMismatch:
    0

  readYourWritesTimeouts:
    1

  authoritativeFallbacks:
    1

  repairs:
    0

  result:
    PASS_WITH_ACTIVE_LAG
```

---

### 82. Criar Gate

O gate valida charter, autoridade, réplicas, versões, convergência, budgets, leituras, garantias de sessão, lag, reconciliation, repair, UX, segurança, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

PASS_WITH_ACTIVE_LAG;

FAIL_AUTHORITY;

FAIL_REPLICA_MODEL;

FAIL_CONVERGENCE;

FAIL_STALENESS_BUDGET;

FAIL_READ_CONSISTENCY;

FAIL_READ_YOUR_WRITES;

FAIL_MONOTONIC_READS;

FAIL_RECONCILIATION;

FAIL_REPAIR;

FAIL_UX;

FAIL_SECURITY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 83. Coletar Evidence

Arquivo:

```text
contracts/eventual-consistency-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- authoritative source;
- authoritative entity count;
- replica count;
- converged count;
- within budget count;
- beyond budget count;
- version regression count;
- same version mismatch count;
- read-your-writes timeout count;
- authoritative fallback count;
- reconciliation finding count;
- repair count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- tokens;
- payloads reais;
- connection strings;
- endpoints privados;
- CAP aprofundado;
- PACELC aprofundado.

---

### 84. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-convergence\validate-eventual-consistency-contract.ps1

.\scripts\m19\service-scheduling-convergence\validate-authoritative-source.ps1

.\scripts\m19\service-scheduling-convergence\validate-replica-catalog.ps1

.\scripts\m19\service-scheduling-convergence\validate-convergence-model.ps1

.\scripts\m19\service-scheduling-convergence\validate-staleness-budget.ps1

.\scripts\m19\service-scheduling-convergence\validate-read-consistency-options.ps1

.\scripts\m19\service-scheduling-convergence\validate-read-your-writes.ps1

.\scripts\m19\service-scheduling-convergence\validate-monotonic-reads.ps1

.\scripts\m19\service-scheduling-convergence\validate-reconciliation-policy.ps1

.\scripts\m19\service-scheduling-convergence\validate-repair-policy.ps1

.\scripts\m19\service-scheduling-convergence\validate-consistency-observability.ps1

.\scripts\m19\service-scheduling-convergence\run-eventual-consistency-tests.ps1

.\scripts\m19\service-scheduling-convergence\collect-eventual-consistency-evidence.ps1

.\scripts\m19\service-scheduling-convergence\verify-eventual-consistency-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 85. Encerrar o laboratório

Confirme:

- fonte autoritativa explícita;
- réplicas catalogadas;
- versões presentes;
- zero regressão silenciosa;
- staleness budgets;
- modo de leitura por use case;
- read-your-writes com token;
- timeout e fallback;
- monotonic reads;
- ausência temporária distinta de not found;
- UX para stale data;
- lag observável;
- reconciliation periódica;
- repair autorizado;
- autoridade nunca alterada para combinar com réplica;
- pós-verificação;
- segurança;
- runbooks;
- CAP não aprofundado;
- PACELC não aprofundado;
- reports sanitizados.

---

## Entendendo o que foi feito

### Autoridade e réplicas ganharam fronteiras

O write model decide invariantes; réplicas possuem purpose, owner, versão, checkpoint, lag e repair.

### Leituras ganharam orçamento e garantias

Cada use case define staleness, read-your-writes, monotonic reads, timeout e fallback.

### Divergência e recuperação ganharam política

Lag, ausência, regressão e mismatch são classificados; repair segue autoridade, autorização e auditoria.

### A convergência ganhou prova

Versão, conteúdo, reconciliation e verifier demonstram o estado final.

---

## Erros comuns importantes

### Réplica como autoridade ou staleness oculto

Invariantes podem usar dado antigo e usuários recebem falsa atualidade.

### Espera infinita ou regressão

Read-your-writes bloqueia e sessões voltam a versões anteriores.

### Ausência temporária como not found

A UX informa inexistência indevida.

### Repair sem finding ou na direção errada

A operação perde causa, auditoria e ownership.

### Validar apenas versão

Conteúdo incorreto pode passar despercebido.

### Usar LWW em regra crítica

A intenção pode ser perdida.

### Antecipar CAP

O foco em convergência é perdido.

---

## Comandos úteis

### Validar autoridade

```powershell
.\scripts\m19\service-scheduling-convergence\validate-authoritative-source.ps1
```

### Validar convergência

```powershell
.\scripts\m19\service-scheduling-convergence\validate-convergence-model.ps1
```

### Validar garantias

```powershell
.\scripts\m19\service-scheduling-convergence\validate-read-your-writes.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-convergence\run-eventual-consistency-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-convergence\verify-eventual-consistency-gate.ps1
```

---

## Exercício guiado

Defina autoridade e réplicas, aplique eventos versionados, implemente leituras eventual, bounded e autoritativa, adicione garantias de sessão, UX, reconciliation, repair, observabilidade e gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 633 e ponte para a aula 635 foram preservadas;
- o laboratório `service-scheduling-convergence` foi criado;
- Consistency Charter foi criado;
- fonte autoritativa foi definida;
- réplicas foram catalogadas;
- read models não são autoridade de invariantes;
- estados possuem versão;
- projectors são idempotentes;
- regressão de versão foi proibida;
- duplicates são ignorados com segurança;
- convergence model foi documentado;
- versões e conteúdo são comparados;
- staleness mede versão e tempo;
- staleness budgets foram definidos por uso;
- read consistency options foram criadas;
- leitura eventual foi implementada;
- bounded staleness foi implementada;
- authoritative read foi protegida;
- read-your-writes usa versão mínima;
- Consistency Token foi criado;
- token possui expiração;
- timeout e fallback foram definidos;
- autorização é revalidada;
- monotonic reads registram versão máxima;
- regressão de sessão foi proibida;
- ausência temporária difere de not found;
- UX comunica sincronização;
- reconciliation classifica divergências;
- lag dentro do budget é apenas observado;
- divergência permanente gera finding;
- repair possui finding, autorização e expected version;
- repair segue autoridade para réplica;
- blind overwrite foi proibido;
- pós-verificação foi criada;
- observabilidade mede lag, fallback, timeout, findings e repairs;
- segurança protege leitura autoritativa;
- CAP não foi aprofundado;
- PACELC não foi aprofundado;
- reports, gate e evidence foram criados;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-634-consistencia-eventual/service-scheduling-convergence `
  scripts/m19/service-scheduling-convergence `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|privateEndpoint|connectionString|CAPDeepDive|PACELCDeepDive|quorum|splitBrain"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): modelar consistencia eventual"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- endpoints privados;
- connection strings;
- CAP aprofundado;
- PACELC aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou consistência eventual.

Você criou:

```text
Consistency Charter;

fonte autoritativa;

Replica Catalog;

versioned state;

Replication Events;

Projectors;

Convergence Verifier;

Staleness Budget;

Read Consistency Options;

Consistency Token;

Read Your Writes;

Monotonic Reads;

Session Consistency;

Reconciliation Job;

Repair Service;

UX Policy;

observabilidade;

architecture tests.
```

Você comprovou que consistência eventual depende de convergência verificável; que réplicas não devem decidir invariantes; que stale data precisa de budget e UX; que read-your-writes e monotonic reads exigem versão mínima; que ausência temporária não é not found; que reconciliation detecta diferenças; que repair segue a direção da autoridade; e que lag, fallback, timeout e mismatch precisam ser operáveis.

A próxima aula será:

```text
635 - M19.25 - CAP
```

Nela, você irá aprofundar o que acontece quando um sistema distribuído enfrenta partição de rede e precisa escolher como se comportar em relação à consistência e à disponibilidade.

Nenhum aprofundamento completo de CAP ou PACELC foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini fonte autoritativa.
- [ ] Cataloguei réplicas.
- [ ] Defini staleness budgets.
- [ ] Implementei read-your-writes.
- [ ] Implementei monotonic reads.
- [ ] Diferenciei syncing de not found.
- [ ] Criei reconciliation e repair.
- [ ] Medi convergência e lag.

---

## Troubleshooting adicional

### A lista mostra status antigo

Verifique versão, lag, budget e fallback.

### O usuário não vê a própria confirmação

Use token de versão mínima, timeout e authoritative fallback.

### A sessão voltou para versão anterior

Registre highest seen e tente outra réplica.

### A réplica possui mesma versão e dado diferente

Quarantenize, gere finding e repare.

### O repair sobrescreve atualização nova

Use expected replica version.

### O worker repete evento

Garanta idempotência por Event ID e source version.

### A API retorna 404 logo após criação

Use `NotAvailableYet` quando a autoridade contém o item.

### O lag cresce sem alerta

Crie budget, SLO e oldest pending age.

### A equipe quer resolver tudo com LWW

Revise invariantes e risco de perda de intenção.

### A discussão virou CP versus AP

Preserve CAP para a aula 635.

---

## Perguntas de revisão

1. O que é consistência eventual?
2. O que é convergência?
3. O que é fonte autoritativa?
4. O que é réplica?
5. O que é stale read?
6. O que é staleness budget?
7. O que é read-your-writes?
8. O que é monotonic read?
9. O que é Consistency Token?
10. Por que a réplica não decide invariantes?
11. Versão igual garante conteúdo correto?
12. O que é bounded staleness?
13. Qual diferença entre not found e not available yet?
14. O que é reconciliation?
15. O que é repair?
16. Qual direção normal do repair?
17. Por que timeout é obrigatório?
18. O que deve ser observado?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Divergência temporária com convergência posterior.
2. Réplicas alcançam versão e valores esperados.
3. Estado usado para decisões críticas.
4. Estado derivado ou copiado.
5. Leitura de versão antiga.
6. Atraso máximo tolerado.
7. Ver a própria escrita.
8. Não voltar para versão anterior.
9. Versão mínima exigida pela leitura.
10. Porque pode estar stale.
11. Não.
12. Leitura aceita até um limite.
13. Um não existe; o outro ainda não convergiu.
14. Comparação entre autoridade e réplicas.
15. Correção explícita de réplica.
16. Autoridade para réplica.
17. Para evitar espera infinita.
18. Lag, fallbacks, timeouts, findings e repairs.
19. CAP.
20. CAP.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 634 - M19.24 - Consistencia eventual

- Aprofundei consistência eventual.
- Criei o laboratório `service-scheduling-convergence`.
- Criei Consistency Charter.
- Defini Appointment Write State como fonte autoritativa.
- Cataloguei Operational, Customer e Field replicas.
- Modelei estados e eventos versionados.
- Criei Replica Projector idempotente.
- Proibi regressão de versão.
- Criei Convergence Verifier.
- Comparei versão e conteúdo.
- Modelei Staleness por versão e tempo.
- Defini Staleness Budgets por caso de uso.
- Criei modos Eventual, Bounded, Read Your Writes, Monotonic e Authoritative.
- Criei Consistency Token com versão mínima e expiração.
- Modelei timeout e fallback autoritativo.
- Revalidei autorização na leitura.
- Implementei Monotonic Reads por sessão.
- Diferenciei `NotAvailableYet` de `NotFound`.
- Criei UX Policy para dados stale.
- Criei Reconciliation Job e classificação de divergências.
- Criei Repair Command e Repair Service.
- Mantive direção da autoridade para a réplica.
- Exigi finding, autorização, expected version e auditoria.
- Criei observabilidade para lag, fallback, timeout, findings e repairs.
- Criei testes de convergência, read-your-writes, monotonic reads, reconciliation e repair.
- Criei reports, gate e evidence.
- Não antecipei CAP ou PACELC.
- Próxima aula: CAP.
```

---

## Referência técnica curta

- Eventual Consistency.
- Authoritative Source.
- Replica.
- Stale Read.
- Staleness Budget.
- Read Your Writes.
- Monotonic Reads.
- Consistency Token.
- Reconciliation.
- Repair.

Regra final:

```text
Consistência eventual deve ser projetada como convergência controlada, não como atraso indefinido: o Appointment Write State permanece fonte autoritativa para invariantes, autorização crítica, expected revision e transições, enquanto Operational, Customer e Field replicas são estados derivados com owner, versão, checkpoint, staleness budget e repair definidos; projectors usam Event ID e source version para tolerar duplicação, impedir regressão e detectar lacunas, e o Convergence Verifier compara versão e conteúdo para evitar falsos positivos; cada use case escolhe leitura eventual, bounded staleness, read-your-writes, monotonic session ou authoritative, Consistency Tokens carregam versão mínima com expiração, esperas possuem timeout e fallback, autorização é revalidada e a sessão nunca recebe versão inferior à já observada; `NotAvailableYet` é diferente de `NotFound`, stale data precisa de UX honesta, lag é medido por versão, tempo e idade pendente, reconciliation classifica atrasos, ausência e mismatches, e repair sempre segue da autoridade para a réplica com finding, autorização, expected version, auditoria e pós-verificação; o gate termina com fonte, réplicas, convergência, budgets, garantias de sessão, reconciliation, repair, UX, segurança, testes, arquitetura, documentação e evidence aprovados, enquanto CAP é aprofundado somente na aula 635 e PACELC permanece reservado à aula 636.
```
