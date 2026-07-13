# 568 - M18.13 - Postmortem

## Apresentação da aula

Na aula 567, os alertas da `orders-api` e do `orders-worker` passaram a apontar para runbooks operacionais completos.

Você definiu procedimentos para:

```text
target down;

taxa de erro técnico elevada;

alta latência;

fila próxima da capacidade;

backlog crescente;

fast burn;

dependência degradada;

telemetria indisponível;

rollback;

handoff.
```

Esses runbooks ajudaram a confirmar o cenário, classificar impacto, validar sinais, formular hipóteses, mitigar, avaliar rollback, comunicar, registrar evidências e validar recuperação.

Durante um incidente, o objetivo principal é reduzir impacto e restaurar o serviço.

Depois da recuperação, surge outra responsabilidade:

```text
aprender de forma estruturada
para reduzir recorrência,
detectar antes
e responder melhor.
```

Essa responsabilidade é atendida pelo postmortem.

Postmortem é uma análise retrospectiva de um incidente.

Ele organiza:

- o que aconteceu;
- qual foi o impacto;
- quando cada evento ocorreu;
- como o sistema detectou;
- como a equipe respondeu;
- quais condições permitiram o incidente;
- quais controles falharam;
- quais controles funcionaram;
- o que tornou a recuperação mais lenta;
- quais mudanças serão acompanhadas.

O postmortem não deve culpabilizar. Em vez de concluir que alguém implantou uma configuração errada, investigue por que ela chegou ao ambiente, quais validações faltavam, por que rollout, alertas e rollback não limitaram o impacto e quais sinais estavam disponíveis.

Pessoas executam ações dentro de sistemas, processos, interfaces, incentivos, restrições e informações disponíveis.

Pergunta central:

```text
como transformar
fatos,
timeline,
evidências
e decisões

em aprendizado sistêmico,
sem culpabilização
e com ações verificáveis?
```

Você irá criar um postmortem completo para um incidente simulado do laboratório.

Cenário principal:

```text
release regressiva
na orders-api

aumenta falhas técnicas,
eleva latência
e acelera consumo
do error budget didático.
```

A resposta terá utilizado:

- alerta de taxa de erro;
- alerta de fast burn;
- dashboard de golden signals;
- traces distribuídos;
- logs estruturados;
- runbook de erro técnico;
- runbook de rollback;
- comunicação operacional;
- janela de estabilidade.

A aula trabalhará com gatilho, resumo, impacto, detecção, timeline, causalidade, controles, resposta, recuperação, sorte, aprendizados, ações, ownership, prazo, validação, acompanhamento, publicação e review.

A aula não aprofundará a técnica de troubleshooting por logs.

Os logs serão usados como uma das fontes de evidência do incidente.

Não serão construídos ainda:

- método sistemático de busca por eventos;
- estratégia detalhada de filtragem;
- análise aprofundada por campos;
- navegação temporal completa;
- comparação de logs entre instâncias;
- diagnóstico por padrões de stack trace;
- investigação de concorrência pelos logs;
- correlação avançada entre eventos;
- roteiro dedicado de troubleshooting baseado em logs.

Esses tópicos pertencem à próxima aula oficial:

```text
569 - M18.14 - Troubleshooting por logs
```

A regra central será:

```text
o postmortem não procura
quem culpar;

procura entender
como o sistema permitiu,
detectou,
respondeu
e pode melhorar.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
566:
Alertas.

567:
Runbooks.

568:
Postmortem.

569:
Troubleshooting por logs.
```

Progressão:

```text
detectar;

responder;

registrar;

aprender;

aprofundar diagnóstico.
```

Aqui:

```text
postmortem:
sim.

blameless:
sim.

timeline:
sim.

impacto:
sim.

causa imediata:
sim.

fatores contribuintes:
sim.

condições latentes:
sim.

ações acompanháveis:
sim.

revisão:
sim.

publicação:
sim.

troubleshooting detalhado por logs:
não.

método completo de busca em logs:
não.
```

O documento usará alert lifecycle, execution record, release metadata, métricas, dashboards, traces, logs, decisões, comunicação e evidence sanitizada.

O postmortem não substitui esses registros.

Ele os organiza e interpreta.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
operations/postmortems
├── postmortem-contract.yaml
├── postmortem-trigger-policy.yaml
├── postmortem-severity-policy.yaml
├── postmortem-evidence-policy.yaml
├── postmortem-timeline-policy.yaml
├── postmortem-causality-policy.yaml
├── postmortem-action-policy.yaml
├── postmortem-review-policy.yaml
├── postmortem-publication-policy.yaml
├── postmortem-action-register.yaml
├── postmortem-template.md
├── PM-2026-001-ORDERS-API-REGRESSION.md
└── postmortem-evidence.yaml

scripts/operations/postmortems
├── validate-postmortem-contract.ps1
├── validate-postmortem-trigger.ps1
├── validate-postmortem-template.ps1
├── validate-postmortem-timeline.ps1
├── validate-postmortem-causality.ps1
├── validate-postmortem-actions.ps1
├── validate-postmortem-language.ps1
├── validate-postmortem-evidence.ps1
├── simulate-postmortem-review.ps1
├── collect-postmortem-evidence.ps1
└── verify-postmortem-baseline.ps1

