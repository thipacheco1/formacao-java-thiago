# 669 - M19.59 - Checklist de arquiteto Java

## Apresentação da aula

Na aula 668, você realizou uma prova prática de arquitetura.

Você recebeu um domínio novo, com:

- múltiplos canais;
- sistemas legados;
- dados sensíveis;
- picos de carga;
- requisitos de consistência;
- integrações síncronas e assíncronas;
- multi-tenancy;
- rollout progressivo;
- restrições de equipe;
- pressão de prazo.

Você precisou transformar esse cenário em uma arquitetura coerente, defensável e verificável.

Agora o objetivo é consolidar um instrumento que possa ser usado depois do curso.

Esse instrumento será um checklist profissional de arquiteto Java.

Checklist, porém, não significa uma lista mecânica de caixas.

Uma lista superficial pode criar falsa segurança.

Exemplo:

```text
existe ADR?
sim.

existe C4?
sim.

existe SLO?
sim.

existe runbook?
sim.
```

Essas respostas não provam que:

- o ADR está correto;
- o C4 representa o sistema real;
- o SLO mede a jornada certa;
- o runbook funciona;
- a arquitetura resolve o problema;
- o código respeita os boundaries;
- os dados possuem autoridade;
- o rollout é reversível;
- os riscos foram tratados;
- as evidências são suficientes.

O checklist desta aula será orientado por perguntas de qualidade.

Ele ajudará você a verificar:

```text
o que precisa ser entendido;

o que precisa ser decidido;

o que precisa ser implementado;

o que precisa ser protegido;

o que precisa ser observado;

o que precisa ser operado;

o que precisa ser documentado;

o que precisa ser provado;

o que precisa ser revisado.
```

O laboratório será:

```text
labs/m19/aula-669-checklist-arquiteto-java/java-architect-checklist
```

Você criará:

- Java Architect Charter;
- checklist de discovery;
- checklist de domínio;
- checklist de boundaries;
- checklist de código e dependências;
- checklist de APIs e eventos;
- checklist de dados;
- checklist de consistência;
- checklist de segurança;
- checklist de observabilidade;
- checklist de resiliência;
- checklist de performance;
- checklist de custos;
- checklist de deployment;
- checklist de rollout;
- checklist de operação;
- checklist de governança;
- checklist de documentação;
- checklist de revisão;
- checklist de liderança;
- checklist de evolução;
- scorecard;
- evidence;
- gate.

A próxima aula será:

```text
670 - M19.60 - Fechamento do Modulo 19
```

A aula 670 encerrará o módulo, revisará os resultados, consolidará as competências desenvolvidas e fará a ponte para o M20.

Nesta aula, o fechamento completo do módulo não será antecipado.

Regra central:

```text
um checklist de arquiteto
nao substitui julgamento;

ele protege o julgamento
contra esquecimento,
pressa,
preferencia pessoal
e falsa confianca.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
667:
Revisao arquitetura parte 2.

668:
Prova pratica arquitetura.

669:
Checklist de arquiteto Java.

670:
Fechamento do Modulo 19.
```

A progressão é:

```text
revisar;

provar;

consolidar;

encerrar.
```

O checklist será o resultado prático de todo o M19.

Ele reunirá critérios sobre:

- arquitetura;
- DDD;
- sistemas distribuídos;
- dados;
- segurança;
- observabilidade;
- resiliência;
- governança;
- documentação;
- liderança;
- operação;
- evolução.

Ele não servirá apenas para projetos novos.

Também poderá ser aplicado em:

- modernização;
- revisão de pull request;
- análise de incidente;
- design review;
- preparação de RFC;
- validação de ADR;
- integração de fornecedor;
- migração;
- avaliação de legado;
- arquitetura corporativa;
- entrevista;
- mentoria;
- planejamento técnico.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-669-checklist-arquiteto-java
└── java-architect-checklist
    ├── README.md
    ├── checklist
    │   ├── JAVA_ARCHITECT_CHARTER.md
    │   ├── DISCOVERY_CHECKLIST.md
    │   ├── BUSINESS_AND_DOMAIN_CHECKLIST.md
    │   ├── BOUNDARY_CHECKLIST.md
    │   ├── JAVA_CODE_CHECKLIST.md
    │   ├── API_CHECKLIST.md
    │   ├── EVENT_CHECKLIST.md
    │   ├── DATA_CHECKLIST.md
    │   ├── CONSISTENCY_CHECKLIST.md
    │   ├── SECURITY_CHECKLIST.md
    │   ├── OBSERVABILITY_CHECKLIST.md
    │   ├── RESILIENCE_CHECKLIST.md
    │   ├── PERFORMANCE_CHECKLIST.md
    │   ├── COST_CHECKLIST.md
    │   ├── DEPLOYMENT_CHECKLIST.md
    │   ├── ROLLOUT_CHECKLIST.md
    │   ├── OPERATIONS_CHECKLIST.md
    │   ├── GOVERNANCE_CHECKLIST.md
    │   ├── DOCUMENTATION_CHECKLIST.md
    │   ├── REVIEW_CHECKLIST.md
    │   ├── LEADERSHIP_CHECKLIST.md
    │   ├── EVOLUTION_CHECKLIST.md
    │   ├── RED_FLAG_CATALOG.md
    │   ├── DECISION_QUALITY_SCORECARD.md
    │   └── QUICK_REVIEW_CARD.md
    ├── contracts
    │   ├── java-architect-checklist-contract.yaml
    │   ├── checklist-item-policy.yaml
    │   ├── critical-item-policy.yaml
    │   ├── red-flag-policy.yaml
    │   ├── scorecard-policy.yaml
    │   ├── evidence-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/architectchecklist
    │   │           ├── ChecklistArea.java
    │   │           ├── ChecklistItem.java
    │   │           ├── ChecklistSeverity.java
    │   │           ├── ChecklistStatus.java
    │   │           ├── ChecklistEvidence.java
    │   │           ├── ChecklistFinding.java
    │   │           ├── DecisionQualityScore.java
    │   │           ├── RedFlag.java
    │   │           └── JavaArchitectGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/architectchecklist
    │               ├── CriticalItemTest.java
    │               ├── EvidenceRequirementTest.java
    │               ├── RedFlagTest.java
    │               ├── ScorecardTest.java
    │               ├── ChecklistCoverageTest.java
    │               ├── DecisionQualityTest.java
    │               ├── ModuleClosureNonAnticipationTest.java
    │               └── JavaArchitectGateTest.java
    └── reports
        ├── checklist-coverage-report.yaml
        ├── critical-item-report.yaml
        ├── red-flag-report.yaml
        ├── decision-quality-report.yaml
        ├── evidence-report.yaml
        └── java-architect-gate-report.yaml
