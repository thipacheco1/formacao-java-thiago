# 699 - M20.29 - Correcao tecnica final parte 1

## Apresentação da aula

Na aula 698, você criou o Runbook do projeto OrderFlow.

O projeto passou a possuir procedimentos para:

- classificação de incidentes;
- definição de papéis;
- comunicação operacional;
- triagem geral;
- indisponibilidade da API;
- falhas do PostgreSQL;
- falhas do Flyway;
- backlog da Outbox;
- indisponibilidade do Kafka;
- consumer lag;
- retry topics;
- DLQ;
- indisponibilidade de providers;
- resultados ambíguos;
- projection desatualizada;
- anomalias de autenticação;
- anomalias de autorização;
- exposição de secrets;
- degradação da observabilidade;
- saturação de capacidade;
- regressão de release;
- rollback;
- roll-forward;
- recuperação;
- coleta de evidências;
- exercícios tabletop.

O OrderFlow agora possui implementação, documentação, testes, operação e evidências.

Mas um projeto complexo acumula pequenos desvios durante sua construção.

Esses desvios podem aparecer como:

- regra implementada de forma diferente do ADR;
- porta de aplicação acessando adapter diretamente;
- transaction boundary extensa;
- repository sem tenant em uma consulta;
- migration válida, porém sem índice necessário;
- mensagem com metadata incompleta;
- retry aplicado a erro permanente;
- log com informação excessiva;
- teste que passa sem verificar comportamento;
- configuração duplicada;
- script divergente do guia;
- report com número inconsistente;
- link apontando para artifact antigo;
- gate que existe, mas não está ligado ao fluxo principal.

Nesta aula, você iniciará a correção técnica final do projeto.

O trabalho será dividido em duas partes oficiais:

```text
699:
Correcao tecnica final parte 1.

700:
Correcao tecnica final parte 2.
```

A primeira parte será orientada aos riscos mais graves:

- código;
- arquitetura;
- domínio;
- aplicação;
- persistência;
- transações;
- mensageria;
- integrações;
- segurança;
- configuração;
- testes de regressão.

A segunda parte consolidará os itens restantes:

- documentação;
- rastreabilidade;
- reports;
- evidence;
- scripts auxiliares;
- experiência do consumidor;
- acabamento final;
- consistência global;
- validação definitiva do projeto.

A correção final não significa reescrever o sistema.

Ela significa:

```text
identificar desvios comprovados;

priorizar por risco;

corrigir com menor mudanca segura;

criar regressao;

atualizar evidence;

reexecutar gates.
```

Você não corrigirá itens apenas porque o código poderia ser escrito de outra forma.

Cada alteração precisa possuir:

- finding;
- evidência;
- impacto;
- prioridade;
- correção;
- teste;
- decisão;
- resultado.

O laboratório será:

```text
labs/m20/aula-699-correcao-tecnica-final-parte-1/orderflow-final-correction-part-1
```

A próxima aula será:

```text
700 - M20.30 - Correcao tecnica final parte 2
```

Regra central:

```text
correcao tecnica final
nao e refatoracao por preferencia;

e reducao de risco
guiada por findings,
testes,
evidencias
e gates.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
696:
README profissional.

697:
Guia de execucao local.

698:
Runbook do projeto.

699:
Correcao tecnica final parte 1.

700:
Correcao tecnica final parte 2.

701:
Auditoria final de seguranca e qualidade.
```

A aula 699 utiliza como fonte:

- ADRs;
- código;
- architecture tests;
- unit tests;
- integration tests;
- contract tests;
- security tests;
- performance reports;
- runbooks;
- OpenAPI;
- Postman;
- CI/CD;
- deployment evidence;
- risk registers;
- gate reports;
- evidence contracts.

A revisão precisa respeitar o escopo já aprovado.

Não antecipe novas features.

Não adicione:

- novo provider;
- novo banco;
- novo broker;
- nova arquitetura;
- nova interface pública;
- novo módulo sem finding;
- tecnologia por curiosidade.

O objetivo é estabilizar.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/final-correction
├── FINAL_CORRECTION_CHARTER.md
├── SCOPE_FREEZE.md
├── BASELINE_SNAPSHOT.md
├── FINDING_CLASSIFICATION.md
├── FINDING_REGISTRY_PART_1.md
├── CORRECTION_DECISION_LOG_PART_1.md
├── ARCHITECTURE_CORRECTION_PLAN.md
├── DOMAIN_CORRECTION_PLAN.md
├── APPLICATION_CORRECTION_PLAN.md
├── PERSISTENCE_CORRECTION_PLAN.md
├── MESSAGING_CORRECTION_PLAN.md
├── INTEGRATION_CORRECTION_PLAN.md
├── SECURITY_CORRECTION_PLAN.md
├── CONFIGURATION_CORRECTION_PLAN.md
├── REGRESSION_TEST_PLAN_PART_1.md
├── PART_1_ACCEPTANCE_CHECKLIST.md
├── PART_1_RISK_REGISTER.md
├── PART_1_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/final-correction
├── collect-baseline.ps1
├── aggregate-gates.ps1
├── scan-source-consistency.ps1
├── scan-architecture-boundaries.ps1
├── scan-security-regressions.ps1
├── scan-configuration-drift.ps1
├── validate-finding-registry.ps1
├── run-part-1-regression.ps1
├── compare-baseline.ps1
├── generate-part-1-report.ps1
└── collect-part-1-evidence.ps1
```

Artifacts:

```text
reports/final-correction-part-1-report.yaml