docs/operations/postmortems
├── POSTMORTEM_OVERVIEW.md
├── BLAMELESS_POSTMORTEM_GUIDE.md
├── TIMELINE_WRITING_GUIDE.md
├── CAUSAL_ANALYSIS_GUIDE.md
├── ACTION_ITEM_GUIDE.md
├── POSTMORTEM_REVIEW_GUIDE.md
├── POSTMORTEM_TEST_MATRIX.md
└── POSTMORTEM_TROUBLESHOOTING.md
```

Ao final, você terá política de gatilho, contrato, template, postmortem completo, timeline, análise causal, ações, registro, review e evidence sanitizada.

Você irá definir gatilho, severidade, contrato, template, fontes, timeline, impacto, causalidade, controles, ações, owners, prazos, review, evidence, gate e commit.

---

## Conceito essencial

### Postmortem

Documento retrospectivo que analisa um incidente e transforma fatos em aprendizado e ações.

---

### Blameless

Abordagem que evita atribuição simplista de culpa individual e investiga condições sistêmicas.

---

### Incident

Evento que causa ou ameaça causar impacto relevante ao serviço, usuários ou operação.

---

### Impact

Efeito observado sobre usuários, jornadas, dados, receita, operação ou confiabilidade.

---

### Timeline

Sequência cronológica dos eventos relevantes.

---

### Detection

Forma e momento em que o incidente foi identificado.

---

### Mitigation

Ação que reduziu o impacto sem necessariamente corrigir a causa.

---

### Recovery

Retorno do serviço ao comportamento aceitável.

---

### Immediate cause

Mecanismo técnico diretamente associado à falha observada.

---

### Contributing factor

Condição que aumentou probabilidade, duração ou impacto do incidente.

---

### Latent condition

Fragilidade pré-existente que permaneceu oculta até combinar-se com outros fatores.

---

### Control

Mecanismo de prevenção, detecção, limitação ou recuperação.

---

### Corrective action

Ação que corrige uma falha específica identificada.

---

### Preventive action

Ação que reduz a probabilidade ou impacto de incidentes futuros.

---

### Action item

Tarefa acompanhável com owner, prioridade, prazo e critério de conclusão.

---

### Learning review

Reunião destinada a validar fatos, interpretações e ações do postmortem.

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

- alertas versionados;
- runbooks validados;
- execution records disponíveis;
- evidence sanitizada;
- cenário de regressão reproduzível;
- release atual e anterior identificáveis;
- nenhum postmortem existente para o cenário;
- nenhum dado real;
- nenhuma informação pessoal;
- nenhum incidente real em andamento.

O laboratório usará cenário simulado, nunca incidente real sem autorização.

---

### 2. Definir gatilho de postmortem

Arquivo:

```text
postmortem-trigger-policy.yaml
```

Conteúdo:

```yaml
trigger:
  requiredWhen:
    - critical-alert-fired
    - error-budget-fast-burn
    - rollback-performed
    - customer-journey-blocked
    - data-integrity-risk
    - repeated-incident
    - detection-gap
    - response-gap
    - near-miss-high-potential

  optionalWhen:
    - warning-with-novel-learning
    - drill-with-material-gap

  notRequiredWhen:
    - expected-test-alert
    - known-maintenance-event
    - duplicate-with-no-new-learning

  decision:
    owner:
      incident-lead

    evidence:
      required
```

Near miss também pode exigir postmortem.

O impacto não precisa ocorrer para gerar aprendizado.

---

### 3. Definir severidade do postmortem

Arquivo:

```text
postmortem-severity-policy.yaml
```

Exemplo:

```yaml
severity:
  SEV1:
    criteria:
      - widespread-critical-impact
      - data-integrity-loss
      - security-impact

  SEV2:
    criteria:
      - major-journey-degradation
      - rollback-required
      - rapid-error-budget-consumption

  SEV3:
    criteria:
      - limited-impact
      - operational-degradation
      - valuable-learning

  laboratoryScenario:
    assigned:
      SEV2

    reason:
      rollback-and-fast-burn
```

A classificação é didática.

---

### 4. Criar contrato de postmortem

Arquivo:

```text
postmortem-contract.yaml
```

Conteúdo:

```yaml
postmortem:
  id:
    required

  title:
    required

  status:
    required

  severity:
    required

  owners:
    required

  date:
    required

  services:
    required

  environment:
    required

  summary:
    required

  impact:
    required

  detection:
    required

  timeline:
    required

  response:
    required

  immediateCause:
    required

  contributingFactors:
    required

  latentConditions:
    required

  controls:
    required

  learnings:
    required

  actionItems:
    required

  review:
    required

  evidence:
    required

  blameLanguage:
    forbidden
```

O contrato não exige causa raiz única; sistemas complexos possuem múltiplas condições.

---

### 5. Criar template

Arquivo:

```text
postmortem-template.md
```

Estrutura:

```markdown
# <ID> — <Título>

## Status

## Resumo executivo

## Impacto

## Escopo

## Detecção

## Timeline

## Resposta

## Recuperação

## Causa imediata

## Fatores contribuintes

## Condições latentes

## Controles que funcionaram

## Controles que falharam ou estavam ausentes

## Onde tivemos sorte

## Aprendizados

## Ações

## Riscos remanescentes

## Evidências

## Revisão

## Histórico
```

A estrutura pode crescer, mantendo ordem previsível.

---

### 6. Definir política de evidências

Arquivo:

```text
postmortem-evidence-policy.yaml
```

Conteúdo:

```yaml
evidence:
  allowed:
    - alert-reference
    - dashboard-reference
    - sanitized-metric-summary
    - release-id
    - deployment-time
    - runbook-execution-reference
    - sanitized-trace-reference
    - sanitized-log-event-reference
    - action-result
    - recovery-window

  forbidden:
    - password
    - token
    - authorization
    - cookie
    - request-body
    - response-body
    - customer-id
    - user-email
    - full-log-file
    - full-trace
    - personal-name-without-need

  retention:
    laboratory:
      repository-metadata-only
