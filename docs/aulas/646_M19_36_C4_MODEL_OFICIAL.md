# 646 - M19.36 - C4 Model

## Apresentação da aula

Na aula 645, você conduziu um RFC técnico do problema até a decisão. A proposta de manter a confirmação autoritativa de `Appointment` síncrona e mover efeitos externos para processamento assíncrono confiável passou por revisão, comentários, análise de risco, rollout, rollback e handoff para ADR.

Agora surge outra responsabilidade de engenharia: tornar a arquitetura compreensível para públicos diferentes sem reduzir tudo a uma caixa genérica chamada “backend” e sem produzir um diagrama impossível de manter.

Públicos diferentes precisam de níveis diferentes: produto observa pessoas e sistemas; engenharia, containers e componentes; plataforma, unidades implantáveis; segurança, fronteiras e integrações.

O C4 Model organiza essa comunicação em níveis progressivos de zoom:

```text
System Context;
Container;
Component;
Code, quando realmente necessário.
```

Cada nível responde a uma pergunta e omite detalhes inferiores.

A pergunta desta aula será:

```text
como representar uma arquitetura
com clareza,
níveis consistentes,
relações explícitas,
fronteiras honestas
e documentação sustentável?
```

O laboratório será:

```text
labs/m19/aula-646-c4-model/service-scheduling-c4
```

Você modelará o ecossistema de `Service Scheduling` como código, com catálogos, revisão, reports, evidence e gate.

A próxima aula será:

```text
647 - M19.37 - Fitness functions arquiteturais
```

Guardas arquiteturais executáveis, métricas contínuas de características, thresholds evolutivos e detecção automatizada de degradação ficam reservados para a aula 647.

Regra central:

```text
um diagrama C4 não é decoração;

é uma visão intencional
do sistema,
para um público,
com nível de abstração,
responsabilidades,
relações
e fronteiras verificáveis.
```

## Onde estamos na formação

A sequência oficial é:

```text
643 Trade offs tecnicos;
644 ADR;
645 RFC tecnico;
646 C4 Model;
647 Fitness functions arquiteturais;
648 ArchUnit avancado.
```

A progressão é:

```text
comparar opções;
registrar decisões;
revisar propostas;
representar a arquitetura;
proteger características;
validar dependências de código.
```

Trade-offs explicam por que uma opção vence. RFC organiza a discussão antes da decisão. ADR preserva a escolha. C4 mostra a estrutura resultante e suas relações.

Nesta aula, o foco é representação arquitetural. Você criará diagramas com propósito, escopo, audiência e owner. A próxima aula transformará características importantes em verificações evolutivas; por isso, não construiremos ainda um catálogo completo de fitness functions.

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-646-c4-model/service-scheduling-c4
```

Estrutura principal:

```text
service-scheduling-c4
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/c4
│   │           ├── model
│   │           ├── catalog
│   │           ├── validation
│   │           ├── traceability
│   │           └── application
│   └── test
│       └── java
│           └── br/com/formacao/c4
│               ├── model
│               ├── validation
│               ├── traceability
│               └── architecture
├── architecture
│   ├── C4_POLICY.md
│   ├── AUDIENCE_AND_PURPOSE.md
│   ├── SYSTEM_LANDSCAPE.md
│   ├── SYSTEM_CONTEXT.md
│   ├── CONTAINER_CATALOG.md
│   ├── COMPONENT_CATALOG.md
│   ├── RELATIONSHIP_CATALOG.md
│   ├── TRUST_BOUNDARIES.md
│   ├── DIAGRAM_OWNERSHIP.md
│   ├── REVIEW_POLICY.md
│   ├── NOTATION.md
│   ├── TRACEABILITY.md
│   ├── OPEN_QUESTIONS.md
│   └── CHANGE_LOG.md
├── diagrams
│   ├── workspace.dsl
│   ├── system-context.dsl
│   ├── container.dsl
│   ├── component-scheduling-api.dsl
│   ├── dynamic-confirmation.dsl
│   └── deployment-reference.dsl
├── contracts
│   ├── c4-contract.yaml
│   ├── element-policy.yaml
│   ├── relationship-policy.yaml
│   ├── boundary-policy.yaml
│   ├── view-policy.yaml
│   ├── traceability-policy.yaml
│   ├── review-policy.yaml
│   ├── quality-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── element-catalog-report.yaml
    ├── relationship-report.yaml
    ├── boundary-report.yaml
    ├── view-consistency-report.yaml
    ├── traceability-report.yaml
    └── c4-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-c4
├── validate-c4-contract.ps1
├── validate-element-catalog.ps1
├── validate-relationships.ps1
├── validate-boundaries.ps1
├── validate-view-consistency.ps1
├── validate-traceability.ps1
├── validate-diagram-review.ps1
├── run-c4-tests.ps1
├── collect-c4-evidence.ps1
└── verify-c4-gate.ps1
```

Ao final, você terá um conjunto de visões C4 que explica o ecossistema, as unidades implantáveis, os componentes internos da Scheduling API e um fluxo crítico, sem misturar níveis ou inventar relações que não existem.

## Conceito essencial

### O modelo C4

C4 significa Context, Containers, Components e Code. O modelo usa zoom progressivo. Cada visão seleciona elementos relevantes e omite detalhes inferiores.

```text
Context:
quem usa o sistema
e com quais sistemas ele se relaciona.

Container:
quais aplicações e armazenamentos
formam o sistema.

Component:
quais responsabilidades relevantes
existem dentro de um container.

