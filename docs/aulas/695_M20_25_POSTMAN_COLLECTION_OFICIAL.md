# 695 - M20.25 - Postman Collection

## Apresentação da aula

Na aula 694, você consolidou a documentação OpenAPI do OrderFlow.

A API passou a possuir:

- visão geral;
- metadados profissionais;
- organização por tags;
- guia de autenticação;
- guia de autorização;
- contexto multi-tenant;
- documentação de idempotência;
- documentação de correlação;
- operações detalhadas;
- request examples;
- response examples;
- Problem Details;
- processamento assíncrono;
- paginação;
- versionamento;
- depreciação;
- publicação em JSON, YAML e HTML;
- Consumer Quickstart;
- reports, evidence e gate.

Agora o consumidor consegue compreender o contrato.

Nesta aula, você transformará esse contrato documentado em uma coleção executável do Postman.

Uma collection profissional não é apenas uma lista de requests salvos.

Ela precisa permitir que outra pessoa:

- importe os artefatos;
- escolha um environment;
- obtenha um token de teste;
- gere correlation ID;
- gere idempotency key;
- registre um pedido;
- armazene o `orderId`;
- execute operações subsequentes;
- consulte o estado;
- valide respostas;
- trate erros;
- execute a jornada inteira;
- rode a coleção pela interface;
- rode a coleção pela linha de comando;
- gere relatórios;
- reproduza falhas;
- colete evidências.

A collection também precisa respeitar as garantias construídas anteriormente:

- não guardar secrets;
- não permitir tenant arbitrário no body;
- não reutilizar idempotency key entre intenções diferentes;
- não esconder falha com assertion fraca;
- não depender de ordem acidental;
- não usar dados reais;
- não apontar para produção por engano;
- não tratar `202 Accepted` como conclusão;
- não ignorar Problem Details;
- não vazar token em console ou report.

O laboratório será:

```text
labs/m20/aula-695-postman-collection/orderflow-postman
```

A próxima aula será:

```text
696 - M20.26 - README profissional
```

Na aula 696, você consolidará a apresentação pública do projeto, sua arquitetura, execução, qualidade, segurança, observabilidade, testes, deploy, documentação e evidências em um README profissional.

Nesta aula, o README principal do repositório não será reescrito.

Regra central:

```text
uma collection profissional
nao apenas envia requests;

ela organiza contexto,
automatiza variaveis,
valida contratos,
encadeia jornadas
e produz evidencia reproduzivel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
692:
Testes contrato e seguranca final.

693:
Performance e carga basica final.

694:
Documentacao OpenAPI.

695:
Postman Collection.

696:
README profissional.

697:
Portfolio do projeto.
```

A collection nasce da OpenAPI validada.

O fluxo correto é:

```text
OpenAPI documentada;

collection gerada ou estruturada;

scripts enriquecem comportamento;

tests validam respostas;

runner executa jornadas;

evidence registra resultados.
```

A collection não se torna uma fonte concorrente da API.

Quando o contrato mudar:

- OpenAPI é atualizada;
- contract tests validam;
- collection é regenerada ou revisada;
- exemplos são sincronizados;
- scripts são validados;
- CI executa a coleção.

A collection precisa representar somente endpoints reais do OrderFlow.

---

## Objetivo prático

Será criada a estrutura:

```text
testing/postman
├── README.md
├── collection
│   ├── OrderFlow.postman_collection.json
│   └── OrderFlow-negative.postman_collection.json
├── environments
│   ├── OrderFlow-local.postman_environment.json
│   ├── OrderFlow-hml-simulated.postman_environment.json
│   └── OrderFlow-template.postman_environment.json
├── globals
│   └── OrderFlow-template.postman_globals.json
├── data
│   ├── register-orders.json
│   ├── cancellation-cases.json
│   └── reconciliation-cases.json
├── scripts
│   ├── generate-collection.ps1
│   ├── validate-collection.ps1
│   ├── run-collection.ps1
│   ├── run-negative-collection.ps1
│   ├── generate-html-report.ps1
│   ├── sanitize-report.ps1
│   └── collect-postman-evidence.ps1
├── reports
│   └── README.md
└── evidence
    └── README.md
```

Documentação:

```text
docs/postman
├── POSTMAN_COLLECTION_CHARTER.md
├── COLLECTION_STRUCTURE.md
├── ENVIRONMENT_POLICY.md
├── VARIABLE_POLICY.md
├── AUTHENTICATION_SCRIPT_POLICY.md
├── IDEMPOTENCY_SCRIPT_POLICY.md
├── ASSERTION_POLICY.md
├── WORKFLOW_CHAINING_POLICY.md
├── NEGATIVE_SCENARIO_POLICY.md
├── CLI_EXECUTION_POLICY.md
├── REPORT_SANITIZATION_POLICY.md
├── POSTMAN_TEST_MATRIX.md
├── POSTMAN_RISK_REGISTER.md
├── POSTMAN_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Artefatos:

```text
reports
├── postman-collection-report.yaml
├── postman-cli-summary.json
├── postman-negative-summary.json
└── postman-report.html
```

Evidence:

```text
contracts/postman-collection-evidence.yaml
```

---

## Conceito essencial

### Variáveis possuem escopo

Postman possui:

- global;
- collection;
- environment;
- data;
- local.

Use o menor escopo adequado.

Exemplo:

```text
baseUrl:
environment.

orderId:
collection ou local da execucao.

token:
environment runtime,
nunca valor exportado.

