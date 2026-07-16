# 711 - M20.41 - Entrevista DevOps cloud

## Apresentação da aula

Na aula 710, você concluiu a preparação para uma entrevista de segurança.

O material anterior organizou:

- fundamentos de segurança;
- threat modeling;
- autenticação;
- autorização;
- OAuth2;
- OpenID Connect;
- JWT;
- sessões;
- senhas;
- criptografia;
- secrets;
- OWASP;
- injection;
- XSS;
- CSRF;
- CORS;
- SSRF;
- IDOR;
- tenant isolation;
- rate limiting;
- logging;
- testes negativos;
- resposta a incidentes;
- duas entrevistas simuladas;
- scorecard;
- report, evidence e gate.

Agora você avançará para uma entrevista DevOps cloud.

Esse tipo de entrevista não mede apenas se você sabe escrever um `Dockerfile` ou clicar em um serviço de nuvem.

Ela avalia se você entende como uma aplicação sai do código-fonte e se transforma em um serviço:

- compilado;
- testado;
- empacotado;
- identificado;
- distribuído;
- configurado;
- implantado;
- monitorado;
- escalado;
- protegido;
- recuperado.

Perguntas comuns:

- qual a diferença entre imagem e container?
- por que usar multi-stage build?
- o que torna uma imagem reproduzível?
- por que não executar como root?
- o que é camada de imagem?
- como funciona cache de build?
- o que é um registry?
- como proteger a supply chain?
- o que significa build once, deploy many?
- como organizar CI e CD?
- para que serve um artifact?
- por que fixar uma imagem por digest?
- como funciona um Deployment no Kubernetes?
- qual a diferença entre liveness e readiness?
- quando usar horizontal scaling?
- o que é rolling update?
- como fazer rollback?
- como uma aplicação encontra outra na rede?
- o que é balanceamento de carga?
- o que é IAM?
- como evitar privilégios excessivos?
- o que medir para operar um sistema?
- como diagnosticar um pod em CrashLoopBackOff?
- como investigar uma pipeline que falha apenas em produção?
- como equilibrar confiabilidade e custo?

Uma resposta superficial diz:

```text
Docker serve para empacotar a aplicacao.
```

Uma resposta profissional explica:

```text
uma imagem Docker empacota
filesystem,
runtime
e configuracao de execucao;

o container e uma instancia isolada dessa imagem,
compartilhando o kernel do host;

a qualidade depende de
reprodutibilidade,
menor superficie,
usuario sem privilegio,
scan,
assinatura,
configuracao externa
e observabilidade.
```

Nesta aula, você treinará:

- Linux e processos;
- containers;
- imagens;
- Dockerfiles;
- Docker Compose;
- registries;
- supply chain;
- CI/CD;
- GitHub Actions;
- artifacts;
- SBOM;
- assinatura;
- ambientes;
- configuração;
- Kubernetes;
- pods;
- deployments;
- services;
- ingress;
- health checks;
- requests e limits;
- autoscaling;
- redes;
- DNS;
- load balancing;
- cloud;
- IAM;
- storage;
- observabilidade;
- deploy;
- rollback;
- custo;
- troubleshooting;
- exercícios;
- entrevista simulada.

A próxima aula será:

```text
712 - M20.42 - Entrevista arquitetura
```

Na aula 712, você consolidará decisões de arquitetura, requisitos funcionais e não funcionais, boundaries, consistência, mensageria, dados, escalabilidade, segurança, observabilidade, trade-offs e defesa de desenho sistêmico.

Nesta aula, arquitetura será usada para contextualizar infraestrutura, mas a banca arquitetural completa ficará preservada.

O laboratório será:

```text
labs/m20/aula-711-entrevista-DevOps-cloud/orderflow-DevOps-cloud-interview
```

Regra central:

```text
uma boa entrevista DevOps cloud
nao mede apenas comandos;

ela mede
se voce entende
entrega,
runtime,
infraestrutura,
operacao,
seguranca,
confiabilidade
e custo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
708:
Entrevista Spring JPA.

709:
Entrevista SQL banco.

710:
Entrevista seguranca.

711:
Entrevista DevOps cloud.

712:
Entrevista arquitetura.

713:
Entrevista comportamental tecnica.
```

A aula 711 utiliza como fonte:

- Dockerfiles do OrderFlow;
- Docker Compose;
- workflows;
- pipelines;
- artifacts;
- manifests;
- deployment simulation;
- runbooks;
- observabilidade;
- performance baseline;
- reports;
- evidence;
- SBOM;
- scans;
- política de releases;
- decisões de segurança;
- respostas das aulas anteriores.

A entrevista conecta infraestrutura e aplicação.

Quando falar de health check, explique o comportamento do processo Java.

Quando falar de scaling, explique CPU, latência, backlog, consumer lag e banco.

Quando falar de rollback, explique compatibilidade de schema.

Quando falar de secrets, explique injeção e rotação.

Quando falar de observabilidade, conecte logs, métricas, traces e alertas a uma ação operacional.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/interview-DevOps-cloud
├── DEVOPS_CLOUD_INTERVIEW_CHARTER.md
├── LINUX_RUNTIME_QUESTION_BANK.md
├── CONTAINERS_QUESTION_BANK.md
├── DOCKERFILE_QUESTION_BANK.md
├── DOCKER_COMPOSE_QUESTION_BANK.md
├── REGISTRY_SUPPLY_CHAIN_QUESTION_BANK.md
├── CI_CD_QUESTION_BANK.md
├── GITHUB_ACTIONS_QUESTION_BANK.md
├── ARTIFACT_RELEASE_QUESTION_BANK.md
├── CONFIGURATION_ENVIRONMENT_QUESTION_BANK.md
├── KUBERNETES_CORE_QUESTION_BANK.md
├── KUBERNETES_WORKLOAD_QUESTION_BANK.md
├── KUBERNETES_NETWORKING_QUESTION_BANK.md
├── HEALTH_SCALING_QUESTION_BANK.md
├── CLOUD_FOUNDATIONS_QUESTION_BANK.md
├── IAM_QUESTION_BANK.md
├── STORAGE_QUESTION_BANK.md
├── OBSERVABILITY_OPERATIONS_QUESTION_BANK.md
├── DEPLOYMENT_ROLLBACK_QUESTION_BANK.md
├── COST_RELIABILITY_QUESTION_BANK.md
├── DEVOPS_CLOUD_TROUBLESHOOTING.md
├── DEVOPS_CLOUD_EXERCISES.md
├── MOCK_DEVOPS_CLOUD_INTERVIEW.md
├── DEVOPS_CLOUD_SCORECARD.md
├── DEVOPS_CLOUD_REVIEW_CHECKLIST.md
├── DEVOPS_CLOUD_MATRIX.md
├── DEVOPS_CLOUD_RISK_REGISTER.md
├── DEVOPS_CLOUD_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/interview-DevOps-cloud
├── collect-DevOps-cloud-sources.ps1
├── generate-DevOps-cloud-question-bank.ps1
├── validate-DevOps-cloud-answers.ps1
├── run-container-exercises.ps1
├── validate-pipeline-security.ps1
├── run-infrastructure-troubleshooting.ps1
├── run-DevOps-cloud-mock-interview.ps1
├── generate-DevOps-cloud-report.ps1
└── collect-DevOps-cloud-evidence.ps1
```

Artifacts:

```text
reports/DevOps-cloud-interview-report.yaml

