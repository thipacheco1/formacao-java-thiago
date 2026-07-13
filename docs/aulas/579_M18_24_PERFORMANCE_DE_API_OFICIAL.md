# 579 - M18.24 - Performance de API

## Apresentação da aula

Na aula 578, você aprendeu a diferenciar utilização alta de saturação real.

Você analisou:

```text
CPU;

throttling;

memória;

garbage collector;

thread pools;

pool JDBC;

banco;

Kafka;

filas;

disco;

rede;

dependências;

retries.
```

Você também aplicou:

```text
USE Method;

RED Method;

baseline;

correlação temporal;

classificação de estados.
```

Essa leitura permitiu responder:

```text
qual recurso
está sem capacidade;

qual sinal representa
apenas uso alto;

onde existe fila;

onde existe espera;

onde ocorre rejeição;

qual dependência
amplifica a latência?
```

Agora você irá atuar sobre a camada de API.

A pergunta deixa de ser apenas:

```text
onde existe saturação?
```

e passa a ser:

```text
como reduzir o custo
de cada requisição

sem quebrar contrato,
segurança,
consistência,
observabilidade
ou experiência do cliente?
```

**Performance de API** é a capacidade de uma interface atender operações com latência, throughput, consumo de recursos, payload e confiabilidade compatíveis com seus budgets e SLOs.

Uma API pode funcionar e ainda sofrer com payloads grandes, ausência de paginação, serialização excessiva, chamadas duplicadas, fan-out, timeouts incoerentes, retries ilimitados, caches inválidos, conexões mal reutilizadas e alocação elevada.

A análise desta aula será orientada por uma operação real do laboratório:

```text
POST /orders;

GET /orders/{id};

GET /orders;

GET /orders/{id}/status.
```

A API será otimizada por ciclos pequenos:

```text
medir;

formular hipótese;

alterar uma variável;

executar workload;

comparar budget;

validar contrato;

aprovar ou reverter.
```

A pergunta central será:

```text
como melhorar
latência,
throughput
e consumo por request

atuando sobre
contrato,
payload,
paginação,
serialização,
cache,
concorrência
e clientes HTTP?
```

Você irá trabalhar com:

- baseline por endpoint;
- payload mínimo;
- DTO específico;
- paginação;
- limite de página;
- ordenação estável;
- projeção;
- compressão;
- cache HTTP;
- `Cache-Control`;
- ETag conceitual;
- cache de aplicação;
- timeouts;
- conexão reutilizável;
- pool HTTP;
- bulkhead;
- retry budget;
- chamadas paralelas controladas;
- processamento assíncrono;
- streaming quando adequado;
- idempotência;
- medição de alocação;
- gates de regressão.

O objetivo é manter a operação dentro do budget com margem e previsibilidade.

Exemplo inadequado:

```text
ativar cache
em todas as respostas.
```

Cache pode introduzir dados obsoletos, invalidação incorreta, vazamento de autorização, crescimento de memória e inconsistência entre réplicas.

Exemplo adequado:

```text
endpoint de consulta;

resultado imutável
durante pequena janela;

chave segura;

TTL explícito;

invalidação documentada;

métrica de hit e miss;

fallback para origem.
```

A aula distinguirá latência do servidor, dependência, fila, serialização, rede e tempo percebido pelo cliente.

Uma otimização local pode não melhorar a jornada.

Exemplo:

```text
controller:
5 ms mais rápido.

dependência:
400 ms.

resultado final:
sem melhora relevante.
```

Por isso, traces e budgets continuarão sendo usados.

A aula não irá aprofundar o plano de execução, índices, estatísticas, joins, locks ou tuning de consultas no banco.

Esses assuntos pertencem à próxima aula oficial:

```text
580 - M18.25 - Performance de banco
```

Nesta aula, o banco será tratado como uma dependência observada por:

- quantidade de queries;
- tempo total;
- conexão;
- timeout;
- linhas retornadas;
- participação no trace.

A regra central será:

```text
otimização de API
começa pela jornada
e pelo budget;

não por uma técnica
escolhida antecipadamente.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
577:
Orcamento de performance.

578:
Leitura de saturacao.

579:
Performance de API.

580:
Performance de banco.
```

A progressão é:

```text
definir limites;

identificar saturação;

otimizar a camada HTTP;

aprofundar o banco.
```

Nesta aula:

```text
baseline por endpoint:
sim.

payload:
sim.

DTO específico:
sim.

paginação:
sim.

serialização:
sim.

compressão:
sim.

cache HTTP:
sim.

cache de aplicação:
sim.

cliente HTTP:
sim.

timeouts:
sim.

retry:
sim.

bulkhead:
sim.

concorrência controlada:
sim.

streaming:
sim.

query count:
sim.

plano de execução:
não.

índice de banco:
não.

tuning SQL:
não.
```

Você reutilizará:

- performance budgets;
- capacity planning;
- leitura de saturação;
- RED e USE;
- traces;
- métricas;
- logs;
- JFR;
- JMC;
- GC logs;
- testes de carga;
- contratos OpenAPI;
- cenários de falha;
- runbooks.

A otimização precisa preservar:

- contrato;
- segurança;
- autorização;
- idempotência;
- consistência;
- observabilidade;
- compatibilidade;
- capacidade de rollback.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/api
├── api-performance-contract.yaml
├── api-endpoint-catalog.yaml
├── api-baseline-policy.yaml
├── api-payload-policy.yaml
├── api-pagination-policy.yaml
├── api-serialization-policy.yaml
├── api-compression-policy.yaml
├── api-http-cache-policy.yaml
├── api-application-cache-policy.yaml
├── api-client-policy.yaml
├── api-timeout-policy.yaml
├── api-retry-policy.yaml
├── api-bulkhead-policy.yaml
├── api-concurrency-policy.yaml
├── api-streaming-policy.yaml
├── api-idempotency-policy.yaml
├── api-observability-policy.yaml
├── api-regression-policy.yaml
├── api-security-policy.yaml
├── api-failure-policy.yaml
├── api-performance-scenarios.yaml
└── api-performance-evidence.yaml

