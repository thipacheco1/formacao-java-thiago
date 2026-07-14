# 604 - M18.49 - Revisao producao parte 1

## Apresentação da aula

Você concluiu o projeto API observável nas aulas 601, 602 e 603.

O projeto reuniu:

```text
API funcional;

logs estruturados;

request ID;

correlation ID;

métricas;

health;

liveness;

readiness;

tracing;

Prometheus;

Grafana;

SLIs;

SLOs;

error budget;

alertas;

degradação controlada;

profiling;

otimização;

rollback;

regressão.
```

Agora começa uma revisão técnica dividida em duas partes oficiais:

```text
604:
Revisao producao parte 1.

605:
Revisao producao parte 2.

606:
Prova pratica producao.
```

A revisão não existe para repetir cada aula palavra por palavra.

Ela existe para consolidar decisões.

Em produção, o conhecimento precisa aparecer como capacidade de responder perguntas.

Exemplos:

```text
qual sinal devo abrir primeiro?

esse log possui contexto suficiente?

essa métrica cria cardinalidade?

o health check representa liveness ou readiness?

o trace mostra a jornada correta?

o SLI mede experiência real?

esse alerta exige ação humana?

qual evidência comprova a hipótese?

essa mudança melhora o sintoma
ou apenas esconde o problema?
```

A parte 1 irá revisar a fundação observável e operacional.

O foco será:

- mentalidade de produção;
- logs estruturados;
- níveis de log;
- contexto;
- sanitização;
- métricas;
- cardinalidade;
- counters;
- gauges;
- timers;
- histogramas;
- percentis;
- Prometheus;
- Grafana;
- tracing;
- spans;
- propagação;
- correlação entre sinais;
- health;
- liveness;
- readiness;
- SLIs;
- SLOs;
- error budgets;
- burn rates;
- alertas;
- dashboards;
- deployment e release como contexto;
- evidências operacionais.

A parte 2, aula 605, irá revisar principalmente:

- profiling;
- CPU;
- memória;
- concorrência;
- race conditions;
- deadlocks;
- virtual threads;
- locks;
- backpressure;
- timeouts;
- banco lento;
- runbooks;
- incidentes;
- otimização;
- projeto consolidado.

Portanto, esta aula não irá transformar a revisão em uma nova aula completa de deadlocks, memory leaks, CPU alta, banco lento ou incident response.

Esses temas podem aparecer apenas em perguntas de correlação, sem aprofundamento que pertence à parte 2.

A prova prática também não será antecipada.

Você não receberá nesta aula o enunciado, os critérios completos ou a solução da aula 606.

A regra central será:

```text
produção exige
sinais confiáveis,
contexto suficiente
e decisões verificáveis.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
603:
Projeto API observavel parte 3 otimizacao.

604:
Revisao producao parte 1.

605:
Revisao producao parte 2.

606:
Prova pratica producao.
```

A progressão agora é:

```text
construir;

integrar;

otimizar;

revisar;

avaliar.
```

Nesta aula:

```text
logs:
revisão completa.

métricas:
revisão completa.

tracing:
revisão completa.

health:
revisão completa.

SLOs:
revisão completa.

alertas:
revisão completa.

dashboards:
revisão completa.

CPU:
somente correlação.

memória:
somente correlação.

concorrência:
somente correlação.

incidentes:
somente referência operacional.

prova prática:
não antecipar.
```

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

Nenhuma nova feature principal será criada.

Você irá revisar, inspecionar, responder, corrigir inconsistências e executar checkpoints.

---

## Objetivo prático

Será criada uma área de revisão:

```text
reviews/production-part-1
├── production-review-part1-contract.yaml
├── production-review-logging-checklist.yaml
├── production-review-metrics-checklist.yaml
├── production-review-tracing-checklist.yaml
├── production-review-health-checklist.yaml
├── production-review-sli-slo-checklist.yaml
├── production-review-alerting-checklist.yaml
├── production-review-dashboard-checklist.yaml
├── production-review-security-policy.yaml
├── production-review-data-quality-policy.yaml
├── production-review-failure-policy.yaml
├── production-review-scenarios.yaml
└── production-review-evidence.yaml

reviews/production-part-1/questions
├── logging-review.md
├── metrics-review.md
├── tracing-review.md
├── health-review.md
├── SLI-SLO-review.md
├── alerting-review.md
└── dashboard-review.md

reviews/production-part-1/reports
├── logging-review-report.yaml
├── metrics-review-report.yaml
├── tracing-review-report.yaml
├── health-review-report.yaml
├── SLI-SLO-review-report.yaml
├── alerting-review-report.yaml
├── dashboard-review-report.yaml
└── production-review-part1-gate-report.yaml

scripts/reviews/production-part-1
├── validate-production-review-part1-contract.ps1
├── inspect-structured-logs.ps1
├── inspect-metric-cardinality.ps1
├── inspect-histograms.ps1
├── inspect-trace-propagation.ps1
├── inspect-trace-log-correlation.ps1
├── inspect-health-groups.ps1
├── inspect-SLI-eligibility.ps1
├── inspect-SLO-and-error-budget.ps1
├── inspect-alert-rules.ps1
├── inspect-dashboards.ps1
├── run-production-review-part1-scenarios.ps1
├── collect-production-review-part1-evidence.ps1
└── verify-production-review-part1.ps1
```

