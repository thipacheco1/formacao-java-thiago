# 446 - M15.36 - Checklist seguranca em PR

## Apresentação da aula

Na aula 445, a API recebeu uma baseline explícita de hardening.

A superfície passou a ser limitada por:

```text
métodos HTTP permitidos;

media types permitidos;

tamanho de headers;

tamanho real do body;

quantidade de parâmetros;

paginações e sorts aprovados;

conexões e filas finitas;

timeouts;

exposição mínima do Actuator;

cookies seguros no fluxo OIDC;

profiles produtivos validados.
```

A aplicação também passou a rejeitar:

- `TRACE` e `CONNECT`;
- XML e media types não previstos;
- bodies acima do limite;
- forwarded headers não confiáveis;
- parâmetros e ordenações fora da allowlist;
- configuração produtiva com exposure ampla;
- detalhes internos em páginas de erro.

Esses controles foram implementados em código, configuração, testes e documentação.

Porém, o sistema continuará evoluindo.

Novos pull requests poderão:

- criar endpoints;
- alterar DTOs;
- mudar permissions;
- adicionar roles;
- modificar queries;
- adicionar migrations;
- mudar logs;
- atualizar dependências;
- ativar features;
- alterar secrets;
- mudar cookies;
- modificar o Actuator;
- ampliar limites;
- criar integrações externas;
- introduzir uploads;
- alterar tratamento de dados pessoais.

A pergunta central desta aula será:

```text
como impedir que uma mudança
passe pelo code review
sem revisar os riscos
que ela realmente introduz?
```

Um checklist de segurança ruim é apenas uma lista extensa de caixas.

Exemplo:

```text
[ ] Segurança revisada.
[ ] Testes executados.
[ ] Logs revisados.
```

Esse formato não informa:

- qual risco mudou;
- qual ameaça foi considerada;
- qual evidência existe;
- quem aprovou;
- qual exceção foi aberta;
- quando a exceção expira;
- quais testes negativos foram executados;
- qual rollback está disponível.

A aula transformará o checklist em um pequeno processo de engenharia.

O fluxo será:

```text
mudança;

classificação;

itens obrigatórios;

evidências;

reviewers;

gates;

decisão;

exceções;

merge.
```

A classificação inicial utilizará quatro níveis:

```text
LOW;

MEDIUM;

HIGH;

CRITICAL.
```

Exemplos: documentação tende a LOW; contrato limitado a MEDIUM; endpoint, migration, integração, log ou dependência de runtime a HIGH; token, permissions, criptografia, bypass, dado sensível ou desativação de controles a CRITICAL.

A classificação não será escolhida somente pelo autor.

Ela será calculada por regras de path e confirmada no review.

A prática criará:

```text
.github/
├── pull_request_template.md
└── SECURITY_REVIEW_GUIDE.md
```

Também criará:

```text
security/
├── security-change-classification.yaml
├── security-pr-evidence-policy.yaml
├── security-pr-exception-register.yaml
└── security-review-ownership.yaml
```

A estrutura será protegida por policy tests de template, classificação, evidências, exceções e ownership.

O template de PR terá seções obrigatórias.

Exemplo:

```text
Resumo;

Tipo de mudança;

Classificação de risco;

Superfícies afetadas;

Ameaças e controles;

Testes negativos;

Dados e privacidade;

Dependências;

Configuração;

Evidências;

Rollback;

Exceções.
```

O autor não poderá marcar:

```text
não se aplica
```

sem explicar o motivo nos itens de risco alto.

O checklist não substitui review, testes, scanners, branch protection, threat model ou responsabilidade humana.

A próxima aula será:

```text
447 - M15.37 - Projeto API segura parte 1
```

Nela, os controles do módulo serão aplicados em um projeto prático guiado com definição de escopo, threat model, autenticação, autorização, DTOs, persistência e testes iniciais.

---

## Onde estamos na formação

A sequência oficial é:

```text
444:
Testes de autorizacao.

445:
Hardening de API.

446:
Checklist seguranca em PR.

447:
Projeto API segura parte 1.

448:
Projeto API segura parte 2.

449:
Projeto API segura parte 3.
```

A aula 445 respondeu:

```text
quais limites e superfícies
a API aceita?
```

A aula 446 responderá:

```text
como preservar esses controles
quando novos PRs alterarem
o sistema?
```

Nesta aula:

```text
template de PR:
sim.

classificação de risco:
sim.

owners:
sim.

evidências:
sim.

testes negativos:
sim.

exceções com prazo:
sim.

policy tests:
sim.

branch protection:
documentada.

projeto prático:
próxima aula.
```

A regra central será:

```text
review de segurança
precisa ser proporcional
ao risco da mudança
e baseado em evidências.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
.github/
├── pull_request_template.md
└── SECURITY_REVIEW_GUIDE.md
```

Configuração:

```text
security/
├── security-change-classification.yaml
├── security-pr-evidence-policy.yaml
├── security-pr-exception-register.yaml
└── security-review-ownership.yaml
```

Testes:

```text
src/test/java/br/com/formacao/backend/
└── security
    └── pullrequest
        ├── SecurityPullRequestTemplatePolicyTest.java
        ├── SecurityChangeClassificationPolicyTest.java
        ├── SecurityPrEvidencePolicyTest.java
        ├── SecurityPrExceptionRegisterTest.java
        └── SecurityReviewOwnershipPolicyTest.java
```

Documentação:

```text
docs/security/
├── M15_SECURITY_PR_CHECKLIST.md
├── M15_SECURITY_CHANGE_CLASSIFICATION.md
└── M15_SECURITY_EXCEPTION_PROCESS.md
```

Você irá:

1. definir o objetivo do checklist;
2. classificar mudanças;
3. mapear paths sensíveis;
4. definir owners;
5. criar template de PR;
6. exigir threat model quando necessário;
7. exigir testes negativos;
8. revisar autenticação;
9. revisar autorização;
10. revisar DTOs e logs;
11. revisar privacidade;
12. revisar migrations;
13. revisar dependências;
14. revisar hardening;
15. definir evidências;
16. definir rollback;
17. governar exceções;
18. criar policy tests;
19. definir gates;
20. preparar o projeto prático.

---

## Conceito essencial

### Checklist não é evidência

Marcar uma caixa não prova um controle. Evidências incluem testes, matriz atualizada, report de SCA, SBOM, migration revisada, contrato OpenAPI, comando reproduzível e decisão registrada.
### Classificação orienta profundidade

Mudanças simples não exigem o mesmo processo de identidade, autorização ou criptografia. A classificação reduz atrito em alterações de baixo risco e aumenta a revisão quando o impacto cresce.
### Classificação mínima automática

Paths e padrões definem um nível mínimo. O autor pode elevar a classificação, mas não reduzi-la sem exceção aprovada.
### Diff semântica

Paths não entendem o significado do código. Um response pode receber um status público ou um tenant ID; por isso, classificação automática é baseline e o reviewer confirma a semântica.
### Security owner

Security owner responde por uma superfície, como identidade, autorização, privacidade, plataforma, banco ou supply chain. Os IDs internos são mapeados para equipes reais pela governança do repositório.
### Separação de responsabilidades

Mudanças críticas exigem autor, reviewer técnico e owner da superfície; produto, privacidade, jurídico ou plataforma participam quando o impacto exigir.
### Evidência proporcional

LOW exige testes relevantes; MEDIUM adiciona impacto e rollback; HIGH exige ameaça, negativo, owner e gate; CRITICAL adiciona revisão, implantação, monitoramento e full gate.
### Autenticação no checklist

Mudanças de login, JWT, refresh, OIDC, Keycloak, sessão, cookies, PKCE, errors e rate limiting exigem revisão específica, não apenas um login bem-sucedido.
### Autorização no checklist

Todo endpoint novo revisa permission, role, Method Security, tenant, ownership, query, listagem, count, `403`, `404`, deny-by-default e auditoria.
### DTOs e contratos

Requests usam allowlist, responses são mínimas, entities não atravessam a API, unknown fields falham e contracts, PII, secrets, `toString`, errors e OpenAPI são revisados.
### Logs e auditoria

O review procura PII, secrets, IDs em labels, bodies no audit e novos events fora do catálogo. Log e audit continuam separados.
### Migrations

Migrations revisam lock, volume, defaults, nullability, índices, constraints, tenant, privacidade, backfill, compatibilidade e rollback ou forward-fix.
### Dependências

Mudanças no `pom.xml` exigem motivo, versão, transitivas, licenses, CVEs, tree, SBOM, SCA, release notes e compatibilidade.
### Configuração e hardening

Configuração pode alterar secrets, limits, Actuator, cookies, proxy, TLS, CORS, CSRF, headers, timeouts e fail-open ou fail-closed; qualquer redução de proteção eleva o risco.
### Testes negativos

Todo controle novo precisa de cenário proibido e verificação de side effects. Happy path sozinho não comprova segurança.
### Exceção

Exceções temporárias registram ID, controle, risco, razão, compensações, owner, approver, ticket, criação, expiração, correção e critério de fechamento.
### Itens não excepcionáveis

A baseline não permite exceção local para:

- secret real no Git;
- teste de segurança crítico desabilitado sem processo de emergência;
- management público com dados sensíveis;
- bypass de tenant;
- logs com password ou token;
- dependência KEV aceita sem aprovação de emergência;
- produção usando Keycloak `start-dev`;
- autenticação sem validação criptográfica;
- wildcard de autorização para endpoint sensível.

Esses casos exigem interrupção e escalonamento.

---

### Branch protection

O repositório deve exigir PR, status checks, reviewers, conversas resolvidas, proteção do branch e revalidação do commit final. O Markdown não substitui essas regras.
### Merge commit e evidência

Reports e aprovações precisam corresponder ao commit integrado. Novos commits após review exigem revalidação conforme a policy.
## Mão na massa guiada

### 1. Criar classificação de mudanças

Arquivo:

```text
security/security-change-classification.yaml
```

Conteúdo inicial:

```yaml
version: 1

levels:
  LOW: 1
  MEDIUM: 2
  HIGH: 3
  CRITICAL: 4

rules:
  - id: AUTHENTICATION
    minimumLevel: CRITICAL
    owners:
      - identity-security
    paths:
      - "src/main/**/security/login/**"
      - "src/main/**/security/jwt/**"
      - "src/main/**/security/refresh/**"
      - "src/main/**/oidc/**"

  - id: AUTHORIZATION
    minimumLevel: CRITICAL
    owners:
      - backend-security
    paths:
      - "src/main/**/authorization/**"
      - "src/main/**/SecurityConfiguration.java"
      - "security/authorization-test-matrix.yaml"

  - id: DATABASE
    minimumLevel: HIGH
    owners:
      - database-governance
    paths:
      - "src/main/resources/db/migration/**"

  - id: DEPENDENCIES
    minimumLevel: HIGH
    owners:
      - supply-chain
    paths:
      - "pom.xml"

  - id: DOCUMENTATION
    minimumLevel: LOW
    owners:
      - backend-platform
    paths:
      - "docs/**"
```

---

### 2. Adicionar regras de privacidade

```yaml
  - id: PRIVACY
    minimumLevel: HIGH
    owners:
      - data-privacy
    paths:
      - "src/main/**/privacy/**"
      - "docs/privacy/**"
      - "security/*privacy*"
```

Mudança que adiciona dado sensível deve ser elevada para `CRITICAL` durante o review.

---

### 3. Adicionar regras de hardening

```yaml
  - id: HARDENING
    minimumLevel: HIGH
    owners:
      - platform-security
    paths:
      - "src/main/resources/application*"
      - "src/main/**/hardening/**"
      - "compose.yaml"
      - "Dockerfile"
```

Não trate todo YAML como baixo risco.

---

### 4. Criar ownership interno

Arquivo:

```text
security/security-review-ownership.yaml
```

```yaml
version: 1

owners:
  backend-security:
    responsibilities:
      - authorization
      - tenant
      - ownership
      - API security tests

  identity-security:
    responsibilities:
      - login
      - JWT
      - OIDC
      - Keycloak
      - refresh token

  data-privacy:
    responsibilities:
      - personal data
      - retention
      - exports
      - data subject requests

  platform-security:
    responsibilities:
      - hardening
      - proxy
      - Actuator
      - container
      - secrets runtime

  supply-chain:
    responsibilities:
      - dependencies
      - SBOM
      - SCA
      - suppressions

  database-governance:
    responsibilities:
      - migrations
      - constraints
      - indexes
      - backfills
```

Cada owner precisa ter processo de substituição quando indisponível.

---

### 5. Criar o template de PR

Arquivo:

```text
.github/pull_request_template.md
```

Início:

```markdown
# Pull Request

## Resumo

Descreva a mudança e o motivo.

## Classificação de risco

- [ ] LOW
- [ ] MEDIUM
- [ ] HIGH
- [ ] CRITICAL

Nível mínimo calculado:
Motivo da classificação:
Superfícies afetadas:

## Threat model

Threat IDs afetadas:
Novas ameaças:
Controles adicionados ou alterados:
```

O texto orienta o autor sem aceitar campos vazios em risco alto.

---

### 6. Adicionar seção de autenticação

```markdown
## Autenticação e sessão

- [ ] Não altera autenticação.
- [ ] JWT, issuer, audience e assinatura foram revisados.
- [ ] Refresh, rotação e replay foram revisados.
- [ ] OIDC, redirect, state, nonce e PKCE foram revisados.
- [ ] Cookies e sessão foram revisados.
- [ ] Rate limiting foi revisado.

Evidências:
```

Marcar “não altera” precisa ser coerente com o diff.

---

### 7. Adicionar seção de autorização

```markdown
## Autorização

- [ ] Todo endpoint novo possui policy explícita.
- [ ] Method Security foi revisada.
- [ ] Permission e role foram separadas.
- [ ] Tenant e ownership foram revisados.
- [ ] `403` e `404` seguem o contrato.
- [ ] Listagem e count estão scoped.
- [ ] A matriz de autorização foi atualizada.

Evidências:
```

---

### 8. Adicionar seção de dados e DTOs

```markdown
## Dados, DTOs e privacidade

- [ ] Request DTO usa allowlist.
- [ ] Entity não é request ou response.
- [ ] Unknown fields continuam rejeitados.
- [ ] Campos pessoais foram inventariados.
- [ ] Retenção e finalidade foram avaliadas.
- [ ] Export, cache e backup foram avaliados.
- [ ] Secrets não atravessam DTOs.

Evidências:
```

---

### 9. Adicionar seção de logs

```markdown
## Logs, errors e auditoria

- [ ] Nenhum body completo é logado.
- [ ] Nenhuma password ou token é logada.
- [ ] PII não entrou no MDC ou métricas.
- [ ] Problem Details não expõe detalhes internos.
- [ ] Audit event contém somente metadata aprovada.
- [ ] Testes com sentinelas foram atualizados.

Evidências:
```

---

### 10. Adicionar seção de migrations

