# 553 - M17.48 - Aula ensinavel DevOps

## Apresentação da aula

Na aula 552, você concluiu a refatoração final de DevOps.

Os resultados da prova prática foram transformados em:

```text
findings normalizados;

prioridades;

ações corretivas;

ações preventivas;

testes de regressão;

comparação antes e depois;

riscos residuais;

readiness final.
```

A solução agora está mais segura, rastreável, observável e reversível.

Entretanto, dominar um assunto não significa automaticamente conseguir ensiná-lo.

Uma explicação pode estar tecnicamente correta e ainda falhar porque:

- começa pelo detalhe errado;
- usa termos sem contexto;
- mistura muitos conceitos;
- demonstra comandos sem explicar decisões;
- apresenta arquitetura sem fluxo;
- fala de segurança como lista;
- não verifica se a pessoa entendeu;
- não permite que o aluno diagnostique;
- entrega respostas antes de o aluno raciocinar;
- não conecta teoria e prática.

A pergunta central desta aula será:

```text
como transformar
o conhecimento de DevOps

em uma aula
clara,
progressiva,
prática
e verificável?
```

Você irá preparar uma aula ensinável sobre DevOps para backend Java.

A aula ensinável precisa permitir que outra pessoa compreenda:

```text
por que DevOps existe;

como código vira release;

como a release vira container;

como o container é executado;

como Kubernetes mantém o estado;

como cloud fornece capacidades;

como segurança reduz risco;

como observabilidade mostra o estado;

como rollback recupera.
```

O objetivo não é criar uma apresentação decorativa.

O objetivo é criar um percurso de aprendizagem.

Esse percurso precisa conter:

- ponto de partida;
- problema;
- modelo mental;
- sequência;
- exemplos;
- demonstrações;
- perguntas;
- exercícios;
- diagnóstico;
- critérios de entendimento;
- fechamento;
- ponte.

A regra central será:

```text
ensinar DevOps
é ensinar decisões
e relações de causa e efeito,

não apenas comandos
e nomes de ferramentas.
```

A aula continuará usando a `orders-api` como caso condutor.

A aplicação permite mostrar uma história completa:

```text
código;

build;

testes;

artifact;

imagem;

configuração;

Kubernetes;

release;

deploy;

observabilidade;

rollback.
```

Você não irá criar uma nova solução técnica.

Você irá transformar a solução consolidada em material didático.

A aula não antecipará:

```text
554 - M17.49 - Checklist operacional de deploy
```

Portanto, você poderá explicar o fluxo de deploy, mas não criará o checklist operacional completo da próxima aula.

Nenhuma cloud pública, credencial real, domínio, certificado, produção ou recurso externo será usado.

---

## Onde estamos na formação

A sequência oficial é:

```text
551:
Prova pratica DevOps.

552:
Refatoracao final DevOps.

553:
Aula ensinavel DevOps.

554:
Checklist operacional de deploy.
```

A aula 551 verificou:

```text
você consegue aplicar?
```

A aula 552 verificou:

```text
você consegue melhorar
com base em evidências?
```

A aula 553 verificará:

```text
você consegue explicar
para outra pessoa

sem perder
correção,
sequência
e profundidade?
```

Nesta aula:

```text
roteiro didático:
sim.

objetivos de aprendizagem:
sim.

modelo mental:
sim.

analogias:
sim.

demonstrações:
sim.

perguntas diagnósticas:
sim.

exercícios:
sim.

rubrica de entendimento:
sim.

plano de aula:
sim.

nova implementação técnica:
não.

checklist operacional completo:
não.

cloud real:
não.
```

A sequência pedagógica será:

```text
1.
problema antes da ferramenta.

2.
fluxo antes do componente.

3.
decisão antes do comando.

4.
demonstração antes do exercício.

5.
evidência antes da conclusão.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
teaching/devops
├── teaching-objectives.yaml
├── audience-profile.yaml
├── prerequisite-map.yaml
├── devops-teaching-story.yaml
├── concept-sequence.yaml
├── analogy-map.yaml
├── demonstration-plan.yaml
├── question-bank.yaml
├── exercise-progression.yaml
├── misconception-map.yaml
├── understanding-rubric.yaml
├── teaching-timebox.yaml
├── teaching-risk-register.yaml
├── teaching-readiness-checklist.yaml
└── teaching-evidence.yaml

scripts/teaching/devops
├── validate-teaching-objectives.ps1
├── validate-concept-sequence.ps1
├── validate-demonstration-plan.ps1
├── validate-question-bank.ps1
├── validate-exercise-progression.ps1
├── validate-misconception-coverage.ps1
├── simulate-teaching-session.ps1
├── collect-teaching-feedback.ps1
├── collect-teaching-evidence.ps1
└── verify-teaching-readiness.ps1

docs/teaching/devops
├── DEVOPS_TEACHING_PLAN.md
├── DEVOPS_TEACHING_SCRIPT.md
├── DEVOPS_WHITEBOARD_FLOW.md
├── DEVOPS_DEMONSTRATION_GUIDE.md
├── DEVOPS_QUESTION_GUIDE.md
├── DEVOPS_EXERCISE_GUIDE.md
├── DEVOPS_MISCONCEPTIONS.md
├── DEVOPS_UNDERSTANDING_RUBRIC.md
├── DEVOPS_TEACHING_TROUBLESHOOTING.md
└── DEVOPS_TEACHING_RETROSPECTIVE.md
```

