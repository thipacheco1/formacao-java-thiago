# 561 - M18.06 - SLI SLO SLA

## Apresentação da aula

Na aula 560, a `orders-api` passou a ser analisada pelos quatro golden signals:

```text
latência;

tráfego;

erros;

saturação.
```

Essa organização permitiu responder perguntas como:

```text
o sistema está lento?

o volume aumentou?

a taxa de falha cresceu?

algum recurso está próximo do limite?
```

Os golden signals ajudam a observar.

Entretanto, ainda falta definir:

```text
qual comportamento
é considerado aceitável?
```

Sem esse contrato, uma equipe pode possuir dezenas de métricas e ainda discutir durante um incidente:

- qual valor representa problema;
- qual janela deve ser usada;
- quais operações entram no cálculo;
- quais exclusões são legítimas;
- quanto risco é aceitável;
- quando uma release deve ser interrompida;
- quando a confiabilidade deve ter prioridade;
- quando o resultado precisa ser comunicado ao negócio.

Nesta aula, você irá transformar sinais em três conceitos diferentes:

```text
SLI;

SLO;

SLA.
```

Um **SLI** mede algum aspecto relevante do serviço.

Um **SLO** define um objetivo interno para esse indicador.

Um **SLA** representa um compromisso formal, normalmente externo, com consequências acordadas.

Exemplo simplificado:

```text
SLI:
proporção de pedidos
processados com sucesso.

SLO:
99,5% em 30 dias.

SLA:
compromisso contratual
com regra de compensação.
```

Esses conceitos não devem ser misturados.

Quando uma equipe chama toda meta de SLA, surgem problemas:

- objetivos internos viram promessas contratuais;
- alertas são configurados com severidade inadequada;
- tolerâncias experimentais parecem compromissos;
- equipes evitam revisar metas;
- decisões técnicas perdem contexto de negócio.

A pergunta central desta aula será:

```text
como transformar
métricas confiáveis

em indicadores,
objetivos
e compromissos

sem confundir
medição,
meta
e contrato?
```

Você irá criar contratos formais para a `orders-api`, mas em ambiente de laboratório.

Os valores serão didáticos.

Eles não representarão compromisso real de produção.

A aula abordará:

- SLI;
- SLO;
- SLA;
- eventos bons;
- eventos válidos;
- numerador;
- denominador;
- janelas;
- disponibilidade;
- sucesso;
- latência;
- freshness;
- throughput;
- exclusões;
- error budget;
- consumo;
- burn rate conceitual;
- revisão;
- ownership;
- qualidade dos dados;
- testes;
- evidence.

A aula não implementará:

- servidor Prometheus;
- scraping;
- `prometheus.yml`;
- PromQL operacional;
- recording rules;
- alerting rules;
- Alertmanager;
- federation;
- remote write;
- retenção;
- alta disponibilidade do Prometheus.

Esses tópicos pertencem à próxima aula oficial:

```text
562 - M18.07 - Prometheus
```

Nesta aula, expressões conceituais poderão ser documentadas, mas a coleta e consulta com Prometheus não serão antecipadas.

A regra central será:

```text
SLI mede;

SLO orienta;

SLA compromete.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
559:
Micrometer.

560:
Golden signals.

561:
SLI SLO SLA.

562:
Prometheus.
```

A aula 559 criou métricas.

A aula 560 organizou essas métricas em sinais.

A aula 561 irá transformar sinais em contratos de confiabilidade.

A progressão é:

```text
métrica
→
sinal
→
indicador
→
objetivo
→
decisão.
```

Nesta aula:

```text
SLI:
sim.

SLO:
sim.

SLA:
sim.

error budget:
sim.

burn rate:
conceitual.

good events:
sim.

valid events:
sim.

windows:
sim.

exclusions:
sim.

tests:
sim.

Prometheus:
não.

PromQL:
não operacional.

alert rules:
não.
```

A progressão prática será:

```text
1.
definir o serviço.

2.
escolher a experiência.

3.
definir eventos válidos.

4.
definir eventos bons.

5.
calcular o SLI.

6.
definir SLO.

7.
calcular error budget.

8.
separar SLA.

9.
testar o contrato.

10.
coletar evidence.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
observability/reliability
├── service-reliability-boundary.yaml
├── sli-catalog.yaml
├── sli-valid-event-policy.yaml
├── sli-good-event-policy.yaml
├── availability-sli.yaml
├── success-sli.yaml
├── latency-sli.yaml
├── freshness-sli.yaml
├── slo-catalog.yaml
├── slo-window-policy.yaml
├── error-budget-policy.yaml
├── burn-rate-concept.yaml
├── sla-boundary.yaml
├── reliability-exception-policy.yaml
├── reliability-data-quality-policy.yaml
├── reliability-review-policy.yaml
├── reliability-scenarios.yaml
└── reliability-evidence.yaml

scripts/observability/reliability
├── validate-reliability-boundary.ps1
├── validate-sli-catalog.ps1
├── validate-slo-catalog.ps1
├── validate-sli-denominators.ps1
├── calculate-error-budget.ps1
├── simulate-slo-compliance.ps1
├── simulate-error-budget-consumption.ps1
├── compare-sli-windows.ps1
├── validate-sla-boundary.ps1
├── collect-reliability-evidence.ps1
└── verify-reliability-baseline.ps1

docs/observability/reliability
├── SLI_SLO_SLA_OVERVIEW.md
├── SLI_DESIGN_GUIDE.md
├── SLO_DESIGN_GUIDE.md
├── ERROR_BUDGET_GUIDE.md
├── SLA_BOUNDARY.md
├── RELIABILITY_REVIEW_GUIDE.md
├── RELIABILITY_TEST_MATRIX.md
└── RELIABILITY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
fronteira de serviço;

catálogo de SLIs;

numeradores;

denominadores;

eventos válidos;

eventos bons;

SLOs didáticos;

janelas;

error budgets;

fronteira de SLA;

política de exceções;

revisão;

testes;

evidence sanitizada.
```

Você irá:

1. validar a baseline;
2. confirmar a fronteira;
3. escolher experiências;
4. definir SLIs;
5. definir eventos válidos;
6. definir eventos bons;
7. escolher janelas;
8. calcular disponibilidade;
9. calcular sucesso;
10. calcular latência;
11. modelar freshness;
12. definir SLOs;
13. calcular error budget;
14. simular consumo;
15. revisar burn rate;
16. separar SLA;
17. definir exceções;
18. validar qualidade;
19. criar revisão;
20. testar;
21. coletar evidence;
22. executar gate;
23. commitar;
24. preparar a aula 562.

---

## Conceito essencial

### SLI

Indicador quantitativo que mede um aspecto da qualidade do serviço.

---

### SLO

Objetivo definido para um SLI em uma janela.

---

### SLA

Compromisso formal entre partes, normalmente associado a consequências.

---

### Evento válido

Evento incluído no denominador do indicador.

---

### Evento bom

Evento que atende ao critério desejado.

---

### Numerador

Quantidade de eventos bons.

---

### Denominador

Quantidade de eventos válidos.

---

### Error budget

Parcela de falha permitida pelo SLO.

---

### Burn rate

Velocidade de consumo do error budget em relação ao ritmo permitido.

---

### Compliance window

Janela usada para avaliar o cumprimento do SLO.

---

### Rolling window

Janela móvel que avança continuamente.

---

### Calendar window

Janela alinhada ao calendário.

---

### Exclusion

Evento removido do cálculo por regra documentada.

---

### Reliability review

Revisão periódica de indicadores, objetivos, consumo e qualidade dos dados.

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

Inicie a aplicação:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability"
```

Confirme:

- logs estruturados;
- correlation ID;
- trace ID;
- Actuator;
- métricas Micrometer;
- golden signals documentados;
- tags controladas;
- nenhum Secret real;
- cenários de laboratório disponíveis.

Registre a baseline normal antes de definir objetivos.

---

### 2. Revalidar a fronteira do serviço

Arquivo:

```text
service-reliability-boundary.yaml
```

Conteúdo:

```yaml
service:
  name:
    orders-api

  userJourneys:
    - create-order
    - query-order

  asynchronousJourneys:
    - publish-order-event
    - process-order-message

  dependencies:
    required:
      - postgresql

    conditional:
      - kafka

    optional:
      - redis

  excludedFromContract:
    - client-device
    - public-internet
    - production-cloud-control-plane
```

SLI precisa medir uma experiência definida.

Não comece pelo que é fácil de coletar.

Comece pelo que importa.

---

### 3. Escolher experiência observada

Para cada jornada, pergunte:

```text
o usuário conseguiu
atingir o resultado esperado?
```

Exemplo:

```text
create-order.
```

Possíveis indicadores:

- disponibilidade da operação;
- sucesso;
- latência;
- processamento assíncrono;
- freshness do evento;
- consistência final.

Não crie um único SLI para representar todos esses comportamentos.

---

### 4. Criar catálogo de SLIs

Arquivo:

```text
sli-catalog.yaml
```

Exemplo:

```yaml
slis:
  - id:
      order-create-availability

    journey:
      create-order

    type:
      availability

    owner:
      orders-team

    source:
      application-metrics

  - id:
      order-create-latency

    journey:
      create-order

    type:
      latency

    owner:
      orders-team

    source:
      timer-distribution

  - id:
      order-event-freshness

    journey:
      publish-order-event

    type:
      freshness

    owner:
      orders-team

    source:
      event-processing-metrics
