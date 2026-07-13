# 535 - M17.30 - Helm conceitual

## Apresentação da aula

Na aula 534, você aprofundou o lifecycle de arquivos e volumes no Kubernetes.

O workload passou a diferenciar:

```text
filesystem gravável do container;

emptyDir;

ConfigMap volume;

Secret volume;

projected volume;

Downward API;

storage persistente conceitual.
```

Você também preservou a baseline operacional do laboratório:

```text
Deployment disponível;

HPA ativo;

Service saudável;

Ingress saudável;

ConfigMap e Secret montados;

volumes validados.
```

Ao longo das últimas aulas, a aplicação acumulou vários manifests.

Exemplos:

```text
Namespace;

ConfigMap;

Secret referenciado;

Deployment;

Service;

Ingress;

HorizontalPodAutoscaler;

policies;

volumes.
```

Administrar muitos manifests individualmente dificulta ordem de aplicação, parametrização por ambiente, versionamento, revisão do YAML final, atualização conjunta, rollback e distribuição do pacote.

A pergunta central desta aula será:

```text
como empacotar,
parametrizar,
renderizar,
instalar,
atualizar
e versionar

um conjunto relacionado
de manifests Kubernetes?
```

A resposta conceitual será:

```text
Helm.
```

Helm é um gerenciador de pacotes para Kubernetes.

Ele trabalha com três elementos centrais:

```text
Chart;

Configuração;

Release.
```

#### Chart

Pacote versionado que contém templates, metadata, valores padrão e arquivos auxiliares.

#### Configuração

Conjunto de valores usado para renderizar o chart.

#### Release

Instância instalada de um chart em um cluster e namespace.

A regra central será:

```text
chart é o pacote;
values são entradas;
templates geram manifests;
release é a instalação versionada.
```

Nesta aula, o foco será construir o modelo mental correto e auditar os releases `ingress-nginx` e `metrics-server`, sem criar um chart completo da aplicação.

Esses componentes já instalados oferecem um laboratório real para auditar repository, versões, release, namespace, revision, values, manifests, hooks, history, segurança e drift.

Nenhum release crítico será removido.

Nenhum rollback destrutivo será executado sem simulação e restauração.

A aplicação `orders-api` continuará instalada por manifests declarativos comuns.

Um chart da aplicação não será antecipado.

A próxima aula será:

```text
536 - M17.31 - Namespace RBAC conceitual
```

Portanto, também não serão criadas antecipadamente:

- Roles;
- ClusterRoles;
- RoleBindings;
- ClusterRoleBindings;
- ServiceAccounts com permissões;
- políticas completas de namespace.

Helm será estudado como uma camada de empacotamento e lifecycle.

Helm não substitui Kubernetes nem corrige um manifest errado. O fluxo profissional revisa chart, values, manifest renderizado, diff e resultado no cluster.

Values são texto de configuração, não um cofre. Secrets devem vir de mecanismos aprovados e não entram em values, command line, history ou evidence.

Uma estrutura típica contém `Chart.yaml`, `values.yaml`, `templates`, `charts`, `_helpers.tpl`, `NOTES.txt` e `.helmignore`. Ela será documentada, mas não criada para a aplicação nesta aula.

Outro conceito fundamental será a diferença entre:

```text
chart version;

app version.
```

#### Chart version

Versão do pacote Helm.

É usada para distribuir e resolver o chart.

#### App version

Versão informativa da aplicação empacotada.

Ela não controla automaticamente a imagem.

Exemplo:

```yaml
version:
  1.4.0

appVersion:
  "2.8.3"
```

O chart `1.4.0` pode empacotar a aplicação `2.8.3`.

Alterar um template, valor padrão ou policy pode exigir nova chart version mesmo quando a aplicação não mudou.

Charts normalmente usam SemVer: patch corrige sem quebrar contrato, minor adiciona capacidade compatível e major altera o contrato de forma incompatível.

Repositories publicam índices, versões e charts empacotados. OCI também pode distribuir charts, mas nenhum registry de charts será configurado nesta aula.

Quando um chart é instalado, Helm cria uma release com nome, namespace, status, chart, app version, revision, values, manifest, notes e history. O laboratório sempre informa o namespace explicitamente.

Cada install ou upgrade gera uma revision. `helm history` mostra o histórico e rollback cria uma nova revision baseada em uma anterior.

`helm install` cria uma release e `helm upgrade --install` combina instalação e atualização. O fluxo ainda exige versão, namespace, values, timeout, dry-run, wait e evidence.

`--wait` aguarda readiness, `--atomic` tenta reverter falhas e `--cleanup-on-fail` remove resources novos conforme a operação. Nenhuma dessas flags substitui backup, migração reversível ou smoke tests.

Values seguem precedência entre defaults, arquivos `-f` e flags `--set`, `--set-string` ou `--set-file`. A policy prefere poucos arquivos explícitos, ordem documentada e nenhum secret na linha de comando.

`helm template` renderiza manifests sem instalar e apoia revisão, CI, policy checks, secret scanning e comparação. A saída pode conter dados sensíveis e exige proteção.

`helm lint` detecta problemas comuns, mas não comprova compatibilidade, autorização ou readiness. A cadeia inclui lint, template, schema, server dry-run, policy checks e diff.

