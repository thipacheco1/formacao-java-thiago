# 651 - M19.41 - Strangler Fig

## Apresentação da aula

Na aula 650, você estruturou a modernização de legado por capacidades, risco, dados, comportamento observável e ondas de mudança. Agora aplicará uma estratégia concreta para substituir partes do sistema antigo sem troca total e instantânea.

O padrão Strangler Fig cria uma fronteira ao redor do legado. Essa fronteira recebe chamadas e decide se cada operação segue para o caminho antigo ou para uma implementação nova. À medida que capacidades são extraídas e validadas, o novo caminho assume mais tráfego e o legado perde responsabilidades até poder ser retirado.

O padrão não é apenas um proxy. Ele exige unidade de migração clara, roteamento determinístico, compatibilidade, autoridade de dados, comparação de comportamento, rollout, rollback, observabilidade e decommission.

A pergunta desta aula será:

```text
como substituir uma capacidade legada
por etapas,
sem big bang,
sem dupla autoridade oculta
e sem coexistência permanente?
```

O laboratório será:

```text
labs/m19/aula-651-strangler-fig/service-scheduling-strangler
```

Você criará uma fronteira de entrada para `Service Scheduling`, catálogo de rotas, adapters legado e moderno, shadow traffic, comparação de respostas, rollout progressivo, controle de autoridade, kill switch, critérios de retirada, reports, evidence e gate.

A primeira capacidade extraída será `Appointment Details`, uma consulta adequada para caracterização e shadow sem efeitos externos.

A próxima aula será:

```text
652 - M19.42 - Microservicos com criterio
```

A decisão sobre autonomia de deploy, dados, operação e equipe fica para a aula 652. Nesta aula, a nova implementação será apenas uma capacidade substituta atrás de uma fronteira.

Regra central:

```text
Strangler Fig substitui responsabilidade,
não apenas endpoint;

cada passo precisa de rota,
contrato, autoridade, evidência,
rollback e critério de retirada.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
649:
Evolucao controlada da arquitetura.

650:
Modernizacao de legado.

651:
Strangler Fig.

652:
Microservicos com criterio.

653:
Anti patterns de microservicos.
```

A progressão é:

```text
controlar a mudança arquitetural;

entender o legado e escolher estratégias;

substituir capacidades incrementalmente;

decidir se a separação distribuída faz sentido;

reconhecer decomposições ruins.
```

A aula 650 definiu o que modernizar e por quê. A aula 651 define como criar um caminho de substituição progressiva. A aula 652 avaliará se o resultado deve permanecer modular, tornar-se um deployable independente ou evoluir para microserviço.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-651-strangler-fig/service-scheduling-strangler
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/strangler
│   ├── entrypoint
│   ├── routing
│   ├── legacy
│   ├── modern
│   ├── shadow
│   ├── authority
│   ├── rollout
│   └── observability
├── src/test/java/br/com/formacao/strangler
│   ├── routing
│   ├── contract
│   ├── shadow
│   ├── authority
│   ├── rollout
│   └── architecture
├── strangler
│   ├── STRANGLER_CHARTER.md
│   ├── CAPABILITY_SCOPE.md
│   ├── CURRENT_FLOW.md
│   ├── TARGET_FLOW.md
│   ├── ROUTING_MODEL.md
│   ├── CONTRACT_COMPATIBILITY.md
│   ├── DATA_AUTHORITY.md
│   ├── SHADOW_TRAFFIC_POLICY.md
│   ├── ROLLOUT_PLAN.md
│   ├── ROLLBACK_POLICY.md
│   ├── OBSERVABILITY.md
│   ├── SECURITY_POLICY.md
│   ├── OPERATING_MODEL.md
│   └── DECOMMISSION_CRITERIA.md
├── contracts
│   ├── strangler-contract.yaml
│   ├── route-policy.yaml
│   ├── contract-compatibility-policy.yaml
│   ├── shadow-traffic-policy.yaml
│   ├── authority-policy.yaml
│   ├── rollout-policy.yaml
│   ├── rollback-policy.yaml
│   ├── observability-policy.yaml
│   ├── security-policy.yaml
│   └── decommission-policy.yaml
└── reports
    ├── route-decision-report.yaml
    ├── shadow-comparison-report.yaml
    ├── rollout-health-report.yaml
    ├── authority-report.yaml
    └── strangler-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-strangler
├── validate-strangler-contract.ps1
├── validate-capability-scope.ps1
├── validate-route-model.ps1
├── validate-contract-compatibility.ps1
├── validate-shadow-traffic.ps1
├── validate-single-authority.ps1
├── validate-rollout-policy.ps1
├── validate-rollback-policy.ps1
├── validate-decommission-readiness.ps1
├── run-strangler-tests.ps1
├── collect-strangler-evidence.ps1
└── verify-strangler-gate.ps1
```

---

## Conceito essencial

### Unidade de substituição

A unidade do Strangler Fig deve ser uma capacidade ou fluxo reconhecível, não um conjunto arbitrário de classes. `Appointment Details` possui entrada, contrato, consumidores, dados, regras de composição e métricas próprias. Essa definição permite medir quando a nova implementação realmente substituiu a antiga.

### Fronteira de entrada

Toda chamada relevante precisa atravessar uma fronteira controlada. Ela pode ser API Gateway, reverse proxy, façade de aplicação, BFF, adapter ou camada de roteamento interna. Sem uma entrada comum, a equipe não controla o deslocamento de tráfego e não sabe quais consumidores ainda chegam diretamente ao legado.

### Coexistência controlada

Durante a migração, caminhos antigo e novo coexistem. Coexistência não significa dupla autoridade. Para consultas, é possível executar shadow traffic e comparar respostas. Para comandos, deve existir uma única autoridade de escrita por operação e fase.

### Roteamento progressivo

O roteamento começa com 100% do tráfego no legado. Depois, habilita shadow, canário, cohorts, percentuais e, por fim, 100% no novo caminho. Cada estágio possui critérios de entrada, sucesso, interrupção e rollback.

### Retirada real

O padrão só termina quando a rota antiga deixa de receber tráfego, consumidores diretos são removidos, dados e jobs são tratados, acessos são revogados e o componente legado pode ser desativado. Manter o legado eternamente atrás do router não é conclusão; é coexistência permanente.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-651-strangler-fig/service-scheduling-strangler

Set-Location `
  labs/m19/aula-651-strangler-fig/service-scheduling-strangler
