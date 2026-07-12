# 452 - M15.42 - Prova pratica seguranca

## Apresentação da aula

Chegou o momento de demonstrar, na prática, o que foi construído no Módulo 15.

Nas aulas 450 e 451, você revisou o caminho completo de uma aplicação segura:

```text
request;

hardening;

autenticação;

identidade;

tenant;

permission;

ownership;

regra de negócio;

persistência;

auditoria;

response;

logs;

supply chain;

release.
```

A prova não será um questionário de definições isoladas.

Você receberá um cenário de mudança insegura e deverá agir como engenheiro Java Backend responsável pela proteção do sistema.

O cenário será um pull request fictício:

```text
PR-SEC-M15-042

Título:
Adicionar aprovação emergencial
de solicitações de acesso.
```

A justificativa do PR é:

```text
durante incidentes,
a equipe de suporte precisa
aprovar rapidamente
uma solicitação PENDING.
```

A implementação foi feita com pressa.

Ela adicionou um endpoint:

```text
POST
/api/v1/access-requests/{id}/emergency-decision
```

O código compila.

O happy path retorna `200`.

Os testes do autor passam.

Mesmo assim, o PR contém regressões críticas de segurança.

Seu trabalho será:

```text
identificar;

priorizar;

corrigir;

testar;

documentar;

decidir.
```

Você deverá trabalhar sobre o projeto:

```text
labs/m15/projeto-api-segura
```

Crie uma branch local:

```powershell
git switch -c avaliacao/m15-seguranca
```

Não use:

- dados reais;
- tokens reais;
- secrets reais;
- tenants reais;
- endpoints de produção;
- dependências vulneráveis adicionadas de propósito;
- bypass temporário fora de registro.

A prova utiliza fixtures sintéticas.

O tempo sugerido é:

```text
4 a 6 horas.
```

O tempo não é o principal critério.

O critério principal é:

```text
qualidade da decisão
e das evidências.
```

Você pode consultar:

- código do projeto;
- aulas anteriores;
- documentos oficiais;
- documentação técnica;
- testes existentes;
- threat model;
- matrizes;
- runbooks.

Você não deve transformar a prova em uma cópia mecânica de implementações anteriores.

A mudança precisa ser compreendida dentro do novo cenário.

A prova vale:

```text
100 pontos.
```

Pontuação mínima sugerida:

```text
75 pontos.
```

Entretanto, alguns erros são eliminatórios mesmo com pontuação total suficiente.

Bloqueios críticos:

```text
aceitar token
com audience incorreta;

aceitar ID Token
na API;

permitir cross-tenant;

permitir self-approval;

aceitar status,
tenant ou reviewer do body;

logar token,
password ou payload sensível;

expor Actuator sensível;

desabilitar o scanner;

emitir GO_PUBLIC
com gaps bloqueantes.
```

A prova termina com um relatório:

```text
docs/security/
└── M15_PROVA_PRATICA_SEGURANCA_RESULTADO.md
```

Esse relatório será usado como entrada na próxima aula:

```text
453 - M15.43 - Refatoracao final seguranca
```

Na aula 453, você transformará as correções da prova em uma refatoração final, removendo duplicações, consolidando policies e organizando o código sem alterar as garantias de segurança.

---

## Onde estamos na formação

A sequência oficial é:

```text
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
Projeto final modulo 15.
```

As revisões responderam:

```text
quais controles existem;

por que existem;

qual evidência comprova.
```

A prova responderá:

```text
você consegue reconhecer
uma regressão real,
corrigi-la
e justificar a decisão?
```

Nesta aula:

```text
diagnóstico:
avaliado.

priorização:
avaliada.

correção:
avaliada.

testes negativos:
avaliados.

documentação:
avaliada.

GO/NO-GO:
avaliado.

refatoração estrutural:
próxima aula.
```

A regra central será:

```text
uma correção de segurança
só está completa
quando impede o abuso,
preserva o contrato,
não cria efeitos colaterais
e produz evidência reproduzível.
```

---

## Objetivo prático

Ao final da prova, você terá produzido:

```text
docs/security/
├── M15_PROVA_PRATICA_SEGURANCA_RESULTADO.md
├── M15_PROVA_THREAT_MODEL_DELTA.md
└── M15_PROVA_RELEASE_DECISION.md
```

Código corrigido em:

```text
src/main/java/
src/main/resources/
```

Testes em:

```text
src/test/java/
└── br/com/formacao/secureaccess/security/exam/
```

Classes mínimas esperadas:

```text
EmergencyDecisionSecurityTest;

EmergencyDecisionAuthorizationTest;

EmergencyDecisionTenantIsolationTest;

EmergencyDecisionMassAssignmentTest;

EmergencyDecisionConcurrencyTest;

EmergencyDecisionLoggingTest;

EmergencyDecisionRateLimitTest;

ExamReleasePolicyTest.
```