Ao final, você terá:

```text
público definido;

pré-requisitos explícitos;

objetivos verificáveis;

história condutora;

sequência conceitual;

analogias controladas;

demonstrações preparadas;

perguntas progressivas;

exercícios graduais;

erros de entendimento mapeados;

rubrica de compreensão;

timebox;

evidence da aula.
```

Você irá:

1. definir o público;
2. definir pré-requisitos;
3. definir objetivos;
4. escolher o caso condutor;
5. criar o modelo mental;
6. sequenciar conceitos;
7. criar analogias;
8. limitar analogias;
9. planejar quadro;
10. planejar demonstrações;
11. planejar falhas;
12. criar perguntas de entrada;
13. criar perguntas de raciocínio;
14. criar exercícios;
15. criar rubrica;
16. mapear misconceptions;
17. criar timebox;
18. simular a aula;
19. coletar feedback;
20. ajustar o material;
21. validar prontidão;
22. commitar;
23. preparar a aula 554.

---

## Conceito essencial

### Aula ensinável

Aula que possui objetivos claros, sequência progressiva, exemplos, prática e critérios verificáveis de compreensão.

---

### Público-alvo

Grupo para o qual linguagem, exemplos, profundidade e ritmo são planejados.

---

### Pré-requisito

Conhecimento necessário para acompanhar a aula sem depender de adivinhação.

---

### Objetivo de aprendizagem

Comportamento observável que o aluno deverá demonstrar.

---

### Modelo mental

Representação simplificada usada para organizar relações entre conceitos.

---

### História condutora

Cenário contínuo que conecta os blocos da aula.

---

### Analogia

Comparação que facilita a compreensão, mas possui limites.

---

### Pergunta diagnóstica

Pergunta usada para descobrir o entendimento atual do aluno.

---

### Scaffolding

Suporte gradual oferecido até que o aluno execute sozinho.

---

### Misconception

Entendimento incorreto que parece plausível.

---

### Rubrica

Critérios graduais usados para avaliar a qualidade da compreensão.

---

### Evidência de aprendizagem

Demonstração observável de que o aluno compreendeu ou aplicou.

---

## Mão na massa guiada

### 1. Definir o público

Crie:

```text
audience-profile.yaml
```

Conteúdo:

```yaml
audience:
  role:
    junior-java-backend-developer

  experience:
    java:
      basic-to-intermediate

    git:
      basic

    linux:
      introductory

    docker:
      introductory

    kubernetes:
      none-or-introductory

    cloud:
      conceptual

  goals:
    - understand-delivery-flow
    - diagnose-common-failures
    - explain-release-traceability
    - participate-in-devops-decisions

  constraints:
    - no-production-access
    - local-environment
    - no-real-cloud-credentials
```

O conteúdo muda conforme o público.

Uma aula para arquitetos não começa no mesmo ponto de uma aula para iniciantes.

---

### 2. Definir pré-requisitos

Crie:

```text
prerequisite-map.yaml
```

Pré-requisitos mínimos:

```text
Java 21;

Maven;

Git;

HTTP;

variáveis de ambiente;

testes automatizados;

terminal;

conceito de processo.
```

Pré-requisitos desejáveis:

```text
Docker básico;

YAML;

rede básica;

PostgreSQL;

Spring Boot Actuator.
```

Cada pré-requisito ausente precisa de uma ação.

Exemplo:

```yaml
prerequisites:
  yaml:
    required:
      basic

    diagnosticQuestion:
      identify-key-value-and-list

    remediation:
      ten-minute-introduction
```

Não descubra a lacuna apenas no meio da demonstração.

---

### 3. Criar objetivos observáveis

Arquivo:

```text
teaching-objectives.yaml
```

Evite:

```text
entender DevOps.
```

Prefira:

```yaml
objectives:
  - id:
      OBJ-01

    learnerWill:
      explain-ci-delivery-deployment-difference

    evidence:
      scenario-classification

  - id:
      OBJ-02

    learnerWill:
      trace-source-to-runtime

    evidence:
      commit-artifact-digest-release-map

  - id:
      OBJ-03

    learnerWill:
      choose-readiness-and-liveness-behavior

    evidence:
      probe-decision-exercise

  - id:
      OBJ-04

    learnerWill:
      diagnose-failed-rollout

    evidence:
      kubernetes-failure-scenario

  - id:
      OBJ-05

    learnerWill:
      justify-a-safe-rollback

    evidence:
      rollback-defense
```

Objetivos precisam ser avaliáveis.

---

### 4. Definir o problema inicial

Comece a aula com uma situação.

Exemplo:

```text
a orders-api
funciona na máquina
do desenvolvedor,

mas falha
quando outra pessoa
tenta executar.
```

Pergunte:

- o que pode estar escondido;
- quais dependências estão implícitas;
- como reproduzir;
- como saber qual versão está rodando;
- como voltar quando falhar.

O problema cria necessidade para os conceitos.

Não comece mostrando quarenta arquivos YAML.

---

