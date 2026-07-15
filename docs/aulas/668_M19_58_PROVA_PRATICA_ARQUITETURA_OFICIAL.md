# 668 - M19.58 - Prova pratica arquitetura

## Apresentação da aula

Nas aulas 664 e 665, você construiu um projeto completo de arquitetura para Ordens de Serviço.

Nas aulas 666 e 667, você revisou essa arquitetura, encontrou contradições, classificou findings, reavaliou riscos, identificou causas raiz, planejou correções, fechou evidências, simulou uma banca e emitiu uma decisão final.

Agora você enfrentará um caso novo.

A prova prática não reutilizará o projeto de OS.

O objetivo é verificar se você consegue transferir o método para outro domínio.

Você receberá um cenário de negócio com:

- pressão de prazo;
- múltiplos canais;
- dados sensíveis;
- integrações externas;
- picos de carga;
- necessidade de consistência;
- partes assíncronas;
- requisitos de auditoria;
- multi-tenancy;
- sistemas legados;
- rollout progressivo;
- restrições de equipe;
- decisões ainda abertas.

O caso será:

```text
Plataforma de Reservas de Exames Diagnosticos.
```

A organização atende clínicas, laboratórios e hospitais.

Pacientes precisam localizar unidades, consultar disponibilidade, reservar horários, confirmar presença, reagendar, cancelar e receber orientações.

As unidades precisam publicar agendas, bloquear equipamentos, validar preparo, registrar atendimento e reportar resultados operacionais.

A plataforma precisa integrar:

- portais;
- aplicativos;
- call center;
- sistemas hospitalares;
- laboratórios parceiros;
- provedores de mensagens;
- sistemas financeiros;
- identidade;
- analytics;
- legados regionais.

A prova não avalia se você escolheu a tecnologia “mais moderna”.

Ela avalia se você consegue:

- enquadrar o problema;
- definir o escopo;
- identificar capacidades;
- modelar boundaries;
- escolher autoridades de dados;
- desenhar contratos;
- decidir consistência;
- tratar idempotência;
- proteger dados e tenants;
- observar jornadas;
- planejar resiliência;
- definir rollout e rollback;
- registrar trade-offs;
- produzir evidências;
- defender a solução.

O laboratório será:

```text
labs/m19/aula-668-prova-pratica-arquitetura/diagnostic-booking-architecture-exam
```

A prova será dividida em blocos:

```text
Bloco 1:
framing e descoberta.

Bloco 2:
dominio e boundaries.

Bloco 3:
dados e contratos.

Bloco 4:
sistemas distribuidos.

Bloco 5:
seguranca e observabilidade.

Bloco 6:
deploy, rollout e operacao.

Bloco 7:
defesa arquitetural.
```

A próxima aula será:

```text
669 - M19.59 - Checklist de arquiteto Java
```

A aula 669 consolidará critérios profissionais para análise, decisão, implementação, operação, comunicação e evolução arquitetural.

Nesta aula, o checklist final da formação não será antecipado.

Regra central:

```text
uma prova pratica de arquitetura
nao mede memorizacao;

ela mede
qualidade de raciocinio,
coerencia,
trade-offs,
evidencias
e capacidade de defesa.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
666:
Revisao arquitetura parte 1.

667:
Revisao arquitetura parte 2.

668:
Prova pratica arquitetura.

669:
Checklist de arquiteto Java.

670:
Fechamento do Modulo 19.
```

A prova prática fecha o ciclo técnico do módulo.

Você já estudou:

- DDD;
- arquitetura hexagonal;
- bounded contexts;
- C4;
- ADR;
- RFC;
- sistemas distribuídos;
- CAP;
- PACELC;
- Saga;
- Outbox;
- Inbox;
- idempotência;
- multi-tenancy;
- resiliência;
- segurança;
- observabilidade;
- dados;
- governança;
- documentação viva;
- liderança técnica;
- revisão arquitetural.

Agora esses assuntos precisam aparecer como decisões conectadas.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-668-prova-pratica-arquitetura
└── diagnostic-booking-architecture-exam
    ├── README.md
    ├── exam
    │   ├── EXAM_BRIEF.md
    │   ├── BUSINESS_CONTEXT.md
    │   ├── CONSTRAINTS.md
    │   ├── ASSUMPTIONS.md
    │   ├── DELIVERABLES.md
    │   ├── TIMEBOX.md
    │   ├── EVALUATION_RUBRIC.md
    │   ├── SUBMISSION_CHECKLIST.md
    │   └── DEFENSE_QUESTIONS.md
    ├── solution
    │   ├── PROBLEM_STATEMENT.md
    │   ├── SCOPE.md
    │   ├── ACTOR_CATALOG.md
    │   ├── BUSINESS_JOURNEYS.md
    │   ├── CAPABILITY_MAP.md
    │   ├── DOMAIN_MAP.md
    │   ├── BOUNDED_CONTEXTS.md
    │   ├── CONTEXT_MAP.md
    │   ├── QUALITY_ATTRIBUTE_SCENARIOS.md
    │   ├── C4_SYSTEM_CONTEXT.md
    │   ├── C4_CONTAINER.md
    │   ├── DATA_AUTHORITY_MATRIX.md
    │   ├── API_CONTRACT_CATALOG.md
    │   ├── EVENT_CONTRACT_CATALOG.md
    │   ├── CONSISTENCY_MATRIX.md
    │   ├── IDEMPOTENCY_STRATEGY.md
    │   ├── SECURITY_ARCHITECTURE.md
    │   ├── OBSERVABILITY_ARCHITECTURE.md
    │   ├── RESILIENCE_POLICY.md
    │   ├── DEPLOYMENT_MODEL.md
    │   ├── ROLLOUT_AND_MIGRATION.md
    │   ├── ADR_CATALOG.md
    │   ├── RISK_REGISTER.md
    │   ├── TRACEABILITY_MAP.md
    │   ├── ARCHITECTURE_DEFENSE.md
    │   └── OPEN_QUESTIONS.md
    ├── contracts
    │   ├── architecture-exam-contract.yaml
    │   ├── scope-policy.yaml
    │   ├── boundary-policy.yaml
    │   ├── data-authority-policy.yaml
    │   ├── contract-policy.yaml
    │   ├── consistency-policy.yaml
    │   ├── security-policy.yaml
    │   ├── observability-policy.yaml
    │   ├── rollout-policy.yaml
    │   ├── defense-policy.yaml
    │   └── evidence-policy.yaml
    ├── evidence
    │   ├── exam-evidence.yaml
    │   ├── architecture-score.yaml
    │   ├── finding-report.yaml
    │   └── final-decision.yaml
    └── scripts
        ├── validate-submission.ps1
        ├── validate-boundaries.ps1
        ├── validate-data-authority.ps1
        ├── validate-contracts.ps1
        ├── validate-consistency.ps1
        ├── validate-security.ps1
        ├── validate-observability.ps1
        ├── validate-rollout.ps1
        ├── validate-defense.ps1
        └── calculate-score.ps1
