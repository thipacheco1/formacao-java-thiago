# 449 - M15.39 - Projeto API segura parte 3

## Apresentação da aula

Na parte 1, o projeto nasceu com uma primeira fatia vertical segura:

```text
Resource Server;

JWT do Keycloak;

issuer e audience;

identidade local provisionada;

membership;

tenant;

create;

read own;

list own;

PostgreSQL;

DTOs mínimos;

queries scoped;

Problem Details;

testes negativos.
```

Na parte 2, o workflow de decisão foi implementado:

```text
review queue;

approval;

rejection;

segregation of duties;

If-Match;

optimistic locking;

audit obrigatório;

Redis;

rate limiting;

concorrência;

matriz de autorização.
```

O projeto já demonstra que segurança não é um filtro adicionado no final.

Ela está presente em:

- requisitos;
- threat model;
- dados;
- migrations;
- identidade;
- tenancy;
- authorization;
- aggregate;
- DTOs;
- queries;
- auditoria;
- logs;
- rate limiting;
- testes.

Ainda falta responder uma pergunta decisiva:

```text
o projeto está pronto
para ser tratado
como release candidate?
```

Essa pergunta não pode ser respondida apenas com:

```text
os testes passaram.
```

Uma release segura precisa de evidências sobre:

- superfície HTTP;
- configuração;
- secrets;
- dados pessoais;
- retenção;
- backup;
- restore;
- dependências;
- SBOM;
- vulnerabilidades;
- runbooks;
- observabilidade;
- recuperação;
- operação;
- implantação;
- rollback;
- gaps conhecidos.

A parte 3 consolidará o projeto como release candidate para ambiente controlado. A baseline será `GO_CONTROLLED` e `NO_GO_PUBLIC`; `GO_PUBLIC` só existiria com todos os gates e aprovações reais.

A pergunta central desta aula será:

```text
como fechar uma API segura
com hardening, privacidade,
supply chain, recuperação,
testes end-to-end
e uma decisão de release
baseada em evidências?
```

A parte 3 adicionará:

```text
hardening final;

privacy inventory;

retention policy;

backup and restore runbook;

SBOM CycloneDX;

Dependency-Check;

release profile;

OpenAPI final;

collections finais;

end-to-end tests;

release evidence;

GO/NO-GO report.
```

O projeto continuará sem inventar infraestrutura que não foi realmente testada.

Não será afirmado:

- alta disponibilidade comprovada;
- disaster recovery validado em produção;
- WAF configurado;
- SIEM integrado;
- rotação automática de secrets;
- cluster Redis;
- cluster PostgreSQL;
- Keycloak altamente disponível;
- produção pública liberada.

Esses itens serão registrados como gaps quando não existirem.

A parte 3 termina com hardening aplicado, Actuator privado, dados e retenção documentados, backup e restore exercitados, SBOM e SCA gerados, E2E completo, runbooks, evidências do commit final, gaps com owner e decisão registrada.

A próxima aula será:

```text
450 - M15.40 - Revisao seguranca parte 1
```

Nela, o módulo entrará em revisão técnica sistemática, retomando fundamentos, autenticação, JWT, OAuth 2.0, OIDC, PKCE, Keycloak, tenancy e autorização.

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
Revisao seguranca parte 3.
```

A parte 2 respondeu:

```text
como decidir solicitações
com segregação,
concorrência,
auditoria e rate limiting?
```

A parte 3 responderá:

```text
como transformar
o projeto funcional
em release candidate
com evidências operacionais?
```

Nesta aula:

```text
hardening:
finalizado.

privacy:
documentada.

retention:
documentada.

backup:
executado.

restore:
executado.

SBOM:
gerada.

SCA:
executada.

E2E:
executado.

OpenAPI:
fechada.

runbooks:
criados.

release gate:
executado.

GO/NO-GO:
registrado.

produção pública:
não liberada automaticamente.
```

A regra central será:

```text
release segura
é uma decisão de risco
sustentada por evidências,
não uma consequência
automática do build verde.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/
├── application-release.yaml
└── application-hardening.yaml
```

Segurança e operação:

```text
security/
├── dependency-check-suppressions.xml
├── dependency-risk-register.yaml
├── release-security-gaps.yaml
└── release-evidence-manifest.yaml
```

Documentação:

```text
docs/
├── api/
│   └── secure-access-openapi.yaml
└── security/
    ├── PROJECT_API_HARDENING.md
    ├── PROJECT_DATA_PROCESSING_INVENTORY.md
    ├── PROJECT_RETENTION_POLICY.md
    ├── PROJECT_BACKUP_RESTORE_RUNBOOK.md
    ├── PROJECT_INCIDENT_RESPONSE_RUNBOOK.md
    ├── PROJECT_RELEASE_RUNBOOK.md
    ├── PROJECT_RELEASE_SECURITY_REPORT.md
    └── PROJECT_GO_NO_GO.md
```

Supply chain:

```text
target/
├── bom.json
├── bom.xml
├── dependency-check-report.html
├── dependency-check-report.json
└── dependency-check-report.sarif
```

Testes:

```text
SecureAccessWorkflowEndToEndTest;

ReleaseHardeningIntegrationTest;

PrivacyDataExposureTest;

RetentionPolicyTest;

BackupRestoreIntegrationTest;

ReleaseSupplyChainPolicyTest;

ReleaseEvidenceManifestTest;