Code:
detalhe de implementação
somente quando necessário.
```

### Container não significa Docker

No C4, container é uma aplicação ou armazenamento executável ou implantável separadamente. Uma API Spring Boot, uma SPA, um banco, um worker e um broker podem ser containers. Uma imagem Docker pode empacotar um container C4, mas os conceitos não são equivalentes.

### Componente não é qualquer classe

Componente representa uma unidade de responsabilidade relevante dentro de um container, normalmente composta por várias classes. `AppointmentConfirmationUseCase`, `AppointmentRepository` e `OutboxRelay` podem aparecer como componentes; `StringUtils` e cada DTO não precisam aparecer.

### Relação precisa explicar intenção

Uma seta sem rótulo é ambígua. Toda relação relevante deve indicar quem usa quem, com qual finalidade e, quando útil, por qual tecnologia ou protocolo.

### Diagrama é uma visão, não o modelo inteiro

O modelo contém elementos e relações; cada diagrama seleciona o necessário para uma pergunta.

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-646-c4-model/service-scheduling-c4

Set-Location `
  labs/m19/aula-646-c4-model/service-scheduling-c4
```

Crie as pastas `src`, `architecture`, `diagrams`, `contracts` e `reports`.

### 2. Definir a C4 Policy

Arquivo:

```text
architecture/C4_POLICY.md
```

Conteúdo essencial:

```markdown
# C4 Policy

Cada visão deve declarar:

- propósito;
- audiência;
- escopo;
- nível C4;
- owner;
- última revisão;
- fonte das relações.

Regras:

- não misturar níveis sem justificativa;
- não usar caixa genérica sem responsabilidade;
- não criar relação sem direção e descrição;
- não representar ambiente real sensível;
- não tratar container C4 como sinônimo de Docker;
- não duplicar elemento com nomes diferentes;
- não publicar diagrama sem revisão.
```

A policy impede que o diagrama vire desenho informal sem responsabilidade.

### 3. Criar o contrato principal

Arquivo:

```text
contracts/c4-contract.yaml
```

```yaml
c4:
  context:
    Service-Scheduling

  required:
    - audience
    - purpose
    - system-context
    - container-view
    - component-view
    - explicit-relationships
    - boundaries
    - ownership
    - traceability
    - review
    - evidence

  forbidden:
    - unlabeled-relationship
    - mixed-abstraction-without-reason
    - container-equals-docker-assumption
    - class-per-component-diagram
    - invented-runtime-dependency
    - real-production-topology
    - fitness-function-deep-dive

  nextLesson:
    code: M19.37
```

### 4. Definir audiência e propósito

Arquivo:

```text
architecture/AUDIENCE_AND_PURPOSE.md
```

Registre:

```text
System Context:
audience = produto, engenharia, segurança, liderança;
purpose = explicar fronteira e integrações.

Container:
audience = engenharia, plataforma, segurança;
purpose = explicar aplicações, armazenamentos e comunicação.

Component:
audience = desenvolvedores e revisores técnicos;
purpose = explicar responsabilidades internas do Scheduling API.

Dynamic:
audience = desenvolvimento e operação;
purpose = explicar confirmação e efeitos assíncronos.
```

Sem propósito, o diagrama acumula detalhes inúteis.

### 5. Identificar pessoas

Para o domínio, use pessoas como papéis, não indivíduos:

```text
Customer;
Operations Analyst;
Field Technician;
Support Engineer.
```

`Customer` consulta e confirma agendamentos. `Operations Analyst` cria, reage e acompanha operações. `Field Technician` recebe atividades preparadas. `Support Engineer` investiga falhas com acesso controlado.

Não use nomes pessoais, equipes temporárias ou cargos internos desnecessários.

### 6. Definir o sistema em foco

O software system principal será:

```text
Service Scheduling System
```

Responsabilidade:

```text
gerenciar criação,
confirmação,
reagendamento,
cancelamento,
consulta
e preparação operacional
de Appointments.
```

Evite responsabilidade genérica como “processar dados”.

### 7. Identificar sistemas externos

O contexto terá:

```text
Identity Provider;
Customer Communication System;
Capacity Management System;
Field Execution System;
Corporate Audit Platform;
Notification Provider.
```

Um sistema externo possui ownership e ciclo de vida diferentes. Não coloque PostgreSQL ou Redis no System Context; eles pertencem à visão de containers.

### 8. Criar System Landscape

Arquivo:

```text
architecture/SYSTEM_LANDSCAPE.md
```

O landscape é complementar; a visão principal será o System Context.

### 9. Criar o System Context

Arquivo:

```text
architecture/SYSTEM_CONTEXT.md
```

Registre:

```text
Customer -> Service Scheduling System:
confirma e consulta Appointment.

Operations Analyst -> Service Scheduling System:
agenda, reage, cancela e acompanha.

Field Technician -> Field Execution System:
consulta atividades preparadas.

Service Scheduling System -> Identity Provider:
autentica identidades e valida claims.

Service Scheduling System -> Capacity Management System:
consulta e reserva capacidade.

Service Scheduling System -> Customer Communication System:
publica fatos para comunicação.

Service Scheduling System -> Corporate Audit Platform:
envia registros de auditoria sanitizados.
```

Cada relação possui direção e intenção.

### 10. Definir fronteira do sistema

No Context, a fronteira inclui tudo que pertence ao produto `Service Scheduling`. Identity, Capacity, Field Execution e comunicação permanecem externos, mesmo que sejam mantidos pela mesma empresa.

Considere também autonomia, dados, responsabilidade e implantação.

### 11. Criar catálogo de elementos Java

Arquivo:

```text
src/main/java/br/com/formacao/c4/model/ElementType.java
```

```java
package br.com.formacao.c4.model;

public enum ElementType {
    PERSON,
    SOFTWARE_SYSTEM,
    CONTAINER,
    COMPONENT
}
```

Arquivo:

```text
src/main/java/br/com/formacao/c4/model/ArchitectureElement.java
```

```java
package br.com.formacao.c4.model;

import java.util.Objects;

