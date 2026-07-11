# 404 - M14.49 - Checklist de produção inicial

## Apresentação da aula

Na aula 403, você revisou erros comuns em APIs REST.

A auditoria analisou:

```text
URIs;

métodos HTTP;

status;

DTOs;

validation;

Problem Details;

paginação;

idempotência;

versionamento;

headers;

documentação.
```

Aquela aula respondeu:

```text
o contrato REST está consistente
e previsível para os consumidores?
```

Agora a pergunta muda.

Uma API pode possuir endpoints corretos, testes verdes e documentação atualizada, mas ainda não estar pronta para receber tráfego de produção.

Considere estes cenários:

```text
a aplicação inicia,
mas não existe rollback documentado;

o health responde UP,
mas ninguém recebe alertas;

o banco possui migrations,
mas backup e restore nunca foram testados;

a imagem roda como usuário não root,
mas a senha está em arquivo local;

a API possui rate limiting,
mas não possui autenticação;

os testes passam,
mas não existe evidência do commit implantado;

o container está healthy,
mas uploads ficam em disco local
e a aplicação não suporta múltiplas instâncias.
```

Cada item isolado pode parecer pequeno.

Juntos, eles determinam se uma implantação é controlada ou uma aposta.

A pergunta central desta aula será:

```text
quais evidências mínimas precisam existir
antes de aprovar uma API
para um ambiente de produção?
```

A resposta será organizada em um checklist inicial de prontidão.

O documento principal será:

```text
docs/api/PRODUCTION_READINESS_CHECKLIST.md
```

Ele não será apenas uma lista de caixas.

Cada item terá:

- categoria;
- requisito;
- criticidade;
- status;
- evidência;
- responsável;
- ação pendente;
- prazo ou marco;
- decisão.

Os status serão:

```text
PASS;

PARTIAL;

FAIL;

NOT_APPLICABLE;

EVIDENCE_MISSING.
```

As criticidades serão:

```text
BLOCKER;

HIGH;

MEDIUM;

LOW.
```

A regra principal será:

```text
item marcado como PASS
precisa apontar para evidência reproduzível.
```

Exemplos de evidência:

```text
comando e resultado;

teste automatizado;

arquivo versionado;

link para configuração;

hash de commit;

relatório;

log sanitizado;

procedimento executado.
```

Frases como:

```text
acho que funciona;

o desenvolvedor testou;

sempre foi assim;

deve estar certo.
```

não são evidências.

O checklist cobrirá:

```text
identificação da release;

build e artefato;

configuração;

secrets;

banco e migrations;

backup e restore;

contrato HTTP;

segurança;

resiliência;

observabilidade;

performance e capacidade;

containers;

deploy;

rollback;

testes;

documentação;

operação;

riscos conhecidos.
```

A API atual será avaliada de forma honesta.

Ela possui uma base técnica relevante:

- Java 21;
- Spring Boot;
- PostgreSQL;
- Flyway;
- Redis;
- Problem Details;
- OpenAPI;
- testes unitários;
- testes de controller;
- integração com Testcontainers;
- contrato;
- Actuator;
- liveness;
- readiness;
- Docker;
- Compose;
- documentação;
- coleção Postman/Insomnia.

Porém, ainda não possui:

- autenticação;
- autorização;
- Spring Security;
- TLS;
- gestão de secrets de produção;
- backup e restore comprovados;
- monitoramento externo;
- alertas;
- armazenamento compartilhado de arquivos;
- lock distribuído para scheduler;
- estratégia de múltiplas instâncias;
- teste de carga;
- teste de segurança;
- processo formal de rollback.

A conclusão técnica desta baseline será:

```text
GO:
laboratório local e ambiente controlado
sem dados sensíveis.

NO-GO:
produção pública
ou ambiente com dados reais.
```

Essa conclusão não diminui o projeto.

Ela demonstra maturidade.

Um checklist profissional existe justamente para impedir que uma aplicação seja chamada de production-ready apenas porque:

```text
compila;

sobe;

responde 200.
```

O Spring Boot oferece recursos chamados de production-ready, como health, métricas e gerenciamento operacional.

Esses recursos ajudam a preparar a aplicação.

Eles não certificam, sozinhos, que o sistema está pronto para produção.

Da mesma forma, Docker Compose ajuda a definir e executar uma aplicação multicontainer, mas não substitui:

- governança;
- segurança;
- backups;
- alta disponibilidade;
- observabilidade externa;
- resposta a incidentes.

O OWASP API Security Top 10 também reforça riscos que a baseline ainda não resolveu, especialmente:

```text
Broken Object Level Authorization;

Broken Authentication;

Broken Object Property Level Authorization;

Unrestricted Resource Consumption;

Security Misconfiguration.
```

A aula não implementará todos esses controles.

Ela os transformará em itens explícitos de bloqueio.

A próxima aula será:

```text
405 - M14.50 - Projeto API OS parte 1 dominio e CRUD
```

Por isso, esta aula não começará o domínio de Ordem de Serviço.

Ela encerra a preparação técnica anterior ao projeto guiado.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
400:
Compose API PostgreSQL Redis.