Ao final, você terá:

```text
checklists;

perguntas de revisão;

cenários;

relatórios;

correções;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### Observabilidade

Capacidade de inferir o estado interno de um sistema a partir de seus sinais externos.

---

### Telemetria

Dados produzidos pelo sistema para observação.

---

### Sinal

Log, métrica, trace, evento, health status ou dado operacional.

---

### Contexto

Informação necessária para interpretar um sinal.

---

### Correlação

Ligação entre sinais da mesma jornada, operação, release ou incidente.

---

### Cardinalidade

Quantidade de combinações distintas de labels ou atributos.

---

### Percentil

Valor abaixo do qual determinada proporção das observações se encontra.

---

### Histogram

Distribuição das observações em buckets.

---

### Exemplar

Referência de uma observação de métrica para um trace relacionado.

---

### SLI

Métrica formal usada para avaliar o comportamento do serviço.

---

### SLO

Objetivo definido para um SLI em uma janela.

---

### Error budget

Proporção de falha permitida pelo SLO.

---

### Burn rate

Velocidade de consumo do error budget.

---

### Actionable alert

Alerta que representa impacto ou risco relevante e possui ação operacional associada.

---

## Mão na massa guiada

### 1. Validar a baseline do projeto

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part3-baseline.ps1

git status

git diff --check
```

Confirme:

- API funcional;
- logs estruturados;
- métricas disponíveis;
- traces exportados;
- dashboards provisionados;
- SLO calculável;
- alertas válidos;
- zero task leaks;
- zero connection leaks;
- nenhum modo de degradação ativo.

---

### 2. Criar contrato da revisão

Arquivo:

```text
production-review-part1-contract.yaml
```

Conteúdo:

```yaml
productionReviewPart1:
  required:
    - logging
    - metrics
    - tracing
    - health
    - SLI
    - SLO
    - error-budget
    - alerting
    - dashboards
    - security
    - evidence

  mode:
    revision:
      true

  newMajorFeature:
    forbidden

  nextLesson:
    code:
      M18.50
```

---

### 3. Revisar logs estruturados

Um log operacional útil deve responder:

```text
quando?

qual serviço?

qual ambiente?

qual release?

qual operação?

qual outcome?

qual contexto?

qual duração?

qual erro categorizado?
```

Campos comuns:

```text
timestamp;

level;

service;

environment;

release;

operation;

outcome;

duration;

requestId;

correlationId;

traceId;

spanId.
```

Nem todo evento precisa de todos os campos.

Mas eventos da mesma categoria devem manter contrato estável.

---

### 4. Revisar níveis de log

Use:

```text
TRACE:
detalhe temporário e extremamente fino.

DEBUG:
diagnóstico técnico controlado.

INFO:
transições operacionais normais relevantes.

WARN:
condição anormal ou degradação recuperável.

ERROR:
falha que impede ou compromete uma operação.
```

Erros de validação esperados não devem necessariamente virar `ERROR`.

Uma regra de domínio recusada pode ser:

```text
INFO
ou
WARN,
```

dependendo do contrato e da frequência.

---

### 5. Revisar duplicação

Exemplo ruim:

```text
controller:
pedido iniciado.

service:
pedido iniciado.

repository:
pedido iniciado.

repository:
pedido concluído.

service:
pedido concluído.

controller:
pedido concluído.
```

Isso aumenta volume sem necessariamente aumentar informação.

Prefira eventos com responsabilidades claras:

```text
request.completed;

order.create.completed;

repository.operation.completed;

event.publish.completed.
```

---

### 6. Revisar sanitização

Nunca registrar:

- password;
- token;
- cookie;
- authorization header;
- segredo;
- payload completo;
- dados pessoais;
- SQL com parâmetros;
- cartão;
- documento;
- endereço;
- mensagem bruta de exception sem revisão.

Revisar também:

- quebra de linha;
- log injection;
- tamanho máximo;
- caracteres de controle;
- headers recebidos;
- correlation ID inválido.

---

### 7. Criar checklist de logging

Arquivo:

```text
production-review-logging-checklist.yaml
```

Conteúdo:

```yaml
logging:
  structured:
    required

  stableFields:
    required

  contextCleanup:
    required

  sensitiveData:
    forbidden

  successVolume:
    reviewed

  duplicateEvents:
    forbidden

  exception:
    categorized:
      required

  rawPayload:
    forbidden
```

---

### 8. Executar inspeção de logs

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-structured-logs.ps1
```

Valide cenários:

```text
success;

validation error;

domain error;

not found;

repository failure;

queue full;

readiness down;

shutdown.
```

Para cada cenário, confirme:

- evento;
- level;
- operation;
- outcome;
- request ID;
- correlation ID;
- trace ID;
- ausência de dados sensíveis.

---

### 9. Revisar request ID e correlation ID

Request ID:

```text
identifica uma entrada específica.
```

Correlation ID:

```text
relaciona várias operações
da mesma jornada.
```

Trace ID:

```text
identifica um trace
gerenciado pelo sistema de tracing.
```

Eles podem coexistir.

Não trate todos como sinônimos.

---

### 10. Revisar cleanup de contexto

Em threads reutilizadas:

```java
try {
    RequestContext.set(context);
    MDC.put("requestId", requestId);

    chain.doFilter(
            request,
            response);

} finally {
    MDC.clear();
    RequestContext.clear();
}
```

Sem cleanup, dados de uma request podem aparecer em outra.

---

### 11. Revisar counters

Counter cresce monotonicamente.

Use para:

```text
operações concluídas;

