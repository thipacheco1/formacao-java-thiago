# 626 - M19.16 - Repository em DDD

## Apresentação da aula

Na aula 625, você aprofundou Aggregate e Aggregate Root.

O modelo passou a proteger:

```text
invariantes;

limite transacional;

referências externas por identidade;

histórico limitado;

revisão monotônica;

eventos pendentes;

rehydration;

consistência forte dentro da root;

consistência eventual fora do Aggregate.
```

O Aggregate principal foi:

```text
Appointment.
```

A root passou a controlar:

- criação;
- confirmação;
- reagendamento;
- cancelamento;
- revisão;
- histórico;
- eventos;
- estado terminal;
- referências à solicitação e à reserva.

Agora surge uma nova pergunta:

```text
como recuperar
e persistir

uma Aggregate Root

sem transformar
o domínio

em um reflexo
do banco de dados?
```

É comum iniciar por `JpaRepository`, `CrudRepository`, `EntityManager`, `JdbcTemplate`, DAO ou SQL e depois adaptar o modelo ao framework.

Esse caminho costuma produzir:

```text
AppointmentJpaEntity;

AppointmentRepository extends JpaRepository;

findByStatusAndDateBetween;

saveAndFlush;

@OneToMany;

@ManyToOne;

FetchType.LAZY;

CascadeType.ALL.
```

Esses elementos pertencem à infraestrutura, não à linguagem do domínio.

Repository em DDD representa uma coleção conceitual de Aggregate Roots, não um CRUD genérico.

Ele oferece operações orientadas ao domínio, como:

```text
encontrar um Appointment por identidade;

salvar uma Aggregate Root;

verificar se uma Service Request
já possui compromisso ativo;

recusar gravação
quando a revisão esperada
está desatualizada.
```

O Repository esconde SQL, ORM, drivers, cache, serialização e versionamento.

A pergunta será:

```text
como desenhar
um Repository

que preserve
a linguagem,
a Aggregate Root,
as invariantes
e a concorrência

sem acoplar
o domínio
à persistência?
```

O laboratório será:

```text
labs/m19/aula-626-repository-em-ddd/service-appointment-repository
```

Você irá implementar três adaptações:

```text
InMemoryAppointmentRepository;

JdbcAppointmentRepository;

JpaAppointmentRepositoryAdapter.
```

O domínio dependerá apenas de:

```text
AppointmentRepository.
```

A implementação usará memória, JDBC e adapter JPA.

Você irá praticar contrato por Aggregate Root, Repository versus DAO, rehydration, mapping, optimistic concurrency, stale write, consultas, read models, testes de contrato e trade-offs de ORM.

A próxima aula oficial será `627 - M19.17 - Domain Service`.

Por isso, esta aula não irá aprofundar:

- regras de domínio sem owner natural;
- serviços de cálculo;
- policies entre múltiplos Aggregates;
- Domain Service stateless;
- distinção completa entre Domain Service e Application Service.

A aula 628 será `Application Service Use Case`.

O caso de uso aparecerá somente para demonstrar carregamento e persistência.

A regra central será:

```text
Repository fala
a linguagem do domínio

e persiste
Aggregate Roots;

detalhes de banco
ficam na infraestrutura.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
624:
Entity Value Object revisitados.

625:
Aggregate Aggregate Root.

626:
Repository em DDD.

627:
Domain Service.

628:
Application Service Use Case.
```

A progressão é:

```text
refinar identidade e valor;

definir consistência;

persistir Aggregates;

modelar regras sem owner natural;

orquestrar casos de uso.
```

Nesta aula:

```text
Repository em DDD:
sim.

Repository por Aggregate Root:
sim.

DAO:
sim,
para comparação.

reidratação:
sim.

mapping:
sim.

optimistic concurrency:
sim.

JDBC:
sim,
de forma guiada.

JPA:
sim,
como adapter.

Spring Data:
sim,
apenas na infraestrutura.

Domain Service:
não.

Application Service dedicado:
não.

mensageria:
não.
```

O domínio permanece livre de Spring, JPA e SQL.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-626-repository-em-ddd/service-appointment-repository
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/appointmentrepository
│   │           ├── domain
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── ServiceRequestId.java
│   │           │   ├── CapacityReservationId.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── AppointmentStatus.java
│   │           │   ├── AppointmentRevision.java
│   │           │   ├── AppointmentSnapshot.java
│   │           │   └── AppointmentRepository.java
│   │           ├── application
│   │           │   ├── ConfirmAppointmentHandler.java
│   │           │   ├── RescheduleAppointmentHandler.java
│   │           │   └── AppointmentQueryService.java
│   │           ├── infrastructure
│   │           │   ├── memory
│   │           │   │   └── InMemoryAppointmentRepository.java
│   │           │   ├── jdbc
│   │           │   │   ├── JdbcAppointmentRepository.java
│   │           │   │   ├── AppointmentRow.java
│   │           │   │   ├── AppointmentRowMapper.java
│   │           │   │   ├── AppointmentJdbcMapper.java
│   │           │   │   └── AppointmentSql.java
│   │           │   ├── jpa
│   │           │   │   ├── AppointmentJpaEntity.java
│   │           │   │   ├── SpringDataAppointmentJpaRepository.java
│   │           │   │   ├── JpaAppointmentRepositoryAdapter.java
│   │           │   │   └── AppointmentJpaMapper.java
│   │           │   └── exception
│   │           │       ├── AppointmentPersistenceException.java
│   │           │       ├── AppointmentConcurrencyException.java
│   │           │       └── AppointmentDataQualityException.java
│   └── test
│       └── java
│           └── br/com/formacao/appointmentrepository
│               ├── contract
│               │   └── AppointmentRepositoryContractTest.java
│               ├── memory
│               │   └── InMemoryAppointmentRepositoryTest.java
│               ├── jdbc
│               │   ├── JdbcAppointmentRepositoryTest.java
│               │   ├── AppointmentJdbcMapperTest.java
│               │   └── JdbcOptimisticConcurrencyTest.java
│               ├── jpa
│               │   └── JpaAppointmentRepositoryAdapterTest.java
│               ├── application
│               │   └── ConfirmAppointmentHandlerTest.java
│               └── architecture
│                   ├── RepositoryBoundaryTest.java
│                   ├── DomainPersistenceIndependenceTest.java
│                   └── AggregateRootRepositoryTest.java
├── repository
│   ├── REPOSITORY_CHARTER.md
│   ├── CONTRACT_DECISIONS.md
│   ├── REPOSITORY_VS_DAO.md
│   ├── QUERY_DECISIONS.md
│   ├── REHYDRATION_FLOW.md
│   ├── OPTIMISTIC_CONCURRENCY.md
│   ├── TRANSACTION_POLICY.md
│   ├── ERROR_TRANSLATION.md
│   ├── ORM_TRADE_OFFS.md
│   ├── CACHE_POLICY.md
│   ├── TEST_STRATEGY.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_REPOSITORY_QUESTIONS.md
├── contracts
│   ├── repository-ddd-contract.yaml
│   ├── repository-interface-policy.yaml
│   ├── aggregate-root-policy.yaml
│   ├── repository-query-policy.yaml
│   ├── rehydration-policy.yaml
│   ├── optimistic-concurrency-policy.yaml
│   ├── transaction-policy.yaml
│   ├── persistence-mapping-policy.yaml
│   ├── persistence-error-policy.yaml
│   ├── cache-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
└── reports
    ├── repository-contract-report.yaml
    ├── aggregate-root-report.yaml
    ├── rehydration-report.yaml
    ├── concurrency-report.yaml
    ├── transaction-report.yaml
    ├── mapping-report.yaml
    ├── architecture-report.yaml
    └── repository-ddd-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-appointment-repository
