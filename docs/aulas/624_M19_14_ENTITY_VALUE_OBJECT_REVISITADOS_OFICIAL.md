# 624 - M19.14 - Entity Value Object revisitados

## Apresentação da aula

Na aula 623, você implementou uma Anti Corruption Layer entre:

```text
Legacy Workforce Platform
```

e:

```text
Field Execution Context.
```

A ACL protegeu o modelo interno contra:

- tipos externos;
- códigos numéricos;
- formatos de data;
- identificadores legados;
- erros técnicos;
- versões incompatíveis;
- perda silenciosa de informação.

Depois de proteger a fronteira externa, é necessário revisar a qualidade dos elementos usados dentro do modelo.

Na aula 619, Entity e Value Object já apareceram como padrões táticos.

Agora o objetivo é revisitá-los com maior profundidade.

A pergunta será:

```text
quando um conceito
precisa ser reconhecido
como o mesmo objeto
ao longo do tempo

e quando um conceito
é definido somente
pelos valores que possui?
```

Essa diferença influencia identidade, igualdade, `hashCode`, mutabilidade, persistência, serialização, coleções, testes e segurança de tipos.

Considere dois conceitos:

```text
Appointment;
AppointmentWindow.
```

Um `Appointment` continua sendo o mesmo compromisso mesmo quando:

- sua janela muda;
- seu status muda;
- ele é confirmado;
- ele é cancelado;
- informações secundárias são corrigidas.

Isso indica identidade e ciclo de vida.

Já uma `AppointmentWindow` é definida por:

```text
startsAt;
endsAt.
```

Se esses valores mudarem, não existe a mesma janela alterada.

Existe outra janela.

Essa diferença conduz a duas categorias:

```text
Entity:
continuidade por identidade.

Value Object:
significado por valor.
```

Entretanto, vários erros aparecem quando a decisão é superficial.

Exemplos:

```text
usar todos os campos no equals
de uma Entity;

usar ID de banco
como único conceito de identidade;

criar Value Object mutável;

usar String para conceitos distintos;

expor coleção interna;

normalizar valores fora do objeto;

usar record sem validar invariantes;

considerar qualquer classe com ID
uma Entity;

considerar qualquer record
um Value Object.
```

O laboratório será:

```text
labs/m19/aula-624-entity-value-object-revisitados/service-scheduling-model-refinement
```

Você irá refinar o `Service Scheduling Context`.

O laboratório terá a Entity `Appointment` e Value Objects como `AppointmentId`, `ServiceRequestId`, `AppointmentWindow`, `ServiceAreaCode`, `RescheduleReason`, `CancellationReason`, `CustomerContact` e `AppointmentLabel`.

Você irá comparar:

- identidade técnica e identidade de domínio;
- natural key e surrogate key;
- igualdade de Entity e igualdade de Value Object;
- identidade antes e depois da persistência;
- mutabilidade controlada;
- imutabilidade;
- normalização;
- validação na criação;
- cópias defensivas;
- valores compostos;
- coleções de valores;
- serialização;
- mapeamento de persistência;
- testes de contrato;
- riscos de `HashSet` e `HashMap`;
- migração de primitive obsession.

A próxima aula oficial será `625 - M19.15 - Aggregate Aggregate Root`.

Por isso, esta aula não irá definir:

- boundary completo de Aggregate;
- Aggregate Root;
- consistência entre objetos;
- regra de referência entre Aggregates;
- tamanho de Aggregate;
- transação por Aggregate;
- coordenação entre roots.

A aula 626 será:

```text
626 - M19.16 - Repository em DDD
```

A persistência aparecerá como mapeamento e reidratação.

O contrato de Repository será aprofundado somente na aula 626.

A regra central desta aula será:

```text
Entity é reconhecida
por sua identidade e continuidade;

Value Object é reconhecido
por seus valores,
sua validade
e sua imutabilidade.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
622:
Context Map.

623:
Anti Corruption Layer.

624:
Entity Value Object revisitados.

625:
Aggregate Aggregate Root.

626:
Repository em DDD.
```

A progressão é:

```text
mapear contextos;

traduzir modelos externos;

refinar os elementos do modelo;

definir unidade de consistência;

definir acesso à persistência.
```

Nesta aula:

```text
Entity:
sim.

identidade:
sim.

ciclo de vida:
sim.

igualdade de Entity:
sim.

Value Object:
sim.

igualdade por valor:
sim.

imutabilidade:
sim.

normalização:
sim.

primitive obsession:
sim.

rehydration:
sim.

mapeamento de persistência:
sim,
somente conceitual.

Aggregate:
não.

Aggregate Root:
não.

Repository em DDD:
não.

JPA real:
não.
```

O domínio permanece livre de Spring e JPA.

---

## Objetivo prático

Será criada a seguinte estrutura:

```text
labs/m19/aula-624-entity-value-object-revisitados/service-scheduling-model-refinement
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/modelrefinement
│   │           ├── entity
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentStatus.java
│   │           │   └── AppointmentSnapshot.java
│   │           ├── value
│   │           │   ├── AppointmentId.java
│   │           │   ├── ServiceRequestId.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── ServiceAreaCode.java
│   │           │   ├── RescheduleReason.java
│   │           │   ├── CancellationReason.java
│   │           │   ├── CustomerContact.java
│   │           │   └── AppointmentLabel.java
│   │           ├── factory
│   │           │   └── AppointmentIdentityFactory.java
│   │           ├── mapping
│   │           │   ├── AppointmentPersistenceRecord.java
│   │           │   └── AppointmentPersistenceMapper.java
│   │           └── exception
│   │               ├── DomainValidationException.java
│   │               └── InvalidAppointmentIdentity.java
│   └── test
│       └── java
│           └── br/com/formacao/modelrefinement
│               ├── entity
│               │   ├── AppointmentIdentityTest.java
│               │   ├── AppointmentEqualityTest.java
│               │   ├── AppointmentLifecycleTest.java
│               │   └── AppointmentSnapshotTest.java
│               ├── value
│               │   ├── AppointmentIdTest.java
│               │   ├── AppointmentWindowTest.java
│               │   ├── ServiceAreaCodeTest.java
│               │   ├── CustomerContactTest.java
│               │   ├── ValueObjectEqualityTest.java
│               │   └── ImmutableCollectionTest.java
│               ├── mapping
│               │   └── AppointmentPersistenceMapperTest.java
│               └── architecture
│                   ├── EntityValueObjectArchitectureTest.java
│                   ├── DomainFrameworkIndependenceTest.java
│                   └── PrimitiveObsessionTest.java
├── model
│   ├── ENTITY_VALUE_OBJECT_DECISION_GUIDE.md
│   ├── IDENTITY_POLICY.md
│   ├── EQUALITY_POLICY.md
│   ├── IMMUTABILITY_POLICY.md
│   ├── NORMALIZATION_POLICY.md
│   ├── PRIMITIVE_OBSESSION_INVENTORY.md
│   ├── ENTITY_LIFECYCLE.md
│   ├── VALUE_OBJECT_CATALOG.md
│   ├── PERSISTENCE_MAPPING.md
│   ├── SERIALIZATION_BOUNDARY.md
│   ├── MIGRATION_PLAN.md
│   └── OPEN_MODELING_QUESTIONS.md
├── contracts
│   ├── entity-value-object-contract.yaml
│   ├── entity-policy.yaml
│   ├── identity-policy.yaml
│   ├── entity-equality-policy.yaml
│   ├── value-object-policy.yaml
│   ├── immutability-policy.yaml
│   ├── normalization-policy.yaml
│   ├── primitive-obsession-policy.yaml
│   ├── persistence-mapping-policy.yaml
│   ├── serialization-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
└── reports
    ├── entity-review-report.yaml
    ├── identity-report.yaml
    ├── equality-report.yaml
    ├── value-object-report.yaml
    ├── primitive-obsession-report.yaml
    ├── mapping-report.yaml
    └── entity-value-object-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-model-refinement
├── validate-entity-value-object-contract.ps1
├── validate-entities.ps1
├── validate-identities.ps1
├── validate-entity-equality.ps1
├── validate-value-objects.ps1
├── validate-immutability.ps1
├── validate-normalization.ps1
├── validate-primitive-obsession.ps1
├── validate-persistence-mapping.ps1
├── run-entity-value-object-tests.ps1
├── collect-entity-value-object-evidence.ps1
└── verify-entity-value-object-gate.ps1
```

Ao final, você terá critérios concretos para escolher e implementar Entities e Value Objects.

---

## Conceito essencial

### Entity

Objeto do domínio que possui identidade contínua e ciclo de vida.

---

### Identity

Característica que permite reconhecer uma Entity como a mesma ao longo do tempo.

---

### Natural Identity

Identidade formada por um atributo que já existe no domínio.

Exemplo:

```text
número oficial de um contrato.
```

---

### Surrogate Identity

Identidade criada pelo sistema.

Exemplo:

```text
UUID.
```

---

### Lifecycle

Sequência de estados e mudanças pela qual uma Entity passa.

---

### Entity Equality

Comparação baseada na identidade estável.

---

### Value Object

Objeto definido por seus valores, sem identidade própria relevante.

---

### Value Equality

Comparação estrutural baseada nos valores significativos.

---

### Immutability

Garantia de que um objeto não muda depois de criado.

---

### Normalization

Conversão de diferentes representações equivalentes para uma forma canônica.

---

### Primitive Obsession

Uso excessivo de primitives e Strings para representar conceitos do domínio.

---

### Rehydration

Reconstrução de uma Entity a partir de dados persistidos.

---

### Snapshot

Representação imutável do estado observado em um instante.

---

### Defensive Copy

Cópia usada para impedir mutação indireta de estado interno.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-624-entity-value-object-revisitados/service-scheduling-model-refinement

Set-Location `
  labs/m19/aula-624-entity-value-object-revisitados/service-scheduling-model-refinement
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/entity-value-object-contract.yaml
```

Conteúdo:

```yaml
entityValueObject:
  context:
    Service-Scheduling

  required:
    - entity-identity
    - entity-lifecycle
    - stable-entity-equality
    - value-equality
    - immutable-value-objects
    - validation-at-construction
    - normalization
    - defensive-copying
    - primitive-obsession-review
    - persistence-mapping
    - serialization-boundary
    - tests
    - architecture-rules

  forbidden:
    - entity-equality-by-mutable-state
    - mutable-value-object
    - public-setter
    - invalid-value-object
    - framework-annotation-in-domain
    - database-identity-as-only-domain-reason
    - aggregate-deep-dive
    - repository-deep-dive

  nextLesson:
    code:
      M19.15
```

---

### 3. Criar guia de decisão

Arquivo:

```text
model/ENTITY_VALUE_OBJECT_DECISION_GUIDE.md
```

Perguntas para Entity:

```text
o conceito possui continuidade?

precisa ser reconhecido
como o mesmo ao longo do tempo?

seus atributos podem mudar
sem substituir o conceito?

existe histórico próprio?

outras regras fazem referência
à sua identidade?

duas instâncias com os mesmos atributos
podem representar objetos diferentes?
```

Perguntas para Value Object:

```text
o conceito é definido por seus valores?

duas instâncias com os mesmos valores
são intercambiáveis?

a mudança de um valor
representa um novo objeto?

ele pode ser imutável?

ele encapsula validação,
normalização
ou comportamento?
```

---

### 4. Avaliar `Appointment`

Dois appointments podem possuir:

- mesma janela;
- mesma solicitação;
- mesmo status;
- mesma área.

Ainda assim, podem representar compromissos diferentes.

Portanto:

```text
Appointment é Entity.
```

---

### 5. Avaliar `AppointmentWindow`

Duas janelas com o mesmo início e fim representam o mesmo valor.

Se o início muda, existe outra janela.

Portanto:

```text
AppointmentWindow é Value Object.
```

---

### 6. Criar identity policy

Arquivo:

```text
contracts/identity-policy.yaml
```

Conteúdo:

```yaml
identity:
  entity:
    required

  stable:
    required

  mutable:
    forbidden

  generatedBeforePersistence:
    preferred

  businessMeaning:
    documented:
      required

  databaseSequence:
    domainIdentity:
      allowedOnlyWithJustification

  reuse:
    forbidden
```

