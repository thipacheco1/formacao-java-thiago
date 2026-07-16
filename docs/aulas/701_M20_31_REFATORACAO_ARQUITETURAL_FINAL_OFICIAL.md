# 701 - M20.31 - Refatoracao arquitetural final

## Apresentação da aula

Na aula 700, você concluiu a segunda parte da correção técnica final do OrderFlow.

O projeto passou a possuir:

- findings críticos e altos encerrados;
- documentação alinhada ao runtime;
- reports regenerados;
- evidence rastreável;
- scripts padronizados;
- links e assets validados;
- OpenAPI e Postman sincronizados;
- README coerente;
- guia local revisado;
- runbook revisado;
- catálogo final de artifacts;
- gates completos aprovados;
- correção técnica encerrada.

Agora o sistema está consistente.

A próxima etapa é diferente.

Nesta aula, você realizará a refatoração arquitetural final.

Refatorar arquitetura não significa trocar tecnologias, criar novos módulos por entusiasmo ou redesenhar o projeto inteiro.

O objetivo é melhorar a estrutura interna mantendo:

- os mesmos contratos HTTP;
- os mesmos schemas;
- os mesmos eventos;
- os mesmos fluxos;
- as mesmas garantias;
- os mesmos comportamentos observáveis;
- os mesmos gates.

A pergunta central será:

```text
a arquitetura atual
expressa com clareza
as responsabilidades,
boundaries,
dependencias
e decisoes
que o projeto afirma possuir?
```

Durante a construção do projeto, algumas responsabilidades podem ter se deslocado.

Exemplos:

- controller conhece detalhe de persistência;
- consumer conhece implementação concreta;
- módulo application importa classe de adapter;
- package mistura domínio e infraestrutura;
- runtime possui lógica de negócio;
- interface existe apenas para esconder uma classe;
- port possui método específico demais para um adapter;
- DTO HTTP atravessa até o domínio;
- entidade JPA vaza para query;
- worker compartilha código por cópia;
- configuração contém regra;
- módulo comum virou depósito de utilitários;
- composição de beans não deixa as dependências visíveis;
- architecture tests não protegem todos os boundaries.

A refatoração final buscará:

- coesão;
- baixo acoplamento;
- direção de dependência;
- boundaries explícitos;
- responsabilidades claras;
- packages orientados ao domínio;
- ports com linguagem de negócio;
- adapters substituíveis;
- runtimes finos;
- composição visível;
- testes arquiteturais;
- documentação atualizada.

O projeto continuará sendo OrderFlow.

Nenhuma feature será adicionada.

A próxima aula será:

```text
702 - M20.32 - Narrativa tecnica portfolio
```

Na aula 702, você transformará as decisões, trade-offs, resultados e evidências do projeto em uma narrativa técnica profissional para portfólio, entrevistas, LinkedIn, currículo e apresentação oral.

Nesta aula, nenhuma narrativa de portfólio será produzida.

O laboratório será:

```text
labs/m20/aula-701-refatoracao-arquitetural-final/orderflow-architecture-refactoring
```

Regra central:

```text
refatoracao arquitetural final
melhora estrutura
sem alterar promessa externa;

ela torna o desenho
mais verdadeiro,
mais simples
e mais protegido.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
698:
Runbook do projeto.

699:
Correcao tecnica final parte 1.

700:
Correcao tecnica final parte 2.

701:
Refatoracao arquitetural final.

702:
Narrativa tecnica portfolio.

703:
Curriculo tecnico.
```

A aula 701 utiliza como fonte:

- código final corrigido;
- ADRs;
- architecture tests;
- matriz de dependências;
- módulos Maven;
- packages;
- ports;
- adapters;
- aplicações executáveis;
- OpenAPI;
- contratos de mensagens;
- reports;
- evidence;
- decisions logs.

A refatoração será guiada por comportamento preservado.

O processo correto será:

```text
baseline;

mapa atual;

finding arquitetural;

hipotese;

mudanca pequena;

teste;

comparacao;

documentacao;

gate.
```

Não comece movendo arquivos.

Primeiro entenda:

- por que o módulo existe;
- quem depende dele;
- qual responsabilidade possui;
- quais contratos expõe;
- quais testes o protegem;
- qual risco a mudança reduz.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/architecture/refactoring-final
├── ARCHITECTURE_REFACTORING_CHARTER.md
├── CURRENT_ARCHITECTURE_MAP.md
├── TARGET_ARCHITECTURE_MAP.md
├── MODULE_RESPONSIBILITY_MATRIX.md
├── DEPENDENCY_DIRECTION_POLICY.md
├── PACKAGE_STRUCTURE_POLICY.md
├── PORTS_AND_ADAPTERS_POLICY.md
├── RUNTIME_COMPOSITION_POLICY.md
├── SHARED_CODE_POLICY.md
├── ARCHITECTURE_FINDING_REGISTRY.md
├── REFACTORING_DECISION_LOG.md
├── REFACTORING_SEQUENCE.md
├── ARCHITECTURE_REGRESSION_PLAN.md
├── ARCHITECTURE_ACCEPTANCE_CHECKLIST.md
├── ARCHITECTURE_RISK_REGISTER.md
├── ARCHITECTURE_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/architecture
├── collect-architecture-baseline.ps1
├── generate-module-graph.ps1
├── scan-package-dependencies.ps1
├── scan-runtime-responsibilities.ps1
├── validate-ports-and-adapters.ps1
├── validate-module-cycles.ps1
├── validate-package-cycles.ps1
├── run-architecture-regression.ps1
├── compare-architecture-baseline.ps1
├── generate-architecture-report.ps1
└── collect-architecture-evidence.ps1
```

Artifacts:

```text
reports/architecture-refactoring-final-report.yaml

