# 607 - M18.52 - Refatoracao final producao

## Apresentação da aula

Na aula 606, você executou a prova prática de produção.

A avaliação exigiu que você:

```text
validasse a baseline;

declarasse o incidente;

classificasse severidade;

organizasse papéis;

registrasse timeline;

indexasse evidências;

formulasse hipóteses;

correlacionasse sinais;

diagnosticasse;

mitigasse;

corrigisse;

comparasse before/after;

validasse recovery;

encerrasse o incidente.
```

Ao final da prova, você também criou:

```text
refactoring-backlog.md
```

Esse backlog existe porque uma prova prática quase sempre revela fragilidades que não são apenas bugs do cenário.

Ela pode mostrar:

- duplicação;
- responsabilidades misturadas;
- contratos implícitos;
- métricas dispersas;
- logs inconsistentes;
- propagação de contexto frágil;
- health checks acoplados;
- scripts repetidos;
- políticas conflitantes;
- testes difíceis de manter;
- configuração sem tipagem;
- nomes pouco claros;
- tratamento de erro duplicado;
- shutdown incompleto;
- regras operacionais espalhadas;
- runbooks sem owner;
- evidências difíceis de reproduzir.

A aula 607 existe para transformar essas fragilidades em uma refatoração final, controlada e verificável.

Refatorar não significa:

```text
reescrever tudo;

trocar framework;

mudar arquitetura inteira;

atualizar todas as dependências;

criar novas funcionalidades;

reabrir decisões já aprovadas.
```

Refatorar significa melhorar a estrutura interna preservando comportamento externo e contratos operacionais.

A pergunta central será:

```text
como melhorar
clareza,
coesão,
testabilidade
e operação

sem alterar
indevidamente
a API,
os SLOs,
os sinais
ou o comportamento
já aprovado?
```

Esta aula trabalhará com quatro fontes:

1. backlog gerado na prova;
2. relatórios das partes 1, 2 e 3;
3. relatórios das revisões 604 e 605;
4. resultado do gate da aula 606.

A refatoração deverá obedecer a um processo:

```text
inventariar;

priorizar;

agrupar;

definir contratos;

aplicar mudanças pequenas;

executar testes;

comparar sinais;

aprovar ou reverter.
```

Você não irá implementar itens apenas porque parecem elegantes.

Cada item precisa demonstrar:

- problema real;
- impacto;
- escopo;
- risco;
- owner;
- estratégia;
- critério de aceite;
- rollback;
- evidência após a mudança.

A próxima aula oficial será:

```text
608 - M18.53 - Aula ensinavel producao
```

Na aula 608, você irá transformar o conteúdo consolidado em uma aula que outra pessoa consegue acompanhar e reproduzir.

Por isso, esta aula não irá:

- montar roteiro de apresentação;
- criar slides;
- ensinar o módulo para terceiros;
- escrever roteiro oral;
- produzir exercício pedagógico para outra turma;
- organizar a aula ensinável;
- antecipar o checklist SRE da aula 609.

A regra central será:

```text
refatoração final
não é recomeço;

é melhoria controlada
sobre uma baseline
já aprovada.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
605:
Revisao producao parte 2.

606:
Prova pratica producao.

607:
Refatoracao final producao.

608:
Aula ensinavel producao.

609:
Checklist SRE para Backend Java.
```

A progressão é:

```text
revisar;

avaliar;

refatorar;

ensinar;

operacionalizar em checklist.
```

Nesta aula:

```text
backlog da prova:
sim.

priorização:
sim.

refatoração:
sim.

contratos:
sim.

testes:
sim.

regressão:
sim.

rollback:
sim.

documentação:
sim.

nova feature:
não.

mudança de SLO:
não,
salvo correção explícita.

troca de arquitetura:
não.

aula ensinável:
não.

checklist SRE:
não.
```

O projeto continua em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

A aplicação precisa permanecer:

- funcional;
- observável;
- diagnosticável;
- segura;
- testável;
- reproduzível;
- encerrável;
- compatível com os contratos existentes.

---

## Objetivo prático

Será criada a área de refatoração final:

```text
refactoring/production-final
├── production-final-refactoring-contract.yaml
├── production-final-backlog-policy.yaml
├── production-final-priority-policy.yaml
├── production-final-boundary-policy.yaml
├── production-final-observability-policy.yaml
├── production-final-testing-policy.yaml
├── production-final-migration-policy.yaml
├── production-final-rollback-policy.yaml
├── production-final-security-policy.yaml
├── production-final-data-quality-policy.yaml
├── production-final-failure-policy.yaml
├── production-final-scenarios.yaml
└── production-final-evidence.yaml

refactoring/production-final/backlog
├── normalized-backlog.md
├── accepted-items.md
├── rejected-items.md
├── deferred-items.md
└── decision-log.md

refactoring/production-final/reports
├── architecture-refactoring-report.yaml
├── observability-refactoring-report.yaml
├── error-handling-refactoring-report.yaml
├── configuration-refactoring-report.yaml
├── testing-refactoring-report.yaml
├── scripts-refactoring-report.yaml
├── documentation-refactoring-report.yaml
└── production-final-refactoring-gate-report.yaml

scripts/refactoring/production-final
├── validate-production-final-refactoring-contract.ps1
├── normalize-production-refactoring-backlog.ps1
├── validate-production-refactoring-priorities.ps1
├── validate-production-boundaries.ps1
├── validate-observability-preservation.ps1
├── validate-error-contracts.ps1
├── validate-configuration-refactoring.ps1
├── validate-script-deduplication.ps1
├── validate-test-architecture.ps1
├── validate-production-refactoring-regression.ps1
├── validate-production-refactoring-rollback.ps1
├── collect-production-final-refactoring-evidence.ps1
└── verify-production-final-refactoring.ps1
```

