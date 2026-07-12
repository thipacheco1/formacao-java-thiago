# 451 - M15.41 - Revisao seguranca parte 2

## Apresentação da aula

Na aula 450, reconstruímos o caminho principal de uma request protegida:

```text
protocolo;

hardening;

SecurityFilterChain;

validação do token;

Authentication;

identidade local;

TenantContext;

permission;

query scoped;

regra de negócio;

auditoria;

response.
```

A primeira parte da revisão concentrou-se em:

- fundamentos de segurança;
- threat modeling;
- CORS;
- CSRF;
- headers;
- password hashing;
- Spring Security;
- JWT;
- refresh token;
- roles e permissions;
- Method Security;
- OAuth 2.0;
- OpenID Connect;
- PKCE;
- Keycloak;
- identidade local;
- multi-tenancy;
- ownership;
- contratos de `401`, `403` e `404`;
- auditoria e secrets.

Agora precisamos revisar os controles que protegem o ciclo completo dos dados e da entrega.

A pergunta central desta aula será:

```text
como demonstrar que uma API
continua segura depois que
a identidade já foi validada,
considerando input hostil,
abuso, privacidade, logs,
dependências, configuração,
testes e decisão de release?
```

Esta segunda parte cobrirá:

```text
LGPD e privacy engineering;

rate limiting;

mass assignment;

DTOs;

Problem Details;

logs e MDC;

auditoria segura;

vulnerabilidades em dependências;

SBOM;

SCA;

testes de segurança;

testes de autorização;

hardening;

checklist de PR;

backup e restore;

evidence manifest;

GO/NO-GO.
```

A revisão continuará usando a API de solicitações de acesso.

Os endpoints principais são:

```text
POST /api/v1/access-requests;

GET /api/v1/access-requests/{id};

GET /api/v1/access-requests;

GET /api/v1/access-requests/review-queue;

POST /api/v1/access-requests/{id}/decision;

GET /api/v1/access-requests/{id}/audit.
```

O domínio possui dados que exigem cuidado:

```text
issuer;

subject;

displayName;

tenant;

justification;

decisionReason;

status;

audit;

tokens transitórios.
```

Para cada tema, a revisão perguntará:

1. qual dado ou recurso está em risco;
2. qual abuso precisa ser impedido;
3. qual controle é aplicado;
4. qual failure mode foi escolhido;
5. qual teste comprova;
6. qual evidência acompanha o release;
7. qual gap ainda bloqueia produção pública.

A aula também criará um documento consolidado:

```text
docs/security/
└── M15_REVISAO_SEGURANCA_PARTE_2.md
```

Esse documento terá:

- mapa dos dados;
- matriz de input;
- matriz de rate limits;
- política de logs;
- checklist de supply chain;
- estratégia de testes;
- baseline de hardening;
- fluxo de PR;
- checklist de release;
- diagnóstico por sintoma.

A prova prática da próxima aula não pedirá apenas definições.

Ela exigirá que você:

- leia uma mudança;
- identifique ameaças;
- encontre controles ausentes;
- corrija código ou configuração;
- escreva testes negativos;
- justifique status HTTP;
- registre evidências;
- tome uma decisão de risco.

A próxima aula será:

```text
452 - M15.42 - Prova pratica seguranca
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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
Checklist final seguranca.
```

A revisão parte 1 respondeu:

```text
como autenticar,
identificar,
autorizar
e isolar tenants?
```

A revisão parte 2 responderá:

```text
como proteger dados,
entrada, operação,
supply chain
e release?
```

Nesta aula:

```text
LGPD:
revisada.

rate limiting:
revisado.

mass assignment:
revisado.

DTOs e logs:
revisados.

SBOM e SCA:
revisados.

testes:
revisados.

hardening:
revisado.

PR:
revisado.

release:
revisada.

prova:
próxima aula.
```

A regra central será:

```text
uma API segura
precisa continuar segura
quando recebe input hostil,
opera sob abuso,
gera observabilidade,
usa dependências
e é preparada para release.
```

---

## Objetivo prático

Ao final da aula, você terá revisado o fluxo:

```text
request;

limites;

parsing;

DTO;

validation;

command;

domain;

repository;

response;

log;

audit;

metrics;

dependencies;

build;

release.
```

Você criará:

```text
docs/security/
└── M15_REVISAO_SEGURANCA_PARTE_2.md
```

Testes de revisão:

```text
PrivacyBoundaryReviewTest;

RateLimitFailureModeReviewTest;

MassAssignmentReviewTest;

SensitiveOutputReviewTest;

SupplyChainReviewPolicyTest;

HardeningReviewIntegrationTest;

ReleaseDecisionReviewPolicyTest.
```

Você irá:

1. revisar classificação de dados;
2. revisar privacy inventory;
3. revisar retenção;
4. revisar direitos dos titulares;
5. revisar rate limiting;
6. revisar fail-open e fail-closed;
7. revisar mass assignment;
8. revisar DTOs;
9. revisar Problem Details;
10. revisar logs e MDC;
11. revisar métricas;
12. revisar SBOM;
13. revisar SCA;
14. revisar suppressions;
15. revisar testes de segurança;
16. revisar hardening;
17. revisar checklist de PR;
18. revisar backup e restore;
19. revisar GO/NO-GO;
20. preparar a prova prática.

