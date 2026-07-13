# 567 - M18.12 - Runbooks

## Apresentação da aula

Na aula 566, a plataforma de observabilidade passou a detectar condições relevantes e transformá-las em alertas acionáveis.

Foram criados alertas como:

```text
OrdersApiTargetDown;

OrdersApiHighTechnicalErrorRate;

OrdersApiHighLatency;

OrdersInternalQueueNearCapacity;

OrdersErrorBudgetFastBurn;

OrdersWorkerBacklogGrowing.
```

Cada alerta passou a possuir:

- nome estável;
- severidade;
- serviço;
- ambiente;
- owner;
- resumo;
- descrição;
- ação inicial;
- referência para dashboard;
- referência estável para runbook.

A referência, porém, ainda apontava apenas para um identificador como:

```text
runbook:orders-api/high-technical-error-rate
```

Ela não continha o procedimento completo.

Quando um alerta dispara, a pessoa responsável não deveria começar do zero.

Ela precisa encontrar rapidamente:

```text
qual condição foi detectada;

como confirmar o impacto;

quais sinais consultar;

quais riscos evitar;

quais ações são seguras;

quando mitigar;

quando realizar rollback;

quando escalar;

quais evidências registrar;

quando encerrar.
```

Um runbook é um procedimento operacional reproduzível.

Ele reduz improvisação durante pressão, mas não substitui julgamento técnico.

Um runbook ruim pode ser tão perigoso quanto a ausência de runbook. A instrução “reinicie a aplicação” não valida impacto, tráfego, release, dependências, escopo, risco ou rollback.

Um runbook melhor possui gates.

Exemplo:

```text
1.
confirmar firing e ambiente.

2.
confirmar impacto em golden signals.

3.
verificar release e mudanças recentes.

4.
classificar origem provável.

5.
aplicar mitigação reversível.

6.
avaliar rollback.

7.
validar recuperação.

8.
registrar evidências.

9.
encerrar ou escalar.
```

A pergunta central desta aula será:

```text
como transformar
cada alerta

em uma resposta operacional
segura,
reproduzível,
auditável
e reversível?
```

Você irá construir runbooks executáveis por outra pessoa, cobrindo identificação, confirmação, triagem, diagnóstico, mitigação, rollback, escalonamento, comunicação, evidências, recuperação, encerramento, validação e versionamento.

A aula não irá produzir um postmortem completo.

Não serão formalizados:

- narrativa pós-incidente;
- timeline retrospectiva definitiva;
- análise sistêmica de causas contribuintes;
- classificação final da causa raiz;
- ações preventivas de longo prazo;
- análise sem culpabilização;
- revisão organizacional;
- publicação do documento pós-incidente.

Esses tópicos pertencem à próxima aula oficial:

```text
568 - M18.13 - Postmortem
```

Nesta aula serão registrados fatos e evidências durante a resposta.

A análise retrospectiva completa ficará para a aula 568.

A regra central será:

```text
um runbook deve
orientar decisões

sem esconder riscos,
automatizar ações destrutivas
ou substituir diagnóstico.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
565:
Tracing distribuido.

566:
Alertas.

567:
Runbooks.

568:
Postmortem.
```

A progressão é:

```text
observar;

detectar;

notificar;

responder;

aprender.
```

Nesta aula:

```text
runbook:
sim.

triagem:
sim.

diagnóstico:
sim.

mitigação:
sim.

rollback:
sim.

escalonamento:
sim.

comunicação operacional:
sim.

evidências:
sim.

encerramento:
sim.

teste de runbook:
sim.

postmortem completo:
não.

causa raiz definitiva:
não.

plano preventivo final:
não.
```

Os runbooks usarão Grafana, Prometheus, Alertmanager, logs, traces, Actuator, health, release metadata, golden signals, SLIs, error budget e alert lifecycle.

O objetivo é conectar esses recursos em uma sequência operacional coerente.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
operations/runbooks
├── runbook-catalog.yaml
├── runbook-contract.yaml
├── runbook-severity-policy.yaml
├── runbook-evidence-policy.yaml
├── runbook-communication-policy.yaml
├── runbook-escalation-policy.yaml
├── runbook-change-safety-policy.yaml
├── runbook-validation-policy.yaml
├── runbook-execution-record-template.yaml
├── orders-api
│   ├── TARGET_DOWN.md
│   ├── HIGH_TECHNICAL_ERROR_RATE.md
│   ├── HIGH_LATENCY.md
│   └── ERROR_BUDGET_FAST_BURN.md
├── orders-worker
│   ├── QUEUE_NEAR_CAPACITY.md
│   └── BACKLOG_GROWING.md
└── shared
    ├── TELEMETRY_UNAVAILABLE.md
    ├── DEPENDENCY_DEGRADED.md
    ├── RELEASE_ROLLBACK.md
    └── INCIDENT_HANDOFF.md

scripts/operations/runbooks
├── validate-runbook-catalog.ps1
├── validate-runbook-contract.ps1
├── validate-runbook-links.ps1
├── validate-runbook-commands.ps1
├── validate-runbook-safety.ps1
├── simulate-target-down-runbook.ps1
├── simulate-error-rate-runbook.ps1
├── simulate-high-latency-runbook.ps1
├── simulate-queue-saturation-runbook.ps1
├── simulate-fast-burn-runbook.ps1
├── validate-runbook-execution-record.ps1
├── collect-runbook-evidence.ps1
└── verify-runbook-baseline.ps1

docs/operations/runbooks
├── RUNBOOKS_OVERVIEW.md
├── RUNBOOK_WRITING_GUIDE.md
├── RUNBOOK_EXECUTION_GUIDE.md
├── RUNBOOK_TEST_MATRIX.md
└── RUNBOOK_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, contrato operacional, procedimentos por alerta, ações seguras, rollback, escalonamento, comunicação, registros de execução, testes e gate automatizado.