contracts/architecture-refactoring-final-evidence.yaml
```

Branch recomendada:

```text
refactor/final-architecture
```

---

## Conceito essencial

### Arquitetura é dependência

Diagramas ajudam, mas a arquitetura real está no código.

Ela aparece em:

- imports;
- módulos;
- construtores;
- beans;
- packages;
- chamadas;
- schemas;
- dados;
- deploy.

### Boundary precisa ter motivo

Um boundary útil protege:

- regra;
- mudança;
- integração;
- equipe;
- segurança;
- consistência;
- operação.

Criar camada sem motivo apenas adiciona indireção.

### Port pertence ao lado que precisa dele

Uma port de saída usada pelo application pertence ao boundary de application.

O adapter implementa a port.

O adapter não define o contrato que o application precisa.

### Runtime deve compor, não governar o domínio

Uma aplicação executável pode:

- criar beans;
- carregar configuração;
- registrar endpoints;
- iniciar consumers;
- conectar adapters.

Ela não deveria concentrar regras de negócio.

### Refatoração precisa preservar comportamento

Os mesmos testes externos precisam continuar passando.

---

## Mão na massa guiada

### 1. Criar Architecture Refactoring Charter

Arquivo:

```text
docs/architecture/refactoring-final/ARCHITECTURE_REFACTORING_CHARTER.md
```

Princípios:

```text
behavior is preserved;

external contracts do not change;

boundaries follow responsibilities;

dependencies point inward;

ports use domain language;

adapters contain technology;

runtimes compose;

shared code is intentional;

every structural change has architecture regression;

portfolio narrative belongs to lesson 702.
```

---

### 2. Criar branch

```powershell
git switch `
  -c `
  refactor/final-architecture
```

A working tree precisa estar limpa.

---

### 3. Registrar baseline

Execute:

```powershell
git rev-parse HEAD

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

---

### 4. Criar collector de baseline

Arquivo:

```text
scripts/architecture/collect-architecture-baseline.ps1
```

Colete:

- commit;
- módulos;
- dependências Maven;
- packages;
- architecture tests;
- APIs públicas;
- contratos;
- duração dos testes;
- ciclos;
- findings conhecidos.

---

### 5. Criar Current Architecture Map

Arquivo:

```text
docs/architecture/refactoring-final/CURRENT_ARCHITECTURE_MAP.md
```

Mapeie:

- applications;
- libraries;
- inbound adapters;
- outbound adapters;
- ports;
- shared modules;
- data flows;
- runtime composition.

---

### 6. Gerar grafo de módulos

`generate-module-graph.ps1` precisa representar:

```text
modulo A
-> depende de
modulo B.
```

Inclua dependências de teste separadamente.

---

### 7. Identificar dependências transitivas

Uma dependência não declarada diretamente pode chegar por outro módulo.

Registre quando isso cria acoplamento oculto.

---

### 8. Criar Target Architecture Map

Arquivo:

```text
docs/architecture/refactoring-final/TARGET_ARCHITECTURE_MAP.md
```

O target precisa ser incremental.

Não desenhe uma arquitetura impossível de alcançar com mudanças seguras.

---

## Responsabilidade dos módulos

### 9. Criar Module Responsibility Matrix

Arquivo:

```text
docs/architecture/refactoring-final/MODULE_RESPONSIBILITY_MATRIX.md
```

Colunas:

- módulo;
- responsabilidade;
- entradas;
- saídas;
- dependências permitidas;
- dependências proibidas;
- owner;
- evidence.

---

### 10. Revisar `orderflow-domain`

Deve conter:

- aggregate;
- entities;
- value objects;
- domain services;
- policies;
- domain events;
- domain errors.

Não deve conter:

- Spring;
- JPA;
- Kafka;
- HTTP;
- Jackson específico de adapter;
- environment variables.

---

### 11. Revisar `orderflow-application`

Deve conter:

- commands;
- queries;
- handlers;
- ports;
- transaction orchestration;
- application DTOs internos;
- use-case results.

Não deve conter:

- controller;
- entity JPA;
- Kafka record;
- WireMock;
- Docker;
- provider SDK concreto.

---

### 12. Revisar `orderflow-persistence`

Deve conter:

- entities JPA;
- repositories Spring Data;
- mappers de persistência;
- adapters de ports;
- Flyway integration support;
- transaction implementation.

Não deve conter regra de negócio.

---

### 13. Revisar `orderflow-contracts`

Deve conter contratos compartilhados de forma controlada:

- message metadata;
- schemas;
- event envelopes;
- versioning;
- serializers quando realmente compartilhados.

Não deve virar módulo geral de utilidades.

---

### 14. Revisar `orderflow-observability`

Deve fornecer:

- abstrações de telemetria;
- conventions;
- sanitização;
- meter helpers;
- tracing helpers.

Não deve conhecer fluxo de negócio específico demais.

---

### 15. Revisar aplicações executáveis

Aplicações:

- API;
- Outbox Publisher;
- Orchestration Worker;
- Integration Gateway;
- Projection Worker.

Cada uma precisa ter propósito único.

---

## Direção de dependência

### 16. Criar Dependency Direction Policy

Arquivo:

```text
docs/architecture/refactoring-final/DEPENDENCY_DIRECTION_POLICY.md
```

Regra:

```text
runtime
-> adapters
-> application
-> domain.
```

Dependências técnicas laterais precisam ser justificadas.

---

### 17. Detectar inversão incorreta

Exemplos:

- domain importando adapter;
- application importando JPA;
- controller importando repository;
- consumer importando provider client concreto.

---

### 18. Corrigir dependência pelo boundary certo

Passos:

1. localizar necessidade;
2. definir linguagem;
3. criar ou ajustar port;
4. implementar adapter;
5. alterar composição;
6. testar comportamento;
7. adicionar regra arquitetural.

---

### 19. Evitar port genérica

Ruim:

```text
DataService;

ExternalService;

CommonRepository.
```

Bom:

```text
LoadOrderProcessPort;

SaveOrderProcessPort;

ReserveStockPort;

AuthorizePaymentPort.
```

---

### 20. Evitar port específica da tecnologia

Ruim:

```text
JpaSaveOrderPort;

KafkaPublishPort.
```

A port deve expressar necessidade do caso de uso.

---

### 21. Revisar direção entre libraries

Bibliotecas não devem depender de applications executáveis.

---

### 22. Revisar dependências de teste

Fixtures de teste podem criar acoplamento indevido.

Mantenha test utilities em escopo claro.

---

## Packages

### 23. Criar Package Structure Policy

Arquivo:

```text
docs/architecture/refactoring-final/PACKAGE_STRUCTURE_POLICY.md
```

Escolha organização principal:

```text
por feature dentro do boundary;

ou por responsabilidade,
quando o modulo e pequeno.
```

Evite mistura imprevisível.

---

### 24. Revisar package do domínio

Exemplo:

```text
domain/order
├── model
├── policy
├── event
└── error
```

A estrutura deve acompanhar a linguagem do domínio.

---

### 25. Revisar package da aplicação

Exemplo:

```text
application/order/register
application/order/cancel
application/order/query
application/order/reconcile
```

---

### 26. Revisar package dos adapters

Exemplo:

```text
adapter/in/http
adapter/in/messaging
adapter/out/persistence
adapter/out/provider
adapter/out/telemetry
```

---

### 27. Evitar package `util`

Antes de mover algo para `util`, pergunte:

- qual conceito representa?
- quem é owner?
- qual boundary?
- por que é compartilhado?

---

### 28. Evitar package `common` genérica

Shared code precisa de semântica.

---

### 29. Corrigir nomes ambíguos

Classes como:

```text
Manager;

Processor;

Helper;

ServiceImpl.
```

precisam de responsabilidade explícita.

---

### 30. Preservar API pública

Mover package público exige cuidado.

Para artifacts internos, ajuste imports.

Para contrato externo, mantenha compatibilidade.

---

## Ports e adapters

### 31. Criar Ports and Adapters Policy

Arquivo:

```text
docs/architecture/refactoring-final/PORTS_AND_ADAPTERS_POLICY.md
```

---

### 32. Classificar ports de entrada

Exemplos:

- RegisterOrderUseCase;
- GetOrderQuery;
- RequestCancellationUseCase;
- ReconcileOrderUseCase.

---

### 33. Classificar ports de saída

Exemplos:

- LoadOrderProcessPort;
- SaveOrderProcessPort;
- AppendOutboxMessagePort;
- AcquireIdempotencyPort;
- ReserveStockPort;
- AuthorizePaymentPort.

---

### 34. Revisar granularidade

Port grande demais cria acoplamento.

Port pequena demais cria fragmentação artificial.

---

### 35. Revisar tipos das ports

Ports devem receber tipos:

- de domínio;
- de aplicação;
- value objects apropriados.

Evite DTO HTTP e entity JPA.

---

### 36. Revisar exceptions das ports

Converta falhas técnicas em erros definidos para o boundary.

---

### 37. Revisar adapter de persistência

Ele deve:

- mapear;
- consultar;
- salvar;
- traduzir exception;
- preservar tenant;
- respeitar transaction.

---

### 38. Revisar adapter de Kafka

Ele deve:

- serializar;
- publicar;
- configurar headers;
- classificar resultado técnico.

Não decide regra do aggregate.

---

### 39. Revisar adapter de provider

Ele deve:

- autenticar;
- montar request;
- aplicar timeout;
- normalizar response;
- traduzir erro.

---

### 40. Revisar inbound HTTP

Controller deve:

- validar formato;
- criar command;
- chamar use case;
- mapear response;
- mapear error.

---

### 41. Revisar inbound messaging

Consumer deve:

- receber;
- validar envelope;
- deduplicar;
- mapear;
- chamar handler;
- confirmar depois do commit.

---

## Composição de runtimes

### 42. Criar Runtime Composition Policy

Arquivo:

```text
docs/architecture/refactoring-final/RUNTIME_COMPOSITION_POLICY.md
```

---

### 43. Tornar composition root explícito

Cada aplicação precisa de ponto claro onde:

- ports;
- adapters;
- configuration;
- policies;
- clients;
- telemetry;

são conectados.

---

### 44. Evitar component scan amplo

Scan amplo pode registrar beans não intencionais.

Defina packages e configurações com clareza.

---

### 45. Revisar conditional beans

Condição precisa ser:

- explícita;
- testada;
- documentada;
- segura por default.

---

### 46. Revisar profiles

Profile não deve mudar regra de negócio.

Ele pode mudar adapter e configuração.

---

### 47. Revisar configuration properties

Agrupe por componente.

Valide no startup.

---

### 48. Revisar lifecycle

Workers precisam:

- startup controlado;
- graceful shutdown;
- health;
- timeout;
- resource cleanup.

---

### 49. Revisar threads

Evite criação manual dispersa.

Use executors configurados e observáveis.

---

### 50. Revisar transações nos runtimes

Anotações transacionais devem permanecer próximas do boundary adequado.

---

## Código compartilhado

### 51. Criar Shared Code Policy

Arquivo:

```text
docs/architecture/refactoring-final/SHARED_CODE_POLICY.md
```

---

### 52. Classificar shared code

Categorias permitidas:

- contract;
- observability convention;
- test fixture;
- foundational value.

---

### 53. Remover compartilhamento acidental

Código copiado pode ser melhor que abstração errada.

Extraia somente quando:

- semântica é igual;
- evolução é conjunta;
- owner é claro.

---

### 54. Revisar helpers de teste

Test fixture não deve virar dependency de produção.

---

### 55. Revisar constants

Constante de negócio pertence ao domínio.

Constante técnica pertence ao adapter ou configuration.

---

### 56. Revisar mappers

Cada boundary deve ter mapper próprio quando modelos têm responsabilidades diferentes.