contracts/final-correction-part-1-evidence.yaml
```

Branch recomendada:

```text
fix/final-correction-part-1
```

---

## Conceito essencial

### Finding precisa ser reproduzível

Um finding válido contém:

- identificador;
- origem;
- descrição;
- cenário;
- resultado atual;
- resultado esperado;
- impacto;
- severidade;
- evidência;
- owner;
- status.

### Severidade não é preferência

Categorias:

```text
CRITICAL:
risco de seguranca,
perda de dados,
isolamento quebrado
ou indisponibilidade ampla.

HIGH:
inconsistencia funcional,
duplicidade,
transacao incorreta,
mensageria insegura
ou falha relevante de operacao.

MEDIUM:
degradacao controlada,
manutenibilidade
ou evidência incompleta.

LOW:
acabamento,
padronizacao
ou melhoria sem risco imediato.
```

A parte 1 prioriza:

```text
CRITICAL;

HIGH;

MEDIUM que bloqueia gate critico.
```

### Correção precisa de teste de regressão

Sem teste, o finding pode retornar.

### Menor mudança segura é preferível

Evite ampliar o blast radius durante a estabilização.

### Baseline precisa ser preservada

Antes da primeira correção, registre:

- commit;
- testes;
- gates;
- reports;
- digests;
- findings;
- duração;
- failures.

---

## Mão na massa guiada

### 1. Criar Final Correction Charter

Arquivo:

```text
docs/final-correction/FINAL_CORRECTION_CHARTER.md
```

Princípios:

```text
scope is frozen;

findings require evidence;

critical and high come first;

minimal safe change;

every correction adds regression coverage;

no hidden suppression;

reports are regenerated;

part 2 is preserved.
```

---

### 2. Criar Scope Freeze

Arquivo:

```text
docs/final-correction/SCOPE_FREEZE.md
```

Congele:

- módulos;
- endpoints;
- eventos;
- providers;
- schemas;
- segurança;
- deployment model.

Mudança de escopo exige decisão explícita e não pertence ao fluxo normal desta aula.

---

### 3. Criar branch

```powershell
git switch `
  -c `
  fix/final-correction-part-1
```

Confirme working tree limpa antes.

---

### 4. Registrar commit inicial

```powershell
git rev-parse HEAD
```

Salve no baseline.

---

### 5. Criar baseline snapshot

Arquivo:

```text
docs/final-correction/BASELINE_SNAPSHOT.md
```

Inclua:

- commit;
- data UTC;
- Java;
- Maven;
- Docker;
- módulos;
- testes;
- gates;
- reports;
- findings conhecidos.

---

### 6. Criar `collect-baseline.ps1`

O script coleta:

- versões;
- `git status`;
- commit;
- unit tests;
- integration tests;
- contract-security;
- architecture;
- documentation;
- secret scan;
- compose validation.

---

### 7. Não corrigir antes do baseline

Sem baseline, não existe comparação confiável.

---

## Agregação de gates

### 8. Criar `aggregate-gates.ps1`

O script lê reports anteriores e consolida:

- status;
- failures;
- warnings;
- skips;
- inconsistências;
- artifacts ausentes.

---

### 9. Mapear gates obrigatórios

Gates:

- build;
- architecture;
- unit;
- integration;
- contract;
- security;
- Docker;
- observability;
- performance;
- OpenAPI;
- Postman;
- local execution;
- runbook.

---

### 10. Detectar falso positivo

Um report não pode marcar `PASS` quando:

- teste não executou;
- artifact está ausente;
- count é zero indevidamente;
- timestamp é antigo;
- source commit diverge;
- campo obrigatório está vazio.

---

### 11. Detectar falso negativo

Falha por ambiente precisa ser classificada.

Não converta automaticamente em `PASS`.

Use:

```text
INCONCLUSIVE
```

quando não existe prova suficiente.

---

## Registro de findings

### 12. Criar Finding Classification

Arquivo:

```text
docs/final-correction/FINDING_CLASSIFICATION.md
```

Defina:

- severity;
- probability;
- impact;
- exploitability;
- detectability;
- recovery cost;
- gate affected.

---

### 13. Criar registry

Arquivo:

```text
docs/final-correction/FINDING_REGISTRY_PART_1.md
```

Formato:

```text
FC1-001;

category;

severity;

source;

evidence;

expected;

actual;

owner;

status;

correction commit;

