# 694 - M20.24 - Documentacao OpenAPI

## Apresentação da aula

Na aula 693, você mediu a performance e a carga básica do OrderFlow.

O projeto passou a possuir:

- baseline de latência;
- percentis `p50`, `p95` e `p99`;
- throughput;
- ramp-up;
- steady load;
- burst;
- recovery;
- testes concorrentes de idempotência;
- medição da jornada assíncrona;
- observação de CPU;
- observação de memória;
- observação de PostgreSQL;
- observação de Kafka;
- controle de Outbox;
- consumer lag;
- projection freshness;
- capacidade segura inicial;
- reports, evidence e gate.

Agora o sistema possui implementação, segurança, testes, deploy e capacidade básica medidos.

Nesta aula, você transformará o contrato OpenAPI validado na aula 692 em uma documentação profissional para consumidores da API.

O objetivo não é apenas disponibilizar o endpoint:

```text
/v3/api-docs.
```

Uma documentação útil precisa permitir que outra pessoa entenda:

- o propósito da API;
- quem pode utilizá-la;
- como obter autenticação;
- quais scopes são exigidos;
- como o tenant é definido;
- como gerar uma idempotency key;
- como enviar correlation ID;
- quais recursos existem;
- como registrar um pedido;
- como consultar estado e histórico;
- como solicitar estoque;
- como solicitar pagamento;
- como iniciar fulfillment;
- como cancelar;
- como reconciliar;
- quais erros podem ocorrer;
- como interpretar `401`, `403`, `404` e `409`;
- como tratar `202 Accepted`;
- como lidar com eventual consistency;
- como versionar integrações;
- como testar sem conhecer o código interno.

A OpenAPI já foi validada como contrato na aula 692.

Nesta aula, ela ganhará:

- metadados profissionais;
- descrição do domínio;
- agrupamento por recursos;
- guia de autenticação;
- guia de autorização;
- headers reutilizáveis;
- modelos de idempotência;
- exemplos de request e response;
- catálogo de erros;
- Problem Details;
- paginação;
- versionamento;
- depreciação;
- links entre operações;
- exemplos de fluxo;
- publicação local;
- publicação estática;
- quality gate documental;
- governança;
- evidence.

A documentação será construída sem inventar endpoints.

Ela deve refletir somente o contrato real implementado no OrderFlow.

O laboratório será:

```text
labs/m20/aula-694-documentacao-openapi/orderflow-api-documentation
```

A próxima aula será:

```text
695 - M20.25 - Postman Collection
```

Na aula 695, o contrato documentado será transformado em uma coleção executável do Postman com environments, autenticação, variáveis, scripts, asserts, fluxo idempotente e exemplos de jornada.

Nesta aula, nenhuma collection final do Postman será criada.

Regra central:

```text
documentacao de API
nao repete annotations;

ela traduz o contrato
em uma experiencia
clara,
executavel,
versionada
e confiavel
para quem integra.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
691:
Testes integracao projeto final.

692:
Testes contrato e seguranca final.

693:
Performance e carga basica final.

694:
Documentacao OpenAPI.

695:
Postman Collection.

696:
Guia de execucao local.
```

A OpenAPI já existe no runtime e já possui testes de compatibilidade.

A aula 694 trabalha sobre essa fonte da verdade.

Não será criada uma segunda especificação manual desconectada do código.

A estratégia será:

```text
runtime gera contrato;

testes validam contrato;

documentacao enriquece contrato;

publicacao entrega contrato;

consumidores usam o mesmo artefato.
```

A documentação precisa continuar alinhada com:

- controllers;
- DTOs;
- Bean Validation;
- Spring Security;
- Problem Details;
- scopes;
- roles;
- tenant isolation;
- idempotência;
- status HTTP;
- eventual consistency;
- paginação;
- schemas;
- examples.

Uma mudança incompatível continua sendo controlada pela baseline e pelos testes da aula 692.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/api
├── README.md
├── OPENAPI_DOCUMENTATION_CHARTER.md
├── API_OVERVIEW.md
├── AUTHENTICATION_GUIDE.md
├── AUTHORIZATION_GUIDE.md
├── TENANT_CONTEXT_GUIDE.md
├── IDEMPOTENCY_GUIDE.md
├── CORRELATION_GUIDE.md
├── ASYNC_PROCESSING_GUIDE.md
├── PAGINATION_GUIDE.md
├── ERROR_CATALOG.md
├── VERSIONING_POLICY.md
├── DEPRECATION_POLICY.md
├── EXAMPLE_GOVERNANCE.md
├── PUBLICATION_POLICY.md
├── CONSUMER_QUICKSTART.md
├── OPENAPI_DOCUMENTATION_MATRIX.md
├── OPENAPI_DOCUMENTATION_RISK_REGISTER.md
├── OPENAPI_DOCUMENTATION_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Na aplicação:

```text
apps/orderflow-api/src/main/java
└── br/com/formacao/orderflow/api/documentation
    ├── OpenApiDocumentationConfiguration.java
    ├── OpenApiOperationCustomizer.java
    ├── OpenApiSchemaCustomizer.java
    ├── OpenApiSecurityCustomizer.java
    ├── OpenApiProblemDetailsCustomizer.java
    ├── OpenApiExampleCatalog.java
    └── OpenApiTagCatalog.java
```

Resources:

```text
apps/orderflow-api/src/main/resources
└── OpenAPI
    ├── examples
    │   ├── register-order-request.json
    │   ├── register-order-response.json
    │   ├── order-response.json
    │   ├── order-history-response.json
    │   ├── cancellation-request.json
    │   ├── reconciliation-request.json
    │   ├── validation-problem.json
    │   ├── authentication-problem.json
    │   ├── authorization-problem.json
    │   ├── not-found-problem.json
    │   └── conflict-problem.json
    └── descriptions
        ├── register-order.md
        ├── query-order.md
        ├── request-stock.md
        ├── request-payment.md
        ├── request-fulfillment.md
        ├── cancel-order.md
        └── reconcile-order.md
```

Artefatos gerados:

```text
artifacts/OpenAPI
├── orderflow-OpenAPI.json
├── orderflow-OpenAPI.yaml
├── orderflow-OpenAPI-checksum.txt
├── orderflow-OpenAPI-docs.html
└── evidence
```

---

## Conceito essencial

### Especificação e documentação não são sinônimos

A especificação descreve formalmente:

- paths;
- methods;
- schemas;
- parameters;
- responses;
- security.

A documentação adiciona contexto:

- propósito;
- decisão;
- exemplo;
- fluxo;
- erro comum;
- limitação;
- expectativa operacional.

### A documentação precisa de audiência

Existem consumidores diferentes:

```text
desenvolvedor de client;

QA;

analista de integracao;

operador;

arquiteto;

avaliador tecnico.
```

A documentação deve servir ao consumidor sem expor detalhes internos desnecessários.

### Example é parte do contrato de aprendizado

Um example ruim pode ensinar uso incorreto mesmo quando o schema está correto.

Examples precisam:

- validar;
- representar fluxo real;
- usar dados sintéticos;
- evitar secrets;
- evitar campos internos;
- demonstrar headers;
- respeitar tenant;
- mostrar status e erros.

### `202 Accepted` precisa de explicação

O consumidor precisa entender que:

```text
aceito
nao significa
concluido.
```

A jornada pode continuar de forma assíncrona.

### Segurança precisa aparecer na documentação

Não basta colocar um cadeado no Swagger UI.

É necessário explicar:

- issuer;
- audience;
- bearer token;
- scopes;
- roles;
- token de usuário;
- workload identity;
- tenant claim;
- respostas de negação.

---

## Mão na massa guiada

### 1. Criar OpenAPI Documentation Charter

Arquivo:

```text
docs/api/OPENAPI_DOCUMENTATION_CHARTER.md
```

Princípios:

```text
runtime is the contract source;

documentation adds consumer context;

examples are executable;

security is explicit;

tenant is claim-derived;

errors use Problem Details;

async behavior is explained;

breaking changes require governance;

Postman belongs to lesson 695.
```

---

### 2. Criar API Overview

Arquivo:

```text
docs/api/API_OVERVIEW.md
```

Inclua:

- objetivo do OrderFlow;
- principais recursos;
- modelo assíncrono;
- consistência;
- autenticação;
- versionamento;
- ambientes;
- suporte;
- limitações conhecidas.

---

### 3. Configurar metadados da OpenAPI

```java
package br.com.formacao.orderflow.api.documentation;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.Info;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiDocumentationConfiguration {

    @Bean
    OpenAPI orderFlowOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("OrderFlow API")
                        .version("v1")
                        .description(
                                "API para orquestracao "
                                        + "da jornada de pedidos.")
                        .termsOfService(
                                "Uso educacional e demonstrativo."))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Ambiente local"),
                        new Server()
                                .url("https://api.hml.example")
                                .description(
                                        "Referencia de homologacao")))
                .externalDocs(
                        new ExternalDocumentation()
                                .description(
                                        "Guia de integracao OrderFlow")
                                .url(
                                        "https://docs.example/orderflow"));
    }
}
```

URLs de exemplo precisam ser claramente identificadas como referência.

---

### 4. Evitar dados corporativos inventados

Não coloque:

- empresa real;
- e-mail real;
- endpoint de produção;
- telefone real;
- SLA não aprovado;
- termos jurídicos falsos.

Use referências neutras e declaradas como exemplo.

---

### 5. Criar catálogo de tags

Tags:

```text
Orders;

Order Operations;

Cancellations;

Reconciliation;

History;

Platform.
```

Cada tag possui descrição orientada ao consumidor.

---

### 6. Ordenar operações

Defina ordenação lógica:

1. registrar pedido;
2. consultar pedido;
3. consultar histórico;
4. solicitar reserva de estoque;
5. solicitar autorização de pagamento;
6. solicitar fulfillment;
7. cancelar;
8. reconciliar.

A ordem deve acompanhar a jornada.

---

### 7. Criar OpenApiTagCatalog

```java
package br.com.formacao.orderflow.api.documentation;

import io.swagger.v3.oas.models.tags.Tag;
import java.util.List;

public final class OpenApiTagCatalog {

    public List<Tag> tags() {
        return List.of(
                new Tag()
                        .name("Orders")
                        .description(
                                "Registro e consulta de pedidos."),
                new Tag()
                        .name("Order Operations")
                        .description(
                                "Operacoes assincronas da jornada."),
                new Tag()
                        .name("Cancellations")
                        .description(
                                "Solicitacao de cancelamento."),
                new Tag()
                        .name("Reconciliation")
                        .description(
                                "Tratamento controlado "
                                        + "de resultados ambiguos."));
    }
}
```

---

## Autenticação e autorização

### 8. Criar Authentication Guide

Arquivo:

```text
docs/api/AUTHENTICATION_GUIDE.md
```

Explique:

- OAuth2 Resource Server;
- bearer token;
- issuer;
- audience;
- validade;
- rotação de chave;
- obtenção de token no ambiente permitido;
- ausência de token em logs;
- diferença entre usuário e workload.

---

### 9. Documentar security scheme

```java
package br.com.formacao.orderflow.api.documentation;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;

public final class OpenApiSecurityCustomizer {

    public void customize(
            Components components) {

        components.addSecuritySchemes(
                "bearerAuth",
                new SecurityScheme()
                        .type(
                                SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description(
                                "JWT emitido por issuer confiavel "
                                        + "para a audience "
                                        + "orderflow-api."));
    }
}
```

---

### 10. Criar Authorization Guide

Arquivo:

```text
docs/api/AUTHORIZATION_GUIDE.md
```

Matriz resumida:

```text
POST /v1/orders
orders:write.

GET /v1/orders/{id}
orders:read.

GET /v1/orders/{id}/history
orders:read.

POST .../cancellation
orders:cancel.

POST .../reconciliation
orders:reconcile.
```

Explique que scopes e roles atuam juntos conforme policy.

---

### 11. Documentar respostas de segurança

Para endpoints protegidos:

```text
401:
token ausente ou invalido.

403:
identidade valida sem permissao
ou tenant mismatch.

404:
recurso invisivel no tenant autenticado.
```

---

