# 638 - M19.28 - Multi tenancy arquitetura

## Apresentação da aula

Na aula 637, você aprofundou idempotência avançada e protegeu `Service Scheduling` contra retries, reentregas, concorrência e outcomes ambíguos. Agora a arquitetura precisa atender diversos clientes na mesma plataforma sem misturar identidade, dados, configuração ou capacidade.

Esse modelo é chamado de multi-tenancy. Um `tenant` representa uma fronteira de cliente dentro de recursos que podem ser compartilhados em diferentes níveis:

```text
aplicação;
cluster;
banco;
schema;
tabelas;
cache;
fila;
observabilidade.
```

Quanto maior o compartilhamento, maior a eficiência potencial e maior a obrigação de isolamento. Por isso, multi-tenancy não é apenas adicionar `tenant_id`: é definir como o tenant é identificado, propagado, autorizado, persistido, roteado, cacheado, publicado em eventos, provisionado, migrado, limitado e auditado.

Um erro em qualquer fronteira pode fazer uma empresa acessar dados ou configurações de outra. Isolamento de tenant é propriedade de segurança e integridade, não convenção opcional.

A pergunta desta aula será:

```text
como compartilhar recursos
sem compartilhar indevidamente
identidade, dados, configuração,
capacidade e observabilidade?
```

O laboratório será:

```text
labs/m19/aula-638-multi-tenancy-arquitetura/service-scheduling-multitenancy
```

Você construirá Tenant Registry, Tenant Context, resolução autenticada, modelos de armazenamento, routing, filtros obrigatórios, cache namespacing, envelopes de eventos, configuração, onboarding, suspensão, migrations, quotas, proteção contra noisy neighbor, observabilidade, testes, reports, evidence e gate.

A próxima aula será:

```text
639 - M19.29 - Escalabilidade horizontal vertical
```

Scale up, scale out, statelessness, autoscaling e capacity planning ficam para a aula 639. Quotas e noisy neighbor aparecem aqui apenas como isolamento operacional.

Regra central:

```text
multi-tenancy segura
não depende de lembrar filtros;

depende de identidade confiável,
contexto obrigatório,
defesa em profundidade
e evidência contínua.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
636:
PACELC.

637:
Idempotencia avancada.

638:
Multi tenancy arquitetura.

639:
Escalabilidade horizontal vertical.

640:
Resiliencia arquitetural.
```

A progressão é:

```text
decidir entre latência e consistência;

repetir sem duplicar efeitos;

isolar clientes em recursos compartilhados;

escalar capacidade;

continuar operando diante de falhas.
```

Nesta aula, o foco não será ensinar um produto específico de banco ou cloud. O objetivo será construir critérios para escolher e operar uma estratégia multi-tenant em Java Backend.

Ao final, você deverá ser capaz de explicar por que escolheu shared table, schema dedicado, database dedicado ou modelo híbrido; demonstrar onde o tenant entra na identidade, segurança, persistência, cache e eventos; e provar que operações cross-tenant são bloqueadas.

---

## Objetivo prático

O laboratório será organizado em quatro blocos:

```text
service-scheduling-multitenancy
├── src/main/java/br/com/formacao/multitenancy
│   ├── tenant
│   ├── security
│   ├── routing
│   ├── appointment
│   ├── persistence
│   ├── cache
│   ├── messaging
│   ├── configuration
│   ├── lifecycle
│   ├── quota
│   └── observability
├── src/test/java/br/com/formacao/multitenancy
├── multitenancy
├── contracts
└── reports
```

O código principal conterá `TenantId`, `TenantRecord`, `TenantRegistry`, `TenantContext`, resolução autenticada, autorização, modelos de isolamento, routing de datasource, repository tenant-aware, proteção de cache, envelope de eventos, configuração, onboarding, migrations, quotas e observabilidade.

Os testes cobrirão spoofing de header, leitura e escrita cross-tenant, ausência e cleanup de contexto, identidade composta, routing, cache, mensageria, onboarding parcial, suspensão, migrations e noisy neighbor.

A documentação registrará charter, modelo de isolamento, identidade, propagação, dados, routing, cache, mensagens, configuração, lifecycle, migrations, quotas, segurança, trade-offs e questões abertas. Contracts YAML tornarão essas decisões validáveis; reports e evidence demonstrarão o resultado do gate.

Scripts:

```text
scripts/m19/service-scheduling-multitenancy
├── validate-multi-tenancy-contract.ps1
├── validate-tenant-identity.ps1
├── validate-tenant-context.ps1
├── validate-tenant-data-isolation.ps1
├── validate-tenant-routing.ps1
├── validate-tenant-cache.ps1
├── validate-tenant-messaging.ps1
├── validate-tenant-lifecycle.ps1
├── validate-tenant-migrations.ps1
├── validate-tenant-quotas.ps1
├── validate-tenant-observability.ps1
├── run-multi-tenancy-tests.ps1
├── collect-multi-tenancy-evidence.ps1
└── verify-multi-tenancy-gate.ps1
```

---

## Conceito essencial

### Tenant e fronteira de confiança

Tenant é uma unidade isolada de cliente, contrato e governança. O identificador precisa vir de uma identidade autenticada ou de uma rota interna confiável, não de um header livre aceito sem validação.

### Modelos de isolamento

Shared table usa as mesmas tabelas com `tenant_id`; schema-per-tenant separa schemas; database-per-tenant separa bancos; deployment dedicado separa também aplicação e infraestrutura. Modelos híbridos combinam estratégias conforme risco, contrato e escala.

### Defesa em profundidade

O isolamento precisa existir em resolução de identidade, autorização, contexto, repositório, banco, cache, mensageria e observabilidade. Uma única barreira não é suficiente.

### Contexto obrigatório

Toda operação tenant-scoped deve carregar `TenantContext`. Contexto ausente não significa tenant padrão: significa falha segura.

### Ciclo de vida

Onboarding, suspensão, migração e offboarding precisam ser workflows auditáveis. Criar um registro no banco não conclui o provisionamento de um tenant.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-638-multi-tenancy-arquitetura/service-scheduling-multitenancy

Set-Location `
  labs/m19/aula-638-multi-tenancy-arquitetura/service-scheduling-multitenancy
```

Crie também as pastas `multitenancy`, `contracts` e `reports`.

---

### 2. Criar Multi-Tenancy Charter

Arquivo:

```text
multitenancy/MULTI_TENANCY_CHARTER.md
```

