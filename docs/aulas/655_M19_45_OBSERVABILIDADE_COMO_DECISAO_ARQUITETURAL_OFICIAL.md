# 655 - M19.45 - Observabilidade como decisao arquitetural

## Apresentação da aula

Na aula 654, você revisitou transações distribuídas e Saga em um nível executável.

A `Confirmation Saga` passou a coordenar `Scheduling`, `Capacity`, `Field Execution` e `Communication` por meio de transações locais, Outbox, Inbox, mensagens idempotentes, máquina de estados persistente, compensações, deadlines, recovery e reconciliation.

Esse desenho tornou a intenção distribuída recuperável.

Mas ainda existe uma pergunta decisiva:

```text
quando a confirmação falha,
como a equipe descobre

qual boundary falhou,
qual passo está atrasado,
qual cliente foi impactado,
qual versão está ativa,
qual dependência saturou
e qual ação é segura?
```

Adicionar logs em cada serviço não responde automaticamente a essa pergunta.

Criar métricas sem semântica pode produzir milhares de séries que ninguém sabe interpretar.

Capturar todos os traces pode tornar a plataforma cara, lenta e perigosa para dados sensíveis.

Dashboards podem exibir muitos gráficos e, mesmo assim, não apoiar nenhuma decisão.

Alertas podem disparar continuamente sem indicar impacto, owner, runbook ou recuperação esperada.

Observabilidade como decisão arquitetural significa definir, antes e durante o desenho do sistema:

- quais jornadas precisam ser compreendidas;
- quais perguntas operacionais devem ser respondidas;
- quais sinais cada boundary deve produzir;
- como contexto atravessa protocolos;
- quais atributos são permitidos;
- quais dimensões possuem cardinalidade limitada;
- quais SLOs protegem o negócio;
- quanto custa coletar, transportar, armazenar e consultar telemetria;
- como o sistema se comporta quando a plataforma de observabilidade falha;
- quem responde a cada alerta;
- quais evidências permitem liberar, operar e evoluir a arquitetura.

A arquitetura observável nasce com fronteiras, protocolos, contratos, ownership e riscos.

O laboratório será:

```text
labs/m19/aula-655-observabilidade-como-decisao-arquitetural/service-scheduling-observability-architecture
```

Você irá modelar a observabilidade arquitetural da jornada:

```text
Confirm Appointment
```

A jornada atravessa:

```text
API Gateway;

Scheduling;

Capacity;

Field Execution;

Communication;

broker;

bancos locais;

Outbox;

Inbox;

workers;

plataforma de telemetria.
```

Você criará mapa de jornadas, perguntas operacionais, contratos de sinais, convenções semânticas, contexto propagado, políticas de logs, métricas e traces, SLIs, SLOs, cardinalidade, sampling, custo, retenção, dashboards, alertas, runbooks, game day, testes, reports, evidence e gate.

A próxima aula será:

```text
656 - M19.46 - Seguranca como decisao arquitetural
```

A aula 656 aprofundará threat modeling, trust boundaries, identidade, autorização, proteção de dados, secrets, supply chain e decisões de segurança.

Nesta aula, segurança aparecerá somente no nível necessário para impedir que telemetria exponha dados, credenciais ou contexto indevido.

Regra central:

```text
observabilidade não é
um conjunto de ferramentas;

é uma capacidade arquitetural
para explicar comportamento,
impacto, risco e recuperação

com sinais confiáveis,
custos controlados
e ownership explícito.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
653:
Anti patterns de microservicos.

654:
Transacoes distribuidas e Saga revisitada.

655:
Observabilidade como decisao arquitetural.

656:
Seguranca como decisao arquitetural.

657:
Dados como decisao arquitetural.
```

A progressão é:

```text
identificar distribuição inadequada;

coordenar transações entre fronteiras;

tornar a arquitetura explicável;

incorporar segurança às decisões;

tratar dados como ativo arquitetural.
```

O M18 já ensinou implementação de observabilidade:

- logs estruturados;
- correlation ID;
- trace ID;
- Actuator;
- Micrometer;
- Prometheus;
- Grafana;
- OpenTelemetry;
- tracing distribuído;
- SLI;
- SLO;
- error budget;
- alertas;
- dashboards;
- troubleshooting e produção.

A aula atual não repete a instalação dessas ferramentas.

O foco agora é outro:

```text
como usar observabilidade
para desenhar fronteiras,
protocolos, SLIs,
custos, ownership
e critérios de evolução?
```

Você aplicará conhecimentos anteriores para responder perguntas arquiteturais.

A observabilidade será tratada como propriedade do sistema distribuído.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-655-observabilidade-como-decisao-arquitetural
└── service-scheduling-observability-architecture
    ├── pom.xml
    ├── README.md
    ├── src/main/java/br/com/formacao/observabilityarchitecture
    │   ├── journey
    │   ├── contract
    │   ├── context
    │   ├── metrics
    │   ├── tracing
    │   ├── reliability
    │   ├── cost
    │   ├── alert
    │   ├── dashboard
    │   └── gate
    ├── src/test/java/br/com/formacao/observabilityarchitecture
    │   ├── contract
    │   ├── metrics
    │   ├── tracing
    │   ├── reliability
    │   └── architecture
    ├── observability
    ├── contracts
    └── reports
```

Os pacotes Java conterão jornadas, contratos de sinais, contexto operacional, budgets de cardinalidade, políticas de sampling, SLIs, SLOs, alertas e gate. Os diretórios `observability`, `contracts` e `reports` conterão charter, catálogos, políticas, evidence e resultados de validação.

Scripts:

```text
scripts/m19/service-scheduling-observability-architecture
├── validate-observability-contract.ps1
├── validate-journey-coverage.ps1
├── validate-semantic-conventions.ps1
├── validate-context-propagation.ps1
├── validate-cardinality-budget.ps1
├── validate-sampling-policy.ps1
├── validate-sli-slo-catalog.ps1
├── validate-dashboard-catalog.ps1
├── validate-alert-actionability.ps1
├── validate-telemetry-cost.ps1
├── run-observability-architecture-tests.ps1
├── collect-observability-architecture-evidence.ps1
└── verify-observability-architecture-gate.ps1
```

---

## Conceito essencial

### Telemetria não é observabilidade

Telemetria são os sinais produzidos:

```text
logs;

métricas;

traces;

eventos;

profiles;