regression test.
```

---

### 14. Validar duplicidade

Findings equivalentes precisam ser agrupados.

Não conte o mesmo problema em cinco reports como cinco bugs diferentes.

---

### 15. Criar Decision Log

Arquivo:

```text
docs/final-correction/CORRECTION_DECISION_LOG_PART_1.md
```

Registre:

- corrigir;
- aceitar;
- adiar para parte 2;
- não reproduzido;
- falso positivo;
- fora de escopo.

---

### 16. Proibir fechamento sem evidência

Status `RESOLVED` exige:

- diff;
- teste;
- gate;
- evidence;
- commit.

---

## Código e compilação

### 17. Executar build limpo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Registre falhas antes de alterar.

---

### 18. Tratar warnings relevantes

Priorize warnings que indicam:

- nullability;
- deprecated API crítica;
- unchecked conversion insegura;
- resource leak;
- serialização instável;
- configuração duplicada.

---

### 19. Não transformar todos os warnings em finding crítico

Classifique pelo risco real.

---

### 20. Criar source consistency scan

O script procura:

- marcadores de trabalho pendente;
- comentários temporários;
- textos genéricos não substituídos;
- hardcoded secrets;
- endpoints reais;
- sleeps em testes;
- random não controlado;
- timezone implícita;
- `System.out`;
- exception engolida.

Cada ocorrência precisa ser classificada. Um comentário que explica uma
limitação conhecida pode permanecer quando está ligado a um finding e a uma
decisão registrada. Um marcador que substitui implementação, configuração,
teste ou documentação precisa ser removido. A correção não deve apenas apagar
a palavra encontrada: ela deve verificar se existe comportamento incompleto
por trás do texto. O relatório do scan registra arquivo, linha, categoria,
severidade, decisão e commit responsável.

---

## Arquitetura

### 21. Criar Architecture Correction Plan

Arquivo:

```text
docs/final-correction/ARCHITECTURE_CORRECTION_PLAN.md
```

Verifique:

- dependências entre módulos;
- ports;
- adapters;
- domain purity;
- application isolation;
- runtime wiring.

---

### 22. Executar architecture tests

Valide:

- domain não depende de Spring;
- application não depende de JPA;
- controllers não acessam repository;
- consumers não chamam adapter concreto;
- modules respeitam direction.

---

### 23. Corrigir dependência proibida

Estratégia:

- criar port somente quando necessário;
- mover interface para boundary correto;
- adaptar wiring;
- preservar comportamento;
- adicionar ArchUnit test.

---

### 24. Verificar ciclos

Módulos não podem formar ciclos Maven ou Java.

---

### 25. Verificar acesso a classes internas

Adapters não devem depender de detalhes privados de outros adapters.

---

### 26. Validar public API interna

Reduza visibilidade quando possível, sem grande refatoração.

---

## Domínio

### 27. Criar Domain Correction Plan

Arquivo:

```text
docs/final-correction/DOMAIN_CORRECTION_PLAN.md
```

Priorize invariantes.

---

### 28. Revisar transições

Matriz:

- registered;
- stock pending;
- stock reserved;
- payment pending;
- payment authorized;
- fulfillment pending;
- completed;
- compensating;
- cancelled;
- reconciliation pending.

---

### 29. Corrigir transição inválida

Uma transição proibida precisa:

- lançar erro de domínio;
- não alterar estado;
- não incrementar versão;
- não emitir evento.

---

### 30. Revisar duplicidade externa

Mesmo operation ID e mesmo payload:

- no-op idempotente.

Mesmo operation ID e payload diferente:

- finding;
- erro;
- audit;
- nenhuma mutação.

---

### 31. Revisar resultados ambíguos

Timeout não pode virar recusa confirmada.

---

### 32. Revisar compensações

Valide:

- ações necessárias;
- ordem;
- deduplicação;
- conclusão parcial;
- falha;
- retry;
- estado terminal.

---

### 33. Revisar value objects

Verifique:

- null;
- vazio;
- limites;
- normalização;
- igualdade;
- serialização;
- mensagens de erro.

---

### 34. Revisar collections

Exponha cópias imutáveis ou defensivas.

---

### 35. Revisar eventos de domínio

Confirme:

- type;
- version;
- tenant;
- aggregate;
- timestamp;
- correlation;
- payload mínimo.

---

## Aplicação

### 36. Criar Application Correction Plan

Arquivo:

```text
docs/final-correction/APPLICATION_CORRECTION_PLAN.md
```

---

### 37. Revisar handlers

Cada handler precisa:

- validar command;
- resolver tenant;
- carregar aggregate;
- aplicar domínio;
- persistir;
- auditar;
- persistir Outbox;
- retornar resultado.

---

### 38. Revisar ordem transacional

Idempotência, aggregate, audit e Outbox precisam respeitar o boundary definido.

---

### 39. Revisar idempotência

Cenários:

- acquire;
- replay;
- in progress;
- conflict;
- failure;
- completion.

---

### 40. Corrigir completion prematuro

A idempotência não pode ser marcada `COMPLETED` antes do commit funcional.

---

### 41. Revisar optimistic concurrency

Conflito precisa:

- abortar transação;
- não processar Inbox;
- não publicar Outbox;
- retornar erro controlado.

---

### 42. Revisar tenant propagation

Tenant precisa atravessar:

- command;
- repository;
- audit;
- Outbox;
- message;
- logs.

---

### 43. Revisar clock e IDs

Use ports determinísticos.

Evite `Instant.now()` e UUID aleatório espalhados nos handlers.

---

### 44. Revisar exceptions

Não exponha exceptions de adapter como contrato público.

---

## Persistência

### 45. Criar Persistence Correction Plan

Arquivo:

```text
docs/final-correction/PERSISTENCE_CORRECTION_PLAN.md
```

---

### 46. Revisar mappings JPA

Valide:

- cascade;
- orphan removal;
- fetch;
- version;
- enum;
- timestamp;
- JSON;
- collections.

---

### 47. Revisar tenant em queries

Toda consulta funcional precisa filtrar tenant.

Adicione integration test quando corrigir.

---

### 48. Revisar chaves

PK e FK precisam preservar tenant quando o modelo exigir isolamento estrutural.

---

### 49. Revisar optimistic lock

A versão persistida precisa corresponder à versão do aggregate.

---

### 50. Revisar migrations

Verifique:

- ordem;
- checksum;
- constraints;
- defaults;
- nullability;
- indexes;
- rollback strategy.

---

### 51. Não editar migration aplicada

Crie nova migration.

---

### 52. Revisar índices críticos

Priorize:

- aggregate por tenant e ID;
- Outbox pending;
- Outbox lease;
- Inbox message;
- idempotency key;
- projection lookup;
- audit timeline.

---

### 53. Validar plano de query

Use dados sintéticos representativos.

---

### 54. Revisar transaction isolation

Não aumente isolamento global sem evidência.

---

## Outbox e Inbox

### 55. Revisar atomicidade da Outbox

Aggregate e Outbox precisam commitar juntos.

---

### 56. Revisar claim

Valide:

- `SKIP LOCKED`;
- batch;
- lease owner;
- lease expiry;
- ordering;
- recuperação.

---

### 57. Corrigir lease presa

A lease precisa expirar de forma segura.

---

### 58. Revisar status de publicação

Não marcar `PUBLISHED` antes da confirmação do producer.

---

### 59. Revisar Inbox

Valide:

- unique message;
- consumer scope;
- fingerprint;
- processed;
- failed;
- retry.

---

### 60. Corrigir duplicate divergente

Não processe payload diferente com mesmo message ID.

---

## Mensageria

### 61. Criar Messaging Correction Plan

Arquivo:

```text
docs/final-correction/MESSAGING_CORRECTION_PLAN.md
```

---

### 62. Revisar envelope

Metadata obrigatória:

- message ID;
- type;
- version;
- tenant;
- aggregate;
- correlation;
- causation;
- producer;
- occurred at.

---

### 63. Revisar keys

Eventos do mesmo pedido precisam manter ordering.

---

### 64. Revisar consumer groups

Nomes precisam ser:

- estáveis;
- versionados;
- separados por aplicação;
- separados por ambiente.

---

### 65. Revisar retry classifier

Erros permanentes não entram em loop.

---

### 66. Revisar retry metadata

Preserve:

- original topic;
- partition;
- offset;
- attempt;
- first failure;
- last failure;
- reason sanitizado.

---

### 67. Revisar DLQ

DLQ precisa manter diagnóstico sem secret.

---

### 68. Revisar offset commit

Commit somente depois do efeito funcional persistido.

---

### 69. Revisar replay

Replay precisa:

- audit;
- rate limit;
- idempotência;
- stop condition;
- evidence.

---

## Integrações

### 70. Criar Integration Correction Plan

Arquivo:

```text
docs/final-correction/INTEGRATION_CORRECTION_PLAN.md
```

---

### 71. Revisar timeouts

Cada provider precisa de timeout explícito.

---

### 72. Revisar retries

Retry somente para erro transitório e operação idempotente.

---

### 73. Revisar operation IDs

Mesma intenção usa mesmo operation ID.

---

### 74. Revisar circuit breaker

Breaker precisa:

- threshold;
- window;
- open duration;
- half-open;
- metrics.

---

### 75. Revisar bulkhead

Um provider lento não deve consumir todos os recursos.

---

### 76. Revisar normalização

Status desconhecido não vira sucesso.

---

### 77. Revisar autenticação de workload

Confirme audience, token type e scopes internos.

---

### 78. Revisar logs do provider

Remova token, raw body sensível e credential.

---

## Segurança

### 79. Criar Security Correction Plan

Arquivo:

```text
docs/final-correction/SECURITY_CORRECTION_PLAN.md
```

---

### 80. Revisar JWT

Valide:

- signature;
- issuer;
- audience;
- algorithm;
- exp;
- nbf;
- subject;
- tenant;
- token type;
- key rotation.

---

### 81. Revisar autorização

Scopes e roles precisam ser exigidos juntos conforme matrix.

---

### 82. Revisar tenant isolation

Teste:

- query;
- command;
- history;
- cancellation;
- reconciliation;
- pagination;
- messages.

---

### 83. Revisar IDOR

Cross-tenant retorna `404`.

---

### 84. Revisar mass assignment

DTO público não pode aceitar:

- tenant;
- status;
- version;
- internal flags.

---

### 85. Revisar headers

Valide Content-Type, cache, nosniff, CORS e policy de CSRF.

---

### 86. Revisar secret leakage

Procure em:

- logs;
- traces;
- metrics;
- reports;
- examples;
- DLQ;
- scripts.

---

### 87. Revisar actuator

Exponha somente endpoints necessários.

---

### 88. Revisar error responses

Nenhum stack trace, SQL ou classe interna.

---

## Configuração

### 89. Criar Configuration Correction Plan

Arquivo:

```text
docs/final-correction/CONFIGURATION_CORRECTION_PLAN.md
```

---

### 90. Revisar profiles

Evite divergência silenciosa entre:

- local;
- test;
- HML simulated;
- production reference.

---

### 91. Revisar defaults

Default inseguro deve falhar no startup.

---

### 92. Revisar variáveis duplicadas

Uma configuração precisa de um nome oficial.

---

### 93. Revisar URLs

Nenhum endpoint real pode estar hardcoded.

---

### 94. Revisar secrets

Somente referências ou runtime injection.

---

### 95. Revisar Docker

Confirme:

- non-root;
- health;
- signal;
- read-only compatibility;
- tmp;
- resource policy;
- digest.

---

## Testes de regressão

### 96. Criar Regression Test Plan

Arquivo:

```text
docs/final-correction/REGRESSION_TEST_PLAN_PART_1.md
```

Para cada finding:

- teste unitário;
- teste de integração;
- contract/security;
- arquitetura;
- smoke;
- evidência.

---

### 97. Executar testes focados primeiro

Durante cada correção:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -am `
  test
