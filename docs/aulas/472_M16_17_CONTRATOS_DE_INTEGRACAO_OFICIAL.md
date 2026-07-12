# 472 - M16.17 - Contratos de integracao

## Apresentação da aula

Ao longo do Módulo 16, o laboratório criou várias formas de comunicação entre sistemas.

Integrações HTTP:

```text
RestClient;

WebClient;

timeouts;

retry;

circuit breaker;

bulkhead;

fallback;

idempotência;

upload e download.
```

Webhooks:

```text
evento versionado;

HMAC;

replay protection;

at-least-once;

inbox;

deduplicação.
```

SOAP e XML:

```text
WSDL;

XSD;

Envelope;

Fault;

namespace;

parser seguro.
```

Arquivos:

```text
CSV;

checksum;

SFTP;

rejection report;

Spring Batch.
```

Cada integração possui código, testes e configurações, mas ainda precisa declarar formalmente o que o provider promete e o consumer pode utilizar. Essa promessa é o contrato de integração.

Contrato não é apenas uma classe Java.

Também não é somente uma página de documentação.

Um contrato de integração descreve, de forma revisável e verificável:

- operação;
- endereço lógico;
- método ou canal;
- autenticação;
- request;
- response;
- evento;
- arquivo;
- schema;
- headers;
- status;
- erros;
- idempotência;
- versionamento;
- limites;
- compatibilidade;
- lifecycle;
- ownership.

A pergunta central desta aula será:

```text
como transformar
as integrações do módulo
em contratos versionados,
testáveis,
compatíveis
e governados?
```

O laboratório criará uma raiz única:

```text
contracts/
```

Ela ficará próxima aos projetos, mas não pertencerá ao package de uma única aplicação.

Estrutura inicial:

```text
contracts/
├── manifest.yaml
├── ownership.yaml
├── error-catalog.yaml
├── compatibility-policy.md
├── catalog-http/
│   └── v1/
│       ├── openapi.yaml
│       ├── examples/
│       └── CHANGELOG.md
├── catalog-webhooks/
│   └── v1/
│       ├── asyncapi.yaml
│       ├── schemas/
│       ├── examples/
│       └── CHANGELOG.md
├── legacy-inventory-soap/
│   └── v1/
│       ├── inventory-service.wsdl
│       ├── inventory-v1.xsd
│       ├── samples/
│       └── CHANGELOG.md
└── inventory-adjustments-file/
    └── v1/
        ├── contract.yaml
        ├── examples/
        ├── rejections/
        └── CHANGELOG.md
```

A API HTTP será descrita por OpenAPI.

O laboratório fixará:

```yaml
openapi: 3.1.1
jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema"
```

Escolha deliberada. O projeto não troca a versão apenas porque existe uma publicação mais recente; parser, linter, generator, renderer, diff checker, plugins e consumers precisam ser validados. Contrato versionado exige toolchain versionada.

Os webhooks serão descritos com AsyncAPI e schemas JSON reutilizáveis.

Baseline:

```yaml
asyncapi: 3.1.0
```

O evento principal continuará:

```text
reservation.confirmed.v1.
```

O SOAP continuará WSDL-first:

```text
inventory-service.wsdl;

inventory-v1.xsd.
```

O CSV terá um manifesto próprio porque OpenAPI não descreve completamente:

- filename;
- delimiter;
- BOM;
- quoting;
- header exato;
- lifecycle;
- rejection report;
- remote directories.

Cada contrato terá exemplos.

Exemplo válido:

```text
mostra um uso permitido.
```

Exemplo inválido:

```text
prova uma regra de rejeição.
```

Exemplos não serão textos ilustrativos desconectados.

Eles serão executados em testes.

A aula também criará um catálogo central de erros.

Exemplo:

```yaml
errors:
  - code: product_catalog_unavailable
    transport: http
    status: 503
    retryable: true
    owner: catalog-platform

  - code: idempotency_key_reused_with_different_request
    transport: http
    status: 409
    retryable: false
    owner: catalog-platform

  - code: INVALID_QUANTITY
    transport: file
    scope: record
    retryable: false
    owner: inventory-integration
```

O objetivo é impedir códigos divergentes, retry de erro permanente, exposição de mensagens internas e alterações silenciosas de status ou códigos.

Também será criado um arquivo de ownership.

Exemplo:

```yaml
contracts:
  catalog-http-v1:
    providerTeam: catalog-platform
    consumerTeams:
      - order-platform
    technicalOwner: catalog-api
    businessOwner: inventory-domain
    securityOwner: platform-security
    lifecycle: active
```

Contrato sem owner envelhece sem manutenção.

A aula estabelecerá três tipos de compatibilidade.

Backward compatibility:

```text
novo provider
continua atendendo
consumers antigos.
```

Forward compatibility:

```text
consumer antigo
tolera dados adicionais
de uma versão nova.
```

Full compatibility:

```text
a mudança funciona
nos dois sentidos
definidos pela policy.
```

Esses termos dependem do contexto.

Adicionar um campo opcional a uma response JSON pode ser compatível para consumers tolerantes.

Pode quebrar um consumer que rejeita propriedades desconhecidas.

Adicionar um valor novo a um enum de response pode quebrar:

- `switch` exaustivo;
- generated client fechado;
- parser configurado com enum rígido;
- regra de negócio que assume conjunto completo.

Por isso, a policy não dirá:

```text
campo opcional
é sempre seguro.
```

Ela dirá:

```text
a mudança é candidata
a compatibilidade
e precisa passar
pelos consumers declarados.
```

A aula 474 implementará testes de contrato completos.

Nesta aula, construiremos:

- artefatos;
- policies;
- ownership;
- exemplos;
- checks estruturais;
- relatório de mudança.

A próxima aula, `473 - M16.18 - WireMock aplicado`, utilizará os contratos HTTP para simular o provider com fidelidade.

WireMock não será implementado agora.

Ao final, você deverá explicar:

```text
por que contrato
não é implementação;

por que OpenAPI
não substitui regra de negócio;

por que example
precisa ser executável;

por que adicionar enum
pode quebrar consumer;

por que versão da URL
não resolve toda compatibilidade;

por que provider,
consumer
e owner
precisam estar declarados;

por que alteração de contrato
precisa de diff
e rollout coordenado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
470:
Jobs batch.

471:
Upload download em integracoes.

472:
Contratos de integracao.

473:
WireMock aplicado.

474:
Testes de contrato.
```

A aula 471 respondeu:

```text
como transportar arquivos
por HTTP
com streaming,
integridade
e autorização?
```

A aula 472 responderá:

```text
como consolidar
promessas entre sistemas
em artefatos governados?
```

Nesta aula:

```text
OpenAPI:
sim.

AsyncAPI:
sim.

JSON Schema:
sim.

WSDL/XSD:
consolidado.

contrato CSV:
consolidado.

ownership:
sim.

compatibilidade:
sim.

WireMock:
próxima aula.

Pact/testes completos:
aula 474.
```

A regra central será:

```text
contrato aceito
é artefato versionado,
validado
e pertencente
a owners conhecidos.
```

---

## Objetivo prático

Ao final, o laboratório terá:

```text
contracts/
├── manifest.yaml
├── ownership.yaml
├── error-catalog.yaml
├── compatibility-policy.md
├── catalog-http/v1/
├── catalog-webhooks/v1/
├── legacy-inventory-soap/v1/
└── inventory-adjustments-file/v1/
```

Classes e testes:

```text
ContractManifest;

ContractDescriptor;

ContractOwner;

ContractLifecycle;

IntegrationErrorDescriptor;

ContractCompatibilityRule;

OpenApiContractStructureTest;

OpenApiExamplesValidationTest;

AsyncApiContractStructureTest;

WebhookExamplesValidationTest;

SoapContractCatalogTest;

FileContractManifestTest;

ErrorCatalogCoverageTest;

ContractOwnershipTest;

ContractVersionPolicyTest;

ContractExamplesSanitizationTest;

ContractCompatibilityPolicyTest;

ContractChangeReportTest;

ContractBoundaryArchitectureTest.
```

Relatórios:

```text
build/reports/contracts/
├── inventory.json
├── compatibility.md
├── errors.md
├── ownership.md
└── examples.md
```

Documentação:

```text
docs/contracts/
├── CONTRACT_GOVERNANCE.md
├── CONTRACT_COMPATIBILITY.md
├── CONTRACT_VERSIONING.md
├── CONTRACT_CHANGE_PROCESS.md
├── CONTRACT_DEPRECATION.md
└── CONTRACT_RUNBOOK.md
```

Você irá:

1. inventariar integrações;
2. criar manifest;
3. declarar ownership;
4. criar catálogo de erros;
5. escrever OpenAPI;
6. escrever AsyncAPI;
7. reutilizar JSON Schema;
8. catalogar WSDL/XSD;
9. formalizar CSV;
10. criar examples;
11. classificar mudanças;
12. criar policy de versionamento;
13. criar lifecycle;
14. criar deprecation;
15. criar diff report;
16. criar gates estruturais;
17. validar sanitização;
18. revisar compatibilidade;
19. criar runbook;
20. preparar WireMock.

---

## Conceito essencial

### Contrato e implementação

Contrato:

```text
o que é observável
e prometido.
```

Implementação:

```text
como o sistema
produz esse comportamento.
```

Um refactor interno não deveria alterar o contrato.

Uma mudança pequena em JSON pode ser breaking change mesmo sem alterar regras internas.

---

### Contrato sintático

Descreve:

- nomes;
- tipos;
- formatos;
- required;
- cardinalidade;
- status;
- headers;
- schemas.

Exemplo:

```text
quantity:
integer,
minimum 1.
```

---

### Contrato semântico

Descreve significado.

Exemplo:

```text
quantity:
quantidade reservada
na unidade base do produto.
```

Duas APIs podem usar o mesmo tipo `integer` e significados diferentes.

Schema valida sintaxe.

Documentação e regras validam semântica.

---

### Contrato operacional

Inclui:

- timeout esperado;
- retry;
- rate limit;
- idempotência;
- retention;
- ordem;
- duplicação;
- SLO;
- tamanho;
- segurança;
- ownership.

Esses itens não devem ficar somente em conversas.

---

### OpenAPI

OpenAPI descreve APIs HTTP de forma independente da linguagem.

Pode declarar:

- paths;
- operations;
- parameters;
- request bodies;
- responses;
- schemas;
- security schemes;
- examples;
- callbacks;
- webhooks;
- links.

No laboratório, será a fonte de verdade do contrato HTTP.

---

### Contract-first e code-first

Contract-first:

1. contrato é desenhado;
2. revisão ocorre;
3. provider implementa;
4. consumers integram.

Code-first:

1. implementação existe;
2. ferramenta gera descrição.

Ambos podem funcionar.

O risco code-first é publicar detalhes acidentais da implementação.

A baseline adotará:

```text
contract-reviewed-first;

implementation verified against contract.
```

---

### OpenAPI e JSON Schema

OpenAPI 3.1 utiliza alinhamento amplo com JSON Schema.

Mesmo assim, a ferramenta precisa compreender o dialect configurado.

