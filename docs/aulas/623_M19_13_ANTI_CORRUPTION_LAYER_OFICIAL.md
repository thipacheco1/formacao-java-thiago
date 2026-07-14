# 623 - M19.13 - Anti Corruption Layer

## Apresentação da aula

Na aula 622, você construiu um Context Map para o domínio de agendamento de serviços.

O mapa deixou explícito que o:

```text
Field Execution Context
```

precisa se integrar com uma plataforma legada chamada:

```text
Legacy Workforce Platform.
```

Essa plataforma utiliza uma linguagem diferente.

Exemplos de termos externos:

```text
JOB;

SLOT_CODE;

TECH_STATE;

FAIL_REASON;

WORK_ORDER_STATUS;

ROUTE_FLAG.
```

Dentro do contexto de execução em campo, a linguagem aprovada é:

```text
Field Activity;

Arrival Window;

Technician Assignment;

Execution Status;

Execution Impediment;

Completion Result.
```

Se o contexto interno importar diretamente os tipos e significados do sistema legado, surgem classes como:

```text
LegacyJobEntity;

TechStateEnum;

FailReasonCode;

SlotCode;

WorkOrderStatus.
```

O modelo interno passa a pensar com a linguagem do fornecedor.

Essa invasão não acontece apenas por nomes.

Ela pode ocorrer por:

- regras implícitas;
- códigos numéricos;
- valores nulos com significado escondido;
- datas em formatos específicos;
- campos reutilizados;
- status incompatíveis;
- erros técnicos;
- convenções de identificador;
- endpoints instáveis;
- payloads gigantes;
- relações de dados que não existem no domínio interno.

A pergunta central desta aula será:

```text
como integrar
um modelo externo ou legado

sem permitir que
sua linguagem,
suas estruturas
e suas limitações

corrompam
o modelo interno?
```

A resposta será implementada com:

```text
Anti Corruption Layer.
```

A ACL será uma camada de tradução e proteção entre:

```text
Legacy Workforce Platform
```

e:

```text
Field Execution Context.
```

Ela irá transformar:

```text
LegacyJobResponse
```

em:

```text
FieldActivitySnapshot.
```

Também irá transformar:

```text
FieldExecutionReport
```

em:

```text
LegacyCompletionRequest.
```

A ACL não será apenas um mapper de campos. Ela traduzirá linguagem, códigos, datas, erros, identificadores e versões, registrando perdas e impedindo vazamentos.

O laboratório será:

```text
labs/m19/aula-623-anti-corruption-layer/legacy-workforce-acl
```

Você irá construir uma integração sintética entre:

```text
Field Execution
```

e:

```text
Legacy Workforce.
```

O fluxo de entrada será:

```text
Legacy Workforce
    |
    v
Legacy client
    |
    v
ACL translator
    |
    v
FieldExecutionGateway
    |
    v
Field Execution model.
```

O fluxo de saída será:

```text
Field Execution model
    |
    v
LegacyWorkforceBoundary
    |
    v
ACL translator
    |
    v
Legacy completion payload
    |
    v
Legacy Workforce.
```

A próxima aula oficial será:

```text
624 - M19.14 - Entity Value Object revisitados
```

Por isso, esta aula não irá aprofundar novamente critérios de identidade, igualdade e imutabilidade.

Alguns tipos internos serão usados como Entities ou Value Objects já conhecidos, mas a revisão completa desses padrões ficará para a aula 624.

A aula 625 será:

```text
625 - M19.15 - Aggregate Aggregate Root
```

Nenhum aprofundamento dedicado de Aggregate será antecipado.

Também não serão implementados:

- Kafka;
- mensageria real;
- banco real;
- retries distribuídos completos;
- circuit breaker real;
- saga;
- Event Sourcing;
- microservice;
- autenticação corporativa;
- payloads reais;
- dados reais de cliente.

A regra central será:

```text
a ACL deve traduzir
o modelo externo

para a linguagem interna

sem transportar
códigos,
tipos,
erros
ou decisões externas
para dentro do domínio.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
621:
Bounded Context.

622:
Context Map.

623:
Anti Corruption Layer.

624:
Entity Value Object revisitados.

625:
Aggregate Aggregate Root.
```

A progressão é:

```text
proteger uma fronteira;

mapear relações;

traduzir modelos externos;

revisar identidade e valor;

aprofundar consistência do Aggregate.
```

Nesta aula:

```text
ACL:
sim.

tradução de entrada:
sim.

tradução de saída:
sim.

normalização:
sim.

mapeamento de status:
sim.

mapeamento de erros:
sim.

versionamento externo:
sim.

quarentena de dados:
sim.

contratos de tradução:
sim.

testes de compatibilidade:
sim.

observabilidade:
sim.

revisão profunda de Entity:
não.

revisão profunda de Value Object:
não.

Aggregate dedicado:
não.
```

