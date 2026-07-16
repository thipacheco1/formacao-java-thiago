# 689 - M20.19 - Deploy ou simulacao

## Apresentação da aula

Na aula 688, você implementou o CI/CD do OrderFlow.

O projeto passou a possuir:

- validação de pull requests;
- branch protection;
- quality gates;
- build Maven;
- testes unitários e de integração automatizados;
- validação de migrations;
- validação de contratos;
- validação do Docker Compose;
- construção das cinco imagens;
- labels OCI;
- SBOM;
- scan de vulnerabilidades;
- scan de secrets;
- assinatura por digest;
- provenance;
- registry policy;
- release manifest;
- promoção controlada;
- approval policy;
- rollback policy;
- evidências da pipeline.

A pipeline agora consegue produzir um release candidate imutável.

Mas um artefato pronto para implantação ainda não prova que a implantação funciona.

Nesta aula, você executará o deploy ou uma simulação completa e defensável do deploy do OrderFlow.

A opção adotada no laboratório será:

```text
homologacao simulada
com Docker Compose,
imagens identificadas por digest
e configuracao separada
do ambiente local de desenvolvimento.
```

Essa abordagem permite praticar:

- promoção de artifact;
- configuração de ambiente;
- secret binding;
- validação de capacidade;
- execução de migrations;
- inicialização de dependências;
- rollout;
- health checks;
- smoke tests;
- observação de métricas;
- verificação de logs e traces;
- rollback;
- coleta de evidências.

O objetivo não é fingir que Docker Compose possui todos os recursos de uma plataforma de produção.

O objetivo é executar o mesmo processo mental e operacional exigido em uma implantação real:

```text
selecionar release;

validar pre-condicoes;

aplicar configuracao;

executar mudancas compativeis;

implantar;

observar;

aceitar
ou reverter.
```

A simulação precisa ser suficientemente rigorosa para responder:

- qual commit foi implantado?
- quais digests foram usados?
- quais migrations foram aplicadas?
- quais configurações foram vinculadas?
- quais secrets foram referenciados?
- qual versão está ativa?
- os componentes ficaram saudáveis?
- o smoke passou?
- a Outbox publicou?
- Kafka processou?
- providers simulados responderam?
- a projection atualizou?
- os dashboards receberam sinais?
- o rollback foi testado?
- quais evidências provam tudo isso?

O laboratório será:

```text
labs/m20/aula-689-deploy-ou-simulacao/orderflow-deployment-simulation
```

A próxima aula será:

```text
690 - M20.20 - Testes unitarios projeto final
```

Na aula 690, você aprofundará a suíte unitária do projeto final, cobrindo domínio, aplicação, policies, mappers, handlers, segurança, telemetria e qualidade dos testes.

Nesta aula, os testes utilizados serão operacionais:

- pre-deploy checks;
- migration checks;
- health checks;
- smoke tests;
- rollback checks;
- evidências de implantação.

Regra central:

```text
deploy nao termina
quando o container inicia;

deploy termina
quando o release
e identificado,
saudavel,
observado,
validado
e reversivel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
686:
Implementacao observabilidade.

687:
Docker do projeto final.

688:
CI CD do projeto final.

689:
Deploy ou simulacao.

690:
Testes unitarios projeto final.

691:
Testes de integracao projeto final.
```

A aula 689 conecta os artifacts produzidos na aula 688 ao ambiente construído na aula 687.

Ela utiliza:

- release manifest;
- image digests;
- signatures;
- provenance;
- SBOM;
- vulnerability reports;
- Docker Compose;
- migrations;
- health checks;
- smoke tests;
- dashboards;
- runbooks;
- rollback manifest.

Não será aprofundado nesta aula:

- desenho de novos testes unitários;
- mocking;
- test doubles;
- cobertura de branches;
- mutation testing;
- organização da suíte unitária.

Esses pontos pertencem à aula 690.

---

## Objetivo prático

Será criada a estrutura:

```text
infrastructure/deployment-simulation
├── README.md
├── compose.hml.yaml
├── compose.hml.override.yaml
├── environment
│   ├── hml.env.example
│   ├── hml-config-manifest.yaml
│   └── hml-secret-references.yaml
├── releases
│   ├── candidate-release-manifest.yaml
│   ├── active-release-manifest.yaml
│   ├── previous-release-manifest.yaml
│   └── deployment-history.yaml
├── migrations
│   ├── migration-plan.yaml
│   ├── migration-evidence.yaml
│   └── compatibility-checklist.md
├── scripts
│   ├── validate-release.ps1
│   ├── validate-environment.ps1
│   ├── pre-deploy.ps1
│   ├── apply-migrations.ps1
│   ├── deploy-release.ps1
│   ├── wait-rollout.ps1
│   ├── smoke-deployment.ps1
│   ├── observe-release.ps1
│   ├── accept-release.ps1
│   ├── rollback-release.ps1
│   ├── collect-deployment-evidence.ps1
│   └── destroy-simulation.ps1
└── evidence
    ├── README.md
    ├── deployment-summary.yaml
    ├── health-summary.yaml
    ├── smoke-summary.yaml
    ├── observability-summary.yaml
    └── rollback-summary.yaml
```

Documentação:

```text
docs/deployment
├── DEPLOYMENT_CHARTER.md
├── ENVIRONMENT_CATALOG.md
├── RELEASE_ACCEPTANCE_POLICY.md
├── CONFIGURATION_BINDING_POLICY.md
├── SECRET_BINDING_POLICY.md
├── MIGRATION_EXECUTION_POLICY.md
├── ROLLOUT_POLICY.md
├── DEPLOYMENT_OBSERVATION_POLICY.md
├── RELEASE_ACCEPTANCE_CHECKLIST.md
├── ROLLBACK_EXECUTION_POLICY.md
├── DEPLOYMENT_RUNBOOK.md
├── ROLLBACK_RUNBOOK.md
├── DEPLOYMENT_TEST_MATRIX.md
├── DEPLOYMENT_RISK_REGISTER.md
├── DEPLOYMENT_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Promoção é diferente de build

O build já aconteceu.

Nesta aula, o deploy usa:

```text
repository@sha256:digest.
```

Não usa:

```text
docker build.
```

Se a implantação reconstruir a imagem, o artifact implantado deixa de ser exatamente o artifact testado.

### Configuração não é imagem

A imagem contém código.

O ambiente fornece:

- URLs;
- credenciais;
- audiences;
- limites;
- feature flags;
- sampling;
- nomes de topics;
- políticas operacionais.

### Migration precisa de plano

Uma migration pode ser tecnicamente válida e operacionalmente perigosa.

O plano precisa considerar:

- compatibilidade;
- locks;
- duração;
- volume;
- rollback;
- observabilidade;
- ordem com a aplicação.

### Rollout precisa de critérios

Subir containers não é um critério suficiente.

O rollout precisa acompanhar:

- startup;
- readiness;
- error rate;
- latency;
- backlog;
- consumer lag;
- provider failures;
- projection freshness.

### Rollback não apaga a realidade

Se uma versão já:

- gravou dados;
- publicou eventos;
- chamou providers;
- alterou contratos;

o rollback precisa respeitar esses efeitos.

---

## Mão na massa guiada

### 1. Criar Deployment Charter

Arquivo:

```text
docs/deployment/DEPLOYMENT_CHARTER.md
```

Princípios:

```text
deploy uses immutable digests;

configuration is environment specific;

secrets are referenced, not versioned;

migrations are reviewed separately;

health and smoke are mandatory;

telemetry decides acceptance;

rollback uses a known manifest;

evidence is collected automatically;

unit test design belongs to lesson 690.
```

---

### 2. Criar Environment Catalog

Arquivo:

```text
docs/deployment/ENVIRONMENT_CATALOG.md
```

Ambientes:

```text
local;

hml-simulated;

production-reference.
```

Para cada ambiente, registre:

- purpose;
- owner;
- data classification;
- access;
- capacity;
- dependencies;
- observability;
- promotion source;
- approval requirement;
- retention.

---

### 3. Criar diretórios

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  infrastructure/deployment-simulation/environment,
  infrastructure/deployment-simulation/releases,
  infrastructure/deployment-simulation/migrations,
  infrastructure/deployment-simulation/scripts,
  infrastructure/deployment-simulation/evidence,
  docs/deployment
```

---

### 4. Copiar release manifest candidato

A pipeline da aula 688 produz:

```text
release/release-manifest.yaml.
```

Copie ou baixe esse artifact para:

```text
infrastructure/deployment-simulation/releases/candidate-release-manifest.yaml
```

Ele precisa conter:

- release ID;
- source commit;
- image repositories;
- digests;
- quality gate;
- SBOM references;
- signature references;
- provenance references;
- creation timestamp.

---

### 5. Proibir tags mutáveis

O script de validação falha quando encontra apenas:

```text
latest;

main;

stable.
```

Cada serviço precisa de digest.

Tags podem existir apenas como informação auxiliar.

---

### 6. Criar `validate-release.ps1`

O script valida:

- schema do manifest;
- release ID;
- source commit;
- cinco imagens;
- digest SHA-256;
- quality gate `PASS`;
- SBOM presente;
- scan aprovado;
- signature verificada;
- provenance presente;
- ausência de valor de exemplo tratado como real.

---

### 7. Verificar assinatura

A verificação precisa ocorrer antes do deploy.

Resultado esperado:

```text
identity autorizada;

repository correto;

digest correto;

issuer confiavel;

signature valida.
```

---

### 8. Verificar provenance

Confirme:

- source repository;
- source commit;
- workflow;
- builder;
- materials;
- artifact digest.

Se o digest divergir, o deploy falha.

---

### 9. Criar Release Acceptance Policy

Arquivo:

```text
docs/deployment/RELEASE_ACCEPTANCE_POLICY.md
```

Critérios prévios:

- manifest válido;
- approval;
- vulnerability policy aprovada;
- migrations compatíveis;
- capacity disponível;
- rollback manifest disponível;
- incidentes críticos ausentes;
- owners disponíveis;
- observabilidade pronta.

---

## Configuração e secrets

### 10. Criar configuração de HML simulada

Arquivo:

```text
environment/hml.env.example
```

Inclua somente valores não sensíveis ou exclusivamente locais:

```dotenv
ORDERFLOW_ENVIRONMENT=hml-simulated

API_PORT=18080
GRAFANA_PORT=13000
PROMETHEUS_PORT=19090

POSTGRES_DB=orderflow_hml
POSTGRES_USER=orderflow_hml

ORDERFLOW_TRACE_SAMPLE=1.0
ORDERFLOW_SECURITY_AUDIENCE=orderflow-api-hml

KAFKA_TOPIC_PREFIX=orderflow.hml
```

---

### 11. Criar Configuration Binding Policy

Arquivo:

```text
docs/deployment/CONFIGURATION_BINDING_POLICY.md
```

Regras:

- variável possui owner;
- tipo conhecido;
- default explícito;
- required ou optional;
- mudança auditável;
- valor não sensível pode ser versionado;
- config incompatível bloqueia startup;
- config é validada antes do rollout.

---

### 12. Criar Secret Binding Policy

Arquivo:

```text
docs/deployment/SECRET_BINDING_POLICY.md
```

Secrets:

- database password;
- workload credential;
- registry token quando necessário;
- Grafana admin password;
- signing verification material quando privado.

No laboratório, use arquivo local ignorado ou mecanismo de secret do runtime.

Não inclua valores em evidence.

---

### 13. Criar manifest de referências de secrets

Arquivo:

```yaml
secrets:
  databasePassword:
    source: local-secret-store
    reference: orderflow/hml/database-password

  GrafanaAdminPassword:
    source: local-secret-store
    reference: orderflow/hml/Grafana-admin

  workloadCredential:
    source: simulated-workload-identity
    reference: orderflow/hml/integration-gateway
```

O arquivo contém referências, não valores.

---

### 14. Criar `validate-environment.ps1`

O script verifica:

- variáveis obrigatórias;
- formato das URLs;
- portas livres;
- secret references resolvíveis;
- espaço em disco;
- memória disponível;
- Docker ativo;
- compose disponível;
- ausência de config local não aprovada.

---

## Compose de homologação simulada

### 15. Criar `compose.hml.yaml`

Esse compose usa:

- imagens por digest;
- nomes próprios de projeto;
- volumes separados do ambiente local;
- portas alternativas;
- topics com prefixo;
- configuração HML;
- health checks;
- observabilidade completa.

---

### 16. Definir nome de projeto

Execute com:

```powershell
docker compose `
  --project-name orderflow-hml `
  -f infrastructure/deployment-simulation/compose.hml.yaml
```

Isso isola:

- containers;
- networks;
- volumes;
- labels.

---

### 17. Referenciar imagens por digest

Exemplo conceitual:

```yaml
orderflow-api:
  image: ${ORDERFLOW_API_IMAGE}@${ORDERFLOW_API_DIGEST}
```

O script carrega esses valores do release manifest.

---

### 18. Não habilitar build no compose de HML

O arquivo não possui:

```text
build:
```

Ele apenas consome artifacts promovidos.

---

### 19. Separar volumes

Volumes:

```text
orderflow-hml-postgres;

orderflow-hml-Kafka;

orderflow-hml-prometheus;

orderflow-hml-Grafana.
```

Eles não reutilizam dados do desenvolvimento local.

---

### 20. Separar topics

Prefixo:

```text
orderflow.hml.
```

Evite que consumer groups de HML leiam topics locais.

---

### 21. Separar consumer groups

Exemplos:

```text
orderflow-hml-orchestration-v1;

orderflow-hml-integration-gateway-v1;

orderflow-hml-projection-v1.
```

---

### 22. Criar override de simulação

O override pode:

- apontar providers para WireMock;
- habilitar logs adicionais;
- expor portas de diagnóstico;
- usar identity provider simulado;
- reduzir limites.

Não altere digests.

---

## Planejamento de migrations

### 23. Criar Migration Execution Policy

Arquivo:

```text
docs/deployment/MIGRATION_EXECUTION_POLICY.md
```

Regras:

- migration pertence ao release;
- checksum validado;
- banco possui backup ou snapshot quando aplicável;
- expand vem antes do código consumidor;
- contract somente após compatibilidade;
- tempo esperado conhecido;
- lock observado;
- falha bloqueia rollout;
- migration não é editada depois de aplicada.

---

### 24. Criar migration plan

Arquivo:

```yaml
releaseId: orderflow-0.1.0-rc.15

database:
  schema: orderflow
  currentVersion: "7"
  targetVersion: "8"

steps:
  - order: 1
    migration: V008__create_indexes.sql
    mode: expand
    expectedDurationSeconds: 10
    blockingRisk: low
    rollbackMode: roll-forward

validation:
  checksum: required
  emptyDatabaseTest: passed
  upgradeTest: passed
  compatibility: passed
```

Valores são preenchidos pelo release real ou pela simulação.

---

### 25. Criar compatibility checklist

Valide:

- versão anterior da aplicação lê schema expandido;
- versão nova funciona antes de contract cleanup;
- consumers leem contratos suportados;
- rollback de imagem não depende de coluna removida;
- índices não bloqueiam acima do limite aceito.

---

### 26. Criar `apply-migrations.ps1`

O script:

- valida release;
- valida banco alvo;
- registra versão atual;
- executa Flyway;
- captura saída;
- valida versão alvo;
- gera evidence;
- falha antes dos apps quando necessário.

---

### 27. Não executar migration destrutiva automática

Mudanças como:

- drop column;
- rename incompatível;
- mudança de tipo;
- rewrite massivo;

exigem plano separado.

---

## Pre-deploy

### 28. Criar `pre-deploy.ps1`

O script executa:

- release validation;
- signature verification;
- provenance verification;
- environment validation;
- secret reference validation;
- capacity check;
- migration compatibility;
- compose config;
- rollback availability;
- change reference validation.

---

### 29. Criar capacity check

Valide pelo menos:

- CPU disponível;
- memória disponível;
- disco;
- portas;
- volume;
- número de containers;
- espaço para imagens;
- capacidade do PostgreSQL e Kafka simulados.

---

### 30. Criar rollback manifest anterior

Arquivo:

```text
releases/previous-release-manifest.yaml
```

Ele precisa estar:

- assinado;
- disponível;
- compatível;
- já aceito anteriormente;
- associado a evidence.

---

### 31. Criar deployment change record

Campos:

- change ID;
- release ID;
- actor;
- approver;
- start window;
- expected end;
- risk;
- rollback manifest;
- communication channel;
- owner.

---

## Execução do deploy

### 32. Criar `deploy-release.ps1`

O script:

1. executa pre-deploy;
2. aplica migrations;
3. baixa imagens por digest;
4. inicia dependências;
5. aguarda saúde;
6. inicia aplicações;
7. acompanha rollout;
8. executa smoke;
9. observa telemetria;
10. solicita aceitação.

---

### 33. Baixar imagens antes do rollout

Execute:

```powershell
docker compose `
  --project-name orderflow-hml `
  -f infrastructure/deployment-simulation/compose.hml.yaml `
  pull
