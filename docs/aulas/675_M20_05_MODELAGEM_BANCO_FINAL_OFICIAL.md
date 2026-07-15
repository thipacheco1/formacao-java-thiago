# 675 - M20.05 - Modelagem banco final

## Apresentação da aula

Na aula 674, você criou o modelo de domínio final do OrderFlow.

O domínio passou a possuir:

- linguagem ubíqua;
- mapa de subdomínios;
- boundary de `Order Orchestration`;
- aggregate root `OrderProcess`;
- `OrderLine`;
- `ProcessingStep`;
- `CompensationAction`;
- value objects;
- invariantes;
- estados;
- policies;
- commands;
- domain events;
- ports;
- Anti-Corruption Mapping;
- erros;
- testes;
- rastreabilidade.

O modelo protege comportamento.

Agora será necessário guardar esse comportamento sem destruir suas regras.

Essa distinção é essencial.

O banco não é o domínio.

Ele é uma tecnologia usada para:

- persistir estado;
- garantir constraints;
- controlar concorrência;
- registrar idempotência;
- publicar eventos com segurança;
- deduplicar mensagens;
- auditar decisões;
- construir consultas;
- executar migrations;
- recuperar falhas.

O erro clássico seria começar com uma tabela genérica:

```text
orders
```

e adicionar dezenas de colunas até que toda a jornada caiba nela.

Outro erro seria mapear cada classe Java diretamente para uma tabela sem avaliar:

- atomicidade;
- volume;
- cardinalidade;
- histórico;
- consulta;
- concorrência;
- retenção;
- evolução;
- responsabilidade;
- recuperação.

Nesta aula, você projetará uma persistência final para o OrderFlow usando PostgreSQL como referência.

A escolha do PostgreSQL é compatível com:

- transações ACID;
- constraints;
- índices;
- JSONB quando realmente necessário;
- locking;
- migrations;
- consultas operacionais;
- consistência local;
- Outbox;
- Inbox;
- auditoria.

O laboratório será:

```text
labs/m20/aula-675-modelagem-banco-final/orderflow-database-model
```

Você criará:

- Database Model Charter;
- ownership de dados;
- schemas;
- tabelas do aggregate;
- tabela de linhas;
- tabela de etapas;
- tabela de compensações;
- optimistic locking;
- idempotency registry;
- Outbox;
- Inbox;
- audit log;
- projection operacional;
- constraints;
- índices;
- retention;
- migrations;
- rollback;
- seed controlado;
- testes de banco;
- reports, evidence e gate.

A próxima aula será:

```text
676 - M20.06 - Arquitetura C4 final
```

Na aula 676, domínio, persistência, APIs, eventos, providers, workers, observabilidade e deploy serão consolidados em diagramas C4.

Nesta aula, containers e deployment topology finais não serão aprovados.

Regra central:

```text
o banco deve reforcar
as invariantes do dominio,

nao substituir
o comportamento do dominio.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
673:
Escopo funcional.

674:
Modelagem dominio final.

675:
Modelagem banco final.

676:
Arquitetura C4 final.

677:
ADRs do projeto.

678:
Configuracao repositorio profissional.
```

A aula 673 definiu comportamento.

A aula 674 definiu modelo de domínio.

A aula 675 definirá persistência.

A aula 676 mostrará como os componentes se organizam.

A modelagem de banco precisa respeitar:

- aggregate boundary;
- autoridade;
- transações locais;
- eventos;
- idempotência;
- consultas;
- concorrência;
- recovery;
- multi-tenancy;
- rastreabilidade.

Ela não deve antecipar:

- quantidade final de serviços;
- deploy units finais;
- cluster;
- namespace;
- quantidade de pods;
- topologia de rede;
- broker final;
- API Gateway;
- ADRs fechados;
- repositório profissional.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-675-modelagem-banco-final
└── orderflow-database-model
    ├── README.md
    ├── database
    │   ├── DATABASE_MODEL_CHARTER.md
    │   ├── DATA_OWNERSHIP.md
    │   ├── SCHEMA_CATALOG.md
    │   ├── TABLE_CATALOG.md
    │   ├── CONSTRAINT_CATALOG.md
    │   ├── INDEX_CATALOG.md
    │   ├── OPTIMISTIC_LOCKING.md
    │   ├── IDEMPOTENCY_STORAGE.md
    │   ├── OUTBOX_MODEL.md
    │   ├── INBOX_MODEL.md
    │   ├── AUDIT_MODEL.md
    │   ├── OPERATIONAL_PROJECTIONS.md
    │   ├── RETENTION_POLICY.md
    │   ├── MIGRATION_STRATEGY.md
    │   ├── ROLLBACK_STRATEGY.md
    │   ├── BACKUP_RESTORE_PLAN.md
    │   ├── DATABASE_RISK_REGISTER.md
    │   ├── DATABASE_TRACEABILITY.md
    │   ├── DATABASE_OPEN_QUESTIONS.md
    │   └── NEXT_LESSON_BOUNDARY.md
    ├── migrations
    │   ├── V001__create_orderflow_schema.sql
    │   ├── V002__create_order_process.sql
    │   ├── V003__create_order_line.sql
    │   ├── V004__create_processing_step.sql
    │   ├── V005__create_compensation_action.sql
    │   ├── V006__create_idempotency_registry.sql
    │   ├── V007__create_outbox_event.sql
    │   ├── V008__create_inbox_message.sql
    │   ├── V009__create_order_audit.sql
    │   ├── V010__create_order_operational_view.sql
    │   └── V011__create_indexes.sql
    ├── contracts
    │   ├── final-database-model-contract.yaml
    │   ├── ownership-policy.yaml
    │   ├── schema-policy.yaml
    │   ├── constraint-policy.yaml
    │   ├── index-policy.yaml
    │   ├── locking-policy.yaml
    │   ├── idempotency-policy.yaml
    │   ├── outbox-policy.yaml
    │   ├── inbox-policy.yaml
    │   ├── audit-policy.yaml
    │   ├── migration-policy.yaml
    │   ├── rollback-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/orderflow/persistence
    │   │           ├── model
    │   │           │   ├── OrderProcessRow.java
    │   │           │   ├── OrderLineRow.java
    │   │           │   ├── ProcessingStepRow.java
    │   │           │   ├── CompensationActionRow.java
    │   │           │   ├── IdempotencyRecord.java
    │   │           │   ├── OutboxRecord.java
    │   │           │   ├── InboxRecord.java
    │   │           │   └── OrderAuditRecord.java
    │   │           ├── mapper
    │   │           │   ├── OrderProcessPersistenceMapper.java
    │   │           │   └── PersistenceMappingException.java
    │   │           ├── repository
    │   │           │   ├── PostgresOrderProcessRepository.java
    │   │           │   ├── IdempotencyRepository.java
    │   │           │   ├── OutboxRepository.java
    │   │           │   └── InboxRepository.java
    │   │           └── projection
    │   │               ├── OrderOperationalProjection.java
    │   │               └── OrderHistoryProjection.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/orderflow/persistence
    │               ├── DatabaseConstraintTest.java
    │               ├── OptimisticLockingTest.java
    │               ├── IdempotencyStorageTest.java
    │               ├── OutboxAtomicityTest.java
    │               ├── InboxDeduplicationTest.java
    │               ├── AuditPersistenceTest.java
    │               ├── MigrationTest.java
    │               ├── RollbackTest.java
    │               ├── C4NonAnticipationTest.java
    │               └── FinalDatabaseModelGateTest.java
    └── reports
        ├── schema-report.yaml
        ├── table-report.yaml
        ├── constraint-report.yaml
        ├── index-report.yaml
        ├── idempotency-report.yaml
        ├── outbox-inbox-report.yaml
        ├── migration-report.yaml
        ├── rollback-report.yaml
        ├── architecture-report.yaml
        └── final-database-model-gate-report.yaml
