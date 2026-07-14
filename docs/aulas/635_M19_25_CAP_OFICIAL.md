# 635 - M19.25 - CAP

## Apresentação da aula

Na aula 634, você aprofundou consistência eventual.

Você modelou fonte autoritativa, réplicas versionadas, budgets, garantias de sessão, reconciliation, repair e convergência. Agora o foco passa da divergência temporária para o comportamento durante partições de rede.

Agora o problema muda.

Considere dois nós responsáveis por `Appointment`. Em condições normais, eles replicam estado. Durante uma partição, continuam executando e recebendo requisições, mas não conseguem coordenar ou confirmar a versão do outro.

Durante a partição, a arquitetura pode recusar operações para preservar consistência ou continuar respondendo e aceitar divergência temporária.

O teorema CAP ajuda a raciocinar sobre esse cenário.

CAP representa:

```text
Consistency;

Availability;

Partition Tolerance.
```

Em um sistema distribuído sujeito a partições, durante a partição, não é possível garantir simultaneamente consistência e disponibilidade para todas as operações.

Em sistemas distribuídos, Partition Tolerance deve ser assumida: mensagens atrasam e partes do sistema ficam isoladas.

A escolha relevante durante a partição tende a ser:

```text
C ou A
por operação,
por dado
e por contexto.
```

CAP não é uma escolha de duas letras para o sistema inteiro. Sistemas CP ainda podem responder a certas operações; sistemas AP podem convergir; consultas e escritas podem ter políticas diferentes; banco, replicação e timeout não eliminam a decisão arquitetural.

A pergunta será como decidir consistência e disponibilidade por operação, dado e risco durante uma partição.

O laboratório será:

```text
labs/m19/aula-635-cap/service-scheduling-cap
```

Você construirá dois nós, estado replicado, controle de partição, políticas de consistência e disponibilidade, coordinators, conflitos, cenários, testes, reports e gate.

O domínio continua sendo `Service Scheduling`.

As operações serão confirmação, reagendamento, cancelamento, detalhes, busca e dashboard.

A próxima aula será `636 - M19.26 - PACELC`.

PACELC, classificações PC/PA/EL/EC e trade-offs de latência em operação normal ficam para a aula 636.

Depois virá `637 - M19.27 - Idempotencia avancada`.

A aula usa apenas idempotência básica. Lifecycle de chaves, inbox, deduplication windows e idempotência semântica ficam para a aula 637.

Regra central: CAP orienta o comportamento de cada operação quando a rede separa componentes que precisam coordenar.

---

## Onde estamos na formação

A sequência oficial passa por arquitetura orientada a eventos, consistência eventual, CAP, PACELC e idempotência avançada.

A progressão vai da convergência para decisões sob partição, latência normal e retries avançados.

Nesta aula serão praticados C, A, P, partição simulada, comportamentos CP e AP, decisões por operação e risco, além de noções introdutórias de quorum e linearizability. PACELC e idempotência avançada não serão aprofundados.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-635-cap/service-scheduling-cap
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/cap
│   │           ├── domain
│   │           │   ├── AppointmentId.java
│   │           │   ├── AppointmentStatus.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── AppointmentVersion.java
│   │           │   ├── AppointmentState.java
│   │           │   ├── ConfirmationDecision.java
│   │           │   ├── ReschedulingDecision.java
│   │           │   └── CancellationDecision.java
│   │           ├── node
│   │           │   ├── SchedulingNode.java
│   │           │   ├── NodeId.java
│   │           │   ├── NodeStatus.java
│   │           │   ├── LocalAppointmentStore.java
│   │           │   ├── InMemoryLocalAppointmentStore.java
│   │           │   ├── NodeResponse.java
│   │           │   └── NodeClock.java
│   │           ├── network
│   │           │   ├── NetworkLink.java
│   │           │   ├── NetworkState.java
│   │           │   ├── PartitionController.java
│   │           │   ├── ReplicationMessage.java
│   │           │   ├── ReplicationChannel.java
│   │           │   └── InMemoryReplicationChannel.java
│   │           ├── consistency
│   │           │   ├── CapConsistencyMode.java
│   │           │   ├── StrongWriteCoordinator.java
│   │           │   ├── AvailableWriteCoordinator.java
│   │           │   ├── ReadCoordinator.java
│   │           │   ├── ConsistencyRequirement.java
│   │           │   ├── AvailabilityRequirement.java
│   │           │   ├── PartitionDecision.java
│   │           │   └── OperationPolicy.java
│   │           ├── conflict
│   │           │   ├── AppointmentConflict.java
│   │           │   ├── ConflictType.java
│   │           │   ├── ConflictRegister.java
│   │           │   ├── InMemoryConflictRegister.java
│   │           │   └── ConflictResolver.java
│   │           ├── scenario
│   │           │   ├── CapScenario.java
│   │           │   ├── PartitionScenarioRunner.java
│   │           │   ├── ScenarioObservation.java
│   │           │   └── ScenarioResult.java
│   │           └── observability
│   │               ├── CapDecisionLog.java
│   │               ├── PartitionMetric.java
│   │               ├── AvailabilityMetric.java
│   │               └── ConsistencyMetric.java
│   └── test
│       └── java
│           └── br/com/formacao/cap
│               ├── consistency
│               │   ├── StrongWriteDuringPartitionTest.java
│               │   ├── AvailableWriteDuringPartitionTest.java
│               │   ├── StaleReadDuringPartitionTest.java
│               │   ├── OperationLevelCapDecisionTest.java
│               │   └── PartitionRecoveryTest.java
│               ├── conflict
│               │   ├── ConcurrentRescheduleConflictTest.java
│               │   ├── CancelVersusConfirmConflictTest.java
│               │   └── ConflictRegisterTest.java
│               ├── scenario
│               │   ├── CustomerPortalScenarioTest.java
│               │   ├── OperationalDashboardScenarioTest.java
│               │   └── FieldExecutionScenarioTest.java
│               └── architecture
│                   ├── CapBoundaryTest.java
│                   ├── BusinessPolicyOwnershipTest.java
│                   ├── PacelcNonAnticipationTest.java
│                   └── AdvancedIdempotencyNonAnticipationTest.java
├── cap
│   ├── CAP_CHARTER.md
│   ├── CAP_TERMS.md
│   ├── OPERATION_DECISION_MATRIX.md
│   ├── PARTITION_SCENARIOS.md
│   ├── CONSISTENCY_REQUIREMENTS.md
│   ├── AVAILABILITY_REQUIREMENTS.md
│   ├── PARTITION_BEHAVIOR.md
│   ├── CONFLICT_MODEL.md
│   ├── RECOVERY_POLICY.md
│   ├── UX_POLICY.md
│   ├── OBSERVABILITY.md
│   ├── SECURITY_POLICY.md
│   ├── OPERATING_MODEL.md
│   ├── FAILURE_RECOVERY.md
│   ├── TRADE_OFFS.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_CAP_QUESTIONS.md
├── contracts
│   ├── cap-contract.yaml
│   ├── consistency-policy.yaml
│   ├── availability-policy.yaml
│   ├── partition-policy.yaml
│   ├── operation-decision-policy.yaml
│   ├── conflict-policy.yaml
│   ├── recovery-policy.yaml
│   ├── ux-policy.yaml
│   ├── observability-policy.yaml
│   ├── security-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── partition-scenario-report.yaml
    ├── consistency-decision-report.yaml
    ├── availability-decision-report.yaml
    ├── conflict-report.yaml
    ├── recovery-report.yaml
    ├── architecture-report.yaml
    └── cap-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-cap
