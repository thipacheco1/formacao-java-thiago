# 698 - M20.28 - Runbook do projeto

## Apresentação da aula

Na aula 697, você criou o Guia de execução local do OrderFlow.

O projeto passou a possuir:

- pré-requisitos verificáveis;
- configuração para Windows, Linux e macOS;
- validação de Java 21;
- Maven Wrapper;
- Docker e Docker Compose;
- criação segura do `.env`;
- modo container completo;
- modo híbrido com a IDE;
- inicialização de PostgreSQL;
- validação do Flyway;
- inicialização de Kafka;
- validação de topics e consumer groups;
- observabilidade local;
- readiness;
- liveness;
- smoke tests;
- OpenAPI;
- Postman;
- logs;
- diagnóstico;
- shutdown;
- reset;
- troubleshooting;
- evidence e gate.

O guia local ensina como preparar e executar o ambiente.

Nesta aula, você criará o runbook operacional do projeto.

O runbook responde a outra pergunta:

```text
o sistema esta degradado
ou indisponivel;

como identificar,
conter,
comunicar,
recuperar,
validar
e registrar
a ocorrencia?
```

Um runbook não é apenas uma lista de comandos.

Ele precisa permitir que uma pessoa autorizada:

- reconheça um incidente;
- classifique severidade;
- identifique o impacto;
- defina ownership;
- consulte sinais confiáveis;
- contenha efeitos;
- evite decisões destrutivas;
- execute recuperação;
- valide a jornada;
- comunique progresso;
- encerre o incidente;
- preserve evidências;
- registre ações posteriores.

O OrderFlow possui vários pontos operacionais:

- API;
- PostgreSQL;
- Flyway;
- Outbox;
- Kafka;
- consumers;
- Inbox;
- retry topics;
- DLQ;
- Integration Gateway;
- providers;
- Projection Worker;
- read model;
- autenticação;
- autorização;
- observabilidade;
- containers;
- deployment manifest;
- configuração;
- secrets.

Cada incidente exige uma resposta diferente.

Exemplos:

```text
API indisponivel;

banco lento;

Kafka indisponivel;

Outbox acumulando;

consumer lag crescendo;

DLQ aumentando;

provider externo fora;

projection atrasada;

token rejeitado em massa;

secret exposto;

telemetria ausente;

release regressivo.
```

O runbook também precisa evitar respostas perigosas.

Não faça automaticamente:

- apagar topics;
- truncar Inbox;
- limpar Outbox;
- editar migration aplicada;
- reiniciar tudo sem diagnóstico;
- reenviar mensagens sem idempotência;
- desabilitar segurança;
- aumentar retries indefinidamente;
- executar rollback incompatível com schema;
- ocultar incidente para manter aparência de estabilidade.

A próxima aula será:

```text
699 - M20.29 - Correcao tecnica final parte 1
```

Na aula 699, você iniciará a primeira rodada formal de correção técnica final do projeto, usando reports, gates, riscos, evidências e findings para localizar inconsistências e corrigir os itens prioritários.

Nesta aula, você criará os procedimentos.

Você não iniciará a correção técnica final.

O laboratório será:

```text
labs/m20/aula-698-runbook-do-projeto/orderflow-runbook
```

Regra central:

```text
um runbook profissional
transforma sinais
em decisoes seguras;

ele reduz improviso,
limita dano,
preserva evidencia
e conduz a recuperacao
ate a validacao final.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
695:
Postman Collection.

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
```

O runbook reutiliza artifacts já criados:

- dashboards;
- métricas;
- traces;
- logs estruturados;
- alerts;
- health checks;
- scripts locais;
- deployment manifests;
- rollback manifests;
- smoke tests;
- Postman;
- OpenAPI;
- migration reports;
- Kafka diagnostics;
- Outbox reports;
- security evidence;
- performance baseline.

O runbook não substitui monitoramento.

Ele começa quando um sinal exige ação humana ou automatizada controlada.

O runbook também não substitui post-mortem.

Ele cobre:

```text
deteccao;

triagem;

contencao;

diagnostico;

recuperacao;

validacao;

comunicacao;

evidence.
```

A análise profunda de causa raiz e as correções permanentes podem continuar depois.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/runbook
├── README.md
├── RUNBOOK_CHARTER.md
├── INCIDENT_CLASSIFICATION.md
├── INCIDENT_ROLES.md
├── INCIDENT_COMMUNICATION.md
├── GENERAL_TRIAGE.md
├── API_UNAVAILABLE.md
├── API_HIGH_ERROR_RATE.md
├── DATABASE_UNAVAILABLE.md
├── DATABASE_DEGRADED.md
├── FLYWAY_FAILURE.md
├── OUTBOX_BACKLOG.md
├── KAFKA_UNAVAILABLE.md
├── CONSUMER_LAG.md
├── RETRY_TOPIC_GROWTH.md
├── DLQ_GROWTH.md
├── PROVIDER_OUTAGE.md
├── PROVIDER_AMBIGUOUS_RESULTS.md
├── PROJECTION_STALE.md
├── AUTHENTICATION_FAILURE_SPIKE.md
├── AUTHORIZATION_ANOMALY.md
├── SECRET_EXPOSURE.md
├── OBSERVABILITY_DEGRADED.md
├── CAPACITY_SATURATION.md
├── RELEASE_REGRESSION.md
├── ROLLBACK_EXECUTION.md
├── RECOVERY_VALIDATION.md
├── INCIDENT_EVIDENCE.md
├── POST_INCIDENT_ACTIONS.md
├── RUNBOOK_CHECKLIST.md
├── RUNBOOK_MATRIX.md
├── RUNBOOK_RISK_REGISTER.md
├── RUNBOOK_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/runbook
├── incident-snapshot.ps1
├── check-api.ps1
├── check-database.ps1
├── check-migrations.ps1
├── check-outbox.ps1
├── check-Kafka.ps1
├── check-consumer-lag.ps1
├── check-dlq.ps1
├── check-providers.ps1
├── check-projection.ps1
├── check-security.ps1
├── check-observability.ps1
├── validate-recovery.ps1
├── prepare-rollback.ps1
├── collect-incident-evidence.ps1
└── validate-runbook.ps1
```

Artifacts:

```text
reports/runbook-project-report.yaml