Após renderizar, `kubectl apply --dry-run=server` valida os resources contra a API do cluster. O arquivo temporário precisa de cleanup seguro.

`helm get values`, `manifest`, `notes`, `hooks` e `all` auditam a release. O manifest pode conter conteúdo sensível e não será publicado integralmente.

`helm status` resume a release e `helm list --all-namespaces` inventaria releases, revisions, charts e statuses.

Upgrade pode alterar chart, values, resources, hooks e CRDs. Ele exige diff, análise de campos imutáveis, capacidade, migração e rollback. Nenhum upgrade real será realizado.

`helm rollback` cria uma revisão baseada em outra anterior, mas não recupera automaticamente dados, CRDs, volumes, recursos externos ou mudanças irreversíveis. A aula apenas simulará a decisão.

`helm uninstall` remove a release, mas CRDs, recursos preservados, volumes, dados e efeitos externos podem permanecer. Nenhum uninstall real será executado.

Hooks executam resources em pontos como install, upgrade, rollback, delete e test. Precisam ser pequenos, idempotentes, observáveis e possuir cleanup definido. Nenhum hook será implementado.

`helm test` executa resources de teste da release e pode validar DNS, Service e conectividade, sem substituir os testes da aplicação.

Dependencies são declaradas em `Chart.yaml`; `helm dependency update` resolve versões e `Chart.lock` deve ser versionado. Atualizações silenciosas são proibidas.

Library charts fornecem helpers reutilizáveis sem instalar resources, mas a abstração precisa preservar legibilidade.

Named templates e funções como `include`, `nindent`, `toYaml`, `quote`, `required` e `default` reduzem repetição, mas exigem atenção a indentação e tipos.

`values.schema.json` valida tipos, obrigatoriedade, enums e ranges, embora não elimine todos os erros semânticos.

`lookup` torna a renderização dependente do cluster e `tpl` aumenta a superfície de interpretação. Ambos serão restritos por policy.

Helm adiciona metadata de ownership, mas não reconcilia continuamente como um controller; ele atua durante comandos de release.

Mudanças manuais criam drift entre o manifest da release e o estado atual. O laboratório comparará essas visões sem exigir plugin externo.

CRDs possuem lifecycle especial e exigem owner, compatibilidade, runbook, backup e análise de remoção. Nenhuma CRD será instalada.

Antes de instalar um chart externo, valide origem, versão, provenance, templates, dependencies, images, permissions, hooks e CRDs. Chart confiável não torna a imagem automaticamente segura.

Provenance permite verificar pacotes assinados com `helm verify` quando assinatura e chave estão disponíveis. Nenhuma chave será criada.

Charts também podem usar registries OCI com autenticação, retenção, imutabilidade, assinatura e promoção. Nenhum chart será publicado.

Values podem permanecer no storage da release; portanto, Secrets em texto puro são proibidos e o acesso será relacionado ao RBAC da próxima aula.

Toda operação informa namespace e diferencia resources namespaced de cluster-scoped, pois isso altera autorização. A próxima aula aprofundará Namespace e RBAC.

Helm normalmente armazena metadata da release em Secrets do cluster. O laboratório não decodificará esse storage.

Helm pode ser usado por operadores, pipelines ou GitOps. Um único owner operacional precisa ser definido; nenhum controller GitOps será instalado.

Helm organiza resources no cluster, mas não substitui IaC de rede, cluster, IAM, banco, DNS externo ou secret manager.

Uma estrutura futura pode combinar `values.yaml` com overrides de dev, hml e prod. Overrides contêm apenas diferenças e nunca Secrets.

Chart, versão e values iguais devem produzir resultado determinístico; funções dependentes de tempo, random ou estado externo serão evitadas.

Charts podem usar checksum de configuração no Pod template para disparar rollout. O padrão será apenas documentado, sem implementação antecipada.

A evidence da release registra chart, versões, namespace, inputs, commit, image digest, Kubernetes version, revision, owner e rollback, sem copiar manifests sensíveis.

Ao final, você deverá explicar:

```text
o que é chart;

o que é release;

como values
entram na renderização;

como chart version
difere de app version;

como install,
upgrade,
rollback
e uninstall
mudam o lifecycle;

por que helm template
é importante;

por que helm lint
não basta;

como history
e revisions funcionam;

por que values
não protegem secrets;

como Helm
difere de um controller;

como auditar
releases existentes;

como preparar
Namespace e RBAC.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
533:
HPA.

534:
Volumes Kubernetes.

535:
Helm conceitual.

536:
Namespace RBAC conceitual.

537:
Observabilidade em Kubernetes.
```

A aula 534 respondeu:

```text
como fornecer
arquivos e volumes
ao lifecycle do Pod?
```

A aula 535 responderá:

```text
como empacotar,
parametrizar
e versionar
um conjunto de manifests?
```

Nesta aula:

```text
Helm:
sim.

Chart:
sim.

Release:
sim.

Repository:
sim.

Chart version:
sim.

App version:
sim.

values:
sim.

templates:
sim.

renderização:
sim.

lint:
sim.

install:
sim.

upgrade:
sim.

rollback:
sim.

uninstall:
sim.

history:
sim.

hooks:
sim.

dependencies:
sim.

OCI:
conceitual.

provenance:
conceitual.

chart da aplicação:
não.

Namespace avançado:
não.

RBAC:
não implementado.
```

