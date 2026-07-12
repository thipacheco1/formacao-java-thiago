# 438 - M15.28 - LGPD para backend

## Apresentação da aula

Na aula 437, a aplicação ganhou uma fronteira multi-tenant explícita.

O contexto de acesso passou a nascer de:

```text
identidade autenticada;

usuário local;

membership ativo;

tenant selecionado e validado.
```

As Ordens de Serviço passaram a ser consultadas por:

```text
tenant_id;

resource_id;

permission;

ownership.
```

O backend deixou de confiar em:

- tenant enviado no body;
- `X-Tenant-Id` sem validação;
- filtros executados apenas no frontend;
- queries globais seguidas de filtro em memória;
- roles amplas sem fronteira organizacional.

Essa evolução reduz o risco de exposição entre empresas.

Ela ainda não responde a perguntas de privacidade:

```text
quais dados pessoais existem?

por que cada dado é tratado?

quem é o titular?

qual é a origem?

onde o dado circula?

por quanto tempo permanece?

como atender acesso, correção,
bloqueio, anonimização ou eliminação?

o que acontece em logs,
caches, exports e backups?

como responder a um incidente
envolvendo dados pessoais?
```

A pergunta central desta aula será:

```text
como transformar princípios da LGPD
em controles técnicos verificáveis
sem fazer o desenvolvedor escolher
sozinho base legal, retenção
ou resposta jurídica?
```

A Lei Geral de Proteção de Dados Pessoais é:

```text
Lei nº 13.709/2018.
```

Ela regula o tratamento de dados pessoais, inclusive em meios digitais.

Esta aula possui finalidade educacional e de engenharia.

Ela não substitui orientação:

- jurídica;
- regulatória;
- do controlador;
- do encarregado;
- de segurança;
- de compliance.

O backend não decidirá sozinho:

```text
base legal;

prazo jurídico de retenção;

obrigação de conservação;

hipótese de compartilhamento;

transferência internacional;

resposta definitiva
a uma solicitação do titular.
```

Essas decisões precisam ser registradas por quem possui responsabilidade sobre o tratamento.

O papel da engenharia será:

- tornar os fluxos visíveis;
- minimizar coleta;
- limitar uso;
- proteger armazenamento;
- registrar finalidade e owner;
- aplicar retenção aprovada;
- oferecer mecanismos de atendimento;
- impedir exports inseguros;
- eliminar dados transitórios;
- suportar investigação;
- produzir evidências sem expor dados.

A prática criará inventário humano e estruturado, matriz de retenção, runbook de direitos e checklist de engenharia, todos versionados e validados por testes.

A aplicação receberá um workflow técnico para solicitações de titulares:

```text
privacy_subject_request.
```

Tipos:

```text
ACCESS;

CORRECTION;

ANONYMIZATION_REVIEW;

BLOCKING_REVIEW;

DELETION_REVIEW;

PORTABILITY_REVIEW;

CONSENT_REVOCATION_REVIEW.
```

A palavra `REVIEW` é intencional.

Nem toda solicitação significa apagar dados imediatamente.

Podem existir obrigações de conservação, prevenção à fraude, contratos, dados de terceiros, auditoria, backups e conflitos entre direitos.

A aplicação registrará a solicitação, verificará a identidade e encaminhará a decisão para o processo responsável.

Ela não executará uma exclusão irreversível baseada apenas em um clique.

Será criado um export técnico de autosserviço:

```text
GET /api/v2/privacy/me/export
```

Ele devolverá somente dados pertencentes ao usuário autenticado e ao tenant validado.

O endpoint não aceitará `userId`, `subject`, e-mail ou tenant como parâmetros livres.

A exportação terá:

- autenticação;
- autorização;
- tenant;
- ownership;
- allowlist;
- paginação limitada;
- `Cache-Control: no-store`;
- `Content-Disposition: attachment`;
- auditoria sem conteúdo;
- nenhum token;
- nenhum secret;
- nenhuma claim completa.

O export é uma capacidade técnica, não a resposta jurídica completa: dados também podem existir em fornecedores, backups, legados, tickets, analytics e documentos.

A retenção seguirá uma regra fail-safe: nenhuma deleção automática sem policy aprovada.

Categorias sem decisão terão:

```text
LEGAL_REVIEW_REQUIRED.
```

O scheduler de eliminação permanecerá desabilitado quando houver policy pendente.

A próxima aula será:

```text
439 - M15.29 - Rate limiting seguranca
```

Nela, endpoints sensíveis, inclusive login, token, export e solicitações de privacidade, receberão limites técnicos contra abuso.

---

## Onde estamos na formação

A sequência oficial é:

```text
436:
Login com Keycloak.

437:
Multi tenancy seguranca.

438:
LGPD para backend.

439:
Rate limiting seguranca.

440:
Protecao contra mass assignment.

441:
Validacao de upload segura.
```

A aula 437 respondeu:

```text
qual tenant pode acessar
cada recurso?
```

A aula 438 responderá:

```text
quais dados pessoais
devem existir,
como são protegidos
e como seu ciclo de vida
é governado?
```

Nesta aula:

```text
inventário:
sim.

classificação:
sim.

finalidade:
sim.

minimização:
sim.

retenção:
sim.

workflow de direitos:
sim.

export técnico:
sim.

correção por fonte:
sim.

análise de eliminação:
sim.

logs e auditoria:
sim.

backups:
sim.

incidentes:
sim.

decisão jurídica automática:
não.

rate limiting:
próxima aula.
```

A regra central será:

```text
privacidade não é
um endpoint isolado;

é uma propriedade do ciclo
completo de tratamento.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/db/migration/
└── V13__create_privacy_subject_request.sql
```

Domínio:

```text
domain/privacy/
├── PrivacyRequestType.java
├── PrivacyRequestStatus.java
├── PrivacySubjectRequest.java
├── RetentionAction.java
├── RetentionPolicyStatus.java
└── PersonalDataCategory.java
```

Aplicação:

```text
application/privacy/
├── PrivacySubjectRequestApplicationService.java
├── PersonalDataExportService.java
├── PersonalDataExport.java
├── RetentionDecisionService.java
├── RetentionDecision.java
└── RecentAuthenticationPolicy.java
```

Web:

```text
web/v2/privacy/
├── PrivacySubjectRequestController.java
├── CreatePrivacySubjectRequest.java
├── PrivacySubjectRequestResponse.java
└── PersonalDataExportController.java
```

Testes:

```text
DataProcessingInventoryTest;

PrivacySubjectRequestIntegrationTest;

PersonalDataExportIntegrationTest;

PrivacyLoggingPolicyTest;

RetentionDecisionServiceTest.
```

Documentação:

```text
docs/privacy/
├── data-processing-inventory.yaml
├── M15_DATA_PROCESSING_INVENTORY.md
├── M15_DATA_RETENTION_MATRIX.md
├── M15_DATA_SUBJECT_RIGHTS_RUNBOOK.md
└── M15_PRIVACY_ENGINEERING_CHECKLIST.md
```

Você irá:

1. definir dado pessoal;
2. diferenciar dado sensível;
3. diferenciar anonimização e pseudonimização;
4. mapear titulares;
5. inventariar campos;
6. mapear fluxos;
7. registrar finalidade;
8. registrar owner;
9. registrar base legal como decisão externa;
10. aplicar minimização;
11. criar workflow de solicitações;
12. verificar identidade;
13. criar export seguro;
14. limitar dados do export;
15. planejar correção;
16. avaliar eliminação;
17. modelar retenção;
18. revisar backups;
19. proteger logs;
20. criar playbook de incidentes.

---

## Conceito essencial

### Dado pessoal

Dado pessoal é informação relacionada a pessoa natural identificada ou identificável. No projeto, isso inclui nome, e-mail, endereço, username, user ID, subject OIDC, IP associado, histórico de ações e dados de Ordem de Serviço ligados a pessoa física. UUIDs também entram no inventário quando permitem singularizar ou relacionar alguém.
### Dado pessoal sensível

Dados sobre saúde, origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, vida sexual, genética ou biometria vinculada a pessoa natural exigem proteção reforçada. A API OS não precisa dessas categorias no laboratório; campos livres não autorizam sua coleta.
### Dado anonimizado

Dado anonimizado não permite identificar o titular considerando meios técnicos razoáveis e disponíveis.

Remover o nome nem sempre anonimiza.

Exemplo de combinação:

```text
endereço;

data;

tipo de serviço;

tenant;

histórico.
```

pode permitir reidentificação.

Anonimização exige avaliação de contexto e risco.

---

### Pseudonimização

Trocar nome por UUID ou hash normalmente é pseudonimização.

Ainda existe possibilidade de ligação com a pessoa por informação adicional.

Pseudonimizado continua sendo dado pessoal.

Ele pode reduzir risco, mas não remove automaticamente a aplicação da LGPD.

---

### Tratamento

Tratamento abrange coleta, acesso, uso, armazenamento, alteração, compartilhamento, extração, arquivamento e eliminação. O inventário acompanha o dado por API, banco, cache, logs, auditoria, export, backup e fornecedor.
### Controlador, operador e encarregado

O controlador decide o tratamento; o operador o executa em nome dele; o encarregado atua conforme a governança aplicável. O desenvolvedor não presume esses papéis. O inventário registra owner, controlador, operadores e contato responsável.
### Princípios como requisitos técnicos

Finalidade, adequação, necessidade, qualidade, transparência, segurança, prevenção, não discriminação e responsabilização precisam aparecer em requisitos verificáveis: por que coletar, qual mínimo, quem acessa, como corrigir, proteger, explicar e provar os controles.
### Base legal não é annotation

Não crie:

```java
@LegalBasis("legitimate_interest")
```

como se isso resolvesse a análise.

A base depende do tratamento concreto, contexto, finalidade, titular, relação e governança.

O inventário pode registrar:

```text
legalBasis:
APPROVAL_REQUIRED
```

até a decisão responsável.

O backend deve impedir automação de descarte ou compartilhamento quando a policy necessária não foi aprovada.

---

### Minimização

Minimização significa coletar somente o necessário.

No projeto:

```text
userId:
necessário para autorização.

issuer + subject:
necessários para identity linking.

email:
útil para comunicação,
não para chave.

description:
precisa de limite e orientação.

serviceAddress:
necessário quando o serviço exige local.

full token:
nunca armazenar.

password:
nunca copiar.

claims completas:
não expor.
```

O DTO deve possuir campos explícitos.

---

### Finalidade e uso secundário

Dado coletado para executar uma Ordem de Serviço não pode ser reutilizado automaticamente para marketing, scoring, enrichment, venda de base, analytics identificável ou treinamento de modelo. Cada finalidade adicional exige análise e atualização do inventário.
### Retenção

Retenção precisa responder:

```text
qual categoria?

qual finalidade?

qual evento inicia o prazo?

qual prazo aprovado?

qual obrigação impede descarte?

qual ação final?

quem aprovou?

quando revisar?
```

Evite regras vagas:

```text
guardar para sempre;

apagar depois;

manter por segurança.
```

A aplicação usará policies estruturadas.

---

### Direitos do titular

A arquitetura deve suportar informação, confirmação, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informações sobre compartilhamento, revogação de consentimento e revisão de decisões automatizadas quando aplicável. O backend registra, autentica e rastreia; ações definitivas seguem análise responsável.
### Verificação de identidade

Entregar dados ao solicitante errado cria novo incidente. A requisição é ligada ao principal autenticado e, para operações críticas, exige autenticação recente, step-up futuro ou revisão manual. Perguntas baseadas em dados facilmente conhecidos não são verificação suficiente.
### Export

