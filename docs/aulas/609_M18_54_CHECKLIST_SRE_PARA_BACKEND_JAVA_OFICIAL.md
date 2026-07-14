# 609 - M18.54 - Checklist SRE para Backend Java

## Apresentação da aula

Na aula 608, você transformou o conhecimento técnico do módulo em uma aula ensinável.

Agora você irá transformar esse mesmo conhecimento em um instrumento operacional.

O objetivo desta aula é criar um checklist SRE aplicável a serviços Java Backend antes, durante e depois da entrada em produção.

Ao longo do módulo, você trabalhou com:

```text
logs estruturados;

métricas;

tracing;

health checks;

liveness;

readiness;

SLIs;

SLOs;

error budget;

alertas;

dashboards;

profiling;

CPU;

memória;

garbage collection;

concorrência;

virtual threads;

locks;

race conditions;

deadlocks;

backpressure;

timeouts;

filas;

pools;

PostgreSQL;

runbooks;

incident response;

otimização;

rollback;

regressão.
```

Esses temas não podem permanecer apenas como conhecimento isolado.

Em um projeto real, eles precisam virar perguntas objetivas.

Exemplos:

```text
o serviço possui owner?

há SLO definido?

o readiness realmente representa aptidão para tráfego?

os logs possuem contexto sem vazar dados?

as métricas usam labels bounded?

o timeout interno respeita o deadline externo?

a fila é bounded?

o pool foi dimensionado com base no banco?

há rollback testado?

o runbook aponta para dashboards e evidências?

o shutdown encerra todos os recursos?
```

Um checklist SRE não substitui análise técnica.

Ele também não transforma uma aplicação ruim em uma aplicação confiável apenas porque caixas foram marcadas.

O checklist serve para:

- tornar riscos visíveis;
- impedir esquecimentos previsíveis;
- padronizar revisões;
- definir gates;
- exigir evidências;
- atribuir owners;
- registrar exceções;
- bloquear riscos críticos;
- apoiar auditorias;
- melhorar readiness operacional.

A pergunta central será:

```text
como avaliar
se uma aplicação Java Backend
está realmente pronta
para ser operada em produção?
```

Nesta aula, você irá criar um checklist dividido em áreas:

- ownership;
- arquitetura operacional;
- runtime Java;
- configuração;
- segurança;
- logs;
- métricas;
- tracing;
- health;
- SLI e SLO;
- alertas;
- dashboards;
- capacidade;
- concorrência;
- backpressure;
- timeouts;
- banco de dados;
- deploy;
- rollback;
- shutdown;
- incident response;
- runbooks;
- evidências;
- continuidade operacional.

Cada item deverá possuir:

- identificador;
- pergunta;
- criticidade;
- resposta esperada;
- evidência;
- owner;
- status;
- justificativa;
- exceção;
- prazo;
- gate relacionado.

Os status serão:

```text
PASS;

FAIL;

NOT_APPLICABLE;

ACCEPTED_RISK;

INCONCLUSIVE.
```

`NOT_APPLICABLE` exige justificativa.

`ACCEPTED_RISK` exige owner, aprovação e prazo.

`INCONCLUSIVE` significa que a evidência disponível não é suficiente.

A próxima aula oficial será:

```text
610 - M18.55 - Fechamento do Modulo 18
```

Por isso, esta aula não irá executar o encerramento formal do módulo.

Ela não irá:

- resumir toda a trajetória do M18;
- emitir conclusão final do módulo;
- preparar a abertura completa do M19;
- iniciar arquitetura em camadas;
- antecipar DDD ou sistemas distribuídos.

O foco permanece no checklist SRE para Backend Java.

A regra central será:

```text
nenhum item crítico
pode ser marcado como aprovado
sem evidência verificável.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
607:
Refatoracao final producao.

608:
Aula ensinavel producao.

609:
Checklist SRE para Backend Java.

610:
Fechamento do Modulo 18.

611:
Arquitetura em camadas.
```

A progressão é:

```text
refatorar;

ensinar;

operacionalizar;

fechar o módulo;

avançar para arquitetura.
```

Nesta aula:

```text
checklist operacional:
sim.

gates:
sim.

evidências:
sim.

owners:
sim.

riscos aceitos:
sim.

pontuação:
sim.

bloqueios críticos:
sim.

scripts de validação:
sim.

fechamento do M18:
não.

abertura do M19:
não.
```

O projeto de referência continuará sendo:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

O checklist será desenhado para esse projeto, mas com estrutura reaproveitável em outras APIs Java.

---

## Objetivo prático

Será criada a área:

```text
sre/backend-java-checklist
├── backend-java-sre-checklist-contract.yaml
├── backend-java-sre-checklist.yaml
├── backend-java-sre-critical-gates.yaml
├── backend-java-sre-scoring-policy.yaml
├── backend-java-sre-evidence-policy.yaml
├── backend-java-sre-risk-acceptance-policy.yaml
├── backend-java-sre-exception-policy.yaml
├── backend-java-sre-security-policy.yaml
├── backend-java-sre-data-quality-policy.yaml
├── backend-java-sre-failure-policy.yaml
├── backend-java-sre-scenarios.yaml
└── backend-java-sre-evidence.yaml

sre/backend-java-checklist/sections
├── 01-ownership.md
├── 02-runtime-java.md
├── 03-configuration.md
├── 04-security.md
├── 05-logging.md
├── 06-metrics.md
├── 07-tracing.md
├── 08-health.md
├── 09-sli-slo.md
├── 10-alerting.md
├── 11-dashboards.md
├── 12-capacity.md
├── 13-concurrency.md
├── 14-backpressure.md
├── 15-timeouts.md
├── 16-database.md
├── 17-deployment.md
├── 18-rollback.md
├── 19-shutdown.md
├── 20-incident-response.md
├── 21-runbooks.md
└── 22-continuity.md

sre/backend-java-checklist/reports
├── sre-checklist-summary-report.yaml
├── sre-checklist-critical-report.yaml
├── sre-checklist-risk-report.yaml
├── sre-checklist-evidence-report.yaml
└── backend-java-sre-gate-report.yaml
```

