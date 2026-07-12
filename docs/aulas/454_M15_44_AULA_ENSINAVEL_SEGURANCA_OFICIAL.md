# 454 - M15.44 - Aula ensinavel seguranca

## Apresentação da aula

O Módulo 15 chegou a um ponto importante.

Você já:

- estudou os fundamentos de segurança;
- configurou Spring Security;
- implementou autenticação;
- validou JWT;
- trabalhou com OAuth 2.0;
- utilizou OpenID Connect;
- configurou PKCE;
- integrou Keycloak;
- modelou identidade local;
- protegeu tenants;
- aplicou ownership;
- implementou permissions;
- criou auditoria;
- protegeu secrets;
- aplicou privacy engineering;
- implementou rate limiting;
- evitou mass assignment;
- protegeu DTOs e logs;
- analisou dependências;
- criou testes de segurança;
- aplicou hardening;
- construiu checklist de pull request;
- desenvolveu um projeto prático;
- realizou uma prova;
- executou uma refatoração final.

Agora surge uma nova competência.

Não basta apenas conseguir implementar.

Um engenheiro sênior também precisa conseguir:

```text
explicar;

demonstrar;

diagnosticar;

avaliar;

orientar;

corrigir entendimento.
```

A pergunta central desta aula será:

```text
como transformar
todo o conhecimento técnico
do Módulo 15
em uma aula clara,
prática,
avaliável
e ensinável para outra pessoa?
```

A habilidade de ensinar é valiosa porque obriga você a organizar o próprio raciocínio.

Quando alguém apenas repete comandos, pode esconder lacunas.

Quando precisa ensinar, deve responder:

- qual problema existe;
- por que o controle foi escolhido;
- qual ameaça ele reduz;
- onde ele é aplicado;
- qual limite ele possui;
- qual teste comprova;
- qual erro é comum;
- como diagnosticar;
- qual risco permanece.

Nesta aula, você criará uma aula de segurança com duração aproximada de:

```text
90 minutos.
```

O público-alvo será:

```text
desenvolvedor Java Backend
com conhecimento básico
de Spring Boot,
HTTP,
REST
e banco de dados.
```

A aula ensinável terá um tema central:

```text
Como proteger uma API Spring Boot
com autenticação,
autorização,
tenant,
DTOs,
logs
e testes negativos.
```

Ela não tentará ensinar todo o Módulo 15 em noventa minutos.

Isso seria superficial.

O objetivo será selecionar um caminho coerente e representativo.

A narrativa escolhida será:

```text
uma request chega;

o token é validado;

a identidade é resolvida;

o tenant é confirmado;

a permission é verificada;

a query limita o recurso;

o input é protegido;

a decisão é auditada;

os testes provam
que o abuso falha.
```

A aula precisa ensinar conceitos e demonstrá-los em código.

Ela também precisa permitir que o aluno pratique.

Estrutura planejada:

```text
10 minutos:
problema e ameaça.

15 minutos:
autenticação e JWT.

15 minutos:
autorização e tenant.

15 minutos:
DTOs e mass assignment.

10 minutos:
logs e auditoria.

15 minutos:
testes negativos.

10 minutos:
exercício e revisão.
```

O material será criado em:

```text
docs/teaching/
├── M15_AULA_ENSINAVEL_SEGURANCA.md
├── M15_ROTEIRO_DO_INSTRUTOR.md
├── M15_EXERCICIO_DO_ALUNO.md
├── M15_GABARITO_DO_INSTRUTOR.md
└── M15_RUBRICA_DE_AVALIACAO.md
```

Você também criará uma pequena demonstração reutilizável.

O código demonstrado será baseado no projeto:

```text
labs/m15/projeto-api-segura
```

Mas a aula não deve depender de o público conhecer todas as partes do projeto.

O instrutor precisa preparar:

- contexto mínimo;
- diagramas textuais;
- exemplos reduzidos;
- ordem dos arquivos;
- comandos;
- perguntas;
- pausas;
- checkpoints;
- exercício;
- gabarito;
- rubrica.

Uma aula ensinável não é apenas um documento longo.

Ela possui:

```text
objetivo observável;

sequência pedagógica;

pré-requisitos;

demonstração;

participação;

prática;

feedback;

avaliação.
```

A próxima aula será:

```text
455 - M15.45 - Fechamento do Modulo 15
```

Nela, todo o módulo será encerrado formalmente com mapa de competências, entregáveis, revisão de progresso, pendências, próximos passos e ponte para o Módulo 16.

---

## Onde estamos na formação

A sequência oficial é:

```text
452:
Prova pratica seguranca.

453:
Refatoracao final seguranca.

454:
Aula ensinavel seguranca.

455:
Fechamento do Modulo 15.

456:
Integracoes HTTP entre sistemas.
```

A prova prática respondeu:

```text
você consegue reconhecer
e corrigir regressões?
```

A refatoração respondeu:

```text
você consegue melhorar
o design sem perder
as garantias?
```

A aula ensinável responderá:

```text
você consegue explicar
essas garantias
para outra pessoa?
```

Nesta aula:

```text
novo controle técnico:
não.

nova feature:
não.

nova migration:
não.

organização pedagógica:
sim.

demonstração:
sim.

exercício:
sim.

rubrica:
sim.

feedback:
sim.

fechamento do módulo:
próxima aula.
```

A regra central será:

```text
quem consegue ensinar
precisa tornar visível
o raciocínio,
não apenas o resultado.
```

---

## Objetivo prático

Ao final da aula, você terá criado:

```text
docs/teaching/
├── M15_AULA_ENSINAVEL_SEGURANCA.md
├── M15_ROTEIRO_DO_INSTRUTOR.md
├── M15_EXERCICIO_DO_ALUNO.md
├── M15_GABARITO_DO_INSTRUTOR.md
└── M15_RUBRICA_DE_AVALIACAO.md
```

Também terá:

```text
uma sequência de demonstração;

uma lista de perguntas;

um exercício prático;

um gabarito;

uma rubrica de 100 pontos;

um plano de feedback;

um plano de contingência
para a demonstração.
```

Você irá:

1. definir o público;
2. definir pré-requisitos;
3. definir objetivo observável;
4. escolher um cenário;
5. escolher ameaças;
6. construir a narrativa;
7. reduzir o código;
8. preparar a demonstração;
9. preparar analogias;
10. preparar perguntas;
11. preparar checkpoints;
12. criar exercício;
13. criar gabarito;
14. criar rubrica;
15. criar feedback;
16. criar plano B;
17. ensaiar a aula;
18. revisar tempo;
19. avaliar clareza;
20. preparar o fechamento do módulo.

---

## Conceito essencial

### Ensinar não é despejar conteúdo

Uma aula eficaz não tenta reproduzir todas as páginas do módulo.

Ela seleciona um objetivo.

Objetivo ruim:

```text
entender segurança.
```

Objetivo melhor:

```text
ao final,
o aluno será capaz de
proteger um endpoint
com JWT,
permission,
tenant,
DTO allowlist
e testes negativos.
```

O objetivo precisa ser observável.

---

### Público-alvo

O conteúdo depende do público.

Para esta aula, considere alguém que já sabe:

- criar projeto Spring Boot;
- criar controller;
- criar service;
- usar JPA;
- entender JSON;
- executar testes;
- usar Maven;
- compreender status HTTP básicos.

Não assuma conhecimento profundo de:

- Spring Security;
- JWT;
- OAuth;
- tenancy;
- threat model;
- rate limiting;
- supply chain.

---

### Conhecimento prévio

Antes da aula, envie uma preparação curta:

```text
revisar:
HTTP 401, 403 e 404;

executar:
java --version;

executar:
.\mvnw.cmd test;

ler:
estrutura básica
de uma API Spring Boot.
```

Evite exigir leitura longa antes da primeira explicação.

---

### Cenário central

O cenário será uma solicitação de acesso.

Um requester cria:

```text
POST /api/v1/access-requests
```

Um reviewer decide:

```text
POST /api/v1/access-requests/{id}/decision
```

A ameaça será apresentada antes do controle.

Exemplos:

```text
token de outro sistema;

tenant forjado;

requester aprovando
a própria solicitação;

status enviado pelo body;

recurso de outro owner;

token aparecendo no log.
```

O aluno precisa entender por que o código existe.

---

### Narrativa por camadas

A aula seguirá esta sequência:

```text
1. Quem está chamando?

2. O token é destinado
   a esta API?

3. A identidade existe
   localmente?

4. A pessoa pertence
   ao tenant?

5. Ela possui permission?

6. O recurso está visível?

7. O estado permite a ação?

8. O input contém
   apenas campos permitidos?

9. A decisão foi auditada?

10. O teste prova
    que o abuso falha?
```

Essa sequência é mais memorável que uma lista de annotations.

---

### Analogia da portaria

Use analogias com cuidado.

Analogia:

```text
JWT:
crachá emitido.

issuer:
quem emitiu o crachá.

audience:
qual prédio aceita o crachá.

subject:
identidade no crachá.

permission:
sala que pode acessar.

tenant:
empresa ou andar autorizado.

ownership:
armário específico
que pertence à pessoa.
```

Limite da analogia:

```text
JWT não é apenas um crachá;

ele possui assinatura,
claims,
expiração
e validações criptográficas.
```

Toda analogia deve declarar seus limites.

---

### Autenticação versus autorização

Pergunta para a turma:

```text
um usuário autenticado
pode executar qualquer ação?
```

Resposta:

```text
não.
```

Autenticação:

```text
quem é?
```

Autorização:

```text
pode fazer o quê,
onde,
sobre qual recurso,
em qual estado?
```

Demonstração:

```text
ROLE_REVIEWER
sem access-request:review
retorna 403.
```

---

### Access token versus ID Token

Pergunta:

```text
qual token vai para a API?
```

Resposta:

```text
access token.
```

Explique:

```text
access token:
destinado ao resource server.

ID Token:
destinado ao client
para identidade.
```

Demonstração:

- access token válido retorna sucesso;
- token com audience errada retorna `401`;
- ID Token retorna `401`.

---

### Tenant como fronteira

