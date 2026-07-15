# 636 - M19.26 - PACELC

## Apresentação da aula

Na aula 635, você aprofundou CAP.

Você analisou o comportamento de `Service Scheduling` durante uma partição de rede. Confirmação, reagendamento e cancelamento foram tratados como operações que preservam consistência e podem recusar quando a coordenação desaparece. Busca e dashboard puderam continuar disponíveis com leitura local e staleness explícito.

CAP, porém, responde principalmente à pergunta:

```text
quando existe partição,
qual propriedade será priorizada:
consistência ou disponibilidade?
```

A maior parte da vida de um sistema distribuído acontece sem uma partição total ativa. Mesmo com a rede saudável, ainda existe uma decisão arquitetural importante: coordenar réplicas para obter uma visão mais consistente normalmente aumenta o caminho crítico e a latência; responder pela réplica mais próxima ou pelo primeiro nó disponível reduz latência, mas pode devolver uma versão anterior.

PACELC amplia o raciocínio de CAP:

```text
if Partition:
  Availability or Consistency;

Else:
  Latency or Consistency.
```

A primeira parte mantém a decisão estudada em CAP. A segunda obriga a arquitetura a declarar o que faz em operação normal.

A pergunta desta aula será:

```text
quando a rede está particionada,
priorizamos A ou C;

quando a rede está saudável,
priorizamos L ou C;

como tomar essa decisão
por operação,
por dado,
por risco
sem esconder custo e consequência?
```

O laboratório será:

```text
labs/m19/aula-636-pacelc/service-scheduling-pacelc
```

Você construirá perfis PACELC por operação, budgets de latência e consistência, réplicas simuladas, leitura rápida, leitura coordenada, confirmação consistente, dashboard de baixa latência, cenários, métricas, reports, evidence e gate.

O domínio continua sendo `Service Scheduling`.

As operações analisadas serão:

```text
confirmar Appointment;
reagendar Appointment;
cancelar Appointment;
consultar detalhes;
buscar Appointments;
carregar dashboard operacional;
gerar auditoria.
```

A próxima aula será:

```text
637 - M19.27 - Idempotencia avancada
```

Nesta aula, request IDs podem aparecer apenas como correlação básica. Lifecycle de idempotency keys, deduplication windows, inbox transacional, locking concorrente, efeitos externos e idempotência semântica ficam reservados para a aula 637.

Regra central:

```text
PACELC não classifica apenas tecnologia;

PACELC torna explícita
uma decisão de negócio e arquitetura
para o período de partição
e para a operação normal.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
634:
Consistencia eventual.

635:
CAP.

636:
PACELC.

637:
Idempotencia avancada.

638:
Multi tenancy arquitetura.
```

A progressão é:

```text
modelar divergência e convergência;

decidir sob partição;

decidir sob operação normal;

tratar retries e duplicações avançadas;

isolar clientes e contextos.
```

Na aula 634, você definiu autoridade, réplicas, staleness budget, read-your-writes, monotonic reads, reconciliation e repair. Na aula 635, você decidiu quais operações recusam e quais continuam durante uma partição. Agora essas decisões serão combinadas com budgets de latência e consistência quando todos os componentes conseguem se comunicar.

PACELC não substitui CAP. Ele adiciona o ramo `ELSE`.

Também não substitui medição, SLO, teste de carga, tracing ou entendimento do banco. Uma classificação sem evidência operacional vira apenas etiqueta.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-636-pacelc/service-scheduling-pacelc
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/pacelc
│   ├── domain
│   ├── policy
│   ├── replica
│   ├── coordination
│   ├── application
│   ├── scenario
│   └── observability
├── src/test/java/br/com/formacao/pacelc
│   ├── policy
│   ├── coordination
│   ├── application
│   ├── scenario
│   └── architecture
├── pacelc
│   ├── PACELC_CHARTER.md
│   ├── OPERATION_DECISION_MATRIX.md
│   ├── LATENCY_BUDGETS.md
│   ├── CONSISTENCY_BUDGETS.md
│   ├── USER_EXPERIENCE.md
│   ├── OBSERVABILITY.md
│   └── TRADE_OFFS.md
├── contracts
│   ├── pacelc-contract.yaml
│   ├── operation-profile-policy.yaml
│   ├── latency-budget-policy.yaml
│   ├── consistency-budget-policy.yaml
│   ├── observability-policy.yaml
│   ├── security-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── operation-profile-report.yaml
    ├── latency-consistency-report.yaml
    ├── scenario-report.yaml
    └── pacelc-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-pacelc
├── validate-pacelc-contract.ps1
├── validate-operation-profiles.ps1
├── validate-latency-budgets.ps1
├── validate-consistency-budgets.ps1
├── validate-normal-operation-decisions.ps1
├── validate-partition-decisions.ps1
├── validate-pacelc-observability.ps1
├── run-pacelc-tests.ps1
├── collect-pacelc-evidence.ps1
└── verify-pacelc-gate.ps1
```

---

## Conceito essencial

### A fórmula de PACELC

PACELC pode ser lido como:

```text
P -> A ou C;
E -> L ou C.
```

`P` significa que existe uma partição relevante entre componentes que precisam coordenar. Nesse caso, a operação escolhe entre continuar disponível, aceitando algum risco de divergência, ou preservar uma visão consistente, podendo recusar ou limitar a operação.

`E` significa `Else`: a rede está suficientemente saudável para a arquitetura executar o caminho normal. Mesmo assim, a operação escolhe entre responder com menor latência ou coordenar mais componentes para elevar a garantia de consistência.

### PC e PA

No ramo de partição:

```text
PC:
Partition -> Consistency.

PA:
Partition -> Availability.
```

`PC` significa que, durante a partição, a operação preserva a consistência necessária. Ela pode recusar, aguardar por tempo limitado ou entrar em modo restrito.

`PA` significa que, durante a partição, a operação continua disponível. Ela pode responder por uma réplica local, aceitar escrita local permitida ou trabalhar com estado temporariamente divergente, desde que exista política de convergência e conflito.

### EL e EC

No ramo normal:

```text
EL:
Else -> Latency.

