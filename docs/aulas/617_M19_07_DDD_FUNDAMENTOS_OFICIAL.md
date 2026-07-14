# 617 - M19.07 - DDD fundamentos

## Apresentação da aula

Na aula 616, você usou Maven multi-module e JPMS para reforçar fronteiras técnicas.

Você trabalhou com:

```text
module-info.java;

requires;

exports;

opens;

module path;

encapsulamento;

grafos de dependência;

split packages;

automatic modules.
```

Essas ferramentas ajudam a controlar:

```text
quem pode acessar o quê;

quais módulos dependem de quais;

quais packages são públicos;

quais detalhes permanecem internos.
```

Mas existe uma pergunta anterior a todas essas decisões:

```text
quais responsabilidades
realmente pertencem juntas?
```

O compilador pode impedir um acesso indevido.

ArchUnit pode bloquear um ciclo.

JPMS pode esconder um package.

Nenhuma dessas ferramentas, sozinha, descobre:

- o que o negócio chama de pedido;
- quando uma reserva passa a existir;
- quem pode confirmar um agendamento;
- qual diferença existe entre cancelamento e expiração;
- quais regras são centrais;
- quais termos possuem significados diferentes;
- quais mudanças fazem parte do mesmo conceito;
- quais fronteiras representam realidades de negócio distintas.

Essa descoberta pertence ao domínio.

A partir desta aula, você começa a estudar:

```text
Domain-Driven Design.
```

DDD não é:

```text
criar muitas classes;

usar nomes sofisticados;

transformar toda classe em aggregate;

criar value objects para qualquer String;

aplicar repository em todo projeto;

usar microservices;

desenhar diagramas sem conversar com o negócio.
```

DDD é uma abordagem para desenvolver software complexo colocando o conhecimento do domínio no centro das decisões.

A pergunta principal desta aula será:

```text
como transformar
conhecimento de negócio

em uma linguagem
e em um modelo

que desenvolvedores
e especialistas
consigam discutir,
validar
e evoluir juntos?
```

Nesta aula, você irá aprender os fundamentos que sustentam as etapas estratégicas e táticas:

- domínio;
- modelo de domínio;
- especialista de domínio;
- conhecimento do domínio;
- complexidade essencial;
- linguagem ubíqua;
- knowledge crunching;
- descoberta de regras;
- cenários;
- exemplos concretos;
- ambiguidades;
- políticas;
- invariantes em linguagem natural;
- diagramas como ferramentas de conversa;
- feedback contínuo;
- alinhamento entre linguagem, documentação, testes e código.

O laboratório será:

```text
labs/m19/aula-617-ddd-fundamentos/service-scheduling-discovery
```

O cenário será um sistema de agendamento de serviços técnicos.

A empresa precisa coordenar:

- solicitações de serviço;
- regiões de atendimento;
- disponibilidade;
- janelas;
- confirmação;
- reagendamento;
- cancelamento;
- execução;
- impedimentos;
- histórico.

O laboratório não tentará construir o sistema inteiro.

O objetivo será descobrir e consolidar uma linguagem confiável.

Você produzirá:

- briefing inicial;
- roteiro de entrevista;
- transcrição sintética;
- glossário;
- catálogo de regras;
- exemplos e contraexemplos;
- mapa de conceitos;
- mapa de ambiguidades;
- cenários;
- modelo conceitual inicial;
- testes de linguagem;
- esqueleto Java com nomes alinhados;
- relatórios de revisão;
- gate de fundamentos de DDD.

A próxima aula oficial será:

```text
618 - M19.08 - DDD estrategico
```

Na aula 618, você aprofundará:

- subdomínios;
- core domain;
- supporting subdomain;
- generic subdomain;
- bounded contexts;
- context map;
- relações entre contextos;
- decisões estratégicas.

Por isso, esta aula não irá definir formalmente o mapa estratégico completo.

A aula seguinte será:

```text
619 - M19.09 - DDD tatico
```

Nela, serão aprofundados padrões como:

- entity;
- value object;
- aggregate;
- repository;
- domain service;
- factory;
- domain event.

Nesta aula, esses termos poderão ser mencionados apenas para posicionamento, mas não serão implementados como catálogo tático completo.

A regra central será:

```text
antes de modelar classes,
modele o entendimento;

antes de nomear métodos,
alinhe a linguagem;

antes de impor fronteiras,
descubra as diferenças
do domínio.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
615:
Monolito modular.

616:
Modularizacao em Java.

617:
DDD fundamentos.

618:
DDD estrategico.

619:
DDD tatico.
```

A progressão é:

```text
organizar módulos;

reforçar encapsulamento;

entender o domínio;

definir estratégia de contextos;

implementar padrões táticos.
```

Nesta aula:

```text
domínio:
sim.

linguagem ubíqua:
sim.

especialista de domínio:
sim.

knowledge crunching:
sim.

regras:
sim.

exemplos:
sim.

ambiguidades:
sim.

modelo conceitual:
sim.

esqueleto de código:
sim,
somente para validar linguagem.

subdomínios formais:
não.

bounded contexts formais:
não.

context map:
não.

aggregates:
não.

value objects formais:
não.

repositories de DDD:
não.
```

O laboratório será majoritariamente orientado a descoberta.

O código terá função de feedback.

Ele não será o ponto de partida.

---

## Objetivo prático

Será criada a seguinte estrutura:

```text
labs/m19/aula-617-ddd-fundamentos/service-scheduling-discovery
├── README.md
├── discovery
│   ├── 01-initial-briefing.md
│   ├── 02-interview-guide.md
│   ├── 03-synthetic-interview-transcript.md
│   ├── 04-domain-glossary.md
│   ├── 05-rule-catalog.md
│   ├── 06-examples-and-counterexamples.md
│   ├── 07-ambiguity-log.md
│   ├── 08-concept-map.md
│   ├── 09-scenario-catalog.md
│   ├── 10-open-questions.md
│   ├── 11-model-narrative.md
│   └── 12-discovery-decision-log.md
├── model
│   ├── service-scheduling-model.md
│   ├── terminology-matrix.md
│   ├── rule-traceability-matrix.md
│   ├── scenario-rule-matrix.md
│   └── language-review-checklist.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/servicescheduling
│   │           ├── ServiceRequest.java
│   │           ├── ServiceAppointment.java
│   │           ├── AppointmentWindow.java
│   │           ├── ServiceArea.java
│   │           ├── AppointmentStatus.java
│   │           ├── RescheduleReason.java
│   │           └── SchedulingPolicy.java
│   └── test
│       └── java
│           └── br/com/formacao/servicescheduling
│               ├── DomainLanguageTest.java
│               ├── SchedulingExamplesTest.java
│               └── TerminologyConsistencyTest.java
├── contracts
│   ├── ddd-foundations-contract.yaml
│   ├── ubiquitous-language-policy.yaml
│   ├── knowledge-crunching-policy.yaml
│   ├── rule-discovery-policy.yaml
│   ├── example-policy.yaml
│   ├── ambiguity-policy.yaml
│   ├── model-code-alignment-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── reports
│   ├── glossary-review-report.yaml
│   ├── rule-review-report.yaml
│   ├── scenario-review-report.yaml
│   ├── model-alignment-report.yaml
│   └── ddd-foundations-gate-report.yaml
└── pom.xml
```

Scripts:

```text
scripts/m19/service-scheduling-discovery
├── validate-ddd-foundations-contract.ps1
├── validate-domain-glossary.ps1
├── validate-rule-catalog.ps1
├── validate-examples-and-counterexamples.ps1
├── validate-ambiguity-log.ps1
├── validate-scenario-traceability.ps1
├── validate-model-code-language.ps1
├── run-ddd-foundations-tests.ps1
├── collect-ddd-foundations-evidence.ps1
└── verify-ddd-foundations-gate.ps1
```

Ao final, você terá uma base de conhecimento do domínio suficientemente clara para sustentar a modelagem estratégica da aula 618.

---

## Conceito essencial

### Domínio

Área de conhecimento e atividade para a qual o software está sendo construído.

---

### Domain-Driven Design

Abordagem que conecta desenvolvimento de software, conhecimento do domínio, linguagem e modelagem contínua.

---

### Modelo de domínio

Representação útil de conceitos, regras e relações relevantes para resolver um problema.

---

### Especialista de domínio

Pessoa que possui conhecimento significativo sobre regras, processos, exceções e linguagem da área.

---

### Linguagem ubíqua

Linguagem compartilhada, precisa e usada por especialistas e desenvolvedores nas conversas, documentos, testes e código.

---

### Knowledge crunching

Processo iterativo de explorar, questionar, testar e refinar conhecimento do domínio.

---

### Complexidade essencial

Complexidade que pertence ao próprio problema de negócio.

---

### Complexidade acidental

Complexidade criada por tecnologia, estrutura ou implementação.

---

### Regra de negócio

Restrição, decisão ou cálculo relevante ao domínio.

---

### Invariante

Condição que deve permanecer verdadeira durante uma operação ou estado válido.

---

### Exemplo

Cenário concreto que demonstra como uma regra funciona.

---

### Contraexemplo

Cenário que mostra quando uma interpretação não deve ser aplicada.

---

### Ambiguidade

Termo, regra ou cenário com mais de uma interpretação possível.

---

### Modelo conceitual

Representação inicial de conceitos e relações, ainda não comprometida com estrutura final de código ou banco.

---

### Feedback loop

Ciclo em que conversas, exemplos, testes e código refinam o entendimento.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-617-ddd-fundamentos/service-scheduling-discovery

Set-Location `
  labs/m19/aula-617-ddd-fundamentos/service-scheduling-discovery
```

---

### 2. Criar o briefing inicial

Arquivo:

```text
discovery/01-initial-briefing.md
```

Conteúdo inicial:

```markdown
# Briefing inicial

Uma empresa recebe solicitações de instalação e manutenção.

Cada solicitação pode exigir um agendamento.

O agendamento deve considerar:

- área atendida;
- tipo de serviço;
- disponibilidade;
- janela;
- confirmação;
- impedimentos;
- reagendamento;
- cancelamento.

O sistema atual usa termos diferentes
entre atendimento,
operação
e tecnologia.
```

Não tente resolver ainda.

Registre apenas o problema conhecido.

---

### 3. Separar fatos de suposições

No briefing, crie:

```markdown
## Fatos conhecidos

## Suposições

## Perguntas abertas
```

Exemplo de suposição:

```text
todo pedido possui um único agendamento.
```

Essa frase precisa ser validada.

Pode existir:

- tentativa inicial;
- reagendamento;
- retorno;
- múltiplas visitas;
- serviço parcial.

---

### 4. Criar contrato principal

Arquivo:

```text
contracts/ddd-foundations-contract.yaml
```

Conteúdo:

```yaml
dddFoundations:
  required:
    - domain-briefing
    - domain-expert-perspective
    - ubiquitous-language
    - rule-catalog
    - examples
    - counterexamples
    - ambiguity-log
    - scenarios
    - conceptual-model
    - model-code-feedback
    - open-questions

  forbidden:
    - database-first-modeling
    - framework-first-modeling
    - unsupported-business-rule
    - tactical-pattern-catalog
    - premature-bounded-context-map

  nextLesson:
    code:
      M19.08
```

