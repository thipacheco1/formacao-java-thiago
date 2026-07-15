# 653 - M19.43 - Anti patterns de microservicos

## Apresentação da aula

Na aula 652, você aprendeu a decidir com critério entre monólito modular, deployable independente e microserviço. A análise exigiu fronteira de negócio, autoridade de dados, ownership de time, deploy independente, readiness operacional, contratos, segurança, SLOs e custo distribuído.

Agora o foco muda da decisão de criar um serviço para o diagnóstico de sistemas que já foram distribuídos, mas não conquistaram autonomia real.

É possível possuir dezenas de aplicações, pipelines e repositórios e ainda operar como um único sistema rígido. Quando uma alteração pequena exige modificar vários serviços, publicar em ordem, coordenar equipes, executar scripts manuais e acompanhar uma cadeia longa de chamadas síncronas, a distribuição aumentou o custo sem reduzir o acoplamento.

Esse cenário é conhecido como monólito distribuído, mas ele não é o único problema. Outros anti-patterns aparecem quando serviços são criados por entidade, tabelas são compartilhadas, gateways concentram regras de negócio, eventos formam ciclos invisíveis, bibliotecas comuns sincronizam releases, operações atravessam vários bancos e ninguém possui ownership completo da capacidade.

A pergunta desta aula será:

```text
como detectar
que um conjunto de microserviços
está distribuído fisicamente,
mas continua acoplado
em dados, runtime, releases,
responsabilidades e operação;

e como criar
um plano de correção
baseado em evidências?
```

O laboratório será:

```text
labs/m19/aula-653-anti-patterns-microservicos/service-scheduling-distributed-diagnostics
```

Você criará um diagnóstico arquitetural de `Service Scheduling` com catálogo de serviços, grafo de dependências, mapa de dados, matriz de releases, inventário de bibliotecas compartilhadas, topologia de eventos, análise de incidentes, detectores, findings, severidades, remediation backlog, reports, evidence e gate.

O objetivo não é declarar que toda comunicação entre serviços é errada. Dependências distribuídas são inevitáveis. O problema aparece quando elas são excessivas, cíclicas, ocultas, sem owner, sem budget ou incompatíveis com a autonomia prometida.

A próxima aula será:

```text
654 - M19.44 - Transacoes distribuidas e Saga revisitada
```

Nela, você aprofundará consistência entre serviços, transações locais, compensações, orquestração, coreografia, timeouts e recuperação. Nesta aula, transações distribuídas aparecerão apenas como smell de fronteira ou coordenação, sem implementação completa de Saga.

Regra central:

```text
microserviços não eliminam acoplamento;
eles exigem que o acoplamento
seja explícito, limitado,
observável e compatível
com autonomia de dados,
deploy e operação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
651:
Strangler Fig.

652:
Microservicos com criterio.

653:
Anti patterns de microservicos.

654:
Transacoes distribuidas e Saga revisitada.

655:
Observabilidade como decisao arquitetural.
```

Na aula 652, você avaliou se uma capacidade merecia fronteira de serviço. Nesta aula, você avaliará se fronteiras existentes realmente entregam autonomia ou apenas espalham o mesmo acoplamento por rede, bancos, eventos, bibliotecas e pipelines.

A progressão é:

```text
decidir quando distribuir;

diagnosticar distribuição inadequada;

coordenar consistência entre fronteiras;

operar a arquitetura com observabilidade.
```

O foco será diagnóstico e remediação arquitetural. Saga, observabilidade arquitetural completa e segurança arquitetural aprofundada permanecem para as aulas seguintes.

---

## Objetivo prático

Será criada a estrutura principal:

```text
labs/m19/aula-653-anti-patterns-microservicos/service-scheduling-distributed-diagnostics
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/antipatterns
│   ├── catalog
│   ├── dependency
│   ├── data
│   ├── release
│   ├── event
│   ├── diagnostic
│   ├── remediation
│   └── application
├── src/test/java/br/com/formacao/antipatterns
│   ├── dependency
│   ├── data
│   ├── release
│   ├── event
│   ├── diagnostic
│   └── architecture
├── diagnostics
│   ├── DIAGNOSTIC_CHARTER.md
│   ├── SERVICE_CATALOG.md
│   ├── ANTI_PATTERN_CATALOG.md
│   ├── DEPENDENCY_MAP.md
│   ├── DATA_OWNERSHIP_MAP.md
│   ├── RELEASE_COUPLING.md
│   ├── SYNCHRONOUS_CALL_BUDGET.md
│   ├── EVENT_TOPOLOGY.md
│   ├── SHARED_LIBRARY_INVENTORY.md
│   ├── OWNERSHIP_MAP.md
│   ├── INCIDENT_CORRELATION.md
│   ├── REMEDIATION_BACKLOG.md
│   └── TARGET_BOUNDARIES.md
├── contracts
└── reports
```

Scripts:

```text
scripts/m19/service-scheduling-distributed-diagnostics
├── validate-diagnostic-contract.ps1
├── validate-service-catalog.ps1
├── validate-dependency-map.ps1
├── validate-data-ownership.ps1
├── validate-release-coupling.ps1
├── validate-synchronous-call-budget.ps1
├── validate-event-topology.ps1
├── validate-shared-libraries.ps1
├── validate-remediation-backlog.ps1
├── run-anti-pattern-tests.ps1
├── collect-anti-pattern-evidence.ps1
└── verify-anti-pattern-gate.ps1
```

---

## Conceito essencial

### Anti-pattern não é preferência estética

Um anti-pattern é uma solução recorrente que parece conveniente, mas produz consequências negativas previsíveis no contexto em que é aplicada. O diagnóstico precisa demonstrar sintomas, evidências, impacto e causa provável.

Não classifique uma arquitetura apenas porque ela não segue uma moda. Um banco compartilhado durante uma migração controlada, por exemplo, pode ser uma transição aceita. Ele se torna problema quando não possui autoridade, prazo de remoção, compatibilidade, owner ou proteção contra writes cruzados.

