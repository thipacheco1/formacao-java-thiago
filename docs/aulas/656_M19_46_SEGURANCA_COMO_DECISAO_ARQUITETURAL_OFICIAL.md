# 656 - M19.46 - Seguranca como decisao arquitetural

## Apresentação da aula

Na aula 655, você tratou observabilidade como decisão arquitetural.

A jornada `Confirm Appointment` ganhou perguntas operacionais, contratos de telemetria, contexto propagado, cardinalidade controlada, SLIs, SLOs, dashboards, alertas, runbooks, custo, retenção, game day e gate.

Agora a pergunta muda:

```text
a arquitetura consegue explicar
o que está acontecendo;

mas consegue impedir
que alguém faça
o que não deveria?
```

Um sistema observável ainda pode propagar tokens com privilégio excessivo, confiar demais na rede interna, autorizar apenas por role, expor dados em telemetria, usar secrets estáticos ou promover artefatos sem origem verificável.

Segurança como decisão arquitetural define desde o desenho:

- ativos, atores e trust boundaries;
- ameaças, abuso e risco residual;
- identidades humanas e de workload;
- autenticação, autorização e privilégio mínimo;
- dados permitidos em cada fronteira;
- emissão, rotação e revogação de secrets;
- confiança em dependências e artefatos;
- auditoria, detecção e resposta;
- evidências que bloqueiam ou liberam mudanças.

O laboratório será:

```text
labs/m19/aula-656-seguranca-como-decisao-arquitetural/service-scheduling-security-architecture
```

Você irá proteger a jornada `Confirm Appointment` entre Gateway, Scheduling, Capacity, Field Execution, Communication, broker, bancos, Outbox, Inbox, workers e observabilidade.

Serão criados charter, catálogo de ativos, boundaries, threat model, abuse cases, matrizes de identidade e autorização, workload identity, proteção de dados, secrets, mensageria, supply chain, auditoria, incident response, testes negativos, reports, evidence e gate.

A próxima aula será:

```text
657 - M19.47 - Dados como decisao arquitetural
```

A aula 657 aprofundará ownership, qualidade, modelagem, lifecycle, retenção, consistência, distribuição, governança e custo dos dados. Nesta aula, dados aparecem somente para classificação, minimização, proteção e autorização.

Regra central:

```text
segurança não é
uma camada adicionada no final;

é uma decisão contínua
sobre identidade,
confiança,
privilégio,
dados,
código,
operação
e resposta.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
654:
Transacoes distribuidas e Saga revisitada.

655:
Observabilidade como decisao arquitetural.

656:
Seguranca como decisao arquitetural.

657:
Dados como decisao arquitetural.

658:
Custo performance e operacao.
```

A progressão é:

```text
coordenar efeitos distribuídos;

explicar o comportamento do sistema;

proteger ativos e decisões;

tratar dados como ativo arquitetural;

equilibrar custo, performance e operação.
```

O curso já trabalhou autenticação, autorização, OAuth 2.0, OpenID Connect, JWT, Spring Security, secrets, TLS, pipelines e testes de segurança.

A aula atual não repete a configuração básica dessas ferramentas.

O foco agora é:

```text
como transformar segurança
em requisito arquitetural,
contrato entre boundaries,
critério de mudança
e capacidade operacional?
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-656-seguranca-como-decisao-arquitetural
└── service-scheduling-security-architecture
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/securityarchitecture
    │   │           ├── asset
    │   │           │   ├── SecurityAsset.java
    │   │           │   ├── AssetClassification.java
    │   │           │   ├── AssetOwner.java
    │   │           │   └── AssetCatalog.java
    │   │           ├── boundary
    │   │           │   ├── TrustBoundary.java
    │   │           │   ├── BoundaryFlow.java
    │   │           │   ├── BoundaryProtocol.java
    │   │           │   └── BoundaryCatalog.java
    │   │           ├── threat
    │   │           │   ├── Threat.java
    │   │           │   ├── ThreatCategory.java
    │   │           │   ├── ThreatScenario.java
    │   │           │   ├── ThreatRisk.java
    │   │           │   ├── ThreatControl.java
    │   │           │   └── ThreatModel.java
    │   │           ├── identity
    │   │           │   ├── Principal.java
    │   │           │   ├── HumanIdentity.java
    │   │           │   ├── WorkloadIdentity.java
    │   │           │   ├── IdentityContext.java
    │   │           │   └── IdentityAssurance.java
    │   │           ├── authorization
    │   │           │   ├── AuthorizationRequest.java
    │   │           │   ├── AuthorizationDecision.java
    │   │           │   ├── AuthorizationPolicy.java
    │   │           │   ├── PolicyDecisionPoint.java
    │   │           │   └── PolicyEnforcementPoint.java
    │   │           ├── data
    │   │           │   ├── DataClassification.java
    │   │           │   ├── ProtectedField.java
    │   │           │   ├── DataExposurePolicy.java
    │   │           │   └── DataMinimization.java
    │   │           ├── secret
    │   │           │   ├── SecretReference.java
    │   │           │   ├── SecretPolicy.java
    │   │           │   ├── SecretRotation.java
    │   │           │   └── SecretLease.java
    │   │           ├── supplychain
    │   │           │   ├── ArtifactProvenance.java
    │   │           │   ├── DependencyPolicy.java
    │   │           │   ├── SecurityFinding.java
    │   │           │   └── ReleaseAttestation.java
    │   │           ├── audit
    │   │           │   ├── SecurityAuditEvent.java
    │   │           │   ├── AuditOutcome.java
    │   │           │   ├── AuditPolicy.java
    │   │           │   └── AuditIntegrity.java
    │   │           └── gate
    │   │               ├── SecurityArchitectureGate.java
    │   │               ├── GateFinding.java
    │   │               └── GateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/securityarchitecture
    │               ├── threat
    │               │   ├── ThreatCoverageTest.java
    │               │   └── AbuseCaseTest.java
    │               ├── identity
    │               │   ├── IdentityPropagationTest.java
    │               │   └── WorkloadIdentityTest.java
    │               ├── authorization
    │               │   ├── AuthorizationMatrixTest.java
    │               │   ├── CrossTenantAuthorizationTest.java
    │               │   └── DenyByDefaultTest.java
    │               ├── data
    │               │   ├── SensitiveDataExposureTest.java
    │               │   └── DataMinimizationTest.java
    │               ├── supplychain
    │               │   ├── ProvenancePolicyTest.java
    │               │   └── DependencyPolicyTest.java
    │               └── architecture
    │                   ├── SecurityBoundaryTest.java
    │                   ├── SecretIsolationTest.java
    │                   ├── DataArchitectureNonAnticipationTest.java
    │                   └── CostPerformanceNonAnticipationTest.java
    ├── security
    │   ├── SECURITY_CHARTER.md
    │   ├── ASSET_CATALOG.md
    │   ├── ACTOR_CATALOG.md
    │   ├── TRUST_BOUNDARY_MAP.md
    │   ├── DATA_FLOW_SECURITY_MAP.md
    │   ├── THREAT_MODEL.md
    │   ├── ABUSE_CASES.md
    │   ├── IDENTITY_MATRIX.md
    │   ├── AUTHENTICATION_POLICY.md
    │   ├── AUTHORIZATION_MATRIX.md
    │   ├── WORKLOAD_IDENTITY_POLICY.md
    │   ├── SERVICE_TO_SERVICE_POLICY.md
    │   ├── DATA_PROTECTION_POLICY.md
    │   ├── SECRET_MANAGEMENT_POLICY.md
    │   ├── MESSAGING_SECURITY_POLICY.md
    │   ├── SUPPLY_CHAIN_POLICY.md
    │   ├── AUDIT_POLICY.md
    │   ├── SECURITY_OBSERVABILITY.md
    │   ├── INCIDENT_RESPONSE.md
    │   ├── OPERATING_MODEL.md
    │   ├── GAME_DAY.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_SECURITY_QUESTIONS.md
    ├── contracts
    │   ├── security-architecture-contract.yaml
    │   ├── asset-policy.yaml
    │   ├── trust-boundary-policy.yaml
    │   ├── threat-model-policy.yaml
    │   ├── identity-policy.yaml
    │   ├── authentication-policy.yaml
    │   ├── authorization-policy.yaml
    │   ├── workload-identity-policy.yaml
    │   ├── data-protection-policy.yaml
    │   ├── secret-policy.yaml
    │   ├── messaging-security-policy.yaml
    │   ├── supply-chain-policy.yaml
    │   ├── audit-policy.yaml
    │   ├── security-observability-policy.yaml
    │   ├── incident-response-policy.yaml
    │   ├── failure-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── asset-coverage-report.yaml
        ├── threat-coverage-report.yaml
        ├── authorization-coverage-report.yaml
        ├── secret-management-report.yaml
        ├── supply-chain-report.yaml
        ├── audit-integrity-report.yaml
        ├── incident-readiness-report.yaml
        ├── architecture-report.yaml
        └── security-architecture-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-security-architecture
├── validate-security-contract.ps1
├── validate-asset-catalog.ps1
├── validate-trust-boundaries.ps1
├── validate-threat-model.ps1
├── validate-identity-matrix.ps1
├── validate-authorization-matrix.ps1
├── validate-data-protection.ps1
├── validate-secret-policy.ps1
├── validate-supply-chain-policy.ps1
├── validate-audit-policy.ps1
├── run-security-architecture-tests.ps1
├── collect-security-architecture-evidence.ps1
└── verify-security-architecture-gate.ps1
```