```

---

### 98. Executar suíte completa depois

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify `
  -Pintegration-tests `
  -Pcontract-security-tests
```

---

### 99. Executar mutation testing quando domínio mudar

Mutações críticas não podem sobreviver.

---

### 100. Executar architecture tests quando boundaries mudarem

---

### 101. Executar secret scan quando logs ou config mudarem

---

### 102. Executar Postman quando contrato ou segurança mudar

---

### 103. Executar smoke quando runtime ou mensageria mudar

---

## Validação da parte 1

### 104. Criar Part 1 Acceptance Checklist

Arquivo:

```text
docs/final-correction/PART_1_ACCEPTANCE_CHECKLIST.md
```

Itens:

- baseline;
- registry;
- critical closed;
- high closed;
- regression tests;
- gates;
- reports;
- evidence;
- no scope expansion;
- part 2 preserved.

---

### 105. Criar Risk Register

Arquivo:

```text
docs/final-correction/PART_1_RISK_REGISTER.md
```

Riscos:

```text
refatoracao ampla;

finding sem reproduzir;

teste fraco;

migration editada;

contrato quebrado;

security regression;

report desatualizado;

gate suprimido;

scope creep;

correcao parcial marcada como completa.
```

---

### 106. Criar Traceability

Arquivo:

```text
docs/final-correction/PART_1_TRACEABILITY.md
```

Exemplo:

```text
FC1-004 tenant query missing
-> repository correction
-> integration test
-> security test
-> gate.

FC1-009 Outbox lease recovery
-> claim correction
-> concurrency integration test
-> Outbox report.

FC1-012 JWT audience default
-> startup validation
-> security regression test
-> secret and config scan.
```

---

### 107. Criar boundary da próxima aula

Arquivo:

```text
docs/final-correction/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 699 define:

- final correction charter;
- scope freeze;
- baseline;
- gate aggregation;
- finding registry;
- architecture corrections;
- domain corrections;
- application corrections;
- persistence corrections;
- Outbox and Inbox corrections;
- messaging corrections;
- integration corrections;
- security corrections;
- configuration corrections;
- regression tests;
- part 1 evidence.

A aula 700 define:

- remaining findings;
- documentation consistency;
- report consistency;
- evidence consistency;
- scripts and links;
- OpenAPI and Postman alignment;
- README and local guide alignment;
- runbook alignment;
- final polish;
- complete correction closure.

A consolidacao final da documentacao,
reports,
evidence
e acabamento global
permanece para a parte 2.
```

---

## Relatório e evidence

### 108. Criar report

Arquivo:

```text
reports/final-correction-part-1-report.yaml
```

Exemplo:

```yaml
finalCorrectionPart1:
  baseline:
    commit:
      recorded
    gates:
      aggregated

  findings:
    CRITICAL:
      total:
        2
      resolved:
        2
    HIGH:
      total:
        7
      resolved:
        7
    MEDIUMBlocking:
      total:
        3
      resolved:
        3

  regressions:
    unit:
      PASS
    integration:
      PASS
    contractSecurity:
      PASS
    architecture:
      PASS
    smoke:
      PASS

  part2:
    executed:
      false

  gate:
    PASS
```

Os números precisam vir do registry real.

---

### 109. Criar evidence

Arquivo:

```text
contracts/final-correction-part-1-evidence.yaml
```

Campos:

- lesson;
- project;
- baseline commit;
- baseline gate count;
- finding count;
- critical finding count;
- high finding count;
- blocking medium count;
- resolved critical count;
- resolved high count;
- resolved blocking medium count;
- architecture correction count;
- domain correction count;
- application correction count;
- persistence correction count;
- messaging correction count;
- integration correction count;
- security correction count;
- configuration correction count;
- regression test count;
- unit status;
- integration status;
- contract-security status;
- architecture status;
- secret scan status;
- smoke status;
- unresolved critical count;
- unresolved high count;
- scope expansion count;
- part 2 executed;
- documentation status;
- gate status;
- timestamp.

---

### 110. Criar gate da parte 1

Status:

```text
PASS;

FAIL_BASELINE;

FAIL_GATE_AGGREGATION;

FAIL_FINDING_REGISTRY;

FAIL_SCOPE_FREEZE;

FAIL_ARCHITECTURE_CORRECTION;

FAIL_DOMAIN_CORRECTION;

FAIL_APPLICATION_CORRECTION;

FAIL_PERSISTENCE_CORRECTION;

FAIL_OUTBOX_INBOX_CORRECTION;

FAIL_MESSAGING_CORRECTION;

FAIL_INTEGRATION_CORRECTION;

FAIL_SECURITY_CORRECTION;

FAIL_CONFIGURATION_CORRECTION;

FAIL_REGRESSION_TEST;

FAIL_UNIT_GATE;

FAIL_INTEGRATION_GATE;

FAIL_CONTRACT_SECURITY_GATE;

FAIL_ARCHITECTURE_GATE;

FAIL_SECRET_SCAN;

FAIL_SMOKE;

FAIL_UNRESOLVED_CRITICAL;

FAIL_UNRESOLVED_HIGH;

FAIL_SCOPE_EXPANSION;

FAIL_REPORT;

FAIL_EVIDENCE;

FAIL_PART_2_ANTICIPATION;

INCONCLUSIVE.
```

---

### 111. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\final-correction\validate-finding-registry.ps1

.\scripts\final-correction\run-part-1-regression.ps1

.\scripts\final-correction\compare-baseline.ps1

.\scripts\final-correction\collect-part-1-evidence.ps1
```

Confirme:

- zero critical aberto;
- zero high aberto;
- blocking medium resolvido;
- gates verdes;
- scope congelado;
- parte 2 não executada.

---

### 112. Encerrar o laboratório

Confirme:

- Charter;
- scope freeze;
- baseline;
- gate aggregation;
- classification;
- registry;
- decisions;
- source scan;
- architecture;
- domain;
- application;
- persistence;
- migrations;
- Outbox;
- Inbox;
- messaging;
- integrations;
- security;
- configuration;
- regression tests;
- acceptance;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- parte 2 preservada.

---


### Disciplina de correção

Durante a parte 1, mantenha uma fila pequena de alterações em andamento.

Uma prática segura é:

```text
um finding reproduzido;