erros;

rejeições;

mensagens processadas;

retries;

timeouts.
```

Não use counter para valor atual de fila.

---

### 12. Revisar gauges

Gauge representa estado atual.

Use para:

```text
fila pendente;

conexões ativas;

conexões idle;

requests em andamento;

threads;

cache size.
```

Gauge pode subir e descer.

A função observada deve ser barata e segura.

---

### 13. Revisar timers

Timer mede:

- quantidade;
- duração;
- distribuição;
- buckets quando configurados.

Use para:

```text
HTTP;

application service;

repository;

publisher;

pool acquisition.
```

Outcome e operation podem ser labels.

ID de negócio não pode.

---

### 14. Revisar histogramas

Histogramas permitem:

- agregação;
- percentis server-side;
- SLI de latência;
- exemplars;
- comparação entre instâncias.

Sem buckets adequados, `histogram_quantile` não representa o que você espera.

Buckets devem considerar:

- SLO;
- distribuição;
- custo;
- resolução necessária.

---

### 15. Revisar percentis

p95 significa:

```text
95% das observações
ficaram abaixo ou iguais
àquele valor.
```

Isso não significa que uma request específica levou exatamente p95.

Compare:

- p50;
- p95;
- p99;
- volume;
- erro;
- janela.

Percentil sem volume pode enganar.

---

### 16. Revisar cardinalidade

Labels seguras:

```text
operation;

outcome;

status class;

route normalizada;

environment;

service;

release bounded.
```

Labels perigosas:

```text
request ID;

trace ID;

order ID;

customer ID;

URL bruta;

exception message;

SQL;

timestamp.
```

Cada combinação cria uma série.

---

### 17. Criar checklist de métricas

Arquivo:

```text
production-review-metrics-checklist.yaml
```

Conteúdo:

```yaml
metrics:
  types:
    correct:
      required

  labels:
    bounded:
      required

  histograms:
    bucketsAlignedWithSLO:
      required

  HTTP:
    normalizedRoute:
      required

  business:
    outcome:
      required

  repository:
    operation:
      required

  identifiers:
    forbidden
```

---

### 18. Inspecionar cardinalidade

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-metric-cardinality.ps1
```

Confirme:

- número de séries por métrica;
- labels permitidas;
- ausência de IDs;
- rotas normalizadas;
- releases dentro do limite esperado;
- exception messages ausentes.

---

### 19. Inspecionar histogramas

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-histograms.ps1
```

Valide:

- buckets existentes;
- contagem crescente;
- soma;
- quantile calculável;
- bucket próximo ao SLO;
- tráfego suficiente;
- unidade correta.

---

### 20. Revisar RED

RED:

```text
Rate;

Errors;

Duration.
```

Perguntas:

```text
quanto tráfego?

quantas falhas?

quanto tempo?
```

É útil para serviços request-driven.

---

### 21. Revisar USE

USE:

```text
Utilization;

Saturation;

Errors.
```

Perguntas:

```text
quanto recurso está ocupado?

há fila ou espera?

o recurso falhou?
```

Exemplos:

```text
CPU;

pool;

fila;

disco;

threads.
```

Nesta aula, use USE apenas como modelo de leitura de recursos, sem aprofundar diagnóstico de CPU ou memória.

---

### 22. Revisar Prometheus

Verifique:

- target `UP`;
- scrape interval;
- evaluation interval;
- labels externas;
- rule files;
- retenção;
- unidade;
- nomes;
- ausência de séries explosivas;
- queries protegidas contra divisão por zero.

---

### 23. Revisar consultas PromQL

Rate:

```promql
sum(
  rate(
    http_server_requests_seconds_count{
      application="observable-orders-api"
    }[5m]
  )
)
```

Error ratio:

```promql
sum(rate(http_server_requests_seconds_count{
  application="observable-orders-api",
  status=~"5.."
}[5m]))
/
clamp_min(
  sum(rate(http_server_requests_seconds_count{
    application="observable-orders-api"
  }[5m])),
  0.000001
)
```

O objetivo do `clamp_min` é evitar divisão inválida.

A expressão precisa ser validada no contexto real.

---

### 24. Revisar traces

Um trace saudável deve mostrar:

```text
span inbound HTTP;

span de application service;

span de repository;

span de publisher;

relação parent-child;

status;

duração;

atributos bounded;

erro categorizado.
```

Um trace não deve virar dump de payload.

---

### 25. Revisar span naming

Nomes estáveis:

```text
order.create;

order.confirm;

order.repository.find;

order.event.publish.
```

Nomes ruins:

```text
order.create.12345;

GET /orders/UUID-real;

SQL-completo.
```

Nomes dinâmicos aumentam custo e dificultam agregação.

---

### 26. Revisar span attributes

Atributos permitidos:

```text
operation;

outcome;

status category;

repository operation;

messaging operation;

service version;

environment.
```

Atributos proibidos:

```text
order ID;

customer reference;

payload;

token;

SQL parameter;