```

---

### 2. Criar Strangler Charter

Arquivo:

```text
strangler/STRANGLER_CHARTER.md
```

Conteúdo:

```markdown
# Strangler Charter

Capacidade inicial:
Appointment Details.

Legado:
legacy-scheduling-core.

Nova implementação:
modern-appointment-details.

Fronteira de entrada:
Scheduling Entry Point.

Estratégia:
default legacy,
shadow,
canary,
cohort,
progressive rollout,
full cutover,
decommission.

Regra de escrita:
uma única autoridade
por operação e estágio.

Condição de conclusão:
zero tráfego legado,
zero consumer direto,
dados reconciliados,
rollback encerrado,
componente retirável.
```

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/strangler-contract.yaml
```

Conteúdo:

```yaml
strangler:
  context:
    Service-Scheduling

  capability:
    Appointment-Details

  required:
    - explicit-capability-scope
    - single-entry-boundary
    - default-legacy-route
    - deterministic-routing
    - contract-compatibility
    - shadow-without-side-effect
    - response-comparison
    - single-write-authority
    - progressive-rollout
    - kill-switch
    - rollback-policy
    - observability
    - decommission-criteria
    - tests
    - evidence

  forbidden:
    - big-bang-cutover
    - hidden-direct-legacy-access
    - random-routing-without-cohort-stability
    - command-shadow-with-side-effect
    - undocumented-dual-write
    - permanent-compatibility-layer
    - microservice-by-default

  nextLesson:
    code:
      M19.42
```

---

### 4. Definir a capacidade

Arquivo:

```text
strangler/CAPABILITY_SCOPE.md
```

Registre:

```text
Capability:
Appointment Details.

Inputs:
appointmentId;
actor;
tenant;
requested fields;
consistency requirement.

Outputs:
status;
window;
customer-safe location;
assigned service summary;
last updated;
data freshness indicator.

Consumers:
customer portal;
operations portal;
field preparation;
support tooling.

Out of scope:
confirmation;
rescheduling;
cancellation;
capacity reservation;
billing;
notification dispatch.
```

O escopo evita que a primeira extração cresça até se tornar uma reescrita informal do sistema inteiro.

---

### 5. Mapear o fluxo atual

Arquivo:

```text
strangler/CURRENT_FLOW.md
```

Fluxo atual:

```text
Consumer
-> legacy endpoint
-> legacy controller
-> legacy service
-> shared database
-> legacy response mapping.
```

Registre autenticação, autorização, cache, tabelas consultadas, timeouts, retries, códigos de erro, campos opcionais, consumers diretos e jobs que contornam a API.

---

### 6. Mapear o fluxo alvo

Arquivo:

```text
strangler/TARGET_FLOW.md
```

Fluxo alvo:

```text
Consumer
-> Scheduling Entry Point
-> Strangler Router
-> Modern Appointment Details
-> owned read model
-> compatible response.
```

Durante a transição:

```text
Scheduling Entry Point
-> Strangler Router
   -> legacy adapter
   -> modern adapter
   -> shadow comparator.
```

---

### 7. Criar Operation Name

```java
public enum OperationName {
    GET_APPOINTMENT_DETAILS,
    SEARCH_APPOINTMENTS,
    CONFIRM_APPOINTMENT,
    RESCHEDULE_APPOINTMENT,
    CANCEL_APPOINTMENT
}
```

Somente `GET_APPOINTMENT_DETAILS` será migrada nesta aula.

---

### 8. Criar os destinos de rota

```java
public enum RouteTarget {
    LEGACY,
    MODERN,
    LEGACY_WITH_MODERN_SHADOW
}
```

`LEGACY_WITH_MODERN_SHADOW` retorna a resposta do legado e executa o novo caminho apenas para comparação segura.

---

### 9. Criar Rollout Stage

```java
public enum RolloutStage {
    LEGACY_ONLY,
    SHADOW,
    INTERNAL_CANARY,
    CUSTOMER_COHORT,
    PROGRESSIVE_PERCENTAGE,
    MODERN_PRIMARY,
    LEGACY_DISABLED
}
```

Cada estágio deve possuir owner, início, critérios, métricas, janela mínima e condição de rollback.

---

### 10. Criar Route Policy

```java
public record RoutePolicy(
        OperationName operation,
        RolloutStage stage,
        int modernPercentage,
        Set<String> allowedCohorts,
        boolean killSwitchEnabled,
        Instant effectiveFrom,
        String owner) {

    public RoutePolicy {
        Objects.requireNonNull(operation);
        Objects.requireNonNull(stage);
        Objects.requireNonNull(allowedCohorts);
        Objects.requireNonNull(effectiveFrom);
        Objects.requireNonNull(owner);

        if (modernPercentage < 0 || modernPercentage > 100) {
            throw new IllegalArgumentException(
                    "Modern percentage must be between 0 and 100");
        }
    }
}
```

---

### 11. Criar Route Decision

```java
public record RouteDecision(
        OperationName operation,
        RouteTarget target,
        RolloutStage stage,
        String reason,
        String cohort,
        String policyVersion) {
}
```


---

### 12. Criar Route Registry

```java
public interface RouteRegistry {

    RoutePolicy requirePolicy(
            OperationName operation);

    void replace(
            RoutePolicy policy);
}
```


---

### 13. Criar Cohort Selector determinístico

```java
public final class CohortSelector {

    public int bucket(
            UUID stableSubjectId,
            OperationName operation) {

        int hash = Objects.hash(
                stableSubjectId,
                operation.name());

        return Math.floorMod(
                hash,
                100);
    }

    public boolean selected(
            UUID stableSubjectId,
            OperationName operation,
            int percentage) {

        return bucket(
                stableSubjectId,
                operation) < percentage;
    }
}
```

O mesmo sujeito permanece no mesmo cohort. Roteamento aleatório por request produz experiência inconsistente e dificulta diagnóstico.

---

### 14. Criar Strangler Router

