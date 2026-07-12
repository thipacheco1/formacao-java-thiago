# 455 - M15.45 - Fechamento do Modulo 15

## Apresentação da aula

Chegamos ao encerramento formal do Módulo 15.

Este módulo começou na aula 411 com uma mudança de mentalidade:

```text
segurança não é
uma annotation;

segurança não é
um filtro isolado;

segurança não é
uma etapa executada
somente antes da produção.
```

A segurança foi tratada como engenharia de risco.

Ao longo de quarenta e cinco aulas, o trabalho percorreu:

- fundamentos de segurança web;
- threat modeling;
- OWASP aplicado;
- CORS;
- CSRF;
- security headers;
- hashing de passwords;
- arquitetura do Spring Security;
- `SecurityFilterChain`;
- autenticação em memória;
- autenticação com banco;
- JWT;
- filtros e validação de tokens;
- refresh token;
- roles, authorities e permissions;
- Method Security;
- regras de negócio;
- erros seguros;
- auditoria;
- secrets;
- OAuth 2.0;
- OpenID Connect;
- PKCE;
- Keycloak;
- multi-tenancy;
- LGPD;
- rate limiting;
- mass assignment;
- DTOs e logs;
- vulnerabilidades em dependências;
- testes de segurança;
- testes de autorização;
- hardening;
- checklist de pull request;
- projeto prático;
- revisão;
- prova;
- refatoração;
- aula ensinável.

Agora precisamos responder:

```text
o que foi realmente aprendido,
o que foi comprovado,
quais entregáveis existem,
quais riscos permanecem
e por que estamos prontos
para avançar?
```

O fechamento não será uma celebração vazia.

Ele será uma auditoria do próprio aprendizado.

Nesta aula, você irá revisar:

```text
competências;

artefatos;

evidências;

gaps;

decisões;

próximos passos.
```

Também será executado um fechamento técnico do projeto:

```text
labs/m15/projeto-api-segura
```

A aplicação continuará classificada como:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

Isso não representa fracasso.

Representa uma decisão profissional limitada ao que foi realmente comprovado.

O projeto possui evidências fortes sobre:

- autenticação;
- autorização;
- tenancy;
- ownership;
- segregação de funções;
- DTOs;
- mass assignment;
- auditoria;
- logs;
- rate limiting;
- concorrência;
- hardening;
- supply chain;
- testes;
- backup e restore local;
- release gate.

Mas ainda não possui evidências produtivas sobre:

- alta disponibilidade;
- TLS real;
- proxy aprovado;
- cluster PostgreSQL;
- cluster Redis;
- Keycloak em produção;
- disaster recovery produtivo;
- load test representativo;
- observabilidade integrada;
- rotação operacional de secrets;
- incident drill;
- aprovação legal de policies de retenção.

O encerramento também prepara o próximo salto da formação.

O Módulo 16 terá como tema:

```text
Integracoes, mensageria,
eventos e resiliencia.
```

A primeira aula será:

```text
456 - M16.01 - Integracoes HTTP entre sistemas
```

Essa transição é natural.

Até aqui, protegemos uma aplicação.

A partir do próximo módulo, protegeremos também a comunicação entre aplicações.

Novas perguntas aparecerão:

```text
como chamar outra API?

como autenticar sistemas?

como tratar timeout?

como lidar com retry?

como evitar duplicidade?

como versionar contratos?

como receber eventos?

como garantir resiliencia?

como observar falhas distribuídas?
```

A segurança construída no Módulo 15 continuará sendo necessária.

Integração sem segurança amplia o risco.

Segurança sem resiliência pode produzir indisponibilidade.

A formação agora conectará essas duas dimensões.

---

## Onde estamos na formação

A sequência final do módulo foi:

```text
447:
Projeto API segura parte 1.

448:
Projeto API segura parte 2.

449:
Projeto API segura parte 3.

450:
Revisao seguranca parte 1.

451:
Revisao seguranca parte 2.

452:
Prova pratica seguranca.

453:
Refatoracao final seguranca.

454:
Aula ensinavel seguranca.

455:
Fechamento do Modulo 15.
```

A próxima sequência será:

```text
456:
Integracoes HTTP entre sistemas.

457:
RestClient.

458:
WebClient.

459:
Timeouts em clientes HTTP.

460:
Retry com criterio.
```

Nesta aula:

```text
nova feature:
não.

nova migration:
não.

novo endpoint:
não.

auditoria do aprendizado:
sim.

inventário de artefatos:
sim.

validação de competências:
sim.

plano de revisão:
sim.

ponte para M16:
sim.
```

A regra central será:

```text
um módulo termina
quando o conhecimento,
os artefatos,
as evidências
e os próximos passos
estão claros.
```

---

## Objetivo prático

Ao final desta aula, você terá criado:

```text
docs/security/
├── M15_MAPA_DE_COMPETENCIAS.md
├── M15_INVENTARIO_DE_ENTREGAVEIS.md
├── M15_RELATORIO_FINAL_DE_EVIDENCIAS.md
├── M15_GAPS_E_PROXIMOS_PASSOS.md
└── M15_PLANO_DE_REVISAO_30_60_90.md
```

