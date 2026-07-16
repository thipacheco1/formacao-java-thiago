# 690 - M20.20 - Testes unitarios projeto final

## Apresentação da aula

Na aula 689, você executou o deploy ou a simulação completa do OrderFlow.

O projeto passou a possuir:

- release manifest;
- validação de digests;
- assinatura e provenance;
- configuração por ambiente;
- referências externas de secrets;
- planejamento de migrations;
- pre-deploy checks;
- rollout;
- health checks;
- smoke tests;
- observação por logs, métricas e traces;
- critérios de aceitação;
- rollback;
- roll-forward;
- evidências de implantação.

O projeto já está tecnicamente completo o suficiente para ser construído, executado, implantado e defendido.

Agora começa uma etapa de consolidação da qualidade.

Nesta aula, você aprofundará a suíte de testes unitários do projeto final.

O foco não será apenas aumentar uma porcentagem de cobertura.

Uma boa suíte unitária precisa provar comportamento.

Ela precisa responder:

- o aggregate aceita somente transições válidas?
- value objects rejeitam valores inválidos?
- policies produzem decisões corretas?
- duplicidade externa é tratada?
- compensações são planejadas corretamente?
- handlers coordenam ports na ordem esperada?
- idempotência evita efeitos duplicados?
- mappers traduzem contratos sem perder semântica?
- erros são classificados corretamente?
- security policies combinam scopes e roles?
- telemetria evita cardinalidade proibida?
- os testes falham quando uma regra é quebrada?

Cobertura de linhas sozinha não responde essas perguntas.

Um teste pode executar uma linha sem verificar seu resultado.

Também pode verificar detalhes internos e quebrar em toda refatoração.

Por isso, a suíte será guiada por princípios:

```text
testar comportamento observavel;

isolar unidades pequenas;

usar doubles com intencao;

evitar mockar o dominio;

preferir dados legiveis;

cobrir fronteiras;

testar falhas;

medir mutacoes;

manter execucao rapida.
```

Nesta aula, você trabalhará principalmente com:

- JUnit 5;
- AssertJ;
- Mockito;
- parameterized tests;
- test builders;
- object mothers;
- fakes;
- stubs;
- spies quando necessários;
- JaCoCo;
- PIT Mutation Testing;
- ArchUnit para boundaries dos testes;
- convenções de nomenclatura;
- test reports;
- evidence e gate.

A suíte será organizada nos módulos:

```text
libs/orderflow-domain;

libs/orderflow-application;

libs/orderflow-observability;

apps/orderflow-api;

apps/integration-gateway;

libs/orderflow-contracts.
```

Nesta aula, você não subirá PostgreSQL, Kafka, WireMock ou Testcontainers.

Esses componentes pertencem à próxima aula.

O laboratório será:

```text
labs/m20/aula-690-testes-unitarios-projeto-final/orderflow-unit-test-suite
```

A próxima aula será:

```text
691 - M20.21 - Testes integracao projeto final
```

Regra central:

```text
um teste unitario bom
prova uma regra
de forma rapida,
legivel
e independente
de infraestrutura.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
687:
Docker do projeto final.

688:
CI CD do projeto final.

689:
Deploy ou simulacao.

690:
Testes unitarios projeto final.

691:
Testes integracao projeto final.

692:
Testes E2E projeto final.
```

A aula 690 fecha a qualidade interna das unidades.

A aula 691 conectará módulos e infraestrutura real.

A aula 692 validará jornadas completas pelo contrato externo.

A fronteira desta aula é clara.

Pode usar:

- objetos em memória;
- clocks fixos;
- identificadores determinísticos;
- fakes;
- mocks;
- builders;
- parsers e mappers locais;
- collectors em memória;
- meter registries simples.

Não pode usar:

- PostgreSQL real;
- H2 como substituto;
- Kafka;
- WireMock;
- Testcontainers;
- Docker Compose;
- chamadas HTTP reais;
- filesystem externo;
- rede.

---

## Objetivo prático

Será criada a estrutura:

```text
testing
├── unit-test-conventions.md
├── mutation-testing-policy.md
├── coverage-policy.md
├── test-data-policy.md
└── reports
```

Nos módulos:

```text
libs/orderflow-domain/src/test/java
├── fixture
│   ├── OrderProcessBuilder.java
│   ├── MoneyFixture.java
│   ├── OrderLineFixture.java
│   └── DomainEventAssertions.java
├── value
│   ├── MoneyTest.java
│   ├── QuantityTest.java
│   ├── ProductCodeTest.java
│   ├── TenantIdTest.java
│   └── IdempotencyKeyTest.java
├── model
│   ├── OrderProcessRegistrationTest.java
│   ├── OrderProcessStockTest.java
│   ├── OrderProcessPaymentTest.java
│   ├── OrderProcessFulfillmentTest.java
│   ├── OrderProcessCancellationTest.java
│   ├── OrderProcessCompensationTest.java
│   ├── OrderProcessDuplicateResultTest.java
│   └── OrderProcessReconstitutionTest.java
└── policy
    ├── CancellationEligibilityPolicyTest.java
    └── CompensationPlannerTest.java
```

```text
libs/orderflow-application/src/test/java
├── fake
│   ├── InMemoryOrderProcessRepository.java
│   ├── InMemoryIdempotencyStore.java
│   ├── CollectingOutboxStore.java
│   ├── CollectingAuditStore.java
│   ├── InMemoryInboxStore.java
│   ├── FixedApplicationClock.java
│   ├── FixedIdentifierGenerator.java
│   └── RecordingTransactionManager.java
├── handler
│   ├── RegisterOrderHandlerTest.java
│   ├── RequestStockReservationHandlerTest.java
│   ├── RecordPaymentAuthorizationResultHandlerTest.java
│   ├── RequestCancellationHandlerTest.java
│   └── ReconcileOrderHandlerTest.java
└── service
    ├── IdempotencyCoordinatorTest.java
    ├── OrderLoaderTest.java
    └── DomainEventCollectorTest.java
```