Registre o contexto `Service Scheduling`, a definição de tenant e a estratégia inicial: aplicação, banco, schema e tabelas compartilhados com `tenant_id` obrigatório; tenants regulados ou de alto risco podem usar banco dedicado. Inclua princípios de identidade autenticada, contexto obrigatório, acesso cross-tenant negado, cache e mensagens namespaced, migrations rastreáveis, onboarding idempotente, quotas e observabilidade sanitizada. Declare autoscaling e resiliência avançada fora do escopo.

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/multi-tenancy-contract.yaml
```

Conteúdo:

```yaml
multiTenancy:
  context:
    Service-Scheduling

  required:
    - tenant-definition
    - authenticated-tenant-resolution
    - mandatory-tenant-context
    - isolation-model
    - data-isolation
    - cache-isolation
    - messaging-isolation
    - configuration-isolation
    - onboarding
    - suspension
    - migration-policy
    - quota-policy
    - audit
    - tests
    - architecture-rules

  forbidden:
    - trust-unvalidated-tenant-header
    - implicit-default-tenant
    - repository-without-tenant-boundary
    - cache-key-without-tenant
    - event-without-tenant
    - cross-tenant-admin-without-explicit-scope
    - silent-partial-onboarding
    - scalability-deep-dive

  nextLesson:
    code:
      M19.29
```

---

### 4. Definir Tenant

Arquivo:

```text
multitenancy/TENANT_DEFINITION.md
```

Registre:

```text
Tenant:
cliente corporativo isolado.

Tenant ID:
identificador interno imutável.

External Tenant Reference:
identificador comercial ou federado.

Tenant Plan:
conjunto de capacidades e limites.

Tenant Status:
PROVISIONING, ACTIVE, SUSPENDED,
OFFBOARDING ou CLOSED.
```

Não use nome, CNPJ ou domínio como chave técnica mutável.

---

### 5. Criar TenantId

```java
package br.com.formacao.multitenancy.tenant;

import java.util.Objects;
import java.util.UUID;

public record TenantId(UUID value) {

    public TenantId {
        Objects.requireNonNull(value);
    }

    public static TenantId newId() {
        return new TenantId(UUID.randomUUID());
    }
}
```

O `TenantId` deve aparecer nas identidades e contratos que realmente são tenant-scoped.

---

### 6. Criar Tenant Record

Modele `TenantRecord` com `TenantId`, referência externa, `TenantStatus`, `TenantPlan`, rota e data de criação. O registry usa esse registro para decidir se o tenant aceita tráfego e qual isolamento deve ser aplicado. Nome comercial e documento não substituem a chave técnica.

---

### 7. Comparar modelos de isolamento

Crie:

```text
multitenancy/ISOLATION_MODEL.md
```

Use a matriz:

```text
Shared table:
menor custo;
maior densidade;
maior dependência de filtros;
migrations simples;
blast radius maior.

Schema per tenant:
isolamento lógico maior;
mais objetos de banco;
migrations multiplicadas;
conexão ainda compartilhada.

Database per tenant:
isolamento e restore melhores;
maior custo operacional;
routing obrigatório;
mais conexões e migrations.

Deployment dedicated:
isolamento máximo;
custo máximo;
evolução e observabilidade separadas.
```

A escolha deve considerar risco, regulamentação, restore, volume, custo, equipe e SLO.

---

### 8. Definir modelo híbrido

O laboratório adotará:

```text
Standard tenants:
shared database + shared schema + tenant_id.

Regulated tenants:
dedicated database.

Very high volume tenants:
eligíveis para dedicated database
após avaliação arquitetural.
```

Essa decisão evita tratar todos os clientes com o modelo mais caro ou todos com o modelo menos isolado.

---

### 9. Criar TenantIsolationModel

```java
package br.com.formacao.multitenancy.routing;

public enum TenantIsolationModel {
    SHARED_TABLE,
    SCHEMA_PER_TENANT,
    DATABASE_PER_TENANT,
    DEDICATED_DEPLOYMENT
}
```

Não permita que código de negócio escolha o modelo diretamente. A decisão pertence à política de roteamento.

---

### 10. Resolver tenant pela identidade

O tenant pode vir de:

```text
claim assinado em JWT;

mapeamento de client credential;

subdomínio validado;

rota interna autenticada;

contexto de job previamente autorizado.
```

Um header como `X-Tenant-Id` pode transportar contexto entre componentes confiáveis, mas não deve ser aceito do usuário final como prova de autorização.

---

### 11. Criar TenantResolver

```java
package br.com.formacao.multitenancy.security;

import br.com.formacao.multitenancy.tenant.TenantId;
import br.com.formacao.multitenancy.tenant.TenantRecord;
import br.com.formacao.multitenancy.tenant.TenantRegistry;

public final class TenantResolver {

    private final TenantRegistry registry;

    public TenantResolver(TenantRegistry registry) {
        this.registry = registry;
    }

    public TenantRecord resolve(
            AuthenticatedPrincipal principal) {

        TenantId tenantId = principal.tenantClaim()
                .map(TenantClaim::tenantId)
                .orElseThrow(MissingTenantClaim::new);

        TenantRecord tenant = registry.require(tenantId);

        if (!tenant.acceptsTraffic()) {
            throw new TenantNotActive(tenantId);
        }

        return tenant;
    }
}
```

A resolução combina identidade autenticada e registry. O claim não substitui a verificação de status atual.

---

### 12. Criar política de identidade

Arquivo:

```text
contracts/tenant-identity-policy.yaml
```

Conteúdo:

```yaml
tenantIdentity:
  source:
    authenticated-principal

  accepted:
    - signed-tenant-claim
    - mapped-service-credential
    - trusted-internal-job-context

  rawRequestHeader:
    authorizationSource:
      false

  tenantRegistry:
    statusCheck:
      required

  missingTenant:
    action:
      DENY

  inactiveTenant:
    action:
      DENY
```

---

### 13. Criar TenantContext

```java
package br.com.formacao.multitenancy.tenant;

import java.time.Instant;
import java.util.Objects;

public record TenantContext(
        TenantId tenantId,
        String requestId,
        Instant resolvedAt,
        TenantScope scope) {

    public TenantContext {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(requestId);
        Objects.requireNonNull(resolvedAt);
        Objects.requireNonNull(scope);
    }
}
```

O contexto carrega tenant e escopo autorizados. Ele não deve carregar segredos ou objeto completo do usuário.

---

### 14. Context holder com fechamento seguro

```java
package br.com.formacao.multitenancy.tenant;