### 5. Criar a história condutora

Arquivo:

```text
devops-teaching-story.yaml
```

Conteúdo:

```yaml
story:
  application:
    orders-api

  startingState:
    - runs-on-developer-machine
    - configuration-implicit
    - no-release-identity
    - manual-deploy
    - weak-rollback

  transformation:
    - reproducible-build
    - automated-tests
    - immutable-artifact
    - non-root-container
    - externalized-configuration
    - kubernetes-desired-state
    - observable-release
    - verified-rollback

  finalState:
    - repeatable
    - traceable
    - secure
    - observable
    - reversible
```

A história evita que cada ferramenta pareça um assunto isolado.

---

### 6. Criar o modelo mental principal

Use o fluxo:

```text
source
→
build
→
tests
→
artifact
→
image
→
release
→
deployment
→
runtime
→
evidence.
```

Explique:

#### Source

Código e configuração versionados.

#### Build

Processo reproduzível.

#### Tests

Gates que reduzem risco.

#### Artifact

Resultado imutável.

#### Image

Runtime empacotado.

#### Release

Artifact associado a ambiente e decisão.

#### Deployment

Aplicação da release no ambiente.

#### Runtime

Processo realmente executado.

#### Evidence

Provas de identidade, saúde e recuperação.

Esse modelo será repetido durante a aula.

---

### 7. Criar sequência conceitual

Arquivo:

```text
concept-sequence.yaml
```

Sequência recomendada:

```yaml
sequence:
  - problem-and-flow
  - devops-and-feedback
  - ci-and-pipeline
  - artifact-and-traceability
  - container-and-configuration
  - kubernetes-desired-state
  - health-and-capacity
  - cloud-capabilities
  - security-and-observability
  - release-and-rollback
```

Não ensine HPA antes de explicar requests.

Não ensine rollback antes de artifact e release identity.

Não ensine NetworkPolicy antes de fluxo de rede.

---

### 8. Criar mapa de analogias

Arquivo:

```text
analogy-map.yaml
```

Analogia para pipeline:

```text
linha de inspeção
com gates.
```

Limite:

```text
software não é objeto físico;
gates podem executar em paralelo
e possuem feedback digital.
```

Analogia para artifact:

```text
pacote lacrado
com identificação.
```

Limite:

```text
imutabilidade precisa ser
comprovada por checksum ou digest.
```

Analogia para Kubernetes:

```text
termostato
comparando estado desejado
e estado atual.
```

Limite:

```text
Kubernetes reconcilia configuração,
mas não entende intenção de negócio.
```

Analogia para readiness:

```text
loja aberta
ou fechada para clientes.
```

Limite:

```text
o processo pode estar vivo
e ainda não estar apto.
```

Analogia para rollback:

```text
retornar à versão anterior.
```

Limite:

```text
efeitos externos e dados
podem não voltar automaticamente.
```

Sempre ensine o limite da analogia.

---

### 9. Planejar o quadro

Arquivo:

```text
DEVOPS_WHITEBOARD_FLOW.md
```

Divida o quadro em quatro áreas:

```text
1.
fluxo de entrega.

2.
identidade da release.

3.
estado da plataforma.

4.
feedback e recuperação.
```

No fluxo:

```text
commit
→
pipeline
→
JAR
→
image
→
digest
→
Deployment.
```

Na identidade:

```text
commit;

version;

checksum;

release ID;

image digest;

Pod imageID.
```

Na plataforma:

```text
Deployment;

Pod;

Service;

Ingress;

ConfigMap;

Secret.
```

No feedback:

```text
health;

logs;

metrics;

events;

smoke;

rollback.
```

O quadro precisa evoluir com a explicação.

---

### 10. Planejar a demonstração 1 — Build reproduzível

Arquivo:

```text
demonstration-plan.yaml
```

Primeira demonstração:

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

Antes de executar, pergunte:

```text
o que este comando
precisa provar?
```

Respostas esperadas:

- compilação;
- testes;
- validações;
- independência da IDE.

Depois mostre:

```powershell
git status

git diff --check
```

Explique que build aprovado e repositório sujo são sinais diferentes.

---

### 11. Planejar a demonstração 2 — Artifact

Mostre:

```powershell
Get-FileHash `
  target/orders-api.jar `
  -Algorithm `
  SHA256
```

Pergunte:

```text
por que o nome do arquivo
não basta?
```

Explique:

- nomes podem repetir;
- tags podem mudar;
- checksum identifica conteúdo;
- commit conecta origem;
- release ID conecta ambiente.

Evite apresentar checksum como segurança completa.

Ele comprova integridade, não ausência de vulnerabilidade.

---

### 12. Planejar a demonstração 3 — Container

Mostre:

```powershell
docker image inspect `
  orders-api:teaching
```

Peça ao aluno para encontrar:

- user;
- labels;
- entrypoint;
- exposed port;
- environment;
- image ID.

Depois:

```powershell
docker history `
  --no-trunc `
  orders-api:teaching
```

Pergunte:

```text
onde um Secret
poderia aparecer?
```

A demonstração precisa ensinar inspeção, não apenas build.

---

### 13. Planejar a demonstração 4 — Configuração inválida

