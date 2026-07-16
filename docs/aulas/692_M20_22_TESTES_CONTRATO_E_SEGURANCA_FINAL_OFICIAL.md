# 692 - M20.22 - Testes contrato e seguranca final

## Apresentação da aula

Na aula 691, você aprofundou os testes de integração do OrderFlow.

O projeto passou a possuir:

- PostgreSQL real com Testcontainers;
- migrations Flyway validadas;
- repositories JPA reais;
- optimistic locking;
- rollback transacional;
- Idempotency Store;
- Inbox e Outbox;
- Kafka real;
- consumers;
- retry topics;
- Dead Letter Queue;
- replay;
- WireMock;
- providers simulados;
- circuit breaker;
- Projection Worker;
- métricas e traces integrados;
- controle de eventual consistency com Awaitility;
- reports, evidence e gate.

Esses testes provaram que os adapters e a infraestrutura funcionam juntos.

Nesta aula, você fechará duas áreas críticas do projeto final:

```text
contratos;

seguranca.
```

Um sistema pode estar funcional e ainda assim falhar profissionalmente quando:

- altera um campo HTTP sem perceber;
- remove um response code usado por clients;
- muda um event schema de forma incompatível;
- envia payload diferente ao provider;
- aceita token com audience incorreto;
- concede acesso apenas porque existe uma role;
- confia no tenant enviado no body;
- revela que um recurso pertence a outro tenant;
- registra token em log;
- permite algoritmo JWT não esperado;
- não testa rotação de chaves;
- documenta um contrato diferente do executado.

Por isso, a validação final precisa comprovar:

```text
o contrato publicado
e o contrato executado
sao coerentes;

a identidade,
o tenant
e as permissoes
sao validados
em todas as fronteiras.
```

A parte de contratos abrangerá:

- OpenAPI;
- DTOs HTTP;
- status codes;
- headers;
- Problem Details;
- compatibilidade entre versões;
- provider contracts;
- message contracts;
- JSON schemas;
- schema evolution;
- examples executáveis;
- contract drift;
- consumer compatibility.

A parte de segurança abrangerá:

- autenticação;
- issuer;
- audience;
- assinatura;
- algoritmo;
- expiração;
- `not before`;
- subject;
- tenant claim;
- scopes;
- roles;
- method security;
- endpoint security;
- IDOR;
- tenant mismatch;
- mass assignment;
- security headers;
- CORS;
- CSRF para API stateless;
- secrets;
- logs;
- mensagens;
- workloads;
- regressões.

O laboratório será:

```text
labs/m20/aula-692-testes-contrato-e-seguranca-final/orderflow-contract-security-suite
```

A próxima aula será:

```text
693 - M20.23 - Performance e carga basica final
```

Na aula 693, você medirá latência, throughput, consumo de recursos, comportamento sob concorrência, backlog, lag, limites e capacidade básica do projeto final.

Nesta aula, nenhuma campanha de carga será executada.

Regra central:

```text
contrato precisa ser
compativel e verificavel;

seguranca precisa ser
negada por padrao
e testada por comportamento.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
689:
Deploy ou simulacao.

690:
Testes unitarios projeto final.

691:
Testes integracao projeto final.

692:
Testes contrato e seguranca final.

693:
Performance e carga basica final.

694:
Chaos basico e resiliencia final.
```

A aula 692 fecha a confiança externa do sistema.

A suíte unitária prova regras.

A suíte de integração prova boundaries reais.

A suíte desta aula prova:

- o que clients podem enviar;
- o que clients recebem;
- o que providers precisam aceitar;
- o que mensagens podem conter;
- quais versões são compatíveis;
- quem pode executar cada ação;
- em qual tenant a ação pode ocorrer;
- como acessos indevidos são negados;
- como dados sensíveis são protegidos.

A próxima aula medirá capacidade.

Portanto, esta aula não deve antecipar:

- testes com usuários virtuais;
- ramp-up;
- throughput target;
- percentis sob carga;
- stress;
- soak;
- capacity planning;
- tuning de pool;
- tuning de Kafka;
- tuning de JVM.

---

## Objetivo prático

Será criada a estrutura:

```text
testing/contracts-security
├── README.md
├── OpenAPI
│   ├── approved
│   │   └── orderflow-OpenAPI-v1.json
│   ├── generated
│   │   └── orderflow-OpenAPI-current.json
│   ├── examples
│   │   ├── register-order-request.json
│   │   ├── register-order-response.json
│   │   └── problem-details.json
│   └── reports
├── messages
│   ├── schemas
│   │   ├── order-registered-v1.schema.json
│   │   ├── stock-reservation-requested-v1.schema.json
│   │   ├── stock-reservation-result-v1.schema.json
│   │   ├── payment-authorization-requested-v1.schema.json
│   │   ├── payment-authorization-result-v1.schema.json
│   │   └── order-projection-changed-v1.schema.json
│   ├── examples
│   └── compatibility
├── providers
│   ├── stock
│   ├── payment
│   ├── fulfillment
│   └── reports
├── security
│   ├── tokens
│   ├── fixtures
│   ├── matrices
│   └── reports
└── evidence
```

Na API:

```text
apps/orderflow-api/src/test/java
└── br/com/formacao/orderflow/api/contractsecurity
    ├── OpenApiSnapshotContractTest.java
    ├── HttpRequestSchemaContractTest.java
    ├── HttpResponseSchemaContractTest.java
    ├── ProblemDetailsContractTest.java
    ├── HttpBackwardCompatibilityTest.java
    ├── JwtValidationSecurityTest.java
    ├── AuthorizationMatrixSecurityTest.java
    ├── TenantIsolationSecurityTest.java
    ├── IdorSecurityTest.java
    ├── SecurityHeadersTest.java
    ├── CorsSecurityTest.java
    ├── MassAssignmentSecurityTest.java
    ├── SecretLeakSecurityTest.java
    └── SecurityRegressionSuiteTest.java
```

No Gateway e contracts:

```text
apps/integration-gateway/src/test/java
├── StockProviderFinalContractTest.java
├── PaymentProviderFinalContractTest.java
└── FulfillmentProviderFinalContractTest.java

libs/orderflow-contracts/src/test/java
├── MessageSchemaContractTest.java
├── MessageBackwardCompatibilityTest.java
├── MessageExampleValidationTest.java
└── MessageSensitiveDataContractTest.java
```

Documentação:

```text
docs/testing/contract-security
├── CONTRACT_TEST_STRATEGY.md
├── OPENAPI_GOVERNANCE_POLICY.md
├── HTTP_COMPATIBILITY_POLICY.md
├── PROVIDER_CONTRACT_FINAL_POLICY.md
├── MESSAGE_SCHEMA_GOVERNANCE.md
├── SECURITY_FINAL_TEST_STRATEGY.md
├── JWT_VALIDATION_MATRIX.md
├── AUTHORIZATION_FINAL_MATRIX.md
├── TENANT_ISOLATION_FINAL_POLICY.md
├── IDOR_TEST_POLICY.md
├── SECURITY_HEADER_POLICY.md
├── SECRET_LEAK_TEST_POLICY.md
├── CONTRACT_SECURITY_TEST_MATRIX.md
├── CONTRACT_SECURITY_RISK_REGISTER.md
├── CONTRACT_SECURITY_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Contrato não é somente documentação

Contrato executável inclui:

- schema;
- exemplos;
- status;
- headers;
- semântica;
- compatibilidade;
- testes;
- owner.

### Compatibilidade precisa de direção

Provider e consumer têm necessidades diferentes.

Exemplo:

```text
adicionar campo opcional
pode ser compativel
para um consumer tolerante.
```

Mas:

```text
remover campo obrigatorio
e incompatível.
```

### Segurança precisa de matriz negativa

Testar apenas usuário autorizado é insuficiente.

É necessário testar:

- sem token;
- token inválido;
- claim ausente;
- scope ausente;
- role ausente;
- tenant diferente;
- workload em endpoint de usuário;
- usuário em endpoint interno;
- recurso de outro tenant;
- body tentando sobrescrever tenant.

### `401`, `403` e `404` possuem papéis diferentes

```text
401:
identidade ausente ou invalida.

403:
identidade valida sem permissao.

404:
recurso nao visivel no tenant autenticado.
```

### OpenAPI precisa refletir runtime

O arquivo aprovado deve ser comparado com o documento gerado pela aplicação.

Isso detecta drift.

---

## Mão na massa guiada

### 1. Criar Contract Test Strategy

Arquivo:

```text
docs/testing/contract-security/CONTRACT_TEST_STRATEGY.md
```

Princípios:

```text
contracts are executable;

OpenAPI is generated from runtime;

approved snapshots are reviewed;

examples must validate;

compatibility is directional;

provider contracts are isolated;

message schemas are versioned;

security final validation shares the same evidence;
```

---

### 2. Criar Security Final Test Strategy

Arquivo:

```text
docs/testing/contract-security/SECURITY_FINAL_TEST_STRATEGY.md
```

Princípios:

```text
deny by default;

identity is validated before business execution;

tenant comes from authenticated claims;

scope and role are both enforced;

cross-tenant access does not reveal existence;

tokens and secrets never appear in outputs;

workload identity is distinct from user identity;

negative tests are mandatory.
```

---

### 3. Configurar profile Maven

Crie:

```text
contract-security-tests.
```

O profile executa:

- `*ContractTest`;
- `*SecurityTest`;
- schema validation;
- OpenAPI diff;
- secret leak scan;
- reports.

---

### 4. Separar artifacts aprovados e gerados

Use:

```text
approved:
baseline revisada.

generated:
contrato atual produzido no teste.
```

Nunca atualize a baseline automaticamente no mesmo job que valida compatibilidade.

---

## OpenAPI final

### 5. Criar OpenAPI Governance Policy

Arquivo:

```text
docs/testing/contract-security/OPENAPI_GOVERNANCE_POLICY.md
```

Defina:

- owner;
- versão;
- aprovação;
- diff;
- exemplos;
- depreciação;
- compatibilidade;
- publicação;
- retenção.

---

### 6. Gerar OpenAPI do runtime

Suba o contexto Spring de teste.

Consulte:

```text
/v3/api-docs.
```

Salve em:

```text
testing/contracts-security/OpenAPI/generated/orderflow-OpenAPI-current.json
```

---

### 7. Normalizar documento

Antes do diff, normalize:

- ordem de propriedades;
- ordem de paths;
- servidores variáveis;
- timestamps;
- campos não semânticos.

Não remova diferenças funcionais.

---

### 8. Criar OpenApiSnapshotContractTest

```java
package br.com.formacao.orderflow.api.contractsecurity;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class OpenApiSnapshotContractTest {

    @Test
    void OpenAPI_deve_permanecer_compativel_com_baseline_aprovada()
            throws Exception {

        String approved = Files.readString(
                Path.of(
                        "testing/contracts-security/OpenAPI/approved/"
                                + "orderflow-OpenAPI-v1.json"));

        String generated = Files.readString(
                Path.of(
                        "testing/contracts-security/OpenAPI/generated/"
                                + "orderflow-OpenAPI-current.json"));

        assertThat(generated)
                .isNotBlank();

        OpenApiCompatibilityResult result =
                OpenApiCompatibilityVerifier.verify(
                        approved,
                        generated);

        assertThat(result.breakingChanges())
                .as(result.report())
                .isEmpty();
    }
}
```

---

### 9. Definir mudanças incompatíveis HTTP

Exemplos:

- remover path;
- remover método;
- tornar campo opcional obrigatório;
- remover response code;
- alterar tipo;
- reduzir enum;
- remover header obrigatório;
- alterar formato;
- mudar semântica documentada.

---

### 10. Definir mudanças compatíveis

Exemplos:

- adicionar endpoint;
- adicionar response code documentado;
- adicionar campo opcional;
- adicionar header opcional;
- ampliar descrição;
- adicionar example;
- adicionar enum somente quando consumer tolera desconhecido.

---

### 11. Validar request examples

Cada example precisa:

- validar contra schema;
- passar Bean Validation;
- mapear para command;
- não conter tenant;
- não conter campos desconhecidos proibidos.

---

### 12. Validar response examples

Cada example precisa conter:

- campos obrigatórios;
- formatos;
- status coerente;
- ausência de entity JPA;
- ausência de dados internos;
- replay flag quando aplicável.

---

### 13. Testar Problem Details

Valide schema para:

- validation error;
- invalid JSON;
- authentication;
- access denied;
- not found;
- conflict;
- internal error.

Campos:

```text
type;