```

Cada SLI precisa de owner e fonte.

---

### 5. Definir eventos válidos

Arquivo:

```text
sli-valid-event-policy.yaml
```

Exemplo:

```yaml
validEvents:
  orderCreate:
    include:
      - accepted-request
      - business-rejection
      - internal-failure
      - dependency-failure

    exclude:
      - malformed-request-before-routing
      - synthetic-health-probe
      - authorized-maintenance-test

    exclusionsRequire:
      - reason
      - owner
      - expiration
      - evidence
```

O denominador precisa ser estável.

Excluir falhas reais para melhorar o resultado é manipulação.

---

### 6. Definir eventos bons

Arquivo:

```text
sli-good-event-policy.yaml
```

Exemplo:

```yaml
goodEvents:
  orderCreateAvailability:
    outcomes:
      - success
      - valid-business-rejection

  orderCreateSuccess:
    outcomes:
      - success

  orderCreateLatency:
    outcome:
      success

    thresholdMs:
      500
```

Disponibilidade e sucesso podem possuir critérios diferentes.

Uma rejeição de negócio válida pode significar que o serviço respondeu corretamente.

Entretanto, ela não representa criação bem-sucedida.

---

### 7. Definir SLI de disponibilidade

Arquivo:

```text
availability-sli.yaml
```

Fórmula conceitual:

```text
eventos válidos
que receberam
resposta válida

divididos por
eventos válidos.
```

Exemplo:

```yaml
sli:
  id:
    order-create-availability

  numerator:
    valid-responses

  denominator:
    valid-requests

  goodStatusClasses:
    - 2xx
    - selected-4xx

  badStatusClasses:
    - 5xx

  exclusions:
    controlled
```

Nem todo `4xx` significa indisponibilidade.

Nem todo `2xx` garante resultado de negócio correto.

---

### 8. Definir SLI de sucesso

Arquivo:

```text
success-sli.yaml
```

Fórmula:

```text
operações com outcome success

divididas por

operações elegíveis
para sucesso.
```

Exemplo:

```yaml
sli:
  id:
    order-create-success

  numerator:
    order-created

  denominator:
    accepted-order-create-attempts

  excluded:
    - invalid-schema
    - duplicate-request-when-contractually-valid-rejection
```

A política precisa refletir o contrato do domínio.

---

### 9. Definir SLI de latência

Arquivo:

```text
latency-sli.yaml
```

Forma:

```text
operações boas
concluídas abaixo
do threshold

divididas por

operações válidas
do outcome escolhido.
```

Exemplo:

```yaml
sli:
  id:
    order-create-latency

  eligibleOutcome:
    success

  thresholdMs:
    500

  numerator:
    successful-operations-below-threshold

  denominator:
    successful-operations

  measurementPoint:
    application-service
```

O threshold da aula é didático.

Ele não é SLO de produção.

---

### 10. Definir freshness

Arquivo:

```text
freshness-sli.yaml
```

Freshness responde:

```text
o dado,
evento
ou resultado

ficou disponível
dentro do tempo esperado?
```

Exemplo:

```yaml
sli:
  id:
    order-event-freshness

  start:
    order-committed

  end:
    event-consumed

  thresholdSeconds:
    30

  numerator:
    events-consumed-within-threshold

  denominator:
    committed-events-eligible-for-publication
```

Freshness é diferente de duração do consumer.

Ela pode incluir espera no broker.

---

### 11. Validar numerador e denominador

O script:

```text
validate-sli-denominators.ps1
```

deve bloquear:

- denominador não definido;
- numerador maior que denominador;
- exclusão sem justificativa;
- mudança silenciosa de critério;
- mistura de outcomes;
- mistura de janelas;
- dependência de tag proibida;
- fonte inexistente.

Um SLI sem denominador claro não é auditável.

---

### 12. Escolher janela

Arquivo:

```text
slo-window-policy.yaml
```

Exemplo:

```yaml
windows:
  rolling28Days:
    type:
      rolling

    duration:
      28d

    use:
      operational-slo

  calendarMonth:
    type:
      calendar

    use:
      reporting

  shortDiagnostic:
    type:
      rolling

    duration:
      1h

    use:
      diagnosis-only
```

A janela do SLO não precisa ser a mesma janela de diagnóstico.

Janelas curtas ajudam a detectar.

Janelas longas ajudam a avaliar compromisso.

---

### 13. Definir catálogo de SLOs

Arquivo:

```text
slo-catalog.yaml
```

Exemplo didático:

```yaml
slos:
  - id:
      order-create-availability-slo

    sli:
      order-create-availability

    objective:
      99.5

    unit:
      percent

    window:
      rolling28Days

    owner:
      orders-team

    status:
      laboratory-only

  - id:
      order-create-latency-slo

    sli:
      order-create-latency

    objective:
      95.0

    unit:
      percent

    window:
      rolling28Days

    status:
      laboratory-only
