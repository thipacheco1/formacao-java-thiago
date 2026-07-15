# 681 - M20.11 - Implementacao persistencia

## Apresentação da aula

Na aula 680, você implementou a camada de aplicação do OrderFlow.

O módulo `orderflow-application` passou a possuir:

- commands;
- input ports;
- output ports;
- handlers;
- transaction boundary;
- `OrderProcessRepository`;
- `IdempotencyStore`;
- `InboxStore`;
- `OutboxStore`;
- `AuditStore`;
- clock;
- identifier generator;
- fingerprint;
- erros de aplicação;
- resultados internos;
- fakes;
- testes de idempotência;
- testes de rollback;
- testes de concorrência;
- testes arquiteturais.

Até este ponto, os casos de uso sabem o que precisam da infraestrutura.

Mas os ports ainda não possuem implementações concretas.

Por exemplo:

```text
OrderProcessRepository
```

define que a aplicação precisa:

- localizar um aggregate por tenant e pedido;
- inserir um aggregate;
- atualizar um aggregate usando versão esperada.

Ele não determina:

- qual banco será usado;
- quais tabelas existirão;
- como JPA fará o mapping;
- como o optimistic locking será executado;
- como children serão persistidos;
- como exceptions SQL serão convertidas;
- como a transação será iniciada.

Nesta aula, os ports da aplicação receberão adapters reais.

A tecnologia adotada será:

```text
PostgreSQL;

Spring Data JPA;

Spring Transaction Management;

Flyway;

Testcontainers;

JUnit 5.
```

A decisão está alinhada às aulas anteriores:

- PostgreSQL é a autoridade;
- o domínio continua livre de framework;
- a aplicação continua livre de framework;
- apenas o adapter de persistência conhece JPA;
- estado, audit, Inbox, idempotência e Outbox compartilham transação;
- multi-tenancy aparece em todas as chaves relevantes;
- optimistic locking protege o aggregate;
- migrations seguem expand-contract.

O módulo implementado será:

```text
libs/orderflow-persistence
```

O laboratório será:

```text
labs/m20/aula-681-implementacao-persistencia/orderflow-persistence-implementation
```

Você criará:

- configuração do módulo;
- migrations Flyway;
- entidades JPA;
- embedded IDs;
- Spring Data repositories;
- mapper de aggregate;
- adapter de repository;
- adapter de transação;
- Idempotency Store;
- Outbox Store;
- Inbox Store;
- Audit Store;
- clock e identifiers;
- tratamento de optimistic locking;
- testes com PostgreSQL real em container;
- testes de migrations;
- testes de rollback;
- reports, evidence e gate.

A próxima aula será:

```text
682 - M20.12 - Implementacao API REST
```

Na aula 682, a API receberá controllers, DTOs, validação, autenticação, tenant context, idempotency header, tratamento de erros e OpenAPI.

Nesta aula, nenhum controller será criado.

Regra central:

```text
o adapter de persistencia
traduz dominio e aplicacao
para banco e JPA

sem permitir
que JPA controle
o modelo de dominio.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
678:
Configuracao repositorio profissional.

679:
Implementacao dominio.

680:
Implementacao casos de uso.

681:
Implementacao persistencia.

682:
Implementacao API REST.

683:
Validacoes e erros.
```

O domínio protege comportamento.

A aplicação coordena casos de uso.

A persistência implementa os output ports.

A API será somente um adapter de entrada.

Essa separação evita que:

- controller acesse repository JPA;
- entity JPA seja retornada na API;
- domínio receba annotations;
- transaction boundary dependa do controller;
- migrations fiquem escondidas no startup;
- idempotência exista apenas no endpoint;
- Outbox seja publicada dentro do request.

---

## Objetivo prático

Será criada a estrutura:

```text
libs/orderflow-persistence
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/orderflow/persistence
│   │   │       ├── config
│   │   │       │   ├── PersistenceConfiguration.java
│   │   │       │   └── PersistenceProperties.java
│   │   │       ├── entity
│   │   │       │   ├── OrderProcessKey.java
│   │   │       │   ├── OrderProcessEntity.java
│   │   │       │   ├── OrderLineKey.java
│   │   │       │   ├── OrderLineEntity.java
│   │   │       │   ├── ProcessingStepKey.java
│   │   │       │   ├── ProcessingStepEntity.java
│   │   │       │   ├── CompensationActionKey.java
│   │   │       │   ├── CompensationActionEntity.java
│   │   │       │   ├── IdempotencyKeyEntity.java
│   │   │       │   ├── IdempotencyRecordEntity.java
│   │   │       │   ├── OutboxEventEntity.java
│   │   │       │   ├── InboxMessageKey.java
│   │   │       │   ├── InboxMessageEntity.java
│   │   │       │   └── OrderAuditEntity.java
│   │   │       ├── mapper
│   │   │       │   ├── OrderProcessPersistenceMapper.java
│   │   │       │   └── PersistenceMappingException.java
│   │   │       ├── repository
│   │   │       │   ├── SpringOrderProcessRepository.java
│   │   │       │   ├── SpringOrderLineRepository.java
│   │   │       │   ├── SpringProcessingStepRepository.java
│   │   │       │   ├── SpringCompensationRepository.java
│   │   │       │   ├── SpringIdempotencyRepository.java
│   │   │       │   ├── SpringOutboxRepository.java
│   │   │       │   ├── SpringInboxRepository.java
│   │   │       │   └── SpringOrderAuditRepository.java
│   │   │       └── adapter
│   │   │           ├── JpaOrderProcessRepositoryAdapter.java
│   │   │           ├── JpaIdempotencyStore.java
│   │   │           ├── JpaOutboxStore.java
│   │   │           ├── JpaInboxStore.java
│   │   │           ├── JpaAuditStore.java
│   │   │           ├── SpringTransactionManager.java
│   │   │           ├── SystemApplicationClock.java
│   │   │           └── UuidIdentifierGenerator.java
│   │   └── resources
│   │       └── db
│   │           └── migration
│   │               ├── V001__create_orderflow_schema.sql
│   │               ├── V002__create_order_process.sql
│   │               ├── V003__create_order_children.sql
│   │               ├── V004__create_idempotency_registry.sql
│   │               ├── V005__create_outbox.sql
│   │               ├── V006__create_inbox.sql
│   │               ├── V007__create_order_audit.sql
│   │               └── V008__create_indexes.sql
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/persistence
│               ├── PostgreSqlContainerSupport.java
│               ├── FlywayMigrationTest.java
│               ├── JpaOrderProcessRepositoryTest.java
│               ├── OptimisticLockingIntegrationTest.java
│               ├── IdempotencyStoreIntegrationTest.java
│               ├── OutboxAtomicityIntegrationTest.java
│               ├── InboxDeduplicationIntegrationTest.java
│               ├── AuditStoreIntegrationTest.java
│               ├── PersistenceRollbackIntegrationTest.java
│               └── PersistenceArchitectureTest.java
└── target
```

