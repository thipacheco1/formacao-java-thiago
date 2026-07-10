# 355 - M13.45 - Fechamento do Modulo 13 persistencia Java

## Apresentacao da aula

Você chegou ao encerramento do Módulo 13.

Este módulo percorreu a persistência Java desde o acesso mais explícito ao banco até uma arquitetura profissional com Spring Data JPA, migrations, concorrência, auditoria e testes reais.

A evolução foi construída em camadas:

```text
JDBC;

DataSource;

HikariCP;

transações manuais;

DAO;

Repository Pattern;

Flyway;

JPA;

Hibernate;

EntityManager;

lifecycle;

dirty checking;

relacionamentos;

fetch;

N+1;

JPQL;

Criteria API;

projections;

paginação;

locks;

auditoria;

Spring Data;

transações declarativas;

Testcontainers;

projeto integrado;

prova prática.
```

A aula anterior apresentou a prova prática de persistência baseada em um Sistema de Reservas de Equipamentos.

Agora o objetivo não é acrescentar outra tecnologia.

O objetivo é encerrar o módulo com evidências.

Você deverá confirmar:

- o que consegue explicar;
- o que consegue implementar;
- o que consegue diagnosticar;
- o que precisa revisar;
- quais artefatos entram no portfólio;
- quais critérios precisam permanecer como padrão nos próximos módulos.

Um fechamento de módulo não é apenas uma mensagem de parabéns.

Ele precisa responder:

```text
quais competências foram adquiridas?

quais comportamentos foram comprovados?

quais erros ainda aparecem?

qual é o próximo nível de abstração?

como evitar esquecer o conteúdo?
```

Nesta aula, você realizará cinco movimentos:

```text
1. corrigir a prova por evidências;

2. revisar o projeto integrado de OS;

3. montar uma matriz de competências;

4. criar um plano de remediação;

5. preparar a transição para Spring Boot.
```

O fechamento continuará usando os artefatos já criados:

```text
labs/m13/aula-351-projeto-persistencia-os-parte-1;

labs/m13/aula-354-prova-pratica-persistencia;

docs/diario-de-bordo.md.
```

Será criado um novo laboratório documental:

```text
labs/m13/aula-355-fechamento-modulo-13
```

Ele não terá novo código de produção.

Ele reunirá:

- relatório de correção;
- matriz de competências;
- evidências;
- checklist de qualidade;
- plano de revisão;
- resumo de portfólio;
- ponte para o M14.

A stack de referência do módulo foi:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data JPA 4.1.0;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

JUnit 6.1.1;

Testcontainers 2.0.5;

PostgreSQL 17.6.
```

Você aprendeu essas ferramentas sem Spring Boot.

Essa escolha foi intencional.

Antes de usar auto-configuração, você precisou entender:

- de onde vem o `DataSource`;
- quem cria o `EntityManagerFactory`;
- como o transaction manager participa;
- como repositories são descobertos;
- quando Flyway deve executar;
- por que Hibernate usa `validate`;
- como o contexto Spring é iniciado;
- como o PostgreSQL de teste é fornecido.

No próximo módulo, Spring Boot automatizará parte dessa infraestrutura.

A automação só será realmente útil porque você já conhece os componentes que ela configura.

A próxima aula será:

```text
356 - M14.01 - Spring Boot visao geral
```

Esta aula não iniciará Spring Boot ainda.

Ela preparará a mudança de módulo sem apagar o conhecimento conquistado.

---

## Onde estamos na formacao

O M13 termina nesta aula:

```text
M13.01 até M13.08:
JDBC, conexões, transações, DAO e Repository.

M13.09 até M13.13:
pool, projeto JDBC, Flyway e fundamentos JPA.

M13.14 até M13.31:
Hibernate, mappings, lifecycle, queries e paginação.

M13.32 até M13.34:
concorrência e auditoria.

M13.35 até M13.40:
Spring Data, transações, Testcontainers e migrations.

M13.41 e M13.42:
projeto completo de persistência de OS.

M13.43:
revisão técnica.

M13.44:
prova prática.

M13.45:
fechamento.
```

O M14 começará com:

```text
Spring Boot;

REST APIs;

validação;

tratamento de erros;

documentação;

testes web;

cache;

projeto backend.
```

A transição correta não é:

```text
esquecer configuração manual
e depender de magia.
```

A transição correta é:

```text
reconhecer que Spring Boot
automatiza configurações
que você já sabe explicar.
```

Nesta aula:

```text
correção por rubrica:
sim.

execução de testes:
sim.

revisão das evidências:
sim.

matriz de competências:
sim.

remediação:
sim.

portfólio:
sim.

Spring Boot em código:
não.

REST:
não.

controller:
não.

endpoint:
não.
```

O resultado final do M13 será uma decisão objetiva:

```text
APTO:
pode avançar mantendo revisão espaçada.

APTO COM RESSALVAS:
pode avançar com plano curto de remediação.