Scripts:

```text
scripts/sre/backend-java-checklist
├── validate-backend-java-sre-contract.ps1
├── prepare-backend-java-sre-review.ps1
├── validate-sre-ownership.ps1
├── validate-sre-runtime.ps1
├── validate-sre-configuration.ps1
├── validate-sre-security.ps1
├── validate-sre-observability.ps1
├── validate-sre-health.ps1
├── validate-sre-SLO.ps1
├── validate-sre-alerting.ps1
├── validate-sre-capacity.ps1
├── validate-sre-concurrency.ps1
├── validate-sre-backpressure.ps1
├── validate-sre-timeouts.ps1
├── validate-sre-database.ps1
├── validate-sre-deployment.ps1
├── validate-sre-rollback.ps1
├── validate-sre-shutdown.ps1
├── validate-sre-incident-readiness.ps1
├── validate-sre-runbooks.ps1
├── validate-sre-evidence.ps1
├── calculate-sre-checklist-score.ps1
├── collect-backend-java-sre-evidence.ps1
└── verify-backend-java-sre-gate.ps1
```

Ao final, você terá um checklist executável e auditável.

---

## Conceito essencial

### SRE

Site Reliability Engineering aplica princípios de engenharia à confiabilidade e operação de sistemas.

---

### Checklist operacional

Conjunto estruturado de verificações usadas para avaliar readiness e risco.

---

### Gate

Condição que precisa ser satisfeita antes de avançar.

---

### Critical gate

Gate cuja falha bloqueia produção ou continuidade de rollout.

---

### Evidência

Artefato verificável que sustenta uma resposta.

---

### Owner

Pessoa, função ou equipe responsável pelo item.

---

### Accepted risk

Risco conhecido, documentado, aprovado e com prazo.

---

### Exception

Desvio temporário de uma regra, acompanhado de justificativa e controle.

---

### Readiness operacional

Capacidade real de operar, observar, mitigar e recuperar o serviço.

---

### Score

Indicador agregado de maturidade ou cobertura.

---

### Blocking failure

Falha que impede aprovação independentemente da pontuação total.

---

### Review window

Período em que a evidência permanece válida.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\refactoring\production-final\verify-production-final-refactoring.ps1

.\scripts\teaching\production-observability-lesson\verify-teachable-production-lesson.ps1

git status

git diff --check
```

Confirme:

- aplicação funcional;
- stack disponível;
- sinais operacionais presentes;
- runbooks disponíveis;
- zero task leaks;
- zero connection leaks;
- nenhum modo lab ativo;
- nenhum segredo no repositório.

---

### 2. Criar contrato principal

Arquivo:

```text
backend-java-sre-checklist-contract.yaml
```

Conteúdo:

```yaml
backendJavaSREChecklist:
  required:
    - ownership
    - runtime
    - configuration
    - security
    - logging
    - metrics
    - tracing
    - health
    - SLI
    - SLO
    - alerting
    - dashboards
    - capacity
    - concurrency
    - backpressure
    - timeouts
    - database
    - deployment
    - rollback
    - shutdown
    - incident-response
    - runbooks
    - continuity
    - evidence

  criticalFailure:
    blocksApproval:
      true

  acceptedRisk:
    ownerAndExpiry:
      required

  nextLesson:
    code:
      M18.55
```

---

### 3. Definir formato do item

Cada item seguirá:

```yaml
id:
  SRE-LOG-001

question:
  Logs possuem campos estruturados estáveis?

criticality:
  HIGH

expected:
  PASS

evidence:
  required

owner:
  required

reviewWindow:
  90d

status:
  INCONCLUSIVE

notes:
  none
```

---

### 4. Criar criticidades

Valores:

```text
CRITICAL;

HIGH;

MEDIUM;

LOW.
```

`CRITICAL` pode bloquear produção.

`HIGH` exige correção ou risco aceito.

`MEDIUM` exige plano.

`LOW` representa melhoria recomendada.

---

### 5. Criar critical gates

Arquivo:

```text
backend-java-sre-critical-gates.yaml
```

Exemplos:

```yaml
criticalGates:
  - id: GATE-SECURITY
    requires:
      - no-credential-in-repository
      - no-sensitive-data-in-telemetry

  - id: GATE-READINESS
    requires:
      - liveness-valid
      - readiness-valid
      - shutdown-valid

  - id: GATE-RECOVERY
    requires:
      - rollback-tested
      - runbook-available
      - incident-owner-defined

  - id: GATE-DATA
    requires:
      - backup-policy
      - migration-policy
      - data-integrity-check
```

---

### 6. Revisar ownership

Perguntas:

- serviço possui owner técnico?
- existe owner operacional?
- existe canal de suporte?
- existe escalação?
- dependências possuem owners conhecidos?
- SLO possui owner?
- alertas possuem owner?
- runbooks possuem owner?
- riscos aceitos possuem aprovador?

Arquivo:

```text
sections/01-ownership.md
```

---

### 7. Criar itens de ownership

Exemplos:

```text
SRE-OWN-001:
owner técnico explícito.

SRE-OWN-002:
owner operacional explícito.

SRE-OWN-003:
escalation path documentado.

SRE-OWN-004:
SLO com owner.

SRE-OWN-005:
runbooks com owner e review date.
```

---

### 8. Revisar runtime Java

Itens:

- JDK suportado;
- versão fixa;
- flags documentadas;
- heap definido;
- container awareness;
- timezone;
- encoding;
- locale;
- crash logs;
- OOM behavior;
- JFR disponível;
- shutdown hooks;
- dependency versions;
- build reproducível.

---

### 9. Criar itens de runtime

Exemplos:

```text
SRE-JVM-001:
JDK 21 suportado e fixado.