401:
Coleção Postman/Insomnia profissional.

402:
Documentação técnica da API.

403:
Erros comuns em API REST.

404:
Checklist de produção inicial.

405:
Projeto API OS parte 1 dominio e CRUD.

406:
Projeto API OS parte 2 validacoes e erros.
```

A aula 403 respondeu:

```text
a API respeita convenções REST
e mantém suas fontes alinhadas?
```

A aula 404 responderá:

```text
há evidência suficiente
para aprovar uma release
em determinado ambiente?
```

Nesta aula:

```text
checklist:
sim.

evidências:
sim.

criticidade:
sim.

responsável:
sim.

GO/NO-GO:
sim.

build:
sim.

configuração:
sim.

banco:
sim.

backup:
avaliado.

segurança:
avaliada.

observabilidade:
avaliada.

rollback:
avaliado.

correção de todos os gaps:
não.

Spring Security:
não.

deploy real:
não.

projeto API OS:
não.
```

A regra central será:

```text
prontidão depende
do ambiente e do risco;

sem evidência,
o item não está aprovado.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/api/PRODUCTION_READINESS_CHECKLIST.md
```

O documento conterá:

1. identificação da avaliação;
2. critérios de status;
3. critérios de criticidade;
4. regra de evidência;
5. matriz de prontidão;
6. bloqueadores;
7. riscos aceitos;
8. plano de ação;
9. decisão final;
10. assinaturas ou responsáveis.

A primeira avaliação será preenchida para:

```text
Ambiente alvo:
produção pública com dados reais.

Resultado esperado:
NO-GO.
```

Você também registrará uma avaliação limitada:

```text
Ambiente alvo:
laboratório local controlado.

Resultado:
GO CONDICIONAL.
```

O checklist inicial terá categorias:

```text
A — Identificação da release;

B — Build e dependências;

C — Configuração e secrets;

D — Banco, migrations e dados;

E — Contrato e compatibilidade;

F — Segurança;

G — Resiliência;

H — Observabilidade e operação;

I — Performance e capacidade;

J — Containers e infraestrutura;

K — Deploy e rollback;

L — Testes e qualidade;

M — Documentação e suporte;

N — Decisão final.
```

Você irá:

- coletar o commit;
- executar testes;
- construir a imagem;
- validar Compose;
- verificar usuário não root;
- consultar health;
- revisar migrations;
- verificar secrets;
- revisar backup;
- revisar segurança;
- revisar logs;
- revisar armazenamento;
- revisar rollback;
- classificar gaps;
- emitir a decisão.

---

## Conceito essencial

### Pronto para qual ambiente?

A frase:

```text
pronto para produção
```

é incompleta.

Perguntas necessárias:

```text
produção pública ou interna?

dados reais ou sintéticos?

quantos usuários?

qual criticidade?

qual RTO?

qual RPO?

uma ou várias instâncias?

qual volume?

qual regulação?

qual suporte?
```

A mesma aplicação pode estar:

```text
aprovada para laboratório;

reprovada para produção pública.
```

O checklist precisa declarar o alvo.

---

### PASS

Use `PASS` quando:

- requisito está atendido;
- evidência existe;
- evidência foi revisada;
- comportamento é adequado ao ambiente alvo.

Exemplo:

```text
container executa sem root;

evidência:
docker run --entrypoint id.
```

---

### PARTIAL

Use `PARTIAL` quando:

- parte do requisito existe;
- ainda há limitação;
- risco foi identificado;
- uma ação está aberta.

Exemplo:

```text
logs possuem correlation ID,
mas não existe centralização.
```

---

### FAIL

Use `FAIL` quando:

- requisito não está atendido;
- comportamento é incompatível;
- risco não é aceitável.

Exemplo:

```text
produção pública sem autenticação.
```

---

### EVIDENCE_MISSING

O time afirma que o item está implementado, mas não apresenta prova reproduzível.

Exemplo:

```text
backup existe,
mas restore nunca foi executado.
```

Não marque como `PASS`.

Backup sem restore testado é uma hipótese.

---

### BLOCKER

Um blocker impede a aprovação do ambiente alvo.

Exemplos para produção pública:

- sem autenticação;
- sem autorização;
- sem TLS;
- secret em repositório;
- sem backup;
- migration destrutiva sem estratégia;
- exposição de dados sensíveis;
- rollback impossível;
- vulnerabilidade crítica conhecida.

Um blocker precisa de decisão explícita.

Não pode desaparecer em uma lista longa.

---

### Critério de GO

Uma política inicial pode ser:

```text
zero BLOCKER em FAIL;

zero BLOCKER em EVIDENCE_MISSING;

HIGH em PARTIAL somente com aceite formal;

rollback definido;