public final class TenantContextHolder {

    private static final ThreadLocal<TenantContext> CURRENT =
            new ThreadLocal<>();

    private TenantContextHolder() {
    }

    public static AutoCloseable open(TenantContext context) {
        if (CURRENT.get() != null) {
            throw new IllegalStateException(
                    "Tenant context already present");
        }

        CURRENT.set(context);
        return CURRENT::remove;
    }

    public static TenantContext requireCurrent() {
        TenantContext context = CURRENT.get();

        if (context == null) {
            throw new MissingTenantContext();
        }

        return context;
    }
}
```

Em aplicações reativas ou assíncronas, `ThreadLocal` não é suficiente. Use o mecanismo de contexto da stack e propague explicitamente. O exemplo demonstra a obrigação de abrir e remover o escopo.

---

### 15. Criar context policy

Arquivo:

```text
contracts/tenant-context-policy.yaml
```

Conteúdo:

```yaml
tenantContext:
  requiredFor:
    - command
    - query
    - repository
    - cache
    - message-production
    - message-consumption
    - scheduled-tenant-job

  missing:
    action:
      FAIL_CLOSED

  defaultTenant:
    forbidden

  propagation:
    explicit:
      required

  cleanup:
    afterRequest:
      required
```

---

### 16. Modelar identidade composta

Em shared table, `AppointmentId` isolado pode não ser suficiente se IDs puderem colidir ou aparecer em URLs manipuláveis.

Crie:

```java
package br.com.formacao.multitenancy.appointment;

import br.com.formacao.multitenancy.tenant.TenantId;
import java.util.Objects;

public record TenantAppointmentKey(
        TenantId tenantId,
        AppointmentId appointmentId) {

    public TenantAppointmentKey {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(appointmentId);
    }
}
```

Use índices e constraints compatíveis com a identidade composta.

---

### 17. Criar estrutura SQL shared table

Exemplo:

```sql
create table appointment (
    tenant_id uuid not null,
    appointment_id uuid not null,
    status varchar(40) not null,
    starts_at timestamp with time zone not null,
    ends_at timestamp with time zone not null,
    version bigint not null,
    primary key (tenant_id, appointment_id)
);

create index idx_appointment_tenant_status
    on appointment (tenant_id, status);
```

Coloque `tenant_id` nos índices usados por consultas tenant-scoped. Caso contrário, isolamento lógico pode existir e performance degradar de forma desnecessária.

---

### 18. Criar repository tenant-aware

```java
package br.com.formacao.multitenancy.appointment;

import br.com.formacao.multitenancy.tenant.TenantId;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository {

    Optional<Appointment> findById(
            TenantId tenantId,
            AppointmentId appointmentId);

    List<Appointment> findScheduled(
            TenantId tenantId);

    void save(
            TenantId tenantId,
            Appointment appointment);
}
```

O contrato torna impossível chamar o repositório sem tenant de forma acidental.

---

### 19. Aplicar TenantGuard

```java
package br.com.formacao.multitenancy.persistence;

import br.com.formacao.multitenancy.tenant.TenantContext;
import br.com.formacao.multitenancy.tenant.TenantId;

public final class TenantGuard {

    public void requireSameTenant(
            TenantContext context,
            TenantId resourceTenantId) {

        if (!context.tenantId().equals(resourceTenantId)) {
            throw new CrossTenantResourceAccess(
                    context.tenantId(),
                    resourceTenantId);
        }
    }
}
```

O guard protege writes e respostas carregadas de fontes indiretas.

---

### 20. Defesa no banco

Quando o banco suporta políticas de segurança por linha, elas podem adicionar uma camada de proteção. Ainda assim, a aplicação precisa definir corretamente o tenant da sessão e testar o comportamento.

Defesa em profundidade recomendada:

```text
claim autenticado;

TenantContext obrigatório;

repository com tenant explícito;

predicate obrigatório;

constraint composta;

row-level policy quando disponível;

testes de isolamento.
```

Nenhuma camada isolada elimina as demais.

---

### 21. Criar tenant-data-policy

Arquivo:

```text
contracts/tenant-data-policy.yaml
```

Conteúdo:

```yaml
tenantData:
  sharedTable:
    tenantColumn:
      required
    compositeKey:
      required
    queryPredicate:
      required
    indexPrefix:
      tenant-first-when-applicable

  repository:
    tenantArgument:
      required

  missingPredicate:
    action:
      FAIL

  crossTenantJoin:
    default:
      forbidden

  bulkOperation:
    explicitTenantScope:
      required
```

---

### 22. Roteamento para database dedicado

Crie `TenantRoute`:

```java
package br.com.formacao.multitenancy.routing;

import br.com.formacao.multitenancy.tenant.TenantId;
import java.util.Objects;

public record TenantRoute(
        TenantId tenantId,
        TenantIsolationModel isolationModel,
        String dataSourceKey,
        String schemaName) {

    public TenantRoute {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(isolationModel);
        Objects.requireNonNull(dataSourceKey);
    }
}
```

`schemaName` pode ser vazio nos modelos que não usam schema dedicado.

---

### 23. Criar TenantDataSourceRouter

```java
package br.com.formacao.multitenancy.routing;

import br.com.formacao.multitenancy.tenant.TenantContext;
import br.com.formacao.multitenancy.tenant.TenantContextHolder;

public final class TenantDataSourceRouter {

    private final TenantRoutingPolicy routingPolicy;

    public String currentDataSourceKey() {
        TenantContext context =
                TenantContextHolder.requireCurrent();

        TenantRoute route = routingPolicy.route(
                context.tenantId());

        return route.dataSourceKey();
    }
}
```

A rota deve ser resolvida antes da abertura da transação. Alterar tenant dentro da mesma transação é proibido.

---

### 24. Política de roteamento

Arquivo:

```text
contracts/tenant-routing-policy.yaml
```

Conteúdo:

```yaml
tenantRouting:
  source:
    tenant-registry

  beforeTransaction:
    required

  routeMutationDuringTransaction:
    forbidden

  unknownRoute:
    action:
      DENY

  dedicatedDatabase:
    connectionPool:
      bounded:
        required

  fallbackToSharedDatabase:
    forbidden