public record ArchitectureElement(
        String id,
        String name,
        ElementType type,
        String responsibility,
        String owner,
        String parentId) {

    public ArchitectureElement {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(type);
        Objects.requireNonNull(responsibility);
        Objects.requireNonNull(owner);

        if (id.isBlank() || name.isBlank() || responsibility.isBlank()) {
            throw new IllegalArgumentException("Element fields must not be blank");
        }
    }
}
```

`parentId` liga container ao software system e componente ao container.

### 12. Criar identificadores estáveis

Use IDs semânticos:

```text
person.customer;
system.service-scheduling;
container.scheduling-api;
component.confirmation-use-case.
```

O nome pode evoluir sem quebrar referências.

### 13. Criar Relationship

```java
package br.com.formacao.c4.model;

import java.util.Objects;

public record Relationship(
        String sourceId,
        String destinationId,
        String description,
        String technology,
        boolean asynchronous,
        String dataClassification) {

    public Relationship {
        Objects.requireNonNull(sourceId);
        Objects.requireNonNull(destinationId);
        Objects.requireNonNull(description);

        if (sourceId.equals(destinationId)) {
            throw new IllegalArgumentException("Self relationship is not allowed");
        }

        if (description.isBlank()) {
            throw new IllegalArgumentException("Relationship description is required");
        }
    }
}
```

Tecnologia pode ser omitida no Context e detalhada no Container.

### 14. Criar Architecture Catalog

```java
package br.com.formacao.c4.catalog;

import br.com.formacao.c4.model.ArchitectureElement;
import br.com.formacao.c4.model.Relationship;
import java.util.ArrayList;
import java.util.List;

public final class ArchitectureCatalog {

    private final List<ArchitectureElement> elements = new ArrayList<>();
    private final List<Relationship> relationships = new ArrayList<>();

    public void addElement(ArchitectureElement element) {
        elements.add(element);
    }

    public void addRelationship(Relationship relationship) {
        relationships.add(relationship);
    }

    public List<ArchitectureElement> elements() {
        return List.copyOf(elements);
    }

    public List<Relationship> relationships() {
        return List.copyOf(relationships);
    }
}
```

O catálogo será a referência usada pelos validadores do laboratório.

### 15. Definir containers

A visão de containers terá:

```text
Customer Portal;
Operations Console;
Field Mobile Application;
Scheduling API;
Scheduling Worker;
PostgreSQL Database;
Redis Cache;
Event Broker;
Audit Exporter.
```

API executa casos de uso; Worker processa eventos; PostgreSQL é autoritativo; Redis apoia leituras; Broker transporta eventos.

### 16. Criar Container Catalog

Arquivo:

```text
architecture/CONTAINER_CATALOG.md
```

Para cada container, registre:

```text
ID;
nome;
responsabilidade;
tecnologia;
owner;
dados lidos;
dados escritos;
interfaces;
criticidade;
classificação de dados;
estratégia de implantação.
```

Exemplo:

```text
ID:
container.scheduling-api

Responsabilidade:
executar casos de uso autoritativos de Appointment.

Tecnologia:
Java 21, Spring Boot.

Escreve:
PostgreSQL e outbox.

Não faz:
envio direto ao provedor de notificação.
```

### 17. Diferenciar container e instância

`Scheduling API` é um container C4. Em produção, pode existir com cinco réplicas. Não desenhe cinco caixas na visão lógica apenas para mostrar escala.

Instâncias pertencem à Deployment View.

### 18. Definir relações de container

Exemplos:

```text
Customer Portal -> Scheduling API:
confirma e consulta Appointments via HTTPS/JSON.

Operations Console -> Scheduling API:
executa operações administrativas via HTTPS/JSON.

Scheduling API -> PostgreSQL:
lê e grava estado autoritativo via JDBC/TLS.

Scheduling API -> Redis:
lê e invalida cache não autoritativo.

Scheduling API -> Event Broker:
publica eventos por meio do outbox relay.

Scheduling Worker -> Event Broker:
consome eventos de Appointment.

Scheduling Worker -> Notification Provider:
solicita efeito externo com chave idempotente.
```

Observe que a relação descreve intenção, não apenas protocolo.

### 19. Modelar comunicação síncrona e assíncrona

Use estilo ou propriedade visual distinta para comunicação assíncrona, mas não dependa apenas da cor. O rótulo deve informar “publica evento”, “consome evento” ou “processa comando”.

A semântica deve sobreviver sem cor.

### 20. Registrar classificação de dados

No catálogo de relações, acrescente:

```text
PUBLIC;
INTERNAL;
CONFIDENTIAL;
RESTRICTED.
```

Não exponha token, segredo ou payload pessoal.

### 21. Criar Relationship Catalog

Arquivo:

```text
architecture/RELATIONSHIP_CATALOG.md
```

Cada relação registra source, destination, intenção, tecnologia, sync/async, dados e owner.

### 22. Criar Trust Boundaries

Arquivo:

```text
architecture/TRUST_BOUNDARIES.md
```

Defina:

```text
Internet boundary;
Workforce boundary;
Service Scheduling boundary;
Data boundary;
Third-party provider boundary.
```

Ela indica mudança de autenticação, autorização, exposição ou controle.

### 23. Não colocar segredo no diagrama

Nunca inclua:

```text
host real;
IP real;
connection string;
cluster real;
credential;
token;
account ID sensível;
rota administrativa privada.
```

Use nomes lógicos e tecnologias suficientes para a decisão.

### 24. Escolher o container para zoom

O zoom será na `Scheduling API`, onde estão casos de uso autoritativos, domínio, persistência e publicação transacional.

### 25. Definir componentes da Scheduling API

Use:

```text
Appointment Command Controller;
Appointment Query Controller;
Confirmation Use Case;
Rescheduling Use Case;
Cancellation Use Case;
Appointment Domain Model;
Capacity Gateway;
Appointment Repository;
Outbox Repository;
Authorization Policy;
Audit Recorder.
```

Cada componente possui responsabilidade arquitetural significativa.

### 26. Criar Component Catalog

Arquivo:

```text
architecture/COMPONENT_CATALOG.md
```

Exemplo:

```text
Component:
Confirmation Use Case.