uma hipótese de causa;

uma correção pequena;

um teste de regressão;

um conjunto de gates;

um commit rastreável.
```

Evite abrir várias refatorações simultâneas. Quando código, migration,
mensageria e segurança mudam no mesmo diff sem necessidade, a revisão perde
clareza e o rollback do trabalho fica mais difícil.

Antes de alterar o código, escreva a condição que provará a correção. Depois
da alteração, execute primeiro o teste que reproduz o defeito, em seguida os
testes do módulo, os testes do boundary afetado e finalmente a suíte global.
Se um teste antigo precisar ser atualizado, registre por que o contrato
esperado mudou. Um teste não deve ser modificado somente para aceitar a nova
implementação.

Cada commit deve permanecer pequeno o suficiente para responder:

- qual finding foi resolvido?
- qual risco foi reduzido?
- qual comportamento mudou?
- qual teste impediria a regressão?
- quais artifacts precisam ser regenerados?
- a mudança pode ser revertida isoladamente?

Quando dois findings exigirem a mesma correção estrutural, documente a
relação e evite duplicar mudanças. Quando uma correção revelar um novo
problema, abra outro finding em vez de ampliar silenciosamente o escopo do
item original.

A parte 1 termina somente quando o estado corrigido pode ser reproduzido a
partir de um clone limpo, usando os scripts oficiais e o mesmo commit
registrado nos reports e nas evidências.

## Entendendo o que foi feito

### A correção ganhou método

Problemas não são tratados por sensação.

### O escopo ficou protegido

A estabilização não virou novo desenvolvimento.

### Findings ganharam severidade

Risco define prioridade.

### Código e arquitetura foram revisados juntos

Uma correção local não pode quebrar boundaries.

### Domínio voltou a ser referência

Transições, duplicidade e compensações foram verificadas.

### Persistência ganhou validação estrutural

Tenant, version, constraints e índices foram revisados.

### Mensageria ganhou revisão de semântica

Envelope, ordering, retry, DLQ e commit foram verificados.

### Segurança ganhou regressões

JWT, autorização, tenant, IDOR e secrets foram reexecutados.

### Cada correção ganhou prova

Teste, gate, report e evidence acompanham o finding.

### A segunda parte ficou preservada

Documentação e consolidação global ainda terão uma rodada própria.

---

## Erros comuns importantes

### Corrigir sem reproduzir

Pode ser falso positivo.

### Refatorar tudo

O risco de regressão aumenta.

### Fechar finding por comentário

É necessário teste e gate.

### Editar migration aplicada

O histórico fica inválido.

### Suprimir teste quebrado

O gate perde valor.

### Mudar contrato para facilitar correção

Consumers podem quebrar.

### Aceitar critical aberto

A parte 1 não pode passar.

### Atualizar report manualmente

O report precisa vir da execução.

### Misturar documentação final

A consolidação pertence à aula 700.

### Adicionar feature nova

Viola o scope freeze.

---

## Comandos úteis

### Baseline

```powershell
.\scripts\final-correction\collect-baseline.ps1
```

### Agregar gates

```powershell
.\scripts\final-correction\aggregate-gates.ps1
```

### Regressão

```powershell
.\scripts\final-correction\run-part-1-regression.ps1
```

### Evidence

```powershell
.\scripts\final-correction\collect-part-1-evidence.ps1
```

---

## Exercício principal

Conduza a correção do finding:

```text
consulta de pedido
sem filtro de tenant
em um adapter de persistencia.
```

Inclua:

1. registrar finding;
2. reproduzir;
3. classificar severity;
4. localizar query;
5. verificar port;
6. corrigir signature;
7. aplicar tenant;
8. revisar PK;
9. revisar FK;
10. revisar cache;
11. revisar logs;
12. criar integration test;
13. criar security test;
14. testar cross-tenant;
15. validar `404`;
16. validar mesmo tenant;
17. executar architecture test;
18. executar unit tests;
19. executar integration tests;
20. executar contract-security;
21. atualizar evidence;
22. fechar finding;
23. comparar baseline;
24. revisar scope;
25. registrar decisão.

Não execute a parte 2.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 698 e ponte para a aula 700 foram preservadas;
- Final Correction Charter foi criado;
- scope freeze foi criado;
- branch foi criada;
- commit inicial foi registrado;
- baseline foi criado;
- collector foi criado;
- nenhuma correção ocorreu antes do baseline;
- gates foram agregados;
- gates obrigatórios foram mapeados;
- falsos positivos foram detectados;
- inconclusivos foram tratados;
- classificação de findings foi criada;
- registry foi criado;
- duplicidades foram agrupadas;
- Decision Log foi criado;
- resolved exige evidence;
- build limpo foi executado;
- warnings relevantes foram classificados;
- source consistency scan foi criado;
- Architecture Correction Plan foi criado;
- architecture tests foram executados;
- dependências proibidas foram corrigidas;
- ciclos foram verificados;
- acesso a internos foi revisado;
- API interna foi revisada;
- Domain Correction Plan foi criado;
- transições foram revisadas;
- transições inválidas foram corrigidas;
- duplicidade externa foi revisada;
- ambiguidade foi revisada;
- compensações foram revisadas;
- value objects foram revisados;
- collections foram revisadas;
- eventos foram revisados;
- Application Correction Plan foi criado;
- handlers foram revisados;
- transaction boundary foi revisado;
- idempotência foi revisada;
- completion prematuro foi corrigido;
- concurrency foi revisada;
- tenant propagation foi revisada;
- clock e IDs foram revisados;
- exceptions foram revisadas;
- Persistence Correction Plan foi criado;
- JPA mappings foram revisados;
- tenant em queries foi revisado;
- chaves foram revisadas;
- optimistic lock foi revisado;
- migrations foram revisadas;
- migrations aplicadas não foram editadas;
- índices críticos foram revisados;
- planos de query foram validados;
- isolation foi revisado;
- atomicidade da Outbox foi revisada;
- claim foi revisado;
- lease presa foi tratada;
- status de publicação foi revisado;
- Inbox foi revisada;
- duplicate divergente foi tratado;
- Messaging Correction Plan foi criado;
- envelope foi revisado;
- keys foram revisadas;
- consumer groups foram revisados;
- retry classifier foi revisado;
- metadata de retry foi revisada;
- DLQ foi revisada;
- offset commit foi revisado;
- replay foi revisado;
- Integration Correction Plan foi criado;
- timeouts foram revisados;
- retries foram revisados;
- operation IDs foram revisados;
- circuit breaker foi revisado;
- bulkhead foi revisado;
- normalização foi revisada;
- workload authentication foi revisada;
- logs de provider foram revisados;
- Security Correction Plan foi criado;
- JWT foi revisado;
- autorização foi revisada;
- tenant isolation foi revisado;
- IDOR foi revisado;
- mass assignment foi revisado;
- headers foram revisados;
- secret leakage foi revisado;
- actuator foi revisado;
- errors foram revisados;
- Configuration Correction Plan foi criado;
- profiles foram revisados;
- defaults foram revisados;
- variáveis duplicadas foram revisadas;
- URLs foram revisadas;
- secrets foram revisados;
- Docker foi revisado;
- Regression Test Plan foi criado;
- testes focados foram executados;
- suíte completa foi executada;
- mutation testing foi executado quando necessário;
- architecture tests foram reexecutados;
- secret scan foi reexecutado;
- Postman foi executado quando necessário;
- smoke foi executado;
- acceptance checklist foi criado;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 700 foi criado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- parte 2 não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\final-correction\run-part-1-regression.ps1

.\scripts\validate-secrets.ps1
```