Documentação:

```text
docs/testing/unit
├── UNIT_TEST_STRATEGY.md
├── TEST_NAMING_POLICY.md
├── TEST_DOUBLE_POLICY.md
├── TEST_DATA_POLICY.md
├── COVERAGE_POLICY.md
├── MUTATION_TESTING_POLICY.md
├── UNIT_TEST_MATRIX.md
├── UNIT_TEST_RISK_REGISTER.md
├── UNIT_TEST_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Unidade não significa classe obrigatoriamente

Uma unidade pode ser:

- value object;
- aggregate;
- policy;
- mapper;
- handler com ports fake;
- converter;
- error classifier;
- telemetry component.

O critério é:

```text
execucao isolada
sem infraestrutura externa.
```

### Teste deve observar comportamento

Bom:

```text
quando o pagamento e recusado
apos estoque reservado,
o aggregate entra em compensacao
e planeja liberacao de estoque.
```

Fraco:

```text
verificar que metodo privado X foi chamado.
```

### Mock não é padrão universal

Mocks são úteis para verificar colaboração.

Fakes são melhores quando existe estado simples.

Value objects e aggregate devem ser reais.

### Cobertura é um sinal

Use cobertura para encontrar lacunas.

Não use cobertura como prova única de qualidade.

### Mutation testing mede força

Mutation testing altera o código:

- troca condição;
- remove chamada;
- altera retorno;
- muda operador;
- remove incremento.

Um teste forte detecta a mutação.

---

## Mão na massa guiada

### 1. Criar Unit Test Strategy

Arquivo:

```text
docs/testing/unit/UNIT_TEST_STRATEGY.md
```

Princípios:

```text
behavior over implementation;

one reason to fail;

deterministic data;

no external infrastructure;

domain objects are real;

application ports use fakes;

Mockito is used intentionally;

assert outcomes and side effects;

cover happy paths and boundaries;

mutation score validates strength.
```

---

### 2. Configurar dependências de teste

No parent POM, padronize:

- JUnit Jupiter;
- AssertJ;
- Mockito;
- Mockito JUnit Jupiter;
- JaCoCo;
- PIT;
- ArchUnit.

As versões ficam em dependency management.

---

### 3. Configurar Surefire

Garanta:

```text
JUnit Platform;

encoding UTF-8;

timezone UTC;

parallelism controlado;

reports XML.
```

Testes que alteram estado global não podem executar em paralelo sem isolamento.

---

### 4. Criar Test Naming Policy

Arquivo:

```text
docs/testing/unit/TEST_NAMING_POLICY.md
```

Padrão recomendado:

```text
metodo_deve_resultado_quando_condicao.
```

Exemplo:

```text
register_deve_criar_pedido_quando_linhas_validas.
```

Outra opção legível:

```text
given_when_then.
```

Escolha um padrão e mantenha consistência.

---

### 5. Usar `@DisplayName`

Exemplo:

```java
@DisplayName(
        "deve criar pedido registrado com total calculado")
@Test
void register_deve_criar_pedido_quando_linhas_validas() {
}
```

O nome técnico ajuda busca.

O display name ajuda leitura do relatório.

---

### 6. Criar Test Data Policy

Arquivo:

```text
docs/testing/unit/TEST_DATA_POLICY.md
```

Dados de teste precisam ser:

- pequenos;
- determinísticos;
- legíveis;
- sem dado real;
- sem dependência de locale;
- sem horário atual;
- sem UUID aleatório quando o valor importa.

---

### 7. Criar fixtures explícitas

```java
package br.com.formacao.orderflow.domain.fixture;

import br.com.formacao.orderflow.domain.model.OrderLine;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.ProductCode;
import br.com.formacao.orderflow.domain.value.Quantity;
import java.math.BigDecimal;
import java.util.Currency;

public final class OrderLineFixture {

    public static OrderLine standard() {
        return new OrderLine(
                new ProductCode("SKU-001"),
                new Quantity(2),
                new Money(
                        new BigDecimal("15.00"),
                        Currency.getInstance("BRL")));
    }