A aplicação também será reorganizada em pontos específicos:

```text
src/main/java/br/com/formacao/observableorders
├── api
├── application
├── domain
├── infrastructure
├── observability
├── operations
└── shared
```

O objetivo não é criar uma arquitetura acadêmica excessiva.

O objetivo é:

- remover duplicação;
- tornar dependências explícitas;
- padronizar contratos;
- concentrar políticas;
- facilitar testes;
- reduzir risco operacional;
- manter sinais confiáveis.

---

## Conceito essencial

### Refatoração

Mudança interna que melhora estrutura sem alterar comportamento observável esperado.

---

### Comportamento externo

Contrato percebido por consumidores, operadores e integrações.

Inclui:

- HTTP;
- payload;
- erros;
- métricas;
- logs;
- traces;
- health;
- readiness;
- alertas;
- shutdown.

---

### Coesão

Grau em que uma unidade possui responsabilidades relacionadas.

---

### Acoplamento

Dependência entre componentes.

---

### Boundary

Limite explícito entre responsabilidades ou camadas.

---

### Abstração prematura

Generalização criada antes de existirem casos reais suficientes.

---

### Duplicação semântica

Mesma regra representada de formas diferentes em vários lugares.

---

### Contract test

Teste que valida um comportamento público ou operacional estável.

---

### Characterization test

Teste criado para registrar o comportamento atual antes da refatoração.

---

### Refactoring slice

Mudança pequena, isolada e validável.

---

### Technical debt

Custo futuro criado por decisões que aumentam dificuldade de manutenção ou operação.

---

### Deferred item

Item válido que não deve ser executado no escopo atual.

---

## Mão na massa guiada

### 1. Validar a baseline final

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part3-baseline.ps1

.\scripts\assessments\production-practical-exam\verify-production-practical-exam.ps1

git status

git diff --check
```

Confirme:

- prova concluída;
- relatórios disponíveis;
- backlog existente;
- baseline aprovada;
- zero task leaks;
- zero connection leaks;
- nenhum modo lab ativo;
- raw artifacts fora do Git.

---

### 2. Criar contrato de refatoração

Arquivo:

```text
production-final-refactoring-contract.yaml
```

Conteúdo:

```yaml
productionFinalRefactoring:
  required:
    - backlog
    - prioritization
    - boundaries
    - characterization-tests
    - refactoring-slices
    - observability-preservation
    - regression
    - rollback
    - evidence

  newFeature:
    forbidden

  publicContractChange:
    requires:
      explicitMigration

  operationalSignalRemoval:
    forbidden

  nextLesson:
    code:
      M18.53
```

---

### 3. Normalizar o backlog

Execute:

```powershell
.\scripts\refactoring\production-final\normalize-production-refactoring-backlog.ps1
```

Cada item deve possuir:

```markdown
## RF-001

- Problema:
- Evidência:
- Impacto:
- Categoria:
- Escopo:
- Risco:
- Prioridade:
- Owner:
- Critério de aceite:
- Rollback:
- Estado:
```

Estados:

```text
ACEITO;

REJEITADO;

ADIADO;

CONCLUÍDO.
```

---

### 4. Criar policy de backlog

Arquivo:

```text
production-final-backlog-policy.yaml
```

Conteúdo:

```yaml
backlog:
  item:
    required:
      - problem
      - evidence
      - impact
      - category
      - risk
      - priority
      - acceptance
      - rollback

  duplicate:
    merge:
      required

  vagueItem:
    reject:
      true

  newFeatureDisguisedAsRefactoring:
    reject:
      true
```

---

### 5. Classificar itens

Categorias:

```text
architecture;

observability;

error-handling;

configuration;

testing;

scripts;

documentation;

security;

shutdown;

data-quality.
```

Exemplo de item válido:

```text
três componentes
registram operation/outcome
com convenções diferentes.
```

Exemplo de item vago:

```text
melhorar observabilidade.
```

---

### 6. Priorizar

Use:

- impacto;
- risco;
- frequência;
- custo de manutenção;
- influência no incidente;
- facilidade de validação;
- dependências;
- reversibilidade.

Matriz:

```text
alto impacto + baixo risco:
executar primeiro.

alto impacto + alto risco:
planejar slice e rollback.

baixo impacto + baixo risco:
executar se reduzir duplicação real.

baixo impacto + alto risco:
adiar ou rejeitar.
```

---

### 7. Criar priority policy

Arquivo:

```text
production-final-priority-policy.yaml
```

Conteúdo:

```yaml
priority:
  factors:
    - incident-impact
    - recurrence-risk
    - maintenance-cost
    - testability
    - reversibility
    - dependency-count

  cosmeticOnly:
    default:
      defer

  security:
    minimum:
      high

  contractBreak:
    requiresMigration:
      true