Você irá criar contratos, catálogo, políticas, runbooks por alerta, templates, validações, drills, evidence, gate e commit.

---

## Conceito essencial

### Runbook

Procedimento operacional documentado para responder a uma condição conhecida.

---

### Playbook

Conjunto mais amplo de estratégias e decisões para uma categoria de situação.

---

### Triage

Avaliação inicial usada para confirmar impacto, escopo e prioridade.

---

### Diagnosis

Processo de formular e validar hipóteses sobre a condição observada.

---

### Mitigation

Ação destinada a reduzir impacto antes da correção definitiva.

---

### Remediation

Ação que corrige a condição ou sua causa técnica conhecida.

---

### Rollback

Retorno controlado a uma versão ou configuração anterior.

---

### Escalation

Transferência ou ampliação da resposta para pessoas com responsabilidade ou conhecimento adicional.

---

### Handoff

Transferência estruturada de contexto entre responsáveis.

---

### Recovery

Retorno do serviço ao comportamento aceitável.

---

### Closure criteria

Conjunto de condições necessárias para encerrar a resposta.

---

### Evidence

Registro sanitizado que sustenta decisões e resultados.

---

### Safe command

Comando com escopo conhecido, impacto limitado e validação antes e depois.

---

### Destructive action

Ação que remove dados, reinicia componentes, altera tráfego ou dificulta reversão.

---

### Runbook drill

Execução controlada do runbook em laboratório ou ambiente seguro.

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

Suba o laboratório de alertas:

```powershell
.\scripts\observability\alerts\start-alerting-lab.ps1
```

Confirme:

- aplicação saudável;
- worker saudável;
- targets `UP`;
- alertas `inactive`;
- dashboards disponíveis;
- logs disponíveis;
- traces disponíveis;
- release ID conhecida;
- nenhum runbook completo existente;
- nenhuma credencial real;
- nenhum incidente real em andamento.

Registre a baseline em arquivo temporário fora do commit.

---

### 2. Criar contrato de runbook

Arquivo:

```text
runbook-contract.yaml
```

Conteúdo:

```yaml
runbook:
  id:
    required

  title:
    required

  alertNames:
    required

  service:
    required

  owner:
    required

  severity:
    required

  purpose:
    required

  prerequisites:
    required

  confirmation:
    required

  diagnosis:
    required

  mitigation:
    required

  rollback:
    requiredWhenApplicable

  escalation:
    required

  communication:
    required

  evidence:
    required

  recoveryValidation:
    required

  closureCriteria:
    required

  prohibitedActions:
    required

  lastValidatedAt:
    required

  version:
    required
```

O contrato garante estrutura mínima.

Não garante qualidade sozinho.

---

### 3. Criar catálogo de runbooks

Arquivo:

```text
runbook-catalog.yaml
```

Conteúdo:

```yaml
runbooks:
  - id:
      runbook:orders-api/target-down

    file:
      orders-api/TARGET_DOWN.md

    alerts:
      - OrdersApiTargetDown

    owner:
      platform

  - id:
      runbook:orders-api/high-technical-error-rate

    file:
      orders-api/HIGH_TECHNICAL_ERROR_RATE.md

    alerts:
      - OrdersApiHighTechnicalErrorRate

    owner:
      orders-team

  - id:
      runbook:orders-api/high-latency

    file:
      orders-api/HIGH_LATENCY.md

    alerts:
      - OrdersApiHighLatency

    owner:
      orders-team

  - id:
      runbook:orders-worker/queue-near-capacity

    file:
      orders-worker/QUEUE_NEAR_CAPACITY.md

    alerts:
      - OrdersInternalQueueNearCapacity

    owner:
      orders-team

  - id:
      runbook:orders-api/error-budget-fast-burn

    file:
      orders-api/ERROR_BUDGET_FAST_BURN.md

    alerts:
      - OrdersErrorBudgetFastBurn

    owner:
      orders-team
```

Cada referência da aula 566 precisa resolver para um arquivo.

---

### 4. Definir anatomia do runbook

Todos os runbooks terão identificação, uso, impacto, pré-requisitos, proibições, confirmação, triagem, diagnóstico, mitigação, rollback, escalonamento, comunicação, evidências, recuperação, encerramento, handoff e histórico.

A ordem precisa ser previsível.

Durante pressão, a pessoa não deve procurar onde está o rollback.

---

### 5. Definir política de evidências

Arquivo:

```text
runbook-evidence-policy.yaml
```

Conteúdo:

```yaml
evidence:
  allowed:
    - alert-name
    - alert-status
    - service
    - environment
    - release-id
    - time-window
    - dashboard-reference
    - sanitized-query-result
    - action-executed
    - action-result
    - owner
    - timestamps

  forbidden:
    - password
    - token
    - authorization
    - cookie
    - request-body
    - response-body
    - customer-id
    - user-email
    - complete-trace
    - complete-log-file

  trace:
    storeId:
      false

    storeReference:
      sanitized

  screenshots:
    productionData:
      forbidden
```

Evidence precisa sustentar decisões sem copiar dados sensíveis.

---

### 6. Criar registro de execução

Arquivo:

```text
runbook-execution-record-template.yaml
```

Conteúdo:

```yaml
execution:
  id:
    generated

  runbookId:
    required

  runbookVersion:
    required

  startedAt:
    required

  endedAt:
    optional-until-closure

  executor:
    role-only

  service:
    required

  environment:
    required

  alert:
    name:
      required

    startedAt:
      required

  impact:
    status:
      unknown

  release:
    current:
      required

    previous:
      optional

  actions:
    - timestamp:
        required

      step:
        required

      result:
        required

  escalation:
    performed:
      false

  recovery:
    validated:
      false

  closure:
    status:
      open
```