SRE-JVM-002:
limites de memória compatíveis com container.

SRE-JVM-003:
heap não excede orçamento do processo.

SRE-JVM-004:
timezone e encoding explícitos.

SRE-JVM-005:
procedimento de JFR documentado.

SRE-JVM-006:
OOM não causa reinício infinito sem diagnóstico.
```

---

### 10. Revisar configuração

Verifique:

- configuração tipada;
- validação no startup;
- units explícitas;
- defaults seguros;
- secrets externos;
- profile lab isolado;
- feature flags documentadas;
- thresholds coerentes;
- config drift;
- rollback de configuração;
- reload policy.

---

### 11. Criar itens de configuração

Exemplos:

```text
SRE-CFG-001:
properties críticas são tipadas.

SRE-CFG-002:
threshold não excede capacity.

SRE-CFG-003:
segredos não estão em YAML.

SRE-CFG-004:
profile lab não existe em produção.

SRE-CFG-005:
mudanças de configuração são auditáveis.
```

---

### 12. Revisar segurança

Itens críticos:

- nenhum segredo no Git;
- TLS adequado;
- autenticação;
- autorização;
- least privilege;
- rotação de credenciais;
- proteção de endpoints actuator;
- logs sanitizados;
- traces sanitizados;
- evidence sanitizada;
- dependency scanning;
- imagem confiável;
- porta de laboratório ausente em produção.

---

### 13. Criar security policy

Arquivo:

```text
backend-java-sre-security-policy.yaml
```

Conteúdo:

```yaml
security:
  credential:
    repository:
      forbidden

  telemetry:
    sensitiveData:
      forbidden

  actuator:
    publicExposure:
      restricted

  labEndpoint:
    production:
      forbidden

  evidence:
    syntheticOrSanitized:
      required
```

---

### 14. Revisar logging

Itens:

- formato estruturado;
- timestamp;
- service;
- environment;
- release;
- operation;
- outcome;
- request ID;
- correlation ID;
- trace ID;
- sanitização;
- volume;
- levels;
- duplicação;
- retenção;
- busca;
- custo.

---

### 15. Criar itens de logging

Exemplos:

```text
SRE-LOG-001:
logs são estruturados.

SRE-LOG-002:
contexto é limpo após request.

SRE-LOG-003:
payload e credenciais não são registrados.

SRE-LOG-004:
erros possuem categoria bounded.

SRE-LOG-005:
eventos importantes possuem release.

SRE-LOG-006:
volume foi revisado sob carga.
```

---

### 16. Revisar métricas

Itens:

- counters corretos;
- gauges corretos;
- timers;
- histogramas;
- buckets alinhados ao SLO;
- rotas normalizadas;
- labels bounded;
- unidades;
- business metrics;
- repository metrics;
- queue metrics;
- Hikari metrics;
- JVM metrics;
- ausência de IDs.

---

### 17. Criar itens de métricas

Exemplos:

```text
SRE-MET-001:
nenhuma métrica usa ID como label.

SRE-MET-002:
HTTP usa rota normalizada.

SRE-MET-003:
timers possuem histogramas úteis.

SRE-MET-004:
fila possui utilization e oldest age.

SRE-MET-005:
pool possui active, idle, pending e acquisition.

SRE-MET-006:
CPU é correlacionada com throughput.
```

---

### 18. Revisar tracing

Itens:

- W3C Trace Context;
- inbound propagation;
- outbound propagation;
- parent-child;
- span names estáveis;
- atributos bounded;
- erro categorizado;
- baggage allowlist;
- sampling explícito;
- retenção;
- correlação com logs;
- exemplars quando suportados.

---

### 19. Criar itens de tracing

Exemplos:

```text
SRE-TRC-001:
trace hierarchy é válida.

SRE-TRC-002:
span names são estáveis.

SRE-TRC-003:
IDs de negócio não entram em atributos.

SRE-TRC-004:
logs possuem trace correlation.

SRE-TRC-005:
sampling está documentado.

SRE-TRC-006:
baggage possui allowlist.
```

---

### 20. Revisar health

Itens:

- liveness independente de banco;
- readiness representa tráfego;
- startup conhecido;
- draining altera readiness;
- probes leves;
- sem dados sensíveis;
- timeout curto;
- status coerente;
- dependências essenciais explícitas;
- rollout respeita readiness.

---

### 21. Criar itens de health

Exemplos:

```text
SRE-HLT-001:
liveness não depende de serviço externo.

SRE-HLT-002:
readiness depende apenas do essencial.

SRE-HLT-003:
draining torna readiness DOWN.

SRE-HLT-004:
probe não executa operação pesada.

SRE-HLT-005:
health não expõe detalhes internos.
```

---

### 22. Revisar SLI e SLO

Itens:

- eventos bons;
- eventos totais;
- elegibilidade;
- exclusões;
- janela;
- objetivo;
- owner;
- error budget;
- burn rate;
- volume mínimo;
- comportamento sem tráfego;
- revisão periódica;
- vínculo com release gate.

---

### 23. Criar itens de SLO

Exemplos:

```text
SRE-SLO-001:
SLI possui good e total.

SRE-SLO-002:
actuator não distorce o SLI principal.

SRE-SLO-003:
SLO possui owner e janela.

SRE-SLO-004:
error budget é calculável.

SRE-SLO-005:
burn-rate alerts usam múltiplas janelas.

SRE-SLO-006:
ausência de tráfego possui comportamento definido.
```

---

### 24. Revisar alertas

Itens:

- sintoma;
- impacto;
- owner;
- severity;
- duration;
- dashboard;
- runbook;
- recovery condition;
- volume mínimo;
- divisão segura;
- deduplicação;
- supressão controlada;
- validação em game day.

---

### 25. Criar itens de alertas

Exemplos:

```text
SRE-ALT-001:
todo alerta possui owner.