---

## Conceito essencial

### Privacidade começa no inventário

Antes de proteger dados, precisamos saber:

- quais dados existem;
- de quem são;
- para qual finalidade;
- em qual sistema ficam;
- quem recebe;
- por quanto tempo;
- quem é o owner;
- quais controles existem.

Sem inventário, exclusão, acesso e retenção tornam-se tentativas incompletas.

---

### Classificação de dados

As classes utilizadas foram:

```text
PUBLIC;

INTERNAL;

PERSONAL;

SENSITIVE;

SECRET.
```

Exemplos:

```text
status público:
PUBLIC ou INTERNAL
conforme o contrato.

tenantId:
INTERNAL.

subject:
PERSONAL.

justification:
PERSONAL.

decisionReason:
PERSONAL ou INTERNAL.

password:
SECRET.

access token:
SECRET.

HMAC key:
SECRET.
```

A classificação orienta:

- DTO;
- log;
- audit;
- retenção;
- cache;
- export;
- acesso;
- backup;
- resposta.

---

### Dado pessoal não é apenas nome

Podem ser dados pessoais:

- UUID ligado a uma pessoa;
- subject;
- username;
- e-mail;
- IP;
- endereço;
- identificador persistente;
- histórico de ações;
- justification.

Pseudonimização reduz exposição.

Ela não transforma automaticamente o dado em anônimo.

---

### Privacy engineering

Privacy engineering traduz princípios em decisões técnicas:

```text
finalidade:
campo só existe por motivo definido.

necessidade:
coletar o mínimo.

adequação:
uso compatível.

segurança:
controle de acesso e proteção.

prevenção:
testes e threat model.

transparência:
contracts e processos.

responsabilização:
audit e evidência.
```

A aplicação não escolhe base legal ou prazo legal sozinha.

Essas decisões exigem owner e revisão apropriada.

---

### Direitos dos titulares

O projeto modelou requests como:

```text
ACCESS;

CORRECTION;

ANONYMIZATION_REVIEW;

BLOCKING_REVIEW;

DELETION_REVIEW;

PORTABILITY_REVIEW;

CONSENT_REVOCATION_REVIEW.
```

O backend precisa tratar cada pedido como workflow.

Ele não deve executar deleção automática apenas porque recebeu um request.

---

### Autenticação recente

Operações sensíveis como export podem exigir autenticação recente.

Isso reduz risco de:

- sessão abandonada;
- token antigo;
- browser desbloqueado;
- acesso após mudança de contexto.

A policy precisa usar tempo controlado e teste.

---

### Retenção

Retenção precisa de:

- status;
- owner;
- finalidade;
- prazo aprovado;
- ação;
- blockers;
- audit;
- data de revisão.

Status revisados:

```text
APPROVED;

LEGAL_REVIEW_REQUIRED.
```

Scheduler processa apenas policies aprovadas.

---

### Backup e privacidade

Excluir do banco principal não remove automaticamente:

- backup;
- réplica;
- cache;
- search index;
- data lake;
- logs.

Runbook precisa considerar lifecycle de backup e replay de dados.

---

### Rate limiting

Rate limiting limita frequência de ações.

Ele não substitui:

- autenticação;
- autorização;
- lockout;
- WAF;
- capacidade;
- validação;
- monitoring.

O objetivo depende do endpoint.

Exemplos:

```text
login:
reduzir credential attacks.

refresh:
reduzir abuso de tokens.

privacy export:
reduzir extração repetida.

review:
reduzir automação indevida.
```

---

### Dimensões do limite

Uma única dimensão raramente basta.

Dimensões utilizadas:

```text
network;

identidade declarada;

fingerprint do refresh token;

user + tenant;

reviewer + tenant.
```

O valor raw não entra na key.

Keys usam HMAC.

---

### Rede e proxy

`X-Forwarded-For` só é confiável quando:

- há proxy conhecido;
- client não fala diretamente com a aplicação;
- headers externos são removidos;
- ranges são restritos;
- testes de spoofing existem.

Sem isso:

```text
request.getRemoteAddr().
```

---

### Fail-open e fail-closed

Fail-open:

```text
o controle falha,
a operação continua.
```

Fail-closed:

```text
o controle falha,
a operação é negada.
```

A escolha depende do risco.

Exemplos:

```text
limiter operacional genérico:
pode ser fail-open.

login, refresh,
privacy export e review:
fail-closed.
```

Falha do Redis nesses endpoints retorna:

```text
503 security_rate_limiter_unavailable.
```

---

### 429 e 503

`429 Too Many Requests`:

```text
limite conhecido excedido.
```

`503 Service Unavailable`:

```text
a decisão de segurança
não pôde ser executada.
```

`Retry-After` orienta o client.

Não exponha counters internos ou keys.

---

### Mass assignment

Mass assignment ocorre quando input controlado é ligado a propriedades além das permitidas.

Exemplo malicioso:

```json
{
  "targetApplication": "finance",
  "requestedAccessLevel": "STANDARD",
  "justification": "Necessidade operacional válida.",
  "tenantId": "outro-tenant",
  "requesterUserId": "outro-usuario",
  "status": "APPROVED",
  "version": 999
}
```