exception message bruta.
```

---

### 27. Revisar span events

Use eventos para fatos relevantes dentro do span:

```text
validation.completed;

retry.started;

fallback.activated;

queue.rejected.
```

Evite criar eventos para cada linha ou item.

---

### 28. Revisar propagação

Verifique:

- inbound `traceparent`;
- outbound injection;
- parent-child;
- executors customizados;
- `CompletableFuture`;
- mensageria;
- callbacks;
- virtual threads quando aplicável.

ThreadLocal isolado não garante propagação entre executors.

---

### 29. Criar checklist de tracing

Arquivo:

```text
production-review-tracing-checklist.yaml
```

Conteúdo:

```yaml
tracing:
  W3C:
    required

  parentChild:
    valid:
      required

  spanNames:
    stable:
      required

  attributes:
    bounded:
      required

  sensitiveData:
    forbidden

  logs:
    traceCorrelation:
      required

  metrics:
    traceIdAsLabel:
      forbidden
```

---

### 30. Inspecionar propagação

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-trace-propagation.ps1
```

Cenários:

- create;
- find;
- confirm;
- cancel;
- domain error;
- repository error;
- publisher error.

Confirme que o trace continua coerente.

---

### 31. Inspecionar correlação

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-trace-log-correlation.ps1
```

Fluxo esperado:

```text
dashboard mostra pico;

exemplar aponta trace;

trace aponta span;

trace ID localiza logs;

logs mostram release e outcome.
```

---

### 32. Revisar sampling

Sampling baixo reduz custo, mas pode perder traces.

Sampling alto aumenta cobertura e custo.

Estratégias:

- head sampling;
- tail sampling;
- prioridade para erros;
- prioridade para latência;
- configuração por ambiente.

A política precisa ser explícita.

---

### 33. Revisar health

Health é um conjunto de sinais sobre estado operacional.

Não deve expor detalhes sensíveis.

Health genérico não substitui:

- métricas;
- tracing;
- logs;
- SLO.

---

### 34. Revisar liveness

Liveness responde:

```text
o processo está vivo
e consegue continuar?
```

Não deve depender normalmente de banco, cache ou serviço externo.

Caso contrário, indisponibilidade de uma dependência pode gerar restart loop.

---

### 35. Revisar readiness

Readiness responde:

```text
a instância pode receber tráfego?
```

Pode depender de:

- banco;
- migration;
- capacidade de fila;
- configuração obrigatória;
- dependência essencial;
- modo de drenagem.

Readiness `DOWN` remove tráfego sem necessariamente matar o processo.

---

### 36. Criar checklist de health

Arquivo:

```text
production-review-health-checklist.yaml
```

Conteúdo:

```yaml
health:
  liveness:
    externalDependency:
      forbidden

  readiness:
    essentialDependency:
      allowed

  details:
    sensitive:
      forbidden

  startup:
    explicit:
      preferred

  shutdown:
    readinessDownBeforeExit:
      required

  endpoint:
    protection:
      environmentSpecific
```

---

### 37. Inspecionar grupos

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-health-groups.ps1
```

Simule:

```text
banco UP;

banco DOWN;

fila normal;

fila saturada;

aplicação drenando;

shutdown.
```

Confirme liveness e readiness esperadas.

---

### 38. Revisar SLI

Um SLI precisa definir:

- evento total;
- evento bom;
- elegibilidade;
- janela;
- fonte;
- owner;
- comportamento em ausência de tráfego.

Exemplo de disponibilidade:

```text
good:
requests elegíveis sem 5xx.

total:
requests elegíveis.
```

---

### 39. Revisar elegibilidade

Evite misturar:

- actuator;
- Prometheus scrape;
- health checks;
- tráfego sintético;
- endpoints internos;
- operações críticas;
- operações não críticas.

A exclusão precisa ser documentada e legítima.

---

### 40. Revisar SLO

SLO possui:

- SLI;
- objetivo;
- janela;
- owner;
- revisão;
- política de mudança;
- uso operacional.

Exemplo:

```text
99,9% de disponibilidade
em janela móvel de 30 dias.
```

O número não deve ser escolhido apenas por estética.

---

### 41. Revisar error budget

Para 99,9%:

```text
bad ratio permitido:
0,1%.
```

Error budget serve para decisões:

- ritmo de releases;
- prioridade de confiabilidade;
- freeze;
- investigação;
- mitigação;
- revisão de risco.

---

### 42. Revisar burn rate

Burn rate:

```text
consumo observado
/
consumo permitido.
```

Burn rate 1:

```text
consumo exatamente no ritmo permitido.
```

Burn rate maior que 1:

```text
budget sendo consumido rápido demais.
```

Janelas curtas detectam rápido.

Janelas longas reduzem ruído.

---

### 43. Criar checklist SLI/SLO

Arquivo:

```text
production-review-sli-slo-checklist.yaml
```

Conteúdo:

```yaml
SLI:
  eligibility:
    explicit:
      required

  goodAndTotal:
    defined:
      required

  noTraffic:
    behavior:
      required

SLO:
  objective:
    required

  window:
    required

  owner:
    required

  errorBudget:
    calculated:
      required

  burnRate:
    multiWindow:
      preferred
```

---