SRE-ALT-002:
todo page possui runbook.

SRE-ALT-003:
alerta possui duração.

SRE-ALT-004:
alerta possui condição de recovery.

SRE-ALT-005:
alerta foi exercitado.

SRE-ALT-006:
threshold não é arbitrário.
```

---

### 26. Revisar dashboards

Itens:

- overview;
- HTTP;
- dependências;
- SLO;
- release;
- deploy events;
- unidades;
- descrições;
- variáveis bounded;
- links para trace;
- links para runbook;
- owner question;
- ausência de painéis decorativos.

---

### 27. Revisar capacidade

Itens:

- CPU limit;
- memory limit;
- requests/limits;
- throughput baseline;
- burst profile;
- pool capacity;
- queue capacity;
- downstream capacity;
- headroom;
- scaling policy;
- throttling;
- load test;
- saturation signals.

---

### 28. Criar itens de capacidade

Exemplos:

```text
SRE-CAP-001:
capacidade baseline está documentada.

SRE-CAP-002:
burst foi testado.

SRE-CAP-003:
headroom possui justificativa.

SRE-CAP-004:
scale não ignora downstream.

SRE-CAP-005:
CPU throttling é observável.

SRE-CAP-006:
memory limit considera heap e native memory.
```

---

### 29. Revisar concorrência

Itens:

- shared state;
- invariantes;
- executor bounded;
- virtual threads;
- downstream limit;
- locks;
- atomics;
- ThreadLocal cleanup;
- cancellation;
- shutdown;
- race tests;
- deadlock prevention;
- lock ordering.

---

### 30. Criar itens de concorrência

Exemplos:

```text
SRE-CON-001:
executor não é unbounded.

SRE-CON-002:
virtual threads respeitam downstream limit.

SRE-CON-003:
ThreadLocal possui cleanup.

SRE-CON-004:
locks possuem finally.

SRE-CON-005:
race conditions críticas possuem teste.

SRE-CON-006:
lock ordering está documentado.
```

---

### 31. Revisar backpressure

Itens:

- fila bounded;
- capacity;
- utilization;
- oldest age;
- arrival rate;
- consumption rate;
- rejection;
- retry;
- load shedding;
- drain;
- shutdown;
- zero silent loss.

---

### 32. Criar itens de backpressure

Exemplos:

```text
SRE-BKP-001:
fila possui capacity explícita.

SRE-BKP-002:
rejection é observável.

SRE-BKP-003:
oldest age é monitorada.

SRE-BKP-004:
load shedding possui contrato.

SRE-BKP-005:
shutdown trata itens pendentes.

SRE-BKP-006:
não existe perda silenciosa.
```

---

### 33. Revisar timeouts

Itens:

- deadline de jornada;
- connect timeout;
- pool acquisition;
- read timeout;
- query timeout;
- lock timeout;
- queue timeout;
- Future timeout;
- cancellation;
- late completion;
- retry budget;
- backoff;
- jitter;
- idempotência.

---

### 34. Criar itens de timeout

Exemplos:

```text
SRE-TMO-001:
timeout interno é menor que externo.

SRE-TMO-002:
deadline é propagado quando aplicável.

SRE-TMO-003:
cancelamento é tratado.

SRE-TMO-004:
late completion é observável.

SRE-TMO-005:
retry cabe no budget.

SRE-TMO-006:
retry exige idempotência.
```

---

### 35. Revisar banco de dados

Itens:

- migrations;
- rollback ou forward fix;
- backup;
- restore test;
- pool;
- acquisition;
- connection leak;
- transaction duration;
- idle in transaction;
- lock wait;
- statements;
- query plan;
- indexes;
- statistics;
- vacuum;
- N+1;
- pagination;
- data integrity.

---

### 36. Criar itens de banco

Exemplos:

```text
SRE-DB-001:
migrations são versionadas.

SRE-DB-002:
restore foi testado.

SRE-DB-003:
zero connection leaks.

SRE-DB-004:
long transactions são observáveis.

SRE-DB-005:
queries críticas possuem plano revisado.

SRE-DB-006:
N+1 possui teste de regressão.

SRE-DB-007:
paginação possui ordenação estável.
```

---

### 37. Revisar deployment

Itens:

- build reproduzível;
- artifact imutável;
- versionamento;
- scan;
- migration order;
- readiness;
- canary;
- rollout;
- release annotation;
- config audit;
- smoke test;
- rollback;
- owner;
- change record.

---

### 38. Revisar rollback

Perguntas:

- versão anterior disponível?
- schema compatível?
- dados escritos são compatíveis?
- feature flags existem?
- fila possui estado conhecido?
- rollback foi testado?
- trigger está definido?
- recuperação foi validada?
- runbook está atualizado?

---

### 39. Revisar shutdown

Itens:

- draining;
- readiness down;
- novas entradas bloqueadas;
- in-flight bounded;
- fila drenada ou persistida;
- executor encerrado;
- datasource fechado;
- context cleanup;
- timeout;
- zero task leaks;
- zero connection leaks.

---

### 40. Revisar incident response

Itens:

- critérios de declaração;
- severidade;
- incident commander;
- technical lead;
- communications lead;
- scribe;
- canal;
- timeline;
- decision log;
- evidence index;
- cadence;
- mitigação;
- handoff;
- stable window;
- closure;
- postmortem.

---

### 41. Revisar runbooks

Todo runbook deve possuir:

- owner;
- review date;
- trigger;
- impacto;
- dashboards;
- queries;
- evidências;
- ações seguras;
- rollback;
- escalation;
- recovery;
- cleanup.

---

### 42. Revisar continuidade

Itens:

- backup;
- restore;
- disaster recovery;
- dependency failure;
- region failure quando aplicável;
- RTO;
- RPO;
- degraded mode;
- manual procedure;
- contact ownership;
- game day;
- postmortem follow-up.

---

### 43. Criar scoring policy

Arquivo:

```text
backend-java-sre-scoring-policy.yaml
```

Conteúdo:

```yaml
scoring:
  weights:
    CRITICAL:
      10
    HIGH:
      5
    MEDIUM:
      2
    LOW:
      1

  status:
    PASS:
      factor:
        1.0
    NOT_APPLICABLE:
      factor:
        1.0
    ACCEPTED_RISK:
      factor:
        0.5
    INCONCLUSIVE:
      factor:
        0.0
    FAIL:
      factor:
        0.0

  criticalFail:
    overall:
      blocked