```

---

## Cenário da prova

### Organização

A empresa fictícia se chama:

```text
Vida Diagnosticos.
```

Ela opera:

```text
120 unidades proprias;

80 unidades parceiras;

4 marcas;

7 regioes;

3 sistemas legados de agenda;

1 portal web;

1 aplicativo;

1 call center;

2 provedores de mensagens;

1 ERP financeiro.
```

### Problema atual

O agendamento é fragmentado.

Cada região possui regras diferentes.

Há horários duplicados.

Cancelamentos não liberam capacidade imediatamente.

O paciente recebe orientações divergentes.

O call center visualiza agenda stale.

Parceiros enviam arquivos em lote.

Alguns sistemas aceitam reserva sem confirmação de preparo.

Os gestores não conseguem medir a jornada ponta a ponta.

### Objetivo de negócio

Criar uma plataforma que permita:

- consultar disponibilidade;
- reservar exame;
- confirmar preparo;
- reagendar;
- cancelar;
- bloquear equipamento;
- sincronizar parceiros;
- notificar paciente;
- auditar alterações;
- acompanhar SLA;
- operar múltiplas marcas e tenants.

### Restrições

```text
Java 21;

PostgreSQL;

mensageria corporativa;

cloud hibrida;

legados continuarao ativos
por pelo menos 18 meses;

equipe total:
18 engenheiros;

prazo para primeiro rollout:
6 meses;

zero dupla reserva
para equipamentos exclusivos;

dados de saude
sao sensiveis;

algumas integracoes
funcionam apenas por arquivo;

call center exige resposta
em ate 2 segundos;

portal exige disponibilidade
em ate 700 ms no p95.
```

### Volumes

```text
2 milhoes de consultas
de disponibilidade por dia;

180 mil reservas por dia;

pico de 600 consultas por segundo;

pico de 120 comandos por segundo;

15% das reservas
sao reagendadas;

8% sao canceladas;

40 mil arquivos por mes
de parceiros;

3 milhoes de notificacoes
por mes.
```

---

## Regras da prova

### Regra 1: não começar pela tecnologia

A primeira entrega deve ser:

- problema;
- escopo;
- capacidades;
- jornadas;
- qualidade;
- riscos.

### Regra 2: decisões precisam de evidência

Toda escolha importante precisa registrar:

- contexto;
- alternativas;
- decisão;
- consequência;
- evidência necessária;
- owner;
- review trigger.

### Regra 3: não existe resposta única

Você pode escolher:

- monólito modular;
- serviços;
- solução híbrida;
- legados encapsulados;
- arquitetura orientada a eventos;
- integração síncrona controlada.

A coerência será avaliada.

### Regra 4: nenhum risco crítico pode ficar invisível

Risco pode ser tratado, aceito ou escalado.

Não pode ser omitido.

### Regra 5: o rollout faz parte da solução

Você precisa explicar coexistência, migração, compatibilidade e rollback.

### Regra 6: a defesa conta pontos

Uma decisão correta sem justificativa perde força.

---

## Timebox recomendado

A prova pode ser executada em oito horas.

Distribuição:

```text
45 min:
framing.

60 min:
capabilities e journeys.

75 min:
dominio e boundaries.

75 min:
dados, APIs e eventos.

60 min:
consistencia e idempotencia.

60 min:
seguranca e observabilidade.

45 min:
deploy e rollout.

40 min:
ADRs, riscos e traceability.

40 min:
defesa e revisao final.
```

Se houver menos tempo, priorize:

1. problema;
2. boundaries;
3. autoridade de dados;
4. consistência;
5. segurança;
6. rollout;
7. trade-offs.

---

## Bloco 1 — Framing e descoberta

### 1. Criar Problem Statement

Responda:

```text
qual dor de negocio
a plataforma resolve?

quem sofre com o problema?

qual comportamento precisa mudar?

qual risco e inaceitavel?