A regra central será:

```text
Helm organiza
o lifecycle do pacote;

Kubernetes continua
definindo o comportamento
dos resources.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
k8s/helm-concepts
├── release-audit-policy.yaml
├── chart-security-policy.yaml
├── values-policy.yaml
├── upgrade-policy.yaml
├── rollback-decision.yaml
└── application-chart-plan.yaml

scripts/kubernetes/helm
├── verify-helm-client.ps1
├── inventory-helm-releases.ps1
├── audit-release-metadata.ps1
├── render-installed-chart.ps1
├── compare-release-manifests.ps1
├── validate-helm-values.ps1
├── simulate-upgrade-decision.ps1
├── simulate-rollback-decision.ps1
├── collect-helm-evidence.ps1
└── verify-helm-baseline.ps1

docs/devops/helm
├── HELM_ARCHITECTURE.md
├── CHART_RELEASE_VALUES.md
├── HELM_LIFECYCLE.md
├── HELM_TEMPLATE_RENDERING.md
├── HELM_VALUES_PRECEDENCE.md
├── HELM_SECURITY_POLICY.md
├── HELM_UPGRADE_ROLLBACK_RUNBOOK.md
├── HELM_TEST_MATRIX.md
└── HELM_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
releases inventariadas;

metadata auditada;

versions registradas;

values revisados;

manifests renderizados;

history inspecionada;

upgrade simulado;

rollback avaliado;

policies criadas;

evidência sanitizada;

baseline preservada.
```

Você irá:

1. confirmar cluster;
2. confirmar Helm;
3. inventariar releases;
4. validar namespaces;
5. auditar ingress-nginx;
6. auditar metrics-server;
7. registrar chart versions;
8. registrar app versions;
9. revisar values;
10. revisar history;
11. revisar status;
12. revisar manifest com sanitização;
13. baixar chart em diretório temporário;
14. executar lint;
15. renderizar com values instalados;
16. comparar renderização;
17. identificar fontes de diferença;
18. criar policies;
19. simular upgrade;
20. simular rollback;
21. documentar uninstall;
22. documentar hooks;
23. documentar dependencies;
24. criar plano do chart da aplicação;
25. coletar evidence;
26. validar baseline;
27. executar gate;
28. commitar;
29. preparar a aula 536.

---

## Conceito essencial

### Helm

Gerenciador de pacotes para Kubernetes.

---

### Chart

Pacote versionado com templates e metadata.

---

### Release

Instância instalada de um chart.

---

### Repository

Origem versionada de charts.

---

### Values

Entradas de configuração do chart.

---

### Template

Arquivo processado para gerar manifests.

---

### Chart version

Versão do pacote.

---

### App version

Versão informativa da aplicação.

---

### Revision

Versão histórica da release instalada.

---

### Render

Transformação de chart e values em manifests.

---

### Hook

Resource executado em pontos do lifecycle da release.

---

### Dependency

Chart usado por outro chart.

---

### Rollback

Cria nova revisão baseada em revisão anterior.

---

### Uninstall

Remove a release e resources gerenciados conforme as regras aplicáveis.

---

## Mão na massa guiada

### 1. Confirmar o context

Execute:

```powershell
kubectl config current-context
```

Resultado esperado:

```text
kind-formacao-java.
```

Depois:

```powershell
.\scripts\kubernetes\kubernetes-preflight.ps1
```

---

### 2. Confirmar a aplicação

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme a baseline saudável antes de auditar componentes compartilhados.

---

### 3. Validar o cliente Helm

Execute:

```powershell
helm version
```

O script:

```text
verify-helm-client.ps1
```

valida:

- comando disponível;
- versão;
- conexão com o cluster;
- context permitido;
- repositories;
- nenhum secret na saída.

---

### 4. Inventariar releases

Execute:

```powershell
helm list `
  --all-namespaces
```

Saída esperada inclui:

```text
ingress-nginx;

metrics-server.
```

O script salva apenas metadata sanitizada.

---

### 5. Obter inventário JSON

```powershell
helm list `
  --all-namespaces `
  --output `
  json
```

O script extrai:

- name;
- namespace;
- revision;
- status;
- chart;
- app version;
- updated.

---

### 6. Auditar `ingress-nginx`

```powershell
helm status `
  ingress-nginx `
  --namespace `
  ingress-nginx
```

Depois:

```powershell
helm history `
  ingress-nginx `
  --namespace `
  ingress-nginx
```

---

### 7. Auditar `metrics-server`

```powershell
helm status `
  metrics-server `
  --namespace `
  kube-system
```

Depois:

```powershell
helm history `
  metrics-server `
  --namespace `
  kube-system
```

---

### 8. Obter values instalados

Para ingress:

```powershell
helm get values `
  ingress-nginx `
  --namespace `
  ingress-nginx `
  --all `
  --output `
  yaml
```

Para Metrics Server:

```powershell
helm get values `
  metrics-server `
  --namespace `
  kube-system `
  --all `
  --output `
  yaml
```

Os scripts analisam chaves e não publicam valores sensíveis.

