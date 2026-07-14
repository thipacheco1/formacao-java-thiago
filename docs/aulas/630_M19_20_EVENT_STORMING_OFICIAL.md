# 630 - M19.20 - Event Storming

## Apresentação da aula

Na aula 629, você aprofundou Domain Events.

Você modelou fatos como:

```text
AppointmentScheduled;

AppointmentConfirmed;

AppointmentRescheduled;

AppointmentCancelled.
```

Também definiu:

- event ID;
- event type;
- event version;
- Aggregate ID;
- Aggregate Revision;
- occurredAt;
- correlation ID;
- causation ID;
- actor reference;
- payload imutável;
- recording após mudança válida;
- separação entre Domain Event e Integration Event;
- publicação após commit.

Agora o objetivo será usar eventos não apenas como código, mas como ferramenta de descoberta.

A pergunta será:

```text
como reunir
pessoas de negócio,
engenharia,
produto,
operações
e arquitetura

para descobrir
o fluxo real do domínio

antes de transformar
suposições
em código?
```

Event Storming é uma técnica colaborativa de modelagem que organiza uma conversa em torno de fatos ocorridos no domínio.

Em vez de começar por tabelas, endpoints, classes, serviços ou frameworks, o grupo começa por: `o que aconteceu?`

Exemplos:

```text
Service Request Created;

Capacity Offer Selected;

Appointment Scheduled;

Appointment Confirmed;

Appointment Rescheduled;

Appointment Cancelled;

Field Activity Started;

Field Activity Completed.
```

Depois, o grupo investiga comando, ator, informação, policy, falhas, sistemas externos, conflitos, ambiguidades e possíveis fronteiras.

O laboratório será:

```text
labs/m19/aula-630-event-storming/service-scheduling-event-storming
```

Você irá executar uma simulação documentada de Event Storming para o fluxo:

```text
criar solicitação;

buscar capacidade;

agendar atendimento;

confirmar;

reagendar;

cancelar;

preparar execução;

concluir atividade.
```

Serão praticados três níveis:

```text
Big Picture;

Process Level;

Design Level.
```

O Big Picture identificará timeline, eventos, sistemas, hotspots, processos paralelos e possíveis Bounded Contexts.

O Process Level será usado para aprofundar:

```text
Schedule Appointment.
```

O Design Level será usado apenas em um recorte controlado:

```text
Reschedule Appointment.
```

Você produzirá charter, legenda, participantes, timeline, eventos, commands, actors, policies, read models, sistemas externos, hotspots, fronteiras candidatas, decisões, handoffs, evidence e gate.

A próxima aula oficial será:

```text
631 - M19.21 - CQRS
```

Por isso, esta aula poderá identificar leituras e comandos, mas não aprofundará:

- separação arquitetural entre write model e read model;
- handlers de command;
- handlers de query;
- projections;
- bancos separados;
- rebuild de read model;
- eventual consistency de leitura;
- pipelines assíncronos;
- materialized views.

A aula 632 será:

```text
632 - M19.22 - Event Sourcing conceitual
```

Por isso, esta aula não transformará a timeline em event store.

Nenhuma implementação de Event Sourcing será antecipada.

A regra central será:

```text
Event Storming
não é desenho decorativo;

é uma conversa estruturada
para descobrir fatos,
decisões,
conflitos,
fronteiras
e linguagem.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
628:
Application Service Use Case.

629:
Domain Events.

630:
Event Storming.

631:
CQRS.

632:
Event Sourcing conceitual.
```

A progressão é:

```text
orquestrar intenções;

modelar fatos;

descobrir o processo;

separar leitura e escrita;

avaliar estado derivado de eventos.
```

Nesta aula:

```text
Big Picture:
sim.

Process Level:
sim.

Design Level:
sim,
em escopo pequeno.

event timeline:
sim.

commands:
sim.

actors:
sim.

policies:
sim.

read models:
sim,
como descoberta.

external systems:
sim.

hotspots:
sim.

Bounded Context candidates:
sim.

Aggregate candidates:
sim.

CQRS:
não aprofundado.

Event Sourcing:
não.

código de produção:
não.

broker:
não.
```

O foco será modelagem colaborativa e rastreabilidade das decisões.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-630-event-storming/service-scheduling-event-storming
├── README.md
├── event-storming
│   ├── EVENT_STORMING_CHARTER.md
│   ├── PARTICIPANT_ROLES.md
│   ├── FACILITATION_RULES.md
│   ├── LEGEND.md
│   ├── BIG_PICTURE_BOARD.md
│   ├── BIG_PICTURE_TIMELINE.md
│   ├── PROCESS_LEVEL_SCHEDULE_APPOINTMENT.md
│   ├── DESIGN_LEVEL_RESCHEDULE_APPOINTMENT.md
│   ├── EVENT_CATALOG.md
│   ├── COMMAND_CATALOG.md
│   ├── ACTOR_CATALOG.md
│   ├── POLICY_CATALOG.md
│   ├── READ_MODEL_CATALOG.md
│   ├── EXTERNAL_SYSTEM_CATALOG.md
│   ├── HOTSPOT_REGISTER.md
│   ├── OPEN_QUESTIONS.md
│   ├── LANGUAGE_CONFLICTS.md
│   ├── HANDOFF_MAP.md
│   ├── FAILURE_SCENARIOS.md
│   ├── BOUNDED_CONTEXT_CANDIDATES.md
│   ├── AGGREGATE_CANDIDATES.md
│   ├── DOMAIN_SERVICE_CANDIDATES.md
│   ├── DECISION_LOG.md
│   ├── FOLLOW_UP_ACTIONS.md
│   └── BOARD_EXPORT.md
├── contracts
│   ├── event-storming-contract.yaml
│   ├── facilitation-policy.yaml
│   ├── event-policy.yaml
│   ├── command-policy.yaml
│   ├── actor-policy.yaml
│   ├── policy-discovery-policy.yaml
│   ├── read-model-discovery-policy.yaml
│   ├── hotspot-policy.yaml
│   ├── boundary-candidate-policy.yaml
│   ├── traceability-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── participant-coverage-report.yaml
    ├── event-timeline-report.yaml
    ├── hotspot-report.yaml
    ├── language-conflict-report.yaml
    ├── boundary-candidate-report.yaml
    ├── traceability-report.yaml
    └── event-storming-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-event-storming