health states.
```

Observabilidade é a capacidade de usar esses sinais para compreender o comportamento interno e o impacto externo do sistema.

Um serviço pode gerar muitos sinais e continuar opaco.

Isso acontece quando:

- não existe correlação;
- nomes variam entre equipes;
- atributos não possuem semântica;
- dashboards não refletem jornadas;
- SLOs não possuem elegibilidade;
- alerts não possuem ação;
- cardinalidade explode;
- sampling remove justamente os traces críticos;
- logs não registram decisões;
- telemetria não acompanha mudanças de arquitetura.

### O ponto de partida é a pergunta

A arquitetura observável começa pelas perguntas que a equipe precisa responder.

Exemplos para `Confirm Appointment`:

```text
qual percentual de confirmações termina com sucesso?

em qual passo a jornada mais falha?

quanto tempo a saga permanece em cada estado?

há capacidade reservada sem confirmação concluída?

qual release aumentou o burn rate?

qual tenant está impactado sem expor seu identificador bruto?

qual dependência está saturada?

quantas sagas exigiram intervenção manual?

a compensação realmente neutralizou o efeito?
```

Cada pergunta exige sinais específicos.

Instrumentar primeiro e perguntar depois tende a gerar ruído.

### Observabilidade influencia fronteiras

Uma fronteira arquitetural precisa declarar:

- owner;
- propósito;
- protocolo;
- contrato;
- autoridade;
- SLO;
- sinais;
- contexto propagado;
- comportamento degradado;
- dependências;
- runbook.

Quando um boundary não consegue explicar suas decisões, atrasos e falhas, ele não está operacionalmente pronto.

### Logs, métricas e traces possuem papéis diferentes

Logs são adequados para eventos discretos, decisões, mudanças de estado e detalhes diagnósticos bounded.

Métricas são adequadas para agregação, tendência, taxa, distribuição, saturação e SLO.

Traces são adequados para causalidade, jornada distribuída, latência por etapa e dependências.

Não transforme cada informação em todos os sinais.

A duplicação aumenta custo e inconsistência.

### SLO é um requisito arquitetural

SLO não é apenas um gráfico.

Ele influencia:

- timeout;
- retry;
- orçamento de latência;
- capacidade;
- escolha de protocolo;
- sincronismo;
- prioridade de backlog;
- estratégia de deploy;
- frequência de mudança;
- nível de redundância;
- resposta a incidentes.

Um boundary sem SLO não consegue avaliar se está saudável para o negócio.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-655-observabilidade-como-decisao-arquitetural/service-scheduling-observability-architecture

Set-Location `
  labs/m19/aula-655-observabilidade-como-decisao-arquitetural/service-scheduling-observability-architecture
```

---

### 2. Criar o Observability Charter

Arquivo:

```text
observability/OBSERVABILITY_CHARTER.md
```

Conteúdo:

```markdown
Observability Charter

Contexto:
Service Scheduling.

Jornada prioritária:
Confirm Appointment.

Objetivos:

- explicar sucesso, falha e latência;
- localizar impacto por boundary;
- medir SLOs;
- preservar correlação;
- controlar cardinalidade e custo;
- apoiar resposta e recuperação.

Princípios:

- perguntas antes de sinais;
- atributos bounded;
- nenhum dado sensível;
- telemetria não bloqueia negócio;
- alertas possuem owner e runbook;
- dashboards apoiam decisões;
- evidence é sanitizada.
```

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/observability-architecture-contract.yaml
```

Conteúdo:

```yaml
observabilityArchitecture:
  context:
    Service-Scheduling

  required:
    - business-journey-map
    - operational-question-catalog
    - signal-contracts
    - semantic-conventions
    - context-propagation
    - bounded-cardinality
    - sampling-policy
    - SLI-SLO-catalog
    - actionable-alerts
    - decision-oriented-dashboards
    - telemetry-cost-budget
    - retention-policy
    - telemetry-failure-policy
    - owners
    - runbooks
    - tests
    - evidence
    - gate

  forbidden:
    - raw-personal-data
    - secret-in-telemetry
    - unbounded-label
    - alert-without-owner
    - dashboard-without-question
    - SLO-without-eligibility
    - telemetry-blocking-business
    - security-architecture-deep-dive
    - data-architecture-deep-dive

  nextLesson:
    code:
      M19.46
```

---

### 4. Mapear a jornada de negócio

Arquivo:

```text
observability/BUSINESS_JOURNEY_MAP.md
```

A jornada `Confirm Appointment` será composta por:

```text
1. receber comando HTTP;

2. validar identidade e autorização;

3. carregar Appointment;

4. iniciar Confirmation Saga;

5. reservar capacidade;

6. preparar execução de campo;

7. confirmar Appointment;

8. publicar evento;

9. solicitar comunicação;

10. concluir jornada.
```

Para cada passo, registre:

- boundary;
- operação;
- autoridade;
- protocolo;
- dependência;
- timeout;
- retry;
- resultado esperado;
- sinal obrigatório;
- owner.

---

### 5. Criar Business Journey

```java
package br.com.formacao.observabilityarchitecture.journey;

import java.util.List;
import java.util.Objects;

public record BusinessJourney(
        JourneyId id,
        String name,
        String owner,
        List<JourneyStep> steps) {

    public BusinessJourney {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(owner);
        steps = List.copyOf(steps);

        if (steps.isEmpty()) {
            throw new IllegalArgumentException(
                    "Journey must contain steps");
        }
    }
}
```

Ela não substitui bounded contexts, mas conecta o comportamento percebido pelo negócio às fronteiras técnicas.

---

### 6. Criar catálogo de perguntas operacionais

Arquivo:

```text
observability/OPERATIONAL_QUESTION_CATALOG.md
```

Exemplo:

```text
Question ID:
OQ-001.

Question:
What percentage of confirmation journeys succeed?

Decision:
release, rollback or continue.

Signals:
journey counter;
journey duration;
outcome;
release ID.

Owner:
Scheduling Team.

Maximum answer time:
5 minutes.
```

A pergunta possui decisão associada; sem decisão, questione o custo do sinal.

---

### 7. Classificar perguntas

Classifique cada pergunta como impacto de negócio, confiabilidade, latência, saturação, dependência, consistência, custo, mudança ou recuperação. Indicadores de segurança serão apenas catalogados; o desenho completo fica para a aula 656.

---

### 8. Criar Signal Contract

```java
package br.com.formacao.observabilityarchitecture.contract;

import java.util.List;
import java.util.Objects;

public record SignalContract(
        String signalId,
        String name,
        String purpose,
        String owner,
        List<AttributeDefinition> attributes,
        String retentionClass) {

    public SignalContract {
        Objects.requireNonNull(signalId);
        Objects.requireNonNull(name);
        Objects.requireNonNull(purpose);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(retentionClass);
        attributes = List.copyOf(attributes);
    }
}
```