---

### 7. Criar `AppointmentId`

```java
public record AppointmentId(
        UUID value) {

    public AppointmentId {

        if (value == null) {
            throw new InvalidAppointmentIdentity(
                    "Appointment id is required");
        }
    }

    public static AppointmentId generate() {

        return new AppointmentId(
                UUID.randomUUID());
    }

    public static AppointmentId from(
            String raw) {

        try {
            return new AppointmentId(
                    UUID.fromString(
                            raw.trim()));
        } catch (RuntimeException exception) {
            throw new InvalidAppointmentIdentity(
                    "Invalid appointment id",
                    exception);
        }
    }
}
```

A identidade existe antes do `save`, simplificando eventos, logs, testes e referências.

---

### 8. Criar `ServiceRequestId`

```java
public record ServiceRequestId(
        UUID value) {

    public ServiceRequestId {
        Objects.requireNonNull(
                value,
                "Service request id is required");
    }
}
```

`AppointmentId` e `ServiceRequestId` possuem a mesma estrutura técnica.

Mas não são o mesmo conceito.

Tipos separados evitam:

```java
confirm(serviceRequestId);
```

quando o método espera um appointment.

---

### 9. Natural key versus surrogate key

Considere `AP-2026-000123` como identidade natural. Se o código puder mudar, ser reutilizado ou depender de regra operacional, use UUID como identidade interna e trate o código legível como outro Value Object.

---

### 10. Criar `AppointmentLabel`

```java
public record AppointmentLabel(
        String value) {

    public AppointmentLabel {

        if (value == null
                || !value.matches(
                        "AP-[0-9]{4}-[0-9]{6}")) {
            throw new DomainValidationException(
                    "Invalid appointment label");
        }
    }
}
```

`AppointmentLabel` pode mudar por migração.

`AppointmentId` não muda.

---

### 11. Criar Entity policy

Arquivo:

```text
contracts/entity-policy.yaml
```

Conteúdo:

```yaml
entity:
  required:
    - stable-identity
    - domain-behavior
    - controlled-lifecycle
    - identity-based-equality

  forbidden:
    - public-setter
    - equality-by-all-fields
    - framework-annotation
    - DTO-responsibility
    - public-mutable-collection
    - identity-change
```

---

### 12. Criar `Appointment`

```java
public final class Appointment {

    private final AppointmentId id;
    private final ServiceRequestId serviceRequestId;
    private final Instant createdAt;

    private AppointmentWindow window;
    private AppointmentStatus status;
    private AppointmentLabel label;

    private Appointment(
            AppointmentId id,
            ServiceRequestId serviceRequestId,
            AppointmentWindow window,
            AppointmentLabel label,
            Instant createdAt,
            AppointmentStatus status) {

        this.id =
                Objects.requireNonNull(id);

        this.serviceRequestId =
                Objects.requireNonNull(
                        serviceRequestId);

        this.window =
                Objects.requireNonNull(window);

        this.label =
                Objects.requireNonNull(label);

        this.createdAt =
                Objects.requireNonNull(createdAt);

        this.status =
                Objects.requireNonNull(status);
    }
}
```

A Entity possui estado mutável controlado.

Isso não significa setters públicos.

---

### 13. Criar operações de ciclo de vida

```java
public void confirm() {

    if (status != AppointmentStatus.SCHEDULED) {
        throw new DomainValidationException(
                "Only scheduled appointments can be confirmed");
    }

    status =
            AppointmentStatus.CONFIRMED;
}
```

```java
public void reschedule(
        AppointmentWindow newWindow,
        RescheduleReason reason) {

    Objects.requireNonNull(newWindow);
    Objects.requireNonNull(reason);

    if (status == AppointmentStatus.CANCELLED) {
        throw new DomainValidationException(
                "Cancelled appointment cannot be rescheduled");
    }

    if (window.equals(newWindow)) {
        throw new DomainValidationException(
                "New window must be different");
    }

    window =
            newWindow;

    status =
            AppointmentStatus.SCHEDULED;
}
```

A identidade permanece a mesma.

---

### 14. Criar rehydration

```java
public static Appointment rehydrate(
        AppointmentId id,
        ServiceRequestId serviceRequestId,
        AppointmentWindow window,
        AppointmentLabel label,
        Instant createdAt,
        AppointmentStatus status) {

    return new Appointment(
            id,
            serviceRequestId,
            window,
            label,
            createdAt,
            status);
}
```

`rehydrate` não deve repetir eventos de criação.

Ele reconstrói um estado previamente válido.

---

### 15. Separar criação de reidratação

```java
public static Appointment schedule(
        AppointmentId id,
        ServiceRequestId serviceRequestId,
        AppointmentWindow window,
        AppointmentLabel label,
        Instant createdAt) {

    return new Appointment(
            id,
            serviceRequestId,
            window,
            label,
            createdAt,
            AppointmentStatus.SCHEDULED);
}
```

Criação e reidratação possuem intenções diferentes.

---

### 16. Criar equality policy

Arquivo:

```text
contracts/entity-equality-policy.yaml
```

Conteúdo:

```yaml
entityEquality:
  basedOn:
    identity

  identityMustBe:
    - non-null
    - stable
    - immutable

  mutableStateInEquals:
    forbidden

  mutableStateInHashCode:
    forbidden

  classCompatibility:
    explicit:
      required

  generatedIdentityAfterInsertion:
    risk:
      documented
```

---

### 17. Implementar igualdade da Entity

```java
@Override
public boolean equals(
        Object other) {

    if (this == other) {
        return true;
    }

    if (!(other instanceof Appointment that)) {
        return false;
    }

    return id.equals(that.id);
}

@Override
public int hashCode() {
    return id.hashCode();
}
```

A janela, o status e o label não participam.

---

### 18. Entender o risco de estado mutável no `hashCode`

Exemplo incorreto:

```java
@Override
public int hashCode() {
    return Objects.hash(
            id,
            status,
            window);
}
```

Fluxo:

1. Entity entra em `HashSet`;
2. status muda;
3. hash muda;
4. conjunto não encontra mais a Entity;
5. remoção falha;
6. invariantes da coleção são quebradas.

Por isso, use apenas identidade imutável.

---

### 19. Entender proxies e classes

Frameworks de persistência podem criar subclasses e exigir estratégia específica de `equals`. Nesta aula, use Java puro e mantenha adaptações de proxy fora do domínio.

---

### 20. Criar lifecycle document

Arquivo:

```text
model/ENTITY_LIFECYCLE.md
```

Registre:

```text
criação:
SCHEDULED.

confirmação:
SCHEDULED -> CONFIRMED.

reagendamento:
SCHEDULED ou CONFIRMED -> SCHEDULED.

cancelamento:
SCHEDULED ou CONFIRMED -> CANCELLED.

estado terminal:
CANCELLED.
```

Ciclo de vida não define Aggregate.

Ele descreve a continuidade da Entity.

---

### 21. Criar Value Object policy

Arquivo:

```text
contracts/value-object-policy.yaml
```

Conteúdo:

```yaml
valueObject:
  required:
    - value-based-equality
    - immutability
    - validation-at-construction
    - domain-name
    - no-invalid-state

  preferred:
    - behavior-close-to-data
    - canonical-representation
    - safe-serialization

  forbidden:
    - setter
    - persistence-identity
    - mutable-field
    - mutable-collection
    - null-as-valid-state-without-meaning
```

---

### 22. Criar `AppointmentWindow`

```java
public record AppointmentWindow(
        Instant startsAt,
        Instant endsAt) {

    public AppointmentWindow {

        Objects.requireNonNull(
                startsAt,
                "startsAt is required");

        Objects.requireNonNull(
                endsAt,
                "endsAt is required");

        if (!endsAt.isAfter(startsAt)) {
            throw new DomainValidationException(
                    "Window end must be after start");
        }

        if (Duration.between(
                        startsAt,
                        endsAt)
                .compareTo(
                        Duration.ofHours(12)) > 0) {
            throw new DomainValidationException(
                    "Window cannot exceed twelve hours");
        }
    }

    public Duration duration() {
        return Duration.between(
                startsAt,
                endsAt);
    }

    public boolean overlaps(
            AppointmentWindow other) {

        return startsAt.isBefore(
                       other.endsAt())
                && endsAt.isAfter(
                       other.startsAt());
    }
}
```

O record não garante validade sozinho.

O construtor compacto protege as invariantes.

---

### 23. Igualdade por valor

```java
AppointmentWindow first =
        new AppointmentWindow(
                start,
                end);

AppointmentWindow second =
        new AppointmentWindow(
                start,
                end);

assertEquals(
        first,
        second);
```

São instâncias diferentes.

Representam o mesmo valor.

---

### 24. Criar `ServiceAreaCode`

```java
public record ServiceAreaCode(
        String value) {

    public ServiceAreaCode {

        if (value == null
                || value.isBlank()) {
            throw new DomainValidationException(
                    "Service area code is required");
        }

        value =
                value.trim()
                        .toUpperCase(
                                Locale.ROOT);

        if (!value.matches(
                "[A-Z]{2}-[0-9]{3}")) {
            throw new DomainValidationException(
                    "Invalid service area code");
        }
    }
}
```

A normalização garante que:

```text
sp-101;
SP-101;
 SP-101
```

resultem no mesmo valor canônico.

---

### 25. Criar normalization policy

Arquivo:

```text
contracts/normalization-policy.yaml
```

Conteúdo:

```yaml
normalization:
  occursAt:
    construction

  canonicalRepresentation:
    required

  locale:
    explicit:
      required

  systemDefaultLocale:
    forbidden

  destructiveNormalization:
    forbidden

  equalityAfterNormalization:
    required
```

---

### 26. Criar `CustomerContact`

```java
public record CustomerContact(
        String email,
        String phone) {

    public CustomerContact {

        email =
                normalizeEmail(email);

        phone =
                normalizePhone(phone);

        if (email == null
                && phone == null) {
            throw new DomainValidationException(
                    "At least one contact is required");
        }
    }

    public Optional<String> emailValue() {
        return Optional.ofNullable(email);
    }

    public Optional<String> phoneValue() {
        return Optional.ofNullable(phone);
    }
}
```

Esse Value Object representa uma combinação válida.

---

### 27. Evitar `Optional` como campo

Prefira campos nulos privados validados ou tipos específicos.

Use `Optional` no método de leitura.

Evite:

```java
record CustomerContact(
        Optional<String> email,
        Optional<String> phone)
```

porque isso complica:

- serialização;
- construção;
- frameworks;
- validação;
- legibilidade.

---

### 28. Criar motivos distintos

```java
public record RescheduleReason(
        String value) {
}
```

```java
public record CancellationReason(
        String value) {
}
```

Mesmo que ambos sejam texto, possuem semânticas diferentes.

Não use:

```text
Reason.
```

O tipo genérico permite combinações inválidas.

---

### 29. Encapsular comportamento

```java
public boolean isCustomerRelated() {

    return value.startsWith(
            "CUSTOMER_");
}
```

O comportamento deve pertencer ao conceito, evitando validações textuais espalhadas.

---

### 30. Criar immutability policy

Arquivo:

```text
contracts/immutability-policy.yaml
```

Conteúdo:

```yaml
immutability:
  valueObject:
    required

  fields:
    final:
      required

  mutableInput:
    defensiveCopy:
      required

  mutableOutput:
    defensiveCopy:
      required

  collection:
    immutableView:
      required

  array:
    clone:
      required
```

---

### 31. Criar Value Object com coleção

Considere:

```java
public final class AppointmentTags {

    private final Set<String> values;

    public AppointmentTags(
            Collection<String> values) {

        this.values =
                values.stream()
                        .map(String::trim)
                        .map(
                                value ->
                                        value.toUpperCase(
                                                Locale.ROOT))
                        .filter(
                                value ->
                                        !value.isBlank())
                        .collect(
                                Collectors.toUnmodifiableSet());
    }

    public Set<String> values() {
        return values;
    }
}
```

Nunca armazene diretamente a coleção recebida.

---

### 32. Value Object com array