```

Falha de pull bloqueia rollout.

---

### 34. Registrar digests locais

Após pull, compare:

- digest do manifest;
- digest local;
- assinatura.

Não confie apenas no nome da imagem.

---

### 35. Iniciar dependências

Ordem lógica:

- PostgreSQL;
- Kafka;
- topic initialization;
- OTEL Collector;
- Prometheus;
- Grafana.

Espere health e completion.

---

### 36. Aplicar migrations

Execute antes dos serviços que dependem da versão alvo.

Confirme:

- versão atual;
- versão alvo;
- checksum;
- duração;
- resultado;
- locks.

---

### 37. Iniciar aplicações

Suba:

- API;
- Outbox Publisher;
- Orchestration Worker;
- Integration Gateway;
- Projection Worker.

---

### 38. Criar `wait-rollout.ps1`

O script acompanha:

- container state;
- startup;
- readiness;
- restart count;
- health transitions;
- logs de erro;
- tempo máximo.

---

### 39. Definir rollout timeout

Cada componente possui timeout explícito.

Não espere indefinidamente.

---

### 40. Bloquear restart loop

Se um container reiniciar repetidamente:

- pause rollout;
- colete logs;
- marque falha;
- não continue smoke.

---

## Smoke tests do deployment

### 41. Criar `smoke-deployment.ps1`

O smoke usa o ambiente HML simulado.

Ele valida uma jornada mínima e segura.

---

### 42. Validar endpoints de saúde

Valide:

- API liveness;
- API readiness;
- worker health;
- collector health;
- Prometheus ready;
- Grafana health;
- PostgreSQL;
- Kafka.

---

### 43. Registrar pedido

Envie request autenticado ou token simulado válido.

Valide:

- `201`;
- Location;
- correlation;
- order ID;
- idempotency key.

---

### 44. Repetir pedido

Mesmo body e key.

Valide:

- mesmo order ID;
- replayed;
- nenhum aggregate duplicado;
- nenhuma Outbox de criação duplicada.

---

### 45. Verificar Outbox

Confirme:

- evento criado;
- publisher processou;
- status publicado;
- idade da fila normal.

---

### 46. Verificar Kafka

Confirme:

- topic correto;
- key correta;
- consumer group ativo;
- lag reduzido;
- nenhuma DLQ inesperada.

---

### 47. Verificar provider simulado

O Integration Gateway chama provider WireMock.

Cenário principal:

```text
estoque reservado;

pagamento autorizado;

fulfillment concluido.
```

---

### 48. Verificar projection

Consulta deve mostrar estado atualizado.

Confirme version guard e freshness.

---

### 49. Executar cenário de compensação

Cenário adicional:

```text
estoque reservado;

pagamento recusado;

compensacao;

pedido cancelado.
```

Esse cenário valida o caminho de falha funcional.

---

### 50. Verificar isolamento por tenant

Token do tenant B não encontra pedido do tenant A.

Resultado:

```text
404.
```

---

## Observação do release

### 51. Criar Deployment Observation Policy

Arquivo:

```text
docs/deployment/DEPLOYMENT_OBSERVATION_POLICY.md
```

Sinais mínimos:

- error rate;
- p95 latency;
- readiness;
- restart count;
- Outbox oldest age;
- consumer lag;
- DLQ;
- provider failures;
- ambiguous results;
- projection freshness;
- database connections;
- Kafka health.

---

### 52. Criar `observe-release.ps1`

O script coleta:

- health;
- metrics snapshot;
- logs críticos;
- traces de smoke;
- Kafka status;
- database status;
- dashboards URLs;
- duration.

---

### 53. Definir janela de observação

Na simulação, use uma janela curta, mas explícita.

Exemplo:

```text
5 minutos.
```

Em produção, a janela depende do risco e volume.

---

### 54. Definir thresholds de aceitação

Exemplo:

```text
readiness:
100%.

restart count:
0.

HTTP 5xx:
0 no smoke.

Outbox oldest age:
< 10s.

consumer lag:
retorna a zero.

DLQ:
0 inesperada.

projection freshness:
< 15s.
```

---

### 55. Correlacionar evidências

Para o pedido de smoke, registre:

- correlation ID;
- trace ID;
- order ID sanitizado na evidence privada;
- message IDs;
- provider operation IDs;
- final state;
- timestamps.

Não transforme IDs em labels de métricas.

---

### 56. Inspecionar logs

Procure:

- secret leak;
- token;
- stack trace inesperada;
- erro de contract;
- retry excessivo;
- circuit breaker aberto;
- projection gap.

---

### 57. Inspecionar traces

Valide a sequência:

```text
HTTP;

application;

PostgreSQL;

Outbox;

Kafka;

Gateway;

provider;

Kafka;

orchestration;

projection.
```

---

### 58. Inspecionar dashboards

Confirme:

- request recebido;
- journey concluída;
- Outbox processada;
- consumer lag normal;
- provider saudável;
- projection atualizada.

---

## Aceitação do release

### 59. Criar Release Acceptance Checklist

Arquivo:

```text
docs/deployment/RELEASE_ACCEPTANCE_CHECKLIST.md
```

Itens:

- release identity;
- signatures;
- migrations;
- health;
- smoke;
- telemetry;
- security;
- data integrity;
- messaging;
- providers;
- projection;
- rollback readiness;
- evidence.

---

### 60. Criar `accept-release.ps1`

O script:

- exige todos os gates `PASS`;
- registra approver;
- move candidate para active;
- preserva previous;
- atualiza deployment history;
- gera acceptance evidence.

---

### 61. Não aceitar manualmente sem evidence

A frase:

```text
parece estar funcionando
```

não é critério.

A aceitação precisa de dados.

---

### 62. Atualizar deployment history

Registre:

- release ID;
- environment;
- start;
- finish;
- result;
- actor;
- approver;
- previous release;
- rollback capability;
- evidence path.

---

## Falha e rollback

### 63. Criar Rollback Execution Policy

Arquivo:

```text
docs/deployment/ROLLBACK_EXECUTION_POLICY.md
```

Triggers:

- readiness persistente falha;
- error rate crítico;
- smoke falha;
- migration incompatível;
- DLQ inesperada;
- corrupção de projection;
- security regression;
- provider effect incorreto.

---

### 64. Criar Rollback Runbook

Arquivo:

```text
docs/deployment/ROLLBACK_RUNBOOK.md
```

Passos:

1. declarar falha;
2. interromper promoção;
3. congelar mudanças;
4. coletar estado;
5. validar manifest anterior;
6. avaliar migration;
7. reverter imagens ou executar roll-forward;
8. aguardar health;
9. executar smoke;
10. observar;
11. registrar incidente.

---

### 65. Criar `rollback-release.ps1`

O script recebe:

- current manifest;
- previous manifest;
- reason;
- incident reference;
- approver.

Ele não escolhe automaticamente uma tag.

---

### 66. Preservar banco

Rollback de imagem não executa downgrade destrutivo de schema automaticamente.

Se o schema expandido é compatível, mantenha-o.

---

### 67. Testar rollback por falha controlada

Implante uma configuração de candidate que falha readiness.

Valide:

- rollout interrompido;
- evidence coletada;
- previous manifest reaplicado;
- health recuperado;
- smoke passado;
- history atualizada.

---

### 68. Testar rollback após evento publicado

O rollback não remove eventos já publicados.

Consumers antigos precisam continuar compatíveis.

Esse teste comprova a importância da evolução compatível de contratos.

---

### 69. Testar roll-forward

Quando migration não permite rollback seguro, corrija com novo candidate.

Registre:

```text
strategy:
ROLL_FORWARD.
```

---

## Evidence

### 70. Criar `collect-deployment-evidence.ps1`

Colete:

- release manifest;
- digests;
- signature verification;
- provenance verification;
- config manifest;
- secret references;
- migration evidence;
- compose config hash;
- health;
- smoke;
- metrics;
- logs sanitizados;
- traces;
- acceptance ou rollback;
- timestamps.

---

### 71. Criar deployment summary

Exemplo:

```yaml
deployment:
  environment: hml-simulated
  releaseId: orderflow-0.1.0-rc.15
  sourceCommit: abcdef123456
  strategy: compose-recreate-by-digest
  result: ACCEPTED

