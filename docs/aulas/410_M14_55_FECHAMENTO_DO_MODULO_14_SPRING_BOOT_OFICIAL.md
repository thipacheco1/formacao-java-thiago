# 410 - M14.55 - Fechamento do Modulo 14 Spring Boot

## Apresentação da aula

Na aula 409, você realizou uma revisão técnica integrada do M14.

A revisão conectou:

```text
arquitetura;

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

collection;

documentação.
```

O projeto deixou de ser observado como uma sequência de aulas isoladas.

Ele passou a ser analisado como um backend completo.

Aquela aula respondeu:

```text
as decisões acumuladas
formam uma arquitetura coerente,
testável, operável
e compreensível?
```

Agora chegou o momento de encerrar formalmente o Módulo 14.

O encerramento não será apenas:

```text
terminamos Spring Boot.
```

O fechamento precisa registrar:

- o que foi aprendido;
- o que foi construído;
- quais evidências existem;
- quais competências foram demonstradas;
- quais limitações permanecem;
- quais artefatos precisam ser preservados;
- quais assuntos precisam ser revisados;
- qual é a ponte para segurança de aplicações Java.

O M14 possui cinquenta e cinco aulas.

Ele começou em:

```text
356 - M14.01 - Spring Boot visao geral
```

E termina em:

```text
410 - M14.55 - Fechamento do Modulo 14 Spring Boot
```

Ao longo desse percurso, a aplicação evoluiu de um projeto Spring Boot inicial para uma API backend com:

```text
camadas;

contrato REST;

persistência;

integrações;

testes;

observabilidade;

containerização;

documentação;

projeto completo de Ordem de Serviço.
```

A pergunta central desta aula será:

```text
quais evidências demonstram
que o aluno concluiu o M14
com capacidade prática
para construir e explicar
uma API Spring Boot profissional?
```

A resposta será materializada em:

```text
docs/m14/M14_COMPLETION_REPORT.md
```

Esse relatório registrará:

- identificação;
- inventário de competências;
- inventário de artefatos;
- gate final;
- avaliação prática;
- pontos fortes;
- lacunas;
- plano de revisão;
- decisão de conclusão;
- ponte para o M15.

A conclusão do módulo será baseada em evidências.

O módulo não será considerado concluído somente porque todos os arquivos de aula foram gerados.

O projeto precisa demonstrar:

```text
compilação;

testes;

integração;

contrato;

execução;

documentação;

capacidade de explicação.
```

O gate final utilizará:

```powershell
.\mvnw.cmd clean verify
```

Também serão validados:

```text
Docker Compose;

health;

OpenAPI;

collection;

links da documentação;

working tree;

último commit.
```

O projeto API OS será o exercício síntese.

Ele demonstra a capacidade de aplicar:

- modelagem;
- REST;
- validation;
- JPA;
- migrations;
- transações;
- concorrência;
- filtros;
- testes;
- documentação;
- operação.

O encerramento também preservará uma decisão importante da aula 404:

```text
laboratório controlado:
GO CONDICIONAL.

produção pública:
NO-GO.
```

Concluir o módulo não significa declarar a aplicação pronta para produção pública.

Significa reconhecer com precisão:

```text
o que já está dominado;

o que ainda falta;

qual é o próximo passo.
```

O próximo módulo será:

```text
M15 - Seguranca de aplicacoes Java
```

A primeira aula será:

```text
411 - M15.01 - Fundamentos seguranca web
```

Essa ponte é consequência direta das lacunas identificadas:

- autenticação;
- autorização;
- proteção de recursos;
- gestão de identidade;
- ameaças;
- ataques;
- configuração segura;
- auditoria;
- testes de segurança.

O M15 não substituirá o M14.

Ele adicionará segurança sobre a base construída aqui.

---

## Onde estamos na formação

A sequência final é:

```text
408:
Projeto API OS parte 4 testes e documentacao.

409:
Revisao tecnica Spring Boot APIs.

410:
Fechamento do Modulo 14 Spring Boot.

411:
Fundamentos seguranca web.

412:
Threat modeling inicial.
```

A aula 409 respondeu:

```text
o backend do M14
é tecnicamente coerente?
```

A aula 410 responderá:

```text
o que foi conquistado,
como comprovar a conclusão
e como preparar a evolução
para segurança?
```

Nesta aula:

```text
inventário:
sim.

gate final:
sim.

avaliação prática:
sim.

relatório de conclusão:
sim.

revisão de commits:
sim.

revisão de artefatos:
sim.

plano de estudo:
sim.

decisão de conclusão:
sim.

nova feature:
não.

refactor amplo:
não.

Spring Security:
não ainda.

M15:
ponte apenas.
```

A regra central será:

```text
um módulo termina
quando competências,
artefatos e evidências
estão organizados
e o próximo passo
está claramente definido.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/m14/M14_COMPLETION_REPORT.md
```

O relatório possuirá:

```text
# Relatório de conclusão do M14

## Identificação
## Resumo do módulo
## Competências demonstradas
## Artefatos construídos
## Gate final
## Avaliação prática
## Pontos fortes
## Lacunas conhecidas
## Plano de revisão
## Decisão de conclusão
## Ponte para o M15
```

Você irá:

1. criar o diretório de encerramento;
2. identificar o commit final;
3. conferir working tree;
4. revisar os cinquenta e cinco títulos;
5. organizar competências por eixo;
6. inventariar os artefatos;
7. executar testes;
8. validar Docker e Compose;
9. testar health;
10. validar OpenAPI;
11. validar collection;
12. revisar documentação;
13. executar avaliação prática;
14. registrar pontos fortes;
15. registrar lacunas;
16. criar plano de revisão;
17. emitir a conclusão;
18. realizar o commit de fechamento.

O critério de conclusão será:

```text
CONCLUIDO:
gate técnico aprovado
e relatório registrado.

CONCLUIDO_COM_RESSALVAS:
gate principal aprovado,
mas existem limitações documentadas.

NAO_CONCLUIDO:
testes falhando,
artefatos ausentes
ou exercício síntese não reproduzível.
```

A decisão esperada para o M14 será:

```text
CONCLUIDO_COM_RESSALVAS.
```

Motivo:

```text
competências do módulo foram demonstradas;

produção pública permanece bloqueada
por lacunas de segurança e operação.
```

---

## Conceito essencial

### Competência não é apenas conteúdo visto

Assistir, ler ou gerar uma aula não comprova competência.

Competência aparece quando você consegue:

```text
explicar;

implementar;

testar;

diagnosticar;

corrigir;

documentar;

justificar decisões.
```

O relatório de conclusão será orientado a essas ações.

---

### Evidência técnica

Exemplos válidos:

- commit;
- teste verde;
- migration aplicada;
- response HTTP;
- OpenAPI;
- collection;
- documentação;
- relatório de revisão;
- container saudável;
- query comprovada;
- log com correlation ID.

Exemplos fracos:

```text
eu lembro;

eu entendi;

parece funcionar;

já fiz uma vez.
```

Conhecimento técnico precisa ser reproduzível.

---

### Eixos de competência

O M14 será organizado em dez eixos.

```text
1. Fundamentos Spring Boot;

2. HTTP e REST;

3. Arquitetura e casos de uso;

4. Persistência;

5. Contratos e evolução;

6. Integrações e recursos;

7. Testes;

8. Observabilidade;

9. Containers e operação;

10. Projeto completo.
```

Essa organização é mais útil que decorar cinquenta e cinco títulos.

---

### Fundamentos Spring Boot

Você deve conseguir explicar:

- auto-configuration;
- component scan;
- beans;
- scopes;
- ciclo de vida;
- injeção por construtor;
- configuração;
- profiles;
- propriedades tipadas.

Evidências:

```text
Main Application;

Configuration classes;

@ConfigurationProperties;

profiles local e test;

services com constructor injection.
```

---

### HTTP e REST

Você deve dominar:

- verbos;
- status;
- headers;
- URI;
- request body;
- path variable;
- query parameter;
- content type;
- idempotência;
- paginação;
- versionamento.

Evidência forte:

```text
API OS com POST, GET, PUT, PATCH e DELETE;

201 + Location;

204 sem body;

ETag;

If-Match;

412;

428.
```

---

### Arquitetura e casos de uso

Você deve explicar as responsabilidades de:

```text
controller;

request;

command;

application service;

domain;

repository;

response.
```

O fluxo precisa ser claro:

```text
HTTP
-> web
-> application
-> domain/persistence
-> response.
```

O domínio não pode depender de HTTP.

---

### Persistência

Competências:

- entity;
- repository;
- transaction;
- dirty checking;
- UUID;
- optimistic locking;
- Flyway;
- PostgreSQL;
- Specifications;
- paginação;
- ordenação;
- índices;
- EXPLAIN.

Evidências:

```text
V6;

V7;

service_order;

@Version;

JpaSpecificationExecutor;

Testcontainers PostgreSQL.
```

---

### Contratos e evolução

Competências:

- DTOs;
- mappers;
- Bean Validation;
- validation customizada;
- Problem Details;
- OpenAPI;
- contract first;
- compatibilidade;
- depreciação;
- v1/v2.

A API precisa evoluir sem expor entity ou quebrar consumidores silenciosamente.

---

### Integrações e recursos

O módulo incluiu:

- Redis;
- cache;
- rate limiting;
- upload;
- download;
- scheduler;
- e-mail;
- eventos;
- async.

Você deve explicar o papel e a limitação de cada recurso.

Exemplo:

```text
Redis não é fonte da verdade;

SUBMITTED não significa entregue;

scheduler por instância
não é adequado para múltiplas réplicas.
```

---

### Testes

Você deve selecionar o nível certo.

```text
JUnit puro:
domínio.

Mockito:
service.

WebMvcTest:
controller.

DataJpaTest:
repository.

SpringBootTest:
integração.

Testcontainers:
dependência real.

contrato:
provider.
```

Competência não é usar `@SpringBootTest` em tudo.

É entender o custo e o objetivo de cada teste.

---

### Observabilidade

Você deve explicar:

- logs;
- correlation ID;
- metrics;
- health;
- liveness;
- readiness;
- info;
- management port.

Também deve reconhecer:

```text
Actuator não é monitoramento completo;

métrica sem coleta
não gera alerta.
```

---

### Containers e operação

Competências:

- Dockerfile;
- multi-stage;
- JDK versus JRE;
- usuário não root;
- layers;
- healthcheck;
- volume;
- env;
- Compose;
- rede;
- volumes nomeados;
- dependencies health.

Também deve saber:

```text
container healthy
não significa produção pronta.
```

---

### Projeto síntese

A API OS comprova integração dos eixos.

Ela contém:

```text
domínio;

CRUD;

transições;

ETag;

If-Match;

JPA;

migrations;

filtros;

índices;

testes;

OpenAPI;

collection;

documentação.
```

A capacidade de explicar essa feature é parte da avaliação.

---

### Conclusão com ressalvas

Uma formação séria não esconde lacunas.

As ressalvas atuais incluem:

- ausência de autenticação;
- ausência de autorização;
- ausência de TLS comprovado;
- ausência de secret manager;
- ausência de backup e restore testados;
- ausência de observabilidade externa;
- storage local;
- scheduler sem lock;
- ausência de teste de carga;
- rollback não testado.

Essas ressalvas orientam os próximos módulos.

---

### Retenção do conhecimento

O relatório de conclusão não deve funcionar como um certificado esquecido.

Ele será utilizado como índice para revisões futuras.

Quando um assunto reaparecer em outro módulo, retorne primeiro à evidência prática relacionada.

Exemplos:

```text
Spring Security protegerá controllers
e casos de uso construídos no M14;

auditoria reutilizará correlation ID
e eventos internos;

segurança de dados revisará
configuração, logs e uploads;

autorização por recurso será aplicada
sobre a API de Ordem de Serviço.
```

A retenção será verificada por recuperação ativa.

Em vez de apenas reler, execute:

```text
explicar sem consultar;

desenhar o fluxo;

executar o cenário;

provocar uma falha;

diagnosticar;

corrigir;

comparar com a documentação.
```

Um assunto será considerado retido quando você conseguir retornar ao projeto depois de alguns dias e reconstruir o raciocínio sem seguir cada passo da aula.

O relatório também servirá para entrevistas e apresentações.

Ele deve permitir responder:

- qual problema o projeto resolve;
- como as camadas se relacionam;
- por que PostgreSQL é fonte da verdade;
- como a concorrência é controlada;
- por que os testes possuem níveis diferentes;
- quais riscos impedem produção pública;
- qual evolução será feita no M15.

Essa prática transforma o encerramento em uma base reutilizável, e não em um ponto final isolado.

---

## Mão na massa guiada

### 1. Criar o diretório

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/m14" |
  Out-Null
```

Arquivo:

```text
docs/m14/M14_COMPLETION_REPORT.md
```

---

### 2. Registrar a identificação

Execute:

```powershell
git rev-parse HEAD

git log -1 --oneline

git status --short

java -version

.\mvnw.cmd -version
```

No relatório, registre:

```markdown
## Identificação

