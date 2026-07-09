# Analise das grades e roteiro de continuidade pos-aula 259

Este documento compara as grades encontradas com a sequencia real gerada em `docs/aulas` e define uma estrategia segura para continuar o curso sem perder profundidade, ordem pedagogica ou qualidade.

## Atualizacao operacional final

Depois desta analise, foi criada uma grade operacional reconstruida linha a linha:

```text
docs/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA.csv
```

Ela deve ser usada junto com:

```text
docs/ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md
docs/PROMPT_MESTRE_CONTINUAR_CURSO_JAVA.md
```

Estado da grade reconstruida:

```text
721 linhas;
intervalo 000 a 720;
260 aulas concluidas ja geradas;
461 aulas planejadas reconstruidas;
nenhum numero faltando;
nenhum numero duplicado.
```

As faixas sugeridas mais abaixo neste documento explicam o raciocinio pedagogico da reconciliacao. Para operacao aula a aula, nomes de arquivos e status de cada aula, usar a CSV reconstruida como fonte final.

## Resumo da decisao

A fonte da verdade deve continuar sendo a pasta:

```text
docs/aulas
```

As grades CSV sao fontes auxiliares, nao podem sobrescrever a sequencia real ja produzida.

A melhor grade para entender a continuidade historica ate o inicio do M5 e:

```text
C:\Users\win\Downloads\grade_atualizada_curso_java_backend_thiago_ate_aula_145.csv
```

Porem, ela ficou desatualizada depois do inicio do M5, porque o curso real ficou mais profundo e separou assuntos que antes estavam agrupados.

A melhor grade para usar como checklist de cobertura avancada e:

```text
C:\Users\win\Downloads\GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv
```

Ela nao bate com a numeracao real, mas contem lacunas importantes de nivel engenheiro/arquiteto, como:

```text
SCA;
SBOM;
Dependabot;
supply chain;
versionamento de APIs;
OpenAPI contract-first;
release strategies;
blue-green;
canary;
rollback;
migracao de banco sem downtime;
JFR;
JMC;
capacity planning;
fitness functions arquiteturais;
Strangler Fig;
narrativa tecnica de portfolio.
```

Portanto, a estrategia correta e:

```text
1. Preservar integralmente as aulas 000-259.
2. Continuar do ponto real: aula 260.
3. Nao voltar para a numeracao antiga das grades.
4. Reconciliar as grades em uma nova linha mestra.
5. Usar a V5 operacional como checklist de cobertura, nao como ordem literal.
```

---

## Comparacao objetiva das grades

### Grade 1: `grade_atualizada_curso_java_backend_thiago_ate_aula_145.csv`

Resultado contra os arquivos reais:

```text
Linhas da grade: 531
Comparadas contra aulas existentes: 260
Matches exatos: 157
Percentual exato: 60,4%
Primeira divergencia: aula 157
```

Primeira divergencia:

```text
Grade:
157_M5_12_CRUD_COM_HASHMAP_OFICIAL.md

Real:
157_M5_12_HASHMAP_OPERACOES_ESSENCIAIS_OFICIAL.md
```

Leitura correta:

```text
Essa grade bate muito bem ate a aula 156.
A divergencia da aula 157 ainda e pequena e semantica.
Depois disso, o curso real mudou a organizacao e ganhou profundidade.
```

Ela planejava:

```text
M5 - Collections, Generics, Streams e Java moderno
M6 - Codigo limpo, SOLID, refatoracao e Design Patterns
M7 - Maven, Git profissional, qualidade e testes
M8 - SQL, PostgreSQL e modelagem relacional
M9 - JDBC, JPA, Hibernate e Spring Data
M10 - Spring Boot e APIs REST profissionais
M11 - Seguranca
M12 - Integracoes e mensageria
M13 - Docker, CI/CD, Kubernetes e Cloud
M14 - Observabilidade, performance, concorrencia e producao
M15 - Arquitetura, DDD, sistemas distribuidos e lideranca tecnica
M16 - Projeto final, carreira e entrevistas
```

Mas o curso real fez algo melhor:

```text
M5 - Collections
M6 - Generics e Optional
M7 - Functional Interfaces, Lambdas e Streams
M8 - Exceptions, I/O, CSV, Date/Time e utilitarios
M9 - SOLID
M10 - Design Patterns
M11 - Ferramentas, testes, qualidade e Docker
```

