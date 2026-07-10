# 344 - M13.34 - Auditoria CreatedAt UpdatedAt usuario

## Apresentacao da aula

Na aula 343, você controlou concorrência com lock pessimista.

Foram praticados:

```text
PESSIMISTIC_READ;

PESSIMISTIC_WRITE;

PESSIMISTIC_FORCE_INCREMENT;

duas transações;

espera;

timeout;

commit;

rollback;

ordem de aquisição;

prevenção de deadlock.
```

Depois de proteger a alteração, surge outra necessidade profissional:

```text
quando o registro foi criado?

quando foi atualizado?

quem criou?

quem atualizou?
```

Nesta aula, você implementará auditoria básica em entidades JPA.

A entidade possuirá:

```text
createdAt;

updatedAt;

createdBy;

updatedBy.
```

No banco:

```text
created_at;

updated_at;

created_by;

updated_by.
```

Na criação:

```text
createdAt = instante atual;

updatedAt = instante atual;

createdBy = ator atual;

updatedBy = ator atual.
```

Na atualização:

```text
createdAt:
preservado.

createdBy:
preservado.

updatedAt:
novo instante.

updatedBy:
ator atual.
```

A implementação utilizará:

```java
@MappedSuperclass
@EntityListeners
@PrePersist
@PreUpdate
```

O listener não consultará banco, não abrirá transação e não chamará serviços externos.

Ele lerá um contexto local à thread contendo:

```text
AuditActor;

Clock.
```

Atores possíveis:

```text
user:thiago;

job:reagendamento;

service:middleware-produto.
```

Não haverá fallback silencioso para `system`.

Se uma escrita não informar autoria, ela falhará.

O `Clock` tornará os testes determinísticos.

Produção:

```java
Clock.systemUTC()
```

Teste:

```java
Clock.fixed(...)
```

O contexto será delimitado por `try-with-resources`:

```java
try (
    AuditScope ignored =
            AuditContext.open(
                    AuditActor.user(
                            "thiago"
                    ),
                    clock
            )
) {
    // Transação JPA.
}
```

Ao fechar, o contexto anterior será restaurado ou removido.

Essa limpeza é obrigatória porque threads de pool são reutilizadas.

A infraestrutura continuará:

```text
Java 21;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O database será:

```text
formacao_java_jpa_344
```

O schema será:

```text
jpa_344
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade principal será:

```text
OrdemServicoEntity.
```

Ela continuará versionada com:

```java
@Version
```

O laboratório comprovará:

```text
persist:
preenche criação e atualização.

update:
preserva criação;
altera atualização;
incrementa versão.

no-op:
não gera UPDATE;
não muda auditoria.

merge:
usa ator da transação atual.

ator técnico:
registrado explicitamente.

contexto ausente:
escrita rejeitada.

rollback:
não confirma dados.

threads:
contextos isolados.

bulk JPQL:
não chama callbacks.

estado final:
zero OS-JPA-344-%.
```

A próxima aula será:

```text
345 - M13.35 - Spring Data Repository conceitos
```

Não serão usados:

- Spring Boot;
- Spring Framework;
- Spring Data JPA;
- `@CreatedDate`;
- `@LastModifiedDate`;
- `AuditorAware`;
- repositories Spring Data;
- autenticação web;
- SecurityContext.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
342:
Lock otimista.

343:
Lock pessimista.

344:
Auditoria CreatedAt UpdatedAt usuario.

345:
Spring Data Repository conceitos.

346:
Queries derivadas.
```

As aulas 342 e 343 responderam:

```text
como proteger alterações concorrentes?
```

Esta aula responderá:

```text
como registrar autoria e instante
das alterações persistidas?
```

Nesta aula:

```text
@MappedSuperclass:
sim.

@EntityListeners:
sim.

@PrePersist:
sim.

@PreUpdate:
sim.

Instant:
sim.

Clock:
sim.

ator humano e técnico:
sim.

ThreadLocal delimitado:
sim.

merge:
sim.

bulk update:
risco demonstrado.

histórico completo:
não.

Spring Data Auditing:
não.
```

A arquitetura será:

```text
caso de uso
    -> AuditScope
        -> transação
            -> entidade
                -> callback
                    -> listener
                        -> AuditContext
                            -> campos auditáveis
                                -> INSERT ou UPDATE.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-344-auditoria-createdat-updatedat-usuario
```

Estrutura final:

```text
labs
└── m13
    └── aula-344-auditoria-createdat-updatedat-usuario
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-campos-auditoria.md
        │   ├── ciclo-callbacks.md
        │   ├── contexto-ator-e-clock.md
        │   ├── usuario-humano-e-tecnico.md
        │   ├── limites-auditoria-basica.md
        │   └── troubleshooting-auditoria.md
        ├── scripts
        │   ├── 01_criar_database.ps1
        │   ├── 02_executar_migration.ps1
        │   ├── 03_executar_laboratorio.ps1
        │   ├── 04_validar_estado_final.ps1
        │   └── 05_limpar_database.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula344
            │   │                       ├── Main.java
            │   │                       ├── audit
            │   │                       │   ├── AuditActor.java
            │   │                       │   ├── AuditContext.java
            │   │                       │   ├── AuditEntityListener.java
            │   │                       │   ├── AuditableEntity.java
            │   │                       │   └── AuditScope.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── AuditLab.java
            │   │                       │   ├── AuditObservation.java
            │   │                       │   └── AuditReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_344.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula344
                                        ├── AuditContextTest.java
                                        ├── AuditMappingIT.java
                                        ├── PrePersistAuditIT.java
                                        ├── PreUpdateAuditIT.java
                                        ├── MergeAuditIT.java
                                        ├── TechnicalActorIT.java
                                        ├── BulkUpdateAuditRiskIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