├── validate-cap-contract.ps1
├── validate-operation-decisions.ps1
├── validate-consistency-requirements.ps1
├── validate-availability-requirements.ps1
├── validate-partition-behavior.ps1
├── validate-conflict-model.ps1
├── validate-recovery-policy.ps1
├── validate-cap-observability.ps1
├── run-cap-tests.ps1
├── collect-cap-evidence.ps1
└── verify-cap-gate.ps1
```

---

## Conceito essencial

### Consistency, Availability e Partition Tolerance

Consistency define visibilidade coerente do estado; Availability exige resposta de um nó saudável; Partition Tolerance define comportamento quando grupos não conseguem se comunicar.

### CP, AP e CA

CP preserva consistência e pode recusar durante partição. AP preserva disponibilidade e aceita divergência reconciliável. CA descreve condições sem partição relevante, não uma premissa segura para sistemas distribuídos.

### Linearizability e Quorum

Linearizability aproxima as operações de uma ordem global compatível com o tempo real. Quorum representa o mínimo de réplicas coordenadas. O laboratório trata ambos conceitualmente, sem consenso real.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-635-cap/service-scheduling-cap

Set-Location `
  labs/m19/aula-635-cap/service-scheduling-cap
```

---

### 2. Criar CAP Charter

Arquivo:

```text
cap/CAP_CHARTER.md
```

Conteúdo:

```markdown
# CAP Charter

## Contexto

Service Scheduling.

## Nós

- scheduling-node-a;
- scheduling-node-b.

## Estado replicado

Appointment.

## Partição simulada

Comunicação entre os nós
pode ser bloqueada.

## Decisão

Cada operação possui
sua própria política
de consistência
e disponibilidade.

## Fora de escopo

- consenso real;
- leader election;
- quorum de produção;
- PACELC;
- idempotência avançada.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/cap-contract.yaml
```

Conteúdo:

```yaml
cap:
  context:
    Service-Scheduling

  required:
    - consistency-definition
    - availability-definition
    - partition-definition
    - operation-level-decision
    - business-risk
    - explicit-refusal
    - explicit-stale-response
    - conflict-model
    - recovery-policy
    - UX-policy
    - observability
    - tests
    - architecture-rules

  forbidden:
    - system-wide-two-letter-label-only
    - assume-no-partition
    - silent-stale-read
    - accept-conflicting-critical-write-without-policy
    - call-timeout-proof-of-node-failure
    - PACELC-deep-dive
    - advanced-idempotency-deep-dive

  nextLesson:
    code:
      M19.26
```

---

### 4. Criar termos

Arquivo:

```text
cap/CAP_TERMS.md
```

Registre:

```text
Consistency:
regra de visibilidade
e coordenação
do estado.

Availability:
requisição a nó saudável
recebe resposta.

Partition:
comunicação entre grupos
fica indisponível.

CP:
preserva consistência
e pode recusar.

AP:
preserva disponibilidade
e pode divergir.

CA:
condição possível
quando não há partição.
```

Inclua exemplos do domínio.

---

### 5. Criar Appointment State

```java
public record AppointmentState(
        AppointmentId appointmentId,
        AppointmentStatus status,
        AppointmentWindow window,
        AppointmentVersion version,
        NodeId lastWriter,
        Instant updatedAt) {

    public AppointmentState {
        Objects.requireNonNull(appointmentId);
        Objects.requireNonNull(status);
        Objects.requireNonNull(window);
        Objects.requireNonNull(version);
        Objects.requireNonNull(lastWriter);
        Objects.requireNonNull(updatedAt);
    }
}
```

`lastWriter` serve apenas à observação; não resolve conflito.

---

### 6. Criar Appointment Version

```java
public record AppointmentVersion(
        long value)
        implements Comparable<AppointmentVersion> {

    public AppointmentVersion {
        if (value < 1) {
            throw new IllegalArgumentException(
                    "Version must be positive");
        }
    }

    public AppointmentVersion next() {
        return new AppointmentVersion(
                value + 1);
    }

    @Override
    public int compareTo(
            AppointmentVersion other) {

        return Long.compare(
                value,
                other.value);
    }
}
```

A versão identifica estado antigo, mas não resolve branches concorrentes.

---

### 7. Criar Scheduling Node

```java
public final class SchedulingNode {

    private final NodeId nodeId;
    private final LocalAppointmentStore store;
    private final ReplicationChannel replication;
    private final NodeClock clock;

    public Optional<AppointmentState> readLocal(
            AppointmentId appointmentId) {

        return store.findById(
                appointmentId);
    }

    public WriteResult writeLocal(
            AppointmentState state) {

        store.save(state);

        replication.send(
                nodeId,
                ReplicationMessage.from(
                        state));

        return WriteResult.accepted(
                nodeId,
                state.version());
    }
}
```

`writeLocal` será usado somente em políticas AP.

---

### 8. Criar Network State

```java
public enum NetworkState {
    CONNECTED,
    PARTITIONED
}
```

`PartitionController` muda o estado da comunicação.

```java
public final class PartitionController {