validation:
  signatures: PASS
  provenance: PASS
  migrations: PASS
  health: PASS
  smoke: PASS
  observability: PASS
  rollbackReadiness: PASS
```

Os valores de exemplo precisam ser substituídos pela execução real da simulação.

---

### 72. Criar rollback summary

Registre:

- trigger;
- current release;
- target release;
- migration decision;
- duration;
- health recovery;
- smoke result;
- residual effects;
- owner.

---

## Testes do processo

### 73. Criar Deployment Test Matrix

Arquivo:

```text
docs/deployment/DEPLOYMENT_TEST_MATRIX.md
```

Categorias:

- release validation;
- signature;
- provenance;
- config;
- secrets;
- capacity;
- migrations;
- pull;
- rollout;
- health;
- smoke;
- messaging;
- projection;
- telemetry;
- acceptance;
- rollback;
- roll-forward;
- evidence.

---

### 74. Testar manifest inválido

Remova um digest.

Resultado:

```text
FAIL_RELEASE_MANIFEST.
```

Nenhum container novo é iniciado.

---

### 75. Testar signature inválida

Resultado:

```text
FAIL_SIGNATURE.
```

Nenhuma promoção ocorre.

---

### 76. Testar config ausente

Remova uma variável obrigatória.

Resultado:

```text
FAIL_ENVIRONMENT_CONFIGURATION.
```

---

### 77. Testar migration incompatível

O pre-deploy bloqueia o rollout.

Nenhum app novo inicia.

---

### 78. Testar health timeout

Um serviço não fica ready.

O rollout falha e aciona decisão de rollback.

---

### 79. Testar smoke failure

A API fica healthy, mas a jornada falha.

O release não é aceito.

Esse cenário mostra por que health não substitui smoke.

---

### 80. Testar observability failure

Se métricas ou traces essenciais não aparecem, o release pode ser bloqueado conforme policy.

Um sistema invisível não é seguro para promoção.

---

### 81. Testar destroy da simulação

O script:

- encerra containers;
- preserva evidence;
- remove volumes apenas com confirmação;
- mantém manifests e history.

---

## Arquitetura e qualidade

### 82. Criar Deployment Risk Register

Arquivo:

```text
docs/deployment/DEPLOYMENT_RISK_REGISTER.md
```

Riscos:

```text
digest ausente;

signature invalida;

config drift;

secret ausente;

migration bloqueante;

startup race;

readiness superficial;

smoke incompleto;

telemetry ausente;

rollback manifest indisponivel;

schema incompatível;

evento irreversível;

provider duplicado;

evidence incompleta.
```

---

### 83. Criar Deployment Traceability

Arquivo:

```text
docs/deployment/DEPLOYMENT_TRACEABILITY.md
```

Exemplo:

```text
build once
-> release manifest
-> digest validation
-> compose image reference
-> deployment evidence.

migration policy
-> migration plan
-> pre-deploy
-> Flyway evidence.

release acceptance
-> health
-> smoke
-> telemetry
-> acceptance record.

rollback policy
-> previous manifest
-> rollback script
-> rollback summary.
```

---

### 84. Criar boundary da próxima aula

Arquivo:

```text
docs/deployment/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 689 define:

- release validation;
- environment binding;
- secret references;
- migration execution;
- rollout;
- health;
- smoke;
- observation;
- acceptance;
- rollback;
- deployment evidence.

A aula 690 define:

- unit test strategy;
- domain tests;
- application handler tests;
- policy tests;
- mapper tests;
- security tests;
- telemetry unit tests;
- test doubles;
- coverage quality;
- mutation analysis.

A suite unitária aprofundada
nao e criada nesta aula.
```

---

### 85. Executar simulação completa

Comandos:

```powershell
.\infrastructure\deployment-simulation\scripts\pre-deploy.ps1

.\infrastructure\deployment-simulation\scripts\deploy-release.ps1

.\infrastructure\deployment-simulation\scripts\wait-rollout.ps1

.\infrastructure\deployment-simulation\scripts\smoke-deployment.ps1

.\infrastructure\deployment-simulation\scripts\observe-release.ps1

.\infrastructure\deployment-simulation\scripts\accept-release.ps1

.\infrastructure\deployment-simulation\scripts\collect-deployment-evidence.ps1
```

---

### 86. Simular rollback completo

Execute uma falha controlada e depois:

```powershell
.\infrastructure\deployment-simulation\scripts\rollback-release.ps1 `
  -Reason "controlled-readiness-failure" `
  -IncidentReference "SIM-689-001"