contracts/DevOps-cloud-interview-evidence.yaml
```

---

## Conceito essencial

### DevOps é fluxo de entrega e operação

Não é apenas uma ferramenta ou cargo.

### Container não é máquina virtual

Ele compartilha o kernel do host e isola processos por mecanismos do sistema operacional.

### Pipeline precisa produzir confiança

Executar comandos não basta; resultados precisam ser rastreáveis.

### Cloud é responsabilidade compartilhada

O provedor protege partes da plataforma; a equipe continua responsável por configuração, identidades, dados e aplicação.

### Confiabilidade e custo precisam ser equilibrados

Mais redundância, retenção e capacidade também custam mais.

---

## Mão na massa guiada

### 1. Criar DevOps Cloud Interview Charter

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_INTERVIEW_CHARTER.md
```

Princípios:

```text
builds are reproducible;

artifacts are immutable;

permissions are minimal;

configuration is external;

deployments are observable;

rollbacks are planned;

cost is measured;

architecture interview belongs to lesson 712.
```

---

## Linux e runtime

### 2. Criar Linux Runtime Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/LINUX_RUNTIME_QUESTION_BANK.md
```

---

### 3. Explicar processo

Processo é uma instância de programa em execução, com PID, memória, descritores e estado.

---

### 4. Explicar thread

Thread compartilha recursos do processo e possui contexto de execução próprio.

---

### 5. Explicar sinal

Sinais comunicam eventos ao processo.

`SIGTERM` permite shutdown controlado.

`SIGKILL` encerra sem cleanup.

---

### 6. Explicar exit code

Código zero normalmente indica sucesso.

Código diferente de zero indica falha segundo o contrato do programa.

---

### 7. Explicar stdout e stderr

Containers normalmente enviam logs para esses streams.

---

### 8. Explicar filesystem e permissões

Owner, group e mode controlam acesso.

Evite escrever em caminhos não autorizados.

---

### 9. Explicar variável de ambiente

Adequada para configuração simples, mas exige cuidado com secrets e exposição em diagnósticos.

---

### 10. Explicar limite de recursos

CPU e memória limitadas afetam GC, threads, pool e latência da JVM.

---

## Containers

### 11. Criar Containers Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/CONTAINERS_QUESTION_BANK.md
```

---

### 12. Diferenciar imagem e container

Imagem é artifact imutável em camadas.

Container é instância executável.

---

### 13. Diferenciar container e VM

VM virtualiza hardware e possui kernel próprio.

Container compartilha kernel.

---

### 14. Explicar namespaces

Isolam recursos como processo, rede e mount.

---

### 15. Explicar cgroups

Controlam e contabilizam recursos.

---

### 16. Explicar camada gravável

Container possui camada efêmera sobre a imagem.

Dados importantes precisam de storage apropriado.

---

### 17. Explicar PID 1

O processo principal precisa tratar sinais e reap processos.

---

### 18. Explicar container stateless

Estado de aplicação não deve depender do filesystem efêmero do container.

---

### 19. Explicar rootless e non-root

Reduz impacto de comprometimento.

---

### 20. Explicar capacidade Linux

Permissões específicas podem substituir root, mas devem ser mínimas.

---

## Dockerfile

### 21. Criar Dockerfile Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/DOCKERFILE_QUESTION_BANK.md
```

---

### 22. Explicar `FROM`

Define base.

Use imagem confiável, atualizada e compatível.

---

### 23. Explicar multi-stage build

Separa compilação e runtime, reduzindo tamanho e superfície.

---

### 24. Explicar ordem de camadas

Passos estáveis antes de passos voláteis melhoram cache.

---

### 25. Explicar `COPY` seletivo

Evite copiar repository inteiro sem necessidade.

---

### 26. Explicar `.dockerignore`

Reduz contexto, tempo e risco de copiar secrets.

---

### 27. Explicar `RUN`

Cria camada durante build.

Combine comandos quando fizer sentido, sem perder legibilidade.

---

### 28. Explicar `CMD` e `ENTRYPOINT`

`ENTRYPOINT` define executável principal.

`CMD` fornece argumentos default.

---

### 29. Explicar usuário não root

Crie usuário e ajuste ownership.

---

### 30. Explicar imagem mínima

Menor imagem pode reduzir superfície, mas precisa manter compatibilidade e capacidade de diagnóstico.

---

### 31. Explicar tag e digest

Tag é referência mutável.

Digest identifica conteúdo.

---

### 32. Explicar reprodutibilidade

Fixe versões, controle dependências e registre provenance.

---

### 33. Explicar scan de imagem

Procura vulnerabilidades conhecidas em packages e base.

---

### 34. Explicar JVM em container

A JVM moderna reconhece limites, mas heap, CPU e threads ainda precisam ser configurados e medidos.

---

## Docker Compose

### 35. Criar Docker Compose Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/DOCKER_COMPOSE_QUESTION_BANK.md
```

---

### 36. Explicar serviço

Define container, imagem, environment, rede, volumes e health.

---

### 37. Explicar dependency order

`depends_on` organiza startup, mas prontidão precisa de health ou retry na aplicação.

---

### 38. Explicar volume

Persistência ou compartilhamento controlado.

---

### 39. Explicar network

Services se resolvem por nome na rede do Compose.

---

### 40. Explicar override local

Configuração local não deve substituir política de produção.

---

### 41. Explicar propósito

Compose é útil para desenvolvimento e integração local.

Não representa automaticamente produção.

---

## Registry e supply chain