Responsibility:
validar autorização, expected version,
regras de estado e confirmação.

Uses:
Appointment Domain Model,
Appointment Repository,
Capacity Gateway,
Outbox Repository,
Audit Recorder.

Forbidden:
chamar Notification Provider diretamente.
```

A proibição documenta a decisão do RFC anterior.

### 27. Manter o nível de abstração

No Component Diagram, não misture classes, pods, pessoas, tabelas e métodos. Sistemas externos podem aparecer apenas como contexto do zoom.

### 28. Criar validação de parent

```java
package br.com.formacao.c4.validation;

import br.com.formacao.c4.model.ArchitectureElement;
import br.com.formacao.c4.model.ElementType;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class ParentHierarchyValidator {

    public List<String> validate(List<ArchitectureElement> elements) {
        Map<String, ArchitectureElement> byId = elements.stream()
                .collect(Collectors.toMap(ArchitectureElement::id, Function.identity()));

        return elements.stream()
                .filter(element -> element.type() == ElementType.CONTAINER
                        || element.type() == ElementType.COMPONENT)
                .filter(element -> element.parentId() == null
                        || !byId.containsKey(element.parentId()))
                .map(element -> "Missing parent for " + element.id())
                .toList();
    }
}
```

O validador detecta containers e componentes órfãos.

### 29. Validar IDs duplicados

```java
package br.com.formacao.c4.validation;

import br.com.formacao.c4.model.ArchitectureElement;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class UniqueElementIdValidator {

    public List<String> validate(List<ArchitectureElement> elements) {
        Set<String> seen = new HashSet<>();

        return elements.stream()
                .filter(element -> !seen.add(element.id()))
                .map(element -> "Duplicate element ID: " + element.id())
                .toList();
    }
}
```

Duplicar um elemento com nomes levemente diferentes cria duas arquiteturas paralelas.

### 30. Validar endpoints das relações

```java
package br.com.formacao.c4.validation;

import br.com.formacao.c4.model.ArchitectureElement;
import br.com.formacao.c4.model.Relationship;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class RelationshipEndpointValidator {

    public List<String> validate(
            List<ArchitectureElement> elements,
            List<Relationship> relationships) {

        Set<String> ids = elements.stream()
                .map(ArchitectureElement::id)
                .collect(Collectors.toSet());

        return relationships.stream()
                .filter(relationship -> !ids.contains(relationship.sourceId())
                        || !ids.contains(relationship.destinationId()))
                .map(relationship -> "Unknown relationship endpoint: "
                        + relationship.sourceId() + " -> "
                        + relationship.destinationId())
                .toList();
    }
}
```

Uma relação para elemento inexistente deve falhar a validação.

### 31. Criar Structurizr DSL principal

Arquivo:

```text
diagrams/workspace.dsl
```

```text
workspace "Service Scheduling" "C4 model for Service Scheduling" {
    model {
        customer = person "Customer" "Confirms and views appointments"
        analyst = person "Operations Analyst" "Manages scheduling operations"

        scheduling = softwareSystem "Service Scheduling System" "Manages appointment lifecycle" {
            portal = container "Customer Portal" "Customer scheduling experience" "Web SPA"
            console = container "Operations Console" "Operational scheduling management" "Web SPA"
            api = container "Scheduling API" "Authoritative appointment use cases" "Java 21 and Spring Boot"
            worker = container "Scheduling Worker" "Processes reliable asynchronous effects" "Java 21"
            database = container "PostgreSQL Database" "Authoritative state and outbox" "PostgreSQL" {
                tags "Database"
            }
            broker = container "Event Broker" "Transports appointment events" "Broker" {
                tags "Broker"
            }
        }

        identity = softwareSystem "Identity Provider" "Authenticates users" "External"
        capacity = softwareSystem "Capacity Management System" "Provides capacity" "External"
        notification = softwareSystem "Notification Provider" "Delivers customer notifications" "External"

        customer -> portal "Confirms and views appointments"
        analyst -> console "Manages appointments"
        portal -> api "Uses" "HTTPS/JSON"
        console -> api "Uses" "HTTPS/JSON"
        api -> identity "Validates identity and claims" "OIDC"
        api -> capacity "Checks and reserves capacity" "HTTPS/JSON"
        api -> database "Reads and writes authoritative state" "JDBC/TLS"
        api -> broker "Publishes events through reliable relay" "Async"
        worker -> broker "Consumes appointment events" "Async"
        worker -> notification "Requests idempotent delivery" "HTTPS/JSON"
    }

    views {
        systemContext scheduling "SystemContext" {
            include *
            autoLayout lr
        }

        container scheduling "Containers" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
            }
            element "Database" {
                shape cylinder
            }
            element "External" {
                background #777777
                color #ffffff
            }
        }
    }
}
```

A DSL é versionada; layout manual não é fonte da verdade.

### 32. Separar arquivos sem duplicar modelo

Arquivos de view podem usar includes, mas elementos centrais são definidos uma vez.

### 33. Criar Component View na DSL

Dentro de `Scheduling API`, modele componentes principais e suas relações. Mostre apenas o necessário para explicar comandos autoritativos e publicação confiável.

Inclua `Notification Provider` apenas como sistema externo alcançado pelo Worker, não como dependência direta do `Confirmation Use Case`.

### 34. Criar Dynamic Diagram

Arquivo:

```text
diagrams/dynamic-confirmation.dsl
```

A sequência será:

```text
1. Customer Portal envia confirmação;
2. Controller autentica e valida request;
3. Confirmation Use Case carrega Appointment;
4. Domain Model valida transição;
5. Repository grava estado;
6. Outbox Repository grava evento na mesma transação;
7. API responde sucesso;
8. Relay publica evento;
9. Worker consome;
10. Notification Provider recebe efeito idempotente.
```

O Dynamic Diagram explica colaboração, não debugging de baixo nível.

### 35. Representar transação com honestidade

O diagrama deve indicar que estado e outbox são gravados na mesma transação local. Não desenhe uma “transação distribuída” envolvendo broker e provedor se isso não existe.

Não represente garantias inexistentes.

### 36. Criar Deployment View de referência

Arquivo:

```text
diagrams/deployment-reference.dsl
```

Use ambientes lógicos:

```text
User Device;
Edge Zone;
Application Runtime;
Data Services;
External Provider Zone.
```

Mostre instâncias de containers apenas como referência de implantação, sem quantidade real, host, região ou cluster produtivo.

### 37. Diferenciar Container e Deployment

Container View responde:

```text
quais aplicações e armazenamentos formam o sistema?
```

Deployment View responde:

```text
onde instâncias desses containers executam em um ambiente?
```

Não misture estrutura lógica com instâncias.

### 38. Criar Notation

Arquivo:

```text
architecture/NOTATION.md
```

Defina forma, cor, borda, relação síncrona, relação assíncrona, banco, sistema externo, fronteira e elemento deprecado.

Inclua legenda nas exportações.

### 39. Definir ownership

Arquivo:

```text
architecture/DIAGRAM_OWNERSHIP.md
```

Exemplo:

```text
System Context owner:
Service Scheduling Architecture Owner.