---

### 5. Criar roteiro de entrevista

Arquivo:

```text
discovery/02-interview-guide.md
```

Perguntas úteis:

```text
o que inicia uma solicitação?

qual diferença existe
entre solicitação
e agendamento?

quem cria o agendamento?

o que significa confirmar?

quando um reagendamento
é permitido?

cancelar o agendamento
cancela a solicitação?

o que é uma janela?

quem decide disponibilidade?

o que acontece
quando o técnico não consegue executar?

qual informação é obrigatória?

quais exceções são frequentes?

quais termos causam confusão?
```

Evite perguntas que já contenham a resposta.

---

### 6. Criar entrevista sintética

Arquivo:

```text
discovery/03-synthetic-interview-transcript.md
```

Trecho:

```markdown
Especialista:
A solicitação é o pedido do cliente.

Desenvolvedor:
Então a solicitação já possui data?

Especialista:
Não. Primeiro verificamos cobertura
e depois tentamos encontrar uma janela.

Desenvolvedor:
A janela pertence à solicitação?

Especialista:
Não exatamente.
A janela é uma possibilidade de atendimento.
Quando escolhemos uma,
criamos o agendamento.

Desenvolvedor:
Confirmado significa executado?

Especialista:
Não.
Confirmado significa que o cliente
aceitou o compromisso.
```

Esse diálogo já revela conceitos distintos:

- solicitação;
- disponibilidade;
- janela;
- agendamento;
- confirmação;
- execução.

---

### 7. Praticar knowledge crunching

Para cada resposta:

1. identifique termos;
2. peça definição;
3. peça exemplo;
4. peça contraexemplo;
5. descubra regra;
6. descubra exceção;
7. registre dúvida;
8. atualize o modelo;
9. valide novamente.

O processo é iterativo.

---

### 8. Criar knowledge-crunching policy

Arquivo:

```text
contracts/knowledge-crunching-policy.yaml
```

Conteúdo:

```yaml
knowledgeCrunching:
  cycle:
    - ask
    - define
    - exemplify
    - challenge
    - model
    - validate
    - revise

  assumption:
    mustBeMarked:
      true

  unresolvedQuestion:
    mustBeRecorded:
      true

  singleInterviewAsTruth:
    forbidden

  codeAsFinalAuthority:
    forbidden
```

---

### 9. Criar glossário

Arquivo:

```text
discovery/04-domain-glossary.md
```

Modelo:

```markdown
## Solicitação de serviço

Definição:
Pedido para avaliar ou executar um serviço.

Não significa:
Agendamento confirmado.

Exemplo:
Cliente solicita instalação de equipamento.

Termos proibidos:
Ticket genérico, ordem aleatória.

Perguntas abertas:
Uma solicitação pode gerar múltiplos agendamentos?
```

---

### 10. Criar termos principais

Inclua:

```text
Solicitação de serviço;

Área de atendimento;

Disponibilidade;

Janela de atendimento;

Agendamento;

Confirmação;

Reagendamento;

Cancelamento;

Impedimento;

Execução;

Tentativa;

Motivo de reagendamento.
```

Cada termo precisa de definição curta.

---

### 11. Criar policy de linguagem

Arquivo:

```text
contracts/ubiquitous-language-policy.yaml
```

Conteúdo:

```yaml
ubiquitousLanguage:
  term:
    requires:
      - definition
      - example
      - forbidden-synonym-or-distinction
      - review-status

  usedIn:
    - conversation
    - documentation
    - scenarios
    - tests
    - code

  ambiguousTerm:
    status:
      unresolved

  technicalAliasReplacingDomainTerm:
    forbiddenByDefault
```

---

### 12. Identificar sinônimos perigosos

Exemplo:

```text
ordem;

pedido;

solicitação;

chamado;

ticket.
```

Eles podem:

- ser sinônimos;
- representar etapas diferentes;
- pertencer a equipes diferentes;
- esconder conceitos distintos.

Não escolha um termo apenas por preferência técnica.

Valide o significado.

---

### 13. Identificar homônimos

O mesmo termo pode possuir significados diferentes.

Exemplo:

```text
confirmação.
```

Para atendimento:

```text
cliente aceitou a data.
```

Para operação:

```text
técnico assumiu o serviço.
```

Para financeiro:

```text
pagamento aprovado.
```

Essa diferença será importante na modelagem estratégica futura.

Nesta aula, registre a ambiguidade sem criar ainda bounded contexts formais.

---

### 14. Criar catálogo de regras

Arquivo:

```text
discovery/05-rule-catalog.md
```

Modelo:

```markdown
## REG-001 — Criar agendamento

Regra:
Um agendamento só pode ser criado
a partir de uma solicitação elegível
e de uma janela disponível.

Fonte:
Entrevista 03, seção 4.

Exemplo:
Solicitação coberta + janela livre.

Contraexemplo:
Solicitação fora da área.

Exceções:
Atendimento emergencial.

Status:
Em validação.
```

---

### 15. Criar regras iniciais

Exemplos:

```text
REG-001:
agendamento exige solicitação elegível.

REG-002:
janela deve estar disponível.

REG-003:
confirmação exige agendamento ativo.

REG-004:
reagendamento exige motivo.

REG-005:
agendamento cancelado não pode ser confirmado.

REG-006:
execução não é sinônimo de confirmação.

REG-007:
solicitação fora da área não pode ser agendada.

REG-008:
um impedimento pode exigir nova tentativa.
```

