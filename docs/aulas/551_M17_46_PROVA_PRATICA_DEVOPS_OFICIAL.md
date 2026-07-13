# 551 - M17.46 - Prova pratica DevOps

## Apresentação da aula

Você concluiu a revisão técnica do Módulo 17.

Nas aulas 549 e 550, os conhecimentos foram reorganizados em dois blocos:

```text
parte 1:
cultura DevOps,
CI/CD,
pipeline,
Maven,
testes,
artifacts,
containers,
configuração,
release,
rollback
e migrations.

parte 2:
Kubernetes,
cloud,
AWS,
serviços gerenciados,
custos,
segurança,
observabilidade
e rastreabilidade.
```

Agora chega o momento de demonstrar esses conhecimentos em uma prova prática.

Esta avaliação não será baseada em perguntas de memorização.

Você não será avaliado por repetir definições isoladas.

Você será avaliado pela capacidade de:

- interpretar um cenário;
- reconhecer riscos;
- propor uma solução coerente;
- implementar controles;
- validar o resultado;
- diagnosticar falhas;
- justificar decisões;
- produzir evidências;
- preservar segurança;
- executar rollback;
- manter rastreabilidade.

A prova utilizará a aplicação `orders-api` construída ao longo da formação.

O cenário simulará uma demanda real de uma equipe backend:

```text
a aplicação precisa
ser preparada,
empacotada,
validada
e implantada

em ambiente Kubernetes local,

com pipeline,
segurança,
observabilidade,
controle de custo
e recuperação.
```

Você deverá trabalhar com os recursos já estudados.

Não haverá gabarito com uma única implementação obrigatória.

Existem diferentes soluções tecnicamente aceitáveis.

Entretanto, qualquer solução precisa respeitar contratos mínimos:

```text
build reproduzível;

artifact rastreável;

configuração externa;

Secret fora do Git;

container non-root;

health checks corretos;

resources explícitos;

acesso mínimo;

imagem identificável;

deploy observável;

smoke test;

rollback comprovado;

evidence sanitizada.
```

A regra central desta avaliação será:

```text
não basta funcionar;

precisa ser
seguro,
explicável,
repetível,
observável
e reversível.
```

A prova será executada em ambiente local.

Não use:

- conta cloud pública;
- credencial corporativa;
- access key;
- secret key;
- domínio público;
- certificado real;
- banco de produção;
- registry corporativo;
- dados pessoais;
- dados de clientes;
- integração externa real;
- cobrança;
- acesso remoto;
- qualquer Secret reutilizado.

Todos os valores sensíveis usados no laboratório devem ser fictícios e efêmeros.

A próxima aula será:

```text
552 - M17.47 - Refatoracao final DevOps
```

Nela, você irá corrigir, simplificar e fortalecer os pontos identificados nesta prova.

Por isso, esta avaliação precisa produzir um diagnóstico honesto.

Não esconda falhas para obter uma nota artificialmente maior.

Uma falha bem detectada, explicada e registrada pode demonstrar mais maturidade do que um resultado aparentemente perfeito sem evidência.

---

## Onde estamos na formação

A sequência oficial é:

```text
549:
Revisao DevOps parte 1.

550:
Revisao DevOps parte 2.

551:
Prova pratica DevOps.

552:
Refatoracao final DevOps.
```

A revisão respondeu:

```text
o que cada prática resolve?

quais riscos permanecem?

como diagnosticar?
```

A prova responderá:

```text
você consegue
aplicar essas decisões

em um fluxo completo
de entrega?
```

Nesta aula:

```text
avaliação prática:
sim.

build:
sim.

pipeline:
sim.

artifact:
sim.

container:
sim.

Kubernetes:
sim.

cloud architecture:
conceitual.

serviços gerenciados:
decisão arquitetural.

custos:
sim.

segurança:
sim.

observabilidade:
sim.

deploy local:
sim.

rollback:
sim.

evidence:
sim.

gabarito:
não.

cloud real:
não.
```

A avaliação será dividida em dez desafios:

```text
1.
baseline e diagnóstico.

2.
pipeline e gates.

3.
artifact e container.

4.
configuração e Secrets.

5.
Kubernetes.

6.
capacidade e disponibilidade.

7.
segurança e acesso.

8.
cloud e serviços gerenciados.

9.
deploy, observabilidade e rollback.

10.
evidence e defesa técnica.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Você deverá criar:

```text
assessment/devops-practical
├── assessment-brief.yaml
├── baseline-diagnosis.yaml
├── pipeline-solution.yaml
├── container-solution.yaml
├── runtime-configuration-solution.yaml
├── kubernetes-solution.yaml
├── capacity-availability-solution.yaml
├── security-access-solution.yaml
├── cloud-architecture-solution.yaml
├── managed-services-solution.yaml
├── observability-rollback-solution.yaml
├── risk-register.yaml
├── decision-log.yaml
├── self-evaluation.yaml
└── final-assessment-evidence.yaml