O laboratório usará Java 21, Maven, JUnit 5 e ArchUnit, com Spring apenas na composição externa.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-623-anti-corruption-layer/legacy-workforce-acl
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/workforceacl
│   │           ├── fieldexecution
│   │           │   ├── api
│   │           │   │   ├── FieldExecutionGateway.java
│   │           │   │   ├── FieldActivityReference.java
│   │           │   │   ├── FieldActivitySnapshot.java
│   │           │   │   ├── FieldExecutionReport.java
│   │           │   │   ├── ArrivalWindow.java
│   │           │   │   ├── ExecutionStatus.java
│   │           │   │   ├── ExecutionImpediment.java
│   │           │   │   └── CompletionResult.java
│   │           │   └── internal
│   │           │       └── FieldExecutionService.java
│   │           ├── legacy
│   │           │   ├── client
│   │           │   │   ├── LegacyWorkforceClient.java
│   │           │   │   └── FakeLegacyWorkforceClient.java
│   │           │   ├── contract
│   │           │   │   ├── LegacyJobResponse.java
│   │           │   │   ├── LegacyCompletionRequest.java
│   │           │   │   ├── LegacyErrorResponse.java
│   │           │   │   └── LegacyApiVersion.java
│   │           │   └── exception
│   │           │       ├── LegacyTimeoutException.java
│   │           │       ├── LegacyUnavailableException.java
│   │           │       └── LegacyContractException.java
│   │           ├── acl
│   │           │   ├── LegacyWorkforceAntiCorruptionLayer.java
│   │           │   ├── LegacyJobTranslator.java
│   │           │   ├── LegacyCompletionTranslator.java
│   │           │   ├── LegacyStatusTranslator.java
│   │           │   ├── LegacyErrorTranslator.java
│   │           │   ├── LegacyDateTimeTranslator.java
│   │           │   ├── LegacyIdentifierTranslator.java
│   │           │   ├── LegacyContractValidator.java
│   │           │   ├── TranslationResult.java
│   │           │   ├── TranslationWarning.java
│   │           │   └── QuarantinedLegacyRecord.java
│   │           └── configuration
│   │               └── WorkforceAclConfiguration.java
│   └── test
│       └── java
│           └── br/com/formacao/workforceacl
│               ├── acl
│               │   ├── LegacyJobTranslatorTest.java
│               │   ├── LegacyCompletionTranslatorTest.java
│               │   ├── LegacyStatusTranslatorTest.java
│               │   ├── LegacyErrorTranslatorTest.java
│               │   ├── LegacyContractValidatorTest.java
│               │   └── LegacyWorkforceAntiCorruptionLayerTest.java
│               ├── compatibility
│               │   ├── LegacyV1CompatibilityTest.java
│               │   └── LegacyV2CompatibilityTest.java
│               ├── architecture
│               │   ├── AclBoundaryTest.java
│               │   ├── LegacyTypeLeakTest.java
│               │   └── FieldExecutionIndependenceTest.java
│               └── integration
│                   └── WorkforceAclFlowTest.java
├── acl
│   ├── ACL_CHARTER.md
│   ├── EXTERNAL_LANGUAGE.md
│   ├── INTERNAL_LANGUAGE.md
│   ├── TRANSLATION_MATRIX.md
│   ├── STATUS_MAPPING.md
│   ├── ERROR_MAPPING.md
│   ├── IDENTIFIER_MAPPING.md
│   ├── DATE_TIME_MAPPING.md
│   ├── INFORMATION_LOSS.md
│   ├── QUARANTINE_POLICY.md
│   ├── VERSION_COMPATIBILITY.md
│   ├── OBSERVABILITY.md
│   ├── CHANGE_POLICY.md
│   └── OPEN_TRANSLATION_QUESTIONS.md
├── contracts
│   ├── anti-corruption-layer-contract.yaml
│   ├── inbound-translation-policy.yaml
│   ├── outbound-translation-policy.yaml
│   ├── status-translation-policy.yaml
│   ├── error-translation-policy.yaml
│   ├── identifier-translation-policy.yaml
│   ├── date-time-translation-policy.yaml
│   ├── information-loss-policy.yaml
│   ├── quarantine-policy.yaml
│   ├── compatibility-policy.yaml
│   ├── observability-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
└── reports
    ├── inbound-translation-report.yaml
    ├── outbound-translation-report.yaml
    ├── status-mapping-report.yaml
    ├── error-mapping-report.yaml
    ├── compatibility-report.yaml
    ├── quarantine-report.yaml
    ├── leak-detection-report.yaml
    └── anti-corruption-layer-gate-report.yaml
```

Scripts:

```text
scripts/m19/legacy-workforce-acl
├── validate-anti-corruption-layer-contract.ps1
├── validate-inbound-translations.ps1
├── validate-outbound-translations.ps1
├── validate-status-mappings.ps1
├── validate-error-mappings.ps1
├── validate-identifier-mappings.ps1
├── validate-date-time-mappings.ps1
├── validate-information-loss.ps1
├── validate-quarantine-policy.ps1
├── validate-version-compatibility.ps1
├── validate-legacy-type-leaks.ps1
├── run-acl-tests.ps1
├── collect-acl-evidence.ps1
└── verify-acl-gate.ps1
```

Ao final, o contexto interno dependerá apenas de seus próprios contratos.

---

## Conceito essencial

### Anti Corruption Layer

Camada que traduz e isola um modelo externo para proteger o modelo interno.

---

### External Model

Linguagem, estruturas, regras e contratos pertencentes ao sistema integrado.

---

### Internal Model

Linguagem e regras pertencentes ao Bounded Context protegido.

---

### Inbound Translation

Conversão de dados externos para conceitos internos.

---

### Outbound Translation

Conversão de intenções internas para contratos externos.

---

### Semantic Translation

Tradução de significado, não apenas de formato.

---

### Structural Mapping

Conversão entre estruturas de dados.

---

### Status Mapping

Conversão controlada entre máquinas de estado diferentes.

---

### Error Translation

Conversão de erros externos em erros compreensíveis pelo contexto interno.

---

### Information Loss

Perda consciente ou inevitável de informação durante a tradução.

---

### Quarantine

Isolamento de registros externos inválidos ou impossíveis de traduzir.

---

### Compatibility Adapter

Implementação capaz de suportar versões diferentes do contrato externo.

---

### Legacy Type Leak

Vazamento de um tipo, nome ou regra externa para dentro do modelo protegido.

---

### Translation Warning

Aviso registrado quando a tradução é possível, mas possui limitação.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-623-anti-corruption-layer/legacy-workforce-acl

Set-Location `
  labs/m19/aula-623-anti-corruption-layer/legacy-workforce-acl
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/anti-corruption-layer-contract.yaml
```

Conteúdo:

```yaml
antiCorruptionLayer:
  protectedContext:
    Field-Execution

  externalSystem:
    Legacy-Workforce

  required:
    - inbound-translation
    - outbound-translation
    - semantic-mapping
    - status-mapping
    - error-mapping
    - identifier-mapping
    - date-time-mapping
    - contract-validation
    - information-loss-record
    - quarantine
    - version-compatibility
    - observability
    - leak-tests

  forbidden:
    - legacy-type-inside-field-execution
    - legacy-status-inside-domain
    - raw-legacy-error
    - silent-information-loss
    - unsupported-record-accepted
    - business-rule-duplication

  nextLesson:
    code:
      M19.14
```

---

### 3. Criar ACL Charter

Arquivo:

```text
acl/ACL_CHARTER.md
```

Conteúdo:

```markdown
# ACL Charter

## Contexto protegido

Field Execution.

## Sistema externo

Legacy Workforce Platform.

## Objetivo

Traduzir atividades,
status,
janelas,
impedimentos,
identificadores
e resultados

sem permitir que
o modelo legado
invada o contexto interno.

## Responsabilidades

- validar contrato externo;
- traduzir entrada;
- traduzir saída;
- converter erros;
- registrar warnings;
- colocar dados inválidos em quarentena;
- suportar versões aprovadas.

## Fora de escopo