### 44. Inspecionar SLI

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-SLI-eligibility.ps1
```

Confirme:

- actuator excluído;
- rotas críticas incluídas;
- erros do usuário tratados conforme contrato;
- 5xx contabilizados;
- tráfego lab identificado;
- ausência de manipulação para melhorar resultado.

---

### 45. Inspecionar SLO e budget

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-SLO-and-error-budget.ps1
```

Valide:

- objetivo;
- janela;
- bad ratio;
- remaining budget;
- burn rate;
- volume;
- divisão por zero;
- owner;
- release context.

---

### 46. Revisar alertas

Um alerta bom representa:

- impacto;
- risco iminente;
- perda de SLO;
- saturação relevante;
- falha persistente;
- necessidade de decisão.

Um alerta ruim representa:

- curiosidade;
- pico curto;
- evento sem ação;
- threshold arbitrário;
- duplicação;
- falta de contexto.

---

### 47. Revisar anatomy do alerta

Cada alerta precisa de:

```text
nome;

sintoma;

impacto;

severidade;

owner;

duração;

dashboard;

runbook;

condição de recovery.
```

Mensagem genérica:

```text
CPU high.
```

é insuficiente.

Mensagem melhor:

```text
orders-api apresenta p99 acima do budget
e burn rate de latência elevado
por 15 minutos.
```

---

### 48. Revisar alertas symptom-based

Prefira alertas sobre:

- disponibilidade;
- latência;
- saturação;
- backlog;
- readiness;
- error budget.

Alertas de causa podem complementar.

Exemplo:

```text
Hikari pending alto
```

deve levar à investigação.

Não deve concluir automaticamente:

```text
aumentar pool.
```

---

### 49. Criar checklist de alertas

Arquivo:

```text
production-review-alerting-checklist.yaml
```

Conteúdo:

```yaml
alerting:
  actionable:
    required

  duration:
    required

  owner:
    required

  runbook:
    required

  dashboard:
    required

  recoveryCondition:
    required

  rawThreshold:
    forbiddenWithoutContext

  duplicateAlert:
    review:
      required
```

---

### 50. Inspecionar regras

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-alert-rules.ps1
```

Valide:

- sintaxe;
- labels;
- annotations;
- duração;
- divisão por zero;
- volume mínimo;
- runbook;
- dashboard;
- severity;
- recovery.

---

### 51. Revisar dashboards

Um dashboard precisa responder perguntas.

Overview:

```text
o serviço está saudável?
```

HTTP:

```text
qual rota está lenta ou falhando?
```

Dependencies:

```text
qual recurso está saturado?
```

SLO:

```text
estamos consumindo error budget?
```

---

### 52. Revisar painéis

Todo painel precisa de:

- título;
- unidade;
- descrição;
- query;
- datasource;
- janela;
- owner question;
- thresholds quando úteis;
- links operacionais.

Evite:

- gráfico sem unidade;
- eixo enganoso;
- cores arbitrárias;
- painel duplicado;
- tabela com alta cardinalidade;
- média sem percentis;
- volume sem erro.

---

### 53. Revisar variáveis

Variáveis seguras:

```text
environment;

service;

release;

operation;

route normalizada.
```

Variáveis perigosas:

```text
request ID;

trace ID;

order ID;

customer ID.
```

Para navegar a um trace específico, use link ou exemplar, não variável de dashboard.

---

### 54. Criar checklist de dashboards

Arquivo:

```text
production-review-dashboard-checklist.yaml
```

Conteúdo:

```yaml
dashboards:
  questionDriven:
    required

  panel:
    unit:
      required

    description:
      required

  variables:
    bounded:
      required

  SLO:
    objectiveAndBudget:
      required

  deployment:
    context:
      required

  traceNavigation:
    supported:
      preferred
```

---

### 55. Inspecionar dashboards

Execute:

```powershell
.\scripts\reviews\production-part-1\inspect-dashboards.ps1
```

Confirme:

- datasource;
- painéis;
- queries;
- unidades;
- variáveis;
- release;
- links;
- ausência de segredos;
- ausência de IDs dinâmicos.

---

### 56. Revisar release context

Todo diagnóstico deve conseguir responder:

```text
qual versão está ativa?

quando entrou?

qual ambiente?

houve mudança recente?

há versões simultâneas?

o problema começou após rollout?
```

Release pode aparecer em:

- logs;
- métricas bounded;
- traces;
- dashboards;
- eventos de deployment.

---

### 57. Revisar evidências

Evidência operacional precisa registrar:

- timestamp;
- ambiente;
- serviço;
- release;
- método de coleta;
- cenário;
- fonte;
- resultado;
- limitações.

Não incluir:

- segredo;
- payload;
- raw stack;
- raw dump;
- SQL sensível;
- IDs reais.

---

### 58. Criar security policy

Arquivo:

```text
production-review-security-policy.yaml
```

Conteúdo:

```yaml
security:
  logs:
    secret:
      forbidden

  metrics:
    businessIdentifier:
      forbidden

  traces:
    payload:
      forbidden

  health:
    internalDetail:
      forbidden

  dashboard:
    publicAccess:
      forbidden

  evidence:
    rawSensitiveArtifact:
      forbidden
```

---

### 59. Criar data quality policy

Arquivo:

```text
production-review-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingVolume:
    result:
      limited

  missingWindow:
    result:
      invalid

  missingRelease:
    result:
      correlation-limited

  missingEligibility:
    result:
      invalid-SLI

  missingBuckets:
    result:
      invalid-percentile

  singleSignalConclusion:
    result:
      weak
