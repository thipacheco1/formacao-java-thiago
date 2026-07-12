# 413 - M15.03 - OWASP Top 10 aplicado

## Apresentação da aula

Na aula 412, você construiu o primeiro threat model da aplicação.

O documento passou a representar:

```text
external entities;

processes;

data stores;

data flows;

trust boundaries;

ameaças;

controles;

prioridades;

mitigações;

backlog.
```

A análise utilizou STRIDE para perguntar:

```text
alguém pode falsificar identidade?

alterar dados?

negar uma ação?

expor informação?

indisponibilizar o serviço?

obter privilégio indevido?
```

Aquela aula respondeu:

```text
quais ameaças surgem
nos componentes,
fluxos e fronteiras
do sistema real?
```

Agora a revisão será comparada ao OWASP Top 10.

OWASP significa:

```text
Open Worldwide Application Security Project.
```

O OWASP Top 10 é um documento de conscientização sobre riscos críticos em aplicações web.

Ele ajuda:

- desenvolvedores;
- QAs;
- arquitetos;
- pessoas de segurança;
- lideranças técnicas;
- organizações.

O Top 10 não é:

- certificação automática;
- scanner;
- pentest;
- checklist completo;
- garantia de segurança;
- substituto de threat modeling;
- substituto do ASVS;
- substituto de requisitos de negócio.

A edição utilizada nesta aula será:

```text
OWASP Top 10:2025.
```

Em julho de 2026, ela é a versão publicada mais recente do projeto principal.

A lista é:

```text
A01:
Broken Access Control.

A02:
Security Misconfiguration.

A03:
Software Supply Chain Failures.

A04:
Cryptographic Failures.

A05:
Injection.

A06:
Insecure Design.

A07:
Authentication Failures.

A08:
Software or Data Integrity Failures.

A09:
Security Logging and Alerting Failures.

A10:
Mishandling of Exceptional Conditions.
```

Essa lista não deve ser substituída pela edição de 2021 por hábito.

A edição 2025 possui mudanças importantes.

Exemplos:

```text
Software Supply Chain Failures
ganhou posição própria e escopo ampliado;

Mishandling of Exceptional Conditions
entrou como nova categoria;

Security Logging
passou a enfatizar Alerting;

SSRF deixou de aparecer
como categoria isolada no Top 10 principal.
```

SSRF continua sendo um risco relevante.

Ele aparece mapeado em categorias e pode surgir no threat model de sistemas que recebem URLs ou fazem requests controladas pelo usuário.

A API atual ainda não possui esse fluxo.

O laboratório criará:

```text
docs/security/M15_OWASP_TOP_10_REVIEW.md
```

O documento mapeará cada categoria para:

- ativos;
- ameaças;
- evidências;
- controles presentes;
- gaps;
- prioridade;
- ações;
- critérios de aceite.

A análise continuará usando o projeto real.

Ela não produzirá frases genéricas como:

```text
precisa evitar injection.
```

Ela responderá:

```text
onde uma injection poderia ocorrer?

quais intérpretes recebem entrada?

quais APIs seguras já são usadas?

quais testes comprovam?

qual risco residual permanece?
```

O resultado esperado será uma matriz de cobertura.

A aplicação atual terá categorias:

```text
CRITICA;

ALTA;

MEDIA;

BAIXA;

NAO_AVALIADA.
```

A classificação não representa a posição oficial da categoria.

Ela representa:

```text
a prioridade daquela categoria
neste projeto e ambiente.
```

Exemplo:

```text
A01 ocupa a primeira posição oficial
e também é CRITICA no projeto,
pois não existe autorização.
```

Outra categoria pode ser crítica em outro sistema e menor aqui.

A aplicação não possui:

- parser XML;
- execução de comandos;
- URL externa controlada pelo usuário;
- mecanismo de login;
- atualização automática de software.

Isso altera o cenário.

Porém, ausência de uma feature não autoriza marcar a categoria inteira como irrelevante.

A03, por exemplo, também cobre:

- Maven;
- plugins;
- Docker images;
- registries;
- IDE;
- pipeline;
- transitive dependencies;
- processo de atualização.

A prática não instalará Spring Security.

Também não executará pentest.

Não serão aprofundados:

- CORS;
- CSRF;
- security headers;
- password hashing;
- authentication architecture.

Esses assuntos possuem aulas próprias.

A próxima aula será:

```text
414 - M15.04 - CORS profundo
```

---

## Onde estamos na formação

A sequência atual é:

```text
411:
Fundamentos seguranca web.

412:
Threat modeling inicial.

413:
OWASP Top 10 aplicado.

414:
CORS profundo.

415:
CSRF quando importa em APIs.

416:
Security headers.
```

A aula 412 respondeu:

```text
quais ameaças específicas
existem nos fluxos do projeto?
```

A aula 413 responderá:

```text
como as dez categorias
do OWASP Top 10:2025
aparecem na aplicação
e quais ações precisam
entrar no backlog?
```

Nesta aula:

```text
OWASP Top 10:2025:
sim.

mapeamento para threat model:
sim.

evidências:
sim.

controles atuais:
sim.

gaps:
sim.

backlog:
sim.

scan automatizado:
não.

pentest:
não.

CORS profundo:
não.

CSRF profundo:
não.

Spring Security:
não.
```

A regra central será:

```text
o Top 10 orienta cobertura;

o threat model
mantém o contexto;

nenhum dos dois
substitui evidência prática.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_OWASP_TOP_10_REVIEW.md
```

Estrutura:

```text
# Revisao OWASP Top 10 2025

## Identificacao
## Objetivo
## Versao avaliada
## Escopo
## Metodo
## Resumo executivo
## Matriz de cobertura
## A01 Broken Access Control
## A02 Security Misconfiguration
## A03 Software Supply Chain Failures
## A04 Cryptographic Failures
## A05 Injection
## A06 Insecure Design
## A07 Authentication Failures
## A08 Software or Data Integrity Failures
## A09 Security Logging and Alerting Failures
## A10 Mishandling of Exceptional Conditions
## Backlog consolidado
## Decisao
## Gatilhos de revisao
```

Você irá:

1. registrar a versão oficial;
2. diferenciar Top 10 e threat model;
3. criar critérios de avaliação;
4. revisar controle de acesso;
5. revisar configuração;
6. revisar supply chain;
7. revisar criptografia;
8. revisar injection;
9. revisar design;
10. revisar autenticação;
11. revisar integridade;
12. revisar logging e alerting;
13. revisar exceptional conditions;
14. ligar categorias às ameaças;
15. criar evidências;
16. consolidar backlog;
17. preservar decisão de ambiente;
18. commitar.

---

## Conceito essencial

### Top 10 é conscientização

O OWASP Top 10 reúne categorias amplas.

Uma categoria pode conter muitos CWEs e cenários.

Por isso:

```text
marcar A05 como revisado
não significa provar
que toda injection foi eliminada.
```

A análise precisa continuar:

- específica;
- testável;
- revisável;
- ligada à arquitetura.

---

### Top 10 e STRIDE são diferentes

STRIDE começa por:

```text
fluxos,
componentes
e trust boundaries.
```

OWASP Top 10 começa por:

```text
categorias recorrentes
de risco em aplicações web.
```

Eles se complementam.

Exemplo:

```text
THR-001:
leitura de OS de outro cliente.

STRIDE:
Information Disclosure
e Elevation of Privilege.

OWASP:
A01 Broken Access Control.
```

O cenário continua sendo THR-001.

A01 fornece uma classificação adicional.

---

### Categoria não é vulnerabilidade confirmada

A01 é uma categoria.

O achado confirmado é:

```text
GET de OS não verifica ownership.
```

A evidência pode ser:

```text
request com outro X-Client-Id
retorna 200.
```

Evite relatórios que tratam nomes de categoria como achados.

---

### A01 — Broken Access Control

Access control impede que usuários ajam fora de suas permissões.

Falhas incluem:

- endpoint acessível sem controle;
- acesso a registro de outra pessoa;
- alteração de URL ou ID;
- operação administrativa por usuário comum;
- autorização somente no frontend;
- CORS permissivo;
- bypass de regra;
- ausência de deny by default.

Na API atual:

```text
não existe autenticação;

não existe autorização;

não existe ownership;

qualquer cliente alcança
POST, GET, PUT, PATCH e DELETE.
```

ETag não corrige isso.

UUID não corrige isso.

Rate limiting não corrige isso.

Classificação do projeto:

```text
CRITICA.
```

Ameaças relacionadas:

```text
THR-001;

THR-003;

THR-009.
```

Mitigações futuras:

- autenticação;
- autorização por rota;
- autorização por recurso;
- deny by default;
- testes positivos e negativos;
- auditoria;
- tratamento de falhas.

---

### A02 — Security Misconfiguration

Configuração insegura pode ocorrer em:

- aplicação;
- framework;
- container;
- banco;
- Redis;
- server;
- cloud;
- proxy;
- build;
- profiles.

Exemplos:

- porta desnecessária;
- debug ativo;
- stack trace público;
- senha default;
- Actuator exposto;
- profile de laboratório ativo;
- CORS permissivo;
- header ausente;
- diretório público;
- privilégio excessivo.

Controles presentes:

```text
management no loopback;

PostgreSQL sem porta publicada;

Redis sem porta publicada;

usuário não root;

Actuator com allowlist;

Problem Details sem stack trace;

env local ignorado;

profiles de laboratório separados.
```

Gaps:

- HTTP local;
- sem security headers completos;
- sem hardening automatizado;
- sem secret manager;
- sem scan de configuração;
- sem baseline de produção.

Classificação:

```text
ALTA.
```

---

### A03 — Software Supply Chain Failures

Supply chain inclui todo o caminho usado para criar, distribuir e atualizar software.

No projeto:

- JDK;
- Maven Wrapper;
- plugins Maven;
- dependencies diretas;
- dependencies transitivas;
- imagens Docker;
- PostgreSQL image;
- Redis image;
- IDE;
- plugins da IDE;
- Git;
- repositório;
- registry;
- pipeline futuro.