```markdown
## Banco e migrations

- [ ] Não altera schema.
- [ ] Migration é compatível com rolling deployment.
- [ ] Locks e duração foram avaliados.
- [ ] Nullability e defaults foram revisados.
- [ ] Tenant e dados pessoais foram revisados.
- [ ] Índices e constraints foram revisados.
- [ ] Rollback ou forward-fix foi documentado.

Evidências:
```

---

### 11. Adicionar seção de dependências

```markdown
## Dependências e supply chain

- [ ] Não adiciona dependência.
- [ ] Dependency tree foi revisada.
- [ ] SBOM foi gerada.
- [ ] SCA foi executada.
- [ ] CVEs, KEV e advisories foram avaliados.
- [ ] Licença e origem foram revisadas.
- [ ] Suppression não foi criada ou possui exceção aprovada.

Evidências:
```

---

### 12. Adicionar seção de hardening

```markdown
## Configuração e hardening

- [ ] Profiles foram revisados.
- [ ] Secrets não foram versionados.
- [ ] Limites, timeouts e filas foram revisados.
- [ ] Actuator permanece restrito.
- [ ] Proxy e forwarded headers foram revisados.
- [ ] CORS, CSRF e headers foram revisados.
- [ ] Cookies e TLS foram revisados.

Evidências:
```

---

### 13. Adicionar seção de testes

```markdown
## Testes de segurança

Testes positivos:
Testes negativos:
Side effects verificados:
Classes executadas:
Comando executado:
Resultado do gate:
```

Para `HIGH` e `CRITICAL`, “testes negativos” não pode ficar vazio.

---

### 14. Adicionar rollback

```markdown
## Implantação e rollback

Estratégia de implantação:
Sinais de falha:
Métricas e alertas:
Rollback:
Compatibilidade entre versões:
```

Mudanças irreversíveis precisam declarar forward-fix.

---

### 15. Adicionar exceções

```markdown
## Exceções

Exception ID:
Controle afetado:
Owner:
Expires at:
Compensating controls:

- [ ] Não existe exceção.
- [ ] A exceção está registrada e válida.
```

O PR não cria uma exceção apenas no texto.

O ID precisa existir no registro.

---

### 16. Criar policy de evidências

Arquivo:

```text
security/security-pr-evidence-policy.yaml
```

```yaml
version: 1

requirements:
  LOW:
    required:
      - relevant-tests

  MEDIUM:
    required:
      - relevant-tests
      - impact-description
      - rollback

  HIGH:
    required:
      - relevant-tests
      - negative-tests
      - threat-model
      - owner-review
      - rollback
      - gate-result

  CRITICAL:
    required:
      - relevant-tests
      - negative-tests
      - threat-model
      - two-reviewers
      - owner-review
      - deployment-plan
      - rollback
      - monitoring-plan
      - full-security-gate
```

O pipeline pode utilizar esses IDs.

---

### 17. Criar registro de exceções

Arquivo:

```text
security/security-pr-exception-register.yaml
```

Estado inicial:

```yaml
version: 1
exceptions: []
```

Uma entrada futura:

```yaml
- id: SEC-EX-2026-001
  control: security-external-smoke
  riskLevel: HIGH
  reason: ambiente indisponivel durante migracao
  compensatingControls:
    - deterministic-oidc-tests
    - release-blocked-until-smoke
  owner: identity-security
  approver: backend-security
  ticket: SEC-2026-101
  createdAt: 2026-07-12
  expiresAt: 2026-07-15
  remediation:
    - restore-keycloak-smoke-environment
  status: OPEN
```

O exemplo é sintético.

---

### 18. Definir controles não excepcionáveis

No documento:

```text
docs/security/M15_SECURITY_EXCEPTION_PROCESS.md
```

Registre:

```text
secret real no Git:
não excepcionável.

tenant bypass:
não excepcionável.

password ou token em log:
não excepcionável.

produção com Keycloak start-dev:
não excepcionável.

signature validation desabilitada:
não excepcionável.

Actuator sensível público:
não excepcionável.
```

Uma emergência precisa de processo superior ao PR comum.

---

### 19. Criar SecurityChangeClassificationPolicyTest

O teste carrega o YAML.

Valide:

- version;
- levels conhecidos;
- IDs únicos;
- mínimo válido;
- owner existente;
- path não vazio;
- pattern compilável;
- nenhuma rule global acidental;
- paths sensíveis cobertos.

Paths obrigatórios:

```text
pom.xml;

db/migration;

security config;

authorization matrix;

application-hardening;

privacy;

logs;

Dockerfile;

compose.
```

---

### 20. Testar classificação de diffs sintéticos

Fixtures:

```text
docs-only.diff:
LOW.

new-endpoint.diff:
HIGH.

jwt-change.diff:
CRITICAL.

migration.diff:
HIGH.

pom-change.diff:
HIGH.

authorization-change.diff:
CRITICAL.
```

O classificador retorna o maior nível aplicável.

---

### 21. Criar SecurityPullRequestTemplatePolicyTest

Valide que o template contém exatamente uma vez:

- resumo;
- classificação;
- threat model;
- autenticação;
- autorização;
- dados e privacidade;
- logs e auditoria;
- migrations;
- dependências;
- hardening;
- testes;
- rollback;
- exceções.

Também valide os IDs esperados.

Não faça o teste depender de espaços irrelevantes.

---

### 22. Criar SecurityPrEvidencePolicyTest

Carregue a policy.

Valide:

- níveis conhecidos;
- requisitos existentes;
- `HIGH` contém negative tests;
- `HIGH` contém threat model;
- `CRITICAL` contém full gate;
- `CRITICAL` contém monitoring e deployment;
- nível superior não perde requisito obrigatório do inferior;
- requisito possui descrição no guide.

---

### 23. Criar SecurityPrExceptionRegisterTest

Valide cada exceção:

- ID único;
- control;
- risk level;
- reason;
- compensating controls;
- owner;
- approver;
- ticket;
- createdAt;
- expiresAt;
- remediation;
- status;
- não expirada;
- controle excepcionável.

Exceção expirada falha o build.

---

### 24. Criar SecurityReviewOwnershipPolicyTest

Valide:

- owner IDs únicos;
- responsabilidades não vazias;
- todos os owners usados nas rules existem;
- superfícies críticas possuem owner;
- nenhum owner genérico chamado `anyone`;
- processo de fallback documentado.

O teste não precisa conhecer pessoas reais.

---

### 25. Criar guide de review

Arquivo:

```text
.github/SECURITY_REVIEW_GUIDE.md
```

Inclua:

```markdown
# Security review guide

## Antes do review

1. leia o resumo;
2. confirme o risco mínimo;
3. identifique superfícies;
4. consulte threat model;
5. revise evidências.

## Durante

1. procure bypass;
2. procure novo dado;
3. procure novo log;
4. procure novo default;
5. procure ausência de teste negativo.

## Depois

1. confirme gates;
2. confirme rollback;
3. confirme owners;
4. confirme exceções;
5. aprove o commit final.
```

---

### 26. Criar checklist técnico detalhado

Arquivo:

```text
docs/security/M15_SECURITY_PR_CHECKLIST.md
```

O documento aprofunda perguntas, evidências, sinais de alerta, owners e testes.

O template permanece curto para uso diário.

---

### 27. Criar classificação documentada

Arquivo:

```text
docs/security/M15_SECURITY_CHANGE_CLASSIFICATION.md
```

Registre:

| Nível | Definição | Exemplos | Review mínimo |
|---|---|---|---|
| LOW | sem mudança de fronteira | docs | técnico |
| MEDIUM | contrato limitado | DTO público | técnico + owner |
| HIGH | segurança ou dados | endpoint, migration | owner de segurança |
| CRITICAL | identidade ou bypass | token, permission | revisão adicional |

Inclua a regra:

```text
o maior nível vence.
```

---

### 28. Integrar com a matriz de testes

Mudanças `HIGH` e `CRITICAL` precisam apontar para:

```text
security/security-test-matrix.yaml.
```

Quando uma ameaça muda:

- atualize requirement;
- atualize test;
- atualize evidence;
- atualize owner;
- execute a suíte.

Não aceite “não se aplica” quando o diff altera um controle já mapeado.

---

### 29. Integrar com autorização

Se a mudança toca:

```text
controller;

SecurityFilterChain;

@PreAuthorize;

permission;

role;

tenant;

ownership;

repository scope.
```

o PR precisa declarar atualização ou ausência justificada em:

```text
security/authorization-test-matrix.yaml.
```

O policy test pode comparar paths classificados e arquivo alterado no diff do CI.

---

### 30. Integrar com supply chain

Quando `pom.xml` muda, o gate exige:

```text
dependency tree;

SBOM;

Dependency-Check;

risk register;

suppression policy.
```

O PR informa:

- dependência;
- motivo;
- versão;
- transitivas;
- advisory;
- licença;
- resultado.

---

### 31. Integrar com migrations

Quando uma migration muda, o PR exige:

- estratégia de rollout;
- compatibilidade com versão anterior;
- lock assessment;
- tamanho estimado;
- backfill;
- tenant;
- privacy;
- index;
- rollback ou forward-fix;
- teste PostgreSQL real.

Não aprove apenas porque a migration executa em banco vazio.

---

### 32. Integrar com logs

Quando um logger ou event muda:

- atualizar catálogo;
- testar sentinelas;
- revisar cardinalidade;
- revisar PII;
- revisar audit;
- revisar retention;
- validar Problem Details.

Um log novo é mudança de dados.

---

### 33. Integrar com hardening

Quando configuração muda:

- executar `ProductionHardeningPolicyTest`;
- executar contracts;
- revisar profile;
- revisar proxy;
- revisar Actuator;
- revisar limits;
- revisar cookies;
- revisar fail-open/closed.

Toda redução de proteção eleva o risco.

---

### 34. Definir gates por nível

Pipeline conceitual:

```text
LOW:
build + tests relevantes.

MEDIUM:
build + tests + contract.

HIGH:
security suite + policy + integration + SCA quando aplicável.

CRITICAL:
full gate + reviewer adicional + deployment plan.
```