- Módulo: M14
- Nome: Spring Boot, REST APIs e backend profissional
- Aulas: 356 a 410
- Total de aulas: 55
- Projeto: formacao-java-backend-api
- Status: CONCLUIDO_COM_RESSALVAS
```

Adicione o hash real do commit avaliado.

---

### 3. Confirmar working tree

O comando:

```powershell
git status --short
```

deve estar vazio antes do gate final.

Quando existirem mudanças intencionais da aula 410, registre o commit anterior, conclua o relatório e faça o commit de fechamento.

Não misture arquivos temporários.

---

### 4. Criar o resumo do módulo

Use:

```markdown
## Resumo do módulo

O M14 construiu uma API Spring Boot evolutiva com Java 21,
PostgreSQL, Redis, Flyway, validação, erros padronizados,
testes em camadas, observabilidade, containers e documentação.

O projeto síntese foi a API de Ordem de Serviço, responsável por
integrar domínio, REST, persistência, concorrência, filtros,
testes, OpenAPI e collection.
```

---

### 5. Inventariar as competências

Crie uma tabela:

```markdown
| Eixo | Competência demonstrada | Evidência |
|---|---|---|
| Spring Boot | Configuração e DI | código e testes |
| REST | Contrato v2 e status | OpenAPI e MockMvc |
| Persistência | JPA e Flyway | migrations e Testcontainers |
| Testes | Estratégia em camadas | `clean verify` |
| Operação | Actuator e containers | health e Compose |
```

Preencha os dez eixos.

Não use apenas “estudado”.

Use verbos:

```text
implementou;

testou;

documentou;

validou;

diagnosticou.
```

---

### 6. Inventariar artefatos

Liste:

```text
pom.xml;

application*.yaml;

migrations;

Dockerfile;

compose.yaml;

OpenAPI;

collection;

docs/api/README.md;

docs/api/service-orders.md;

REST_API_REVIEW.md;

PRODUCTION_READINESS_CHECKLIST.md;

M14_TECHNICAL_REVIEW.md;

testes;

diário de bordo.
```

Para cada artefato, registre a finalidade.

---

### 7. Revisar migrations

Execute:

```powershell
Get-ChildItem `
  "src/main/resources/db/migration" |
  Sort-Object Name
```

Confirme:

- sequência;
- nomes;
- V6;
- V7;
- ausência de edição indevida.

No relatório:

```text
Schema gerenciado por Flyway:
APROVADO.
```

---

### 8. Executar o gate Maven

```powershell
docker info

.\mvnw.cmd clean verify
```

Registre:

- data;
- commit;
- resultado;
- quantidade de tests;
- failures;
- errors;
- skipped;
- duração.

A decisão de conclusão exige:

```text
failures:
0.

errors:
0.
```

Skipped precisam ser explicados.

---

### 9. Validar a imagem

Construa:

```powershell
docker build `
  --build-arg APP_VERSION="m14-final" `
  --tag "formacao-java-backend-api:m14-final" `
  .
```

Confirme Java:

```powershell
docker run `
  --rm `
  --entrypoint java `
  "formacao-java-backend-api:m14-final" `
  -version
```

Confirme usuário:

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java-backend-api:m14-final"
```

Esperado:

```text
Java 21;

uid 10001;

não root.
```

---

### 10. Validar Compose

Atualize temporariamente a tag no env local quando necessário.

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet

docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach

docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

Confirme:

```text
api healthy;

postgres healthy;

redis healthy.
```

---

### 11. Validar operação

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

Registre:

```text
liveness:
200.

readiness:
200.

health:
UP.

version:
m14-final ou versão configurada.
```

---

### 12. Validar OpenAPI

Abra:

```text
http://localhost:8081/swagger-ui/index.html.
```

Consulte:

```powershell
$openApi =
  Invoke-RestMethod `
    "http://localhost:8081/v3/api-docs"
```

Confirme paths:

```text
/api/v2/service-orders;

/api/v2/service-orders/{serviceOrderId};

/api/v2/service-orders/{serviceOrderId}/status.
```

Confirme:

- ETag;
- If-Match;
- responses;
- filtros;
- v1 depreciada.

---

### 13. Validar a collection

Valide JSON:

```powershell
Get-Content `
  "api-clients/postman/formacao-java-backend-api-v2.postman_collection.json" `
  -Raw |
  ConvertFrom-Json |
  Out-Null
```

Execute o runner:

- operação;
- managed messages;
- service orders;
- erros principais.

Confirme:

```text
zero assertions falhando;