```

Depois:

- aguarde health;
- execute smoke;
- observe;
- colete evidence.

---

### 87. Criar report

Arquivo:

```text
reports/deployment-simulation-report.yaml
```

Exemplo:

```yaml
deploymentSimulation:
  environment:
    hml-simulated

  release:
    manifest:
      PASS
    signature:
      PASS
    provenance:
      PASS
    digests:
      PASS

  migrations:
    compatibility:
      PASS
    execution:
      PASS

  rollout:
    health:
      PASS
    smoke:
      PASS
    observability:
      PASS

  rollback:
    validated:
      true
    smokeAfterRollback:
      PASS

  unitTestSuite:
    expanded:
      false

  gate:
    PASS
```

---

### 88. Criar evidence

Arquivo:

```text
contracts/deployment-simulation-evidence.yaml
```

Campos:

- lesson;
- project;
- environment;
- release ID;
- source commit;
- image count;
- digest validation status;
- signature verification status;
- provenance verification status;
- configuration validation status;
- secret reference validation status;
- capacity check status;
- migration compatibility status;
- migration execution status;
- healthy service count;
- smoke test status;
- idempotency replay status;
- Outbox status;
- Kafka status;
- provider status;
- projection status;
- tenant isolation status;
- observability status;
- release acceptance status;
- rollback validation status;
- roll-forward validation status;
- evidence collection status;
- unit test suite expanded;
- documentation status;
- gate status;
- timestamp.

---

### 89. Criar gate de deploy

Status:

```text
PASS;

FAIL_DEPLOYMENT_STRUCTURE;

FAIL_RELEASE_MANIFEST;

FAIL_ARTIFACT_DIGEST;

FAIL_SIGNATURE;

FAIL_PROVENANCE;

FAIL_ENVIRONMENT_CONFIGURATION;

FAIL_SECRET_REFERENCE;

FAIL_CAPACITY_CHECK;

FAIL_MIGRATION_PLAN;

FAIL_MIGRATION_COMPATIBILITY;

FAIL_MIGRATION_EXECUTION;

FAIL_IMAGE_PULL;

FAIL_ROLLOUT;

FAIL_HEALTH;

FAIL_SMOKE;

FAIL_IDEMPOTENCY_REPLAY;

FAIL_OUTBOX;

FAIL_KAFKA;

FAIL_PROVIDER;

FAIL_PROJECTION;

FAIL_TENANT_ISOLATION;

FAIL_OBSERVABILITY;

FAIL_RELEASE_ACCEPTANCE;

FAIL_ROLLBACK_READINESS;

FAIL_ROLLBACK_EXECUTION;

FAIL_EVIDENCE;

FAIL_UNIT_TEST_ANTICIPATION;

INCONCLUSIVE.
```

---

### 90. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify

docker compose `
  --project-name orderflow-hml `
  -f infrastructure/deployment-simulation/compose.hml.yaml `
  config
```

Confirme:

- release por digest;
- signatures verificadas;
- provenance verificada;
- configuração validada;
- secrets apenas referenciados;
- migrations aplicadas;
- rollout saudável;
- smoke aprovado;
- telemetria presente;
- release aceito;
- rollback comprovado;
- testes unitários aprofundados não antecipados.

---

### 91. Encerrar o laboratório

Confirme:

- Charter;
- Environment Catalog;
- release candidate;
- active release;
- previous release;
- release validation;
- signatures;
- provenance;
- config;
- secret references;
- capacity;
- migrations;
- compose HML;
- image pulls;
- rollout;
- health;
- smoke;
- Outbox;
- Kafka;
- providers;
- projection;
- observability;
- acceptance;
- rollback;
- evidence;
- report;
- gate aprovado;
- suíte unitária aprofundada não implementada.

---

## Entendendo o que foi feito

### O artifact foi realmente promovido

A simulação utilizou digests produzidos pela pipeline.

### Configuração ficou separada da imagem

O mesmo artifact pode ser implantado em ambientes diferentes.

### Migrations ganharam execução governada

Compatibilidade e evidência foram verificadas antes do rollout.

### Health deixou de ser a única prova

Smoke e telemetria validaram a jornada.

### Aceitação ganhou critérios objetivos

O release só se tornou ativo após gates mensuráveis.

### Rollback deixou de ser hipótese

O manifest anterior foi reaplicado em uma falha controlada.

### Evidências fecharam a entrega

Commit, digest, migration, health, smoke e rollback ficaram rastreáveis.

### O projeto ganhou narrativa profissional

Você pode explicar desde o código até a promoção de um release.

---

## Erros comuns importantes

### Fazer build no ambiente

O artifact deixa de ser o mesmo.

### Usar tag sem digest

A identidade pode mudar.

### Colocar secret na evidence

A prova vira vazamento.

### Rodar migration sem plano

O rollout pode bloquear ou corromper compatibilidade.

### Aceitar apenas por health

A jornada pode continuar quebrada.

### Ignorar Outbox e lag

O assíncrono pode estar parado.

### Rollback com downgrade automático

O schema pode perder dados.

### Apagar eventos publicados

Efeitos externos não desaparecem.

### Não observar após deploy

Falhas tardias não são detectadas.

### Antecipar suíte unitária

Esse aprofundamento pertence à aula 690.

---

## Comandos úteis

### Validar release

```powershell
.\infrastructure\deployment-simulation\scripts\validate-release.ps1
```

### Pre-deploy

```powershell
.\infrastructure\deployment-simulation\scripts\pre-deploy.ps1
```

### Deploy

```powershell
.\infrastructure\deployment-simulation\scripts\deploy-release.ps1
```

### Smoke

```powershell
.\infrastructure\deployment-simulation\scripts\smoke-deployment.ps1
```

### Rollback

```powershell
.\infrastructure\deployment-simulation\scripts\rollback-release.ps1
```

---

## Exercício guiado

Execute o deploy simulado do cenário:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. release manifest;
2. digests;
3. signatures;
4. provenance;
5. environment config;
6. secret references;
7. migration plan;
8. pre-deploy;
9. image pull;
10. rollout;
11. health;
12. pedido registrado;
13. estoque reservado;
14. pagamento recusado;
15. compensação;
16. projection;
17. logs;
18. trace;
19. metrics;
20. acceptance decision;
21. falha controlada;
22. rollback manifest;
23. rollback;
24. smoke após rollback;
25. evidence.

Não aumente a suíte unitária nesta aula.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 688 e ponte para a aula 690 foram preservadas;
- Deployment Charter foi criado;
- Environment Catalog foi criado;
- diretórios foram criados;
- release candidate foi obtido da pipeline;
- tags mutáveis foram rejeitadas;
- script de release validation foi criado;
- assinatura foi verificada;
- provenance foi verificada;
- Release Acceptance Policy foi criada;
- configuração HML foi criada;
- Configuration Binding Policy foi criada;
- Secret Binding Policy foi criada;
- referências de secrets foram criadas;
- environment validation foi criada;
- compose HML foi criado;
- project name foi definido;
- imagens usam digest;
- build foi removido do compose HML;
- volumes foram separados;
- topics foram separados;
- consumer groups foram separados;
- override de simulação foi criado;
- Migration Execution Policy foi criada;
- migration plan foi criado;
- compatibility checklist foi criado;
- migration script foi criado;
- migration destrutiva automática foi evitada;
- pre-deploy foi criado;
- capacity check foi criado;
- previous manifest foi criado;
- change record foi criado;
- deployment script foi criado;
- imagens foram baixadas;
- digests locais foram comparados;
- dependências foram iniciadas;
- migrations foram aplicadas;
- aplicações foram iniciadas;
- rollout wait foi criado;
- timeouts foram definidos;
- restart loop foi bloqueado;
- smoke deployment foi criado;
- health endpoints foram validados;
- registro foi testado;
- replay idempotente foi testado;
- Outbox foi verificada;
- Kafka foi verificado;
- provider simulado foi verificado;
- projection foi verificada;
- compensação foi testada;
- tenant isolation foi testado;
- Deployment Observation Policy foi criada;
- observation script foi criado;
- janela foi definida;
- thresholds foram definidos;
- evidências foram correlacionadas;
- logs foram inspecionados;
- traces foram inspecionados;
- dashboards foram inspecionados;
- Release Acceptance Checklist foi criado;
- acceptance script foi criado;
- aceitação exige evidence;
- deployment history foi atualizado;
- Rollback Execution Policy foi criada;
- Rollback Runbook foi criado;
- rollback script foi criado;
- banco foi preservado;
- rollback controlado foi testado;
- evento publicado foi considerado;
- roll-forward foi testado;
- evidence collection foi criada;
- deployment summary foi criado;
- rollback summary foi criado;
- Test Matrix foi criada;
- manifest inválido foi testado;
- signature inválida foi testada;
- config ausente foi testada;
- migration incompatível foi testada;
- health timeout foi testado;
- smoke failure foi testado;
- observability failure foi testada;
- destroy simulation foi testado;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 690 foi criado;
- deploy completo foi simulado;
- rollback completo foi simulado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- testes unitários aprofundados não foram antecipados.

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
  verify

docker compose `
  --project-name orderflow-hml `
  -f infrastructure/deployment-simulation/compose.hml.yaml `
  config