```

Scripts:

```text
scripts/m19/java-architect-checklist
├── validate-checklist-contract.ps1
├── validate-checklist-coverage.ps1
├── validate-critical-items.ps1
├── validate-red-flags.ps1
├── validate-scorecard.ps1
├── validate-evidence.ps1
├── run-java-architect-checklist-tests.ps1
├── collect-java-architect-checklist-evidence.ps1
└── verify-java-architect-gate.ps1
```

---

## Conceito essencial

### Checklist é uma memória externa

Arquitetos experientes não confiam apenas na memória.

Eles criam mecanismos para lembrar de:

- perguntas;
- riscos;
- decisões;
- evidências;
- dependências;
- limites;
- triggers;
- owners.

O checklist reduz a chance de esquecer um aspecto crítico durante pressão.

### Checklist não decide sozinho

Exemplo:

```text
a mudanca precisa de mensageria?
```

O checklist não responde `sim`.

Ele força perguntas:

- existe desacoplamento temporal?
- existe fato de negócio?
- existe necessidade de fan-out?
- consumers podem atrasar?
- ordering importa?
- replay é necessário?
- operação suporta broker?
- chamada síncrona seria suficiente?

A decisão continua humana.

### Itens críticos bloqueiam avanço

Alguns itens não podem ser tratados como simples melhorias.

Exemplos:

- cross-tenant access;
- autoridade duplicada;
- migration irreversível;
- retry sem idempotência;
- contract breaking não controlado;
- secret exposto;
- ausência de rollback;
- risco crítico sem owner;
- SLO crítico sem operação;
- ADR aceito sem implementação.

### Evidence é parte do checklist

Não basta marcar:

```text
idempotencia implementada.
```

A evidência pode incluir:

- unique constraint;
- test de duplicidade;
- replay report;
- transaction count;
- audit;
- metric;
- implementation link.

### Checklist precisa evoluir

O checklist não é fixo.

Ele muda com:

- incidentes;
- novas regulações;
- novos padrões;
- mudanças de tecnologia;
- aumento de escala;
- problemas repetidos;
- feedback dos times;
- novos riscos;
- depreciações.

---

## Mão na massa guiada

### 1. Criar Java Architect Charter

Arquivo:

```text
checklist/JAVA_ARCHITECT_CHARTER.md
```

Conteúdo:

```markdown
# Java Architect Charter

Objetivo

Tomar decisoes
tecnicamente defensaveis,
operaveis,
seguras
e evolutivas.

Principios

- problem before technology;
- boundaries before services;
- authority before replication;
- evidence before confidence;
- security by design;
- observability by journey;
- rollout is architecture;
- ownership is explicit;
- trade-offs are visible;
- architecture evolves by feedback.
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/java-architect-checklist-contract.yaml
```

Conteúdo:

```yaml
javaArchitectChecklist:
  requiredAreas:
    - discovery
    - business-domain
    - boundaries
    - Java-code
    - APIs
    - events
    - data
    - consistency
    - security
    - observability
    - resilience
    - performance
    - cost
    - deployment
    - rollout
    - operations
    - governance
    - documentation
    - review
    - leadership
    - evolution

  required:
    - item-owner
    - item-severity
    - expected-evidence
    - status
    - review-trigger
    - red-flags
    - scorecard
    - reports
    - evidence
    - gate

  forbidden:
    - checkbox-without-question
    - critical-pass-without-evidence
    - architecture-by-framework
    - score-used-as-individual-ranking
    - permanent-checklist-without-review
    - module-closure-deep-dive

  nextLesson:
    code:
      M19.60
```

---

## Checklist de discovery

Arquivo:

```text
checklist/DISCOVERY_CHECKLIST.md
```

Perguntas:

- o problema está descrito em linguagem de negócio?
- quem sofre o impacto?
- qual comportamento precisa mudar?
- qual é o resultado esperado?
- como sucesso será medido?
- quais são os não objetivos?
- qual é o prazo real?
- quais restrições são obrigatórias?
- quais premissas ainda não foram validadas?
- quais stakeholders possuem decision rights?
- qual custo existe em não agir?
- quais riscos são inaceitáveis?
- quais sistemas precisam coexistir?
- quais dados são sensíveis?
- quais volumes são conhecidos?
- quais volumes são apenas estimados?
- qual parte do problema pode ser experimentada?
- qual decisão precisa ser tomada agora?
- qual decisão pode ser adiada?
- qual evidence mudaria a solução?

Red flags:

```text
solucao definida
antes do problema;

escopo sem nao objetivos;

volume desconhecido
tratado como certeza;

prazo sem trade-off;

stakeholder critico ausente.
```

---

## Checklist de negócio e domínio

Arquivo:

```text
checklist/BUSINESS_AND_DOMAIN_CHECKLIST.md
```

Perguntas:

- quais capacidades de negócio existem?
- quais são core?
- quais são supporting?
- quais são generic?
- quais jornadas entregam valor?
- quais jornadas são críticas?
- qual linguagem é usada por cada área?
- quais invariantes existem?
- quais decisões pertencem ao domínio?
- quais regras mudam com frequência?
- quais regras variam por cliente?
- quais agregados precisam de consistência local?
- quais eventos representam fatos reais?
- quais conceitos possuem significados diferentes?
- quais partes do domínio ainda estão ambíguas?
- quais especialistas precisam participar?
- qual owner responde por cada capability?
- qual mudança de negócio tende a ocorrer?
- qual domínio merece investimento?
- qual domínio pode usar produto externo?

Red flags:

```text
tabela usada
como modelo de dominio;