Pergunta:

```text
enviar X-Tenant-Id
prova que a pessoa
pertence ao tenant?
```

Resposta:

```text
não.
```

Explique o fluxo:

```text
JWT;

identidade local;

memberships;

selector;

TenantContext;

query tenant-scoped.
```

O header é apenas selector.

---

### Ownership

Demonstre:

```text
findById(id)
```

versus:

```text
findByIdAndTenantIdAndRequesterUserId(
    id,
    tenant,
    requester
)
```

Pergunte:

```text
qual consulta reduz
a possibilidade de enumeração?
```

A segunda.

---

### Permission e Method Security

Exemplo:

```java
@PreAuthorize(
    "hasAuthority('access-request:review')"
)
```

Explique:

- protege chamada pelo controller;
- protege chamada por outro entry point;
- depende do bean proxied;
- não substitui policy de tenant, ownership ou estado.

---

### Regra de negócio

Demonstre:

```text
reviewer possui permission;

mas reviewer == requester.
```

Resultado:

```text
403 self_review_forbidden.
```

A permission permite tentar a operação.

A policy de negócio decide se o contexto é válido.

---

### DTO allowlist

Mostre um DTO inseguro:

```java
public record DecisionRequest(
        UUID tenantId,
        UUID reviewerUserId,
        String status,
        long version
) {
}
```

Depois mostre:

```java
public record DecisionRequest(
        @NotNull
        AccessRequestDecision decision,

        @Size(
            max = 500
        )
        String reason
) {
}
```

Pergunte:

```text
quem define tenant,
reviewer,
status e version?
```

Resposta:

```text
o servidor,
a identidade,
o TenantContext,
o aggregate
e o If-Match.
```

---

### Unknown fields

Payload:

```json
{
  "decision": "APPROVE",
  "status": "APPROVED",
  "tenantId": "forjado"
}
```

Contrato:

```text
400 unknown_request_property.
```

Mesmo se os campos forem ignorados e não alterarem o banco, aceitar o contrato é um problema.

---

### 401, 403 e 404

Crie um quadro:

```text
401:
não autenticado
ou token inválido.

403:
autenticado,
mas sem permission
ou contexto negado.

404:
recurso inexistente
ou oculto.
```

Demonstrações:

- sem token;
- requester tentando review;
- requester lendo recurso de outro tenant.

---

### Logs e auditoria

Pergunta:

```text
para diagnosticar,
precisamos logar
o token e o body?
```

Resposta:

```text
não.
```

Log técnico:

```text
event;

outcome;

route;

correlation;

reason code.
```

Audit:

```text
actor;

tenant;

target;

action;

before;

after;

outcome;

correlation.
```

Nenhum deles precisa de:

- token;
- password;
- justification;
- reason completo;
- body.

---

### Teste negativo

Um teste de segurança precisa provar:

```text
o abuso foi rejeitado;

o contrato é seguro;

nenhum side effect ocorreu;

nenhum dado vazou.
```

Exemplo:

```java
mockMvc.perform(
        post(
            "/api/v1/access-requests/{id}/decision",
            requestId
        )
        .with(
            jwtWithoutReviewPermission()
        )
        .header(
            HttpHeaders.IF_MATCH,
            "\"0\""
        )
        .contentType(
            MediaType.APPLICATION_JSON
        )
        .content(
            validApproveBody()
        )
)
.andExpect(
    status().isForbidden()
);

assertThat(
    repository.findById(
        requestId
    )
    .orElseThrow()
    .getStatus()
)
.isEqualTo(
    AccessRequestStatus.PENDING
);

assertThat(
    auditRepository.countSuccessFor(
        requestId
    )
)
.isZero();
```

---

### Ordem da demonstração

Não comece com todos os controles ativos.

Use três estados didáticos.

Estado 1:

```text
endpoint apenas autenticado.
```

Mostre o abuso.

Estado 2:

```text
permission adicionada.
```

Mostre que ainda existe cross-tenant ou self-review.

Estado 3:

```text
permission,
tenant,
policy,
DTO,
audit
e testes.
```

A evolução ajuda o aluno a compreender por que uma annotation isolada é insuficiente.

---

### Live coding com segurança

Live coding deve ser curto.

Prepare commits:

```text
demo/01-authentication-only;

demo/02-permission;

demo/03-tenant-policy;

demo/04-dto-tests.
```

O instrutor pode avançar entre commits se o tempo apertar.

Não dependa de digitar cinquenta linhas sem erro.

---

### Plano B

Se Docker, PostgreSQL, Redis ou Keycloak falharem:

- use tests já preparados;
- use output capturado;
- use fixtures locais;
- explique a falha;
- não desabilite controles;
- não mude para H2 para fingir equivalência;
- não use token real.

Plano B precisa preservar a verdade técnica.

---

### Perguntas de sondagem

Perguntas antes da explicação:

```text
CORS impede Postman?

um JWT assinado
sempre é válido?

ROLE_ADMIN
pode fazer tudo?

X-Tenant-Id
é autorização?

WRITE_ONLY
impede logs?

backup prova restore?
```

As respostas revelam modelos mentais incorretos.