---

## Conceito essencial

### Entity JPA não é aggregate

A entity JPA representa armazenamento.

O aggregate representa comportamento.

Eles podem parecer semelhantes, mas possuem responsabilidades diferentes.

A entity JPA pode possuir:

- construtor protegido;
- setters usados pelo mapper;
- annotations;
- campos técnicos;
- version;
- chaves;
- relationships.

O aggregate deve possuir:

- invariantes;
- métodos com intenção;
- eventos;
- policies;
- ausência de framework.

### Mapper é boundary

O mapper converte:

```text
OrderProcess
-> entidades JPA.
```

E:

```text
entidades JPA
-> OrderProcess.reconstitute.
```

Ele deve falhar diante de um snapshot inválido.

Não deve corrigir silenciosamente dados corrompidos.

### Optimistic locking pertence ao adapter

O domínio possui versão.

O adapter usa essa versão para garantir:

```text
update somente
quando a versao esperada
ainda e atual.
```

Quando a atualização falha, o adapter converte para:

```text
ConcurrencyConflict.
```

### TransactionManager envolve todos os stores

O handler da aula 680 usa um port de transação.

O adapter Spring deve garantir que:

- aggregate;
- children;
- idempotência;
- Inbox;
- Outbox;
- audit;

participem da mesma transação física quando chamados no mesmo caso de uso.

### Teste de persistência precisa de banco real

H2 não é substituto perfeito para PostgreSQL.

Diferenças podem existir em:

- SQL;
- constraints;
- JSONB;
- locking;
- índices parciais;
- timezone;
- concorrência;
- migrations.

Por isso, os testes utilizarão Testcontainers com PostgreSQL.

---

## Mão na massa guiada

### 1. Abrir o módulo de persistência

Na raiz do repositório:

```powershell
Set-Location `
  libs/orderflow-persistence
```

---

### 2. Configurar o POM

Arquivo:

```text
libs/orderflow-persistence/pom.xml
```

Conteúdo essencial:

```xml
<dependencies>
    <dependency>
        <groupId>br.com.formacao</groupId>
        <artifactId>orderflow-application</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>

    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

As versões continuam centralizadas no parent POM.

---

### 3. Criar migrations Flyway

Crie o diretório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  src/main/resources/db/migration
```

As migrations devem corresponder ao modelo da aula 675.

---

### 4. Criar schema

Arquivo:

```text
V001__create_orderflow_schema.sql
```

Conteúdo:

```sql
CREATE SCHEMA IF NOT EXISTS orderflow;
```

O usuário da aplicação precisa de privilégios apenas nesse schema.

---

### 5. Criar tabela do aggregate

Arquivo:

```text
V002__create_order_process.sql
```

Conteúdo:

```sql
CREATE TABLE orderflow.order_process (
    tenant_id VARCHAR(80) NOT NULL,
    order_id UUID NOT NULL,
    status VARCHAR(40) NOT NULL,
    currency CHAR(3) NOT NULL,
    total_amount NUMERIC(19, 2) NOT NULL,
    stock_confirmed BOOLEAN NOT NULL,
    payment_confirmed BOOLEAN NOT NULL,
    fulfillment_started BOOLEAN NOT NULL,
    irreversible_point_reached BOOLEAN NOT NULL,
    version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT pk_order_process
        PRIMARY KEY (tenant_id, order_id),
    CONSTRAINT ck_order_process_amount
        CHECK (total_amount >= 0),
    CONSTRAINT ck_order_process_version
        CHECK (version >= 0)
);
```

---

### 6. Criar tabelas filhas

Arquivo:

```text
V003__create_order_children.sql
```

Crie:

- `order_line`;
- `processing_step`;
- `compensation_action`;
- `applied_external_operation`.

Todas possuem:

```text
tenant_id;

order_id;