iteration productCode:
data.
```

### Pre-request script prepara a chamada

Pode:

- gerar UUID;
- gerar correlation;
- gerar idempotency key;
- obter token;
- calcular timestamp;
- escolher dados.

Não deve:

- esconder regra crítica;
- imprimir secret;
- alterar endpoint silenciosamente;
- escolher produção automaticamente.

### Test script valida comportamento

Uma assertion precisa verificar:

- status;
- headers;
- schema mínimo;
- campos obrigatórios;
- semântica;
- variável extraída;
- ausência de dado sensível.

### Collection Runner precisa ser determinístico

A execução deve:

- começar com environment conhecido;
- possuir dados sintéticos;
- limpar ou isolar estado;
- parar em falha crítica;
- gerar resumo;
- preservar evidência sanitizada.

---

## Mão na massa guiada

### 1. Criar Postman Collection Charter

Arquivo:

```text
docs/postman/POSTMAN_COLLECTION_CHARTER.md
```

Princípios:

```text
OpenAPI is the source;

environments contain no secrets;

scripts are reviewed;

variables use minimum scope;

idempotency is intentional;

async flows are polled;

assertions validate behavior;

negative scenarios are explicit;

CLI execution is reproducible;

README belongs to lesson 696.
```

---

### 2. Criar Collection Structure

Arquivo:

```text
docs/postman/COLLECTION_STRUCTURE.md
```

Pastas da collection:

```text
00 - Setup;

01 - Orders;

02 - Order Queries;

03 - Stock Reservation;

04 - Payment Authorization;

05 - Fulfillment;

06 - Cancellations;

07 - Reconciliation;

08 - Security Negative;

09 - Contract Negative;

10 - Full Journeys;

99 - Cleanup and Evidence.
```

---

### 3. Definir padrão de nomes

Use nomes orientados a comportamento:

```text
Register order - success;

Register order - replay;

Register order - idempotency conflict;

Get order - current tenant;

Get order - cross tenant hidden;

Request cancellation - accepted;

Reconcile order - forbidden for operator.
```

Evite:

```text
Request 1;

Test API;

POST endpoint.
```

---

### 4. Criar collection v2.1

O artifact deve usar:

```text
Postman Collection Format v2.1.
```

Metadados:

- name;
- description;
- schema;
- version;
- source OpenAPI checksum;
- source commit;
- generated at;
- owner.

---

### 5. Relacionar collection à OpenAPI

Adicione na descrição:

- versão da API;
- checksum da OpenAPI;
- caminho do artifact;
- data de geração;
- processo de atualização.

Isso permite detectar collection antiga.

---

## Environments

### 6. Criar Environment Policy

Arquivo:

```text
docs/postman/ENVIRONMENT_POLICY.md
```

Environments permitidos:

```text
local;

hml-simulated;

template.
```

Produção não faz parte da collection educacional.

---

### 7. Criar environment template

Variáveis:

```text
baseUrl;

tokenUrl;

clientId;

audience;

tenantId;

userRole;

userScope;

workloadClientId;

traceEnabled;

pollIntervalMs;

pollTimeoutMs.
```

Valores sensíveis permanecem vazios.

---

### 8. Marcar variáveis secretas

Variáveis como:

- client secret;
- password;
- access token;
- refresh token;

não devem ser exportadas preenchidas.

Use vault ou valor local não sincronizado quando disponível.

---

### 9. Criar environment local

Valores não sensíveis:

```text
baseUrl:
http://localhost:8080.

tokenUrl:
http://localhost:8180/oauth/token.

tenantId:
tenant-local-a.

pollIntervalMs:
500.

pollTimeoutMs:
15000.
```

Use somente endpoints locais realmente configurados.

---

### 10. Criar environment HML simulado

Use:

- portas da simulação;
- issuer simulado;
- tenant sintético;
- URLs claramente não produtivas.

---

### 11. Bloquear produção

Pre-request script global precisa falhar quando:

- host contém domínio de produção conhecido;
- variável `allowProduction` não existe;
- environment não está na allowlist.

Nesta formação, produção continua bloqueada.

---

## Variable Policy

### 12. Criar Variable Policy

Arquivo:

```text
docs/postman/VARIABLE_POLICY.md
```

Categorias:

```text
configuration;

identity;

journey state;

request identity;

test data;

evidence.
```

---

### 13. Definir variáveis de jornada

Collection variables:

```text
orderId;

orderLocation;

orderStatus;

externalReference;

stockOperationId;

paymentOperationId;

fulfillmentOperationId;

lastCorrelationId;

lastProblemCode;

journeyStartedAt;

journeyCompletedAt.
```

---

### 14. Limpar estado no setup

A request `Reset runtime variables` remove valores transitórios.

Não remove configuração do environment.

---

### 15. Gerar correlation ID

Pre-request script:

```javascript
const correlationId =
  `postman-${pm.variables.replaceIn("{{$guid}}")}`;

pm.variables.set(
  "correlationId",
  correlationId
);
```

---

### 16. Validar correlation

Test script:

```javascript
pm.test(
  "response devolve correlation efetiva",
  function () {
    const responseCorrelation =
      pm.response.headers.get(
        "X-Correlation-Id"
      );

    pm.expect(responseCorrelation)
      .to.eql(
        pm.variables.get(
          "correlationId"
        )
      );
  }
);
```

---

## Autenticação

### 17. Criar Authentication Script Policy

Arquivo:

```text
docs/postman/AUTHENTICATION_SCRIPT_POLICY.md
```

Regras:

- token é obtido em runtime;
- token não é impresso;
- validade é controlada;
- token de usuário e workload são separados;
- scopes são explícitos;
- falha interrompe requests dependentes;
- secret não é exportado.

---

### 18. Criar pasta Setup

Requests:

```text
Validate environment;

Obtain user token;

Obtain workload token;

Reset runtime variables;

Validate API readiness.
```

---

### 19. Obter token de usuário

A request usa:

- token URL;
- client ID;
- credencial local;
- audience;
- scopes.

Após sucesso, armazene somente no runtime:

```javascript
const body = pm.response.json();

pm.environment.set(
  "accessToken",
  body.access_token
);