├── validate-event-storming-contract.ps1
├── validate-participant-coverage.ps1
├── validate-event-timeline.ps1
├── validate-command-event-links.ps1
├── validate-actor-links.ps1
├── validate-policy-links.ps1
├── validate-read-model-links.ps1
├── validate-hotspots.ps1
├── validate-boundary-candidates.ps1
├── validate-traceability.ps1
├── collect-event-storming-evidence.ps1
└── verify-event-storming-gate.ps1
```

Ao final, o board será rastreável e produzirá decisões acionáveis.

---

## Conceito essencial

### Event Storming

Técnica colaborativa para explorar um domínio usando eventos ocorridos como eixo da conversa.

### Domain Event

Fato relevante colocado na timeline no passado.

### Command

Intenção que tenta produzir um evento.

### Actor

Pessoa, papel ou sistema que inicia um comando.

### Policy

Regra que reage a um evento e pode produzir outro comando.

### Read Model

Informação consultada para decidir ou executar um comando.

### External System

Sistema fora do escopo modelado que participa do fluxo.

### Hotspot

Dúvida, conflito, risco, ambiguidade ou ponto que exige investigação.

### Big Picture

Visão ampla do domínio e de seus principais fluxos.

### Process Level

Aprofundamento de um processo ponta a ponta.

### Design Level

Modelagem detalhada de um recorte próximo da implementação.

### Timeline

Sequência temporal de eventos.

### Handoff

Transferência de responsabilidade entre atores, equipes, contextos ou sistemas.

### Boundary Candidate

Fronteira potencial identificada por linguagem, regras, ownership e ritmo de mudança.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-630-event-storming/service-scheduling-event-storming

Set-Location `
  labs/m19/aula-630-event-storming/service-scheduling-event-storming
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/event-storming-contract.yaml
```

Conteúdo:

```yaml
eventStorming:
  domain:
    Service-Scheduling

  required:
    - explicit-scope
    - participant-diversity
    - shared-legend
    - event-first-discovery
    - chronological-timeline
    - command-event-links
    - actor-command-links
    - policy-links
    - read-model-links
    - external-systems
    - hotspots
    - language-conflicts
    - boundary-candidates
    - decision-log
    - follow-up-actions
    - traceability

  forbidden:
    - technology-first-board
    - event-without-past-tense
    - hidden-hotspot
    - unresolved-term-without-owner
    - framework-as-domain-concept
    - CQRS-deep-dive
    - Event-Sourcing-implementation

  nextLesson:
    code:
      M19.21
```

---

### 3. Criar charter

Arquivo:

```text
event-storming/EVENT_STORMING_CHARTER.md
```

Conteúdo:

```markdown
# Event Storming Charter

## Domínio

Service Scheduling.

## Objetivo

Descobrir o fluxo real
do agendamento de serviços,
seus fatos,
comandos,
atores,
policies,
leituras,
sistemas externos,
hotspots
e fronteiras candidatas.

## Escopo inicial

Da criação da solicitação
até a conclusão da atividade.

## Fora de escopo

- desenho de banco;
- endpoints;
- framework;
- broker;
- CQRS completo;
- Event Sourcing;
- organograma técnico.

## Saídas esperadas

- timeline;
- catálogo;
- hotspots;
- conflitos de linguagem;
- candidatos a contexto;
- decisões;
- ações.
```

---

### 4. Definir participantes

Arquivo:

```text
event-storming/PARTICIPANT_ROLES.md
```

Inclua:

```text
facilitador;

especialista de negócio;

operação de agendamento;

operação de campo;

produto;

engenharia backend;

engenharia frontend;

QA;

arquitetura;

dados;

representante de Capacity;

representante de Notifications.
```

Evite um board feito apenas por desenvolvedores.

---

### 5. Criar policy de cobertura

Arquivo:

```text
contracts/facilitation-policy.yaml
```

Conteúdo:

```yaml
facilitation:
  requiredRoles:
    - facilitator
    - domain-expert
    - operations
    - product
    - engineering
    - quality

  onePersonDominates:
    action:
      INTERVENE

  unresolvedConflict:
    action:
      HOTSPOT

  technologyDebate:
    action:
      PARKING_LOT

  sessionTimebox:
    required

  boardOwner:
    required
```

---

### 6. Criar legenda

Arquivo:

```text
event-storming/LEGEND.md
```

Legenda textual:

```text
Laranja:
Domain Event.

Azul:
Command.

Amarelo:
Actor.

Lilás:
Policy.

Verde:
Read Model.

Rosa:
External System.

Vermelho:
Hotspot.

Amarelo claro:
Aggregate candidate.

Azul escuro:
Bounded Context candidate.

Cinza:
Decision or note.
```

A cor ajuda a leitura.


---

### 7. Regras de facilitação

Arquivo:

```text
event-storming/FACILITATION_RULES.md
```

Regras:

```text
eventos no passado;

uma ideia por nota;

sem discussão longa na primeira passagem;

duplicatas são permitidas;

conflitos viram hotspots;

tecnologia vai para parking lot;

o facilitador não decide o domínio;

especialistas explicam fatos;

engenheiros fazem perguntas;

termos ambíguos são registrados;

decisões possuem owner.
```

---

### 8. Big Picture: começar por eventos

Peça ao grupo:

```text
escreva fatos importantes
que já aconteceram
no domínio.
```

Primeira lista:

```text
Service Request Created;

Service Request Validated;

Capacity Search Requested;

Capacity Offers Found;

Capacity Offer Selected;

Capacity Reserved;

Appointment Scheduled;

Appointment Confirmation Requested;

Appointment Confirmed;

Appointment Reschedule Requested;

Appointment Rescheduled;

Appointment Cancellation Requested;

Appointment Cancelled;

Field Activity Prepared;

Field Activity Started;

Field Activity Completed;

Capacity Reservation Released;