contracts/runbook-project-evidence.yaml
```

O índice principal será:

```text
docs/runbook/README.md
```

---

## Conceito essencial

### Incidente não é qualquer erro

Um erro isolado pode ser esperado.

Um incidente existe quando há impacto relevante ou risco de impacto em:

- disponibilidade;
- integridade;
- segurança;
- latência;
- processamento;
- dados;
- consumidores;
- operação.

### Sintoma não é causa

Exemplo:

```text
API lenta.
```

Pode ser causada por:

- banco;
- pool;
- provider;
- GC;
- lock;
- CPU;
- Kafka;
- DNS;
- configuração;
- release.

O runbook orienta a investigação sem concluir cedo demais.

### Contenção vem antes da correção permanente

Objetivo inicial:

- impedir expansão do dano;
- manter dados;
- preservar rastreabilidade;
- reduzir impacto.

### Recovery precisa ser validado

Container `running` não prova recuperação.

É necessário validar:

- health;
- smoke;
- backlog;
- lag;
- projection;
- error rate;
- journeys.

### Evidência é parte do incidente

Sem evidence, a equipe perde:

- timeline;
- decisão;
- causalidade;
- confiança;
- aprendizado.

---

## Mão na massa guiada

### 1. Criar Runbook Charter

Arquivo:

```text
docs/runbook/RUNBOOK_CHARTER.md
```

Princípios:

```text
safety before speed;

evidence before destructive action;

severity is impact based;

ownership is explicit;

communication is regular;

recovery is validated end to end;

security incidents are isolated;

rollback uses known manifests;

final technical corrections belong to lesson 699.
```

---

### 2. Criar índice principal

Arquivo:

```text
docs/runbook/README.md
```

Organize por:

- começar aqui;
- severidade;
- triagem geral;
- banco;
- mensageria;
- providers;
- projection;
- segurança;
- observabilidade;
- deploy;
- recuperação;
- evidências.

---

### 3. Criar Incident Classification

Arquivo:

```text
docs/runbook/INCIDENT_CLASSIFICATION.md
```

Níveis:

```text
SEV-1:
indisponibilidade ampla,
risco de dados
ou incidente de seguranca critico.

SEV-2:
degradacao importante
com impacto relevante.

SEV-3:
impacto limitado
ou workaround disponivel.

SEV-4:
evento operacional
sem impacto imediato,
mas que exige acompanhamento.
```

---

### 4. Classificar por impacto

Critérios:

- usuários afetados;
- tenants afetados;
- operações afetadas;
- integridade;
- segurança;
- duração;
- backlog;
- irreversibilidade;
- workaround.

Não classifique apenas pela tecnologia que falhou.

---

### 5. Criar Incident Roles

Arquivo:

```text
docs/runbook/INCIDENT_ROLES.md
```

Papéis:

- Incident Commander;
- Operations Lead;
- Application Lead;
- Database Lead;
- Messaging Lead;
- Security Lead;
- Communications Lead;
- Scribe.

Em equipe pequena, uma pessoa pode acumular papéis.

As responsabilidades continuam explícitas.

---

### 6. Definir autoridade

O Incident Commander decide:

- severidade;
- prioridade;
- contenção;
- rollback;
- atualização de status;
- encerramento.

A decisão técnica é construída com os especialistas.

---

### 7. Criar Incident Communication

Arquivo:

```text
docs/runbook/INCIDENT_COMMUNICATION.md
```

Atualizações precisam conter:

- horário;
- severidade;
- impacto;
- hipótese atual;
- ações em execução;
- risco;
- próxima atualização;
- owner.

---

### 8. Criar template inicial

```text
Incident:
OrderFlow API unavailable.

Severity:
SEV-1.

Detected at:
timestamp UTC.

Impact:
order registration unavailable.

Current action:
database and API health triage.

Next update:
defined interval.