---

## Coesão e acoplamento

### 57. Medir coesão qualitativa

Pergunte por classe e package:

- existe uma razão principal para mudar?
- os métodos trabalham sobre o mesmo conceito?
- as dependências pertencem à mesma responsabilidade?

---

### 58. Detectar classe orquestradora excessiva

Sinais:

- muitos ports;
- muitos branches;
- transação longa;
- conhecimento de vários providers;
- dezenas de reasons para mudar.

---

### 59. Extrair policy quando regra é domínio

Não extraia apenas para reduzir linhas.

---

### 60. Extrair coordinator quando fluxo é aplicação

O coordinator organiza etapas.

O aggregate continua decidindo invariantes.

---

### 61. Detectar acoplamento temporal

Exemplo:

```text
metodo A
precisa ser chamado
antes de B
sem que o tipo expresse isso.
```

Use estado, command ou API mais explícita.

---

### 62. Detectar acoplamento por dados

Muitos parâmetros primitivos podem indicar missing concept.

---

### 63. Introduzir value object somente com benefício

A refatoração final não deve criar dezenas de wrappers sem ganho.

---

## Findings arquiteturais

### 64. Criar Architecture Finding Registry

Arquivo:

```text
docs/architecture/refactoring-final/ARCHITECTURE_FINDING_REGISTRY.md
```

Campos:

- ID;
- boundary;
- atual;
- esperado;
- risco;
- severidade;
- mudança;
- testes;
- status.

---

### 65. Criar Decision Log

Arquivo:

```text
docs/architecture/refactoring-final/REFACTORING_DECISION_LOG.md
```

Decisões:

- corrigir;
- aceitar;
- simplificar;
- remover abstração;
- adiar com justificativa.

---

### 66. Não medir sucesso por quantidade de arquivos movidos

A métrica é risco reduzido e clareza aumentada.

---

### 67. Priorizar findings

Ordem:

1. direção de dependência;
2. boundary quebrado;
3. responsabilidade duplicada;
4. runtime com regra;
5. port mal posicionada;
6. package ambígua;
7. naming.

---

## Sequência de refatoração

### 68. Criar Refactoring Sequence

Arquivo:

```text
docs/architecture/refactoring-final/REFACTORING_SEQUENCE.md
```

---

### 69. Refatorar um boundary por vez

Exemplo:

```text
persistence
antes de
messaging.
```

---

### 70. Criar checkpoint por boundary

Após cada boundary:

- compile;
- unit;
- architecture;
- integration;
- diff;
- commit.

---

### 71. Evitar mega commit

Commits recomendados:

```text
refactor(architecture): isolate persistence adapter

refactor(architecture): clarify messaging ports

refactor(architecture): simplify runtime composition
```

---

### 72. Preservar git history

Mova arquivos separadamente quando possível.

Depois altere conteúdo.

---

### 73. Evitar formatação global

Ela esconde mudanças relevantes.

---

## Architecture tests

### 74. Criar Architecture Regression Plan

Arquivo:

```text
docs/architecture/refactoring-final/ARCHITECTURE_REGRESSION_PLAN.md
```

---

### 75. Testar domínio sem framework

Regra:

```text
domain
nao depende
de Spring,
JPA,
Kafka,
HTTP
ou Jackson de adapter.
```

---

### 76. Testar aplicação sem adapters

---

### 77. Testar controllers

Controllers não acessam repositories ou provider clients.

---

### 78. Testar consumers

Consumers chamam ports de entrada ou handlers aprovados.

---

### 79. Testar adapters

Outbound adapters implementam ports do boundary correto.

---

### 80. Testar dependências Maven

Use Enforcer ou validação equivalente.

---

### 81. Testar ciclos de packages

Nenhum ciclo novo é permitido.

---

### 82. Testar naming de packages

Packages seguem policy.

---

### 83. Testar visibilidade

Classes internas não ficam públicas sem necessidade.

---

### 84. Testar composição

O runtime sobe com os beans esperados.

---

## Refatoração guiada de exemplo

### 85. Identificar finding

Cenário:

```text
OrderController
depende diretamente
de Spring Data repository.
```

---

### 86. Registrar comportamento atual

O endpoint funciona, mas o boundary está quebrado.

---

### 87. Definir target

Controller depende de:

```text
GetOrderQuery.
```

Application depende de:

```text
LoadOrderViewPort.
```

Persistence implementa a port.

---

### 88. Criar port de entrada

```java
package br.com.formacao.orderflow.application.order.query;

public interface GetOrderQuery {

    OrderQueryResult execute(
            GetOrderCommand command);
}
```

---

### 89. Criar command

```java
package br.com.formacao.orderflow.application.order.query;

public record GetOrderCommand(
        String tenantId,
        String orderId) {
}
```

No projeto real, use value objects aprovados.

---

### 90. Criar port de saída

```java
package br.com.formacao.orderflow.application.order.query;

import java.util.Optional;

public interface LoadOrderViewPort {

    Optional<OrderQueryResult> find(
            String tenantId,
            String orderId);
}
```

---

### 91. Implementar handler

O handler:

- valida tenant;
- chama port;
- traduz ausência;
- retorna resultado.

---

### 92. Implementar adapter JPA

O adapter usa repository Spring Data e mapper.

---

### 93. Atualizar controller

O controller conhece apenas a port de entrada.

---

### 94. Atualizar composition root

Registre handler e adapter.

---

### 95. Criar architecture test

O teste falha se controller importar repository.

---

### 96. Executar regressão

Valide:

- status;
- response;
- tenant;
- not found;
- cross-tenant;
- performance smoke.

---

## Diagramas e ADRs

### 97. Atualizar diagramas

Current e target precisam refletir o estado final.

---

### 98. Atualizar ADR somente quando decisão mudou

Movimentação interna sem mudança de decisão pode exigir apenas nota de implementação.

---