```java
public final class StranglerRouter {

    private final RouteRegistry registry;
    private final CohortSelector cohorts;
    private final KillSwitch killSwitch;

    public RouteDecision decide(
            SchedulingRequest request) {

        RoutePolicy policy =
                registry.requirePolicy(
                        request.operation());

        if (killSwitch.isActive()
                || policy.killSwitchEnabled()) {

            return legacy(
                    request,
                    policy,
                    "KILL_SWITCH");
        }

        return switch (policy.stage()) {
            case LEGACY_ONLY ->
                    legacy(request, policy, "LEGACY_ONLY");
            case SHADOW ->
                    shadow(request, policy);
            case INTERNAL_CANARY,
                 CUSTOMER_COHORT,
                 PROGRESSIVE_PERCENTAGE ->
                    progressive(request, policy);
            case MODERN_PRIMARY,
                 LEGACY_DISABLED ->
                    modern(request, policy, "MODERN_PRIMARY");
        };
    }
}
```

O router não implementa regra de domínio. Ele decide o caminho com base em policy.

---

### 15. Definir default seguro

Quando não existir política válida, a operação deve falhar de forma explícita ou usar um default aprovado. Neste laboratório, o default para operações ainda não migradas será legado.

Não use modernização implícita por ausência de configuração.

---

### 16. Criar Scheduling Entry Point

```java
public final class SchedulingEntryPoint {

    private final StranglerRouter router;
    private final LegacySchedulingPort legacy;
    private final ModernSchedulingPort modern;
    private final ShadowTrafficExecutor shadow;

    public SchedulingResponse execute(
            SchedulingRequest request) {

        RouteDecision decision =
                router.decide(request);

        return switch (decision.target()) {
            case LEGACY ->
                    legacy.execute(request, decision);
            case MODERN ->
                    modern.execute(request, decision);
            case LEGACY_WITH_MODERN_SHADOW ->
                    shadow.execute(request, decision);
        };
    }
}
```


---

### 17. Criar Legacy Scheduling Port

```java
public interface LegacySchedulingPort {

    SchedulingResponse execute(
            SchedulingRequest request,
            RouteDecision decision);
}
```

O adapter encapsula protocolo, timeout, autenticação, tradução e erros do legado.

---

### 18. Criar Anti-Corruption Layer

`LegacyContractTranslator` converte o formato antigo para o contrato canônico da fronteira.

```java
public final class LegacyContractTranslator {

    public AppointmentDetailsView translate(
            LegacyAppointmentResponse legacy) {

        return new AppointmentDetailsView(
                legacy.appointmentCode(),
                mapStatus(legacy.statusCode()),
                legacy.startDateTime(),
                legacy.endDateTime(),
                safeLocation(legacy),
                legacy.lastChangeAt(),
                DataFreshness.fromLegacy(
                        legacy.lastChangeAt()));
    }
}
```

Não permita que códigos, nomes de tabela ou exceções do legado vazem para a nova capacidade.

---

### 19. Criar contrato canônico

```java
public record AppointmentDetailsView(
        String appointmentCode,
        String status,
        Instant startsAt,
        Instant endsAt,
        String locationSummary,
        Instant lastUpdatedAt,
        DataFreshness freshness) {
}
```

O contrato canônico pertence à fronteira de migração, não ao modelo interno do legado ou da nova implementação.

---

### 20. Criar Modern Scheduling Port

```java
public interface ModernSchedulingPort {

    SchedulingResponse execute(
            SchedulingRequest request,
            RouteDecision decision);
}
```


---

### 21. Preservar compatibilidade externa

Arquivo:

```text
strangler/CONTRACT_COMPATIBILITY.md
```

Documente:

- campos obrigatórios;
- campos opcionais;
- valores nulos;
- ordenação;
- códigos de erro;
- semântica de ausência;
- timezone;
- precisão de datas;
- paginação;
- autorização;
- limites de latência;
- consumers conhecidos.

Compatibilidade não significa copiar defeitos indefinidamente. Diferenças intencionais precisam de decisão, versionamento e comunicação.

---

### 22. Criar contract compatibility policy

Arquivo:

```text
contracts/contract-compatibility-policy.yaml
```

Conteúdo:

```yaml
compatibility:
  canonicalContract:
    required: true

  compare:
    - status-code
    - required-fields
    - null-semantics
    - date-time
    - error-code
    - authorization-result

  intentionalDifference:
    requires:
      - decision-id
      - consumer-impact
      - rollout-plan

  legacyInternalLeak:
    forbidden: true
```

---

### 23. Criar Shadow Traffic

Shadow traffic executa a consulta moderna sem alterar a resposta enviada ao consumidor.

```java
public final class ShadowTrafficExecutor {

    private final LegacySchedulingPort legacy;
    private final ModernSchedulingPort modern;
    private final ShadowComparator comparator;

    public SchedulingResponse execute(
            SchedulingRequest request,
            RouteDecision decision) {

        SchedulingResponse primary =
                legacy.execute(request, decision);

        modern.executeShadow(request)
                .whenComplete((candidate, error) ->
                        comparator.record(
                                request,
                                primary,
                                candidate,
                                error));

        return primary;
    }
}
```

A resposta moderna não influencia o cliente durante shadow.

---

### 24. Proibir efeitos externos em shadow

Arquivo:

```text
contracts/shadow-traffic-policy.yaml
```

Conteúdo:

```yaml
shadow:
  allowed:
    - idempotent-read
    - response-comparison
    - latency-measurement

  forbidden:
    - database-write
    - event-publication
    - notification
    - payment
    - capacity-reservation
    - audit-as-business-effect

  responseToConsumer:
    source:
      LEGACY
```

Commands não devem ser sombreados como se fossem queries.

---

### 25. Normalizar respostas

Datas, IDs de correlação, ordem de listas e campos derivados podem variar sem representar erro funcional.

```java
public final class ResponseNormalizer {

    public NormalizedAppointmentDetails normalize(
            AppointmentDetailsView value) {

        return new NormalizedAppointmentDetails(
                value.appointmentCode(),
                value.status(),
                truncateToSeconds(value.startsAt()),
                truncateToSeconds(value.endsAt()),
                normalizeWhitespace(
                        value.locationSummary()));
    }
}
```

A normalização deve ser limitada. Remover diferenças relevantes para “melhorar” a taxa de paridade gera falsa evidência.