### 42. Criar Registry Supply Chain Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/REGISTRY_SUPPLY_CHAIN_QUESTION_BANK.md
```

---

### 43. Explicar registry

Armazena e distribui imagens e manifests.

---

### 44. Explicar autenticação e autorização

Push e pull precisam de credenciais e escopos mínimos.

---

### 45. Explicar immutable tags

Reduz substituição silenciosa de releases.

---

### 46. Explicar SBOM

Lista componentes presentes no artifact.

---

### 47. Explicar assinatura

Permite verificar origem e integridade do artifact.

---

### 48. Explicar provenance

Registra como, onde e a partir de qual source o artifact foi produzido.

---

### 49. Explicar dependency pinning

Reduz mudanças inesperadas.

---

### 50. Explicar vulnerabilidade crítica

Considere explorabilidade, uso real, fix disponível e risco antes da promoção.

---

## CI/CD

### 51. Criar CI CD Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/CI_CD_QUESTION_BANK.md
```

---

### 52. Explicar integração contínua

Mudanças são integradas e verificadas frequentemente.

---

### 53. Explicar entrega contínua

Artifact fica pronto para promoção controlada.

---

### 54. Explicar implantação contínua

Mudanças aprovadas pelos gates chegam automaticamente ao ambiente alvo.

---

### 55. Explicar pipeline por estágios

Exemplo:

```text
checkout;

build;

unit;

integration;

security;

package;

publish;

deploy;

smoke.
```

---

### 56. Explicar fail fast

Checks baratos e críticos aparecem cedo.

---

### 57. Explicar paralelismo

Jobs independentes podem reduzir tempo, mas consomem recursos.

---

### 58. Explicar cache

Cache acelera, porém não deve substituir artifact confiável.

---

### 59. Explicar secret no pipeline

Use secret store e permissões por ambiente.

---

### 60. Explicar artifact promotion

Promova o mesmo artifact em vez de rebuildar.

---

### 61. Explicar manual approval

Adequado para ambientes ou ações de maior risco.

---

### 62. Explicar rollback gate

A equipe precisa saber quando interromper ou reverter.

---

## GitHub Actions

### 63. Criar GitHub Actions Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/GITHUB_ACTIONS_QUESTION_BANK.md
```

---

### 64. Explicar workflow, job e step

Workflow reage a eventos.

Job roda em runner.

Step executa action ou comando.

---

### 65. Explicar runner

Pode ser hospedado ou próprio.

Self-hosted aumenta controle e responsabilidade.

---

### 66. Explicar permissions

Defina `contents: read` por padrão e eleve apenas quando necessário.

---

### 67. Explicar eventos de pull request

Forks não devem receber secrets privilegiados.

---

### 68. Explicar action pinning

Fixar referência confiável reduz risco de alteração upstream.

---

### 69. Explicar matrix

Executa combinações de versões ou plataformas.

---

### 70. Explicar environment

Pode proteger secrets e exigir approval.

---

### 71. Explicar concurrency group

Evita deploys concorrentes indesejados.

---

### 72. Explicar artifact retention

Artifacts temporários precisam de retenção e sanitização.

---

## Artifacts e releases

### 73. Criar Artifact Release Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/ARTIFACT_RELEASE_QUESTION_BANK.md
```

---

### 74. Explicar artifact

Saída versionada de build:

- JAR;
- imagem;
- chart;
- SBOM;
- manifest;
- report.

---

### 75. Explicar imutabilidade

Artifact publicado não deve ser alterado.

---

### 76. Explicar checksum

Ajuda verificar integridade.

---

### 77. Explicar semantic versioning

Comunica mudanças compatíveis e incompatíveis quando adotado corretamente.

---

### 78. Explicar release notes

Conectam versão, mudanças, riscos, migrations e rollback.

---

### 79. Explicar build once

O mesmo digest atravessa ambientes.

---

## Configuração e ambientes

### 80. Criar Configuration Environment Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/CONFIGURATION_ENVIRONMENT_QUESTION_BANK.md
```

---

### 81. Explicar configuração externa

Imagem permanece igual; environment fornece valores.

---

### 82. Explicar config e secret

Configuração comum não deve ser tratada como secret.

Secret exige proteção adicional.

---

### 83. Explicar parity

Ambientes devem ser semelhantes no comportamento relevante, sem copiar dados reais.

---

### 84. Explicar feature flag

Permite habilitar comportamento sem novo deploy, mas adiciona dívida operacional.

---

### 85. Explicar drift

Diferenças não controladas entre ambientes causam falhas.

---

### 86. Explicar Infrastructure as Code conceitualmente

Infra declarativa, versionada e revisável reduz mudanças manuais.

---

## Kubernetes Core

### 87. Criar Kubernetes Core Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/KUBERNETES_CORE_QUESTION_BANK.md
```

---

### 88. Explicar cluster

Conjunto de control plane e workers.

---

### 89. Explicar pod

Menor unidade de execução, contendo um ou mais containers que compartilham rede e volumes.

---

### 90. Explicar declarative state

Você declara estado desejado; controllers reconciliam.

---

### 91. Explicar namespace

Organiza recursos e políticas.

Não é isolamento de segurança completo sozinho.

---

### 92. Explicar ConfigMap

Armazena configuração não sensível.

---

### 93. Explicar Secret do Kubernetes

É objeto para dados sensíveis, mas proteção real depende de RBAC, encryption at rest e acesso.

---

## Workloads

### 94. Criar Kubernetes Workload Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/KUBERNETES_WORKLOAD_QUESTION_BANK.md
```

---

### 95. Explicar Deployment

Gerencia ReplicaSets e rollout de workloads stateless.

---

### 96. Explicar StatefulSet

Fornece identidade e storage estáveis quando necessários.

---

### 97. Explicar Job

Executa trabalho finito.

---

### 98. Explicar CronJob

Agenda Jobs.

---

### 99. Explicar DaemonSet

Executa pod por node selecionado.

---

### 100. Explicar rolling update

Substitui réplicas progressivamente.

---

### 101. Explicar maxSurge e maxUnavailable

Controlam capacidade extra e indisponibilidade durante rollout.

---

### 102. Explicar rollback

Retorna a revisão anterior, mas schema e dependências precisam permanecer compatíveis.

---

## Networking

### 103. Criar Kubernetes Networking Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/KUBERNETES_NETWORKING_QUESTION_BANK.md
```

---

### 104. Explicar Service

Fornece endereço estável para pods.

---

### 105. Comparar ClusterIP, NodePort e LoadBalancer

ClusterIP:

- interno.

NodePort:

- porta nos nodes.

LoadBalancer:

- integra balanceador externo quando suportado.

---

### 106. Explicar Ingress

Roteia tráfego HTTP por host e path usando controller.

---

### 107. Explicar DNS

Services recebem nomes resolvíveis no cluster.

---

### 108. Explicar NetworkPolicy

Restringe tráfego quando o plugin suporta.

---

### 109. Explicar timeout entre serviços

Timeout deve existir em client, proxy e load balancer de forma coerente.

---

## Health e scaling

