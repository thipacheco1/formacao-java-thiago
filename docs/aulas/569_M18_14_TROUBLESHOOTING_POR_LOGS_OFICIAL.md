# 569 - M18.14 - Troubleshooting por logs

## Apresentação da aula

Na aula 568, você transformou registros de um incidente simulado em um postmortem estruturado.

Esse postmortem utilizou várias fontes:

```text
alertas;

métricas;

dashboards;

traces;

runbooks;

release metadata;

logs estruturados.
```

Os logs apareceram como evidência, mas ainda não foram tratados como instrumento principal de diagnóstico.

Nesta aula, você irá aprofundar o troubleshooting por logs estruturados.

A pergunta central será:

```text
como investigar
uma falha técnica

a partir de eventos
distribuídos no tempo,

sem depender
de busca aleatória,
texto livre
ou memória?
```

Troubleshooting por logs não significa apenas procurar a palavra:

```text
ERROR.
```

Uma investigação consistente precisa considerar:

- janela temporal;
- serviço;
- ambiente;
- release;
- instance;
- nível;
- evento;
- operação;
- outcome;
- error type;
- correlation ID;
- trace ID;
- mensagem;
- stack trace;
- sequência;
- frequência;
- ausência de eventos;
- comparação antes e depois;
- dados incompletos;
- volume;
- amostragem;
- segurança.

Um erro isolado pode não representar o incidente.

Uma sequência pode conter:

```text
request recebido;

validação aprovada;

dependência iniciada;

timeout;

retry;

nova falha;

fallback;

resposta final.
```

Sem ordenar e relacionar esses eventos, a equipe pode interpretar o sintoma como causa.

Exemplo:

```text
payment timeout.
```

Esse evento pode ser consequência de:

- dependência lenta;
- pool esgotado;
- fila interna;
- timeout configurado incorretamente;
- retry storm;
- conexão interrompida;
- DNS;
- limite de taxa;
- thread bloqueada;
- release regressiva.

O objetivo será construir uma metodologia.

Você irá responder perguntas na seguinte ordem:

```text
1.
qual é o sintoma?

2.
qual é a janela?

3.
qual serviço e ambiente?

4.
qual release?

5.
qual evento iniciou o fluxo?

6.
qual foi o primeiro desvio?

7.
quais eventos são consequência?

8.
o padrão ocorre em uma instance
ou em todas?

9.
há correlação com trace,
métrica ou mudança?

10.
qual hipótese possui evidência?
```

O laboratório trabalhará com logs estruturados em JSON.

Os exemplos usarão campos como:

```text
timestamp;

level;

service;

environment;

release;

instance;

event;

operation;

outcome;

correlation_id;

trace_id;

span_id;

error_type;

retry_attempt;

duration_ms;

dependency;

message.
```

Você irá criar:

- contrato de troubleshooting;
- catálogo de eventos;
- política de campos;
- política de níveis;
- política de stack traces;
- política de janelas;
- política de comparação;
- política de amostragem;
- cenários;
- queries PowerShell;
- validadores;
- evidence sanitizada.

A aula não irá analisar estados de threads da JVM.

Não serão aprofundados:

- `jstack`;
- `jcmd Thread.print`;
- estados `RUNNABLE`, `WAITING` ou `BLOCKED`;
- deadlock;
- monitor lock;
- thread pool starvation;
- stacks de threads;
- análise de CPU por thread;
- snapshots sucessivos de threads;
- correlação entre thread dump e código.

Esses tópicos pertencem à próxima aula oficial:

```text
570 - M18.15 - Thread dump
```

A regra central será:

```text
logs precisam
reconstruir fatos,

não confirmar
a primeira hipótese.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
567:
Runbooks.

568:
Postmortem.

569:
Troubleshooting por logs.

570:
Thread dump.
```

A progressão é:

```text
responder;

aprender;

investigar eventos;

investigar execução interna.
```

Nesta aula:

```text
logs estruturados:
sim.

busca por campos:
sim.

janelas:
sim.

correlation ID:
sim.

trace ID:
sim.

comparação entre instances:
sim.

stack trace:
sim.

padrões:
sim.

frequência:
sim.

ausência:
sim.

thread dump:
não.

deadlock:
não.

estado de thread:
não.
```

Você reutilizará:

- o contrato de logs da aula 556;
- correlation ID e trace ID da aula 557;
- release metadata;
- métricas;
- Grafana;
- Tempo;
- alertas;
- runbooks;
- postmortem.

Logs serão fonte de investigação.

Métricas mostrarão onde procurar.

Traces mostrarão causalidade.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
observability/log-troubleshooting
├── log-troubleshooting-contract.yaml
├── log-event-catalog.yaml
├── log-field-policy.yaml
├── log-level-policy.yaml
├── log-window-policy.yaml
├── log-sequence-policy.yaml
├── log-stacktrace-policy.yaml
├── log-comparison-policy.yaml
├── log-sampling-policy.yaml
├── log-data-quality-policy.yaml
├── log-security-policy.yaml
├── log-failure-policy.yaml
├── log-troubleshooting-scenarios.yaml
└── log-troubleshooting-evidence.yaml

scripts/observability/logs
├── collect-structured-logs.ps1
├── validate-log-contract.ps1
├── validate-log-events.ps1
├── validate-log-fields.ps1
├── filter-logs-by-window.ps1
├── filter-logs-by-correlation.ps1
├── filter-logs-by-trace.ps1
├── compare-logs-by-release.ps1
├── compare-logs-by-instance.ps1
├── group-logs-by-error-type.ps1
├── extract-first-failure.ps1
├── analyze-log-sequence.ps1
├── analyze-stacktrace-patterns.ps1
├── detect-missing-log-events.ps1
├── scan-log-output.ps1
├── simulate-log-troubleshooting.ps1
├── collect-log-troubleshooting-evidence.ps1
└── verify-log-troubleshooting-baseline.ps1