```

Evidence deve permitir verificação sem copiar toda a telemetria.

---

### 7. Definir política de timeline

Arquivo:

```text
postmortem-timeline-policy.yaml
```

Conteúdo:

```yaml
timeline:
  timezone:
    UTC

  format:
    ISO-8601

  event:
    required:
      - timestamp
      - category
      - fact
      - source

  categories:
    - change
    - detection
    - impact
    - response
    - mitigation
    - recovery
    - communication

  interpretation:
    separateFromFact:
      required

  uncertainTimestamp:
    markAsApproximate:
      required
```

Toda timeline precisa declarar timezone.

Horários ambíguos prejudicam.

---

### 8. Reconstruir o cenário

Cenário simulado:

```text
release:
orders-api 1.8.0.

mudança:
timeout da dependência de pagamento
reduzido incorretamente.

efeito:
timeouts técnicos aumentam.

consequência:
retries síncronos ampliam carga.

resultado:
latência cresce,
erros aumentam,
error budget é consumido.

mitigação:
feature flag reduz chamadas opcionais.

recuperação:
rollback para 1.7.3.
```

Esse cenário possui mais de uma condição.

Não reduza a análise a:

```text
timeout errado.
```

---

### 9. Criar o documento do incidente

Arquivo:

```text
PM-2026-001-ORDERS-API-REGRESSION.md
```

H1:

```markdown
# PM-2026-001 — Regressão de timeout na orders-api
```

Metadata:

```yaml
id:
  PM-2026-001

status:
  draft

severity:
  SEV2

environment:
  local-laboratory

services:
  - orders-api
  - payment-simulator

incidentStart:
  2026-07-13T14:00:00Z

recovery:
  2026-07-13T14:42:00Z

ownerRole:
  incident-review-facilitator
```

Datas são fictícias e claramente marcadas como laboratório.

---

### 10. Escrever o resumo executivo

Exemplo:

```text
A release 1.8.0 da orders-api
reduziu o timeout configurado
para o simulador de pagamento.

Durante tráfego sustentado,
operações válidas excederam
o novo limite,
produzindo timeouts técnicos.

Retries síncronos elevaram
a concorrência,
aumentaram a latência
e aceleraram o consumo
do error budget didático.

A equipe mitigou parcialmente
a carga por feature flag
e recuperou o serviço
com rollback para 1.7.3.
```

O resumo deve ser factual.

---

### 11. Escrever impacto

Inclua:

```text
jornada afetada:
criação de pedido.

duração:
42 minutos.

escopo:
ambiente local do laboratório.

efeitos:
erro técnico;
latência elevada;
fast burn;
retries adicionais.

integridade de dados:
nenhuma perda observada.

mensagens:
nenhuma duplicação confirmada.

usuários reais:
nenhum.
```

Não invente valores.

Quando desconhecido, marque:

```text
não medido;

desconhecido;

inconclusivo.
```

---

### 12. Separar impacto técnico e impacto de usuário

Impacto técnico:

- timeout;
- fila;
- CPU;
- retries;
- latência;
- error ratio;
- restart.

Impacto de usuário:

- operação falhou;
- resposta atrasou;
- jornada ficou indisponível;
- dado não apareceu;
- pedido duplicou;
- usuário precisou repetir.

Não trate saturação interna como impacto do usuário sem conexão demonstrada.

---

### 13. Descrever detecção

Inclua:

```text
primeiro sinal:
OrdersApiHighTechnicalErrorRate.

segundo sinal:
OrdersErrorBudgetFastBurn.

detecção:
automática.

tempo até detecção:
calculado a partir
do primeiro impacto observável.

lacuna:
o alerta de latência
entrou em pending
antes do erro crítico.
```

Avalie se o alerta detectou o sintoma certo, com atraso aceitável, contexto, runbook e dashboard disponíveis.

---

### 14. Criar a timeline

Exemplo:

```markdown
## Timeline

| Horário UTC | Categoria | Fato | Fonte |
|---|---|---|---|
| 14:00 | change | Release 1.8.0 concluída | release metadata |
| 14:04 | impact | Timeouts começam a crescer | Prometheus |
| 14:06 | detection | Alerta de erro entra em pending | Prometheus |
| 14:10 | detection | Alerta de erro entra em firing | Alertmanager |
| 14:12 | response | Runbook de erro técnico iniciado | execution record |
| 14:16 | diagnosis | Spans apontam espera no payment simulator | Tempo |
| 14:20 | mitigation | Feature flag reduz chamadas opcionais | execution record |
| 14:25 | detection | Fast burn entra em firing | Prometheus |
| 14:29 | response | Rollback aprovado | handoff record |
| 14:34 | mitigation | Rollback para 1.7.3 iniciado | release metadata |
| 14:38 | recovery | Erro e latência começam a normalizar | Grafana |
| 14:42 | recovery | Alertas resolvidos | Alertmanager |
| 14:52 | recovery | Janela de estabilidade concluída | runbook record |
```

A timeline contém fatos; interpretações ficam separadas.

---

### 15. Validar consistência temporal

O script:

```text
validate-postmortem-timeline.ps1
```

deve bloquear:

- timestamps fora de ordem;
- evento de recuperação antes da mitigação;
- timezone ausente;
- duração negativa;
- alerta firing antes do impacto quando não explicado;
- release sem referência;
- evento sem fonte;
- evento futuro;
- timestamp ambíguo.

Eventos paralelos são permitidos.

A ordem textual precisa continuar cronológica.

---

### 16. Descrever resposta

Registre papéis, runbook, hipóteses, consultas, mitigação, riscos, decisão de rollback, comunicação e validação da recuperação.

Não transforme a seção em transcrição de chat.

Resuma decisões.

---

### 17. Descrever recuperação

Inclua:

```text
mudança que restaurou:
rollback para 1.7.3.