```

---

### 44. Criar faixas

Exemplo:

```text
95 a 100:
READY.

85 a 94:
READY_WITH_ACTIONS.

70 a 84:
CONDITIONAL.

abaixo de 70:
NOT_READY.

qualquer critical FAIL:
BLOCKED.
```

A pontuação não substitui os critical gates.

---

### 45. Criar evidence policy

Arquivo:

```text
backend-java-sre-evidence-policy.yaml
```

Conteúdo:

```yaml
evidence:
  requiredFor:
    - CRITICAL
    - HIGH

  metadata:
    required:
      - source
      - timestamp
      - environment
      - release
      - owner
      - review-window

  rawSensitiveArtifact:
    repository:
      forbidden

  expired:
    result:
      INCONCLUSIVE
```

---

### 46. Criar risk acceptance policy

Arquivo:

```text
backend-java-sre-risk-acceptance-policy.yaml
```

Conteúdo:

```yaml
acceptedRisk:
  required:
    - item
    - reason
    - impact
    - owner
    - approver
    - compensating-control
    - expiry
    - follow-up

  CRITICAL:
    default:
      forbidden

  expired:
    status:
      FAIL
```

---

### 47. Criar exception policy

Arquivo:

```text
backend-java-sre-exception-policy.yaml
```

Conteúdo:

```yaml
exception:
  temporary:
    required

  owner:
    required

  expiry:
    required

  permanentException:
    forbidden

  renewal:
    explicitReview:
      required
```

---

### 48. Criar checklist principal

Arquivo:

```text
backend-java-sre-checklist.yaml
```

Estrutura:

```yaml
service:
  name:
    observable-orders-api

  environment:
    lab

  reviewDate:
    synthetic

sections:
  ownership:
    items:
      - SRE-OWN-001

  runtime:
    items:
      - SRE-JVM-001

  observability:
    items:
      - SRE-LOG-001
      - SRE-MET-001
      - SRE-TRC-001

summary:
  score:
    pending

  gate:
    INCONCLUSIVE
```

---

### 49. Criar cenários oficiais

Arquivo:

```text
backend-java-sre-scenarios.yaml
```

Cenários:

```text
all-critical-pass;

critical-security-fail;

critical-readiness-fail;

accepted-risk-with-owner;

accepted-risk-expired;

not-applicable-with-justification;

not-applicable-without-justification;

evidence-current;

evidence-expired;

metric-high-cardinality;

trace-sensitive-attribute;

liveness-database-dependent;

readiness-draining-valid;

unbounded-queue;

timeout-hierarchy-invalid;

database-connection-leak;

rollback-not-tested;

runbook-without-owner;

backup-without-restore-test;

score-ready;

score-conditional;

critical-fail-blocked;

final-gate-pass.
```

---

### 50. Preparar revisão

Execute:

```powershell
.\scripts\sre\backend-java-checklist\prepare-backend-java-sre-review.ps1
```

O script deve:

- validar baseline;
- identificar serviço;
- registrar versão;
- criar cópia de trabalho;
- carregar checklist;
- validar owners;
- validar paths;
- confirmar evidence directory;
- limpar resultados antigos;
- manter raw artifacts fora do Git.

---

### 51. Executar validações por área

Execute:

```powershell
.\scripts\sre\backend-java-checklist\validate-sre-ownership.ps1

.\scripts\sre\backend-java-checklist\validate-sre-runtime.ps1

.\scripts\sre\backend-java-checklist\validate-sre-configuration.ps1

.\scripts\sre\backend-java-checklist\validate-sre-security.ps1

.\scripts\sre\backend-java-checklist\validate-sre-observability.ps1

.\scripts\sre\backend-java-checklist\validate-sre-health.ps1

.\scripts\sre\backend-java-checklist\validate-sre-SLO.ps1

.\scripts\sre\backend-java-checklist\validate-sre-alerting.ps1

.\scripts\sre\backend-java-checklist\validate-sre-capacity.ps1

.\scripts\sre\backend-java-checklist\validate-sre-concurrency.ps1

.\scripts\sre\backend-java-checklist\validate-sre-backpressure.ps1

.\scripts\sre\backend-java-checklist\validate-sre-timeouts.ps1

.\scripts\sre\backend-java-checklist\validate-sre-database.ps1

.\scripts\sre\backend-java-checklist\validate-sre-deployment.ps1

.\scripts\sre\backend-java-checklist\validate-sre-rollback.ps1

.\scripts\sre\backend-java-checklist\validate-sre-shutdown.ps1

.\scripts\sre\backend-java-checklist\validate-sre-incident-readiness.ps1