responsáveis disponíveis.
```

A política pode variar.

Ela precisa existir antes da decisão.

---

### Segurança como bloqueio real

A API atual não possui autenticação nem autorização.

O header:

```text
X-Client-Id
```

é usado no rate limiting.

Ele não prova identidade.

Qualquer cliente pode enviar outro valor.

Portanto:

```text
rate limiting por client ID
não substitui autenticação.
```

Para produção pública, o item será `FAIL/BLOCKER`.

---

### Gestão de secrets

O laboratório usa env files ignorados pelo Git.

Isso é melhor que versionar passwords.

Ainda não é uma solução completa de produção.

Uma gestão adequada pode utilizar:

- secret manager;
- arquivos montados;
- Docker secrets;
- Kubernetes Secrets associados a controles externos;
- credenciais temporárias;
- rotação.

O checklist registra:

```text
local:
aceitável para laboratório.

produção:
EVIDENCE_MISSING ou FAIL.
```

---

### Banco e migrations

Flyway existe.

Isso é um ponto positivo.

Ainda é necessário avaliar:

- migration testada em banco vazio;
- migration testada em banco com dados;
- compatibilidade durante deploy;
- tempo de lock;
- rollback ou forward fix;
- backup antes de alteração destrutiva;
- conta com privilégios mínimos.

A integração com Testcontainers prova banco vazio.

Ela não prova migration sobre volume real grande.

---

### Backup e restore

O item correto não é:

```text
backup configurado.
```

É:

```text
restore testado
e tempo registrado.
```

RPO:

```text
quanto dado pode ser perdido.
```

RTO:

```text
quanto tempo pode levar a recuperação.
```

A baseline ainda não definiu esses objetivos.

O item será blocker para produção com dados reais.

---

### Observabilidade

Actuator, health e métricas existem.

Ainda faltam:

- coleta externa;
- retenção;
- dashboards;
- alertas;
- responsável;
- runbook;
- threshold;
- teste de alerta.

Uma métrica exposta e nunca coletada não alerta ninguém.

O status será `PARTIAL`.

---

### Liveness e readiness

Os endpoints existem.

O checklist precisa verificar:

- path correto;
- status;
- timeout;
- frequência;
- sem dependência externa na liveness;
- readiness coerente;
- uso pela plataforma.

Um endpoint não utilizado pela infraestrutura não controla tráfego.

---

### Armazenamento local

Uploads estão em volume Docker local.

Isso funciona em uma instância.

Em múltiplas instâncias:

```text
a request pode chegar
a um container que não possui o arquivo.
```

Também faltam:

- backup;
- replicação;
- antivírus;
- lifecycle;
- quota;
- storage compartilhado.

Para produção multi-instância, é blocker.

---

### Scheduler

A limpeza de arquivos usa scheduler por instância.

Com duas réplicas:

```text
duas execuções podem ocorrer.
```

A baseline não possui lock distribuído.

Isso precisa ser resolvido antes de escalar horizontalmente.

---

### Cache e Redis

PostgreSQL permanece fonte da verdade.

Redis é reconstruível.

Pontos a avaliar:

- timeout;
- fail-open;
- eviction;
- memória;
- observabilidade;
- proteção de rede;
- senha ou ACL;
- TLS quando aplicável.

A stack local usa Redis sem autenticação e somente na rede Compose.

Para produção, a decisão depende da rede e do provedor.

---

### Rate limiting

O rate limiting inicial reduz abuso simples.

Ainda faltam:

- identidade confiável;
- política por endpoint;
- capacidade distribuída;
- limites definidos por produto;
- monitoramento de rejeições;
- proteção contra cardinalidade excessiva;
- testes de bypass.

Ele será `PARTIAL`.

---

### Imagem e container

Pontos já atendidos:

- multi-stage;
- JRE no runtime;
- usuário não root;
- healthcheck;
- configuration externa;
- volume de upload;
- ENTRYPOINT exec.

Pontos pendentes:

- digest da base;
- scan de vulnerabilidade;
- SBOM;
- assinatura;
- registry;
- política de atualização;
- filesystem read-only;
- limites de recursos.

---

### Rollback

Rollback de aplicação e rollback de banco são problemas diferentes.

Aplicação:

```text
subir imagem anterior.
```

Banco:

```text
migration já pode ter alterado dados.
```

Uma imagem antiga pode não funcionar com schema novo.

O checklist exige:

- compatibilidade;
- plano de rollback;
- forward fix;
- backup;
- responsável;
- critério de abortar deploy.

A baseline ainda não possui esse processo.

---

## Mão na massa guiada

### 1. Criar o documento

Arquivo:

```text
docs/api/PRODUCTION_READINESS_CHECKLIST.md
```

Cabeçalho:

```markdown
# Checklist inicial de prontidão para produção

## Identificação

- Aplicação: Formação Java Backend API
- Ambiente alvo: Produção pública com dados reais
- Commit avaliado: `<preencher>`
- Imagem avaliada: `formacao-java-backend-api:<tag>`
- Data da avaliação: `<preencher>`
- Revisores: `<preencher>`
- Decisão: NO-GO
```

Os campos precisam ser preenchidos durante a execução.

---

### 2. Registrar regras

Adicione:

```markdown
## Regras