### 99. Criar ADR de simplificação quando necessário

Uma abstração removida pode merecer decisão quando afeta o desenho geral.

---

### 100. Atualizar C4 ou Mermaid

Diagramas não podem continuar mostrando módulos removidos ou dependências antigas.

---

## Validação funcional

### 101. Executar unitários

```powershell
.\mvnw.cmd `
  --batch-mode `
  test
```

---

### 102. Executar integration tests

```powershell
.\mvnw.cmd `
  --batch-mode `
  verify `
  -Pintegration-tests
```

---

### 103. Executar contract-security

```powershell
.\mvnw.cmd `
  --batch-mode `
  verify `
  -Pcontract-security-tests
```

---

### 104. Executar architecture regression

```powershell
.\scripts\architecture\run-architecture-regression.ps1
```

---

### 105. Executar OpenAPI diff

Nenhuma mudança externa é esperada.

---

### 106. Executar Postman

A collection positiva e negativa precisa continuar passando.

---

### 107. Executar smoke

Valide jornada síncrona e assíncrona.

---

### 108. Comparar performance smoke

A refatoração não deve introduzir degradação grave.

---

## Revisão da arquitetura final

### 109. Revisar grafo de módulos

Confirme:

- direção;
- ausência de ciclos;
- dependências justificadas;
- modules sem orphan.

---

### 110. Revisar grafo de packages

---

### 111. Revisar composition roots

---

### 112. Revisar ports

Pergunte:

- linguagem correta?
- owner correto?
- granularidade adequada?
- tipo correto?
- adapter substituível?

---

### 113. Revisar adapters

Pergunte:

- tecnologia está contida?
- error é traduzido?
- configuração é externa?
- telemetria está presente?
- teste de integração existe?

---

### 114. Revisar runtimes

Pergunte:

- responsabilidade única?
- startup claro?
- health?
- graceful shutdown?
- sem regra de negócio?

---

### 115. Revisar shared code

---

### 116. Revisar simplificações

Remova interface, módulo ou helper que não protege mudança real.

---

## Governança

### 117. Criar Acceptance Checklist

Arquivo:

```text
docs/architecture/refactoring-final/ARCHITECTURE_ACCEPTANCE_CHECKLIST.md
```

Itens:

- baseline;
- current map;
- target map;
- module matrix;
- dependency policy;
- package policy;
- ports;
- adapters;
- runtimes;
- shared code;
- findings;
- tests;
- diagrams;
- gates;
- no external change;
- lesson 702 preserved.

---

### 118. Criar Risk Register

Arquivo:

```text
docs/architecture/refactoring-final/ARCHITECTURE_RISK_REGISTER.md
```

Riscos:

```text
mega refactor;

contrato alterado;

port generica;

abstracao sem motivo;

package movement sem ganho;

runtime quebrado;

component scan amplo;

teste arquitetural fraco;

performance regression;

documentacao divergente;

portfolio antecipado.
```

---

### 119. Criar Traceability

Arquivo:

```text
docs/architecture/refactoring-final/ARCHITECTURE_TRACEABILITY.md
```

Exemplo:

```text
AR-004 controller repository dependency
-> GetOrderQuery
-> LoadOrderViewPort
-> JpaOrderViewAdapter
-> ArchUnit rule
-> integration test.

AR-009 application imports Kafka type
-> application message command
-> Kafka inbound mapper
-> dependency rule.

AR-013 runtime owns business branch
-> application coordinator
-> runtime composition update
-> behavior regression.
```

---

### 120. Criar boundary da próxima aula

Arquivo:

```text
docs/architecture/refactoring-final/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 701 define:

- architecture baseline;
- current and target maps;
- module responsibilities;
- dependency direction;
- package structure;
- ports and adapters;
- runtime composition;
- shared code;
- cohesion and coupling;
- architecture findings;
- refactoring sequence;
- architecture tests;
- diagrams and ADR alignment;
- architecture evidence.

A aula 702 define:

- technical portfolio narrative;
- project pitch;
- problem and context;
- decisions;
- trade-offs;
- implementation journey;
- technical challenges;
- results;
- evidence selection;
- interview narrative;
- written portfolio version;
- oral presentation version.

Nenhuma narrativa tecnica de portfolio
e produzida nesta aula.
```

---

## Reports e evidence

### 121. Criar report

Arquivo:

```text
reports/architecture-refactoring-final-report.yaml
```

Exemplo:

```yaml
architectureRefactoringFinal:
  baseline:
    modules:
      10
    packageCycles:
      0

  findings:
    total:
      12
    resolved:
      11
    accepted:
      1
    openCritical:
      0
    openHigh:
      0

  validation:
    moduleCycles:
      PASS
    packageCycles:
      PASS
    dependencyDirection:
      PASS
    portsAdapters:
      PASS
    runtimeComposition:
      PASS
    externalContracts:
      UNCHANGED
    regression:
      PASS

  portfolioNarrative:
    completed:
      false

  gate:
    PASS
```

Os números precisam vir da execução real.

---

### 122. Criar evidence

Arquivo:

```text
contracts/architecture-refactoring-final-evidence.yaml
```

Campos:

- lesson;
- project;
- baseline commit;
- final commit;
- module count before;
- module count after;
- package cycle count before;
- package cycle count after;
- architecture finding count;
- resolved count;
- accepted count;
- open critical count;
- open high count;
- forbidden dependency count before;
- forbidden dependency count after;
- generic port count before;
- generic port count after;
- runtime business rule count before;
- runtime business rule count after;
- architecture test count;
- unit status;
- integration status;
- contract-security status;
- OpenAPI diff status;
- Postman status;
- smoke status;
- performance smoke status;
- diagram status;
- ADR status;
- portfolio narrative completed;
- documentation status;
- gate status;
- timestamp.

---

### 123. Criar gate arquitetural

Status:

```text
PASS;

FAIL_ARCHITECTURE_BASELINE;

FAIL_CURRENT_MAP;

FAIL_TARGET_MAP;

FAIL_MODULE_RESPONSIBILITY;

FAIL_DEPENDENCY_DIRECTION;

FAIL_MODULE_CYCLE;

FAIL_PACKAGE_CYCLE;

FAIL_PACKAGE_POLICY;

FAIL_PORT_OWNERSHIP;

FAIL_PORT_GRANULARITY;

FAIL_ADAPTER_BOUNDARY;

FAIL_RUNTIME_COMPOSITION;

FAIL_SHARED_CODE;

FAIL_COHESION;

FAIL_COUPLING;

FAIL_ARCHITECTURE_TEST;

FAIL_EXTERNAL_CONTRACT_CHANGE;

FAIL_UNIT_GATE;

FAIL_INTEGRATION_GATE;

FAIL_CONTRACT_SECURITY_GATE;

FAIL_OPENAPI_DIFF;

FAIL_POSTMAN_GATE;

FAIL_SMOKE;

FAIL_PERFORMANCE_REGRESSION;

FAIL_DIAGRAM;

FAIL_ADR_ALIGNMENT;

FAIL_PORTFOLIO_ANTICIPATION;

INCONCLUSIVE.
```

---

### 124. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\architecture\validate-module-cycles.ps1

.\scripts\architecture\validate-package-cycles.ps1

.\scripts\architecture\run-architecture-regression.ps1

.\scripts\architecture\compare-architecture-baseline.ps1

.\scripts\architecture\collect-architecture-evidence.ps1
```

Confirme:

- contratos externos inalterados;
- zero ciclo;
- zero dependência proibida;
- ports claras;
- adapters contidos;
- runtimes finos;
- testes verdes;
- narrativa de portfólio não iniciada.

---

### 125. Encerrar o laboratório

Confirme:

- Charter;
- branch;
- baseline;
- current map;
- target map;
- module matrix;
- dependency policy;
- package policy;
- ports;
- adapters;
- runtime composition;
- shared code;
- cohesion;
- coupling;
- finding registry;
- decision log;
- sequence;
- architecture tests;
- refactoring example;
- diagrams;
- ADRs;
- functional gates;
- acceptance;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 702 preservada.

---

## Entendendo o que foi feito

### A arquitetura passou a refletir o código

Diagramas, módulos e imports agora contam a mesma história.

### Boundaries ficaram mais claros

Domínio, aplicação, adapters e runtimes possuem responsabilidades distintas.

### Ports ganharam linguagem de negócio

Interfaces genéricas ou tecnológicas foram reduzidas.

### Adapters passaram a conter tecnologia

JPA, Kafka, HTTP e providers não vazam para o núcleo.

### Runtimes ficaram mais finos

Eles compõem o sistema em vez de decidir regras.

### Packages ficaram orientados a conceitos

`util`, `common` e nomes ambíguos perderam espaço.

### Shared code ganhou critérios

Reuso deixou de ser objetivo isolado.

### Architecture tests protegeram a estrutura

O desenho deixou de depender apenas de disciplina humana.

### Contratos externos permaneceram estáveis

A refatoração melhorou a estrutura sem mudar a promessa do sistema.

---

## Erros comuns importantes

### Refatorar sem baseline

Não existe comparação confiável.

### Mover tudo de uma vez

O diff fica impossível de revisar.

### Criar port para cada método

A arquitetura fica fragmentada.

### Criar abstração por estética

A indireção não protege mudança.

### Deixar regra no runtime

A composição vira domínio oculto.

### Compartilhar código cedo demais

Módulos ficam acoplados.

### Atualizar teste para aceitar regressão

O comportamento externo muda sem decisão.

### Alterar OpenAPI durante refatoração

O escopo foi rompido.

### Ignorar performance smoke

Mais indireção pode trazer custo inesperado.

### Criar narrativa de portfólio agora

Essa etapa pertence à aula 702.

---

## Comandos úteis

### Baseline

```powershell
.\scripts\architecture\collect-architecture-baseline.ps1
```

### Grafo

```powershell
.\scripts\architecture\generate-module-graph.ps1
```

### Ciclos

```powershell
.\scripts\architecture\validate-module-cycles.ps1