Não registre nome pessoal quando o laboratório não precisa.

Use função ou papel.

---

### 7. Definir comandos seguros

Arquivo:

```text
runbook-change-safety-policy.yaml
```

Regras:

```yaml
commands:
  beforeExecution:
    required:
      - confirm-environment
      - confirm-service
      - confirm-current-state
      - confirm-reversibility

  destructive:
    require:
      - explicit-approval
      - backup-or-safe-state
      - rollback-plan

  forbiddenByDefault:
    - docker-system-prune
    - database-truncate
    - delete-all-messages
    - scale-to-zero-production
    - disable-all-alerts
    - remove-persistent-volume

  cleanup:
    specific:
      required
```

Nenhum runbook deve recomendar uma limpeza global por conveniência.

---

### 8. Criar política de comunicação

Arquivo:

```text
runbook-communication-policy.yaml
```

Conteúdo:

```yaml
communication:
  initialUpdate:
    include:
      - service
      - environment
      - impact
      - start-time
      - current-action
      - next-update

  progressUpdate:
    include:
      - confirmed-facts
      - hypothesis
      - action
      - result
      - risk

  recoveryUpdate:
    include:
      - recovery-time
      - validation
      - monitoring-window
      - remaining-risk

  prohibited:
    - unverified-root-cause
    - blame
    - sensitive-data
    - unsupported-estimate
```

A comunicação separa fato de hipótese.

---

### 9. Criar política de escalonamento

Arquivo:

```text
runbook-escalation-policy.yaml
```

Exemplo:

```yaml
escalation:
  immediate:
    conditions:
      - critical-user-impact
      - data-integrity-risk
      - security-risk
      - no-safe-mitigation

  technical:
    conditions:
      - unknown-dependency-failure
      - rollback-failed
      - repeated-recurrence
      - telemetry-unavailable

  product:
    conditions:
      - business-journey-blocked
      - customer-impact-confirmed

  platform:
    conditions:
      - target-down
      - network
      - orchestration
      - resource-exhaustion

  handoff:
    requiredFields:
      - facts
      - impact
      - timeline-so-far
      - actions
      - results
      - open-hypotheses
      - next-safe-step
```

O runbook não inventa nomes reais de pessoas.

Ele usa papéis e equipes.

---

### 10. Escrever o runbook de target down

Arquivo:

```text
orders-api/TARGET_DOWN.md
```

H1:

```markdown
# Runbook — OrdersApiTargetDown
```

Objetivo:

```text
restaurar a capacidade
de coleta e atendimento

sem reiniciar
indiscriminadamente
todos os componentes.
```

Confirmação:

```powershell
Invoke-RestMethod `
  http://localhost:9090/api/v1/targets
```

Consulte:

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/health
```

Valide:

- processo ativo;
- porta;
- endpoint;
- last error;
- DNS ou network;
- profile;
- release;
- logs de startup.

---

### 11. Triagem do target down

Classifique:

```text
A.
aplicação parada.

B.
aplicação viva,
endpoint indisponível.

C.
Prometheus sem conectividade.

D.
configuração de scrape inválida.

E.
deploy em andamento.

F.
telemetria degradada,
negócio ainda funcional.
```

A classificação evita restart quando apenas o scraping falhou.

---

### 12. Diagnóstico do target down

Sequência:

1. confirmar ambiente;
2. confirmar estado do alerta;
3. consultar target;
4. consultar health diretamente;
5. verificar processo ou container;
6. verificar logs de startup;
7. verificar porta;
8. verificar configuração de scrape;
9. verificar mudança recente;
10. comparar release anterior.

Comandos seguros:

```powershell
docker ps

docker logs `
  orders-api `
  --tail 200

Test-NetConnection `
  localhost `
  -Port 8080
```

Não copie logs completos para evidence.

---

### 13. Mitigação do target down

Possibilidades controladas:

- restaurar configuração de scrape;
- corrigir profile incorreto;
- reiniciar somente a instância afetada;
- reverter configuração inválida;
- restaurar release anterior;
- retirar instância não pronta do tráfego;
- escalar para plataforma quando a network está indisponível.

Antes do restart, confirme operações em andamento, readiness, réplica disponível, release, horário e escopo.

---

### 14. Validação de recuperação do target down

Confirme:

```text
target:
UP.

health:
UP.

readiness:
UP.

tráfego:
presente ou esperado.

erro:
normal.

latência:
normal.

alerta:
resolved.
```

Aguarde uma janela mínima de observação.

Não encerre imediatamente após um único scrape bem-sucedido.

---

### 15. Escrever o runbook de erro técnico

Arquivo:

```text
orders-api/HIGH_TECHNICAL_ERROR_RATE.md
```

Confirme:

- alerta firing;
- tráfego mínimo;
- error ratio;
- categorias de erro;
- release;
- dependências;
- distribuição por instance;
- traces com erro;
- logs correlacionados.

Consultas:

```promql
orders:technical_errors:ratio5m
```

```promql
sum by (error_type) (
  rate(
    orders_creation_seconds_count{
      outcome=~"failure|timeout"
    }[5m]
  )
)
```

Adapte aos nomes reais do catálogo.

---

### 16. Classificar erro técnico

Categorias:

```text
dependency_timeout;

dependency_unavailable;

database_error;

serialization_failure;

internal_failure;

configuration_error.
```

Não trate business rejection como erro técnico.

O runbook precisa confirmar a categoria antes de selecionar mitigação.

---

### 17. Diagnosticar erro técnico

Sequência:

1. comparar antes e depois da release;
2. confirmar se todas as instâncias falham;
3. verificar dependência obrigatória;
4. verificar connection pool;
5. verificar timeouts;
6. abrir trace lento ou com erro;
7. localizar span causador;
8. buscar logs pelo trace ID;
9. verificar configuração;
10. verificar retries e amplificação.

Registre hipóteses sem tratá-las como causa confirmada.

---

### 18. Mitigar erro técnico

Ações possíveis:

- rollback de release regressiva;
- desabilitar feature flag segura;
- restaurar configuração anterior;
- redirecionar para fallback aprovado;
- reduzir concorrência quando a dependência satura;
- pausar producer quando o downstream está indisponível;
- remover uma instância defeituosa;
- corrigir timeout somente com evidência.

Não aumente retries automaticamente.

Retry excessivo pode ampliar a falha.

---

### 19. Escrever runbook de latência

Arquivo:

```text
orders-api/HIGH_LATENCY.md
```

Confirme:

- tráfego suficiente;
- p50, p95 e p99;
- outcome;
- saturação;
- dependências;
- release;
- filas;
- pool;
- traces lentos.

Pergunta inicial:

```text
a latência é
da borda,
do negócio,
da dependência
ou da fila?
```

Métricas diferentes representam pontos diferentes.

---

### 20. Diagnosticar latência

Matriz inicial:

```text
latência alta;
tráfego alto;
saturação alta:
capacidade insuficiente.

latência alta;
tráfego estável;
dependência lenta:
downstream.

latência alta;
erros altos:
timeouts ou falha.

latência alta;
fila crescente:
throughput insuficiente.

latência alta após release:
regressão possível.
```

Use traces para encontrar o caminho crítico.

Não some spans sobrepostos.

---

### 21. Mitigar latência

Ações reversíveis:

- rollback de release;
- reduzir trabalho opcional;
- ativar cache aprovado;
- limitar concorrência;
- pausar processamento não prioritário;
- remover instância degradada;
- ajustar capacidade local do laboratório;
- aplicar fallback documentado.

A ação precisa ser compatível com consistência e domínio.

Não sacrifique integridade para melhorar um gráfico.

---

### 22. Escrever runbook de fila perto da capacidade

Arquivo:

```text
orders-worker/QUEUE_NEAR_CAPACITY.md
```

Confirme:

- queue size;
- queue capacity;
- utilization;
- input rate;
- completion rate;
- active tasks;
- error rate;
- retry rate;
- dependency latency.

A fila é sintoma de diferença entre entrada e saída.

---

### 23. Diagnosticar saturação de fila

Hipóteses:

- entrada aumentou;
- worker ficou lento;
- dependência degradou;
- retries aumentaram;
- consumer foi reduzido;
- partições estão desequilibradas;
- payload cresceu;
- pool saturou;
- release regrediu.

Verifique a tendência.

Um valor alto isolado pode ser transitório.

---

### 24. Mitigar saturação de fila

Ações:

- reduzir ou pausar entrada não crítica;
- restaurar consumer saudável;
- aumentar consumers somente quando downstream suporta;
- corrigir retry storm;
- remover mensagem inválida por procedimento seguro;
- isolar poison message;
- restaurar versão anterior;
- aumentar capacidade local temporariamente com limite.

Nunca delete toda a fila.

Preserve evidência e rastreabilidade.

---

### 25. Escrever runbook de backlog crescente

Arquivo:

```text
orders-worker/BACKLOG_GROWING.md
```

O backlog pode crescer mesmo antes da fila atingir 90%.

Confirme:

```text
entrada > conclusão;

lag crescente;

duração crescente;

tarefas ativas;

erros;

retries.
```

Diferencie:

- aumento esperado de tráfego;
- queda de throughput;
- bloqueio total;
- atraso temporário;
- reprocessamento.

O runbook evita prometer recuperação sem base.

---

### 26. Escrever runbook de fast burn

Arquivo:

```text
orders-api/ERROR_BUDGET_FAST_BURN.md
```

Confirme:

- SLO didático;
- error budget fraction;
- long window;
- short window;
- volume;
- erro técnico;
- impacto;
- release;
- estado dos outros sinais.

O fast burn não informa sozinho a causa.

Ele informa urgência do consumo.

---

### 27. Responder ao fast burn

Prioridades:

1. confirmar dados;
2. confirmar impacto;
3. interromper mudança arriscada;
4. avaliar rollback;
5. estabilizar;
6. reduzir exposição;
7. escalar;
8. monitorar consumo;
9. registrar fatos.

A ação pode incluir congelar novos deploys do serviço durante a investigação.

No laboratório, isso será apenas uma decisão documentada.

---

### 28. Criar runbook compartilhado de rollback

Arquivo:

```text
shared/RELEASE_ROLLBACK.md
```

Conteúdo mínimo:

- quando considerar;
- pré-condições;
- versão atual;
- versão anterior;
- compatibilidade de banco;
- migrations;
- feature flags;
- contratos;
- mensagens em trânsito;
- comando local;
- validação;
- abort criteria;
- forward fix alternative.

Antes de rollback:

```text
confirmar que a versão anterior
pode operar sobre
o estado atual.
```

Rollback de código não desfaz automaticamente dados ou migrations.

---

### 29. Definir gate de rollback

Perguntas:

```text
a migration é backward compatible?

a mensagem mudou de schema?

a versão anterior entende os dados?

há transações em andamento?

a feature flag pode mitigar?

o artifact anterior está disponível?

o rollback foi testado?

qual indicador confirma sucesso?
```

Se alguma resposta crítica é desconhecida, escale antes de executar.

---

### 30. Criar runbook de dependência degradada

Arquivo:

```text
shared/DEPENDENCY_DEGRADED.md
```

Diferencie:

- timeout;
- conexão recusada;
- taxa limitada;
- resposta inválida;
- latência;
- indisponibilidade parcial;
- credencial expirada;
- DNS.

Ações variam por categoria.

Não aplique retry igual para todas.

---

### 31. Criar runbook de telemetria indisponível

Arquivo:

```text
shared/TELEMETRY_UNAVAILABLE.md
```

Cenários:

- Prometheus down;
- Grafana down;
- Tempo down;
- Collector down;
- logs indisponíveis;
- Alertmanager down.

O negócio pode continuar.

A capacidade de diagnóstico fica degradada.

O runbook deve:

- confirmar impacto na observabilidade;
- preservar operação;
- usar fontes alternativas;
- evitar decisões sem dados;
- registrar janela sem telemetria;
- restaurar componentes;
- validar gaps.

---

### 32. Criar runbook de handoff

Arquivo:

```text
shared/INCIDENT_HANDOFF.md
```

Template:

```text
Situação:

Impacto confirmado:

Ambiente:

Serviços:

Início:

Alertas:

Release:

Fatos:

Hipóteses:

Ações executadas:

Resultados:

Riscos:

Próximo passo seguro:

Evidências:

Responsabilidade transferida para:
```

O handoff precisa permitir continuidade sem repetir todo diagnóstico.

---

### 33. Definir comunicação inicial

Mensagem operacional modelo:

```text
Investigando degradação na orders-api
no ambiente local do laboratório.

Impacto atual:
criação de pedidos apresenta
falhas técnicas elevadas.

Início observado:
<timestamp>.

Ação atual:
comparação de release,
dependências e traces.

Próxima atualização:
após a primeira validação.
```

Não declare causa sem confirmação.

Não forneça estimativa não sustentada.

---

### 34. Definir comunicação de recuperação

Modelo:

```text
A orders-api retornou
ao comportamento esperado.

Validações:
target UP;
readiness UP;
error ratio normal;
latência normal;
fila estável;
alerta resolved.

A condição permanecerá
em observação
pela janela definida.
```

O encerramento ocorre depois da janela de estabilidade.

---

### 35. Definir critérios de encerramento

Arquivo ou seção em cada runbook:

```yaml
closure:
  require:
    - alert-resolved
    - health-up
    - readiness-up
    - golden-signals-normal
    - no-active-mitigation-risk
    - evidence-complete
    - owner-acknowledgement

  observationWindow:
    required

  unresolvedHypothesis:
    allowedIfDocumented:
      true

  postmortemCandidate:
    marked:
      true
```

Não é necessário conhecer a causa definitiva para restaurar o serviço.

Mas a incerteza precisa ser registrada.

---

### 36. Definir proibições por runbook

Exemplos:

```text
não apagar fila;

não truncar banco;

não remover volume;

não desabilitar todos os alertas;

não aumentar retry sem limite;

não reiniciar todas as réplicas;

não executar cleanup global;

não copiar dados sensíveis;

não atribuir culpa;

não declarar causa sem evidência.
```

As proibições aparecem próximas das ações.

Não escondidas no final.

---

### 37. Criar política de validação periódica

Arquivo:

```text
runbook-validation-policy.yaml
```

Conteúdo:

```yaml
validation:
  cadence:
    quarterly

  afterChanges:
    requiredWhen:
      - alert-rule-changed
      - dashboard-changed
      - service-topology-changed
      - deployment-process-changed
      - owner-changed

  drill:
    environment:
      local-or-controlled

  staleRunbook:
    action:
      block-operational-readiness

  requiredMetadata:
    - version
    - owner
    - lastValidatedAt
    - nextValidationDue
```

Runbook não testado é hipótese.

---

### 38. Criar teste de links

Script:

```text
validate-runbook-links.ps1
```

Valide:

- todo `runbook_ref` existe;
- todo arquivo consta no catálogo;
- nenhum ID duplicado;
- dashboard ref existe;
- owner existe;
- alerta existe;
- links relativos são válidos;
- nenhuma URL corporativa;
- nenhuma referência quebrada.

---

### 39. Criar teste de comandos

Script:

```text
validate-runbook-commands.ps1
```

Procure:

- comando sintaticamente válido;
- path existente;
- Compose correto;
- service correto;
- nenhuma limpeza global;
- nenhum wildcard destrutivo;
- nenhuma credencial;
- confirmação antes de ação;
- validação depois de ação.

O script valida estrutura e allowlist sem executar ações destrutivas.

---

### 40. Criar teste de segurança

Script:

```text
validate-runbook-safety.ps1
```

Bloqueie:

```text
docker system prune;

kubectl delete namespace;

DROP DATABASE;

TRUNCATE;

DELETE sem filtro;

queue purge;

disable all alerts;

remove all volumes.
```

Quando um comando de alto risco for realmente necessário, ele precisa estar em procedimento separado com aprovação explícita.

No laboratório desta aula, ele permanece proibido.

---

### 41. Simular target down

Script:

```text
simulate-target-down-runbook.ps1
```

Fluxo:

1. confirmar baseline;
2. disparar cenário;
3. abrir o runbook correto;
4. criar execution record;
5. executar confirmação;
6. classificar;
7. aplicar mitigação local;
8. validar recuperação;
9. completar evidence;
10. encerrar.

Valide se outra pessoa consegue seguir o documento sem explicação verbal.

---

### 42. Simular erro técnico

Script:

```text
simulate-error-rate-runbook.ps1
```

Gere falha controlada.

O exercício precisa validar:

- categoria;
- release;
- traces;
- logs;
- dependência;
- mitigação;
- rollback decision;
- resolved;
- comunicação;
- registro de execução.