Container View owner:
Service Scheduling Engineering Lead.

Scheduling API Component View owner:
Scheduling API Maintainers.

Review cadence:
on significant architectural change
or every 90 days.
```

Owner responde por coerência e revisão.

### 40. Criar Review Policy

Arquivo:

```text
architecture/REVIEW_POLICY.md
```

Toda revisão deve verificar:

```text
purpose;
audience;
scope;
level;
element ownership;
responsibilities;
relationships;
boundaries;
security;
data classification;
consistency with ADR and RFC;
removed or deprecated elements;
open questions.
```

### 41. Criar traceability

Arquivo:

```text
architecture/TRACEABILITY.md
```

Mapeie:

```text
RFC-0001 -> Container View;
RFC-0001 -> Dynamic Confirmation;
ADR resultante -> Scheduling Worker;
ADR resultante -> Event Broker relation;
Requirement CONFIRM_APPOINTMENT -> Confirmation Use Case;
Risk DIRECT_EXTERNAL_EFFECT -> forbidden API-to-provider relationship.
```

Traceability explica por que o elemento existe.

### 42. Criar modelo Java de rastreabilidade

```java
package br.com.formacao.c4.traceability;

import java.util.Objects;

public record TraceabilityLink(
        String sourceArtifact,
        String targetElementId,
        String reason) {

    public TraceabilityLink {
        Objects.requireNonNull(sourceArtifact);
        Objects.requireNonNull(targetElementId);
        Objects.requireNonNull(reason);
    }
}
```

### 43. Validar links de rastreabilidade

```java
package br.com.formacao.c4.validation;

import br.com.formacao.c4.model.ArchitectureElement;
import br.com.formacao.c4.traceability.TraceabilityLink;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class TraceabilityValidator {

    public List<String> validate(
            List<ArchitectureElement> elements,
            List<TraceabilityLink> links) {

        Set<String> ids = elements.stream()
                .map(ArchitectureElement::id)
                .collect(Collectors.toSet());

        return links.stream()
                .filter(link -> !ids.contains(link.targetElementId()))
                .map(link -> "Unknown traceability target: " + link.targetElementId())
                .toList();
    }
}
```

### 44. Detectar responsabilidades vagas

Crie um validador que rejeite descrições como:

```text
manages things;
handles data;
backend service;
main component;
processes requests.
```

A responsabilidade precisa indicar capacidade ou decisão concreta.

### 45. Detectar relação sem intenção

Rótulos proibidos:

```text
calls;
uses;
connects;
communicates.
```

Eles podem aparecer acompanhados de intenção, mas isolados não explicam a arquitetura.

Prefira:

```text
reserves capacity;
publishes AppointmentConfirmed;
validates identity claims;
reads authoritative Appointment state.
```

### 46. Revisar consistência entre níveis

Confirme:

```text
Service Scheduling existe no Context;
seus containers aparecem no Container View;
Scheduling API aparece no Container View;
seus componentes aparecem no Component View;
relações externas do Component View chegam a elementos existentes;
nenhum componente pertence ao container errado.
```

### 47. Revisar direção das relações

A direção reflete interação: `Scheduling API -> PostgreSQL`. Em eventos, diferencie publisher, broker e consumer.

### 48. Revisar fronteiras de confiança

Confirme onde ocorre:

```text
autenticação;
autorização;
validação de tenant;
criptografia em trânsito;
redação de logs;
controle de efeito externo;
acesso de suporte.
```

O diagrama não substitui threat model, mas ajuda a localizar superfícies.

### 49. Revisar multi-tenancy

Mostre `Tenant Context` validado e propagado. Represente o modelo real de isolamento.

### 50. Revisar consistência e autoridade

Marque PostgreSQL como autoridade; Redis e projeções são derivados.

### 51. Revisar efeitos externos

Proíba `Scheduling API -> Notification Provider`; o fluxo passa por outbox, broker e worker.

### 52. Criar quality policy

Arquivo:

```text
contracts/quality-policy.yaml
```

```yaml
quality:
  missingAudience:
    action: FAIL
  missingPurpose:
    action: FAIL
  duplicateElementId:
    action: FAIL
  unknownRelationshipEndpoint:
    action: FAIL
  blankRelationshipDescription:
    action: FAIL
  orphanComponent:
    action: FAIL
  mixedLevelWithoutReason:
    action: FAIL
  directNotificationEffectFromApi:
    action: FAIL
  sensitiveProductionDetail:
    action: FAIL