EC:
Else -> Consistency.
```

`EL` prioriza menor latência quando não existe partição. A operação pode escolher a réplica mais próxima, responder pelo primeiro resultado válido ou aceitar bounded staleness.

`EC` prioriza consistência maior em operação normal. A operação pode coordenar réplicas, consultar a autoridade, exigir uma versão mínima ou aguardar confirmação de escrita antes de responder.

### Os quatro perfis combinados

Os perfis mais úteis para raciocínio são:

```text
PC/EC;
PC/EL;
PA/EC;
PA/EL.
```

`PC/EC` preserva consistência durante partição e também em operação normal. É apropriado para invariantes críticas, mas costuma pagar com recusa em falha e latência maior no caminho saudável.

`PC/EL` recusa durante partição para preservar consistência, mas em operação normal escolhe o caminho de menor latência dentro de um limite seguro. Pode servir para dados cuja escrita é crítica, mas cuja leitura de apresentação aceita bounded staleness.

`PA/EC` continua disponível durante partição, mas busca uma visão mais consistente quando a rede está saudável. É um perfil possível quando a continuidade durante falha é importante, porém o sistema converge e coordena agressivamente no caminho normal.

`PA/EL` prioriza disponibilidade durante partição e latência em operação normal. É comum em busca, dashboard, analytics e conteúdo derivado, desde que o usuário veja freshness e que essas respostas não decidam invariantes.

A classificação deve ser aplicada à operação e ao dado. Rotular um sistema inteiro como `PA/EL` ou `PC/EC` esconde diferenças importantes.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-636-pacelc/service-scheduling-pacelc

Set-Location `
  labs/m19/aula-636-pacelc/service-scheduling-pacelc
```

Crie o `pom.xml` com Java 21, JUnit 5 e AssertJ, mantendo o laboratório independente dos anteriores. A relação com as aulas 634 e 635 é conceitual e arquitetural, não uma dependência de código obrigatória.

### 2. Criar o PACELC Charter

Arquivo:

```text
pacelc/PACELC_CHARTER.md
```

Conteúdo:

```markdown
# PACELC Charter

**Contexto**

Service Scheduling.

**Decisão durante partição**

Cada operação escolhe
Availability ou Consistency.

**Decisão em operação normal**

Cada operação escolhe
Latency ou Consistency.

**Unidade de decisão**

- operação;
- dado;
- risco;
- experiência;
- requisito regulatório.

**Evidência obrigatória**

- perfil PACELC;
- motivo de negócio;
- latency budget;
- consistency budget;
- fallback;
- métricas;
- teste.

**Fora de escopo**

- idempotência avançada;
- multi-tenancy;
- benchmark de fornecedor;
- consenso real de produção.
```

O charter impede que a equipe use PACELC apenas como definição acadêmica.

### 3. Criar o contrato principal

Arquivo:

```text
contracts/pacelc-contract.yaml
```

Conteúdo:

```yaml
pacelc:
  context:
    Service-Scheduling

  required:
    - operation-level-profile
    - partition-preference
    - normal-operation-preference
    - business-reason
    - latency-budget
    - consistency-budget
    - fallback
    - user-experience
    - observability
    - tests
    - architecture-rules

  forbidden:
    - global-label-without-operation-matrix
    - zero-cost-consistency-claim
    - latency-without-freshness-policy
    - stale-data-as-authoritative
    - hidden-coordination-timeout
    - vendor-label-as-proof
    - advanced-idempotency-deep-dive
    - multi-tenancy-deep-dive

  nextLesson:
    code:
      M19.27
```

### 4. Modelar as preferências

Crie:

```java
package br.com.formacao.pacelc.policy;

public enum PartitionPreference {
    CONSISTENCY,
    AVAILABILITY
}
```

Crie:

```java
package br.com.formacao.pacelc.policy;

public enum ElsePreference {
    LATENCY,
    CONSISTENCY
}
```

Os nomes são explícitos. Evite enum com letras isoladas, pois `C` aparece nos dois ramos e pode gerar ambiguidade em código e logs.

### 5. Criar Pacelc Profile

```java
package br.com.formacao.pacelc.policy;

import java.util.Objects;

public record PacelcProfile(
        PartitionPreference duringPartition,
        ElsePreference duringNormalOperation) {

    public PacelcProfile {
        Objects.requireNonNull(duringPartition);
        Objects.requireNonNull(duringNormalOperation);
    }

    public String notation() {
        String partition =
                duringPartition == PartitionPreference.CONSISTENCY
                        ? "PC"
                        : "PA";

        String normal =
                duringNormalOperation == ElsePreference.CONSISTENCY
                        ? "EC"
                        : "EL";

        return partition + "/" + normal;
    }
}
```

Teste as quatro combinações e confirme as notações.

### 6. Modelar budgets

Latência e consistência precisam de limites observáveis.

```java
package br.com.formacao.pacelc.policy;

import java.time.Duration;

public record LatencyBudget(
        Duration target,
        Duration maximum) {

    public LatencyBudget {
        if (target.isNegative()
                || maximum.isNegative()
                || maximum.compareTo(target) < 0) {
            throw new IllegalArgumentException(
                    "Invalid latency budget");
        }
    }
}
```

Crie também:

```java
package br.com.formacao.pacelc.policy;

import java.time.Duration;

public record ConsistencyBudget(
        long maximumVersionLag,
        Duration maximumTimeLag,
        boolean authoritativeRequired) {

    public ConsistencyBudget {
        if (maximumVersionLag < 0
                || maximumTimeLag.isNegative()) {
            throw new IllegalArgumentException(
                    "Invalid consistency budget");
        }
    }
}
```

`LatencyBudget` limita o tempo de resposta. `ConsistencyBudget` limita o quanto a visão pode ficar atrás da autoridade.

### 7. Criar Operation PACELC Policy

```java
package br.com.formacao.pacelc.policy;

import br.com.formacao.pacelc.domain.AppointmentOperation;
import java.util.Objects;