entidade global;

status enum compartilhado;

capability sem owner;

bounded context criado
por organograma.
```

---

## Checklist de boundaries

Arquivo:

```text
checklist/BOUNDARY_CHECKLIST.md
```

Perguntas:

- o boundary possui responsabilidade clara?
- existe linguagem própria?
- existe autoridade de dados?
- existe owner?
- aggregates pertencem a um único context?
- existem writes cruzados?
- existem entidades compartilhadas?
- as dependências são explícitas?
- o Context Map está atualizado?
- existe Anti-Corruption Layer para legado?
- o boundary é conceitual ou apenas de deploy?
- deploy separado é realmente necessário?
- escala é diferente?
- risco é diferente?
- lifecycle é diferente?
- equipe é diferente?
- falha precisa ser isolada?
- mudança exige coordenação?
- o boundary possui contratos?
- o boundary possui métricas e runbooks?

Red flags:

```text
microservico por entidade;

shared database sem owner;

context sem journey;

context sem contrato;

boundary criado
apenas por framework.
```

---

## Checklist de código Java

Arquivo:

```text
checklist/JAVA_CODE_CHECKLIST.md
```

Perguntas:

- domain depende de framework?
- application depende de ports?
- adapters implementam ports?
- controllers acessam repositories diretamente?
- entities JPA vazam para APIs?
- exceptions técnicas vazam para domínio?
- bibliotecas de vendor aparecem em regras de negócio?
- transações estão no boundary correto?
- locking é explícito?
- concorrência foi testada?
- invariantes estão no aggregate?
- records e value objects representam intenção?
- nullability está controlada?
- mutabilidade é necessária?
- package structure representa módulos?
- ArchUnit protege dependências?
- reflection ou proxies escondem comportamento?
- serialization está versionada?
- threads e executors possuem ownership?
- recursos são fechados?
- logs evitam dados sensíveis?

Red flags:

```text
God Service;

controller com regra;

repository compartilhado;

entity usada como DTO;

static mutable state;

catch Exception vazio;

retry em toda excecao;

transaction gigante.
```

---

## Checklist de APIs

Arquivo:

```text
checklist/API_CHECKLIST.md
```

Perguntas:

- a operação representa uma intenção?
- o owner está explícito?
- o consumer é conhecido?
- o contrato possui versão?
- erros são estáveis?
- autorização é contextual?
- tenant é confiável?
- idempotência é necessária?
- timeout está definido?
- retry é permitido?
- o SLO está definido?
- paginação é necessária?
- rate limiting é necessário?
- breaking changes são detectadas?
- existe deprecation policy?
- exemplos são válidos?
- payload é mínimo?
- PII está classificada?
- observabilidade preserva privacidade?
- contract tests existem?

Red flags:

```text
endpoint generico update;

stack trace no response;

tenant apenas no body;

breaking change silenciosa;

API sem owner;

timeout infinito.
```

---

## Checklist de eventos

Arquivo:

```text
checklist/EVENT_CHECKLIST.md
```

Perguntas:

- o evento representa um fato?
- o nome está no passado?
- o owner está explícito?
- o aggregate ID existe?
- event ID existe?
- tenant existe quando aplicável?
- occurred at existe?
- correlation e causation existem?
- schema está versionado?
- ordering key está definida?
- consumers são conhecidos?
- retention está definida?
- PII foi minimizada?
- compatibilidade é testada?
- replay é seguro?
- consumers possuem Inbox?
- producer usa Outbox?
- DLQ possui owner?
- lag possui alerta?
- depreciação possui plano?

Red flags:

```text
evento chamado Update;

payload com entidade inteira;

sem owner;

sem version;

consumer depende
de ordem global;

DLQ sem processo.
```

---

## Checklist de dados

Arquivo:

```text
checklist/DATA_CHECKLIST.md
```

Perguntas:

- qual contexto é autoridade?
- quais writers são permitidos?
- quais réplicas existem?
- qual freshness é necessária?
- qual consistency model existe?
- qual classificação do dado?
- qual retenção?
- qual deletion policy?
- qual archival policy?
- qual lineage?
- quais quality rules?
- qual reconciliation?
- qual repair process?
- backup foi testado?
- restore foi testado?
- RPO e RTO estão definidos?
- migration é reversível?
- backfill é idempotente?
- acesso é por propósito?
- multi-tenancy está protegida?

Red flags:

```text
varios writers;

replica sem freshness;

backup nunca restaurado;

migration destrutiva;

PII em log;

repair manual sem audit.
```

---

## Checklist de consistência

Arquivo:

```text
checklist/CONSISTENCY_CHECKLIST.md
```

Perguntas:

- qual operação exige consistência forte?
- qual operação aceita consistência eventual?
- qual é a autoridade?
- qual é a transação local?
- qual propagação existe?
- qual deadline existe?
- qual timeout budget?
- retry cabe no budget?
- idempotência existe?
- conflito é detectado?
- late reply é tratado?
- ordering é relevante?
- compensação existe?
- reconciliation existe?
- UX representa estado pendente?
- fallback existe?
- manual intervention possui audit?
- CAP foi considerado?
- PACELC foi considerado?
- recovery foi testada?

Red flags:

```text
transacao distribuida implicita;

eventual sem UX;

retry sem idempotencia;

Saga sem state;

timeout maior que SLO;

compensacao nao idempotente.
```

---

## Checklist de segurança

Arquivo:

```text
checklist/SECURITY_CHECKLIST.md
```

Perguntas:

- assets foram identificados?
- threat actors foram considerados?
- trust boundaries foram mapeados?
- identidade humana está definida?
- workload identity está definida?
- tenant source é confiável?
- autorização considera action e resource?
- least privilege está aplicado?
- secrets estão em secret manager?
- rotação existe?
- revogação existe?
- mensagens possuem producer autorizado?
- replay foi considerado?
- dados estão minimizados?
- logging evita dados sensíveis?
- uploads possuem limites e validação?
- supply chain é verificada?
- SBOM existe?
- audit é separado de log?
- incident response foi ensaiado?

Red flags:

```text
autenticacao apenas no gateway;