REFAZER BLOCO CRÍTICO:
deve corrigir fundamentos antes de depender de abstrações maiores.
```

Essa classificação não representa um rótulo pessoal.

Ela representa o estado atual das evidências técnicas.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-355-fechamento-modulo-13
```

Estrutura final:

```text
labs
└── m13
    └── aula-355-fechamento-modulo-13
        ├── README.md
        ├── docs
        │   ├── resultado-prova-pratica.md
        │   ├── matriz-competencias-m13.md
        │   ├── evidencias-projeto-os.md
        │   ├── checklist-qualidade-persistencia.md
        │   ├── plano-remediacao.md
        │   ├── resumo-portfolio.md
        │   └── ponte-m14.md
        ├── scripts
        │   ├── 01_validar_ambiente.ps1
        │   ├── 02_executar_projeto_os.ps1
        │   ├── 03_executar_prova.ps1
        │   ├── 04_coletar_evidencias.ps1
        │   └── 05_validar_repositorio.ps1
        └── templates
            ├── rubrica-correcao.md
            ├── registro-defeito.md
            └── plano-revisao-30-dias.md
```

Ao final, você deverá possuir:

```text
nota calculada pela rubrica;

itens obrigatórios verificados;

falhas reproduzidas;

correções registradas;

competências classificadas;

plano de revisão;

artefatos escolhidos para portfólio;

commit de fechamento;

ponte documentada para o M14.
```

O fechamento não exige que a prova esteja perfeita na primeira execução.

Ele exige honestidade técnica.

Se um teste falhar:

1. registre o teste;
2. registre a causa;
3. corrija;
4. execute novamente;
5. preserve a evidência final;
6. descreva o aprendizado.

Não altere a rubrica para transformar uma falha em sucesso.

---

## Conceito essencial

### Competencia nao e exposicao ao conteudo

Ter assistido a uma aula não prova competência.

Competência técnica aparece quando você consegue:

```text
explicar;

implementar;

testar;

diagnosticar;

corrigir;

justificar.
```

Exemplo:

```text
Conhecer @Version:
saber que a annotation existe.

Dominar @Version:
explicar o SQL;
criar duas transações;
reproduzir conflito;
preservar o vencedor;
traduzir a exception.
```

O fechamento usará esse padrão.

---

### Evidencia forte e evidencia fraca

Evidência fraca:

```text
o código parece correto;

a annotation está presente;

o método foi criado;

o Main imprimiu algo.
```

Evidência forte:

```text
migration aplicada em PostgreSQL vazio;

constraint falhou no banco real;

rollback confirmado em nova transação;

query budget validado;

duas transações reproduziram conflito;

estado final ficou limpo;

mvn clean verify terminou com sucesso.
```

A matriz de competências deve usar evidências fortes sempre que possível.

---

### Correcao da prova pratica

A prova possui 100 pontos.

A correção deve seguir a rubrica oficial:

```text
estrutura e configuração:
10.

migrations e schema:
15.

modelo JPA:
15.

repositories e consultas:
15.

services e transações:
15.

concorrência:
10.

testes:
15.

documentação:
5.
```

Não atribua nota por esforço.

A nota mede o artefato entregue.

O esforço será considerado no plano de aprendizado, não na pontuação funcional.

---

### Itens eliminatorios

Antes de calcular a nota, valide:

- projeto compila;
- migrations aplicam;
- PostgreSQL real foi usado;
- Testcontainers foi usado;
- transação existe no caso de uso;
- conflito de período foi tratado;
- testes existem;
- Flyway é dono do schema;
- segredos não foram commitados.

Se um item eliminatório falhar, o resultado não pode ser classificado como aprovado, mesmo que a soma parcial seja alta.

Primeiro corrija o bloqueio.

Depois execute a rubrica novamente.

---

### Correcao por comportamento

Para cada critério, use um dos estados:

```text
COMPROVADO;

PARCIAL;

NAO COMPROVADO;

NAO APLICAVEL.
```

`NAO APLICAVEL` só pode ser usado quando a própria rubrica permite.

Não use para evitar implementar um requisito.

Pontuação sugerida:

```text
COMPROVADO:
100% do item.

PARCIAL:
50% do item.

NAO COMPROVADO:
0%.

NAO APLICAVEL:
redistribuição somente quando autorizada.
```

---

### Registro de defeito

Cada falha relevante deve gerar um registro.

Formato:

```text
ID:
M13-FECHA-001.

Sintoma:
teste concorrente permitiu duas Reservas.

Evidência:
duas linhas ativas para o mesmo Equipamento e período.

Camada:
transação e concorrência.

Causa:
consulta de conflito executada sem lock comum.

Correção:
bloquear Equipamentos em ordem crescente.

Teste preventivo:
ConflitoConcorrenteIT.

Status:
corrigido e validado.
```

Esse registro transforma erro em conhecimento reutilizável.

