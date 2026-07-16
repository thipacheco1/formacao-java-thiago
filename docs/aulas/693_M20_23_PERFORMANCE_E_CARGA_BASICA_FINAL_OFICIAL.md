# 693 - M20.23 - Performance e carga basica final

## Apresentação da aula

Na aula 692, você concluiu os testes de contrato e segurança do OrderFlow.

O projeto passou a possuir:

- OpenAPI gerada a partir do runtime;
- comparação com baseline aprovada;
- contratos HTTP executáveis;
- Problem Details validados;
- contratos finais dos providers;
- schemas versionados de mensagens;
- compatibilidade entre versões;
- testes de JWT;
- matriz de scopes e roles;
- isolamento multi-tenant;
- proteção contra IDOR;
- testes de mass assignment;
- validação de CORS;
- testes de vazamento de secrets;
- regressões de segurança;
- reports, evidence e gate.

Agora os contratos estão estáveis o suficiente para que o sistema seja medido.

Nesta aula, você realizará a validação básica de performance e carga do projeto final.

O objetivo não é buscar um número impressionante.

O objetivo é construir uma resposta técnica defensável para perguntas como:

- quantas requisições o ambiente suporta?
- qual é a latência mediana?
- qual é o p95?
- qual é o p99?
- em que ponto os erros começam?
- qual componente satura primeiro?
- a Outbox acompanha a taxa de entrada?
- o consumer lag cresce?
- a projection permanece atualizada?
- o pool de conexões é suficiente?
- o provider externo limita a jornada?
- a idempotência funciona sob concorrência?
- o sistema se recupera depois de um pico?
- qual é a capacidade segura inicial?

Performance não é apenas velocidade.

Ela combina:

```text
latencia;

throughput;

concorrencia;

recursos;

fila;

erro;

estabilidade;

recuperacao.
```

Um endpoint pode responder rápido enquanto cria um backlog enorme na Outbox.

Outro pode apresentar baixa latência, mas consumir CPU excessiva.

Uma jornada assíncrona pode aceitar muitos pedidos e demorar vários minutos para concluir.

Por isso, você medirá duas perspectivas:

```text
resposta sincrona da API;

conclusao da jornada assincrona.
```

A ferramenta principal de geração de carga será:

```text
k6.
```

Ela será usada por scripts versionados.

A observação utilizará os sinais já criados:

- métricas Prometheus;
- dashboards Grafana;
- traces OpenTelemetry;
- logs estruturados;
- métricas do PostgreSQL;
- métricas do Kafka;
- métricas da JVM;
- métricas da Outbox;
- consumer lag;
- projection freshness.

A aula trabalhará com carga básica e controlada.

Você executará:

- baseline;
- smoke performance;
- ramp-up;
- steady load;
- burst curto;
- concorrência idempotente;
- carga da jornada assíncrona;
- recuperação;
- comparação de resultados.

Não será executado um teste destrutivo ilimitado.

A próxima aula será:

```text
694 - M20.24 - Documentacao OpenAPI
```

Na aula 694, o contrato OpenAPI será transformado em documentação pública e operacional completa, com organização por recursos, examples revisados, guias de autenticação, erros, idempotência, paginação, versionamento e publicação.

Nesta aula, a OpenAPI será usada apenas como fonte dos endpoints de teste.

O laboratório será:

```text
labs/m20/aula-693-performance-e-carga-basica-final/orderflow-performance
```

Regra central:

```text
capacidade segura
nao e o maior numero
que o sistema alcanca;

e o nivel sustentavel
que atende os objetivos
sem acumular fila,
erro
ou degradacao progressiva.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
690:
Testes unitarios projeto final.

691:
Testes integracao projeto final.

692:
Testes contrato e seguranca final.

693:
Performance e carga basica final.

694:
Documentacao OpenAPI.

695:
README profissional.
```

A aula 693 mede o sistema integrado.

Ela utiliza o ambiente Docker da aula 687 e a observabilidade da aula 686.

Ela também reutiliza:

- autenticação configurada;
- contratos HTTP;
- idempotency key;
- PostgreSQL;
- Kafka;
- Outbox Publisher;
- Orchestration Worker;
- Integration Gateway;
- providers simulados;
- Projection Worker.

Esta aula não deve alterar contratos para melhorar resultados.

Quando um limite for encontrado, registre:

- sinal;
- hipótese;
- evidência;
- risco;
- recomendação.

Mudanças de tuning podem ser testadas em uma segunda rodada, desde que sejam documentadas.

A documentação final da API pertence à aula 694.

---

## Objetivo prático

Será criada a estrutura:

```text
testing/performance
├── README.md
├── config
│   ├── local.env.example
│   ├── hml.env.example
│   └── thresholds.json
├── data
│   ├── products.json
│   ├── tenants.json
│   └── users.json
├── lib
│   ├── auth.js
│   ├── HTTP.js
│   ├── data.js
│   ├── metrics.js
│   └── assertions.js
├── scenarios
│   ├── 01-smoke.js
│   ├── 02-baseline-register.js
│   ├── 03-ramp-register.js
│   ├── 04-steady-register.js
│   ├── 05-idempotency-concurrency.js
│   ├── 06-query-load.js
│   ├── 07-async-journey.js
│   ├── 08-burst.js
│   └── 09-recovery.js
├── scripts
│   ├── prepare-environment.ps1
│   ├── run-scenario.ps1
│   ├── collect-before.ps1
│   ├── collect-after.ps1
│   ├── compare-results.ps1
│   ├── generate-report.ps1
│   └── cleanup-performance-data.ps1
├── results
│   └── README.md
└── evidence
    └── README.md
```

Documentação:

```text
docs/performance
├── PERFORMANCE_TEST_CHARTER.md
├── WORKLOAD_MODEL.md
├── PERFORMANCE_ENVIRONMENT.md
├── DATA_POLICY.md
├── THRESHOLD_POLICY.md
├── CAPACITY_HYPOTHESES.md
├── RESOURCE_OBSERVATION_POLICY.md
├── BOTTLENECK_ANALYSIS_GUIDE.md
├── PERFORMANCE_TEST_MATRIX.md
├── PERFORMANCE_RISK_REGISTER.md
├── PERFORMANCE_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Reports:

```text
reports
├── performance-baseline-report.yaml
├── performance-comparison-report.yaml
└── performance-final-report.yaml
```

---

## Conceito essencial

### Latência possui distribuição

Não use somente média.

A média pode esconder uma cauda ruim.

Métricas importantes:

```text
p50;

p90;

p95;

p99;

maximo.
```

### Throughput não é capacidade isoladamente

Throughput precisa ser analisado junto com:

- taxa de erro;
- latência;
- CPU;
- memória;
- conexões;
- backlog;
- lag;
- freshness.

### Concorrência não é taxa

Concorrência representa trabalho simultâneo.

Taxa representa chegada por tempo.

O mesmo throughput pode produzir concorrências diferentes quando a latência muda.

### Teste de carga precisa de objetivo

Cada cenário deve responder uma pergunta.

Exemplo:

```text
o sistema sustenta
20 registros por segundo
durante 10 minutos
sem violar p95,
erro
ou idade da Outbox?
```

### Ambiente precisa ser conhecido

Sem recursos definidos, o resultado não é comparável.

Registre:

- CPU;
- memória;
- Java;
- limites dos containers;
- PostgreSQL;
- Kafka;
- número de workers;
- tamanho dos pools;
- versão das imagens;
- estado inicial dos dados.

---

## Mão na massa guiada

### 1. Criar Performance Test Charter

Arquivo:

```text
docs/performance/PERFORMANCE_TEST_CHARTER.md
```

Princípios:

```text
test objectives are explicit;

environment is documented;

data is synthetic;

load is bounded;

results include resources;

async backlog is observed;

thresholds fail the scenario;

changes are compared;

OpenAPI documentation belongs to lesson 694.
```

---

### 2. Criar Workload Model

Arquivo:

```text
docs/performance/WORKLOAD_MODEL.md
```

Perfis:

```text
operator:
registra e consulta pedidos.

support:
consulta history
e reconcilia casos controlados.

system:
processa eventos e providers.

auditor:
consulta historico.
```

Distribuição básica:

```text
registro:
35%.

consulta de pedido:
45%.

history:
10%.

cancelamento controlado:
5%.

reconciliacao simulada:
5%.
```

A primeira baseline pode focar registro e consulta.

---

### 3. Definir perguntas de capacidade

Registre hipóteses:

```text
H1:
a API sustenta 20 registros por segundo.

H2:
p95 do registro permanece abaixo de 500ms.

H3:
erro HTTP permanece abaixo de 1%.

H4:
idade da Outbox permanece abaixo de 10s.

H5:
consumer lag retorna a zero apos o pico.

H6:
projection freshness permanece abaixo de 15s.

H7:
replay idempotente nao duplica efeitos.
```

---

### 4. Criar Capacity Hypotheses

Arquivo:

```text
docs/performance/CAPACITY_HYPOTHESES.md
```

Cada hipótese possui:

- indicador;
- limite;
- cenário;
- duração;
- evidência;
- resultado;
- conclusão.

---

### 5. Criar Performance Environment

Arquivo:

```text
docs/performance/PERFORMANCE_ENVIRONMENT.md
```

Registre:

- hostname lógico;
- sistema operacional;
- CPU disponível;
- memória disponível;
- limites de containers;
- Java 21;
- heap policy;
- PostgreSQL 16;
- Kafka;
- número de partitions;
- número de consumers;
- pool JDBC;
- pool HTTP;
- sampling de traces;
- exporters ativos.

---

### 6. Fixar o ambiente

Antes de medir:

- encerre aplicações desnecessárias;
- mantenha limites de containers;
- não altere código durante uma rodada;
- use os mesmos digests;
- registre configurações;
- limpe dados de forma controlada;
- aqueça o ambiente.

---

### 7. Criar Data Policy

Arquivo:

```text
docs/performance/DATA_POLICY.md
```

Dados:

- sintéticos;
- sem usuário real;
- tenants exclusivos de performance;
- product codes controlados;
- IDs gerados no teste;
- cleanup por prefixo;
- idempotency keys rastreáveis;
- cardinalidade suficiente para evitar cache artificial.

---

### 8. Evitar dados idênticos demais

Se todos os requests usam o mesmo pedido ou produto, o resultado pode não representar o comportamento real.

Varie:

- tenant permitido;
- produtos;
- quantidade;
- correlation;
- idempotency key.

---

## Configuração do k6

### 9. Criar `local.env.example`

```dotenv
BASE_URL=http://localhost:8080
TOKEN_ENDPOINT=http://identity.local/token
CLIENT_ID=orderflow-performance
TENANT_PREFIX=perf
K6_OUT=experimental-prometheus-rw
```

Não versione secret.

---

### 10. Criar biblioteca HTTP

Arquivo:

```javascript
import HTTP from "k6/HTTP";
import { check } from "k6";

export function postJson(
  url,
  body,
  headers
) {
  const response = HTTP.post(
    url,
    JSON.stringify(body),
    {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      tags: {
        operation: "register-order",
      },
    }
  );

  check(response, {
    "status esperado": (r) =>
      r.status === 201,
    "correlation presente": (r) =>
      Boolean(r.headers["X-Correlation-Id"]),
  });

  return response;
}
```

No arquivo real, padronize nomes e tratamento de erros.

---

### 11. Criar helper de autenticação

O helper:

- obtém token de teste;
- reutiliza token durante validade;
- não imprime token;
- falha quando identity provider não responde;
- separa token por tenant quando necessário.

---

### 12. Criar métricas customizadas

```javascript
import { Counter, Rate, Trend } from "k6/metrics";

export const businessErrors =
  new Counter("orderflow_business_errors");

export const replayRate =
  new Rate("orderflow_replay_rate");

