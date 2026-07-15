# 648 - M19.38 - ArchUnit avancado

## Apresentação da aula

Na aula 647, você transformou características arquiteturais em fitness functions avaliáveis. Agora o foco se estreita para uma característica decisiva em sistemas Java:

```text
estrutura de dependências do código.
```

Uma arquitetura pode estar correta no C4, aprovada em RFC e registrada em ADR, mas se degradar no código. Controller acessa repository diretamente, domínio recebe anotação de persistência, adapters importam adapters e bounded contexts formam ciclos.

Revisão humana e documentação ajudam, porém não verificam continuamente o bytecode. ArchUnit importa classes Java compiladas e permite escrever testes sobre packages, dependências, camadas, anotações, interfaces, métodos, slices e ciclos.

Nesta aula, ArchUnit será tratado como fitness function estática de arquitetura.

A pergunta será:

```text
como transformar fronteiras arquiteturais
em regras executáveis,
explicáveis
e sustentáveis
sem criar um gate frágil
ou impossível de adotar em legado?
```

O laboratório será:

```text
labs/m19/aula-648-archunit-avancado/service-scheduling-archunit
```

Você protegerá bounded contexts, domínio, application services, ports, adapters e configuration com regras avançadas, layered architecture, onion architecture, slices, custom conditions, freezing, baseline, exceptions policy, reports, evidence e gate.

A próxima aula será:

```text
649 - M19.39 - Evolucao controlada da arquitetura
```

Roadmap, ondas de migração, compatibilidade, depreciação e revisão temporal ficam reservados para a aula 649.

Regra central:

```text
uma fronteira arquitetural
só está protegida
quando a intenção está documentada,
a regra é executável
e a violação é acionável.
```

## Onde estamos na formação

A sequência oficial é:

```text
645 RFC tecnico;
646 C4 Model;
647 Fitness functions arquiteturais;
648 ArchUnit avancado;
649 Evolucao controlada da arquitetura;
650 Modernizacao de legado.
```

A progressão é:

```text
propor a mudança;
representar a arquitetura;
medir características;
proteger a estrutura no código;
evoluir com governança;
modernizar sem reescrita cega.
```

Na aula 647, uma regra simples de dependência apareceu apenas para demonstrar uma fitness function estática. Agora você aprofundará a implementação real dessa proteção.

O objetivo não é produzir dezenas de regras cosméticas. O objetivo é proteger decisões arquiteturais que possuem motivo de negócio e impacto operacional.

Exemplos:

```text
o domínio não depende de framework
porque precisa preservar autonomia e testabilidade;

application não depende de adapter
porque casos de uso não podem conhecer detalhes externos;

bounded contexts não formam ciclos
porque ownership, deploy, mudança e diagnóstico precisam permanecer claros;

controllers não acessam repositories diretamente
porque autorização, transação e regra de negócio pertencem ao caso de uso;

adapters implementam ports
porque a direção da dependência deve apontar para dentro.
```

A aula 649 usará essas regras como parte de um processo maior de evolução. Portanto, não serão aprofundados roadmap arquitetural, ondas de migração ou governança temporal nesta aula.

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-648-archunit-avancado/service-scheduling-archunit
```

Estrutura principal:

```text
service-scheduling-archunit
├── pom.xml
├── README.md
├── archunit.properties
├── src/main/java/br/com/formacao/archunit
│   ├── shared
│   ├── scheduling
│   ├── capacity
│   └── notification
├── src/test/java/br/com/formacao/archunit/architecture
│   ├── DomainIndependenceTest.java
│   ├── ApplicationBoundaryTest.java
│   ├── AdapterBoundaryTest.java
│   ├── LayeredArchitectureTest.java
│   ├── OnionArchitectureTest.java
│   ├── BoundedContextSlicesTest.java
│   ├── PortAndAdapterConditionTest.java
│   ├── PublicApiTypeTest.java
│   ├── FrozenLegacyRulesTest.java
│   └── ArchitectureGateTest.java
├── src/test/resources/archunit-store
├── architecture
│   ├── ARCHUNIT_CHARTER.md
│   ├── PACKAGE_MODEL.md
│   ├── DEPENDENCY_POLICY.md
│   ├── FREEZING_POLICY.md
│   ├── EXCEPTION_POLICY.md
│   └── PIPELINE_POLICY.md
├── contracts
│   ├── archunit-contract.yaml
│   ├── dependency-policy.yaml
│   ├── freezing-policy.yaml
│   ├── exception-policy.yaml
│   └── gate-policy.yaml
└── reports
    ├── dependency-report.yaml
    ├── cycle-report.yaml
    ├── frozen-violations-report.yaml
    └── archunit-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-archunit
├── validate-archunit-contract.ps1
├── validate-dependency-policy.ps1
├── validate-cycle-policy.ps1
├── validate-freezing-policy.ps1
├── validate-exceptions.ps1
├── run-archunit-tests.ps1
├── collect-archunit-evidence.ps1
└── verify-archunit-gate.ps1
```

Ao final, a suíte detectará dependências proibidas, ciclos, inversões de direção, vazamentos de framework, adapters sem ports, APIs expondo infraestrutura e novas violações sobre uma baseline legada.

## Conceito essencial

### Teste arquitetural não é teste unitário comum

Um teste unitário valida comportamento de uma unidade. Um teste com ArchUnit valida propriedades da estrutura compilada.

ArchUnit importa classes e observa relações como:

```text
classe A depende da classe B;

pacote X acessa pacote Y;

classe implementa interface;

método expõe determinado tipo;

classe possui anotação;

slice depende de outro slice;

conjunto de dependências forma ciclo.
```

O resultado continua integrado ao JUnit e ao Maven, mas a unidade de análise é arquitetural.

### Regra estrutural precisa de intenção

Uma regra sem motivo vira burocracia.

Compare:

```text
classes de domínio não podem usar Spring.
```

Com:

```text
classes de domínio não podem depender de Spring
porque o modelo precisa preservar linguagem de negócio,
execução isolada,
testabilidade
e independência de mecanismo.
```

Use `.because(...)` para registrar a razão na própria regra. A mensagem de falha se torna mais útil e a equipe entende o que está sendo protegido.

### Pacote não é arquitetura por si só

Criar pastas `domain`, `application` e `adapter` não garante direção correta. A arquitetura aparece nas dependências reais.

Uma classe em `domain` que importa `JpaRepository` continua acoplada à infraestrutura. Um controller dentro de `adapter.in.web` que chama um repository diretamente continua desviando do caso de uso.

ArchUnit verifica a relação, não apenas o nome.

### Regras avançadas precisam de adoção segura

Em um projeto novo, a regra pode exigir zero violações desde o primeiro commit.

Em legado, ativar cinquenta regras e falhar em milhares de pontos costuma produzir abandono do gate. O caminho seguro é:

```text
identificar regras críticas;