---

### 26. Classificar diferenças

Categorias recomendadas:

```text
EQUIVALENT;

BENIGN_FORMAT_DIFFERENCE;

KNOWN_INTENTIONAL_CHANGE;

MISSING_REQUIRED_FIELD;

STATUS_MISMATCH;

AUTHORIZATION_MISMATCH;

NOT_FOUND_MISMATCH;

STALE_DATA_MISMATCH;

UNEXPECTED_ERROR;

TIMEOUT.
```

Autorização divergente, status divergente e ausência divergente são críticas.

---

### 27. Criar Shadow Comparison

```java
public record ShadowComparison(
        UUID comparisonId,
        OperationName operation,
        String subjectReference,
        DifferenceType differenceType,
        boolean equivalent,
        Duration legacyLatency,
        Duration modernLatency,
        Instant comparedAt,
        String policyVersion) {
}
```

`subjectReference` deve ser um identificador sanitizado ou hash apropriado.

---

### 28. Definir critérios de shadow

Exemplo:

```text
mínimo:
7 dias;

requisições:
100.000;

paridade funcional:
>= 99,95%;

diferença crítica:
0;

error rate moderna:
<= baseline legado;

p95 moderna:
<= 250 ms;

p99 moderna:
<= 600 ms.
```

O volume e a duração precisam cobrir horários, tenants, dados e casos raros relevantes.

---

### 29. Criar Data Authority

Arquivo:

```text
strangler/DATA_AUTHORITY.md
```

Durante a extração de `Appointment Details`:

```text
Command authority:
legacy-scheduling-core.

Read model authority for modern query:
modern appointment projection.

Source of truth:
legacy transactional state
until command migration occurs.

Projection update:
legacy outbox events.

Reconciliation:
legacy source
versus modern projection.
```

A nova consulta pode possuir um read model próprio sem se tornar autoridade de comandos.

---

### 30. Evitar leitura direta no banco legado

Conectar a nova capacidade diretamente às tabelas antigas pode acelerar a primeira entrega, mas mantém coupling estrutural, semântica implícita e risco de mudança.

Quando um acesso transitório for inevitável, registre:

- tabelas permitidas;
- modo read-only;
- owner;
- query budget;
- prazo;
- telemetria;
- estratégia de remoção.

A preferência do laboratório será projeção alimentada por eventos do outbox.

---

### 31. Criar Authority Policy

Arquivo:

```text
contracts/authority-policy.yaml
```

Conteúdo:

```yaml
authority:
  commands:
    source:
      LEGACY

  modernReadModel:
    derivedFrom:
      LEGACY_OUTBOX

  hiddenDualWrite:
    forbidden: true

  commandCutover:
    requires:
      - explicit-authority-change
      - reconciliation
      - rollback-plan
      - consumer-validation
      - audit
```

---

### 32. Criar Write Migration Guard

Embora a aula migre uma query, o guard impede que alguém encaminhe commands para o novo caminho por acidente.

```java
public final class WriteMigrationGuard {

    private final AuthorityPolicy authority;

    public void requireAllowed(
            OperationName operation,
            RouteTarget target) {

        if (isCommand(operation)
                && target == RouteTarget.MODERN
                && !authority.modernOwns(operation)) {

            throw new IllegalStateException(
                    "Modern path is not command authority");
        }
    }
}
```

---

### 33. Definir estágio Internal Canary

No canário interno, apenas usuários operacionais controlados ou dados sintéticos usam a nova rota como resposta primária.

Critérios:

- suporte treinado;
- dashboard ativo;
- kill switch testado;
- rollback em menos de cinco minutos;
- zero diferença crítica em shadow;
- segurança aprovada.

---

### 34. Definir Customer Cohort

Cohorts podem ser organizados por tenant, região, canal, versão do cliente ou grupo controlado. O critério deve ser estável e não discriminatório.

Evite ativar por porcentagem global quando um tenant inteiro precisa permanecer consistente durante uma sessão ou processo.

---

### 35. Definir Progressive Percentage

Exemplo de estágios:

```text
1%;
5%;
10%;
25%;
50%;
75%;
100%.
```

Cada avanço exige janela mínima e avaliação de latência, erro, paridade, volume, incidentes e feedback de negócio.

---

### 36. Criar rollout policy

Arquivo:

```text
contracts/rollout-policy.yaml
```

Conteúdo:

```yaml
rollout:
  stages:
    - SHADOW
    - INTERNAL_CANARY
    - CUSTOMER_COHORT
    - PROGRESSIVE_PERCENTAGE
    - MODERN_PRIMARY
    - LEGACY_DISABLED

  advanceRequires:
    - minimum-observation-window
    - error-budget-healthy
    - zero-critical-difference
    - rollback-tested
    - owner-approval

  skipStage:
    forbidden: true

  cohort:
    deterministic: true
```

---

### 37. Criar Kill Switch

```java
public final class KillSwitch {

    private final AtomicBoolean active =
            new AtomicBoolean(false);

    public boolean isActive() {
        return active.get();
    }

    public void activate() {
        active.set(true);
    }

    public void deactivate() {
        active.set(false);
    }
}
```

Em produção, a configuração deve ser distribuída, auditável, autenticada e observável.

---

### 38. Definir rollback

Arquivo:

```text
strangler/ROLLBACK_POLICY.md
```

Gatilhos:

```text
critical difference > 0;

modern error rate > 1%;

p95 > 350 ms por 10 minutos;

authorization mismatch;

data freshness beyond 30 seconds;

consumer incident;

projection lag beyond budget.
```

Ação:

```text
freeze rollout;
activate kill switch;
route to legacy;
preserve evidence;
open incident;
reconcile data;
review decision.
```

Rollback de rota não corrige automaticamente efeitos já produzidos. Para queries, o risco é menor; para commands futuros, serão necessárias compensações e verificação de autoridade.

---

### 39. Criar rollback policy contratual

Arquivo:

```text
contracts/rollback-policy.yaml
```

Conteúdo:

```yaml
rollback:
  trigger:
    - critical-difference
    - authorization-mismatch
    - error-rate-breach
    - latency-breach
    - freshness-breach

  action:
    - freeze-rollout
    - activate-kill-switch
    - route-legacy
    - preserve-evidence
    - reconcile

  manualOnly:
    false

  untestedKillSwitch:
    action:
      FAIL
```