```

Scripts:

```text
scripts/m20/orderflow-database-model
├── validate-database-contract.ps1
├── validate-data-ownership.ps1
├── validate-schema.ps1
├── validate-tables.ps1
├── validate-constraints.ps1
├── validate-indexes.ps1
├── validate-locking.ps1
├── validate-idempotency-storage.ps1
├── validate-outbox-inbox.ps1
├── validate-migrations.ps1
├── run-orderflow-database-tests.ps1
├── collect-orderflow-database-evidence.ps1
└── verify-orderflow-database-gate.ps1
```

---

## Conceito essencial

### Persistência orientada pelo aggregate

O aggregate `OrderProcess` é salvo como uma unidade lógica.

Isso exige que:

- estado principal;
- linhas;
- etapas;
- compensações;
- versão;
- operações externas aplicadas;
- eventos pendentes;

possam ser persistidos de forma consistente.

Nem tudo precisa estar na mesma tabela.

Mas o commit local precisa preservar invariantes.

### Multi-tenancy precisa existir em todas as chaves relevantes

A autoridade do OrderFlow é multi-tenant.

Por isso, `tenant_id` participa de:

- chaves naturais;
- índices;
- idempotência;
- Inbox;
- Outbox;
- projections;
- auditoria;
- queries;
- constraints de unicidade.

Uma query por `order_id` sem tenant é um risco.

### Constraint é defesa adicional

O domínio continua responsável pela regra.

O banco protege contra:

- concorrência;
- bug;
- integração incorreta;
- processo paralelo;
- migration defeituosa.

Exemplo:

```text
quantity > 0
```

pode existir no value object e em `CHECK`.

### Optimistic locking protege conflito

O aggregate possui versão.

O banco atualiza:

```text
where version = expected_version.
```

Se nenhuma linha for alterada:

```text
VERSION_CONFLICT.
```

A aplicação decide reload, retry seguro ou erro funcional.

### Outbox protege atomicidade

Estado e evento precisam ser gravados na mesma transação local.

Sem Outbox, existe a falha:

```text
estado salvo;
evento nao publicado.
```

### Inbox protege consumers

Uma mensagem pode ser entregue mais de uma vez.

Inbox registra:

- consumer;
- message ID;
- status;
- resultado;
- timestamps.

A mesma mensagem não deve produzir efeito duplicado.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-675-modelagem-banco-final/orderflow-database-model

Set-Location `
  labs/m20/aula-675-modelagem-banco-final/orderflow-database-model
```

---

### 2. Criar Database Model Charter

Arquivo:

```text
database/DATABASE_MODEL_CHARTER.md
```

Conteúdo:

```markdown
# Database Model Charter

Projeto

OrderFlow.

Objetivo

Persistir o aggregate,
proteger concorrencia,
garantir idempotencia,
publicar eventos,
deduplicar mensagens
e suportar operacao.

Principios

- domain owns behavior;
- database reinforces invariants;
- tenant participates in access;
- constraints protect critical rules;
- migrations are forward-safe;
- rollback is designed;
- Outbox shares transaction with state;
- Inbox deduplicates effects;
- C4 belongs to lesson 676.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/final-database-model-contract.yaml
```

Conteúdo:

```yaml
finalDatabaseModel:
  project:
    OrderFlow

  required:
    - charter
    - ownership
    - schemas
    - tables
    - constraints
    - indexes
    - optimistic-locking
    - idempotency
    - Outbox
    - Inbox
    - audit
    - projections
    - retention
    - migrations
    - rollback
    - backup-restore
    - risks
    - traceability
    - tests
    - reports
    - evidence
    - gate

  forbidden:
    - query-without-tenant
    - shared-write-authority
    - unbounded-text-for-status
    - critical-table-without-key
    - idempotency-without-payload-hash
    - outbox-outside-state-transaction
    - inbox-without-unique-consumer-message
    - destructive-migration-without-expand-contract
    - final-C4
    - final-deployment-topology

  nextLesson:
    code:
      M20.06
```

---

### 4. Definir ownership

Arquivo:

```text
database/DATA_OWNERSHIP.md
```

Autoridades:

```text
order_process:
Order Orchestration.

order_line:
Order Orchestration.

processing_step:
Order Orchestration.

compensation_action:
Order Orchestration.

idempotency_record:
OrderFlow Application.

outbox_event:
OrderFlow Publishing.

inbox_message:
Consumer local.

order_audit:
OrderFlow Audit.

order_operational_projection:
OrderFlow Query Model.
```

Somente componentes autorizados escrevem nesses dados.

---

### 5. Criar schema principal

Migration:

```text
migrations/V001__create_orderflow_schema.sql
```

Conteúdo:

```sql
CREATE SCHEMA IF NOT EXISTS orderflow;

COMMENT ON SCHEMA orderflow IS
    'Dados autoritativos do OrderFlow';
