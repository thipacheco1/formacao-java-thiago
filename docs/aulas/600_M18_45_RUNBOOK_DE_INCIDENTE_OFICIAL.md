# 600 - M18.45 - Runbook de incidente

## Apresentação da aula

Nas aulas anteriores, você construiu capacidade técnica para investigar incidentes reais de produção.

Você trabalhou com:

```text
logs estruturados;

métricas;

tracing distribuído;

SLO e error budget;

alertas;

profiling;

thread dumps;

deadlocks;

backpressure;

timeouts;

memory leaks;

CPU alta;

banco lento.
```

Na aula 599, você aprendeu a separar uma lentidão de banco em:

```text
espera no pool;

aquisição de conexão;

lock wait;

execução;

I/O;

transferência;

mapping;

serialização.
```

Agora surge uma nova necessidade.

Saber diagnosticar individualmente cada tecnologia ainda não garante uma resposta coordenada durante um incidente.

Quando um sistema crítico falha, alertas disparam, usuários percebem erro, equipes investigam, alguém propõe rollback ou restart, evidências precisam ser coletadas, decisões registradas e o impacto comunicado.

A pergunta central desta aula será:

```text
como transformar
conhecimento técnico

em uma resposta
operacional,
coordenada,
segura
e auditável
a incidentes?
```

Um **runbook de incidente** é um procedimento operacional executável.

Ele orienta:

- quando declarar incidente;
- como classificar severidade;
- quem coordena;
- quem investiga;
- quem comunica;
- quais evidências coletar;
- quais ações são seguras;
- quando mitigar;
- quando fazer rollback;
- como validar recuperação;
- quando encerrar;
- como realizar handoff;
- como preparar o postmortem.

Um runbook não deve ser apenas um documento longo guardado em uma pasta.

Ele precisa ser:

- encontrável;
- objetivo;
- testado;
- versionado;
- atualizado;
- seguro;
- executável;
- adaptável;
- conhecido pelo time;
- útil sob pressão.

Durante um incidente, urgência, informação incompleta, ruído e múltiplas hipóteses reduzem a capacidade de decisão. O runbook limita improvisações.

Ele não elimina julgamento humano.

Ele cria limites, papéis e checkpoints para que o julgamento seja aplicado com mais segurança.

Nesta aula, você irá estruturar:

- critérios de declaração;
- níveis de severidade;
- papéis operacionais;
- incident commander;
- technical lead;
- communications lead;
- scribe;
- subject matter experts;
- canal de incidente;
- timeline;
- registro de decisões;
- atualização periódica;
- coleta de evidências;
- mitigação;
- rollback;
- feature flag;
- traffic shifting;
- restart;
- scale out;
- load shedding;
- isolamento de dependência;
- critérios de recuperação;
- critérios de encerramento;
- handoff;
- follow-up;
- postmortem sem culpabilização;
- action items;
- exercícios de simulação.

O laboratório construirá um runbook transversal para uma API Java em produção.

Ele integrará os conhecimentos do módulo sem implementar ainda o projeto final da API observável.

A próxima aula oficial será:

```text
601 - M18.46 - Projeto API observavel parte 1
```

Por isso, esta aula não irá:

- criar a nova API do projeto;
- implementar endpoints do projeto final;
- montar dashboards finais da API;
- instrumentar o código definitivo;
- criar o tracing definitivo do projeto;
- configurar o pipeline final;
- iniciar a implementação da parte 1;
- antecipar as partes 2 e 3.

A aula 600 prepara o modelo operacional que será aplicado no projeto a partir da aula 601.

A regra central será:

```text
durante um incidente,
primeiro estabilize
e coordene;

depois investigue
a causa profunda.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
598:
CPU high diagnostico.

599:
Banco lento diagnostico.

600:
Runbook de incidente.

601:
Projeto API observavel parte 1.
```

A progressão é:

```text
diagnosticar componentes;

correlacionar sinais;

coordenar resposta;

aplicar tudo em um projeto.
```

Nesta aula:

```text
declaração de incidente:
sim.

severidade:
sim.

papéis:
sim.

incident commander:
sim.

timeline:
sim.

comunicação:
sim.

mitigação:
sim.

rollback:
sim.

coleta de evidência:
sim.

handoff:
sim.

postmortem:
sim.

game day:
sim.

implementação da API observável:
não.
```

Você reutilizará:

- SLO;
- error budget;
- alertas;
- logs;
- métricas;
- traces;
- dashboards;
- thread dumps;
- heap dumps;
- JFR;
- perfis;
- consultas PostgreSQL;
- runbooks especializados;
- rollback;
- feature flags;
- deployment;
- segurança operacional.

O runbook precisa preservar:

- segurança;
- clareza;
- owner;
- versionamento;
- rastreabilidade;
- autorização;
- evidência;
- comunicação;
- rollback;
- validação;
- aprendizado.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
operations/incident-runbook
├── incident-runbook-contract.yaml
├── incident-severity-policy.yaml
├── incident-role-policy.yaml
├── incident-declaration-policy.yaml
├── incident-communication-policy.yaml
├── incident-evidence-policy.yaml
├── incident-mitigation-policy.yaml
├── incident-change-control-policy.yaml
├── incident-handoff-policy.yaml
├── incident-recovery-policy.yaml
├── incident-closure-policy.yaml
├── incident-postmortem-policy.yaml
├── incident-security-policy.yaml
├── incident-data-quality-policy.yaml
├── incident-failure-policy.yaml
├── incident-scenarios.yaml
└── incident-evidence.yaml

operations/incident-runbook/templates
├── incident-channel-template.md
├── incident-timeline-template.md
├── incident-status-update-template.md
├── incident-decision-log-template.md
├── incident-handoff-template.md
├── incident-closure-template.md
├── postmortem-template.md
└── action-item-template.md

operations/incident-runbook/src/main/java
└── br/com/formacao/operations/incident
    ├── IncidentSeverity.java
    ├── IncidentStatus.java
    ├── IncidentRole.java
    ├── IncidentEventType.java
    ├── IncidentEvent.java
    ├── IncidentTimeline.java
    ├── IncidentDecision.java
    ├── IncidentDecisionLog.java
    ├── IncidentSnapshot.java
    ├── IncidentValidator.java
    ├── IncidentRunbookGate.java
    └── IncidentRunbookDemo.java