Customer Notification Sent.
```

Primeiro obtenha volume e variedade.

---

### 9. Ordenar a timeline

Arquivo:

```text
event-storming/BIG_PICTURE_TIMELINE.md
```

Organize da esquerda para a direita.

Exemplo:

```text
Service Request Created
    ->
Service Request Validated
    ->
Capacity Offers Found
    ->
Capacity Offer Selected
    ->
Capacity Reserved
    ->
Appointment Scheduled
    ->
Appointment Confirmed
    ->
Field Activity Prepared
    ->
Field Activity Started
    ->
Field Activity Completed.
```

Fluxos alternativos:

```text
Appointment Scheduled
    ->
Appointment Reschedule Requested
    ->
Capacity Reserved
    ->
Appointment Rescheduled
    ->
Previous Capacity Reservation Released.
```

```text
Appointment Scheduled
    ->
Appointment Cancellation Requested
    ->
Appointment Cancelled
    ->
Capacity Reservation Released.
```

---

### 10. Duplicatas revelam linguagem

Duas pessoas podem escrever:

```text
Visit Scheduled;
```

e:

```text
Appointment Scheduled.
```

Não elimine imediatamente.

Registre em:

```text
event-storming/LANGUAGE_CONFLICTS.md
```

Pergunte:

- visita e compromisso são o mesmo conceito?
- “visit” pertence a Field Execution?
- “appointment” pertence a Scheduling?
- o evento acontece antes ou depois da execução?
- quem usa cada termo?


---

### 11. Criar event policy

Arquivo:

```text
contracts/event-policy.yaml
```

Conteúdo:

```yaml
eventDiscovery:
  tense:
    past

  required:
    - business-meaning
    - timeline-position
    - owner-or-candidate

  forbidden:
    - technical-log
    - method-name
    - database-change
    - future-intention

  duplicate:
    allowedDuringDiscovery

  ambiguousTerm:
    action:
      LANGUAGE_CONFLICT
```

---

### 12. Identificar hotspots

Exemplos de hotspots:

```text
Quem confirma:
cliente,
operador
ou sistema?

A reserva de Capacity expira?

Pode existir mais de um Appointment ativo?

Reagendamento cria novo Appointment
ou muda o existente?

Cancelamento libera Capacity
sincronamente?

Field Activity pode começar
sem confirmação?

Qual timezone define a janela?

Quem é owner de Service Area?

Quando a notificação é obrigatória?
```

Cada hotspot precisa de descrição, impacto, owner, próxima ação e status.

---

### 13. Criar Hotspot Register

Arquivo:

```text
event-storming/HOTSPOT_REGISTER.md
```

Exemplo:

```markdown
## HOT-007

Questão:
Reagendamento mantém
o mesmo Appointment ID?

Impacto:
Identidade,
histórico,
eventos,
integração
e auditoria.

Owner:
Scheduling Product.

Próxima ação:
Validar com operação
e compliance.

Status:
OPEN.
```

---

### 14. Criar hotspot policy

Arquivo:

```text
contracts/hotspot-policy.yaml
```

Conteúdo:

```yaml
hotspot:
  requires:
    - identifier
    - question
    - impact
    - owner
    - next-action
    - status

  hiddenInMeetingNotes:
    forbidden

  unresolvedWithoutOwner:
    action:
      FAIL

  status:
    allowed:
      - OPEN
      - INVESTIGATING
      - DECIDED
      - DEFERRED
```

---

### 15. Adicionar comandos

Para cada evento, pergunte:

```text
qual intenção tentou produzir este fato?
```

Exemplos:

```text
Create Service Request
-> Service Request Created.

Select Capacity Offer
-> Capacity Offer Selected.

Schedule Appointment
-> Appointment Scheduled.

Confirm Appointment
-> Appointment Confirmed.

Reschedule Appointment
-> Appointment Rescheduled.

Cancel Appointment
-> Appointment Cancelled.
```

Alguns eventos são produzidos por policy, não por comando humano direto.

---

### 16. Criar Command Catalog

Arquivo:

```text
event-storming/COMMAND_CATALOG.md
```

Campos:

- command;
- actor;
- preconditions;
- input;
- expected event;
- rejection;
- system;
- owner;
- idempotency;
- authorization;
- open questions.

---

### 17. Criar command policy

Arquivo:

```text
contracts/command-policy.yaml
```

Conteúdo:

```yaml
commandDiscovery:
  tense:
    imperative

  requires:
    - actor-or-policy
    - target
    - expected-event

  forbidden:
    - database-command
    - framework-command
    - vague-process

  rejectedCommand:
    expectedOutcome:
      documented
```

---

### 18. Adicionar atores

Atores candidatos:

```text
Customer;

Scheduling Operator;

Customer Portal;

Capacity Robot;

Field Technician;

Supervisor;

External Client System;

Time-Based Scheduler.
```

Ator pode ser pessoa, sistema ou relógio.

---

### 19. Criar Actor Catalog

Arquivo:

```text
event-storming/ACTOR_CATALOG.md
```

Para cada ator:

- nome;
- tipo;
- responsabilidade;
- commands;
- authorization;
- contexto;
- dados necessários;
- owner;
- riscos.

---

### 20. Adicionar policies

Exemplo:

```text
Appointment Scheduled
    ->
Request Customer Confirmation
    ->
Appointment Confirmation Requested.
```

Outro:

```text
Appointment Cancelled
    ->
Release Capacity Reservation
    ->
Capacity Reservation Released.
```

Policy representa:

```text
quando X acontece,
então tente Y.
```

---

### 21. Criar Policy Catalog

Arquivo:

```text
event-storming/POLICY_CATALOG.md
```

Exemplo:

```text
Policy:
Release Capacity After Cancellation.

Trigger:
Appointment Cancelled.

Command:
Release Capacity Reservation.

Owner:
Scheduling Application.

Consistency:
Eventual.

Failure:
retry and alert.

Hotspot:
prazo máximo para liberação.
```

---

### 22. Policy não é necessariamente Domain Service

No board, “Policy” é uma reação ou regra do processo.

Na implementação, ela pode virar:

- Domain Service;
- Application Service;
- event handler;
- scheduler;
- workflow;
- Aggregate behavior;
- integração.


---

### 23. Adicionar Read Models

Pergunte:

```text
qual informação
o ator precisa ver
antes de enviar o comando?
```

Exemplos:

```text
Available Capacity View;