criação:
2026-07-10T12:00:00Z;
user:thiago.

atualização:
2026-07-10T13:00:00Z;
user:aline.

createdAt e createdBy:
inalterados.

versão:
0 após insert;
1 após update.

flush sem mudança:
zero UPDATE.

merge:
updatedBy usa ator atual.

job:
ator técnico explícito.

sem AuditScope:
falha e rollback.

bulk:
auditoria e versão não atualizadas automaticamente.
```

---

## Conceito essencial

### Auditoria basica

Auditoria básica responde ao estado atual:

```text
quem criou;

quando criou;

quem atualizou por último;

quando atualizou por último.
```

Ela não mantém todas as alterações anteriores.

Histórico completo exige outro modelo, como tabela histórica, eventos, CDC ou trilha imutável.

---

### Auditoria e tempo de negocio

Considere:

```text
agendadaPara:
quando o serviço deve acontecer.

updatedAt:
quando o registro foi modificado.
```

São conceitos diferentes.

Não use `updatedAt` para responder quando o status mudou ou quando a atividade terminou.

---

### Instant e Clock

Os timestamps usarão:

```java
Instant
```

Isso representa um instante absoluto e combina com UTC e `timestamptz`.

O listener obterá o tempo por:

```java
clock.instant()
```

Teste:

```java
Clock fixed =
        Clock.fixed(
                Instant.parse(
                        "2026-07-10T12:00:00Z"
                ),
                ZoneOffset.UTC
        );
```

Assim, as assertions usam valores exatos.

---

### AuditActor

O ator será um value object:

```java
public record AuditActor(
        String value
) {
}
```

Factories:

```java
AuditActor.user("thiago");

AuditActor.job("reagendamento");

AuditActor.service(
        "middleware-produto"
);
```

O prefixo diferencia usuário humano e processo técnico.

Regras:

```text
não nulo;

não vazio;

sem espaços externos;

máximo de 100 caracteres;

tipo conhecido.
```

O ator deve vir de uma origem confiável, não de um campo livre do request.

---

### AuditContext

O contexto armazenará:

```java
record AuditSession(
        AuditActor actor,
        Clock clock
) {
}
```

Acesso:

```java
AuditContext.current()
```

Sem contexto:

```text
IllegalStateException.
```

Toda escrita precisa declarar autoria.

---

### ThreadLocal e AuditScope

O armazenamento será:

```java
ThreadLocal<AuditSession>
```

Cada thread possui seu contexto.

`AuditScope` implementará `AutoCloseable`.

Ao abrir:

1. guarda o contexto anterior;
2. instala o novo.

Ao fechar:

1. restaura o anterior;
2. ou remove o `ThreadLocal`.

O fechamento será idempotente.

Esse desenho permite testes aninhados e evita vazamento em executors.

---

### MappedSuperclass

A classe base será:

```java
@MappedSuperclass
@EntityListeners(
        AuditEntityListener.class
)
public abstract class AuditableEntity {
}
```

Ela:

- não é uma entidade concreta;
- não possui tabela própria;
- fornece mappings às subclasses;
- centraliza getters e regras internas.

Flyway continua criando as colunas nas tabelas.

---

### Campos de criacao

Mappings:

```java
@Column(
        name = "created_at",
        nullable = false,
        updatable = false
)
private Instant createdAt;
```

e:

```java
@Column(
        name = "created_by",
        nullable = false,
        updatable = false,
        length = 100
)
private String createdBy;
```

Não haverá setters públicos.

---

### Campos de atualizacao

Mappings:

```java
@Column(
        name = "updated_at",
        nullable = false
)
private Instant updatedAt;
```

e:

```java
@Column(
        name = "updated_by",
        nullable = false,
        length = 100
)
private String updatedBy;
```

Eles serão alterados apenas pela infraestrutura de auditoria.

---

### PrePersist

O listener:

```java
@PrePersist
public void beforeInsert(
        AuditableEntity entity
) {
    AuditSession session =
            AuditContext.current();

    entity.registerCreationAudit(
            session.actor(),
            session.clock()
                    .instant()
    );
}
```

`registerCreationAudit` preenche os quatro campos com o mesmo ator e instante.

Uma segunda tentativa de registrar criação será rejeitada.

---

### PreUpdate

O listener:

```java
@PreUpdate
public void beforeUpdate(
        AuditableEntity entity
) {
    AuditSession session =
            AuditContext.current();

    entity.registerUpdateAudit(
            session.actor(),
            session.clock()
                    .instant()
    );
}
```

O método preserva campos de criação e atualiza somente:

```text
updatedAt;