O risco aumenta quando:

- controller recebe entity;
- DTO contém campos internos;
- mapper usa reflexão;
- PATCH aceita `Map<String,Object>`;
- unknown fields são ignorados;
- setters públicos existem.

---

### Allowlist de input

A defesa principal é:

```text
DTO específico por caso de uso.
```

Create DTO contém somente:

```text
targetApplication;

requestedAccessLevel;

justification.
```

Decision DTO contém somente:

```text
decision;

reason.
```

Tenant, owner, status, version e timestamps vêm de outras fontes.

---

### JSON estrito

A baseline rejeita:

- propriedade desconhecida;
- propriedade duplicada;
- trailing tokens;
- case variants indevidas;
- tipo incompatível.

Contrato:

```text
400 unknown_request_property;

400 invalid_request_payload.
```

Não devolva o body ou rejected value.

---

### Entidade não é DTO

Entity possui responsabilidades de:

- persistência;
- identidade;
- invariantes;
- version;
- lifecycle.

Request DTO possui responsabilidade de:

- representar input permitido;
- validar formato;
- ser descartado após o uso.

Response DTO é uma allowlist de saída.

Misturar esses papéis aumenta vazamento e acoplamento.

---

### Request, Command, Result e Response

Fluxo revisado:

```text
Request:
input externo.

Command:
intenção interna.

Result:
resultado do caso de uso.

Response:
contrato público.
```

Cada objeto existe para uma fronteira.

Principal, entity e audit event não devem ser serializados automaticamente.

---

### Records e toString

Records geram `toString()` com todos os componentes.

Isso é conveniente para dados públicos.

É perigoso para:

- password;
- token;
- code;
- nonce;
- verifier;
- cookie;
- secret.

Objetos sensíveis precisam de representação redigida ou ausência de `toString` detalhado.

---

### JsonProperty WRITE_ONLY

`WRITE_ONLY` impede serialização Jackson.

Ele não impede:

- log;
- debugger;
- heap dump;
- exception;
- mapper;
- `toString`;
- audit.

É defesa complementar.

Não é política completa.

---

### Problem Details

Problem Details seguro contém:

- type;
- title;
- status;
- detail genérico;
- instance;
- code;
- correlation ID;
- extensões catalogadas.

Não contém:

- stack trace;
- exception message raw;
- SQL;
- constraint;
- host interno;
- body;
- token;
- secret;
- resource oculto.

---

### Logs

Log técnico deve responder:

```text
o que aconteceu?

qual outcome?

qual correlation?

qual route template?

quanto tempo?

qual reason code?
```

Não deve responder:

```text
qual password?

qual token?

qual body?

qual justification?

qual e-mail?

qual tenant raw?
```

---

### Audit

Audit responde por accountability.

Campos típicos:

```text
actor;

tenant;

action;

target;

outcome;

reason code;

before;

after;

correlation.
```

Audit não é cópia do log.

Audit não é cópia do payload.

---

### MDC

MDC mínimo:

```text
correlation_id;

trace_id;

span_id.
```

Evite:

- username;
- e-mail;
- user ID;
- tenant ID;
- token;
- session ID;
- IP;
- body.

O MDC precisa ser limpo entre requests e tarefas assíncronas.

---

### Log injection

Input com:

```text
\r;

\n;

caracteres de controle.
```

pode criar linhas falsas ou quebrar JSON.

Logs estruturados e sanitização reduzem o risco.

Nunca concatene input raw em mensagem livre.

---

### Métricas

Labels precisam de baixa cardinalidade.

Permitido:

```text
route template;

method;

outcome;

reason code;

policy.
```

Proibido:

```text
user ID;

tenant ID;

correlation ID;

URL completa;

exception message;

token;

IP.
```

---

### Dependência direta e transitiva

Dependência direta aparece no `pom.xml`.

Transitiva é introduzida por outra dependência.

O produto real contém ambas.

Comando:

```powershell
.\mvnw.cmd dependency:tree
```

O finding precisa identificar o caminho introdutor.

---

### BOM e SBOM

Dependency BOM:

```text
gerencia versões.
```

SBOM:

```text
inventa os componentes
do artifact.
```

Uma não substitui a outra.

A SBOM precisa pertencer ao mesmo build do JAR.

---

### CVE, CVSS, KEV e EPSS

CVE:

```text
identificador de vulnerabilidade.
```

CVSS:

```text
severidade técnica.
```

KEV:

```text
evidência de exploração conhecida.
```

EPSS:

```text
estimativa de probabilidade
de exploração em trinta dias.
```

Risco final depende ainda de:

- reachability;
- exposure;
- impacto;
- ativo;
- controles;
- contexto.

---

### Suppression

Suppression não é correção.

Ela precisa de:

- component preciso;
- CVE ou matcher preciso;
- reason;
- owner;
- ticket;
- evidence;
- expiration;
- risk register.

Rules genéricas ou sem prazo falham no build.

---

### Testes de segurança

Camadas revisadas:

```text
unit;

web;

integration;

policy;

contract;

external;

supply chain.
```

Cada camada possui uma finalidade.

Mocks não substituem PostgreSQL, Redis ou fluxo criptográfico em todos os cenários.