como sucesso sera medido?
```

Exemplo de direção:

```text
reduzir fragmentacao
e inconsistencias
no agendamento de exames,
preservando disponibilidade,
seguranca,
auditoria
e coexistencia com legados.
```

### 2. Definir escopo

Dentro:

- disponibilidade;
- reserva;
- confirmação;
- preparo;
- reagendamento;
- cancelamento;
- bloqueio de equipamento;
- integração com parceiros;
- notificações;
- auditoria;
- multi-tenancy.

Fora:

- prontuário eletrônico completo;
- laudo médico;
- faturamento completo;
- gestão de estoque;
- gestão de pessoal;
- CRM completo.

### 3. Mapear atores

Atores:

- paciente;
- atendente;
- operador de unidade;
- profissional de saúde;
- administrador de tenant;
- parceiro;
- auditor;
- sistema legado;
- ERP;
- provedor de mensagens.

### 4. Mapear jornadas

Jornadas mínimas:

```text
consultar disponibilidade;

reservar exame;

confirmar preparo;

reagendar;

cancelar;

bloquear equipamento;

importar agenda parceira;

notificar paciente.
```

Escolha três jornadas críticas.

---

## Bloco 2 — Domínio e boundaries

### 5. Criar Capability Map

Capacidades possíveis:

```text
Patient Access;

Availability Management;

Booking Management;

Preparation Management;

Facility Management;

Equipment Capacity;

Partner Integration;

Communication;

Tenant Administration;

Audit;

Operational Analytics.
```

Classifique:

- core;
- supporting;
- generic.

### 6. Criar Domain Map

Subdomínios possíveis:

```text
Booking;

Availability;

Capacity;

Preparation;

Patient Identity;

Facility;

Partner Integration;

Communication;

Audit;

Tenant Configuration;

Analytics.
```

### 7. Definir bounded contexts

Uma solução possível:

```text
Booking;

Availability;

Capacity;

Preparation;

Partner Gateway;

Communication;

Tenant Administration;

Audit.
```

Você pode propor outra.

Mas deve explicar:

- responsabilidade;
- linguagem;
- aggregates;
- autoridade;
- published events;
- consumed events;
- owner.

### 8. Criar Context Map

Exemplo:

```text
Booking
-> Availability:
customer-supplier.

Availability
-> Capacity:
published language.

Booking
-> Preparation:
orchestrated process.

Partner Gateway
-> Booking:
anti-corruption layer.

Communication
<- business contexts:
event consumer.
```

---

## Bloco 3 — Dados e contratos

### 9. Criar Data Authority Matrix

Produtos de dados:

```text
Booking;

Time Slot;

Equipment Reservation;

Preparation Rule;

Patient Contact Preference;

Facility Schedule;

Partner Import;

Notification Delivery;

Tenant Policy;

Audit Record.
```

Defina uma autoridade para cada um.

### 10. Proibir writers duplicados

Exemplo inválido:

```text
Booking e Availability
alteram TimeSlot.status.
```

Escolha autoridade.

Outros contexts recebem fatos ou comandos.

### 11. Criar APIs

Operações mínimas:

```text
GET /availability;

POST /bookings;

POST /bookings/{id}/confirm-preparation;

POST /bookings/{id}/reschedule;

POST /bookings/{id}/cancel;

POST /equipment/{id}/blocks;

POST /partner-imports;

GET /bookings/{id}.
```

Cada contrato precisa de:

- owner;
- tenant;
- authorization;
- request;
- response;
- errors;
- idempotency;
- SLO;
- version.

### 12. Criar eventos

Eventos possíveis:

```text
BookingCreatedV1;

BookingConfirmedV1;

BookingRescheduledV1;

BookingCancelledV1;

CapacityReservedV1;

CapacityReleasedV1;

PreparationConfirmedV1;

PartnerImportCompletedV1;

PatientNotificationRequestedV1.
```

Cada evento precisa de:

- owner;
- fact;
- schema;
- version;
- ordering key;
- consumers;
- PII classification;
- retention.

---

## Bloco 4 — Sistemas distribuídos

### 13. Criar Consistency Matrix

Decida por operação:

```text
consultar disponibilidade;

reservar;

reagendar;

cancelar;

confirmar preparo;

importar lote;

notificar.
```

Exemplo:

```text
reserve equipment:
strong in Capacity.

propagate booking:
eventual.

partner projection:
eventual with freshness.

notification:
eventual and retryable.
```

### 14. Modelar reserva

Problema:

```text
dois pacientes
tentam reservar
o mesmo equipamento
no mesmo horario.
```

A resposta precisa incluir:

- authority;
- local transaction;
- unique constraint ou lock;
- idempotency;
- timeout;
- retry;
- conflict error;
- audit;
- evidence.

### 15. Modelar Saga

Fluxo possível:

```text
Booking inicia reserva;

Capacity reserva;

Preparation valida regra;

Booking confirma;