- decidir regra de execução;
- alterar modelo legado;
- persistir Aggregate;
- controlar retry distribuído;
- coordenar saga.
```

---

### 4. Inventariar linguagem externa

Arquivo:

```text
acl/EXTERNAL_LANGUAGE.md
```

Exemplo:

```text
JOB:
registro operacional genérico.

SLOT_CODE:
código textual de faixa horária.

TECH_STATE:
estado técnico numérico.

FAIL_REASON:
código de falha.

DONE_FLAG:
marcador de conclusão.

ROUTE_FLAG:
indica roteirização externa.
```

Não tente melhorar esses nomes dentro do contrato legado.

A ACL deve conhecê-los porque precisa traduzi-los.

---

### 5. Inventariar linguagem interna

Arquivo:

```text
acl/INTERNAL_LANGUAGE.md
```

Termos aprovados:

```text
Field Activity;

Arrival Window;

Technician Assignment;

Execution Status;

Execution Impediment;

Completion Result;

Field Activity Reference.
```

O modelo interno não possui:

```text
TECH_STATE;

FAIL_REASON;

SLOT_CODE.
```

---

### 6. Criar contrato externo sintético

```java
public record LegacyJobResponse(
        String jobId,
        String slotCode,
        Integer techState,
        String failReason,
        String scheduledDate,
        String customerReference,
        String routeFlag,
        Integer contractVersion) {
}
```

Esse tipo permanece em:

```text
legacy.contract.
```

Ele não pode aparecer em:

```text
fieldexecution.
```

---

### 7. Criar modelo interno

```java
public record FieldActivitySnapshot(
        FieldActivityReference reference,
        ArrivalWindow arrivalWindow,
        ExecutionStatus status,
        Optional<ExecutionImpediment> impediment) {
}
```

A linguagem interna é pequena e intencional.

Dados externos não necessários são descartados conscientemente.

---

### 8. Criar gateway interno

```java
public interface FieldExecutionGateway {

    FieldActivitySnapshot load(
            FieldActivityReference reference);

    void report(
            FieldExecutionReport report);
}
```

O contexto interno depende desse contrato.

Ele não depende do client legado.

---

### 9. Criar inbound policy

Arquivo:

```text
contracts/inbound-translation-policy.yaml
```

Conteúdo:

```yaml
inboundTranslation:
  source:
    legacy-contract

  target:
    field-execution-model

  required:
    - contract-validation
    - semantic-translation
    - status-translation
    - identifier-translation
    - date-time-translation
    - warning-collection

  forbidden:
    - raw-field-copy-without-meaning
    - null-as-valid-default
    - unknown-status-as-active
    - legacy-type-return
```

---

### 10. Criar matriz de tradução

Arquivo:

```text
acl/TRANSLATION_MATRIX.md
```

Exemplo:

```text
Legacy field
| Internal concept
| Rule
| Loss
| Failure

jobId
| FieldActivityReference
| prefixo e formato validados
| none
| quarantine

slotCode
| ArrivalWindow
| interpretar catálogo de faixa
| original code omitted
| unsupported slot

techState
| ExecutionStatus
| tabela versionada
| none
| unknown state

failReason
| ExecutionImpediment
| mapear código e descrição
| external detail omitted
| warning or quarantine
```

---

### 11. Criar tradutor de identificador

```java
public final class LegacyIdentifierTranslator {

    public FieldActivityReference toInternal(
            String legacyJobId) {

        if (legacyJobId == null
                || !legacyJobId.matches(
                        "JOB-[0-9]{8}")) {
            throw new LegacyTranslationException(
                    "Invalid legacy job identifier");
        }

        return new FieldActivityReference(
                legacyJobId.substring(4));
    }

    public String toLegacy(
            FieldActivityReference reference) {

        return "JOB-" + reference.value();
    }
}
```

O contexto interno não precisa conhecer o prefixo.

---

### 12. Criar identifier policy

Arquivo:

```text
contracts/identifier-translation-policy.yaml
```

Conteúdo:

```yaml
identifierTranslation:
  legacyFormat:
    validated:
      required

  internalIdentity:
    stable:
      required

  prefix:
    internalExposure:
      forbidden

  invalidIdentifier:
    action:
      QUARANTINE

  reversible:
    requiredWhenOutboundUsesSameIdentifier
```

---

### 13. Criar tradutor de data e hora

O legado envia:

```text
20260714;
AM;
```

ou:

```text
2026-07-14 08:00:00.
```

A ACL converte para:

```text
Instant;
ZoneId;
ArrivalWindow.
```

Exemplo:

```java
public final class LegacyDateTimeTranslator {

    private final ZoneId legacyZone;

    public ArrivalWindow toArrivalWindow(
            String date,
            String slotCode) {

        LocalDate localDate =
                LocalDate.parse(
                        date,
                        DateTimeFormatter.BASIC_ISO_DATE);

        return switch (slotCode) {
            case "AM" ->
                    window(
                            localDate,
                            LocalTime.of(8, 0),
                            LocalTime.of(12, 0));

            case "PM" ->
                    window(
                            localDate,
                            LocalTime.of(13, 0),
                            LocalTime.of(18, 0));

            default ->
                    throw new LegacyTranslationException(
                            "Unsupported slot code");
        };
    }
}
```

---

### 14. Criar date-time policy

Arquivo:

```text
contracts/date-time-translation-policy.yaml
```

Conteúdo:

```yaml
dateTimeTranslation:
  legacyZone:
    explicit:
      required

  format:
    explicit:
      required

  daylightSaving:
    test:
      required

  ambiguousLocalTime:
    action:
      REJECT

  unsupportedSlot:
    action:
      QUARANTINE

  systemDefaultZone:
    forbidden
```

---

### 15. Criar mapeamento de status

Arquivo:

```text
acl/STATUS_MAPPING.md
```

Tabela inicial:

```text
Legacy TECH_STATE
| Internal ExecutionStatus

10
| CREATED

20
| ASSIGNED

30
| IN_PROGRESS

40
| COMPLETED

50
| BLOCKED

90
| CANCELLED
```

Estado desconhecido não deve virar:

```text
CREATED
```

por padrão.

---

### 16. Criar tradutor de status

```java
public final class LegacyStatusTranslator {