Use:

```yaml
jsonSchemaDialect:
  https://json-schema.org/draft/2020-12/schema
```

Não misture keywords de drafts diferentes sem gate.

---

### Components

Schemas reutilizáveis ficam em:

```yaml
components:
  schemas:
```

Também podem existir:

- parameters;
- responses;
- headers;
- securitySchemes;
- examples.

Reuso reduz divergência, mas um component genérico demais pode misturar conceitos diferentes.

---

### OperationId

Cada operação terá `operationId` estável.

Exemplos:

```text
createIntegrationFile;

uploadIntegrationFileContent;

downloadIntegrationFileContent;

checkProductAvailability;

createReservation.
```

Alterar `operationId` pode quebrar clients gerados e documentação.

---

### Status codes

Documente todos os resultados relevantes.

Não use:

```text
default:
qualquer erro.
```

como substituto do catálogo.

A baseline inclui responses explícitas:

- sucesso;
- validação;
- autenticação;
- autorização;
- not found;
- conflict;
- precondition;
- rate limit;
- unavailable.

---

### Problem Details

Erros HTTP usam:

```text
application/problem+json.
```

O schema comum terá:

- type;
- title;
- status;
- detail seguro;
- instance;
- code;
- correlationId.

O `code` vem do error catalog.

---

### Required em request e response

Adicionar required em request:

```text
breaking.
```

Remover required de request pode ser compatível para o provider, mas altera expectativa e precisa de revisão.

Adicionar required em response pode não quebrar consumers antigos que ignoram extra fields, mas muda o contrato do provider e pode impactar mocks e validators.

A classificação depende da direção.

---

### Campo removido

Remover campo publicado é breaking enquanto existe consumer que o utiliza.

Ausência aparente de uso não é prova.

Use:

- consumer inventory;
- telemetry quando permitida;
- tests;
- deprecation;
- owner approval.

---

### Renomear campo

Renomear equivale a:

```text
remover campo antigo
+
adicionar campo novo.
```

É breaking sem período de coexistência.

---

### Restrições

Narrowing:

```text
maximum menor;

pattern mais restritivo;

enum menor;

string menor;

required novo.
```

Normalmente quebra requests anteriormente válidas.

Widening pode afetar consumers de response que não aceitam novos valores.

---

### Enum

Enums de request e response têm direções diferentes.

Request:

```text
provider aceitar valor novo
pode ser compatível.
```

Response:

```text
provider emitir valor novo
pode quebrar consumer.
```

Prefira modelos que tenham estratégia para valor desconhecido quando o domínio permitir.

---

### Null e ausência

Estes estados não são iguais:

```text
campo ausente;

campo null;

string vazia;

zero.
```

O contrato precisa escolher.

Não use `nullable` por conveniência.

---

### Arrays

Defina:

- minItems;
- maxItems;
- uniqueness;
- order semântico;
- empty behavior.

Adicionar ordenação onde antes não existia é mudança semântica.

---

### AsyncAPI

AsyncAPI descreve APIs orientadas a mensagens.

O documento pode registrar:

- servers;
- channels;
- operations;
- messages;
- payload;
- headers;
- correlation ID;
- bindings;
- security.

Para o webhook, o canal lógico será:

```text
reservation.confirmed.
```

O transporte continuará HTTP.

---

### Evento imutável

O mesmo `eventId` representa o mesmo fato.

O schema do evento não deve mudar entre retries.

Uma nova forma incompatível usa:

```text
reservation.confirmed.v2.
```

---

### Compatibilidade de eventos

Adicionar campo opcional pode ser compatível se consumers ignoram unknown.

Remover campo é breaking.

Alterar significado sem alterar schema é breaking semântico.

Mudar ordem de entrega ou duplicação também altera contrato operacional.

---

### WSDL e XSD

Para SOAP:

- target namespace;
- operation;
- message;
- binding;
- Fault;
- element;
- minOccurs;
- maxOccurs;
- types;

fazem parte do contrato.

Mudança incompatível cria novo namespace ou versão conforme policy.

Checksum continua gate de alteração.

---

### CSV

Contrato de arquivo inclui:

- filename;
- encoding;
- BOM;
- delimiter;
- quote;
- header;
- ordem;
- types;
- limits;
- rejection policy;
- idempotency;
- lifecycle.

Na baseline v1, adicionar uma coluna é breaking porque o header é exato.

A evolução cria:

```text
inventory-adjustments-v2.
```

---

### Ownership

Cada contrato precisa declarar:

- provider;
- consumers conhecidos;
- owner técnico;
- owner de negócio;
- security reviewer;
- lifecycle;
- support channel.

Sem inventário de consumers, a análise fica incompleta.

---

### Lifecycle

Estados:

```text
draft;

active;

deprecated;

retired.
```

`deprecated` ainda funciona.

`retired` não pode ser utilizado.

---

### Deprecation

Uma depreciação precisa conter:

- data de anúncio;
- owner;
- replacement;
- consumers afetados;
- prazo;
- telemetria;
- migration guide;
- data mínima de retirada;
- exceções aprovadas.

Não basta adicionar `deprecated: true`.

---

### Expand and contract

Estratégia:

1. expandir provider;
2. publicar campo/versão nova;
3. migrar consumers;
4. observar;
5. depreciar antigo;
6. remover somente depois.

Essa estratégia reduz big bang.

---

### Consumer-driven contract

O consumer declara as interações que realmente utiliza.

O provider verifica se continua atendendo.

Nesta aula, apenas registraremos:

```text
consumer expectations directory.
```

A automação ficará na aula 474.

---

### Example executável