```

Um erro de rota nunca deve cair silenciosamente no banco compartilhado.

---

### 25. Cache tenant-aware

Um cache incorreto pode vazar dados mesmo quando o banco está protegido.

Chave insegura:

```text
appointment:42
```

Chave segura:

```text
tenant:{tenantId}:appointment:{appointmentId}
```

Crie:

```java
package br.com.formacao.multitenancy.cache;

import br.com.formacao.multitenancy.appointment.AppointmentId;
import br.com.formacao.multitenancy.tenant.TenantId;

public record TenantCacheKey(
        TenantId tenantId,
        AppointmentId appointmentId) {

    public String value() {
        return "tenant:%s:appointment:%s".formatted(
                tenantId.value(),
                appointmentId.value());
    }
}
```

---

### 26. Criar cache policy

Arquivo:

```text
contracts/tenant-cache-policy.yaml
```

Conteúdo:

```yaml
tenantCache:
  key:
    tenantId:
      required

  namespace:
    environment:
      required
    application:
      required
    tenant:
      required

  globalCache:
    allowlist:
      required

  invalidation:
    tenantScoped:
      required

  crossTenantCollision:
    action:
      FAIL
```

Catálogos realmente globais precisam de allowlist explícita. Não transforme qualquer dado em global por conveniência.

---

### 27. Eventos com tenant explícito

O envelope de evento precisa carregar tenant:

```java
package br.com.formacao.multitenancy.messaging;

import br.com.formacao.multitenancy.tenant.TenantId;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record TenantEventEnvelope<T>(
        UUID eventId,
        TenantId tenantId,
        String eventType,
        Instant occurredAt,
        T payload) {

    public TenantEventEnvelope {
        Objects.requireNonNull(eventId);
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(eventType);
        Objects.requireNonNull(occurredAt);
        Objects.requireNonNull(payload);
    }
}
```

O consumer abre `TenantContext` a partir do envelope somente depois de validar origem, contrato e tenant ativo.

---

### 28. Criar TenantMessageGuard

```java
package br.com.formacao.multitenancy.messaging;

import br.com.formacao.multitenancy.tenant.TenantRegistry;

public final class TenantMessageGuard {

    private final TenantRegistry registry;

    public void validate(TenantEventEnvelope<?> envelope) {
        if (!registry.require(envelope.tenantId()).acceptsTraffic()) {
            throw new TenantMessageRejected(
                    envelope.tenantId(),
                    envelope.eventId());
        }
    }
}
```

Mensagens de tenant suspenso podem ser quarentenizadas ou tratadas por workflow específico. Não as misture com mensagens inválidas genéricas.

---

### 29. Mensageria compartilhada ou dedicada

Opções:

```text
mesmo tópico com tenant no envelope;

tópico por grupo de tenants;

tópico dedicado para tenant regulado;

broker dedicado em casos excepcionais.
```

A decisão considera volume, contrato, replay, retenção, ACL, custo e blast radius. Tópico por tenant pode se tornar operacionalmente inviável em grande quantidade.

---

### 30. Criar messaging policy

Arquivo:

```text
contracts/tenant-messaging-policy.yaml
```

Conteúdo:

```yaml
tenantMessaging:
  envelope:
    tenantId:
      required

  producer:
    tenantContextMatch:
      required

  consumer:
    validateTenant:
      required
    openTenantContext:
      required
    closeTenantContext:
      required

  partitionKey:
    mayIncludeTenant:
      true

  deadLetter:
    preserveTenantMetadata:
      required

  eventWithoutTenant:
    action:
      QUARANTINE
```

---

### 31. Configuração por tenant

Configurações possíveis:

```text
timezone;

janelas de agendamento;

features habilitadas;

limites de operação;

templates de comunicação;

políticas de confirmação;

integrações contratadas.
```

Configuração não deve ser espalhada em `if tenant == X` no código.

---

### 32. Criar TenantConfiguration

Modele configuração com `TenantId`, timezone, features habilitadas e versão positiva. A versão permite cache seguro, auditoria e rollout controlado. A configuração deve ser imutável para cada revisão e substituída por uma nova versão.

---

### 33. Criar configuration policy

Arquivo:

```text
contracts/tenant-configuration-policy.yaml
```

Conteúdo:

```yaml
tenantConfiguration:
  storage:
    tenantScoped:
      required

  version:
    required

  cacheKey:
    tenantId:
      required

  fallback:
    safeDefaultOnly:
      true

  hardcodedTenantBranch:
    forbidden

  change:
    audit:
      required
```

Safe default significa comportamento conscientemente permitido, não configuração de outro tenant.

---

### 34. Onboarding como workflow

Provisionar tenant pode exigir:

```text
criar registry record;

reservar external reference;

criar banco ou schema;

aplicar migrations;

criar configuração inicial;

registrar credenciais federadas;

criar quotas;

validar conectividade;

executar smoke test;

ativar tenant.
```

Enquanto o workflow não termina, o status permanece `PROVISIONING`.

---

### 35. Criar TenantOnboardingService

Implemente um orquestrador que execute passos de provisionamento em ordem, registre o resultado de cada etapa e interrompa a ativação quando houver falha. Cada passo precisa ser idempotente ou possuir compensação e recovery explícitos, aplicando os fundamentos da aula 637.

---

### 36. Política de onboarding

Arquivo:

```text
contracts/tenant-lifecycle-policy.yaml
```

Conteúdo:

```yaml
tenantLifecycle:
  onboarding:
    state:
      PROVISIONING
    steps:
      - registry
      - route
      - data-store
      - migration
      - configuration
      - identity-mapping
      - quota
      - smoke-test
    activationAfterAllSteps:
      required

  partialProvisioning:
    visible:
      required

  retry:
    idempotent:
      required

  suspension:
    newCommands:
      deny
    readPolicy:
      explicit

  offboarding:
    retentionAndDeletionPlan:
      required
```

---

### 37. Suspensão

Suspensão não é exclusão.

Defina comportamento para:

```text
novos commands;

leituras administrativas;

jobs pendentes;

mensagens em trânsito;

callbacks externos;

acesso de suporte;

retenção de dados.
```

O padrão do laboratório negará novo tráfego de negócio, preservará auditoria e enviará mensagens pendentes para tratamento controlado.

---

### 38. Offboarding

Offboarding exige plano para exportação, retenção legal, revogação de credenciais, parada de integrações, drenagem de mensagens, exclusão ou anonimização, destruição de chaves e evidência final.

Não execute `delete from tenant` como única etapa.

---

### 39. Migrations multi-tenant

Shared table executa migration uma vez, mas afeta todos os tenants.

Schema-per-tenant e database-per-tenant multiplicam execuções. Por isso, registre:

```text
tenant;