Todas precisam de fonte ou status de hipótese.

---

### 16. Criar rule discovery policy

Arquivo:

```text
contracts/rule-discovery-policy.yaml
```

Conteúdo:

```yaml
rule:
  requires:
    - identifier
    - statement
    - source
    - example
    - counterexample
    - status

  status:
    allowed:
      - hypothesis
      - validating
      - approved
      - rejected

  sourceMissing:
    result:
      unsupported

  technicalConstraintAsBusinessRule:
    review:
      required
```

---

### 17. Diferenciar regra de negócio e restrição técnica

Regra de negócio:

```text
reagendamento exige motivo.
```

Restrição técnica:

```text
campo motivo possui 255 caracteres.
```

A segunda pode existir por implementação.

Ela não deve ser apresentada automaticamente como regra do domínio.

---

### 18. Criar exemplos e contraexemplos

Arquivo:

```text
discovery/06-examples-and-counterexamples.md
```

Exemplo:

```markdown
## EX-001 — Confirmação válida

Dado:
Agendamento ativo para amanhã.

Quando:
Cliente aceita a janela.

Então:
Agendamento fica confirmado.

Não implica:
Serviço executado.
```

Contraexemplo:

```markdown
## CEX-001 — Confirmação inválida

Dado:
Agendamento cancelado.

Quando:
É recebida tentativa de confirmação.

Então:
Operação é rejeitada.
```

---

### 19. Criar example policy

Arquivo:

```text
contracts/example-policy.yaml
```

Conteúdo:

```yaml
example:
  mustContain:
    - given
    - when
    - then
    - explained-term

  counterexample:
    requiredForCriticalRule:
      true

  realPersonalData:
    forbidden

  happyPathOnly:
    insufficient
```

---

### 20. Criar ambiguity log

Arquivo:

```text
discovery/07-ambiguity-log.md
```

Modelo:

```markdown
## AMB-001 — Confirmação

Interpretação A:
Cliente aceitou o compromisso.

Interpretação B:
Técnico assumiu o serviço.

Impacto:
Status, eventos e relatórios podem divergir.

Pergunta:
Precisamos de dois termos?

Owner da resposta:
Operação.

Estado:
Aberta.
```

---

### 21. Criar ambiguity policy

Arquivo:

```text
contracts/ambiguity-policy.yaml
```

Conteúdo:

```yaml
ambiguity:
  mustRecord:
    - term
    - interpretations
    - impact
    - question
    - owner
    - status

  unresolved:
    mayNotBeSilentlyImplemented:
      true

  renamedTerm:
    update:
      - glossary
      - scenarios
      - tests
      - code
```

---

### 22. Criar mapa de conceitos

Arquivo:

```text
discovery/08-concept-map.md
```

Representação inicial:

```text
Solicitação de serviço
        |
        | é avaliada para
        v
Área de atendimento
        |
        | permite consultar
        v
Disponibilidade
        |
        | oferece
        v
Janela
        |
        | escolhida cria
        v
Agendamento
        |
        +--> confirmado
        |
        +--> reagendado
        |
        +--> cancelado
        |
        +--> executado
```

Esse mapa é uma ferramenta de conversa.

Não é diagrama final de classes.

---

### 23. Questionar relações

Perguntas:

```text
uma solicitação possui um agendamento
ou um histórico de agendamentos?

janela existe sem solicitação?

reagendamento cria novo agendamento
ou altera o atual?

cancelamento pertence ao agendamento
ou à solicitação?

execução pertence ao mesmo modelo?

impedimento é estado,
evento
ou motivo?
```

Registre respostas e dúvidas.

---

### 24. Criar cenários

Arquivo:

```text
discovery/09-scenario-catalog.md
```

Cenários mínimos:

```text
SCN-001:
agendar solicitação elegível.

SCN-002:
rejeitar área não atendida.

SCN-003:
confirmar agendamento ativo.

SCN-004:
rejeitar confirmação cancelada.

SCN-005:
reagendar com motivo.

SCN-006:
rejeitar reagendamento sem motivo.

SCN-007:
registrar impedimento.

SCN-008:
distinguir confirmação de execução.
```

---

### 25. Criar cenário em linguagem do domínio

Exemplo:

```markdown
## SCN-005 — Reagendar compromisso

Dado:
Existe um agendamento confirmado.

E:
O cliente informa indisponibilidade.

Quando:
A operação seleciona nova janela
e registra o motivo
"cliente indisponível".

Então:
O compromisso anterior deixa de valer.

E:
A nova janela passa a representar
o compromisso atual.

Pergunta aberta:
O histórico usa o mesmo identificador?
```

Não esconda a pergunta aberta.

---

### 26. Criar matriz de rastreabilidade

Arquivo:

```text
model/rule-traceability-matrix.md
```

Colunas:

```text
Regra;

Termos;

Fonte;

Exemplo;

Contraexemplo;

Cenário;

Teste;

Classe ou método;

Status.
```

Uma regra sem rastreabilidade pode ser invenção.

---

### 27. Criar matriz cenário-regra

Arquivo:

```text
model/scenario-rule-matrix.md
```

Exemplo:

```text
SCN-003 -> REG-003;

SCN-004 -> REG-003 + REG-005;

SCN-005 -> REG-004;

SCN-006 -> REG-004.
```

---

### 28. Criar perguntas abertas

Arquivo:

```text
discovery/10-open-questions.md
```

Inclua:

- uma solicitação pode ter múltiplos compromissos ativos?
- reagendamento preserva ID?
- quem aprova atendimento emergencial?
- qual diferença entre impedimento e cancelamento?
- execução parcial existe?
- retorno é nova solicitação?
- janela é capacidade ou compromisso?
- qual sistema é fonte da disponibilidade?

Cada pergunta precisa de:

- impacto;
- owner;
- prioridade;
- prazo de resposta;
- decisão temporária, se necessária.

---

### 29. Criar narrativa do modelo

Arquivo:

```text
discovery/11-model-narrative.md
```

Exemplo:

```markdown
Uma solicitação representa a necessidade do cliente.

Antes de se tornar um compromisso,
ela precisa ser considerada elegível.

A disponibilidade oferece janelas possíveis.

Quando uma janela é escolhida,
nasce um agendamento.

A confirmação valida o compromisso,
mas não representa execução.

O reagendamento exige causa
e preserva histórico.
```

A narrativa ajuda a validar o modelo sem código.

---

### 30. Criar decision log

Arquivo:

```text
discovery/12-discovery-decision-log.md
```

Modelo:

```markdown
## DEC-001

Decisão:
Usar "solicitação de serviço"
em vez de "ticket".

Motivo:
"Ticket" é usado pelo suporte
para outra finalidade.

Evidência:
Entrevista 03.

Impacto:
Código, documentação e APIs futuras.

Revisão:
Após workshop operacional.
```

---

### 31. Criar modelo conceitual

Arquivo:

```text
model/service-scheduling-model.md
```

Conceitos iniciais:

```text
ServiceRequest;

ServiceArea;

Availability;

AppointmentWindow;

ServiceAppointment;

AppointmentStatus;

RescheduleReason;

SchedulingPolicy.
```

Não transforme imediatamente cada substantivo em classe.

Pergunte:

- possui comportamento?
- possui identidade?
- é apenas descrição?
- pertence ao mesmo ciclo?
- muda independentemente?
- precisa existir no software?

---

### 32. Criar terminologia matrix

Arquivo:

```text
model/terminology-matrix.md
```

Colunas:

```text
Termo do domínio;

Definição;

Nome em Java;

Nome em API futura;

Nome em banco futuro;

Sinônimo evitado;

Status.
```

Nesta aula, banco e API ainda são sugestões.

Eles não devem comandar o modelo.

---

### 33. Criar esqueleto Java

Crie:

```java
public final class ServiceRequest {

    private final UUID id;
    private final String serviceType;
    private final String postalCode;

    public ServiceRequest(
            UUID id,
            String serviceType,
            String postalCode) {

        this.id = Objects.requireNonNull(id);
        this.serviceType =
                requireText(
                        serviceType,
                        "serviceType");
        this.postalCode =
                requireText(
                        postalCode,
                        "postalCode");
    }
}
```

O objetivo é validar nomes.

Não formalize ainda entity ou value object como padrão tático.

---

### 34. Criar `AppointmentWindow`

```java
public record AppointmentWindow(
        Instant startsAt,
        Instant endsAt) {

    public AppointmentWindow {
        Objects.requireNonNull(startsAt);
        Objects.requireNonNull(endsAt);

        if (!endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException(
                    "Window end must be after start");
        }
    }
}
```

Esse código expressa uma regra simples.

Na aula 619, você discutirá formalmente o papel tático desse tipo.

---

### 35. Criar status com linguagem validada

```java
public enum AppointmentStatus {
    SCHEDULED,
    CONFIRMED,
    CANCELLED,
    COMPLETED
}
```

Verifique no glossário se:

```text
COMPLETED
```

é realmente o termo do domínio.

Talvez o especialista use:

```text
EXECUTED.
```

O código deve acompanhar a linguagem aprovada.

---

### 36. Criar `ServiceAppointment`

```java
public final class ServiceAppointment {

    private final UUID id;
    private final UUID serviceRequestId;
    private AppointmentWindow window;
    private AppointmentStatus status;

    public void confirm() {

        if (status != AppointmentStatus.SCHEDULED) {
            throw new IllegalStateException(
                    "Only scheduled appointments can be confirmed");
        }

        status = AppointmentStatus.CONFIRMED;
    }
}
```

O método deve usar a linguagem do domínio.

Evite:

```java
updateStatus(2);
```

---

### 37. Criar política de reagendamento

```java
public final class SchedulingPolicy {

    public boolean canReschedule(
            ServiceAppointment appointment,
            RescheduleReason reason) {

        return appointment.isActive()
                && reason != null;
    }
}
```

Não conclua que toda regra deve virar uma classe `Policy`.

Aqui, a classe apenas ajuda a discutir linguagem e responsabilidade.

A aula tática aprofundará isso.

---

### 38. Criar model-code alignment policy

Arquivo:

```text
contracts/model-code-alignment-policy.yaml
```

Conteúdo:

```yaml
alignment:
  glossaryTerm:
    codeEquivalent:
      requiredWhenImplemented

  forbiddenSynonym:
    mustNotAppear:
      true

  unresolvedAmbiguity:
    implementation:
      forbidden

  rule:
    traceToTestOrScenario:
      required

  databaseNameDrivingDomainName:
    forbiddenByDefault
```

---

### 39. Criar language test

```java
@Test
void confirmationMustNotMeanExecution() {

    assertNotEquals(
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.COMPLETED);
}
```

Esse teste parece simples.

Sua função é registrar uma distinção do domínio.

---

### 40. Criar exemplo executável