service account compartilhada;

secret no repositorio;

tenant confiado no payload;

mensagem sem ACL;

audit editavel.
```

---

## Checklist de observabilidade

Arquivo:

```text
checklist/OBSERVABILITY_CHECKLIST.md
```

Perguntas:

- quais jornadas são críticas?
- quais steps existem?
- correlation atravessa boundaries?
- logs possuem decisão e outcome?
- métricas possuem cardinalidade bounded?
- traces capturam dependências?
- SLI mede usuário elegível?
- SLO possui window e objective?
- error budget policy existe?
- alert usa burn rate quando aplicável?
- alerta possui owner?
- dashboard responde perguntas operacionais?
- runbook existe?
- runbook foi testado?
- release está correlacionada?
- backlog é observado?
- manual intervention é medida?
- telemetry failure possui política?
- retenção e custo estão definidos?
- evidence pode ser sanitizada?

Red flags:

```text
CPU como unica metrica;

ID em label;

SLO sem runbook;

alerta sem owner;

trace sem consumer;

log com payload sensivel.
```

---

## Checklist de resiliência

Arquivo:

```text
checklist/RESILIENCE_CHECKLIST.md
```

Perguntas:

- timeout existe em toda chamada?
- retry está limitado?
- backoff existe?
- jitter existe?
- circuit breaker é necessário?
- bulkhead existe?
- load shedding existe?
- fallback é honesto?
- modo degradado está definido?
- dependência crítica possui owner?
- failure mode foi mapeado?
- retry storm foi considerado?
- queue backlog possui limite?
- poison message possui tratamento?
- DLQ possui processo?
- recovery foi ensaiada?
- chaos ou game day foi executado?
- idempotência acompanha retry?
- capacity limit está definido?
- manual recovery possui audit?

Red flags:

```text
retry infinito;

fallback com dado falso;

fila sem limite;

DLQ esquecida;

circuit breaker global;

dependencia sem timeout.
```

---

## Checklist de performance

Arquivo:

```text
checklist/PERFORMANCE_CHECKLIST.md
```

Perguntas:

- workload está descrito?
- volume atual é conhecido?
- crescimento é conhecido?
- p50, p95 e p99 foram definidos?
- throughput foi definido?
- concorrência foi testada?
- caminho crítico está claro?
- budget de latência existe?
- query plan foi analisado?
- índices possuem justificativa?
- cache possui policy?
- cache key inclui tenant?
- invalidation é definida?
- payload é adequado?
- pooling está configurado?
- thread pool está limitado?
- GC foi observado?
- cold start importa?
- load test representa produção?
- degradação foi testada?

Red flags:

```text
media usada
como unica medida;

cache sem invalidacao;

pool ilimitado;

N+1;

query sem indice;

benchmark sem workload.
```

---

## Checklist de custo

Arquivo:

```text
checklist/COST_CHECKLIST.md
```

Perguntas:

- quais são os principais cost drivers?
- custo cresce com qual dimensão?
- logs e traces possuem budget?
- retenção está adequada?
- overprovisioning existe?
- autoscaling possui limites?
- egress importa?
- broker possui custo previsível?
- banco possui capacidade adequada?
- ambiente não produtivo é controlado?
- licenças foram consideradas?
- fornecedor cria lock-in?
- build versus buy foi avaliado?
- custo de operação humana foi incluído?
- custo de incidentes foi considerado?
- custo de migração foi incluído?
- FinOps possui owner?
- custo por tenant é observável?
- custo por jornada é estimável?
- trigger de revisão de custo existe?

Red flags:

```text
observabilidade sem budget;

recurso sempre ligado;

fornecedor sem exit plan;

custo ignorado
na decisao arquitetural;

otimizacao sem baseline.
```

---

## Checklist de deployment

Arquivo:

```text
checklist/DEPLOYMENT_CHECKLIST.md
```

Perguntas:

- deploy unit corresponde ao ownership?
- bounded context precisa de deploy separado?
- falha está isolada?
- scaling é independente?
- configuração é externa?
- secrets são externos?
- health checks são corretos?
- readiness representa capacidade real?
- liveness evita restart loop?
- resources possuem limits?
- dependencies estão declaradas?
- artifact é imutável?
- provenance existe?
- rollback de versão existe?
- migration é coordenada?
- telemetry inicia antes do tráfego?
- environment parity é suficiente?
- feature flags possuem owner?
- cleanup de flags existe?
- deploy possui evidence?

Red flags:

```text
service por context
sem justificativa;

readiness superficial;

latest tag;

config no codigo;

migration no startup
sem controle;

flag permanente.
```

---

## Checklist de rollout

Arquivo:

```text
checklist/ROLLOUT_CHECKLIST.md
```

Perguntas:

- baseline existe?
- mudança é compatível?
- expand-contract foi usado?
- shadow read é útil?
- dual write é necessário?
- reconciliation existe?
- canary está definido?
- tenant piloto foi escolhido?
- stop conditions existem?
- error budget participa?
- rollback foi ensaiado?
- versão antiga lê dados novos?
- eventos antigos continuam aceitos?
- backfill é idempotente?
- cleanup possui owner?
- depreciação foi comunicada?
- plano de coexistência existe?
- manual intervention budget existe?
- rollout possui decision authority?
- evidence é coletada por fase?

Red flags:

```text
big bang;

rollback apenas de codigo;

dual write sem reconciliacao;

canary sem stop condition;

migration destrutiva;