scripts/assessment/devops
├── validate-assessment-structure.ps1
├── run-assessment-build.ps1
├── validate-assessment-pipeline.ps1
├── inspect-assessment-artifact.ps1
├── inspect-assessment-image.ps1
├── validate-assessment-configuration.ps1
├── validate-assessment-manifests.ps1
├── validate-assessment-security.ps1
├── deploy-assessment-environment.ps1
├── run-assessment-smoke-test.ps1
├── simulate-assessment-failure.ps1
├── rollback-assessment-release.ps1
├── collect-assessment-evidence.ps1
└── verify-assessment-completion.ps1

docs/assessment/devops
├── ASSESSMENT_EXECUTIVE_SUMMARY.md
├── ASSESSMENT_ARCHITECTURE.md
├── ASSESSMENT_PIPELINE.md
├── ASSESSMENT_CONTAINER.md
├── ASSESSMENT_KUBERNETES.md
├── ASSESSMENT_CLOUD_DECISIONS.md
├── ASSESSMENT_SECURITY.md
├── ASSESSMENT_OBSERVABILITY.md
├── ASSESSMENT_ROLLBACK.md
└── ASSESSMENT_FINAL_REPORT.md
```

Ao final, você deverá entregar:

```text
diagnóstico inicial;

solução versionada;

pipeline validado;

artifact identificado;

imagem validada;

manifests validados;

ambiente implantado;

smoke test aprovado;

falha simulada;

rollback executado;

arquitetura cloud justificada;

riscos registrados;

evidence sanitizada;

relatório final.
```

Você será avaliado por:

1. correção técnica;
2. segurança;
3. rastreabilidade;
4. confiabilidade;
5. capacidade de diagnóstico;
6. qualidade das evidências;
7. clareza das decisões;
8. capacidade de recuperação;
9. respeito ao escopo;
10. honestidade técnica.

---

## Conceito essencial

### Avaliação prática

Demonstração de competência por meio da execução de um cenário técnico.

---

### Evidência verificável

Resultado que outra pessoa consegue revisar sem depender apenas da afirmação do autor.

---

### Critério de aceite

Condição objetiva usada para aprovar ou rejeitar uma entrega.

---

### Risco residual

Risco que permanece depois da aplicação dos controles.

---

### Decisão arquitetural

Escolha registrada com contexto, alternativas, vantagens, riscos e consequências.

---

### Diagnóstico

Processo de identificar sintoma, camada, causa provável, evidência e correção.

---

### Defesa técnica

Explicação objetiva das decisões adotadas.

---

### Escopo controlado

Limite explícito do que será e do que não será executado.

---

## Mão na massa guiada

## Regras gerais da prova

Antes dos desafios, registre as regras no arquivo:

```text
assessment-brief.yaml
```

Inclua:

```yaml
assessment:
  environment:
    localOnly:
      true

  cloud:
    realResources:
      zero

  secrets:
    realValues:
      zero

  source:
    versionControl:
      required

  evidence:
    sanitized:
      required

  rebuildDuringPromotion:
    forbidden

  rollback:
    required

  externalData:
    forbidden

  answerKey:
    unavailable
```

A prova deve ser executada individualmente.

Você pode consultar:

- aulas anteriores;
- documentação oficial;
- código do projeto;
- comandos registrados;
- diário de bordo.

Você não deve copiar uma solução completa sem conseguir explicá-la.

---

### Desafio 1 — Baseline e diagnóstico

Objetivo:

```text
comprovar
o estado inicial
antes de alterar.
```

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Quando houver cluster local:

```powershell
kubectl config current-context

kubectl get namespace

kubectl get deployment,pod,service,ingress,hpa,pdb `
  --all-namespaces
```

Crie:

```text
baseline-diagnosis.yaml
```

Registre:

- branch;
- commit;
- Java;
- Maven;
- Docker;
- kubectl;
- contexto;
- estado dos testes;
- estado do Git;
- artifacts existentes;
- imagens locais;
- namespaces existentes;
- riscos encontrados;
- ações necessárias.

Você deve identificar pelo menos cinco riscos possíveis.

Exemplos de categorias, sem fornecer respostas:

- build;
- configuração;
- Secret;
- container;
- manifests;
- acesso;
- dependências;
- observabilidade;
- rollback;
- rastreabilidade.

Critério:

```text
nenhuma alteração
é iniciada
sem baseline registrada.
```

