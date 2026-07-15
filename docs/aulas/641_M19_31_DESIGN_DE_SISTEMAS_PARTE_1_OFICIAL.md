# 641 - M19.31 - Design de sistemas parte 1

## Apresentação da aula

Na aula 640, você aprofundou resiliência arquitetural: deadlines, retries seguros, circuit breakers, bulkheads, load shedding, fallbacks e recuperação gradual. Agora você começará um design de sistema completo a partir de um problema ainda aberto.

Esse trabalho não começa desenhando caixas. Começa reduzindo ambiguidade.

Considere:

```text
Precisamos de um sistema de agendamento
rápido, seguro,
escalável e altamente disponível.
```

A frase não informa volume, operações críticas, atraso aceitável, retenção, regras de concorrência, integrações ou escopo. Sem essas respostas, o diagrama apenas esconde suposições.

A pergunta desta aula será:

```text
como transformar um problema amplo
em requisitos, estimativas,
dados, APIs, componentes
e fluxos verificáveis?
```

O laboratório será:

```text
labs/m19/aula-641-design-sistemas-parte-1/service-scheduling-system-design
```

Você projetará a primeira metade de `Service Scheduling`: solicitações de serviço, consulta e reserva de capacidade, confirmação, reagendamento, cancelamento, pesquisa e publicação de eventos.

Nesta parte serão produzidos problem statement, escopo, atores, requisitos, SLOs, premissas, estimativas, domínio, dados, APIs, componentes, ownership, fluxos, rastreabilidade, reports, evidence e gate.

A próxima aula será:

```text
642 - M19.32 - Design de sistemas parte 2
```

Nela, o desenho será submetido a crescimento, gargalos, falhas, segurança, observabilidade, deployment, custo e evolução. A aula 643 aprofundará trade-offs técnicos.

Regra central:

```text
design de sistemas
não começa pela tecnologia;
começa pelo problema,
pelas restrições,
pelos números
e pelas decisões rastreáveis.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
639 Escalabilidade horizontal vertical;
640 Resiliencia arquitetural;
641 Design de sistemas parte 1;
642 Design de sistemas parte 2;
643 Trade offs tecnicos.
```

Você já estudou consistência, CAP, PACELC, idempotência, multi-tenancy, escalabilidade e resiliência. Agora combinará essas competências sem transformar o design em uma lista de padrões.

O foco será decompor o problema, definir requisitos e SLOs, estimar volume, modelar dados, APIs, componentes, ownership e fluxos. Gargalos, falhas, segurança, observabilidade, deployment, custo e defesa final permanecem para a parte 2.

---

## Objetivo prático

O laboratório será organizado em cinco áreas:

```text
service-scheduling-system-design
├── src/main/java/br/com/formacao/systemdesign
│   ├── requirement
│   ├── estimate
│   ├── domain
│   ├── component
│   ├── api
│   ├── flow
│   └── validation
├── src/test/java/br/com/formacao/systemdesign
├── design
├── contracts
└── reports
```

Em `design`, ficarão problem statement, escopo, requisitos, SLOs, assumptions, estimativas, domínio, dados, APIs, componentes, ownership, fluxos, riscos e rastreabilidade. Em `contracts`, ficarão as políticas verificáveis. O código Java representará requisitos, estimativas, componentes, APIs, fluxos e validadores. Os testes comprovarão cobertura, ownership e não antecipação.

Scripts:

```text
scripts/m19/service-scheduling-system-design-part-one
├── validate-system-design-contract.ps1
├── validate-requirements.ps1
├── validate-workload-estimates.ps1
├── validate-api-and-components.ps1
├── validate-data-ownership.ps1
├── validate-flow-and-traceability.ps1
├── run-system-design-part-one-tests.ps1
├── collect-system-design-part-one-evidence.ps1
└── verify-system-design-part-one-gate.ps1
```

---

## Conceito essencial

### Design de sistemas é redução estruturada de incerteza

Um design não elimina toda incerteza. Ele transforma incertezas ocultas em premissas, perguntas abertas, riscos e decisões revisáveis.

Antes do design, a equipe pode discordar sem perceber. Depois do design, as discordâncias devem aparecer em artefatos verificáveis:

```text
requisito;
prioridade;
volume;
SLO;
owner;
fluxo;
risco;
premissa;
pergunta aberta;
decisão.
```

### Requisitos funcionais e qualidades

Requisito funcional descreve o que o sistema faz.

Exemplos:

```text
criar solicitação de serviço;
consultar janelas;
reservar capacidade;
confirmar agendamento;
reagendar;
cancelar;
pesquisar compromissos;
publicar evento de confirmação.
```

Requisito de qualidade descreve como o sistema precisa se comportar.

Exemplos:

```text
p95 da confirmação abaixo de 600 ms;
zero dupla reserva confirmada;
99,95% de disponibilidade para consulta;
isolamento entre tenants;
rastreabilidade de alterações;
recuperação em até 30 minutos.
```

“Ser rápido” não é um requisito verificável. “P95 menor que 600 ms no pico projetado” é.

### Estimativas não são previsões exatas

Estimativas de design servem para descobrir ordem de grandeza e gargalos prováveis.

Você não precisa acertar o tráfego futuro com precisão absoluta. Precisa deixar claro:

- quais números foram usados;
- de onde vieram;
- qual margem foi aplicada;
- quais cenários mudariam o desenho;
- como o sistema será medido depois.

### Componentes seguem responsabilidade

Um componente deve existir porque possui responsabilidade, dados, SLO, ritmo de mudança ou boundary claro. Não porque “microserviços são modernos”.

No primeiro desenho, menos componentes bem definidos são melhores que dezenas de caixas sem ownership.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-641-design-sistemas-parte-1/service-scheduling-system-design

Set-Location `
  labs/m19/aula-641-design-sistemas-parte-1/service-scheduling-system-design
```

Crie também as pastas `design`, `contracts`, `reports`, `src/main/java` e `src/test/java`.

---

### 2. Criar o System Design Charter

Arquivo:

```text
design/SYSTEM_DESIGN_CHARTER.md
```

Conteúdo:

```markdown
# System Design Charter

Sistema

Service Scheduling.

Objetivo

Projetar o núcleo de agendamento de serviços
com requisitos, estimativas, dados,
APIs, componentes e fluxos rastreáveis.

Princípios

- começar pelo problema;
- registrar premissas;
- estimar ordem de grandeza;
- definir ownership;
- manter decisões rastreáveis;
- evitar tecnologia sem justificativa;
- separar escopo atual de evolução futura.

Parte 1

- requisitos;
- SLOs iniciais;
- estimativas;
- domínio;
- dados;
- APIs;
- componentes;
- fluxos.

Fora da parte 1

- stress detalhado do desenho;
- plano completo de escalabilidade;
- threat model completo;
- estratégia final de observabilidade;
- deployment detalhado;
- comparação formal de alternativas.
```

O charter impede que a discussão salte imediatamente para ferramentas.

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/system-design-part-one-contract.yaml
```

Conteúdo:

```yaml
systemDesignPartOne:
  context:
    Service-Scheduling

  required:
    - problem-statement
    - scope
    - actors-and-journeys
    - functional-requirements
    - quality-requirements
    - initial-SLOs
    - assumptions
    - open-questions
    - workload-estimates
    - domain-model
    - data-catalog
    - API-catalog
    - component-map
    - data-ownership
    - synchronous-flows
    - asynchronous-flows
    - requirement-traceability
    - tests
    - evidence
    - gate

  forbidden:
    - technology-first-design
    - requirement-without-owner
    - unbounded-scope
    - unexplained-estimate
    - component-without-responsibility
    - shared-data-without-owner
    - flow-without-failure-outcome
    - full-part-two-deep-dive
    - trade-off-framework-deep-dive

  nextLesson:
    code:
      M19.32
```

---

### 4. Escrever o Problem Statement

Arquivo:

```text
design/PROBLEM_STATEMENT.md
```

Use uma descrição curta e mensurável:

```text
Service Scheduling precisa receber solicitações de serviço,
consultar capacidade disponível,
reservar uma janela,
confirmar o Appointment
e distribuir o resultado
para comunicação, execução de campo e consulta operacional.

O sistema deve impedir dupla reserva confirmada,
manter isolamento por tenant,
permitir pesquisa rápida
e preservar rastreabilidade das transições.
```

Evite misturar solução no problema.

Isto seria inadequado:

```text
Construir cinco microserviços com Kafka e Redis.
```

Essa frase descreve uma possível implementação, não o problema.

---

### 5. Definir escopo e não escopo

Arquivo:

```text
design/SCOPE.md
```

Escopo da primeira versão:

```text
criar Service Request;
consultar disponibilidade;
reservar capacidade;
confirmar Appointment;
reagendar;
cancelar;
consultar detalhe;
pesquisar por período, status e tenant;
publicar eventos de integração;
registrar auditoria de transição.
```

Não escopo:

```text
roteirização avançada;
precificação dinâmica;
folha de pagamento do técnico;
otimização geoespacial global;
portal completo do cliente;
analytics preditivo;
marketplace de prestadores.
```

O não escopo protege prazo, design e linguagem.

---

### 6. Identificar atores e jornadas

Arquivo:

```text
design/ACTORS_AND_JOURNEYS.md
```

Atores iniciais:

- cliente corporativo;
- operador de agendamento;
- técnico de campo;
- sistema de capacidade;
- sistema de comunicação;
- auditoria e suporte;
- processos de integração.

Jornada principal:

```text
cliente cria solicitação;
operador consulta janelas;
sistema reserva capacidade;
cliente confirma;
Appointment é persistido;
evento é publicado;
comunicação é enviada;
execução de campo recebe preparação;
pesquisa operacional é atualizada.
```

Registre também reagendamento, cancelamento e consulta.

---

### 7. Criar catálogo de requisitos funcionais

Arquivo:

```text
design/FUNCTIONAL_REQUIREMENTS.md
```

Modelo:

```text
FR-001
Nome: criar solicitação de serviço.
Prioridade: MUST.
Ator: cliente corporativo.
Entrada: tenant, serviço, endereço, janela desejada.
Saída: serviceRequestId e status inicial.
Regra: tenant deve estar ativo.
Owner: Service Scheduling.
Evidência: API e teste de contrato.
```

Requisitos iniciais:

```text
FR-001 criar Service Request;
FR-002 consultar janelas disponíveis;
FR-003 reservar capacidade;
FR-004 confirmar Appointment;
FR-005 reagendar Appointment;
FR-006 cancelar Appointment;
FR-007 consultar detalhe;
FR-008 pesquisar Appointments;
FR-009 publicar eventos de integração;
FR-010 registrar auditoria;
FR-011 proteger isolamento de tenant;
FR-012 consultar histórico de transições.
```

Cada requisito deve ter identificador, prioridade, owner e evidência.

---

### 8. Modelar requisito em Java

```java
public record FunctionalRequirement(
        String id,
        String name,
        RequirementPriority priority,
        String actor,
        String owner,
        Set<String> evidenceTypes) {

    public FunctionalRequirement {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(priority);
        Objects.requireNonNull(actor);
        Objects.requireNonNull(owner);
        evidenceTypes = Set.copyOf(evidenceTypes);

        if (!id.matches("FR-[0-9]{3}")) {
            throw new IllegalArgumentException(
                    "Functional requirement id is invalid");
        }
    }
}
```

Prioridade:

```java
public enum RequirementPriority {
    MUST,
    SHOULD,
    COULD,
    WONT_NOW
}
```

`WONT_NOW` ajuda a registrar decisões de escopo sem apagar a necessidade futura.

---

### 9. Criar requisitos de qualidade

Arquivo:

```text
design/QUALITY_REQUIREMENTS.md
```

Exemplos iniciais:

```text
QR-001
Qualidade: consistência.
Cenário: confirmação concorrente da mesma reserva.
Meta: no máximo um Appointment confirmado.
Métrica: conflicting confirmed reservations.
Owner: Service Scheduling.

QR-002
Qualidade: latência.
Operação: GET /appointments/{id}.
Meta: p95 <= 250 ms no pico projetado.
Owner: Query API.