Forneça nomes de queries explicitamente.

---

### 43. Simular latência

Script:

```text
simulate-high-latency-runbook.ps1
```

Valide:

- p95;
- tráfego;
- saturação;
- caminho crítico;
- dependency span;
- ação reversível;
- recuperação;
- observação.

O runbook precisa diferenciar latência e erro.

---

### 44. Simular saturação

Script:

```text
simulate-queue-saturation-runbook.ps1
```

Valide:

- fila;
- capacidade;
- entrada;
- conclusão;
- active tasks;
- retries;
- mitigation;
- drenagem;
- ausência de purge;
- fechamento.

---

### 45. Simular fast burn

Script:

```text
simulate-fast-burn-runbook.ps1
```

Valide:

- duas janelas;
- SLO didático;
- impacto;
- decisão de freeze;
- rollback;
- escalonamento;
- recuperação;
- budget restante;
- evidências.

Não transforme o exercício em política de produção.

---

### 46. Criar matriz de testes

Arquivo:

```text
RUNBOOK_TEST_MATRIX.md
```

Cenários:

- catálogo completo;
- alert ref resolvida;
- owner presente;
- severidade presente;
- pré-requisitos;
- proibições;
- confirmação;
- diagnóstico;
- mitigação;
- rollback;
- escalonamento;
- comunicação;
- evidence;
- recovery;
- closure;
- handoff;
- target down;
- error rate;
- latency;
- queue saturation;
- backlog;
- fast burn;
- telemetry unavailable;
- dependency degraded;
- stale runbook;
- command safety;
- no sensitive data.

---

### 47. Criar troubleshooting

Arquivo:

```text
RUNBOOK_TROUBLESHOOTING.md
```

Inclua:

- alerta sem runbook;
- runbook ref quebrada;
- comando desatualizado;
- dashboard renomeado;
- query inexistente;
- owner ausente;
- rollback impossível;
- migration incompatível;
- dependência sem health;
- evidence contém dados;
- executor pula confirmação;
- restart vira primeira ação;
- alerta resolve durante investigação;
- handoff incompleto;
- runbook não testado;
- procedimento contraditório;
- causa tratada como fato;
- postmortem antecipado.

---

### 48. Coletar evidence

Script:

```text
collect-runbook-evidence.ps1
```

Arquivo:

```text
runbook-evidence.json.
```

Campos permitidos:

- lesson;
- environment;
- runbook count;
- alert mapping status;
- link validation status;
- command validation status;
- safety validation status;
- drill count;
- target down drill status;
- error rate drill status;
- latency drill status;
- saturation drill status;
- fast burn drill status;
- execution records status;
- sensitive scan status;
- tests status;
- timestamp.

Não inclua:

- logs completos;
- traces completos;
- credentials;
- IDs de negócio;
- nomes pessoais;
- dados reais;
- análise retrospectiva final.

---

### 49. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\operations\runbooks\validate-runbook-catalog.ps1

.\scripts\operations\runbooks\validate-runbook-contract.ps1

.\scripts\operations\runbooks\validate-runbook-links.ps1

.\scripts\operations\runbooks\validate-runbook-commands.ps1

.\scripts\operations\runbooks\validate-runbook-safety.ps1

.\scripts\operations\runbooks\simulate-target-down-runbook.ps1

.\scripts\operations\runbooks\simulate-error-rate-runbook.ps1

.\scripts\operations\runbooks\simulate-high-latency-runbook.ps1

.\scripts\operations\runbooks\simulate-queue-saturation-runbook.ps1

.\scripts\operations\runbooks\simulate-fast-burn-runbook.ps1

.\scripts\operations\runbooks\validate-runbook-execution-record.ps1

.\scripts\operations\runbooks\collect-runbook-evidence.ps1

.\scripts\operations\runbooks\verify-runbook-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- catálogo completo;
- referências resolvidas;
- contratos completos;
- comandos aprovados;
- segurança aprovada;
- target down simulado;
- erro simulado;
- latência simulada;
- saturação simulada;
- fast burn simulado;
- handoff aprovado;
- execution records aprovados;
- evidence sanitizada;
- postmortem não antecipado.

---

### 50. Encerrar o laboratório

Encerre os cenários ativos.

Execute apenas o Compose correto:

```powershell
docker compose `
  --file `
  observability/alerts/alerting-compose.yml `
  down
```

Quando outros componentes estiverem em Compose separado, encerre cada arquivo explicitamente.

Antes:

- colete evidence;
- confirme estado resolvido;
- finalize execution records;
- confirme que não existe processo Java pendente;
- preserve artifacts versionados.

Não remova volumes indiscriminadamente.

---

## Entendendo o que foi feito

### Alertas ganharam procedimentos

Cada condição passou a apontar para uma resposta conhecida.

### A resposta ganhou gates

Confirmação ocorre antes de mitigação.

### Diagnóstico ganhou sequência

Golden signals, releases, dependencies, traces e logs passaram a ser usados de forma ordenada.

### Mitigações ganharam reversibilidade

Ações locais e controladas são preferidas.

### Rollback ganhou pré-condições

Compatibilidade de dados e migrations passou a ser verificada.

### Escalonamento ganhou critérios

A transferência de responsabilidade deixou de depender de improviso.

### Comunicação ganhou estrutura

Fatos e hipóteses passaram a ser separados.

### Evidence ganhou política

Decisões ficam auditáveis sem expor dados.

### Encerramento ganhou critérios

Resolver o alerta não é o único requisito.

### A próxima aula ganhou fatos confiáveis

O postmortem poderá partir de registros produzidos durante a resposta.

---

## Erros comuns importantes

### Reiniciar primeiro

A evidência pode ser perdida e a causa pode permanecer.

### Escrever comandos sem ambiente

A ação pode atingir o alvo errado.

### Prescrever rollback sem validar dados

A versão anterior pode ser incompatível.

### Aumentar retries

A dependência degradada pode receber ainda mais carga.

### Apagar fila

Integridade e rastreabilidade são perdidas.

### Encerrar quando o alerta resolve

A recuperação pode ser temporária.

### Registrar hipótese como causa

O postmortem começa enviesado.

### Copiar logs completos

Dados sensíveis entram na evidence.

### Usar runbook sem teste

Comandos e referências podem estar obsoletos.

### Antecipar o postmortem

A análise retrospectiva pertence à aula 568.

---

## Comandos úteis

### Validar catálogo

```powershell
.\scripts\operations\runbooks\validate-runbook-catalog.ps1
```

### Validar links

```powershell
.\scripts\operations\runbooks\validate-runbook-links.ps1
```

### Validar segurança

```powershell
.\scripts\operations\runbooks\validate-runbook-safety.ps1
```

### Simular target down

```powershell
.\scripts\operations\runbooks\simulate-target-down-runbook.ps1
```

### Coletar evidence

```powershell
.\scripts\operations\runbooks\collect-runbook-evidence.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Crie estrutura comum e catálogo.