Controles presentes:

```text
pom.xml versionado;

Maven Wrapper versionado;

Spring Boot BOM;

Dockerfile versionado;

tags de imagens explícitas;

commits;

quality gate.
```

Gaps:

- sem SBOM;
- sem SCA automatizado;
- sem CVE gate;
- sem assinatura de artefato;
- sem provenance;
- sem digest fixo de imagem;
- sem registry controlado;
- sem pipeline protegido;
- sem política de atualização.

Classificação:

```text
ALTA.
```

Não instale uma versão aleatória de dependency apenas porque é a mais nova.

Atualização precisa considerar:

- vulnerabilidade;
- compatibilidade;
- suporte;
- testes;
- rollout;
- rollback.

---

### A04 — Cryptographic Failures

Essa categoria cobre:

- ausência de criptografia;
- algoritmo fraco;
- chave exposta;
- key management inadequado;
- random insuficiente;
- certificado não validado;
- dado sensível sem proteção;
- senha armazenada incorretamente.

Estado atual:

```text
HTTP no laboratório;

sem dados reais permitidos;

sem usuários e senhas de aplicação;

credentials locais por env file;

UUID usado como identificador,
não como segredo;

sem encryption at rest comprovada.
```

Risco principal:

```text
exposição futura
de dados confidenciais
sem TLS e sem gestão adequada
de chaves e secrets.
```

Classificação para produção pública:

```text
CRITICA.
```

Classificação para laboratório restrito:

```text
MEDIA,
sob premissas.
```

A decisão do documento deve registrar o ambiente.

Não implemente criptografia própria.

Use algoritmos e bibliotecas estabelecidas.

Password hashing será estudado em aulas posteriores.

---

### A05 — Injection

Injection ocorre quando dados não confiáveis alteram comandos enviados a um intérprete.

Intérpretes relevantes:

- banco;
- shell;
- template;
- expression language;
- LDAP;
- browser;
- logs;
- XML;
- query language.

Controles presentes no projeto:

```text
JPA;

Criteria API;

Specifications;

queries parametrizadas;

sort allowlist;

validation;

escape de LIKE;

sem concatenação de SQL;

sem Runtime.exec;

sem ProcessBuilder;

sem template server-side.
```

Riscos residuais:

- log injection;
- futura native query;
- header malformado;
- filename;
- nova integração;
- dynamic query criada no futuro.

Classificação atual:

```text
MEDIA.
```

A ausência de SQL concatenado reduz risco.

Ela não permite declarar:

```text
injection impossível.
```

Cada nova entrada e intérprete precisa de revisão.

---

### A06 — Insecure Design

Insecure Design significa controle ausente ou ineficaz no desenho.

Não é o mesmo que bug de implementação.

Exemplos do projeto:

```text
se o domínio não tivesse
transições de status,
uma implementação perfeita
do CRUD ainda permitiria
fluxos inválidos.
```

Controles de design já criados:

- threat modeling;
- state machine da OS;
- ETag e If-Match;
- paginação limitada;
- upload limitado;
- management separado;
- documentação de produção;
- backlog de segurança.

Gaps de design:

- sem identidade;
- sem modelo de autorização;
- sem tenant/ownership;
- sem política de auditoria;
- sem estratégia multi-instância;
- sem recovery de segurança;
- sem requisitos de privacidade;
- sem critérios de abuso completos.

Classificação:

```text
CRITICA.
```

O threat modeling da aula 412 é um controle preventivo contra Insecure Design.

---

### A07 — Authentication Failures

Authentication Failures inclui:

- autenticação ausente ou incorreta;
- password fraca;
- credential stuffing;
- brute force;
- recovery inseguro;
- session fixation;
- token não invalidado;
- credencial default;
- audience ou scope incorreto;
- MFA ausente quando necessário.

Na aplicação atual:

```text
não existe mecanismo de autenticação.
```

Isso não será classificado como:

```text
NAO SE APLICA.
```

Para endpoint que deveria ser protegido, ausência de autenticação é um gap crítico.

Classificação:

```text
CRITICA.
```

O módulo tratará:

- arquitetura do Spring Security;
- usuário em memória;
- banco;
- sessão;
- JWT;
- OAuth2;
- OIDC.

A solução não será definida inteira nesta aula.

---

### A08 — Software or Data Integrity Failures

Essa categoria trata de confiar em software ou dados sem verificar integridade.

Exemplos:

- artifact não assinado;
- update não verificado;
- pipeline comprometido;
- deserialização insegura;
- dado crítico alterável;
- plugin não confiável;
- cache tratado como fonte.

Controles atuais:

```text
Git;

reviews futuras;

Maven repositories padrão;

migrations versionadas;

checksums do Flyway;

@Version;

ETag;

PostgreSQL como fonte da verdade;

DTOs explícitos;

enums e allowlists.
```

Gaps:

- sem assinatura de imagem;
- sem artifact signing;
- sem provenance;
- sem branch protection comprovada;
- sem validação de integridade de backup;
- sem pipeline real;
- sem scanner de deserialização;
- sem verificação de pacote no deploy.

Classificação:

```text
ALTA.
```

A03 observa a cadeia ampla.

A08 observa a confiança e integridade dos artefatos e dados utilizados.

As categorias se relacionam, mas não são iguais.

---

### A09 — Security Logging and Alerting Failures

Logs sem alerta não garantem resposta.

Controles atuais:

- correlation ID;
- logs de requests e operações;
- erros controlados;
- Actuator;
- metrics;
- health;
- logs Docker;
- revisão para não registrar secrets.

Gaps:

- sem identidade autenticada;
- sem auditoria de usuário;
- sem centralização;
- sem retenção definida;
- sem proteção de integridade;
- sem dashboard;
- sem alertas;
- sem on-call;
- sem playbook;
- sem detecção de abuso.

Classificação:

```text
ALTA.
```

Um acesso não autorizado pode ocorrer e permanecer invisível.

A aula futura de auditoria trabalhará o registro de ações sensíveis.

---

### A10 — Mishandling of Exceptional Conditions

A10 é nova no Top 10:2025.

Ela trata situações anormais mal prevenidas, detectadas ou respondidas.

Exemplos:

- exception não tratada;
- `NullPointerException`;
- parameter ausente;
- race condition;
- estado parcial;
- transaction sem rollback;
- falha aberta;
- resposta imprevisível;
- erro que vaza detalhe;
- dependência indisponível;
- retry incorreto.

Controles atuais:

```text
Bean Validation;

validators de aplicação;

Problem Details;

GlobalExceptionHandler;

transações;

rollback;

optimistic locking;

timeouts;

503 controlado;

429 controlado;

readiness;

liveness;

health;

logs.
```

Gaps:

- sem alertas de repetição;
- sem fail-closed de autorização, pois ainda não existe autorização;
- sem estratégia geral de retry;
- sem teste de falha de todas as dependências;
- sem circuit breaker;
- sem resposta operacional externa;
- sem catálogo completo de exceptional conditions.

Classificação:

```text
ALTA.
```

Não use:

```java
catch (Exception exception) {
}
```

Uma exception engolida remove:

- diagnóstico;
- rollback consciente;
- alerta;
- resposta correta.

---

### Cobertura não é aprovação

Uma categoria pode possuir vários controles e ainda manter risco alto.

Exemplo:

```text
A10 possui Problem Details,
transações e health;

mesmo assim,
não há alertas
nem autorização fail-closed.
```

A matriz deve registrar:

```text
controle;

gap;

risco residual.
```

---

## Mão na massa guiada

### 1. Criar o documento

Arquivo:

```text
docs/security/M15_OWASP_TOP_10_REVIEW.md
```

Cabeçalho:

```markdown
# Revisao OWASP Top 10 2025

## Identificacao

- Aplicacao: formacao-java-backend-api
- Versao OWASP: 2025
- Ambiente: laboratorio local controlado
- Commit: `<preencher>`
- Data: `<preencher>`
- Status: REVISAO INICIAL
```

Obtenha o commit:

```powershell
git rev-parse HEAD
```

---

### 2. Registrar a lista oficial

Inclua as dez categorias de 2025.

Não use os nomes da edição 2021 como se fossem atuais.

Registre a fonte oficial na referência.

---

### 3. Definir o método

Para cada categoria, responda:

```text
como se aplica?

qual ameaça relacionada?

qual evidência existe?

qual controle está presente?

qual gap permanece?

qual prioridade no projeto?

qual ação é necessária?
```

Status de cobertura:

```text
CONTROLADO;

PARCIAL;

AUSENTE;

NAO_AVALIADO.
```

Prioridade:

```text
CRITICA;

ALTA;

MEDIA;

BAIXA.
```

---

### 4. Criar a matriz inicial

```markdown
| Categoria | Cobertura | Prioridade | Ameacas |
|---|---|---|---|
| A01 Broken Access Control | AUSENTE | CRITICA | THR-001, THR-003 |
| A02 Security Misconfiguration | PARCIAL | ALTA | THR-005, THR-009 |
| A03 Software Supply Chain Failures | PARCIAL | ALTA | THR-008 |
| A04 Cryptographic Failures | PARCIAL | CRITICA | THR-005, THR-008 |
| A05 Injection | PARCIAL | MEDIA | nova revisao |
| A06 Insecure Design | PARCIAL | CRITICA | threat model |
| A07 Authentication Failures | AUSENTE | CRITICA | THR-001, THR-002 |
| A08 Software or Data Integrity Failures | PARCIAL | ALTA | supply chain e dados |
| A09 Logging and Alerting Failures | PARCIAL | ALTA | THR-004 |
| A10 Exceptional Conditions | PARCIAL | ALTA | falhas e disponibilidade |
```

A matriz precisa ser justificada nas seções.

---

### 5. Coletar evidência de A01

Suba a stack:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Use uma OS criada na baseline.

Execute GET com outro `X-Client-Id`.

