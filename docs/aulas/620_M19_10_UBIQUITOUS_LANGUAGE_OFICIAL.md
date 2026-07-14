# 620 - M19.10 - Ubiquitous Language

## Apresentação da aula

Na aula 619, você aplicou DDD tático ao contexto de agendamento de serviços.

Você modelou:

```text
Entities;

Value Objects;

Aggregate Root;

invariantes;

Repository;

Factory;

Domain Service;

Specification;

Domain Events;

Application Services.
```

O modelo ganhou comportamento e proteção.

Você criou nomes como:

```text
ServiceAppointment;

AppointmentWindow;

RescheduleReason;

AppointmentConfirmed;

SchedulingEligibilityService.
```

Esses nomes parecem claros.

Mas existe uma pergunta importante:

```text
eles significam
a mesma coisa

para desenvolvedores,
especialistas,
produto,
operação,
suporte
e usuários?
```

Uma classe pode estar tecnicamente correta e ainda usar uma linguagem errada.

Exemplo:

```text
BookingEntity
```

pode parecer natural para a equipe técnica.

Porém, a operação talvez use:

```text
compromisso de atendimento.
```

O atendimento talvez use:

```text
agendamento.
```

O técnico de campo talvez use:

```text
atividade.
```

Se cada grupo usa uma palavra diferente para o mesmo conceito, surgem traduções informais.

Se a mesma palavra é usada para conceitos diferentes, surgem ambiguidades.

Exemplo:

```text
confirmação.
```

Ela pode representar:

- cliente aceitou a janela;
- técnico assumiu o serviço;
- sistema recebeu retorno;
- pagamento foi aprovado;
- execução foi concluída.

Quando essas diferenças não são explícitas, o código costuma acumular:

```text
status = 2;

confirmed = true;

technicalConfirmed = true;

customerConfirmed = true;

isDone = false;

completedAt = null.
```

A dificuldade não está apenas nos campos.

Ela está na ausência de uma linguagem comum.

Ubiquitous Language é a linguagem compartilhada, precisa e evolutiva usada para discutir e modelar o domínio.

Ela deve aparecer em:

- conversas;
- reuniões;
- exemplos;
- documentação;
- histórias;
- critérios de aceite;
- testes;
- nomes de classes;
- métodos;
- eventos;
- APIs;
- mensagens de erro;
- dashboards de negócio;
- decisões arquiteturais.

A pergunta central desta aula será:

```text
como construir
e manter

uma linguagem
que seja realmente usada

e não apenas
um glossário esquecido?
```

O laboratório continuará no domínio de agendamento de serviços.

O diretório será:

```text
labs/m19/aula-620-ubiquitous-language/service-scheduling-language
```

Você irá criar um sistema de governança leve para a linguagem do:

```text
Service Scheduling Context.
```

O trabalho incluirá:

- inventário de termos;
- definições;
- exemplos;
- contraexemplos;
- sinônimos permitidos e proibidos;
- termos ambíguos;
- termos aposentados;
- linguagem por cenário;
- revisão de código;
- revisão de APIs;
- revisão de eventos;
- revisão de testes;
- revisão de mensagens de erro;
- rastreabilidade;
- decision log;
- processo de mudança;
- testes automatizados;
- reports;
- gate de linguagem.

Você irá revisar o modelo da aula 619.

Exemplo:

```text
ServiceAppointment
```

pode ser validado como:

```text
compromisso de atendimento.
```

Ou a equipe pode concluir que:

```text
Appointment
```

é suficiente dentro do contexto.

O importante não é escolher o termo mais sofisticado.

O importante é escolher o termo que:

- represente o conceito;
- seja compreendido;
- seja distinguível;
- seja usado;
- seja validado;
- possa evoluir.

A próxima aula oficial será:

```text
621 - M19.11 - Bounded Context
```

Nela, você irá aprofundar como uma linguagem e um modelo possuem validade dentro de uma fronteira explícita.

Por isso, esta aula não irá criar o laboratório completo de Bounded Context.

Também não irá aprofundar o Context Map da aula 622.

Nesta aula, haverá apenas uma regra de escopo:

```text
a linguagem estudada
vale para o
Service Scheduling Context.
```

Não serão criados:

- novos bounded contexts completos;
- novo context map;
- relações upstream/downstream detalhadas;
- ACL completa;
- published language intercontextual completa;
- extração de microservices;
- nova estratégia de subdomínios.

A regra central será:

```text
uma linguagem ubíqua
só existe

quando é usada,
questionada,
testada
e atualizada

em todos os lugares
onde o domínio
é representado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
618:
DDD estrategico.

619:
DDD tatico.

620:
Ubiquitous Language.

621:
Bounded Context.

622:
Context Map.
```

A progressão é:

```text
definir estratégia;

modelar comportamento;

alinhar linguagem;

aprofundar fronteira;

aprofundar relações.
```

Nesta aula:

```text
glossário vivo:
sim.

definições:
sim.

exemplos:
sim.

contraexemplos:
sim.

sinônimos:
sim.

ambiguidades:
sim.

termos aposentados:
sim.

linguagem no código:
sim.

linguagem em API:
sim.

linguagem em eventos:
sim.

linguagem em testes:
sim.

governança:
sim.

Bounded Context dedicado:
não.

Context Map dedicado:
não.

nova modelagem tática:
não.
```

O modelo tático da aula 619 será usado como fonte de exemplos.

A aula não irá reescrever o aggregate inteiro.