```

O status `laboratory-only` evita interpretar os números como produção.

---

### 14. Entender disponibilidade em porcentagem

Uma disponibilidade de:

```text
99%
```

permite aproximadamente:

```text
1% de eventos ruins.
```

Uma disponibilidade de:

```text
99,9%
```

permite:

```text
0,1%.
```

Pequenas diferenças decimais alteram significativamente o error budget.

Não escolha um número apenas porque parece profissional.

---

### 15. Calcular error budget

Arquivo:

```text
error-budget-policy.yaml
```

Forma:

```text
error budget
=
1 - SLO.
```

Exemplo:

```text
SLO:
99,5%.

budget:
0,5%.
```

Em 100.000 eventos válidos:

```text
500 eventos ruins
permitidos
na janela.
```

O script:

```text
calculate-error-budget.ps1
```

deve aceitar:

- objetivo;
- eventos válidos;
- eventos ruins;
- janela.

Saída:

- budget total;
- budget consumido;
- budget restante;
- compliance;
- qualidade dos dados.

---

### 16. Não transformar budget em permissão para falhar

Error budget não significa:

```text
podemos causar falhas
até consumir tudo.
```

Ele representa tolerância de confiabilidade.

A equipe pode usá-lo para equilibrar:

- velocidade;
- risco;
- mudanças;
- experimentação;
- refatoração;
- estabilidade.

O budget precisa orientar decisões, não justificar descuido.

---

### 17. Simular compliance

Script:

```text
simulate-slo-compliance.ps1
```

Cenários:

```text
100.000 eventos;
200 ruins;
SLO 99,5%.

resultado:
compliant.
```

Outro:

```text
100.000 eventos;
800 ruins.

resultado:
not compliant.
```

Registre:

- SLI observado;
- objetivo;
- budget;
- consumo;
- janela;
- resultado.

---

### 18. Simular consumo do budget

Script:

```text
simulate-error-budget-consumption.ps1
```

Cenários:

- consumo lento;
- pico curto;
- falha sustentada;
- release regressiva;
- recuperação;
- tráfego muito baixo;
- dados incompletos.

Não use apenas porcentagem.

Registre número de eventos válidos.

---

### 19. Introduzir burn rate conceitual

Arquivo:

```text
burn-rate-concept.yaml
```

Burn rate compara:

```text
ritmo atual
de consumo

com ritmo permitido
pelo budget.
```

Interpretação conceitual:

```text
burn rate = 1:
consumo no ritmo esperado.

burn rate > 1:
consumo mais rápido.

burn rate muito alto:
budget pode acabar cedo.
```

Nesta aula, o conceito será documentado.

PromQL e alertas de burn rate não serão implementados.

---

### 20. Evitar conclusão com baixo volume

Exemplo:

```text
10 eventos;

1 falha;

SLI:
90%.
```

O resultado é matematicamente válido.

Entretanto, possui baixa robustez estatística.

Registre:

- count;
- janela;
- volume;
- confiança;
- observação.

Não altere a fórmula.

Apenas evite decisão exagerada.

---

### 21. Separar SLO e alerta

Um SLO é objetivo de longo prazo.

Um alerta responde:

```text
há uma condição
que exige ação agora?
```

Nem toda violação momentânea de threshold significa quebra do SLO.

Nem todo SLO precisa gerar alerta direto.

Alertas podem usar:

- burn rate;
- erro sustentado;
- múltiplas janelas;
- impacto;
- saturação;
- ausência de dados.

A política completa será tratada em aulas posteriores.

---

### 22. Separar SLO e capacidade

SLO mede experiência ou resultado.

Capacidade ajuda a explicar risco e limitação.

Exemplo:

```text
SLO de latência:
95% abaixo de 500 ms.

saturação:
pool em 95%.
```

A saturação não é necessariamente o SLI do usuário.

Ela pode ser um indicador causal.

Não substitua outcome por recurso interno sem justificativa.

---

### 23. Separar SLO e KPI de negócio

KPI:

```text
pedidos vendidos.
```

SLI:

```text
proporção de tentativas válidas
processadas com sucesso.
```

Os dois podem se relacionar.

Entretanto, KPI mede resultado do negócio.

SLI mede qualidade do serviço.

Não use faturamento como indicador técnico de disponibilidade.

---

### 24. Definir fronteira de SLA

Arquivo:

```text
sla-boundary.yaml
```

Conteúdo:

```yaml
sla:
  existsInLaboratory:
    false

  requires:
    - parties
    - service-scope
    - measurement-source
    - objective
    - window
    - exclusions
    - reporting
    - consequences
    - dispute-process

  internalSloAutomaticallyBecomesSla:
    false

  compensation:
    not-defined