### 12. Criar Tenant Context Guide

Arquivo:

```text
docs/api/TENANT_CONTEXT_GUIDE.md
```

Explique:

- tenant vem da claim validada;
- body não escolhe tenant;
- query não escolhe tenant;
- header opcional não substitui claim;
- divergência retorna `403`;
- recurso cross-tenant retorna `404`.

---

### 13. Não documentar `X-Tenant-Id` como autoridade

Quando o header existir apenas para confirmação ou transição, a descrição precisa dizer:

```text
nao define o tenant efetivo.
```

---

## Headers reutilizáveis

### 14. Documentar `Idempotency-Key`

Explique:

- obrigatório em comandos críticos;
- valor estável por intenção;
- mesmo body produz replay;
- body diferente gera conflito;
- não reutilizar entre intenções;
- tamanho e formato aceitos.

---

### 15. Criar Idempotency Guide

Arquivo:

```text
docs/api/IDEMPOTENCY_GUIDE.md
```

Fluxo:

```text
primeira chamada:
201.

mesma key e mesmo body:
201 com replayed true.

mesma key e body diferente:
409 IDEMPOTENCY_CONFLICT.

key em processamento:
409 ou resposta definida pela policy.
```

---

### 16. Documentar `X-Correlation-Id`

Explique:

- pode ser enviado pelo client;
- deve ser opaco;
- não contém dado pessoal;
- server gera quando ausente;
- response devolve valor efetivo;
- é usado em suporte;
- não substitui trace ID.

---

### 17. Criar Correlation Guide

Arquivo:

```text
docs/api/CORRELATION_GUIDE.md
```

Inclua exemplos seguros e regras de tamanho.

---

### 18. Criar components de headers

Components:

- `IdempotencyKey`;
- `CorrelationIdRequest`;
- `CorrelationIdResponse`;
- `Location`;
- `RetryAfter` quando aplicável.

Evite copiar descrição em todos os endpoints.

---

## Recursos e operações

### 19. Documentar registro de pedido

Endpoint:

```text
POST /v1/orders.
```

Descrição precisa explicar:

- intenção;
- pré-condições;
- idempotência;
- tenant;
- status `201`;
- Location;
- replay;
- erros;
- início da jornada.

---

### 20. Criar descrição detalhada do registro

Arquivo:

```text
OpenAPI/descriptions/register-order.md
```

Conteúdo:

- propósito;
- validação;
- processamento;
- idempotência;
- resposta;
- exemplos;
- próximos passos;
- troubleshooting.

---

### 21. Criar example de request

```json
{
  "externalReference": "WEB-2026-000145",
  "lines": [
    {
      "productCode": "SKU-001",
      "quantity": 2,
      "unitPrice": {
        "amount": 149.90,
        "currency": "BRL"
      }
    }
  ]
}
```

Não inclua:

- tenant;
- status;
- version;
- total calculado;
- operation ID interno.

---

### 22. Criar example de response

```json
{
  "orderId": "018f6fd5-9d4a-7d6e-a71f-4a71b2890b9b",
  "status": "REGISTERED",
  "replayed": false,
  "createdAt": "2026-07-15T20:00:00Z"
}
```

O UUID e a data são dados sintéticos.

---

### 23. Documentar consulta de pedido

Endpoint:

```text
GET /v1/orders/{orderId}.
```

Explique:

- read model;
- eventual consistency;
- tenant isolation;
- versão;
- estado atual;
- timestamps;
- operações externas resumidas.

---

### 24. Documentar histórico

Explique:

- ordem cronológica;
- eventos de negócio;
- auditoria;
- correlation;
- ausência de segredo;
- paginação quando existir;
- diferença entre histórico e logs.

---

### 25. Documentar solicitação de estoque

Endpoint:

```text
POST /v1/orders/{orderId}/stock-reservation.
```

Explique:

- operação assíncrona;
- idempotency key;
- `202 Accepted`;
- estado esperado;
- consulta posterior;
- resultados `SUCCESS`, `REJECTED` e `AMBIGUOUS`.

---

### 26. Documentar autorização de pagamento

Explique:

- pré-condição de estoque;
- operação assíncrona;
- recusa funcional;
- indisponibilidade técnica;
- resultado ambíguo;
- compensação possível.

---

### 27. Documentar fulfillment

Explique:

- pré-condição de pagamento;
- início;
- conclusão posterior;
- cancelabilidade;
- irreversibilidade;
- consulta do estado.

---

### 28. Documentar cancelamento

Inclua:

- scope;
- motivo;
- elegibilidade;
- compensações;
- `202`;
- `409` quando transição não permitida;
- idempotência;
- consulta posterior.

---

### 29. Criar cancellation example

```json
{
  "reason": "CUSTOMER_REQUEST",
  "description": "Solicitacao registrada pelo canal digital."
}
```

Use enum real do projeto.

---

### 30. Documentar reconciliação

Explique:

- quando usar;
- quem pode usar;
- scope restrito;
- resultado ambíguo;
- operation ID;
- audit;
- risco de duplicidade;
- não utilizar como retry manual genérico.

---

### 31. Criar reconciliation example

```json
{
  "provider": "PAYMENT",
  "operationId": "PAY-OP-000142",
  "reason": "TIMEOUT_WITH_UNKNOWN_RESULT"
}
```

---

## Processamento assíncrono

### 32. Criar Async Processing Guide

Arquivo:

```text
docs/api/ASYNC_PROCESSING_GUIDE.md
```

Explique o fluxo:

```text
request;

202 Accepted;

Outbox;

Kafka;

provider;

resultado;

aggregate;

projection;

consulta.
```

---

### 33. Definir estados observáveis

Documente estados relevantes sem expor detalhes internos desnecessários.

Exemplo:

- `REGISTERED`;
- `STOCK_PENDING`;
- `STOCK_RESERVED`;
- `PAYMENT_PENDING`;
- `PAYMENT_AUTHORIZED`;
- `FULFILLMENT_PENDING`;
- `COMPLETED`;
- `COMPENSATING`;
- `CANCELLED`;
- `RECONCILIATION_PENDING`.

Use somente enums reais.

---

### 34. Explicar polling

O consumidor deve:

- respeitar intervalo;
- usar timeout;
- parar em estado terminal;
- registrar correlation;
- evitar polling agressivo;
- considerar `Retry-After` quando documentado.

---

### 35. Explicar eventual consistency

Diga explicitamente:

```text
a resposta de comando
pode preceder
a atualizacao do read model.
```

---

### 36. Criar exemplo de jornada

Fluxo:

1. registrar pedido;
2. solicitar estoque;
3. consultar;
4. solicitar pagamento;
5. consultar;
6. solicitar fulfillment;
7. consultar estado terminal.

A execução prática será formalizada no Postman na aula 695.

---

## Schemas

### 37. Revisar nomes de schemas

Bom:

```text
RegisterOrderRequest;

RegisterOrderResponse;

OrderResponse;

OrderHistoryResponse;

RequestCancellationRequest;

ReconciliationRequest;

ProblemDetails.
```

Ruim:

```text
DTO1;

ResponseDTO;

Object.
```

---

### 38. Adicionar descrições de propriedades

Cada campo precisa explicar:

- significado;
- formato;
- unidade;
- origem;
- obrigatoriedade;
- exemplo;
- restrição.

---

### 39. Documentar dinheiro

Explique:

- decimal;
- currency ISO 4217;
- escala;
- ausência de float binário no contrato;
- total calculado pelo server.

---

### 40. Documentar identificadores

Diferencie:

- order ID;
- external reference;
- operation ID;
- message ID;
- correlation ID;
- idempotency key.

---

### 41. Documentar datas

Use:

```text
ISO 8601;

UTC;

offset explicito.
```

Exemplo:

```text
2026-07-15T20:00:00Z.
```

---

### 42. Documentar enums

Cada enum precisa de:

- descrição;
- valores;
- semântica;
- compatibilidade;
- orientação para valor desconhecido quando aplicável.

---

### 43. Evitar expor entity

Valide que schemas não contêm:

- JPA version interna sem intenção;
- lazy proxies;
- chaves técnicas;
- audit columns;
- secret;
- provider raw payload.

---

## Erros e Problem Details

### 44. Criar Error Catalog

Arquivo:

```text
docs/api/ERROR_CATALOG.md
```

Categorias:

- validation;
- malformed JSON;
- authentication;
- authorization;
- not found;
- idempotency conflict;
- transition conflict;
- concurrency conflict;
- rate limit;
- internal error.

---

### 45. Documentar `400`

Exemplos:

- campo obrigatório;
- quantidade inválida;
- currency inválida;
- JSON malformado;
- enum inválido;
- campo desconhecido conforme policy.

---

### 46. Documentar `401`

Não revele detalhes de validação sensíveis.

Mensagem segura:

```text
Authentication is required
or the token is invalid.
```

---

### 47. Documentar `403`

Cenários:

- scope ausente;
- role ausente;
- workload indevido;
- tenant mismatch.

---

### 48. Documentar `404`

Use para:

- pedido inexistente;
- pedido fora do tenant;
- histórico invisível.

Não diferencie cross-tenant no detail.

---

### 49. Documentar `409`

Códigos:

- `IDEMPOTENCY_CONFLICT`;
- `IDEMPOTENCY_IN_PROGRESS`;
- `INVALID_TRANSITION`;
- `CONCURRENCY_CONFLICT`;
- `DUPLICATE_EXTERNAL_RESULT`.

Inclua orientação de recuperação.

---

### 50. Documentar `429`

Quando aplicável:

- limite;
- `Retry-After`;
- backoff;
- evitar retry sincronizado;
- preservar idempotency key.

---

### 51. Documentar `500`

A resposta não contém:

- stack trace;
- SQL;
- token;
- internal class;
- provider body.

Use correlation ID para suporte.

---

### 52. Criar examples de Problem Details

Cada example precisa validar contra o mesmo schema.

---

## Paginação e filtros

### 53. Criar Pagination Guide

Arquivo:

```text
docs/api/PAGINATION_GUIDE.md
```

Explique:

- page inicial;
- size default;
- size máximo;
- sort permitido;
- estabilidade;
- filtros;
- metadata;
- links quando disponíveis.

---

### 54. Documentar limites

Evite consulta sem limite.

Exemplo:

```text
default size:
20.

maximum size:
100.
```

Use os valores reais do projeto.

---

### 55. Documentar ordenação

Liste campos permitidos.

Não permita sort arbitrário por coluna interna.

---

### 56. Documentar filtros

Filtros não podem incluir tenant selecionado pelo consumidor.

O tenant continua vindo da identidade.

---

## Versionamento e depreciação

### 57. Criar Versioning Policy

Arquivo:

```text
docs/api/VERSIONING_POLICY.md
```

Defina:

- versão no path;
- compatibilidade;
- breaking changes;
- schema evolution;
- suporte;
- comunicação;
- publicação.

---

### 58. Criar Deprecation Policy

Arquivo:

```text
docs/api/DEPRECATION_POLICY.md
```

Uma depreciação precisa de:

- operação;
- motivo;
- alternativa;
- data de anúncio;
- data mínima de remoção;
- consumers conhecidos;
- evidence de migração.

---

### 59. Documentar headers de depreciação

Quando usados:

- `Deprecation`;
- `Sunset`;
- `Link`.

Não adicione sem policy operacional.

---

### 60. Criar changelog da API

Registre:

- versão;
- data;
- mudança;
- compatibilidade;
- migration necessária;
- owner.

---

## Examples e governança

### 61. Criar Example Governance

Arquivo:

```text
docs/api/EXAMPLE_GOVERNANCE.md
```

Regras:

- example valida;
- data sintética;
- sem secret;
- sem tenant real;
- sem endpoint real;
- atualizado com schema;
- owner;
- testado no CI.

---

### 62. Criar OpenApiExampleCatalog

```java
package br.com.formacao.orderflow.api.documentation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;

public final class OpenApiExampleCatalog {

    private final ObjectMapper objectMapper;

    public OpenApiExampleCatalog(
            ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;
    }

    public JsonNode read(
            String resource) {

        try (InputStream input =
                     getClass()
                             .getResourceAsStream(
                                     resource)) {

            if (input == null) {
                throw new IllegalArgumentException(
                        "Example not found: "
                                + resource);
            }

            return objectMapper.readTree(input);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Cannot read OpenAPI example",
                    exception);
        }
    }
}
```