```

---

### 8. Criar characterization tests

Antes da mudança, registre comportamento atual.

Cobertura:

- endpoints;
- status HTTP;
- payload;
- error codes;
- logs principais;
- métricas;
- spans;
- health groups;
- SLI eligibility;
- shutdown.

Exemplo:

```java
@Test
void shouldPreserveDomainErrorContract() {

    mockMvc.perform(
                    post("/api/orders/{id}/confirm",
                            cancelledOrderId))
            .andExpect(
                    status()
                            .isUnprocessableEntity())
            .andExpect(
                    jsonPath("$.code")
                            .value(
                                    "DOMAIN_RULE_VIOLATION"));
}
```

---

### 9. Criar testing policy

Arquivo:

```text
production-final-testing-policy.yaml
```

Conteúdo:

```yaml
testing:
  beforeRefactoring:
    characterization:
      required

  contract:
    preserve:
      required

  unit:
    focused:
      required

  integration:
    criticalFlow:
      required

  observability:
    contractTests:
      required

  flakyTest:
    quarantineWithoutOwner:
      forbidden
```

---

### 10. Refatorar nomes de observação

Problema:

```text
nomes de métricas,
logs
e spans
definidos em vários lugares.
```

Crie contratos centrais:

```java
public final class OperationalNames {

    public static final String ORDER_CREATE =
            "order.create";

    public static final String ORDER_CONFIRM =
            "order.confirm";

    public static final String ORDER_CANCEL =
            "order.cancel";

    public static final String REPOSITORY_SAVE =
            "order.repository.save";

    public static final String EVENT_PUBLISH =
            "order.event.publish";

    private OperationalNames() {
    }
}
```

Não transforme tudo em string genérica sem semântica.

---

### 11. Refatorar outcomes

Crie enum bounded:

```java
public enum OperationalOutcome {
    SUCCESS,
    FAILURE,
    REJECTED,
    TIMEOUT,
    CANCELLED
}
```

Mapeie para labels estáveis:

```java
public String tagValue() {
    return name()
            .toLowerCase(
                    Locale.ROOT);
}
```

Evite outcomes livres.

---

### 12. Criar boundary policy

Arquivo:

```text
production-final-boundary-policy.yaml
```

Conteúdo:

```yaml
boundaries:
  API:
    dependsOn:
      - application

  application:
    dependsOn:
      - domain
      - ports

  domain:
    dependsOnFramework:
      forbidden

  infrastructure:
    implementsPorts:
      required

  observability:
    crossCutting:
      explicit:
        required

  operations:
    businessRuleOwnership:
      forbidden
```

---

### 13. Revisar dependências

Verifique:

- controller acessando repository diretamente;
- domain importando Spring;
- observability contendo regra de negócio;
- operations alterando entidade;
- infrastructure retornando exception bruta;
- API conhecendo Hikari;
- health check executando fluxo funcional pesado.

Corrija apenas ocorrências reais.

---

### 14. Extrair ports necessários

Exemplo:

```java
public interface OrderRepository {

    Order save(
            Order order);

    Optional<Order> findById(
            OrderId id);

    Page<OrderSummary> find(
            OrderFilter filter,
            PageRequest pageRequest);
}
```

Não crie interface para cada classe sem necessidade.

---

### 15. Refatorar erro de aplicação

Crie categorias estáveis:

```java
public enum ApplicationErrorCode {
    ORDER_NOT_FOUND,
    DOMAIN_RULE_VIOLATION,
    CAPACITY_REJECTED,
    DEPENDENCY_UNAVAILABLE,
    INTERNAL_ERROR
}
```

Mapeie para HTTP em um único lugar.

---

### 16. Criar error mapper

```java
@Component
public final class ApiErrorMapper {

    public ApiError map(
            ApplicationException exception,
            String path) {

        return new ApiError(
                exception.code().name(),
                exception.publicMessage(),
                path,
                RequestContext.currentRequestId(),
                Instant.now());
    }
}
```

A mensagem pública não deve usar exception bruta.

---

### 17. Validar contratos de erro

Execute:

```powershell
.\scripts\refactoring\production-final\validate-error-contracts.ps1
```

Confirme:

- status;
- code;
- message;
- path;
- request ID;
- timestamp;
- ausência de stack;
- ausência de SQL;
- ausência de payload.

---

### 18. Refatorar métricas repetidas

Crie uma fachada restrita:

```java
@Component
public final class OperationalMetrics {

    private final MeterRegistry registry;

    public Timer.Sample start() {
        return Timer.start(registry);
    }

    public void stop(
            Timer.Sample sample,
            String metric,
            String operation,
            OperationalOutcome outcome) {

        sample.stop(
                Timer.builder(metric)
                        .tag(
                                "operation",
                                operation)
                        .tag(
                                "outcome",
                                outcome.tagValue())
                        .register(registry));
    }
}
```

Não esconda demais o Micrometer.

A fachada existe para garantir convenções.

---

### 19. Refatorar observability decorators

Use decorators claros:

```text
ObservedOrderRepository;

ObservedOrderEventPublisher.
```

Cada decorator:

- mede;
- cria span;
- registra outcome;
- delega;
- preserva exception;
- não altera regra.

Isso reduz instrumentação espalhada.

---

### 20. Criar observability policy

Arquivo:

```text
production-final-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  preserve:
    - metric-names
    - allowed-labels
    - span-names
    - log-events
    - health-semantics
    - SLI-eligibility

  decorator:
    businessBehaviorChange:
      forbidden

  context:
    cleanup:
      required

  error:
    category:
      bounded

  signalRemoval:
    requiresOperationalReview:
      true
