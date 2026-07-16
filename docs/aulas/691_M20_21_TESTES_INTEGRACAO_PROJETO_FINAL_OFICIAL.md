# 691 - M20.21 - Testes integracao projeto final

## Apresentação da aula

Na aula 690, você aprofundou a suíte unitária do OrderFlow.

O projeto passou a possuir:

- testes de value objects;
- testes completos do aggregate;
- testes de policies;
- testes de handlers;
- fakes de repository;
- fakes de transação;
- fakes de idempotência;
- fakes de Inbox e Outbox;
- testes de mappers;
- testes unitários de segurança;
- testes unitários de observabilidade;
- cobertura com JaCoCo;
- mutation testing com PIT;
- políticas de test doubles;
- controle de testes flaky;
- reports, evidence e gate.

Esses testes provam regras isoladas.

Agora precisamos provar que as partes reais funcionam quando conectadas.

Nesta aula, você implementará a suíte de testes de integração do projeto final.

O foco será validar integrações como:

```text
Spring Boot
+ application handlers
+ persistence adapters
+ PostgreSQL
+ Flyway.
```

Também serão validados:

```text
Outbox Publisher
+ Kafka
+ consumer
+ Inbox
+ aggregate
+ projection.
```

E:

```text
Integration Gateway
+ client HTTP
+ WireMock
+ retry
+ circuit breaker
+ normalizacao.
```

A principal diferença em relação à aula anterior é:

```text
a infraestrutura real
passa a participar do teste.
```

Você utilizará:

- Spring Boot Test;
- Testcontainers;
- PostgreSQL real em container;
- Kafka real em container;
- Flyway;
- Spring Data JPA;
- transaction manager real;
- WireMock;
- Awaitility;
- MockMvc quando o contexto completo for necessário;
- Micrometer Test;
- OpenTelemetry SDK em memória;
- JUnit 5;
- AssertJ.

Os testes de integração precisam provar:

- migrations aplicam em banco vazio;
- upgrade de schema funciona;
- repositories preservam tenant;
- optimistic locking funciona;
- transaction rollback é real;
- aggregate e Outbox commitam juntos;
- Inbox deduplica realmente;
- publisher publica;
- consumers processam;
- retries não duplicam efeito;
- DLQ recebe mensagem inválida;
- provider clients respeitam timeout;
- circuit breaker abre e recupera;
- projection fica consistente;
- telemetria é emitida durante a integração;
- o contexto Spring sobe com os beans corretos.

A aula 692 será:

```text
692 - M20.22 - Testes contrato e seguranca final
```

Nela, você executará a validação final dos contratos HTTP, OpenAPI, mensagens, providers, compatibilidade de schemas, autenticação, autorização, scopes, roles, tenant isolation e proteção contra regressões de segurança.

Nesta aula, contratos e segurança aparecem apenas no nível necessário para permitir os testes de integração.

O laboratório será:

```text
labs/m20/aula-691-testes-integracao-projeto-final/orderflow-integration-test-suite
```

Regra central:

```text
teste de integracao
prova que boundaries reais
funcionam juntos

com infraestrutura
equivalente
a que o sistema usa.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
688:
CI CD do projeto final.

689:
Deploy ou simulacao.

690:
Testes unitarios projeto final.

691:
Testes integracao projeto final.

692:
Testes contrato e seguranca final.

693:
Testes de carga projeto final.
```

A aula 691 não substitui a suíte unitária.

Ela complementa a suíte.

Testes unitários:

- são rápidos;
- isolam regras;
- usam fakes;
- localizam falhas com precisão.

Testes de integração:

- usam adapters reais;
- usam banco real;
- usam broker real;
- validam configuração;
- validam transação;
- validam serialização;
- validam rede local;
- detectam diferenças entre interfaces e implementações.

A pirâmide continua importante.

Não transforme toda regra de domínio em teste de integração.

Teste a integração somente onde o risco depende da conexão entre partes.

---

## Objetivo prático

Será criada a estrutura:

```text
testing/integration
├── README.md
├── compose-test-support.yaml
├── fixtures
│   ├── providers
│   ├── messages
│   └── database
└── reports
```

No módulo de persistência:

```text
libs/orderflow-persistence/src/test/java
└── br/com/formacao/orderflow/persistence/integration
    ├── PostgreSqlIntegrationSupport.java
    ├── FlywayCleanDatabaseIntegrationTest.java
    ├── FlywayUpgradeIntegrationTest.java
    ├── JpaOrderProcessRepositoryIntegrationTest.java
    ├── TenantIsolationRepositoryIntegrationTest.java
    ├── OptimisticLockingIntegrationTest.java
    ├── IdempotencyStoreIntegrationTest.java
    ├── OutboxStoreIntegrationTest.java
    ├── InboxStoreIntegrationTest.java
    ├── AuditStoreIntegrationTest.java
    └── TransactionRollbackIntegrationTest.java
```

Nos módulos de mensageria:

```text
apps/outbox-publisher/src/test/java
└── OutboxPublisherIntegrationTest.java

apps/orchestration-worker/src/test/java
├── IntegrationResultConsumerIntegrationTest.java
├── ConsumerInboxIntegrationTest.java
├── ConsumerRetryIntegrationTest.java
└── ConsumerDeadLetterIntegrationTest.java

apps/projection-worker/src/test/java
├── OrderProjectionIntegrationTest.java
├── ProjectionVersionGuardIntegrationTest.java
└── ProjectionReplayIntegrationTest.java
```

No Integration Gateway:

```text
apps/integration-gateway/src/test/java
├── StockProviderHttpIntegrationTest.java
├── PaymentProviderHttpIntegrationTest.java
├── FulfillmentProviderHttpIntegrationTest.java
├── ProviderTimeoutIntegrationTest.java
├── ProviderRetryIntegrationTest.java
├── ProviderCircuitBreakerIntegrationTest.java
└── GatewayMessagingIntegrationTest.java
```

Na API:

```text
apps/orderflow-api/src/test/java
├── OrderRegistrationIntegrationTest.java
├── ApiPersistenceIntegrationTest.java
├── ApiIdempotencyIntegrationTest.java
├── ApiTransactionRollbackIntegrationTest.java
└── ApiObservabilityIntegrationTest.java
```

Documentação:

```text
docs/testing/integration
├── INTEGRATION_TEST_STRATEGY.md
├── TESTCONTAINERS_POLICY.md
├── DATABASE_INTEGRATION_POLICY.md
├── MESSAGING_INTEGRATION_POLICY.md
├── PROVIDER_INTEGRATION_POLICY.md
├── TRANSACTION_TEST_POLICY.md
├── EVENTUAL_CONSISTENCY_TEST_POLICY.md
├── INTEGRATION_TEST_DATA_POLICY.md
├── INTEGRATION_TEST_MATRIX.md
├── INTEGRATION_TEST_RISK_REGISTER.md
├── INTEGRATION_TEST_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Teste de integração precisa de boundary real

Um repository JPA testado contra mock de `EntityManager` não prova integração com PostgreSQL.

Um consumer Kafka chamado diretamente como método não prova:

- deserialização;
- topic;
- key;
- offset;
- group;
- retry;
- DLQ.

Um client HTTP testado somente com mapper não prova:

- timeout;
- headers;
- status;
- body;
- conexão;
- retry.

### Banco equivalente importa

H2 não reproduz perfeitamente:

- PostgreSQL SQL;
- `JSONB`;
- `TIMESTAMPTZ`;
- índices parciais;
- locking;
- `SKIP LOCKED`;
- constraints;
- concorrência;
- migrations.

Por isso, use PostgreSQL real em container.

### Eventual consistency não usa `sleep`

Um teste assíncrono deve esperar uma condição com timeout.

Use Awaitility.

### Testes precisam ser repetíveis

Cada execução começa com:

- banco conhecido;
- topics conhecidos;
- consumer groups isolados;
- WireMock resetado;
- clocks controlados quando possível;
- dados únicos;
- cleanup seguro.

---

## Mão na massa guiada

### 1. Criar Integration Test Strategy

Arquivo:

```text
docs/testing/integration/INTEGRATION_TEST_STRATEGY.md
```

Princípios:

```text
real adapters;

real PostgreSQL;

real Kafka;

controlled HTTP providers;

isolated test data;

bounded waiting;

no arbitrary sleep;

transaction behavior is asserted;

duplicate delivery is expected;

contracts and security finals belong to lesson 692.
```

---

### 2. Padronizar sufixos

Use:

```text
*IntegrationTest.
```

Testes de contrato continuarão com:

```text
*ContractTest.
```

Assim, Maven pode executar grupos diferentes.

---

### 3. Criar profile Maven

Profile:

```text
integration-tests.
```

Ele deve:

- executar Failsafe;
- incluir `*IntegrationTest`;
- iniciar somente dependências necessárias;
- gerar reports;
- falhar por teste flaky detectado;
- não executar em cada ciclo unitário local.

---

### 4. Configurar Failsafe

Fases:

```text
integration-test;