Exports concentram dados. Exigem usuário autenticado, tenant validado, ownership, allowlist, limite, `no-store`, download direto, auditoria sem conteúdo e ausência de link público, e-mail automático ou tokens.
### Correção

A correção precisa respeitar a fonte de verdade.

Exemplo:

```text
preferred_username
e email do Keycloak:
corrigir no provedor.

customerName da OS:
corrigir no domínio,
se houver autorização.

issuer e subject:
não são campos editáveis.
```

Um PATCH genérico não deve alterar identidade ou tenant.

---

### Eliminação e anonimização

Excluir imediatamente pode quebrar auditoria, investigação, integridade, contrato ou obrigação de retenção. A resposta técnica pode combinar eliminação do dispensável, anonimização aprovada, bloqueio, acesso restrito e tombstones para restauração. A decisão depende do caso.
### Backups

Excluir do banco principal não remove cópias imutáveis. A policy define retenção, criptografia, acesso, restore e descarte. Após restauração, tombstones e decisões posteriores ao backup precisam ser reaplicados antes do tráfego.
### Logs e auditoria

Logs não devem conter:

- body completo;
- endereço;
- descrição;
- e-mail;
- token;
- password;
- code;
- cookie;
- export.

O audit trail pode registrar IDs controlados, tenant, action, outcome e reason code.

Ele não precisa copiar os dados tratados.

---

### Incidente com dados pessoais

Incidentes podem afetar confidencialidade, integridade, disponibilidade ou autenticidade. O backend registra tempo, sistemas, tenants, categorias, titulares, proteções e mitigação. A decisão de comunicação é do processo do controlador, que deve consultar a regulamentação vigente da ANPD em vez de depender de código antigo.
## Mão na massa guiada

### 1. Criar o inventário estruturado

Arquivo:

```text
docs/privacy/data-processing-inventory.yaml
```

Estrutura:

```yaml
version: 1

activities:
  - id: service-order-management
    name: Gestao de ordens de servico
    owner: product-service-order
    controllerDecision: APPROVAL_REQUIRED
    purposes:
      - executar o servico contratado
      - acompanhar o ciclo da ordem
    dataSubjects:
      - usuario da aplicacao
      - cliente pessoa natural quando aplicavel
    systems:
      - service-order-api
      - postgresql
      - redis
    fields:
      - path: service_order.customer_name
        category: IDENTIFICATION
        required: true
      - path: service_order.service_address
        category: LOCATION
        required: conditional
      - path: service_order.description
        category: FREE_TEXT
        required: false
    retentionPolicy: service-order-retention
```

Não registre valores reais.

---

### 2. Inventariar autenticação

Adicione atividade:

```yaml
  - id: authentication
    name: Autenticacao e controle de acesso
    owner: security
    controllerDecision: APPROVAL_REQUIRED
    purposes:
      - autenticar usuarios
      - prevenir fraude
      - autorizar operacoes
    dataSubjects:
      - usuario da aplicacao
    systems:
      - keycloak
      - application-user-database
      - security-audit
    fields:
      - path: external_identity.issuer
        category: IDENTIFIER
        required: true
      - path: external_identity.subject
        category: IDENTIFIER
        required: true
      - path: application_user.email
        category: CONTACT
        required: false
      - path: security_audit_event.actor_id
        category: IDENTIFIER
        required: false
```

Tokens e passwords aparecem como:

```text
transient;
prohibitedFromLogs;
notPersistedRaw.
```

---

### 3. Criar DataProcessingInventoryTest

O teste carrega o YAML e valida:

- ID único;
- owner preenchido;
- finalidade não vazia;
- titulares definidos;
- systems definidos;
- fields definidos;
- category conhecida;
- retention policy referenciada;
- ausência de `UNKNOWN`;
- ausência de secret;
- ausência de valores reais;
- nenhuma tabela pessoal sem inventário.

Use uma allowlist explícita para tabelas técnicas.

---

### 4. Criar o documento humano

Arquivo:

```text
docs/privacy/M15_DATA_PROCESSING_INVENTORY.md
```

Para cada atividade, documente:

- finalidade;
- categorias;
- titulares;
- origem;
- destino;
- compartilhamento;
- retenção;
- controles;
- owner;
- decisão pendente;
- data da revisão.

O YAML apoia testes e o Markdown apoia revisão humana.

---

### 5. Criar a migration V13

```sql
create table privacy_subject_request (
    id uuid primary key,
    tenant_id uuid not null,
    requester_user_id uuid not null,
    request_type varchar(40) not null,
    status varchar(30) not null,
    requested_at timestamptz not null,
    identity_verified_at timestamptz,
    due_at timestamptz,
    completed_at timestamptz,
    reason_code varchar(80),
    correlation_id varchar(100) not null,

    constraint fk_privacy_request_tenant
        foreign key (tenant_id)
        references tenant (id),

    constraint fk_privacy_request_user
        foreign key (requester_user_id)
        references application_user (id),

    constraint ck_privacy_request_type
        check (
            request_type in (
                'ACCESS',
                'CORRECTION',
                'ANONYMIZATION_REVIEW',
                'BLOCKING_REVIEW',
                'DELETION_REVIEW',
                'PORTABILITY_REVIEW',
                'CONSENT_REVOCATION_REVIEW'
            )
        ),

    constraint ck_privacy_request_status
        check (
            status in (
                'RECEIVED',
                'IDENTITY_VERIFIED',
                'IN_REVIEW',
                'COMPLETED',
                'REJECTED'
            )
        )
);
```

Não armazene documentos de identidade nessa tabela.

---

### 6. Criar índices