operations/incident-runbook/src/test/java
└── br/com/formacao/operations/incident
    ├── IncidentSeverityTest.java
    ├── IncidentTimelineTest.java
    ├── IncidentDecisionLogTest.java
    ├── IncidentDeclarationTest.java
    ├── IncidentHandoffTest.java
    ├── IncidentClosureTest.java
    ├── IncidentRunbookGateTest.java
    └── IncidentRunbookContractTest.java

operations/incident-runbook/reports
├── incident-readiness-report.yaml
├── incident-simulation-report.yaml
├── incident-role-report.yaml
├── incident-communication-report.yaml
├── incident-mitigation-report.yaml
├── incident-handoff-report.yaml
├── incident-postmortem-report.yaml
└── incident-runbook-gate-report.yaml

scripts/operations/incident-runbook
├── validate-incident-runbook-contract.ps1
├── validate-incident-severity.ps1
├── validate-incident-roles.ps1
├── simulate-sev1-incident.ps1
├── simulate-sev2-incident.ps1
├── validate-incident-timeline.ps1
├── validate-status-updates.ps1
├── validate-decision-log.ps1
├── validate-evidence-policy.ps1
├── validate-mitigation-policy.ps1
├── validate-change-control.ps1
├── validate-incident-handoff.ps1
├── validate-incident-recovery.ps1
├── validate-incident-closure.ps1
├── validate-postmortem-template.ps1
├── run-incident-game-day.ps1
├── scan-incident-output.ps1
├── collect-incident-evidence.ps1
└── verify-incident-readiness.ps1

docs/operations/incident-runbook
├── INCIDENT_RESPONSE_OVERVIEW.md
├── INCIDENT_SEVERITY_GUIDE.md
├── INCIDENT_ROLES_GUIDE.md
├── INCIDENT_COMMUNICATION_GUIDE.md
├── INCIDENT_EVIDENCE_GUIDE.md
├── INCIDENT_MITIGATION_GUIDE.md
├── INCIDENT_CHANGE_CONTROL.md
├── INCIDENT_HANDOFF_GUIDE.md
├── INCIDENT_RECOVERY_AND_CLOSURE.md
├── BLAMELESS_POSTMORTEM_GUIDE.md
├── INCIDENT_GAME_DAY_GUIDE.md
├── INCIDENT_RUNBOOK_TEST_MATRIX.md
└── INCIDENT_RUNBOOK_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato operacional;

severidades;

papéis;

declaração;

timeline;

comunicação;

decision log;

evidências;

mitigação;

change control;

recovery;

closure;

handoff;

postmortem;

game day;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### Incidente

Evento que reduz ou ameaça a disponibilidade, segurança, integridade ou desempenho de um serviço.

---

### Severidade

Classificação do impacto e da urgência.

---

### Incident commander

Pessoa responsável por coordenar a resposta, organizar prioridades e manter clareza operacional.

---

### Technical lead

Pessoa responsável por coordenar a investigação e execução técnica.

---

### Communications lead

Pessoa responsável por atualizações internas e externas aprovadas.

---

### Scribe

Pessoa responsável por registrar timeline, hipóteses, decisões e ações.

---

### Subject matter expert

Especialista chamado para uma área específica.

---

### Mitigação

Ação destinada a reduzir impacto antes da correção definitiva.

---

### Remediação

Mudança que corrige a causa ou vulnerabilidade identificada.

---

### Recovery

Retorno controlado do serviço a uma condição saudável.

---

### Closure

Encerramento formal do incidente após validação de estabilidade.

---

### Handoff

Transferência estruturada de responsabilidade entre pessoas ou turnos.

---

### Postmortem

Análise posterior do incidente orientada a aprendizado e melhoria sistêmica.

---

### Game day

Simulação planejada para testar pessoas, processos, ferramentas e runbooks.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Confirme:

- aula 599 validada;
- zero connection leaks;
- runbooks especializados disponíveis;
- dados de simulação sintéticos;
- nenhum incidente real será criado;
- canais e contatos serão representados por categorias;
- nenhum segredo será versionado.

---

### 2. Criar contrato

Arquivo:

```text
incident-runbook-contract.yaml
```

Conteúdo:

```yaml
incidentRunbook:
  required:
    - declaration
    - severity
    - roles
    - communication
    - timeline
    - decision-log
    - evidence
    - mitigation
    - change-control
    - recovery
    - closure
    - handoff
    - postmortem
    - testing

  owner:
    required

  review:
    periodic:
      required

  emergencyChange:
    auditable:
      required

  secrets:
    forbidden

  nextLesson:
    code:
      M18.46
```

---

### 3. Criar severidades

Arquivo:

```text
incident-severity-policy.yaml
```

Exemplo:

```yaml
severities:
  SEV1:
    impact:
      critical

    examples:
      - total-service-unavailable
      - confirmed-data-integrity-risk
      - critical-security-impact

    response:
      immediate

    roles:
      incidentCommander:
        required

      communicationsLead:
        required

    updateCadence:
      maximum:
        15m

  SEV2:
    impact:
      major

    examples:
      - significant-error-rate
      - critical-flow-degraded
      - regional-impact

    updateCadence:
      maximum:
        30m

  SEV3:
    impact:
      limited

    examples:
      - partial-degradation
      - workaround-available
```

Os thresholds reais pertencem ao contexto da organização.

---

### 4. Criar enum de severidade

```java
public enum IncidentSeverity {
    SEV1,
    SEV2,
    SEV3,
    SEV4
}
```

A classificação considera usuários afetados, duração, criticidade, impacto financeiro, integridade, segurança, região, workaround e risco de expansão.

---

### 5. Criar policy de declaração

Arquivo:

```text
incident-declaration-policy.yaml
```

Conteúdo:

```yaml
declaration:
  triggers:
    - SLO-breach
    - sustained-error-rate
    - critical-alert
    - confirmed-user-impact
    - data-integrity-risk
    - security-risk
    - dependency-wide-failure

  uncertainty:
    declareEarlyWhenPotentialImpactHigh:
      true

  declarationRequiresRootCause:
    false

  requiredFields:
    - incident-id-category
    - start-time
    - severity
    - affected-service
    - current-impact
    - commander
    - channel
```

Não espere causa raiz para declarar.

---

### 6. Definir papéis

Arquivo:

```text
incident-role-policy.yaml
```

Conteúdo:

```yaml
roles:
  incidentCommander:
    responsibilities:
      - coordinate
      - prioritize
      - assign
      - approve-major-actions
      - maintain-operational-focus

  technicalLead:
    responsibilities:
      - lead-diagnosis
      - coordinate-technical-actions
      - report-findings

  communicationsLead:
    responsibilities:
      - internal-updates
      - external-approved-updates
      - stakeholder-alignment

  scribe:
    responsibilities:
      - timeline
      - decision-log
      - action-log
      - evidence-index

  subjectMatterExpert:
    responsibilities:
      - domain-analysis
      - bounded-recommendation
```

Uma pessoa pode acumular papéis em incidentes menores, mas as responsabilidades continuam explícitas.

---

### 7. Evitar commander investigando tudo

O incident commander deve preservar visão global.

Se ele mergulha em logs por longos períodos:

- coordenação se perde;
- atualizações atrasam;
- tarefas duplicam;
- mudanças concorrentes aparecem;
- severidade pode ficar desatualizada.

Em equipes pequenas, declare quando o commander também atua tecnicamente e estabeleça checkpoints frequentes.

---

### 8. Criar status do incidente

```java
public enum IncidentStatus {
    DECLARED,
    INVESTIGATING,
    MITIGATING,
    MONITORING,
    RECOVERED,
    CLOSED
}
```

Transições precisam ser explícitas.

---

### 9. Criar timeline

```java
public record IncidentEvent(
        Instant occurredAt,
        IncidentEventType type,
        String actorRole,
        String summary,
        String evidenceCategory) {
}
```

```java
public final class IncidentTimeline {

    private final List<IncidentEvent> events =
            new ArrayList<>();

    public synchronized void append(
            IncidentEvent event) {
        events.add(
                Objects.requireNonNull(event));
    }

    public synchronized List<IncidentEvent>
    snapshot() {
        return List.copyOf(events);
    }
}
```

Use horários absolutos com timezone definido.

Registre também quando um evento foi descoberto, caso seja diferente de quando ocorreu.

---

### 10. Criar template de timeline

Arquivo:

```text
incident-timeline-template.md
```

Conteúdo:

```markdown
# Timeline

| Horário | Tipo | Papel | Evento | Evidência |
|---|---|---|---|---|
| 00:00 | Detecção | Monitoramento | Alerta disparado | dashboard-category |
| 00:03 | Declaração | Commander | Incidente declarado | incident-record |
| 00:08 | Hipótese | Technical lead | Pool saturado | pool-metrics |
| 00:12 | Mitigação | Operator | Tráfego reduzido | deployment-event |
```

---

### 11. Criar decision log

```java
public record IncidentDecision(
        Instant decidedAt,
        String decision,
        String rationale,
        String approverRole,
        String expectedOutcome,
        String rollbackTrigger) {
}
```

Decisões importantes:

- rollback;
- restart;
- failover;
- scale;
- disable feature;
- shed load;
- terminate session;
- pause consumer;
- isolate dependency;
- defer deployment.

---

### 12. Criar comunicação

Arquivo:

```text
incident-communication-policy.yaml
```

Conteúdo:

```yaml
communication:
  required:
    - current-impact
    - affected-capability
    - mitigation-status
    - next-update-time
    - known-unknowns

  avoid:
    - unverified-root-cause
    - sensitive-detail
    - blame
    - unsupported-ETA
    - raw-log
    - raw-stack

  cadence:
    severityBased:
      required

  missedUpdate:
    action:
      send-brief-status
```

Uma atualização curta e honesta é melhor do que silêncio.

---

### 13. Criar template de atualização

Arquivo:

```text
incident-status-update-template.md
```

```markdown
## Atualização

- Severidade:
- Status:
- Impacto atual:
- Serviços afetados:
- Mitigação em andamento:
- Resultado observado:
- Riscos:
- Próxima ação:
- Próxima atualização:
```

Não prometa horário de resolução sem evidência.

---

### 14. Criar canal de incidente

O canal concentra comando, timeline, hipóteses, responsáveis, decisões, links, status e handoff.

Evite investigações importantes espalhadas em conversas privadas.

Informações sensíveis permanecem em sistemas autorizados, referenciadas por categoria.

---

### 15. Criar policy de evidência

Arquivo:

```text
incident-evidence-policy.yaml
```

Conteúdo:

```yaml
evidence:
  collect:
    - alerts
    - dashboards
    - logs
    - traces
    - deployment-events
    - configuration-changes
    - thread-dumps
    - heap-dumps-when-authorized
    - JFR-when-authorized
    - database-activity
    - dependency-status

  preserve:
    - timestamp
    - environment
    - release
    - service
    - collection-method
    - collector-role

  rawSensitiveArtifact:
    repository:
      forbidden

  chainOfCustody:
    requiredForSensitiveArtifact:
      true
```

---

### 16. Criar evidence index

Arquivo:

```text
incident-evidence.yaml
```

Exemplo sanitizado:

```yaml
incident:
  severity:
    SEV2

  service:
    orders-api

evidence:
  - category:
      metrics-snapshot

    collectedAt:
      synthetic

    release:
      lab

    locationCategory:
      approved-observability-platform

  - category:
      thread-dump

    authorization:
      approved

    repository:
      excluded
```

---

### 17. Criar triagem inicial

Nos primeiros minutos, determine impacto, início, mudança recente, serviços afetados, tendência, SLO violado, riscos de dados ou segurança, mitigação conhecida e responsável pela coordenação.

Não tente responder todas as causas antes de estabilizar a operação.

---

### 18. Criar snapshot inicial