```

### 53. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

```yaml
nonAnticipation:
  lesson647:
    forbidden:
      - continuous-fitness-score
      - architecture-characteristic-threshold-catalog
      - evolutionary-metric-trend
      - automated-governance-deep-dive

  lesson648:
    forbidden:
      - advanced-ArchUnit-layer-rules
      - slices-cycle-deep-dive
      - custom-ArchCondition-deep-dive

  allowed:
    - document-structure-validation
    - element-catalog-validation
    - relationship-consistency-validation
    - traceability-validation
```

### 54. Criar testes de catálogo

`ElementCatalogTest` deve validar:

```text
IDs únicos;
responsabilidades não vazias;
owners presentes;
parents existentes;
tipos coerentes;
nenhum componente solto.
```

### 55. Criar testes de relacionamento

`RelationshipCatalogTest` deve validar:

```text
source existente;
destination existente;
descrição intencional;
sem self relationship;
tecnologia quando exigida;
classificação de dados válida.
```

### 56. Criar teste da decisão do RFC

```java
package br.com.formacao.c4.architecture;

import static org.junit.jupiter.api.Assertions.assertFalse;
import br.com.formacao.c4.model.Relationship;
import java.util.List;
import org.junit.jupiter.api.Test;

class AsyncEffectBoundaryTest {

    @Test
    void schedulingApiMustNotCallNotificationProviderDirectly() {
        List<Relationship> relationships = TestArchitecture.relationships();

        boolean directCallExists = relationships.stream()
                .anyMatch(relationship ->
                        relationship.sourceId().equals("container.scheduling-api")
                                && relationship.destinationId().equals("system.notification-provider"));

        assertFalse(directCallExists);
    }
}
```

O teste valida o catálogo; guardas sobre código ficam para as próximas aulas.

### 57. Criar View Consistency Test

Valide que cada elemento incluído em uma view existe no catálogo e que o nível declarado combina com o tipo de elemento principal.

Context View não inclui componentes internos sem justificativa.

### 58. Criar reports

Exemplo:

```yaml
c4:
  people: 4
  softwareSystems: 7
  containers: 9
  components: 10
  relationships: 24
  trustBoundaries: 5
  views:
    systemContext: PASS
    container: PASS
    component: PASS
    dynamic: PASS
    deploymentReference: PASS
  duplicateElements: 0
  unknownEndpoints: 0
  unlabeledRelationships: 0
  orphanComponents: 0
  forbiddenDirectEffects: 0
  result: PASS
```

### 59. Criar evidence

Arquivo:

```text
contracts/c4-evidence.yaml
```

Campos permitidos:

```text
lesson;
project;
view count;
person count;
system count;
container count;
component count;
relationship count;
boundary count;
duplicate count;
unknown endpoint count;
unlabeled relationship count;
orphan component count;
traceability status;
review status;
test status;
documentation status;
gate status;
timestamp.
```

Não inclua topologia produtiva, credenciais, nomes pessoais ou endpoints privados.

### 60. Criar o gate

O gate valida:

```text
policy;
audience;
purpose;
elements;
responsibilities;
relationships;
boundaries;
levels;
view consistency;
security;
data classification;
ownership;
review;
traceability;
RFC and ADR alignment;
tests;
reports;
evidence.
```

Status:

```text
PASS;
FAIL_POLICY;
FAIL_AUDIENCE;
FAIL_ELEMENT_CATALOG;
FAIL_RELATIONSHIP;
FAIL_BOUNDARY;
FAIL_VIEW_LEVEL;
FAIL_TRACEABILITY;
FAIL_SECURITY;
FAIL_REVIEW;
FAIL_TEST;
INCONCLUSIVE.
```

### 61. Executar validações

```powershell
.\scripts\m19\service-scheduling-c4\validate-c4-contract.ps1

.\scripts\m19\service-scheduling-c4\validate-element-catalog.ps1

.\scripts\m19\service-scheduling-c4\validate-relationships.ps1

.\scripts\m19\service-scheduling-c4\validate-boundaries.ps1

.\scripts\m19\service-scheduling-c4\validate-view-consistency.ps1

.\scripts\m19\service-scheduling-c4\validate-traceability.ps1

.\scripts\m19\service-scheduling-c4\validate-diagram-review.ps1

.\scripts\m19\service-scheduling-c4\run-c4-tests.ps1

.\scripts\m19\service-scheduling-c4\collect-c4-evidence.ps1

.\scripts\m19\service-scheduling-c4\verify-c4-gate.ps1
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

### 62. Fazer revisão humana final

Automação não garante boa comunicação. Revise:

```text
uma pessoa nova entende o propósito em dois minutos?
as responsabilidades distinguem os elementos?
as relações explicam intenção?
as fronteiras são honestas?
o nível está coerente?
o diagrama contradiz RFC ou ADR?
existe detalhe que deveria ser omitido?
existe decisão importante invisível?
```

### 63. Encerrar o laboratório

Confirme:

```text
System Context criado;
Container View criada;
Component View focada;
Dynamic View criada;
Deployment View de referência criada;
elementos catalogados;
relações rotuladas;
fronteiras definidas;
owners registrados;
traceability criada;
RFC e ADR refletidos;
nenhum segredo exposto;
nenhuma relação inventada;
reports e evidence gerados;
gate aprovado.
```

## Entendendo o que foi feito

### A arquitetura ganhou níveis de zoom

Cada público recebeu o nível de detalhe necessário.

### Elementos ganharam identidade e responsabilidade

Elementos receberam IDs, owners e responsabilidades concretas.

### Relações ganharam intenção

Relações passaram a explicar intenção e direção.

### Fronteiras ganharam significado

Fronteiras ficaram explícitas sem expor topologia real.

### RFC e ADR ganharam representação

A decisão assíncrona aparece nas views e impede chamada direta ao provedor.

### Documentação ganhou governança proporcional

Owner, revisão, traceability e gate mantêm coerência documental.

## Erros comuns importantes

### Misturar todos os níveis em um diagrama

Misturar pessoas, classes, pods e bancos destrói o nível de abstração.

### Tratar container como Docker

Container C4 é unidade lógica; Docker é empacotamento.