```sql
create index ix_privacy_request_tenant_user
    on privacy_subject_request (
        tenant_id,
        requester_user_id,
        requested_at desc
    );

create index ix_privacy_request_status_due
    on privacy_subject_request (
        status,
        due_at
    )
    where status in (
        'RECEIVED',
        'IDENTITY_VERIFIED',
        'IN_REVIEW'
    );
```

O índice apoia a fila.

---

### 7. Criar enums

```java
public enum PrivacyRequestType {
    ACCESS,
    CORRECTION,
    ANONYMIZATION_REVIEW,
    BLOCKING_REVIEW,
    DELETION_REVIEW,
    PORTABILITY_REVIEW,
    CONSENT_REVOCATION_REVIEW
}
```

```java
public enum PrivacyRequestStatus {
    RECEIVED,
    IDENTITY_VERIFIED,
    IN_REVIEW,
    COMPLETED,
    REJECTED
}
```

Não crie status:

```text
AUTO_DELETED.
```

---

### 8. Criar o aggregate

```java
@Entity
@Table(
    name = "privacy_subject_request"
)
public class PrivacySubjectRequest {

    @Id
    private UUID id;

    private UUID tenantId;

    private UUID requesterUserId;

    @Enumerated(EnumType.STRING)
    private PrivacyRequestType requestType;

    @Enumerated(EnumType.STRING)
    private PrivacyRequestStatus status;

    private Instant requestedAt;

    private Instant identityVerifiedAt;

    private Instant dueAt;

    private Instant completedAt;

    private String reasonCode;

    private String correlationId;
}
```

Não implemente `toString()` com dados.

---

### 9. Criar o request DTO

```java
public record CreatePrivacySubjectRequest(
        @NotNull
        PrivacyRequestType type
) {
}
```

O body não recebe:

- user ID;
- tenant ID;
- e-mail;
- justificativa livre;
- documentos;
- data de nascimento.

O principal autenticado define o requester.

---

### 10. Criar RecentAuthenticationPolicy

```java
@Component
public class RecentAuthenticationPolicy {

    private static final Duration MAX_AGE =
            Duration.ofMinutes(10);

    private final Clock clock;

    public void requireRecent(
            Authentication authentication
    ) {
        Instant authenticationTime =
                resolveAuthenticationTime(
                        authentication
                );

        if (
            authenticationTime == null
            || authenticationTime
                    .plus(MAX_AGE)
                    .isBefore(
                        clock.instant()
                    )
        ) {
            throw new RecentAuthenticationRequiredException();
        }
    }
}
```

Para JWT, use `iat` validado.

Para OIDC, use `auth_time` quando disponível ou a criação da sessão controlada.

Não confie em header enviado pelo cliente.

---

### 11. Criar o service de solicitações

```java
@Transactional
public PrivacySubjectRequestResult create(
        Authentication authentication,
        TenantContext tenant,
        PrivacyRequestType type,
        String correlationId
) {
    recentAuthenticationPolicy
            .requireRecent(
                    authentication
            );

    PrivacySubjectRequest request =
            PrivacySubjectRequest.receive(
                    UUID.randomUUID(),
                    tenant.tenantId(),
                    tenant.userId(),
                    type,
                    clock.instant(),
                    calculateOperationalDueAt(
                            type
                    ),
                    correlationId
            );

    repository.save(
            request
    );

    auditRecorder.recordRequired(
            privacyRequestReceivedEvent(
                    tenant,
                    request
            )
    );

    return mapper.toResult(
            request
    );
}
```

`calculateOperationalDueAt` é SLA interno revisável, não prazo legal.

---

### 12. Criar o controller

```java
@PostMapping(
    path = "/api/v2/privacy/requests",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
@PreAuthorize(
    "hasAuthority('privacy:request:create')"
)
ResponseEntity<PrivacySubjectRequestResponse>
create(
        Authentication authentication,
        TenantContext tenant,
        @Valid
        @RequestBody
        CreatePrivacySubjectRequest body,
        @RequestHeader("X-Correlation-Id")
        String correlationId
) {
    var result =
            service.create(
                    authentication,
                    tenant,
                    body.type(),
                    correlationId
            );

    return ResponseEntity
            .accepted()
            .body(
                mapper.toResponse(
                        result
                )
            );
}
```

Use `202 Accepted`.

A solicitação entra em workflow.

---

### 13. Criar PersonalDataExport

```java
public record PersonalDataExport(
        ExportMetadata metadata,
        UserData user,
        List<TenantMembershipData> memberships,
        List<ServiceOrderData> ownedServiceOrders
) {
}
```

Não inclua:

- password hash;
- refresh token hash;
- private key;
- raw audit payload;
- tokens;
- dados de outros usuários;
- dados de outros tenants.

---

### 14. Criar PersonalDataExportService

```java
@Transactional(readOnly = true)
public PersonalDataExport exportCurrentUser(
        Authentication authentication,
        TenantContext tenant
) {
    recentAuthenticationPolicy
            .requireRecent(
                    authentication
            );

    ApplicationUser user =
            userRepository
                    .findById(
                        tenant.userId()
                    )
                    .orElseThrow();

    List<TenantMembershipData> memberships =
            membershipRepository
                    .findExportableByUserId(
                        tenant.userId()
                    );

    List<ServiceOrderData> orders =
            serviceOrderRepository
                    .findExportableByTenantIdAndOwnerUserId(
                        tenant.tenantId(),
                        tenant.userId(),
                        PageRequest.of(
                            0,
                            500
                        )
                    );

    return exportAssembler.assemble(
            user,
            memberships,
            orders,
            clock.instant()
    );
}
```

O limite evita export descontrolado; volumes maiores exigem job assíncrono seguro.

---

### 15. Criar endpoint de export