title;

status;

detail;

instance;

code;

correlationId.
```

---

### 14. Validar headers do contrato

Headers finais:

```text
Authorization;

Idempotency-Key;

X-Correlation-Id;

X-Tenant-Id
somente como confirmacao opcional.
```

OpenAPI precisa documentar obrigatoriedade e semântica.

---

### 15. Testar Content-Type

Requests aceitos:

```text
application/json.
```

Responses de sucesso:

```text
application/json.
```

Problem Details:

```text
application/problem+json.
```

---

### 16. Testar campos desconhecidos

Defina policy explícita.

Para comandos críticos, prefira falhar quando um campo desconhecido pode indicar erro do client.

Valide comportamento e documentação.

---

### 17. Criar HTTP Compatibility Policy

Arquivo:

```text
docs/testing/contract-security/HTTP_COMPATIBILITY_POLICY.md
```

Inclua:

- versionamento;
- depreciação;
- período de compatibilidade;
- headers;
- schemas;
- examples;
- response codes;
- breaking change process.

---

### 18. Criar teste de versão anterior

Use payload de client v1 aprovado.

Valide que a API atual continua aceitando e respondendo conforme contrato suportado.

---

### 19. Testar enum desconhecido

Quando o client envia enum inválido:

```text
400 INVALID_REQUEST.
```

Quando o server recebe enum novo de provider, a ACL deve gerar:

```text
INVALID_CONTRACT.
```

---

### 20. Testar paginação

Valide:

- page;
- size;
- máximo;
- sort permitido;
- metadados;
- ausência de filtro tenant escolhido pelo client.

---

## Contratos finais de providers

### 21. Criar Provider Contract Final Policy

Arquivo:

```text
docs/testing/contract-security/PROVIDER_CONTRACT_FINAL_POLICY.md
```

Para cada operação, registre:

- método;
- path;
- headers;
- auth;
- idempotency;
- request;
- response;
- errors;
- timeout;
- version;
- owner.

---

### 22. Criar fixtures aprovadas de Stock

Fixtures:

- reserve request;
- reserve success;
- business rejection;
- duplicate same payload;
- duplicate different payload;
- malformed response.

---

### 23. Criar StockProviderFinalContractTest

Valide:

- método;
- URI;
- operation ID;
- idempotency key;
- correlation;
- workload token;
- body;
- mapping;
- unknown field policy.

---

### 24. Criar PaymentProviderFinalContractTest

Valide:

- amount como decimal;
- currency;
- operation ID;
- authorization result;
- decline code;
- reversal;
- duplicate semantics;
- timeout ambiguity.

---

### 25. Criar FulfillmentProviderFinalContractTest

Valide:

- start;
- cancel;
- irreversible state;
- pending;
- terminal result;
- unknown status;
- error taxonomy.

---

### 26. Testar contract drift

Altere fixture simulada:

- remova campo;
- mude tipo;
- adicione status desconhecido;
- altere path.

O teste precisa falhar com relatório claro.

---

### 27. Validar autenticação de workload

Contrato exige:

- audience;
- bearer token;
- token type workload;
- subject de serviço;
- correlation;
- ausência de token em report.

---

## Schemas de mensagens

### 28. Criar Message Schema Governance

Arquivo:

```text
docs/testing/contract-security/MESSAGE_SCHEMA_GOVERNANCE.md
```

Regras:

- type versionado;
- schema imutável por versão;
- example obrigatório;
- compatibility test;
- owner;
- sensitive data review;
- deprecation;
- upcaster quando necessário.

---

### 29. Criar JSON schemas

Cada schema define:

- metadata;
- required;
- types;
- formats;
- enums;
- `additionalProperties`;
- limites de tamanho;
- payload.

---

### 30. Validar MessageMetadata

Campos obrigatórios:

- message ID;
- type;
- version;
- tenant;
- aggregate;
- correlation;
- occurred at;
- producer.

`causationId` pode seguir a regra definida para mensagens raiz.

---

### 31. Criar MessageSchemaContractTest

```java
package br.com.formacao.orderflow.contracts;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class MessageSchemaContractTest {

    @Test
    void stock_reservation_requested_v1_deve_validar_example_aprovado() {
        String schema =
                ContractFixture.readSchema(
                        "stock-reservation-requested-v1.schema.json");

        String example =
                ContractFixture.readExample(
                        "stock-reservation-requested-v1.example.json");

        var errors =
                JsonSchemaVerifier.validate(
                        schema,
                        example);

        assertThat(errors)
                .isEmpty();
    }
}
```

---

### 32. Testar compatibilidade backward

Valide que consumer atual lê:

- schema atual;
- versão anterior suportada;
- campo opcional ausente;
- campo opcional novo;
- ordem diferente de propriedades.

---

### 33. Testar breaking changes

O gate falha quando:

- campo obrigatório removido;
- tipo alterado;
- enum reduzido;
- key semântica alterada;
- metadata removida;
- version reutilizada.

---

### 34. Testar upcasters

Uma mensagem antiga precisa virar modelo interno atual sem perda de semântica.

---

### 35. Testar dados sensíveis

Schemas e examples não podem conter:

- bearer token;
- secret;
- private key;
- cartão completo;
- password;
- authorization header;
- dado pessoal não necessário.

---

### 36. Validar tamanho de mensagem

Defina limite.

Payload excessivo falha antes da publicação.

Não transforme Kafka em storage de documento.

---

## JWT final

### 37. Criar JWT Validation Matrix

Arquivo:

```text
docs/testing/contract-security/JWT_VALIDATION_MATRIX.md
```

Casos:

- token válido;
- sem token;
- assinatura inválida;
- issuer inválido;
- audience ausente;
- audience diferente;
- expirado;
- `nbf` futuro;
- subject ausente;
- tenant ausente;
- token type inválido;
- algoritmo não permitido;
- `kid` desconhecido;
- chave rotacionada.

---

### 38. Testar token válido

Token precisa conter:

- issuer confiável;
- audience;
- subject;
- tenant;
- scopes;
- roles;
- token type;
- timestamps válidos.

---

### 39. Testar algoritmo não permitido

Se a policy aceita `RS256`, token com algoritmo diferente deve falhar.

Evite algoritmo escolhido livremente pelo token.

---

### 40. Testar `kid` desconhecido

O decoder não encontra chave válida.

Resultado:

```text
401 INVALID_TOKEN.
```

Nenhum handler é chamado.

---

### 41. Testar rotação de chave

Cenário:

- chave antiga ainda válida na janela;
- chave nova publicada;
- tokens novos funcionam;
- chave expirada deixa de funcionar.

---

### 42. Testar clock skew

Defina tolerância explícita.

Token muito fora da janela falha.

---

## Autorização final

### 43. Criar Authorization Final Matrix

Arquivo:

```text
docs/testing/contract-security/AUTHORIZATION_FINAL_MATRIX.md
```

Linhas:

- endpoint;
- método;
- scope;
- role;
- token type;
- tenant rule;
- expected status.

---

### 44. Testar registro

Permitido:

```text
orders:write
+
TENANT_OPERATOR
ou TENANT_ADMIN.
```

Negado quando faltar qualquer parte.

---

### 45. Testar consulta

Exigir:

```text
orders:read
```

E role autorizada.

Auditor pode consultar history conforme matrix.

---

### 46. Testar cancelamento

Exigir:

```text
orders:cancel
```

E role apropriada.

---

### 47. Testar reconciliação

Exigir:

```text
orders:reconcile
```

E role de suporte ou plataforma.

Tenant operator comum recebe `403`.

---

### 48. Testar endpoints internos

Exigir:

- token type workload;
- role workload;
- audience interna quando definida;
- scope específico.

Usuário comum recebe `403`.

---

### 49. Testar workload em endpoint de usuário

A policy precisa decidir explicitamente.

Quando não permitido, retorne `403`.

---

### 50. Testar negação antes do caso de uso

Sem permissão:

- repository não é chamado;
- transaction não inicia;
- Outbox não é criada;
- audit de negócio não é criado;
- audit de segurança é criado.

---

## Tenant isolation e IDOR

### 51. Criar Tenant Isolation Final Policy

Arquivo:

```text
docs/testing/contract-security/TENANT_ISOLATION_FINAL_POLICY.md
```

Defesas:

- claim;
- request context;
- command;
- query;
- repository;
- PK;
- FK;
- audit;
- Outbox;
- Inbox;
- logs.

---

### 52. Criar IDOR Test Policy

Arquivo:

```text
docs/testing/contract-security/IDOR_TEST_POLICY.md
```

Cenários:

- order ID de outro tenant;
- history de outro tenant;
- cancellation de outro tenant;
- reconciliation de outro tenant;
- paginação tentando filtrar tenant;
- body com tenant;
- header divergente.

---

### 53. Testar leitura cross-tenant

Token do tenant A consulta order do tenant B.

Resultado:

```text
404 ORDER_NOT_FOUND.
```

---

### 54. Testar comando cross-tenant

Cancelamento em order de outro tenant:

```text
404.
```

Nenhuma alteração ocorre.

---

### 55. Testar tenant mismatch

Claim:

```text
tenant-a.
```

Header opcional:

```text
tenant-b.
```

Resultado:

```text
403 TENANT_CONTEXT_MISMATCH.
```

---

### 56. Testar mass assignment

Request tenta enviar:

```json
{
  "tenantId": "tenant-b",
  "status": "COMPLETED",
  "version": 999,
  "lines": []
}
```

A API deve rejeitar campos proibidos ou ignorá-los conforme policy, sem alterar autoridade interna.

---

### 57. Testar paginação maliciosa

Query tenta:

```text
tenantId=tenant-b.
```

O tenant efetivo continua vindo do token.

---

## Segurança HTTP e exposição

### 58. Criar Security Header Policy

Arquivo:

```text
docs/testing/contract-security/SECURITY_HEADER_POLICY.md
```

Headers relevantes:

- cache control para respostas sensíveis;
- content type;
- nosniff;
- frame policy quando aplicável;
- referrer policy quando aplicável;
- HSTS somente em HTTPS real;
- correlation.

A API não precisa inventar headers de browser sem analisar contexto.

---

### 59. Testar CORS

Defina origens permitidas por ambiente.

Valide:

- origem permitida;
- origem não permitida;
- método;
- headers;
- credentials;
- preflight.

---

### 60. Testar CSRF

Como Resource Server stateless usa bearer token fora de cookie, a policy pode desabilitar CSRF.

O teste precisa comprovar ausência de sessão autenticada baseada em cookie.

---

### 61. Testar métodos não suportados

Exemplo:

```text
TRACE;
CONNECT;
```

Devem ser negados pelo servidor ou infraestrutura.

---

### 62. Testar media type incorreto

Request com tipo não suportado retorna:

```text
415.
```

---

### 63. Testar body excessivo

Defina limite de request.

Body acima do limite falha sem consumo descontrolado.

Não execute carga nesta aula.

---

## Secrets, logs e mensagens

### 64. Criar Secret Leak Test Policy

Arquivo:

```text
docs/testing/contract-security/SECRET_LEAK_TEST_POLICY.md
```

Fontes:

- HTTP response;
- logs;
- traces;
- metrics;
- DLQ;
- reports;
- exceptions;
- OpenAPI examples;
- message examples;
- provider fixtures.

---

### 65. Criar SecretLeakSecurityTest

Injete valores sentinela:

```text
sentinel-access-token;