export const journeyDuration =
  new Trend(
    "orderflow_journey_duration",
    true
  );
```

---

### 13. Criar thresholds globais

Exemplo:

```javascript
export const options = {
  thresholds: {
    HTTP_req_failed: ["rate<0.01"],
    HTTP_req_duration: [
      "p(95)<500",
      "p(99)<1000",
    ],
    checks: ["rate>0.99"],
  },
};
```

Os valores precisam estar ligados às hipóteses do ambiente.

---

### 14. Criar Threshold Policy

Arquivo:

```text
docs/performance/THRESHOLD_POLICY.md
```

Categorias:

- latência HTTP;
- erro técnico;
- erro funcional inesperado;
- checks;
- jornada;
- Outbox;
- lag;
- freshness;
- recursos.

---

## Preparação do ambiente

### 15. Criar `prepare-environment.ps1`

O script:

- valida Docker;
- valida ambiente ativo;
- valida release;
- limpa dados de performance;
- cria tenants sintéticos;
- confirma topics;
- confirma dashboards;
- registra snapshot inicial;
- executa warm-up.

---

### 16. Criar snapshot inicial

Colete:

- CPU;
- memória;
- heap;
- threads;
- conexões JDBC;
- Outbox pending;
- consumer lag;
- DLQ;
- projection freshness;
- tamanho das tabelas.

---

### 17. Aquecer o ambiente

Execute carga leve por dois minutos.

O warm-up:

- inicializa classes;
- aquece pools;
- estabelece conexões;
- inicializa caches permitidos;
- reduz distorção do primeiro request.

O warm-up não entra no resultado oficial.

---

### 18. Validar ausência de backlog

Antes do cenário:

```text
Outbox pending:
0.

consumer lag:
0.

DLQ inesperada:
0.
```

Se não estiver limpo, não inicie a rodada.

---

## Cenário 1: smoke de performance

### 19. Criar `01-smoke.js`

Configuração:

```javascript
export const options = {
  vus: 1,
  duration: "30s",
  thresholds: {
    HTTP_req_failed: ["rate==0"],
    HTTP_req_duration: ["p(95)<1000"],
  },
};
```

---

### 20. Executar smoke

Valide:

- autenticação;
- registro;
- consulta;
- idempotência;
- metrics output;
- nenhuma DLQ;
- ambiente saudável.

---

### 21. Bloquear cenários maiores se smoke falhar

Carga maior não corrige erro funcional.

Corrija primeiro.

---

## Cenário 2: baseline

### 22. Criar baseline de registro

Configuração inicial:

```text
5 virtual users;

5 minutos;

taxa nao fixada;

dados variados.
```

A baseline mede o comportamento natural com baixa pressão.

---

### 23. Coletar percentis

Registre:

- p50;
- p90;
- p95;
- p99;
- máximo;
- requests por segundo;
- error rate.

---

### 24. Coletar recursos

Durante a baseline:

- CPU da API;
- heap;
- GC;
- threads;
- pool JDBC;
- PostgreSQL CPU;
- connections;
- Kafka throughput;
- Outbox age;
- consumer lag.

---

### 25. Criar baseline report

Arquivo:

```text
reports/performance-baseline-report.yaml
```

Inclua ambiente, release, cenário, resultados e recursos.

---

## Cenário 3: ramp-up

### 26. Criar `03-ramp-register.js`

Use estágios:

```javascript
export const options = {
  stages: [
    { duration: "2m", target: 5 },
    { duration: "3m", target: 10 },
    { duration: "3m", target: 20 },
    { duration: "3m", target: 30 },
    { duration: "2m", target: 0 },
  ],
};
```

---

### 27. Observar ponto de inflexão

Procure quando:

- p95 cresce rapidamente;
- error rate aparece;
- pool satura;
- Outbox envelhece;
- lag cresce;
- GC aumenta;
- provider começa a limitar.

---

### 28. Não confundir pico com capacidade sustentável

Um estágio curto pode passar e ainda gerar backlog que só aparece depois.

Analise a recuperação.

---

## Cenário 4: steady load

### 29. Criar executor de taxa constante

Exemplo:

```javascript
export const options = {
  scenarios: {
    steady_register: {
      executor: "constant-arrival-rate",
      rate: 20,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 30,
      maxVUs: 80,
    },
  },
};
```

---

### 30. Executar taxa candidata

Comece com a taxa sustentada indicada pelo ramp-up.

Não comece pelo máximo observado.

---

### 31. Validar estabilidade

Durante dez minutos, confirme:

- latência sem tendência crescente;
- erro estável;
- CPU sem saturação permanente;
- heap sem crescimento contínuo;
- Outbox controlada;
- lag controlado;
- projection freshness controlada.

---

### 32. Calcular headroom

Não opere a 100% do limite medido.

Defina margem inicial.

Exemplo:

```text
capacidade observada:
30 req/s.

