# 270 — M11.26 — Fechamento do M11 e transição para SQL, PostgreSQL e modelagem relacional

## 1. Objetivo da aula

Na aula 269, você consolidou as principais ferramentas do M11 em um mini-projeto.

Você juntou:

```text
Maven;
JUnit;
Mockito;
AssertJ;
JaCoCo;
Spotless;
Checkstyle;
CycloneDX;
Docker;
GitHub Actions;
Testcontainers;
WireMock;
ArchUnit.
```

Você criou um projeto com:

```text
camadas;
domínio;
service;
repository JDBC;
cliente externo HTTP;
teste unitário;
teste de integração com banco real;
teste de contrato HTTP fake;
teste arquitetural;
pipeline;
artifacts;
Docker build.
```

Agora vamos fechar o M11.

Esta aula não é para empilhar mais uma ferramenta.

Esta aula é para organizar tudo que você aprendeu, entender por que cada ferramenta existe e preparar a transição para o próximo grande bloco da formação:

```text
M12 — SQL, PostgreSQL e modelagem relacional
```

O objetivo desta aula é fazer você parar e enxergar o mapa.

Ao final desta aula, você deve conseguir:

```text
explicar o papel do M11 na formação Java Backend;
entender como Maven, Git, testes, Docker e CI/CD se conectam;
entender como ferramentas de qualidade reduzem risco;
entender como Testcontainers e WireMock elevam testes de integração;
entender como ArchUnit protege arquitetura;
entender como SBOM, SCA e Dependabot entram na governança;
entender o que você já consegue fazer depois do M11;
entender o que ainda falta para ser backend pleno, sênior e arquiteto;
entender por que o próximo módulo precisa ser SQL e PostgreSQL;
preparar mentalmente a entrada em modelagem relacional;
conectar ferramentas do M11 com banco de dados, persistência e Spring Boot no futuro.
```

Esta aula fecha oficialmente o M11.

A próxima aula iniciará o M12.

---

## 2. Onde estamos na formação

Você está em uma formação progressiva para sair de uma base de Java e avançar rumo a:

```text
Java Backend Developer;
Java Backend Pleno;
Java Backend Sênior;
Engenheiro Java;
Arquiteto Java.
```

Até aqui, você passou por muitos blocos importantes:

```text
Java fundamentos;
Java Core;
métodos;
organização procedural;
orientação a objetos;
Collections;
Generics;
Optional;
Lambdas;
Streams;
Exceptions;
I/O;
Date/Time;
SOLID;
Design Patterns;
ferramentas profissionais.
```

O M11 foi o módulo de ferramentas essenciais.

Ele não foi um módulo de regra de negócio.

Ele não foi um módulo de framework.

Ele não foi um módulo de banco profundo.

Ele foi o módulo que ensina o ecossistema mínimo que um backend profissional precisa conhecer para trabalhar em time.

A ideia do M11 foi responder:

```text
como um projeto Java profissional é construído, testado, empacotado, validado, padronizado e protegido?
```

Agora que essa base existe, podemos entrar em banco de dados com muito mais maturidade.

---

## 3. O que o M11 construiu em você

O M11 não ensinou apenas comandos.

Ele construiu mentalidade.

Antes, um iniciante pode pensar assim:

```text
se o código roda na minha máquina, está bom.
```

Depois do M11, sua visão precisa ser outra:

```text
o código precisa compilar em ambiente limpo;
os testes precisam passar;
a cobertura precisa ser medida;
o padrão de código precisa ser automatizado;
a arquitetura precisa ser protegida;
as dependências precisam ser monitoradas;
o ambiente local precisa ser reproduzível;
a imagem Docker precisa ser rastreável;
o pipeline precisa gerar evidências;
integrações precisam ser testadas de forma confiável;
o Pull Request precisa ser validado antes de entrar na branch principal.
```

Essa mudança é muito importante.