Você deverá:

1. reproduzir a baseline;
2. ler o PR;
3. listar ameaças;
4. classificar severidade;
5. definir ordem de correção;
6. revisar a necessidade do endpoint;
7. corrigir autenticação;
8. corrigir JWT;
9. corrigir identidade local;
10. corrigir tenant;
11. corrigir autorização;
12. corrigir DTOs;
13. corrigir concorrência;
14. corrigir logs;
15. corrigir audit;
16. corrigir rate limiting;
17. corrigir supply chain;
18. corrigir hardening;
19. executar gates;
20. emitir decisão final.

---

## Conceito essencial

### A primeira decisão pode ser rejeitar o design

O requisito pede uma aprovação emergencial.

Isso não significa que a solução correta seja criar um endpoint que contorna o workflow.

Antes de alterar código, pergunte:

```text
qual problema operacional
precisa ser resolvido?

o endpoint existente
já suporta a operação?

a emergência exige
mais controle
ou menos controle?

quem aprova?

há segregação?

há expiração?

há auditoria?

há rollback?
```

No projeto atual, já existe:

```text
POST
/api/v1/access-requests/{id}/decision.
```

A prova aceita duas decisões arquiteturais, desde que justificadas.

Opção A:

```text
rejeitar o novo endpoint;

reutilizar o endpoint existente;

criar permission específica
ou policy de emergência;

preservar If-Match,
tenant,
segregação
e auditoria.
```

Opção B:

```text
manter endpoint separado;

aplicar todos os controles;

explicar por que
a operação é semanticamente distinta.
```

Uma terceira opção não é aceita:

```text
endpoint especial
com menos segurança.
```

---

### O patch inseguro

Considere que o PR trouxe os seguintes trechos.

Security configuration:

```java
http
    .csrf(
        csrf ->
            csrf.disable()
    )
    .authorizeHttpRequests(
        requests ->
            requests
                .requestMatchers(
                    "/actuator/**"
                )
                .permitAll()
                .requestMatchers(
                    "/api/v1/access-requests/**"
                )
                .authenticated()
                .anyRequest()
                .authenticated()
    )
    .oauth2ResourceServer(
        oauth2 ->
            oauth2.jwt(
                Customizer.withDefaults()
            )
    );
```

Problemas possíveis:

- Actuator amplo;
- ausência de deny-by-default;
- endpoint protegido apenas por autenticação;
- CSRF desabilitado sem separar chains;
- ausência visível de handlers seguros;
- nenhuma evidência de audience validator.

---

### Request DTO inseguro

```java
public record EmergencyDecisionRequest(
        UUID tenantId,
        UUID reviewerUserId,
        String status,
        String reason,
        long version
) {
}
```

Problemas possíveis:

- tenant controlado pelo client;
- reviewer controlado pelo client;
- status arbitrário;
- version no body;
- reason sem validação;
- sem enum de intenção;
- possível mass assignment;
- contrato diferente de `If-Match`.

---

### Controller inseguro

```java
@PostMapping(
    "/{id}/emergency-decision"
)
ResponseEntity<AccessRequest> decide(
        @PathVariable
        UUID id,
        @RequestHeader(
            HttpHeaders.AUTHORIZATION
        )
        String authorization,
        @RequestBody
        EmergencyDecisionRequest request
) {
    log.info(
        "Emergency decision token={} request={}",
        authorization,
        request
    );

    AccessRequest result =
            service.emergencyDecision(
                id,
                request
            );

    return ResponseEntity.ok(
        result
    );
}
```

Problemas possíveis:

- Authorization header exposto;
- request inteiro no log;
- entity retornada;
- Authentication ignorada;
- TenantContext não resolvido;
- response sem ETag;
- DTO sem validation;
- media type não declarado;
- log injection;
- dado pessoal em `reason`.

---

### Service inseguro

```java
@Transactional
public AccessRequest emergencyDecision(
        UUID id,
        EmergencyDecisionRequest request
) {
    AccessRequest entity =
            repository
                .findById(
                    id
                )
                .orElseThrow(
                    AccessRequestNotFoundException::new
                );

    entity.setTenantId(
            request.tenantId()
    );

    entity.setReviewerUserId(
            request.reviewerUserId()
    );

    entity.setStatus(
            AccessRequestStatus.valueOf(
                request.status()
            )
    );

    entity.setDecisionReason(
            request.reason()
    );

    auditRepository.save(
        SecurityAuditEntity.fromPayload(
            request
        )
    );

    return entity;
}
```

Problemas possíveis:

- sem `@PreAuthorize`;
- lookup global;
- cross-tenant;
- self-approval;
- setters em fields controlados;
- status arbitrário;
- sem state machine;
- sem `If-Match`;
- sem optimistic conflict contract;
- audit copia payload;
- entity vira response;
- nenhuma limitação de abuso.