---

### Feedback

Feedback eficaz:

```text
específico;

baseado em evidência;

ligado ao objetivo;

orientado à próxima ação.
```

Exemplo ruim:

```text
você precisa estudar mais.
```

Exemplo melhor:

```text
o teste validou 403,
mas não verificou
que o status permaneceu PENDING.

adicione a asserção
de ausência de mutação.
```

---

## Mão na massa guiada

### 1. Criar o material principal

Arquivo:

```text
docs/teaching/
M15_AULA_ENSINAVEL_SEGURANCA.md
```

Estrutura:

```markdown
# Como proteger uma API Spring Boot

## Público-alvo

## Pré-requisitos

## Objetivo

## Cenário

## Ameaças

## Fluxo da request

## Demonstração

## Exercício

## Revisão

## Avaliação
```

---

### 2. Definir objetivo observável

Use:

```text
ao final da aula,
o aluno será capaz de
proteger um endpoint de decisão
com JWT validado,
permission explícita,
tenant e segregation of duties,
DTO allowlist,
auditoria segura
e testes negativos.
```

Não use verbos vagos como:

```text
conhecer;

entender;

ver.
```

Quando usados, associe uma ação observável.

---

### 3. Definir pré-requisitos

Inclua:

- Java 21;
- Maven Wrapper;
- IDE;
- Spring Boot básico;
- HTTP;
- JSON;
- JUnit;
- Docker opcional para demonstração completa.

Entregue os comandos de validação:

```powershell
java --version
.\mvnw.cmd --version
docker version
```

---

### 4. Criar roteiro do instrutor

Arquivo:

```text
M15_ROTEIRO_DO_INSTRUTOR.md
```

Tabela:

| Tempo | Bloco | Ação | Pergunta | Evidência |
|---:|---|---|---|---|
| 0–10 | ameaça | mostrar endpoint inseguro | autenticado basta? | abuso reproduzido |
| 10–25 | JWT | validar token | ID Token serve? | `401` |
| 25–40 | authz | permission e tenant | header prova acesso? | `403/404` |
| 40–55 | input | DTO allowlist | quem define status? | `400` |
| 55–65 | observabilidade | log e audit | precisamos do body? | sentinela ausente |
| 65–80 | testes | negative tests | houve mutação? | repository |
| 80–90 | exercício | correção | qual risco resta? | rubrica |

---

### 5. Preparar a abertura

Comece com um endpoint inseguro:

```java
@PostMapping(
    "/{id}/decision"
)
AccessRequest decide(
        @PathVariable UUID id,
        @RequestBody Map<String, Object> body
) {
    return service.update(
        id,
        body
    );
}
```

Pergunte:

```text
quantas fronteiras
de segurança estão ausentes?
```

Não forneça a resposta imediatamente.

---

### 6. Criar o mapa da request

Use:

```text
Client
  |
  v
Tomcat / hardening
  |
  v
SecurityFilterChain
  |
  v
JWT validation
  |
  v
Local identity
  |
  v
TenantContext
  |
  v
Method Security
  |
  v
Repository scoped
  |
  v
Domain policy
  |
  v
Audit + response
```

Peça que o aluno identifique onde cada falha deve ser tratada.

---

### 7. Preparar demonstração JWT

Tenha três tokens sintéticos:

```text
valid access token;

wrong audience token;

ID Token.
```

Não mostre token completo na tela.

Mostre apenas:

- tipo do cenário;
- status;
- code;
- trecho seguro de claims quando necessário.

---

### 8. Preparar demonstração de permission

Cenários:

```text
ROLE_REVIEWER
sem permission;

permission correta;

authority semelhante.
```

Resultados:

```text
403;

sucesso condicionado
às demais regras;

403.
```

---

### 9. Preparar demonstração de tenant

Fixtures:

```text
Tenant Alpha;

Tenant Beta;

Requester Alpha;

Reviewer Alpha;

Reviewer Beta.
```

Demonstre:

- Alpha review em Alpha;
- Beta tentando recurso Alpha;
- selector sem membership;
- recurso inexistente.

---

### 10. Preparar demonstração de SoD

Crie solicitação do próprio reviewer.

Execute decisão.

Esperado:

```text
403 self_review_forbidden;

status PENDING;

audit success ausente.
```

Pergunte:

```text
por que excluir da fila
não é suficiente?
```

---

### 11. Preparar demonstração de DTO

Mostre body malicioso.

Resultado:

```text
400 unknown_request_property.
```

Depois mostre o request DTO mínimo e o command.

---

### 12. Preparar demonstração de If-Match

Cenários:

```text
sem header:
428.

stale:
412.

race real:
409.
```

Explique que precondition e optimistic locking resolvem problemas relacionados, mas diferentes.

---

### 13. Preparar demonstração de logs

Use sentinelas:

```text
token-teaching-sentinel;

reason-teaching-sentinel;

justification-teaching-sentinel.
```

Execute o fluxo.

Mostre o test que garante ausência.

Não exiba log real contendo secret.

---

### 14. Preparar demonstração de audit

Mostre um evento:

```json
{
  "action": "ACCESS_REQUEST_APPROVED",
  "outcome": "SUCCESS",
  "beforeStatus": "PENDING",
  "afterStatus": "APPROVED",
  "correlationId": "corr-demo-001"
}
```

Explique por que não há reason completo.

---

### 15. Criar exercício do aluno

Arquivo:

```text
M15_EXERCICIO_DO_ALUNO.md
```

Cenário:

```text
foi criado um endpoint
de cancelamento
que recebe tenantId,
ownerUserId,
status e version no body.
```

O aluno deve:

1. listar cinco ameaças;
2. criar DTO seguro;
3. definir permission;
4. definir regra de ownership;
5. definir contrato de `401`, `403` e `404`;
6. exigir `If-Match`;
7. criar dois testes negativos;
8. definir audit mínimo;
9. definir log seguro;
10. decidir se o endpoint está pronto.

---

### 16. Criar starter code

Forneça:

```java
public record CancelAccessRequestRequest(
        UUID tenantId,
        UUID ownerUserId,
        String status,
        long version,
        String reason
) {
}
```

E:

```java
@Transactional
public AccessRequest cancel(
        UUID id,
        CancelAccessRequestRequest request
) {
    AccessRequest entity =
            repository.findById(
                    id
            )
            .orElseThrow();

    entity.setStatus(
            AccessRequestStatus.CANCELED
    );

    return entity;
}
```

O aluno precisa corrigir o design.

---

### 17. Criar gabarito do instrutor

Arquivo:

```text
M15_GABARITO_DO_INSTRUTOR.md
```

Inclua uma solução possível.

Não trate como única implementação aceita.

Elementos obrigatórios:

- actor autenticado;
- tenant validado;
- permission `access-request:cancel`;
- requester owner;
- status permitido;
- DTO somente com reason;
- version em `If-Match`;
- response DTO;
- audit;
- negative tests.

---

### 18. Criar rubrica

Arquivo:

```text
M15_RUBRICA_DE_AVALIACAO.md
```

Pontuação:

| Critério | Pontos |
|---|---:|
| Identificação de ameaças | 15 |
| Autenticação e permission | 15 |
| Tenant e ownership | 20 |
| DTO e domínio | 15 |
| ETag e concorrência | 10 |
| Logs e audit | 10 |
| Testes negativos | 10 |
| Decisão e explicação | 5 |
| **Total** | **100** |

Blockers:

- cross-tenant;
- owner vindo do body;
- token em log;
- entity response;
- ausência de permission;
- status arbitrário;
- teste sem side effects.

---

### 19. Criar perguntas intermediárias

Após JWT:

```text
o token está assinado.
o que ainda falta validar?
```

Após permission:

```text
a permission permite
qualquer recurso?
```

Após tenant:

```text
o header cria membership?
```

Após DTO:

```text
ignorar status
é tão seguro quanto rejeitar?
```

Após teste:

```text
403 prova
que nada mudou?
```

---

### 20. Criar mini-checkpoints

Checkpoint 1:

```text
aluno explica 401.
```

Checkpoint 2:

```text
aluno diferencia
permission e ownership.
```

Checkpoint 3:

```text
aluno remove
campos server-controlled.
```

Checkpoint 4:

```text
aluno escreve
asserção de side effect.
```

---

### 21. Criar erros intencionais

Prepare exemplos com:

- `permitAll`;
- role sem permission;
- `findById`;
- entity no `@RequestBody`;
- `Map<String,Object>`;
- token no log;
- Redis fail-open;
- audit payload.

Peça que os alunos classifiquem o risco.

---

### 22. Ensaiar a demonstração

Execute do zero.

Registre:

- tempo;
- comandos;
- falhas;
- dependências;
- pontos de espera;
- perguntas;
- transições.

Reduza passos que não contribuem para o objetivo.

---

### 23. Criar plano B técnico

Se Keycloak falhar:

```text
use JwtTestTokenFactory
e MockMvc.
```

Se PostgreSQL falhar:

```text
use report de integration test,
sem trocar por H2
como prova equivalente.
```

Se Redis falhar:

```text
demonstre o 503 esperado.
```

Se internet falhar:

```text
use referências já preparadas.
```

---

### 24. Criar ambiente limpo

Antes da aula:

```powershell
git status
docker compose ps
.\mvnw.cmd test
```

Use branch de demonstração.

Não faça demonstração sobre código não commitado sem backup.

---

### 25. Criar versão curta

Prepare uma versão de trinta minutos.

Escopo:

```text
JWT;

permission;

tenant;

DTO;

negative test.
```

Use caso a agenda seja reduzida.

Não tente comprimir todos os temas.

---

### 26. Criar versão sem live coding

Prepare:

- diff antes/depois;
- tests;
- outputs;
- diagramas;
- perguntas;
- exercício.

A aprendizagem não deve depender de digitação ao vivo.

---

### 27. Simular aluno iniciante

Revise palavras como:

- issuer;
- audience;
- principal;
- authority;
- tenant;
- ownership;
- precondition;
- side effect.

Defina cada termo antes de usá-lo como pressuposto.

---