capacidade segura inicial:
20 req/s.
```

A margem depende do risco e da variabilidade.

---

## Cenário 5: idempotência sob concorrência

### 33. Criar cenário concorrente

Vários VUs enviam:

- mesmo tenant;
- mesma idempotency key;
- mesmo body;
- quase simultaneamente.

---

### 34. Validar replay

Resultados permitidos:

- uma criação;
- demais replays;
- ou `in progress` conforme contrato.

Nunca:

- múltiplos pedidos;
- múltiplos efeitos;
- payload conflitante aceito.

---

### 35. Testar conflito

Use mesma key e bodies diferentes.

Valide:

```text
409 IDEMPOTENCY_CONFLICT.
```

---

### 36. Verificar banco

Depois do cenário:

- uma row funcional;
- idempotency record consistente;
- Outbox sem duplicidade funcional;
- audit coerente.

---

## Cenário 6: consultas

### 37. Criar carga de leitura

Distribua:

- consulta por ID;
- history;
- paginação;
- status.

---

### 38. Evitar cache artificial

Use conjunto de pedidos suficientemente grande.

Misture:

- itens recentes;
- itens antigos;
- estados diferentes;
- páginas diferentes.

---

### 39. Observar PostgreSQL

Métricas:

- query duration;
- active connections;
- locks;
- buffer hit;
- sequential scans relevantes;
- rows returned.

---

### 40. Identificar índice ausente

Sinais:

- p95 de leitura cresce;
- CPU do banco aumenta;
- sequential scan aparece;
- API não satura.

Registre a query e o plano para análise posterior.

---

## Cenário 7: jornada assíncrona

### 41. Criar `07-async-journey.js`

O cenário:

1. registra pedido;
2. guarda order ID;
3. consulta estado;
4. espera terminalidade;
5. mede duração total.

---

### 42. Medir tempo de jornada

Métrica:

```text
orderflow_journey_duration.
```

Ela começa no `201`.

Termina em:

- completed;
- cancelled;
- reconciliation;
- failure terminal prevista.

---

### 43. Usar polling limitado

Polling:

- possui intervalo;
- possui timeout;
- não cria carga excessiva;
- registra último estado;
- falha com diagnóstico.

---

### 44. Observar cada fila

Durante a jornada:

- Outbox API;
- topic requests;
- Gateway;
- provider;
- topic results;
- orchestration;
- projection.

---

### 45. Diferenciar API rápida de jornada lenta

Registre ambos:

```text
HTTP register duration;

end-to-end journey duration.
```

Uma conclusão não substitui a outra.

---

## Cenário 8: burst

### 46. Criar burst curto

Exemplo:

```text
carga base:
10 req/s.

burst:
50 req/s por 30s.

retorno:
10 req/s.
```

---

### 47. Observar absorção

O sistema pode usar fila para absorver burst.

Valide:

- API continua dentro do limite;
- Outbox cresce de forma temporária;
- lag cresce;
- nenhuma perda;
- recuperação ocorre.

---

### 48. Medir tempo de recuperação

Defina:

```text
tempo entre o fim do burst
e backlog igual a zero.
```

---

### 49. Reprovar crescimento sem recuperação

Se backlog continua crescendo após a carga voltar ao normal, a taxa base não é sustentável.

---

## Cenário 9: recuperação

### 50. Criar recovery scenario

Depois de um cenário pesado:

- interrompa novas chegadas;
- acompanhe recursos;
- acompanhe filas;
- acompanhe GC;
- acompanhe conexões;
- acompanhe circuit breakers.

---

### 51. Validar normalização

O ambiente precisa retornar próximo ao baseline.

Sinais:

- CPU reduz;
- heap estabiliza;
- lag zera;
- Outbox zera;
- breakers fecham;
- projection freshness normaliza.

---

## Resource observation

### 52. Criar Resource Observation Policy

Arquivo:

```text
docs/performance/RESOURCE_OBSERVATION_POLICY.md
```

Recursos:

- CPU;
- memory;
- heap;
- GC;
- threads;
- file descriptors quando disponível;
- JDBC pool;
- HTTP pool;
- PostgreSQL;
- Kafka;
- network;
- disk.

---

### 53. Criar queries PromQL

API CPU:

```promql
rate(
  process_cpu_seconds_total{
    application="orderflow-api"
  }[5m]
)
```

Outbox age:

```promql
max(
  orderflow_outbox_oldest_age_seconds
)
```

Consumer lag:

```promql
max(
  orderflow_messaging_consumer_lag
)
```

---

### 54. Observar GC

Procure:

- pausas crescentes;
- allocation rate;
- heap após GC;
- full collections;
- memória próxima ao limite.

---

### 55. Observar pools

Pools relevantes:

- HikariCP;
- HTTP client;
- consumer threads;
- Kafka producer;
- worker concurrency.

Pool saturado pode parecer lentidão do banco ou provider.

---

### 56. Observar PostgreSQL locks

Carga de escrita concorrente pode produzir:

- lock wait;
- deadlock;
- optimistic conflicts;
- índice quente.

Registre a frequência.

---

### 57. Observar Kafka partitions

Se todas as mensagens usam poucas keys, uma partition pode concentrar trabalho.

Ordering por pedido é necessário.

Distribuição entre pedidos também importa.

---

## Análise de gargalo

### 58. Criar Bottleneck Analysis Guide

Arquivo:

```text
docs/performance/BOTTLENECK_ANALYSIS_GUIDE.md
```

Sequência:

1. confirmar threshold violado;
2. localizar início da degradação;
3. correlacionar recursos;
4. identificar fila;
5. analisar traces;
6. formular hipótese;
7. alterar uma variável;
8. repetir cenário;
9. comparar;
10. documentar.

---

### 59. Evitar tuning aleatório

Não altere ao mesmo tempo:

- heap;
- pool;
- threads;
- partitions;
- batch;
- timeout.

Uma mudança por rodada melhora causalidade.

---

### 60. Criar rodada comparativa

Exemplo:

```text
rodada A:
Hikari maximum pool size 10.