Um example precisa:

- validar contra schema;
- usar código de erro existente;
- não conter secrets;
- representar comportamento real;
- possuir nome estável;
- indicar finalidade.

Examples inválidos também são úteis para provar rejeições.

---

### Golden file

Golden file é uma representação esperada versionada.

Útil para:

- XML;
- CSV;
- JSON;
- Problem Details;
- webhook.

Golden file exige revisão.

Não atualize automaticamente no CI.

---

### Contract diff

O diff precisa responder:

- o que foi adicionado;
- o que foi removido;
- o que ficou required;
- qual schema mudou;
- quais errors mudaram;
- quais consumers existem;
- se há nova versão;
- se o changelog explica.

Diff textual YAML não basta.

---

## Mão na massa guiada

### 1. Criar a raiz

```powershell
New-Item `
  -ItemType Directory `
  -Path labs/m16/aula-456-integracoes-http-entre-sistemas/contracts `
  -Force
```

Crie os subdiretórios definidos na apresentação.

---

### 2. Criar manifest

```yaml
manifestVersion: "1"
contracts:
  - id: catalog-http-v1
    type: openapi
    version: "1.0.0"
    lifecycle: active
    path: catalog-http/v1/openapi.yaml
    provider: catalog-provider

  - id: catalog-webhooks-v1
    type: asyncapi
    version: "1.0.0"
    lifecycle: active
    path: catalog-webhooks/v1/asyncapi.yaml
    provider: catalog-provider

  - id: legacy-inventory-soap-v1
    type: wsdl
    version: "1.0.0"
    lifecycle: draft
    path: legacy-inventory-soap/v1/inventory-service.wsdl
    provider: legacy-inventory

  - id: inventory-adjustments-file-v1
    type: file
    version: "1.0.0"
    lifecycle: active
    path: inventory-adjustments-file/v1/contract.yaml
    provider: legacy-erp
```

---

### 3. Criar ownership

```yaml
ownershipVersion: "1"
contracts:
  catalog-http-v1:
    technicalOwner: catalog-platform
    businessOwner: inventory-domain
    securityOwner: platform-security
    provider: catalog-provider
    consumers:
      - order-consumer
      - order-consumer-reactive
    supportChannel: catalog-integrations
```

Não use nomes pessoais como único owner.

---

### 4. Criar OpenAPI

Início:

```yaml
openapi: 3.1.1
jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema"

info:
  title: Catalog Integration API
  version: 1.0.0

servers:
  - url: https://catalog.example.invalid
    description: Contract placeholder
```

Nenhum host real.

---

### 5. Declarar security

```yaml
components:
  securitySchemes:
    catalogOAuth:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://identity.example.invalid/oauth2/token
          scopes:
            catalog:read: Read catalog data
            reservation:create: Create reservation
            integration-file:create: Create file metadata
            integration-file:upload: Upload file content
            integration-file:read: Download file content
```

URLs são placeholders sanitizados.

---

### 6. Declarar availability

```yaml
/api/v1/products/{productCode}/availability:
  get:
    operationId: checkProductAvailability
    parameters:
      - $ref: "#/components/parameters/ProductCode"
    responses:
      "200":
        description: Availability returned
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ProductAvailability"
      "404":
        $ref: "#/components/responses/ProductNotFound"
      "503":
        $ref: "#/components/responses/CatalogUnavailable"
```

Inclua headers relevantes.

---

### 7. Declarar reservation

Documente:

```text
Idempotency-Key;

request;

201;

Location;

Idempotent-Replayed;

400;

409;

503.
```

O error code precisa existir no catálogo.

---

### 8. Declarar file metadata

Documente:

```text
POST metadata;

PUT content;

GET content;

HEAD;

If-None-Match;

Content-Digest;

Range;

206;

304;

409;

412;

413;

416.
```

Para body binário:

```yaml
content:
  text/csv:
    schema:
      type: string
      format: binary
```

---

### 9. Criar ProblemDetails

```yaml
ProblemDetails:
  type: object
  required:
    - type
    - title
    - status
    - code
    - correlationId
  properties:
    type:
      type: string
      format: uri
    title:
      type: string
    status:
      type: integer
      minimum: 400
      maximum: 599
    detail:
      type: string
    instance:
      type: string
      format: uri
    code:
      type: string
      pattern: "^[a-z0-9_]+$"
    correlationId:
      type: string
```

Não inclua stack.

---

### 10. Criar AsyncAPI

```yaml
asyncapi: 3.1.0

info:
  title: Catalog Webhook API
  version: 1.0.0

channels:
  reservationConfirmed:
    address: /api/v1/webhooks/catalog
    messages:
      reservationConfirmed:
        $ref: "#/components/messages/ReservationConfirmed"

operations:
  receiveReservationConfirmed:
    action: receive
    channel:
      $ref: "#/channels/reservationConfirmed"
    messages:
      - $ref: "#/channels/reservationConfirmed/messages/reservationConfirmed"
```

Inclua headers HMAC como schema de headers.

---

### 11. Criar schema do evento

Arquivo:

```text
schemas/reservation-confirmed-v1.schema.json.
```

Use JSON Schema 2020-12.

Required:

- eventId;
- eventType;
- occurredAt;
- producer;
- tenantId;
- data.

`eventType` usa `const`:

```text
reservation.confirmed.v1.
```

---

### 12. Criar examples do evento

Examples:

```text
reservation-confirmed.valid.json;

reservation-confirmed.missing-event-id.json;