performance/api/reports
├── api-baseline-report.yaml
├── api-payload-report.yaml
├── api-pagination-report.yaml
├── api-cache-report.yaml
├── api-client-report.yaml
├── api-concurrency-report.yaml
└── api-performance-gate-report.yaml

scripts/performance/api
├── validate-api-performance-contract.ps1
├── collect-api-performance-baseline.ps1
├── measure-api-latency.ps1
├── measure-api-payload.ps1
├── measure-api-serialization.ps1
├── validate-api-pagination.ps1
├── validate-api-compression.ps1
├── validate-http-cache.ps1
├── validate-application-cache.ps1
├── measure-http-client.ps1
├── validate-api-timeouts.ps1
├── validate-api-retries.ps1
├── validate-api-bulkhead.ps1
├── validate-api-concurrency.ps1
├── validate-api-streaming.ps1
├── validate-api-idempotency.ps1
├── compare-api-performance.ps1
├── enforce-api-performance-budget.ps1
├── simulate-api-performance-scenarios.ps1
├── scan-api-performance-output.ps1
├── collect-api-performance-evidence.ps1
└── verify-api-performance-baseline.ps1

docs/performance/api
├── API_PERFORMANCE_OVERVIEW.md
├── PAYLOAD_AND_DTO_GUIDE.md
├── PAGINATION_GUIDE.md
├── SERIALIZATION_AND_COMPRESSION.md
├── HTTP_CACHE_GUIDE.md
├── APPLICATION_CACHE_GUIDE.md
├── HTTP_CLIENT_PERFORMANCE.md
├── TIMEOUT_RETRY_BULKHEAD.md
├── API_PERFORMANCE_TEST_MATRIX.md
└── API_PERFORMANCE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
catálogo de endpoints;

baseline por operação;

budgets aplicados;

payloads medidos;

paginação validada;

serialização medida;

compressão validada;

caches controlados;

cliente HTTP medido;

timeouts coerentes;

retry limitado;

bulkhead;

concorrência controlada;

evidence sanitizada.
```

Você irá medir endpoints, identificar custo dominante, reduzir trabalho, validar contrato, comparar resultados e executar o gate.

---

## Conceito essencial

### API performance

Comportamento de latência, throughput, consumo, payload e confiabilidade de uma interface.

---

### Server processing time

Tempo gasto dentro do serviço para processar a operação.

---

### End-to-end latency

Tempo total percebido pelo cliente.

---

### Time to first byte

Tempo até o recebimento do primeiro byte da resposta.

---

### Payload size

Quantidade de bytes transmitidos no request, response ou mensagem.

---

### Serialization cost

CPU, tempo e alocação gastos para converter objetos em representação externa.

---

### Projection

Seleção apenas dos campos necessários para uma operação.

---

### Pagination

Divisão de uma coleção em páginas limitadas.

---

### Offset pagination

Paginação baseada em deslocamento e limite.

---

### Cursor pagination

Paginação baseada em um cursor estável.

---

### Stable ordering

Ordenação determinística usada para evitar itens duplicados ou omitidos entre páginas.

---

### Compression

Redução do tamanho transmitido usando codificação como gzip.

---

### HTTP caching

Reutilização de resposta com semântica HTTP.

---

### Cache-Control

Cabeçalho que define regras de cache.

---

### ETag

Identificador de versão de uma representação usado para validação condicional.

---

### Application cache

Cache interno ou externo controlado pela aplicação.

---

### Connection reuse

Reutilização de conexões HTTP existentes.

---

### Connection pool

Conjunto de conexões disponíveis para chamadas externas.

---

### Timeout budget

Distribuição do tempo máximo da jornada entre etapas e dependências.

---

### Retry budget

Limite de novas tentativas permitido sem amplificar excessivamente a carga.

---

### Bulkhead

Isolamento de recursos para impedir que uma dependência consuma toda a capacidade.

---

### Fan-out

Uma operação que dispara múltiplas chamadas descendentes.

---

### Backpressure

Controle da entrada quando a capacidade downstream é insuficiente.

---

### Idempotency

Propriedade que permite repetir uma operação sem produzir efeito duplicado indevido.

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

- release identificada;
- budgets da aula 577 disponíveis;
- dashboards da aula 578 disponíveis;
- cenários reproduzíveis;
- contratos OpenAPI conhecidos;
- payloads sintéticos;
- traces ativos;
- dependências locais controladas;
- nenhum tuning detalhado de banco será antecipado.

---

### 2. Criar contrato de performance de API

Arquivo:

```text
api-performance-contract.yaml
```

Conteúdo:

```yaml
apiPerformance:
  endpoint:
    required:
      - method
      - path
      - owner
      - criticality
      - budget

  measurement:
    required:
      - workload
      - warmup
      - repetitions
      - latency
      - throughput
      - payload
      - errors
      - allocations
      - dependencies

  change:
    oneVariableAtATime:
      required

  compatibility:
    required:
      - contract
      - authorization
      - idempotency
      - observability

  decision:
    allowed:
      - approve
      - reject
      - inconclusive

  databaseDeepDive:
    deferredToLesson580
```

---

### 3. Criar catálogo de endpoints

Arquivo:

```text
api-endpoint-catalog.yaml
```

Conteúdo:

```yaml
endpoints:
  - id:
      API-ORDER-CREATE

    method:
      POST

    path:
      /orders

    criticality:
      high

    owner:
      orders-api

    budget:
      PB-ORDER-CREATE

    characteristics:
      - synchronous-validation
      - payment-dependency
      - database-write
      - Kafka-publish

  - id:
      API-ORDER-LIST

    method:
      GET

    path:
      /orders

    criticality:
      medium

    characteristics:
      - collection
      - pagination-required
      - projection-required
