# 560 - M18.05 - Golden signals

## Apresentação da aula

Na aula 559, a `orders-api` passou a produzir métricas customizadas com Micrometer.

A aplicação agora consegue medir:

```text
quantidade de operações;

duração;

estado atual;

tamanho de payloads;

tarefas ativas;

outcomes;

retries;

fila interna.
```

Essa instrumentação criou a matéria-prima da observabilidade quantitativa.

Entretanto, possuir muitas métricas não garante que uma equipe consiga operar o sistema.

Durante um incidente, perguntas genéricas como:

```text
qual métrica eu olho?
```

podem gerar:

- dashboards excessivos;
- navegação sem direção;
- alertas contraditórios;
- demora para localizar a camada afetada;
- foco em sintomas pouco relevantes;
- análise isolada de valores;
- comparação incorreta entre releases;
- ausência de uma sequência de diagnóstico.

Os golden signals organizam a observação em quatro perspectivas principais:

```text
latência;

tráfego;

erros;

saturação.
```

Esses sinais ajudam a responder:

```text
o sistema está lento?

quanto trabalho está recebendo?

quanto está falhando?

quão perto está do limite?
```

A pergunta central desta aula será:

```text
como transformar
logs,
métricas,
health
e contexto

em uma leitura
operacional integrada
da aplicação?
```

Você irá aplicar os golden signals à `orders-api`.

O foco não será criar um dashboard visual completo.

O foco será construir um contrato operacional que determine:

- quais perguntas cada sinal responde;
- quais métricas sustentam cada sinal;
- quais dimensões são permitidas;
- como comparar períodos;
- como relacionar sinais;
- como detectar mudança após release;
- como separar sintoma e causa;
- como evitar conclusões precipitadas;
- como executar diagnóstico inicial;
- como registrar evidence.

A regra central será:

```text
um sinal isolado
raramente explica
um incidente;

a análise precisa
relacionar comportamento,
demanda,
falhas
e capacidade.
```

Exemplo:

```text
latência aumentou.
```

Isso pode ocorrer porque:

- o tráfego aumentou;
- a taxa de erro cresceu;
- o banco saturou;
- o pool de conexões esgotou;
- o consumer está atrasado;
- a aplicação entrou em throttling;
- uma dependência ficou lenta;
- uma release mudou o comportamento.

O sinal de latência identifica o sintoma.

A combinação dos sinais ajuda a formular hipóteses.

Nesta aula, você irá trabalhar com:

- golden signals;
- latência;
- tráfego;
- erros;
- saturação;
- taxa;
- duração;
- percentis;
- distribuição;
- throughput;
- backlog;
- utilização;
- capacidade;
- comparação por release;
- análise por janela;
- matriz de diagnóstico;
- testes de contrato;
- simulações;
- evidence.

A aula não irá formalizar:

- SLI completo;
- SLO;
- SLA;
- error budget;
- política de burn rate;
- compromisso contratual;
- tolerância oficial de indisponibilidade;
- regra definitiva de alerta.

Esses tópicos pertencem à próxima aula oficial:

```text
561 - M18.06 - SLI SLO SLA
```

Nesta aula, thresholds poderão ser usados como valores didáticos para simulações, mas não serão declarados objetivos oficiais de serviço.

---

## Onde estamos na formação

A sequência oficial é:

```text
556:
Logs estruturados.

557:
Correlation ID trace ID.

558:
Actuator.

559:
Micrometer.

560:
Golden signals.

561:
SLI SLO SLA.
```

A progressão do módulo é:

```text
logs:
eventos individuais.

correlation e trace:
fluxos relacionados.

Actuator:
estado operacional.

Micrometer:
medidas agregadas.

golden signals:
leitura integrada.
```

Nesta aula:

```text
latência:
sim.

tráfego:
sim.

erros:
sim.

saturação:
sim.

percentis:
sim.

taxas:
sim.

comparação por release:
sim.

diagnóstico:
sim.

simulações:
sim.

SLI formal:
não.

SLO:
não.

SLA:
não.

error budget:
não.
```

A progressão prática será:

```text
1.
definir o serviço observado.

2.
mapear entradas
e dependências.

3.
selecionar métricas.

4.
organizar sinais.

5.
simular cenários.

6.
diagnosticar.

7.
registrar limitações.

8.
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
observability/golden-signals
├── golden-signals-contract.yaml
├── service-boundary.yaml
├── latency-signal.yaml
├── traffic-signal.yaml
├── error-signal.yaml
├── saturation-signal.yaml
├── golden-signals-metric-map.yaml
├── signal-window-policy.yaml
├── release-comparison-policy.yaml
├── signal-diagnosis-matrix.yaml
├── signal-data-quality-policy.yaml
├── golden-signals-scenarios.yaml
├── golden-signals-runbook.yaml
└── golden-signals-evidence.yaml

scripts/observability/golden-signals
├── validate-service-boundary.ps1
├── validate-golden-signals-contract.ps1
├── validate-signal-metric-map.ps1
├── validate-signal-cardinality.ps1
├── simulate-latency-degradation.ps1
├── simulate-traffic-increase.ps1
├── simulate-error-increase.ps1
├── simulate-saturation.ps1
├── compare-release-signals.ps1
├── run-golden-signals-diagnosis.ps1
├── collect-golden-signals-evidence.ps1
└── verify-golden-signals-baseline.ps1

docs/observability/golden-signals
├── GOLDEN_SIGNALS_OVERVIEW.md
├── SERVICE_BOUNDARY.md
├── LATENCY_SIGNAL.md
├── TRAFFIC_SIGNAL.md
├── ERROR_SIGNAL.md
├── SATURATION_SIGNAL.md
├── SIGNAL_DIAGNOSIS_GUIDE.md
├── RELEASE_COMPARISON_GUIDE.md
├── GOLDEN_SIGNALS_TEST_MATRIX.md
└── GOLDEN_SIGNALS_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
serviço delimitado;

sinais definidos;

métricas mapeadas;

janelas documentadas;

comparação por release;

cenários simulados;

diagnóstico guiado;

qualidade de dados validada;

evidence sanitizada.
```

Você irá:

1. validar a baseline;
2. definir a fronteira do serviço;
3. mapear entradas;
4. mapear dependências;
5. definir latência;
6. definir tráfego;
7. definir erros;
8. definir saturação;
9. mapear métricas;
10. escolher janelas;
11. definir dimensões;
12. controlar cardinalidade;
13. definir comparação por release;
14. simular latência;
15. simular tráfego;
16. simular erros;
17. simular saturação;
18. correlacionar sinais;
19. diagnosticar cenários;
20. testar contratos;
21. registrar limitações;
22. coletar evidence;
23. executar gate;
24. commitar;
25. preparar a aula 561.

---

## Conceito essencial

### Golden signals

Quatro sinais usados para observar serviços: latência, tráfego, erros e saturação.

---

### Latência

Tempo necessário para concluir uma operação.

---

### Tráfego

Quantidade de trabalho recebido ou processado em uma janela.

---

### Erros

Proporção ou quantidade de operações que não atingiram o resultado esperado.

---

### Saturação

Proximidade entre demanda atual e capacidade disponível.

---

### Throughput

Quantidade de operações concluídas por unidade de tempo.

---

### Backlog

Trabalho pendente aguardando processamento.

---

### Utilização

Parcela de um recurso que está sendo usada.

---

### Percentil

Valor abaixo do qual uma proporção das observações se encontra.

---

### Janela de análise

Intervalo usado para agregar e comparar dados.

---

### Service boundary

Fronteira que define o que pertence ao serviço observado.

---

### Symptom signal

Sinal que mostra impacto percebido.

---

### Cause signal

Sinal que ajuda a localizar uma possível causa.

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

Consulte:

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/health

Invoke-RestMethod `
  http://localhost:8080/actuator/metrics
```

Confirme:

- Actuator disponível;
- métricas customizadas;
- logs estruturados;
- correlation ID;
- trace ID;
- release ID;
- nenhum Secret real;
- tags dentro do budget;
- simulações locais disponíveis.

A baseline precisa registrar o comportamento normal antes dos cenários de degradação.

---

### 2. Definir a fronteira do serviço

Arquivo:

```text
service-boundary.yaml
```

Conteúdo:

```yaml
service:
  name:
    orders-api

  primaryCapabilities:
    - create-order
    - query-order
    - publish-order-event
    - process-order-message

  entryPoints:
    - http-api
    - messaging-consumer

  dependencies:
    - postgresql
    - kafka
    - redis-optional

  excluded:
    - client-network
    - external-business-process
    - production-cloud-control-plane
```

Sem uma fronteira clara, métricas de componentes diferentes podem ser misturadas.

A fronteira também define ownership.

---

### 3. Mapear o fluxo HTTP

Fluxo:

```text
cliente;

HTTP server;

controller;

application service;

database;

event publisher;

response.
```

Perguntas:

- qual ponto inicia a latência percebida;
- qual métrica mede a regra de negócio;
- qual métrica mede a borda HTTP;
- quais erros são do cliente;
- quais erros são internos;
- quais recursos podem saturar.

Não use apenas uma métrica para todas as camadas.

---

### 4. Mapear o fluxo assíncrono

Fluxo:

```text
producer;

broker;

queue ou partition;

consumer;

application service;

database;

acknowledgement.
```

Perguntas:

- qual é o throughput;
- qual é o backlog;
- quanto tempo a mensagem aguarda;
- quanto tempo o consumer processa;
- quantas tentativas ocorrem;
- qual erro é retryable;
- qual capacidade limita o fluxo.

Tráfego e saturação em mensageria possuem semântica diferente da borda HTTP.

---

### 5. Criar contrato dos sinais

Arquivo:

```text
golden-signals-contract.yaml
```

Conteúdo:

```yaml
goldenSignals:
  latency:
    required:
      true

    distributions:
      required

  traffic:
    required:
      true

    rate:
      required

  errors:
    required:
      true

    outcomeClassification:
      required

  saturation:
    required:
      true

    capacityReference:
      required

  dimensions:
    bounded:
      required

  windows:
    documented:
      required

  releaseComparison:
    supported:
      required

  officialServiceObjectives:
    deferredToLesson561
```

---

### 6. Definir latência

Arquivo:

```text
latency-signal.yaml
```

Perguntas:

```text
quanto tempo
o cliente espera?

quanto tempo
a regra de negócio executa?

quanto tempo
a dependência consome?

quanto tempo
a mensagem espera
e processa?
```

Métricas candidatas:

```text
http.server.requests;

orders.creation;

database operation duration;

message processing duration;

queue waiting duration.
```

Os pontos de medição precisam ser diferentes quando as perguntas são diferentes.

---

### 7. Separar latência bem-sucedida e falha

Uma resposta rápida com erro não representa o mesmo comportamento de uma resposta rápida com sucesso.

Separe por outcome controlado:

```text
success;

rejected;

failure;

timeout.
```

Exemplo:

```text
p95 de success;

p95 de failure.
```

Uma falha pode ser rápida porque foi rejeitada antes do processamento.

Misturar outcomes distorce a interpretação.

---

### 8. Usar percentis

A média pode esconder extremos.

Exemplo:

```text
nove requisições:
100 ms.

uma requisição:
5000 ms.
```

A média sobe, mas não mostra claramente a cauda.

Percentis comuns:

```text
p50:
experiência típica.

p95:
cauda operacional.

p99:
casos extremos.
```

Nesta aula, percentis serão interpretados como sinais didáticos.

Eles ainda não são objetivos de serviço.

---

### 9. Validar unidade e ponto de medição

Registre:

```text
latency unit:
seconds ou milliseconds.

start:
ponto exato.

end:
ponto exato.

outcomes:
permitidos.

tags:
permitidas.
```

Não compare:

```text
latência HTTP
com duração de repository
```

como se fossem a mesma medida.

---

### 10. Definir tráfego

Arquivo:

```text
traffic-signal.yaml
```

Tráfego pode representar:

- requisições por segundo;
- pedidos por minuto;
- mensagens recebidas;
- mensagens processadas;
- bytes recebidos;
- jobs iniciados;
- tarefas concluídas.

A pergunta precisa definir o denominador temporal.

Um Counter absoluto não é taxa.

O backend calcula:

```text
delta
por unidade de tempo.
```

---

### 11. Diferenciar entrada e conclusão

Exemplo:

```text
requisições recebidas:
100 por minuto.

pedidos concluídos:
80 por minuto.
```

A diferença pode indicar:

- backlog;
- rejeição;
- erro;
- timeout;
- limitação de capacidade;
- operações ainda ativas.

Mapeie:

```text
traffic.in;

traffic.completed.
```

Não declare nomes adicionais no código sem necessidade.

Eles podem ser derivados das métricas existentes quando o contrato estiver claro.

---

### 12. Tráfego HTTP e mensageria

HTTP:

```text
requests por segundo;

operations por outcome.
```

Mensageria:

```text
messages received;

messages completed;

retries;

consumer throughput;

backlog.
```

Um aumento de backlog com entrada estável pode significar redução do throughput.

Um aumento de backlog com entrada crescente pode representar demanda acima da capacidade.

---

### 13. Definir erros

Arquivo:

```text
error-signal.yaml
```

Erro operacional precisa de classificação.

Categorias:

```text
client_rejection;

business_rejection;

dependency_timeout;

dependency_unavailable;

internal_failure;

serialization_failure;

message_rejected.
```

Não use exception message como dimensão.

Detalhes ficam nos logs correlacionados.

---

### 14. Definir taxa de erro

Forma conceitual:

```text
operações com erro
divididas por
operações elegíveis.
```

O denominador precisa ser explícito.

Exemplo:

```text
falhas internas
/
todas as operações concluídas.
```

Rejeições de regra de negócio podem ou não entrar, dependendo da pergunta.

Nesta aula, registre a decisão sem declarar um SLI oficial.

---

### 15. Separar erro esperado e inesperado

Exemplo esperado:

```text
pedido duplicado
rejeitado pela regra.
```

Exemplo inesperado:

```text
NullPointerException
durante criação.
```

Os dois podem produzir resultados não bem-sucedidos.

Entretanto:

- impacto;
- prioridade;
- owner;
- possibilidade de retry;
- resposta operacional

são diferentes.

---

### 16. Relacionar erros a logs

A métrica informa:

```text
error.category=dependency_timeout.
```

O log informa:

- correlation ID;
- trace ID;
- dependency;
- duration;
- error type;
- stack trace;
- release.

A métrica detecta a mudança.

O log ajuda a investigar.

---

### 17. Definir saturação

Arquivo:

```text
saturation-signal.yaml
```

Saturação responde:

```text
quão perto
o sistema está
do limite?
```

Recursos candidatos:

- CPU;
- memory;
- thread pool;
- connection pool;
- queue capacity;
- consumer lag;
- active tasks;
- file descriptors;
- disk;
- external rate limit.