verify.
```

O build só é aprovado quando `verify` executa.

---

### 5. Criar Testcontainers Policy

Arquivo:

```text
docs/testing/integration/TESTCONTAINERS_POLICY.md
```

Regras:

- imagens fixadas;
- containers compartilhados com isolamento;
- reuse somente com política;
- readiness real;
- logs coletados em falha;
- rede externa não necessária;
- cleanup automático;
- nenhum secret real.

---

## PostgreSQL e Flyway

### 6. Criar PostgreSqlIntegrationSupport

```java
package br.com.formacao.orderflow.persistence.integration;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
public abstract class PostgreSqlIntegrationSupport {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>(
                    "postgres:16-alpine")
                    .withDatabaseName("orderflow_test")
                    .withUsername("orderflow")
                    .withPassword("orderflow_test");
}
```

As credenciais existem somente no container efêmero de teste.

---

### 7. Criar Database Integration Policy

Arquivo:

```text
docs/testing/integration/DATABASE_INTEGRATION_POLICY.md
```

Valide:

- migrations;
- PKs;
- FKs;
- unique constraints;
- checks;
- indexes relevantes;
- timezone UTC;
- tenant scope;
- version;
- transaction;
- cleanup.

---

### 8. Testar banco vazio

`FlywayCleanDatabaseIntegrationTest`:

- inicia PostgreSQL vazio;
- executa todas as migrations;
- valida versão final;
- valida schema;
- valida tabelas;
- valida índices;
- valida constraints.

---

### 9. Testar upgrade

Prepare snapshot da versão anterior suportada.

Depois:

- aplique migrations novas;
- preserve dados;
- valide consultas;
- valide compatibilidade;
- valide checksum.

---

### 10. Testar migration imutável

Altere checksum em fixture controlada.

Flyway deve falhar.

O teste não altera migration oficial.

---

### 11. Testar repository real

Fluxo:

- criar aggregate;
- inserir;
- limpar persistence context;
- carregar;
- reconstituir;
- comparar estado;
- confirmar ausência de eventos novos.

---

### 12. Testar children

Valide persistência de:

- linhas;
- processing steps;
- compensation actions;
- applied external operations.

---

### 13. Testar tenant isolation

Crie o mesmo `orderId` para dois tenants.

Confirme:

- ambos existem;
- cada consulta retorna somente seu tenant;
- child queries preservam tenant;
- audit e Outbox preservam tenant.

---

### 14. Testar optimistic locking real

Fluxo:

1. carregar snapshot A;
2. carregar snapshot B;
3. salvar A;
4. salvar B;
5. confirmar `ConcurrencyConflict`.

Valide a versão no banco.

---

### 15. Testar Idempotency Store

Cenários:

- acquire;
- completed;
- replay;
- in progress;
- hash diferente;
- expiração;
- concorrência entre duas transações.

---

### 16. Testar Inbox Store

Cenários:

- primeira inserção;
- duplicate;
- fingerprint divergente;
- processed;
- failed;
- consumer diferente.

---

### 17. Testar Outbox Store

Valide:

- append;
- payload;
- headers;
- status `PENDING`;
- ordering por occurred at;
- retry metadata;
- tenant;
- aggregate.

---

### 18. Testar Audit Store

Confirme:

- append-only;
- timeline;
- tenant;
- action;
- previous status;
- new status;
- correlation;
- ausência de dado sensível.

---

### 19. Testar rollback real

Dentro de uma transação:

- insira aggregate;
- insira audit;
- insira Outbox;
- conclua idempotência;
- provoque exception.

Depois do rollback:

- nada funcional permanece;
- idempotência não está completed;
- nenhuma Outbox está visível.

---

### 20. Testar `SKIP LOCKED`

Duas transações tentam reivindicar Outbox.

Valide:

- lote não é compartilhado;
- cada linha possui um owner;
- lease pode ser recuperado depois.

---

## Spring Boot context

### 21. Testar contexto de persistência

Use:

```text
@SpringBootTest.
```

Valide que:

- adapters são beans;
- ports resolvem;
- transaction manager existe;
- Flyway executa;
- datasource aponta para container.

---

### 22. Testar boundary arquitetural em runtime

Confirme que handlers recebem ports.

Eles não recebem repositories Spring Data diretamente.

---

### 23. Criar Integration Test Data Policy

Arquivo:

```text
docs/testing/integration/INTEGRATION_TEST_DATA_POLICY.md
```

Dados:

- identificadores únicos por teste;
- tenant explícito;
- timestamps controlados quando possível;
- nenhum dado real;
- cleanup por transação ou truncamento controlado;
- sem dependência de ordem.

---

## API e persistência

### 24. Criar OrderRegistrationIntegrationTest

Suba:

- API;
- application;
- persistence;
- PostgreSQL;
- Flyway.

Use MockMvc.

Valide:

- request;
- command;
- transaction;
- aggregate;
- audit;
- Outbox;
- response `201`.

---

### 25. Testar replay idempotente pela API

Envie duas vezes:

- mesmo tenant;
- mesma key;
- mesmo body.

Valide:

- mesmo order ID;
- uma linha root;
- um efeito;
- replayed;
- Outbox sem duplicação funcional.

---

### 26. Testar conflito pela API

Mesma key e body diferente.

Resultado:

```text
409 IDEMPOTENCY_CONFLICT.
```

Banco permanece consistente.

---

### 27. Testar rollback pela API

Injete falha real no adapter de Outbox ou use constraint controlada.

Valide:

- response de erro;
- aggregate ausente;
- audit ausente;
- idempotência não concluída.

---

### 28. Testar leitura após escrita

Após registro:

- consulte endpoint;
- projection ou query model retorna estado esperado;
- tenant correto;
- version correta.

Quando a projection é assíncrona, use Awaitility.

---

## Kafka e mensageria

### 29. Criar Messaging Integration Policy

Arquivo:

```text
docs/testing/integration/MESSAGING_INTEGRATION_POLICY.md
```

Valide:

- topic;
- key;
- headers;
- serialization;
- ordering;
- consumer group;
- Inbox;
- offset;
- retry;
- DLQ;
- replay.

---

### 30. Criar Kafka Testcontainer support

Use imagem fixada e bootstrap dinâmico.

Crie topics antes dos testes.

---

### 31. Isolar consumer groups

Cada classe usa group único ou namespace de execução.

Isso evita interferência entre testes.

---

### 32. Testar Outbox Publisher

Fluxo:

- inserir evento na Outbox;
- executar polling;
- aguardar publicação;
- confirmar topic;
- confirmar key;
- confirmar headers;
- confirmar status `PUBLISHED`.

---

### 33. Testar falha de publicação

Simule broker indisponível ou producer failure.

Valide:

- Outbox vira `FAILED`;
- attempts incrementa;
- next available at;
- nenhum status falso de sucesso.

---

### 34. Testar publicação duplicada

Simule:

- broker confirma;
- marcação no banco falha;
- publisher tenta novamente.

Consumer processa uma vez por Inbox.

---

### 35. Testar ordering

Publique sequência do mesmo pedido.

Valide mesma partition e ordem observada.

Pedidos diferentes podem usar partitions diferentes.

---

### 36. Testar Integration Result Consumer

Publique resultado de estoque ou pagamento.

Valide:

- deserialização;
- Inbox;
- handler;
- aggregate update;
- audit;
- nova Outbox;
- offset confirmado depois do commit.

---

### 37. Testar duplicate delivery

Publique a mesma mensagem duas vezes.

Valide:

- um efeito;
- Inbox processed;
- nenhum evento duplicado;
- ambos os records consumidos com segurança.

---

### 38. Testar fingerprint divergente

Mesmo message ID com payload diferente.

Valide:

- handler não executa;
- finding;
- DLQ;
- aggregate preservado.

---

### 39. Testar retry topic

Provoque erro transitório.

Valide:

- record vai para retry;
- metadados são preservados;
- segunda tentativa processa;
- DLQ não recebe.

---

### 40. Testar Dead Letter Queue

Mensagem malformada:

- não chama handler;
- produz DLQ envelope;
- preserva origem;
- reason é sanitizado;
- offset original é tratado.

---

### 41. Testar replay

Republique record da DLQ com o mesmo message ID.

Valide:

- audit de replay;
- idempotência;
- resultado final;
- nenhuma duplicação indevida.

---

## Integration Gateway e WireMock

### 42. Criar Provider Integration Policy

Arquivo:

```text
docs/testing/integration/PROVIDER_INTEGRATION_POLICY.md
```

Valide:

- método;
- path;
- headers;
- token;
- idempotency key;
- correlation;
- body;
- timeout;
- retry;
- breaker;
- normalização.

A verificação final de contratos pertence à aula 692.

---

### 43. Configurar WireMock

Inicie servidor dinâmico.

Após cada teste:

- reset requests;
- reset scenarios;
- limpar stubs específicos;
- preservar somente configuração compartilhada.

---

### 44. Testar Stock Provider

Cenários:

- reserved;
- rejected;
- duplicate same payload;
- duplicate different payload;
- timeout;
- `503`;
- malformed response.

---

### 45. Testar Payment Provider

Valide:

- authorization;
- decline;
- reversal;
- amount;
- currency;
- operation ID;
- idempotency header;
- normalized result.

---

### 46. Testar Fulfillment Provider

Valide:

- start;
- cancel;
- irreversible;
- pending;
- timeout;
- unknown status.

---

### 47. Testar workload token

Use token provider de teste.

Valide:

- audience;
- authorization header;
- cache;
- refresh;
- token ausente dos logs.

---

### 48. Testar timeout real

WireMock atrasa a resposta.

Valide:

- deadline;
- timeout;
- resultado `AMBIGUOUS`;
- duração limitada;
- retry conforme policy.

---

### 49. Testar retry real

Primeira resposta `503`.

Segunda resposta sucesso.

Valide:

- duas requests;
- mesma idempotency key;
- mesmo operation ID;
- resultado final success.

---

### 50. Testar circuit breaker

Provoque falhas suficientes.

Valide:

- estado open;
- chamada bloqueada sem chegar ao WireMock;
- half-open;
- sucesso fecha breaker.

---

## Gateway e Kafka

### 51. Criar GatewayMessagingIntegrationTest

Fluxo:

```text
integration request topic;