O contrato impede que cada serviço invente nomes, labels e retenções sem coordenação.

---

### 9. Definir convenções semânticas

Arquivo:

```text
observability/SEMANTIC_CONVENTIONS.md
```

Campos comuns:

```text
service.name;

service.version;

deployment.environment;

operation.name;

journey.name;

journey.step;

outcome;

error.type;

dependency.name;

messaging.operation;

saga.state;

release.id.
```

Evite:

```text
customer.name;

email;

phone;

document;

raw URL;

exception.message como label;

appointment ID como metric label;

trace ID como metric label.
```

IDs podem aparecer em logs e traces quando permitido e protegido, mas não em labels de métricas.

---

### 10. Criar Attribute Definition

Modele cada atributo com nome, descrição, cardinalidade, sensibilidade e obrigatoriedade. A validação deve rejeitar atributos sensíveis exigidos por padrão e nomes fora das convenções.

```java
public record AttributeDefinition(
        String name,
        AttributeCardinality cardinality,
        boolean sensitive,
        boolean required) {
}
```

A regra real deve ser adaptada ao contrato de dados e ao risco.

---

### 11. Definir Operational Context

```java
package br.com.formacao.observabilityarchitecture.context;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

public record OperationalContext(
        UUID requestId,
        UUID correlationId,
        Optional<String> traceParent,
        String journeyName,
        String releaseId) {

    public OperationalContext {
        Objects.requireNonNull(requestId);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(traceParent);
        Objects.requireNonNull(journeyName);
        Objects.requireNonNull(releaseId);
    }
}
```

`requestId` identifica uma entrada.

`correlationId` conecta operações relacionadas.

`traceParent` transporta o contexto de tracing padronizado.

`journeyName` possui baixa cardinalidade.

`releaseId` conecta comportamento a mudanças.

---

### 12. Propagar contexto entre protocolos

Arquivo:

```text
observability/CONTEXT_PROPAGATION_POLICY.md
```

Defina propagação para:

```text
HTTP:
W3C Trace Context;
request ID;
correlation ID.

Messaging:
traceparent;
correlation ID;
message ID;
causation ID.

Scheduled worker:
novo trace;
correlation derivada da entidade operacional;
job execution ID.

Manual intervention:
correlation ID;
actor reference sanitizada;
finding ID.
```

Não propague contexto ilimitado.

Cada campo aumenta acoplamento, tamanho, custo e risco.

---

### 13. Validar fronteiras de contexto

Crie `ContextValidation` para rejeitar `journeyName` excessivo, `releaseId` vazio e `traceparent` incompatível. O teste deve provar que contexto operacional também possui contrato e limite.

---

### 14. Definir logging policy

Arquivo:

```text
observability/LOGGING_POLICY.md
```

Eventos mínimos:

```text
journey_started;

journey_step_started;

journey_step_completed;

journey_step_failed;

saga_state_changed;

compensation_requested;

manual_intervention_opened;

journey_completed.
```

Campos:

```text
timestamp;

level;

event;

service;

environment;

release;

correlation_id;

trace_id;

journey;

step;

outcome;

error_type;

duration_ms.
```

Mensagens humanas podem existir, mas automação deve depender de campos estáveis.

---

### 15. Registrar decisão, não apenas exceção

Logs da Saga devem registrar `decision`, `reason`, `current_state`, `next_action` e `outcome`. Somente um stack trace não explica a política aplicada nem a ação segura.

---

### 16. Criar política de métricas

Arquivo:

```text
observability/METRIC_POLICY.md
```

Use métricas técnicas e de negócio.

Técnicas:

```text
HTTP rate, errors, duration;

JVM utilization;

thread or executor saturation;

database pool usage;

broker publish failures;

consumer lag;

Outbox age;

Inbox duplicate rate.
```

De negócio:

```text
confirmation journeys started;

confirmation journeys completed;

confirmation journeys failed;

confirmation journeys compensated;

manual interventions opened;

journey duration;

time in saga state.
```

A métrica de negócio deve possuir definição e owner.

---

### 17. Criar Metric Definition

```java
public record MetricDefinition(
        String name,
        MetricType type,
        String unit,
        List<String> labels,
        long maximumSeries,
        String owner) {
}
```

`maximumSeries` torna custo e cardinalidade verificáveis. Nome, unidade, labels e owner são obrigatórios.

---

### 18. Definir cardinalidade

Cardinalidade é o número de combinações distintas de labels.

Considere:

```text
service:
6 valores.

environment:
3 valores.

operation:
12 valores.

outcome:
4 valores.

tenant:
10.000 valores.
```

Adicionar `tenant` multiplica o número potencial de séries.

Nem toda dimensão útil para investigação deve ser label de métrica.

Use logs, traces, exemplars ou agregações controladas quando a dimensão for alta.

---

### 19. Criar Cardinality Budget

Arquivo:

```text
observability/CARDINALITY_BUDGET.md
```

Exemplo:

```text
Metric family:
service_scheduling_journey_duration_seconds.

Allowed labels:
journey;
outcome;
environment.

Forbidden labels:
appointment_id;
customer_id;
tenant_id;
trace_id;
exception_message.

Maximum active series:
120.

Owner:
Scheduling Platform.
```

---

### 20. Implementar Cardinality Guard

```java
package br.com.formacao.observabilityarchitecture.metrics;

import java.util.Map;
import java.util.Set;

public final class CardinalityGuard {

    private static final Set<String> FORBIDDEN_LABELS =
            Set.of(
                    "appointment_id",
                    "customer_id",
                    "tenant_id",
                    "trace_id",
                    "exception_message");

    public void validate(
            MetricDefinition definition,
            Map<String, Set<String>> observedValues) {

        for (String label : definition.labels()) {
            if (FORBIDDEN_LABELS.contains(label)) {
                throw new IllegalArgumentException(
                        "Forbidden metric label: " + label);
            }
        }

        long estimatedSeries = observedValues.values()
                .stream()
                .mapToLong(Set::size)
                .reduce(1L, Math::multiplyExact);

        if (estimatedSeries > definition.maximumSeries()) {
            throw new IllegalStateException(
                    "Cardinality budget exceeded");
        }
    }
}
```

O cálculo simplificado é suficiente para o laboratório.

Em produção, observe séries ativas reais, churn e retenção.

---

### 21. Modelar tracing por jornada