---

### 63. Testar examples no CI

Valide:

- JSON;
- schema;
- Bean Validation;
- ausência de secrets;
- ausência de campos proibidos;
- compatibilidade com DTO.

---

### 64. Manter examples pequenos

Um example deve ensinar.

Não precisa reproduzir um pedido com centenas de linhas.

---

## Swagger UI e publicação

### 65. Configurar Swagger UI

Configurações:

- path conhecido;
- operations sorter;
- tags sorter;
- display request duration;
- persist authorization apenas em ambiente permitido;
- try it out controlado;
- schemas expandidos com moderação.

---

### 66. Desabilitar UI quando necessário

A exposição em produção depende de policy.

Opções:

- protegida;
- desabilitada;
- publicada como site estático separado.

Documente a decisão.

---

### 67. Criar Publication Policy

Arquivo:

```text
docs/api/PUBLICATION_POLICY.md
```

Artefatos:

- JSON;
- YAML;
- HTML estático;
- checksum;
- version;
- source commit.

---

### 68. Gerar JSON e YAML

Scripts:

```text
scripts/api-docs
├── generate-OpenAPI.ps1
├── normalize-OpenAPI.ps1
├── validate-OpenAPI.ps1
├── generate-static-docs.ps1
├── calculate-checksum.ps1
└── collect-api-docs-evidence.ps1
```

---

### 69. Gerar documentação estática

Pode usar ferramenta compatível com OpenAPI.

O HTML precisa ser gerado a partir do artifact validado.

Não edite o HTML manualmente.

---

### 70. Calcular checksum

Checksum liga:

- contrato;
- publicação;
- evidence.

Exemplo:

```powershell
Get-FileHash `
  artifacts/OpenAPI/orderflow-OpenAPI.json `
  -Algorithm SHA256
```

---

### 71. Publicar por versão

Estrutura conceitual:

```text
/docs/orderflow/v1;

/docs/orderflow/current.
```

`current` aponta para uma versão aprovada.

---

### 72. Não publicar contrato quebrado

A publicação depende de:

- contract tests;
- security tests;
- examples;
- diff;
- documentation gate.

---

## Consumer quickstart

### 73. Criar Consumer Quickstart

Arquivo:

```text
docs/api/CONSUMER_QUICKSTART.md
```

Fluxo mínimo:

1. obter token;
2. gerar correlation;
3. gerar idempotency key;
4. registrar pedido;
5. guardar Location;
6. consultar pedido;
7. tratar errors;
8. acompanhar estado.

---

### 74. Incluir exemplo cURL

```bash
curl \
  --request POST \
  --url http://localhost:8080/v1/orders \
  --header "Authorization: Bearer <token-de-teste>" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: 8b7c908f-31d2-4fc8-9f92-33f40b82c648" \
  --header "X-Correlation-Id: docs-example-0001" \
  --data @register-order-request.json
```

Não inclua token real.

---

### 75. Explicar tratamento de resposta

Client precisa:

- verificar status;
- ler Location;
- persistir order ID;
- preservar key;
- registrar correlation;
- tratar Problem Details;
- respeitar processamento assíncrono.

---

### 76. Criar troubleshooting de integração

Problemas:

- `401`;
- `403`;
- `404`;
- `409`;
- `415`;
- `429`;
- read model atrasado;
- correlation ausente;
- replay inesperado.

---

## Qualidade documental

### 77. Criar Documentation Matrix

Arquivo:

```text
docs/api/OPENAPI_DOCUMENTATION_MATRIX.md
```

Colunas:

- operação;
- summary;
- description;
- auth;
- scope;
- headers;
- request example;
- success response;
- errors;
- async note;
- owner.

---

### 78. Criar Risk Register

Arquivo:

```text
docs/api/OPENAPI_DOCUMENTATION_RISK_REGISTER.md
```

Riscos:

```text
contrato e docs divergentes;

example invalido;

secret em example;

scope ausente;

tenant mal explicado;

202 tratado como concluido;

erro sem recuperacao;

enum sem semantica;

URL real publicada;

HTML gerado de artifact antigo;

baseline atualizada sem revisao.
```

---

### 79. Criar Traceability

Arquivo:

```text
docs/api/OPENAPI_DOCUMENTATION_TRACEABILITY.md
```

Exemplo:

```text
Controller register
-> OpenAPI operation
-> request example
-> response example
-> quickstart.

Security policy
-> bearer scheme
-> scope docs
-> 401 and 403 examples.

Idempotency invariant
-> header component
-> idempotency guide
-> conflict example.

Async architecture
-> 202 response
-> async guide
-> polling guidance.
```

---

### 80. Criar boundary da próxima aula

Arquivo:

```text
docs/api/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 694 define:

- OpenAPI metadata;
- tags;
- authentication guide;
- authorization guide;
- tenant guide;
- headers;
- idempotency guide;
- correlation guide;
- operation descriptions;
- schemas;
- examples;
- Problem Details;
- pagination;
- versioning;
- deprecation;
- publication;
- consumer quickstart.

A aula 695 define:

- Postman Collection;
- environments;
- variables;
- authentication scripts;
- idempotency scripts;
- correlation scripts;
- request assertions;
- response assertions;
- workflow chaining;
- collection runner;
- CLI execution;
- Postman evidence.

Nenhuma collection final
e criada nesta aula.
```

---

## Validação e geração

### 81. Gerar OpenAPI

```powershell
.\scripts\api-docs\generate-OpenAPI.ps1
```

---

### 82. Normalizar artifact

```powershell
.\scripts\api-docs\normalize-OpenAPI.ps1
```

---

### 83. Validar contrato e examples

```powershell
.\scripts\api-docs\validate-OpenAPI.ps1
```

---

### 84. Gerar HTML

```powershell
.\scripts\api-docs\generate-static-docs.ps1
```

---

### 85. Calcular checksum

```powershell
.\scripts\api-docs\calculate-checksum.ps1
```

---