cleanup sem owner.
```

---

## Checklist de operações

Arquivo:

```text
checklist/OPERATIONS_CHECKLIST.md
```

Perguntas:

- quem opera o serviço?
- quais SLOs existem?
- quais alertas exigem ação?
- quais runbooks existem?
- quais permissões o operador possui?
- quais ações são destrutivas?
- escalation está definida?
- on-call está preparado?
- ownership está atualizado?
- incident command está definido?
- postmortem existe?
- recovery foi testada?
- backup e restore foram testados?
- dependency outage foi simulada?
- backlog operacional é medido?
- manual repair possui audit?
- capacity planning existe?
- support conhece estados?
- status communication existe?
- operação participa do design?

Red flags:

```text
servico sem owner;

runbook nao testado;

alerta sem acao;

operador sem permissao;

repair direto no banco;

postmortem sem action.
```

---

## Checklist de governança

Arquivo:

```text
checklist/GOVERNANCE_CHECKLIST.md
```

Perguntas:

- decision rights estão claros?
- decisão permanece no nível mais próximo?
- guardrails são verificáveis?
- guidelines foram diferenciadas?
- golden paths existem?
- review é proporcional ao risco?
- fóruns possuem decisão e SLA?
- standard possui owner?
- standard possui lifecycle?
- exceção possui prazo?
- controle compensatório existe?
- policy as code é possível?
- enforcement possui rollout?
- falso positivo é medido?
- scorecard apoia melhoria?
- lead time de governança é medido?
- modelo é federado?
- comunicação é transparente?
- retrospectiva existe?
- governança mede seu próprio custo?

Red flags:

```text
comite para tudo;

veto por preferencia;

excecao permanente;

standard sem owner;

policy sem remediacao;

scorecard punitivo.
```

---

## Checklist de documentação

Arquivo:

```text
checklist/DOCUMENTATION_CHECKLIST.md
```

Perguntas:

- artefato possui propósito?
- owner está definido?
- source of truth está explícita?
- status está correto?
- freshness policy existe?
- review trigger existe?
- links estão válidos?
- traceability existe?
- conteúdo gerado está separado?
- conteúdo manual possui contexto?
- C4 representa deploy?
- ADR representa implementação?
- RFC possui lifecycle?
- contracts estão versionados?
- runbooks correspondem à operação?
- SLOs correspondem às queries?
- documento stale gera finding?
- depreciação possui replacement?
- portal é apenas view?
- artefatos órfãos são retirados?

Red flags:

```text
documento sem owner;

diagrama stale;

ADR aceito
sem implementation;

runbook sem teste;

conteudo duplicado;

portal como nova fonte.
```

---

## Checklist de revisão

Arquivo:

```text
checklist/REVIEW_CHECKLIST.md
```

Perguntas:

- problema e solução são coerentes?
- capabilities justificam componentes?
- boundaries possuem responsabilidade?
- autoridade de dados é única?
- contracts estão completos?
- timeout cabe no SLO?
- retries são seguros?
- segurança cobre boundaries?
- observabilidade cobre jornadas?
- rollout é reversível?
- ADRs possuem evidence?
- claims são verificáveis?
- contradições foram registradas?
- evidence ausente está visível?
- risco residual foi reavaliado?
- findings possuem owner?
- severidade vem do risco?
- causas raiz foram identificadas?
- correções possuem revalidation?
- decisão final possui authority?

Red flags:

```text
review por quantidade
de documentos;

finding sem evidence;

severidade por opiniao;

approval com blocker;

autor atacado
em vez da decisao.
```

---

## Checklist de liderança

Arquivo:

```text
checklist/LEADERSHIP_CHECKLIST.md
```

Perguntas:

- o problema está compartilhado?
- stakeholders corretos participaram?
- owner da decisão está claro?
- fatos e hipóteses foram separados?
- discordâncias foram registradas?
- conflito foi tratado com respeito?
- decisão possui prazo?
- delegation possui boundary?
- contexto foi transferido?
- hero dependency foi reduzida?
- comunicação muda por audiência?
- incerteza foi declarada?
- roadmap possui outcomes?
- riscos possuem owners?
- escalonamento ocorreu sem surpresa?
- tempo de foco foi protegido?
- health check existe?
- mentoria desenvolve autonomia?
- feedback é específico?
- retrospectiva produz ações?

Red flags:

```text
lider centraliza tudo;

discordancia escondida;

escalonamento punitivo;

delegacao sem contexto;

promessa sem evidence;

lider indispensavel.
```

---

## Checklist de evolução

Arquivo:

```text
checklist/EVOLUTION_CHECKLIST.md
```

Perguntas:

- quais premissas podem mudar?
- quais triggers reabrem ADR?
- fitness functions existem?
- métricas mostram drift?
- standards possuem revisão?
- tecnologia possui lifecycle?
- dependências possuem upgrade policy?
- legado possui estratégia?
- Strangler é aplicável?
- coexistência está planejada?
- dívida possui owner?
- cleanup possui prazo?
- feature flags são removidas?
- schemas antigos são depreciados?
- consumers antigos são conhecidos?
- custo mudou?
- volume mudou?
- risco mudou?
- equipe mudou?
- arquitetura ainda resolve o problema?

Red flags:

```text
ADR tratado como dogma;

flag eterna;

versao antiga sem owner;

legado sem plano;

upgrade somente em incidente;

arquitetura sem trigger.
```

---

## Modelar item do checklist

```java
package br.com.formacao.architectchecklist;

import java.util.List;
import java.util.Objects;

public record ChecklistItem(
        String id,
        ChecklistArea area,
        String question,
        ChecklistSeverity severity,
        String owner,
        List<String> expectedEvidence,
        String reviewTrigger,
        ChecklistStatus status) {

    public ChecklistItem {
        Objects.requireNonNull(id);
        Objects.requireNonNull(area);
        Objects.requireNonNull(question);
        Objects.requireNonNull(severity);
        Objects.requireNonNull(owner);
        expectedEvidence =
                List.copyOf(expectedEvidence);
        Objects.requireNonNull(reviewTrigger);
        Objects.requireNonNull(status);

        if (severity == ChecklistSeverity.CRITICAL
                && expectedEvidence.isEmpty()) {
            throw new IllegalArgumentException(
                    "Critical item requires evidence");
        }
    }
}
```

---

## Criar Red Flag Catalog

Arquivo:

```text
checklist/RED_FLAG_CATALOG.md
```

Red flags críticas:

```text
RF-001:
cross-tenant access possible.