---

### 9. Obter somente values informados

```powershell
helm get values `
  metrics-server `
  --namespace `
  kube-system `
  --output `
  yaml
```

Compare com `--all`.

Isso diferencia:

- defaults;
- overrides da release.

---

### 10. Auditar manifest da release

Execute localmente:

```powershell
helm get manifest `
  ingress-nginx `
  --namespace `
  ingress-nginx
```

Não redirecione para arquivo versionado.

O script calcula:

- quantidade de documents;
- kinds;
- namespaces;
- imagens;
- cluster-scoped resources;
- hooks quando separados.

Nenhum Secret é exportado.

---

### 11. Obter metadata do chart instalado

O campo `chart` da listagem possui formato semelhante a:

```text
ingress-nginx-4.x.y.
```

O script separa:

- chart name;
- chart version.

Use a versão realmente instalada.

---

### 12. Criar diretório temporário seguro

O script:

```text
render-installed-chart.ps1
```

cria um diretório temporário.

Requisitos:

- fora do repositório;
- cleanup em `finally`;
- sem valores sensíveis;
- nome aleatório;
- sem upload como artifact.

---

### 13. Baixar o chart correspondente

Exemplo conceitual:

```powershell
helm pull `
  ingress-nginx/ingress-nginx `
  --version `
  $ChartVersion `
  --untar `
  --untardir `
  $TemporaryDirectory
```

A versão vem do inventário.

---

### 14. Inspecionar metadata

```powershell
helm show chart `
  ingress-nginx/ingress-nginx `
  --version `
  $ChartVersion
```

Depois:

```powershell
helm show values `
  ingress-nginx/ingress-nginx `
  --version `
  $ChartVersion
```

Revise sem copiar todo o conteúdo para o diário.

---

### 15. Executar lint

No diretório temporário:

```powershell
helm lint `
  $ChartDirectory
```

O resultado precisa ser registrado na evidence.

Lint não prova segurança ou compatibilidade completa.

---

### 16. Renderizar offline

Use values não sensíveis da release:

```powershell
helm template `
  ingress-nginx `
  $ChartDirectory `
  --namespace `
  ingress-nginx `
  --values `
  $SanitizedValuesFile `
  --output-dir `
  $RenderDirectory
```

O script sanitiza ou recria apenas os overrides permitidos.

---

### 17. Validar o YAML renderizado

Use:

```powershell
kubectl apply `
  --dry-run=server `
  -f `
  $RenderDirectory
```

O apply é apenas dry-run.

Nenhum resource é alterado.

---

### 18. Comparar kinds

O script compara:

- kinds da release;
- kinds renderizados;
- namespaces;
- labels;
- images;
- cluster-scoped resources.

Diferenças podem surgir por:

- capabilities;
- Kubernetes version;
- release lookup;
- values incompletos;
- hooks;
- chart metadata;
- flags de instalação.

---

### 19. Criar policy de auditoria

Arquivo:

```text
release-audit-policy.yaml
```

Inclua:

```yaml
releaseAudit:
  namespace:
    explicit:
      true

  chartVersion:
    required:
      true

  appVersion:
    recorded:
      true

  revision:
    recorded:
      true

  values:
    sensitiveContent:
      forbidden

  manifest:
    securityScan:
      required
```

---

### 20. Criar policy de segurança

Arquivo:

```text
chart-security-policy.yaml
```

Regras:

- repository allowlist;
- version explícita;
- no `latest`;
- imagens por versão ou digest;
- hooks revisados;
- CRDs revisadas;
- cluster-scoped resources revisados;
- Secret em values proibido;
- privileged proibido por padrão;
- hostPath proibido;
- RBAC amplo exige aprovação.

Nenhum RBAC será criado.

---

### 21. Criar policy de values

Arquivo:

```text
values-policy.yaml
```

Inclua:

- defaults mínimos;
- overrides por ambiente;
- schema;
- sem secrets;
- ordem explícita;
- tipos preservados;
- sem `--set` sensível;
- documentação de cada campo;
- deprecation policy.

---

### 22. Criar policy de upgrade

Arquivo:

```text
upgrade-policy.yaml
```

Inclua:

- chart version atual;
- chart version alvo;
- changelog;
- rendered diff;
- API compatibility;
- image changes;
- hooks;
- CRDs;
- migration;
- timeout;
- wait;
- atomic decision;
- rollback revision;
- smoke tests;
- owner.

O arquivo não define uma versão alvo real nesta aula.

Ele define o contrato de decisão.

---

### 23. Simular decisão de upgrade

O script:

```text
simulate-upgrade-decision.ps1
```

recebe metadata fictícia e não sensível.

Ele falha quando:

- versão alvo ausente;
- diff ausente;
- rollback revision ausente;
- hook não revisado;
- CRD não revisada;
- image change não registrada;
- secret aparece nos values.

Nenhum `helm upgrade` real é executado.

---

### 24. Criar decisão de rollback

Arquivo:

```text
rollback-decision.yaml
```

Campos:

- release;
- namespace;
- current revision;
- target revision;
- reason;
- data impact;
- hook impact;
- CRD impact;
- volume impact;
- smoke test;
- approver role;
- recovery plan.

---

### 25. Simular rollback

O script:

```text
simulate-rollback-decision.ps1
```

valida se uma revisão existe no history.

Ele não executa:

```text
helm rollback.
```

Produz apenas uma decisão e comandos de runbook.

---

### 26. Documentar uninstall

No runbook, inclua uma etapa de preview:

```text
resources gerenciados;

CRDs;

volumes;

external resources;

keep annotations;

dependências;

dados;

rollback possível.
```

Não execute uninstall nos releases do laboratório.

---

### 27. Auditar hooks

Execute:

```powershell
helm get hooks `
  ingress-nginx `
  --namespace `
  ingress-nginx
```

Se não houver hooks, registre:

```text
nenhum hook retornado.
```

---

### 28. Auditar notes

```powershell
helm get notes `
  ingress-nginx `
  --namespace `
  ingress-nginx
```

---

### 29. Criar plano do chart da aplicação

Arquivo:

```text
application-chart-plan.yaml
```

Defina, sem templates:

```yaml
chart:
  name:
    orders-api

  type:
    application

  resources:
    - ConfigMap
    - Deployment
    - Service
    - Ingress
    - HorizontalPodAutoscaler

  excluded:
    - Secret values
    - Namespace ownership
    - ClusterRole
    - PersistentVolume

  values:
    groups:
      - image
      - workload
      - service
      - ingress
      - autoscaling
      - resources
      - probes
      - volumes
```

---

### 30. Definir boundaries

O plano precisa registrar:

```text
chart gerencia:

resources da aplicação.

chart não gerencia:

cluster;

Ingress Controller;

Metrics Server;

secret store;

namespace corporativo;

RBAC corporativo;

banco externo.
```

Essas fronteiras reduzem blast radius.

---

### 31. Criar evidence

Arquivo:

```text
kubernetes-helm-evidence.json.
```

Campos permitidos:

- Helm client version;
- cluster context;
- release count;
- release names;
- namespaces;
- revisions;
- statuses;
- chart names;
- chart versions;
- app versions;
- lint results;
- rendered kinds;
- hooks count;
- policy result;
- upgrade simulation result;
- rollback simulation result;
- baseline healthy;
- timestamp.

Sem values sensíveis ou manifests completos.

---

### 32. Criar documentação

#### `HELM_ARCHITECTURE.md`

Explique client, repository, chart, release e cluster.

#### `CHART_RELEASE_VALUES.md`

Explique os três elementos centrais.

#### `HELM_LIFECYCLE.md`

Explique install, upgrade, rollback, test e uninstall.

#### `HELM_TEMPLATE_RENDERING.md`

Explique renderização e validação.

#### `HELM_VALUES_PRECEDENCE.md`

Explique defaults, files e `--set`.

#### `HELM_SECURITY_POLICY.md`

Explique supply chain, Secrets, hooks, CRDs e permissions.

---

### 33. Criar runbook

Arquivo:

```text
HELM_UPGRADE_ROLLBACK_RUNBOOK.md
```

Passos:

1. inventariar release;
2. registrar revision;
3. resolver chart alvo;
4. revisar changelog;
5. revisar dependencies;
6. renderizar;
7. validar;
8. comparar;
9. revisar hooks e CRDs;
10. definir rollback;
11. executar upgrade;
12. smoke test;
13. observar;
14. rollback quando necessário;
15. coletar evidence.

Nesta aula, os passos executivos permanecem simulados.

---

### 34. Criar test matrix

Arquivo:

```text
HELM_TEST_MATRIX.md
```

Cenários:

- Helm client ausente;
- context incorreto;
- release listada;
- namespace incorreto;
- chart version registrada;
- app version registrada;
- values defaults;
- values overrides;
- Secret detectado;
- lint sucesso;
- lint falha;
- render sucesso;
- server dry-run sucesso;
- kind divergente;
- hook presente;
- CRD presente;
- upgrade sem diff;
- rollback revision ausente;
- uninstall de release crítica;
- evidence sanitizada;
- baseline preservada.

---

### 35. Criar troubleshooting

Arquivo:

```text
HELM_TROUBLESHOOTING.md
```

Inclua:

- release not found;
- namespace incorreto;
- repository ausente;
- chart version não encontrada;
- dependency lock divergente;
- lint falha;
- template error;
- YAML inválido;
- API removida;
- immutable field;
- release pending-upgrade;
- rollback falha;
- hook timeout;
- atomic rollback;
- CRD incompatível;
- values com tipo incorreto;
- Secret exposto;
- drift manual;
- history insuficiente.

---

### 36. Validar a baseline do cluster

Execute:

```powershell
.\scripts\kubernetes\helm\verify-helm-baseline.ps1
```

Confirme:

```text
ingress-nginx:
deployed.

metrics-server:
deployed.

Ingress:
saudável.

HPA:
ativo.

orders-api:
mínimo de duas réplicas.

volumes:
saudáveis.
```

Nenhuma revisão nova deve ter sido criada pela auditoria.

---

### 37. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\helm\verify-helm-client.ps1

.\scripts\kubernetes\helm\inventory-helm-releases.ps1

.\scripts\kubernetes\helm\audit-release-metadata.ps1

.\scripts\kubernetes\helm\validate-helm-values.ps1