rodada B:
Hikari maximum pool size 20.
```

Mantenha o restante igual.

---

### 61. Validar efeito colateral

Aumentar pool pode:

- reduzir espera na API;
- aumentar pressão no banco;
- aumentar locks;
- piorar latência global.

Não conclua apenas por throughput.

---

### 62. Criar comparison report

Arquivo:

```text
reports/performance-comparison-report.yaml
```

Inclua:

- variável alterada;
- baseline;
- candidate;
- latência;
- throughput;
- erro;
- recursos;
- backlog;
- decisão.

---

## Segurança da carga

### 63. Limitar ambiente permitido

O script precisa exigir:

```text
local
ou
hml-simulated.
```

Bloqueie URL de produção.

---

### 64. Não registrar tokens

k6 summary, logs e artifacts não podem conter token.

---

### 65. Controlar volume de dados

Defina máximo de pedidos por cenário.

Cleanup precisa ser conhecido.

---

### 66. Respeitar providers simulados

Não gere carga contra provider externo real sem autorização formal.

---

## Automação

### 67. Criar `run-scenario.ps1`

Parâmetros:

- scenario;
- environment;
- release ID;
- output directory;
- thresholds;
- confirmation para carga maior.

---

### 68. Criar `collect-before.ps1`

Colete:

- release;
- config hash;
- container limits;
- metrics snapshot;
- database size;
- topic lag;
- current health.

---

### 69. Criar `collect-after.ps1`

Colete:

- k6 summary;
- metrics snapshot;
- resource peaks;
- Outbox;
- lag;
- DLQ;
- projection freshness;
- traces de amostra.

---

### 70. Criar `compare-results.ps1`

O script compara duas execuções equivalentes.

Ele falha quando existe regressão maior que o limite definido.

---

### 71. Criar `cleanup-performance-data.ps1`

Remova somente dados identificados pelo prefixo do teste.

Não use truncamento geral em ambiente compartilhado.

---

## Governança

### 72. Criar Performance Test Matrix

Arquivo:

```text
docs/performance/PERFORMANCE_TEST_MATRIX.md
```

Colunas:

- cenário;
- objetivo;
- carga;
- duração;
- threshold;
- recursos;
- backlog;
- resultado;
- owner.

---

### 73. Criar Performance Risk Register

Arquivo:

```text
docs/performance/PERFORMANCE_RISK_REGISTER.md
```

Riscos:

```text
ambiente instavel;

dados artificiais demais;

warm-up ausente;

media escondendo cauda;

carga sem limite;

provider real afetado;

backlog ignorado;

trace sampling excessivo;

resultado sem recursos;

tuning multiplo;

cleanup destrutivo;

conclusao sem repeticao.
```

---

### 74. Criar Performance Traceability

Arquivo:

```text
docs/performance/PERFORMANCE_TRACEABILITY.md
```

Exemplo:

```text
SLO API latency
-> k6 p95 threshold
-> API dashboard
-> baseline report.

SLO Outbox publish
-> oldest age metric
-> steady load
-> backlog evidence.

Async journey
-> journey trend
-> Kafka lag
-> projection freshness.

Idempotency invariant
-> concurrent replay scenario
-> database validation.
```

---

### 75. Criar boundary da próxima aula

Arquivo:

```text
docs/performance/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 693 define:

- workload model;
- baseline;
- latency percentiles;
- throughput;
- concurrency;
- ramp-up;
- steady load;
- burst;
- recovery;
- idempotency concurrency;
- async journey duration;
- resources;
- backlog;
- consumer lag;
- basic capacity conclusion.

A aula 694 define:

- OpenAPI documentation structure;
- resource descriptions;
- authentication guide;
- headers;
- idempotency guide;
- error catalog;
- pagination guide;
- examples;
- versioning;
- publication;
- usage documentation.

A documentacao OpenAPI consolidada
nao e produzida nesta aula.
```

---

## Execução das rodadas

### 76. Preparar ambiente

```powershell
.\testing\performance\scripts\prepare-environment.ps1 `
  -Environment "hml-simulated"
```

---

### 77. Executar smoke

```powershell
.\testing\performance\scripts\run-scenario.ps1 `
  -Scenario "01-smoke" `
  -Environment "hml-simulated"
```

---

### 78. Executar baseline

```powershell
.\testing\performance\scripts\run-scenario.ps1 `
  -Scenario "02-baseline-register" `
  -Environment "hml-simulated"
```

---

### 79. Executar ramp-up

```powershell
.\testing\performance\scripts\run-scenario.ps1 `
  -Scenario "03-ramp-register" `
  -Environment "hml-simulated"
```

---

### 80. Executar steady load

Use a taxa candidata encontrada.

```powershell
.\testing\performance\scripts\run-scenario.ps1 `
  -Scenario "04-steady-register" `
  -Environment "hml-simulated"
```

---

### 81. Executar idempotência concorrente

```powershell
.\testing\performance\scripts\run-scenario.ps1 `
  -Scenario "05-idempotency-concurrency" `
  -Environment "hml-simulated"
```

---

### 82. Executar jornada assíncrona

```powershell
.\testing\performance\scripts\run-scenario.ps1 `
  -Scenario "07-async-journey" `
  -Environment "hml-simulated"
```

---

### 83. Executar burst e recovery

Execute os cenários em sequência e acompanhe backlog até zero.

---

### 84. Repetir rodada crítica

Execute pelo menos três vezes o cenário que define a capacidade segura.

Compare variação.

---

## Conclusão de capacidade

### 85. Criar capacidade segura inicial

Formato:

```yaml
capacity:
  environment:
    hml-simulated

  release:
    orderflow-0.1.0-rc.15

  safeRegisterRatePerSecond:
    20

  expectedPeakRatePerSecond:
    30

  limits:
    HTTPP95Milliseconds:
      500
    HTTPErrorRate:
      0.01
    OutboxOldestAgeSeconds:
      10
    ProjectionFreshnessSeconds:
      15

  mainBottleneck:
    PostgreSQL-write-capacity

  confidence:
    basic
```

Os números devem vir da execução, não do exemplo.

---

### 86. Classificar confiança

Níveis:

```text
experimental;

basic;

moderate;

high.
```

Esta aula produz:

```text
basic.
```

Faltam soak prolongado, stress avançado e produção real.

---

### 87. Registrar limites conhecidos

Exemplos:

- provider simulado;
- volume de dados reduzido;
- um broker;
- um PostgreSQL;
- poucos workers;
- ambiente compartilhado;
- duração curta;
- trace sampling local.

---

### 88. Criar recomendações

Cada recomendação deve possuir:

- evidência;
- impacto;
- custo;
- risco;
- prioridade;
- teste de confirmação.

---

### 89. Criar report final

Arquivo:

```text
reports/performance-final-report.yaml
```

Exemplo:

```yaml
performanceFinal:
  environment:
    hml-simulated

  scenarios:
    smoke:
      PASS
    baseline:
      PASS
    ramp:
      PASS
    steady:
      PASS
    idempotency:
      PASS
    asyncJourney:
      PASS
    burst:
      PASS
    recovery:
      PASS

  capacity:
    confidence:
      basic

  thresholds:
    HTTP:
      PASS
    Outbox:
      PASS
    consumerLag:
      PASS
    projectionFreshness:
      PASS

  OpenAPIDocumentation:
    completed:
      false

  gate:
    PASS
```

---

### 90. Criar evidence

Arquivo:

```text
contracts/performance-final-evidence.yaml
```

Campos:

- lesson;
- project;
- environment;
- release ID;
- CPU limit;
- memory limit;
- API replicas;
- worker replicas;
- PostgreSQL version;
- Kafka partition count;
- smoke status;
- baseline status;
- ramp status;
- steady status;
- burst status;
- recovery status;
- idempotency concurrency status;
- async journey status;
- request total;
- throughput;
- p50 latency;
- p95 latency;
- p99 latency;
- error rate;
- Outbox maximum age;
- maximum consumer lag;
- projection maximum freshness;
- peak API CPU;
- peak API memory;
- peak PostgreSQL CPU;
- GC pause status;
- main bottleneck;
- safe capacity;
- confidence;
- documentation OpenAPI completed;
- documentation status;
- gate status;
- timestamp.

---

### 91. Criar gate de performance

Status:

```text
PASS;

FAIL_PERFORMANCE_STRUCTURE;

FAIL_ENVIRONMENT_DOCUMENTATION;

FAIL_DATA_POLICY;

FAIL_WARM_UP;

FAIL_SMOKE;

FAIL_BASELINE;

FAIL_RAMP;

FAIL_STEADY_LOAD;

FAIL_BURST;

FAIL_RECOVERY;

FAIL_IDEMPOTENCY_CONCURRENCY;

FAIL_ASYNC_JOURNEY;

FAIL_HTTP_LATENCY;

FAIL_HTTP_ERROR_RATE;

FAIL_OUTBOX_BACKLOG;

FAIL_CONSUMER_LAG;

FAIL_PROJECTION_FRESHNESS;

FAIL_RESOURCE_OBSERVATION;

FAIL_REPEATABILITY;

FAIL_CAPACITY_CONCLUSION;

FAIL_SECURITY_BOUNDARY;

FAIL_CLEANUP;

FAIL_OPENAPI_DOCUMENTATION_ANTICIPATION;

INCONCLUSIVE.
```

---

### 92. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\testing\performance\scripts\generate-report.ps1
```

Confirme:

- ambiente documentado;
- dados sintéticos;
- warm-up;
- smoke;
- baseline;
- ramp;
- steady load;
- idempotência concorrente;
- jornada assíncrona;
- burst;
- recovery;
- recursos;
- backlog;
- lag;
- freshness;
- capacidade segura;
- OpenAPI consolidada preservada para a aula 694.

---

### 93. Encerrar o laboratório

Confirme:

- Charter;
- workload model;
- hypotheses;
- environment;
- data policy;
- k6 config;
- helpers;
- metrics;
- thresholds;
- preparation;
- warm-up;
- smoke;
- baseline;
- ramp;
- steady;
- idempotency;
- reads;
- async journey;
- burst;
- recovery;
- resources;
- bottleneck analysis;
- comparison;
- scripts;
- matrix;
- risk register;
- traceability;
- capacity conclusion;
- report;
- evidence;
- gate aprovado;
- documentação OpenAPI não produzida.

---

## Entendendo o que foi feito

### O sistema ganhou uma baseline

Agora existe um ponto de comparação para alterações futuras.

### Latência foi analisada por percentis

A cauda deixou de ser escondida pela média.

### A jornada assíncrona foi medida

Resposta da API e conclusão do pedido possuem indicadores separados.

### Filas passaram a fazer parte da capacidade

Outbox, consumer lag e projection freshness entraram na decisão.

### Idempotência foi submetida à concorrência

O teste comprovou ausência de efeitos duplicados.

### Recursos foram correlacionados

CPU, memória, pools, banco e Kafka ajudaram a localizar gargalos.

### A capacidade ganhou margem

O resultado final representa nível sustentável, não recorde momentâneo.

### O projeto ficou pronto para documentação pública

A aula 694 consolidará a OpenAPI para consumo por desenvolvedores.

---

## Erros comuns importantes

### Usar somente média

A cauda permanece invisível.

### Medir apenas API

Backlog assíncrono pode crescer.

### Executar sem warm-up

Primeiros requests distorcem a baseline.

### Alterar várias configurações

A causa da melhoria fica desconhecida.

### Usar produção sem autorização

O teste pode causar incidente.

### Ignorar cleanup

O ambiente muda entre rodadas.

### Usar dados reais

Privacidade e segurança são comprometidas.

### Concluir pelo maior pico

Pico não é capacidade sustentável.

### Ignorar recuperação

O sistema pode manter backlog indefinidamente.

### Documentar OpenAPI agora

A consolidação pertence à aula 694.

---

## Comandos úteis

### Smoke

```powershell
k6 run `
  testing/performance/scenarios/01-smoke.js
```

### Baseline

```powershell
k6 run `
  testing/performance/scenarios/02-baseline-register.js
```

### Steady

```powershell
k6 run `
  testing/performance/scenarios/04-steady-register.js
```

### Jornada assíncrona

```powershell
k6 run `
  testing/performance/scenarios/07-async-journey.js