Registre:

```text
status 200;

sem credential;

sem ownership check.
```

Não anexe dados reais.

---

### 6. Revisar métodos protegíveis

Liste:

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "@PostMapping|@PutMapping|@PatchMapping|@DeleteMapping"
```

Pergunte para cada endpoint:

- precisa autenticação?
- quem pode executar?
- existe owner?
- existe role?
- default deveria negar?

Registre backlog.

---

### 7. Coletar evidência de A02

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

Confirme:

- API publicada;
- management loopback;
- banco interno;
- Redis interno.

Revise:

```text
application*.yaml;

profiles;

Actuator;

Dockerfile;

compose.yaml;

error handler.
```

Registre controles e gaps.

---

### 8. Revisar profiles perigosos

Procure:

```powershell
Select-String `
  -Path "src/main/resources/application*.yaml" `
  -Pattern `
    "availability-lab|mail-lab|show-details|include-message"
```

Confirme que labs não estão ativos por default.

Não altere configuração sem evidência.

---

### 9. Coletar evidência de A03

Execute:

```powershell
.\mvnw.cmd dependency:tree
```

Registre:

- dependencies diretas;
- transitive dependencies;
- BOM;
- plugins relevantes.

Liste imagens:

```powershell
docker image inspect `
  "postgres:17.6-alpine" `
  "redis:8-alpine" `
  --format `
  "{{.RepoTags}} {{.Id}}"
```

Gaps:

```text
sem SBOM;

sem scan automático;

sem assinatura.
```

---

### 10. Procurar dependências não usadas

Revise `pom.xml`.

Pergunte:

- cada dependency é necessária?
- escopo está correto?
- test dependency ficou em runtime?
- versão está gerenciada?
- repository externo foi adicionado?
- plugin vem de fonte confiável?

Não remova dependency sem executar o gate.

---

### 11. Coletar evidência de A04

Registre o protocolo:

```text
http://localhost:8081.
```

Procure secrets:

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

Confirme:

- nenhum valor real;
- env local ignorado;
- sem TLS;
- sem secret manager;
- sem senha de usuário de aplicação.

Classifique por ambiente.

---

### 12. Coletar evidência de A05

Procure construções perigosas:

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "createNativeQuery|createQuery|Runtime\.getRuntime|ProcessBuilder|Statement|prepareStatement"
```

Revise resultados.

Procure concatenação em query annotations:

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern "@Query"
```

Confirme:

- JPA;
- Criteria;
- parameters;
- sort allowlist;
- LIKE escapado.

---

### 13. Testar LIKE literal

Busque cliente contendo:

```text
100%.
```

Confirme que `%` não vira wildcard.

Esse teste é uma evidência de tratamento contextual.

Não conclua que ele cobre todas as injections.

---

### 14. Coletar evidência de A06

Abra:

```text
M15_THREAT_MODEL.md;

ServiceOrder.java;

ServiceOrderCommandValidator.java;

ServiceOrderPageRequestFactory.java;

PRODUCTION_READINESS_CHECKLIST.md.
```

Registre controles de design:

- transições;
- limites;
- preconditions;
- threat model;
- default restrito operacional.

Registre o principal gap:

```text
modelo de acesso ausente.
```

---

### 15. Coletar evidência de A07

Execute um endpoint sem credential.

Resultado atual:

```text
200 ou 201.
```

Registre:

```text
autenticação:
AUSENTE.
```

Não confunda com erro de senha.

A aplicação ainda não possui fluxo de login.

---

### 16. Coletar evidência de A08

Verifique migrations:

```powershell
Get-ChildItem `
  "src/main/resources/db/migration" |
  Sort-Object Name
```

Confirme checksums do Flyway ao iniciar.

Revise:

- Git;
- Maven Wrapper;
- image IDs;
- @Version;
- ETag;
- DTOs;
- allowlists.

Registre falta de:

- assinatura;
- provenance;
- artifact promotion.

---

### 17. Coletar evidência de A09

Envie:

```http
X-Correlation-Id: owasp-a09-413
```

Procure:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String "owasp-a09-413"
```

Depois responda:

- quem executou?
- houve alerta?
- log está centralizado?
- retenção está definida?
- log é tamper-evident?

A resposta atual será parcial.

---

### 18. Coletar evidência de A10

Teste JSON inválido:

```powershell
Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -ContentType "application/json" `
  -Body '{"customerName":' `
  -SkipHttpErrorCheck
```

Teste If-Match ausente.

Teste ID inexistente.

Confirme:

- status controlado;
- Problem Details;
- correlation ID;
- sem stack trace.

---

### 19. Testar dependência indisponível

No laboratório:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  stop postgres
```

Consulte readiness.

Observe logs e resposta.

Depois:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  start postgres
```

Aguarde health.

Não deixe a stack quebrada.

Registre o comportamento, não apenas o resultado esperado.

---

### 20. Criar uma seção por categoria

Modelo:

```markdown
## A01:2025 - Broken Access Control

### Aplicacao no projeto
### Ameacas relacionadas
### Evidencias
### Controles presentes
### Gaps
### Prioridade
### Backlog
### Criterios de aceite
```