    private OrderLineFixture() {
    }
}
```

---

### 8. Evitar fixture mágica

Não esconda valores importantes.

Quando o preço faz parte da regra, deixe o valor visível no teste.

---

## Value objects

### 9. Testar Money

Cenários:

- criação válida;
- valor negativo;
- moeda nula;
- soma com mesma moeda;
- soma com moeda diferente;
- multiplicação;
- escala;
- igualdade.

---

### 10. Criar teste parametrizado de dinheiro inválido

```java
@ParameterizedTest
@ValueSource(strings = {
        "-0.01",
        "-1.00",
        "-999.99"
})
void money_deve_rejeitar_valor_negativo(
        String value) {

    assertThatThrownBy(() ->
            new Money(
                    new BigDecimal(value),
                    Currency.getInstance("BRL")))
            .isInstanceOf(
                    IllegalArgumentException.class);
}
```

---

### 11. Testar Quantity

Fronteiras:

- zero;
- um;
- máximo permitido quando existir;
- negativo;
- overflow de multiplicação quando relevante.

---

### 12. Testar ProductCode

Cenários:

- padrão válido;
- vazio;
- espaços;
- tamanho mínimo;
- tamanho máximo;
- caracteres inválidos;
- normalização quando definida.

---

### 13. Testar TenantId

Valide:

- obrigatório;
- tamanho;
- caracteres;
- igualdade;
- ausência de normalização perigosa.

---

### 14. Testar IdempotencyKey

Valide:

- key válida;
- vazia;
- tamanho excessivo;
- whitespace;
- igualdade;
- representação segura para log.

---

## Aggregate

### 15. Criar OrderProcessBuilder

O builder precisa permitir:

- tenant;
- order;
- linhas;
- status;
- versão;
- stock result;
- payment result;
- fulfillment result;
- compensações;
- clock;
- correlation.

Ele não deve permitir snapshot impossível sem método explícito de teste de corrupção.

---

### 16. Testar registro

Valide:

- status inicial;
- total;
- versão;
- linhas defensivas;
- evento `OrderRegistered`;
- timestamp;
- correlation;
- ausência de compensação.

---

### 17. Testar linhas vazias

O registro falha.

Valide tipo e mensagem estável do erro.

---

### 18. Testar moedas misturadas

Pedido com BRL e USD falha com:

```text
MixedCurrency.
```

---

### 19. Testar solicitação de estoque

Valide:

- transição permitida;
- status;
- evento;
- operation ID;
- version increment;
- segunda solicitação indevida.

---

### 20. Testar estoque reservado

Cenário:

```text
stock requested
-> Reserved.
```

Valide:

- stock confirmed;
- próximo estado;
- eventos;
- operação externa registrada.

---

### 21. Testar estoque recusado

Valide:

- status terminal ou de falha previsto;
- código;
- nenhum pagamento solicitado;
- evento correto.

---

### 22. Testar resultado ambíguo de estoque

Valide:

- reconciliation pending;
- evento de reconciliação;
- ausência de confirmação falsa;
- operação preservada.

---

### 23. Testar pagamento autorizado

Pré-condição:

```text
stock confirmed.
```

Valide:

- pagamento confirmado;
- estado;
- evento;
- version.

---

### 24. Testar pagamento recusado

Valide:

- entrada em compensação;
- ação de liberar estoque;
- status da ação;
- eventos de pagamento e compensação;
- nenhuma confirmação de fulfillment.

---

### 25. Testar pagamento duplicado

Mesmo provider e operation ID:

- mesmo resultado;
- nenhum efeito adicional;
- nenhuma nova compensação;
- nenhum evento duplicado.

Payload divergente:

```text
DuplicateExternalResult.
```

---

### 26. Testar fulfillment

Cenários:

- início permitido;
- conclusão;
- falha;
- resultado ambíguo;
- duplicate;
- tentativa antes de pagamento.

---

### 27. Testar cancelamento elegível

Valide:

- policy;
- reason;
- status;
- compensações;
- eventos;
- timestamp.

---

### 28. Testar cancelamento inelegível

Depois do ponto irreversível:

```text
CancellationNotAllowed.
```

Nenhum evento novo deve ser emitido.

---

### 29. Testar compensações

Valide:

- ordem das ações;
- ações necessárias;
- ações desnecessárias ausentes;
- conclusão parcial;
- falha;
- ambiguidade;
- estado final.

---

### 30. Testar reconstituição

A reconstituição:

- preserva versão;
- preserva estado;
- não emite eventos;
- rejeita snapshot inválido;
- cria collections defensivas.

---

### 31. Criar assertions de eventos

```java
package br.com.formacao.orderflow.domain.fixture;

import br.com.formacao.orderflow.domain.event.DomainEvent;
import java.util.List;
import org.assertj.core.api.AbstractListAssert;
import org.assertj.core.api.ObjectAssert;

public final class DomainEventAssertions {

    public static AbstractListAssert<
            ?,
            List<? extends DomainEvent>,
            DomainEvent,
            ObjectAssert<DomainEvent>>
    assertThatEvents(
            List<? extends DomainEvent> events) {

        return org.assertj.core.api.Assertions
                .assertThat(events);
    }