---

## Conceito essencial

### Segurança começa pelos ativos

Antes de escolher controles, identifique o que precisa ser protegido.

Ativos da jornada:

```text
Appointment;

capacidade reservada;

identidade do cliente;

identidade do operador;

credenciais de workload;

políticas de autorização;

eventos de domínio;

Outbox e Inbox;

secrets;

artefatos de deploy;

trilha de auditoria;

disponibilidade da confirmação.
```

Um ativo pode exigir:

- confidencialidade;
- integridade;
- disponibilidade;
- autenticidade;
- rastreabilidade;
- não repúdio;
- privacidade.

Sem catálogo de ativos, controles tendem a ser genéricos e mal priorizados.

### Trust boundary é uma mudança de confiança

Trust boundary ocorre quando dados, comandos ou identidades atravessam domínios com níveis de confiança diferentes.

Exemplos:

```text
internet -> API Gateway;

Gateway -> Scheduling;

Scheduling -> broker;

broker -> Capacity consumer;

serviço -> banco;

pipeline -> registry;

runtime -> secret manager;

operador -> ferramenta administrativa.
```

Uma fronteira exige autenticação, autorização, validação, proteção de transporte, observabilidade e comportamento de falha adequados.

### Threat modeling é raciocínio, não formulário

Threat modeling responde:

```text
o que pode dar errado?

quem poderia causar?

qual ativo seria afetado?

qual caminho seria usado?

qual impacto?

quais controles existem?

qual risco residual permanece?
```

O objetivo não é prever todos os ataques.

É tornar ameaças relevantes visíveis antes que a arquitetura as consolide.

### Autenticação e autorização são decisões diferentes

Autenticação responde:

```text
quem é o principal?
```

Autorização responde:

```text
este principal
pode executar esta ação
sobre este recurso
neste contexto?
```

Um JWT válido não significa autorização suficiente.

O domínio deve proteger ações críticas com estado, tenant, ownership, propósito e risco.

### Segurança por boundary, não somente na borda

A borda externa é importante, mas não basta.

Serviços internos também precisam de identidade de workload, privilégios mínimos e autorização contextual.

Rede interna não deve ser tratada como confiança automática.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-656-seguranca-como-decisao-arquitetural/service-scheduling-security-architecture

Set-Location `
  labs/m19/aula-656-seguranca-como-decisao-arquitetural/service-scheduling-security-architecture
```

---

### 2. Criar Security Charter

Arquivo:

```text
security/SECURITY_CHARTER.md
```

Conteúdo:

```markdown
# Security Charter

Contexto:
Service Scheduling.

Jornada prioritária:
Confirm Appointment.

Objetivos:

- proteger identidade;
- preservar integridade do Appointment;
- impedir acesso cross-tenant;
- limitar privilégio de workloads;
- proteger secrets e artefatos;
- auditar decisões críticas;
- responder a incidentes.

Princípios:

- deny by default;
- least privilege;
- explicit trust boundaries;
- short-lived credentials;
- no secret in code;
- no implicit internal trust;
- data minimization;
- security evidence before release.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/security-architecture-contract.yaml
```

Conteúdo:

```yaml
securityArchitecture:
  context:
    Service-Scheduling

  required:
    - asset-catalog
    - actor-catalog
    - trust-boundary-map
    - threat-model
    - abuse-cases
    - identity-matrix
    - authentication-policy
    - authorization-matrix
    - workload-identity
    - service-to-service-policy
    - data-protection
    - secret-management
    - messaging-security
    - supply-chain-policy
    - audit-policy
    - security-observability
    - incident-response
    - tests
    - evidence
    - gate

  forbidden:
    - implicit-internal-trust
    - allow-by-default
    - shared-admin-credential
    - long-lived-static-secret
    - raw-sensitive-data-in-logs
    - token-forwarding-without-purpose
    - unsigned-release-artifact
    - unaudited-privileged-action
    - data-architecture-deep-dive
    - cost-performance-deep-dive

  nextLesson:
    code:
      M19.47
```

---

### 4. Criar Asset Catalog

Arquivo:

```text
security/ASSET_CATALOG.md
```

Para cada ativo, registre:

```text
Asset:
Appointment state.

Owner:
Scheduling Team.

Security properties:
integrity;
availability;
auditability.

Impact:
incorrect confirmation;
double capacity;
customer harm;
financial loss.

Classification:
CONFIDENTIAL_BUSINESS.

Critical operations:
confirm;
reschedule;
cancel.
```