```

---

### 4. Coletar baseline por endpoint

Script:

```text
collect-api-performance-baseline.ps1
```

Para cada operação, registre percentis, throughput, erros, bytes, serialização, alocação, queries, dependências, CPU, heap, GC e release.

Use três execuções equivalentes.

---

### 5. Criar política de baseline

Arquivo:

```text
api-baseline-policy.yaml
```

Conteúdo:

```yaml
baseline:
  required:
    - approved-release
    - equivalent-environment
    - equivalent-workload
    - warmup
    - minimum-samples
    - repetitions

  endpoints:
    independent:
      true

  aggregateOnly:
    forbidden

  stale:
    action:
      recollect
```

Uma média global pode esconder endpoint lento.

---

### 6. Identificar o custo dominante

Use trace e métricas para dividir a operação:

```text
fila;

controller;

validação;

serialização;

banco;

dependência;

Kafka;

resposta.
```

Exemplo:

```text
p95 total:
420 ms.

payment:
250 ms.

database:
90 ms.

serialization:
35 ms.

application:
45 ms.
```

O maior ganho provável está na dependência.

Não otimize 5 ms e ignore 250 ms.

---

### 7. Criar política de payload

Arquivo:

```text
api-payload-policy.yaml
```

Conteúdo:

```yaml
payload:
  measure:
    - request-bytes
    - response-bytes
    - compressed-bytes
    - field-count
    - collection-size

  endpoint:
    maximum:
      budgeted

  sensitiveContent:
    repository:
      forbidden

  unnecessaryFields:
    action:
      use-specific-dto-or-projection

  unboundedCollection:
    forbidden
```

---

### 8. Medir payload

Script:

```text
measure-api-payload.ps1
```

Registre:

- endpoint;
- status;
- content type;
- bytes brutos;
- bytes comprimidos;
- quantidade de itens;
- campos;
- release;
- budget;
- gate.

Não salve conteúdo real.

---

### 9. Criar DTO específico

Evite retornar entidade completa.

Exemplo:

```java
public record OrderSummaryResponse(
        UUID id,
        String status,
        BigDecimal total,
        Instant createdAt) {
}
```

Um endpoint de lista não precisa retornar histórico completo, dados internos, auditoria, payload de integração ou relações não solicitadas.

DTO específico reduz serialização, payload, acoplamento, exposição e alocação.

---

### 10. Evitar campo opcional indiscriminado

Adicionar dezenas de parâmetros como:

```text
includeItems;

includeHistory;

includePayment;

includeAudit;

includeEvents.
```

pode criar contrato difícil de otimizar.

Prefira:

- endpoints específicos;
- projeções controladas;
- expansão limitada;
- campos documentados;
- budget por variação.

---

### 11. Criar política de paginação

Arquivo:

```text
api-pagination-policy.yaml
```

Conteúdo:

```yaml
pagination:
  collections:
    required

  pageSize:
    default:
      20

    maximum:
      100

  ordering:
    stable:
      required

  response:
    metadata:
      required:
        - size
        - hasNext

  totalCount:
    optional:
      true

  unbounded:
    forbidden

  databaseOptimization:
    deferredToLesson580
```

Os valores são didáticos.

---

### 12. Implementar paginação limitada

Contrato:

```text
GET /orders?size=20&cursor=<token>
```

Resposta:

```json
{
  "items": [
    {
      "id": "synthetic-id",
      "status": "CONFIRMED",
      "total": 150.00,
      "createdAt": "2026-07-13T00:00:00Z"
    }
  ],
  "nextCursor": "opaque-token",
  "hasNext": true
}
```

O cursor precisa ser opaco e validado.

Não exponha detalhes internos sensíveis.

---

### 13. Offset versus cursor

Offset pagination é simples, mas pode ter custo crescente e instabilidade. Cursor pagination favorece sequência estável, grandes coleções e custo previsível.

A otimização SQL será aprofundada na aula 580.

---

### 14. Validar paginação

Script:

```text
validate-api-pagination.ps1
```

Valide:

- page size default;
- maximum;
- size inválido;
- cursor inválido;
- ordenação estável;
- ausência de duplicidade;
- ausência de lacuna;
- `hasNext`;
- payload;
- latência;
- contrato.

---

### 15. Criar política de serialização

Arquivo:

```text
api-serialization-policy.yaml
```

Conteúdo:

```yaml
serialization:
  measure:
    - time
    - allocation
    - payload-bytes

  DTO:
    specific:
      required

  cycles:
    forbidden

  lazyEntityExposure:
    forbidden

  dateFormat:
    stable:
      required

  nullFields:
    contractDriven:
      true

  customSerializer:
    requiresBenchmark:
      true
```

---

### 16. Medir serialização

Script:

```text
measure-api-serialization.ps1
```

Compare:

```text
entidade completa;

DTO detalhado;

DTO resumido.
```

Meça:

- tempo;
- bytes;
- alocação;
- GC;
- p95 do endpoint.

Não conclua por microbenchmark isolado.

---

### 17. Evitar ciclos e carregamento acidental

Entidades bidirecionais podem causar ciclos, payload enorme, lazy loading, N+1, exceções e exposição interna.

Mapeie explicitamente:

```text
entity
→
response DTO.
```

O detalhe de query e fetch será tratado na aula 580.

---

### 18. Criar política de compressão

Arquivo:

```text
api-compression-policy.yaml
```

Conteúdo:

```yaml
compression:
  contentTypes:
    allowed:
      - application/json
      - text/plain

  minimumSize:
    required

  CPU:
    measure:
      required

  smallPayload:
    compress:
      false

  alreadyCompressed:
    skip:
      true

  sensitiveResponse:
    securityReview:
      required