medir violações atuais;

bloquear novas violações;

registrar baseline;

remover dívida gradualmente;

proibir refreeze sem revisão;

manter exceções explícitas e temporárias.
```

`FreezingArchRule` ajuda a impedir crescimento da dívida existente, mas não substitui plano de correção.

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-648-archunit-avancado/service-scheduling-archunit

Set-Location `
  labs/m19/aula-648-archunit-avancado/service-scheduling-archunit
```

### 2. Configurar Maven e ArchUnit

No `pom.xml`, preserve as versões já adotadas pelo curso e adicione a propriedade e a dependência de testes:

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>
    <archunit.version>1.3.0</archunit.version>
</properties>

<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <version>${archunit.version}</version>
    <scope>test</scope>
</dependency>
```

Se o projeto pai já gerencia a versão, não duplique a propriedade. O laboratório assume JUnit 5 já configurado.

### 3. Criar ArchUnit Charter

Arquivo:

```text
architecture/ARCHUNIT_CHARTER.md
```

Conteúdo:

```markdown
# ArchUnit Charter

A suíte protege decisões arquiteturais de Service Scheduling.

Ela valida:

- independência do domínio;
- direção application -> domain;
- adapters apontando para ports;
- ausência de acesso direto controller -> repository;
- bounded contexts livres de ciclos;
- convenções relevantes;
- APIs sem tipos de infraestrutura;
- baseline controlada para legado.

Toda regra deve possuir:

- intenção;
- owner;
- severidade;
- traceability;
- diagnóstico;
- resposta;
- política de exceção.
```

### 4. Definir o modelo de pacotes

Arquivo:

```text
architecture/PACKAGE_MODEL.md
```

Modelo:

```text
br.com.formacao.archunit
  .scheduling
    .domain
    .application.port.in
    .application.port.out
    .application.service
    .adapter.in
    .adapter.out
    .configuration

  .capacity
    mesmos limites

  .notification
    mesmos limites

  .shared.contract
  .shared.architecture
```

A organização é primeiro por bounded context e depois por papel arquitetural. Isso reduz um pacote global de domínio ou infraestrutura que mistura ownerships diferentes.

### 5. Criar anotações arquiteturais próprias

Arquivo:

```text
src/main/java/br/com/formacao/archunit/shared/architecture/InboundAdapter.java
```

```java
package br.com.formacao.archunit.shared.architecture;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface InboundAdapter {
}
```

Crie também `OutboundAdapter` e `ApplicationService` com a mesma retenção e alvo.

Essas anotações não substituem packages. Elas fornecem uma segunda evidência verificável e tornam a intenção explícita.

### 6. Criar um domínio independente

Arquivo:

```text
src/main/java/br/com/formacao/archunit/scheduling/domain/model/Appointment.java
```

```java
package br.com.formacao.archunit.scheduling.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Appointment(
        UUID id,
        AppointmentStatus status,
        Instant startsAt,
        long version) {

    public Appointment {
        Objects.requireNonNull(id);
        Objects.requireNonNull(status);
        Objects.requireNonNull(startsAt);

        if (version < 1) {
            throw new IllegalArgumentException("Version must be positive");
        }
    }

    public Appointment confirm() {
        if (status != AppointmentStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled appointment can be confirmed");
        }

        return new Appointment(
                id,
                AppointmentStatus.CONFIRMED,
                startsAt,
                version + 1);
    }
}
```

O domínio usa apenas Java e tipos do próprio domínio.

### 7. Criar ports de entrada e saída

Port de entrada:

```java
package br.com.formacao.archunit.scheduling.application.port.in;

import java.util.UUID;

public interface ConfirmAppointmentUseCase {

    ConfirmationOutput confirm(
            UUID appointmentId,
            long expectedVersion);
}
```

Port de saída:

```java
package br.com.formacao.archunit.scheduling.application.port.out;

import br.com.formacao.archunit.scheduling.domain.model.Appointment;

import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepositoryPort {

    Optional<Appointment> findById(UUID appointmentId);

    Appointment save(Appointment appointment);
}
```

Ports pertencem à aplicação porque representam necessidades e capacidades do caso de uso.

### 8. Criar application service

```java
package br.com.formacao.archunit.scheduling.application.service;

import br.com.formacao.archunit.scheduling.application.port.in.ConfirmAppointmentUseCase;
import br.com.formacao.archunit.scheduling.application.port.in.ConfirmationOutput;
import br.com.formacao.archunit.scheduling.application.port.out.AppointmentRepositoryPort;
import br.com.formacao.archunit.scheduling.domain.model.Appointment;
import br.com.formacao.archunit.shared.architecture.ApplicationService;

import java.util.UUID;

@ApplicationService
public final class ConfirmAppointmentService
        implements ConfirmAppointmentUseCase {

    private final AppointmentRepositoryPort repository;

    public ConfirmAppointmentService(
            AppointmentRepositoryPort repository) {

        this.repository = repository;
    }

    @Override
    public ConfirmationOutput confirm(
            UUID appointmentId,
            long expectedVersion) {

        Appointment current = repository.findById(appointmentId)
                .orElseThrow();

        if (current.version() != expectedVersion) {
            throw new IllegalStateException("Concurrent update detected");
        }

        Appointment confirmed = current.confirm();
        Appointment saved = repository.save(confirmed);

        return new ConfirmationOutput(
                saved.id(),
                saved.status().name(),
                saved.version());
    }
}
```

O service conhece domínio e port de saída, mas não conhece JPA, HTTP ou classe concreta de adapter.

### 9. Criar adapters

Adapter de entrada:

```java
package br.com.formacao.archunit.scheduling.adapter.in.web;

import br.com.formacao.archunit.scheduling.application.port.in.ConfirmAppointmentUseCase;
import br.com.formacao.archunit.scheduling.application.port.in.ConfirmationOutput;
import br.com.formacao.archunit.shared.architecture.InboundAdapter;

import java.util.UUID;

@InboundAdapter
public final class AppointmentController {

    private final ConfirmAppointmentUseCase useCase;

    public AppointmentController(
            ConfirmAppointmentUseCase useCase) {

        this.useCase = useCase;
    }

    public ConfirmationOutput confirm(
            UUID appointmentId,
            long expectedVersion) {

        return useCase.confirm(
                appointmentId,
                expectedVersion);
    }
}
```

Adapter de saída:

```java
package br.com.formacao.archunit.scheduling.adapter.out.persistence;

import br.com.formacao.archunit.scheduling.application.port.out.AppointmentRepositoryPort;
import br.com.formacao.archunit.scheduling.domain.model.Appointment;
import br.com.formacao.archunit.shared.architecture.OutboundAdapter;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@OutboundAdapter
public final class InMemoryAppointmentRepositoryAdapter
        implements AppointmentRepositoryPort {

    private final Map<UUID, Appointment> storage = new ConcurrentHashMap<>();

    @Override
    public Optional<Appointment> findById(UUID appointmentId) {
        return Optional.ofNullable(storage.get(appointmentId));
    }

    @Override
    public Appointment save(Appointment appointment) {
        storage.put(appointment.id(), appointment);
        return appointment;
    }
}
```

### 10. Criar contrato principal

Arquivo:

```text
contracts/archunit-contract.yaml
```

Conteúdo:

```yaml
archUnit:
  context:
    Service-Scheduling

  required:
    - domain-independence
    - application-direction
    - port-adapter-boundary
    - layered-rule
    - onion-rule
    - bounded-context-slices
    - cycle-detection
    - custom-conditions
    - failure-diagnostics
    - controlled-freezing
    - exception-policy
    - pipeline-gate
    - evidence

  forbidden:
    - domain-framework-dependency
    - application-to-adapter-dependency
    - controller-to-repository-dependency
    - adapter-to-adapter-coupling
    - hidden-cycle
    - silent-rule-disable
    - uncontrolled-refreeze
    - permanent-exception
    - empty-rule-success
    - architecture-roadmap-deep-dive

  nextLesson:
    code:
      M19.39
```

### 11. Configurar importação de classes

Arquivo:

```text
src/test/java/br/com/formacao/archunit/architecture/ArchitectureImportTest.java
```

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;