Owner:
incident commander.
```

---

### 9. Não comunicar hipótese como fato

Use:

```text
hipotese em investigacao.
```

Não use:

```text
causa confirmada.
```

antes da evidência.

---

## Triagem geral

### 10. Criar General Triage

Arquivo:

```text
docs/runbook/GENERAL_TRIAGE.md
```

Primeiros passos:

1. confirmar alerta;
2. determinar impacto;
3. identificar release;
4. verificar mudanças recentes;
5. coletar snapshot;
6. verificar segurança;
7. definir severidade;
8. atribuir papéis;
9. comunicar início;
10. escolher runbook específico.

---

### 11. Criar `incident-snapshot.ps1`

Colete:

- timestamp;
- environment;
- release ID;
- commit;
- image digests;
- compose ou runtime status;
- health;
- error rate;
- latency;
- CPU;
- memory;
- PostgreSQL;
- Kafka;
- Outbox;
- lag;
- DLQ;
- providers;
- projection;
- recent deployments.

---

### 12. Sanitizar snapshot

Remova:

- Authorization;
- token;
- password;
- secret;
- private key;
- payload sensível;
- dados pessoais.

---

### 13. Verificar mudança recente

Consulte:

- deployment history;
- config change;
- migration;
- topic change;
- provider change;
- certificate rotation;
- secret rotation.

Correlação temporal não prova causa.

---

### 14. Congelar mudanças

Em SEV-1 e SEV-2:

- pause deploys não relacionados;
- pause mudanças de configuração;
- preserve artifacts;
- registre exceções.

---

## API indisponível

### 15. Criar API Unavailable

Arquivo:

```text
docs/runbook/API_UNAVAILABLE.md
```

Sinais:

- readiness falha;
- `5xx`;
- connection refused;
- restart loop;
- timeout total.

---

### 16. Diagnosticar API

Verifique:

- container ou processo;
- liveness;
- readiness;
- logs;
- porta;
- datasource;
- Kafka;
- issuer;
- config;
- memory;
- recent deploy.

---

### 17. Conter impacto

Opções:

- manter comandos bloqueados;
- preservar queries quando separadas;
- ativar página de indisponibilidade no gateway externo;
- reduzir tráfego autorizado;
- evitar retry agressivo.

---

### 18. Recuperar API

Ações seguras:

- corrigir config;
- restaurar dependency;
- reiniciar somente o componente quando necessário;
- promover manifest conhecido;
- executar rollback compatível.

---

### 19. Validar recuperação da API

Confirme:

- readiness;
- liveness;
- registro;
- replay;
- consulta;
- error rate;
- latency;
- Outbox.

---

## Erros elevados na API

### 20. Criar API High Error Rate

Arquivo:

```text
docs/runbook/API_HIGH_ERROR_RATE.md
```

Separe:

- `4xx` esperado;
- `401` ou `403` anormal;
- `409` funcional;
- `429`;
- `5xx`;
- timeout.

---

### 21. Correlacionar por operação

Tags permitidas:

- operation;
- result;
- error class controlada.

Não use order ID ou tenant como label.

---

### 22. Identificar padrão

Perguntas:

- todos os endpoints?
- somente commands?
- somente queries?
- um tenant?
- um token type?
- após um deploy?
- após provider failure?

---

## PostgreSQL indisponível

### 23. Criar Database Unavailable

Arquivo:

```text
docs/runbook/DATABASE_UNAVAILABLE.md
```

Sinais:

- connection refused;
- pool esgotado;
- health down;
- timeout;
- container parado;
- disk full.

---

### 24. Diagnosticar banco

Verifique:

- processo;
- volume;
- disk;
- connections;
- logs;
- credentials;
- network;
- locks;
- recovery state.

---

### 25. Evitar ações destrutivas

Não:

- apague volume;
- reinicialize schema;
- troque senha sem coordenação;
- force migration;
- execute reset.

---

### 26. Recuperar banco

Ação depende do ambiente:

- restaurar processo;
- liberar disk;
- corrigir network;
- restaurar credential;
- failover quando disponível;
- rollback de config;
- restaurar backup somente com procedimento aprovado.

---

### 27. Validar recuperação do banco

Confirme:

- conexão;
- versão Flyway;
- leitura;
- escrita controlada;
- transaction;
- Outbox;
- audit;
- error rate.

---

## Banco degradado

### 28. Criar Database Degraded

Arquivo:

```text
docs/runbook/DATABASE_DEGRADED.md
```

Sinais:

- p95 alto;
- locks;
- pool saturado;
- CPU alta;
- disk latency;
- query lenta;
- crescimento de tabela.

---

### 29. Diagnosticar locks

Colete:

- sessão;
- query;
- duração;
- lock type;
- blocker;
- transaction age.

Não mate sessão sem entender impacto.

---

### 30. Diagnosticar pool

Verifique:

- active;
- idle;
- pending;
- acquisition time;
- timeout;
- leak detection.

---

### 31. Conter degradação

Opções:

- reduzir taxa;
- pausar replay;
- reduzir jobs não críticos;
- proteger banco de consultas pesadas;
- limitar batch.

---

## Flyway

### 32. Criar Flyway Failure

Arquivo:

```text
docs/runbook/FLYWAY_FAILURE.md
```

Sinais:

- aplicação não inicia;
- checksum mismatch;
- migration failed;
- lock de migration;
- versão inesperada.

---

### 33. Diagnosticar Flyway

Verifique:

- schema history;
- release;
- checksum;
- migration pendente;
- migration editada;
- database target.

---

### 34. Não alterar migration aplicada

Correção segura:

- restaurar arquivo original;
- criar nova migration;
- executar repair somente quando justificado e aprovado;
- preservar evidence.

---

## Outbox backlog

### 35. Criar Outbox Backlog

Arquivo:

```text
docs/runbook/OUTBOX_BACKLOG.md
```

Sinais:

- pending cresce;
- oldest age cresce;
- publisher failures;
- attempts aumenta;
- lease presa.

---

### 36. Diagnosticar publisher

Verifique:

- processo;
- health;
- Kafka;
- query de claim;
- `SKIP LOCKED`;
- lease;
- batch size;
- clock;
- serialization;
- error classifier.

---

### 37. Classificar backlog

Categorias:

```text
entrada acima da saida;

publisher parado;

Kafka indisponivel;

mensagem invalida;

lease presa;

