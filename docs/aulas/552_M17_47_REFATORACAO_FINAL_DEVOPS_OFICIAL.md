# 552 - M17.47 - Refatoracao final DevOps

## Apresentação da aula

Na aula 551, você realizou a prova prática de DevOps.

A avaliação exigiu um fluxo completo:

```text
baseline;

pipeline;

artifact;

container;

configuração;

Kubernetes;

capacidade;

segurança;

cloud;

observabilidade;

deploy;

falha;

rollback;

evidence.
```

O objetivo da prova não era apenas obter uma pontuação.

O objetivo era produzir evidências reais sobre a maturidade da solução.

Uma avaliação prática pode revelar:

- gates ausentes;
- validações frágeis;
- configuração implícita;
- imagem maior que o necessário;
- permissões excessivas;
- probes com semântica incorreta;
- resources sem justificativa;
- HPA incompatível com dependências;
- rollback não comprovado;
- logs sem release ID;
- evidence incompleta;
- documentação divergente da implementação.

Agora esses achados serão usados para uma refatoração final.

A pergunta central desta aula será:

```text
como transformar
os resultados da prova

em melhorias
priorizadas,
verificáveis
e sustentáveis?
```

Refatoração final não significa reescrever tudo.

Também não significa adicionar ferramentas apenas para aumentar a quantidade de arquivos.

A refatoração precisa:

```text
preservar o que funciona;

remover duplicação;

corrigir riscos;

simplificar o fluxo;

fortalecer gates;

melhorar diagnóstico;

comprovar recuperação.
```

A regra central será:

```text
cada mudança
precisa estar ligada

a um finding,
a um risco
e a uma evidência.
```

Você trabalhará a partir dos resultados reais da prova prática.

Quando um cenário da aula não corresponder ao resultado obtido, use o finding real.

Não invente falhas para preencher documentos.

Não esconda falhas existentes.

A aula irá organizar a refatoração em seis frentes:

```text
1.
triagem e priorização.

2.
pipeline e supply chain.

3.
container e configuração.

4.
Kubernetes e capacidade.

5.
segurança, observabilidade
e rollback.

6.
evidence e encerramento.
```

O ambiente continua local e controlado.

Nenhuma conta cloud pública será usada.

Não haverá:

- access key;
- secret key;
- domínio público;
- certificado real;
- banco de produção;
- registry corporativo;
- dados pessoais;
- Secret reutilizado;
- deploy em produção;
- cobrança;
- mudança destrutiva;
- ocultação de resultados.

A próxima aula será:

```text
553 - M17.48 - Aula ensinavel DevOps
```

Por isso, esta aula precisa deixar uma solução tecnicamente limpa, explicável e pronta para ser ensinada.

Ela não antecipará o roteiro didático da próxima aula.

---

## Onde estamos na formação

A sequência oficial é:

```text
550:
Revisao DevOps parte 2.

551:
Prova pratica DevOps.

552:
Refatoracao final DevOps.

553:
Aula ensinavel DevOps.
```

A prova prática respondeu:

```text
o que funciona?

o que falha?

o que não foi comprovado?

quais riscos permanecem?
```

A refatoração responderá:

```text
o que deve ser corrigido primeiro?

como corrigir sem ampliar risco?

como comprovar a melhoria?

como evitar regressão?
```

Nesta aula:

```text
findings reais:
sim.

priorização:
sim.

refatoração de pipeline:
sim.

refatoração de container:
sim.

refatoração de configuração:
sim.

refatoração Kubernetes:
sim.

segurança:
sim.

observabilidade:
sim.

rollback:
sim.

evidence:
sim.

reescrita total:
não.

cloud real:
não.

aula ensinável:
não.
```

A refatoração seguirá uma regra de entrada:

```text
sem finding,
não existe mudança obrigatória.

sem risco,
não existe prioridade.

sem teste,
não existe conclusão.

sem evidence,
não existe aprovação.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
refactoring/devops-final
├── assessment-findings-register.yaml
├── finding-prioritization-matrix.yaml
├── refactoring-scope.yaml
├── pipeline-refactoring-plan.yaml
├── artifact-container-refactoring-plan.yaml
├── configuration-refactoring-plan.yaml
├── kubernetes-refactoring-plan.yaml
├── capacity-refactoring-plan.yaml
├── security-refactoring-plan.yaml
├── observability-refactoring-plan.yaml
├── rollback-refactoring-plan.yaml
├── regression-prevention-matrix.yaml
├── residual-risk-register.yaml
├── refactoring-decision-log.yaml
├── final-readiness-checklist.yaml
└── final-refactoring-evidence.yaml

scripts/refactoring/devops-final
├── import-assessment-findings.ps1
├── validate-finding-priorities.ps1
├── validate-refactoring-scope.ps1
├── refactor-pipeline-gates.ps1
├── refactor-container-baseline.ps1
├── refactor-runtime-configuration.ps1
├── refactor-kubernetes-baseline.ps1
├── validate-capacity-budget.ps1
├── validate-security-hardening.ps1
├── validate-observability-baseline.ps1
├── validate-rollback-readiness.ps1
├── run-refactoring-regression-suite.ps1
├── compare-before-after.ps1
├── collect-final-refactoring-evidence.ps1
└── verify-final-refactoring-completion.ps1

docs/refactoring/devops-final
├── REFACTORING_EXECUTIVE_SUMMARY.md
├── ASSESSMENT_FINDINGS_ANALYSIS.md
├── PIPELINE_REFACTORING.md
├── CONTAINER_CONFIGURATION_REFACTORING.md
├── KUBERNETES_CAPACITY_REFACTORING.md
├── SECURITY_OBSERVABILITY_REFACTORING.md
├── ROLLBACK_REFACTORING.md
├── BEFORE_AFTER_COMPARISON.md
├── FINAL_RESIDUAL_RISKS.md
├── FINAL_REFACTORING_TEST_MATRIX.md
└── FINAL_REFACTORING_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
findings importados;

prioridades justificadas;

escopo controlado;

gates fortalecidos;

artifact preservado;

imagem endurecida;

configuração validada;

manifests simplificados;

capacidade coerente;

acesso reduzido;

observabilidade melhorada;

rollback comprovado;

riscos residuais registrados;

evidence comparativa.
```