---

### Matriz de competencias

A matriz terá quatro níveis:

```text
N0:
não consigo explicar.

N1:
explico com consulta.

N2:
implemento com apoio.

N3:
implemento, testo e diagnostico.
```

Competências obrigatórias:

```text
JDBC;

DataSource e pool;

transação;

DAO e Repository;

Flyway;

JPA e Hibernate;

lifecycle;

relacionamentos;

fetch e N+1;

queries;

projections;

paginação;

locks;

auditoria;

Spring Data;

transações declarativas;

Testcontainers;

migrations evolutivas;

arquitetura do projeto.
```

Para avançar com segurança:

```text
nenhuma competência crítica em N0;

JPA lifecycle em N2 ou N3;

transações em N2 ou N3;

migrations em N2 ou N3;

testes reais em N2 ou N3;

concorrência em pelo menos N2.
```

---

### Competencias criticas

Algumas lacunas geram efeito cascata.

São críticas:

```text
transação;

lifecycle;

relacionamentos;

fetch;

migrations;

concorrência;

teste de integração.
```

Se você não entende transação, terá dificuldade com:

- dirty checking;
- rollback;
- locks;
- auditoria;
- afterCommit;
- bulk;
- Testcontainers.

Por isso, o plano de remediação começa pelas dependências fundamentais.

---

### Revisao do projeto de OS

O projeto de OS deve ser avaliado por categorias.

Modelo:

```text
aggregate root coerente;

Atividade dentro do lifecycle;

Técnico externo;

Pagamento explícito;

histórico separado da auditoria.
```

Persistência:

```text
Flyway;

Hibernate validate;

@Version;

LAZY;

cascade controlado;

constraints.
```

Aplicação:

```text
services transacionais;

commands imutáveis;

results sem entidades;

queries read-only.
```

Testes:

```text
migrations;

mapping;

rollback;

N+1;

optimistic lock;

fluxo completo.
```

O projeto de OS é um artefato de portfólio se puder ser executado por outra pessoa.

---

### Criterio de portabilidade do projeto

Um repositório de portfólio deve possuir:

- README claro;
- stack;
- arquitetura;
- modelo relacional;
- comandos;
- migrations;
- testes;
- Docker/Testcontainers;
- decisões;
- limitações;
- licença ou indicação de estudo;
- ausência de segredos.

Evite publicar:

- arquivos locais;
- logs internos;
- nomes corporativos reais;
- credenciais;
- dados pessoais;
- cópias de demandas protegidas.

O domínio de estudo deve permanecer genérico.

---

### Resumo de portfolio

O resumo profissional do projeto pode ser:

```text
Projeto de persistência Java 21 para gestão de Ordens de Serviço,
configurado sem Spring Boot para demonstrar domínio da infraestrutura.
Utiliza Spring Framework, Spring Data JPA, Hibernate, PostgreSQL,
Flyway, HikariCP, JUnit e Testcontainers. O projeto implementa
agregados auditáveis e versionados, transações, controle otimista,
queries derivadas, JPQL, projections, views operacionais, migrations
e testes de integração reproduzíveis.
```

Esse texto descreve competências sem exagerar resultados.

---

### Plano de remediacao

Uma lacuna deve produzir uma tarefa concreta.

Exemplo ruim:

```text
revisar JPA.
```

Exemplo bom:

```text
reexecutar o laboratório de lifecycle;

desenhar estados;

criar teste de merge;

explicar por que o retorno deve ser usado;

concluir até a próxima sessão de estudo.
```

Cada tarefa terá:

- competência;
- evidência ausente;
- ação;
- artefato;
- prazo de estudo;
- critério de conclusão.

---

### Revisao espacada

O conhecimento de persistência é extenso.

Use ciclos:

```text
D+1:
revisão curta da matriz.

D+7:
executar testes centrais.

D+15:
resolver um diagnóstico sem consulta.

D+30:
reimplementar um pequeno fluxo.
```

Testes centrais para D+7:

```text
rollback;

N+1;

optimistic lock;

migration upgrade;

query paginada;

Testcontainers.
```

---

### Padroes que devem continuar no M14

Ao iniciar APIs REST, preserve:

```text
Flyway como dono do schema;

Hibernate validate;

service transacional;

results/DTOs fora da entidade;

LAZY por padrão;

projection para lista;

@Version em mutáveis;

Testcontainers para repository;

constraints no banco;

auditoria explícita;

segredos fora do Git.
```

Spring Boot não invalida nenhum desses critérios.

Ele reduz configuração repetitiva.

---

### O que Spring Boot vai automatizar

No próximo módulo, você verá mecanismos que podem criar ou configurar:

- `DataSource`;
- HikariCP;
- `EntityManagerFactory`;
- `JpaTransactionManager`;
- scanning;
- repositories;
- Flyway;
- Jackson;
- servidor web;
- métricas básicas.

A pergunta profissional será:

```text
qual auto-configuração foi aplicada
e como substituí-la quando necessário?
```

Você já conhece a resposta estrutural porque montou os componentes manualmente.

---

### O que nao levar para o M14

Não leve hábitos como:

- retornar entidade diretamente no controller;
- abrir transação no controller;
- usar `findAll` sem limite;
- expor exception do banco;
- deixar Hibernate criar schema;
- usar EAGER para “resolver” sessão fechada;
- ignorar query count;
- testar repository com mock;
- colocar senha em properties commitado.

O M14 adicionará HTTP.

Ele não elimina as responsabilidades de persistência.

---

### Classificacao final

Use a nota e a matriz.

#### APTO

Condições:

```text
70 pontos ou mais;

nenhum eliminatório;

nenhuma competência crítica em N0;

testes centrais verdes.
```

#### APTO COM RESSALVAS

Condições:

```text
70 pontos ou mais;

nenhum eliminatório;

uma ou duas competências críticas em N1;

plano de remediação criado.
```

#### REFAZER BLOCO CRITICO

Condições:

```text
menos de 70;

ou item eliminatório;

ou transação/lifecycle/migration em N0.
```

A classificação deve ser recalculada depois das correções.

---

### Dependencias entre as competencias

As competências do módulo não são independentes.

Elas formam uma cadeia:

```text
conexão
    -> transação
        -> persistence context
            -> lifecycle
                -> dirty checking
                    -> fetch
                        -> queries
                            -> concorrência
                                -> testes.
```

Quando uma base está fraca, sintomas aparecem em vários pontos.

Exemplo:

```text
lacuna:
não entender persistence context.

efeitos:
save redundante;
merge usado incorretamente;
LazyInitializationException;
entidade detached alterada sem persistência;
teste que consulta estado antigo;
confusão entre clear e rollback.
```

Por isso, a remediação deve atacar a causa mais profunda.

Não comece revisando uma query específica se o problema real é transação ausente.

---

### Criterio de prontidao para o M14

O M14 adicionará camada web, serialização, validação e contratos HTTP.

Antes de avançar, você precisa executar mentalmente um fluxo como:

```text
requisição chega;

controller recebe DTO;

service abre transação;

repository busca entidades;

domínio altera estado;

Hibernate executa flush;

Flyway já garantiu o schema;

commit confirma;

controller devolve response.
```

Você está pronto quando consegue apontar:

- onde a transação começa;
- qual entidade fica managed;
- quando uma associação lazy pode carregar;
- qual exception deve ser traduzida;
- quando a resposta deve usar DTO;
- como o teste de repository difere do teste do controller;
- por que migration não pertence ao endpoint.

O M14 adicionará HTTP ao redor desse núcleo.

Ele não substituirá o núcleo.

---

### Defesa tecnica do projeto

Prepare uma defesa de dez minutos do projeto de OS.

Roteiro:

```text
1. problema resolvido;

2. aggregate root;

3. decisões de cascade;

4. schema e migrations;

5. fronteira transacional;

6. consultas de detalhe e lista;

7. concorrência;

8. auditoria e histórico;

9. estratégia de testes;

10. limitações.
```

A defesa precisa citar evidências.

Exemplo:

```text
Decisão:
Cliente não recebe cascade.

Evidência:
mapping ManyToOne sem cascade;
teste de arquitetura;
foreign key;
cenário de abertura usando Cliente existente.
```

Se uma decisão não possui evidência, registre-a como lacuna.

---

### Antipadroes de persistencia que agora devem ser reconhecidos

Você deve identificar rapidamente:

```text
EntityManager criado por operação sem fechamento;

conexão aberta fora de try-with-resources;

autoCommit ignorado;

SQL concatenado;

repository com regra de negócio;

cascade ALL em cadastro mestre;

EAGER em todas as associações;

toString navegando em coleção lazy;

findAll em tabela grande;

Page sem ordem estável;

count query com filtros diferentes;

save redundante em managed;

merge com retorno ignorado;

bulk sem clear;

@Version ausente em entidade concorrente;

@Transaction no controller;

self-invocation esperando REQUIRES_NEW;

migration aplicada editada;

Hibernate update em ambiente controlado por Flyway;

repository test com mock;

teste de integração usando H2 para query PostgreSQL.
```

O reconhecimento desses sinais é parte da competência profissional.

---

### Inventario final de artefatos

Ao encerrar o módulo, registre os principais artefatos produzidos.

Categorias:

```text
laboratórios JDBC;

laboratórios JPA;

laboratórios Spring Data;

projeto de OS;

prova prática;

documentação de revisão;

diário de bordo.
```

Para cada artefato, informe:

- caminho;
- objetivo;
- tecnologia central;
- teste principal;
- decisão mais importante;
- melhoria futura.

Esse inventário facilita revisão e portfólio.

---

### Indicadores de uma entrega profissional

Uma entrega de persistência madura possui sinais observáveis:

```text
migrations pequenas e nomeadas;

constraints coerentes;

mappings sem cascade acidental;

services com transação clara;

queries separadas por caso de uso;

listagens por projection;

concorrência testada;

auditoria consistente;

README executável;

suíte limpa e determinística.
```

Também possui limites documentados.

Exemplo:

```text
não possui API ainda;

não possui autenticação;

não possui observabilidade distribuída;

não possui mensageria;

não possui deploy em nuvem.
```

Declarar limites não diminui o projeto.

Aumenta a credibilidade.

---

### Sinais de que uma lacuna foi realmente corrigida

Uma lacuna não está corrigida apenas porque o texto foi relido.

Considere corrigida quando você consegue:

1. explicar sem consulta;
2. implementar um exemplo pequeno;
3. criar teste que falha antes;
4. aplicar a correção;
5. observar o teste passar;
6. explicar o SQL;
7. registrar a decisão.

Exemplo para N+1:

```text
explicar o padrão;

reproduzir 1 + N;

contar statements;

aplicar projection ou join fetch;

confirmar orçamento;

documentar por que a solução serve ao caso.
```

Esse será o padrão de conclusão das tarefas de remediação.


## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-355-fechamento-modulo-13\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-355-fechamento-modulo-13\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-355-fechamento-modulo-13\templates"
```

Crie o README com objetivo, artefatos e ordem de execução.

---

### 2. Validar o ambiente

O script `01_validar_ambiente.ps1` executa:

```powershell
java -version
mvn -version
docker version
docker info
git status
```

Ele deve falhar com mensagem clara quando Docker não estiver disponível.

Não altere o ambiente automaticamente.

---

### 3. Executar o projeto de OS

O script `02_executar_projeto_os.ps1` entra no projeto das aulas 351 e 352.

Execute:

```powershell
mvn clean verify
```

Depois execute o `Main`.

Registre:

- build;
- quantidade de testes;
- tempo;
- imagem PostgreSQL;
- última migration;
- estado final.

---

### 4. Executar a prova

O script `03_executar_prova.ps1` entra no laboratório da aula 354.

Execute:

```powershell
mvn clean verify
```

Se a implementação ainda não foi concluída, registre o estado real.

Não gere `BUILD SUCCESS` fictício.

---

### 5. Validar itens eliminatorios

Crie uma tabela em `resultado-prova-pratica.md`.

Colunas:

```text
item;

comando ou teste;

resultado;

evidência;

ação.
```

Somente depois calcule a nota.

---

### 6. Aplicar a rubrica

Copie a rubrica oficial da aula 354.

Para cada subitem:

- atribua estado;
- informe pontos;
- cite teste, arquivo ou comando;
- registre defeito quando necessário.

Calcule o total sem arredondamento oportunista.

---

### 7. Corrigir um defeito por vez

Prioridade:

1. compilação;
2. migration;
3. transação;
4. conflito;
5. testes;
6. queries;
7. documentação.

Depois de cada correção:

```powershell
mvn -Dtest=NomeDoTeste test
mvn clean verify
```

Não faça várias alterações sem uma execução intermediária.

---

### 8. Criar matriz de competencias

Em `matriz-competencias-m13.md`, registre cada competência com:

```text
nível;

evidência;

lacuna;

próxima ação.
```

Não atribua N3 apenas porque o projeto possui uma classe relacionada.

N3 exige implementação, teste e diagnóstico.

---

### 9. Revisar o projeto de OS

Use `evidencias-projeto-os.md`.

Escolha uma evidência para cada grupo:

- migrations;
- agregado;
- transação;
- auditoria;
- optimistic lock;
- queries;
- projections;
- Testcontainers;
- fluxo completo.

Inclua caminhos de arquivos e nomes de testes.

---

### 10. Criar checklist de qualidade

O checklist deve conter:

```text
schema;

mapping;

transação;

fetch;

queries;

concorrência;

auditoria;

testes;

segurança de configuração;

documentação.
```

Marque somente o que foi executado.

---

### 11. Criar plano de remediacao

Para todas as competências N0 ou N1, crie tarefas.

Limite o plano inicial a cinco tarefas de maior impacto.

Cada tarefa precisa caber em uma sessão de estudo.

---

### 12. Criar resumo de portfolio

Em `resumo-portfolio.md`, inclua:

- problema;
- stack;
- arquitetura;
- recursos;
- testes;
- aprendizados;
- como executar.

Não publique antes de remover referências privadas.

---

### 13. Criar ponte para o M14

Em `ponte-m14.md`, responda:

1. quais beans foram configurados manualmente;
2. quais podem ser auto-configurados;
3. quais decisões continuam sob responsabilidade do desenvolvedor;
4. quais riscos permanecem;
5. o que você espera aprender no M14.

---

### 14. Executar validacao final do repositorio

O script `05_validar_repositorio.ps1` verifica:

```powershell
git status
git diff --check
```

Também pesquisa:

```text
password;