    private DomainEventAssertions() {
    }
}
```

Use assertions focadas no contrato do evento.

---

## Policies

### 32. Testar CancellationEligibilityPolicy

Monte uma matriz:

- registered;
- stock requested;
- stock reserved;
- payment authorized;
- fulfillment started;
- irreversible;
- completed;
- cancelled.

Valide cada decisão.

---

### 33. Testar CompensationPlanner

Combinações:

- nada confirmado;
- somente estoque;
- estoque e pagamento;
- fulfillment reversível;
- fulfillment irreversível;
- ação já concluída;
- ação já planejada.

---

### 34. Preferir parameterized test para matriz

Use `@MethodSource`.

Cada argumento informa:

- estado;
- flags;
- expected actions;
- reason.

---

## Application handlers

### 35. Criar fake repository

O fake deve:

- armazenar por tenant e order;
- copiar aggregate;
- validar versão;
- registrar chamadas;
- simular not found;
- simular conflito.

---

### 36. Criar RecordingTransactionManager

Ele registra:

- iniciou;
- commitou;
- rollback;
- ordem de operações;
- exception.

O teste pode provar transaction boundary sem Spring.

---

### 37. Criar InMemoryIdempotencyStore

Estados:

- acquired;
- completed;
- in progress;
- conflict;
- failed.

Permita configurar cada cenário.

---

### 38. Criar CollectingOutboxStore

Registre envelopes persistidos.

Permita falha injetada.

---

### 39. Criar CollectingAuditStore

Registre:

- action;
- previous;
- new;
- tenant;
- order;
- correlation;
- timestamp.

---

### 40. Testar RegisterOrderHandler

Happy path:

- calcula fingerprint;
- adquire key;
- inicia transação;
- gera ID;
- cria aggregate;
- insere repository;
- persiste Outbox;
- conclui idempotência;
- retorna resultado.

---

### 41. Testar replay idempotente

Valide:

- resposta anterior;
- replayed `true`;
- nenhuma transação;
- nenhum ID novo;
- nenhum repository;
- nenhuma Outbox;
- nenhuma auditoria de negócio duplicada.

---

### 42. Testar key em processamento

Resultado:

```text
IdempotencyInProgress.
```

Nenhum efeito.

---

### 43. Testar conflito de key

Mesmo key com fingerprint diferente:

```text
IdempotencyConflict.
```

Nenhum efeito.

---

### 44. Testar falha de Outbox

Quando Outbox falha:

- transaction rollback;
- idempotência não completed;
- resultado não retornado;
- erro propagado.

---

### 45. Testar handler de estoque

Valide:

- loader usa tenant;
- versão esperada;
- aggregate chamado;
- repository update;
- audit;
- Outbox;
- resposta.

---

### 46. Testar resultado de pagamento

Use fake Inbox.

Valide:

- `tryReceive` antes do load;
- duplicate encerra cedo;
- resultado recusado cria compensação;
- update usa versão;
- Inbox processed;
- Outbox contém fatos corretos.

---

### 47. Testar tenant incorreto

Repository contém pedido em outro tenant.

Handler recebe tenant atual.

Resultado:

```text
OrderNotFound.
```

Nenhum vazamento.

---

### 48. Testar concurrency conflict

O fake repository rejeita versão.

Valide:

- `ConcurrencyConflict`;
- transaction rollback;
- Inbox não fica processada;
- Outbox não permanece.

---

### 49. Testar OrderLoader

Cenários:

- found;
- not found;
- tenant mismatch.

---

### 50. Testar DomainEventCollector

Valide:

- event ID;
- tenant;
- aggregate;
- type;
- version;
- correlation;
- occurred at;
- payload permitido;
- pull limpa eventos.

---

## Mappers e contratos

### 51. Testar OrderApiMapper

Cenários:

- request válido;
- currency;
- quantity;
- product code;
- idempotency;
- tenant;
- correlation;
- response mapping;
- replayed.

---

### 52. Testar provider mappers

Para cada provider:

- success;
- business rejection;
- duplicate same payload;
- duplicate different payload;
- timeout;
- unknown status;
- malformed response.

Esses testes não fazem HTTP.

Eles recebem DTOs locais.

---

### 53. Testar message mappers

Valide:

- metadata;
- message type;
- version;
- tenant;
- aggregate;
- correlation;
- causation;
- payload;
- unknown version.

---

### 54. Testar upcasters

Mensagem v1 deve virar modelo interno atual.

Valide compatibilidade.

---

## Segurança

### 55. Testar JwtAudienceValidator

Cenários:

- audience correta;
- ausente;
- diferente;
- múltiplas.

---

### 56. Testar TenantClaimValidator

Valide claim:

- válida;
- ausente;
- vazia;
- inválida;
- excessiva.

---

### 57. Testar authentication converter

Valide:

- scopes;
- roles;
- subject;
- tenant;
- token type;
- duplicidade;
- authority desconhecida.

---

### 58. Testar AccessPolicy

Matriz:

- scope e role;
- scope sem role;
- role sem scope;
- workload;
- authentication nula;
- principal incompatível.

---

## Observabilidade

### 59. Testar TelemetrySanitizer

Entradas:

- bearer token;
- authorization;
- secret;
- payload longo;
- mensagem segura;
- null.

Valide remoção e truncamento.

---

### 60. Testar cardinalidade

Use `SimpleMeterRegistry`.

Registre operações com centenas de order IDs.

Confirme que IDs não viram tags.

---

### 61. Testar JourneyTelemetry

Valide:

- started;
- completed;
- compensated;
- failed;
- duration;
- labels limitadas.

---

### 62. Testar OrderFlowLogContext

Valide:

- MDC aberto;
- valores aplicados;
- contexto anterior restaurado;
- limpeza após exception.

---

## Mockito com intenção

### 63. Criar Test Double Policy

Arquivo:

```text
docs/testing/unit/TEST_DOUBLE_POLICY.md
```

Use:

```text
fake:
estado simples e reutilizavel.

stub:
resposta controlada.

mock:
verificar colaboracao.

spy:
observar objeto real,
somente quando necessario.
```

---

### 64. Não mockar value objects

Crie instâncias reais.

Mocks de `Money`, `TenantId` ou `OrderId` escondem invariantes.

---

### 65. Evitar `verifyNoMoreInteractions` global

Use apenas quando interações extras representarem bug real.

Caso contrário, o teste fica frágil.

---

### 66. Usar ArgumentCaptor com moderação

Capture quando o valor produzido é o comportamento relevante.

Não capture apenas para reproduzir implementação.

---

### 67. Evitar mock deep stubs

Deep stubs indicam boundary confusa.

Crie uma interface menor ou fake.

---

## Cobertura

### 68. Criar Coverage Policy

Arquivo:

```text
docs/testing/unit/COVERAGE_POLICY.md
```

Metas sugeridas:

```text
domain:
90% lines,
85% branches.

application:
85% lines,
80% branches.

mappers and policies:
90% branches.

configuration:
sem meta artificial.
```

A meta não substitui revisão.

---

### 69. Configurar JaCoCo

Gere:

- XML;
- HTML;
- aggregate report;
- branch coverage;
- missed instructions.

---

### 70. Excluir apenas código justificado

Pode excluir:

- generated;
- bootstrap trivial;
- configuration declarativa;
- DTOs sem comportamento.

Não exclua código difícil apenas para aumentar número.

---

### 71. Criar relatório por módulo

Evite uma média global esconder módulo crítico sem testes.

---

## Mutation testing

### 72. Criar Mutation Testing Policy

Arquivo:

```text
docs/testing/unit/MUTATION_TESTING_POLICY.md
```

Prioridade:

- aggregate;
- policies;
- handlers;
- mappers;
- security policies;
- error classifiers.

---

### 73. Configurar PIT

Execute primeiro em módulos críticos.

Exemplo:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  org.pitest:pitest-maven:mutationCoverage
```