Conclusao:

```text
Grade muito confiavel como historico ate o inicio do M5.
Nao deve ser seguida literalmente depois da aula 156.
Deve ser usada como fonte de topicos futuros, nao como numeracao.
```

---

### Grade 2: `GRADE_MENTORADA_PROPOSTA_A_AGRUPADA_AUDITAVEL.csv`

Resultado contra os arquivos reais:

```text
Linhas da grade: 538
Matches exatos contra aulas existentes: 15
Matches normalizados: 111
Percentual normalizado: 42,9%
Primeira divergencia normalizada: aula 28
```

Primeira divergencia normalizada:

```text
Grade:
028_M1_08_CHAR_UNICODE_E_TEXTO_INICIAL.md

Real:
028_M1_08_CHAR_E_STRING_EM_USO_INICIAL_OFICIAL.md
```

Leitura correta:

```text
Essa grade representa uma proposta agrupada antiga.
Ela acerta varios macrotemas, mas diverge cedo em titulos, agrupamentos e modulo M4.
```

Ponto util:

```text
Ela confirma a macrotrilha longa:
SQL -> Persistencia -> Spring Boot -> Seguranca -> Integracoes -> Docker/Cloud -> Observabilidade -> Arquitetura -> Projeto final.
```

Conclusao:

```text
Boa como mapa macro.
Ruim como continuidade literal.
Nao usar para escolher o proximo arquivo.
```

---

### Grade 3: `GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv`

Resultado contra os arquivos reais:

```text
Linhas da grade: 556
Matches exatos contra aulas existentes: 1
Primeira divergencia: aula 1
```

Primeira divergencia:

```text
Grade:
001_COMO_ESTUDAR_ESTA_FORMACAO_SEM_SE_PERDER_E_SEM_VIRAR_COLECIONADOR_DE_AULAS.md

Real:
001_M0_01_MAPA_DA_FORMACAO_COMPLETA_E_NIVEIS_DE_CARREIRA_JAVA.md
```

Leitura correta:

```text
Essa grade e uma V5 operacional com prologo mentorado e outra numeracao.
Ela nao e a trilha que foi efetivamente gerada em docs/aulas.
```

Ponto util:

```text
Ela e a grade mais rica como auditoria de cobertura.
Ela contem topicos que elevam o curso para nivel engenheiro/arquiteto.
```

Conclusao:

```text
Nao usar como numeracao.
Usar como checklist de lacunas avancadas.
```

---

## Estado real atual do curso

Arquivos reais em `docs/aulas`:

```text
260 arquivos fisicos;
260 aulas logicas;
sem duplicata fisica no estado atual;
nenhum numero faltando de 000 a 259;
ultima aula valida: 259_M11_15_DOCKER_JAVA_BACKEND_CONTAINERS_IMAGENS_DOCKERFILE_COMPOSE_OFICIAL.md.
```

Observacao:

```text
Durante a auditoria apareceu referencia a uma duplicata antiga da aula 191 com sufixo "(1)".
No estado atual da pasta docs/aulas, essa duplicata nao existe fisicamente.
O Git ainda pode mostrar a remocao desse arquivo duplicado se ele era rastreado antes.
Isso nao afeta a continuidade: a aula valida 191 e a sem sufixo.
```

Sequencia real:

```text
000      Abertura
001-020  M0  Ambiente, metodo e ferramentas
021-061  M1  Fundamentos absolutos Java
062-089  M2  Java Core profundo
090-104  M3  Organizacao procedural
105-145  M4  Orientacao a Objetos e dominio
146-171  M5  Collections Framework
172-185  M6  Generics e Optional
186-200  M7  Functional Interfaces, Lambdas e Streams
201-214  M8  Exceptions, I/O, CSV, Date/Time e utilitarios
215-222  M9  SOLID
223-244  M10 Design Patterns
245-259  M11 Ferramentas Java Backend profissional, testes, qualidade e Docker
```

Ponto exato de continuidade:

```text
260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md
```

Titulo:

```text
# 260 — M11.16 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend
```

---

## Por que nao seguir a grade antiga literalmente