.\scripts\kubernetes\helm\simulate-upgrade-decision.ps1

.\scripts\kubernetes\helm\simulate-rollback-decision.ps1

.\scripts\kubernetes\helm\collect-helm-evidence.ps1

.\scripts\kubernetes\helm\verify-helm-baseline.ps1
```

Finalize:

```powershell
helm list `
  --all-namespaces

kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

---

## Entendendo o que foi feito

### Chart ganhou significado

Ele deixou de ser tratado como um conjunto mágico de YAMLs.

### Release ganhou lifecycle

Install, upgrade, revision, rollback e uninstall foram separados.

### Values ganharam contrato

Entradas deixaram de ser confundidas com Secrets protegidos.

### Renderização virou gate

O YAML final passou a ser revisado antes de qualquer mudança.

### Releases existentes viraram laboratório

Ingress Controller e Metrics Server foram auditados sem upgrade.

### History ganhou papel operacional

Revisions passaram a sustentar decisões de rollback.

### Segurança entrou antes do chart da aplicação

Repositories, hooks, CRDs, images e permissions ganharam policy.

### Drift foi reconhecido

Helm não reconcilia continuamente mudanças manuais.

### O chart da aplicação ganhou fronteiras

O plano não assumiu ownership de cluster, Secret store ou RBAC corporativo.

### A próxima aula ganhou contexto

Namespace e RBAC definirão quem pode operar releases e resources.

---

## Erros comuns importantes

### Tratar Helm como linguagem Kubernetes

Helm apenas renderiza e gerencia releases.

### Colocar Secret em values

O valor pode permanecer na release e nos logs.

### Usar chart version flutuante

A instalação deixa de ser reproduzível.

### Confundir chart version e app version

São dimensões diferentes.

### Confiar apenas em `helm lint`

Lint não prova compatibilidade operacional.

### Executar upgrade sem renderizar

Mudanças ficam invisíveis antes do apply.

### Executar rollback sem avaliar dados

Volumes, migrações e CRDs podem ser irreversíveis.

### Usar `--set` para credencial

Shell history e metadata podem expor o valor.

### Ignorar hooks

Um Job de hook pode alterar estado externo.

### Ignorar cluster-scoped resources

O chart pode possuir impacto além do namespace.

### Alterar resource manualmente

A release e o cluster entram em drift.

### Antecipar RBAC

A aula 536 possui esse objetivo.

---

## Comandos úteis

### Listar releases

```powershell
helm list `
  --all-namespaces
```

### Ver status

```powershell
helm status `
  ingress-nginx `
  --namespace `
  ingress-nginx
```

### Ver history

```powershell
helm history `
  metrics-server `
  --namespace `
  kube-system
```

### Ver values

```powershell
helm get values `
  metrics-server `
  --namespace `
  kube-system `
  --all
```

### Renderizar chart

```powershell
helm template `
  release-audit `
  $ChartDirectory `
  --namespace `
  ingress-nginx
```

---

## Exercício guiado

### Parte 1 — Inventário

Liste releases e namespaces.

### Parte 2 — Metadata

Registre revisions e versions.

### Parte 3 — Values

Compare defaults e overrides.

### Parte 4 — Manifest

Audite kinds sem exportar Secrets.

### Parte 5 — Render

Baixe e renderize a versão instalada.

### Parte 6 — Validate

Execute lint e server dry-run.

### Parte 7 — Upgrade

Simule decisão sem aplicar.

### Parte 8 — Rollback

Valide uma revisão sem executar.

### Parte 9 — Policy

Defina supply chain e boundaries.

### Parte 10 — Evidence