```

Nesta formação, não existe SLA real.

O arquivo documenta a fronteira.

---

### 25. Entender consequências do SLA

Um SLA pode incluir:

- crédito;
- compensação;
- prioridade de suporte;
- obrigação de comunicação;
- exclusões;
- janela de manutenção;
- método de medição;
- fonte oficial;
- processo de contestação.

Esses elementos pertencem ao acordo entre partes.

A equipe de engenharia não deve inventá-los isoladamente.

---

### 26. Criar política de exceções

Arquivo:

```text
reliability-exception-policy.yaml
```

Exceção pode envolver:

- manutenção autorizada;
- evento sintético;
- teste de caos aprovado;
- tráfego fora do contrato;
- dependência explicitamente excluída;
- dados corrompidos na fonte.

Cada exclusão precisa de:

- ID;
- motivo;
- owner;
- início;
- fim;
- evidência;
- aprovação;
- expiração.

Exclusão retroativa para melhorar resultado é proibida.

---

### 27. Criar política de qualidade

Arquivo:

```text
reliability-data-quality-policy.yaml
```

Regras:

```yaml
quality:
  missingData:
    result:
      inconclusive

  staleData:
    result:
      inconclusive

  counterReset:
    handling:
      rate-aware-calculation

  duplicatedEvents:
    handling:
      deduplicate-or-reject

  denominatorDrift:
    handling:
      block-comparison

  lowVolume:
    handling:
      mark-low-confidence

  unboundedTags:
    handling:
      block-release
```

SLI incorreto produz SLO enganoso.

---

### 28. Versionar definições

Mudanças em:

- numerador;
- denominador;
- exclusões;
- threshold;
- janela;
- source;
- owner

precisam ser versionadas.

Não compare períodos com definições diferentes sem registrar a mudança.

Inclua:

```text
definition_version.
```

---

### 29. Criar revisão periódica

Arquivo:

```text
reliability-review-policy.yaml
```

Conteúdo:

```yaml
review:
  cadence:
    monthly

  participants:
    - service-owner
    - operations
    - product

  inspect:
    - sli-quality
    - slo-compliance
    - error-budget-consumption
    - exclusions
    - incidents
    - release-impact
    - traffic-pattern
    - capacity-risk

  outcomes:
    - keep
    - adjust-proposal
    - instrumentation-fix
    - reliability-work
```

A revisão não deve alterar retroativamente o passado.

---

### 30. Criar cenários

Arquivo:

```text
reliability-scenarios.yaml
```

Cenários:

```text
availability compliant;

availability violated;

latency compliant;

latency violated;

error budget half consumed;

error budget exhausted;

traffic low;

data missing;

counter reset;

exclusion requested;

release regression;

recovery.
```

Cada cenário precisa de:

- eventos válidos;
- eventos bons;
- janela;
- objetivo;
- resultado;
- confiança;
- próxima ação.

---

### 31. Cenário de disponibilidade

Exemplo:

```text
eventos válidos:
200.000.

eventos bons:
199.400.

SLI:
99,7%.

SLO:
99,5%.

resultado:
compliant.
```

Budget permitido:

```text
1.000 eventos ruins.
```

Ruins observados:

```text
600.
```

Restante:

```text
400.
```

---

### 32. Cenário de latência

Exemplo:

```text
operações elegíveis:
100.000.

abaixo de 500 ms:
96.000.

SLI:
96%.

SLO:
95%.

resultado:
compliant.
```

O resultado não significa que p99 é bom.

SLI baseado em threshold e percentil respondem perguntas diferentes.

Registre ambos quando necessário.

---

### 33. Cenário com dados ausentes

Se a telemetria falhar durante parte da janela:

```text
resultado:
inconclusive.
```

Não assuma:

```text
sem dados
=
sem falha.
```

A ausência de telemetria é problema operacional.

Registre duração e impacto.

---

### 34. Cenário de release regressiva

Compare:

- SLI antes;
- SLI depois;
- tráfego;
- janela;
- release ID;
- error budget;
- latência;
- saturação;
- logs.

Se a regressão consumir budget rapidamente, priorize:

- rollback;
- mitigação;
- pausa;
- investigação.

A decisão depende do risco e do contexto.

---

### 35. Criar script de comparação

Script:

```text
compare-sli-windows.ps1
```

Valide:

- mesma definição;
- mesma versão;
- janelas comparáveis;
- volume suficiente;
- sources disponíveis;
- exclusions equivalentes;
- release identificada.

Saída:

```text
improved;

stable;

degraded;