reservation-confirmed.wrong-version.json.
```

O primeiro passa.

Os outros falham com codes previstos pelo test.

---

### 13. Catalogar SOAP

Não copie novamente o contrato sem controle.

Use path único ou cópia sincronizada com checksum.

O manifest registra:

- WSDL;
- XSD;
- namespace;
- operation;
- binding;
- version;
- checksum.

Teste falha se a cópia do projeto divergir da raiz de contratos.

---

### 14. Criar contrato de arquivo

```yaml
contract: inventory-adjustments-v1
version: 1.0.0
fileNamePattern: "^inventory-adjustments-v1_[0-9]{8}T[0-9]{6}Z_[0-9]{6}\\.csv$"
encoding: UTF-8
bom: optional-at-start
delimiter: ";"
quote: '"'
multiline: forbidden
emptyLines: forbidden
header:
  - record_id
  - warehouse_code
  - product_code
  - operation
  - quantity
  - occurred_at
maximumFileSizeBytes: 52428800
maximumRecords: 500000
```

Inclua fields e rejection codes.

---

### 15. Criar error catalog

Campos:

```text
code;

transport;

status ou scope;

retryable;

owner;

publicTitle;

deprecated;

replacement.
```

O test garante code único.

---

### 16. Criar changelogs

Cada versão possui:

```markdown
# Changelog

## 1.0.0

- Contrato inicial aprovado.
```

Mudança de conteúdo exige entrada.

---

### 17. Criar version policy

Regra didática:

```text
patch:
correção documental
sem mudança observável.

minor:
mudança compatível
aprovada.

major:
breaking change
ou nova versão incompatível.
```

Não use SemVer mecanicamente sem classificar a direção.

---

### 18. Criar compatibility matrix

HTTP response:

| Mudança | Classificação inicial |
|---|---|
| adicionar optional field | review |
| remover field | breaking |
| mudar type | breaking |
| novo enum emitido | review/breaking |
| adicionar response code | review |
| remover response code | breaking |
| mudar error code | breaking |

Request:

| Mudança | Classificação inicial |
|---|---|
| novo required field | breaking |
| novo optional field | compatible/review |
| narrowing de pattern | breaking |
| aceitar novo enum | compatible para sender antigo |
| remover enum aceito | breaking |

---

### 19. Criar matrix de eventos

| Mudança | Classificação |
|---|---|
| novo optional field | review |
| remover required | breaking semântico/review |
| remover field usado | breaking |
| mudar eventType | nova versão |
| mudar duplicação | breaking operacional |
| mudar ordem | review/breaking |
| reutilizar event ID com novo body | proibido |

---

### 20. Criar matrix de arquivos

Na baseline:

| Mudança | Classificação |
|---|---|
| coluna adicional | nova versão |
| reordenar coluna | breaking |
| mudar delimiter | nova versão |
| mudar encoding | nova versão |
| aumentar limite | review |
| reduzir limite | breaking |
| novo rejection code | review |
| mudar filename pattern | breaking |

---

### 21. Criar ContractManifest loader

Use YAML parser configurado de forma segura.

O loader valida:

- IDs;
- paths relativos;
- path dentro da raiz;
- type permitido;
- version;
- lifecycle;
- owner existente;
- file existente.

Não permita `../`.

---

### 22. Criar structure tests

OpenAPI test:

- version exata;
- info;
- server sanitizado;
- operationId único;
- security em todas as operations;
- responses explícitas;
- examples;
- no localhost;
- no host real.

---

### 23. Criar example validation

Cada JSON example é validado contra seu schema.

Cada XML example é validado pelo XSD seguro da aula 467.

Cada CSV example é validado pelo reader da aula 468.

A mesma implementação usada em runtime participa do test.

---

### 24. Criar error coverage

O test percorre OpenAPI, AsyncAPI, file contract e fault map.

Todo code precisa existir em:

```text
error-catalog.yaml.
```

Todo error ativo precisa possuir ao menos um uso ou justificativa.

---

### 25. Criar ownership test

Falha se:

- owner ausente;
- consumer vazio sem justificativa;
- lifecycle inválido;
- contract ID desconhecido;
- support channel ausente;
- owner pessoal isolado.

---

### 26. Criar sanitization test

Proíba:

- token;
- secret;
- private key;
- e-mail real;
- CPF;
- endpoint real;
- IP privado;
- host produtivo;
- path local;
- correlation real.

Use sentinelas e allowlist de `example.invalid`.

---

### 27. Criar change report

Compare:

```text
contracts-baseline/
com
contracts/.
```

Relatório:

```markdown
## Contract changes

### catalog-http-v1

- Added optional property: storedAt
- Added response: 429
- Removed property: none
- Changed required: none

Initial classification:
REVIEW_REQUIRED
```

O baseline pode vir do Git no CI.

No teste local, use fixtures.

---

### 28. Criar breaking gate

Se a classificação for:

```text
BREAKING
```

exija:

- nova major version ou novo contract ID;
- migration guide;
- owner approval marker;
- changelog;
- deprecation plan;
- consumers list.

Não permita bypass por comentário livre.

---

### 29. Criar review gate

Mudanças `REVIEW_REQUIRED` exigem um arquivo:

```text
reviews/<change-id>.yaml.
```

Campos:

- contract;
- change;
- consumers reviewed;
- owners;
- expiresAt;
- decision.

O approval real vem do pull request.

---

### 30. Criar deprecation policy

Exemplo:

```yaml
contract: catalog-http-v1
element: GET /api/v1/legacy-availability
announcedAt: 2026-07-12
replacement: GET /api/v1/products/{productCode}/availability
minimumRemovalAt: 2026-10-12
consumers:
  - legacy-order-consumer