secret;

application.local.env;

target;

logs.
```

A pesquisa não substitui revisão manual.

---

### 15. Classificar o resultado

Use:

```text
APTO;

APTO COM RESSALVAS;

REFAZER BLOCO CRITICO.
```

Registre a justificativa por evidências.

Não use a classificação como julgamento pessoal.

---

### 16. Atualizar o diario

Adicione o bloco fornecido no material complementar.

Inclua a classificação real e as principais lacunas no texto ao redor do bloco, sem inventar resultados.

---

## Entendendo o que foi feito

### O modulo terminou com evidencias

A conclusão não dependeu apenas da quantidade de aulas assistidas.

### A prova virou instrumento de diagnostico

A rubrica mostrou forças e lacunas.

### O projeto virou portfolio

Arquitetura, execução e testes foram organizados para leitura externa.

### Os erros viraram tarefas

Falhas deixaram de ser observações vagas e passaram a possuir ações verificáveis.

### A transicao para Boot ficou consciente

Você sabe quais componentes serão automatizados e quais decisões continuam suas.

---

## Erros comuns importantes

### Inflar a nota

A rubrica perde valor quando não corresponde às evidências.

### Corrigir a prova sem registrar a causa

O erro pode reaparecer em outro domínio.

### Publicar projeto com segredo

Revise arquivos locais e histórico antes do portfólio.

### Avancar com transacao em N0

Spring Boot esconderá configuração, mas não corrigirá entendimento.

### Tratar Boot como substituto de JPA

Boot configura; JPA, Hibernate, SQL e banco continuam existindo.

---

## Comandos uteis

### Validar ambiente

```powershell
java -version
mvn -version
docker version
docker info
```

### Projeto de OS

```powershell
Set-Location `
  "labs\m13\aula-351-projeto-persistencia-os-parte-1"

mvn clean verify
```

### Prova

```powershell
Set-Location `
  "labs\m13\aula-354-prova-pratica-persistencia"

mvn clean verify
```

### Git

```powershell
git status
git diff
git diff --check
git log -10 --oneline
```

### Buscar arquivos locais

```powershell
Get-ChildItem -Recurse -Force |
  Where-Object {
      $_.Name -match "local|secret|password"
  }
```

---

## Exercicio guiado

### Parte 1 — Defesa de cinco minutos

Explique sem abrir o código:

- diferença entre JPA e Hibernate;
- managed e detached;
- flush e commit;
- LAZY e join fetch;
- optimistic e pessimistic lock.

### Parte 2 — SQL previsto

Escolha o fluxo de conclusão da OS.

Escreva os SELECTs, UPDATEs e INSERTs esperados.

Compare com o inspector.

### Parte 3 — Defeito real

Escolha um teste que falhou durante o módulo.

Crie registro completo de defeito e teste preventivo.

### Parte 4 — Refatoracao segura

Escolha uma query longa.

Explique se deve permanecer derivada, virar JPQL, Criteria, projection ou native.

### Parte 5 — Migration

Desenhe add, backfill e NOT NULL para uma coluna obrigatória.

### Parte 6 — Portfolio

Peça para outra pessoa seguir o README sem sua ajuda.

Registre qualquer passo implícito.

### Parte 7 — Revisao em 30 dias

Crie o calendário D+1, D+7, D+15 e D+30.

### Parte 8 — Carta para o M14

Escreva dez linhas explicando o que espera que Spring Boot automatize e o que continuará verificando manualmente.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- fechamento do M13 foi entregue;
- continuidade com a aula 354 foi preservada;
- ponte para M14 foi criada;
- conteúdo de Spring Boot não foi antecipado;
- laboratório de fechamento foi definido;
- relatório da prova foi definido;
- rubrica foi aplicada por evidências;
- pontuação não foi inflada;
- itens eliminatórios foram verificados;
- compilação foi verificada;
- migrations foram verificadas;
- PostgreSQL real foi verificado;
- Testcontainers foi verificado;
- transação foi verificada;
- conflito concorrente foi verificado;
- testes foram verificados;
- Flyway como dono foi verificado;
- segredos foram verificados;
- estados COMPROVADO, PARCIAL e NAO COMPROVADO foram definidos;
- registro de defeito foi criado;
- causa foi registrada;
- correção foi registrada;
- teste preventivo foi registrado;
- matriz de competências foi criada;
- níveis N0 a N3 foram definidos;
- competências críticas foram identificadas;
- JDBC foi classificado;
- DataSource e pool foram classificados;
- transações foram classificadas;
- DAO e Repository foram classificados;
- Flyway foi classificado;
- JPA e Hibernate foram classificados;
- lifecycle foi classificado;
- relacionamentos foram classificados;
- fetch e N+1 foram classificados;
- queries foram classificadas;
- projections foram classificadas;
- paginação foi classificada;
- locks foram classificados;
- auditoria foi classificada;
- Spring Data foi classificado;
- transações declarativas foram classificadas;
- Testcontainers foi classificado;
- migrations evolutivas foram classificadas;
- arquitetura do projeto foi classificada;
- nenhuma competência crítica em N0 foi definida como meta;
- projeto de OS foi reexecutado;
- migrations do projeto foram evidenciadas;
- agregado foi evidenciado;
- rollback foi evidenciado;
- auditoria foi evidenciada;
- optimistic lock foi evidenciado;
- N+1 foi evidenciado;
- projections foram evidenciadas;
- fluxo completo foi evidenciado;
- checklist de qualidade foi criado;
- plano de remediação foi criado;
- tarefas de remediação foram concretas;
- tarefas foram priorizadas;
- revisão espaçada foi planejada;
- resumo de portfólio foi criado;
- README externo foi considerado;
- referências privadas foram proibidas;
- segredos foram proibidos;
- stack foi documentada;
- arquitetura foi documentada;
- limitações foram documentadas;
- padrões que continuam no M14 foram listados;
- DataSource auto-configurável foi reconhecido;
- HikariCP auto-configurável foi reconhecido;
- EntityManagerFactory auto-configurável foi reconhecido;
- transaction manager auto-configurável foi reconhecido;
- Flyway auto-configurável foi reconhecido;
- responsabilidade de modelagem permaneceu com o desenvolvedor;
- responsabilidade de SQL permaneceu com o desenvolvedor;
- responsabilidade de transação permaneceu com o desenvolvedor;
- responsabilidade de segurança permaneceu com o desenvolvedor;
- hábitos perigosos foram listados;
- classificação APTO foi definida;
- classificação APTO COM RESSALVAS foi definida;
- classificação REFAZER BLOCO CRITICO foi definida;
- validação final do repositório foi planejada;
- arquivos locais foram revisados;
- diário de bordo foi atualizado;
- commit recomendado foi definido;
- ponte para a aula 356 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione o fechamento:

```powershell
git add `
  labs/m13/aula-355-fechamento-modulo-13 `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "docs(m13): concluir modulo de persistencia java"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua no commit:

- arquivos locais;
- outputs `target`;
- logs;
- senhas;
- dumps;
- relatórios com dados privados.

---

## Fechamento e ponte para a proxima aula

O Módulo 13 foi construído para retirar a persistência da categoria de “magia do framework”.

Você aprendeu a enxergar:

```text
conexão;

transação;

SQL;

mapping;

lifecycle;

fetch;

concorrência;

schema;

teste.
```

O percurso começou com JDBC.

Depois avançou para JPA e Hibernate.

Spring Data reduziu boilerplate, sem remover as responsabilidades anteriores.

Flyway organizou a evolução do banco.

Testcontainers tornou o teste reproduzível.

O projeto de OS reuniu essas decisões.

A prova de Reservas avaliou transferência de conhecimento.

O fechamento transformou o resultado em:

- nota;
- evidência;
- competência;
- plano;
- portfólio.

As competências centrais do módulo são:

```text
conectar Java ao PostgreSQL;

controlar transações;

mapear agregados;

entender managed e detached;

usar dirty checking conscientemente;

controlar fetch;

detectar N+1;

criar consultas adequadas;

paginar com ordem estável;

proteger concorrência;

auditar alterações;

evoluir schema;

testar com banco real.
```

A próxima aula será:

```text
356 - M14.01 - Spring Boot visao geral
```

No M14, você começará a construir APIs REST profissionais.

Spring Boot fornecerá convenções e auto-configuração.

Entretanto, você continuará verificando:

```text
qual DataSource existe;

qual pool está ativo;

qual migration executou;

qual transação envolve o caso de uso;

qual SQL foi gerado;

qual query está paginada;

qual entidade está managed;

qual teste usa banco real.
```

A ponte correta é:

```text
M13:
entender e controlar persistência.

M14:
usar Spring Boot para entregar backend web
sem perder esse controle.
```

Você não encerra o M13 deixando persistência para trás.

Você leva a persistência como fundação para todo backend que será construído a partir de agora.

---

# Material complementar

## Checkpoint final

- [ ] Corrigi a prova usando evidências.
- [ ] Reexecutei o projeto de OS.
- [ ] Classifiquei todas as competências.
- [ ] Criei plano para as lacunas.
- [ ] Preparei portfólio e transição para o M14.

---

## Checklist de saida do M13

### Fundamentos

- [ ] Sei explicar JDBC, DataSource e pool.
- [ ] Sei controlar commit e rollback.
- [ ] Sei diferenciar DAO e Repository.

### JPA e Hibernate

- [ ] Sei explicar lifecycle.
- [ ] Sei usar persist, find, merge e remove.
- [ ] Sei explicar dirty checking.
- [ ] Sei controlar relacionamentos e cascade.
- [ ] Sei diagnosticar fetch e N+1.