Ela irá revisar nomes, significados e alinhamento.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-620-ubiquitous-language/service-scheduling-language
├── README.md
├── language
│   ├── ubiquitous-language-charter.md
│   ├── glossary.md
│   ├── terminology-matrix.md
│   ├── synonym-policy.md
│   ├── ambiguity-register.md
│   ├── retired-terms.md
│   ├── language-change-log.md
│   ├── example-catalog.md
│   ├── counterexample-catalog.md
│   ├── conversation-prompts.md
│   ├── review-workshop-script.md
│   └── open-language-questions.md
├── alignment
│   ├── code-language-inventory.md
│   ├── API-language-inventory.md
│   ├── event-language-inventory.md
│   ├── test-language-inventory.md
│   ├── error-message-inventory.md
│   ├── documentation-language-inventory.md
│   ├── language-traceability-matrix.md
│   └── migration-plan.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/serviceschedulinglanguage
│   │           ├── Appointment.java
│   │           ├── AppointmentWindow.java
│   │           ├── AppointmentStatus.java
│   │           ├── RescheduleReason.java
│   │           ├── AppointmentConfirmed.java
│   │           ├── AppointmentRescheduled.java
│   │           ├── ScheduleAppointment.java
│   │           └── ConfirmAppointment.java
│   └── test
│       └── java
│           └── br/com/formacao/serviceschedulinglanguage
│               ├── UbiquitousLanguageTest.java
│               ├── ForbiddenTerminologyTest.java
│               ├── EventNamingTest.java
│               ├── ScenarioVocabularyTest.java
│               └── PublicContractLanguageTest.java
├── contracts
│   ├── ubiquitous-language-contract.yaml
│   ├── term-definition-policy.yaml
│   ├── synonym-policy.yaml
│   ├── ambiguity-policy.yaml
│   ├── retired-term-policy.yaml
│   ├── code-language-policy.yaml
│   ├── API-language-policy.yaml
│   ├── event-language-policy.yaml
│   ├── test-language-policy.yaml
│   ├── change-governance-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── reports
│   ├── glossary-review-report.yaml
│   ├── code-language-report.yaml
│   ├── API-language-report.yaml
│   ├── event-language-report.yaml
│   ├── test-language-report.yaml
│   ├── ambiguity-report.yaml
│   ├── retired-term-report.yaml
│   └── ubiquitous-language-gate-report.yaml
└── pom.xml
```

Scripts:

```text
scripts/m19/service-scheduling-language
├── validate-ubiquitous-language-contract.ps1
├── validate-glossary.ps1
├── validate-synonyms.ps1
├── validate-ambiguities.ps1
├── validate-retired-terms.ps1
├── validate-code-language.ps1
├── validate-API-language.ps1
├── validate-event-language.ps1
├── validate-test-language.ps1
├── run-language-consistency-tests.ps1
├── collect-ubiquitous-language-evidence.ps1
└── verify-ubiquitous-language-gate.ps1
```

Ao final, você terá um processo prático para manter linguagem, documentação, testes e código coerentes.

---

## Conceito essencial

### Ubiquitous Language

Linguagem compartilhada e usada continuamente por especialistas e equipe técnica dentro de um domínio ou contexto.

---

### Termo do domínio

Palavra ou expressão com significado específico no modelo.

---

### Definição operacional

Definição que permite reconhecer o conceito em situações concretas.

---

### Sinônimo permitido

Variação de linguagem aceita sem perda de significado em um canal específico.

---

### Sinônimo proibido

Termo que cria ambiguidade, mistura conceitos ou substitui a linguagem aprovada.

---

### Homônimo

Mesma palavra usada para conceitos diferentes.

---

### Ambiguidade

Situação em que um termo, regra ou frase admite múltiplas interpretações.

---

### Termo aposentado

Termo removido da linguagem oficial, mas ainda encontrado em sistemas ou documentos antigos.

---

### Language drift

Desvio gradual entre a linguagem do negócio e a linguagem implementada.

---

### Language review

Revisão estruturada de termos, exemplos e representações.

---

### Language migration

Mudança controlada de nomes e contratos para refletir a linguagem aprovada.

---

### Traceability

Ligação entre termo, regra, cenário, código, teste, API e evento.

---

### Contextual meaning

Significado válido dentro de uma fronteira específica.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-620-ubiquitous-language/service-scheduling-language

Set-Location `
  labs/m19/aula-620-ubiquitous-language/service-scheduling-language
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/ubiquitous-language-contract.yaml
```

Conteúdo:

```yaml
ubiquitousLanguage:
  context:
    Service-Scheduling

  required:
    - language-charter
    - glossary
    - operational-definitions
    - examples
    - counterexamples
    - synonym-rules
    - ambiguity-register
    - retired-terms
    - code-alignment
    - API-alignment
    - event-alignment
    - test-alignment
    - change-process
    - traceability

  forbidden:
    - undefined-public-term
    - silent-synonym
    - unresolved-ambiguity-in-code
    - technical-name-replacing-domain-name
    - retired-term-in-new-contract

  nextLesson:
    code:
      M19.11
```

---

### 3. Criar charter da linguagem

Arquivo:

```text
language/ubiquitous-language-charter.md
```

Conteúdo:

```markdown
# Ubiquitous Language Charter

## Contexto

Service Scheduling.

## Objetivo

Manter uma linguagem coerente
para assumir,
confirmar,
reagendar
e cancelar compromissos de atendimento.

## Participantes

- especialistas de agendamento;
- produto;
- desenvolvimento;
- QA;
- operação;
- suporte.

## Canais cobertos

- conversas;
- documentação;
- histórias;
- testes;
- código;
- APIs;
- eventos;
- mensagens de erro.

## Regra

Termos públicos precisam estar
definidos,
exemplificados
e revisados.
```

---

### 4. Criar policy de definição

Arquivo:

```text
contracts/term-definition-policy.yaml
```

Conteúdo:

```yaml
term:
  requires:
    - canonical-name
    - definition
    - scope
    - example
    - counterexample
    - status
    - owner

  definition:
    mustBeOperational:
      true

  circularDefinition:
    forbidden

  implementationDetailAsDefinition:
    forbidden