status: announced
```

A data é didática.

---

### 31. Criar consumer expectations

Estrutura:

```text
contracts/consumer-expectations/
├── order-consumer/
│   └── catalog-http-v1.yaml
└── order-consumer-reactive/
    └── catalog-http-v1.yaml
```

Declare operations e fields utilizados.

Não implemente Pact ainda.

---

### 32. Criar architecture test

Proíba:

- DTO externo duplicado sem mapper;
- paths HTTP hardcoded fora do adapter;
- error codes literais espalhados;
- generated SOAP types no domínio;
- CSV header duplicado em vários packages;
- event type literal fora do contract module.

---

### 33. Criar relatório de inventário

Inclua:

- contract ID;
- type;
- version;
- lifecycle;
- provider;
- consumers;
- owner;
- path;
- checksum;
- last change.

O relatório não substitui os contratos.

---

### 34. Criar governance doc

Fluxo de mudança:

1. abrir proposta;
2. alterar contrato;
3. gerar diff;
4. classificar;
5. consultar consumers;
6. atualizar examples;
7. atualizar changelog;
8. implementar provider;
9. executar gates;
10. liberar expand;
11. migrar consumers;
12. contrair depois.

---

### 35. Criar runbook

Perguntas:

- qual contract ID;
- versão;
- lifecycle;
- owner;
- provider;
- consumers;
- artifact;
- checksum;
- mudança recente;
- diff;
- breaking classification;
- examples passam;
- error code existe;
- deprecation ativa;
- consumer expectation existe;
- toolchain version;
- release associada.

---

### 36. Executar testes focados

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas

.\mvnw.cmd `
  -Dtest=OpenApiContractStructureTest,OpenApiExamplesValidationTest,AsyncApiContractStructureTest,WebhookExamplesValidationTest,SoapContractCatalogTest,FileContractManifestTest,ErrorCatalogCoverageTest,ContractOwnershipTest,ContractVersionPolicyTest,ContractExamplesSanitizationTest,ContractCompatibilityPolicyTest,ContractChangeReportTest,ContractBoundaryArchitectureTest `
  test
```

Caso os testes estejam no projeto `contract-tests`, execute o wrapper desse projeto.

---

### 37. Executar mudança compatível

Adicione à response:

```text
storedAt:
optional.
```

Gere o diff.

Esperado:

```text
REVIEW_REQUIRED.
```

Valide consumer expectations.

---

### 38. Executar breaking change

Remova:

```text
reservationId.
```

Esperado:

```text
BREAKING;

gate bloqueado.
```

Restaure o campo.

Não atualize baseline para esconder o problema.

---

### 39. Executar enum change

Adicione um novo status de response.

O gate classifica como review/breaking.

Documente quais consumers possuem fallback para unknown.

---

### 40. Executar file v2

Crie fixture de proposta:

```text
inventory-adjustments-v2
```

com `reason_code`.

O v1 permanece inalterado.

O manifest contém ambos.

---

### 41. Executar deprecation

Marque uma operation de fixture como deprecated.

Confirme:

- replacement;
- minimum removal;
- consumers;
- changelog;
- owner.

Sem esses dados, o gate falha.

---

### 42. Executar gate completo

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- structure;
- schemas;
- examples;
- errors;
- ownership;
- versions;
- diff;
- compatibility;
- sanitization;
- architecture;
- regressões HTTP;
- webhook;
- SOAP;
- XML;
- CSV;
- SFTP;
- Batch.

---

### 43. Registrar limitações

Ainda faltam:

```text
WireMock aplicado;

Pact/provider verification;

contract broker;

registry corporativo;

automated release approval;

telemetry de consumers;

portal de APIs;

schema registry;

organization-wide governance.
```

---

## Entendendo o que foi feito

### As integrações ganharam fonte de verdade

Cada protocolo possui um artefato apropriado.

### O contrato ficou separado do código

Implementação pode mudar sem alterar a promessa.

### Ownership ficou explícito

Provider, consumers e responsáveis passaram a ser conhecidos.

### Compatibilidade ganhou direção

Request, response, evento e arquivo não seguem a mesma regra.

### Examples viraram testes

JSON, XML e CSV deixaram de ser documentação passiva.

### Erros ganharam catálogo

Código, retryability e owner não ficam espalhados.

### Mudanças ganharam processo

Diff, classificação, changelog e deprecation fazem parte da entrega.

### WireMock ficou preparado

A próxima aula construirá stubs a partir dos contratos.

---

## Erros comuns importantes

### Gerar OpenAPI e nunca revisar

Detalhes internos podem virar contrato acidental.

### Tratar optional como sempre compatível

Consumers podem rejeitar unknown fields.

### Adicionar enum sem consultar consumers

Generated clients podem falhar.

### Versionar somente a URL

Schema, error e semântica ainda podem quebrar.

### Duplicar schema em vários projetos

As cópias divergem.

### Atualizar golden file automaticamente

O teste passa escondendo uma mudança.

### Criar código de erro livre

Retry e tratamento ficam inconsistentes.

### Depreciar sem replacement

Consumers não possuem caminho de migração.

### Não declarar consumers

O impacto vira suposição.

### Confundir contrato com teste end-to-end

Eles validam riscos diferentes.

---

## Comandos úteis

### Testes HTTP

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiContractStructureTest,OpenApiExamplesValidationTest,ErrorCatalogCoverageTest `
  test
```

### Eventos e arquivos

```powershell
.\mvnw.cmd `
  -Dtest=AsyncApiContractStructureTest,WebhookExamplesValidationTest,FileContractManifestTest,SoapContractCatalogTest `
  test
```

### Governance