Communication recebe evento.
```

Defina:

- state;
- deadline;
- pivot;
- compensation;
- late reply;
- manual intervention.

### 16. Definir Outbox e Inbox

Explique:

- onde Outbox é necessária;
- quais consumers precisam de Inbox;
- como deduplicar;
- como reprocessar;
- como observar backlog.

### 17. Definir PACELC

Para cada caminho crítico, explique:

- comportamento em partition;
- preferência entre availability e consistency;
- comportamento normal;
- latência aceitável;
- freshness aceitável.

---

## Bloco 5 — Segurança e observabilidade

### 18. Criar Security Architecture

Mapeie:

- human identities;
- workload identities;
- tenant context;
- patient data;
- preparation data;
- partner files;
- broker;
- databases;
- object storage;
- audit;
- secrets;
- supply chain.

### 19. Definir autorização

Exemplo:

```text
CANCEL_BOOKING
```

Pode exigir:

- principal autenticado;
- tenant correto;
- patient ownership ou role;
- booking em estado permitido;
- prazo de cancelamento;
- audit.

### 20. Proteger dados sensíveis

Defina:

- minimização;
- classificação;
- encryption;
- retention;
- logging;
- access purpose;
- audit;
- deletion;
- backup;
- incident response.

Não faça afirmações jurídicas específicas.

Trate políticas como requisitos a validar com responsáveis.

### 21. Criar Observability Architecture

Jornadas:

- availability search;
- booking creation;
- reschedule;
- partner import.

Sinais:

- journey outcome;
- latency;
- capacity conflict;
- Saga state;
- Outbox age;
- consumer lag;
- duplicate count;
- denied access;
- manual intervention.

### 22. Definir SLOs

Exemplos:

```text
Availability Search:
99,9%;
p95 <= 700 ms.

Booking Create:
99,5%;
p95 <= 2 s.

Call Center Read:
99,9%;
p95 <= 2 s.

Partner Import:
99% concluído
em até 30 min.
```

### 23. Controlar cardinalidade

Proibido em labels:

- patient ID;
- booking ID;
- tenant ID;
- exam ID;
- trace ID;
- error message.

---

## Bloco 6 — Deploy, rollout e operação

### 24. Criar Deployment Model

Escolha deploy units.

Uma possibilidade:

```text
Booking Application;

Availability Application;

Capacity Application;

Preparation Module;

Partner Gateway;

Communication Worker;

Audit Worker.
```

Você pode usar monólito modular para parte da solução.

Explique por quê.

### 25. Criar Resilience Policy

Por integração:

- timeout;
- retry;
- backoff;
- circuit breaker;
- bulkhead;
- fallback;
- idempotency;
- recovery.

### 26. Criar Rollout and Migration

A solução precisa coexistir com três legados.

Fases possíveis:

```text
baseline;

contracts;

shadow read;

adapter;

dual run;

partner pilot;

tenant canary;

backfill;

traffic expansion;

legacy write removal;

cleanup.
```

### 27. Definir stop conditions

Exemplos:

```text
double booking > 0;

cross-tenant finding > 0;

error budget burn;

reconciliation mismatch > 0,1%;

partner import failure > 2%;

manual intervention acima do budget.
```

### 28. Definir rollback

Explique:

- versão;
- schema;
- eventos;
- dual run;
- feature flags;
- state reconciliation;
- owner;
- rehearsal.

### 29. Criar runbooks

Mínimos:

```text
Capacity Conflict Spike;

Booking Saga Stuck;

Partner Import Failure;

Outbox Lag;

Cross-Tenant Denial Spike;

Rollback Booking Platform.
```

---

## Bloco 7 — Defesa arquitetural

### 30. Criar ADRs

ADRs mínimos:

```text
ADR-001:
domain boundaries.

ADR-002:
data authority.

ADR-003:
consistency strategy.

ADR-004:
legacy integration.

ADR-005:
multi-tenancy.

ADR-006:
deployment model.

ADR-007:
rollout strategy.
```

### 31. Criar Risk Register

Riscos:

- dupla reserva;
- cross-tenant;
- preparação incorreta;
- importação duplicada;
- arquivo malformado;
- provider outage;
- stale availability;
- migration inconsistente;
- mensagem duplicada;
- rollback impossível.

### 32. Criar Traceability Map

Conecte:

```text
journey
-> capability
-> context
-> data
-> API
-> event
-> SLO
-> risk
-> ADR
-> evidence.
```

### 33. Criar Architecture Defense

Estrutura:

```text
problema;

escopo;

capabilities;

boundaries;

dados;

contratos;

consistencia;

seguranca;

observabilidade;

deploy;

rollout;

riscos;

trade-offs;

evidence;

open questions.
```

---

## Contrato da prova

Arquivo:

```text
contracts/architecture-exam-contract.yaml
```

Conteúdo:

```yaml
architectureExam:
  case:
    Diagnostic-Booking

  required:
    - problem-statement
    - scope
    - actors
    - journeys
    - capabilities
    - domain-map
    - bounded-contexts
    - context-map
    - quality-scenarios
    - C4
    - data-authority
    - API-contracts
    - event-contracts
    - consistency
    - idempotency
    - security
    - observability
    - resilience
    - deployment
    - rollout
    - rollback
    - ADRs
    - risks
    - traceability
    - defense
    - evidence

  forbidden:
    - technology-first
    - shared-write-authority
    - retry-without-idempotency
    - contract-without-owner
    - cross-tenant-access
    - unmeasurable-quality
    - rollout-without-rollback
    - claim-without-evidence
    - final-checklist-deep-dive

  nextLesson:
    code:
      M19.59
```

---

## Rubrica de avaliação

Pontuação total:

```text
100 pontos.
```

### Framing — 10 pontos

- problema claro;
- objetivos;
- não objetivos;
- escopo;
- stakeholders;
- métricas.

### Domínio — 15 pontos

- capabilities;
- subdomínios;
- bounded contexts;
- linguagem;
- ownership;
- context map.

### Dados — 10 pontos

- autoridade;
- writers;
- replicas;
- classification;
- lifecycle;
- reconciliation.

### Contratos — 10 pontos

- APIs;
- events;
- owner;
- version;
- security;
- errors;
- compatibility.

### Distribuição — 15 pontos

- consistency;
- Saga;
- Outbox;
- Inbox;
- idempotency;
- PACELC;
- recovery.

### Segurança — 10 pontos

- identities;
- tenant;
- authorization;
- sensitive data;
- secrets;
- audit;
- supply chain.

### Observabilidade — 10 pontos

- journeys;
- SLOs;
- alerts;
- runbooks;
- cardinality;
- traceability.

### Operação — 10 pontos

- resilience;
- deployment;
- rollout;
- rollback;
- migration;
- game day.

### Defesa — 10 pontos

- decisões;
- alternativas;
- evidence;
- trade-offs;
- limitations;
- triggers.

---

## Faixas de resultado

```text
90 a 100:
arquitetura senior defensavel.