### 28. Simular aluno experiente

Prepare perguntas de aprofundamento:

```text
por que 404
e não 403?

por que Method Security
se o controller já protege?

por que If-Match
e @Version?

por que audit
na mesma transação?

por que Redis fail-closed?
```

---

### 29. Criar feedback por nível

Iniciante:

```text
corrigir conceito central.
```

Intermediário:

```text
melhorar boundary
e test coverage.
```

Avançado:

```text
avaliar trade-offs,
failure modes
e risco residual.
```

---

### 30. Criar autoavaliação do instrutor

Após a aula, responda:

- o objetivo foi alcançado;
- o tempo foi adequado;
- quais perguntas revelaram dúvidas;
- qual demonstração falhou;
- quais termos ficaram vagos;
- o exercício mediu o objetivo;
- a rubrica foi aplicável;
- o que deve mudar na próxima edição.

---

### 31. Criar teste do material

Crie:

```text
TeachingMaterialPolicyTest.
```

Valide que existem:

- objetivo;
- público;
- pré-requisitos;
- cenário;
- threats;
- demo;
- exercício;
- gabarito;
- rubrica;
- blockers;
- feedback;
- plano B.

O teste não avalia qualidade pedagógica sozinho.

Ele evita omissões estruturais.

---

### 32. Criar teste de consistência técnica

Crie:

```text
TeachingSecurityConsistencyTest.
```

Valide que o material não ensina:

- ID Token na API;
- tenant pelo body;
- role como permission universal;
- `findById` global;
- entity como DTO;
- token em log;
- fail-open em review;
- `GO_PUBLIC`.

---

### 33. Executar a aula simulada

Faça uma apresentação sem público.

Grave apenas se permitido.

Marque o tempo de cada bloco.

Se ultrapassar noventa minutos, corte conteúdo secundário.

---

### 34. Executar peer review

Peça que outra pessoa avalie:

- clareza;
- sequência;
- exemplos;
- ritmo;
- exercício;
- rubrica;
- precisão;
- segurança do material.

Registre feedback, não dados pessoais do reviewer.

---

### 35. Atualizar o material

Classifique feedback:

```text
correção técnica;

clareza;

tempo;

exemplo;

exercício;

avaliação.
```

Priorize correções técnicas.

---

### 36. Executar testes do projeto

```powershell
.\mvnw.cmd `
  -Dtest=TeachingMaterialPolicyTest,TeachingSecurityConsistencyTest `
  test
```

Depois:

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

O material não pode contradizer o código e as invariantes.

---

### 37. Executar gate completo

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Ensinar não permite desativar o gate.

---

### 38. Criar evidência da aula

Arquivo:

```text
docs/teaching/
M15_AULA_ENSINAVEL_EVIDENCIAS.md
```

Inclua:

- objetivo;
- duração ensaiada;
- commit;
- tests;
- feedback;
- ajustes;
- blockers;
- versão final;
- data de revisão.

---

### 39. Definir critério de aprovação

A aula é considerada ensinável quando:

- objetivo é observável;
- cenário é coerente;
- threats aparecem antes dos controls;
- demo funciona;
- exercício mede o objetivo;
- gabarito explica o raciocínio;
- rubrica diferencia níveis;
- material não contém regressões técnicas;
- tempo cabe;
- plano B existe.

---

### 40. Preparar a ponte final

O fechamento do módulo usará os materiais criados nesta aula para demonstrar:

- conhecimento técnico;
- capacidade de diagnóstico;
- capacidade de refatoração;
- capacidade de comunicação;
- capacidade de mentoria.

---

## Entendendo o que foi feito

### O módulo ganhou uma narrativa

Os controles deixaram de aparecer como tópicos soltos.

### O objetivo ficou observável

O aluno precisa proteger um endpoint e provar a proteção.

### A ameaça veio antes do código

O controle passou a ter motivo.

### A demonstração ganhou progressão

Autenticação isolada mostrou seus limites antes da solução completa.

### A prática ganhou rubrica

O exercício deixou de ser apenas “faça funcionar”.

### O feedback passou a apontar evidências

Status, side effects e contratos orientam a correção.

### O instrutor ganhou plano B

A aula não depende de uma infraestrutura perfeita.

### O conteúdo foi protegido por testes

O material não pode ensinar regressões já removidas do projeto.

---

## Erros comuns importantes

### Tentar ensinar todo o módulo

O aluno recebe volume, mas não constrói um modelo mental.

### Começar por annotations

A ameaça e a decisão ficam invisíveis.

### Usar analogia sem limite

O aluno pode aplicar a comparação além do ponto correto.

### Fazer live coding longo

Erros de digitação consomem a aula.

### Demonstrar apenas happy path

O objetivo de segurança não é comprovado.

### Entregar exercício sem rubrica

Aluno e instrutor não sabem o que caracteriza uma boa solução.

### Mostrar tokens reais

A própria aula cria um incidente.

### Simplificar tenant como header

O material ensina uma vulnerabilidade.

### Trocar PostgreSQL por H2 sem explicar

A evidência deixa de representar a integração real.

### Dar feedback genérico