validações:
target UP;
readiness UP;
error ratio normal;
p95 normal;
fila estável;
alertas resolved.

janela de estabilidade:
10 minutos no laboratório.

risco remanescente:
configuração ainda poderia
ser alterada sem validação automática.
```

Recuperação não significa que todos os problemas foram corrigidos.

Ela significa que o serviço voltou ao comportamento aceitável.

---

### 18. Definir causa imediata

Exemplo:

```text
A configuração de timeout
da chamada ao payment simulator
foi reduzida para um valor inferior
à latência normal observada
durante tráfego sustentado.
```

Essa frase descreve o mecanismo técnico.

Ela não encerra a análise.

---

### 19. Identificar fatores contribuintes

Exemplos:

- validação de configuração não comparava timeout e baseline;
- teste de integração não exercitava latência realista;
- retries síncronos usavam limite permissivo;
- rollout não possuía análise automática de error ratio;
- change review não destacava mudança operacional;
- runbook de rollback exigiu confirmação manual do artifact;
- alerta de fast burn usava janela mais longa;
- ambiente local não possuía canary.

Cada fator precisa de evidência ou ser marcado como hipótese.

---

### 20. Identificar condições latentes

Exemplos:

```text
configuração crítica
não tinha schema validado;

timeouts eram definidos
em múltiplos arquivos;

não existia owner explícito
para a política de retries;

o artifact anterior
não era verificado
continuamente;

a checklist de release
não incluía comparação
com SLO didático.
```

Condições latentes podem existir há muito tempo.

O incidente apenas as tornou visíveis.

---

### 21. Criar política de causalidade

Arquivo:

```text
postmortem-causality-policy.yaml
```

Conteúdo:

```yaml
causality:
  singleRootCause:
    required:
      false

  immediateCause:
    required

  contributingFactors:
    required

  latentConditions:
    required

  evidence:
    required

  unsupportedCertainty:
    forbidden

  personAsRootCause:
    forbidden

  fiveWhys:
    optional

  causalGraph:
    recommendedForComplexCases
```

Os cinco porquês podem ajudar, sem forçar causalidade linear.

---

### 22. Usar os cinco porquês com cautela

Exemplo:

```text
por que houve timeout?
porque o limite ficou abaixo
da latência normal.

por que o limite foi aceito?
porque não havia validação
contra baseline.

por que não havia validação?
porque timeout era tratado
como configuração local.

por que era tratado assim?
porque não existia owner
da política de dependências.

por que o ownership não existia?
porque o risco não havia
sido formalizado.
```

A cadeia é hipótese de aprendizagem.

Não prova causalidade sozinha.

---

### 23. Registrar controles que funcionaram

Exemplos:

- alerta de erro detectou automaticamente;
- Alertmanager roteou corretamente;
- runbook tinha queries e ações;
- traces mostraram a dependência dominante;
- logs continham release e trace ID;
- feature flag reduziu impacto;
- rollback estava documentado;
- readiness evitou tráfego prematuro;
- janela de estabilidade impediu encerramento precoce.

Reconhecer controles eficazes ajuda a preservá-los.

---

### 24. Registrar controles que falharam ou estavam ausentes

Exemplos:

- ausência de validação de timeout;
- ausência de teste de performance da integração;
- ausência de canary;
- retry policy permissiva;
- rollback artifact não pré-validado;
- alerta de mudança pós-release inexistente;
- checklist de release incompleta;
- dashboard não mostrava timeout configurado.

Evite frases genéricas como:

```text
faltou teste.
```

Defina qual teste e qual comportamento.

---

### 25. Registrar onde houve sorte

Seção:

```text
## Onde tivemos sorte
```

Exemplos:

- tráfego era limitado;
- nenhuma operação crítica de escrita ficou parcialmente concluída;
- a dependência respondeu lentamente, mas não corrompeu dados;
- o artifact anterior continuava disponível;
- a pessoa com contexto do módulo estava disponível;
- a fila ainda tinha headroom;
- o problema ocorreu em laboratório.

“Sorte” identifica risco potencial.

Ela pode gerar ação mesmo sem dano observado.

---

### 26. Registrar o que tornou a resposta mais lenta

Exemplos:

- nomes diferentes entre dashboard e métrica;
- confirmação manual da versão;
- runbook link quebrado;
- falta de consulta pronta;
- logs distribuídos em dois processos;
- trace datasource sem link direto;
- dúvida sobre rollback de migration;
- owner da dependência não definido.

Esses itens podem gerar ações de response readiness.

---

### 27. Registrar o que funcionou bem

Exemplos:

- comunicação baseada em fatos;
- handoff completo;
- alerta sem dados sensíveis;
- decisão de rollback documentada;
- ausência de restart indiscriminado;
- nenhuma fila apagada;
- evidence preservada;
- recuperação validada em múltiplos sinais.

---

### 28. Transformar aprendizado em ação

Ação ruim:

```text
ter mais cuidado.
```

Ação melhor:

```text
adicionar validação de startup
que rejeita timeout
inferior ao mínimo operacional
documentado para o profile.
```

A ação precisa ser específica, verificável, atribuída, priorizada, limitada, relacionada ao aprendizado e acompanhável.

---

### 29. Criar política de ações

Arquivo:

```text
postmortem-action-policy.yaml
```

Conteúdo:

```yaml
actions:
  requiredFields:
    - id
    - title
    - type
    - owner
    - priority
    - dueDate
    - verification
    - sourceLearning
    - status

  types:
    - corrective
    - preventive
    - detection
    - response
    - documentation

  priorities:
    - P0
    - P1
    - P2
    - P3

  vagueAction:
    forbidden

  owner:
    roleOrTeam:
      required

  completion:
    evidence:
      required