```powershell
.\mvnw.cmd `
  -Dtest=ContractOwnershipTest,ContractVersionPolicyTest,ContractCompatibilityPolicyTest,ContractChangeReportTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar contratos duplicados

```powershell
git grep `
  -n `
  -E `
  "reservation\\.confirmed\\.v1|record_id;warehouse_code|idempotency_key_reused_with_different_request|/api/v1/integration-files"
```

---

## Exercício guiado

### Parte 1 — Inventário

Liste HTTP, webhook, SOAP e arquivo.

### Parte 2 — Manifest

Crie IDs, versões e lifecycle.

### Parte 3 — Ownership

Declare provider, consumers e owners.

### Parte 4 — HTTP

Escreva OpenAPI e Problem Details.

### Parte 5 — Eventos

Escreva AsyncAPI e JSON Schema.

### Parte 6 — Legados

Catalogue WSDL, XSD e CSV.

### Parte 7 — Errors

Crie catálogo central.

### Parte 8 — Compatibilidade

Crie matrices e diff report.

### Parte 9 — Examples

Valide JSON, XML e CSV.

### Parte 10 — Gate

Bloqueie uma breaking change simulada.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 471 foi preservada;
- contrato foi diferenciado de implementação;
- contrato sintático foi explicado;
- contrato semântico foi explicado;
- contrato operacional foi explicado;
- raiz `contracts` foi criada;
- manifest foi criado;
- IDs de contrato são estáveis;
- ownership foi criado;
- provider foi declarado;
- consumers foram declarados;
- owners técnico, negócio e segurança foram declarados;
- lifecycle foi criado;
- OpenAPI foi criado;
- versão do OpenAPI foi fixada;
- JSON Schema dialect foi fixado;
- operationIds são únicos;
- security schemes foram declarados;
- responses relevantes foram declaradas;
- Problem Details foi criado;
- error codes vêm do catálogo;
- AsyncAPI foi criado;
- versão do AsyncAPI foi fixada;
- event schema foi criado;
- event type possui versão;
- examples válidos e inválidos foram criados;
- WSDL e XSD foram catalogados;
- checksum SOAP foi preservado;
- contrato CSV foi formalizado;
- header e filename foram declarados;
- file v1 não aceita coluna silenciosa;
- error catalog foi criado;
- error code é único;
- retryability foi declarada;
- changelog foi criado;
- version policy foi criada;
- backward compatibility foi explicada;
- forward compatibility foi explicada;
- request e response foram diferenciados;
- enum evolution foi tratada;
- null e ausência foram diferenciados;
- arrays possuem policy;
- event compatibility foi tratada;
- file compatibility foi tratada;
- deprecation policy foi criada;
- replacement é obrigatório;
- minimum removal foi definido;
- expand and contract foi explicado;
- consumer expectations foram criadas;
- Pact não foi antecipado;
- examples são executáveis;
- golden files não são atualizados automaticamente;
- manifest loader bloqueia traversal;
- structure tests foram criados;
- error coverage foi criada;
- ownership test foi criado;
- sanitization test foi criado;
- change report foi criado;
- breaking gate foi criado;
- review gate foi criado;
- architecture test foi criado;
- breaking change simulada foi bloqueada;
- enum change foi revisada;
- file v2 preservou v1;
- deprecation fixture foi validada;
- WireMock não foi antecipado;
- limitações foram registradas;
- produção permaneceu NO-GO;
- gate foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat

git grep `
  -n `
  -E `
  "openapi:|asyncapi:|jsonSchemaDialect|operationId:|reservation\\.confirmed|error-catalog|ownership|deprecated:"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/contracts `
  labs/m16/aula-456-integracoes-http-entre-sistemas/docs `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "docs(m16): governar contratos de integracao"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- endpoint real;
- token;
- secret;
- payload produtivo;
- owner pessoal isolado;
- consumer omitido;
- baseline atualizada para esconder breaking change;
- generated client;
- WireMock antecipado;
- Pact antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as integrações do módulo ganharam uma camada comum de governança.

O inventário passou a reunir:

```text
OpenAPI;

AsyncAPI;

JSON Schema;

WSDL;

XSD;

contrato CSV;

error catalog;

ownership;

compatibility policy.
```

A principal decisão foi:

```text
contrato não é
um documento decorativo;

é um artefato
versionado,
executável,
revisável
e pertencente
a owners conhecidos.
```

Também ficou comprovado que:

- compatibilidade possui direção;
- optional field não é automaticamente seguro;
- enum de response pode quebrar consumer;
- renomear é remover e adicionar;
- schema não descreve toda semântica;
- examples precisam validar;
- errors precisam de catálogo;
- deprecation exige prazo e replacement;
- mudança precisa de diff e changelog;
- contract test não substitui end-to-end;
- consumer inventory é necessário para análise de impacto.

Próxima aula:

```text
473 - M16.18 - WireMock aplicado
```

Nela, você irá:

- criar servidor HTTP simulado;
- modelar stubs por cenário;
- validar requests;
- produzir responses alinhadas ao OpenAPI;
- simular delays;
- simular connection reset;
- simular faults;
- controlar stateful scenarios;
- verificar chamadas;
- reutilizar examples do contrato;
- testar RestClient, WebClient, retry, timeout e circuit breaker.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei todos os contratos.
- [ ] Declarei ownership e consumers.
- [ ] Criei OpenAPI, AsyncAPI e catálogo de erros.
- [ ] Validei examples e compatibilidade.
- [ ] Bloqueei uma breaking change simulada.

---

## Troubleshooting adicional

### OpenAPI passa, mas example falha

O example pode ter ficado desatualizado em relação ao schema.