rota;

versão atual;

versão alvo;

status;

início e fim;

erro seguro;

retry;

rollback ou forward fix.
```

---

### 40. Criar migration policy

Arquivo:

```text
contracts/tenant-migration-policy.yaml
```

Conteúdo:

```yaml
tenantMigration:
  inventory:
    required

  perTenantStatus:
    required

  compatibility:
    expandContract:
      preferred

  failure:
    stopGlobalRolloutThreshold:
      required

  retry:
    safe:
      required

  unknownSchemaVersion:
    action:
      BLOCK_TENANT_TRAFFIC

  evidence:
    required
```

Use mudanças compatíveis quando aplicações e bancos puderem ficar temporariamente em versões diferentes.

---

### 41. Quotas e noisy neighbor

Noisy neighbor ocorre quando um tenant consome recursos compartilhados e degrada os demais.

Controles possíveis:

```text
rate limit por tenant;

limite de concorrência;

quota de jobs;

limite de exportação;

prioridade de fila;

budget de cache;

timeout por operação;

circuito de proteção por tenant.
```

O objetivo desta aula é isolar impacto. A estratégia completa de escala será aprofundada na aula 639.

---

### 42. Criar TenantQuota

Modele `TenantQuota` com limites de requisições por minuto, commands concorrentes, exports ativos e jobs enfileirados. Rejeite valores inválidos na construção e mantenha a quota ligada ao `TenantId`.

---

### 43. Criar TenantQuotaGuard

O guard consulta quota e uso atual, classifica a operação e retorna decisão explícita de permitir, limitar temporariamente ou negar por contrato. A decisão precisa gerar métrica e não pode consumir o pool global antes da avaliação.

---

### 44. Criar quota policy

Arquivo:

```text
contracts/tenant-quota-policy.yaml
```

Conteúdo:

```yaml
tenantQuota:
  dimensions:
    - requests-per-minute
    - concurrent-commands
    - active-exports
    - queued-jobs

  decision:
    tenantScoped:
      required

  limitExceeded:
    explicitResponse:
      required

  oneTenantMustNotExhaustSharedPool:
    true

  autoscalingDeepDive:
    deferredToLesson639
```

---

### 45. Observabilidade multi-tenant

Você precisa investigar um incidente por tenant sem criar cardinalidade descontrolada ou expor identidade comercial sensível.

Registre em logs estruturados:

```text
tenant internal ID ou alias seguro;

request ID;

operation;

route model;

outcome;

policy decision;

security finding ID.
```

Métricas podem usar tier, isolation model e plano. Tenant individual como tag deve ser avaliado conforme quantidade e ferramenta.

---

### 46. Criar observability policy

Arquivo:

```text
contracts/tenant-observability-policy.yaml
```

Conteúdo:

```yaml
tenantObservability:
  logs:
    required:
      - tenant-alias
      - request-id
      - operation
      - outcome
      - isolation-model

  traces:
    tenantContext:
      required

  metrics:
    boundedCardinality:
      required

  security:
    crossTenantAttempt:
      alert:
        required

  forbidden:
    - tenant-secret
    - customer-name-in-high-cardinality-tag
    - raw-credential
    - personal-data
```

---

### 47. Segurança de operações administrativas

Suporte global pode precisar consultar mais de um tenant. Isso não deve ser implementado escondendo ausência de tenant.

Crie escopos explícitos:

```text
TENANT_USER;

TENANT_ADMIN;

PLATFORM_SUPPORT_SINGLE_TENANT;

PLATFORM_AUDITOR_MULTI_TENANT;
```

Acesso multi-tenant exige autorização forte, justificativa, filtro explícito e auditoria.

---

### 48. Criar security policy

Arquivo:

```text
contracts/tenant-security-policy.yaml
```

Conteúdo:

```yaml
tenantSecurity:
  tenantSelection:
    userControlledWithoutAuthorization:
      forbidden

  crossTenantAccess:
    default:
      deny

  platformSupport:
    explicitScope:
      required
    justification:
      required
    audit:
      required

  tenantContextMismatch:
    action:
      DENY_AND_ALERT

  resourceOwnership:
    recheck:
      required
```

---

### 49. Testar spoofing de header

Cenário:

```text
JWT pertence ao Tenant A;

request envia X-Tenant-Id do Tenant B;

resolver ignora o header não confiável;

contexto permanece Tenant A;

acesso ao recurso B é negado;

security finding é gerado.
```

Esse teste protege uma das falhas mais comuns em APIs multi-tenant.

---

### 50. Testar leitura cross-tenant

Crie dois appointments com o mesmo `appointmentId`, um para cada tenant.

Valide:

```text
Tenant A recebe somente o registro A;

Tenant B recebe somente o registro B;

query sem tenant falha;

query com predicate removido falha no teste de arquitetura ou integração;

cache não retorna valor cruzado.
```

---

### 51. Testar write cross-tenant

Carregue um objeto do Tenant B em uma operação executada no contexto A.

O `TenantGuard` deve rejeitar antes do save. O repositório também deve exigir tenant na assinatura.

---

### 52. Testar context cleanup

Execute duas requisições sequenciais no mesmo worker:

```text
request 1:
Tenant A.

request 2:
Tenant B.
```

Confirme que o contexto A foi removido e não contaminou a requisição B.

---

### 53. Testar cache

```text
Tenant A:
appointment 42 = CONFIRMED.

Tenant B:
appointment 42 = CANCELLED.
```

As chaves precisam ser diferentes. Invalidar A não pode remover ou alterar B.

---

### 54. Testar evento

Produza evento no contexto A com envelope B.

`TenantMessageGuard` ou o producer guard deve bloquear o mismatch. No consumer, evento sem tenant deve ir para quarantine.

---

### 55. Testar rota de banco

Configure:

```text
Tenant A:
SHARED_TABLE -> datasource shared.

Tenant B:
DATABASE_PER_TENANT -> datasource regulated-b.
```

Valide que a rota ocorre antes da transação e que rota desconhecida não usa fallback.

---

### 56. Testar onboarding parcial

Falhe a etapa de migration.

Confirme:

```text
tenant permanece PROVISIONING;

tráfego é negado;

etapas concluídas são registradas;

retry não duplica recursos;