GoNoGoDecisionPolicyTest.
```

Você irá:

1. criar profile de release;
2. aplicar hardening;
3. restringir management;
4. revisar cookies e sessão;
5. revisar proxy;
6. criar inventário de dados;
7. criar policy de retenção;
8. criar job de retenção seguro;
9. criar backup local;
10. executar restore;
11. gerar SBOM;
12. executar SCA;
13. governar findings;
14. fechar OpenAPI;
15. fechar collections;
16. criar testes E2E;
17. criar runbooks;
18. criar evidence manifest;
19. registrar gaps;
20. emitir GO/NO-GO.

---

## Conceito essencial

### Release candidate

Release candidate é uma versão que:

- passou pelos gates definidos;
- possui evidências;
- possui configuração reproduzível;
- possui rollback;
- possui gaps conhecidos;
- pode ser avaliada para implantação.

Ela não é sinônimo de produção aprovada.

---

### GO controlado

`GO_CONTROLLED` significa:

- ambiente não público;
- usuários sintéticos ou autorizados;
- dados não produtivos;
- acesso restrito;
- observação próxima;
- rollback disponível;
- finalidade de validação.

Esse será o resultado mínimo aceitável do laboratório.

---

### NO-GO público

`NO_GO_PUBLIC` significa que a aplicação não deve ser exposta à internet como produção.

Motivos possíveis:

- Keycloak local em `start-dev`;
- TLS não validado;
- proxy não aprovado;
- backup apenas local;
- Redis single instance;
- PostgreSQL single instance;
- ausência de load test;
- secrets sem rotação exercitada;
- monitoring não integrado;
- incident response não simulado;
- privacy approvals pendentes.

Registrar NO-GO é uma decisão profissional.

---

### Hardening final

O projeto precisa aplicar a baseline da aula 445:

- methods allowlist;
- JSON only;
- body limit;
- header limits;
- parameter limit;
- pagination limit;
- sort allowlist;
- forwarded headers off;
- Actuator separado;
- errors genéricos;
- session stateless na API;
- graceful shutdown;
- server header suprimido.

A parte 3 adapta esses controles ao novo projeto.

---

### Profile de release

O profile de release não contém secrets.

Ele contém apenas referências e limites.

Secrets vêm de:

- environment variables;
- Docker secrets;
- config tree;
- secret manager futuro.

A aplicação falha no startup quando secrets obrigatórios não existem.

---

### Inventário de dados

O inventário precisa relacionar:

- campo;
- classificação;
- titular;
- finalidade;
- fonte;
- storage;
- recipients;
- retenção;
- owner;
- controles.

Exemplos:

```text
subject:
PERSONAL.

justification:
PERSONAL.

decision reason:
PERSONAL ou INTERNAL.

tenant ID:
INTERNAL.

access token:
SECRET transitório.
```

---

### Retenção

Retenção não é um número arbitrário colocado no código.

Cada categoria precisa de:

- política aprovada;
- owner;
- data de revisão;
- ação;
- blockers;
- audit.

A baseline criará status:

```text
APPROVED;

LEGAL_REVIEW_REQUIRED.
```

O scheduler automático processa apenas policies `APPROVED`.

---

### Estratégias de retenção

Para solicitações:

```text
PENDING:
mantida enquanto ativa.

APPROVED e REJECTED:
retenção aprovada pela organização.

CANCELED:
retenção aprovada.

audit:
retenção separada.

identity:
mantida enquanto vínculo ativo
ou obrigação válida.
```

A aula não inventará prazos legais.

---

### Anonimização

Justification e decision reason podem exigir:

- retenção;
- remoção;
- anonimização;
- bloqueio;
- preservação legal.

A decisão precisa considerar se o registro ainda possui finalidade.

Anonimização não é apenas substituir o nome por UUID.

---

### Backup

Backup é uma cópia que pode ser recuperada.

Ter um arquivo `.sql` não prova recuperação.

A evidência precisa incluir:

- comando;
- timestamp;
- checksum;
- encryption status;
- storage;
- restore;
- validation;
- owner.

No laboratório, backup e restore serão locais e sintéticos.

---

### Restore

Restore precisa ser realizado em instância separada.

Valide:

- schema;
- migrations;
- tenants;
- identities;
- solicitações;
- auditoria;
- índices;
- constraints;
- counts;
- nenhum dado extra.

Não restaure sobre o banco de trabalho.

---

### RPO e RTO

RPO:

```text
quanto dado pode ser perdido.
```

RTO:

```text
quanto tempo o serviço
pode levar para voltar.
```

O laboratório registra metas propostas, não SLAs produtivos comprovados.

Exemplo didático:

```text
RPO:
24 horas.

RTO:
4 horas.
```

Esses valores exigem aprovação antes de produção.

---

### SBOM ligada ao artifact

A SBOM precisa ser gerada no mesmo build do JAR.

Ela deve registrar o artifact e o commit correspondente.

SBOM gerada em outro commit não representa a release.

---

### SCA

O Dependency-Check será aplicado ao novo projeto.

Gate didático:

```text
failBuildOnCVSS:
8.0.

failOnError:
true.

unused suppression:
falha.
```

KEV recebe prioridade independente do threshold.

---

### Finding

Cada finding precisa de:

- component;
- version;
- path;
- scope;
- CVSS;
- KEV;
- EPSS quando usado;
- reachability;
- decision;
- owner;
- ticket;
- due date.

Não aceite suppressions genéricas.

---

### End-to-end

O teste end-to-end comprova o workflow completo:

```text
requester cria;

requester lê;

reviewer vê na fila;

requester não revisa;

reviewer aprova ou rejeita;

requester lê status final;

auditor consulta audit;