80 a 89:
arquitetura forte
com lacunas controladas.

70 a 79:
arquitetura funcional,
mas com riscos relevantes.

60 a 69:
desenho parcial
e baixa evidencia.

abaixo de 60:
revisao necessaria
antes de avancar.
```

Uma falha crítica pode limitar a nota mesmo com pontuação alta.

Falhas críticas:

- cross-tenant não tratado;
- dupla reserva sem controle;
- rollout sem rollback;
- autoridade duplicada;
- dados sensíveis sem proteção;
- retry sem idempotência em comando crítico;
- arquitetura sem owner;
- claim crítico sem evidence.

---

## Evidências da prova

Arquivo:

```text
evidence/exam-evidence.yaml
```

Campos:

- lesson;
- case;
- problem statement status;
- journey count;
- capability count;
- bounded context count;
- data authority coverage;
- critical API count;
- critical API idempotency coverage;
- event count;
- event owner coverage;
- consistency decision count;
- cross-tenant test status;
- double booking test status;
- critical journey count;
- SLO coverage;
- runbook count;
- tested runbook count;
- rollout stage count;
- rollback readiness;
- ADR count;
- risk count;
- critical open risk count;
- traceability coverage;
- defense status;
- score;
- decision;
- timestamp.

Não inclua:

- pacientes reais;
- dados de saúde reais;
- tenants reais;
- endpoints privados;
- credenciais;
- arquivos de parceiros reais;
- topologia real;
- conteúdo completo do checklist da aula 669.

---

## Validações obrigatórias

### Validar boundaries

```powershell
.\scripts\validate-boundaries.ps1
```

Deve falhar se:

- context sem responsibility;
- aggregate com dois owners;
- shared entity;
- context sem owner;
- relação sem contract.

### Validar autoridade

```powershell
.\scripts\validate-data-authority.ps1
```

Deve falhar se:

- data product sem authority;
- vários writers;
- replica sem freshness;
- repair sem owner.

### Validar contratos

```powershell
.\scripts\validate-contracts.ps1
```

Deve falhar se:

- API crítica sem idempotência;
- evento sem version;
- owner ausente;
- breaking change;
- PII sem classificação.

### Validar consistência

```powershell
.\scripts\validate-consistency.ps1
```

Deve falhar se:

- operação crítica sem decision;
- timeout excede SLO;
- Saga sem compensation;
- retry sem idempotency;
- recovery ausente.

### Validar segurança

```powershell
.\scripts\validate-security.ps1
```

Deve falhar se:

- tenant confiado pelo payload;
- cache sem tenant;
- workload sem identity;
- secret em código;
- authorization incompleta.

### Validar observabilidade

```powershell
.\scripts\validate-observability.ps1
```

Deve falhar se:

- jornada crítica sem SLO;
- SLO sem alert;
- alert sem runbook;
- label proibida;
- correlation ausente.

### Validar rollout

```powershell
.\scripts\validate-rollout.ps1
```

Deve falhar se:

- migration destrutiva;
- stop condition ausente;
- rollback não ensaiado;
- dual run sem reconciliation;
- cleanup sem owner.

### Calcular score

```powershell
.\scripts\calculate-score.ps1
```

---

## Perguntas da banca

Prepare respostas para:

1. Por que esses bounded contexts?
2. O que permaneceria em monólito modular?
3. Quem é autoridade de Time Slot?
4. Como impedir dupla reserva?
5. Como tratar stale availability?
6. Como integrar arquivos de parceiros?
7. Onde usar mensageria?
8. Onde evitar mensageria?
9. Como proteger dados sensíveis?
10. Como garantir isolamento de tenant?
11. Como lidar com timeout ambíguo?
12. Como reprocessar evento?
13. Como detectar importação duplicada?
14. Como observar a jornada?
15. Como o call center recebe resposta em dois segundos?
16. Como migrar três legados?
17. Como fazer rollback?
18. Qual maior risco residual?
19. Qual decisão depende de mais evidence?
20. O que mudaria com dez vezes mais volume?

---

## Modelo de resposta da banca

Use:

```text
Decisao:

Contexto:

Alternativas:

Evidencia:

Trade-off:

Limitacao:

Trigger de revisao:
```

Exemplo:

```text
Decisao:
Capacity e autoridade
da reserva de equipamento.

Contexto:
equipamentos exclusivos
nao podem ter dupla reserva.

Alternativas:
controle em Booking;
controle no banco compartilhado;
autoridade em Capacity.

Evidencia:
teste concorrente;
unique constraint;
load test;
conflict report.

Trade-off:
mais coordenacao
entre Booking e Capacity.

Limitacao:
timeout pode deixar
estado pendente.