```

---

### 5. Criar glossário vivo

Arquivo:

```text
language/glossary.md
```

Modelo:

```markdown
## Appointment

Nome em português:
Agendamento.

Definição:
Compromisso de atendimento criado
para uma solicitação elegível
em uma janela escolhida.

Escopo:
Service Scheduling.

Não significa:
- opção de janela;
- execução em campo;
- reserva de capacidade isolada.

Exemplo:
Atendimento marcado para terça,
das 09:00 às 12:00.

Contraexemplo:
Uma janela disponível ainda não escolhida.

Status:
Aprovado.

Owner:
Scheduling Product.
```

---

### 6. Definir `Appointment Window`

```markdown
## Appointment Window

Nome em português:
Janela de atendimento.

Definição:
Intervalo de tempo usado
para representar o compromisso esperado.

Não significa:
Capacidade disponível ainda não ofertada.

Exemplo:
14:00–18:00 em 20/07/2026.

Contraexemplo:
Turno genérico sem data.
```

Essa distinção evita confundir:

```text
janela oferecida;
janela reservada;
janela do compromisso.
```

---

### 7. Definir `Confirmation`

```markdown
## Appointment Confirmation

Nome em português:
Confirmação do agendamento.

Definição:
Aceite explícito do compromisso
pelo participante definido na regra.

Não significa:
- execução concluída;
- técnico designado;
- pagamento aprovado;
- mensagem entregue.
```

A definição precisa indicar quem confirma.

Se isso ainda estiver em aberto, o termo não está aprovado.

---

### 8. Criar matriz terminológica

Arquivo:

```text
language/terminology-matrix.md
```

Colunas:

```text
Termo canônico;

Tradução;

Definição curta;

Contexto;

Código;

API;

Evento;

Teste;

Sinônimos permitidos;

Sinônimos proibidos;

Status;

Owner.
```

Exemplo:

```text
Appointment
| Agendamento
| Compromisso assumido
| Service Scheduling
| Appointment
| appointment
| AppointmentScheduled
| shouldScheduleAppointment
| compromisso
| booking, ticket
| approved
| Scheduling Product
```

---

### 9. Criar policy de sinônimos

Arquivo:

```text
contracts/synonym-policy.yaml
```

Conteúdo:

```yaml
synonym:
  canonicalTerm:
    required

  allowed:
    mustPreserveMeaning:
      true

  forbidden:
    reasons:
      - ambiguity
      - external-model-leak
      - technical-jargon
      - retired-language

  publicContract:
    canonicalTermOnly:
      required

  conversation:
    variation:
      allowedWithClarification:
        true
```

---

### 10. Avaliar `Appointment` versus `Booking`

Possível decisão:

```text
Appointment:
termo canônico.

Booking:
proibido no código e na API.

Compromisso:
sinônimo explicativo em documentação.

Agendamento:
termo canônico em português.
```

O objetivo não é eliminar linguagem natural.

É impedir que dois nomes produzam dois modelos.

---

### 11. Criar arquivo de sinônimos

Arquivo:

```text
language/synonym-policy.md
```

Exemplo:

```markdown
## Appointment

Canônico:
Appointment / Agendamento.

Permitido em explicação:
Compromisso de atendimento.

Proibido:
Booking;
Schedule Record;
Ticket;
Visit Slot.

Motivo:
Os termos misturam
opção,
registro técnico
e execução.
```

---

### 12. Identificar homônimos

Termo:

```text
status.
```

É genérico demais.

Prefira:

```text
AppointmentStatus.
```

Termo:

```text
window.
```

Pode significar:

- janela de capacidade;
- janela ofertada;
- janela do compromisso;
- janela de execução.

Dentro do contexto, use:

```text
AppointmentWindow.
```

---

### 13. Criar ambiguity register

Arquivo:

```text
language/ambiguity-register.md
```

Modelo:

```markdown
## LANG-AMB-001 — Confirmation

Interpretação A:
Cliente aceitou o agendamento.

Interpretação B:
Operação confirmou capacidade.

Impacto:
Status e eventos podem divergir.

Decisão necessária:
Definir actor da confirmação.

Owner:
Scheduling Product.

Estado:
Aberta.

Código bloqueado:
AppointmentConfirmed.
```

---

### 14. Criar ambiguity policy

Arquivo:

```text
contracts/ambiguity-policy.yaml
```

Conteúdo:

```yaml
ambiguity:
  requires:
    - term
    - interpretations
    - impact
    - owner
    - status

  unresolved:
    publicContract:
      forbidden

    codeImplementation:
      forbiddenWhenCritical:
        true

  temporaryDecision:
    mustBeExplicit:
      true

  resolution:
    updatesAllRepresentations:
      required
```

---

### 15. Criar termos aposentados

Arquivo:

```text
language/retired-terms.md
```

Modelo:

```markdown
## BookingRecord

Substituído por:
Appointment.

Motivo:
Termo técnico sem correspondência
na linguagem do domínio.

Encontrado em:
- classe legada;
- tabela;
- endpoint antigo.

Permitido:
Somente em adapter de legado.

Prazo de remoção:
Definido no migration plan.
```

---

### 16. Criar retired-term policy

Arquivo:

```text
contracts/retired-term-policy.yaml
```

Conteúdo:

```yaml
retiredTerm:
  requires:
    - replacement
    - reason
    - legacy-locations
    - migration-owner
    - removal-plan

  newCode:
    forbidden

  newPublicContract:
    forbidden

  legacyAdapter:
    allowedWithTranslation:
      true
```

---

### 17. Criar catálogo de exemplos

Arquivo:

```text
language/example-catalog.md
```

Exemplo:

```markdown
## LANG-EX-001 — Appointment

Dado:
Solicitação elegível.

E:
Janela escolhida.

Quando:
O compromisso é assumido.

Então:
Existe um Appointment
com status SCHEDULED.