configuracao incorreta.
```

---

### 38. Conter backlog

Ações:

- reduzir entrada;
- restaurar publisher;
- restaurar Kafka;
- isolar mensagem inválida;
- ajustar batch de forma controlada;
- aumentar workers somente após capacidade confirmada.

---

### 39. Não apagar Outbox

Cada registro pode representar um fato ainda não publicado.

Apagar cria perda.

---

### 40. Validar recuperação da Outbox

Confirme:

- taxa de drenagem;
- oldest age reduz;
- pending retorna ao baseline;
- Kafka recebe;
- consumers processam;
- nenhuma duplicidade indevida.

---

## Kafka indisponível

### 41. Criar Kafka Unavailable

Arquivo:

```text
docs/runbook/KAFKA_UNAVAILABLE.md
```

Sinais:

- producer timeout;
- metadata unavailable;
- broker down;
- ISR insuficiente;
- consumers desconectados.

---

### 42. Diagnosticar Kafka

Verifique:

- broker;
- controller;
- listeners;
- disk;
- topics;
- partitions;
- replication;
- network;
- certificates quando aplicável.

---

### 43. Conter impacto do Kafka

O sistema pode:

- continuar persistindo Outbox;
- rejeitar operações quando backlog ultrapassar limite;
- manter queries;
- limitar entradas;
- sinalizar degradação.

---

### 44. Recuperar Kafka

Ações:

- restaurar broker;
- corrigir listener;
- liberar disk;
- restaurar network;
- validar topics;
- validar producer e consumer.

Não recrie topic sem análise.

---

## Consumer lag

### 45. Criar Consumer Lag

Arquivo:

```text
docs/runbook/CONSUMER_LAG.md
```

Sinais:

- lag cresce;
- jornada lenta;
- projection stale;
- consumer down;
- rebalance contínuo.

---

### 46. Diagnosticar lag

Verifique:

- taxa de entrada;
- taxa de processamento;
- partitions;
- consumers;
- erro por record;
- retry;
- DB;
- provider;
- GC;
- CPU.

---

### 47. Conter lag

Opções:

- reduzir entrada;
- restaurar consumer;
- aumentar concorrência dentro do limite;
- aumentar instances até partitions;
- corrigir record bloqueador;
- pausar replay.

---

### 48. Não aumentar consumers sem partitions

Consumers excedentes ficam ociosos.

---

### 49. Validar recuperação do lag

Confirme:

- tendência descendente;
- lag zero ou baseline;
- throughput estável;
- error rate;
- projection freshness;
- ausência de rebalance loop.

---

## Retry topics

### 50. Criar Retry Topic Growth

Arquivo:

```text
docs/runbook/RETRY_TOPIC_GROWTH.md
```

Sinais:

- volume cresce;
- idade aumenta;
- mesmo erro se repete;
- provider continua indisponível.

---

### 51. Evitar retry storm

Ações:

- confirmar backoff;
- limitar attempts;
- abrir circuit breaker;
- reduzir produção;
- mover terminal para DLQ quando policy exigir.

---

## DLQ

### 52. Criar DLQ Growth

Arquivo:

```text
docs/runbook/DLQ_GROWTH.md
```

Categorias:

- schema inválido;
- mensagem malformada;
- fingerprint divergente;
- erro permanente;
- bug de consumer;
- dado sensível bloqueado.

---

### 53. Triage da DLQ

Para cada grupo:

- message type;
- version;
- reason;
- producer;
- timestamp;
- quantidade;
- first seen;
- last seen.

Não exponha payload sensível.

---

### 54. Corrigir antes de replay

Replay somente depois de:

- causa resolvida;
- consumer validado;
- schema compatível;
- idempotência confirmada;
- janela autorizada.

---

### 55. Executar replay controlado

Use:

- lote pequeno;
- rate limit;
- tracking;
- audit;
- stop condition;
- evidence.

---

### 56. Validar replay

Confirme:

- processed;
- Inbox;
- aggregate;
- Outbox;
- projection;
- DLQ reduz;
- nenhuma duplicidade.

---

## Providers

### 57. Criar Provider Outage

Arquivo:

```text
docs/runbook/PROVIDER_OUTAGE.md
```

Sinais:

- timeout;
- `5xx`;
- circuit breaker open;
- failure rate;
- backlog de requests.

---

### 58. Diagnosticar provider

Verifique:

- somente um provider?
- autenticação?
- DNS?
- network?
- timeout?
- rate limit?
- contract drift?
- operação específica?

---

### 59. Conter provider outage

Opções:

- abrir breaker;
- limitar requests;
- suspender nova etapa dependente;
- preservar requests em Outbox;
- comunicar status degradado;
- evitar retry sincronizado.

---

### 60. Recuperar provider

Depois da confirmação externa:

- testar operação sintética;
- validar auth;
- half-open controlado;
- observar success rate;
- retomar taxa gradualmente.

---

## Resultados ambíguos

### 61. Criar Provider Ambiguous Results

Arquivo:

```text
docs/runbook/PROVIDER_AMBIGUOUS_RESULTS.md
```

Cenários:

- timeout após envio;
- conexão interrompida;
- resposta inválida;
- duplicate com payload divergente.

---

### 62. Não assumir falha

Resultado ambíguo exige:

- reconciliation;
- consulta por operation ID;
- audit;
- bloqueio de nova operação quando duplicidade é possível.

---

### 63. Validar reconciliação

Confirme:

- identidade da operação;
- resultado do provider;
- aggregate;
- compensação;
- eventos;
- projection.

---

## Projection stale

### 64. Criar Projection Stale

Arquivo:

```text
docs/runbook/PROJECTION_STALE.md
```

Sinais:

- freshness aumenta;
- gap;
- query desatualizada;
- projection worker parado;
- duplicate excessivo.

---

### 65. Diagnosticar projection

Verifique:

- consumer lag;
- version guard;
- gaps;
- Inbox;
- DB;
- worker;
- schema;
- event ordering.

---

### 66. Recuperar projection

Opções:

- restaurar worker;
- replay ordenado;
- rebuild controlado;
- corrigir gap;
- marcar read model stale enquanto recupera.

---

### 67. Não alterar aggregate pelo read model

A autoridade permanece no modelo transacional.

---

## Segurança

### 68. Criar Authentication Failure Spike

Arquivo:

```text
docs/runbook/AUTHENTICATION_FAILURE_SPIKE.md
```

Verifique:

- issuer;
- audience;
- key rotation;
- clock;
- token expiration;
- identity provider;
- config recente.

---

### 69. Diferenciar incidente e client error

Um único token expirado não é incidente.

Falha ampla após rotação pode ser SEV-1 ou SEV-2.

---

### 70. Criar Authorization Anomaly

Arquivo:

```text
docs/runbook/AUTHORIZATION_ANOMALY.md
```

Sinais:

- acesso permitido indevidamente;
- aumento de `403`;
- role mapping errado;
- scope bypass;
- tenant mismatch anormal.

---

### 71. Conter autorização indevida

Ações:

- bloquear endpoint;
- revogar credential;
- desabilitar role mapping;
- preservar logs;
- acionar Security Lead;
- avaliar exposição.

---

### 72. Criar Secret Exposure

Arquivo:

```text
docs/runbook/SECRET_EXPOSURE.md
```

Fontes:

- log;
- trace;
- report;
- Git;
- image;
- environment export;
- screenshot.

---

### 73. Responder a secret exposure

Passos:

1. conter acesso;
2. revogar secret;
3. rotacionar;
4. identificar uso;
5. remover exposição;
6. invalidar artifacts;
7. preservar evidence;
8. comunicar;
9. revisar blast radius.

---

### 74. Não apenas apagar o valor

O secret exposto precisa ser considerado comprometido.

---

## Observabilidade

### 75. Criar Observability Degraded

Arquivo:

```text
docs/runbook/OBSERVABILITY_DEGRADED.md
```

Sinais:

- metrics ausentes;
- traces ausentes;
- logs interrompidos;
- dashboards vazios;
- alert pipeline falha.

---

### 76. Distinguir sistema saudável de sistema invisível

Ausência de telemetria não prova saúde.

Pode elevar o risco e impedir deploy.

---

### 77. Recuperar observabilidade

Verifique:

- collector;
- exporters;
- credentials;
- network;
- storage;
- sampling;
- scrape targets;
- disk.

---

## Capacidade

### 78. Criar Capacity Saturation

Arquivo:

```text
docs/runbook/CAPACITY_SATURATION.md
```

Sinais:

- CPU sustentada;
- memory pressure;
- GC;
- pool saturation;
- p95 alto;
- backlog;
- lag;
- throttling.

---

### 79. Conter saturação

Opções:

- reduzir taxa;
- aplicar rate limit;
- escalar componente;
- pausar jobs;
- reduzir sampling temporariamente com aprovação;
- restaurar headroom.

---

### 80. Não alterar vários parâmetros

Uma mudança por vez quando possível.

Registre antes e depois.

---

## Release regressivo

### 81. Criar Release Regression

Arquivo:

```text
docs/runbook/RELEASE_REGRESSION.md
```

Sinais:

- erro após deploy;
- latência pior;
- migration incompatível;
- contract failure;
- security regression;
- backlog novo.

---

### 82. Comparar com previous manifest

Verifique:

- commit;
- digests;
- config;
- migrations;
- feature flags;
- contracts;
- performance.

---

### 83. Decidir rollback ou roll-forward

Rollback quando:

- manifest anterior é compatível;
- schema permite;
- impacto reduz.

Roll-forward quando:

- migration impede rollback seguro;
- evento novo já foi publicado;
- correção pequena é mais segura.

---

## Rollback

### 84. Criar Rollback Execution

Arquivo:

```text
docs/runbook/ROLLBACK_EXECUTION.md
```

Pré-condições:

- incidente declarado;
- approval;
- previous manifest;
- signature válida;
- migration assessment;
- communication;
- evidence.

---

### 85. Criar `prepare-rollback.ps1`

O script valida:

- environment;
- current manifest;
- target manifest;
- digests;
- signatures;
- schema compatibility;
- config;
- capacity.

Ele não executa rollback automaticamente sem autorização.

---

### 86. Executar rollback

Passos:

1. congelar mudanças;
2. preservar estado;
3. promover previous manifest;
4. esperar health;
5. executar smoke;
6. observar;
7. atualizar history;
8. comunicar.

---

### 87. Validar após rollback

Confirme:

- API;
- banco;
- Kafka;
- Outbox;
- consumers;
- providers;
- projection;
- segurança;
- observabilidade;
- journey.

---

## Recuperação final

### 88. Criar Recovery Validation

Arquivo:

```text
docs/runbook/RECOVERY_VALIDATION.md
```

Checklist:

- sintoma cessou;
- error rate normal;
- latency normal;
- backlog drenado;
- lag normal;
- DLQ controlada;
- projection atual;
- security normal;
- telemetry presente;
- smoke aprovado.

---

### 89. Criar `validate-recovery.ps1`

O script reúne checks e gera resumo.

---

### 90. Definir janela de observação

Depois da recuperação, acompanhe por janela adequada ao risco.

Não encerre imediatamente após um único request bem-sucedido.

---

## Evidence e encerramento

### 91. Criar Incident Evidence

Arquivo:

```text
docs/runbook/INCIDENT_EVIDENCE.md
```

Colete:

- timeline;
- alerts;
- snapshots;
- logs sanitizados;
- metrics;
- traces;
- commands;
- decisions;
- approvals;
- manifests;
- recovery checks;
- communication.

---

### 92. Criar `collect-incident-evidence.ps1`

O script usa diretório identificado por incident ID.

---

### 93. Criar critérios de encerramento

O incidente pode encerrar quando:

- impacto cessou;
- recovery validada;
- riscos residuais conhecidos;
- comunicação final enviada;
- evidence preservada;
- follow-ups criados.

---

### 94. Criar Post Incident Actions

Arquivo:

```text
docs/runbook/POST_INCIDENT_ACTIONS.md
```

Itens:

- causa raiz;
- corrective action;
- preventive action;
- owner;
- prioridade;
- prazo;
- teste de regressão;
- atualização de runbook;
- atualização de alert.

---

### 95. Não transformar culpa em análise

Foco:

- sistema;
- processo;
- controle;
- decisão;
- aprendizado.

---

## Governança do runbook

### 96. Criar Runbook Checklist

Arquivo:

```text
docs/runbook/RUNBOOK_CHECKLIST.md
```

Checklist:

- severity;
- roles;
- communication;
- snapshot;
- containment;
- diagnosis;
- recovery;
- validation;
- evidence;
- closure.

---

### 97. Criar Runbook Matrix

Arquivo:

```text
docs/runbook/RUNBOOK_MATRIX.md
```

Colunas:

- incidente;
- sinal;
- severidade provável;
- owner;
- contenção;
- diagnóstico;
- recuperação;
- validação;
- evidence.

---

### 98. Criar Runbook Risk Register

Arquivo:

```text
docs/runbook/RUNBOOK_RISK_REGISTER.md
```

Riscos:

```text
reinicio sem diagnostico;