pm.environment.set(
  "accessTokenExpiresAt",
  Date.now() +
    body.expires_in * 1000
);
```

---

### 20. Não imprimir token

Proibido:

```javascript
console.log(
  pm.environment.get(
    "accessToken"
  )
);
```

---

### 21. Renovar token quando necessário

Pre-request da collection:

- verifica existência;
- verifica expiração;
- chama setup ou falha com instrução clara;
- não executa refresh oculto em ambiente não permitido.

---

### 22. Separar workload token

Use variável:

```text
workloadAccessToken.
```

Somente requests internos autorizados usam esse token.

---

### 23. Testar token ausente

Na collection negativa:

- remova Authorization;
- espere `401`;
- valide Problem Details;
- confirme ausência de efeito.

---

## Idempotência

### 24. Criar Idempotency Script Policy

Arquivo:

```text
docs/postman/IDEMPOTENCY_SCRIPT_POLICY.md
```

Regras:

- nova intenção gera nova key;
- replay reutiliza key;
- conflito reutiliza key com body diferente;
- key não muda durante retry técnico;
- key é armazenada somente no escopo necessário.

---

### 25. Criar helper de nova key

```javascript
const key =
  pm.variables.replaceIn(
    "{{$guid}}"
  );

pm.variables.set(
  "idempotencyKey",
  key
);
```

---

### 26. Preparar request de registro

Headers:

```text
Authorization;

Content-Type;

Idempotency-Key;

X-Correlation-Id.
```

Body usa dados sintéticos.

---

### 27. Salvar body original

Para replay, salve a representação usada:

```javascript
pm.collectionVariables.set(
  "registerOrderBody",
  pm.request.body.raw
);
```

Não salve token.

---

### 28. Validar primeira criação

Assertions:

- status `201`;
- Location presente;
- `orderId` presente;
- `replayed` false;
- correlation;
- schema;
- tempo de resposta dentro de limite funcional, não de carga.

---

### 29. Extrair order ID

```javascript
const response = pm.response.json();

pm.collectionVariables.set(
  "orderId",
  response.orderId
);

pm.collectionVariables.set(
  "orderLocation",
  pm.response.headers.get(
    "Location"
  )
);
```

---

### 30. Criar replay request

Mesmo:

- tenant;
- key;
- body.

Valide:

- `201`;
- mesmo order ID;
- `replayed` true;
- mesmo Location;
- nenhuma duplicidade funcional.

---

### 31. Criar conflito de idempotência

Mesmo key com quantidade diferente.

Valide:

- `409`;
- code `IDEMPOTENCY_CONFLICT`;
- correlation;
- order original preservado.

---

## Assertion Policy

### 32. Criar Assertion Policy

Arquivo:

```text
docs/postman/ASSERTION_POLICY.md
```

Assertions mínimas por request:

- status;
- Content-Type;
- correlation;
- tempo máximo funcional;
- schema mínimo;
- campos obrigatórios;
- semântica;
- ausência de secret.

---

### 33. Criar helpers de assertions

Collection-level scripts podem fornecer funções por texto versionado.

Evite duplicação excessiva.

Não esconda assertions específicas de negócio em helper genérico.

---

### 34. Validar JSON

```javascript
pm.test(
  "response possui JSON valido",
  function () {
    pm.expect(
      function () {
        pm.response.json();
      }
    ).not.to.throw();
  }
);
```

---

### 35. Validar Content-Type

Sucesso:

```text
application/json.
```

Erro:

```text
application/problem+json.
```

---

### 36. Validar Problem Details

Campos:

- type;
- title;
- status;
- detail;
- instance;
- code;
- correlationId.

---

### 37. Validar ausência de secrets

Use sentinelas conhecidas e procure em:

- response body;
- headers;
- console exportado;
- report sanitizado.

---

### 38. Evitar assertion fraca

Fraco:

```javascript
pm.expect(
  pm.response.code
).to.be.oneOf(
  [200, 201, 202, 400, 401, 403, 404, 409, 500]
);
```

Esse teste aceita quase qualquer comportamento.

---

## Orders e consultas

### 39. Criar pasta Orders

Requests:

- register success;
- register replay;
- idempotency conflict;
- invalid request;
- unsupported media type;
- unknown field;
- missing key.

---

### 40. Criar invalid request

Exemplos:

- lines vazias;
- quantity zero;
- currency inválida;
- product code inválido.

Valide `400`.

---

### 41. Criar consulta atual

Use:

```text
GET {{baseUrl}}/v1/orders/{{orderId}}.
```

Valide:

- `200`;
- tenant correto;
- status;
- versão;
- total;
- correlation.

---

### 42. Criar consulta de histórico

Valide:

- lista;
- ordem cronológica;
- events;
- audit;
- ausência de raw provider payload.

---

### 43. Criar consulta inexistente

UUID sintético inexistente.

Valide `404 ORDER_NOT_FOUND`.

---

### 44. Criar consulta cross-tenant

Troque para token do tenant B e consulte order do tenant A.

Valide:

- `404`;
- detail não revela tenant;
- nenhum dado do pedido.

---

## Operações assíncronas

### 45. Criar pasta Stock Reservation

Requests:

- request success;
- replay;
- invalid transition;
- query until reserved;
- provider rejection fixture;
- ambiguous fixture.

---

### 46. Validar `202 Accepted`

Assertions:

- status `202`;
- correlation;
- operation reference quando exposta;
- response body coerente;
- nenhum estado terminal prometido.

---

### 47. Criar polling reutilizável

O script precisa:

- ler `pollIntervalMs`;
- ler `pollTimeoutMs`;
- consultar estado;
- parar no estado alvo;
- falhar em timeout;
- registrar último estado;
- não usar loop infinito.

---

### 48. Não usar `setTimeout` como única estratégia

No Runner, encadeie requests com:

```javascript
postman.setNextRequest(
  "Get order - wait for stock"
);
```

Controle contador e prazo.

---

### 49. Criar request de espera por estoque

Quando estado:

```text
STOCK_RESERVED
```

continue para pagamento.

Quando terminal de falha, encerre a jornada com diagnóstico.

---

### 50. Criar pasta Payment Authorization

Requests:

- request authorization;
- replay;
- wait for authorized;
- declined flow;
- ambiguous flow;
- invalid transition.

---

### 51. Criar cenário de pagamento recusado

Use provider simulado configurado por dado sintético ou fixture.

Valide:

- request `202`;
- estado `COMPENSATING`;
- estado final previsto;
- audit;
- nenhuma duplicidade.

---

### 52. Criar pasta Fulfillment

Requests:

- start;
- replay;
- wait for completed;
- invalid transition;
- irreversible cancellation conflict.

---

### 53. Criar pasta Cancellations

Requests:

- cancellation accepted;
- cancellation replay;
- cancellation forbidden;
- invalid reason;
- cross-tenant cancellation;
- cancellation after irreversible step.

---

### 54. Criar pasta Reconciliation

Requests:

- operator forbidden;
- support accepted;
- workload accepted quando permitido;
- invalid provider;
- unknown operation;
- replay.

---

## Workflow chaining

### 55. Criar Workflow Chaining Policy

Arquivo:

```text
docs/postman/WORKFLOW_CHAINING_POLICY.md
```

Fluxos:

```text
happy path;