---

### 5. Criar Security Asset

```java
package br.com.formacao.securityarchitecture.asset;

import java.util.Objects;
import java.util.Set;

public record SecurityAsset(
        String id,
        String name,
        String owner,
        AssetClassification classification,
        Set<String> requiredProperties) {

    public SecurityAsset {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(classification);
        requiredProperties = Set.copyOf(requiredProperties);

        if (requiredProperties.isEmpty()) {
            throw new IllegalArgumentException(
                    "Security properties are required");
        }
    }
}
```

---

### 6. Criar Actor Catalog

Arquivo:

```text
security/ACTOR_CATALOG.md
```

Atores:

```text
customer;

customer support operator;

field operator;

scheduling administrator;

service workload;

CI/CD workload;

security operator;

auditor;

attacker;

compromised service;

malicious insider.
```

Diferencie ator legítimo, ator privilegiado e ameaça.

---

### 7. Mapear trust boundaries

Arquivo:

```text
security/TRUST_BOUNDARY_MAP.md
```

Exemplo:

```text
Boundary:
TB-01.

From:
Customer Browser.

To:
API Gateway.

Protocol:
HTTPS.

Identity:
OIDC user token.

Controls:
TLS;
issuer validation;
audience validation;
rate limit;
request size;
input validation.

Failure:
reject.
```

Outro exemplo:

```text
Boundary:
TB-04.

From:
Scheduling.

To:
Capacity through broker.

Identity:
workload identity;
signed broker connection.

Controls:
TLS;
topic authorization;
schema validation;
message integrity;
idempotency;
consumer authorization.

Failure:
do not downgrade to anonymous publish.
```

---

### 8. Criar Trust Boundary

```java
package br.com.formacao.securityarchitecture.boundary;

import java.util.List;
import java.util.Objects;

public record TrustBoundary(
        String id,
        String source,
        String target,
        BoundaryProtocol protocol,
        String identityRequirement,
        List<String> controls,
        String failureBehavior) {

    public TrustBoundary {
        Objects.requireNonNull(id);
        Objects.requireNonNull(source);
        Objects.requireNonNull(target);
        Objects.requireNonNull(protocol);
        Objects.requireNonNull(identityRequirement);
        controls = List.copyOf(controls);

        if (controls.isEmpty()) {
            throw new IllegalArgumentException(
                    "Boundary controls are required");
        }
    }
}
```

---

### 9. Criar Data Flow Security Map

Arquivo:

```text
security/DATA_FLOW_SECURITY_MAP.md
```

Mapeie:

- origem;
- destino;
- protocolo;
- dados;
- classificação;
- identidade;
- propósito;
- armazenamento;
- retenção;
- criptografia;
- autorização;
- observabilidade;
- falha.

Não transforme o mapa em inventário completo de dados. O aprofundamento fica para a aula 657.

---

### 10. Criar Threat Model

Arquivo:

```text
security/THREAT_MODEL.md
```

Use categorias STRIDE como apoio:

```text
Spoofing;

Tampering;

Repudiation;

Information Disclosure;

Denial of Service;

Elevation of Privilege.
```

STRIDE não substitui risco de negócio.

Cada ameaça deve conectar:

```text
ativo;

ator;

boundary;

cenário;

pré-condição;

impacto;

likelihood;

controle;

risco residual;

owner.
```

---

### 11. Criar Threat

```java
package br.com.formacao.securityarchitecture.threat;

import java.util.List;
import java.util.Objects;

public record Threat(
        String id,
        ThreatCategory category,
        String assetId,
        String scenario,
        ThreatRisk risk,
        List<ThreatControl> controls,
        String owner) {

    public Threat {
        Objects.requireNonNull(id);
        Objects.requireNonNull(category);
        Objects.requireNonNull(assetId);
        Objects.requireNonNull(scenario);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(owner);
        controls = List.copyOf(controls);
    }
}
```

---

### 12. Criar cenários de ameaça

Cenários prioritários:

```text
T-001:
token de cliente usado
para confirmar Appointment
de outro tenant.

T-002:
serviço comprometido publica
AppointmentConfirmed
em tópico indevido.

T-003:
operador usa privilégio administrativo
sem justificativa.

T-004:
secret estático é copiado
entre ambientes.

T-005:
dependência maliciosa entra
no artefato de release.

T-006:
payload sensível aparece
em log ou trace.

T-007:
ataque de repetição
reenvia comando confirmado.

T-008:
mensagem é alterada
ou entregue a consumer não autorizado.

T-009:
dashboard administrativo
expõe dados além do propósito.

T-010:
flood de confirmações
esgota threads ou capacidade.
```

---

### 13. Criar Abuse Cases

Arquivo:

```text
security/ABUSE_CASES.md
```

Exemplo:

```text
Abuse Case:
confirm appointment from another tenant.

Actor:
authenticated customer.

Precondition:
valid token for tenant A.

Action:
submit appointment ID from tenant B.

Expected defense:
tenant derived from trusted identity;
resource tenant comparison;
deny;
audit;
no existence disclosure.
```

Abuse case descreve intenção adversarial.

Ele complementa o happy path funcional.

---

### 14. Classificar risco

Use uma escala explícita:

```text
impact:
1 a 5.

likelihood:
1 a 5.

risk score:
impact x likelihood.

critical:
20 a 25.

high:
12 a 19.

medium:
6 a 11.

low:
1 a 5.
```

A escala precisa ser consistente, revisável e conectada a ações.

---

### 15. Criar Identity Matrix

Arquivo:

```text
security/IDENTITY_MATRIX.md
```

Exemplo:

```text
Actor:
customer.

Identity source:
OIDC provider.

Credential:
short-lived access token.

Assurance:
MFA according to risk.

Allowed entry:
API Gateway.

Propagation:
subject reference;
tenant;
scopes;
no raw token beyond required boundary.

Revocation:
issuer policy.

Audit:
login and critical action.
```

Para workloads:

```text
Actor:
Scheduling service.

Identity source:
workload identity platform.

Credential:
short-lived certificate or token.

Allowed targets:
broker;
Scheduling database;
telemetry collector.

Forbidden:
Capacity database;
Communication database;
admin APIs.
```

---

### 16. Criar Principal

```java
package br.com.formacao.securityarchitecture.identity;

import java.util.Set;

public sealed interface Principal
        permits HumanIdentity, WorkloadIdentity {

    String principalId();

    String tenantId();

    Set<String> attributes();
}
```

A modelagem diferencia humanos de workloads.

As políticas podem compartilhar conceitos sem confundir privilégios.

---

### 17. Criar Identity Context

```java
package br.com.formacao.securityarchitecture.identity;

import java.time.Instant;
import java.util.Objects;

public record IdentityContext(
        Principal principal,
        IdentityAssurance assurance,
        Instant authenticatedAt,
        String authenticationMethod,
        String credentialId) {

    public IdentityContext {
        Objects.requireNonNull(principal);
        Objects.requireNonNull(assurance);
        Objects.requireNonNull(authenticatedAt);
        Objects.requireNonNull(authenticationMethod);
        Objects.requireNonNull(credentialId);
    }
}
```