Também terá atualizado:

```text
README.md;

docs/diario-de-bordo.md;

docs/mapa-da-formacao.md
ou documento equivalente.
```

Você irá:

1. revisar as 45 aulas;
2. agrupar competências;
3. auditar entregáveis;
4. conferir arquivos;
5. conferir testes;
6. conferir migrations;
7. conferir documentação;
8. revisar decisões de arquitetura;
9. revisar decisões de segurança;
10. revisar a prova prática;
11. revisar a refatoração;
12. revisar a aula ensinável;
13. registrar pontos fortes;
14. registrar gaps;
15. criar plano de revisão;
16. criar plano de portfólio;
17. executar gate final;
18. congelar evidências;
19. encerrar o módulo;
20. preparar o Módulo 16.

---

## Conceito essencial

### Fechamento de módulo não é resumo

Um resumo repete conteúdos.

Um fechamento responde:

- o que sei fazer;
- o que consigo explicar;
- o que consigo demonstrar;
- o que consigo testar;
- o que ainda não consigo comprovar;
- quais artefatos sustentam minha afirmação;
- qual próximo passo é coerente.

---

### Competência

Competência combina:

```text
conhecimento;

execução;

diagnóstico;

decisão;

comunicação.
```

Saber definir JWT não é suficiente.

Competência em JWT significa conseguir:

- explicar header, payload e signature;
- validar issuer e audience;
- rejeitar token inválido;
- diferenciar access token e ID Token;
- criar teste negativo;
- diagnosticar `401`;
- impedir log de token;
- justificar a decisão.

---

### Evidência

Evidência é algo reproduzível.

Exemplos:

- classe de teste;
- report;
- migration;
- contract;
- runbook;
- commit;
- SBOM;
- scanner;
- backup restore;
- threat model;
- matriz de autorização;
- checklist de PR;
- decisão GO/NO-GO.

Frases como:

```text
eu entendi;
eu revisei;
eu testei.
```

não bastam sem referência verificável.

---

### Gap

Gap não é vergonha.

Gap é uma diferença conhecida entre:

```text
estado atual;

estado necessário.
```

Um gap bom possui:

- ID;
- descrição;
- severidade;
- owner;
- blocker;
- compensação;
- prazo;
- status.

---

### Domínio de segurança consolidado

O módulo criou um modelo mental unificado:

```text
ameaça;

identidade;

contexto;

permission;

recurso;

estado;

controle;

evidência;

risco residual.
```

Esse modelo será reutilizado em todo o restante da formação.

---

### Primeira competência: modelar risco

Você aprendeu a:

- identificar ativos;
- identificar atores;
- mapear fronteiras;
- criar ameaças;
- relacionar controles;
- registrar evidências;
- declarar risco residual;
- evitar listas genéricas.

Artefatos:

```text
PROJECT_THREAT_MODEL.md;

security-test-matrix.yaml;

authorization-test-matrix.yaml;

threat model delta da prova.
```

---

### Segunda competência: proteger o browser

Você diferenciou:

```text
CORS;

CSRF;

security headers.
```

Aprendeu que:

- CORS não autentica;
- CORS não protege curl ou backend;
- CSRF depende do transporte automático da credencial;
- API Bearer stateless e aplicação stateful possuem decisões diferentes;
- HSTS exige HTTPS real;
- headers complementam, mas não substituem autorização.

---

### Terceira competência: autenticar identidades

Você percorreu:

```text
password hashing;

usuário em memória;

usuário no banco;

JWT;

refresh token;

OAuth 2.0;

OIDC;

PKCE;

Keycloak.
```

Decisões centrais:

- password não é armazenada reversivelmente;
- JWT precisa de assinatura e claims válidas;
- access token é destinado à API;
- ID Token é destinado ao client;
- refresh token precisa de rotação e replay detection;
- identidade estável usa `issuer + subject`;
- token válido não provisiona acesso local automaticamente.

---

### Quarta competência: autorizar ações

Você separou:

```text
role;

authority;

permission;

ownership;

tenant;

state;

segregation of duties.
```

Aprendeu que:

- role não concede automaticamente todas as permissions;
- Method Security protege o service;
- permission geral não substitui policy de domínio;
- requester não revisa a própria solicitação;
- outro owner e outro tenant precisam ser ocultados;
- autorização vertical e horizontal exigem testes diferentes.

---

### Quinta competência: aplicar multi-tenancy

O fluxo consolidado foi:

```text
Authentication;

issuer + subject;

application user;

memberships;

selector;

TenantContext;

query tenant-scoped.
```

Regras:

- `X-Tenant-Id` é selector;
- membership prova acesso;
- global admin ainda seleciona contexto;
- queries não podem depender de filtro posterior;
- listagem e count usam os mesmos predicates;
- cross-tenant não gera lookup global explicativo.

---

### Sexta competência: proteger input e output

Você implementou:

- DTO específico;
- JSON estrito;
- unknown fields rejeitados;
- mappers explícitos;
- server-controlled fields;
- response allowlist;
- no entity no body;
- Problem Details seguro;
- ETag e If-Match;
- optimistic locking.

Campos como:

```text
tenant;

owner;

status;

reviewer;

version;

timestamps;

permissions.
```

não vêm do client.

---

### Sétima competência: privacidade

Você revisou:

- classificação;
- inventário;
- finalidade;
- minimização;
- retenção;
- autenticação recente;
- requests dos titulares;
- backup lifecycle;
- export seguro;
- blockers legais.

A aplicação não inventa base legal nem prazo de retenção.

---

### Oitava competência: observabilidade segura

Você diferenciou:

```text
logs;

audit;

metrics;

traces.
```

Regras:

- logs não recebem payloads sensíveis;
- audit registra fatos mínimos;
- metrics usam labels de baixa cardinalidade;
- MDC contém apenas identificadores técnicos aprovados;
- sentinelas testam vazamento;
- correlation ID facilita diagnóstico sem expor identity.

---

### Nona competência: limitar abuso

Você implementou rate limiting com:

- múltiplas janelas;
- Redis;
- Lua;
- HMAC;
- dimensions;
- `429`;
- `503`;
- `Retry-After`;
- fail-open ou fail-closed;
- testes de indisponibilidade.

A escolha depende do risco da operação.

---

### Décima competência: proteger supply chain

Você aprendeu a:

- ler dependency tree;
- identificar transitivas;
- gerar SBOM;
- executar SCA;
- analisar CVE;
- considerar CVSS;
- priorizar KEV;
- consultar EPSS;
- avaliar reachability;
- governar suppressions;
- manter risk register;
- ligar report ao artifact.

---

### Décima primeira competência: testar segurança

A estratégia incluiu:

```text
unit;

web;

integration;

policy;

contract;

external;

supply chain.
```

Testes negativos passaram a verificar:

- rejeição;
- status;
- code;
- ausência de mutação;
- ausência de audit de sucesso;
- ausência de token;
- ausência de PII;
- ausência de vazamento;
- persistência correta;
- Redis;
- PostgreSQL;
- concorrência.

---

### Décima segunda competência: hardening

Você reduziu a superfície com:

- methods allowlist;
- media types;
- body limits;
- header limits;
- parameter limits;
- page limit;
- sort allowlist;
- timeouts;
- filas finitas;
- keep-alive;
- forwarded headers off;
- management privado;
- errors genéricos;
- multipart off;
- graceful shutdown;
- profile de release.

---

### Décima terceira competência: governar mudança

O checklist de PR passou a exigir:

- classificação;
- owner;
- threat model;
- negative tests;
- evidence;
- rollback;
- deployment;
- monitoring;
- exceptions com expiração;
- gates do commit final.

Segurança deixou de depender apenas da memória do reviewer.

---

### Décima quarta competência: operar um release

O projeto final incluiu:

- runbooks;
- backup;
- restore;
- evidence manifest;
- gaps;
- GO/NO-GO;
- profile release;
- SBOM;
- SCA;
- E2E;
- rollback;
- auditoria de decisão.

---

### Décima quinta competência: comunicar

A aula ensinável comprovou que você consegue:

- selecionar um objetivo;
- construir narrativa;
- demonstrar ameaça;
- explicar controle;
- propor exercício;
- criar rubrica;
- dar feedback;
- preparar plano B;
- evitar simplificação insegura.

---

## Mão na massa guiada

### 1. Criar o mapa de competências

Arquivo:

```text
docs/security/
M15_MAPA_DE_COMPETENCIAS.md
```

Estrutura:

| Competência | Nível | Evidência | Próxima revisão |
|---|---|---|---|
| Threat modeling | aplicado | threat model | 30 dias |
| JWT | aplicado | boundary tests | 30 dias |
| Authorization | aplicado | matrix tests | 15 dias |
| Multi-tenancy | aplicado | cross-tenant tests | 15 dias |
| Privacy | intermediário | inventory | 30 dias |
| Supply chain | aplicado | SBOM/SCA | por release |
| Hardening | aplicado | release tests | por release |

Níveis permitidos:

```text
INICIADO;

PRATICADO;

APLICADO;

ENSINAVEL.
```

Não use `DOMINADO`.

Conhecimento técnico continua evoluindo.

---

### 2. Classificar competências

Critério:

```text
INICIADO:
consigo reconhecer.

PRATICADO:
consigo executar
com orientação.

APLICADO:
consigo implementar,
testar e diagnosticar.

ENSINAVEL:
consigo explicar,
demonstrar e avaliar.
```

Avalie com honestidade.

---

### 3. Criar inventário de entregáveis

Arquivo:

```text
M15_INVENTARIO_DE_ENTREGAVEIS.md
```

Grupos:

```text
requirements;

threat model;

security config;

identity;

tenancy;

authorization;

privacy;

rate limiting;

DTOs;

audit;

logs;

supply chain;

tests;

hardening;

PR;

project;

release;

teaching.
```