evidence perdida;

rollback incompatível;

secret em artifact;

replay duplicado;

topic apagado;

Outbox truncada;

migration editada;

severidade subestimada;

comunicacao ausente;

incidente encerrado cedo;

runbook desatualizado.
```

---

### 99. Criar Runbook Traceability

Arquivo:

```text
docs/runbook/RUNBOOK_TRACEABILITY.md
```

Exemplo:

```text
Outbox SLO
-> Outbox alert
-> OUTBOX_BACKLOG runbook
-> recovery validation.

Kafka lag alert
-> CONSUMER_LAG
-> projection freshness
-> smoke evidence.

Security policy
-> authorization anomaly
-> secret exposure
-> security evidence.

Deployment manifest
-> release regression
-> rollback execution
-> deployment history.
```

---

### 100. Criar boundary da próxima aula

Arquivo:

```text
docs/runbook/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 698 define:

- incident classification;
- incident roles;
- communication;
- general triage;
- API incidents;
- database incidents;
- Flyway failure;
- Outbox backlog;
- Kafka outage;
- consumer lag;
- retry growth;
- DLQ growth;
- provider outage;
- ambiguous results;
- projection stale;
- authentication anomaly;
- authorization anomaly;
- secret exposure;
- observability degradation;
- capacity saturation;
- release regression;
- rollback;
- recovery validation;
- incident evidence;
- post-incident actions.

A aula 699 define:

- final technical correction part 1;
- gate review;
- critical finding selection;
- source, configuration and documentation correction;
- test correction;
- evidence correction;
- regression validation;
- updated risk decisions.

A primeira rodada de correcao tecnica final
nao e executada nesta aula.
```

---

## Exercício operacional guiado

### 101. Simular incidente de provider

Cenário:

```text
Payment Provider indisponivel
durante autorizacao.
```

---

### 102. Detectar

Sinais:

- timeout;
- provider failure rate;
- circuit breaker;
- retry topic;
- journey pending.

---

### 103. Classificar

Impacto:

- novos pagamentos;
- pedidos já registrados;
- estoque reservado;
- risco de backlog;
- risco de ambiguidade.

---

### 104. Conter

Ações:

- abrir breaker;
- limitar novas autorizações;
- preservar Outbox;
- comunicar degradação;
- evitar retry storm.

---

### 105. Diagnosticar

Verifique:

- provider status;
- DNS;
- network;
- auth;
- timeout;
- contract;
- recent config.

---

### 106. Recuperar

Depois da restauração:

- teste sintético;
- half-open;
- retomada gradual;
- retry controlado;
- reconciliation de ambíguos.

---

### 107. Validar

Confirme:

- success rate;
- backlog;
- retry;
- DLQ;
- aggregate;
- projection;
- smoke.

---

### 108. Coletar evidence

Registre timeline, decisões, métricas, logs, traces e resultado.

---

## Validação do runbook

### 109. Executar tabletop exercise

Escolha incidentes:

- API indisponível;
- Outbox backlog;
- Kafka indisponível;
- secret exposto;
- release regressivo.

Uma pessoa conduz sem consultar o autor do documento.

---

### 110. Verificar comandos

Cada comando precisa ser:

- existente;
- seguro;
- sanitizado;
- limitado ao ambiente;
- compatível com scripts atuais.

---

### 111. Validar links

Todos os documentos e scripts precisam existir.

---

### 112. Validar ausência de ações destrutivas automáticas

Procure:

- truncate;
- drop;
- delete sem filtro;
- topic delete;
- volume remove;
- system prune;
- secret em output.

Quando a palavra aparece em alerta documental, não deve existir comando automático associado.

---

### 113. Criar report

Arquivo:

```text
reports/runbook-project-report.yaml
```

Exemplo:

```yaml
runbookProject:
  procedures:
    total:
      24
    validated:
      24

  tabletop:
    APIUnavailable:
      PASS
    OutboxBacklog:
      PASS
    KafkaUnavailable:
      PASS
    SecretExposure:
      PASS
    ReleaseRegression:
      PASS

  safety:
    destructiveAutomaticActions:
      0
    secretLeaks:
      0

  correctionFinalPart1:
    executed:
      false

  gate:
    PASS