Utilização não é sempre saturação.

Exemplo:

```text
CPU 80%
```

pode ser aceitável.

```text
thread pool 100%
e fila crescendo
```

é sinal mais direto de saturação.

---

### 18. Relacionar capacidade

Toda saturação precisa de referência.

Exemplo:

```text
active connections:
18.

maximum:
20.

utilization:
90%.
```

Outro:

```text
queue size:
95.

queue capacity:
100.
```

Sem capacidade, o valor absoluto pode ser pouco útil.

---

### 19. Medir backlog

Backlog é trabalho aguardando.

Exemplos:

- fila interna;
- lag de consumer;
- tarefas pendentes;
- conexões aguardando;
- requests enfileiradas;
- jobs atrasados.

Backlog crescente por várias janelas costuma indicar throughput insuficiente.

Não confunda backlog com tráfego de entrada.

---

### 20. Criar mapa de métricas

Arquivo:

```text
golden-signals-metric-map.yaml
```

Conteúdo:

```yaml
signals:
  latency:
    meters:
      - http.server.requests
      - orders.creation
      - orders.messaging.processing

  traffic:
    meters:
      - http.server.requests.count
      - orders.creation.count
      - message.processing.count

  errors:
    meters:
      - orders.creation.by-outcome
      - message.processing.by-outcome

  saturation:
    meters:
      - jvm.threads.live
      - jdbc.connections.active
      - jdbc.connections.max
      - orders.internal.queue.size
      - orders.messaging.active
```

Use nomes reais disponíveis na aplicação e no registry.

O arquivo representa capacidade sem depender de um dashboard específico.

---

### 21. Definir janelas

Arquivo:

```text
signal-window-policy.yaml
```

Exemplo didático:

```yaml
windows:
  immediate:
    duration:
      1m

    use:
      incident-detection

  short:
    duration:
      5m

    use:
      transient-or-sustained

  comparison:
    duration:
      30m

    use:
      release-comparison

  baseline:
    duration:
      24h

    use:
      historical-reference
```

Janelas muito curtas geram ruído.

Janelas muito longas escondem mudanças recentes.

Nesta aula, os valores são didáticos.

---

### 22. Comparar janelas equivalentes

Evite comparar:

```text
segunda-feira 10h
com domingo 3h
```

sem considerar padrões de tráfego.

Compare:

- mesma janela;
- tráfego semelhante;
- mesmo endpoint;
- mesmo outcome;
- release anterior;
- horário comparável;
- ambiente equivalente.

Uma diferença pode ser causada por demanda, não por código.

---

### 23. Comparar releases

Arquivo:

```text
release-comparison-policy.yaml
```

Campos:

```yaml
comparison:
  identity:
    required:
      - release_id
      - commit
      - image_digest

  windows:
    sameDuration:
      required

  trafficNormalization:
    required

  compare:
    - latency
    - error-rate
    - throughput
    - saturation

  decision:
    singleSignal:
      forbidden
```

A release ID pode ser usada em logs e evidence.

Como tag de métrica, ela precisa respeitar a política de cardinalidade da aula 559.

Quando não estiver em tags, compare por janela de deploy e annotations externas.

---

### 24. Criar matriz de diagnóstico

Arquivo:

```text
signal-diagnosis-matrix.yaml
```

Exemplo:

```yaml
scenarios:
  - signals:
      latency:
        high

      traffic:
        stable

      errors:
        stable

      saturation:
        high

    hypotheses:
      - resource-contention
      - pool-exhaustion
      - dependency-slowdown

  - signals:
      latency:
        stable

      traffic:
        high

      errors:
        low

      saturation:
        low

    interpretation:
      healthy-load-increase

  - signals:
      latency:
        low

      traffic:
        stable

      errors:
        high

      saturation:
        low

    hypotheses:
      - fast-rejection
      - configuration-error
      - invalid-dependency-response
```

A matriz não substitui investigação.

Ela orienta a primeira hipótese.

---

### 25. Cenário: latência alta e tráfego estável

Investigue:

1. error rate;
2. saturation;
3. database duration;
4. active connections;
5. thread pool;
6. queue size;
7. dependency timeouts;
8. release change;
9. logs correlacionados.

Se saturação está baixa, a causa pode ser uma dependência lenta.

Se pool está cheio, a causa pode ser contenção.

---

### 26. Cenário: tráfego alto sem impacto

Sinais:

```text
tráfego:
alto.

latência:
estável.

erros:
baixos.

saturação:
aceitável.
```

Interpretação possível:

```text
sistema absorvendo demanda.
```

Não gere incidente apenas porque o tráfego cresceu.

O aumento pode ser esperado.

O contexto de negócio continua necessário.

---

### 27. Cenário: erros altos e latência baixa

Hipóteses:

- validação rejeitando rapidamente;
- configuração inválida;
- feature flag incorreta;
- autenticação negada;
- dependency response inválida;
- rota incorreta;
- release quebrada.

Consulte:

- categoria de erro;
- status HTTP;
- outcome;
- release;
- logs;
- eventos de deploy.

---

### 28. Cenário: saturação alta e erros baixos

Pode representar:

```text
sistema próximo do limite,
mas ainda atendendo.
```

A equipe precisa avaliar:

- tendência;
- janela;
- backlog;
- headroom;
- autoscaling;
- custo;
- limite da dependência;
- duração da carga.

Esse cenário é valioso porque permite agir antes do impacto.

---

### 29. Cenário: backlog crescente

Compare:

```text
entrada;

conclusão;

tarefas ativas;

duração;

retries;

capacity.
```

Hipóteses:

- consumer lento;
- dependência indisponível;
- pool insuficiente;
- retry storm;
- partição desequilibrada;
- payload maior;
- release regressiva.

Não aumente consumers automaticamente sem avaliar banco e downstream.

---

### 30. Definir qualidade dos dados

Arquivo:

```text
signal-data-quality-policy.yaml
```

Regras:

```yaml
quality:
  missingMetric:
    action:
      mark-analysis-incomplete

  staleMetric:
    action:
      reject-current-state-conclusion

  inconsistentTags:
    action:
      block-comparison

  counterReset:
    action:
      use-rate-aware-query

  deploymentGap:
    action:
      annotate-window

  lowTraffic:
    action:
      avoid-percentile-overconfidence
```

Observabilidade depende da qualidade da telemetria.

Um gráfico não garante dados válidos.

---

### 31. Tratar restart e reset de Counter

Counters reiniciam quando a instância reinicia.

Por isso:

```text
valor absoluto
não representa
total histórico global.
```

Use taxa ou aumento calculado pelo backend.

Durante comparação, considere:

- restarts;
- scale-out;
- scale-in;
- novas réplicas;
- ausência temporária de série.

---

### 32. Tratar baixo volume

Percentis com poucas observações podem ser instáveis.

Exemplo:

```text
três requisições
em cinco minutos.
```

Um p99 nessa janela não representa uma população robusta.

Registre:

- count;
- janela;
- volume;
- confiança limitada.

Não tome decisão crítica somente pelo percentil.

---

### 33. Controlar dimensões

Dimensões permitidas:

- outcome;
- operation;
- channel;
- error category;
- dependency controlada;
- environment.

Dimensões proibidas:

- order ID;
- customer ID;
- correlation ID;
- trace ID;
- message ID;
- URL bruta;
- exception message;
- timestamp.

A política da aula 559 continua valendo.

---

### 34. Criar cenários de laboratório

Arquivo:

```text
golden-signals-scenarios.yaml
```

Cenários:

```text
baseline normal;

latência degradada;

tráfego aumentado;

erros aumentados;

saturação de fila;

saturação de conexões;

retry storm controlada;

release regressiva;

dependência lenta;

dependência indisponível.
```

Cada cenário precisa de:

- pré-condição;
- ação;
- sinais esperados;
- logs esperados;
- risco;
- cleanup;
- evidence.

---

### 35. Simular degradação de latência

Script:

```text
simulate-latency-degradation.ps1
```

Use atraso controlado por feature flag local.

Não use:

- indisponibilidade real;
- sleep permanente em produção;
- alteração não versionada;
- dependência externa.

Valide:

- timer;
- percentis;
- traffic estável;
- error rate estável;
- release;
- logs correlacionados.

---

### 36. Simular aumento de tráfego

Script:

```text
simulate-traffic-increase.ps1
```

Use carga limitada e local.

Registre:

- requests;
- completed operations;
- latency;
- errors;
- CPU;
- memory;
- queue;
- active tasks.

Interrompa quando atingir limites definidos.

Não transforme o laboratório em teste de capacidade destrutivo.

---

### 37. Simular aumento de erros

Script:

```text
simulate-error-increase.ps1
```

Use:

- entrada inválida;
- feature flag de falha controlada;
- dependência fake;
- timeout local.

Separe:

- rejeição;
- timeout;
- falha interna.

Valide se a categoria aparece em métrica e logs.

---

### 38. Simular saturação

Script:

```text
simulate-saturation.ps1
```

Cenários seguros:

- fila interna limitada;
- pool fake pequeno;
- tarefas longas controladas;
- consumer pausado em ambiente local.

Observe:

- queue size;
- active tasks;
- latency;
- traffic;
- errors;
- recovery após cleanup.

Não esgote recursos da máquina de forma indiscriminada.

---

### 39. Comparar antes e depois

Script:

```text
compare-release-signals.ps1
```

Entradas:

- baseline;
- release candidata;
- janelas equivalentes;
- tráfego normalizado;
- métricas dos quatro sinais.

Saída:

```text
improved;

stable;

degraded;

inconclusive.
```

`Inconclusive` é válido quando os dados são insuficientes.

Não force conclusão.

---

### 40. Criar runbook de diagnóstico

Arquivo:

```text
golden-signals-runbook.yaml
```

Sequência:

```yaml
diagnosis:
  - confirm-incident-window
  - confirm-release-and-environment
  - inspect-traffic
  - inspect-errors
  - inspect-latency
  - inspect-saturation
  - compare-baseline
  - inspect-dependencies
  - inspect-correlated-logs
  - validate-data-quality
  - record-hypothesis
  - define-next-action
```

A ordem pode mudar conforme o sintoma.

O runbook evita análise aleatória.

---

### 41. Testar o contrato

Crie testes ou validadores para:

- todos os sinais possuem métricas;
- cada métrica possui owner;
- nomes existem no catálogo;
- tags respeitam allowlist;
- janelas estão documentadas;
- latência possui unidade;
- tráfego possui denominador temporal;
- erro possui numerador e denominador conceituais;
- saturação possui capacidade;
- comparação por release possui identidade;
- dados insuficientes geram `inconclusive`;
- thresholds não são SLOs oficiais.

---

### 42. Criar matriz de testes

Arquivo:

```text
GOLDEN_SIGNALS_TEST_MATRIX.md
```

Cenários:

- baseline normal;
- latência aumenta;
- tráfego aumenta;
- erros aumentam;
- saturação aumenta;
- backlog cresce;
- throughput cai;
- dependency timeout;
- release muda;
- Counter reinicia;
- instância escala;
- volume baixo;
- tag inconsistente;
- métrica ausente;
- janela incomparável;
- dados stale;
- correlação com logs;
- recuperação;
- cleanup;
- evidence sanitizada.

---

### 43. Criar troubleshooting

Arquivo:

```text
GOLDEN_SIGNALS_TROUBLESHOOTING.md
```

Inclua:

- latência sem count;
- percentil instável;
- tráfego absoluto tratado como taxa;
- errors misturam rejeições;
- saturação sem capacidade;
- backlog sem métrica de entrada;
- Counter reinicia;
- release sem annotation;
- tags diferentes entre períodos;
- métrica sumiu após scale-in;
- dados atrasados;
- dashboard parece saudável com tráfego zero;
- logs e métricas divergem;
- dependência lenta sem métrica;
- alerta baseado em um único sinal;
- thresholds tratados como SLO.

---

### 44. Coletar evidence

Script:

```text
collect-golden-signals-evidence.ps1
```

Arquivo:

```text
golden-signals-evidence.json.
```

Campos permitidos:

- lesson;
- application;
- environment;
- release;
- latency signal status;
- traffic signal status;
- error signal status;
- saturation signal status;
- metric map status;
- cardinality status;
- windows status;
- release comparison status;
- scenarios status;
- diagnosis status;
- data quality status;
- tests status;
- timestamp.

Não inclua:

- IDs de negócio;
- correlation IDs;
- trace IDs;
- payloads;
- logs completos;
- credenciais;
- dados pessoais.

---

### 45. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\golden-signals\validate-service-boundary.ps1

.\scripts\observability\golden-signals\validate-golden-signals-contract.ps1

.\scripts\observability\golden-signals\validate-signal-metric-map.ps1

.\scripts\observability\golden-signals\validate-signal-cardinality.ps1

.\scripts\observability\golden-signals\simulate-latency-degradation.ps1

.\scripts\observability\golden-signals\simulate-traffic-increase.ps1

.\scripts\observability\golden-signals\simulate-error-increase.ps1

.\scripts\observability\golden-signals\simulate-saturation.ps1

.\scripts\observability\golden-signals\compare-release-signals.ps1

.\scripts\observability\golden-signals\run-golden-signals-diagnosis.ps1

.\scripts\observability\golden-signals\collect-golden-signals-evidence.ps1

.\scripts\observability\golden-signals\verify-golden-signals-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- service boundary definida;
- latência mapeada;
- tráfego mapeado;
- erros classificados;
- saturação relacionada à capacidade;
- tags controladas;
- cardinalidade aprovada;
- janelas documentadas;
- release comparison disponível;
- cenários simulados;
- diagnóstico executado;
- qualidade dos dados validada;
- evidence sanitizada;
- SLI e SLO não formalizados.

---

## Entendendo o que foi feito

### Métricas ganharam organização

O catálogo passou a responder perguntas operacionais integradas.

### Latência ganhou contexto

Percentis, outcomes e pontos de medição foram separados.

### Tráfego ganhou taxa

Counters deixaram de ser interpretados somente pelo valor absoluto.

### Erros ganharam classificação

Rejeições, timeouts e falhas internas deixaram de ser misturados.

### Saturação ganhou capacidade

Fila, pool e tarefas ativas passaram a possuir referência de limite.

### Janelas ganharam significado

Mudanças transitórias e sustentadas puderam ser diferenciadas.

### Releases ganharam comparação

Identidade e tráfego equivalente passaram a fazer parte da análise.

### Diagnóstico ganhou sequência

Hipóteses passaram a ser formuladas com múltiplos sinais.

### Qualidade dos dados ganhou política

Ausência, atraso, resets e volume baixo deixaram de ser ignorados.

### A próxima etapa ganhou base

SLI, SLO e SLA poderão ser definidos sobre sinais compreendidos.

---