    private final AtomicReference<NetworkState>
            state =
            new AtomicReference<>(
                    NetworkState.CONNECTED);

    public void partition() {
        state.set(
                NetworkState.PARTITIONED);
    }

    public void heal() {
        state.set(
                NetworkState.CONNECTED);
    }

    public boolean canCommunicate() {
        return state.get()
                == NetworkState.CONNECTED;
    }
}
```

---

### 9. Criar Replication Channel

```java
public final class InMemoryReplicationChannel
        implements ReplicationChannel {

    private final PartitionController partition;
    private final Map<NodeId, SchedulingNode> nodes;

    @Override
    public ReplicationResult send(
            NodeId source,
            ReplicationMessage message) {

        if (!partition.canCommunicate()) {
            return ReplicationResult.blockedByPartition(
                    source,
                    message.appointmentId());
        }

        nodes.values()
                .stream()
                .filter(node ->
                        !node.nodeId()
                                .equals(source))
                .forEach(node ->
                        node.applyReplication(
                                message));

        return ReplicationResult.delivered();
    }
}
```


---

### 10. Criar modos

```java
public enum CapConsistencyMode {
    STRONG_DURING_PARTITION,
    AVAILABLE_DURING_PARTITION,
    LOCAL_STALE_READ,
    REJECT_DURING_PARTITION
}
```

O modo pertence à operação, não ao sistema inteiro.

---

### 11. Criar Operation Policy

```java
public record OperationPolicy(
        OperationName operation,
        ConsistencyRequirement consistency,
        AvailabilityRequirement availability,
        PartitionDecision partitionDecision,
        String businessReason) {
}
```

Exemplo:

```text
Reschedule Appointment:
consistency STRONG;
availability MAY_REJECT;
partition decision REJECT;
reason avoid double capacity reservation.
```

---

### 12. Criar matriz de decisões

Arquivo:

```text
cap/OPERATION_DECISION_MATRIX.md
```

Use:

```text
Operation:
Confirm Appointment.

During partition:
CP.

Behavior:
reject if coordination unavailable.

Reason:
avoid conflicting final status.

UX:
confirmation temporarily unavailable.
```

```text
Operation:
Search Appointments.

During partition:
AP.

Behavior:
serve local replica
with stale indicator.

Reason:
operational visibility
is better than total outage.

UX:
data may be delayed.
```

---

### 13. Matriz recomendada

```text
Confirm Appointment:
CP.

Reschedule Appointment:
CP.

Cancel Appointment:
CP,
unless emergency cancellation policy exists.

Read Appointment Details:
bounded choice;
authoritative for critical decision,
local stale for display.

Search Appointments:
AP.

Operational Dashboard:
AP.

Audit Export:
may reject or wait,
depending on legal requirement.
```


---

### 14. Criar decision policy

Arquivo:

```text
contracts/operation-decision-policy.yaml
```

Conteúdo:

```yaml
operations:
  confirmAppointment:
    partitionBehavior:
      CP
    refusalAllowed:
      true
    reason:
      avoid-conflicting-status

  rescheduleAppointment:
    partitionBehavior:
      CP
    refusalAllowed:
      true
    reason:
      avoid-double-reservation

  cancelAppointment:
    partitionBehavior:
      CP
    refusalAllowed:
      true
    reason:
      avoid-cancel-confirm-conflict

  searchAppointments:
    partitionBehavior:
      AP
    staleIndicator:
      required

  operationalDashboard:
    partitionBehavior:
      AP
    staleIndicator:
      required
```

---

### 15. Criar Strong Write Coordinator

```java
public final class StrongWriteCoordinator {

    private final PartitionController partition;
    private final SchedulingNode nodeA;
    private final SchedulingNode nodeB;

    public WriteResult confirm(
            AppointmentId appointmentId,
            AppointmentVersion expectedVersion) {

        if (!partition.canCommunicate()) {
            return WriteResult.rejected(
                    "COORDINATION_UNAVAILABLE");
        }

        AppointmentState a =
                nodeA.require(
                        appointmentId);

        AppointmentState b =
                nodeB.require(
                        appointmentId);

        requireSameVersion(
                a,
                b);

        requireExpectedVersion(
                a,
                expectedVersion);

        AppointmentState next =
                transitionToConfirmed(
                        a);

        nodeA.applyCoordinated(next);
        nodeB.applyCoordinated(next);

        return WriteResult.accepted(
                NodeId.coordinator(),
                next.version());
    }
}
```

A implementação simula coordenação, sem consenso real.

---

### 16. Comportamento CP

Durante partição:

```text
confirm:
rejeitado.

reschedule:
rejeitado.

cancel:
rejeitado.

search:
pode continuar localmente.
```

CP pode recusar apenas operações que exigem coordenação.

---

### 17. Criar Available Write Coordinator

```java
public final class AvailableWriteCoordinator {

    public WriteResult updateLocal(
            SchedulingNode node,
            AppointmentId appointmentId,
            LocalUpdate update) {

        AppointmentState current =
                node.require(
                        appointmentId);

        AppointmentState next =
                update.apply(
                        current,
                        node.nodeId());

        return node.writeLocal(next);
    }
}
```

Esse fluxo aceita divergência e exige permissão explícita do negócio.

---

### 18. Cenário AP

Durante a partição:

```text
Node A:
Appointment RESCHEDULED
para 15:00.

Node B:
Appointment RESCHEDULED
para 16:00.
```

Quando a rede volta, existe conflito.

A disponibilidade foi preservada, mas o conflito precisa de detecção, registro, resolução e auditoria.

---

### 19. Criar Conflict Model

Arquivo:

```text
cap/CONFLICT_MODEL.md
```

Categorias:

```text
SAME_VERSION_DIFFERENT_VALUE;

DIVERGENT_VERSION_BRANCH;

CONFIRM_VERSUS_CANCEL;

RESCHEDULE_VERSUS_RESCHEDULE;

DELETE_VERSUS_UPDATE;

UNKNOWN_CAUSAL_ORDER.
```

Cada categoria define severidade, owner, impacto e estratégia de resolução.

---

### 20. Criar Conflict

```java
public record AppointmentConflict(
        UUID conflictId,
        AppointmentId appointmentId,
        ConflictType type,
        AppointmentState stateA,
        AppointmentState stateB,
        Instant detectedAt,
        ConflictStatus status) {
}
```


---

### 21. Criar Conflict Register

```java
public interface ConflictRegister {