Appointment Summary;

Customer Confirmation View;

Rescheduling Options;

Cancellation Impact View;

Field Activity Preparation View.
```

Read Model representa necessidade de leitura, não decisão de CQRS.

---

### 24. Criar Read Model Catalog

Arquivo:

```text
event-storming/READ_MODEL_CATALOG.md
```

Campos:

- nome;
- ator;
- command suportado;
- dados;
- freshness;
- owner;
- source;
- segurança;
- volume;
- hotspot.

---

### 25. Criar read model policy

Arquivo:

```text
contracts/read-model-discovery-policy.yaml
```

Conteúdo:

```yaml
readModelDiscovery:
  supports:
    command-decision:
      required

  mustDefine:
    - actor
    - data-needed
    - freshness
    - owner

  CQRSImplementation:
    deferred

  databaseChoice:
    forbiddenAtDiscoveryStage
```

---

### 26. Adicionar sistemas externos

Exemplos:

```text
Capacity Platform;

Customer Portal;

Notification Provider;

Field Execution Platform;

Billing Platform;

Legacy Workforce Platform.
```

Marque onde entram e saem fatos.

Pergunte:

- quem é upstream?
- quem é downstream?
- qual contrato existe?
- qual timeout existe?
- qual falha bloqueia o processo?
- existe fallback?
- existe duplicação?
- qual equipe é owner?

---

### 27. Criar External System Catalog

Arquivo:

```text
event-storming/EXTERNAL_SYSTEM_CATALOG.md
```

Campos:

- sistema;
- papel;
- evento recebido;
- comando enviado;
- contrato;
- owner;
- criticidade;
- disponibilidade;
- retry;
- fallback;
- hotspot.

---

### 28. Big Picture Board

Arquivo:

```text
event-storming/BIG_PICTURE_BOARD.md
```

Inclua:

- timeline principal;
- timelines alternativas;
- sistemas;
- atores;
- hotspots;
- termos conflitantes;
- áreas de domínio;
- eventos duplicados;
- decisões provisórias.


---

### 29. Identificar handoffs

Handoffs típicos:

```text
Customer Portal
-> Scheduling;

Scheduling
-> Capacity;

Scheduling
-> Notifications;

Scheduling
-> Field Execution;

Field Execution
-> Billing.
```

Handoff é local comum de:

- atraso;
- erro;
- perda de contexto;
- contrato ambíguo;
- ownership fragmentado;
- observabilidade incompleta.

---

### 30. Criar Handoff Map

Arquivo:

```text
event-storming/HANDOFF_MAP.md
```

Para cada handoff:

- origem;
- destino;
- fato;
- contrato;
- owner;
- SLA;
- falha;
- retry;
- correlação;
- evidência;
- hotspot.

---

### 31. Process Level: Schedule Appointment

Arquivo:

```text
event-storming/PROCESS_LEVEL_SCHEDULE_APPOINTMENT.md
```

Fluxo:

```text
Actor:
Scheduling Operator.

Read Model:
Eligible Service Request View.

Command:
Search Capacity.

External System:
Capacity Platform.

Event:
Capacity Offers Found.

Read Model:
Capacity Offer List.

Command:
Select Capacity Offer.

Event:
Capacity Offer Selected.

Policy:
Reserve Selected Capacity.

Command:
Reserve Capacity.

Event:
Capacity Reserved.

Command:
Schedule Appointment.

Aggregate Candidate:
Appointment.

Event:
Appointment Scheduled.

Policy:
Request Confirmation.

Command:
Request Customer Confirmation.

Event:
Appointment Confirmation Requested.
```

---

### 32. Adicionar rejeições

Fluxos de rejeição:

```text
Search Capacity
-> No Capacity Offer Found.

Reserve Capacity
-> Capacity Reservation Rejected.

Schedule Appointment
-> Appointment Scheduling Rejected.

Request Confirmation
-> Notification Request Rejected.
```

Nem toda tentativa produz o evento desejado.

Registre rejeições e compensações.

---

### 33. Criar Failure Scenarios

Arquivo:

```text
event-storming/FAILURE_SCENARIOS.md
```

Exemplo:

```markdown
## FAIL-004

Command:
Schedule Appointment.

Failure:
Repository concurrency conflict.

Previous effect:
Capacity Reserved.

Required reaction:
Release Capacity Reservation.

Owner:
Scheduling Application.

Consistency:
Compensating.

Observation:
Correlation ID required.
```

---

### 34. Design Level: Reschedule Appointment

Arquivo:

```text
event-storming/DESIGN_LEVEL_RESCHEDULE_APPOINTMENT.md
```

Fluxo detalhado:

```text
Actor:
Scheduling Operator.

Read Model:
Appointment Details.

Command:
Request Rescheduling.

Policy:
Evaluate Rescheduling Deadline.

Read Model:
Available Rescheduling Windows.

Command:
Select New Window.

Policy:
Check Appointment Conflict.

Command:
Reserve New Capacity.

Event:
New Capacity Reserved.

Command:
Reschedule Appointment.

Aggregate:
Appointment.

Event:
Appointment Rescheduled.

Policy:
Release Previous Capacity.

Command:
Release Capacity Reservation.

Event:
Previous Capacity Reservation Released.

Policy:
Notify Customer.

Command:
Prepare Rescheduling Notification.

Event:
Rescheduling Notification Prepared.
```

---

### 35. Identificar Aggregate Candidate

O Design Level sugere:

```text
Appointment
```

como Aggregate Candidate porque controla:

- identidade;
- janela atual;
- status;
- reserva atual;
- revisão;
- histórico;
- eventos.

O board fornece hipótese, não validação final.

---

### 36. Identificar Domain Service Candidate

Candidatos:

```text
ReschedulingDeadlinePolicy;

AppointmentConflictPolicy;