ProviderRequestConsumer;

Inbox ou execution store;

WireMock provider;

Gateway Outbox;

integration result topic.
```

---

### 52. Não manter transação durante HTTP

Instrumente transaction synchronization.

Valide que nenhum banco permanece em transação aberta enquanto WireMock está bloqueado.

---

### 53. Testar recovery do Gateway

Simule falha depois do provider e antes do resultado ser publicado.

Valide:

- execução persistida;
- Outbox recuperável;
- provider não é chamado novamente sem necessidade;
- resultado é publicado depois.

---

## Projection

### 54. Testar Projection Worker

Publique eventos:

- registered;
- stock reserved;
- payment authorized;
- completed.

Valide view final.

---

### 55. Testar duplicate de projection

Mesmo event duas vezes.

Valide:

- uma atualização;
- version preservada;
- Inbox duplicate.

---

### 56. Testar gap

Publique versão `3` quando current é `1`.

Valide:

- gap;
- projection stale;
- finding;
- nenhuma aplicação incorreta.

---

### 57. Testar replay da projection

Reaplique sequência correta.

Valide recuperação da freshness e versão.

---

## Observabilidade integrada

### 58. Testar métricas

Use registry de teste.

Valide incremento de:

- API request;
- Outbox publish;
- consumer processed;
- provider call;
- projection update;
- journey result.

---

### 59. Testar trace HTTP para Kafka

Use exporter em memória.

Valide:

- span HTTP;
- span application;
- span Outbox;
- producer span;
- consumer span;
- relação causal.

---

### 60. Testar sanitização integrada

Provoque erro do provider contendo token fictício.

Confirme que logs e spans não carregam o valor.

---

## Transação e consistência eventual

### 61. Criar Transaction Test Policy

Arquivo:

```text
docs/testing/integration/TRANSACTION_TEST_POLICY.md
```

Casos:

- commit;
- rollback;
- optimistic conflict;
- Outbox atomicity;
- Inbox atomicity;
- offset after commit;
- provider boundary sem transação longa.

---

### 62. Criar Eventual Consistency Test Policy

Arquivo:

```text
docs/testing/integration/EVENTUAL_CONSISTENCY_TEST_POLICY.md
```

Use Awaitility com:

- timeout;
- poll interval;
- mensagem de diagnóstico;
- condição observável;
- sem `Thread.sleep`.

---

### 63. Configurar Awaitility

Exemplo:

```java
await()
        .atMost(Duration.ofSeconds(10))
        .pollInterval(Duration.ofMillis(100))
        .untilAsserted(() ->
                assertThat(projectionRepository.find(
                        tenantId,
                        orderId))
                        .isPresent());