---

### Rate limiter inseguro

```java
try {
    limiter.check(
        request.reviewerUserId()
                 .toString()
    );
}
catch (
    RedisConnectionFailureException exception
) {
    log.warn(
        "Redis unavailable: {}",
        exception.getMessage()
    );
}
```

Problemas possíveis:

- user ID raw na key;
- reviewer vem do body;
- fail-open;
- exception message raw;
- operação continua;
- sem tenant;
- sem policy;
- sem `503`.

---

### Supply chain insegura

No `pom.xml`:

```xml
<version>[2.0,3.0)</version>
```

No profile SCA:

```xml
<skip>true</skip>
```

Problemas possíveis:

- version range;
- build não reproduzível;
- scanner desabilitado;
- SBOM divergente;
- PR sem review de dependência;
- possível bypass de release gate.

---

### Release configuration insegura

```yaml
server:
  forward-headers-strategy: framework

management:
  server:
    address: 0.0.0.0

  endpoints:
    web:
      exposure:
        include: "*"

  endpoint:
    health:
      show-details: always

spring:
  web:
    error:
      include-message: always
      include-stacktrace: always
```

Problemas possíveis:

- confiança em forwarded headers;
- management em todas as interfaces;
- wildcard;
- health detalhado;
- stack e exception expostas;
- inconsistência com `NO_GO_PUBLIC`.

---

### Teste insuficiente

```java
@Test
void emergencyApprovalWorks() {
    var response =
            client.post(
                "/api/v1/access-requests/"
                + requestId
                + "/emergency-decision",
                body
            );

    assertThat(
        response.statusCode()
    )
    .isEqualTo(
        200
    );
}
```

O teste não verifica:

- autenticação;
- permission;
- tenant;
- requester e reviewer;
- estado;
- version;
- audit;
- rate limit;
- logs;
- response allowlist;
- side effects;
- concorrência.

---

### Priorização

Use quatro níveis.

`CRITICAL`:

- cross-tenant;
- self-approval;
- token inválido aceito;
- management sensível público;
- token em log;
- scanner desabilitado.

`HIGH`:

- mass assignment;
- ausência de Method Security;
- audit com payload;
- fail-open em decisão;
- entity na response;
- ausência de optimistic locking.

`MEDIUM`:

- reason sem validação;
- errors excessivos;
- ausência de ETag;
- version range;
- logs de exception raw.

`LOW`:

- nomenclatura;
- duplicação;
- documentação incompleta sem alterar o controle.

A severidade final depende do contexto.

---

### Ordem de correção

Ordem sugerida:

1. interromper exposição e bypass;
2. restaurar autenticação e validação JWT;
3. restaurar tenant e permissions;
4. remover mass assignment;
5. restaurar state machine e concorrência;
6. proteger logs e audit;
7. restaurar rate limit fail-closed;
8. restaurar hardening;
9. restaurar SCA e build reproduzível;
10. escrever testes;
11. atualizar evidências;
12. emitir decisão.

Não comece pela formatação.

---

### Critério de conclusão

Cada finding deve possuir:

```text
ID;

ameaça;

severidade;

evidência;

controle;

arquivo alterado;

teste;

resultado;

risco residual.
```

Exemplo:

```text
EXAM-SEC-001

Ameaça:
cross-tenant decision.

Severidade:
CRITICAL.

Controle:
TenantContext + lookup
por id e tenant.

Teste:
shouldHideRequestFromOtherTenant.

Resultado:
404 e nenhuma mutação.
```

---

## Mão na massa guiada

### 1. Preparar a branch

```powershell
git status
git switch -c avaliacao/m15-seguranca
```

Confirme que o working tree estava limpo.

---

### 2. Executar baseline

```powershell
.\mvnw.cmd clean verify
```

Registre:

- commit;
- data;
- resultado;
- testes;
- profiles;
- migrations.

Se a baseline já falhar, separe falha preexistente de regressão da prova.

---

### 3. Criar o relatório inicial

Arquivo:

```text
docs/security/
M15_PROVA_PRATICA_SEGURANCA_RESULTADO.md
```

Cabeçalho:

```markdown
# Prova pratica de seguranca

## Escopo

## Baseline

## Findings

## Correcoes

## Testes

## Evidencias

## Risco residual

## Decisao
```

---

### 4. Criar threat model delta

Arquivo:

```text
M15_PROVA_THREAT_MODEL_DELTA.md
```

Registre ameaças novas ou alteradas:

```text
EXAM-THR-001:
approval bypass.

EXAM-THR-002:
cross-tenant decision.

EXAM-THR-003:
self-approval.

EXAM-THR-004:
JWT audience bypass.

EXAM-THR-005:
mass assignment.

EXAM-THR-006:
token in logs.

EXAM-THR-007:
audit payload exposure.

EXAM-THR-008:
rate limiter fail-open.

EXAM-THR-009:
Actuator exposure.

EXAM-THR-010:
SCA bypass.
```