Cada item precisa de path e status.

---

### 4. Auditar as 45 aulas

Confirme a sequência:

```text
411 até 455.
```

Valide:

- número;
- código;
- título;
- arquivo;
- ponte;
- conteúdo;
- lab;
- diário;
- commit sugerido.

Não reescreva aulas antigas durante o fechamento.

Registre apenas gaps reais.

---

### 5. Auditar migrations

Projeto principal:

```text
V6 até V13
conforme histórico.
```

Projeto seguro:

```text
V1:
identity e tenancy.

V2:
access request.

V3:
review.

V4:
audit.
```

Confirme:

- ordem;
- checksum;
- constraints;
- indexes;
- `Flyway validate`;
- `clean` disabled no release.

---

### 6. Auditar endpoints

Projeto seguro:

```text
POST /api/v1/access-requests;

GET /api/v1/access-requests;

GET /api/v1/access-requests/{id};

GET /api/v1/access-requests/review-queue;

POST /api/v1/access-requests/{id}/decision;

GET /api/v1/access-requests/{id}/audit.
```

Para cada endpoint, registre:

- actor;
- permission;
- tenant rule;
- ownership;
- state;
- rate limit;
- audit;
- errors;
- tests.

---

### 7. Auditar contracts

Confirme:

| Status | Uso |
|---:|---|
| 400 | request ou header inválido |
| 401 | autenticação ausente ou inválida |
| 403 | permission ou contexto negado |
| 404 | recurso inexistente ou oculto |
| 409 | estado ou concorrência |
| 412 | precondition stale |
| 413 | payload grande |
| 415 | media type inválido |
| 428 | If-Match ausente |
| 429 | rate limit excedido |
| 503 | controle de segurança indisponível |

---

### 8. Auditar permissions

Lista final:

```text
access-request:create;

access-request:read;

access-request:review;

access-request:audit.
```

Confirme:

- comparação exata;
- nenhuma role implícita;
- Method Security;
- converter JWT;
- tests diretos;
- deny-by-default.

---

### 9. Auditar tenancy

Cenários obrigatórios:

- zero membership;
- uma membership;
- múltiplas memberships;
- selector válido;
- selector inválido;
- membership inativa;
- cross-tenant;
- count scoped;
- queue scoped;
- audit scoped.

---

### 10. Auditar ownership e SoD

Confirme:

```text
requester lê próprio;

requester não lê outro owner;

reviewer vê outros
no mesmo tenant;

reviewer não vê
a própria na fila;

reviewer não decide
a própria por ID;

auditor não decide.
```

---

### 11. Auditar DTOs

Requests:

```text
CreateAccessRequestRequest;

ReviewAccessRequestRequest.
```

Confirme ausência de:

- tenant;
- owner;
- requester;
- reviewer;
- status;
- version;
- timestamps;
- authorities.

Responses seguem allowlist.

---

### 12. Auditar errors

Para cada Problem Details:

- status;
- type;
- title;
- code;
- safe detail;
- correlation ID;
- no-store;
- ausência de internals.

Não compare mensagens de exception.

---

### 13. Auditar logs e audit

Use sentinel tests.

Confirme ausência de:

- access token;
- refresh token;
- password;
- subject;
- e-mail;
- justification;
- decision reason;
- body;
- headers.

Confirme presença de:

- event;
- outcome;
- reason code;
- route template;
- correlation;
- target técnico quando permitido.

---

### 14. Auditar rate limiting

Policies:

- create;
- queue;
- decision;
- audit;
- login;
- refresh;
- privacy.

Confirme:

- windows;
- limits;
- dimensions;
- HMAC;
- TTL;
- `429`;
- `503`;
- failure mode;
- no raw IDs;
- integration test.

---

### 15. Auditar supply chain

Execute:

```powershell
.\mvnw.cmd dependency:tree

.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Confirme:

- versions fixas;
- SBOM;
- reports;
- KEV;
- suppression file;
- risk register;
- no `LATEST`;
- no version range;
- no HTTP repository;
- no scanner skip.

---

### 16. Auditar hardening

Execute:

- TRACE;
- XML;
- Accept XML;
- body grande;
- header grande;
- parameters;
- page size;
- sort;
- forwarded spoofing;
- Actuator;
- stack trace;
- session cookie;
- graceful shutdown.

Registre resultados.

---

### 17. Auditar backup e restore

Confirme:

- backup sintético;
- checksum;
- restore em banco separado;
- migrations;
- counts;
- relations;
- constraints;
- audit;
- cleanup;
- runbook;
- RPO/RTO propostos.

---

### 18. Auditar o projeto prático

Parte 1:

```text
identity;
tenant;
create;
read;
list.
```

Parte 2:

```text
queue;
approve;
reject;
SoD;
audit;
rate limit;
concurrency.
```

Parte 3:

```text
hardening;
privacy;
retention;
backup;
SBOM;
SCA;
E2E;
release.
```

---

### 19. Auditar a prova

Arquivo:

```text
M15_PROVA_PRATICA_SEGURANCA_RESULTADO.md
```

Confirme:

- findings;
- severidade;
- correções;
- tests;
- blockers;
- score;
- risk residual;
- release decision.

---

### 20. Auditar a refatoração

Confirme:

- invariants;
- context;
- policies;
- ports;
- factories;
- package boundaries;
- architecture tests;
- regression tests;
- evidence;
- rollback.

Nenhuma invariante pode ter sido enfraquecida.

---

### 21. Auditar a aula ensinável

Confirme:

- público;
- objetivo;
- roteiro;
- demo;
- exercício;
- gabarito;
- rubrica;
- blockers;
- feedback;
- plano B;
- consistency test.

---

### 22. Criar relatório final de evidências

Arquivo:

```text
M15_RELATORIO_FINAL_DE_EVIDENCIAS.md
```

Seções:

```markdown
# Relatorio final do Modulo 15