```

---

## Exercício guiado

Meça o cenário:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. environment snapshot;
2. warm-up;
3. workload model;
4. request rate;
5. token de teste;
6. registro;
7. Outbox;
8. Kafka request;
9. provider;
10. pagamento recusado;
11. result topic;
12. orchestration;
13. compensação;
14. projection;
15. HTTP p95;
16. journey p95;
17. error rate;
18. Outbox age;
19. consumer lag;
20. projection freshness;
21. API CPU;
22. database CPU;
23. burst;
24. recovery;
25. capacidade segura;
26. evidence.

Não produza a documentação OpenAPI consolidada.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 692 e ponte para a aula 694 foram preservadas;
- Performance Test Charter foi criado;
- Workload Model foi criado;
- perguntas de capacidade foram definidas;
- Capacity Hypotheses foi criado;
- Performance Environment foi criado;
- ambiente foi fixado;
- Data Policy foi criada;
- dados idênticos artificiais foram evitados;
- env example foi criado;
- biblioteca HTTP foi criada;
- helper de autenticação foi criado;
- métricas customizadas foram criadas;
- thresholds globais foram criados;
- Threshold Policy foi criada;
- prepare environment foi criado;
- snapshot inicial foi coletado;
- warm-up foi executado;
- ausência de backlog foi validada;
- smoke foi criado;
- smoke foi executado;
- cenários maiores são bloqueados após falha;
- baseline de registro foi criada;
- percentis foram coletados;
- recursos foram coletados;
- baseline report foi criado;
- ramp-up foi criado;
- ponto de inflexão foi observado;
- pico foi diferenciado de capacidade;
- steady load foi criado;
- taxa candidata foi executada;
- estabilidade foi validada;
- headroom foi calculado;
- cenário concorrente de idempotência foi criado;
- replay foi validado;
- conflito foi testado;
- banco foi verificado;
- carga de leitura foi criada;
- cache artificial foi evitado;
- PostgreSQL foi observado;
- índice ausente foi analisado;
- jornada assíncrona foi criada;
- duração da jornada foi medida;
- polling foi limitado;
- filas foram observadas;
- API rápida foi diferenciada de jornada rápida;
- burst foi criado;
- absorção foi observada;
- tempo de recuperação foi medido;
- crescimento sem recuperação reprova;
- recovery scenario foi criado;
- normalização foi validada;
- Resource Observation Policy foi criada;
- queries PromQL foram criadas;
- GC foi observado;
- pools foram observados;
- locks foram observados;
- partitions foram observadas;
- Bottleneck Analysis Guide foi criado;
- tuning aleatório foi evitado;
- rodada comparativa foi criada;
- efeitos colaterais foram analisados;
- comparison report foi criado;
- ambiente permitido foi limitado;
- tokens não foram registrados;
- volume de dados foi controlado;
- providers simulados foram respeitados;
- run scenario foi criado;
- collect before foi criado;
- collect after foi criado;
- compare results foi criado;
- cleanup foi criado;
- Performance Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 694 foi criado;
- smoke foi executado;
- baseline foi executada;
- ramp foi executado;
- steady foi executado;
- idempotência foi executada;
- jornada assíncrona foi executada;
- burst e recovery foram executados;
- rodada crítica foi repetida;
- capacidade segura foi criada;
- confiança foi classificada;
- limites conhecidos foram registrados;
- recomendações foram criadas;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- documentação OpenAPI consolidada não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\validate-secrets.ps1

.\testing\performance\scripts\generate-report.ps1
```

Adicione:

```powershell
git add `
  testing/performance `
  docs/performance `
  reports/performance-baseline-report.yaml `
  reports/performance-comparison-report.yaml `
  reports/performance-final-report.yaml `
  contracts/performance-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|productionUrl|realCustomer|realTenant|openapi-publication"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "test(performance): establish OrderFlow basic capacity"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- token real;
- URL de produção;
- dados reais;
- resultado inventado;
- documentação OpenAPI consolidada;
- conteúdo detalhado da aula 694.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a validação básica de performance e carga do OrderFlow.

Você criou:

```text
performance charter;

workload model;

capacity hypotheses;

environment catalog;

data policy;

k6 helpers;

thresholds;

warm-up;

smoke;

baseline;

ramp-up;

steady load;

idempotency concurrency;

query load;

async journey;

burst;

recovery;

resource observation;

bottleneck analysis;

comparison reports;

capacity conclusion;