```

---

### 64. Criar diagnostics em timeout

Quando Awaitility falhar, anexe:

- container logs;
- consumer lag;
- Outbox rows;
- Inbox rows;
- DLQ rows;
- current projection.

Isso reduz debug cego.

---

## Performance e isolamento dos testes

### 65. Reutilizar containers com cuidado

Uma suíte pode compartilhar PostgreSQL e Kafka.

Mas cada teste precisa de isolamento lógico.

Use:

- schemas;
- truncamento;
- tenant único;
- topics únicos;
- groups únicos.

---

### 66. Evitar recriar contexto sem necessidade

Use contexto compartilhado quando configuração é igual.

Não esconda estado global.

---

### 67. Definir orçamento de tempo

Meta sugerida:

```text
suite de integração completa:
menos de 8 minutos
no runner do projeto.
```

Jobs podem ser paralelizados por boundary.

---

### 68. Coletar logs somente em falha

Isso reduz artifacts e ruído.

---

### 69. Detectar flakiness

Execute testes críticos repetidamente.

Falhas intermitentes bloqueiam o gate.

---

## Matriz e governança

### 70. Criar Integration Test Matrix

Arquivo:

```text
docs/testing/integration/INTEGRATION_TEST_MATRIX.md
```

Colunas:

- boundary;
- infrastructure;
- scenario;
- success;
- failure;
- duplicate;
- concurrency;
- retry;
- rollback;
- evidence;
- owner.

---

### 71. Criar Integration Test Risk Register

Arquivo:

```text
docs/testing/integration/INTEGRATION_TEST_RISK_REGISTER.md
```

Riscos:

```text
H2 mascarando PostgreSQL;

sleep arbitrario;

topic compartilhado;

consumer group compartilhado;

cleanup incompleto;

container instavel;

contexto recriado demais;

teste acoplado a ordem;

WireMock sem reset;

offset confirmado cedo;

transacao longa;

assertion eventual fraca;

logs insuficientes.
```

---

### 72. Criar Integration Test Traceability

Arquivo:

```text
docs/testing/integration/INTEGRATION_TEST_TRACEABILITY.md
```

Exemplo:

```text
ADR PostgreSQL authority
-> PostgreSQLContainer
-> Flyway tests
-> repository integration tests.

ADR Outbox and Inbox
-> Outbox Publisher test
-> duplicate delivery test
-> rollback test.

ADR Event-driven orchestration
-> Kafka Testcontainer
-> Gateway messaging
-> Orchestration consumer
-> Projection worker.
```

---

### 73. Criar boundary da próxima aula

Arquivo:

```text
docs/testing/integration/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 691 define:

- PostgreSQL integration;
- Flyway integration;
- JPA repositories;
- transaction tests;
- Outbox and Inbox integration;
- Kafka integration;
- consumers;
- retries;
- DLQ;
- replay;
- WireMock provider integration;
- projection integration;
- telemetry integration;
- Testcontainers.

A aula 692 define:

- OpenAPI contract validation;
- HTTP schema compatibility;
- provider contract final;
- message schema final;
- backward compatibility;
- authentication tests;
- authorization matrix;
- scope and role tests;
- tenant isolation security;
- IDOR tests;
- secret and token leakage tests.

A validacao final de contratos
e seguranca
nao e concluida nesta aula.
```

---

### 74. Executar testes de persistência

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-persistence `
  -am `
  verify `
  -Pintegration-tests
```

---

### 75. Executar testes de mensageria

```powershell
.\mvnw.cmd `
  -pl `
  apps/outbox-publisher,
  apps/orchestration-worker,
  apps/projection-worker `
  -am `
  verify `
  -Pintegration-tests
```

---

### 76. Executar testes do Gateway

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -am `
  verify `
  -Pintegration-tests
```

---

### 77. Executar testes da API

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  verify `
  -Pintegration-tests
```

---

### 78. Executar suíte completa

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pintegration-tests
```

---

### 79. Criar report

Arquivo:

```text
reports/integration-tests-final-report.yaml
```

Exemplo:

```yaml
integrationTestsFinal:
  infrastructure:
    PostgreSQL:
      true
    Kafka:
      true
    WireMock:
      true
    Testcontainers:
      true

  tests:
    persistence:
      21
    API:
      9
    messaging:
      18
    Gateway:
      14
    projection:
      7
    observability:
      5
    total:
      74
    failures:
      0
    flaky:
      0

  durationSeconds:
    364

  contractAndSecurityFinal:
    completed:
      false

  gate:
    PASS
```

---

### 80. Criar evidence

Arquivo:

```text
contracts/integration-tests-final-evidence.yaml
```

Campos:

- lesson;
- project;
- PostgreSQL container status;
- Kafka container status;
- WireMock status;
- Flyway clean database status;
- Flyway upgrade status;
- repository test count;
- tenant isolation status;
- optimistic locking status;
- idempotency status;
- transaction rollback status;
- Outbox atomicity status;
- Inbox duplicate status;
- Outbox publisher status;
- Kafka ordering status;
- retry topic status;
- DLQ status;
- replay status;
- provider timeout status;
- provider retry status;
- circuit breaker status;
- Gateway recovery status;
- projection gap status;
- trace propagation status;
- metric emission status;
- total integration test count;
- failure count;
- flaky count;
- duration seconds;
- contract and security final completed;
- documentation status;
- gate status;
- timestamp.

---

### 81. Criar gate de integração

Status:

```text
PASS;

FAIL_INTEGRATION_TEST_STRUCTURE;

FAIL_TESTCONTAINERS;

FAIL_POSTGRESQL;

FAIL_FLYWAY;

FAIL_REPOSITORY_INTEGRATION;

FAIL_TENANT_ISOLATION;

FAIL_OPTIMISTIC_LOCKING;

FAIL_IDEMPOTENCY_INTEGRATION;

FAIL_TRANSACTION_ROLLBACK;

FAIL_OUTBOX_ATOMICITY;

FAIL_INBOX_DEDUPLICATION;

FAIL_KAFKA;

FAIL_MESSAGE_ORDERING;

FAIL_RETRY_TOPIC;

FAIL_DLQ;

FAIL_REPLAY;

FAIL_PROVIDER_HTTP;

FAIL_PROVIDER_TIMEOUT;

FAIL_PROVIDER_RETRY;

FAIL_CIRCUIT_BREAKER;

FAIL_GATEWAY_RECOVERY;

FAIL_PROJECTION;

FAIL_TELEMETRY_INTEGRATION;

FAIL_FLAKY_TEST;

FAIL_TEST_DURATION;

FAIL_CONTRACT_SECURITY_ANTICIPATION;

INCONCLUSIVE.
```

---

### 82. Executar validação final

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
  -Pintegration-tests
```

Confirme:

- PostgreSQL real;
- migrations válidas;
- repositories reais;
- rollback real;
- Outbox e Inbox reais;
- Kafka real;
- consumers reais;
- WireMock;
- retry;
- breaker;
- projection;
- telemetry;
- zero flaky;
- contratos e segurança finais preservados para a aula 692.

---

### 83. Encerrar o laboratório

Confirme:

- strategy;
- profile Maven;
- Failsafe;
- Testcontainers policy;
- PostgreSQL;
- Flyway;
- repositories;
- tenant;
- locking;
- idempotência;
- transactions;
- Outbox;
- Inbox;
- API;
- Kafka;
- consumers;
- retry;
- DLQ;
- replay;
- WireMock;
- providers;
- Gateway recovery;
- projection;
- metrics;
- traces;
- Awaitility;
- diagnostics;
- matrix;
- risk register;
- traceability;
- report;
- evidence;
- gate aprovado;
- contratos e segurança finais não concluídos.

---

## Entendendo o que foi feito

### O banco real foi validado

SQL, migrations, constraints e locking foram executados em PostgreSQL.

### As transações deixaram de ser suposição

Rollback, Outbox e idempotência foram comprovados no banco.

### A mensageria ficou verificável

Topics, keys, headers, consumers, retries, DLQ e replay foram exercitados.

### O Gateway foi conectado a HTTP controlado

Timeout, retry, breaker e normalização foram testados com WireMock.

### A projection foi validada

Duplicate, gap, version e freshness foram observados.

### A telemetria atravessou boundaries

Métricas e traces foram gerados durante a integração.

### Eventual consistency ganhou testes estáveis

Awaitility substituiu sleeps arbitrários.

---

## Erros comuns importantes

### Usar H2

Diferenças do PostgreSQL ficam escondidas.

### Chamar consumer como método

Kafka real não é exercitado.

### Usar `Thread.sleep`

A suíte fica lenta e flaky.

### Compartilhar consumer group

Testes interferem entre si.

### Não resetar WireMock

Requests de outro teste contaminam a prova.

### Confirmar apenas status HTTP

Banco e Outbox podem estar inconsistentes.

### Abrir transação durante provider call

Locks permanecem ativos.

### Ignorar logs de container

Falhas ficam difíceis de diagnosticar.

### Transformar tudo em integração

A suíte fica lenta e pouco precisa.

### Finalizar contratos agora

A validação final pertence à aula 692.

---

## Comandos úteis

### Persistência

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-persistence `
  verify `
  -Pintegration-tests
```

### Kafka

```powershell
.\mvnw.cmd `
  -pl `
  apps/orchestration-worker `
  verify `
  -Pintegration-tests
```

### Gateway

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  verify `
  -Pintegration-tests
```

### Tudo

```powershell
.\mvnw.cmd `
  clean `
  verify `
  -Pintegration-tests