inconclusive.
```

---

### 36. Criar testes de contrato

Valide:

- SLI possui owner;
- SLI possui fonte;
- numerador definido;
- denominador definido;
- good event é subconjunto de valid events;
- janela definida;
- SLO referencia SLI existente;
- objetivo entre 0 e 100;
- status didático;
- SLA não é inferido;
- exclusão possui expiração;
- definição possui versão;
- dados ausentes geram `inconclusive`.

---

### 37. Criar matriz de testes

Arquivo:

```text
RELIABILITY_TEST_MATRIX.md
```

Cenários:

- SLI válido;
- denominador zero;
- numerador maior;
- evento excluído;
- exclusão expirada;
- SLO válido;
- SLO inexistente;
- objetivo inválido;
- janela rolling;
- janela calendar;
- compliant;
- not compliant;
- budget restante;
- budget esgotado;
- baixo volume;
- missing data;
- counter reset;
- definition drift;
- release comparison;
- SLA boundary;
- evidence sanitizada.

---

### 38. Criar troubleshooting

Arquivo:

```text
RELIABILITY_TROUBLESHOOTING.md
```

Inclua:

- SLI sem denominador;
- todos os `4xx` tratados como erro;
- rejeição de negócio misturada;
- latência sem outcome;
- threshold sem unidade;
- janela não definida;
- SLO copiado de outra empresa;
- budget negativo;
- dados ausentes tratados como sucesso;
- exclusões retroativas;
- baixo volume ignorado;
- definição alterada no meio da janela;
- SLO chamado de SLA;
- SLA sem partes;
- alerta tratado como SLO;
- PromQL antecipada.

---

### 39. Coletar evidence

Script:

```text
collect-reliability-evidence.ps1
```

Arquivo:

```text
reliability-evidence.json.
```

Campos permitidos:

- lesson;
- service;
- SLI count;
- SLO count;
- availability SLI status;
- success SLI status;
- latency SLI status;
- freshness SLI status;
- denominator validation;
- window policy status;
- error budget status;
- SLA boundary status;
- data quality status;
- tests status;
- timestamp.

Não inclua:

- IDs de negócio;
- correlation IDs;
- trace IDs;
- payloads;
- credenciais;
- dados pessoais;
- contrato comercial real.

---

### 40. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\reliability\validate-reliability-boundary.ps1

.\scripts\observability\reliability\validate-sli-catalog.ps1

.\scripts\observability\reliability\validate-slo-catalog.ps1

.\scripts\observability\reliability\validate-sli-denominators.ps1

.\scripts\observability\reliability\calculate-error-budget.ps1

.\scripts\observability\reliability\simulate-slo-compliance.ps1

.\scripts\observability\reliability\simulate-error-budget-consumption.ps1

.\scripts\observability\reliability\compare-sli-windows.ps1

.\scripts\observability\reliability\validate-sla-boundary.ps1

.\scripts\observability\reliability\collect-reliability-evidence.ps1

.\scripts\observability\reliability\verify-reliability-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- fronteira validada;
- SLIs catalogados;
- eventos válidos definidos;
- eventos bons definidos;
- numeradores corretos;
- denominadores corretos;
- SLOs didáticos;
- janelas documentadas;
- error budget calculado;
- burn rate apenas conceitual;
- SLA separado;
- exceções controladas;
- qualidade aprovada;
- testes aprovados;
- evidence sanitizada;
- Prometheus não antecipado.

---

## Entendendo o que foi feito

### Métricas viraram indicadores

O dado bruto passou a responder uma pergunta de qualidade.

### Indicadores ganharam denominador

Resultados deixaram de depender de contagens isoladas.

### Eventos bons ganharam contrato

Sucesso, disponibilidade e latência deixaram de ser misturados.

### SLOs ganharam janela

O objetivo passou a ter período e owner.

### Error budget ganhou significado

A tolerância de falha passou a orientar risco e decisão.

### Burn rate ganhou contexto

Consumo acelerado passou a ser reconhecido sem antecipar alertas.

### SLA ganhou fronteira

Objetivo interno deixou de ser tratado como contrato.

### Exclusões ganharam governança

Remoções retroativas passaram a ser proibidas.

### Qualidade dos dados ganhou prioridade

Ausência e drift passaram a bloquear conclusões.

### A próxima aula ganhou requisitos

Prometheus poderá coletar e consultar indicadores já definidos.

---

## Erros comuns importantes

### Começar pelo SLO

Sem SLI bem definido, o objetivo não é mensurável.

### Definir só o numerador

A porcentagem fica ambígua.

### Excluir falhas reais

O resultado deixa de representar a experiência.

### Copiar 99,99%

O número pode ser inviável ou sem valor.

### Misturar disponibilidade e sucesso

Uma resposta válida pode ser rejeição de negócio.

### Chamar objetivo interno de SLA

O compromisso fica incorreto.

### Tratar ausência de dados como sucesso

A confiabilidade fica artificial.

### Alterar definição durante a janela

A comparação perde validade.

### Usar error budget como licença

A equipe incentiva falha em vez de gerir risco.

### Antecipar Prometheus

A coleta e PromQL pertencem à aula 562.

---

## Comandos úteis

### Validar SLIs

```powershell
.\scripts\observability\reliability\validate-sli-catalog.ps1
```

### Validar SLOs

```powershell
.\scripts\observability\reliability\validate-slo-catalog.ps1
```

### Calcular budget

```powershell
.\scripts\observability\reliability\calculate-error-budget.ps1
```

### Simular compliance

```powershell
.\scripts\observability\reliability\simulate-slo-compliance.ps1
```

### Comparar janelas

```powershell
.\scripts\observability\reliability\compare-sli-windows.ps1
```

---

## Exercício guiado

### Parte 1 — Boundary

Defina jornadas e dependências.

### Parte 2 — Valid events

Escolha o denominador.

### Parte 3 — Good events

Defina o numerador.

### Parte 4 — SLI

Crie disponibilidade, sucesso, latência e freshness.

### Parte 5 — Window

Escolha rolling e calendar.

### Parte 6 — SLO

Defina objetivos didáticos.

### Parte 7 — Budget

Calcule tolerância e consumo.

### Parte 8 — SLA

Documente a fronteira contratual.

### Parte 9 — Quality

Teste exclusões, drift e missing data.

### Parte 10 — Evidence

Simule, valide e registre.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 560 e ponte para a aula 562 foram preservadas;
- SLI, SLO, SLA, eventos válidos, eventos bons, numerador, denominador, error budget, burn rate, rolling window, calendar window e exclusion foram definidos;
- baseline de logs, Actuator, Micrometer e golden signals foi validada;
- fronteira de confiabilidade foi criada;
- jornadas HTTP e assíncronas foram identificadas;
- catálogo de SLIs foi criado;
- cada SLI possui owner e fonte;
- eventos válidos foram documentados;
- eventos bons foram documentados;
- exclusions exigem motivo, owner, expiração e evidence;
- exclusão retroativa é proibida;
- availability SLI foi criado;
- success SLI foi criado;
- latency SLI foi criado;
- freshness SLI foi criado;
- numerador e denominador são auditáveis;
- good events são subconjunto de valid events;
- disponibilidade e sucesso foram diferenciados;
- latência possui outcome, threshold, unidade e ponto de medição;
- freshness possui início, fim e threshold;
- denominador zero é tratado;
- janelas rolling e calendar foram diferenciadas;
- catálogo de SLOs foi criado;
- objetivos são explicitamente didáticos;
- SLO referencia SLI existente;
- objetivo possui janela e owner;
- error budget foi calculado;
- budget consumido e restante foram registrados;
- error budget não é tratado como licença para falhar;
- compliance foi simulado;
- consumo do budget foi simulado;
- burn rate foi apresentado apenas conceitualmente;
- baixo volume reduz confiança;
- SLO foi separado de alerta;
- SLO foi separado de capacidade;
- SLO foi separado de KPI;
- SLA boundary foi criada;
- nenhum SLA real foi inventado;
- consequências contratuais não foram definidas pela equipe técnica;
- política de exceções foi criada;
- política de qualidade foi criada;
- missing e stale data geram `inconclusive`;
- counter reset foi considerado;
- definição possui versionamento;
- revisão periódica foi criada;
- cenários de compliance, violação, missing data e regressão foram simulados;
- comparação entre janelas foi criada;
- testes de contrato foram definidos;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- nenhum Secret ou dado pessoal foi usado;
- Prometheus, PromQL e alert rules não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/reliability `
  scripts/observability/reliability `
  docs/observability/reliability `
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
      "order_id|customer_id|correlation_id|trace_id|message_id|email|password|token|contractual-compensation"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): definir SLI SLO e SLA"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- dados reais;