activation não ocorre.
```

---

### 57. Testar suspensão

Suspenda o Tenant A.

Valide:

```text
novos commands são negados;

Tenant B continua normal;

jobs do A seguem política explícita;

mensagens do A são tratadas separadamente;

auditoria permanece acessível a escopo autorizado.
```

---

### 58. Testar noisy neighbor

Simule Tenant A excedendo concorrência e Tenant B dentro da quota.

O guard limita A sem bloquear B. Registre decisão, métrica e resposta segura.

---

### 59. Testar arquitetura

Exemplo com ArchUnit:

```java
package br.com.formacao.multitenancy.architecture;

import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.methods;

public class TenantRepositoryBoundaryTest {

    private static final ArchCondition<JavaMethod> HAVE_TENANT_PARAMETER =
            new ArchCondition<>("have a TenantId parameter") {

                @Override
                public void check(
                        JavaMethod method,
                        ConditionEvents events) {

                    boolean satisfied = method.getRawParameterTypes()
                            .stream()
                            .anyMatch(type ->
                                    type.getSimpleName()
                                            .equals("TenantId"));

                    events.add(new SimpleConditionEvent(
                            method,
                            satisfied,
                            method.getFullName()
                                    + " must declare TenantId"));
                }
            };

    @ArchTest
    static final ArchRule repositoryMethodsMustReceiveTenant =
            methods()
                    .that()
                    .areDeclaredInClassesThat()
                    .haveSimpleNameEndingWith("Repository")
                    .and()
                    .arePublic()
                    .should(HAVE_TENANT_PARAMETER);
}
```

A regra torna a ausência de `TenantId` detectável automaticamente nos contratos públicos de repository.

---

### 60. Criar Data Quality Policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  tenantContextMissing:
    action:
      FAIL

  rawHeaderAsAuthority:
    action:
      FAIL

  repositoryWithoutTenant:
    action:
      FAIL

  cacheKeyWithoutTenant:
    action:
      FAIL

  eventWithoutTenant:
    action:
      FAIL

  unknownTenantRouteFallback:
    action:
      FAIL

  partialOnboardingActivated:
    action:
      FAIL

  crossTenantAccess:
    action:
      FAIL_AND_ALERT
```

---

### 61. Criar Non-Anticipation Policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson639:
    forbidden:
      - horizontal-scaling-deep-dive
      - vertical-scaling-deep-dive
      - autoscaling-algorithm
      - partitioning-strategy-deep-dive
      - statelessness-migration-plan
      - capacity-model-deep-dive

  lesson640:
    forbidden:
      - resilience-pattern-catalog-deep-dive
      - bulkhead-implementation-deep-dive
      - circuit-breaker-architecture-deep-dive

  allowed:
    - tenant-quota
    - tenant-concurrency-limit
    - noisy-neighbor-protection
    - tenant-route
```

---

### 62. Criar Reports

Exemplo:

```yaml
multiTenancy:
  registeredTenants:
    12

  activeTenants:
    10

  provisioningTenants:
    1

  suspendedTenants:
    1

  isolationModels:
    SHARED_TABLE:
      9
    DATABASE_PER_TENANT:
      3

  crossTenantReadAttempts:
    2

  crossTenantWriteAttempts:
    1

  blockedHeaderSpoofingAttempts:
    2

  cacheIsolationFailures:
    0

  eventTenantMismatches:
    0

  onboardingFailures:
    1

  quotaRejections:
    7

  result:
    PASS_WITH_BLOCKED_SECURITY_ATTEMPTS
```

Tentativas bloqueadas podem existir em testes e incidentes. O gate deve falhar quando o acesso efetivamente ocorre ou quando faltam evidências.

---

### 63. Criar Gate

O gate valida:

```text
charter;

tenant definition;

identity source;

registry;

context;

isolation model;

data predicates;

routing;

cache;

messaging;

configuration;

onboarding;

suspension;

migrations;

quotas;

observability;

security;

tests;

architecture;

documentation;

evidence.
```

Status:

```text
PASS;

PASS_WITH_BLOCKED_SECURITY_ATTEMPTS;

FAIL_TENANT_IDENTITY;

FAIL_TENANT_CONTEXT;

FAIL_DATA_ISOLATION;

FAIL_ROUTING;

FAIL_CACHE_ISOLATION;

FAIL_MESSAGING_ISOLATION;

FAIL_CONFIGURATION;

FAIL_ONBOARDING;

FAIL_MIGRATION;

FAIL_QUOTA;

FAIL_SECURITY;

FAIL_OBSERVABILITY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 64. Coletar Evidence

Arquivo:

```text
contracts/multi-tenancy-evidence.yaml
```

Registre lesson, project, quantidade de tenants, modelos de isolamento, tentativas cross-tenant, spoofing bloqueado, status de cache, mensageria, onboarding, migrations, quotas, segurança, testes, arquitetura, documentação, gate e timestamp.

Não inclua nomes reais, documentos empresariais, credenciais, connection strings, bancos de produção, payloads pessoais, rotas privadas ou conteúdo aprofundado da aula 639.

---

### 65. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-multitenancy\validate-multi-tenancy-contract.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-identity.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-context.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-data-isolation.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-routing.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-cache.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-messaging.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-lifecycle.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-migrations.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-quotas.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-observability.ps1

.\scripts\m19\service-scheduling-multitenancy\run-multi-tenancy-tests.ps1

.\scripts\m19\service-scheduling-multitenancy\collect-multi-tenancy-evidence.ps1

.\scripts\m19\service-scheduling-multitenancy\verify-multi-tenancy-gate.ps1
```

Ou execute os testes Java:

```powershell
mvn test
```

Finalize:

```powershell
git diff --check