### Parte 2 — Evidence

Defina o que pode ser registrado.

### Parte 3 — Target down

Escreva confirmação, diagnóstico e recuperação.

### Parte 4 — Errors

Classifique e mitigue falhas técnicas.

### Parte 5 — Latency

Investigue caminho crítico e saturação.

### Parte 6 — Queue

Relacione entrada, saída e capacidade.

### Parte 7 — Rollback

Defina pré-condições e abort criteria.

### Parte 8 — Escalation

Crie critérios e handoff.

### Parte 9 — Drills

Execute os cenários controlados.

### Parte 10 — Gate

Valide links, comandos, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 566 e ponte para a aula 568 foram preservadas;
- runbook, playbook, triage, diagnosis, mitigation, remediation, rollback, escalation, handoff, recovery, closure criteria, evidence, safe command, destructive action e drill foram definidos;
- baseline de alertas foi validada;
- contrato de runbook foi criado;
- catálogo foi criado;
- todo `runbook_ref` da aula 566 resolve para um arquivo;
- cada runbook possui ID, versão, owner e data de validação;
- anatomia padrão foi definida;
- política de evidências foi criada;
- dados sensíveis são proibidos;
- template de execution record foi criado;
- comandos exigem confirmação de ambiente e serviço;
- ações destrutivas exigem aprovação e rollback;
- limpeza global é proibida;
- política de comunicação foi criada;
- fatos e hipóteses são separados;
- política de escalonamento foi criada;
- handoff possui campos obrigatórios;
- runbook de target down foi criado;
- target down diferencia falha do serviço e falha de scraping;
- restart não é a primeira ação;
- recuperação exige target, health, readiness e golden signals;
- runbook de erro técnico foi criado;
- business rejection não é tratada como falha técnica;
- categorias de erro foram definidas;
- retries não são aumentados automaticamente;
- runbook de latência foi criado;
- borda, negócio, dependência e fila foram diferenciados;
- traces e critical path foram usados;
- integridade não é sacrificada para reduzir latência;
- runbook de fila foi criado;
- entrada, conclusão, fila e capacidade foram relacionados;
- purge de fila é proibido;
- runbook de backlog foi criado;
- runbook de fast burn foi criado;
- fast burn orienta urgência, não causa;
- runbook compartilhado de rollback foi criado;
- compatibilidade de migration e schema é verificada;
- gate de rollback foi criado;
- runbook de dependência degradada foi criado;
- runbook de telemetria indisponível foi criado;
- falha de observabilidade não é confundida com falha de negócio;
- runbook de handoff foi criado;
- comunicação inicial e de recuperação foi modelada;
- critérios de encerramento foram definidos;
- janela de estabilidade é exigida;
- proibições aparecem nos runbooks;
- política de validação periódica foi criada;
- runbook stale bloqueia readiness operacional;
- links foram validados;
- comandos foram validados;
- segurança foi validada;
- drill de target down foi executado;
- drill de erro foi executado;
- drill de latência foi executado;
- drill de saturação foi executado;
- drill de fast burn foi executado;
- execution records foram validados;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, dado pessoal, ambiente real ou ação destrutiva foi utilizado;
- postmortem completo não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/operations/runbooks `
  scripts/operations/runbooks `
  docs/operations/runbooks `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível e comandos proibidos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|email|customer_id|order_id|trace_id|correlation_id|docker system prune|DROP DATABASE|TRUNCATE"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): criar runbooks operacionais"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- logs completos;
- traces completos;
- credentials;
- dados reais;
- execution records temporários;
- screenshots de produção;
- postmortem;
- causa raiz final;
- material da aula 568.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os alertas da `orders-api` e do `orders-worker` passaram a possuir procedimentos operacionais completos.

Você criou runbooks para:

```text
target down;

erro técnico elevado;

latência elevada;

fila perto da capacidade;

backlog crescente;

fast burn;

dependência degradada;

telemetria indisponível;

rollback;