---

### Asserção negativa

Teste de segurança precisa verificar:

```text
rejeição;

contrato seguro;

ausência de side effects;

ausência de vazamento.
```

Apenas verificar status não basta.

---

### Testes de autorização

A matriz combina:

```text
actor;

role;

permission;

tenant;

ownership;

action;

resource;

state;

resultado.
```

Ela cobre escalada vertical, horizontal, cross-tenant, deny-by-default e chamada direta ao service.

---

### Hardening

Hardening revisado:

- methods allowlist;
- JSON only;
- body limit real;
- header limit;
- parameter limit;
- pagination limit;
- sort allowlist;
- timeout;
- queue;
- keep-alive;
- forwarded headers off;
- Actuator privado;
- errors genéricos;
- API stateless;
- graceful shutdown.

---

### Checklist de PR

O checklist usa níveis:

```text
LOW;

MEDIUM;

HIGH;

CRITICAL.
```

Mudanças críticas exigem:

- threat model;
- negative tests;
- owner review;
- deployment plan;
- monitoring;
- rollback;
- full security gate.

---

### Exceções

Exceção temporária precisa de:

- ID;
- controle;
- risco;
- razão;
- compensações;
- owner;
- approver;
- ticket;
- expiração;
- remediation.

Alguns controles são não excepcionáveis no PR comum, como secret real no Git ou bypass de tenant.

---

### Backup e restore

Backup só é evidência quando restore foi testado.

Valide:

- checksum;
- schema;
- migrations;
- counts;
- constraints;
- relações;
- dados sintéticos;
- banco separado.

RPO e RTO do laboratório são propostas, não SLAs comprovados.

---

### Evidence manifest

Manifest liga:

```text
commit;

build;

JAR;

hash;

SBOM;

SCA;

tests;

migration;

profiles.
```

Se o commit muda, as evidências precisam ser regeneradas.

---

### GO e NO-GO

A decisão precisa refletir o ambiente.

No projeto:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

Gaps bloqueantes impedem `GO_PUBLIC`.

Registrar um NO-GO é uma entrega profissional.

---

## Mão na massa guiada

### 1. Criar o documento de revisão

Arquivo:

```text
docs/security/M15_REVISAO_SEGURANCA_PARTE_2.md
```

Estrutura:

```markdown
# Revisao de seguranca parte 2

## Dados e privacidade

## Input e mass assignment

## Rate limiting

## DTOs, errors e logs

## Supply chain

## Test strategy

## Hardening

## PR e release

## Diagnostico

## Evidencias
```

---

### 2. Criar mapa de dados

Registre para cada campo:

- classe;
- source;
- finalidade;
- response;
- log;
- audit;
- cache;
- retenção;
- owner.

Exemplo:

| Campo | Classe | Response | Log | Audit |
|---|---|---:|---:|---:|
| justification | PERSONAL | requester/reviewer | não | não |
| decisionReason | PERSONAL/INTERNAL | autorizado | não | não |
| status | INTERNAL | sim | reason fechado | before/after |
| token | SECRET | não | não | não |

---

### 3. Revisar requests de privacidade

Cenários:

- access próprio;
- correction de campo permitido;
- tentativa de alterar issuer;
- export de outro tenant;
- autenticação não recente;
- retenção bloqueante;
- terceiro no mesmo recurso;
- audit do request.

O workflow precisa evitar deleção automática indevida.

---

### 4. Revisar retention

Inspecione:

```text
status da policy;

owner;

age;

batch;

dry-run;

tenant predicate;

audit;

backup lifecycle.
```

Teste que `LEGAL_REVIEW_REQUIRED` não executa mutação.

---

### 5. Revisar rate limit

Para cada policy, documente:

- operação;
- dimensão;
- janela;
- limite;
- failure mode;
- status;
- header;
- key privacy;
- teste.

Exemplo:

| Policy | Dimensão | Falha Redis |
|---|---|---|
| login | network + account | `503` |
| refresh | network + fingerprint | `503` |
| review | reviewer + tenant | `503` |
| generic read | client ID técnico | fail-open aprovado |

---

### 6. Testar spoofing de rede

Envie:

```text
X-Forwarded-For;

Forwarded;

X-Real-IP.
```

Sem proxy confiável, a dimensão continua usando remote address.

---

### 7. Revisar mass assignment

Crie payloads com:

```text
tenantId;

ownerUserId;

requesterUserId;

status;

version;

createdAt;

reviewerUserId;

authorities;

nested permissions.
```

Cada request deve falhar antes da persistência.

---

### 8. Revisar JSON estrito

Cenários:

- unknown field;
- duplicate field;
- trailing object;
- case variant;
- wrong type;
- malformed array;
- número fora da faixa;
- charset incompatível.

Valide `400` e ausência de body refletido.

---

### 9. Revisar DTO boundaries

Procure:

```text
@RequestBody Entity;

ResponseEntity<Entity>;

BeanUtils.copyProperties;

Map<String,Object> patch;

@JsonAnySetter;

ignoreUnknown = true.
```

Crie policy test para padrões proibidos.

---

### 10. Revisar Problem Details

Para cada error:

- status;
- code;
- title;
- detail;
- no-store;
- correlation;
- fields seguros;
- nenhuma stack.