    void record(
            AppointmentConflict conflict);

    List<AppointmentConflict> openFor(
            AppointmentId appointmentId);

    void markResolved(
            UUID conflictId,
            ConflictResolution resolution);
}
```

---

### 22. Resolver conflitos

A resolução pode escolher autoridade, aplicar regra de domínio, solicitar decisão humana, compensar ou gerar novo estado reconciliado.

Evite “maior timestamp vence”; tempo não representa prioridade de negócio.

---

### 23. Confirm versus Cancel

Cenário:

```text
Node A:
Confirm Appointment.

Node B:
Cancel Appointment.
```

Não existe merge técnico óbvio: é preciso avaliar ordem causal, notificações, capacidade, execução, cobrança e prioridade de negócio.

Esse é um motivo para manter essas operações CP.

---

### 24. Reschedule versus Reschedule

Dois nós escolhem janelas diferentes.

Consequências incluem dupla reserva, mensagens contraditórias, técnico no horário errado e quebra de SLA.

A indisponibilidade temporária pode ser menos danosa que aceitar ambas.

---

### 25. Leitura local durante partição

```java
public ReadResult readLocalDuringPartition(
        SchedulingNode node,
        AppointmentId appointmentId) {

    return node.readLocal(
                    appointmentId)
            .map(state ->
                    ReadResult.availableStale(
                            state,
                            "NETWORK_PARTITION"))
            .orElseGet(
                    ReadResult::notAvailable);
}
```


---

### 26. Leitura forte durante partição

Se a operação exige estado atual coordenado:

```text
não há leitura forte disponível.
```

A resposta pode ser:

```text
503 COORDINATION_UNAVAILABLE
```

ou erro de negócio específico. Nunca apresente estado local como forte.

---

### 27. Criar Read Coordinator

```java
public final class ReadCoordinator {

    public ReadResult read(
            AppointmentId appointmentId,
            ReadPolicy policy) {

        if (policy.requiresCoordinatedRead()
                && partition.isPartitioned()) {

            return ReadResult.rejected(
                    "STRONG_READ_UNAVAILABLE");
        }

        if (policy.allowsLocalRead()) {
            return localRead(
                    policy.preferredNode(),
                    appointmentId);
        }

        return coordinatedRead(
                appointmentId);
    }
}
```

---

### 28. Criar consistency policy

Arquivo:

```text
contracts/consistency-policy.yaml
```

Conteúdo:

```yaml
consistency:
  criticalWrites:
    require:
      - coordinated-state
      - expected-version
      - conflict-free-view

  criticalRead:
    localStaleFallback:
      forbidden

  staleRead:
    mustBeMarked:
      true

  stateDivergence:
    hidden:
      forbidden

  linearizableClaim:
    requiresFormalImplementation:
      true
```

---

### 29. Criar availability policy

Arquivo:

```text
contracts/availability-policy.yaml
```

Conteúdo:

```yaml
availability:
  search:
    duringPartition:
      local-response

  dashboard:
    duringPartition:
      local-response

  confirm:
    duringPartition:
      explicit-rejection

  reschedule:
    duringPartition:
      explicit-rejection

  cancel:
    duringPartition:
      explicit-rejection

  noResponseWithoutReason:
    forbidden
```

---

### 30. Partition Tolerance

Tolerar partição significa definir quais operações continuam, recusam, ficam stale, geram conflito e como o sistema recupera.

---

### 31. Timeout não prova falha

Timeout pode significar nó, rede, proxy, DNS, sobrecarga, resposta perdida ou apenas atraso.

O caller não sabe se a escrita ocorreu, o que influencia retries. Idempotência avançada fica para a aula 637.

---

### 32. Criar partition policy

Arquivo:

```text
contracts/partition-policy.yaml
```

Conteúdo:

```yaml
partition:
  detection:
    timeoutAlone:
      conclusive:
        false

  behavior:
    perOperation:
      required

  staleRead:
    indicator:
      required

  criticalWrite:
    default:
      reject

  conflict:
    register:
      required

  recovery:
    reconciliation:
      required
```

---

### 33. Simular partição

```java
partitionController.partition();

ScenarioResult result =
        scenarioRunner.execute(
                CapScenario.CONFIRM_ON_A_CANCEL_ON_B);

assertTrue(
        result.partitionActive());
```

O runner registra operação, nó, resposta, versão, replicação, conflito e decisão CAP.

---

### 34. Cenário 1 — Confirm CP

1. rede conectada;
2. Appointment `SCHEDULED`, versão 3;
3. rede particiona;
4. cliente confirma no Node A;
5. coordinator exige coordenação;
6. operação é rejeitada;
7. nenhum nó muda;
8. resposta informa indisponibilidade temporária.

Resultado:

```text
consistency preserved;
availability sacrificed
for this operation.
```

---

### 35. Cenário 2 — Search AP

1. rede particiona;
2. Node A possui versão 8;
3. Node B possui versão 7;
4. busca chega ao Node B;
5. Node B responde localmente;
6. resposta inclui stale indicator;
7. operação continua disponível.

Resultado:

```text
availability preserved;
strong consistency not guaranteed.
```

---

### 36. Cenário 3 — Reschedule AP experimental

Esse cenário existe para demonstrar risco.

1. rede particiona;
2. Node A reage para 15:00;
3. Node B reage para 16:00;
4. ambos retornam sucesso;
5. rede volta;
6. versões divergem;
7. Conflict Register recebe finding;
8. resolução manual é exigida.

Resultado:

```text
availability preserved;
conflict created.
```


---

### 37. Cenário 4 — Dashboard AP

O dashboard pode responder:

```text
dados atualizados até 14:32;

algumas regiões
podem estar temporariamente atrasadas.
```

Isso é melhor que indisponibilidade total quando o painel é informativo.

O dashboard não deve confirmar transição, autorizar cancelamento, decidir expected version ou reservar capacidade.

---

### 38. Criar UX Policy

Arquivo:

```text
contracts/ux-policy.yaml
```

Conteúdo:

```yaml
ux:
  strongOperationRejected:
    message:
      temporarily-unavailable-for-safe-processing

  staleRead:
    show:
      - last-updated-at
      - stale-indicator
      - retry-action

  conflict:
    showToOperator:
      required

  internalTerms:
    forbidden:
      - CAP
      - quorum
      - partition-leader
      - split-brain

  retry:
    automaticOnlyWhenSafe:
      true