---

### 74. Interpretar mutações sobreviventes

Categorias:

- teste ausente;
- assertion fraca;
- código equivalente;
- código morto;
- configuração incorreta.

---

### 75. Criar teste para mutação real

Se PIT troca:

```text
status == PAYMENT_AUTHORIZED
```

por:

```text
status != PAYMENT_AUTHORIZED
```

e a mutação sobrevive, crie caso de fronteira.

---

### 76. Definir mutation score

Baseline:

```text
domain:
80%.

application critical handlers:
75%.

policies:
85%.
```

Use evolução gradual.

---

## Organização da suíte

### 77. Separar teste unitário de integração

Sufixos:

```text
*Test:
unitario.

*IntegrationTest:
integracao.

*ContractTest:
contrato externo ou compatibilidade.
```

A aula 691 trabalhará com os testes de integração.

---

### 78. Criar tags JUnit

Tags:

```text
unit;

mutation;

slow-unit.
```

Unitários normais devem permanecer rápidos.

---

### 79. Definir orçamento de tempo

Meta:

```text
suite unitária completa:
menos de 30 segundos
em maquina de desenvolvimento adequada.
```

A meta pode variar, mas precisa existir.

---

### 80. Detectar testes flaky

Teste unitário não deve depender de:

- relógio real;
- sleep;
- ordem;
- locale;
- timezone do sistema;
- random não fixado;
- thread timing.

---

### 81. Criar Unit Test Matrix

Arquivo:

```text
docs/testing/unit/UNIT_TEST_MATRIX.md
```

Linhas:

- unit;
- behavior;
- happy path;
- boundary;
- invalid input;
- duplicate;
- concurrency;
- idempotency;
- error;
- mutation;
- owner.

---

### 82. Criar Unit Test Risk Register

Arquivo:

```text
docs/testing/unit/UNIT_TEST_RISK_REGISTER.md
```

Riscos:

```text
coverage vanity;

overmocking;

fixture magica;

teste fragil;

assertion fraca;

clock real;

random instavel;

mutacao sobrevivente;

teste lento;

regra sem fronteira;

mock do dominio;

dependencia de infraestrutura.
```

---

### 83. Criar Unit Test Traceability

Arquivo:

```text
docs/testing/unit/UNIT_TEST_TRACEABILITY.md
```

Exemplo:

```text
INV mixed currency
-> Money and OrderProcess
-> OrderProcessRegistrationTest
-> mutation score.

INV duplicate external result
-> OrderProcessDuplicateResultTest
-> RecordPaymentAuthorizationResultHandlerTest.

ADR tenant isolation
-> OrderLoaderTest
-> handler tenant mismatch tests.

security authorization matrix
-> AccessPolicyTest.
```

---

### 84. Criar boundary da próxima aula

Arquivo:

```text
docs/testing/unit/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 690 define:

- unit test strategy;
- value object tests;
- aggregate tests;
- policy tests;
- handler tests;
- mapper tests;
- security unit tests;
- observability unit tests;
- test doubles;
- coverage;
- mutation testing.

A aula 691 define:

- PostgreSQL integration tests;
- Kafka integration tests;
- Flyway tests;
- repository tests;
- transaction tests;
- HTTP provider integration tests;
- messaging integration tests;
- Testcontainers;
- application context integration.

Nenhuma infraestrutura real
e iniciada nesta aula.
```

---

### 85. Executar testes unitários

Na raiz:

```powershell
.\mvnw.cmd `
  --batch-mode `
  -Dgroups=unit `
  test
```

Ou use profiles configurados no projeto.

---

### 86. Executar cobertura

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pcoverage
```

---

### 87. Executar mutation testing crítico

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain,
  libs/orderflow-application `
  -am `
  org.pitest:pitest-maven:mutationCoverage
```

---

### 88. Revisar testes sobreviventes

Para cada mutação sobrevivente:

- classifique;
- corrija teste quando aplicável;
- documente equivalente;
- remova código morto;
- atualize report.

---

### 89. Criar report

Arquivo:

```text
reports/unit-tests-final-report.yaml
```

Exemplo:

```yaml
unitTestsFinal:
  modules:
    total:
      6

  tests:
    total:
      214
    failures:
      0
    errors:
      0
    skipped:
      0

  coverage:
    domain:
      lines: 92
      branches: 88
    application:
      lines: 87
      branches: 82

  mutation:
    domain:
      score: 83
    application:
      score: 77

  infrastructure:
    started:
      false

  gate:
    PASS
```

---

### 90. Criar evidence

Arquivo:

```text
contracts/unit-tests-final-evidence.yaml
```

Campos:

- lesson;
- project;
- tested module count;
- value object test count;
- aggregate test count;
- policy test count;
- handler test count;
- mapper test count;
- security unit test count;
- observability unit test count;
- fake count;
- mock count;
- unit test total;
- failure count;
- error count;
- skipped count;
- domain line coverage;
- domain branch coverage;
- application line coverage;
- application branch coverage;
- domain mutation score;
- application mutation score;
- forbidden infrastructure usage count;
- flaky test count;
- documentation status;
- gate status;
- timestamp.

---

### 91. Criar gate unitário

Status:

```text
PASS;

FAIL_UNIT_TEST_STRUCTURE;