---

### 40. Observar decisões de rota

Registre:

- operation;
- route target;
- rollout stage;
- cohort;
- policy version;
- latency;
- outcome;
- fallback;
- comparison category;
- kill switch state.

Não registre payloads sensíveis.

---

### 41. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  routing:
    required:
      - operation
      - target
      - stage
      - cohort
      - policy-version
      - outcome

  comparison:
    required:
      - total
      - equivalent-rate
      - critical-difference-count
      - timeout-count

  health:
    required:
      - legacy-latency
      - modern-latency
      - legacy-error-rate
      - modern-error-rate
      - projection-lag
      - rollback-count

  forbidden:
    - personal-payload
    - token
    - secret
```

---

### 42. Tratar segurança na fronteira

A fronteira deve preservar autenticação, autorização, tenant, scopes, rate limits, audit context e classificação de dados.

Nunca compare apenas o payload de sucesso. Compare também:

```text
autorizado versus negado;

not found versus forbidden;

campos filtrados;

mascaramento;

tenant boundary;

rate limit;

auditoria.
```

---

### 43. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

Conteúdo:

```yaml
security:
  entryPoint:
    authentication:
      required
    authorization:
      required
    tenant-context:
      required

  route:
    mustNotBypassAuthorization: true

  shadow:
    mustReuseAuthorizedContext: true
    externalEffect: false

  comparison:
    sensitivePayloadStorage:
      forbidden

  configurationChange:
    privileged: true
    audited: true
```

---

### 44. Testar default legacy

`DefaultLegacyRouteTest` valida:

1. operação ainda não migrada;
2. policy `LEGACY_ONLY`;
3. rota escolhida é `LEGACY`;
4. modern adapter não é chamado;
5. decision log contém motivo e versão.

---

### 45. Testar shadow sem efeito

`ShadowTrafficNoSideEffectTest` valida:

1. legado responde ao consumidor;
2. moderno executa consulta;
3. resposta moderna não altera retorno;
4. nenhum write ocorre;
5. nenhum evento é publicado;
6. comparação é registrada.

---

### 46. Testar paridade de contrato

Valide:

- campos obrigatórios;
- status;
- timezone;
- precisão temporal;
- null semantics;
- erros;
- autorização;
- not found;
- freshness.

Uma taxa alta de equivalência não compensa uma única divergência de autorização.

---

### 47. Testar cohort determinístico

`DeterministicCohortTest` confirma que o mesmo `appointmentId` e a mesma operação permanecem no mesmo bucket em execuções diferentes.

Teste também distribuição aproximada em uma amostra grande.

---

### 48. Testar rollout progressivo

`ProgressiveRolloutTest` executa policies de 1%, 10%, 50% e 100%, mede a distribuição e confirma que operações fora do escopo continuam no legado.

---

### 49. Testar kill switch

`KillSwitchRouteTest` confirma:

1. rota moderna ativa;
2. kill switch acionado;
3. próxima decisão retorna legado;
4. mudança é auditada;
5. dashboard sinaliza rollback.

---

### 50. Testar autoridade única

`SingleWriteAuthorityTest` tenta encaminhar `CONFIRM_APPOINTMENT` para o moderno antes da mudança de authority.

O guard deve bloquear a operação.

---

### 51. Testar ausência de dual write

`NoHiddenDualWriteTest` verifica que a consulta moderna não grava estado transacional, não publica command events e não altera o legado.

---

### 52. Testar rollback threshold

Simule error rate moderna acima do limite e confirme:

- rollout congelado;
- kill switch ativado;
- tráfego retorna ao legado;
- evidence preservada;
- owner notificado.

---

### 53. Criar critérios de decommission

Arquivo:

```text
strangler/DECOMMISSION_CRITERIA.md
```

Critérios:

```text
100% da rota moderna por 30 dias;

zero chamada legítima ao endpoint legado;

zero consumer direto desconhecido;

zero critical difference;

SLO moderno saudável;

projection reconciliation aprovada;

runbook atualizado;

rollback window encerrada;

jobs antigos removidos;

credenciais revogadas;

dados preservados conforme retenção;

owner de negócio aprovou.
```

---

### 54. Criar decommission policy

Arquivo:

```text
contracts/decommission-policy.yaml
```

Conteúdo:

```yaml
decommission:
  requires:
    - zero-legacy-route
    - zero-direct-consumer
    - observation-window
    - reconciliation-pass
    - slo-pass
    - retention-pass
    - security-revocation
    - owner-approval

  rollbackWindow:
    mustBeClosed: true

  removeRouterRuleBeforeEvidence:
    forbidden: true
```

---

### 55. Entender quando remover a regra

Após a retirada do endpoint legado, a regra específica de roteamento também deve ser simplificada. O router não deve acumular centenas de branches mortos.

Strangler Fig possui dois trabalhos de limpeza:

1. remover o componente antigo;
2. remover a infraestrutura transitória que só existia para migrá-lo.

---

### 56. Criar Operating Model

Arquivo:

```text
strangler/OPERATING_MODEL.md
```

Inclua:

- route owner;
- capability owner;
- on-call;
- dashboard;
- alertas;
- alteração de policy;
- aprovação;
- rollout calendar;
- incident response;
- rollback;
- reconciliation;
- decommission review.

---

### 57. Criar riscos

Arquivo:

```text
strangler/RISKS.md
```

Riscos principais:

```text
consumer bypassa entry point;

contrato canônico incompleto;

shadow produz efeito;

normalização esconde diferença;

cohort instável;

read model atrasado;

dupla autoridade;

kill switch não funciona;

compatibility layer permanente;

legado nunca é retirado.
```

Cada risco precisa de probabilidade, impacto, mitigação, owner e indicador.

---

### 58. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  modernTimeoutDuringShadow:
    action:
      RECORD_AND_KEEP_LEGACY_RESPONSE

  modernTimeoutAsPrimary:
    action:
      APPLY_ROLLBACK_POLICY

  contractCriticalDifference:
    action:
      FREEZE_ROLLOUT

  projectionLagExceeded:
    action:
      ROUTE_LEGACY

  unknownDirectConsumer:
    action:
      BLOCK_DECOMMISSION

  commandWithoutAuthority:
    action:
      REJECT

  microserviceDecision:
    deferredToLesson652
```