O gate real pode executar mais testes, nunca menos.

---

### 35. Definir blockers

Merge é bloqueado por classificação ausente ou baixa, owner faltante, teste negativo ausente, gate falho, exceção expirada, suppression inválida, secret, ameaça inconsistente ou evidência de outro commit.

---

### 36. Definir critérios para “não se aplica”

Uma seção pode ser marcada como não aplicável quando:

- o diff não toca a superfície;
- o motivo é escrito;
- a classificação confirma;
- reviewer aceita.

Exemplo válido:

```text
Não altera autenticação:
diff limitado a documentação
do endpoint de paginação.
```

Exemplo inválido:

```text
Não altera autenticação:
porque o teste passou.
```

---

### 37. Atualizar threat model

Adicione:

```text
THR-279:
PR de alto risco
é classificado como baixo.

THR-280:
checklist é marcado
sem evidência.

THR-281:
mudança crítica é aprovada
somente pelo autor.

THR-282:
migration é testada
apenas em banco vazio.

THR-283:
novo endpoint não atualiza
matriz de autorização.

THR-284:
pom muda sem SBOM
e SCA.

THR-285:
novo log não passa
por sentinelas.

THR-286:
exception expirada
permanece válida.

THR-287:
evidência pertence
a commit antigo.

THR-288:
owner de segurança
não é identificado.

THR-289:
seção não aplicável
esconde impacto real.

THR-290:
branch aceita merge
com gate falho.
```

Controles:

- classificação automática;
- evidence policy;
- reviewer adicional;
- migration checklist;
- diff integration;
- supply-chain gate;
- logging tests;
- expiry test;
- commit-bound evidence;
- ownership map;
- justification;
- branch protection.

---

### 38. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
mudanças de autorização:
owner e matriz obrigatórios.
```

A02 Security Misconfiguration:

```text
config changes:
hardening gate.
```

A03 Supply Chain Failures:

```text
pom changes:
tree, SBOM e SCA.
```

A04 Insecure Design:

```text
threat model:
obrigatório por risco.
```

A09 Security Logging:

```text
novos logs:
catálogo e sentinelas.
```

Baseline:

```text
PR:
classificado.

evidência:
obrigatória.

owners:
mapeados.

exceptions:
temporárias.

gates:
por risco.

merge:
protegido.

produção pública:
NO-GO.
```

---

### 39. Executar os policy tests

```powershell
.\mvnw.cmd `
  -Dtest=SecurityPullRequestTemplatePolicyTest,SecurityChangeClassificationPolicyTest,SecurityPrEvidencePolicyTest,SecurityPrExceptionRegisterTest,SecurityReviewOwnershipPolicyTest `
  test
```

Valide fixtures:

```powershell
.\mvnw.cmd `
  -Dtest=SecurityChangeClassificationPolicyTest#shouldClassifySyntheticDiffs `
  test
```

---

### 40. Executar gate de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

SCA:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Gate completo:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Confirme:

- template;
- classification;
- ownership;
- evidence;
- exceptions;
- threat model;
- authorization matrix;
- hardening;
- supply chain;
- nenhum teste desabilitado;
- nenhum secret;
- nenhum item crítico sem owner.

---

## Entendendo o que foi feito

### O checklist virou processo

Classificação, owner, evidência e gate substituíram caixas genéricas.

### Mudanças simples continuaram leves

Risco baixo não recebe a mesma burocracia de identidade e autorização.

### Mudanças críticas ganharam proteção adicional

Threat model, testes negativos, full gate, implantação e rollback ficaram obrigatórios.

### Paths ganharam owners

Autenticação, autorização, privacidade, plataforma, banco e supply chain possuem responsabilidade explícita.

### Exceções ficaram temporárias

Owner, approver, compensating controls e expiração são validados no build.

### O PR passou a ligar controles existentes

Matrizes, SCA, hardening, logs e migrations não ficam isolados.

### Branch protection completou o controle

O Markdown orienta; regras do repositório impedem merge sem gates e reviews.

---

## Erros comuns importantes

### Criar checklist com cem caixas

O autor marca mecanicamente e perde o foco.

### Classificar tudo como baixo

Paths sensíveis precisam impor um mínimo.

### Classificar tudo como crítico

A burocracia passa a ser ignorada.

### Aceitar evidência de outro commit

O estado aprovado pode não ser o estado integrado.

### Permitir “não se aplica” sem motivo

O impacto real fica oculto.

### Aprovar a própria mudança crítica

Falta segregação de responsabilidade.

### Registrar exceção sem prazo

O risco temporário vira permanente.

### Usar CODEOWNERS sem fallback

Ausência de reviewer bloqueia ou enfraquece o processo.

### Confiar somente no template

Sem branch protection e policy tests, o checklist pode ser ignorado.

### Exigir screenshot em vez de teste

Imagem não substitui evidência reproduzível.

---

## Comandos úteis

### Policy tests do PR

```powershell
.\mvnw.cmd `
  -Dtest=SecurityPullRequestTemplatePolicyTest,SecurityChangeClassificationPolicyTest,SecurityPrEvidencePolicyTest,SecurityPrExceptionRegisterTest,SecurityReviewOwnershipPolicyTest `
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