sentinel-client-secret;

sentinel-private-key;

sentinel-password.
```

Após o cenário, procure os valores em outputs permitidos.

A contagem precisa ser zero.

---

### 66. Testar erro de provider

Provider retorna body contendo token sentinela.

A API e os logs não podem propagar o valor.

---

### 67. Testar DLQ sanitizada

Mensagem inválida contém campo sensível.

DLQ precisa conter reason e metadata segura, não secret.

---

### 68. Testar métricas

Nenhuma label pode conter:

- tenant;
- order;
- token;
- correlation;
- message ID;
- exception message.

---

### 69. Testar OpenAPI examples

Examples não podem conter:

- token real;
- domínio real;
- credential;
- dado pessoal real;
- digest tratado como real sem identificação.

---

## Regressões e automação

### 70. Criar Security Regression Suite

Inclua cenários derivados de riscos conhecidos:

- bypass de scope;
- role excessiva;
- tenant no body;
- header divergente;
- IDOR;
- token expirado;
- algoritmo indevido;
- workload indevido;
- secret em error;
- unknown contract status.

---

### 71. Criar contract diff report

O report precisa listar:

- mudança;
- localização;
- classificação;
- producer;
- consumer;
- breaking;
- ação necessária.

---

### 72. Criar security report

O report precisa listar:

- cenário;
- identity;
- tenant;
- authority;
- endpoint;
- expected;
- actual;
- result;
- evidence.

Não inclua token.

---

### 73. Integrar ao CI

No pull request:

- gerar OpenAPI;
- validar diff;
- validar schemas;
- executar provider contracts;
- executar security matrix;
- executar secret leak suite;
- publicar reports;
- bloquear breaking change não aprovado.

---

### 74. Criar processo de aprovação de breaking change

Exigir:

- nova versão;
- migration de clients;
- deprecation;
- owner;
- janela;
- comunicação;
- compatibility evidence;
- decisão arquitetural.

---

### 75. Não atualizar snapshot automaticamente

Uma mudança intencional exige revisão humana.

O workflow pode gerar candidate snapshot como artifact.

---

## Matriz e governança

### 76. Criar Contract Security Test Matrix

Arquivo:

```text
docs/testing/contract-security/CONTRACT_SECURITY_TEST_MATRIX.md
```

Categorias:

- OpenAPI;
- request;
- response;
- Problem Details;
- providers;
- messages;
- compatibility;
- JWT;
- authorization;
- tenant;
- IDOR;
- headers;
- CORS;
- CSRF;
- secrets;
- logs;
- DLQ;
- metrics;
- regression.

---

### 77. Criar Contract Security Risk Register

Arquivo:

```text
docs/testing/contract-security/CONTRACT_SECURITY_RISK_REGISTER.md
```

Riscos:

```text
OpenAPI drift;