Pontuação máxima:

```text
10 pontos.
```

---

### Desafio 2 — Pipeline e gates

Objetivo:

```text
desenhar
um pipeline coerente
para a aplicação.
```

Crie:

```text
pipeline-solution.yaml
```

O pipeline precisa contemplar:

- checkout;
- Java 21;
- cache Maven;
- build;
- testes;
- coverage;
- análise estática;
- secret scan;
- dependency scan;
- geração de artifact;
- checksum;
- container build;
- container test;
- manifest validation;
- security validation;
- evidence;
- promoção ou deploy separado.

Você precisa decidir:

- eventos de trigger;
- permissões;
- ordem dos gates;
- estratégia de cache;
- retenção dos artifacts;
- tratamento de falhas;
- política de exceção;
- promoção manual ou automática.

Crie ou ajuste um workflow de avaliação.

O workflow não deve usar permissão administrativa.

Execute:

```powershell
.\scripts\assessment\devops\validate-assessment-pipeline.ps1
```

Cenários obrigatórios:

- teste falha;
- coverage cai;
- Secret é detectado;
- vulnerability bloqueadora;
- artifact sem metadata;
- manifest inválido.

Não corrija o gate apenas removendo a validação.

Pontuação máxima:

```text
10 pontos.
```

---

### Desafio 3 — Artifact e container

Objetivo:

```text
produzir
um artifact rastreável
e uma imagem segura.
```

Crie:

```text
container-solution.yaml
```

O artifact precisa possuir:

- application;
- version;
- commit;
- build time;
- checksum;
- status dos testes.

A imagem precisa:

- usar Java 21;
- ter base conhecida;
- executar non-root;
- possuir labels OCI;
- não usar `latest`;
- não conter Secret;
- possuir entrypoint explícito;
- expor a porta correta;
- respeitar graceful shutdown;
- iniciar com configuração externa;
- ser testada fora da IDE.

Execute:

```powershell
.\scripts\assessment\devops\run-assessment-build.ps1

.\scripts\assessment\devops\inspect-assessment-artifact.ps1

.\scripts\assessment\devops\inspect-assessment-image.ps1
```

Registre:

- checksum do JAR;
- image ID;
- usuário;
- labels;
- tamanho;
- resultado do health;
- resultado do release endpoint;
- resultado do shutdown;
- findings.

A imagem não precisa ser publicada externamente.

Pontuação máxima:

```text
10 pontos.
```

---

### Desafio 4 — Configuração e Secrets

Objetivo:

```text
demonstrar
separação correta
entre código,
configuração
e credenciais.
```

Crie:

```text
runtime-configuration-solution.yaml
```

Classifique:

- profile;
- porta;
- environment;
- release ID;
- log level;
- JDBC URL;
- usuário;
- senha;
- feature flags;
- messaging;
- cache;
- object storage;
- timeouts;
- pool.

Para cada propriedade, registre:

- origem;
- obrigatoriedade;
- sensibilidade;
- default;
- validação;
- owner.

Requisitos:

- nenhuma senha real;
- nenhum token;
- nenhum Secret no Git;
- nenhuma credencial em Dockerfile;
- nenhuma credencial em ConfigMap;
- nenhuma credencial em log;
- nenhuma integração cloud habilitada por padrão;
- startup deve falhar quando configuração obrigatória faltar.

Execute:

```powershell
.\scripts\assessment\devops\validate-assessment-configuration.ps1
```

Teste pelo menos:

- configuração válida;
- release ID ausente;
- profile inválido;
- Secret literal detectado;
- feature externa desabilitada;
- logs sem credencial.

Pontuação máxima:

```text
10 pontos.
```

---

### Desafio 5 — Kubernetes

Objetivo:

```text
criar manifests
coerentes,
seguros
e renderizáveis.
```

Crie:

```text
kubernetes-solution.yaml
```

Sua solução precisa incluir:

- Namespace;
- ServiceAccount;
- ConfigMap;
- referência de Secret;
- Deployment;
- Service;
- Ingress local ou estratégia de port-forward;
- startup probe;
- readiness probe;
- liveness probe;
- requests;
- limits;
- security context;
- PDB;
- HPA;
- NetworkPolicy;
- Kustomization ou Helm.

O Deployment precisa:

- usar imagem identificável;
- manter histórico;
- usar rolling update;
- desabilitar token quando não utilizado;
- executar non-root;
- remover capabilities;
- usar seccomp quando suportado;
- possuir termination grace period.

Execute:

```powershell
.\scripts\assessment\devops\validate-assessment-manifests.ps1
```