IDs limpos;

ETags atualizados;

nenhum secret exportado.
```

---

### 14. Validar documentação

Abra:

```text
docs/api/README.md;

docs/api/service-orders.md;

docs/api/REST_API_REVIEW.md;

docs/api/PRODUCTION_READINESS_CHECKLIST.md;

docs/api/M14_TECHNICAL_REVIEW.md.
```

Confirme:

- links;
- paths;
- status;
- exemplos;
- decisão de produção;
- nomes dos arquivos.

O relatório de conclusão deve apontar para esses documentos.

---

### 15. Executar a avaliação prática

A avaliação terá quatro blocos.

#### Bloco A — Explicação

Sem ler a aula, explique:

```text
como uma request de criação
atravessa as camadas
até o PostgreSQL.
```

Tempo máximo recomendado:

```text
cinco minutos.
```

#### Bloco B — Implementação

Adicione temporariamente um novo campo de filtro hipotético no papel:

```text
status + período.
```

Explique:

- criteria;
- specification;
- index;
- tests;
- OpenAPI;
- collection.

Não implemente um filtro novo sem requisito.

O objetivo é explicar o processo.

#### Bloco C — Diagnóstico

Cenário:

```text
API responde 503;
liveness está UP;
readiness está DOWN.
```

Explique:

- significado;
- logs;
- dependencies;
- ação;
- por que não reiniciar cegamente.

#### Bloco D — Concorrência

Explique:

```text
ETag "2";

If-Match "2";

outro cliente atualiza;

primeiro cliente tenta salvar.
```

Diferencie:

```text
412;

409.
```

---

### 16. Criar a autoavaliação

Use notas de zero a quatro.

```text
0:
não consigo explicar.

1:
reconheço o assunto.

2:
executo com consulta.

3:
executo e explico.

4:
executo, explico e diagnostico.
```

Avalie:

- Spring Boot;
- REST;
- validation;
- erros;
- JPA;
- transações;
- PostgreSQL;
- Redis;
- testes;
- observabilidade;
- Docker;
- documentação;
- API OS.

Não use a nota para aprovação isolada.

Ela orienta o plano de revisão.

---

### 17. Registrar pontos fortes

Exemplos possíveis:

- separar DTO de entity;
- escrever testes em camadas;
- usar PostgreSQL real;
- explicar status HTTP;
- modelar transições;
- analisar logs;
- usar Compose;
- documentar.

Registre somente pontos demonstrados.

---

### 18. Registrar lacunas

Use as evidências das aulas 404 e 409.

Lacunas esperadas:

```text
segurança web;

autenticação;

autorização;

threat modeling;

secret manager;

backup e restore;

multi-instância;

alertas;

capacidade;

rollback.
```

Não classifique como falha do módulo temas planejados para módulos posteriores.

Classifique como:

```text
próxima etapa da formação.
```

---

### 19. Criar plano de revisão de sete dias

Dia 1:

```text
Spring Boot, DI, configuração e profiles.
```

Dia 2:

```text
REST, DTOs, validation e erros.
```

Dia 3:

```text
JPA, Flyway, transações e concorrência.
```

Dia 4:

```text
Redis, arquivos, scheduler, e-mail e async.
```

Dia 5:

```text
testes em camadas e Testcontainers.
```

Dia 6:

```text
Actuator, Docker, Compose e operação.
```

Dia 7:

```text
API OS completa e apresentação técnica.
```

Cada dia deve incluir:

- revisão;
- execução;
- explicação;
- uma correção ou diagnóstico.

---

### 20. Emitir a decisão

No relatório:

```markdown
## Decisão de conclusão

**CONCLUIDO_COM_RESSALVAS**

O aluno demonstrou capacidade para construir, testar, documentar
e operar localmente uma API Spring Boot com persistência,
integrações e contrato REST profissional.

As ressalvas não impedem a conclusão do M14, mas impedem declarar
o projeto pronto para produção pública. Os principais próximos
passos estão relacionados a segurança, gestão de identidade,
proteção de recursos e engenharia operacional avançada.
```

---

### 21. Registrar a ponte para o M15

```markdown
## Ponte para o M15

O próximo módulo é `Seguranca de aplicacoes Java`.

A base do M14 será reutilizada para estudar:

- segurança web;
- threat modeling;
- Spring Security;
- autenticação;
- autorização;
- proteção de endpoints;
- JWT;
- OAuth2;
- auditoria;
- testes de segurança.
```

---

### 22. Atualizar o README da formação

No README principal do projeto, adicione uma seção curta:

```markdown
## Módulo 14 concluído