```

Ação sem owner é intenção.

---

### 30. Criar ações do cenário

Exemplos:

```yaml
actions:
  - id:
      PM-2026-001-A01

    title:
      Validate dependency timeout at startup

    type:
      preventive

    owner:
      orders-team

    priority:
      P1

    dueDate:
      2026-07-20

    verification:
      startup-test-rejects-unsafe-timeout

    status:
      open

  - id:
      PM-2026-001-A02

    title:
      Add latency profile to integration test

    type:
      corrective

    owner:
      orders-team

    priority:
      P1

    verification:
      test-covers-normal-and-degraded-latency

  - id:
      PM-2026-001-A03

    title:
      Add retry budget validation

    type:
      preventive

    owner:
      platform-and-orders-team

    priority:
      P1

    verification:
      retry-policy-contract-test

  - id:
      PM-2026-001-A04

    title:
      Pre-validate previous release artifact

    type:
      response

    owner:
      platform

    priority:
      P2

    verification:
      rollback-drill-passes
```

Datas são fictícias do laboratório.

---

### 31. Evitar lista de ações excessiva

Um postmortem com trinta ações vagas tende a não concluir nenhuma.

Priorize controles de maior alavancagem, redução de recorrência e impacto, melhoria de resposta e riscos revelados pela sorte.

Registre ações secundárias separadamente.

---

### 32. Criar registro central de ações

Arquivo:

```text
postmortem-action-register.yaml
```

Conteúdo:

```yaml
register:
  - actionId:
      PM-2026-001-A01

    postmortemId:
      PM-2026-001

    owner:
      orders-team

    priority:
      P1

    dueDate:
      2026-07-20

    status:
      open

    verification:
      pending

    closedAt:
      null
```

A aprovação do documento não conclui as ações.

---

### 33. Definir revisão do postmortem

Arquivo:

```text
postmortem-review-policy.yaml
```

Conteúdo:

```yaml
review:
  facilitator:
    neutral-role

  participants:
    - incident-lead
    - service-owner
    - platform
    - relevant-dependency-owner

  rules:
    - facts-before-interpretation
    - no-blame
    - challenge-unsupported-certainty
    - preserve-dissent
    - actions-need-owners
    - unresolved-items-recorded

  approval:
    required:
      - timeline
      - impact
      - causality
      - actions
```

A review valida aprendizado; não é tribunal.

---

### 34. Preservar divergência legítima

Quando duas hipóteses permanecem possíveis:

```text
Hipótese A:
retry amplificou
principalmente a concorrência.

Hipótese B:
pool pequeno
teve participação equivalente.
```

Registre:

- evidência a favor;
- evidência contra;
- dado ausente;
- ação para obter certeza futura.

Não force consenso.

---

### 35. Revisar linguagem

Script:

```text
validate-postmortem-language.ps1
```

Procure termos como:

- culpa;
- negligência;
- erro humano como conclusão final;
- pessoa causou;
- descuido;
- incompetência;
- deveria ter sabido;
- óbvio;
- simplesmente.

O script apenas sinaliza trechos para revisão.

Linguagem técnica pode mencionar uma ação humana de forma factual.

Exemplo aceitável:

```text
A configuração foi alterada
durante a release 1.8.0.
```

---

### 36. Validar causalidade

Script:

```text
validate-postmortem-causality.ps1
```

Valide:

- causa imediata presente;
- pelo menos um fator contribuinte;
- condição latente;
- evidência;
- ausência de pessoa como causa raiz;
- ausência de certeza sem fonte;
- controles presentes;
- relação entre aprendizado e ação;
- hipóteses marcadas.

---

### 37. Validar ações

Script:

```text
validate-postmortem-actions.ps1
```

Bloqueie:

- ação sem owner;
- ação sem prioridade;
- ação sem prazo;
- ação sem verification;
- ação vaga;
- ação duplicada;
- status inválido;
- prazo anterior ao incidente;
- ação sem relação com aprendizado;
- ação fechada sem evidence.

Resultado:

```text
POSTMORTEM_ACTIONS_APPROVED
ou
POSTMORTEM_ACTIONS_BLOCKED.
```

---

### 38. Definir política de publicação

Arquivo:

```text
postmortem-publication-policy.yaml
```

Conteúdo:

```yaml
publication:
  laboratory:
    repository:
      allowed

  requiredBeforePublish:
    - sensitive-data-scan
    - participant-review
    - action-owner-confirmation
    - status-approved

  redact:
    - personal-data
    - credentials
    - customer-identifiers
    - internal-hostnames
    - full-trace-ids

  audience:
    internal-learning

  externalPublication:
    forbiddenInLaboratory
```

O documento do laboratório pode ser versionado; um postmortem real exige política própria.

---

### 39. Definir status do documento

Estados:

```text
draft;

in-review;

approved;