```

---

### 21. Validar preservação

Execute:

```powershell
.\scripts\refactoring\production-final\validate-observability-preservation.ps1
```

Compare antes e depois:

- métricas;
- labels;
- spans;
- parent-child;
- logs;
- levels;
- health;
- readiness;
- SLI;
- alert rules;
- dashboards.

---

### 22. Refatorar configuração

Problema comum:

```text
thresholds espalhados
em código,
YAML
e scripts.
```

Crie properties tipadas:

```java
@ConfigurationProperties(
        prefix = "observable-orders.capacity")
public record CapacityProperties(
        int eventQueueSize,
        int readinessPendingThreshold,
        int concurrencyLimit,
        Duration publishTimeout) {
}
```

---

### 23. Validar configuração

Regras:

- valores positivos;
- threshold menor ou igual à capacidade;
- timeout coerente;
- defaults seguros;
- profile lab separado;
- secrets fora do YAML;
- units explícitas.

Exemplo:

```java
public CapacityProperties {
    if (eventQueueSize <= 0) {
        throw new IllegalArgumentException(
                "eventQueueSize must be positive");
    }

    if (readinessPendingThreshold
            > eventQueueSize) {
        throw new IllegalArgumentException(
                "threshold exceeds capacity");
    }
}
```

---

### 24. Criar migration policy

Arquivo:

```text
production-final-migration-policy.yaml
```

Conteúdo:

```yaml
migration:
  configurationKey:
    rename:
      backwardCompatibility:
        required

  publicEndpoint:
    change:
      versioning:
        required

  metricName:
    change:
      dashboardMigration:
        required

  database:
    schemaChange:
      outOfScopeUnlessRequired:
        true

  deprecation:
    documented:
      required
```

---

### 25. Evitar quebrar dashboards

Renomear métrica parece simples, mas quebra:

- PromQL;
- alertas;
- dashboards;
- SLI;
- runbook.

Se a mudança for necessária:

1. publicar nova métrica;
2. manter antiga temporariamente;
3. migrar queries;
4. validar dashboards;
5. remover antiga em mudança futura planejada.

Nesta aula, prefira preservar nomes.

---

### 26. Refatorar request context

Problemas possíveis:

- acesso estático excessivo;
- cleanup duplicado;
- fallback inconsistente;
- header validation espalhada.

Crie um componente explícito:

```java
public interface CurrentRequestContext {

    String requestId();

    String correlationId();

    Optional<String> traceId();
}
```

Mantenha integração com MDC no boundary HTTP.

---

### 27. Refatorar sanitização

Centralize:

- header;
- log value;
- public error;
- evidence field.

Mas não crie um sanitizador mágico que tente corrigir qualquer payload.

A principal proteção continua sendo:

```text
não coletar
o que não é necessário.
```

---

### 28. Refatorar health indicators

Cada indicator deve responder uma pergunta simples.

Exemplo de banco:

```text
a dependência essencial
está disponível
para aceitar tráfego?
```

Evite health que:

- executa query pesada;
- carrega entidade;
- testa regra de negócio;
- dispara mensagem;
- altera estado.

---

### 29. Refatorar readiness composto

Crie componentes pequenos:

```text
DatabaseReadinessProbe;

EventCapacityReadinessProbe;

MigrationReadinessProbe.
```

Agregue status sem misturar detalhes sensíveis.

---

### 30. Refatorar shutdown

Crie uma sequência explícita:

```text
marcar draining;

readiness DOWN;

parar novas entradas;

aguardar in-flight bounded;

parar publisher;

drenar ou persistir fila;

encerrar executor;

fechar datasource;

limpar contextos;

registrar conclusão.
```

---

### 31. Criar shutdown coordinator

```java
@Component
public final class ShutdownCoordinator {

    private final AtomicBoolean draining =
            new AtomicBoolean();

    public void begin() {
        draining.set(true);
    }

    public boolean isDraining() {
        return draining.get();
    }
}
```

Use em readiness e encerramento.

---

### 32. Refatorar scripts duplicados

Problema:

```text
vários scripts
repetem start,
wait,
validate,
cleanup.
```

Crie funções reutilizáveis em:

```text
scripts/common
├── process-functions.ps1
├── HTTP-functions.ps1
├── docker-functions.ps1
├── evidence-functions.ps1
└── validation-functions.ps1
```

Evite abstração excessiva.

Extraia apenas repetições estáveis.

---

### 33. Validar deduplicação

Execute:

```powershell
.\scripts\refactoring\production-final\validate-script-deduplication.ps1
```

Confirme:

- scripts continuam legíveis;
- erros preservam contexto;
- cleanup é idempotente;
- paths são resolvidos corretamente;
- funções possuem nomes claros;
- nenhuma credencial é impressa.

---

### 34. Refatorar testes

Organize:

```text
unit;

application;

contract;

integration;

observability;

shutdown;

performance-regression.
```

Evite testes gigantes que validam tudo em um único método.

---

### 35. Criar test fixtures

Use builders sintéticos:

```java
public final class OrderTestData {