Inicie a aplicação sem `APP_RELEASE_ID` em profile de deploy.

Resultado esperado:

```text
startup bloqueado.
```

Pergunte:

```text
falhar cedo
é problema
ou proteção?
```

Explique que uma release sem identidade não deveria receber tráfego.

Mostre o erro sem expor valores sensíveis.

---

### 14. Planejar a demonstração 5 — Kubernetes

Renderize:

```powershell
kubectl kustomize `
  k8s/deploy-ready/overlays/final-simple
```

Antes do apply, peça ao aluno para localizar:

- namespace;
- image;
- digest;
- ConfigMap;
- Secret reference;
- probes;
- requests;
- limits;
- Service;
- NetworkPolicy.

Isso transforma YAML em sistema.

---

### 15. Planejar a demonstração 6 — Rollout

Execute em ambiente local:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-final
```

Depois:

```powershell
kubectl get pod,service,endpointslice `
  --namespace `
  formacao-java-deploy-final
```

Pergunte:

```text
Deployment disponível
significa
fluxo funcional aprovado?
```

A resposta precisa levar ao smoke test.

---

### 16. Planejar a demonstração 7 — Falha e rollback

Use uma regressão reversível.

Exemplo:

```text
readiness path inválido.
```

Mostre:

- rollout travando;
- Pods não Ready;
- Service sem endpoints novos;
- events;
- logs;
- histórico;
- rollback;
- novo smoke test.

A demonstração precisa mostrar diagnóstico antes da correção.

Não execute rollback imediatamente sem observar sinais.

---

### 17. Criar banco de perguntas

Arquivo:

```text
question-bank.yaml
```

Nível 1 — reconhecimento:

- o que é artifact;
- o que é readiness;
- o que é digest.

Nível 2 — explicação:

- por que configuração fica fora da imagem;
- por que liveness não deve depender do banco;
- por que deploy por digest.

Nível 3 — aplicação:

- escolha probes;
- classifique uma propriedade;
- defina gate.

Nível 4 — diagnóstico:

- Service sem endpoints;
- Pod em CrashLoopBackOff;
- release endpoint divergente.

Nível 5 — decisão:

- rolling ou blue-green;
- retry ou fallback;
- rollback ou roll-forward.

Perguntas precisam evoluir.

---

### 18. Criar perguntas de entrada

Antes da aula:

```text
1.
o que acontece
entre git push
e aplicação rodando?

2.
como você descobre
qual versão está em execução?

3.
o que acontece
se o banco falhar?

4.
como você volta
para a versão anterior?

5.
onde uma senha
deveria ficar?
```

As respostas ajudam a ajustar o ritmo.

Não use a pergunta apenas para julgar.

Use para diagnosticar.

---

### 19. Criar progressão de exercícios

Arquivo:

```text
exercise-progression.yaml
```

Exercício 1 — ordenar fluxo:

```text
image;

commit;

artifact;

tests;

runtime;

build.
```

Exercício 2 — classificar configuração:

```text
log level;

database password;

release ID;

timeout;

token.
```

Exercício 3 — escolher probe.

Exercício 4 — encontrar erro de selector.

Exercício 5 — justificar HPA e pool.

Exercício 6 — diagnosticar rollout.

Exercício 7 — escolher estratégia de release.

Exercício 8 — defender rollback.

Cada exercício reduz scaffolding.

---

### 20. Criar exercício guiado de fluxo

Entregue cartões ou linhas:

```text
commit;

mvn verify;

JAR;

Dockerfile;

image digest;

Deployment;

Pod imageID;

release endpoint.
```

Peça para ordenar.

Depois peça para conectar:

```text
qual evidência
liga uma etapa à próxima?
```

Resultados esperados:

- commit em build metadata;
- checksum no artifact;
- labels na imagem;
- digest no manifest;
- imageID no Pod;
- release ID no endpoint.

---

### 21. Criar exercício de diagnóstico

Cenário:

```text
Pods estão Running;

Service existe;

requisição falha.
```

O aluno deve investigar:

1. readiness;
2. Service selector;
3. EndpointSlice;
4. porta;
5. logs;
6. NetworkPolicy;
7. Ingress.

Não entregue a causa imediatamente.

Peça evidência para cada hipótese.

---

### 22. Criar exercise de decisão

Cenário:

```text
mudança de alto risco;

métricas fortes;

10 réplicas;

compatibilidade entre versões;

rollback rápido.
```

Pergunte:

- rolling;
- blue-green;
- canary;
- feature flag;
- combinação.

Não existe resposta única sem contexto adicional.

O aluno precisa explicitar:

- risco;
- custo;
- tráfego;
- abort;
- observabilidade;
- dados.

---

### 23. Mapear misconceptions

Arquivo:

```text
misconception-map.yaml
```

Misconception:

```text
DevOps é a equipe
que faz deploy.
```

Correção:

```text
DevOps é um modelo
de colaboração e fluxo.
```

Misconception:

```text
CI/CD sempre faz deploy.
```

Correção:

```text
CI integra;
delivery prepara;
deployment implanta.
```

Misconception:

```text
container é máquina virtual.
```

Correção:

```text
container compartilha
o kernel do host.
```

Misconception:

```text
Secret em Base64 está criptografado.
```