```

Um schema lógico explicita ownership.

Ele não define deploy unit.

---

### 6. Criar tabela order_process

Migration:

```text
migrations/V002__create_order_process.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.order_process (
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    status VARCHAR(40) NOT NULL,
    currency CHAR(3) NOT NULL,
    total_amount NUMERIC(19, 2) NOT NULL,
    stock_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    payment_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    fulfillment_started BOOLEAN NOT NULL DEFAULT FALSE,
    reconciliation_reason VARCHAR(120),
    version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    CONSTRAINT pk_order_process
        PRIMARY KEY (tenant_id, order_id),
    CONSTRAINT ck_order_process_total
        CHECK (total_amount >= 0),
    CONSTRAINT ck_order_process_version
        CHECK (version >= 0),
    CONSTRAINT ck_order_process_status
        CHECK (status IN (
            'RECEIVED',
            'AWAITING_STOCK',
            'STOCK_RESERVED',
            'AWAITING_PAYMENT',
            'PAYMENT_AUTHORIZED',
            'AWAITING_FULFILLMENT',
            'IN_FULFILLMENT',
            'COMPLETED',
            'CANCELLATION_REQUESTED',
            'COMPENSATING',
            'CANCELLED',
            'FAILED',
            'PENDING_RECONCILIATION'
        ))
);
```

A constraint de status protege valores inválidos.

Transições continuam no domínio.

---

### 7. Avaliar chave primária

Escolha:

```text
PRIMARY KEY (tenant_id, order_id)
```

Vantagens:

- tenant sempre participa;
- query incompleta fica evidente;
- unicidade é por tenant;
- índices auxiliares herdam acesso.

Trade-off:

- foreign keys ficam compostas;
- índices ficam maiores;
- mappings exigem disciplina.

Para o projeto, esse trade-off é aceitável.

---

### 8. Criar tabela order_line

Migration:

```text
migrations/V003__create_order_line.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.order_line (
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    line_number INTEGER NOT NULL,
    product_code VARCHAR(80) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(19, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    CONSTRAINT pk_order_line
        PRIMARY KEY (
            tenant_id,
            order_id,
            line_number
        ),
    CONSTRAINT fk_order_line_process
        FOREIGN KEY (tenant_id, order_id)
        REFERENCES orderflow.order_process (
            tenant_id,
            order_id
        )
        ON DELETE CASCADE,
    CONSTRAINT ck_order_line_quantity
        CHECK (quantity > 0),
    CONSTRAINT ck_order_line_price
        CHECK (unit_price >= 0)
);
```

`line_number` é identidade de persistência local.

Ela não transforma `OrderLine` em entity do domínio.

---

### 9. Garantir moeda única

A regra de moeda única é validada pelo domínio.

O banco também pode usar trigger.

Para este projeto, não use trigger de negócio.

Motivos:

- regra ficaria escondida;
- teste ficaria mais difícil;
- migration carregaria comportamento;
- domínio perderia centralidade.

A evidência será teste de domínio e teste de repository.

---

### 10. Criar tabela processing_step

Migration:

```text
migrations/V004__create_processing_step.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.processing_step (
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    step_id UUID NOT NULL,
    step_type VARCHAR(60) NOT NULL,
    outcome VARCHAR(60) NOT NULL,
    provider VARCHAR(60),
    external_operation_id VARCHAR(160),
    occurred_at TIMESTAMPTZ NOT NULL,
    payload_fingerprint VARCHAR(64),
    CONSTRAINT pk_processing_step
        PRIMARY KEY (
            tenant_id,
            order_id,
            step_id
        ),
    CONSTRAINT fk_processing_step_process
        FOREIGN KEY (tenant_id, order_id)
        REFERENCES orderflow.order_process (
            tenant_id,
            order_id
        )
        ON DELETE CASCADE,
    CONSTRAINT uq_processing_step_external
        UNIQUE (
            tenant_id,
            provider,
            external_operation_id
        )
);
```

A unique constraint ajuda a impedir resultado externo duplicado.

---

### 11. Tratar operação externa nula

No PostgreSQL, múltiplos `NULL` em unique constraint são permitidos.

Isso é desejável para etapas internas sem operação externa.

Etapas externas precisam de:

- provider;
- external operation ID;
- fingerprint.

A aplicação valida o conjunto.

---

### 12. Criar tabela compensation_action

Migration:

```text
migrations/V005__create_compensation_action.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.compensation_action (
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    action_id UUID NOT NULL,
    action_type VARCHAR(80) NOT NULL,
    reason VARCHAR(160) NOT NULL,
    required BOOLEAN NOT NULL,
    status VARCHAR(30) NOT NULL,
    external_operation_id VARCHAR(160),
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error_code VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT pk_compensation_action
        PRIMARY KEY (
            tenant_id,
            order_id,
            action_id
        ),
    CONSTRAINT fk_compensation_process
        FOREIGN KEY (tenant_id, order_id)
        REFERENCES orderflow.order_process (
            tenant_id,
            order_id
        )
        ON DELETE CASCADE,
    CONSTRAINT ck_compensation_attempts
        CHECK (attempts >= 0),
    CONSTRAINT ck_compensation_status
        CHECK (status IN (
            'PLANNED',
            'IN_PROGRESS',
            'COMPLETED',
            'FAILED',
            'AMBIGUOUS'
        ))
);
```

---

### 13. Modelar optimistic locking

Arquivo:

```text
database/OPTIMISTIC_LOCKING.md
```

Update:

```sql
UPDATE orderflow.order_process
SET status = :status,
    stock_confirmed = :stock_confirmed,
    payment_confirmed = :payment_confirmed,
    fulfillment_started = :fulfillment_started,
    reconciliation_reason = :reconciliation_reason,
    version = version + 1,
    updated_at = :updated_at
WHERE tenant_id = :tenant_id
  AND order_id = :order_id
  AND version = :expected_version;
```

Validação:

```text
updated rows = 1:
sucesso.

updated rows = 0:
VERSION_CONFLICT
ou registro inexistente.
```

---

### 14. Diferenciar conflito e inexistência

Após update zero:

1. consultar por tenant e order;
2. se não existe, retornar not found;
3. se existe, retornar version conflict.

Evite esconder conflito como erro genérico.

---

### 15. Criar Idempotency Registry

Migration:

```text
migrations/V006__create_idempotency_registry.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.idempotency_record (
    tenant_id VARCHAR(80) NOT NULL,
    operation VARCHAR(80) NOT NULL,
    idempotency_key VARCHAR(120) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    status VARCHAR(30) NOT NULL,
    resource_id UUID,
    response_code INTEGER,
    response_body JSONB,
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT pk_idempotency_record
        PRIMARY KEY (
            tenant_id,
            operation,
            idempotency_key
        ),
    CONSTRAINT ck_idempotency_status
        CHECK (status IN (
            'PROCESSING',
            'COMPLETED',
            'FAILED'
        )),
    CONSTRAINT ck_idempotency_expiration
        CHECK (expires_at > created_at)
);
```

---

### 16. Definir fluxo idempotente

Fluxo:

```text
INSERT PROCESSING.

se inseriu:
processar comando.

se conflito:
ler registro.

mesmo hash e COMPLETED:
retornar resposta anterior.

hash diferente:
IDEMPOTENCY_KEY_CONFLICT.

PROCESSING recente:
retornar processamento.

PROCESSING expirado:
executar recovery controlado.
```

---

### 17. Proteger idempotência concorrente

Use insert atômico:

```sql
INSERT INTO orderflow.idempotency_record (
    tenant_id,
    operation,
    idempotency_key,
    request_hash,
    status,
    created_at,
    expires_at
)
VALUES (
    :tenant_id,
    :operation,
    :idempotency_key,
    :request_hash,
    'PROCESSING',
    :created_at,
    :expires_at
)
ON CONFLICT DO NOTHING;
```

A quantidade inserida decide ownership do processamento.

---

### 18. Criar Outbox

Migration:

```text
migrations/V007__create_outbox_event.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.outbox_event (
    event_id UUID NOT NULL,
    tenant_id VARCHAR(80) NOT NULL,
    aggregate_type VARCHAR(80) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    event_version INTEGER NOT NULL,
    correlation_id VARCHAR(120) NOT NULL,
    causation_id VARCHAR(120),
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    occurred_at TIMESTAMPTZ NOT NULL,
    available_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    last_error_code VARCHAR(80),
    CONSTRAINT pk_outbox_event
        PRIMARY KEY (event_id),
    CONSTRAINT ck_outbox_version
        CHECK (event_version > 0),
    CONSTRAINT ck_outbox_attempts
        CHECK (attempts >= 0),
    CONSTRAINT ck_outbox_status
        CHECK (status IN (
            'PENDING',
            'PUBLISHING',
            'PUBLISHED',
            'FAILED'
        ))
);
```

---

### 19. Garantir atomicidade da Outbox

Na mesma transação:

```text
save OrderProcess;

save children;

insert Outbox events;

commit.
```

Somente depois o publisher consulta eventos pendentes.

Nunca publique antes do commit.

---

### 20. Selecionar Outbox com segurança

Exemplo:

```sql
SELECT event_id
FROM orderflow.outbox_event
WHERE status = 'PENDING'
  AND available_at <= now()
ORDER BY occurred_at
FOR UPDATE SKIP LOCKED
LIMIT 100;
```

`SKIP LOCKED` permite múltiplos workers sem processar o mesmo lote simultaneamente.

---

### 21. Criar Inbox

Migration:

```text
migrations/V008__create_inbox_message.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.inbox_message (
    consumer_name VARCHAR(120) NOT NULL,
    message_id UUID NOT NULL,
    tenant_id VARCHAR(80) NOT NULL,
    message_type VARCHAR(120) NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    status VARCHAR(30) NOT NULL,
    received_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    result_code VARCHAR(80),
    CONSTRAINT pk_inbox_message
        PRIMARY KEY (
            consumer_name,
            message_id
        ),
    CONSTRAINT ck_inbox_status
        CHECK (status IN (
            'RECEIVED',
            'PROCESSED',
            'FAILED'
        ))
);
```

---

### 22. Definir Inbox transaction

Na mesma transação local:

```text
insert Inbox;

apply domain change;

save aggregate;

insert Outbox events;

mark Inbox processed;

commit.
```

Se a mensagem já existe:

- comparar hash;
- retornar resultado anterior;
- não repetir efeito.

---

### 23. Criar Audit Model

Migration:

```text
migrations/V009__create_order_audit.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.order_audit (
    audit_id UUID NOT NULL,
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    action VARCHAR(120) NOT NULL,
    actor_type VARCHAR(60) NOT NULL,
    actor_id VARCHAR(160),
    correlation_id VARCHAR(120) NOT NULL,
    previous_status VARCHAR(40),
    new_status VARCHAR(40),
    reason_code VARCHAR(80),
    metadata JSONB,
    occurred_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT pk_order_audit
        PRIMARY KEY (audit_id)
);
```

Audit não substitui domain event.

Audit responde:

```text
quem fez;
quando;
em qual contexto;
qual mudança;
qual motivo.
```

---

### 24. Proteger audit contra update

Regra de aplicação:

```text
INSERT only.
```

A role de runtime não deve possuir `UPDATE` ou `DELETE` na tabela de audit.

A configuração de roles será aprofundada em aulas de segurança e deploy.

---

### 25. Criar projection operacional

Migration:

```text
migrations/V010__create_order_operational_view.sql
```

Uma projection materializada ou tabela derivada poderá conter:

- tenant;
- order;
- status;
- etapa atual;
- last failure;
- updated at;
- pending reconciliation;
- pending compensation count;
- provider outcomes.

Para o projeto, use tabela derivada atualizada por consumer.

Motivo:

- consulta operacional previsível;
- índice específico;
- separação do aggregate;
- evolução independente.

---

### 26. Criar tabela de projection

Exemplo:

```sql
CREATE TABLE orderflow.order_operational_projection (
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    status VARCHAR(40) NOT NULL,
    current_stage VARCHAR(80) NOT NULL,
    last_failure_code VARCHAR(80),
    pending_reconciliation BOOLEAN NOT NULL,
    pending_compensation_count INTEGER NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    projection_version BIGINT NOT NULL,
    CONSTRAINT pk_order_operational_projection
        PRIMARY KEY (tenant_id, order_id),
    CONSTRAINT ck_projection_compensation
        CHECK (pending_compensation_count >= 0)
);
```

---

### 27. Definir query model separado

A projection pode ficar stale.

Por isso, a API de consulta precisa informar:

- `updated_at`;
- projection version;
- estado autoritativo quando necessário;
- freshness SLO.

Não use projection para tomar decisão de comando.

---

### 28. Criar catálogo de constraints

Arquivo:

```text
database/CONSTRAINT_CATALOG.md
```

Constraints críticas:

```text
PK por tenant e order;

quantity > 0;

amount >= 0;

version >= 0;

status permitido;

idempotency key unica
por tenant e operacao;

external operation unica
por tenant e provider;

Inbox unica
por consumer e message;

compensation attempts >= 0;

projection pending count >= 0.
```

---

### 29. Criar catálogo de índices

Arquivo:

```text
database/INDEX_CATALOG.md
```

Índices:

```text
order_process:
tenant + status + updated_at.

processing_step:
tenant + order + occurred_at.

compensation_action:
tenant + status + updated_at.

idempotency_record:
expires_at.

outbox_event:
status + available_at + occurred_at.

inbox_message:
tenant + received_at.

order_audit:
tenant + order + occurred_at.

projection:
tenant + status + updated_at.
```

---

### 30. Criar migration de índices

Migration:

```text
migrations/V011__create_indexes.sql
```

Conteúdo:

```sql
CREATE INDEX idx_order_process_status
    ON orderflow.order_process (
        tenant_id,
        status,
        updated_at DESC
    );

CREATE INDEX idx_processing_step_timeline
    ON orderflow.processing_step (
        tenant_id,
        order_id,
        occurred_at
    );

CREATE INDEX idx_compensation_pending
    ON orderflow.compensation_action (
        tenant_id,
        status,
        updated_at
    )
    WHERE status IN (
        'PLANNED',
        'FAILED',
        'AMBIGUOUS'
    );

CREATE INDEX idx_outbox_available
    ON orderflow.outbox_event (
        status,
        available_at,
        occurred_at
    )
    WHERE status IN (
        'PENDING',
        'FAILED'
    );

CREATE INDEX idx_idempotency_expiration
    ON orderflow.idempotency_record (
        expires_at
    );
```

Índice precisa de query conhecida.

---

### 31. Evitar índices duplicados

A primary key já cria índice.

Não crie outro índice idêntico.

Avalie:

- selectivity;
- order;
- write cost;
- storage;
- maintenance;
- query plan.

---

### 32. Criar modelo Java de persistência

```java
package br.com.formacao.orderflow.persistence.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderProcessRow(
        String tenantId,
        UUID orderId,
        String status,
        String currency,
        BigDecimal totalAmount,
        boolean stockConfirmed,
        boolean paymentConfirmed,
        boolean fulfillmentStarted,
        String reconciliationReason,
        long version,
        Instant createdAt,
        Instant updatedAt,
        Instant completedAt,
        Instant cancelledAt) {
}
```

Esse row pertence ao adapter de persistência.

Não deve vazar para o domínio.

---

### 33. Criar mapper

Responsabilidades:

- converter value objects;
- reconstruir aggregate;
- validar estado;
- converter children;
- preservar versão;
- falhar em dado inválido;
- não inventar defaults silenciosos.

Erro:

```text
PersistenceMappingException
```

deve incluir contexto sanitizado.

---

### 34. Reconstruir aggregate

O aggregate precisa de fábrica de reconstituição.

Exemplo conceitual:

```java
public static OrderProcess reconstitute(
        OrderId id,
        TenantId tenantId,
        List<OrderLine> lines,
        Money total,
        OrderProcessStatus status,
        boolean stockConfirmed,
        boolean paymentConfirmed,
        boolean fulfillmentStarted,
        long version) {
    // valida consistência do snapshot
    // sem publicar novos eventos
    throw new UnsupportedOperationException();
}
```

A implementação real deve reconstruir sem disparar `OrderRegistered`.

---

### 35. Evitar placeholder na implementação real

O exemplo anterior é apenas assinatura conceitual.

No laboratório entregue, substitua por implementação completa.

Uma reconstituição inválida deve falhar.

Não aceite snapshot com:

- `COMPLETED` sem fulfillment;
- `PAYMENT_AUTHORIZED` sem estoque;
- version negativa;
- tenant vazio;
- linhas vazias.

---

### 36. Criar repository Postgres

Fluxo de save:

```text
begin;

update root with version;

if new:
insert root;

replace or diff children;

insert new steps;

upsert compensation actions;

insert Outbox;

commit.
```

Para o projeto, prefira diff controlado em vez de apagar todas as collections.

---

### 37. Proteger inserts concorrentes

No registro inicial:

- idempotency registry decide o owner;
- `order_id` é gerado uma vez;
- PK protege duplicidade;
- transaction conecta idempotência e aggregate.

A mesma chave não gera dois IDs.

---

### 38. Criar política de retention

Arquivo:

```text
database/RETENTION_POLICY.md
```

Exemplo didático:

```text
order_process:
durante vida operacional
e periodo de portfolio.

processing_step:
mesmo periodo do pedido.

idempotency:
TTL configuravel.

Outbox published:
retencao curta
apos confirmacao.

Inbox processed:
retencao suficiente
para replay esperado.

audit:
retencao longa
conforme politica a validar.

projection:
enquanto o pedido existir.
```

Não invente requisito jurídico.

Registre owner da política.

---

### 39. Criar cleanup idempotente

Jobs:

- idempotency expirada;
- Outbox publicada antiga;
- Inbox processada antiga;
- projection órfã;
- audit conforme política.

Cleanup precisa de:

- batch;
- limite;
- telemetry;
- dry run;
- owner;
- evidence.

---

### 40. Criar migration strategy

Arquivo:

```text
database/MIGRATION_STRATEGY.md
```

Princípios:

```text
forward only;

small migrations;

expand before contract;

backfill idempotent;

no long lock;

index creation planned;

schema compatible
with current and next version;

migration tested
on realistic volume.
```

---

### 41. Criar expand-contract

Exemplo:

```text
1. adicionar coluna nullable;

2. deploy que escreve
coluna antiga e nova;

3. backfill;

4. validar;

5. tornar obrigatoria;

6. migrar readers;

7. remover coluna antiga
em release posterior.
```

Nunca faça rename destrutivo em uma única etapa.

---

### 42. Criar rollback strategy

Arquivo:

```text
database/ROLLBACK_STRATEGY.md
```

Rollback considera:

- código anterior;
- schema novo;
- eventos novos;
- colunas novas;
- backfill parcial;
- feature flags;
- compatibilidade;
- reconciliation.

Preferência:

```text
rollback de aplicacao
sem rollback destrutivo
de schema.
```

---

### 43. Testar migration

Testes:

- banco vazio;
- banco na versão anterior;
- dados existentes;
- migration repetida bloqueada;
- rollback de aplicação;
- query antiga;
- query nova;
- constraint após backfill.

---

### 44. Criar backup e restore plan

Arquivo:

```text
database/BACKUP_RESTORE_PLAN.md
```

Defina:

- frequência;
- owner;
- criptografia;
- retenção;
- restore test;
- RPO;
- RTO;
- evidence;
- ambiente de teste;
- validação de consistência.

Backup não testado não é estratégia de recuperação.

---

### 45. Criar seed controlado

Seeds permitidos:

- tenants fictícios;
- produtos fictícios;
- pedidos sintéticos;
- cenários de teste.

Seeds proibidos:

- dados reais;
- credenciais;
- tokens;
- endpoints privados;
- dados pessoais.

---

### 46. Criar database traceability

Arquivo:

```text
database/DATABASE_TRACEABILITY.md
```

Exemplo:

```text
INV-007
resultado externo nao duplica efeito
-> uq_processing_step_external
-> Inbox PK
-> DuplicateResultTest.

INV-012
transicao invalida nao altera estado
-> optimistic version
-> domain transition test
-> repository transaction.

OrderRegistered
-> Outbox event
-> OutboxAtomicityTest.
```

---

### 47. Criar riscos do banco

Arquivo:

```text
database/DATABASE_RISK_REGISTER.md
```

Riscos:

```text
query sem tenant;

indice excessivo;

lock prolongado;

Outbox acumulada;

Inbox sem cleanup;

audit grande;

projection stale;

migration destrutiva;

backfill nao idempotente;

JSONB sem schema;

repository vazando row;

restore nao testado.
```

---

### 48. Criar perguntas abertas

Arquivo:

```text
database/DATABASE_OPEN_QUESTIONS.md
```

Perguntas:

```text
JSONB e necessario
na Outbox?

audit precisa
de particionamento?

projection sera tabela
ou materialized view?

steps exigem particionamento
em escala futura?

qual TTL de idempotencia?

qual retencao de Inbox?

qual volume real
de eventos?

qual estrategia
de testcontainers
sera usada?
```

Essas perguntas podem virar ADRs depois.

---

### 49. Criar boundary da próxima aula

Arquivo:

```text
database/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 675 define:

- ownership;
- schemas;
- tables;
- constraints;
- indexes;
- locking;
- idempotency;
- Outbox;
- Inbox;
- audit;
- projections;
- migrations;
- rollback.

A aula 676 define:

- system context;
- containers;
- components;
- external systems;
- relationships;
- runtime responsibilities;
- deployment views;
- observability relationships.

Nenhum container final
e aprovado nesta aula.
```

---

### 50. Testar constraints

Casos:

- quantity zero;
- amount negativo;
- status inválido;
- version negativa;
- duplicate idempotency;
- duplicate external operation;
- duplicate Inbox message;
- compensation attempts negativos.

---

### 51. Testar optimistic locking

Cenário:

```text
reader A:
version 4.

reader B:
version 4.

A salva:
version 5.

B salva:
zero rows.
```

Resultado:

```text
VERSION_CONFLICT.
```

---

### 52. Testar idempotency storage

Cenários:

- nova chave;
- mesma chave e mesmo hash;
- mesma chave e hash diferente;
- `PROCESSING` ativo;
- `PROCESSING` expirado;
- `COMPLETED`;
- cleanup.

---

### 53. Testar Outbox

Valide:

- estado e evento no mesmo commit;
- rollback remove ambos;
- publisher com `SKIP LOCKED`;
- retry incrementa attempts;
- published registra timestamp;
- evento não é perdido.

---

### 54. Testar Inbox

Valide:

- primeira mensagem processa;
- duplicada não repete efeito;
- mesmo ID e hash diferente gera finding;
- rollback mantém mensagem não processada;
- replay controlado funciona.

---

### 55. Testar audit

Valide:

- ação;
- ator;
- correlation;
- previous status;
- new status;
- reason;
- timestamp;
- sem dados sensíveis desnecessários.

---

### 56. Testar projection

Valide:

- update idempotente;
- versão crescente;
- evento fora de ordem;
- rebuild;
- freshness;
- query por tenant;
- estado autoritativo não é alterado.

---

### 57. Criar reports

Exemplo:

```yaml
finalDatabaseModel:
  schemas:
    total:
      1

  tables:
    authoritative:
      4
    reliability:
      3
    audit:
      1
    projection:
      1

  constraints:
    total:
      19
    critical:
      9

  indexes:
    total:
      8
    withKnownQuery:
      8

  idempotency:
    tenantScoped:
      true
    payloadHash:
      true

  Outbox:
    atomic:
      true

  Inbox:
    deduplicated:
      true

  migrations:
    total:
      11
    destructive:
      0

  C4:
    finalized:
      false

  gate:
    PASS
```

---

### 58. Criar evidence

Arquivo:

```text
contracts/final-database-model-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- schema count;
- authoritative table count;
- reliability table count;
- audit table count;
- projection count;
- constraint count;
- critical constraint count;
- index count;
- index known query coverage;
- tenant scoped key coverage;
- optimistic locking status;
- idempotency payload hash status;
- Outbox atomicity status;
- Inbox deduplication status;
- migration count;
- destructive migration count;
- rollback test status;
- backup restore test status;
- traceability coverage;
- C4 finalized;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados reais;
- credenciais;
- endpoints privados;
- topologia de deploy;
- container count;
- namespace;
- cluster;
- secrets;
- conteúdo detalhado da aula 676.

---

### 59. Criar gate

O gate valida:

- charter;
- ownership;
- schema;
- tables;
- keys;
- constraints;
- indexes;
- locking;
- idempotency;
- Outbox;
- Inbox;
- audit;
- projection;
- retention;
- migrations;
- rollback;
- backup restore;
- traceability;
- risks;
- tests;
- reports;
- evidence;
- não antecipação.

Status:

```text
PASS;

FAIL_DATABASE_CHARTER;

FAIL_DATA_OWNERSHIP;

FAIL_SCHEMA;

FAIL_TABLE;

FAIL_PRIMARY_KEY;

FAIL_TENANT_SCOPE;

FAIL_CONSTRAINT;

FAIL_INDEX;

FAIL_LOCKING;

FAIL_IDEMPOTENCY;

FAIL_OUTBOX;

FAIL_INBOX;

FAIL_AUDIT;

FAIL_PROJECTION;

FAIL_RETENTION;

FAIL_MIGRATION;

FAIL_ROLLBACK;

FAIL_BACKUP_RESTORE;

FAIL_TRACEABILITY;

FAIL_DATABASE_TEST;

FAIL_C4_ANTICIPATION;

INCONCLUSIVE.
```

---

### 60. Executar validação completa

```powershell
.\scripts\m20\orderflow-database-model\validate-database-contract.ps1

.\scripts\m20\orderflow-database-model\validate-data-ownership.ps1

.\scripts\m20\orderflow-database-model\validate-schema.ps1

.\scripts\m20\orderflow-database-model\validate-tables.ps1

.\scripts\m20\orderflow-database-model\validate-constraints.ps1

.\scripts\m20\orderflow-database-model\validate-indexes.ps1

.\scripts\m20\orderflow-database-model\validate-locking.ps1

.\scripts\m20\orderflow-database-model\validate-idempotency-storage.ps1

.\scripts\m20\orderflow-database-model\validate-outbox-inbox.ps1

.\scripts\m20\orderflow-database-model\validate-migrations.ps1

.\scripts\m20\orderflow-database-model\run-orderflow-database-tests.ps1

.\scripts\m20\orderflow-database-model\collect-orderflow-database-evidence.ps1

.\scripts\m20\orderflow-database-model\verify-orderflow-database-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 61. Encerrar o laboratório

Confirme:

- charter;
- ownership;
- schema;
- aggregate tables;
- children;
- compensation;
- optimistic locking;
- idempotency;
- Outbox;
- Inbox;
- audit;
- projection;
- constraints;
- indexes;
- retention;
- migrations;
- rollback;
- backup restore;
- traceability;
- risks;
- open questions;
- tests;
- reports;
- evidence;
- gate aprovado;
- C4 não finalizado.

---

## Entendendo o que foi feito

### O domínio ganhou persistência

O aggregate passou a possuir representação relacional sem depender de JPA.

### Tenant entrou nas chaves

A modelagem reduz o risco de query e unicidade sem tenant.

### Constraints reforçaram invariantes

Quantidade, valores, status, versão, duplicidade e tentativas ganharam proteção adicional.

### Concorrência ficou explícita

Optimistic locking diferencia atualização válida de conflito.

### Idempotência ganhou armazenamento

Chave, operação, tenant, hash, status e resposta passaram a formar um registro confiável.

### Eventos ganharam atomicidade

Outbox conecta estado e publicação.

### Consumers ganharam deduplicação

Inbox impede efeitos repetidos.

### Consulta foi separada de comando

Projection operacional atende leitura sem virar autoridade de decisão.

### Evolução ganhou estratégia

Migrations pequenas, expand-contract, backfill idempotente e rollback compatível reduzem risco.

---

## Erros comuns importantes

### Uma tabela para tudo

Consulta, locking e evolução ficam difíceis.

### Uma tabela por classe

A persistência copia estrutura sem entender transação.

### Chave sem tenant

Isolamento depende apenas da aplicação.

### Trigger com regra de negócio

Comportamento fica escondido.

### Índice sem query

Escrita fica mais cara sem benefício.

### Retry após version conflict

Pode repetir decisão não idempotente.

### Outbox em outra transação

Evento pode divergir do estado.

### Inbox apenas em memória

Restart perde deduplicação.

### Audit igual a log

Responsabilidade e retenção ficam confusas.

### Projection como autoridade

Consistência eventual passa a decidir comandos.

### Migration destrutiva imediata

Rollback deixa de funcionar.

### Antecipar containers

A arquitetura C4 pertence à aula 676.

---

## Comandos úteis

### Validar schema

```powershell
.\scripts\m20\orderflow-database-model\validate-schema.ps1
```

### Validar constraints

```powershell
.\scripts\m20\orderflow-database-model\validate-constraints.ps1
```

### Validar locking

```powershell
.\scripts\m20\orderflow-database-model\validate-locking.ps1
```

### Validar Outbox e Inbox

```powershell
.\scripts\m20\orderflow-database-model\validate-outbox-inbox.ps1
```

### Executar testes

```powershell
.\scripts\m20\orderflow-database-model\run-orderflow-database-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m20\orderflow-database-model\verify-orderflow-database-gate.ps1
```

---

## Exercício guiado

Modele a persistência do cenário:

```text
pagamento recusado
apos estoque reservado.
```

Crie:

1. alterações no root;
2. processing step;
3. compensation action;
4. audit record;
5. Outbox events;
6. version update;
7. transaction boundary;
8. constraints;
9. índices usados;
10. teste de rollback;
11. teste de duplicidade;
12. query operacional;
13. evidence;
14. pergunta para o C4.

Não defina container final.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 674 e ponte para a aula 676 foram preservadas;
- laboratório `orderflow-database-model` foi criado;
- Database Model Charter foi criado;
- contrato principal foi criado;
- ownership foi definido;
- schema `orderflow` foi criado;
- tabela `order_process` foi criada;
- chave composta por tenant e order foi usada;
- tabela `order_line` foi criada;
- quantities e prices possuem checks;
- tabela `processing_step` foi criada;
- operação externa duplicada foi protegida;
- tabela `compensation_action` foi criada;
- optimistic locking foi modelado;
- conflito foi diferenciado de not found;
- Idempotency Registry foi criado;
- request hash foi armazenado;
- concorrência idempotente foi protegida;
- Outbox foi criada;
- atomicidade da Outbox foi definida;
- seleção com `SKIP LOCKED` foi definida;
- Inbox foi criada;
- transaction da Inbox foi definida;
- Audit Model foi criado;
- audit foi tratado como append-only;
- projection operacional foi criada;
- query model foi separado da autoridade;
- constraints foram catalogadas;
- índices foram catalogados;
- migration de índices foi criada;
- índices duplicados foram evitados;
- row model foi criado;
- mapper foi definido;
- reconstituição do aggregate foi tratada;
- repository Postgres foi modelado;
- inserts concorrentes foram protegidos;
- retention foi definida;
- cleanup foi modelado;
- migration strategy foi criada;
- expand-contract foi aplicado;
- rollback strategy foi criada;
- backup e restore foram definidos;
- seed foi sanitizado;
- traceability foi criada;
- riscos e perguntas abertas foram registrados;
- boundary da aula 676 foi criado;
- testes de constraints, locking, idempotência, Outbox, Inbox, audit, projection e migration foram definidos;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- arquitetura C4 final não foi antecipada.

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
  labs/m20/aula-675-modelagem-banco-final/orderflow-database-model `
  scripts/m20/orderflow-database-model `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|privateEndpoint|productionCluster|namespace"
```

Commit recomendado:

```powershell
git commit -m "feat(m20): modelar banco final do OrderFlow"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- dados reais;
- credenciais;
- endpoints privados;
- cluster;
- namespace;
- deploy units finais;
- conteúdo detalhado da aula 676.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou a modelagem de banco final do OrderFlow.

Você definiu:

```text
Database Model Charter;

Data Ownership;

Schema orderflow;

Order Process Table;

Order Line Table;

Processing Step Table;

Compensation Action Table;

Optimistic Locking;

Idempotency Registry;

Outbox;

Inbox;

Audit;

Operational Projection;

Constraints;

Indexes;

Retention;

Migrations;

Rollback;

Backup and Restore;

Traceability;

tests, reports, evidence e gate.
```

Você transformou o aggregate em persistência relacional sem colocar comportamento no banco.

Você protegeu tenant, concorrência, idempotência, publicação, deduplicação, auditoria e consultas operacionais.

A próxima aula será:

```text
676 - M20.06 - Arquitetura C4 final
```

Nela, você consolidará pessoas, sistemas, containers, components, bancos, providers, mensageria, observabilidade e responsabilidades do OrderFlow.

Nenhuma arquitetura C4 final foi aprovada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini ownership.
- [ ] Criei schema e tabelas.
- [ ] Protegi tenant.
- [ ] Criei constraints.
- [ ] Criei índices.
- [ ] Modelei locking.
- [ ] Modelei idempotência.
- [ ] Criei Outbox.
- [ ] Criei Inbox.
- [ ] Criei audit.
- [ ] Criei projection.
- [ ] Planejei migrations.
- [ ] Planejei rollback.
- [ ] Testei recovery.
- [ ] Preservei C4 para a aula 676.

---

## Troubleshooting adicional

### A tabela root possui muitas colunas

Separe collections e dados derivados, mas preserve atomicidade.

### Toda regra virou constraint

Mantenha comportamento no domínio.

### A query precisa de join pesado

Avalie projection ou índice baseado em query real.

### Version conflict acontece muito

Revise aggregate size, concorrência e command design.

### Idempotency record fica preso em PROCESSING

Crie expiration e recovery.

### Outbox cresce indefinidamente

Defina cleanup após publicação e retenção.

### Inbox impede replay legítimo

Use consumer version ou estratégia de replay controlado.

### Audit possui payload inteiro

Minimize dados e registre metadados relevantes.

### Projection divergiu

Rebuild a partir de eventos ou estado autoritativo.

### Migration precisa remover coluna

Use expand-contract.

### Backup existe, mas nunca foi restaurado

Execute restore test.

### Quero desenhar serviços

Essa etapa pertence à aula 676.

---

## Perguntas de revisão

1. Qual papel do banco?
2. Banco é o domínio?
3. Por que tenant participa da chave?
4. O que constraint protege?
5. O que é optimistic locking?
6. Como detectar version conflict?
7. O que é Idempotency Registry?
8. Por que guardar payload hash?
9. O que é Outbox?
10. Por que Outbox precisa da mesma transação?
11. O que é Inbox?
12. Como Inbox deduplica?
13. Audit é igual a log?
14. O que é projection?
15. Projection pode decidir comando?
16. Quando criar índice?
17. Por que evitar trigger de negócio?
18. O que é expand-contract?
19. Como fazer rollback de schema?
20. Por que testar restore?
21. O que é retention?
22. O que a aula 676 fará?
23. O que não foi definido nesta aula?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Persistir, proteger e recuperar estado.
2. Não.
3. Para reforçar isolamento.
4. Integridade contra concorrência e bugs.
5. Controle por versão esperada.
6. Update zero com registro existente.
7. Registro durável de chave e resposta.
8. Para detectar chave reutilizada com outro comando.
9. Tabela de eventos a publicar.
10. Para evitar estado sem evento.
11. Registro de mensagens consumidas.
12. Consumer e message ID únicos.
13. Não.
14. Modelo derivado de consulta.
15. Não.
16. Quando existe query conhecida.
17. Para não esconder comportamento.
18. Evolução compatível em etapas.
19. Preferindo rollback de aplicação.
20. Para provar recuperação.
21. Política de permanência e cleanup.
22. Consolidar C4.
23. Containers e deploy topology.
24. Arquitetura C4 final.
25. Banco reforça invariantes; domínio decide.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 675 - M20.05 - Modelagem banco final

- Continuei após Modelagem domínio final.
- Criei o laboratório `orderflow-database-model`.
- Criei Database Model Charter.
- Criei o contrato principal.
- Defini Data Ownership.
- Criei schema `orderflow`.
- Criei tabela `order_process`.
- Usei PK com tenant e order.
- Criei tabela `order_line`.
- Criei tabela `processing_step`.
- Protegi operação externa duplicada.
- Criei tabela `compensation_action`.
- Modelei optimistic locking.
- Diferenciei version conflict de not found.
- Criei Idempotency Registry.
- Armazenei request hash.
- Protegi concorrência idempotente.
- Criei Outbox.
- Garanti atomicidade entre estado e evento.
- Modelei seleção com `SKIP LOCKED`.
- Criei Inbox.
- Modelei deduplicação de consumer.
- Criei Audit Model.
- Tratei audit como append-only.
- Criei Operational Projection.
- Separei query model de autoridade.
- Criei catálogo de constraints.
- Criei catálogo de índices.
- Evitei índices duplicados.
- Criei modelos de persistência.
- Defini mapper e reconstituição.
- Modelei repository Postgres.
- Protegi inserts concorrentes.
- Criei Retention Policy.
- Modelei cleanup idempotente.
- Criei Migration Strategy.
- Apliquei expand-contract.
- Criei Rollback Strategy.
- Criei Backup and Restore Plan.
- Criei seed sanitizado.
- Criei Database Traceability.
- Criei riscos e perguntas abertas.
- Criei boundary para a aula 676.
- Defini testes de constraints, locking, idempotência, Outbox, Inbox, audit, projection e migration.
- Criei reports, evidence e gate.
- Não antecipei arquitetura C4 final.
- Próxima aula: Arquitetura C4 final.
```

---

## Referência técnica curta

- Relational Model.
- Data Ownership.
- Composite Primary Key.
- Constraint.
- Index.
- Optimistic Locking.
- Idempotency Registry.
- Outbox.
- Inbox.
- Audit Log.
- Projection.
- Retention.
- Migration.
- Expand-Contract.
- Rollback.
- Backup.
- Restore.
- PostgreSQL.

Regra final:

```text
A modelagem de banco final do OrderFlow deve persistir o aggregate sem substituir o domínio: o schema orderflow possui ownership explícito, order_process usa chave composta por tenant e order, order_line preserva quantidade e valor, processing_step registra fatos relevantes e protege operação externa duplicada, compensation_action acompanha ações planejadas e resultados, optimistic locking atualiza por version esperada e retorna VERSION_CONFLICT quando necessário, e Idempotency Registry usa tenant, operação, key, request hash, status, resposta e expiration para impedir comandos duplicados e detectar reuso divergente; Outbox grava eventos na mesma transação do estado e publica com workers concorrentes usando SKIP LOCKED, Inbox usa consumer e message ID para deduplicar efeitos dentro da transação local, audit é append-only e registra ator, causa, correlação e transição, projections atendem consultas e freshness sem assumir autoridade, constraints reforçam quantidade, valores, status, version, unicidade e attempts, índices existem apenas para queries conhecidas, retention e cleanup limitam crescimento, migrations são pequenas, forward-safe e expand-contract, rollback prioriza compatibilidade de aplicação, backup só é válido com restore test, e traceability conecta invariantes, constraints, testes e evidence; o gate termina com charter, ownership, schemas, tables, keys, constraints, indexes, locking, idempotency, Outbox, Inbox, audit, projections, retention, migrations, rollback, backup, restore, risks, tests, reports e evidence aprovados, enquanto system context, containers, components, runtime relationships e deployment views permanecem reservados para a aula 676.
```