Repita para A01 a A10.

Evite textos copiados integralmente da fonte.

Explique com palavras próprias.

---

### 21. Criar backlog consolidado

Exemplo:

```markdown
| ID | Categoria | Acao | Prioridade | Criterio |
|---|---|---|---|---|
| OWASP-BL-001 | A01/A07 | Implementar autenticacao | CRITICA | anonimo recebe 401 |
| OWASP-BL-002 | A01 | Autorizar por ownership | CRITICA | cliente nao acessa OS alheia |
| OWASP-BL-003 | A02 | Criar hardening baseline | ALTA | config validada por ambiente |
| OWASP-BL-004 | A03 | Gerar SBOM | ALTA | SBOM versionada por release |
| OWASP-BL-005 | A04 | Exigir TLS | CRITICA | endpoint somente HTTPS |
| OWASP-BL-006 | A09 | Centralizar e alertar | ALTA | falha de acesso gera alerta |
```

Não duplique ações idênticas do threat model.

Referencie IDs existentes quando possível.

---

### 22. Registrar critérios transversais

Critérios para futura aprovação:

```text
requests anônimas bloqueadas;

ownership testado;

TLS comprovado;

security configuration repetível;

dependencies inventariadas;

build verificável;

logs de segurança;

alertas;

exception handling fail-safe;

testes negativos.
```

---

### 23. Atualizar o threat model

Adicione aos registros de ameaça:

```text
OWASP category.
```

Exemplo:

```text
THR-001:
A01 e A07.
```

Não reescreva o threat model inteiro.

Somente conecte os artefatos.

---

### 24. Registrar a decisão

```markdown
## Decisao

A revisao confirma controles relevantes de validation, concorrencia,
persistencia, erro, observabilidade e containerizacao. Entretanto,
A01 e A07 permanecem sem controles essenciais, e A04 depende de
premissas locais.

A aplicacao continua nao aprovada para exposicao publica.
```

---

### 25. Encerrar a stack

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Preserve volumes.

---

## Entendendo o que foi feito

### O Top 10 foi atualizado para 2025

A revisão não reutilizou uma lista antiga.

### As categorias foram ligadas ao projeto

Cada item recebeu evidência e contexto.

### Threat model e Top 10 ficaram conectados

As ameaças continuam específicas.

### Controles existentes foram reconhecidos

O projeto não foi tratado como totalmente inseguro.

### Gaps críticos ficaram visíveis

A01 e A07 impedem exposição pública.

### Supply chain entrou no escopo

Dependencies, imagens e build também são segurança.

### Exceptional conditions ganharam revisão própria

Erros, rollback e falhas de dependência foram avaliados.

---

## Erros comuns importantes

### Usar a edição errada

A versão atual desta aula é 2025.

### Tratar Top 10 como certificação

Cobertura não é garantia.

### Copiar descrições sem evidência

O relatório precisa representar o projeto.

### Marcar categoria como resolvida por uma annotation

Categorias são amplas.

### Confundir A03 e A08

Supply chain e integridade se relacionam, mas possuem focos diferentes.

### Declarar injection eliminada pelo JPA

Dynamic query e outros intérpretes ainda exigem análise.

### Marcar A07 como não aplicável

A ausência de autenticação é um gap quando endpoints precisam proteção.

### Tratar logs como alertas

Log não lido não provoca resposta.

### Ignorar A10

Exceptional conditions podem causar falha aberta e estado inconsistente.

### Implementar todos os controles fora da sequência

O backlog preserva profundidade e continuidade.

---

## Comandos úteis

### Identificar versão

```powershell
git rev-parse HEAD
git status --short
```

### Dependency tree

```powershell
.\mvnw.cmd dependency:tree
```

### Procurar APIs perigosas

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "createNativeQuery|Runtime\.getRuntime|ProcessBuilder|Statement"
```

### Procurar secrets

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

### Ver portas

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

### Logs por correlation ID

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String "owasp-a09-413"
```

---

## Exercício guiado

### Parte 1 — Versão

Registre a lista OWASP Top 10:2025.

### Parte 2 — Matriz

Classifique cobertura e prioridade.

### Parte 3 — A01 a A04

Colete evidências de acesso, configuração, supply chain e transporte.

### Parte 4 — A05

Revise intérpretes, parâmetros e APIs.

### Parte 5 — A06 e A07

Revise design e ausência de autenticação.

### Parte 6 — A08

Revise integridade de código, build e dados.

### Parte 7 — A09

Revise logs, auditoria e alertas.

### Parte 8 — A10

Teste conditions anormais e dependências.

### Parte 9 — Backlog

Consolide ações e critérios.

### Parte 10 — Decisão