- PASS exige evidência reproduzível.
- BLOCKER em FAIL impede GO.
- Item sem prova recebe EVIDENCE_MISSING.
- Risco aceito exige responsável e condição.
- A decisão vale somente para o commit e ambiente identificados.
```

---

### 3. Criar a tabela

Modelo:

```markdown
| ID | Requisito | Criticidade | Status | Evidência | Responsável | Ação |
|---|---|---|---|---|---|---|
```

Use IDs:

```text
REL;
BLD;
CFG;
DAT;
API;
SEC;
RES;
OBS;
PER;
CTR;
DEP;
TST;
DOC;
OPS.
```

---

### 4. Identificar a release

Execute:

```powershell
git rev-parse HEAD

git status --short

git log -1 --oneline
```

Critérios:

```text
commit conhecido;

working tree limpa;

tag ou versão definida.
```

Se existem alterações não commitadas:

```text
EVIDENCE_MISSING.
```

---

### 5. Executar o quality gate

```powershell
.\mvnw.cmd clean verify
```

Registre:

- data;
- commit;
- quantidade de testes;
- failures;
- relatório.

Não copie o diretório `target` para o Git.

Evidência pode ser:

```text
comando registrado;

log de pipeline;

relatório publicado.
```

---

### 6. Executar testes principais

Confirme:

```text
controller;

service;

integração;

contrato.
```

Comandos:

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,SimpleEmailNotificationServiceTest,EmailNotificationProviderContractTest" `
  test

.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePostgreSqlIT `
  test
```

O teste de integração exige Docker.

---

### 7. Validar dependências

Execute:

```powershell
.\mvnw.cmd dependency:tree
```

Registre:

```text
dependency management pelo Spring Boot;
sem versões duplicadas óbvias.
```

A baseline ainda não possui scan de CVE formal.

Item:

```text
Dependency vulnerability scan:
EVIDENCE_MISSING / HIGH.
```

Não marque como seguro apenas porque compila.

---

### 8. Construir a imagem

```powershell
docker build `
  --build-arg APP_VERSION="404-readiness" `
  --tag "formacao-java-backend-api:404-readiness" `
  .
```

Registre o image ID:

```powershell
docker image inspect `
  "formacao-java-backend-api:404-readiness" `
  --format "{{.Id}}"
```

---

### 9. Verificar usuário não root

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java-backend-api:404-readiness"
```

Resultado esperado:

```text
uid=10001(app);
gid=10001(app).
```

Status:

```text
PASS.
```

---

### 10. Validar Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

Suba:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Registre:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

Todos os services precisam ficar healthy.

---

### 11. Validar health

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"

Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

Critérios:

```text
200;

body controlado;

sem details sensíveis.
```

Status da existência dos endpoints:

```text
PASS.
```

Uso por plataforma real:

```text
EVIDENCE_MISSING.
```

---

### 12. Validar configuração

Revise:

```text
application*.yaml;

@ConfigurationProperties;

compose.yaml;

env example.
```

Confirme:

- nenhuma senha no repositório;
- properties obrigatórias falham cedo;
- defaults são seguros;
- profile de laboratório não está ativado em produção.

Env file ignorado é evidência local.

Secret manager de produção:

```text
FAIL/BLOCKER.
```

---

### 13. Procurar secrets

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

Revise cada resultado.

Nomes de properties são permitidos.

Valores reais não são.

Também execute:

```powershell
git status --ignored --short
```

Confirme que env files locais estão ignorados.

---

### 14. Revisar autenticação e autorização

Perguntas:

```text
quem é o usuário?

como identidade é provada?

quem pode ler?

quem pode criar?

quem pode excluir?

existe autorização por recurso?
```

Resposta atual:

```text
não existe autenticação;
não existe autorização.
```

Classificação:

```text
SEC-001;
BLOCKER;
FAIL.
```

---

### 15. Revisar TLS

A stack local publica HTTP.

Não há termination TLS documentada.

Classificação para produção pública:

```text
SEC-002;
BLOCKER;
FAIL.
```

Uma futura plataforma pode terminar TLS no proxy ou load balancer.

Sem evidência do ambiente alvo, não marque como atendido.

---

### 16. Revisar rate limiting

Evidências:

- implementação Redis;
- teste manual 429;
- `Retry-After`;
- collection.

Limitação:

```text
X-Client-Id é controlado pelo cliente.
```

Classificação:

```text
PARTIAL;
HIGH.
```

---

### 17. Revisar uploads

Pontos positivos:

- limite;
- allowlist;
- filename sanitizado;
- UUID físico;
- `nosniff`;
- volume.

Gaps:

- sem antivírus;
- sem storage compartilhado;
- sem backup;
- sem quota por cliente;
- sem lifecycle operacional.

Classificação:

```text
PARTIAL;
BLOCKER para múltiplas instâncias.
```

---

### 18. Revisar migrations

Evidências:

- Flyway;
- `ddl-auto=validate`;
- Testcontainers em banco vazio;
- startup Compose.

Gaps:

- sem teste sobre cópia de dados real;
- sem avaliação de locks;
- sem rollback de migration;
- sem janela de deploy definida.

Classificação:

```text
PARTIAL;
HIGH.
```

---

### 19. Revisar backup e restore

Pergunte:

```text
há backup?

qual frequência?

onde fica?

é criptografado?

qual retenção?

restore foi testado?

qual RPO?

qual RTO?
```

Baseline:

```text
sem evidência.
```

Classificação:

```text
DAT-002;
BLOCKER;
EVIDENCE_MISSING.
```

---

### 20. Revisar PostgreSQL

Itens:

- volume persistente;
- migration;
- healthcheck;
- usuário separado;
- privilégios mínimos;
- conexão criptografada;
- pool;
- timeout;
- backup;
- monitoração.

O laboratório utiliza um usuário amplo de desenvolvimento.

Produção exige uma conta própria com privilégios mínimos.

Classificação:

```text
PARTIAL.
```

---

### 21. Revisar Redis

Itens:

- rede interna;
- sem porta no host;
- timeout;
- fail-open;
- healthcheck;
- memória;
- eviction;
- autenticação;
- TLS;
- métricas.

A rede Compose local reduz exposição.

Produção ainda precisa de evidência de proteção.

Classificação:

```text
PARTIAL.
```

---

### 22. Revisar scheduler

Pergunta:

```text
o ambiente terá mais de uma instância?
```

Se sim:

```text
scheduler será executado por todas.
```

Sem lock distribuído:

```text
RES-003;
BLOCKER para múltiplas instâncias;
FAIL.
```

Para uma única instância controlada:

```text
PARTIAL.
```

---

### 23. Revisar e-mail

Pontos:

- timeout;
- erro 503;
- logs seguros;
- profile;
- Mailpit local.

Gaps:

- sem retry durável;
- sem outbox;
- sem DLQ;
- sem provedor real testado;
- `SUBMITTED` não comprova entrega.

Classificação:

```text
PARTIAL;
MEDIUM.
```

---

### 24. Revisar observabilidade

Evidências:

- health;
- info;
- metrics;
- logs;
- correlation ID;
- readiness;
- liveness.

Gaps:

- sem coleta centralizada;
- sem dashboard;
- sem alerta;
- sem retenção;
- sem runbook;
- sem on-call.

Classificação:

```text
PARTIAL;
HIGH.
```

---

### 25. Revisar performance e capacidade

Perguntas:

```text
qual throughput esperado?

qual latência aceitável?

qual payload máximo?

qual tamanho do pool?

qual limite de CPU?

qual limite de memória?

qual volume de arquivos?

qual crescimento do banco?
```

Baseline:

```text
sem teste de carga;
sem objetivos;
sem capacidade definida.
```

Classificação:

```text
PER-001;
HIGH;
EVIDENCE_MISSING.
```

---

### 26. Revisar imagem

Marque `PASS` para:

- multi-stage;
- JRE;
- não root;
- healthcheck;
- ENTRYPOINT exec;
- config externa.

Marque pendências:

- base sem digest;
- sem SBOM;
- sem scan;
- sem assinatura;
- sem registry definido.

Status geral:

```text
PARTIAL.
```

---

### 27. Revisar limites de recursos

O Compose local não define:

- CPU;
- memória;
- PIDs;
- filesystem read-only.

Produção precisa de limites compatíveis com testes de capacidade.

Status:

```text
EVIDENCE_MISSING.
```

---

### 28. Revisar deploy

Perguntas:

- quem aprova?
- qual pipeline?
- qual artefato?
- ambiente é imutável?
- existe smoke test?
- existe estratégia blue/green ou rolling?
- como abortar?
- como registrar versão?

Baseline:

```text
processo manual.
```

Classificação:

```text
PARTIAL ou FAIL
conforme ambiente alvo.
```

Para produção pública:

```text
HIGH;
FAIL.
```

---

### 29. Revisar rollback

Registre dois itens:

```text
rollback da imagem;

rollback do schema.
```

A imagem pode voltar para tag anterior.

O schema pode impedir essa volta.

Sem procedimento testado:

```text
DEP-002;
BLOCKER;
EVIDENCE_MISSING.
```

---

### 30. Revisar documentação e operação

Pontos positivos:

- README técnico;
- OpenAPI;
- collection;
- Compose;
- troubleshooting;
- revisão REST.

Pendências:

- runbook de incidente;
- backup;
- rollback;
- contatos;
- escalonamento;
- manutenção.

Status:

```text
PARTIAL.
```

---

### 31. Criar seção de blockers

No checklist:

```markdown
## Bloqueadores para produção pública

1. Sem autenticação.
2. Sem autorização.
3. Sem TLS comprovado.
4. Sem secret manager.
5. Sem backup e restore testados.
6. Sem rollback de aplicação e schema testado.
7. Sem estratégia para arquivos em múltiplas instâncias.
8. Sem lock distribuído para scheduler.
9. Sem monitoramento externo e alertas.
10. Sem teste de carga e capacidade.
```

A lista deve refletir a avaliação real.

---

### 32. Criar plano de ação

Tabela:

```markdown
| Ação | Criticidade | Responsável | Condição de conclusão |
|---|---|---|---|
| Implementar autenticação | BLOCKER | Backend/Security | Testes e revisão aprovados |
| Definir TLS | BLOCKER | Platform | Evidência do endpoint HTTPS |
| Testar restore | BLOCKER | DBA/Platform | Restore executado e tempo registrado |
```

Não use prazos fictícios.