Não registre token bruto.

`credentialId` deve ser uma referência segura para auditoria.

---

### 18. Definir Authentication Policy

Arquivo:

```text
security/AUTHENTICATION_POLICY.md
```

Regras:

```text
validar issuer;

validar audience;

validar assinatura;

validar expiração;

validar not-before;

validar algoritmo permitido;

rejeitar token sem tenant confiável;

não confiar em header enviado pelo cliente;

não reutilizar token humano
como credencial de workload;

não propagar token além do necessário.
```

---

### 19. Definir Workload Identity

Arquivo:

```text
security/WORKLOAD_IDENTITY_POLICY.md
```

Princípios:

```text
identidade por workload;

credencial curta;

rotação automática;

audience restrita;

permissão mínima;

nenhuma credencial compartilhada;

revogação possível;

emissão auditável;

ambiente identificado;

sem fallback para usuário técnico estático.
```

---

### 20. Criar política service-to-service

Arquivo:

```text
security/SERVICE_TO_SERVICE_POLICY.md
```

Para cada integração, defina:

- caller;
- target;
- workload identity;
- protocolo;
- TLS;
- audience;
- scopes;
- timeout;
- rate limit;
- retry;
- autorização;
- auditoria;
- fallback.

Rede privada não substitui identidade.

---

### 21. Criar Authorization Matrix

Arquivo:

```text
security/AUTHORIZATION_MATRIX.md
```

Exemplo:

```text
Action:
CONFIRM_APPOINTMENT.

Principal:
customer.

Required:
authenticated;
tenant matches resource;
appointment belongs to customer;
status is SCHEDULED;
confirmation window is open.

Forbidden:
cross-tenant;
impersonated operator without reason;
stale policy;
anonymous workload.
```

Outro:

```text
Action:
MANUAL_SAGA_INTERVENTION.

Principal:
security or scheduling operator.

Required:
privileged role;
ticket or finding ID;
justification;
step-up authentication;
audit.

Forbidden:
shared account;
silent override;
unbounded scope.
```

---

### 22. Criar Authorization Request

```java
package br.com.formacao.securityarchitecture.authorization;

import br.com.formacao.securityarchitecture.identity.IdentityContext;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;

public record AuthorizationRequest(
        IdentityContext identity,
        String action,
        String resourceType,
        String resourceId,
        String resourceTenant,
        Map<String, String> context,
        Instant requestedAt) {

    public AuthorizationRequest {
        Objects.requireNonNull(identity);
        Objects.requireNonNull(action);
        Objects.requireNonNull(resourceType);
        Objects.requireNonNull(resourceId);
        Objects.requireNonNull(resourceTenant);
        context = Map.copyOf(context);
        Objects.requireNonNull(requestedAt);
    }
}
```

---

### 23. Criar Authorization Decision

```java
package br.com.formacao.securityarchitecture.authorization;

import java.util.List;

public record AuthorizationDecision(
        boolean allowed,
        String policyId,
        List<String> reasons,
        List<String> obligations) {

    public AuthorizationDecision {
        reasons = List.copyOf(reasons);
        obligations = List.copyOf(obligations);
    }

    public static AuthorizationDecision deny(
            String policyId,
            String reason) {

        return new AuthorizationDecision(
                false,
                policyId,
                List.of(reason),
                List.of("AUDIT_DENIAL"));
    }
}
```

Obligations podem exigir auditoria, mascaramento, step-up ou justificativa.

---

### 24. Implementar deny by default

```java
package br.com.formacao.securityarchitecture.authorization;

public final class PolicyDecisionPoint {

    public AuthorizationDecision decide(
            AuthorizationRequest request) {

        if (!request.identity()
                .principal()
                .tenantId()
                .equals(request.resourceTenant())) {

            return AuthorizationDecision.deny(
                    "tenant-boundary-v1",
                    "TENANT_MISMATCH");
        }

        if (!"CONFIRM_APPOINTMENT"
                .equals(request.action())) {

            return AuthorizationDecision.deny(
                    "default-deny-v1",
                    "ACTION_NOT_ALLOWED");
        }

        return new AuthorizationDecision(
                true,
                "confirm-appointment-v1",
                java.util.List.of("AUTHORIZED"),
                java.util.List.of("AUDIT_ALLOW"));
    }
}
```

Complete a decisão com ownership, status, janela e risco.

---

### 25. Posicionar Policy Enforcement Points

Enforcement points:

```text
API Gateway:
autenticação e controles de borda.

Scheduling API:
autorização do use case.

Domain policy:
estado e invariantes.

Broker:
publish and consume authorization.

Database:
credencial e escopo do workload.

Administrative tool:
step-up and justification.

CI/CD:
release permissions.
```

Não dependa de um único ponto.

Cada boundary protege o que conhece.

---

### 26. Evitar confused deputy

Confused deputy ocorre quando um serviço privilegiado executa ação em nome de outro principal sem preservar contexto e propósito.

Mitigações:

- audience correta;
- delegation explícita;
- actor e subject separados;
- action bounded;
- resource bounded;
- reautorização;
- audit;
- token exchange quando aplicável;
- não encaminhar token indiscriminadamente.

---

### 27. Proteger dados

Arquivo:

```text
security/DATA_PROTECTION_POLICY.md
```

Classificações mínimas:

```text
PUBLIC;

INTERNAL;

CONFIDENTIAL_BUSINESS;

PERSONAL;

RESTRICTED_SECRET.
```

Controles:

```text
minimização;

criptografia em trânsito;

criptografia em repouso;

mascaramento;

acesso por propósito;

retenção definida;

backup protegido;

export controlado;

logs sanitizados.
```

Ownership e lifecycle completos serão aprofundados na aula 657.

---

### 28. Criar Data Exposure Policy

```java
package br.com.formacao.securityarchitecture.data;

import java.util.Set;

public record DataExposurePolicy(
        String useCase,
        Set<String> allowedFields,
        Set<String> forbiddenFields,
        String purpose,
        String owner) {

    public DataExposurePolicy {
        allowedFields = Set.copyOf(allowedFields);
        forbiddenFields = Set.copyOf(forbiddenFields);
    }

    public boolean mayExpose(String field) {
        return allowedFields.contains(field)
                && !forbiddenFields.contains(field);
    }
}
```

A API não deve retornar todos os campos por conveniência.

---

### 29. Aplicar minimização

Para confirmação, o serviço `Communication` pode precisar de:

```text
template;

channel reference;

appointment reference;

scheduled window;

locale.
```

Ele não precisa receber:

```text
capacidade interna;

credencial;

política de autorização;

histórico completo;

dados financeiros;

payload administrativo.
```

Enviar menos reduz superfície e acoplamento.

---

### 30. Criar Secret Management Policy

Arquivo:

```text
security/SECRET_MANAGEMENT_POLICY.md
```