Você irá:

1. importar resultados da prova;
2. normalizar findings;
3. eliminar duplicações;
4. classificar severidade;
5. calcular prioridade;
6. definir escopo;
7. separar quick wins de mudanças estruturais;
8. refatorar pipeline;
9. refatorar artifact;
10. refatorar container;
11. refatorar configuração;
12. refatorar manifests;
13. refatorar probes;
14. refatorar resources;
15. revisar HPA e connection budget;
16. revisar RBAC;
17. revisar NetworkPolicy;
18. revisar Secrets;
19. revisar logs;
20. revisar release metadata;
21. revisar smoke test;
22. revisar rollback;
23. executar regressão;
24. comparar antes e depois;
25. registrar riscos residuais;
26. coletar evidence;
27. atualizar documentação;
28. executar gate;
29. commitar;
30. preparar a aula 553.

---

## Conceito essencial

### Finding

Evidência de comportamento, ausência de controle ou divergência encontrada durante avaliação.

---

### Root cause

Causa fundamental que permite a recorrência do problema.

---

### Symptom

Manifestação observável do problema.

---

### Corrective action

Mudança que corrige o problema identificado.

---

### Preventive action

Mudança que reduz a chance de recorrência.

---

### Regression test

Teste criado para impedir que um problema corrigido volte.

---

### Refactoring scope

Conjunto explícito de mudanças permitidas.

---

### Quick win

Melhoria de baixo esforço e risco, com benefício verificável.

---

### Structural change

Mudança que altera fluxo, arquitetura ou responsabilidades.

---

### Residual risk

Risco que permanece após a refatoração.

---

### Before-and-after evidence

Comparação objetiva entre o estado anterior e o estado corrigido.

---

## Mão na massa guiada

### 1. Confirmar a baseline da prova

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Localize os resultados da aula 551:

```text
assessment/devops-practical;

docs/assessment/devops;

final-assessment-evidence.yaml;

risk-register.yaml;

decision-log.yaml;

self-evaluation.yaml.
```

Confirme:

- pontuação registrada;
- desafios concluídos;
- findings reais;
- falhas eliminatórias verificadas;
- riscos residuais;
- evidências disponíveis;
- itens não executados;
- bloqueios do ambiente;
- nenhuma credencial real.

A refatoração começa com esses dados.

---

### 2. Importar findings

Crie:

```text
assessment-findings-register.yaml
```

Estrutura:

```yaml
findings:
  - id:
      FIND-PIPE-001

    source:
      practical-assessment

    area:
      pipeline

    symptom:
      gate-does-not-block-invalid-artifact

    evidence:
      assessment-report-reference

    impact:
      high

    likelihood:
      medium

    rootCause:
      metadata-validation-not-enforced

    status:
      open
```

Use os findings reais.

O exemplo apresenta formato, não resultado obrigatório.

O script:

```text
import-assessment-findings.ps1
```

deve:

- ler evidence da prova;
- ler risk register;
- ler self-evaluation;
- consolidar IDs;
- preservar origem;
- rejeitar item sem evidência;
- marcar lacuna não comprovada;
- evitar duplicação.

---

### 3. Diferenciar sintoma e causa

Exemplo:

```text
sintoma:
Pod em CrashLoopBackOff.

causas possíveis:
profile inválido;
configuração ausente;
OOM;
entrypoint incorreto;
liveness agressiva.
```

Refatorar apenas o sintoma pode mascarar a causa.

Outro exemplo:

```text
sintoma:
workflow falha ao publicar artifact.

causas possíveis:
path incorreto;
artifact não gerado;
permissão;
nome divergente;
job anterior não aprovado.
```

O finding precisa apontar a camada correta.

---

### 4. Criar matriz de priorização

Arquivo:

```text
finding-prioritization-matrix.yaml
```

Use critérios:

```yaml
priority:
  dimensions:
    impact:
      weight:
        4

    likelihood:
      weight:
        3

    exploitability:
      weight:
        4

    operationalFrequency:
      weight:
        2

    recoveryDifficulty:
      weight:
        3

    implementationRisk:
      weight:
        -2
```

A fórmula pode ser simples, desde que documentada.

A prioridade não deve depender apenas da pontuação.

Falhas eliminatórias recebem prioridade máxima.

Exemplos de prioridade máxima:

- Secret real;
- credencial exposta;
- contexto desconhecido;
- container privilegiado;
- banco público;
- rollback inexistente;
- evidence falsa;
- gate removido.