breaking change silenciosa;

example invalido;

provider contract drift;

message schema reutilizado;

enum reduzido;

algorithm confusion;

audience ausente;

scope bypass;

role excessiva;

tenant override;

IDOR;

secret leak;

DLQ sensivel;

CORS amplo;

security report com token.
```

---

### 78. Criar Contract Security Traceability

Arquivo:

```text
docs/testing/contract-security/CONTRACT_SECURITY_TRACEABILITY.md
```

Exemplo:

```text
HTTP contract
-> OpenAPI baseline
-> generated document
-> compatibility test.

ADR tenant isolation
-> tenant claim
-> request context
-> repository key
-> IDOR tests.

security matrix
-> endpoint policy
-> scope and role tests.

message governance
-> JSON schema
-> example
-> compatibility test
-> sensitive data test.
```

---

### 79. Criar boundary da próxima aula

Arquivo:

```text
docs/testing/contract-security/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 692 define:

- OpenAPI validation;
- HTTP compatibility;
- request and response schemas;
- Problem Details contracts;
- provider contracts;
- message schemas;
- backward compatibility;
- JWT validation;
- authorization matrix;
- tenant isolation;
- IDOR;
- security headers;
- CORS;
- CSRF policy;
- secret leak tests;
- security regression suite.

A aula 693 define:

- baseline performance;
- latency percentiles;
- throughput;
- concurrency;
- ramp-up;
- steady load;
- stress limit;
- resource observation;
- backlog;
- consumer lag;
- basic capacity conclusions.

Nenhuma campanha de carga
e executada nesta aula.
```

---

### 80. Executar contratos HTTP

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  verify `
  -Pcontract-security-tests
```

---

### 81. Executar contratos de providers

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -am `
  verify `
  -Pcontract-security-tests
```

---

### 82. Executar schemas de mensagens

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-contracts `
  -am `
  verify `
  -Pcontract-security-tests
```

---

### 83. Executar segurança final

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -Dgroups=security `
  verify `
  -Pcontract-security-tests
```

---

### 84. Executar suíte completa

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pcontract-security-tests
```

---

### 85. Criar report

Arquivo:

```text
reports/contract-security-final-report.yaml
```

Exemplo:

```yaml
contractSecurityFinal:
  contracts:
    OpenAPI:
      PASS
    HTTPCompatibility:
      PASS
    providers:
      PASS
    messages:
      PASS
    examples:
      PASS

  security:
    JWT:
      PASS
    authorization:
      PASS
    tenantIsolation:
      PASS
    IDOR:
      PASS
    secretLeak:
      PASS
    headers:
      PASS

  tests:
    contract:
      38
    security:
      47
    failures:
      0

  performanceLoad:
    executed:
      false

  gate:
    PASS
```

---

### 86. Criar evidence

Arquivo:

```text
contracts/contract-security-final-evidence.yaml
```

Campos:

- lesson;
- project;
- generated OpenAPI status;
- OpenAPI breaking change count;
- request example count;
- response example count;
- Problem Details status;
- provider contract test count;
- provider contract drift count;
- message schema count;
- message compatibility status;
- message sensitive field violation count;
- JWT matrix test count;
- invalid algorithm status;
- unknown key status;
- key rotation status;
- authorization matrix test count;
- tenant isolation status;
- IDOR status;
- tenant mismatch status;
- mass assignment status;
- CORS status;
- CSRF policy status;
- security header status;
- secret leak count;
- DLQ sensitive data count;
- metric forbidden label count;
- regression test count;
- total failure count;
- performance load executed;
- documentation status;
- gate status;
- timestamp.

---

### 87. Criar gate final de contrato e segurança

Status:

```text
PASS;

FAIL_CONTRACT_SECURITY_STRUCTURE;

FAIL_OPENAPI_GENERATION;

FAIL_OPENAPI_BREAKING_CHANGE;

FAIL_HTTP_REQUEST_CONTRACT;

FAIL_HTTP_RESPONSE_CONTRACT;

FAIL_PROBLEM_DETAILS_CONTRACT;

FAIL_PROVIDER_CONTRACT;

FAIL_PROVIDER_CONTRACT_DRIFT;

FAIL_MESSAGE_SCHEMA;

FAIL_MESSAGE_COMPATIBILITY;

FAIL_MESSAGE_SENSITIVE_DATA;

FAIL_JWT_SIGNATURE;

FAIL_JWT_ISSUER;

FAIL_JWT_AUDIENCE;

FAIL_JWT_TIME;

FAIL_JWT_ALGORITHM;

FAIL_JWT_KEY_ROTATION;

FAIL_AUTHORIZATION_SCOPE;

FAIL_AUTHORIZATION_ROLE;

FAIL_WORKLOAD_POLICY;

FAIL_TENANT_ISOLATION;

FAIL_IDOR;

FAIL_TENANT_MISMATCH;

FAIL_MASS_ASSIGNMENT;

FAIL_SECURITY_HEADER;

FAIL_CORS;

FAIL_CSRF_POLICY;

FAIL_SECRET_LEAK;

FAIL_DLQ_SANITIZATION;

FAIL_METRIC_LABEL_SECURITY;

FAIL_SECURITY_REGRESSION;

FAIL_PERFORMANCE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 88. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pcontract-security-tests
```

Confirme:

- OpenAPI gerada;
- zero breaking change não aprovado;
- examples válidos;
- provider contracts aprovados;
- message schemas aprovados;
- compatibilidade aprovada;
- JWT matrix aprovada;
- scopes e roles aprovados;
- tenant isolation aprovada;
- IDOR negado;
- zero secret leak;
- nenhuma carga executada.

---

### 89. Encerrar o laboratório

Confirme:

- strategies;
- profile Maven;
- baseline OpenAPI;
- document generated;
- diff;
- request contracts;
- response contracts;
- Problem Details;
- provider contracts;
- message schemas;
- compatibility;
- JWT;
- key rotation;
- authorization;
- workload;
- tenant;
- IDOR;
- mass assignment;
- headers;
- CORS;
- CSRF;
- secrets;
- DLQ;
- metrics;
- regression;
- CI integration;
- matrix;
- risk register;
- traceability;
- report;
- evidence;
- gate aprovado;
- performance não executada.

---

## Entendendo o que foi feito

### O contrato HTTP ficou verificável

OpenAPI gerada e baseline aprovada passaram a ser comparadas.

### Providers ficaram protegidos contra drift

Requests, responses, errors e idempotência foram validados.

### Mensagens ganharam schemas finais

Versão, compatibilidade e dados sensíveis foram testados.

### JWT ganhou matriz completa

Assinatura, issuer, audience, tempo, algoritmo e rotação foram cobertos.

### Autorização ganhou casos negativos

Scope e role precisam funcionar juntos.

### Tenant isolation foi comprovada

Cross-tenant retorna `404`, mismatch retorna `403` e body não controla tenant.

### Outputs ficaram protegidos

HTTP, logs, traces, metrics e DLQ não carregam secrets.

### O projeto ficou pronto para medição

A aula 693 poderá medir capacidade sem dúvidas sobre contrato ou segurança.

---

## Erros comuns importantes

### Atualizar baseline automaticamente

Breaking change pode ser aceita sem revisão.

### Testar somente status `200`

Headers e schemas podem estar errados.

### Provider fixture sem versionamento

Drift fica invisível.

### Reutilizar message type

Consumers não distinguem contrato.

### Aceitar qualquer algoritmo JWT

Abre risco de validação incorreta.

### Testar somente role

Scope bypass pode existir.

### Retornar `403` cross-tenant

A existência do recurso pode vazar.

### Permitir tenant no body

Mass assignment quebra isolamento.

### Logar token sentinela

Sanitização está incompleta.

### Executar carga agora

Performance pertence à aula 693.

---

## Comandos úteis

### OpenAPI e segurança

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  verify `
  -Pcontract-security-tests
```

### Providers

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  verify `
  -Pcontract-security-tests
```

### Mensagens

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-contracts `
  verify `
  -Pcontract-security-tests
```

### Tudo

```powershell
.\mvnw.cmd `
  clean `
  verify `
  -Pcontract-security-tests
```

---

## Exercício guiado

Feche contratos e segurança do cenário:

```text
cancelamento de pedido
apos pagamento autorizado.
```

Inclua:

1. OpenAPI;
2. request example;
3. response example;
4. Problem Details;
5. idempotency header;
6. JWT válido;
7. scope cancel;
8. role permitida;
9. tenant claim;
10. cross-tenant;
11. tenant mismatch;
12. mass assignment;
13. provider compensation contract;
14. compensation message schema;
15. backward compatibility;
16. unknown enum;
17. invalid algorithm;
18. expired token;
19. workload indevido;
20. CORS;
21. security headers;
22. secret sentinel;
23. DLQ sanitization;
24. CI gate;
25. evidence.