foreign key composta.
```

`applied_external_operation` possui unicidade por:

```text
tenant_id;
provider;
external_operation_id.
```

---

### 7. Criar Idempotency Registry

Arquivo:

```text
V004__create_idempotency_registry.sql
```

A chave primária será:

```text
tenant_id;
operation;
idempotency_key.
```

Campos principais:

- request hash;
- status;
- response fingerprint;
- response body;
- error code;
- created at;
- expires at;
- completed at.

---

### 8. Criar Outbox

Arquivo:

```text
V005__create_outbox.sql
```

Campos:

- event ID;
- tenant;
- aggregate ID;
- event type;
- event version;
- correlation;
- occurred at;
- payload JSONB;
- status;
- attempts;
- available at;
- published at;
- last error.

A tabela não possui foreign key para o aggregate porque eventos publicados podem sobreviver à retenção do pedido.

---

### 9. Criar Inbox

Arquivo:

```text
V006__create_inbox.sql
```

Chave primária:

```text
consumer_name;
message_id.
```

Campos:

- tenant;
- payload fingerprint;
- status;
- received at;
- processed at;
- result code.

---

### 10. Criar auditoria

Arquivo:

```text
V007__create_order_audit.sql
```

Audit é append-only.

Campos:

- audit ID;
- tenant;
- order;
- action;
- previous status;
- new status;
- correlation;
- occurred at.

---

### 11. Criar índices

Arquivo:

```text
V008__create_indexes.sql
```

Inclua:

```sql
CREATE INDEX idx_order_process_status
    ON orderflow.order_process (
        tenant_id,
        status,
        updated_at DESC
    );

CREATE INDEX idx_outbox_pending
    ON orderflow.outbox_event (
        status,
        available_at,
        occurred_at
    )
    WHERE status IN ('PENDING', 'FAILED');

CREATE INDEX idx_idempotency_expiration
    ON orderflow.idempotency_record (
        expires_at
    );

CREATE INDEX idx_order_audit_timeline
    ON orderflow.order_audit (
        tenant_id,
        order_id,
        occurred_at
    );
```

Cada índice deve apontar para uma query conhecida.

---

## Chaves e entidades JPA

### 12. Criar OrderProcessKey

```java
package br.com.formacao.orderflow.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class OrderProcessKey
        implements Serializable {

    @Column(
            name = "tenant_id",
            nullable = false,
            length = 80)
    private String tenantId;

    @Column(
            name = "order_id",
            nullable = false)
    private UUID orderId;

    protected OrderProcessKey() {
    }

    public OrderProcessKey(
            String tenantId,
            UUID orderId) {

        this.tenantId = Objects.requireNonNull(
                tenantId);
        this.orderId = Objects.requireNonNull(
                orderId);
    }

    public String tenantId() {
        return tenantId;
    }

    public UUID orderId() {
        return orderId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }

        if (!(other instanceof OrderProcessKey that)) {
            return false;
        }

        return tenantId.equals(that.tenantId)
                && orderId.equals(that.orderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, orderId);
    }
}
```

---

### 13. Criar OrderProcessEntity

```java
package br.com.formacao.orderflow.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
        schema = "orderflow",
        name = "order_process")
public class OrderProcessEntity {

    @EmbeddedId
    private OrderProcessKey id;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 19,
            scale = 2)
    private BigDecimal totalAmount;

    @Column(
            name = "stock_confirmed",
            nullable = false)
    private boolean stockConfirmed;

    @Column(
            name = "payment_confirmed",
            nullable = false)
    private boolean paymentConfirmed;

    @Column(
            name = "fulfillment_started",
            nullable = false)
    private boolean fulfillmentStarted;

    @Column(
            name = "irreversible_point_reached",
            nullable = false)
    private boolean irreversiblePointReached;

    @Version
    @Column(nullable = false)
    private long version;

    @Column(
            name = "created_at",
            nullable = false)
    private Instant createdAt;

    @Column(
            name = "updated_at",
            nullable = false)
    private Instant updatedAt;

    protected OrderProcessEntity() {
    }
}
```

Use métodos package-private ou mapper dedicado para preencher campos.

---

### 14. Criar entities filhas

Crie:

- `OrderLineEntity`;
- `ProcessingStepEntity`;
- `CompensationActionEntity`;
- `AppliedExternalOperationEntity`.

Prefira repositories explícitos a um grafo JPA complexo.

Motivos:

- controle de inserts;
- collections potencialmente grandes;
- diff previsível;
- menor risco de cascade inesperado;
- melhor visualização de SQL.

---

### 15. Evitar relacionamento bidirecional

Não crie:

```text
OrderProcessEntity
<-> OrderLineEntity
```

com ambos os lados mutáveis.

Use chaves compostas e queries por tenant e order.

O mapper reúne as partes.

---

## Spring Data repositories

### 16. Criar SpringOrderProcessRepository

```java
package br.com.formacao.orderflow.persistence.repository;

import br.com.formacao.orderflow.persistence.entity.OrderProcessEntity;
import br.com.formacao.orderflow.persistence.entity.OrderProcessKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringOrderProcessRepository
        extends JpaRepository<
                OrderProcessEntity,
                OrderProcessKey> {
}
```

---

### 17. Criar repositories das children

Crie métodos:

```text
findAllByTenantIdAndOrderId;

deleteAllByTenantIdAndOrderId;

saveAll.
```

Para `ProcessingStep`, prefira inserir somente steps novos.

Para linhas imutáveis, inserts acontecem apenas na criação.

---

### 18. Criar repository de Outbox

Além de `JpaRepository`, crie uma query nativa futura para seleção com:

```text
FOR UPDATE SKIP LOCKED.
```

Nesta aula, valide apenas a persistência e o estado inicial `PENDING`.

A publicação será implementada em aula posterior.

---

## Mapper do aggregate

### 19. Criar PersistenceMappingException

```java
package br.com.formacao.orderflow.persistence.mapper;