```

---

### 114. Criar evidence

Arquivo:

```text
contracts/runbook-project-evidence.yaml
```

Campos:

- lesson;
- project;
- runbook count;
- severity model status;
- roles status;
- communication status;
- general triage status;
- API runbook status;
- database runbook status;
- Flyway runbook status;
- Outbox runbook status;
- Kafka runbook status;
- consumer lag runbook status;
- retry runbook status;
- DLQ runbook status;
- provider runbook status;
- ambiguous result runbook status;
- projection runbook status;
- authentication runbook status;
- authorization runbook status;
- secret exposure runbook status;
- observability runbook status;
- capacity runbook status;
- release regression status;
- rollback status;
- recovery validation status;
- evidence collection status;
- tabletop scenario count;
- tabletop failure count;
- broken command count;
- broken link count;
- destructive automatic action count;
- secret leak count;
- correction final part 1 executed;
- documentation status;
- gate status;
- timestamp.

---

### 115. Criar gate do runbook

Status:

```text
PASS;

FAIL_RUNBOOK_STRUCTURE;

FAIL_INCIDENT_CLASSIFICATION;

FAIL_INCIDENT_ROLES;

FAIL_COMMUNICATION;

FAIL_GENERAL_TRIAGE;

FAIL_API_RUNBOOK;

FAIL_DATABASE_RUNBOOK;

FAIL_FLYWAY_RUNBOOK;

FAIL_OUTBOX_RUNBOOK;

FAIL_KAFKA_RUNBOOK;

FAIL_CONSUMER_LAG_RUNBOOK;

FAIL_RETRY_RUNBOOK;

FAIL_DLQ_RUNBOOK;

FAIL_PROVIDER_RUNBOOK;

FAIL_AMBIGUOUS_RESULT_RUNBOOK;

FAIL_PROJECTION_RUNBOOK;

FAIL_AUTHENTICATION_RUNBOOK;

FAIL_AUTHORIZATION_RUNBOOK;

FAIL_SECRET_EXPOSURE_RUNBOOK;

FAIL_OBSERVABILITY_RUNBOOK;

FAIL_CAPACITY_RUNBOOK;

FAIL_RELEASE_REGRESSION_RUNBOOK;

FAIL_ROLLBACK_RUNBOOK;

FAIL_RECOVERY_VALIDATION;

FAIL_INCIDENT_EVIDENCE;

FAIL_TABLETOP;

FAIL_COMMAND;

FAIL_LINK;

FAIL_DESTRUCTIVE_ACTION;

FAIL_SECRET_LEAK;

FAIL_CORRECTION_ANTICIPATION;

INCONCLUSIVE.
```

---

### 116. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\runbook\validate-runbook.ps1

.\scripts\runbook\incident-snapshot.ps1 `
  -Environment "local"

.\scripts\runbook\collect-incident-evidence.ps1 `
  -IncidentId "SIM-698-001"
```

Confirme:

- runbooks completos;
- comandos válidos;
- nenhum secret;
- nenhuma ação destrutiva automática;
- tabletop aprovado;
- correção técnica final ainda não executada.

---

### 117. Encerrar o laboratório

Confirme:

- Charter;
- índice;
- severidade;
- papéis;
- comunicação;
- triagem;
- API;
- banco;
- Flyway;
- Outbox;
- Kafka;
- lag;
- retry;
- DLQ;
- providers;
- ambiguidade;
- projection;
- autenticação;
- autorização;
- secrets;
- observabilidade;
- capacidade;
- release;
- rollback;
- recovery;
- evidence;
- post-incident;
- checklist;
- matrix;
- risk register;
- traceability;
- tabletop;
- report;
- evidence;
- gate aprovado;
- correção final não iniciada.

---

## Entendendo o que foi feito

### O projeto ganhou resposta operacional

Falhas deixaram de depender de improviso.

### Severidade ganhou critério

Impacto, integridade e segurança orientam prioridade.

### Papéis ficaram explícitos

Decisão, execução, comunicação e registro possuem ownership.

### Mensageria ganhou procedimentos

Outbox, lag, retries e DLQ possuem diagnóstico e recuperação.

### Ambiguidade foi tratada corretamente

Timeout externo não é convertido em falha confirmada.

### Segurança ganhou contenção

Autenticação, autorização e secret exposure possuem resposta específica.

### Rollback ganhou pré-condições

Manifest, assinatura, schema e configuração são validados.

### Recovery ganhou prova

Health, smoke, backlog, lag e projection encerram a recuperação.

### Evidence ganhou lugar central

Timeline, decisões e sinais podem ser auditados.

---

## Erros comuns importantes

### Reiniciar tudo imediatamente

O sintoma pode desaparecer e a causa ficar desconhecida.

### Apagar backlog

Eventos não publicados podem ser perdidos.

### Reexecutar provider sem operation ID

Efeito externo pode duplicar.

### Limpar DLQ sem análise

A causa permanece e a evidência desaparece.

### Editar migration aplicada

Checksums e histórico ficam inconsistentes.

### Desabilitar segurança

O incidente pode se tornar maior.

### Aumentar retry indefinidamente

O sistema cria retry storm.

### Encerrar após health verde

Backlog e jornada podem continuar degradados.

### Comunicar hipótese como causa

Confiança e decisões são prejudicadas.

### Iniciar correção final agora

A primeira rodada pertence à aula 699.

---

## Comandos úteis

### Snapshot

```powershell
.\scripts\runbook\incident-snapshot.ps1 `
  -Environment "local"