```

---

### 39. Segurança durante partição

Partições podem afetar:

- token validation;
- policy service;
- tenant configuration;
- authorization cache;
- revocation list.

Cache stale não deve autorizar operação crítica sem política; algumas ações precisam ser rejeitadas.

---

### 40. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

Conteúdo:

```yaml
security:
  criticalAuthorization:
    staleCache:
      forbiddenWithoutPolicy

  revokedCredential:
    localAcceptance:
      forbidden

  partitionMode:
    privilegedWrite:
      default:
        reject

  conflictResolution:
    privileged:
      true

  audit:
    partitionDecision:
      required
```

---

### 41. Observabilidade de partição

Observe partição, duração, requisições, rejeições CP, respostas AP, stale reads, conflitos, backlog e recovery.

---

### 42. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  partition:
    required:
      - active
      - started-at
      - duration
      - affected-links

  operation:
    required:
      - name
      - node
      - cap-decision
      - outcome
      - state-version

  recovery:
    required:
      - backlog
      - conflicts
      - duration
      - convergence-status

  forbidden:
    - raw-personal-data
    - secret
    - token
```

---

### 43. Partição assimétrica

Nem toda partição é simétrica.

Exemplo:

```text
A consegue enviar para B;

B não consegue responder para A.
```

Ou:

```text
A acessa banco;

B acessa broker;

nenhum acessa ambos.
```

O laboratório usa partição total, mas documenta cenários assimétricos.

---

### 44. Split brain

Split brain ocorre quando múltiplos lados acreditam poder agir como autoridade.

Consequências incluem writers concorrentes, estados divergentes e efeitos externos duplicados.

O laboratório não implementa leader election.

Apenas demonstra o risco de writers independentes.

---

### 45. Quorum conceitual

Em três réplicas, uma política pode exigir:

```text
write quorum = 2;

read quorum = 2.
```

Quando:

```text
R + W > N
```

há interseção entre conjuntos de leitura e escrita.

Quorum não garante sozinho todas essas propriedades.

---

### 46. Operação por operação

Uma mesma API pode ter:

```text
POST /appointments/{id}/confirmation
CP;

GET /appointments/{id}
policy dependent;

GET /appointments
AP;

GET /dashboard
AP.
```


---

### 47. Dado por dado

Mesmo dentro de um Appointment:

```text
status:
forte.

janela:
forte.

label de área:
eventual.

nome de exibição:
eventual.

métrica de dashboard:
eventual.

auditoria legal:
forte ou bloqueada.
```


---

### 48. Contexto por contexto

`Service Scheduling` pode rejeitar reagendamento durante partição.

`Customer Communication` pode continuar aceitando tarefas de notificação.

`Analytics` pode operar com atraso.

`Field Execution` pode permitir leitura local de atividades já preparadas, mas rejeitar nova preparação.


---

### 49. Criar Conflict Policy

Arquivo:

```text
contracts/conflict-policy.yaml
```

Conteúdo:

```yaml
conflict:
  detection:
    required

  hiddenOverwrite:
    forbidden

  categories:
    - same-version-different-value
    - divergent-branch
    - confirm-versus-cancel
    - reschedule-versus-reschedule

  automaticResolution:
    requiresBusinessRule:
      true

  manualResolution:
    requires:
      - owner
      - authorization
      - justification
      - audit

  lastWriteWins:
    default:
      forbidden
```

---

### 50. Recuperação da partição

Quando a rede volta, o sistema restringe writes críticos, drena backlog, compara versões, registra e resolve conflitos, verifica convergência e então reabre operações.

---

### 51. Criar Recovery Policy

Arquivo:

```text
cap/RECOVERY_POLICY.md
```

Inclua:

```text
partition healed;

replication resumed;

backlog drained;

states compared;

conflicts registered;

resolution executed;

convergence verified;

operations restored;

incident reviewed.
```

---

### 52. Criar recovery-policy.yaml

Arquivo:

```text
contracts/recovery-policy.yaml
```

Conteúdo:

```yaml
recovery:
  afterPartition:
    order:
      - resume-replication
      - drain-backlog
      - compare-versions
      - detect-conflicts
      - resolve-or-quarantine
      - verify-convergence
      - reopen-operations

  reopenBeforeConvergenceVerification:
    forbiddenForCriticalWrites

  unresolvedConflict:
    visible:
      required

  incidentReview:
    required
```

---

### 53. Falha no recovery

Recovery pode falhar por backlog, evento incompatível, conflito insolúvel, estado corrompido, repair parcial ou efeito externo já executado.


---

### 54. Criar Failure Policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  partitionDetected:
    action:
      APPLY_OPERATION_POLICY

  criticalCoordinationUnavailable:
    action:
      REJECT_SAFELY

  localReadAvailable:
    action:
      RETURN_WITH_STALE_INDICATOR

  conflictingWrites:
    action:
      REGISTER_AND_QUARANTINE

  recoveryConflict:
    action:
      MANUAL_OR_BUSINESS_RESOLUTION

  convergenceNotProven:
    action:
      KEEP_CRITICAL_WRITES_RESTRICTED

  PACELCDeepDive:
    deferredToLesson636

  AdvancedIdempotencyDeepDive:
    deferredToLesson637
```

---

### 55. Criar Data Quality Policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  operationWithoutCapDecision:
    action:
      FAIL

  staleReadWithoutIndicator:
    action:
      FAIL

  conflictingWriteWithoutRegister:
    action:
      FAIL

  localStatePresentedAsStrong:
    action:
      FAIL

  timeoutTreatedAsDefiniteFailure:
    action:
      FAIL

  recoveryWithoutConvergenceCheck:
    action:
      FAIL

  systemWideLabelWithoutOperationMatrix:
    action:
      FAIL
```

---