QR-003
Qualidade: disponibilidade.
Operação: pesquisa operacional.
Meta: 99,95% mensal.
Owner: Query API.

QR-004
Qualidade: isolamento.
Cenário: tenant A tenta consultar dado do tenant B.
Meta: zero acesso cruzado.
Owner: Security Architecture.

QR-005
Qualidade: auditabilidade.
Cenário: toda transição de status.
Meta: actor, timestamp, versão, origem e motivo registrados.
Owner: Service Scheduling.
```

Um requisito de qualidade deve conter cenário, estímulo, resposta, métrica e limite.

---

### 10. Criar SLOs iniciais

Arquivo:

```text
design/SLO_AND_ERROR_BUDGET.md
```

Proposta inicial:

```text
Create Service Request:
availability 99,9%;
p95 500 ms.

Confirm Appointment:
availability 99,9%;
p95 600 ms;
conflicting confirmed reservations = 0.

Appointment Details:
availability 99,95%;
p95 250 ms.

Appointment Search:
availability 99,95%;
p95 800 ms para até 50 resultados.

Event Publication:
99,9% publicados em até 30 segundos;
100% reconciliáveis por outbox.
```

SLO não é desejo. É compromisso operacional mensurável.

Nesta etapa, os números são hipóteses documentadas. Na parte 2, você verificará se o desenho consegue sustentá-los.

---

### 11. Registrar premissas

Arquivo:

```text
design/ASSUMPTIONS.md
```

Exemplos:

```text
A-001:
1.000 tenants ativos.

A-002:
200 mil Appointments criados por dia.

A-003:
pico de 10 vezes a média durante campanhas.

A-004:
80% do tráfego é leitura.

A-005:
Appointment retido por 5 anos.

A-006:
eventos médios possuem 2 KB.

A-007:
Service Scheduling não calcula roteirização global.
```

Cada premissa deve informar owner, data de revisão e impacto se estiver errada.

---

### 12. Registrar perguntas abertas

Arquivo:

```text
design/OPEN_QUESTIONS.md
```

Exemplos:

```text
Qual é o pico real por tenant?

A consulta precisa ser global ou sempre por tenant?

Cancelamento emergencial pode operar sem Capacity Service?

Qual retenção é legalmente obrigatória?

Quais eventos precisam de ordem por Appointment?

Existe residência regional de dados?

O histórico precisa ser imutável?

A pesquisa aceita atraso de quantos segundos?
```

Pergunta aberta não invalida o design, desde que esteja visível e possua owner.

---

### 13. Estimar tráfego médio

Assuma:

```text
200.000 Appointments por dia;
5 writes principais por Appointment;
20 reads por Appointment;
86.400 segundos por dia.
```

Writes médios:

```text
200.000 * 5 / 86.400
aproximadamente 12 writes por segundo.
```

Reads médios:

```text
200.000 * 20 / 86.400
aproximadamente 46 reads por segundo.
```

Com pico de 10 vezes:

```text
120 writes por segundo;
460 reads por segundo.
```

A conclusão não é “precisamos de dezenas de serviços”. A conclusão é que a ordem de grandeza inicial ainda é moderada, mas o desenho precisa suportar concentração por tenant, campanhas e crescimento.

---

### 14. Criar o Estimate Calculator

```java
public final class EstimateCalculator {

    public TrafficEstimate calculateTraffic(
            WorkloadAssumption assumption) {

        double averageWriteRps =
                assumption.appointmentsPerDay()
                        * assumption.writesPerAppointment()
                        / 86_400.0;

        double averageReadRps =
                assumption.appointmentsPerDay()
                        * assumption.readsPerAppointment()
                        / 86_400.0;

        return new TrafficEstimate(
                averageWriteRps,
                averageReadRps,
                averageWriteRps * assumption.peakFactor(),
                averageReadRps * assumption.peakFactor());
    }
}
```

Modelo:

```java
public record WorkloadAssumption(
        long appointmentsPerDay,
        int writesPerAppointment,
        int readsPerAppointment,
        double peakFactor) {

    public WorkloadAssumption {
        if (appointmentsPerDay <= 0
                || writesPerAppointment <= 0
                || readsPerAppointment <= 0
                || peakFactor < 1.0) {
            throw new IllegalArgumentException(
                    "Workload assumption must be positive");
        }
    }
}
```

---

### 15. Estimar armazenamento

Assuma, por Appointment:

```text
estado atual:
4 KB;

índices e overhead:
6 KB;

histórico médio:
10 eventos de 2 KB;

total aproximado:
30 KB.
```

Por dia:

```text
200.000 * 30 KB
aproximadamente 6 GB por dia.
```

Por ano sem compressão, arquivamento ou expurgo:

```text
aproximadamente 2,2 TB.
```

O número não é um plano final. Ele revela que retenção, particionamento temporal, arquivamento e custo precisam entrar na parte 2.

---

### 16. Criar relatório de workload

Arquivo:

```text
design/WORKLOAD_ESTIMATES.md
```

Registre:

- fórmula;
- valores de entrada;
- média;
- pico;
- cenário de crescimento 3x;
- armazenamento anual;
- margem de segurança;
- confiança da estimativa;
- owner da validação.

Não use números sem unidade.

Isto é inválido:

```text
throughput = 500.
```

Isto é verificável:

```text
peak confirmed writes = 120 requests/second.
```

---

### 17. Modelar o domínio inicial

Arquivo:

```text
design/DOMAIN_MODEL.md
```

Entidades e conceitos:

```text
Tenant;
Service Request;
Appointment;
Appointment Window;
Capacity Reservation;
Service Location;
Appointment Transition;
Integration Event.
```

Responsabilidades:

```text
Service Request:
representa a necessidade de atendimento.

Capacity Reservation:
protege uma janela por tempo limitado.

Appointment:
representa o compromisso confirmado ou em evolução.

