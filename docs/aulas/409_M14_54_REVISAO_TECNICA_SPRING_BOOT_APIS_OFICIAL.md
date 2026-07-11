# 409 - M14.54 - Revisao tecnica Spring Boot APIs

## Apresentação da aula

Na aula 408, você concluiu o projeto guiado da API de Ordem de Serviço.

A feature passou a possuir:

```text
domínio;

migration;

entity;

repository;

application service;

CRUD;

validações;

transições;

ETag;

If-Match;

optimistic locking;

filtros;

Specifications;

índices;

testes;

OpenAPI;

collection;

documentação.
```

Aquela aula respondeu:

```text
como consolidar uma feature
com testes em camadas,
contrato verificável
e documentação reproduzível?
```

Agora o M14 se aproxima do encerramento.

Antes do fechamento formal, é necessário revisar tecnicamente o conjunto construído desde o início do módulo.

Durante o M14, a aplicação evoluiu por muitas etapas:

- projeto Spring Boot;
- injeção de dependências;
- configuração;
- REST;
- validation;
- tratamento de erros;
- JPA;
- PostgreSQL;
- Flyway;
- paginação;
- OpenAPI;
- versionamento;
- profiles;
- logs;
- filters;
- interceptors;
- eventos;
- async;
- cache;
- rate limiting;
- upload e download;
- scheduler;
- e-mail;
- testes;
- Actuator;
- readiness;
- liveness;
- Docker;
- Compose;
- collection;
- documentação;
- produção;
- projeto API OS.

Quando uma formação cresce, existe um risco:

```text
aprender cada assunto isoladamente
e perder a visão do sistema completo.
```

A revisão técnica desta aula terá o objetivo oposto.

Você irá observar a aplicação como um sistema integrado.

A pergunta central será:

```text
as decisões tomadas ao longo do módulo
formam uma arquitetura coerente,
testável, operável
e compreensível?
```

Esta não será uma aula de memorização.

Você não receberá apenas uma lista de conceitos.

A revisão será executada sobre o projeto real.

O laboratório criará:

```text
docs/api/M14_TECHNICAL_REVIEW.md
```

O documento registrará:

- componente;
- responsabilidade;
- evidência;
- risco;
- decisão;
- ação.

A revisão utilizará cinco fontes principais:

```text
código;

configuração;

testes;

execução;

documentação.
```

Um item não será considerado correto apenas porque existe uma classe com nome adequado.

Exemplo:

```text
há um HealthIndicator?
```

não é a pergunta correta.

A pergunta correta é:

```text
os endpoints de health,
readiness e liveness
possuem semântica correta,
estão protegidos
e são utilizados de forma coerente?
```

Outro exemplo:

```text
há um repository?
```

não prova qualidade da persistência.

A revisão precisa verificar:

- migration;
- entity;
- transação;
- query;
- paginação;
- índices;
- teste PostgreSQL real;
- tratamento de concorrência.

A aula também realizará um exercício de explicação técnica.

Ao final, você deverá ser capaz de explicar o projeto em aproximadamente dez minutos, cobrindo:

```text
entrada HTTP;

aplicação;

domínio;

persistência;

infraestrutura;

qualidade;

operação.
```

Esse exercício é importante para:

- entrevistas;
- code review;
- onboarding;
- apresentações técnicas;
- decisões arquiteturais;
- incidentes;
- manutenção.

A revisão não criará uma nova feature.

Ela poderá produzir pequenas correções quando encontrar:

- dependência invertida;
- classe duplicada;
- configuração insegura;
- teste faltante;
- documento divergente;
- nome inconsistente;
- handler genérico incorreto.

Porém, não será iniciado um refactor amplo sem necessidade.

A regra será:

```text
corrigir somente
o que possui evidência,
impacto e escopo controlado.
```

A próxima aula será:

```text
410 - M14.55 - Fechamento do Modulo 14 Spring Boot
```

Ela fará o encerramento pedagógico e operacional do módulo.

Por isso, esta aula permanecerá concentrada na revisão técnica.

---

## Onde estamos na formação

A sequência final do M14 é:

```text
405:
Projeto API OS parte 1 dominio e CRUD.

406:
Projeto API OS parte 2 validacoes e erros.

407:
Projeto API OS parte 3 persistencia e filtros.

408:
Projeto API OS parte 4 testes e documentacao.

409:
Revisao tecnica Spring Boot APIs.

410:
Fechamento do Modulo 14 Spring Boot.
```

A aula 408 respondeu:

```text
como finalizar a API OS
com testes e documentação?
```

A aula 409 responderá:

```text
o conjunto do M14
forma um backend coerente,
explicável e preparado
para evoluir?
```

Nesta aula:

```text
revisão arquitetural:
sim.

revisão de código:
sim.

revisão de configuração:
sim.

revisão REST:
sim.

revisão JPA:
sim.

revisão de testes:
sim.

revisão operacional:
sim.

revisão de containers:
sim.

revisão de documentação:
sim.

nova feature:
não.

refactor amplo:
não.

fechamento pedagógico:
não ainda.
```

A regra central será:

```text
revisão técnica
não verifica apenas
se cada peça funciona;

ela verifica se as peças
trabalham juntas
sem contradições.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/api/M14_TECHNICAL_REVIEW.md
```

A revisão será organizada em quinze áreas:

```text
01 — Estrutura e dependências;

02 — Configuração e profiles;

03 — Contrato REST;

04 — Validation e erros;

05 — Domínio e aplicação;

06 — Persistência e transações;

07 — Cache e rate limiting;

08 — Arquivos, scheduler e e-mail;

09 — Eventos e async;

10 — Testes;

11 — Observabilidade;

12 — Docker e Compose;

13 — OpenAPI, collection e documentação;

14 — Prontidão operacional;

15 — Projeto API OS.
```

Cada área receberá um status:

```text
APROVADO;

APROVADO_COM_RESSALVAS;

CORRECAO_NECESSARIA;

FORA_DO_ESCOPO.
```

Você irá:

1. identificar o commit avaliado;
2. validar a working tree;
3. executar o quality gate;
4. revisar a arquitetura;
5. revisar dependências;
6. revisar configuração;
7. revisar contratos;
8. revisar validação e erros;
9. revisar transações;
10. revisar queries e índices;
11. revisar Redis;
12. revisar arquivos e integrações;
13. revisar testes;
14. revisar Actuator;
15. revisar Docker e Compose;
16. revisar documentação;
17. revisar API OS;
18. registrar ressalvas;
19. aplicar correções pequenas;
20. apresentar o projeto tecnicamente.

---

## Conceito essencial

### Revisão técnica não é apenas code review

Code review normalmente analisa uma mudança.

A revisão desta aula analisa o sistema acumulado.

Ela procura:

- coerência;
- fronteiras;
- duplicação;
- riscos;
- divergências;
- capacidade de evolução.

Uma classe pode estar correta isoladamente e ainda pertencer ao lugar errado.

---

### Arquitetura deve ser legível

A estrutura atual precisa deixar visíveis as responsabilidades.

Exemplo esperado:

```text
web:
HTTP.

application:
casos de uso.

domain:
regras.

persistence:
JPA e queries.

configuration:
beans e infraestrutura.
```

O fluxo permitido é:

```text
web -> application -> domain/persistence.
```

O domínio não deve depender de:

- controller;
- ResponseEntity;
- HttpStatus;
- MockMvc;
- repository Spring Data;
- ProblemDetail.

---

### Dependência explícita

Dependências importantes devem aparecer no construtor.

Exemplos:

```text
repository;

Clock;

ID generator;

validator;

publisher;

mail sender.
```

Evite:

- campos estáticos mutáveis;
- service locator;
- acesso global ao contexto;
- `new` de infraestrutura dentro do service.

A injeção por construtor melhora:

- teste;
- imutabilidade;
- legibilidade;
- falha rápida.

---

### Configuração tipada

Configuração de negócio deve preferir:

```text
@ConfigurationProperties.
```

Ela oferece:

- agrupamento;
- tipos;
- validation;
- metadata;
- clareza.

`@Value` pode ser adequado para valores pequenos e isolados.

Não espalhe dezenas de strings de property por classes.

---

### Profiles com propósito

Profile precisa representar um contexto coerente.

Exemplos:

```text
local;

test;

mail-lab;

availability-lab.
```

Evite profiles que ligam uma única classe sem explicar o contexto.

Também evite ativar profiles de laboratório em produção.

---

### Controller fino

Controller deve cuidar de:

- HTTP;
- path;
- headers;
- request;
- response;
- status;
- conversão.

Não deve conter:

- query JPA;
- regra de transição;
- cálculo complexo;
- acesso direto ao banco;
- envio de e-mail;
- filesystem.

---

### Application service como orquestrador

O application service coordena:

- validação;
- domínio;
- repository;
- transação;
- relógio;
- ID;
- eventos.

Ele não precisa conhecer:

- Servlet;
- JSON;
- status HTTP;
- Swagger UI;
- Postman.

---

### Domínio sem infraestrutura

A entity ou objeto de domínio protege invariantes.

Exemplo da API OS:

```text
estado inicial OPEN;

transições permitidas;

update somente OPEN;

delete somente OPEN.
```

Essas regras não dependem de Spring MVC.

---

### Contrato separado da persistência

Requests e responses separados da entity permitem:

- versionamento;
- validação;
- segurança;
- evolução;
- controle de campos.

Retornar entity diretamente pode expor:

- version interna;
- lazy proxies;
- relacionamentos;
- campos futuros;
- detalhes do schema.

---