docs/observability/logs
├── LOG_TROUBLESHOOTING_OVERVIEW.md
├── STRUCTURED_LOG_QUERY_GUIDE.md
├── LOG_SEQUENCE_ANALYSIS.md
├── STACKTRACE_ANALYSIS_GUIDE.md
├── LOG_COMPARISON_GUIDE.md
├── LOG_DATA_QUALITY.md
├── LOG_TROUBLESHOOTING_TEST_MATRIX.md
└── LOG_TROUBLESHOOTING_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
metodologia de investigação;

queries reproduzíveis;

eventos catalogados;

janelas definidas;

sequências reconstruídas;

primeiro desvio identificado;

comparação por release;

comparação por instance;

padrões de stack trace;

ausências detectadas;

evidence sanitizada.
```

Você irá:

1. validar a baseline;
2. definir o contrato;
3. criar catálogo de eventos;
4. validar campos;
5. validar níveis;
6. coletar logs;
7. delimitar janela;
8. filtrar serviço e ambiente;
9. filtrar release;
10. filtrar correlation ID;
11. filtrar trace ID;
12. ordenar sequência;
13. localizar primeiro desvio;
14. distinguir causa e consequência;
15. agrupar erros;
16. analisar stack traces;
17. comparar releases;
18. comparar instances;
19. detectar eventos ausentes;
20. tratar amostragem;
21. tratar volume;
22. escanear dados;
23. simular cenários;
24. coletar evidence;
25. executar gate;
26. commitar;
27. preparar a aula 570.

---

## Conceito essencial

### Evento de log

Registro estruturado de algo que aconteceu no sistema.

---

### Campo estruturado

Atributo separado da mensagem textual e consultável por nome.

---

### Janela temporal

Intervalo usado para limitar a investigação.

---

### Correlação

Relação entre eventos que pertencem ao mesmo fluxo ou contexto.

---

### Sequência causal

Ordem de eventos que mostra dependências e consequências.

---

### Primeiro desvio

Primeiro evento conhecido que se afastou do comportamento esperado.

---

### Sintoma

Manifestação observada de um problema.

---

### Causa candidata

Hipótese sustentada por alguma evidência, ainda sujeita a validação.

---

### Erro raiz no stack trace

Exceção mais interna ou mecanismo técnico que originou a cadeia observada.

---

### Fingerprint de erro

Representação estável usada para agrupar falhas equivalentes.

---

### Negative evidence

Ausência de um evento esperado dentro de um fluxo ou janela.

---

### Log sampling

Redução controlada do volume de determinados eventos.

---

### Log gap

Intervalo sem logs quando eventos eram esperados.

---

### Data quality

Confiabilidade dos timestamps, campos, ordem, completude e origem dos logs.

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

Suba a aplicação e o worker:

```powershell
.\scripts\observability\tracing\start-orders-components-with-agents.ps1
```

Confirme:

- logs em JSON;
- timestamp;
- level;
- service;
- environment;
- release;
- instance;
- event;
- operation;
- outcome;
- correlation ID;
- trace ID;
- stack trace estruturado quando aplicável;
- nenhum dado sensível;
- relógio coerente entre processos;
- arquivo ou stdout disponível para coleta.

Registre a baseline.

---

### 2. Criar contrato de troubleshooting

Arquivo:

```text
log-troubleshooting-contract.yaml
```

Conteúdo:

```yaml
troubleshooting:
  inputs:
    required:
      - symptom
      - environment
      - service
      - time-window

  correlation:
    preferred:
      - trace_id
      - correlation_id

  release:
    requiredWhenKnown:
      true

  sequence:
    chronological:
      required

  hypotheses:
    evidence:
      required

  missingEvents:
    considered:
      required

  sensitiveData:
    forbidden

  threadAnalysis:
    deferredToLesson570
```

A investigação exige sintoma e janela.

---

### 3. Criar catálogo de eventos

Arquivo:

```text
log-event-catalog.yaml
```

Exemplo:

```yaml
events:
  - name:
      order.request.received

    service:
      orders-api

    level:
      INFO

    outcome:
      none

  - name:
      order.validation.completed

    service:
      orders-api

    level:
      INFO

  - name:
      payment.request.started

    service:
      orders-api

    level:
      INFO

  - name:
      payment.request.failed

    service:
      orders-api

    level:
      ERROR

  - name:
      order.retry.scheduled

    service:
      orders-api

    level:
      WARN

  - name:
      order.response.completed

    service:
      orders-api

    level:
      INFO

  - name:
      order.message.consumed

    service:
      orders-worker

    level:
      INFO

  - name:
      order.processing.failed

    service:
      orders-worker

    level:
      ERROR
```

Nomes de eventos precisam ser estáveis.

Não use a mensagem como identidade.

---

### 4. Criar política de campos

Arquivo:

```text
log-field-policy.yaml
```

Conteúdo:

```yaml
fields:
  required:
    - timestamp
    - level
    - service
    - environment
    - release
    - event
    - operation
    - outcome
    - message

  correlation:
    - correlation_id
    - trace_id
    - span_id

  optional:
    - instance
    - dependency
    - duration_ms
    - retry_attempt
    - error_type
    - exception_class
    - stack_trace

  forbidden:
    - password
    - token
    - authorization
    - cookie
    - request_body
    - response_body
    - customer_email
    - card_number