---

### 5. Classificar findings

Categorias:

```text
P0:
risco crítico
ou bloqueio de segurança.

P1:
falha que compromete
deploy, recuperação
ou rastreabilidade.

P2:
fragilidade operacional
ou dívida relevante.

P3:
melhoria de clareza,
manutenção
ou eficiência.
```

Cada item precisa de:

- priority;
- owner;
- prazo;
- ação;
- teste;
- evidence esperada;
- risco residual.

---

### 6. Definir escopo

Arquivo:

```text
refactoring-scope.yaml
```

Conteúdo:

```yaml
scope:
  allowed:
    - pipeline-gates
    - artifact-validation
    - container-hardening
    - runtime-configuration
    - kubernetes-manifests
    - capacity
    - access-control
    - observability
    - rollback
    - documentation

  forbidden:
    - business-feature-rewrite
    - unrelated-domain-refactor
    - production-deployment
    - real-cloud-provisioning
    - real-secret-usage
    - destructive-migration

  constraints:
    preserveBusinessBehavior:
      required

    preserveApprovedContracts:
      required

    evidence:
      required
```

A refatoração não deve mudar comportamento de negócio sem necessidade.

---

### 7. Criar decisão de mudança

Arquivo:

```text
refactoring-decision-log.yaml
```

Para cada decisão, registre:

```yaml
decisions:
  - id:
      DEC-REF-001

    finding:
      FIND-PIPE-001

    context:
      artifact-metadata-not-blocking

    alternatives:
      - manual-review
      - pipeline-validator
      - remove-metadata-requirement

    selected:
      pipeline-validator

    rationale:
      automatic-repeatable-gate

    risk:
      false-positive-block

    rollback:
      revert-validator-change

    evidence:
      validator-test
```

Remover o requisito não é correção válida quando ele protege rastreabilidade.

---

### 8. Refatorar pipeline

Crie:

```text
pipeline-refactoring-plan.yaml
```

Revise:

- triggers;
- permissions;
- job dependencies;
- cache;
- test gates;
- coverage;
- secret scan;
- dependency scan;
- artifact metadata;
- checksum;
- container test;
- manifest validation;
- evidence;
- promotion separation.

Procure problemas como:

```text
job continua após falha;

artifact é criado antes dos testes;

scan não bloqueia;

workflow possui write desnecessário;

cache mistura contexts;

metadata é opcional;

deploy reconstrói a imagem.
```

A correção deve manter o pipeline legível.

---

### 9. Fortalecer ordem dos gates

Uma ordem coerente:

```text
1.
source validation.

2.
compile.

3.
unit tests.

4.
integration tests.

5.
architecture tests.

6.
coverage.

7.
security scans.

8.
artifact generation.

9.
artifact validation.

10.
container build.

11.
container test.

12.
SBOM e image scan.

13.
manifest render.

14.
manifest security.

15.
release bundle.

16.
promotion separada.
```

Não execute etapas caras quando um gate básico já falhou.

Não gere release de commit reprovado.

---

### 10. Refatorar permissões

Workflow de validação pode usar:

```yaml
permissions:
  contents: read
```

Publicação pode precisar de permissão adicional em job separado.

Deploy pode usar ambiente protegido e identidade temporária.

Evite:

```text
write-all;

admin;

access key permanente;

Secret compartilhado.
```

Registre por que cada permissão existe.

---

### 11. Refatorar artifact

Revise:

- JAR único;
- version;
- commit;
- build time;
- checksum;
- classe principal;
- profiles;
- nenhum arquivo sensível;
- reprodutibilidade possível.

Crie:

```text
artifact-container-refactoring-plan.yaml
```

Uma correção válida pode:

- bloquear metadata `unknown`;
- rejeitar múltiplos JARs;
- padronizar nome;
- gerar checksum automaticamente;
- impedir artifact antes do `verify`;
- registrar origem do pipeline.

---

### 12. Refatorar container

Revise o Dockerfile.

Objetivos:

- base conhecida;
- Java 21;
- runtime mínimo;
- usuário non-root;
- ownership correto;
- entrypoint explícito;
- labels OCI;
- sem Secret;
- sem source;
- sem Maven no runtime;
- sem `latest`;
- graceful shutdown;
- logs no console.

Evite adicionar ferramentas de diagnóstico permanentes à imagem apenas para facilitar troubleshooting.

Diagnóstico pode usar containers efêmeros ou ferramentas externas.

---

### 13. Validar filesystem

Se a prova revelou falha com filesystem read-only, identifique a escrita.

Possíveis origens:

- `/tmp`;
- cache local;
- upload temporário;
- library;
- heap dump;
- log em arquivo.

A correção pode:

- redirecionar temporários;
- usar `emptyDir`;
- remover escrita desnecessária;
- manter root filesystem read-only;
- documentar exceção temporária.

Não desabilite hardening sem investigar.

---

### 14. Refatorar configuração

Crie:

```text
configuration-refactoring-plan.yaml
```

Revise:

- properties tipadas;
- Bean Validation;
- profiles;
- defaults;
- feature flags;
- timeouts;
- pool;
- release ID;
- environment;
- integrações externas;
- Secrets.

Problemas comuns:

```text
default inseguro;

property não documentada;

profile habilita cloud;

Secret com valor local versionado;

startup aceita release desconhecida;

configuração divergente entre container e Kubernetes.
```

---

### 15. Centralizar acesso à configuração

Evite espalhar:

```java
System.getenv("...");
```

ou:

```java
environment.getProperty("...");
```

por controllers e services.

Prefira:

- `@ConfigurationProperties`;
- records tipados;
- validação;
- documentação;
- testes.

Isso reduz divergência e facilita diagnóstico.

---

### 16. Refatorar Secret handling

A solução final precisa:

- manter Secret fora do Git;
- criar Secret efêmero no laboratório;
- usar secret store em arquitetura externa;
- limitar acesso;
- impedir logs;
- prever rotação;
- prever revogação;
- evitar command history quando possível.

Execute secret scan antes e depois.

Se um Secret real foi encontrado, a refatoração inclui revogação e rotação, não apenas remoção textual.

---

### 17. Refatorar manifests

Crie:

```text
kubernetes-refactoring-plan.yaml
```

Revise:

- namespace;
- labels;
- selectors;
- ServiceAccount;
- ConfigMap;
- Secret reference;
- Deployment;
- Service;
- Ingress;
- probes;
- resources;
- PDB;
- HPA;
- NetworkPolicy;
- Kustomize;
- image digest.

Remova duplicação entre ambientes.

Base contém recursos comuns.

Overlay contém diferenças reais.

---

### 18. Refatorar selectors

Verifique consistência:

```text
Deployment selector;

Pod labels;

Service selector;

PDB selector;

NetworkPolicy podSelector;

HPA target.
```

Uma mudança de label pode quebrar vários recursos.

Crie teste automático para essa relação.

O script:

```text
refactor-kubernetes-baseline.ps1
```

deve renderizar e comparar selectors.

---

### 19. Refatorar probes

Reavalie:

#### Startup

Tempo realista de inicialização.

#### Readiness

Capacidade de atender tráfego.

#### Liveness

Estado interno irrecuperável.

Corrija:

- banco na liveness;
- mesmo path em todas as probes sem justificativa;
- timeout impossível;
- threshold excessivo;
- readiness que oscila;
- startup que nunca expira.

Teste a falha esperada de cada probe.

---

### 20. Refatorar resources

Crie:

```text
capacity-refactoring-plan.yaml
```

Registre estado anterior e novo:

```yaml
capacity:
  before:
    cpuRequest:
      measured-or-assumed

    memoryRequest:
      measured-or-assumed

  after:
    cpuRequest:
      justified-lab-value

    memoryRequest:
      justified-lab-value

  evidence:
    - startup-observation
    - smoke-test
    - resource-metrics
```

Não apresente hipótese como produção.

Use valores de laboratório e documente limitações.

---

### 21. Revisar HPA e connection budget

Use:

```text
maxReplicas
x
pool máximo por réplica
+
migrations
+
admin
+
monitoring
<=
budget do banco.
```

Se o resultado exceder o budget:

- reduza pool;
- reduza maxReplicas;
- aumente capacidade do banco;
- use proxy quando justificado;
- revise concorrência;
- reduza duração de transações.

Não permita HPA ilimitado.

---

### 22. Refatorar PDB

Verifique:

- número de réplicas;
- `minAvailable`;
- `maxUnavailable`;
- rollout;
- drain;
- manutenção.

Exemplo problemático:

```text
replicas:
1.

minAvailable:
1.
```

Esse PDB pode impedir interrupções voluntárias.

A correção depende do objetivo.

---

### 23. Refatorar NetworkPolicy

Verifique:

- ingress necessário;
- egress necessário;
- DNS;
- banco;
- cache;
- mensageria;
- object storage;
- observabilidade.

Evite:

```text
egress:
allow-all.
```

Quando uma integração não existe no laboratório, não abra o destino.

Valide comportamento com policy ativa.

---

### 24. Refatorar RBAC

Crie:

```text
security-refactoring-plan.yaml
```

Revise:

- ServiceAccount da aplicação;
- identidade do pipeline;
- auditor;
- operator;
- verbs;
- resources;
- namespaces;
- duração;
- owner.

Remova:

- wildcard;
- ClusterRole sem necessidade;
- `delete namespaces`;
- secret read indiscriminado;
- identidade default privilegiada.

Use:

```powershell
kubectl auth can-i
```

para validar permissões.

---

### 25. Refatorar supply chain

Revise:

- branch protection;
- reviews;
- dependency lock;
- artifact checksum;
- SBOM;
- vulnerability scan;
- image digest;
- provenance;
- release bundle;
- promotion sem rebuild.

Se a prova reconstruiu durante deploy, separe:

```text
build pipeline;

promotion pipeline.
```

O deploy recebe artifact aprovado.

---

### 26. Refatorar observabilidade

Crie:

```text
observability-refactoring-plan.yaml
```

A baseline deve incluir:

- structured logs;
- timestamp;
- level;
- application;
- environment;
- release ID;
- correlation ID;
- health;
- events;
- rollout history;
- restart count;
- resource metrics;
- dependency metrics;
- alert criteria.

Remova dados sensíveis.

Evite cardinalidade desnecessária.

---

### 27. Melhorar release metadata

Compare:

- commit do Git;
- version do artifact;
- checksum;
- image digest;
- release ID;
- annotation;
- ConfigMap;
- endpoint `/internal/release`;
- Pod imageID.