```java
public record IncidentSnapshot(
        IncidentSeverity severity,
        IncidentStatus status,
        Instant startedAt,
        String affectedService,
        String impactCategory,
        String releaseCategory,
        String mitigationCategory,
        String nextUpdateCategory) {
}
```

Use categorias em artefatos versionados.

---

### 19. Consultar mudanças recentes

Verifique:

- deploy;
- feature flag;
- configuração;
- segredo rotacionado;
- migration;
- mudança de infraestrutura;
- alteração de dependência;
- aumento de tráfego;
- mudança de quota;
- certificado;
- DNS;
- regra de firewall.

Correlação temporal não prova causalidade, mas orienta hipóteses.

---

### 20. Criar policy de mitigação

Arquivo:

```text
incident-mitigation-policy.yaml
```

Conteúdo:

```yaml
mitigation:
  priorities:
    - protect-data
    - reduce-user-impact
    - stop-expansion
    - preserve-evidence
    - restore-service

  options:
    - rollback
    - feature-flag-disable
    - traffic-shift
    - scale
    - load-shedding
    - dependency-isolation
    - restart
    - queue-pause
    - read-only-mode

  reversibleFirst:
    preferred

  verifyAfterAction:
    required

  multipleSimultaneousChanges:
    avoid:
      true
```

---

### 21. Diferenciar mitigação e correção

Mitigação:

```text
desligar feature;

reduzir tráfego;

rollback;

reiniciar instância;

pausar consumer.
```

Correção:

```text
remover memory leak;

corrigir query;

eliminar deadlock;

ajustar timeout hierarchy;

corrigir race condition.
```

Mitigação reduz impacto.

Correção remove causa.

---

### 22. Criar change control

Arquivo:

```text
incident-change-control-policy.yaml
```

Conteúdo:

```yaml
emergencyChange:
  required:
    - owner
    - approver
    - timestamp
    - rationale
    - expected-signal
    - rollback-plan
    - rollback-trigger

  executeOneMajorChangeAtATime:
    preferred

  validate:
    beforeNextChange:
      required

  undocumentedProductionChange:
    forbidden
```

---

### 23. Criar template de decisão

Arquivo:

```text
incident-decision-log-template.md
```

```markdown
## Decisão

- Horário:
- Decisão:
- Responsável:
- Aprovador:
- Evidência:
- Resultado esperado:
- Risco:
- Plano de rollback:
- Trigger de rollback:
- Resultado observado:
```

---

### 24. Definir rollback

Antes do rollback, valide versão anterior, schema, migrations, flags, contratos, dados já escritos, capacidade, duração e impacto adicional.

Rollback de código não reverte automaticamente dados.

---

### 25. Definir restart

Restart pode recuperar deadlock, leak, estado local ou conexão quebrada, mas também apagar evidência, criar cold start, redistribuir carga, perder trabalho e ocultar a causa.

Colete evidência mínima antes, quando seguro.

---

### 26. Definir scale out

Scale out ajuda quando a carga cresceu e dependências suportam mais concorrência; pode piorar banco saturado, limites compartilhados, locks globais, stampede, filas e incidentes de dados.

---

### 27. Definir load shedding

Load shedding protege o núcleo do serviço.

Pode incluir:

- rejeitar baixa prioridade;
- limitar endpoints caros;
- desativar relatórios;
- usar resposta degradada;
- adiar tarefas;
- limitar tenants;
- suspender processamento não crítico.

Toda rejeição precisa ser observável.

---

### 28. Criar hipótese operacional

Formato:

```text
sinal observado;

hipótese;

evidência necessária;

experimento seguro;

resultado esperado;

critério de descarte.
```

Exemplo:

```text
sinal:
pending HikariCP alto.

hipótese:
conexões retidas por transações longas.

evidência:
active, idle, activity, xact age.

ação:
coletar métricas e sessões.

descarte:
pending alto com transações curtas
e banco saudável.
```

---

### 29. Evitar investigação paralela sem owner

Cada linha de investigação precisa de:

- owner;
- objetivo;
- prazo de atualização;
- evidência;
- resultado;
- status.

Isso evita cinco pessoas verificando o mesmo dashboard enquanto outra área fica sem análise.

---

### 30. Criar matriz por sintoma

Exemplo:

```text
erro 5xx:
logs,
traces,
deploy,
dependências.

latência alta:
pool,
CPU,
GC,
banco,
fila,
downstream.

OOM:
heap,
live set,
histogram,
dump autorizado.

CPU alta:
quota,
hot threads,
dumps,
JFR.

banco lento:
pending,
activity,
locks,
statements,
plan.

consumer lag:
arrival,
consumption,
rebalances,
downstream.
```

---

### 31. Criar criteria de escalation

Escale quando severidade ou impacto aumentarem, houver risco de dados ou segurança, faltar conhecimento ou autorização, a mitigação falhar, uma dependência externa for afetada ou ocorrer troca de turno.

---

### 32. Criar policy de handoff

Arquivo:

```text
incident-handoff-policy.yaml
```

Conteúdo:

```yaml
handoff:
  required:
    - current-severity
    - current-status
    - impact
    - timeline-summary
    - actions-completed
    - actions-in-progress
    - hypotheses
    - rejected-hypotheses
    - evidence-index
    - risks
    - next-update
    - owners

  verbalOnly:
    forbidden

  outgoingCommander:
    confirmAcceptance:
      required
```

---

### 33. Criar template de handoff

Arquivo:

```text
incident-handoff-template.md
```

```markdown
# Handoff

- Severidade:
- Status:
- Impacto:
- Início:
- Commander atual:
- Novo commander:
- Mitigação ativa:
- Mudanças executadas:
- Hipóteses abertas:
- Hipóteses descartadas:
- Riscos:
- Evidências:
- Próximas ações:
- Próxima atualização:
```

---

### 34. Criar recovery policy

Arquivo:

```text
incident-recovery-policy.yaml
```

Conteúdo:

```yaml
recovery:
  verify:
    - user-impact-reduced
    - error-rate-recovered
    - latency-recovered
    - saturation-recovered
    - backlog-draining
    - dependency-stable
    - data-integrity-checked
    - no-new-critical-alert

  monitoringWindow:
    required

  removeMitigationImmediately:
    forbidden

  rollbackMitigation:
    gradual:
      preferred
```