updatedBy.
```

---

### Callback sem efeitos externos

O listener não deve:

- consultar JPA;
- chamar repository;
- fazer HTTP;
- enviar mensagem;
- alterar relacionamentos;
- criar transação;
- acessar arquivo.

Ele apenas copia valores escalares.

---

### Dirty checking e no-op

Fluxo de alteração:

1. entidade managed muda;
2. Hibernate detecta dirty state;
3. `@PreUpdate` é executado;
4. auditoria é atualizada;
5. SQL inclui negócio, auditoria e versão.

Se nada mudou:

```java
entityManager.flush();
```

não deve existir update somente para mexer em `updatedAt`.

O laboratório confirmará:

```text
zero UPDATE;

versão preservada;

updatedAt preservado;

updatedBy preservado.
```

---

### Created fields imutaveis

Proteções:

- sem setters;
- `updatable=false`;
- listener de update não toca criação;
- testes de merge;
- constraints de banco.

SQL externo ainda pode violar o contrato, portanto todos os escritores precisam respeitá-lo.

---

### Merge

Em merge:

```text
a instância detached contém estado antigo;

o retorno é managed;

o listener usa o AuditContext atual.
```

O ator não deve ser copiado de um campo enviado pelo usuário.

O teste usará:

```text
user:supervisor.
```

O banco deverá registrar esse ator em `updatedBy`.

---

### Rollback

Callbacks podem preencher a entidade em memória antes de um rollback.

O banco não confirma os valores.

Depois de falha:

- não reutilize a entidade;
- feche o manager;
- abra novo contexto;
- recarregue do banco.

---

### Ator tecnico

Jobs e integrações precisam de autoria explícita:

```text
job:reagendamento;

service:middleware-produto;

job:capacity-cache.
```

Isso é superior a um valor genérico que não identifica a origem.

---

### Contexto ausente

Persistir ou atualizar sem escopo deve falhar.

Proteções:

```text
AuditContext obrigatório;

colunas NOT NULL;

rollback.
```

Nenhum registro fica com autoria incompleta.

---

### Contextos concorrentes

Teste:

```text
Thread A:
user:thiago.

Thread B:
job:reagendamento.
```

Cada tarefa enxerga somente seu ator.

Cada tarefa fecha seu escopo.

Depois do fechamento, `current()` volta a falhar.

---

### Bulk JPQL

Uma operação bulk atua diretamente no banco:

```java
update OrdemServico o
set o.status = :status
where o.codigo = :codigo
```

Ela não passa pelo lifecycle individual.

Logo, não executa automaticamente:

- `@PreUpdate`;
- dirty checking;
- incremento normal de versão;
- sincronização de entidades managed.

Se uma operação bulk for necessária, ela deve tratar explicitamente auditoria, versão e limpeza do contexto.

---

### JDBC e SQL nativo

JDBC e native SQL também não chamam callbacks.

Um escritor externo deve:

```text
preservar created_at;

preservar created_by;

definir updated_at;

definir updated_by;

respeitar a versão.
```

A decisão desta aula é auditoria na aplicação.

Triggers são uma alternativa possível, mas não serão implementadas.

---

### Seguranca e limites

`updatedBy` é dado de rastreabilidade.

Não registre senha, token ou valor arbitrário enviado pelo cliente.

Use um identificador estável.

Auditoria básica também não registra:

- valores anteriores;
- motivo;
- IP;
- correlation ID;
- aprovação;
- evento externo.

Ela não deve ser apresentada como trilha forense completa.

---

### Auditoria e fronteira transacional

O `AuditScope` deve envolver exatamente a operação que possui autoria definida.

Exemplo:

```text
resolver ator confiável;

abrir AuditScope;

abrir EntityManager;

iniciar transação;

executar caso de uso;

flush;

commit;

fechar EntityManager;

fechar AuditScope.
```

O ator não deve ser trocado no meio da mesma alteração sem uma razão explícita.

Se uma operação chama outra operação síncrona dentro da mesma unidade de trabalho, o contexto externo pode ser reutilizado.

Se houver mudança legítima de origem, um escopo interno precisa restaurar o anterior ao terminar.

A auditoria também precisa acompanhar a fronteira do commit.

Registrar `updatedBy` em memória não significa que a alteração foi concluída.

Somente o commit confirma:

```text
dados de negócio;

versão;

timestamps;

ator.
```

Por isso, logs ou mensagens de sucesso devem ser emitidos depois da confirmação transacional.

Em caso de conflito otimista, timeout pessimista, constraint ou qualquer falha de flush:

```text
rollback;

fechamento do manager;

descarte da instância;

novo contexto para nova tentativa.
```

O listener não decide retry e não traduz exceções.

Ele apenas preenche os campos auditáveis dentro do lifecycle atual.

Essa separação mantém responsabilidades claras:

```text
autenticação:
resolve o ator.

caso de uso:
define a transação.

AuditContext:
transporta ator e relógio.

listener:
preenche campos.

Hibernate:
gera SQL.

banco:
garante constraints.

commit:
confirma a auditoria.
```


## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\java\br\com\formacao\m13\aula344\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\java\br\com\formacao\m13\aula344\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\java\br\com\formacao\m13\aula344\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\java\br\com\formacao\m13\aula344\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\java\br\com\formacao\m13\aula344\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-344-auditoria-createdat-updatedat-usuario\src\test\java\br\com\formacao\m13\aula344"

Set-Location `
  "labs\m13\aula-344-auditoria-createdat-updatedat-usuario"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 343.

Ajuste:

```text
artifactId:
aula-344-auditoria-createdat-updatedat-usuario.

persistence unit:
aula344PU.

Main:
br.com.formacao.m13.aula344.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_344
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-344-jpa
JPA_POOL_NAME=aula-344-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_344;

CREATE SEQUENCE jpa_344.ordem_servico_id_seq
    START WITH 344101
    INCREMENT BY 1;

CREATE TABLE jpa_344.ordem_servico (
    id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    descricao varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    versao integer NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    created_by varchar(100) NOT NULL,
    updated_by varchar(100) NOT NULL,

    CONSTRAINT pk_jpa_344_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_344_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_344_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_jpa_344_ordem_versao
        CHECK (versao >= 0),

    CONSTRAINT ck_jpa_344_ordem_audit_time
        CHECK (updated_at >= created_at),

    CONSTRAINT ck_jpa_344_ordem_created_by
        CHECK (length(trim(created_by)) > 0),

    CONSTRAINT ck_jpa_344_ordem_updated_by
        CHECK (length(trim(updated_by)) > 0)
);

CREATE INDEX idx_jpa_344_ordem_status
    ON jpa_344.ordem_servico (
        status
    );

CREATE INDEX idx_jpa_344_ordem_updated_at
    ON jpa_344.ordem_servico (
        updated_at DESC
    );
```

Não adicione defaults para timestamp ou ator.

---

### 4. Criar AuditActor.java

```java
package br.com.formacao.m13.aula344.audit;

import java.util.Objects;

public record AuditActor(
        String value
) {

    public AuditActor {
        Objects.requireNonNull(
                value,
                "ator obrigatório"
        );

        value = value.trim();

        if (
            value.isBlank()
            || value.length() > 100
            || !value.contains(":")
        ) {
            throw new IllegalArgumentException(
                    "ator de auditoria inválido"
            );
        }
    }

    public static AuditActor user(
            String identifier
    ) {
        return of(
                "user",
                identifier
        );
    }

    public static AuditActor job(
            String identifier
    ) {
        return of(
                "job",
                identifier
        );
    }

    public static AuditActor service(
            String identifier
    ) {
        return of(
                "service",
                identifier
        );
    }

    private static AuditActor of(
            String type,
            String identifier
    ) {
        Objects.requireNonNull(identifier);

        String normalized =
                identifier.trim();

        if (normalized.isBlank()) {
            throw new IllegalArgumentException(
                    "identificador obrigatório"
            );
        }

        return new AuditActor(
                type + ":" + normalized
        );
    }
}
```

---

### 5. Criar AuditContext.java

Sessão interna:

```java
record AuditSession(
        AuditActor actor,
        Clock clock
) {
}
```

Armazenamento:

```java
private static final ThreadLocal<AuditSession>
        CURRENT = new ThreadLocal<>();
```

Métodos:

```java
public static AuditScope open(
        AuditActor actor,
        Clock clock
)

public static AuditSession current()

static void restore(
        AuditSession previous
)
```

`current` falha quando não existe sessão.

---

### 6. Criar AuditScope.java

```java
public final class AuditScope
        implements AutoCloseable {

    private final AuditSession previous;
    private boolean closed;

    AuditScope(
            AuditSession previous
    ) {
        this.previous = previous;
    }

    @Override
    public void close() {
        if (closed) {
            return;
        }

        AuditContext.restore(
                previous
        );

        closed = true;
    }
}
```

---

### 7. Criar AuditableEntity.java

```java
@MappedSuperclass
@EntityListeners(
        AuditEntityListener.class
)
public abstract class AuditableEntity {
```

Campos:

```text
createdAt;

updatedAt;

createdBy;

updatedBy.
```

Getters públicos e métodos finais:

```java
registerCreationAudit;

registerUpdateAudit.
```

Não crie setters.

---

### 8. Implementar registro de criacao

```java
public final void registerCreationAudit(
        AuditActor actor,
        Instant now
) {
    Objects.requireNonNull(actor);
    Objects.requireNonNull(now);

    if (
        createdAt != null
        || createdBy != null
    ) {
        throw new IllegalStateException(
                "Auditoria de criação já definida"
        );
    }

    createdAt = now;
    updatedAt = now;
    createdBy = actor.value();
    updatedBy = actor.value();
}
```

---

### 9. Implementar registro de atualizacao

```java
public final void registerUpdateAudit(
        AuditActor actor,
        Instant now
) {
    Objects.requireNonNull(actor);
    Objects.requireNonNull(now);

    if (
        createdAt == null
        || createdBy == null
    ) {
        throw new IllegalStateException(
                "Auditoria de criação ausente"
        );
    }

    if (now.isBefore(createdAt)) {
        throw new IllegalArgumentException(
                "updatedAt anterior a createdAt"
        );
    }

    updatedAt = now;
    updatedBy = actor.value();
}
```

---

### 10. Criar AuditEntityListener.java

```java
public final class AuditEntityListener {

    @PrePersist
    public void beforeInsert(
            AuditableEntity entity
    ) {
        AuditSession session =
                AuditContext.current();

        entity.registerCreationAudit(
                session.actor(),
                session.clock()
                        .instant()
        );
    }

    @PreUpdate
    public void beforeUpdate(
            AuditableEntity entity
    ) {
        AuditSession session =
                AuditContext.current();

        entity.registerUpdateAudit(
                session.actor(),
                session.clock()
                        .instant()
        );
    }
}
```