Registre a auditoria sanitizada.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 534 foi preservada;
- Helm foi definido;
- Chart foi definido;
- Release foi definida;
- Repository foi definido;
- Values foram definidos;
- Template foi definido;
- chart version foi definida;
- app version foi definida;
- revision foi definida;
- render foi definido;
- hook foi definido;
- dependency foi definida;
- rollback foi definido;
- uninstall foi definido;
- chart e release foram diferenciados;
- chart version e app version foram diferenciadas;
- SemVer foi explicado;
- Helm não foi tratado como substituto do Kubernetes;
- values não foram tratados como Secret;
- context kind foi validado;
- preflight foi executado;
- aplicação permaneceu saudável;
- Helm client foi validado;
- Helm version foi registrada;
- repositories foram listados;
- releases de todos os namespaces foram listadas;
- ingress-nginx foi encontrado;
- metrics-server foi encontrado;
- inventário JSON foi criado;
- release name foi registrada;
- namespace foi registrado;
- revision foi registrada;
- status foi registrado;
- chart foi registrado;
- app version foi registrada;
- `helm status` foi executado;
- `helm history` foi executado;
- values defaults foram consultados;
- values informados foram consultados;
- diferenças foram identificadas;
- manifest foi auditado sem versionar conteúdo sensível;
- quantidade de documents foi calculada;
- kinds foram inventariados;
- cluster-scoped resources foram identificados;
- chart name foi separado;
- chart version foi separada;
- diretório temporário seguro foi criado;
- cleanup em finally foi exigido;
- chart instalado foi baixado pela versão exata;
- `helm show chart` foi usado;
- `helm show values` foi usado;
- `helm lint` foi executado;
- lint result foi registrado;
- chart foi renderizado offline;
- values sanitizados foram usados;
- output dir temporário foi usado;
- server-side dry-run foi executado;
- kinds renderizados foram comparados;
- diferenças de capabilities foram consideradas;
- policy de auditoria foi criada;
- namespace explícito foi exigido;
- chart version foi exigida;
- manifest security scan foi exigido;
- policy de segurança foi criada;
- repository allowlist foi criada;
- `latest` foi proibido;
- hooks foram revisados;
- CRDs foram consideradas;
- Secret em values foi proibido;
- privileged foi proibido por padrão;
- hostPath foi proibido;
- RBAC amplo foi marcado para aprovação futura;
- policy de values foi criada;
- ordem dos values foi documentada;
- tipos foram preservados;
- deprecation policy foi prevista;
- policy de upgrade foi criada;
- changelog foi exigido;
- rendered diff foi exigido;
- API compatibility foi exigida;
- image changes foram exigidas;
- rollback revision foi exigida;
- smoke tests foram exigidos;
- decisão de upgrade foi simulada;
- nenhum upgrade real foi executado;
- decisão de rollback foi criada;
- impacto de dados foi considerado;
- impacto de hooks foi considerado;
- impacto de CRDs foi considerado;
- impacto de volumes foi considerado;
- rollback foi simulado;
- nenhum rollback real foi executado;
- uninstall foi documentado;
- releases críticas não foram removidas;
- hooks foram auditados;
- ausência de hooks foi aceita;
- notes foram auditadas;
- plano do chart da aplicação foi criado;
- resources do futuro chart foram listados;
- Secret values foram excluídos;
- ownership de namespace foi excluído;
- ClusterRole foi excluída;
- PersistentVolume foi excluído;
- boundaries foram definidas;
- cluster ficou fora do chart;
- Ingress Controller ficou fora do chart;
- Metrics Server ficou fora do chart;
- secret store ficou fora do chart;
- RBAC corporativo ficou fora do chart;
- evidence foi criada;
- evidence não contém values sensíveis;
- evidence não contém manifests completos;
- evidence não contém kubeconfig;
- arquitetura Helm foi documentada;
- chart, release e values foram documentados;
- lifecycle foi documentado;
- renderização foi documentada;
- precedência foi documentada;
- security policy foi documentada;
- runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- OCI foi explicado sem publicação;
- provenance foi explicada sem chave;
- dependencies foram explicadas;
- Chart.lock foi explicado;
- library chart foi explicado;
- named templates foram explicados;
- values schema foi explicado;
- `lookup` foi restringido;
- `tpl` foi restringido;
- release storage foi tratado como sensível;
- drift foi explicado;
- GitOps foi explicado sem instalação;
- chart funcional da aplicação não foi criado;
- Namespace avançado não foi implementado;
- Role não foi criada;
- ClusterRole não foi criada;
- RoleBinding não foi criado;
- baseline do cluster foi validada;
- nenhuma revisão nova foi criada;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 536 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/helm-concepts `
  scripts/kubernetes/helm `
  docs/devops/helm `
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
      "password|token|client-key-data|stringData:|sh.helm.release"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): consolidar conceitos de Helm"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- Secret;
- release storage decodificado;
- values sensíveis;
- manifests completos de componentes externos;
- chart baixado;
- diretório temporário;
- artifact não sanitizado;
- upgrade real;
- rollback real;
- uninstall;
- chart funcional da aplicação;
- Role ou RoleBinding da aula 536.

---

## Fechamento e ponte para a próxima aula

Nesta aula, Helm deixou de ser tratado como um comando para instalar componentes.

O modelo passou a possuir:

```text
Chart;

Values;

Templates;

Release;

Revision;

Lifecycle;

Policies;