O script:

```text
compare-before-after.ps1
```

deve mostrar divergências anteriores e consistência atual.

---

### 28. Refatorar smoke test

Smoke test precisa ser pequeno e decisivo.

Inclua:

- health;
- readiness;
- liveness;
- release endpoint;
- endpoint funcional;
- correlation ID;
- ausência de `5xx`.

Não transforme smoke em suíte completa.

Não aceite apenas status `200` quando o corpo possui estado incorreto.

---

### 29. Refatorar rollback

Crie:

```text
rollback-refactoring-plan.yaml
```

Revise:

- trigger;
- revisão anterior;
- artifact anterior;
- configuração anterior;
- compatibilidade de schema;
- Secret compatibility;
- external effects;
- smoke pós-rollback;
- release consistency;
- evidence.

Se a prova não comprovou rollback, execute novamente em cenário seguro.

---

### 30. Criar regressão controlada

Use falha reversível:

- readiness path inválido;
- image reference inexistente;
- property obrigatória ausente;
- porta incorreta.

Não use:

- exclusão de dados;
- migration destrutiva;
- credential leak real;
- corrupção de volume;
- indisponibilidade externa.

O objetivo é testar detecção e recuperação.

---

### 31. Criar matriz de prevenção de regressão

Arquivo:

```text
regression-prevention-matrix.yaml
```

Conteúdo:

```yaml
regressions:
  - finding:
      FIND-CONFIG-001

    correctiveAction:
      typed-property-validation

    preventiveControl:
      startup-contract-test

    pipelineGate:
      runtime-configuration-validation

    evidence:
      invalid-startup-rejected

  - finding:
      FIND-K8S-001

    correctiveAction:
      selector-alignment

    preventiveControl:
      rendered-manifest-test

    pipelineGate:
      manifest-validation

    evidence:
      service-endpoints-present
```

Cada finding fechado precisa de proteção contra retorno.

---

### 32. Executar suíte de regressão

Script:

```text
run-refactoring-regression-suite.ps1
```

Execute:

- build;
- unit tests;
- integration tests;
- architecture tests;
- configuration tests;
- artifact validation;
- image test;
- Secret scan;
- SBOM;
- vulnerability scan;
- manifest render;
- dry-run;
- security policy;
- smoke test;
- failure simulation;
- rollback test;
- release consistency.

Um finding não está fechado porque o código parece melhor.

Ele está fechado quando o teste associado passa.

---

### 33. Comparar antes e depois

Crie:

```text
BEFORE_AFTER_COMPARISON.md
```

Para cada área:

```text
before;

finding;

risk;

change;

test;

after;

residual risk.
```

Exemplo:

```text
before:
release endpoint permitia commit unknown.

finding:
rastreabilidade incompleta.

change:
startup bloqueia commit desconhecido.

test:
container com commit unknown encerra.

after:
release de deploy exige commit resolvido.

residual risk:
pipeline precisa fornecer metadata correta.
```

---

### 34. Atualizar riscos residuais

Arquivo:

```text
residual-risk-register.yaml
```

Um risco pode permanecer quando:

- depende de produção;
- exige carga real;
- exige cloud real;
- exige contrato organizacional;
- exige ferramenta indisponível;
- possui custo fora do laboratório.

Registre:

- motivo;
- impacto;
- owner futuro;
- mitigação;
- condição de aceitação;
- prazo de revisão.

Não marque como resolvido algo não comprovado.

---

### 35. Criar readiness final

Arquivo:

```text
final-readiness-checklist.yaml
```

Conteúdo:

```yaml
readiness:
  findings:
    p0Open:
      zero

    p1Open:
      zero-or-approved-exception

  pipeline:
    approved

  artifact:
    approved

  container:
    approved

  configuration:
    approved

  kubernetes:
    approved

  security:
    approved

  observability:
    approved

  rollback:
    approved

  evidence:
    complete

  cloud:
    realResources:
      zero

  secrets:
    realValues:
      zero
```

P1 aberto exige exceção explícita.

---

### 36. Criar documentação executiva

Arquivo:

```text
REFACTORING_EXECUTIVE_SUMMARY.md
```

Estrutura:

```text
1.
resultado da prova.

2.
findings principais.

3.
priorização.

4.
mudanças aplicadas.

5.
gates adicionados.

6.
riscos reduzidos.

7.
riscos residuais.

8.
evidence.

9.
limitações.

10.
readiness final.
```

A documentação precisa ser coerente com o código.

---

### 37. Criar matriz de testes

Arquivo:

```text
FINAL_REFACTORING_TEST_MATRIX.md
```

Cenários:

- finding sem evidence é rejeitado;
- P0 bloqueia conclusão;
- prioridade possui owner;
- pipeline para na primeira falha;
- workflow usa permissão mínima;
- artifact metadata é resolvida;
- múltiplos JARs são rejeitados;
- container executa non-root;
- Secret não entra na imagem;
- configuração inválida bloqueia startup;
- profile não habilita cloud por padrão;
- selectors permanecem consistentes;
- probes possuem semântica;
- resources possuem justificativa;
- HPA respeita connection budget;
- PDB é compatível;
- NetworkPolicy preserva DNS;
- RBAC não usa wildcard;
- image digest é rastreável;
- logs possuem release e correlation;
- smoke valida função e release;
- regressão é detectada;
- rollback restaura;
- risk residual é registrado;
- evidence compara antes e depois.