```

### Verificar Outbox

```powershell
.\scripts\runbook\check-outbox.ps1
```

### Verificar Kafka

```powershell
.\scripts\runbook\check-Kafka.ps1
```

### Validar recovery

```powershell
.\scripts\runbook\validate-recovery.ps1
```

### Coletar evidence

```powershell
.\scripts\runbook\collect-incident-evidence.ps1 `
  -IncidentId "SIM-698-001"
```

---

## Exercício principal

Conduza um tabletop do cenário:

```text
Kafka indisponivel,
Outbox acumulando
e consumer lag crescente
apos restauracao parcial.
```

Inclua:

1. alerta;
2. severidade;
3. Incident Commander;
4. Communications Lead;
5. snapshot;
6. release;
7. impacto;
8. freeze;
9. API behavior;
10. PostgreSQL;
11. Outbox;
12. Kafka;
13. topics;
14. producers;
15. consumers;
16. lag;
17. retries;
18. DLQ;
19. contenção;
20. restauração;
21. drenagem;
22. projection;
23. smoke;
24. janela de observação;
25. comunicação final;
26. evidence;
27. follow-ups.

Não execute a correção técnica final.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 697 e ponte para a aula 699 foram preservadas;
- Runbook Charter foi criado;
- índice principal foi criado;
- classificação foi criada;
- severidade usa impacto;
- papéis foram definidos;
- autoridade foi definida;
- comunicação foi criada;
- template inicial foi criado;
- hipótese não é comunicada como fato;
- triagem geral foi criada;
- incident snapshot foi criado;
- snapshot é sanitizado;
- mudança recente é verificada;
- mudanças são congeladas quando necessário;
- runbook de API indisponível foi criado;
- API foi diagnosticada;
- contenção da API foi definida;
- recuperação da API foi definida;
- recuperação da API foi validada;
- runbook de erros elevados foi criado;
- erros foram separados por classe;
- operações foram correlacionadas;
- padrão foi investigado;
- runbook de banco indisponível foi criado;
- banco foi diagnosticado;
- ações destrutivas foram evitadas;
- recuperação do banco foi definida;
- recuperação do banco foi validada;
- banco degradado foi tratado;
- locks foram diagnosticados;
- pool foi diagnosticado;
- degradação foi contida;
- Flyway failure foi criado;
- Flyway foi diagnosticado;
- migration aplicada não é alterada;
- Outbox backlog foi criado;
- publisher foi diagnosticado;
- backlog foi classificado;
- backlog foi contido;
- Outbox não é apagada;
- recovery da Outbox foi validada;
- Kafka unavailable foi criado;
- Kafka foi diagnosticado;
- impacto foi contido;
- recovery do Kafka foi definido;
- Consumer Lag foi criado;
- lag foi diagnosticado;
- lag foi contido;
- consumers e partitions foram relacionados;
- recovery do lag foi validada;
- Retry Topic Growth foi criado;
- retry storm foi evitada;
- DLQ Growth foi criado;
- triagem da DLQ foi criada;
- causa é corrigida antes do replay;
- replay controlado foi definido;
- replay foi validado;
- Provider Outage foi criado;
- provider foi diagnosticado;
- outage foi contida;
- provider recovery foi validada;
- ambiguous results foi criado;
- falha não é presumida;
- reconciliação foi validada;
- Projection Stale foi criado;
- projection foi diagnosticada;
- projection foi recuperada;
- aggregate não é alterado pelo read model;
- Authentication Failure Spike foi criado;
- client error foi diferenciado de incidente;
- Authorization Anomaly foi criado;
- acesso indevido foi contido;
- Secret Exposure foi criado;
- resposta de secret foi definida;
- secret exposto é considerado comprometido;
- Observability Degraded foi criado;
- invisibilidade foi diferenciada de saúde;
- observabilidade foi recuperada;
- Capacity Saturation foi criado;
- saturação foi contida;
- mudanças múltiplas foram evitadas;
- Release Regression foi criado;
- previous manifest foi comparado;
- rollback e roll-forward foram diferenciados;
- Rollback Execution foi criado;
- prepare rollback foi criado;
- rollback foi definido;
- rollback foi validado;
- Recovery Validation foi criada;
- validator de recovery foi criado;
- janela de observação foi definida;
- Incident Evidence foi criada;
- collector de evidence foi criado;
- encerramento foi definido;
- Post Incident Actions foi criado;
- análise sem culpa foi adotada;
- checklist foi criado;
- matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 699 foi criado;
- simulação de provider foi realizada;
- tabletop foi executado;
- comandos foram verificados;
- links foram validados;
- ações destrutivas automáticas foram bloqueadas;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- correção técnica final parte 1 não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\validate-secrets.ps1

.\scripts\runbook\validate-runbook.ps1
```

Adicione:

```powershell
git add `
  docs/runbook `
  scripts/runbook `
  reports/runbook-project-report.yaml `
  contracts/runbook-project-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|TRUNCATE TABLE|DROP DATABASE|docker system prune -a|Kafka-topics.*--delete|productionUrl|realTenant"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(runbook): operationalize OrderFlow incident response"
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

- secret;
- credencial;
- comando destrutivo automático;
- endpoint real;
- dado pessoal;
- correções da aula 699.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou o Runbook do projeto OrderFlow.

Você documentou:

```text
incident classification;

roles;

communication;

general triage;

API incidents;

database incidents;

Flyway failure;

Outbox backlog;

Kafka outage;

consumer lag;

retry growth;

DLQ growth;

provider outage;

ambiguous results;

projection stale;

authentication anomalies;

authorization anomalies;

secret exposure;

observability degradation;

capacity saturation;

release regression;

rollback;

recovery validation;

incident evidence;

post-incident actions;

tabletop;

report e gate.
```

O projeto agora possui procedimentos claros para detectar, conter, recuperar e validar incidentes.

A próxima aula será:

```text
699 - M20.29 - Correcao tecnica final parte 1
```

Nela, você iniciará a primeira rodada de correção técnica final, revisando gates, findings, riscos, inconsistências e artifacts para corrigir os itens prioritários sem alterar o escopo central do projeto.

A correção técnica final parte 1 não foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei incidentes.
- [ ] Defini papéis.
- [ ] Defini comunicação.
- [ ] Criei triagem geral.
- [ ] Criei runbooks de API e banco.
- [ ] Criei runbooks de Outbox e Kafka.
- [ ] Criei runbooks de lag, retry e DLQ.
- [ ] Criei runbooks de providers e projection.
- [ ] Criei runbooks de segurança.
- [ ] Criei runbook de observabilidade.
- [ ] Criei runbook de capacidade.
- [ ] Criei rollback e recovery.
- [ ] Criei evidence.
- [ ] Executei tabletop.
- [ ] Preservei a correção final para a aula 699.