---

### 5. Definir a arquitetura

Escolha:

```text
reutilizar decision endpoint;
```

ou:

```text
manter endpoint separado.
```

Documente:

- razão;
- permission;
- actor;
- tenant;
- segregation;
- state;
- version;
- audit;
- rate limit;
- rollback.

---

### 6. Corrigir a FilterChain

Requisitos:

- Actuator não fica na porta pública;
- rotas públicas são explícitas;
- `/api/**` exige autenticação;
- fallback usa deny-by-default;
- API permanece stateless;
- handlers retornam Problem Details;
- OIDC stateful permanece em chain separada;
- audience validator está ativo.

Teste:

```text
rota desconhecida:
negada.

endpoint sem token:
401.

Actuator sensível:
indisponível.
```

---

### 7. Corrigir o JWT

Valide:

- signature;
- algorithm;
- issuer;
- audience;
- expiration;
- not-before;
- key;
- access token destinado à API.

Cenários:

```text
wrong issuer:
401.

wrong audience:
401.

ID Token:
401.

expired:
401.

valid access token:
continua.
```

---

### 8. Restaurar identidade local

Use:

```text
issuer + subject.
```

Confirme:

- usuário provisionado;
- usuário ativo;
- identity ativa;
- authorities do token;
- membership local.

Não derive reviewer do body.

---

### 9. Restaurar TenantContext

O tenant vem de:

- usuário local;
- memberships;
- selector;
- validation.

Cross-tenant precisa retornar:

```text
404
```

para recurso individual oculto.

Seleção de tenant sem membership:

```text
403.
```

---

### 10. Criar permission

Defina uma authority exata.

Exemplo:

```text
access-request:emergency-review.
```

Ou reutilize:

```text
access-request:review
```

se a operação não possuir semântica distinta.

Justifique a escolha.

A role não substitui a permission.

---

### 11. Proteger o service

Adicione:

```java
@PreAuthorize(
    "hasAuthority('access-request:review')"
)
```

ou a permission definida.

Teste o bean Spring diretamente.

Não use instância com `new`.

---

### 12. Corrigir o DTO

O request deve representar apenas intenção.

Exemplo:

```java
public record EmergencyDecisionRequest(
        @NotNull
        AccessRequestDecision decision,

        @Size(
            max = 500
        )
        String reason
) {
}
```

Não inclua:

- tenant;
- reviewer;
- status;
- version;
- timestamps;
- permissions.

---

### 13. Restaurar JSON estrito

Envie:

```text
tenantId;

reviewerUserId;

status;

version;

authorities;

createdAt.
```

Esperado:

```text
400 unknown_request_property.
```

Nenhuma mutação ocorre.

---

### 14. Restaurar If-Match

Version vem de:

```http
If-Match: "n"
```

Contratos:

```text
ausente:
428.

malformado:
400.

stale:
412.

race real:
409.
```

Não exponha counters internos.

---

### 15. Restaurar state machine

Decisões permitidas:

```text
PENDING -> APPROVED;

PENDING -> REJECTED.
```

Se a emergência possuir regra distinta, ela precisa ser explícita e testada.

Não permita status arbitrário por `valueOf` vindo do client.

---

### 16. Restaurar segregation of duties

Compare:

```text
requesterUserId;

authenticatedReviewerUserId.
```

Mesmo tenant admin ou actor emergencial não aprova a própria solicitação.

Esperado:

```text
403 self_review_forbidden.
```

---

### 17. Restaurar query scoped

Use:

```text
findByIdAndTenantId.
```

Depois aplique segregation.

Não use lookup global.

Não execute segunda query para descobrir outro tenant.

---

### 18. Corrigir response

Retorne response DTO.

Não retorne entity.

Inclua somente campos aprovados.

Adicione ETag.

Não exponha:

- tenant ID;
- subject;
- authorities;
- version no body;
- internals de audit;
- JPA state.

---

### 19. Corrigir logs

Remova:

```text
Authorization;

request inteiro;

reason;

JWT;

exception message raw.
```

Log seguro:

```text
event;

outcome;

route;

correlation;

reason code.
```

Use sentinelas nos testes.

---

### 20. Corrigir audit

Audit registra:

- actor local;
- tenant;
- target;
- action;
- outcome;
- before;
- after;
- correlation.

Não copia request.

Audit obrigatório participa da transação.

---

### 21. Corrigir rate limiting

A dimensão usa:

```text
reviewer autenticado
+ tenant validado.
```

A key usa HMAC.

Redis indisponível:

```text
503
security_rate_limiter_unavailable.
```

Limite excedido:

```text
429
rate_limit_exceeded.
```

A operação não continua.

---

### 22. Corrigir hardening

Restaure:

- forwarded headers `none`;
- management em loopback;
- exposure allowlist;
- health sem details;
- errors genéricos;
- server header suprimido;
- release profile com hardening;
- no wildcard.

---

### 23. Corrigir supply chain

Remova version range.

Use versão fixa e gerenciada.

Restaure:

- SCA;
- `failOnError`;
- threshold;
- KEV;
- suppression policy;
- SBOM no package.

Não invente um finding.

Use o report real.

---

### 24. Criar EmergencyDecisionSecurityTest

Cenários:

- sem token;
- wrong issuer;
- wrong audience;
- ID Token;
- valid access token;
- rota desconhecida;
- Actuator sensível.

Valide status e ausência de side effects.

---

### 25. Criar EmergencyDecisionAuthorizationTest

Cenários:

- permission correta;
- role sem permission;
- requester sem review;
- auditor sem review;
- authority semelhante;
- method call direta;
- deny-by-default.

---

### 26. Criar EmergencyDecisionTenantIsolationTest

Cenários:

- same tenant;
- other tenant;
- invalid selector;
- missing membership;
- count e list quando aplicável.

Cross-tenant:

```text
404 e nenhuma mutação.
```

---

### 27. Criar EmergencyDecisionMassAssignmentTest

Payloads com campos controlados.

Valide:

- `400`;
- Problem Details;
- repository unchanged;
- audit success absent;
- logs sem valores.

---

### 28. Criar EmergencyDecisionConcurrencyTest

Duas decisões concorrentes.

Esperado:

```text
uma vence;

uma falha;

um estado terminal;

um audit de sucesso;

nenhuma decisão duplicada.
```

Use PostgreSQL real.

---

### 29. Criar EmergencyDecisionLoggingTest

Sentinelas:

```text
token-exam-sentinel;

reason-exam-sentinel;

subject-exam-sentinel;

tenant-exam-sentinel;

crlf-exam-sentinel.
```

Capture:

- success;
- denial;
- malformed body;
- rate limit;
- optimistic conflict.

Nenhuma sentinela aparece.

---

### 30. Criar EmergencyDecisionRateLimitTest

Use Redis real.

Valide:

- permitido até o limite;
- `429`;
- `Retry-After`;
- TTL;
- Redis unavailable;
- `503`;
- repository não chamado;
- key sem UUID raw.

---

### 31. Criar ExamReleasePolicyTest

Valide:

- release inclui hardening;
- Actuator não usa wildcard;
- forward headers não são confiados;
- stack trace off;
- SCA não está skipped;
- versions são fixas;
- GO público bloqueado por gaps;
- evidence manifest exige commit final.

---

### 32. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=EmergencyDecisionSecurityTest,EmergencyDecisionAuthorizationTest,EmergencyDecisionTenantIsolationTest,EmergencyDecisionMassAssignmentTest,EmergencyDecisionConcurrencyTest,EmergencyDecisionLoggingTest,EmergencyDecisionRateLimitTest,ExamReleasePolicyTest `
  test
```

---

### 33. Executar regressão

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

A correção não pode quebrar:

- create;
- read own;
- list own;
- review queue;
- normal decision;
- audit;
- rate limits;
- privacy;
- hardening.

---

### 34. Executar SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Registre o resultado.

Se o scanner falhar:

```text
gate falha.
```

---

### 35. Executar gate completo

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Evidências precisam pertencer ao commit final.

---

### 36. Criar a tabela de findings

No relatório:

| ID | Severidade | Falha | Controle | Teste | Estado |
|---|---|---|---|---|---|
| EXAM-SEC-001 | Critical | Cross-tenant | scoped query | tenant test | Resolved |
| EXAM-SEC-002 | Critical | Token em log | safe logging | sentinel test | Resolved |
| EXAM-SEC-003 | High | Mass assignment | DTO allowlist | malicious payload | Resolved |

Inclua todos os findings reais.

---

### 37. Criar score técnico

Rubrica:

| Área | Pontos |
|---|---:|
| Threat model e priorização | 10 |
| Autenticação, JWT e OAuth/OIDC | 15 |
| Autorização, tenant e SoD | 20 |
| DTOs, domínio e concorrência | 15 |
| Logs, audit e rate limit | 12 |
| Supply chain e hardening | 10 |
| Testes e evidências | 13 |
| Documentação e decisão | 5 |
| **Total** | **100** |

A pontuação não elimina blockers críticos.

---

### 38. Avaliar threat model

Dez pontos:

- ameaças corretas;
- ativos;
- fronteiras;
- severidade;
- prioridades;
- risco residual;
- ligação com testes.

Desconto:

- lista genérica;
- sem contexto;
- sem evidência;
- severidade arbitrária.

---

### 39. Avaliar autenticação

Quinze pontos:

- chain correta;
- deny-by-default;
- JWT completo;
- audience;
- ID Token rejeitado;
- identidade local;
- Problem Details;
- testes.

Falha crítica:

```text
token indevido aceito.
```

---

### 40. Avaliar autorização

Vinte pontos:

- permission exata;
- Method Security;
- tenant;
- self-review;
- scoped query;
- `403`;
- `404`;
- direct call;
- side effects.

Falha crítica:

```text
cross-tenant
ou self-approval.
```

---

### 41. Avaliar input e domínio

Quinze pontos:

- DTO mínimo;
- JSON estrito;
- server-controlled fields;
- state machine;
- If-Match;
- optimistic locking;
- response DTO;
- ETag.

---

### 42. Avaliar observabilidade e abuso

Doze pontos:

- token fora do log;
- reason fora do log;
- audit mínimo;
- transaction;
- HMAC;
- `429`;
- `503`;
- Redis test.

Falha crítica:

```text
secret ou payload sensível
nos logs.
```

---

### 43. Avaliar supply chain e hardening

Dez pontos:

- versão fixa;
- SCA ativa;
- SBOM;
- Actuator privado;
- errors genéricos;
- forwarded headers off;
- policy test.

Falha crítica:

```text
scanner desabilitado
ou management sensível público.
```

---

### 44. Avaliar testes e evidências

Treze pontos:

- PostgreSQL real;
- Redis real;
- negative tests;
- side effects;
- sentinel;
- concurrency;
- reports;
- commit final;
- regressão.

---

### 45. Avaliar documentação

Cinco pontos:

- findings claros;
- decisão arquitetural;
- risco residual;
- evidence links;
- GO/NO-GO coerente.

---

### 46. Emitir release decision

Arquivo:

```text
M15_PROVA_RELEASE_DECISION.md
```

Decisões permitidas:

```text
GO_CONTROLLED;