.\scripts\sre\backend-java-checklist\validate-sre-runbooks.ps1
```

---

### 52. Validar evidence

Execute:

```powershell
.\scripts\sre\backend-java-checklist\validate-sre-evidence.ps1
```

Valide:

- source;
- timestamp;
- environment;
- release;
- owner;
- review window;
- sanitização;
- existência;
- coerência.

---

### 53. Calcular score

Execute:

```powershell
.\scripts\sre\backend-java-checklist\calculate-sre-checklist-score.ps1
```

O relatório precisa mostrar:

- score por seção;
- score total;
- critical failures;
- accepted risks;
- inconclusive items;
- expired evidence;
- gate status;
- actions.

---

### 54. Criar relatório resumido

Arquivo:

```text
reports/sre-checklist-summary-report.yaml
```

Exemplo:

```yaml
summary:
  score:
    92

  classification:
    READY_WITH_ACTIONS

  criticalFailures:
    0

  acceptedRisks:
    2

  inconclusiveItems:
    1

  gate:
    PASS
```

---

### 55. Criar relatório crítico

Arquivo:

```text
reports/sre-checklist-critical-report.yaml
```

Registre somente:

- critical item;
- status;
- evidence;
- owner;
- blocker;
- action;
- deadline.

---

### 56. Criar relatório de riscos

Arquivo:

```text
reports/sre-checklist-risk-report.yaml
```

Para cada risco:

- item;
- impacto;
- controle compensatório;
- owner;
- aprovador;
- validade;
- follow-up.

---

### 57. Criar gate final

O gate valida:

```text
contract;

critical gates;

score;

accepted risks;

evidence;

ownership;

security;

observability;

health;

SLO;

capacity;

concurrency;

backpressure;

timeouts;

database;

deployment;

rollback;

shutdown;

incident response;

runbooks;

continuity.
```

Status:

```text
PASS;

PASS_WITH_ACTIONS;

BLOCKED_CRITICAL;

FAIL_SCORE;

FAIL_EVIDENCE;

FAIL_RISK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 58. Coletar evidence

Arquivo:

```text
backend-java-sre-evidence.yaml
```

Campos permitidos:

- lesson;
- service;
- environment;
- release category;
- review date;
- ownership status;
- runtime status;
- configuration status;
- security status;
- logging status;
- metrics status;
- tracing status;
- health status;
- SLO status;
- alerting status;
- dashboard status;
- capacity status;
- concurrency status;
- backpressure status;
- timeout status;
- database status;
- deployment status;
- rollback status;
- shutdown status;
- incident status;
- runbook status;
- continuity status;
- critical failure count;
- accepted risk count;
- score;
- gate;
- timestamp.

Não inclua:

- secret;
- token;
- password;
- request ID;
- trace ID;
- order ID;
- customer reference;
- raw logs;
- raw traces;
- raw dumps;
- dados pessoais;
- material do fechamento do módulo.

---

### 59. Executar validação completa

Execute:

```powershell
.\scripts\sre\backend-java-checklist\validate-backend-java-sre-contract.ps1

.\scripts\sre\backend-java-checklist\prepare-backend-java-sre-review.ps1

.\scripts\sre\backend-java-checklist\validate-sre-ownership.ps1

.\scripts\sre\backend-java-checklist\validate-sre-runtime.ps1

.\scripts\sre\backend-java-checklist\validate-sre-configuration.ps1

.\scripts\sre\backend-java-checklist\validate-sre-security.ps1

.\scripts\sre\backend-java-checklist\validate-sre-observability.ps1

.\scripts\sre\backend-java-checklist\validate-sre-health.ps1

.\scripts\sre\backend-java-checklist\validate-sre-SLO.ps1

.\scripts\sre\backend-java-checklist\validate-sre-alerting.ps1

.\scripts\sre\backend-java-checklist\validate-sre-capacity.ps1

.\scripts\sre\backend-java-checklist\validate-sre-concurrency.ps1

.\scripts\sre\backend-java-checklist\validate-sre-backpressure.ps1

.\scripts\sre\backend-java-checklist\validate-sre-timeouts.ps1

.\scripts\sre\backend-java-checklist\validate-sre-database.ps1

.\scripts\sre\backend-java-checklist\validate-sre-deployment.ps1

.\scripts\sre\backend-java-checklist\validate-sre-rollback.ps1

.\scripts\sre\backend-java-checklist\validate-sre-shutdown.ps1

.\scripts\sre\backend-java-checklist\validate-sre-incident-readiness.ps1

.\scripts\sre\backend-java-checklist\validate-sre-runbooks.ps1

.\scripts\sre\backend-java-checklist\validate-sre-evidence.ps1

.\scripts\sre\backend-java-checklist\calculate-sre-checklist-score.ps1

.\scripts\sre\backend-java-checklist\collect-backend-java-sre-evidence.ps1

.\scripts\sre\backend-java-checklist\verify-backend-java-sre-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 60. Encerrar a revisão SRE

Confirme:

- todos os critical items revisados;
- owners definidos;
- evidence válida;
- riscos aceitos aprovados;
- riscos expirados convertidos em falha;
- nenhum `NOT_APPLICABLE` sem justificativa;
- nenhuma evidência sensível;
- score calculado;
- gate emitido;
- ações registradas;
- fechamento do módulo não antecipado.

---

## Entendendo o que foi feito

### O conhecimento virou checklist

Temas do módulo passaram a ser perguntas operacionais verificáveis.

### A aprovação ganhou evidence

Caixas deixaram de ser marcadas por opinião.

### A criticidade ganhou peso

Itens críticos passaram a bloquear independentemente do score.

### O risco aceito ganhou prazo

Exceções deixaram de ser permanentes e invisíveis.

### Ownership ganhou responsabilidade

SLOs, alertas, runbooks e ações passaram a ter responsáveis.

### Observabilidade ganhou gate

Logs, métricas e traces passaram a ser avaliados como contratos.

### Capacidade ganhou contexto

CPU, memória, pools, filas e downstream passaram a ser revisados juntos.

### Concorrência ganhou proteção

Limits, invariantes, cancellation e shutdown passaram a fazer parte do readiness.

### Banco ganhou continuidade

Migrations, restore, pool, plans e leaks passaram a ser itens explícitos.

### Incident response ganhou prontidão

Papéis, timeline, runbooks e recovery passaram a ser avaliados antes do incidente.

### O próximo passo ganhou fronteira

O fechamento formal do módulo fica para a aula 610.

---

## Erros comuns importantes

### Marcar PASS sem evidence

O checklist perde valor.

### Usar score para esconder critical fail

O serviço continua bloqueado.

### Usar `NOT_APPLICABLE` sem justificativa

O risco pode estar sendo ignorado.

### Aceitar risco sem prazo

A exceção vira regra permanente.

### Criar checklist enorme sem owners

Ninguém executa as ações.

### Avaliar observabilidade apenas pela existência da ferramenta

Sinais podem estar incorretos.

### Avaliar capacity apenas por CPU média

Fila, pool e p99 podem estar saturados.

### Aprovar rollback não testado

O plano pode falhar no incidente.

### Aprovar backup sem restore

A continuidade não foi comprovada.

### Transformar a aula em fechamento do módulo

O encerramento pertence à aula 610.

---

## Comandos úteis

### Preparar revisão

```powershell
.\scripts\sre\backend-java-checklist\prepare-backend-java-sre-review.ps1
```

### Validar observabilidade

```powershell
.\scripts\sre\backend-java-checklist\validate-sre-observability.ps1
```

### Validar banco

```powershell
.\scripts\sre\backend-java-checklist\validate-sre-database.ps1
```

### Calcular score

```powershell
.\scripts\sre\backend-java-checklist\calculate-sre-checklist-score.ps1
```

### Verificar gate

```powershell
.\scripts\sre\backend-java-checklist\verify-backend-java-sre-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Contrato