outro tenant não acessa.
```

Ele não substitui unit e integration tests.

---

### Evidência do commit final

O release manifest registra:

- commit SHA;
- build ID;
- artifact hash;
- SBOM hash;
- report hash;
- test report;
- profile;
- database migration;
- decision.

Se o commit mudar, o manifest precisa ser regenerado.

---

### GO/NO-GO

A decisão registra escopo, ambiente, responsáveis, gates, gaps, riscos, compensações, validade e próxima revisão, sem simular aprovação inexistente.

---

## Mão na massa guiada

### 1. Criar application-hardening.yaml

Adapte a baseline:

```yaml
app:
  security:
    hardening:
      max-json-body-size: 1MB
      allowed-methods:
        - GET
        - POST
        - OPTIONS
        - HEAD
      allowed-request-media-types:
        - application/json

server:
  server-header: ""
  max-http-request-header-size: 16KB
  forward-headers-strategy: none
  shutdown: graceful

  compression:
    enabled: false

  http2:
    enabled: false

  tomcat:
    connection-timeout: 5s
    keep-alive-timeout: 15s
    max-keep-alive-requests: 100
    max-http-response-header-size: 8KB
    max-http-form-post-size: 256KB
    max-parameter-count: 100
    max-connections: 1000
    accept-count: 100

spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s

  servlet:
    multipart:
      enabled: false

  web:
    error:
      include-exception: false
      include-message: never
      include-stacktrace: never
      include-binding-errors: never
      whitelabel:
        enabled: false
```

---

### 2. Criar application-release.yaml

```yaml
spring:
  config:
    import:
      - optional:configtree:/run/secrets/

  profiles:
    include:
      - hardening

  jpa:
    open-in-view: false

  flyway:
    enabled: true
    validate-on-migrate: true
    clean-disabled: true

server:
  port: 8080

management:
  server:
    port: 8082
    address: 127.0.0.1

  endpoints:
    access:
      default: none

    web:
      discovery:
        enabled: false

      exposure:
        include:
          - health
          - prometheus

  endpoint:
    health:
      access: read-only
      probes:
        enabled: true
      show-details: never

    prometheus:
      access: read-only
```

Prometheus só é aceitável porque permanece em loopback.

---

### 3. Criar ReleaseConfigurationPolicyTest

Valide:

- profile inclui hardening;
- forwarded strategy é `none`;
- Actuator usa loopback;
- exposure não possui wildcard;
- env, beans, mappings, heapdump e shutdown não estão expostos;
- multipart está off;
- errors não possuem details;
- server header está vazio;
- Flyway clean está disabled;
- Open Session in View está off;
- nenhum secret está literal.

---

### 4. Criar hardening integration test

Cenários:

- TRACE bloqueado;
- XML retorna `415`;
- Accept XML retorna `406`;
- body acima de 1MB retorna `413`;
- pagination acima de 100 retorna `400`;
- sort não permitido retorna `400`;
- forwarded headers falsos não alteram scheme, host ou IP;
- API não cria sessão;
- Actuator sensível não aparece.

---

### 5. Criar inventário de dados

Arquivo:

```text
PROJECT_DATA_PROCESSING_INVENTORY.md
```

Tabela:

| Dado | Classe | Titular | Finalidade | Storage | Retenção |
|---|---|---|---|---|---|
| issuer | INTERNAL | usuário | vincular IdP | PostgreSQL | policy |
| subject | PERSONAL | usuário | identidade | PostgreSQL | policy |
| displayName | PERSONAL | usuário | UI e audit | PostgreSQL | policy |
| justification | PERSONAL | requester | explicar necessidade | PostgreSQL | policy |
| decisionReason | PERSONAL/INTERNAL | requester/reviewer | justificar decisão | PostgreSQL | policy |
| audit actor | PERSONAL | usuário | accountability | PostgreSQL | audit policy |
| token | SECRET | usuário | autenticação transitória | não persistido | request only |

---

### 6. Criar retention policy

Arquivo:

```text
PROJECT_RETENTION_POLICY.md
```

Estrutura:

```yaml
policies:
  access-request-terminal:
    status: LEGAL_REVIEW_REQUIRED
    action: ANONYMIZE_OR_DELETE
    owner: data-privacy

  security-audit:
    status: LEGAL_REVIEW_REQUIRED
    action: RETAIN
    owner: security-governance

  inactive-external-identity:
    status: APPROVED
    action: REVIEW_AND_DISABLE
    owner: identity-security
```

Somente a última pode ser automatizada sem nova aprovação.

---

### 7. Criar RetentionPolicyProperties

```java
@ConfigurationProperties(
    prefix = "app.privacy.retention"
)
public record RetentionPolicyProperties(
        Map<String, RetentionRule> policies
) {
    public RetentionPolicyProperties {
        policies =
                Map.copyOf(
                        policies
                );
    }
}
```

Rule:

```java
public record RetentionRule(
        RetentionPolicyStatus status,
        RetentionAction action,
        Duration age,
        String owner
) {
}
```

---

### 8. Criar scheduler fail-safe

```java
@Scheduled(
    cron = "${app.privacy.retention.cron}"
)
@Transactional
public void applyApprovedPolicies() {
    policies.entrySet()
            .stream()
            .filter(
                entry ->
                    entry.getValue()
                         .status()
                    == RetentionPolicyStatus.APPROVED
            )
            .forEach(
                this::executeRule
            );
}
```

Se uma policy necessária estiver pendente:

```text
métrica;

warning catalogado;