public record OperationPacelcPolicy(
        AppointmentOperation operation,
        PacelcProfile profile,
        LatencyBudget latencyBudget,
        ConsistencyBudget consistencyBudget,
        String businessReason,
        String partitionFallback,
        String normalFallback) {

    public OperationPacelcPolicy {
        Objects.requireNonNull(operation);
        Objects.requireNonNull(profile);
        Objects.requireNonNull(latencyBudget);
        Objects.requireNonNull(consistencyBudget);
        Objects.requireNonNull(businessReason);
        Objects.requireNonNull(partitionFallback);
        Objects.requireNonNull(normalFallback);
    }
}
```

A policy reúne decisão, limite e motivo. A notação sozinha não é suficiente.

### 8. Criar a matriz de decisões

Arquivo:

```text
pacelc/OPERATION_DECISION_MATRIX.md
```

Use a matriz:

| Operação | Perfil | Durante partição | Operação normal | Motivo |
|---|---|---|---|---|
| Confirmar Appointment | PC/EC | rejeitar sem coordenação | coordenar estado e versão | evitar status final conflitante |
| Reagendar Appointment | PC/EC | rejeitar sem coordenação | confirmar janela e reserva | evitar dupla reserva |
| Cancelar Appointment | PC/EC | rejeitar ou modo emergencial explícito | validar estado atual | evitar cancelamento conflitante |
| Detalhes após comando | PA/EC | leitura local com aviso ou fallback | exigir versão mínima | usuário deve ver a própria alteração |
| Buscar Appointments | PA/EL | responder por réplica local | usar réplica mais próxima | visibilidade é melhor que indisponibilidade |
| Dashboard operacional | PA/EL | responder com freshness | usar agregação local | baixa latência e disponibilidade |
| Exportação de auditoria | PC/EC | recusar ou aguardar | ler fonte consistente | evidência não pode omitir estado confirmado |

A matriz é ponto de partida. Em um projeto real, cada linha precisa de aprovação dos donos do domínio e da operação.

### 9. Entender PC/EC em confirmação

Confirmação altera um estado de negócio que pode disparar reserva, comunicação, preparação de campo e cobrança.

Durante partição, a operação recusa porque não consegue comprovar uma visão coordenada. Em operação normal, ela aceita latência adicional para validar versão, estado e escrita nas réplicas exigidas pela policy.

Isso não significa esperar indefinidamente. Consistência continua sujeita a timeout e falha explícita.

### 10. Entender PA/EL em busca

Busca é derivada. Ela ajuda o operador a localizar Appointments, mas não deve confirmar, cancelar ou reservar capacidade.

Durante partição, a busca pode usar a réplica local. Em operação normal, pode escolher o nó mais próximo ou o primeiro resultado dentro do budget. A resposta precisa carregar `lastUpdatedAt`, versão e indicador de freshness.

### 11. Entender PA/EC em detalhes após comando

Após confirmar um Appointment, o usuário espera ver o novo status nos detalhes. Durante uma partição, a aplicação pode manter alguma disponibilidade com resposta local sinalizada ou fallback autoritativo quando acessível. Em operação normal, a leitura exige ao menos a versão retornada pelo comando.

Esse perfil demonstra que disponibilidade durante falha não obriga baixa consistência no caminho saudável.

### 12. Criar Network Condition

```java
package br.com.formacao.pacelc.coordination;

public enum NetworkCondition {
    HEALTHY,
    DEGRADED,
    PARTITIONED
}
```

`DEGRADED` é importante. O mundo real não possui apenas rede perfeita ou partição total. Latência elevada, perda parcial e assimetria podem pressionar budgets antes de uma partição ser confirmada.

### 13. Criar Replica Snapshot

```java
package br.com.formacao.pacelc.replica;

import br.com.formacao.pacelc.domain.AppointmentState;
import java.time.Instant;

public record ReplicaSnapshot(
        ReplicaId replicaId,
        AppointmentState state,
        Instant observedAt,
        long responseTimeMillis) {
}
```

O snapshot permite comparar versão, conteúdo, idade e tempo de resposta.

### 14. Criar Replica Set

O `ReplicaSet` mantém três réplicas simuladas:

```text
primary-region;
secondary-region;
read-local-region.
```

Cada réplica pode possuir delay configurável, versão diferente e disponibilidade independente. Não use nomes de infraestrutura real.

### 15. Criar Fast Read Coordinator

```java
package br.com.formacao.pacelc.coordination;

import br.com.formacao.pacelc.domain.AppointmentId;
import br.com.formacao.pacelc.replica.ReplicaReadResult;
import br.com.formacao.pacelc.replica.ReplicaSet;

public final class FastReadCoordinator {

    private final ReplicaSet replicas;

    public FastReadCoordinator(ReplicaSet replicas) {
        this.replicas = replicas;
    }

    public ReplicaReadResult read(AppointmentId appointmentId) {
        return replicas.readFastestAvailable(appointmentId)
                .withConsistencyMode("LOW_LATENCY_REPLICA");
    }
}
```

O coordinator atende `EL`. Ele não afirma que o resultado é atual. A resposta precisa informar versão e freshness.

### 16. Criar Consistent Read Coordinator

```java
package br.com.formacao.pacelc.coordination;

import br.com.formacao.pacelc.domain.AppointmentId;
import br.com.formacao.pacelc.domain.AppointmentVersion;
import br.com.formacao.pacelc.replica.ReplicaReadResult;
import br.com.formacao.pacelc.replica.ReplicaSet;
import java.time.Duration;

public final class ConsistentReadCoordinator {

    private final ReplicaSet replicas;

    public ConsistentReadCoordinator(ReplicaSet replicas) {
        this.replicas = replicas;
    }

    public ReplicaReadResult readAtLeast(
            AppointmentId appointmentId,
            AppointmentVersion minimumVersion,
            Duration timeout) {

        return replicas.readAtLeastVersion(
                appointmentId,
                minimumVersion,
                timeout)
                .withConsistencyMode("MINIMUM_VERSION");
    }
}
```

Esse coordinator atende `EC` para casos em que uma versão mínima é suficiente. Para exportação legal ou decisão crítica, a policy pode exigir leitura autoritativa.

### 17. Criar Pacelc Decision Engine

```java
package br.com.formacao.pacelc.coordination;