### 110. Criar Health Scaling Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/HEALTH_SCALING_QUESTION_BANK.md
```

---

### 111. Explicar liveness

Responde se o processo precisa ser reiniciado.

---

### 112. Explicar readiness

Responde se a instância pode receber tráfego.

---

### 113. Explicar startup probe

Protege aplicações com inicialização longa.

---

### 114. Explicar requests

Recursos usados para scheduling e garantia relativa.

---

### 115. Explicar limits

Teto de recurso; CPU pode sofrer throttling e memória pode causar encerramento.

---

### 116. Explicar HPA

Escala réplicas com métricas.

---

### 117. Explicar scaling por backlog

Workers assíncronos podem escalar por lag ou tamanho de fila, não apenas CPU.

---

### 118. Explicar limite do autoscaling

Banco, provider e broker podem virar gargalo.

---

## Cloud foundations

### 119. Criar Cloud Foundations Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/CLOUD_FOUNDATIONS_QUESTION_BANK.md
```

---

### 120. Explicar responsabilidade compartilhada

O provedor e o cliente possuem responsabilidades distintas conforme o serviço.

---

### 121. Explicar região e zona

Região agrupa localizações.

Zona representa domínio de falha separado dentro da região.

---

### 122. Explicar alta disponibilidade

Distribui componentes e remove pontos únicos dentro do objetivo de disponibilidade.

---

### 123. Explicar elasticidade

Capacidade muda conforme demanda.

---

### 124. Explicar serviço gerenciado

Reduz operação de infraestrutura, mas não elimina configuração, custo, backup ou segurança.

---

### 125. Explicar serverless conceitualmente

Execução gerenciada e orientada a eventos, com limites de runtime, latência, observabilidade e custo.

---

## IAM

### 126. Criar IAM Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/IAM_QUESTION_BANK.md
```

---

### 127. Explicar identidade humana e workload

Usuários e serviços precisam de identidades distintas.

---

### 128. Explicar role

Conjunto assumível de permissões.

---

### 129. Explicar policy

Define ações, recursos e condições.

---

### 130. Explicar credencial curta

Workload identity é preferível a chave estática quando disponível.

---

### 131. Explicar separation of duties

A mesma identidade não deve aprovar e executar tudo sem controle.

---

## Storage

### 132. Criar Storage Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/STORAGE_QUESTION_BANK.md
```

---

### 133. Comparar block, file e object storage

Block:

- volumes.

File:

- filesystem compartilhado.

Object:

- objetos por API.

---

### 134. Explicar persistência de container

Filesystem efêmero não guarda estado durável.

---

### 135. Explicar backup

Backup precisa de política, retenção, criptografia e restore testado.

---

### 136. Explicar RPO e RTO

RPO:

- perda aceitável de dados.

RTO:

- tempo aceitável de recuperação.

---

## Observabilidade e operação

### 137. Criar Observability Operations Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/OBSERVABILITY_OPERATIONS_QUESTION_BANK.md
```

---

### 138. Explicar logs, métricas e traces

Cada sinal responde perguntas diferentes.

---

### 139. Explicar golden signals

- latência;
- tráfego;
- erros;
- saturação.

---

### 140. Explicar SLI, SLO e SLA

SLI mede.

SLO define objetivo interno.

SLA é compromisso formal.

---

### 141. Explicar alertas acionáveis

Alerta precisa indicar impacto e resposta.

---

### 142. Explicar runbook

Guia ação operacional.

---

### 143. Explicar cardinalidade

Labels excessivas podem encarecer e degradar sistemas de métricas.

---

### 144. Relacionar observabilidade ao OrderFlow

Use:

- API latency;
- Outbox age;
- consumer lag;
- provider errors;
- projection freshness;
- journey duration.

---

## Deploy e rollback

### 145. Criar Deployment Rollback Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/DEPLOYMENT_ROLLBACK_QUESTION_BANK.md
```

---

### 146. Explicar rolling deployment

Substitui gradualmente.

---

### 147. Explicar blue-green

Dois ambientes completos permitem troca de tráfego.

---

### 148. Explicar canary

Expõe pequena parcela antes de ampliar.

---

### 149. Explicar smoke test

Confirma jornada mínima após deploy.

---

### 150. Explicar rollback de aplicação

Volta artifact, mas precisa respeitar dados, eventos e migrations.

---

### 151. Explicar roll-forward

Em muitos incidentes de schema, corrigir adiante é mais seguro.

---

### 152. Explicar feature flag no rollback

Pode desabilitar comportamento sem substituir artifact.

---

## Custo e confiabilidade

### 153. Criar Cost Reliability Question Bank

Arquivo:

```text
docs/interview-DevOps-cloud/COST_RELIABILITY_QUESTION_BANK.md
```

---

### 154. Explicar right-sizing

Ajusta requests, limits e tamanho de serviços com base em métricas.

---

### 155. Explicar overprovisioning

Aumenta margem, mas eleva custo.

---

### 156. Explicar reserved e spot conceitualmente

Capacidade reservada reduz preço com compromisso.

Spot é mais barata, porém interrompível.

---

### 157. Explicar custo de observabilidade

Logs, métricas, traces e retenção precisam de política.

---

### 158. Explicar egress

Transferência de dados pode gerar custo relevante.

---

### 159. Explicar FinOps

Prática de visibilidade, responsabilidade e otimização de custo.

---

## Troubleshooting

### 160. Criar DevOps Cloud Troubleshooting

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_TROUBLESHOOTING.md
```

---

### 161. Diagnosticar container que encerra

Verifique:

- exit code;
- logs;
- command;
- signal;
- memory;
- config.

---

### 162. Diagnosticar OOMKilled

Compare uso, limit, heap, native memory e carga.

---

### 163. Diagnosticar CrashLoopBackOff

Verifique eventos, logs anteriores, probes, config e dependências.

---

### 164. Diagnosticar ImagePullBackOff

Verifique nome, tag, registry, credencial e rede.

---

### 165. Diagnosticar pod Pending

Verifique requests, taints, affinity, quota e volume.

---

### 166. Diagnosticar readiness falhando

Verifique dependências, timeout e endpoint.

---

### 167. Diagnosticar pipeline intermitente

Verifique concorrência, dependência externa, cache, clock e recursos.

---

### 168. Diagnosticar deploy sem tráfego

Verifique Service selector, readiness, endpoints, Ingress e DNS.

---

### 169. Diagnosticar latência após scaling

Verifique cold start, pool, banco, cache e downstream.

---

### 170. Diagnosticar custo crescente

Analise recursos ociosos, retenção, egress, storage e logs.

---

## Exercícios

### 171. Criar DevOps Cloud Exercises

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_EXERCISES.md
```