```

---

## Exercício guiado

Implemente o teste integrado:

```text
pagamento recusado
apos estoque reservado.
```

Inclua:

1. PostgreSQL container;
2. Flyway;
3. API ou command real;
4. aggregate persistido;
5. Outbox;
6. Outbox Publisher;
7. Kafka request;
8. Gateway consumer;
9. Inbox do Gateway;
10. WireMock Payment Provider;
11. recusa normalizada;
12. Gateway Outbox;
13. Kafka result;
14. Orchestration consumer;
15. Inbox do worker;
16. aggregate em compensação;
17. audit;
18. compensation Outbox;
19. projection;
20. duplicate delivery;
21. rollback em falha;
22. trace;
23. metrics;
24. Awaitility;
25. evidence.

Não conclua a matriz final de contratos e segurança.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 690 e ponte para a aula 692 foram preservadas;
- Integration Test Strategy foi criada;
- sufixos foram padronizados;
- profile Maven foi criado;
- Failsafe foi configurado;
- Testcontainers Policy foi criada;
- PostgreSqlIntegrationSupport foi criado;
- Database Integration Policy foi criada;
- banco vazio foi testado;
- upgrade foi testado;
- checksum foi testado;
- repository real foi testado;
- children foram testadas;
- tenant isolation foi testado;
- optimistic locking foi testado;
- Idempotency Store foi testado;
- Inbox Store foi testado;
- Outbox Store foi testado;
- Audit Store foi testado;
- rollback real foi testado;
- `SKIP LOCKED` foi testado;
- contexto Spring foi testado;
- runtime boundary foi validado;
- Test Data Policy foi criada;
- registro pela API foi testado;
- replay pela API foi testado;
- conflito pela API foi testado;
- rollback pela API foi testado;
- leitura após escrita foi testada;
- Messaging Integration Policy foi criada;
- Kafka Testcontainer foi configurado;
- consumer groups foram isolados;
- Outbox Publisher foi testado;
- falha de publicação foi testada;
- publicação duplicada foi testada;
- ordering foi testado;
- Integration Result Consumer foi testado;
- duplicate delivery foi testado;
- fingerprint divergente foi testado;
- retry topic foi testado;
- DLQ foi testada;
- replay foi testado;
- Provider Integration Policy foi criada;
- WireMock foi configurado;
- Stock Provider foi testado;
- Payment Provider foi testado;
- Fulfillment Provider foi testado;
- workload token foi testado;
- timeout real foi testado;
- retry real foi testado;
- circuit breaker foi testado;
- GatewayMessagingIntegrationTest foi criado;
- transação durante HTTP foi evitada;
- recovery do Gateway foi testado;
- Projection Worker foi testado;
- duplicate de projection foi testado;
- gap foi testado;
- replay da projection foi testado;
- métricas foram testadas;
- trace HTTP para Kafka foi testado;
- sanitização integrada foi testada;
- Transaction Test Policy foi criada;
- Eventual Consistency Policy foi criada;
- Awaitility foi configurado;
- diagnostics foram criados;
- containers foram reutilizados com isolamento;
- contexts foram reutilizados com cuidado;
- orçamento de tempo foi definido;
- logs são coletados em falha;
- flakiness foi verificada;
- Integration Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 692 foi criado;
- persistência foi testada;
- mensageria foi testada;
- Gateway foi testado;
- API foi testada;
- suíte completa foi executada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- contratos e segurança finais não foram antecipados.

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
  -Pintegration-tests
```

Adicione:

```powershell
git add `
  libs/orderflow-persistence/src/test `
  apps/orderflow-api/src/test `
  apps/outbox-publisher/src/test `
  apps/orchestration-worker/src/test `
  apps/integration-gateway/src/test `
  apps/projection-worker/src/test `
  testing/integration `
  docs/testing/integration `
  reports/integration-tests-final-report.yaml `
  contracts/integration-tests-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "realPassword|realToken|productionBootstrap|productionDatabase|liveProvider|securityFinalMatrix"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "test(integration): validate OrderFlow infrastructure boundaries"
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

- credencial real;
- banco de produção;
- broker real;
- provider real;
- suíte final detalhada da aula 692.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou os testes de integração do projeto final OrderFlow.

Você criou:

```text
PostgreSQL integration;

Flyway tests;

JPA repository tests;

transaction tests;

Outbox and Inbox tests;

API integration;

Kafka integration;

consumer tests;

retry and DLQ tests;

replay tests;

WireMock provider integration;

Gateway recovery tests;

projection tests;

telemetry integration;

Awaitility policies;