payment declined and compensation;

cancellation;

reconciliation;

security negative.
```

---

### 56. Criar jornada feliz

Sequência:

1. setup;
2. register;
3. stock request;
4. wait stock;
5. payment request;
6. wait payment;
7. fulfillment request;
8. wait completed;
9. query history;
10. collect evidence.

---

### 57. Criar jornada de compensação

Sequência:

1. register;
2. stock reserved;
3. payment declined;
4. wait compensating;
5. wait cancelled;
6. history;
7. validate compensation;
8. evidence.

---

### 58. Criar controle de fluxo

Use collection variable:

```text
journeyName;

journeyStep;

journeyFailure;

journeyStartedAt.
```

---

### 59. Interromper jornada em falha crítica

Quando setup, auth ou registro falhar:

```javascript
postman.setNextRequest(null);
```

Registre motivo sanitizado.

---

### 60. Evitar dependência acidental de ordem

Requests isolados precisam explicar pré-condições.

Jornadas usam pastas específicas e scripts explícitos.

---

## Cenários negativos

### 61. Criar Negative Scenario Policy

Arquivo:

```text
docs/postman/NEGATIVE_SCENARIO_POLICY.md
```

Categorias:

- authentication;
- authorization;
- tenant;
- validation;
- idempotency;
- transition;
- media type;
- rate limit;
- not found;
- contract.

---

### 62. Criar collection negativa separada

Isso permite:

- execução rápida;
- gates específicos;
- diagnóstico;
- menor risco de contaminar jornada positiva.

---

### 63. Testar scopes

Cenários:

- read sem `orders:read`;
- write sem `orders:write`;
- cancel sem `orders:cancel`;
- reconcile sem `orders:reconcile`.

Valide `403`.

---

### 64. Testar roles

Token com scope correto e role incorreta.

Valide `403`.

---

### 65. Testar tenant mismatch

Claim tenant A.

Header tenant B.

Valide `403 TENANT_CONTEXT_MISMATCH`.

---

### 66. Testar mass assignment

Body tenta enviar:

- tenant;
- status;
- version;
- internal flags.

Valide rejeição conforme contrato.

---

### 67. Testar body excessivo controlado

Use fixture pequena o suficiente para o laboratório, mas acima do limite configurado.

Não transforme isso em carga.

---

### 68. Testar métodos não suportados

Requests:

- TRACE;
- CONNECT;
- método inexistente para path.

Valide bloqueio coerente.

---

## Data-driven tests

### 69. Criar arquivo de pedidos

`register-orders.json` contém casos sintéticos:

- uma linha;
- múltiplas linhas;
- quantidades variadas;
- valores diferentes;
- external references únicas.

---

### 70. Usar data variables

Exemplo:

```text
{{externalReference}};

{{productCode}};

{{quantity}};

{{amount}}.
```

---

### 71. Evitar colisão de idempotência

Gere key por iteration, salvo quando o cenário testa replay.

---

### 72. Criar dataset de cancelamento

Casos:

- reason válido;
- reason inválido;
- descrição ausente;
- descrição longa;
- estado elegível;
- estado inelegível.

---

## Runner e CLI

### 73. Criar CLI Execution Policy

Arquivo:

```text
docs/postman/CLI_EXECUTION_POLICY.md
```

Ferramentas aceitas:

- Postman CLI;
- Newman quando adotado pelo projeto.

A escolha precisa estar fixada e documentada.

---

### 74. Criar script de execução

`run-collection.ps1` recebe:

- collection;
- environment;
- data;
- report directory;
- iteration count;
- timeout;
- bail.

---

### 75. Executar com Postman CLI

Exemplo conceitual:

```powershell
postman collection run `
  testing/postman/collection/OrderFlow.postman_collection.json `
  -e testing/postman/environments/OrderFlow-local.postman_environment.json
```

Não inclua API key real no script.

---

### 76. Executar com Newman quando escolhido

Exemplo:

```powershell
npx newman run `
  testing/postman/collection/OrderFlow.postman_collection.json `
  -e testing/postman/environments/OrderFlow-local.postman_environment.json `
  --reporters cli,json,junit `
  --reporter-json-export reports/postman-cli-summary.json