Mantenha produção não aprovada.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 412 foi preservada;
- OWASP foi identificado corretamente;
- Top 10 foi tratado como awareness;
- Top 10 não foi tratado como certificação;
- versão 2025 foi utilizada;
- lista das dez categorias foi registrada;
- lista 2021 não foi usada como atual;
- mudanças de 2025 foram reconhecidas;
- Top 10 foi diferenciado de STRIDE;
- categoria foi diferenciada de achado;
- documento de revisão foi criado;
- commit foi registrado;
- ambiente foi registrado;
- método de revisão foi criado;
- cobertura foi definida;
- prioridade foi definida;
- matriz inicial foi criada;
- A01 foi explicada;
- ausência de autorização foi evidenciada;
- ownership ausente foi registrado;
- UUID não foi chamado de autorização;
- ETag não foi chamado de autorização;
- A01 foi classificada como crítica;
- A02 foi explicada;
- management loopback foi evidenciado;
- portas internas foram evidenciadas;
- usuário não root foi evidenciado;
- profiles foram revisados;
- stack trace público foi rejeitado;
- gaps de hardening foram registrados;
- A03 foi explicada;
- dependency tree foi coletada;
- dependencies transitivas foram consideradas;
- imagens Docker foram consideradas;
- Maven Wrapper foi considerado;
- ausência de SBOM foi registrada;
- ausência de SCA foi registrada;
- assinatura de artifact ausente foi registrada;
- A04 foi explicada;
- HTTP local foi registrado;
- dados reais foram proibidos;
- secrets foram procurados;
- ausência de secret manager foi registrada;
- criptografia própria não foi criada;
- A05 foi explicada;
- SQL concatenado foi procurado;
- APIs de comando foram procuradas;
- JPA parametrizado foi reconhecido;
- Criteria API foi reconhecida;
- sort allowlist foi reconhecida;
- LIKE escapado foi reconhecido;
- injection não foi declarada impossível;
- A06 foi explicada;
- threat model foi reconhecido como controle de design;
- state machine foi reconhecida;
- ausência de modelo de acesso foi registrada;
- A07 foi explicada;
- autenticação ausente foi comprovada;
- A07 não foi marcada como não aplicável;
- A08 foi explicada;
- Git e Flyway foram revisados;
- @Version e ETag foram reconhecidos;
- assinatura e provenance ausentes foram registrados;
- A09 foi explicada;
- correlation ID foi evidenciado;
- identidade de usuário ausente foi registrada;
- centralização ausente foi registrada;
- alertas ausentes foram registrados;
- playbook ausente foi registrado;
- A10 foi explicada;
- categoria nova de 2025 foi reconhecida;
- JSON inválido foi testado;
- If-Match ausente foi testado;
- not found foi testado;
- Problem Details foi evidenciado;
- dependency failure foi testada;
- PostgreSQL foi reiniciado;
- stack foi restaurada;
- fail-open foi discutido;
- uma seção foi criada para cada categoria;
- cada seção possui aplicação;
- cada seção possui evidência;
- cada seção possui controle;
- cada seção possui gap;
- cada seção possui prioridade;
- backlog consolidado foi criado;
- ações duplicadas foram evitadas;
- critérios transversais foram criados;
- threat model foi conectado às categorias;
- decisão de produção foi preservada;
- CORS não foi aprofundado;
- CSRF não foi aprofundado;
- security headers não foram implementados;
- Spring Security não foi implementado;
- pentest não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 414 está correta.

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
git commit -m "docs(m15): aplicar OWASP Top 10 ao projeto"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- tokens;
- env files;
- dados pessoais;
- logs completos;
- scan reports não revisados;
- arquivos temporários;
- detalhes corporativos;
- dependências alteradas sem teste.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o threat model foi comparado ao OWASP Top 10:2025.

A revisão passou por:

```text
controle de acesso;

configuração;

supply chain;

criptografia;

injection;

design;

autenticação;

integridade;

logging e alerting;

exceptional conditions.
```

A análise reconheceu controles atuais:

- validation;
- Problem Details;
- state machine;
- ETag;
- Flyway;
- JPA;
- allowlists;
- correlation ID;
- Actuator;
- usuário não root;
- rede interna.

Também preservou gaps críticos:

- autenticação;
- autorização;
- ownership;
- TLS;
- secret manager;
- SBOM;
- alertas;
- auditoria;
- hardening;
- fail-closed de segurança.

A decisão central foi:

```text
OWASP Top 10
não é uma lista para marcar;

é uma lente de conscientização
que precisa ser aplicada
com contexto,
evidência,
ameaça
e ação rastreável.
```

A aplicação continua:

```text
aceita com restrições
no laboratório local;

não aprovada
para exposição pública.
```

A próxima aula será:

```text
414 - M15.04 - CORS profundo
```

Nela, você estudará:

- same-origin policy;
- origin;
- preflight;
- simple request;
- credentials;
- allowlist;
- `Access-Control-Allow-Origin`;
- `Vary: Origin`;
- cache de preflight;
- CORS no Spring;
- testes;
- erros de configuração.

CSRF permanecerá para a aula 415.

Security headers permanecerão para a aula 416.

---

# Material complementar

## Checkpoint final

- [ ] Usei o OWASP Top 10:2025.
- [ ] Mapeei as dez categorias ao projeto.
- [ ] Coletei evidências reais.
- [ ] Consolidei backlog e critérios.
- [ ] Mantive a decisão de ambiente.