### Distribuição física não garante autonomia

Serviços autônomos precisam conseguir evoluir, publicar, escalar, falhar e recuperar com coordenação limitada. Se todos dependem do mesmo banco, da mesma biblioteca, da mesma janela de deploy ou de uma sequência síncrona longa, a autonomia é apenas nominal.

### O diagnóstico usa múltiplas dimensões

A arquitetura será avaliada em:

```text
fronteira de negócio;
responsabilidade;
dados;
runtime;
release;
contratos;
eventos;
bibliotecas;
time;
operação;
incidentes.
```

Um único indicador não basta. Muitos serviços pequenos não provam nanosserviços; muitas chamadas não provam chatty communication; releases simultâneos não provam lockstep se forem independentes. A evidência precisa mostrar recorrência e consequência.

### Remediação não significa reescrita

A correção pode unir serviços, mover regras para o owner correto, definir autoridade, substituir cadeia síncrona por read model, versionar contrato, remover write cruzado, quebrar ciclo, modularizar internamente ou adiar extração.

A melhor remediação costuma reduzir dependências antes de adicionar infraestrutura.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-653-anti-patterns-microservicos/service-scheduling-distributed-diagnostics

Set-Location `
  labs/m19/aula-653-anti-patterns-microservicos/service-scheduling-distributed-diagnostics
```

---

### 2. Criar Diagnostic Charter

Arquivo:

```text
diagnostics/DIAGNOSTIC_CHARTER.md
```

Registre:

```text
Contexto:
Service Scheduling.

Objetivo:
detectar acoplamentos que impedem autonomia.

Dimensões:
business, data, runtime, release,
event, library, team e operation.

Princípio:
nenhum finding sem evidência.

Saída:
findings priorizados,
remediation backlog,
exit criteria e gate.
```

O charter impede que o exercício vire opinião sobre preferências de arquitetura.

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/anti-pattern-diagnostic-contract.yaml
```

Conteúdo:

```yaml
antiPatternDiagnostic:
  context:
    Service-Scheduling

  required:
    - service-catalog
    - business-capability-map
    - dependency-graph
    - data-authority-map
    - release-history
    - synchronous-call-budget
    - event-topology
    - shared-library-inventory
    - team-ownership
    - incident-correlation
    - evidence-per-finding
    - remediation-backlog
    - exit-criteria
    - tests
    - gate

  forbidden:
    - finding-without-evidence
    - service-count-as-only-signal
    - shared-database-without-owner
    - hidden-cross-service-write
    - cyclic-critical-path
    - indefinite-coordinated-release
    - gateway-as-business-monolith
    - automatic-big-bang-rewrite
    - saga-deep-dive

  nextLesson:
    code:
      M19.44
```

---

### 4. Inventariar o landscape

O cenário terá:

```text
appointment-api;
customer-schedule-service;
capacity-service;
technician-service;
notification-service;
pricing-service;
service-catalog-service;
operations-dashboard;
scheduling-gateway.
```

Não assuma que o nome revela a responsabilidade real. O catálogo precisa registrar capacidade, owner, dados, deploy, dependências, SLO e on-call.

---

### 5. Criar Service Descriptor

```java
public record ServiceDescriptor(
        ServiceId id,
        String name,
        BusinessCapability capability,
        TeamOwner owner,
        DeploymentUnit deployment,
        Set<String> ownedData,
        Set<String> publicContracts,
        boolean hasOnCall) {

    public ServiceDescriptor {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(capability);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(deployment);
        ownedData = Set.copyOf(ownedData);
        publicContracts = Set.copyOf(publicContracts);
    }
}
```

O catálogo deve permitir responder quem muda, quem publica, quem autoriza e quem atende incidente.

---

### 6. Criar service catalog policy

Arquivo:

```text
contracts/service-catalog-policy.yaml
```

Conteúdo:

```yaml
serviceCatalog:
  eachServiceRequires:
    - business-capability
    - engineering-owner
    - product-owner
    - data-authority
    - deployment-unit
    - public-contracts
    - SLO
    - on-call

  unknownOwner:
    action:
      FAIL

  capabilityDefinedOnlyByEntityName:
    action:
      REVIEW
```

---

### 7. Anti-pattern: serviço por entidade

Separar `CustomerService`, `AppointmentService`, `AddressService` e `StatusService` apenas porque existem entidades produz chamadas para reconstruir um caso de uso que deveria estar coeso.

O diagnóstico precisa perguntar:

```text
qual capacidade de negócio o serviço entrega?
qual decisão ele possui?
qual invariante ele protege?
quem usa seu dado semântico?
```

Se a única resposta for “ele gerencia a tabela X”, existe sinal de decomposição orientada à persistência.

---

### 8. Criar Entity Service detector

```java
public final class EntityServiceDetector {