Appointment Transition:
registra mudança de estado com versão e actor.
```

Não transforme cada substantivo em serviço.

---

### 18. Criar Appointment inicial

```java
public record Appointment(
        UUID appointmentId,
        TenantId tenantId,
        UUID serviceRequestId,
        UUID capacityReservationId,
        Instant startsAt,
        Instant endsAt,
        AppointmentStatus status,
        long version,
        Instant updatedAt) {

    public Appointment {
        Objects.requireNonNull(appointmentId);
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(serviceRequestId);
        Objects.requireNonNull(capacityReservationId);
        Objects.requireNonNull(startsAt);
        Objects.requireNonNull(endsAt);
        Objects.requireNonNull(status);
        Objects.requireNonNull(updatedAt);

        if (!endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException(
                    "Appointment end must be after start");
        }

        if (version < 1) {
            throw new IllegalArgumentException(
                    "Appointment version must be positive");
        }
    }
}
```

Estado inicial:

```java
public enum AppointmentStatus {
    PENDING_CAPACITY,
    RESERVED,
    CONFIRMED,
    RESCHEDULED,
    CANCELLED,
    COMPLETED
}
```

A máquina de estados completa não será reensinada aqui. O foco é localizar o dado e o owner.

---

### 19. Criar catálogo de dados

Arquivo:

```text
design/DATA_CATALOG.md
```

Para cada dado, registre:

```text
nome;
definição;
owner;
source of truth;
identificador;
volume;
retenção;
sensibilidade;
consistência;
leitores;
escritores;
eventos associados.
```

Exemplo:

```text
Data:
Appointment.

Owner:
Service Scheduling.

Source of truth:
Appointment Store.

Consistency:
strong for state transition;
eventual for search projection.

Retention:
5 years, assumption pending legal validation.

Writers:
Service Scheduling commands only.

Readers:
Query API, Field Execution, Customer Communication.
```

---

### 20. Definir operações de API

Arquivo:

```text
design/API_CATALOG.md
```

Catálogo inicial:

```text
POST /service-requests
GET /capacity/windows
POST /capacity-reservations
POST /appointments/{id}/confirmation
POST /appointments/{id}/rescheduling
POST /appointments/{id}/cancellation
GET /appointments/{id}
GET /appointments
GET /appointments/{id}/transitions
```

Para cada operação, registre:

- ator;
- requisito atendido;
- autenticação;
- tenant;
- request;
- response;
- idempotência;
- consistência;
- SLO;
- erros de negócio;
- owner.

---

### 21. Especificar confirmação

Exemplo conceitual:

```text
Operation:
POST /appointments/{id}/confirmation

Requirement:
FR-004.

Actor:
customer or operator.

Input:
appointmentId;
reservationId;
expectedVersion;
idempotencyKey.

Success:
200 with confirmed state and version.

Business errors:
reservation expired;
version conflict;
tenant mismatch;
already cancelled;
capacity unavailable.

Quality:
zero double confirmation;
p95 <= 600 ms.
```

O contrato ainda não define todos os detalhes de segurança ou deployment. Esses pontos serão aprofundados na parte 2.

---

### 22. Criar representação de API em Java

```java
public record ApiOperation(
        String operationId,
        String method,
        String path,
        Set<String> requirementIds,
        String owner,
        boolean tenantRequired,
        String consistencyMode,
        Duration latencyTarget) {

    public ApiOperation {
        requirementIds = Set.copyOf(requirementIds);

        if (requirementIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "API operation must cover a requirement");
        }
    }
}
```

Esse modelo permite validar cobertura e evitar endpoints sem propósito declarado.

---

### 23. Definir mapa inicial de componentes

Arquivo:

```text
design/COMPONENT_MAP.md
```

Comece com poucos componentes lógicos:

```text
Scheduling API;
Scheduling Application;
Appointment Store;
Capacity Adapter;
Outbox Relay;
Event Broker;
Appointment Search Projector;
Appointment Search Store;
Notification Consumer;
Field Preparation Consumer;
Audit Store.
```

Esses nomes representam responsabilidades. Eles ainda não obrigam um deployment por componente.

A primeira versão pode manter `Scheduling API`, `Scheduling Application` e `Outbox` na mesma aplicação modular.

---

### 24. Criar definição de componente

```java
public record ComponentDefinition(
        String name,
        ComponentType type,
        Set<String> responsibilities,
        Set<String> ownedData,
        Set<String> dependencies,
        Set<String> coveredRequirements) {

    public ComponentDefinition {
        responsibilities = Set.copyOf(responsibilities);
        ownedData = Set.copyOf(ownedData);
        dependencies = Set.copyOf(dependencies);
        coveredRequirements = Set.copyOf(coveredRequirements);

        if (responsibilities.isEmpty()) {
            throw new IllegalArgumentException(
                    "Component must have responsibility");
        }
    }
}
```

Tipos:

```java
public enum ComponentType {
    API,
    APPLICATION,
    DATA_STORE,
    ADAPTER,
    WORKER,
    BROKER,
    PROJECTION
}
```

---

### 25. Definir ownership de dados

Arquivo:

```text
design/DATA_OWNERSHIP.md
```

Matriz inicial:

```text
Service Request:
owner Scheduling Application.

Appointment:
owner Scheduling Application.

Capacity Reservation:
owner Capacity Service.

Appointment Search Document:
owner Appointment Search Projector.

Notification Delivery:
owner Customer Communication.

Field Preparation:
owner Field Execution.

Audit Record:
owner Audit Capability.
```

`Owner` significa autoridade de mudança, não único leitor.

Dois componentes podem copiar um dado, mas apenas um deve decidir sua regra principal.

---

### 26. Criar data ownership policy

Arquivo:

```text
contracts/data-ownership-policy.yaml
```

Conteúdo:

```yaml
dataOwnership:
  everyBusinessEntity:
    requires:
      - owner
      - source-of-truth
      - writers
      - readers
      - consistency
      - retention

  sharedDatabaseWrite:
    forbiddenWithoutExplicitOwner:
      true

  projection:
    mayBeReadByMany:
      true
    mayOwnDomainTransition:
      false

  duplicateSourceOfTruth:
    forbidden:
      true