handoff.
```

Você comprovou que o runbook precisa confirmar antes de agir; restart não deve ser resposta automática; diagnóstico precisa relacionar alertas, golden signals, release, dependências, traces e logs; mitigação deve ser reversível; rollback exige compatibilidade; retries podem amplificar falhas; filas não devem ser apagadas indiscriminadamente; escalation e handoff precisam de critérios; comunicação deve separar fatos e hipóteses; evidence deve ser sanitizada; alerta resolved não encerra sozinho a resposta; e runbooks precisam ser testados e versionados.

A próxima aula será:

```text
568 - M18.13 - Postmortem
```

Nela, você irá transformar os registros da resposta em uma análise pós-incidente sem culpabilização, com timeline, impacto, fatores contribuintes, causa, detecção, resposta, aprendizados e ações acompanháveis.

Nenhum postmortem completo, causa raiz definitiva, análise retrospectiva formal ou plano preventivo final foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contrato e catálogo.
- [ ] Mapeei todos os alertas.
- [ ] Criei procedimentos por cenário.
- [ ] Defini rollback e escalation.
- [ ] Criei communication e evidence policies.
- [ ] Executei drills.
- [ ] Validei links, comandos e segurança.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### O alerta aponta para arquivo inexistente

Corrija catálogo, ID e annotation da regra.

### O comando não funciona

Revise path, profile, Compose e versão do serviço.

### O runbook manda reiniciar imediatamente

Adicione confirmação, diagnóstico e riscos.

### O rollback não é seguro

Interrompa e escale com estado de migrations e schemas.

### A fila continua crescendo

Compare entrada, throughput, retries e dependências.

### O alerta resolveu durante a análise

Continue validação pela janela de estabilidade.

### A evidence possui trace ID

Remova o identificador e mantenha referência sanitizada.

### O handoff não informa ações anteriores

Preencha fatos, ações, resultados e próximo passo.

### O runbook nunca foi testado

Execute drill controlado e atualize metadata.

### A análise de causa começou a ser finalizada

Preserve a retrospectiva para a aula 568.

---

## Perguntas de revisão

1. O que é runbook?
2. Qual diferença entre runbook e playbook?
3. O que é triage?
4. O que é diagnosis?
5. O que é mitigation?
6. O que é rollback?
7. O que é escalation?
8. O que é handoff?
9. Por que confirmar antes de agir?
10. Por que restart não é primeira ação?
11. Quando considerar rollback?
12. Qual risco de aumentar retry?
13. Como validar recuperação?
14. Quando encerrar?
15. O que registrar em evidence?
16. O que não registrar?
17. Por que testar runbooks?
18. O que é runbook stale?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Procedimento operacional reproduzível.
2. Procedimento específico versus estratégia ampla.
3. Avaliação inicial.
4. Validação de hipóteses.
5. Redução de impacto.
6. Retorno controlado.
7. Ampliação ou transferência.
8. Transferência estruturada.
9. Evitar ação errada.
10. Pode apagar evidência ou piorar.
11. Quando release regressiva e compatível.
12. Amplificar carga.
13. Health, sinais e janela.
14. Após estabilidade e evidence.
15. Fatos, ações e resultados.
16. Secrets e dados pessoais.
17. Detectar obsolescência.
18. Documento desatualizado.
19. Postmortem.
20. Postmortem.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 567 - M18.12 - Runbooks

- Continuei após Alertas.
- Diferenciei runbook e playbook.
- Criei contrato e catálogo de runbooks.
- Mapeei as referências dos alertas para arquivos reais.
- Padronizei identificação, confirmação, triagem, diagnóstico, mitigação, rollback, escalonamento, comunicação, evidence, recuperação e encerramento.
- Criei política de evidências sanitizadas.
- Criei template de registro de execução.
- Defini política de comandos seguros.
- Proibi limpezas globais e ações destrutivas não aprovadas.
- Criei política de comunicação baseada em fatos.
- Criei critérios de escalation e handoff.
- Escrevi runbook de target down.
- Diferenciei aplicação indisponível e falha de scraping.
- Escrevi runbook de taxa de erro técnico.
- Separei rejeição de negócio de falha técnica.
- Escrevi runbook de alta latência.
- Usei golden signals, traces e critical path.
- Escrevi runbook de fila perto da capacidade.
- Relacionei entrada, throughput e backlog.
- Proibi purge indiscriminado.
- Escrevi runbook de backlog crescente.
- Escrevi runbook de fast burn.
- Criei runbook compartilhado de rollback.
- Validei migrations, schemas e compatibilidade.
- Criei runbooks de dependência e telemetria degradadas.
- Criei template de handoff.
- Defini critérios de recuperação e encerramento.
- Criei política de validação periódica.
- Validei links, comandos e segurança.
- Executei drills dos principais cenários.
- Coletei evidence sanitizada.
- Não antecipei o postmortem completo.
- Próxima aula: Postmortem.
```

---

## Referência técnica curta

- Operational Runbooks.
- Incident Triage.
- Mitigation and Remediation.
- Safe Rollback.
- Incident Escalation.
- Incident Handoff.
- Recovery Validation.
- Operational Evidence.
- Runbook Drills.
- Runbook Versioning.

Regra final:

```text
runbooks precisam transformar alertas em respostas seguras e reproduzíveis: cada referência resolve para um arquivo versionado com owner, severidade, pré-requisitos, proibições, confirmação, triagem, diagnóstico, mitigação, rollback, escalonamento, comunicação, evidence, recuperação e encerramento; ações começam pela validação do ambiente e do impacto, restart não é resposta automática, retries não são aumentados sem análise, filas não são apagadas, migrations e schemas são verificados antes de rollback e comandos destrutivos permanecem proibidos ou exigem aprovação explícita; golden signals, release metadata, health, traces e logs sustentam hipóteses, fatos são separados de interpretações e o handoff preserva continuidade; o alerta resolved precisa ser acompanhado por uma janela de estabilidade, evidence é sanitizada, drills validam comandos e links e runbooks stale bloqueiam prontidão operacional, deixando para a aula 568 a análise retrospectiva formal, a timeline final, os fatores contribuintes, os aprendizados e as ações preventivas.
```