    public Optional<DiagnosticFinding> detect(
            ServiceDescriptor service,
            ServiceMetrics metrics) {

        boolean entityNamed =
                service.capability().isEntityOnly();

        boolean noDecisionOwnership =
                metrics.ownedBusinessDecisions() == 0;

        boolean mostlyCrud =
                metrics.crudEndpointRatio() >= 0.85;

        if (entityNamed
                && noDecisionOwnership
                && mostlyCrud) {
            return Optional.of(
                    DiagnosticFinding.entityService(
                            service.id(),
                            metrics.evidence()));
        }

        return Optional.empty();
    }
}
```

O detector combina sinais. Nome isolado não basta.

---

### 9. Anti-pattern: nanosserviço

Nanosserviço é uma fronteira tão pequena que seu custo de rede, deploy, operação, contrato e ownership supera o valor da autonomia.

Sinais:

```text
uma única operação trivial;
nenhuma decisão própria;
mesmo time e mesmo ciclo de mudança;
chamada obrigatória em todos os fluxos;
SLO impossível de isolar;
incidentes sempre correlacionados;
nenhuma escala independente real.
```

A correção pode ser unir serviços ou transformar a fronteira em módulo interno.

---

### 10. Criar Dependency Edge

```java
public record DependencyEdge(
        ServiceId source,
        ServiceId target,
        DependencyType type,
        boolean synchronous,
        boolean criticalPath,
        Duration timeout,
        int callsPerRequest,
        String contract) {

    public DependencyEdge {
        Objects.requireNonNull(source);
        Objects.requireNonNull(target);
        Objects.requireNonNull(type);
        Objects.requireNonNull(contract);

        if (callsPerRequest < 1) {
            throw new IllegalArgumentException(
                    "callsPerRequest must be positive");
        }
    }
}
```

Tipos incluem HTTP, gRPC, database, event, library, cache e file.

---

### 11. Construir o grafo de dependências

Arquivo:

```text
diagnostics/DEPENDENCY_MAP.md
```

Registre direção, tipo, sincronia, criticidade, volume, timeout, fallback, owner e contract version.

Um desenho informal ajuda, mas o diagnóstico precisa de dados analisáveis.

---

### 12. Criar Dependency Graph

Implemente um grafo com `nodes`, `edges`, busca de dependências de saída, filtros de critical path e consultas de fan-in e fan-out. O grafo será a fonte para ciclos, profundidade e blast radius.

---

### 13. Anti-pattern: dependências cíclicas

Ciclo ocorre quando A depende de B, B depende de C e C volta a depender de A. O ciclo pode estar em runtime, eventos, dados ou releases.

Consequências:

```text
ordem de inicialização;
falhas em cascata;
contratos difíceis de mudar;
releases coordenados;
ownership confuso;
recuperação sem ponto claro.
```

---

### 14. Criar Cycle Detector

Implemente depth-first search com conjuntos `visited` e `active`. Quando um nó ativo for reencontrado, registre o caminho completo do ciclo, não apenas um booleano.

---

### 15. Anti-pattern: chatty communication

Um fluxo é chatty quando precisa de muitas chamadas pequenas e sequenciais para concluir uma única intenção.

Exemplo:

```text
GET appointment;
GET customer;
GET address;
GET product;
GET duration;
GET technician;
GET capacity;
GET price;
GET restrictions.
```

O problema não é apenas latência. Cada hop adiciona timeout, retry, autenticação, tracing, failure mode e deploy dependency.

---

### 16. Criar budget de chamadas síncronas

Arquivo:

```text
diagnostics/SYNCHRONOUS_CALL_BUDGET.md
```

Defina por critical path:

```text
maximum sequential hops: 3;
maximum total synchronous calls: 6;
maximum remote budget: 700 ms;
maximum retry amplification: 1.5x;
required fallback: explicit;
```

O número é uma decisão local baseada em SLO e risco, não uma regra universal.

---

### 17. Criar Critical Path Analyzer

Calcule quantidade de hops, total de chamadas, soma de timeouts e retry amplification. Compare tudo com o SLO externo; se os budgets internos já excedem o prazo da API, a configuração é incoerente.

---

### 18. Anti-pattern: monólito distribuído

O monólito distribuído combina vários anti-patterns:

```text
serviços precisam subir juntos;
releases ocorrem em lockstep;
dados são compartilhados;
chamadas são cíclicas;
contratos mudam de forma coordenada;
incidentes atravessam todos os componentes;
ninguém consegue alterar uma capacidade isoladamente.
```

Não use o termo como insulto. Demonstre as dimensões de acoplamento.

---

### 19. Medir autonomia de mudança

Para cada alteração dos últimos 90 dias, registre:

```text
quantos repositórios mudaram;
quantos pipelines executaram;
quantos serviços foram publicados;
quantos times participaram;
se houve ordem obrigatória;
se existiu compatibility window;
se rollback foi independente.
```

Esses dados revelam release coupling real.

---

### 20. Criar Release Record

Registre change ID, data, serviços alterados, ordem de publicação, times participantes, rollback independente e uso de compatibility window.

---

### 21. Anti-pattern: release lockstep

Existe lockstep quando uma mudança exige versões específicas publicadas em ordem e rollback coordenado.

Uma publicação simultânea ocasional não caracteriza o anti-pattern. O finding exige recorrência, ausência de compatibilidade e impacto na lead time ou taxa de falha.

---

### 22. Criar Release Coupling Analyzer

Calcule a proporção de mudanças com vários serviços, ordem obrigatória, ausência de compatibility window ou rollback conjunto. Defina threshold e tendência, não apenas fotografia.

---

### 23. Anti-pattern: banco compartilhado

Banco compartilhado não é apenas dois serviços no mesmo cluster. O problema central é autoridade e acesso.

Sinais graves:

```text
serviço A escreve tabela de B;
queries fazem join entre schemas de owners diferentes;
migration exige coordenar vários serviços;
constraints representam regras sem owner;
credenciais permitem acesso amplo;
rollback de schema depende de todos.
```

---

### 24. Criar Data Asset e Authority

Modele nome, storage, authority, readers, writers e classificação. O ativo deve representar tabela, topic, cache, índice ou documento relevante.

---

### 25. Criar Data Ownership Map

Arquivo:

```text
diagnostics/DATA_OWNERSHIP_MAP.md
```

Para cada tabela, topic, cache e documento, registre authority, readers, writers, migration owner, retention, classificação e export contract.

---

### 26. Criar Shared Database Detector

Gere finding para ativos com múltiplos writers ou writer diferente da authority. Leitura compartilhada também exige contrato, mas writes cruzados são o risco prioritário.

---

### 27. Anti-pattern: transação distribuída ocultada

O fluxo parece simples, mas só é considerado sucesso se vários serviços e bancos confirmarem:

```text
criar Appointment;
reservar Capacity;
calcular Price;
criar Technician Assignment;
agendar Notification.
```

Se o código usa cadeia síncrona, rollback manual e retries cegos para simular uma única transação, existe smell de fronteira ou coordenação distribuída.

Nesta aula, apenas registre o finding. Saga, compensações e estados intermediários serão aprofundados na aula 654.

---

### 28. Anti-pattern: gateway com regra de negócio

API Gateway deve aplicar preocupações de borda, como roteamento, autenticação, rate limit e observabilidade. Quando ele decide transições, combina entidades, escreve bancos ou contém regras de capacidade, torna-se um monólito central.

Sinais:

```text
branches por status de domínio;
queries diretas ao banco;
transações de negócio;
workflow de confirmação;
transformações semânticas extensas;
release obrigatório para toda mudança.
```

---

### 29. Criar Gateway detector

```java
public final class GatewayBusinessLogicDetector {

