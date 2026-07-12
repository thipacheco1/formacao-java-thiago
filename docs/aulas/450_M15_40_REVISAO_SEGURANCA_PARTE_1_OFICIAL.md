# 450 - M15.40 - Revisao seguranca parte 1

## Apresentação da aula

O projeto prático foi encerrado com uma decisão honesta:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

Isso significa que os controles construídos ao longo do Módulo 15 funcionam de forma integrada em ambiente controlado, mas ainda existem gaps operacionais e de infraestrutura que impedem uma liberação pública.

Antes da prova prática, precisamos revisar o módulo de forma estruturada.

A revisão não será uma repetição superficial de definições.

Ela reconstruirá o raciocínio que deve acontecer quando uma request chega a uma API protegida:

```text
request;

protocolo;

filtros;

autenticação;

identidade;

permissions;

tenant;

resource;

ownership;

estado;

persistência;

auditoria;

response.
```

A pergunta central desta aula será:

```text
como diagnosticar
em qual camada
um controle de segurança
deve existir
e qual evidência prova
que ele realmente funciona?
```

A parte 1 da revisão cobrirá o núcleo de identidade e acesso:

```text
fundamentos de segurança web;

threat modeling;

OWASP aplicado;

CORS;

CSRF;

security headers;

password hashing;

arquitetura do Spring Security;

SecurityFilterChain;

autenticação em memória e banco;

JWT;

refresh token;

roles e authorities;

Method Security;

autorização de negócio;

errors;

auditoria;

secrets;

OAuth 2.0;

OpenID Connect;

PKCE;

Keycloak;

multi-tenancy.
```

A parte 2 ficará responsável por:

```text
privacidade;

rate limiting;

mass assignment;

DTOs e logs;

vulnerabilidades em dependências;

testes de segurança;

hardening;

checklist de PR;

projeto prático;

release gate.
```

A revisão partirá de um cenário único.

Imagine uma API de solicitações de acesso:

```text
POST /api/v1/access-requests;

GET /api/v1/access-requests/{id};

POST /api/v1/access-requests/{id}/decision.
```

O requester cria.

O reviewer decide.

O auditor consulta a trilha.

Todos pertencem a tenants.

A API recebe access tokens do Keycloak.

Para cada cenário, a aula perguntará:

1. qual ameaça existe;
2. qual camada controla;
3. qual status HTTP é esperado;
4. qual side effect é proibido;
5. qual teste comprova;
6. qual log ou audit é permitido.

A revisão também criará uma folha de diagnóstico:

```text
docs/security/
└── M15_REVISAO_SEGURANCA_PARTE_1.md
```

Ela reunirá:

- fluxo da request;
- mapa de `401`, `403` e `404`;
- checklist de JWT;
- checklist OAuth/OIDC;
- checklist de tenancy;
- sintomas e causas;
- perguntas de revisão;
- comandos de validação.

Ao final, você deverá conseguir explicar sem decorar frases isoladas:

```text
por que autenticação
não é autorização;

por que access token
não é ID Token;

por que role
não substitui permission;

por que tenant header
não prova membership;

por que query scoped
é mais segura
que lookup global;

por que 404 pode ser
uma decisão de segurança;

por que audit
não deve copiar payload.
```

A próxima aula será:

```text
451 - M15.41 - Revisao seguranca parte 2
```

---

## Onde estamos na formação

A sequência oficial é:

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
```

O projeto prático respondeu:

```text
como aplicar
os controles juntos?
```

A revisão parte 1 responderá:

```text
como reconstruir
o raciocínio de identidade,
autenticação,
autorização e tenancy?
```

Nesta aula:

```text
ameaças:
revisadas.

Spring Security:
revisado.

password:
revisado.

JWT:
revisado.

refresh:
revisado.

roles e permissions:
revisadas.

Method Security:
revisado.

OAuth 2.0:
revisado.

OIDC:
revisado.

PKCE:
revisado.

Keycloak:
revisado.

tenant e ownership:
revisados.

privacidade e supply chain:
próxima aula.
```

A regra central será:

```text
segurança não é
um componente isolado;

é uma sequência
de decisões coerentes
em fronteiras diferentes.
```

---

## Objetivo prático

Ao final da aula, você terá revisado o caminho:

```text
request externa;

SecurityFilterChain;

Authentication;

principal;

authorities;

TenantContext;

resource lookup;

business authorization;

domain state;

audit;

Problem Details.
```

Você irá criar:

```text
docs/security/
└── M15_REVISAO_SEGURANCA_PARTE_1.md
```

Testes de revisão:

```text
SecurityIdentityReviewTest;

JwtValidationReviewTest;