Teste também exception inesperada.

---

### 11. Revisar logs com sentinelas

Use valores sintéticos:

```text
password-secret-sentinel;

token-secret-sentinel;

justification-secret-sentinel;

reason-secret-sentinel;

email-secret-sentinel;

crlf-sentinel.
```

Execute fluxos de sucesso e erro.

Nenhuma sentinela pode aparecer.

---

### 12. Revisar MDC

Teste sequência:

1. request A com correlation A;
2. request B com correlation B;
3. tarefa assíncrona;
4. exception;
5. thread reutilizada.

Correlation A não pode aparecer em B.

---

### 13. Revisar métricas

Liste labels reais.

Falhe se encontrar:

- UUID;
- e-mail;
- tenant;
- correlation;
- URL com ID;
- exception message.

Use route template.

---

### 14. Revisar dependency tree

```powershell
.\mvnw.cmd `
  dependency:tree
```

Para finding específico:

```powershell
.\mvnw.cmd `
  dependency:tree `
  "-Dincludes=group:artifact"
```

Registre direct ou transitive.

---

### 15. Revisar SBOM

Valide:

- JSON e XML;
- PURLs;
- runtime scope;
- test scope excluído conforme policy;
- component principal;
- commit;
- artifact hash;
- ausência de secrets.

---

### 16. Revisar Dependency-Check

Confirme:

```text
versão fixa;

profile security-sca;

failOnError true;

threshold;

KEV enabled;

NVD key por environment;

suppression file;

unused suppression failure.
```

---

### 17. Triar finding sintético

Perguntas:

1. artifact existe;
2. versão é afetada;
3. path introdutor;
4. runtime ou test;
5. advisory oficial;
6. KEV;
7. EPSS;
8. reachability;
9. exposição;
10. decisão.

Não crie suppression antes de responder.

---

### 18. Revisar testes por camada

Monte tabela:

| Requirement | Unit | Web | Integration | Policy | External |
|---|---:|---:|---:|---:|---:|
| audience | sim | sim | sim | - | smoke |
| tenant | sim | web | PostgreSQL | policy | - |
| rate limit | unit | web | Redis | config | - |
| logging | unit | integration | capture | policy | - |
| SCA | - | - | gate | policy | external feed |

---

### 19. Revisar side effects

Para cada denial, pergunte:

- repository foi chamado;
- entity mudou;
- audit success foi criado;
- token foi rotacionado;
- cache foi invalidado;
- event foi publicado;
- e-mail foi enviado.

Crie assertions explícitas.

---

### 20. Revisar hardening

Execute:

- TRACE;
- CONNECT;
- XML;
- Accept XML;
- body grande;
- header grande;
- parâmetros excessivos;
- page size grande;
- sort proibido;
- forwarded spoofing;
- Actuator público;
- session cookie na API.

Documente o status esperado.

---

### 21. Revisar profile de release

Confirme:

- inclui hardening;
- secrets externos;
- Flyway validate;
- clean disabled;
- OSIV off;
- management loopback;
- no wildcard exposure;
- no whitelabel;
- no stack;
- no `start-dev`;
- no `latest`.

---

### 22. Revisar checklist de PR

Pegue um diff sintético que altera:

```text
SecurityFilterChain;

migration;

pom.xml;

logger;

DTO;

application-release.yaml.
```

Classificação final:

```text
CRITICAL.
```

Liste owners e evidências exigidas.

---

### 23. Revisar exception register

Teste:

- exception válida;
- expirada;
- owner ausente;
- control não excepcionável;
- compensating control vazio;
- ticket ausente;
- `GO_PUBLIC` bloqueado.

---

### 24. Revisar backup e restore

Execute em ambiente local:

```powershell
.\scripts\backup-postgresql.ps1

.\scripts\restore-postgresql.ps1 `
  -TargetDatabase secure_access_restore
```

Compare:

- counts;
- constraints;
- migrations;
- audit;
- tenants;
- requests;
- decisions.

---

### 25. Revisar evidence manifest

Confirme:

- commit final;
- build ID;
- JAR hash;
- SBOM hash;
- SCA hash;
- test reports;
- migration;
- profiles;
- ausência de paths locais;
- ausência de secrets.

---

### 26. Revisar gaps

Cada gap precisa de:

- severity;
- owner;
- status;
- due date;
- blocker;
- compensating controls.

Gap aberto pode permitir `GO_CONTROLLED`, mas bloquear `GO_PUBLIC`.

---

### 27. Criar PrivacyBoundaryReviewTest

Cenários:

- export próprio;
- export cross-tenant;
- autenticação recente;
- dados de terceiro;
- retention pending;
- response no-store;
- audit sem payload.

---

### 28. Criar RateLimitFailureModeReviewTest

Cenários:

- limite atingido;
- TTL expirado;
- Redis indisponível;
- key HMAC;
- network spoofing;
- repository não chamado;
- `429`;
- `503`.

---

### 29. Criar MassAssignmentReviewTest

Use create e decision payloads maliciosos.

Valide:

- `400`;
- code;
- entity unchanged;
- audit success absent;
- logs sem valores.

---

### 30. Criar SensitiveOutputReviewTest

Capture:

- responses;
- logs;
- audit;
- metrics;
- exceptions.

Valide ausência de:

- password;
- token;
- subject;
- e-mail;
- justification;
- reason;
- SQL.

---

### 31. Criar SupplyChainReviewPolicyTest

Valide:

- dependency plugin;
- CycloneDX;
- Dependency-Check;
- versions fixas;
- no `LATEST`;
- no HTTP repository;
- suppression expiry;
- risk register;
- SBOM build binding.

---

### 32. Criar HardeningReviewIntegrationTest

Execute os cenários da aula 445 contra profile release.

Valide side effects e saúde do processo.

---

### 33. Criar ReleaseDecisionReviewPolicyTest

Cenários:

```text
GO_PUBLIC com gap bloqueante:
falha.

GO_CONTROLLED sem dados sintéticos:
falha.

NO_GO_PUBLIC ausente:
falha.

manifest de commit antigo:
falha.

GO_CONTROLLED válido:
passa.
```

---

### 34. Criar diagnóstico 1

Sintoma:

```text
payload com status
é aceito,
mas não altera o banco.
```

Ainda existe problema?

```text
sim.
```

O contrato aceitou campo não permitido.

Ele pode criar incompatibilidade, confusão ou bypass futuro.

Unknown field precisa falhar.

---

### 35. Criar diagnóstico 2

Sintoma:

```text
Redis está fora
e login continua.
```

Perguntas:

- qual policy;
- fail-open ou fail-closed;
- implementação correta;
- fallback;
- status;
- log;
- métrica;
- side effects.

Para login protegido:

```text
503.
```

---

### 36. Criar diagnóstico 3

Sintoma:

```text
scan sem CVE,
mas component está no KEV.
```

Verifique:

- atualização do feed;
- mapping;
- versão;
- advisory;
- scanner;
- finding manual;
- release blocker.

Ausência no report não elimina evidência externa.

---

### 37. Criar diagnóstico 4

Sintoma:

```text
backup terminou com sucesso,
mas restore nunca foi feito.
```

Status do controle:

```text
não comprovado.
```

A decisão de release registra gap.

---

### 38. Criar diagnóstico 5

Sintoma:

```text
todos os tests passaram,
mas report pertence
ao commit anterior.
```

Evidência inválida.

Reexecute no commit final.

---

### 39. Atualizar o mapa de evidências

| Controle | Evidência |
|---|---|
| privacy inventory | inventory policy test |
| retention | pending policy test |
| rate limit | Redis integration |
| mass assignment | malicious payload test |
| logging | sentinel test |
| SBOM | artifact hash |
| SCA | JSON/SARIF report |
| hardening | release integration |
| backup | restore report |
| GO/NO-GO | decision policy |

---

### 40. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=PrivacyBoundaryReviewTest,RateLimitFailureModeReviewTest,MassAssignmentReviewTest,SensitiveOutputReviewTest,SupplyChainReviewPolicyTest,HardeningReviewIntegrationTest,ReleaseDecisionReviewPolicyTest `
  test
```

---

### 41. Executar security suite

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

Confirme que nenhuma tag importante foi excluída.

---

### 42. Executar SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Se feed ou scanner falhar:

```text
gate falha.
```

---

### 43. Executar backup e restore

Use apenas dados sintéticos.

Registre:

- data;
- duração;
- checksum;
- target;
- counts;
- resultado.

---

### 44. Executar gate completo

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Confirme:

- privacy;
- retention;
- rate limiting;
- mass assignment;
- DTOs;
- logs;
- audit;
- metrics;
- SBOM;
- SCA;
- authorization;
- hardening;
- PR policies;
- backup;
- release;
- nenhum teste desabilitado.

---

### 45. Preparar resposta oral

Explique em até cinco minutos:

```text
como um input hostil
é limitado, parseado,
validado, mapeado,
persistido, respondido,
logado e auditado;

como dependências
e release são avaliadas;

por que a decisão final
continua NO_GO_PUBLIC.
```

---

## Entendendo o que foi feito

### Dados foram ligados ao lifecycle

Classificação, finalidade, acesso, retenção, backup e audit passaram a formar um único fluxo.

### Rate limiting foi ligado ao risco

A dimensão e o failure mode dependem da operação, não de uma regra universal.

### Input foi tratado por allowlist

DTOs, JSON estrito e mappers explícitos impedem que campos internos atravessem a fronteira.

### Observabilidade foi separada de exposição

Logs, audit e métricas possuem finalidades e campos diferentes.

### Supply chain foi ligada ao artifact

Tree, SBOM, SCA e findings pertencem ao build real.

### Testes passaram a verificar ausência

Rejeição, side effects e vazamentos são comprovados.

### Hardening chegou ao release

Configuração, limites e management não dependem de defaults locais.

### GO/NO-GO tornou o risco explícito

Build verde não substitui gaps, restore, operação e aprovações.

---

## Erros comuns importantes

### Tratar LGPD como tela de consentimento

Privacidade envolve todo o lifecycle dos dados.

### Aplicar o mesmo rate limit em tudo

Operações possuem riscos, custos e dimensões diferentes.

### Aceitar unknown field porque ele é ignorado

O contrato perde sua allowlist.

### Confiar em WRITE_ONLY como proteção total

Logs e `toString` continuam possíveis.

### Logar objeto para depurar

DTO ou entity pode conter dado pessoal ou secret.

### Tratar CVSS como decisão final

Reachability, KEV e contexto importam.

### Suprimir finding sem prazo

A exceção torna-se permanente.

### Usar mocks para todas as integrações

PostgreSQL, Redis e concorrência ficam sem prova.

### Achar que hardening é configuração de infraestrutura

Parte do hardening está no código, parser e contrato.

### Chamar backup de recovery

Sem restore, recovery não foi comprovado.

---

## Comandos úteis

### Testes da revisão

```powershell
.\mvnw.cmd `
  -Dtest=PrivacyBoundaryReviewTest,RateLimitFailureModeReviewTest,MassAssignmentReviewTest,SensitiveOutputReviewTest,SupplyChainReviewPolicyTest,HardeningReviewIntegrationTest,ReleaseDecisionReviewPolicyTest `
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