    public static CreateOrderRequest
    validCreateRequest() {

        return new CreateOrderRequest(
                "synthetic-customer",
                List.of(
                        new CreateOrderItemRequest(
                                "synthetic-product",
                                1,
                                new BigDecimal("10.00"))));
    }
}
```

Não replique payload em dezenas de testes.

---

### 36. Refatorar clocks e IDs

Use:

- `Clock` injetável;
- gerador de ID;
- factories;
- fixtures determinísticas.

Isso reduz:

- sleeps;
- timestamps instáveis;
- UUIDs imprevisíveis;
- asserts frágeis.

---

### 37. Remover sleeps de testes

Substitua quando possível por:

- latch;
- awaitility;
- fake clock;
- barrier;
- condição explícita;
- polling bounded.

`Thread.sleep` pode permanecer apenas quando o fenômeno temporal é o objeto real do teste e existe margem controlada.

---

### 38. Validar arquitetura de testes

Execute:

```powershell
.\scripts\refactoring\production-final\validate-test-architecture.ps1
```

Confirme:

- unit tests rápidos;
- integration tests isolados;
- contratos estáveis;
- observability testável;
- fixtures sintéticas;
- zero testes flaky conhecidos;
- zero threads residuais.

---

### 39. Revisar documentação

Atualize:

- overview;
- arquitetura;
- operações;
- runbooks;
- configuração;
- troubleshooting;
- scripts;
- desenvolvimento local;
- shutdown;
- limites conhecidos.

Remova documentação que descreve código antigo.

---

### 40. Criar decision log

Arquivo:

```text
backlog/decision-log.md
```

Cada decisão:

```markdown
## D-001

- Item:
- Decisão:
- Motivo:
- Evidência:
- Alternativas:
- Risco:
- Rollback:
- Resultado:
```

Isso evita reabrir discussão sem contexto.

---

### 41. Rejeitar abstrações prematuras

Exemplos a rejeitar:

- framework interno de métricas;
- DSL própria de tracing;
- hierarchy extensa de exceptions sem necessidade;
- generic repository universal;
- engine de health customizada;
- wrapper para toda biblioteca;
- arquitetura de plugins sem casos reais.

A refatoração deve reduzir custo, não criar plataforma paralela.

---

### 42. Criar rollback policy

Arquivo:

```text
production-final-rollback-policy.yaml
```

Conteúdo:

```yaml
rollback:
  requiredFor:
    - contract-change
    - configuration-change
    - shutdown-change
    - observability-change
    - script-change

  trigger:
    include:
      - functional-regression
      - SLO-regression
      - signal-loss
      - startup-failure
      - shutdown-leak
      - compatibility-failure

  test:
    required
```

---

### 43. Criar slices

Exemplo de ordem:

```text
slice 1:
characterization tests.

slice 2:
operational names e outcomes.

slice 3:
error mapping.

slice 4:
observability decorators.

slice 5:
typed configuration.

slice 6:
readiness e shutdown.

slice 7:
script helpers.

slice 8:
test fixtures.

slice 9:
documentation.
```

Um slice por commit pode facilitar rollback.

---

### 44. Validar boundaries

Execute:

```powershell
.\scripts\refactoring\production-final\validate-production-boundaries.ps1
```

Valide imports proibidos e dependências indevidas.

Pode usar:

- ArchUnit;
- testes de package;
- inspeção estática;
- regras Maven.

---

### 45. Criar cenário de regressão funcional

Fluxos:

```text
criar pedido;

consultar;

listar;

confirmar;

cancelar;

erro de validação;

not found;

regra de domínio;

fila cheia;

banco indisponível.
```

Todos precisam manter contrato.

---

### 46. Criar cenário de regressão operacional

Valide:

- request ID;
- correlation ID;
- trace ID;
- logs;
- métricas;
- spans;
- health;
- readiness;
- liveness;
- SLI;
- alertas;
- dashboards;
- shutdown.

---

### 47. Criar performance smoke test

A refatoração não precisa melhorar performance.

Ela não deve causar regressão relevante.

Compare:

- throughput;
- p95;
- p99;
- CPU/operação;
- allocation/operação;
- repository p95;
- startup;
- shutdown.

---

### 48. Criar security policy

Arquivo:

```text
production-final-security-policy.yaml
```

Conteúdo:

```yaml
security:
  refactoring:
    mustNotExpose:
      - secret
      - payload
      - customer-reference
      - order-id
      - raw-SQL
      - raw-stack

  configuration:
    credential:
      environmentOnly:
        required

  scripts:
    commandOutput:
      sanitized:
        required

  evidence:
    rawArtifact:
      forbidden
```

---

### 49. Criar data quality policy

Arquivo:

```text
production-final-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  backlogWithoutEvidence:
    result:
      reject

  missingCharacterization:
    result:
      unsafe

  mixedRefactoringAndFeature:
    result:
      invalid-scope

  changedWorkload:
    result:
      invalid-comparison

  missingSignal:
    result:
      operational-regression

  outdatedDocumentation:
    result:
      incomplete
```

---

### 50. Criar failure policy

Arquivo:

```text
production-final-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  publicContractBroken:
    action:
      rollback

  metricRemoved:
    action:
      rollback

  traceHierarchyBroken:
    action:
      rollback

  readinessSemanticChanged:
    action:
      rollback

  shutdownLeak:
    action:
      rollback

  newFeatureAdded:
    action:
      reject-scope

  teachingMaterial:
    deferredToLesson608
```

---

### 51. Criar cenários oficiais

Arquivo:

```text
production-final-scenarios.yaml
```

Cenários:

```text
backlog-normalization;

duplicate-item-merge;

vague-item-rejected;

new-feature-rejected;

characterization-contract;

operational-name-centralized;

bounded-outcome;

error-mapping-preserved;