### 56. Criar Non-Anticipation Policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson636:
    forbidden:
      - PACELC-classification
      - normal-operation-latency-tradeoff
      - PC-PA-EL-EC-matrix
      - database-PACELC-comparison

  lesson637:
    forbidden:
      - transactional-inbox
      - idempotency-window
      - external-effect-deduplication-deep-dive
      - semantic-idempotency
      - concurrent-idempotency-key-locking

  allowed:
    - basic-request-id
    - basic-event-id
    - retry-awareness
```

---

### 57. Testar operação CP

`StrongWriteDuringPartitionTest`:

1. cria Appointment versão 4;
2. replica nos dois nós;
3. ativa partição;
4. tenta confirmar;
5. recebe rejeição;
6. estados permanecem versão 4;
7. nenhum conflito é criado.

---

### 58. Testar operação AP

`AvailableWriteDuringPartitionTest`:

1. ativa partição;
2. escreve localmente no Node A;
3. recebe sucesso;
4. Node B permanece antigo;
5. observabilidade registra divergência;
6. recuperação detecta branch.

Esse teste não muda a matriz oficial.

---

### 59. Testar stale read

`StaleReadDuringPartitionTest` valida:

- Node A na versão 7;
- Node B na versão 6;
- leitura local no B retorna;
- response indica stale;
- versão e `updatedAt` são expostos de forma segura;
- leitura não é usada para command crítico.

---

### 60. Testar Confirm versus Cancel

Durante partição:

- Node A confirma por política AP experimental;
- Node B cancela;
- ambos retornam sucesso;
- recovery detecta `CONFIRM_VERSUS_CANCEL`;
- conflito fica aberto;
- nenhuma resolução automática por timestamp.

---

### 61. Testar Reschedule versus Reschedule

Valide:

- janelas diferentes;
- reservas diferentes;
- branch detectado;
- conflito registrado;
- side effects não são reconciliados silenciosamente;
- owner definido.

---

### 62. Testar recovery

1. partição ativa;
2. operações locais geram backlog;
3. rede volta;
4. replicação retoma;
5. versões são comparadas;
6. conflitos são registrados;
7. operações não conflitantes convergem;
8. verifier confirma resultado.

---

### 63. Testar operação por operação

`OperationLevelCapDecisionTest` valida que:

- confirmação rejeita;
- reagendamento rejeita;
- busca responde localmente;
- dashboard responde localmente;
- leitura forte rejeita;
- leitura stale sinaliza atraso.

---

### 64. Testar UX

`CustomerPortalScenarioTest` valida:

- erro amigável para operação crítica;
- indicador de dados possivelmente atrasados;
- ação de tentar novamente;
- ausência de termos internos;
- nenhum falso sucesso.

---

### 65. Testar segurança

Durante partição:

- policy service indisponível;
- cache de autorização expirado;
- operação privilegiada chega;
- sistema rejeita;
- decisão é auditada.

---

### 66. Testar observabilidade

Confirme métricas para:

- início da partição;
- duração;
- links afetados;
- rejeições CP;
- respostas AP;
- stale reads;
- conflitos;
- backlog;
- tempo de recovery;
- convergência.

---

### 67. Testar arquitetura

```java
@ArchTest
static final ArchRule operationPoliciesBelongToApplicationBoundary =
        classes()
                .that()
                .haveSimpleNameEndingWith(
                        "OperationPolicy")
                .should()
                .resideInAPackage(
                        "..consistency..");
```


---

### 68. Criar Operating Model

Arquivo:

```text
cap/OPERATING_MODEL.md
```

Registre:

- nós;
- links;
- health checks;
- partition detection;
- false positives;
- operações CP;
- operações AP;
- alertas;
- backlog;
- conflict owner;
- recovery owner;
- runbook;
- SLO;
- incident review.

---

### 69. Criar Trade-offs

Arquivo:

```text
cap/TRADE_OFFS.md
```

Para cada operação, compare recusa, stale response, conflito, coordenação, recovery, UX e riscos financeiro, operacional e legal.

---

### 70. Criar Open Questions

Arquivo:

```text
cap/OPEN_CAP_QUESTIONS.md
```

Pergunte sobre cancelamento emergencial, leituras stale, operações fortes, ownership de conflitos, SLO de recovery, backlog, compensações, UX e autoridade.


---

### 71. Validar contrato

```powershell
.\scripts\m19\service-scheduling-cap\validate-cap-contract.ps1
```

Valide termos, matriz, cenários, conflitos, recovery, observabilidade e não antecipação.

---

### 72. Validar decisões

```powershell
.\scripts\m19\service-scheduling-cap\validate-operation-decisions.ps1
```

Valide consistência, disponibilidade, decisão, motivo, resposta, UX e owner de cada operação.

---

### 73. Validar consistência

```powershell
.\scripts\m19\service-scheduling-cap\validate-consistency-requirements.ps1
```

Valide expected version, coordenação, leitura forte, recusa e ausência de fallback stale oculto.

---

### 74. Validar disponibilidade

```powershell
.\scripts\m19\service-scheduling-cap\validate-availability-requirements.ps1
```

Valide operações locais permitidas, stale indicator, resposta explícita e risco documentado.

---

### 75. Validar partição

```powershell
.\scripts\m19\service-scheduling-cap\validate-partition-behavior.ps1
```

Valide detecção, assimetria documentada, operação por operação, alertas e métricas.

---

### 76. Validar conflitos

```powershell
.\scripts\m19\service-scheduling-cap\validate-conflict-model.ps1
```

Valide categorias, register, owner, resolução, proibição de overwrite e auditoria.

---

### 77. Validar recovery

```powershell
.\scripts\m19\service-scheduling-cap\validate-recovery-policy.ps1
```

Valide backlog, comparação, conflitos, convergence verifier e reabertura segura.

---

### 78. Validar observabilidade

```powershell
.\scripts\m19\service-scheduling-cap\validate-cap-observability.ps1
```

Valide partição, decisões, outcomes, versões, backlog, conflitos e recovery.

---

### 79. Executar testes

```powershell
.\scripts\m19\service-scheduling-cap\run-cap-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide writes CP e AP experimentais, stale reads, decisões, conflitos, recovery, UX, segurança e arquitetura.

---

### 80. Criar Reports

Exemplo:

```yaml
cap:
  simulatedPartitions:
    6

  cpOperations:
    3

  apOperations:
    2

  cpRejections:
    14

  staleResponses:
    21

  conflictingWrites:
    2

  unresolvedConflicts:
    0

  recoveryDurationSeconds:
    9

  convergedAfterRecovery:
    true

  result:
    PASS
```

---

### 81. Criar Gate

O gate valida charter, termos, matriz, consistência, disponibilidade, partição, cenários CP/AP, stale responses, conflitos, segurança, UX, recovery, convergência, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_TERMS;

FAIL_OPERATION_MATRIX;

FAIL_CONSISTENCY_DECISION;

FAIL_AVAILABILITY_DECISION;

FAIL_PARTITION_BEHAVIOR;

FAIL_STALE_INDICATOR;

FAIL_CONFLICT_MODEL;

FAIL_RECOVERY;

FAIL_CONVERGENCE;

FAIL_SECURITY;

FAIL_UX;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 82. Coletar Evidence

Arquivo:

```text
contracts/cap-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- node count;
- simulated partition count;
- CP operation count;
- AP operation count;
- CP rejection count;
- stale response count;
- conflicting write count;
- unresolved conflict count;
- recovery duration;
- convergence status;
- security status;
- UX status;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- tokens;
- endpoints privados;
- infraestrutura real;
- topologia real;
- PACELC aprofundado;
- idempotência avançada.

---

### 83. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-cap\validate-cap-contract.ps1

.\scripts\m19\service-scheduling-cap\validate-operation-decisions.ps1

.\scripts\m19\service-scheduling-cap\validate-consistency-requirements.ps1

.\scripts\m19\service-scheduling-cap\validate-availability-requirements.ps1

.\scripts\m19\service-scheduling-cap\validate-partition-behavior.ps1

.\scripts\m19\service-scheduling-cap\validate-conflict-model.ps1

.\scripts\m19\service-scheduling-cap\validate-recovery-policy.ps1

.\scripts\m19\service-scheduling-cap\validate-cap-observability.ps1

.\scripts\m19\service-scheduling-cap\run-cap-tests.ps1

.\scripts\m19\service-scheduling-cap\collect-cap-evidence.ps1

.\scripts\m19\service-scheduling-cap\verify-cap-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 84. Encerrar o laboratório

Confirme charter, termos, partição simulada, matriz por operação, writes críticos CP, buscas AP, stale indicator, leitura forte honesta, timeout ambíguo, conflitos, recovery, segurança, UX, observabilidade e reports. PACELC e idempotência avançada permanecem fora do aprofundamento.

---

## Entendendo o que foi feito

### CAP ganhou contexto operacional

C, A e P foram associados a decisões reais por operação.

### CP e AP ganharam comportamento

Writes críticos recusam sem coordenação; leituras locais podem continuar com staleness explícito.

### Conflitos e recovery ganharam política

Branches são registrados, resolvidos e verificados antes da reabertura.

### UX e segurança ganharam papel

Partições passaram a influenciar mensagens, autorização e operação.

---

## Erros comuns importantes

### Classificar o sistema inteiro ou tratar P como opcional

Operações possuem riscos diferentes e redes podem particionar.

### Confundir disponibilidade, latência e consistência

Responder rápido ou localmente não torna a resposta globalmente atual.

### Aceitar writes críticos nos dois lados

Branches e efeitos contraditórios aparecem.

### Resolver tudo por timestamp

LWW pode perder intenção de negócio.

### Reabrir sem convergência ou tratar timeout como falha certa

Conflitos crescem e retries podem duplicar efeitos.

### Antecipar PACELC ou idempotência avançada

Esses aprofundamentos pertencem às aulas 636 e 637.

---

## Comandos úteis

### Validar decisões

```powershell
.\scripts\m19\service-scheduling-cap\validate-operation-decisions.ps1
```

### Validar partição

```powershell
.\scripts\m19\service-scheduling-cap\validate-partition-behavior.ps1
```

### Validar conflitos

```powershell
.\scripts\m19\service-scheduling-cap\validate-conflict-model.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-cap\run-cap-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-cap\verify-cap-gate.ps1
```

---

## Exercício guiado

Defina C, A e P, crie a matriz por operação, simule partição, exercite writes CP e leituras AP, registre conflitos, execute recovery, comunique staleness e valide observabilidade, testes e gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 634 e ponte para a aula 636 foram preservadas;
- o laboratório `service-scheduling-cap` foi criado;
- CAP Charter foi criado;
- Consistency foi definida;
- Availability foi definida;
- Partition Tolerance foi definida;
- network partition foi simulada;
- CAP não foi tratado como escolha simples de duas letras;
- decisões foram feitas por operação;
- business risk foi registrado;
- matriz de operações foi criada;
- confirmação foi classificada como CP;
- reagendamento foi classificado como CP;
- cancelamento foi classificado como CP;
- busca foi classificada como AP;
- dashboard foi classificado como AP;
- strong write rejeita durante partição;
- local stale read permanece disponível;
- stale response possui indicador;
- estado local não é apresentado como forte;
- timeout não é tratado como prova definitiva;
- available write experimental demonstra conflito;
- Conflict Model foi criado;
- branches são registrados;
- confirm versus cancel foi testado;
- reschedule versus reschedule foi testado;
- LWW foi proibido por padrão;
- recovery drena backlog;
- conflitos são detectados;
- convergência é verificada antes da reabertura;
- segurança durante partição foi documentada;
- UX não expõe termos internos;
- métricas de partição e recovery foram criadas;
- arquitetura protege as decisões;
- PACELC não foi aprofundado;
- idempotência avançada não foi antecipada;
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
  labs/m19/aula-635-cap/service-scheduling-cap `
  scripts/m19/service-scheduling-cap `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realTopology|privateEndpoint|productionCluster|PACELCDeepDive|transactionalInbox|semanticIdempotency"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): analisar CAP"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- topologia real;
- endpoints privados;
- cluster real;
- PACELC aprofundado;
- idempotência avançada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou CAP.

Você criou:

```text
CAP Charter;

terminologia;

dois nós;

partição simulada;

matriz de operações;

Strong Write Coordinator;

Available Write Coordinator;

Read Coordinator;

Conflict Register;

partition scenarios;

recovery policy;

UX policy;

observabilidade;