```

Compressão reduz rede, mas consome CPU.

---

### 19. Validar compressão

Script:

```text
validate-api-compression.ps1
```

Compare:

- payload bruto;
- payload comprimido;
- CPU;
- latência;
- throughput;
- tamanho;
- content type.

Exemplo:

```text
payload:
120 KiB.

gzip:
18 KiB.

CPU:
+3%.

latência:
-20%.
```

A aprovação depende do budget e do recurso limitante.

---

### 20. Criar política de cache HTTP

Arquivo:

```text
api-http-cache-policy.yaml
```

Conteúdo:

```yaml
httpCache:
  safeMethods:
    - GET
    - HEAD

  response:
    classify:
      - public
      - private
      - no-store

  headers:
    supported:
      - Cache-Control
      - ETag
      - Last-Modified
      - Vary

  authorizationSensitive:
    publicCache:
      forbidden

  staleData:
    businessDecision:
      required
```

---

### 21. Aplicar `Cache-Control`

Exemplos:

```text
Cache-Control: no-store
```

para resposta sensível.

```text
Cache-Control: private, max-age=30
```

para resposta privada com pequena janela.

```text
Cache-Control: public, max-age=60
```

somente quando o conteúdo for realmente público.

Não trate autenticação como detalhe de performance.

---

### 22. Usar validação condicional

Fluxo conceitual:

```text
cliente recebe ETag;

cliente envia If-None-Match;

servidor compara versão;

sem alteração:
304 Not Modified.
```

A validação condicional reduz bytes e serialização, mas exige identificador, versionamento e consistência.

Use versão estável, não hash caro sem necessidade.

---

### 23. Validar cache HTTP

Script:

```text
validate-http-cache.ps1
```

Valide:

- primeira resposta;
- headers;
- request condicional;
- status 304;
- ausência de body;
- autorização;
- `Vary`;
- atualização do recurso;
- invalidação;
- budget.

---

### 24. Criar política de cache de aplicação

Arquivo:

```text
api-application-cache-policy.yaml
```

Conteúdo:

```yaml
applicationCache:
  candidate:
    require:
      - read-heavy
      - stable-key
      - bounded-cardinality
      - acceptable-staleness
      - invalidation-strategy

  metrics:
    required:
      - hit
      - miss
      - load-time
      - eviction
      - size

  authorization:
    keyIsolation:
      required

  unbounded:
    forbidden

  sourceOfTruth:
    preserved:
      true
```

---

### 25. Escolher candidato de cache

Candidato:

```text
GET /orders/{id}/status
```

somente se:

- consulta for frequente;
- status tolerar pequeno TTL;
- chave incluir tenant quando necessário;
- atualização invalidar;
- miss buscar origem;
- tamanho for limitado.

Não use cache para esconder causa desconhecida.

---

### 26. Validar cache de aplicação

Script:

```text
validate-application-cache.ps1
```

Meça:

- miss latency;
- hit latency;
- hit ratio;
- load time;
- size;
- eviction;
- stale response;
- invalidation;
- memória;
- segurança da chave.

Cenários:

```text
cold cache;

warm cache;

update;

eviction;

source unavailable;

multi-tenant isolation.
```

---

### 27. Criar política do cliente HTTP

Arquivo:

```text
api-client-policy.yaml
```

Conteúdo:

```yaml
httpClient:
  reuse:
    connections:
      required

  pool:
    bounded:
      required

  timeouts:
    required:
      - connect
      - response
      - acquisition

  DNS:
    behavior:
      documented

  redirects:
    limited:
      true

  metrics:
    required:
      - active
      - pending
      - acquisition-time
      - errors
      - latency
```

Criar cliente por request destrói reutilização de conexão.

---

### 28. Medir o cliente HTTP

Script:

```text
measure-http-client.ps1
```

Compare:

```text
cliente novo por request;

cliente singleton com pool.
```

Meça:

- connection count;
- handshake;
- acquisition wait;
- p95;
- throughput;
- CPU;
- sockets;
- erros.

A configuração singleton respeita lifecycle e shutdown.

---

### 29. Criar política de timeout

Arquivo:

```text
api-timeout-policy.yaml
```

Conteúdo:

```yaml
timeouts:
  journey:
    total:
      required

  dependency:
    lessThanRemainingJourneyBudget:
      required

  connect:
    explicit:
      required

  response:
    explicit:
      required

  acquisition:
    explicit:
      required

  infinite:
    forbidden
```

Timeout de dependência não pode exceder o tempo restante da jornada.

---

### 30. Compor timeouts

Exemplo:

```text
budget total:
500 ms.

processamento local:
80 ms.

banco:
100 ms.

margem:
70 ms.

restante para dependência:
250 ms.
```

Configurar timeout de 2 segundos nessa dependência contradiz o budget.

---

### 31. Validar timeouts

Script:

```text
validate-api-timeouts.ps1
```

Cenários:

- conexão lenta;
- resposta lenta;
- pool esgotado;
- timeout;
- cancelamento;
- cleanup;
- trace;
- métrica;
- resposta da API.

Valide que o trabalho downstream seja cancelado quando possível.

---

### 32. Criar política de retry

Arquivo:

```text
api-retry-policy.yaml
```

Conteúdo:

```yaml
retry:
  eligible:
    require:
      - transient-failure
      - idempotent-operation
      - remaining-time-budget

  maximumAttempts:
    bounded:
      required

  backoff:
    required

  jitter:
    required

  retryAfter:
    respect:
      true

  nonIdempotent:
    forbiddenWithoutIdempotencyKey

  metrics:
    required:
      - attempts
      - success-after-retry
      - exhausted
      - amplification