- contratos comerciais;
- compensações;
- IDs de negócio;
- credentials;
- Prometheus;
- PromQL;
- alerting rules;
- material da aula 562.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os sinais da `orders-api` foram transformados em contratos de confiabilidade.

Você trabalhou com:

```text
SLI;

SLO;

SLA;

eventos válidos;

eventos bons;

numerador;

denominador;

janelas;

error budget;

burn rate.
```

Você comprovou que SLI mede, SLO orienta e SLA compromete; disponibilidade, sucesso, latência e freshness precisam de definições próprias; numerador e denominador precisam ser auditáveis; exclusões precisam de governança; thresholds precisam de unidade e ponto de medição; SLOs precisam de owner, janela e status; error budget representa tolerância de confiabilidade, não licença para falhar; baixo volume e dados ausentes limitam conclusões; objetivos internos não viram SLA automaticamente; e definições precisam ser versionadas para que comparações permaneçam válidas.

A próxima aula será:

```text
562 - M18.07 - Prometheus
```

Nela, você irá disponibilizar métricas para scraping, configurar um ambiente Prometheus local, executar consultas e validar séries, labels, targets e coleta.

Nenhuma instalação completa de Prometheus, configuração de scraping, PromQL operacional ou regra de alerta foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini fronteira e jornadas.
- [ ] Criei eventos válidos e bons.
- [ ] Modelei SLIs.
- [ ] Defini janelas e SLOs.
- [ ] Calculei error budget.
- [ ] Separei SLO e SLA.
- [ ] Validei qualidade e exceções.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### O SLI não possui denominador