Registre:

```text
secret nunca em código;

secret nunca em imagem;

referência separada do valor;

emissão centralizada;

credencial curta quando possível;

rotação automática;

revogação;

owner;

uso mínimo;

acesso auditado;

ambiente isolado;

no log;

no trace;

no evidence.
```

---

### 31. Criar Secret Reference

```java
package br.com.formacao.securityarchitecture.secret;

import java.util.Objects;

public record SecretReference(
        String name,
        String version,
        String purpose,
        String owner,
        String environment) {

    public SecretReference {
        Objects.requireNonNull(name);
        Objects.requireNonNull(version);
        Objects.requireNonNull(purpose);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(environment);
    }
}
```

A aplicação recebe referência ou lease, não valor persistido em configuração versionada.

---

### 32. Modelar rotação

Cenário:

```text
emitir nova versão;

disponibilizar aos consumers;

validar uso;

retirar versão anterior;

revogar;

auditar;

testar falha.
```

Rotação sem teste pode transformar controle de segurança em incidente de disponibilidade.

---

### 33. Proteger mensageria

Arquivo:

```text
security/MESSAGING_SECURITY_POLICY.md
```

Defina:

- workload identity;
- TLS;
- autorização de tópico;
- producer permitido;
- consumer permitido;
- schema;
- tamanho;
- assinatura quando necessária;
- idempotência;
- replay protection;
- retenção;
- dead letter;
- sanitização;
- auditoria.

Evento de domínio não é automaticamente público para todos os serviços.

---

### 34. Prevenir replay

Controles:

```text
message ID;

issued-at;

expiration;

deduplication;

idempotency;

nonce quando cabível;

state validation;

audience;

causation.
```

O estado do domínio ainda precisa validar se a ação é permitida.

---

### 35. Criar Supply Chain Policy

Arquivo:

```text
security/SUPPLY_CHAIN_POLICY.md
```

Requisitos:

```text
source repository protected;

review required;

branch protection;

dependency policy;

SBOM;

vulnerability scan;

secret scan;

SAST;

artifact signature;

provenance;

immutable artifact;

approved registry;

deployment identity;

environment approval;

rollback artifact retained.
```

---

### 36. Criar Artifact Provenance

```java
package br.com.formacao.securityarchitecture.supplychain;

import java.time.Instant;
import java.util.Objects;

public record ArtifactProvenance(
        String artifactDigest,
        String sourceRevision,
        String buildWorkflow,
        String builderIdentity,
        Instant builtAt,
        boolean signed,
        boolean sbomAttached) {

    public ArtifactProvenance {
        Objects.requireNonNull(artifactDigest);
        Objects.requireNonNull(sourceRevision);
        Objects.requireNonNull(buildWorkflow);
        Objects.requireNonNull(builderIdentity);
        Objects.requireNonNull(builtAt);
    }
}
```

Release deve ser promovido pelo mesmo digest.

Não reconstrua um artefato diferente para cada ambiente.

---

### 37. Definir dependency policy

Arquivo:

```text
contracts/supply-chain-policy.yaml
```

Conteúdo:

```yaml
supplyChain:
  dependencies:
    allowUnknownSource:
      false
    vulnerabilityThreshold:
      CRITICAL
    licenseReview:
      required
    staleDependencyReviewDays:
      90

  artifact:
    SBOM:
      required
    signature:
      required
    provenance:
      required
    immutableDigest:
      required

  deployment:
    privilegedSharedCredential:
      forbidden
```


---

### 38. Separar audit de diagnostic log

Arquivo:

```text
security/AUDIT_POLICY.md
```

Audit record registra:

- quem;
- identidade;
- ação;
- recurso;
- tenant;
- decisão;
- motivo;
- antes e depois quando permitido;
- timestamp;
- origem;
- finding ou ticket;
- resultado;
- integridade.

Diagnostic log serve troubleshooting.

Não trate ambos como o mesmo stream sem política.

---

### 39. Criar Security Audit Event

```java
package br.com.formacao.securityarchitecture.audit;

import java.time.Instant;
import java.util.Objects;

public record SecurityAuditEvent(
        String eventId,
        String actorId,
        String actorType,
        String action,
        String resourceType,
        String resourceId,
        String tenantId,
        AuditOutcome outcome,
        String policyId,
        String reasonCode,
        Instant occurredAt) {

    public SecurityAuditEvent {
        Objects.requireNonNull(eventId);
        Objects.requireNonNull(actorId);
        Objects.requireNonNull(actorType);
        Objects.requireNonNull(action);
        Objects.requireNonNull(resourceType);
        Objects.requireNonNull(resourceId);
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(outcome);
        Objects.requireNonNull(policyId);
        Objects.requireNonNull(reasonCode);
        Objects.requireNonNull(occurredAt);
    }
}
```

Evite registrar payload sensível.

---

### 40. Preservar integridade da auditoria

Controles possíveis:

```text
append only;

separate write permission;

restricted read;

retention policy;

clock control;

hash chaining;

signed batches;

immutable storage;

access audit;

reconciliation.
```

O laboratório não exige tecnologia específica.

---

### 41. Criar Security Observability

Arquivo:

```text
security/SECURITY_OBSERVABILITY.md
```

Sinais:

```text
authentication failures;

authorization denials;

cross-tenant attempts;

privileged actions;

secret access;

secret rotation failures;

unexpected producer;

unexpected consumer;

artifact verification failure;

audit pipeline failure;

rate-limit activation;

suspicious replay;

policy version changes.
```

Atributos continuam bounded e sanitizados.

---

### 42. Definir alertas de segurança

Alertas devem considerar:

- severidade;
- confiança;
- volume;
- impacto;
- falso positivo;
- owner;
- escalation;
- runbook;
- contenção;
- recovery.

Nem todo denial é incidente.

Tentativas cross-tenant repetidas podem ser.

---

### 43. Criar Incident Response

Arquivo:

```text
security/INCIDENT_RESPONSE.md
```

Fases:

```text
prepare;

detect;

triage;

contain;

eradicate;

recover;

verify;

communicate;

review;

improve.
```

Para cada fase, registre owner, evidência, autoridade e decisão.

---

### 44. Criar cenário de incidente

Cenário:

```text
workload identity de Communication
é usada para consumir
tópico de Capacity.

Broker registra tentativa.

Alerta dispara.

Equipe verifica
identity, topic e release.

Credencial é revogada.

Deployment é isolado.

Artefato e provenance são verificados.

Impacto é avaliado.

Serviço é restaurado
com identidade correta.

Audit e post-incident review
são concluídos.
```

---

### 45. Criar Operating Model

Arquivo:

```text
security/OPERATING_MODEL.md
```

Defina:

- security owner;
- asset owner;
- policy owner;
- identity owner;
- secret owner;
- dependency owner;
- on-call;
- incident commander;
- auditor;
- exception approver;
- review frequency;
- threat model trigger;
- rotation schedule;
- access review;
- evidence owner.

---