### Erros como contrato

O tratamento de erros deve ser previsível.

A revisão verificará:

```text
application/problem+json;

status correto;

code estável;

violations;

correlation ID;

sem stack trace;

sem SQL;

sem host interno.
```

Mensagens humanas podem evoluir.

O campo `code` é mais adequado para integração.

---

### Transação no caso de uso

A transação deve envolver uma unidade de trabalho.

Exemplo:

```text
carregar OS;

validar versão;

aplicar transição;

flush;

retornar resultado.
```

Não espalhe uma mesma operação em várias transações sem necessidade.

Leituras podem utilizar:

```text
readOnly = true.
```

---

### Schema por migration

Flyway continua sendo a fonte do schema.

A revisão verificará:

- ordem;
- imutabilidade;
- nome;
- compatibilidade;
- validação Hibernate;
- teste no PostgreSQL.

Não edite uma migration já aplicada.

Crie uma nova.

---

### Cache não é fonte da verdade

Redis melhora leitura e coordenação temporária.

PostgreSQL continua fonte da verdade.

A revisão deve confirmar:

- key consistente;
- TTL;
- invalidation;
- comportamento em falha;
- serialização;
- ausência de dependência indevida do cache.

---

### Rate limiting não é autenticação

`X-Client-Id` ajuda a separar contadores.

Ele não prova identidade.

A revisão deve preservar essa distinção.

Um cliente pode falsificar o valor quando não existe autenticação.

---

### Arquivos exigem fronteiras

Upload e download precisam proteger:

- tamanho;
- tipo;
- filename;
- path;
- content disposition;
- `nosniff`;
- armazenamento.

Volume local resolve persistência de uma instância.

Não resolve storage compartilhado.

---

### Async e eventos exigem contexto

Eventos internos desacoplam produtores e consumidores.

`@Async` muda:

- thread;
- tratamento de exception;
- contexto;
- transação;
- observabilidade.

A revisão precisa confirmar que nenhum fluxo crítico depende de uma tarefa assíncrona sem garantia.

---

### Testes precisam de intenção

Uma suíte equilibrada utiliza:

```text
JUnit puro:
regras.

Mockito:
coordenação.

WebMvcTest:
contrato web.

DataJpaTest:
persistência.

SpringBootTest:
integração.

Testcontainers:
dependência real.
```

Não use o teste mais pesado para todo cenário.

---

### Observabilidade precisa de semântica

Liveness responde:

```text
o processo precisa ser reiniciado?
```

Readiness responde:

```text
a instância pode receber tráfego?
```

Health global responde:

```text
qual é a visão agregada de saúde?
```

Misturar esses conceitos pode gerar loops de restart.

---

### Container não corrige aplicação

Docker empacota.

Ele não resolve:

- autenticação;
- backup;
- transação;
- performance;
- segurança;
- observabilidade;
- rollback.

A imagem deve ser:

- reproduzível;
- não root;
- configurável;
- pequena;
- observável;
- encerrável.

---

### Documentação conectada

A revisão precisa verificar alinhamento entre:

```text
OpenAPI;

collection;

README;

código;

testes;

Compose.
```

Um path documentado e inexistente é um defeito.

Uma response real não documentada também.

---

## Mão na massa guiada

### 1. Criar o documento de revisão

Arquivo:

```text
docs/api/M14_TECHNICAL_REVIEW.md
```

Estrutura:

```markdown
# Revisão técnica do M14

## Identificação
## Escopo
## Critérios
## Resumo executivo
## Matriz técnica
## Achados
## Correções aplicadas
## Riscos conhecidos
## Decisão
```

---

### 2. Registrar a identificação

Execute:

```powershell
git rev-parse HEAD

git status --short

java -version

.\mvnw.cmd -version

docker version

docker compose version
```

Registre:

- commit;
- Java;
- Maven;
- Docker;
- data;
- responsável.

A revisão vale para esse estado.

---

### 3. Criar a matriz técnica

Modelo:

```markdown
| Área | Status | Evidência | Ressalva | Ação |
|---|---|---|---|---|
| Estrutura | APROVADO | packages revisados | nenhuma | manter |
```

Não deixe células vazias.

Quando não houver ressalva, escreva:

```text
Nenhuma no escopo atual.
```

---

### 4. Executar o gate inicial

```powershell
docker info

.\mvnw.cmd clean verify
```

Registre:

- quantidade de testes;
- failures;
- errors;
- skipped;
- duração;
- commit.

Se o gate falhar:

```text
a revisão continua,
mas o status geral
não pode ser APROVADO.
```

---

### 5. Revisar a estrutura de packages

Liste:

```powershell
Get-ChildItem `
  "src/main/java/br/com/formacao/backend" `
  -Directory
```

Confirme a separação entre:

```text
web;

application;

domain;

persistence;

configuration.
```