nenhuma deleção automática.
```

---

### 9. Proteger retention job

O job:

- usa batch pequeno;
- possui limite por execução;
- registra IDs técnicos mínimos;
- não loga conteúdo;
- não cruza tenant sem query explícita;
- usa transaction por batch;
- suporta dry-run;
- produz audit;
- não executa em profile local por default.

---

### 10. Criar RetentionPolicyTest

Valide:

- policy pendente não executa;
- approved executa;
- age é positiva;
- owner existe;
- batch possui limite;
- dry-run não muta;
- audit é criado;
- justification não entra em log;
- tenant predicate existe.

---

### 11. Criar backup script

Arquivo:

```text
scripts/backup-postgresql.ps1
```

Fluxo:

```powershell
$timestamp =
  Get-Date `
    -Format "yyyyMMdd-HHmmss"

$backup =
  "target/backups/secure-access-$timestamp.dump"

docker exec `
  secure-access-postgres `
  pg_dump `
  --format=custom `
  --no-owner `
  --no-acl `
  --username=app `
  --dbname=secure_access `
  --file="/tmp/secure-access.dump"

docker cp `
  "secure-access-postgres:/tmp/secure-access.dump" `
  $backup

Get-FileHash `
  $backup `
  -Algorithm SHA256
```

Não escreva password no script.

---

### 12. Criar restore script

Arquivo:

```text
scripts/restore-postgresql.ps1
```

Requisitos:

- target database diferente;
- confirmação explícita;
- profile local;
- sem host de produção;
- checksum validado;
- schema vazio;
- `pg_restore --exit-on-error`;
- validation queries.

---

### 13. Criar BackupRestoreIntegrationTest

O teste:

1. cria tenants sintéticos;
2. cria requests;
3. cria decisions;
4. cria audit;
5. executa backup;
6. sobe segundo PostgreSQL;
7. restaura;
8. executa Flyway validate;
9. compara counts;
10. consulta relações;
11. valida constraints;
12. remove artifacts temporários.

O teste pode ser marcado:

```text
security-external
```

ou:

```text
backup-restore
```

Ele não precisa rodar na suíte rápida.

---

### 14. Criar runbook de backup

Arquivo:

```text
PROJECT_BACKUP_RESTORE_RUNBOOK.md
```

Inclua:

- escopo;
- commands;
- secrets;
- encryption;
- checksums;
- retention;
- storage;
- restore;
- validation;
- RPO;
- RTO;
- owner;
- failure modes.

Marque:

```text
RPO/RTO:
propostos,
não comprovados em produção.
```

---

### 15. Adicionar CycloneDX

No `pom.xml`:

```xml
<plugin>
    <groupId>org.cyclonedx</groupId>
    <artifactId>
        cyclonedx-maven-plugin
    </artifactId>
    <version>
        ${cyclonedx-maven-plugin.version}
    </version>
    <executions>
        <execution>
            <id>generate-sbom</id>
            <phase>package</phase>
            <goals>
                <goal>makeAggregateBom</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <schemaVersion>1.6</schemaVersion>
        <includeBomSerialNumber>true</includeBomSerialNumber>
        <includeRuntimeScope>true</includeRuntimeScope>
        <includeTestScope>false</includeTestScope>
        <outputFormat>all</outputFormat>
    </configuration>
</plugin>
```

Use a versão fixada e validada no módulo.

---

### 16. Adicionar Dependency-Check

Profile:

```text
security-sca.
```

Configuração:

```text
failOnError:
true.

failBuildOnCVSS:
8.0.

knownExploitedEnabled:
true.

formats:
HTML;
JSON;
SARIF.

unused suppression:
falha.

NVD key:
environment variable.
```

Não copie secret para o POM.

---

### 17. Criar suppressions vazio

Arquivo:

```text
security/dependency-check-suppressions.xml
```

Comece sem rules.

Qualquer futura suppression exige:

- component preciso;
- CVE;
- owner;
- ticket;
- evidence;
- `until`;
- finding no risk register.

---

### 18. Criar risk register

Arquivo:

```text
security/dependency-risk-register.yaml
```

Inicial:

```yaml
version: 1
findings: []
```

Se o scan encontrar algo, não apague o report.

Triagem:

- confirmar artifact;
- confirmar versão;
- revisar advisory;
- verificar KEV;
- verificar reachability;
- definir decisão;
- corrigir ou registrar.

---

### 19. Criar ReleaseSupplyChainPolicyTest

Valide:

- plugin versions fixas;
- SBOM no package;
- Dependency-Check no profile;
- failOnError;
- threshold;
- KEV;
- suppression file;
- unused suppression;
- risk register;
- ausência de `LATEST`;
- ausência de repository HTTP.

---

### 20. Gerar SBOM

```powershell
.\mvnw.cmd clean package
```

Confirme:

```powershell
Get-Item `
  target/bom.json,
  target/bom.xml
```

Calcule hashes:

```powershell
Get-FileHash `
  target/bom.json `
  -Algorithm SHA256
```

---

### 21. Executar SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Artifacts:

```text
dependency-check-report.html;

dependency-check-report.json;