### Procurar exceções expiradas

```powershell
git grep `
  -n `
  -E `
  "expiresAt|ACCEPTED_TEMPORARILY|SEC-EX-"
```

### Procurar bypasses no template

```powershell
git grep `
  -n `
  -E `
  "não se aplica|skip|temporary bypass"
```

---

## Exercício guiado

### Parte 1 — Classificação

Crie níveis e paths mínimos.

### Parte 2 — Owners

Mapeie superfícies e responsabilidades.

### Parte 3 — Template

Crie seções objetivas e evidências.

### Parte 4 — Segurança

Revise autenticação, autorização, dados e logs.

### Parte 5 — Plataforma

Revise migrations, dependências e hardening.

### Parte 6 — Testes

Exija cenários negativos e side effects.

### Parte 7 — Exceções

Registre owner, prazo e compensações.

### Parte 8 — Policy tests

Valide template, rules e register.

### Parte 9 — Gates

Associe níveis a jobs obrigatórios.

### Parte 10 — Merge

Documente blockers e branch protection.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 445 foi preservada;
- checklist foi diferenciado de evidência;
- níveis LOW, MEDIUM, HIGH e CRITICAL foram definidos;
- classificação automática impõe nível mínimo;
- autor pode elevar, mas não reduzir sem exceção;
- paths de autenticação, autorização, privacidade, banco, dependências e hardening foram mapeados;
- owners internos foram definidos;
- template de PR foi criado;
- autenticação, autorização, DTOs, logs, migrations, dependências e configuração foram cobertos;
- testes negativos e side effects foram exigidos;
- rollback e implantação foram incluídos;
- policy de evidências foi criada;
- níveis superiores preservam requisitos inferiores;
- registro de exceções foi criado;
- exceções possuem owner, approver, ticket e expiração;
- controles não excepcionáveis foram documentados;
- template, classificação, evidências, ownership e exceções possuem policy tests;
- threat model e matrizes são atualizados conforme o diff;
- mudanças no POM exigem tree, SBOM e SCA;
- migrations exigem rollout, lock e compatibilidade;
- logs exigem catálogo e sentinelas;
- hardening exige policy test;
- gates foram definidos por risco;
- blockers de merge foram definidos;
- “não se aplica” exige justificativa;
- branch protection foi documentada;
- threat model e OWASP foram atualizados;
- projeto prático não foi antecipado;
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

git grep `
  -n `
  -E `
  "SEC-EX-|expiresAt|minimumLevel|owner-review"
```

Adicione:

```powershell
git add `
  .github `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/security `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/src/test `
  docs/security `
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
git commit -m "docs(m15): aplicar checklist de seguranca em PR"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- nomes ou handles inventados;
- secret;
- token;
- evidência com PII;
- exceção sem expiração;
- bypass temporário fora do register;
- report de outro commit;
- template preenchido com dados reais;
- rule que classifica tudo como LOW.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os controles do módulo foram transformados em um processo de revisão.

O fluxo ficou:

```text
diff;

classificação mínima;

superfícies;

owners;

checklist;

evidências;

gates;

decisão;

merge.
```

A profundidade passou a acompanhar o risco:

```text
LOW:
testes relevantes.

MEDIUM:
impacto e rollback.

HIGH:
threat model,
testes negativos,
owner e gates.

CRITICAL:
full gate,
review adicional,
implantação,
monitoramento e rollback.
```

Autenticação, autorização, dados, logs, migrations, dependências e hardening passaram a ter perguntas específicas.

Exceções passaram a possuir:

```text
ID;

controle;

risco;

owner;

approver;

ticket;

compensações;

expiração;

correção.
```

A decisão central foi:

```text
um PR seguro
não é aquele que marcou
todas as caixas;

é aquele que classificou
o risco corretamente,
produziu evidências,
recebeu review adequado
e passou pelos gates
do commit final.
```

O Módulo 15 agora possui controles técnicos e um processo para preservá-los.

A próxima etapa será aplicar essa base em um projeto guiado.

A próxima aula será:

```text
447 - M15.37 - Projeto API segura parte 1
```

Nela, você irá:

- definir o domínio do projeto;
- criar requisitos de segurança;
- criar threat model;
- classificar dados;
- definir atores e permissions;
- preparar persistência;
- configurar autenticação;
- preparar testes e gates;
- iniciar a implementação da API segura.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei mudanças por risco.
- [ ] Criei owners e evidências obrigatórias.
- [ ] Criei template e policy tests.
- [ ] Governei exceções com prazo.
- [ ] Defini gates e blockers de merge.

---

## Troubleshooting adicional

### Toda mudança é classificada como HIGH

Uma rule pode estar ampla demais.

Revise globs e paths obrigatórios.

### Mudança de autorização aparece como LOW

O path não está coberto ou o classificador não usa o maior nível.

Adicione fixture negativa.

### Template permite campos críticos vazios

O pipeline precisa validar o body do PR ou exigir metadata estruturada.

O teste local valida a estrutura do template; a integração do repositório valida o preenchimento.