├── validate-repository-ddd-contract.ps1
├── validate-repository-interface.ps1
├── validate-aggregate-root-repositories.ps1
├── validate-repository-queries.ps1
├── validate-rehydration-flow.ps1
├── validate-optimistic-concurrency.ps1
├── validate-persistence-mappings.ps1
├── validate-persistence-errors.ps1
├── validate-cache-policy.ps1
├── run-repository-contract-tests.ps1
├── collect-repository-evidence.ps1
└── verify-repository-ddd-gate.ps1
```

Ao final, haverá um Repository testável.

---

## Conceito essencial

### Repository

Abstração que representa acesso a uma coleção conceitual de Aggregate Roots.

---

### Repository Contract

Interface orientada ao domínio, independente da tecnologia.

---

### DAO

Abstração geralmente orientada a tabelas, documentos, registros ou operações técnicas.

---

### Aggregate Root Repository

Repository responsável por recuperar e persistir uma root completa.

---

### Rehydration

Reconstrução do Aggregate a partir do estado persistido.

---

### Persistence Mapper

Componente que traduz entre o modelo persistido e o modelo de domínio.

---

### Optimistic Concurrency

Controle que rejeita gravações baseadas em uma revisão desatualizada.

---

### Expected Revision

Versão que o consumidor acredita ser a atual no momento da gravação.

---

### Stale Write

Tentativa de salvar uma alteração baseada em estado antigo.

---

### Unit of Work

Coordenação das mudanças persistidas em uma transação.

---

### Identity Map

Mecanismo que evita múltiplas instâncias da mesma Entity dentro da mesma unidade de trabalho.

---

### Read Model

Representação otimizada para consulta, separada do Aggregate usado para comportamento.

---

### Repository Contract Test

Conjunto de testes executado contra qualquer implementação do Repository.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-626-repository-em-ddd/service-appointment-repository

Set-Location `
  labs/m19/aula-626-repository-em-ddd/service-appointment-repository
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/repository-ddd-contract.yaml
```

Conteúdo:

```yaml
repository:
  aggregate:
    Appointment

  root:
    Appointment

  required:
    - domain-oriented-interface
    - aggregate-root-only
    - identity-lookup
    - save-with-expected-revision
    - rehydration
    - mapping
    - error-translation
    - contract-tests
    - architecture-tests

  forbidden:
    - framework-type-in-domain-interface
    - repository-per-value-object
    - repository-per-child
    - persistence-record-return
    - generic-CRUD-language
    - blind-overwrite
    - direct-SQL-in-domain
    - domain-service-deep-dive
    - application-service-deep-dive

  nextLesson:
    code:
      M19.17
```

---

### 3. Criar Repository Charter

Arquivo:

```text
repository/REPOSITORY_CHARTER.md
```

Conteúdo:

```markdown
# Appointment Repository Charter

## Aggregate

Appointment.

## Root

Appointment.

## Responsabilidades

- localizar por identidade;
- salvar a root completa;
- preservar revisão;
- detectar stale write;
- reconstruir estado válido;
- traduzir erros de persistência.

## Fora de escopo

- regra de confirmação;
- regra de reagendamento;
- envio de evento;
- consulta analítica;
- relatório operacional;
- acesso a child isolado;
- controle de Capacity.

## Implementações

- InMemory;
- JDBC;
- JPA Adapter.
```

---

### 4. Criar interface de domínio

```java
public interface AppointmentRepository {

    Optional<Appointment> findById(
            AppointmentId appointmentId);

    Appointment save(
            Appointment appointment,
            AppointmentRevision expectedRevision);

    boolean existsActiveFor(
            ServiceRequestId serviceRequestId);
}
```

A interface usa root, IDs tipados e revisão, sem tipos técnicos.

---

### 5. Criar policy da interface

Arquivo:

```text
contracts/repository-interface-policy.yaml
```

Conteúdo:

```yaml
repositoryInterface:
  package:
    domain

  uses:
    - aggregate-root
    - domain-identity
    - domain-value-object
    - domain-oriented-operation

  forbiddenTypes:
    - framework
    - SQL
    - persistence-record
    - HTTP
    - serialization

  genericCRUDMethod:
    forbidden:
      - findAll
      - deleteAll
      - saveAll
      - flush

  technologyName:
    forbidden
```

---

### 6. Repository por Aggregate Root

Crie Repository para:

```text
Appointment.
```

Não crie Repository para:

```text
AppointmentWindow;

AppointmentChange;

RescheduleReason;

CapacityReservationId.
```

Esses elementos vivem dentro da root ou são Value Objects.

Se precisam ser carregados de forma independente, talvez o boundary esteja incorreto.

---

### 7. Criar policy de root

Arquivo:

```text
contracts/aggregate-root-policy.yaml
```

Conteúdo:

```yaml
repository:
  allowedRoot:
    Appointment

  forbidden:
    - value-object-repository
    - child-entity-repository
    - aggregate-fragment-save
    - child-delete
    - child-load-outside-root

  save:
    wholeAggregate:
      required