```

---

### 77. Habilitar bail para setup crítico

Falhas de:

- environment;
- token;
- readiness;
- contract base;

devem interromper a execução.

---

### 78. Definir timeout

Nenhuma execução aguarda indefinidamente.

Polling também respeita timeout global.

---

### 79. Integrar ao CI

Pipeline:

1. sobe ambiente efêmero;
2. aguarda readiness;
3. executa collection positiva;
4. executa collection negativa;
5. sanitiza reports;
6. publica artifacts;
7. encerra ambiente.

---

### 80. Não enviar secrets ao artifact

O runner deve mascarar ou remover:

- access token;
- refresh token;
- client secret;
- password;
- authorization header.

---

## Reports e evidence

### 81. Criar Report Sanitization Policy

Arquivo:

```text
docs/postman/REPORT_SANITIZATION_POLICY.md
```

Conteúdo proibido:

- token;
- secret;
- password;
- private key;
- raw Authorization;
- dado pessoal;
- endpoint real não autorizado.

---

### 82. Criar `sanitize-report.ps1`

O script:

- lê JSON, JUnit e HTML;
- remove headers sensíveis;
- substitui sentinelas;
- falha quando encontra padrão proibido;
- gera checksum.

---

### 83. Criar relatório HTML

O HTML precisa mostrar:

- pastas;
- requests;
- assertions;
- status;
- duração;
- failures;
- iterations.

Sem secrets.

---

### 84. Criar summary YAML

Arquivo:

```text
reports/postman-collection-report.yaml
```

Exemplo:

```yaml
postmanCollection:
  collection:
    format:
      v2.1
    folders:
      11
    requests:
      54

  execution:
    positive:
      PASS
    negative:
      PASS
    assertions:
      286
    failures:
      0

  security:
    secretLeaks:
      0
    productionTargets:
      0

  README:
    completed:
      false

  gate:
    PASS
```

---

### 85. Criar evidence

Arquivo:

```text
contracts/postman-collection-evidence.yaml
```

Campos:

- lesson;
- project;
- collection format;
- OpenAPI checksum;
- folder count;
- request count;
- environment count;
- data file count;
- authentication setup status;
- workload token status;
- correlation generation status;
- idempotency generation status;
- replay scenario status;
- idempotency conflict status;
- happy journey status;
- compensation journey status;
- cancellation journey status;
- reconciliation status;
- authentication negative count;
- authorization negative count;
- tenant negative count;
- contract negative count;
- assertion count;
- assertion failure count;
- CLI execution status;
- JUnit report status;
- JSON report status;
- HTML report status;
- secret leak count;
- production target count;
- README completed;
- documentation status;
- gate status;
- timestamp.

---

## Governança

### 86. Criar Postman Test Matrix

Arquivo:

```text
docs/postman/POSTMAN_TEST_MATRIX.md
```

Colunas:

- folder;
- request;
- precondition;
- auth;
- scope;
- status;
- schema;
- variables;
- next request;
- negative pair;
- evidence.

---

### 87. Criar Postman Risk Register

Arquivo:

```text
docs/postman/POSTMAN_RISK_REGISTER.md
```

Riscos:

```text
token exportado;

environment apontando para producao;

idempotency key reutilizada;

variavel global contaminada;

assertion fraca;

polling infinito;

ordem acidental;

example divergente;

secret no report;

tenant no body;

collection antiga;

request sem cleanup.
```

---

### 88. Criar Postman Traceability

Arquivo:

```text
docs/postman/POSTMAN_TRACEABILITY.md
```

Exemplo:

```text
OpenAPI register operation
-> Register order request
-> success assertions
-> replay request
-> conflict request.

Security matrix
-> missing token
-> missing scope
-> cross-tenant
-> workload misuse.

Async guide
-> stock request
-> polling
-> payment
-> fulfillment
-> final query.
```

---

### 89. Criar boundary da próxima aula

Arquivo:

```text
docs/postman/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 695 define:

- Postman Collection;
- environments;
- variables;
- authentication;
- workload token;
- correlation;
- idempotency;
- request assertions;
- Problem Details assertions;
- positive journeys;
- negative scenarios;
- data-driven execution;
- Postman CLI or Newman;
- reports;
- evidence.

A aula 696 define:

- professional README;
- project pitch;
- architecture overview;
- technology stack;
- local execution;
- testing strategy;
- security;
- observability;
- CI CD;
- deployment;
- API documentation links;
- Postman links;
- evidence catalog;
- portfolio positioning.

O README profissional
nao e produzido nesta aula.
```

---

## Validação da collection

### 90. Gerar collection

```powershell
.\testing\postman\scripts\generate-collection.ps1
```

---

### 91. Validar JSON e schema

```powershell
.\testing\postman\scripts\validate-collection.ps1
```

Valide:

- formato v2.1;
- IDs;
- variables;
- URLs;
- scripts;
- ausência de secrets;
- checksum OpenAPI.

---

### 92. Importar no Postman

Confirme:

- folders;
- environments;
- descriptions;
- examples;
- scripts;
- variáveis vazias sensíveis;
- ordem de jornadas.

---

### 93. Executar setup manual

Valide:

- environment;
- readiness;
- token;
- runtime variables;
- console sem secret.

---

### 94. Executar jornada feliz

Rode a pasta:

```text
10 - Full Journeys / Happy Path.
```

Confirme estado final.

---

### 95. Executar compensação

Rode:

```text
10 - Full Journeys / Payment Declined.
```

Confirme compensação e estado final.

---

### 96. Executar collection negativa

Confirme:

- `401`;
- `403`;
- `404`;
- `409`;
- `415`;
- assertions corretas;
- zero efeito indevido.

---

### 97. Executar CLI

```powershell
.\testing\postman\scripts\run-collection.ps1 `
  -Environment "local"
```

---

### 98. Gerar e sanitizar reports

```powershell
.\testing\postman\scripts\generate-html-report.ps1

.\testing\postman\scripts\sanitize-report.ps1
```

---

### 99. Executar secret scan

Procure:

```text
Bearer;

access_token;

refresh_token;

client_secret;

private_key;

password.
```

Patterns de estrutura podem existir em documentação, mas valores reais ou sentinelas não podem permanecer nos artifacts finais.

---

### 100. Revisar como consumidor

Uma pessoa sem acesso ao código precisa conseguir:

- importar;
- configurar;
- autenticar;
- registrar;
- consultar;
- executar jornada;
- entender falha;
- executar CLI.

---

### 101. Criar gate da collection

Status:

```text
PASS;

FAIL_POSTMAN_STRUCTURE;

FAIL_COLLECTION_SCHEMA;

FAIL_OPENAPI_CHECKSUM;

FAIL_ENVIRONMENT;

FAIL_PRODUCTION_GUARD;

FAIL_AUTHENTICATION_SETUP;

FAIL_WORKLOAD_AUTHENTICATION;

FAIL_VARIABLE_POLICY;

FAIL_CORRELATION_SCRIPT;

FAIL_IDEMPOTENCY_SCRIPT;

FAIL_REQUEST_ASSERTION;

FAIL_PROBLEM_DETAILS_ASSERTION;

FAIL_REPLAY_SCENARIO;

FAIL_IDEMPOTENCY_CONFLICT;

FAIL_HAPPY_JOURNEY;

FAIL_COMPENSATION_JOURNEY;

FAIL_CANCELLATION_JOURNEY;

FAIL_RECONCILIATION_JOURNEY;

FAIL_NEGATIVE_SECURITY;

FAIL_NEGATIVE_CONTRACT;

FAIL_DATA_DRIVEN;

FAIL_CLI_EXECUTION;

FAIL_REPORT_GENERATION;

FAIL_REPORT_SANITIZATION;

FAIL_SECRET_LEAK;

FAIL_README_ANTICIPATION;

INCONCLUSIVE.
```

---

### 102. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\testing\postman\scripts\validate-collection.ps1

.\testing\postman\scripts\run-collection.ps1 `
  -Environment "local"

.\testing\postman\scripts\run-negative-collection.ps1 `
  -Environment "local"

.\testing\postman\scripts\collect-postman-evidence.ps1
```

Confirme:

- collection válida;
- environments seguros;
- auth funcional;
- idempotência;
- correlation;
- jornadas;
- negativos;
- CLI;
- reports;
- zero secret;
- README profissional preservado para a aula 696.

---

### 103. Encerrar o laboratório

Confirme:

- Charter;
- structure;
- environments;
- variable policy;
- setup;
- tokens;
- correlation;
- idempotency;
- assertions;
- Orders;
- queries;
- stock;
- payment;
- fulfillment;
- cancellations;
- reconciliation;
- workflow chaining;
- negative collection;
- data-driven;
- CLI;
- reports;
- sanitization;
- matrix;
- risk register;
- traceability;
- report;
- evidence;
- gate aprovado;
- README não produzido.

---

## Entendendo o que foi feito

### A documentação virou execução

A collection transforma exemplos em requests reproduzíveis.

### Variáveis ganharam governança

Configuração, identidade e estado de jornada possuem escopos claros.

### Autenticação ficou automatizada

Tokens são obtidos em runtime sem serem exportados.

### Idempotência ganhou cenários reais

Criação, replay e conflito foram validados.

### Operações assíncronas ficaram encadeadas

Polling controlado acompanha a jornada sem loop infinito.

### Segurança ganhou coleção negativa

`401`, `403`, `404` e tenant mismatch são verificados.

### O CI ganhou uma prova de consumo

A collection pode rodar como consumidor externo da API.

### Os reports ficaram seguros

Artifacts são sanitizados antes de publicação.

### O projeto ficou pronto para apresentação

A aula 696 consolidará tudo no README profissional.

---

## Erros comuns importantes

### Salvar token no environment exportado

O artifact vira vazamento.

### Usar global para tudo

Execuções contaminam umas às outras.

### Gerar nova key no replay

O cenário deixa de testar idempotência.

### Aceitar vários status

A assertion não prova comportamento.

### Polling sem timeout

O runner pode ficar preso.

### Depender da ordem inteira da collection

Um request isolado se torna inutilizável.

### Apontar para produção

A collection educacional pode causar incidente.

### Não sanitizar report

Authorization pode aparecer no artifact.

### Colocar tenant no body

A collection ensina prática insegura.

### Escrever README agora

A consolidação pertence à aula 696.

---

## Comandos úteis

### Validar collection

```powershell
.\testing\postman\scripts\validate-collection.ps1
```

### Executar positiva

```powershell
.\testing\postman\scripts\run-collection.ps1 `
  -Environment "local"
```

### Executar negativa

```powershell
.\testing\postman\scripts\run-negative-collection.ps1 `
  -Environment "local"