    public ExecutionStatus toInternal(
            Integer techState) {

        if (techState == null) {
            throw new LegacyTranslationException(
                    "Legacy tech state is required");
        }

        return switch (techState) {
            case 10 -> ExecutionStatus.CREATED;
            case 20 -> ExecutionStatus.ASSIGNED;
            case 30 -> ExecutionStatus.IN_PROGRESS;
            case 40 -> ExecutionStatus.COMPLETED;
            case 50 -> ExecutionStatus.BLOCKED;
            case 90 -> ExecutionStatus.CANCELLED;
            default ->
                    throw new UnsupportedLegacyStatus(
                            techState);
        };
    }
}
```

---

### 17. Criar status policy

Arquivo:

```text
contracts/status-translation-policy.yaml
```

Conteúdo:

```yaml
statusTranslation:
  mapping:
    versioned:
      required

  unknownStatus:
    action:
      QUARANTINE

  defaultStatus:
    forbidden

  manyToOne:
    informationLoss:
      mustBeRecorded:
        true

  internalStatusToLegacy:
    explicit:
      required
```

---

### 18. Mapear impedimentos

Exemplo:

```text
FAIL_REASON 07
-> CUSTOMER_UNAVAILABLE.

FAIL_REASON 21
-> ACCESS_RESTRICTED.

FAIL_REASON 32
-> MISSING_MATERIAL.

FAIL_REASON 90
-> UNKNOWN_OPERATIONAL_IMPEDIMENT.
```

Se dois códigos externos viram um único conceito interno, registre perda de informação.

---

### 19. Criar information loss

Arquivo:

```text
acl/INFORMATION_LOSS.md
```

Exemplo:

```markdown
## LOSS-001

Origem:
FAIL_REASON 91 e 92.

Destino:
UNKNOWN_OPERATIONAL_IMPEDIMENT.

Motivo:
O contexto interno não diferencia
as duas causas.

Impacto:
Relatório detalhado permanece
somente no legado.

Decisão:
Preservar código original
apenas em metadata da ACL,
não no domínio.

Owner:
Field Execution Product.
```

---

### 20. Criar loss policy

Arquivo:

```text
contracts/information-loss-policy.yaml
```

Conteúdo:

```yaml
informationLoss:
  allowed:
    onlyWhenDocumented:
      true

  requires:
    - source-data
    - target-concept
    - reason
    - impact
    - owner

  silentLoss:
    forbidden

  legacyMetadataInsideDomain:
    forbidden

  auditMetadataInsideAcl:
    allowed
```

---

### 21. Criar tradutor de job

```java
public final class LegacyJobTranslator {

    private final LegacyIdentifierTranslator ids;
    private final LegacyDateTimeTranslator dates;
    private final LegacyStatusTranslator statuses;
    private final LegacyImpedimentTranslator impediments;

    public TranslationResult<FieldActivitySnapshot> translate(
            LegacyJobResponse source) {

        List<TranslationWarning> warnings =
                new ArrayList<>();

        FieldActivitySnapshot snapshot =
                new FieldActivitySnapshot(
                        ids.toInternal(source.jobId()),
                        dates.toArrivalWindow(
                                source.scheduledDate(),
                                source.slotCode()),
                        statuses.toInternal(
                                source.techState()),
                        impediments.translate(
                                source.failReason(),
                                warnings));

        return new TranslationResult<>(
                snapshot,
                List.copyOf(warnings));
    }
}
```

---

### 22. Criar TranslationResult

```java
public record TranslationResult<T>(
        T value,
        List<TranslationWarning> warnings) {

    public TranslationResult {
        Objects.requireNonNull(value);
        warnings = List.copyOf(warnings);
    }
}
```

Warnings não tornam a tradução inválida.

Eles tornam limitações visíveis.

---

### 23. Criar contrato validator

```java
public final class LegacyContractValidator {

    public void validate(
            LegacyJobResponse source) {

        if (source == null) {
            throw new LegacyContractException(
                    "Legacy response is required");
        }

        if (source.contractVersion() == null) {
            throw new LegacyContractException(
                    "Legacy contract version is required");
        }

        if (source.contractVersion() < 1
                || source.contractVersion() > 2) {
            throw new UnsupportedLegacyVersion(
                    source.contractVersion());
        }
    }
}
```

---

### 24. Criar quarentena

Registros impossíveis de traduzir não devem ser aceitos silenciosamente.

```java
public record QuarantinedLegacyRecord(
        String externalReference,
        String reasonCode,
        String safeDescription,
        Instant quarantinedAt,
        int contractVersion) {
}
```

Não armazene payload sensível completo.

---

### 25. Criar quarantine policy

Arquivo:

```text
contracts/quarantine-policy.yaml
```

Conteúdo:

```yaml
quarantine:
  usedFor:
    - invalid-identifier
    - unknown-status
    - unsupported-version
    - impossible-date
    - missing-required-field

  record:
    allowed:
      - external-reference
      - reason-code
      - safe-description
      - timestamp
      - contract-version

  rawSensitivePayload:
    forbidden

  retry:
    onlyAfterCorrection:
      true

  owner:
    required
```

---

### 26. Criar fluxo de entrada da ACL

```java
public final class LegacyWorkforceAntiCorruptionLayer
        implements FieldExecutionGateway {

    private final LegacyWorkforceClient client;
    private final LegacyContractValidator validator;
    private final LegacyJobTranslator jobTranslator;
    private final LegacyCompletionTranslator completionTranslator;
    private final LegacyErrorTranslator errorTranslator;
    private final QuarantineStore quarantine;

    @Override
    public FieldActivitySnapshot load(
            FieldActivityReference reference) {

        try {
            LegacyJobResponse response =
                    client.loadJob(
                            reference.value());

            validator.validate(response);

            TranslationResult<FieldActivitySnapshot> result =
                    jobTranslator.translate(response);

            recordWarnings(result.warnings());

            return result.value();

        } catch (LegacyContractException exception) {
            quarantine.store(
                    quarantineFrom(
                            reference,
                            exception));

            throw new FieldExecutionIntegrationException(
                    "External activity could not be translated",
                    exception);

        } catch (RuntimeException exception) {
            throw errorTranslator.translate(exception);
        }
    }
}
```

---

### 27. Criar outbound policy

Arquivo:

```text
contracts/outbound-translation-policy.yaml
```

Conteúdo:

```yaml
outboundTranslation:
  source:
    field-execution-model

  target:
    legacy-contract

  required:
    - explicit-status-mapping
    - identifier-mapping
    - date-time-format
    - mandatory-field-validation
    - contract-version

  forbidden:
    - domain-object-serialization
    - internal-enum-name-as-external-code
    - missing-required-legacy-field
    - raw-domain-exception