dependency-check-report.sarif.
```

Se o scanner falhar:

```text
release gate:
falha.
```

Não faça skip silencioso.

---

### 22. Fechar OpenAPI

Arquivo:

```text
docs/api/secure-access-openapi.yaml
```

Documente:

- create;
- read own;
- list own;
- review queue;
- decision;
- audit;
- schemas;
- ETag;
- If-Match;
- pagination;
- sort;
- `401`;
- `403`;
- `404`;
- `409`;
- `412`;
- `413`;
- `415`;
- `428`;
- `429`;
- `503`.

Não exponha:

- tenant ID em response comum;
- requester ID desnecessário;
- access token;
- audit internals;
- stack trace.

---

### 23. Validar OpenAPI

Teste:

```text
OpenApiContractPolicyTest.
```

Valide:

- paths conhecidos;
- security scheme;
- operation IDs únicos;
- request schemas mínimos;
- response schemas allowlist;
- Problem Details;
- errors;
- absence de fields proibidos;
- examples sintéticos.

---

### 24. Fechar Postman e Insomnia

Collections finais devem conter:

- requester create;
- requester read;
- requester list;
- review queue;
- approve;
- reject;
- audit;
- negative authorization;
- cross-tenant;
- stale ETag;
- mass assignment;
- rate limit;
- hardening.

Tokens ficam apenas no environment local ignorado.

---

### 25. Criar E2E setup

O teste end-to-end usa:

- PostgreSQL Testcontainer;
- Redis Testcontainer;
- issuer de teste;
- tokens assinados por key de teste;
- Clock controlado;
- fixtures sintéticas.

Ele não depende do Keycloak real para cada execução.

Um smoke separado continua validando o Keycloak.

---

### 26. Criar SecureAccessWorkflowEndToEndTest

Fluxo de aprovação:

1. requester cria;
2. response retorna `201`;
3. requester lê `PENDING`;
4. reviewer vê na fila;
5. requester não decide;
6. reviewer aprova com ETag;
7. response retorna `APPROVED`;
8. requester lê status final;
9. auditor consulta audit;
10. outro tenant recebe `404`.

Valide side effects.

---

### 27. Criar fluxo de rejeição

Novo request.

Reviewer rejeita com reason válido.

Valide:

- `REJECTED`;
- reviewer derivado;
- reviewedAt;
- audit;
- reason fora de logs;
- requester lê status;
- reason só aparece no contract autorizado.

---

### 28. Criar cenários E2E negativos

Inclua:

- token de issuer errado;
- audience errada;
- identity não provisionada;
- tenant inválido;
- permission ausente;
- self-review;
- outro tenant;
- unknown field;
- stale ETag;
- race;
- Redis indisponível;
- body grande;
- media type errado;
- audit sem permission.

Cada cenário valida ausência de mutação.

---

### 29. Criar incident response runbook

Arquivo:

```text
PROJECT_INCIDENT_RESPONSE_RUNBOOK.md
```

Cenários:

- token signing key comprometida;
- refresh ou session leak no IdP;
- tenant data exposure;
- audit failure;
- Redis outage;
- PostgreSQL outage;
- dependency KEV;
- secret no Git;
- anomalous review activity;
- backup unavailable.

Para cada um:

- detect;
- contain;
- preserve evidence;
- communicate;
- recover;
- rotate;
- validate;
- postmortem.

---

### 30. Criar release runbook

Arquivo:

```text
PROJECT_RELEASE_RUNBOOK.md
```

Etapas:

1. freeze commit;
2. validate branch;
3. run unit and integration;
4. run security suite;
5. run SCA;
6. generate SBOM;
7. generate artifact hash;
8. validate migrations;
9. backup;
10. deploy controlled;
11. smoke;
12. monitor;
13. rollback if needed;
14. record decision.

---

### 31. Criar gaps register

Arquivo:

```text
security/release-security-gaps.yaml
```

Exemplo:

```yaml
version: 1

gaps:
  - id: GAP-001
    title: Keycloak sem alta disponibilidade
    severity: HIGH
    owner: identity-security
    status: OPEN
    dueDate: 2026-08-31
    blocks:
      - GO_PUBLIC
    compensatingControls:
      - controlled-environment-only

  - id: GAP-002
    title: Load test produtivo nao executado
    severity: HIGH
    owner: platform-security
    status: OPEN
    dueDate: 2026-08-31
    blocks:
      - GO_PUBLIC
```

Datas são didáticas no laboratório.

---

### 32. Criar gaps policy test

Valide:

- ID;
- title;
- severity;
- owner;
- status;
- dueDate;
- blockers;
- compensations;
- nenhuma data expirada;
- `GO_PUBLIC` bloqueado por gap aberto relevante.

---

### 33. Criar evidence manifest

Arquivo:

```text
security/release-evidence-manifest.yaml
```

Estrutura:

```yaml
version: 1
release:
  commitSha: RESOLVED_BY_CI
  buildId: RESOLVED_BY_CI
  artifact:
    path: target/secure-access-api.jar
    sha256: RESOLVED_BY_CI
  sbom:
    path: target/bom.json
    sha256: RESOLVED_BY_CI
  sca:
    path: target/dependency-check-report.json
    sha256: RESOLVED_BY_CI
  tests:
    surefire: target/surefire-reports
  migrations:
    latest: V4
  profile:
    - release
    - hardening
```

No Git, use placeholders estruturais.

O CI gera a versão resolvida.

---

### 34. Criar ReleaseEvidenceManifestTest

Valide:

- paths conhecidos;
- hashes no manifest resolvido;
- commit não vazio;
- build ID;
- latest migration;
- release profile;
- hardening profile;
- reports existentes;
- SBOM e JAR do mesmo build;
- nenhum secret;
- nenhum path absoluto local.

---

### 35. Criar release security report

Arquivo:

```text
PROJECT_RELEASE_SECURITY_REPORT.md
```

Seções:

- scope;
- architecture;
- authentication;
- authorization;
- tenancy;
- workflow;
- data;
- privacy;
- audit;
- rate limiting;
- hardening;
- dependencies;
- backup;
- tests;
- gaps;
- decision.

Use fatos e evidências.

Não use frases vagas como:

```text
a aplicação é 100% segura.
```

---

### 36. Criar GO/NO-GO

Arquivo:

```text
PROJECT_GO_NO_GO.md
```

Baseline:

```markdown
# Decisao