---

### 35. Diferenciar recovered e closed

`RECOVERED` significa:

- impacto controlado;
- serviço saudável;
- sinais em recuperação;
- monitoramento reforçado.

`CLOSED` significa:

- janela de estabilidade concluída;
- riscos conhecidos registrados;
- timeline mínima completa;
- owners definidos;
- follow-ups abertos;
- comunicação final enviada.

Não feche no primeiro minuto verde.

---

### 36. Criar closure policy

Arquivo:

```text
incident-closure-policy.yaml
```

Conteúdo:

```yaml
closure:
  required:
    - recovered-status
    - stable-window
    - final-impact
    - mitigation-state
    - outstanding-risk
    - follow-up-owner
    - final-communication
    - postmortem-decision

  rootCauseRequiredBeforeClosure:
    false

  unknownRootCause:
    document:
      required
```

A causa raiz pode exigir investigação posterior.

---

### 37. Criar template de encerramento

Arquivo:

```text
incident-closure-template.md
```

```markdown
# Encerramento

- Horário de recuperação:
- Horário de encerramento:
- Duração:
- Impacto final:
- Serviços afetados:
- Mitigação aplicada:
- Estado atual:
- Riscos pendentes:
- Causa conhecida:
- Causa ainda desconhecida:
- Follow-ups:
- Postmortem:
```

---

### 38. Criar postmortem policy

Arquivo:

```text
incident-postmortem-policy.yaml
```

Conteúdo:

```yaml
postmortem:
  requiredFor:
    - SEV1
    - SEV2
    - repeated-SEV3
    - data-integrity-event
    - security-relevant-event

  blameless:
    required

  include:
    - impact
    - timeline
    - detection
    - response
    - contributing-factors
    - root-cause-when-known
    - what-worked
    - what-failed
    - action-items

  individualBlame:
    forbidden

  actionItem:
    ownerAndDueDate:
      required
```

---

### 39. Entender blameless

Blameless não significa ausência de responsabilidade.

Significa investigar:

- contexto;
- incentivos;
- ferramentas;
- processo;
- documentação;
- sinais;
- decisões razoáveis com informação disponível;
- condições sistêmicas.

A pergunta muda de:

```text
quem errou?
```

para:

```text
por que o sistema
permitiu que esse erro
produzisse impacto?
```

---

### 40. Criar postmortem template

Arquivo:

```text
postmortem-template.md
```

Seções:

```text
resumo;

impacto;

detecção;

timeline;

resposta;

causa;

fatores contribuintes;

mitigação;

recuperação;

o que funcionou;

o que falhou;

onde tivemos sorte;

action items;

owners;

datas.
```

---

### 41. Criar action items

Um action item precisa ser específico, mensurável, priorizado, rastreável, vinculado a uma falha e possuir owner e prazo.

Evite:

```text
ter mais cuidado;

monitorar melhor;

melhorar comunicação.
```

Prefira:

```text
adicionar alerta de pending HikariCP
com owner,
threshold validado,
runbook
e prazo.
```

---

### 42. Criar validator

```java
public final class IncidentValidator {

    public List<String> validate(
            IncidentSnapshot snapshot,
            List<IncidentEvent> timeline,
            List<IncidentDecision> decisions) {

        List<String> violations =
                new ArrayList<>();

        if (snapshot.severity() == null) {
            violations.add(
                    "severity-missing");
        }

        if (timeline.isEmpty()) {
            violations.add(
                    "timeline-empty");
        }

        if (snapshot.status()
                == IncidentStatus.CLOSED
                && snapshot.mitigationCategory()
                        == null) {
            violations.add(
                    "closure-without-mitigation-state");
        }

        return List.copyOf(violations);
    }
}
```

---

### 43. Criar gate

```java
public final class IncidentRunbookGate {

    public boolean approved(
            IncidentReadiness readiness) {

        return readiness.contractValid()
                && readiness.rolesValidated()
                && readiness.communicationValidated()
                && readiness.handoffValidated()
                && readiness.simulationPassed()
                && readiness.securityValidated();
    }
}
```

---

### 44. Simular SEV1

Script:

```text
simulate-sev1-incident.ps1
```

Cenário sintético:

```text
orders-api:
erro 5xx crescente.

latência:
alta.

Hikari pending:
alto.

PostgreSQL:
lock wait.

deploy recente:
sim.
```

Objetivos:

- declarar;
- nomear commander;
- abrir timeline;
- atribuir investigação;
- comunicar impacto;
- coletar evidence;
- executar mitigação;
- validar recuperação;
- encerrar;
- gerar follow-up.

---

### 45. Simular SEV2

Script:

```text
simulate-sev2-incident.ps1
```

Cenário:

```text
consumer lag crescente;

serviço disponível;

processamento atrasado;

downstream lento;

sem perda confirmada.
```

Valide severidade, cadence, mitigação e handoff.

---

### 46. Criar policy de segurança

Arquivo:

```text
incident-security-policy.yaml
```

Conteúdo:

```yaml
security:
  channel:
    secret:
      forbidden

  evidence:
    rawSensitiveArtifact:
      approvedStorageOnly

  communication:
    personalData:
      forbidden

    credential:
      forbidden

    exploitDetail:
      restricted

  command:
    destructiveAction:
      authorization:
        required

  access:
    leastPrivilege:
      required
```

---

### 47. Criar data quality policy

Arquivo:

```text
incident-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unverifiedClaim:
    label:
      hypothesis

  missingTimestamp:
    action:
      mark-incomplete

  estimatedImpact:
    label:
      estimated

  conflictingEvidence:
    preserve:
      required

  unknown:
    acceptableWhenExplicit:
      true

  rewrittenTimelineWithoutSource:
    forbidden
```

---

### 48. Criar failure policy

Arquivo:

```text
incident-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  noCommanderForSEV1:
    action:
      fail-readiness

  noTimeline:
    action:
      fail-readiness

  destructiveActionWithoutAuthorization:
    action:
      reject

  missedCommunicationCadence:
    action:
      flag

  handoffVerbalOnly:
    action:
      reject

  closureWithoutStableWindow:
    action:
      reject

  projectAPIImplementation:
    deferredToLesson601
```