```java
@Test
void cancelledAppointmentCannotBeConfirmed() {

    ServiceAppointment appointment =
            SchedulingFixtures.cancelledAppointment();

    assertThrows(
            IllegalStateException.class,
            appointment::confirm);
}
```

O nome do teste usa a linguagem aprovada.

---

### 41. Criar terminology consistency test

O teste pode inspecionar código-fonte ou classes para impedir termos proibidos.

Exemplo de lista:

```text
ticket;

bookingRecord;

statusCode2;

genericRequest;

scheduleEntityDTO.
```

Não transforme o teste em scanner frágil.

Use-o como apoio.

---

### 42. Revisar linguagem no código

Procure:

```powershell
Get-ChildItem `
  -Recurse `
  -Include *.java,*.md `
  | Select-String `
      -Pattern `
      "ticket|bookingRecord|statusCode|genericRequest"
```

Cada ocorrência precisa ser:

- removida;
- justificada;
- adicionada ao glossário como distinção.

---

### 43. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  glossaryWithoutDefinition:
    result:
      incomplete

  ruleWithoutSource:
    result:
      unsupported

  scenarioWithoutExpectedOutcome:
    result:
      incomplete

  unresolvedAmbiguityImplemented:
    action:
      FAIL

  codeUsingForbiddenSynonym:
    action:
      FAIL

  frameworkTermReplacingDomainTerm:
    result:
      language-leak
```

---

### 44. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  unsupportedRule:
    action:
      FAIL

  silentAmbiguity:
    action:
      FAIL

  databaseFirstModel:
    action:
      FAIL

  frameworkFirstVocabulary:
    action:
      FAIL

  StrategicDDD:
    deferredToLesson618

  TacticalDDD:
    deferredToLesson619
```

---

### 45. Validar glossário

Execute:

```powershell
.\scripts\m19\service-scheduling-discovery\validate-domain-glossary.ps1
```

Confirme:

- definições;
- exemplos;
- distinções;
- status;
- termos proibidos;
- links com regras.

---

### 46. Validar regras

Execute:

```powershell
.\scripts\m19\service-scheduling-discovery\validate-rule-catalog.ps1
```

Procure:

- regra sem fonte;
- regra sem exemplo;
- regra sem contraexemplo;
- regra técnica disfarçada;
- status inválido;
- duplicação.

---

### 47. Validar exemplos

Execute:

```powershell
.\scripts\m19\service-scheduling-discovery\validate-examples-and-counterexamples.ps1
```

Confirme:

- dado;
- quando;
- então;
- termo explicado;
- dados sintéticos;
- happy path e falha.

---

### 48. Validar ambiguidades

Execute:

```powershell
.\scripts\m19\service-scheduling-discovery\validate-ambiguity-log.ps1
```

Nenhuma ambiguidade aberta deve ser implementada silenciosamente.

---

### 49. Validar rastreabilidade

Execute:

```powershell
.\scripts\m19\service-scheduling-discovery\validate-scenario-traceability.ps1
```

Gere relatório:

- regras sem cenário;
- cenários sem regra;
- termos sem exemplo;
- testes sem regra;
- código sem termo aprovado.

---

### 50. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-discovery\run-ddd-foundations-tests.ps1
```

Ou:

```powershell
mvn test
```

Os testes validam exemplos e linguagem.

Eles não substituem a conversa com especialistas.

---

### 51. Criar reports

Exemplo:

```yaml
glossaryReview:
  definedTerms:
    12

  ambiguousTerms:
    2

  unsupportedTerms:
    0

  forbiddenSynonymViolations:
    0

  result:
    PASS_WITH_OPEN_QUESTIONS
```

---

### 52. Criar gate

O gate valida:

```text
briefing;

entrevista;

glossário;

regras;

exemplos;

contraexemplos;

ambiguidades;

cenários;

rastreabilidade;

modelo conceitual;

alinhamento com código;

perguntas abertas;

evidence.
```

Status:

```text
PASS;

PASS_WITH_OPEN_QUESTIONS;

FAIL_GLOSSARY;

FAIL_RULE;

FAIL_EXAMPLE;

FAIL_AMBIGUITY;

FAIL_TRACEABILITY;

FAIL_MODEL_ALIGNMENT;

FAIL_UNSUPPORTED_KNOWLEDGE;

INCONCLUSIVE.
```

Perguntas abertas não significam automaticamente falha.

Elas precisam estar explícitas e possuir owner.

---

### 53. Coletar evidence

Arquivo:

```text
contracts/ddd-foundations-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- briefing status;
- interview status;
- glossary status;
- rule status;
- example status;
- ambiguity status;
- scenario status;
- traceability status;
- conceptual model status;
- code alignment status;
- open question count;
- unsupported rule count;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- nomes reais de clientes;
- informações operacionais sensíveis;
- bounded context map completo;
- aggregates formais;
- conteúdo da aula 618;
- conteúdo da aula 619.

---

### 54. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-discovery\validate-ddd-foundations-contract.ps1

.\scripts\m19\service-scheduling-discovery\validate-domain-glossary.ps1

.\scripts\m19\service-scheduling-discovery\validate-rule-catalog.ps1

.\scripts\m19\service-scheduling-discovery\validate-examples-and-counterexamples.ps1

.\scripts\m19\service-scheduling-discovery\validate-ambiguity-log.ps1

.\scripts\m19\service-scheduling-discovery\validate-scenario-traceability.ps1

.\scripts\m19\service-scheduling-discovery\validate-model-code-language.ps1

.\scripts\m19\service-scheduling-discovery\run-ddd-foundations-tests.ps1

.\scripts\m19\service-scheduling-discovery\collect-ddd-foundations-evidence.ps1

.\scripts\m19\service-scheduling-discovery\verify-ddd-foundations-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 55. Encerrar o laboratório

Confirme:

- glossário revisado;
- regras rastreáveis;
- exemplos concretos;
- contraexemplos;
- ambiguidades registradas;
- perguntas abertas com owner;
- código alinhado à linguagem;
- nenhum dado sensível;
- nenhum padrão tático antecipado;
- nenhum mapa estratégico completo antecipado;
- reports sanitizados.

---

## Entendendo o que foi feito

### O domínio ganhou prioridade

Tecnologia deixou de ser o ponto de partida.

### A linguagem ganhou definição

Termos deixaram de depender de interpretação individual.

### As conversas ganharam estrutura

Perguntas, exemplos e contraexemplos passaram a produzir conhecimento verificável.

### As regras ganharam origem

Decisões deixaram de ser inventadas no código.

### As ambiguidades ganharam visibilidade

Divergências deixaram de ser resolvidas silenciosamente por desenvolvedores.

### Os cenários ganharam rastreabilidade

Regras passaram a aparecer em exemplos e testes.

### O código ganhou feedback

Classes e métodos passaram a validar a qualidade da linguagem.

### O modelo ganhou caráter evolutivo

O diagrama deixou de ser tratado como verdade final.

### As perguntas abertas ganharam valor

Incerteza explícita passou a ser melhor do que certeza falsa.

### A próxima aula ganhou fronteira

DDD estratégico fica para a aula 618.

---

## Erros comuns importantes

### Começar pelo banco

Tabelas passam a definir o domínio.

### Começar pelo framework

Annotations substituem conceitos.

### Tratar toda fala como regra

Especialistas também usam atalhos e ambiguidades.

### Usar apenas happy path

Exceções importantes permanecem ocultas.

### Escolher termos técnicos

A linguagem se afasta do negócio.

### Ignorar sinônimos

Conceitos diferentes podem ser misturados.

### Resolver ambiguidade sozinho

O código passa a impor uma decisão não validada.

### Transformar todo substantivo em classe

O modelo fica artificial.

### Tratar o primeiro diagrama como definitivo

O aprendizado para.

### Antecipar padrões estratégicos e táticos

A descoberta é substituída por catálogo.

---

## Comandos úteis

### Validar glossário

```powershell
.\scripts\m19\service-scheduling-discovery\validate-domain-glossary.ps1
```

### Validar regras

```powershell
.\scripts\m19\service-scheduling-discovery\validate-rule-catalog.ps1
```

### Validar rastreabilidade

```powershell
.\scripts\m19\service-scheduling-discovery\validate-scenario-traceability.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-discovery\run-ddd-foundations-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-discovery\verify-ddd-foundations-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Briefing

Separe fatos, suposições e perguntas.

### Parte 2 — Entrevista

Crie perguntas abertas e exemplos.

### Parte 3 — Glossário

Defina termos e distinções.

### Parte 4 — Regras

Registre origem, exemplo e status.

### Parte 5 — Contraexemplos

Desafie interpretações.

### Parte 6 — Ambiguidades

Registre significados conflitantes.

### Parte 7 — Cenários

Conecte regras a comportamentos.

### Parte 8 — Modelo

Crie mapa conceitual evolutivo.

### Parte 9 — Código

Valide nomes e regras simples.

### Parte 10 — Gate

Confirme rastreabilidade e perguntas abertas.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 616 e ponte para a aula 618 foram preservadas;
- o laboratório `service-scheduling-discovery` foi criado;
- briefing separa fatos, suposições e perguntas;
- roteiro de entrevista usa perguntas abertas;
- transcrição sintética contém linguagem do domínio;
- glossário possui definições, exemplos e distinções;
- sinônimos perigosos foram analisados;
- homônimos foram registrados como ambiguidades;
- catálogo de regras possui ID, fonte, exemplo, contraexemplo e status;
- restrições técnicas não foram confundidas com regras de negócio;
- cenários usam linguagem aprovada;
- contraexemplos cobrem regras críticas;
- ambiguity log possui owner e impacto;
- perguntas abertas permanecem explícitas;
- mapa de conceitos foi criado como ferramenta de conversa;
- narrativa do modelo foi criada;
- decision log registra mudanças de linguagem;
- matriz de rastreabilidade conecta regras, cenários, testes e código;
- esqueleto Java usa termos aprovados;
- código não usa sinônimos proibidos;
- ambiguidades abertas não foram implementadas silenciosamente;
- testes validam exemplos e distinções;
- nenhum dado real ou sensível foi usado;
- DDD estratégico e DDD tático não foram antecipados;
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
  labs/m19/aula-617-ddd-fundamentos/service-scheduling-discovery `
  scripts/m19/service-scheduling-discovery `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|customerPhone|realAddress|boundedContextMap|aggregateRootImplementation|valueObjectCatalog"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): consolidar fundamentos de DDD"
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
- informações operacionais reais;
- mapa estratégico completo;
- aggregates;
- catálogo tático;
- microservices.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou DDD pelos fundamentos.

Você criou:

```text
briefing;

roteiro de entrevista;

transcrição;

glossário;

catálogo de regras;

exemplos;

contraexemplos;

ambiguidades;

cenários;

mapa conceitual;

narrativa;

decision log;

rastreabilidade;

esqueleto Java;

testes de linguagem.
```

Você comprovou que DDD começa pelo conhecimento; que a linguagem precisa ser compartilhada; que exemplos concretos revelam regras; que contraexemplos desafiam interpretações; que ambiguidades não devem ser resolvidas silenciosamente; que o código pode ajudar a validar termos; e que o modelo precisa evoluir conforme o entendimento melhora.