```

---

### 27. Desenhar fluxo síncrono de confirmação

Arquivo:

```text
design/SYNCHRONOUS_FLOWS.md
```

Fluxo:

```text
1. cliente chama Confirmation API;
2. API autentica e resolve tenant;
3. Application carrega Appointment;
4. valida expected version;
5. consulta ou confirma reservation no Capacity Adapter;
6. aplica transição de domínio;
7. persiste Appointment e Outbox na mesma transação;
8. responde estado confirmado e nova versão.
```

Cada passo deve registrar:

- componente;
- entrada;
- saída;
- timeout;
- consistência;
- erro possível;
- efeito persistido.

Timeout e resiliência detalhados já foram estudados na aula 640 e serão aplicados ao desenho completo na parte 2.

---

### 28. Modelar fluxo em Java

```java
public record FlowStep(
        int order,
        String component,
        String action,
        Set<String> inputData,
        Set<String> outputData,
        Set<String> failureOutcomes) {

    public FlowStep {
        inputData = Set.copyOf(inputData);
        outputData = Set.copyOf(outputData);
        failureOutcomes = Set.copyOf(failureOutcomes);

        if (order < 1 || action.isBlank()) {
            throw new IllegalArgumentException(
                    "Flow step is invalid");
        }
    }
}
```

Fluxo:

```java
public record SystemFlow(
        String id,
        String name,
        FlowType type,
        Set<String> requirementIds,
        List<FlowStep> steps) {

    public SystemFlow {
        requirementIds = Set.copyOf(requirementIds);
        steps = List.copyOf(steps);

        if (steps.isEmpty()) {
            throw new IllegalArgumentException(
                    "System flow must have steps");
        }
    }
}
```

---

### 29. Desenhar fluxo assíncrono

Arquivo:

```text
design/ASYNCHRONOUS_FLOWS.md
```

Após a confirmação:

```text
1. Outbox Relay encontra evento pendente;
2. publica AppointmentConfirmedV1;
3. broker confirma publicação;
4. Search Projector atualiza Appointment Search Store;
5. Notification Consumer prepara comunicação;
6. Field Preparation Consumer prepara execução;
7. Audit Consumer registra trilha derivada;
8. cada consumer confirma seu checkpoint.
```

O evento precisa de:

```text
eventId;
eventType;
schemaVersion;
appointmentId;
tenantId;
aggregateVersion;
occurredAt;
correlationId;
causationId.
```

Idempotência avançada da aula 637 continua sendo pré-requisito para consumers, mas não será reensinada.

---

### 30. Distinguir command path e query path

Command path:

```text
API -> Application -> Appointment Store -> Outbox.
```

Query path:

```text
Query API -> Appointment Search Store.
```

Detalhe crítico pode consultar o source of truth, enquanto pesquisa ampla pode usar projeção eventual.

Essa divisão existe por requisitos diferentes, não para “usar CQRS” como objetivo.

---

### 31. Mapear dependências

No `COMPONENT_MAP.md`, registre:

```text
Scheduling Application depende de:
Appointment Store;
Capacity Adapter;
Outbox Store.

Appointment Search Projector depende de:
Event Broker;
Appointment Search Store.

Notification Consumer depende de:
Event Broker;
Notification Provider.
```

Classifique cada dependência como:

- crítica síncrona;
- crítica assíncrona;
- degradável;
- opcional;
- interna;
- externa.

Ainda não aplique a análise completa de failure mode. Isso pertence à parte 2.

---

### 32. Criar matriz de rastreabilidade

Arquivo:

```text
design/REQUIREMENT_TRACEABILITY.md
```

Exemplo:

```text
FR-004 Confirm Appointment
API:
POST /appointments/{id}/confirmation.

Components:
Scheduling API;
Scheduling Application;
Appointment Store;
Capacity Adapter;
Outbox Store.

Data:
Appointment;
Capacity Reservation;
Appointment Transition.

Flow:
FLOW-CONFIRM-001.

Tests:
ConfirmationApiContractTest;
SingleConfirmationInvariantTest.

Evidence:
confirmation-flow-report.yaml.
```

Nenhum requisito `MUST` pode ficar sem API, componente, dado, fluxo e evidência.

---

### 33. Criar Traceability Verifier

```java
public final class TraceabilityVerifier {

    public TraceabilityResult verify(
            RequirementCatalog requirements,
            ApiCatalog apis,
            ComponentCatalog components,
            FlowCatalog flows) {

        List<String> uncovered =
                requirements.mustRequirements()
                        .stream()
                        .filter(requirement ->
                                !apis.covers(requirement.id())
                                        || !components.covers(requirement.id())
                                        || !flows.covers(requirement.id()))
                        .map(FunctionalRequirement::id)
                        .toList();

        return uncovered.isEmpty()
                ? TraceabilityResult.pass()
                : TraceabilityResult.fail(uncovered);
    }
}
```

Esse verificador evita requisitos decorativos que nunca aparecem no desenho.

---

### 34. Registrar riscos iniciais

Arquivo:

```text
design/INITIAL_RISKS.md
```

Riscos já visíveis:

```text
concentração de pico em poucos tenants;
consulta de capacidade lenta;
expiração de reservation durante confirmação;
dupla confirmação concorrente;
search projection atrasada;
retenção de histórico subestimada;
integração externa sem contrato estável;
pergunta legal de retenção ainda aberta;
SLOs sem medição de produção;
owner de cancelamento emergencial indefinido.
```

Cada risco deve possuir probabilidade, impacto, owner, evidência e próxima ação.

Não resolva todos agora. Torne-os visíveis.

---

### 35. Criar Decision Log inicial

Arquivo:

```text
design/DECISION_LOG.md
```

Exemplos:

```text
D-001:
começar com aplicação modular para o command path.

Motivo:
volume inicial não exige fragmentação operacional.

Revisar quando:
equipes, SLOs, escala ou deploy independente exigirem.
```

```text
D-002:
separar Appointment Search Store do source of truth.

Motivo:
pesquisa possui filtros e padrão de carga diferentes.