Valide:

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  <manifest-renderizado>
```

Cenários obrigatórios:

- selector correto;
- Service com porta correta;
- probes distintas;
- HPA com limites;
- Secret apenas referenciado;
- NetworkPolicy preservando DNS;
- nenhum Service público desnecessário.

Pontuação máxima:

```text
12 pontos.
```

---

### Desafio 6 — Capacidade e disponibilidade

Objetivo:

```text
justificar
capacidade,
escalabilidade
e recuperação.
```

Crie:

```text
capacity-availability-solution.yaml
```

Registre:

- réplicas mínimas;
- réplicas máximas;
- CPU request;
- CPU limit;
- memory request;
- memory limit;
- startup budget;
- shutdown budget;
- HPA target;
- stabilization;
- PDB;
- connection pool;
- connection budget;
- dependências limitantes;
- estratégia de carga.

Você precisa demonstrar a relação:

```text
maxReplicas
x
pool por réplica
<=
budget do banco.
```

Explique:

- risco de throttling;
- risco de OOMKill;
- risco de HPA sem métricas;
- risco de scale-out sem capacidade do banco;
- risco de PDB incompatível;
- risco de readiness incorreta.

Não invente números como se fossem dados de produção.

Declare que são hipóteses de laboratório.

Pontuação máxima:

```text
8 pontos.
```

---

### Desafio 7 — Segurança e acesso

Objetivo:

```text
reduzir
blast radius
do pipeline
e do workload.
```

Crie:

```text
security-access-solution.yaml
```

Sua solução precisa abordar:

- identidade humana;
- identidade do pipeline;
- identidade do workload;
- ServiceAccount;
- RBAC;
- Secrets;
- network;
- image security;
- supply chain;
- logging;
- backup;
- incident response.

Requisitos:

- permissões mínimas;
- nenhum wildcard injustificado;
- nenhuma access key;
- OIDC como preferência para pipeline externo;
- workload sem credencial estática;
- backend sem exposição pública direta;
- Secret fora do Git;
- artifact com checksum;
- SBOM prevista;
- vulnerability gate;
- audit logs preservados;
- exceções com owner e expiração.

Execute:

```powershell
.\scripts\assessment\devops\validate-assessment-security.ps1
```

Registre pelo menos três riscos residuais.

Pontuação máxima:

```text
10 pontos.
```

---

### Desafio 8 — Cloud e serviços gerenciados

Objetivo:

```text
propor arquitetura cloud
sem criar recursos reais.
```

Crie:

```text
cloud-architecture-solution.yaml
```

Cenário:

```text
orders-api pública;

PostgreSQL;

processamento assíncrono;

fanout de eventos;

cache;

documentos;

alta disponibilidade;

auditoria;

controle de custo.
```

Mapeie capacidades para uma arquitetura AWS conceitual.

Você precisa decidir sobre:

- entrada;
- compute;
- registry;
- network;
- subnets;
- identity;
- RDS;
- Multi-AZ;
- read replica;
- SQS;
- SNS;
- Redis;
- S3;
- Secrets;
- observabilidade;
- backup;
- custo;
- segurança.

Crie também:

```text
managed-services-solution.yaml
```

Para cada serviço, registre:

- problema resolvido;
- source of truth;
- consistência;
- failure mode;
- retry;
- fallback;
- observabilidade;
- custo;
- responsabilidade do cliente.

Questões obrigatórias:

- por que Multi-AZ não é read replica;
- por que SQS exige idempotência;
- quando SNS entra antes de SQS;
- por que Redis não é fonte de verdade;
- por que S3 não é filesystem;
- como evitar banco público;
- como o HPA afeta o pool;
- como controlar custos de logs e NAT.

Nenhuma chamada AWS será executada.

Pontuação máxima:

```text
10 pontos.
```

---

### Desafio 9 — Deploy, observabilidade e rollback

Objetivo:

```text
provar
o ciclo operacional
em ambiente local.
```

Use namespace exclusivo:

```text
formacao-java-assessment
```

Execute:

```powershell
.\scripts\assessment\devops\deploy-assessment-environment.ps1
```

Acompanhe:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-assessment `
  --timeout=180s