Se um valor contém bytes:

```java
public final class DocumentFingerprint {

    private final byte[] value;

    public DocumentFingerprint(
            byte[] value) {

        this.value =
                value.clone();
    }

    public byte[] value() {
        return value.clone();
    }
}
```

`record` com array exige cuidado porque a igualdade padrão do array é por referência.

---

### 33. Criar primitive obsession inventory

Arquivo:

```text
model/PRIMITIVE_OBSESSION_INVENTORY.md
```

Procure:

```text
UUID appointmentId;

UUID serviceRequestId;

String areaCode;

String status;

String reason;

String email;

String phone;

Instant startsAt;

Instant endsAt.
```

Nem todo primitive precisa virar Value Object. Priorize conceitos com regra, normalização, comportamento, risco de confusão ou segurança de tipo.

---

### 34. Criar primitive obsession policy

Arquivo:

```text
contracts/primitive-obsession-policy.yaml
```

Conteúdo:

```yaml
primitiveObsession:
  reviewWhen:
    - repeated-validation
    - semantic-confusion
    - unit-risk
    - normalization
    - domain-behavior
    - parameter-order-risk

  createValueObject:
    onlyWithDomainMeaning:
      true

  wrapperWithoutMeaning:
    discouraged

  universalStringReplacement:
    forbidden
```

---

### 35. Evitar excesso de wrappers

Criar:

```text
FirstName;
MiddleName;
LastName;
FullName;
DisplayName;
LegalName;
PreferredName;
```

pode ser correto em um domínio específico.

Mas pode ser burocracia em outro.

O Value Object precisa reduzir ambiguidade ou proteger regra.

---

### 36. Criar snapshot

```java
public record AppointmentSnapshot(
        AppointmentId id,
        ServiceRequestId serviceRequestId,
        AppointmentWindow window,
        AppointmentStatus status,
        AppointmentLabel label,
        Instant createdAt) {
}
```

A Entity cria snapshot:

```java
public AppointmentSnapshot snapshot() {

    return new AppointmentSnapshot(
            id,
            serviceRequestId,
            window,
            status,
            label,
            createdAt);
}
```

O snapshot representa uma observação imutável; não substitui a Entity.

---

### 37. Snapshot versus Entity

Use snapshot para:

- leitura;
- comparação;
- auditoria;
- teste;
- serialização interna;
- result de application service.

Não use snapshot para:

- executar comportamento;
- alterar estado;
- substituir identity map;
- preservar ciclo de vida.

---

### 38. Criar record de persistência

```java
public record AppointmentPersistenceRecord(
        UUID id,
        UUID serviceRequestId,
        Instant startsAt,
        Instant endsAt,
        String status,
        String label,
        Instant createdAt) {
}
```

Esse record pertence ao adapter de persistência.

Ele não é a Entity.

---

### 39. Criar mapper

```java
public final class AppointmentPersistenceMapper {

    public AppointmentPersistenceRecord toRecord(
            Appointment appointment) {

        AppointmentSnapshot snapshot =
                appointment.snapshot();

        return new AppointmentPersistenceRecord(
                snapshot.id().value(),
                snapshot.serviceRequestId().value(),
                snapshot.window().startsAt(),
                snapshot.window().endsAt(),
                snapshot.status().name(),
                snapshot.label().value(),
                snapshot.createdAt());
    }

    public Appointment toDomain(
            AppointmentPersistenceRecord record) {

        return Appointment.rehydrate(
                new AppointmentId(record.id()),
                new ServiceRequestId(
                        record.serviceRequestId()),
                new AppointmentWindow(
                        record.startsAt(),
                        record.endsAt()),
                new AppointmentLabel(
                        record.label()),
                record.createdAt(),
                AppointmentStatus.valueOf(
                        record.status()));
    }
}
```

---

### 40. Criar mapping policy

Arquivo:

```text
contracts/persistence-mapping-policy.yaml
```

Conteúdo:

```yaml
persistenceMapping:
  domain:
    frameworkIndependent:
      required

  persistenceRecord:
    outsideDomain:
      required

  mapper:
    validatesRehydratedValues:
      required

  databaseNull:
    mustNotCreateInvalidDomainState:
      true

  status:
    explicitMapping:
      required

  repositoryContract:
    deferredToLesson626
```

---

### 41. Não ignorar dados inválidos na reidratação

Se o banco contém `startsAt > endsAt`, o mapper deve rejeitar, colocar em quarentena ou sinalizar falha de qualidade. Nunca ignore invariantes para reidratar.

---

### 42. Criar serialization policy

Arquivo:

```text
contracts/serialization-policy.yaml
```

Conteúdo:

```yaml
serialization:
  domainEntityDirectly:
    forbidden

  valueObject:
    explicitShape:
      required

  publicContract:
    mapper:
      required

  typeMetadata:
    externalExposure:
      forbidden

  deserialization:
    validation:
      required
```

---

### 43. Evitar serializar Entity diretamente

Exemplo incorreto:

```java
return objectMapper.writeValueAsString(
        appointment);
```

Problemas:

- internals viram contrato;
- campos privados vazam;
- mudanças quebram consumidores;
- lifecycle é ignorado;
- formato fica acoplado ao domínio.

Mapeie para um DTO ou view.

---

### 44. Testar identidade

```java
@Test
void sameIdentityMustRepresentSameEntity() {

    AppointmentId id =
            AppointmentId.generate();

    Appointment first =
            Fixtures.appointment(
                    id,
                    Fixtures.windowMorning());

    Appointment second =
            Fixtures.appointment(
                    id,
                    Fixtures.windowAfternoon());

    assertEquals(
            first,
            second);
}
```

Os atributos podem ser diferentes.

A identidade é igual.

---

### 45. Testar Entities diferentes com os mesmos valores

```java
@Test
void sameStateMustNotMakeDifferentEntitiesEqual() {

    Appointment first =
            Fixtures.appointment(
                    AppointmentId.generate(),
                    Fixtures.windowMorning());

    Appointment second =
            Fixtures.appointment(
                    AppointmentId.generate(),
                    Fixtures.windowMorning());

    assertNotEquals(
            first,
            second);
}
```