---

### 11. Criar OrdemServicoEntity.java

A entidade estende:

```java
AuditableEntity
```

Mantém:

```java
@Version
private int versao;
```

Campos de negócio:

```text
id;

codigo;

descricao;

status.
```

Métodos:

```java
alterarDescricao;

alterarStatus.
```

Eles não recebem ator nem timestamp de auditoria.

---

### 12. Criar persistence.xml e runtime

Use:

```text
aula344PU;

RESOURCE_LOCAL;

shared-cache-mode NONE;

hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true.
```

Liste `OrdemServicoEntity`.

Reutilize HikariCP, settings externos e inspector.

---

### 13. Evoluir SqlCaptureInspector

Adicione:

```java
insertCount();

updateCount();

deleteCount();

lastUpdate();

clear();
```

Verifique que o update contém referências a:

```text
updated_at;

updated_by;

versao.
```

Não compare SQL integral nem registre bindings.

---

### 14. Criar AuditObservation.java

```java
public record AuditObservation(
        String scenario,
        Instant createdAt,
        Instant updatedAt,
        String createdBy,
        String updatedBy,
        int version,
        long insertCount,
        long updateCount
) {
}
```

Valide `scenario`.

---

### 15. Criar AuditReport.java

```java
public record AuditReport(
        List<AuditObservation> observations,
        boolean persistAuditWorked,
        boolean updateAuditWorked,
        boolean creationAuditWasImmutable,
        boolean noOpPreservedAudit,
        boolean mergeUsedCurrentActor,
        boolean technicalActorWorked,
        boolean missingContextWasRejected,
        boolean rollbackDidNotPersist,
        boolean threadContextsWereIsolated,
        boolean bulkUpdateRiskWasDemonstrated
) {

    public AuditReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 16. Persistir fixture principal

Clock:

```text
2026-07-10T12:00:00Z.
```

Ator:

```text
user:thiago.
```

Dentro do escopo:

1. abra manager;
2. inicie transação;
3. crie `OS-JPA-344-MAIN`;
4. persista;
5. flush;
6. commit.

Confirme:

```text
createdAt = updatedAt;

createdBy = updatedBy;

versão 0;

um INSERT.
```

---

### 17. Atualizar com outro usuario

Clock:

```text
2026-07-10T13:00:00Z.
```

Ator:

```text
user:aline.
```

Busque a Ordem.

Guarde campos de criação.

Altere descrição.

Flush.

Confirme:

```text
createdAt preservado;

createdBy user:thiago;

updatedAt 13:00Z;

updatedBy user:aline;

versão 1;

um UPDATE.
```

Commit.

---

### 18. Testar no-op

Clock:

```text
2026-07-10T14:00:00Z.
```

Ator:

```text
user:supervisor.
```

Busque a Ordem sem alterar.

Limpe inspector.

Flush e commit.

Confirme:

```text
updatedAt continua 13:00Z;

updatedBy continua user:aline;

versão continua 1;

zero UPDATE.
```

---

### 19. Testar merge

Carregue a Ordem e feche o manager.

Altere a descrição detached.

Abra escopo:

```text
user:supervisor;

2026-07-10T15:00:00Z.
```

Execute:

```java
OrdemServicoEntity managed =
        entityManager.merge(
                detached
        );
```

Use o retorno.

Flush e commit.

Confirme:

```text
createdBy preservado;

updatedBy user:supervisor;

updatedAt 15:00Z;

versão 2.
```

---

### 20. Testar ator tecnico

Crie:

```text
OS-JPA-344-JOB.
```

Escopo:

```text
job:reagendamento;

2026-07-10T16:00:00Z.
```

Persista e confirme os quatro campos.

Não use fallback genérico.

---

### 21. Testar contexto ausente

Crie uma Ordem sem abrir `AuditScope`.

Inicie transação.

Persista e force callback.

Espere `IllegalStateException` direta ou preservada como causa.

Faça rollback.

Confirme zero linha.

---

### 22. Testar rollback

Abra escopo válido.

Persista:

```text
OS-JPA-344-ROLLBACK.
```

Flush.

Execute rollback.

Abra novo manager e confirme que a linha não existe.

Não reutilize a instância.

---

### 23. Testar contexto aninhado

Escopo externo:

```text
user:thiago.
```

Escopo interno:

```text
service:importacao.
```

Confirme:

1. externo ativo;
2. interno substitui;
3. fechamento interno restaura externo;
4. fechamento externo remove tudo.

---

### 24. Testar isolamento de threads

Tarefa A:

```text
user:thiago.
```

Tarefa B:

```text
job:reagendamento.
```

Coordene com latch.

Cada tarefa confirma seu ator.

Feche os escopos e encerre o executor no `finally`.

---

### 25. Demonstrar bulk update

Crie fixture isolada por fluxo normal.

Guarde:

```text
updatedAt;

updatedBy;

versão.
```

Execute:

```java
update OrdemServico o
set o.status = :status
where o.codigo = :codigo
```

Limpe o persistence context.

Confirme:

```text
status mudou;

PreUpdate não executou;

updatedAt não mudou;

updatedBy não mudou;