import br.com.formacao.pacelc.policy.ElsePreference;
import br.com.formacao.pacelc.policy.OperationPacelcPolicy;
import br.com.formacao.pacelc.policy.PartitionPreference;

public final class PacelcDecisionEngine {

    public DecisionMode decide(
            NetworkCondition condition,
            OperationPacelcPolicy policy) {

        if (condition == NetworkCondition.PARTITIONED) {
            return policy.profile().duringPartition()
                            == PartitionPreference.CONSISTENCY
                    ? DecisionMode.PRESERVE_CONSISTENCY
                    : DecisionMode.PRESERVE_AVAILABILITY;
        }

        return policy.profile().duringNormalOperation()
                        == ElsePreference.CONSISTENCY
                ? DecisionMode.COORDINATE_FOR_CONSISTENCY
                : DecisionMode.MINIMIZE_LATENCY;
    }
}
```

O engine escolhe o modo. O serviço de aplicação continua responsável por aplicar a regra de negócio e o fallback correto.

### 18. Criar Strong Command Coordinator

O coordinator de comando verifica condição de rede, versão esperada, estado atual e réplicas exigidas.

Em partição com perfil `PC`, retorna:

```text
SAFE_REJECTION:
COORDINATION_UNAVAILABLE.
```

Em rede saudável com perfil `EC`, mede o tempo de coordenação e falha se o latency budget máximo for excedido. Não transforme timeout em sucesso incerto.

### 19. Implementar confirmação

```java
package br.com.formacao.pacelc.application;

import br.com.formacao.pacelc.coordination.NetworkCondition;
import br.com.formacao.pacelc.coordination.StrongCommandCoordinator;
import br.com.formacao.pacelc.domain.AppointmentId;
import br.com.formacao.pacelc.domain.AppointmentVersion;

public final class ConfirmAppointmentService {

    private final StrongCommandCoordinator coordinator;

    public ConfirmAppointmentService(
            StrongCommandCoordinator coordinator) {
        this.coordinator = coordinator;
    }

    public ConfirmationResult confirm(
            AppointmentId appointmentId,
            AppointmentVersion expectedVersion,
            NetworkCondition condition) {

        return coordinator.confirm(
                appointmentId,
                expectedVersion,
                condition);
    }
}
```

O laboratório não aprofunda retry, idempotency key ou deduplicação. O objetivo é medir a escolha PC/EC.

### 20. Implementar busca

`AppointmentSearchService` usa `FastReadCoordinator` em rede saudável e réplica local durante partição.

A resposta deve conter:

```text
items;
servedBy;
sourceVersion;
lastUpdatedAt;
freshnessStatus;
latencyMillis.
```

`freshnessStatus` pode ser:

```text
FRESH;
WITHIN_BUDGET;
STALE;
UNKNOWN.
```

Busca stale não pode ser usada internamente como expected version de um comando.

### 21. Implementar detalhes

`AppointmentDetailsService` recebe opcionalmente uma versão mínima obtida no comando anterior.

Fluxo em operação normal:

```text
1. tenta réplica preferencial;
2. verifica versão mínima;
3. aguarda dentro do timeout;
4. tenta autoridade quando permitido;
5. falha explicitamente se não puder cumprir a policy.
```

Fluxo durante partição:

```text
1. aplica a decisão PA;
2. retorna leitura local com aviso;
3. não promete read-your-writes se a versão mínima não foi alcançada;
4. oferece ação de atualizar novamente.
```

### 22. Implementar dashboard

O dashboard é `PA/EL`.

Ele responde por agregações locais, mesmo que uma réplica esteja alguns segundos atrasada. A interface mostra:

```text
Dados atualizados até 14:32:08.
Algumas alterações recentes podem não aparecer ainda.
```

O dashboard nunca autoriza transições de domínio. Um botão de confirmação deve chamar o serviço consistente, não reutilizar o snapshot agregado.

### 23. Implementar exportação de auditoria

A exportação é `PC/EC`.

Durante partição, ela recusa ou permanece em estado pendente. Em operação normal, lê a fonte consistente e registra a versão de corte do relatório.

Um relatório rápido e incompleto pode ser pior do que um relatório temporariamente indisponível.

### 24. Criar Latency Budgets

Arquivo:

```text
pacelc/LATENCY_BUDGETS.md
```

Exemplo:

```text
Confirm Appointment:
target 300 ms;
maximum 1500 ms.

Appointment Details:
target 150 ms;
maximum 800 ms.

Search Appointments:
target 100 ms;
maximum 400 ms.

Operational Dashboard:
target 250 ms;
maximum 1000 ms.

Audit Export:
target 2 s;
maximum 10 s.
```

O target orienta otimização. O máximo orienta fallback e falha.

### 25. Criar Consistency Budgets

Arquivo:

```text
pacelc/CONSISTENCY_BUDGETS.md
```

Exemplo:

```text
Confirm Appointment:
zero version lag;
authoritative or coordinated.

Appointment Details after command:
minimum command version;
maximum wait 800 ms.

Search Appointments:
maximum 5 versions or 30 seconds.

Operational Dashboard:
maximum 60 seconds.

Audit Export:
zero version lag at report cut.
```

Um latency budget sem consistency budget incentiva respostas rápidas e potencialmente enganosas.

### 26. Criar operation-profile-policy.yaml

```yaml
operations:
  confirmAppointment:
    profile:
      PC_EC
    partition:
      action:
        REJECT_SAFELY
    normal:
      action:
        COORDINATE
    latencyMaximumMilliseconds:
      1500
    maximumVersionLag:
      0

  searchAppointments:
    profile:
      PA_EL
    partition:
      action:
        LOCAL_REPLICA
    normal:
      action:
        FASTEST_REPLICA
    latencyMaximumMilliseconds:
      400
    maximumStalenessSeconds:
      30

  appointmentDetails:
    profile:
      PA_EC
    partition:
      action:
        LOCAL_WITH_WARNING
    normal:
      action:
        MINIMUM_VERSION
    latencyMaximumMilliseconds:
      800