public final class PersistenceMappingException
        extends RuntimeException {

    public PersistenceMappingException(
            String message,
            Throwable cause) {

        super(message, cause);
    }

    public PersistenceMappingException(
            String message) {

        super(message);
    }
}
```

---

### 20. Criar OrderProcessPersistenceMapper

Responsabilidades:

```text
toRootEntity;

toLineEntities;

toStepEntities;

toCompensationEntities;

toAppliedOperationEntities;

toDomain.
```

O mapper não abre transação.

O mapper não consulta banco.

---

### 21. Mapear Money

Persistência:

```text
amount NUMERIC;

currency CHAR(3).
```

Domínio:

```text
Money.
```

Na reconstrução:

```java
Money total = Money.of(
        entity.totalAmount().toPlainString(),
        entity.currency());
```

Não converta dinheiro para `double`.

---

### 22. Mapear estado

Persistência usa `VARCHAR`.

Mapper usa:

```java
OrderProcessStatus.valueOf(
        entity.status());
```

Valor desconhecido gera:

```text
PersistenceMappingException.
```

Não use fallback silencioso.

---

### 23. Reconstituir aggregate

O mapper carrega:

- root;
- linhas;
- steps;
- compensações;
- operações aplicadas.

Depois chama:

```text
OrderProcess.reconstitute.
```

A factory do domínio valida o snapshot.

Se falhar:

- não corrige;
- não ignora;
- registra contexto sanitizado;
- propaga erro.

---

## Adapter do repository

### 24. Criar JpaOrderProcessRepositoryAdapter

```java
package br.com.formacao.orderflow.persistence.adapter;

import br.com.formacao.orderflow.application.error.ConcurrencyConflict;
import br.com.formacao.orderflow.application.port.out.OrderProcessRepository;
import br.com.formacao.orderflow.domain.model.OrderProcess;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import br.com.formacao.orderflow.persistence.entity.OrderProcessKey;
import br.com.formacao.orderflow.persistence.mapper.OrderProcessPersistenceMapper;
import br.com.formacao.orderflow.persistence.repository.SpringOrderProcessRepository;
import java.util.Optional;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

public final class JpaOrderProcessRepositoryAdapter
        implements OrderProcessRepository {

    private final SpringOrderProcessRepository roots;
    private final OrderProcessPersistenceMapper mapper;

    public JpaOrderProcessRepositoryAdapter(
            SpringOrderProcessRepository roots,
            OrderProcessPersistenceMapper mapper) {

        this.roots = roots;
        this.mapper = mapper;
    }

    @Override
    public Optional<OrderProcess> find(
            TenantId tenantId,
            OrderId orderId) {

        OrderProcessKey key = new OrderProcessKey(
                tenantId.value(),
                orderId.value());

        return roots.findById(key)
                .map(mapper::toDomain);
    }

    @Override
    public void insert(OrderProcess process) {
        roots.saveAndFlush(
                mapper.toNewEntity(process));
    }

    @Override
    public void update(
            OrderProcess process,
            long expectedVersion) {

        try {
            roots.saveAndFlush(
                    mapper.toExistingEntity(
                            process,
                            expectedVersion));
        } catch (
                ObjectOptimisticLockingFailureException exception) {

            throw new ConcurrencyConflict();
        }
    }
}
```

No adapter completo, o mapper também coordena children.

---

### 25. Não confiar apenas em save

`save` pode executar merge.

Para tornar insert e update previsíveis:

- insert valida ausência;
- update valida presença;
- version precisa corresponder;
- `flush` força detecção dentro da transação;
- conflito é convertido.

---

### 26. Persistir children

Na criação:

```text
insert root;

insert lines;

insert initial steps;

insert applied operations;

insert compensations.
```

Na atualização:

```text
update root;

insert steps novos;

insert operations novas;

insert compensations novas;

update compensations alteradas.
```

Não apague e recrie toda a coleção sem necessidade.

---

## TransactionManager e beans

### 27. Criar SpringTransactionManager

```java
package br.com.formacao.orderflow.persistence.adapter;

import br.com.formacao.orderflow.application.port.out.TransactionManager;
import java.util.function.Supplier;
import org.springframework.transaction.support.TransactionTemplate;

public final class SpringTransactionManager
        implements TransactionManager {

    private final TransactionTemplate template;

    public SpringTransactionManager(
            TransactionTemplate template) {

        this.template = template;
    }

    @Override
    public <T> T execute(
            Supplier<T> operation) {

        return template.execute(
                status -> operation.get());
    }

    @Override
    public void execute(Runnable operation) {
        template.executeWithoutResult(
                status -> operation.run());
    }
}
```

---

### 28. Criar configuração de persistência

`PersistenceConfiguration` registra beans para:

- mapper;
- repository adapter;
- stores;
- transaction manager;
- clock;
- identifiers.

Os handlers continuam sem annotations Spring.

---

### 29. Criar clock e identifiers

```java
package br.com.formacao.orderflow.persistence.adapter;

import br.com.formacao.orderflow.application.port.out.ApplicationClock;
import java.time.Instant;