    public Optional<DiagnosticFinding> detect(
            ComponentMetrics gateway) {

        boolean ownsDomainRules =
                gateway.domainRuleCount() > 0;

        boolean writesBusinessData =
                gateway.businessWriteCount() > 0;

        boolean changesFrequently =
                gateway.monthlyChangeCount() > 20;

        if (ownsDomainRules || writesBusinessData) {
            return Optional.of(
                    DiagnosticFinding.gatewayBusinessLogic(
                            gateway.name(),
                            gateway.evidence(),
                            changesFrequently));
        }

        return Optional.empty();
    }
}
```

---

### 30. Anti-pattern: biblioteca compartilhada como acoplamento

Bibliotecas podem padronizar logging, tracing e segurança. O problema aparece quando uma biblioteca contém modelo de domínio, DTOs de vários serviços, regras de negócio ou clientes que obrigam atualização simultânea.

Sinais:

```text
uma release atualiza sete serviços;
versões antigas deixam de funcionar;
contratos são publicados apenas como classes Java;
consumers não testam compatibilidade;
serviços compartilham entidades JPA.
```

---

### 31. Criar Shared Library Inventory

Arquivo:

```text
diagnostics/SHARED_LIBRARY_INVENTORY.md
```

Registre owner, propósito, dependentes, semantic version, compatibilidade, conteúdo de domínio, release frequency e blast radius.

---

### 32. Medir blast radius de biblioteca

```java
public record SharedLibraryUsage(
        String library,
        String version,
        Set<ServiceId> consumers,
        boolean containsDomainModel,
        boolean backwardCompatible) {
}
```

Um finding crítico pode exigir domínio compartilhado, incompatibilidade e muitos consumidores.

---

### 33. Anti-pattern: event-driven spaghetti

Eventos reduzem dependência temporal, mas podem esconder dependência semântica.

Sinais:

```text
eventos sem owner;
consumers desconhecidos;
nomes genéricos;
cycles de reação;
side effects duplicados;
ordem implícita;
contrato sem versão;
falhas sem observabilidade;
comandos disfarçados de eventos.
```

---

### 34. Criar Event Contract

Modele nome, versão, producer, consumers, classificação como fato ou comando, schema e modo de compatibilidade.

---

### 35. Criar Event Topology

Arquivo:

```text
diagnostics/EVENT_TOPOLOGY.md
```

Mapeie producer, topic, event, version, consumers, side effects, ordering key, retry, dead letter, owner e retention.

---

### 36. Detectar ciclos de eventos

Exemplo perigoso:

```text
AppointmentScheduled
-> CapacityAdjusted
-> ScheduleRecalculated
-> AppointmentUpdated
-> CapacityAdjusted.
```

Nem todo ciclo lógico é inválido, mas ele precisa de condição de término, idempotência, observabilidade e owner. Ciclo sem limite pode gerar tempestade.

---

### 37. Anti-pattern: comando disfarçado de evento

`PleaseSendConfirmationEmail` não descreve um fato; ele ordena que um consumer específico execute uma ação.

Comandos assíncronos são válidos, mas precisam ser nomeados e tratados como comandos. Disfarçá-los de evento cria falsa autonomia e ownership confuso.

Compare:

```text
AppointmentConfirmed:
fato publicado pelo owner.

SendAppointmentConfirmation:
comando direcionado a uma capacidade.
```

---

### 38. Anti-pattern: duplicação sem autoridade

Duplicar dados para leitura local é comum em sistemas distribuídos. O problema aparece quando não se sabe qual cópia é autoridade, qual é projeção, como atualizar, qual staleness é aceito e como reconciliar.

A aula 634 já definiu fonte autoritativa, convergência e repair. Reutilize essas regras.

---

### 39. Anti-pattern: ownership fragmentado

Um serviço pode ter repositório e pipeline próprios, mas depender de cinco equipes para alterar contrato, dados, segurança e operação.

Autonomia exige ownership suficiente para decidir, implementar, publicar, observar e recuperar.

---

### 40. Criar Ownership Map

Arquivo:

```text
diagnostics/OWNERSHIP_MAP.md
```

Para cada serviço, registre:

```text
product owner;
engineering owner;
data owner;
security owner;
on-call;
SLO owner;
contract owner;
incident commander;
deprecation owner.
```

Owner desconhecido é finding, não detalhe administrativo.

---

### 41. Correlacionar incidentes

Arquivo:

```text
diagnostics/INCIDENT_CORRELATION.md
```

Analise incidentes dos últimos meses:

```text
quais serviços falharam juntos;
qual dependência iniciou a cascata;
quantos serviços precisaram de rollback;
qual dado ficou inconsistente;
quantos times foram acionados;
qual critical path foi afetado.
```

Incidentes revelam dependências que diagramas não mostram.

---

### 42. Criar Diagnostic Evidence

Modele source, metric, observed value, threshold, collected at e referência sanitizada. Não armazene payloads, credenciais ou topologia sensível.

---

### 43. Criar Diagnostic Finding

```java
public record DiagnosticFinding(
        String id,
        AntiPatternCode code,
        FindingSeverity severity,
        Set<ServiceId> affectedServices,
        List<DiagnosticEvidence> evidence,
        String impact,
        String probableCause,
        String recommendation,
        TeamOwner owner) {

    public DiagnosticFinding {
        affectedServices = Set.copyOf(affectedServices);
        evidence = List.copyOf(evidence);

        if (evidence.isEmpty()) {
            throw new IllegalArgumentException(
                    "Finding requires evidence");
        }
    }
}
```

---

### 44. Definir severidade

Use critérios explícitos:

```text
CRITICAL:
risco de integridade, segurança,
indisponibilidade ampla
ou impossibilidade de recuperação.