---

### 59. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingCapabilityScope:
    action:
      FAIL

  routeWithoutOwner:
    action:
      FAIL

  nondeterministicCohort:
    action:
      FAIL

  shadowWithEffect:
    action:
      FAIL

  criticalDifferenceIgnored:
    action:
      FAIL

  hiddenDualWrite:
    action:
      FAIL

  decommissionWithoutEvidence:
    action:
      FAIL
```

---

### 60. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson652:
    forbidden:
      - microservice-scorecard
      - team-topology-decision
      - independent-deployability-deep-dive
      - service-per-database-rule
      - distributed-cost-assessment

  allowed:
    - capability-boundary
    - independent-adapter
    - separate-runtime-possibility
    - strangler-route
    - incremental-cutover
```

---

### 61. Validar contrato

```powershell
.\scripts\m19\service-scheduling-strangler\validate-strangler-contract.ps1
```

Valide capability, entry point, rotas, shadow, authority, rollout, rollback, observabilidade e decommission.

---

### 62. Validar capability scope

```powershell
.\scripts\m19\service-scheduling-strangler\validate-capability-scope.ps1
```

Valide inputs, outputs, consumers, dados, operações e itens fora de escopo.

---

### 63. Validar routing model

```powershell
.\scripts\m19\service-scheduling-strangler\validate-route-model.ps1
```

Valide default, stage, cohort determinístico, policy version, owner, kill switch e operações não migradas.

---

### 64. Validar compatibilidade

```powershell
.\scripts\m19\service-scheduling-strangler\validate-contract-compatibility.ps1
```

Valide campos, erros, autorização, not found, datas, nulls, diferenças intencionais e consumers.

---

### 65. Validar shadow traffic

```powershell
.\scripts\m19\service-scheduling-strangler\validate-shadow-traffic.ps1
```

Valide ausência de efeitos, retorno legado, comparação, normalização limitada e métricas.

---

### 66. Validar autoridade

```powershell
.\scripts\m19\service-scheduling-strangler\validate-single-authority.ps1
```

Valide autoridade por operação, read model derivado, ausência de dual write e guard de commands.

---

### 67. Validar rollout e rollback

```powershell
.\scripts\m19\service-scheduling-strangler\validate-rollout-policy.ps1

.\scripts\m19\service-scheduling-strangler\validate-rollback-policy.ps1
```

Valide estágios, thresholds, janela, aprovação, kill switch, freeze e evidence.

---

### 68. Validar observabilidade

```powershell
.\scripts\m19\service-scheduling-strangler\validate-strangler-observability.ps1
```

Valide route decisions, paridade, latência, erro, projection lag, cohorts e rollbacks.

---

### 69. Validar decommission

```powershell
.\scripts\m19\service-scheduling-strangler\validate-decommission-readiness.ps1
```

Valide tráfego, consumers, reconciliação, SLO, retenção, acessos, runbook e aprovação.

---

### 70. Executar testes

```powershell
.\scripts\m19\service-scheduling-strangler\run-strangler-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide routing, cohorts, contracts, shadow, authority, rollout, rollback, decommission e arquitetura.

---

### 71. Criar reports

Exemplo:

```yaml
strangler:
  capability:
    Appointment-Details

  stage:
    PROGRESSIVE_PERCENTAGE

  modernTrafficPercentage:
    25

  comparedRequests:
    128400

  equivalentRate:
    99.97

  criticalDifferences:
    0

  legacyP95Milliseconds:
    310

  modernP95Milliseconds:
    185

  modernErrorRatePercent:
    0.12

  projectionLagP95Seconds:
    3

  rollbackCount:
    0

  result:
    PASS_FOR_NEXT_STAGE
```

---

### 72. Criar Gate

O gate valida charter, capability, current flow, target flow, entry point, route model, compatibility, shadow, authority, rollout, rollback, segurança, observabilidade, decommission, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

PASS_FOR_NEXT_STAGE;

FAIL_CAPABILITY_SCOPE;

FAIL_ENTRY_BOUNDARY;

FAIL_ROUTE_MODEL;

FAIL_CONTRACT_COMPATIBILITY;

FAIL_SHADOW_SAFETY;

FAIL_AUTHORITY;

FAIL_ROLLOUT;

FAIL_ROLLBACK;

FAIL_SECURITY;

FAIL_OBSERVABILITY;

FAIL_DECOMMISSION_READINESS;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 73. Coletar Evidence

Arquivo:

```text
contracts/strangler-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- capability;
- stage;
- policy version;
- legacy traffic percentage;
- modern traffic percentage;
- shadow comparison count;
- equivalent rate;
- critical difference count;
- legacy latency;
- modern latency;
- legacy error rate;
- modern error rate;
- projection lag;
- rollback count;
- direct legacy consumer count;
- decommission readiness;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua payloads pessoais, tokens, endpoints privados, credenciais, topologia real ou decisão completa de microserviços.

---

### 74. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-strangler\validate-strangler-contract.ps1

.\scripts\m19\service-scheduling-strangler\validate-capability-scope.ps1

.\scripts\m19\service-scheduling-strangler\validate-route-model.ps1

.\scripts\m19\service-scheduling-strangler\validate-contract-compatibility.ps1

.\scripts\m19\service-scheduling-strangler\validate-shadow-traffic.ps1

.\scripts\m19\service-scheduling-strangler\validate-single-authority.ps1

.\scripts\m19\service-scheduling-strangler\validate-rollout-policy.ps1

.\scripts\m19\service-scheduling-strangler\validate-rollback-policy.ps1

.\scripts\m19\service-scheduling-strangler\validate-strangler-observability.ps1

.\scripts\m19\service-scheduling-strangler\validate-decommission-readiness.ps1

.\scripts\m19\service-scheduling-strangler\run-strangler-tests.ps1

.\scripts\m19\service-scheduling-strangler\collect-strangler-evidence.ps1

.\scripts\m19\service-scheduling-strangler\verify-strangler-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 75. Encerrar o laboratório

Confirme:

- capacidade de migração explícita;
- entrada única;
- rotas versionadas;
- default legado;
- cohorts determinísticos;
- contrato canônico;
- anti-corruption layer;
- shadow sem efeitos;
- comparação e classificação;
- zero divergência crítica;
- autoridade única de commands;
- rollout por estágios;
- kill switch testado;
- rollback observável;
- segurança preservada;
- consumers diretos inventariados;
- decommission com evidência;
- infraestrutura transitória com plano de remoção;
- Microserviços com critério não antecipado.

---

## Entendendo o que foi feito

### A modernização ganhou uma fronteira de substituição

A `Scheduling Entry Point` concentra o tráfego e o `Strangler Router` transforma cada request em uma decisão observável. O legado deixou de ser acessado como destino inevitável e passou a ser um caminho controlado por policy.

### A extração ganhou uma unidade clara

`Appointment Details` foi definida por inputs, outputs, consumers, dados e itens fora de escopo. Isso impede a expansão silenciosa da iniciativa e permite medir quando a capacidade realmente foi substituída.

### A compatibilidade ganhou contrato e comparação

Legacy adapter e modern adapter retornam um contrato canônico. Shadow traffic executa a nova consulta sem afetar o consumidor, e o comparator separa diferenças benignas, intencionais e críticas.

### A coexistência ganhou autoridade explícita

O legado continua autoridade de commands. O read model moderno é derivado. O `WriteMigrationGuard` impede que a nova implementação receba operações para as quais ainda não possui autoridade.

### O rollout ganhou etapas e reversibilidade

Shadow, canário, cohorts e percentuais possuem thresholds, janelas, owners e critérios. O kill switch foi testado. Rollback preserva evidence e retorna a rota ao legado sem esconder o incidente.

### A retirada ganhou prova

A migração não termina em 100% de tráfego moderno. Ela termina quando consumers diretos, jobs, acessos, dados e infraestrutura transitória são tratados e o caminho antigo pode ser removido com segurança.

---

## Erros comuns importantes

### Colocar um proxy e chamar isso de Strangler Fig

Sem unidade de migração, contrato, authority, rollout, métricas e decommission, existe apenas uma camada adicional de rede.

### Migrar por classes em vez de capacidade

Classes isoladas não representam valor, consumidores, dados ou responsabilidade completa. O legado continua necessário para completar o fluxo.

### Executar shadow em commands

Mesmo que a resposta seja descartada, efeitos externos podem ocorrer duas vezes. Shadow seguro é leitura sem efeito.

### Comparar payload bruto

Timestamps, ordem e campos voláteis geram falsos positivos. Normalização é necessária, mas não pode esconder diferenças relevantes.

### Usar porcentagem aleatória por request

O mesmo usuário alterna entre implementações e produz resultados inconsistentes. Cohorts precisam ser determinísticos.

### Criar dual write para “manter tudo sincronizado”

Falhas parciais criam dupla autoridade e divergência. Prefira autoridade única, outbox, projeção e reconciliação.

### Deixar consumers acessarem o legado diretamente

O router mede apenas o tráfego que atravessa a fronteira. Bypasses escondidos impedem a retirada.

### Manter fallback para sempre

Fallback eterno mantém custo, coupling e risco. Ele precisa de janela, owner e critério de encerramento.

### Declarar conclusão em 100% de tráfego moderno

Jobs, dados, credenciais, consumers e runbooks podem continuar presos ao legado.

### Assumir que a capacidade nova deve ser microserviço

A fronteira pode permanecer em um monólito modular ou outro formato. A decisão completa fica para a aula 652.

---

## Comandos úteis

### Validar rotas

```powershell
.\scripts\m19\service-scheduling-strangler\validate-route-model.ps1
```

### Validar shadow

```powershell
.\scripts\m19\service-scheduling-strangler\validate-shadow-traffic.ps1
```

### Validar autoridade

```powershell
.\scripts\m19\service-scheduling-strangler\validate-single-authority.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-strangler\run-strangler-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-strangler\verify-strangler-gate.ps1
```

---

## Exercício guiado

Escolha uma segunda capacidade de leitura, como `Appointment Search`, e repita o processo:

1. defina escopo e consumers;
2. capture o contrato atual;
3. crie adapter legado e moderno;
4. execute shadow traffic;
5. normalize e classifique diferenças;
6. defina thresholds;
7. habilite canário e cohort;
8. teste kill switch;
9. avance por percentuais;
10. prove decommission readiness.

Não migre commands no exercício. Registre o que precisaria mudar em authority, dados, efeitos externos e rollback para que uma operação de escrita pudesse ser extraída com segurança.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade oficial;
- laboratório, charter, capability scope, fluxo atual e fluxo alvo foram criados;
- `Appointment Details` possui contrato, consumers e limites explícitos;
- entry point, router, registry, policies e cohorts determinísticos funcionam;
- default legado e kill switch foram testados;
- adapters, anti-corruption layer e contrato canônico foram implementados;
- compatibilidade de campos, erros, autorização, ausência e datas foi validada;
- shadow retorna a resposta legada e não produz efeitos;
- normalização não esconde diferenças críticas;
- dados e commands possuem authority explícita;
- read model moderno é derivado e dual write oculto foi proibido;
- `WriteMigrationGuard` bloqueia commands sem autoridade;
- canário, cohorts e percentuais possuem critérios de avanço e rollback;
- rotas, paridade, latência, erros, lag e rollbacks são observáveis;
- segurança e tenant foram preservados;
- testes cobrem rota, shadow, contrato, cohort, authority e rollback;
- decommission exige zero tráfego, zero consumer direto e reconciliação;
- infraestrutura transitória possui plano de remoção;
- reports, evidence, gate, commit e diário estão presentes;
- Microserviços com critério não foi antecipado.

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
  labs/m19/aula-651-strangler-fig/service-scheduling-strangler `
  scripts/m19/service-scheduling-strangler `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|realCustomer|productionRoute|personalPayload|microserviceScorecard"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): aplicar Strangler Fig"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- payloads pessoais;
- endpoints privados;
- rotas reais de produção;
- dados de clientes;
- decisão completa de microserviços.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou Strangler Fig ao contexto `Service Scheduling`.