### 46. Definir triggers de revisão

Revisar segurança quando houver:

- novo boundary;
- novo protocolo;
- novo dado sensível;
- nova identidade;
- privilégio ampliado;
- novo tópico;
- nova integração;
- mudança de autenticação;
- alteração de retenção;
- dependência crítica;
- incidente;
- nova região;
- nova estratégia multi-tenant;
- novo fluxo administrativo.

Threat model deve evoluir.

---

### 47. Criar Game Day

Arquivo:

```text
security/GAME_DAY.md
```

Cenário:

```text
um token válido do tenant A
tenta confirmar Appointment
do tenant B.

Gateway autentica.

Scheduling compara tenant.

Policy nega.

Resposta não revela existência.

Audit registra denial.

Métrica cross-tenant aumenta.

Alerta dispara após threshold.

Runbook orienta investigação.

Nenhuma mudança de estado ocorre.
```

---

### 48. Testar autenticação inválida

Casos:

```text
issuer inválido;

audience inválida;

assinatura inválida;

token expirado;

algoritmo não permitido;

tenant ausente;

token humano usado como workload.
```

Todos devem falhar de forma explícita e sanitizada.

---

### 49. Testar autorização cross-tenant

Cenário:

1. principal do tenant A;
2. Appointment do tenant B;
3. action `CONFIRM_APPOINTMENT`;
4. policy retorna deny;
5. estado não muda;
6. resposta não revela detalhes;
7. audit registra `TENANT_MISMATCH`;
8. métrica bounded é incrementada.

---

### 50. Testar deny by default

Crie uma nova action sem policy:

```text
OVERRIDE_CAPACITY_RESERVATION
```

O sistema deve negar.

A ausência de configuração não pode liberar acesso.

---

### 51. Testar privilégio administrativo

Confirme:

- role privilegiada;
- step-up;
- justificativa;
- ticket;
- scope;
- expiração;
- audit;
- notificação;
- revisão posterior.

Usuário administrativo não deve possuir autorização ilimitada permanente.

---

### 52. Testar workload identity

Valide:

- Scheduling acessa seu banco;
- Scheduling publica tópico permitido;
- Scheduling não acessa banco de Capacity;
- Communication não consome tópico de Capacity;
- identidade compartilhada falha;
- credencial expirada falha;
- rotação mantém disponibilidade.

---

### 53. Testar dados sensíveis

Varra:

- logs;
- traces;
- reports;
- exceptions;
- evidence;
- audit;
- dead letters.

Procure:

```text
authorization header;

access token;

refresh token;

password;

email;

phone;

document;

raw payload;

connection string;

secret value.
```

O teste deve falhar quando encontrar conteúdo proibido.

---

### 54. Testar secrets

Cenários:

- secret ausente;
- versão expirada;
- rotação;
- revogação;
- acesso por workload indevido;
- log acidental;
- fallback estático.

O fallback estático deve ser proibido.

---

### 55. Testar replay

Reenvie:

```text
ConfirmAppointment command;
AppointmentConfirmed event;
ReserveCapacity reply.
```

Valide:

- message ID;
- idempotência;
- expiração;
- state check;
- audit;
- nenhum efeito duplicado.

A idempotência avançada da aula 637 continua sendo reutilizada.

---

### 56. Testar supply chain

Valide:

- SBOM presente;
- digest imutável;
- assinatura;
- provenance;
- builder identity;
- source revision;
- dependência crítica;
- secret scan;
- deploy por identidade dedicada;
- artefato não assinado bloqueado.

---

### 57. Testar auditoria

Confirme:

- allow e deny críticos;
- ordem temporal;
- integridade;
- campos mínimos;
- ausência de segredo;
- acesso restrito;
- tentativa de alteração detectada;
- retention registrada.

---

### 58. Testar incidente

Execute o game day.

Meça:

```text
time to detect;

time to triage;

time to contain;

time to revoke;

time to recover;

evidence completeness;

unauthorized effect count.
```

O resultado esperado é zero efeito não autorizado.

---

### 59. Testar arquitetura

```java
package br.com.formacao.securityarchitecture.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

public class SecretIsolationTest {

    @ArchTest
    static final ArchRule domainMustNotDependOnSecretProviders =
            noClasses()
                    .that()
                    .resideInAPackage("..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..secretprovider..");
}
```

O domínio depende de abstrações, não de vendors ou valores secretos.

---

### 60. Criar reports

Exemplo:

```yaml
securityArchitecture:
  assets:
    total:
      18
    withOwner:
      18

  trustBoundaries:
    total:
      11
    withoutIdentity:
      0

  threats:
    total:
      26
    criticalOpen:
      0
    highAccepted:
      1

  authorization:
    actions:
      14
    covered:
      14
    defaultDeny:
      true
    crossTenantFailures:
      0

  secrets:
    staticSecrets:
      0
    rotationTests:
      PASS

  supplyChain:
    SBOM:
      PASS
    signature:
      PASS
    provenance:
      PASS

  audit:
    integrity:
      PASS

  gate:
    PASS
```

---

### 61. Criar evidence

Arquivo:

```text
contracts/security-architecture-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- asset count;
- asset owner coverage;
- trust boundary count;
- boundary identity coverage;
- threat count;
- critical open threat count;
- high residual risk count;
- abuse case count;
- identity type count;
- authorization action count;
- authorization coverage;
- cross-tenant test status;
- default deny status;
- static secret count;
- rotation test status;
- SBOM status;
- signature status;
- provenance status;
- audit integrity status;
- incident game day status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- secrets;
- tokens;
- certificados;
- credenciais;
- dados pessoais;
- payloads reais;
- endpoints privados;
- topologia real;
- detalhes exploráveis de vulnerabilidade;
- arquitetura de dados completa;
- custo e performance aprofundados.

---

### 62. Criar o Gate

O gate valida:

- charter;
- assets;
- actors;
- trust boundaries;
- data flows;
- threats;
- abuse cases;
- identity;
- authentication;
- authorization;
- workload identity;
- service-to-service;
- data protection;
- secrets;
- messaging;
- supply chain;
- audit;
- observability;
- incident response;
- ownership;
- game day;
- testes;
- arquitetura;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_ASSET_CATALOG;

FAIL_TRUST_BOUNDARY;

FAIL_THREAT_MODEL;

FAIL_ABUSE_CASE;

FAIL_IDENTITY;

FAIL_AUTHENTICATION;

FAIL_AUTHORIZATION;

FAIL_CROSS_TENANT;

FAIL_WORKLOAD_IDENTITY;

FAIL_DATA_PROTECTION;

FAIL_SECRET_MANAGEMENT;

FAIL_MESSAGING_SECURITY;

FAIL_SUPPLY_CHAIN;

FAIL_AUDIT;

FAIL_SECURITY_OBSERVABILITY;

FAIL_INCIDENT_RESPONSE;

FAIL_OWNERSHIP;

FAIL_GAME_DAY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 63. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-security-architecture\validate-security-contract.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-asset-catalog.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-trust-boundaries.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-threat-model.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-identity-matrix.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-authorization-matrix.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-data-protection.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-secret-policy.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-supply-chain-policy.ps1

.\scripts\m19\service-scheduling-security-architecture\validate-audit-policy.ps1

.\scripts\m19\service-scheduling-security-architecture\run-security-architecture-tests.ps1

.\scripts\m19\service-scheduling-security-architecture\collect-security-architecture-evidence.ps1

.\scripts\m19\service-scheduling-security-architecture\verify-security-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 64. Encerrar o laboratório

Confirme:

- ativos e owners;
- atores legítimos e adversariais;
- trust boundaries;
- fluxos classificados;
- threats e abuse cases;
- riscos residuais;
- identidade humana;
- workload identity;
- autenticação explícita;
- deny by default;
- autorização por action, resource, tenant e contexto;
- policy enforcement em boundaries;
- minimização de dados;
- secrets curtos e rotacionáveis;
- mensageria protegida;
- replay controlado;
- SBOM, assinatura e provenance;
- audit separado de diagnostic log;
- security observability;
- incident response;
- game day;
- reports e evidence;
- gate aprovado;
- arquitetura de dados não antecipada;
- custo e performance não antecipados.

---

## Entendendo o que foi feito

### Ativos e boundaries ganharam proteção explícita

A arquitetura passou a declarar o que protege, quem é o owner, onde a confiança muda e quais controles cada fluxo exige.

### Ameaças ganharam contexto de negócio

Threats deixaram de ser listas genéricas.

Cada ameaça possui ativo, ator, cenário, boundary, impacto, controles, risco residual e owner.

### Identidade foi separada de autorização

Tokens válidos não liberam ações automaticamente.

A autorização considera action, resource, tenant, estado, propósito e risco.

### Workloads ganharam identidade própria

Serviços não compartilham usuários técnicos.

Cada workload possui credencial curta, audience, permissões mínimas, rotação e revogação.

### Dados e secrets ganharam minimização

Cada boundary recebe somente os campos necessários.

Secrets não ficam no código, imagem, log, trace ou evidence.

### A supply chain entrou no modelo de confiança

Código revisado não basta.

Dependências, builder, workflow, artefato, digest, SBOM, assinatura e provenance também precisam ser confiáveis.

### Segurança ganhou operação

Denials, cross-tenant attempts, secret access, artifact failures e audit failures são observáveis.

Incidentes possuem preparação, contenção, recuperação e revisão.

---

## Erros comuns importantes

### Confiar na rede interna

Um serviço comprometido pode agir dentro da rede. Use workload identity, autorização e privilégio mínimo.

### Tratar JWT válido como autorização

O token prova identidade e claims. O domínio ainda precisa autorizar recurso, tenant, estado e ação.

### Colocar toda segurança no Gateway

Mensageria, workers, bancos, ferramentas administrativas e pipelines também são boundaries.

### Propagar token humano por toda a cadeia

Isso amplia privilégio, acoplamento e impacto. Propague somente contexto e delegação necessários.

### Usar conta técnica compartilhada

A auditoria perde autoria e a revogação afeta vários workloads.

### Aceitar secret estático como fallback

O fallback tende a se tornar permanente e invisível.

### Registrar payload para facilitar diagnóstico

Logs e traces replicam dados amplamente. Use minimização, referências e campos sanitizados.

### Autorizar somente por role

Role pode ser ampla. Combine action, resource, tenant, ownership, purpose e estado.

### Fazer threat model uma vez

Novos boundaries, protocolos, dados e incidentes alteram ameaças.

### Scan sem política de bloqueio

Findings acumulam sem owner, prazo ou decisão.

### Misturar audit e log

Troubleshooting e evidência possuem objetivos, acesso e integridade diferentes.

### Antecipar arquitetura de dados

Classificação e proteção entram nesta aula; ownership e lifecycle completos ficam para a aula 657.

---

## Comandos úteis

### Validar boundaries

```powershell
.\scripts\m19\service-scheduling-security-architecture\validate-trust-boundaries.ps1
```

### Validar ameaças

```powershell
.\scripts\m19\service-scheduling-security-architecture\validate-threat-model.ps1
```

### Validar autorização

```powershell
.\scripts\m19\service-scheduling-security-architecture\validate-authorization-matrix.ps1
```

### Validar secrets

```powershell
.\scripts\m19\service-scheduling-security-architecture\validate-secret-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-security-architecture\run-security-architecture-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-security-architecture\verify-security-architecture-gate.ps1
```

---

## Exercício guiado

Escolha a jornada:

```text
Reschedule Appointment
```

Crie:

1. catálogo de ativos;
2. atores;
3. boundaries;
4. data flows;
5. threat model;
6. abuse cases;
7. identity matrix;
8. authentication policy;
9. authorization matrix;
10. workload identity;
11. data minimization;
12. secret policy;
13. messaging security;
14. supply chain controls;
15. audit events;
16. incident scenario;
17. negative tests;
18. evidence;
19. gate.

Compare confirmação e reagendamento.

Explique por que reagendamento pode exigir autorização mais forte, proteção de capacidade e auditoria adicional.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 655 e ponte para a 657 foram preservadas;
- laboratório, Security Charter, Asset Catalog e Actor Catalog foram criados;
- trust boundaries e fluxos possuem identidade, protocolo, controles e comportamento de falha;
- threat model, abuse cases, classificação de risco e risco residual foram criados;
- humanos e workloads possuem identidades distintas;
- autenticação valida issuer, audience, assinatura, tempo e tenant confiável;
- workload identity usa credenciais curtas, rotacionáveis e sem compartilhamento;
- Service-to-Service Policy define caller, target, audience, scopes, TLS e autorização;
- Authorization Matrix aplica deny by default por action, resource, tenant, estado e propósito;
- cross-tenant, privilégio administrativo e confused deputy foram testados;
- dados foram classificados, minimizados e protegidos sem vazamento em telemetria ou evidence;
- secrets estáticos, compartilhados e fallback em arquivo foram proibidos;
- rotação, revogação, mensageria e replay foram testados;
- Supply Chain Policy valida SBOM, scans, assinatura, provenance, digest e identidade de deploy;
- audit foi separado de diagnostic log e sua integridade foi validada;
- Security Observability, Incident Response, Operating Model e triggers de revisão foram criados;
- game day e testes negativos foram executados;
- reports, evidence, gate, commit e diário de bordo estão presentes;
- arquitetura de dados e custo, performance e operação não foram antecipados.

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
  labs/m19/aula-656-seguranca-como-decisao-arquitetural/service-scheduling-security-architecture `
  scripts/m19/service-scheduling-security-architecture `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|customer_email|customer_phone|customer_document|raw_payload|connection_string|productionTopology|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): tratar seguranca como decisao arquitetural"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- certificados privados;
- secrets;
- dados pessoais;
- payloads reais;
- endpoints privados;
- topologia real;
- detalhes exploráveis de vulnerabilidade;
- arquitetura de dados da aula 657;
- análise de custo da aula 658.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou segurança como decisão arquitetural.

Você criou:

```text
Security Charter;