Procure violações:

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "org.springframework.http|jakarta.servlet" `
  -CaseSensitive:$false
```

Resultados em `domain` ou application precisam ser analisados.

---

### 6. Revisar injeção de dependência

Procure field injection:

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern "@Autowired" `
  -CaseSensitive:$false
```

A preferência do projeto é construtor.

Se existir `@Autowired` em construtor único, ele pode ser removido.

Se existir em field:

```text
CORRECAO_NECESSARIA.
```

---

### 7. Revisar configuração

Mapeie:

```text
application.yaml;

application-local.yaml;

application-test.yaml;

profiles de laboratório;

@ConfigurationProperties.
```

Confirme:

- nomes coerentes;
- defaults seguros;
- secrets externos;
- validation;
- env examples;
- sem senha real.

Execute:

```powershell
git grep `
  -n `
  -i `
  -E `
  "password:|secret:|api[-_]?key:"
```

Revise cada resultado.

---

### 8. Revisar profiles

Crie uma tabela:

```markdown
| Profile | Objetivo | Pode usar em produção? |
|---|---|---|
| local | Desenvolvimento | Não diretamente |
| test | Testes | Não |
| mail-lab | SMTP local | Não |
| availability-lab | Forçar estados | Não |
```

Confirme que profiles de laboratório não estão ativos por default.

---

### 9. Revisar controllers

Procure:

- acesso a repository;
- lógica de domínio;
- `try/catch` repetido;
- entity em request;
- entity em response;
- path inconsistente;
- status genérico.

Use o OpenAPI e a collection para comparar.

A API OS deve manter:

```text
POST 201 + Location + ETag;

PUT 200 + ETag;

PATCH 200 + ETag;

DELETE 204;

GET 200.
```

---

### 10. Revisar validation

Confirme três níveis:

```text
Bean Validation;

validator de aplicação;

regra de domínio.
```

Teste:

```powershell
.\mvnw.cmd `
  "-Dtest=*ValidatorTest,ServiceOrderTest" `
  test
```

Verifique se commands inválidos podem entrar por fora do controller.

---

### 11. Revisar Problem Details

Execute cenários:

- JSON inválido;
- validation;
- not found;
- invalid transition;
- stale ETag;
- rate limit;
- e-mail indisponível.

Verifique:

```text
Content-Type;

status;

code;

violations;

correlation ID;

ausência de detalhes internos.
```

Procure nos examples:

```powershell
Select-String `
  -Path "api-clients/postman/*.json" `
  -Pattern `
    "java\.lang|SQLException|stackTrace|org\.postgresql" `
  -CaseSensitive:$false
```

---

### 12. Revisar domínio da API OS

Explique sem abrir o controller:

```text
como nasce;

como inicia;

como conclui;

como cancela;

quando atualiza;

quando exclui.
```

Se a explicação exigir ler código web, a regra pode estar no lugar errado.

Execute:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderTest `
  test
```

---

### 13. Revisar transações

Liste métodos com:

```text
@Transactional.
```

Confirme:

- mutações transacionais;
- leituras read-only;
- flush em concorrência;
- exception traduzida;
- nenhuma transação longa envolvendo SMTP ou filesystem sem necessidade.

A notificação externa não deve ficar escondida dentro de uma transação de banco longa.

---

### 14. Revisar JPA e Flyway

Execute:

```powershell
Get-ChildItem `
  "src/main/resources/db/migration"
```

Confirme:

- sequência;
- nomes;
- migrations imutáveis;
- V6 da tabela;
- V7 dos índices;
- `ddl-auto=validate`.

Suba banco vazio em Testcontainers pelo gate.

Isso prova criação limpa.

---

### 15. Revisar Specifications

Confirme:

- filtros no banco;
- `allOf`;
- `unrestricted`;
- escape do `LIKE`;
- intervalo semiaberto;
- sort allowlist;
- size máximo;
- desempate por ID.

Execute testes de repository e page factory.

---

### 16. Revisar índices

No Compose:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --detach

docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "\d service_order"
```

Confirme que os índices correspondem às queries documentadas.

Não marque ausência de índice para `contains` como defeito automático.

---

### 17. Revisar cache

Mapeie:

```text
onde lê;

onde grava;

quando invalida;

qual TTL;

qual key;

qual fallback.
```

Perguntas:

```text
PostgreSQL continua fonte?

update remove cache antigo?

delete remove cache?

falha Redis é fail-open ou fail-fast?

comportamento está testado?
```

Registre ressalvas.

---

### 18. Revisar rate limiting

Confirme:

- algoritmo;
- janela;
- limite;
- chave;
- status 429;
- `Retry-After`;
- Problem Details;
- política de falha Redis.

Registre explicitamente:

```text
X-Client-Id
não é autenticação.
```

---

### 19. Revisar upload e download

Execute os testes existentes.

Confirme:

- limite 5 MB;
- allowlist;
- filename normalizado;
- UUID físico;
- diretório configurável;
- volume Compose;
- `Content-Disposition`;
- `X-Content-Type-Options: nosniff`;
- 404 controlado.

Ressalvas esperadas:

```text
storage local;

sem antivírus;

sem múltiplas instâncias.
```

---

### 20. Revisar scheduler

Confirme:

- tarefa possui finalidade clara;
- cron ou fixed delay configurável;
- logs;
- tratamento de exception;
- profile;
- não executa em testes;
- ausência de lock distribuído registrada.

Não esconda a limitação multi-instância.

---

### 21. Revisar e-mail

Confirme:

- destinatário configurado;
- request não escolhe recipient;
- timeout;
- status 202;
- `SUBMITTED` não significa entrega;
- Mailpit no laboratório;
- erro 503 controlado;
- logs sem corpo.

Ressalvas:

```text
sem outbox;

sem retry durável;

sem provedor de produção testado.
```

---

### 22. Revisar eventos e async

Mapeie listeners.

Para cada um:

- síncrono ou assíncrono?
- depende da transação?
- exception é observada?
- contexto é propagado?
- perda é aceitável?
- teste existe?

Eventos críticos não podem depender apenas de execução assíncrona best-effort sem registro.

---

### 23. Revisar testes

Crie uma tabela:

```markdown
| Nível | Ferramenta | Responsabilidade |
|---|---|---|
| Domínio | JUnit | Regras |
| Service | Mockito | Coordenação |
| Controller | MockMvc | HTTP |
| Repository | DataJpaTest | JPA |
| Integração | SpringBootTest | Fluxo |
| Infra | Testcontainers | PostgreSQL |
```

Procure:

- testes dependentes de ordem;
- sleep;
- clock real;
- UUID aleatório;
- banco compartilhado;
- mocks excessivos;
- `@SpringBootTest` desnecessário.

---

### 24. Revisar cobertura comportamental

Não use apenas percentual.

Escolha comportamentos críticos:

```text
status inicial;

transição inválida;

agendamento passado;

stale ETag;

optimistic lock;

filtro combinado;

wildcard literal;

upload inválido;

429;

503;

readiness.
```

Confirme ao menos um teste relevante para cada grupo.

---

### 25. Revisar observabilidade

Suba a stack.

Teste:

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"

Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"

Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/info"
```

Confirme:

- management separado;
- detalhes ocultos;
- endpoints mínimos;
- versão;
- métricas.

---

### 26. Revisar logs e correlation ID

Execute uma request com:

```http
X-Correlation-Id: review-m14-409
```

Procure nos logs:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String "review-m14-409"
```

Confirme que request, erro e eventos podem ser correlacionados.

Não registre body sensível.

---

### 27. Revisar Dockerfile

Confirme:

- multi-stage;
- JDK no build;
- JRE no runtime;
- layers;
- usuário 10001;
- healthcheck;
- ENTRYPOINT exec;
- secrets ausentes;
- volume configurável.

Execute:

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java-backend-api:400-local"
```

Use a tag realmente disponível no ambiente.

---

### 28. Revisar Compose

Confirme:

- services `api`, `postgres`, `redis`;
- rede interna;
- healthchecks;
- volumes;
- `depends_on` saudável;
- portas do banco não publicadas;
- management no loopback;
- env file ignorado.

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

---

### 29. Revisar OpenAPI

Abra:

```text
http://localhost:8081/swagger-ui/index.html.
```

Confirme:

- tags;
- paths;
- schemas;
- responses;
- headers;
- depreciação v1;
- API OS;
- filtros.

Compare com o controller.

---

### 30. Revisar collection

Execute o runner principal.

Confirme:

- environment ativo;
- IDs encadeados;
- ETags encadeados;
- erros;
- limpeza de variáveis;
- nenhuma credential exportada.

Valide o JSON:

```powershell
Get-Content `
  "api-clients/postman/formacao-java-backend-api-v2.postman_collection.json" `
  -Raw |
  ConvertFrom-Json |
  Out-Null
```

---

### 31. Revisar documentação

Abra:

```text
docs/api/README.md;

docs/api/service-orders.md;

docs/api/REST_API_REVIEW.md;

docs/api/PRODUCTION_READINESS_CHECKLIST.md.
```

Verifique links e divergências.

Confirme que o estado atual permanece:

```text
laboratório:
GO condicional.

produção pública:
NO-GO.
```

Não altere a decisão sem novas evidências.

---

### 32. Criar achados

Use o formato:

```markdown
### M14-REV-001 — Título

- Área:
- Status:
- Evidência:
- Impacto:
- Decisão:
- Ação:
```

Exemplos de achados legítimos:

- profile de laboratório ativado por engano;
- request usando entity;
- handler duplicado;
- OpenAPI sem `If-Match`;
- teste com clock real;
- documento com path antigo;
- sort interno exposto.

Não invente achados para preencher o relatório.

---

### 33. Aplicar correções pequenas

Critérios:

```text
mudança local;