```

### 27. Criar normal-operation-policy.yaml

```yaml
normalOperation:
  latencyPreference:
    requires:
      - latency-budget
      - consistency-budget
      - freshness-metadata
      - safe-use-boundary

  consistencyPreference:
    requires:
      - coordination-strategy
      - timeout
      - fallback
      - latency-measurement

  forbidden:
    - indefinite-coordination
    - stale-result-presented-as-authoritative
    - fastest-response-without-version
    - consistency-claim-without-test
```

### 28. Criar cenários

O runner executará pelo menos seis cenários:

```text
1. confirmação com rede saudável;
2. confirmação com réplica lenta;
3. confirmação durante partição;
4. busca com rede saudável;
5. busca durante partição;
6. detalhes exigindo versão mínima.
```

Cada cenário registra condição, perfil, decisão, latência, versão, staleness, fallback e outcome.

### 29. Cenário — confirmação saudável

Condições:

```text
rede HEALTHY;
réplicas na versão 12;
latência de coordenação 220 ms;
maximum 1500 ms.
```

Resultado esperado:

```text
profile PC/EC;
mode COORDINATE_FOR_CONSISTENCY;
version 13 confirmada;
latency within target;
PASS.
```

### 30. Cenário — confirmação com réplica lenta

Condições:

```text
rede DEGRADED;
uma réplica responde em 1800 ms;
maximum 1500 ms.
```

A policy decide se a réplica é obrigatória. Se for, a operação falha com timeout explícito. Se não for, o coordinator usa o conjunto mínimo previsto e registra degradação.

Não reduza a consistência silenciosamente para cumprir latência.

### 31. Cenário — busca saudável

Condições:

```text
replica A:
40 ms, versão 20.

replica B:
18 ms, versão 19.

budget:
maximum version lag 5.
```

A busca pode retornar a réplica B em 18 ms porque a versão está dentro do consistency budget. A resposta informa versão 19 e freshness.

Se o uso exigir versão 20, o perfil não deve ser `EL` naquele contexto.

### 32. Cenário — busca durante partição

A réplica local possui versão 31 e a autoridade conhecida estava em 32 antes da perda de comunicação.

Resultado:

```text
profile PA/EL;
local response available;
freshness STALE_OR_UNKNOWN;
no command authority;
user warning present.
```

### 33. Cenário — detalhes após confirmação

O comando retorna versão 44. A réplica de leitura está em 43.

O serviço:

```text
aguarda até 800 ms;
recebe versão 44 em 260 ms;
retorna detalhes atualizados;
registra consistency wait 260 ms.
```

Esse cenário mostra o custo mensurável de `EC` em operação normal.

### 34. Criar observabilidade

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  perOperation:
    required:
      - pacelc-profile
      - network-condition
      - decision-mode
      - latency-milliseconds
      - latency-budget-status
      - source-version
      - observed-version
      - version-lag
      - time-lag
      - fallback
      - outcome

  aggregates:
    required:
      - p50
      - p95
      - p99
      - stale-response-rate
      - coordination-timeout-rate
      - partition-rejection-rate
      - authoritative-fallback-rate

  forbidden:
    - raw-personal-data
    - token
    - secret
    - private-topology
```

PACELC precisa aparecer em métricas por operação. Uma média global pode esconder que confirmação está lenta e busca está rápida.

### 35. Criar logs de decisão

Exemplo sanitizado:

```yaml
pacelcDecision:
  operation:
    CONFIRM_APPOINTMENT
  profile:
    PC_EC
  networkCondition:
    HEALTHY
  decisionMode:
    COORDINATE_FOR_CONSISTENCY
  latencyMilliseconds:
    284
  latencyBudgetStatus:
    WITHIN_TARGET
  versionLag:
    0
  outcome:
    SUCCESS
```

Não inclua dados de cliente, endereço, telefone ou topologia real.

### 36. Criar UX Policy

Arquivo:

```text
pacelc/USER_EXPERIENCE.md
```

Defina mensagens para:

```text
operação crítica temporariamente indisponível;
leitura possivelmente atrasada;
leitura aguardando sincronização;
dados atualizados até determinado horário;
tentativa novamente segura;
fallback indisponível.
```

A interface não deve mostrar `PC/EC`, `PA/EL` ou “erro PACELC”. A decisão técnica precisa virar linguagem de negócio.

### 37. Criar Security Policy

```yaml
security:
  lowLatencyReplica:
    authorizationContext:
      required
    crossTenantData:
      forbidden

  authoritativeFallback:
    authorization:
      recheck
    rateLimit:
      required
    audit:
      required

  staleAuthorization:
    privilegedCommand:
      forbiddenWithoutExplicitPolicy

  logs:
    sensitiveData:
      forbidden
```

Uma resposta rápida não pode atravessar fronteiras de autorização. Multi-tenancy será aprofundada na aula 638, mas isolamento básico continua obrigatório.

### 38. Criar Failure Policy

```yaml
failure:
  partitionWithConsistencyProfile:
    action:
      REJECT_SAFELY

  partitionWithAvailabilityProfile:
    action:
      LOCAL_RESPONSE_WITH_FRESHNESS

  normalConsistencyTimeout:
    action:
      EXPLICIT_FAILURE_OR_DOCUMENTED_FALLBACK

  normalLatencyReplicaTooStale:
    action:
      TRY_NEXT_REPLICA_OR_FAIL

  unknownFreshness:
    action:
      MARK_UNKNOWN

  advancedIdempotency:
    deferredToLesson637

  multiTenancyArchitecture:
    deferredToLesson638
```

### 39. Testar os quatro perfis

`PacelcProfileTest` deve validar:

```text
CONSISTENCY + CONSISTENCY = PC/EC;
CONSISTENCY + LATENCY = PC/EL;
AVAILABILITY + CONSISTENCY = PA/EC;
AVAILABILITY + LATENCY = PA/EL.
```

Também valide que nenhum campo aceita `null`.

### 40. Testar decisão durante partição

`PartitionConsistencyDecisionTest` confirma que `PC` produz `PRESERVE_CONSISTENCY`.