FAIL_VALUE_OBJECT_TEST;

FAIL_AGGREGATE_TEST;

FAIL_POLICY_TEST;

FAIL_HANDLER_TEST;

FAIL_MAPPER_TEST;

FAIL_SECURITY_UNIT_TEST;

FAIL_OBSERVABILITY_UNIT_TEST;

FAIL_TEST_DOUBLE_POLICY;

FAIL_ASSERTION_QUALITY;

FAIL_LINE_COVERAGE;

FAIL_BRANCH_COVERAGE;

FAIL_MUTATION_SCORE;

FAIL_FLAKY_TEST;

FAIL_TEST_DURATION;

FAIL_INFRASTRUCTURE_USAGE;

FAIL_UNIT_REPORT;

FAIL_INTEGRATION_ANTICIPATION;

INCONCLUSIVE.
```

---


### 92. Revisar qualidade além da porcentagem

Antes do gate, escolha uma amostra de testes críticos e faça revisão manual.

Confirme:

- o nome descreve comportamento;
- a preparação mostra somente dados relevantes;
- a ação principal é única;
- as assertions verificam estado, eventos e colaborações importantes;
- uma falha apresenta diagnóstico compreensível;
- o teste continua válido após refatoração interna;
- não existe dependência oculta de ordem;
- o cenário cobre uma fronteira real;
- o double escolhido corresponde à intenção;
- a regra quebrada faria o teste falhar.

Cobertura e mutation score ajudam a localizar lacunas.

A revisão humana confirma se a suíte também serve como documentação executável do projeto.

---

### 93. Executar validação final

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
  -Pcoverage
```

Confirme:

- unitários verdes;
- domain coverage;
- application coverage;
- branches cobertos;
- mutações críticas detectadas;
- nenhum teste flaky;
- nenhum PostgreSQL;
- nenhum Kafka;
- nenhum WireMock;
- nenhum Testcontainer.

---

### 94. Encerrar o laboratório

Confirme:

- strategy;
- naming;
- test data;
- fixtures;
- value objects;
- aggregate;
- policies;
- handlers;
- mappers;
- security;
- observability;
- fakes;
- mocks;
- coverage;
- mutation testing;
- matrix;
- risk register;
- traceability;
- report;
- evidence;
- gate aprovado;
- integração não implementada.

---

## Entendendo o que foi feito

### O domínio ganhou proteção comportamental

As invariantes foram testadas nas fronteiras.

### Os handlers ficaram verificáveis

Ports fake provaram coordenação sem framework.

### Idempotência ganhou testes fortes

Replay, conflito e rollback foram isolados.

### Mappers deixaram de ser pontos cegos

Contratos externos e internos foram traduzidos por casos explícitos.

### Segurança ganhou matriz unitária

Scopes, roles, claims e tenant foram cobertos.

### Telemetria ganhou controle

Sanitização e cardinalidade foram testadas.

### Cobertura ganhou contexto

Linhas e branches foram analisados por módulo.

### Mutation testing mediu força

A suíte passou a provar que detecta mudanças incorretas.

---

## Erros comuns importantes

### Testar método privado

Teste comportamento público.

### Mockar aggregate

Regras reais deixam de ser exercitadas.

### Usar fixture enorme

O teste perde legibilidade.

### Cobrir apenas happy path

Fronteiras continuam frágeis.

### Assertion somente `not null`

O comportamento não é provado.

### Usar `sleep`

O teste fica lento e flaky.

### Usar clock real

O resultado muda com o tempo.

### Buscar 100% a qualquer custo

Código trivial e configuração distorcem esforço.

### Ignorar mutação sobrevivente

A assertion pode estar fraca.

### Subir Testcontainers agora

Integração pertence à aula 691.

---

## Comandos úteis

### Testes unitários

```powershell
.\mvnw.cmd `
  test
```

### Coverage

```powershell
.\mvnw.cmd `
  clean `
  verify `
  -Pcoverage
```

### Mutation no domínio

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  org.pitest:pitest-maven:mutationCoverage
```

### Teste específico

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -Dtest=OrderProcessPaymentTest `
  test