Não execute carga.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 691 e ponte para a aula 693 foram preservadas;
- Contract Test Strategy foi criada;
- Security Final Test Strategy foi criada;
- profile Maven foi criado;
- artifacts aprovados e gerados foram separados;
- OpenAPI Governance Policy foi criada;
- OpenAPI foi gerada do runtime;
- documento foi normalizado;
- snapshot contract test foi criado;
- mudanças incompatíveis foram definidas;
- mudanças compatíveis foram definidas;
- request examples foram validados;
- response examples foram validados;
- Problem Details foi validado;
- headers foram validados;
- Content-Type foi validado;
- campos desconhecidos foram tratados;
- HTTP Compatibility Policy foi criada;
- versão anterior foi testada;
- enum desconhecido foi testado;
- paginação foi testada;
- Provider Contract Final Policy foi criada;
- fixtures de estoque foram criadas;
- Stock Provider foi validado;
- Payment Provider foi validado;
- Fulfillment Provider foi validado;
- contract drift foi testado;
- workload authentication foi validada;
- Message Schema Governance foi criada;
- JSON schemas foram criados;
- MessageMetadata foi validado;
- schema contract test foi criado;
- backward compatibility foi testada;
- breaking changes foram testadas;
- upcasters foram testados;
- dados sensíveis foram testados;
- tamanho de mensagem foi validado;
- JWT Validation Matrix foi criada;
- token válido foi testado;
- algoritmo inválido foi testado;
- `kid` desconhecido foi testado;
- rotação de chave foi testada;
- clock skew foi testado;
- Authorization Final Matrix foi criada;
- registro foi autorizado;
- consulta foi autorizada;
- cancelamento foi autorizado;
- reconciliação foi autorizada;
- endpoints internos foram protegidos;
- workload em endpoint de usuário foi testado;
- negação antes do caso de uso foi testada;
- Tenant Isolation Final Policy foi criada;
- IDOR Test Policy foi criada;
- leitura cross-tenant foi testada;
- comando cross-tenant foi testado;
- tenant mismatch foi testado;
- mass assignment foi testado;
- paginação maliciosa foi testada;
- Security Header Policy foi criada;
- CORS foi testado;
- CSRF policy foi testada;
- métodos não suportados foram testados;
- media type incorreto foi testado;
- body excessivo foi testado;
- Secret Leak Test Policy foi criada;
- SecretLeakSecurityTest foi criado;
- erro de provider foi sanitizado;
- DLQ foi sanitizada;
- métricas foram protegidas;
- OpenAPI examples foram protegidos;
- Security Regression Suite foi criada;
- contract diff report foi criado;
- security report foi criado;
- CI foi integrado;
- processo de breaking change foi criado;
- snapshot não é atualizado automaticamente;
- Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 693 foi criado;
- contratos HTTP foram executados;
- providers foram executados;
- schemas foram executados;
- segurança final foi executada;
- suíte completa foi executada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- performance e carga não foram antecipadas.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pcontract-security-tests
```

Adicione:

```powershell
git add `
  testing/contracts-security `
  apps/orderflow-api/src/test `
  apps/integration-gateway/src/test `
  libs/orderflow-contracts/src/test `
  docs/testing/contract-security `
  reports/contract-security-final-report.yaml `
  contracts/contract-security-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|realTenant|realCustomer|k6 run|Gatling"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "test(contract-security): close OrderFlow external guarantees"
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
- tenant real;
- payload real de cliente;
- scripts de carga;
- conteúdo detalhado da aula 693.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu os testes de contrato e segurança do OrderFlow.

Você criou:

```text
OpenAPI governance;

HTTP compatibility tests;

request and response contracts;

Problem Details contracts;

provider contracts;

message schemas;

backward compatibility;

JWT validation matrix;

authorization matrix;

tenant isolation;

IDOR tests;

mass assignment tests;

security headers;

CORS and CSRF policy;

secret leak tests;

security regression suite;