`PartitionAvailabilityDecisionTest` confirma que `PA` produz `PRESERVE_AVAILABILITY`.

O ramo `Else` não pode influenciar a decisão quando a condição é `PARTITIONED`.

### 41. Testar decisão em operação normal

`NormalLatencyDecisionTest` confirma que `EL` produz `MINIMIZE_LATENCY`.

`NormalConsistencyDecisionTest` confirma que `EC` produz `COORDINATE_FOR_CONSISTENCY`.

O ramo de partição não pode ser usado para justificar o comportamento normal.

### 42. Testar confirmação

Valide:

- rede saudável;
- expected version correta;
- zero version lag;
- coordenação dentro do budget;
- nova versão confirmada;
- partição gera recusa segura;
- timeout não vira sucesso;
- nenhuma lógica avançada de idempotência foi adicionada.

### 43. Testar busca

Valide:

- escolha da réplica mais rápida;
- staleness dentro do budget;
- metadata de freshness;
- partição mantém resposta local;
- versão muito antiga força próxima réplica ou falha;
- resultado não é usado como autoridade de command.

### 44. Testar detalhes

Valide:

- versão mínima recebida;
- espera limitada;
- leitura retorna versão igual ou superior;
- fallback é documentado;
- timeout é explícito;
- sessão não recebe versão inferior à já observada.

### 45. Testar dashboard

Valide baixa latência, freshness visível, operação durante partição e proibição de usar agregação para decisão crítica.

### 46. Testar arquitetura

Exemplo:

```java
package br.com.formacao.pacelc.architecture;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

public class NoGlobalPacelcLabelTest {

    @ArchTest
    static final ArchRule domainMustNotDependOnPacelcInfrastructure =
            noClasses()
                    .that()
                    .resideInAPackage("..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..replica..");
}
```

As decisões PACELC pertencem à arquitetura e à aplicação, não às entidades de domínio.

### 47. Criar Reports

Exemplo:

```yaml
pacelc:
  operationsEvaluated:
    7
  profiles:
    PC_EC:
      4
    PC_EL:
      0
    PA_EC:
      1
    PA_EL:
      2
  scenariosExecuted:
    12
  latencyBudgetViolations:
    1
  consistencyBudgetViolations:
    0
  staleResponses:
    6
  coordinationTimeouts:
    1
  partitionRejections:
    3
  tests:
    PASS
  architecture:
    PASS
  result:
    PASS_WITH_DOCUMENTED_TIMEOUT
```

### 48. Criar Evidence

Arquivo:

```text
contracts/pacelc-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- operation count;
- profile count por classificação;
- scenario count;
- p50, p95 e p99 por operação;
- latency budget violation count;
- consistency budget violation count;
- stale response count;
- coordination timeout count;
- partition rejection count;
- fallback count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua dados pessoais, credenciais, topologia real, endpoints privados, idempotency keys reais ou detalhes de clientes.

### 49. Criar Gate

O gate valida:

```text
charter;
termos;
matriz por operação;
perfil completo;
partição;
operação normal;
latency budgets;
consistency budgets;
fallbacks;
UX;
segurança;
observabilidade;
testes;
arquitetura;
documentação;
evidence;
não antecipação.
```

Status:

```text
PASS;
PASS_WITH_DOCUMENTED_DEGRADATION;
FAIL_PROFILE;
FAIL_PARTITION_DECISION;
FAIL_NORMAL_OPERATION_DECISION;
FAIL_LATENCY_BUDGET;
FAIL_CONSISTENCY_BUDGET;
FAIL_FRESHNESS;
FAIL_FALLBACK;
FAIL_SECURITY;
FAIL_UX;
FAIL_OBSERVABILITY;
FAIL_TEST;
FAIL_ARCHITECTURE;
INCONCLUSIVE.
```

### 50. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-pacelc\validate-pacelc-contract.ps1

.\scripts\m19\service-scheduling-pacelc\validate-operation-profiles.ps1

.\scripts\m19\service-scheduling-pacelc\validate-latency-budgets.ps1

.\scripts\m19\service-scheduling-pacelc\validate-consistency-budgets.ps1

.\scripts\m19\service-scheduling-pacelc\validate-normal-operation-decisions.ps1

.\scripts\m19\service-scheduling-pacelc\validate-partition-decisions.ps1

.\scripts\m19\service-scheduling-pacelc\validate-pacelc-observability.ps1

.\scripts\m19\service-scheduling-pacelc\run-pacelc-tests.ps1

.\scripts\m19\service-scheduling-pacelc\collect-pacelc-evidence.ps1

.\scripts\m19\service-scheduling-pacelc\verify-pacelc-gate.ps1
```

Ou execute os testes Java:

```powershell
mvn test
```

Finalize:

```powershell
git diff --check

git status
```

### 51. Encerrar o laboratório

Confirme:

- perfis definidos por operação;
- nenhuma classificação global vazia;
- `P` decide entre disponibilidade e consistência;
- `E` decide entre latência e consistência;
- PC, PA, EL e EC foram distinguidos;
- quatro combinações foram testadas;
- confirmação é PC/EC;
- busca e dashboard são PA/EL;
- detalhes após comando usam versão mínima;
- latency budgets foram definidos;
- consistency budgets foram definidos;
- fallback não reduz garantia silenciosamente;
- freshness aparece nas respostas de leitura;
- decisões são observáveis;
- UX traduz o comportamento;
- segurança foi preservada;
- evidence e gate foram gerados;
- idempotência avançada não foi antecipada;
- multi-tenancy não foi aprofundada.

---

## Entendendo o que foi feito

### CAP ganhou um ramo de operação normal

A decisão durante partição continua existindo. PACELC adicionou a análise da rede saudável, em que coordenação e consistência também possuem custo.

### A classificação passou a ser por operação

Confirmação, busca, detalhes, dashboard e auditoria receberam perfis diferentes. Isso evita a falsa conclusão de que todo o sistema possui uma única classificação.

### Latência e consistência ganharam budget