versão não mudou.
```

Documente a violação.

---

### 26. Criar Main.java

O `Main`:

1. abre runtime;
2. executa cenários;
3. imprime relatório;
4. remove fixtures;
5. fecha escopos;
6. fecha managers;
7. encerra executor;
8. fecha runtime.

Formato:

```text
cenário | createdAt | updatedAt | createdBy | updatedBy | versão | INSERT | UPDATE
```

---

### 27. Criar AuditContextTest.java

Casos:

- ator humano;
- ator técnico;
- ator vazio;
- ator grande;
- contexto ausente;
- escopo simples;
- escopo aninhado;
- close idempotente;
- restauração;
- remoção;
- isolamento entre threads.

---

### 28. Criar AuditMappingIT.java

Valide:

- entidade estende superclass;
- `@MappedSuperclass`;
- listener registrado;
- creation fields com `updatable=false`;
- quatro colunas não nulas;
- nenhuma setter pública;
- exatamente um `@Version`;
- schema coerente.

---

### 29. Criar PrePersistAuditIT.java

Casos:

- usuário humano;
- usuário técnico;
- mesmo instante;
- mesmo ator;
- versão inicial;
- insert único;
- ausência de contexto;
- rollback.

---

### 30. Criar PreUpdateAuditIT.java

Casos:

- mudança de descrição;
- mudança de status;
- criação preservada;
- atualização alterada;
- versão incrementada;
- SQL com auditoria;
- no-op sem update;
- Clock anterior à criação rejeitado.

---

### 31. Criar MergeAuditIT.java

Casos:

- detached alterada;
- merge em novo ator;
- retorno managed;
- criação preservada;
- updatedBy atual;
- versão incrementada;
- argumento continua detached.

---

### 32. Criar TechnicalActorIT.java

Casos:

```text
job;

service;

normalização;

persist;

update;

campos corretos.
```

---

### 33. Criar BulkUpdateAuditRiskIT.java

Casos:

- bulk altera status;
- callback não executa;
- auditoria permanece antiga;
- versão permanece antiga;
- clear antes da verificação;
- documentação marca o risco.

---

### 34. Criar TestDataCleaner.java

```sql
DELETE FROM jpa_344.ordem_servico
WHERE codigo LIKE 'OS-JPA-344-%';
```

O cleaner é infraestrutura de teste, não exemplo de escrita de negócio.

---

### 35. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_344.
```

`02_executar_migration.ps1`:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

`03_executar_laboratorio.ps1`:

```powershell
mvn clean verify
mvn exec:java
```

`04_validar_estado_final.ps1` exige:

```text
zero OS-JPA-344-%;

quatro colunas NOT NULL;

checks de ator;

check temporal;

índices;

schema history com V1.
```

`05_limpar_database.ps1` remove o database.

---

### 36. Executar o laboratorio

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
persist auditado;

update auditado;

criação imutável;

no-op sem update;

merge com ator atual;

job explícito;

contexto ausente rejeitado;

rollback sem linha;

threads isoladas;

bulk risk demonstrado;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 37. Criar documentacao

`contrato-campos-auditoria.md`:

```text
campo;

tipo;

nulabilidade;

imutabilidade;

origem;

momento.
```

`ciclo-callbacks.md`:

```text
persist -> PrePersist -> INSERT;

dirty -> PreUpdate -> UPDATE.
```

`contexto-ator-e-clock.md` deve registrar ThreadLocal, escopo, nesting, limpeza, Clock, UTC e falha sem contexto.

`usuario-humano-e-tecnico.md` deve registrar prefixes e fontes confiáveis.

`limites-auditoria-basica.md` deve diferenciar último estado, histórico, motivo e correlation ID.

`troubleshooting-auditoria.md` deve cobrir contexto ausente, ator vazado, callback, no-op, merge, rollback, bulk, JDBC e Clock.

---

## Entendendo o que foi feito

### A auditoria ficou reutilizavel

Uma mapped superclass forneceu os quatro campos.

### O callback ficou pequeno

O listener apenas copiou ator e instante.

### A autoria ficou explicita

Usuários, jobs e serviços receberam identificadores distintos.

### Os testes ficaram deterministas

`Clock.fixed` eliminou tolerâncias de horário.

### Os limites ficaram visiveis

Bulk JPQL e JDBC não foram confundidos com callbacks JPA.

---

## Erros comuns importantes

### Aceitar updatedBy no request

A autoria deve vir da identidade confiável.

### Esquecer de limpar ThreadLocal

Isso pode atribuir ações ao ator anterior.

### Atualizar createdAt no PreUpdate

Campos de criação são imutáveis.

### Chamar servicos no listener

Callbacks devem permanecer curtos.

### Achar que bulk dispara callbacks

Bulk atua diretamente no banco.

---

## Comandos uteis

### Migration

```powershell
mvn flyway:migrate
mvn flyway:validate
```

### Testes

```powershell
mvn clean verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Consultar auditoria

```sql
SELECT
    codigo,
    status,
    versao,
    created_at,
    created_by,
    updated_at,
    updated_by
FROM jpa_344.ordem_servico
WHERE codigo LIKE 'OS-JPA-344-%'
ORDER BY codigo;
```

---

## Exercicio guiado

### Parte 1 — Segunda entidade

Crie `ClienteEntity` auditável.

### Parte 2 — Ator de migracao

Adicione:

```java
AuditActor.migration(
        "backfill-2026-07"
)
```

### Parte 3 — Relogio avancavel

Crie `MutableClock` apenas em testes.

### Parte 4 — Excecao dentro do escopo

Lance erro no corpo do `try`.

Confirme remoção do contexto.

### Parte 5 — Bulk seguro

Desenhe bulk que atualize:

```text
updatedAt;