Correção:

```text
Base64 é codificação.
```

Misconception:

```text
Kubernetes corrige bugs.
```

Correção:

```text
Kubernetes reconcilia
o estado declarado.
```

Misconception:

```text
health 200 significa release correta.
```

Correção:

```text
saúde e identidade
são verificações diferentes.
```

---

### 24. Criar rubrica de entendimento

Arquivo:

```text
understanding-rubric.yaml
```

Nível 1:

```text
reconhece termos.
```

Nível 2:

```text
explica componentes isolados.
```

Nível 3:

```text
conecta fluxo
e executa com apoio.
```

Nível 4:

```text
diagnostica falhas
com evidência.
```

Nível 5:

```text
decide,
justifica
e ensina.
```

Para cada objetivo, defina evidência.

Exemplo:

```yaml
rubric:
  releaseTraceability:
    level1:
      names-commit-and-digest

    level3:
      maps-commit-to-runtime

    level5:
      diagnoses-identity-divergence
```

---

### 25. Criar timebox

Arquivo:

```text
teaching-timebox.yaml
```

Plano de 120 minutos:

```text
10 minutos:
diagnóstico inicial.

15 minutos:
problema e fluxo.

15 minutos:
CI, artifact e identidade.

15 minutos:
container e configuração.

20 minutos:
Kubernetes e health.

10 minutos:
cloud, segurança
e observabilidade.

15 minutos:
falha e rollback.

15 minutos:
exercício integrado.

5 minutos:
fechamento.
```

Adapte conforme público.

Não tente cobrir profundidade total em tempo insuficiente.

---

### 26. Criar pausas de verificação

A cada bloco, use uma pergunta de saída.

Após CI:

```text
qual diferença
entre pipeline aprovado
e release implantada?
```

Após container:

```text
o que ainda varia
entre ambientes?
```

Após Kubernetes:

```text
o que acontece
quando readiness falha?
```

Após rollback:

```text
o que não volta
automaticamente?
```

Essas pausas evitam que dúvidas se acumulem.

---

### 27. Criar plano de feedback

O feedback precisa ser:

- específico;
- ligado ao objetivo;
- baseado em evidência;
- acionável;
- respeitoso;
- próximo da atividade.

Evite:

```text
"você não entendeu".
```

Prefira:

```text
"você identificou
o Service,

mas ainda não verificou
o EndpointSlice;

qual evidência
confirmaria os targets?"
```

O feedback deve devolver raciocínio ao aluno.

---

### 28. Preparar sessão simulada

Script:

```text
simulate-teaching-session.ps1
```

A simulação valida:

- arquivos presentes;
- objetivos ligados a exercícios;
- conceitos em ordem;
- demonstrações com fallback;
- comandos sem Secret;
- timebox;
- perguntas;
- rubrica;
- fechamento;
- ponte.

Ela não substitui ensaio humano.

---

### 29. Planejar falhas de demonstração

Demonstrações podem falhar por:

- porta ocupada;
- Docker parado;
- cluster ausente;
- imagem inexistente;
- registry indisponível;
- Metrics Server ausente;
- Ingress Controller ausente;
- path divergente;
- sistema operacional.

Para cada demonstração, crie fallback:

```text
execução ao vivo;

output previamente sanitizado;

manifest renderizado;

diagrama;

explicação do diagnóstico.
```

Nunca invente que a execução funcionou.

---

### 30. Criar risk register didático

Arquivo:

```text
teaching-risk-register.yaml
```

Riscos:

- público heterogêneo;
- excesso de conteúdo;
- demonstração longa;
- falha de ambiente;
- analogia confusa;
- aluno passivo;
- perguntas muito fáceis;
- respostas antecipadas;
- foco em ferramenta;
- falta de tempo para exercício.

Cada risco precisa de mitigação.

---

### 31. Criar guia de troubleshooting didático

Arquivo:

```text
DEVOPS_TEACHING_TROUBLESHOOTING.md
```

Cenários:

- alunos não diferenciam CI e CD;
- artifact e image são confundidos;
- readiness e liveness são confundidas;
- Kubernetes parece coleção de YAML;
- cloud vira lista de serviços;
- segurança vira checklist decorado;
- rollback é entendido como desfazer dados;
- perguntas não geram participação;
- demonstração consome todo o tempo;
- aluno copia comandos sem explicar.

A correção deve alterar a estratégia, não culpar o aluno.

---

### 32. Criar script da aula

Arquivo:

```text
DEVOPS_TEACHING_SCRIPT.md
```

Estrutura:

```text
abertura;

problema;

objetivos;

modelo mental;

bloco 1;

pergunta;

demonstração;

exercício;

bloco 2;

diagnóstico;

falha;

rollback;

síntese;

avaliação;

ponte.
```

O script não precisa ser lido palavra por palavra.

Ele garante sequência e cobertura.

---

### 33. Criar guia de demonstração

Arquivo:

```text
DEVOPS_DEMONSTRATION_GUIDE.md
```

Para cada demo:

```text
objetivo;

pré-condições;

comando;

sinal esperado;

pergunta antes;

pergunta depois;

falha provável;

fallback;

evidence.
```

Exemplo:

```text
demo:
readiness failure.

objetivo:
mostrar remoção do tráfego.

sinal:
Pod Running,
Ready false,
EndpointSlice alterado.

fallback:
output sanitizado.
```

---

### 34. Criar guia de perguntas

Arquivo:

```text
DEVOPS_QUESTION_GUIDE.md
```

Organize por:

- abertura;
- compreensão;
- aplicação;
- diagnóstico;
- decisão;
- fechamento.

Marque perguntas que aceitam múltiplas respostas.

Registre critérios de uma resposta forte.

Não transforme perguntas abertas em gabarito rígido.

---

### 35. Criar evidence de ensino

Arquivo:

```text
teaching-evidence.yaml
```

Campos permitidos:

- lesson;
- audience profile;
- objectives count;
- prerequisites validated;
- demonstrations count;
- exercises count;
- misconceptions covered;
- timebox status;
- simulation status;
- feedback collected;
- understanding rubric status;
- real secrets zero;
- cloud resources zero;
- timestamp.

Não inclua:

- dados pessoais de aluno;
- gravação sem autorização;
- notas identificáveis;
- credenciais;
- logs completos;
- ambiente corporativo.

---

### 36. Coletar feedback

Script:

```text
collect-teaching-feedback.ps1
```

Perguntas:

```text
qual conceito ficou claro?

qual conceito ficou confuso?

em qual momento
a sequência quebrou?

qual demonstração ajudou?

qual exercício exigiu raciocínio?

qual termo precisa de definição?

o ritmo foi adequado?

você consegue explicar
o fluxo completo?
```

O feedback deve alterar o material quando houver padrão.

Um comentário isolado pode ser registrado sem mudança imediata.

---

### 37. Criar retrospectiva

Arquivo:

```text
DEVOPS_TEACHING_RETROSPECTIVE.md
```

Registre:

- objetivo alcançado;
- evidências;
- desvios;
- dúvidas frequentes;
- demos que funcionaram;
- demos que falharam;
- timebox real;
- exercícios;
- misconceptions persistentes;
- mudanças futuras.

A retrospectiva não deve culpar o público.

---

### 38. Validar alinhamento

O script:

```text
validate-teaching-objectives.ps1
```

deve verificar:

```text
objetivo
→
conteúdo
→
demonstração
→
exercício
→
evidência.
```

Um objetivo sem exercício é difícil de comprovar.

Um exercício sem objetivo vira atividade desconectada.

---

### 39. Validar progressão

Execute:

```powershell
.\scripts\teaching\devops\validate-concept-sequence.ps1

.\scripts\teaching\devops\validate-exercise-progression.ps1

.\scripts\teaching\devops\validate-misconception-coverage.ps1
```

Confirme:

- pré-requisitos antes dos conceitos;
- exemplos antes dos desafios;
- exercícios do simples ao diagnóstico;
- nenhuma resposta antecipada;
- misconceptions cobertas;
- parte prática compatível com o tempo.

---

### 40. Executar gate de prontidão

Execute:

```powershell
.\scripts\teaching\devops\validate-teaching-objectives.ps1

.\scripts\teaching\devops\validate-concept-sequence.ps1

.\scripts\teaching\devops\validate-demonstration-plan.ps1

.\scripts\teaching\devops\validate-question-bank.ps1

.\scripts\teaching\devops\validate-exercise-progression.ps1

.\scripts\teaching\devops\validate-misconception-coverage.ps1

.\scripts\teaching\devops\simulate-teaching-session.ps1

.\scripts\teaching\devops\collect-teaching-evidence.ps1

.\scripts\teaching\devops\verify-teaching-readiness.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- público definido;
- pré-requisitos mapeados;
- objetivos observáveis;
- sequência progressiva;
- analogias com limites;
- quadro preparado;
- demonstrações com fallback;
- perguntas progressivas;
- exercícios alinhados;
- misconceptions cobertas;
- rubrica criada;
- timebox válido;
- evidence sanitizada;
- nenhuma cloud real;
- nenhum Secret real;
- conteúdo pronto para ser ensinado.

---

## Entendendo o que foi feito

### Conhecimento técnico virou percurso

Os conceitos foram organizados em uma sequência.

### A `orders-api` virou história condutora

Ferramentas deixaram de parecer assuntos isolados.

### Objetivos viraram comportamentos

A aula passou a exigir evidências de aprendizagem.

### Analogias ganharam limites

Comparações deixaram de substituir o conceito real.

### Demonstrações ganharam intenção

Cada comando passou a responder a uma pergunta.

### Falhas ganharam valor didático

O diagnóstico foi ensinado antes da correção.

### Perguntas ganharam progressão

Reconhecimento evoluiu para decisão.

### Exercícios ganharam scaffolding

O suporte diminui conforme o aluno avança.

### Misconceptions ganharam tratamento

Erros plausíveis passaram a ser abordados explicitamente.

### Feedback ganhou ligação com evidência

A correção ficou específica e acionável.

### A aula ganhou prontidão

Conteúdo, demonstração, prática e avaliação foram alinhados.

---

## Erros comuns importantes

### Começar pelo Kubernetes

O aluno vê YAML sem entender o fluxo.

### Ensinar comandos sem problema

A memorização substitui o raciocínio.

### Usar analogia sem limite

O aluno leva a comparação além do válido.

### Fazer demonstração longa

A aula vira observação passiva.

### Corrigir imediatamente

O aluno não aprende diagnóstico.

### Perguntar e responder sozinho

A pergunta deixa de ser ferramenta de aprendizagem.

### Avaliar apenas definição

Reconhecer termos não prova aplicação.

### Expor dados reais em demo

O risco técnico e pedagógico aumenta.

### Tentar ensinar todo o módulo em detalhes

A profundidade desaparece.

### Antecipar o checklist operacional

A aula 554 possui esse objetivo específico.

---

## Comandos úteis

### Validar objetivos

```powershell
.\scripts\teaching\devops\validate-teaching-objectives.ps1
```

### Validar demonstrações

```powershell
.\scripts\teaching\devops\validate-demonstration-plan.ps1
```

### Simular sessão

```powershell
.\scripts\teaching\devops\simulate-teaching-session.ps1
```

### Coletar evidence

```powershell
.\scripts\teaching\devops\collect-teaching-evidence.ps1
```

### Verificar prontidão

```powershell
.\scripts\teaching\devops\verify-teaching-readiness.ps1
```

---

## Exercício guiado

### Parte 1 — Público

Defina experiência, objetivos e restrições.

### Parte 2 — Pré-requisitos

Crie perguntas diagnósticas e remediações.

### Parte 3 — Objetivos

Escreva comportamentos observáveis.

### Parte 4 — História

Use a `orders-api` do problema ao rollback.

### Parte 5 — Sequência

Ordene conceitos por dependência.

### Parte 6 — Demonstrações

Defina pergunta, comando, sinal e fallback.

### Parte 7 — Perguntas

Crie níveis de reconhecimento a decisão.

### Parte 8 — Exercícios

Reduza scaffolding progressivamente.

### Parte 9 — Rubrica

Defina evidências de compreensão.

### Parte 10 — Simulação

Execute a aula e registre feedback.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 552 e ponte para a aula 554 foram preservadas;
- a aula ensinável transforma conhecimento consolidado em percurso didático;
- público-alvo, pré-requisitos e restrições foram definidos;
- objetivos de aprendizagem são observáveis e possuem evidência;
- a `orders-api` é usada como história condutora;
- o fluxo source, build, tests, artifact, image, release, deployment, runtime e evidence foi organizado;
- conceitos foram sequenciados por dependência;
- analogias incluem limites explícitos;
- quadro didático relaciona fluxo, identidade, plataforma e feedback;
- demonstrações possuem objetivo, pré-condições, pergunta, sinal, falha, fallback e evidence;
- build, artifact, container, configuração, Kubernetes, rollout e rollback aparecem nas demonstrações;
- perguntas evoluem de reconhecimento para decisão;
- exercícios evoluem do simples para diagnóstico;
- misconceptions de DevOps, CI/CD, container, Secret, Kubernetes e health foram mapeadas;
- rubrica possui níveis de reconhecimento, aplicação, diagnóstico e ensino;
- timebox é compatível com o conteúdo;
- pausas de verificação foram planejadas;
- feedback é específico, acionável e baseado em evidência;
- sessão simulada valida alinhamento;
- riscos didáticos possuem mitigação;
- troubleshooting didático foi criado;
- script, guia de demonstração, guia de perguntas e retrospectiva foram criados;
- objetivo, conteúdo, demonstração, exercício e evidence permanecem alinhados;
- dados pessoais, credenciais e outputs sensíveis são proibidos;
- cloud resources e real secrets permanecem em zero;
- nenhum checklist operacional completo da aula 554 foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/teaching/devops `
  scripts/teaching/devops `
  docs/teaching/devops `
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
git commit -m "docs(m17): transformar DevOps em aula ensinavel"
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
- dados pessoais;
- gravação sem autorização;
- logs completos;
- material corporativo;
- checklist operacional completo da aula 554.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a solução consolidada de DevOps foi transformada em uma aula ensinável.

O material passou a possuir:

```text
público;

pré-requisitos;

objetivos;

história;

modelo mental;

sequência;

analogias;

demonstrações;

perguntas;

exercícios;

rubrica;

feedback;

retrospectiva.
```

Você comprovou que ensinar DevOps não significa listar ferramentas; o problema precisa aparecer antes da solução; objetivos precisam ser observáveis; conceitos precisam respeitar dependências; analogias precisam de limites; demonstrações precisam responder perguntas; falhas precisam ser diagnosticadas; perguntas precisam evoluir; exercícios precisam reduzir suporte; misconceptions precisam ser tratadas; feedback precisa usar evidência; e uma aula só está pronta quando conteúdo, prática e avaliação estão alinhados.

A próxima aula será:

```text
554 - M17.49 - Checklist operacional de deploy
```

Nela, você irá transformar os conhecimentos técnicos e operacionais em um checklist executável para preparação, autorização, implantação, validação, rollback e encerramento de deploy.

Nenhum checklist operacional completo, sequência final de aprovação ou runbook específico da aula 554 foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini público e pré-requisitos.
- [ ] Criei objetivos observáveis.
- [ ] Organizei a história condutora.
- [ ] Sequenciei os conceitos.
- [ ] Planejei analogias e limites.
- [ ] Preparei demonstrações e fallbacks.
- [ ] Criei perguntas, exercícios e rubrica.
- [ ] Simulei a aula e coletei evidence.