Se o curso voltasse para a grade antiga a partir da aula 260, aconteceria isto:

```text
Grade antiga diria que a aula 260 e SQL/modelagem ou persistencia.
Mas a aula real 259 acabou prometendo Docker Compose profissional.
```

Isso quebraria:

```text
a promessa feita no fechamento da aula 259;
a continuidade do M11;
a preparacao para Spring Boot;
o raciocinio progressivo de ferramentas -> ambiente local -> CI -> banco -> persistencia -> API.
```

O caminho correto e:

```text
terminar M11 com ferramentas profissionais;
depois iniciar SQL/PostgreSQL em novo modulo;
depois persistencia;
depois Spring Boot.
```

---

## Lacunas reais ainda nao geradas

### Parcialmente coberto no M11 atual

Ja foi gerado:

```text
JDK/JVM/JRE/bytecode/classpath;
Maven;
Gradle;
Git profissional;
IDE/terminal/debugging;
JUnit 5;
JUnit 5 avancado;
Mockito;
Mockito avancado;
AssertJ;
TDD;
JaCoCo;
SonarQube;
Docker basico para Java Backend.
```

Ainda falta para fechar M11 com qualidade de engenheiro:

```text
Docker Compose profissional;
PostgreSQL + Redis em stack local;
redes, volumes e healthchecks;
CI/CD conceitual;
GitHub Actions;
pipeline Maven;
pipeline Docker;
quality gate em pipeline;
Checkstyle ou Spotless;
seguranca de dependencias;
SCA;
SBOM;
Dependabot;
supply chain;
Testcontainers;
WireMock;
testes de contrato introdutorios;
ArchUnit;
regras arquiteturais automatizadas iniciais;
mini-projeto integrando ferramentas, qualidade, Docker e CI.
```

### Ainda nao gerado como modulo completo

```text
SQL e PostgreSQL profundo;
modelagem relacional;
JDBC;
JPA;
Hibernate;
Spring Data;
Spring Boot REST;
seguranca com Spring Security/JWT/OAuth2;
integracoes HTTP externas;
mensageria RabbitMQ/Kafka;
resiliencia;
DevOps/cloud/Kubernetes;
observabilidade;
performance;
concorrencia;
arquitetura;
DDD;
sistemas distribuidos;
projeto final;
carreira;
entrevista;
portfolio.
```

---

## Grade-mestra reconciliada sugerida

Esta e a nova linha mestra sugerida, respeitando o que ja foi gerado.

### M11 - Ferramentas essenciais do Java Backend profissional

Continuar a partir da aula 260 e fechar o modulo com ferramentas, qualidade, Docker e CI.

```text
260 M11.16 Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend
261 M11.17 CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos
262 M11.18 Pipeline Maven com testes, JaCoCo, relatorios e artefatos
263 M11.19 Pipeline Docker: build, tags, registry, secrets e imagem versionada
264 M11.20 Checkstyle, Spotless e formatacao automatizada com criterio
265 M11.21 Seguranca de dependencias: SCA, SBOM, Dependabot e supply chain
266 M11.22 Testcontainers com PostgreSQL: testes de integracao reais e descartaveis
267 M11.23 WireMock, contratos HTTP e servicos externos fake
268 M11.24 ArchUnit e regras arquiteturais automatizadas iniciais
269 M11.25 Mini-projeto ferramentas: Maven, testes, qualidade, Docker Compose e CI
270 M11.26 Fechamento do Modulo 11: ferramentas profissionais e transicao para SQL
```

Observacao:

```text
WireMock, contratos e ArchUnit devem ser introdutorios aqui.
Eles poderao voltar com mais profundidade em integracoes e arquitetura.
```

---

### M12 - SQL, PostgreSQL e modelagem relacional

Objetivo:

```text
fazer o aluno sair de "sei rodar SELECT" para "sei modelar, consultar, diagnosticar e raciocinar sobre banco relacional em backend".
```

Topicos obrigatorios:

```text
banco relacional e PostgreSQL;
psql/DBeaver com criterio;
schemas;
tipos de dados;
DDL;
CREATE TABLE;
constraints;
PK/FK;
UNIQUE;
CHECK;
NOT NULL;
INSERT;
UPDATE;
DELETE;
SELECT;
WHERE;
ORDER BY;
LIMIT/OFFSET;
JOIN inner/left;
GROUP BY/HAVING;
subqueries;
CTE;
views;
modelagem conceitual;
modelagem logica;
modelagem fisica;
normalizacao;
relacionamento 1:N;
relacionamento N:N;
indices;
EXPLAIN;
EXPLAIN ANALYZE;
transacoes ACID;
isolamento;
locks;
deadlocks;
paginacao SQL;
migracoes conceituais;
scripts versionados;
carga de massa;
backup/restore basico;
projeto modelo OS em PostgreSQL.
```

Faixa sugerida:

```text
271-304
```

---

### M13 - Persistencia Java: JDBC, JPA, Hibernate e Spring Data

Objetivo:

```text
conectar Java com banco de dados sem magia, antes de depender cegamente do Spring.
```

Topicos obrigatorios:

```text
JDBC visao geral;
driver PostgreSQL;
Connection;
PreparedStatement;
ResultSet;
SQL Injection;
DAO;
Repository;
tratamento de exceptions em persistencia;
transacoes com JDBC;
connection pool conceitual;
HikariCP conceitual;
Flyway;
JPA conceitos fundamentais;
Hibernate como implementacao;
@Entity;
@Id;
@GeneratedValue;
@Column;
ciclo de vida da entidade;
persistence context;
dirty checking;
flush;
relacionamento ManyToOne;
relacionamento OneToMany;
ManyToMany com criterio;
cascade;
fetch lazy/eager;
problema N+1;
JPQL;
Criteria;
Specifications;
projections;
paginacao com JPA;
lock otimista;
lock pessimista;
auditoria;
Spring Data Repository;
queries derivadas;
@Query;
projeto persistencia OS.
```

Faixa sugerida:

```text
305-342
```

---

### M14 - Spring Boot, REST APIs e backend profissional

Objetivo:

```text
transformar a base Java, SQL, persistencia, testes e arquitetura inicial em API profissional.
```

Topicos obrigatorios:

```text
Spring Boot visao geral;
Spring Initializr;
estrutura de projeto;
application.properties;
application.yml;
profiles;
beans;
injecao de dependencia;
ciclo de vida de beans;
auto configuration;
controllers REST;
request body;
response body;
ResponseEntity;
HTTP e REST de verdade;
DTO request/response;
mappers manuais;
Bean Validation;
validacoes customizadas;
service layer;
repository layer;
@Transactional;
exception handler global;
Problem Details / padrao de erro;
CRUD completo;
PUT vs PATCH;
paginacao e ordenacao;
filtros dinamicos;
OpenAPI/Swagger;
OpenAPI contract-first;
governanca de contrato;
versionamento de APIs;
compatibilidade retroativa;
estrategia de depreciacao;
logging em APIs;
filters;
interceptors;
eventos internos Spring;
async;
cache com Spring/Redis;
rate limiting;
upload/download;
scheduler;
testes de controller;
testes de integracao Spring;
projeto API REST de OS.
```

Faixa sugerida:

```text
343-389
```

---

### M15 - Seguranca de aplicacoes Java

Objetivo:

```text
fazer o aluno entender seguranca como engenharia de risco, nao apenas configuracao de framework.
```

Topicos obrigatorios:

```text
fundamentos de seguranca web;
threat modeling inicial;
OWASP Top 10 aplicado;
CORS;
CSRF;
security headers;
BCrypt;
hash de senha;
Spring Security arquitetura;
login basico;
usuario em memoria;
JWT profundo;
refresh token;
roles;
authorities;
method security;
autorizacao por regra de negocio;
OAuth2;
OpenID Connect;
PKCE;
Keycloak;
secrets management;
auditoria;
LGPD para backend;
multi-tenancy seguranca;
testes de seguranca;
projeto API segura.
```

Faixa sugerida:

```text
390-424
```

---

### M16 - Integracoes, mensageria, eventos e resiliencia

Objetivo:

```text
preparar o aluno para sistemas que conversam com outros sistemas e falham de formas reais.
```

Topicos obrigatorios:

```text
consumo de APIs externas;
RestClient;
WebClient;
timeouts;
retry com backoff;
circuit breaker;
bulkhead;
fallback;
idempotencia em APIs;
webhooks;
SOAP;
XML;
CSV;
SFTP;
jobs batch;
RabbitMQ;
Kafka;
Rabbit vs Kafka;
eventos de dominio;
schema evolution;
Schema Registry conceitual;
poison message;
retry e DLQ profissional;
deduplicacao;
outbox pattern;
inbox pattern;
saga;
CDC;
microsservicos vs monolito modular;
contratos de integracao;
testes de integracao externa;
projeto mensageria corporativa.
```

Faixa sugerida:

```text
425-462
```

---

### M17 - DevOps, CI/CD, Kubernetes e Cloud

Objetivo:

```text
levar o aluno de "roda local" para "entende entrega, deploy, container, pipeline e operacao em ambiente real".
```

Como Docker basico ja entrou no M11, este modulo deve evitar repeticao e aprofundar:

```text
imagem segura;
multi-stage build aplicado a Spring Boot;
Docker Compose para ambientes de API;
variaveis e secrets;
GitHub Actions avancando alem do basico;
pipeline Maven;
pipeline Docker;
quality gate em pipeline;
estrategias de release;
feature flags;
blue-green;
canary;
rollback;
deploy com migracao de banco sem downtime;
Kubernetes fundamentos;
Pod;
Deployment;
Service;
Ingress;
probes;
requests e limits;
HPA;
ConfigMap;
Secret;
Helm conceitual;
cloud concepts;
AWS visao backend;
RDS PostgreSQL;
SQS/SNS;
custos cloud;
projeto API pronta para deploy.
```

Faixa sugerida:

```text
463-500
```

---

### M18 - Observabilidade, performance, concorrencia e producao

Objetivo:

```text
ensinar o aluno a operar, diagnosticar e melhorar sistemas em producao.
```

Topicos obrigatorios:

```text
logs estruturados;
correlationId;
traceId;
Actuator;
Micrometer;
golden signals;
SLI;
SLO;
SLA;
Prometheus;
Grafana;
OpenTelemetry;
tracing distribuido;
alertas;
runbooks;
postmortem;
troubleshooting por logs;
thread dump;
heap dump;
GC logs;
JVM tuning basico;
profiling com JFR;
JMC;
analise de gargalos;
performance de API;
performance de banco;
load testing;
HikariCP;
cache com criterio;
capacity planning;
orcamento de performance;
leitura de saturacao;
concorrencia Java classica;
ExecutorService;
CompletableFuture;
virtual threads;
race condition;
projeto API observavel e otimizada.
```

Faixa sugerida:

```text
501-538
```

---

### M19 - Arquitetura, DDD, sistemas distribuidos e lideranca tecnica

Objetivo:

```text
formar raciocinio de engenheiro/arquiteto: fronteiras, trade-offs, evolucao, comunicacao e decisao tecnica.
```

Topicos obrigatorios:

```text
arquitetura em camadas;
Clean Architecture;
arquitetura hexagonal;
ports and adapters;
monolito modular;
DDD fundamentos;
DDD estrategico;
DDD tatico;
entidade;
value object;
aggregate;
aggregate root;
repository em DDD;
domain service;
application service/use case;
domain events;
bounded context;
context map;
anti-corruption layer;
event storming;
CQRS;
Event Sourcing conceitual;
arquitetura orientada a eventos;
CAP;
PACELC;
consistencia eventual;
design de sistemas;
escalabilidade;
resiliencia arquitetural;
multi-tenancy arquitetura;
fitness functions arquiteturais;
evolucao controlada da arquitetura;
modernizacao de legado;
Strangler Fig;
ADR;
RFC tecnico;
C4 Model;
code review como lideranca;
comunicacao tecnica;
desenho arquitetural do projeto final.
```

Faixa sugerida:

```text
539-585
```

---

### M20 - Projeto final, carreira, entrevistas e defesa tecnica

Objetivo:

```text
consolidar tudo em um projeto defensavel, com portfolio e narrativa tecnica.
```

Topicos obrigatorios:

```text
definicao do projeto final;
backlog;
escopo funcional;
modelagem de dominio;
modelagem de banco;
implementacao do dominio;
casos de uso;
API REST;
persistencia;
seguranca;
integracoes;
mensageria;
observabilidade;
Docker;
CI/CD;
documentacao OpenAPI;
README profissional;
C4;
ADRs;
Postman Collection;
deploy ou simulacao;
correcao tecnica final;
narrativa tecnica de portfolio;
defesa de decisoes de engenharia;
LinkedIn;
GitHub;
curriculo Java Backend;
entrevista Java;
entrevista Spring/JPA;
entrevista banco/SQL;
entrevista arquitetura;
live coding;
como ensinar o que aprendeu;
banca final.
```

Faixa sugerida:

```text
586-620
```

---

## Regra de qualidade para todas as proximas aulas

Cada aula nova deve manter o padrao recente:

```text
1. Objetivo claro.
2. Reforco do objetivo maior.
3. Contexto da aula anterior.
4. Partes numeradas.
5. Conceito antes da ferramenta.
6. Exemplo minimo.
7. Exemplo aplicado ao backend.
8. Laboratorio em labs/<modulo>/aula-<numero>-<tema>.
9. Codigo executavel quando fizer sentido.
10. Erros comuns.
11. Troubleshooting.
12. Checklist.
13. Registro rapido da aula.
14. Exercicio pratico principal.
15. Desafio extra.
16. Simulado rapido.
17. Gabarito.
18. Commit recomendado.
19. Fechamento com ponte para a proxima aula.
```

Regra de maturidade:

```text
nao basta ensinar "como faz";
cada aula deve ensinar "por que existe", "quando usar", "quando evitar", "como diagnosticar" e "como isso aparece em empresa".
```

---

## Prompt atualizado de continuidade

Use este prompt no novo chat depois de anexar ou disponibilizar este documento e a pasta `docs/aulas`:

```text
Voce vai continuar uma formacao Java Backend longa e profunda.

A fonte da verdade e a pasta docs/aulas, nao as grades CSV antigas.

As grades CSV devem ser usadas assim:
- grade_atualizada_curso_java_backend_thiago_ate_aula_145.csv: historico mais fiel ate o inicio do M5 e fonte de macroplanejamento antigo.
- GRADE_MENTORADA_PROPOSTA_A_AGRUPADA_AUDITAVEL.csv: mapa macro auxiliar.
- GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv: checklist de cobertura avancada, nao numeracao real.

Estado real:
- Aulas reais: 000 a 259.
- Nao ha duplicata fisica no estado atual da pasta docs/aulas.
- Ultima aula valida: 259_M11_15_DOCKER_JAVA_BACKEND_CONTAINERS_IMAGENS_DOCKERFILE_COMPOSE_OFICIAL.md.
- A proxima aula deve ser a 260.
- Modulo atual: M11 — Ferramentas essenciais do Java Backend profissional.
- Nao iniciar SQL ainda.
- Nao pular para Spring Boot ainda.

Gere somente a aula:
260_M11_16_DOCKER_COMPOSE_PROFISSIONAL_POSTGRESQL_REDIS_REDES_VOLUMES_HEALTHCHECK_AMBIENTE_LOCAL_BACKEND_OFICIAL.md

H1:
# 260 — M11.16 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend

Ela deve continuar diretamente a aula 259, que terminou prometendo Docker Compose profissional.

Depois dela, seguir o roteiro reconciliado:
261 CI/CD e GitHub Actions;
262 Pipeline Maven;
263 Pipeline Docker;
264 Checkstyle/Spotless;
265 SCA/SBOM/Dependabot/supply chain;
266 Testcontainers;
267 WireMock;
268 ArchUnit;
269 Mini-projeto ferramentas;
270 Fechamento do M11.

Nao renumerar aulas antigas.
Nao alterar nomes antigos.
Nao usar a numeracao das grades antigas.
Nao gerar varias aulas de uma vez.
```

---

## Observacao operacional importante

No momento da analise, os arquivos `246` a `259` aparecem como nao rastreados no Git.

Isso nao invalida a sequencia, mas antes de pedir para outro chat continuar e recomendavel garantir que esses arquivos estejam salvos, versionados ou claramente disponiveis no contexto.

O risco seria um novo chat olhar apenas o Git versionado e achar que o curso parou na aula 245.

Regra:

```text
o novo chat deve olhar a pasta de arquivos atual, nao apenas commits antigos.
```