AuthorizationDecisionReviewTest;

TenantBoundaryReviewTest;

SecurityErrorContractReviewTest.
```

Você irá:

1. reconstruir o threat model;
2. revisar CORS e CSRF;
3. revisar headers;
4. revisar hash de password;
5. revisar filtros;
6. revisar Authentication;
7. revisar JWT;
8. revisar refresh;
9. revisar OAuth 2.0;
10. revisar OIDC;
11. revisar PKCE;
12. revisar Keycloak;
13. revisar roles e permissions;
14. revisar Method Security;
15. revisar ownership;
16. revisar tenancy;
17. revisar errors;
18. revisar audit;
19. diagnosticar falhas;
20. preparar a revisão parte 2.

---

## Conceito essencial

### Segurança é engenharia de risco

O objetivo não é eliminar todo risco.

O objetivo é:

```text
identificar;

priorizar;

reduzir;

detectar;

responder;

registrar risco residual.
```

Um controle existe para tratar uma ameaça específica.

Exemplo:

```text
ameaça:
token de issuer inesperado.

controle:
validação exata de issuer.

evidência:
teste com token assinado,
mas issuer incorreto,
retornando 401.
```

Sem ligação com ameaça e evidência, o controle vira configuração sem contexto.

---

### Threat model

Threat model responde:

- o que protegemos;
- quem pode atacar;
- quais fronteiras existem;
- quais abusos são plausíveis;
- quais controles existem;
- quais gaps permanecem.

Ele deve ser atualizado quando:

- endpoint nasce;
- dado novo aparece;
- actor muda;
- trust boundary muda;
- integração é adicionada;
- permission é alterada;
- infraestrutura muda.

---

### OWASP aplicado

OWASP ajuda a organizar riscos.

Ele não substitui threat model.

Exemplos no projeto:

```text
Broken Access Control:
tenant, ownership,
roles, permissions.

Security Misconfiguration:
Actuator, headers,
profiles, errors.

Software Supply Chain:
dependências, SBOM, SCA.

Authentication Failures:
login, JWT, refresh,
rate limit.

Logging Failures:
audit, sentinelas,
MDC e correlation.
```

A pergunta correta não é:

```text
temos OWASP?
```

A pergunta é:

```text
quais controles
tratam cada risco
no nosso sistema?
```

---

### CORS

CORS é uma política do browser.

Ele controla se uma origem pode ler uma response.

CORS não é autenticação.

CORS não protege chamadas feitas por:

- curl;
- Postman;
- backend;
- malware;
- outro servidor.

Uma origin permitida precisa ser exata.

Evite:

```text
* com credentials;

refletir qualquer Origin;

liberar qualquer header;

liberar qualquer method.
```

---

### CSRF

CSRF importa quando credenciais são enviadas automaticamente pelo browser.

Exemplos:

```text
cookie de sessão;

Basic auth armazenado;

certificado de client
usado automaticamente.
```

API Bearer stateless:

```text
Authorization header
adicionado explicitamente.
```

Ela normalmente não depende de CSRF token.

Fluxo OIDC com sessão e cookie:

```text
métodos mutáveis
precisam de proteção CSRF.
```

Desabilitar CSRF globalmente sem distinguir chains é erro.

---

### Security headers

Headers reduzem riscos do browser.

Exemplos:

```text
X-Content-Type-Options;

Content-Security-Policy;

Referrer-Policy;

Permissions-Policy;

Strict-Transport-Security
somente em HTTPS real.
```

Headers não corrigem autorização.

Eles complementam o modelo.

---

### Password hashing

Password não deve ser criptografada para depois ser recuperada.

Ela deve ser transformada por função de derivação de chave.

Requisitos:

```text
salt;

custo adaptativo;

algoritmo apropriado;

comparação segura;

re-hash futuro.
```

BCrypt foi usado na implementação.

Argon2 foi estudado como opção conceitual.

Nunca use:

- SHA-256 simples;
- MD5;
- salt fixo;
- password em log;
- comparação manual de hash.

---

### Spring Security

O Spring Security trabalha com:

```text
SecurityFilterChain;

SecurityContext;

Authentication;

principal;

GrantedAuthority;

AuthenticationManager;

AuthenticationProvider;

AuthorizationManager;

Method Security.
```

A request atravessa filtros antes do controller.

Um filtro pode:

- extrair credencial;
- autenticar;
- popular contexto;
- rejeitar;
- continuar a chain.

O controller não deve reconstruir autenticação.

---

### Authentication

`Authentication` representa:

```text
principal;

credentials;

authorities;