CapacityOfferSelectionPolicy.
```

Motivo:

- combinam conceitos;
- possuem linguagem;
- não pertencem naturalmente a um único objeto.

Event Storming também revisa decisões já existentes.

---

### 37. Identificar Bounded Context Candidates

Possíveis candidatos:

```text
Service Request;

Service Scheduling;

Capacity;

Customer Communication;

Field Execution;

Billing.
```

Critérios:

- linguagem distinta;
- ownership;
- regras;
- dados;
- ritmo de mudança;
- políticas;
- eventos;
- sistemas;
- equipe;
- dependência.

---

### 38. Criar Boundary Candidates

Arquivo:

```text
event-storming/BOUNDED_CONTEXT_CANDIDATES.md
```

Exemplo:

```markdown
## BC-CAND-02

Nome:
Service Scheduling.

Responsabilidade:
Transformar uma solicitação elegível
em compromisso agendado,
confirmado,
reagendado
ou cancelado.

Linguagem:
Appointment;
Appointment Window;
Rescheduling;
Cancellation.

Eventos:
Appointment Scheduled;
Appointment Confirmed;
Appointment Rescheduled;
Appointment Cancelled.

Upstream:
Service Request;
Capacity.

Downstream:
Notifications;
Field Execution;
Billing.

Hotspots:
confirmação;
reserva;
deadline;
concorrência.
```

---

### 39. Criar boundary policy

Arquivo:

```text
contracts/boundary-candidate-policy.yaml
```

Conteúdo:

```yaml
boundaryCandidate:
  requires:
    - responsibility
    - language
    - events
    - rules
    - ownership
    - dependencies
    - hotspots

  createdFrom:
    boardEvidence:
      required

  microserviceDecision:
    forbiddenAtThisStage

  finalBoundary:
    requiresFurtherValidation:
      true
```

---

### 40. Evitar microservice prematuro

Bounded Context Candidate não significa:

```text
novo microservice obrigatório.
```

Opções futuras:

- módulo;
- package;
- serviço;
- componente;
- aplicação separada;
- contexto lógico.


---

### 41. Identificar linguagem conflitante

Exemplos:

```text
Order
versus
Service Request.

Visit
versus
Appointment.

Slot
versus
Appointment Window.

Workzone
versus
Service Area.

Cancel Service
versus
Cancel Appointment.

Confirmation
versus
Customer Confirmation
versus
Internal Acknowledgment.
```


---

### 42. Criar catálogo de conflitos

Arquivo:

```text
event-storming/LANGUAGE_CONFLICTS.md
```

Campos:

- termo;
- significado A;
- significado B;
- contextos;
- exemplos;
- impacto;
- decisão provisória;
- owner;
- status.

---

### 43. Hotspots versus decisões

Não transforme pergunta em decisão falsa.

Exemplo incorreto:

```text
Decisão:
reagendamento cria nova Entity.
```

quando o grupo ainda não confirmou.

Registre:

```text
Hotspot:
identidade no reagendamento.

Hipótese:
manter Appointment ID.

Owner:
produto e arquitetura.

Status:
INVESTIGATING.
```

---

### 44. Criar Decision Log

Arquivo:

```text
event-storming/DECISION_LOG.md
```

Cada decisão possui:

- ID;
- contexto;
- evidência do board;
- opções;
- decisão;
- motivo;
- consequência;
- owner;
- data;
- revisão.

---

### 45. Criar Follow-up Actions

Arquivo:

```text
event-storming/FOLLOW_UP_ACTIONS.md
```

Exemplos:

```text
validar deadline de reagendamento;

confirmar semântica de confirmação;

medir atraso no handoff para Capacity;

revisar contrato de liberação;

definir owner de Service Area;

obter volume de reagendamentos;

validar política de expiração;

revisar evento de conclusão.
```

Cada ação precisa de owner e prazo.

---

### 46. Criar Aggregate Candidates

Arquivo:

```text
event-storming/AGGREGATE_CANDIDATES.md
```

Para cada candidato:

- command;
- events;
- invariants;
- state;
- identity;
- references;
- transaction need;
- size risk;
- open questions.

---

### 47. Criar Domain Service Candidates

Arquivo:

```text
event-storming/DOMAIN_SERVICE_CANDIDATES.md
```

Para cada candidato:

- regra;
- inputs;
- output;
- motivo para não estar em Entity;
- owner;
- tests;
- hotspot;
- status.

---

### 48. Criar Board Export

Arquivo:

```text
event-storming/BOARD_EXPORT.md
```

Formato textual:

```text
[Actor]
Scheduling Operator

[Read Model]
Appointment Details

[Command]
Request Rescheduling

[Policy]
Evaluate Rescheduling Deadline

[Event]
Rescheduling Allowed

[Command]
Reserve New Capacity

[Event]
New Capacity Reserved

[Command]
Reschedule Appointment

[Event]
Appointment Rescheduled
```

Isso preserva o conteúdo fora da ferramenta visual.

---

### 49. Rastreabilidade

Cada evento no board precisa apontar para:

- command;
- actor ou policy;
- processo;
- owner;
- hotspot;
- decisão;
- contexto candidato;
- artefato futuro.

Links ausentes precisam aparecer no relatório.

---

### 50. Criar traceability policy

Arquivo:

```text
contracts/traceability-policy.yaml
```

Conteúdo:

```yaml
traceability:
  event:
    linksTo:
      - process
      - owner
      - command-or-policy

  command:
    linksTo:
      - actor-or-policy
      - expected-event

  hotspot:
    linksTo:
      - owner
      - next-action

  boundaryCandidate:
    linksTo:
      - events
      - language
      - responsibility

  unresolvedLink:
    reported:
      required
```

---

### 51. Facilitação de conflitos

Quando especialistas discordarem:

1. não vote cedo;
2. peça exemplos reais;
3. procure cenários;
4. escreva os dois significados;
5. marque hotspot;
6. identifique impacto;
7. defina owner;
8. agende investigação.


---

### 52. Timeboxing

Sugestão:

```text
15 min:
charter e legenda.

45 min:
eventos livres.

30 min:
timeline.

30 min:
hotspots e linguagem.

45 min:
commands, actors e policies.

30 min:
boundaries e handoffs.