```

---

### 28. Criar completion translator

```java
public final class LegacyCompletionTranslator {

    private final LegacyIdentifierTranslator ids;
    private final LegacyCompletionStatusTranslator statuses;
    private final DateTimeFormatter formatter;

    public LegacyCompletionRequest translate(
            FieldExecutionReport report,
            int contractVersion) {

        return new LegacyCompletionRequest(
                ids.toLegacy(
                        report.activityReference()),
                statuses.toLegacy(
                        report.completionResult()),
                formatter.format(
                        report.completedAt()
                                .atZone(
                                        ZoneOffset.UTC)),
                report.impediment()
                        .map(
                                LegacyImpedimentTranslator::toLegacy)
                        .orElse(null),
                contractVersion);
    }
}
```

A ACL constrói o payload externo.

O domínio não conhece seus campos.

---

### 29. Criar mapeamento de erro

Arquivo:

```text
acl/ERROR_MAPPING.md
```

Exemplo:

```text
Legacy timeout
-> FIELD_EXECUTION_EXTERNAL_TIMEOUT.

Legacy HTTP 404
-> FIELD_ACTIVITY_NOT_FOUND_EXTERNALLY.

Legacy version error
-> LEGACY_CONTRACT_UNSUPPORTED.

Legacy invalid payload
-> LEGACY_TRANSLATION_REJECTED.

Legacy unavailable
-> FIELD_EXECUTION_EXTERNAL_UNAVAILABLE.
```

---

### 30. Criar error policy

Arquivo:

```text
contracts/error-translation-policy.yaml
```

Conteúdo:

```yaml
errorTranslation:
  externalTechnicalError:
    internalExposure:
      forbidden

  internalError:
    requires:
      - stable-code
      - safe-message
      - retryable-flag
      - owner

  rawPayload:
    forbidden

  unknownExternalError:
    mappedTo:
      EXTERNAL_INTEGRATION_FAILURE
```

---

### 31. Criar error translator

```java
public final class LegacyErrorTranslator {

    public FieldExecutionIntegrationException translate(
            RuntimeException exception) {

        if (exception instanceof LegacyTimeoutException) {
            return new FieldExecutionIntegrationException(
                    "FIELD_EXECUTION_EXTERNAL_TIMEOUT",
                    true,
                    exception);
        }

        if (exception instanceof LegacyUnavailableException) {
            return new FieldExecutionIntegrationException(
                    "FIELD_EXECUTION_EXTERNAL_UNAVAILABLE",
                    true,
                    exception);
        }

        return new FieldExecutionIntegrationException(
                "EXTERNAL_INTEGRATION_FAILURE",
                false,
                exception);
    }
}
```

---

### 32. Criar compatibilidade de versões

Versão 1:

```text
slotCode:
AM ou PM.

techState:
10, 20, 30, 40, 50, 90.
```

Versão 2:

```text
windowStart;
windowEnd;
executionState textual.
```

A ACL seleciona tradutor por versão.

---

### 33. Criar compatibility policy

Arquivo:

```text
contracts/compatibility-policy.yaml
```

Conteúdo:

```yaml
compatibility:
  supportedVersions:
    - 1
    - 2

  versionDetection:
    explicit:
      required

  unsupportedVersion:
    action:
      QUARANTINE

  translatorPerVersion:
    allowed

  silentFallback:
    forbidden

  removal:
    requires:
      - usage-metrics
      - migration-window
      - owner
      - decision-log
```

---

### 34. Criar strategy por versão

```java
public interface LegacyJobVersionTranslator {

    boolean supports(
            LegacyApiVersion version);

    TranslationResult<FieldActivitySnapshot> translate(
            LegacyJobResponse source);
}
```

Com implementações:

```text
LegacyV1JobTranslator;

LegacyV2JobTranslator.
```

A orquestração escolhe explicitamente.

---

### 35. Criar observabilidade

Arquivo:

```text
acl/OBSERVABILITY.md
```

Registre:

- correlation ID;
- external reference;
- contract version;
- translator version;
- translation outcome;
- warning count;
- quarantine reason;
- latency;
- error code;
- retryable;
- source;
- target.

Não registre payload sensível.

---

### 36. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - correlation-id
    - external-reference
    - contract-version
    - translation-outcome
    - warning-count
    - latency
    - error-code

  rawPayload:
    forbidden

  personalData:
    forbidden

  metric:
    required:
      - translation-success
      - translation-warning
      - translation-failure
      - quarantine-count
      - unsupported-version
```

---

### 37. Criar change policy

Arquivo:

```text
acl/CHANGE_POLICY.md
```

Mudanças externas precisam de:

- diff de contrato;
- atualização da matriz;
- novos testes;
- avaliação de perda;
- compatibilidade;
- owner;
- rollout;
- rollback;
- evidência.

Mudanças internas não devem exigir alteração do legado quando a ACL absorve a diferença.

---

### 38. Criar perguntas abertas

Arquivo:

```text
acl/OPEN_TRANSLATION_QUESTIONS.md
```

Exemplos:

- `TECH_STATE 60` significa pausado ou bloqueado?
- `DONE_FLAG` pode divergir de `TECH_STATE 40`?
- `SLOT_CODE N1` cruza meia-noite?
- o legado aceita conclusão sem impedimento?
- qual timezone é usado por clientes antigos?
- IDs podem ser reutilizados?
- versão 1 será desativada quando?
- warnings precisam bloquear operação?
- qual campo externo é fonte do completion time?

Cada pergunta precisa de owner.

---

### 39. Criar leak test

```java
@ArchTest
static final ArchRule fieldExecutionMustNotDependOnLegacy =
        noClasses()
                .that()
                .resideInAPackage(
                        "..fieldexecution..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..legacy..");
```

---

### 40. Criar ACL boundary test

```java
@ArchTest
static final ArchRule aclMayDependOnBothSides =
        classes()
                .that()
                .resideInAPackage(
                        "..acl..")
                .should()
                .onlyDependOnClassesThat()
                .resideInAnyPackage(
                        "..acl..",
                        "..legacy..",
                        "..fieldexecution.api..",
                        "java..");
```

A ACL é a área autorizada a conhecer os dois modelos.

---

### 41. Criar test de tradução de status

```java
@Test
void shouldTranslateLegacyBlockedState() {

    ExecutionStatus result =
            translator.toInternal(50);

    assertEquals(
            ExecutionStatus.BLOCKED,
            result);
}
```