```

---

### 33. Validar retry

Script:

```text
validate-api-retries.ps1
```

Simule:

- timeout transitório;
- conexão recusada;
- `429`;
- `503`;
- falha permanente;
- budget esgotado;
- idempotency key ausente.

O retry precisa parar quando o budget de tempo acabar.

---

### 34. Criar política de bulkhead

Arquivo:

```text
api-bulkhead-policy.yaml
```

Conteúdo:

```yaml
bulkhead:
  dependency:
    isolatedCapacity:
      required

  concurrency:
    bounded:
      required

  queue:
    bounded:
      required

  rejection:
    explicit:
      required

  fallback:
    optional:
      true

  metrics:
    required:
      - active
      - queue
      - rejection
      - wait
```

Bulkhead impede que uma dependência lenta consuma todos os workers.

---

### 35. Validar bulkhead

Script:

```text
validate-api-bulkhead.ps1
```

Cenário:

```text
payment lento;

limite:
10 chamadas concorrentes;

fila:
20;

restante:
rejeitado ou fallback.
```

Valide:

- outras operações continuam;
- queue não cresce indefinidamente;
- timeout permanece coerente;
- erro é observável;
- recuperação ocorre.

---

### 36. Criar política de concorrência

Arquivo:

```text
api-concurrency-policy.yaml
```

Conteúdo:

```yaml
concurrency:
  fanOut:
    maximum:
      definedPerOperation

  parallelCalls:
    require:
      - independence
      - bounded-executor
      - shared-time-budget
      - cancellation

  blocking:
    avoidOnCriticalPool:
      true

  unboundedAsync:
    forbidden

  resultOrdering:
    preservedWhenRequired
```

Paralelismo não cria capacidade de dependência.

---

### 37. Paralelizar chamadas independentes

Sequencial:

```text
dependência A:
120 ms.

dependência B:
150 ms.

total aproximado:
270 ms.
```

Paralelo controlado:

```text
total aproximado:
max(120, 150)
+
overhead.
```

Só paralelize resultados independentes, com capacidade, timeout compartilhado, falha parcial definida e executor limitado.

---

### 38. Validar concorrência

Script:

```text
validate-api-concurrency.ps1
```

Compare:

- sequencial;
- paralelo limitado;
- fan-out excessivo;
- dependência degradada;
- cancelamento;
- timeout;
- CPU;
- threads;
- p95;
- throughput.

Rejeite melhoria de latência que sature dependências.

---

### 39. Criar política de streaming

Arquivo:

```text
api-streaming-policy.yaml
```

Conteúdo:

```yaml
streaming:
  candidate:
    require:
      - large-response
      - progressive-consumption
      - bounded-source
      - cancellation-support

  measure:
    - time-to-first-byte
    - total-duration
    - memory
    - connection-occupancy

  smallResponse:
    use:
      false

  infiniteStream:
    requiresSeparateContract
```

Streaming pode reduzir memória e melhorar TTFB, mas mantém conexão ocupada.

---

### 40. Validar streaming

Script:

```text
validate-api-streaming.ps1
```

Compare:

- resposta materializada;
- resposta streaming;
- TTFB;
- duração total;
- heap;
- conexão;
- cancelamento;
- erro parcial.

Não use streaming para esconder coleção sem paginação.

---

### 41. Criar política de idempotência

Arquivo:

```text
api-idempotency-policy.yaml
```

Conteúdo:

```yaml
idempotency:
  unsafeRetry:
    requiresKey:
      true

  key:
    validate:
      required

    scope:
      operation-and-owner

    retention:
      bounded

  duplicateRequest:
    sameOutcome:
      required

  responseReplay:
    sensitiveData:
      protected
```

---

### 42. Validar idempotência

Script:

```text
validate-api-idempotency.ps1
```

Cenários:

- primeira requisição;
- repetição com mesma chave;
- mesma chave e payload incompatível;
- chave expirada;
- concorrência;
- timeout após persistência;
- retry do cliente.

A API deve evitar pedido duplicado.

---

### 43. Criar política de observabilidade

Arquivo:

```text
api-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  endpoint:
    required:
      - rate
      - errors
      - duration
      - payload-size
      - dependency-time
      - query-count

  cache:
    required:
      - hit
      - miss
      - eviction

  client:
    required:
      - active
      - pending
      - timeout
      - retry

  cardinality:
    bounded:
      required

  routeTemplate:
    useInsteadOfRawPath:
      true
```

Use:

```text
/orders/{id}
```

e não IDs reais como label.

---

### 44. Criar política de regressão

Arquivo:

```text
api-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - p50
    - p95
    - p99
    - throughput
    - errors
    - payload
    - serialization
    - allocation
    - dependency-time
    - query-count

  absoluteBudget:
    required

  relativeBudget:
    required

  contractRegression:
    fail:
      true

  securityRegression:
    fail:
      true
```

---

### 45. Comparar performance

Script:

```text
compare-api-performance.ps1
```

Para cada endpoint:

```text
baseline;

candidate;

budget;

delta;

confidence;

status.
```

Status:

```text
PASS;

FAIL_LATENCY;

FAIL_THROUGHPUT;

FAIL_PAYLOAD;

FAIL_ALLOCATION;

FAIL_DEPENDENCY;

FAIL_CONTRACT;

INCONCLUSIVE.
```

---

### 46. Criar política de segurança

Arquivo:

```text
api-security-policy.yaml
```

Conteúdo:

```yaml
security:
  optimization:
    cannotBypass:
      - authentication
      - authorization
      - validation
      - audit

  cache:
    tenantIsolation:
      required

  compression:
    sensitiveResponse:
      review:
        required

  metrics:
    businessId:
      forbidden

  reports:
    payloadContent:
      forbidden
```

Performance nunca justifica remover controle de segurança.

---

### 47. Criar failure policy

Arquivo:

```text
api-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  contractBreak:
    action:
      rollback

  budgetExceeded:
    action:
      reject-change

  staleCache:
    action:
      disable-cache-and-investigate

  retryStorm:
    action:
      stop-retry-and-protect

  poolExhaustion:
    action:
      invoke-runbook

  sensitiveData:
    action:
      block-artifact

  databaseDeepDive:
    deferredToLesson580