```

Campos ausentes reduzem capacidade de investigação.

---

### 5. Criar política de níveis

Arquivo:

```text
log-level-policy.yaml
```

Conteúdo:

```yaml
levels:
  ERROR:
    use:
      unexpected-technical-failure

  WARN:
    use:
      degraded-or-recoverable-condition

  INFO:
    use:
      lifecycle-and-business-milestones

  DEBUG:
    use:
      controlled-diagnostics

  TRACE:
    use:
      exceptional-local-analysis

  businessRejection:
    default:
      INFO-or-WARN-by-contract

  expectedNotFound:
    default:
      INFO-or-DEBUG

  sensitiveData:
    forbiddenAtAllLevels
```

Nível não define causa.

Ele define severidade do evento registrado.

---

### 6. Coletar logs estruturados

Script:

```text
collect-structured-logs.ps1
```

O script deve:

- identificar arquivo ou container;
- limitar janela;
- preservar JSON por linha;
- não alterar conteúdo;
- registrar origem;
- registrar service;
- registrar environment;
- produzir arquivo temporário;
- não commitar output bruto;
- falhar se o formato não for JSON válido.

Exemplo:

```powershell
docker logs `
  orders-api `
  --since 30m `
  2>&1 `
  | Set-Content `
      .tmp/logs/orders-api.jsonl
```

Repita para o worker.

---

### 7. Delimitar a janela

Arquivo:

```text
log-window-policy.yaml
```

Conteúdo:

```yaml
windows:
  incident:
    start:
      first-known-impact-minus-5m

    end:
      recovery-plus-5m

  comparison:
    before:
      equivalent-duration

    after:
      equivalent-duration

  timezone:
    UTC

  maximumInitialWindow:
    60m
```

Uma janela muito grande produz ruído.

Uma janela muito curta perde contexto.

---

### 8. Filtrar por janela

Script:

```text
filter-logs-by-window.ps1
```

Entrada:

```text
start;

end;

service;

environment.
```

Saída:

```text
logs ordenados
por timestamp.
```

Valide:

- timestamps ISO-8601;
- timezone;
- eventos fora da janela removidos;
- origem preservada;
- nenhuma linha truncada.

---

### 9. Filtrar por serviço e ambiente

Exemplo PowerShell:

```powershell
Get-Content `
  .tmp/logs/orders-api.jsonl `
| ForEach-Object {
    $_ | ConvertFrom-Json
  } `