```java
@GetMapping(
    path = "/api/v2/privacy/me/export",
    produces = MediaType.APPLICATION_JSON_VALUE
)
@PreAuthorize(
    "hasAuthority('privacy:self:export')"
)
ResponseEntity<PersonalDataExport>
export(
        Authentication authentication,
        TenantContext tenant
) {
    PersonalDataExport export =
            service.exportCurrentUser(
                    authentication,
                    tenant
            );

    return ResponseEntity
            .ok()
            .cacheControl(
                CacheControl.noStore()
            )
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"personal-data.json\""
            )
            .body(export);
}
```

Não aceite `userId` na rota.

---

### 16. Auditar sem conteúdo

Evento:

```text
action:
PERSONAL_DATA_EXPORT_COMPLETED.

actor:
user ID.

tenant:
tenant ID.

target:
request ID quando existir.

outcome:
SUCCESS.
```

Não registre:

- quantidade exata de campos sensíveis;
- conteúdo;
- nome;
- e-mail;
- endereço;
- arquivo;
- response body.

---

### 17. Criar a matriz de retenção

Arquivo:

```text
docs/privacy/M15_DATA_RETENTION_MATRIX.md
```

Colunas:

| Policy | Categoria | Evento inicial | Prazo | Ação | Status | Owner |
|---|---|---|---|---|---|---|
| auth-attempt | State, nonce, verifier | criação | 5 min | delete | APPROVED | security |
| access-token | Access token | emissão | 5 min | expire | APPROVED | security |
| service-order | Dados da OS | encerramento | a definir | review | LEGAL_REVIEW_REQUIRED | product/legal |
| security-audit | Evento de segurança | criação | a definir | archive/delete | LEGAL_REVIEW_REQUIRED | security/legal |
| privacy-request | Workflow | conclusão | a definir | archive/delete | LEGAL_REVIEW_REQUIRED | privacy/legal |

Não invente prazos jurídicos.

---

### 18. Criar RetentionDecisionService

```java
public RetentionDecision decide(
        RetentionPolicy policy,
        Instant createdAt,
        Instant now
) {
    if (
        policy.status()
                == RetentionPolicyStatus
                    .LEGAL_REVIEW_REQUIRED
    ) {
        return RetentionDecision.manualReview();
    }

    Instant deadline =
            policy.startFrom(
                    createdAt
            )
            .plus(
                policy.retention()
            );

    if (now.isBefore(deadline)) {
        return RetentionDecision.retain();
    }

    return switch (
        policy.action()
    ) {
        case DELETE ->
            RetentionDecision.delete();
        case ANONYMIZE ->
            RetentionDecision.anonymize();
        case ARCHIVE ->
            RetentionDecision.archive();
        case MANUAL_REVIEW ->
            RetentionDecision.manualReview();
    };
}
```

Somente policies `APPROVED` produzem ação automática.

---

### 19. Bloquear scheduler inseguro

```java
@PostConstruct
void validatePolicies() {
    boolean unsafe =
            policies.stream()
                    .anyMatch(
                        policy ->
                            policy.automatic()
                            && policy.status()
                                != APPROVED
                    );

    if (unsafe) {
        throw new IllegalStateException(
            "Automatic retention policy is not approved"
        );
    }
}
```

O scheduler permanece:

```text
disabled by default.
```

---

### 20. Planejar correção

No runbook:

```text
identity data:
corrigir na fonte de identidade.

service order data:
corrigir no domínio
com permission e audit.

audit event:
não editar;
registrar evento corretivo.

tenant:
não alterar por request genérica.
```

Correção não significa reescrever histórico imutável.

---

### 21. Planejar eliminação

Crie `ErasureAssessment`:

```java
public record ErasureAssessment(
        boolean eligible,
        Set<String> blockingReasonCodes,
        Set<String> recommendedActions
) {
}
```

Reason codes:

```text
LEGAL_RETENTION_REQUIRED;

ACTIVE_CONTRACT;

OPEN_SERVICE_ORDER;

SECURITY_INVESTIGATION;

THIRD_PARTY_DATA_PRESENT;

BACKUP_LIFECYCLE_PENDING.
```

Não inclua justificativa jurídica livre no response público.

---

### 22. Revisar free text

Campos:

```text
description;

reason;

notes.
```

precisam de:

- tamanho máximo;
- orientação;
- autorização;
- proteção em logs;
- política de conteúdo;
- revisão de necessidade.

Não tente detectar todos os dados pessoais por regex.

A prevenção principal é reduzir e estruturar campos livres.

---

### 23. Revisar logs

Atualize `PrivacyLoggingPolicyTest`.

Proíba padrões:

```text
getEmail();

getServiceAddress();

getDescription();

request.getBody();

export.toString();

user.getClaims();
```

em chamadas de log conhecidas.

O teste é guardrail e não substitui code review.

---

### 24. Revisar caches

Dados pessoais em Redis precisam:

- TTL;
- tenant na chave;
- criptografia de transporte;
- acesso restrito;
- invalidação;
- ausência de payload desnecessário.

O export nunca entra no cache.

Adicione teste:

```text
PersonalDataExport
não possui @Cacheable.
```

---

### 25. Revisar backups

Documente:

```text
backup owner;

frequência;

retenção;

criptografia;

controle de acesso;

restore test;

descarte;

tombstone replay.
```

Não exponha backups nem use dump de produção como fixture.

---

### 26. Criar runbook de direitos

Arquivo:

```text
docs/privacy/M15_DATA_SUBJECT_RIGHTS_RUNBOOK.md
```

Fluxo:

1. receber solicitação;
2. autenticar ou verificar identidade;
3. registrar correlation ID;
4. identificar escopo;
5. localizar sistemas;
6. avaliar terceiros;
7. aplicar exceções aprovadas;
8. executar ação;
9. revisar resposta;
10. entregar por canal seguro;
11. auditar conclusão;
12. aplicar retenção do próprio workflow.

---

### 27. Criar checklist de engenharia