## Ambiente controlado

GO_CONTROLLED.

## Producao publica

NO_GO_PUBLIC.

## Motivos

- Keycloak local.
- TLS e proxy nao validados.
- HA nao comprovada.
- load test pendente.
- backup apenas local.
- runbook sem simulacao produtiva.
- gaps abertos.

## Validade

A decisao vale somente
para o commit e os artifacts
referenciados no manifest.
```

---

### 37. Criar GoNoGoDecisionPolicyTest

Valide:

- decisão permitida;
- ambiente;
- commit reference;
- gaps;
- blockers;
- validade;
- owner;
- data;
- próxima revisão;
- `GO_PUBLIC` impossível com gap bloqueante;
- `GO_CONTROLLED` exige dados sintéticos;
- `NO_GO_PUBLIC` não é omitido.

---

### 38. Aplicar checklist de PR

Classificação:

```text
CRITICAL.
```

Superfícies:

- hardening;
- privacy;
- retention;
- backup;
- supply chain;
- release.

Evidências:

- full security gate;
- SCA;
- SBOM;
- E2E;
- backup restore;
- runbooks;
- release report;
- GO/NO-GO.

---

### 39. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=ReleaseHardeningIntegrationTest,PrivacyDataExposureTest,RetentionPolicyTest,BackupRestoreIntegrationTest,ReleaseSupplyChainPolicyTest,ReleaseEvidenceManifestTest,GoNoGoDecisionPolicyTest,SecureAccessWorkflowEndToEndTest `
  test
```

Backup restore pode exigir profile separado.

---

### 40. Executar security suite

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

Confirme:

- authn;
- authorization;
- tenant;
- SoD;
- audit;
- rate limit;
- DTOs;
- logs;
- hardening;
- privacy;
- supply chain.

---

### 41. Executar SCA e package

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

O mesmo build gera:

- JAR;
- SBOM;
- reports;
- test evidence.

---

### 42. Executar backup e restore

```powershell
.\scripts\backup-postgresql.ps1

.\scripts\restore-postgresql.ps1 `
  -TargetDatabase secure_access_restore
```

Registre:

- checksum;
- duração;
- counts;
- resultado;
- timestamp;
- ambiente.

Não versione o dump.

---

### 43. Executar smoke controlado

Inicie:

- PostgreSQL;
- Redis;
- Keycloak local;
- API release profile.

Valide:

- health;
- login PKCE;
- access token;
- create;
- queue;
- decision;
- audit;
- `401`;
- `403`;
- `404`;
- `429`;
- graceful shutdown.

Use apenas dados sintéticos.

---

### 44. Revisar evidências

Confirme que:

- commit não mudou;
- tests são do commit final;
- SBOM é do JAR;
- report é do mesmo build;
- migration é V4;
- backup é recente;
- restore passou;
- gaps estão atualizados;
- owner existe;
- nenhuma exceção expirou.

---

### 45. Emitir decisão

Resultado esperado:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

Explique:

- o que está comprovado;
- o que está pendente;
- quais controles compensam;
- qual ambiente é permitido;
- quando revisar;
- quem é owner.

---

### 46. Executar regressão completa

Parte 1:

```text
create;

read own;

list own.
```

Parte 2:

```text
queue;

decision;

audit;

rate limit;

concurrency.
```

Parte 3:

```text
hardening;

privacy;

backup;

SCA;

E2E;

release decision.
```

Nenhuma regressão pode ser ignorada.

---

### 47. Atualizar threat model final

Adicione:

```text
PTH-027:
release profile sem hardening.

PTH-028:
retenção pendente executa deleção.

PTH-029:
backup existe,
mas restore nunca foi testado.

PTH-030:
SBOM pertence a outro artifact.

PTH-031:
scanner falha
e release continua.

PTH-032:
gap bloqueante é ignorado.

PTH-033:
GO público é emitido
sem TLS ou proxy validado.

PTH-034:
evidence manifest
usa commit antigo.

PTH-035:
runbook contém secret.

PTH-036:
audit e backup
retêm dados sem policy.
```

Ligue controles e testes.

---

### 48. Atualizar checklist final

No PR:

- risco `CRITICAL`;
- owners de identidade, backend, privacidade, plataforma e supply chain;
- threat model atualizado;
- testes negativos;
- backup restore;
- SBOM;
- SCA;
- E2E;
- runbooks;
- GO/NO-GO;
- rollback;
- monitoring.

Sem campos críticos vazios.

---

## Entendendo o que foi feito

### O projeto virou release candidate

Funcionalidade, segurança e operação foram reunidas no mesmo gate.

### Hardening passou ao profile de release

A aplicação não depende de defaults locais.

### Privacidade ganhou inventário e retenção

Dados, finalidade, storage e status de aprovação ficaram explícitos.

### Backup ganhou prova de restore

O arquivo deixou de ser considerado evidência suficiente.

### Supply chain ficou ligada ao artifact

SBOM e SCA pertencem ao mesmo build do JAR.

### E2E comprovou o workflow

Requester, reviewer, auditor e isolamento entre tenants funcionam juntos.

### Gaps deixaram de ser conhecimento informal