```

---

## Exercício guiado

Implemente a suíte unitária do cenário:

```text
pagamento recusado
apos estoque reservado.
```

Inclua:

1. value objects;
2. aggregate builder;
3. stock reserved;
4. payment request;
5. payment rejected;
6. compensation planner;
7. release stock action;
8. domain events;
9. duplicate result;
10. divergent result;
11. handler;
12. Inbox fake;
13. repository fake;
14. Outbox fake;
15. audit fake;
16. transaction fake;
17. idempotency;
18. rollback;
19. tenant mismatch;
20. concurrency conflict;
21. mapper;
22. security policy;
23. telemetry;
24. coverage;
25. mutation testing;
26. evidence.

Não use infraestrutura real.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 689 e ponte para a aula 691 foram preservadas;
- Unit Test Strategy foi criada;
- dependências de teste foram padronizadas;
- Surefire foi configurado;
- Test Naming Policy foi criada;
- `@DisplayName` foi usado;
- Test Data Policy foi criada;
- fixtures explícitas foram criadas;
- fixture mágica foi evitada;
- Money foi testado;
- teste parametrizado de dinheiro foi criado;
- Quantity foi testada;
- ProductCode foi testado;
- TenantId foi testado;
- IdempotencyKey foi testada;
- OrderProcessBuilder foi criado;
- registro foi testado;
- linhas vazias foram testadas;
- moedas misturadas foram testadas;
- solicitação de estoque foi testada;
- estoque reservado foi testado;
- estoque recusado foi testado;
- estoque ambíguo foi testado;
- pagamento autorizado foi testado;
- pagamento recusado foi testado;
- pagamento duplicado foi testado;
- fulfillment foi testado;
- cancelamento elegível foi testado;
- cancelamento inelegível foi testado;
- compensações foram testadas;
- reconstituição foi testada;
- assertions de eventos foram criadas;
- CancellationEligibilityPolicy foi testada;
- CompensationPlanner foi testado;
- matriz parametrizada foi criada;
- fake repository foi criado;
- transaction fake foi criado;
- idempotency fake foi criado;
- Outbox fake foi criada;
- audit fake foi criado;
- RegisterOrderHandler foi testado;
- replay idempotente foi testado;
- key em processamento foi testada;
- conflito de key foi testado;
- falha de Outbox foi testada;
- handler de estoque foi testado;
- resultado de pagamento foi testado;
- tenant incorreto foi testado;
- concurrency conflict foi testado;
- OrderLoader foi testado;
- DomainEventCollector foi testado;
- OrderApiMapper foi testado;
- provider mappers foram testados;
- message mappers foram testados;
- upcasters foram testados;
- JwtAudienceValidator foi testado;
- TenantClaimValidator foi testado;
- authentication converter foi testado;
- AccessPolicy foi testada;
- TelemetrySanitizer foi testado;
- cardinalidade foi testada;
- JourneyTelemetry foi testada;
- OrderFlowLogContext foi testado;
- Test Double Policy foi criada;
- value objects não foram mockados;
- `verifyNoMoreInteractions` foi usado somente com intenção;
- ArgumentCaptor foi limitado;
- deep stubs foram evitados;
- Coverage Policy foi criada;
- JaCoCo foi configurado;
- exclusões foram justificadas;
- relatório por módulo foi criado;
- Mutation Testing Policy foi criada;
- PIT foi configurado;
- mutações sobreviventes foram classificadas;
- teste para mutação real foi criado;
- mutation score foi definido;
- unit e integration foram separados;
- tags JUnit foram criadas;
- orçamento de tempo foi definido;
- testes flaky foram evitados;
- Unit Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 691 foi criado;
- testes unitários foram executados;
- coverage foi executada;
- mutation testing foi executado;
- mutações foram revisadas;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- infraestrutura real não foi antecipada.

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
  -Pcoverage
```

Adicione:

```powershell
git add `
  libs/orderflow-domain/src/test `
  libs/orderflow-application/src/test `
  libs/orderflow-observability/src/test `
  apps/orderflow-api/src/test `
  apps/integration-gateway/src/test `
  libs/orderflow-contracts/src/test `
  docs/testing/unit `
  reports/unit-tests-final-report.yaml `
  contracts/unit-tests-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "PostgreSQLContainer|KafkaContainer|WireMockServer|jdbc:PostgreSQL|bootstrap-servers|docker compose"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "test(unit): strengthen OrderFlow behavior suite"
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

- Testcontainers;
- Kafka;
- PostgreSQL;
- WireMock;
- Docker Compose;
- conteúdo detalhado da aula 691.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou os testes unitários do projeto final OrderFlow.

Você criou:

```text
unit test strategy;

test naming;

test data policy;

value object tests;

aggregate tests;

policy tests;

handler tests;

mapper tests;

security tests;

observability tests;

fakes;

mocks intencionais;

coverage reports;

mutation testing;

test matrix;

risk register;

traceability;

report, evidence e gate.
```

A suíte agora prova comportamento sem depender de infraestrutura.

A próxima aula será:

```text
691 - M20.21 - Testes integracao projeto final
```

Nela, você conectará módulos reais e infraestrutura com PostgreSQL, Flyway, Kafka, Testcontainers, WireMock, Spring Boot context, transactions, repositories, Outbox, Inbox, consumers, providers e projections.

Nenhuma infraestrutura real foi iniciada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Testei value objects.
- [ ] Testei aggregate.
- [ ] Testei policies.
- [ ] Testei handlers.
- [ ] Testei mappers.
- [ ] Testei segurança.
- [ ] Testei observabilidade.
- [ ] Criei fakes.
- [ ] Usei mocks com intenção.
- [ ] Medi coverage.
- [ ] Medi mutation score.
- [ ] Evitei infraestrutura real.
- [ ] Preservei integração para a aula 691.

---

## Troubleshooting adicional

### Teste quebra ao refatorar

Talvez esteja acoplado à implementação.

### Mutation score baixo

Revise fronteiras e assertions.

### Coverage alta com bug

A linha foi executada, mas o resultado não foi verificado.

### Mockito acusa strict stubbing

Remova stubs não usados.

### Fixture esconde regra

Traga o dado relevante para o teste.

### Teste usa hora atual

Substitua por clock fixo.

### Suite demora muito

Procure infraestrutura, sleeps e setup excessivo.

### Fake diverge do port

Mantenha contract tests do fake ou simplifique.

### Teste de mapper chama HTTP

Separe DTO e client.

### Quero subir PostgreSQL

Essa etapa pertence à aula 691.

---

## Perguntas de revisão