closed.
```

`approved` significa que a análise foi validada.

`closed` pode exigir:

- ações críticas concluídas;
- riscos aceitos;
- evidências anexadas;
- revisão final.

Não feche ações com a aprovação do texto.

---

### 40. Simular a review

Script:

```text
simulate-postmortem-review.ps1
```

Cenário:

1. validar timeline;
2. desafiar uma afirmação sem fonte;
3. separar fato de hipótese;
4. identificar condição latente;
5. remover linguagem de culpa;
6. priorizar ações;
7. definir owner;
8. definir verification;
9. registrar divergência;
10. aprovar ou retornar para ajuste.

A simulação precisa registrar apenas resultado sanitizado.

---

### 41. Criar matriz de testes

Arquivo:

```text
POSTMORTEM_TEST_MATRIX.md
```

Cenários:

- gatilho obrigatório;
- near miss;
- severidade;
- contrato completo;
- template completo;
- impacto;
- detecção;
- timeline ordenada;
- timezone;
- fonte;
- causa imediata;
- fatores contribuintes;
- condições latentes;
- controles que funcionaram;
- controles ausentes;
- sorte;
- resposta lenta;
- linguagem sem culpa;
- hipótese marcada;
- ação específica;
- owner;
- prioridade;
- prazo;
- verification;
- register;
- review;
- publicação;
- redaction;
- evidence sanitizada.

---

### 42. Criar troubleshooting

Arquivo:

```text
POSTMORTEM_TROUBLESHOOTING.md
```

Inclua:

- timeline contraditória;
- horários sem timezone;
- impacto sem medida;
- causa raiz baseada em pessoa;
- fatores sem evidência;
- cinco porquês superficial;
- ação vaga;
- owner ausente;
- prazo impossível;
- ação fechada sem evidence;
- review vira defesa;
- divergência apagada;
- documento não publicado;
- ação perdida após aprovação;
- dados sensíveis;
- postmortem excessivamente longo;
- troubleshooting por logs antecipado.

---

### 43. Coletar evidence

Script:

```text
collect-postmortem-evidence.ps1
```

Arquivo:

```text
postmortem-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- postmortem ID;
- severity;
- timeline status;
- impact status;
- causality status;
- action count;
- owner status;
- review status;
- language status;
- publication status;
- sensitive scan status;
- tests status;
- timestamp.

Não inclua:

- logs completos;
- traces completos;
- credentials;
- IDs de usuários;
- customer IDs;
- nomes pessoais;
- conteúdo de comunicação real;
- dados corporativos.

---

### 44. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\operations\postmortems\validate-postmortem-contract.ps1

.\scripts\operations\postmortems\validate-postmortem-trigger.ps1

.\scripts\operations\postmortems\validate-postmortem-template.ps1

.\scripts\operations\postmortems\validate-postmortem-timeline.ps1

.\scripts\operations\postmortems\validate-postmortem-causality.ps1

.\scripts\operations\postmortems\validate-postmortem-actions.ps1

.\scripts\operations\postmortems\validate-postmortem-language.ps1

.\scripts\operations\postmortems\validate-postmortem-evidence.ps1

.\scripts\operations\postmortems\simulate-postmortem-review.ps1

.\scripts\operations\postmortems\collect-postmortem-evidence.ps1

.\scripts\operations\postmortems\verify-postmortem-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- gatilho aprovado;
- severidade definida;
- contrato completo;
- template completo;
- timeline ordenada;
- impacto documentado;
- detecção documentada;
- resposta documentada;
- causa imediata presente;
- fatores contribuintes presentes;
- condições latentes presentes;
- controles analisados;
- sorte registrada;
- linguagem aprovada;
- ações completas;
- owners definidos;
- prazos definidos;
- verification definida;
- register atualizado;
- review simulada;
- publicação aprovada;
- evidence sanitizada;
- troubleshooting por logs não antecipado.

---

### 45. Revisar o diff

Execute:

```powershell
git status

git diff

git diff --check

git diff --stat
```

Confirme que o postmortem:

- não contém credencial;
- não contém trace ID real;
- não contém nome pessoal;
- não contém host corporativo;
- não contém conclusão sem evidência;
- não contém blame;
- não contém ação sem owner;
- não contém prazo incoerente;
- não transforma laboratório em incidente real.

---

## Entendendo o que foi feito

### A resposta virou aprendizado

Registros operacionais passaram a sustentar uma retrospectiva.

### A timeline ganhou fontes

Eventos deixaram de depender apenas de memória.

### O impacto ganhou precisão

Efeito técnico e efeito de usuário foram separados.

### A causalidade ganhou camadas

Causa imediata, fatores contribuintes e condições latentes deixaram de ser confundidos.

### A linguagem ganhou segurança psicológica

Ações humanas foram descritas sem simplificar o sistema em culpa individual.

### Os controles ganharam análise

Mecanismos que funcionaram e falharam passaram a ser registrados.

### A sorte ganhou visibilidade

Riscos potenciais puderam gerar ações antes de um impacto real.

### As ações ganharam governança

Owner, prioridade, prazo e verificação passaram a ser obrigatórios.

### A review ganhou estrutura

Fatos, interpretações e divergências passaram a ser validados.

### A próxima aula ganhou evidências preparadas

O troubleshooting por logs poderá aprofundar como eventos técnicos são localizados e interpretados.

---

## Erros comuns importantes

### Escrever o postmortem como narrativa de culpa

A análise sistêmica é interrompida.

### Escolher uma única causa raiz cedo

Condições contribuintes ficam invisíveis.

### Misturar fatos e hipóteses

O documento parece mais certo do que a evidência permite.