HIGH:
bloqueia autonomia,
aumenta falha em cascata
ou exige releases coordenados frequentes.

MEDIUM:
aumenta custo e lead time,
mas possui mitigação operacional.

LOW:
sinal local com impacto limitado.
```

---

### 45. Criar Anti-pattern Catalog

Arquivo:

```text
diagnostics/ANTI_PATTERN_CATALOG.md
```

Inclua pelo menos:

```text
ENTITY_SERVICE;
NANO_SERVICE;
DISTRIBUTED_MONOLITH;
SHARED_DATABASE;
CROSS_SERVICE_WRITE;
CHATTY_COMMUNICATION;
CYCLIC_DEPENDENCY;
RELEASE_LOCKSTEP;
GATEWAY_BUSINESS_LOGIC;
SHARED_DOMAIN_LIBRARY;
EVENT_DRIVEN_SPAGHETTI;
COMMAND_DISGUISED_AS_EVENT;
UNKNOWN_DATA_AUTHORITY;
FRAGMENTED_OWNERSHIP;
OPERATIONAL_ORPHAN;
HIDDEN_DISTRIBUTED_TRANSACTION.
```

Cada definição contém sintomas, evidências mínimas, falsos positivos, impacto e remediações possíveis.

---

### 46. Criar Diagnostic Engine

```java
public final class DiagnosticEngine {

    private final List<ArchitectureDetector> detectors;

    public DiagnosticSummary scan(
            ArchitectureSnapshot snapshot) {

        List<DiagnosticFinding> findings =
                detectors.stream()
                        .flatMap(detector ->
                                detector.detect(snapshot).stream())
                        .sorted(Comparator.comparing(
                                DiagnosticFinding::severity))
                        .toList();

        return DiagnosticSummary.from(findings);
    }
}
```

A ordenação final também considera impacto, recorrência, critical path e reversibilidade.

---

### 47. Evitar falsos positivos

Antes de confirmar um finding, verifique:

```text
é estado transitório documentado?
existe prazo de remoção?
existe owner?
há compatibility window?
o risco está mitigado?
a ocorrência é isolada ou recorrente?
a métrica está normalizada por volume?
```

Arquitetura madura aceita transições, mas não aceita transições eternas.

---

### 48. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  findingWithoutEvidence:
    action:
      FAIL

  unknownServiceOwner:
    action:
      FAIL

  multipleWritersWithoutAuthority:
    action:
      FAIL

  criticalCycleWithoutMitigation:
    action:
      FAIL

  indefiniteSharedDatabaseTransition:
    action:
      FAIL

  remediationWithoutExitCriterion:
    action:
      FAIL
```

---

### 49. Projetar remediações incrementais

Exemplos:

```text
Entity Service:
reagrupar por capacidade.

Chatty Communication:
criar endpoint coeso,
read model ou composição local.

Shared Database:
definir authority,
remover writes cruzados,
publicar contrato de dados.

Release Lockstep:
introduzir compatibilidade backward,
expand-contract e consumer tests.

Cyclic Dependency:
inverter dependência,
introduzir owner ou projection.
```

---

### 50. Criar Remediation Action

Modele ID, finding, descrição, prioridade, owner, pré-requisitos, target date, rollback e exit criteria obrigatórios.

---

### 51. Priorizar pelo risco e pelo efeito sistêmico

A prioridade considera:

```text
integridade;
segurança;
critical path;
frequência;
blast radius;
lead time;
incident correlation;
reversibilidade;
custo de coexistência;
valor desbloqueado.
```

Nem sempre o anti-pattern mais visível é o mais urgente.

---

### 52. Criar Remediation Backlog

Arquivo:

```text
diagnostics/REMEDIATION_BACKLOG.md
```

Organize em ondas:

```text
Wave 0:
proteções e observabilidade.

Wave 1:
autoridade e writes cruzados.

Wave 2:
ciclos e critical paths.

Wave 3:
compatibilidade e releases.

Wave 4:
consolidação ou extração de fronteiras.

Wave 5:
retirada de transições.
```

---

### 53. Definir Target Boundaries

Arquivo:

```text
diagnostics/TARGET_BOUNDARIES.md
```

Para o cenário, uma recomendação plausível é:

```text
Appointment Lifecycle:
owner de comandos e estado.

Scheduling Read Model:
consultas operacionais.

Capacity:
autoridade de reservas.

Customer Communication:
efeitos de comunicação.

Gateway:
somente preocupações de borda.
```

A decisão final depende das evidências do laboratório.

---

### 54. Não criar um “serviço corretor” central

Uma reação comum é adicionar um novo orquestrador que conhece todos os serviços. Isso pode apenas mover o monólito distribuído para outro componente.

Antes de criar coordenação central, defina fronteiras, autoridade e estados. A aula 654 mostrará quando uma Saga é necessária e como evitar um orquestrador onisciente.

---

### 55. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  incompleteCatalog:
    action:
      INCONCLUSIVE

  missingReleaseHistory:
    action:
      INCONCLUSIVE

  crossServiceWriteDetected:
    action:
      CRITICAL_FINDING

  criticalDependencyCycle:
    action:
      HIGH_FINDING

  evidenceCollectionFailure:
    action:
      DO_NOT_GUESS

  sagaDeepDive:
    deferredToLesson654

  observabilityArchitectureDeepDive:
    deferredToLesson655
```

---

### 56. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson654:
    forbidden:
      - full-saga-orchestrator
      - full-saga-choreography
      - compensation-state-machine
      - transactional-step-log
      - saga-timeout-recovery

  lesson655:
    forbidden:
      - enterprise-observability-architecture
      - telemetry-platform-selection
      - full-SLO-governance

  allowed:
    - distributed-transaction-smell
    - missing-telemetry-finding
    - incident-correlation
    - dependency-map
```