@AnalyzeClasses(
        packages = "br.com.formacao.archunit",
        importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureImportTest {
}
```

As demais classes de teste podem herdar essa configuração ou repetir a anotação quando precisarem de escopo diferente.

Excluir testes evita que fixtures e doubles produzam dependências que não pertencem à aplicação principal.

### 12. Proteger o domínio contra frameworks

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "br.com.formacao.archunit")
public class DomainIndependenceTest {

    @ArchTest
    static final ArchRule domain_must_not_depend_on_frameworks =
            noClasses()
                    .that()
                    .resideInAPackage("..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAnyPackage(
                            "org.springframework..",
                            "jakarta.persistence..",
                            "com.fasterxml.jackson..")
                    .because(
                            "o domínio deve preservar autonomia de framework, persistência e transporte");
}
```

Essa regra detecta anotações, campos, parâmetros, retornos, herança e chamadas que criem dependência para esses packages.

### 13. Restringir dependências permitidas do domínio

```java
@ArchTest
static final ArchRule domain_must_only_use_domain_shared_contracts_and_java =
        classes()
                .that()
                .resideInAPackage("..domain..")
                .should()
                .onlyDependOnClassesThat()
                .resideInAnyPackage(
                        "java..",
                        "br.com.formacao.archunit..domain..",
                        "br.com.formacao.archunit.shared.contract..")
                .because(
                        "regras de negócio não podem importar application, adapters ou configuration");
```

Regras positivas como `onlyDependOnClassesThat` são fortes. Revise cuidadosamente tipos gerados pelo compilador, annotations e exceções legítimas antes de adotá-las no legado.

### 14. Proteger a camada de aplicação

```java
@ArchTest
static final ArchRule application_must_not_depend_on_adapters =
        noClasses()
                .that()
                .resideInAPackage("..application..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..adapter..",
                        "..configuration..")
                .because(
                        "casos de uso devem depender de ports e domínio, nunca de mecanismos externos");
```

Essa regra impede que um service receba diretamente um repository JPA concreto, um HTTP client ou uma classe de configuração.

### 15. Impedir controller chamando repository

```java
@ArchTest
static final ArchRule inbound_adapters_must_not_access_outbound_adapters =
        noClasses()
                .that()
                .resideInAPackage("..adapter.in..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage("..adapter.out..")
                .because(
                        "entrada deve atravessar um port de caso de uso antes de alcançar infraestrutura");
```

O problema não é apenas estético. O acesso direto pode pular autorização, transação, idempotência, validação, auditoria e política de negócio.

### 16. Impedir acoplamento entre adapters

```java
@ArchTest
static final ArchRule outbound_adapters_must_not_depend_on_other_adapters =
        noClasses()
                .that()
                .resideInAPackage("..adapter.out..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..adapter.in..",
                        "..adapter.out..")
                .because(
                        "adapters devem se integrar por ports e contracts, não por classes concretas");
```

Se um adapter precisar reutilizar lógica de outro, extraia uma abstração apropriada ou mova a responsabilidade para application/domain. Não transforme adapter em biblioteca oculta.

### 17. Criar regra de layered architecture

A DSL de arquitetura em camadas torna a intenção mais legível.

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(packages = "br.com.formacao.archunit")
public class LayeredArchitectureTest {

    @ArchTest
    static final ArchRule layers_must_follow_the_dependency_direction =
            layeredArchitecture()
                    .consideringOnlyDependenciesInLayers()
                    .layer("Domain").definedBy("..domain..")
                    .layer("Application").definedBy("..application..")
                    .layer("InboundAdapters").definedBy("..adapter.in..")
                    .layer("OutboundAdapters").definedBy("..adapter.out..")
                    .layer("Configuration").definedBy("..configuration..")
                    .whereLayer("Domain")
                    .mayOnlyBeAccessedByLayers(
                            "Application",
                            "InboundAdapters",
                            "OutboundAdapters",
                            "Configuration")
                    .whereLayer("Application")
                    .mayOnlyBeAccessedByLayers(
                            "InboundAdapters",
                            "OutboundAdapters",
                            "Configuration")
                    .whereLayer("InboundAdapters")
                    .mayNotBeAccessedByAnyLayer()
                    .whereLayer("OutboundAdapters")
                    .mayNotBeAccessedByAnyLayer()
                    .whereLayer("Configuration")
                    .mayNotBeAccessedByAnyLayer()
                    .because(
                            "dependências devem apontar para domínio e application, nunca para mecanismos externos");
}
```

`consideringOnlyDependenciesInLayers` concentra a avaliação nos packages declarados. Dependências externas, como Java e bibliotecas, são tratadas pelas regras específicas de domínio e application.

Uma regra de camadas não substitui as regras menores. Ela oferece a visão global; regras específicas produzem diagnóstico mais direto.

### 18. Criar regra de onion architecture

ArchUnit também fornece uma DSL para onion architecture.

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.library.Architectures.onionArchitecture;

@AnalyzeClasses(packages = "br.com.formacao.archunit")
public class OnionArchitectureTest {

    @ArchTest
    static final ArchRule contexts_must_follow_onion_architecture =
            onionArchitecture()
                    .domainModels("..domain.model..")
                    .domainServices("..domain.service..")
                    .applicationServices("..application..")
                    .adapter("inbound", "..adapter.in..")
                    .adapter("outbound", "..adapter.out..")
                    .because(
                            "ports e adapters devem preservar a direção para o núcleo da aplicação");
}
```

A regra explicita o desenho, mas precisa refletir os packages reais. Não force o projeto a caber em uma DSL genérica se a arquitetura possui variações deliberadas. Nesse caso, combine regras menores e condições customizadas.

### 19. Exigir ports como interfaces

```java
@ArchTest
static final ArchRule ports_must_be_interfaces =
        classes()
                .that()
                .resideInAPackage("..application.port..")
                .should()
                .beInterfaces()
                .because(
                        "ports representam contratos estáveis entre aplicação e mecanismos externos");
```

Uma classe concreta dentro de `port` geralmente indica mistura de contrato e implementação.

### 20. Exigir anotações por papel

```java
@ArchTest
static final ArchRule inbound_adapters_must_be_annotated =
        classes()
                .that()
                .resideInAPackage("..adapter.in..")
                .and()
                .areNotInterfaces()
                .should()
                .beAnnotatedWith(InboundAdapter.class);

@ArchTest
static final ArchRule outbound_adapters_must_be_annotated =
        classes()
                .that()
                .resideInAPackage("..adapter.out..")
                .and()
                .areNotInterfaces()
                .should()
                .beAnnotatedWith(OutboundAdapter.class);
```

Evite exigir annotations apenas por estética. Aqui elas ajudam inventário, documentação e custom conditions.

### 21. Criar condição customizada para adapters de saída

Nem toda regra importante existe pronta na DSL. Crie uma condição que exija pelo menos um port de saída implementado.

Arquivo:

```text
src/test/java/br/com/formacao/archunit/architecture/ArchitectureConditions.java
```

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

public final class ArchitectureConditions {

    private ArchitectureConditions() {
    }

    public static ArchCondition<JavaClass> implementAnOutboundPort() {
        return new ArchCondition<>("implement at least one outbound port") {

            @Override
            public void check(
                    JavaClass item,
                    ConditionEvents events) {

                boolean satisfied = item.getAllRawInterfaces()
                        .stream()
                        .anyMatch(type -> type.getPackageName()
                                .contains(".application.port.out"));

                String message = satisfied
                        ? item.getName() + " implements an outbound port"
                        : item.getName() + " does not implement an outbound port";

                events.add(new SimpleConditionEvent(
                        item,
                        satisfied,
                        message));
            }
        };
    }
}
```

Use a condição:

```java
@ArchTest
static final ArchRule outbound_adapters_must_implement_ports =
        classes()
                .that()
                .resideInAPackage("..adapter.out..")
                .and()
                .areNotInterfaces()
                .should(implementAnOutboundPort());
```

A mensagem informa exatamente qual classe falhou.

### 22. Proteger tipos expostos pela API de application

Um caso de uso pode estar no package correto e ainda expor `ResponseEntity`, entidade JPA ou tipo de client HTTP.

Crie uma condição para métodos públicos de application:

```java
public static ArchCondition<JavaMethod> notExposeInfrastructureTypes() {
    return new ArchCondition<>("not expose infrastructure types") {

        @Override
        public void check(
                JavaMethod method,
                ConditionEvents events) {

            Stream<JavaClass> exposedTypes = Stream.concat(
                    Stream.of(method.getRawReturnType()),
                    method.getRawParameterTypes().stream());

            boolean satisfied = exposedTypes
                    .map(JavaClass::getPackageName)
                    .noneMatch(packageName ->
                            packageName.startsWith("org.springframework")
                                    || packageName.startsWith("jakarta.persistence")
                                    || packageName.contains(".adapter."));

            events.add(new SimpleConditionEvent(
                    method,
                    satisfied,
                    method.getFullName()
                            + (satisfied
                            ? " exposes only allowed types"
                            : " exposes infrastructure type")));
        }
    };
}
```

A regra:

```java
@ArchTest
static final ArchRule application_public_methods_must_not_leak_infrastructure =
        methods()
                .that()
                .arePublic()
                .and()
                .areDeclaredInClassesThat()
                .resideInAPackage("..application..")
                .should(notExposeInfrastructureTypes());
```

Imports necessários incluem `JavaMethod`, `JavaClass`, `Stream`, `ConditionEvents` e `SimpleConditionEvent`.

### 23. Detectar ciclos entre bounded contexts

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(packages = "br.com.formacao.archunit")
public class BoundedContextSlicesTest {

    @ArchTest
    static final ArchRule bounded_contexts_must_be_free_of_cycles =
            slices()
                    .matching("br.com.formacao.archunit.(*)..")
                    .should()
                    .beFreeOfCycles()
                    .because(
                            "bounded contexts precisam de ownership e direção de dependência compreensíveis");
}
```

O grupo `(*)` cria slices para `scheduling`, `capacity`, `notification` e `shared`.

Se `scheduling` depende de `capacity`, `capacity` depende de `notification` e `notification` volta a depender de `scheduling`, a regra apresenta o ciclo e as dependências que o formam.

### 24. Distinguir dependência permitida de ciclo

Ausência de ciclo não significa ausência de acoplamento excessivo. O grafo pode ser acíclico e ainda ter dependências indevidas.

Defina uma direção entre contexts:

```text
notification pode consumir contracts de scheduling;

scheduling pode consultar um port de capacity;

capacity não importa application ou adapter de scheduling;

shared contém somente contracts realmente compartilhados;

nenhum context acessa adapter de outro context.
```

Proteja o último ponto:

```java
@ArchTest
static final ArchRule contexts_must_not_access_other_context_adapters =
        noClasses()
                .that()
                .resideOutsideOfPackage("..adapter..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..scheduling.adapter..",
                        "..capacity.adapter..",
                        "..notification.adapter..")
                .because(
                        "integração entre contexts deve ocorrer por ports, events ou contracts");
```

Em uma base real, prefira regras explícitas por context para evitar uma expressão ampla demais.

### 25. Simular um ciclo e ler o diagnóstico

Crie temporariamente:

```text
SchedulingPolicy -> CapacityPolicy;
CapacityPolicy -> NotificationPolicy;
NotificationPolicy -> SchedulingPolicy.
```

Execute:

```powershell
mvn `
  -Dtest=BoundedContextSlicesTest `
  test
```

Leia a cadeia completa da violação. Não corrija apenas movendo classes de package. Pergunte:

```text
qual context realmente possui a decisão?

qual informação precisa cruzar a fronteira?

isso é command, query, event ou contract?

uma dependência síncrona é necessária?

um tipo compartilhado está escondendo domínio compartilhado demais?
```

Quebre o ciclo extraindo um port, publicando um evento ou movendo a decisão para o owner correto.

### 26. Proteger nomes apenas quando expressam papel

Use naming rules somente quando o nome ajuda a reconhecer responsabilidade. Exemplo:

```java
@ArchTest
static final ArchRule web_adapters_must_end_with_controller =
        classes()
                .that()
                .resideInAPackage("..adapter.in.web..")
                .should()
                .haveSimpleNameEndingWith("Controller");
```

Evite transformar preferência estética em bloqueio arquitetural.

### 27. Proteger services de aplicação

```java
@ArchTest
static final ArchRule application_services_must_be_annotated =
        classes()
                .that()
                .resideInAPackage("..application.service..")
                .should()
                .beAnnotatedWith(ApplicationService.class);
```

Declare handlers ou orchestrators válidos na policy, sem ignores improvisados.

### 28. Proibir configuração espalhada

```java
@ArchTest
static final ArchRule configuration_classes_must_reside_in_configuration =
        classes()
                .that()
                .haveSimpleNameEndingWith("Configuration")
                .should()
                .resideInAPackage("..configuration..");
```

Configuração compõe o sistema, mas não deve ser acessada pelo domínio.

### 29. Definir uma policy para custom conditions

Arquivo:

```text
architecture/CUSTOM_CONDITION_POLICY.md
```

Registre:

```text
uma custom condition deve:

avaliar uma intenção não expressável pela DSL comum;

produzir mensagem com classe ou método afetado;

ser determinística;

não consultar rede;

não depender de ordem de execução;

possuir testes positivo e negativo;

ter owner e traceability;

ser mantida pequena.
```

Se a condição virar um analisador genérico de centenas de linhas, considere ferramenta dedicada ou divisão em regras menores.

### 30. Configurar falha para regras vazias

Arquivo:

```text
archunit.properties
```

Conteúdo:

```properties
archRule.failOnEmptyShould=true
freeze.store.default.path=src/test/resources/archunit-store
freeze.store.default.allowStoreCreation=true
freeze.refreeze=false
```

Uma regra vazia pode indicar package renomeado, padrão incorreto ou importação incompleta. Tratar isso como sucesso esconderia a perda de cobertura.

### 31. Introduzir FreezingArchRule com critério

Suponha que um legado ainda possua dependências de framework no domínio. Você quer bloquear novas violações sem fingir que as antigas desapareceram.

```java
package br.com.formacao.archunit.architecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.freeze.FreezingArchRule.freeze;

@AnalyzeClasses(packages = "br.com.formacao.archunit")
public class FrozenLegacyRulesTest {

    private static final ArchRule raw_rule =
            noClasses()
                    .that()
                    .resideInAPackage("..legacy.domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAnyPackage(
                            "org.springframework..",
                            "jakarta.persistence..");

    @ArchTest
    static final ArchRule legacy_domain_must_not_gain_new_framework_dependencies =
            freeze(raw_rule)
                    .because(
                            "a dívida existente possui baseline, mas não pode crescer");
}
```

Na primeira execução autorizada, o store registra as violações atuais. Nas execuções seguintes, novas violações falham.

### 32. Versionar o store

Versione `src/test/resources/archunit-store` no Git. Revise alterações como mudança arquitetural: remoção, renomeação, nova violação, alteração da regra ou refreeze. Nunca mantenha `freeze.refreeze=true` no CI.

### 33. Criar Freezing Policy

Arquivo:

```text
contracts/freezing-policy.yaml
```

Conteúdo:

```yaml
freezing:
  allowedFor:
    - legacy-rule-with-remediation-plan

  forbiddenFor:
    - cross-tenant-leak
    - critical-security-boundary
    - new-module
    - controller-direct-repository

  baseline:
    owner:
      required
    generatedAt:
      required
    violationCount:
      required
    remediationReference:
      required

  refreeze:
    automatic:
      forbidden
    requires:
      - architecture-review
      - justification
      - diff-inspection
      - updated-remediation-plan
```

Freezing é uma estratégia de transição, não um certificado de conformidade.

### 34. Criar Exception Policy separada

Uma exception não deve ser escondida com `.ignoreDependency(...)` espalhado pelos testes.

Arquivo:

```text
contracts/exception-policy.yaml
```

Conteúdo:

```yaml
architectureException:
  requires:
    - id
    - rule
    - affected-elements
    - business-reason
    - technical-risk
    - owner
    - approver
    - created-at
    - expires-at
    - remediation-reference

  permanent:
    forbidden

  expired:
    gate:
      FAIL

  criticalBoundary:
    exception:
      forbidden
```

Exceção temporária e baseline congelada resolvem problemas diferentes. Baseline cobre violações já existentes de uma regra. Exception autoriza temporariamente uma situação conhecida e individualizada.

### 35. Criar diagnóstico de falha

Documente um fluxo curto: identificar regra e dependência, confirmar a violação, localizar o owner, corrigir direção ou extrair port, executar teste específico e suíte completa. Nunca desabilite a regra silenciosamente.

### 36. Criar testes da própria suíte

Custom conditions também precisam de testes.

Crie classes de exemplo em packages de fixture e valide:

```text
adapter que implementa port:
PASS;

adapter sem port:
FAIL;

application method com DTO próprio:
PASS;

application method expondo adapter entity:
FAIL;

slice sem ciclo:
PASS;

três slices cíclicos:
FAIL.
```

Isso impede que uma alteração na condição reduza cobertura sem percepção.

### 37. Separar gates por contexto

No PR, execute fronteiras e cycles. No release, inclua layered, onion, custom conditions, baseline e exceptions. Em análise periódica, gere inventários e relatórios completos.

### 38. Controlar custo de importação

Agrupe regras com o mesmo `@AnalyzeClasses` e use packages precisos. A raiz completa é necessária para cycles entre contexts; regras locais podem importar apenas o context correspondente.

### 39. Criar Pipeline Policy

Arquivo:

```text
contracts/gate-policy.yaml
```

Conteúdo:

```yaml
archUnitGate:
  pullRequest:
    required:
      - domain-independence
      - application-boundary
      - adapter-boundary
      - cycle-detection
      - new-frozen-violation-check

  release:
    required:
      - layered-architecture
      - onion-architecture
      - custom-conditions
      - exceptions-valid
      - reports-generated

  failure:
    blocking:
      true

  inconclusive:
    blockingForCriticalRules:
      true

  disabledRuleWithoutApproval:
    result:
      FAIL
```

### 40. Criar script de execução

Arquivo:

```text
scripts/m19/service-scheduling-archunit/run-archunit-tests.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

mvn `
  -Dtest="*ArchitectureTest,*BoundaryTest,*SlicesTest,*RulesTest" `
  test

if ($LASTEXITCODE -ne 0) {
    throw "ArchUnit tests failed"
}
```

Mantenha nomes de classes alinhados ao padrão usado pelo script.

### 41. Criar reports

Exemplo:

```yaml
archUnit:
  importedClasses:
    184

  rules:
    total:
      18
    passed:
      16
    failed:
      0
    frozen:
      2
    inconclusive:
      0

  cycles:
    detected:
      0

  baseline:
    existingViolations:
      7
    newViolations:
      0

  exceptions:
    active:
      1
    expired:
      0

  result:
    PASS_WITH_LEGACY_BASELINE
```

O report não deve esconder a baseline. `PASS_WITH_LEGACY_BASELINE` é diferente de conformidade total.

### 42. Criar Evidence

Arquivo:

```text
contracts/archunit-evidence.yaml
```

Campos permitidos:

```text
lesson;
project;
commit;
imported class count;
rule count;
passed count;
failed count;
frozen rule count;
existing baseline violation count;
new violation count;
cycle count;
active exception count;
expired exception count;
test status;
documentation status;
gate status;
timestamp.
```

Não inclua source code completo, paths internos sensíveis, credenciais, tokens ou nomes reais de clientes.

### 43. Criar o gate final

Status possíveis:

```text
PASS;

PASS_WITH_LEGACY_BASELINE;

FAIL_DOMAIN_BOUNDARY;

FAIL_APPLICATION_BOUNDARY;

FAIL_ADAPTER_BOUNDARY;

FAIL_LAYER_MODEL;

FAIL_ONION_MODEL;

FAIL_CYCLE;

FAIL_CUSTOM_CONDITION;

FAIL_NEW_FROZEN_VIOLATION;

FAIL_EXCEPTION_POLICY;

FAIL_EMPTY_RULE;

FAIL_TEST;

FAIL_DOCUMENTATION;

INCONCLUSIVE.
```

O gate deve diferenciar dívida conhecida de regressão nova.

### 44. Testar uma violação de domínio

Adicione temporariamente uma dependência de framework ao domínio ou uma classe fictícia em package proibido.

Execute:

```powershell
mvn `
  -Dtest=DomainIndependenceTest `
  test
```

Confirme:

```text
a regra falha;

a mensagem mostra origem e destino;

a razão aparece;

a correção remove a dependência;

o teste volta a passar.
```

### 45. Testar controller acessando adapter de saída

Faça `AppointmentController` receber `InMemoryAppointmentRepositoryAdapter` diretamente.

A suíte deve falhar em pelo menos:

```text
inbound_adapters_must_not_access_outbound_adapters;

layered architecture;

onion architecture.
```

Corrija restaurando a dependência para `ConfirmAppointmentUseCase`.

### 46. Testar nova violação congelada

Após gerar uma baseline legítima, crie uma nova dependência proibida em `legacy.domain`.

O `FreezingArchRule` deve falhar apenas para a nova violação. Remova-a e confirme que a baseline antiga permanece registrada.

### 47. Testar exception expirada

Crie uma exception com `expires-at` anterior à data da validação.

O script `validate-exceptions.ps1` deve produzir:

```text
FAIL_EXCEPTION_POLICY.
```

A solução não é mudar a data. É corrigir a violação ou aprovar uma nova exceção com justificativa e novo plano.

### 48. Validar contrato e policies

Execute:

```powershell
.\scripts\m19\service-scheduling-archunit\validate-archunit-contract.ps1

.\scripts\m19\service-scheduling-archunit\validate-package-model.ps1

.\scripts\m19\service-scheduling-archunit\validate-dependency-policy.ps1

.\scripts\m19\service-scheduling-archunit\validate-layer-policy.ps1

.\scripts\m19\service-scheduling-archunit\validate-hexagonal-policy.ps1

.\scripts\m19\service-scheduling-archunit\validate-bounded-context-policy.ps1

.\scripts\m19\service-scheduling-archunit\validate-cycle-policy.ps1
```

### 49. Executar testes e evidence

```powershell
.\scripts\m19\service-scheduling-archunit\run-archunit-tests.ps1

.\scripts\m19\service-scheduling-archunit\validate-freezing-policy.ps1

.\scripts\m19\service-scheduling-archunit\validate-exceptions.ps1

.\scripts\m19\service-scheduling-archunit\collect-archunit-evidence.ps1

.\scripts\m19\service-scheduling-archunit\verify-archunit-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 50. Encerrar o laboratório

Confirme:

- domínio independente de frameworks;
- application sem dependência de adapters;
- adapters de entrada sem acesso direto a saída;
- adapters de saída implementando ports;
- layered architecture aprovada;
- onion architecture aprovada;
- bounded contexts sem ciclos;
- custom conditions testadas;
- APIs sem vazamento de infraestrutura;
- regras vazias falhando;
- baseline versionada;
- nenhuma nova violação congelada;
- refreeze automático proibido;
- exceções temporárias e válidas;
- reports e evidence sanitizados;
- gate aprovado;
- evolução controlada não aprofundada.

## Entendendo o que foi feito

### A arquitetura virou uma propriedade executável

Packages, ports, adapters, layers e contexts deixaram de depender apenas de revisão visual. As dependências compiladas passaram a ser verificadas no pipeline.

### Regras globais e específicas se complementaram

Layered e onion architecture forneceram visão geral. Regras menores explicaram violações de domínio, application, adapters, naming e tipos expostos com maior precisão.

### Ciclos ganharam diagnóstico

Slices mostraram relações entre bounded contexts e revelaram cadeias que aumentariam acoplamento, coordenação e risco de mudança.

### Legado ganhou contenção sem falsa conformidade

Freezing registrou dívida existente, bloqueou crescimento e preservou visibilidade. Exceptions continuaram separadas, temporárias e auditáveis.

### O gate ganhou semântica

O resultado diferencia conformidade total, baseline conhecida, regressão nova, ciclo, falha de fronteira, exception expirada e ausência de evidência.

## Erros comuns importantes

### Criar regras cosméticas demais

Sufixos e packages sem impacto arquitetural geram ruído. Proteja decisões relevantes.

### Usar apenas layered architecture

A regra global pode produzir diagnóstico amplo. Combine-a com regras específicas.

### Fazer o domínio depender de annotations de framework

O package continua chamado `domain`, mas a independência foi perdida.

### Corrigir ciclo apenas movendo classes

O ciclo de responsabilidade permanece. Reavalie ownership, contracts, ports e events.

### Congelar toda violação

A baseline vira depósito permanente de dívida e o gate deixa de expressar risco.

### Executar refreeze automaticamente

Novas violações podem ser aceitas sem revisão.

### Ignorar dependências diretamente no teste

Exceções ficam invisíveis, sem owner e sem expiração.

### Permitir regra vazia

Uma renomeação pode eliminar a cobertura e ainda produzir verde.

### Criar custom condition opaca

Mensagens ruins tornam a correção lenta e incentivam desabilitar o teste.

### Antecipar evolução controlada

Roadmap de mudança, ondas de migração e governança temporal pertencem à aula 649.

## Comandos úteis

### Executar toda a suíte

```powershell
mvn test
```

### Executar domínio

```powershell
mvn `
  -Dtest=DomainIndependenceTest `
  test
```

### Executar ciclos

```powershell
mvn `
  -Dtest=BoundedContextSlicesTest `
  test
```

### Executar validação operacional

```powershell
.\scripts\m19\service-scheduling-archunit\run-archunit-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-archunit\verify-archunit-gate.ps1
```

## Exercício guiado

Crie os bounded contexts `scheduling`, `capacity` e `notification`; organize domain, application, ports, adapters e configuration; implemente regras de independência, direção, layered architecture, onion architecture, slices e cycles; crie duas custom conditions; introduza violações controladas; valide mensagens; configure freezing para uma área legada; registre exception temporária; gere report, evidence e gate.

## Critérios de aceite

- arquivo, H1, número, módulo e título seguem a grade oficial;
- continuidade com a aula 647 e ponte para a aula 649 foram preservadas;
- o laboratório `service-scheduling-archunit` foi criado;
- ArchUnit Charter e Package Model foram documentados;
- código foi organizado por bounded context e papel arquitetural;
- domínio não depende de framework, application, adapter ou configuration;
- application não depende de adapters;
- inbound adapter não acessa outbound adapter;
- outbound adapters implementam ports e ports são interfaces;
- layered e onion architecture foram validadas;
- bounded contexts permanecem livres de cycles;
- integração entre contexts usa contracts, ports ou events;
- custom conditions possuem mensagens e testes positivos e negativos;
- APIs de application não expõem tipos de infraestrutura;
- regras vazias falham;
- importação exclui testes;
- FreezingArchRule foi limitado ao legado;
- baseline foi versionada e refreeze automático proibido;
- novas violações congeladas falham;
- critical boundaries não aceitam freezing;
- exceptions possuem owner, aprovação, expiração e remediação;
- reports diferenciam baseline de conformidade total;
- evidence e gate foram criados;
- Evolução controlada da arquitetura não foi antecipada;
- commit, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-648-archunit-avancado/service-scheduling-archunit `
  scripts/m19/service-scheduling-archunit `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realPackage|privateRepository|freeze.refreeze=true|permanentException"
```

Commit recomendado:

```powershell
git commit -m "test(m19): proteger arquitetura com ArchUnit avancado"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- nomes reais de clientes;
- packages privados de produção;
- baseline gerada sem revisão;
- refreeze automático;
- exception permanente;
- roadmap da aula 649.

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou ArchUnit.

Você criou:

```text
ArchUnit Charter;

Package Model;

Domain Independence Rules;

Application Boundary Rules;

Adapter Boundary Rules;

Layered Architecture;

Onion Architecture;

Bounded Context Slices;

Cycle Detection;

Naming and Annotation Rules;

Custom ArchConditions;

Public API Type Rules;

Freezing Policy;

Exception Policy;

reports;

evidence;

gate.
```

Você comprovou que package não garante arquitetura; que dependências compiladas revelam a direção real; que regras globais e específicas precisam trabalhar juntas; que custom conditions devem ser pequenas e explicáveis; que cycles representam acoplamento de responsabilidade; que regras vazias não podem passar; que freezing contém dívida, mas não cria conformidade; que refreeze exige revisão; e que exceptions precisam ser temporárias, auditáveis e separadas da baseline.

A próxima aula será:

```text
649 - M19.39 - Evolucao controlada da arquitetura
```

Nela, você organizará como a arquitetura muda ao longo do tempo: estado atual, estado alvo, sequência segura, compatibility windows, métricas, checkpoints, depreciação, ownership, revisão e rollback da evolução.

Evolução controlada da arquitetura não foi aprofundada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Protegi domínio, application e adapters.
- [ ] Validei layered e onion architecture.
- [ ] Detectei cycles entre contexts.
- [ ] Criei custom conditions.
- [ ] Protegi tipos expostos.
- [ ] Configurei fail on empty.
- [ ] Modelei freezing controlado.
- [ ] Separei baseline de exception.
- [ ] Gerei reports e evidence.
- [ ] Verifiquei o gate final.

## Troubleshooting adicional

### A regra de domínio acusa um tipo legítimo

Verifique se o tipo realmente pertence ao domínio ou se a regra positiva está ampla demais. Prefira contract explícito a ignore genérico.

### A layered architecture falha em configuração

Confirme se configuration é composição externa. Ajuste a policy conscientemente, sem permitir acesso do domínio à configuração.

### Onion e regras específicas discordam

Revise o package model. A DSL deve representar a arquitetura real; regras específicas devem explicar variações deliberadas.

### A detecção de ciclos mostra `shared`

O pacote compartilhado pode estar importando contexts concretos. Shared deve ser pequeno e não depender dos consumidores.

### O teste ficou lento

Reduza packages importados, agrupe regras e separe análises cross-context das regras locais.

### O store congelado muda após renomeação

Revise o diff. Confirme que violações foram removidas ou apenas tiveram identidade alterada.

### O CI não consegue criar o store

Gere a baseline em execução controlada, versione o store e desabilite criação automática no ambiente normal.

### A equipe quer refreeze para liberar o PR

Bloqueie. Refreeze exige revisão arquitetural, justificativa e atualização do plano de remediação.

### Existem muitos ignores no código de teste

Migre para exception policy central, com owner e expiração.

### O package foi renomeado e a regra passou sem analisar classes

Mantenha `archRule.failOnEmptyShould=true` e valide o package model.

### A custom condition lança exceção

Trate metadados ausentes e crie testes para classes sintéticas, records e interfaces.

### A discussão virou roadmap de migração

Preserve a evolução controlada para a aula 649.

## Perguntas de revisão

1. O que ArchUnit analisa?
2. Por que package não garante arquitetura?
3. Qual diferença entre regra global e específica?
4. O que layered architecture protege?
5. O que onion architecture representa?
6. Por que application não depende de adapter?
7. Por que controller não acessa repository diretamente?
8. O que é slice?
9. O que um cycle entre contexts indica?
10. Quando criar uma ArchCondition customizada?
11. O que uma boa mensagem de violação contém?
12. Por que uma regra vazia deve falhar?
13. O que FreezingArchRule faz?
14. O que FreezingArchRule não faz?
15. Por que o store precisa ser versionado?
16. Por que refreeze automático é perigoso?
17. Qual diferença entre baseline e exception?
18. Quando freezing deve ser proibido?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

## Roteiro de resposta

1. Classes compiladas, packages, dependências, anotações, interfaces e ciclos.
2. Porque classes podem estar no lugar certo e depender da direção errada.
3. Global valida modelo amplo; específica explica uma fronteira concreta.
4. Direção e acesso entre camadas declaradas.
5. Núcleo de domínio, application services e adapters externos.
6. Porque o caso de uso deve conhecer abstrações, não mecanismos.
7. Para preservar caso de uso, autorização, transação e regras.
8. Conjunto de classes agrupado por padrão de package.
9. Acoplamento circular de responsabilidade e mudança.
10. Quando a DSL comum não expressa uma intenção relevante.
11. Elemento afetado, condição esperada e razão.
12. Para impedir perda silenciosa de cobertura.
13. Registra violações atuais e bloqueia novas.
14. Não corrige dívida nem prova conformidade total.
15. Para tornar a baseline revisável e reproduzível.
16. Porque novas violações podem ser aceitas silenciosamente.
17. Baseline contém dívida existente; exception autoriza caso temporário.
18. Em segurança crítica, isolamento e módulos novos.
19. Evolução controlada da arquitetura.
20. Evolução controlada da arquitetura.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 648 - M19.38 - ArchUnit avancado**

- Aprofundei ArchUnit como fitness function estática.
- Criei o laboratório `service-scheduling-archunit`.
- Documentei ArchUnit Charter e Package Model.
- Organizei código por bounded context, domínio, application, ports e adapters.
- Protegi o domínio contra frameworks e infraestrutura.
- Impedi application de depender de adapters.
- Impedi acesso direto entre inbound e outbound adapters.
- Criei regras de layered e onion architecture.
- Exigi ports como interfaces e adapters implementando ports.
- Criei custom conditions para adapters e APIs públicas.
- Detectei cycles entre Scheduling, Capacity e Notification.
- Configurei falha para regras vazias.
- Usei FreezingArchRule somente para dívida legada.
- Versionei a baseline e proibi refreeze automático.
- Separei baseline de exception temporária.
- Criei reports, evidence e gate.
- Não antecipei Evolução controlada da arquitetura.
- Próxima aula: Evolução controlada da arquitetura.
```

## Referência técnica curta

- ArchUnit.
- JavaClasses.
- ArchRule.
- ArchCondition.
- Layered Architecture.
- Onion Architecture.
- Ports and Adapters.
- Slice e Cycle Detection.
- FreezingArchRule.
- Architecture Baseline.
- Temporary Exception.
- Fail on Empty Should.
- Static Fitness Function.
- Architecture Gate.

Regra final:

```text
ArchUnit avançado transforma fronteiras Java em fitness functions estáticas. Service Scheduling organiza código por bounded context e por domínio, application, ports, adapters e configuration; domínio permanece independente de frameworks, application conhece domínio e ports, inbound adapters chamam use cases e outbound adapters implementam ports. Layered e onion architecture verificam o desenho global, enquanto regras específicas explicam vazamentos, acesso direto, naming e tipos expostos. Slices detectam cycles entre contexts, cuja correção deve tratar ownership e direção, não apenas packages. Custom conditions precisam ser determinísticas, testadas e acionáveis. Regras vazias falham. FreezingArchRule contém dívida legada, mas baseline não significa conformidade: o store é versionado, refreeze automático é proibido e fronteiras críticas não podem ser congeladas. Exceptions são temporárias, aprovadas e possuem owner, expiração e remediação. Pipeline, reports, evidence e gate distinguem conformidade, baseline conhecida, regressão, cycle e exception expirada, enquanto a evolução temporal permanece reservada à aula 649.
```