risco conhecido;

teste possível;

sem alterar escopo do domínio.
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Atualize a evidência do relatório.

---

### 34. Criar o resumo executivo

Exemplo:

```markdown
## Resumo executivo

A arquitetura do laboratório está coerente com o objetivo do M14.
Controllers permanecem finos, application services coordenam casos
de uso, o domínio da API OS protege transições e PostgreSQL continua
fonte da verdade. Testes em camadas, OpenAPI, collection, Actuator,
Docker e Compose oferecem boa reproduzibilidade.

A aplicação permanece inadequada para produção pública devido aos
bloqueadores já registrados: ausência de autenticação, autorização,
TLS comprovado, secret manager, restore testado, operação
multi-instância e alertas externos.
```

O resumo não deve contradizer o checklist de produção.

---

### 35. Fazer a apresentação técnica de dez minutos

Roteiro:

```text
1 minuto:
objetivo da aplicação.

2 minutos:
arquitetura e camadas.

2 minutos:
REST, validation e erros.

2 minutos:
JPA, PostgreSQL, Redis e arquivos.

2 minutos:
testes, Actuator e containers.

1 minuto:
limitações e próximos passos.
```

Não leia classes uma por uma.

Explique decisões.

---

## Entendendo o que foi feito

### O módulo virou um sistema coerente

Os temas deixaram de ser aulas isoladas.

### A arquitetura foi validada por evidências

Packages, dependências e testes foram revisados.

### A API OS funcionou como síntese

Domínio, persistência, REST e operação apareceram no mesmo projeto.

### Limitações permaneceram visíveis

A revisão não transformou laboratório em produção por declaração.

### Pequenas correções ficaram protegidas

Cada ajuste passou novamente pelo gate.

### A explicação técnica ficou treinada

Você passou a apresentar o projeto por responsabilidades e decisões.

---

## Erros comuns importantes

### Revisar apenas nomes de classes

Nomes corretos não provam comportamento.

### Fazer refactor amplo durante revisão

O risco cresce e a evidência se perde.

### Ignorar configuração

Muitos incidentes não estão no código Java.

### Considerar teste verde suficiente

Contrato, operação e documentação também importam.

### Confundir Redis com fonte da verdade

Cache pode ser perdido.

### Confundir health com produção pronta

Health não substitui alertas, backup ou segurança.

### Aprovar documentação divergente

Documentação incorreta aumenta risco.

### Esconder ressalvas para parecer completo

Maturidade exige transparência.

### Decorar tecnologias

A revisão precisa explicar por que cada decisão existe.

### Encerrar sem novo quality gate

Correções da revisão também podem quebrar o projeto.

---

## Comandos úteis

### Gate completo

```powershell
docker info

.\mvnw.cmd clean verify
```

### Estrutura

```powershell
Get-ChildItem `
  "src/main/java/br/com/formacao/backend" `
  -Directory
```

### Field injection

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern "@Autowired"
```

### Secrets

```powershell
git grep `
  -n `
  -i `
  -E `
  "password|secret|token|api[_-]?key"
```

### Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

### Health

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"
```

### Diff da revisão

```powershell
git diff `
  -- `
  "src" `
  "docs/api" `
  "api-clients/postman"
```

---

## Exercício guiado

### Parte 1 — Estrutura

Explique as camadas e verifique dependências.

### Parte 2 — Configuração

Mapeie properties e profiles.

### Parte 3 — REST

Revise paths, status, headers e errors.

### Parte 4 — Domínio

Explique as transições da API OS.

### Parte 5 — Persistência

Revise migrations, transações, queries e índices.

### Parte 6 — Infraestrutura

Revise Redis, arquivos, e-mail, eventos e async.

### Parte 7 — Qualidade

Execute testes e revise responsabilidades.

### Parte 8 — Operação

Valide Actuator, Docker e Compose.

### Parte 9 — Contrato

Compare OpenAPI, collection e documentação.

### Parte 10 — Apresentação