## Escopo

## Competencias

## Projeto

## Testes

## Supply chain

## Hardening

## Recovery

## Aula ensinavel

## Gaps

## Decisao

## Ponte M16
```

---

### 23. Criar gaps e próximos passos

Arquivo:

```text
M15_GAPS_E_PROXIMOS_PASSOS.md
```

Separe:

```text
gaps de aprendizagem;

gaps do laboratório;

gaps produtivos;

gaps operacionais.
```

Exemplo:

| Gap | Tipo | Owner | Ação |
|---|---|---|---|
| TLS real | produtivo | platform | validar no M16+ |
| load test | operacional | backend/platform | módulo de performance |
| retention legal | governance | privacy | aprovação externa |
| HA Keycloak | infraestrutura | identity | arquitetura futura |

---

### 24. Criar plano 30-60-90

Arquivo:

```text
M15_PLANO_DE_REVISAO_30_60_90.md
```

Trinta dias:

- revisar JWT;
- executar matriz de autorização;
- reproduzir cross-tenant;
- revisar DTOs e logs;
- gerar SBOM.

Sessenta dias:

- repetir prova;
- implementar endpoint novo seguro;
- revisar threat model;
- executar restore;
- ensinar aula curta.

Noventa dias:

- refazer projeto sem consultar todas as soluções;
- integrar segurança em um projeto real;
- conduzir review de PR;
- documentar gaps;
- comparar evolução.

---

### 25. Criar exercício de consolidação

Sem consultar as aulas, explique:

```text
uma request de review
desde o access token
até o audit.
```

Inclua:

- issuer;
- audience;
- identity;
- membership;
- permission;
- tenant;
- query;
- SoD;
- If-Match;
- state;
- audit;
- response.

Depois compare com o material.

---

### 26. Criar uma nova ameaça

Exemplo:

```text
reviewer possui permission,
mas está inativo
após o token ser emitido.
```

Responda:

- onde controlar;
- qual status;
- qual audit;
- qual test;
- qual side effect;
- qual cache invalidar.

Isso comprova transferência de conhecimento.

---

### 27. Criar portfólio técnico

Selecione artefatos sem secrets:

- arquitetura;
- threat model sintético;
- matriz;
- OpenAPI;
- test strategy;
- hardening baseline;
- SBOM de laboratório;
- runbook;
- GO/NO-GO;
- aula ensinável.

Remova:

- tokens;
- IDs reais;
- secrets;
- dumps;
- endpoints internos;
- dados empresariais.

---

### 28. Atualizar README do projeto

Inclua:

- objetivo;
- arquitetura;
- atores;
- fluxo;
- endpoints;
- segurança;
- como executar;
- como testar;
- limitations;
- GO/NO-GO;
- referências internas.

Não transforme README em cópia de todo o módulo.

---

### 29. Atualizar mapa da formação

Marque M15 como:

```text
CONCLUIDO.
```

Registre:

- 45 aulas;
- projeto;
- prova;
- refatoração;
- aula ensinável;
- fechamento;
- próximo módulo.

Não altere a numeração oficial.

---

### 30. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=SecurityInvariantPolicyTest,SecurityRefactoringRegressionTest,TeachingMaterialPolicyTest,TeachingSecurityConsistencyTest,GoNoGoDecisionPolicyTest `
  test
```

---

### 31. Executar suíte de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

Confirme todas as tags esperadas.

---

### 32. Executar SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Se o scanner falhar:

```text
fechamento técnico:
bloqueado.
```

---

### 33. Executar backup e restore

Use os scripts e dados sintéticos.

Não dependa apenas de evidência antiga.

Se não puder executar agora, registre o gap e não declare recovery comprovado nesta data.

---

### 34. Executar gate final

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

O gate final precisa ocorrer no commit de fechamento.

---

### 35. Criar manifest final

Registre:

- commit;
- build;
- JAR hash;
- SBOM hash;
- SCA hash;
- tests;
- migrations;
- profiles;
- backup evidence;
- decision.

---

### 36. Emitir decisão final do módulo

Decisão esperada:

```text
M15_CONCLUIDO;