Consequência:
consistência eventual precisa de budget e indicador.
```

O Decision Log ainda não substitui ADR formal, que será aprofundado na aula 644.

---

### 36. Criar policies verificáveis

Consolide as regras principais nos contratos.

`functional-requirements-policy.yaml` exige ID, prioridade, ator, owner, evidence e cobertura por API ou consumer, componente, dado, fluxo e teste.

`quality-requirements-policy.yaml` exige cenário, estímulo, resposta, métrica, target e owner; termos como “rápido”, “seguro” ou “altamente disponível” sem medição fazem o gate falhar.

`estimate-policy.yaml` exige entrada, unidade, fórmula, média, pico, crescimento, confiança e gatilho de revisão.

`api-policy.yaml` exige requirement, tenant rule, request, response, erros, consistência, latência, owner e decisão de idempotência para commands.

`component-policy.yaml` exige responsabilidade, owner, dependências e dados; componente lógico não implica deployment independente.

`flow-policy.yaml` exige actor, trigger, passos, persistência, failure outcomes e requirement IDs.

Crie também `non-anticipation-policy.yaml`:

```yaml
nonAnticipation:
  lesson642:
    deferred:
      - bottleneck-analysis
      - detailed-scaling-plan
      - complete-failure-mode-analysis
      - threat-model
      - observability-architecture
      - deployment-topology
      - cost-model
      - rollout-strategy
      - final-design-defense

  lesson643:
    deferred:
      - formal-trade-off-framework
      - alternative-scoring-model

  allowed:
    - initial-risk
    - preliminary-assumption
    - open-question
```

---

### 37. Testar o desenho inicial

Crie testes para os artefatos, não apenas para classes isoladas.

`RequirementCatalogTest` valida IDs únicos, prioridade, owner, evidence e ausência de termos vagos.

`TrafficEstimateTest` valida fórmulas, unidades, pico maior que média, valores negativos e cenário de crescimento.

`ApiCoverageVerifierTest` garante que todo requisito `MUST` tenha operação ou consumer e que toda API possua requirement, tenant rule, consistência e target de latência.

`DataOwnershipTest` confirma um único source of truth para `Appointment`, proíbe escrita de `Capacity Reservation` por Scheduling e impede projections de executarem transições de domínio.

`CriticalFlowCompletenessTest` verifica actor, autenticação, tenant, expected version, reservation, transição, persistência, outbox, resposta e failure outcomes.

`RequirementTraceabilityTest` deve falhar quando requisito, API, componente, dado, fluxo ou teste estiver órfão.

`ComponentBoundaryTest` confirma que logical component não implica microserviço, adapter externo não contém domínio e data stores possuem owner.

`DesignPartTwoNonAnticipationTest` e `TradeOffLessonNonAnticipationTest` impedem aprofundar topologia final, threat model completo, cost model ou framework formal de alternativas.

Exemplo:

```java
@Test
void calculatesAverageAndPeakTraffic() {
    WorkloadAssumption assumption =
            new WorkloadAssumption(
                    200_000,
                    5,
                    20,
                    10.0);

    TrafficEstimate estimate =
            new EstimateCalculator()
                    .calculateTraffic(assumption);

    assertTrue(
            estimate.peakWriteRps()
                    > estimate.averageWriteRps());
}
```

---

### 38. Criar reports

Exemplo de `requirements-report.yaml`:

```yaml
requirements:
  functional:
    total:
      12
    must:
      10
    covered:
      10

  quality:
    total:
      8
    measurable:
      8
    withOwner:
      8

  openQuestions:
    total:
      7
    withOwner:
      7

  result:
    PASS
```

Exemplo de `workload-report.yaml`:

```yaml
workload:
  appointmentsPerDay:
    200000

  averageWriteRps:
    11.58

  peakWriteRps:
    115.74

  averageReadRps:
    46.30

  peakReadRps:
    462.96

  estimatedStorageGbPerDay:
    6.0

  confidence:
    MEDIUM

  result:
    PASS_WITH_ASSUMPTIONS
```

---

### 39. Criar o Gate

O gate valida:

- charter;
- problem statement;
- scope;
- atores;
- requisitos funcionais;
- requisitos de qualidade;
- SLOs;
- premissas;
- perguntas abertas;
- estimativas;
- domínio;
- dados;
- APIs;
- componentes;
- ownership;
- fluxos;
- rastreabilidade;
- riscos;
- testes;
- documentação;
- evidence;
- não antecipação.

Status:

```text
PASS;
PASS_WITH_OPEN_QUESTIONS;
FAIL_PROBLEM;
FAIL_SCOPE;
FAIL_FUNCTIONAL_REQUIREMENTS;
FAIL_QUALITY_REQUIREMENTS;
FAIL_SLO;
FAIL_ESTIMATE;
FAIL_DOMAIN_MODEL;
FAIL_DATA_OWNERSHIP;
FAIL_API_COVERAGE;
FAIL_COMPONENT_MAP;
FAIL_FLOW_COVERAGE;
FAIL_TRACEABILITY;
FAIL_DOCUMENTATION;
FAIL_TEST;
INCONCLUSIVE.
```

`PASS_WITH_OPEN_QUESTIONS` é aceitável quando as perguntas possuem owner, prazo e impacto explícitos.

---

### 40. Coletar evidence

Arquivo:

```text
contracts/system-design-part-one-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- functional requirement count;
- quality requirement count;
- MUST coverage;
- SLO count;
- assumption count;
- open question count;
- average and peak RPS;
- estimated storage;
- component count;
- owned data count;
- API count;
- flow count;
- traceability coverage;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais de clientes;
- endpoints privados;
- credenciais;
- topologia de produção;
- volumes confidenciais reais;
- dados pessoais;
- decisões finais da parte 2;
- framework completo de trade-offs.

---

### 41. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-system-design-part-one\validate-system-design-contract.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-functional-requirements.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-quality-requirements.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-workload-estimates.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-api-catalog.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-component-map.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-data-ownership.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-flow-catalog.ps1

.\scripts\m19\service-scheduling-system-design-part-one\validate-requirement-traceability.ps1

.\scripts\m19\service-scheduling-system-design-part-one\run-system-design-part-one-tests.ps1

.\scripts\m19\service-scheduling-system-design-part-one\collect-system-design-part-one-evidence.ps1

.\scripts\m19\service-scheduling-system-design-part-one\verify-system-design-part-one-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 42. Encerrar o laboratório

Confirme:

- problema definido sem tecnologia prematura;
- escopo e não escopo explícitos;
- atores e jornadas documentados;
- requisitos funcionais identificados;
- requisitos de qualidade mensuráveis;
- SLOs iniciais definidos;
- premissas visíveis;
- perguntas abertas com owner;
- tráfego médio e pico estimados;
- armazenamento estimado;
- modelo de domínio inicial;
- catálogo de dados;
- APIs rastreadas a requisitos;
- componentes com responsabilidades;
- dados com source of truth;
- fluxo síncrono documentado;
- fluxo assíncrono documentado;
- riscos iniciais registrados;
- rastreabilidade completa para requisitos `MUST`;
- tests, reports, evidence e gate criados;
- aprofundamentos da parte 2 preservados;
- framework de trade-offs preservado para a aula 643.

---

## Entendendo o que foi feito

### O problema ganhou fronteiras

O design deixou de ser “um sistema de agendamento escalável” e passou a possuir atores, escopo, operações, dados e resultados verificáveis.

### As qualidades ganharam métricas

Latência, disponibilidade, consistência, isolamento e auditabilidade deixaram de ser adjetivos e passaram a ter cenário, métrica, target e owner.

### Os números ganharam função arquitetural

As estimativas mostraram ordem de grandeza de writes, reads e armazenamento. Elas ainda são hipóteses, mas permitem avaliar se uma decisão é proporcional ao problema.

### Os componentes ganharam justificativa

Cada componente possui responsabilidade, dados, dependências e requisitos cobertos. Um componente lógico não foi confundido automaticamente com microserviço ou unidade de deployment.

### Os fluxos ganharam rastreabilidade

Confirmação, busca e publicação de eventos agora conectam requisito, API, componente, dado, passo, erro e evidência.

---

## Erros comuns importantes

### Começar pelo diagrama ou pela tecnologia

A equipe escolhe Kafka, Redis e microserviços antes de saber volume, SLO ou consistência necessária.

### Usar requisitos vagos

“Rápido”, “seguro” e “escalável” não criam critérios de aceite.

### Estimar sem fórmula

Um número sem unidade, premissa e cenário não sustenta decisão.

### Transformar todo conceito em serviço

Entidade, contexto e componente lógico não precisam virar deployment separado.

### Compartilhar dados sem owner

Múltiplos writers criam conflitos, acoplamento e responsabilidade difusa.

### Desenhar somente happy path

Fluxos críticos precisam declarar falhas, estados persistidos e resultados desconhecidos.

### Criar API sem requisito

O endpoint se torna funcionalidade órfã, difícil de priorizar e testar.

### Esconder perguntas abertas

A incerteza reaparece tarde, geralmente durante implementação ou incidente.

### Antecipar a parte 2

O design inicial perde foco se tentar finalizar escala, segurança, observabilidade, deployment e custo antes de estabilizar requisitos e fluxos.

---

## Comandos úteis

### Validar requisitos

```powershell
.\scripts\m19\service-scheduling-system-design-part-one\validate-functional-requirements.ps1
```

### Validar estimativas

```powershell
.\scripts\m19\service-scheduling-system-design-part-one\validate-workload-estimates.ps1
```

### Validar ownership

```powershell
.\scripts\m19\service-scheduling-system-design-part-one\validate-data-ownership.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-system-design-part-one\run-system-design-part-one-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-system-design-part-one\verify-system-design-part-one-gate.ps1
```

---

## Exercício guiado

Escolha um novo requisito para o domínio: `bloqueio temporário de janela para negociação com o cliente`.

Adicione:

1. requisito funcional;
2. ator e jornada;
3. requisito de qualidade;
4. estimativa de volume;
5. entidade ou valor de domínio;
6. API;
7. owner do dado;
8. fluxo síncrono;
9. evento assíncrono, se necessário;
10. risco;
11. teste de rastreabilidade;
12. evidence.

O exercício será aceito quando nenhum artefato ficar órfão.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 640 e ponte para a 642 foram preservadas;
- laboratório, charter, problem statement, escopo, atores e jornadas foram criados;
- requisitos funcionais possuem ID, prioridade, actor, owner e evidence;
- requisitos de qualidade possuem cenário, métrica, target e owner;
- SLOs, assumptions e open questions foram documentados;
- tráfego médio, pico, crescimento e armazenamento foram estimados com fórmula e unidade;
- domínio, Data Catalog e source of truth foram definidos;
- APIs cobrem requisitos e declaram tenant, consistência, erros e latência;
- commands possuem decisão de idempotência;
- componentes possuem responsabilidade e não foram convertidos automaticamente em microserviços;
- ownership de dados foi documentado;
- fluxos síncronos e assíncronos incluem persistência e failure outcomes;
- requisitos `MUST` possuem rastreabilidade até API, componente, dado, fluxo, teste e evidence;
- riscos e decisões iniciais foram registrados;
- testes, reports, evidence e gate foram criados;
- a parte 2 e a aula de trade-offs não foram antecipadas;
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
  labs/m19/aula-641-design-sistemas-parte-1/service-scheduling-system-design `
  scripts/m19/service-scheduling-system-design-part-one `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|privateEndpoint|productionTopology|confidentialVolume|fullThreatModel|finalDeployment"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): iniciar design de sistemas"
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
- topologia real;
- volumes confidenciais;
- threat model completo;
- deployment final;
- aprofundamento da aula 642;
- framework da aula 643.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou um design de sistemas completo para `Service Scheduling`.

Você criou problem statement, escopo, atores, requisitos, SLOs, assumptions, estimativas, domínio, catálogo de dados, APIs, componentes, ownership, fluxos, rastreabilidade, riscos, reports, evidence e gate.

Você comprovou que design de sistemas começa pela redução de ambiguidade; que requisitos de qualidade precisam de métricas; que estimativas revelam ordem de grandeza; que componentes devem nascer de responsabilidades; que dados precisam de owner; e que APIs e fluxos precisam estar ligados a requisitos e evidências.

A próxima aula será:

```text
642 - M19.32 - Design de sistemas parte 2
```

Nela, você testará o desenho contra crescimento, gargalos, falhas, consistência, segurança, observabilidade, deployment, custo e evolução, sem antecipar o aprofundamento formal de trade-offs da aula 643.

---

# Material complementar

## Checkpoint final