Explique o projeto em dez minutos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 408 foi preservada;
- revisão técnica foi diferenciada de code review;
- documento `M14_TECHNICAL_REVIEW.md` foi criado;
- commit avaliado foi registrado;
- versões de ferramentas foram registradas;
- working tree foi validada;
- gate inicial foi executado;
- gate final foi executado;
- estrutura de packages foi revisada;
- dependências entre camadas foram revisadas;
- domínio não depende de HTTP;
- application não depende de Servlet;
- controllers permanecem finos;
- acesso direto a repository no controller foi rejeitado;
- injeção por construtor foi revisada;
- field injection foi procurada;
- configuração tipada foi revisada;
- secrets foram procurados;
- defaults seguros foram revisados;
- profiles foram documentados;
- profiles de laboratório não estão ativos por default;
- contratos REST foram revisados;
- status HTTP foram comparados;
- Location foi revisado;
- ETag foi revisado;
- If-Match foi revisado;
- Bean Validation foi revisada;
- validator de aplicação foi revisado;
- regras de domínio foram revisadas;
- Problem Details foi revisado;
- codes públicos foram revisados;
- stack trace pública foi rejeitada;
- correlation ID foi revisado;
- transações foram revisadas;
- readOnly foi revisado;
- flush concorrente foi revisado;
- Flyway foi revisado;
- migrations foram listadas;
- migrations aplicadas não foram editadas;
- ddl-auto validate foi confirmado;
- Specifications foram revisadas;
- filtros em memória foram rejeitados;
- paginação foi revisada;
- size máximo foi revisado;
- sort allowlist foi revisada;
- desempate por ID foi revisado;
- índices foram revisados;
- PostgreSQL real foi exercitado;
- cache foi revisado;
- PostgreSQL permaneceu fonte da verdade;
- invalidation foi revisada;
- rate limiting foi revisado;
- 429 e Retry-After foram revisados;
- X-Client-Id não foi tratado como autenticação;
- upload foi revisado;
- download foi revisado;
- limitações do storage local foram registradas;
- scheduler foi revisado;
- ausência de lock distribuído foi preservada;
- e-mail foi revisado;
- SUBMITTED não foi chamado de entrega;
- ausência de outbox foi preservada;
- eventos internos foram revisados;
- async foi revisado;
- fluxos críticos best-effort foram identificados;
- estratégia de testes foi revisada;
- testes pesados desnecessários foram procurados;
- clock real em testes foi procurado;
- PostgreSQL Testcontainers foi revisado;
- health foi testado;
- liveness foi testada;
- readiness foi testada;
- info foi testado;
- métricas foram revisadas;
- logs foram revisados;
- correlation ID foi localizado nos logs;
- Dockerfile foi revisado;
- multi-stage foi confirmado;
- usuário não root foi confirmado;
- healthcheck foi confirmado;
- ENTRYPOINT exec foi confirmado;
- Compose foi validado;
- rede interna foi revisada;
- volumes foram revisados;
- banco e Redis não foram publicados no host;
- management ficou no loopback;
- OpenAPI foi revisada;
- collection foi validada;
- runner foi executado;
- documentação foi revisada;
- decisão de produção não foi alterada sem evidência;
- achados possuem evidência;
- correções pequenas foram testadas;
- resumo executivo foi criado;
- apresentação de dez minutos foi realizada;
- nova feature não foi antecipada;
- refactor amplo não foi realizado;
- fechamento formal não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 410 está correta.

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
git commit -m "docs(m14): concluir revisao tecnica das APIs Spring Boot"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- env files;
- credentials;
- logs locais;
- dados PostgreSQL;
- relatórios temporários;
- screenshots;
- correções sem teste;
- achados inventados.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você revisou o M14 como um sistema.

A análise conectou:

```text
Spring Boot;

configuração;

REST;

validation;

erros;

domínio;

JPA;

PostgreSQL;

Redis;

arquivos;

e-mail;

eventos;

async;

testes;

Actuator;

Docker;

Compose;

OpenAPI;

documentação.
```

A API OS serviu como síntese prática.

Ela demonstrou:

```text
domínio protegido;

contrato versionado;

concorrência;

filtros;

persistência real;

testes em camadas;

documentação executável.
```

A decisão central foi:

```text
backend profissional
não é apenas implementar endpoints;

é manter arquitetura,
contrato,
dados,
qualidade,
operação e documentação
coerentes entre si.
```

A próxima aula será:

```text
410 - M14.55 - Fechamento do Modulo 14 Spring Boot
```

Nela, você encerrará formalmente o módulo.

O fechamento incluirá:

- inventário de competências;
- revisão dos commits;
- organização dos artefatos;
- checkpoint final;
- avaliação prática;
- lacunas;
- roteiro de revisão;
- preparação para o próximo módulo.

Nenhuma nova implementação será adicionada antes do encerramento.

---

# Material complementar

## Checkpoint final

- [ ] Executei o gate completo.
- [ ] Revisei arquitetura e configuração.
- [ ] Revisei dados, contrato e erros.
- [ ] Revisei testes, operação e containers.
- [ ] Registrei achados e expliquei o projeto.

---

## Troubleshooting adicional

### A revisão encontra muitas pendências

Classifique por impacto.

Corrija primeiro:

- quebra de contrato;
- risco de dados;
- segurança;
- teste falhando;
- configuração insegura.

### O projeto passa no gate, mas a documentação diverge

O gate não valida todo conteúdo humano.

Corrija a documentação e registre a evidência.