---

### 49. Criar cenários oficiais

Arquivo:

```text
incident-scenarios.yaml
```

Cenários:

```text
SEV1-total-outage;

SEV2-major-degradation;

SEV3-limited-impact;

severity-upgrade;

severity-downgrade;

commander-assignment;

technical-lead-assignment;

communication-cadence;

missed-status-update;

timeline-ordering;

decision-with-rollback;

unsafe-change-rejected;

rollback-success;

restart-after-evidence;

scale-out-safe;

scale-out-worsens-database;

load-shedding;

dependency-isolation;

handoff-between-shifts;

recovered-monitoring-window;

closure-with-unknown-root-cause;

blameless-postmortem;

action-item-with-owner;

game-day-complete.
```

Cada cenário registra:

- severity;
- impact;
- roles;
- timeline;
- decisions;
- communication;
- evidence;
- mitigation;
- recovery;
- closure;
- result.

---

### 50. Criar game day

Script:

```text
run-incident-game-day.ps1
```

O exercício deve:

1. escolher cenário;
2. ocultar parte da informação;
3. iniciar relógio;
4. disparar alertas sintéticos;
5. observar declaração;
6. validar papéis;
7. medir tempo até mitigação;
8. registrar comunicação;
9. introduzir mudança de contexto;
10. exigir handoff;
11. validar recovery;
12. realizar debrief.

---

### 51. Medir readiness

Métricas de simulação:

- time to declare;
- time to assign commander;
- time to first status update;
- time to mitigation;
- time to recovery;
- cadence adherence;
- decision log completeness;
- evidence completeness;
- handoff completeness;
- action item quality.

Não transforme pessoas em ranking.

As métricas avaliam o sistema de resposta.

---

### 52. Criar readiness report

Arquivo:

```text
incident-readiness-report.yaml
```

Exemplo:

```yaml
readiness:
  contract:
    valid:
      true

  roles:
    assigned:
      true

  declaration:
    withinTarget:
      true

  communication:
    cadenceMet:
      true

  handoff:
    complete:
      true

  security:
    valid:
      true

  result:
    PASS
```

---

### 53. Criar troubleshooting

Arquivo:

```text
INCIDENT_RUNBOOK_TROUBLESHOOTING.md
```

Inclua:

- ninguém declara o incidente;
- severidade fica indefinida;
- commander investiga e para de coordenar;
- canal vira ruído;
- timeline fica incompleta;
- duas mudanças são executadas juntas;
- rollback não é possível;
- comunicação promete ETA;
- evidence sensível é anexada;
- handoff ocorre apenas por voz;
- incidente fecha cedo;
- postmortem procura culpado;
- action items não possuem owner;
- game day mede pessoas;
- implementação da aula 601 é antecipada.

---

### 54. Criar matriz de testes

Arquivo:

```text
INCIDENT_RUNBOOK_TEST_MATRIX.md
```

Cenários:

- declaration;
- severity;
- role assignment;
- commander conflict;
- timeline;
- decision log;
- status cadence;
- sensitive communication;
- evidence index;
- rollback;
- restart;
- scale;
- shedding;
- emergency change;
- escalation;
- handoff;
- recovery;
- stable window;
- closure;
- unknown root cause;
- postmortem;
- action item;
- game day;
- security;
- evidence.

---

### 55. Criar gate operacional

O gate valida:

- contrato;
- severidade;
- declaração;
- papéis;
- timeline;
- comunicação;
- evidence;
- mitigação;
- change control;
- handoff;
- recovery;
- closure;
- postmortem;
- game day;
- segurança.

Status:

```text
PASS;

FAIL_DECLARATION;

FAIL_SEVERITY;

FAIL_ROLES;

FAIL_TIMELINE;

FAIL_COMMUNICATION;

FAIL_EVIDENCE;

FAIL_MITIGATION;

FAIL_CHANGE_CONTROL;

FAIL_HANDOFF;

FAIL_RECOVERY;

FAIL_CLOSURE;

FAIL_POSTMORTEM;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 56. Coletar evidence

Script:

```text
collect-incident-evidence.ps1
```

Campos permitidos:

- lesson;
- environment category;
- scenario;
- severity;
- role status;
- declaration status;
- communication status;
- timeline status;
- evidence status;
- mitigation status;
- handoff status;
- recovery status;
- closure status;
- postmortem status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- contatos pessoais;
- telefone;
- e-mail privado;
- credenciais;
- tokens;
- payload;
- dados de cliente;
- IDs reais de incidente;
- artefatos brutos;
- implementação da API observável da aula 601.

---

### 57. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\operations\incident-runbook\validate-incident-runbook-contract.ps1

.\scripts\operations\incident-runbook\validate-incident-severity.ps1

.\scripts\operations\incident-runbook\validate-incident-roles.ps1

.\scripts\operations\incident-runbook\simulate-sev1-incident.ps1

.\scripts\operations\incident-runbook\simulate-sev2-incident.ps1

.\scripts\operations\incident-runbook\validate-incident-timeline.ps1

.\scripts\operations\incident-runbook\validate-status-updates.ps1

.\scripts\operations\incident-runbook\validate-decision-log.ps1

.\scripts\operations\incident-runbook\validate-evidence-policy.ps1

.\scripts\operations\incident-runbook\validate-mitigation-policy.ps1

.\scripts\operations\incident-runbook\validate-change-control.ps1

.\scripts\operations\incident-runbook\validate-incident-handoff.ps1

.\scripts\operations\incident-runbook\validate-incident-recovery.ps1

.\scripts\operations\incident-runbook\validate-incident-closure.ps1

.\scripts\operations\incident-runbook\validate-postmortem-template.ps1

.\scripts\operations\incident-runbook\run-incident-game-day.ps1

.\scripts\operations\incident-runbook\scan-incident-output.ps1

.\scripts\operations\incident-runbook\collect-incident-evidence.ps1

.\scripts\operations\incident-runbook\verify-incident-readiness.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- severidades validadas;
- declaração sem exigir causa raiz;
- papéis atribuídos;
- timeline completa;
- communication cadence aprovada;
- decision log aprovado;
- evidence sanitizada;
- mitigação reversível avaliada;
- change control aprovado;
- handoff completo;
- recovery validada;
- stable window validada;
- closure aprovada;
- postmortem blameless validado;
- action items com owner;
- game day aprovado;
- segurança aprovada;
- projeto da aula 601 não antecipado.

---

### 58. Encerrar o laboratório

Confirme:

- nenhum incidente real aberto;
- canais sintéticos encerrados;
- timelines salvas;
- decision logs completos;
- artefatos sensíveis ausentes;
- ações destrutivas não executadas;
- relatórios sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/incident-runbook `
  -Recurse `
  -Force
```