A próxima aula será:

```text
618 - M19.08 - DDD estrategico
```

Nela, você irá analisar o domínio em partes, diferenciar tipos de subdomínio, definir bounded contexts e estudar relações entre contextos.

Nenhum mapa estratégico completo, bounded context formal ou padrão tático de aggregate, value object, repository ou domain service foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Separei fatos e suposições.
- [ ] Entrevistei com perguntas abertas.
- [ ] Criei linguagem ubíqua.
- [ ] Registrei regras e fontes.
- [ ] Criei exemplos e contraexemplos.
- [ ] Registrei ambiguidades.
- [ ] Conectei cenários e regras.
- [ ] Alinhei modelo, testes e código.

---

## Troubleshooting adicional

### Especialistas usam termos diferentes

Registre significados e contextos antes de escolher um.

### Regra não possui fonte

Mantenha como hipótese, não como verdade.

### Toda reunião muda o glossário

Isso pode indicar aprendizado; registre decisões e versões.

### O código já usa outro termo

Avalie migração e atualize testes, documentação e APIs quando apropriado.

### Existem muitos substantivos no modelo

Nem todo substantivo precisa virar classe.

### Exemplo não revela resultado

Reescreva com dado, quando e então.

### Contraexemplo parece artificial

Peça uma falha real ou caso limite ao especialista.

### Ambiguidade bloqueia implementação

Registre owner, impacto e decisão temporária explícita.

### A equipe quer desenhar bounded contexts agora

Preserve a análise estratégica para a aula 618.

### A equipe quer criar aggregates agora

Preserve os padrões táticos para a aula 619.

---

## Perguntas de revisão

1. O que é domínio?
2. O que é DDD?
3. O que é modelo de domínio?
4. Quem é especialista de domínio?
5. O que é linguagem ubíqua?
6. O que é knowledge crunching?
7. O que é complexidade essencial?
8. O que é complexidade acidental?
9. O que é regra de negócio?
10. O que é invariante?
11. Por que usar exemplos?
12. Por que usar contraexemplos?
13. O que é ambiguidade?
14. Por que registrar perguntas abertas?
15. Por que não começar pelo banco?
16. Como o código ajuda o modelo?
17. O primeiro diagrama é definitivo?
18. O que é rastreabilidade de regra?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Área de conhecimento do problema.
2. Abordagem centrada em domínio, linguagem e modelo.
3. Representação útil de conceitos e regras.
4. Pessoa com conhecimento relevante do negócio.
5. Linguagem compartilhada e precisa.
6. Exploração iterativa do conhecimento.
7. Complexidade própria do problema.
8. Complexidade criada pela solução.
9. Restrição ou decisão do negócio.
10. Condição que deve permanecer verdadeira.
11. Tornar regras concretas.
12. Desafiar interpretações.
13. Termo ou regra com múltiplos significados.
14. Evitar certeza falsa.
15. Tabelas não definem o domínio.
16. Valida nomes, regras e cenários.
17. Não; ele evolui.
18. Ligação entre fonte, regra, cenário, teste e código.
19. DDD estratégico.
20. DDD estratégico.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 617 - M19.07 - DDD fundamentos

- Iniciei os estudos de Domain-Driven Design.
- Criei o laboratório `service-scheduling-discovery`.
- Separei fatos, suposições e perguntas abertas.
- Criei roteiro de entrevista com especialistas.
- Pratiquei knowledge crunching.
- Construí um glossário de linguagem ubíqua.
- Diferenciei solicitação, janela, agendamento, confirmação e execução.
- Registrei sinônimos perigosos e homônimos.
- Criei catálogo de regras com fonte e status.
- Diferenciei regra de negócio de restrição técnica.
- Criei exemplos e contraexemplos.
- Registrei ambiguidades com owner e impacto.
- Criei cenários usando linguagem aprovada.
- Modelei conceitos sem começar pelo banco ou framework.
- Criei narrativa e decision log.
- Conectei regras, cenários, testes e código por rastreabilidade.
- Usei um esqueleto Java para validar linguagem.
- Criei reports, gate e evidence.
- Não antecipei DDD estratégico ou tático.
- Próxima aula: DDD estratégico.
```

---

## Referência técnica curta

- Domain-Driven Design.
- Domain knowledge.
- Ubiquitous Language.
- Knowledge crunching.
- Domain model.
- Business rules.
- Examples and counterexamples.
- Ambiguity management.
- Model-code alignment.
- Continuous refinement.

Regra final:

```text
os fundamentos de DDD começam pelo conhecimento do domínio, não pelo banco, framework ou catálogo de padrões: briefing separa fatos, suposições e perguntas, entrevistas usam perguntas abertas, knowledge crunching alterna definição, exemplo, contraexemplo, modelagem e validação, e a linguagem ubíqua registra termos, distinções, sinônimos proibidos e ambiguidades; regras possuem fonte, exemplo, contraexemplo e status, restrições técnicas não são promovidas automaticamente a regras de negócio, cenários tornam comportamentos concretos e perguntas abertas permanecem explícitas com owner; mapa conceitual e narrativa são ferramentas evolutivas, código e testes usam a mesma linguagem e rastreiam regras sem implementar ambiguidades silenciosamente, dados permanecem sintéticos e o gate valida glossário, regras, exemplos, cenários, modelo e alinhamento; DDD estratégico começa somente na aula 618, enquanto aggregates, value objects, repositories e demais padrões táticos permanecem reservados à aula 619.
```