### 86. Revisar documentação como consumidor

Execute uma revisão sem olhar o código.

Tente responder:

- como autenticar?
- como registrar?
- qual key usar?
- como consultar?
- o que significa `202`?
- como tratar `409`?
- onde está o tenant?
- como pedir suporte?

Se a resposta exigir abrir o controller, a documentação está incompleta.

---

### 87. Executar link check

Valide:

- links internos;
- external docs;
- examples;
- schemas;
- anchors;
- versão publicada.

---

### 88. Executar secret scan

Procure:

- bearer token;
- client secret;
- private key;
- password;
- endpoint real;
- tenant real;
- dado pessoal.

---

### 89. Criar report

Arquivo:

```text
reports/OpenAPI-documentation-report.yaml
```

Exemplo:

```yaml
OpenAPIDocumentation:
  metadata:
    PASS

  operations:
    total:
      9
    documented:
      9

  examples:
    request:
      4
    response:
      8
    problemDetails:
      6
    invalid:
      0

  guides:
    total:
      10

  publication:
    JSON:
      PASS
    YAML:
      PASS
    HTML:
      PASS
    checksum:
      PASS

  PostmanCollection:
    completed:
      false

  gate:
    PASS
```

---

### 90. Criar evidence

Arquivo:

```text
contracts/OpenAPI-documentation-evidence.yaml
```

Campos:

- lesson;
- project;
- OpenAPI title;
- OpenAPI version;
- operation count;
- documented operation count;
- tag count;
- security scheme count;
- scope documentation status;
- tenant guide status;
- idempotency guide status;
- correlation guide status;
- async guide status;
- request example count;
- response example count;
- Problem Details example count;
- invalid example count;
- undocumented error count;
- pagination guide status;
- versioning policy status;
- deprecation policy status;
- JSON artifact status;
- YAML artifact status;
- HTML artifact status;
- checksum status;
- broken link count;
- secret leak count;
- Postman collection completed;
- documentation status;
- gate status;
- timestamp.

---

### 91. Criar gate documental

Status:

```text
PASS;

FAIL_OPENAPI_DOCUMENTATION_STRUCTURE;

FAIL_METADATA;

FAIL_TAG_CATALOG;

FAIL_AUTHENTICATION_GUIDE;

FAIL_AUTHORIZATION_GUIDE;

FAIL_TENANT_GUIDE;

FAIL_IDEMPOTENCY_GUIDE;

FAIL_CORRELATION_GUIDE;

FAIL_OPERATION_DESCRIPTION;

FAIL_REQUEST_EXAMPLE;

FAIL_RESPONSE_EXAMPLE;

FAIL_PROBLEM_DETAILS_DOCUMENTATION;

FAIL_ASYNC_GUIDE;

FAIL_SCHEMA_DESCRIPTION;

FAIL_ENUM_DOCUMENTATION;

FAIL_PAGINATION_GUIDE;

FAIL_VERSIONING_POLICY;

FAIL_DEPRECATION_POLICY;

FAIL_PUBLICATION;

FAIL_STATIC_DOCUMENTATION;

FAIL_CHECKSUM;

FAIL_BROKEN_LINK;

FAIL_SECRET_LEAK;

FAIL_CONSUMER_QUICKSTART;

FAIL_POSTMAN_ANTICIPATION;

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

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pcontract-security-tests

.\scripts\api-docs\collect-api-docs-evidence.ps1
```

Confirme:

- metadata;
- tags;
- security;
- scopes;
- tenant;
- idempotência;
- correlation;
- operações;
- schemas;
- examples;
- erros;
- async;
- paginação;
- versionamento;
- publicação;
- quickstart;
- collection Postman não criada.

---

### 93. Encerrar o laboratório

Confirme:

- Charter;
- overview;
- metadata;
- tags;
- authentication;
- authorization;
- tenant;
- headers;
- idempotency;
- correlation;
- operations;
- examples;
- schemas;
- Problem Details;
- async;
- pagination;
- versioning;
- deprecation;
- example governance;
- Swagger UI;
- publication;
- checksum;
- quickstart;
- troubleshooting;
- matrix;
- risk register;
- traceability;
- report;
- evidence;
- gate aprovado;
- Postman não implementado.

---

## Entendendo o que foi feito

### O contrato ganhou contexto

Consumers agora entendem propósito, fluxo e limitações.

### Segurança ficou explícita

Bearer token, scopes, roles e tenant foram documentados.

### Idempotência virou orientação prática

O consumidor sabe gerar, reutilizar e não reutilizar keys.

### Operações assíncronas ficaram claras

`202 Accepted` não é confundido com conclusão.

### Erros ganharam recuperação

Cada categoria explica significado e próxima ação.

### Examples viraram artifacts testados

Eles não são snippets soltos.

### A publicação ficou rastreável

JSON, YAML, HTML e checksum vêm do mesmo contrato validado.

### O projeto ficou pronto para execução assistida

A aula 695 transformará a documentação em uma collection Postman.

---

## Erros comuns importantes

### Copiar annotation como documentação

O consumidor continua sem contexto.

### Esconder autenticação

A primeira chamada falha sem orientação.

### Usar token real no example

A documentação vira vazamento.

### Colocar tenant no body

A documentação ensina uma falha de segurança.

### Tratar `202` como sucesso terminal

A integração fica inconsistente.

### Não explicar `409`

Clients criam retries incorretos.

### Example não validado

O consumidor copia payload inválido.

### Publicar HTML antigo

Docs divergem do runtime.

### Atualizar baseline sem revisão

Breaking change pode passar.

### Criar Postman agora

A collection pertence à aula 695.

---

## Comandos úteis

### Gerar contrato

```powershell
.\scripts\api-docs\generate-OpenAPI.ps1
```

### Validar documentação

```powershell
.\scripts\api-docs\validate-OpenAPI.ps1
```

### Gerar HTML

```powershell
.\scripts\api-docs\generate-static-docs.ps1
```

### Validar tudo

```powershell
.\mvnw.cmd `
  clean `
  verify `
  -Pcontract-security-tests