repository-decorator;

publisher-decorator;

metric-name-preserved;

span-name-preserved;

trace-parent-preserved;

typed-capacity-config;

invalid-config-rejected;

request-context-cleanup;

health-probe-lightweight;

readiness-draining;

graceful-shutdown;

script-helper-idempotent;

test-fixture-deterministic;

functional-regression;

operational-regression;

performance-smoke;

rollback-success;

evidence-sanitized;

final-gate-pass.
```

---

### 52. Criar reports

Exemplo:

```yaml
observabilityRefactoring:
  metricNames:
    preserved:
      true

  spanNames:
    preserved:
      true

  traceHierarchy:
    preserved:
      true

  logEvents:
    preserved:
      true

  result:
    PASS
```

Repita para:

- architecture;
- errors;
- configuration;
- testing;
- scripts;
- documentation.

---

### 53. Executar regressão

Execute:

```powershell
.\scripts\refactoring\production-final\validate-production-refactoring-regression.ps1
```

Confirme:

- build;
- unit;
- integration;
- contracts;
- API;
- logs;
- metrics;
- traces;
- health;
- SLO;
- alerts;
- shutdown;
- task leaks;
- connection leaks.

---

### 54. Validar rollback

Execute:

```powershell
.\scripts\refactoring\production-final\validate-production-refactoring-rollback.ps1
```

Selecione um slice controlado.

Aplique.

Valide.

Reverta.

Valide a baseline novamente.

Depois reaplique se aprovado.

---

### 55. Criar gate final

O gate valida:

```text
backlog;

prioridade;

boundaries;

characterization;

arquitetura;

observabilidade;

erros;

configuração;

scripts;

testes;

documentação;

regressão;

rollback;

segurança;

evidence.
```

Status:

```text
PASS;

FAIL_BACKLOG;

FAIL_PRIORITY;

FAIL_BOUNDARY;

FAIL_CHARACTERIZATION;

FAIL_ARCHITECTURE;

FAIL_OBSERVABILITY;

FAIL_ERROR_CONTRACT;

FAIL_CONFIGURATION;

FAIL_SCRIPT;

FAIL_TESTING;

FAIL_DOCUMENTATION;

FAIL_REGRESSION;

FAIL_ROLLBACK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 56. Coletar evidence

Arquivo:

```text
production-final-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- environment;
- release category;
- backlog status;
- priority status;
- boundary status;
- characterization status;
- architecture status;
- observability status;
- error contract status;
- configuration status;
- scripts status;
- testing status;
- documentation status;
- regression status;
- rollback status;
- task leak status;
- connection leak status;
- security status;
- gate status;
- timestamp.

Não inclua:

- request ID;
- trace ID;
- span ID;
- order ID;
- customer reference;
- raw logs;
- raw traces;
- raw JFR;
- heap dump;
- SQL sensível;
- segredo;
- roteiro da aula 608.

---

### 57. Executar validação completa

Execute:

```powershell
.\scripts\refactoring\production-final\validate-production-final-refactoring-contract.ps1

.\scripts\refactoring\production-final\normalize-production-refactoring-backlog.ps1

.\scripts\refactoring\production-final\validate-production-refactoring-priorities.ps1

.\scripts\refactoring\production-final\validate-production-boundaries.ps1

.\scripts\refactoring\production-final\validate-observability-preservation.ps1

.\scripts\refactoring\production-final\validate-error-contracts.ps1

.\scripts\refactoring\production-final\validate-configuration-refactoring.ps1

.\scripts\refactoring\production-final\validate-script-deduplication.ps1

.\scripts\refactoring\production-final\validate-test-architecture.ps1

.\scripts\refactoring\production-final\validate-production-refactoring-regression.ps1

.\scripts\refactoring\production-final\validate-production-refactoring-rollback.ps1

.\scripts\refactoring\production-final\collect-production-final-refactoring-evidence.ps1

.\scripts\refactoring\production-final\verify-production-final-refactoring.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 58. Encerrar a refatoração

Confirme:

- itens aceitos concluídos;
- itens rejeitados justificados;
- itens adiados documentados;
- nenhuma nova feature;
- contratos preservados;
- sinais preservados;
- baseline funcional;
- SLO preservado;
- zero task leaks;
- zero connection leaks;
- rollback validado;
- raw artifacts fora do Git;
- evidence sanitizada;
- aula ensinável não antecipada.

---

## Entendendo o que foi feito

### O backlog ganhou critérios

Itens vagos deixaram de entrar automaticamente na refatoração.

### A prioridade ganhou evidência

Impacto, risco e reversibilidade passaram a orientar a ordem.

### A arquitetura ganhou boundaries

Dependências indevidas ficaram mais visíveis.

### A observabilidade ganhou convenções

Nomes, outcomes e decorators passaram a reduzir duplicação.

### Os erros ganharam contrato central

Status, code e mensagem pública deixaram de ser mapeados em vários lugares.

### A configuração ganhou tipagem

Capacidade, threshold e timeout passaram a ser validados no startup.

### O health ganhou simplicidade

Probes passaram a responder perguntas leves e específicas.

### O shutdown ganhou coordenação

Draining, readiness e encerramento passaram a seguir sequência explícita.

### Os scripts ganharam reutilização

Funções estáveis foram extraídas sem esconder o fluxo.

### Os testes ganharam determinismo

Clock, IDs e fixtures reduziram flakiness.