## Erros comuns importantes

### Olhar somente latência

O sintoma aparece sem a causa.

### Tratar Counter como taxa

O valor absoluto não considera a janela.

### Misturar todos os erros

A ação operacional fica incorreta.

### Usar CPU como única saturação

Filas e pools podem estar esgotados antes.

### Comparar períodos diferentes

A conclusão pode refletir tráfego e não release.

### Ignorar baixo volume

Percentis ficam frágeis.

### Usar IDs como tags

A cardinalidade explode.

### Forçar uma conclusão

Dados insuficientes precisam gerar `inconclusive`.

### Criar alertas por um único sinal

A equipe recebe ruído.

### Chamar threshold didático de SLO

A formalização pertence à aula 561.

---

## Comandos úteis

### Listar métricas

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/metrics
```

### Simular latência

```powershell
.\scripts\observability\golden-signals\simulate-latency-degradation.ps1
```

### Simular tráfego

```powershell
.\scripts\observability\golden-signals\simulate-traffic-increase.ps1
```

### Simular erros

```powershell
.\scripts\observability\golden-signals\simulate-error-increase.ps1
```

### Simular saturação

```powershell
.\scripts\observability\golden-signals\simulate-saturation.ps1
```

---

## Exercício guiado

### Parte 1 — Boundary

Defina serviço, entradas e dependências.

### Parte 2 — Latency

Mapeie duração e percentis.

### Parte 3 — Traffic

Defina taxas de entrada e conclusão.

### Parte 4 — Errors

Classifique outcomes e denominadores.

### Parte 5 — Saturation

Relacione uso, backlog e capacidade.

### Parte 6 — Windows

Escolha janelas didáticas.

### Parte 7 — Release

Compare períodos equivalentes.

### Parte 8 — Scenarios

Simule os quatro sinais.

### Parte 9 — Diagnosis

Formule hipóteses usando múltiplos sinais.

### Parte 10 — Evidence

Valide qualidade e registre resultados.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 559 e ponte para a aula 561 foram preservadas;
- golden signals, latência, tráfego, erros, saturação, throughput, backlog, utilização, percentil, janela e service boundary foram definidos;
- baseline do Actuator e Micrometer foi validada;
- fronteira do serviço foi criada;
- entradas HTTP e mensageria foram mapeadas;
- dependências foram identificadas;
- contrato de golden signals foi criado;
- latência possui pontos de início e fim;
- latência separa outcomes;
- percentis são usados com count e janela;
- média não é usada isoladamente;
- tráfego possui unidade temporal;
- entrada e conclusão foram diferenciadas;
- HTTP e mensageria possuem semânticas distintas;
- erros possuem categorias controladas;
- error rate possui numerador e denominador conceituais;
- rejeições esperadas e falhas inesperadas foram separadas;
- métricas e logs possuem responsabilidades complementares;
- saturação possui referência de capacidade;
- backlog foi diferenciado de tráfego;
- mapa de métricas foi criado;
- janelas imediata, curta, comparação e baseline foram documentadas;
- períodos comparáveis foram exigidos;
- release comparison exige identidade e normalização;
- uma única métrica não decide sobre regressão;
- matriz de diagnóstico foi criada;
- cenários de latência, tráfego, erros e saturação foram analisados;
- backlog crescente foi relacionado a entrada e throughput;
- política de qualidade dos dados foi criada;
- Counter reset foi considerado;
- baixo volume limita confiança em percentis;
- tags e cardinalidade seguem a política da aula 559;
- cenários de laboratório foram criados;
- simulações são controladas e reversíveis;
- comparação admite resultado `inconclusive`;
- runbook de diagnóstico foi criado;
- contratos possuem validação;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- nenhum Secret ou dado pessoal foi usado;
- thresholds didáticos não foram declarados SLOs;
- SLI, SLO, SLA e error budget não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/golden-signals `
  scripts/observability/golden-signals `
  docs/observability/golden-signals `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure tags ou dados proibidos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "order_id|customer_id|correlation_id|trace_id|message_id|email|password|token|exception_message"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): organizar golden signals"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- amostras temporárias;
- outputs completos;
- IDs de negócio;
- correlation ou trace IDs;
- payloads;
- credentials;
- dashboards finais;
- SLOs;
- SLAs;
- material da aula 561.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as métricas da `orders-api` foram organizadas em quatro sinais operacionais:

```text
latência;

tráfego;

erros;

saturação.
```

Você comprovou que latência precisa de distribuição, outcome, unidade e ponto de medição; tráfego precisa de taxa e janela; erros precisam de classificação e denominador; saturação precisa de referência de capacidade; backlog e throughput precisam ser analisados juntos; médias e percentis exigem volume suficiente; Counters reiniciam; janelas precisam ser comparáveis; releases precisam de identidade; tags continuam limitadas; dados ausentes ou stale invalidam conclusões; e um incidente deve ser investigado com múltiplos sinais, logs correlacionados e contexto de deploy.

A próxima aula será:

```text
561 - M18.06 - SLI SLO SLA
```