| Where-Object {
    $_.service -eq "orders-api" `
    -and $_.environment -eq "local"
  }
```

Não misture ambientes.

Nomes iguais de eventos podem existir em contextos diferentes.

---

### 10. Filtrar por release

Exemplo:

```powershell
Get-Content `
  .tmp/logs/orders-api.jsonl `
| ForEach-Object {
    $_ | ConvertFrom-Json
  } `
| Where-Object {
    $_.release -eq "1.8.0"
  }
```

Se o campo release estiver ausente, a comparação fica limitada.

O gate precisa registrar:

```text
release_unknown.
```

---

### 11. Filtrar por correlation ID

Script:

```text
filter-logs-by-correlation.ps1
```

Uso:

```powershell
.\scripts\observability\logs\filter-logs-by-correlation.ps1 `
  -CorrelationId `
  "laboratory-correlation-reference"
```

No laboratório, o ID usado para execução não deve ser gravado na evidence final.

A saída deve mostrar:

- timestamp;
- service;
- event;
- operation;
- outcome;
- error type;
- duration;
- message sanitizada.

---

### 12. Filtrar por trace ID

Script:

```text
filter-logs-by-trace.ps1
```

O trace ID conecta:

- API;
- chamada HTTP;
- producer;
- worker;
- spans;
- logs.

A investigação pode começar por um trace lento ou com erro.

Não use trace ID como label de métrica.

Aqui ele é chave de busca de eventos.

---

### 13. Ordenar a sequência

Arquivo:

```text
log-sequence-policy.yaml
```

Regras:

```yaml
sequence:
  order:
    - timestamp
    - service
    - event

  expectedFlow:
    orderCreate:
      - order.request.received
      - order.validation.completed
      - payment.request.started
      - payment.request.completed
      - order.message.published
      - order.response.completed

  optionalEvents:
    - order.retry.scheduled
    - fallback.activated

  terminalEvents:
    - order.response.completed
    - order.response.failed
```

A sequência esperada ajuda a detectar desvios.

---

### 14. Analisar a sequência

Script:

```text
analyze-log-sequence.ps1
```

Para cada correlation ID ou trace ID:

1. ordenar eventos;
2. identificar evento inicial;
3. localizar eventos esperados;
4. marcar eventos ausentes;
5. identificar primeiro erro;
6. identificar retries;
7. identificar evento terminal;
8. calcular intervalos;
9. registrar gaps;
10. classificar sequência.

Classificações:

```text
complete-success;

complete-failure;

incomplete;

out-of-order;

duplicate;

unknown.
```

---

### 15. Identificar o primeiro desvio

Script:

```text
extract-first-failure.ps1
```

Exemplo de sequência:

```text
14:04:01.100
order.request.received.

14:04:01.110
order.validation.completed.

14:04:01.115
payment.request.started.

14:04:01.620
payment.request.failed.
error_type=timeout.

14:04:01.625
order.retry.scheduled.

14:04:02.140
payment.request.failed.

14:04:02.150
order.response.failed.
```

Primeiro desvio:

```text
payment.request.failed
às 14:04:01.620.
```

O evento final pode não ser o primeiro desvio.

---

### 16. Separar causa e consequência

No exemplo:

```text
timeout:
causa candidata.

retry:
consequência e amplificador possível.

response failed:
sintoma final.
```

A conclusão depende de:

- latência da dependência;
- configuração de timeout;
- traces;
- métricas;
- release;
- frequência.

Logs ajudam a formular a hipótese.

Não provam tudo sozinhos.

---

### 17. Agrupar por error type

Script:

```text
group-logs-by-error-type.ps1
```

Exemplo:

```powershell
Get-Content `
  .tmp/logs/orders-api.jsonl `
| ForEach-Object {
    $_ | ConvertFrom-Json
  } `
| Where-Object {
    $_.level -eq "ERROR"
  } `
| Group-Object `
    error_type `
| Sort-Object `
    Count `
    -Descending
```

Resultado esperado:

```text
timeout:
120.

connection_refused:
8.

serialization_failure:
2.
```

Frequência ajuda a priorizar.

---

### 18. Criar fingerprint de erro

Fingerprint pode combinar:

```text
exception class;

top application frame;

error type;

operation;

dependency.
```

Não inclua:

- timestamp;
- UUID;
- order ID;
- mensagem dinâmica;
- host efêmero.

Exemplo conceitual:

```text
TimeoutException
+
PaymentClient.authorize
+
payment
+
create-order.
```

Isso agrupa ocorrências equivalentes.

---

### 19. Analisar stack traces

Arquivo:

```text
log-stacktrace-policy.yaml
```

Regras:

```yaml
stackTrace:
  capture:
    unexpectedFailure:
      required

  format:
    structured-or-multiline-preserved

  maximumSize:
    bounded

  repeatedTrace:
    sampling:
      allowed

  rootException:
    extract:
      required

  applicationFrames:
    identify:
      required

  sensitiveValues:
    forbidden

  threadStateAnalysis:
    deferredToLesson570
```

Stack trace mostra caminho de exceção.

Não mostra sozinho o estado global da JVM.

---

### 20. Ler stack trace de forma sistemática

Ordem:

1. identificar exception principal;
2. localizar `Caused by`;
3. chegar à causa mais interna;
4. localizar primeiro frame da aplicação;
5. identificar boundary de framework;
6. verificar operação;
7. comparar com release;
8. agrupar por fingerprint;
9. verificar frequência;
10. correlacionar com trace.

Exemplo:

```text
OrderCreationException
caused by
PaymentTimeoutException
caused by
java.net.SocketTimeoutException.
```

A causa técnica mais interna é timeout de socket.

A causa do incidente ainda pode ser configuração inadequada.

---

### 21. Não começar pelo topo apenas

O topo pode mostrar:

```text
OrderCreationException.
```

Isso representa encapsulamento de domínio.

A cadeia interna pode mostrar:

```text
SocketTimeoutException.
```

Ambas são úteis.

Uma descreve contexto de aplicação.

A outra descreve mecanismo técnico.

---

### 22. Comparar releases

Script:

```text
compare-logs-by-release.ps1
```

Compare janelas equivalentes:

```text
release 1.7.3;

release 1.8.0.
```

Compare:

- event count;
- error count;
- error type;
- retry count;
- duration;
- dependency;
- terminal outcome;
- missing events;
- fingerprints.

Resultado:

```text
new;

increased;

decreased;

unchanged;

inconclusive.
```

---

### 23. Evitar comparação sem normalização

Se a release nova recebeu dez vezes mais tráfego, contagem absoluta de erros pode aumentar sem piora proporcional.

Use:

- contagem;
- taxa;
- tráfego;
- janela;
- distribuição;
- outcomes.

Logs complementam métricas.

Não substituem normalização.

---

### 24. Comparar instances

Script:

```text
compare-logs-by-instance.ps1
```

Perguntas:

```text
a falha ocorre
em uma instance?

em todas?

apenas na nova release?

apenas em um host?

apenas após restart?
```

Exemplo:

```text
instance A:
timeout alto.

instance B:
normal.
```

Hipóteses:

- configuração divergente;
- pool local;
- DNS;
- node;
- artifact;
- cache;
- relógio;
- tráfego desigual.

---

### 25. Detectar logs duplicados

Duplicação pode ocorrer por:

- dois appenders;
- export duplo;
- retry de coleta;
- sidecar;
- leitura repetida;
- mesma exceção logada em várias camadas.

Identifique:

```text
mesmo timestamp aproximado;

mesmo event;

mesmo trace ID;

mesmo fingerprint;

mesma instance.
```

Não remova eventos automaticamente sem entender a origem.

---

### 26. Detectar eventos ausentes

Script:

```text
detect-missing-log-events.ps1
```

Exemplo esperado:

```text
order.request.received;

order.validation.completed;

payment.request.started;

payment.request.completed;

order.response.completed.
```

Observado:

```text
order.request.received;

order.validation.completed;

payment.request.started.
```

Ausências:

```text
payment.request.completed;

order.response.completed.
```

Isso pode indicar:

- processo interrompido;
- exceção sem log terminal;
- timeout externo;
- crash;
- log sampling;
- coleta incompleta;
- bug de instrumentação.

---

### 27. Tratar negative evidence

Ausência é evidência somente quando:

- o evento era obrigatório;
- a coleta estava ativa;
- a janela está correta;
- o fluxo não foi amostrado;
- o processo não terminou antes;
- o relógio é coerente.

Sem essas garantias:

```text
evento ausente
=
inconclusivo.
```

---

### 28. Criar política de sampling

Arquivo:

```text
log-sampling-policy.yaml
```

Conteúdo:

```yaml
sampling:
  allowed:
    - repeated-debug-event
    - high-frequency-success-event

  forbidden:
    - error-terminal-event
    - security-event
    - audit-event
    - recovery-event
    - release-event

  metadata:
    sampled:
      required

  rate:
    documented:
      required

  troubleshooting:
    temporaryDisable:
      controlled
```

Sampling precisa ser visível.

Caso contrário, a ausência pode ser interpretada incorretamente.

---

### 29. Alterar nível de log com controle

Durante troubleshooting local, pode ser necessário aumentar nível.

Regras:

- escopo por package;
- duração limitada;
- ambiente confirmado;
- volume estimado;
- cleanup;
- nenhum dado sensível;
- não usar root DEBUG indiscriminadamente.

Exemplo local:

```yaml
logging:
  level:
    com.formacao.orders.payment:
      DEBUG
```

A alteração deve ser temporária e versionada apenas quando fizer parte do profile de laboratório.

---

### 30. Criar política de comparação

Arquivo:

```text
log-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  windows:
    equivalent:
      required

  normalizeBy:
    - request-count
    - operation-count

  dimensions:
    - release
    - instance
    - error_type
    - operation
    - dependency

  missingField:
    result:
      inconclusive

  mixedEnvironment:
    forbidden
```

Comparar logs exige contexto equivalente.

---

### 31. Criar política de qualidade

Arquivo:

```text
log-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  invalidJson:
    action:
      block-analysis

  missingTimestamp:
    action:
      block-sequence

  clockSkew:
    action:
      mark-order-uncertain

  missingService:
    action:
      block-correlation

  missingRelease:
    action:
      limit-comparison

  truncatedStackTrace:
    result:
      partial

  logGap:
    result:
      inconclusive

  duplicateEvent:
    action:
      investigate-pipeline
```

Logs também podem falhar.

---

### 32. Validar relógios

Compare timestamps de:

- API;
- worker;
- Collector;
- Prometheus;
- Tempo;
- host.

Clock skew pode produzir:

```text
consumer antes do producer;
```

sem que a causalidade esteja errada.

Trace relationships ajudam a corrigir interpretação temporal.

---

### 33. Relacionar logs e métricas

Fluxo:

```text
métrica:
erro aumentou às 14:04.

logs:
payment timeout começou às 14:04.

métrica:
retries aumentaram às 14:05.

logs:
retry.scheduled cresceu.

métrica:
latência p95 aumentou.

logs:
duration_ms da dependência cresceu.
```

A métrica localiza o período.

Os logs detalham eventos.

---

### 34. Relacionar logs e traces

Use trace ID para:

1. localizar trace lento;
2. identificar span dominante;
3. buscar logs do mesmo trace;
4. localizar exception;
5. comparar eventos;
6. validar outcome;
7. verificar release.

O trace mostra estrutura.

O log mostra eventos e detalhes.

---

### 35. Relacionar logs e release

Cada evento relevante precisa de release.

Perguntas:

- o erro apareceu somente depois do deploy;
- a frequência mudou;
- o fingerprint é novo;
- a duração mudou;
- a instância antiga permanece saudável;
- houve configuração diferente;
- o rollback removeu o padrão.

Essa comparação sustenta hipótese de regressão.

---

### 36. Criar política de segurança

Arquivo:

```text
log-security-policy.yaml
```

Conteúdo:

```yaml
security:
  prohibited:
    - password
    - authorization
    - access_token
    - refresh_token
    - cookie
    - request_body
    - response_body
    - customer_email
    - card_number
    - private_key

  identifiers:
    correlation_id:
      allowedForOperationalSearch

    trace_id:
      allowedForOperationalSearch

    businessId:
      restricted

  evidence:
    rawLogs:
      forbidden

  export:
    external:
      forbiddenInLaboratory
```

Busca operacional não autoriza publicação do identificador.

---

### 37. Criar failure policy

Arquivo:

```text
log-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidJson:
    action:
      block-query

  missingCorrelation:
    action:
      use-time-and-operation-with-limited-confidence

  missingTrace:
    action:
      continue-with-correlation-if-available

  truncatedLogs:
    result:
      partial

  collectionUnavailable:
    result:
      inconclusive

  excessiveVolume:
    action:
      narrow-window-and-fields

  sensitiveData:
    action:
      block-release

  threadDiagnosis:
    deferredToLesson570
```

A investigação precisa declarar limitações.

---

### 38. Criar cenários

Arquivo:

```text
log-troubleshooting-scenarios.yaml
```

Cenários:

```text
payment timeout;

serialization failure;

single-instance configuration drift;

retry amplification;

missing terminal event;

duplicate logging;

clock skew;

truncated stack trace;

missing correlation ID;

release regression;

worker processing failure;

telemetry gap.
```

Cada cenário precisa de:

- sintoma;
- janela;
- serviço;
- eventos esperados;
- primeiro desvio;
- hipótese;
- validação;
- conclusão;
- limitações;
- cleanup.

---

### 39. Simular timeout

Script:

```text
simulate-log-troubleshooting.ps1
```

Cenário:

1. configurar atraso local no payment simulator;
2. gerar pedidos;
3. coletar logs;
4. filtrar janela;
5. localizar erro;
6. agrupar fingerprints;
7. identificar primeiro desvio;
8. comparar release;
9. correlacionar trace;
10. registrar conclusão sanitizada.

Conclusão esperada:

```text
evidência consistente
com timeout da dependência
após mudança de configuração.
```

Evite declarar certeza além das fontes.

---

### 40. Simular drift por instance

Configure uma instance com timeout diferente.

Valide:

- mesma release;
- comportamento diferente;
- error type concentrado;
- instance identificada;
- config hash ou metadata divergente;
- hipótese de drift.

Não trate o problema como regressão global.

---

### 41. Simular evento terminal ausente

Interrompa o fluxo fake antes do evento final.

Valide:

- sequência incompleta;
- terminal event ausente;
- coleta ativa;
- processo finalizado;
- status `incomplete`;
- conclusão limitada.

Negative evidence precisa ser contextualizada.

---

### 42. Analisar padrões de stack trace

Script:

```text
analyze-stacktrace-patterns.ps1
```

O script deve:

- extrair exception class;
- extrair `Caused by`;
- identificar primeiro frame da aplicação;
- normalizar números de linha quando necessário;
- criar fingerprint;
- contar ocorrências;
- separar releases;
- separar instances;
- evitar persistir stack completo na evidence.

Resultado:

```text
fingerprint;

count;

first_seen;

last_seen;

release;

instance distribution.
```

---

### 43. Criar matriz de testes

Arquivo:

```text
LOG_TROUBLESHOOTING_TEST_MATRIX.md
```

Cenários:

- JSON válido;
- campo obrigatório;
- event catalog;
- level policy;
- window;
- service filter;
- environment filter;
- release filter;
- correlation filter;
- trace filter;
- ordering;
- first failure;
- complete success;
- complete failure;
- incomplete sequence;
- duplicate event;
- missing event;
- timeout fingerprint;
- serialization fingerprint;
- release comparison;
- instance comparison;
- clock skew;
- sampling;
- truncated stack;
- sensitive scan;
- evidence sanitizada.

---

### 44. Criar troubleshooting do laboratório

Arquivo:

```text
LOG_TROUBLESHOOTING_TROUBLESHOOTING.md
```

Inclua:

- log não é JSON;
- timestamp não parseia;
- timezone ausente;
- correlation ID ausente;
- trace ID ausente;
- release ausente;
- logs fora de ordem;
- stack trace quebrado em linhas;
- mensagem contém JSON aninhado;
- arquivo grande;
- `ConvertFrom-Json` lento;
- evento não catalogado;
- fingerprint instável;
- duplicação;
- sampling desconhecido;
- clock skew;
- output contém dados;
- thread dump antecipado.

---

### 45. Coletar evidence

Script:

```text
collect-log-troubleshooting-evidence.ps1
```

Arquivo:

```text
log-troubleshooting-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- services;
- time window;
- log contract status;
- event catalog status;
- field validation status;
- sequence status;
- first deviation status;
- error fingerprint count;
- release comparison status;
- instance comparison status;
- missing event status;
- stacktrace analysis status;
- sensitive scan status;
- scenarios status;
- tests status;
- timestamp.

Não inclua:

- logs brutos;
- stack traces completos;
- trace IDs reais;
- correlation IDs reais;
- IDs de negócio;
- payloads;
- credentials;
- dados pessoais.

---

### 46. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\logs\validate-log-contract.ps1

.\scripts\observability\logs\validate-log-events.ps1

.\scripts\observability\logs\validate-log-fields.ps1

.\scripts\observability\logs\collect-structured-logs.ps1

.\scripts\observability\logs\filter-logs-by-window.ps1

.\scripts\observability\logs\analyze-log-sequence.ps1

.\scripts\observability\logs\extract-first-failure.ps1

.\scripts\observability\logs\group-logs-by-error-type.ps1

.\scripts\observability\logs\analyze-stacktrace-patterns.ps1

.\scripts\observability\logs\compare-logs-by-release.ps1

.\scripts\observability\logs\compare-logs-by-instance.ps1

.\scripts\observability\logs\detect-missing-log-events.ps1

.\scripts\observability\logs\scan-log-output.ps1

.\scripts\observability\logs\simulate-log-troubleshooting.ps1

.\scripts\observability\logs\collect-log-troubleshooting-evidence.ps1

.\scripts\observability\logs\verify-log-troubleshooting-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- eventos catalogados;
- campos aprovados;
- níveis aprovados;
- janela correta;
- serviço e ambiente corretos;
- release identificada;
- sequência ordenada;
- primeiro desvio identificado;
- causa e consequência separadas;
- fingerprints estáveis;
- comparação por release aprovada;
- comparação por instance aprovada;
- eventos ausentes avaliados;
- sampling conhecido;
- stack traces analisados;
- dados sensíveis ausentes;
- evidence sanitizada;
- thread dump não antecipado.

---

### 47. Encerrar o laboratório

Pare as aplicações e remova somente arquivos temporários:

```powershell
Remove-Item `
  .tmp/logs `
  -Recurse `
  -Force
```

Antes:

- confirme que o path é `.tmp/logs`;
- colete evidence;
- preserve scripts;
- preserve documentos;
- não remova logs de outro ambiente;
- não execute limpeza global.

Os logs brutos do laboratório não entram no commit.

---

## Entendendo o que foi feito

### A investigação ganhou método

Busca aleatória foi substituída por sintoma, janela, serviço e sequência.

### As mensagens ganharam eventos

O catálogo passou a fornecer identidade estável.

### A correlação ganhou contexto

Correlation ID e trace ID conectaram fluxos sem virar evidence pública.

### O erro ganhou primeiro desvio

O evento terminal deixou de ser confundido com início do problema.

### Stack traces ganharam leitura sistemática

Exception, `Caused by`, frame da aplicação e fingerprint passaram a ser analisados.

### Releases ganharam comparação

Padrões novos e mudanças de frequência puderam ser identificados.

### Instances ganharam contraste

Drift local deixou de parecer regressão global.

### Ausências ganharam cautela

Negative evidence passou a depender da qualidade da coleta.

### Logs ganharam limites

Sampling, gaps, truncamento e clock skew passaram a ser registrados.

### A próxima aula ganhou fronteira clara

Thread dump irá investigar execução interna da JVM quando logs não explicarem contenção ou bloqueio.

---

## Erros comuns importantes

### Buscar apenas `ERROR`

Eventos anteriores e consequências ficam invisíveis.

### Abrir uma janela enorme

O volume dificulta localizar o desvio.

### Misturar ambientes

Eventos semelhantes são interpretados como um fluxo.

### Usar mensagem como identidade

Pequenas mudanças quebram agrupamentos.

### Tratar o último erro como causa

O primeiro desvio pode ter ocorrido antes.

### Ler apenas o topo do stack trace

A causa interna fica escondida.

### Comparar contagens sem tráfego

A release mais usada parece pior.

### Ignorar instance

Um drift local parece incidente global.

### Tratar evento ausente como prova

A coleta pode estar incompleta ou amostrada.

### Antecipar thread dump

Estados e stacks de threads pertencem à aula 570.

---

## Comandos úteis

### Coletar logs

```powershell
.\scripts\observability\logs\collect-structured-logs.ps1
```

### Filtrar janela

```powershell
.\scripts\observability\logs\filter-logs-by-window.ps1
```

### Analisar sequência

```powershell
.\scripts\observability\logs\analyze-log-sequence.ps1
```

### Comparar releases

```powershell
.\scripts\observability\logs\compare-logs-by-release.ps1
```

### Analisar stack traces

```powershell
.\scripts\observability\logs\analyze-stacktrace-patterns.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Crie eventos, campos e níveis.

### Parte 2 — Collection

Colete logs JSON por serviço.

### Parte 3 — Window

Delimite o intervalo do sintoma.

### Parte 4 — Correlation

Filtre correlation ID e trace ID.

### Parte 5 — Sequence

Reconstrua eventos e encontre o primeiro desvio.

### Parte 6 — Stack traces

Crie fingerprints e agrupe falhas.

### Parte 7 — Comparison

Compare release e instance.

### Parte 8 — Missing events

Valide negative evidence.

### Parte 9 — Security

Escaneie dados proibidos.

### Parte 10 — Gate

Execute cenário, evidence e validações.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 568 e ponte para a aula 570 foram preservadas;
- evento, campo estruturado, janela, correlação, sequência causal, primeiro desvio, sintoma, causa candidata, erro raiz, fingerprint, negative evidence, sampling, log gap e data quality foram definidos;
- baseline de logs foi validada;
- contrato de troubleshooting foi criado;
- investigação exige sintoma, ambiente, serviço e janela;
- catálogo de eventos foi criado;
- nomes de eventos são estáveis;
- política de campos foi criada;
- campos obrigatórios foram definidos;
- dados sensíveis foram proibidos;
- política de níveis foi criada;
- business rejection não é automaticamente ERROR;
- coleta estruturada foi criada;
- logs brutos permanecem temporários;
- janela temporal foi definida em UTC;
- filtro por janela foi criado;
- filtro por serviço e ambiente foi criado;
- filtro por release foi criado;
- correlation ID foi usado para busca;
- trace ID foi usado para busca;
- IDs reais não foram gravados na evidence;
- política de sequência foi criada;
- fluxo esperado foi documentado;
- sequência foi ordenada;
- primeiro desvio foi identificado;
- evento terminal não foi tratado automaticamente como causa;
- causa e consequência foram diferenciadas;
- erros foram agrupados por tipo;
- fingerprint estável foi criado;
- valores dinâmicos não entram no fingerprint;
- política de stack trace foi criada;
- `Caused by` foi analisado;
- primeiro frame da aplicação foi identificado;
- stack trace não foi usado como prova completa da causa;
- comparação entre releases foi criada;
- janelas equivalentes foram exigidas;
- tráfego foi considerado;
- comparação entre instances foi criada;
- drift local foi considerado;
- logs duplicados foram analisados;
- eventos ausentes foram detectados;
- negative evidence depende de coleta completa;
- política de sampling foi criada;
- eventos críticos não são amostrados;
- mudança temporária de nível é controlada;
- root DEBUG indiscriminado é proibido;
- política de comparação foi criada;
- política de data quality foi criada;
- JSON inválido bloqueia análise;
- clock skew foi considerado;
- logs foram relacionados a métricas;
- logs foram relacionados a traces;
- logs foram relacionados a releases;
- política de segurança foi criada;
- output bruto não entra em evidence;
- failure policy foi criada;
- cenários foram criados;
- timeout foi simulado;
- drift por instance foi simulado;
- evento terminal ausente foi simulado;
- padrões de stack trace foram analisados;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, dado pessoal, ambiente real ou log bruto foi commitado;
- thread dump não foi antecipado;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/log-troubleshooting `
  scripts/observability/logs `
  docs/observability/logs `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure dados proibidos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|request_body|response_body|customer_email|card_number|private_key"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar troubleshooting por logs"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- logs brutos;
- stack traces completos;
- trace IDs;
- correlation IDs;
- IDs de negócio;
- credentials;
- arquivos temporários;
- thread dumps;
- material da aula 570.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o troubleshooting por logs deixou de ser uma busca livre por mensagens e passou a seguir uma metodologia reproduzível.

Você criou:

```text
contrato;

catálogo de eventos;

políticas de campos e níveis;

janelas;

filtros;

sequências;

fingerprints;

comparações;

análise de stack traces;

data quality;

evidence.
```

Você comprovou que a investigação começa pelo sintoma, ambiente, serviço e janela; eventos estruturados são mais confiáveis que texto livre; correlation ID e trace ID conectam o fluxo; o primeiro desvio é diferente do erro terminal; stack traces precisam ser lidos por cadeia de causas e frames da aplicação; fingerprints precisam excluir valores dinâmicos; comparações entre releases exigem normalização; diferenças entre instances podem revelar drift; ausência de evento só é evidência quando a coleta é confiável; sampling e gaps limitam conclusões; clock skew altera a ordem aparente; e logs complementam métricas e traces.

A próxima aula será:

```text
570 - M18.15 - Thread dump
```

Nela, você irá investigar estados internos da JVM por meio de snapshots de threads, identificar bloqueios, espera, deadlocks, contenção, starvation e stacks repetidos.

Nenhuma coleta ou análise de thread dump, estado de thread, monitor lock, deadlock ou starvation foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contrato, catálogo e policies.
- [ ] Coletei logs estruturados.
- [ ] Delimitei janela, serviço e release.
- [ ] Filtrei correlation ID e trace ID.
- [ ] Reconstruí sequência e primeiro desvio.
- [ ] Analisei stack traces e fingerprints.
- [ ] Comparei releases e instances.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### O arquivo possui linhas não JSON

Separe output de startup, corrija encoder e bloqueie análise inconsistente.

### A sequência parece fora de ordem

Revise timezone, clock skew e timestamps.

### O correlation ID não aparece

Use trace ID ou janela com confiança limitada.

### O stack trace ficou truncado

Marque análise parcial e reproduza em laboratório.

### A release não está no log

Limite a comparação e corrija o contrato.

### O fingerprint muda em toda ocorrência

Remova números, IDs, timestamps e mensagens dinâmicas.

### Um erro aparece somente em uma instance

Investigue configuração, host, artifact, cache e pool locais.

### O evento esperado está ausente

Confirme sampling, coleta, processo e janela antes de concluir.

### O volume está muito alto

Reduza janela e campos; não descarte erros terminais.

### A investigação começou a analisar estados de threads

Preserve essa análise para a aula 570.

---

## Perguntas de revisão

1. O que é evento de log?
2. O que é campo estruturado?
3. O que é janela temporal?
4. O que é primeiro desvio?
5. Qual diferença entre sintoma e causa candidata?
6. O que é fingerprint?
7. O que é negative evidence?
8. Por que usar correlation ID?
9. Por que usar trace ID?
10. Como ler um stack trace?
11. O que significa `Caused by`?
12. Por que comparar releases?
13. Por que comparar instances?
14. Qual risco de contagem absoluta?
15. O que é log sampling?
16. O que é log gap?
17. Como clock skew afeta análise?
18. Como logs e traces se complementam?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Registro estruturado de um fato.
2. Atributo consultável.
3. Intervalo de investigação.
4. Primeiro evento fora do esperado.
5. Manifestação versus hipótese.
6. Identidade estável de erro.
7. Ausência de evento esperado.
8. Conectar eventos operacionais.
9. Conectar componentes distribuídos.
10. Exception, causas e frame da aplicação.
11. Cadeia de causa interna.
12. Detectar regressão.
13. Detectar drift local.
14. Ignorar volume.
15. Redução controlada.
16. Intervalo sem eventos.
17. Altera ordem aparente.
18. Detalhes e causalidade.
19. Thread dump.
20. Thread dump.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 569 - M18.14 - Troubleshooting por logs

- Continuei após Postmortem.
- Transformei troubleshooting por logs em um método reproduzível.
- Criei contrato de investigação.
- Criei catálogo de eventos estruturados.
- Criei políticas de campos e níveis.
- Defini janela temporal em UTC.
- Coletei logs JSON por serviço.
- Filtrei ambiente, serviço e release.
- Usei correlation ID para reconstruir fluxos.
- Usei trace ID para conectar API e worker.
- Criei política de sequência esperada.
- Identifiquei o primeiro desvio.
- Diferenciei sintoma, consequência e causa candidata.
- Agrupei falhas por error type.
- Criei fingerprints estáveis.
- Analisei exception, `Caused by` e primeiro frame da aplicação.
- Comparei releases com janelas equivalentes.
- Comparei instances para localizar drift.
- Analisei logs duplicados.
- Detectei eventos terminais ausentes.
- Tratei negative evidence com cautela.
- Criei política de sampling.
- Controlei alterações temporárias de nível.
- Considerei JSON inválido, truncamento, gaps e clock skew.
- Relacionei logs a métricas, traces e release metadata.
- Criei política de segurança.
- Simulei timeout, drift e sequência incompleta.
- Analisei padrões de stack trace.
- Coletei evidence sanitizada.
- Não antecipei análise de thread dump.
- Próxima aula: Thread dump.
```

---

## Referência técnica curta

- Structured Logging.
- Log Event Taxonomy.
- Correlation IDs.
- Trace and Log Correlation.
- Temporal Log Analysis.
- Stack Trace Analysis.
- Error Fingerprinting.
- Log Sampling.
- Negative Evidence.
- Log Data Quality.

Regra final:

```text
troubleshooting por logs precisa reconstruir eventos e não apenas localizar mensagens ERROR: a investigação começa por sintoma, ambiente, serviço, release e janela temporal, usa eventos estruturados, correlation ID e trace ID para ordenar fluxos e identifica o primeiro desvio antes do erro terminal; stack traces são lidos pela exception principal, cadeia Caused by, primeiro frame da aplicação e fingerprint estável, enquanto valores dinâmicos permanecem fora do agrupamento; releases e instances são comparadas em janelas equivalentes e normalizadas por tráfego, eventos ausentes somente são evidência quando coleta, sampling, relógios e fluxo esperado são confiáveis, e gaps, truncamento, duplicação e JSON inválido limitam conclusões; logs complementam métricas, traces e release metadata, dados sensíveis e outputs brutos não entram na evidence e o cleanup é específico, deixando para a aula 570 a coleta e análise de thread dumps, estados de threads, monitors, deadlocks, contenção e starvation.
```