### A documentação ganhou correspondência

Runbooks e guias passaram a refletir o código final.

### A próxima aula ganhou fronteira

Ensinar o conteúdo fica para a aula 608.

---

## Erros comuns importantes

### Usar refatoração para adicionar feature

O escopo deixa de ser controlado.

### Criar abstração para tudo

A complexidade apenas muda de lugar.

### Renomear métrica sem migração

Dashboards e alertas quebram.

### Generalizar repository

Domínios diferentes perdem clareza.

### Mover regra para observability

Instrumentação passa a alterar negócio.

### Criar exception hierarchy extensa

O mapeamento fica mais difícil sem benefício real.

### Extrair helper de script cedo demais

Fluxos diferentes ficam escondidos em uma função genérica.

### Remover teste antigo

O comportamento anterior deixa de estar protegido.

### Refatorar sem rollback

Uma regressão operacional fica difícil de reverter.

### Atualizar documentação por último sem validar

O guia pode continuar divergente.

---

## Comandos úteis

### Normalizar backlog

```powershell
.\scripts\refactoring\production-final\normalize-production-refactoring-backlog.ps1
```

### Validar boundaries

```powershell
.\scripts\refactoring\production-final\validate-production-boundaries.ps1
```

### Validar observabilidade

```powershell
.\scripts\refactoring\production-final\validate-observability-preservation.ps1
```

### Executar regressão

```powershell
.\scripts\refactoring\production-final\validate-production-refactoring-regression.ps1
```

### Verificar gate

```powershell
.\scripts\refactoring\production-final\verify-production-final-refactoring.ps1
```

---

## Exercício guiado

### Parte 1 — Backlog

Normalize, una duplicados e rejeite itens vagos.

### Parte 2 — Characterization

Registre contratos atuais.

### Parte 3 — Boundaries

Corrija dependências indevidas reais.

### Parte 4 — Observability

Centralize nomes e outcomes sem mudar sinais.

### Parte 5 — Errors

Centralize mapeamento público.

### Parte 6 — Configuration

Crie properties tipadas e validações.

### Parte 7 — Shutdown e scripts

Padronize lifecycle e helpers estáveis.

### Parte 8 — Tests

Remova sleeps e crie fixtures determinísticas.

### Parte 9 — Regression

Valide funcionalidade, operação e performance smoke.

### Parte 10 — Rollback

Reverta um slice e recupere a baseline.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 606 e ponte para a aula 608 foram preservadas;
- a baseline da prova permanece aprovada;
- contrato, policies, backlog, reports, cenários e scripts foram criados;
- itens possuem problema, evidência, impacto, risco, prioridade, aceite e rollback;
- itens vagos foram rejeitados;
- novas features foram excluídas;
- characterization tests foram criados antes das mudanças;
- endpoints, payloads e erros permaneceram compatíveis;
- logs, métricas, spans, health, SLI e alertas foram preservados;
- nomes operacionais foram centralizados sem criar alta cardinalidade;
- outcomes foram limitados a enum bounded;
- observability decorators não alteram regra de negócio;
- boundaries entre API, application, domain, infrastructure, observability e operations foram validados;
- domain não depende do framework;
- error mapping foi centralizado;
- mensagens públicas não expõem exception bruta;
- configuration properties são tipadas e validadas;
- thresholds permanecem coerentes com capacidades;
- request context mantém cleanup;
- health indicators permanecem leves;
- readiness representa draining e dependências essenciais;
- graceful shutdown segue sequência explícita;
- scripts duplicados foram reduzidos sem ocultar contexto;
- testes usam clock, IDs e fixtures determinísticas;
- sleeps frágeis foram removidos quando possível;
- documentação foi atualizada;
- performance smoke não mostrou regressão relevante;
- zero task leaks e zero connection leaks foram validados;
- rollback de slice foi testado;
- raw artifacts e dados sensíveis não foram commitados;
- a aula ensinável e o checklist SRE não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/refactoring/production-final `
  scripts/refactoring/production-final `
  scripts/common `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestIdValue|traceIdValue|spanIdValue|rawJfr|heapDump|threadDump|rawSql|queryParameter|teachingScript|SREChecklist"
```

Commit recomendado:

```powershell
git commit -m "refactor(m18): concluir refatoracao final producao"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- `.env`;
- IDs reais;
- payloads;
- raw logs;
- raw traces;
- raw JFR;
- dumps;
- SQL sensível;
- feature nova;
- roteiro da aula 608;
- checklist da aula 609.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você executou a refatoração final do projeto de produção.

Você trabalhou com:

```text
backlog;

priorização;

characterization tests;

boundaries;

nomes operacionais;

outcomes;

error mapping;

observability decorators;

configuration properties;

request context;

health probes;

readiness;

shutdown;

scripts comuns;

fixtures;

testes determinísticos;

documentação;

regressão;