Arquivo:

```text
observability/TRACING_POLICY.md
```

Trace recomendado:

```text
ConfirmAppointment HTTP span;

StartConfirmationSaga span;

ReserveCapacity messaging producer span;

ReserveCapacity consumer span;

PrepareFieldExecution span;

ConfirmAppointmentLocal span;

PublishAppointmentConfirmed span;

SendCommunication span.
```

Cada span deve possuir nome estável e responsabilidade clara.

Evite spans para cada método privado.

---

### 22. Criar Span Contract

```java
public record SpanContract(
        String spanName,
        String boundary,
        String operation,
        List<String> requiredAttributes,
        List<String> forbiddenAttributes) {
}
```

O contrato mantém nomes, atributos e fronteiras comparáveis entre serviços.

---

### 23. Definir sampling

Capturar 100% dos traces em laboratório é simples.

Em produção, pode ser inviável.

Estratégias:

```text
head sampling:
decide no início.

tail sampling:
decide após observar resultado.

probabilistic:
amostra percentual.

rule based:
mantém erros, lentidão ou jornadas críticas.

adaptive:
ajusta conforme volume e budget.
```

A escolha afeta custo e capacidade de diagnóstico.

---

### 24. Criar Sampling Policy

Arquivo:

```text
observability/SAMPLING_POLICY.md
```

Exemplo:

```text
Base healthy traffic:
5%.

Errors:
100%.

Journey duration above SLO:
100%.

Manual intervention:
100%.

Compensation:
100%.

Security-sensitive event:
metadata only,
according to security policy.

Maximum ingestion:
defined by telemetry budget.
```

Tail sampling pode preservar traces importantes, mas adiciona estado, memória e complexidade ao Collector.

---

### 25. Implementar Sampling Decision

```java
package br.com.formacao.observabilityarchitecture.tracing;

import java.time.Duration;

public final class SamplingPolicy {

    public SamplingDecision decide(
            String outcome,
            Duration duration,
            boolean compensation,
            boolean manualIntervention) {

        if (!"SUCCESS".equals(outcome)) {
            return SamplingDecision.KEEP;
        }

        if (duration.compareTo(
                Duration.ofSeconds(3)) > 0) {
            return SamplingDecision.KEEP;
        }

        if (compensation || manualIntervention) {
            return SamplingDecision.KEEP;
        }

        return SamplingDecision.SAMPLE_BASE_RATE;
    }
}
```

O resultado representa política.

A exportação real continua sob SDK ou Collector.

---

### 26. Definir SLIs

Arquivo:

```text
observability/SLI_SLO_CATALOG.md
```

SLI de sucesso:

```text
good:
journeys completed successfully.

total:
eligible journeys started.

exclude:
synthetic tests;
invalid requests rejected before saga;
maintenance explicitly declared.
```

SLI de latência:

```text
good:
eligible journeys completed in <= 3 seconds.

total:
eligible completed journeys.
```

SLI de recuperação:

```text
good:
stuck sagas reconciled within 15 minutes.

total:
stuck sagas detected.
```

Elegibilidade precisa ser explícita.

---

### 27. Criar SLI Definition

```java
public record SliDefinition(
        String id,
        String goodQuery,
        String totalQuery,
        String eligibility,
        String owner) {
}
```

A query e a elegibilidade fazem parte do contrato. Alterá-las muda a medição e exige revisão.

---

### 28. Criar SLO Definition

```java
package br.com.formacao.observabilityarchitecture.reliability;

import java.math.BigDecimal;
import java.time.Duration;

public record SloDefinition(
        String id,
        SliDefinition sli,
        BigDecimal objective,
        Duration window,
        String owner,
        String runbook) {

    public SloDefinition {
        if (objective.signum() <= 0
                || objective.compareTo(
                        BigDecimal.ONE) > 0) {
            throw new IllegalArgumentException(
                    "Objective must be between 0 and 1");
        }

        if (window.isZero() || window.isNegative()) {
            throw new IllegalArgumentException(
                    "Window must be positive");
        }
    }
}
```

Exemplo:

```text
99,5% das confirmações elegíveis
devem concluir com sucesso
em uma janela móvel de 30 dias.
```

---

### 29. Relacionar SLO à arquitetura

Quando o SLO de latência é 3 segundos, o orçamento precisa ser distribuído.

Exemplo:

```text
Gateway:
150 ms.

Scheduling:
350 ms.

Capacity:
900 ms.

Field Execution:
700 ms.

broker and queue:
300 ms.

database:
300 ms.

communication:
fora do caminho crítico.

headroom:
300 ms.
```

A soma não deve ocupar 100% do objetivo.

Sem headroom, variação normal causa violações.

---

### 30. Criar Error Budget Policy

Arquivo:

```text
contracts/sli-slo-policy.yaml
```

Conteúdo:

```yaml
reliability:
  confirmationJourney:
    availability:
      objective:
        0.995
      windowDays:
        30

    latency:
      objective:
        0.99
      thresholdMilliseconds:
        3000
      windowDays:
        30

  errorBudget:
    actions:
      healthy:
        continue-change

      elevatedBurn:
        review-risky-releases

      exhausted:
        prioritize-reliability

  owner:
    Scheduling-Platform
```

Error budget orienta decisão de mudança.

Ele não deve ser usado para esconder problemas ou punir equipes.

---

### 31. Definir burn-rate alerts

Crie alertas com janelas múltiplas:

```text
fast burn:
grande consumo em janela curta.

slow burn:
consumo sustentado em janela longa.
```

O laboratório não precisa fixar uma fórmula universal.

Registre:

- SLO;
- burn threshold;
- short window;
- long window;
- volume mínimo;
- severity;
- owner;
- runbook;
- recovery condition.

---

### 32. Criar Alert Definition

```java
public record AlertDefinition(
        String id,
        AlertSeverity severity,
        String condition,
        Duration forDuration,
        String owner,
        String runbook,
        String recoveryCondition) {
}
```

O registro obriga owner, runbook, duração e recuperação.

---

### 33. Validar acionabilidade

Um alerta é acionável quando:

- representa impacto ou risco real;
- possui owner;
- possui prioridade;
- possui dashboard;
- possui runbook;
- indica primeira investigação;
- possui condição de recuperação;
- evita duplicar outro alerta;
- não depende de dado sensível.

Alerta sem ação é ruído operacional.

---

### 34. Criar Alert Catalog

Arquivo:

```text
observability/ALERT_CATALOG.md
```

Alertas recomendados:

```text
Confirmation Journey SLO Fast Burn;

Confirmation Journey SLO Slow Burn;

Saga Waiting State Above Deadline;

Outbox Oldest Pending Age High;

Capacity Dependency Error Rate High;

Manual Intervention Backlog High;

Telemetry Pipeline Dropping Data;

Cardinality Budget Near Limit.
```

Não alerte diretamente sobre toda exceção.

Priorize impacto, sintomas e condições operacionais relevantes.

---

### 35. Criar dashboards orientados por perguntas

Arquivo:

```text
observability/DASHBOARD_CATALOG.md
```

Dashboard `Confirmation Journey Overview` responde:

```text
quantas jornadas iniciaram?

quantas concluíram?

qual a taxa de sucesso?

qual a duração p50, p95 e p99?

em qual etapa ocorre maior atraso?

qual release alterou o comportamento?

qual é o burn rate?

há backlog ou intervenção manual?
```

Cada painel declara:

- pergunta;
- query;
- unidade;
- janela;
- owner;
- threshold;
- no data;
- link de investigação;
- limitação.

---

### 36. Criar Operational Question

```java
public record OperationalQuestion(
        String id,
        String question,
        String decision,
        String owner) {
}
```

O dashboard existe para reduzir o tempo de resposta a essa pergunta.

---

### 37. Planejar navegação entre sinais

A investigação deve navegar de alerta para dashboard, trace, spans, logs correlacionados, state report, runbook e pós-verificação. Sinais isolados aumentam o tempo de diagnóstico.

---

### 38. Modelar custo de telemetria

Arquivo:

```text
observability/TELEMETRY_COST_MODEL.md
```

Considere:

```text
event volume;

bytes per event;

metric series;

scrape interval;

trace sampling;

span count;

retention;

indexing;

egress;

query load;

replication;

compliance storage.
```

Exemplo:

```text
logs: 40 GB/day;
traces: 8 million spans/day before sampling;
metrics: 18 thousand active series;
retention: logs 14d, traces 7d, metrics 30d.
```

O objetivo não é criar preço exato, mas tornar custo uma restrição explícita.

---

### 39. Criar Telemetry Budget

```java
package br.com.formacao.observabilityarchitecture.cost;

public record TelemetryBudget(
        long maximumLogBytesPerDay,
        long maximumSpansPerDay,
        long maximumActiveMetricSeries,
        long maximumMonthlyCostUnits) {

    public TelemetryBudget {
        if (maximumLogBytesPerDay < 1
                || maximumSpansPerDay < 1
                || maximumActiveMetricSeries < 1
                || maximumMonthlyCostUnits < 1) {

            throw new IllegalArgumentException(
                    "Telemetry budgets must be positive");
        }
    }
}
```

Budget não deve incentivar cegueira.

Ele força priorização, agregação, sampling, retenção e revisão de sinais.

---

### 40. Definir retenção por classe

Arquivo `observability/RETENTION_POLICY.md`. Separe logs operacionais, audit records, error traces, healthy traces, métricas e histórico agregado de SLO. Retenção deve equilibrar investigação, tendência, compliance, risco e custo; payload sensível bruto permanece proibido.

---

### 41. Tratar falha da telemetria

Arquivo:

```text
observability/TELEMETRY_FAILURE_POLICY.md
```

Cenários:

```text
Collector unavailable;

log sink unavailable;

metrics scrape delayed;

trace export timeout;

cardinality limiter activated;

telemetry queue full.
```

Regra:

```text
telemetria não deve
bloquear a confirmação
do Appointment.
```

Mas perda de telemetria também não pode ser silenciosa.

O sistema deve possuir métricas internas, drop counters, buffers bounded e alertas da própria pipeline.

---

### 42. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  telemetryExporterUnavailable:
    businessAction:
      CONTINUE_WITH_BOUNDED_BUFFER
    observe:
      export-failure-counter

  telemetryBufferFull:
    action:
      DROP_ACCORDING_TO_PRIORITY
    blockBusiness:
      false

  cardinalityLimitExceeded:
    action:
      REJECT_NEW_DIMENSION
    alert:
      required

  SLOQueryUnavailable:
    action:
      MARK_INCONCLUSIVE

  dashboardUnavailable:
    action:
      USE_RUNBOOK_FALLBACK

  securityArchitectureDeepDive:
    deferredToLesson656

  dataArchitectureDeepDive:
    deferredToLesson657
```

---

### 43. Priorizar sinais durante degradação

Preserve erros, compensações, intervenções, mudanças de estado e traces críticos. Reduza debug logs, traces saudáveis e eventos repetitivos. A prioridade precisa ser definida antes do incidente.

---

### 44. Proteger dados observáveis

Proíba secrets, tokens, payloads pessoais e PII em labels; sanitize mensagens, controle baggage, proteja dashboards e separe auditoria de diagnóstico. Threat modeling completo fica para a aula 656.

---

### 45. Criar security boundary policy

Arquivo:

```text
contracts/security-boundary-policy.yaml
```

Conteúdo:

```yaml
telemetrySecurity:
  forbidden:
    - password
    - access-token
    - refresh-token
    - authorization-header
    - customer-document
    - customer-email
    - customer-phone
    - raw-request-body

  identifiers:
    directMetricLabel:
      forbidden

  baggage:
    allowList:
      required

  access:
    leastPrivilege:
      required

  deeperSecurityArchitecture:
    deferredToLesson656
```

---

### 46. Definir Operating Model

Arquivo:

```text
observability/OPERATING_MODEL.md
```

Registre:

- owner da jornada;
- owner de cada boundary;
- owner da plataforma;
- on-call;
- revisão de SLO;
- revisão de custo;
- revisão de cardinalidade;
- processo de alteração de convenções;
- incident commander;
- runbook owner;
- evidence owner;
- frequência de game day;
- processo de depreciação de sinais.

---

### 47. Criar runbooks

Runbooks mínimos:

```text
confirmation-slo-burn.md;

saga-stuck.md;

outbox-lag.md;

capacity-dependency-failure.md;

telemetry-pipeline-degraded.md;

cardinality-budget-exceeded.md.
```

Cada runbook contém:

- sintoma;
- impacto;
- verificações;
- queries;
- links;
- ações seguras;
- rollback;
- escalation;
- recovery;
- pós-verificação.

---

### 48. Criar Game Day

Arquivo:

```text
observability/GAME_DAY.md
```

Cenário:

```text
Capacity começa a responder lentamente.

A Saga acumula estados WAITING_CAPACITY.

Outbox continua publicando.

Jornada ultrapassa SLO.