### Gate completo

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

### Procurar padrões inseguros

```powershell
git grep `
  -n `
  -E `
  "copyProperties|JsonAnySetter|ignoreUnknown *= *true|log\\..*(token|password|justification|reason)|LATEST|RELEASE"
```

---

## Exercício guiado

### Parte 1 — Dados

Classifique e mapeie o lifecycle.

### Parte 2 — Privacy

Revise requests, retenção e backups.

### Parte 3 — Abuso

Revise rate limits e failure modes.

### Parte 4 — Input

Teste mass assignment e JSON estrito.

### Parte 5 — Output

Revise DTOs, errors, logs, audit e métricas.

### Parte 6 — Supply chain

Revise tree, SBOM, SCA e findings.

### Parte 7 — Testes

Valide side effects e evidências.

### Parte 8 — Hardening

Execute cenários hostis no profile release.

### Parte 9 — Operação

Teste backup, restore e runbooks.

### Parte 10 — Decisão

Justifique GO controlado e NO-GO público.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 450 foi preservada;
- escopo da revisão parte 2 foi delimitado;
- classificação, inventário e lifecycle de dados foram revisados;
- dado pessoal, sensível, interno e secret foram diferenciados;
- direitos dos titulares foram tratados como workflow;
- autenticação recente foi revisada;
- retenção exige status e owner;
- policy pendente não executa deleção;
- backup lifecycle foi considerado;
- rate limiting foi diferenciado de autenticação e capacidade;
- dimensões e HMAC foram revisadas;
- proxy não confiável foi revisado;
- fail-open e fail-closed foram justificados;
- `429` e `503` foram diferenciados;
- mass assignment e allowlist foram revisados;
- JSON estrito foi revisado;
- entity, request, command, result e response foram diferenciados;
- `WRITE_ONLY` e `toString` foram tratados como riscos complementares;
- Problem Details seguro foi revisado;
- logs, audit, MDC e métricas foram diferenciados;
- log injection e cardinalidade foram revisados;
- dependências diretas e transitivas foram revisadas;
- BOM e SBOM foram diferenciadas;
- CVE, CVSS, KEV e EPSS foram revisados;
- suppressions e risk register foram revisados;
- testes por camada e asserções negativas foram revisados;
- matriz de autorização foi conectada à estratégia;
- hardening e profile release foram revisados;
- checklist de PR e exception register foram revisados;
- backup e restore foram executados como evidência;
- evidence manifest e GO/NO-GO foram revisados;
- documento de revisão e mapa de evidências foram criados;
- testes focados, SCA, regressão e gate foram executados;
- conteúdo da prova prática não foi antecipado como resposta pronta;
- produção pública permaneceu NO-GO;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m15/projeto-api-segura/docs/security `
  labs/m15/projeto-api-segura/src/test `
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
git commit -m "test(m15): revisar dados supply chain e release"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- tokens;
- passwords;
- NVD API key;
- backup dump;
- e-mail real;
- justification real;
- decision reason real;
- log com sentinela;
- report de outro commit;
- suppression sem expiração.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a segunda metade do Módulo 15 foi reconstruída como um fluxo de proteção contínua.

O input passa por:

```text
limites;

rate limiting;

media type;

JSON estrito;

request DTO;

validation;

command;

domain.
```

O dado passa por:

```text
classificação;

finalidade;

acesso;

response allowlist;

log seguro;

audit mínimo;

retenção;

backup;

restore.
```

O artifact passa por:

```text
dependency tree;

SBOM;

SCA;

tests;

hardening;

PR review;

evidence manifest;

GO/NO-GO.
```

A revisão confirmou:

```text
privacidade não termina
na coleta;

rate limiting não substitui
autenticação;

unknown field
não deve ser ignorado;

WRITE_ONLY
não impede log;

audit
não é payload;

CVSS
não é risco completo;

backup
não prova restore;