Não significa:
Capacidade genérica disponível.
```

---

### 18. Criar contraexemplos

Arquivo:

```text
language/counterexample-catalog.md
```

Exemplo:

```markdown
## LANG-CEX-001 — Não é Appointment

Dado:
O sistema de capacidade retornou
três horários possíveis.

Então:
Ainda não existe Appointment.

Motivo:
Nenhum compromisso foi assumido.
```

Contraexemplos tornam a definição operacional.

---

### 19. Criar prompts de conversa

Arquivo:

```text
language/conversation-prompts.md
```

Perguntas:

```text
quando você diz "confirmado",
quem confirmou?

quando você diz "janela",
ela é opção ou compromisso?

quando você diz "cancelado",
o que foi cancelado?

quando você diz "execução",
isso pertence ao agendamento?

qual termo aparece
nos relatórios operacionais?

qual termo o usuário reconhece?

qual termo deve aparecer
no evento?
```

---

### 20. Criar roteiro de workshop

Arquivo:

```text
language/review-workshop-script.md
```

Roteiro de 60 minutos:

```text
10 min:
revisar cenário.

10 min:
marcar termos.

10 min:
definir e exemplificar.

10 min:
buscar contraexemplos.

10 min:
revisar código e contratos.

10 min:
decidir mudanças e owners.
```

O workshop deve produzir decisões.

Não apenas discussão.

---

### 21. Inventariar linguagem no código

Arquivo:

```text
alignment/code-language-inventory.md
```

Procure:

- classes;
- records;
- enums;
- métodos;
- parâmetros;
- exceptions;
- packages;
- comentários;
- variáveis públicas.

Exemplo:

```text
ServiceAppointment:
avaliar se redundante dentro do contexto.

AppointmentStatus:
aprovado.

updateStatus:
proibido.

confirm:
aprovado.

changeDate:
substituir por reschedule.

BookingRepository:
aposentar.
```

---

### 22. Criar code-language policy

Arquivo:

```text
contracts/code-language-policy.yaml
```

Conteúdo:

```yaml
codeLanguage:
  publicType:
    canonicalTerm:
      required

  method:
    domainVerb:
      required

  genericMutation:
    forbidden:
      - updateStatus
      - setState
      - changeData
      - process

  technicalSuffix:
    review:
      - Entity
      - DTO
      - Record
      - Manager
      - Helper

  legacyTerm:
    allowedOnlyInAdapter:
      true
```

---

### 23. Revisar nomes de métodos

Prefira:

```java
appointment.confirm(occurredAt);

appointment.reschedule(
        newWindow,
        reason,
        occurredAt);

appointment.cancel(
        reason,
        occurredAt);
```

Evite:

```java
appointment.updateStatus(2);

appointment.changeData(request);

appointment.processAction("R");
```

Os métodos devem contar a história do domínio.

---

### 24. Revisar sufixos técnicos

`Entity`, `DTO`, `Record` e `Model` podem ser necessários em adapters.

No domínio, podem indicar linguagem técnica vazando.

Exemplo:

```text
AppointmentEntity
```

pode ser:

- Entity do domínio;
- entidade JPA;
- record de banco;
- DTO.

Prefira distinguir:

```text
Appointment:
domínio.

AppointmentJpaEntity:
persistência.

AppointmentResponse:
API.
```

O domínio mantém o termo puro.

---

### 25. Inventariar linguagem na API

Arquivo:

```text
alignment/API-language-inventory.md
```

Revise:

- paths;
- request fields;
- response fields;
- error codes;
- operation names;
- enum values;
- documentação.

Exemplo:

```text
POST /appointments:
aprovado.

POST /bookings:
aposentar.

POST /appointments/{id}/confirmation:
avaliar.

POST /appointments/{id}/confirm:
alinhado ao verbo.

status = DONE:
proibido.

status = CONFIRMED:
aprovado dentro do contexto.
```

---

### 26. Criar API-language policy

Arquivo:

```text
contracts/API-language-policy.yaml
```

Conteúdo:

```yaml
API:
  publicPath:
    canonicalTerm:
      required

  field:
    glossaryDefined:
      required

  enumValue:
    domainMeaning:
      required

  errorCode:
    stableDomainMeaning:
      required

  databaseName:
    publicExposure:
      forbidden

  retiredTerm:
    newVersion:
      forbidden
```

---

### 27. Planejar compatibilidade

Renomear uma classe interna é simples.

Renomear um endpoint público pode exigir:

- nova versão;
- alias temporário;
- deprecation;
- migration guide;
- métricas de uso;
- prazo;
- comunicação.

A linguagem deve melhorar sem quebrar consumidores silenciosamente.

---

### 28. Inventariar eventos

Arquivo:

```text
alignment/event-language-inventory.md
```

Revise:

```text
AppointmentScheduled;

AppointmentConfirmed;

AppointmentRescheduled;

AppointmentCancelled.
```

Perguntas:

- o evento representa fato?
- está no passado?
- o termo está no glossário?
- actor e significado estão claros?
- payload usa nomes canônicos?
- existe evento técnico disfarçado?

Evite:

```text
AppointmentUpdated;

AppointmentProcessed;

DataChanged;

StatusChanged.
```

Esses nomes escondem o significado.

---

### 29. Criar event-language policy

Arquivo:

```text
contracts/event-language-policy.yaml
```

Conteúdo:

```yaml
eventLanguage:
  name:
    pastTenseFact:
      required

  term:
    glossaryDefined:
      required

  genericEvent:
    forbidden:
      - Updated
      - Processed
      - Changed
      - Handled

  payload:
    canonicalFields:
      required

  externalPublishedEvent:
    compatibility:
      required