---

### 172. Exercício 1: Dockerfile

Refatore build Java para multi-stage, non-root e imagem mínima.

---

### 173. Exercício 2: Compose

Suba API, PostgreSQL, Kafka e observabilidade com health checks.

---

### 174. Exercício 3: pipeline

Crie stages de build, test, scan, package e publish.

---

### 175. Exercício 4: permissions

Reduza permissões de workflow.

---

### 176. Exercício 5: Kubernetes

Modele Deployment, Service, ConfigMap e Secret.

---

### 177. Exercício 6: probes

Defina startup, readiness e liveness.

---

### 178. Exercício 7: resources

Escolha requests e limits usando baseline.

---

### 179. Exercício 8: scaling

Escalone worker por consumer lag.

---

### 180. Exercício 9: rollout

Planeje canary com métricas e rollback.

---

### 181. Exercício 10: incident

Diagnostique CrashLoopBackOff seguido de OOMKilled.

---

## Simulação

### 182. Criar Mock DevOps Cloud Interview

Arquivo:

```text
docs/interview-DevOps-cloud/MOCK_DEVOPS_CLOUD_INTERVIEW.md
```

Duração:

```text
85 a 100 minutos.
```

---

### 183. Estruturar simulação

1. Linux;
2. containers;
3. Dockerfile;
4. Compose;
5. registry;
6. supply chain;
7. CI/CD;
8. Actions;
9. artifacts;
10. config;
11. Kubernetes;
12. network;
13. health;
14. scaling;
15. cloud;
16. IAM;
17. storage;
18. observability;
19. deployment;
20. troubleshooting.

---

### 184. Criar follow-ups

Exemplos:

- e se o container rodar como root?
- e se a tag for sobrescrita?
- e se o rollback usar schema antigo?
- e se o HPA aumentar pressão no banco?
- e se a readiness depender de provider externo?
- e se o secret vazar no log do runner?
- e se a zona inteira falhar?
- e se o custo dobrar sem aumento de tráfego?

---

### 185. Gravar a entrevista

---

### 186. Criar DevOps Cloud Scorecard

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_SCORECARD.md
```

Critérios:

- Linux;
- containers;
- Docker;
- registry;
- supply chain;
- CI/CD;
- GitHub Actions;
- artifacts;
- configuration;
- Kubernetes;
- networking;
- health;
- scaling;
- cloud;
- IAM;
- storage;
- observability;
- deployment;
- cost;
- troubleshooting;
- comunicação.

---

### 187. Criar Review Checklist

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_REVIEW_CHECKLIST.md
```

Perguntas:

- diferenciei imagem e container?
- expliquei build once?
- protegi secrets?
- usei menor privilégio?
- tratei health corretamente?
- considerei banco ao escalar?
- expliquei rollback?
- medi custo?
- usei evidence?
- evitei antecipar arquitetura?

---

### 188. Criar Matrix

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_MATRIX.md
```

Colunas:

- tema;
- pergunta;
- resposta curta;
- aprofundamento;
- exemplo OrderFlow;
- evidence;
- score;
- revisão.

---

### 189. Criar Risk Register

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_RISK_REGISTER.md
```

Riscos:

```text
container confundido com VM;

imagem mutavel;

pipeline sem artifact;

workflow privilegiado;

probe incorreta;

autoscaling sem gargalo;

rollback sem schema;

cloud sem IAM;

custo ignorado;

arquitetura antecipada.
```

---

### 190. Criar Traceability

Arquivo:

```text
docs/interview-DevOps-cloud/DEVOPS_CLOUD_TRACEABILITY.md
```

Exemplo:

```text
build once
-> image digest
-> SBOM
-> signature
-> release evidence.

worker scaling
-> consumer lag
-> HPA policy
-> performance report.

rollback
-> release notes
-> migration compatibility
-> smoke test
-> runbook.
```

---

### 191. Criar boundary da próxima aula

Arquivo:

```text
docs/interview-DevOps-cloud/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 711 define:

- Linux runtime;
- containers;
- images;
- Dockerfiles;
- Compose;
- registries;
- supply chain;
- CI CD;
- GitHub Actions;
- artifacts;
- configuration;
- environments;
- Kubernetes;
- workloads;
- networking;
- probes;
- resources;
- autoscaling;
- cloud foundations;
- IAM;
- storage;
- observability;
- deployment;
- rollback;
- cost;
- troubleshooting;
- mock interview.

A aula 712 define:

- architecture interview;
- requirements;
- constraints;
- quality attributes;
- system context;
- boundaries;
- data ownership;
- consistency;
- messaging;
- scaling;
- availability;
- security;
- observability;
- deployment topology;
- trade-offs;
- architecture diagrams;
- formal architecture defense.

Nenhuma entrevista de arquitetura
e executada nesta aula.
```

---

## Validação final

### 192. Criar report

Arquivo:

```text
reports/DevOps-cloud-interview-report.yaml
```

Exemplo:

```yaml
DevOpsCloudInterview:
  questionBank:
    total:
      measured
    answered:
      measured

  scores:
    containers:
      measured
    Docker:
      measured
    CI_CD:
      measured
    supplyChain:
      measured
    Kubernetes:
      measured
    cloud:
      measured
    IAM:
      measured
    observability:
      measured
    deployment:
      measured
    troubleshooting:
      measured

  integrity:
    unsupportedAnswers:
      0
    contradictions:
      0
    sensitiveLeaks:
      0

  mockInterview:
    completed:
      true
    durationMinutes:
      measured

  architectureInterview:
    completed:
      false

  gate:
    PASS
```

---

### 193. Criar evidence

Arquivo:

```text
contracts/DevOps-cloud-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- Linux question count;
- container question count;
- Docker question count;
- Compose question count;
- registry question count;
- supply-chain question count;
- CI/CD question count;
- Actions question count;
- artifact question count;
- configuration question count;
- Kubernetes question count;
- networking question count;
- health question count;
- scaling question count;
- cloud question count;
- IAM question count;
- storage question count;
- observability question count;
- deployment question count;
- cost question count;
- troubleshooting question count;
- exercise count;
- completed exercise count;
- mock interview duration;
- average score;
- lowest topic;
- highest topic;
- unsupported answer count;
- contradiction count;
- sensitive leak count;
- admitted uncertainty count;
- architecture interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 194. Criar gate

Status:

```text
PASS;

FAIL_LINUX_RUNTIME;

FAIL_CONTAINERS;

FAIL_DOCKERFILE;

FAIL_DOCKER_COMPOSE;

FAIL_REGISTRY;

FAIL_SUPPLY_CHAIN;

FAIL_CI_CD;

FAIL_GITHUB_ACTIONS;