authenticated.
```

Após autenticação, credentials sensíveis devem ser removidas quando possível.

Principal não é entity JPA.

Principal não é response DTO.

Principal não deve ser logado inteiro.

---

### SecurityFilterChain

A chain precisa declarar:

- quais rotas são públicas;
- quais exigem autenticação;
- quais são stateless;
- qual CSRF policy;
- qual CORS policy;
- qual Resource Server;
- qual entry point;
- qual access denied handler;
- qual fallback.

Baseline:

```text
rotas conhecidas;

anyRequest().denyAll().
```

Uma rota nova não deve ficar liberada por acidente.

---

### Autenticação em memória e banco

Usuário em memória serviu para entender o fluxo.

Banco adicionou:

- repository;
- user ativo;
- password hash;
- authorities persistidas;
- transação;
- auditoria;
- testes.

Aprendizado central:

```text
trocar a fonte do usuário
não muda a diferença
entre autenticar
e autorizar.
```

---

### JWT

JWT possui:

```text
header;

payload;

signature.
```

Header informa algoritmo e key ID.

Payload contém claims.

Signature protege integridade e autenticidade conforme a chave confiável.

JWT assinado não significa automaticamente token válido.

Validações obrigatórias:

- algoritmo permitido;
- assinatura;
- issuer;
- audience;
- expiration;
- not before;
- clock skew;
- token type quando aplicável;
- key confiável.

---

### Claims

Claims úteis:

```text
iss;

sub;

aud;

exp;

nbf;

iat;

jti.
```

Claims customizadas podem transportar authorities.

Nunca confie em:

```text
e-mail como identidade estável;

role não catalogada;

claim livre do client;

tenant enviado sem validação local.
```

---

### Access token e ID Token

Access token:

```text
destinado à API;

carrega autorização;

audience da API.
```

ID Token:

```text
destinado ao client;

prova evento de autenticação;

carrega identidade.
```

A API não deve aceitar ID Token como bearer.

O audience validator ajuda a distinguir.

---

### Refresh token

Refresh token possui vida maior e risco maior.

A implementação revisada utiliza:

- token aleatório;
- hash no banco;
- rotação;
- família;
- revogação;
- expiração;
- detecção de reutilização;
- audit.

Reutilização de token rotacionado indica possível roubo.

A resposta deve revogar a família conforme a policy.

---

### Roles e authorities

Role é uma authority com convenção:

```text
ROLE_OPERATOR.
```

Permission é authority de ação:

```text
access-request:review.
```

Não use role como permissão universal.

Teste:

```text
ROLE_REVIEWER
sem access-request:review:
403.
```

Comparação deve ser exata.

---

### Method Security

`@PreAuthorize` protege o método do service.

Isso impede bypass por:

- outro controller;
- listener;
- scheduler;
- facade;
- refactor.

Teste o bean gerenciado pelo Spring.

Objeto criado com `new` não atravessa o proxy.

Cuidado com self-invocation.

---

### Autorização vertical

Escalada vertical ocorre quando alguém executa ação de maior privilégio.

Exemplo:

```text
requester tenta aprovar.
```

Controle:

```text
access-request:review.
```

Resultado:

```text
403.
```

---

### Autorização horizontal

Escalada horizontal ocorre quando alguém acessa recurso equivalente de outra pessoa.

Exemplo:

```text
requester A lê
solicitação do requester B.
```

Controle:

```text
tenant + owner
na query.
```

Resultado:

```text
404.
```

---

### Regra de negócio

Permission geral não é suficiente.

A decisão pode depender de:

- tenant;
- ownership;
- status;
- segregation of duties;
- version;
- membership;
- user ativo.

Exemplo:

```text
reviewer possui permission;

mas é o requester.

resultado:
self_review_forbidden.
```

---

### Multi-tenancy

Tenant é fronteira de dados.

`X-Tenant-Id` é input não confiável.

Fluxo seguro:

```text
principal;

usuário local;

memberships ativas;

selector;

TenantContext validado;

query tenant-scoped.
```

Global admin também precisa de tenant selecionado.

Não misture todos os tenants em uma query comum.

---

### Identidade externa

A chave estável é:

```text
issuer + subject.
```

Não use e-mail como vínculo automático.

Um token válido não provisiona usuário automaticamente.

A aplicação local decide:

- usuário existe;
- está ativo;
- membership existe;
- permission existe;
- tenant é permitido.

---

### Ownership

Query preferida:

```text
findByIdAndTenantIdAndOwnerId.
```

Evite:

```text
findById;