Ela separa o dev que só escreve código do profissional que participa de engenharia de software.

---

## 4. Recapitulando as aulas do M11

### 4.1 Aula 245 em diante: entrada nas ferramentas profissionais

O M11 começou preparando o terreno para ferramentas que sustentam projetos reais.

A ideia foi mostrar que backend profissional não é apenas linguagem.

Um backend real envolve:

```text
build;
dependências;
versionamento;
testes;
qualidade;
automação;
containers;
pipeline;
segurança;
arquitetura;
integrações.
```

Essa visão é essencial para senioridade.

---

### 4.2 Maven e Gradle

Você estudou ferramentas de build.

O papel delas é:

```text
gerenciar dependências;
compilar projeto;
rodar testes;
empacotar aplicação;
executar plugins;
padronizar ciclo de build;
integrar com CI/CD.
```

No mundo Java Backend, Maven e Gradle aparecem o tempo todo.

Mesmo que uma empresa use Gradle, entender Maven ajuda muito.

Mesmo que uma empresa use Maven, entender a ideia de build ajuda a entender Gradle.

A habilidade principal não é decorar XML ou DSL.

A habilidade principal é entender:

```text
como o projeto nasce, compila, testa e gera artefato.
```

---

### 4.3 Git profissional

Você já vinha usando Git, mas o M11 reforçou a visão profissional.

Git não é apenas:

```bash
git add
git commit
git push
```

Git em time envolve:

```text
branch;
commit claro;
Pull Request;
histórico;
review;
merge;
conflito;
branch principal protegida;
pipeline em PR;
rastreabilidade.
```

No backend real, Git é a espinha dorsal da colaboração.

---

### 4.4 JUnit, Mockito e AssertJ

Você consolidou testes automatizados.

Cada ferramenta tem papel:

```text
JUnit:
estrutura e execução dos testes.

Mockito:
simulação de dependências Java.

AssertJ:
assertions mais expressivas e legíveis.
```

Você aprendeu que teste não é só provar que algo funciona.

Teste serve para:

```text
documentar comportamento;
reduzir medo de mudar;
proteger regra de negócio;
facilitar refatoração;
evitar regressão;
dar evidência no pipeline.
```

Essa visão será indispensável nos próximos módulos.

---

### 4.5 TDD

Você também passou por TDD.

TDD não é religião.

TDD é técnica.

Ele ajuda a pensar em:

```text
comportamento antes da implementação;
design orientado por teste;
feedback rápido;
código mais testável;
regras mais claras.
```

Mesmo quando você não seguir TDD formalmente, entender o ciclo ajuda:

```text
red;
green;
refactor.
```

---

### 4.6 JaCoCo

JaCoCo trouxe a ideia de cobertura.

Cobertura não garante qualidade absoluta.

Mas ajuda a responder:

```text
quais partes do código foram exercitadas pelos testes?
existem classes sem teste?
existem branches não cobertos?
a cobertura caiu?
```

Você aprendeu que cobertura é indicador, não troféu.

O importante é combinar:

```text
cobertura;
qualidade dos testes;
regra de negócio;
risco;
criticidade.
```

---

### 4.7 SonarQube introdutório

O M11 também abriu a porta para análise estática e qualidade contínua.

SonarQube, SonarCloud e ferramentas similares ajudam a identificar:

```text
bugs;
code smells;
vulnerabilidades;
duplicação;
complexidade;
cobertura;
quality gate.
```

Você não precisa virar especialista nisso agora.

Mas precisa entender que projetos maduros usam ferramentas para medir qualidade continuamente.

---

## 5. Docker, Docker Compose e ambiente local

### 5.1 O que Docker resolveu

Docker ajudou a resolver o clássico:

```text
na minha máquina funciona.
```

Você aprendeu:

```text
imagem;
container;
Dockerfile;
build;
run;
portas;
variáveis;
volumes;
redes;
.dockerignore;
multi-stage build.
```