reports, evidence e gate.
```

A suíte agora prova que os adapters reais funcionam juntos.

A próxima aula será:

```text
692 - M20.22 - Testes contrato e seguranca final
```

Nela, você executará a validação final de OpenAPI, contratos HTTP, contratos de providers, schemas de mensagens, compatibilidade, autenticação, autorização, scopes, roles, tenant isolation, IDOR, secrets e regressões de segurança.

A validação final de contratos e segurança não foi concluída nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Testei PostgreSQL.
- [ ] Testei Flyway.
- [ ] Testei repositories.
- [ ] Testei transações.
- [ ] Testei Outbox e Inbox.
- [ ] Testei API integrada.
- [ ] Testei Kafka.
- [ ] Testei consumers.
- [ ] Testei retries e DLQ.
- [ ] Testei providers com WireMock.
- [ ] Testei Gateway recovery.
- [ ] Testei projection.
- [ ] Testei telemetria.
- [ ] Evitei sleeps.
- [ ] Preservei contratos e segurança para a aula 692.

---

## Troubleshooting adicional

### PostgreSQL não inicia

Valide Docker e imagem fixada.

### Flyway falha em checksum

Não altere migration aplicada.

### Kafka test perde mensagem

Revise group, offset e Awaitility.

### Consumer processa evento antigo

Isole topic e consumer group.

### WireMock recebeu request de outro teste

Execute reset após cada cenário.

### Teste passa local e falha no CI

Revise timeout, recursos e isolamento.

### Outbox permanece pending

Revise polling e clock.

### DLQ não recebe

Revise classifier e topic mapping.

### Projection fica stale

Revise version guard e ordering.

### Quero fechar security matrix

Essa etapa pertence à aula 692.

---

## Perguntas de revisão

1. O que diferencia teste de integração?
2. Por que usar PostgreSQL real?
3. H2 substitui PostgreSQL?
4. Para que serve Testcontainers?
5. O que Flyway test prova?
6. O que optimistic locking test prova?
7. O que rollback test prova?
8. Como testar Outbox atomicity?
9. Consumer pode ser chamado como método?
10. Por que isolar consumer groups?
11. O que Inbox integration prova?
12. Por que evitar `sleep`?
13. O que Awaitility faz?
14. O que WireMock testa?
15. Como testar timeout?
16. Como testar retry?
17. Como testar circuit breaker?
18. Por que não manter transação no HTTP externo?
19. O que ProjectionVersionGuard integra?
20. Como detectar flakiness?
21. O que coletar em timeout?
22. O que a aula 692 fará?
23. O que não foi concluído?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Conecta boundaries reais.
2. Para reproduzir SQL real.
3. Não completamente.
4. Infraestrutura efêmera.
5. Schema e upgrade.
6. Concorrência real.
7. Atomicidade real.
8. Falha dentro da transação.
9. Não como única prova.
10. Evitar interferência.
11. Deduplicação persistente.
12. Evitar lentidão e flakiness.
13. Espera condição com limite.
14. Integração HTTP controlada.
15. Atrasando resposta.
16. Falha seguida de sucesso.
17. Falhas, open, half-open e recovery.
18. Evitar locks longos.
19. Eventos e read model.
20. Repetindo testes críticos.
21. Logs, lag, Outbox, Inbox e DLQ.
22. Contratos e segurança final.
23. Validação final de contratos e segurança.
24. Testes contrato e seguranca final.
25. Infraestrutura real prova boundaries.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 691 - M20.21 - Testes integracao projeto final

- Continuei após Testes unitários projeto final.
- Criei Integration Test Strategy.
- Padronizei sufixos.
- Criei profile Maven.
- Configurei Failsafe.
- Criei Testcontainers Policy.
- Criei suporte PostgreSQL.
- Criei Database Integration Policy.
- Testei banco vazio.
- Testei upgrade Flyway.
- Testei checksum.
- Testei repository real.
- Testei children.
- Testei tenant isolation.
- Testei optimistic locking.
- Testei Idempotency Store.
- Testei Inbox Store.
- Testei Outbox Store.
- Testei Audit Store.
- Testei rollback real.
- Testei SKIP LOCKED.
- Testei contexto Spring.
- Validei boundary em runtime.
- Criei Integration Test Data Policy.
- Testei registro pela API.
- Testei replay pela API.
- Testei conflito pela API.
- Testei rollback pela API.
- Testei leitura após escrita.
- Criei Messaging Integration Policy.
- Configurei Kafka Testcontainer.
- Isolei consumer groups.
- Testei Outbox Publisher.
- Testei falha de publicação.
- Testei publicação duplicada.
- Testei ordering.
- Testei Integration Result Consumer.
- Testei duplicate delivery.
- Testei fingerprint divergente.
- Testei retry topic.
- Testei DLQ.
- Testei replay.
- Criei Provider Integration Policy.
- Configurei WireMock.
- Testei Stock Provider.
- Testei Payment Provider.
- Testei Fulfillment Provider.
- Testei workload token.
- Testei timeout real.
- Testei retry real.
- Testei circuit breaker.
- Testei Gateway por Kafka.
- Evitei transação durante HTTP.
- Testei recovery do Gateway.
- Testei Projection Worker.
- Testei duplicate de projection.
- Testei gap.
- Testei replay da projection.
- Testei métricas.
- Testei trace HTTP para Kafka.
- Testei sanitização integrada.
- Criei Transaction Test Policy.
- Criei Eventual Consistency Test Policy.
- Configurei Awaitility.
- Criei diagnostics.
- Reutilizei containers com isolamento.
- Reutilizei contextos com cuidado.
- Defini orçamento de tempo.
- Coletei logs em falha.
- Verifiquei flakiness.
- Criei Integration Test Matrix.
- Criei Integration Test Risk Register.
- Criei Integration Test Traceability.
- Criei boundary para a aula 692.
- Executei testes de persistência.
- Executei testes de mensageria.
- Executei testes do Gateway.
- Executei testes da API.
- Executei suíte completa.
- Criei report, evidence e gate.
- Não antecipei contratos e segurança finais.
- Próxima aula: Testes contrato e seguranca final.
```

---

## Referência técnica curta

- Integration Test.
- Spring Boot Test.
- Testcontainers.
- PostgreSQL.
- Flyway.
- Spring Data JPA.
- Kafka Testcontainer.
- WireMock.
- Awaitility.
- Transaction Rollback.
- Optimistic Locking.
- Transactional Outbox.
- Inbox.
- Retry Topic.
- Dead Letter Queue.
- Circuit Breaker.
- Eventual Consistency.

Regra final:

```text
A suíte de integração final do OrderFlow deve provar que adapters e infraestrutura reais funcionam juntos: PostgreSQL Testcontainer executa Flyway em banco vazio e upgrade, JPA repositories persistem root, children, tenant, version, idempotência, Inbox, Outbox e audit, transações reais comprovam commit, rollback, optimistic conflict, atomicidade e SKIP LOCKED, Spring Boot context conecta handlers aos ports sem vazar repositories, MockMvc registra pedido e comprova aggregate, audit, Outbox, replay e conflito, Kafka Testcontainer valida topics, keys, headers, ordering, consumers, Inbox, offsets, retry topics, DLQ e replay, Outbox Publisher tolera publicação duplicada, WireMock valida Stock, Payment e Fulfillment clients com workload token, deadline, timeout, retry, circuit breaker e normalização, Gateway messaging persiste execution state e publica result por Outbox sem manter transação durante HTTP, Projection Worker aplica version guard, duplicate, gap e replay, Micrometer e OpenTelemetry em memória comprovam métricas e causalidade, Awaitility espera condições sem sleeps e diagnostics coletam logs, lag, Outbox, Inbox e DLQ em timeout, a suíte usa groups, containers isolados, orçamento de duração e zero flakiness; o gate termina com PostgreSQL, Flyway, API, Kafka, providers, Gateway, projection, telemetry, report e evidence aprovados, enquanto a validação final de OpenAPI, HTTP contracts, provider contracts, message schemas, backward compatibility, autenticação, autorização, scopes, roles, tenant isolation, IDOR e secret leakage permanece reservada para a aula 692.
```