---

## Troubleshooting adicional

### O público possui níveis muito diferentes

Crie diagnóstico inicial, trilha mínima e desafios avançados opcionais.

### A aula ficou extensa

Reduza quantidade de conceitos ou divida em sessões.

### A demonstração falhou

Use o fallback sanitizado e transforme a falha em diagnóstico.

### Os alunos memorizam comandos

Peça previsão, justificativa e evidência antes da execução.

### Ninguém responde às perguntas

Aguarde, reduza escopo e peça comparação entre alternativas.

### Readiness e liveness continuam confusas

Use cenários diferentes e peça a ação esperada da plataforma.

### Kubernetes parece abstrato

Volte ao fluxo Deployment, Pod, Service e tráfego.

### Cloud virou catálogo

Retorne ao problema e à capacidade necessária.

### O exercício ficou fácil

Remova scaffolding e introduza evidência incompleta.

### O checklist da próxima aula apareceu

Remova e preserve o conteúdo operacional para a aula 554.

---

## Perguntas de revisão

1. O que torna uma aula ensinável?
2. Por que definir o público?
3. O que é objetivo observável?
4. Para que serve a história condutora?
5. O que é modelo mental?
6. Por que sequenciar conceitos?
7. Qual o risco de uma analogia?
8. O que uma demonstração precisa possuir?
9. Para que serve uma pergunta diagnóstica?
10. O que é scaffolding?
11. O que é misconception?
12. Como criar progressão de exercícios?
13. O que uma rubrica avalia?
14. Por que planejar fallback?
15. Como usar uma falha didaticamente?
16. Como dar feedback acionável?
17. Como validar alinhamento?
18. O que entra na evidence de ensino?
19. Quando o material está pronto?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Objetivos, sequência, prática e evidência.
2. Ajustar linguagem e profundidade.
3. Comportamento que pode ser demonstrado.
4. Conectar conceitos.
5. Organizar relações.
6. Respeitar dependências.
7. Ser levada além do limite.
8. Objetivo, sinal, pergunta e fallback.
9. Descobrir entendimento atual.
10. Suporte gradual.
11. Entendimento incorreto plausível.
12. Reduzir apoio progressivamente.
13. Qualidade da compreensão.
14. Preservar a aula diante de falha.
15. Diagnosticar antes de corrigir.
16. Ligar observação a próximo passo.
17. Objetivo, exercício e evidência.
18. Status sanitizados e feedback.
19. Quando o gate de prontidão passa.
20. Checklist operacional de deploy.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 553 - M17.48 - Aula ensinavel DevOps

- Continuei após a Refatoração final DevOps.
- Transformei o conhecimento técnico em percurso didático.
- Defini público-alvo, experiência e restrições.
- Mapeei pré-requisitos e remediações.
- Criei objetivos de aprendizagem observáveis.
- Usei a `orders-api` como história condutora.
- Organizei o fluxo source, build, artifact, image, release e runtime.
- Sequenciei conceitos por dependência.
- Criei analogias e registrei seus limites.
- Planejei o quadro em fluxo, identidade, plataforma e feedback.
- Preparei demonstrações de build, artifact, container, configuração, Kubernetes e rollback.
- Criei perguntas de reconhecimento, aplicação, diagnóstico e decisão.
- Criei exercícios com scaffolding progressivo.
- Mapeei misconceptions frequentes.
- Criei rubrica de entendimento.
- Defini timebox e pausas de verificação.
- Planejei feedback específico e acionável.
- Criei fallbacks para falhas de demonstração.
- Simulei a sessão e validei alinhamento.
- Coletei evidence de ensino sanitizada.
- Não usei cloud pública, Secret real ou dados pessoais.
- Não antecipei o checklist operacional completo.
- Próxima aula: Checklist operacional de deploy.
```

---

## Referência técnica curta

- Learning Objectives.
- Backward Design.
- Scaffolding.
- Formative Assessment.
- Diagnostic Questions.
- Misconception-Based Teaching.
- Live Coding and Demonstration Design.
- Technical Teaching Rubrics.
- Feedback for Learning.
- Teaching Retrospectives.

Regra final:

```text
a aula ensinável de DevOps precisa transformar a solução técnica em percurso de aprendizagem: o público e os pré-requisitos definem linguagem e profundidade, objetivos descrevem comportamentos observáveis, a orders-api conduz a história do source ao runtime e o modelo mental conecta build, tests, artifact, image, release, deployment e evidence; conceitos são ensinados na ordem das dependências, analogias possuem limites, o quadro mostra fluxo, identidade, plataforma e feedback, e cada demonstração possui objetivo, pergunta, sinal esperado, falha provável e fallback; perguntas evoluem de reconhecimento para decisão, exercícios reduzem scaffolding, misconceptions são tratadas explicitamente e a rubrica verifica explicação, aplicação, diagnóstico e ensino; feedback usa evidência, a sessão é simulada, dados e Secrets permanecem ausentes e o checklist operacional completo fica reservado para a aula 554.
```