Trigger:
mudanca de volume,
provider externo
ou novo modelo de equipamento.
```

---

## Correção comentada

A correção não fornece uma única arquitetura pronta.

Ela apresenta critérios.

### Solução forte

Uma solução forte tende a:

- separar Booking de Capacity;
- manter autoridade única de slot;
- usar consistência forte na reserva;
- usar eventos para efeitos derivados;
- encapsular legados;
- proteger tenant em todos os boundaries;
- definir idempotência;
- observar jornadas;
- usar rollout progressivo;
- provar rollback;
- registrar trade-offs.

### Solução aceitável

Um monólito modular pode ser aceitável se:

- boundaries internos forem explícitos;
- módulos não compartilharem entities;
- authority estiver definida;
- ArchUnit proteger dependências;
- deploy único atender ao risco;
- scaling e ownership forem compatíveis.

### Solução fraca

Uma solução é fraca quando:

- começa por frameworks;
- usa uma tabela central;
- todos os contexts escrevem tudo;
- eventos são DTOs genéricos;
- retry é indiscriminado;
- tenant é um campo opcional;
- SLOs não possuem operação;
- rollout ignora legados;
- rollback é apenas “voltar versão”;
- defesa depende de nomes de tecnologia.

---


## Sessão de avaliação guiada

Esta sessão simula a leitura de uma entrega real.

O objetivo é mostrar como um avaliador deve raciocinar sem reduzir a prova a preferências pessoais.

### Avaliar o framing

Pergunte:

- o problema foi descrito como dor de negócio?
- existe relação entre problema e objetivos?
- o escopo cabe em seis meses?
- os não objetivos protegem a entrega?
- os volumes influenciam decisões?
- as restrições aparecem no desenho?
- o sucesso é mensurável?

Um framing fraco costuma gerar componentes sem finalidade clara.

Um framing forte permite justificar cada decisão posterior.

### Avaliar boundaries

Não conte apenas quantos contexts foram criados.

Verifique:

- responsabilidade;
- linguagem;
- autoridade;
- frequência de mudança;
- owner;
- dependências;
- motivo do boundary;
- custo operacional.

Se `Booking` e `Capacity` estiverem separados, a entrega precisa explicar por que a reserva exige autoridade e isolamento.

Se estiverem juntos em um monólito modular, a entrega precisa explicar como módulos, schemas lógicos, ports e testes protegem as responsabilidades.

As duas respostas podem ser válidas.

### Avaliar dados

Escolha três produtos de dados:

```text
Booking;

Time Slot;

Equipment Reservation.
```

Para cada um, procure:

- autoridade;
- writers;
- consumers;
- classificação;
- consistência;
- freshness;
- retenção;
- repair;
- lineage.

Uma matriz que apenas lista tabelas não é suficiente.

A avaliação precisa entender quem toma a decisão final.

### Avaliar contratos

Escolha uma API crítica e um evento crítico.

API:

```text
POST /bookings.
```

Evento:

```text
BookingCreatedV1.
```

Verifique:

- owner;
- intenção;
- versão;
- autorização;
- idempotência;
- erros;
- schema;
- compatibilidade;
- SLO;
- consumers;
- depreciação.

Contrato sem lifecycle é apenas uma fotografia.

### Avaliar consistência

Peça que o candidato explique dois cenários:

```text
reserva concorrente;

cancelamento durante propagacao.
```

Na reserva concorrente, espere autoridade local, transação, constraint, conflito explícito e evidence.

No cancelamento, aceite eventual consistency se a UX, o estado autoritativo, os efeitos derivados e a recovery policy estiverem claros.

### Avaliar idempotência

Pergunte:

```text
o que acontece
se o cliente repetir
POST /bookings
depois de um timeout?
```

Resposta forte inclui:

- key;
- escopo;
- hash;
- resposta anterior;
- conflito de payload;
- TTL;
- audit;
- efeito único.

Depois pergunte sobre mensagens duplicadas.

A resposta deve mudar para Inbox, event ID, consumer scope e replay.

### Avaliar segurança

Não aceite apenas:

```text
usar OAuth.
```

Verifique:

- identidade humana;
- workload identity;
- source do tenant;
- autorização por recurso;
- purpose;
- minimização;
- proteção de arquivos;
- broker ACL;
- secrets;
- audit;
- testes negativos.

Pergunte:

```text
como impedir
que um atendente de uma marca
acesse reserva de outra?
```

A resposta precisa atravessar token, tenant context, query, cache, evento e observabilidade.

### Avaliar observabilidade

Escolha a jornada `Create Booking`.

Peça:

- trace;
- spans;
- correlation;
- outcome;
- SLI;
- SLO;
- alert;
- dashboard;
- runbook;
- release dimension.

Uma entrega que possui apenas logs não comprova observabilidade de jornada.

### Avaliar rollout

Pergunte:

```text
como migrar
sem desligar
os tres legados?
```

Resposta forte apresenta:

- adapter;
- source of truth temporário;
- shadow read;
- dual run;
- reconciliation;
- canary;
- stop conditions;
- rollback;
- cleanup;
- deprecation.

Dual write sem reconciliation é um finding.

### Avaliar trade-offs

A banca deve ouvir consequências.

Exemplo:

```text
mensageria reduz acoplamento temporal,
mas aumenta operacao,
debug,
ordering
e observabilidade.
```

Resposta que apresenta apenas benefícios demonstra baixa maturidade.

### Avaliar open questions

Perguntas abertas não significam reprovação automática.

Avalie se possuem:

- owner;
- prazo;
- impacto;
- fallback;
- isolamento;
- trigger;
- decisão necessária.

Exemplo aceitável:

```text
volume real de imagens
ainda nao foi medido.

owner:
Field Operations.

prazo:
antes do piloto.