### Transformar cada classe em componente

O diagrama perde estabilidade.

### Criar seta sem rótulo

“Usa” sozinho não explica intenção.

### Desenhar arquitetura desejada como atual

Represente o estado real.

### Duplicar elemento entre arquivos

IDs duplicados geram contradição.

### Colocar topologia produtiva sensível

Use nomes lógicos e dados sanitizados.

### Usar cor como única semântica

A semântica não pode depender só de cor.

### Criar Component View para tudo

Aprofunde apenas quando o zoom ajuda.

### Confundir modelo e imagem exportada

PNG é saída; o modelo versionado é a fonte.

### Automatizar sem revisar comunicação

A revisão humana continua obrigatória.

### Antecipar fitness functions

Fitness functions executáveis pertencem à aula 647.

## Comandos úteis

### Validar elementos

```powershell
.\scripts\m19\service-scheduling-c4\validate-element-catalog.ps1
```

### Validar relações

```powershell
.\scripts\m19\service-scheduling-c4\validate-relationships.ps1
```

### Validar views

```powershell
.\scripts\m19\service-scheduling-c4\validate-view-consistency.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-c4\run-c4-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-c4\verify-c4-gate.ps1
```

## Exercício guiado

Modele uma segunda visão para `Field Execution Preparation`.

Você deve:

1. definir público e propósito;
2. identificar os containers envolvidos;
3. mostrar somente relações necessárias;
4. classificar comunicação síncrona e assíncrona;
5. registrar dados e fronteiras;
6. criar um Dynamic Diagram para preparação de atividade;
7. relacionar a visão a requisitos e ADRs;
8. validar elementos e relações;
9. executar revisão humana;
10. gerar report e evidence.

A visão não pode transformar a projeção de campo em fonte autoritativa de `Appointment`.

## Critérios de aceite

- arquivo, H1, número, módulo e título seguem a grade oficial;
- continuidade com a aula 645 foi preservada;
- ponte aponta para a aula 647;
- laboratório `service-scheduling-c4` foi criado;
- C4 Policy foi definida;
- audiência e propósito existem por view;
- pessoas são papéis e não indivíduos;
- sistema em foco possui responsabilidade clara;
- sistemas externos foram identificados;
- System Context foi criado;
- Container View foi criada;
- Component View focada na Scheduling API foi criada;
- Dynamic View de confirmação foi criada;
- Deployment View de referência foi criada;
- container C4 não foi confundido com Docker;
- componentes não representam cada classe;
- IDs de elementos são estáveis e únicos;
- parent hierarchy foi validada;
- relações possuem source, destination e descrição;
- comunicação síncrona e assíncrona foi diferenciada;
- classificações de dados foram registradas;
- trust boundaries foram documentadas;
- nenhuma topologia real sensível foi exposta;
- PostgreSQL permanece fonte autoritativa;
- Redis não aparece como autoridade;
- API não chama Notification Provider diretamente;
- decisão do RFC aparece no modelo;
- traceability com RFC e ADR foi criada;
- owners e review policy foram definidos;
- notação e legenda foram documentadas;
- consistência entre níveis foi validada;
- elementos órfãos foram proibidos;
- endpoints desconhecidos foram proibidos;
- responsabilidades vagas foram detectadas;
- reports, evidence e gate foram criados;
- revisão humana foi executada;
- fitness functions arquiteturais não foram aprofundadas;
- ArchUnit avançado não foi antecipado;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-646-c4-model/service-scheduling-c4 `
  scripts/m19/service-scheduling-c4 `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|productionTopology|realCluster|personalData|fitnessScore|ArchConditionDeepDive"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): modelar arquitetura com C4"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- endpoints privados;
- topologia produtiva real;
- nomes pessoais;
- fitness functions aprofundadas;
- regras ArchUnit avançadas.

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou o C4 Model.

Você criou System Landscape complementar, System Context, Container View, Component View da Scheduling API, Dynamic View de confirmação e Deployment View de referência. Também criou catálogos de elementos, containers, componentes e relações; trust boundaries; notação; ownership; review policy; traceability; validators; testes; reports; evidence e gate.

Você comprovou que C4 é um modelo de comunicação por níveis, não uma coleção de desenhos. Context explica pessoas e sistemas; Container explica aplicações e armazenamentos; Component explica responsabilidades internas relevantes; Dynamic explica uma colaboração; Deployment explica instâncias em ambientes. IDs, owners, relações intencionais, fronteiras e rastreabilidade preservam coerência.

A decisão do RFC anterior ficou visível: confirmação grava estado e outbox na transação local; publicação e efeitos externos seguem worker e broker; a Scheduling API não chama o Notification Provider diretamente.

A próxima aula será:

```text
647 - M19.37 - Fitness functions arquiteturais
```

Nela, você transformará características arquiteturais importantes em sinais e verificações executáveis, com thresholds, frequência, owner, resposta e evolução controlada.

Fitness functions arquiteturais e ArchUnit avançado não foram aprofundados nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini audiência e propósito por view.
- [ ] Criei System Context.
- [ ] Criei Container View.
- [ ] Criei Component View focada.
- [ ] Rotulei relações com intenção.
- [ ] Modelei fronteiras de confiança.
- [ ] Criei Dynamic View.
- [ ] Relacionei C4 com RFC e ADR.
- [ ] Executei testes e gate.
- [ ] Revisei a comunicação humana.

## Troubleshooting adicional

### O Context está cheio de bancos e filas

Mova detalhes internos para a Container View. Context mostra pessoas, sistema em foco e sistemas externos.

### A Container View mostra classes

Suba o nível. Mostre aplicações, workers, bancos, caches e brokers.

### O Component Diagram possui centenas de caixas

Agrupe por responsabilidade relevante e escolha apenas um container que realmente precisa de zoom.

### A equipe chama cada pod de container C4

Modele a aplicação como container e represente instâncias na Deployment View.