---

### 38. Criar troubleshooting

Arquivo:

```text
FINAL_REFACTORING_TROUBLESHOOTING.md
```

Inclua:

- findings duplicados;
- finding sem evidência;
- prioridade conflitante;
- escopo crescendo;
- testes antigos quebrando;
- workflow com dependência circular;
- artifact divergente;
- container sem permissão;
- configuração válida local e inválida no cluster;
- selectors divergentes;
- probe falhando após refatoração;
- HPA incompatível;
- PDB bloqueando rollout;
- NetworkPolicy bloqueando DNS;
- RBAC negando deploy;
- logs sem release;
- rollback sem revisão;
- evidence antes e depois divergente;
- risco residual sem owner.

---

### 39. Coletar evidence final

Script:

```text
collect-final-refactoring-evidence.ps1
```

Arquivo:

```text
final-refactoring-evidence.json.
```

Campos permitidos:

- lesson;
- assessment score;
- total findings;
- P0 before;
- P0 after;
- P1 before;
- P1 after;
- pipeline status;
- artifact status;
- container status;
- configuration status;
- Kubernetes status;
- capacity status;
- security status;
- observability status;
- rollback status;
- regression suite status;
- residual risk count;
- cloud resources zero;
- real secrets zero;
- timestamp.

Não inclua:

- Secret;
- token;
- kubeconfig;
- private key;
- dados de usuário;
- logs completos;
- registry credential;
- endpoint corporativo.

---

### 40. Executar gate final

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\refactoring\devops-final\import-assessment-findings.ps1

.\scripts\refactoring\devops-final\validate-finding-priorities.ps1

.\scripts\refactoring\devops-final\validate-refactoring-scope.ps1

.\scripts\refactoring\devops-final\refactor-pipeline-gates.ps1

.\scripts\refactoring\devops-final\refactor-container-baseline.ps1

.\scripts\refactoring\devops-final\refactor-runtime-configuration.ps1

.\scripts\refactoring\devops-final\refactor-kubernetes-baseline.ps1

.\scripts\refactoring\devops-final\validate-capacity-budget.ps1

.\scripts\refactoring\devops-final\validate-security-hardening.ps1

.\scripts\refactoring\devops-final\validate-observability-baseline.ps1

.\scripts\refactoring\devops-final\validate-rollback-readiness.ps1

.\scripts\refactoring\devops-final\run-refactoring-regression-suite.ps1

.\scripts\refactoring\devops-final\compare-before-after.ps1

.\scripts\refactoring\devops-final\collect-final-refactoring-evidence.ps1

.\scripts\refactoring\devops-final\verify-final-refactoring-completion.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- findings reais importados;
- P0 igual a zero;
- P1 fechado ou aprovado formalmente;
- pipeline aprovado;
- artifact aprovado;
- imagem aprovada;
- configuração aprovada;
- manifests aprovados;
- capacidade coerente;
- segurança aprovada;
- observabilidade aprovada;
- rollback aprovado;
- regressão aprovada;
- evidence completa;
- nenhum Secret real;
- nenhuma cloud real;
- solução pronta para ser explicada.

---

## Entendendo o que foi feito

### A prova virou entrada de engenharia

A pontuação deixou de ser o resultado final.

### Findings ganharam causa e prioridade

Sintomas foram separados de causas fundamentais.

### O escopo foi protegido

A refatoração não virou reescrita de negócio.

### O pipeline ganhou ordem e responsabilidade

Gates básicos passaram a bloquear etapas caras.

### Artifact e container ganharam identidade

Metadata, checksum, labels e digest foram preservados.

### Configuração ganhou contrato

Defaults inseguros e propriedades implícitas foram eliminados.

### Kubernetes ganhou consistência

Selectors, probes, resources e policies foram tratados como conjunto.

### Capacidade ganhou orçamento

HPA e pool passaram a respeitar dependências.

### Segurança ganhou redução de blast radius

Permissões, Secrets, imagem e rede foram endurecidos.

### Observabilidade ganhou release

Logs e endpoints passaram a comprovar a versão executada.

### Rollback ganhou teste de regressão

Recuperação deixou de ser somente documentação.

### Riscos residuais ganharam transparência

Limitações do laboratório foram registradas sem mascarar readiness.

---

## Erros comuns importantes

### Refatorar sem finding

A mudança pode aumentar complexidade sem reduzir risco.

### Corrigir sintoma e ignorar causa

O problema retorna em outro formato.

### Transformar P3 em prioridade máxima

Questões estéticas não devem competir com segurança.

### Reescrever toda a aplicação

O risco de regressão aumenta sem necessidade.

### Desabilitar gate que incomoda

A falha fica invisível.

### Aumentar permissões para destravar deploy

O problema operacional vira risco de segurança.

### Abrir NetworkPolicy inteira

A conectividade volta, mas a proteção desaparece.

### Aumentar resources sem medir

O custo sobe e a causa pode permanecer.

### Declarar rollback aprovado sem smoke

A recuperação não foi comprovada.

### Encerrar todos os riscos

Alguns riscos dependem de produção e precisam permanecer documentados.

---

## Comandos úteis

### Importar findings