---

## Troubleshooting adicional

### Runbook está genérico demais

Adicione sinais, comandos, contenção, recovery e validation específicos.

### Comando depende de produção

Substitua por script parametrizado e ambiente permitido.

### Evidence contém token

Interrompa publicação e sanitize.

### Rollback não valida schema

Adicione migration assessment.

### Replay gera duplicidade

Revise Inbox, operation ID e idempotência.

### Lag volta após alguns minutos

A taxa base continua acima da capacidade.

### Provider voltou, mas breaker permanece open

Revise janela e half-open.

### Projection continua stale

Revise gaps, replay e version guard.

### Incidente encerra sem smoke

Adicione recovery gate obrigatório.

### Quero corrigir todos os findings

Essa etapa começa na aula 699.

---

## Perguntas de revisão

1. O que caracteriza um incidente?
2. Severidade depende de quê?
3. Sintoma é causa?
4. O que faz o Incident Commander?
5. Por que congelar mudanças?
6. Por que coletar snapshot cedo?
7. Health prova recuperação?
8. Pode apagar Outbox?
9. Pode limpar DLQ sem análise?
10. Por que lag cresce?
11. Consumers acima de partitions ajudam?
12. Timeout de provider prova falha?
13. O que fazer com resultado ambíguo?
14. Read model é autoridade?
15. Secret apagado continua comprometido?
16. Ausência de telemetria prova saúde?
17. Quando usar rollback?
18. Quando usar roll-forward?
19. O que validar após rollback?
20. O que evidence precisa conter?
21. Quando encerrar incidente?
22. O que a aula 699 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Impacto operacional relevante.
2. Impacto e risco.
3. Não.
4. Coordena decisões.
5. Evitar novas variáveis.
6. Preservar estado.
7. Não.
8. Não.
9. Não.
10. Entrada supera processamento ou consumer falha.
11. Não além das partitions.
12. Não.
13. Reconciliar.
14. Não.
15. Sim.
16. Não.
17. Quando compatível e mais seguro.
18. Quando rollback é inseguro.
19. Jornada completa.
20. Timeline, sinais, decisões e ações.
21. Após recovery validada.
22. Correção técnica final parte 1.
23. Correção final.
24. Correcao tecnica final parte 1.
25. Sinais viram decisões seguras.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 698 - M20.28 - Runbook do projeto

- Continuei após Guia de execução local.
- Criei Runbook Charter.
- Criei índice principal.
- Criei classificação SEV.
- Defini critérios por impacto.
- Defini papéis.
- Defini autoridade do Incident Commander.
- Criei política de comunicação.
- Criei template de status.
- Separei hipótese de causa.
- Criei General Triage.
- Criei incident snapshot.
- Sanitizei snapshots.
- Verifiquei mudanças recentes.
- Defini freeze de mudanças.
- Criei API Unavailable.
- Criei API High Error Rate.
- Criei Database Unavailable.
- Criei Database Degraded.
- Criei Flyway Failure.
- Criei Outbox Backlog.
- Criei Kafka Unavailable.
- Criei Consumer Lag.
- Criei Retry Topic Growth.
- Criei DLQ Growth.
- Criei Provider Outage.
- Criei Provider Ambiguous Results.
- Criei Projection Stale.
- Criei Authentication Failure Spike.
- Criei Authorization Anomaly.
- Criei Secret Exposure.
- Criei Observability Degraded.
- Criei Capacity Saturation.
- Criei Release Regression.
- Criei Rollback Execution.
- Criei Recovery Validation.
- Criei Incident Evidence.
- Criei Post Incident Actions.
- Evitei ações destrutivas.
- Defini replay controlado.
- Defini reconciliação.
- Defini rollback e roll-forward.
- Criei scripts de diagnóstico.
- Criei checklist.
- Criei Runbook Matrix.
- Criei Runbook Risk Register.
- Criei Runbook Traceability.
- Criei boundary para a aula 699.
- Simulei outage de provider.
- Executei tabletop.
- Validei comandos.
- Validei links.
- Bloqueei ações destrutivas automáticas.
- Criei report, evidence e gate.
- Não antecipei a correção final.
- Próxima aula: Correcao tecnica final parte 1.
```

---

## Referência técnica curta

- Runbook.
- Incident.
- Severity.
- Incident Commander.
- Triage.
- Containment.
- Recovery.
- Rollback.
- Roll-Forward.
- Outbox Backlog.
- Consumer Lag.
- Retry Topic.
- Dead Letter Queue.
- Reconciliation.
- Secret Rotation.
- Capacity Saturation.
- Incident Evidence.
- Tabletop Exercise.
- Post-Incident Action.

Regra final:

```text
O Runbook do OrderFlow deve transformar alertas e sintomas em decisões seguras e auditáveis: severity é definida por impacto, integridade e segurança, Incident Commander coordena papéis, freeze e comunicação, snapshot inicial preserva release, digests, health, errors, latency, resources, PostgreSQL, Kafka, Outbox, lag, DLQ, providers e projection sem secrets, runbooks de API distinguem indisponibilidade, 4xx, 5xx e timeout, banco indisponível nunca leva a reset destrutivo e banco degradado investiga locks, pool, CPU e disk, Flyway failure preserva migrations aplicadas, Outbox backlog é classificado por entrada, publisher, Kafka, mensagem e lease e nunca é apagado, Kafka outage preserva Outbox e limita entrada, consumer lag correlaciona throughput, partitions, consumers, retries e dependencies, retry storm é contida com backoff e limits, DLQ é triada por type, version e reason e replay só ocorre após correção e idempotência, provider outage usa circuit breaker e retomada gradual, ambiguous outcome exige reconciliation por operation ID, projection stale usa lag, gap, version guard e replay sem alterar aggregate, security runbooks cobrem authentication spikes, authorization anomalies e secret exposure com revogação e rotação, observability degradation não é confundida com saúde, capacity saturation usa rate control e mudanças isoladas, release regression compara manifests e decide rollback ou roll-forward com schema assessment, recovery valida health, smoke, backlog, lag, DLQ, projection, security e telemetry durante janela de observação, incident evidence registra timeline, commands, decisions, approvals and recovery, tabletop testa procedimentos sem ações destrutivas automáticas, e o gate termina com runbooks, scripts, matrix, risks, report e evidence aprovados, enquanto a seleção e correção dos findings técnicos prioritários permanecem reservadas para a aula 699.
```