public final class SystemApplicationClock
        implements ApplicationClock {

    @Override
    public Instant now() {
        return Instant.now();
    }
}
```

`UuidIdentifierGenerator` usa UUID para pedidos, eventos e ações.

Nos testes, continue usando fakes determinísticos.

---

## Idempotência

### 30. Criar IdempotencyKeyEntity

Embedded ID:

- tenant;
- operation;
- key.

A entity principal armazena:

- hash;
- status;
- response fingerprint;
- response body;
- error code;
- timestamps.

---

### 31. Implementar acquire idempotente

O adapter tenta inserir `PROCESSING`.

Se ocorrer conflito de PK:

1. carrega registro existente;
2. compara request hash;
3. retorna `Conflict` quando diferente;
4. retorna `Completed` quando concluído;
5. retorna `InProgress` quando ainda válido;
6. aplica recovery quando expirado.

A operação precisa ser atômica.

---

### 32. Usar insert nativo para acquire

Spring Data pode expor query nativa:

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
    :tenantId,
    :operation,
    :key,
    :requestHash,
    'PROCESSING',
    :createdAt,
    :expiresAt
)
ON CONFLICT DO NOTHING
```

O row count decide se a key foi adquirida.

---

### 33. Concluir idempotência

`complete` atualiza somente registro:

```text
status = PROCESSING;

request hash esperado.
```

Se zero linhas forem atualizadas, o adapter gera erro de consistência.

Não conclua uma key conflitante.

---

## Outbox

### 34. Criar OutboxEventEntity

A entity contém:

- event ID;
- tenant;
- aggregate ID;
- type;
- version;
- correlation;
- payload;
- status;
- attempts;
- timestamps.

O payload pode ser armazenado como string JSON ou JSONB por converter.

A serialização pertence ao adapter.

---

### 35. Implementar JpaOutboxStore

`appendAll`:

- converte envelopes;
- define status `PENDING`;
- define attempts zero;
- preserva event ID;
- preserva occurred at;
- executa `saveAll`.

Não publica.

---

### 36. Garantir Outbox na mesma transação

Teste:

- handler salva aggregate;
- Outbox falha;
- transação faz rollback;
- aggregate não fica visível;
- evento não fica visível;
- idempotência não fica `COMPLETED`.

---

## Inbox

### 37. Criar InboxMessageEntity

Campos:

- composite key;
- tenant;
- fingerprint;
- status;
- timestamps;
- result.

Status:

```text
RECEIVED;

PROCESSED;

FAILED.
```

---

### 38. Implementar tryReceive

Use insert com:

```text
ON CONFLICT DO NOTHING.
```

Quando conflito:

- carregar registro;
- comparar fingerprint;
- igual significa duplicata;
- diferente significa divergência;
- divergência não pode ser tratada como duplicata silenciosa.

---

### 39. Implementar markProcessed

Atualize:

- status;
- result code;
- processed at.

Use consumer e message ID na cláusula `WHERE`.

---

## Auditoria

### 40. Criar OrderAuditEntity

A entity possui apenas criação.

Não exponha update funcional.

`JpaAuditStore.append` gera audit ID e insere uma linha.

---

### 41. Evitar dados sensíveis no audit

Armazene:

- tenant;
- order;
- action;
- estados;
- correlation;
- timestamp.

Não armazene:

- token;
- payload completo;
- credencial;
- dado pessoal desnecessário;
- stack trace.

---

## Testcontainers e migrations

### 42. Criar PostgreSqlContainerSupport

```java
package br.com.formacao.orderflow.persistence;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
public abstract class PostgreSqlContainerSupport {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>(
                    "postgres:16-alpine");
}
```

Use uma versão fixada e revisada no projeto.

---

### 43. Criar FlywayMigrationTest

Valide:

- banco vazio;
- todas as migrations aplicadas;
- schema existente;
- tabelas existentes;
- versão atual;
- nenhuma migration falha;
- checksum íntegro.

---

### 44. Testar insert e find

Fluxo:

- construir aggregate;
- inserir;
- limpar persistence context;
- buscar por tenant e order;
- reconstituir;
- comparar estado relevante;
- confirmar ausência de novos domain events.

---

### 45. Testar isolamento de tenant

Crie:

- mesmo order ID;
- dois tenants.

Valide:

- ambos podem existir;
- busca de um tenant não retorna outro;
- child queries incluem tenant;
- audit e events preservam tenant.

---

### 46. Testar optimistic locking

Fluxo:

1. carregar snapshot A;
2. carregar snapshot B;
3. alterar e salvar A;
4. alterar e salvar B;
5. B gera `ConcurrencyConflict`.

Valide que nenhum evento de B permanece após rollback.

---

### 47. Testar idempotência

Cenários:

- acquire novo;
- acquire repetido com mesmo hash;
- acquire repetido com hash diferente;
- completed;
- in progress;
- expired;
- complete;
- fail.

---

### 48. Testar Outbox atomicidade

Cenário positivo:

- aggregate e Outbox commitam juntos.

Cenário negativo:

- falha após insert do aggregate;
- rollback remove os dois.

---

### 49. Testar Inbox deduplicação

Cenários:

- primeira mensagem retorna `true`;
- mesma mensagem retorna `false`;
- mesmo ID com fingerprint diferente gera erro;
- processed preserva resultado;
- outro consumer pode processar o mesmo message ID.

---

### 50. Testar audit append-only

Valide:

- linha inserida;
- conteúdo sanitizado;
- timeline por tenant e order;
- nenhum método de update no port;
- rollback remove audit da transação falha.

---

### 51. Testar mapper corrompido

Monte snapshot inválido no banco:

```text
PAYMENT_AUTHORIZED
com stock_confirmed false.
```

O mapper deve falhar.

Não deve devolver aggregate incoerente.

---

### 52. Testar migration repetida

Flyway não reaplica migration concluída.

Alterar checksum de migration aplicada deve falhar.

A correção é criar nova migration.