Teste também estado desconhecido.

---

### 42. Criar test de janela

Cenários:

- AM;
- PM;
- data inválida;
- slot desconhecido;
- timezone;
- mudança de horário;
- janela invertida.

---

### 43. Criar test de identificador

Valide:

- prefixo correto;
- tamanho;
- reversibilidade;
- ID inválido;
- null;
- whitespace;
- zeros à esquerda.

---

### 44. Criar test de warning

Exemplo:

```text
FAIL_REASON 91
```

pode ser traduzido para impedimento genérico com warning.

Confirme:

- tradução válida;
- warning registrado;
- código original não entra no domínio;
- métrica incrementada.

---

### 45. Criar test de quarentena

Cenário:

```text
TECH_STATE 999.
```

Confirme:

- registro não é entregue ao contexto;
- quarentena possui referência;
- payload bruto não é armazenado;
- erro interno é estável;
- métrica é registrada.

---

### 46. Criar test de saída

Valide:

- `FieldExecutionReport`;
- código externo;
- data formatada;
- versão;
- motivo;
- campo obrigatório;
- ausência de Entity interna no payload.

---

### 47. Criar compatibility tests

`LegacyV1CompatibilityTest` valida:

- AM/PM;
- status numérico;
- ID com prefixo.

`LegacyV2CompatibilityTest` valida:

- datas completas;
- status textual;
- novos campos opcionais.

O comportamento interno deve permanecer equivalente.

---

### 48. Criar integration flow test

Fluxo:

```text
fake legacy client
retorna job V1;

ACL valida;

ACL traduz;

Field Execution recebe snapshot;

Field Execution cria report;

ACL traduz saída;

fake client recebe completion request.
```

Nenhum tipo legado aparece no service interno.

---

### 49. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unknownStatusAccepted:
    action:
      FAIL

  systemDefaultTimezone:
    action:
      FAIL

  silentInformationLoss:
    action:
      FAIL

  rawLegacyError:
    action:
      FAIL

  legacyTypeLeak:
    action:
      FAIL

  unsupportedVersionFallback:
    action:
      FAIL

  quarantineWithRawPayload:
    action:
      FAIL
```

---

### 50. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidLegacyContract:
    action:
      QUARANTINE

  unsupportedVersion:
    action:
      QUARANTINE

  timeout:
    action:
      TRANSLATE_RETRYABLE

  unavailable:
    action:
      TRANSLATE_RETRYABLE

  unknownTechnicalFailure:
    action:
      TRANSLATE_NON_RETRYABLE

  EntityValueObjectRevisit:
    deferredToLesson624

  AggregateRootDeepDive:
    deferredToLesson625
```

---

### 51. Validar inbound

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-inbound-translations.ps1
```

Confirme:

- contrato validado;
- termos traduzidos;
- status explícito;
- IDs validados;
- datas normalizadas;
- warnings registrados;
- zero tipo legado retornado.

---

### 52. Validar outbound

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-outbound-translations.ps1
```

Confirme:

- modelo interno convertido;
- campos obrigatórios;
- códigos explícitos;
- versão;
- datas;
- erros;
- zero serialização direta do domínio.

---

### 53. Validar status

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-status-mappings.ps1
```

Procure:

- código sem mapeamento;
- default;
- many-to-one sem loss record;
- internal status sem código externo;
- diferença entre versões.

---

### 54. Validar erros

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-error-mappings.ps1
```

Confirme:

- código interno;
- mensagem segura;
- retryable;
- owner;
- sem stack externa pública;
- sem payload.

---

### 55. Validar perdas

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-information-loss.ps1
```

Toda perda precisa de:

- fonte;
- destino;
- motivo;
- impacto;
- owner;
- decisão.

---

### 56. Validar quarentena

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-quarantine-policy.ps1
```

Confirme:

- reason code;
- referência;
- versão;
- timestamp;
- zero dado sensível;
- retry somente após correção.

---

### 57. Validar compatibilidade

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-version-compatibility.ps1
```

Confirme:

- V1;
- V2;
- seleção explícita;
- versão desconhecida;
- métricas;
- plano de remoção.

---

### 58. Validar leaks

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\validate-legacy-type-leaks.ps1
```

Procure em `fieldexecution`:

```text
Legacy;

JOB;

SLOT_CODE;

TECH_STATE;

FAIL_REASON;

LegacyJobResponse;

LegacyCompletionRequest.
```

Nenhum termo pode aparecer.

---

### 59. Executar testes

Execute:

```powershell
.\scripts\m19\legacy-workforce-acl\run-acl-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- tradução de entrada;
- tradução de saída;
- status;
- erros;
- identificadores;
- datas;
- warnings;
- quarentena;
- versões;
- arquitetura;
- fluxo completo.

---

### 60. Criar reports

Exemplo:

```yaml
inboundTranslation:
  supportedVersions:
    - 1
    - 2

  translatedRecords:
    18

  warnings:
    2

  quarantined:
    1

  legacyTypeLeaks:
    0

  result:
    PASS_WITH_WARNINGS
```

---

### 61. Criar gate

O gate valida:

```text
ACL charter;

external language;

internal language;

inbound translation;

outbound translation;

status mapping;

error mapping;

identifier mapping;

date-time mapping;

information loss;

warnings;

quarantine;

version compatibility;

observability;

type leaks;

tests;

documentation;

evidence.
```

Status:

```text
PASS;

PASS_WITH_WARNINGS;

FAIL_INBOUND_TRANSLATION;

FAIL_OUTBOUND_TRANSLATION;

FAIL_STATUS_MAPPING;

FAIL_ERROR_MAPPING;

FAIL_IDENTIFIER_MAPPING;

FAIL_DATE_TIME_MAPPING;

FAIL_INFORMATION_LOSS;

FAIL_QUARANTINE;

FAIL_COMPATIBILITY;

FAIL_LEGACY_TYPE_LEAK;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 62. Coletar evidence

Arquivo:

```text
contracts/anti-corruption-layer-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- protected context;
- external system;
- supported versions;
- inbound translation status;
- outbound translation status;
- status mapping status;
- error mapping status;
- identifier mapping status;
- date-time mapping status;
- information loss count;
- warning count;
- quarantine count;
- compatibility status;
- leak status;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- payload bruto;
- credenciais;
- nomes reais;
- endpoints reais;
- Entity/Value Object revisitados;
- Aggregate Root aprofundado.

---

### 63. Executar validação completa

```powershell
.\scripts\m19\legacy-workforce-acl\validate-anti-corruption-layer-contract.ps1