---

### 46. Testar `HashSet`

```java
@Test
void entityMustRemainFindableAfterStateChange() {

    Appointment appointment =
            Fixtures.scheduledAppointment();

    Set<Appointment> appointments =
            new HashSet<>();

    appointments.add(appointment);

    appointment.confirm();

    assertTrue(
            appointments.contains(
                    appointment));
}
```

Esse teste detecta `hashCode` baseado em estado mutável.

---

### 47. Testar Value Object equality

```java
@Test
void equivalentWindowsMustBeEqual() {

    AppointmentWindow first =
            Fixtures.windowMorning();

    AppointmentWindow second =
            Fixtures.windowMorning();

    assertEquals(
            first,
            second);

    assertEquals(
            first.hashCode(),
            second.hashCode());
}
```

---

### 48. Testar normalização

```java
@Test
void areaCodeMustUseCanonicalRepresentation() {

    ServiceAreaCode first =
            new ServiceAreaCode(
                    " sp-101 ");

    ServiceAreaCode second =
            new ServiceAreaCode(
                    "SP-101");

    assertEquals(
            first,
            second);
}
```

---

### 49. Testar imutabilidade

Valide:

- campos finais;
- ausência de setters;
- collections não modificáveis;
- defensive copies;
- arrays clonados;
- records validados.

Use reflexão apenas como teste auxiliar.

---

### 50. Criar architecture test

```java
@ArchTest
static final ArchRule domainMustNotDependOnFrameworks =
        noClasses()
                .that()
                .resideInAnyPackage(
                        "..entity..",
                        "..value..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "org.springframework..",
                        "jakarta.persistence..",
                        "com.fasterxml.jackson..");
```

---

### 51. Criar primitive test

O teste pode procurar signatures públicas com primitives de alto risco.

Exemplo:

```text
reschedule(
    Instant startsAt,
    Instant endsAt,
    String reason)
```

A assinatura preferida é:

```text
reschedule(
    AppointmentWindow window,
    RescheduleReason reason)
```

Não bloqueie todo uso de `String`.

Bloqueie pontos já modelados.

---

### 52. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  entityWithoutIdentity:
    action:
      FAIL

  mutableIdentity:
    action:
      FAIL

  entityHashCodeUsingMutableState:
    action:
      FAIL

  mutableValueObject:
    action:
      FAIL

  invalidValueObjectConstructed:
    action:
      FAIL

  unsafeCollectionExposure:
    action:
      FAIL

  frameworkInsideDomain:
    action:
      FAIL

  primitiveObsessionInReviewedSignature:
    action:
      FAIL
```

---

### 53. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidIdentity:
    action:
      REJECT

  invalidValue:
    action:
      REJECT

  invalidPersistedState:
    action:
      DATA_QUALITY_FAILURE

  entityEqualityDrift:
    action:
      FAIL

  mutableValueObjectDetected:
    action:
      FAIL

  AggregateRootDeepDive:
    deferredToLesson625

  RepositoryDeepDive:
    deferredToLesson626
```

---

### 54. Validar Entities

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-entities.ps1
```

Confirme:

- identidade;
- ciclo de vida;
- comportamento;
- ausência de setters;
- ausência de annotations;
- collections protegidas.

---

### 55. Validar identidades

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-identities.ps1
```

Procure:

- identidade nula;
- identidade mutável;
- ID gerado somente depois do insert;
- ID reutilizado;
- tipos de ID misturados;
- natural key instável.

---

### 56. Validar igualdade

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-entity-equality.ps1
```

Confirme:

- `equals` por ID;
- `hashCode` por ID;
- estado mutável ausente;
- comportamento em `HashSet`;
- classes compatíveis.

---

### 57. Validar Value Objects

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-value-objects.ps1
```

Confirme:

- igualdade por valor;
- imutabilidade;
- invariantes;
- canonical representation;
- comportamento;
- sem identidade de persistência.

---

### 58. Validar imutabilidade

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-immutability.ps1
```

Procure:

- lista mutável;
- array exposto;
- campo não final;
- setter;
- referência mutável compartilhada;
- `Date`;
- `Calendar`;
- collection sem cópia.

---

### 59. Validar normalização

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-normalization.ps1
```

Confirme:

- locale explícito;
- trim;
- formato canônico;
- igualdade;
- ausência de perda destrutiva;
- teste de variações.

---

### 60. Validar primitive obsession

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-primitive-obsession.ps1
```

Gere relatório com:

- signature;
- primitive;
- conceito;
- risco;
- decisão;
- status.

---

### 61. Validar mapping

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-persistence-mapping.ps1
```

Confirme:

- record externo;
- mapper externo;
- rehydration validada;
- status explícito;
- zero JPA no domínio;
- zero serialização direta.

---

### 62. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-model-refinement\run-entity-value-object-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- identity;
- equality;
- lifecycle;
- Value Objects;
- normalization;
- defensive copies;
- snapshots;
- mapping;
- architecture.

---

### 63. Criar reports

Exemplo:

```yaml
entityReview:
  entity:
    Appointment

  identity:
    AppointmentId

  mutableIdentity:
    false

  publicSetters:
    0

  mutableFieldsInHashCode:
    0

  frameworkAnnotations:
    0

  result:
    PASS
```

---

### 64. Criar gate

O gate valida:

```text
Entity decisions;

identity;

lifecycle;

Entity equality;

Value Object decisions;

value equality;

immutability;

normalization;

defensive copies;

primitive obsession;

snapshot;

persistence mapping;

serialization boundary;

tests;

architecture;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_ENTITY;

FAIL_IDENTITY;

FAIL_ENTITY_EQUALITY;

FAIL_VALUE_OBJECT;

FAIL_IMMUTABILITY;

FAIL_NORMALIZATION;

FAIL_DEFENSIVE_COPY;

FAIL_PRIMITIVE_OBSESSION;

FAIL_MAPPING;

FAIL_SERIALIZATION;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 65. Coletar evidence

Arquivo:

```text
contracts/entity-value-object-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- entity count;
- value object count;
- identity status;
- lifecycle status;
- entity equality status;
- value equality status;
- immutability status;
- normalization status;
- defensive copy status;
- primitive obsession finding count;
- mapping status;
- serialization status;
- architecture status;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- IDs reais;
- records reais de banco;
- JPA;
- Aggregate aprofundado;
- Repository aprofundado.