15 min:
ações e owners.
```


---

### 53. Sessões grandes

Para domínios amplos:

- faça Big Picture primeiro;
- divida processos;
- mantenha facilitador;
- use subgrupos;
- consolide conflitos;
- preserve um catálogo central;
- evite editar silenciosamente depois.


---

### 54. Remoto versus presencial

Presencial favorece:

- movimento;
- conversa;
- leitura espacial;
- agrupamento rápido.

Remoto favorece:

- participação distribuída;
- exportação;
- links;
- histórico.

Em ambos:

- legenda;
- timebox;
- owner;
- export;
- acessibilidade;
- backup;
- follow-up.

---

### 55. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  eventWithoutPastTense:
    action:
      REVIEW

  commandWithoutExpectedEvent:
    action:
      FAIL

  hotspotWithoutOwner:
    action:
      FAIL

  boundaryWithoutEvidence:
    action:
      FAIL

  technologyAsDomainConcept:
    action:
      FAIL

  unresolvedLanguageConflictHidden:
    action:
      FAIL

  boardWithoutExport:
    action:
      FAIL
```

---

### 56. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  missingDomainExpert:
    action:
      RESCHEDULE_OR_LIMIT_SCOPE

  unresolvedConflict:
    action:
      HOTSPOT_WITH_OWNER

  facilitatorDominance:
    action:
      CORRECT

  technologyDiscussion:
    action:
      PARKING_LOT

  boardLoss:
    action:
      RESTORE_FROM_EXPORT

  CQRSDeepDive:
    deferredToLesson631

  EventSourcingImplementation:
    deferredToLesson632
```

---

### 57. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson631:
    forbidden:
      - command-query-model-implementation
      - projection-handler
      - separate-read-database
      - read-model-rebuild

  lesson632:
    forbidden:
      - event-store
      - aggregate-replay
      - snapshotting-implementation
      - event-stream-persistence

  allowed:
    - discover-commands
    - discover-read-models
    - identify-event-sequence
```

---

### 58. Validar participantes

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-participant-coverage.ps1
```

Confirme:

- facilitador;
- especialista;
- operação;
- produto;
- engenharia;
- qualidade;
- owners de sistemas críticos.

---

### 59. Validar timeline

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-event-timeline.ps1
```

Procure:

- eventos no futuro;
- comandos como eventos;
- tecnologia;
- lacunas;
- duplicatas não avaliadas;
- evento sem owner;
- fluxo alternativo ausente.

---

### 60. Validar command-event links

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-command-event-links.ps1
```

Confirme:

- command;
- expected event;
- rejection;
- actor ou policy;
- preconditions;
- idempotência quando necessária.

---

### 61. Validar atores

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-actor-links.ps1
```

Confirme:

- ator definido;
- commands;
- autorização;
- responsabilidade;
- sistema versus pessoa;
- owner.

---

### 62. Validar policies

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-policy-links.ps1
```

Confirme:

- trigger event;
- command;
- owner;
- consistência;
- falha;
- retry;
- timing.

---

### 63. Validar read models

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-read-model-links.ps1
```

Confirme:

- ator;
- command suportado;
- dados;
- freshness;
- owner;
- segurança;
- CQRS ainda não decidido.

---

### 64. Validar hotspots

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-hotspots.ps1
```

Confirme:

- ID;
- pergunta;
- impacto;
- owner;
- ação;
- status;
- nenhuma remoção silenciosa.

---

### 65. Validar boundaries

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-boundary-candidates.ps1
```

Confirme:

- responsabilidade;
- linguagem;
- eventos;
- regras;
- owner;
- dependências;
- hotspots;
- nenhuma decisão prematura de microservice.

---

### 66. Validar rastreabilidade

Execute:

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-traceability.ps1
```

Confirme:

- events;
- commands;
- actors;
- policies;
- hotspots;
- boundary candidates;
- decisions;
- actions.

---

### 67. Criar reports

Exemplo:

```yaml
eventTimeline:
  events:
    27

  commands:
    18

  actors:
    7

  policies:
    9

  readModels:
    6

  externalSystems:
    5

  hotspots:
    14

  languageConflicts:
    6

  boundaryCandidates:
    6

  unresolvedLinks:
    3

  result:
    PASS_WITH_OPEN_QUESTIONS
```

---

### 68. Criar gate

O gate valida charter, participantes, legenda, níveis, timeline, links, hotspots, conflitos, handoffs, candidatos, decisões, export, rastreabilidade, documentação e evidence.

Status:

```text
PASS;

PASS_WITH_OPEN_QUESTIONS;

FAIL_SCOPE;

FAIL_PARTICIPANTS;

FAIL_TIMELINE;

FAIL_COMMAND_LINKS;

FAIL_ACTOR_LINKS;

FAIL_POLICY_LINKS;

FAIL_READ_MODEL_LINKS;

FAIL_HOTSPOTS;

FAIL_BOUNDARY_CANDIDATES;

FAIL_TRACEABILITY;

FAIL_EXPORT;

INCONCLUSIVE.
```

---

### 69. Coletar evidence

Arquivo:

```text
contracts/event-storming-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- scope;
- participant role count;
- event count;
- command count;
- actor count;
- policy count;
- read model count;
- external system count;
- hotspot count;
- language conflict count;
- boundary candidate count;
- Aggregate candidate count;
- Domain Service candidate count;
- decision count;
- follow-up action count;
- unresolved link count;
- export status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais;
- dados pessoais;
- segredos;
- URLs privadas;
- contratos reais;
- CQRS implementado;
- Event Store;
- payloads reais.

---

### 70. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-event-storming-contract.ps1

.\scripts\m19\service-scheduling-event-storming\validate-participant-coverage.ps1

.\scripts\m19\service-scheduling-event-storming\validate-event-timeline.ps1

.\scripts\m19\service-scheduling-event-storming\validate-command-event-links.ps1

.\scripts\m19\service-scheduling-event-storming\validate-actor-links.ps1

.\scripts\m19\service-scheduling-event-storming\validate-policy-links.ps1

.\scripts\m19\service-scheduling-event-storming\validate-read-model-links.ps1