Use marcos.

---

### 33. Emitir decisão

Para produção pública:

```markdown
## Decisão

**NO-GO**

Motivo: existem bloqueadores de segurança, proteção de dados,
recuperação, operação e escalabilidade sem implementação
ou sem evidência.
```

Para laboratório:

```markdown
## Uso aprovado

**GO CONDICIONAL para laboratório local controlado**

Condições:

- dados sintéticos;
- sem exposição pública;
- sem informações sensíveis;
- uma instância;
- operação supervisionada;
- volumes descartáveis ou conhecidos.
```

---

### 34. Registrar aceite de risco

Um risco não deve ser “aceito” automaticamente pelo desenvolvedor.

O aceite precisa de:

- risco descrito;
- impacto;
- probabilidade;
- mitigação;
- responsável autorizado;
- validade.

Na aula, registre:

```text
nenhum blocker aceito
para produção pública.
```

---

### 35. Revisar a matriz

Confirme:

- nenhum PASS sem evidência;
- nenhum blocker escondido;
- cada pendência possui responsável;
- ações possuem condição de conclusão;
- decisão corresponde aos dados.

---

### 36. Executar limpeza

Depois do laboratório:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Não remova volumes sem intenção.

---

## Entendendo o que foi feito

### A avaliação ganhou um ambiente alvo

Produção pública e laboratório não foram tratados como iguais.

### PASS passou a exigir evidência

Opinião deixou de ser suficiente.

### Gaps viraram blockers visíveis

Segurança e recuperação não ficaram escondidas em observações.

### Pontos positivos foram preservados

Testes, Docker, Actuator e documentação foram reconhecidos.

### Riscos foram conectados a responsáveis

A pendência deixou de ser abstrata.

### A decisão ficou honesta

O projeto está apto para laboratório, não para produção pública.

### O checklist virou ferramenta de governança

Ele orienta o próximo investimento técnico.

---

## Erros comuns importantes

### Marcar tudo como PASS

Isso elimina o valor do checklist.

### Confundir feature com evidência

Possuir código não prova operação.

### Avaliar sem ambiente alvo

O resultado fica genérico.

### Esconder blocker em observação

Bloqueadores precisam de destaque.

### Aceitar risco sem autoridade

O desenvolvedor não decide sozinho todos os riscos do negócio.

### Tratar env file como secret manager

Arquivo ignorado resolve apenas parte do problema local.

### Tratar health como monitoramento

Sem coleta e alerta, ninguém reage.

### Tratar backup como restore

Arquivo de backup não prova recuperação.

### Tratar imagem anterior como rollback completo

Schema pode ser incompatível.

### Usar checklist como cerimônia

Sem comandos, evidências e ações, ele vira burocracia.

---

## Comandos úteis

### Identificar commit

```powershell
git rev-parse HEAD
git status --short
```

### Quality gate

```powershell
.\mvnw.cmd clean verify
```

### Build da imagem

```powershell
docker build `
  --build-arg APP_VERSION="404-readiness" `
  --tag "formacao-java-backend-api:404-readiness" `
  .
```

### Verificar usuário

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java-backend-api:404-readiness"
```

### Validar Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

### Procurar secrets

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

### Consultar health

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"
```

---

## Exercício guiado

### Parte 1 — Identificação

Registre commit, imagem, data, ambiente e revisores.

### Parte 2 — Evidências técnicas

Execute testes, build, Compose e health.

### Parte 3 — Segurança

Classifique autenticação, autorização, TLS e secrets.

### Parte 4 — Dados

Classifique migrations, backup, restore e privilégios.

### Parte 5 — Operação

Classifique logs, métricas, alertas e runbooks.

### Parte 6 — Escalabilidade

Classifique uploads, scheduler, Redis e múltiplas instâncias.

### Parte 7 — Deploy

Classifique pipeline, smoke test, rollback e schema.

### Parte 8 — Decisão

Emita GO, GO CONDICIONAL ou NO-GO.

### Parte 9 — Plano

Crie ações com responsáveis e condições de conclusão.

### Parte 10 — Registrar decisão

Anote:

```text
PASS exige evidência;

ambiente alvo explícito;

zero blocker em FAIL para GO;

produção pública:
NO-GO;

laboratório controlado:
GO CONDICIONAL;

sem autenticação;

sem autorização;

sem TLS;

sem secret manager;

sem restore testado;

sem rollback testado;

sem storage compartilhado;

sem lock distribuído;

sem alertas;