```

Valide:

- Pods Ready;
- Service;
- EndpointSlices;
- health;
- readiness;
- liveness;
- endpoint funcional;
- release endpoint;
- correlation ID;
- logs;
- events;
- image identity.

Execute:

```powershell
.\scripts\assessment\devops\run-assessment-smoke-test.ps1
```

Depois, simule uma falha reversível:

```powershell
.\scripts\assessment\devops\simulate-assessment-failure.ps1
```

A falha pode envolver:

- imagem inexistente;
- readiness inválida;
- configuração obrigatória ausente;
- porta incorreta.

Não use:

- exclusão de dados;
- migration destrutiva;
- Secret real;
- falha externa.

Execute rollback:

```powershell
.\scripts\assessment\devops\rollback-assessment-release.ps1
```

Após o rollback, repita:

- rollout status;
- health;
- smoke;
- release consistency;
- logs;
- events.

Crie:

```text
observability-rollback-solution.yaml
```

Pontuação máxima:

```text
12 pontos.
```

---

### Desafio 10 — Evidence e defesa técnica

Objetivo:

```text
comprovar
a execução
e explicar decisões.
```

Crie:

```text
risk-register.yaml
```

Cada risco precisa de:

- ID;
- descrição;
- impacto;
- probabilidade;
- controle;
- owner;
- risco residual;
- próxima ação.

Crie:

```text
decision-log.yaml
```

Cada decisão precisa de:

- contexto;
- alternativas;
- decisão;
- vantagens;
- riscos;
- consequências;
- evidência.

Crie:

```text
final-assessment-evidence.yaml
```

Campos permitidos:

- commit;
- version;
- artifact checksum status;
- image identity;
- non-root status;
- pipeline status;
- tests status;
- manifest validation;
- security validation;
- namespace;
- desired replicas;
- available replicas;
- health;
- smoke;
- release consistency;
- failure simulation;
- rollback status;
- cloud resources zero;
- real secrets zero;
- timestamp.

Campos proibidos:

- senha;
- token;
- kubeconfig;
- private key;
- certificate;
- dados pessoais;
- environment dump;
- logs completos;
- credencial cloud.

Prepare uma defesa técnica curta com:

```text
problema;

decisões;

riscos;

gates;

falha encontrada;

rollback;

limitações;

próximo passo.
```

Pontuação máxima:

```text
8 pontos.
```

---

### Distribuição da pontuação

```text
desafio 1:
10.

desafio 2:
10.

desafio 3:
10.

desafio 4:
10.

desafio 5:
12.

desafio 6:
8.

desafio 7:
10.

desafio 8:
10.

desafio 9:
12.

desafio 10:
8.

total:
100.
```

Faixas sugeridas:

```text
90 a 100:
domínio forte.

75 a 89:
domínio consistente.

60 a 74:
domínio parcial.

40 a 59:
revisão necessária.

abaixo de 40:
retomar fundamentos.
```

A pontuação não substitui a análise qualitativa.

Uma entrega insegura pode ser reprovada mesmo com muitos itens presentes.

---

### Falhas eliminatórias

A prova deve ser marcada como não aprovada quando houver:

- Secret real versionado;
- credencial exposta;
- uso de conta cloud sem autorização;
- exclusão destrutiva não prevista;
- deploy em contexto desconhecido;
- container privilegiado sem justificativa;
- backend ou banco público sem decisão;
- ausência total de rollback;
- evidence falsificada;
- remoção de gates para esconder falhas;
- uso de dados reais;
- incapacidade de explicar a própria solução.

Nesses casos, registre o problema e preserve material para a refatoração da aula 552.

---

### Execução do gate final

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\assessment\devops\validate-assessment-structure.ps1

.\scripts\assessment\devops\run-assessment-build.ps1

.\scripts\assessment\devops\validate-assessment-pipeline.ps1

.\scripts\assessment\devops\inspect-assessment-artifact.ps1

.\scripts\assessment\devops\inspect-assessment-image.ps1

.\scripts\assessment\devops\validate-assessment-configuration.ps1

.\scripts\assessment\devops\validate-assessment-manifests.ps1

.\scripts\assessment\devops\validate-assessment-security.ps1

.\scripts\assessment\devops\deploy-assessment-environment.ps1

.\scripts\assessment\devops\run-assessment-smoke-test.ps1

.\scripts\assessment\devops\simulate-assessment-failure.ps1

.\scripts\assessment\devops\rollback-assessment-release.ps1

.\scripts\assessment\devops\run-assessment-smoke-test.ps1

.\scripts\assessment\devops\collect-assessment-evidence.ps1

.\scripts\assessment\devops\verify-assessment-completion.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Não faça commit enquanto houver:

- Secret;
- marcador não resolvido;
- gate crítico falho;
- evidence inconsistente;
- namespace incorreto;
- rollback não validado.

---


### Como registrar o resultado da avaliação

Crie:

```text
self-evaluation.yaml
```

Estrutura sugerida:

```yaml
evaluation:
  totalScore:
    value:
      0

  challenges:
    baseline:
      score:
        0

      evidence:
        missing

      improvement:
        required

    pipeline:
      score:
        0

      evidence:
        missing

      improvement:
        required

    artifactAndContainer:
      score:
        0

      evidence:
        missing

      improvement:
        required

    configuration:
      score:
        0

      evidence:
        missing

      improvement:
        required

    kubernetes:
      score:
        0

      evidence:
        missing

      improvement:
        required

    capacity:
      score:
        0

      evidence:
        missing

      improvement:
        required

    security:
      score:
        0

      evidence:
        missing

      improvement:
        required

    cloud:
      score:
        0

      evidence:
        missing

      improvement:
        required

    deploymentAndRollback:
      score:
        0

      evidence:
        missing

      improvement:
        required

    technicalDefense:
      score:
        0

      evidence:
        missing

      improvement:
        required