O módulo de Spring Boot, REST APIs e backend profissional foi
concluído com o projeto API OS.

- [Relatório de conclusão](docs/m14/M14_COMPLETION_REPORT.md)
- [Documentação da API](docs/api/README.md)
- [API OS](docs/api/service-orders.md)
```

Não copie o relatório inteiro.

---

### 23. Atualizar o diário de bordo

Use o bloco do material complementar.

A atualização precisa registrar:

```text
M14 concluído;

gate aprovado;

ressalvas;

próximo módulo.
```

---

### 24. Fazer o commit de fechamento

Antes:

```powershell
git status
git diff
git diff --check
```

Commit:

```powershell
git commit -m "docs(m14): concluir modulo Spring Boot e APIs"
```

Depois:

```powershell
git log -1 --oneline

git status --short
```

A working tree deve ficar limpa.

---

### 25. Encerrar a stack

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Preserve volumes.

Não execute `--volumes` sem intenção.

---

## Entendendo o que foi feito

### O módulo ganhou uma conclusão formal

O encerramento não ficou implícito.

### Competências foram ligadas a evidências

Cada eixo aponta para código, testes ou artefatos.

### O projeto síntese foi valorizado

A API OS demonstra integração prática.

### As ressalvas foram preservadas

Conclusão não virou falsa prontidão de produção.

### A revisão ganhou um plano de retenção

O conteúdo será revisado por execução e explicação.

### A transição para segurança ficou natural

O M15 responde diretamente às lacunas atuais.

---

## Erros comuns importantes

### Encerrar sem executar testes

A conclusão fica baseada em memória.

### Declarar tudo dominado

Autoavaliação precisa ser honesta.

### Confundir módulo concluído com produção pronta

São decisões diferentes.

### Apagar limitações do relatório

Ressalvas orientam evolução.

### Guardar artefatos sem índice

Outra pessoa não consegue navegar.

### Fazer plano de revisão apenas teórico

Execução e diagnóstico precisam participar.

### Criar nova feature no fechamento

O objetivo é consolidar.

### Alterar migrations antigas

O encerramento não justifica quebrar histórico.

### Fazer commit com env file

Secrets locais não entram no Git.

### Pular a ponte para o próximo módulo

A formação precisa manter continuidade pedagógica.

---

## Comandos úteis

### Identificação

```powershell
git rev-parse HEAD
git log -1 --oneline
git status --short
```

### Gate final

```powershell
docker info
.\mvnw.cmd clean verify
```

### Build final

```powershell
docker build `
  --build-arg APP_VERSION="m14-final" `
  --tag "formacao-java-backend-api:m14-final" `
  .
```

### Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

### Health

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"
```

### OpenAPI

```powershell
Invoke-RestMethod `
  "http://localhost:8081/v3/api-docs"
```

### Encerrar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

---

## Exercício guiado

### Parte 1 — Inventário

Liste os dez eixos de competência.

### Parte 2 — Artefatos

Aponte a finalidade dos principais arquivos.

### Parte 3 — Gate

Execute `clean verify`, Docker e Compose.

### Parte 4 — Contrato

Valide OpenAPI e collection.

### Parte 5 — Operação

Valide health, readiness, liveness e logs.

### Parte 6 — Projeto síntese

Explique a API OS de ponta a ponta.

### Parte 7 — Avaliação

Responda os quatro blocos práticos.

### Parte 8 — Autoavaliação

Atribua notas com evidências.

### Parte 9 — Revisão

Crie o plano de sete dias.

### Parte 10 — Conclusão

Registre:

```text
M14:
CONCLUIDO_COM_RESSALVAS.

laboratório:
GO CONDICIONAL.

produção pública:
NO-GO.

próximo módulo:
M15 Segurança de aplicações Java.

próxima aula:
411 Fundamentos segurança web.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 409 foi preservada;
- fechamento formal foi realizado;
- total de 55 aulas foi registrado;
- intervalo 356 a 410 foi registrado;
- nome do módulo foi registrado;
- relatório de conclusão foi criado;
- identificação foi preenchida;
- commit foi registrado;
- working tree foi revisada;
- Java foi validado;
- Maven foi validado;
- Docker foi validado;
- dez eixos de competência foram criados;
- competências possuem evidências;
- fundamentos Spring Boot foram inventariados;
- REST foi inventariado;
- arquitetura foi inventariada;
- persistência foi inventariada;
- contratos foram inventariados;
- integrações foram inventariadas;
- testes foram inventariados;
- observabilidade foi inventariada;
- containers foram inventariados;
- projeto API OS foi inventariado;
- artefatos foram listados;
- migrations foram revisadas;
- schema por Flyway foi confirmado;
- gate Maven foi executado;
- failures são zero;
- errors são zero;
- skipped foram explicados;
- imagem final foi construída;
- Java 21 na imagem foi confirmado;
- usuário não root foi confirmado;
- Compose foi validado;
- API ficou healthy;
- PostgreSQL ficou healthy;
- Redis ficou healthy;
- liveness foi testada;
- readiness foi testada;
- health foi testado;
- info foi testado;
- OpenAPI foi validada;
- paths da API OS foram confirmados;
- ETag foi confirmado;
- If-Match foi confirmado;
- depreciação v1 foi revisada;
- collection JSON foi validada;
- runner foi executado;
- IDs foram limpos;
- ETags foram encadeados;
- secrets não foram exportados;
- documentação foi revisada;
- links foram testados;
- decisão de produção foi preservada;
- avaliação prática foi realizada;
- fluxo de request foi explicado;
- processo de filtro foi explicado;
- diagnóstico de readiness foi realizado;
- concorrência 412 versus 409 foi explicada;
- autoavaliação foi criada;
- escala de zero a quatro foi usada;
- pontos fortes possuem evidência;
- lacunas foram registradas;
- lacunas futuras não foram confundidas com falha;
- plano de sete dias foi criado;
- cada dia inclui execução;
- decisão CONCLUIDO_COM_RESSALVAS foi emitida;
- laboratório permaneceu GO condicional;
- produção pública permaneceu NO-GO;
- ponte para M15 foi criada;
- fundamentos de segurança foram citados;
- README da formação foi atualizado;
- diário de bordo foi atualizado;
- commit de fechamento foi criado;
- working tree ficou limpa;
- stack foi encerrada sem remover volumes;
- nova feature não foi criada;
- Spring Security não foi antecipado;
- threat modeling não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 411 está correta.

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
git commit -m "docs(m14): concluir modulo Spring Boot e APIs"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- target;
- env files;
- credentials;
- logs locais;
- relatórios temporários;
- dados PostgreSQL;
- uploads;
- imagens exportadas;
- secrets;
- arquivos de IDE.

---

## Fechamento e ponte para a próxima aula

O Módulo 14 está formalmente encerrado.

O percurso começou com:

```text
Spring Boot visao geral.
```

E terminou com:

```text
uma API backend estruturada,
testada,
observável,
containerizada,
documentada
e revisada.
```

Você consolidou:

```text
Spring Boot;

REST;

DTOs;

validation;

erros;

JPA;

PostgreSQL;

Flyway;

Redis;

integrações;

testes;

Actuator;

Docker;

Compose;

OpenAPI;