```powershell
.\scripts\refactoring\devops-final\import-assessment-findings.ps1
```

### Validar escopo

```powershell
.\scripts\refactoring\devops-final\validate-refactoring-scope.ps1
```

### Executar regressão

```powershell
.\scripts\refactoring\devops-final\run-refactoring-regression-suite.ps1
```

### Comparar estados

```powershell
.\scripts\refactoring\devops-final\compare-before-after.ps1
```

### Validar conclusão

```powershell
.\scripts\refactoring\devops-final\verify-final-refactoring-completion.ps1
```

---

## Exercício guiado

### Parte 1 — Findings

Importe e normalize os resultados da prova.

### Parte 2 — Priority

Classifique P0, P1, P2 e P3.

### Parte 3 — Scope

Defina mudanças permitidas.

### Parte 4 — Pipeline

Corrija gates e permissões.

### Parte 5 — Runtime

Refatore artifact, container e configuração.

### Parte 6 — Kubernetes

Corrija manifests, probes e selectors.

### Parte 7 — Capacity and security

Revise HPA, pool, RBAC e NetworkPolicy.

### Parte 8 — Operations

Melhore logs, smoke e rollback.

### Parte 9 — Regression

Crie testes para cada finding fechado.

### Parte 10 — Evidence

Compare antes e depois e registre riscos residuais.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 551 e ponte para a aula 553 foram preservadas;
- a refatoração usa resultados reais da prova;
- finding, root cause, symptom, corrective action, preventive action e regression test foram definidos;
- findings sem evidence são rejeitados;
- matriz de priorização foi criada;
- P0, P1, P2 e P3 foram definidos;
- falhas eliminatórias recebem prioridade máxima;
- escopo permitido e proibido foi criado;
- comportamento de negócio é preservado;
- decision log foi criado;
- pipeline foi revisado por triggers, permissions, gates, cache, artifacts e promoção;
- ordem dos gates foi fortalecida;
- permissões mínimas foram preservadas;
- artifact foi validado por metadata e checksum;
- múltiplos JARs são rejeitados;
- container usa Java 21, non-root, runtime mínimo e labels;
- `latest`, Secrets e ferramentas desnecessárias são proibidos;
- filesystem e escrita temporária foram analisados;
- configuração tipada e startup validation foram reforçados;
- integrações cloud permanecem desabilitadas por padrão;
- Secret handling inclui scan, rotação e revogação;
- manifests foram revisados por base e overlay;
- selectors de Deployment, Service, PDB e NetworkPolicy foram comparados;
- probes foram revisadas por semântica;
- resources foram justificados como valores de laboratório;
- HPA foi relacionado ao connection budget;
- PDB foi comparado às réplicas;
- NetworkPolicy preserva DNS e somente dependências necessárias;
- RBAC remove wildcards e permissões excessivas;
- supply chain inclui checksum, SBOM, scan, digest e promoção sem rebuild;
- observabilidade inclui release ID e correlation ID;
- smoke test valida health, função e release;
- rollback possui trigger, revisão, compatibilidade e smoke;
- regressão controlada é reversível e não destrutiva;
- matriz de prevenção de regressão foi criada;
- suíte de regressão cobre cada finding fechado;
- comparação antes e depois foi criada;
- residual risk register foi criado;
- readiness final exige P0 zero;
- P1 aberto exige exceção;
- documentação executiva foi criada;
- matriz de testes e troubleshooting foram criados;
- evidence final é sanitizada;
- cloud resources e real secrets permanecem em zero;
- nenhuma produção ou cloud real foi usada;
- solução ficou pronta para explicação;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/refactoring/devops-final `
  scripts/refactoring/devops-final `
  docs/refactoring/devops-final `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|kubeconfig|client-secret|X-Amz-Signature"
```

Commit recomendado:

```powershell
git commit -m "refactor(m17): concluir refatoracao DevOps"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- Secret;
- token;
- kubeconfig;
- image archive;
- JAR;
- logs completos;
- dados reais;
- registry data;
- credencial cloud;
- material da aula 553.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os resultados da prova prática foram transformados em engenharia de melhoria.

A solução passou a possuir:

```text
findings normalizados;

prioridades;

escopo;

decisões;

ações corretivas;

ações preventivas;

regression tests;

comparação antes e depois;

riscos residuais;