O ganho principal é reprodutibilidade.

Com Docker, você consegue empacotar ambiente de execução.

---

### 5.2 Docker Compose profissional

Na aula 260, você montou um ambiente com:

```text
PostgreSQL;
Redis;
Adminer;
Redis Commander;
.env.example;
.gitignore;
rede dedicada;
volumes nomeados;
bind mount de scripts SQL;
healthcheck;
depends_on com service_healthy.
```

Isso foi muito importante para a próxima fase.

Por quê?

Porque no M12 você vai estudar PostgreSQL de verdade.

E já sabe subir um PostgreSQL local de forma profissional.

Você não depende mais apenas de instalação manual.

Você entende:

```text
localhost vs nome do serviço;
volume;
reset controlado;
healthcheck;
scripts de inicialização;
o que versionar e o que não versionar.
```

---

### 5.3 Docker no pipeline

Na aula 263, você conectou Docker com CI/CD.

Você viu:

```text
build de imagem no pipeline;
tags;
registry;
GitHub Container Registry;
GITHUB_TOKEN;
packages: write;
metadata-action;
build-push-action;
latest;
sha;
branch;
PR.
```

Você aprendeu uma regra profissional:

```text
imagem precisa ser rastreável.
```

Não basta criar imagem.

Você precisa saber:

```text
qual commit gerou essa imagem?
qual branch?
qual versão?
foi publicada?
foi apenas validada?
```

---

## 6. CI/CD e GitHub Actions

### 6.1 O que CI/CD trouxe para sua formação

CI/CD trouxe automação e disciplina.

Você aprendeu:

```text
workflow;
gatilho;
push;
pull_request;
workflow_dispatch;
job;
runner;
step;
action;
checkout;
setup-java;
permissões mínimas.
```

Mais importante que YAML, você entendeu a ideia:

```text
mudança de código deve gerar validação automática.
```

Isso muda a qualidade do time.

---

### 6.2 Pipeline Maven

Na aula 262, você saiu de:

```bash
mvn clean test
```

para:

```bash
mvn clean verify
```

E começou a gerar:

```text
relatórios Surefire;
relatório JaCoCo;
JAR;
artifacts.
```

Isso ensinou que pipeline não é só passar ou falhar.

Pipeline profissional gera evidência.

---

### 6.3 Artifacts

Artifacts são importantes porque o runner do CI é descartável.

Se você não publicar relatórios, eles somem.

Você publicou:

```text
relatórios de teste;
relatórios de cobertura;
SBOM;
JAR.
```

Em projetos reais, artifacts ajudam em:

```text
diagnóstico;
auditoria;
releases;
rastreabilidade;
análise de qualidade;
entrega.
```

---

## 7. Qualidade automatizada

### 7.1 Spotless

Spotless automatizou formatação.

Você aprendeu:

```text
spotless:check;
spotless:apply;
googleJavaFormat;
remoção de imports não usados;
newline final;
pipeline validando formatação.
```

Regra importante:

```text
dev roda apply;
pipeline roda check.
```

---

### 7.2 Checkstyle

Checkstyle trouxe validação de estilo e convenção.

Você viu regras como:

```text
evitar wildcard import;
evitar import não usado;
nomes;
chaves obrigatórias;
newline final;
uma classe top-level por arquivo.
```

O objetivo não é burocracia.

O objetivo é reduzir ruído e padronizar o time.

---

### 7.3 Code review melhor

Com Spotless e Checkstyle, o code review humano pode focar em:

```text
regra de negócio;
design;
testes;
risco;
arquitetura;
performance;
segurança.
```

E não em:

```text
espaço;
indentação;
import;
linha em branco.
```

Isso é maturidade de time.

---

## 8. Segurança de dependências e supply chain

### 8.1 Dependências são parte do sistema

Na aula 265, você estudou que o sistema não é só seu código.

Ele inclui:

```text
bibliotecas;
plugins Maven;
actions do GitHub;
imagens Docker;
registries;
ferramentas de build;
pipeline.
```

Esse conjunto forma a cadeia de fornecimento de software.

---

### 8.2 SCA

SCA significa:

```text
Software Composition Analysis
```

A ideia é analisar os componentes usados no software.

Você entendeu:

```text
dependência direta;
dependência transitiva;
vulnerabilidade;
CVE;
severidade;
falso positivo;
risco contextual.
```

---

### 8.3 SBOM

SBOM significa:

```text
Software Bill of Materials
```

É o inventário de componentes do software.

Você gerou SBOM com CycloneDX:

```text
bom.json;
bom.xml.
```

Isso prepara você para cenários de auditoria, segurança e governança.

---

### 8.4 Dependabot

Dependabot ajuda a manter dependências atualizadas.

Você configurou:

```text
Maven;
GitHub Actions.
```

Mas aprendeu que Dependabot não é piloto automático.

Cada PR precisa ser avaliado com critério.

---

## 9. Testes de integração profissionais

### 9.1 Testcontainers

Testcontainers resolveu o problema de testar com infraestrutura real sem depender de ambiente manual.

Você usou:

```text
PostgreSQLContainer;
@Testcontainers;
@Container;
getJdbcUrl;
getUsername;
getPassword;
JDBC;
banco descartável.
```

Isso será essencial nos próximos módulos.

Por quê?

Porque você vai estudar:

```text
SQL;
PostgreSQL;
JDBC;
JPA;
Hibernate;
Spring Data;
Spring Boot.
```

E vai precisar testar persistência de forma confiável.

---

### 9.2 WireMock

WireMock resolveu outro problema:

```text
como testar cliente HTTP sem depender de API externa real?
```

Você aprendeu:

```text
@WireMockTest;
WireMockRuntimeInfo;
stubFor;
verify;
status 200;
404;
500;
timeout;
headers;
JSON fake.
```

Isso prepara integrações futuras com:

```text
APIs externas;
webhooks;
serviços internos;
clientes HTTP;
resiliência.
```

---

### 9.3 Camadas de teste

Depois do M11, você já entende que uma boa estratégia de testes tem camadas:

```text
teste unitário;
teste de integração com banco;
teste de integração HTTP fake;
teste arquitetural;
teste de pipeline;
validação de qualidade.
```

Cada tipo de teste responde uma pergunta diferente.

---

## 10. Proteção arquitetural

### 10.1 ArchUnit

ArchUnit trouxe a ideia de teste arquitetural.

Você aprendeu a proteger:

```text
camadas;
pacotes;
dependências;
domínio;
controller;
service;
repository;
ciclos;
convenções.
```

Mais importante:

```text
arquitetura agora pode falhar no pipeline.
```

Isso muda o jogo.

A arquitetura deixa de ser apenas desenho e passa a ser regra automatizada.

---

### 10.2 O que ArchUnit prepara para o futuro

ArchUnit prepara você para módulos avançados como:

```text
Clean Architecture;
Hexagonal Architecture;
DDD;
monolito modular;
microserviços;
governança técnica;
arquitetura evolutiva.
```

Quando esses temas chegarem, você já terá uma ferramenta para proteger decisões importantes.

---

## 11. O que você já consegue fazer após o M11

Depois do M11, você já consegue:

```text
criar projeto Java com Maven;
gerenciar dependências;
rodar testes automatizados;
usar JUnit, Mockito e AssertJ;
medir cobertura com JaCoCo;
gerar relatórios;
usar Git de forma mais profissional;
criar pipeline no GitHub Actions;
rodar validações em push e Pull Request;
publicar artifacts;
criar Dockerfile;
criar imagem Docker;
usar Docker Compose profissional;
subir PostgreSQL e Redis localmente;
configurar healthcheck;
criar pipeline Docker;
validar formatação com Spotless;
validar estilo com Checkstyle;
monitorar dependências com Dependabot;
gerar SBOM com CycloneDX;
testar PostgreSQL real com Testcontainers;
testar API externa fake com WireMock;
proteger arquitetura com ArchUnit;
montar mini-projeto integrando ferramentas.
```