Não edite histórico aplicado.

---

## Arquitetura e qualidade

### 53. Criar PersistenceArchitectureTest

Regras:

- entities ficam em `persistence.entity`;
- adapters implementam output ports;
- domain não depende de persistence;
- application não depende de persistence;
- Spring Data repositories não vazam para handlers;
- controllers não existem no módulo;
- mapper é o único boundary de conversão do aggregate.

---

### 54. Executar testes do módulo

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-persistence `
  -am `
  clean `
  test
```

Docker precisa estar disponível para Testcontainers.

---

### 55. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Domínio, aplicação e persistência precisam permanecer verdes.

---

### 56. Inspecionar SQL em teste

Ative SQL somente no perfil de teste quando necessário.

Verifique:

- query inclui tenant;
- nenhum N+1 inesperado;
- version aparece no update;
- children não são apagados sem necessidade;
- Outbox não publica;
- inserts possuem ordem coerente.

Não deixe logging SQL verboso em produção por padrão.

---

### 57. Criar report

Arquivo:

```text
reports/persistence-implementation-report.yaml
```

Exemplo:

```yaml
persistenceImplementation:
  module:
    orderflow-persistence

  migrations:
    total:
      8
    applied:
      8

  entities:
    total:
      12

  adapters:
    total:
      8

  tests:
    integration:
      31
    architecture:
      1
    failures:
      0

  tenantScopedQueries:
    coveragePercent:
      100

  optimisticLocking:
    status:
      PASS

  idempotency:
    status:
      PASS

  Outbox:
    atomicity:
      PASS

  Inbox:
    deduplication:
      PASS

  API:
    implemented:
      false

  gate:
    PASS
```

---

### 58. Criar evidence

Arquivo:

```text
contracts/persistence-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- migration count;
- applied migration count;
- JPA entity count;
- repository adapter count;
- store adapter count;
- integration test count;
- architecture test count;
- test failure count;
- tenant query coverage;
- optimistic locking test status;
- idempotency test status;
- Outbox atomicity status;
- Inbox deduplication status;
- audit append-only status;
- rollback test status;
- mapper corruption test status;
- framework leak count;
- API implemented;
- documentation status;
- gate status;
- timestamp.

---

### 59. Criar gate de persistência

Status:

```text
PASS;

FAIL_PERSISTENCE_MODULE;

FAIL_MIGRATION;

FAIL_SCHEMA;

FAIL_JPA_ENTITY;

FAIL_COMPOSITE_KEY;

FAIL_TENANT_SCOPE;

FAIL_AGGREGATE_MAPPING;

FAIL_REPOSITORY_ADAPTER;

FAIL_OPTIMISTIC_LOCKING;

FAIL_TRANSACTION_MANAGER;

FAIL_IDEMPOTENCY_STORE;

FAIL_OUTBOX_STORE;

FAIL_INBOX_STORE;

FAIL_AUDIT_STORE;

FAIL_ROLLBACK;

FAIL_TESTCONTAINERS;

FAIL_INTEGRATION_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_API_ANTICIPATION;

INCONCLUSIVE.
```

---

### 60. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Confirme:

- migrations válidas;
- container PostgreSQL iniciando;
- aggregate reconstituído;
- tenant isolado;
- locking funcionando;
- idempotência funcionando;
- Outbox atômica;
- Inbox deduplicando;
- audit persistindo;
- rollback comprovado;
- nenhuma API criada.

---

### 61. Encerrar o laboratório

Confirme:

- POM;
- migrations;
- entities;
- embedded IDs;
- repositories Spring Data;
- mapper;
- repository adapter;
- transaction adapter;
- idempotency adapter;
- Outbox adapter;
- Inbox adapter;
- audit adapter;
- clock;
- identifiers;
- Testcontainers;
- integration tests;
- architecture test;
- report;
- evidence;
- gate aprovado;
- API não implementada.

---

## Entendendo o que foi feito

### Os ports ganharam adapters reais

A aplicação agora pode persistir estado sem conhecer JPA.

### O domínio permaneceu protegido

Annotations e entities ficaram no módulo de infraestrutura.

### Tenant passou a existir nas chaves

Busca, unicidade, children, audit, Inbox e idempotência preservam isolamento.

### Concorrência ficou verificável

Optimistic locking transforma overwrite silencioso em erro previsível.

### Idempotência ganhou persistência durável

Restart não perde o estado da key.

### Eventos ganharam atomicidade

Outbox é salva no mesmo commit do aggregate.

### Consumers ganharam deduplicação

Inbox evita reaplicação de mensagem.

### Migrations viraram parte do build

Testcontainers prova compatibilidade com PostgreSQL real.

---

## Erros comuns importantes

### Retornar entity JPA

A infraestrutura vaza para outras camadas.

### Usar H2 como única prova

Diferenças do PostgreSQL ficam escondidas.

### Esquecer tenant em child query

Isolamento fica vulnerável.

### Cascade em tudo

Deletes e updates inesperados aparecem.

### Mapper corrigindo snapshot

Corrupção fica invisível.

### Concluir idempotência fora da transação

Resposta pode divergir do estado.

### Persistir Outbox depois do commit

Evento pode ser perdido.

### Inbox somente em memória

Restart permite efeito duplicado.

### Editar migration aplicada

Checksum e ambientes divergem.

### Criar controller agora

API pertence à aula 682.

---

## Comandos úteis

### Testar persistência

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-persistence `
  -am `
  test
```

### Executar teste de locking

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-persistence `
  -Dtest=OptimisticLockingIntegrationTest `
  test