fallback:
limite conservador
e armazenamento externo.
```


A banca também deve verificar consistência entre os próprios entregáveis. Um bom desenho não pode declarar autoridade em um documento, permitir outro writer no contrato e esconder a divergência no rollout. Sempre que duas fontes contarem histórias diferentes, registre um finding, identifique a autoridade correta e exija revalidação antes da aprovação.

### Emitir a decisão

Status possíveis:

```text
APPROVED;

APPROVED_WITH_CONDITIONS;

REWORK_REQUIRED;

INCONCLUSIVE.
```

A decisão deve citar:

- pontos fortes;
- blockers;
- conditions;
- risks accepted;
- evidence missing;
- próxima revisão.

Uma pontuação não substitui a decisão.

A rubrica ajuda a comparar qualidade.

A decisão informa se a solução pode avançar.


## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 667 e ponte para a aula 669 foram preservadas;
- caso novo foi criado;
- cenário de reservas diagnósticas foi definido;
- organização, problema, objetivo, restrições e volumes foram registrados;
- regras da prova foram definidas;
- timebox foi criado;
- Problem Statement foi criado;
- escopo e não objetivos foram definidos;
- atores foram mapeados;
- jornadas foram criadas;
- Capability Map foi criado;
- Domain Map foi criado;
- bounded contexts foram definidos;
- Context Map foi criado;
- Data Authority Matrix foi criada;
- writers duplicados foram proibidos;
- APIs foram modeladas;
- eventos foram modelados;
- Consistency Matrix foi criada;
- reserva concorrente foi tratada;
- Saga foi modelada;
- Outbox e Inbox foram definidos;
- PACELC foi aplicado;
- Security Architecture foi criada;
- autorização foi definida;
- dados sensíveis foram tratados;
- Observability Architecture foi criada;
- SLOs foram definidos;
- cardinalidade foi controlada;
- Deployment Model foi criado;
- Resilience Policy foi criada;
- rollout e migração foram definidos;
- stop conditions foram definidas;
- rollback foi detalhado;
- runbooks foram criados;
- ADRs foram criados;
- Risk Register foi criado;
- Traceability Map foi criado;
- Architecture Defense foi criada;
- contrato da prova foi criado;
- rubrica de 100 pontos foi criada;
- faixas de resultado foram definidas;
- falhas críticas foram definidas;
- evidence foi criada;
- validações obrigatórias foram criadas;
- perguntas da banca foram preparadas;
- modelo de resposta foi criado;
- correção comentada foi incluída;
- commit recomendado e diário de bordo estão presentes;
- checklist final de arquiteto Java não foi antecipado.

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
  labs/m19/aula-668-prova-pratica-arquitetura/diagnostic-booking-architecture-exam `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realPatient|realHealthData|privateEndpoint|productionTopology"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): realizar prova pratica de arquitetura"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou uma prova prática de arquitetura.

Você recebeu um domínio novo, com restrições, volumes, legados, dados sensíveis, multi-tenancy, integrações e pressão de prazo.

Você precisou produzir:

```text
Problem Statement;

Scope;

Actor Catalog;

Business Journeys;

Capability Map;

Domain Map;

Bounded Contexts;

Context Map;

Quality Attribute Scenarios;

C4;

Data Authority Matrix;

API Contracts;

Event Contracts;

Consistency Matrix;

Idempotency Strategy;

Security Architecture;

Observability Architecture;

Resilience Policy;

Deployment Model;

Rollout and Migration;

ADRs;

Risk Register;

Traceability Map;

Architecture Defense;

evidence e score.
```

A prova mostrou que arquitetura não é um exercício de listar tecnologias.

Ela exige decisões coerentes, limites claros, riscos explícitos, evidências, operação e capacidade de defesa.

A próxima aula será:

```text
669 - M19.59 - Checklist de arquiteto Java
```

Nela, você consolidará um checklist profissional para discovery, design, implementação, segurança, dados, operação, governança, comunicação, revisão e evolução.

Nenhum checklist profissional completo foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Entendi o cenário.
- [ ] Defini problema e escopo.
- [ ] Modelei jornadas.
- [ ] Criei capabilities.
- [ ] Defini boundaries.
- [ ] Defini autoridade de dados.
- [ ] Modelei APIs e eventos.
- [ ] Decidi consistência.
- [ ] Apliquei idempotência.
- [ ] Modelei segurança.
- [ ] Modelei observabilidade.
- [ ] Planejei rollout.
- [ ] Criei ADRs e riscos.
- [ ] Preparei defesa.
- [ ] Calculei score.

---

## Troubleshooting adicional

### A prova parece grande demais

Priorize problema, boundaries, authority, consistency, security e rollout.

### Estou escolhendo tecnologia cedo demais

Volte às capacidades e quality attributes.

### Tenho muitos contexts

Agrupe quando ownership, escala e lifecycle forem semelhantes.

### Tenho poucos contexts

Verifique se responsabilidades e linguagens diferentes foram misturadas.

### Não sei onde usar evento

Use para fatos derivados e desacoplamento. Não use como substituto automático de toda chamada.

### Não sei escolher consistência

Analise autoridade, dano de conflito, UX e recovery.

### Não consigo provar um claim

Marque como hipótese e defina evidence.

### O rollout não cabe em seis meses

Reduza escopo, escolha tenants piloto e preserve coexistência.

### A banca discorda da tecnologia

Defenda a decisão pelo contexto, não pelo nome da ferramenta.

### A solução recebeu menos de 70 pontos

Revise falhas críticas antes de melhorar detalhes.

### Quero criar o checklist profissional

Preserve essa consolidação para a aula 669.

---

## Perguntas de revisão