Cada gap possui owner, blocker e compensação.

### GO/NO-GO ficou honesto

O projeto pode seguir em ambiente controlado sem fingir prontidão pública.

---

## Erros comuns importantes

### Chamar build verde de produção pronta

Testes não cobrem operação, restore ou infraestrutura real.

### Inventar prazo de retenção legal

A aplicação não decide base legal sozinha.

### Executar deleção com policy pendente

A automação precisa falhar de forma segura.

### Fazer backup sem restore

A cópia pode estar inválida.

### Gerar SBOM em outro commit

O inventário não representa o artifact.

### Ignorar scanner indisponível

A release fica sem decisão confiável.

### Publicar Actuator porque está em outra porta

A porta ainda precisa de rede confiável.

### Emitir GO público com gaps críticos

A decisão contradiz as evidências.

### Colocar secrets em runbooks

Documentação também é parte da superfície.

### Versionar dump de banco

O repositório não é storage de backup.

---

## Comandos úteis

### Testes de release

```powershell
.\mvnw.cmd `
  -Dtest=ReleaseHardeningIntegrationTest,RetentionPolicyTest,ReleaseSupplyChainPolicyTest,SecureAccessWorkflowEndToEndTest `
  test
```

### Gate de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

### SCA e package

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

### Backup

```powershell
.\scripts\backup-postgresql.ps1
```

### Restore

```powershell
.\scripts\restore-postgresql.ps1 `
  -TargetDatabase secure_access_restore
```

---

## Exercício guiado

### Parte 1 — Hardening

Crie profiles e policy tests.

### Parte 2 — Privacidade

Inventarie dados e retenção.

### Parte 3 — Retention

Implemente somente policies aprovadas.

### Parte 4 — Recovery

Execute backup e restore.

### Parte 5 — Supply chain

Gere SBOM e execute SCA.

### Parte 6 — Contracts

Feche OpenAPI e collections.

### Parte 7 — E2E

Comprove o workflow completo.

### Parte 8 — Runbooks

Documente incident, release e rollback.

### Parte 9 — Evidências

Ligue commit, artifact e reports.

### Parte 10 — Decisão

Emita GO controlado e NO-GO público.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a parte 2 foi preservada;
- profile de release inclui hardening;
- forwarded headers permanecem não confiáveis;
- Actuator usa loopback e exposure mínima;
- errors e server header não expõem internals;
- API permanece stateless;
- inventário de dados foi criado;
- token foi classificado como secret transitório;
- retention policy possui status e owner;
- policies pendentes não executam deleção;
- retention job possui batch, dry-run, audit e tenant scope;
- backup usa dados sintéticos e secret externo;
- restore ocorre em banco separado;
- checksum, counts e constraints foram validados;
- RPO e RTO foram marcados como propostos;
- SBOM foi gerada no mesmo build do JAR;
- Dependency-Check executa com failOnError;
- KEV é priorizado;
- suppressions começam vazias e governadas;
- risk register existe;
- OpenAPI final não expõe fields internos;
- collections não versionam tokens;
- E2E cobre requester, reviewer, auditor e cross-tenant;
- cenários negativos comprovam ausência de mutação;
- runbooks de incident e release foram criados;
- gaps possuem owner, prazo, blockers e compensações;
- evidence manifest liga commit, artifact, SBOM e reports;
- GO/NO-GO possui escopo e validade;
- `GO_PUBLIC` é bloqueado por gaps;
- baseline final é `GO_CONTROLLED` e `NO_GO_PUBLIC`;
- threat model e checklist foram atualizados;
- regressão das partes 1 e 2 foi executada;
- produção pública não foi liberada;
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
  "password|token-secret|BEGIN PRIVATE KEY|exposure.*\\*|show-details: *always"
```

Adicione:

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

Confirme que não entram:

- backup dump;
- `.env`;
- NVD API key;
- tokens;
- reports locais instáveis;
- cache do scanner;
- paths absolutos;
- dados pessoais;
- secrets de teste reutilizáveis.

Commit recomendado:

```powershell
git commit -m "feat(m15): finalizar projeto pratico de API segura"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

O manifest resolvido deve ser gerado pelo CI após o commit final.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto prático foi fechado como release candidate.

A aplicação agora reúne:

```text
Resource Server;

identidade local;

tenant;

ownership;

review;

segregation of duties;

If-Match;

optimistic locking;

audit;

rate limiting;

hardening;

privacy;

retention;

backup;

restore;

SBOM;

SCA;

E2E;

runbooks;

release gate.
```

A decisão não foi:

```text
está seguro para qualquer uso.
```

A decisão foi limitada e baseada em evidências:

```text
GO_CONTROLLED;

NO_GO_PUBLIC.
```

Isso reflete o estado real do laboratório.

Os gates comprovam:

- comportamento da aplicação;
- isolamento;
- workflow;
- ausência de bypass;
- contracts;
- restore local;
- supply chain;
- configuração.

Os gaps registram o que ainda não foi comprovado:

- infraestrutura produtiva;
- alta disponibilidade;
- TLS e proxy reais;
- load test;
- monitoring completo;
- rotação operacional;
- incident drill;
- aprovações legais de retenção.

A decisão central foi:

```text
uma API segura
não termina quando
a última feature funciona;