```

---

### 30. Inventariar testes

Arquivo:

```text
alignment/test-language-inventory.md
```

Exemplo bom:

```java
shouldRejectConfirmationOfCancelledAppointment()
```

Exemplo ruim:

```java
testStatusError()
```

O teste deve expressar:

- contexto;
- ação;
- regra;
- resultado.

---

### 31. Criar test-language policy

Arquivo:

```text
contracts/test-language-policy.yaml
```

Conteúdo:

```yaml
testLanguage:
  name:
    describesDomainBehavior:
      required

  fixture:
    canonicalTerms:
      required

  genericTestName:
    forbidden:
      - testOne
      - testStatus
      - shouldWork
      - successCase

  scenario:
    alignedWithGlossary:
      required
```

---

### 32. Inventariar mensagens de erro

Arquivo:

```text
alignment/error-message-inventory.md
```

Exemplo:

```text
"Only scheduled appointments can be confirmed."
```

Pergunte:

- `scheduled` está definido?
- `confirmed` está definido?
- mensagem é pública?
- deve conter código estável?
- revela detalhe interno?

Mensagem pública sugerida:

```text
APPOINTMENT_CANNOT_BE_CONFIRMED
```

Mensagem humana:

```text
O agendamento não pode ser confirmado
no estado atual.
```

---

### 33. Revisar documentação

Arquivo:

```text
alignment/documentation-language-inventory.md
```

Procure:

- termos antigos;
- traduções inconsistentes;
- nomes técnicos;
- status genéricos;
- diagramas desatualizados;
- exemplos incompatíveis;
- decisões não refletidas.

---

### 34. Criar matriz de rastreabilidade

Arquivo:

```text
alignment/language-traceability-matrix.md
```

Colunas:

```text
Termo;

Definição;

Regra;

Exemplo;

Código;

Método;

API;

Evento;

Teste;

Mensagem;

Status;

Owner.
```

Exemplo:

```text
Appointment
| compromisso assumido
| REG-001
| LANG-EX-001
| Appointment
| schedule
| /appointments
| AppointmentScheduled
| shouldScheduleAppointment
| APPOINTMENT_SCHEDULED
| approved
| Scheduling Product
```

---

### 35. Criar plano de migração

Arquivo:

```text
alignment/migration-plan.md
```

Fases:

```text
1. aprovar termo;

2. mapear ocorrências;

3. classificar contratos internos
e externos;

4. renomear internals;

5. criar compatibilidade pública;

6. atualizar testes;

7. atualizar documentação;

8. medir uso legado;

9. remover termo aposentado.
```

---

### 36. Criar change-governance policy

Arquivo:

```text
contracts/change-governance-policy.yaml
```

Conteúdo:

```yaml
languageChange:
  requires:
    - proposal
    - reason
    - affected-representations
    - owner
    - compatibility-analysis
    - decision
    - migration-plan

  update:
    atomicAcrossRepository:
      preferred

  publicContract:
    compatibilityReview:
      required

  glossaryOnlyChange:
    insufficientWhenCodeAffected:
      true
```

---

### 37. Criar language change log

Arquivo:

```text
language/language-change-log.md
```

Exemplo:

```markdown
## LANG-DEC-004

Data:
2026-07-14.

Mudança:
Booking -> Appointment.

Motivo:
Booking não é usado pelos especialistas
e mistura opção com compromisso.

Impacto:
- classe;
- repository;
- endpoint legado;
- testes;
- documentação.

Compatibilidade:
Alias no endpoint por uma versão.

Owner:
Scheduling Product.

Status:
Aprovada.
```

---

### 38. Criar perguntas abertas

Arquivo:

```text
language/open-language-questions.md
```

Exemplos:

- quem confirma o agendamento?
- `scheduled` significa criado ou comprometido?
- reagendamento cria novo compromisso?
- cancelamento do appointment cancela a solicitação?
- `service area` e `coverage area` são iguais?
- qual termo o usuário final vê?
- qual termo deve aparecer no evento público?

Perguntas abertas devem ter owner.

---

### 39. Criar esqueleto alinhado

```java
public final class Appointment {

    private final AppointmentId id;
    private AppointmentWindow window;
    private AppointmentStatus status;

    public void confirm(
            Instant occurredAt) {

        requireScheduled();

        status =
                AppointmentStatus.CONFIRMED;

        record(
                new AppointmentConfirmed(
                        id,
                        occurredAt));
    }
}
```

O nome reduz redundância dentro do contexto.

A decisão precisa estar no change log.

---

### 40. Criar command alinhado

```java
public record ScheduleAppointment(
        UUID serviceRequestId,
        Instant startsAt,
        Instant endsAt,
        String serviceAreaCode) {
}
```

O verbo representa a intenção.

Evite:

```text
CreateScheduleRecordRequest.
```

---

### 41. Criar teste de linguagem

```java
@Test
void publicDomainTypesMustUseApprovedTerms() {

    Set<String> approved =
            Set.of(
                    "Appointment",
                    "AppointmentWindow",
                    "RescheduleReason");

    assertTrue(
            approved.contains(
                    Appointment.class.getSimpleName()));
}
```

Esse teste é ilustrativo.

Em projeto real, prefira regras baseadas em packages, annotations próprias ou arquivos de contrato.

---

### 42. Criar teste de termos proibidos

```java
@Test
void sourceMustNotUseRetiredBookingTerm() {

    List<Path> violations =
            SourceLanguageScanner.find(
                    Path.of("src/main/java"),
                    Set.of(
                            "Booking",
                            "BookingRecord",
                            "ScheduleEntity"));

    assertTrue(
            violations.isEmpty(),
            () ->
                    "Retired terms found: "
                            + violations);
}
```

Exclua adapters legados permitidos.

---

### 43. Criar teste de eventos

```java
@Test
void domainEventsMustUsePastTenseNames() {

    assertAll(
            () ->
                    assertEquals(
                            "AppointmentConfirmed",
                            AppointmentConfirmed.class
                                    .getSimpleName()),
            () ->
                    assertEquals(
                            "AppointmentRescheduled",
                            AppointmentRescheduled.class
                                    .getSimpleName()));
}
```

Não tente inferir gramática completa por automação.

Use regras simples e revisão humana.

---

### 44. Criar cenário vocabular

```java
@Test
void reschedulingMustPreserveApprovedVocabulary() {

    Appointment appointment =
            SchedulingFixtures.confirmedAppointment();

    appointment.reschedule(
            SchedulingFixtures.newWindow(),
            new RescheduleReason(
                    "Customer unavailable"),
            TestTimes.rescheduling());

    assertEquals(
            AppointmentStatus.SCHEDULED,
            appointment.status());
}
```

Teste, método e tipos usam a mesma linguagem.

---

### 45. Criar public contract test

Valide:

- path;
- fields;
- enums;
- error codes;
- deprecations;
- aliases.

O teste pode ler OpenAPI ou contrato YAML.

Nesta aula, use contrato sintético.

---

### 46. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  termWithoutDefinition:
    action:
      FAIL

  publicTermWithoutOwner:
    action:
      FAIL

  synonymWithoutDecision:
    result:
      ambiguity

  retiredTermInNewCode:
    action:
      FAIL

  eventWithoutGlossaryTerm:
    action:
      FAIL

  testUsingGenericVocabulary:
    result:
      review-required

  glossaryCodeDrift:
    action:
      FAIL
```