.\scripts\architecture\validate-package-cycles.ps1
```

### Regressão

```powershell
.\scripts\architecture\run-architecture-regression.ps1
```

---

## Exercício principal

Refatore o cenário:

```text
consumer Kafka
depende diretamente
de um adapter JPA
para atualizar o pedido.
```

Inclua:

1. registrar finding;
2. mapear dependência;
3. identificar boundary;
4. criar command;
5. criar inbound port;
6. criar handler;
7. usar repository port;
8. preservar Inbox;
9. preservar transaction;
10. preservar Outbox;
11. remover import JPA;
12. ajustar mapper;
13. ajustar composition root;
14. criar architecture test;
15. criar unit test;
16. criar integration test;
17. testar duplicate;
18. testar rollback;
19. testar tenant;
20. testar offset;
21. executar OpenAPI diff;
22. executar Postman;
23. executar smoke;
24. atualizar diagrama;
25. registrar decisão.

Não produza a narrativa de portfólio.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 700 e ponte para a aula 702 foram preservadas;
- Architecture Refactoring Charter foi criado;
- branch foi criada;
- baseline foi registrada;
- collector foi criado;
- Current Architecture Map foi criado;
- grafo de módulos foi criado;
- dependências transitivas foram analisadas;
- Target Architecture Map foi criado;
- Module Responsibility Matrix foi criada;
- domain foi revisado;
- application foi revisado;
- persistence foi revisada;
- contracts foi revisado;
- observability foi revisada;
- aplicações foram revisadas;
- Dependency Direction Policy foi criada;
- inversões foram detectadas;
- boundaries foram corrigidos;
- ports genéricas foram evitadas;
- ports tecnológicas foram evitadas;
- libraries foram revisadas;
- dependências de teste foram revisadas;
- Package Structure Policy foi criada;
- packages do domínio foram revisadas;
- packages da aplicação foram revisadas;
- packages dos adapters foram revisadas;
- `util` genérico foi evitado;
- `common` genérico foi evitado;
- nomes ambíguos foram corrigidos;
- API pública foi preservada;
- Ports and Adapters Policy foi criada;
- inbound ports foram classificadas;
- outbound ports foram classificadas;
- granularidade foi revisada;
- tipos das ports foram revisados;
- exceptions foram revisadas;
- persistence adapter foi revisado;
- Kafka adapter foi revisado;
- provider adapter foi revisado;
- HTTP inbound foi revisado;
- messaging inbound foi revisado;
- Runtime Composition Policy foi criada;
- composition roots foram explicitados;
- component scan foi limitado;
- conditional beans foram revisados;
- profiles foram revisados;
- configuration properties foram revisadas;
- lifecycle foi revisado;
- threads foram revisadas;
- transações foram revisadas;
- Shared Code Policy foi criada;
- shared code foi classificado;
- compartilhamento acidental foi removido;
- fixtures foram revisadas;
- constants foram revisadas;
- mappers foram revisados;
- coesão foi avaliada;
- classes orquestradoras foram revisadas;
- policies foram extraídas quando necessário;
- coordinators foram extraídos quando necessário;
- acoplamento temporal foi revisado;
- acoplamento por dados foi revisado;
- value objects foram introduzidos somente com benefício;
- Finding Registry foi criado;
- Decision Log foi criado;
- sucesso não foi medido por arquivos movidos;
- findings foram priorizados;
- Refactoring Sequence foi criada;
- um boundary por vez foi refatorado;
- checkpoints foram criados;
- mega commit foi evitado;
- git history foi preservado;
- formatação global foi evitada;
- Architecture Regression Plan foi criado;
- domínio sem framework foi testado;
- application sem adapters foi testada;
- controllers foram testados;
- consumers foram testados;
- adapters foram testados;
- dependências Maven foram testadas;
- ciclos de packages foram testados;
- naming foi testado;
- visibilidade foi testada;
- composição foi testada;
- exemplo guiado foi implementado;
- diagramas foram atualizados;
- ADRs foram atualizados quando necessário;
- unitários foram executados;
- integração foi executada;
- contrato e segurança foram executados;
- architecture regression foi executada;
- OpenAPI diff foi executado;
- Postman foi executado;
- smoke foi executado;
- performance smoke foi comparado;
- grafos foram revisados;
- composition roots foram revisados;
- ports foram revisadas;
- adapters foram revisados;
- runtimes foram revisados;
- shared code foi revisado;
- simplificações foram revisadas;
- Acceptance Checklist foi criado;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 702 foi criado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- narrativa técnica de portfólio não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\architecture\run-architecture-regression.ps1

.\scripts\validate-secrets.ps1
```

Adicione somente arquivos relacionados à refatoração:

```powershell
git add `
  apps `
  libs `
  docs/architecture `
  scripts/architecture `
  reports/architecture-refactoring-final-report.yaml `
  contracts/architecture-refactoring-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|pending-marker|temporary-marker|generic-marker|portfolio-story|productionUrl|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "refactor(architecture): clarify OrderFlow boundaries"
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

- feature nova;
- alteração de contrato;
- secret;
- narrativa da aula 702.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu a refatoração arquitetural final do OrderFlow.

Você revisou:

```text
architecture baseline;

current and target maps;

module responsibilities;

dependency direction;

package structure;

ports and adapters;

runtime composition;

shared code;

cohesion;

coupling;

architecture findings;

refactoring sequence;

architecture tests;

diagrams;

ADRs;

functional regression;

architecture report;