git status
```

---

### 66. Encerrar o laboratório

Confirme:

- tenant definido, registrado e resolvido por identidade autenticada;
- status validado e TenantContext obrigatório com cleanup;
- ausência de tenant falha e header livre não autoriza troca;
- modelo de isolamento e exceções documentados;
- shared table usa chave composta, predicate e índices tenant-aware;
- repositories exigem TenantId e o banco possui defesa adicional;
- routing ocorre antes da transação sem fallback;
- cache, eventos e configuração são tenant-scoped;
- onboarding termina antes da ativação;
- suspensão, offboarding e migrations possuem política;
- quotas isolam noisy neighbor;
- acesso administrativo multi-tenant é explícito e auditado;
- tentativas cruzadas geram negação e alerta;
- reports estão sanitizados;
- escalabilidade profunda não foi antecipada.

---

## Entendendo o que foi feito

### Tenant ganhou identidade confiável

O tenant deixou de ser um parâmetro livre e passou a ser resolvido por principal autenticado, registry, status e escopo autorizado.

### O contexto ganhou obrigação arquitetural

Commands, queries, repositórios, caches, mensagens e jobs precisam de `TenantContext`. Contexto ausente falha em vez de selecionar um cliente padrão.

### Dados ganharam defesa em profundidade

Chave composta, predicate obrigatório, contrato do repositório, guard, routing e política de banco reduzem o risco de vazamento entre clientes.

### Recursos compartilhados ganharam namespace

Cache, eventos, configuração, quotas, métricas e traces carregam tenant ou uma classificação segura do tenant.

### O ciclo de vida ganhou workflow

Onboarding, suspensão, migration e offboarding passaram a ter estados, passos, retry, evidência e critérios de ativação.

### Noisy neighbor ganhou limites

Quotas e concorrência por tenant protegem o pool compartilhado sem transformar esta aula em aprofundamento de escalabilidade.

---

## Erros comuns importantes

### Confiar em header ou tenant padrão

Um header manipulável não prova autorização, e um tenant default pode direcionar dados ao cliente errado. Resolva pela identidade e falhe quando o contexto faltar.

### Adicionar somente tenant_id

Sem repository tenant-aware, predicate, chave composta, cache, eventos e testes, a coluna oferece falsa segurança.

### Esquecer jobs, consumers e callbacks

O isolamento não termina no endpoint HTTP. Toda fronteira assíncrona precisa abrir e fechar contexto validado.

### Cache ou evento sem tenant

Banco correto não evita vazamento por cache, tópico ou consumer. Namespace e envelope são obrigatórios.

### Roteamento com fallback

Tenant dedicado com rota inválida não pode cair no banco compartilhado. Resolva antes da transação e falhe fechado.

### Ativar onboarding parcial

Tenant sem migration, configuração, identidade ou quota concluídas deve permanecer `PROVISIONING`.

### Suspender somente endpoints

Jobs, broker backlog, callbacks e efeitos externos também precisam seguir a política de suspensão.

### Migration sem inventário

Schemas e bancos podem ficar em versões diferentes sem evidência. Registre status e versão por tenant.

### Branches hardcoded por cliente

Condições como `if tenant == X` espalham acoplamento. Use configuração e políticas versionadas.

### Superpoder silencioso para suporte

Acesso multi-tenant exige escopo explícito, justificativa, filtro e auditoria.

### Confundir quota com escala

Quota protege isolamento operacional. Scale up, scale out, autoscaling e capacity planning pertencem à aula 639.

---

## Comandos úteis

### Validar identidade e contexto

```powershell
.\scripts\m19\service-scheduling-multitenancy\validate-tenant-identity.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-context.ps1
```

### Validar dados e routing

```powershell
.\scripts\m19\service-scheduling-multitenancy\validate-tenant-data-isolation.ps1

.\scripts\m19\service-scheduling-multitenancy\validate-tenant-routing.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-multitenancy\run-multi-tenancy-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-multitenancy\verify-multi-tenancy-gate.ps1
```

---

## Exercício guiado

Implemente dois tenants standard em shared table e um tenant regulado com database route dedicada. Resolva o tenant por principal autenticado, abra `TenantContext`, proteja repository e cache, publique evento tenant-aware, configure quotas, execute onboarding, suspenda um tenant e valide que nenhuma leitura, escrita, cache, mensagem ou rota atravessa a fronteira.

Depois, produza evidence com tentativas cross-tenant bloqueadas, rotas utilizadas, status de onboarding, migrations, quotas e resultado do gate.

---

## Critérios de aceite

- nome, H1, número, módulo e continuidade estão corretos;
- laboratório, charter, contracts, reports, evidence e gate foram criados;
- TenantId é imutável e Tenant Registry mantém status, plano e rota;
- modelos shared table, schema, database e deployment foram comparados;
- tenant vem da identidade autenticada; header livre não autoriza seleção;
- TenantContext é obrigatório, explícito e removido após o uso;
- contexto ausente falha e tenant padrão foi proibido;
- shared table usa identidade composta, índices e predicates tenant-aware;
- repository exige TenantId e TenantGuard valida ownership;
- banco possui defesa em profundidade;
- routing ocorre antes da transação e não possui fallback inseguro;
- cache, eventos e configuração incluem tenant;
- onboarding só ativa após storage, migration, identidade, quota e smoke test;
- suspensão, offboarding e migrations têm workflow e evidência;
- quotas impedem noisy neighbor sem bloquear tenants saudáveis;
- observabilidade controla cardinalidade e protege dados comerciais;
- suporte multi-tenant exige escopo, justificativa e auditoria;
- spoofing, acesso cruzado, cache, mensagem, routing, lifecycle e quota foram testados;
- regras arquiteturais detectam ausência de tenant;
- aula 639 não foi antecipada;
- commit e diário de bordo estão presentes.

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
  labs/m19/aula-638-multi-tenancy-arquitetura/service-scheduling-multitenancy `
  scripts/m19/service-scheduling-multitenancy `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|customerName|realTenant|connectionString|productionDatabase|privateEndpoint|autoscalingDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): projetar arquitetura multi-tenant"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- nomes reais de clientes;
- connection strings;
- bancos de produção;
- endpoints privados;
- dados pessoais;
- estratégia detalhada de autoscaling;
- aprofundamento de escalabilidade da aula 639.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou arquitetura multi-tenant.

Você criou:

```text
Multi-Tenancy Charter;

Tenant Registry;

TenantId;

TenantContext;

TenantResolver;

TenantAuthorization;

modelos de isolamento;

identidade composta;

Tenant-Aware Repository;

TenantGuard;

Tenant Route;

DataSource Router;

cache namespaced;

Tenant Event Envelope;

configuration versionada;

onboarding workflow;

suspension e offboarding policies;

migration inventory;

quotas;

noisy neighbor protection;

observabilidade;

security tests;

architecture tests;