FAIL_ARTIFACT_RELEASE;

FAIL_CONFIGURATION;

FAIL_KUBERNETES_CORE;

FAIL_KUBERNETES_WORKLOAD;

FAIL_KUBERNETES_NETWORKING;

FAIL_HEALTH_PROBES;

FAIL_RESOURCE_MANAGEMENT;

FAIL_AUTOSCALING;

FAIL_CLOUD_FOUNDATIONS;

FAIL_IAM;

FAIL_STORAGE;

FAIL_OBSERVABILITY;

FAIL_DEPLOYMENT;

FAIL_ROLLBACK;

FAIL_COST;

FAIL_TROUBLESHOOTING;

FAIL_EXERCISE;

FAIL_MOCK_INTERVIEW;

FAIL_UNSUPPORTED_ANSWER;

FAIL_CONTRADICTION;

FAIL_SENSITIVE_LEAK;

FAIL_ARCHITECTURE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 195. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\interview-DevOps-cloud\collect-DevOps-cloud-sources.ps1

.\scripts\interview-DevOps-cloud\generate-DevOps-cloud-question-bank.ps1

.\scripts\interview-DevOps-cloud\validate-DevOps-cloud-answers.ps1

.\scripts\interview-DevOps-cloud\run-container-exercises.ps1

.\scripts\interview-DevOps-cloud\validate-pipeline-security.ps1

.\scripts\interview-DevOps-cloud\run-infrastructure-troubleshooting.ps1

.\scripts\interview-DevOps-cloud\collect-DevOps-cloud-evidence.ps1
```

---

### 196. Executar duas rodadas

Rodada 1:

```text
containers,
pipelines
e Kubernetes.
```

Rodada 2:

```text
cloud,
operacao,
custo
e troubleshooting.
```

---

### 197. Revisar gravações

Selecione:

- três respostas fortes;
- três respostas excessivamente genéricas;
- dois erros de Kubernetes;
- dois erros de pipeline;
- um plano de melhoria.

---

### 198. Repetir o tema mais fraco

---

### 199. Encerrar o laboratório

Confirme:

- Charter;
- Linux;
- containers;
- Docker;
- Compose;
- registry;
- supply chain;
- CI/CD;
- Actions;
- artifacts;
- config;
- environments;
- Kubernetes;
- workloads;
- network;
- probes;
- resources;
- scaling;
- cloud;
- IAM;
- storage;
- observability;
- deploy;
- rollback;
- cost;
- troubleshooting;
- exercises;
- mock;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 712 preservada.

---

## Entendendo o que foi feito

### Containers deixaram de parecer máquinas virtuais pequenas

Namespaces, cgroups, filesystem e processos foram diferenciados.

### Dockerfiles ganharam critérios

Cache, usuário, imagem, digest, scan e reprodutibilidade foram tratados.

### Pipelines passaram a produzir confiança

Build, testes, security, artifact e promoção formaram uma cadeia rastreável.

### Kubernetes ganhou comportamento

Controllers, workloads, Services, probes e resources foram explicados.

### Scaling ganhou limites

Banco, broker e provider foram considerados antes de aumentar réplicas.

### Cloud ganhou responsabilidade

IAM, zonas, storage, backup e custo passaram a fazer parte da resposta.

### Rollback ganhou contexto

Artifact, schema, dados, eventos e feature flags foram relacionados.

### Troubleshooting ganhou método

Eventos, logs, recursos, rede e dependências passaram a orientar o diagnóstico.

---

## Erros comuns importantes

### Tratar container como VM

O modelo de isolamento é diferente.

### Executar como root

O impacto de comprometimento aumenta.

### Rebuildar por ambiente

A identidade do artifact é perdida.

### Usar tag mutável em produção

A versão real fica ambígua.

### Colocar secret no YAML

O repositório pode expor credenciais.

### Usar liveness para dependência externa

Pode causar reinícios em cascata.

### Escalar apenas por CPU

Backlog e downstream podem ser mais relevantes.

### Fazer rollback sem pensar no schema

A aplicação antiga pode não entender os dados.

### Ignorar custo de logs

Retenção pode crescer rapidamente.

### Antecipar entrevista de arquitetura

Essa etapa pertence à aula 712.

---

## Comandos úteis

### Gerar perguntas

```powershell
.\scripts\interview-DevOps-cloud\generate-DevOps-cloud-question-bank.ps1
```

### Validar respostas

```powershell
.\scripts\interview-DevOps-cloud\validate-DevOps-cloud-answers.ps1
```

### Executar exercícios

```powershell
.\scripts\interview-DevOps-cloud\run-container-exercises.ps1
```

### Coletar evidence

```powershell
.\scripts\interview-DevOps-cloud\collect-DevOps-cloud-evidence.ps1
```

---

## Exercício principal

Realize uma entrevista simulada de 95 minutos.

Inclua:

1. processo;
2. sinal;
3. exit code;
4. imagem;
5. container;
6. namespaces;
7. cgroups;
8. non-root;
9. Dockerfile;
10. multi-stage;
11. cache;
12. digest;
13. Compose;
14. registry;
15. SBOM;
16. assinatura;
17. CI;
18. CD;
19. artifact promotion;
20. GitHub Actions;
21. permissions;
22. configuration;
23. secret;
24. Infrastructure as Code;
25. pod;
26. Deployment;
27. StatefulSet;
28. Service;
29. Ingress;
30. DNS;
31. NetworkPolicy;
32. liveness;
33. readiness;
34. startup probe;
35. requests;
36. limits;
37. HPA;
38. backlog scaling;
39. região;
40. zona;
41. IAM;
42. storage;
43. RPO;
44. RTO;
45. observability;
46. rollout;
47. rollback;
48. custo;
49. troubleshooting;
50. feedback.

Não realize a entrevista de arquitetura.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 710 e ponte para a aula 712 foram preservadas;
- DevOps Cloud Interview Charter foi criado;
- Linux Runtime Question Bank foi criado;
- processos, threads, sinais e exit codes foram explicados;
- stdout, stderr, filesystem e permissões foram explicados;
- environment e recursos foram explicados;
- Containers Question Bank foi criado;
- imagem, container e VM foram diferenciados;
- namespaces e cgroups foram explicados;
- filesystem efêmero foi explicado;
- PID 1 foi explicado;
- stateless foi explicado;
- non-root e capabilities foram explicados;
- Dockerfile Question Bank foi criado;
- base, multi-stage, cache e copy foram explicados;
- dockerignore foi explicado;
- RUN, CMD e ENTRYPOINT foram explicados;
- usuário, imagem mínima, tag, digest e reprodutibilidade foram explicados;
- scan e JVM em container foram explicados;
- Docker Compose Question Bank foi criado;
- services, dependencies, volumes, networks e overrides foram explicados;
- finalidade local foi contextualizada;
- Registry Supply Chain Question Bank foi criado;
- registry, autenticação, immutable tags, SBOM, assinatura e provenance foram explicados;
- dependency pinning e vulnerabilidades foram tratados;
- CI CD Question Bank foi criado;
- integração, entrega e implantação contínuas foram diferenciadas;
- stages, fail fast, paralelismo, cache, secrets, promoção, approval e rollback gate foram explicados;
- GitHub Actions Question Bank foi criado;
- workflow, job, step e runner foram explicados;
- permissions, forks, pinning, matrix, environments, concurrency e retention foram explicados;
- Artifact Release Question Bank foi criado;
- artifacts, imutabilidade, checksum, versionamento, release notes e build once foram explicados;
- Configuration Environment Question Bank foi criado;
- configuração externa, config, secret, parity, feature flags, drift e IaC foram explicados;
- Kubernetes Core Question Bank foi criado;
- cluster, pod, reconciliação, namespace, ConfigMap e Secret foram explicados;
- Kubernetes Workload Question Bank foi criado;
- Deployment, StatefulSet, Job, CronJob e DaemonSet foram explicados;
- rolling update, surge, unavailable e rollback foram explicados;
- Kubernetes Networking Question Bank foi criado;
- Service, ClusterIP, NodePort, LoadBalancer, Ingress, DNS, NetworkPolicy e timeouts foram explicados;
- Health Scaling Question Bank foi criado;
- liveness, readiness e startup foram diferenciados;
- requests, limits, HPA, backlog e gargalos foram explicados;
- Cloud Foundations Question Bank foi criado;
- responsabilidade compartilhada, região, zona, disponibilidade, elasticidade, serviços gerenciados e serverless foram explicados;
- IAM Question Bank foi criado;
- identidades, roles, policies, credenciais curtas e separation of duties foram explicados;
- Storage Question Bank foi criado;
- block, file e object storage foram comparados;
- persistência, backup, RPO e RTO foram explicados;
- Observability Operations Question Bank foi criado;
- logs, métricas, traces, golden signals, SLI, SLO, SLA, alertas, runbooks e cardinalidade foram explicados;
- OrderFlow foi relacionado;
- Deployment Rollback Question Bank foi criado;
- rolling, blue-green, canary, smoke, rollback, roll-forward e feature flags foram explicados;
- Cost Reliability Question Bank foi criado;
- right-sizing, overprovisioning, reserved, spot, observability cost, egress e FinOps foram explicados;
- Troubleshooting foi criado;
- container exit, OOMKilled, CrashLoopBackOff, ImagePullBackOff, Pending, readiness, pipeline, tráfego, latency e custo foram diagnosticados;
- DevOps Cloud Exercises foi criado;
- dez exercícios foram preparados;
- Mock DevOps Cloud Interview foi criado;
- simulação foi estruturada;
- follow-ups foram criados;
- entrevista foi gravada;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 712 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- duas rodadas foram executadas;
- gravações foram revisadas;
- tema fraco foi repetido;
- commit recomendado e diário de bordo estão presentes;
- entrevista de arquitetura não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\interview-DevOps-cloud\validate-DevOps-cloud-answers.ps1

.\scripts\interview-DevOps-cloud\validate-pipeline-security.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/interview-DevOps-cloud `
  scripts/interview-DevOps-cloud `
  reports/DevOps-cloud-interview-report.yaml `
  contracts/DevOps-cloud-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|cloud-secret|registry-password|realTenant|realCustomer|architecture-mock"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(interview): prepare DevOps cloud interview"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- credencial de cloud;