### Campo optional quebra consumer

O consumer provavelmente rejeita propriedades desconhecidas ou usa generated enum/model rígido.

### Error code não aparece no catálogo

Adicione descriptor e owner antes de publicar.

### WSDL diverge entre pastas

Defina uma única fonte e valide checksum das cópias necessárias.

### Diff não detecta mudança semântica

Mudanças semânticas exigem changelog, review e tests além do diff estrutural.

### Contract ID mudou sem major version

Restaure o ID ou registre nova versão com migration.

### Deprecation não pode ser aprovada

Pode faltar replacement, prazo ou consumer inventory.

### File v2 quebra o v1

O reader ou manifest pode estar substituindo a versão antiga.

### Host real apareceu no OpenAPI

Use `example.invalid` e properties em runtime.

### A equipe quer adicionar Pact agora

A implementação de testes de contrato ficará para a aula 474.

---

## Perguntas de revisão

1. O que é contrato de integração?
2. Contrato é implementação?
3. O que é contrato sintático?
4. O que é contrato semântico?
5. O que é contrato operacional?
6. Para que serve OpenAPI?
7. Para que serve AsyncAPI?
8. Schema valida toda semântica?
9. O que é backward compatibility?
10. O que é forward compatibility?
11. Optional field é sempre seguro?
12. Novo enum de response pode quebrar?
13. Renomear campo é compatível?
14. Para que serve ownership?
15. O que é lifecycle deprecated?
16. O que é expand and contract?
17. Example deve ser executável?
18. O que faz o error catalog?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Promessa observável entre sistemas.
2. Não.
3. Estrutura e tipos.
4. Significado.
5. Limites e comportamento.
6. Descrever HTTP APIs.
7. Descrever APIs orientadas a mensagens.
8. Não.
9. Novo provider atende consumer antigo.
10. Consumer antigo tolera evolução definida.
11. Não.
12. Sim.
13. Não.
14. Definir responsabilidade.
15. Ainda funciona, mas será retirado.
16. Expandir, migrar e remover depois.
17. Sim.
18. Centralizar erros e retryability.
19. WireMock aplicado.
20. Simulações HTTP fiéis ao contrato.

---

## Desafio opcional

Crie uma proposta:

```text
catalog-http-v2.
```

Mudança:

```text
ProductAvailability.quantity
de integer
para objeto Quantity.
```

Requisitos:

- v1 permanece ativo;
- v2 possui novo contract ID;
- migration guide;
- adapters de coexistência;
- consumer inventory;
- changelog;
- examples;
- error catalog compartilhado;
- deprecation não é automática;
- diff classifica a mudança como breaking.

Não implemente a v2.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 472 - M16.17 - Contratos de integracao

- Diferenciei contrato e implementação.
- Diferenciei contrato sintático, semântico e operacional.
- Criei a raiz `contracts`.
- Criei `manifest.yaml`.
- Criei IDs e versões estáveis.
- Criei `ownership.yaml`.
- Declarei provider, consumers e owners.
- Modelei lifecycle draft, active, deprecated e retired.
- Criei OpenAPI do catálogo.
- Fixei OpenAPI 3.1.1.
- Fixei JSON Schema Draft 2020-12.
- Criei operationIds estáveis.
- Declarei OAuth2 scopes.
- Documentei availability, reservation e file APIs.
- Criei schema comum de Problem Details.
- Criei AsyncAPI dos webhooks.
- Fixei AsyncAPI 3.1.0.
- Criei schema `reservation.confirmed.v1`.
- Criei examples válidos e inválidos.
- Cataloguei WSDL e XSD.
- Preservei checksum do SOAP.
- Formalizei o contrato CSV v1.
- Criei `error-catalog.yaml`.
- Declarei retryability e owners dos erros.
- Criei changelogs.
- Criei policy de versionamento.
- Diferenciei backward e forward compatibility.
- Analisei required, optional, enums, null, arrays e constraints.
- Criei matrices para HTTP, eventos e arquivos.
- Criei deprecation policy.
- Adotei expand and contract.
- Criei consumer expectations.
- Não antecipei Pact.
- Transformei examples em testes.
- Criei loader seguro do manifest.
- Bloqueei path traversal.
- Criei structure, ownership, error e sanitization tests.
- Criei change report.
- Criei breaking e review gates.
- Criei architecture test.
- Bloqueei uma breaking change simulada.
- Mantive file v1 durante proposta v2.
- Validei deprecation com replacement.
- Criei governance, versioning, change process e runbook.
- Não antecipei WireMock.
- Mantive produção como NO-GO.
- Próxima aula: WireMock aplicado.
```

---

## Referência técnica curta

- [OpenAPI Specification](https://spec.openapis.org/oas/)
- [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html)
- [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest)
- [WSDL 1.1](https://www.w3.org/TR/wsdl.html)
- [XML Schema](https://www.w3.org/XML/Schema)
- [Pact — Consumer-driven contracts](https://docs.pact.io/)

Regra final:

```text
contratos de integração devem ser fontes de verdade versionadas e executáveis: HTTP é descrito por OpenAPI com schemas, operations, security, responses e Problem Details; eventos usam AsyncAPI e JSON Schema; SOAP mantém WSDL, XSD, namespaces e checksums; arquivos declaram dialeto, filename, limits, lifecycle e rejection policy; um manifest liga cada artefato a provider, consumers, owners, version e lifecycle; examples são validados, errors possuem catálogo, mudanças recebem diff e classificação direcional, breaking changes exigem nova versão e migration, deprecation exige replacement e prazo, e nenhum baseline pode ser atualizado apenas para esconder incompatibilidade.
```