documentação.
```

O projeto API OS demonstrou capacidade para integrar esses conhecimentos.

A decisão de conclusão é:

```text
M14:
CONCLUIDO_COM_RESSALVAS.
```

As ressalvas não anulam o aprendizado.

Elas definem o próximo passo.

A próxima aula será:

```text
411 - M15.01 - Fundamentos seguranca web
```

O próximo módulo será:

```text
M15 - Seguranca de aplicacoes Java
```

Nele, a API construída no M14 será observada sob uma nova pergunta:

```text
quem pode acessar,
o que pode fazer,
como provar identidade
e como proteger recursos?
```

O M15 aprofundará:

- segurança como engenharia de risco;
- threat modeling;
- Spring Security;
- autenticação;
- autorização;
- password hashing;
- sessões;
- JWT;
- OAuth2;
- auditoria;
- testes de segurança.

Nenhum desses assuntos foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Executei o gate técnico final.
- [ ] Inventariei competências e artefatos.
- [ ] Concluí a avaliação prática.
- [ ] Registrei lacunas e plano de revisão.
- [ ] Encerrei o M14 e preparei o M15.

---

## Troubleshooting adicional

### O gate final falha

Não emita conclusão.

Corrija:

- teste;
- migration;
- configuração;
- container;
- contrato.

Execute novamente.

### A stack fica unhealthy

Leia logs por service.

Valide banco, Redis, migrations e properties.

### OpenAPI diverge da collection

Defina o contrato correto.

Atualize a fonte divergente e teste novamente.

### O relatório fica genérico

Adicione evidências concretas:

- arquivo;
- classe;
- teste;
- comando;
- commit.

### A autoavaliação fica toda em quatro

Reavalie por diagnóstico, não apenas execução guiada.

### O plano de revisão não cabe em sete dias

Priorize os pontos com nota menor.

Repita o ciclo depois.

### O commit final contém arquivos locais

Remova do stage, revise `.gitignore` e execute `git diff --cached`.

---

## Perguntas de revisão

1. Quantas aulas possui o M14?
2. Em qual aula ele começou?
3. Em qual aula termina?
4. Qual foi o projeto síntese?
5. O que prova competência?
6. Qual é o gate final Maven?
7. PostgreSQL foi testado com qual recurso?
8. Redis é fonte da verdade?
9. Qual é o status do M14?
10. A aplicação está pronta para produção pública?
11. Qual é o status do laboratório?
12. Qual artefato registra a conclusão?
13. Quais são os dez eixos?
14. O que a avaliação prática verifica?
15. Para que serve a autoavaliação?
16. Qual é o plano de revisão?
17. Qual é o próximo módulo?
18. Qual é a próxima aula?
19. O que ela estudará?
20. O M15 substitui o M14?

---

## Roteiro de resposta

1. 55.
2. Aula 356.
3. Aula 410.
4. API de Ordem de Serviço.
5. Implementar, testar, explicar e diagnosticar.
6. `mvnw clean verify`.
7. Testcontainers com PostgreSQL real.
8. Não.
9. CONCLUIDO_COM_RESSALVAS.
10. Não.
11. GO condicional.
12. `M14_COMPLETION_REPORT.md`.
13. Spring, REST, arquitetura, persistência, contratos, integrações, testes, observabilidade, containers e projeto.
14. Explicação, implementação, diagnóstico e concorrência.
15. Direcionar revisão.
16. Sete dias por eixos.
17. Segurança de aplicações Java.
18. Fundamentos segurança web.
19. Princípios e riscos de segurança web.
20. Não, ele protege e evolui a base.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 410 - M14.55 - Fechamento do Modulo 14 Spring Boot

- Encerrei formalmente o Módulo 14.
- Registrei que o módulo possui 55 aulas, da 356 à 410.
- Criei `docs/m14/M14_COMPLETION_REPORT.md`.
- Registrei o commit e as ferramentas utilizadas.
- Revisei a working tree.
- Organizei dez eixos de competência.
- Inventariei os artefatos do projeto.
- Revisei migrations e Flyway.
- Executei `clean verify`.
- Confirmei zero failures e errors.
- Construí a imagem final do M14.
- Confirmei Java 21 e usuário não root.
- Validei Docker Compose.
- Confirmei API, PostgreSQL e Redis healthy.
- Testei liveness, readiness, health e info.
- Validei OpenAPI e Swagger UI.
- Confirmei paths, ETag e If-Match da API OS.
- Validei a collection Postman/Insomnia.
- Executei os runners principais.
- Revisei a documentação técnica e seus links.
- Realizei a avaliação prática de explicação, filtros, diagnóstico e concorrência.
- Criei uma autoavaliação de zero a quatro.
- Registrei pontos fortes com evidências.
- Registrei lacunas conhecidas.
- Criei um plano de revisão de sete dias.
- Emitei `CONCLUIDO_COM_RESSALVAS` para o M14.
- Mantive GO condicional para laboratório controlado.
- Mantive NO-GO para produção pública.
- Atualizei o README da formação.
- Criei o commit de fechamento.
- Encerrei a stack sem remover volumes.
- Não antecipei Spring Security ou threat modeling.
- Próxima aula: 411 - M15.01 - Fundamentos seguranca web.
- Próximo módulo: Segurança de aplicações Java.
```

---

## Referência técnica curta

- [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/)
- [Spring Framework Reference](https://docs.spring.io/spring-framework/reference/)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/reference/testing/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/)
- [Docker Compose](https://docs.docker.com/compose/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

Regra final:

```text
o fechamento do M14 precisa transformar o percurso de cinquenta e cinco aulas em competências demonstráveis, artefatos navegáveis e evidências reproduzíveis; nesta baseline, o gate técnico valida testes, containers, health, contrato e documentação, a API OS funciona como projeto síntese, o módulo é registrado como CONCLUIDO_COM_RESSALVAS e a formação segue para o M15 com foco em segurança de aplicações Java.
```