Interrompa a definição do SLO e corrija o contrato.

### Todos os `4xx` são ruins

Revise rejeições válidas e experiência observada.

### O SLO parece arbitrário

Registre hipótese, contexto e status didático.

### O budget aparece negativo

Revise eventos válidos, ruins e objetivo.

### O resultado melhora após exclusões

Audite se as exclusões são legítimas e anteriores.

### Dados faltantes mostram compliance

Corrija para `inconclusive`.

### Janelas diferentes são comparadas

Normalize definição, duração e volume.

### O SLO está sendo chamado de SLA

Revise partes, consequências e contrato.

### Burn rate virou alerta completo

Preserve query e regra para aulas posteriores.

### Prometheus começou a ser configurado

Preserve essa implementação para a aula 562.

---

## Perguntas de revisão

1. O que é SLI?
2. O que é SLO?
3. O que é SLA?
4. O que é evento válido?
5. O que é evento bom?
6. O que é numerador?
7. O que é denominador?
8. O que é error budget?
9. O que é burn rate?
10. Qual diferença entre disponibilidade e sucesso?
11. Como definir latência?
12. O que é freshness?
13. Por que escolher janela?
14. Qual diferença entre rolling e calendar?
15. Por que versionar a definição?
16. Como tratar dados ausentes?
17. Por que baixo volume importa?
18. Quando uma exclusão é válida?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Indicador mensurável.
2. Objetivo interno.
3. Compromisso formal.
4. Evento no denominador.
5. Evento que atende ao critério.
6. Eventos bons.
7. Eventos válidos.
8. Tolerância de falha.
9. Velocidade de consumo.
10. Resposta válida versus resultado.
11. Threshold, outcome e ponto.
12. Disponibilidade dentro do tempo.
13. Dar contexto temporal.
14. Móvel versus calendário.
15. Preservar comparação.
16. `Inconclusive`.
17. Reduz confiança.
18. Quando pré-definida e auditável.
19. Prometheus.
20. Prometheus.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 561 - M18.06 - SLI SLO SLA

- Continuei após Golden signals.
- Diferenciei SLI, SLO e SLA.
- Revalidei a fronteira da `orders-api`.
- Identifiquei jornadas HTTP e assíncronas.
- Criei catálogo de SLIs.
- Defini eventos válidos e eventos bons.
- Modelei numeradores e denominadores.
- Criei SLI de disponibilidade.
- Criei SLI de sucesso.
- Criei SLI de latência.
- Criei SLI de freshness.
- Diferenciei disponibilidade, sucesso e resultado de negócio.
- Defini janelas rolling e calendar.
- Criei SLOs didáticos com owner e janela.
- Calculei error budget.
- Simulei compliance e consumo do budget.
- Estudei burn rate conceitualmente.
- Considerei baixo volume e dados ausentes.
- Separei SLO de alertas, capacidade e KPIs.
- Documentei a fronteira de SLA.
- Não inventei compromisso contratual.
- Criei política de exceções.
- Criei política de qualidade dos dados.
- Versionei definições.
- Criei política de revisão periódica.
- Simulei cenários de violação, regressão e recuperação.
- Coletei evidence sanitizada.
- Não antecipei Prometheus, PromQL ou alerting rules.
- Próxima aula: Prometheus.
```

---

## Referência técnica curta

- Service Level Indicators.
- Service Level Objectives.
- Service Level Agreements.
- Good Events and Valid Events.
- Reliability Windows.
- Error Budgets.
- Burn Rate.
- Availability SLI.
- Latency SLI.
- Reliability Data Quality.

Regra final:

```text
SLI, SLO e SLA precisam permanecer separados: o SLI mede uma experiência por meio de eventos bons divididos por eventos válidos, com numerador, denominador, fonte, owner, versão e janela explícitos; disponibilidade, sucesso, latência e freshness usam contratos próprios, exclusões exigem justificativa, aprovação e expiração, e dados ausentes ou stale tornam o resultado inconclusivo; o SLO define um objetivo interno e didático para um SLI, permitindo calcular error budget e observar conceitualmente o ritmo de consumo, sem transformar tolerância em licença para falhar; o SLA exige partes, escopo, fonte oficial, consequências e processo de disputa, portanto não surge automaticamente de um SLO; definições, janelas e qualidade precisam ser testadas e versionadas, deixando para a aula 562 a instalação do Prometheus, scraping, séries, labels e consultas.
```