```

### Gerar evidence

```powershell
.\testing\postman\scripts\collect-postman-evidence.ps1
```

---

## Exercício guiado

Crie e execute no Postman o fluxo:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. validar environment;
2. obter token;
3. gerar correlation;
4. gerar idempotency key;
5. registrar pedido;
6. salvar order ID;
7. repetir registro;
8. validar replay;
9. solicitar estoque;
10. polling;
11. solicitar pagamento;
12. provider recusar;
13. polling de compensação;
14. estado final;
15. consultar histórico;
16. validar eventos;
17. validar Problem Details negativo;
18. testar scope ausente;
19. testar cross-tenant;
20. executar CLI;
21. gerar JSON report;
22. gerar JUnit report;
23. gerar HTML report;
24. sanitizar;
25. criar evidence.

Não produza o README principal.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 694 e ponte para a aula 696 foram preservadas;
- Postman Collection Charter foi criado;
- Collection Structure foi criada;
- padrão de nomes foi definido;
- collection v2.1 foi criada;
- collection foi ligada à OpenAPI;
- Environment Policy foi criada;
- environment template foi criado;
- variáveis sensíveis foram marcadas;
- environment local foi criado;
- environment HML simulado foi criado;
- produção foi bloqueada;
- Variable Policy foi criada;
- variáveis de jornada foram definidas;
- estado é limpo no setup;
- correlation ID é gerado;
- correlation é validado;
- Authentication Script Policy foi criada;
- pasta Setup foi criada;
- token de usuário é obtido;
- token não é impresso;
- renovação foi tratada;
- workload token foi separado;
- token ausente foi testado;
- Idempotency Script Policy foi criada;
- helper de key foi criado;
- request de registro foi preparado;
- body original foi salvo;
- primeira criação foi validada;
- order ID foi extraído;
- replay foi criado;
- conflito de idempotência foi criado;
- Assertion Policy foi criada;
- helpers de assertions foram criados;
- JSON foi validado;
- Content-Type foi validado;
- Problem Details foi validado;
- ausência de secrets foi validada;
- assertions fracas foram evitadas;
- pasta Orders foi criada;
- invalid request foi criado;
- consulta atual foi criada;
- histórico foi consultado;
- inexistente foi testado;
- cross-tenant foi testado;
- pasta Stock foi criada;
- `202` foi validado;
- polling foi criado;
- loop infinito foi evitado;
- espera por estoque foi criada;
- pasta Payment foi criada;
- pagamento recusado foi testado;
- pasta Fulfillment foi criada;
- pasta Cancellations foi criada;
- pasta Reconciliation foi criada;
- Workflow Chaining Policy foi criada;
- jornada feliz foi criada;
- jornada de compensação foi criada;
- controle de fluxo foi criado;
- jornada interrompe em falha;
- dependência acidental de ordem foi evitada;
- Negative Scenario Policy foi criada;
- collection negativa foi criada;
- scopes foram testados;
- roles foram testadas;
- tenant mismatch foi testado;
- mass assignment foi testado;
- body excessivo foi testado;
- métodos não suportados foram testados;
- arquivo data-driven de pedidos foi criado;
- data variables foram usadas;
- colisão de idempotência foi evitada;
- dataset de cancelamento foi criado;
- CLI Execution Policy foi criada;
- script de execução foi criado;
- Postman CLI foi documentado;
- Newman foi documentado quando adotado;
- bail foi configurado;
- timeout foi definido;
- CI foi integrado;
- secrets não vão para artifacts;
- Report Sanitization Policy foi criada;
- sanitizer de reports foi criado;
- relatório HTML foi criado;
- summary YAML foi criado;
- evidence foi criada;
- Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 696 foi criado;
- collection foi gerada;
- JSON e schema foram validados;
- importação foi validada;
- setup manual foi executado;
- jornada feliz foi executada;
- compensação foi executada;
- collection negativa foi executada;
- CLI foi executada;
- reports foram gerados;
- secret scan foi executado;
- revisão como consumidor foi executada;
- gate foi criado;
- report, evidence e diário de bordo estão presentes;
- README profissional não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\validate-secrets.ps1

.\testing\postman\scripts\validate-collection.ps1
```

Adicione:

```powershell
git add `
  testing/postman `
  docs/postman `
  reports/postman-collection-report.yaml `
  reports/postman-cli-summary.json `
  reports/postman-negative-summary.json `
  reports/postman-report.html `
  contracts/postman-collection-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret[^_a-zA-Z]|private_key|access_token.*ey|refresh_token.*ey|productionUrl|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "test(postman): publish executable OrderFlow API collection"
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
- secret real;
- endpoint de produção;
- tenant real;
- report não sanitizado;
- README profissional;
- conteúdo detalhado da aula 696.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou a Postman Collection do OrderFlow.

Você implementou:

```text
collection v2.1;

environments;

variable governance;

authentication setup;

workload token;

correlation scripts;

idempotency scripts;

request assertions;

Problem Details assertions;

positive journeys;

compensation journey;

negative scenarios;

data-driven tests;

Postman CLI or Newman execution;

sanitized reports;

evidence e gate.
```

A API agora pode ser compreendida e executada por um consumidor externo sem acesso ao código.

A próxima aula será:

```text
696 - M20.26 - README profissional
```

Nela, você consolidará o projeto em uma apresentação pública profissional, com proposta, problema, arquitetura, stack, execução, testes, segurança, observabilidade, CI/CD, deploy, OpenAPI, Postman, evidências, decisões e diferenciais.

O README profissional não foi produzido nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei collection v2.1.
- [ ] Criei environments.
- [ ] Protegi secrets.
- [ ] Automatizei autenticação.
- [ ] Automatizei correlation.
- [ ] Automatizei idempotência.
- [ ] Criei assertions.
- [ ] Criei jornadas.
- [ ] Criei cenários negativos.
- [ ] Executei CLI.
- [ ] Gerei reports.
- [ ] Sanitizei artifacts.
- [ ] Preservei README para a aula 696.

---

## Troubleshooting adicional

### Token não é armazenado

Revise o test script do setup e o escopo da variável.

### Replay cria pedido novo

Confirme mesma key, mesmo body e mesmo tenant.

### Polling nunca termina

Revise estados terminais, contador e timeout.

### Collection passa com status incorreto

Revise assertions permissivas.

### Cross-tenant retorna dados

Interrompa o gate e revise segurança.

### Runner usa environment errado

Exija nome permitido no script.

### Report contém Authorization

Execute sanitizer antes de publicar.

### Request isolado falha por variável

Documente pré-condição ou gere a variável no pre-request.

### Collection diverge da OpenAPI

Compare checksum e regenere com revisão.

### Quero escrever o README principal

Essa etapa pertence à aula 696.

---

## Perguntas de revisão