O aluno não sabe qual próxima ação executar.

---

## Comandos úteis

### Testar material

```powershell
.\mvnw.cmd `
  -Dtest=TeachingMaterialPolicyTest,TeachingSecurityConsistencyTest `
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

### Validar ambiente

```powershell
java --version
.\mvnw.cmd --version
docker compose ps
git status
```

### Procurar regressões no material

```powershell
git grep `
  -n `
  -E `
  "ID Token.*API|tenantId.*Request|findById\\(|log.*token|GO_PUBLIC"
```

---

## Exercício guiado

### Parte 1 — Público

Defina para quem a aula será ministrada.

### Parte 2 — Objetivo

Escreva um resultado observável.

### Parte 3 — Cenário

Escolha uma request protegida.

### Parte 4 — Ameaças

Apresente abusos antes das soluções.

### Parte 5 — Demonstração

Mostre autenticação, autorização, tenant e DTO.

### Parte 6 — Observabilidade

Mostre logs e audit seguros.

### Parte 7 — Testes

Demonstre rejeição e ausência de side effects.

### Parte 8 — Exercício

Crie um cenário novo para o aluno.

### Parte 9 — Avaliação

Crie gabarito, rubrica e blockers.

### Parte 10 — Ensaio

Valide tempo, clareza e plano B.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a refatoração final foi preservada;
- público-alvo foi definido;
- pré-requisitos foram definidos;
- objetivo observável foi criado;
- cenário central utiliza a API segura;
- ameaças aparecem antes dos controles;
- narrativa acompanha o fluxo da request;
- autenticação e autorização foram diferenciadas;
- access token e ID Token foram diferenciados;
- tenant foi ensinado como membership validada;
- permission, ownership e SoD foram separados;
- DTO allowlist e unknown fields foram demonstrados;
- `401`, `403` e `404` foram ensinados;
- If-Match e optimistic locking foram diferenciados;
- logs e audit foram tratados sem payload;
- negative tests verificam side effects;
- roteiro de noventa minutos foi criado;
- versão curta foi criada;
- demonstração possui commits ou checkpoints;
- perguntas de sondagem foram criadas;
- mini-checkpoints foram criados;
- exercício do aluno foi criado;
- starter code inseguro foi criado;
- gabarito do instrutor foi criado;
- rubrica de 100 pontos foi criada;
- blockers foram definidos;
- feedback por evidência foi criado;
- plano B técnico foi criado;
- autoavaliação do instrutor foi criada;
- policy test do material foi criado;
- consistency test foi criado;
- peer review foi planejado;
- evidências da aula foram registradas;
- conteúdo não ensina regressões;
- gate de segurança permaneceu ativo;
- fechamento do módulo não foi antecipado;
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
  labs/m15/projeto-api-segura/docs/teaching `
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
git commit -m "docs(m15): criar aula ensinavel de seguranca"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- password;
- secret;
- gravação sem autorização;
- dados do reviewer;
- dump do Keycloak;
- ambiente local;
- `.env`;
- reports temporários;
- exemplo que ensina bypass.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o conhecimento técnico do Módulo 15 foi transformado em uma experiência de aprendizagem.

A aula criada possui:

```text
público;

pré-requisitos;

objetivo;

cenário;

ameaças;

narrativa;

demonstração;

perguntas;

checkpoints;

exercício;

gabarito;

rubrica;

feedback;

plano B.
```

O fluxo ensinado foi:

```text
request;

JWT;

identidade;

tenant;

permission;

resource;

policy;

DTO;

audit;

test.
```

A decisão central foi:

```text
ensinar segurança
não é apresentar
uma coleção de annotations;