```

---

### 48. Criar cenários

Arquivo:

```text
api-performance-scenarios.yaml
```

Cenários:

```text
baseline;

oversized-payload;

unbounded-list;

cursor-pagination;

serialization-heavy;

compression-beneficial;

compression-not-beneficial;

http-cache-304;

application-cache-hit;

application-cache-stale;

client-without-reuse;

client-with-pool;

dependency-timeout;

retry-success;

retry-storm;

bulkhead-protection;

parallel-independent-calls;

fan-out-excessive;

streaming-large-response;

idempotent-retry.
```

Cada cenário registra endpoint, workload, baseline, mudança, budget, contrato, segurança, resultado, rollback e evidence.

---

### 49. Simular payload excessivo

Retorne DTO completo em `/orders`.

Meça bytes, serialização, alocação, p95 e throughput.

Depois aplique `OrderSummaryResponse`.

Compare.

A aprovação exige contrato adequado e ganho consistente.

---

### 50. Simular lista sem limite

Teste:

```text
GET /orders
```

sem paginação.

Observe payload, heap, GC, latência, queries, conexões e timeout.

Depois aplique paginação limitada.

Não altere índices nesta aula.

---

### 51. Simular cache

Teste:

```text
cold miss;

warm hit;

update;

invalidated miss;

expired entry;

tenant isolation.
```

Valide hit ratio, stale, memória, origem, p95 e segurança.

---

### 52. Simular dependência lenta

Configure payment simulator com latência controlada.

Teste:

- timeout;
- retry;
- bulkhead;
- fallback;
- recuperação.

Confirme que uma dependência lenta não esgote toda a API.

---

### 53. Criar matriz de testes

Arquivo:

```text
API_PERFORMANCE_TEST_MATRIX.md
```

Cenários:

- baseline;
- endpoint budget;
- payload;
- DTO;
- paginação;
- cursor inválido;
- stable ordering;
- serialization;
- compression;
- `Cache-Control`;
- ETag;
- 304;
- application cache;
- stale cache;
- tenant isolation;
- connection reuse;
- client pool;
- connect timeout;
- response timeout;
- acquisition timeout;
- retry;
- jitter;
- `Retry-After`;
- bulkhead;
- queue rejection;
- parallel calls;
- fan-out;
- streaming;
- cancellation;
- idempotency;
- contract;
- security;
- evidence sanitizada.

---

### 54. Criar troubleshooting

Arquivo:

```text
API_PERFORMANCE_TROUBLESHOOTING.md
```

Inclua:

- p95 pior após DTO;
- payload pequeno sem ganho;
- paginação duplica itens;
- cursor inválido;
- total count caro;
- compressão aumenta CPU;
- 304 nunca ocorre;
- cache retorna stale;
- chave mistura tenants;
- cliente abre muitas conexões;
- acquisition timeout;
- retry excede budget;
- bulkhead rejeita demais;
- paralelismo reduz throughput;
- streaming mantém conexão;
- idempotency key conflita;
- query count cresce;
- tuning de banco antecipado.

---

### 55. Coletar evidence

Script:

```text
collect-api-performance-evidence.ps1
```

Arquivo:

```text
api-performance-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release e status de catálogo, baseline, latência, throughput, payload, paginação, serialização, caches, cliente, timeouts, retries, bulkhead, concorrência, streaming, idempotência, contrato, segurança, gate e testes.

Não inclua:

- payload;
- tokens;
- IDs reais;
- URLs privadas;
- hostnames;
- query text;
- plano de execução;
- índices;
- tuning de banco;
- material da aula 580.

---

### 56. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\api\validate-api-performance-contract.ps1

.\scripts\performance\api\collect-api-performance-baseline.ps1

.\scripts\performance\api\measure-api-latency.ps1

.\scripts\performance\api\measure-api-payload.ps1

.\scripts\performance\api\measure-api-serialization.ps1

.\scripts\performance\api\validate-api-pagination.ps1

.\scripts\performance\api\validate-api-compression.ps1

.\scripts\performance\api\validate-http-cache.ps1

.\scripts\performance\api\validate-application-cache.ps1

.\scripts\performance\api\measure-http-client.ps1

.\scripts\performance\api\validate-api-timeouts.ps1

.\scripts\performance\api\validate-api-retries.ps1

.\scripts\performance\api\validate-api-bulkhead.ps1

.\scripts\performance\api\validate-api-concurrency.ps1

.\scripts\performance\api\validate-api-streaming.ps1

.\scripts\performance\api\validate-api-idempotency.ps1

.\scripts\performance\api\compare-api-performance.ps1

.\scripts\performance\api\enforce-api-performance-budget.ps1

.\scripts\performance\api\simulate-api-performance-scenarios.ps1

.\scripts\performance\api\scan-api-performance-output.ps1

.\scripts\performance\api\collect-api-performance-evidence.ps1

.\scripts\performance\api\verify-api-performance-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- baseline aprovada;
- latência medida;
- throughput medido;
- payload aprovado;
- paginação aprovada;
- serialização aprovada;
- compressão aprovada;
- cache HTTP aprovado;
- cache de aplicação aprovado;
- cliente HTTP aprovado;
- timeouts aprovados;
- retries aprovados;
- bulkhead aprovado;
- concorrência aprovada;
- streaming aprovado;
- idempotência aprovada;
- contrato preservado;
- segurança preservada;
- gate aprovado;
- evidence sanitizada;
- performance de banco não antecipada.

---

### 57. Encerrar o laboratório

Pare workloads e simuladores.

Remova somente artifacts temporários:

```powershell
Remove-Item `
  .tmp/api-performance `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve policies;
- preserve reports;
- preserve scripts;
- preserve docs;
- confirme que outputs brutos não estão no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### A API ganhou baseline por operação

A média global deixou de esconder endpoints problemáticos.

### Payload ganhou limite

Campos desnecessários passaram a ter custo mensurável.

### DTO ganhou finalidade

Contrato e performance deixaram de depender da entidade.

### Paginação ganhou previsibilidade

Coleções ilimitadas foram substituídas por páginas com ordenação estável.

### Serialização ganhou medição

Tempo, bytes e alocação passaram a ser comparados.

### Compressão ganhou trade-off

Redução de rede passou a ser avaliada contra CPU.

### Cache ganhou semântica

HTTP cache e application cache passaram a ter regras, métricas e invalidação.

### Cliente HTTP ganhou lifecycle

Reutilização, pool e timeouts substituíram clientes criados por request.

### Retry ganhou budget

Tentativas deixaram de ampliar carga sem limite.

### Bulkhead ganhou isolamento

Dependências lentas deixaram de consumir toda a capacidade.

### Concorrência ganhou limite

Paralelismo passou a respeitar executor, dependência e timeout.

### A próxima aula ganhou fronteira

A performance de banco irá aprofundar a origem das queries, planos, índices, joins, locks e estatísticas.

---

## Erros comuns importantes

### Otimizar sem baseline

Não existe prova de melhoria.

### Retornar entidade

Contrato, segurança e serialização ficam acoplados.

### Remover campos sem contrato

A performance melhora quebrando compatibilidade.

### Criar paginação sem ordenação

Itens podem duplicar ou desaparecer.

### Comprimir qualquer resposta

Payload pequeno pode consumir mais CPU sem benefício.

### Cachear resposta autorizada como pública

Dados podem vazar.

### Criar cliente HTTP por request

Conexões e handshakes são repetidos.

### Usar timeout maior que a jornada

A resposta chega tarde demais.

### Aplicar retry a POST sem idempotência

Efeitos duplicados podem ocorrer.

### Paralelizar fan-out sem limite

Dependências podem saturar.

### Antecipar tuning de banco

Planos, índices e SQL pertencem à aula 580.

---

## Comandos úteis

### Coletar baseline

```powershell
.\scripts\performance\api\collect-api-performance-baseline.ps1
```

### Medir payload

```powershell
.\scripts\performance\api\measure-api-payload.ps1
```

### Validar paginação

```powershell
.\scripts\performance\api\validate-api-pagination.ps1
```

### Validar cliente HTTP

```powershell
.\scripts\performance\api\measure-http-client.ps1
```

### Executar gate

```powershell
.\scripts\performance\api\enforce-api-performance-budget.ps1
```

---

## Exercício guiado

### Parte 1 — Baseline

Meça create, get, list e status.

### Parte 2 — Payload

Crie DTOs específicos.

### Parte 3 — Pagination

Implemente limite e cursor.

### Parte 4 — Serialization

Compare entidade e DTO.

### Parte 5 — Compression e cache HTTP

Valide tamanho, CPU e 304.

### Parte 6 — Application cache

Teste hit, miss e invalidação.

### Parte 7 — HTTP client

Valide pool, reuse e timeouts.

### Parte 8 — Resilience

Teste retry, bulkhead e idempotência.

### Parte 9 — Concurrency

Compare sequencial e paralelo limitado.

### Parte 10 — Gate

Valide budgets, contrato, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 578 e ponte para a aula 580 foram preservadas;
- API performance, server processing time, end-to-end latency, TTFB, payload, serialization, projection, pagination, offset, cursor, stable ordering, compression, HTTP caching, Cache-Control, ETag, application cache, connection reuse, connection pool, timeout budget, retry budget, bulkhead, fan-out, backpressure e idempotency foram definidos;
- baseline foi validada;
- contrato foi criado;
- política de payload foi criada;
- política de paginação foi criada;
- page size possui default e maximum;
- coleção ilimitada foi proibida;
- política de serialização foi criada;
- política de compressão foi criada;
- política de cache HTTP foi criada;
- política de cache de aplicação foi criada;
- política de cliente HTTP foi criada;
- connect, response e acquisition timeouts foram definidos;
- política de timeout foi criada;
- política de retry foi criada;
- retry exige falha transitória, idempotência e tempo restante;
- política de bulkhead foi criada;
- política de concorrência foi criada;
- política de streaming foi criada;
- política de idempotência foi criada;
- política de observabilidade foi criada;
- política de regressão foi criada;
- política de segurança foi criada;
- cache não ignora autorização;
- failure policy foi criada;
- cenários foram catalogados;
- nenhum Secret, payload, ID real, hostname, query text ou artifact bruto foi commitado;
- performance de banco não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/api `
  scripts/performance/api `
  docs/performance/api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|payloadContent|privateHost|queryText|executionPlan|databaseIndex"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): otimizar performance de API"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- payloads;
- IDs reais;
- hosts;
- credentials;
- outputs brutos;
- planos de execução;
- índices;
- tuning SQL;
- material da aula 580.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou budgets e sinais de saturação à camada de API.

Você trabalhou com:

```text
baseline por endpoint;

payload;

DTO;

paginação;

serialização;

compressão;

cache HTTP;

cache de aplicação;

cliente HTTP;

timeouts;

retry;

bulkhead;

concorrência;

streaming;