Isso já é uma base muito acima do iniciante.

Ainda não é senioridade completa.

Mas é uma fundação profissional.

---

## 12. O que ainda falta para pleno, sênior e arquiteto

Ainda falta muita coisa.

E isso é bom.

A formação é longa porque backend profissional é profundo.

Os próximos grandes blocos serão:

```text
SQL e PostgreSQL;
modelagem relacional;
JDBC;
JPA;
Hibernate;
Spring Data;
Spring Boot;
APIs REST;
segurança;
mensageria;
resiliência;
observabilidade;
performance;
concorrência;
cloud;
Kubernetes;
DDD;
arquitetura hexagonal;
sistemas distribuídos;
projeto final;
entrevistas;
portfólio.
```

O M11 não encerra a formação.

Ele cria base operacional.

Agora você tem ferramentas para estudar os próximos módulos com mais maturidade.

---

## 13. Por que o próximo módulo é SQL

Você pode perguntar:

```text
por que não ir direto para Spring Boot?
```

Porque Spring Boot sem banco bem entendido vira uso superficial de framework.

Backend Java real depende muito de banco de dados.

Você precisa entender:

```text
tabela;
linha;
coluna;
chave primária;
chave estrangeira;
relacionamento;
normalização;
índice;
consulta;
filtro;
join;
agrupamento;
transação;
constraint;
modelo relacional;
PostgreSQL;
performance básica;
integridade de dados.
```

Sem isso, você até consegue criar endpoint.

Mas não entende o coração de muitos sistemas backend.

---

## 14. Como o M11 prepara o M12

O M11 preparou o M12 de várias formas.

### Docker Compose

Você já sabe subir PostgreSQL local.

Isso será usado no M12.

### Testcontainers

Você já sabe testar com PostgreSQL real descartável.

Isso será usado quando começarmos a testar persistência.

### Pipeline

Você já sabe validar projeto em CI.

Isso será útil para rodar testes de banco no pipeline.

### JaCoCo

Você já sabe medir cobertura.

Isso será útil para acompanhar testes de regras e persistência.

### Git

Você já sabe versionar laboratórios e commits.

Isso será usado em todo o curso.

### Docker

Você entende ambiente reproduzível.

Isso ajuda a não depender de instalação manual.

---

## 15. O que muda no M12

No M12, o foco muda.

No M11, a pergunta era:

```text
como montar, testar, empacotar e validar um projeto profissional?
```

No M12, a pergunta será:

```text
como modelar, consultar e proteger dados em um banco relacional?
```

Você vai estudar PostgreSQL com profundidade gradual.

Não será apenas:

```sql
select * from tabela;
```

A ideia será entender:

```text
por que a tabela existe;
qual coluna faz sentido;
qual tipo usar;
qual chave usar;
qual relacionamento usar;
como evitar inconsistência;
como consultar corretamente;
como pensar como backend ao modelar dados.
```

---

## 16. Mentalidade para entrar em SQL

Muita gente aprende SQL como lista de comandos.

Aqui, você deve aprender SQL como ferramenta de modelagem e raciocínio.

SQL não é apenas sintaxe.

SQL responde perguntas de negócio.

Exemplo:

```text
quais ordens estão abertas?
qual cliente tem mais ordens?
qual técnico teve mais atendimentos?
quais pagamentos estão pendentes?
qual contrato está ativo?
qual produto mais aparece nas OS?
quais registros violam regra?
```

Backend bom depende de saber conversar com dados.

---

## 17. Primeiros temas do M12

O M12 vai começar com base sólida.

Você deve esperar temas como:

```text
o que é banco de dados relacional;
o que é PostgreSQL;
schema;
database;
table;
row;
column;
data type;
primary key;
foreign key;
not null;
unique;
check;
default;
insert;
select;
update;
delete;
where;
order by;
limit;
joins;
group by;
having;
índices;
transações;
modelagem relacional.
```

A progressão será gradual.

Nada de pular direto para JPA.

Antes de ORM, você precisa entender banco.

---

## 18. Como estudar daqui para frente

A partir do M12, você deve praticar bastante.

Banco se aprende com:

```text
criar tabelas;
inserir dados;
errar constraint;
corrigir modelagem;
consultar;
fazer join;
interpretar resultado;
ver plano;
testar hipótese;
refatorar modelo.
```

Não estude SQL apenas lendo.

Execute.

Quebre.

Corrija.

Repita.

---

## 19. Revisão estratégica do M11

Se você precisar explicar o M11 em entrevista, pode dizer:

```text
No M11, eu estudei ferramentas profissionais do ecossistema Java Backend. Trabalhei com build Maven, testes com JUnit, Mockito e AssertJ, cobertura com JaCoCo, automação com GitHub Actions, Docker e Docker Compose, pipeline Maven e Docker, qualidade com Spotless e Checkstyle, segurança de dependências com Dependabot, SBOM e CycloneDX, testes de integração com Testcontainers, simulação de APIs externas com WireMock e proteção arquitetural com ArchUnit. No final, consolidei essas ferramentas em um mini-projeto integrador.
```

Isso mostra maturidade.

Você não está dizendo apenas:

```text
sei Java.
```

Você está mostrando:

```text
sei participar de um fluxo backend profissional.
```

---

## 20. Exercício prático de fechamento

### Missão

Revisar o M11 e preparar a entrada no M12.

Você deve fazer três coisas:

```text
1. Conferir se as aulas 260 a 269 estão salvas.
2. Conferir se os laboratórios principais foram criados.
3. Atualizar o diário de bordo com o fechamento do M11.
```

---

### Checklist dos laboratórios recentes

Confirme se existem:

```text
labs/m11/aula-260-docker-compose-profissional
labs/m11/aula-261-ci-cd-github-actions
labs/m11/aula-262-pipeline-maven-jacoco
labs/m11/aula-263-pipeline-docker
labs/m11/aula-264-checkstyle-spotless
labs/m11/aula-265-seguranca-dependencias
labs/m11/aula-266-testcontainers-postgresql
labs/m11/aula-267-wiremock-servicos-externos
labs/m11/aula-268-archunit-regras-arquiteturais
labs/m11/aula-269-mini-projeto-ferramentas
```

Não precisa estar tudo perfeito de primeira.

Mas você deve saber o objetivo de cada laboratório.

---

### Revisão oral

Tente explicar em voz alta:

```text
para que serve Docker Compose;
para que serve GitHub Actions;
para que serve JaCoCo;
para que serve Spotless;
para que serve Checkstyle;
para que serve SBOM;
para que serve Dependabot;
para que serve Testcontainers;
para que serve WireMock;
para que serve ArchUnit.
```

Se você consegue explicar sem decorar, aprendeu de verdade.

---

### Commit recomendado de fechamento

Se você atualizou documentação ou diário:

```bash
git status
git add docs/diario-de-bordo.md
git commit -m "Aula 270: fechamento do M11"
git status
```

Se também adicionou laboratórios pendentes:

```bash
git status
git add labs/m11
git add .github
git add docs/diario-de-bordo.md
git commit -m "Fechamento M11: ferramentas profissionais Java Backend"
git status
```

---

## 21. Checkpoint final

Responda mentalmente:

```text
1. Qual foi o objetivo do M11?
2. Por que Maven é importante?
3. Por que Git profissional importa?
4. Por que testes automatizados são indispensáveis?
5. Por que JaCoCo não garante qualidade sozinho?
6. Por que Docker ajuda no backend?
7. Por que Docker Compose prepara o M12?
8. Por que CI/CD muda a forma de trabalhar?
9. Por que artifacts são evidência?
10. Por que Spotless e Checkstyle reduzem ruído?
11. Por que dependências são risco?
12. Para que serve SBOM?
13. Para que serve Dependabot?
14. Por que Testcontainers é importante?
15. Por que WireMock é importante?
16. Por que ArchUnit é importante?
17. O que você já consegue fazer depois do M11?
18. O que ainda falta para senioridade?
19. Por que o próximo módulo deve ser SQL?
20. Como você explicaria o M11 para um tech lead?
```

Checklist curto:

```text
[ ] Entendi o papel do M11.
[ ] Revisei Docker e Docker Compose.
[ ] Revisei GitHub Actions.
[ ] Revisei Maven pipeline.
[ ] Revisei JaCoCo e artifacts.
[ ] Revisei Docker pipeline.
[ ] Revisei Spotless e Checkstyle.
[ ] Revisei SCA, SBOM e Dependabot.
[ ] Revisei Testcontainers.
[ ] Revisei WireMock.
[ ] Revisei ArchUnit.
[ ] Entendi o mini-projeto da aula 269.
[ ] Entendi por que agora vamos para SQL.
[ ] Atualizei o diário de bordo.
```

---

## 22. Fechamento oficial do M11

O M11 está concluído.

Você terminou um bloco essencial da formação.

A frase que resume o M11 é:

```text
Um backend profissional não é apenas código Java.
Ele precisa de build, testes, qualidade, versionamento, containers, pipeline, segurança, integração confiável e proteção arquitetural.
```

Agora você tem essa base.

A próxima fase será banco de dados.

E isso é fundamental.

Sem banco, backend fica superficial.

Sem modelagem, persistência vira improviso.

Sem SQL, JPA vira mágica.

Sem PostgreSQL, Spring Data vira dependência cega de framework.

Por isso, o próximo módulo será:

```text
M12 — SQL, PostgreSQL e modelagem relacional
```

A próxima aula será:

```text
271 — M12.01 — Introdução ao SQL, PostgreSQL e modelagem relacional para Java Backend
```

Nela, vamos abrir o M12 com calma, entendendo:

```text
o que é banco de dados;
o que é modelo relacional;
por que PostgreSQL;
como dados são organizados;
como uma aplicação backend depende do banco;
como pensar em tabelas, colunas, chaves e relacionamentos;
como preparar o ambiente para praticar SQL.
```

A partir daqui, você começa a entrar em um dos pilares mais importantes do backend.

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 270 — M11.26 — Fechamento do M11 e transição para SQL, PostgreSQL e modelagem relacional

Nesta aula, fechei oficialmente o M11 da formação Java Backend.

Revisei o papel das ferramentas profissionais estudadas no módulo, incluindo Maven, Git, JUnit, Mockito, AssertJ, JaCoCo, Docker, Docker Compose, GitHub Actions, pipeline Maven, pipeline Docker, Spotless, Checkstyle, SBOM, Dependabot, Testcontainers, WireMock e ArchUnit.

Entendi que o M11 não foi apenas um bloco de ferramentas isoladas, mas uma base operacional para construir, testar, validar, empacotar, proteger e automatizar projetos Java Backend com mentalidade profissional.

Também revisei como essas ferramentas se conectam em um fluxo real: o código é versionado, testado, validado, analisado, empacotado, containerizado e protegido por pipeline.

O principal aprendizado foi que um backend profissional não é apenas código Java. Ele precisa de build, testes, qualidade, versionamento, containers, CI/CD, segurança, integração confiável e proteção arquitetural.

Com o M11 concluído, estou preparado para iniciar o M12, focado em SQL, PostgreSQL e modelagem relacional, que será a base para persistência, JDBC, JPA, Hibernate, Spring Data e Spring Boot no futuro.
```