readiness final.
```

Você comprovou que refatoração DevOps não é adicionar ferramentas sem propósito; findings precisam de evidence; sintomas precisam ser separados de causas; P0 e P1 precisam orientar prioridade; pipeline precisa bloquear falhas na ordem correta; artifacts e images precisam manter identidade; configuração precisa falhar cedo; Kubernetes precisa de selectors, probes, capacity e policies consistentes; segurança precisa reduzir permissões; observabilidade precisa identificar a release; rollback precisa ser executado; e cada finding fechado precisa de teste contra regressão.

A próxima aula será:

```text
553 - M17.48 - Aula ensinavel DevOps
```

Nela, você irá transformar a solução consolidada em uma explicação ensinável, estruturando sequência, demonstrações, analogias, perguntas e critérios de entendimento.

Nenhum roteiro didático, apresentação ou material completo da aula ensinável foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Importe os findings reais.
- [ ] Priorize P0, P1, P2 e P3.
- [ ] Defina escopo controlado.
- [ ] Refatore pipeline e runtime.
- [ ] Refatore Kubernetes e capacidade.
- [ ] Fortaleça segurança e observabilidade.
- [ ] Execute regressão e rollback.
- [ ] Compare antes e depois.

---

## Troubleshooting adicional

### Findings não possuem IDs consistentes

Normalize IDs e preserve a origem antes de priorizar.

### Vários findings apontam a mesma causa

Consolide a causa e mantenha evidências relacionadas.

### O escopo cresce para regras de negócio

Remova mudanças não relacionadas ao risco DevOps.

### O pipeline ficou mais lento

Revise ordem, cache e paralelismo sem remover gates.

### A imagem parou de iniciar após hardening

Revise ownership, filesystem, temporários e porta.

### A readiness falha depois da correção

Revise dependências obrigatórias, timeout e flapping.

### A NetworkPolicy bloqueia integração

Libere destino e porta específicos, não todo o egress.

### O rollback não recupera

Revise ConfigMap, Secret, schema e efeitos externos.

### O risk register ficou vazio

Revise limitações não testadas em cloud ou produção.

### Material ensinável apareceu

Remova e preserve a didática para a aula 553.

---

## Perguntas de revisão

1. O que é um finding?
2. Qual a diferença entre sintoma e causa?
3. O que é corrective action?
4. O que é preventive action?
5. Por que criar regression test?
6. Como priorizar findings?
7. O que caracteriza P0?
8. Por que controlar o escopo?
9. Como melhorar gates sem aumentar permissões?
10. O que validar no artifact?
11. O que validar no container?
12. Por que centralizar configuração?
13. Como tratar Secrets encontrados?
14. Por que comparar selectors?
15. Como HPA afeta o banco?
16. Como validar rollback?
17. O que entra no before-and-after?
18. O que é residual risk?
19. Quando a refatoração termina?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Evidência de problema ou ausência.
2. Manifestação e causa fundamental.
3. Corrige o problema.
4. Evita recorrência.
5. Impedir retorno.
6. Impacto, probabilidade e recuperação.
7. Risco crítico.
8. Evitar reescrita desnecessária.
9. Ordem, separação e least privilege.
10. Metadata, checksum e conteúdo.
11. User, layers, labels e startup.
12. Reduzir divergência.
13. Revogar, rotacionar e remover.
14. Garantir conectividade.
15. Multiplica conexões.
16. Falha, undo, smoke e consistência.
17. Estado, risco, mudança e teste.
18. Risco ainda existente.
19. Gates e evidence aprovados.
20. Aula ensinável DevOps.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 552 - M17.47 - Refatoracao final DevOps

- Continuei após a Prova prática DevOps.
- Importei findings reais da avaliação.
- Diferenciei sintomas, causas e riscos.
- Priorizei findings em P0, P1, P2 e P3.
- Defini escopo controlado de refatoração.
- Criei decision log para cada mudança.
- Reforcei ordem, permissões e gates do pipeline.
- Validei artifact por metadata e checksum.
- Refatorei container Java 21 non-root.
- Revisei filesystem, layers e Secrets.
- Centralizei configuração tipada e startup validation.
- Mantive integrações externas desabilitadas por padrão.
- Refatorei base, overlays, selectors e manifests.
- Corrigi probes conforme startup, readiness e liveness.
- Revisei requests, limits, HPA, PDB e connection budget.
- Reduzi permissões de RBAC.
- Restrinji NetworkPolicy às dependências necessárias.
- Reforcei SBOM, scan, digest e promoção sem rebuild.
- Melhorei logs, release metadata e correlation ID.
- Refatorei smoke test e rollback.
- Criei regression test para findings fechados.
- Comparei estado anterior e estado final.
- Registrei riscos residuais.
- Coletei evidence final sanitizada.
- Não usei cloud pública, produção ou Secret real.
- Próxima aula: Aula ensinável DevOps.
```

---

## Referência técnica curta

- Corrective and Preventive Actions.
- Root Cause Analysis.
- Risk-Based Prioritization.
- CI/CD Pipeline Refactoring.
- Container Hardening.
- Kubernetes Configuration Validation.
- Capacity and Connection Budget.
- Least Privilege and Network Policy.
- Regression Testing.
- Before-and-After Technical Evidence.

Regra final:

```text
a refatoração final DevOps precisa partir dos resultados reais da prova: findings possuem evidence, sintoma, causa, impacto, prioridade, owner e ação; P0 bloqueia conclusão e P1 exige correção ou exceção aprovada; o escopo preserva comportamento de negócio e concentra pipeline, artifact, container, configuração, Kubernetes, capacidade, segurança, observabilidade e rollback; gates são ordenados e executados com permissões mínimas, artifacts mantêm version, commit e checksum, containers Java 21 executam non-root sem Secrets, configuração é tipada e falha cedo, selectors, probes, resources, HPA, PDB e NetworkPolicy permanecem coerentes, RBAC reduz blast radius, supply chain usa SBOM, scan, digest e promoção sem rebuild, logs identificam release e correlation, smoke valida função e identidade, regressão controlada prova detecção e rollback; cada finding fechado recebe teste preventivo, a comparação before-and-after comprova a melhoria, riscos residuais permanecem transparentes e nenhuma cloud, produção ou credencial real é usada, deixando para a aula 553 a transformação dessa solução em uma aula ensinável de DevOps.
```