Fast burn dispara.

Dashboard mostra etapa afetada.

Trace aponta latência em Capacity.

Logs mostram timeout ambíguo.

Runbook orienta redução de tráfego,
verificação de reserva
e recuperação.
```

O game day valida a capacidade de explicar e recuperar, não apenas a existência de sinais.

---

### 49. Testar jornada saudável

Cenário:

1. iniciar confirmação;
2. propagar contexto;
3. concluir todos os passos;
4. registrar outcome `SUCCESS`;
5. atualizar métricas;
6. produzir trace completo;
7. confirmar ausência de dados sensíveis;
8. validar SLI elegível;
9. verificar dashboard.

---

### 50. Testar falha em Capacity

Cenário:

1. `ReserveCapacity` falha;
2. Saga inicia compensação;
3. error trace é preservado;
4. métrica de falha aumenta;
5. log registra decisão;
6. alerta não dispara com volume insuficiente;
7. dashboard localiza o passo;
8. journey outcome é `COMPENSATED`.

---

### 51. Testar timeout ambíguo

Confirme:

- span registra timeout;
- log registra `STATUS_UNKNOWN`;
- não existe falsa afirmação de falha;
- Saga consulta estado remoto;
- métricas distinguem timeout de resultado final;
- trace preserva causalidade;
- SLI usa o outcome final da jornada.

---

### 52. Testar compensação

Valide:

- compensation count;
- duration;
- state transitions;
- reason category;
- no duplicate metric series;
- trace sampled at 100%;
- audit reference sanitizada;
- dashboard mostra tendência.

---

### 53. Testar cardinalidade

Introduza labels proibidas:

```text
appointment_id;

tenant_id;

trace_id;

exception_message.
```

O `CardinalityGuard` deve falhar.

Depois use labels bounded:

```text
journey;

step;

outcome;

environment.
```

O teste deve passar.

---

### 54. Testar sampling

Valide:

- tráfego saudável usa base rate;
- erro é preservado;
- duração acima do SLO é preservada;
- compensação é preservada;
- intervenção manual é preservada;
- decisão é determinística para a política testada.

---

### 55. Testar SLI eligibility

Casos:

```text
requisição inválida antes da Saga:
não elegível.

manutenção declarada:
conforme policy.

jornada iniciada e concluída:
elegível.

jornada iniciada e expirada:
elegível e ruim.

teste sintético:
separado.
```

Não altere elegibilidade para melhorar artificialmente o número.

---

### 56. Testar burn rate

Cenário:

```text
SLO:
99,5%.

janela curta:
erro elevado.

janela longa:
erro normal.
```

O alerta crítico não deve disparar.

Depois mantenha falha nas duas janelas.

O alerta deve disparar com owner e runbook.

---

### 57. Testar custo

Aumente:

- volume de logs;
- spans;
- séries;
- retenção.

O `TelemetryCostGuard` deve gerar findings antes de ultrapassar o budget.

A ação pode ser:

- reduzir debug;
- ajustar sampling;
- agregar labels;
- revisar retenção;
- remover sinal sem consumidor;
- aumentar budget com decisão explícita.

---

### 58. Testar falha do Collector

Confirme:

- negócio continua;
- buffer permanece bounded;
- export failures são medidos;
- drop policy é aplicada;
- nenhum retry infinito bloqueia threads;
- recuperação retoma exportação;
- perda é registrada como evidence.

---

### 59. Testar arquitetura

```java
package br.com.formacao.observabilityarchitecture.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

public class TelemetryDependencyDirectionTest {

    @ArchTest
    static final ArchRule domainMustNotDependOnTelemetryAdapters =
            noClasses()
                    .that()
                    .resideInAPackage("..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..telemetryadapter..");
}
```

O domínio não deve conhecer exportadores, collectors ou vendors.

---

### 60. Testar contratos

`TelemetryContractTest` valida:

- signal ID;
- propósito;
- owner;
- atributos;
- cardinalidade;
- retenção;
- segurança;
- consumidor;
- decisão apoiada.

Sinal sem consumidor ou decisão deve gerar revisão.

---

### 61. Criar reports

Gere reports de cobertura de jornada e sinais, cardinalidade, sampling, SLOs, alertas, custo e arquitetura. O resumo deve informar quantidade de jornadas críticas, perguntas respondíveis, signal contracts, séries estimadas, SLOs sem owner, alertas acionáveis, budget e gate.

```yaml
observabilityArchitecture:
  criticalJourneysCovered: 1
  operationalQuestionsAnswerable: 17
  forbiddenLabels: 0
  estimatedSeries: 96
  cardinalityBudget: 120
  ownerlessSLOs: 0
  actionableAlerts: 7
  telemetryCostWithinBudget: true
  gate: PASS