Arquivo:

```text
docs/privacy/M15_PRIVACY_ENGINEERING_CHECKLIST.md
```

Antes de adicionar campo:

- é pessoal?
- é sensível?
- qual finalidade?
- é obrigatório?
- pode ser derivado?
- pode ser estruturado?
- quem acessa?
- entra em log?
- entra em cache?
- entra em backup?
- entra em export?
- qual retenção?
- qual descarte?
- há compartilhamento?
- há decisão automatizada?
- há dado de criança ou adolescente?
- o inventário foi atualizado?

---

### 28. Criar PrivacySubjectRequestIntegrationTest

Cenários:

- request autenticado;
- recent authentication;
- sem recent authentication;
- tenant validado;
- tenant não autorizado;
- type válido;
- body com user ID desconhecido;
- `202`;
- request persistida;
- audit sem conteúdo;
- `no-store`;
- nenhuma eliminação automática.

---

### 29. Criar PersonalDataExportIntegrationTest

Crie:

```text
Tenant Alpha;

Tenant Beta;

User Alpha;

User Beta;

OS Alpha própria;

OS Alpha de outro usuário;

OS Beta.
```

Export de User Alpha inclui:

- seus dados;
- memberships autorizados;
- OS própria do Alpha.

Não inclui:

- OS de outro usuário;
- OS do Beta;
- password hash;
- tokens;
- endereço de terceiros;
- audit payload.

---

### 30. Testar headers do export

Valide:

```text
Cache-Control:
no-store.

Content-Disposition:
attachment.

Content-Type:
application/json.

X-Content-Type-Options:
nosniff.
```

Não inclua ETag para esse export.

Não permita cache intermediário.

---

### 31. Testar recent authentication

Use `Clock` fixo.

Cenários:

```text
auth_time com 5 minutos:
permitido.

auth_time com 11 minutos:
rejeitado.

auth_time ausente:
rejeitado para export.
```

Response:

```text
401 recent_authentication_required
ou fluxo de step-up futuro.
```

Não peça password por JSON.

---

### 32. Testar inventário

Adicione uma entidade ou DTO sintético com campo pessoal não catalogado.

O teste precisa falhar.

Depois, atualize o YAML.

O objetivo é tornar o inventário parte da mudança de código.

---

### 33. Testar retenção

Cenários:

- policy aprovada e prazo ativo;
- policy aprovada e vencida;
- policy pendente;
- action delete;
- action anonymize;
- action archive;
- scheduler automático com policy pendente;
- clock no limite.

Nenhum teste usa dados reais.

---

### 34. Criar playbook de incidente

Adicione ao runbook:

```text
detectar;

conter;

preservar evidências;

identificar dados e titulares;

avaliar risco e dano;

envolver controlador,
encarregado, jurídico
e segurança;

consultar regulamentação vigente;

comunicar quando aplicável;

mitigar;

registrar lições.
```

A aplicação registra fatos e não decide sozinha a comunicação.

---

### 35. Atualizar threat model

Adicione:

```text
THR-179:
campo pessoal não inventariado.

THR-180:
dado sensível em descrição livre.

THR-181:
base legal é hardcoded.

THR-182:
retenção indefinida.

THR-183:
eliminação automática sem aprovação.

THR-184:
export aceita userId arbitrário.

THR-185:
export vaza outro tenant.

THR-186:
export entra em cache.

THR-187:
email é usado para verificar identidade.

THR-188:
backup restaura dado eliminado.

THR-189:
log contém dado pessoal.

THR-190:
pedido de titular é entregue
ao solicitante errado.

THR-191:
incidente não identifica
categorias e titulares afetados.
```

Controles:

- inventário;
- minimização;
- decisão externa;
- matriz;
- fail-safe;
- current principal;
- tenant;
- no-store;
- recent auth;
- tombstone;
- policy test;
- workflow;
- playbook.

---

### 36. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
export:
current user,
tenant e ownership.

request:
sem userId arbitrário.
```

A02 Security Misconfiguration:

```text
retenção pendente:
sem automação.

export:
no-store.
```

A09 Security Logging:

```text
dados pessoais:
minimizados.

audit:
IDs e reason codes.
```

Baseline de privacidade:

```text
inventário:
versionado.

finalidades:
registradas.

legal basis:
aprovação externa.

retenção:
policy estruturada.

direitos:
workflow técnico.

export:
minimizado.

backups:
ciclo documentado.

produção pública:
NO-GO.
```

---

### 37. Executar o gate

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=DataProcessingInventoryTest,PrivacySubjectRequestIntegrationTest,PersonalDataExportIntegrationTest,PrivacyLoggingPolicyTest,RetentionDecisionServiceTest `
  test
```

Suítes de segurança:

```powershell
.\mvnw.cmd `
  -Dtest=TenantIsolationIntegrationTest,SecurityAuditIntegrationTest,KeycloakLoginLabSecurityTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Revise:

```powershell
git grep `
  -n `
  -E `
  "log\\..*(email|address|description|claims|export)"
```

Confirme:

- V13 aplicada;
- inventory válido;
- request workflow;
- recent authentication;
- export tenant-scoped;
- no-store;
- sem cache;
- sem tokens;
- sem dados de terceiros;
- policies pendentes não automatizam;
- logs seguros;
- backups documentados;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### Dados pessoais ganharam inventário

Campos, finalidades, sistemas, titulares e owners ficaram visíveis.

### Decisão jurídica ficou fora do código

A aplicação registra aprovação pendente em vez de inventar base ou prazo.

### Direitos ganharam workflow

Solicitações são autenticadas, rastreadas e auditadas.

### Export ficou restrito ao próprio usuário

Tenant e ownership continuam aplicados.

### Retenção ficou fail-safe

Policy pendente nunca dispara descarte automático.

### Logs e caches foram revisados