```

Preencha o arquivo somente depois de executar os desafios.

Não atribua pontuação com base em intenção.

Use evidências.

Exemplo de diferença:

```text
intenção:
"o container deve ser non-root".

evidência:
docker inspect confirma
o usuário de runtime.
```

Outro exemplo:

```text
intenção:
"o rollback funciona".

evidência:
revisão anterior restaurada,
Pods Ready,
smoke aprovado
e release consistente.
```

Para cada desconto, registre:

- critério não atendido;
- sintoma;
- evidência;
- impacto;
- correção planejada;
- aula de referência;
- prioridade.

Não altere resultados para atingir uma faixa desejada.

O objetivo da pontuação é orientar a aula 552.

---

### Defesa técnica da solução

Prepare uma apresentação de cinco a dez minutos.

A defesa precisa responder:

1. qual era o estado inicial;
2. quais riscos foram priorizados;
3. como o pipeline bloqueia falhas;
4. como a release é identificada;
5. como Secrets foram protegidos;
6. como Kubernetes recebeu capacidade e health;
7. como o acesso foi limitado;
8. como a arquitetura cloud foi escolhida;
9. como o deploy foi validado;
10. como o rollback foi comprovado.

Durante a defesa, evite respostas como:

```text
"porque é boa prática";

"porque o curso pediu";

"porque sempre fazemos assim".
```

Prefira:

```text
"este controle reduz
este risco;

a evidência é esta;

o risco residual é este".
```

Quando uma decisão não puder ser comprovada, declare a limitação.

Exemplo:

```text
o HPA foi configurado,
mas não houve carga suficiente
para validar o comportamento;

a validação completa
permanece como ação
da refatoração.
```

Honestidade técnica faz parte da avaliação.

---

## Entendendo o que foi feito

### A prova avaliou fluxo completo

Não houve separação artificial entre código, container, plataforma e operação.

### A baseline evitou alterações cegas

O estado inicial foi registrado antes da solução.

### O pipeline foi avaliado pelos riscos

Cada gate precisou justificar sua existência.

### O artifact e a imagem foram relacionados

Version, commit, checksum e image identity formaram rastreabilidade.

### Configuração e Secrets foram separados

A aplicação passou a depender de contratos explícitos.

### Kubernetes foi tratado como plataforma

Deployment, Service, probes, resources, acesso e rede foram avaliados em conjunto.

### Capacidade foi ligada às dependências

HPA e connection pool não foram tratados isoladamente.

### Segurança foi aplicada em camadas

Identidade, rede, workload, supply chain e auditoria foram combinados.

### Cloud foi tratada como decisão

Serviços foram escolhidos pelo problema que resolvem.

### Rollback foi comprovado

A recuperação precisou passar novamente pelos gates.

### Evidence transformou execução em prova

Resultados puderam ser revisados sem expor dados sensíveis.

---

## Erros comuns importantes

### Começar implementando sem baseline

Você perde comparação e pode esconder problemas anteriores.

### Criar pipeline com muitos nomes e poucos gates reais

A quantidade de steps não garante qualidade.

### Usar `latest`

A release perde identidade.

### Colocar Secret no YAML para facilitar

A prova é reprovada por segurança.

### Usar a mesma probe para tudo

Startup, readiness e liveness possuem objetivos diferentes.

### Escolher resources sem justificativa

Números precisam ser hipóteses testáveis.

### Dar acesso administrativo ao pipeline

A solução fica funcional, mas insegura.

### Escolher serviços cloud pelo nome

A decisão precisa partir da semântica.

### Considerar apply como deploy concluído

Rollout, smoke, logs e release consistency ainda precisam passar.

### Executar rollback sem validar

O comando pode terminar e a aplicação continuar falhando.

---

## Comandos úteis

### Build

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Renderizar manifests

```powershell
kubectl kustomize `
  <overlay-da-avaliacao>
```

### Dry-run

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  <manifest-renderizado>
```

### Rollout

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-assessment
```

### Rollback

```powershell
kubectl rollout undo `
  deployment/orders-api `
  --namespace `
  formacao-java-assessment