---

### 66. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-entity-value-object-contract.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-entities.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-identities.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-entity-equality.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-value-objects.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-immutability.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-normalization.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-primitive-obsession.ps1

.\scripts\m19\service-scheduling-model-refinement\validate-persistence-mapping.ps1

.\scripts\m19\service-scheduling-model-refinement\run-entity-value-object-tests.ps1

.\scripts\m19\service-scheduling-model-refinement\collect-entity-value-object-evidence.ps1

.\scripts\m19\service-scheduling-model-refinement\verify-entity-value-object-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 67. Encerrar o laboratório

Confirme:

- Entity por identidade;
- ID estável;
- equality por ID;
- hash estável;
- lifecycle documentado;
- Value Objects imutáveis;
- igualdade por valor;
- normalização explícita;
- collections protegidas;
- primitive obsession revisada;
- snapshots imutáveis;
- persistence records externos;
- rehydration validada;
- domain sem framework;
- Aggregate não aprofundado;
- Repository não aprofundado;
- reports sanitizados.

---

## Entendendo o que foi feito

### A Entity ganhou continuidade explícita

O estado pode mudar sem alterar a identidade.

### A identidade ganhou tipo próprio

IDs semanticamente diferentes deixaram de ser intercambiáveis.

### A igualdade ganhou estabilidade

`equals` e `hashCode` deixaram de depender de estado mutável.

### O ciclo de vida ganhou comportamento

Mudanças passaram a ocorrer por métodos do domínio.

### Os Value Objects ganharam validade

Valores inválidos deixaram de circular.

### A imutabilidade ganhou proteção

Coleções, arrays e referências deixaram de vazar mutação.

### A normalização ganhou local correto

Representações equivalentes passaram a produzir valores iguais.

### Primitive obsession ganhou critérios

Wrappers passaram a ser criados por necessidade de domínio.

### Persistência ganhou separação

Records e mappers deixaram de definir o modelo.

### Snapshots ganharam função

Leituras imutáveis deixaram de expor a Entity.

---

## Erros comuns importantes

### Usar todos os campos no `equals` da Entity

Mudanças de estado quebram coleções.

### Gerar identidade somente no banco

Criação, teste e eventos ficam dependentes do insert.

### Usar natural key instável

A identidade pode mudar.

### Considerar todo record um Value Object

Records também podem representar DTOs inválidos.

### Criar Value Object mutável

Igualdade por valor fica insegura.

### Criar wrapper sem significado

A complexidade aumenta sem proteger regra.

### Expor coleção interna

O estado pode ser alterado externamente.

### Usar `Optional` como campo

Construção e serialização ficam mais difíceis.

### Reidratar ignorando invariantes

Dados inválidos entram no domínio.

### Antecipar Aggregate e Repository

A aula perde o foco em identidade e valor.

---

## Comandos úteis

### Validar Entities

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-entities.ps1
```

### Validar igualdade

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-entity-equality.ps1
```

### Validar Value Objects

```powershell
.\scripts\m19\service-scheduling-model-refinement\validate-value-objects.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-model-refinement\run-entity-value-object-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-model-refinement\verify-entity-value-object-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Decisão

Classifique conceitos como Entity ou Value Object.

### Parte 2 — Identidade

Crie IDs estáveis e tipados.

### Parte 3 — Entity

Implemente ciclo de vida e comportamento.

### Parte 4 — Igualdade

Proteja `equals` e `hashCode`.

### Parte 5 — Value Objects

Implemente validade e igualdade por valor.

### Parte 6 — Imutabilidade

Proteja collections e arrays.

### Parte 7 — Normalização

Crie representação canônica.

### Parte 8 — Primitive obsession

Revise signatures públicas.

### Parte 9 — Mapping

Separe domínio e persistência.

### Parte 10 — Gate

Valide decisões, testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 623 e ponte para a aula 625 foram preservadas;
- o laboratório `service-scheduling-model-refinement` foi criado;
- `Appointment` foi justificado como Entity;
- `AppointmentWindow` foi justificado como Value Object;
- toda Entity possui identidade estável;
- `AppointmentId` existe antes da persistência;
- `ServiceRequestId` não é intercambiável com `AppointmentId`;
- natural key e surrogate key foram comparadas;
- `AppointmentLabel` não substitui a identidade;
- Entity possui comportamento e ciclo de vida;
- Entity não possui setter público;
- rehydration foi separada da criação;
- `equals` e `hashCode` usam somente identidade;
- estado mutável não participa do `hashCode`;
- teste com `HashSet` foi criado;
- Value Objects usam igualdade por valor;
- Value Objects são imutáveis;
- Value Objects validam na construção;
- `AppointmentWindow` protege suas invariantes;
- `ServiceAreaCode` normaliza com locale explícito;
- motivos distintos usam tipos distintos;
- collections e arrays usam defensive copy;
- primitive obsession foi revisada com critérios;
- wrappers sem significado foram evitados;
- snapshots são imutáveis;
- persistence records ficam fora do domínio;
- mapper valida rehydration;
- serialização direta da Entity foi proibida;
- domínio não depende de Spring, JPA ou Jackson;
- Aggregate e Aggregate Root não foram aprofundados;
- Repository em DDD não foi aprofundado;
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
  labs/m19/aula-624-entity-value-object-revisitados/service-scheduling-model-refinement `
  scripts/m19/service-scheduling-model-refinement `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|@Entity|JpaRepository|AggregateRoot|aggregateBoundaryDeepDive|repositoryDeepDive|realDatabaseRecord"
```

Commit recomendado:

```powershell
git commit -m "refactor(m19): refinar Entity e Value Object"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- IDs reais;
- JPA;
- banco real;
- Aggregate aprofundado;
- Repository aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você revisitou Entity e Value Object.

Você aprofundou:

```text
identidade;

natural key;

surrogate key;

ciclo de vida;

igualdade de Entity;

hashCode estável;