Dados de alto impacto não entram em caminhos secundários sem necessidade.

### Backups entraram no ciclo de vida

Restore precisa reaplicar decisões de privacidade.

### Incidentes ganharam playbook

A engenharia fornece fatos para a decisão do controlador.

---

## Erros comuns importantes

### Tratar LGPD como banner de cookies

Backend também coleta, consulta, exporta, registra e elimina dados.

### Usar consentimento para tudo

A base precisa ser definida para cada tratamento concreto.

### Hardcode de base legal

Annotation não substitui análise responsável.

### Guardar para sempre

Ausência de prazo é uma decisão de risco, não neutralidade.

### Apagar imediatamente qualquer pedido

Direitos e obrigações precisam ser avaliados.

### Usar e-mail para verificar o titular

A identidade autenticada e controles adicionais são mais seguros.

### Exportar o banco inteiro

O export precisa de allowlist, tenant e ownership.

### Logar o export

Concentra dados pessoais em observabilidade.

### Confundir pseudonimização e anonimização

UUID ou hash reversível não torna o dado anônimo.

### Ignorar backups

O dado pode reaparecer após restore.

---

## Comandos úteis

### Testes de privacidade

```powershell
.\mvnw.cmd `
  -Dtest=DataProcessingInventoryTest,PrivacySubjectRequestIntegrationTest,PersonalDataExportIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar dados em logs

```powershell
git grep `
  -n `
  -E `
  "log\\..*(email|address|description|claims|token)"
```

### Procurar export cacheado

```powershell
git grep `
  -n `
  -E `
  "@Cacheable.*Export|PersonalDataExport.*@Cacheable"
```

### Procurar user ID arbitrário

```powershell
git grep `
  -n `
  -E `
  "privacy.*\\{userId\\}|Privacy.*userId"
```

---

## Exercício guiado

### Parte 1 — Classificação

Identifique dados pessoais e sensíveis.

### Parte 2 — Inventário

Mapeie campos, titulares, sistemas e finalidade.

### Parte 3 — Minimização

Remova campos sem requisito.

### Parte 4 — Workflow

Registre solicitações sem executar decisões automáticas.

### Parte 5 — Export

Use current principal, tenant e allowlist.

### Parte 6 — Retenção

Modele policies aprovadas e pendentes.

### Parte 7 — Eliminação

Crie análise de elegibilidade e blockers.

### Parte 8 — Observabilidade

Proteja logs, audit e cache.

### Parte 9 — Backups

Documente restore e tombstones.

### Parte 10 — Incidentes

Crie um playbook baseado em fatos.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 437 foi preservada;
- escopo educacional foi declarado e orientação jurídica não foi substituída;
- dado pessoal, sensível, anonimização e pseudonimização foram diferenciados;
- UUID foi tratado como potencial dado pessoal;
- controlador, operador, encarregado e princípios foram contextualizados;
- base legal e prazo jurídico não foram inventados pelo código;
- minimização e bloqueio de uso secundário foram aplicados;
- inventários YAML e Markdown foram criados e testados;
- atividades registram owner, finalidade, titulares, sistemas, fields e retenção;
- V13 criou `privacy_subject_request`, constraints e índices;
- request DTO não aceita user ID, tenant ID, documentos ou justificativa livre;
- autenticação recente foi exigida sem pedir password por JSON;
- workflow retorna `202` e usa SLA interno revisável;
- export usa current principal, tenant, ownership, allowlist e limite;
- export não inclui tokens, hashes, claims completas ou dados de terceiros;
- `no-store`, download como attachment e ausência de ETag foram validados;
- export não entra em cache e auditoria não registra conteúdo;
- matriz de retenção foi criada;
- policy pendente produz revisão manual;
- somente policy aprovada permite automação;
- scheduler inseguro falha no startup;
- correção respeita a fonte e não altera issuer ou subject;
- `ErasureAssessment` e blocking reason codes foram criados;
- eliminação universal e automática foi rejeitada;
- free text, logs, caches e backups foram revisados;
- restore reaplica decisões de privacidade;
- runbook de direitos e checklist de engenharia foram criados;
- requests, recent authentication, export, headers e retenção foram testados;
- cenários cross-tenant e de terceiros foram rejeitados;
- inventário incompleto falha;
- playbook de incidente foi criado sem automatizar decisão de comunicação;
- regulamentação vigente foi referenciada;
- threat model e OWASP foram atualizados;
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
  "log\\..*(email|address|description|claims|token)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/privacy `
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
git commit -m "feat(m15): aplicar privacidade e ciclo de vida de dados"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- dado pessoal real;
- documento de identidade;
- password;
- token;
- export gerado;
- dump de produção;
- base legal inventada;
- prazo jurídico sem aprovação;
- arquivo de backup;
- comunicação real de incidente;
- subject externo real.

---

## Fechamento e ponte para a próxima aula

Nesta aula, LGPD deixou de ser tratada como texto externo ao backend.

A engenharia passou a manter:

```text
inventário;

classificação;

finalidade;

owner;

minimização;

retenção;

workflow de direitos;

export seguro;

avaliação de eliminação;

proteção de logs;

ciclo de backup;

playbook de incidente.
```

O sistema não tomou decisões jurídicas sozinho e implementou uma fronteira segura:

```text
policy aprovada:
pode orientar automação.

policy pendente:
revisão manual.

pedido do titular:
workflow rastreável.

export:
current principal,
tenant e ownership.

eliminação:
avaliação,
não clique destrutivo.
```

A decisão central foi:

```text
privacy by design
significa tornar o tratamento
visível, mínimo, controlado,
explicável e eliminável
quando a policy aprovada permitir.
```

Endpoints de privacidade possuem alto valor para atacantes: exports concentram dados e solicitações podem ser abusadas.

A próxima aula será:

```text
439 - M15.29 - Rate limiting seguranca
```