```

---

### 60. Criar failure policy

Arquivo:

```text
production-review-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  sensitiveDataFound:
    action:
      fail-security

  highCardinalityLabel:
    action:
      fail-metrics

  brokenTraceHierarchy:
    action:
      fail-tracing

  livenessDependsOnDatabase:
    action:
      fail-health

  SLOWithoutEligibility:
    action:
      fail-SLO

  alertWithoutRunbook:
    action:
      fail-alerting

  part2ReviewContent:
    deferredToLesson605

  practicalExam:
    deferredToLesson606
```

---

### 61. Criar cenários oficiais

Arquivo:

```text
production-review-scenarios.yaml
```

Cenários:

```text
structured-log-success;

structured-log-error;

sensitive-log-blocked;

MDC-cleanup;

counter-correct;

gauge-correct;

timer-correct;

high-cardinality-rejected;

histogram-valid;

p95-with-volume;

route-normalized;

trace-parent-child;

trace-log-correlation;

span-attribute-bounded;

baggage-sensitive-rejected;

liveness-database-down;

readiness-database-down;

readiness-queue-saturation;

SLI-eligibility-valid;

SLO-objective-valid;

error-budget-calculated;

burn-rate-short-window;

burn-rate-long-window;

alert-actionable;

alert-without-runbook-rejected;

dashboard-question-driven;

release-correlation;

evidence-sanitized;

part1-gate-pass.
```

---

### 62. Executar revisão por cenários

Execute:

```powershell
.\scripts\reviews\production-part-1\run-production-review-part1-scenarios.ps1
```

Para cada cenário, registre:

- pergunta;
- sinal inicial;
- inspeção;
- decisão;
- evidência;
- resultado;
- limitação.

---

### 63. Criar relatórios

Exemplo:

```yaml
loggingReview:
  structured:
    PASS

  context:
    PASS

  sanitization:
    PASS

  duplicates:
    PASS

  result:
    PASS
```

Repita para:

- metrics;
- tracing;
- health;
- SLI/SLO;
- alerting;
- dashboards.

---

### 64. Criar gate

O gate valida:

```text
logging;

metrics;

tracing;

health;

SLI;

SLO;

error budget;

alerting;

dashboards;

security;

evidence.
```

Status:

```text
PASS;

FAIL_LOGGING;

FAIL_METRICS;

FAIL_TRACING;

FAIL_HEALTH;

FAIL_SLI;

FAIL_SLO;

FAIL_ALERTING;

FAIL_DASHBOARD;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 65. Coletar evidence

Arquivo:

```text
production-review-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- environment;
- release category;
- logging status;
- metrics status;
- tracing status;
- health status;
- liveness status;
- readiness status;
- SLI status;
- SLO status;
- error budget status;
- alerting status;
- dashboard status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- request ID;
- trace ID;
- span ID;
- order ID;
- customer reference;
- payload;
- token;
- password;
- raw logs;
- raw traces;
- respostas da prova prática.

---

### 66. Executar gate completo

Execute:

```powershell
.\scripts\reviews\production-part-1\validate-production-review-part1-contract.ps1

.\scripts\reviews\production-part-1\inspect-structured-logs.ps1

.\scripts\reviews\production-part-1\inspect-metric-cardinality.ps1

.\scripts\reviews\production-part-1\inspect-histograms.ps1

.\scripts\reviews\production-part-1\inspect-trace-propagation.ps1

.\scripts\reviews\production-part-1\inspect-trace-log-correlation.ps1

.\scripts\reviews\production-part-1\inspect-health-groups.ps1

.\scripts\reviews\production-part-1\inspect-SLI-eligibility.ps1

.\scripts\reviews\production-part-1\inspect-SLO-and-error-budget.ps1

.\scripts\reviews\production-part-1\inspect-alert-rules.ps1

.\scripts\reviews\production-part-1\inspect-dashboards.ps1

.\scripts\reviews\production-part-1\run-production-review-part1-scenarios.ps1

.\scripts\reviews\production-part-1\collect-production-review-part1-evidence.ps1

.\scripts\reviews\production-part-1\verify-production-review-part1.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 67. Encerrar a revisão

Confirme:

- stack encerrada quando não necessária;
- modos de degradação resetados;
- relatórios sanitizados;
- nenhum segredo;
- nenhuma série de alta cardinalidade;
- nenhuma alteração funcional principal;
- baseline preservada;
- gate aprovado;
- parte 2 não antecipada;
- prova prática não antecipada.

---

## Entendendo o que foi feito

### Logs ganharam contrato revisado

Campos, níveis, contexto, volume e sanitização foram reavaliados.

### Métricas ganharam semântica

Counter, gauge, timer e histogram deixaram de ser usados por hábito.

### Cardinalidade ganhou fiscalização

Labels dinâmicas passaram a ser rejeitadas.

### Percentis ganharam contexto

Volume, buckets e janela passaram a acompanhar p95 e p99.

### Tracing ganhou estrutura

Spans, parent-child, atributos e propagação foram validados.

### Correlação ganhou caminho

Dashboard, exemplar, trace e log passaram a formar uma navegação.

### Health ganhou separação

Liveness e readiness mantiveram responsabilidades diferentes.