Você criou uma entrada única, router, policies versionadas, cohorts determinísticos, adapters legado e moderno, anti-corruption layer, contrato canônico, shadow traffic, comparação de respostas, authority explícita, rollout progressivo, kill switch, rollback, observabilidade, critérios de decommission, reports, evidence e gate.

Você comprovou que o padrão substitui capacidades, não apenas endpoints; que shadow seguro não produz efeitos; que contrato e autorização precisam de paridade; que commands mantêm uma autoridade única; que rollout exige thresholds e reversibilidade; e que a migração só termina quando tráfego, consumers, jobs, dados, acessos e infraestrutura transitória permitem retirar o caminho antigo.

A próxima aula será:

```text
652 - M19.42 - Microservicos com criterio
```

Nela, você avaliará quando uma fronteira merece autonomia de deploy, dados, operação e equipe, quando um monólito modular é melhor e quais custos distribuídos precisam ser pagos. Anti-patterns de microserviços permanecem para a aula 653.

Nenhuma decisão completa de microserviços foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini a capacidade inicial.
- [ ] Criei uma entrada única.
- [ ] Criei o router.
- [ ] Mantive default legado.
- [ ] Criei contrato canônico.
- [ ] Implementei shadow seguro.
- [ ] Comparei respostas.
- [ ] Mantive autoridade única.
- [ ] Criei rollout progressivo.
- [ ] Testei kill switch.
- [ ] Defini rollback.
- [ ] Defini decommission.
- [ ] Gere reports, evidence e gate.

## Troubleshooting adicional

### O novo caminho recebe pouco tráfego para validar

Aumente shadow coverage, duração e diversidade antes de promover. Não reduza critérios por pressa.

### A comparação possui muitas diferenças benignas

Revise normalização e contrato canônico. Não classifique automaticamente tudo como benigno.

### A nova consulta está mais rápida, mas retorna dados antigos

Inclua freshness e projection lag no gate. Latência menor não compensa staleness fora do budget.

### O kill switch demora para propagar

A configuração distribuída não atende ao RTO de rollback. Revise cache, refresh, consistência e canal de emergência.

### Um cliente alterna entre respostas antigas e novas

Verifique se o cohort é determinístico e se a chave é estável durante a jornada.

### A equipe quer fazer dual write

Defina authority, outbox, projection e reconciliation. Trate dual write como risco explícito, não como solução padrão.

### Existem chamadas diretas ao legado

Instrumente endpoints, credenciais, logs, rede e consumers. Decommission fica bloqueado.

### A camada de tradução ficou enorme

Revise o recorte da capacidade e o contrato canônico. Uma ACL crescente pode indicar fronteira ruim ou legado excessivamente exposto.

### O fallback nunca é desligado

Defina observation window, owner, métricas e data de encerramento.

### A discussão virou “quantos microserviços criar”

Preserve a decisão completa para a aula 652.

## Perguntas de revisão

1. O que é Strangler Fig?
2. Qual é a unidade ideal de substituição?
3. Por que a entrada comum é necessária?
4. O que o router decide?
5. O que é contrato canônico?
6. O que é shadow traffic?
7. Por que shadow de command é perigoso?
8. Por que cohorts devem ser determinísticos?
9. O que significa autoridade única?
10. Por que dual write é arriscado?
11. Qual papel do kill switch?
12. Quando fazer rollback?
13. O que bloqueia decommission?
14. Strangler Fig exige microserviço?
15. Qual é a próxima aula?

## Roteiro de resposta

1. Substituição incremental de capacidades legadas atrás de uma fronteira.
2. Uma capacidade de negócio ou fluxo completo.
3. Para controlar e medir o deslocamento de tráfego.
4. Qual caminho executará a operação.
5. Contrato estável entre a fronteira e os consumers.
6. Execução paralela de leitura sem influenciar a resposta primária.
7. Porque pode duplicar efeitos externos.
8. Para manter experiência e diagnóstico estáveis.
9. Uma implementação decide e grava cada operação.
10. Falhas parciais criam divergência.
11. Retornar rapidamente ao caminho seguro.
12. Quando contrato, segurança ou SLO falham.
13. Tráfego, consumers, dados, jobs, acessos ou evidence pendentes.
14. Não.
15. Microserviços com critério.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 651 - M19.41 - Strangler Fig**

- Criei o laboratório `service-scheduling-strangler`.
- Escolhi `Appointment Details` como capacidade inicial.
- Mapeei fluxo atual, fluxo alvo, consumers e contratos.
- Criei `Scheduling Entry Point`, `Strangler Router` e policies versionadas.
- Mantive default legado e cohorts determinísticos.
- Criei adapters legado e moderno, anti-corruption layer e contrato canônico.
- Implementei shadow traffic sem efeitos externos.
- Normalizei respostas e classifiquei diferenças críticas.
- Defini authority de dados e commands.
- Mantive o legado como command authority e proibi dual write oculto.
- Criei `WriteMigrationGuard`.
- Modelei canário, cohorts e rollout progressivo.
- Criei e testei kill switch e rollback.
- Observei rotas, paridade, latência, erros e projection lag.
- Preservei autenticação, autorização e tenant.
- Defini critérios de decommission e remoção da infraestrutura transitória.
- Criei reports, evidence e gate.
- Não antecipei Microserviços com critério.
- Próxima aula: Microserviços com critério.
```

## Referência técnica curta

- Strangler Fig Pattern.
- Incremental Replacement.
- Entry Point.
- Routing Policy.
- Anti-Corruption Layer.
- Canonical Contract.
- Shadow Traffic.
- Deterministic Cohort.
- Progressive Rollout.
- Kill Switch.
- Single Write Authority.
- Decommission.

Regra final:

```text
Strangler Fig substitui capacidades por evidência e estágios.
Service Scheduling cria uma entrada única, mantém o legado como default
e extrai Appointment Details com adapters e contrato canônico.
Shadow executa somente leituras sem efeito e classifica diferenças críticas.
Cohorts determinísticos e rollout progressivo usam thresholds, owner e rollback.
Commands mantêm autoridade única; dual write oculto é proibido.
A conclusão exige zero tráfego e consumer direto, dados reconciliados,
SLO saudável, acessos revogados e remoção da infraestrutura transitória.
A decisão sobre microserviços fica para a aula 652.
```