```

---

### 8. Repository versus DAO

Arquivo:

```text
repository/REPOSITORY_VS_DAO.md
```

Repository:

```text
findById(AppointmentId);

save(Appointment, expectedRevision);

existsActiveFor(ServiceRequestId).
```

DAO:

```text
insertAppointmentRow;

updateAppointmentStatusColumn;

selectAppointmentHistoryRows;

deleteAppointmentByPrimaryKey.
```

O DAO pode existir na infraestrutura.

Ele não é a linguagem exposta ao domínio.

---

### 9. Evitar Repository genérico

Exemplo inadequado:

```java
public interface Repository<T, ID> {

    T save(T entity);

    Optional<T> findById(ID id);

    List<T> findAll();

    void delete(T entity);
}
```

Essa abstração perde revisão esperada, linguagem, semântica de remoção e distinção entre contextos.

Uma base técnica pode existir na infraestrutura.

O contrato do domínio permanece específico.

---

### 10. Definir remoção

Appointment cancelado continua existindo.

Portanto, não existe:

```text
delete(Appointment).
```

A remoção física não representa o domínio. O comportamento é cancelar a root e salvá-la; retenção e purga são políticas técnicas.

---

### 11. Criar query policy

Arquivo:

```text
contracts/repository-query-policy.yaml
```

Conteúdo:

```yaml
repositoryQuery:
  allowed:
    - identity-lookup
    - invariant-support
    - aggregate-existence-check

  analyticalQuery:
    useReadModel:
      required

  UIProjection:
    useQueryService:
      required

  largeList:
    forbiddenInDomainRepository

  frameworkPagination:
    forbiddenInDomainInterface
```

---

### 12. Separar consulta operacional

A tela pode precisar listar:

- status;
- data;
- área;
- revisão;
- última alteração.

Não carregue centenas de Aggregates para montar uma tabela.

Crie:

```java
public interface AppointmentQueryService {

    AppointmentPage search(
            AppointmentSearchCriteria criteria);
}
```

Esse componente de leitura pode usar SQL otimizado e projections sem reconstruir a root.

---

### 13. Criar implementação em memória

```java
public final class InMemoryAppointmentRepository
        implements AppointmentRepository {

    private final Map<AppointmentId, AppointmentSnapshot>
            storage =
            new ConcurrentHashMap<>();

    @Override
    public Optional<Appointment> findById(
            AppointmentId appointmentId) {

        AppointmentSnapshot snapshot =
                storage.get(appointmentId);

        return Optional.ofNullable(snapshot)
                .map(Appointment::rehydrate);
    }

    @Override
    public Appointment save(
            Appointment appointment,
            AppointmentRevision expectedRevision) {

        storage.compute(
                appointment.id(),
                (id, current) ->
                        saveSnapshot(
                                current,
                                appointment,
                                expectedRevision));

        return appointment;
    }
}
```

Armazene snapshots, não a mesma instância mutável.

---

### 14. Implementar concorrência em memória

```java
private AppointmentSnapshot saveSnapshot(
        AppointmentSnapshot current,
        Appointment appointment,
        AppointmentRevision expectedRevision) {

    if (current == null) {

        if (expectedRevision.value() != -1) {
            throw new AppointmentConcurrencyException(
                    "Appointment does not exist");
        }

        return appointment.snapshot();
    }

    if (!current.revision()
            .equals(expectedRevision)) {
        throw new AppointmentConcurrencyException(
                "Stale appointment revision");
    }

    return appointment.snapshot();
}
```

Para criação, use revisão esperada especial:

```text
-1
```

Ou crie um tipo mais explícito:

```text
ExpectedRevision.newAggregate();
```

---

### 15. Criar ExpectedRevision

```java
public sealed interface ExpectedRevision {

    record NewAggregate()
            implements ExpectedRevision {
    }

    record Existing(
            AppointmentRevision value)
            implements ExpectedRevision {
    }

    static ExpectedRevision newAggregate() {
        return new NewAggregate();
    }

    static ExpectedRevision existing(
            AppointmentRevision revision) {
        return new Existing(revision);
    }
}
```

Esse modelo evita número mágico e explicita a intenção.

---

### 16. Atualizar contrato

```java
Appointment save(
        Appointment appointment,
        ExpectedRevision expectedRevision);
```

A intenção diferencia criação de atualização conhecida.

---

### 17. Criar optimistic concurrency policy

Arquivo:

```text
contracts/optimistic-concurrency-policy.yaml
```

Conteúdo:

```yaml
optimisticConcurrency:
  expectedRevision:
    required

  create:
    expected:
      new-aggregate

  update:
    expected:
      existing-revision

  staleWrite:
    action:
      REJECT

  blindSave:
    forbidden

  retry:
    reload-and-reevaluate:
      required

  databaseVersionColumn:
    infrastructureDetail:
      true
```

---

### 18. Entender stale write

Fluxo:

```text
A lê revisão 4;

B lê revisão 4;

A confirma e salva revisão 5;

B cancela usando expected revision 4;

Repository rejeita B.
```

B precisa recarregar, reavaliar a intenção e só então tentar novamente.

---

### 19. Criar snapshot de persistência

A infraestrutura converte a root para uma forma persistível.

```java
public record AppointmentRow(
        UUID appointmentId,
        UUID serviceRequestId,
        UUID capacityReservationId,
        Instant startsAt,
        Instant endsAt,
        String status,
        long revision,
        Instant createdAt) {
}
```

Esse record pertence apenas à infraestrutura.

---

### 20. Criar JDBC mapper

```java
public final class AppointmentJdbcMapper {

    public AppointmentRow toRow(
            Appointment appointment) {

        AppointmentSnapshot snapshot =
                appointment.snapshot();

        return new AppointmentRow(
                snapshot.id().value(),
                snapshot.serviceRequestId().value(),
                snapshot.reservationId().value(),
                snapshot.window().startsAt(),
                snapshot.window().endsAt(),
                snapshot.status().name(),
                snapshot.revision().value(),
                snapshot.createdAt());
    }