rollback.
```

Você comprovou que refatorar não é reescrever; que backlog precisa de evidência; que abstrações prematuras aumentam custo; que métricas, spans e logs são contratos operacionais; que configuração tipada reduz falhas; que probes precisam ser leves; que shutdown precisa de ordem; que scripts também acumulam dívida; que testes determinísticos protegem mudanças; e que toda refatoração precisa preservar funcionalidade, SLO, observabilidade e lifecycle.

A próxima aula será:

```text
608 - M18.53 - Aula ensinavel producao
```

Nela, você irá transformar o conteúdo consolidado do módulo em uma aula ensinável, com objetivo, narrativa, demonstração, exercícios, checkpoints e explicações que outra pessoa consiga reproduzir.

Nenhum roteiro pedagógico completo, aula para terceiros ou checklist SRE foi criado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Normalizei o backlog.
- [ ] Rejeitei feature disfarçada.
- [ ] Criei characterization tests.
- [ ] Validei boundaries.
- [ ] Preservei observabilidade.
- [ ] Tipifiquei configuração.
- [ ] Refatorei shutdown, scripts e testes.
- [ ] Validei regressão e rollback.

---

## Troubleshooting adicional

### O backlog ficou enorme

Agrupe duplicados e adie itens sem impacto imediato.

### A refatoração quebra dashboard

Restaure o nome da métrica ou crie migração explícita.

### O decorator altera exception

Ele deve observar e relançar, não converter regra.

### O domain importa Spring

Mova integração para application ou infrastructure.

### Properties não inicializam

Revise prefixo, scan, nomes e unidades.

### Readiness fica DOWN durante startup

Valide ordem de migrations e probes.

### Shutdown ainda deixa thread

Identifique executor, fila, scheduler ou callback residual.

### Helpers PowerShell ficaram genéricos demais

Volte parte da lógica ao script chamador.

### Teste continua flaky

Remova tempo real e use coordenação explícita.

### O material virou uma aula para terceiros

Preserve essa transformação para a aula 608.

---

## Perguntas de revisão

1. O que diferencia refatoração de nova feature?
2. Por que usar characterization tests?
3. O que é um refactoring slice?
4. O que é abstração prematura?
5. Por que métricas são contratos?
6. Por que centralizar outcomes?
7. Qual função de um decorator de observabilidade?
8. O que um decorator não pode fazer?
9. Por que tipar configuração?
10. Por que validar thresholds no startup?
11. Qual risco de renomear métrica?
12. O que readiness deve indicar no shutdown?
13. Quando extrair helper de script?
14. Por que injetar `Clock`?
15. Como reduzir testes flaky?
16. O que precisa ser preservado na regressão?
17. Quando um item deve ser adiado?
18. Por que testar rollback?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Estrutura interna versus comportamento novo.
2. Registrar comportamento atual.
3. Mudança pequena e validável.
4. Generalização antes de casos reais.
5. Dashboards, alertas e SLO dependem delas.
6. Manter labels bounded.
7. Observar sem alterar negócio.
8. Mudar regra ou contrato.
9. Validar capacidade e unidades.
10. Falhar cedo com configuração inválida.
11. Quebrar queries e alertas.
12. Que a instância está drenando.
13. Quando a repetição é estável e real.
14. Tornar tempo determinístico.
15. Remover sleeps e controlar dependências.
16. API, sinais, SLO, lifecycle e segurança.
17. Quando risco ou escopo superam o benefício.
18. Garantir recuperação da baseline.
19. Aula ensinável produção.
20. Aula ensinável produção.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 607 - M18.52 - Refatoracao final producao

- Usei o backlog gerado na prova prática.
- Normalizei itens com problema, evidência, impacto, risco e rollback.
- Rejeitei itens vagos e features disfarçadas de refatoração.
- Criei characterization tests antes das mudanças.
- Validei boundaries entre API, application, domain, infrastructure, observability e operations.
- Centralizei nomes operacionais e outcomes bounded.
- Refatorei métricas, spans e logs por decorators.
- Centralizei error mapping sem expor exceptions internas.
- Criei configuration properties tipadas e validadas.
- Preservei request context e cleanup.
- Simplifiquei health indicators e readiness.
- Coordenei graceful shutdown com estado de draining.
- Reduzi duplicação de scripts com helpers estáveis.
- Criei fixtures determinísticas com `Clock` e geradores injetáveis.
- Removi sleeps frágeis quando possível.
- Atualizei documentação e decision log.
- Executei regressão funcional, operacional e performance smoke.
- Testei rollback de um slice.
- Validei zero task leaks e zero connection leaks.
- Não antecipei a aula ensinável ou o checklist SRE.
- Próxima aula: Aula ensinável produção.
```

---

## Referência técnica curta

- Refactoring.
- Characterization tests.
- Architecture boundaries.
- Operational contracts.
- Configuration properties.
- Observability decorators.
- Graceful shutdown.
- Deterministic tests.
- Regression testing.
- Rollback-safe changes.

Regra final:

```text
a refatoração final de produção precisa melhorar estrutura sem alterar indevidamente comportamento funcional ou operacional: todo item nasce de backlog normalizado com evidência, impacto, risco, prioridade, aceite e rollback, characterization tests registram contratos antes da mudança, slices pequenos preservam endpoints, payloads, erros, logs, métricas, spans, health, SLI, alertas e shutdown, e boundaries mantêm domain independente de framework, application orientada a casos de uso, infrastructure implementando ports e observability sem regra de negócio; nomes operacionais e outcomes permanecem bounded, configuração é tipada e validada, probes são leves, readiness representa draining, shutdown encerra filas, executors e datasource, scripts extraem apenas repetições estáveis, testes usam clock, IDs e fixtures determinísticas, e documentação acompanha o código; nenhuma feature nova, segredo ou raw artifact entra no Git, regressão e rollback são obrigatórios, zero task leaks e zero connection leaks fecham o gate, e a transformação pedagógica começa somente na aula 608.
```