Evidence.
```

Você comprovou que:

- chart é pacote;
- values são entradas;
- templates geram manifests;
- release é a instalação versionada;
- chart version difere de app version;
- lint não substitui renderização e validação;
- history sustenta rollback;
- rollback não resolve automaticamente dados e CRDs;
- uninstall precisa avaliar recursos preservados;
- hooks ampliam o lifecycle e o risco;
- dependencies precisam de lock;
- values não protegem Secrets;
- Helm não reconcilia continuamente;
- releases existentes podem ser auditadas sem upgrade;
- o futuro chart da aplicação precisa de boundaries claros.

A próxima aula será:

```text
536 - M17.31 - Namespace RBAC conceitual
```

Nela, você irá aprofundar como namespaces organizam escopo e como Roles, ClusterRoles, RoleBindings, ClusterRoleBindings e ServiceAccounts controlam quem pode operar resources e releases.

Nenhuma Role, ClusterRole, RoleBinding ou ClusterRoleBinding foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei os releases.
- [ ] Registrei chart e app versions.
- [ ] Comparei values padrão e overrides.
- [ ] Renderizei um chart instalado.
- [ ] Executei lint e server dry-run.
- [ ] Simulei upgrade e rollback.
- [ ] Preservei a baseline do cluster.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `helm list` não mostra a release

Revise namespace ou use `--all-namespaces`.

### `helm status` retorna release not found

Confirme release name, namespace e context.

### O repository não existe

Liste repositories, adicione a origem aprovada e atualize o índice.

### A chart version não é encontrada

O índice local pode estar desatualizado ou a versão foi removida.

### `helm lint` passa e o apply falha

Lint não conhece todos os detalhes do cluster.

### `helm template` produz YAML inválido

Revise tipos, indentação, helpers e values.

### O upgrade fica `pending-upgrade`

Investigue a operação anterior antes de alterar o storage da release.

### O rollback não restaura os dados

Helm atua sobre resources; dados precisam de estratégia própria.

### Um hook fica pendente

Consulte Job, Pod, logs, timeout e cleanup policy.

### Values aparecem com tipo incorreto

Revise YAML, `--set`, `--set-string` e schema.

### Um Secret apareceu em `helm get values`

Trate como exposição e revise o processo de injeção.

### Uma Role foi criada nesta aula

Remova e preserve para a aula 536.

---

## Perguntas de revisão

1. O que é Helm?
2. O que é Chart?
3. O que é Release?
4. O que são Values?
5. O que é Template?
6. Qual a diferença entre chart version e app version?
7. O que é revision?
8. O que faz `helm template`?
9. O que faz `helm lint`?
10. O que faz `helm status`?
11. O que faz `helm history`?
12. O que é upgrade?
13. O que é rollback?
14. Rollback restaura dados automaticamente?
15. O que é hook?
16. O que é dependency?
17. Values protegem Secrets?
18. Helm reconcilia continuamente?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Gerenciador de pacotes.
2. Pacote versionado.
3. Instalação do chart.
4. Entradas de configuração.
5. Fonte dos manifests.
6. Pacote e aplicação.
7. Histórico da release.
8. Renderizar sem instalar.
9. Validar problemas comuns.
10. Mostrar status.
11. Mostrar revisions.
12. Criar nova revisão.
13. Basear-se em revisão anterior.
14. Não.
15. Resource de lifecycle.
16. Chart dependente.
17. Não.
18. Não.
19. Chart funcional e RBAC.
20. Namespace RBAC conceitual.

---

## Desafio opcional

Audite um terceiro chart sem instalá-lo.

Requisitos:

- repository aprovado;
- chart version explícita;
- `helm show chart`;
- `helm show values`;
- download temporário;
- `helm lint`;
- `helm template`;
- inventário de kinds;
- análise de hooks, CRDs e permissions;
- cleanup;
- nenhuma instalação.

O objetivo é praticar supply chain e revisão antes de permitir uma release no cluster.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 535 - M17.30 - Helm conceitual

- Continuei após Volumes Kubernetes.
- Defini Helm como gerenciador de pacotes para Kubernetes.
- Diferenciei Chart, Values, Templates e Release.
- Diferenciei chart version e app version.
- Estudei repositories e distribuição OCI.
- Estudei install, upgrade, revision, rollback e uninstall.
- Estudei `--wait`, `--atomic` e cleanup em falha.
- Estudei precedência de values.
- Reforcei que values não protegem Secrets.
- Estudei `helm lint`, `helm template` e server-side dry-run.
- Inventariei os releases `ingress-nginx` e `metrics-server`.
- Consultei status, history, values, manifest, hooks e notes.
- Registrei chart versions, app versions e revisions.
- Baixei temporariamente a versão instalada do chart.
- Executei lint.
- Renderizei manifests fora do cluster.
- Comparei kinds renderizados e instalados.
- Criei policies de auditoria, values, segurança e upgrade.
- Simulei uma decisão de upgrade.
- Simulei uma decisão de rollback.
- Documentei riscos de uninstall, hooks, CRDs e dependencies.
- Criei um plano, sem templates, para o futuro chart da aplicação.
- Defini boundaries de ownership do chart.
- Criei evidence sanitizada.
- Preservei ingress-nginx, Metrics Server, HPA e a aplicação.
- Não antecipei Namespace ou RBAC.
- Próxima aula: Namespace RBAC conceitual.
```

---

## Referência técnica curta

- Helm Architecture.
- Helm Charts.
- Helm Releases.
- Helm Values.
- Helm Template Functions.
- Helm Upgrade and Rollback.
- Helm Hooks.
- Helm Dependencies.
- Helm Chart Repositories.
- Helm OCI Registries.

Regra final:

```text
Helm empacota e versiona resources Kubernetes sem substituir o conhecimento da API: Chart contém metadata, defaults e templates, Values fornecem entradas não sensíveis, a renderização produz manifests e Release representa a instalação com namespace, revision, history e lifecycle; chart version controla o pacote e app version informa a aplicação, enquanto lint, template, server-side dry-run, policy checks e comparação antecedem qualquer upgrade; `--wait`, `--atomic`, rollback e uninstall possuem limites e não recuperam automaticamente dados, CRDs, hooks ou recursos externos; repositories, dependencies, Chart.lock, images, permissions, hooks e provenance fazem parte da supply chain, e values ou storage da release não devem receber Secrets em texto puro; ingress-nginx e Metrics Server são auditados por status, history, values, manifests sanitizados e renderização da versão exata sem criar nova revisão; o futuro chart da aplicação recebe boundaries, mas não é implementado, deixando para a aula 536 a organização por Namespace e o controle de acesso com RBAC.
```