---

### 47. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  unresolvedCriticalAmbiguity:
    action:
      BLOCK_PUBLIC_CONTRACT

  retiredTermInPublicAPI:
    action:
      FAIL

  externalModelTermInDomain:
    action:
      FAIL

  genericDomainEvent:
    action:
      FAIL

  BoundedContextDeepDive:
    deferredToLesson621

  ContextMapDeepDive:
    deferredToLesson622
```

---

### 48. Validar glossário

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-glossary.ps1
```

Confirme:

- termo canônico;
- definição;
- escopo;
- exemplo;
- contraexemplo;
- status;
- owner;
- ausência de definição circular.

---

### 49. Validar sinônimos

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-synonyms.ps1
```

Procure:

- sinônimo sem termo canônico;
- termo proibido em contrato público;
- alias não documentado;
- linguagem técnica substituindo linguagem do domínio.

---

### 50. Validar ambiguidades

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-ambiguities.ps1
```

Confirme:

- interpretações;
- impacto;
- owner;
- estado;
- bloqueio de contrato quando crítico.

---

### 51. Validar termos aposentados

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-retired-terms.ps1
```

Procure termos em:

- código novo;
- API nova;
- eventos;
- testes;
- documentação;
- mensagens.

Adapters legados precisam de exceção explícita.

---

### 52. Validar código

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-code-language.ps1
```

Procure:

- classes genéricas;
- métodos genéricos;
- status numérico;
- sufixos técnicos desnecessários;
- termos não definidos;
- verbos sem significado.

---

### 53. Validar API

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-API-language.ps1
```

Confirme:

- paths;
- campos;
- enums;
- error codes;
- deprecation;
- compatibilidade.

---

### 54. Validar eventos

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-event-language.ps1
```

Procure:

- evento genérico;
- nome no presente;
- termo ausente no glossário;
- payload técnico;
- campo aposentado.

---

### 55. Validar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-language\validate-test-language.ps1
```

Confirme:

- nomes de cenários;
- fixtures;
- termos;
- regras;
- ausência de `testOne`, `shouldWork` e `testStatus`.

---

### 56. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-language\run-language-consistency-tests.ps1
```

Ou:

```powershell
mvn test
```

A automação ajuda a detectar drift.

Ela não substitui revisão com especialistas.

---

### 57. Criar reports

Exemplo:

```yaml
glossaryReview:
  approvedTerms:
    18

  openTerms:
    3

  criticalAmbiguities:
    0

  retiredTermViolations:
    0

  missingOwners:
    0

  result:
    PASS_WITH_OPEN_QUESTIONS
```

---

### 58. Criar gate

O gate valida:

```text
charter;

glossário;

definições;

exemplos;

contraexemplos;

sinônimos;

ambiguidades;

termos aposentados;

código;

API;

eventos;

testes;

mensagens;

documentação;

mudanças;

rastreabilidade;

evidence.
```

Status:

```text
PASS;

PASS_WITH_OPEN_QUESTIONS;

FAIL_GLOSSARY;

FAIL_DEFINITION;

FAIL_SYNONYM;

FAIL_AMBIGUITY;

FAIL_RETIRED_TERM;

FAIL_CODE_LANGUAGE;

FAIL_API_LANGUAGE;

FAIL_EVENT_LANGUAGE;

FAIL_TEST_LANGUAGE;

FAIL_TRACEABILITY;

INCONCLUSIVE.
```

---

### 59. Coletar evidence

Arquivo:

```text
contracts/ubiquitous-language-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- approved term count;
- open term count;
- ambiguity count;
- critical ambiguity count;
- retired term count;
- retired term violation count;
- code language status;
- API language status;
- event language status;
- test language status;
- documentation status;
- traceability status;
- migration status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- nomes reais;
- contratos corporativos reais;
- conteúdo completo de Bounded Context;
- context map detalhado;
- informações operacionais sensíveis.

---

### 60. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-language\validate-ubiquitous-language-contract.ps1

.\scripts\m19\service-scheduling-language\validate-glossary.ps1

.\scripts\m19\service-scheduling-language\validate-synonyms.ps1

.\scripts\m19\service-scheduling-language\validate-ambiguities.ps1

.\scripts\m19\service-scheduling-language\validate-retired-terms.ps1

.\scripts\m19\service-scheduling-language\validate-code-language.ps1

.\scripts\m19\service-scheduling-language\validate-API-language.ps1

.\scripts\m19\service-scheduling-language\validate-event-language.ps1

.\scripts\m19\service-scheduling-language\validate-test-language.ps1

.\scripts\m19\service-scheduling-language\run-language-consistency-tests.ps1

.\scripts\m19\service-scheduling-language\collect-ubiquitous-language-evidence.ps1

.\scripts\m19\service-scheduling-language\verify-ubiquitous-language-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 61. Encerrar o laboratório

Confirme:

- charter criado;
- glossário revisado;
- termos com owner;
- definições operacionais;
- exemplos e contraexemplos;
- sinônimos decididos;
- ambiguidades críticas resolvidas ou bloqueadas;
- termos aposentados mapeados;
- código alinhado;
- API alinhada;
- eventos alinhados;
- testes alinhados;
- migration plan criado;
- nenhuma nova fronteira completa;
- nenhum Context Map dedicado;
- reports sanitizados.

---

## Entendendo o que foi feito

### O glossário ganhou vida

Definições passaram a se conectar ao código e aos cenários.

### Os termos ganharam owner

Mudanças deixaram de ser decisões anônimas.

### Os sinônimos ganharam regras

Variações deixaram de criar modelos paralelos.

### As ambiguidades ganharam bloqueio

Contratos deixaram de publicar significados indefinidos.

### Os termos aposentados ganharam migração

Código legado deixou de determinar a linguagem futura.

### O código ganhou vocabulário

Classes e métodos passaram a expressar ações do domínio.

### A API ganhou coerência

Paths, campos e enums passaram a refletir termos aprovados.

### Os eventos ganharam significado

Fatos deixaram de usar nomes genéricos.

### Os testes ganharam narrativa

Nomes passaram a explicar regras.

### A linguagem ganhou processo

Mudanças passaram a possuir proposta, impacto e compatibilidade.

---

## Erros comuns importantes

### Criar glossário e não usar

A linguagem continua fragmentada.

### Definir termos por tabelas

A implementação passa a definir o domínio.

### Proibir toda variação natural

A linguagem vira burocrática.

### Aceitar todo sinônimo

Modelos paralelos aparecem.

### Resolver ambiguidade no código

A equipe técnica toma decisão de negócio sozinha.

### Renomear API sem compatibilidade

Consumidores são quebrados.

### Usar evento genérico

O fato do domínio desaparece.

### Manter termos aposentados em código novo

O legado continua crescendo.

### Automatizar gramática completa

Testes frágeis substituem revisão humana.

### Antecipar Bounded Context e Context Map

A aula perde o foco na linguagem.

---

## Comandos úteis

### Validar glossário

```powershell
.\scripts\m19\service-scheduling-language\validate-glossary.ps1
```

### Validar termos aposentados

```powershell
.\scripts\m19\service-scheduling-language\validate-retired-terms.ps1
```

### Validar código e API

```powershell
.\scripts\m19\service-scheduling-language\validate-code-language.ps1

.\scripts\m19\service-scheduling-language\validate-API-language.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-language\run-language-consistency-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-language\verify-ubiquitous-language-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Charter

Defina contexto, participantes e canais.

### Parte 2 — Glossário

Crie definições operacionais.

### Parte 3 — Exemplos

Adicione exemplos e contraexemplos.

### Parte 4 — Sinônimos

Escolha termos canônicos.

### Parte 5 — Ambiguidades

Registre interpretações e owners.

### Parte 6 — Termos aposentados

Crie substituição e migração.

### Parte 7 — Código

Revise classes e métodos.

### Parte 8 — Contratos

Revise API, eventos e mensagens.

### Parte 9 — Testes

Proteja termos críticos.

### Parte 10 — Gate

Valide rastreabilidade e drift.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 619 e ponte para a aula 621 foram preservadas;
- o laboratório `service-scheduling-language` foi criado;
- o charter define contexto, objetivo, participantes e canais;
- glossário possui termos canônicos;
- definições são operacionais;
- cada termo possui exemplo e contraexemplo;
- termos públicos possuem owner;
- matriz terminológica conecta código, API, eventos e testes;
- sinônimos permitidos e proibidos foram documentados;
- contratos públicos usam termos canônicos;
- ambiguidades possuem interpretações, impacto e owner;
- ambiguidades críticas não foram publicadas;
- termos aposentados possuem substituição e migration plan;
- novos contratos não usam termos aposentados;
- adapters legados traduzem termos antigos;
- classes públicas usam linguagem aprovada;
- métodos usam verbos do domínio;
- mutações genéricas foram proibidas;
- sufixos técnicos foram revisados;
- paths, campos, enums e error codes da API foram revisados;
- eventos possuem nomes no passado;
- eventos genéricos foram rejeitados;
- testes expressam regras e cenários;
- mensagens de erro usam conceitos aprovados;
- documentation inventory foi revisado;
- language change log foi criado;
- mudanças públicas possuem análise de compatibilidade;
- testes automatizados detectam drift relevante;
- automação não substitui revisão humana;
- nenhum laboratório completo de Bounded Context foi antecipado;
- nenhum Context Map dedicado foi antecipado;
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
  labs/m19/aula-620-ubiquitous-language/service-scheduling-language `
  scripts/m19/service-scheduling-language `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|companyRealName|bookingRecordNew|genericStatus|completeBoundedContextWorkshop|fullContextMap"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): consolidar Ubiquitous Language"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- nomes reais;
- contratos corporativos reais;
- context map completo;
- nova estratégia de contextos;
- microservices.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Ubiquitous Language.

Você criou:

```text
charter;

glossário vivo;

matriz terminológica;

política de sinônimos;

registro de ambiguidades;

termos aposentados;

exemplos;

contraexemplos;

inventário de código;

inventário de API;

inventário de eventos;

inventário de testes;

rastreabilidade;

migration plan;

change log;

testes de consistência.
```