Crie status, criticidades e formato de item.

### Parte 2 — Ownership

Defina owners, canais e escalation.

### Parte 3 — Observabilidade

Revise logs, métricas, traces e health.

### Parte 4 — SLO e alertas

Valide indicadores, objetivos e runbooks.

### Parte 5 — Capacidade

Revise CPU, memória, pools, filas e downstream.

### Parte 6 — Concorrência

Valide limits, locks, cleanup e shutdown.

### Parte 7 — Timeouts e banco

Revise deadlines, queries, migrations e restore.

### Parte 8 — Deploy e rollback

Exija artifact, readiness, change record e reversão.

### Parte 9 — Incidentes

Valide papéis, timeline, evidence e recovery.

### Parte 10 — Gate

Calcule score sem ignorar falhas críticas.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 608 e ponte para a aula 610 foram preservadas;
- a baseline final da aplicação permanece aprovada;
- contrato, checklist, gates, scoring, policies, cenários, reports e scripts foram criados;
- o checklist possui ownership, runtime, configuration, security, observability, health, SLO, alerting, capacity, concurrency, backpressure, timeouts, database, deployment, rollback, shutdown, incident response, runbooks e continuity;
- cada item possui ID, pergunta, criticidade, expected, evidence, owner, review window, status e notes;
- status PASS, FAIL, NOT_APPLICABLE, ACCEPTED_RISK e INCONCLUSIVE foram definidos;
- criticidades CRITICAL, HIGH, MEDIUM e LOW foram definidas;
- critical failures bloqueiam aprovação;
- `NOT_APPLICABLE` exige justificativa;
- accepted risk exige owner, aprovador, controle compensatório e prazo;
- evidence expirada torna o item inconclusivo;
- ownership técnico e operacional foram avaliados;
- JDK, heap, container awareness, timezone e JFR foram avaliados;
- configuração tipada, thresholds e secrets foram avaliados;
- logs, métricas e traces foram avaliados por contrato;
- cardinalidade e sanitização foram avaliadas;
- liveness, readiness, draining e probes leves foram avaliados;
- SLIs, SLOs, error budget e burn rate foram avaliados;
- alertas possuem owner, duração, dashboard, runbook e recovery;
- dashboards possuem perguntas e variáveis bounded;
- capacity inclui CPU, memória, pool, fila, burst e downstream;
- concorrência inclui limits, locks, virtual threads, cleanup e invariantes;
- backpressure inclui capacity, utilization, oldest age e rejection;
- timeouts incluem hierarchy, deadline, cancellation e retries;
- banco inclui migrations, restore, pool, leaks, plans, N+1 e paginação;
- deployment, rollback e shutdown foram avaliados;
- incident response, runbooks e continuity foram avaliados;
- score foi calculado sem ignorar critical gates;
- evidence foi sanitizada;
- nenhum segredo, dado pessoal ou raw artifact foi commitado;
- o fechamento do módulo e a abertura do M19 não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/sre/backend-java-checklist `
  scripts/sre/backend-java-checklist `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestIdValue|traceIdValue|spanIdValue|rawLog|rawTrace|heapDump|personalPhone|privateEmail|moduleClosure|layeredArchitecture"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): criar checklist SRE para Backend Java"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- IDs reais;
- raw logs;
- raw traces;
- raw dumps;
- evidências sensíveis;
- fechamento do módulo;
- conteúdo de arquitetura em camadas.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou o conteúdo do módulo em um checklist operacional.

Você criou critérios para:

```text
ownership;

runtime Java;

configuração;

segurança;

logging;

métricas;

tracing;

health;

SLI;

SLO;

alerting;

dashboards;

capacidade;

concorrência;

backpressure;

timeouts;

banco;

deployment;

rollback;

shutdown;

incidentes;

runbooks;

continuidade.
```

Você comprovou que um checklist útil não é uma coleção de caixas; que itens críticos bloqueiam; que evidence precisa ser atual e sanitizada; que riscos aceitos possuem owner e prazo; que score não substitui gates; que observabilidade, capacidade e recovery precisam ser avaliadas antes da produção; e que uma aplicação só está pronta quando também pode ser diagnosticada, mitigada e recuperada.