### Exceção expirada quebra o build

Esse é o comportamento esperado.

Corrija o controle, encerre a exceção ou obtenha nova aprovação formal.

### Owner não existe

Adicione responsabilidade válida e processo de fallback.

Não use `anyone`.

### PR passou sem SCA após mudar pom.xml

O gate de classificação não acionou o job de supply chain.

Revise a regra e a condição do pipeline.

### Evidência foi gerada antes do último commit

Execute novamente os gates no commit final.

### Checklist ficou longo demais

Mantenha o template objetivo e mova explicações para o guide e documentos.

---

## Perguntas de revisão

1. Checklist é evidência?
2. Quais são os quatro níveis?
3. Quem define o mínimo?
4. Autor pode reduzir o nível?
5. O que é security owner?
6. O que HIGH exige?
7. O que CRITICAL adiciona?
8. Todo novo endpoint revisa o quê?
9. Mudança no POM exige o quê?
10. Migration precisa apenas executar?
11. Novo log é mudança de dados?
12. O que uma exceção precisa ter?
13. Exceção pode ser eterna?
14. Há controles não excepcionáveis?
15. O que significa “não se aplica”?
16. Checklist substitui branch protection?
17. Evidência pode vir de commit antigo?
18. Quem aprova mudança crítica?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Não.
2. Low, medium, high e critical.
3. Regras de classificação e o diff.
4. Não sem exceção aprovada.
5. Responsável por uma superfície.
6. Threat model, negativo, owner, rollback e gates.
7. Review adicional, implantação, monitoramento e full gate.
8. Autorização, threat model e testes.
9. Tree, SBOM e SCA.
10. Não; rollout, lock e compatibilidade.
11. Sim.
12. Owner, razão, controles, ticket e expiração.
13. Não.
14. Sim.
15. Ausência justificada de impacto.
16. Não.
17. Não.
18. Reviewers e owners definidos.
19. Projeto API segura parte 1.
20. Aplicação integrada dos controles.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 446 - M15.36 - Checklist seguranca em PR

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei checklist e evidência.
- Criei classificação LOW, MEDIUM, HIGH e CRITICAL.
- Defini nível mínimo automático por path.
- Permiti elevar o risco e proibi reduzir sem exceção.
- Criei `security-change-classification.yaml`.
- Mapeei autenticação, autorização, privacidade, banco, dependências e hardening.
- Criei `security-review-ownership.yaml`.
- Defini owners internos por superfície.
- Criei `.github/pull_request_template.md`.
- Incluí resumo, risco, threat model e superfícies.
- Incluí revisão de autenticação e sessão.
- Incluí revisão de autorização, tenant e ownership.
- Incluí revisão de DTOs, dados e privacidade.
- Incluí revisão de logs, errors e auditoria.
- Incluí revisão de migrations.
- Incluí revisão de dependências e supply chain.
- Incluí revisão de configuração e hardening.
- Exigi testes positivos, negativos e side effects.
- Incluí implantação, monitoramento e rollback.
- Criei `security-pr-evidence-policy.yaml`.
- Defini evidências proporcionais ao risco.
- Criei `security-pr-exception-register.yaml`.
- Exigi owner, approver, ticket, compensações e expiração.
- Documentei controles não excepcionáveis.
- Criei `SecurityPullRequestTemplatePolicyTest`.
- Criei `SecurityChangeClassificationPolicyTest`.
- Criei `SecurityPrEvidencePolicyTest`.
- Criei `SecurityPrExceptionRegisterTest`.
- Criei `SecurityReviewOwnershipPolicyTest`.
- Criei fixtures de diffs sintéticos.
- Integrei o PR com threat model e matriz de segurança.
- Integrei mudanças de autorização com sua matriz.
- Integrei mudanças no POM com tree, SBOM e SCA.
- Integrei migrations com rollout, lock e compatibilidade.
- Integrei logs com catálogo e sentinelas.
- Integrei hardening com policy tests.
- Defini gates por nível.
- Defini blockers de merge.
- Exigi justificativa para “não se aplica”.
- Documentei branch protection.
- Criei `SECURITY_REVIEW_GUIDE.md`.
- Criei `M15_SECURITY_PR_CHECKLIST.md`.
- Criei `M15_SECURITY_CHANGE_CLASSIFICATION.md`.
- Criei `M15_SECURITY_EXCEPTION_PROCESS.md`.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Projeto API segura parte 1.
```

---

## Referência técnica curta

- [OWASP Secure Code Review Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)
- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [GitHub — Pull request templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
- [GitHub — About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub — About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

Regra final:

```text
checklist de segurança em PR deve transformar o diff em uma decisão proporcional ao risco: paths sensíveis impõem classificação mínima, superfícies possuem owners, mudanças de alto risco exigem threat model, testes negativos, side effects, gates e rollback, exceções possuem compensações e expiração, dependências exigem SBOM e SCA, migrations exigem rollout e compatibilidade, logs exigem sentinelas e o merge só ocorre quando as evidências pertencem ao commit final e as regras do repositório confirmam a revisão.
```