architecture evidence.
```

O projeto agora expressa com mais clareza o desenho que afirma possuir.

A próxima aula será:

```text
702 - M20.32 - Narrativa tecnica portfolio
```

Nela, você transformará o projeto em uma narrativa técnica profissional, explicando contexto, problema, decisões, trade-offs, desafios, implementação, resultados, evidências, aprendizados e valor demonstrado.

Nenhuma narrativa técnica de portfólio foi produzida nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Registrei baseline.
- [ ] Mapeei arquitetura atual.
- [ ] Defini arquitetura alvo.
- [ ] Revisei módulos.
- [ ] Corrigi dependências.
- [ ] Revisei packages.
- [ ] Revisei ports.
- [ ] Revisei adapters.
- [ ] Revisei runtimes.
- [ ] Revisei shared code.
- [ ] Reduzi acoplamento.
- [ ] Aumentei coesão.
- [ ] Criei architecture tests.
- [ ] Preservei contratos.
- [ ] Preservei narrativa para a aula 702.

---

## Troubleshooting adicional

### Refatoração quebra muitos testes

Reduza o lote e volte ao último checkpoint.

### ArchUnit acusa dependência transitiva

Revise imports, annotations e test fixtures.

### Port ficou genérica

Volte à necessidade do caso de uso.

### Runtime continua com branches de negócio

Extraia coordinator ou policy no boundary correto.

### Module graph ficou mais complexo

A mudança pode ter aumentado acoplamento.

### Package move quebrou Spring scan

Revise composition root e packages explícitos.

### OpenAPI mudou

Interrompa e identifique a mudança externa.

### Postman falha depois da refatoração

Verifique comportamento, não apenas wiring.

### Performance smoke piorou

Compare criação de objetos, proxies e chamadas adicionais.

### Quero escrever a história do projeto

Essa etapa pertence à aula 702.

---

## Perguntas de revisão

1. Arquitetura existe apenas em diagramas?
2. O que é boundary?
3. Onde uma outbound port pertence?
4. Adapter define regra?
5. Runtime deve fazer o quê?
6. Domain pode importar Spring?
7. Application pode importar JPA?
8. Controller pode acessar repository?
9. Por que evitar port genérica?
10. O que package comunica?
11. `util` é sempre errado?
12. O que é composition root?
13. Profile pode mudar regra?
14. Shared code é sempre melhor?
15. O que é coesão?
16. O que é acoplamento temporal?
17. Por que refatorar um boundary por vez?
18. O que architecture test protege?
19. Pode alterar OpenAPI?
20. Como medir sucesso?
21. O que report arquitetural registra?
22. O que a aula 702 fará?
23. O que não foi produzido?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Limite de responsabilidade.
3. No lado que precisa dela.
4. Não.
5. Compor.
6. Não.
7. Não.
8. Não.
9. Reduz linguagem e proteção.
10. Responsabilidade.
11. Não, mas exige semântica.
12. Ponto de composição.
13. Não.
14. Não.
15. Elementos relacionados juntos.
16. Ordem implícita de chamadas.
17. Reduzir risco.
18. Direção e boundaries.
19. Não nesta aula.
20. Risco e clareza.
21. Before, after e gates.
22. Narrativa técnica de portfólio.
23. Narrativa profissional.
24. Narrativa tecnica portfolio.
25. Melhorar estrutura sem mudar promessa.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 701 - M20.31 - Refatoracao arquitetural final

- Continuei após Correção técnica final parte 2.
- Criei Architecture Refactoring Charter.
- Criei branch de refatoração.
- Registrei baseline.
- Criei collector.
- Criei Current Architecture Map.
- Gerei grafo de módulos.
- Analisei dependências transitivas.
- Criei Target Architecture Map.
- Criei Module Responsibility Matrix.
- Revisei domain.
- Revisei application.
- Revisei persistence.
- Revisei contracts.
- Revisei observability.
- Revisei aplicações executáveis.
- Criei Dependency Direction Policy.
- Detectei inversões.
- Corrigi boundaries.
- Evitei ports genéricas e tecnológicas.
- Revisei libraries e test dependencies.
- Criei Package Structure Policy.
- Revisei packages de domain, application e adapters.
- Reduzi util e common genéricos.
- Corrigi nomes ambíguos.
- Preservei API pública.
- Criei Ports and Adapters Policy.
- Classifiquei inbound e outbound ports.
- Revisei granularidade, tipos e exceptions.
- Revisei persistence, Kafka e provider adapters.
- Revisei HTTP e messaging inbound.
- Criei Runtime Composition Policy.
- Explicitei composition roots.
- Limitei component scan.
- Revisei beans condicionais, profiles e properties.
- Revisei lifecycle, threads e transactions.
- Criei Shared Code Policy.
- Classifiquei shared code.
- Removi compartilhamento acidental.
- Revisei fixtures, constants e mappers.
- Avaliei coesão.
- Reduzi classes orquestradoras.
- Extraí policies e coordinators quando necessário.
- Revisei acoplamento temporal e por dados.
- Criei Architecture Finding Registry.
- Criei Decision Log.
- Priorizei findings.
- Criei Refactoring Sequence.
- Refatorei um boundary por vez.
- Criei checkpoints e commits pequenos.
- Preservei histórico.
- Evitei formatação global.
- Criei Architecture Regression Plan.
- Testei domain, application, controllers, consumers e adapters.
- Testei dependências Maven, ciclos, naming, visibilidade e composição.
- Implementei o exemplo guiado.
- Atualizei diagramas e ADRs.
- Executei unitários, integração, contrato e segurança.
- Executei architecture regression.
- Executei OpenAPI diff, Postman e smoke.
- Comparei performance smoke.
- Revisei grafos, ports, adapters, runtimes e shared code.
- Criei Acceptance Checklist.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 702.
- Criei report, evidence e gate.
- Não antecipei narrativa de portfólio.
- Próxima aula: Narrativa tecnica portfolio.
```

---

## Referência técnica curta

- Architecture Refactoring.
- Boundary.
- Dependency Direction.
- Module.
- Package.
- Port.
- Adapter.
- Inbound Adapter.
- Outbound Adapter.
- Composition Root.
- Cohesion.
- Coupling.
- Package Cycle.
- Module Cycle.
- ArchUnit.
- Maven Enforcer.
- Shared Code.
- Runtime Composition.
- Behavior Preservation.

Regra final:

```text
A refatoração arquitetural final do OrderFlow deve melhorar estrutura sem alterar comportamento externo: baseline registra commit, modules, dependencies, packages, cycles, tests and contracts, current and target maps tornam o desenho explícito, responsibility matrix define entradas, saídas e dependências permitidas de domain, application, persistence, contracts, observability and executable apps, dependency policy mantém runtime -> adapters -> application -> domain, ports pertencem ao lado que precisa delas e usam linguagem de negócio, controllers e consumers chamam inbound ports, outbound adapters contêm JPA, Kafka, HTTP and providers, DTO HTTP, entity JPA and Kafka record não atravessam o núcleo, package policy organiza conceitos e reduz util, common, Manager and Helper genéricos, composition roots ligam beans com scan, profiles and conditions explícitos, runtimes fazem startup, health and lifecycle sem governar invariantes, shared code só existe com semântica e evolução conjunta, cohesion and coupling review identifica orchestrators excessivos, temporal coupling and missing concepts, findings são refatorados um boundary por vez com commits pequenos, architecture tests bloqueiam framework no domain, adapters na application, repositories em controllers, concrete clients em consumers, module and package cycles, external contracts permanecem unchanged, unit, integration, contract-security, OpenAPI, Postman, smoke and performance smoke gates são reexecutados, diagrams and ADRs refletem o estado final, e o gate fecha boundaries, ports, adapters, runtimes, tests, report and evidence enquanto a narrativa escrita e oral de contexto, decisões, trade-offs, desafios, resultados e aprendizados permanece reservada para a aula 702.
```