Adicione somente arquivos relacionados aos findings resolvidos:

```powershell
git add `
  apps `
  libs `
  infrastructure `
  testing `
  docs/final-correction `
  scripts/final-correction `
  reports/final-correction-part-1-report.yaml `
  contracts/final-correction-part-1-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|pending-marker|temporary-marker|generic-marker|productionUrl|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "fix(final): resolve critical OrderFlow technical findings"
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
- mudança sem finding;
- secret;
- endpoint real;
- consolidação da parte 2.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você executou a primeira parte da correção técnica final do OrderFlow.

Você criou:

```text
scope freeze;

baseline;

gate aggregation;

finding registry;

decision log;

architecture corrections;

domain corrections;

application corrections;

persistence corrections;

Outbox and Inbox corrections;

messaging corrections;

integration corrections;

security corrections;

configuration corrections;

regression tests;

part 1 report;

part 1 evidence;

part 1 gate.
```

Os findings críticos e altos precisam estar resolvidos para concluir esta etapa.

A próxima aula será:

```text
700 - M20.30 - Correcao tecnica final parte 2
```

Nela, você fechará os findings restantes e consolidará documentação, reports, evidence, scripts, links, OpenAPI, Postman, README, guia local, runbook, consistência global e acabamento definitivo.

A correção técnica final parte 2 não foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Congelei o escopo.
- [ ] Registrei baseline.
- [ ] Agreguei gates.
- [ ] Criei registry.
- [ ] Classifiquei findings.
- [ ] Resolvi critical.
- [ ] Resolvi high.
- [ ] Corrigi arquitetura.
- [ ] Corrigi domínio.
- [ ] Corrigi aplicação.
- [ ] Corrigi persistência.
- [ ] Corrigi Outbox e Inbox.
- [ ] Corrigi mensageria.
- [ ] Corrigi integrações.
- [ ] Corrigi segurança.
- [ ] Corrigi configuração.
- [ ] Criei regressões.
- [ ] Reexecutei gates.
- [ ] Criei evidence.
- [ ] Preservei a parte 2.

---

## Troubleshooting adicional

### Finding não reproduz

Marque como não reproduzido e registre ambiente.

### Correção quebra contrato

Reavalie abordagem e mantenha compatibilidade.

### Teste passa antes e depois

Talvez não prove o finding.

### Migration precisa mudar

Crie nova migration.

### Architecture test falha por boundary antigo

Corrija dependência, não suprima regra.

### Security test encontra cross-tenant

Trate como prioridade crítica.

### Outbox test fica flaky

Revise clock, lease e concorrência.

### Report diverge do commit

Regenere no mesmo commit.

### Muitos findings aparecem

Priorize critical e high.

### Quero finalizar documentação

Essa consolidação pertence à aula 700.

---

## Perguntas de revisão

1. O que é scope freeze?
2. Por que criar baseline?
3. Finding precisa de quê?
4. Severidade depende de preferência?
5. O que a parte 1 prioriza?
6. Pode corrigir sem teste?
7. Menor mudança é sempre melhor?
8. Pode editar migration aplicada?
9. O que validar em tenant?
10. O que validar em Outbox?
11. O que validar em Inbox?
12. Retry serve para todo erro?
13. Timeout prova falha?
14. Cross-tenant retorna quê?
15. O que é completion prematuro?
16. O que architecture test protege?
17. O que report precisa registrar?
18. Critical pode permanecer aberto?
19. High pode permanecer aberto?
20. Quando usar INCONCLUSIVE?
21. O que evidence fecha?
22. O que a aula 700 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Bloqueio de novo escopo.
2. Comparar antes e depois.
3. Reprodução e evidence.
4. Não.
5. Critical e high.
6. Não.
7. Quando segura.
8. Não.
9. Todas as fronteiras.
10. Atomicidade, claim e publicação.
11. Deduplicação persistente.
12. Não.
13. Não.
14. `404`.
15. Marcar idempotência antes do commit.
16. Boundaries.
17. Findings e gates.
18. Não.
19. Não.
20. Quando falta prova.
21. Correção e resultado.
22. Consolidar a correção final.
23. Parte 2.
24. Correcao tecnica final parte 2.
25. Corrigir por risco comprovado.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 699 - M20.29 - Correcao tecnica final parte 1

- Continuei após Runbook do projeto.
- Criei Final Correction Charter.
- Congelei o escopo.
- Criei branch de correção.
- Registrei commit inicial.
- Criei baseline.
- Criei collector de baseline.
- Agreguei gates.
- Mapeei gates obrigatórios.
- Detectei falsos positivos e inconclusivos.
- Criei classificação de findings.
- Criei registry da parte 1.
- Agrupei findings duplicados.
- Criei Decision Log.
- Exigi evidence para resolved.
- Executei build limpo.
- Classifiquei warnings.
- Criei source consistency scan.
- Criei Architecture Correction Plan.
- Executei architecture tests.
- Corrigi boundaries.
- Verifiquei ciclos e visibilidade.
- Criei Domain Correction Plan.
- Revisei transições.
- Revisei duplicidade externa.
- Revisei ambiguidade.
- Revisei compensações.
- Revisei value objects, collections e eventos.
- Criei Application Correction Plan.
- Revisei handlers.
- Revisei transaction boundary.
- Revisei idempotência.
- Corrigi completion prematuro.
- Revisei concurrency.
- Revisei tenant propagation.
- Revisei clocks, IDs e exceptions.
- Criei Persistence Correction Plan.
- Revisei JPA mappings.
- Revisei tenant em queries.
- Revisei chaves e version.
- Revisei migrations e índices.
- Validei planos de query.
- Revisei isolation.
- Revisei atomicidade da Outbox.
- Revisei claim e lease.
- Revisei publicação.
- Revisei Inbox.
- Corrigi duplicate divergente.
- Criei Messaging Correction Plan.
- Revisei envelope, keys e groups.
- Revisei retry, DLQ, offset e replay.
- Criei Integration Correction Plan.
- Revisei timeout, retry e operation IDs.
- Revisei breaker, bulkhead e normalização.
- Revisei workload auth e logs.
- Criei Security Correction Plan.
- Revisei JWT.
- Revisei scopes e roles.
- Revisei tenant e IDOR.
- Revisei mass assignment.
- Revisei headers e secrets.
- Revisei actuator e errors.
- Criei Configuration Correction Plan.
- Revisei profiles, defaults, variables e URLs.
- Revisei Docker.
- Criei Regression Test Plan.
- Executei testes focados.
- Executei suíte completa.
- Executei mutation, architecture, secret, Postman e smoke quando necessários.
- Criei acceptance checklist.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 700.
- Criei report, evidence e gate.
- Não antecipei a parte 2.
- Próxima aula: Correcao tecnica final parte 2.
```