```

Adicione:

```powershell
git add `
  infrastructure/deployment-simulation `
  docs/deployment `
  reports/deployment-simulation-report.yaml `
  contracts/deployment-simulation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "client_secret|private_key|access_token|refresh_token|Bearer ey|realPassword|realCloudEndpoint|realProductionToken"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "deploy(m20): simulate OrderFlow release rollout"
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

- secret real;
- endpoint de produção real;
- credential de registry;
- dados sensíveis de evidence;
- suíte detalhada da aula 690.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você executou o deploy ou a simulação completa do OrderFlow.

Você criou:

```text
deployment charter;

environment catalog;

release validation;

digest verification;

signature verification;

provenance verification;

configuration binding;

secret references;

migration planning;

pre-deploy;

rollout;

health checks;

smoke tests;

observability checks;

release acceptance;

rollback;

roll-forward;

deployment evidence;

report e gate.
```

O projeto agora possui uma entrega comprovável desde o commit até o ambiente.

A próxima aula será:

```text
690 - M20.20 - Testes unitarios projeto final
```

Nela, você aprofundará a suíte unitária do projeto final, cobrindo o aggregate, value objects, policies, handlers, mappers, segurança, contracts, telemetria, test doubles, cobertura de comportamento e mutation testing.

A suíte unitária aprofundada não foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei release manifest.
- [ ] Verifiquei digests.
- [ ] Verifiquei signatures.
- [ ] Verifiquei provenance.
- [ ] Vinculei configuração.
- [ ] Referenciei secrets.
- [ ] Planejei migrations.
- [ ] Executei pre-deploy.
- [ ] Executei rollout.
- [ ] Validei health.
- [ ] Executei smoke.
- [ ] Observei telemetria.
- [ ] Aceitei o release.
- [ ] Testei rollback.
- [ ] Preservei testes unitários para a aula 690.

---

## Troubleshooting adicional

### Digest local diverge

Interrompa e valide registry e manifest.

### Signature falha

Não implante o artifact.

### Compose tenta construir imagem

Remova `build` do arquivo de HML.

### Secret aparece no summary

Substitua por referência e sanitize evidence.

### Migration demora além do esperado

Interrompa rollout e avalie locks.

### Containers estão healthy, mas smoke falha

Não aceite o release.

### Outbox cresce depois do deploy

Verifique publisher, Kafka e consumer lag.

### Projection não atualiza

Verifique topic, Inbox, gap e freshness.

### Rollback não restaura comportamento

Avalie schema, config e efeitos publicados.

### Quero criar mais unit tests

Essa etapa pertence à aula 690.

---

## Perguntas de revisão