```

---

## Exercício guiado

Documente completamente o fluxo:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. overview;
2. autenticação;
3. scope;
4. role;
5. tenant;
6. correlation;
7. idempotency key;
8. registro;
9. estoque;
10. pagamento;
11. `202`;
12. recusa funcional;
13. compensação;
14. consulta;
15. history;
16. request example;
17. response example;
18. Problem Details;
19. `409`;
20. polling;
21. estados;
22. troubleshooting;
23. cURL;
24. publication;
25. evidence.

Não crie a collection Postman final.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 693 e ponte para a aula 695 foram preservadas;
- Documentation Charter foi criado;
- API Overview foi criado;
- metadados foram configurados;
- dados corporativos inventados foram evitados;
- catálogo de tags foi criado;
- operações foram ordenadas;
- OpenApiTagCatalog foi criado;
- Authentication Guide foi criado;
- security scheme foi documentado;
- Authorization Guide foi criado;
- respostas de segurança foram documentadas;
- Tenant Context Guide foi criado;
- `X-Tenant-Id` não foi documentado como autoridade;
- `Idempotency-Key` foi documentado;
- Idempotency Guide foi criado;
- `X-Correlation-Id` foi documentado;
- Correlation Guide foi criado;
- headers reutilizáveis foram criados;
- registro foi documentado;
- descrição detalhada foi criada;
- request example foi criado;
- response example foi criado;
- consulta foi documentada;
- histórico foi documentado;
- estoque foi documentado;
- pagamento foi documentado;
- fulfillment foi documentado;
- cancelamento foi documentado;
- cancellation example foi criado;
- reconciliação foi documentada;
- reconciliation example foi criado;
- Async Processing Guide foi criado;
- estados observáveis foram documentados;
- polling foi explicado;
- eventual consistency foi explicada;
- jornada foi exemplificada;
- schemas foram nomeados;
- propriedades foram descritas;
- dinheiro foi documentado;
- identificadores foram documentados;
- datas foram documentadas;
- enums foram documentados;
- entity não foi exposta;
- Error Catalog foi criado;
- `400` foi documentado;
- `401` foi documentado;
- `403` foi documentado;
- `404` foi documentado;
- `409` foi documentado;
- `429` foi documentado;
- `500` foi documentado;
- examples de Problem Details foram criados;
- Pagination Guide foi criado;
- limites foram documentados;
- ordenação foi documentada;
- filtros foram documentados;
- Versioning Policy foi criada;
- Deprecation Policy foi criada;
- headers de depreciação foram tratados;
- changelog foi criado;
- Example Governance foi criada;
- OpenApiExampleCatalog foi criado;
- examples foram testados;
- examples foram mantidos pequenos;
- Swagger UI foi configurada;
- exposição da UI foi governada;
- Publication Policy foi criada;
- JSON e YAML foram gerados;
- HTML estático foi gerado;
- checksum foi calculado;
- publicação por versão foi definida;
- contrato quebrado não é publicado;
- Consumer Quickstart foi criado;
- cURL foi incluído;
- tratamento de resposta foi explicado;
- troubleshooting foi criado;
- Documentation Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 695 foi criado;
- OpenAPI foi gerada;
- artifact foi normalizado;
- contrato e examples foram validados;
- HTML foi gerado;
- checksum foi criado;
- revisão como consumidor foi executada;
- links foram validados;
- secret scan foi executado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- Postman Collection não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\validate-secrets.ps1

.\scripts\api-docs\validate-OpenAPI.ps1
```

Adicione:

```powershell
git add `
  apps/orderflow-api/src/main/java/br/com/formacao/orderflow/api/documentation `
  apps/orderflow-api/src/main/resources/OpenAPI `
  docs/api `
  scripts/api-docs `
  artifacts/OpenAPI `
  reports/OpenAPI-documentation-report.yaml `
  contracts/OpenAPI-documentation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|realCustomer|realTenant|productionUrl|postman_collection"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(api): publish professional OrderFlow OpenAPI"
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
- endpoint real;
- tenant real;
- informação pessoal;
- Postman Collection;
- conteúdo detalhado da aula 695.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você consolidou a documentação OpenAPI do OrderFlow.

Você criou:

```text
documentation charter;

API overview;

metadata;

tags;

authentication guide;

authorization guide;

tenant guide;

idempotency guide;

correlation guide;

operation descriptions;

request examples;

response examples;

Problem Details examples;

async processing guide;

pagination guide;

versioning policy;

deprecation policy;

example governance;

Swagger UI configuration;

JSON, YAML and HTML publication;

consumer quickstart;

reports, evidence e gate.
```

A API agora pode ser compreendida por um consumidor sem acesso ao código interno.

A próxima aula será:

```text
695 - M20.25 - Postman Collection
```

Nela, você criará uma collection executável com environments, variáveis, obtenção de token, correlation, idempotency keys, chaining de requests, asserts, cenários positivos e negativos, collection runner, Newman ou Postman CLI e evidências.

Nenhuma collection final do Postman foi criada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei overview.
- [ ] Documentei autenticação.
- [ ] Documentei autorização.
- [ ] Documentei tenant.
- [ ] Documentei idempotência.
- [ ] Documentei correlation.
- [ ] Documentei operações.
- [ ] Validei examples.
- [ ] Documentei erros.
- [ ] Documentei processamento assíncrono.
- [ ] Publiquei JSON, YAML e HTML.
- [ ] Criei quickstart.
- [ ] Preservei Postman para a aula 695.

---

## Troubleshooting adicional

### Swagger mostra endpoint sem descrição

Revise customizer, annotations e resources Markdown.

### Example não aparece

Valide resource path e schema reference.

### OpenAPI diff falha após descrição

Confirme se o normalizador preserva apenas diferenças semânticas.

### Scope não aparece

Revise security requirements da operação.

### Tenant aparece no request

Remova o campo do DTO ou documente sua rejeição.

### `202` não explica acompanhamento

Adicione guia assíncrono e link para consulta.

### Problem Details aparece como schema genérico

Registre component e responses reutilizáveis.

### HTML diverge do JSON

Gere sempre do artifact validado.

### Link externo quebra

Inclua link check no gate.

### Quero importar no Postman

Essa etapa pertence à aula 695.

---