```

---

### 62. Criar evidence

Arquivo:

```text
contracts/observability-architecture-evidence.yaml
```

Registre lesson, project, jornadas, perguntas, signal contracts, famílias de métricas, spans, cardinalidade, sampling, SLIs, SLOs, alertas, runbooks, custo, testes, arquitetura, documentação, gate e timestamp.

Não inclua dados pessoais, tokens, payloads, trace IDs reais, URLs internas, preços contratuais, topologia real, segurança aprofundada ou a arquitetura de dados da aula 657.

---

### 63. Criar o Gate

O gate valida charter, jornadas, perguntas, contracts, convenções, contexto, sinais, cardinalidade, sampling, SLOs, dashboards, alertas, custo, retenção, failure policy, owners, runbooks, game day, segurança mínima, testes, arquitetura, reports e evidence.

Status principais:

```text
PASS;
FAIL_JOURNEY;
FAIL_SIGNAL_CONTRACT;
FAIL_CARDINALITY;
FAIL_SLI_SLO;
FAIL_ALERT;
FAIL_TELEMETRY_COST;
FAIL_ARCHITECTURE;
INCONCLUSIVE.
```

---

### 64. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-observability-architecture\validate-observability-contract.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-journey-coverage.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-semantic-conventions.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-context-propagation.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-cardinality-budget.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-sampling-policy.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-sli-slo-catalog.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-dashboard-catalog.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-alert-actionability.ps1

.\scripts\m19\service-scheduling-observability-architecture\validate-telemetry-cost.ps1

.\scripts\m19\service-scheduling-observability-architecture\run-observability-architecture-tests.ps1

.\scripts\m19\service-scheduling-observability-architecture\collect-observability-architecture-evidence.ps1

.\scripts\m19\service-scheduling-observability-architecture\verify-observability-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 65. Encerrar o laboratório

Confirme jornada e perguntas mapeadas, contratos semânticos, contexto propagado, logs de decisão, métricas bounded, traces completos, sampling por risco, SLIs elegíveis, SLOs com owner, error budget, alertas, dashboards, runbooks, custo, retenção, pipeline degradável, proteção de dados, game day, reports, evidence e gate. Segurança aprofundada e arquitetura de dados permanecem para as aulas 656 e 657.

---

## Entendendo o que foi feito

### A jornada virou unidade observável

A arquitetura deixou de observar apenas processos e passou a acompanhar a experiência de negócio ponta a ponta.

`Confirm Appointment` possui passos, owners, resultados, latência e sinais explícitos.

### Sinais ganharam contratos

Logs, métricas e traces deixaram de depender de nomes improvisados.

Cada sinal possui propósito, consumidor, atributos, cardinalidade, retenção e owner.

### SLO passou a orientar desenho

O SLO influenciou orçamento de latência, protocolos, dependências, capacidade, alertas e prioridade de mudança.

### Cardinalidade e custo viraram restrições

Labels, sampling e retenção passaram a ser tratados como decisões arquiteturais.

Isso reduz explosão de séries, ingestão desnecessária e dependência de investigação cara.

### Alertas e dashboards ganharam ação

Dashboards respondem perguntas.

Alertas representam impacto, possuem owner, runbook e condição de recuperação.

### A própria telemetria ganhou resiliência

Falha do Collector não bloqueia negócio.

Buffers são bounded, drops são visíveis e sinais críticos possuem prioridade.

---

## Erros comuns importantes

### Instrumentar ferramenta antes de definir pergunta

O time produz volume, mas não consegue explicar impacto ou decisão.

### Usar ID como label

Appointment, customer, tenant, trace e exception message criam cardinalidade alta e custo imprevisível.

### Capturar 100% sem budget

Tracing pode aumentar ingestão, armazenamento e custo sem melhorar investigação na mesma proporção.

### Definir SLO sem elegibilidade

O número pode excluir falhas reais ou incluir tráfego que não representa a jornada.

### Alertar sobre causa técnica sem impacto

CPU alta pode ser normal. Priorize sintomas, SLO, saturação e risco real.

### Dashboard sem owner ou decisão

O painel envelhece e ninguém sabe se ainda representa a arquitetura.

### Telemetria bloquear negócio

Exportação síncrona, retry infinito ou buffer ilimitado transforma observabilidade em causa de indisponibilidade.

### Registrar dados sensíveis

Logs e traces possuem ampla replicação e acesso operacional. Evite payloads, tokens e PII.

### Não atualizar observabilidade após mudança

Nova fronteira, novo evento ou novo passo da Saga exige revisão de sinais, SLOs, dashboards e runbooks.

### Antecipar segurança completa

A aula atual protege telemetria, mas threat modeling e arquitetura de segurança pertencem à aula 656.

---

## Comandos úteis

### Validar jornada

```powershell
.\scripts\m19\service-scheduling-observability-architecture\validate-journey-coverage.ps1
```

### Validar cardinalidade

```powershell
.\scripts\m19\service-scheduling-observability-architecture\validate-cardinality-budget.ps1
```

### Validar SLOs

```powershell
.\scripts\m19\service-scheduling-observability-architecture\validate-sli-slo-catalog.ps1
```

### Validar alertas

```powershell
.\scripts\m19\service-scheduling-observability-architecture\validate-alert-actionability.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-observability-architecture\run-observability-architecture-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-observability-architecture\verify-observability-architecture-gate.ps1
```

---

## Exercício guiado

Escolha outra jornada de `Service Scheduling`, como:

```text
Reschedule Appointment
```

Crie:

1. mapa da jornada;
2. perguntas operacionais;
3. signal contracts;
4. contexto propagado;
5. métricas técnicas e de negócio;
6. cardinality budget;
7. span contracts;
8. sampling policy;
9. SLI e SLO;
10. dashboard;
11. alertas;
12. runbook;
13. budget de custo;
14. failure policy;
15. game day;
16. gate.

Compare a jornada de reagendamento com a de confirmação.

Explique quais sinais podem ser compartilhados e quais precisam ser específicos.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e ponte seguem a grade oficial;
- laboratório `service-scheduling-observability-architecture` foi criado;
- Observability Charter, jornada `Confirm Appointment` e perguntas operacionais foram documentados;
- boundaries, protocolos, autoridades, decisões e owners estão explícitos;
- Signal Contracts e convenções semânticas foram criados;
- contexto HTTP, messaging, worker e intervenção manual foi modelado;
- logs registram eventos, decisões e outcomes;
- métricas RED, USE e de negócio possuem definição e owner;
- IDs de alta cardinalidade foram proibidos em labels;
- Cardinality Budget e Cardinality Guard foram implementados;
- Span Contracts representam a jornada distribuída;
- sampling preserva erros, lentidão, compensações e intervenções;
- SLIs possuem good, total e elegibilidade;
- SLOs possuem objetivo, janela, owner, runbook e orçamento de latência;
- error budget e burn-rate alerts foram definidos;
- dashboards respondem perguntas e alertas são acionáveis;
- navegação entre alerta, dashboard, trace, log e runbook foi planejada;
- custo, Telemetry Budget e retenção foram documentados;
- falha da pipeline usa buffers bounded e não bloqueia negócio;
- dados sensíveis foram proibidos;
- Operating Model, runbooks e game day foram criados;
- testes de jornada, cardinalidade, sampling, SLO, custo, falha e arquitetura passaram;
- reports, evidence, gate, commit e diário de bordo estão presentes;
- segurança completa e arquitetura de dados não foram antecipadas.

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
  labs/m19/aula-655-observabilidade-como-decisao-arquitetural/service-scheduling-observability-architecture `
  scripts/m19/service-scheduling-observability-architecture `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|customer_email|customer_phone|customer_document|raw_request_body|privateEndpoint|productionTopology"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): tratar observabilidade como decisao arquitetural"
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
- payloads reais;
- topologia de produção;
- custos contratuais;
- endpoints privados;
- threat model aprofundado;
- arquitetura de dados da aula 657.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou observabilidade como decisão arquitetural.

Você criou contratos para jornadas, perguntas, sinais, semântica, contexto, logs, métricas, traces, cardinalidade, sampling, SLIs, SLOs, alertas, dashboards, custo, retenção e falha da telemetria. Também criou Operating Model, runbooks, game day, reports, evidence e gate.

Você comprovou que observabilidade não começa pela instalação de uma ferramenta; começa pelas jornadas e perguntas que a arquitetura precisa explicar.

Você conectou `Confirm Appointment` a sinais de negócio e técnicos, propagou contexto entre HTTP, mensagens, workers e intervenção manual, definiu convenções semânticas, protegeu cardinalidade, criou sampling orientado por risco, transformou SLO em requisito arquitetural, distribuiu orçamento de latência, criou error budget, burn-rate alerts, dashboards orientados por perguntas e runbooks acionáveis.

Você também tratou custo, retenção e falha da própria pipeline de telemetria.

A plataforma de observabilidade pode degradar, mas não deve bloquear o negócio; buffers são bounded, perdas são visíveis e sinais críticos possuem prioridade.

A próxima aula será:

```text
656 - M19.46 - Seguranca como decisao arquitetural
```

Nela, você irá aprofundar como trust boundaries, ameaças, identidade, autenticação, autorização, proteção de dados, secrets, supply chain, auditoria e resposta a incidentes influenciam a arquitetura desde o início.

Nenhum aprofundamento completo de segurança arquitetural ou de dados como decisão arquitetural foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei a jornada crítica.
- [ ] Criei perguntas operacionais.
- [ ] Defini contratos de sinais.
- [ ] Propaguei contexto.
- [ ] Controlei cardinalidade.
- [ ] Defini sampling.
- [ ] Criei SLIs e SLOs.
- [ ] Modelei error budget e alertas.
- [ ] Criei dashboards e runbooks.
- [ ] Estimei custo e retenção.
- [ ] Testei falha da telemetria.
- [ ] Executei game day e gate.

---

## Troubleshooting adicional

### O trace termina antes do consumer

Valide propagação W3C, headers da mensagem, extração do contexto e criação correta do consumer span.

### A métrica cria milhares de séries

Procure IDs, URLs brutas, mensagens de erro, tenants, releases ilimitadas ou status não normalizados.

### O SLO parece perfeito durante falha

Revise elegibilidade, ausência de tráfego, queries de good e total e tratamento de `no data`.

### O alerta dispara a cada deploy

Inclua duração, volume mínimo, release annotation e janelas múltiplas.

### O Collector aumenta a latência da API

Revise exportação assíncrona, buffer bounded, timeout, retry e prioridade de sinais.

### O custo cresce sem mudança de tráfego

Revise cardinalidade, debug logs, sampling, retenção, novos spans e queries frequentes.

### A equipe quer aprofundar autenticação e autorização

Preserve a arquitetura de segurança para a aula 656.

---

## Perguntas de revisão

1. Qual diferença entre telemetria e observabilidade?
2. Por que a jornada é uma unidade observável?
3. O que é um Signal Contract?
4. Qual diferença entre request ID, correlation ID e trace ID?
5. Quando usar logs, métricas e traces?
6. O que é cardinalidade e por que IDs não devem ser labels?
7. O que diferencia head sampling de tail sampling?
8. O que são SLI, SLO e elegibilidade?
9. O que são error budget e burn rate?
10. O que torna um alerta acionável?
11. Por que telemetria não deve bloquear o negócio?
12. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sinais produzidos versus capacidade de compreender o sistema.
2. Porque conecta impacto de negócio a várias fronteiras.
3. Contrato de propósito, owner, atributos, cardinalidade e retenção.
4. Entrada, fluxo correlacionado e jornada distribuída.
5. Eventos e decisões; agregações e tendências; causalidade distribuída.
6. Combinações de labels; IDs criam séries demais.
7. Decisão no início versus decisão após observar o resultado.
8. Indicador, objetivo em uma janela e regra do que conta.
9. Falha permitida e velocidade de consumo desse orçamento.
10. Impacto, owner, runbook e recovery.
11. Para não criar indisponibilidade adicional.
12. Segurança como decisão arquitetural.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 655 - M19.45 - Observabilidade como decisao arquitetural

- Continuei após Saga revisitada sem repetir as ferramentas do M18.
- Criei o laboratório `service-scheduling-observability-architecture`.
- Tratei observabilidade como capacidade arquitetural.
- Criei Observability Charter e mapeei `Confirm Appointment`.
- Registrei boundaries, protocolos, autoridades e owners.
- Associei perguntas operacionais a decisões.
- Criei Signal Contracts e convenções semânticas.
- Modelei contexto para HTTP, mensagens, workers e intervenção manual.
- Criei logs orientados a eventos, decisões e outcomes.
- Cataloguei métricas RED, USE e de negócio.
- Criei Cardinality Budget e Cardinality Guard.
- Proibi IDs e mensagens em metric labels.
- Criei Span Contracts e sampling por risco.
- Modelei SLIs, SLOs, orçamento de latência e error budget.
- Criei burn-rate alerts, dashboards e runbooks.
- Planejei navegação entre alerta, dashboard, trace e log.
- Criei Telemetry Cost Model, budget e retenção.
- Modelei falha da pipeline sem bloquear o negócio.
- Proibi dados sensíveis em telemetria.
- Criei Operating Model e executei game day.
- Testei jornada, cardinalidade, sampling, SLO, custo e falha.
- Criei reports, evidence e gate.
- Não antecipei segurança arquitetural completa.
- Próxima aula: Seguranca como decisao arquitetural.
```

---

## Referência técnica curta

- Observability Architecture.
- Business Journey.
- Operational Question.
- Telemetry Contract.
- Semantic Conventions.
- Context Propagation.
- Structured Logging.
- Metric Cardinality.
- Distributed Tracing.
- Head Sampling.
- Tail Sampling.
- SLI.
- SLO.
- Error Budget.
- Burn Rate.
- Actionable Alert.
- Telemetry Budget.
- Retention Policy.
- Game Day.

Regra final:

```text
Observabilidade deve ser desenhada por jornadas e decisões: Confirm Appointment possui passos, boundaries, owners, outcomes e perguntas; logs, métricas e traces usam contratos semânticos, contexto propagado, atributos permitidos, cardinalidade e retenção controladas; IDs não viram labels, sampling preserva erros, lentidão, compensações e intervenções, SLIs têm elegibilidade, SLOs têm objetivo, janela, owner e runbook, e error budgets orientam mudança; dashboards respondem perguntas, alertas são acionáveis, custo e retenção respeitam budgets, e falhas de exporters usam buffers bounded sem bloquear o negócio; o gate valida sinais, SLOs, ownership, runbooks, game day, testes e evidence, enquanto segurança fica para a aula 656 e dados para a 657.
```