### Consultas e concorrencia

- [ ] Sei escolher derivada, JPQL, Criteria, projection ou native.
- [ ] Sei paginar com ordenação estável.
- [ ] Sei usar optimistic e pessimistic lock.
- [ ] Sei diferenciar lock de constraint unique.

### Infraestrutura

- [ ] Sei usar Flyway.
- [ ] Sei manter Hibernate em validate.
- [ ] Sei testar repository com Testcontainers.
- [ ] Sei configurar transações Spring.

### Projeto

- [ ] Sei definir aggregate root.
- [ ] Sei separar entidade de result.
- [ ] Sei criar migrations e testes.
- [ ] Sei explicar as decisões.

---

## Plano de revisao de 30 dias

```text
D+1:
ler matriz e diário.

D+7:
executar seis testes centrais.

D+15:
resolver dois diagnósticos sem consultar aula.

D+30:
implementar pequeno cadastro auditado e versionado.
```

Os seis testes centrais:

```text
rollback transacional;

query budget de N+1;

optimistic locking;

upgrade de migration;

paginação com count;

repository em Testcontainers.
```

---

## Perguntas finais do modulo

1. O que o pool resolve?
2. Onde começa a transação?
3. Qual diferença entre JPA e Hibernate?
4. O que torna uma entidade managed?
5. Por que merge retorna outra referência?
6. Quando dirty checking gera update?
7. Flush confirma a transação?
8. Quando usar cascade?
9. Como detectar N+1?
10. Quando usar projection?
11. Como ordenar uma página?
12. O que `@Version` protege?
13. Quando usar lock pessimista?
14. O que auditoria não substitui?
15. Quem cria o schema?
16. Por que migration aplicada não deve mudar?
17. O que Spring Data abstrai?
18. Por que service define a transação?
19. Por que Testcontainers é necessário?
20. O que Spring Boot mudará?

---

## Roteiro de resposta

1. Reuso e gestão de conexões.
2. No service do caso de uso.
3. Especificação e provider.
4. Presença no persistence context.
5. Merge copia para uma managed.
6. No flush com mudança detectada.
7. Não.
8. Dentro do lifecycle do agregado.
9. Contando SQL em integração.
10. Em leitura especializada.
11. Com ordem determinística e desempate.
12. Lost update de entidade existente.
13. Quando precisa reservar antes da escrita.
14. Histórico de negócio.
15. Flyway.
16. Por checksum e rastreabilidade.
17. Boilerplate de repository.
18. Para coordenar a unidade de trabalho.
19. Para testar PostgreSQL real.
20. Auto-configuração e convenções.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 355 - M13.45 - Fechamento do Modulo 13 persistencia Java

- Concluí o Módulo 13 de persistência Java.
- Corrigi a prova prática por evidências.
- Validei os itens eliminatórios.
- Reexecutei o projeto integrado de OS.
- Registrei falhas com causa, correção e teste preventivo.
- Criei uma matriz de competências de N0 a N3.
- Classifiquei JDBC, JPA, Hibernate, Spring Data e Flyway.
- Classifiquei lifecycle, transações, fetch e concorrência.
- Classifiquei auditoria, queries, projections e paginação.
- Classifiquei Testcontainers e migrations evolutivas.
- Identifiquei competências críticas.
- Criei um plano de remediação objetivo.
- Planejei revisão espaçada em D+1, D+7, D+15 e D+30.
- Criei checklist final de qualidade.
- Organizei evidências do projeto de OS.
- Preparei um resumo de portfólio.
- Revisei arquivos locais e segredos.
- Reforcei Flyway como dono do schema.
- Reforcei Hibernate em `validate`.
- Reforcei transação na camada de serviço.
- Reforcei LAZY e fetch por caso de uso.
- Reforcei projections para listagens.
- Reforcei `@Version` e testes concorrentes.
- Reforcei Testcontainers para repositories.
- Entendi o que Spring Boot poderá auto-configurar.
- Mantive comigo a responsabilidade por modelagem, SQL e transação.
- Próxima aula: Spring Boot visao geral.
```

---

## Referencia tecnica curta

```text
JDBC:
fundação.

JPA:
lifecycle.

Hibernate:
provider.

Spring Data:
repositories.

Flyway:
schema.

Transactional:
unidade de trabalho.

Version:
concorrência.

Projection:
leitura.

Testcontainers:
evidência.

Spring Boot:
próxima abstração.
```

Regra final:

```text
o fechamento do Modulo 13 deve transformar aulas, projeto e prova em evidencias de competencia: a persistencia profissional exige dominio de conexao, transacao, lifecycle, mappings, fetch, consultas, concorrencia, auditoria, migrations e testes reais; Spring Boot podera automatizar configuracoes no proximo modulo, mas a responsabilidade por modelagem, SQL, integridade, desempenho e diagnostico continua sendo do desenvolvedor backend.
```