ela termina uma etapa
quando os riscos,
gates, recovery,
evidências e gaps
permitem uma decisão honesta
sobre onde o artifact
pode ou não ser utilizado.
```

O projeto prático do Módulo 15 está concluído.

A próxima aula será:

```text
450 - M15.40 - Revisao seguranca parte 1
```

Nela, você irá revisar:

- segurança como engenharia de risco;
- autenticação e autorização;
- Spring Security;
- JWT;
- OAuth 2.0;
- OpenID Connect;
- PKCE;
- Keycloak;
- identidade local;
- multi-tenancy;
- ownership;
- contratos de erro.

---

# Material complementar

## Checkpoint final

- [ ] Apliquei hardening ao profile de release.
- [ ] Documentei dados, retenção e gaps.
- [ ] Executei backup e restore.
- [ ] Gerei SBOM, SCA e E2E.
- [ ] Registrei GO controlado e NO-GO público.

---

## Troubleshooting adicional

### Profile release inicia sem hardening

Revise `spring.profiles.include` e o policy test.

### Retention job remove dados pendentes

A implementação não está filtrando `APPROVED`.

Interrompa o job e restaure os dados.

### Backup existe, mas restore falha

Verifique versão do PostgreSQL, checksum, permissions, extensions e ordem de migrations.

### SBOM não corresponde ao JAR

Ela foi gerada em outro build ou depois de mudança no POM.

### Scanner falha por NVD

Revise key, cache e mirror.

Não pule o gate.

### E2E passa sem Redis

A configuração pode estar usando mock ou fail-open.

### Actuator aparece na porta pública

Management não está separado ou o proxy publica a porta.

### GO público passou com gap aberto

O policy test de blockers não está ligado à decisão.

---

## Perguntas de revisão

1. O que é release candidate?
2. Build verde significa produção pronta?
3. O que é GO controlado?
4. O que é NO-GO público?
5. O que o hardening final cobre?
6. Secrets ficam no YAML?
7. O que o inventário registra?
8. Retenção pode ser inventada?
9. Policy pendente pode deletar?
10. Backup prova restore?
11. Onde o restore ocorre?
12. O que é RPO?
13. O que é RTO?
14. SBOM precisa corresponder a quê?
15. Scanner indisponível permite release?
16. O que o E2E comprova?
17. O que o manifest liga?
18. Gap precisa de quê?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Artifact candidato avaliado pelos gates.
2. Não.
3. Uso restrito e observado.
4. Proibição de exposição pública.
5. Surface, limits, management e errors.
6. Não.
7. Dados, finalidade, storage e retenção.
8. Não.
9. Não.
10. Não.
11. Em banco separado.
12. Perda de dados tolerada.
13. Tempo de recuperação.
14. Ao JAR e commit.
15. Não.
16. Workflow integrado.
17. Commit, artifact, SBOM e reports.
18. Owner, prazo, blocker e compensação.
19. Revisao seguranca parte 1.
20. Fundamentos e controles principais.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 449 - M15.39 - Projeto API segura parte 3

- Finalizei o projeto prático guiado do Módulo 15.
- Criei `application-hardening.yaml`.
- Criei `application-release.yaml`.
- Mantive forwarded headers sem confiança por padrão.
- Mantive Actuator em loopback.
- Mantive errors sem detalhes internos.
- Mantive a API stateless.
- Criei testes de configuração de release.
- Criei `PROJECT_DATA_PROCESSING_INVENTORY.md`.
- Classifiquei identities, justification, reasons, audit e tokens.
- Criei `PROJECT_RETENTION_POLICY.md`.
- Diferenciei policies APPROVED e LEGAL_REVIEW_REQUIRED.
- Impedi deleção automática em policy pendente.
- Criei retention job com batch, dry-run e audit.
- Criei scripts de backup e restore.
- Executei restore em PostgreSQL separado.
- Validei checksum, counts, constraints e migrations.
- Registrei RPO e RTO como metas propostas.
- Configurei CycloneDX.
- Gerei `bom.json` e `bom.xml`.
- Configurei OWASP Dependency-Check.
- Mantive `failOnError`.
- Mantive KEV como prioridade.
- Criei suppression file vazio.
- Criei dependency risk register.
- Fechei OpenAPI.
- Fechei collections sem tokens.
- Criei E2E de requester, reviewer e auditor.
- Testei approval e rejection.
- Testei cross-tenant e self-review.
- Testei Redis indisponível e hardening.
- Criei incident response runbook.
- Criei release runbook.
- Criei gaps register.
- Criei evidence manifest.
- Liguei commit, JAR, SBOM, SCA e tests.
- Criei release security report.
- Criei decisão GO/NO-GO.
- Registrei `GO_CONTROLLED`.
- Registrei `NO_GO_PUBLIC`.
- Mantive gaps de infraestrutura e operação explícitos.
- Atualizei threat model e checklist.
- Executei regressão das partes 1 e 2.
- Mantive produção pública bloqueada.
- Próxima aula: Revisao seguranca parte 1.
```

---

## Referência técnica curta

- [Spring Boot — Production-ready Features](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Spring Boot — Graceful Shutdown](https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html)
- [CycloneDX Maven Plugin](https://github.com/CycloneDX/cyclonedx-maven-plugin)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [NIST Contingency Planning Guide](https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final)

Regra final:

```text
a terceira parte do projeto de API segura deve fechar o artifact como release candidate, não como promessa de produção: hardening entra no profile de release, dados e retenção recebem decisões explícitas, backups só contam após restore, SBOM e SCA pertencem ao mesmo build do JAR, E2E comprova o workflow integrado, runbooks orientam incidentes e rollback, gaps bloqueiam ambientes incompatíveis e a decisão GO ou NO-GO vale somente para o commit, os artifacts e o contexto documentados.
```