A equipe deixou de discutir “rápido” e “consistente” de forma abstrata. Cada operação passou a ter target, máximo, version lag e time lag tolerados.

### Fallback deixou de ser redução silenciosa

Quando uma coordenação falha ou uma réplica está stale, a policy define próxima réplica, leitura autoritativa, resposta sinalizada ou falha explícita.

### PACELC ganhou evidência

Cenários, métricas, reports e gate mostram o custo real de cada decisão.

---

## Erros comuns importantes

### Tratar PACELC como substituto de CAP

PACELC mantém CAP no ramo de partição e acrescenta a decisão em operação normal.

### Classificar o banco e encerrar a discussão

O comportamento final depende de configuração, operação, driver, topology, timeout, leitura, escrita e regra da aplicação. A unidade útil é a operação do sistema.

### Confundir baixa latência com disponibilidade

Uma resposta de 20 ms pode falhar durante partição. Uma operação disponível pode responder lentamente. São dimensões diferentes.

### Confundir consistência com ausência total de atraso

Existem níveis de consistência. Versão mínima, bounded staleness e leitura autoritativa possuem custos e garantias diferentes.

### Escolher EL sem freshness

A resposta rápida pode estar antiga. Sempre registre versão, idade, staleness e limite de uso.

### Escolher EC sem timeout

Coordenação ilimitada transforma consistência em travamento. Defina budget e resultado explícito.

### Reduzir a garantia silenciosamente

Se confirmação exige consistência, não use réplica stale apenas para cumprir o SLO.

### Usar dashboard para command

Agregações PA/EL servem para observação, não para expected version ou transição crítica.

### Rotular o sistema inteiro

Operações e dados têm riscos diferentes.

### Antecipar idempotência avançada

Retry, duplicação, deduplication window e efeitos externos serão aprofundados na aula 637.

---

## Comandos úteis

### Validar perfis

```powershell
.\scripts\m19\service-scheduling-pacelc\validate-operation-profiles.ps1
```

### Validar budgets

```powershell
.\scripts\m19\service-scheduling-pacelc\validate-latency-budgets.ps1

.\scripts\m19\service-scheduling-pacelc\validate-consistency-budgets.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-pacelc\run-pacelc-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-pacelc\verify-pacelc-gate.ps1
```

---

## Exercício guiado

Implemente os quatro perfis PACELC no laboratório e aplique pelo menos três deles ao domínio `Service Scheduling`.

Use:

```text
PC/EC:
Confirm Appointment.

PA/EC:
Appointment Details após comando.

PA/EL:
Search e Dashboard.
```

Crie um cenário adicional `PC/EL` para uma operação de leitura cuja resposta possa usar réplica rápida em rede saudável, mas deva recusar durante partição por exigência regulatória. Documente por que esse perfil faz sentido e qual limite impede uso indevido do dado.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 635 e ponte para a aula 637 foram preservadas;
- o laboratório `service-scheduling-pacelc` foi criado;
- PACELC Charter foi criado;
- `P`, `A`, `C`, `E`, `L` e `C` foram explicados no modelo;
- PC, PA, EL e EC foram diferenciados;
- PC/EC, PC/EL, PA/EC e PA/EL foram modelados;
- decisões foram feitas por operação, dado e risco;
- confirmação foi classificada como PC/EC;
- busca foi classificada como PA/EL;
- dashboard foi classificado como PA/EL;
- detalhes após comando foram classificados como PA/EC;
- auditoria foi classificada como PC/EC;
- latency budgets foram definidos;
- consistency budgets foram definidos;
- version lag e time lag foram medidos;
- leitura rápida inclui freshness;
- leitura consistente possui versão mínima e timeout;
- coordenação não espera indefinidamente;
- fallback não reduz garantia silenciosamente;
- rede HEALTHY, DEGRADED e PARTITIONED foi modelada;
- cenários normais e de partição foram testados;
- p50, p95 e p99 foram previstos por operação;
- stale responses e coordination timeouts foram medidos;
- UX não expõe termos internos;
- segurança protege fallback autoritativo;
- dashboard não decide invariantes;
- reports, evidence e gate foram criados;
- idempotência avançada não foi aprofundada;
- multi-tenancy não foi antecipada;
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
  labs/m19/aula-636-pacelc/service-scheduling-pacelc `
  scripts/m19/service-scheduling-pacelc `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateTopology|realTenant|idempotencyKeyLifecycle|transactionalInbox|semanticIdempotency"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): aplicar PACELC por operacao"
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
- topologia real;
- endpoints privados;
- identificadores reais de clientes;
- idempotência avançada;
- multi-tenancy aprofundada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou PACELC.

Você criou:

```text
PACELC Charter;

Partition Preference;

Else Preference;

Pacelc Profile;

Operation PACELC Policy;

Latency Budget;

Consistency Budget;

Operation Decision Matrix;

Fast Read Coordinator;

Consistent Read Coordinator;

Strong Command Coordinator;

Pacelc Decision Engine;

cenários de rede saudável,
degradação e partição;

observabilidade;

reports;

evidence;

gate.
```

Você comprovou que CAP não encerra a discussão de sistemas distribuídos; que, mesmo sem partição, coordenação aumenta latência; que `PC` e `PA` representam escolhas durante partição; que `EL` e `EC` representam escolhas em operação normal; que perfis devem ser definidos por operação e risco; que confirmação pode ser `PC/EC`, busca e dashboard podem ser `PA/EL`, detalhes após comando podem ser `PA/EC`; que latência sem freshness é perigosa; que consistência sem timeout trava; e que toda escolha precisa de budget, fallback, métrica, UX, teste e evidência.

A próxima aula será:

```text
637 - M19.27 - Idempotencia avancada
```

Nela, você irá aprofundar o comportamento de comandos, mensagens e efeitos externos quando clientes, brokers, workers ou gateways repetem uma operação; serão tratados lifecycle de chaves, deduplication windows, concorrência, inbox, replay e idempotência semântica.