### Field injection aparece em configuração antiga

Avalie cada caso.

Migre para construtor quando não houver razão técnica.

### O runner falha por 429

Use um client ID exclusivo ou aguarde a janela.

Não desabilite permanentemente o controle para esconder o problema.

### Health está UP e readiness está DOWN

Analise o estado de disponibilidade.

Essa diferença pode ser correta.

### Dockerfile está correto, mas a imagem está antiga

Reconstrua com:

```text
--no-cache
```

somente quando o objetivo for invalidar o cache de forma consciente.

### A apresentação passa de dez minutos

Explique decisões.

Não liste todas as classes.

---

## Perguntas de revisão

1. Qual diferença entre revisão técnica e code review?
2. O domínio pode depender de HttpStatus?
3. O controller acessa repository diretamente?
4. Para que serve ConfigurationProperties?
5. Profile de laboratório pode ficar ativo por default?
6. Qual é a fonte do schema?
7. Redis é fonte da verdade?
8. X-Client-Id é autenticação?
9. Por que ETag existe na API OS?
10. O que 412 representa?
11. O que 409 representa?
12. Por que usar PostgreSQL real nos testes?
13. Liveness deve consultar dependência externa?
14. Readiness significa o quê?
15. Docker torna a API segura?
16. Collection substitui teste?
17. OpenAPI substitui documentação técnica?
18. A aplicação está pronta para produção pública?
19. Qual é a próxima aula?
20. O que ela fará?

---

## Roteiro de resposta

1. A primeira avalia o sistema acumulado.
2. Não.
3. Não.
4. Configuração agrupada e tipada.
5. Não.
6. Flyway.
7. Não.
8. Não.
9. Evitar lost update.
10. Precondição de versão falhou.
11. Conflito durante a operação.
12. Para reproduzir o banco real.
13. Não.
14. A instância pode receber tráfego.
15. Não.
16. Não.
17. Não.
18. Não.
19. Fechamento do M14.
20. Consolidar competências e artefatos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 409 - M14.54 - Revisao tecnica Spring Boot APIs

- Continuei no projeto `formacao-java-backend-api`.
- Criei `docs/api/M14_TECHNICAL_REVIEW.md`.
- Registrei commit, ferramentas e escopo da revisão.
- Executei o quality gate inicial.
- Revisei a estrutura de packages.
- Revisei dependências entre web, application, domain e persistence.
- Procurei field injection.
- Revisei ConfigurationProperties e profiles.
- Confirmei que profiles de laboratório não ficam ativos por default.
- Revisei controllers e contratos REST.
- Revisei Location, ETag e If-Match.
- Revisei Bean Validation, validator de aplicação e domínio.
- Revisei Problem Details e códigos públicos.
- Confirmei ausência de stack trace público.
- Revisei correlation ID.
- Revisei transações e read-only.
- Revisei Flyway, JPA e PostgreSQL.
- Revisei Specifications, paginação, sort e índices.
- Revisei cache e invalidation.
- Confirmei PostgreSQL como fonte da verdade.
- Revisei rate limiting.
- Confirmei que X-Client-Id não é autenticação.
- Revisei upload, download e storage local.
- Revisei scheduler e ausência de lock distribuído.
- Revisei e-mail e ausência de outbox.
- Revisei eventos internos e async.
- Revisei a estratégia de testes em camadas.
- Revisei Testcontainers e PostgreSQL real.
- Testei health, readiness, liveness e info.
- Localizei correlation ID nos logs.
- Revisei Dockerfile e usuário não root.
- Validei Compose, rede e volumes.
- Revisei OpenAPI, collection e documentação.
- Mantive NO-GO para produção pública.
- Registrei achados com evidência.
- Apliquei somente correções pequenas e testadas.
- Executei o quality gate final.
- Apresentei o projeto em dez minutos.
- Não antecipei nova feature ou o fechamento formal.
- Próxima aula: Fechamento do Modulo 14 Spring Boot.
```

---

## Referência técnica curta

- [Spring Boot — Reference](https://docs.spring.io/spring-boot/reference/)
- [Spring Framework — Core Technologies](https://docs.spring.io/spring-framework/reference/core.html)
- [Spring Framework — Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)
- [Spring Boot — Testing](https://docs.spring.io/spring-boot/reference/testing/)
- [Spring Boot — Actuator](https://docs.spring.io/spring-boot/reference/actuator/)
- [Docker Compose](https://docs.docker.com/compose/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

Regra final:

```text
uma revisão técnica de APIs Spring Boot precisa observar o sistema inteiro e confrontar código, configuração, testes, execução e documentação; nesta baseline, camadas, contracts, validation, JPA, Redis, arquivos, integrações, testes, Actuator, containers e artefatos da API OS são revisados por evidências, pequenas correções passam novamente pelo quality gate e as limitações de produção permanecem explícitas.
```