RF-002:
shared write authority.

RF-003:
critical retry without idempotency.

RF-004:
irreversible migration.

RF-005:
secret exposed.

RF-006:
breaking contract without plan.

RF-007:
rollout without rollback.

RF-008:
critical risk without owner.

RF-009:
SLO without operational response.

RF-010:
accepted ADR without implementation.
```

Red flag não substitui finding.

Ela dispara investigação.

---

## Criar Decision Quality Scorecard

Arquivo:

```text
checklist/DECISION_QUALITY_SCORECARD.md
```

Dimensões:

```text
Problem Clarity;

Alternatives;

Evidence;

Trade-offs;

Ownership;

Security;

Operability;

Reversibility;

Evolution;

Communication.
```

Escala por dimensão:

```text
0:
ausente.

1:
superficial.

2:
parcial.

3:
adequado.

4:
forte.

5:
excelente.
```

Pontuação não substitui decisão.

Ela ajuda a localizar fragilidades.

---

## Criar Decision Quality Score

```java
package br.com.formacao.architectchecklist;

import java.util.Map;

public record DecisionQualityScore(
        String decisionId,
        Map<String, Integer> dimensions,
        String reviewer,
        String conclusion) {

    public DecisionQualityScore {
        dimensions = Map.copyOf(dimensions);

        dimensions.forEach((name, value) -> {
            if (value < 0 || value > 5) {
                throw new IllegalArgumentException(
                        "Dimension must be between 0 and 5");
            }
        });
    }

    public int total() {
        return dimensions.values()
                .stream()
                .mapToInt(Integer::intValue)
                .sum();
    }
}
```

---

## Criar Quick Review Card

Arquivo:

```text
checklist/QUICK_REVIEW_CARD.md
```

Perguntas rápidas:

```text
qual problema?

qual owner?

qual boundary?

qual authority?

qual contract?

qual consistency?

qual security risk?

qual SLO?

qual failure mode?

qual rollback?

qual evidence?

qual trade-off?

qual trigger?
```

Use o card em:

- reunião curta;
- pull request;
- design review inicial;
- triagem;
- incidente;
- mentoria.

Ele não substitui o checklist completo em mudança crítica.

---

## Aplicar o checklist em uma decisão

Decisão:

```text
adicionar Redis
para cache de disponibilidade.
```

Perguntas:

- qual problema de latência existe?
- qual baseline?
- qual freshness permitida?
- qual autoridade?
- qual invalidation?
- key inclui tenant?
- cache miss é seguro?
- outage degrada como?
- cardinalidade é observada?
- custo foi estimado?
- dados sensíveis entram no cache?
- rollout possui flag?
- rollback existe?
- evidence de ganho existe?
- trigger de remoção existe?

Resultado possível:

```text
APPROVED_WITH_CONDITIONS
```

Condições:

- benchmark;
- tenant key;
- TTL;
- fail-open controlado;
- alert;
- feature flag;
- cost budget;
- rollback test.

---

## Criar evidence

Arquivo:

```text
contracts/java-architect-checklist-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- checklist area count;
- checklist item count;
- critical item count;
- critical item evidence coverage;
- red flag count;
- open red flag count;
- scorecard dimension count;
- quick review card status;
- discovery coverage;
- domain coverage;
- boundary coverage;
- Java code coverage;
- API coverage;
- event coverage;
- data coverage;
- consistency coverage;
- security coverage;
- observability coverage;
- resilience coverage;
- performance coverage;
- cost coverage;
- deployment coverage;
- rollout coverage;
- operations coverage;
- governance coverage;
- documentation coverage;
- review coverage;
- leadership coverage;
- evolution coverage;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais;
- decisões confidenciais;
- clientes reais;
- endpoints privados;
- credenciais;
- vulnerabilidades exploráveis;
- avaliações individuais;
- conteúdo completo do fechamento da aula 670.

---

## Criar gate

O gate valida:

- todas as áreas;
- perguntas verificáveis;
- owners;
- severidades;
- evidências;
- red flags;
- scorecard;
- quick review;
- tests;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_AREA_COVERAGE;

FAIL_ITEM_OWNER;

FAIL_ITEM_SEVERITY;

FAIL_CRITICAL_EVIDENCE;

FAIL_RED_FLAG;

FAIL_SCORECARD;

FAIL_QUICK_REVIEW;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

## Executar validação completa

```powershell
.\scripts\m19\java-architect-checklist\validate-checklist-contract.ps1

.\scripts\m19\java-architect-checklist\validate-checklist-coverage.ps1

.\scripts\m19\java-architect-checklist\validate-critical-items.ps1

.\scripts\m19\java-architect-checklist\validate-red-flags.ps1

.\scripts\m19\java-architect-checklist\validate-scorecard.ps1

.\scripts\m19\java-architect-checklist\validate-evidence.ps1

.\scripts\m19\java-architect-checklist\run-java-architect-checklist-tests.ps1

.\scripts\m19\java-architect-checklist\collect-java-architect-checklist-evidence.ps1

.\scripts\m19\java-architect-checklist\verify-java-architect-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

## Entendendo o que foi feito

### O conhecimento ganhou uma forma reutilizável

Você transformou dezenas de assuntos do módulo em perguntas aplicáveis.

### O checklist evitou resposta automática

Cada item exige contexto, owner, evidence e review trigger.

### Itens críticos ganharam bloqueio

Riscos como cross-tenant, autoridade duplicada, migration irreversível e rollback ausente não podem ser marcados superficialmente.

### Red flags ganharam investigação

Sinais conhecidos agora disparam revisão estruturada.

### Decisões ganharam scorecard

Problema, alternativas, evidence, trade-offs, ownership, segurança, operação, reversibilidade, evolução e comunicação passaram a ser avaliados.

### O checklist ganhou lifecycle

Ele poderá evoluir com incidentes, feedback, escala, novos riscos e mudanças de tecnologia.

---

## Erros comuns importantes

### Transformar checklist em burocracia

Use profundidade proporcional ao risco.

### Marcar item sem evidence

A confiança vira opinião.

### Aplicar todos os itens a toda mudança

Mudança local e reversível não exige o mesmo processo de uma decisão crítica.

### Usar score para punir pessoas

O objetivo é melhorar decisões.

### Manter perguntas antigas

Checklist precisa de owner e revisão.

### Confundir red flag com conclusão

Red flag inicia investigação.

### Usar checklist no lugar de conversar

Decisões complexas exigem colaboração.

### Ignorar contexto organizacional

Capacidade, prazo e ownership afetam a solução.

### Aprovar por ausência de alerta

Ausência de finding não prova arquitetura boa.

### Antecipar o fechamento

A consolidação final do módulo ocorre na aula 670.

---

## Exercício guiado

Aplique o checklist à decisão:

```text
migrar um modulo
de monolito modular
para microservico.
```

Avalie:

1. problema;
2. capability;
3. boundary;
4. ownership;
5. dados;
6. contratos;
7. consistência;
8. segurança;
9. observabilidade;
10. resiliência;
11. performance;
12. custo;
13. deployment;
14. rollout;
15. rollback;
16. operação;
17. documentação;
18. evidence;
19. trade-offs;
20. trigger.

Emita:

```text
APPROVED;