### SLI ganhou elegibilidade

Eventos bons e totais passaram a ser explicitamente definidos.

### SLO ganhou governança

Objetivo, janela, owner e error budget foram revisados.

### Alertas ganharam ação

Duração, impacto, runbook e recovery foram exigidos.

### Dashboards ganharam perguntas

Painéis deixaram de ser apenas visuais.

### A próxima revisão ganhou fronteira

Performance, concorrência, diagnóstico e incidentes ficam para a aula 605.

---

## Erros comuns importantes

### Confundir observabilidade com ferramenta

Prometheus ou Grafana isolados não garantem observabilidade.

### Criar log para tudo

Volume alto pode esconder os eventos importantes.

### Usar ID como label

Cada valor cria novas séries.

### Calcular p95 sem buckets

A consulta não representa uma distribuição válida.

### Usar trace como payload store

Custo e risco de segurança aumentam.

### Derrubar liveness por dependência

A aplicação entra em restart loop.

### Manipular elegibilidade do SLI

O indicador deixa de representar o usuário.

### Criar SLO sem owner

O objetivo não orienta decisões.

### Criar alerta sem runbook

O operador não sabe o próximo passo.

### Criar dashboard decorativo

Gráficos não respondem perguntas operacionais.

---

## Comandos úteis

### Revisar logs

```powershell
.\scripts\reviews\production-part-1\inspect-structured-logs.ps1
```

### Revisar cardinalidade

```powershell
.\scripts\reviews\production-part-1\inspect-metric-cardinality.ps1
```

### Revisar tracing

```powershell
.\scripts\reviews\production-part-1\inspect-trace-propagation.ps1
```

### Revisar SLO

```powershell
.\scripts\reviews\production-part-1\inspect-SLO-and-error-budget.ps1
```

### Validar parte 1

```powershell
.\scripts\reviews\production-part-1\verify-production-review-part1.ps1
```

---

## Exercício guiado

### Parte 1 — Logs

Classifique eventos, levels, contexto e riscos.

### Parte 2 — Métricas

Escolha counter, gauge, timer ou histogram.

### Parte 3 — Cardinalidade

Remova labels dinâmicas.

### Parte 4 — Tracing

Valide spans, parent-child e atributos.

### Parte 5 — Health

Separe liveness e readiness.

### Parte 6 — SLI

Defina good, total e elegibilidade.

### Parte 7 — SLO

Calcule budget e burn rate.

### Parte 8 — Alertas

Exija duração, owner e runbook.

### Parte 9 — Dashboards

Associe cada painel a uma pergunta.

### Parte 10 — Gate

Valide segurança, evidências e baseline.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 603 e ponte para a aula 605 foram preservadas;
- o projeto observável permaneceu funcional;
- contrato, checklists, cenários, relatórios e scripts da revisão foram criados;
- logs estruturados possuem campos estáveis;
- levels foram revisados por semântica;
- duplicações foram identificadas;
- request ID, correlation ID, trace ID e span ID foram diferenciados;
- MDC e contexto possuem cleanup;
- dados sensíveis e log injection foram avaliados;
- counters, gauges, timers e histogramas foram diferenciados;
- labels possuem cardinalidade bounded;
- IDs, URLs brutas e exception messages não são labels;
- histogramas possuem buckets úteis;
- p50, p95 e p99 são interpretados com volume e janela;
- RED e USE foram revisados;
- Prometheus scrape e PromQL foram validados;
- traces possuem parent-child;
- span names e attributes são bounded;
- baggage sensível foi proibido;
- trace-log correlation foi validada;
- liveness não depende de banco;
- readiness representa aptidão para tráfego;
- detalhes sensíveis não aparecem em health;
- SLI possui good, total, elegibilidade e janela;
- SLO possui objetivo, janela, owner e revisão;
- error budget e burn rate foram recalculados;
- alertas possuem duração, owner, dashboard, runbook e recovery;
- dashboards possuem perguntas, unidades e variáveis bounded;
- release context foi preservado;
- evidence foi sanitizada;
- nenhuma feature principal nova foi criada;
- a revisão da parte 2 e a prova prática não foram antecipadas;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/reviews/production-part-1 `
  scripts/reviews/production-part-1 `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestIdValue|traceIdValue|spanIdValue|rawPayload|rawLog|examAnswer"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): revisar producao parte 1"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados reais;
- IDs reais;
- raw logs;
- raw traces;
- artefatos sensíveis;
- respostas da prova;
- conteúdo completo da parte 2.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você revisou a primeira metade dos fundamentos de produção.

Você consolidou:

```text
logs estruturados;

níveis;

contexto;

sanitização;

counters;

gauges;

timers;

histogramas;

percentis;

cardinalidade;

Prometheus;

tracing;

spans;

propagação;

correlação;

health;

liveness;

readiness;

SLIs;

SLOs;

error budget;

burn rate;

alertas;

dashboards;

release context;

evidence.
```

Você comprovou que observabilidade não é apenas instalar ferramentas; que logs precisam de contrato; que métricas precisam de semântica e cardinalidade controlada; que percentis dependem de distribuição; que traces precisam de contexto e parent-child; que liveness e readiness não são equivalentes; que SLI exige elegibilidade; que SLO precisa de owner; que alertas precisam ser acionáveis; e que dashboards devem responder perguntas.