1. O que caracteriza teste unitário?
2. Unidade é sempre uma classe?
3. O que deve ser testado?
4. Mock é obrigatório?
5. Value object deve ser mockado?
6. O que é fake?
7. O que é stub?
8. O que é mock?
9. O que é spy?
10. Cobertura prova qualidade?
11. O que branch coverage mostra?
12. O que mutation testing faz?
13. O que é mutação sobrevivente?
14. Por que usar clock fixo?
15. Por que evitar random?
16. O que parameterized test ajuda?
17. Quando usar ArgumentCaptor?
18. Por que evitar deep stubs?
19. O que JaCoCo mede?
20. O que PIT mede?
21. Unit test pode usar Kafka?
22. O que a aula 691 fará?
23. O que não foi iniciado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Isolamento sem infraestrutura.
2. Não.
3. Comportamento observável.
4. Não.
5. Não.
6. Implementação simples em memória.
7. Resposta controlada.
8. Verificação de colaboração.
9. Objeto real observado.
10. Não.
11. Decisões exercitadas.
12. Altera código para testar força.
13. Mudança não detectada.
14. Determinismo.
15. Evitar instabilidade.
16. Cobrir matriz de casos.
17. Quando o argumento é resultado relevante.
18. Indicam boundary confusa.
19. Linhas e branches.
20. Força dos testes.
21. Não nesta aula.
22. Integração com infraestrutura real.
23. PostgreSQL, Kafka e Testcontainers.
24. Testes integração projeto final.
25. Provar regras de forma rápida.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 690 - M20.20 - Testes unitarios projeto final

- Continuei após Deploy ou simulação.
- Criei Unit Test Strategy.
- Padronizei dependências de teste.
- Configurei Surefire.
- Criei Test Naming Policy.
- Usei `@DisplayName`.
- Criei Test Data Policy.
- Criei fixtures explícitas.
- Evitei fixture mágica.
- Testei Money.
- Criei parameterized tests.
- Testei Quantity.
- Testei ProductCode.
- Testei TenantId.
- Testei IdempotencyKey.
- Criei OrderProcessBuilder.
- Testei registro.
- Testei linhas vazias.
- Testei moedas misturadas.
- Testei solicitação de estoque.
- Testei estoque reservado.
- Testei estoque recusado.
- Testei estoque ambíguo.
- Testei pagamento autorizado.
- Testei pagamento recusado.
- Testei pagamento duplicado.
- Testei fulfillment.
- Testei cancelamento elegível.
- Testei cancelamento inelegível.
- Testei compensações.
- Testei reconstituição.
- Criei assertions de eventos.
- Testei CancellationEligibilityPolicy.
- Testei CompensationPlanner.
- Criei matrizes parametrizadas.
- Criei repository fake.
- Criei transaction fake.
- Criei idempotency fake.
- Criei Outbox fake.
- Criei audit fake.
- Testei RegisterOrderHandler.
- Testei replay idempotente.
- Testei key em processamento.
- Testei conflito de key.
- Testei falha de Outbox.
- Testei handler de estoque.
- Testei resultado de pagamento.
- Testei tenant incorreto.
- Testei concurrency conflict.
- Testei OrderLoader.
- Testei DomainEventCollector.
- Testei OrderApiMapper.
- Testei provider mappers.
- Testei message mappers.
- Testei upcasters.
- Testei JwtAudienceValidator.
- Testei TenantClaimValidator.
- Testei authentication converter.
- Testei AccessPolicy.
- Testei TelemetrySanitizer.
- Testei cardinalidade.
- Testei JourneyTelemetry.
- Testei OrderFlowLogContext.
- Criei Test Double Policy.
- Evitei mocks de value objects.
- Usei Mockito com intenção.
- Criei Coverage Policy.
- Configurei JaCoCo.
- Justifiquei exclusões.
- Criei relatório por módulo.
- Criei Mutation Testing Policy.
- Configurei PIT.
- Classifiquei mutações sobreviventes.
- Criei testes para mutações reais.
- Defini mutation score.
- Separei unit e integration.
- Criei tags JUnit.
- Defini orçamento de tempo.
- Evitei testes flaky.
- Criei Unit Test Matrix.
- Criei Unit Test Risk Register.
- Criei Unit Test Traceability.
- Criei boundary para a aula 691.
- Executei testes unitários.
- Executei coverage.
- Executei mutation testing.
- Revisei mutações.
- Criei report, evidence e gate.
- Não antecipei infraestrutura real.
- Próxima aula: Testes integracao projeto final.
```

---

## Referência técnica curta

- JUnit 5.
- AssertJ.
- Mockito.
- Parameterized Test.
- Test Builder.
- Object Mother.
- Fake.
- Stub.
- Mock.
- Spy.
- JaCoCo.
- Branch Coverage.
- Mutation Testing.
- PIT.
- Deterministic Test.
- Test Fixture.
- Test Double.
- Flaky Test.

Regra final:

```text
A suíte unitária final do OrderFlow deve provar comportamento sem infraestrutura: JUnit 5, AssertJ e Mockito são padronizados, tests usam nomes legíveis, clocks fixos, IDs determinísticos e fixtures pequenas, value objects são reais e cobrem validade, fronteiras, igualdade e moeda, OrderProcess tests cobrem registro, estoque, pagamento, fulfillment, cancelamento, compensação, duplicidade, ambiguidade, eventos e reconstituição, policies usam matrizes parametrizadas, handlers usam fakes para repository, transaction, idempotency, Inbox, Outbox, audit, clock e identifiers e comprovam replay, conflito, rollback, tenant isolation e optimistic concurrency, mappers cobrem contracts conhecidos e desconhecidos, security tests cobrem audience, tenant claim, authorities e policies, observability tests cobrem sanitizer, MDC, journey metrics e cardinalidade, mocks não substituem domínio, deep stubs e assertions fracas são evitados, JaCoCo mede linhas e branches por módulo, PIT altera regras críticas e mutações sobreviventes geram novos testes ou justificativas, a suíte possui tags, orçamento de duração e zero dependência de relógio, random, banco, Kafka, HTTP ou Docker; o gate termina com testes, coverage, mutation score, report e evidence aprovados, enquanto PostgreSQL, Flyway, Kafka, Testcontainers, WireMock, Spring context, transactions reais, repositories reais e consumers reais permanecem reservados para a aula 691.
```