APPROVED_WITH_CONDITIONS;

REWORK_REQUIRED;

REJECTED.
```

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 668 e ponte para a aula 670 foram preservadas;
- laboratório `java-architect-checklist` foi criado;
- Java Architect Charter foi criado;
- contrato principal foi criado;
- checklist de discovery foi criado;
- checklist de negócio e domínio foi criado;
- checklist de boundaries foi criado;
- checklist de código Java foi criado;
- checklist de APIs foi criado;
- checklist de eventos foi criado;
- checklist de dados foi criado;
- checklist de consistência foi criado;
- checklist de segurança foi criado;
- checklist de observabilidade foi criado;
- checklist de resiliência foi criado;
- checklist de performance foi criado;
- checklist de custo foi criado;
- checklist de deployment foi criado;
- checklist de rollout foi criado;
- checklist de operações foi criado;
- checklist de governança foi criado;
- checklist de documentação foi criado;
- checklist de revisão foi criado;
- checklist de liderança foi criado;
- checklist de evolução foi criado;
- red flags foram definidas;
- itens críticos exigem evidence;
- ChecklistItem foi criado;
- Red Flag Catalog foi criado;
- Decision Quality Scorecard foi criado;
- score não foi usado como ranking de pessoas;
- Decision Quality Score foi criado;
- Quick Review Card foi criado;
- decisão de cache foi avaliada;
- evidence foi criada;
- gate foi criado;
- scripts foram definidos;
- exercício principal foi incluído;
- commit recomendado e diário de bordo estão presentes;
- fechamento completo do M19 não foi antecipado.

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
  labs/m19/aula-669-checklist-arquiteto-java/java-architect-checklist `
  scripts/m19/java-architect-checklist `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|privateEndpoint|realIncident|productionTopology|individualScore"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): consolidar checklist de arquiteto Java"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- nomes reais;
- avaliações individuais;
- clientes reais;
- endpoints privados;
- credenciais;
- vulnerabilidades exploráveis;
- conteúdo completo do fechamento da aula 670.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você consolidou um checklist profissional de arquiteto Java.

Você criou checklists para:

```text
Discovery;

Business and Domain;

Boundaries;

Java Code;

APIs;

Events;

Data;

Consistency;

Security;

Observability;

Resilience;

Performance;

Cost;

Deployment;

Rollout;

Operations;

Governance;

Documentation;

Review;

Leadership;

Evolution.
```

Você também criou:

```text
Red Flag Catalog;

Decision Quality Scorecard;

Quick Review Card;

ChecklistItem;

evidence;

reports;