é ajudar outra pessoa
a reconhecer ameaças,
localizar fronteiras,
escolher controles
e provar o comportamento.
```

A aula também preservou uma regra importante:

```text
simplificar a explicação
não significa
simplificar incorretamente
o controle.
```

O aluno pode começar por um modelo reduzido.

Mas o material não pode ensinar:

- confiar no tenant header;
- aceitar ID Token na API;
- usar role como permissão universal;
- retornar entity;
- logar token;
- ignorar unknown fields;
- falhar aberto em ação sensível.

A próxima aula será:

```text
455 - M15.45 - Fechamento do Modulo 15
```

Nela, você irá:

- revisar todas as competências do módulo;
- consolidar entregáveis;
- atualizar o mapa de progresso;
- registrar pontos fortes;
- registrar gaps;
- definir revisão futura;
- encerrar formalmente o projeto de segurança;
- preparar a transição para integrações HTTP entre sistemas.

---

# Material complementar

## Checkpoint final

- [ ] Transformei o módulo em uma narrativa ensinável.
- [ ] Criei demonstração, exercício e rubrica.
- [ ] Preparei perguntas, feedback e plano B.
- [ ] Testei a consistência técnica do material.
- [ ] Preparei a ponte para o fechamento do módulo.

---

## Troubleshooting adicional

### A aula ultrapassa noventa minutos

Corte temas secundários e preserve o objetivo central.

### O público não entende JWT

Retorne ao fluxo de issuer, audience e access token antes de mostrar código.

### O exercício ficou simples demais

Adicione cross-tenant, side effects e audit.

### O exercício ficou grande demais

Reduza para uma única operação e dois testes negativos.

### O live coding falhou

Use commits preparados e explique o diff.

### O aluno pergunta sobre produção

Diferencie laboratório, ambiente controlado e produção pública.

### A analogia gera confusão

Declare onde a analogia deixa de representar o sistema.

### O material ensina um atalho inseguro

Corrija imediatamente e adicione consistency test.

---

## Perguntas de revisão

1. Qual é o objetivo observável da aula?
2. Quem é o público-alvo?
3. Por que ameaças vêm antes dos controles?
4. Crachá representa perfeitamente JWT?
5. Access token e ID Token são iguais?
6. Tenant header prova membership?
7. Role substitui permission?
8. Permission substitui ownership?
9. Por que excluir self-review da fila não basta?
10. Quem define status?
11. Quem define version?
12. Unknown field pode ser ignorado?
13. O que um teste negativo precisa provar?
14. Log e audit são iguais?
15. Por que usar sentinelas?
16. Para que serve a rubrica?
17. O que é um blocker?
18. Para que serve o plano B?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Proteger um endpoint e comprovar.
2. Java Backend com Spring básico.
3. Para dar motivo ao controle.
4. Não.
5. Não.
6. Não.
7. Não.
8. Não.
9. Porque o endpoint direto continua possível.
10. O servidor e o aggregate.
11. O ETag e o servidor.
12. Não.
13. Rejeição, contrato, side effects e vazamento.
14. Não.
15. Para detectar vazamento.
16. Avaliar com critérios explícitos.
17. Falha que impede aprovação.
18. Preservar a aula quando a demo falha.
19. Fechamento do Modulo 15.
20. Consolidar competências e transição.

---

## Desafio opcional

Ministre a aula para uma pessoa ou pequeno grupo.

Depois, produza um relatório com:

```text
dúvidas levantadas;

erros de entendimento;

tempo real;

exercício concluído;

pontos da rubrica;

feedback recebido;

mudanças propostas.
```

Não registre dados pessoais desnecessários.

Use o feedback para criar uma versão 2 do material.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 454 - M15.44 - Aula ensinavel seguranca

- Transformei o conhecimento do Módulo 15 em uma aula ensinável.
- Defini o público-alvo.
- Defini pré-requisitos.
- Criei um objetivo observável.
- Escolhi o cenário de solicitações de acesso.
- Organizei ameaças antes dos controles.
- Criei a narrativa pelo fluxo da request.
- Criei analogias e registrei seus limites.
- Diferenciei autenticação e autorização.
- Diferenciei access token e ID Token.
- Ensinei tenant como membership validada.
- Separei permission, ownership e segregation of duties.
- Demonstrei DTO allowlist e unknown fields.
- Demonstrei `401`, `403` e `404`.
- Diferenciei If-Match e optimistic locking.
- Demonstrei logs e audit seguros.
- Demonstrei negative tests e side effects.
- Criei `M15_AULA_ENSINAVEL_SEGURANCA.md`.
- Criei `M15_ROTEIRO_DO_INSTRUTOR.md`.
- Criei `M15_EXERCICIO_DO_ALUNO.md`.
- Criei starter code inseguro.
- Criei `M15_GABARITO_DO_INSTRUTOR.md`.
- Criei `M15_RUBRICA_DE_AVALIACAO.md`.
- Criei rubrica de 100 pontos.
- Defini blockers.
- Criei perguntas de sondagem.
- Criei mini-checkpoints.
- Criei feedback por nível.
- Preparei uma versão de noventa minutos.
- Preparei uma versão de trinta minutos.
- Preparei uma versão sem live coding.
- Criei plano B para Keycloak, PostgreSQL e Redis.
- Criei autoavaliação do instrutor.
- Planejei peer review.
- Criei `TeachingMaterialPolicyTest`.
- Criei `TeachingSecurityConsistencyTest`.
- Criei `M15_AULA_ENSINAVEL_EVIDENCIAS.md`.
- Mantive o gate de segurança ativo.
- Mantive `GO_CONTROLLED`.
- Mantive `NO_GO_PUBLIC`.
- Próxima aula: Fechamento do Modulo 15.
```

---

## Referência técnica curta

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [Spring Security — Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Bloom’s Taxonomy — Vanderbilt University](https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/)
- [The Learning Scientists — Retrieval Practice](https://www.learningscientists.org/retrieval-practice)
- [Martin Fowler — Presentation Patterns](https://martinfowler.com/articles/preparation.html)

Regra final:

```text
uma aula ensinável de segurança precisa transformar controles técnicos em uma sequência pedagógica observável: o público e os pré-requisitos são explícitos, ameaças aparecem antes das soluções, a demonstração acompanha o fluxo da request, analogias possuem limites, autenticação, tenant, permission, ownership, DTOs, audit e testes são conectados, o exercício mede a capacidade de impedir abusos e comprovar side effects, a rubrica torna a avaliação objetiva e o plano B preserva a verdade técnica mesmo quando a infraestrutura da demonstração falha.
```