depois comparar.
```

O primeiro modelo reduz vazamento e enumeração.

---

### 401, 403 e 404

`401`:

```text
autenticação ausente
ou inválida.
```

`403`:

```text
identidade autenticada,
mas permission ou contexto
não autorizado.
```

`404`:

```text
recurso não existe
ou está oculto
por tenant/ownership.
```

A aplicação não executa lookup global para diferenciar.

---

### Auditoria

Audit responde:

```text
quem;

quando;

qual ação;

qual tenant;

qual target;

qual outcome;

qual reason code;

qual correlation.
```

Audit não copia:

- token;
- password;
- body;
- justification;
- decision reason;
- claims;
- headers.

Logs ajudam diagnóstico.

Audit sustenta accountability.

---

### Secrets

Secrets incluem:

- database password;
- client secret;
- private key;
- HMAC key;
- API key;
- token;
- cookie de sessão.

Eles não pertencem ao Git, YAML ou log.

A aplicação recebe secrets por environment, config tree ou secret manager.

Startup deve falhar quando secret obrigatório não existe.

---

### OAuth 2.0

OAuth 2.0 é framework de autorização delegada.

Papéis:

```text
resource owner;

client;

authorization server;

resource server.
```

O client obtém autorização para acessar um recurso.

OAuth 2.0 não define por si só a identidade do usuário para o client.

OIDC adiciona essa camada.

---

### Grants revisados

Authorization Code + PKCE:

```text
usuário interativo;

browser ou app;

redirect;

code;

token exchange.
```

Client Credentials:

```text
machine-to-machine;

sem usuário final.
```

Device Authorization:

```text
dispositivo com input limitado.
```

Evitar:

```text
Implicit;

Resource Owner Password Credentials.
```

---

### OpenID Connect

OIDC adiciona:

- ID Token;
- discovery;
- UserInfo;
- claims de identidade;
- nonce;
- subject.

Identidade estável:

```text
iss + sub.
```

Ao usar UserInfo:

```text
sub do UserInfo
deve ser igual
ao sub do ID Token.
```

---

### PKCE

PKCE protege o authorization code contra interceptação.

Fluxo:

```text
code_verifier;

SHA-256;

code_challenge;

S256;

token exchange.
```

PKCE não substitui:

- state;
- nonce;
- TLS;
- redirect URI exata;
- client authentication quando aplicável.

`plain` foi rejeitado.

---

### Keycloak

No laboratório:

```text
realm formacao-java;

client público;

Standard Flow;

PKCE S256;

redirect exata;

Direct Access Grants off;

Implicit off;

Service Accounts off
no client interativo.
```

O ambiente usa `start-dev` apenas localmente.

Produção exige configuração diferente.

---

## Mão na massa guiada

### 1. Criar o documento de revisão

Arquivo:

```text
docs/security/M15_REVISAO_SEGURANCA_PARTE_1.md
```

Estrutura:

```markdown
# Revisao de seguranca parte 1

## Fluxo da request

## Authn versus authz

## Checklist JWT

## Checklist OAuth/OIDC

## Checklist tenancy

## Contratos de erro

## Diagnostico por sintoma

## Comandos
```

---

### 2. Desenhar o fluxo

Registre:

```text
1. Tomcat recebe request.

2. hardening valida superfície.

3. SecurityFilterChain processa.

4. Resource Server valida JWT.

5. Authentication entra
   no SecurityContext.

6. identidade local é resolvida.

7. TenantContext é resolvido.

8. Method Security valida permission.

9. repository aplica tenant/owner.

10. domínio valida estado.

11. transação persiste.

12. audit registra.

13. response DTO é serializado.
```

---

### 3. Criar matriz de falhas

| Sintoma | Camada provável | Teste |
|---|---|---|
| `401` com token válido | issuer, audience, exp, signature | JWT boundary |
| `403` com role correta | permission ausente | authorization |
| `404` para recurso próprio | tenant/owner query | persistence |
| outro tenant aparece na lista | predicate/count | integration |
| direct call permite | proxy Method Security | method test |
| ID Token funciona na API | audience validator | JWT test |
| self-review funciona | business policy | SoD test |
| token aparece no log | logging boundary | sentinel |

---

### 4. Revisar CORS

Responda:

1. quais origins são legítimas;
2. credentials são necessárias;
3. quais methods;
4. quais request headers;
5. quais response headers expostos;
6. qual cache de preflight;
7. o que ocorre com origin não autorizada.

Teste:

```text
origin permitida;

origin negada;

preflight válido;

method negado;