---

## Entendendo o que foi feito

### Diagnóstico ganhou coordenação

Conhecimentos técnicos passaram a fazer parte de uma resposta organizada.

### Severidade ganhou critérios

Urgência deixou de depender apenas de percepção individual.

### Papéis ganharam responsabilidades

Coordenação, investigação, comunicação e registro foram separados.

### Timeline ganhou rastreabilidade

Eventos, hipóteses, decisões e ações passaram a ser reconstruíveis.

### Comunicação ganhou cadence

Stakeholders passaram a receber impacto, status, ação e próxima atualização.

### Evidência ganhou segurança

Artefatos sensíveis passaram a seguir autorização, armazenamento e retenção.

### Mitigação ganhou prioridade

Redução do impacto passou a vir antes da causa raiz definitiva.

### Change control ganhou auditoria

Mudanças emergenciais passaram a ter owner, risco, aprovação e rollback.

### Handoff ganhou contrato

Trocas de turno deixaram de depender apenas de conversa verbal.

### Closure ganhou estabilidade

O incidente deixou de ser encerrado no primeiro sinal verde.

### Postmortem ganhou aprendizado

A análise passou a buscar fatores sistêmicos e ações verificáveis.

### A próxima aula ganhou fronteira

A aula 601 iniciará o Projeto API observável parte 1.

---

## Erros comuns importantes

### Esperar causa raiz para declarar

O impacto pode crescer enquanto a equipe ainda procura explicação.

### Não nomear commander

As decisões ficam concorrentes e sem prioridade clara.

### Commander executar toda investigação

A coordenação e a comunicação desaparecem.

### Alterar várias coisas ao mesmo tempo

Fica difícil saber qual ação ajudou ou piorou.

### Prometer ETA sem evidência

A confiança é prejudicada quando a previsão falha.

### Reiniciar antes de coletar qualquer evidência

A recuperação pode apagar o estado necessário ao diagnóstico.

### Escalar sem revisar dependências

Mais instâncias podem sobrecarregar banco ou downstream.

### Fechar ao primeiro dashboard verde

Filas, retries e erros tardios ainda podem reaparecer.

### Fazer postmortem culpabilizador

Problemas sistêmicos deixam de ser discutidos.

### Criar action item genérico

A melhoria não se torna verificável.

---

## Comandos úteis

### Simular SEV1

```powershell
.\scripts\operations\incident-runbook\simulate-sev1-incident.ps1
```

### Validar timeline

```powershell
.\scripts\operations\incident-runbook\validate-incident-timeline.ps1
```

### Validar comunicação

```powershell
.\scripts\operations\incident-runbook\validate-status-updates.ps1
```

### Executar game day

```powershell
.\scripts\operations\incident-runbook\run-incident-game-day.ps1
```

### Verificar readiness

```powershell
.\scripts\operations\incident-runbook\verify-incident-readiness.ps1
```

---

## Exercício guiado

### Parte 1 — Declaração

Declare o cenário sem esperar causa raiz.

### Parte 2 — Severidade

Classifique impacto, risco e urgência.

### Parte 3 — Papéis

Atribua commander, technical lead, communications e scribe.

### Parte 4 — Timeline

Registre fatos, hipóteses, decisões e ações.

### Parte 5 — Comunicação

Envie atualizações dentro da cadence.

### Parte 6 — Evidência

Colete apenas artefatos autorizados.

### Parte 7 — Mitigação

Escolha ação reversível e defina rollback.

### Parte 8 — Handoff

Transfira responsabilidade por escrito.

### Parte 9 — Recovery e closure

Valide estabilidade antes do encerramento.

### Parte 10 — Postmortem

Crie action items com owner e prazo.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 599 e ponte para a aula 601 foram preservadas;
- incidente, severidade, commander, technical lead, communications lead, scribe, mitigação, recovery, closure, handoff, postmortem e game day foram definidos;
- contrato, policies, templates e cenários foram criados;
- declaração não depende de causa raiz;
- severidades possuem impacto, exemplos, response e cadence;
- papéis possuem responsabilidades explícitas;
- timeline registra fatos, hipóteses, decisões e evidence;
- decision log inclui rationale, approver, expected outcome e rollback trigger;
- comunicação inclui impacto, status, mitigação e próxima atualização;
- informações sensíveis não entram no canal ou no Git;
- triagem inicial cobre impacto, início, mudança recente, SLO, dados e segurança;
- linhas de investigação possuem owner;
- mitigação prioriza dados, impacto, expansão e restauração;
- mudanças emergenciais possuem change control;
- rollback considera schema, mensagens e dados;
- restart, scale e load shedding possuem critérios e riscos;
- escalation e handoff foram estruturados;
- recovery valida erros, latência, saturação, backlog, dependências e integridade;
- closure exige stable window e follow-ups;
- postmortem é blameless e gera action items verificáveis;
- game day mede o sistema de resposta, não pessoas;
- matriz, troubleshooting, gate, segurança e evidence estão presentes;
- nenhum contato, segredo, dado pessoal ou artefato bruto foi commitado;
- o Projeto API observável parte 1 não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/operations/incident-runbook `
  scripts/operations/incident-runbook `
  docs/operations/incident-runbook `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|requestId|personalPhone|privateEmail|realIncidentId|rawHeapDump|rawJfr|rawProfile|productionCredential"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar runbook de incidente"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- contatos pessoais;
- IDs reais;
- payloads;
- artefatos brutos;
- comandos destrutivos;
- implementação do projeto;
- material da aula 601.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou diagnóstico técnico em resposta operacional.

Você trabalhou com:

```text
declaração;