gate.
```

Você comprovou que checklist não substitui julgamento.

Ele protege o julgamento contra esquecimento, pressa, preferência pessoal e falsa confiança.

Você também tornou explícito que um item crítico precisa de evidence, que red flag não é conclusão, que score não deve ser usado para punir pessoas e que a profundidade do processo precisa ser proporcional ao risco.

A próxima aula será:

```text
670 - M19.60 - Fechamento do Modulo 19
```

Nela, você revisará o caminho completo do módulo, consolidará as competências arquiteturais desenvolvidas, validará o projeto final do M19 e fará a ponte para o módulo seguinte.

Nenhum fechamento completo do M19 foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei checklist por área.
- [ ] Defini itens críticos.
- [ ] Defini evidências.
- [ ] Criei red flags.
- [ ] Criei scorecard.
- [ ] Criei quick review.
- [ ] Apliquei o checklist.
- [ ] Criei gate.
- [ ] Evitei uso burocrático.
- [ ] Preservei julgamento.
- [ ] Defini lifecycle.
- [ ] Preparei a aula 670.

---

## Troubleshooting adicional

### O checklist ficou grande demais

Use o Quick Review Card para triagem e aprofunde por risco.

### Todos os itens parecem críticos

Revise impacto, probabilidade e reversibilidade.

### Não existe evidence disponível

Classifique como hipótese ou produza a prova antes de aprovar.

### O score está baixo

Analise as dimensões, não apenas o total.

### A equipe resiste ao checklist

Explique o risco evitado e reduza atrito.

### O checklist virou approval gate central

Distribua decision rights e automatize guardrails.

### Red flag aparece com frequência

Investigue causa raiz e transforme em policy ou golden path.

### A mesma pergunta aparece em várias áreas

Use referências, mas preserve o contexto específico.

### O checklist não acompanha a tecnologia

Defina owner, version e review cadence.

### A arquitetura passa no checklist, mas parece errada

Retorne ao problema e aos trade-offs. O checklist não substitui julgamento.

### A equipe quer encerrar o módulo

Preserve o fechamento completo para a aula 670.

---

## Perguntas de revisão

1. Para que serve um checklist de arquiteto?
2. Checklist substitui julgamento?
3. O que é item crítico?
4. Por que evidence é obrigatória?
5. O que é red flag?
6. Red flag é finding?
7. O que o checklist de discovery verifica?
8. O que o checklist de domínio verifica?
9. O que o checklist de boundary verifica?
10. O que o checklist Java verifica?
11. O que o checklist de API verifica?
12. O que o checklist de evento verifica?
13. O que o checklist de dados verifica?
14. O que o checklist de consistência verifica?
15. O que o checklist de segurança verifica?
16. O que o checklist de observabilidade verifica?
17. O que o checklist de rollout verifica?
18. O que o checklist de operação verifica?
19. O que o checklist de governança verifica?
20. O que o checklist de liderança verifica?
21. O que o checklist de evolução verifica?
22. Para que serve o scorecard?
23. Para que serve o Quick Review Card?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Proteger decisões contra esquecimento e pressa.
2. Não.
3. Item cujo risco pode bloquear avanço.
4. Para provar a afirmação.
5. Sinal que exige investigação.
6. Não.
7. Problema, escopo, riscos, stakeholders e evidence.
8. Capabilities, linguagem, regras e ownership.
9. Responsibility, authority, contracts e deploy.
10. Dependências, domínio, transações e qualidade.
11. Intent, owner, auth, errors, version e SLO.
12. Fact, owner, schema, consumers e replay.
13. Authority, lifecycle, quality, backup e repair.
14. Authority, propagation, conflict e recovery.
15. Identity, tenant, authorization, secrets e audit.
16. Journeys, SLOs, alerts, runbooks e cardinality.
17. Compatibility, canary, stop conditions e rollback.
18. Ownership, runbooks, recovery e incident response.
19. Decision rights, guardrails, standards e exceptions.
20. Contexto, conflito, delegação e comunicação.
21. Triggers, fitness functions, debt e deprecation.
22. Localizar fragilidades da decisão.
23. Fazer triagem rápida.
24. Fechamento do Módulo 19.
25. Fechamento do Módulo 19.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 669 - M19.59 - Checklist de arquiteto Java

- Continuei após a Prova prática arquitetura.
- Criei o laboratório `java-architect-checklist`.
- Criei Java Architect Charter.
- Criei o contrato principal.
- Criei checklist de discovery.
- Criei checklist de negócio e domínio.
- Criei checklist de boundaries.
- Criei checklist de código Java.
- Criei checklist de APIs.
- Criei checklist de eventos.
- Criei checklist de dados.
- Criei checklist de consistência.
- Criei checklist de segurança.
- Criei checklist de observabilidade.
- Criei checklist de resiliência.
- Criei checklist de performance.
- Criei checklist de custo.
- Criei checklist de deployment.
- Criei checklist de rollout.
- Criei checklist de operações.
- Criei checklist de governança.
- Criei checklist de documentação.
- Criei checklist de revisão.
- Criei checklist de liderança.
- Criei checklist de evolução.
- Defini itens críticos.
- Exigi evidence para itens críticos.
- Criei ChecklistItem.
- Criei Red Flag Catalog.
- Criei Decision Quality Scorecard.
- Evitei ranking de pessoas.
- Criei Decision Quality Score.
- Criei Quick Review Card.
- Apliquei o checklist à decisão de cache.
- Criei evidence, reports e gate.
- Não antecipei o fechamento do módulo.
- Próxima aula: Fechamento do Modulo 19.
```

---

## Referência técnica curta

- Java Architect Checklist.
- Discovery Checklist.
- Domain Checklist.
- Boundary Checklist.
- Java Code Checklist.
- API Checklist.
- Event Checklist.
- Data Checklist.
- Consistency Checklist.
- Security Checklist.
- Observability Checklist.
- Resilience Checklist.
- Rollout Checklist.
- Governance Checklist.
- Leadership Checklist.
- Evolution Checklist.
- Red Flag.
- Decision Quality Scorecard.
- Quick Review Card.

Regra final:

```text
O checklist de arquiteto Java deve funcionar como memória externa e mecanismo de qualidade, nunca como substituto de julgamento: discovery verifica problema, escopo, stakeholders, premissas, riscos e evidence, domínio verifica capabilities, linguagem, invariantes e ownership, boundaries verificam responsibility, authority, contracts e necessidade real de deploy, código Java verifica dependências, ports, adapters, transactions, concurrency, ArchUnit e vazamento de frameworks, APIs e eventos verificam intent, owner, authorization, idempotency, schema, version, consumers, compatibility e lifecycle, dados verificam authority, writers, replicas, freshness, quality, retention, backup, restore, reconciliation e repair, e consistência verifica transactions, propagation, timeout, retry, idempotency, conflict, compensation, CAP, PACELC e recovery; segurança atravessa identities, tenants, authorization, secrets, broker, audit e supply chain, observabilidade conecta journeys, logs, metrics, traces, SLOs, alerts, dashboards e runbooks, resiliência trata timeout, retry, backoff, circuit, bulkhead, load shedding e degraded mode, performance usa workload, percentis, budgets, queries, cache, pools e load tests, custo trata drivers, observability budget, lock-in e operação humana, deployment trata ownership, health, resources, provenance e migrations, rollout trata compatibility, shadow read, dual write, canary, stop conditions, rollback e cleanup, operações tratam on-call, recovery, incidentes e support, governança trata decision rights, guardrails, golden paths, standards, exceptions e metrics, documentação trata sources, owners, freshness e traceability, revisão trata coherence, findings, causes e revalidation, liderança trata contexto, conflito, delegação e comunicação, e evolução trata triggers, fitness functions, deprecation e modernização; itens críticos exigem evidence, red flags disparam investigação, scorecards localizam fragilidades, o Quick Review Card acelera triagem, e o gate termina com cobertura, owners, severidades, evidence, red flags, scorecard, reports e testes aprovados, enquanto o fechamento completo do M19 permanece reservado para a aula 670.
```