### Criar timeline de memória

Horários e sequência ficam inconsistentes.

### Usar “faltou teste”

A ação resultante permanece vaga.

### Criar ação “ter mais cuidado”

Não existe critério verificável.

### Fechar o documento e esquecer ações

O aprendizado não altera o sistema.

### Omitir o que funcionou

Controles úteis podem ser removidos.

### Omitir sorte

Riscos de alto potencial permanecem ocultos.

### Antecipar troubleshooting por logs

A metodologia detalhada pertence à aula 569.

---

## Comandos úteis

### Validar contrato

```powershell
.\scripts\operations\postmortems\validate-postmortem-contract.ps1
```

### Validar timeline

```powershell
.\scripts\operations\postmortems\validate-postmortem-timeline.ps1
```

### Validar causalidade

```powershell
.\scripts\operations\postmortems\validate-postmortem-causality.ps1
```

### Validar ações

```powershell
.\scripts\operations\postmortems\validate-postmortem-actions.ps1
```

### Simular review

```powershell
.\scripts\operations\postmortems\simulate-postmortem-review.ps1
```

---

## Exercício guiado

### Parte 1 — Trigger

Defina por que o cenário exige postmortem.

### Parte 2 — Evidence

Selecione fontes sanitizadas.

### Parte 3 — Timeline

Reconstrua fatos em UTC.

### Parte 4 — Impact

Separe efeito técnico e usuário.

### Parte 5 — Causality

Identifique causa imediata, fatores e condições.

### Parte 6 — Controls

Registre o que funcionou, falhou e dependeu de sorte.

### Parte 7 — Actions

Defina owner, prioridade, prazo e verificação.

### Parte 8 — Review

Desafie certezas e linguagem de culpa.

### Parte 9 — Publication

Redija e aprove o documento.

### Parte 10 — Gate

Execute validações e registre evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 567 e ponte para a aula 569 foram preservadas;
- postmortem, blameless, incident, impact, timeline, detection, mitigation, recovery, immediate cause, contributing factor, latent condition, control, corrective action, preventive action, action item e learning review foram definidos;
- baseline de runbooks e alertas foi validada;
- política de gatilho foi criada;
- critical alert, fast burn, rollback, impacto, recorrência e near miss foram considerados;
- política de severidade foi criada;
- cenário foi classificado como didático;
- contrato de postmortem foi criado;
- template foi criado;
- resumo executivo foi escrito;
- impacto foi documentado;
- efeito técnico e efeito de usuário foram separados;
- valores desconhecidos foram marcados corretamente;
- detecção foi documentada;
- timeline usa UTC;
- timestamps usam formato consistente;
- eventos possuem categoria, fato e fonte;
- interpretações não foram misturadas aos fatos;
- timeline foi validada;
- resposta foi resumida;
- recuperação foi documentada;
- janela de estabilidade foi registrada;
- causa imediata foi definida;
- fatores contribuintes foram definidos;
- condições latentes foram definidas;
- política de causalidade foi criada;
- uma única causa raiz não foi forçada;
- pessoa não foi usada como causa raiz;
- cinco porquês foi usado somente como apoio;
- controles que funcionaram foram registrados;
- controles ausentes ou falhos foram registrados;
- onde houve sorte foi registrado;
- fatores que atrasaram resposta foram registrados;
- o que funcionou bem foi registrado;
- aprendizados foram transformados em ações;
- política de ações foi criada;
- ações possuem ID, tipo, owner, prioridade, prazo, verificação e status;
- ações vagas foram proibidas;
- registro central de ações foi criado;
- ações não foram fechadas sem evidence;
- política de review foi criada;
- divergência legítima pode permanecer registrada;
- linguagem de culpa foi revisada;
- causalidade foi validada;
- ações foram validadas;
- política de publicação foi criada;
- dados sensíveis são redigidos;
- documento possui status;
- aprovação e fechamento foram diferenciados;
- review foi simulada;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- nenhum Secret, dado pessoal, ambiente real ou incidente real foi usado;
- troubleshooting detalhado por logs não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/operations/postmortems `
  scripts/operations/postmortems `
  docs/operations/postmortems `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível ou linguagem inadequada:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|user.email|trace_id|correlation_id|culpa|incompetência|negligência"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): criar postmortem operacional"
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
- nomes pessoais;
- comunicação real;
- artifacts temporários;
- troubleshooting detalhado por logs;
- material da aula 569.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os registros da resposta operacional foram transformados em aprendizado sistêmico.

Você criou:

```text
política de gatilho;

severidade;

contrato;

template;

postmortem completo;

timeline;

análise causal;

ações;

registro de ações;

review;

publicação;