REFACTOR_ACCEPTED;

TEACHING_MATERIAL_ACCEPTED;

GO_CONTROLLED;

NO_GO_PUBLIC.
```

Se um blocker reaparecer:

```text
M15_TECHNICAL_CLOSURE_BLOCKED.
```

Corrija antes de encerrar.

---

### 37. Criar registro de pontos fortes

Exemplos:

- raciocínio por ameaça;
- tests negativos;
- tenant e ownership;
- contratos de erro;
- audit mínimo;
- supply chain;
- documentação;
- comunicação.

Use evidências.

---

### 38. Criar registro de pontos a reforçar

Exemplos:

- OIDC avançado;
- incident response;
- criptografia aplicada;
- infraestrutura produtiva;
- performance sob ataque;
- segurança em mensageria;
- zero trust entre serviços;
- mTLS;
- policy as code externa.

Esses itens não invalidam o módulo.

Eles orientam evolução.

---

### 39. Criar ponte técnica para M16

Pergunta:

```text
o que muda quando
a nossa aplicação
chama outra aplicação?
```

Novas fronteiras:

- DNS;
- TLS;
- credentials de serviço;
- timeout;
- retry;
- circuit breaker;
- idempotência;
- contrato;
- tracing;
- rate limit externo;
- dependency failure;
- partial failure.

A segurança do M15 continuará aplicada.

---

### 40. Preparar o primeiro laboratório do M16

Não implemente ainda.

Apenas registre:

```text
client HTTP;

API simulada;

request;

response;

timeout;

error;

correlation;

authentication futura.
```

A implementação começa na aula 456.

---

### 41. Revisar working tree

```powershell
git status
git diff --check
git diff --stat
```

Confirme:

- documentos finais;
- diário;
- mapa;
- README;
- nenhum dump;
- nenhum secret;
- nenhum report local indevido;
- nenhum teste removido.

---

### 42. Criar commit de fechamento

Commit recomendado será executado ao final desta aula.

Depois, reexecute o gate no commit final quando a policy exigir.

---

## Entendendo o que foi feito

### O módulo foi auditado

A conclusão deixou de depender de sensação subjetiva.

### Competências foram ligadas a evidências

Cada afirmação possui artefato, teste ou decisão.

### Gaps ficaram visíveis

Aprendizagem e produção foram separadas.

### O projeto ganhou rastreabilidade

Requirements, threats, controls, tests e release estão conectados.

### A prova validou diagnóstico

O conhecimento foi usado sob um cenário de regressão.

### A refatoração validou design

A estrutura melhorou sem perder invariantes.

### A aula ensinável validou comunicação

O conhecimento pôde ser organizado e transmitido.

### A ponte para M16 ficou coerente

Segurança agora acompanha integrações e sistemas distribuídos.

---

## Erros comuns importantes

### Declarar domínio completo

Segurança continua evoluindo.

### Encerrar sem gate

Documentação não substitui execução.

### Confundir laboratório com produção

Evidências locais possuem limites.

### Ocultar gaps para parecer avançado

A decisão perde credibilidade.

### Carregar artifacts sensíveis no portfólio

Documentação também pode vazar dados.

### Reexecutar apenas happy path

O fechamento precisa de regressão negativa.

### Reescrever aulas antigas durante o fechamento

Isso quebra a fonte da verdade e o histórico.

### Começar o M16 antes de registrar o M15

A continuidade pedagógica fica incompleta.

### Chamar backup antigo de evidência atual

Evidence precisa ter data e contexto.

### Marcar tudo como ensinável

Cada competência precisa de comprovação real.

---

## Comandos úteis

### Testes finais

```powershell
.\mvnw.cmd `
  -Dtest=SecurityInvariantPolicyTest,SecurityRefactoringRegressionTest,TeachingMaterialPolicyTest,TeachingSecurityConsistencyTest,GoNoGoDecisionPolicyTest `
  test