idempotência.
```

Você comprovou que otimização precisa começar pelo custo dominante da jornada; payloads e DTOs influenciam rede, CPU e alocação; paginação exige limite e ordenação estável; compressão precisa de benefício maior que o custo; cache exige semântica, segurança e invalidação; clientes HTTP precisam reutilizar conexões; timeouts precisam caber no budget; retries exigem idempotência, backoff e tempo restante; bulkheads protegem capacidade; paralelismo só ajuda quando chamadas são independentes e limitadas; e toda melhoria precisa preservar contrato, segurança e observabilidade.

A próxima aula será:

```text
580 - M18.25 - Performance de banco
```

Nela, você irá aprofundar queries, planos de execução, índices, joins, paginação no banco, estatísticas, locks, transações, connection pools e regressões de acesso a dados.

Nenhum plano de execução, índice, tuning SQL, reescrita de join, análise de estatísticas, lock de banco ou otimização detalhada de query foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Coletei baseline por endpoint.
- [ ] Reduzi payload com DTO.
- [ ] Validei paginação.
- [ ] Medi serialização e compressão.
- [ ] Validei caches.
- [ ] Validei cliente HTTP e timeouts.
- [ ] Validei retry, bulkhead e concorrência.
- [ ] Executei gate e evidence.

---

## Troubleshooting adicional

### O DTO menor não melhora p95

Verifique dependência, banco, fila e rede.

### A paginação repete itens

Corrija ordenação e cursor.

### Compressão piora throughput

O serviço pode estar limitado por CPU.

### ETag nunca gera 304

Valide versão, headers e intermediários.

### Cache apresenta pouco hit

A chave ou o padrão de acesso pode não justificar cache.

### Cache mistura usuários

Desabilite e corrija isolamento imediatamente.

### Cliente HTTP possui muitas conexões pendentes

Revise pool, timeouts, dependência e concorrência.

### Retry aumenta timeout total

Pare quando o budget restante for insuficiente.

### Bulkhead rejeita chamadas saudáveis

Revise capacidade e fila com workload equivalente.

### A investigação começou a criar índices

Preserve esse aprofundamento para a aula 580.

---

## Perguntas de revisão

1. O que é performance de API?
2. Qual diferença entre server time e end-to-end?
3. O que é TTFB?
4. Por que usar DTO específico?
5. Por que paginação exige ordenação?
6. Qual diferença entre offset e cursor?
7. Quando compressão ajuda?
8. O que é Cache-Control?
9. O que é ETag?
10. Qual diferença entre HTTP cache e application cache?
11. Por que reutilizar conexões?
12. Quais timeouts devem ser explícitos?
13. Quando retry é permitido?
14. O que é bulkhead?
15. O que é fan-out?
16. Quando paralelismo ajuda?
17. Quando streaming ajuda?
18. Por que idempotência é importante?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Latência, throughput e consumo da interface.
2. Processamento interno versus experiência total.
3. Tempo até o primeiro byte.
4. Reduzir payload, acoplamento e exposição.
5. Evitar duplicidade e lacuna.
6. Deslocamento versus posição estável.
7. Payload grande e CPU disponível.
8. Regras de cache HTTP.
9. Versão da representação.
10. Semântica HTTP versus cache controlado pela aplicação.
11. Evitar handshakes repetidos.
12. Conexão, resposta e aquisição.
13. Falha transitória, operação idempotente e budget restante.
14. Isolamento de capacidade.
15. Múltiplas chamadas descendentes.
16. Chamadas independentes e limitadas.
17. Resposta grande e consumo progressivo.
18. Evitar efeito duplicado.
19. Performance de banco.
20. Performance de banco.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 579 - M18.24 - Performance de API

- Continuei após Leitura de saturação.
- Entendi performance de API como comportamento por operação e jornada.
- Criei contrato e catálogo de endpoints.
- Coletei baseline individual para create, get, list e status.
- Identifiquei custo dominante por traces e métricas.
- Criei política e medição de payload.
- Substituí entidade completa por DTOs específicos.
- Evitei expansões indiscriminadas.
- Criei política de paginação.
- Defini default, maximum e ordenação estável.
- Comparei offset e cursor.
- Validei cursor, duplicidade e lacunas.
- Criei política e medição de serialização.
- Evitei ciclos, lazy exposure e campos internos.
- Criei política de compressão.
- Comparei bytes, CPU, latência e throughput.
- Criei política de cache HTTP.
- Diferenciei public, private e no-store.
- Validei ETag e 304.
- Criei política de cache de aplicação.
- Medi hit, miss, eviction, stale e invalidação.
- Validei isolamento entre tenants.
- Criei política de cliente HTTP.
- Comparei cliente por request e cliente com pool.
- Defini connect, response e acquisition timeouts.
- Criei política de retry com backoff, jitter e budget.
- Criei bulkhead com concorrência e fila limitadas.
- Comparei chamadas sequenciais e paralelas.
- Criei política de streaming e medi TTFB.
- Criei e validei idempotência.
- Criei métricas com route templates.
- Comparei baseline e candidate contra budgets.
- Preservei contrato, segurança e observabilidade.
- Coletei evidence sanitizada.
- Não antecipei performance de banco.
- Próxima aula: Performance de banco.
```

---

## Referência técnica curta

- API Performance.
- Payload Optimization.
- Pagination.
- JSON Serialization.
- HTTP Compression.
- HTTP Caching.
- Connection Pooling.
- Timeout Budgets.
- Retry and Bulkhead.
- Idempotency.

Regra final:

```text
performance de API precisa ser otimizada por endpoint, jornada e budget: baseline, traces e RED identificam o custo dominante antes da mudança, payloads são limitados por DTOs e projeções, coleções usam paginação e ordenação estável, serialização e compressão são medidas por tempo, bytes, CPU e alocação, e caches HTTP ou de aplicação exigem semântica, TTL, invalidação, métricas e isolamento de autorização; clientes HTTP reutilizam conexões e possuem pools e timeouts explícitos, retries respeitam idempotência, backoff, jitter e tempo restante, bulkheads e concorrência limitada impedem fan-out e dependências lentas de consumir toda a capacidade, e streaming é aplicado somente quando melhora TTFB e memória sem substituir paginação; toda mudança preserva contrato, segurança, observabilidade e budgets absolutos e relativos, deixando para a aula 580 planos de execução, índices, joins, estatísticas, locks, transações e tuning detalhado de banco.
```