### Existem duas caixas para a mesma API

Crie ID estável e fonte única do elemento. Views apenas referenciam.

### A seta diz apenas “usa”

Descreva a finalidade: reservar capacidade, publicar evento, validar claims ou consultar estado.

### O diagrama contradiz o ADR

O modelo está stale ou a decisão mudou sem registro. Corrija a fonte e preserve traceability.

### O worker não aparece no fluxo

Revise a decisão de efeitos assíncronos e o Dynamic Diagram.

### A API aparece chamando o provedor diretamente

A relação viola a fronteira aprovada no RFC. Remova e valide o fluxo por outbox, broker e worker.

### O diagrama revela cluster e hostname reais

Substitua por nomes lógicos e ambientes de referência.

### As cores não são compreendidas

Adicione rótulos, formas, linhas e legenda acessível.

### A validação passou, mas o desenho está confuso

Faça revisão humana orientada a público, propósito, densidade e narrativa.

### A equipe quer transformar todas as regras em métricas agora

Registre a necessidade. Fitness functions serão aprofundadas na aula 647.

## Perguntas de revisão

1. O que significa C4?
2. Qual pergunta o System Context responde?
3. O que é um container no C4?
4. Container C4 é sinônimo de Docker?
5. O que é um componente?
6. Toda classe deve aparecer no Component Diagram?
7. O que é uma relação bem descrita?
8. Por que audiência e propósito são obrigatórios?
9. Qual diferença entre modelo e view?
10. Qual diferença entre Container e Deployment View?
11. Quando usar Dynamic Diagram?
12. O que é trust boundary?
13. Por que usar IDs estáveis?
14. Por que não duplicar elementos entre arquivos?
15. Como representar comunicação assíncrona?
16. O que a traceability conecta?
17. Por que owner é necessário?
18. O que não deve aparecer em diagramas versionados?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

## Roteiro de resposta

1. Context, Containers, Components e Code.
2. Pessoas, sistema em foco e sistemas externos.
3. Aplicação ou armazenamento executável ou implantável separadamente.
4. Não.
5. Unidade relevante de responsabilidade dentro de um container.
6. Não.
7. Possui direção, intenção e tecnologia quando útil.
8. Para controlar detalhe e narrativa.
9. Modelo contém elementos; view seleciona elementos para uma pergunta.
10. Container mostra estrutura lógica; Deployment mostra instâncias em ambientes.
11. Para explicar colaboração e ordem de um cenário.
12. Limite de confiança, controle ou responsabilidade.
13. Para preservar referências mesmo com mudança de nome visível.
14. Para evitar arquiteturas contraditórias.
15. Com rótulo explícito e notação que não dependa apenas de cor.
16. Requisitos, riscos, RFCs e ADRs aos elementos e relações.
17. Para garantir manutenção e revisão.
18. Segredos, dados pessoais e topologia produtiva sensível.
19. Fitness functions arquiteturais.
20. Fitness functions arquiteturais.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 646 - M19.36 - C4 Model**

- Aprofundei o C4 Model.
- Criei o laboratório `service-scheduling-c4`.
- Diferenciei Context, Container, Component e Code.
- Defini audiência e propósito por view.
- Criei System Landscape complementar.
- Criei System Context de Service Scheduling.
- Modelei pessoas como papéis.
- Identifiquei sistemas externos e fronteiras.
- Criei Container View com frontends, API, worker, PostgreSQL, Redis e broker.
- Diferenciei container C4 de Docker e instância.
- Criei Component View focada na Scheduling API.
- Evitei representar cada classe como componente.
- Criei catálogo com IDs estáveis, responsibilities e owners.
- Modelei relações com direção, intenção, tecnologia e sincronia.
- Registrei classificação de dados e trust boundaries.
- Criei Structurizr DSL versionada.
- Criei Dynamic View para confirmação e efeitos assíncronos.
- Criei Deployment View de referência sem topologia real.
- Refleti a decisão do RFC e do ADR no modelo.
- Proibi chamada direta da API ao Notification Provider.
- Criei notação, ownership, review policy e traceability.
- Validei IDs, parents, endpoints, responsabilidades e views.
- Criei testes, reports, evidence e gate.
- Não antecipei fitness functions arquiteturais ou ArchUnit avançado.
- Próxima aula: Fitness functions arquiteturais.
```

## Referência técnica curta

- C4 Model.
- System Landscape.
- System Context.
- Container View.
- Component View.
- Code View.
- Dynamic Diagram.
- Deployment Diagram.
- Person.
- Software System.
- Container.
- Component.
- Relationship.
- Trust Boundary.
- Architecture as Code.
- Structurizr DSL.
- Diagram Ownership.
- Traceability.
- View Consistency.

Regra final:

```text
C4 Model comunica arquitetura por zoom progressivo e propósito explícito. System Context mostra pessoas, sistema em foco e sistemas externos; Container View mostra aplicações e armazenamentos implantáveis; Component View aprofunda responsabilidades relevantes dentro de um container; Dynamic View explica colaboração em um cenário; Deployment View relaciona instâncias a ambientes sem substituir a estrutura lógica. Cada elemento possui ID estável, nome, responsabilidade, owner e parent; cada relação possui direção, intenção, tecnologia quando útil, sincronia e classificação de dados. Containers C4 não são sinônimo de Docker, componentes não representam cada classe e views não duplicam o modelo. Fronteiras de sistema, confiança, dados e provedores permanecem explícitas, enquanto segredos, dados pessoais e topologia produtiva são proibidos. O modelo reflete requisitos, RFCs e ADRs, preserva PostgreSQL como autoridade, mostra outbox, broker e worker e impede efeito direto da Scheduling API no Notification Provider. Catálogos, DSL, revisão humana, validators, reports, evidence e gate mantêm coerência documental, enquanto fitness functions arquiteturais permanecem reservadas à aula 647 e ArchUnit avançado à aula 648.
```