- token de registry;
- secret de pipeline;
- simulação detalhada da aula 712.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a preparação completa para uma entrevista DevOps cloud.

Você estruturou:

```text
Linux runtime;

containers;

Dockerfiles;

Compose;

registries;

supply chain;

CI CD;

GitHub Actions;

artifacts;

configuration;

environments;

Kubernetes;

workloads;

networking;

health probes;

resources;

autoscaling;

cloud foundations;

IAM;

storage;

observability;

deployment;

rollback;

cost;

troubleshooting;

exercises;

mock interview;

scorecard;

report e evidence.
```

Agora você consegue explicar como o OrderFlow é construído, empacotado, implantado, protegido, monitorado e recuperado.

A próxima aula será:

```text
712 - M20.42 - Entrevista arquitetura
```

Nela, você realizará uma entrevista de arquitetura completa, trabalhando requisitos, constraints, quality attributes, boundaries, dados, consistência, mensageria, escalabilidade, disponibilidade, segurança, observabilidade, deployment topology, trade-offs e defesa formal.

Nenhuma entrevista de arquitetura foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei Linux.
- [ ] Revisei containers.
- [ ] Revisei Docker.
- [ ] Revisei Compose.
- [ ] Revisei registry e supply chain.
- [ ] Revisei CI/CD e Actions.
- [ ] Revisei artifacts.
- [ ] Revisei configuração.
- [ ] Revisei Kubernetes.
- [ ] Revisei rede e probes.
- [ ] Revisei scaling.
- [ ] Revisei cloud e IAM.
- [ ] Revisei observabilidade.
- [ ] Revisei deploy e rollback.
- [ ] Preservei arquitetura para a aula 712.

---

## Troubleshooting adicional

### Container funciona localmente, mas não no cluster

Revise arquitetura, usuário, filesystem, config e health.

### Build não usa cache

Revise ordem de COPY e dependências.

### Pipeline recebe `403`

Revise permissions e identidade.

### Pod fica Pending

Revise resources, quotas e volume.

### Readiness nunca fica verde

Revise startup, dependências e timeout.

### HPA escala sem reduzir latência

O gargalo pode estar no banco ou downstream.

### Rollback falha

Schema ou contrato pode ser incompatível.

### Custo aumenta após observabilidade

Revise cardinalidade, sampling e retenção.

### Imagem possui CVE sem correção

Avalie exposição, mitigação e base alternativa.

### Quero discutir desenho sistêmico completo

Essa etapa pertence à aula 712.

---

## Perguntas de revisão