architecture tests.
```

Você comprovou que CAP precisa ser analisado durante partições; que Partition Tolerance deve ser assumida em sistemas distribuídos; que operações críticas podem priorizar consistência e recusar; que leituras operacionais podem priorizar disponibilidade e sinalizar staleness; que decisões precisam ser feitas por operação e risco; que timeouts são ambíguos; que conflitos AP exigem registro e resolução; e que recovery precisa terminar com convergência verificada.

A próxima aula será:

```text
636 - M19.26 - PACELC
```

Nela, você irá aprofundar o que acontece não apenas durante partições, mas também em operação normal, quando arquiteturas precisam trocar latência por consistência.

Nenhum aprofundamento completo de PACELC ou idempotência avançada foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini Consistency, Availability e Partition Tolerance.
- [ ] Criei decisões por operação.
- [ ] Simulei network partition.
- [ ] Rejeitei writes críticos.
- [ ] Mantive leituras AP sinalizadas.
- [ ] Registrei conflitos.
- [ ] Executei recovery.
- [ ] Verifiquei convergência.

---

## Troubleshooting adicional

### A equipe quer classificar tudo como CP

Revise quais operações realmente precisam de coordenação forte.

### A equipe quer classificar tudo como AP

Liste conflitos e efeitos de negócio que podem surgir.

### A busca falha durante partição

Verifique se leitura local stale é aceitável.

### A confirmação retorna sucesso nos dois nós

A política crítica foi violada.

### O recovery escolhe maior timestamp

Reavalie semântica e ownership.

### O sistema reabre com conflito aberto

Bloqueie writes críticos até convergência ou decisão explícita.

### O timeout dispara retry cego

Lembre que a primeira escrita pode ter ocorrido.

### A UX mostra “erro CAP”

Converta para mensagem de negócio e ação segura.

### A discussão virou latência em rede saudável

Preserve PACELC para a aula 636.

### A discussão virou inbox transacional

Preserve idempotência avançada para a aula 637.

---

## Perguntas de revisão

1. O que significa CAP?
2. O que é Consistency em CAP?
3. O que é Availability em CAP?
4. O que é Partition Tolerance?
5. O que é network partition?
6. O que significa comportamento CP?
7. O que significa comportamento AP?
8. CA é uma escolha segura para sistemas distribuídos?
9. CAP deve ser decidido para o sistema inteiro?
10. Por que confirmação pode ser CP?
11. Por que busca pode ser AP?
12. O que é stale indicator?
13. O que é split brain?
14. Por que timestamp não resolve todo conflito?
15. O que timeout realmente informa?
16. O que acontece no recovery?
17. Quando reabrir writes críticos?
18. O que não foi aprofundado nesta aula?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Consistency, Availability e Partition Tolerance.
2. Regra de visibilidade coerente do estado.
3. Nó saudável responde às requisições.
4. Comportamento definido apesar da falha de comunicação.
5. Separação de grupos de nós.
6. Preservar consistência e poder recusar.
7. Preservar disponibilidade e poder divergir.
8. Não como premissa de projeto.
9. Não.
10. Para evitar estados finais conflitantes.
11. Porque leitura stale pode ser melhor que indisponibilidade.
12. Aviso de que a versão pode estar atrasada.
13. Múltiplos lados agindo como autoridade.
14. Porque pode perder intenção de negócio.
15. Que não houve resposta no prazo.
16. Backlog, comparação, conflito, resolução e convergência.
17. Após política e verificação de convergência.
18. PACELC e idempotência avançada.
19. PACELC.
20. PACELC.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 635 - M19.25 - CAP

- Aprofundei CAP.
- Criei o laboratório `service-scheduling-cap`.
- Defini Consistency, Availability e Partition Tolerance.
- Diferenciei CP, AP e CA.
- Evitei classificar o sistema inteiro com duas letras.
- Modelei decisões por operação e risco.
- Criei dois Scheduling Nodes e partição simulada.
- Modelei Appointment State versionado.
- Criei Strong Write Coordinator.
- Rejeitei confirmação, reagendamento e cancelamento durante partição.
- Mantive busca e dashboard localmente disponíveis com stale indicator.
- Criei Available Write Coordinator apenas para experimento.
- Demonstrei branches durante partição.
- Criei Conflict Model e Conflict Register.
- Testei confirm versus cancel.
- Testei reschedule versus reschedule.
- Proibi LWW como regra padrão.
- Documentei timeout como resultado ambíguo.
- Criei UX Policy para recusa segura e dados stale.
- Documentei segurança durante partição.
- Criei Recovery Policy.
- Drenei backlog, detectei conflitos e verifiquei convergência.
- Criei observabilidade para partição, rejeições, stale reads e recovery.
- Criei testes de CP, AP, conflito, UX, segurança e recuperação.
- Criei reports, gate e evidence.
- Não antecipei PACELC ou idempotência avançada.
- Próxima aula: PACELC.
```

---

## Referência técnica curta

- CAP.
- Consistency.
- Availability.
- Partition Tolerance.
- CP.
- AP.
- Network Partition.
- Split Brain.
- Conflict Resolution.
- Recovery.

Regra final:

```text
CAP deve ser aplicado como raciocínio por operação durante partições, não como etiqueta simplificada do sistema inteiro: Service Scheduling assume que a rede pode separar nós e define para cada command ou query qual consistência é necessária, qual disponibilidade é aceitável e qual resposta deve ocorrer quando a coordenação desaparece; confirmação, reagendamento e cancelamento preservam consistência e rejeitam de forma explícita durante partição, enquanto busca e dashboard podem permanecer disponíveis com leitura local, versão, last-updated e stale indicator, sem apresentar estado local como forte; timeouts são ambíguos, writes AP experimentais podem criar branches como confirm-versus-cancel ou reschedule-versus-reschedule, conflitos nunca são escondidos por overwrite ou LWW automático e precisam de register, owner, regra de domínio, auditoria e resolução; quando a rede retorna, o sistema retoma replicação, drena backlog, compara versões e conteúdo, detecta conflitos, resolve ou quarenteniza, verifica convergência e somente então reabre operações críticas; o gate termina com termos, matriz por operação, comportamento CP e AP, segurança, UX, conflito, recovery, observabilidade, testes, arquitetura, documentação e evidence aprovados, enquanto PACELC é aprofundado somente na aula 636 e idempotência avançada permanece reservada à aula 637.
```