NO_GO_CONTROLLED;

NO_GO_PUBLIC.
```

No laboratório, `GO_PUBLIC` não deve ser emitido.

Se blockers críticos permanecem:

```text
NO_GO_CONTROLLED;

NO_GO_PUBLIC.
```

Se todos os blockers da prova foram resolvidos e os gaps anteriores permanecem:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

---

### 47. Commit da prova

Antes:

```powershell
git status
git diff
git diff --check
```

Commit sugerido:

```powershell
git commit -m "fix(m15): corrigir regressões da prova de seguranca"
```

Depois:

```powershell
git log -1 --oneline
git status --short
```

Reexecute os gates se o commit alterar qualquer arquivo após a última evidência.

---

## Entendendo o que foi feito

### A prova avaliou decisão, não memória

Você precisou interpretar um PR e escolher controles proporcionais ao risco.

### O design também foi questionado

A existência de um requisito não obrigou a aceitar um endpoint inseguro.

### A correção atravessou camadas

FilterChain, JWT, tenant, service, entity, DTO, repository, audit, Redis e release precisaram concordar.

### Testes negativos foram centrais

Happy path não demonstrou proteção contra abuso.

### Side effects fizeram parte do contrato

Uma response negada não poderia esconder mutação anterior.

### Evidências foram ligadas ao commit

Reports antigos não sustentaram a decisão final.

### GO/NO-GO permaneceu limitado

A prova corrigiu regressões sem inventar prontidão produtiva.

---

## Erros comuns importantes

### Corrigir somente o controller

Service, repository e domínio continuam vulneráveis.

### Trocar `authenticated` por uma role ampla

Permission e regras contextuais continuam ausentes.

### Aceitar tenant do body e depois validar

O DTO já representa uma fronteira errada.

### Filtrar self-review apenas na listagem

O endpoint direto continua vulnerável.

### Adicionar try/catch e retornar 200

A falha deixa de ser visível e auditável.

### Mascarar o token depois de logá-lo

O valor já atravessou a fronteira do logger.

### Criar suppression para o build passar

O finding continua sem correção.

### Desabilitar teste instável

O blocker perde proteção.

### Emitir GO por pontuação

Blocker crítico não é compensado por pontos em documentação.

### Refatorar tudo durante a prova

Mudanças amplas dificultam isolar correções e evidências.

---

## Comandos úteis

### Baseline

```powershell
.\mvnw.cmd clean verify
```

### Testes da prova

```powershell
.\mvnw.cmd `
  -Dtest=EmergencyDecisionSecurityTest,EmergencyDecisionAuthorizationTest,EmergencyDecisionTenantIsolationTest,EmergencyDecisionMassAssignmentTest,EmergencyDecisionConcurrencyTest,EmergencyDecisionLoggingTest,EmergencyDecisionRateLimitTest,ExamReleasePolicyTest `
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
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

### Busca de regressões

```powershell
git grep `
  -n `
  -E `
  "permitAll\\(|findById\\(|setTenantId|setReviewerUserId|log\\..*Authorization|exposure.*\\*|<skip>true</skip>"