igualdade por valor;

imutabilidade;

normalização;

defensive copies;

primitive obsession;

snapshots;

rehydration;

mapeamento de persistência;

serialização.
```

Você comprovou que Entity é definida por continuidade e identidade; que Value Object é definido por valor; que IDs tipados evitam confusão; que estado mutável não pode participar do hash da Entity; que records precisam validar invariantes; que imutabilidade exige proteger coleções e arrays; que normalização deve produzir representação canônica; e que persistência não deve definir o modelo.

A próxima aula será:

```text
625 - M19.15 - Aggregate Aggregate Root
```

Nela, você irá aprofundar como Entities e Value Objects são agrupados em uma unidade de consistência, como escolher a root, como proteger invariantes e como definir limites transacionais.

Nenhum aprofundamento de Aggregate, Aggregate Root ou Repository em DDD foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei Entity e Value Object por significado.
- [ ] Criei IDs estáveis e tipados.
- [ ] Protegi igualdade da Entity.
- [ ] Testei comportamento em `HashSet`.
- [ ] Criei Value Objects imutáveis.
- [ ] Normalizei valores na construção.
- [ ] Protegi collections e arrays.
- [ ] Separei domínio e persistência.

---

## Troubleshooting adicional

### Dois objetos com os mesmos campos parecem iguais

Pergunte se podem representar histórias diferentes. Se sim, provavelmente são Entities.

### O ID só existe depois do insert

Considere gerar UUID antes da persistência.

### O código legível muda

Não o use como identidade estável.

### O record aceita estado inválido

Adicione construtor compacto com validação.

### A Entity desaparece do `HashSet`

Remova campos mutáveis de `equals` e `hashCode`.

### Um Value Object contém lista mutável

Use cópia defensiva e coleção não modificável.

### O mapper precisa ignorar uma invariante

Trate como falha de qualidade de dados.

### Existem Value Objects demais

Revise se cada um protege significado, regra ou segurança de tipo.

### JPA exige alterações no domínio

Use mapeamento externo antes de contaminar o modelo.

### O laboratório começou a definir Aggregate Root

Preserve esse aprofundamento para a aula 625.

---

## Perguntas de revisão

1. O que é Entity?
2. O que é Value Object?
3. O que define a igualdade de uma Entity?
4. O que define a igualdade de um Value Object?
5. O que é identidade natural?
6. O que é identidade surrogate?
7. Por que identidade deve ser imutável?
8. Por que não usar estado mutável no `hashCode`?
9. O que é lifecycle?
10. O que é rehydration?
11. O que é primitive obsession?
12. Quando criar um Value Object?
13. Por que records precisam de validação?
14. O que é normalização?
15. O que é defensive copy?
16. Para que serve snapshot?
17. Por que separar persistence record?
18. Por que evitar serializar Entity?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Objeto com identidade contínua.
2. Objeto definido por valor.
3. Identidade estável.
4. Valores significativos.
5. Identidade já existente no domínio.
6. Identidade criada pelo sistema.
7. Preservar continuidade e coleções.
8. O hash mudaria após alteração.
9. Sequência de estados da Entity.
10. Reconstrução de estado persistido.
11. Uso excessivo de primitives para conceitos.
12. Quando existe significado, regra ou risco.
13. Record não garante validade.
14. Conversão para representação canônica.
15. Cópia que impede mutação indireta.
16. Representar estado imutável observado.
17. Evitar persistência definindo o domínio.
18. Não expor internals como contrato.
19. Aggregate Aggregate Root.
20. Aggregate Aggregate Root.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 624 - M19.14 - Entity Value Object revisitados

- Revisitei os critérios de Entity e Value Object.
- Refinei o modelo `service-scheduling-model-refinement`.
- Justifiquei `Appointment` como Entity.
- Justifiquei `AppointmentWindow` como Value Object.
- Criei `AppointmentId` e `ServiceRequestId` como tipos distintos.
- Comparei natural key e surrogate key.
- Mantive identidade estável antes da persistência.
- Separei criação de rehydration.
- Implementei igualdade de Entity por ID.
- Removi estado mutável de `equals` e `hashCode`.
- Testei comportamento da Entity em `HashSet`.
- Criei Value Objects imutáveis e validados.
- Normalizei `ServiceAreaCode` com locale explícito.
- Modelei motivos distintos com tipos distintos.
- Protegi collections e arrays com defensive copy.
- Revisei primitive obsession sem criar wrappers vazios.
- Criei snapshot imutável.
- Separei persistence record e domain model.
- Bloqueei Spring, JPA e Jackson no domínio.
- Criei reports, gate e evidence.
- Não antecipei Aggregate/Aggregate Root ou Repository em DDD.
- Próxima aula: Aggregate Aggregate Root.
```

---

## Referência técnica curta

- Entity identity.
- Natural and surrogate identity.
- Entity equality.
- Value Objects.
- Value equality.
- Immutability.
- Normalization.
- Defensive copying.
- Primitive obsession.
- Rehydration.

Regra final:

```text
Entity e Value Object precisam ser escolhidos pelo significado do domínio, não pela forma da classe: uma Entity possui identidade estável, continuidade e ciclo de vida, pode mudar estado por comportamento controlado e usa somente sua identidade imutável em `equals` e `hashCode`, enquanto um Value Object é definido por seus valores, nasce válido, é imutável, possui igualdade estrutural, normalização explícita e comportamento próximo ao conceito; IDs semanticamente diferentes usam tipos diferentes, identidade é preferencialmente criada antes da persistência, natural keys instáveis não substituem surrogate IDs, records validam invariantes, collections e arrays usam defensive copies e primitive obsession é removida apenas quando há regra, ambiguidade ou segurança de tipo; snapshots representam leituras imutáveis, persistence records e mappers ficam fora do domínio, rehydration preserva invariantes e Entities não são serializadas diretamente; o gate termina com identidade, lifecycle, igualdade, imutabilidade, normalização, defensive copies, primitive review, mapping, testes, arquitetura, documentação e evidence aprovados, enquanto Aggregate e Aggregate Root são aprofundados somente na aula 625 e Repository em DDD permanece reservado à aula 626.
```