- [ ] Defini o problema e o escopo.
- [ ] Criei requisitos funcionais e de qualidade.
- [ ] Defini SLOs iniciais.
- [ ] Registrei premissas e perguntas abertas.
- [ ] Estimei tráfego e armazenamento.
- [ ] Modelei dados, APIs e componentes.
- [ ] Defini ownership.
- [ ] Documentei fluxos síncronos e assíncronos.
- [ ] Validei rastreabilidade.
- [ ] Executei testes e gate.

---

## Troubleshooting adicional

### O diagrama cresce sem controle

Volte ao escopo e remova componentes que não cobrem requisito atual.

### A equipe discute tecnologia por horas

Peça o requisito, volume, SLO e risco que justificam a escolha.

### Os números parecem inventados

Marque como assumption, registre confiança e defina owner para validação.

### Dois componentes alteram Appointment

Escolha um source of truth e transforme o outro em leitor ou consumidor.

### A API não possui requisito

Remova, adie ou documente o requisito que ela atende.

### O requisito não aparece em nenhum fluxo

O design está incompleto ou o requisito não pertence ao escopo.

### O fluxo assíncrono não converge

Revise owner, evento, consumer, checkpoint e evidência; o aprofundamento operacional ocorre na parte 2.

### A pesquisa exige consistência forte para tudo

Separe consulta informativa de decisão crítica e registre o motivo.

### O design virou microserviços por entidade

Reagrupe por responsabilidade, ownership, ritmo de mudança e SLO.

### Todas as perguntas precisam ser respondidas antes de continuar

Não. Elas precisam estar visíveis, priorizadas e com owner.

---

## Perguntas de revisão

1. Por que design de sistemas não começa pelo diagrama?
2. Qual diferença entre requisito funcional e requisito de qualidade?
3. O que torna um SLO verificável?
4. Para que servem estimativas de ordem de grandeza?
5. O que deve acompanhar uma premissa?
6. Qual diferença entre componente lógico e deployment unit?
7. O que significa source of truth?
8. Por que API precisa de requisito?
9. O que é rastreabilidade arquitetural?
10. Por que fluxos precisam de failure outcomes?
11. O que ficou para a aula 642?
12. Qual é a próxima aula?

---

## Roteiro de resposta

1. Porque primeiro é preciso reduzir ambiguidade e entender restrições.
2. Um descreve o que o sistema faz; o outro, como deve se comportar.
3. Possuir operação, métrica, target, janela e owner.
4. Revelar escala, gargalos e proporcionalidade das decisões.
5. Owner, confiança, impacto e gatilho de revisão.
6. Um expressa responsabilidade; o outro expressa execução e implantação.
7. Autoridade principal sobre a mudança de um dado.
8. Para manter propósito, prioridade, teste e evidência.
9. Conexão entre requisito, API, componente, dado, fluxo, teste e evidence.
10. Porque o happy path não explica comportamento real diante de falhas.
11. Carga, gargalos, falhas, consistência, segurança, observabilidade, deployment, custo e evolução.
12. Design de sistemas parte 2.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 641 - M19.31 - Design de sistemas parte 1

- Iniciei um design de sistemas completo para Service Scheduling.
- Criei System Design Charter.
- Escrevi Problem Statement sem tecnologia prematura.
- Defini escopo e não escopo.
- Identifiquei atores e jornadas.
- Criei requisitos funcionais com ID, prioridade, actor, owner e evidence.
- Criei requisitos de qualidade mensuráveis.
- Defini SLOs iniciais por operação.
- Registrei assumptions e open questions.
- Estimei tráfego médio, pico e crescimento.
- Estimei armazenamento diário e anual.
- Modelei Service Request, Appointment e Capacity Reservation.
- Criei Data Catalog e defini source of truth.
- Criei API Catalog ligado aos requisitos.
- Modelei confirmação, reagendamento, cancelamento, detalhe e pesquisa.
- Criei Component Map sem forçar microserviços.
- Defini ownership de dados.
- Documentei fluxo síncrono de confirmação.
- Documentei fluxo assíncrono de publicação e projeção.
- Diferenciei command path e query path.
- Criei Requirement Traceability.
- Registrei riscos e decisões iniciais.
- Criei testes de requisito, estimativa, API, ownership, fluxo e arquitetura.
- Criei reports, evidence e gate.
- Não antecipei Design de Sistemas parte 2.
- Não aprofundei Trade-offs técnicos.
- Próxima aula: Design de sistemas parte 2.
```

---

## Referência técnica curta

- Problem Statement e Scope.
- Functional e Quality Requirements.
- SLO e Error Budget.
- Assumption e Open Question.
- Back-of-the-envelope Estimation.
- Domain Model e Data Catalog.
- API Catalog.
- Component Map.
- Data Ownership.
- Synchronous e Asynchronous Flow.
- Requirement Traceability.

Regra final:

```text
Design de sistemas começa pela redução explícita de incerteza. Service Scheduling transforma um problema amplo em escopo, atores, jornadas, requisitos funcionais e requisitos de qualidade mensuráveis; SLOs possuem operação, métrica, target e owner; assumptions registram confiança, impacto e revisão, enquanto open questions permanecem visíveis. Estimativas usam unidade, fórmula, média, pico e crescimento para revelar ordem de grandeza de tráfego e armazenamento sem fingir precisão. O domínio define Service Request, Capacity Reservation e Appointment; o Data Catalog registra source of truth, consistência, retenção, readers e writers; APIs cobrem requisitos e declaram tenant, idempotência, consistência, erros e latência. Componentes lógicos existem por responsabilidade e não implicam microserviço automático. Command path, query path e fluxos assíncronos conectam dados, persistência, eventos e failure outcomes. Requirement Traceability liga cada requisito MUST a API, componente, dado, fluxo, teste e evidence. O gate só aprova quando problema, escopo, requisitos, SLOs, estimativas, domínio, dados, APIs, componentes, ownership, fluxos, riscos, rastreabilidade, documentação e testes estão coerentes, enquanto gargalos, falhas, segurança, observabilidade, deployment, custo e evolução permanecem reservados à aula 642, e o aprofundamento formal de trade-offs permanece para a aula 643.
```