sem teste de carga.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 403 foi preservada;
- checklist foi diferenciado de garantia;
- ambiente alvo foi definido;
- produção pública foi separada de laboratório;
- status PASS foi definido;
- status PARTIAL foi definido;
- status FAIL foi definido;
- status NOT_APPLICABLE foi definido;
- status EVIDENCE_MISSING foi definido;
- criticidade BLOCKER foi definida;
- criticidade HIGH foi definida;
- criticidade MEDIUM foi definida;
- criticidade LOW foi definida;
- regra de evidência foi criada;
- evidência foi vinculada ao commit;
- política de GO foi criada;
- responsáveis foram definidos;
- ações foram separadas de requisitos;
- `PRODUCTION_READINESS_CHECKLIST.md` foi criado;
- identificação da avaliação foi preenchida;
- commit foi registrado;
- imagem foi registrada;
- ambiente foi registrado;
- revisores foram registrados;
- working tree foi verificada;
- quality gate foi executado;
- testes de controller foram executados;
- testes de service foram executados;
- testes de integração foram executados;
- testes de contrato foram executados;
- dependency tree foi revisada;
- ausência de scan de CVE foi registrada;
- imagem foi construída;
- image ID foi registrado;
- usuário não root foi comprovado;
- Compose foi validado;
- services healthy foram comprovados;
- liveness foi comprovada;
- readiness foi comprovada;
- health sem detalhes foi comprovado;
- configuração foi revisada;
- fail-fast foi revisado;
- secrets no Git foram procurados;
- env files ignorados foram comprovados;
- ausência de secret manager foi classificada;
- autenticação ausente foi blocker;
- autorização ausente foi blocker;
- TLS ausente foi blocker;
- rate limiting foi classificado como parcial;
- X-Client-Id não foi tratado como identidade;
- uploads foram revisados;
- antivírus ausente foi registrado;
- storage compartilhado ausente foi registrado;
- migrations foram revisadas;
- banco vazio foi testado;
- ausência de teste com dados reais foi registrada;
- backup foi avaliado;
- restore foi avaliado;
- RPO ausente foi registrado;
- RTO ausente foi registrado;
- privilégios do banco foram avaliados;
- Redis foi avaliado;
- scheduler por instância foi avaliado;
- ausência de lock distribuído foi blocker para múltiplas instâncias;
- e-mail foi avaliado;
- ausência de outbox foi registrada;
- observabilidade foi avaliada;
- ausência de coleta externa foi registrada;
- ausência de alertas foi registrada;
- performance foi avaliada;
- ausência de teste de carga foi registrada;
- capacidade não definida foi registrada;
- imagem foi avaliada;
- ausência de SBOM foi registrada;
- ausência de scan de imagem foi registrada;
- limites de recursos foram avaliados;
- deploy foi avaliado;
- processo manual foi registrado;
- rollback da imagem foi avaliado;
- rollback do schema foi avaliado;
- documentação foi avaliada;
- runbook ausente foi registrado;
- lista de blockers foi criada;
- plano de ação foi criado;
- ações possuem responsáveis;
- ações possuem condição de conclusão;
- decisão NO-GO foi emitida para produção pública;
- GO CONDICIONAL foi emitido para laboratório;
- condições do laboratório foram registradas;
- nenhum blocker foi aceito informalmente;
- matriz foi revisada;
- Spring Security não foi antecipado;
- deploy real não foi antecipado;
- projeto API OS não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 405 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "docs(m14): avaliar prontidao inicial para producao"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- env files;
- credentials;
- logs com secrets;
- relatório `target`;
- dump de banco;
- imagens exportadas;
- dados reais;
- aceite de risco informal;
- evidência de outro commit.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou a pergunta:

```text
a aplicação funciona?
```

em uma pergunta mais madura:

```text
há evidência suficiente
para assumir o risco
deste ambiente?
```

A avaliação passou por:

```text
release;

build;

configuração;

secrets;

banco;

backup;

segurança;

resiliência;

observabilidade;

performance;

containers;

deploy;

rollback;

testes;

documentação;

operação.
```

A conclusão foi:

```text
laboratório controlado:
GO CONDICIONAL.

produção pública:
NO-GO.
```

A decisão central foi:

```text
production-ready
não é uma annotation,
uma dependência
ou um container healthy;

é uma decisão baseada
em evidências, riscos,
responsáveis e capacidade operacional.
```

A próxima aula será:

```text
405 - M14.50 - Projeto API OS parte 1 dominio e CRUD
```

Nela, você iniciará um projeto guiado de Ordem de Serviço.

A primeira parte tratará:

- linguagem do domínio;
- entidade e estados iniciais;
- commands e responses;
- endpoints;
- regras básicas;
- persistência;
- CRUD;
- migrations;
- primeiros testes.

Validações e erros avançados ficarão para a aula 406.

Persistência e filtros serão aprofundados na aula 407.

Testes e documentação serão consolidados na aula 408.

Nada desse projeto foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini o ambiente alvo.
- [ ] Coletei evidências vinculadas ao commit.
- [ ] Classifiquei blockers e riscos.
- [ ] Emitei NO-GO para produção pública.
- [ ] Criei um plano de ação com responsáveis.

---

## Troubleshooting adicional

### O checklist possui muitos EVIDENCE_MISSING

Isso significa que o processo ainda depende de conhecimento informal.

Priorize evidências dos blockers.

### O time discorda da criticidade

Registre:

- impacto;
- probabilidade;
- ambiente;
- decisão;
- responsável autorizado.

Não resolva por votação informal.

### Teste passa em outro commit

Execute novamente na release avaliada.

### Restore não pode ser testado

Não marque backup como PASS.

Registre blocker ou risco formal.

### O environment é interno

Reavalie:

- dados;
- rede;
- usuários;
- criticidade.