```

### Build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Ver migrations

```powershell
Get-ChildItem `
  libs/orderflow-persistence/src/main/resources/db/migration
```

---

## Exercício guiado

Implemente o cenário:

```text
pagamento recusado
apos estoque reservado.
```

Inclua:

1. aggregate persistido;
2. versão esperada;
3. Inbox recebida;
4. resultado aplicado;
5. status `COMPENSATING`;
6. compensation action persistida;
7. processing step persistido;
8. audit inserido;
9. eventos na Outbox;
10. Inbox processada;
11. commit único;
12. teste de rollback;
13. teste de duplicidade;
14. teste de version conflict;
15. teste de tenant;
16. evidence.

Não crie endpoint.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 680 e ponte para a aula 682 foram preservadas;
- módulo `orderflow-persistence` foi implementado;
- POM possui dependências corretas;
- migrations Flyway foram criadas;
- schema foi criado;
- tabela do aggregate foi criada;
- tabelas filhas foram criadas;
- Idempotency Registry foi criado;
- Outbox foi criada;
- Inbox foi criada;
- audit foi criado;
- índices foram criados;
- OrderProcessKey foi criado;
- OrderProcessEntity foi criada;
- entities filhas foram criadas;
- relacionamento bidirecional desnecessário foi evitado;
- repositories Spring Data foram criados;
- repositories de children foram criados;
- repository de Outbox foi criado;
- PersistenceMappingException foi criada;
- mapper foi criado;
- Money foi mapeado sem `double`;
- estado desconhecido falha;
- aggregate foi reconstituído;
- JpaOrderProcessRepositoryAdapter foi criado;
- insert e update foram diferenciados;
- children foram persistidos incrementalmente;
- SpringTransactionManager foi criado;
- configuração de beans foi criada;
- clock e identifiers foram criados;
- entity de idempotência foi criada;
- acquire atômico foi implementado;
- insert nativo foi definido;
- complete idempotente foi implementado;
- Outbox entity foi criada;
- Outbox Store foi implementada;
- atomicidade da Outbox foi testada;
- Inbox entity foi criada;
- `tryReceive` foi implementado;
- `markProcessed` foi implementado;
- audit append-only foi implementado;
- dados sensíveis foram evitados;
- Testcontainers foi configurado;
- Flyway Migration Test foi criado;
- insert e find foram testados;
- tenant isolation foi testado;
- optimistic locking foi testado;
- Idempotency Store foi testado;
- Outbox foi testada;
- Inbox foi testada;
- audit foi testado;
- snapshot corrompido foi testado;
- migration repetida foi testada;
- teste arquitetural foi criado;
- build do módulo passou;
- build completo passou;
- SQL foi inspecionado;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- API REST não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Adicione:

```powershell
git add `
  libs/orderflow-persistence `
  reports/persistence-implementation-report.yaml `
  contracts/persistence-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "password|client_secret|access_token|private_key|@RestController|RequestMapping|OpenAPI"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(persistence): implement PostgreSQL adapters"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- controllers;
- API DTOs;
- HTTP errors;
- OpenAPI;
- autenticação HTTP;
- conteúdo detalhado da aula 682.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou a persistência do OrderFlow.

Você criou:

```text
Flyway migrations;

PostgreSQL schema;

JPA entities;

embedded IDs;

Spring Data repositories;

aggregate mapper;

repository adapter;

transaction adapter;

Idempotency Store;

Outbox Store;

Inbox Store;

Audit Store;

clock;

identifier generator;

Testcontainers tests;

architecture tests;

report, evidence e gate.
```

A aplicação agora possui adapters concretos para:

- salvar aggregate;
- carregar aggregate;
- controlar versão;
- persistir idempotência;
- gravar Outbox;
- deduplicar Inbox;
- registrar auditoria;
- executar transações.

A próxima aula será:

```text
682 - M20.12 - Implementacao API REST
```

Nela, você implementará o adapter HTTP do OrderFlow com controllers, DTOs, Bean Validation, tenant context, idempotency header, error handling, OpenAPI e testes de integração.

Nenhuma API REST foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei migrations.
- [ ] Criei entities JPA.
- [ ] Criei chaves compostas.
- [ ] Criei mapper.
- [ ] Implementei repository adapter.
- [ ] Implementei transaction adapter.
- [ ] Implementei idempotência.
- [ ] Implementei Outbox.
- [ ] Implementei Inbox.
- [ ] Implementei audit.
- [ ] Configurei Testcontainers.
- [ ] Testei PostgreSQL real.
- [ ] Testei rollback.
- [ ] Preservei API para a aula 682.

---

## Troubleshooting adicional

### Testcontainers não inicia

Valide Docker, permissões e imagem.

### Flyway acusa checksum

Não edite migration aplicada; crie nova versão.

### Aggregate retorna sem children

Revise queries e mapper.

### Version conflict não aparece

Force `flush` dentro da transação.

### A entity está vazando

Mantenha retorno do adapter como domínio.

### A Outbox permanece após rollback

Verifique se todos os stores usam o mesmo transaction manager.

### Inbox aceita fingerprint diferente

Trate como divergência e reconciliação.

### Query de child ignora tenant

Inclua tenant e order em todos os métodos.

### Audit contém payload sensível

Reduza para metadados.

### Quero criar controller

Essa etapa pertence à aula 682.

---

## Perguntas de revisão