reports, evidence e gate.
```

O projeto agora possui garantias externas verificáveis e segurança testada por comportamento.

A próxima aula será:

```text
693 - M20.23 - Performance e carga basica final
```

Nela, você medirá a capacidade básica do OrderFlow, incluindo latência, throughput, concorrência, ramp-up, steady load, backlog, consumer lag, resource usage e limites iniciais.

Nenhuma campanha de carga foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei OpenAPI.
- [ ] Validei compatibilidade HTTP.
- [ ] Validei providers.
- [ ] Validei schemas de mensagens.
- [ ] Validei JWT.
- [ ] Validei scopes e roles.
- [ ] Validei tenant isolation.
- [ ] Validei IDOR.
- [ ] Validei mass assignment.
- [ ] Validei headers e CORS.
- [ ] Validei ausência de secrets.
- [ ] Preservei performance para a aula 693.

---

## Troubleshooting adicional

### OpenAPI diff acusa ordem

Normalize apenas elementos não semânticos.

### Snapshot mudou intencionalmente

Gere artifact candidato e solicite revisão.

### Provider contract falha

Verifique fixture, mapper e versão.

### Schema antigo não valida

Revise upcaster e compatibilidade suportada.

### Token válido retorna `401`

Revise issuer, audience, algoritmo e chave.

### Usuário sem scope recebe acesso

Revise policy e method security.

### Cross-tenant retorna `403`

Use `404` para recurso invisível.

### Tenant do body altera command

Remova o campo ou rejeite mass assignment.

### Sentinel aparece no log

Corrija sanitizer e boundary de logging.

### Quero executar k6

Essa etapa pertence à aula 693.

---

## Perguntas de revisão

1. Contrato é somente documentação?
2. O que baseline aprovada representa?
3. Snapshot deve atualizar sozinho?
4. O que é breaking change?
5. Campo opcional novo é sempre compatível?
6. O que provider contract valida?
7. Por que versionar message type?
8. O que backward compatibility prova?
9. O que upcaster faz?
10. Qual algoritmo JWT aceitar?
11. Por que validar audience?
12. O que `kid` identifica?
13. Scope substitui role?
14. Role substitui scope?
15. Como tratar cross-tenant?
16. O que é IDOR?
17. O que é mass assignment?
18. Tenant pode vir do body?
19. O que `401` significa?
20. O que `403` significa?
21. Onde procurar secret leak?
22. O que a aula 693 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não, é executável.
2. Contrato revisado.
3. Não.
4. Mudança incompatível.
5. Depende do consumer.
6. Request, response e semântica.
7. Para distinguir versões.
8. Consumer atual lê contrato suportado.
9. Converte versão antiga.
10. Somente o permitido pela policy.
11. Validar destino do token.
12. Chave de assinatura.
13. Não.
14. Não.
15. `404`.
16. Acesso por identificador de outro contexto.
17. Sobrescrever campos internos.
18. Não.
19. Identidade ausente ou inválida.
20. Identidade válida sem permissão.
21. HTTP, logs, traces, metrics, DLQ e reports.
22. Performance e carga básica.
23. Campanha de carga.
24. Performance e carga básica final.
25. Compatibilidade e deny by default.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 692 - M20.22 - Testes contrato e seguranca final

- Continuei após Testes integração projeto final.
- Criei Contract Test Strategy.
- Criei Security Final Test Strategy.
- Criei profile contract-security-tests.
- Separei baseline aprovada e documento gerado.
- Criei OpenAPI Governance Policy.
- Gerei OpenAPI do runtime.
- Normalizei o documento.
- Criei OpenApiSnapshotContractTest.
- Defini mudanças incompatíveis.
- Defini mudanças compatíveis.
- Validei request examples.
- Validei response examples.
- Validei Problem Details.
- Validei headers.
- Validei Content-Type.
- Tratei campos desconhecidos.
- Criei HTTP Compatibility Policy.
- Testei client v1.
- Testei enum desconhecido.
- Testei paginação.
- Criei Provider Contract Final Policy.
- Criei fixtures de Stock.
- Validei Stock Provider.
- Validei Payment Provider.
- Validei Fulfillment Provider.
- Testei contract drift.
- Validei workload authentication.
- Criei Message Schema Governance.
- Criei JSON schemas.
- Validei MessageMetadata.
- Criei MessageSchemaContractTest.
- Testei backward compatibility.
- Testei breaking changes.
- Testei upcasters.
- Testei dados sensíveis.
- Validei tamanho de mensagem.
- Criei JWT Validation Matrix.
- Testei token válido.
- Testei algoritmo inválido.
- Testei `kid` desconhecido.
- Testei rotação de chave.
- Testei clock skew.
- Criei Authorization Final Matrix.
- Testei registro.
- Testei consulta.
- Testei cancelamento.
- Testei reconciliação.
- Protegi endpoints internos.
- Testei workload em endpoint de usuário.
- Testei negação antes do caso de uso.
- Criei Tenant Isolation Final Policy.
- Criei IDOR Test Policy.
- Testei leitura cross-tenant.
- Testei comando cross-tenant.
- Testei tenant mismatch.
- Testei mass assignment.
- Testei paginação maliciosa.
- Criei Security Header Policy.
- Testei CORS.
- Testei CSRF policy.
- Testei métodos não suportados.
- Testei media type.
- Testei limite de body.
- Criei Secret Leak Test Policy.
- Criei SecretLeakSecurityTest.
- Sanitizei erro de provider.
- Sanitizei DLQ.
- Protegi labels de métricas.
- Protegi examples.
- Criei Security Regression Suite.
- Criei contract diff report.
- Criei security report.
- Integrei ao CI.
- Criei processo de breaking change.
- Impedi atualização automática do snapshot.
- Criei Contract Security Test Matrix.
- Criei Contract Security Risk Register.
- Criei Contract Security Traceability.
- Criei boundary para a aula 693.
- Executei contratos HTTP.
- Executei contratos de providers.
- Executei schemas.
- Executei segurança final.
- Executei suíte completa.
- Criei report, evidence e gate.
- Não antecipei performance e carga.
- Próxima aula: Performance e carga basica final.
```

---

## Referência técnica curta

- OpenAPI Contract Test.
- Snapshot Contract.
- Backward Compatibility.
- Breaking Change.
- JSON Schema.
- Provider Contract.
- Message Schema.
- Upcaster.
- JWT.
- Issuer.
- Audience.
- Key Rotation.
- Scope.
- Role.
- Tenant Isolation.
- IDOR.
- Mass Assignment.
- CORS.
- CSRF.
- Secret Leak Test.
- Security Regression.

Regra final:

```text
A validação final de contratos e segurança do OrderFlow deve comparar o contrato executado com baselines revisadas e negar acesso por padrão: OpenAPI é gerada do runtime, normalizada e comparada com a versão aprovada, mudanças de path, método, campo obrigatório, tipo, enum, status ou header são classificadas e breaking changes exigem nova versão e aprovação, requests, responses, Problem Details, content types, headers, examples e paginação validam schemas executáveis, Stock, Payment e Fulfillment contracts comprovam método, path, workload token, idempotency key, correlation, body, responses, errors, timeout e drift, message contracts usam types versionados, JSON schemas imutáveis, examples, compatibility tests, upcasters, size limits e sensitive data checks, JWT tests cobrem assinatura, issuer, audience, exp, nbf, subject, tenant, token type, algoritmo permitido, kid, key rotation e clock skew, authorization matrix combina scope e role e protege user e workload endpoints, tenant vem da claim, header divergente retorna 403, cross-tenant retorna 404 e body ou query não substitui tenant, IDOR, mass assignment, CORS, CSRF policy, media type, body limit e security headers são testados, sentinelas comprovam zero leak em HTTP, logs, traces, metrics, DLQ, reports e examples, regressões entram no CI e snapshots não são aceitos automaticamente; o gate termina com OpenAPI, HTTP, providers, messages, JWT, authorization, tenant isolation, IDOR, secret leakage, reports e evidence aprovados, enquanto latency percentiles, throughput, concurrency, ramp-up, steady load, stress, resource usage, backlog, consumer lag e capacity conclusions permanecem reservados para a aula 693.
```