```

---

## Exercício guiado

A prova é o exercício principal desta aula.

Siga a ordem:

### Parte 1 — Diagnosticar

Registre a baseline e os riscos.

### Parte 2 — Projetar

Defina pipeline, container, configuração, Kubernetes e cloud.

### Parte 3 — Implementar

Crie artifacts, scripts, manifests e documentação.

### Parte 4 — Validar

Execute build, testes, scans, render e dry-run.

### Parte 5 — Implantar

Use o namespace exclusivo.

### Parte 6 — Observar

Revise health, logs, events e release identity.

### Parte 7 — Falhar

Introduza uma regressão controlada.

### Parte 8 — Recuperar

Execute rollback e novo smoke test.

### Parte 9 — Evidenciar

Colete resultados sanitizados.

### Parte 10 — Defender

Explique decisões e limitações.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 550 e ponte para a aula 552 foram preservadas;
- avaliação prática possui cenário, regras, desafios, pontuação e gates;
- nenhum gabarito ou solução única foi fornecido;
- baseline é obrigatória antes de alterações;
- build, Git e ambiente são registrados;
- pipeline contempla qualidade, segurança, artifact, container e manifests;
- workflow usa permissões mínimas;
- falhas de teste, coverage, Secret, vulnerability e manifest são tratadas;
- artifact possui version, commit, build time e checksum;
- imagem usa Java 21, non-root, labels e entrypoint explícito;
- `latest` e Secrets na imagem são proibidos;
- configuração e Secrets são classificados;
- startup inválido precisa falhar;
- manifests incluem Namespace, ServiceAccount, ConfigMap, Secret reference, Deployment, Service e acesso local;
- startup, readiness e liveness são distintas;
- requests, limits, HPA, PDB e NetworkPolicy são exigidos;
- capacity plan relaciona HPA e connection budget;
- segurança cobre identidade, rede, workload, supply chain, logs e recovery;
- riscos residuais são registrados;
- arquitetura cloud é apenas conceitual;
- RDS, SQS, SNS, Redis e S3 são escolhidos por semântica;
- custos e segurança são considerados;
- deploy ocorre apenas em namespace local exclusivo;
- rollout, Service, endpoints, health, release e correlation ID são validados;
- falha controlada não altera dados;
- rollback é obrigatório;
- smoke test é repetido após rollback;
- risk register e decision log são exigidos;
- evidence é sanitizada;
- falhas eliminatórias são definidas;
- pontuação totaliza 100;
- cloud resources e real secrets permanecem em zero;
- relatório final é exigido;
- prova produz diagnóstico para a aula 552;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/assessment/devops-practical `
  scripts/assessment/devops `
  docs/assessment/devops `
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
git commit -m "test(m17): concluir prova pratica DevOps"
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
- registry data;
- logs completos;
- respostas copiadas;
- credencial cloud;
- dados reais;
- material da refatoração 552.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou uma prova prática que reuniu o ciclo completo de DevOps para uma aplicação Java backend.

A avaliação exigiu:

```text
baseline;

diagnóstico;

pipeline;

artifact;

container;

configuração;

Secrets;

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

O objetivo não foi produzir uma solução visualmente bonita.

O objetivo foi demonstrar que você consegue construir e defender um fluxo de entrega confiável.

Uma avaliação aprovada precisa mostrar que:

- a aplicação compila e é testada;
- o artifact é rastreável;
- a imagem é segura;
- a configuração é externa;
- Secrets são protegidos;
- os manifests são coerentes;
- a capacidade é justificada;
- o acesso é mínimo;
- a arquitetura cloud é explicável;
- o deploy é observável;
- o rollback funciona;
- as evidências são reais e sanitizadas.

A próxima aula será:

```text
552 - M17.47 - Refatoracao final DevOps
```

Nela, você irá utilizar os resultados, falhas, riscos residuais e pontos de melhoria desta prova para refatorar a solução final.

Nenhuma correção específica da prova foi antecipada nesta aula, pois a refatoração precisa partir das evidências realmente produzidas durante a avaliação.

---

# Material complementar

## Checkpoint final

- [ ] Registrei a baseline.
- [ ] Concluí os dez desafios.
- [ ] Executei todos os gates.
- [ ] Implantei no namespace correto.
- [ ] Simulei uma falha reversível.
- [ ] Executei rollback e novo smoke test.
- [ ] Coletei evidence sanitizada.
- [ ] Registrei pontuação e pontos de melhoria.

---

## Troubleshooting adicional

### A prova ficou grande demais para executar de uma vez

Execute por desafio, mantendo commits locais separados, mas entregue um relatório consolidado.

### O cluster local não está disponível

Conclua build, container, render, dry-run e arquitetura; registre o bloqueio sem inventar evidence de deploy.

### O scanner não está instalado

Registre a ferramenta ausente como bloqueio. Não gere resultado falso.

### A imagem não inicia

Revise profile, release ID, porta, usuário, permissões e memória.

### O Service não possui endpoints

Revise labels, selectors e readiness.

### O rollout não conclui

Colete Pods, events, ReplicaSets e logs antes do rollback.

### O rollback não recupera

Revise configuração, Secret, schema e recursos não controlados pelo Deployment.

### A pontuação ficou baixa

Use a aula 552 para refatorar os pontos identificados.

### Um Secret real foi encontrado

Revogue, rotacione, remova e registre a prova como não aprovada.

### Você não consegue explicar uma decisão

Registre como lacuna de conhecimento e retome a aula correspondente.

---

## Perguntas de revisão

1. O que diferencia esta prova de uma lista de perguntas?
2. Por que a baseline é obrigatória?
3. Quais gates mínimos o pipeline precisa possuir?
4. Como provar a identidade do artifact?
5. Como provar que o container é non-root?
6. Como separar configuração e Secret?
7. Quais recursos Kubernetes são obrigatórios?
8. Como escolher probes?
9. Como relacionar HPA e banco?
10. Como reduzir acesso do pipeline?
11. Por que SQS exige idempotência?
12. Por que Redis não deve ser fonte de verdade?
13. Como S3 difere de filesystem?
14. Como custos entram na decisão?
15. O que valida um deploy?
16. O que torna uma falha segura para simulação?
17. O que comprova um rollback?
18. O que não pode entrar na evidence?
19. O que causa reprovação eliminatória?
20. Qual é a próxima aula?

---

## Roteiro de resposta

Este roteiro não contém respostas da prova.

Use-o apenas como formato da entrega:

1. contexto;
2. baseline;
3. riscos;
4. arquitetura;
5. pipeline;
6. artifact;
7. container;
8. configuração;
9. Kubernetes;
10. capacidade;
11. segurança;
12. cloud;
13. observabilidade;
14. deploy;
15. falha;
16. rollback;
17. evidence;
18. limitações;
19. pontuação;
20. plano de refatoração.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 551 - M17.46 - Prova pratica DevOps

- Concluí a prova prática do Módulo 17.
- Registrei baseline de build, Git, Docker, Kubernetes e ambiente.
- Criei solução de pipeline com gates de qualidade e segurança.
- Validei artifact com version, commit e checksum.
- Validei imagem Java 21 executando non-root.
- Separei configuração e Secrets.
- Criei manifests Kubernetes com probes, resources e acesso controlado.
- Justifiquei capacidade, HPA, PDB e connection budget.
- Modelei identidade, RBAC, NetworkPolicy e supply chain.
- Propus arquitetura cloud conceitual para backend.
- Diferenciei RDS, SQS, SNS, Redis e S3.
- Relacionei custos, segurança e observabilidade.
- Implantei apenas em namespace local exclusivo.
- Executei smoke test e validação da release.
- Simulei falha reversível.
- Executei rollback e repeti o smoke test.
- Criei risk register e decision log.
- Coletei evidence sanitizada.
- Registrei minha pontuação e lacunas técnicas.
- Não usei cloud pública, Secret real ou dados reais.
- Próxima aula: Refatoração final DevOps.
```

---

## Referência técnica curta

- DevOps Practical Assessment.
- CI/CD Pipeline Gates.
- Maven Build and Verification.
- Container Security and OCI Metadata.
- Kubernetes Deployments and Probes.
- Kubernetes RBAC and NetworkPolicy.
- Cloud Shared Responsibility.
- Managed Backend Services.
- Deployment Verification and Rollback.
- Technical Evidence and Decision Records.

Regra final:

```text
a prova prática DevOps precisa avaliar aplicação e diagnóstico, não memorização: o candidato registra baseline, constrói pipeline com gates, produz artifact rastreável, valida imagem Java 21 non-root, separa configuração e Secrets, cria manifests Kubernetes com probes, resources, HPA, PDB, ServiceAccount, RBAC e NetworkPolicy, justifica capacidade e connection budget, propõe arquitetura cloud conceitual com RDS, SQS, SNS, Redis e S3, relaciona custos, segurança e observabilidade, implanta apenas em namespace local, valida rollout, endpoints, health, release e correlation ID, simula falha reversível, executa rollback e repete smoke test; risk register, decision log e evidence sanitizada comprovam o resultado, enquanto credenciais reais, cloud pública, dados reais, destruição e gabarito são proibidos; as lacunas identificadas formam a entrada obrigatória para a aula 552 de Refatoracao final DevOps.
```