evidence e gate.
```

O projeto agora possui uma capacidade inicial medida e limitações conhecidas.

A próxima aula será:

```text
694 - M20.24 - Documentacao OpenAPI
```

Nela, você transformará o contrato OpenAPI já validado em documentação completa para consumidores da API, incluindo visão geral, autenticação, headers, idempotência, recursos, examples, erros, paginação, versionamento e publicação.

A documentação OpenAPI consolidada não foi produzida nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Documentei o ambiente.
- [ ] Criei workload model.
- [ ] Criei thresholds.
- [ ] Executei warm-up.
- [ ] Executei smoke.
- [ ] Executei baseline.
- [ ] Executei ramp-up.
- [ ] Executei steady load.
- [ ] Testei idempotência concorrente.
- [ ] Medi jornada assíncrona.
- [ ] Executei burst.
- [ ] Medi recovery.
- [ ] Observei recursos e filas.
- [ ] Defini capacidade segura.
- [ ] Preservei documentação OpenAPI para a aula 694.

---

## Troubleshooting adicional

### k6 não encontra endpoint

Valide base URL, rede e readiness.

### Token expira durante a rodada

Implemente renovação segura no helper.

### p95 cresce e CPU está baixa

Verifique pool, banco, locks e provider.

### API está rápida e jornada lenta

Observe Outbox, Kafka, Gateway e projection.

### Lag não volta a zero

A taxa sustentável foi ultrapassada.

### Resultados variam muito

Revise ambiente, warm-up e processos concorrentes.

### Muitos VUs são criados

A taxa de chegada está acima da capacidade e a latência aumentou.

### Trace sampling consome recursos

Reduza sampling de forma documentada e repita a baseline.

### Cleanup remove dados indevidos

Use prefixo exclusivo e filtros estritos.

### Quero publicar a documentação da API

Essa etapa pertence à aula 694.

---

## Perguntas de revisão

1. O que é latência?
2. O que é throughput?
3. O que é concorrência?
4. Por que usar p95?
5. Média é suficiente?
6. O que é warm-up?
7. O que baseline representa?
8. O que ramp-up encontra?
9. O que steady load prova?
10. O que burst testa?
11. O que recovery mede?
12. API rápida garante jornada rápida?
13. O que observar na Outbox?
14. O que observar no Kafka?
15. O que observar na projection?
16. O que headroom representa?
17. Por que repetir rodadas?
18. Por que limitar labels?
19. O que é gargalo?
20. Por que mudar uma variável?
21. Capacidade máxima é capacidade segura?
22. O que a aula 694 fará?
23. O que não foi produzido?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Tempo de resposta.
2. Trabalho por tempo.
3. Trabalho simultâneo.
4. Medir a cauda.
5. Não.
6. Preparar runtime e pools.
7. Comportamento de baixa pressão.
8. Ponto de degradação.
9. Sustentação no tempo.
10. Pico curto.
11. Retorno ao normal.
12. Não.
13. Contagem e idade.
14. Lag, throughput e partitions.
15. Freshness e gaps.
16. Margem operacional.
17. Confirmar repetibilidade.
18. Evitar cardinalidade.
19. Recurso limitante.
20. Identificar causalidade.
21. Não.
22. Documentar OpenAPI.
23. Documentação OpenAPI consolidada.
24. Documentacao OpenAPI.
25. Capacidade segura é sustentável.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 693 - M20.23 - Performance e carga basica final

- Continuei após Testes contrato e segurança final.
- Criei Performance Test Charter.
- Criei Workload Model.
- Defini perguntas de capacidade.
- Criei Capacity Hypotheses.
- Criei Performance Environment.
- Fixei o ambiente.
- Criei Data Policy.
- Variei dados de teste.
- Criei configuração do k6.
- Criei biblioteca HTTP.
- Criei helper de autenticação.
- Criei métricas customizadas.
- Criei thresholds.
- Criei Threshold Policy.
- Criei prepare-environment.
- Coletei snapshot inicial.
- Executei warm-up.
- Validei ausência de backlog.
- Criei smoke.
- Executei smoke.
- Bloqueei carga após falha funcional.
- Criei baseline de registro.
- Coletei percentis.
- Coletei recursos.
- Criei baseline report.
- Criei ramp-up.
- Observei ponto de inflexão.
- Diferenciei pico e capacidade.
- Criei steady load.
- Executei taxa candidata.
- Validei estabilidade.
- Calculei headroom.
- Criei cenário concorrente de idempotência.
- Validei replay.
- Testei conflito.
- Verifiquei banco.
- Criei carga de leitura.
- Evitei cache artificial.
- Observei PostgreSQL.
- Analisei índice ausente.
- Criei jornada assíncrona.
- Medi duração da jornada.
- Limitei polling.
- Observei filas.
- Diferenciei latência HTTP e end-to-end.
- Criei burst.
- Observei absorção.
- Medi tempo de recuperação.
- Reprovei backlog sem recuperação.
- Criei recovery scenario.
- Validei normalização.
- Criei Resource Observation Policy.
- Criei queries PromQL.
- Observei GC.
- Observei pools.
- Observei locks.
- Observei partitions.
- Criei Bottleneck Analysis Guide.
- Evitei tuning aleatório.
- Criei rodada comparativa.
- Analisei efeitos colaterais.
- Criei comparison report.
- Limitei ambientes.
- Protegi tokens.
- Controlei volume de dados.
- Mantive providers simulados.
- Criei run-scenario.
- Criei collect-before.
- Criei collect-after.
- Criei compare-results.
- Criei cleanup.
- Criei Performance Test Matrix.
- Criei Performance Risk Register.
- Criei Performance Traceability.
- Criei boundary para a aula 694.
- Executei baseline, ramp e steady.
- Executei idempotência concorrente.
- Executei jornada assíncrona.
- Executei burst e recovery.
- Repeti rodada crítica.
- Defini capacidade segura.
- Classifiquei confiança.
- Registrei limites.
- Criei recomendações.
- Criei report, evidence e gate.
- Não antecipei documentação OpenAPI.
- Próxima aula: Documentacao OpenAPI.
```

---

## Referência técnica curta

- Performance Test.
- Load Test.
- Latency.
- Throughput.
- Concurrency.
- Percentile.
- p95.
- p99.
- Warm-Up.
- Baseline.
- Ramp-Up.
- Steady Load.
- Burst.
- Recovery.
- k6.
- Arrival Rate.
- Virtual User.
- Consumer Lag.
- Backlog.
- Headroom.
- Bottleneck.
- Capacity.

Regra final:

```text
A validação básica de performance do OrderFlow deve medir resposta síncrona e conclusão assíncrona em ambiente conhecido e com carga limitada: o charter define objetivos, workload model distribui registros e consultas, environment registra CPU, memória, containers, Java, PostgreSQL, Kafka, pools, partitions e workers, dados são sintéticos e variados, k6 usa helpers de autenticação, HTTP, assertions e métricas sem registrar tokens, thresholds cobrem p95, p99, erro, checks, Outbox age, consumer lag, projection freshness e journey duration, o ambiente é limpo, aquecido e fotografado antes de cada rodada, smoke bloqueia cenários maiores quando existe falha funcional, baseline mede baixa pressão, ramp-up identifica inflexão, steady load comprova sustentabilidade, idempotency concurrency garante um efeito sob chamadas simultâneas, read load observa índices e pool, async journey mede do 201 ao estado terminal, burst comprova absorção e recovery mede retorno do backlog a zero, CPU, heap, GC, threads, JDBC, PostgreSQL, Kafka, Outbox, lag e projection são correlacionados, tuning altera uma variável por rodada e compara efeitos colaterais, rodadas críticas são repetidas, capacidade segura inclui headroom e confiança básica, e o gate termina com ambiente, cenários, recursos, filas, resultados, report e evidence aprovados, enquanto a organização pública da OpenAPI, guias de autenticação, headers, idempotência, erros, paginação, examples, versionamento e publicação permanecem reservados para a aula 694.
```