header negado.
```

---

### 5. Revisar CSRF por chain

API:

```text
/api/**;

Bearer;

STATELESS;

CSRF desabilitado
com justificativa.
```

OIDC web:

```text
sessão;

cookie;

métodos mutáveis;

CSRF habilitado.
```

Crie dois testes separados.

---

### 6. Revisar headers

Valide responses de sucesso e erro.

Não aplique HSTS em HTTP local.

No ambiente HTTPS real, HSTS depende de TLS e proxy confiáveis.

---

### 7. Revisar password

Inspecione:

- encoder configurado;
- hashes existentes;
- custo;
- comparação;
- logs;
- DTO;
- reset futuro;
- re-hash.

Teste que password raw não aparece em:

- response;
- log;
- audit;
- exception;
- `toString`.

---

### 8. Revisar a chain

Procure:

```text
permitAll amplo;

anyRequest authenticated
sem deny fallback;

CSRF global;

session inesperada;

entry point padrão HTML;

redirect em API;

CORS permissivo.
```

A API deve retornar Problem Details, não página de login.

---

### 9. Revisar JWT validator

Checklist:

```text
algoritmo;

signature;

issuer;

audience;

exp;

nbf;

clock;

kid;

type;

authorities.
```

Crie tokens sintéticos para cada falha.

---

### 10. Revisar refresh token

Cenários:

- token válido;
- expirado;
- revogado;
- rotacionado;
- reutilizado;
- família comprometida;
- fingerprint;
- logs;
- audit.

Valide que denial não cria novo access token.

---

### 11. Revisar authorities

Monte casos:

```text
permission exata;

role apenas;

authority semelhante;

case diferente;

authority desconhecida;

duplicada;

claim ausente.
```

Resultado precisa ser previsível.

---

### 12. Revisar Method Security

Chame:

```text
create;

read;

review;

audit.
```

Diretamente no bean Spring.

Cenários:

- permission válida;
- permission ausente;
- principal anônimo;
- tenant errado;
- recurso oculto;
- self-review.

---

### 13. Revisar identidade local

Teste:

- issuer + subject conhecido;
- subject conhecido em issuer diferente;
- e-mail igual;
- user inativo;
- identity inativa;
- identity não provisionada;
- múltiplas identities legítimas.

E-mail igual não produz vínculo automático.

---

### 14. Revisar TenantContext

Casos:

- zero membership;
- uma membership;
- várias memberships sem header;
- header válido;
- header inválido;
- membership inativa;
- global admin sem seleção;
- global admin com seleção.

O header raw não chega ao domínio.

---

### 15. Revisar queries

Procure:

```text
findById global;

count global;

list sem tenant;

list sem owner;

native query sem predicate;

admin query sem contexto.
```

Use logs SQL somente em teste controlado, sem dados pessoais.

---

### 16. Revisar contrato de errors

Crie tabela:

| Situação | Status | Code |
|---|---:|---|
| sem token | 401 | authentication_required |
| token inválido | 401 | invalid_token |
| sem permission | 403 | access_denied |
| tenant não permitido | 403 | tenant_access_denied |
| resource oculto | 404 | not_found |
| state inválido | 409 | conflict |
| ETag stale | 412 | precondition_failed |
| If-Match ausente | 428 | precondition_required |

Valide `Cache-Control: no-store` nos errors sensíveis.

---

### 17. Revisar audit

Para cada write sensível, confirme:

- evento de sucesso;
- evento de denial quando necessário;
- transação;
- rollback;
- reason code fechado;
- correlation ID;
- ausência de payload;
- consulta restrita.

Audit failure obrigatório deve impedir a decisão quando a policy exigir.

---

### 18. Revisar secrets

Execute:

```powershell
git grep `
  -n `
  -E `
  "password:|client-secret:|private-key:|api-key:|BEGIN PRIVATE KEY"
```

Revise também:

- history;
- Docker layers;
- CI logs;
- test resources;
- collections;
- runbooks.

---

### 19. Criar SecurityIdentityReviewTest

Teste parametrizado para:

- anonymous;
- valid bearer;
- wrong issuer;
- wrong audience;
- ID Token;
- unprovisioned;
- inactive;
- valid provisioned.

Valide status e side effects.

---

### 20. Criar AuthorizationDecisionReviewTest

Matriz reduzida:

```text
requester create:
permitido.

requester review:
403.

reviewer other:
permitido.

reviewer own:
403.

auditor audit:
permitido.

auditor review:
403.

cross tenant:
404.
```

---

### 21. Criar TenantBoundaryReviewTest

Valide:

- list content;
- totalElements;
- read;
- review queue;
- audit;
- global admin selection.

Nenhum count cruza tenant.

---

### 22. Criar SecurityErrorContractReviewTest

Capture responses e confirme:

- status;
- code;
- Problem Details;
- no-store;
- correlation ID;
- sem stack;
- sem SQL;
- sem token;
- sem resource hidden.

---

### 23. Exercício de diagnóstico 1

Sintoma:

```text
token do Keycloak
retorna 401.
```

Ordem de investigação:

1. discovery;
2. issuer exato;
3. JWKS;
4. signature;
5. `kid`;
6. audience;
7. exp/nbf;
8. clock;
9. token type;
10. logs seguros.

Não desative validações para “testar”.

---

### 24. Exercício de diagnóstico 2

Sintoma:

```text
ROLE_REVIEWER recebe 403.
```

Perguntas:

1. possui `access-request:review`;
2. converter criou a authority;
3. claim está no access token;
4. Method Security exige qual valor;
5. comparação é exata;
6. principal local está ativo;
7. tenant foi resolvido.

Role sozinha pode não ser suficiente por design.

---

### 25. Exercício de diagnóstico 3

Sintoma:

```text
requester lê recurso
de outro tenant.
```

Ações imediatas:

1. bloquear release;
2. preservar evidência;
3. revisar repository;
4. revisar count;
5. revisar cache key;
6. revisar TenantContext;
7. revisar audit;
8. criar regression test;
9. avaliar incidente;
10. revisar outros endpoints.

Não trate como bug visual.

---

### 26. Exercício de diagnóstico 4

Sintoma:

```text
404 para recurso próprio.
```

Verifique:

- selected tenant;
- membership;
- owner ID;
- external identity;
- query predicate;
- fixture;
- transação;
- soft delete futuro;
- UUID correto.

Não troque para query global apenas para descobrir o problema.

---

### 27. Atualizar o threat model

Marque cada ameaça das aulas 411 a 437 como:

```text
CONTROLLED;

PARTIALLY_CONTROLLED;

OPERATIONAL;

REVIEW_REQUIRED.
```

Não altere para `CONTROLLED` sem evidência.

---

### 28. Criar mapa de evidências

| Controle | Evidência |
|---|---|
| issuer | wrong issuer test |
| audience | wrong audience test |
| permissions | matrix test |
| Method Security | direct bean test |
| tenant | cross-tenant test |
| ownership | hidden resource test |
| refresh rotation | reuse test |
| audit | transaction test |
| secrets | policy scan |

---

### 29. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=SecurityIdentityReviewTest,JwtValidationReviewTest,AuthorizationDecisionReviewTest,TenantBoundaryReviewTest,SecurityErrorContractReviewTest `
  test
```

---

### 30. Executar regressão

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

O objetivo é confirmar que a revisão não substituiu a suíte existente.

---

### 31. Criar resumo oral

Explique em até cinco minutos:

```text
request chega;

token é validado;

identidade local é resolvida;

tenant é validado;

permission é verificada;

query esconde recurso;

domínio valida estado;

audit registra;

response é minimizada.
```

Se uma etapa não puder ser explicada, revise o código correspondente.

---

### 32. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- CORS;
- CSRF;
- headers;
- password;
- filters;
- JWT;
- refresh;
- roles;
- permissions;
- Method Security;
- OAuth;
- OIDC;
- PKCE;
- Keycloak;
- identity;
- tenant;
- ownership;
- errors;
- audit;
- secrets;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### A revisão foi organizada pelo fluxo

Os temas deixaram de aparecer como capítulos desconectados.

### Autenticação e autorização foram separadas

Token válido identifica a request, mas permissions, tenant e regras de negócio decidem o acesso.

### OAuth e OIDC foram reposicionados

OAuth delega autorização; OIDC acrescenta identidade para o client.

### Access token e ID Token foram diferenciados

A API aceita somente token destinado a ela.

### Tenant e ownership foram tratados como query

A proteção não depende apenas de comparação posterior.

### Errors foram tratados como contrato

`401`, `403` e `404` possuem significados e evitam vazamento.

### Evidência foi ligada ao controle

Cada decisão possui teste, report ou policy verificável.

---

## Erros comuns importantes

### Decorar siglas sem entender o fluxo

OAuth, OIDC e PKCE precisam ser relacionados ao grant real.

### Tratar CORS como segurança da API

CORS protege leitura pelo browser, não chamadas servidor-servidor.

### Desabilitar CSRF em todas as chains

Sessão e cookie mudam a decisão.

### Aceitar qualquer JWT assinado

Issuer, audience e tempo também precisam ser validados.

### Usar role como permission

Roles organizam responsabilidades; permissions autorizam ações.

### Testar Method Security com new

O proxy não é chamado.

### Confiar no tenant header

Membership local precisa validar a seleção.

### Retornar 403 para todo recurso oculto

A existência pode vazar.

### Copiar payload para audit

Accountability não exige conteúdo completo.

### Colocar secret no profile local

Local também pode ser commitado ou logado.

---

## Comandos úteis

### Testes da revisão

```powershell
.\mvnw.cmd `
  -Dtest=SecurityIdentityReviewTest,JwtValidationReviewTest,AuthorizationDecisionReviewTest,TenantBoundaryReviewTest,SecurityErrorContractReviewTest `
  test
```

### Suíte de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar regras permissivas

```powershell
git grep `
  -n `
  -E `
  "permitAll\\(|anyRequest\\(\\)\\.authenticated|startsWith\\(.*authority"
```

### Procurar secrets

```powershell
git grep `
  -n `
  -E `
  "password:|client-secret:|api-key:|BEGIN PRIVATE KEY"
```

---

## Exercício guiado

### Parte 1 — Fluxo

Desenhe a request até a response.

### Parte 2 — Threats

Associe ameaça, controle e evidência.

### Parte 3 — Browser

Revise CORS, CSRF e headers.

### Parte 4 — Identity

Revise password, JWT, refresh e principal.

### Parte 5 — Protocolos

Diferencie OAuth, OIDC, PKCE e Keycloak.

### Parte 6 — Authorization

Revise role, permission e Method Security.

### Parte 7 — Contexto

Revise tenant, ownership e estado.

### Parte 8 — Contracts

Revise `401`, `403` e `404`.

### Parte 9 — Evidence

Execute testes e policy scans.

### Parte 10 — Explicação

Apresente o fluxo sem consultar a aula.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 449 foi preservada;
- escopo da revisão parte 1 foi delimitado;
- segurança foi tratada como engenharia de risco;
- threat model e OWASP foram revisados;
- CORS, CSRF e headers foram diferenciados;
- password hashing foi revisado;
- arquitetura do Spring Security foi reconstruída;
- SecurityFilterChain e deny-by-default foram revisados;
- Authentication, principal e authorities foram diferenciados;
- autenticação em memória e banco foram conectadas;
- JWT foi revisado além da assinatura;
- issuer, audience, exp, nbf, kid e algoritmo foram revisados;
- access token e ID Token foram diferenciados;
- refresh token, rotação e replay foram revisados;
- roles e permissions foram separadas;
- Method Security foi testada no bean Spring;
- OAuth 2.0, OIDC e PKCE foram diferenciados;
- Keycloak foi revisado como Authorization Server e IdP;
- issuer + subject permaneceu como identidade estável;
- provisionamento local foi mantido;
- tenant header permaneceu como seletor não confiável;
- tenancy e ownership foram aplicados nas queries;
- autorização vertical e horizontal foram revisadas;
- `401`, `403` e `404` foram revisados;
- audit e log foram diferenciados;
- secrets permaneceram fora de Git e logs;
- documento de revisão foi criado;
- matriz de falhas e mapa de evidências foram criados;
- testes focados e regressão foram executados;
- temas da revisão parte 2 não foram antecipados em profundidade;
- produção pública permaneceu NO-GO;
- gate completo foi executado;
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
git commit -m "test(m15): revisar identidade e autorizacao"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- password;
- secret;
- dump de JWT;
- usuário real;
- tenant real;
- log com claims;
- private key;
- evidência de outro commit;
- teste desabilitado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a primeira metade do Módulo 15 foi reconstruída como um fluxo único.

A request passa por:

```text
protocolo;

hardening;

SecurityFilterChain;

token validation;

Authentication;

identidade local;

TenantContext;

permission;

query scoped;

business rule;

audit;

response.
```

A revisão confirmou:

```text
CORS não autentica;

CSRF depende do modo
como a credencial viaja;

JWT assinado
ainda precisa de claims válidas;

access token
não é ID Token;

role
não substitui permission;

tenant header
não prova membership;

query scoped
protege contra enumeração;

404 pode ocultar recurso;

audit não copia payload.
```

A decisão central foi:

```text
a segurança da request
depende da coerência
entre protocolo,
identidade,
contexto,
autorização,
persistência
e contrato público.
```

A próxima aula será:

```text
451 - M15.41 - Revisao seguranca parte 2
```

Nela, você irá revisar:

- LGPD e privacy engineering;
- rate limiting;
- mass assignment;
- DTOs e logs;
- vulnerabilities em dependências;
- testes de segurança;
- testes de autorização;
- hardening;
- checklist de PR;
- projeto prático;
- release gate;
- GO/NO-GO.

---

# Material complementar

## Checkpoint final

- [ ] Reconstruí o fluxo completo da request.
- [ ] Diferenciei autenticação, identidade e autorização.
- [ ] Diferenciei OAuth, OIDC, PKCE e JWT.
- [ ] Revisei tenant, ownership e errors.
- [ ] Liguei controles a evidências.

---

## Troubleshooting adicional

### A revisão parece apenas teórica

Execute os testes focados e explique o motivo de cada status.

### OAuth e OIDC continuam confusos

Pergunte quem recebe o token e qual problema está sendo resolvido: delegação para API ou identidade para client.

### Role e permission parecem iguais

Monte o caso `ROLE_REVIEWER` sem `access-request:review`.

### Cross-tenant retorna dados

Pare o gate e revise repository, count, cache e TenantContext.

### ID Token funciona na API

Revise audience e token type.

### Direct call ignora PreAuthorize

Use o bean Spring, não uma instância manual.

### 404 próprio falha

Revise selected tenant, membership, owner e predicate.

### Audit contém payload

Remova body e use campos estruturados mínimos.

---

## Perguntas de revisão

1. O que segurança de aplicações gerencia?
2. Threat model substitui OWASP?
3. CORS autentica?
4. Quando CSRF importa?
5. Password deve ser criptografada reversivelmente?
6. O que Authentication contém?
7. JWT assinado basta?
8. Qual token a API aceita?
9. Qual token representa identidade para o client?
10. O que refresh rotation reduz?
11. Role substitui permission?
12. Como testar Method Security?
13. Qual é a identidade estável no OIDC?
14. O que PKCE protege?
15. O tenant header prova acesso?
16. O que protege ownership?
17. Quando usar `401`?
18. Quando usar `404`?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Risco.
2. Não.
3. Não.
4. Quando credenciais viajam automaticamente.
5. Não.
6. Principal, credentials e authorities.
7. Não.
8. Access token.
9. ID Token.
10. Reutilização de token roubado.
11. Não.
12. Chamando o bean proxied.
13. Issuer + subject.
14. Interceptação do authorization code.
15. Não.
16. Query com tenant e owner.
17. Auth ausente ou inválida.
18. Recurso inexistente ou oculto.
19. Revisao seguranca parte 2.
20. Privacidade, supply chain, testes e release.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 450 - M15.40 - Revisao seguranca parte 1

- Iniciei a revisão técnica do Módulo 15.
- Reconstruí segurança como engenharia de risco.
- Revisei threat modeling e OWASP aplicado.
- Diferenciei CORS, CSRF e security headers.
- Revisei hashing de password.
- Reconstruí a arquitetura do Spring Security.
- Revisei SecurityFilterChain e deny-by-default.
- Diferenciei Authentication, principal e authorities.
- Revisei autenticação em memória e banco.
- Revisei JWT, signature e claims.
- Revisei issuer, audience, expiration, not-before, kid e algoritmo.
- Diferenciei access token e ID Token.
- Revisei refresh token, rotação e replay.
- Separei roles e permissions.
- Revisei Method Security e proxy Spring.
- Revisei autorização vertical e horizontal.
- Revisei regras de negócio e segregation of duties.
- Revisei OAuth 2.0 e seus papéis.
- Revisei Authorization Code + PKCE.
- Revisei OpenID Connect.
- Mantive issuer + subject como identidade estável.
- Revisei Keycloak e seu ambiente local.
- Revisei provisionamento de identidade local.
- Revisei multi-tenancy.
- Mantive X-Tenant-Id como seletor não confiável.
- Revisei ownership e queries scoped.
- Revisei contratos `401`, `403` e `404`.
- Diferenciei auditoria e logs.
- Revisei secrets management.
- Criei `M15_REVISAO_SEGURANCA_PARTE_1.md`.
- Criei matriz de falhas.
- Criei mapa de evidências.
- Criei testes focados de identidade, JWT, autorização, tenant e errors.
- Executei regressão de segurança.
- Mantive produção pública como NO-GO.
- Próxima aula: Revisao seguranca parte 2.
```

---

## Referência técnica curta

- [Spring Security — Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring Security — OAuth 2.0 Resource Server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [RFC 7636 — PKCE](https://www.rfc-editor.org/rfc/rfc7636.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

Regra final:

```text
a primeira revisão de segurança deve reconstruir o caminho completo da request: ameaças orientam controles, o browser é tratado por CORS, CSRF e headers, Spring Security autentica e mantém o contexto, JWT é validado por assinatura e claims, OAuth 2.0 delega autorização, OIDC acrescenta identidade, PKCE protege o authorization code, Keycloak atua como provedor, issuer + subject resolvem identidade local, permissions protegem ações, tenant e ownership limitam dados, regras de negócio validam contexto e errors e audit preservam o contrato sem revelar informações sensíveis.
```