1. Container é VM?
2. Imagem e container são iguais?
3. Para que servem cgroups?
4. Por que non-root?
5. O que multi-stage reduz?
6. Tag identifica conteúdo de forma imutável?
7. O que SBOM descreve?
8. CI e CD são iguais?
9. Por que build once?
10. Secret pode ir no YAML público?
11. Pod é deployment?
12. Liveness e readiness são iguais?
13. Limit de memória pode causar o quê?
14. HPA resolve gargalo de banco?
15. Namespace isola tudo sozinho?
16. Service fornece o quê?
17. O que IAM controla?
18. Backup sem restore testado basta?
19. SLO e SLA são iguais?
20. Rollback sempre é seguro?
21. O que FinOps busca?
22. O que a aula 712 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Não.
3. Controlar recursos.
4. Reduzir impacto.
5. Tamanho e superfície.
6. Não.
7. Componentes.
8. Não.
9. Mesma identidade.
10. Não.
11. Não.
12. Não.
13. Encerramento.
14. Não.
15. Não.
16. Endpoint estável.
17. Permissões.
18. Não.
19. Não.
20. Não.
21. Valor e custo.
22. Entrevista arquitetura.
23. Banca arquitetural.
24. Entrevista arquitetura.
25. Entregar e operar com confiança, segurança e custo consciente.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 711 - M20.41 - Entrevista DevOps cloud

- Continuei após Entrevista segurança.
- Criei DevOps Cloud Interview Charter.
- Criei Linux Runtime Question Bank.
- Revisei processos, threads, sinais, exit codes, streams, permissões e recursos.
- Criei Containers Question Bank.
- Diferenciei imagem, container e VM.
- Revisei namespaces, cgroups, PID 1, stateless, non-root e capabilities.
- Criei Dockerfile Question Bank.
- Revisei base, multi-stage, cache, copy, dockerignore, RUN, CMD e ENTRYPOINT.
- Revisei usuário, imagem mínima, tags, digests, scans e JVM.
- Criei Docker Compose Question Bank.
- Revisei services, health, volumes, networks e overrides.
- Criei Registry Supply Chain Question Bank.
- Revisei registry, immutable tags, SBOM, assinatura, provenance e pinning.
- Criei CI CD Question Bank.
- Diferenciei integração, entrega e implantação contínuas.
- Revisei stages, fail fast, paralelismo, cache, secrets, promoção e approvals.
- Criei GitHub Actions Question Bank.
- Revisei workflows, jobs, steps, runners, permissions, forks, pinning, matrix e environments.
- Criei Artifact Release Question Bank.
- Revisei artifact, imutabilidade, checksum, versionamento, release notes e build once.
- Criei Configuration Environment Question Bank.
- Revisei config, secrets, parity, feature flags, drift e IaC.
- Criei Kubernetes Core Question Bank.
- Revisei cluster, pod, declarative state, namespace, ConfigMap e Secret.
- Criei Kubernetes Workload Question Bank.
- Revisei Deployment, StatefulSet, Job, CronJob, DaemonSet e rolling update.
- Criei Kubernetes Networking Question Bank.
- Revisei Service, Ingress, DNS, NetworkPolicy e timeouts.
- Criei Health Scaling Question Bank.
- Revisei liveness, readiness, startup, requests, limits, HPA e backlog.
- Criei Cloud Foundations Question Bank.
- Revisei responsabilidade compartilhada, região, zona, disponibilidade e elasticidade.
- Criei IAM Question Bank.
- Revisei identidades, roles, policies, credenciais curtas e separation of duties.
- Criei Storage Question Bank.
- Comparei block, file e object storage.
- Revisei backup, RPO e RTO.
- Criei Observability Operations Question Bank.
- Revisei sinais, golden signals, SLI, SLO, SLA, alertas, runbooks e cardinalidade.
- Criei Deployment Rollback Question Bank.
- Revisei rolling, blue-green, canary, smoke, rollback, roll-forward e feature flags.
- Criei Cost Reliability Question Bank.
- Revisei right-sizing, overprovisioning, reserved, spot, egress e FinOps.
- Criei DevOps Cloud Troubleshooting.
- Diagnostiquei container exit, OOMKilled, CrashLoopBackOff, ImagePullBackOff, Pending, readiness, pipeline, tráfego, latência e custo.
- Criei DevOps Cloud Exercises.
- Preparei dez exercícios.
- Criei Mock DevOps Cloud Interview.
- Executei duas rodadas.
- Gravei entrevistas.
- Criei Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 712.
- Criei report, evidence e gate.
- Revisei gravações.
- Repeti o tema mais fraco.
- Não antecipei entrevista de arquitetura.
- Próxima aula: Entrevista arquitetura.
```

---

## Referência técnica curta

- Process.
- Signal.
- Container.
- Image.
- Namespace.
- Cgroup.
- Dockerfile.
- Registry.
- SBOM.
- Provenance.
- CI/CD.
- Artifact.
- Kubernetes.
- Pod.
- Deployment.
- Service.
- Ingress.
- Probe.
- HPA.
- IAM.
- RPO.
- RTO.
- SLI.
- SLO.
- Rollout.
- Rollback.
- FinOps.

Regra final:

```text
A entrevista DevOps cloud do OrderFlow deve demonstrar entrega e operação consciente: Linux runtime cobre processos, sinais, exit codes, streams, permissões and resource limits, containers diferenciam image, instance, VM, namespaces, cgroups, writable layer, PID 1, stateless and non-root execution, Dockerfiles usam trusted base, multi-stage, cache-aware layers, selective COPY, dockerignore, explicit entrypoint, minimal runtime, pinned versions, digests and scans, Compose organiza serviços locais, health, networks and volumes sem fingir produção, registries usam authentication, immutable references, SBOM, signatures and provenance, CI CD diferencia integration, delivery and deployment com fail-fast stages, tests, security, immutable artifact promotion, approvals and rollback gates, GitHub Actions usa minimum permissions, safe fork behavior, pinned actions, environments and retention, artifacts conectam source, version, checksum and release notes, configuration permanece externa e secrets entram por runtime, Kubernetes explica declarative reconciliation, pods, Deployments, StatefulSets, Services, Ingress, DNS, NetworkPolicy, probes, requests, limits, rolling updates and rollbacks, scaling usa CPU, lag, backlog and capacity constraints sem ignorar database and downstream, cloud foundations cobrem regions, zones, shared responsibility, managed services and elasticity, IAM usa human and workload identities, short credentials and least privilege, storage diferencia block, file and object com backup, RPO and RTO, observability conecta golden signals, SLI, SLO, alerts, runbooks and OrderFlow journey signals, deployment compara rolling, blue-green and canary com smoke, schema compatibility and feature flags, cost review usa right-sizing, retention, egress and FinOps, troubleshooting investiga events, logs, resources, network, config and dependencies, duas mock interviews geram scorecard, report and evidence, e o gate fecha runtime, delivery, cloud and operations enquanto requirements, boundaries, data ownership, consistency, availability, scaling, architecture diagrams and formal system defense permanecem reservados para a aula 712.
```