1. O que a prova prática avalia?
2. Por que o caso é diferente do projeto de OS?
3. Qual é o problema de negócio?
4. Quais são as restrições principais?
5. Por que não começar pela tecnologia?
6. O que deve existir no framing?
7. O que deve existir no Domain Map?
8. Quem deve ser autoridade de Time Slot?
9. Como impedir dupla reserva?
10. Onde usar consistência eventual?
11. Onde usar Outbox?
12. Onde usar Inbox?
13. Como aplicar PACELC?
14. Como proteger tenant?
15. Como proteger dados sensíveis?
16. O que observar nas jornadas?
17. Por que controlar cardinalidade?
18. Como coexistir com legados?
19. O que é stop condition?
20. O que prova rollback?
21. O que uma ADR precisa conter?
22. O que uma defesa precisa conter?
23. Quais falhas limitam a nota?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Raciocínio, coerência, trade-offs, evidence e defesa.
2. Para verificar transferência de conhecimento.
3. Fragmentação e inconsistência do agendamento.
4. Prazo, legados, dados sensíveis, volume e zero dupla reserva.
5. Porque tecnologia vem depois do problema.
6. Problema, objetivo, escopo, atores, jornadas e qualidade.
7. Subdomínios, linguagem, regras e ownership.
8. Capacity ou Availability, desde que seja única e defensável.
9. Transação local, constraint, lock ou mecanismo equivalente.
10. Propagação, projeções e notificações.
11. Onde estado e evento precisam ser atômicos.
12. Em consumers com efeitos deduplicáveis.
13. Analisando partition, consistency, availability e latency.
14. Contexto confiável, propagação, autorização e testes.
15. Minimização, classificação, acesso, retenção e audit.
16. Outcome, latency, failure, backlog e intervention.
17. Para evitar explosão de séries.
18. Adapter, coexistência, canary, dual run e cleanup.
19. Condição que interrompe avanço.
20. Rehearsal com dados e versão anterior.
21. Contexto, opções, decisão, consequência e trigger.
22. Decisão, contexto, alternativas, evidence e trade-off.
23. Cross-tenant, dupla reserva, authority duplicada e rollback ausente.
24. Checklist de arquiteto Java.
25. Checklist de arquiteto Java.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 668 - M19.58 - Prova pratica arquitetura

- Continuei após Revisão arquitetura parte 2.
- Realizei uma prova prática com um domínio novo.
- Modelei a plataforma Vida Diagnósticos.
- Registrei organização, problema, objetivo, restrições e volumes.
- Criei regras e timebox da prova.
- Criei Problem Statement.
- Defini escopo e não objetivos.
- Mapeei atores e jornadas.
- Criei Capability Map.
- Criei Domain Map.
- Defini bounded contexts.
- Criei Context Map.
- Criei Data Authority Matrix.
- Proibi writers duplicados.
- Modelei APIs.
- Modelei eventos.
- Criei Consistency Matrix.
- Tratei reserva concorrente.
- Modelei Saga.
- Defini Outbox e Inbox.
- Apliquei PACELC.
- Criei Security Architecture.
- Defini autorização.
- Tratei dados sensíveis.
- Criei Observability Architecture.
- Defini SLOs.
- Controlei cardinalidade.
- Criei Deployment Model.
- Criei Resilience Policy.
- Planejei coexistência com legados.
- Criei rollout, stop conditions e rollback.
- Criei runbooks.
- Criei ADRs.
- Criei Risk Register.
- Criei Traceability Map.
- Preparei Architecture Defense.
- Criei contrato da prova.
- Criei rubrica de 100 pontos.
- Defini faixas de resultado e falhas críticas.
- Criei evidence.
- Preparei perguntas da banca.
- Criei correção comentada.
- Não antecipei o checklist final.
- Próxima aula: Checklist de arquiteto Java.
```

---

## Referência técnica curta

- Architecture Exam.
- Problem Framing.
- Business Journey.
- Capability Map.
- Domain Map.
- Bounded Context.
- Data Authority.
- API Contract.
- Event Contract.
- Consistency Matrix.
- Saga.
- Outbox.
- Inbox.
- PACELC.
- Security Architecture.
- Observability Architecture.
- Rollout.
- Architecture Defense.
- Evaluation Rubric.

Regra final:

```text
A prova prática de arquitetura deve avaliar capacidade de transferir princípios para um domínio novo: o caso de reservas diagnósticas exige framing, escopo, atores, jornadas, capabilities, subdomínios, bounded contexts, context map, quality scenarios, C4, autoridade de dados, APIs, eventos, consistência, idempotência, segurança, observabilidade, resiliência, deploy, rollout, riscos, ADRs, rastreabilidade e defesa; a reserva de equipamento precisa de autoridade única e consistência forte local, projeções e notificações podem ser eventuais, Sagas precisam de state, deadline, compensation e recovery, Outbox e Inbox protegem publicação e deduplicação, PACELC explicita decisões sob partition e operação normal, tenant context atravessa API, cache, eventos, idempotência e queries, dados sensíveis são minimizados, classificados, protegidos e auditados, SLOs conectam journeys, alerts, dashboards e runbooks, e rollout convive com legados por adapters, shadow read, dual run, canary, reconciliation, stop conditions, rollback e cleanup; a rubrica mede framing, domínio, dados, contratos, distribuição, segurança, observabilidade, operação e defesa, falhas críticas limitam aprovação, e respostas da banca devem usar decisão, contexto, alternativas, evidence, trade-offs, limitações e triggers, enquanto o checklist profissional completo permanece reservado para a aula 669.
```