1. Qual papel do adapter de persistência?
2. Entity JPA é aggregate?
3. Para que serve o mapper?
4. O mapper corrige snapshot inválido?
5. Por que usar PostgreSQL em container?
6. Por que não depender apenas de H2?
7. Onde ficam annotations JPA?
8. Como tenant participa das chaves?
9. O que `@Version` protege?
10. Quando ocorre concurrency conflict?
11. O que o TransactionManager garante?
12. Broker participa da transação?
13. Como idempotência é adquirida?
14. Para que serve request hash?
15. O que Outbox garante?
16. O que Inbox garante?
17. Audit substitui domain event?
18. Por que evitar relacionamento bidirecional?
19. Como migrations evoluem?
20. Migration aplicada pode ser editada?
21. O que Testcontainers valida?
22. O que a aula 682 fará?
23. O que não foi implementado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Traduzir ports para banco.
2. Não.
3. Converter domínio e persistência.
4. Não.
5. Para testar comportamento real.
6. Porque existem diferenças relevantes.
7. No módulo de persistência.
8. Em PKs, FKs e queries.
9. Atualização concorrente.
10. Quando a versão esperada diverge.
11. Commit ou rollback conjunto.
12. Não.
13. Insert atômico com conflito.
14. Detectar reutilização divergente.
15. Estado e evento no mesmo commit.
16. Deduplicação de mensagem.
17. Não.
18. Para evitar grafo e cascade imprevisíveis.
19. Por novas migrations.
20. Não.
21. SQL, locking, constraints e migrations.
22. Implementar API REST.
23. Controllers e HTTP.
24. Implementação API REST.
25. Persistência traduz sem dominar o domínio.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 681 - M20.11 - Implementacao persistencia

- Continuei após Implementação casos de uso.
- Implementei o módulo `orderflow-persistence`.
- Configurei o POM.
- Criei migrations Flyway.
- Criei schema `orderflow`.
- Criei tabela do aggregate.
- Criei tabelas filhas.
- Criei Idempotency Registry.
- Criei Outbox.
- Criei Inbox.
- Criei audit.
- Criei índices.
- Criei OrderProcessKey.
- Criei OrderProcessEntity.
- Criei entities filhas.
- Evitei relacionamento bidirecional desnecessário.
- Criei repositories Spring Data.
- Criei PersistenceMappingException.
- Criei OrderProcessPersistenceMapper.
- Mapeei Money sem `double`.
- Tratei estado desconhecido.
- Reconstituí o aggregate.
- Criei JpaOrderProcessRepositoryAdapter.
- Diferenciei insert e update.
- Persistei children incrementalmente.
- Criei SpringTransactionManager.
- Criei configuração de beans.
- Criei SystemApplicationClock.
- Criei UuidIdentifierGenerator.
- Criei entities de idempotência.
- Implementei acquire atômico.
- Implementei complete e fail.
- Criei OutboxEventEntity.
- Implementei JpaOutboxStore.
- Garanti atomicidade da Outbox.
- Criei InboxMessageEntity.
- Implementei tryReceive.
- Implementei markProcessed.
- Criei OrderAuditEntity.
- Implementei audit append-only.
- Evitei dados sensíveis.
- Configurei PostgreSQL Testcontainer.
- Criei FlywayMigrationTest.
- Testei insert e find.
- Testei isolamento por tenant.
- Testei optimistic locking.
- Testei idempotência.
- Testei Outbox.
- Testei Inbox.
- Testei audit.
- Testei rollback.
- Testei snapshot corrompido.
- Testei migrations.
- Criei teste arquitetural.
- Executei build do módulo.
- Executei build completo.
- Inspecionei SQL.
- Criei report, evidence e gate.
- Não antecipei API REST.
- Próxima aula: Implementacao API REST.
```

---

## Referência técnica curta

- Persistence Adapter.
- Spring Data JPA.
- PostgreSQL.
- Flyway.
- Testcontainers.
- Embedded ID.
- Optimistic Locking.
- TransactionTemplate.
- Aggregate Mapping.
- Idempotency Registry.
- Outbox.
- Inbox.
- Audit.
- Integration Test.
- Migration Test.
- Rollback Test.

Regra final:

```text
A implementação de persistência do OrderFlow deve concretizar os output ports sem contaminar domínio ou aplicação: o módulo orderflow-persistence depende da aplicação, usa PostgreSQL, Spring Data JPA, Flyway e Testcontainers, migrations criam schema, root, children, Idempotency Registry, Outbox, Inbox, audit e índices, tenant e order formam chaves e foreign keys, entities JPA representam armazenamento e nunca são retornadas aos handlers, OrderProcessPersistenceMapper converte value objects, states, collections e applied operations e chama reconstitute sem publicar eventos, snapshot inválido gera PersistenceMappingException, JpaOrderProcessRepositoryAdapter diferencia insert e update, força flush e converte optimistic locking em ConcurrencyConflict, children são persistidos incrementalmente, SpringTransactionManager garante atomicidade entre aggregate, idempotência, Inbox, Outbox e audit, acquire idempotente usa insert com ON CONFLICT DO NOTHING e request hash, Outbox apenas persiste envelopes PENDING, Inbox deduplica por consumer e message ID e detecta fingerprint divergente, audit é append-only e sanitizado, Flyway mantém histórico imutável, e Testcontainers comprova migrations, constraints, tenant isolation, locking, rollback, idempotência, Outbox e Inbox em PostgreSQL real; o gate termina com migrations, entities, repositories, mapper, adapters, stores, tests, report e evidence aprovados, enquanto controllers, DTOs, Bean Validation, HTTP errors, tenant context, idempotency header e OpenAPI permanecem reservados para a aula 682.
```