.\scripts\m19\service-scheduling-event-storming\validate-hotspots.ps1

.\scripts\m19\service-scheduling-event-storming\validate-boundary-candidates.ps1

.\scripts\m19\service-scheduling-event-storming\validate-traceability.ps1

.\scripts\m19\service-scheduling-event-storming\collect-event-storming-evidence.ps1

.\scripts\m19\service-scheduling-event-storming\verify-event-storming-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 71. Encerrar o laboratório

Confirme:

- escopo explícito;
- participantes diversos;
- legenda acessível;
- eventos no passado;
- timeline principal;
- fluxos alternativos;
- commands ligados a events;
- actors ligados a commands;
- policies ligadas a triggers;
- read models ligados a decisões;
- sistemas externos mapeados;
- hotspots com owner;
- conflitos de linguagem visíveis;
- handoffs mapeados;
- Process Level completo;
- Design Level controlado;
- boundary candidates com evidência;
- Aggregate candidates;
- Domain Service candidates;
- decisões registradas;
- follow-ups com owner;
- board exportado;
- CQRS não aprofundado;
- Event Sourcing não implementado;
- reports sanitizados.

---

## Entendendo o que foi feito

### A conversa ganhou eixo

Eventos no passado organizaram a descoberta.

### A timeline ganhou alternativas

Fluxos felizes e falhas deixaram de ficar misturados.

### A linguagem ganhou conflitos visíveis

Sinônimos e homônimos passaram a indicar fronteiras.

### Os comandos ganharam causa

Cada intenção passou a apontar para um fato esperado.

### Os atores ganharam responsabilidade

Pessoas, sistemas e tempo passaram a ser distinguidos.

### As policies ganharam reações

Eventos passaram a disparar novas intenções de processo.

### Os read models ganharam propósito

Leituras foram associadas a decisões, sem antecipar CQRS.

### Os hotspots ganharam owner

Dúvidas deixaram de desaparecer em atas.

### As fronteiras ganharam evidência

Contextos candidatos passaram a nascer de linguagem, regras e ownership.

### As decisões ganharam rastreabilidade

Board, catálogo, log e follow-up passaram a se conectar.

---

## Erros comuns importantes

### Começar por tecnologia

O board vira arquitetura de solução, não descoberta do domínio.

### Permitir somente desenvolvedores

A linguagem fica incompleta.

### Corrigir eventos cedo demais

A diversidade inicial é perdida.

### Apagar duplicatas silenciosamente

Conflitos de linguagem desaparecem.

### Tratar hotspot como problema do facilitador

A dúvida precisa de owner do domínio.

### Transformar policy em classe imediatamente

A modelagem fica presa à implementação.

### Considerar read model como decisão de CQRS

A necessidade de leitura não obriga uma arquitetura.

### Considerar contexto como microservice

Fronteira lógica não determina deployment.

### Fazer board sem export

Conhecimento fica preso à ferramenta.

### Antecipar CQRS ou Event Sourcing

A aula perde o foco em descoberta colaborativa.

---

## Comandos úteis

### Validar timeline

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-event-timeline.ps1
```

### Validar hotspots

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-hotspots.ps1
```

### Validar boundaries

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-boundary-candidates.ps1
```

### Validar rastreabilidade

```powershell
.\scripts\m19\service-scheduling-event-storming\validate-traceability.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-event-storming\verify-event-storming-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Charter

Defina objetivo, escopo e fora de escopo.

### Parte 2 — Big Picture

Liste e ordene eventos.

### Parte 3 — Hotspots

Registre conflitos e dúvidas.

### Parte 4 — Commands e Actors

Ligue intenções e responsáveis.

### Parte 5 — Policies

Modele reações.

### Parte 6 — Read Models

Descubra informações necessárias.

### Parte 7 — Process Level

Aprofunde Schedule Appointment.

### Parte 8 — Design Level

Aprofunde Reschedule Appointment.

### Parte 9 — Boundaries

Crie candidatos com evidência.

### Parte 10 — Gate

Valide export, rastreabilidade e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 629 e ponte para a aula 631 foram preservadas;
- o laboratório `service-scheduling-event-storming` foi criado;
- Event Storming Charter foi criado;
- objetivo e escopo foram definidos;
- fora de escopo inclui tecnologia, CQRS e Event Sourcing;
- participantes incluem negócio, operação, produto, engenharia e QA;
- facilitador possui regras explícitas;
- legenda textual foi criada;
- eventos estão no passado;
- Big Picture contém timeline principal;
- fluxos de reagendamento e cancelamento foram adicionados;
- duplicatas não foram removidas silenciosamente;
- conflitos de linguagem foram registrados;
- hotspots possuem ID, impacto, owner e ação;
- commands estão ligados a eventos esperados;
- actors estão ligados a commands;
- policies possuem trigger e command;
- read models suportam decisões;
- read models não significam CQRS implementado;
- sistemas externos foram inventariados;
- handoffs foram mapeados;
- Process Level de agendamento foi criado;
- rejeições e compensações foram documentadas;
- Design Level de reagendamento foi criado;
- `Appointment` apareceu como Aggregate candidate;
- Domain Service candidates foram registrados;
- Bounded Context candidates possuem evidência;
- contexto candidato não foi convertido automaticamente em microservice;
- Decision Log foi criado;
- Follow-up Actions possuem owner;
- board foi exportado em formato textual;
- traceability links foram validados;
- reports e gate foram criados;
- CQRS não foi aprofundado;
- Event Sourcing não foi implementado;
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
  labs/m19/aula-630-event-storming/service-scheduling-event-storming `
  scripts/m19/service-scheduling-event-storming `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|privateBoardUrl|realContract|KafkaTemplate|EventStore|projectionHandler|cqrsDeepDive|eventSourcingImplementation"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): conduzir Event Storming"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- URLs privadas;
- contratos reais;
- CQRS implementado;
- Event Store;
- payloads reais.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você conduziu Event Storming de forma estruturada.

Você criou:

```text
charter;

participantes;

legenda;

Big Picture;

timeline;

commands;

actors;

policies;

read models;

sistemas externos;

hotspots;

conflitos de linguagem;

handoffs;

Process Level;

Design Level;

boundary candidates;

Aggregate candidates;

Domain Service candidates;

Decision Log;

follow-up actions;

board export.
```

Você comprovou que Event Storming organiza conversas por fatos ocorridos; que duplicatas podem revelar conflitos de linguagem; que hotspots precisam de owner; que commands, actors, policies e read models explicam como o processo funciona; que handoffs revelam riscos; que Bounded Context candidates surgem de linguagem, regras e ownership; e que o board precisa gerar decisões e ações, não apenas documentação visual.

A próxima aula será:

```text
631 - M19.21 - CQRS
```

Nela, você irá aprofundar quando e como separar command model e query model, desenhar handlers, projections, read models, consistência de leitura e trade-offs operacionais.

Nenhuma implementação de CQRS ou Event Sourcing foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini charter e escopo.
- [ ] Convidei participantes diversos.
- [ ] Criei timeline de eventos.
- [ ] Registrei hotspots.
- [ ] Liguei commands, actors e policies.
- [ ] Descobri read models.
- [ ] Aprofundei um processo.
- [ ] Exportei board e traceability.

---

## Troubleshooting adicional

### A sessão virou debate técnico

Mova tecnologia para parking lot e volte aos fatos.

### Poucos eventos aparecem

Peça exemplos reais, exceções e finais de processo.

### Especialistas usam termos diferentes

Registre ambos e crie hotspot de linguagem.

### Um participante domina

O facilitador redistribui a fala.

### Ninguém sabe o owner

Registre hotspot e follow-up.

### O board está enorme

Separe Big Picture e processos.

### O grupo quer decidir microservices

Volte a responsabilidades e contextos candidatos.

### Read Model virou discussão de banco

Registre a necessidade de informação e adie tecnologia.

### O board não cabe na ferramenta

Exporte em texto e divida por processo.

### A equipe começou a implementar projections

Preserve CQRS para a aula 631.

---

## Perguntas de revisão

1. O que é Event Storming?
2. Por que começar por eventos?
3. O que é Big Picture?
4. O que é Process Level?
5. O que é Design Level?
6. O que é hotspot?
7. O que é policy no board?
8. O que é read model no board?
9. Quem pode ser actor?
10. Por que permitir duplicatas?
11. O que conflitos de linguagem revelam?
12. O que é handoff?
13. Como identificar boundary candidate?
14. Boundary candidate é microservice?
15. Qual papel do facilitador?
16. Por que exportar o board?
17. O que deve ocorrer com perguntas abertas?
18. Event Storming implementa CQRS?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Técnica colaborativa baseada em fatos do domínio.
2. Porque fatos organizam a conversa sem começar pela tecnologia.
3. Visão ampla do domínio.
4. Aprofundamento de um processo.
5. Detalhamento de um recorte próximo da solução.
6. Dúvida, conflito ou risco.
7. Reação a um evento que gera intenção.
8. Informação necessária para decidir.
9. Pessoa, papel, sistema ou tempo.
10. Para revelar linguagem e perspectivas.
11. Possíveis fronteiras e ambiguidades.
12. Transferência de responsabilidade.
13. Por linguagem, regras, eventos, owner e dependências.
14. Não.
15. Organizar a conversa sem decidir o domínio.
16. Preservar conhecimento e rastreabilidade.
17. Receber owner e follow-up.
18. Não.
19. CQRS.
20. CQRS.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 630 - M19.20 - Event Storming

- Aprofundei Event Storming.
- Criei o laboratório `service-scheduling-event-storming`.
- Criei Event Storming Charter, escopo e fora de escopo.
- Defini participantes de negócio, operação, produto, engenharia e QA.
- Criei legenda textual e regras de facilitação.
- Modelei o Big Picture do fluxo de atendimento.
- Organizei eventos em timeline.
- Mantive duplicatas para investigar linguagem.
- Registrei conflitos como Visit versus Appointment e Slot versus Appointment Window.
- Criei Hotspot Register com owner e follow-up.
- Liguei commands aos eventos esperados.
- Liguei actors aos commands.
- Modelei policies como reações a eventos.
- Descobri read models necessários para decisões.
- Inventariei sistemas externos.
- Mapeei handoffs e falhas.
- Aprofundei Schedule Appointment no Process Level.
- Aprofundei Reschedule Appointment no Design Level.
- Registrei `Appointment` como Aggregate candidate.
- Registrei Domain Service candidates.
- Criei Bounded Context candidates com evidência.
- Evitei decidir microservices prematuramente.
- Criei Decision Log e Follow-up Actions.
- Exportei o board em formato textual.
- Criei scripts, reports, gate e evidence.
- Não antecipei CQRS ou Event Sourcing.
- Próxima aula: CQRS.
```

---

## Referência técnica curta

- Event Storming.
- Big Picture.
- Process Level.
- Design Level.
- Domain Event.
- Command.
- Actor.
- Policy.
- Read Model.
- Hotspot.

Regra final:

```text
Event Storming deve ser conduzido como descoberta colaborativa e não como desenho técnico: a sessão começa com charter, escopo, participantes diversos, legenda e eventos no passado, organiza uma timeline principal e fluxos alternativos, preserva duplicatas para revelar conflitos de linguagem e registra todo hotspot com impacto, owner, ação e status; commands são ligados a eventos esperados, actors ou policies explicam quem inicia cada intenção, read models descrevem informações necessárias sem antecipar CQRS e sistemas externos e handoffs revelam contratos, atrasos, falhas e ownership; Big Picture identifica o domínio amplo, Process Level aprofunda `Schedule Appointment` e Design Level detalha `Reschedule Appointment`, produzindo candidatos a Bounded Context, Aggregate e Domain Service sustentados por eventos, linguagem, regras e responsabilidades, sem converter automaticamente fronteiras em microservices; decisões, perguntas, follow-ups e export textual preservam rastreabilidade, enquanto o gate valida participantes, timeline, links, hotspots, boundaries, ações, documentação e evidence; CQRS é aprofundado somente na aula 631 e Event Sourcing conceitual permanece reservado à aula 632.
```