A próxima aula será:

```text
610 - M18.55 - Fechamento do Modulo 18
```

Nela, você irá consolidar as competências adquiridas, revisar os artefatos finais do módulo, registrar os resultados e preparar a transição para o próximo módulo.

Nenhum fechamento formal do M18, balanço final ou abertura de arquitetura em camadas foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini formato, status e criticidade.
- [ ] Criei critical gates.
- [ ] Exigi evidence e owner.
- [ ] Avaliei observabilidade e SLO.
- [ ] Avaliei capacity e concorrência.
- [ ] Avaliei banco, deploy e rollback.
- [ ] Avaliei incident response e continuity.
- [ ] Calculei score sem ignorar blockers.

---

## Troubleshooting adicional

### O checklist possui muitos itens inconclusivos

A equipe ainda não possui evidence suficiente.

### O score está alto com critical fail

O gate deve permanecer bloqueado.

### Muitos itens usam `NOT_APPLICABLE`

Revise se o status está sendo usado para evitar trabalho.

### Risco aceito venceu

Converta o item para `FAIL` até nova aprovação.

### Evidence não possui release

A correlação com a versão fica limitada.

### Logs existem, mas não são pesquisáveis

O item de logging não deve receber PASS.

### Backup existe, mas restore nunca foi testado

A continuidade permanece falha.

### Rollback existe apenas em documento

Execute teste controlado.

### O checklist vira burocracia

Remova itens sem decisão ou risco associado.

### O documento começa a fechar o módulo

Preserve o encerramento para a aula 610.

---

## Perguntas de revisão

1. Para que serve um checklist SRE?
2. O que é critical gate?
3. Por que score não substitui gate?
4. Quando usar `INCONCLUSIVE`?
5. Quando usar `NOT_APPLICABLE`?
6. O que um accepted risk precisa possuir?
7. Por que evidence possui review window?
8. O que ownership precisa cobrir?
9. O que avaliar no runtime Java?
10. O que avaliar em logs?
11. O que avaliar em métricas?
12. O que avaliar em tracing?
13. Qual diferença entre liveness e readiness?
14. O que um SLO precisa possuir?
15. O que um alerta precisa possuir?
16. O que avaliar em backpressure?
17. Por que backup não basta?
18. O que comprova rollback?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Avaliar readiness e risco.
2. Condição crítica obrigatória.
3. Falha crítica bloqueia independentemente da média.
4. Quando evidence é insuficiente.
5. Quando o item realmente não se aplica e há justificativa.
6. Owner, aprovador, controle, prazo e follow-up.
7. Evidência envelhece.
8. Serviço, operação, SLO, alertas e runbooks.
9. JDK, memória, flags, timezone e diagnóstico.
10. Estrutura, contexto, sanitização, volume e retenção.
11. Semântica, labels, buckets, unidades e séries.
12. Propagação, spans, atributos, sampling e correlação.
13. Processo vivo versus aptidão para tráfego.
14. SLI, objetivo, janela, owner e budget.
15. Sintoma, impacto, owner, duração, dashboard, runbook e recovery.
16. Fila bounded, capacity, age, rejection e drain.
17. Restore precisa ser comprovado.
18. Teste controlado e recuperação da baseline.
19. Fechamento do Modulo 18.
20. Fechamento do Modulo 18.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 609 - M18.54 - Checklist SRE para Backend Java

- Transformei os aprendizados do módulo em checklist operacional.
- Defini formato de item, status e criticidade.
- Criei critical gates e política de scoring.
- Exigi evidence, owner e review window.
- Criei políticas de accepted risk e exceção.
- Avaliei ownership, runtime Java e configuração.
- Avaliei segurança, logs, métricas e tracing.
- Avaliei health, liveness e readiness.
- Avaliei SLIs, SLOs, error budget e alertas.
- Avaliei dashboards, capacity e headroom.
- Avaliei concorrência, virtual threads, locks e cleanup.
- Avaliei backpressure, filas bounded e rejection.
- Avaliei timeout hierarchy, deadline, cancellation e retry.
- Avaliei migrations, restore, pool, queries e connection leaks.
- Avaliei deploy, rollback e graceful shutdown.
- Avaliei incident response, runbooks e continuidade.
- Calculei score sem ignorar falhas críticas.
- Registrei riscos aceitos com prazo.
- Coletei evidence sanitizada.
- Não antecipei o fechamento do módulo ou o M19.
- Próxima aula: Fechamento do Modulo 18.
```

---

## Referência técnica curta

- Site Reliability Engineering.
- Production readiness reviews.
- Operational checklists.
- Service ownership.
- SLI and SLO governance.
- Capacity planning.
- Incident readiness.
- Rollback readiness.
- Disaster recovery.
- Evidence-based operational gates.

Regra final:

```text
o checklist SRE para Backend Java precisa avaliar readiness operacional com evidência e responsabilidade: cada item possui ID, pergunta, criticidade, resultado esperado, evidence, owner, review window e status, critical failures bloqueiam independentemente do score, NOT_APPLICABLE exige justificativa, ACCEPTED_RISK exige impacto, owner, aprovador, controle compensatório, prazo e follow-up, e evidence expirada torna a conclusão inconclusiva; ownership, runtime Java, configuração, segurança, logs, métricas, tracing, health, SLI, SLO, alertas, dashboards, capacidade, concorrência, backpressure, timeouts, banco, deploy, rollback, shutdown, incident response, runbooks e continuidade são avaliados por contratos verificáveis, sem IDs, secrets ou raw artifacts; backup exige restore testado, rollback exige exercício controlado, filas e executors permanecem bounded, readiness representa aptidão real para tráfego, e score nunca mascara falha crítica; o gate final registra ações e riscos, enquanto o fechamento formal do módulo permanece reservado à aula 610.
```