```

---

## Exercício guiado

### Parte 1 — Diagnóstico

Liste findings antes de editar código.

### Parte 2 — Priorização

Corrija blockers antes de issues menores.

### Parte 3 — Arquitetura

Decida se o endpoint deve existir.

### Parte 4 — Identidade

Restaure JWT, principal e provisioning.

### Parte 5 — Autorização

Restaure permission, tenant e SoD.

### Parte 6 — Input

Restaure DTO, JSON estrito e version.

### Parte 7 — Operação

Restaure audit, logs e rate limiting.

### Parte 8 — Release

Restaure hardening e SCA.

### Parte 9 — Evidência

Execute testes e registre resultados.

### Parte 10 — Decisão

Emita GO ou NO-GO coerente.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- cenário da prova foi delimitado;
- baseline foi executada antes da correção;
- threat model delta foi criado;
- findings possuem severidade e evidência;
- decisão arquitetural do endpoint foi justificada;
- FilterChain usa deny-by-default;
- Actuator sensível não está público;
- JWT valida issuer, audience, assinatura e tempo;
- ID Token é rejeitado;
- identidade local usa issuer + subject;
- reviewer não vem do body;
- tenant é validado por membership;
- permission explícita protege a ação;
- Method Security foi testada no bean Spring;
- cross-tenant retorna `404`;
- self-approval retorna `403`;
- DTO contém somente a intenção;
- unknown fields retornam `400`;
- status e version não vêm do body;
- `If-Match` é obrigatório;
- stale retorna `412`;
- race retorna `409`;
- state machine impede decisão terminal repetida;
- response DTO substitui entity;
- logs não contêm token, reason ou payload;
- audit não copia request;
- audit de sucesso é transacional;
- rate limit usa identity + tenant com HMAC;
- Redis indisponível retorna `503`;
- limite excedido retorna `429`;
- versions são fixas;
- SCA e SBOM foram restauradas;
- hardening de release foi restaurado;
- PostgreSQL e Redis reais foram testados;
- negative tests verificam side effects;
- regressão e gate completo foram executados;
- evidências pertencem ao commit final;
- score foi calculado;
- blockers críticos foram tratados separadamente;
- decisão final foi registrada;
- `GO_PUBLIC` não foi emitido;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check

git grep `
  -n `
  -E `
  "Authorization.*log|request=.*\\{|exposure.*\\*|<skip>true</skip>|findById\\("
```

Adicione somente:

```powershell
git add `
  labs/m15/projeto-api-segura `
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
git commit -m "fix(m15): corrigir regressões da prova de seguranca"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- secret;
- backup dump;
- NVD API key;
- dados pessoais;
- log com sentinela;
- report de outro commit;
- bypass temporário;
- teste desabilitado;
- suppression sem expiração.

---

## Fechamento e ponte para a próxima aula

Nesta prova, você recebeu um PR que parecia funcional.

O happy path retornava `200`.

Mesmo assim, a mudança permitia:

```text
autenticação incompleta;

autorização insuficiente;

tenant controlado;

self-approval;

mass assignment;

corrida;

token em log;

audit com payload;

rate limit fail-open;

Actuator público;

SCA desabilitada.
```

A correção exigiu uma visão completa.

O fluxo seguro voltou a ser:

```text
request limitada;

JWT válido;

identidade local;

TenantContext;

permission;

segregação;

If-Match;

state machine;

persistência;

audit mínimo;

response allowlist;

logs seguros;

release gate.
```

A decisão central foi:

```text
software funcional
não é necessariamente
software seguro;

segurança precisa ser provada
contra os abusos relevantes,
com side effects,
evidências
e risco residual explícitos.
```

O resultado da prova será a matéria-prima da próxima aula.

A próxima aula será:

```text
453 - M15.43 - Refatoracao final seguranca
```

Nela, você irá:

- consolidar policies;
- remover duplicações;
- melhorar nomes;
- organizar packages;
- centralizar contracts;
- reduzir acoplamento;
- manter todos os testes verdes;
- provar que a refatoração não alterou as garantias.

---

# Material complementar

## Checkpoint final

- [ ] Diagnostiquei e priorizei antes de corrigir.
- [ ] Restaurei identidade, tenant e autorização.
- [ ] Restaurei DTOs, concorrência, logs e audit.
- [ ] Restaurei rate limiting, SCA e hardening.
- [ ] Executei gates e registrei GO/NO-GO.

---

## Troubleshooting adicional

### A baseline falha antes da prova

Registre a falha preexistente e não a atribua ao PR.

### O endpoint existente já resolve o requisito

Documente a decisão e remova a duplicação insegura.

### O cross-tenant continua retornando `403`

Revise a ordem: permission e tenant selection podem produzir `403`; recurso individual oculto usa `404`.

### O teste de concorrência passa sempre com duas respostas iguais