1. Deploy pode reconstruir imagem?
2. Qual identidade deve ser usada?
3. Para que serve release manifest?
4. Configuração fica na imagem?
5. Secret entra na evidence?
6. O que pre-deploy valida?
7. Por que verificar capacity?
8. Migration precisa de plano?
9. O que é expand-contract?
10. Health prova a jornada?
11. Para que serve smoke?
12. O que observar na Outbox?
13. O que observar no Kafka?
14. O que observar na projection?
15. Quando aceitar o release?
16. O que é deployment history?
17. Rollback usa tag?
18. Banco é revertido automaticamente?
19. Evento publicado desaparece?
20. Quando usar roll-forward?
21. Evidence prova o quê?
22. O que a aula 690 fará?
23. O que não foi aprofundado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Digest.
3. Ligar commit e artifacts.
4. Não.
5. Não.
6. Release, ambiente, migration e rollback.
7. Evitar rollout sem recursos.
8. Sim.
9. Evolução compatível em etapas.
10. Não.
11. Validar jornada mínima.
12. Contagem e idade.
13. Topics, lag e DLQ.
14. Freshness, version e gaps.
15. Após gates e observação.
16. Registro das implantações.
17. Não, usa manifest.
18. Não.
19. Não.
20. Quando rollback é inseguro.
21. Identidade, execução e resultado.
22. Testes unitários do projeto.
23. Suíte unitária detalhada.
24. Testes unitários projeto final.
25. Deploy termina validado e reversível.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 689 - M20.19 - Deploy ou simulacao

- Continuei após CI CD do projeto final.
- Criei Deployment Charter.
- Criei Environment Catalog.
- Criei a estrutura de simulação.
- Obtive release manifest da pipeline.
- Rejeitei tags mutáveis.
- Criei validate-release.
- Verifiquei assinatura.
- Verifiquei provenance.
- Criei Release Acceptance Policy.
- Criei configuração HML simulada.
- Criei Configuration Binding Policy.
- Criei Secret Binding Policy.
- Criei referências de secrets.
- Criei environment validation.
- Criei compose HML.
- Defini project name.
- Referenciei imagens por digest.
- Removi build do compose HML.
- Separei volumes.
- Separei topics.
- Separei consumer groups.
- Criei override de simulação.
- Criei Migration Execution Policy.
- Criei migration plan.
- Criei compatibility checklist.
- Criei apply-migrations.
- Evitei migration destrutiva automática.
- Criei pre-deploy.
- Criei capacity check.
- Criei previous release manifest.
- Criei change record.
- Criei deploy-release.
- Baixei imagens antes do rollout.
- Comparei digests locais.
- Iniciei dependências.
- Apliquei migrations.
- Iniciei aplicações.
- Criei wait-rollout.
- Defini timeouts.
- Bloqueei restart loop.
- Criei smoke-deployment.
- Validei health.
- Registrei pedido.
- Testei replay idempotente.
- Verifiquei Outbox.
- Verifiquei Kafka.
- Verifiquei provider simulado.
- Verifiquei projection.
- Testei compensação.
- Testei isolamento por tenant.
- Criei Deployment Observation Policy.
- Criei observe-release.
- Defini janela de observação.
- Defini thresholds.
- Correlacionei evidências.
- Inspecionei logs.
- Inspecionei traces.
- Inspecionei dashboards.
- Criei Release Acceptance Checklist.
- Criei accept-release.
- Exigi evidence para aceitação.
- Atualizei deployment history.
- Criei Rollback Execution Policy.
- Criei Rollback Runbook.
- Criei rollback-release.
- Preservei banco.
- Testei rollback controlado.
- Considerei eventos publicados.
- Testei roll-forward.
- Criei collect-deployment-evidence.
- Criei deployment summary.
- Criei rollback summary.
- Criei Deployment Test Matrix.
- Testei manifest inválido.
- Testei signature inválida.
- Testei config ausente.
- Testei migration incompatível.
- Testei health timeout.
- Testei smoke failure.
- Testei observability failure.
- Testei destroy simulation.
- Criei Deployment Risk Register.
- Criei Deployment Traceability.
- Criei boundary para a aula 690.
- Executei simulação completa.
- Executei rollback completo.
- Criei report, evidence e gate.
- Não antecipei testes unitários aprofundados.
- Próxima aula: Testes unitarios projeto final.
```

---

## Referência técnica curta

- Deployment.
- Release Manifest.
- OCI Digest.
- Signature Verification.
- Provenance Verification.
- Environment Binding.
- Secret Reference.
- Migration Plan.
- Expand-Contract.
- Pre-Deploy Check.
- Rollout.
- Readiness.
- Smoke Test.
- Release Acceptance.
- Deployment Observation.
- Rollback.
- Roll-Forward.
- Deployment Evidence.

Regra final:

```text
O deploy ou a simulação do OrderFlow deve promover artifacts imutáveis e encerrar somente quando o release estiver identificado, saudável, observado, aceito e reversível: o candidate release manifest liga source commit a cinco image digests, SBOM, scans, signatures e provenance, validate-release rejeita tags mutáveis, digest ausente, artifact de exemplo e identidade divergente, configuração de hml-simulated é separada da imagem, secrets aparecem apenas como referências, compose HML não possui build e usa project name, volumes, topics e consumer groups isolados, pre-deploy valida environment, capacity, approvals, rollback manifest e migration compatibility, Flyway aplica migrations expand compatíveis antes dos apps, deploy-release faz pull por digest, compara artifact local, inicia PostgreSQL, Kafka e observabilidade, aplica migrations, inicia API e workers, wait-rollout controla health, restart e timeout, smoke registra pedido, comprova replay idempotente, Outbox, Kafka, Integration Gateway, providers, orchestration, projection, compensação e tenant isolation, observe-release mede error rate, latency, Outbox age, lag, DLQ, provider failures e projection freshness, accept-release exige evidence e atualiza deployment history, rollback-release usa previous manifest conhecido, preserva schema compatível e considera eventos já publicados, roll-forward é usado quando downgrade é inseguro, e evidence liga release, config, migrations, health, smoke, telemetry, acceptance e rollback; o gate termina com deploy simulado e rollback comprovados, enquanto aggregate tests, handler tests, policy tests, mapper tests, test doubles, coverage quality e mutation testing permanecem reservados para a aula 690.
```