---

## Troubleshooting adicional

### Encontrei material com lista diferente

Confirme a edição.

A lista 2021 possui categorias diferentes da edição 2025.

### Dependency tree é muito grande

Registre os grupos principais e mantenha o output fora do Git.

O objetivo é entender transitivas.

### O scan de secrets encontra exemplos

Diferencie:

- nome de variável;
- placeholder;
- valor real.

Nunca versionar valor real.

### O teste de PostgreSQL indisponível derruba a API

Observe readiness, logs e recovery.

Não provoque esse cenário em ambiente compartilhado.

### Não consigo mapear uma categoria

Registre `NAO_AVALIADA` e crie ação.

Não invente cobertura.

### A mesma ameaça aparece em categorias diferentes

Isso é possível.

Mantenha um único cenário e múltiplos mapeamentos.

### A matriz ficou toda crítica

Reavalie prioridade no contexto.

Não reduza A01 e A07 apenas para equilibrar a tabela.

---

## Perguntas de revisão

1. O que é OWASP?
2. Qual edição foi usada?
3. Top 10 é certificação?
4. Ele substitui threat modeling?
5. Qual é A01?
6. Qual é A02?
7. Qual é A03?
8. Qual é A04?
9. Qual é A05?
10. Qual é A06?
11. Qual é A07?
12. Qual é A08?
13. Qual é A09?
14. Qual é A10?
15. UUID implementa autorização?
16. JPA elimina toda injection?
17. Log é igual a alerta?
18. Qual categoria nova merece atenção a exceptions?
19. A produção pública está aprovada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Open Worldwide Application Security Project.
2. 2025.
3. Não.
4. Não.
5. Broken Access Control.
6. Security Misconfiguration.
7. Software Supply Chain Failures.
8. Cryptographic Failures.
9. Injection.
10. Insecure Design.
11. Authentication Failures.
12. Software or Data Integrity Failures.
13. Security Logging and Alerting Failures.
14. Mishandling of Exceptional Conditions.
15. Não.
16. Não.
17. Não.
18. A10.
19. Não.
20. CORS profundo.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 413 - M15.03 - OWASP Top 10 aplicado

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Usei a edição OWASP Top 10:2025.
- Diferenciei Top 10 de certificação e pentest.
- Diferenciei Top 10 de threat modeling.
- Registrei as dez categorias atuais.
- Reconheci as mudanças em relação à edição 2021.
- Criei `docs/security/M15_OWASP_TOP_10_REVIEW.md`.
- Criei uma matriz de cobertura e prioridade.
- Apliquei A01 Broken Access Control.
- Comprovei ausência de autorização e ownership.
- Apliquei A02 Security Misconfiguration.
- Revisei ports, profiles, Actuator, errors e containers.
- Apliquei A03 Software Supply Chain Failures.
- Revisei Maven, dependencies, imagens e build.
- Registrei ausência de SBOM, SCA e assinatura.
- Apliquei A04 Cryptographic Failures.
- Registrei HTTP local e ausência de secret manager.
- Apliquei A05 Injection.
- Revisei JPA, Criteria, allowlists, LIKE e APIs perigosas.
- Não declarei injection impossível.
- Apliquei A06 Insecure Design.
- Reconheci threat modeling e state machine como controles.
- Registrei ausência de modelo de acesso.
- Apliquei A07 Authentication Failures.
- Confirmei que autenticação está ausente.
- Apliquei A08 Software or Data Integrity Failures.
- Revisei Git, Flyway, @Version, ETag e artefatos.
- Apliquei A09 Security Logging and Alerting Failures.
- Revisei correlation ID, auditoria, centralização e alertas.
- Apliquei A10 Mishandling of Exceptional Conditions.
- Testei JSON inválido, preconditions, not found e dependência indisponível.
- Consolidei backlog com critérios de aceite.
- Conectei ameaças às categorias OWASP.
- Mantive produção pública não aprovada.
- Não antecipei CORS, CSRF, headers ou Spring Security.
- Próxima aula: CORS profundo.
```

---

## Referência técnica curta

- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
- [A01:2025 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)
- [A02:2025 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/)
- [A03:2025 Software Supply Chain Failures](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/)
- [A04:2025 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)
- [A05:2025 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)
- [A06:2025 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/)
- [A07:2025 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)
- [A08:2025 Software or Data Integrity Failures](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/)
- [A09:2025 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/)
- [A10:2025 Mishandling of Exceptional Conditions](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/)

Regra final:

```text
a aplicação do OWASP Top 10 precisa usar a edição atual, diferenciar categorias de achados e conectar cada risco a ameaças, evidências, controles e backlog; nesta baseline, A01 e A07 permanecem sem controles essenciais, supply chain, criptografia, logging e exceptional conditions possuem gaps relevantes, enquanto validation, JPA, Flyway, ETag, Actuator e containers reduzem riscos específicos sem tornar a aplicação pronta para exposição pública.
```