Asset Catalog;

Actor Catalog;

Trust Boundary Map;

Data Flow Security Map;

Threat Model;

Abuse Cases;

Identity Matrix;

Authentication Policy;

Authorization Matrix;

Workload Identity Policy;

Service-to-Service Policy;

Data Protection Policy;

Secret Management Policy;

Messaging Security Policy;

Supply Chain Policy;

Audit Policy;

Security Observability;

Incident Response;

Operating Model;

Game Day;

reports, evidence e gate.
```

Você comprovou que segurança não pode ser reduzida a autenticação no Gateway ou a scans no pipeline.

A arquitetura precisa declarar ativos, boundaries, atores, ameaças, identidades, privilégios, dados, secrets, artefatos, auditoria e resposta.

Você separou autenticação de autorização, diferenciou identidade humana de workload, aplicou deny by default, protegeu tenant, recurso, estado e propósito, impediu confiança implícita na rede interna, minimizou dados, proibiu secrets estáticos, protegeu mensageria, controlou replay, exigiu SBOM, assinatura e provenance, separou audit de logs e executou um game day de tentativa cross-tenant.

A próxima aula será:

```text
657 - M19.47 - Dados como decisao arquitetural
```

Nela, você irá aprofundar como ownership, modelagem, qualidade, consistência, lifecycle, retenção, distribuição, governança, acesso, lineage e custo transformam dados em uma decisão central da arquitetura.

Nenhum aprofundamento completo de arquitetura de dados ou de custo, performance e operação foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei ativos.
- [ ] Mapeei trust boundaries.
- [ ] Criei threat model.
- [ ] Criei abuse cases.
- [ ] Diferenciei humanos e workloads.
- [ ] Modelei autenticação e autorização.
- [ ] Apliquei deny by default.
- [ ] Testei cross-tenant.
- [ ] Protegi dados e secrets.
- [ ] Protegi mensageria e supply chain.
- [ ] Criei audit e incident response.
- [ ] Executei game day e gate.

---

## Troubleshooting adicional

### O Gateway autenticou, mas o serviço aceitou outro tenant

O use case não revalidou tenant e resource ownership.

### O serviço interno recebe 403 após rotação

Verifique workload identity, audience, cache de credencial e sobreposição entre versões.

### O broker aceita qualquer producer

Revise ACL de tópico, identidade do workload e política de ambiente.

### O audit registra token

Remova credencial e mantenha apenas referência segura, actor, policy e outcome.

### O scan encontra dependência crítica

Bloqueie, atualize, substitua ou crie exceção temporária com owner, mitigação e expiração.

### A aplicação precisa de secret para iniciar

Use referência e lease; não adicione fallback em arquivo.

### O usuário administrativo consegue tudo

Reduza scope, aplique step-up, justificativa, expiração e audit.

### O teste cross-tenant revela que o recurso existe

Padronize resposta para impedir enumeração.

### O trace contém payload pessoal

Revise instrumentation, attributes, baggage e exception capture.

### O threat model tem muitas linhas sem owner

Threat sem owner não possui plano de tratamento.

### A equipe quer definir ownership de todos os dados

Preserve o aprofundamento para a aula 657.

---

## Perguntas de revisão

1. O que é ativo de segurança?
2. O que é trust boundary?
3. O que threat modeling produz?
4. Qual diferença entre autenticação e autorização?
5. O que é workload identity?
6. Por que rede interna não implica confiança?
7. O que significa deny by default?
8. O que é confused deputy?
9. Por que autorização somente por role é insuficiente?
10. O que é minimização de dados?
11. Como secrets devem ser tratados?
12. Quais controles protegem mensageria?
13. O que SBOM e provenance demonstram?
14. Qual diferença entre audit e diagnostic log?
15. Qual é a próxima aula?

---

## Roteiro de resposta

1. Algo de valor que precisa de proteção.
2. Mudança de domínio ou nível de confiança.
3. Cenários, impactos, controles e risco residual.
4. Identidade versus permissão contextual.
5. Identidade própria de serviço ou job.
6. Porque componentes internos também podem ser comprometidos.
7. Negar quando nenhuma policy permite.
8. Serviço privilegiado agindo indevidamente em nome de outro.
9. Porque faltam recurso, tenant, estado, ownership e propósito.
10. Enviar e armazenar somente o necessário.
11. Fora do código, curtos, rotacionáveis, revogáveis e auditados.
12. Identidade, TLS, ACL, schema, autorização, idempotência e replay control.
13. Componentes do software e origem verificável do artefato.
14. Evidência de ação versus informação de diagnóstico.
15. Dados como decisão arquitetural.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```text
Aula 656 - M19.46 - Seguranca como decisao arquitetural

- Tratei segurança como propriedade da arquitetura.
- Criei o laboratório `service-scheduling-security-architecture`.
- Cataloguei ativos, atores, boundaries, ameaças e abuse cases.
- Diferenciei identidade humana de workload.
- Modelei autenticação, workload identity e service-to-service.
- Implementei autorização deny by default por action, resource, tenant, estado e propósito.
- Testei acesso cross-tenant e privilégio administrativo.
- Apliquei minimização e proteção de dados.
- Criei políticas de secrets, mensageria, replay e supply chain.
- Validei SBOM, assinatura, provenance e digest.
- Separei audit de diagnostic log.
- Criei security observability, incident response e Operating Model.
- Executei game day, reports, evidence e gate.
- Não antecipei arquitetura de dados.
- Próxima aula: Dados como decisao arquitetural.
```

---

## Referência técnica curta

- Security Architecture.
- Asset.
- Trust Boundary.
- Threat Modeling.
- STRIDE.
- Abuse Case.
- Identity.
- Workload Identity.
- Authentication.
- Authorization.
- Deny by Default.
- Least Privilege.
- Confused Deputy.
- Data Minimization.
- Secret Management.
- Messaging Security.
- Replay Protection.
- SBOM.
- Artifact Provenance.
- Security Audit.
- Incident Response.

Regra final:

```text
Segurança é parte da arquitetura: Service Scheduling cataloga ativos, atores, boundaries, ameaças e riscos; identidades humanas e workloads usam credenciais curtas, audience restrita e privilégio mínimo; autenticação valida identidade e autorização aplica deny by default por action, resource, tenant, estado e propósito em Gateway, serviço, domínio, broker, banco, ferramentas e pipeline; dados são minimizados, secrets não aparecem em código ou telemetria, mensagens usam TLS, ACL, schema, idempotência e replay control, e releases exigem SBOM, assinatura, provenance e digest imutável; audit permanece separado de logs, incident response cobre detecção, contenção, recuperação e revisão, e o gate valida boundaries, threats, identities, authorization, data protection, secrets, messaging, supply chain, audit, game day, testes e evidence; dados como decisão arquitetural ficam para a aula 657 e custo, performance e operação para a 658.
```