As threads podem não estar realmente sincronizadas.

Use barreira e PostgreSQL real.

### O token não aparece nos logs, mas aparece no report de teste

A assertion ou failure message pode estar imprimindo o valor.

Use mensagens genéricas.

### Redis indisponível ainda executa o service

O guard está depois do repository ou está fail-open.

### O scanner foi restaurado, mas o build ficou lento

Use cache e job separado; não faça skip.

### O score ficou acima de 75 com blocker crítico

A prova continua reprovada até o blocker ser eliminado.

---

## Perguntas de revisão

1. O endpoint novo precisa existir?
2. Autenticação basta para decidir?
3. De onde vem reviewer ID?
4. De onde vem tenant?
5. De onde vem version?
6. Role substitui permission?
7. Reviewer pode decidir a própria?
8. Cross-tenant retorna o quê?
9. Qual é a defesa contra mass assignment?
10. Entity pode ser response?
11. Token pode entrar no logger mascarado depois?
12. Audit pode copiar payload?
13. O que ocorre se Redis falhar?
14. Qual status indica limite excedido?
15. Qual status indica limiter indisponível?
16. Version range é aceitável?
17. Scanner pode ser skipped?
18. Pontuação elimina blocker?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Apenas se possuir semântica distinta e controles completos.
2. Não.
3. Da identidade autenticada local.
4. De membership validada.
5. Do `If-Match`.
6. Não.
7. Não.
8. `404`.
9. DTO allowlist e mapper explícito.
10. Não.
11. Não.
12. Não.
13. `503` fail-closed.
14. `429`.
15. `503`.
16. Não.
17. Não.
18. Não.
19. Refatoracao final seguranca.
20. Consolidar o código sem perder garantias.

---

## Desafio opcional

Implemente um modo de emergência com controles adicionais:

```text
permission dedicada;

justification obrigatória;

expiração curta;

dois reviewers distintos;

proibição de self-review;

tenant-scoped;

If-Match;

audit obrigatório;

métrica específica;

feature flag server-controlled;

runbook de ativação;

desativação automática.
```

O desafio não altera a nota base.

Ele só é aceito se todos os blockers principais já estiverem resolvidos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 452 - M15.42 - Prova pratica seguranca

- Realizei a prova prática do Módulo 15.
- Criei a branch `avaliacao/m15-seguranca`.
- Executei a baseline antes das mudanças.
- Analisei o PR fictício de aprovação emergencial.
- Criei `M15_PROVA_THREAT_MODEL_DELTA.md`.
- Identifiquei falhas de autenticação, autorização, tenant e input.
- Classifiquei findings por severidade.
- Priorizei blockers críticos.
- Avaliei se o endpoint emergencial deveria existir.
- Restaurei deny-by-default.
- Restaurei validação de issuer e audience.
- Mantive ID Token fora da API.
- Restaurei identidade local por issuer + subject.
- Removi reviewer e tenant do body.
- Restaurei permissions explícitas.
- Restaurei Method Security.
- Impedi cross-tenant.
- Impedi self-approval.
- Criei DTO de intenção mínimo.
- Restaurei JSON estrito.
- Exigi `If-Match`.
- Restaurei state machine.
- Mantive optimistic locking.
- Substituí entity por response DTO.
- Removi token, reason e payload dos logs.
- Restaurei audit mínimo e transacional.
- Restaurei rate limiting com HMAC.
- Usei `429` para excesso.
- Usei `503` para Redis indisponível.
- Restaurei hardening de release.
- Restaurei versions fixas, SBOM e SCA.
- Criei testes de autenticação, autorização, tenant e mass assignment.
- Criei testes de concorrência, logs e rate limiting.
- Criei policy test de release.
- Executei regressão e gate completo.
- Calculei o score técnico.
- Tratei blockers críticos separadamente da pontuação.
- Criei `M15_PROVA_PRATICA_SEGURANCA_RESULTADO.md`.
- Criei `M15_PROVA_RELEASE_DECISION.md`.
- Mantive `GO_CONTROLLED` somente se todos os blockers da prova foram resolvidos.
- Mantive `NO_GO_PUBLIC`.
- Próxima aula: Refatoracao final seguranca.
```

---

## Referência técnica curta

- [Spring Security — Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring Security — Resource Server JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

Regra final:

```text
uma prova prática de segurança deve avaliar a capacidade de reconhecer e corrigir regressões em todas as fronteiras relevantes: autenticação valida tokens destinados à API, identidade e memberships formam o contexto local, permissions e Method Security protegem a ação, tenant e segregação impedem abuso horizontal, DTOs e If-Match protegem input e concorrência, logs e audit preservam dados, rate limiting falha de acordo com o risco, supply chain e hardening permanecem ativos e a decisão de release depende de blockers, evidências do commit final e risco residual, não apenas de um happy path ou de uma pontuação.
```