Nenhum aprofundamento de idempotência avançada ou multi-tenancy foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Expliquei o ramo de partição e o ramo `Else`.
- [ ] Diferenciei PC, PA, EL e EC.
- [ ] Modelei os quatro perfis.
- [ ] Classifiquei operações, não o sistema inteiro.
- [ ] Defini latency e consistency budgets.
- [ ] Testei rede saudável, degradada e particionada.
- [ ] Registrei freshness e fallback.
- [ ] Gerei reports, evidence e gate.

---

## Troubleshooting adicional

### A busca ficou rápida, mas mostra dados antigos demais

Reduza o consistency budget, tente outra réplica ou altere o perfil da operação. Não esconda a violação.

### A confirmação ultrapassa o SLO

Meça cada etapa da coordenação. Otimize rede, serialização, conexão e quantidade de réplicas exigidas, mas não reduza consistência sem decisão de negócio.

### A equipe quer usar a mesma policy para tudo

Volte à matriz e separe commands críticos, detalhes, busca, dashboard e auditoria.

### O fallback autoritativo sobrecarrega a fonte

Aplique rate limit, cache seguro, read-your-writes, espera limitada e correção da réplica. Não transforme fallback em caminho principal.

### O sistema responde stale sem saber quanto

Marque freshness como `UNKNOWN`, gere alerta e corrija checkpoint, clock ou versionamento.

### A réplica mais rápida está fora do budget

Tente outra réplica. Se nenhuma atender, falhe ou use fallback previsto.

### O dashboard está sendo usado para confirmar operação

Separe query de observação e command. O dashboard não possui autoridade.

### O timeout de coordenação gera retry automático

Registre a ambiguidade. A política avançada de idempotência será construída na aula 637.

### A discussão virou comparação de fornecedores

Retorne à operação, configuração, requisito e evidência. Rótulo de produto não substitui teste.

### A discussão virou isolamento por cliente

Preserve arquitetura de multi-tenancy para a aula 638.

---

## Perguntas de revisão

1. O que PACELC acrescenta ao CAP?
2. Qual é a escolha no ramo de partição?
3. Qual é a escolha no ramo normal?
4. O que significam PC e PA?
5. O que significam EL e EC?
6. O que caracteriza PC/EC?
7. Por que busca pode ser PA/EL?
8. Por que confirmação pode ser PC/EC?
9. O que é latency budget?
10. O que é consistency budget?
11. PACELC deve classificar o sistema inteiro?
12. Qual é a próxima aula?

## Roteiro de resposta

1. A decisão entre latência e consistência quando não há partição.
2. Disponibilidade ou consistência.
3. Latência ou consistência.
4. Consistência ou disponibilidade durante partição.
5. Latência ou consistência em operação normal.
6. Consistência em ambos os ramos.
7. Porque leitura derivada pode aceitar staleness controlado.
8. Porque estados finais conflitantes são perigosos.
9. Target e máximo de tempo de resposta.
10. Limite de versão e tempo de atraso aceitos.
11. Não; deve orientar operações e dados.
12. Idempotência avançada.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 636 - M19.26 - PACELC**

- Aprofundei PACELC como extensão operacional de CAP.
- Mantive a decisão de partição entre Availability e Consistency.
- Adicionei a decisão de operação normal entre Latency e Consistency.
- Diferenciei PC, PA, EL e EC.
- Modelei PC/EC, PC/EL, PA/EC e PA/EL.
- Evitei classificar o sistema inteiro com uma única etiqueta.
- Criei o laboratório `service-scheduling-pacelc`.
- Criei PACELC Charter.
- Criei Partition Preference e Else Preference.
- Criei Pacelc Profile e notação combinada.
- Criei Operation PACELC Policy.
- Defini Latency Budgets por operação.
- Defini Consistency Budgets por versão e tempo.
- Classifiquei confirmação como PC/EC.
- Classifiquei busca e dashboard como PA/EL.
- Classifiquei detalhes após comando como PA/EC.
- Classifiquei auditoria como PC/EC.
- Criei Fast Read Coordinator.
- Criei Consistent Read Coordinator.
- Criei Strong Command Coordinator.
- Criei Pacelc Decision Engine.
- Modelei rede HEALTHY, DEGRADED e PARTITIONED.
- Testei decisões nos ramos P e E.
- Medi latência, staleness, timeouts e fallbacks.
- Criei UX para recusa, sincronização e freshness.
- Protegi fallback autoritativo com autorização e rate limit.
- Criei observabilidade por operação e perfil.
- Criei reports, evidence e gate.
- Não antecipei idempotência avançada ou multi-tenancy.
- Próxima aula: Idempotência avançada.
```

---

## Referência técnica curta

- PACELC.
- Partition.
- Else.
- PC.
- PA.
- EL.
- EC.
- Latency Budget.
- Consistency Budget.
- Freshness.
- Version Lag.
- Coordination Timeout.

Regra final:

```text
PACELC deve ser aplicado como uma matriz operacional por command, query, dado e risco: quando existe partição, cada operação escolhe explicitamente preservar consistência ou disponibilidade, e quando a rede está saudável escolhe reduzir latência ou elevar consistência, sem tratar essas propriedades como gratuitas; confirmação, reagendamento, cancelamento e auditoria podem operar como PC/EC porque conflitos ou omissões são mais perigosos que recusa e latência adicional, detalhes após command podem operar como PA/EC ao manter alguma disponibilidade durante falha e exigir versão mínima no caminho normal, enquanto busca e dashboard podem operar como PA/EL desde que version, last-updated, freshness e limite de uso acompanhem a resposta; toda classificação precisa de motivo de negócio, latency budget, consistency budget, timeout, fallback, UX, segurança, teste, métricas e evidence, uma réplica rápida fora do budget não é aceitável, uma coordenação consistente sem timeout não é operável, e nenhuma redução de garantia pode acontecer silenciosamente; o gate termina com perfis, matriz, decisões de partição e operação normal, budgets, cenários, freshness, fallbacks, observabilidade, segurança, testes, arquitetura, documentação e evidence aprovados, enquanto lifecycle de idempotency keys, deduplication windows, inbox, concorrência e efeitos externos ficam reservados exclusivamente à aula 637 e multi-tenancy permanece para a aula 638.
```