severidade;

incident commander;

technical lead;

communications lead;

scribe;

timeline;

decision log;

evidence;

mitigação;

change control;

rollback;

restart;

scale;

load shedding;

handoff;

recovery;

closure;

postmortem;

game day.
```

Você comprovou que incidente pode ser declarado antes da causa raiz; que severidade depende do impacto; que commander coordena em vez de investigar tudo; que timeline e decision log preservam contexto; que comunicação precisa de cadence e honestidade; que mitigação reduz impacto antes da correção definitiva; que mudanças emergenciais precisam de rollback e auditoria; que recovery exige janela de estabilidade; e que postmortem deve gerar aprendizado sistêmico.

A próxima aula será:

```text
601 - M18.46 - Projeto API observavel parte 1
```

Nela, você irá iniciar o projeto prático que integra logs, métricas, tracing, health, readiness, SLOs, alertas e padrões operacionais em uma API Java observável.

Nenhuma implementação da API observável, endpoint do projeto, dashboard definitivo, instrumentação final ou estrutura das partes 2 e 3 foi criada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini critérios de declaração.
- [ ] Classifiquei severidade.
- [ ] Atribuí papéis.
- [ ] Criei timeline e decision log.
- [ ] Defini cadence de comunicação.
- [ ] Estruturei mitigação e rollback.
- [ ] Validei handoff e stable window.
- [ ] Executei game day sem dados sensíveis.

---

## Troubleshooting adicional

### Ninguém quer declarar

A política deve permitir declaração antecipada quando o impacto potencial é alto.

### Duas pessoas comandam

Defina um commander e registre a transferência de responsabilidade.

### Canal tem mensagens demais

Use papéis, threads de investigação e resumos periódicos.

### Timeline ficou atrasada

Atribua um scribe e use templates.

### Mudança não melhorou o sistema

Execute rollback conforme o trigger registrado.

### Comunicação está sem novidade

Envie impacto atual, ação em andamento e próxima atualização.

### Handoff perdeu contexto

Use o template e exija aceite do novo commander.

### Serviço ficou verde e voltou a falhar

A stable window foi curta ou sinais importantes não foram validados.

### Postmortem virou julgamento

Redirecione para contexto, barreiras, processo e fatores contribuintes.

### O laboratório começou a criar endpoints

Preserve a implementação para a aula 601.

---

## Perguntas de revisão

1. O que é um incidente?
2. O que é severidade?
3. Qual é o papel do incident commander?
4. Qual é o papel do technical lead?
5. Qual é o papel do communications lead?
6. Qual é o papel do scribe?
7. O que é mitigação?
8. Qual diferença entre mitigação e correção?
9. Para que serve a timeline?
10. Para que serve o decision log?
11. Por que declarar antes da causa raiz?
12. O que é change control emergencial?
13. O que precisa existir antes de rollback?
14. Quando scale out pode piorar?
15. O que é handoff?
16. Qual diferença entre recovered e closed?
17. O que é postmortem blameless?
18. O que é game day?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Evento com impacto ou risco ao serviço.
2. Classificação de impacto e urgência.
3. Coordenar a resposta.
4. Liderar a investigação técnica.
5. Comunicar status aprovado.
6. Registrar timeline e decisões.
7. Reduzir impacto.
8. Uma estabiliza; a outra remove a causa.
9. Reconstruir fatos e ações.
10. Registrar decisão, razão e rollback.
11. Porque a coordenação não depende da causa.
12. Mudança urgente, autorizada e auditável.
13. Compatibilidade, risco, plano e trigger.
14. Quando a dependência compartilhada já está saturada.
15. Transferência estruturada de responsabilidade.
16. Recuperação versus encerramento formal.
17. Análise sistêmica sem culpabilização.
18. Simulação controlada.
19. Projeto API observável parte 1.
20. Projeto API observável parte 1.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 600 - M18.45 - Runbook de incidente

- Continuei após Banco lento diagnóstico.
- Defini incidente, severidade e critérios de declaração.
- Criei papéis de commander, technical lead, communications lead, scribe e SME.
- Estruturei timeline, decision log e evidence index.
- Criei cadence e template de comunicação.
- Defini triagem inicial e linhas de investigação com owner.
- Diferenciei mitigação e correção.
- Estruturei rollback, restart, scale, load shedding e dependency isolation.
- Criei change control emergencial.
- Estruturei escalation e handoff.
- Defini recovery, stable window e closure.
- Criei postmortem blameless e action items verificáveis.
- Executei simulações SEV1 e SEV2.
- Criei game day e readiness metrics.
- Validei segurança e evidence sanitizada.
- Não antecipei a implementação do projeto.
- Próxima aula: Projeto API observável parte 1.
```

---

## Referência técnica curta

- Incident response.
- Incident severity.
- Incident commander.
- Operational communication.
- Decision logs.
- Emergency change control.
- Recovery and closure.
- Incident handoff.
- Blameless postmortems.
- Game days.

Regra final:

```text
um runbook de incidente precisa transformar sinais técnicos em coordenação executável: todo incidente possui critérios de declaração, severidade, commander, technical lead, communications lead, scribe, canal, timeline, decision log, evidence index, cadence, mitigação, change control, recovery, closure e handoff, sem exigir causa raiz antes da declaração; a resposta prioriza proteção de dados, redução do impacto, contenção da expansão, preservação de evidência e restauração, enquanto rollback, restart, scale, load shedding e isolamento de dependência possuem owner, aprovação, resultado esperado, risco e trigger de reversão; recovered exige sinais saudáveis e monitoring window, closed exige estabilidade, comunicação final e follow-ups, postmortems são blameless e geram action items específicos com owner e prazo, game days avaliam o sistema de resposta e nenhum segredo, contato pessoal ou artefato bruto é versionado; a implementação da API observável começa somente na aula 601.
```