reports e gate.
```

Você comprovou que multi-tenancy começa na identidade e atravessa todas as fronteiras; que um header não confiável não pode escolher cliente; que `TenantContext` ausente deve falhar; que shared table exige chave composta, predicate e índices; que database-per-tenant exige routing sem fallback; que cache e eventos precisam de namespace; que configuração não deve virar branch hardcoded; que onboarding precisa terminar antes da ativação; que suspensão e offboarding possuem políticas próprias; que migrations precisam de inventário; que quotas protegem tenants contra noisy neighbor; e que acesso cross-tenant precisa ser negado, alertado e auditado.

A próxima aula será:

```text
639 - M19.29 - Escalabilidade horizontal vertical
```

Nela, você irá aprofundar como aumentar capacidade com scale up e scale out, como reconhecer gargalos, tornar componentes stateless quando necessário, distribuir carga, planejar capacidade e escolher estratégias de escalabilidade com evidências.

Nenhum aprofundamento completo de autoscaling, sharding, statelessness ou capacity planning foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Resolvi tenant por identidade autenticada.
- [ ] Tornei TenantContext obrigatório.
- [ ] Protegi repository, cache e mensageria.
- [ ] Justifiquei o modelo de isolamento.
- [ ] Criei onboarding, suspensão e migrations.
- [ ] Limitei noisy neighbor por quota.
- [ ] Testei acesso cross-tenant.
- [ ] Gerei reports, evidence e gate.

---

## Troubleshooting adicional

### Header alterado acessa outro cliente

O header está sendo usado como autoridade. Derive tenant do principal autenticado e valide ownership.

### Query retorna todos os tenants

Revise contrato do repository, predicate obrigatório, contexto e política no banco.

### Segunda requisição usa o tenant anterior

O contexto não foi removido. Garanta fechamento no `finally` ou no operador de contexto da stack.

### Cache retorna dado cruzado

Inclua tenant na chave, namespace e invalidation.

### Evento chega sem tenant

Quarentenize e corrija o producer; não infira pelo payload.

### Tenant dedicado cai no banco compartilhado

Remova fallback e alerte rota desconhecida.

### Migration falha em parte dos bancos

Use inventário, status por tenant, threshold de parada e retry seguro.

### Tenant recebe tráfego antes do smoke test

Mantenha `PROVISIONING` até todas as etapas concluírem.

### Suspensão não interrompe efeitos

Revise jobs, consumers, callbacks e mensagens pendentes.

### Um tenant degrada os demais

Aplique quota e concorrência por tenant. Capacidade e autoscaling serão aprofundados na aula 639.

### Métricas ficam caras

Prefira plano e isolation model como dimensões; avalie tenant individual somente quando necessário.

### Suporte precisa consultar vários tenants

Use escopo administrativo explícito, justificativa, filtros e auditoria; não elimine o contexto.

### A equipe quer banco dedicado para todos

Compare risco, restore, volume, regulamentação, custo e capacidade operacional antes de decidir.

---

## Perguntas de revisão

1. O que representa um tenant?
2. Por que header livre não deve escolher tenant?
3. O que é TenantContext?
4. O que acontece quando o contexto está ausente?
5. Quais são os principais modelos de isolamento?
6. Por que usar chave composta em shared table?
7. Por que cache precisa de namespace por tenant?
8. Como evento transporta tenant?
9. Quando database-per-tenant pode ser justificável?
10. Por que onboarding é um workflow?
11. O que é noisy neighbor?
12. Qual é a próxima aula?

## Roteiro de resposta

1. Fronteira isolada de cliente e governança.
2. Porque pode ser manipulado sem provar autorização.
3. Identidade e escopo tenant-scoped da operação atual.
4. A operação falha fechada.
5. Shared table, schema, database e deployment dedicado.
6. Para reforçar identidade, ownership e constraints.
7. Para impedir colisão e vazamento entre clientes.
8. Em envelope explícito validado pelo producer e consumer.
9. Regulação, restore, alto risco, contrato ou volume específico.
10. Porque envolve várias etapas que precisam de estado, retry e evidência.
11. Tenant que consome recursos compartilhados e degrada os demais.
12. Escalabilidade horizontal vertical.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 638 - M19.28 - Multi tenancy arquitetura**

- Aprofundei arquitetura multi-tenant no domínio Service Scheduling.
- Criei Tenant Charter, TenantId, Tenant Registry e TenantContext.
- Comparei shared table, schema, database e deployment dedicado.
- Justifiquei um modelo híbrido para tenants standard e regulados.
- Resolvi tenant por identidade autenticada e proibi header livre como autoridade.
- Tornei contexto obrigatório, sem tenant default, com cleanup validado.
- Modelei chave composta, repository tenant-aware, predicates e TenantGuard.
- Criei routing antes da transação e proibi fallback de rota.
- Isolei cache, eventos e configuração por tenant.
- Modelei onboarding, suspensão, offboarding e migrations por tenant.
- Criei quotas e proteção contra noisy neighbor.
- Exigi escopo, justificativa e auditoria para suporte multi-tenant.
- Testei spoofing, leitura e escrita cruzadas, cache, mensageria, routing, lifecycle e quota.
- Criei reports, evidence e gate.
- Não antecipei escalabilidade horizontal e vertical.
- Próxima aula: Escalabilidade horizontal vertical.
```

---

## Referência técnica curta

- Multi-Tenancy.
- Tenant Isolation.
- Shared Table.
- Schema per Tenant.
- Database per Tenant.
- Tenant Context.
- Tenant Registry.
- Tenant Routing.
- Composite Identity.
- Cache Namespace.
- Tenant-Aware Messaging.
- Tenant Onboarding.
- Noisy Neighbor.
- Quota.

Regra final:

```text
Arquitetura multi-tenant trata tenant como fronteira de identidade, dados, configuração e operação: TenantId vem de principal autenticado, é validado no registry e propagado em contexto obrigatório; contexto ausente falha e header livre não escolhe cliente. O isolamento é escolhido por risco, contrato, restore, volume e custo, podendo combinar shared table e banco dedicado; tabelas compartilhadas usam chave composta, índices, predicates e repositories tenant-aware. Routing ocorre antes da transação sem fallback, cache e mensagens carregam tenant e configuração é versionada. Onboarding conclui storage, migration, identidade, quota e smoke test antes da ativação; suspensão, offboarding e migrations possuem workflow; quotas limitam noisy neighbor. Observabilidade controla cardinalidade, suporte multi-tenant exige escopo e auditoria, tentativas cross-tenant são negadas e alertadas, e o gate comprova identidade, contexto, dados, routing, cache, mensageria, lifecycle, segurança, testes e evidence. Scale up, scale out, autoscaling e capacity planning ficam para a aula 639.
```