Nela, você irá transformar sinais e métricas em indicadores formais, objetivos de serviço e compromissos claramente diferenciados.

Nenhum SLI completo, SLO, SLA, error budget ou política oficial de alerta foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini a fronteira do serviço.
- [ ] Mapeei latência e tráfego.
- [ ] Classifiquei erros.
- [ ] Relacionei saturação e capacidade.
- [ ] Defini janelas e comparação.
- [ ] Simulei os quatro sinais.
- [ ] Executei diagnóstico integrado.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### Latência não possui count

Consulte Timer count antes de interpretar percentis.

### Tráfego aparece somente como total

Calcule taxa por janela no backend de métricas.

### Error rate parece alta com pouco volume

Revise o denominador e o número de observações.

### Saturação está sem limite

Adicione capacidade máxima ou budget explícito.

### Backlog cresce sem erro

Compare entrada, conclusão, duração e dependências.

### Release nova parece pior

Normalize tráfego e compare janelas equivalentes.

### Métricas somem após restart

Considere resets e mudança de instâncias.

### Logs mostram falha, mas métrica não

Revise outcome e caminho de instrumentação.

### Threshold já virou objetivo oficial

Remova e preserve a formalização para a aula 561.

### Dashboard final começou a ser criado

Mantenha a aula focada no contrato dos sinais.

---

## Perguntas de revisão

1. O que são golden signals?
2. O que é latência?
3. O que é tráfego?
4. O que é error rate?
5. O que é saturação?
6. O que é backlog?
7. O que é throughput?
8. Por que separar outcomes?
9. Por que usar percentis?
10. Por que registrar count?
11. Por que Counter não é taxa?
12. Como relacionar capacidade?
13. Qual diferença entre utilização e saturação?
14. Como comparar releases?
15. O que é janela de análise?
16. O que fazer com baixo volume?
17. Como logs ajudam métricas?
18. O que significa `inconclusive`?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Latência, tráfego, erros e saturação.
2. Duração de uma operação.
3. Trabalho por janela.
4. Falhas divididas por operações elegíveis.
5. Proximidade do limite.
6. Trabalho pendente.
7. Trabalho concluído por tempo.
8. Evitar distribuição enganosa.
9. Observar a cauda.
10. Validar volume.
11. Precisa de delta e janela.
12. Comparar uso e limite.
13. Uso versus falta de headroom.
14. Identidade e janelas equivalentes.
15. Intervalo de agregação.
16. Reduzir confiança.
17. Fornecem detalhes correlacionados.
18. Dados insuficientes.
19. SLI, SLO e SLA.
20. SLI SLO SLA.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 560 - M18.05 - Golden signals

- Continuei após Micrometer.
- Organizei métricas em latência, tráfego, erros e saturação.
- Defini a fronteira da `orders-api`.
- Mapeei fluxos HTTP e assíncronos.
- Criei contrato de golden signals.
- Diferenciei latência da borda, negócio e dependências.
- Separei latência por outcome.
- Analisei p50, p95 e p99 com count e janela.
- Defini tráfego como taxa.
- Diferenciei entrada, conclusão e throughput.
- Classifiquei erros esperados e inesperados.
- Defini categorias controladas de falha.
- Relacionei métricas de erro com logs correlacionados.
- Defini saturação com referência de capacidade.
- Diferenciei backlog, utilização e saturação.
- Criei mapa de métricas por sinal.
- Defini janelas de análise didáticas.
- Criei política de comparação por release.
- Criei matriz de diagnóstico.
- Analisei cenários combinando os quatro sinais.
- Considerei reset de Counter, baixo volume e dados stale.
- Mantive tags dentro do budget de cardinalidade.
- Simulei degradação de latência, aumento de tráfego, erros e saturação.
- Criei runbook de diagnóstico.
- Coletei evidence sanitizada.
- Não formalizei SLI, SLO, SLA ou error budget.
- Próxima aula: SLI SLO SLA.
```

---

## Referência técnica curta

- Golden Signals.
- Service Monitoring.
- Latency Distributions.
- Traffic Rates.
- Error Classification.
- Saturation and Capacity.
- Percentiles.
- Backlog and Throughput.
- Release Comparison.
- Observability Data Quality.

Regra final:

```text
golden signals organizam a observação da aplicação em latência, tráfego, erros e saturação: latência possui ponto de medição, unidade, distribuição, outcome, count e janela; tráfego representa taxa de entrada ou conclusão, não o valor absoluto de Counter; erros usam categorias controladas e denominador explícito, mantendo detalhes nos logs correlacionados; saturação compara uso, backlog, tarefas ativas ou conexões com uma capacidade conhecida; percentis exigem volume suficiente, Counters podem reiniciar, dados stale ou ausentes tornam a análise incompleta e releases só podem ser comparadas em janelas equivalentes com identidade e tráfego normalizado; cenários controlados e uma matriz de diagnóstico conectam múltiplos sinais antes de qualquer conclusão, enquanto SLI, SLO, SLA e error budget ficam reservados para a aula 561.
```