```

### Suíte de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

### Supply chain

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

### Gate final

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

### Conferir arquivos

```powershell
git status
git diff --check
git diff --stat
```

---

## Exercício guiado

### Parte 1 — Competências

Liste o que consegue executar sem copiar.

### Parte 2 — Evidências

Ligue cada competência a um artefato.

### Parte 3 — Projeto

Audite endpoints, permissions e tenants.

### Parte 4 — Dados

Audite DTOs, logs, audit e privacy.

### Parte 5 — Operação

Audite Redis, hardening, SCA e restore.

### Parte 6 — Avaliação

Revise prova, score e blockers.

### Parte 7 — Design

Revise refatoração e invariantes.

### Parte 8 — Comunicação

Revise a aula ensinável.

### Parte 9 — Gaps

Registre limites atuais.

### Parte 10 — Transição

Prepare o mapa do Módulo 16.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 454 foi preservada;
- fechamento foi tratado como auditoria;
- as 45 aulas foram inventariadas;
- mapa de competências foi criado;
- níveis de competência foram definidos;
- cada competência possui evidência;
- inventário de entregáveis foi criado;
- migrations foram auditadas;
- endpoints e contracts foram auditados;
- permissions foram auditadas;
- tenancy, ownership e SoD foram auditados;
- DTOs, errors, logs e audit foram auditados;
- rate limiting foi auditado;
- supply chain foi auditada;
- hardening foi auditado;
- backup e restore foram auditados;
- projeto das três partes foi revisado;
- prova prática foi revisada;
- refatoração final foi revisada;
- aula ensinável foi revisada;
- relatório final de evidências foi criado;
- gaps foram separados por tipo;
- plano 30-60-90 foi criado;
- exercício de consolidação foi executado;
- portfólio foi preparado sem secrets;
- README foi atualizado;
- mapa da formação marcou M15 concluído;
- testes focados foram executados;
- suíte de segurança foi executada;
- SCA foi executada;
- gate final foi executado;
- manifest final foi criado;
- decisão do módulo foi registrada;
- pontos fortes e pontos a reforçar foram registrados;
- Módulo 16 não foi antecipado com implementação;
- ponte para integrações HTTP foi criada;
- `GO_CONTROLLED` foi preservado;
- `NO_GO_PUBLIC` foi preservado;
- produção pública não foi liberada;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m15/projeto-api-segura `
  docs/security `
  docs/diario-de-bordo.md `
  docs/mapa-da-formacao.md
```

Ajuste o último path ao nome real do mapa da formação.

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "docs(m15): concluir modulo de seguranca"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- tokens;
- secrets;
- NVD API key;
- backup dump;
- dados pessoais;
- reports temporários;
- `.env`;
- log SQL;
- certificados;
- arquivo de produção;
- conteúdo do Módulo 16 não iniciado.

---

## Fechamento e ponte para a próxima aula

O Módulo 15 foi concluído.

Ele começou com a pergunta:

```text
como proteger
uma aplicação Java?
```

E terminou com uma resposta muito mais completa:

```text
identificar ameaças;

validar identidades;

autorizar ações;

isolar tenants;

proteger inputs;

minimizar outputs;

auditar fatos;

limitar abuso;

proteger dependências;

testar negações;

reduzir superfície;

governar mudanças;

operar artifacts;

registrar riscos.
```

O projeto prático demonstrou:

```text
requester;

reviewer;

auditor;

tenants;

workflow;

concorrência;

rate limiting;

privacy;

hardening;

release.
```

A prova demonstrou diagnóstico.

A refatoração demonstrou design.

A aula ensinável demonstrou comunicação.

A decisão final permanece:

```text
M15_CONCLUIDO;

REFACTOR_ACCEPTED;

TEACHING_MATERIAL_ACCEPTED;

GO_CONTROLLED;

NO_GO_PUBLIC.
```

A principal conquista do módulo não é uma configuração específica.

É o modelo mental:

```text
ameaça;

controle;

evidência;