Interno não significa automaticamente seguro.

### Docker Compose está healthy

Isso comprova apenas a execução local da stack.

Não prova alta disponibilidade ou operação de produção.

### Não existe responsável pela pendência

Esse é um problema de governança.

O item não possui plano real até receber dono.

---

## Observações para evolução

Uma avaliação mais madura pode incluir:

- threat modeling;
- análise de dependências;
- SAST;
- DAST;
- secret scanning;
- SBOM;
- assinatura de imagem;
- policy as code;
- teste de carga;
- capacity planning;
- chaos testing;
- RTO e RPO;
- backup automatizado;
- restore periódico;
- SLI e SLO;
- alertas;
- on-call;
- runbooks;
- game days;
- auditoria;
- compliance;
- segregação de funções.

O OWASP API Security Top 10 deve participar da evolução de segurança.

Actuator, métricas e health são bases operacionais.

Eles precisam ser conectados a uma plataforma real de coleta e resposta.

O checklist deve ser executado novamente a cada mudança relevante de arquitetura ou ambiente.

---

## Perguntas de revisão

1. Checklist garante ausência de incidentes?
2. O que um PASS exige?
3. O que é EVIDENCE_MISSING?
4. O que é blocker?
5. A avaliação vale para qualquer ambiente?
6. X-Client-Id autentica?
7. Env file é secret manager?
8. Flyway prova restore?
9. Backup sem restore é suficiente?
10. Health significa monitoramento?
11. Liveness exposta garante restart?
12. Volume local suporta múltiplas instâncias?
13. Scheduler atual suporta réplicas?
14. Imagem anterior garante rollback?
15. O schema afeta rollback?
16. A aplicação possui teste de carga?
17. A produção pública foi aprovada?
18. O laboratório foi aprovado?
19. Qual foi a condição?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Não.
2. Evidência reproduzível.
3. Requisito alegado sem prova suficiente.
4. Item que impede GO.
5. Não.
6. Não.
7. Não.
8. Não.
9. Não.
10. Não.
11. Não sem plataforma configurada.
12. Não.
13. Não sem lock distribuído.
14. Não.
15. Sim.
16. Não.
17. Não.
18. Sim, condicionalmente.
19. Dados sintéticos e ambiente controlado.
20. Projeto API OS parte 1 domínio e CRUD.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 404 - M14.49 - Checklist de produção inicial

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei aplicação funcional de aplicação pronta para produção.
- Defini o ambiente alvo da avaliação.
- Criei `docs/api/PRODUCTION_READINESS_CHECKLIST.md`.
- Defini PASS, PARTIAL, FAIL, NOT_APPLICABLE e EVIDENCE_MISSING.
- Defini BLOCKER, HIGH, MEDIUM e LOW.
- Exigi evidência reproduzível para PASS.
- Vinculei a avaliação ao commit e à imagem.
- Registrei responsáveis e ações.
- Executei o quality gate.
- Executei testes de controller, service, integração e contrato.
- Revisei dependências.
- Registrei ausência de scan formal de vulnerabilidade.
- Construí e inspecionei a imagem.
- Comprovei usuário não root.
- Validei Compose e healthchecks.
- Testei liveness e readiness.
- Revisei configuração externalizada.
- Procurei secrets no repositório.
- Confirmei env files ignorados.
- Registrei ausência de secret manager.
- Classifiquei ausência de autenticação como blocker.
- Classifiquei ausência de autorização como blocker.
- Classifiquei ausência de TLS como blocker.
- Avaliei rate limiting.
- Avaliei uploads e storage local.
- Avaliei Flyway e migrations.
- Registrei ausência de backup e restore testados.
- Registrei ausência de RPO e RTO.
- Avaliei PostgreSQL e Redis.
- Avaliei scheduler por instância.
- Registrei ausência de lock distribuído.
- Avaliei notificação por e-mail.
- Avaliei logs, métricas e health.
- Registrei ausência de alertas e coleta externa.
- Registrei ausência de teste de carga.
- Avaliei imagem, recursos e deploy.
- Registrei ausência de rollback testado.
- Criei lista de blockers.
- Criei plano de ação.
- Emitei NO-GO para produção pública.
- Emitei GO CONDICIONAL para laboratório controlado.
- Não antecipei Spring Security ou deploy real.
- Próxima aula: Projeto API OS parte 1 domínio e CRUD.
```

---

## Referência técnica curta

- [Spring Boot — Production-ready Features](https://docs.spring.io/spring-boot/reference/actuator/index.html)
- [Spring Boot — Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Spring Boot — Graceful Shutdown](https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Compose — Healthcheck](https://docs.docker.com/reference/compose-file/services/#healthcheck)
- [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)

Regra final:

```text
prontidão para produção precisa ser avaliada para um ambiente específico e sustentada por evidências vinculadas à release; nesta baseline, o checklist reconhece os avanços de build, testes, containers, health e documentação, mas emite NO-GO para produção pública enquanto autenticação, autorização, TLS, gestão de secrets, restore testado, rollback, operação multi-instância, alertas e capacidade permanecerem ausentes ou sem evidência.
```