1. Collection é apenas lista de requests?
2. Qual é a fonte da collection?
3. Qual escopo usar para base URL?
4. Token deve ser exportado?
5. Para que serve pre-request script?
6. Para que serve test script?
7. Quando gerar nova idempotency key?
8. Quando reutilizar a key?
9. Correlation deve conter dado pessoal?
10. O que `202` significa?
11. Como acompanhar estado?
12. Por que polling precisa de timeout?
13. O que assertion fraca faz?
14. Para que serve collection negativa?
15. Como testar cross-tenant?
16. O que data-driven permite?
17. Para que serve CLI?
18. O que `bail` faz?
19. Por que sanitizar report?
20. Produção deve estar disponível?
21. O que evidence registra?
22. O que a aula 696 fará?
23. O que não foi produzido?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. OpenAPI validada.
3. Environment.
4. Não.
5. Preparar request.
6. Validar response.
7. Nova intenção.
8. Replay e retry da mesma intenção.
9. Não.
10. Aceito para processamento.
11. Polling controlado.
12. Evitar loop infinito.
13. Aceita comportamento errado.
14. Validar negações.
15. Token de outro tenant.
16. Repetir casos com dados.
17. Execução automatizada.
18. Interrompe após falha crítica.
19. Remover secrets.
20. Não nesta formação.
21. Configuração, execução e resultado.
22. Criar README profissional.
23. README principal.
24. README profissional.
25. Collection organiza, executa e comprova.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 695 - M20.25 - Postman Collection

- Continuei após Documentação OpenAPI.
- Criei Postman Collection Charter.
- Criei Collection Structure.
- Defini padrão de nomes.
- Criei collection v2.1.
- Liguei collection à OpenAPI.
- Criei Environment Policy.
- Criei environment template.
- Protegi variáveis sensíveis.
- Criei environment local.
- Criei HML simulado.
- Bloqueei produção.
- Criei Variable Policy.
- Defini variáveis de jornada.
- Limpei estado no setup.
- Gerei correlation ID.
- Validei correlation.
- Criei Authentication Script Policy.
- Criei pasta Setup.
- Obtive token de usuário.
- Evitei impressão de token.
- Tratei expiração.
- Separei workload token.
- Testei token ausente.
- Criei Idempotency Script Policy.
- Criei helper de key.
- Preparei registro.
- Salvei body original.
- Validei primeira criação.
- Extraí order ID.
- Criei replay.
- Criei conflito.
- Criei Assertion Policy.
- Criei helpers.
- Validei JSON.
- Validei Content-Type.
- Validei Problem Details.
- Validei ausência de secrets.
- Evitei assertions fracas.
- Criei pasta Orders.
- Criei invalid requests.
- Criei consulta atual.
- Criei histórico.
- Testei inexistente.
- Testei cross-tenant.
- Criei pasta Stock.
- Validei 202.
- Criei polling.
- Evitei loop infinito.
- Criei espera por estoque.
- Criei pasta Payment.
- Testei recusa e compensação.
- Criei pasta Fulfillment.
- Criei pasta Cancellations.
- Criei pasta Reconciliation.
- Criei Workflow Chaining Policy.
- Criei jornada feliz.
- Criei jornada de compensação.
- Criei controle de fluxo.
- Interrompi jornada em falha.
- Evitei ordem acidental.
- Criei Negative Scenario Policy.
- Criei collection negativa.
- Testei scopes.
- Testei roles.
- Testei tenant mismatch.
- Testei mass assignment.
- Testei body excessivo.
- Testei métodos não suportados.
- Criei datasets.
- Usei data variables.
- Evitei colisão de key.
- Criei dataset de cancelamento.
- Criei CLI Execution Policy.
- Criei script de execução.
- Documentei Postman CLI.
- Documentei Newman.
- Configurei bail.
- Defini timeout.
- Integrei ao CI.
- Protegi artifacts.
- Criei Report Sanitization Policy.
- Criei sanitizer.
- Criei relatório HTML.
- Criei summary YAML.
- Criei evidence.
- Criei Postman Test Matrix.
- Criei Postman Risk Register.
- Criei Postman Traceability.
- Criei boundary para a aula 696.
- Gerei e validei collection.
- Validei importação.
- Executei setup.
- Executei jornada feliz.
- Executei compensação.
- Executei collection negativa.
- Executei CLI.
- Gerei e sanitizei reports.
- Executei secret scan.
- Revisei como consumidor.
- Criei gate.
- Não antecipei README profissional.
- Próxima aula: README profissional.
```

---

## Referência técnica curta

- Postman Collection.
- Collection Format v2.1.
- Postman Environment.
- Collection Variable.
- Pre-Request Script.
- Test Script.
- Collection Runner.
- Postman CLI.
- Newman.
- Data-Driven Test.
- Idempotency-Key.
- Correlation ID.
- Request Chaining.
- Problem Details.
- Negative Test.
- JUnit Report.
- Report Sanitization.

Regra final:

```text
A Postman Collection final do OrderFlow deve transformar a OpenAPI validada em execução reproduzível sem criar uma fonte concorrente: a collection v2.1 registra checksum e versão do contrato, folders organizam setup, orders, queries, stock, payment, fulfillment, cancellation, reconciliation, negativos e jornadas, environments local e hml-simulated contêm apenas configuração não sensível e produção é bloqueada, tokens de usuário e workload são obtidos em runtime e nunca exportados ou impressos, variables usam o menor escopo, pre-request scripts geram correlation e idempotency keys, nova intenção gera nova key enquanto replay mantém key e body, test scripts validam status, Content-Type, correlation, schemas, Problem Details, semântica e ausência de secrets, registro salva orderId e Location, operações assíncronas validam 202 e usam polling com contador e timeout, happy path e payment-declined journey encadeiam requests explicitamente, negative collection cobre token, scope, role, tenant, IDOR, mass assignment, validation, media type e idempotency conflict, datasets executam casos sintéticos sem colisão, Postman CLI ou Newman roda com timeout, bail, JSON, JUnit e HTML, reports são sanitizados antes de publicação, CI sobe ambiente, executa positivas e negativas e coleta evidence, e o gate termina com collection, environments, scripts, jornadas, negativos, CLI, reports, report e evidence aprovados, enquanto pitch, arquitetura, stack, execução, qualidade, segurança, observabilidade, CI CD, deploy, documentação, links e posicionamento público permanecem reservados para a aula 696.
```