    public Appointment toDomain(
            AppointmentRow row,
            List<AppointmentChangeRow> history) {

        AppointmentSnapshot snapshot =
                AppointmentSnapshotFactory.from(
                        row,
                        history);

        return Appointment.rehydrate(
                snapshot);
    }
}
```

---

### 21. Criar mapping policy

Arquivo:

```text
contracts/persistence-mapping-policy.yaml
```

Conteúdo:

```yaml
persistenceMapping:
  domainToRecord:
    explicit:
      required

  recordToDomain:
    validates:
      required

  domainAnnotation:
    forbidden

  databaseNull:
    invalidDomainState:
      forbidden

  enum:
    explicitMapping:
      required

  unknownStoredValue:
    action:
      DATA_QUALITY_FAILURE
```

---

### 22. Criar SQL de tabela principal

```sql
create table appointment (
    appointment_id uuid primary key,
    service_request_id uuid not null,
    capacity_reservation_id uuid not null,
    starts_at timestamp with time zone not null,
    ends_at timestamp with time zone not null,
    status varchar(30) not null,
    revision bigint not null,
    created_at timestamp with time zone not null,
    constraint ck_appointment_window
        check (ends_at > starts_at)
);
```

O banco reforça estrutura.

---

### 23. Criar tabela de histórico

```sql
create table appointment_change (
    appointment_id uuid not null,
    revision bigint not null,
    change_type varchar(30) not null,
    previous_starts_at timestamp with time zone,
    previous_ends_at timestamp with time zone,
    current_starts_at timestamp with time zone not null,
    current_ends_at timestamp with time zone not null,
    reason varchar(200),
    occurred_at timestamp with time zone not null,
    primary key (appointment_id, revision)
);
```

O Repository carrega a root completa.

---

### 24. Criar JDBC findById

```java
public final class JdbcAppointmentRepository
        implements AppointmentRepository {

@Override
public Optional<Appointment> findById(
        AppointmentId appointmentId) {

    Optional<AppointmentRow> row =
            appointmentDao.findById(
                    appointmentId.value());

    if (row.isEmpty()) {
        return Optional.empty();
    }

    List<AppointmentChangeRow> history =
            historyDao.findByAppointmentId(
                    appointmentId.value());

    return Optional.of(
            mapper.toDomain(
                    row.get(),
                    history));
}
```

O DAO conhece SQL; o Repository conhece o Aggregate.

---

### 25. Criar update otimista

```sql
update appointment
set
    capacity_reservation_id = ?,
    starts_at = ?,
    ends_at = ?,
    status = ?,
    revision = ? 
where appointment_id = ?
  and revision = ?;
```

A cláusula usa ID e revisão esperada. Zero linhas alteradas indica registro ausente ou stale write.

---

### 26. Criar save JDBC

```java
@Override
public Appointment save(
        Appointment appointment,
        ExpectedRevision expectedRevision) {

    try {
        return switch (expectedRevision) {

            case ExpectedRevision.NewAggregate ignored ->
                    insert(appointment);

            case ExpectedRevision.Existing existing ->
                    update(
                            appointment,
                            existing.value());
        };

    } catch (DataAccessException exception) {
        throw errorTranslator.translate(
                exception);
    }
}
```

A transação inclui root e histórico; eventos ficam fora.

---

### 27. Criar transaction policy

Arquivo:

```text
contracts/transaction-policy.yaml
```

Conteúdo:

```yaml
transaction:
  saveAggregate:
    atomic:
      required

  includes:
    - root-state
    - new-history-records

  eventPublication:
    repositoryResponsibility:
      false

  externalCall:
    forbidden

  crossContextTable:
    forbidden

  rollbackOnFailure:
    required
```

---

### 28. Repository não publica eventos

Evite:

```java
repository.save(appointment);
eventBus.publish(appointment.pullEvents());
```

dentro da implementação do Repository.

Isso mistura persistência e integração, dificulta testes e pode publicar antes do commit.

A camada de aplicação coordena save e publicação after commit.


---

### 29. Criar erro de concorrência

```java
public final class AppointmentConcurrencyException
        extends RuntimeException {

    private final AppointmentId appointmentId;
    private final AppointmentRevision expectedRevision;

    public AppointmentConcurrencyException(
            AppointmentId appointmentId,
            AppointmentRevision expectedRevision) {

        super(
                "Appointment was changed by another operation");

        this.appointmentId =
                appointmentId;

        this.expectedRevision =
                expectedRevision;
    }
}
```

Não exponha SQL ou nome de coluna.

---

### 30. Criar error policy

Arquivo:

```text
contracts/persistence-error-policy.yaml
```

Conteúdo:

```yaml
persistenceError:
  technicalException:
    domainExposure:
      forbidden

  translatedErrors:
    - not-found
    - concurrency-conflict
    - data-quality-failure
    - persistence-unavailable

  SQL:
    publicMessage:
      forbidden

  sensitiveData:
    log:
      forbidden

  retryable:
    explicit:
      required
```

---

### 31. Traduzir erro de integridade

Se o banco rejeitar:

```text
ends_at <= starts_at
```

isso pode indicar:

- bug no mapper;
- dado legado inválido;
- bypass de domínio;
- migração incorreta.

Converta para:

```text
AppointmentDataQualityException.
```

Não trate como regra de negócio comum.

---

### 32. Criar JPA Entity externa

```java
@Entity
@Table(name = "appointment")
class AppointmentJpaEntity {

    @Id
    UUID appointmentId;

    UUID serviceRequestId;

    UUID capacityReservationId;

    Instant startsAt;

    Instant endsAt;

    String status;

    @Version
    long revision;

    Instant createdAt;
}
```

Essa classe pertence a:

```text
infrastructure.jpa.
```

Ela não é `Appointment`.

---

### 33. Criar Spring Data interface

```java
interface SpringDataAppointmentJpaRepository
        extends JpaRepository<
                AppointmentJpaEntity,
                UUID> {

    boolean existsByServiceRequestIdAndStatusIn(
            UUID serviceRequestId,
            Collection<String> statuses);
}
```

Somente o adapter utiliza essa interface técnica.

---

### 34. Criar JPA adapter

```java
public final class JpaAppointmentRepositoryAdapter
        implements AppointmentRepository {

    private final SpringDataAppointmentJpaRepository
            springData;

    private final AppointmentJpaMapper
            mapper;

    @Override
    public Optional<Appointment> findById(
            AppointmentId appointmentId) {

        return springData
                .findById(
                        appointmentId.value())
                .map(mapper::toDomain);
    }
}
```

O domínio continua sem Spring Data.

---

### 35. Tratar `@Version`

`@Version` oferece optimistic locking.

A exceção técnica pode ser:

```text
ObjectOptimisticLockingFailureException.
```

O adapter converte para:

```text
AppointmentConcurrencyException.
```

A camada superior não conhece a exceção técnica.

---

### 36. Criar ORM trade-offs

Arquivo:

```text
repository/ORM_TRADE_OFFS.md
```

ORM reduz SQL repetitivo e oferece dirty checking, versionamento e transações, mas introduz proxies, lazy loading, N+1, cascades e lifecycle técnico.


---

### 37. Evitar carregar grafo gigante

Não mapeie:

```java
@OneToMany(
    fetch = FetchType.EAGER,
    cascade = CascadeType.ALL)
```

para toda relação apenas porque está dentro do Aggregate.

O histórico limitado pode ser carregado explicitamente.

A persistência pode usar query separada, tabela própria, snapshot ou batch.

---

### 38. Evitar N+1

O Repository deve carregar a root de forma previsível.

Use query específica, join controlado, batch ou consulta de histórico única.

Não exponha lazy loading ao domínio.

---

### 39. Criar policy de rehydration

Arquivo:

```text
contracts/rehydration-policy.yaml
```

Conteúdo:

```yaml
rehydration:
  performedBy:
    persistence-adapter

  reconstructs:
    wholeAggregate:
      required

  createsEvents:
    forbidden

  validatesInvariants:
    required

  unknownStatus:
    action:
      DATA_QUALITY_FAILURE

  incompleteHistory:
    allowedOnlyWhenPolicyDefinesSnapshot:
      true
```

---

### 40. Criar fluxo de reidratação

Arquivo:

```text
repository/REHYDRATION_FLOW.md
```

Fluxo: registros, mapper, Value Objects, snapshot, `Appointment.rehydrate`, validação e root completa.

Se qualquer etapa falhar, o Repository não retorna um Aggregate parcial.

---

### 41. `findById` versus `getById`

`findById` retorna:

```java
Optional<Appointment>
```

`getById` poderia lançar:

```text
AppointmentNotFound.
```

Escolha uma convenção.

Neste laboratório:

```text
Repository:
findById.

Application:
orElseThrow.
```

A ausência é resultado da busca.

---

### 42. `existsActiveFor`

```java
boolean existsActiveFor(
        ServiceRequestId serviceRequestId);
```

Essa consulta apoia uma invariante de processo:

```text
uma solicitação
não pode possuir
dois compromissos ativos.
```

Se a regra precisa de atomicidade, a checagem isolada pode sofrer race condition.

Use também:

- unique constraint adequada;
- lock;
- serialização;
- índice parcial;
- modelagem alternativa.

`exists` sozinho não resolve concorrência.

---

### 43. Criar índice parcial conceitual

PostgreSQL:

```sql
create unique index uq_active_appointment_request
on appointment(service_request_id)
where status in ('SCHEDULED', 'CONFIRMED');
```

O banco reforça a exclusividade.

---

### 44. Criar query decisions

Arquivo:

```text
repository/QUERY_DECISIONS.md
```

Classifique consultas:

```text
Aggregate command:
Repository.

Invariant support:
Repository.

Tela operacional:
Query Service.

Relatório:
Read Model.

Analytics:
Data platform.

Integração externa:
Published API.
```

Evite transformar Repository em mecanismo universal de consulta.

---

### 45. Criar cache policy

Arquivo:

```text
contracts/cache-policy.yaml
```

Conteúdo:

```yaml
repositoryCache:
  default:
    disabled

  aggregateCache:
    requires:
      - revision-aware
      - invalidation-policy
      - consistency-analysis
      - stale-data-behavior

  writeThrough:
    optional

  cacheAsSourceOfTruth:
    forbidden

  domainInterface:
    cacheDetail:
      hidden
```

---

### 46. Riscos de cache de Aggregate

Cache pode retornar revisão antiga.

Se o save usa expected revision, a gravação será rejeitada.

Isso protege o dado, mas aumenta conflitos.

Antes de cachear, avalie invalidação, consistência e custo.

---

### 47. Unit of Work

Em JPA, a sessão pode atuar como Unit of Work. No domínio, o fluxo permanece carregar, executar comportamento, salvar e confirmar.

---

### 48. Identity Map

Identity Map evita múltiplas instâncias da mesma root na unidade de trabalho. Em JDBC manual, evite carregamentos duplicados na mesma operação.

---

### 49. Criar contract test abstrato

```java
abstract class AppointmentRepositoryContractTest {

    protected abstract AppointmentRepository repository();

    @Test
    void shouldSaveAndReloadAggregate() {

        Appointment appointment =
                Fixtures.newAppointment();

        repository().save(
                appointment,
                ExpectedRevision.newAggregate());

        Appointment reloaded =
                repository()
                        .findById(
                                appointment.id())
                        .orElseThrow();

        assertEquals(
                appointment.snapshot(),
                reloaded.snapshot());
    }
}
```

Cada implementação herda o contrato.

---

### 50. Testar criação duplicada

```java
@Test
void shouldRejectDuplicateIdentity() {

    Appointment appointment =
            Fixtures.newAppointment();

    repository.save(
            appointment,
            ExpectedRevision.newAggregate());

    assertThrows(
            AppointmentConcurrencyException.class,
            () ->
                    repository.save(
                            appointment,
                            ExpectedRevision.newAggregate()));
}
```

---

### 51. Testar stale update

```java
@Test
void shouldRejectStaleRevision() {

    Appointment original =
            Fixtures.newAppointment();

    repository.save(
            original,
            ExpectedRevision.newAggregate());

    Appointment first =
            repository.findById(
                    original.id()).orElseThrow();

    Appointment second =
            repository.findById(
                    original.id()).orElseThrow();

    AppointmentRevision revision =
            first.revision();

    first.confirm(
            Fixtures.now());

    repository.save(
            first,
            ExpectedRevision.existing(
                    revision));

    second.cancel(
            Fixtures.cancellationReason(),
            Fixtures.later());

    assertThrows(
            AppointmentConcurrencyException.class,
            () ->
                    repository.save(
                            second,
                            ExpectedRevision.existing(
                                    revision)));
}
```

---

### 52. Testar independência de instância

```java
@Test
void repositoryMustReturnRehydratedInstance() {

    Appointment original =
            Fixtures.newAppointment();

    repository.save(
            original,
            ExpectedRevision.newAggregate());

    Appointment loaded =
            repository.findById(
                    original.id()).orElseThrow();

    assertNotSame(
            original,
            loaded);
}
```


---

### 53. Testar eventos na reidratação

Depois de `findById`:

```java
assertTrue(
    loaded.pullEvents().isEmpty());
```


---

### 54. Testar mapping inválido

Crie registro com:

```text
endsAt < startsAt.
```

O mapper deve lançar:

```text
AppointmentDataQualityException.
```

Não deve retornar `Optional.empty`.

O registro existe, mas está corrompido.

---

### 55. Testar tradução de erro técnico

Simule:

- timeout do banco;
- violação de unique constraint;
- optimistic lock;
- status desconhecido;
- conexão indisponível.

Confirme que o domínio e a aplicação recebem erros estáveis.

---

### 56. Criar architecture test

```java
@ArchTest
static final ArchRule domainMustNotDependOnPersistence =
        noClasses()
                .that()
                .resideInAPackage(
                        "..domain..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "org.springframework..",
                        "jakarta.persistence..",
                        "java.sql..",
                        "..infrastructure..");
```

---

### 57. Repository apenas para root

```java
@ArchTest
static final ArchRule repositoriesMustTargetAggregateRoots =
        classes()
                .that()
                .haveSimpleNameEndingWith(
                        "Repository")
                .and()
                .resideInAPackage(
                        "..domain..")
                .should()
                .beInterfaces();
```

Adicione validação de naming e tipos permitidos.

---

### 58. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  partialAggregateReturned:
    action:
      FAIL

  unknownStoredStatus:
    action:
      DATA_QUALITY_FAILURE

  invalidWindowStored:
    action:
      DATA_QUALITY_FAILURE

  staleWriteAccepted:
    action:
      FAIL

  technicalExceptionLeaked:
    action:
      FAIL

  mutableInstanceStoredInMemory:
    action:
      FAIL

  repositoryForNonRoot:
    action:
      FAIL
```

---

### 59. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  aggregateNotFound:
    repositoryResult:
      empty

  duplicateIdentity:
    action:
      CONCURRENCY_CONFLICT

  staleRevision:
    action:
      CONCURRENCY_CONFLICT

  invalidPersistedState:
    action:
      DATA_QUALITY_FAILURE

  persistenceUnavailable:
    action:
      RETRYABLE_FAILURE

  DomainServiceDeepDive:
    deferredToLesson627

  ApplicationServiceDeepDive:
    deferredToLesson628
```

---

### 60. Validar interface

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-repository-interface.ps1
```

Confirme:

- linguagem do domínio;
- root;
- IDs;
- expected revision;
- ausência de framework;
- ausência de CRUD genérico.

---

### 61. Validar roots

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-aggregate-root-repositories.ps1
```

Procure:

- Repository de Value Object;
- Repository de child;
- save parcial;
- delete físico;
- tipo técnico.

---

### 62. Validar queries

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-repository-queries.ps1
```

Classifique:

- comando;
- invariante;
- tela;
- relatório;
- analytics.

Queries de leitura rica devem sair do Repository de domínio.

---

### 63. Validar rehydration

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-rehydration-flow.ps1
```

Confirme:

- root completa;
- Value Objects válidos;
- histórico;
- revisão;
- zero evento;
- erro de qualidade.

---

### 64. Validar concorrência

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-optimistic-concurrency.ps1
```

Confirme:

- expected revision;
- criação explícita;
- update explícito;
- zero blind save;
- stale rejection;
- retry por reload.

---

### 65. Validar mapping

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-persistence-mappings.ps1
```

Procure:

- annotations no domínio;
- record técnico retornado;
- enum automático;
- null inválido;
- mapper sem teste;
- serialização direta.

---

### 66. Validar erros

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-persistence-errors.ps1
```

Confirme:

- erros estáveis;
- retryable explícito;
- SQL oculto;
- dados sensíveis ausentes;
- optimistic lock traduzido.

---

### 67. Validar cache

Execute:

```powershell
.\scripts\m19\service-appointment-repository\validate-cache-policy.ps1
```

Confirme:

- cache desabilitado por padrão;
- revisão;
- invalidação;
- source of truth no banco;
- detalhe escondido.

---

### 68. Executar contract tests

Execute:

```powershell
.\scripts\m19\service-appointment-repository\run-repository-contract-tests.ps1
```

Ou:

```powershell
mvn test
```

Execute o mesmo contrato contra:

- InMemory;
- JDBC;
- JPA Adapter.

---

### 69. Criar reports

Exemplo:

```yaml
repositoryContract:
  aggregateRoot:
    Appointment

  implementations:
    - InMemory
    - JDBC
    - JPA-Adapter

  frameworkTypesInDomain:
    0

  repositoriesForNonRoots:
    0

  staleWritesAccepted:
    0

  rehydrationEvents:
    0

  result:
    PASS
```

---

### 70. Criar gate

O gate valida interface, root, queries, rehydration, mapping, concorrência, transação, erros, adapters, cache, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_INTERFACE;

FAIL_AGGREGATE_ROOT;

FAIL_QUERY_POLICY;

FAIL_REHYDRATION;

FAIL_MAPPING;

FAIL_CONCURRENCY;

FAIL_TRANSACTION;

FAIL_ERROR_TRANSLATION;

FAIL_CACHE_POLICY;

FAIL_CONTRACT_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 71. Coletar evidence

Arquivo:

```text
contracts/repository-ddd-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- aggregate root;
- implementation count;
- interface status;
- root policy status;
- query policy status;
- rehydration status;
- mapping status;
- expected revision status;
- concurrency status;
- transaction status;
- error translation status;
- cache policy status;
- contract test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- credenciais;
- connection strings;
- dados pessoais;
- registros reais;
- SQL de produção;
- Domain Service aprofundado;
- Application Service aprofundado.

---

### 72. Executar validação completa

```powershell
.\scripts\m19\service-appointment-repository\validate-repository-ddd-contract.ps1

.\scripts\m19\service-appointment-repository\validate-repository-interface.ps1

.\scripts\m19\service-appointment-repository\validate-aggregate-root-repositories.ps1

.\scripts\m19\service-appointment-repository\validate-repository-queries.ps1

.\scripts\m19\service-appointment-repository\validate-rehydration-flow.ps1

.\scripts\m19\service-appointment-repository\validate-optimistic-concurrency.ps1

.\scripts\m19\service-appointment-repository\validate-persistence-mappings.ps1

.\scripts\m19\service-appointment-repository\validate-persistence-errors.ps1

.\scripts\m19\service-appointment-repository\validate-cache-policy.ps1

.\scripts\m19\service-appointment-repository\run-repository-contract-tests.ps1

.\scripts\m19\service-appointment-repository\collect-repository-evidence.ps1

.\scripts\m19\service-appointment-repository\verify-repository-ddd-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 73. Encerrar o laboratório

Confirme:

- Repository orientado à root;
- interface no domínio;
- zero framework na interface;
- zero Repository para child;
- zero CRUD genérico;
- expected revision explícita;
- stale write rejeitada;
- rehydration completa;
- zero evento ao carregar;
- mapping externo;
- erros traduzidos;
- transaction boundary explícita;
- JDBC testado;
- JPA isolado em adapter;
- cache desabilitado por padrão;
- contract tests executados;
- Domain Service não antecipado;
- Application Service dedicado não antecipado;
- reports sanitizados.

---

## Entendendo o que foi feito

### O Repository ganhou linguagem

Operações deixaram de refletir CRUD técnico.

### A Aggregate Root ganhou persistência própria

Children e Value Objects deixaram de possuir Repositories separados.

### A reidratação ganhou fluxo explícito

Dados persistidos passaram por mapping, validação e reconstrução.

### A concorrência ganhou proteção

Expected revision passou a rejeitar gravações antigas.

### O banco ganhou papel complementar

Constraints reforçam estrutura sem substituir invariantes.

### O JDBC ganhou isolamento

SQL permaneceu em DAOs e adapters.

### O JPA ganhou fronteira

Annotations e Spring Data ficaram fora do domínio.

### As consultas ganharam classificação

Telas e relatórios deixaram de carregar Aggregates sem necessidade.

### Os erros ganharam tradução

Exceções técnicas deixaram de vazar.

### Os testes ganharam contrato comum

Implementações diferentes passaram a provar o mesmo comportamento.

---

## Erros comuns importantes

### Estender `JpaRepository` no domínio

O contrato fica acoplado ao framework.

### Criar Repository genérico

A linguagem e a concorrência desaparecem.

### Criar Repository para Value Object

O boundary do Aggregate é quebrado.

### Retornar Entity JPA

O modelo técnico invade o domínio.

### Fazer blind save

Lost updates são aceitos.

### Reidratar estado parcial

Invariantes ficam frágeis.

### Publicar evento dentro do Repository

Persistência e integração se misturam.

### Usar Repository para relatório

Aggregates são carregados sem necessidade.

### Confiar somente em `exists`

Race conditions continuam possíveis.

### Antecipar Domain Service

A aula perde o foco em persistência.

---

## Comandos úteis

### Validar interface

```powershell
.\scripts\m19\service-appointment-repository\validate-repository-interface.ps1
```

### Validar rehydration

```powershell
.\scripts\m19\service-appointment-repository\validate-rehydration-flow.ps1
```

### Validar concorrência

```powershell
.\scripts\m19\service-appointment-repository\validate-optimistic-concurrency.ps1
```

### Executar contract tests

```powershell
.\scripts\m19\service-appointment-repository\run-repository-contract-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-appointment-repository\verify-repository-ddd-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Contrato

Crie Repository orientado ao domínio.

### Parte 2 — Root

Garanta Repository somente para Aggregate Root.

### Parte 3 — Memória

Armazene snapshots e reidrate.

### Parte 4 — Concorrência

Implemente Expected Revision.

### Parte 5 — JDBC

Mapeie root, histórico e revisão.

### Parte 6 — JPA

Isole Entity JPA e Spring Data.

### Parte 7 — Queries

Separe Repository e Query Service.

### Parte 8 — Erros

Traduza falhas técnicas.

### Parte 9 — Testes

Crie contract tests reutilizáveis.

### Parte 10 — Gate

Valide arquitetura e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 625 e ponte para a aula 627 foram preservadas;
- o laboratório `service-appointment-repository` foi criado;
- `AppointmentRepository` está no domínio;
- a interface usa linguagem do domínio;
- a interface não usa Spring, JPA, JDBC ou SQL;
- existe Repository somente para `Appointment`;
- Value Objects e children não possuem Repository;
- operações CRUD genéricas foram evitadas;
- remoção física não representa cancelamento;
- queries analíticas usam read model;
- Query Service foi separado;
- implementação em memória armazena snapshots;
- implementação em memória não devolve a mesma instância;
- `ExpectedRevision` diferencia criação e atualização;
- stale writes são rejeitadas;
- blind save foi proibido;
- JDBC mapper reconstrói Value Objects;
- rehydration valida invariantes;
- rehydration não produz eventos;
- root é salva atomicamente com histórico novo;
- SQL permanece na infraestrutura;
- constraints estruturais foram documentadas;
- JPA Entity permanece na infraestrutura;
- Spring Data permanece atrás do adapter;
- `@Version` é traduzido para erro de concorrência do domínio;
- lazy loading não invade o domínio;
- N+1 foi tratado como risco;
- Repository não publica eventos;
- erros técnicos são traduzidos;
- ausência retorna `Optional`;
- dados persistidos inválidos geram falha de qualidade;
- contract tests são executados contra implementações diferentes;
- cache não é source of truth;
- domínio continua livre de frameworks;
- Domain Service não foi aprofundado;
- Application Service dedicado não foi antecipado;
- reports, gate e evidence foram criados;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-626-repository-em-ddd/service-appointment-repository `
  scripts/m19/service-appointment-repository `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|connectionString|realCustomer|realDatabaseRow|JpaRepositoryInsideDomain|EntityManagerInsideDomain|domainServiceDeepDive|applicationServiceDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar Repository em DDD"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- connection strings;
- dados reais;
- SQL de produção;
- Entity JPA no domínio;
- Domain Service aprofundado;
- Application Service aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Repository em DDD.

Você criou:

```text
Repository Charter;

interface orientada ao domínio;

Repository por Aggregate Root;

Expected Revision;

optimistic concurrency;

implementação em memória;

implementação JDBC;

adapter JPA;

mappers;

rehydration;

política de queries;

tradução de erros;

contract tests;

architecture tests.
```

Você comprovou que Repository representa uma coleção conceitual de Aggregate Roots; que DAO e Repository possuem responsabilidades diferentes; que Value Objects e children não precisam de acesso independente; que expected revision protege contra lost update; que rehydration precisa reconstruir a root inteira; que JPA e Spring Data permanecem na infraestrutura; que telas e relatórios usam read models; e que o mesmo contrato pode validar múltiplas implementações.

A próxima aula será:

```text
627 - M19.17 - Domain Service
```

Nela, você irá aprofundar como representar regras de domínio que não pertencem naturalmente a uma única Entity, Value Object ou Aggregate Root.

Nenhum aprofundamento dedicado de Domain Service ou Application Service foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei Repository específico.
- [ ] Mantive framework fora do domínio.
- [ ] Persisti somente Aggregate Root.
- [ ] Implementei Expected Revision.
- [ ] Rejeitei stale write.
- [ ] Reidratei a root completa.
- [ ] Separei Query Service.
- [ ] Executei contract tests.

---

## Troubleshooting adicional

### O Repository precisa de `Pageable`

Mova a paginação para Query Service ou adapte um tipo próprio.

### Spring Data exige uma interface pública

Mantenha a interface em `infrastructure.jpa`.

### O save recebe somente a Entity JPA

O adapter precisa aceitar e devolver a Aggregate Root.

### O Repository retorna proxy lazy

Mapeie para o domínio antes de sair do adapter.

### A implementação em memória passa testes sem reidratar

Armazene snapshot para detectar acoplamento por referência.

### O update altera zero linhas

Trate como stale write ou registro ausente.

### `existsActiveFor` permite duplicação

Adicione constraint e transação apropriadas.

### O histórico causa N+1

Carregue por query específica ou batch.

### O cache retorna revisão antiga

Mantenha expected revision e reveja invalidação.

### O laboratório começou a criar Domain Service

Preserve esse aprofundamento para a aula 627.

---

## Perguntas de revisão

1. O que é Repository em DDD?
2. Qual diferença entre Repository e DAO?
3. Para quais objetos existe Repository?
4. Por que evitar Repository genérico?
5. O que é rehydration?
6. O que é Expected Revision?
7. O que é stale write?
8. O que é optimistic concurrency?
9. Por que Repository não publica eventos?
10. Onde fica a Entity JPA?
11. Onde fica Spring Data?
12. O que o persistence mapper faz?
13. Por que não retornar record de banco?
14. Quando usar Query Service?
15. Quando usar read model?
16. Para que servem contract tests?
17. Qual risco do cache de Aggregate?
18. O que acontece com estado persistido inválido?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Coleção conceitual de Aggregate Roots.
2. Repository usa linguagem do domínio; DAO usa registros técnicos.
3. Para Aggregate Roots.
4. Preservar linguagem e semântica.
5. Reconstrução do Aggregate persistido.
6. Revisão esperada para a gravação.
7. Gravação baseada em estado antigo.
8. Detecção de concorrência sem lock pessimista.
9. Separar persistência e integração.
10. Na infraestrutura.
11. Atrás do adapter de infraestrutura.
12. Traduz domínio e registros persistidos.
13. Evitar vazamento técnico.
14. Para consultas de tela e leitura.
15. Para leitura otimizada e relatórios.
16. Validar todas as implementações.
17. Retornar revisão antiga.
18. Falha de qualidade de dados.
19. Domain Service.
20. Domain Service.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 626 - M19.16 - Repository em DDD

- Aprofundei Repository em DDD.
- Criei o laboratório `service-appointment-repository`.
- Modelei `AppointmentRepository` na linguagem do domínio.
- Mantive Spring, JPA, JDBC e SQL fora da interface.
- Criei Repository somente para a Aggregate Root.
- Diferenciei Repository de DAO.
- Evitei CRUD genérico e remoção física.
- Separei consultas operacionais em Query Service.
- Implementei Repository em memória com snapshots.
- Criei `ExpectedRevision` para criação e atualização.
- Rejeitei stale writes.
- Modelei optimistic concurrency.
- Implementei mapping JDBC.
- Reidratei a root completa com histórico.
- Criei update SQL com revisão esperada.
- Mantive transação local para root e histórico.
- Modelei Entity JPA somente na infraestrutura.
- Criei adapter sobre Spring Data.
- Traduzi optimistic lock e erros técnicos.
- Documentei riscos de lazy loading, N+1 e cache.
- Criei contract tests reutilizáveis.
- Criei architecture tests, reports, gate e evidence.
- Não antecipei Domain Service ou Application Service dedicado.
- Próxima aula: Domain Service.
```

---

## Referência técnica curta

- Domain Repository.
- Aggregate Root Repository.
- DAO.
- Rehydration.
- Persistence Mapping.
- Optimistic Concurrency.
- Expected Revision.
- Unit of Work.
- Identity Map.
- Repository Contract Tests.

Regra final:

```text
Repository em DDD precisa representar uma coleção conceitual de Aggregate Roots e falar a linguagem do domínio: `AppointmentRepository` recebe e devolve `Appointment`, usa identidades tipadas e `ExpectedRevision`, não expõe Spring, JPA, JDBC, SQL, records de banco ou CRUD genérico, e não existem Repositories separados para Value Objects ou children; implementações em memória, JDBC e JPA reconstruem a root completa por mappers externos, validam Value Objects e invariantes, não produzem eventos na rehydration e traduzem falhas técnicas para erros estáveis; criação e atualização distinguem revisões esperadas, stale writes são rejeitadas, blind overwrite é proibido, constraints do banco reforçam integridade e JPA usa `@Version` somente na infraestrutura; telas, relatórios e analytics usam Query Services ou read models, Repository não publica eventos, cache não é source of truth e contract tests validam todas as implementações; o gate termina com interface, root policy, queries, rehydration, mapping, concorrência, transação, erros, cache, testes, arquitetura, documentação e evidence aprovados, enquanto Domain Service é aprofundado somente na aula 627 e Application Service permanece reservado à aula 628.
```