## Perguntas de revisão

1. Especificação e documentação são iguais?
2. Qual é a fonte da verdade?
3. Por que usar tags?
4. O que security scheme documenta?
5. Tenant vem de onde?
6. Para que serve idempotency key?
7. Quando reutilizar a key?
8. Correlation substitui trace?
9. O que `202` significa?
10. Como acompanhar operação assíncrona?
11. O que Problem Details padroniza?
12. O que `401` significa?
13. O que `403` significa?
14. Por que cross-tenant usa `404`?
15. O que `409` indica?
16. Examples precisam validar?
17. Entity pode aparecer?
18. Por que documentar enums?
19. O que versioning policy define?
20. O que deprecation policy exige?
21. Para que serve checksum?
22. O que a aula 695 fará?
23. O que não foi criado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Contrato gerado do runtime.
3. Organizar recursos.
4. Como autenticar.
5. Claim validada.
6. Evitar efeito duplicado.
7. Mesma intenção e body.
8. Não.
9. Pedido aceito para processamento.
10. Consultando estado.
11. Formato de erros.
12. Identidade ausente ou inválida.
13. Sem permissão.
14. Não revelar existência.
15. Conflito.
16. Sim.
17. Não.
18. Explicar semântica.
19. Compatibilidade e mudanças.
20. Prazo e alternativa.
21. Ligar artifact e publicação.
22. Criar Postman Collection.
23. Collection final.
24. Postman Collection.
25. Docs traduzem contrato para o consumidor.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 694 - M20.24 - Documentacao OpenAPI

- Continuei após Performance e carga básica final.
- Criei OpenAPI Documentation Charter.
- Criei API Overview.
- Configurei metadados.
- Evitei dados corporativos inventados.
- Criei catálogo de tags.
- Ordenei operações.
- Criei OpenApiTagCatalog.
- Criei Authentication Guide.
- Documentei bearer JWT.
- Criei Authorization Guide.
- Documentei 401, 403 e 404.
- Criei Tenant Context Guide.
- Evitei tratar X-Tenant-Id como autoridade.
- Documentei Idempotency-Key.
- Criei Idempotency Guide.
- Documentei X-Correlation-Id.
- Criei Correlation Guide.
- Criei headers reutilizáveis.
- Documentei registro.
- Criei descrição detalhada.
- Criei request example.
- Criei response example.
- Documentei consulta.
- Documentei histórico.
- Documentei estoque.
- Documentei pagamento.
- Documentei fulfillment.
- Documentei cancelamento.
- Criei cancellation example.
- Documentei reconciliação.
- Criei reconciliation example.
- Criei Async Processing Guide.
- Documentei estados observáveis.
- Expliquei polling.
- Expliquei eventual consistency.
- Criei exemplo de jornada.
- Revisei nomes de schemas.
- Descrevi propriedades.
- Documentei dinheiro.
- Documentei identificadores.
- Documentei datas.
- Documentei enums.
- Evitei expor entities.
- Criei Error Catalog.
- Documentei 400.
- Documentei 401.
- Documentei 403.
- Documentei 404.
- Documentei 409.
- Documentei 429.
- Documentei 500.
- Criei examples de Problem Details.
- Criei Pagination Guide.
- Documentei limites.
- Documentei ordenação.
- Documentei filtros.
- Criei Versioning Policy.
- Criei Deprecation Policy.
- Tratei headers de depreciação.
- Criei changelog.
- Criei Example Governance.
- Criei OpenApiExampleCatalog.
- Testei examples no CI.
- Mantive examples pequenos.
- Configurei Swagger UI.
- Governei exposição da UI.
- Criei Publication Policy.
- Gerei JSON e YAML.
- Gerei HTML estático.
- Calculei checksum.
- Defini publicação por versão.
- Bloqueei publicação de contrato quebrado.
- Criei Consumer Quickstart.
- Incluí cURL.
- Expliquei tratamento de respostas.
- Criei troubleshooting.
- Criei Documentation Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 695.
- Gerei e normalizei OpenAPI.
- Validei contrato e examples.
- Revisei como consumidor.
- Validei links.
- Executei secret scan.
- Criei report, evidence e gate.
- Não antecipei Postman Collection.
- Próxima aula: Postman Collection.
```

---

## Referência técnica curta

- OpenAPI.
- Swagger UI.
- API Documentation.
- Security Scheme.
- Operation.
- Tag.
- Component.
- Schema.
- Example.
- Problem Details.
- Idempotency-Key.
- Correlation ID.
- Eventual Consistency.
- Pagination.
- API Versioning.
- Deprecation.
- Static Documentation.
- Checksum.
- Consumer Quickstart.

Regra final:

```text
A documentação OpenAPI final do OrderFlow deve transformar o contrato validado em uma experiência clara e versionada para consumidores: runtime continua sendo a fonte, metadata registra title, version, environments de referência e external docs, tags organizam Orders, Operations, Cancellations e Reconciliation, bearer security scheme explica JWT, issuer e audience, Authorization Guide relaciona endpoints a scopes e roles, Tenant Guide afirma que tenant vem da claim e body, query ou header não substituem identidade, Idempotency Guide explica primeira execução, replay, in progress e conflict, Correlation Guide diferencia correlation de trace, cada operação documenta propósito, pré-condições, headers, request, response, errors, status e comportamento assíncrono, schemas possuem nomes, descrições, formats, enums e examples sem entities ou dados internos, `202 Accepted` é ligado ao guia de polling e eventual consistency, Problem Details cobre 400, 401, 403, 404, 409, 429 e 500 com recuperação, paginação possui limites e sort permitido, versioning e deprecation governam mudanças, examples são pequenos, sintéticos, testados e sem secrets, Swagger UI é configurada conforme ambiente, JSON, YAML e HTML são gerados do mesmo artifact, checksum liga contrato à publicação, Consumer Quickstart permite autenticar, registrar, guardar Location, consultar e tratar erros, e o gate termina com metadata, guides, operations, schemas, examples, publication, report e evidence aprovados, enquanto environments, variáveis, scripts de token, correlation, idempotency, request chaining, assertions, collection runner e execução CLI permanecem reservados para a aula 695.
```