.\scripts\m19\legacy-workforce-acl\validate-inbound-translations.ps1

.\scripts\m19\legacy-workforce-acl\validate-outbound-translations.ps1

.\scripts\m19\legacy-workforce-acl\validate-status-mappings.ps1

.\scripts\m19\legacy-workforce-acl\validate-error-mappings.ps1

.\scripts\m19\legacy-workforce-acl\validate-identifier-mappings.ps1

.\scripts\m19\legacy-workforce-acl\validate-date-time-mappings.ps1

.\scripts\m19\legacy-workforce-acl\validate-information-loss.ps1

.\scripts\m19\legacy-workforce-acl\validate-quarantine-policy.ps1

.\scripts\m19\legacy-workforce-acl\validate-version-compatibility.ps1

.\scripts\m19\legacy-workforce-acl\validate-legacy-type-leaks.ps1

.\scripts\m19\legacy-workforce-acl\run-acl-tests.ps1

.\scripts\m19\legacy-workforce-acl\collect-acl-evidence.ps1

.\scripts\m19\legacy-workforce-acl\verify-acl-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 64. Encerrar o laboratório

Confirme:

- modelos separados;
- linguagem externa inventariada;
- linguagem interna protegida;
- traduções explícitas;
- status sem default;
- erros convertidos;
- IDs validados;
- timezone explícito;
- perdas documentadas;
- warnings registrados;
- dados inválidos em quarentena;
- versões suportadas;
- observabilidade sanitizada;
- zero legacy type leak;
- Entity/Value Object não aprofundados;
- Aggregate Root não aprofundado;
- reports sanitizados.

---

## Entendendo o que foi feito

### O modelo interno ganhou proteção

Tipos legados deixaram de atravessar a fronteira.

### A tradução ganhou significado

Campos deixaram de ser copiados mecanicamente.

### Os status ganharam decisão

Códigos externos passaram a ter mapeamento explícito.

### Os erros ganharam linguagem interna

Timeouts e falhas externas deixaram de vazar.

### Os identificadores ganharam adaptação

Prefixos e formatos externos ficaram na ACL.

### Datas e horários ganharam contexto

Formato e timezone deixaram de ser implícitos.

### Perdas ganharam transparência

Informação descartada passou a ser registrada.

### Dados inválidos ganharam quarentena

Registros impossíveis deixaram de corromper o domínio.

### Versões ganharam compatibilidade

Mudanças externas passaram a ter tradutores e testes.

### A arquitetura ganhou teste de vazamento

A ACL tornou-se a única área autorizada a conhecer os dois modelos.

---

## Erros comuns importantes

### Tratar ACL como mapper de campos

Sem tradução semântica, o modelo externo continua invadindo.

### Colocar regra de negócio na ACL

A camada duplica decisões do domínio.

### Usar default para status desconhecido

Dados inválidos viram estados legítimos.

### Expor erro externo

O contexto fica acoplado ao fornecedor.

### Usar timezone do sistema

Resultados mudam conforme o ambiente.

### Ignorar perda de informação

A tradução parece mais precisa do que é.

### Armazenar payload bruto na quarentena

Dados sensíveis podem vazar.

### Aceitar versão desconhecida

O contrato muda silenciosamente.

### Colocar tipos legados no gateway interno

A fronteira desaparece.

### Antecipar Entity e Aggregate

A aula perde o foco na tradução.

---

## Comandos úteis

### Validar entrada

```powershell
.\scripts\m19\legacy-workforce-acl\validate-inbound-translations.ps1
```

### Validar status e erros

```powershell
.\scripts\m19\legacy-workforce-acl\validate-status-mappings.ps1

.\scripts\m19\legacy-workforce-acl\validate-error-mappings.ps1
```

### Validar leaks

```powershell
.\scripts\m19\legacy-workforce-acl\validate-legacy-type-leaks.ps1
```

### Executar testes

```powershell
.\scripts\m19\legacy-workforce-acl\run-acl-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\legacy-workforce-acl\verify-acl-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Linguagens

Inventarie termos externos e internos.

### Parte 2 — Contratos

Crie DTOs externos e modelos internos separados.

### Parte 3 — Entrada

Implemente tradução semântica.

### Parte 4 — Saída

Converta intenções internas para payload legado.

### Parte 5 — Status

Crie tabela versionada sem default.

### Parte 6 — Erros

Traduza falhas para códigos internos.

### Parte 7 — Qualidade

Registre warnings, perdas e quarentena.

### Parte 8 — Versões

Implemente compatibilidade V1 e V2.

### Parte 9 — Arquitetura

Bloqueie legacy type leaks.

### Parte 10 — Gate

Valide tradução, testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 622 e ponte para a aula 624 foram preservadas;
- o laboratório `legacy-workforce-acl` foi criado;
- Field Execution é o contexto protegido;
- Legacy Workforce é o sistema externo;
- ACL Charter define responsabilidades e fora de escopo;
- linguagem externa foi inventariada;
- linguagem interna foi inventariada;
- tipos externos permanecem em `legacy.contract`;
- tipos internos permanecem em `fieldexecution.api`;
- `FieldExecutionGateway` não expõe tipos legados;
- tradução de entrada valida contrato;
- tradução de saída valida campos obrigatórios;
- status mapping é explícito e versionado;
- status desconhecido não usa default;
- identificadores são validados e reversíveis quando necessário;
- prefixos externos não entram no domínio;
- formatos de data são explícitos;
- timezone é explícito;
- horário ambíguo é rejeitado;
- erros externos são convertidos;
- erros públicos possuem código estável;
- perdas de informação são documentadas;
- warnings são registrados;
- registros inválidos entram em quarentena;
- quarentena não armazena payload sensível;
- versões V1 e V2 possuem testes;
- versão desconhecida é rejeitada;
- métricas não contêm dados pessoais;
- architecture tests bloqueiam legacy type leaks;
- ACL é a única área autorizada a conhecer ambos os modelos;
- nenhuma regra central do domínio foi duplicada na ACL;
- Entity/Value Object revisitados não foram antecipados;
- Aggregate Root aprofundado não foi antecipado;
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
  labs/m19/aula-623-anti-corruption-layer/legacy-workforce-acl `
  scripts/m19/legacy-workforce-acl `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|rawLegacyPayload|realEndpoint|JpaRepository|KafkaTemplate|entityValueObjectRevisit|aggregateRootDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar Anti Corruption Layer"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- payloads reais;
- endpoints reais;
- banco real;
- Kafka;
- Entity/Value Object revisitados;
- Aggregate Root aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou uma Anti Corruption Layer.

Você criou:

```text
ACL Charter;