---

### 57. Testar serviço por entidade

Cenário:

```text
Status Service;
Address Service;
Appointment Service;
Customer Service.
```

Valide:

- capability definida apenas por entidade;
- CRUD ratio alto;
- zero decisões próprias;
- fluxo precisa de múltiplos serviços;
- detector gera finding com evidências.

---

### 58. Testar nanosserviço

Valide um serviço com uma operação trivial, mesmo owner, mesmo release e nenhuma escala independente. O detector recomenda merge ou internal module, mas não executa alteração automática.

---

### 59. Testar dependência cíclica

Crie:

```text
appointment-api
-> capacity-service
-> pricing-service
-> appointment-api.
```

O teste deve retornar o caminho completo e marcar severidade maior quando o ciclo pertence ao critical path.

---

### 60. Testar chatty communication

Simule oito chamadas sequenciais e budget externo de 900 ms.

Valide:

- hops acima do limite;
- soma de timeouts incoerente;
- retry amplification;
- dependências sem fallback;
- finding com proposta de read model ou operação coesa.

---

### 61. Testar shared database

Crie um ativo `appointment` com writers `appointment-api`, `customer-schedule-service` e `operations-dashboard`.

O teste precisa falhar por múltiplos writers e ausência de authority única.

---

### 62. Testar release lockstep

Use histórico de dez mudanças, das quais sete exigiram três serviços, ordem fixa e rollback conjunto.

Valide ratio, tendência e impacto no lead time.

---

### 63. Testar gateway com regra

Confirme que o gateway contém transição de status e write de negócio. O detector deve gerar finding mesmo se o gateway possui alta disponibilidade.

---

### 64. Testar shared library blast radius

Uma versão incompatível de `scheduling-domain-shared` exige atualizar seis serviços. Valide domínio compartilhado, ausência de backward compatibility e alto blast radius.

---

### 65. Testar event cycle

Modele um ciclo de quatro eventos sem condição de término. O detector deve registrar producers, consumers, side effects e ausência de owner.

---

### 66. Testar ownership fragmentado

Um serviço possui pipeline, mas não possui data owner, on-call nem authority de contrato. O gate não deve considerá-lo autônomo.

---

### 67. Testar finding sem evidência

```java
assertThrows(
        IllegalArgumentException.class,
        () -> new DiagnosticFinding(
                "F-001",
                AntiPatternCode.DISTRIBUTED_MONOLITH,
                FindingSeverity.HIGH,
                Set.of(ServiceId.of("appointment-api")),
                List.of(),
                "High release coupling",
                "Unknown",
                "Investigate",
                TeamOwner.of("scheduling")));
```

---

### 68. Criar Architecture Test

```java
@ArchTest
static final ArchRule diagnosticCodeMustNotDependOnBusinessServices =
        noClasses()
                .that()
                .resideInAPackage("..diagnostic..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..appointment..",
                        "..capacity..",
                        "..pricing..");
```

O scanner analisa metadados e snapshots, não importa domínios de produção.

---

### 69. Validar catálogo

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-service-catalog.ps1
```

Valide capability, owner, data authority, deploy, contratos, SLO e on-call.

---

### 70. Validar dependências

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-dependency-map.ps1
```

Valide edges, tipos, cycles, critical paths, fan-in, fan-out e budgets.

---

### 71. Validar dados

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-data-ownership.ps1
```

Valide authority, readers, writers, cross-service writes, migrations e transições.

---

### 72. Validar releases

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-release-coupling.ps1
```

Valide histórico, lockstep ratio, ordem obrigatória, rollback e compatibility windows.

---

### 73. Validar chamadas síncronas

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-synchronous-call-budget.ps1
```

Valide hops, total de chamadas, timeouts, retries, fallbacks e SLO externo.

---

### 74. Validar eventos

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-event-topology.ps1
```

Valide producer, owner, version, consumers, side effects, cycles, retry e dead letter.

---

### 75. Validar bibliotecas

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-shared-libraries.ps1
```

Valide conteúdo de domínio, compatibilidade, dependentes, release e blast radius.

---

### 76. Executar testes

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\run-anti-pattern-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide catálogo, dependências, dados, releases, eventos, ownership, detectores, remediação e arquitetura.

---

### 77. Criar Reports

Exemplo:

```yaml
antiPatternDiagnostic:
  services:
    9

  dependencyEdges:
    31

  criticalCycles:
    2

  sharedWriteAssets:
    3

  coordinatedReleaseRatio:
    0.70

  criticalPathSequentialHops:
    7

  eventCycles:
    1

  findings:
    critical:
      2
    high:
      5
    medium:
      6
    low:
      2

  remediationActions:
    12

  result:
    FAIL_CRITICAL_COUPLING
```

---

### 78. Criar Gate

O gate valida charter, catálogo, dependencies, cycles, dados, releases, calls, events, libraries, ownership, incidents, findings, evidence, remediation, tests, arquitetura e documentação.

Status:

```text
PASS;

PASS_WITH_MANAGED_TRANSITIONS;

FAIL_INCOMPLETE_CATALOG;

FAIL_UNKNOWN_OWNERSHIP;

FAIL_CRITICAL_CYCLE;

FAIL_SHARED_WRITE;

FAIL_RELEASE_LOCKSTEP;

FAIL_SYNCHRONOUS_BUDGET;

FAIL_EVENT_TOPOLOGY;

FAIL_EVIDENCE;

FAIL_REMEDIATION;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 79. Coletar Evidence

Arquivo:

```text
contracts/anti-pattern-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- service count;
- dependency edge count;
- cycle count;
- shared write asset count;
- coordinated release ratio;
- synchronous hop count;
- event cycle count;
- unknown owner count;
- finding counts by severity;
- remediation action count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- credenciais;
- tokens;
- endpoints privados;
- nomes reais de clientes;
- topologia de produção;
- payloads reais;
- custos contratuais;
- implementação completa de Saga.

---

### 80. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-diagnostic-contract.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-service-catalog.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-dependency-map.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-data-ownership.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-release-coupling.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-synchronous-call-budget.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-event-topology.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-shared-libraries.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\validate-remediation-backlog.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\run-anti-pattern-tests.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\collect-anti-pattern-evidence.ps1

.\scripts\m19\service-scheduling-distributed-diagnostics\verify-anti-pattern-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 81. Encerrar o laboratório

Confirme:

- catálogo de serviços completo;
- capability e owner por serviço;
- dependências tipadas;
- cycles detectados;
- critical paths medidos;
- budget síncrono definido;
- data authority explícita;
- múltiplos writers identificados;
- release coupling medido;
- gateway sem regra oculta;
- bibliotecas compartilhadas inventariadas;
- event topology mapeada;
- cycles e commands disfarçados detectados;
- ownership operacional validado;
- incidentes correlacionados;
- findings com evidências;
- falsos positivos revisados;
- remediation backlog priorizado;
- exit criteria por ação;
- transições com prazo;
- reports sanitizados;
- Saga não aprofundada;
- observabilidade arquitetural completa não antecipada.

---

## Entendendo o que foi feito

### O landscape ganhou uma fonte de verdade

Serviços deixaram de ser apenas nomes em diagramas. Cada unidade passou a ter capability, owner, dados, deploy, contratos, SLO e on-call.

### O acoplamento ficou mensurável

O laboratório transformou dependências em edges, cycles, fan-in, fan-out, critical paths, synchronous budgets e release coupling.

### Dados e eventos ganharam autoridade

Tabelas, caches, topics e projeções passaram a possuir owner, readers, writers, contratos e estratégia de compatibilidade.

### Anti-patterns ganharam evidência

Cada finding exige sinais concretos, impacto, provável causa, severidade, owner e recomendação. Preferência pessoal não passa no gate.

### A correção ganhou roadmap

Remediações foram divididas em ondas, com prioridade, pré-requisitos, rollback, target date e exit criteria. A solução não depende de uma reescrita total.

---

## Erros comuns importantes

### Chamar qualquer arquitetura distribuída de monólito distribuído

Sem evidência, o termo perde valor. Meça dados, releases, runtime, ownership e incidentes.

### Usar número de serviços como métrica principal

Poucos serviços podem estar fortemente acoplados; muitos podem ser autônomos. Quantidade não substitui análise.

### Tratar banco compartilhado como problema apenas físico

Mesmo cluster pode possuir schemas e authorities separados. O problema crítico é write cruzado, ownership e evolução coordenada.

### Substituir chamadas síncronas por eventos sem mudar fronteiras

Isso pode criar event-driven spaghetti. Primeiro corrija responsabilidade e autoridade.

### Criar um orquestrador para resolver todo acoplamento

Um componente central onisciente pode se tornar novo monólito. Coordenação distribuída exige escopo e estados explícitos.

### Confirmar finding sem contexto de transição

Uma migração com owner, prazo e gate pode ser aceitável. Transição indefinida é o problema.

### Corrigir tudo com novos microserviços

Alguns anti-patterns são resolvidos por consolidação, modularização e remoção de fronteiras artificiais.

### Antecipar Saga

Esta aula detecta transações distribuídas ocultas. A implementação correta de Saga fica para a aula 654.

---

## Comandos úteis

### Validar dependências

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-dependency-map.ps1
```

### Validar dados

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-data-ownership.ps1
```

### Validar releases

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\validate-release-coupling.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\run-anti-pattern-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-distributed-diagnostics\verify-anti-pattern-gate.ps1
```

---

## Exercício guiado

Modele o landscape de `Service Scheduling`, registre capabilities, owners, dados, contratos e deploys, construa o grafo de dependências, detecte ciclos, meça critical paths, analise histórico de releases, identifique múltiplos writers, mapeie eventos e bibliotecas, correlacione incidentes, produza findings com evidências e monte um remediation backlog incremental.

---

## Critérios de aceite

- arquivo, H1, número, módulo e título seguem a grade oficial;
- continuidade com a aula 652 e ponte para a 654 foram preservadas;
- laboratório, charter e contrato de diagnóstico foram criados;
- catálogo registra capability, owners, dados, deploy, contratos, SLO e on-call;
- serviços por entidade e nanosserviços usam múltiplos sinais;
- grafo possui edges tipadas, cycles, fan-in, fan-out e critical paths;
- synchronous call budget e chatty communication foram avaliados;
- monólito distribuído foi analisado em dados, runtime, release e ownership;
- histórico de releases mede lockstep, ordem e rollback;
- Data Ownership Map identifica authority, readers, writers e transições;
- shared writes e transações distribuídas ocultas geram findings;
- gateway, bibliotecas, cache, sessão e filesystem compartilhados foram avaliados;
- Event Topology registra producers, consumers, versões, effects e cycles;
- comandos foram diferenciados de eventos;
- ownership operacional e correlação de incidentes foram validados;
- Anti-pattern Catalog define sintomas, evidências, falsos positivos e impacto;
- todo finding possui evidência, severidade, owner e recomendação;
- transições somente são aceitas com prazo e exit criterion;
- Remediation Backlog possui ondas, prioridades, rollback e critérios de saída;
- big bang rewrite não foi usado como resposta automática;
- scripts, testes, reports, evidence e gate foram criados;
- Saga e observabilidade arquitetural completa não foram antecipadas;
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
  labs/m19/aula-653-anti-patterns-microservicos/service-scheduling-distributed-diagnostics `
  scripts/m19/service-scheduling-distributed-diagnostics `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|productionTopology|realCustomer|contractualCost|fullSagaOrchestrator|compensationStateMachine"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): diagnosticar anti patterns de microservicos"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- endpoints privados;
- topologia real;
- dados de clientes;
- custos contratuais;
- payloads de produção;
- implementação completa de Saga.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou anti-patterns de microserviços.