risco residual.
```

Esse modelo continuará sendo usado em:

- integrações;
- mensageria;
- eventos;
- resiliência;
- arquitetura;
- observabilidade;
- cloud;
- Kubernetes;
- performance;
- liderança técnica.

A próxima aula será:

```text
456 - M16.01 - Integracoes HTTP entre sistemas
```

Nela, você irá:

- entender por que sistemas se integram;
- diferenciar chamadas síncronas e assíncronas;
- mapear fronteiras externas;
- revisar contratos HTTP;
- modelar falhas distribuídas;
- preparar uma API provedora;
- preparar um serviço consumidor;
- iniciar o estudo de clientes HTTP em Java;
- carregar os controles de segurança do M15 para o M16.

---

# Material complementar

## Checkpoint final

- [ ] Auditei as competências do módulo.
- [ ] Liguei competências a evidências.
- [ ] Registrei gaps e plano 30-60-90.
- [ ] Executei o gate final.
- [ ] Preparei a ponte para o Módulo 16.

---

## Troubleshooting adicional

### Há arquivos faltando no inventário

Compare a grade oficial, o repositório e o diário antes de concluir.

### Um teste de segurança falhou no fechamento

O módulo técnico ainda não está concluído.

Corrija ou registre blocker.

### O scanner está indisponível

Não declare o gate completo.

Registre a indisponibilidade e mantenha o fechamento bloqueado.

### O restore não pode ser executado

Não declare recovery comprovado na data atual.

Registre gap.

### O mapa da formação usa outro nome

Use o arquivo real.

Não crie duplicata desnecessária.

### O portfólio contém dados internos

Remova ou sintetize antes de publicar.

### Uma competência parece “ensinável”, mas não possui material

Classifique como `APLICADO` até existir evidência de ensino.

### A ponte para M16 está extensa

Mantenha apenas contexto e preparação.

A implementação começa na aula 456.

---

## Perguntas de revisão

1. Quantas aulas possui o Módulo 15?
2. Qual foi o tema central?
3. O que inicia uma decisão de segurança?
4. O que liga identidade externa ao usuário local?
5. Tenant header prova acesso?
6. Role substitui permission?
7. O que protege ownership?
8. O que impede self-review?
9. O que protege input?
10. O que protege concorrência?
11. Log e audit são iguais?
12. Rate limit substitui autenticação?
13. BOM e SBOM são iguais?
14. Backup prova restore?
15. Build verde libera produção?
16. O que significa GO controlado?
17. Qual decisão permanece para produção pública?
18. Qual é o modelo mental central?
19. Qual é a próxima aula?
20. Qual é o próximo módulo?

---

## Roteiro de resposta

1. Quarenta e cinco.
2. Segurança de aplicações Java.
3. Uma ameaça ou risco.
4. Issuer + subject e provisionamento local.
5. Não.
6. Não.
7. Query tenant-scoped e owner-scoped.
8. Segregation of duties.
9. DTO allowlist, JSON estrito e validação.
10. If-Match e optimistic locking.
11. Não.
12. Não.
13. Não.
14. Não.
15. Não.
16. Uso restrito com evidências controladas.
17. NO_GO_PUBLIC.
18. Ameaça, controle, evidência e risco residual.
19. Integrações HTTP entre sistemas.
20. Integrações, mensageria, eventos e resiliência.

---

## Desafio opcional

Crie uma apresentação de dez minutos chamada:

```text
O que mudou na minha forma
de pensar segurança
depois do Módulo 15.
```

Inclua:

1. um erro de entendimento anterior;
2. uma ameaça;
3. um controle;
4. um teste negativo;
5. um gap;
6. um próximo passo.

Não transforme a apresentação em uma lista de tecnologias.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 455 - M15.45 - Fechamento do Modulo 15

- Concluí formalmente o Módulo 15 de Segurança de aplicações Java.
- Auditei as 45 aulas do módulo.
- Criei `M15_MAPA_DE_COMPETENCIAS.md`.
- Classifiquei competências como INICIADO, PRATICADO, APLICADO ou ENSINAVEL.
- Liguei competências a evidências.
- Criei `M15_INVENTARIO_DE_ENTREGAVEIS.md`.
- Auditei requirements, threat models e matrizes.
- Auditei migrations.
- Auditei endpoints e contracts.
- Auditei permissions, tenancy, ownership e segregation of duties.
- Auditei DTOs, errors, logs e auditoria.
- Auditei rate limiting.
- Auditei supply chain.
- Auditei hardening.
- Auditei backup e restore.
- Revisei as três partes do projeto prático.
- Revisei a prova prática.
- Revisei a refatoração final.
- Revisei a aula ensinável.
- Criei `M15_RELATORIO_FINAL_DE_EVIDENCIAS.md`.
- Criei `M15_GAPS_E_PROXIMOS_PASSOS.md`.
- Separei gaps de aprendizagem, laboratório, produção e operação.
- Criei `M15_PLANO_DE_REVISAO_30_60_90.md`.
- Criei exercício de consolidação.
- Preparei artefatos de portfólio sem secrets.
- Atualizei o README do projeto.
- Atualizei o mapa da formação.
- Executei testes focados.
- Executei a suíte de segurança.
- Executei SCA.
- Executei o gate final.
- Registrei o manifest final.
- Registrei pontos fortes.
- Registrei pontos a reforçar.
- Mantive `REFACTOR_ACCEPTED`.
- Mantive `TEACHING_MATERIAL_ACCEPTED`.
- Mantive `GO_CONTROLLED`.
- Mantive `NO_GO_PUBLIC`.
- Marquei o Módulo 15 como concluído.
- Próxima aula: Integracoes HTTP entre sistemas.
```

---

## Referência técnica curta

- `411_M15_01_FUNDAMENTOS_SEGURANCA_WEB_OFICIAL.md`
- `412_M15_02_THREAT_MODELING_INICIAL_OFICIAL.md`
- `418_M15_08_SPRING_SECURITY_ARQUITETURA_OFICIAL.md`
- `422_M15_12_JWT_CONCEITOS_HEADER_PAYLOAD_SIGNATURE_OFICIAL.md`
- `432_M15_22_OAUTH2_FUNDAMENTOS_OFICIAL.md`
- `437_M15_27_MULTI_TENANCY_SEGURANCA_OFICIAL.md`
- `443_M15_33_TESTES_DE_SEGURANCA_OFICIAL.md`
- `447_M15_37_PROJETO_API_SEGURA_PARTE_1_OFICIAL.md`
- `452_M15_42_PROVA_PRATICA_SEGURANCA_OFICIAL.md`
- `454_M15_44_AULA_ENSINAVEL_SEGURANCA_OFICIAL.md`

Regra final:

```text
o fechamento do Módulo 15 deve comprovar evolução real: competências são ligadas a artefatos, testes e decisões; gaps permanecem visíveis; laboratório e produção são distinguidos; o projeto, a prova, a refatoração e a aula ensinável demonstram execução, diagnóstico, design e comunicação; o gate final preserva as garantias; e o modelo ameaça, controle, evidência e risco residual passa a acompanhar a formação na transição para integrações, mensageria, eventos e resiliência.
```