A próxima aula será:

```text
605 - M18.50 - Revisao producao parte 2
```

Nela, você irá revisar performance, profiling, CPU, memória, concorrência, virtual threads, locks, race conditions, deadlocks, backpressure, timeouts, banco lento, incidentes, runbooks e otimização.

Nenhuma revisão aprofundada desses temas e nenhuma prova prática foram executadas nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei logs e contexto.
- [ ] Diferenciei tipos de métricas.
- [ ] Validei cardinalidade e histogramas.
- [ ] Revisei spans e propagação.
- [ ] Separei liveness e readiness.
- [ ] Recalculei SLI, SLO e budget.
- [ ] Revisei alertas e dashboards.
- [ ] Validei evidence sem antecipar a prova.

---

## Troubleshooting adicional

### Log tem trace ID, mas não request ID

Revise filtro, MDC e contrato de campos.

### Métrica cria séries demais

Procure IDs, URLs brutas, mensagens e releases ilimitadas.

### p95 está vazio

Confirme buckets, volume, janela e nome real da métrica.

### Trace quebra no executor

Revise captura e propagação de contexto.

### Readiness e liveness ficam iguais

Revise composição dos grupos.

### SLI parece bom demais

Verifique elegibilidade, exclusões e tráfego ausente.

### Burn rate é infinito

Proteja divisão e valide volume.

### Alerta dispara em restart curto

Ajuste duração e escopo.

### Dashboard tem muitos gráficos

Remova painéis sem pergunta operacional.

### A revisão entrou em deadlocks e CPU

Preserve aprofundamento para a aula 605.

---

## Perguntas de revisão

1. O que é observabilidade?
2. O que diferencia telemetria de observabilidade?
3. O que é structured log?
4. Qual função de request ID?
5. Qual função de correlation ID?
6. Qual função de trace ID?
7. Quando usar counter?
8. Quando usar gauge?
9. Quando usar timer?
10. Por que histogram é importante?
11. O que é cardinalidade?
12. O que significa p95?
13. O que é RED?
14. O que é USE?
15. Qual diferença entre liveness e readiness?
16. O que é elegibilidade de SLI?
17. O que é error budget?
18. O que é burn rate?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Inferir estado interno por sinais externos.
2. Dados versus capacidade de interpretação.
3. Log com campos estáveis.
4. Identificar uma request.
5. Relacionar uma jornada.
6. Identificar um trace.
7. Eventos monotônicos.
8. Estado atual.
9. Quantidade e duração.
10. Distribuição e percentis agregáveis.
11. Combinações distintas de labels.
12. 95% abaixo ou igual ao valor.
13. Rate, Errors, Duration.
14. Utilization, Saturation, Errors.
15. Processo vivo versus aptidão para tráfego.
16. Definição do que conta.
17. Falha permitida pelo SLO.
18. Velocidade de consumo do budget.
19. Revisão produção parte 2.
20. Revisão produção parte 2.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 604 - M18.49 - Revisao producao parte 1

- Iniciei a revisão técnica de produção.
- Validei a baseline final da API observável.
- Revisei structured logs, levels, contexto e sanitização.
- Diferenciei request ID, correlation ID, trace ID e span ID.
- Confirmei cleanup de MDC e ThreadLocal.
- Revisei counters, gauges, timers e histogramas.
- Inspecionei labels e cardinalidade.
- Reforcei interpretação de p50, p95 e p99.
- Revisei RED e USE.
- Validei Prometheus, buckets e PromQL.
- Revisei traces, spans, parent-child e propagação.
- Validei trace-log correlation.
- Diferenciei health, liveness e readiness.
- Revisei elegibilidade de SLI.
- Recalculei SLO, error budget e burn rate.
- Revisei alertas acionáveis com runbooks.
- Revisei dashboards orientados por perguntas.
- Preservei release context e evidence sanitizada.
- Não antecipei a parte 2 nem a prova prática.
- Próxima aula: Revisão produção parte 2.
```

---

## Referência técnica curta

- Structured logging.
- Micrometer metrics.
- Prometheus histograms.
- Metric cardinality.
- OpenTelemetry tracing.
- W3C Trace Context.
- Liveness and readiness.
- Service level indicators.
- Service level objectives.
- Burn-rate alerting.

Regra final:

```text
a primeira revisão de produção precisa comprovar que a fundação observável possui contratos coerentes: logs estruturados usam campos estáveis, levels adequados, contexto com cleanup e sanitização, métricas escolhem counter, gauge, timer e histogram conforme a semântica, labels permanecem bounded, rotas são normalizadas e percentis são interpretados com buckets, volume e janela; traces preservam parent-child, propagação W3C, span names e attributes estáveis, baggage e payloads sensíveis são proibidos e logs permitem navegação pelo trace, enquanto liveness representa processo vivo, readiness representa aptidão para tráfego, SLIs definem good, total e elegibilidade, SLOs possuem objetivo, janela e owner, error budgets geram burn rates e alertas acionáveis incluem duração, impacto, dashboard, runbook e recovery; dashboards respondem perguntas, releases contextualizam mudanças e evidence é sanitizada; performance, concorrência, banco, incidentes e otimização aprofundados ficam para a aula 605, e a prova prática permanece reservada à aula 606.
```