Você criou Diagnostic Charter, Service Catalog, Anti-pattern Catalog, Dependency Graph, Cycle Detector, Critical Path Analyzer, Data Ownership Map, Shared Database Detector, Release Records, Release Coupling Analyzer, Synchronous Call Budget, Event Topology, Shared Library Inventory, Ownership Map, Incident Correlation, Diagnostic Evidence, Diagnostic Findings, Diagnostic Engine, Remediation Backlog, Target Boundaries, reports, evidence e gate.

Você comprovou que distribuição física não produz autonomia automaticamente; que serviços por entidade e nanosserviços podem quebrar coesão; que cycles, chatty communication e critical paths longos ampliam falhas; que shared writes e release lockstep prendem evolução; que gateways e bibliotecas podem concentrar domínio; que eventos também criam coupling; que ownership e capacidade operacional fazem parte da arquitetura; e que nenhum finding é válido sem evidência e contexto.

A próxima aula será:

```text
654 - M19.44 - Transacoes distribuidas e Saga revisitada
```

Nela, você irá aprofundar como preservar consistência de negócio quando uma operação atravessa múltiplos serviços e transações locais, usando estados explícitos, passos, compensações, timeouts, retries, orquestração ou coreografia, recuperação e observabilidade.

Observabilidade como decisão arquitetural permanece para a aula 655.

Nenhuma implementação completa de Saga foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei serviços e capabilities.
- [ ] Defini owners e authorities.
- [ ] Construí o grafo de dependências.
- [ ] Detectei cycles e critical paths.
- [ ] Medi chamadas síncronas.
- [ ] Analisei release coupling.
- [ ] Detectei shared writes.
- [ ] Mapeei eventos e bibliotecas.
- [ ] Correlacionei incidentes.
- [ ] Gere findings com evidências.
- [ ] Criei remediation backlog.
- [ ] Validei reports, evidence e gate.

## Troubleshooting adicional

### O catálogo possui muitos serviços sem capability

Revise fronteiras com linguagem de negócio. Nomes de tabela não bastam.

### O detector marca banco compartilhado durante migração

Registre owner, prazo, compatibility window e exit criterion. O gate pode aceitar transição gerenciada.

### O grafo possui muitos ciclos

Comece pelos ciclos do critical path e pelos que envolvem writes ou segurança.

### O número de chamadas parece normal, mas a latência é alta

Analise sequência, retries, fan-out, payload, timeout e saturação. Contagem isolada é insuficiente.

### Os releases são simultâneos por conveniência

Verifique se rollback e contratos são independentes. Conveniência não é lockstep obrigatório.

### A biblioteca compartilhada só possui observabilidade

Isso pode ser saudável. Avalie compatibilidade e blast radius antes de criar finding.

### Os eventos não formam ciclo técnico, mas os times se bloqueiam

Mapeie coupling de mudança e ownership. O grafo de runtime não captura tudo.

### O remediation backlog ficou grande

Priorize integridade, segurança, critical path e ações que eliminam várias dependências.

### A equipe quer reescrever tudo

Exija hipótese, custo, risco, coexistência, rollback e evidências. Prefira ondas incrementais.

### A discussão virou compensação de transações

Preserve Saga para a aula 654.

## Perguntas de revisão

1. O que caracteriza um anti-pattern?
2. Por que distribuição física não garante autonomia?
3. O que é serviço por entidade?
4. O que é nanosserviço?
5. O que é chatty communication?
6. O que é monólito distribuído?
7. O que é release lockstep?
8. Por que múltiplos writers são perigosos?
9. Quando banco compartilhado pode ser transição aceitável?
10. O que é gateway com regra de negócio?
11. Como biblioteca compartilhada cria coupling?
12. O que é event-driven spaghetti?
13. Por que comando e evento devem ser diferenciados?
14. O que é ownership fragmentado?
15. Por que finding exige evidência?
16. Como evitar falsos positivos?
17. O que deve existir em uma remediação?
18. Reescrita total é a correção padrão?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 653 - M19.43 - Anti patterns de microservicos**

- Criei o laboratório `service-scheduling-distributed-diagnostics`.
- Cataloguei serviços, capabilities, owners, dados, contratos e deploys.
- Diagnostiquei serviços por entidade, nanosserviços e monólito distribuído.
- Criei Dependency Graph, cycles, critical paths e synchronous call budget.
- Medi chatty communication e release lockstep.
- Criei Data Ownership Map e detectei shared writes.
- Registrei transações distribuídas ocultas como smell.
- Avaliei gateway, bibliotecas, cache, sessão e filesystem compartilhados.
- Criei Event Topology e detectei event cycles.
- Diferenciei eventos de comandos assíncronos.
- Correlacionei ownership, readiness e incidentes.
- Criei catálogo de anti-patterns, evidências, findings e severidades.
- Revisei falsos positivos e transições gerenciadas.
- Criei Remediation Backlog, Target Boundaries, reports, evidence e gate.
- Não antecipei Saga nem observabilidade arquitetural completa.
- Próxima aula: Transacoes distribuidas e Saga revisitada.
```

## Referência técnica curta

- Entity Service.
- Nano Service.
- Distributed Monolith.
- Shared Database.
- Cross-service Write.
- Chatty Communication.
- Cyclic Dependency.
- Release Lockstep.
- Gateway Business Logic.
- Shared Domain Library.
- Event-driven Spaghetti.
- Data Authority.
- Team Ownership.
- Remediation Backlog.

Regra final:

```text
Anti-patterns de microserviços são diagnosticados por evidências, não por rótulos. Cada serviço precisa de capability, owner, dados, contratos, deploy, SLO e on-call. Dependências formam um grafo com tipo, cycles, critical paths e budget. Data authority, release history, topologia de eventos, bibliotecas e incidentes tornam o acoplamento visível. Todo finding possui impacto, causa, severidade, owner e recomendação. Transições precisam de prazo e exit criterion, e a remediação reduz acoplamento em ondas incrementais. Saga será aprofundada na aula 654 e observabilidade arquitetural na aula 655.
```