Nela, você irá classificar endpoints, limitar login, refresh, privacidade e exports, combinar client, usuário, IP e tenant, responder `429` com `Retry-After` e testar limites distribuídos no Redis.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei dados pessoais e finalidades.
- [ ] Não hardcodei base legal ou retenção jurídica.
- [ ] Criei workflow autenticado para direitos.
- [ ] Protegi export com tenant, ownership e no-store.
- [ ] Documentei retenção, backups e incidentes.

---

## Troubleshooting adicional

### O teste do inventário falha após adicionar campo

Classifique o campo, registre finalidade, owner, sistema e retenção.

Não adicione `UNKNOWN` para silenciar.

### Export retorna dados de outro usuário

Revise ownership e repository method.

Não filtre apenas no assembler.

### Export retorna 401 após login antigo

A recent authentication expirou.

Implemente step-up apropriado; não aumente o prazo indefinidamente.

### Deletion review nunca conclui

Verifique blockers, owner da decisão e workflow externo.

Não remova blockers no código para acelerar.

### Scheduler não inicia

Existe policy automática sem status `APPROVED`.

Essa falha é intencional.

### E-mail aparece no log

Remova o argumento, revise exception e adicione caso ao policy test.

### Dado eliminado reaparece após restore

O processo de restauração não reaplicou tombstones ou decisões posteriores ao backup.

### Incidente está confirmado

Acione o processo organizacional, preserve evidências e consulte imediatamente a regulamentação vigente da ANPD.

---

## Perguntas de revisão

1. O que é dado pessoal?
2. UUID pode ser dado pessoal?
3. O que diferencia dado sensível?
4. Pseudonimização remove a LGPD?
5. O que é anonimização?
6. Quem decide a finalidade?
7. Base legal deve ser annotation?
8. O que é minimização?
9. O que entra no inventário?
10. O request de privacidade recebe user ID?
11. Por que exigir autenticação recente?
12. O export pode conter tokens?
13. O export pode ser cacheado?
14. Policy pendente pode apagar dados?
15. Correção altera issuer ou subject?
16. Todo pedido de eliminação apaga imediatamente?
17. O que ocorre com backups?
18. O audit copia os dados?
19. Qual é a próxima aula?
20. Qual será seu foco?

---

## Roteiro de resposta

1. Informação relacionada a pessoa identificada ou identificável.
2. Sim.
3. A natureza protegida definida pela lei.
4. Não.
5. Processo que impede identificação por meios razoáveis.
6. O controlador e sua governança.
7. Não.
8. Tratar somente o necessário.
9. Campo, finalidade, titular, sistema, owner e retenção.
10. Não.
11. Para reduzir atendimento ao impostor.
12. Não.
13. Não.
14. Não.
15. Não.
16. Não.
17. Seguem lifecycle e reaplicação após restore.
18. Não.
19. Rate limiting seguranca.
20. Proteção contra abuso de endpoints.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 438 - M15.28 - LGPD para backend

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Tratei LGPD como engenharia de ciclo de vida.
- Diferenciei dado pessoal, sensível, anonimizado e pseudonimizado.
- Registrei que UUID pode ser dado pessoal.
- Diferenciei controlador, operador e encarregado.
- Traduzi princípios de privacidade em controles técnicos.
- Não hardcodei base legal.
- Criei `docs/privacy/data-processing-inventory.yaml`.
- Criei `M15_DATA_PROCESSING_INVENTORY.md`.
- Inventariei OS, autenticação, auditoria, cache e Keycloak.
- Registrei finalidades, titulares, sistemas, fields e owners.
- Criei `DataProcessingInventoryTest`.
- Criei `V13__create_privacy_subject_request.sql`.
- Modelei tipos e status de solicitações.
- Não armazenei documentos de identidade.
- Criei `RecentAuthenticationPolicy`.
- Criei workflow com `202 Accepted`.
- Não aceitei user ID ou tenant ID no request.
- Criei `PersonalDataExport`.
- Criei export do usuário autenticado.
- Apliquei tenant e ownership.
- Usei allowlist e limite.
- Apliquei `Cache-Control: no-store`.
- Não usei ETag.
- Não expus tokens, hashes ou claims completas.
- Auditei somente metadata controlada.
- Criei `M15_DATA_RETENTION_MATRIX.md`.
- Não inventei prazos jurídicos.
- Bloqueei automação com policy pendente.
- Criei `RetentionDecisionService`.
- Criei `ErasureAssessment`.
- Modelei blockers de eliminação.
- Preservei issuer e subject como não editáveis.
- Revisei free text, logs e caches.
- Documentei lifecycle de backups e tombstones.
- Criei `M15_DATA_SUBJECT_RIGHTS_RUNBOOK.md`.
- Criei `M15_PRIVACY_ENGINEERING_CHECKLIST.md`.
- Testei request, export, recent authentication e retenção.
- Criei playbook de incidente com dados pessoais.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Rate limiting seguranca.
```

---

## Referência técnica curta

- [Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [ANPD — Direito dos Titulares](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares)
- [ANPD — Comunicação de Incidente de Segurança](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis)
- [ANPD — Regulamentações](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd)
- [ANPD — Guia de Segurança da Informação](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP User Privacy Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html)

Regra final:

```text
LGPD para backend exige visibilidade e controle sobre todo o ciclo de tratamento: dados pessoais e sensíveis precisam ser inventariados, vinculados a finalidade e owner, minimizados, protegidos em queries, caches, logs, auditoria, exports e backups, submetidos a retenção aprovada e atendidos por workflow autenticado; base legal e prazo jurídico não são inventados pelo código, export nunca recebe identidade arbitrária, pseudonimização não é anonimização e qualquer incidente precisa produzir fatos confiáveis para a decisão do controlador e para a consulta imediata da regulamentação vigente.
```