build verde
não libera produção.
```

A decisão central foi:

```text
segurança precisa acompanhar
o dado e o artifact
desde a entrada
até a retenção,
desde o código
até a decisão de release.
```

A próxima aula será:

```text
452 - M15.42 - Prova pratica seguranca
```

Nela, você receberá um cenário com falhas de identidade, autorização, input, logs, dependências, hardening e release.

Você deverá:

- identificar riscos;
- priorizar;
- corrigir;
- testar;
- documentar;
- justificar a decisão final.

---

# Material complementar

## Checkpoint final

- [ ] Revisei privacy e lifecycle dos dados.
- [ ] Revisei rate limiting e mass assignment.
- [ ] Revisei DTOs, errors, logs e audit.
- [ ] Revisei supply chain, testes e hardening.
- [ ] Revisei PR, recovery e GO/NO-GO.

---

## Troubleshooting adicional

### A revisão está extensa demais

Agrupe os temas pelo fluxo: input, dado, observabilidade, artifact e release.

### Privacy e segurança parecem iguais

Segurança protege contra acesso e abuso; privacy também questiona finalidade, necessidade, retenção e direitos.

### Rate limit retorna 429 quando Redis cai

O código está confundindo limite excedido com indisponibilidade do controle.

### Unknown field não falha

O ObjectMapper ou annotation está ignorando propriedades.

### Logs não mostram a sentinela, mas exceptions mostram

Capture também response, stack sanitizada, audit e reports.

### SBOM existe, mas não possui o artifact

A geração pode estar fora do lifecycle correto.

### Backup restore demora demais

Mantenha-o em job separado, sem remover a exigência antes do release.

### GO público ainda aparece

Revise gaps e blockers da policy.

---

## Perguntas de revisão

1. O que inicia privacy engineering?
2. UUID pode ser dado pessoal?
3. Policy pendente pode deletar?
4. Rate limiting autentica?
5. O que é fail-closed?
6. Quando usar `429`?
7. Quando usar `503`?
8. O que é mass assignment?
9. Qual é a defesa principal?
10. `WRITE_ONLY` impede log?
11. O que entra em Problem Details?
12. O que entra no MDC?
13. BOM e SBOM são iguais?
14. CVSS é risco final?
15. O que KEV indica?
16. Suppression pode ser eterna?
17. O que um teste negativo valida?
18. Backup prova restore?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Inventário de dados.
2. Sim.
3. Não.
4. Não.
5. Negar quando o controle falha.
6. Limite excedido.
7. Decisão indisponível.
8. Binding de campos não permitidos.
9. DTO allowlist por caso de uso.
10. Não.
11. Contrato público mínimo.
12. Correlation, trace e span.
13. Não.
14. Não.
15. Exploração conhecida.
16. Não.
17. Rejeição, side effects e vazamento.
18. Não.
19. Prova pratica seguranca.
20. Diagnóstico, correção e evidências.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 451 - M15.41 - Revisao seguranca parte 2

- Concluí a revisão técnica do Módulo 15 antes da prova prática.
- Revisei classificação e inventário de dados.
- Revisei privacy engineering e direitos dos titulares.
- Revisei autenticação recente.
- Revisei policies de retenção.
- Mantive deleção bloqueada em policy pendente.
- Revisei lifecycle de backup.
- Revisei rate limiting por operação e dimensão.
- Revisei HMAC nas keys.
- Mantive forwarded headers sem confiança direta.
- Diferenciei fail-open e fail-closed.
- Diferenciei `429` e `503`.
- Revisei mass assignment.
- Revisei DTOs por caso de uso.
- Revisei JSON estrito.
- Diferenciei Request, Command, Result e Response.
- Revisei riscos de records, `toString` e `WRITE_ONLY`.
- Revisei Problem Details seguro.
- Diferenciei logs, audit, MDC e métricas.
- Revisei log injection e cardinalidade.
- Revisei dependências diretas e transitivas.
- Diferenciei BOM e SBOM.
- Revisei CVE, CVSS, KEV, EPSS e reachability.
- Revisei suppressions e risk register.
- Revisei testes unit, web, integration, policy, external e supply chain.
- Revisei asserções negativas e side effects.
- Revisei matriz de autorização.
- Revisei hardening e profile release.
- Revisei checklist de PR e exceções.
- Revisei backup e restore.
- Revisei evidence manifest.
- Revisei gaps e GO/NO-GO.
- Criei `M15_REVISAO_SEGURANCA_PARTE_2.md`.
- Criei mapa de dados e evidências.
- Criei testes focados de privacy, rate limit, mass assignment, logs, supply chain, hardening e release.
- Executei SCA e gate completo.
- Mantive `GO_CONTROLLED`.
- Mantive `NO_GO_PUBLIC`.
- Próxima aula: Prova pratica seguranca.
```

---

## Referência técnica curta

- [OWASP Privacy Risks](https://owasp.org/www-project-top-10-privacy-risks/)
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [CycloneDX Specification](https://cyclonedx.org/specification/overview/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST Contingency Planning Guide](https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final)

Regra final:

```text
a segunda revisão de segurança deve acompanhar dados e artifacts por todo o lifecycle: privacy começa no inventário, rate limiting usa dimensões e failure modes adequados, DTOs e JSON estrito impedem mass assignment, responses, logs, audit e métricas possuem allowlists próprias, supply chain é conhecida por tree, SBOM e SCA, testes negativos verificam ausência de side effects e vazamentos, hardening reduz superfície e consumo, PRs exigem evidências proporcionais ao risco e a release só recebe GO no ambiente compatível com os gaps, recovery e artifacts realmente comprovados.
```