evidence.
```

Você comprovou que postmortem não procura culpados; fatos precisam de fontes; impacto técnico e impacto de usuário são diferentes; causa imediata não encerra a análise; fatores contribuintes e condições latentes ajudam a explicar recorrência e duração; controles que funcionaram precisam ser preservados; controles ausentes precisam gerar aprendizado; sorte revela risco; ações precisam de owner, prioridade, prazo e verificação; linguagem precisa refletir incerteza; divergências podem permanecer registradas; aprovação do documento não conclui automaticamente as ações; e a publicação exige redaction e review.

A próxima aula será:

```text
569 - M18.14 - Troubleshooting por logs
```

Nela, você irá aprofundar a investigação baseada em logs estruturados, usando eventos, níveis, campos, janelas, correlation ID, trace ID, padrões de erro, comparação entre instâncias e reconstrução de sequências técnicas.

Nenhum método completo de troubleshooting por logs, estratégia detalhada de busca, correlação temporal avançada ou análise sistemática de stack traces foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini gatilho e severidade.
- [ ] Criei contrato e template.
- [ ] Reconstruí timeline com fontes.
- [ ] Documentei impacto e detecção.
- [ ] Analisei causalidade em camadas.
- [ ] Registrei controles, sorte e aprendizados.
- [ ] Criei ações acompanháveis.
- [ ] Simulei review e publicação.

---

## Troubleshooting adicional

### A timeline possui horários conflitantes

Volte às fontes, declare timezone e marque estimativas.

### O impacto não possui números

Use métricas disponíveis ou declare `não medido`.

### A causa aponta para uma pessoa

Reescreva o mecanismo técnico e as condições sistêmicas.

### Os cinco porquês parecem lineares demais

Adicione fatores paralelos ou um mapa causal.

### A ação diz “melhorar testes”

Defina cenário, owner, prazo e verificação.

### O owner não aceita a ação

Revise escopo, dependência, prioridade e responsabilidade.

### O documento foi aprovado, mas as ações sumiram

Atualize o action register e mantenha acompanhamento.

### Há dados sensíveis na evidence

Redija, mantenha somente referência e bloqueie publicação.

### A review virou discussão defensiva

Retorne a fatos, contexto disponível e aprendizado sistêmico.

### A análise começa a ensinar busca detalhada em logs

Preserve esse aprofundamento para a aula 569.

---

## Perguntas de revisão

1. O que é postmortem?
2. O que significa blameless?
3. O que é impacto?
4. O que é timeline?
5. O que é causa imediata?
6. O que é fator contribuinte?
7. O que é condição latente?
8. O que é controle?
9. Por que registrar sorte?
10. Qual diferença entre recuperação e correção definitiva?
11. Por que separar fato e hipótese?
12. Qual risco de uma única causa raiz?
13. O que torna uma ação acompanhável?
14. Por que owner é obrigatório?
15. O que é learning review?
16. Por que versionar ações?
17. Quando um near miss exige postmortem?
18. O que deve ser redigido?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Análise retrospectiva do incidente.
2. Aprender sem culpa individual simplista.
3. Efeito observado.
4. Sequência cronológica.
5. Mecanismo técnico direto.
6. Condição que ampliou o incidente.
7. Fragilidade pré-existente.
8. Mecanismo de prevenção ou resposta.
9. Revela risco potencial.
10. Serviço normal versus causa removida.
11. Preservar confiabilidade.
12. Ocultar complexidade.
13. Owner, prazo e verificação.
14. Garantir responsabilidade.
15. Revisão estruturada do aprendizado.
16. Acompanhar conclusão.
17. Quando revela risco relevante.
18. Secrets e dados pessoais.
19. Troubleshooting por logs.
20. Troubleshooting por logs.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 568 - M18.13 - Postmortem

- Continuei após Runbooks.
- Diferenciei resposta ao incidente e análise retrospectiva.
- Entendi postmortem blameless como investigação sistêmica.
- Criei política de gatilho para incidentes e near misses.
- Criei política de severidade.
- Criei contrato e template de postmortem.
- Defini política de evidence sanitizada.
- Padronizei timeline em UTC com fatos e fontes.
- Criei um cenário simulado de regressão na `orders-api`.
- Escrevi resumo executivo, impacto, escopo e detecção.
- Separei impacto técnico e impacto de usuário.
- Reconstruí timeline com release, alertas, diagnóstico, mitigação e recuperação.
- Documentei causa imediata.
- Identifiquei fatores contribuintes.
- Identifiquei condições latentes.
- Usei cinco porquês apenas como apoio.
- Registrei controles que funcionaram.
- Registrei controles falhos ou ausentes.
- Registrei onde houve sorte.
- Registrei fatores que atrasaram a resposta.
- Transformei aprendizados em ações específicas.
- Exigi owner, prioridade, prazo e verificação.
- Criei registro central de ações.
- Criei política de review sem culpabilização.
- Preservei divergências e incertezas.
- Validei linguagem, causalidade e ações.
- Criei política de publicação e redaction.
- Simulei uma learning review.
- Coletei evidence sanitizada.
- Não antecipei troubleshooting detalhado por logs.
- Próxima aula: Troubleshooting por logs.
```

---

## Referência técnica curta

- Blameless Postmortems.
- Incident Timeline.
- Impact Analysis.
- Contributing Factors.
- Latent Conditions.
- Causal Analysis.
- Corrective Actions.
- Preventive Actions.
- Learning Reviews.
- Postmortem Action Tracking.

Regra final:

```text
postmortems precisam transformar resposta operacional em aprendizado sistêmico: o gatilho e a severidade são explícitos, o documento separa fatos, fontes e interpretações, registra impacto técnico e de usuário, detecção, timeline, resposta, mitigação, recuperação e risco remanescente; causa imediata não encerra a análise, fatores contribuintes, condições latentes, controles que funcionaram, controles ausentes e onde houve sorte ampliam a compreensão sem tratar pessoas como causa raiz; ações precisam de ID, tipo, owner, prioridade, prazo, verificação, status e relação com o aprendizado, permanecendo em um registro central até conclusão comprovada; review preserva divergências, remove linguagem de culpa e desafia certezas sem evidência, enquanto publicação exige redaction e evidence sanitizada; aprovação do texto não fecha automaticamente as ações, deixando para a aula 569 o aprofundamento do troubleshooting por logs estruturados, janelas temporais, campos, níveis, correlation ID, trace ID e padrões técnicos.
```