inventário de linguagem externa;

inventário de linguagem interna;

tradução de entrada;

tradução de saída;

mapeamento de status;

mapeamento de erros;

mapeamento de identificadores;

mapeamento de datas;

registro de perdas;

warnings;

quarentena;

compatibilidade V1 e V2;

observabilidade;

architecture tests.
```

Você comprovou que uma ACL não é apenas um mapper; que tradução precisa preservar significado; que status desconhecido não pode receber default; que erros externos precisam ser convertidos; que datas e timezones precisam ser explícitos; que perdas devem ser documentadas; que registros inválidos devem ser isolados; e que somente a ACL pode conhecer os dois modelos.

A próxima aula será:

```text
624 - M19.14 - Entity Value Object revisitados
```

Nela, você irá revisar com maior profundidade identidade, igualdade, ciclo de vida, imutabilidade, validação, comportamento e decisões de modelagem entre Entity e Value Object.

Nenhuma revisão aprofundada de Entity, Value Object, Aggregate ou Aggregate Root foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Separei modelos externo e interno.
- [ ] Criei tradução de entrada.
- [ ] Criei tradução de saída.
- [ ] Mapeei status sem default.
- [ ] Traduzi erros.
- [ ] Normalizei IDs e datas.
- [ ] Registrei warnings e quarentena.
- [ ] Bloqueei legacy type leaks.

---

## Troubleshooting adicional

### Um campo externo não possui equivalente

Registre perda, warning ou rejeição.

### Dois códigos externos viram um status

Documente many-to-one e impacto.

### O domínio precisa do código legado

Reavalie se é requisito real ou vazamento.

### O client lança exception técnica

Converta no `LegacyErrorTranslator`.

### A data muda conforme a máquina

Remova `ZoneId.systemDefault()`.

### A versão nova adiciona campo obrigatório

Crie tradutor específico e teste de compatibilidade.

### Quarentena cresce

Investigue contrato, versão e qualidade da origem.

### Warnings são ignorados

Crie métricas, thresholds e owner.

### O mapper começou a decidir regra de execução

Mova a regra para Field Execution.

### O código começou a revisar igualdade de Entity

Preserve esse aprofundamento para a aula 624.

---

## Perguntas de revisão

1. O que é Anti Corruption Layer?
2. Qual modelo ela protege?
3. O que é tradução semântica?
4. Qual diferença entre mapping e tradução?
5. O que é inbound translation?
6. O que é outbound translation?
7. Por que não usar default de status?
8. O que é information loss?
9. O que é translation warning?
10. O que é quarentena?
11. Por que adaptar identificadores?
12. Por que timezone precisa ser explícito?
13. Por que converter erros externos?
14. O que é compatibility translator?
15. Por que versões desconhecidas são rejeitadas?
16. O que é legacy type leak?
17. Onde tipos legados podem existir?
18. A ACL deve conter regra central?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Camada que traduz e protege modelos.
2. O modelo do Bounded Context interno.
3. Conversão de significado.
4. Mapping copia estrutura; tradução adapta conceito.
5. Externo para interno.
6. Interno para externo.
7. Evitar estado inválido aceito.
8. Informação descartada na tradução.
9. Limitação não bloqueante registrada.
10. Isolamento de dado impossível de traduzir.
11. Esconder formato externo.
12. Evitar comportamento dependente do ambiente.
13. Preservar linguagem e contrato interno.
14. Tradutor específico de versão.
15. Evitar interpretação silenciosa.
16. Tipo externo dentro do modelo protegido.
17. No client, contrato legado e ACL.
18. Não.
19. Entity Value Object revisitados.
20. Entity Value Object revisitados.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 623 - M19.13 - Anti Corruption Layer

- Implementei uma ACL entre Legacy Workforce e Field Execution.
- Criei um ACL Charter.
- Inventariei a linguagem externa e a linguagem interna.
- Separei contratos legados de modelos internos.
- Criei `FieldExecutionGateway` sem tipos externos.
- Implementei tradução de entrada e saída.
- Criei tradutores de status, erros, IDs e datas.
- Mantive timezone explícito.
- Rejeitei status e versões desconhecidas.
- Registrei perdas de informação.
- Criei translation warnings.
- Implementei quarentena sem payload sensível.
- Criei compatibilidade para contratos V1 e V2.
- Criei métricas e campos de observabilidade sanitizados.
- Testei mapeamentos, erros, versões e fluxo completo.
- Usei ArchUnit para bloquear legacy type leaks.
- Mantive regras de negócio fora da ACL.
- Criei reports, gate e evidence.
- Não antecipei Entity/Value Object revisitados ou Aggregate Root aprofundado.
- Próxima aula: Entity Value Object revisitados.
```

---

## Referência técnica curta

- Anti Corruption Layer.
- Semantic Translation.
- Inbound Translation.
- Outbound Translation.
- Status Mapping.
- Error Translation.
- Information Loss.
- Quarantine.
- Compatibility Adapter.
- Legacy Type Leak.

Regra final:

```text
uma Anti Corruption Layer precisa proteger o modelo interno contra linguagem, estruturas, códigos e falhas externas: contratos legados permanecem em `legacy`, modelos de Field Execution permanecem em sua própria API e somente a ACL conhece os dois lados; inbound translation valida contrato, identidade, datas, timezone, status e impedimentos antes de produzir `FieldActivitySnapshot`, outbound translation converte `FieldExecutionReport` em payload externo sem serializar o domínio, códigos desconhecidos não recebem default, erros técnicos viram códigos internos seguros e perdas de informação são documentadas com owner; traduções válidas com limitações produzem warnings, registros impossíveis entram em quarentena sem payload sensível, versões V1 e V2 possuem tradutores e contract tests, versões desconhecidas falham explicitamente e observabilidade registra versão, resultado, warning, latência e erro sem dados pessoais; ArchUnit bloqueia legacy type leaks e a ACL não duplica regras do domínio; o gate termina com entrada, saída, status, erros, IDs, datas, perdas, warnings, quarentena, compatibilidade, testes, documentação e evidence aprovados, enquanto Entity e Value Object são revisitados somente na aula 624 e Aggregate/Aggregate Root permanecem reservados à aula 625.
```