---

## Referência técnica curta

- Final Correction.
- Scope Freeze.
- Baseline.
- Finding.
- Severity.
- Reproducibility.
- Root Cause.
- Regression Test.
- Architecture Boundary.
- Domain Invariant.
- Transaction Boundary.
- Tenant Isolation.
- Outbox.
- Inbox.
- Retry Classifier.
- Security Regression.
- Configuration Drift.
- Gate.
- Evidence.

Regra final:

```text
A correção técnica final parte 1 do OrderFlow deve estabilizar riscos críticos e altos sem ampliar escopo: scope freeze preserva módulos, endpoints, events, providers e deployment model, baseline registra commit, versions, tests, gates, reports and digests antes de qualquer mudança, gate aggregation detecta PASS sem execução, artifact ausente, timestamp antigo e source commit divergente, finding registry exige origem, reprodução, expected, actual, severity, evidence, owner, correction commit e regression test, architecture review remove dependências proibidas entre domain, application and adapters, domain review corrige invalid transitions, duplicate external results, ambiguous outcomes, compensation and defensive collections, application review valida handlers, transaction boundary, idempotency completion, optimistic conflict, tenant propagation, clock and error mapping, persistence review valida JPA mapping, tenant queries, keys, version, migrations, constraints, indexes and plans, Outbox review valida atomic commit, SKIP LOCKED, lease recovery and publish confirmation, Inbox review valida fingerprint and duplicate handling, messaging review valida envelope, key, group, retry classifier, retry metadata, DLQ, offset and replay, integration review valida timeout, idempotent retry, operation ID, breaker, bulkhead, normalization and workload auth, security review valida JWT, scopes, roles, tenant, IDOR, mass assignment, headers, actuator and secret leakage, configuration review remove drift, insecure defaults, hardcoded URLs and runtime secrets, every correction adds focused regression and reexecutes unit, integration, contract-security, architecture, secret and smoke gates, critical and high findings cannot remain open, report and evidence are regenerated from the corrected commit, and the gate closes part 1 while documentation, reports, evidence, scripts, links and global polish remain reserved for lesson 700.
```