updatedBy;

versao.
```

Inclua limpeza do contexto.

### Parte 6 — Timestamp do banco

Compare `Clock` com `DEFAULT CURRENT_TIMESTAMP`.

### Parte 7 — Historico

Desenhe tabela histórica sem implementá-la.

### Parte 8 — ADR

Registre:

```text
Instant UTC;

Clock por escopo;

ator obrigatório;

ThreadLocal fechado;

created fields imutáveis;

callback escalar;

bulk e JDBC com contrato próprio.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 344 existe;
- continuidade com a aula 343 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_344` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- auditoria básica foi definida;
- auditoria foi diferenciada de histórico;
- timestamp de auditoria foi diferenciado de negócio;
- `Instant` foi usado;
- UTC foi adotado;
- `Clock` foi usado;
- `Clock.fixed` foi usado;
- `AuditActor` foi criado;
- ator humano foi criado;
- ator job foi criado;
- ator service foi criado;
- ator vazio foi rejeitado;
- tamanho do ator foi validado;
- ator não veio da entidade;
- ator não veio do request;
- `AuditContext` foi criado;
- `ThreadLocal` foi delimitado;
- contexto ausente foi rejeitado;
- `AuditScope` implementou AutoCloseable;
- close foi idempotente;
- contexto anterior foi restaurado;
- contexto final foi removido;
- nesting foi testado;
- threads ficaram isoladas;
- executor foi encerrado;
- `@MappedSuperclass` foi usado;
- superclass não criou tabela;
- `@EntityListeners` foi usado;
- `@PrePersist` foi usado;
- `@PreUpdate` foi usado;
- listener não executou I/O;
- listener não abriu transação;
- listener não consultou repository;
- `createdAt` foi mapeado;
- `updatedAt` foi mapeado;
- `createdBy` foi mapeado;
- `updatedBy` foi mapeado;
- creation fields usaram `updatable=false`;
- setters públicos não existem;
- insert preencheu quatro campos;
- criação usou mesmo instante;
- criação usou mesmo ator;
- update preservou createdAt;
- update preservou createdBy;
- update alterou updatedAt;
- update alterou updatedBy;
- versão foi incrementada;
- update SQL incluiu auditoria;
- no-op gerou zero update;
- no-op preservou auditoria;
- no-op preservou versão;
- merge usou ator atual;
- retorno managed foi usado;
- argumento detached continuou detached;
- ator técnico foi persistido;
- fallback system não foi usado;
- escrita sem contexto falhou;
- rollback foi executado;
- rollback não confirmou linha;
- instância após rollback não foi reutilizada;
- bulk JPQL não chamou callbacks;
- risco de bulk foi demonstrado;
- contexto foi limpo após bulk;
- JDBC e native SQL foram tratados como externos;
- created fields devem ser preservados externamente;
- updated fields devem ser definidos externamente;
- versão deve ser respeitada externamente;
- triggers foram comparadas sem implementação;
- segurança da autoria foi discutida;
- auditoria não foi apresentada como histórico completo;
- SQL foi observado sem bindings;
- testes do contexto foram criados;
- testes de mapping foram criados;
- testes de persist foram criados;
- testes de update foram criados;
- testes de merge foram criados;
- testes de ator técnico foram criados;
- teste de bulk risk foi criado;
- fixtures foram removidas;
- estado final ficou vazio;
- Spring Data Auditing não foi antecipado;
- repositories Spring Data não foram antecipados;
- Spring não foi usado;
- ponte para a aula 345 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Confirme que não aparece:

```text
config/jpa.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-344-auditoria-createdat-updatedat-usuario
```

Commit recomendado:

```powershell
git commit -m "feat(m13): auditar criacao atualizacao e usuario"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você implementou auditoria básica sem Spring.

Aprendeu:

```text
createdAt:
instante de criação.

updatedAt:
última alteração.

createdBy:
criador.

updatedBy:
último ator.

PrePersist:
preenche quatro campos.

PreUpdate:
atualiza dois campos.

Clock:
tempo determinístico.

AuditScope:
contexto delimitado.

ThreadLocal:
isolamento por thread.
```

O laboratório comprovou:

```text
persist com usuário;

update com outro usuário;

criação imutável;

versão integrada;

no-op sem update;

merge com ator atual;

job técnico;

falha sem contexto;

rollback sem linha;

isolamento entre threads;

bulk fora dos callbacks.
```

A decisão arquitetural foi:

```text
auditoria básica:
na aplicação.

ator:
obrigatório e confiável.

tempo:
UTC por Clock.

listener:
curto e escalar.

created fields:
imutáveis.

bulk e JDBC:
contrato explícito.

histórico completo:
problema separado.
```

A próxima aula será:

```text
345 - M13.35 - Spring Data Repository conceitos
```

Nela, você aprenderá:

- por que Spring Data existe;
- repository como abstração;
- `Repository`;
- `CrudRepository`;
- `ListCrudRepository`;
- `PagingAndSortingRepository`;
- `JpaRepository`;
- entidade e ID genéricos;
- implementação gerada em runtime;
- operações CRUD;
- `save`;
- insert versus merge;
- `findById`;
- `existsById`;
- `deleteById`;
- flush;
- limites da abstração;
- repository de domínio versus framework;
- testes com Spring Data JPA.

A aula 344 encerrou a base JPA e Hibernate sem magia.

A aula 345 iniciará Spring Data entendendo o que ele abstrai e o que continua sendo responsabilidade do desenvolvedor.

---

# Material complementar

## Checkpoint final

- [ ] Criei superclass auditável e listener JPA.
- [ ] Preenchi os quatro campos.
- [ ] Usei ator obrigatório e Clock determinístico.
- [ ] Limpei o contexto em todos os fluxos.
- [ ] Demonstrei os limites de bulk e escritores externos.

---

## Troubleshooting adicional

### createdAt ficou nulo

Confirme listener, contexto e `@PrePersist`.

### updatedAt nao mudou

Confirme alteração real, dirty checking e `@PreUpdate`.

### updatedBy ficou com ator anterior

O `ThreadLocal` não foi removido.

### Teste de horario ficou instavel

Use `Clock.fixed`.

### Bulk update nao auditou

Bulk não executa callbacks.

---

## Perguntas de revisao

1. O que a auditoria básica responde?
2. Ela mantém todo o histórico?
3. Qual tipo representa o instante?
4. Por que usar Clock?
5. O que é AuditActor?
6. Por que o ator é obrigatório?
7. O que faz AuditScope?
8. Por que limpar ThreadLocal?
9. O que faz MappedSuperclass?
10. O que faz EntityListeners?
11. Quando roda PrePersist?
12. Quando roda PreUpdate?
13. CreatedAt muda no update?
14. No-op deve mudar auditoria?
15. Merge usa qual ator?
16. Rollback confirma auditoria?
17. Bulk JPQL chama callback?
18. JDBC chama callback?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Quem e quando criou e atualizou.
2. Não.
3. Instant.
4. Para controle e testes.
5. Identidade da origem.
6. Para evitar autoria falsa.
7. Delimita o contexto.
8. Para evitar vazamento.
9. Reutiliza mappings.
10. Registra callbacks.
11. Antes do insert no lifecycle.
12. Antes do update no lifecycle.
13. Não.
14. Não.
15. O ator atual.
16. Não no banco.
17. Não.
18. Não.
19. Não.
20. Spring Data Repository conceitos.

---

## Desafio opcional

Crie:

```java
AuditPolicyVerifier
```

Entrada:

```text
classe;

campos;

annotations;

setters;

listener;

version.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- exigir quatro campos;
- exigir creation fields não atualizáveis;
- exigir ausência de setters;
- exigir listener;
- alertar ausência de versão;
- não acessar banco;
- possuir testes unitários;
- não considerar histórico completo.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 344 - M13.34 - Auditoria CreatedAt UpdatedAt usuario

- Implementei auditoria básica em JPA.
- Diferenciei auditoria atual de histórico completo.
- Diferenciei timestamp de auditoria de timestamp de negócio.
- Usei `Instant` em UTC.
- Usei `Clock` e `Clock.fixed`.
- Criei `AuditActor`.
- Diferenciei usuário, job e serviço.
- Tornei o ator obrigatório.
- Evitei fallback silencioso.
- Criei `AuditContext`.
- Usei `ThreadLocal` delimitado.
- Criei `AuditScope` com AutoCloseable.
- Restaurei contextos aninhados.
- Removi o contexto ao fechar.
- Testei isolamento entre threads.
- Criei `AuditableEntity` como `@MappedSuperclass`.
- Registrei `@EntityListeners`.
- Usei `@PrePersist`.
- Usei `@PreUpdate`.
- Mapeei `createdAt`, `updatedAt`, `createdBy` e `updatedBy`.
- Tornei campos de criação não atualizáveis.
- Evitei setters públicos.
- Preenchi os quatro campos no persist.
- Preservei criação no update.
- Atualizei ator e instante no update.
- Mantive integração com `@Version`.
- Confirmei zero update em no-op.
- Usei o ator atual durante merge.
- Registrei ator técnico explicitamente.
- Rejeitei escrita sem contexto.
- Confirmei que rollback não grava.
- Demonstrei que bulk JPQL ignora callbacks.
- Documentei contrato para JDBC e native SQL.
- Mantive Flyway no DDL e Hibernate em validate.
- Não usei Spring Data Auditing.
- Próxima aula: Spring Data Repository conceitos.
```

---

## Referencia tecnica curta

```text
CreatedAt:
criação.

UpdatedAt:
última alteração.

CreatedBy:
criador.

UpdatedBy:
último ator.

PrePersist:
preenche quatro campos.

PreUpdate:
atualiza dois campos.

Clock:
tempo controlado.

AuditActor:
origem confiável.

AuditScope:
contexto delimitado.

Bulk:
fora dos callbacks.
```

Regra final:

```text
auditoria JPA profissional exige campos de criacao imutaveis, campos de atualizacao controlados por callbacks, ator confiavel e obrigatorio, tempo em UTC fornecido por Clock e contexto local a thread sempre limpo; bulk JPQL, JDBC e SQL nativo ficam fora desse lifecycle e precisam respeitar explicitamente o mesmo contrato.
```