Você comprovou que linguagem não é apenas documentação; que termos precisam de definição operacional; que exemplos e contraexemplos revelam significado; que sinônimos precisam de decisão; que ambiguidades críticas bloqueiam contratos; que termos aposentados exigem migração; que código, API, eventos e testes precisam usar os mesmos conceitos; e que a linguagem evolui por um processo controlado.

A próxima aula será:

```text
621 - M19.11 - Bounded Context
```

Nela, você irá aprofundar como uma linguagem e um modelo são protegidos dentro de uma fronteira explícita, analisando responsabilidades, internals, integração, dados e evolução do contexto.

Nenhum laboratório completo de Bounded Context ou Context Map foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o charter da linguagem.
- [ ] Defini termos operacionais.
- [ ] Criei exemplos e contraexemplos.
- [ ] Decidi sinônimos.
- [ ] Registrei ambiguidades.
- [ ] Planejei termos aposentados.
- [ ] Alinhei código, API, eventos e testes.
- [ ] Criei governança e gate.

---

## Troubleshooting adicional

### Especialistas não concordam com um termo

Registre interpretações, impacto e owner da decisão.

### O termo em inglês difere do português

Defina termo canônico e tradução autorizada.

### A API já usa termo aposentado

Crie compatibilidade, deprecation e plano de remoção.

### O banco usa nome antigo

Traduza no adapter; não obrigue o domínio a manter o termo.

### O scanner encontra falso positivo

Limite paths, adapters legados e palavras completas.

### O evento parece genérico

Pergunte qual fato de negócio realmente aconteceu.

### O teste usa linguagem técnica

Renomeie pelo comportamento do domínio.

### O glossário muda com frequência

Registre decisões; evolução é esperada.

### A equipe quer uma linguagem global

Reforce que o significado é contextual.

### O laboratório começou a criar context map

Preserve o aprofundamento para as aulas 621 e 622.

---

## Perguntas de revisão

1. O que é Ubiquitous Language?
2. O que é definição operacional?
3. Por que usar exemplos?
4. Por que usar contraexemplos?
5. O que é sinônimo permitido?
6. O que é sinônimo proibido?
7. O que é homônimo?
8. O que é ambiguidade?
9. O que é termo aposentado?
10. O que é language drift?
11. Onde a linguagem deve aparecer?
12. Por que métodos devem usar verbos do domínio?
13. Por que eventos devem representar fatos?
14. Por que revisar APIs?
15. O que é language migration?
16. Para que serve rastreabilidade?
17. Automação substitui especialistas?
18. Por que a linguagem é contextual?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Linguagem compartilhada e usada no domínio.
2. Definição reconhecível em exemplos concretos.
3. Tornar significado observável.
4. Limitar interpretações incorretas.
5. Variação autorizada sem perda de significado.
6. Termo que cria ambiguidade ou vazamento.
7. Mesma palavra com significados diferentes.
8. Múltiplas interpretações relevantes.
9. Termo removido da linguagem oficial.
10. Desalinhamento progressivo da linguagem.
11. Conversas, docs, código, testes e contratos.
12. Expressar intenção e comportamento.
13. Registrar algo ocorrido no domínio.
14. Contratos públicos cristalizam linguagem.
15. Mudança controlada de termos.
16. Conectar termo a todas as representações.
17. Não.
18. O significado vale dentro de uma fronteira.
19. Bounded Context.
20. Bounded Context.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 620 - M19.10 - Ubiquitous Language

- Aprofundei Ubiquitous Language no Service Scheduling Context.
- Criei um charter com participantes, canais e regras.
- Transformei o glossário em artefato vivo.
- Criei definições operacionais com exemplos e contraexemplos.
- Defini termos canônicos em português e inglês.
- Documentei sinônimos permitidos e proibidos.
- Registrei ambiguidades com impacto, owner e bloqueio.
- Criei catálogo de termos aposentados.
- Planejei migração de linguagem legada.
- Revisei classes, métodos, enums e exceptions.
- Revisei paths, campos, error codes e enums da API.
- Revisei nomes e payloads de Domain Events.
- Revisei nomes de testes e fixtures.
- Criei inventário de mensagens de erro e documentação.
- Conectei termos, regras, cenários, código, API, eventos e testes.
- Criei language change log e processo de governança.
- Implementei testes de consistência e termos proibidos.
- Criei reports, gate e evidence.
- Não antecipei Bounded Context ou Context Map dedicados.
- Próxima aula: Bounded Context.
```

---

## Referência técnica curta

- Ubiquitous Language.
- Operational definitions.
- Examples and counterexamples.
- Synonym governance.
- Ambiguity management.
- Retired terminology.
- Language drift.
- API language.
- Event language.
- Language traceability.

Regra final:

```text
Ubiquitous Language precisa ser uma linguagem viva e usada, não um glossário isolado: cada termo canônico possui definição operacional, escopo, exemplo, contraexemplo, status e owner, sinônimos são permitidos somente quando preservam significado, termos proibidos evitam modelos paralelos, ambiguidades críticas bloqueiam código e contratos até decisão explícita e termos aposentados possuem substituição, adapter de tradução e migration plan; classes, métodos, enums, APIs, eventos, testes, mensagens e documentação usam o mesmo vocabulário, mutações genéricas, eventos como Updated ou Processed e nomes técnicos que substituem conceitos são rejeitados, contratos públicos passam por análise de compatibilidade e mudanças atualizam todas as representações por decision log e rastreabilidade; testes automatizados detectam drift e violações, mas não substituem workshops com especialistas; o gate termina com charter, glossário, sinônimos, ambiguidades, retired terms, código, API, eventos, testes, documentação, migração e evidence aprovados, enquanto Bounded Context é aprofundado somente na aula 621 e Context Map permanece reservado à aula 622.
```
